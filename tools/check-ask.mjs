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
  st.condSet = false; st.completeSet = false; st.complete = true; st.market = null;
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
    /* Question one carries no backward MOVE at all now - it carries a live
       "Pick another" that leaves the run, because a dead Back there was
       reported as broken and fairly so. */
    backOff: !c.querySelector('[data-askmove="-1"]'),
    outBtn: !!c.querySelector("[data-askout]"),
    /* The last card no longer carries a forward MOVE at all - it carries a
       live "See the detail" instead of a dead button labelled Next. */
    nextOff: !c.querySelector('[data-askmove="1"]'),
    doneBtn: (c.querySelector('[data-askdone]') || {}).textContent,
    cards: document.querySelectorAll("#view > .card, #view .colQ > .card").length };
});

console.log("\none question at a time\n");

await start("t1");
let r = await read();
ok(!!r, "the run renders at all");
ok(/^1 of 8/.test(r.where), "a cordless drill asks eight questions — " + r.where);
ok(/make/i.test(r.q), "it opens on the make — " + r.q);
ok(r.backOff && r.outBtn,
   "  question one offers a way out of the run, not a backward step");
ok(r.dots === 8, "  a dot for every question, got " + r.dots);

/* the whole point: answering moves on */
await page.click(".askOpt");
r = await read();
ok(/^2 of 8/.test(r.where), "answering moves to the next by itself — " + r.where);
ok(r.done >= 1, "  and the one behind is marked done, got " + r.done);
ok(!r.backOff, "  a real Back appears once there is something behind you");

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
    st.model=""; st.detail=""; st.mpNone=false; st.condSet=false; st.completeSet = false; st.askAt=0;
    render();
    const half = {ready: priceReady(calcItem()),
                  pin: (document.getElementById("pin")||{}).innerText || "",
                  ticket: (document.getElementById("ticket")||{}).innerText || ""};
    /* Now finish it, the way a counter with no signal would: the model off
       the label, the specs, the price typed by hand, the shape. */
    st.model="Surface Pro 7"; st.condSet=true; st.completeSet = true;
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
  /* It used to have to come before the price step, because what is typed
     there fed the sold-price search. That constraint is gone: the price
     step moved up to sit beside the model, and the automatic lookup fires
     when the item is PICKED, earlier than either. What is typed here now
     reaches the link-out buttons and the ticket, both of which re-read it.
     The Osmo measurement makes that the better half of the trade anyway -
     extra words narrow a search until it finds a different product. */
  ok(r.iExtra > r.iWorth, "  and after the price step, which no longer depends on it");
  ok(r.det, "  its card carries the box");
  ok(r.iWorth === r.iModel + 1,
     "  and the price step sits right after the model, not at the far end");

  /* THE END OF THE RUN IS NOT A DEAD BUTTON.
     The last card used to carry a DISABLED button still labelled "Next":
     answer the final question and the only thing shaped like a way forward
     stops responding, with more page below it and nothing saying so. It
     reads as broken rather than finished. */
  const fin = await page.evaluate(() => {
    const q = askQueue(calcItem());
    st.askAt = q.length - 1; render();
    const c = document.getElementById("askCard");
    /* the finish is a live button whichever of its three shapes it takes:
       log the deal, jump to the gap, or point at the options above */
    const b = c.querySelector(".askNav button[data-askdone], .askNav button[data-askgo]");
    return {move: !!c.querySelector('[data-askmove="1"]'),
            done: !!b,
            label: b ? b.textContent : "",
            dead: !!c.querySelector('[data-askmove="1"][disabled]')};
  });
  ok(!fin.dead, "the last card carries no dead Next button");
  ok(!!fin.done, "  it carries a live finish instead");
  ok(fin.label.length > 0, "  that says something — \"" + fin.label.trim() + "\"");

  /* AND IT HAS TO SAY THE RIGHT SOMETHING.
     "See the detail" was my guess at what follows the last question and it
     was wrong twice: nobody knows which detail, and on the desk the card it
     scrolled to is already on screen, so the click had no visible effect.
     A button with no visible effect is a broken button whatever it does
     inside. What follows the last question is not a place, it is the next
     ACTION - the run has a gap in it, or it is done and wants logging. */
  const lbl = await page.evaluate(() => {
    const read = () => {
      const q = askQueue(calcItem());
      st.askAt = q.length - 1; render();
      const b = document.querySelector(".askNav button[data-askdone],.askNav button[data-askgo]");
      return b ? {t:b.textContent.trim(), k:b.dataset.askdone || "go"} : null;
    };
    const out = {};
    st.mode = "item"; st.catId = "tools"; st.itemId = "t1"; st.picked = true;
    st.brandSet = true; st.model = "DCD791";

    /* a gap earlier in the run */
    st.market = {kind:"found", key:mkKey(), mid:30, lo:13, hi:35, n:21, sold:21, basis:"sold", comps:[]};
    st.condSet = false; st.completeSet = false; render();
    out.gap = read();

    /* nothing left at all */
    st.market = {kind:"hand", key:mkKey(), mid:100}; st.condSet = true; st.completeSet = true; render();
    out.done = read();
    return out;
  });
  ok(lbl.gap && /still to answer/i.test(lbl.gap.t) && lbl.gap.k === "go",
     "a gap earlier in the run is named and jumped to — \"" + (lbl.gap||{}).t + "\"");
  ok(lbl.done && /write the ticket/i.test(lbl.done.t) && lbl.done.k === "log",
     "  and a finished run offers the thing you actually do next — \"" + (lbl.done||{}).t + "\"");
  ok(!/see the detail/i.test(JSON.stringify(lbl)),
     "  and neither of them says \"see the detail\"");

  /* NOTHING LIT UNTIL SOMEBODY SAYS SO.
     st.cond defaults to "good" because the arithmetic needs something, so
     Good came up already highlighted and read as a choice that had been
     made - "it looks like good is selected, but it actually is not until I
     click it". Condition runs +30% to -55%, the widest lever on the page,
     and the screen was showing an answer nobody gave. The make above
     already followed this rule; condition did not. */
  const condLit = await page.evaluate(() => {
    st.market = {kind:"found", key:mkKey(), mid:30, lo:13, hi:35, n:21, sold:21, basis:"sold", comps:[]};
    st.condSet = false; st.completeSet = false; st.cond = "good"; render();
    const q = askQueue(calcItem());
    st.askAt = q.findIndex(z => z.id === "cond"); render();
    const before = [...document.querySelectorAll("#askCard .askOpt.on")].length;
    const opt = document.querySelector("#askCard .askOpt");
    opt.click();
    const after = [...document.querySelectorAll("#askCard .askOpt.on")].length;
    return {before, after, condSet: !!st.condSet};
  });
  ok(condLit.before === 0,
     "no condition is lit before one is chosen — got " + condLit.before + " lit");
  ok(condLit.condSet === true && condLit.after >= 0,
     "  and choosing one records it");

  /* AND THE SAME DEAD BUTTON AT THE OTHER END.
     Back was disabled on question one because there is no earlier
     question. True, and useless: what the counter wants there is the way
     OUT - he has picked the wrong thing off the search box and needs to
     pick again. Reported as "the back button doesnt work on page 1", and
     it did not, in the only sense that matters to somebody holding an
     item. Same disease as the dead "Next" on the last card. */
  const one = await page.evaluate(() => {
    st.askAt = 0; render();
    const nav = document.querySelector(".askNav");
    const out = nav.querySelector("[data-askout]");
    return {dead: !!nav.querySelector('[data-askmove="-1"][disabled]'),
            out: !!out, label: out ? out.textContent.trim() : ""};
  });
  ok(!one.dead, "question one carries no dead Back button");
  ok(one.out, "  it carries a live way out instead");
  ok(/another|pick/i.test(one.label), "  that says what it does — \"" + one.label + "\"");

  const left = await page.evaluate(async () => {
    document.querySelector("[data-askout]").click();
    await new Promise(z => setTimeout(z, 120));
    return {picked: st.picked, omni: !!document.getElementById("omniIn"),
            ask: !!document.getElementById("askCard")};
  });
  ok(left.picked === false && left.omni && !left.ask,
     "  and it really goes back to the search box — " + JSON.stringify(left));
  /* that click left the run entirely; put the page back where it was found */
  await page.evaluate(() => {
    st.mode = "item"; st.picked = true; render();
    st.askAt = askQueue(calcItem()).findIndex(z => z.id === "model"); render();
  });

  /* A QUESTION THAT CANNOT MOVE THE NUMBER IS NOT A QUESTION.
     calcItem takes a hand-typed resale AS IT STANDS: cond is forced to 1,
     and brandMult and spec.mult are not in that branch at all. The counter
     has the thing in his hands and priced THIS one, so the wear and the
     screen size are already inside his figure - applying them again would
     price them twice. That much is deliberate.
     What was not deliberate: the run kept asking. Screen size, age, and
     then "what shape is it in?" on the very last card, every answer thrown
     away - and on exactly the items the desk had already failed to price,
     so the counter had just done the research himself. */
  const hand = await page.evaluate(() => {
    const before = askQueue(calcItem()).map(z => z.id);
    /* exactly what the Save button does */
    st.editing = false;
    st.market = {kind:"hand", key:mkKey(), mid:125};
    render();
    const after = askQueue(calcItem()).map(z => z.id);
    const x = calcItem();
    return {before, after, kind: x.market && x.market.kind, checked: x.checked};
  }).catch(() => null);

  if (hand && hand.kind === "hand") {
    ok(!hand.after.some(id => id.startsWith("spec:")),
       "once the price is typed by hand the spec questions go — " + hand.after.join(" > "));
    ok(!hand.after.includes("cond"),
       "  and so does the condition question, which calcItem forces to 1");
    ok(hand.after.includes("complete") === hand.before.includes("complete"),
       "  but completeness stays, because completeMult IS applied to a hand-set figure");
    ok(hand.after.includes("worth"), "  and the price step itself is still there");
  } else {
    ok(false, "could not set a hand-typed price to test with — got " + (hand && hand.kind));
  }
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

  /* AND THE BUTTON HAS TO SAY SO.
     Its label is decided when the card is drawn, and typing deliberately
     does not redraw the card - that was fixed so the cursor stops being
     thrown out of the box mid-word. The label froze with it: a typed-in
     model still offered "Skip", which reads as "this did not register".
     The click was always correct; only the word was wrong. */
  const nav = await page.evaluate(() => {
    const b = document.querySelector('[data-askmove="1"]');
    const at = Number(st.askAt) || 0;
    const dot = document.querySelectorAll(".askDots i")[at];
    return {label: (b ? b.textContent : "").trim(),
            dotDone: !!(dot && dot.classList.contains("done")),
            cursorHeld: document.activeElement === document.getElementById("modelIn")};
  });
  ok(/^Next/.test(nav.label), "  and the way forward says Next, not Skip — got \"" + nav.label + "\"");
  ok(nav.dotDone, "  and its dot is filled in");
  ok(nav.cursorHeld, "  without the repaint stealing the cursor back out of the box");

  /* clearing it puts the word back */
  const back = await page.evaluate(async () => {
    const box = document.getElementById("modelIn");
    box.focus(); box.value = "";
    box.dispatchEvent(new Event("input", {bubbles:true}));
    await new Promise(z => setTimeout(z, 60));
    const b = document.querySelector('[data-askmove="1"]');
    return {label: (b ? b.textContent : "").trim(), model: st.model};
  });
  ok(back.model === "" && /^Skip/.test(back.label),
     "  emptying the box puts Skip back — got \"" + back.label + "\"");
}

