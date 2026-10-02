#!/usr/bin/env node
/* THE RUN THAT COULD NOT END, AND THE HERO THAT SAT ON THE LIST.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-deadend.mjs
 *
 * Four things reported from the counter in one breath:
 *
 *   "On an item that doesn't currently have a price data set I think
 *    question number seven is the same thing that shows at the very end
 *    which is look up one one sold for ... but there's no screen at the
 *    end of the workflow that indicates that isn't any more steps to take
 *    until you look it up it just keeps recycling them back through
 *    question number 7 which forces you to go to eBay and watch count
 *    which leads me to my next issue watch count always brings up these
 *    wildly outrageous prices ... I'm looking up at TCL cheap TV and it's
 *    showing $10,000 which is obviously incorrect the eBay button gave me
 *    this oops try again here so I'm not sure if the ebay link is working
 *    or not."
 *
 *   "Also, on the home screen, when I start to type in something,
 *    especially on my phone, the big blue middle price icon stays at the
 *    top and then the keyboard comes in from the bottom, making it
 *    extremely difficult to see any of the populated lists in the middle."
 *
 * So: a way out of the one question the app cannot answer itself; a lane
 * to a sold page that needs no sign-in; the two kinds of WatchCount row
 * that have to be thrown out before the middle means anything; and a hero
 * that gets out of the way while the keyboard is up.
 *
 * Each section is written so a build without the fix goes RED rather than
 * throwing - a stack trace prints no FAIL line and the sweep reads it as
 * green. That has happened here three times.
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
/* Phone width on purpose: the hero fold is a phone rule, and the ask card
   is the same markup either way. 390x780 is roughly his screen's CSS px. */
