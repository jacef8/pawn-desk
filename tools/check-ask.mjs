/* One question on the screen.
 *
 * Asked for repeatedly and not actually built until now. "One page at a
 * time" was four PAGES, and the first still carried six questions in a
 * scrolling card - brand, tier, platform, kit, model, specs. A form wearing
 * a pager. This suite holds the real thing: one question, big answers,
 * answering moves on by itself, and the specifics are questions in the run
 * rather than fields buried under it. */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";

/* Same resolution the other suites use: playwright lives in the global
   root here, not beside the repo. */
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ok    " + m); } else { fail++; console.log("  FAIL  " + m); } };

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });

const start = (itemId) => page.evaluate((id) => {
  const c = CATALOG.find(x => x.items.some(i => i.id === id));
  st.flow = "ask"; st.mode = "item"; st.catId = c.id; st.itemId = id; st.picked = true;
  st.askAt = 0; st.brand = "mid"; st.brandTyped = ""; st.specSel = {};
  st.condSet = false; st.complete = true; st.market = null;
  render();
}, itemId);

const read = () => page.evaluate(() => {
  const c = document.getElementById("askCard");
  if (!c) return null;
  return { where: c.querySelector(".askWhere").textContent.trim(),
    q: c.querySelector(".askQ").textContent.trim(),
    opts: [...c.querySelectorAll(".askOpt .askT")].map(t => t.textContent.trim()),
    dots: c.querySelectorAll(".askDots i").length,
    done: c.querySelectorAll(".askDots i.done").length,
    backOff: c.querySelector('[data-askmove="-1"]').disabled,
    nextOff: c.querySelector('[data-askmove="1"]').disabled,
    cards: document.querySelectorAll("#view > .card, #view .colQ > .card").length };
});

console.log("\none question at a time\n");

await start("t1");
let r = await read();
ok(!!r, "the run renders at all");
ok(/^1 of 8/.test(r.where), "a cordless drill asks eight questions — " + r.where);
ok(/make/i.test(r.q), "it opens on the make — " + r.q);
ok(r.backOff, "  Back is dead on the first one");
ok(r.dots === 8, "  a dot for every question, got " + r.dots);

/* the whole point: answering moves on */
await page.click(".askOpt");
r = await read();
ok(/^2 of 8/.test(r.where), "answering moves to the next by itself — " + r.where);
ok(r.done >= 1, "  and the one behind is marked done, got " + r.done);
ok(!r.backOff, "  Back is alive now");

/* the specifics ARE the questions, not fields under them */
const seen = [];
await start("t1");
/* Not every question is a row of buttons - "Which one is it?" and the
   price are typed - so a question with nothing to tap is stepped past with
   Next rather than ending the walk. */
for (let i = 0; i < 9; i++) {
  const s = await read(); if (!s) break;
  seen.push(s.q);
  const b = await page.$(".askOpt");
  if (b && s.opts.length) { await b.click(); }
  else { const n = await page.$('[data-askmove="1"]:not([disabled])'); if (!n) break; await n.click(); }
  await page.waitForTimeout(120);
}
const all = seen.join(" | ").toLowerCase();
ok(/battery|platform/.test(all), "how many batteries is a question in the run — " + seen.join(" | "));
ok(/all there|missing/.test(all) || /is it all there/.test(all), "  so is whether it is all there");
ok(/sell for used/.test(all), "  and the price is the end of the run, not a separate page");

/* a simpler item asks fewer - the queue is built from the item */
await start("e1");
r = await read();
const n = Number((r.where.match(/of (\d+)/) || [])[1]);
ok(n >= 2, "a TV builds its own queue, " + n + " questions");

/* the dots are navigation, not decoration */
await start("t1");
await page.evaluate(() => { document.querySelectorAll(".askDots i")[3].click(); });
r = await read();
ok(/^4 of/.test(r.where), "tapping a dot jumps to that question — " + r.where);

/* nothing else on screen to scroll past */
ok(r.cards <= 5, "the run is the screen, not one card among many — " + r.cards + " cards");

/* The make is usually written on the thing that was picked.
   "DeWalt 20V drill kit" came off the price list and the make question
   opened with Ryobi / Ridgid lit, because st.brand defaults to "mid" and
   nothing read the name. Mid against top is 40% of the price - not a
   question left unanswered, an answer given wrongly. */
