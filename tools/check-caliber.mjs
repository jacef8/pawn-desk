#!/usr/bin/env node
/* THE CALIBER GOES IN THE SEARCH.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-caliber.mjs
 *
 * "i think guns should have a specific claiber selection so that when i
 * clck the gunwatcher or gunbbroker search button, it gives me more
 * accurate data."
 *
 * The question asked Common / Desirable / Oddball. Right three buckets for
 * the multiplier, useless to a search - you cannot look up "Common" on
 * GunBroker. So the caliber was collected and thrown away before the
 * buttons were built: his query box read "Browning Semi-auto rifle" with
 * the caliber he had just supplied nowhere in it.
 *
 * The dangerous half of this change is the DEFAULT. specBase picks the
 * first m===1 option when nobody has answered, so a list of real calibers
 * would make the first one a silent default and search every unanswered
 * rifle as something nobody said it was. That is asserted first.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport:{width:1500, height:1000}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(900);

/* Every gun row that asks a caliber or a gauge, and what it must offer. */
const GUNS = [
  ["g3",  "Bolt-action rifle",   ".270"],
  ["g4",  "Lever-action rifle",  ".30-30"],
  ["g5",  "AR-15",               ".300 Blackout"],
  ["g7",  "Semi-auto pistol",    "9mm"],
  ["g8",  "Revolver",            ".38 Special"],
  ["g10", "Semi-auto rifle",     ".30-06"],
];

const groups = await page.evaluate(ids => {
  const out = {};
  for (const id of ids) {
    const g = (SPEC_CHOICES[id] || [])[0];
    out[id] = g ? {label: g.label, opts: g.options.map(o => ({t:o.t, q:o.q || "", m:o.m == null ? 1 : o.m})),
                   base: specBase(g)} : null;
  }
  out.g1 = (() => { const g = (SPEC_CHOICES.g1 || [])[0];
    return {label:g.label, opts:g.options.map(o => ({t:o.t, q:o.q || "", m:o.m == null ? 1 : o.m})), base:specBase(g)}; })();
  return out;
}, GUNS.map(g => g[0]));

console.log("\n  the caliber question offers calibers, not price bands");
for (const [id, name, want] of GUNS) {
  const g = groups[id];
  ok(!!g && /caliber/i.test(g.label), `  ${id} ${name} asks a caliber`);
  /* The bands were the whole problem: unsearchable words where a caliber
     belonged. */
  ok(g && !g.opts.some(o => /^Common|^Desirable|^Oddball$/i.test(o.t)),
     `    and the Common/Desirable/Oddball bands are gone from it`);
  ok(g && g.opts.some(o => o.t === want),
     `    it offers ${want} — ${g ? g.opts.length : 0} options`);
  /* EVERY REAL CALIBER CARRIES A SEARCH WORD, or picking it changes the
     price and not the search, which is the bug this file exists for. */
  const real = g ? g.opts.filter(o => !/not said|not on this list/i.test(o.t)) : [];
  ok(real.length && real.every(o => o.q),
     `    every one of its ${real.length} calibers carries a word for the search`);
}

console.log("\n  and the list offered is the one that gun takes");
{
  /* The weedeater fault: "i clciked the outdoor power tools button it went
     straight to bar lenght. what if it was a weedeater or a blower?" A
     .270 on a Marlin 336 is the same mistake. */
  const lever = groups.g4.opts.map(o => o.t).join(" ");
  ok(!/\.270|6\.5 Creedmoor|\.30-06/.test(lever),
     `  a lever gun is not offered a .270 or a .30-06 — ${lever}`);
  ok(/\.30-30/.test(lever), "    it is offered the .30-30 it actually takes");
  const rev = groups.g8.opts.map(o => o.t).join(" ");
  ok(!/9mm|\.40 S&W/.test(rev), `  a revolver is not offered 9mm or .40 S&W — ${rev}`);
  const pist = groups.g7.opts.map(o => o.t).join(" ");
  ok(!/\.38 Special|\.30-30/.test(pist), `  a pistol is not offered .38 Special — ${pist}`);
}

