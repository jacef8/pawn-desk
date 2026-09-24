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
import {readFileSync} from "node:fs";
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
    pickBookEntry(e); st.picked = true;
    /* The price waits for the whole run now, so the run has to be made
       before there is anything to assert. A wheelbarrow has no model, which
       is itself an answer; the sold price is entered by hand at the figure
       the book already carries, so the row stays exactly as thin as it was. */
    /* No make and no model on a wheelbarrow - the desk does not ask for
       either on a cheap book row, so neither is set here. */
    st.condSet = true;
    (SPEC_CHOICES[st.itemId] || []).forEach((g, gi) => {
      st.specSel[st.itemId + ":" + gi] = specBase(g); });
    st.market = {kind: "hand", key: mkKey(), mid: 28};
    render();
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

/* MONEY THAT CHANGES HANDS IS ROUNDED TO THE NEAREST FIVE.
   Nobody counts $31 out of a till, and "thirty" is a number a customer
   hears and repeats. The resale value, the cushion and the fee are the
   arithmetic BEHIND the offer, not the offer, and stay exact.
   Rounding runs after the caps and the caps are re-applied to the rounded
   figures: $42 rounds down to $40 while $38 rounds UP to $40, so without
   that the loan could land above the buy price and undo the caps. */
console.log("\n  every figure the counter says out loud ends in 0 or 5");
{
  const r = await page.evaluate(() => {
    const bad = [], five = (n) => n % 5 === 0;
    let n = 0, thin = 0;
    const check = (x, name) => {
      n++;
      if (x.buyTooThin) { thin++; return; }
      if (!five(x.buy) || !five(x.target) || !five(x.low) || !five(x.high))
        bad.push(name + " not /5: " + [x.buy, x.target, x.low, x.high].join("/"));
      if (x.target > x.buy) bad.push(name + " lend>buy after rounding");
      if (x.high > x.buy)   bad.push(name + " top loan>buy after rounding");
      if (x.low > x.target) bad.push(name + " low>suggested after rounding");
    };
    for (const e of PRICEBOOK) { pickBookEntry(e); st.picked = true; check(calcItem(), e[0]); }
    for (const c of CATALOG) for (const it of c.items) {
      st.catId = c.id; st.itemId = it.id; st.picked = true; st.brand = "mid"; st.brandSet = true;
      st.cond = "good"; st.complete = true; st.specSel = {}; st.market = null;
      st.bookName = ""; st.model = ""; st.detail = "";
      check(calcItem(), it.name);
    }
    /* the exact figures must NOT be rounded - they are the reasoning */
    const e = PRICEBOOK.find(x => x[0] === "Socket set — complete");
    pickBookEntry(e); st.picked = true;
    const x = calcItem();
    return {bad, n, thin, resale: Math.round(x.resale), margin: x.margin,
            buy: x.buy, target: x.target, low: x.low, high: x.high};
  });
  ok(r.bad.length === 0,
     "all " + r.n + " rows round to a five, and every cap survives it — "
     + (r.bad.slice(0, 3).join(" | ") || "none"));
  ok(r.thin > 0, "  a row too thin to deal on keeps its real pennies — " + r.thin + " of them");
  ok(r.buy % 5 === 0 && r.target % 5 === 0,
     "  socket set: buy $" + r.buy + ", lend $" + r.target + ", range $" + r.low + "–$" + r.high);
  ok(r.resale % 5 !== 0 || r.margin % 5 !== 0,
     "  while resale ($" + r.resale + ") and the cushion ($" + r.margin + ") stay exact — they are not offers");
}

/* A meter that means "no evidence" was drawn FULL and merely greyed out.
   Grey or not, a full bar reads as a full bar across a counter: the one
   glance this card exists for said maximum confidence when it meant none. */