console.log("\n  the make is read off the name");
{
  const r = await page.evaluate(() => {
    const pick = (bookName, typed) => {
      const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
      st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.askAt=0;
      st.brand="mid"; st.brandTyped=typed||""; st.bookName=bookName||"";
      /* The model is part of which item this is, and the make is read off
         it - so a model left behind by an earlier block reads as that
         block's make. It leaked "DeWalt" into a Ryobi and priced it top
         tier. Now that a measured model can be tapped, this has to be
         cleared like everything else. */
      st.model=""; st.detail="";
      st.specSel={}; st.market=null; st.brandSet=false;
    st.mpPin=null; st.mpNone=false; st.brandQ="";
      /* A fresh item means no pinned model row and no make left in the
         search box from the block before - both are now tappable, so an
         earlier block can leave them set. */
      st.mpPin=null; st.mpNone=false; st.brandQ="";
      if (typed) { const h = brandLookup(st.catId, typed); if (h) st.brand = h.tier; }
      render();
      const x = calcItem();
      const lit = [...document.querySelectorAll(".askOpt")].find(b => b.classList.contains("on"));
      return {tier:x.brandTier, named:x.namedBrand||null, mult:x.brandMult,
              lit: lit ? lit.querySelector(".askT").textContent.trim() : null,
              hint: (document.querySelector("#askCard .cardHint")||{}).textContent||""};
    };
    return {dewalt: pick("DeWalt 20V drill kit"), ryobi: pick("Ryobi One+ drill kit"),
            blank: pick("Cordless drill"), typed: pick("DeWalt 20V drill kit", "Harbor Freight")};
  });
  ok(r.dewalt.tier === "hi" && r.dewalt.mult === 1.4,
     "a DeWalt off the price list prices as top tier, not standard — " + r.dewalt.tier + " x" + r.dewalt.mult);
  ok(/DeWalt/.test(r.dewalt.lit || "") && /read off the name/.test(r.dewalt.hint),
     "  the right tier is lit and says where it came from");
  ok(r.ryobi.tier === "mid" && /Ryobi/.test(r.ryobi.named || ""),
     "a Ryobi reads as standard — " + r.ryobi.tier);
  ok(r.blank.lit === null,
     "a name with no make in it lights NOTHING — a default is not an answer somebody gave");
  ok(/standard tier until you say/.test(r.blank.hint),
     "  and says the price is using standard until told");
  ok(r.typed.tier === "lo" && r.typed.mult < 1,
     "a make typed by hand beats the one read off the name — " + r.typed.tier);
}

/* Typing "Sony Laptop" lit "Apple / Samsung flagship" and explained
   nothing. The TIER was right - the buttons are named after their
   examples and Sony keeps company with Apple - but on the screen it read
   as the desk calling a Sony an Apple, with no line anywhere saying where
   that came from. Whatever the desk knows the make to be, it has to say
   the make out loud.
   And the make can arrive three ways: written in the catalog row, typed
   into the brand box, or sitting in the model picked off the list. The
   third was not being read at all, so "DeWalt 20V drill kit" - the make
   is the first word of it - still priced as a standard brand. */
