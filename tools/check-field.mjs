#!/usr/bin/env node
/* THE FIELD SCREEN WENT SILENT ON EVERYTHING AT A YARD SALE.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-field.mjs
 *
 * "lets put our focus on the mobile functions for helping me buy while im
 * outside the store." Measured before anything was changed, on five
 * ordinary driveway items, and the phone said NOTHING on all five:
 *
 *   Weber kettle grill    knew resale $32   knew buy $10   showed nothing
 *   Craftsman tool chest  knew resale $120  knew buy $30   showed nothing
 *   box of vinyl          knew resale $56   knew buy $20   showed nothing
 *   kids bicycle          knew resale $48   knew buy $15   showed nothing
 *   air compressor        knew resale $56   knew buy $20   showed nothing
 *
 * It found the right shelf row every time and had a figure in hand. It
 * refused to say it, because nothing had been LOOKED UP.
 *
 * That gate is right at the counter and wrong in a driveway: no signal,
 * somebody else reaching for the same grill, and the honest answer to "is
 * $25 too much" is not silence. The blank screen does not make him
 * careful, it makes him guess with no tool at all.
 *
 * WHAT MUST NOT HAVE SOFTENED is the fakes gate, and the last section is
 * only there to prove it did not. A fake is not worth a share of the real
 * one, it is worth nothing, and being in a hurry does not change that.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; } catch (e) { return null; } })()
].filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport: {width: 390, height: 780}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/phone.html", {waitUntil: "networkidle"});
await page.waitForTimeout(900);

console.log("\n  the machinery this suite is about exists");
const have = await page.evaluate(() => ({
  ph: typeof phVerdictHTML === "function",
  calc: typeof calcItem === "function" && typeof omniRows === "function",
  phone: !!window.PHONE,
}));
ok(have.ph && have.calc, "  the field verdict and the pricer are wired");
ok(have.phone, "  and this really is the phone surface");
if (!have.ph || !have.calc || !have.phone) {
  console.log("\n  (skipping the rest - there is nothing to check)");
  await browser.close(); console.log(`\n${fails} FAILED`); process.exit(1);
}

/* ------------------------------------------------------------------ */
console.log("\n  five things off a yard-sale table all get an answer");
const YARD = ["Weber kettle grill", "Craftsman tool chest", "vinyl records",
              "kids bicycle", "air compressor"];
