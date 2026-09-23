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
ok(/^1 of 6/.test(r.where), "a cordless drill asks six questions — " + r.where);
ok(/make/i.test(r.q), "it opens on the make — " + r.q);
ok(r.backOff, "  Back is dead on the first one");
ok(r.dots === 6, "  a dot for every question, got " + r.dots);

/* the whole point: answering moves on */
await page.click(".askOpt");
r = await read();
ok(/^2 of 6/.test(r.where), "answering moves to the next by itself — " + r.where);
ok(r.done >= 1, "  and the one behind is marked done, got " + r.done);
ok(!r.backOff, "  Back is alive now");

/* the specifics ARE the questions, not fields under them */
const seen = [];
await start("t1");
for (let i = 0; i < 6; i++) {
  const s = await read(); if (!s) break;
  seen.push(s.q);
  const b = await page.$(".askOpt");
  if (b && s.opts.length) { await b.click(); await page.waitForTimeout(120); } else break;
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
      st.specSel={}; st.market=null; st.brandSet=false;
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
            pods: kinds("apple airpods pro")};
  });
  ok(r.tv[0] === "item", '"samsung 55 inch tv" leads with the TV row — ' + r.tv.join(","));
  ok(r.bare[0] === "item", "  as it always did without the size — " + r.bare.join(","));
  ok(r.pods[0] === "own",
     "  and a real miss is still offered as one, not forced onto a row — " + r.pods.join(","));
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