console.log("\n  whatever make the desk knows, it says out loud");
{
  const r = await page.evaluate(() => {
    const look = (catId, itemId, typed, model) => {
      const c = CATALOG.find(x => x.id === catId);
      st.flow="ask"; st.mode="item"; st.catId=catId; st.itemId=itemId; st.picked=true; st.askAt=0;
      st.brand="mid"; st.brandTyped=typed||""; st.model=model||""; st.bookName="";
      st.specSel={}; st.market=null; st.brandSet=false;
    st.mpPin=null; st.mpNone=false; st.brandQ="";
      /* A fresh item means no pinned model row and no make left in the
         search box from the block before - both are now tappable, so an
         earlier block can leave them set. */
      st.mpPin=null; st.mpNone=false; st.brandQ="";
      if (typed) { const h = brandLookup(catId, typed); if (h) st.brand = h.tier; }
      render();
      const x = calcItem();
      const lit = [...document.querySelectorAll(".askOpt")].find(b => b.classList.contains("on"));
      return {tier:x.brandTier, mult:x.brandMult,
              lit: lit ? lit.querySelector(".askT").textContent.trim() : null,
              sub: lit && lit.querySelector(".askS") ? lit.querySelector(".askS").textContent.trim() : "",
              hint: (document.querySelector("#askCard .cardHint")||{}).textContent||""};
    };
    return {sony:  look("elec", "e2", "Sony"),
            model: look("tools", "t1", "", "DeWalt 20V drill kit"),
            none:  look("elec", "e2", "")};
  });
  ok(r.sony.lit === "Sony",
     'a Sony laptop lights a button that says SONY, not somebody else\'s name — got ' + JSON.stringify(r.sony.lit));
  ok(/Apple/.test(r.sony.sub),
     "  with the tier it sits in underneath, so the tap is still obvious — " + r.sony.sub);
  ok(/Sony/.test(r.sony.hint) && /read off the name/.test(r.sony.hint),
     "  and a line saying where the make came from — " + r.sony.hint);
  ok(r.sony.tier === "hi", "  the tier itself was never wrong — " + r.sony.tier);
  ok(r.model.tier === "hi" && r.model.mult === 1.4,
     "the make in the MODEL is read too: DeWalt 20V drill kit prices as top tier — " + r.model.tier + " x" + r.model.mult);
  ok(r.model.lit === "DeWalt", "  and that button says DeWalt — got " + JSON.stringify(r.model.lit));
  ok(r.none.lit === null && /standard tier until you say/.test(r.none.hint),
     "a laptop with no make anywhere still lights nothing");
}

/* A tier tapped by hand has to beat the one read off the name, and go on
   beating it. It did not: namedBrand was recomputed on every render and
   won outright, so on a DeWalt row the tap moved the button and left the
   price where it was. */
console.log("\n  a tap overrules what was read off the name");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true; st.askAt=0;
    st.brand="mid"; st.brandTyped=""; st.model="DeWalt 20V drill kit"; st.bookName="";
    st.specSel={}; st.market=null; st.brandSet=false;
    st.mpPin=null; st.mpNone=false; st.brandQ="";
    render();
    const before = calcItem().brandMult;
    document.querySelector('[data-ask="brand"][data-askv="lo"]').click();
    st.askAt = 0; render();
    const x = calcItem();
    const lit = [...document.querySelectorAll(".askOpt")].find(b => b.classList.contains("on"));
    return {before, after: x.brandMult, tier: x.brandTier,
            lit: lit ? lit.querySelector(".askT").textContent.trim() : null};
  });
  ok(r.before === 1.4, "reads DeWalt off the model first — x" + r.before);
  ok(r.after < r.before && r.tier === "lo",
     "tapping the budget tier actually moves the PRICE, not just the button — x" + r.before + " → x" + r.after);
  ok(/Harbor Freight/.test(r.lit || ""), "  and the budget button is the lit one — " + r.lit);
}

/* brandSet is what makes a tap stick, so it has to be cleared when the
   next thing is put on the counter - otherwise one override silences the
   name-reading for every item after it. */
console.log("\n  the override does not follow you to the next item");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "t1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true;
    st.brand="mid"; st.brandTyped=""; st.model="DeWalt 20V drill kit"; st.brandSet=false;
    st.specSel={}; st.market=null; st.askAt=0; render();
    document.querySelector('[data-ask="brand"][data-askv="lo"]').click();
    const stuck = st.brandSet;
    startOver();
    return {stuck, after: st.brandSet};
  });
  ok(r.stuck === true, "the tap is remembered while that item is on the counter");
  ok(r.after === false, "  and forgotten when the next one is — got " + r.after);
}

/* THE SWEEP. Every make on every book, read back out of a sentence.
   The one-word scan could not see a make whose name is two words - 82 of
   them - and stopped at the first word it knew on five more, so a Fender
   Squier priced as a Fender and a Grand Seiko lost its premium. Nothing
   may read to a tier that is not its own. */
