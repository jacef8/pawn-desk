#!/usr/bin/env node
/* FOUR CONSOLE MARKETS, NOT ONE ROW.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-console.mjs
 *
 * The desk had one console row - "current gen", $225 - and a PS4, an N64
 * and a Dreamcast all landed on it. Measured 29 Sep off PriceCharting
 * loose (completed eBay sales), cross-checked against Racketboy's
 * community hardware guide, which agrees every time: loose NES $50-160
 * against $94, SNES $50-225 against $110, Genesis $40-160 against $75.
 *
 * What this file is really guarding is the arithmetic. calcItem clamps
 * spec.mult to [0.4, 1.8], and the collector band is full of genuine 2.8x
 * and 13x figures. Put one of those on an option and the card prints a
 * number the arithmetic never used - the exact bug this repo has shipped
 * before. So the clamp is asserted directly, over every combination.
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
const page = await browser.newPage({viewport:{width:1400, height:1000}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(900);

const BANDS = ["e5", "e5a", "e5b", "e5c", "e5d"];

console.log("\n  the aisle has a row per market, not one row for all of them");
{
  const r = await page.evaluate(ids => {
    const elec = CATALOG.find(c => c.id === "elec");
    return ids.map(id => { const it = elec.items.find(x => x.id === id);
      return it ? {id, name:it.name, value:it.value, liq:it.liq} : null; });
  }, BANDS);
  r.forEach((x, i) => ok(!!x, `  ${BANDS[i]} exists${x ? " — " + x.name : ""}`));
  /* Ordered, and the ORDER is the finding: last gen is dearer than the
     2005-2012 band, which is CHEAPER than retro, because retro turned
     round and started rising. A flat "older is cheaper" book would get
     that backwards, and that is what the single row did. */
  const v = Object.fromEntries(r.filter(Boolean).map(x => [x.id, x.value]));
  ok(v.e5 > v.e5a, `  current gen over last gen — ${v.e5} > ${v.e5a}`);
  ok(v.e5a > v.e5b, `  last gen over the 2005-2012 band — ${v.e5a} > ${v.e5b}`);
  ok(v.e5c > v.e5b,
     `  and RETRO IS DEARER THAN THE BAND ABOVE IT — ${v.e5c} > ${v.e5b}. Pre-2001 stopped falling`);
  ok(v.e5c !== v.e5 && v.e5b !== v.e5,
     "  none of them is still the old $225 current-gen figure");
  const slow = r.filter(Boolean).filter(x => x.liq === "slow").map(x => x.id).join(",");
  ok(slow.includes("e5c") && slow.includes("e5d"),
     `  the retro rows are flagged slow — it sells on eBay, not in Bristol — ${slow}`);
}

console.log("\n  what the counter types reaches the right band");
{
  const cases = [
    ["nintendo 64",        "e5c"], ["n64",            "e5c"],
    ["super nintendo",     "e5c"], ["sega dreamcast", "e5c"],
    ["playstation 2",      "e5c"], ["gamecube",       "e5c"],
    ["playstation 4",      "e5a"], ["xbox one",       "e5a"],
    ["playstation 3",      "e5b"], ["xbox 360",       "e5b"],
    ["game boy",           "e5d"], ["nintendo ds",    "e5d"],
  ];
  for (const [typed, want] of cases) {
    /* Read off the SEARCH the counter actually uses, not off the keyword
       map. A map entry proves a word was written down somewhere; what
       matters is which row comes up first when the words are typed into
       the box, which is what omniRows answers. */
    const got = await page.evaluate(t => {
      const rows = (omniRows(t) || {}).rows || [];
      const hit = rows.find(r => r.itemId);
      return hit ? hit.itemId : null;
    }, typed);
    ok(got === want, `  "${typed}" → ${want}${got === want ? "" : "  GOT " + got}`);
  }
}

console.log("\n  the measured machines carry their own price, not the class figure");
{
  const cases = [["dreamcast","e5c",140,180], ["nintendo 64","e5c",80,110],
                 ["super nintendo","e5c",95,130], ["game boy","e5d",55,80],
                 ["xbox 360","e5b",60,110], ["playstation 3","e5b",70,290]];
  for (const [typed, item, lo, hi] of cases) {
    const got = await page.evaluate(([t, it]) => {
      st.mode="item"; st.catId="elec"; st.itemId=it; st.picked=true;
      st.model=t; st.detail="";
      const r = mpFor(it, t);
      return r ? {name:r[2], lo:r[3], hi:r[4]} : null;
    }, [typed, item]);
    ok(got && got.lo === lo && got.hi === hi,
       `  "${typed}" prices as ${got ? got.name + " $" + got.lo + "-" + got.hi : "NOTHING"} (want $${lo}-${hi})`);
  }
}

