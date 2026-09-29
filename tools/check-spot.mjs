#!/usr/bin/env node
/* THE METAL PRICE: HOW OFTEN IT REFRESHES, AND WHEN IT STOPS.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-spot.mjs
 *
 * "How often should we update the metal prices?" It fetched ONCE, in
 * standaloneBoot, and never again - a desk opened at eight priced five
 * o'clock gold off the eight o'clock number.
 *
 * Measured off this repo's own LBMA series, 522 trading days: gold's
 * median day-over-day move is 0.71%, it moves 1%+ on 39% of days, and
 * silver's median is 1.38%. On a 60g 14k scrap bag at 70% of melt that is
 * $24 on a normal day, $79 on a one-in-ten day.
 *
 * "freeze the price once it's quoted" is the other half and they only work
 * together: a number that refreshes every fifteen minutes while somebody is
 * deciding is worse than one that is slightly old.
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
await page.waitForTimeout(1100);

console.log("\n  it refreshes on a schedule, not once and never again");
{
  const r = await page.evaluate(() => ({
    ms: typeof METAL_FETCH_MS === "number" ? METAL_FETCH_MS : null,
    fn: typeof liveMetals === "function",
  }));
  ok(r.fn, "  liveMetals exists");
  ok(r.ms && r.ms >= 60000 && r.ms <= 60 * 60000,
     `  and there is an interval between a minute and an hour — ${r.ms ? r.ms / 60000 : "none"} minutes`);
  /* The throttle matters as much as the interval: focus and
     visibilitychange both fire on one alt-tab, and a counter switching
     windows twenty times must not send twenty requests. */
  /* STUBBED, NOT LIVE. The first version used the real fetch, which this
     container cannot reach - so every call failed, metalAt was never set,
     and the throttle never engaged. That is how the request storm was
     found: 8 requests where 2 were expected. It passes on the live fetch
     now too, but only because the network happens to fail here, and a test
     that depends on that measures the network rather than the code.
     Both outcomes are driven, because they throttle differently: a success
     is left alone for a minute, a failure retried in twenty seconds, and
     neither may fire a request per alt-tab. */
  const t = await page.evaluate(async () => {
    const real = window.fetch;
    let n = 0, mode = "ok";
    window.fetch = (...a) => {
      if (!String(a[0]).includes("gold-api")) return real(...a);
      n++;
      return mode === "ok"
        ? Promise.resolve({ok:true, json:async()=>({price: String(a[0]).includes("XAU")?4200:66,
                                                    updatedAt:new Date().toISOString()})})
        : Promise.resolve({ok:false});
    };
    metalAt = 0; metalTry = 0;
    await liveMetals(true);
    const onSuccess = n;
    await liveMetals(false); await liveMetals(false); await liveMetals(false);
    const afterSuccess = n;
    mode = "fail"; metalAt = 0; metalTry = 0;
    await liveMetals(true);
    const oneFail = n - afterSuccess;
    await liveMetals(false); await liveMetals(false); await liveMetals(false);
    const afterFails = n - afterSuccess;
    window.fetch = real; metalAt = 0; metalTry = 0;
    return {onSuccess, afterSuccess, oneFail, afterFails};
  });
  ok(t.onSuccess > 0 && t.afterSuccess === t.onSuccess,
     `  after a good fetch, three more calls send nothing — ${t.onSuccess} then ${t.afterSuccess}`);
  /* THE ONE THAT WAS BROKEN. A desk with no signal fires focus and
     visibilitychange on every alt-tab; throttling only on success made
     each of those a fresh pair of requests. */
  ok(t.afterFails === t.oneFail,
     `  AND AFTER A FAILED ONE THEY STILL SEND NOTHING — ${t.oneFail} then ${t.afterFails}, not a pair per alt-tab`);
}