console.log("\n  every make on the books reads to its own tier");
{
  const r = await page.evaluate(() => {
    const wrong = [], blind = [];
    for (const catId of Object.keys(BRANDBOOK))
      for (const tier of ["hi","mid","lo"])
        for (const nm of BRANDBOOK[catId][tier]) {
          st.catId = catId; st.itemId = "__none__";
          const h = brandFromName(catId, nm + " 1234 thing");
          if (!h) blind.push(catId + " " + nm);
          else if (h.tier !== tier) wrong.push(catId + " " + nm + " -> " + h.name + " " + h.tier);
        }
    return {wrong, blind, total: Object.keys(BRANDBOOK).length};
  });
  ok(r.wrong.length === 0,
     "no make reads as a DIFFERENT tier than its own — " + (r.wrong.slice(0,4).join(" | ") || "none"));
  ok(r.blind.length === 0,
     "no make on the books is invisible to the reader — " + (r.blind.slice(0,6).join(" | ") || "none"));
}

/* An item's own brand list belongs to that item's category. It was applied
   whatever category was asked about, so the last thing priced decided which
   book answered: after a Harbor Freight generator, "black & decker drill"
   was handed the DeWalt row at +40%. The same search has to give the same
   answer whatever came before it. */
console.log("\n  one search, one answer, whatever came before it");
{
  const r = await page.evaluate(() => {
    const run = (q) => { st.catId = "tools"; st.itemId = "t1";
                         return brandInText("tools", q); };
    const clean = run("DeWalt 20V drill kit");
    /* park on an item that carries its own brand list, in another category */
    st.catId = "power"; st.itemId = "p7";
    const after = brandInText("tools", "DeWalt 20V drill kit");
    return {clean: clean && clean.name, after: after && after.name};
  });
  ok(r.clean === "DeWalt", "reads DeWalt from the tools book — " + r.clean);
  ok(r.after === "DeWalt",
     "  and still does while parked on a generator — got " + r.after);
}

/* Two-letter makes were unreachable: the three-character floor guarded the
   CONTAINMENT match and was applied to every match, so LG, GE, HK, FN, CZ
   and DC were on the books and could not be looked up. An LG set the book
   calls top tier read as no maker at all. */
console.log("\n  the two-letter makes are reachable");
{
  const r = await page.evaluate(() => {
    const out = {};
    for (const [cat, nm] of [["elec","LG"],["appl","GE"],["guns","CZ"],["guns","FN"],["guns","HK"]]) {
      st.catId = cat; st.itemId = "__none__";
      const h = brandLookup(cat, nm);
      out[nm] = h ? h.name + ":" + h.tier : null;
    }
    st.catId = "tools"; st.itemId = "__none__";
    out.junk = brandLookup("tools", "zz");
    return out;
  });
  ok(r.LG && r.GE && r.CZ && r.FN && r.HK,
     "LG, GE, CZ, FN and HK all look up — " + JSON.stringify(r));
  ok(r.junk === null, "  and a two-letter non-make still finds nothing");
}

/* The measured rows are named tools and the maker is most of what one is
   worth, but nothing compared it to the make that was typed. "milwaukee
   drill" put the DeWalt row on top and the Milwaukee row third - $65-110
   offered for a tool the desk's own row prices at $150-220. */
console.log("\n  a measured row may not carry somebody else's make");
{
  const r = await page.evaluate(() => {
    const first = (q) => { const {rows} = omniRows(q);
      const m = rows.find(x => x.kind === "mp"); return m ? m.mp[2] : null; };
    return {mil: first("milwaukee drill"), dew: first("dewalt drill"),
            bnd: first("black & decker drill"), plain: first("drill kit")};
  });
  ok(/Milwaukee/.test(r.mil || ""), '"milwaukee drill" offers the Milwaukee row — ' + r.mil);
  ok(/DeWalt/.test(r.dew || ""),    '"dewalt drill" still offers the DeWalt row — ' + r.dew);
  ok(r.bnd === null,
     '"black & decker drill" is offered no named row at all rather than a DeWalt — ' + r.bnd);
  ok(r.plain !== null, "  a search naming no make still reaches them — " + r.plain);
}

/* A word the parser already placed is not a word the entry has to carry.
   Built from the raw query, "55" and "inch" counted as unmatched, so the
   TV row was called a miss and "not on the lists" went above it - on the
   commonest thing in the shop, taking the make down with it. */