/* Back and Skip sit side by side. brassBtn carries no vertical padding at
   all and relies on its surroundings for a height; in the run nothing gave
   it one, so Skip came out squat beside Back. */
console.log("\n  Back and Skip are the same shape");
{
  const r = await page.evaluate(() => {
    st.askAt = 0; render();
    /* Whichever pair the card is carrying. On question one the left one is
       the way OUT of the run rather than a backward step, and on the last
       card the right one is the finish - they still have to match. */
    const nav = document.querySelector(".askNav");
    const back = nav.querySelector('[data-askmove="-1"], [data-askout]');
    const next = nav.querySelector('[data-askmove="1"], [data-askdone]');
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
  /* This asked for five and got eight until 25 Sep, when the chainsaw rows
     built out of eBay asking prices came out of the book - a saw search
     returns bars, chains and carburettors, so those five "measured" Stihls
     were measured off parts. Three are left and they are real. The
     assertion that matters is the every(), not the count: what is offered
     belongs to the make that was picked. */
  ok(r.models.length >= 3 && r.models.every(m => /^Stihl/.test(m)),
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

/* REPORTED FROM THE COUNTER: "the default answers for all the steps should
   not be highlighted already, because that appears that it has already been
   selected. So if you hit the next button, it's really a skip button and
   that answer was not actually selected, throwing things off."
   The condition question was fixed for this once already. The specs and the
   completeness question were not, and completeness was the worse of the two
   because it ALSO counted itself answered. */
console.log("\n  nothing is lit until somebody picks it");
{
  const r = await page.evaluate(() => {
    const out = {};
    const c = CATALOG.find(y => y.items.some(i => i.id === "t1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true;
    st.specSel={}; st.complete=true; st.completeSet=false; st.condSet=false;
    st.cond="good"; st.brandSet=false; st.brandTyped=""; st.model="DCD791";
    st.market={kind:"found", key:mkKey(), mid:100, lo:80, hi:120, n:20, sold:20, basis:"sold", comps:[]};
    const q = askQueue(calcItem());
    const look = (id) => {
      const i = q.findIndex(z => z.id === id);
      if (i < 0) return null;
      st.askAt = i; render();
      const card = document.getElementById("askCard");
      const opts = [...card.querySelectorAll(".askOpts .askOpt")];
      return {n: opts.length, lit: opts.filter(b => b.classList.contains("on")).length,
              answered: q[i].answered};
    };
    out.spec = look((q.find(z => /^spec:/.test(z.id)) || {}).id);
    out.comp = look("complete");
    out.cond = look("cond");
    /* and picking one DOES light it */
    const i = q.findIndex(z => z.id === "complete");
    if (i >= 0) { st.askAt = i; render();
      const b = document.querySelector("#askCard .askOpts .askOpt");
      if (b) b.click();
      /* answering moves the run on by itself, so come back to the card that
         was answered before counting what is lit on it */
      st.askAt = i; render();
      const card = document.getElementById("askCard");
      out.after = card ? [...card.querySelectorAll(".askOpts .askOpt")]
        .filter(b2 => b2.classList.contains("on")).length : -1;
      out.nowAnswered = askQueue(calcItem()).find(z => z.id === "complete").answered; }
    return out;
  });
  ok(r.spec && r.spec.n > 1 && r.spec.lit === 0,
     "a spec card opens with none of its " + ((r.spec||{}).n) + " choices highlighted");
  ok(r.comp && r.comp.lit === 0, "  \"is it all there\" opens with neither answer highlighted");
  ok(r.comp && r.comp.answered === false,
     "  and does NOT count itself answered, so Next reads Skip rather than agreement");
  ok(r.cond && r.cond.lit === 0, "  the condition card is still clean too");
  ok(r.after === 1, "  and tapping one lights exactly that one \u2014 got " + r.after);
  ok(r.nowAnswered === true, "  and only then is the question answered");
}

/* REPORTED FROM THE COUNTER: "when step eight, which is the final step, is
   answered, it needs to have some sort of conclusion. Right now it just sits
   there and all the information is on the right sidebar, almost appearing
   like it's still waiting on me to answer a question." */
console.log("\n  the run ends in an answer, on the card that asked the last question");
{
  const r = await page.evaluate(() => {
    const c = CATALOG.find(y => y.items.some(i => i.id === "t1"));
    st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId="t1"; st.picked=true;
    st.specSel={}; st.complete=true; st.completeSet=false; st.condSet=false;
    st.brandSet=true; st.model="DCD791";
    st.market={kind:"found", key:mkKey(), mid:100, lo:80, hi:120, n:20, sold:20, basis:"sold", comps:[]};
    let q = askQueue(calcItem());
    st.askAt = q.length - 1; render();
    const before = !!document.querySelector("#askCard .askDone");
    /* answer everything that is still open */
    (SPEC_CHOICES[st.itemId]||[]).forEach((g,gi)=>{ st.specSel[st.itemId+":"+gi]=0; });
    st.completeSet = true; st.condSet = true;
    q = askQueue(calcItem()); st.askAt = q.length - 1; render();
    const card = document.getElementById("askCard");
    const done = card.querySelector(".askDone");
    return {before, after: !!done,
      cells: done ? [...done.querySelectorAll(".adCell .d")].map(e => e.textContent.trim()) : [],
      keys:  done ? [...done.querySelectorAll(".adCell .k")].map(e => e.textContent.trim()) : [],
      why:   done ? (done.querySelector(".adWhy")||{}).textContent || "" : "",
      open:  askQueue(calcItem()).filter(z => !z.answered).length};
  });
  ok(r.open === 0, "everything is answered");
  ok(r.before === false, "  with a question still open the card carries no verdict");
  ok(r.after === true, "  answered, the card itself carries one");
  ok(r.cells.length === 3 && r.cells.every(v => /^\$[\d,]+$/.test(v)),
     "  three figures, all money \u2014 " + r.cells.join(" / "));
  ok(/pays back/i.test(r.keys.join(" ")), "  one of them is what he pays back \u2014 " + r.keys.join(" | "));
  ok(/never above the top/i.test(r.why), "  and the window is stated with it");
}

/* REPORTED FROM THE COUNTER: "there's this window that I may want to lend
   within, how do I input the actual decision so that I can log that number
   with the deal? None of them are a manual entry." */
console.log("\n  the number actually agreed can be typed, and it is what gets logged");
{
  const r = await page.evaluate(() => {
    const out = {};
    const x0 = calcItem();
    out.suggested = Math.round(x0.target);
    out.emptyLogs = struckAmt(x0).amt;
    out.emptyTyped = struckAmt(x0).typed;
    const box = document.querySelector("#askCard .struck");
    out.hasBox = !!box;
    const inp = box && box.querySelector(".struckIn");
    out.hasInput = !!inp;
    if (inp) { inp.value = "77"; inp.dispatchEvent(new Event("input", {bubbles:true})); }
    const x1 = calcItem();
    out.typedAmt = struckAmt(x1).amt;
    out.typedFlag = struckAmt(x1).typed;
    out.note = box ? (box.querySelector(".struckNote")||{}).textContent || "" : "";
    /* the two boxes on screen stay in step */
    out.mirrored = [...document.querySelectorAll(".struckIn")].map(e => e.value);
    /* bought instead of lent */
    const bb = box && box.querySelector('[data-struckkind="buy"]');
    if (bb) bb.click();
    out.kind = struckAmt(calcItem()).kind;
    const b2 = document.querySelector("#askCard .struck");
    out.buyNote = b2 ? (b2.querySelector(".struckNote")||{}).textContent || "" : "";
    return out;
  });
  ok(r.hasBox && r.hasInput, "the conclusion carries a box to type it in");
  ok(r.emptyTyped === false && r.emptyLogs === r.suggested,
     "  left empty it logs the suggested " + r.emptyLogs);
  ok(r.typedFlag === true && r.typedAmt === 77,
     "  typed, it logs what was typed \u2014 got " + r.typedAmt);
  ok(/\$77/.test(r.note) && /pays back/i.test(r.note),
     "  and the screen says what that means before it is saved \u2014 " + r.note.slice(0, 90));
  ok(r.mirrored.every(v => v === "77"),
     "  every copy of the box on screen shows the same number \u2014 " + r.mirrored.join(", "));
  ok(r.kind === "buy" && /bought outright/i.test(r.buyNote),
     "  and it can record a straight buy instead of a loan");
}

/* REPORTED FROM THE COUNTER, with a photograph: typed "microsoft surface
   book", and the make step said NOTHING PICKED YET. "The tool may not know
   this specific model, but it should understand Microsoft as a brand."
   It did know. Three separate things were hiding it:
     - "surface book" matched nothing, so the word "book" sent it to COMIC
       BOOKS and the counter took the "not on the lists" route;
     - that route parked the item in whatever aisle was open, which is guns
       by default - so the make was being looked up in the FIREARMS book,
       where Microsoft is quite reasonably absent;
     - and the one line that did read the words read only the TIER off them
       and then blanked the make, on both the phone and the desk. */
console.log("\n  the make the counter typed is not thrown away");
{
  const r = await page.evaluate(async () => {
    const out = {};
    /* the desk knows all of this already - none of it is new knowledge */
    out.reads = !!brandFromName("elec", "microsoft surface book");
    out.notAGun = !brandFromName("guns", "microsoft surface book");
    out.guess = guessCat("microsoft surface book");
    /* the search finds the machine now, rather than a long box of comics */
    const find = async (q) => {
      st.mode = "item"; st.picked = false; st.bookName = ""; st.needKind = false; render();
      const inp = document.getElementById("omniIn");
      inp.value = q; inp.dispatchEvent(new Event("input", {bubbles:true}));
      await new Promise(z => setTimeout(z, 350));
      return [...document.querySelectorAll("[data-omni]")].map(e => e.innerText.replace(/\s+/g, " "));
    };
    out.book = (await find("surface book"))[0] || "";
    out.pro  = (await find("surface pro"))[0] || "";
    /* and the route that was actually taken */
    const rows = await find("microsoft surface book");
    out.rows = rows.length;
    const own = [...document.querySelectorAll("[data-omni]")]
      .find(e => /not on the lists/i.test(e.innerText));
    own.click();
    await new Promise(z => setTimeout(z, 250));
    out.cat = st.catId; out.item = st.itemId; out.needKind = st.needKind;
    out.brand = st.brandTyped; out.tier = st.brand; out.set = st.brandSet;
    out.kept = st.bookName;
    const q = askQueue(calcItem());
    const bi = q.findIndex(z => z.id === "brand");
    st.askAt = bi; render();
    const card = document.getElementById("askCard");
    out.says = card ? card.innerText.replace(/\s+/g, " ").slice(0, 120) : "";
    return out;
  });
  ok(r.reads && r.notAGun,
     "the desk reads Microsoft out of those words for electronics, and not for guns");
  ok(r.guess === "elec", "  so the aisle can be read off them too \u2014 got " + r.guess);
  ok(/Surface Book/i.test(r.book) && /Laptop/i.test(r.book),
     '  "surface book" finds a laptop, not a long box of comics \u2014 ' + r.book.slice(0, 48));
  ok(/Surface Pro/i.test(r.pro) && /Tablet/i.test(r.pro),
     '  "surface pro" finds a tablet, not a gas grill \u2014 ' + r.pro.slice(0, 48));
  ok(r.cat === "elec" && r.item === "cust-elec",
     "  and the not-on-the-lists route no longer files it under guns \u2014 " + r.item);
  ok(r.needKind === false, "  it does not have to stop and ask, either");
  ok(r.brand === "Microsoft" && r.set === true,
     "  the make is written down, not just used \u2014 " + JSON.stringify(r.brand) + " set=" + r.set);
  ok(/Microsoft/.test(r.says) && !/Nothing picked yet/i.test(r.says),
     "  so the make step names it instead of claiming ignorance \u2014 " + r.says.slice(0, 80));
  ok(r.kept === "microsoft surface book",
     "  and the counter's own words are still what the card is called \u2014 " + JSON.stringify(r.kept));
}

/* When the words say nothing, the desk has to ASK - and it was asking in a
   card that neither the phone nor the desk draws in the one-question run,
   so it asked nobody and filed the thing under guns. */
console.log("\n  and when the words say nothing, the run asks");
{
  const r = await page.evaluate(async () => {
    st.mode = "item"; st.picked = false; st.bookName = ""; st.needKind = false;
    st.catId = "guns"; render();
    const inp = document.getElementById("omniIn");
    inp.value = "blue thingamajig"; inp.dispatchEvent(new Event("input", {bubbles:true}));
    await new Promise(z => setTimeout(z, 350));
    [...document.querySelectorAll("[data-omni]")]
      .find(e => /not on the lists/i.test(e.innerText)).click();
    await new Promise(z => setTimeout(z, 250));
    const card = document.getElementById("askCard");
    const before = {needKind: st.needKind, cat: st.catId,
      q: card ? card.querySelector(".askQ").textContent.trim() : "(no card at all)",
      opts: card ? card.querySelectorAll(".askOpt").length : -1,
      lit: card ? card.querySelectorAll(".askOpt.on").length : -1,
      priced: priceReady(calcItem())};
    const pick = card && card.querySelector('[data-askv="elec"]');
    if (pick) pick.click();
    await new Promise(z => setTimeout(z, 250));
    return {before, after: {needKind: st.needKind, cat: st.catId, item: st.itemId, kept: st.bookName}};
  });
  ok(/what kind of thing/i.test(r.before.q),
     "the run asks it, on the card the counter is already looking at \u2014 " + JSON.stringify(r.before.q));
  ok(r.before.opts === 11 && r.before.lit === 0,
     "  every aisle offered, none of them lit \u2014 " + r.before.opts + " options, " + r.before.lit + " lit");
  ok(r.before.priced === false, "  and nothing is priced until it is answered");
  ok(r.after.cat === "elec" && r.after.item === "cust-elec" && r.after.needKind === false,
     "  answering moves it to that aisle \u2014 " + r.after.item);
  ok(r.after.kept === "blue thingamajig",
     "  keeping what was typed \u2014 " + JSON.stringify(r.after.kept));
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