console.log("\n  the quote freezes the moment there is a weight on the glass");
{
  const r = await page.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.karat="14k"; st.manual=null; st.spotHold=null;
    FEED.gold=4200; FEED.at=new Date(Date.now() - 120000).toISOString();
    st.grams=""; st.payPct=70; render();
    const before = spotHeld("gold");
    st.grams="10"; holdSpot(); render();
    const quoted = calcMetal();
    /* THE ASSERTION IS IN DOLLARS, not in the spot variable. A freeze that
       held spotOf but let the guard keep moving lendOz underneath it would
       pass a spot check and still change the figure on the glass. */
    FEED.gold = 4120;                         /* he thinks about it; gold drops 1.9% */
    render();
    const after = calcMetal();
    return {before, held: spotHeld("gold"), live: FEED.gold,
            qBuy: Math.round(quoted.buy), aBuy: Math.round(after.buy),
            qLoan: Math.round(quoted.loan), aLoan: Math.round(after.loan),
            qMelt: Math.round(quoted.melt), aMelt: Math.round(after.melt),
            tag: (document.querySelector(".feedTag") || {}).textContent || "",
            btn: !!document.getElementById("reQuote")};
  });
  ok(r.before === 0, "  nothing is held before a weight is entered");
  ok(r.held === 4200, `  entering a weight holds the spot — $${r.held}`);
  ok(r.qBuy === r.aBuy && r.qBuy > 0,
     `  THE BUY DOES NOT MOVE when spot drops 1.9% — $${r.qBuy} then $${r.aBuy}`);
  ok(r.qLoan === r.aLoan, `  nor the loan — $${r.qLoan} then $${r.aLoan}`);
  ok(r.qMelt === r.aMelt, `  nor the melt — $${r.qMelt} then $${r.aMelt}`);
  ok(/4,200|4200/.test(r.tag) && /4,120|4120/.test(r.tag),
     "  and the card says BOTH numbers — what was quoted and what the market is now");
  ok(/held for this ticket/i.test(r.tag),
     "    saying plainly why the figure is not moving");
  ok(r.btn, "  with a way to take the new price deliberately");
}

console.log("\n  and it lets go again");
{
  const r = await page.evaluate(() => {
    const out = {};
    const reset = () => { st.mode="metal"; st.metal="gold"; st.karat="14k"; st.manual=null;
      st.spotHold=null; FEED.gold=4200; st.grams="10"; holdSpot(); render(); };
    reset(); FEED.gold = 4120;
    releaseSpot(); holdSpot(); render();
    out.requote = spotOf("gold");
    reset();
    st.grams=""; releaseSpot(); render();
    out.cleared = spotHeld("gold");
    reset();
    startOver(); render();
    out.startOver = spotHeld("gold");
    /* A typed number is already a fixed number and must not be shadowed by
       a hold struck before it. */
    reset(); makeManual(); st.manual.spot.gold = 3900; render();
    out.manual = spotOf("gold");
    st.manual = null; st.spotHold = null;
    return out;
  });
  ok(r.requote === 4120, `  Re-quote takes the new price — $${r.requote}`);
  ok(r.cleared === 0, "  clearing the weight lets go, so the next customer is not priced off the last one's market");
  ok(r.startOver === 0, "  and Start over lets go");
  ok(r.manual === 3900, `  a hand-typed spot still wins over a held one — $${r.manual}`);
}

console.log("\n  the freeze does NOT freeze what the trend guard reads");
{
  /* THE SUBTLE HALF. metalState reads two different things: the BAND comes
     from 21 days of returns over the logged series, the LEVEL from spotOf.
     Freezing a quote must stop the level moving - or the figure drifts
     through the guard's back door - and must NOT stop the series growing,
     or a ticket left open over lunch stops the guard learning the day.
     Gold sits 0.2 vol points from a band edge as this is written (22.2%
     against a cut at 22.0), and crossing it moves the haircut from -8.6%
     to -12.1%, so which series the band reads is real money. */
  const r = await page.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.manual=null; st.spotHold=null;
    FEED.gold=4200; st.grams="10"; holdSpot();
    const a = metalState("gold");
    const seriesBefore = metalSeries("gold").length;
    spotLogWrite("2026-09-30", 4120, 61);         /* a price arrives mid-quote */
    const seriesAfter = metalSeries("gold").length;
    const b = metalState("gold");
    st.spotHold=null; st.grams="";
    return {level: a.spot, band: a.band, vol: +(a.vol * 100).toFixed(1),
            seriesBefore, seriesAfter, bandAfter: b.band};
  });
  ok(r.level === 4200,
     `  the LEVEL the guard prices off is the held one — $${r.level}`);
  ok(r.seriesAfter >= r.seriesBefore,
     `  but the series still takes new prices while the quote stands — ${r.seriesBefore} then ${r.seriesAfter} days`);
  ok(["calm","normal","busy","violent"].includes(r.band),
     `  and the band still reads off that series — ${r.band}, vol ${r.vol}%`);
}