console.log("\n  a size the desk understood is not a different item");
{
  const r = await page.evaluate(() => {
    const kinds = (q) => omniRows(q).rows.map(x => x.kind);
    return {tv: kinds("samsung 55 inch tv"), bare: kinds("samsung tv"),
            pods: kinds("apple airpods pro"),
            miss: kinds("zzz nonesuch widget 9000")};
  });
  ok(r.tv[0] === "item", '"samsung 55 inch tv" leads with the TV row — ' + r.tv.join(","));
  ok(r.bare[0] === "item", "  as it always did without the size — " + r.bare.join(","));
  /* This asked for something the desk had never heard of, and AirPods Pro
     was the example - until the electronics harvest priced it off ten real
     sales. A model the desk now KNOWS is the right answer to lead with, so
     the example moved to something still genuinely absent. */
  ok(r.pods[0] === "mp",
     "  a model the desk has since measured leads with that row — " + r.pods.join(","));
  ok(r.miss[0] === "own",
     "  and a real miss is still offered as one, not forced onto a row — " + r.miss.join(","));
}

/* THE DESK MUST ANSWER - BUT ONLY ONCE IT HAS BEEN ASKED.

   This test used to assert the opposite, and it was right at the time. The
   desk computed a resale value from its own price book, refused to show any
   of it, and said "No resale value yet"; on an unconnected tablet the tool
   never answered at all. The fix was to show the built-in figure with an
   estimate label on it.

   The label was not enough. A Samsung tablet with no model named came back
   "pay up to $40, resells for $168" in mint green, with the caveat under it
   in small orange - and a Galaxy Tab runs from a Tab A7 Lite at about $45
   to a Tab S9 Ultra ten times that. The counter read the number, not the
   caveat, which is what numbers are for.

   So the contract is now: no figure until the run has been made - make,
   model, the specs that move the price, what it sells for, and the shape.
   The stranding this test was written to prevent is still prevented,
   because the strip never goes blank and always says what is outstanding,
   and because "what does it sell for" can be answered by typing a number
   with no service at all. What is gone is the desk answering a question
   nobody finished asking. */
console.log("\n  no figure until the run has been made");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "e2"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="e2"; st.picked=true;
    st.brandTyped="Microsoft"; st.brandSet=false; st.market=null; st.specSel={};
    st.model=""; st.detail=""; st.mpNone=false; st.condSet=false; st.askAt=0;
    render();
    const half = {ready: priceReady(calcItem()),
                  pin: (document.getElementById("pin")||{}).innerText || "",
                  ticket: (document.getElementById("ticket")||{}).innerText || ""};
    /* Now finish it, the way a counter with no signal would: the model off
       the label, the specs, the price typed by hand, the shape. */
    st.model="Surface Pro 7"; st.condSet=true;
    (SPEC_CHOICES[st.itemId]||[]).forEach((g,gi)=>{
      st.specSel[st.itemId+":"+gi]=specBase(g); });
    st.market={kind:"hand", key:mkKey(), mid:300};
    render();
    const x = calcItem();
    return {half, ready: priceReady(x), resale: x.resale, target: x.target,
            pin: (document.getElementById("pin")||{}).innerText || "",
            ticket: (document.getElementById("ticket")||{}).innerText || ""};
  });
  ok(r.half.ready === false, "half-run, the desk is not ready to price");
  ok(!/\$\d/.test(r.half.pin), "  the numbers strip quotes no figure");
  ok(!/No resale value yet/.test(r.half.pin) && /still needs/i.test(r.half.pin),
     "  but it does not go blank - it names what is outstanding: "
     + r.half.pin.replace(/\s+/g," ").slice(0,80));
  ok(!/\$\d/.test(r.half.ticket) && /still needs/i.test(r.half.ticket),
     "  and the loan card quotes none either");

  ok(r.ready === true, "run finished - with no service, by hand - the desk prices it");
  ok(r.resale > 0 && r.target > 0,
     "  resale " + Math.round(r.resale) + ", loan " + r.target);
  ok(/\$/.test(r.pin), "  and the numbers strip says the money");
  ok(/\$/.test(r.ticket) && !/Hold off/.test(r.ticket),
     "  as does the loan card, without telling the counter to come back later");
}

/* WHICH ONE IS IT. The model is the thing on the page that moves money
   most - it is what the sold-price lookup searches on, what the measured
   rows are matched against, and where the make is read from - and the run
   walked straight past it to the price. It existed only as an optional
   fold on the old whole-page layout. */