console.log("\n  the run asks what came with it, and takes the question over");
{
  const r = await page.evaluate(ids => ids.map(id => ({
    id,
    groups: (SPEC_CHOICES[id] || []).map(g => g.label),
    covers: specCoversComplete(id),
    kitOpts: ((SPEC_CHOICES[id] || []).find(g => g.covers === "complete") || {options:[]})
               .options.map(o => o.t),
  })), BANDS.slice(1));
  r.forEach(x => {
    ok(x.groups.length > 0, `  ${x.id} asks something — ${x.groups.join(" | ") || "NOTHING"}`);
    /* The aisle's own toggle is 0.90, measured on FOUR CURRENT-GEN consoles
       listed console-only (0.92, 0.94, 0.89, 0.88). That is right for them
       and wrong for retro, where a bare machine is ~0.6 by two independent
       routes. covers:"complete" is what stops both being applied - the
       double-charge this codebase shipped once on a cordless drill. */
    ok(x.covers, `    and takes the aisle's 0.90 completeness toggle over, rather than stacking on it`);
  });
  const hh = r.find(x => x.id === "e5d"), con = r.find(x => x.id === "e5c");
  /* THE WEEDEATER GUARD. "i clciked the outdoor power tools button it went
     straight to bar lenght. what if it was a weedeater or a blower? that
     bar length question wouldnt even make sense." A Game Boy has no
     controller and no cables. This is that same fault, and it would have
     shipped: the console kit group opens with "Console, a controller and
     all the cables". */
  ok(hh && !hh.kitOpts.some(t => /controller|cable/i.test(t)),
     `  A HANDHELD IS NOT ASKED ABOUT CONTROLLERS OR CABLES — ${hh ? hh.kitOpts[0] : "?"}`);
  ok(hh && hh.kitOpts.some(t => /charger/i.test(t)),
     "  it is asked about the charger instead, which is what it actually loses");
  ok(con && con.kitOpts.some(t => /controller/i.test(t)),
     "  and a console still is asked about the controller");
  ok(hh && hh.kitOpts.some(t => /corro/i.test(t)),
     "  and about battery corrosion, which decides machine or parts donor");
}

console.log("\n  the collector questions refuse to guess, and say so");
{
  const r = await page.evaluate(() => {
    const box = (SPEC_CHOICES.e5c || []).find(g => /box/i.test(g.label));
    const varG = (SPEC_CHOICES.e5c || []).find(g => /plain|special/i.test(g.label));
    return {
      box: box ? box.options.map(o => ({t:o.t, m:o.m, note:o.note || ""})) : null,
      varG: varG ? varG.options.map(o => ({t:o.t, m:o.m, note:o.note || ""})) : null,
      lateBox: ((SPEC_CHOICES.e5b || []).find(g => /box/i.test(g.label)) || {options:[]})
                 .options.map(o => o.m),
    };
  });
  ok(!!r.box, "  retro is asked about the box and papers");
  const sealed = r.box && r.box.find(o => /sealed/i.test(o.t));
  ok(!!sealed, "    including sealed, which is a different market entirely");
  /* Measured loose->CIB is about 2.8x and sealed is 10x-45x on two or three
     sales a YEAR. Neither fits under the 1.8 clamp, so neither is claimed.
     What IS asserted is that the option admits it: a card that printed
     "+60%" with no word about the real spread would send a sealed SNES out
     of the door at a sixth of its price with nothing to warn anybody. */
  ok(sealed && /floor/i.test(sealed.note) && /look it up/i.test(sealed.note),
     "    and it calls its own multiplier a floor and says to look it up");
  const cib = r.box && r.box.find(o => /complete in box/i.test(o.t));
  ok(cib && /2\.8/.test(cib.note),
     "    the CIB option quotes the measured 2.8x it is not applying");
  const late = (r.lateBox || []).filter(m => m !== 1);
  ok(late.length && Math.max(...late) < 1.4,
     `  the 2005-2012 band's box is worth far less — ${late.join(",")} against retro's 1.6`);

  ok(!!r.varG, "  and whether it is a special edition");
  /* EVERY OPTION IS 1.0 AND THAT IS THE ASSERTION, not an oversight.
     Measured 1.7x (N64 Funtastic) to 4.4x (PS3 60GB backward-compatible)
     over the plain machine. One number inside a 1.8 clamp is wrong at both
     ends, so the group routes to a lookup and moves no money. If somebody
     later gives it a multiplier, this goes red and they have to argue for
     it in a commit. */
  ok(r.varG && r.varG.every(o => (o.m || 1) === 1),
     `  IT MOVES NO MONEY ON PURPOSE — ${r.varG ? r.varG.map(o => o.m).join(",") : "?"}`);
  const sp = r.varG && r.varG.find(o => /special/i.test(o.t));
  ok(sp && /look this one up/i.test(sp.note), "    it sends the counter to a lookup instead");
  ok(sp && /1\.7|4\.4/.test(sp.note), "    quoting the measured spread it will not guess at");
}

