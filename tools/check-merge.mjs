/* The merge can push straight to main now, so the thing that decides
   whether a run is sane has to be tested like anything else that reaches
   the counter. Builds fake findings against the REAL prices.json and
   checks the breaker stops what it should and passes what it should. */
import { readFileSync, writeFileSync, copyFileSync, existsSync, unlinkSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { ELEC_PART } from "../server/ebay.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRICES = join(ROOT, "prices.json");
const TMP = mkdtempSync(join(tmpdir(), "pdmerge-"));
const pj = JSON.parse(readFileSync(PRICES, "utf8"));
const SAFE = join(TMP, "prices.original.json");
copyFileSync(PRICES, SAFE);
/* A merge writes tools/price-changes.md. Snapshot it BEFORE anything runs -
   snapshotting later catches a report one of these tests just wrote, and
   the fixture gets left in the repo. */
const REPORT = join(ROOT, "tools/price-changes.md");
const reportBefore = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : null;
const restoreReport = () => {
  if (reportBefore === null) { if (existsSync(REPORT)) unlinkSync(REPORT); }
  else writeFileSync(REPORT, reportBefore);
};

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ok    " + m); } else { fail++; console.log("  FAIL  " + m); } };

function findings(mult, count, from = 0) {
  const f = {};
  pj.rows.slice(from, from + count).forEach((r) => {
    const m = typeof mult === "function" ? mult(r) : mult;
    f[r[1] + "|" + r[2]] = { id: r[0], ref: r[1], name: r[2],
      lo: Math.max(1, Math.round(r[3] * m)), hi: Math.max(1, Math.round(r[4] * m)),
      n: 12, conf: r[5], date: "2026-01-01", src: "https://www.ebay.com", note: "test" };
  });
  const p = join(TMP, "f" + Math.random().toString(36).slice(2) + ".json");
  writeFileSync(p, JSON.stringify({ found: f }));
  return p;
}
function run(out, extra = []) {
  try {
    const stdout = execFileSync(process.execPath, [join(ROOT, "tools/harvest.js"), "--merge", "--out", out, ...extra],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out: stdout };
  } catch (e) { return { code: e.status, out: String(e.stdout || "") + String(e.stderr || "") }; }
}
const untouched = () => readFileSync(PRICES, "utf8") === readFileSync(SAFE, "utf8");
const restore = () => { copyFileSync(SAFE, PRICES); const b = PRICES + ".bak"; if (existsSync(b)) unlinkSync(b); };

console.log("\nthe merge circuit breaker\n");

let r = run(findings(0.45, 30));
ok(r.code === 2, "a run that halves 30 rows is stopped");
ok(untouched(), "  and prices.json is not written");
restore();

/* A row collapsing to a fifth of its OWN last measured price. The band
   now checks a model against its own row rather than its category's base
   - a Martin D-28 at $2,600 is not mad, it is a Martin - so a collapse
   like this is caught by the band and that one row is held while the rest
   of the run goes through. Which mechanism catches it matters less than
   the two things that must always be true: the bad figure is not written,
   and the run says so out loud. */
r = run(findings(0.2, 4));
ok(/held back as wild/.test(r.out) || r.code === 2,
   "a single row falling to a fifth is refused — "
   + (r.code === 2 ? "the breaker stopped the run" : (r.out.match(/\d+ held back as wild/) || [""])[0]));
ok(!JSON.parse(readFileSync(PRICES, "utf8")).rows
     .some((row, i) => i < 4 && row[3] === Math.max(1, Math.round(pj.rows[i][3] * 0.2))),
   "  and the collapsed figure is not written");
restore();

/* This used to assert that one row quadrupling halts the whole run, and it
   did - because the model lane trusted a `wild` flag written at lookup
   time, and a synthetic finding carries none, so a mad row sailed past the
   band and was caught further down by the circuit breaker. The band is
   recomputed on both lanes now, which is what the file's own header always
   said it did, so the mad row is held back by name and the good rows
   beside it still merge. That is the stronger outcome, not the weaker one:
   nothing bad is written either way, and one bad row no longer costs a
   whole run. The breaker still guards what it is for - many rows moving
   together - which the test above this one covers. */
r = run(findings(4, 3));
ok(r.code === 2 || /held back as wild/.test(r.out),
   "a single row quadrupling is refused too — "
   + (r.code === 2 ? "the breaker stopped the run" : "the band held it"));
ok(!JSON.parse(readFileSync(PRICES, "utf8")).rows
     .some((row, i) => i < 3 && row[3] === Math.round(pj.rows[i][3] * 4)),
   "  and the quadrupled figure is not written");
restore();

r = run(findings(1.03, 30));
ok(r.code === 0, "a run that moves 30 rows by 3% goes through");
ok(!untouched(), "  and prices.json is written");
restore();

r = run(findings(0.45, 30), ["--force"]);
ok(r.code === 0, "--force merges what the breaker objected to");
restore();

r = run(findings((x) => 1.03, 30));
ok(/rows/.test(r.out), "the merge still reports what it did");
restore();

console.log("\nthe change report\n");

/* a realistic week: small drift on most, two big movers, one new row */
const mixed = {};
pj.rows.slice(0, 20).forEach((r, i) => {
  const m = i < 2 ? 1.34 : 1 + ((i % 7) - 3) / 100;
  mixed[r[1] + "|" + r[2]] = { id: r[0], ref: r[1], name: r[2],
    lo: Math.round(r[3] * m), hi: Math.round(r[4] * m),
    n: i < 2 ? 9 : 20, conf: r[5], date: "2026-01-01", basis: "asking",
    src: "https://www.ebay.com", note: "t" };
});
mixed["p1|Zzz Test Saw"] = { ref: "p1", name: "Zzz Test Saw", lo: 100, hi: 150, n: 14,
  conf: "m", date: "2026-01-01", basis: "asking", note: "t" };
const mixedPath = join(TMP, "mixed.json");
writeFileSync(mixedPath, JSON.stringify({ found: mixed }));

r = run(mixedPath);
ok(r.code === 0, "a mixed week merges");
const rep = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : "";
ok(/^# Price changes/m.test(rep), "  a report is written");
ok(/Worth a look/.test(rep), "  it has a 'worth a look' section");
ok(/\*\*\+34%\*\*/.test(rep), "  the 34% movers are called out as big");
ok(/## Ordinary drift/.test(rep), "  small drift is listed separately");
ok(/Zzz Test Saw/.test(rep), "  a new row is reported as new");
ok(/asking/.test(rep), "  it says the prices are asks");
const lookIdx = rep.indexOf("Worth a look"), driftIdx = rep.indexOf("Ordinary drift");
ok(lookIdx > 0 && driftIdx > lookIdx, "  the big movers come before the small ones");
restore();
restoreReport();

ok(untouched(), "prices.json is back exactly as it started");
ok(existsSync(REPORT) === (reportBefore !== null), "the test leaves no report behind");
/* A PRICE-BOOK ROW CANNOT TRAVEL AS A MODEL ROW.
   The one-offs are the generic kind of thing - "Wheelbarrow", "Grease gun"
   - and their names carry no model number. Both routes a measured price
   normally takes to the counter, mpAuto and harvFind, refuse to pin
   without a token containing a DIGIT, because a model number is the one
   part of a name that cannot be coincidence. So harvesting these into the
   model list would have paid for 166 lookups and thrown every one away.
   They travel in prices.json's "book" map instead. */
console.log("\n  a one-off lands in the book map, not the model list");
{
  const tmp = join(tmpdir(), "bookmerge-" + Date.now() + ".json");
  const before = JSON.parse(readFileSync(PRICES, "utf8"));
  writeFileSync(tmp, JSON.stringify({ updated: "2026-09-23", found: {
    "Wheelbarrow|Wheelbarrow": { ref: "Wheelbarrow", name: "Wheelbarrow",
      lo: 55, hi: 85, n: 14, conf: "m", date: "2026-09-23", basis: "sold" },
    "Remington 870 Express|x": { ref: "g1", name: "Remington 870 Express",
      lo: 310, hi: 410, n: 9, conf: "m", date: "2026-09-23", basis: "sold" },
  }}));
  let out = "";
  try { out = execFileSync("node", [join(ROOT, "tools/harvest.js"), "--merge", "--out", tmp],
                           { cwd: ROOT, encoding: "utf8" }); } catch (e) { out = String(e.stdout || e); }
  const after = JSON.parse(readFileSync(PRICES, "utf8"));
  ok(after.book && after.book["Wheelbarrow"] === 70,
     "the wheelbarrow lands in the book map at the mid of 55-85 — " + JSON.stringify(after.book));
  ok(after.rows.length === before.rows.length,
     "  and adds no row to the model list — " + before.rows.length + " → " + after.rows.length);
  ok(!after.rows.some(r => r[2] === "Wheelbarrow"),
     "  there is no 'Wheelbarrow' row among the models");
  const shot = after.rows.find(r => r[2] === "Remington 870 Express");
  ok(shot && shot[3] === 310 && shot[4] === 410,
     "  while an ordinary model row still goes where it always did — " + (shot ? shot[3] + "-" + shot[4] : "MISSING"));
  const report = readFileSync(join(ROOT, "tools/price-changes.md"), "utf8");
  ok(/One-off rows/.test(report) && /Wheelbarrow/.test(report),
     "  and the change report gives the one-offs their own section");
  /* put everything back */
  writeFileSync(PRICES, JSON.stringify(before, null, 0));
  try { unlinkSync(PRICES + ".bak"); } catch (e) {}
  try { unlinkSync(tmp); } catch (e) {}
  const restored = JSON.parse(readFileSync(PRICES, "utf8"));
  /* This used to assert prices.json carried NO book map at all, which was
     only true while no one-off had ever been priced. The electronics
     harvest gave real figures to "Wireless earbuds", "Monitor - 27in" and
     the rest, so an absent book map is no longer the resting state - and an
     assertion that only holds on an empty shelf tests nothing. Compare it
     with what was there before the block instead. */
  ok(JSON.stringify(restored.book || null) === JSON.stringify(before.book || null)
     && restored.rows.length === before.rows.length,
     "prices.json is back exactly as it started");
}

/* A DRY RUN OF ALL 166 ONE-OFFS FOUND TWO HOLES. Both are here so they
   stay shut.
   The band that refuses an absurd row was computed during the LOOKUP, and
   the merge simply trusted the flag in the findings file. A merge can be
   run against a file from another day, another branch, or a version of
   this script from before the price book had a band at all - which is how
   a fabricated run put a $600 e-bike in at $2,583. The merge is the last
   gate before the counter, so it checks for itself now. */
console.log("\n  the merge re-checks the band itself");
{
  const tmp = join(TMP, "bookwild.json");
  /* no `wild` flag on either - exactly what an older findings file looks like */
  writeFileSync(tmp, JSON.stringify({ updated: "2026-09-23", found: {
    "E-bike|E-bike":   { ref: "E-bike", name: "E-bike", lo: 2100, hi: 3100,
                         n: 12, conf: "m", date: "2026-09-23", basis: "sold" },
    "Blender|Blender": { ref: "Blender", name: "Blender", lo: 26, hi: 38,
                         n: 11, conf: "m", date: "2026-09-23", basis: "sold" },
  }}));
  let out = "";
  try { out = execFileSync(process.execPath, [join(ROOT, "tools/harvest.js"), "--merge", "--out", tmp],
                           { cwd: ROOT, encoding: "utf8" }); } catch (e) { out = String(e.stdout || e); }
  const bk = JSON.parse(readFileSync(PRICES, "utf8")).book || {};
  ok(bk["E-bike"] === undefined,
     "a $600 e-bike coming back at $2,600 is refused, flag or no flag — " + JSON.stringify(bk["E-bike"]));
  ok(bk["Blender"] === 32, "  while a sane row beside it still lands — " + JSON.stringify(bk["Blender"]));
  ok(/held back as wild/.test(out), "  and the run says so");
  restore(); restoreReport();
}

/* The one-offs were rewritten in their own lane and never reached the
   breaker's list, so a run could rewrite 153 price-book rows - four of them
   past 4x - and exit 0 having seen nothing. They reach the counter through
   the same screens as every other price. */
console.log("\n  the breaker counts the one-offs");
{
  const APP = readFileSync(join(ROOT, "app.js"), "utf8");
  const i = APP.indexOf("const PRICEBOOK=["), j = APP.indexOf("[", i);
  let d = 0, end = j;
  for (let k = j; k < APP.length; k++) {
    if (APP[k] === "[") d++;
    else if (APP[k] === "]" && --d === 0) { end = k; break; }
  }
  const PB = new Function("return " + APP.slice(j, end + 1))();
  /* every one-off jumping about 80% - the shape of a broken search, not a market */
  const found = {};
  for (const e of PB) {
    const mid = e[1] * 1.8;
    found[e[0] + "|" + e[0]] = { ref: e[0], name: e[0], lo: Math.round(mid * 0.9),
      hi: Math.round(mid * 1.1), n: 12, conf: "m", date: "2026-09-23", basis: "sold" };
  }
  const tmp = join(TMP, "bookbreak.json");
  writeFileSync(tmp, JSON.stringify({ updated: "2026-09-23", found }));
  /* "Nothing was written" used to mean "prices.json has no book map", which
     held only while no one-off had ever been priced. It carries real ones
     now, so the check is that the refusal left the map exactly as it
     found it. */
  const bookBefore = JSON.stringify(JSON.parse(readFileSync(PRICES, "utf8")).book || null);
  let code = 0, out = "";
  try { out = execFileSync(process.execPath, [join(ROOT, "tools/harvest.js"), "--merge", "--out", tmp],
                           { cwd: ROOT, encoding: "utf8" }); }
  catch (e) { code = e.status; out = String(e.stdout || "") + String(e.stderr || ""); }
  ok(code === 2, "a run where every one-off jumps 80% is refused — exit " + code);
  ok(/moved more than 60%/.test(out), "  and it says why — " + (out.match(/.*moved more than 60%.*/) || [""])[0].trim());
  ok(JSON.stringify(JSON.parse(readFileSync(PRICES, "utf8")).book || null) === bookBefore,
     "  and nothing was written");
  restore(); restoreReport();
}

/* A TELEVISION IS NOT A TELEVISION STAND.
   The parts vocabulary was all small-engine - carburettors, sprockets,
   deck belts - because outdoor power is where it was first measured, and
   nothing extended it when electronics arrived. An LG C2, a $700 set,
   came back as eight parts at $30-$140 and one real TV at $350, and none
   of the parts were recognised; it was reported as "eBay can't price a
   television". These nineteen titles are real, pulled off the live search
   on 23 Sep, and they include the traps: a real laptop says "Screen
   Defect", "SCREEN ISSUE" and "NO LCD", and a real television says "w/
   Stand" where a part says "TV Stand". Matching bare "screen", "lcd" or
   "panel" would throw the machines away with the parts. */
console.log("\n  the parts filter knows an electronics part when it sees one");
{
  const ITEMS = [
    'Samsung TU7000 55" LED 1080p FHD Flat Screen TV w/ Stand - Black',
    'Samsung UN55TU7000FXZA 55in LED 4K 2160p Smart TV, Black HDMI USB',
    '55" Class TU7000 Crystal UHD 4K Smart TV',
    'Samsung 55" TU7000 4K UHD Smart TV (Model UN55TU7000FXZA) With Remote And Feet',
    '55\u201d LG C2 OLED TV',
    'Apple MacBook Air M1 13in Laptop 8GB RAM 128GB SSD Silver (2020)',
    'Apple MacBook Air 13in M1 2020 [8GB/256GB] Space Gray - Screen Defect - READ',
    'Dell XPS 9320 Core i7-1260P 3.76GHz 32GB RAM NO HDD NO OS NO LCD',
    'Dell XPS 13 9310 Core i7-1165G7 2.8GHz 16GB RAM NO SSD 13.4" UHD+ Touch READ',
    'Dell XPS 9320 13.4" i7-1270p 16GB 1TB SCREEN ISSUE',
    'Minn Kota Endura C2 Trolling Motor 34 lbs Thrust 12V Transom Mount',
    'Minn Kota Endura C2 30 trolling motor with battery, charger, case',
    'The Minn Kota Endura 30 lb thrust trolling motor Tested And Working',
    'GoPro HERO11 Black Action Camera and Max Lens Mod',
    'GoPro 8 black Hero Waterproof Camera & Accessories',
    'MINN KOTA ENDURA C2 55 36\" TRANSOM MOUNT 1352255',
    'Minn Kota 1352240 Trolling Motor Endura C2 40 lbs thrust',
    'USED/CLEAN 5-SPEED MINN KOTA BOAT MOTOR/ENDURA C2 GREAT/12VOLT',
  ];
  const PARTS_T = [
    'LG OLED55C2AUA TV Stand Base W/Screws (UP 3)',
    'LG OLED55C2PUA/PUB Main Board (No Issues)',
    'LG OLED 55" & 65" TV STAND FOR MODELS OLED65C2PUA & OLED55C2PUA W/SCREWS',
    'LG OLED55C2 OLED65C2 OLED48C3 TV Stand Base Plate MAM660004Pre-Owned',
    'LG  OLED55C2PUA OLED55C3PUA  T-CON BOARD  6870C-0908B  6972B',
    'LG OLED55/65C2 Stand Base for 65" TV Black Silver MAM660004',
    'LG OLED 55/65C2 Base Front Stand MAM660004 Titanium Gray - No Screws',
    'LG OLED 55/65 C2  Stand Base (OEM)  - No Screws',
    'LG OLED65C2PUA LOUDSPEAKER Speakers Set Left and Right',
    /* Outdoor power and the water: a trimmer's control handle, a
       throttle rod, a trolling motor's control box, its propeller, its
       main wire. These were filed as "asking prices, thin market" - a
       $400 Stihl FS 131 reading $15-$36 - when they are simply not the
       machine. */
    'Stihl FS131 FS111 FS91 OEM Control Handle',
    'Genuine Used Stihl FS 91 FS 111 FS 131  Throttle Rod And Linkage',
    'Used Minn Kota Endura C2 50lb Head Control Box',
    'Minn Kota Endura C2 30 Lb Thrust Trolling Motor - Blade Propeller',
    'Minn Kota Endura C2 40 36" Main Wire For Model 1352240',
    'Genuine Used Stihl FS 91 FS 111 FS 131 Clutch Assembly',
    'Minn Kota Endura 50lb Tiller Handle',
    'Minn Kota Endura C2 30lb thrust - top and bottom Control cover',
  ];
  const keptItems = ITEMS.filter(t => !ELEC_PART.test(t));
  const caughtParts = PARTS_T.filter(t => ELEC_PART.test(t));
  ok(keptItems.length === ITEMS.length,
     "every real television and laptop survives — " + keptItems.length + "/" + ITEMS.length
     + (keptItems.length === ITEMS.length ? "" : ", LOST: "
        + ITEMS.filter(t => ELEC_PART.test(t)).join(" | ")));
  ok(caughtParts.length === PARTS_T.length,
     "  and every stand, board and speaker set is caught — " + caughtParts.length + "/" + PARTS_T.length
     + (caughtParts.length === PARTS_T.length ? "" : ", MISSED: "
        + PARTS_T.filter(t => !ELEC_PART.test(t)).join(" | ")));
  ok(!ELEC_PART.test("Dell XPS 9320 13.4\" i7 16GB 1TB SCREEN ISSUE")
     && !ELEC_PART.test("MacBook Air M1 - Screen Defect - READ"),
     "  a broken screen is still a laptop, not a screen");
}

ok(untouched(), "prices.json is back exactly as it started after the one-off tests");
ok(existsSync(REPORT) === (reportBefore !== null), "  and no report is left behind");

/* THE EXPENSIVE PATH HAS TO BE ASKED FOR.
   --via claude searches the open web on Opus 5, one call per pass per
   target. A run on 21 Sep cost $43.77 against a banner that had estimated
   $0.02 a lookup. Nothing between the flag and the bill. It now refuses to
   start without a target limit and a dollar budget, neither defaulted -
   a path that spends money should not be reachable by forgetting a flag. */
console.log("\n  the money path refuses an unbounded run");
{
  const run = (args) => {
    try { return {code: 0, out: execFileSync(process.execPath,
      [join(ROOT, "tools/harvest.js"), ...args], {cwd: ROOT, encoding: "utf8"})}; }
    catch (e) { return {code: e.status, out: String(e.stdout || "") + String(e.stderr || "")}; }
  };
  const bare   = run(["--via", "claude", "--go"]);
  const noSpend= run(["--via", "claude", "--limit", "5", "--go"]);
  const noLimit= run(["--via", "claude", "--spend", "2", "--go"]);
  ok(bare.code === 2 && /--limit/.test(bare.out) && /--spend/.test(bare.out),
     "--via claude --go alone is refused, and says what it needs");
  ok(noSpend.code === 2 && /--spend/.test(noSpend.out), "  a limit without a budget is still refused");
  ok(noLimit.code === 2 && /--limit/.test(noLimit.out), "  a budget without a limit is still refused");
  ok(/43\.77/.test(bare.out), "  and it names what the unguarded run actually cost");

  /* A dry run must stay free whatever the flags say. */
  const dry = run(["--via", "claude", "--limit", "5", "--spend", "2"]);
  ok(dry.code === 0 && /Nothing was searched and nothing was spent/.test(dry.out),
     "without --go it is still a dry run, spending nothing");
  ok(/\$0\.12|about \$1\.20/.test(dry.out),
     "  the estimate is the measured $0.12 a lookup, not the old $0.02 — "
     + (dry.out.match(/Rough cost.*/) || [""])[0].trim());

  /* and the free path must not have been dragged into the gate */
  const free = run(["--limit", "3"]);
  ok(free.code === 0 && /nothing - eBay's API is free/.test(free.out),
     "the eBay path still needs no flags and costs nothing");
}

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