console.log("\n  NOTHING IS SEARCHED FOR THAT NOBODY SAID");
{
  /* specBase returns the first m===1 option as the arithmetic fallback. If
     that option carried a q, every unanswered rifle would be searched as
     whatever happened to be first in the list - a silently wrong search,
     which is worse than a vague right one because the counter cannot see
     what it asked for. */
  for (const [id, name] of GUNS) {
    const g = groups[id];
    const b = g.opts[g.base];
    ok(b && !b.q,
       `  ${id}'s fallback option contributes no search word — "${b ? b.t : "?"}"`);
    ok(b && (b.m == null || b.m === 1),
       `    and does not move the price either — m ${b ? b.m : "?"}`);
  }
  const q = await page.evaluate(() => {
    st.mode="item"; st.catId="guns"; st.itemId="g10"; st.picked=true;
    st.brandTyped="Browning"; st.brandSet=true; st.model="BAR"; st.detail="";
    st.specSel = {};                       /* nobody has answered anything */
    const x = calcItem();
    return {gun: gunQuery(x), comp: compQuery(x), mult: x.spec ? x.spec.mult : null};
  });
  ok(!/\d{2,3}-?\d*\b(?!AR)/.test(q.gun.replace(/BAR/,"")) || !/223|30-06|308|270/.test(q.gun),
     `  with nothing answered, no caliber appears in the search — "${q.gun}"`);
  ok(!/223|30-06|308|270/.test(q.comp),
     `    nor in the one the other buttons use — "${q.comp}"`);
  ok(q.mult === 1, `    and the price is unmoved — x${q.mult}`);
}

console.log("\n  answered, it reaches BOTH buttons");
{
  const r = await page.evaluate(() => {
    const out = {};
    const go = (item, brand, model, pick) => {
      st.mode="item"; st.catId="guns"; st.itemId=item; st.picked=true;
      st.brandTyped=brand; st.brandSet=true; st.model=model; st.detail="";
      st.specSel = {}; st.specSel[item + ":0"] = pick;
      const x = calcItem();
      const t = compTargets(x);
      return {gun: gunQuery(x), comp: compQuery(x), mult: x.spec ? x.spec.mult : null,
              gw: (t.find(z => z.id === "gw") || {}).url || "",
              gb: (t.find(z => z.id === "gb") || {}).url || ""};
    };
    out.rifle = go("g10", "Browning", "BAR", 6);      /* .30-06 */
    out.lever = go("g4",  "Marlin",   "336", 1);      /* .30-30 */
    out.tenmm = go("g7",  "Glock",    "20",  6);      /* 10mm   */
    out.shot  = go("g1",  "Remington","870", 1);      /* 20 ga  */
    return out;
  });
  ok(/30-06/.test(r.rifle.gun), `  GunWatcher gets it — "${r.rifle.gun}"`);
  ok(/30-06/.test(r.rifle.comp), `  and so does GunBroker — "${r.rifle.comp}"`);
  /* Read off the actual hrefs, not the query strings that feed them: the
     assertion is about what the counter's click does. */
  ok(/30-06|30%2D06/i.test(decodeURIComponent(r.rifle.gw)),
     "  the GunWatcher button's own URL carries it");
  ok(/30-06/i.test(decodeURIComponent(r.rifle.gb)),
     "  and the GunBroker button's does too");
  ok(/30-30/.test(r.lever.gun), `  a lever gun searches its own caliber — "${r.lever.gun}"`);
  ok(/20 gauge/.test(r.shot.gun),
     `  AND A SHOTGUN SEARCHES ITS GAUGE, which was dropped the same way — "${r.shot.gun}"`);
  ok(/10mm/.test(r.tenmm.gun) && r.tenmm.mult === 1.08,
     `  10mm both searches and still carries its +8% — "${r.tenmm.gun}" x${r.tenmm.mult}`);
}

console.log("\n  no gun changed price because of this");
{
  /* The multipliers are the three SHIPPED bands re-expressed per caliber -
     1.0, 1.08, 0.85 - not a new set of numbers. A caliber that ought to
     move bands moves on a counter report, not on my guess, and this is
     what would catch me inventing one. */
  const bad = [];
  for (const [id] of GUNS) {
    for (const o of groups[id].opts)
      if (![1, 1.08, 0.85].includes(o.m)) bad.push(`${id} "${o.t}" m=${o.m}`);
  }
  ok(bad.length === 0,
     `  every caliber sits in one of the three shipped bands — ${bad.join(", ") || "all of them"}`);
  const desirable = [];
  for (const [id] of GUNS)
    for (const o of groups[id].opts) if (o.m === 1.08) desirable.push(o.t);
  ok(desirable.every(t => /45-70|10mm/i.test(t)),
     `  and the only ones marked desirable are the two the old option named — ${desirable.join(", ")}`);
}

