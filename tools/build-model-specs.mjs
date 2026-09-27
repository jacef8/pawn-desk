#!/usr/bin/env node
/* THE PRODUCT FACTS, DERIVED RATHER THAN REMEMBERED.
 *
 *   python3 -m http.server 8099 &
 *   node tools/build-model-specs.mjs          # report only
 *   node tools/build-model-specs.mjs --write  # write MODEL_SPEC into app.js
 *
 * "Use manufacturer specs and fill in the rest."
 *
 * The danger in filling 400 facts is that I would be typing them from
 * memory, and a wrong fact is worse than a question - a question gets
 * answered by somebody holding the thing, a wrong fact just quietly
 * prices it. So almost nothing here is remembered. Two sources only:
 *
 *   RULES  - the fact is in the row's own name. "PlayStation 5 disc" is a
 *            disc console because it says so; "DeWalt 20V drill kit" is a
 *            20V tool because it says so. These are auditable: the rule is
 *            a regex you can read, and it either matches the name or it
 *            does not.
 *   TABLE  - a short hand-written list for facts that are genuinely
 *            manufacturer spec and genuinely not in the name, like a Glock
 *            19 being a compact frame.
 *
 * Every value produced is checked against the live option list before it
 * is written, so a renamed option cannot slip through as a wrong answer -
 * it just goes back to being asked.
 *
 * What is NOT filled, on purpose: anything about the individual item.
 * Controllers, case condition, carrier lock, box and papers, what came in
 * the kit, whether it starts. Those need the thing on the counter.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
import {readFileSync, writeFileSync} from "node:fs";
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

/* Questions that are about the ITEM, never the model. Listed by hand and
   kept short, because getting this wrong is the whole risk: a record that
   answers "Two controllers" has decided what is in the box without
   looking in it. */
const ITEM_ONLY = new Set(["Controllers","Case","Lock","Papers","Package",
  "What came with it","Does it start?","Optics mounted","Age","Features",
  "Hours","Title","Extras","Start","Level"]);
/* THE SAME LABEL IS NOT THE SAME QUESTION EVERYWHERE. "Setup" on a welder
   is 110V against 220V, which the model decides. "Setup" on a compound bow
   is "ready-to-hunt package" against "bare bow", which is what somebody
   walked in carrying. A by-label exclusion list gets one of those two
   wrong, so these are excluded by the row they appear on. */
const ITEM_ONLY_FOR = [
  [/bow|mathews|hoyt|bear |pse |diamond archery/i, "Setup"],
];

const N = s => " " + String(s).toLowerCase().replace(/[^a-z0-9.+]+/g, " ").trim() + " ";

/* label -> [regex on the row name, option text] */
const RULES = {
  "Version": [
    [/\bdisc\b/,                         "Current gen, disc"],
    [/\bdigital\b|series s\b/,           "Current gen, digital"],
    [/playstation 4|ps4|xbox one|wii u|switch lite/, "Previous gen"],
  ],
  "Battery platform": [
    [/\b12v\b/,                          "12V"],
    [/\b36v\b|\b40v\b|\b60v\b|flexvolt/, "36V+"],
    [/\b18v\b|\b20v\b|\bm18\b|one\s*\+|lxt/, "18 / 20V"],
  ],
  "Gauge": [
    [/\b12\s*ga\b/, "12 ga"], [/\b20\s*ga\b/, "20 ga"],
    [/\b16\s*ga\b/, "16 ga"], [/\b28\s*ga\b/, "28 ga"], [/\.?410\b/, ".410"],
  ],
  "Caliber": [
    [/\b10mm\b|45.70|\b357\b|\b44\s*mag/, "Desirable (10mm, .45-70…)"],
    [/\b9mm\b|\b223\b|\b308\b|5.56|\b22lr\b|\b22\s*lr\b|\b40\b|\b45\s*acp\b|\b380\b|\b30.06\b|\b270\b|6.5/, "Common (9mm, .223, .308…)"],
  ],
  "Movement": [
    [/eco.?drive|solar|\bquartz\b|chronograph\b(?!.*auto)/, "Quartz"],
    [/\bautomatic\b|\bauto\b|skx|srpd|seiko 5|turtle|presage|orient/, "Automatic"],
  ],
  "Fuel":   [[/\belectric\b/, "Electric"], [/\bgas\b|\bgasoline\b/, "Gas"]],
  "Drive":  [[/self.?propel/, "Self-propelled"], [/\bpush\b/, "Gas push"]],
  "Deck":   [[/\b26\s*in|\b28\s*in|wide.?area/, "Wide-area 26 in +"],
             [/\b20\s*in|\b21\s*in|\b22\s*in/, "Standard 20–22 in"]],
  "Type":   [[/\b3.9x|\b2.7x|\b3.5.10/, "Standard 3-9x class"],
             [/\b4.16|\b6.24|\b5.25|\b4.12/, "High-mag 4-16x+"],
             [/\bfixed\b|\b4x32\b|\b6x42\b/, "Fixed / oddball"],
             [/in.?line/, "In-line (modern)"], [/sidelock|hawken|flintlock/, "Sidelock / traditional"]],
  "Setup":  [[/\b220\b|\b240\b/, "220/240V"], [/flux.?core|\bflux\b/, "Flux-core only"],
             [/\b110\b|\b120\b|mig/, "110V, gas-ready MIG"]],
  "Size":   [[/party/, "Party-size"], [/portable|mini|\bgo\b|flip/, "Standard portable"]],
  "Class":  [[/legion|\btuf\b|\brog\b|nitro|predator|\bomen\b|victus|alienware|katana|gaming/, "Gaming / workstation"]],
};