console.log("\n  an empty confidence meter looks empty");
{
  const r = await page.evaluate(() => {
    const e = PRICEBOOK.find(x => x[0] === "Socket set — complete");
    pickBookEntry(e); st.picked = true; st.market = null; render();
    const w = document.querySelector(".wCard");
    const i = w && w.querySelector(".wBar i");
    const empty = {w: i ? parseInt(i.style.width) : -1,
                   paint: i ? getComputedStyle(i).backgroundColor : "",
                   txt: w ? w.innerText : ""};
    /* nine listings, seven of them real sales */
    st.market = {kind: "found", key: mkKey(), mid: 180, lo: 150, hi: 210, n: 9, sold: 7};
    render();
    const j = document.querySelector(".wCard .wBar i");
    const full = {w: j ? parseInt(j.style.width) : -1, txt: document.querySelector(".wCard").innerText};
    /* the same nine, mostly asking prices */
    st.market = {kind: "found", key: mkKey(), mid: 180, lo: 150, hi: 210, n: 9, sold: 2};
    render();
    const k = document.querySelector(".wCard .wBar i");
    const asks = {w: k ? parseInt(k.style.width) : -1, cls: k ? k.className : "",
                  txt: document.querySelector(".wCard").innerText};
    return {empty, full, asks};
  });
  ok(r.empty.w <= 3 && /rgba\(0, 0, 0, 0\)|transparent/.test(r.empty.paint),
     "nothing looked up draws no fill at all — width " + r.empty.w + "%, " + r.empty.paint);
  ok(/Not checked/.test(r.empty.txt) && /not a price anybody paid/.test(r.empty.txt),
     "  and says why in words as well as shape");
  ok(r.full.w > 70 && /7 sold/.test(r.full.txt),
     "  seven sales in nine listings fills it — " + r.full.w + "%");
  ok(r.asks.w < 30 && /warn/.test(r.asks.cls) && /Mostly asking prices/.test(r.asks.txt),
     "  two sales in nine drops it and warns — " + r.asks.w + "%");
  ok(r.empty.w < r.asks.w && r.asks.w < r.full.w,
     "  the three states read in the right order: none < thin < solid");
}

/* THE RAIL IS THE MONEY. WHEN IT IS THERE, NOTHING ELSE SAYS IT.
   The panel on the right carries buy, lend, resale, cushion, fee, the
   loan-to-resale share, the range and the estimate warning. The loan card
   then drew a gauge of the same loan, three tiles of the same range, the
   same buy price and a fold to the same cushion and fee. Every number in
   it was a duplicate, and it pushed what was worth reading below the fold.
   Narrow, with no rail, that card is the only place the money appears and
   has to keep all of it. */
console.log("\n  the loan card does not repeat the rail");
{
  const look = async (width) => {
    await page.setViewportSize({width, height: 900});
    return page.evaluate(() => {
      const c = CATALOG.find(y => y.items.some(i => i.id === "p1"));
      st.catId = c.id; st.itemId = "p1"; st.picked = true; st.brand = "mid"; st.brandSet = true;
      st.cond = "good"; st.complete = true; st.specSel = {}; st.market = null;
      st.model = "MS 271"; st.detail = "";
      /* Same reason: no figures are drawn until the run is finished. */
      st.condSet = true;
      (SPEC_CHOICES[st.itemId] || []).forEach((g, gi) => {
        st.specSel[st.itemId + ":" + gi] = specBase(g); });
      st.market = {kind: "hand", key: mkKey(), mid: 300};
      render();
      const t = document.getElementById("ticket");
      return {rail: deskRail(), txt: t ? t.innerText : "",
              pin: (document.getElementById("pin") || {}).innerText || ""};
    });
  };
  const wide = await look(1400), narrow = await look(900);
  ok(wide.rail === true && narrow.rail === false, "the rail shows wide and not narrow");
  ok(/LEND HIM/.test(wide.pin) && /BUY IT FOR/.test(wide.pin),
     "  wide, the rail carries the loan and the buy price");
  ok(!/LOW LOAN/.test(wide.txt) && !/SUGGESTED LOAN/.test(wide.txt) && !/TOP LOAN/.test(wide.txt),
     "  so the card drops the three range tiles");
  ok(!/OR BUY IT OUTRIGHT/.test(wide.txt), "  and the buy row");
  ok(wide.txt.length < narrow.txt.length / 1.5,
     "  leaving a much shorter card — " + wide.txt.length + " chars against " + narrow.txt.length);
  /* what the rail cannot say has to survive */
  ok(/Pricing:/.test(wide.txt) && /MS 271/.test(wide.txt),
     "  it still says which model the price came from");
  ok(/Go low when cash is tight/.test(wide.txt), "  and still says when to go high or low");
  ok(/cushion, fee, and why it is this much/.test(wide.txt), "  and keeps the reasoning fold");
  /* narrow keeps everything, because nothing else has it */
  ok(/LOW LOAN/.test(narrow.txt) && /OR BUY IT OUTRIGHT/.test(narrow.txt) && /LEND HIM/.test(narrow.txt),
     "narrow, with no rail, the card still carries every figure");
  await page.setViewportSize({width: 1400, height: 900});
}

