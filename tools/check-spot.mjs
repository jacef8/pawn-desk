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
    /* Read off heroWho, the DATE line - "The time should be up next to the
       date", reported with it sitting beside "GOLD, PER TROY OUNCE"
       instead. */
    const who = h => (h.match(/heroWho[^>]*>([\s\S]*?)<\/div>/)||[])[1]||"";
    const withTime = {clock: feedClock(), hero: who(homeHeroHTML({acts:false}))};
    FEED.at=null;
    const without = {clock: feedClock(), hero: who(homeHeroHTML({acts:false}))};
    return {withTime, without};
  });
  ok(/7:44\s*pm/i.test(c.withTime.clock),
     `  the feed's clock time reads back \u2014 "${c.withTime.clock}"`);
  ok(c.withTime.hero.includes(c.withTime.clock),
     `  and sits NEXT TO THE DATE, not beside the label \u2014 "${c.withTime.hero}"`);
  /* Both halves off the feed's own stamp: a date from the device clock
     beside a time from the feed reads as one fact and is not. */
  ok(/Sep 29/.test(c.withTime.hero),
     `  with the date the price is actually from \u2014 "${c.withTime.hero}"`);
  /* A time invented from this device's clock when the feed never answered
     would be the exact lie the timestamp exists to stop. */
  ok(c.without.clock === "" && !/\d:\d/.test(c.without.hero),
     `  with no feed answer there is NO time shown, not a made-up one \u2014 "${c.without.hero}"`);

  /* "we dont need the blue box on home screen to say 'nothing on the
     counter'". An item hero's .heroWhat names the item; the home hero's
     named the absence of one, which is the one thing the counter can
     already see. Asserted on BOTH machines and against the rest of the
     hero still being there - a home card that failed to render would
     otherwise pass this by containing nothing at all. */
  const hw = await page.evaluate(() => {
    FEED.gold=4123; FEED.silver=61; FEED.at=new Date().toISOString();
    const h=homeHeroHTML({acts:false});
    return {h, what:/heroWhat/.test(h), counter:/on the counter/i.test(h),
            big:/metBig/.test(h), lab:/troy oz/i.test(h)};
  });
  ok(hw.big && hw.lab, "  the home hero still renders its price and label");
  ok(!hw.what && !hw.counter,
     "  and carries no subject line at all \u2014 no \"Nothing on the counter\"");
}

/* "on that section what does 'nothing logged yet today' mean?" It meant
   the deal log, and nothing at all about the two prices it was sitting
   directly beneath - which is why it had to be asked. The tally is out of
   the hero now and on its own row underneath, where it is also the feed's
   header.
   Asserted on the RENDERED PAGE rather than on the function's string,
   because "outside the blue box" is a fact about where the element lands
   in the document: .closest(".hero") is the whole question, and a version
   that put the row back inside would still return the right words. */