const page = await browser.newPage({viewport:{width:390, height:780}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(1000);

console.log("\n  the machinery this suite is about exists");
const have = await page.evaluate(() => ({
  ask:   typeof askQueue === "function" && typeof calcItem === "function"
         && typeof runFinished === "function" && typeof step4Inner === "function",
  comps: typeof compTargets === "function",
  omni:  !!document.getElementById("omniIn"),
}));
ok(have.ask,   "  the ask run and its queue are wired");
ok(have.comps, "  the sold-page lanes are wired");
ok(have.omni,  "  the search box is on the home screen");
if (!have.ask || !have.comps || !have.omni) {
  console.log("\n  (skipping the rest - there is nothing to check)");
  await browser.close();
  console.log(`\n${fails} FAILED`);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
console.log("\n  the one question the app cannot answer has a way out");
/* An item with no built-in figure, nothing looked up: the state he was in.
   "worth" is unanswered, and nothing inside the app can answer it - which
   is the recycling he reported. */
const dead = await page.evaluate(() => {
  const id = "e2";
  const c = CATALOG.find(x => x.items.some(i => i.id === id));
  st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId=id; st.picked=true;
  st.brandTyped="TCL"; st.brand="mid"; st.brandSet=true; st.model="Roku 55"; st.detail="";
  st.specSel={}; (SPEC_CHOICES[id]||[]).forEach((g,gi)=>{ st.specSel[id+":"+gi]=specBase(g); });
  st.condSet=true; st.completeSet=true; st.complete=true;
  st.market=null; st.mpPin=null; st.mpNone=true; st.worthNone=false;
  st.askEdit=false;
  const open = x => askQueue(x).filter(z => !z.answered && !z.optional).map(z => z.id);
  st.askAt = askQueue(calcItem()).length - 1; render();
  const before = {open: open(calcItem()), fin: runFinished(calcItem())};
  /* Walking forward does not help: the only open question is the one that
     waits on a website. That is the dead end, stated as a measurement. */
  st.askAt = firstOpenAsk(calcItem()); render();
  const stuck = {at: st.askAt, id: askQueue(calcItem())[st.askAt].id};
  return {before, stuck,
    /* and the escape hatch has to be ON the card, reachable by thumb */
    onCard: !!document.getElementById("worthNone")};
});
ok(dead.before.open.length === 1 && dead.before.open[0] === "worth",
   `  with nothing looked up the only open question is the sold price - open: [${dead.before.open.join(", ")}]`);
ok(dead.before.fin === false,
   "  so the run cannot finish, which is the recycling he reported");
ok(dead.stuck.id === "worth",
   `  and walking forward lands back on it - question ${dead.stuck.at+1}, "${dead.stuck.id}"`);
ok(dead.onCard, "  the card carries a \"Nothing to find\" button");

const out = await page.evaluate(async () => {
  const b = document.getElementById("worthNone");
  if (!b) return null;
  b.click();
  await new Promise(r => setTimeout(r, 120));
  const x = calcItem();
  const open = askQueue(x).filter(z => !z.answered && !z.optional).map(z => z.id);
  const card = document.getElementById("askCard");
  const text = h => String(h||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ");
  return {open, fin: runFinished(x), flag: !!st.worthNone,
    checked: !!x.checked, resale: x.resale, buy: x.target, lend: x.loan,
    /* the price is allowed to exist - but the screen must still say where
       it came from, in the same words it uses when nobody has looked */
    behind: text(typeof weightHTML === "function" ? weightHTML(x) : ""),
    done: !!(card && card.querySelector(".askDone"))};
});
ok(out && out.flag, "  pressing it records that he looked");
ok(out && out.open.length === 0,
   `  and nothing is left open - open after: ${out && out.open.length ? out.open.join(", ") : "NONE"}`);
ok(out && out.fin === true, "  the run finishes instead of recycling");
ok(out && out.done, "  and the card shows the end of the run rather than a question");
/* THE ASSERTION THAT KEEPS THIS HONEST. Finishing must not promote a guess
   to a researched figure. If this ever goes green while `checked` is true,
   the hatch has started lying about the evidence. */
ok(out && out.checked === false,
   "  the figure is still marked unchecked - a man looking and finding nothing is not evidence");
ok(out && /built-in starting point/.test(out.behind) && /nothing looked up/i.test(out.behind),
   "  and \"Behind this number\" still reads nothing looked up, built-in starting point");
ok(!!out && out.resale > 0 && out.buy > 0,
   out ? `  there is a price to work from - resale ${Math.round(out.resale)}, buy ${Math.round(out.buy)}, lend ${Math.round(out.lend||0)}`
       : "  there is a price to work from - the button was not on the card, so nothing was pressed");

/* ------------------------------------------------------------------ */
console.log("\n  there is a sold page that needs no sign-in");
const lanes = await page.evaluate(() => {
  const t = compTargets(calcItem());
  return {ids: t.map(z => z.id), list: t.map(z => ({id:z.id, name:z.name, sub:z.sub||"", url:z.url}))};
});
const plain = lanes.list.find(z => z.id === "ebaysold");
ok(!!plain, `  the lanes are [${lanes.ids.join(", ")}]`);
ok(!!plain && /LH_Sold=1/.test(plain.url) && /LH_Complete=1/.test(plain.url),
   "  and the plain one asks eBay for sold and completed listings");
ok(!!plain && !/sh\/|sellerhub|terapeak/i.test(plain.url),
   "  on the open search path, not the Seller Hub one that failed three times");
/* GUARDED, BECAUSE IT CRASHED ON THE REVERT. With the lane taken out this
   line read plain.sub off null, threw, and the three sections after it
   never ran - and a stack trace prints no FAIL line, so the sweep counts a
   crashed suite as green. That has now happened four times in this repo. */
ok(!!plain && /no sign-in/i.test(plain.sub),
   plain ? `  the button says so on its face - "${plain.sub}"`
         : "  the button says so on its face - there is no such button");
/* Seller Hub stays. It is better WHEN it works, and the fix was to stop
   making it the only way through, not to delete it. */
ok(lanes.ids.indexOf("ebay") >= 0, "  Seller Hub keeps its place underneath");
/* indexOf on a missing id is -1, which is less than anything - so the
   first version of this line passed on a build with no plain lane at all.
   An assertion that cannot fail is worse than no assertion. */
ok(!!plain && lanes.ids.indexOf("ebaysold") >= 0
   && lanes.ids.indexOf("ebaysold") < lanes.ids.indexOf("ebay"),
   `  but the one that has never failed is listed first - ${lanes.ids.join(" then ")}`);

/* ------------------------------------------------------------------ */
console.log("\n  the card says which WatchCount rows to throw out");
const guide = await page.evaluate(() => {
  const x = calcItem();
  const h = step4Inner(x, false);
  return String(h).replace(/<[^>]+>/g," ").replace(/\s+/g," ");
});
ok(/ran for minutes/i.test(guide),
   "  it names the short listing - the $10,000 TCL that ran for 3.2 minutes");
ok(/different model/i.test(guide),
   "  and the wrong model - a 98-inch flagship is not the 55-inch on the counter");
ok(/middle of the rest/i.test(guide),
   "  then says take the middle of what is left");
/* A green tick here used to be worth nothing: an earlier version matched a
   bare word that appears all over the card. Both phrases above are
   specific to this guidance, and this line proves the card is the thing
   being read rather than the whole page. */
ok(/Sold, not asking/.test(guide), "  on the sold-comps card itself, not somewhere else on the page");

/* ------------------------------------------------------------------ */
console.log("\n  the hero gets out of the way while the keyboard is up");
/* THE SURFACE HE REPORTED IT ON. "especially on my phone" - and the phone
   is phone.html, where the hero is the FIRST thing on the page and the
   search box sits under it. On index.html at the same width the hero is in
   the right-hand rail, which stacks below the search box, so it is already
   eight hundred pixels down the page and was never in the way. That is
   measured below rather than assumed: the two surfaces drift, and a fix
   aimed at one of them has to say which. */
const measure = async (file) => {
  await page.goto(BASE + "/" + file, {waitUntil:"networkidle"});
  await page.waitForTimeout(900);
  return page.evaluate(async () => {
    const g = s => { const e = document.querySelector(s); if (!e) return null;
      const r = e.getBoundingClientRect(); return {y:Math.round(r.y), h:Math.round(r.height)}; };
    const inp = document.getElementById("omniIn");
    if (!g(".homeHero") || !inp) return null;
    const before = {hero:g(".homeHero"), box:g(".omniWrap")};
    inp.focus();
    inp.value = "tcl"; if (inp.oninput) inp.oninput({target:inp});
    await new Promise(r => setTimeout(r, 450));
    const after = {hero:g(".homeHero"), box:g(".omniWrap"), list:g("#omniList"),
      cls: document.body.classList.contains("searching"),
      focus: document.activeElement ? document.activeElement.id : "",
      rows: (document.getElementById("omniList")||{querySelectorAll:()=>[]}).querySelectorAll("[data-omni]").length};
    inp.blur();
    await new Promise(r => setTimeout(r, 300));
    after.clsOff = document.body.classList.contains("searching");
    after.heroBack = g(".homeHero");
    return {before, after};
  });
};

const ph = await measure("phone.html");
ok(!!ph, "  the phone screen has a hero and a search box to measure");
if (ph) {
  ok(ph.before.hero.h > 150 && ph.before.hero.y < 80,
     `  with nothing typed the hero is the top ${ph.before.hero.h}px of the screen`);
  ok(ph.before.box.y > 200,
     `  and pushes the search box down to y=${ph.before.box.y} - the keyboard then takes the bottom half`);
  ok(ph.after.cls, "  typing puts the searching class on the body");
  ok(ph.after.hero.h === 0, `  which folds the hero away - ${ph.before.hero.h}px to ${ph.after.hero.h}px`);
  ok(ph.after.box.y < 90, `  the box climbs to y=${ph.after.box.y}, from y=${ph.before.box.y}`);
  ok(ph.after.rows > 0 && ph.after.list.y < 160,
     `  and the matches start at y=${ph.after.list.y} instead of y=${ph.before.box.y + 66} - ${ph.after.rows} rows`);
  /* WHAT THE FIRST ATTEMPT GOT WRONG. The obvious fix is to drop the hero
     from the markup while the box has focus, and render() rebuilds the
     input - the focus goes, the keyboard shuts, and he is typing into a box
     that keeps closing. If this goes red the fix has gone back to
     re-rendering. */
  ok(ph.after.focus === "omniIn", `  the keyboard stays up - focus is still "${ph.after.focus}"`);
  ok(ph.after.clsOff === false && ph.after.heroBack.h > 150,
     `  and leaving the box brings the hero back - ${ph.after.heroBack.h}px`);
}

/* AND THE SAME WAY OUT ON THE PHONE. The two surfaces drift, and this one
   is wired through a document click listener in app.js while phone.js
   carries its own copies of several panels - so "phone.html loads app.js"
   is an argument, not a measurement. This is the measurement. */
const phEsc = await page.evaluate(async () => {
  const id = "e2";
  const c = CATALOG.find(x => x.items.some(i => i.id === id));
  st.flow="ask"; st.mode="item"; st.catId=c.id; st.itemId=id; st.picked=true;
  st.brandTyped="TCL"; st.brand="mid"; st.brandSet=true; st.model="Roku 55"; st.detail="";
  st.specSel={}; (SPEC_CHOICES[id]||[]).forEach((g,gi)=>{ st.specSel[id+":"+gi]=specBase(g); });
  st.condSet=true; st.completeSet=true; st.complete=true;
  st.market=null; st.mpPin=null; st.mpNone=true; st.worthNone=false; st.askEdit=false;
  const q0 = askQueue(calcItem());
  st.askAt = q0.findIndex(z => z.id === "worth"); render();
  await new Promise(r => setTimeout(r, 150));
  const b = document.getElementById("worthNone");
  if (!b) return {there:false};
  b.click();
  await new Promise(r => setTimeout(r, 180));
  const x = calcItem();
  return {there:true, fin: runFinished(x), checked: !!x.checked,
          open: askQueue(x).filter(z => !z.answered && !z.optional).map(z => z.id)};
});
ok(phEsc.there, "  the phone's price question carries the same button");
ok(phEsc.there && phEsc.open.length === 0 && phEsc.fin === true,
   "  and pressing it finishes the run there too");
ok(phEsc.there && phEsc.checked === false,
   "  still unchecked on the phone - the field screen buys outright, and a guess must not read as a sale");

const dk = await measure("index.html");
ok(!!dk, "  the desk screen has the same two elements");
/* The other surface, stated as a measurement rather than a shrug: the desk
   needed nothing here, and the reason is the layout, not the fix. */
if (dk) ok(dk.before.hero.y > dk.before.box.y,
   `  on the desk the hero is already below the box at phone width - hero y=${dk.before.hero.y}, box y=${dk.before.box.y} - so it was never on top of the list`);

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