/* TYPED IS NOT THE SAME AS KNOWN.
   Any text at all counted as an answer, so a make the category's list does
   not carry - Harbor Freight among the generators - fell to the standard
   tier and lit "Mid grade" as though somebody had picked it. The make was
   typed, the desk did not recognise it, and the screen said it had. */
console.log("\n  a make the list does not carry lights nothing");
{
  const r = await page.evaluate(() => {
    const probe = (catId, itemId, typed) => {
      st.catId = catId; st.itemId = itemId; st.picked = true; st.flow = "ask"; st.askAt = 0;
      st.brand = "mid"; st.brandTyped = typed; st.brandSet = false; st.model = ""; st.bookName = "";
      st.specSel = {}; st.market = null;
      const h = brandLookup(catId, typed); if (h) st.brand = h.tier;
      render();
      const lit = [...document.querySelectorAll(".askOpt")].find(b => b.classList.contains("on"));
      return {lit: lit ? lit.querySelector(".askT").textContent.trim() : null,
              hint: (document.querySelector("#askCard .cardHint") || {}).textContent || "",
              tier: calcItem().brandTier};
    };
    return {unknown: probe("power", "p7", "Harbor Freight"),
            known:   probe("power", "p1", "Stihl"),
            blank:   probe("power", "p1", "")};
  });
  ok(r.unknown.lit === null,
     'a make the outdoor-power list does not carry lights NOTHING — got ' + JSON.stringify(r.unknown.lit));
  ok(/Harbor Freight/.test(r.unknown.hint) && /not on the list/.test(r.unknown.hint),
     "  and names it rather than going blank — " + r.unknown.hint.trim().slice(0, 72));
  ok(r.known.lit === "Stihl" && r.known.tier === "hi",
     "  while one it does carry still lights and prices — " + r.known.lit + "/" + r.known.tier);
  ok(r.blank.lit === null && /Nothing picked yet/.test(r.blank.hint),
     "  and nothing typed at all still reads as nothing picked");
}

/* A WHEELBARROW HAS NO MAKE AND A HAMMER HAS NO MODEL, BUT A ZERO-TURN HAS
   BOTH. The price now waits for the whole run, which on a $28 wheelbarrow
   meant waiting on two questions the thing does not have. The exemption is
   drawn where the answer could change the decision: the make tiers swing
   about 40%, so when 40% of the thing's own value falls under the floor,
   no answer can move what you do. This pins both sides of that line. */