console.log("\n  the day's tally sits outside the hero, and says what it counts");
{
  /* A FRESH PAGE, BECAUSE THE BLOCKS ABOVE LEAVE THIS ONE MID-ITEM. The
     first run of this found .dayRow missing and TWO OF THE FIVE
     ASSERTIONS PASSED ANYWAY - "the hero says nothing about the day"
     and "the feed does not label itself twice" are both true of a page
     with no home card on it at all. That is the green tick that means
     nothing, for the fifth time in this project. The guard is the first
     assertion: the row has to be FOUND before the rest can speak. */
  const home = await browser.newPage({viewport:{width:1440, height:900}});
  await home.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  await home.waitForTimeout(600);
  const day = await home.evaluate(() => {
    const day = todayStr();
    DEALS.length = 0; render();
    const q = () => document.querySelector(".dayRow");
    const empty = {txt: q() ? q().innerText.replace(/\s+/g," ").trim() : "",
                   inHero: q() ? !!q().closest(".hero") : null,
                   heroTxt: (document.querySelector(".homeHero")||{innerText:""}).innerText};
    DEALS.push({day, itemName:"14k chain", catLabel:"Gold", loan:375, status:"sold"},
               {day, brand:"Nintendo", model:"Game Boy Color", catLabel:"Electronics", loan:45, status:"lent"});
    render();
    const full = {txt: q() ? q().innerText.replace(/\s+/g," ").trim() : "",
                  inHero: q() ? !!q().closest(".hero") : null,
                  heads: document.querySelectorAll(".wSect").length};
    DEALS.length = 0; render();
    return {empty, full, found: !!q()};
  });
  ok(day.found, "  the home card renders a day row at all");
  ok(day.empty.inHero === false && day.full.inHero === false,
     `  the row is not inside the blue box — empty ${day.empty.inHero}, with deals ${day.full.inHero}`);
  ok(/priced today/i.test(day.empty.txt) && /nothing yet/i.test(day.empty.txt),
     `  with an empty log it names the log — "${day.empty.txt}"`);
  /* The old line said "nothing logged yet today" under two spot prices.
     If that wording ever comes back to the hero this goes red. */
  ok(!/logged|today/i.test(day.empty.heroTxt),
     `  and the hero says nothing about the day at all — "${day.empty.heroTxt.replace(/\s+/g," ").trim()}"`);
  ok(/2 deals/.test(day.full.txt) && /\$420/.test(day.full.txt),
     `  with two deals it counts them and totals what went out — "${day.full.txt}"`);
  /* The feed's own "Priced today" header came off when this row took the
     job; two labels an inch apart saying the same thing is how the card
     got muddled in the first place. */
  ok(day.full.heads === 0, `  and the feed does not label itself twice — ${day.full.heads} extra headers`);
  /* "Seperate this a little bit. A little more space between them." - the
     date and time ran straight into GOLD / TROY OZ, so the stamp read as
     part of the gold label instead of the line the whole card is stamped
     with. Measured off the rendered boxes, not off the stylesheet: a rule
     can be present and overridden, and what he is looking at is the gap. */
  const gap = await home.evaluate(() => {
    const who = document.querySelector(".homeHero .heroWho");
    const lab = document.querySelector(".homeHero .heroLab");
    if (!who || !lab) return null;
    return Math.round(lab.getBoundingClientRect().top - who.getBoundingClientRect().bottom);
  });
  ok(gap != null, "  the date line and the metal label are both on the card");
  ok(gap != null && gap >= 20,
     "  and the date is not sitting on top of the metals \u2014 " + gap + "px between them");
  /* "the date and time are not separated any more" - the other half of
     the same report. A single space each side of the middot is not a
     separation at 12.5px, so the day and the time ran together into one
     lump. Measured between the two boxes, same as the gap above. */
  const split = await home.evaluate(() => {
    /* The split only exists when the feed has answered - with no stamp
       there is no time to separate the day from, and the line falls back
       to the plain day on purpose. Give it a stamp first, or this
       measures the fallback and reports null. */
    FEED.at = new Date().toISOString(); render();
    const d = document.querySelector(".homeHero .whoDay");
    const t = document.querySelector(".homeHero .whoAt");
    if (!d || !t) return null;
    return Math.round(t.getBoundingClientRect().left - d.getBoundingClientRect().right);
  });
  ok(split != null, "  the day and the time are their own pieces, not one string");
  ok(split != null && split >= 14,
     "  with air between them - " + split + "px from the day to the time");
}

/* "next to the metal prices, can we put a little icon for trends.
   somehting like an up trend arrow or down trend arrow." Read off this
   repo's own LBMA series - the spot against 22 trading days back, about a
   calendar month - with a dead band, because gold's median day-over-day
   move is 0.71% and a month drifts a point and a half on noise alone. An
   arrow that flips on noise is a claim the data does not support. */