/* Manufacturer spec that is real and simply is not in the name. Kept
   short on purpose - everything here is me, and everything above is a
   rule somebody else can check. */
const TABLE = {
  /* Glock frame sizes. "Pocket" in the option means the .25/.380 junk
     class, so a subcompact 9mm Glock is compact, not pocket. */
  /* "Glock 22 / 23" gets no Size: the 22 is a full frame and the 23 is the
     compact, and one row cannot answer for both. Same reason CZ P-10,
     Sig P320, Sig P226/P229, Springfield XD/XDs, Taurus G3/GX4 and Ruger
     Security-9/Max-9 are absent. A row that covers two frames is a
     question, not a fact. */
  
  
  
  /* chainsaws, blowers, trimmers - what the maker built them for */
  "Stihl MS 170 / 180":{"Grade":"Homeowner","Bar length":"16–18 in"},
  "Stihl MS 271 Farm Boss":{"Grade":"Farm / ranch","Bar length":"19 in +"},
  "Stihl MS 461 / 462":{"Grade":"Pro / commercial","Bar length":"19 in +"},
  "Husqvarna 450 / 445":{"Grade":"Farm / ranch","Bar length":"16–18 in"},
  "Stihl BR 800":{"Grade":"Pro / commercial"}, "Husqvarna 350BT":{"Grade":"Homeowner"},
  "Stihl FS 56 / FS 91":{"Grade":"Homeowner"}, "Stihl FS 131":{"Grade":"Farm / ranch"},
  /* watches whose movement is the model's defining spec */
  "Seiko SKX007":{"Movement":"Automatic"}, "Seiko 5 Sports SRPD":{"Movement":"Automatic"},
  "Seiko Prospex Turtle":{"Movement":"Automatic"},
  "Citizen Eco-Drive Promaster":{"Movement":"Quartz"},
  /* Service pistols. Full frame or compact is the frame the gun IS, and it
     does not vary unit to unit the way a shotgun's gauge does. CZ P-10 is
     left out on purpose: the C is compact and the F is full, and the row
     does not say which. */
  
  
  
  /* Portable speakers. Party-size is the big mains-ish ones you can hear
     across a yard; the rest are the grab-and-go models. */
  "JBL Charge 4":{"Size":"Standard portable"}, "JBL Charge 5":{"Size":"Standard portable"},
  "JBL Clip 4":{"Size":"Standard portable"}, "JBL Xtreme 3":{"Size":"Party-size"},
  "Bose SoundLink Flex":{"Size":"Standard portable"},
  "Bose SoundLink Micro":{"Size":"Standard portable"},
  "Bose SoundLink Revolve":{"Size":"Standard portable"},
  "Ultimate Ears Boom 3":{"Size":"Standard portable"},
  "Ultimate Ears Megaboom 3":{"Size":"Party-size"},
  "Sony SRS-XB13":{"Size":"Standard portable"}, "Sony SRS-XB43":{"Size":"Party-size"},
  "Sony SRS-XG300":{"Size":"Party-size"},
  "Anker Soundcore Motion Boom":{"Size":"Party-size"},
  "Anker Soundcore Flare 2":{"Size":"Standard portable"},
  "Anker Soundcore 3":{"Size":"Standard portable"},
  "Marshall Emberton":{"Size":"Standard portable"},
  "Marshall Willen":{"Size":"Standard portable"},
  /* Laptops. Gaming and workstation are what the machine was built as. */
  "MacBook Air M1":{"Class":"Standard"}, "MacBook Air M2":{"Class":"Standard"},
  /* Trolling motors */
  "Minn Kota Terrova":{"Class":"GPS / spot-lock"},
  "Minn Kota Endura":{"Class":"Basic 12V"},
  /* More service pistols, frame size only where the row names one frame. */
  
  
  
  
  
  /* The one row the pocket option was actually written about. */
  "Ruger LCP":{"Size":"Pocket (.25/.380 junk-class)"},
  /* Watch movements, only where the reference has ONE. Left out on
     purpose: Tissot PRX, Hamilton Khaki Field, Cartier Tank Must, TAG
     Aquaracer and Fossil Grant all ship in both quartz and automatic, so
     the model does not answer it and the counter has to. */
  "Rolex Datejust 36":{"Movement":"Automatic / mechanical"},
  "Rolex Explorer":{"Movement":"Automatic / mechanical"},
  "Omega Seamaster 300M":{"Movement":"Automatic / mechanical"},
  "Omega Speedmaster Professional":{"Movement":"Automatic / mechanical"},
  "Tudor Black Bay 58":{"Movement":"Automatic / mechanical"},
  "Breitling Navitimer":{"Movement":"Automatic / mechanical"},
  "TAG Heuer Carrera":{"Movement":"Automatic / mechanical"},
  "Invicta Pro Diver 8926":{"Movement":"Automatic"},
  "Bulova Marine Star":{"Movement":"Quartz"}, "Movado Museum":{"Movement":"Quartz"},
  "Michael Kors Lexington":{"Movement":"Quartz"},
  /* Smartwatches are neither, and Quartz is the electronic bucket. */
  "Apple Watch Series 7":{"Movement":"Quartz"}, "Apple Watch Series 8":{"Movement":"Quartz"},
  "Apple Watch SE":{"Movement":"Quartz"}, "Garmin Fenix 6":{"Movement":"Quartz"},
  "Garmin Fenix 7":{"Movement":"Quartz"}, "Garmin Forerunner 245":{"Movement":"Quartz"},
  /* Laptops that are not gaming machines. The gaming lines are a rule. */
  "Dell Inspiron 15 3520":{"Class":"Standard"}, "HP Pavilion 15":{"Class":"Standard"},
  "HP Envy x360 15":{"Class":"Standard"}, "Acer Aspire 5":{"Class":"Standard"},
  "Microsoft Surface Laptop 4":{"Class":"Standard"},
  "Microsoft Surface Laptop 5":{"Class":"Standard"},
  "Acer Swift 3":{"Class":"Standard"}, "Lenovo ThinkPad T14":{"Class":"Standard"},
  "Dell Latitude 7420":{"Class":"Standard"}, "Asus ZenBook 14":{"Class":"Standard"},
  "Lenovo Chromebook Flex 5":{"Class":"Standard"}, "Asus Vivobook 15":{"Class":"Standard"},
};
/* EVERY PISTOL IN THE BOOK IS A COMMON CHAMBERING, and that answer holds
   even where the row covers two frames - a P226 is 9mm or .40 and both
   land in the same bucket, so variant ambiguity cannot make it wrong.
   Written per row rather than as a blanket default for the aisle, so a
   .50 AE or a .357 Sig added later is asked about rather than assumed. */