console.log("\n  cheap book rows are not asked for a make or a model");
{
  const r = await page.evaluate(() => {
    const look = (name) => {
      const e = PRICEBOOK.find(x => x[0] === name);
      if (!e) return null;
      pickBookEntry(e); st.picked = true;
      st.condSet = false; st.market = null; st.mpNone = false;
      const x = calcItem();
      return {resale: Math.round(x.resale), floor: x.buyFloor,
              easy: bookSimple(x), need: priceMissing(x)};
    };
    return {barrow: look("Wheelbarrow"), saw: look("Circular saw"),
            safe: look("Gun safe"), turn: look("Zero-turn mower")};
  });
  const asks = (o) => o.need.indexOf("the make") >= 0 || o.need.indexOf("the model") >= 0;
  ok(r.barrow.easy === true && !asks(r.barrow),
     "a $" + r.barrow.resale + " wheelbarrow is asked for neither — needs " + r.barrow.need.join(", "));
  ok(r.saw.easy === true && !asks(r.saw),
     "  nor a $" + r.saw.resale + " circular saw");
  ok(r.barrow.need.indexOf("what it sells for") >= 0,
     "  but the sold price is still required — the book figure is not a sale");
  ok(r.safe.easy === false && asks(r.safe),
     "a $" + r.safe.resale + " gun safe is asked for both");
  ok(r.turn.easy === false && asks(r.turn),
     "  as is a $" + r.turn.resale + " zero-turn, where 40% is $"
     + Math.round(r.turn.resale * 0.4) + " against a $" + r.turn.floor + " floor");
}

/* A SEED THAT POINTS NOWHERE IS HARVESTED INTO NOTHING. Every row in
   seed-models.json names the item it belongs to - either a catalog id
   (t1, e3) or a price-book row by name ("Wireless earbuds"). A typo in
   that ref costs a lookup and silently produces a row the picker can
   never show, which is the worst kind of failure: it looks like work. */
console.log("\n  every harvest target points at something real");
{
  const seeds = JSON.parse(readFileSync(
    new URL("./seed-models.json", import.meta.url), "utf8")).rows;
  const r = await page.evaluate((seeds) => {
    const ids = new Set(); CATALOG.forEach(c => c.items.forEach(i => ids.add(i.id)));
    const book = new Set(PRICEBOOK.map(x => x[0]));
    const refs = [...new Set(seeds.map(s => s.ref))];
    return {n: seeds.length, refs: refs.length,
            bad: refs.filter(x => !ids.has(x) && !book.has(x)),
            dupes: (() => { const seen = new Set(), d = [];
              seeds.forEach(s => { const k = s.ref + "|" + s.name.toLowerCase();
                if (seen.has(k)) d.push(k); seen.add(k); }); return d; })()};
  }, seeds);
  ok(r.bad.length === 0,
     r.n + " targets across " + r.refs + " items, every ref resolves"
     + (r.bad.length ? " — ORPHANED: " + r.bad.join(", ") : ""));
  ok(r.dupes.length === 0,
     "  and none is listed twice" + (r.dupes.length ? " — " + r.dupes.slice(0,4).join(", ") : ""));
}

/* A DJI OSMO IS NOT A DRONE, AND $25 IS NOT A CAMERA.
   The brand was mapped straight to "Camera drone", so every DJI thing
   became one - and Osmo is the gimbal and pocket-camera line. It landed
   on a $300 drone row, searched as a drone, and came back at $25 off a
   battery charger, a phone clamp and a selfie stick. The desk called that
   "good data" and put it in use, because nothing on that screen compared
   the answer with the book. The harvest has refused numbers like that for
   weeks; the counter got them anyway. */
