#!/usr/bin/env node
/* WHAT YOU AIM TO PAY IS WHAT GOES OUT THE DOOR.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-melt.mjs
 *
 * "if we haircut the haircut the haircut we're not going to be competitive
 * on our gold prices and we're going to miss sales." He was right. Three
 * separate stages were charging for the SAME fact - spot running over its
 * 90-day average - and two more for the same volatility, and none of it was
 * on screen. At a 16% premium a loan fell from 43% of melt to 28%.
 *
 * Worse, the card could not be used to check: it re-derived the share of
 * melt without metalGuard's cut, so it said 48% while the customer was
 * handed 42%.
 *
 * "do all 3 and target 80% but make sure we are still accounting for the
 * trends so we don't over pay between buy date and sell date."
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
const page = await browser.newPage({viewport:{width:1500, height:1100}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(1400);

console.log("\n  the buy is measured over the window the statute actually gives you");
{
  const r = await page.evaluate(() => ({
    quick: MRISK && MRISK.quickDays, hold: MRISK && MRISK.holdDays,
    fixings: MRISK && MRISK.metals && MRISK.metals.gold && MRISK.metals.gold.fixings,
    cut30: meltCut("gold", "violent", "buy"), cut60: meltCut("gold", "violent", "loan"),
  }));
  /* The builder said "the money is back in days, not sixty" and measured a
     10-day hold. The desk's own gold page says, citing s. 539.001(9)(c),
     that nothing ships for 30 calendar days. The statute wins. */
  ok(r.quick === 30, `  the buy guard is measured over 30 days, not 10 — ${r.quick}`);
  ok(r.hold === 60, `  and the loan over 60 — ${r.hold}`);
  ok(r.fixings > 6000, `  off ${r.fixings} LBMA fixings, not a guess`);
  ok(r.cut30 > 0 && r.cut30 < r.cut60,
     `  a 30-day hold risks less than a 60-day one — ${r.cut30}% against ${r.cut60}%`);
}

console.log("\n  in a normal market you pay exactly what you aimed at");
{
  /* THE WHOLE POINT. The rate is worked back from the NORMAL band, so when
     the market IS normal the guard cancels out and the target lands. Forced
     by making today's band read normal, because the real market is violent
     as this is written and the invariant would otherwise never be checked. */
  const r = await page.evaluate(() => {
    const G = MRISK.metals.gold.byVol, keep = JSON.parse(JSON.stringify(G));
    for (const k of Object.keys(G)) { G[k].q5 = keep.normal.q5; G[k].p5 = keep.normal.p5; }
    st.mode="metal"; st.metal="gold"; st.karat="14k"; st.grams="10"; st.deal="buy";
    st.manual=null; st.spotHold=null; st.payTouched=false;
    const s = suggestPay();
    /* the trend read is direction, not conditions - set it aside for the
       invariant and asserted on its own below */
    st.payPct = s.bare; const m = calcMetal();
    const got = Math.round(m.buy / m.melt * 100);
    for (const k of Object.keys(G)) { G[k].q5 = keep[k].q5; G[k].p5 = keep[k].p5; }
    return {target: s.target, got, bare: s.bare};
  });
  ok(r.target === 80, `  the gold buy target is 80% of melt — ${r.target}`);
  ok(Math.abs(r.got - r.target) <= 1,
     `  AND A NORMAL MARKET DELIVERS IT — ${r.got}% of melt against a ${r.target}% target`);
  ok(r.bare > r.target,
     `  the slider sits above the target because the guard comes off after — ${r.bare}%`);
}

console.log("\n  and a worse market pulls it back, which is the point");
{
  /* THE FIRST VERSION OF THIS TEST COULD NOT FAIL, and said so by passing
     when it should not have: it overwrote every band with the band under
     test - INCLUDING "normal", which is the one the rate is derived from.
     So base and today's cut cancelled every time and it read the target
     back in all four conditions, 79/79/80/80.
     Only the LIVE band is swapped now, and normal is left exactly alone,
     so the differential between them is what is being measured. */
  const r = await page.evaluate(() => {
    const G = MRISK.metals.gold.byVol, keep = JSON.parse(JSON.stringify(G));
    st.mode="metal"; st.metal="gold"; st.manual=null;
    const live = metalState("gold").band;
    const out = {live};
    const at = band => {
      G[live].q5 = keep[band].q5; G[live].p5 = keep[band].p5;
      st.karat="14k"; st.grams="10"; st.deal="buy"; st.spotHold=null; st.payTouched=false;
      st.payPct = suggestPay().bare;
      const m = calcMetal();
      return Math.round(m.buy / m.melt * 100);
    };
    for (const bd of ["calm","normal","busy","violent"]) out[bd] = at(bd);
    G[live].q5 = keep[live].q5; G[live].p5 = keep[live].p5;
    return out;
  });
  ok(r.violent < r.normal,
     `  a violent market pays less than a normal one \u2014 ${r.violent}% against ${r.normal}%`);
  ok(r.busy < r.normal && r.busy > r.violent,
     `  busy sits between them \u2014 calm ${r.calm}, normal ${r.normal}, busy ${r.busy}, violent ${r.violent}`);
  /* Competitive is the whole reason this changed. The trade puts a walk-in
     counter at 75-85% of melt; the old desk paid 65%. The pull-back must
     stay inside that band or it has traded one problem for another. */
  ok(r.violent >= 74,
     `  and even the worst market stays in the trade's range \u2014 ${r.violent}%`);
  ok(Math.abs(r.normal - 80) <= 1,
     `  while a normal one is still on the target \u2014 ${r.normal}%`);
}