/* g7 Size has exactly two options - "Full / compact" and the .25/.380
   pocket junk class - so it is not asking what frame the gun is, it is
   asking whether it is a throwaway. Every service pistol in the book is
   the former, which also means the rows covering two frames (Glock 22/23,
   P226/P229, XD/XDs) can be answered after all: both frames land in the
   same bucket. The LCP keeps its own answer below. */
for (const n of ["Glock 17","Glock 19","Glock 26","Glock 43 / 43X","Glock 48",
  "Glock 22 / 23 (.40)","Sig Sauer P365","Sig Sauer P320","Sig Sauer P226 / P229",
  "S&W M&P9 2.0","S&W M&P Shield / Shield Plus","Springfield Hellcat",
  "Springfield XD / XDs","Taurus G2C / G3C","Taurus G3 / GX4","Ruger LCP",
  "Ruger Security-9 / Max-9","Ruger Mark IV","Canik TP9","CZ P-10","CZ 75",
  "Beretta 92FS / M9","1911 (Rock Island, Tisas, Springfield Mil-Spec)",
  "Hi-Point C9","SCCY CPX"])
  TABLE[n] = Object.assign({"Caliber":"Common (9mm, .223, .308…)",
                            "Size":"Full / compact"}, TABLE[n]||{});

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport:{width:1400, height:900}});
await page.goto(BASE + "/index.html"); await page.waitForTimeout(1300);