console.log("\n  DJI's lines go to the right rows, and a mad answer says so");
{
  const r = await page.evaluate(() => {
    const route = (q) => { const h = modelHit(q, "");
      return h ? (typeof h.m.item === "function" ? h.m.item(h.mm) : h.m.item) : null; };
    st.mode = "item"; st.catId = "elec"; st.itemId = "e1"; st.picked = true;
    st.brandTyped = ""; st.model = ""; st.market = null;
    const ev = (mid, book) => { st.evidence = {key: mkKey(),
      comps: {n: 6, sold: 6, mid, lo: Math.round(mid*0.9), hi: Math.round(mid*1.1), from: "eBay 6"},
      book}; return evidenceHTML(); };
    return {gimbal: ["dji osmo pocket 3", "dji osmo action 4", "dji rs 4"].map(route),
            drone: ["dji mavic 3", "dji avata", "dji phantom 4"].map(route),
            row: !!PRICEBOOK.find(x => x[0] === "Gimbal / pocket camera"),
            low: /far below/.test(ev(25, 300)),
            high: /far above/.test(ev(2000, 300)),
            sane: !/far below|far above/.test(ev(282, 250))};
  });
  ok(r.row, "there is a row for a gimbal camera to land on");
  ok(r.gimbal.every(x => x === "Gimbal / pocket camera"),
     "  Osmo and RS go to it — " + r.gimbal.join(", "));
  ok(r.drone.every(x => x === "Camera drone"),
     "  and Mavic, Avata and Phantom are still drones — " + r.drone.join(", "));
  ok(r.low, "$25 against a $300 book row is called out, not called good data");
  ok(r.high, "  and so is $2,000 against $300");
  ok(r.sane, "  while a figure near the book passes without a word");
}

/* A BRAND THAT MAKES MORE THAN ONE KIND OF THING. The DJI fault was not
   about DJI: a make is registered against one category, and a model name
   the book does not recognise falls through to it. Yamaha is registered
   against powersports, so every instrument it makes came back an OUTBOARD
   MOTOR - a P-125 digital piano, a PSR keyboard, a Clavinova, an FG800
   acoustic, a YAS-23 alto sax, HS8 monitors, an RX-V385 receiver. Those
   are among the commonest things across a pawn counter. Thompson Center
   pointed at the muzzleloader row, so a Compass and a Venture - plain
   bolt-action centrefire rifles - came back muzzleloaders.
   The rows all existed. Nothing pointed at them. */
console.log("\n  a make that makes several things lands on the right one");
{
  const r = await page.evaluate(() => {
    const top = (q) => { const R = omniRows(q) || {}, rows = R.rows || [];
      const h = rows.find(x => x.kind === "item" || x.kind === "book" || x.kind === "mp");
      return h ? String(h.label || h.name || h.title || "") : null; };
    return {
      piano: top("yamaha p-125"), clav: top("yamaha clavinova"),
      psr: top("yamaha psr-e373"), guitar: top("yamaha fg800"),
      sax: top("yamaha yas-23"), avr: top("yamaha rx-v385"),
      compass: top("thompson center compass"), venture: top("thompson center venture"),
      /* still powersports, which is the point - the fix must not overshoot */
      grizzly: top("yamaha grizzly"), outboard: top("yamaha outboard"),
      /* and the item word must still win over the make */
      gen: top("honda generator"), mower: top("honda lawn mower"),
    };
  });
  const bad = Object.entries(r).filter(([k, v]) => /outboard/i.test(v || "") && k !== "outboard");
  ok(bad.length === 0, "no Yamaha instrument comes back an outboard motor"
     + (bad.length ? " — " + bad.map(([k, v]) => k + "=" + v).join(", ") : ""));
  ok(/digital piano/i.test(r.piano) && /digital piano/i.test(r.clav),
     "  a P-125 and a Clavinova are digital pianos — " + r.piano + ", " + r.clav);
  ok(/keyboard/i.test(r.psr) && /acoustic guitar/i.test(r.guitar) && /saxophone/i.test(r.sax),
     "  PSR a keyboard, FG800 a guitar, YAS-23 a sax");
  ok(/receiver/i.test(r.avr), "  and an RX-V385 is a receiver — " + r.avr);
  ok(/bolt/i.test(r.compass) && /bolt/i.test(r.venture),
     "a T/C Compass and Venture are bolt rifles, not muzzleloaders — " + r.compass);
  ok(/atv|four/i.test(r.grizzly) && /outboard/i.test(r.outboard),
     "  while a Grizzly is still a quad and an outboard still an outboard");
  ok(/generator/i.test(r.gen) && /mower/i.test(r.mower),
     "  and an item word still beats the make — " + r.gen + ", " + r.mower);
}

