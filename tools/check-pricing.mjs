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

/* The strip beside the number. "12 sold" is a claim; the pictures are the
   evidence, and they only help if they are BESIDE the price at the moment
   the counter is deciding - not back on the step that set it. */
console.log("\n  the comps the number was built from");
{
  const t = await page.evaluate(() => {
    const now = Date.now();
    const mk = (i, price, basis, img) => ({id:"t"+i, ts:now-i*864e5, q:"dewalt dcd777",
      words:["dewalt","dcd777"], price, what:"DeWalt DCD777 drill "+i, where:"eBay", basis,
      img: img===undefined ? "https://i.ebayimg.com/images/g/a"+i+"/s-l225.jpg" : img,
      url:"https://www.ebay.com/itm/1000"+i});
    const set = (rows) => localStorage.setItem("pawndesk_comps", JSON.stringify(rows));
    const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
    st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.page="offer";
    st.brandTyped="DeWalt"; st.model="DCD777";
    st.market = {kind:"found", key:mkKey(), n:6, med:60, lo:45, hi:80, sold:4, conf:"h", mid:60};
    const grab = () => { render();
      const cells=[...document.querySelectorAll(".thumb")];
      return {n:cells.length, sold:cells.filter(c=>c.classList.contains("sold")).length,
        prices:cells.map(c=>c.querySelector(".tPrice").textContent.trim()),
        links:cells.filter(c=>c.tagName==="A").length,
        hasOnError:/onerror=/.test(document.body.innerHTML)}; };
    const out = {};
    set([mk(1,45,"sold"),mk(2,60,"sold"),mk(3,80,"asking"),mk(4,55,"sold"),mk(5,70,"asking")]);
    st.market.key = mkKey(); out.mixed = grab();
    set([mk(1,45,"sold"),mk(2,60,"sold")]);
    st.market.key = mkKey(); out.two = grab();
    set([mk(1,45,"sold",""),mk(2,60,"sold",""),mk(3,80,"sold","")]);
    st.market.key = mkKey(); out.noPics = grab();
    localStorage.removeItem("pawndesk_comps");
    return out;
  });
  ok(t.mixed.n === 5, "five comps with pictures make five cells, got " + t.mixed.n);
  ok(t.mixed.sold === 3, "  the sold ones are marked, got " + t.mixed.sold);
  ok(/^\$45/.test(t.mixed.prices[0]) && /^\$55/.test(t.mixed.prices[1]) && /^\$60/.test(t.mixed.prices[2]),
     "  sales come first, cheapest first: " + t.mixed.prices.join(" "));
  ok(/^\$70/.test(t.mixed.prices[3]) && /^\$80/.test(t.mixed.prices[4]),
     "  then the asks, also cheapest first: " + t.mixed.prices.join(" "));
  ok(t.mixed.prices[0].includes("\u00b7"), "  a sale carries its date");
  ok(!t.mixed.prices[4].includes("\u00b7"), "  an ask has no date to carry");
  ok(t.mixed.links === 5, "  every cell opens its listing, got " + t.mixed.links);
  ok(t.mixed.hasOnError, "  a picture that will not load takes its cell with it");
  ok(t.two.n === 0, "under three pictures there is no strip - two is not evidence");
  ok(t.noPics.n === 0, "comps with no pictures draw no strip");
}

/* What a missing piece costs, per category. A flat 30% was a guess, and
   where it has been measured it is wrong by a factor of three - which on an
   Xbox is the difference between lending $180 and lending $300. */
console.log("\n  what a missing piece costs");
{
  const c = await page.evaluate(() => {
    const out = {};
    const run = (catId, itemId) => {
      const cat = CATALOG.find(x => x.id === catId);
      st.mode="item"; st.catId=catId; st.itemId=itemId; st.picked=true;
      st.market=null; st.cond="good"; st.condSet=true; st.overrides={}; st.specSel={};
      st.complete = true;  const whole = calcItem().resale;
      st.complete = false; const part  = calcItem().resale;
      st.complete = true;
      return {whole, part, ratio: whole ? part/whole : null, label: cat.complete.label||""};
    };
    out.elec  = run("elec", "e5");
    out.tools = run("tools", "t1");
    return out;
  });
  ok(Math.abs(c.elec.ratio - 0.9) < 0.005,
     "electronics docks 10% for a missing piece (measured), got " + c.elec.ratio.toFixed(3));
  ok(Math.abs(c.tools.ratio - 0.7) < 0.005,
     "a category with no measurement still docks 30%, got " + c.tools.ratio.toFixed(3));
  ok(c.elec.part > c.tools.ratio * c.elec.whole,
     "  so an incomplete console is worth more than the old flat rate said");
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