const field = await page.evaluate((qs) => {
  const out = {};
  for (const q of qs) {
    st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
    st.condSet = false; st.completeSet = false; st.brandSet = false; st.model = "";
    st.specSel = {}; st.fakeAns = {}; st.fakeKey = mkKey(); st.ask = 0; st.askKey = "";
    const R = omniRows(q) || {}, rows = R.rows || [];
    const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
    if (!f) { out[q] = {noRow: true}; continue; }
    omniPick(f); st.condSet = true; st.completeSet = true;
    /* half of what it resells for - a real driveway ask */
    const x0 = calcItem();
    st.ask = Math.max(1, Math.round(x0.resale * 0.5)); st.askKey = mkKey();
    const x = calcItem();
    const h = phVerdictHTML(x);
    const txt = String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    out[q] = {checked: !!x.checked, resale: Math.round(x.resale), buy: x.buy, ask: st.ask,
              word: (String(h).match(/phWord">([^<]+)/) || [])[1] || "",
              est: /phVerdict [a-z]+ est|class="phEst"/.test(String(h)) || /Estimate/.test(txt),
              says: txt.slice(0, 110), empty: !h};
  }
  return out;
}, YARD);

for (const q of YARD) {
  const r = field[q];
  ok(r && !r.noRow && !r.empty && !!r.word,
     `${q} — resale $${r && r.resale}, they want $${r && r.ask} → "${r && r.word}"`);
}
/* THE ASSERTION THAT IS THE WHOLE POINT. Every one of these was false
   before, because nothing had been looked up. */
ok(YARD.every(q => field[q] && field[q].checked === false),
   "  and not one of them had anything looked up — which is why they were silent");
ok(YARD.every(q => field[q] && field[q].est),
   "  every one is marked an Estimate, in the warning ink");

/* ------------------------------------------------------------------ */
/* AN ESTIMATE MAY STOP A PURCHASE. IT MAY NOT AUTHORISE ONE.
   "i want verifiable sales data to back up every purchase." The two
   directions are not symmetrical. A built-in figure that is too LOW says
   Pass, he walks, and it costs a deal he did not make. Too HIGH says Good
   buy, he hands over cash, and it costs money out of the till against a
   number nobody measured.

   So the stopping words survive on an estimate and the GO word does not.
   This is the section that holds that, and it is the one that matters:
   everything else here is about the box being visible at all. */
console.log("\n  an estimate can stop a purchase, never authorise one");
{
  const r = await page.evaluate(() => {
    const set = (q, askPct, checked) => {
      st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
      st.condSet = false; st.completeSet = false; st.brandSet = false; st.model = "";
      st.specSel = {}; st.fakeAns = {}; st.fakeKey = mkKey(); st.ask = 0; st.askKey = "";
      const R = omniRows(q) || {}, rows = R.rows || [];
      const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
      if (!f) return null;
      omniPick(f); st.condSet = true; st.completeSet = true;
      const x0 = calcItem();
      if (checked) st.market = {kind: "hand", key: mkKey(), mid: Math.round(x0.resale)};
      const x1 = calcItem();
      /* an ask WELL under the buy figure - the strongest possible buy */
      st.ask = Math.max(1, Math.round(x1.buy * 0.5)); st.askKey = mkKey();
      const x = calcItem(); const h = String(phVerdictHTML(x) || "");
      return {word: (h.match(/phWord">([^<]+)/) || [])[1] || "", buy: x.buy,
              ask: st.ask, checked: !!x.checked,
              txt: h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")};
    };
    return {est: set("air compressor", 0.5, false), checked: set("air compressor", 0.5, true)};
  });
  ok(!!r.est && !!r.checked, "a bargain ask is reachable both ways");
  /* THE ASSERTION. A screaming bargain on an unmeasured figure must not
     get the word that means go ahead. */
  ok(r.est.word !== "Good buy",
     `$${r.est.ask} against a $${r.est.buy} buy, unmeasured — it says "${r.est.word}", not "Good buy"`);
  ok(/look it up|check a sold page/i.test(r.est.txt),
     "  and it says to go and check a sold page before buying");
  ok(/not a reason to hand over cash/i.test(r.est.txt),
     "  naming the reason, rather than just hedging");
  /* it must still SHOW the figure - he is in a driveway and may buy anyway */
  ok(r.est.txt.indexOf("$" + r.est.buy) >= 0,
     `  the $${r.est.buy} he would pay is still on screen — it stops telling him, not helping him`);
  /* AND THE CONTROL. With a real sold price the same ask DOES get the go
     word, or this has just broken the tool instead of tightening it. */
  ok(r.checked.word === "Good buy",
     `the same bargain WITH a sold price behind it still says "${r.checked.word}"`);
  /* the stopping direction is untouched on an estimate */
  const stop = await page.evaluate(() => {
    st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
    st.condSet = false; st.completeSet = false; st.brandSet = false; st.model = "";
    st.specSel = {}; st.fakeAns = {}; st.fakeKey = mkKey();
    const R = omniRows("air compressor") || {}, rows = R.rows || [];
    omniPick(rows.find(x => ["mp", "book", "item"].includes(x.kind)));
    st.condSet = true; st.completeSet = true;
    const x0 = calcItem();
    st.ask = Math.round(x0.resale * 1.5); st.askKey = mkKey();   /* way over */
    const h = String(phVerdictHTML(calcItem()) || "");
    return (h.match(/phWord">([^<]+)/) || [])[1] || "";
  });
  ok(stop === "Pass",
     `  while an ask well over the figure still stops him dead — "${stop}"`);
}

console.log("\n  a measured price does not wear the estimate banner");
const measured = await page.evaluate(() => {
  st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
  st.condSet = false; st.completeSet = false; st.brandSet = false; st.model = "";
  st.specSel = {}; st.fakeAns = {}; st.fakeKey = mkKey();
  const R = omniRows("air compressor") || {}, rows = R.rows || [];
  const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
  omniPick(f); st.condSet = true; st.completeSet = true;
  st.market = {kind: "hand", key: mkKey(), mid: 120};
  st.ask = 40; st.askKey = mkKey();
  const x = calcItem(); const h = phVerdictHTML(x);
  return {checked: !!x.checked, est: /class="phEst"/.test(String(h)),
          word: (String(h).match(/phWord">([^<]+)/) || [])[1] || ""};
});
ok(measured.checked === true, "a hand-entered sold price counts as checked");
ok(measured.est === false, "  so the banner is gone — it marks the estimate, not every answer");
ok(!!measured.word, `  and it still answers — "${measured.word}"`);

/* ------------------------------------------------------------------ */
console.log("\n  with no asking price there is still nothing to judge");
const noAsk = await page.evaluate(() => {
  st.ask = 0; st.askKey = "";
  return String(phVerdictHTML(calcItem()) || "");
});
/* That half of the gate was right and stays. A verdict needs a number to
   judge against; without one there is no question being asked. */
ok(noAsk === "", "nothing is shown until he types what they want for it");

/* ------------------------------------------------------------------ */
console.log("\n  the fakes gate did NOT soften");
const fake = await page.evaluate(() => {
  const ids = CATALOG.flatMap(c => c.items.map(i => i.id));
  const pick = id => {
    const c = CATALOG.find(y => y.items.some(i => i.id === id));
    st.flow = ""; st.mode = "item"; st.catId = c.id; st.itemId = id; st.picked = true;
    st.condSet = true; st.completeSet = true; st.market = null;
    st.fakeAns = {}; st.fakeKey = mkKey(); st.ask = 50; st.askKey = mkKey();
    return calcItem();
  };
  const id = ids.find(i => { const x = pick(i); const sh = fakeSheet(x);
    const F = sh ? fakeState(sh) : null; return !!(F && F.blocks); });
  if (!id) return null;
  const x = pick(id);
  const h = String(phVerdictHTML(x) || "");
  const txt = h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  return {id, html: h, txt, buy: x.buy,
          word: (h.match(/phWord">([^<]+)/) || [])[1] || ""};
});
ok(!!fake, "there is an item whose fakes sheet gates the phone");
if (!fake) { console.log("  (no gating sheet reachable)"); fails += 3; }
else {
  ok(/Not checked|Stop/.test(fake.word),
     `  it still stops dead rather than pricing — "${fake.word}"`);
  /* and it must not quote a buy figure next to that */
  ok(fake.html.indexOf("$" + fake.buy) < 0,
     `  with no $${fake.buy} buy figure beside it`);
  ok(!/class="phEst"/.test(fake.html),
     "  and it is not dressed as an ordinary estimate — a fake is worth nothing, not less");
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
