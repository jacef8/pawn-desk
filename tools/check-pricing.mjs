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

/* The meter has to exist on the devices that get carried. It was drawn
   inside the rail, the rail needs 1080px, so a phone and a tablet held
   upright had no meter at all - and those are the two that go to a yard
   sale, where a thin number and a solid one look identical. */
console.log("\n  the meter reaches every screen");
{
  for (const [label, w, h] of [["desk", 1440, 1000], ["tablet upright", 768, 1024], ["tablet sideways", 1024, 768]]) {
    const pg = await browser.newPage({viewport:{width:w, height:h}});
    await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
    const n = await pg.evaluate(() => {
      const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
      st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.condSet=true;
      st.market={kind:"found", key:mkKey(), n:12, med:110, lo:95, hi:130, sold:9, conf:"h", mid:110};
      render();
      return document.querySelectorAll(".wCard").length;
    });
    ok(n >= 1, label + " (" + w + "px) shows the meter, got " + n);
    await pg.close();
  }
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  const n = await ph.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
    st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.condSet=true;
    st.market={kind:"found", key:mkKey(), n:12, med:110, lo:95, hi:130, sold:9, conf:"h", mid:110};
    render();
    return document.querySelectorAll(".wCard").length;
  });
  ok(n >= 1, "phone shows the meter, got " + n);
  await ph.close();
}

/* "1 of 4" beside a panel reading ALL ANSWERED read as a contradiction,
   and fairly: one is where you are LOOKING, the other is what is DONE. */
console.log("\n  the pager and the panel agree");
{
  const pg = await browser.newPage({viewport:{width:900, height:1200}});
  await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await pg.evaluate(() => {
    const go = (done) => {
      const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
      st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.flow="pages"; st.page="what";
      st.condSet = done;
      st.market = done ? {kind:"found", key:mkKey(), n:12, med:220, lo:190, hi:260, sold:9, conf:"h", mid:220} : null;
      render();
      const tabs = [...document.querySelectorAll(".pageTabs button")];
      return {where: (document.querySelector(".pageWhere")||{}).textContent || "",
              ticked: tabs.filter(b => b.classList.contains("done")).length,
              total: tabs.length,
              skip: !!document.querySelector(".pageSkip")};
    };
    return {open: go(false), done: go(true)};
  });
  ok(/^page 1 of/.test(r.open.where), "unanswered reads as a position, not progress: " + r.open.where);
  ok(/all answered/.test(r.done.where), "answered says so beside the page number: " + r.done.where);
  ok(r.done.ticked === r.done.total, "every page is ticked when every page is answered, got " + r.done.ticked + "/" + r.done.total);
  ok(r.open.ticked < r.open.total, "not every page is ticked before they are answered, got " + r.open.ticked + "/" + r.open.total);
  ok(!r.done.skip, "an answered page offers no Skip - there is nothing to leave unanswered");
  await pg.close();
}

/* The brand page was asking things it had already been told.
   Typing "DeWalt" and being answered "DeWalt - top tier here" settles the
   tier; three buttons underneath ask it again. The coaching paragraph is
   true and worth reading once, not on every item for ever. And Model and
   Details are notes for the ticket when the pickers set the price. */
console.log("\n  the brand page stops repeating itself");
{
  const pg = await browser.newPage({viewport:{width:900, height:1400}});
  await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await pg.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
    const go = (brand, model, detail) => {
      st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.flow="pages"; st.page="what";
      st.brandTyped=brand; st.model=model||""; st.detail=detail||"";
      st.openDriver=st.openTier=st.openNotes=false;
      render();
      const card=document.getElementById("s3");
      const tier=document.getElementById("tierFold"), notes=document.getElementById("notesFold");
      const shut=Math.round(card.getBoundingClientRect().height);
      /* read the fold state BEFORE prising them open to measure the other
         height, or every one of them reports open */
      const notesOpen = notes ? notes.open : null;
      const summary = notes ? notes.querySelector("summary").textContent.trim() : "";
      [...card.querySelectorAll("details.fold")].forEach(d=>d.open=true);
      const open=Math.round(card.getBoundingClientRect().height);
      return {shut, open, tierFolded:!!tier, pills:!!card.querySelector("[data-brand]"), notesOpen, summary};
    };
    return {known: go("DeWalt"), unknown: go("Zibblewhack"), typed: go("DeWalt","2904","18V hammer")};
  });
  ok(r.known.shut < r.known.open * 0.7,
     "a known brand halves the card — " + r.known.shut + "px shut against " + r.known.open + "px open");
  ok(r.known.tierFolded && r.known.pills,
     "  the tier is folded away, not thrown away — it is still there to change");
  ok(!r.unknown.tierFolded && r.unknown.pills,
     "a brand the book does not know still asks the tier outright");
  ok(r.typed.notesOpen === true && /2904/.test(r.typed.summary),
     "a model that was typed stays open and shows in the summary — " + r.typed.summary);
  ok(r.known.notesOpen === false,
     "  and folds away when there is nothing in it");
  await pg.close();
}