console.log("\n  the run asks which one it is");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "g1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="g1"; st.picked=true;
    st.brandTyped=""; st.brandSet=false; st.model=""; st.detail=""; st.specSel={}; st.market=null;
    const q = askQueue(calcItem());
    const at = q.findIndex(z => z.id === "model");
    st.askAt = at; render();
    const box = document.getElementById("modelIn");
    const det = document.getElementById("detailIn");
    return {at, titles: q.map(z => z.title), hasBox: !!box, hasDet: !!det,
            answered: q[at].answered,
            skips: !!document.querySelector('[data-askmove="1"]:not([disabled])')};
  });
  ok(r.at >= 0, "the model is a question in the run — " + r.titles.join(" | "));
  ok(r.at === 1, "  and it comes straight after the make, got position " + (r.at + 1));
  /* THE DETAIL BOX IS NOT ON THIS CARD ANY MORE.
     A catch-all "anything else" in front of the specific questions asks for
     free text before it asks the thing you actually reach for - on a TV,
     the screen size. It is its own step now, after every question that has
     a real answer and before the price lookup that reads it. */
  ok(r.hasBox, "  with a box for the model");
  ok(!r.hasDet, "  and NOT the anything-else box, which is its own step now");
  ok(r.answered === false, "  it counts as unanswered while the box is empty");
  ok(r.skips, "  and can be walked past — nothing is required");
}

/* WHERE "ANYTHING ELSE" SITS, AND WHY IT IS NOT LAST.
   Two constraints pull opposite ways. It must come AFTER every question
   with a real answer, because a catch-all in front of "what size screen"
   asks for free text instead of the thing you reach for. And it must come
   BEFORE the sold-price step, because what is typed there goes into the
   search - past that point it is read too late to change what the lookup
   does. So: after the last specific, immediately before the price. */
{
  const r = await page.evaluate(async () => {
    const q = askQueue(calcItem());
    const ids = q.map(z => z.id);
    const iExtra = ids.indexOf("extra"), iWorth = ids.indexOf("worth");
    const iModel = ids.indexOf("model");
    const spec = ids.map((id, i) => id.startsWith("spec:") ? i : -1).filter(i => i >= 0);
    st.askAt = iExtra; render();
    return {ids, iExtra, iWorth, iModel, lastSpec: spec.length ? Math.max(...spec) : -1,
            det: !!document.getElementById("detailIn"),
            answered: q[iExtra] && q[iExtra].answered,
            skips: !!document.querySelector('[data-askmove="1"]:not([disabled])')};
  });
  ok(r.iExtra > 0, "anything-else is its own question — " + r.ids.join(" > "));
  ok(r.iExtra > r.iModel, "  after the model");
  ok(r.lastSpec < 0 || r.iExtra > r.lastSpec, "  after every specific question");
  ok(r.iWorth > r.iExtra, "  and BEFORE the price, which searches on what it holds");
  ok(r.det, "  its card carries the box");
  ok(r.answered === true && r.skips, "  and it never blocks — nothing is required");
  /* this block walked the run to the extra step; the next one types into the
     model box, so put it back where it found it. */
  await page.evaluate(() => {
    st.askAt = askQueue(calcItem()).findIndex(z => z.id === "model"); render();
  });
}
{
  const r = await page.evaluate(async () => {
    const box = document.getElementById("modelIn");
    box.focus(); box.value = "870 Wingmaster";
    box.dispatchEvent(new Event("input", {bubbles:true}));
    await new Promise(z => setTimeout(z, 60));
    return {model: st.model, stillFocused: document.activeElement === document.getElementById("modelIn"),
            answered: askQueue(calcItem()).find(z => z.id === "model").answered};
  });
  ok(r.model === "870 Wingmaster", "typing in it reaches the desk — " + r.model);
  ok(r.stillFocused, "  and does not throw the cursor out of the box on every letter");
  ok(r.answered === true, "  the question reads as answered once something is in it");
}

/* Back and Skip sit side by side. brassBtn carries no vertical padding at
   all and relies on its surroundings for a height; in the run nothing gave
   it one, so Skip came out squat beside Back. */