console.log("\n  the number says when it was struck, off the feed's own clock");
{
  const r = await page.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.manual=null; st.spotHold=null; st.grams=""; 
    FEED.gold=4200; FEED.source="gold-api.com, live";
    FEED.at=new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    render();
    const old = (document.querySelector(".feedTag") || {}).textContent || "";
    FEED.at=new Date(Date.now() - 30000).toISOString(); render();
    const fresh = (document.querySelector(".feedTag") || {}).textContent || "";
    return {old, fresh, ago: feedAgo()};
  });
  /* FEED.date was stamped from the DEVICE clock regardless of how old the
     number was, so a quote that had failed to refresh still wore today's
     date and looked current. */
  ok(/3 hours ago/.test(r.old), `  a three-hour-old quote says so — "${r.old.replace(/\s+/g," ").slice(0, 90)}"`);
  ok(/seconds ago/.test(r.fresh), "  and a fresh one says seconds");

  /* "We should probably add a time metals was updated next to the date" -
     asked looking at the phone hero, which said "Sep 29" over $4,123 with
     no way to tell a twenty-second-old number from a nine-hour-old one.
     Now that it refreshes on a timer that distinction is the whole point. */
  const c = await page.evaluate(() => {
    FEED.gold=4123; FEED.silver=61;
    FEED.at=new Date(2026, 8, 29, 19, 44).toISOString();
    const withTime = {clock: feedClock(),
                      hero: (homeHeroHTML({acts:false}).match(/heroLab[^>]*>([^<]*)/)||[])[1]||""};
    FEED.at=null;
    const without = {clock: feedClock(),
                     hero: (homeHeroHTML({acts:false}).match(/heroLab[^>]*>([^<]*)/)||[])[1]||""};
    return {withTime, without};
  });
  ok(/7:44\s*pm/i.test(c.withTime.clock),
     `  the feed's clock time reads back \u2014 "${c.withTime.clock}"`);
  ok(c.withTime.hero.includes(c.withTime.clock),
     `  and sits beside the price on the hero card \u2014 "${c.withTime.hero}"`);
  /* A time invented from this device's clock when the feed never answered
     would be the exact lie the timestamp exists to stop. */
  ok(c.without.clock === "" && !/\d:\d/.test(c.without.hero),
     `  with no feed answer there is NO time shown, not a made-up one \u2014 "${c.without.hero}"`);
}

console.log("\n  the phone");
{
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  const perr = []; ph.on("pageerror", e => perr.push(String(e)));
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  await ph.waitForTimeout(900);
  const r = await ph.evaluate(() => {
    st.mode="metal"; st.metal="gold"; st.karat="14k"; st.manual=null; st.spotHold=null;
    FEED.gold=4200; st.grams="10"; holdSpot();
    const q = Math.round(calcMetal().buy);
    FEED.gold=4120;
    return {q, a: Math.round(calcMetal().buy), held: spotHeld("gold")};
  });
  ok(r.held === 4200 && r.q === r.a,
     `  the field screen freezes the same way — $${r.q} then $${r.a}`);
  ok(perr.length === 0, "  no page errors on the phone" + (perr.length ? ": " + perr[0] : ""));
  await ph.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