/* YOU NEVER LEND MORE THAN YOU WOULD PAY TO OWN IT.
   The floor - the dollars the shop wants to clear on a deal - was applied
   to the buy price and not to the loan, so the two drifted apart at the
   bottom of the book: a $32 air rifle read "pay $7" and "lend $14" side by
   side, and 40 of the 248 rows the desk prices did the same. An unredeemed
   loan leaves you owning the thing at what you lent, with the same hauling
   and listing the floor was written to cover, so lending above the buy
   price is strictly the worse deal. */
console.log("\n  the loan never goes above the buy price");
{
  const r = await page.evaluate(() => {
    const bad = [], capped = [], thin = [];
    const look = (x, n) => {
      if (x.target > x.buy) bad.push(n + " lend $" + x.target + " > buy $" + x.buy);
      if (x.lendCapped) capped.push(n);
      if (x.buyTooThin) thin.push(n);
      if (x.high > x.buy) bad.push(n + " top loan $" + x.high + " > buy $" + x.buy);
    };
    for (const e of PRICEBOOK) { pickBookEntry(e); look(calcItem(), e[0]); }
    for (const c of CATALOG) for (const it of c.items) {
      st.catId = c.id; st.itemId = it.id; st.picked = true; st.brand = "mid"; st.brandSet = true;
      st.cond = "good"; st.complete = true; st.specSel = {}; st.market = null;
      st.bookName = ""; st.model = ""; st.detail = "";
      look(calcItem(), it.name);
    }
    return {bad, nCapped: capped.length, nThin: thin.length,
            total: PRICEBOOK.length + CATALOG.reduce((a,c)=>a+c.items.length,0)};
  });
  ok(r.bad.length === 0,
     "no row lends more than it would pay, across all " + r.total + " — " + (r.bad.slice(0,3).join(" | ") || "none"));
  ok(r.nCapped > 0, "  and the cap really bites on the cheap rows — " + r.nCapped + " held to it");
}

/* A loan the shop would lose money owning is not a smaller loan, it is no
   loan. The desk printed one anyway - "lend $8" beside "pay $1". */
console.log("\n  a row too thin to buy is too thin to lend on");
{
  const r = await page.evaluate(() => {
    const e = PRICEBOOK.find(x => x[0] === "Wheelbarrow");
    pickBookEntry(e); st.picked = true; render();
    const x = calcItem();
    return {thin: x.buyTooThin, buy: x.buy, lend: x.target,
            pin: (document.getElementById("pin")||{}).innerText || "",
            ticket: (document.getElementById("ticket")||{}).innerText || ""};
  });
  ok(r.thin, "a wheelbarrow at $28 resale against a $25 floor is too thin");
  ok(r.lend <= r.buy, "  its loan does not exceed its buy price — buy $" + r.buy + ", lend $" + r.lend);
  ok(/Walk away/.test(r.pin) && !/Lend him\s*\$/.test(r.pin),
     "  the numbers strip says walk away rather than naming a loan");
  ok(/Walk away/.test(r.ticket), "  and so does the loan card");
  ok(!/on purpose/.test(r.pin),
     "  and it does not claim buy and lend match 'on purpose' — they match because the loan was capped");
}

/* The fix must not flatten ordinary rows: the range is capped at the BUY
   ceiling, not at the suggested loan, or every normal row collapses to a
   single number where a low/suggested/top spread belongs. */
console.log("\n  ordinary rows are untouched");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "g5"));
    st.catId = c.id; st.itemId = "g5"; st.picked = true; st.brand = "mid"; st.brandSet = true;
    st.cond = "good"; st.complete = true; st.specSel = {}; st.market = null;
    st.bookName = ""; st.model = ""; st.detail = "";
    const x = calcItem();
    return {low: x.low, target: x.target, high: x.high, buy: x.buy,
            thin: x.buyTooThin, capped: x.lendCapped};
  });
  ok(!r.thin && !r.capped, "an AR-15 is neither thin nor capped");
  ok(r.low < r.target && r.target < r.high,
     "  its range still opens up — " + r.low + " < " + r.target + " < " + r.high);
  ok(r.high <= r.buy, "  with the top loan still under the buy price — " + r.high + " ≤ " + r.buy);
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