/* THE MAKE QUESTION READ A DIFFERENT BOOK FROM THE ROUTER. Seventeen makes
   were registered for routing and nowhere else, so brandLookup and
   brandHits - which read BRANDBOOK - had never heard of DJI, GoPro,
   Lowrance, Humminbird, Howa, Thompson Center or Mossberg. At the counter
   that is a dead end: the box already says DJI, nothing under it to tap,
   nothing recognising what is written. The router knew all along. */
console.log("\n  every make the router knows, the make question knows too");
{
  const r = await page.evaluate(() => {
    /* Checked against the item each make belongs to, not just the category.
       An item may carry its own brand list - a television's makes are not
       DJI's - and that override REPLACES the category book by design, so
       asking "is DJI in electronics" while a TV is on the counter is the
       wrong question. */
    const pairs = [["DJI","elec","Gimbal / pocket camera"],["GoPro","elec","GoPro / action camera"],
                   ["Lowrance","hunt","Fish finder"],["Humminbird","hunt","Fish finder"],
                   ["Howa","guns","g3"],["Thompson Center","guns","g3"],["Mossberg","guns","g1"]];
    const at = (cat, item) => { st.catId = cat;
      const e = PRICEBOOK.find(r => r[0] === item);
      st.itemId = e ? custId(cat) : item; st.bookName = e ? item : ""; };
    const missing = pairs.filter(([n,c,i]) => { at(c,i); return !brandLookup(c,n); }).map(([n]) => n);
    const noHit = pairs.filter(([n,c,i]) => { at(c,i); return brandHits(c, n.slice(0,3)).length === 0; }).map(([n]) => n);
    st.bookName = "";
    /* and a category that never asks the make question needs no book */
    const rolling = CATALOG.find(c => c.id === "rolling");
    return {missing, noHit, rollingAsks: !!(rolling && rolling.brand && rolling.brand.on)};
  });
  ok(r.missing.length === 0,
     "each one resolves in its own category" + (r.missing.length ? " — MISSING: " + r.missing.join(", ") : ""));
  ok(r.noHit.length === 0,
     "  and three letters finds each" + (r.noHit.length ? " — NO HITS: " + r.noHit.join(", ") : ""));
  ok(r.rollingAsks === false,
     "  powersports never asks the make, so it needs no book of its own");
}

/* THERE IS ALWAYS A WAY FORWARD. The tier buttons used to appear only once
   something had been typed, so an empty box offered nothing at all - no
   hits, no tiers, no next step - and a box pre-filled from the search read
   as a dead end because the hit list was computed from an empty query. */
console.log("\n  the make step is never a dead end");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(y => y.items.some(i => i.id === "e1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="e1"; st.picked=true;
    st.brandTyped=""; st.brandQ=""; st.brandSet=false; st.model=""; st.detail="";
    st.mpNone=false; st.market=null; st.specSel={}; st.condSet=false;
    const q0 = askQueue(calcItem());
    st.askAt = q0.findIndex(z => z.id === "brand"); render();
    /* the LAST hint in the card is the one under the make box; the first is
       the question's own hint, which is a different sentence */
    const hints = [...document.querySelectorAll("#askCard .cardHint")].map(e => e.textContent);
    const empty = {tiers: document.querySelectorAll("#askCard [data-ask='brand']").length,
                   hint: hints[hints.length - 1] || ""};
    /* a make typed into the search box seeds the list rather than sitting mute */
    st.brandTyped = "Sony"; render();
    const seeded = [...document.querySelectorAll("[data-brandpick]")].map(b => b.dataset.brandpick);
    return {empty, seeded};
  });
  ok(r.empty.tiers >= 3, "an empty box still offers the tiers — " + r.empty.tiers);
  ok(/say where it sits/i.test(r.empty.hint), "  and says so — " + r.empty.hint.trim().slice(0, 60));
  ok(r.seeded.some(n => /sony/i.test(n)),
     "  a make already known seeds the list instead of sitting mute — " + r.seeded.join(", "));
}