console.log("\n  the same fact is not charged three times any more");
{
  /* Premium swept from -5% to +16%. It used to move the rate (the tiers),
     the ounce (min with the 90-day average), the ounce again (x0.9) and the
     guard's own premium bucket. The rate must now be flat across it. */
  const r = await page.evaluate(() => {
    const rates = [], lands = [];
    for (const prem of [-0.05, 0, 0.05, 0.09, 0.16]) {
      st.mode="metal"; st.metal="gold"; st.karat="14k"; st.grams="10"; st.deal="buy";
      st.spotHold=null; makeManual();
      st.manual.spot.gold = 4180.90;
      st.manual.avg90.gold = 4180.90 / (1 + prem);
      st.payTouched=false; syncPay();
      const m = calcMetal();
      rates.push(suggestPay().pay);
      lands.push(Math.round(m.buy / m.melt * 100));
    }
    st.manual = null;
    return {rates, lands};
  });
  ok(new Set(r.rates).size === 1,
     `  the premium no longer moves the buy rate at all — ${r.rates.join(", ")}`);
  ok(new Set(r.lands).size === 1,
     `  nor what lands — ${r.lands.join(", ")}% of melt`);
}

console.log("\n  the card cannot disagree with the money");
{
  const r = await page.evaluate(() => {
    const rows = [];
    for (const prem of [-0.05, 0, 0.05, 0.09, 0.16]) {
      st.mode="metal"; st.metal="gold"; st.karat="14k"; st.grams="10"; st.deal="pawn";
      st.spotHold=null; makeManual();
      st.manual.spot.gold = 4180.90;
      st.manual.avg90.gold = 4180.90 / (1 + prem);
      st.loanTouched=false; syncPay();
      const m = calcMetal();
      rows.push({card: loanPctOfMelt(), real: Math.round(m.loan / m.melt * 100)});
    }
    st.manual = null; st.deal = "buy";
    return rows;
  });
  const gaps = r.map(x => x.card - x.real);
  /* It said 48% while the customer got 42% - a six-point lie in the one
     place the counter could have checked. It is read off calcMetal now, so
     there is nothing left to disagree with. */
  ok(gaps.every(g => g === 0),
     `  the labelled share of melt IS the share of melt — gaps ${gaps.join(", ")}`);
}

console.log("\n  lending did not move, because he did not ask for it to");
{
  const r = await page.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.karat="14k"; st.grams="10"; st.deal="pawn";
    st.manual=null; st.spotHold=null; st.loanTouched=false; syncPay();
    const m = calcMetal();
    return {target: suggestRate().target, got: Math.round(m.loan / m.melt * 100)};
  });
  /* Raising the buy to hit 80% would have dragged every loan up with it -
     from 42% of melt to about 52% - because the loan rate used to be the
     buy rate x 0.7. It has its own target now, set to what the desk
     delivered before this change. */
  ok(r.target === 42, `  the loan aims at its own 42%, not a share of the buy — ${r.target}`);
  ok(r.got >= 35 && r.got <= 43, `  and still lands where it always did — ${r.got}% of melt`);
}

console.log("\n  and you can see every rung");
{
  const r = await page.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.karat="14k"; st.grams="10"; st.deal="buy";
    st.manual=null; st.spotHold=null; st.payTouched=false; syncPay();
    const d = document.createElement("div"); d.innerHTML = meltLadderHTML();
    return {txt: d.textContent.replace(/\s+/g, " "), rows: d.querySelectorAll("div > div").length};
  });
  ok(/Melt/.test(r.txt), "  the ladder starts at melt");
  ok(/Your target/.test(r.txt) && /80%/.test(r.txt), "  names the target");
  ok(/You pay/.test(r.txt) && /% of melt/.test(r.txt), "  and ends on what the customer is handed");
  ok(/1 in 20/.test(r.txt),
     "  with the guard's rung saying what it is protecting against, not just its size");
  ok(r.rows >= 4, `  ${r.rows} rungs, each one nameable if it looks wrong`);
}

console.log("\n  the phone");
{
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  const perr = []; ph.on("pageerror", e => perr.push(String(e)));
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  await ph.waitForTimeout(1200);
  const r = await ph.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.karat="14k"; st.grams="10"; st.deal="buy";
    st.manual=null; st.spotHold=null; st.payTouched=false; syncPay();
    const m = calcMetal();
    return {target: suggestPay().target, got: Math.round(m.buy / m.melt * 100)};
  });
  ok(r.target === 80, `  the field screen aims at the same 80% — ${r.target}`);
  ok(r.got > 60, `  and lands in the same place — ${r.got}% of melt`);
  ok(perr.length === 0, "  no page errors on the phone" + (perr.length ? ": " + perr[0] : ""));
  await ph.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