console.log("\n  no combination of answers can hit the clamp");
{
  /* THE ONE THAT WOULD HAVE CAUGHT ME. calcItem does
     spec.mult=Math.max(.4,Math.min(1.8,spec.mult)) AFTER multiplying every
     group together, silently. The notes on the card are printed from the
     options; the arithmetic uses the clamped product. Draft one of this
     change had box at 2.8 and variant at 1.4, which multiplies to 3.9 and
     would have printed "+180%" and "+40%" while the desk quietly used
     +80%. Every combination is walked here, not the extremes, because the
     extremes are not always the product that overflows. */
  const r = await page.evaluate(ids => {
    const out = {};
    for (const id of ids) {
      const gs = SPEC_CHOICES[id] || []; if (!gs.length) continue;
      let worstHi = 0, worstLo = 99, n = 0;
      const walk = (i, acc) => {
        if (i === gs.length) { n++; worstHi = Math.max(worstHi, acc);
                               worstLo = Math.min(worstLo, acc); return; }
        gs[i].options.forEach(o => walk(i + 1, acc * (o.m || 1)));
      };
      walk(0, 1);
      out[id] = {n, hi:+worstHi.toFixed(4), lo:+worstLo.toFixed(4)};
    }
    return out;
  }, BANDS.slice(1));
  for (const id of Object.keys(r)) {
    const x = r[id];
    ok(x.hi <= 1.8 + 1e-9,
       `  ${id}: ${x.n} combinations, dearest is ${x.hi} — under the 1.8 ceiling`);
    ok(x.lo >= 0.4 - 1e-9,
       `    cheapest is ${x.lo} — above the 0.4 floor, so the printed note is the figure used`);
  }
}

console.log("\n  the lookup buttons match the market they are for");
{
  const at = id => page.evaluate(i => {
    st.mode="item"; st.catId="elec"; st.itemId=i; st.picked=true;
    st.model=""; st.detail=""; render();
    return compTargets(calcItem()).map(t => ({id:t.id, url:t.url, sub:t.sub}));
  }, id);
  for (const id of BANDS) {
    const t = await at(id);
    const pc = t.find(x => x.id === "pc");
    ok(!!pc, `  ${id} offers PriceCharting`);
    ok(pc && /pricecharting\.com\/search-products/.test(pc.url) && /type=prices/.test(pc.url),
       `    pointed at its price search, with the words on it`);
  }
  /* WorthPoint's argument is the jewellery argument: eBay reaches back 90
     days and a Sega Saturn is a four-listing market. It does NOT belong on
     a PS4, which sells every day - putting a paid sign-in in front of the
     counter for a machine eBay prices fine is a cost with no answer. */
  for (const id of ["e5c", "e5d"])
    ok((await at(id)).some(x => x.id === "wp"), `  ${id} also offers WorthPoint — a thin, years-deep market`);
  for (const id of ["e5", "e5a", "e5b"])
    ok(!(await at(id)).some(x => x.id === "wp"),
       `  ${id} does NOT — eBay prices it fine and WorthPoint costs a sign-in`);

  const drill = await page.evaluate(() => {
    st.mode="item"; st.catId="tools"; st.itemId="t1"; st.picked=true; render();
    return compTargets(calcItem()).map(t => t.id);
  });
  ok(!drill.includes("pc"),
     `  and a cordless drill is offered none of it — ${drill.join(",")}`);
}

/* BOTH SURFACES, BECAUSE THEY DRIFT. phone.html loads app.js, so the
   catalog, SPEC_CHOICES and compTargets are genuinely shared here rather
   than copied - but "should be shared" is what the last four drift bugs in
   this repo all looked like from the desk side. Read off the phone. */
console.log("\n  the phone gets the same four bands and the same buttons");
{
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  const perr = []; ph.on("pageerror", e => perr.push(String(e)));
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  await ph.waitForTimeout(900);
  const r = await ph.evaluate(() => {
    const elec = CATALOG.find(c => c.id === "elec");
    st.mode="item"; st.catId="elec"; st.itemId="e5c"; st.picked=true;
    st.model="Nintendo 64"; st.detail=""; render();
    return {
      bands: ["e5a","e5b","e5c","e5d"].filter(id => elec.items.some(x => x.id === id)),
      groups: (SPEC_CHOICES.e5c || []).map(g => g.label),
      btns: compTargets(calcItem()).map(t => t.id),
      priced: (() => { const m = mpFor("e5c", "nintendo 64"); return m ? m[3] + "-" + m[4] : null; })(),
    };
  });
  ok(r.bands.length === 4, `  all four bands are on the phone too — ${r.bands.join(",")}`);
  ok(r.groups.length === 3, `  with the same three questions — ${r.groups.join(" | ")}`);
  ok(r.btns.includes("pc") && r.btns.includes("wp"),
     `  and PriceCharting and WorthPoint on the card — ${r.btns.join(",")}`);
  ok(r.priced === "80-110", `  and an N64 prices the same in the field — $${r.priced}`);
  /* The phone is the BUYING screen - yard sales, clearance racks, other
     shops - which is exactly where a retro console is found, and exactly
     where getting the generation wrong costs real money. */
  ok(perr.length === 0, "  no page errors on the phone" + (perr.length ? ": " + perr[0] : ""));
  await ph.close();
}

ok(errs.length === 0, "\n  no page errors at any point" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