/* WHAT THE COUNTER ALREADY TYPED. Picking a suggestion fills in the make
   and the model, and then the run asked for things the same sentence had
   already said: "remington 870 express 12 gauge 28 inch" answered the
   gauge and asked the barrel straight back. Every group below existed
   with no rule pointing at it. A revolver's "4 inch" was lost earlier
   still - the detail scanner only kept two- and three-digit inches. */
console.log("\n  a spec the search text already gave is not asked again");
{
  const r = await page.evaluate(() => {
    const go = (q) => { const R = omniRows(q) || {}, rows = R.rows || [];
      const first = rows.find(x => ["mp","book","item"].includes(x.kind));
      if (!first) return null;
      st.market = null; st.mpPin = null; st.mpNone = false; st.condSet = false; st.specSel = {};
      st.brandTyped = ""; st.brandQ = ""; st.brandSet = false;
      st.model = ""; st.detail = ""; st.bookName = "";
      omniPick(first);
      const groups = SPEC_CHOICES[st.itemId] || [];
      const out = {};
      groups.forEach((g, gi) => { const i = st.specSel[st.itemId + ":" + gi];
        out[g.label] = i == null ? null : g.options[i].t; });
      return out;
    };
    return {shotgun: go("remington 870 28 inch 12 gauge"),
            revolver: go("smith wesson 686 4 inch"),
            saw: go("stihl ms 271 20 inch bar"),
            tv: go("samsung 55 inch tv"),
            console: go("ps5 digital"),
            phone: go("iphone 13 2021")};
  });
  ok(r.shotgun.Gauge === "12 ga" && /24/.test(r.shotgun.Barrel || ""),
     "a shotgun's gauge AND barrel come off the text — " + r.shotgun.Gauge + ", " + r.shotgun.Barrel);
  ok(/3/.test(r.revolver.Barrel || ""),
     "  a revolver's single-digit barrel is not dropped — " + r.revolver.Barrel);
  ok(/19/.test(r.saw["Bar length"] || ""), "  a saw's bar length — " + r.saw["Bar length"]);
  ok(/digital/i.test(r.console.Version || ""), "  a console's edition — " + r.console.Version);
  ok(!!r.phone.Age, "  and a model year becomes an age band — " + r.phone.Age);
  /* the rules must not reach across kinds: inches mean different things */
  ok(/50/.test(r.tv["Screen size"] || "") && !r.tv.Barrel,
     "a television's inches are its screen, never a barrel — " + r.tv["Screen size"]);
  ok(!r.revolver["Screen size"],
     "  and a revolver's inches are never a screen size");
}

/* THE ROW'S OWN NAME WAS WRECKING THE SEARCH. Once the make and model are
   known the kind of thing is implied by them, and tacking the catalog
   row's description on the end turns a good search into a different
   product. Measured live: "DJI Osmo Action 4" returns seven real SOLD
   listings with the Action 4 at $165 and $181; "DJI Osmo Action 4 Gimbal
   / pocket camera" falls off sold prices altogether and comes back with
   Osmo POCKETS at asking prices. Nobody searching by hand types the
   category after the model. */