const cat = await page.evaluate(() => {
  const out = [];
  for (const r of MODEL_PRICES) {
    const refs = String(r[1]||"").split("|").filter(Boolean);
    let groups = null;
    for (const ref of refs) if (SPEC_CHOICES[ref]) { groups = SPEC_CHOICES[ref]; break; }
    if (!groups) continue;
    let itemId=null;
    for (const ref of refs) if (SPEC_CHOICES[ref]) { itemId=ref; break; }
    out.push({id:r[0], name:r[2], item:itemId,
      groups: groups.map(g => ({label:g.label, opts:g.options.map(o => o.t)}))});
  }
  return out;
});
await browser.close();

const spec = {}; let filled = 0, byRule = 0, byTable = 0;
const unfilled = [];
for (const row of cat) {
  const n = N(row.name);
  for (const g of row.groups) {
    if (ITEM_ONLY.has(g.label)) continue;
    if (ITEM_ONLY_FOR.some(([re, lab]) => lab === g.label && re.test(row.name))) continue;
    let want = (TABLE[row.name] || {})[g.label], how = "table";
    if (!want) {
      for (const [re, o] of (RULES[g.label] || [])) if (re.test(n)) { want = o; how = "rule"; break; }
    }
    /* the value has to exist in the live option list, or it is dropped */
    if (!want || !g.opts.includes(want)) { unfilled.push(row.item + " / " + row.name + " / " + g.label); continue; }
    (spec[row.id] = spec[row.id] || {})[g.label] = want;
    filled++; how === "rule" ? byRule++ : byTable++;
  }
}
const askable = filled + unfilled.length;
console.log("rows with spec questions      " + cat.length);
console.log("model-fact answers possible   " + askable);
console.log("  filled from the name        " + byRule);
console.log("  filled from the table       " + byTable);
console.log("  left to be asked            " + unfilled.length
          + "   (" + Math.round(100*filled/askable) + "% covered)");
console.log("\nrows carrying at least one fact: " + Object.keys(spec).length);

if (process.argv.includes("--write")) {
  const p = new URL("../app.js", import.meta.url);
  let s = readFileSync(p, "utf8");
  const body = Object.entries(spec).sort((a,b)=>a[0].localeCompare(b[0]))
    .map(([id, m]) => "  " + JSON.stringify(id) + ":" + JSON.stringify(m))
    .join(",\n");
  const start = s.indexOf("const MODEL_SPEC={");
  const end = s.indexOf("\n};", start);
  if (start < 0 || end < 0) { console.error("MODEL_SPEC block not found"); process.exit(1); }
  s = s.slice(0, start) + "const MODEL_SPEC={\n" + body + s.slice(end);
  writeFileSync(p, s);
  console.log("\nwritten into app.js");
} else {
  console.log("\n(report only - pass --write to put it in app.js)");
  console.log("\nnot filled, a sample:");
  const byLab = {};
  unfilled.forEach(u => { const p=u.split(" / "); const l=p[0]+" "+p[p.length-1]; byLab[l]=(byLab[l]||0)+1; });
  const want = (process.env.SHOW||"").split(",").filter(Boolean);
  if (want.length) {
    unfilled.filter(u => want.includes(u.split(" / ").pop()))
      .slice(0,60).forEach(u => console.log("   " + u));
  } else {
    Object.entries(byLab).sort((a,b)=>b[1]-a[1])
      .forEach(([l,n]) => console.log("   " + String(n).padStart(4) + "  " + l));
  }
}
