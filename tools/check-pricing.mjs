#!/usr/bin/env node
/* Money rules that are easy to break and expensive to get wrong.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-pricing.mjs
 *
 * WHOSE NUMBER IS IT. A resale value the counter typed is what THIS one is
 * worth - they have the thing in their hands and the scratches are already
 * in the figure. A resale value off the price list describes a typical good
 * one. Multiply the first by the condition adjustment and the wear is priced
 * twice: type $300 for a rough TV and the desk quietly lends against $135.
 * The second must still be adjusted, or condition stops meaning anything.
 * Both directions are checked here because a fix for either one alone looks
 * right and is wrong.
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
const page = await browser.newPage({viewport:{width:1400,height:900}});
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});

const r = await page.evaluate(() => {
  const c = CATALOG.find(x => x.items.some(i => i.id === "e1"));
  st.mode = "item"; st.catId = c.id; st.itemId = "e1"; st.picked = true;

  const at = (cond) => { st.cond = cond; const x = calcItem();
    return {resale: Math.round(x.resale), hand: x.handSet, target: x.target}; };

  /* typed by hand */
  st.market = {kind:"hand", key: mkKey(), mid: 300};
  const handGood = at("good"), handRough = at("rough"), handNew = at("new");

  /* off the list - same shape of object, different provenance */
  st.market = {kind:"list", key: mkKey(), mid: 300, lo:280, hi:320, name:"x", conf:"h",
               date: todayStr(), src:"https://www.ebay.com", note:"", stale:false};
  const listGood = at("good"), listRough = at("rough");

  st.market = null; st.cond = "good";
  return {handGood, handRough, handNew, listGood, listRough};
});

console.log("\n  a resale value the counter typed");
ok(r.handGood.hand === true, "is flagged as hand-set");
ok(r.handGood.resale === 300, "reads $300 in good — got $" + r.handGood.resale);
ok(r.handRough.resale === 300, "STILL $300 in rough — the wear is already in it (got $" + r.handRough.resale + ")");
ok(r.handNew.resale === 300, "still $300 at new in box — got $" + r.handNew.resale);
ok(r.handRough.target === r.handGood.target, "so the loan does not move with condition either");

console.log("\n  a resale value off the price list");
ok(r.listGood.hand === false, "is not flagged as hand-set");
ok(r.listGood.resale === 300, "reads $300 in good — got $" + r.listGood.resale);
ok(r.listRough.resale < r.listGood.resale,
   "and DOES drop in rough — $" + r.listGood.resale + " to $" + r.listRough.resale
   + " (a list price describes a typical good one)");

console.log("\n  the TV is not named for one size band");
{
  const tv = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "e1"));
    const g = (SPEC_CHOICES["e1"] || []).find(z => /screen/i.test(z.label));
    return {name: c.items.find(i => i.id === "e1").name, sizes: g ? g.options.map(o => o.t) : []};
  });
  ok(!/50\s*to\s*65/i.test(tv.name), 'the name does not claim a size — "' + tv.name + '"');
  ok(/tv/i.test(tv.name), "and still says TV, so it is still searchable");
  ok(tv.sizes.length >= 4, "the picker offers every band — " + tv.sizes.join(" / "));
}

/* THE METER. Its whole job is to tell a number resting on real sales apart
   from one resting on what sellers hope for. If those two ever render the
   same, it is worse than not being there - it dresses a guess up as
   evidence. So the asking-heavy case is checked for the warning tone AND
   the words, not just for drawing something. */
console.log("\n  the meter behind the number");
{
  const w = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
    st.mode = "item"; st.catId = c.id; st.itemId = "t1"; st.picked = true; st.page = "offer";
    const grab = () => { render(); const el = document.querySelector(".wCard");
      if (!el) return null;
      const fill = el.querySelector(".wBar i");
      return {text: el.innerText.replace(/\s+/g, " "),
              tone: fill ? fill.className : "", width: fill ? fill.style.width : ""}; };
    const out = {};
    st.market = null; out.none = grab();
    st.market = {kind:"found", key:mkKey(), n:12, med:110, lo:95, hi:130, sold:9,
                 mostlyAsks:false, conf:"h", mid:110, from:"eBay 9 \u00b7 Shopping 3"};
    out.sold = grab();
    st.market = {kind:"found", key:mkKey(), n:10, med:140, lo:120, hi:160, sold:1,
                 mostlyAsks:true, conf:"l", mid:140, from:"Shopping 7 \u00b7 eBay 3"};
    out.asks = grab();
    st.market = {kind:"hand", key:mkKey(), mid:150}; out.hand = grab();
    st.market = null; return out;
  });

  ok(w.none && /not checked/i.test(w.none.text), "an unchecked item says so — " + (w.none && w.none.text.slice(0, 44)));
  ok(w.none && w.none.tone.includes("none"), "and its bar is drawn empty, not full");

  ok(w.sold && /12 listings/.test(w.sold.text), "counts the listings — " + (w.sold && w.sold.text.slice(0, 40)));
  ok(w.sold && /9 sold/.test(w.sold.text) && /3 asking/.test(w.sold.text), "splits sold from asking");
  ok(w.sold && /eBay 9/.test(w.sold.text), "names the sites they came from");
  ok(w.sold && !w.sold.tone.includes("warn"), "mostly-sold is NOT flagged");
  ok(w.sold && parseInt(w.sold.width) === 75, "the bar is the sold share — 9 of 12 = 75%, got " + (w.sold && w.sold.width));

  ok(w.asks && w.asks.tone.includes("warn"), "mostly-asking IS flagged");
  ok(w.asks && /mostly asking/i.test(w.asks.text), "and says so in words, not just colour");
  ok(w.asks && /ceiling/i.test(w.asks.text), "and says what to do about it");
  ok(w.asks && parseInt(w.asks.width) === 10, "its bar is 1 of 10 = 10%, got " + (w.asks && w.asks.width));

  ok(w.hand && /your own figure/i.test(w.hand.text), "a typed number is named as yours");
  ok(w.hand && /condition does not adjust/i.test(w.hand.text), "and repeats that condition will not touch it");
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