console.log("\n  the trend arrow says which way, and nothing else");
{
  const tr = await browser.newPage({viewport:{width:1440, height:900}});
  const terr = []; tr.on("pageerror", e => terr.push(String(e)));
  await tr.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  await tr.waitForTimeout(900);
  const src = await (await fetch(BASE + "/app.js")).text();
  const r = await tr.evaluate((src) => {
    if (typeof metalArrow !== "function") return {missing:true};
    const S = metalSeries("gold");
    if (!S || S.length < 23) return {noSeries:true};
    const monthAgo = S[S.length - 23][1];
    /* Drive it off the live spot, which is what the function reads, so the
       move is a number this test chose rather than whatever the feed
       happens to be doing today. */
    const at = move => { FEED.gold = monthAgo * (1 + move/100); st.manual = null; st.spotHold = null;
                         return metalArrow("gold"); };
    const out = {
      up: at(6), down: at(-6), flatUp: at(1.9), flatDown: at(-1.9),
      edgeUp: at(2.1), edgeDown: at(-2.1),
    };
    /* AND IT MUST NOT TOUCH THE MONEY. Nothing in calcMetal reads it, and
       this is the assertion that keeps it that way: the same spot, the
       same quote, whichever way the arrow points. */
    /* The first version of this fed the same spot twice and asserted the
       same answer came back, which is a tautology. The real question is
       structural: is the arrow wired into anything that makes money? So
       count the call sites. One definition, one call from the icon that
       draws it, nothing else. Wire it into calcMetal or suggestPay and
       this goes red. */
    const calls = (src.match(/metalArrow\s*\(/g) || []).length - 1;
    const fnBody = name => { const k = src.indexOf("function " + name + "("); return k < 0 ? "" : src.slice(k, k + 4000); };
    out.refs = {calls,
      inMoney: ["calcMetal","suggestPay","suggestRate","metalGuard","lendPct","calcItem"]
        .find(n => /metalArrow|trendIcon/.test(fnBody(n))) || ""};
    /* on the card, next to each price */
    st.mode="item"; FEED.silver = 60; FEED.at = new Date().toISOString(); render();
    const d = document.createElement("div"); d.innerHTML = homeHeroHTML({acts:false});
    out.icons = [...d.querySelectorAll(".metCell")].map(c => {
      const i = c.querySelector(".trendIc"), b = c.querySelector(".metBig");
      return {has: !!i, inBig: !!(b && b.querySelector(".trendIc")), title: i ? i.getAttribute("title") : ""};
    });
    return out;
  }, src);
  await tr.close();
  ok(!r.missing && !r.noSeries, "  there is a price series to read a trend off");
  if (r.missing || r.noSeries) console.log("  (skipping the rest)");
  else {
  ok(r.up.dir === "up" && r.down.dir === "down",
     `  a 6% month points the right way — ${r.up.dir} / ${r.down.dir}`);
  ok(r.flatUp.dir === "flat" && r.flatDown.dir === "flat",
     `  under 2% either way is flat, not a direction — ${r.flatUp.pct.toFixed(1)}% and ${r.flatDown.pct.toFixed(1)}%`);
  ok(r.edgeUp.dir === "up" && r.edgeDown.dir === "down",
     "  and just past 2% it commits");
  /* The one that matters. An arrow beside a price at a pawn counter would
     be read as a reason to pay differently if it ever moved one. */
  ok(r.refs.calls === 1 && !r.refs.inMoney,
     "  the arrow is read by the icon and by nothing that makes money - " + r.refs.calls
     + " call site" + (r.refs.calls===1?"":"s") + (r.refs.inMoney ? ", AND IT IS IN " + r.refs.inMoney : ""));
  ok(r.icons.length === 2 && r.icons.every(i => i.has && i.inBig),
     `  both metals carry one, beside the number — ${r.icons.map(i => i.has).join(", ")}`);
  ok(r.icons.every(i => /%/.test(i.title) && /month/.test(i.title)),
     `  and each says what it is claiming — "${r.icons[0].title}"`);
  }
  ok(terr.length === 0, "  no page errors" + (terr.length ? ": " + terr[0] : ""));
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