console.log("\n  the search is what a person would type, not the row's name");
{
  const r = await page.evaluate(() => {
    const go = (q) => { const R = omniRows(q) || {}, rows = R.rows || [];
      const f = rows.find(x => ["mp","book","item"].includes(x.kind)); if (!f) return null;
      st.market = null; st.mpPin = null; st.mpNone = false; st.condSet = false; st.specSel = {};
      st.brandTyped = ""; st.brandQ = ""; st.brandSet = false;
      st.model = ""; st.detail = ""; st.bookName = "";
      omniPick(f); return compQuery(calcItem()); };
    return {osmo: go("dji osmo action 4"), saw: go("stihl ms 271"),
            bare: go("gimbal"), bareSaw: go("chainsaw")};
  });
  ok(!/gimbal|pocket camera/i.test(r.osmo),
     "with a make and a model, the row name is left out — " + r.osmo);
  ok(/action 4/i.test(r.osmo),
     "  and the generation number survives, which is most of the model — " + r.osmo);
  ok(!/chainsaw/i.test(r.saw), "  same for a saw — " + r.saw);
  ok(/gimbal/i.test(r.bare) && /chainsaw/i.test(r.bareSaw),
     "  but with no model it is the only description there is — " + r.bare + " / " + r.bareSaw);
}

/* THE MERGE'S SPREAD GUARD, ON THE LIVE LOOKUP. A DJI Osmo Action 4
   search returns Action 3s at $70, Action 4s at $165-$181, Action 5 Pros
   at $290 and Osmo Nanos at $281 - every one a real sale, every one a
   different camera. The middle of that is nobody's price. */
console.log("\n  a spread too wide for one product says so");
{
  const r = await page.evaluate(() => {
    st.mode = "item"; st.catId = "elec"; st.itemId = "e1"; st.picked = true;
    st.brandTyped = ""; st.model = ""; st.market = null;
    const ev = (c, book) => { st.evidence = {key: mkKey(), comps: c, book}; return evidenceHTML(); };
    return {mixed: ev({n:8,sold:8,mid:226,lo:70,hi:290,from:"eBay 8"}, 250),
            tight: ev({n:6,sold:6,mid:175,lo:165,hi:185,from:"eBay 6"}, 250),
            low:   ev({n:6,sold:6,mid:25,lo:23,hi:40,from:"eBay 6"}, 300)};
  });
  ok(/more than one model/.test(r.mixed), "eight sales from $70 to $290 are called out as mixed");
  ok(!/more than one model/.test(r.tight), "  a tight band passes without a word");
  ok(/far below/.test(r.low), "  and a figure far under the book still says that instead");
}

/* WHAT EBAY CANNOT SELL, IT CANNOT PRICE. Measured over seventy searches
   for things the desk claims to know: 37% usable. The biggest bucket of
   the rest was firearms, and the reason is not subtle - eBay bans the
   sale of guns, so "Remington 870 Express" returns shell latches at
   $14.99, a trigger plate at $39 and a stock set at $115. Not one
   shotgun. The desk was pricing a $450 gun off a $15 latch and grading it
   "good data", because fourteen real sales agreed with each other.
   The comps card has said so in plain words all along; the automatic
   lookup went and searched eBay anyway. */
console.log("\n  the desk does not search eBay where eBay is blind");
{
  const r = await page.evaluate(() => {
    const at = (cat, item) => { st.mode = "item"; st.catId = cat; st.itemId = item;
      st.picked = true; st.brandTyped = ""; st.model = ""; st.bookName = "";
      return ebayBlind(calcItem()); };
    return {shotgun: at("guns","g1"), pistol: at("guns","g7"), atv: at("rolling","r2"),
            push: at("power","p4"), riding: at("power","p5"),
            saw: at("power","p1"), drill: at("tools","t1"), tv: at("elec","e1")};
  });
  ok(/firearms/i.test(r.shotgun) && /firearms/i.test(r.pistol),
     "a gun is not searched for on eBay, and it says why");
  ok(/GunBroker/i.test(r.shotgun), "  and it names the source that does work");
  ok(!!r.atv && !!r.push && !!r.riding,
     "nor a quad or a mower — nobody ships one, so eBay lists their parts");
  ok(!r.saw && !r.drill && !r.tv,
     "  while a saw, a drill and a television still search, because they sell there");
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);