console.log("\n  a model the desk already knows does not have to be asked");
{
  /* THE BEST PART OF THIS CHANGE, and it fell out of a failing test rather
     than being designed. check-record went red because 27 gun rows carried
     a stored fact Caliber = "Common (9mm, .223, .308...)" - an option that
     no longer exists. The right replacement was not the nearest new option,
     it was the gun's ACTUAL chambering, which the record can now hold: a
     Glock 17 is a 9mm and the desk should not stop to ask.

     A stored fact REMOVES the question, so a wrong one is worse than none -
     it would search the wrong caliber with nothing on screen to say so. The
     rule used: store it only where the model NAME settles it. Where a model
     is made in several - P320, P226, P229, M&P Shield, XD, 1911 - the fact
     was dropped rather than guessed, and the run still asks. */
  const r = await page.evaluate(() => {
    const out = {};
    const go = (brand, model) => {
      st.mode="item"; st.catId="guns"; st.itemId="g7"; st.picked=true;
      st.brandTyped=brand; st.brandSet=true; st.model=model; st.detail=""; st.specSel={};
      const row = mpFor("g7", brand + " " + model);
      st.mpPin = row ? {id:row[0], model:row[2]} : null;
      recordGuard();
      const x = calcItem();
      return {q: gunQuery(x), asks: askQueue(x).map(z => z.id).includes("spec:0"),
              row: row ? row[0] : null};
    };
    out.g17  = go("Glock", "17");
    out.g22  = go("Glock", "22");
    out.mk4  = go("Ruger", "Mark IV");
    out.p320 = go("Sig Sauer", "P320");
    out.xd   = go("Springfield", "XD");
    return out;
  });
  ok(/9mm/.test(r.g17.q) && !r.g17.asks,
     `  a Glock 17 searches as a 9mm without being asked — "${r.g17.q}"`);
  ok(/40 S&W/.test(r.g22.q) && !r.g22.asks,
     `  a Glock 22 as a .40 — "${r.g22.q}"`);
  ok(/22 LR/.test(r.mk4.q) && !r.mk4.asks,
     `  a Ruger Mark IV as a .22 — "${r.mk4.q}"`);
  /* The half that protects the money: guessing here would search the wrong
     gun with nothing on screen admitting it. */
  ok(r.p320.asks && !/9mm|40 S&W|45 ACP/.test(r.p320.q),
     `  BUT A P320 IS STILL ASKED — it is made in three — "${r.p320.q}"`);
  ok(r.xd.asks, "  and so is an XD, for the same reason");
}

console.log("\n  nothing outside the gun aisle moved");
{
  const r = await page.evaluate(() => {
    st.mode="item"; st.catId="tools"; st.itemId="t1"; st.picked=true;
    st.brandTyped="DeWalt"; st.brandSet=true; st.model="DCD791"; st.detail="";
    st.specSel = {};
    const bare = compQuery(calcItem());
    st.specSel["t1:1"] = 2;                 /* tool only - carries a q */
    const picked = compQuery(calcItem());
    return {bare, picked};
  });
  ok(!/tool only/i.test(r.bare),
     `  an unanswered drill searches no spec words — "${r.bare}"`);
  ok(/tool only/i.test(r.picked),
     `  and an answered one still does — "${r.picked}"`);
}

console.log("\n  the phone");
{
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  const perr = []; ph.on("pageerror", e => perr.push(String(e)));
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  await ph.waitForTimeout(900);
  const q = await ph.evaluate(() => {
    st.mode="item"; st.catId="guns"; st.itemId="g10"; st.picked=true;
    st.brandTyped="Browning"; st.brandSet=true; st.model="BAR";
    st.specSel = {}; st.specSel["g10:0"] = 6;
    return gunQuery(calcItem());
  });
  ok(/30-06/.test(q), `  the field screen builds the same search — "${q}"`);
  ok(perr.length === 0, "  no page errors on the phone" + (perr.length ? ": " + perr[0] : ""));
  await ph.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