console.log("\n  Back and Skip are the same shape");
{
  const r = await page.evaluate(() => {
    st.askAt = 0; render();
    const back = document.querySelector('.askNav [data-askmove="-1"]');
    const next = document.querySelector('.askNav [data-askmove="1"]');
    const a = back.getBoundingClientRect(), b = next.getBoundingClientRect();
    return {back: Math.round(a.height), next: Math.round(b.height),
            aligned: Math.abs((a.top + a.height/2) - (b.top + b.height/2)) < 2};
  });
  ok(Math.abs(r.back - r.next) <= 1,
     "they are the same height — Back " + r.back + "px, Skip " + r.next + "px");
  ok(r.back >= 36, "  and both are big enough to hit with a thumb");
  ok(r.aligned, "  and sit on the same line");
}

/* TYPE THREE LETTERS, TAP THE NAME, NEVER SPELL IT. The make question was
   three tier buttons - answering it meant knowing which tier a Ryobi sits
   in - and the model under it was raw text, where "stil ms271" finds
   nothing. The desk holds 423 makes and 179 measured models and was asking
   the counter to remember them. */
console.log("\n  the make and the model are picked, not spelled");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(y => y.items.some(i => i.id === "p1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="p1"; st.picked=true;
    st.brandTyped=""; st.brandQ=""; st.brandSet=false; st.model=""; st.detail="";
    st.mpPin=null; st.mpNone=false; st.market=null; st.specSel={}; st.askAt=0;
    render();
    const empty = document.querySelectorAll("[data-brandpick]").length;
    st.brandQ = "sti"; render();
    const hits = [...document.querySelectorAll("[data-brandpick]")]
      .map(b => b.dataset.brandpick + "/" + b.dataset.brandtier);
    /* tap it, the way a thumb would */
    document.querySelector('[data-brandpick="Stihl"]').click();
    const afterBrand = {name: st.brandTyped, tier: st.brand, set: st.brandSet,
                        at: st.askAt};
    const q = askQueue(calcItem());
    st.askAt = q.findIndex(z => z.id === "model"); render();
    const models = [...document.querySelectorAll("[data-modelpick]")]
      .map(b => b.querySelector(".askT").textContent.trim());
    document.querySelector("[data-modelpick]").click();
    return {empty, hits, afterBrand, models, model: st.model,
            pinned: !!st.mpPin, movedOn: st.askAt};
  });
  ok(r.empty === 0, "an empty box lists nothing — ten makes in book order is not a shortlist");
  ok(r.hits.length > 0 && r.hits.some(h => /^Stihl\//.test(h)),
     '  three letters finds it — "sti" gives ' + r.hits.join(", "));
  ok(r.afterBrand.name === "Stihl" && r.afterBrand.tier === "hi" && r.afterBrand.set === true,
     "  one tap sets the spelling AND the tier — " + r.afterBrand.name + "/" + r.afterBrand.tier);
  ok(r.afterBrand.at > 0, "  and moves on, the same as tapping a tier");
  ok(r.models.length >= 5 && r.models.every(m => /^Stihl/.test(m)),
     "the models offered are that make's, measured — " + r.models.length + " of them");
  ok(/^Stihl/.test(r.model) && r.pinned,
     "  tapping one spells it the way the sold-price search expects — " + r.model);
}

/* The details box invited "42in deck" one step before the buttons asked for
   the deck. Typed twice, or wondered which one counted. */
console.log("\n  the free-text box stops asking for what the buttons ask");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(y => y.items.some(i => i.id === "p5"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="p5"; st.picked=true;
    st.brandTyped=""; st.brandQ=""; st.model=""; st.detail=""; st.mpPin=null;
    st.mpNone=false; st.market=null; st.specSel={}; st.askAt=0;
    const q = askQueue(calcItem());
    st.askAt = q.findIndex(z => z.id === "model"); render();
    return {covered: specCovered(), line: coveredLine(),
            ph: (document.getElementById("detailIn")||{}).placeholder || ""};
  });
  ok(r.covered.indexOf("deck") >= 0 && r.covered.indexOf("hours") >= 0,
     "a riding mower asks deck and hours as buttons — " + r.covered.join(", "));
  ok(/deck/i.test(r.line) && /hours/i.test(r.line) && /asked next/.test(r.line),
     "  so the model step says they are coming — " + r.line);
  ok(!/deck/i.test(r.ph), "  and stops offering them as a placeholder — " + (r.ph || "(empty)"));
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
