/* Every tab must draw its own screen, and no tab but "Walk away" may draw the
   walk-away list.

   This exists because of a one-line slip that shipped: a statement dropped
   between the last `else if` of the render chain and its `else` stole that
   else, so every screen that was not out of date drew the walk-away list
   instead of itself. Nothing then in the tests noticed - they read state, or
   read the header, and the header is rendered separately from the view.

   Run it with the site served locally:
     python3 -m http.server 8099 &
     node tools/check-screens.mjs
   Playwright is not a dependency of this repo - there is no build step and
   no package.json to put it in - so it is borrowed from the global install.
   Set PW_CHROME if the browser lives somewhere else. Exits non-zero on
   failure, so it can gate a push. */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Borrowed from wherever playwright happens to live: this repo has no build
   step and no package.json to depend on it from. PW_MODULE overrides. */
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) {
  try { ({chromium} = req(m)); break; } catch (e) {}
}
if (!chromium) {
  console.error("playwright not found - install it, or point PW_MODULE at it.");
  process.exit(2);
}

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
/* Loose on purpose: a phrase each screen cannot render without. */
const WANT = {
  /* "try stihl" was the desk's prose hint. The desk lists its worked
     examples as buttons now and the phone keeps the words, so the phrase
     moved rather than vanished - both spellings are accepted, and the
     press-it-and-it-works half is pinned separately below. */
  /* "start from one of these" was the worked-example chip row, taken out at
     the counter's request on 25 Sep. What is left on the front page is the
     search box, the camera card and the kinds laid out. */
  item:   /take a picture|photograph|camera|what it is|try stihl|pick the kind of thing it is/i,
  metal:  /gold|silver/i,
  device: /money changes hands/i,
  /* "flags" is no longer a screen - the counter did not want a tab for it -
     so the walk-away rules are checked where they now live, folded on
     Setup, further down this file. */
  setup:  /this copy of the tool/i,
};
const FLAGS_LINE = /answer is no/i;

const browser = await chromium.launch({executablePath: EXE});
let bad = 0;
for (const [page, viewport] of [["index.html", {width:1280,height:900}],
                                ["phone.html", {width:390,height:844}]]) {
  const p = await browser.newPage({viewport});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/" + page, {waitUntil:"networkidle"});
  for (const mode of Object.keys(WANT)) {
    const txt = await p.evaluate(m => { st.mode = m; render();
                                        return document.getElementById("view").innerText; }, mode);
    const drew   = WANT[mode].test(txt);
    /* Setup is where those rules live now, and they are folded shut, so
       innerText should not carry them there either until somebody opens it. */
    const leaked = FLAGS_LINE.test(txt);
    if (!drew || leaked) {
      bad++;
      console.log(`FAIL ${page} ${mode} — drew:${drew} walkAwayLeak:${leaked}`);
      console.log("     " + txt.replace(/\s+/g, " ").slice(0, 110));
    } else console.log(`ok   ${page} ${mode}`);
  }
  if (errs.length) { bad++; console.log(`FAIL ${page} — page errors: ${errs.join(" | ")}`); }

  /* Source comments on the counter's screen.
     A /* block written INSIDE a template literal is not a comment - it is
     text, and it renders. Two of them shipped to the live site sitting above
     the Setup card, explaining to the pawnbroker why a card had been removed.
     Every suite passed: nothing throws, no id repeats, the screen still
     draws. Only a person reading the page would notice, and by then it is
     on the counter. So: read what the screens actually SAY. */
  for (const on of [false, true]) {
    const stray = await p.evaluate((connected) => {
      if (connected) { try { pdSetServer("https://x.up.railway.app", "tok"); } catch (e) {} }
      const out = [];
      const tabs = [...document.querySelectorAll("#tabs [data-tab]")].map(b => b.dataset.tab);
      for (const t of tabs) {
        st.mode = t; render();
        const txt = document.getElementById("view").innerText;
        /* the opening of a block comment, or the line form at the start of
           a line - both are things a reader should never see */
        const m = txt.match(/\/\*[\s\S]{0,60}/) || txt.match(/^\s*\/\/ .{0,60}/m);
        if (m) out.push(t + ": " + m[0].replace(/\s+/g, " "));
      }
      return out;
    }, on);
    if (stray.length) { bad++; console.log(`FAIL ${page} ${on ? "connected" : "off"} — source comment on screen: ${stray.join(" | ")}`); }
    else console.log(`ok   ${page} no source comments on any tab (${on ? "connected" : "off"})`);
  }
  await p.close();
}
/* Cards get moved between columns, and a card emitted twice is not a visible
   fault - the page looks right and the handlers quietly wire to whichever
   copy the query found first, so a button stops working and nothing says
   why. Every id on the page must appear once. */
for (const [page, viewport] of [["index.html", {width:1400,height:900}],
                                ["phone.html", {width:390,height:844}]]) {
  const p = await browser.newPage({viewport});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/" + page, {waitUntil:"networkidle"});
  for (const cond of ["", "good"]) {
    const dup = await p.evaluate((c) => {
      const cat = CATALOG.find(x => x.items.some(i => i.id === "t1"));
      st.mode = "item"; st.catId = cat.id; st.itemId = "t1"; st.picked = true;
      if (c) st.cond = c;
      render();
      const seen = {}, out = [];
      document.querySelectorAll("[id]").forEach(e => { if (seen[e.id]) out.push(e.id); seen[e.id] = 1; });
      return out;
    }, cond);
    if (dup.length) { bad++; console.log(`FAIL ${page} cond=${cond||"unset"} — duplicate ids: ${dup.join(", ")}`); }
    else console.log(`ok   ${page} ids unique${cond ? " (priced)" : ""}`);
  }
  if (errs.length) { bad++; console.log(`FAIL ${page} — page errors: ${errs.join(" | ")}`); }

  /* Source comments on the counter's screen.
     A /* block written INSIDE a template literal is not a comment - it is
     text, and it renders. Two of them shipped to the live site sitting above
     the Setup card, explaining to the pawnbroker why a card had been removed.
     Every suite passed: nothing throws, no id repeats, the screen still
     draws. Only a person reading the page would notice, and by then it is
     on the counter. So: read what the screens actually SAY. */
  for (const on of [false, true]) {
    const stray = await p.evaluate((connected) => {
      if (connected) { try { pdSetServer("https://x.up.railway.app", "tok"); } catch (e) {} }
      const out = [];
      const tabs = [...document.querySelectorAll("#tabs [data-tab]")].map(b => b.dataset.tab);
      for (const t of tabs) {
        st.mode = t; render();
        const txt = document.getElementById("view").innerText;
        /* the opening of a block comment, or the line form at the start of
           a line - both are things a reader should never see */
        const m = txt.match(/\/\*[\s\S]{0,60}/) || txt.match(/^\s*\/\/ .{0,60}/m);
        if (m) out.push(t + ": " + m[0].replace(/\s+/g, " "));
      }
      return out;
    }, on);
    if (stray.length) { bad++; console.log(`FAIL ${page} ${on ? "connected" : "off"} — source comment on screen: ${stray.join(" | ")}`); }
    else console.log(`ok   ${page} no source comments on any tab (${on ? "connected" : "off"})`);
  }
  await p.close();
}

/* The update button must never loop.
   It used to clear the caches and reload and hope. When the site was still
   handing over the old copy the page came back on the same build with the
   same "you are out of date" banner, and pressing again did the same thing:
   a loop with no way out and no explanation. It checks what actually came
   back now, and says so when there is nothing new. */
console.log("");
{
  const p = await browser.newPage();
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await p.evaluate(async () => {
    const out = {};
    /* the site is serving exactly what this copy already is */
    const realFetch = window.fetch;
    window.fetch = async (u, o) => (String(u).includes("app.js")
      ? {ok:true, text: async () => 'const APP_BUILD="' + APP_BUILD + '";'}
      : realFetch(u, o));
    let said = null;
    await forceUpdate((m) => { said = m; });
    out.sameSaid = said;
    out.sameNavigated = location.search.includes("b=");
    /* unreachable */
    window.fetch = async () => { throw new Error("offline"); };
    said = null;
    await forceUpdate((m) => { said = m; });
    out.offlineSaid = said;
    window.fetch = realFetch;
    return out;
  });
  if (r.sameSaid && /still serving/.test(r.sameSaid)) console.log("ok   update button says so when there is nothing new");
  else { bad++; console.log("FAIL update button silent when nothing is new: " + r.sameSaid); }
  if (!r.sameNavigated) console.log("ok   and does not reload into the same build");
  else { bad++; console.log("FAIL update button reloaded into the same build"); }
  if (r.offlineSaid && /Could not reach/.test(r.offlineSaid)) console.log("ok   and says when it cannot reach the site");
  else { bad++; console.log("FAIL update button silent when offline: " + r.offlineSaid); }
  if (errs.length) { bad++; console.log("FAIL update button — page errors: " + errs.join(" | ")); }
  await p.close();
}

{
  const WIDTHS = [[2000, 1200], [1600, 1000], [1100, 900], [900, 1200]];
  let leaks = [];
  for (const [w, h] of WIDTHS) {
    const pg = await browser.newPage({viewport: {width: w, height: h}});
    await pg.goto(BASE + "/index.html", {waitUntil: "networkidle"});
    const hit = await pg.evaluate(() => {
      const out = [];
      for (const flow of ["ask", "pages", "all"]) {
        st.flow = flow; st.market = null; st.mpPin = null; st.mpNone = false;
        st.condSet = false; st.completeSet = false; st.specSel = {}; st.brandTyped = ""; st.brandQ = "";
        st.model = ""; st.bookName = ""; st.picked = false; st.askAt = 0;
        const R = omniRows("dewalt dcd791 drill") || {}, rows = R.rows || [];
        const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
        if (f) omniPick(f);
        render();
        const t = (document.getElementById("view") || {innerText: ""}).innerText;
        if (/Shelf prices/i.test(t)) out.push(flow);
      }
      return out;
    });
    hit.forEach(f => leaks.push(w + "px/" + f));
    await pg.close();
  }
  if (leaks.length) { bad++;
    console.log("FAIL shelf-tag record is on the pricing page at " + leaks.join(", ")); }
  else console.log("ok   the shelf-tag record stays off the pricing page, every width and flow");
}

/* NOTHING IN THE DIAL MAY TOUCH THE DIAL.
   The arc is r=130 with a 24px stroke in a 340 box, so the clear circle
   inside it is 236 wide - 69% of however big the dial is drawn. .gcenter
   was the full box, so a label or a sub-line longer than that simply ran
   across the stroke: "2 of 5 answered" laid over the arc on a phone,
   unreadable, on the one screen whose whole job is a single number.

   Measured against the real geometry at every size the dial appears at,
   because "it looks fine on mine" is exactly how it shipped. */
{
  const over = [];
  for (const [page, w, h, name] of [["phone.html",360,780,"small Android"],
                                    ["phone.html",390,844,"iPhone"],
                                    ["phone.html",412,915,"Pixel"],
                                    ["index.html",1440,900,"desk"],
                                    ["index.html",1100,800,"small desk"]]) {
    const pg = await browser.newPage({viewport: {width: w, height: h}});
    await pg.goto(BASE + "/" + page, {waitUntil: "networkidle"});
    const hit = await pg.evaluate(() => {
      const out = [];
      const R = omniRows("dewalt dcd791 drill") || {};
      const f = (R.rows || []).find(x => ["mp", "book", "item"].includes(x.kind));
      if (f) omniPick(f);
      st.cond = "good"; st.condSet = true; st.completeSet = true;
      for (let i = 0; i < 8; i++) {
        const q = askQueue(calcItem());
        const o = q.find(z => !z.answered && !z.optional);
        if (!o || !o.opts || !o.opts.length) break;
        const pick = o.opts[0], k = pick.set, v = String(pick.v);
        if (k === "brand") { st.brand = v; st.brandTyped = ""; st.brandQ = ""; st.brandSet = true; }
        else if (k === "comp") st.complete = v === "1";
        else if (k === "cond") { st.cond = v; st.condSet = true; st.completeSet = true; }
        else if (k === "spec") { const [gi, oi] = v.split(":"); st.specSel[st.itemId + ":" + gi] = Number(oi); }
        else break;
      }
      render();
      /* The states this app happens to reach today all have short labels,
         so walking them proved nothing - this check passed with the fix
         REMOVED. What broke was a long string in the middle of a ring, so
         that is what gets put there: the longest sub-line the app
         actually ships ("2 of 5 answered", and the metal screen's
         "14.2 g - 63% of melt"), plus one deliberately too long. If the
         constraint is gone these overflow; with it they wrap. */
      const probes = ["2 of 5 answered", "14.2 g \u00b7 63% of melt",
                      "nothing answered yet", "it will not clear $120"];
      document.querySelectorAll(".gwrap .gcenter .gs, .gwrap .gcenter .gl").forEach((el, i) => {
        el.textContent = probes[i % probes.length];
      });
      document.querySelectorAll(".gwrap").forEach(g => {
        const svg = g.querySelector("svg"); if (!svg) return;
        const box = svg.getBoundingClientRect();
        /* clear inner circle = (2*130 - 24) / 340 of the drawn width */
        const inner = box.width * (236 / 340);
        g.querySelectorAll(".gcenter > *").forEach(el => {
          const t = (el.innerText || "").trim(); if (!t) return;
          const w = el.getBoundingClientRect().width;
          if (w > inner + 1) out.push(`"${t.slice(0,22)}" ${Math.round(w)}px in a ${Math.round(inner)}px circle`);
        });
      });
      return out;
    });
    hit.forEach(t => over.push(name + ": " + t));
    await pg.close();
  }
  if (over.length) { bad++; console.log("FAIL text runs over the dial — " + over.join(" | ")); }
  else console.log("ok   nothing in the dial touches the dial, five sizes");
}

/* A WORKED EXAMPLE IS ONLY WORTH SHOWING IF PRESSING IT WORKS.
   The front page used to name four things you could type, as prose, under
   a search box - a list of instructions for retyping something by hand,
   with 600px of empty screen beneath it. The twelve kinds the desk carries
   are laid out instead of folded away, and that is only an improvement
   while the tiles still DO something - a tile that opens nothing looks
   exactly like a tile that works.
   The worked-example chips were taken out at the counter's request on 25
   Sep: a row of somebody else's items standing between the search box and
   the real lists, useful for a week and clutter after that. So this now
   also holds them GONE, because a row like that comes back easily. */
{
  const p = await browser.newPage({viewport: {width: 1440, height: 900}});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  const r = await p.evaluate(() => {
    const out = {};
    st.picked = false; st.omniDone = ""; render();
    const tiles = [...document.querySelectorAll(".kindTile[data-cat]")];
    out.chips = document.querySelectorAll("[data-try]").length;
    out.tiles = tiles.length;
    out.kinds = CATALOG.length;
    /* the tiles are the way in that is left, so they have to work */
    if (tiles.length) {
      tiles[0].click();
      out.landed = st.catId === tiles[0].dataset.cat && !!st.picked;
    }
    return out;
  });
  const ok = r.chips === 0 && r.tiles === r.kinds && r.landed;
  if (!ok) { bad++; console.log(`FAIL front page ways in — worked-example chips:${r.chips} (want 0) tiles:${r.tiles}/${r.kinds} tileOpens:${r.landed}`); }
  else console.log(`ok   no worked-example chips, ${r.tiles} kinds laid out and each one opens`);
  if (errs.length) { bad++; console.log("FAIL front page — page errors: " + errs.join(" | ")); }
  await p.close();
}

/* THE PAGE ITSELF MUST NOT SCROLL ON A DESK SCREEN.
   The directive's section 7 has always said so, and the shell that did it
   was taken out once already, with the reason written into app.css: too
   much content to fit. The content that would not fit - the market card,
   the camera, the shelf-tag recorder, the deal log - is gone from the run
   now, so the shell is back. Nothing but a measurement stops it drifting
   out again a card at a time. */
{
  const over = [];
  for (const [w, h] of [[1440,900],[1600,1000],[2000,1200],[1100,800]]) {
    const pg = await browser.newPage({viewport: {width: w, height: h}});
    await pg.goto(BASE + "/index.html", {waitUntil: "networkidle"});
    const hit = await pg.evaluate(() => {
      const out = [];
      for (const state of ["start", "picked", "priced"]) {
        st.flow = "ask"; st.market = null; st.mpPin = null; st.mpNone = false;
        st.condSet = false; st.completeSet = false; st.specSel = {}; st.brandTyped = ""; st.brandQ = "";
        st.model = ""; st.bookName = ""; st.picked = false; st.askAt = 0; st.cond = "";
        if (state !== "start") {
          const R = omniRows("dewalt dcd791 drill") || {}, rows = R.rows || [];
          const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
          if (f) omniPick(f);
        }
        if (state === "priced") { st.cond = "good"; st.condSet = true; st.completeSet = true; }
        render();
        const d = document.documentElement;
        const down = d.scrollHeight - window.innerHeight;
        const across = d.scrollWidth - window.innerWidth;
        if (down > 4 || across > 4) out.push(state + " +" + down + "px down +" + across + "px across");
      }
      return out;
    });
    hit.forEach(s => over.push(w + "x" + h + " " + s));
    await pg.close();
  }
  if (over.length) { bad++; console.log("FAIL the page scrolls: " + over.join(" | ")); }
  else console.log("ok   the page itself never scrolls, four desk sizes x three states");
}

/* The phone gets the same measurement, at the size it is actually held.
   Its start screen was 921px on an 844px phone - a 535px setup card first,
   with the search box that still works underneath it, off the bottom. The
   card says the same thing in a line now. Four phone sizes, because a
   smaller one is the one that hurts. */
{
  const over = [];
  for (const [w, h, name] of [[390,844,"iPhone"],[360,780,"small Android"],[430,932,"Max"],[412,915,"Pixel"]]) {
    const pg = await browser.newPage({viewport: {width: w, height: h}});
    await pg.goto(BASE + "/phone.html", {waitUntil: "networkidle"});
    const hit = await pg.evaluate(() => {
      const out = [];
      for (const state of ["start", "simple", "detail", "priced"]) {
        st.flow = "ask"; st.market = null; st.condSet = false; st.completeSet = false; st.specSel = {};
        st.brandTyped = ""; st.brandQ = ""; st.model = ""; st.bookName = "";
        st.picked = false; st.askAt = 0; st.cond = "";
        if (state !== "start") {
          const R = omniRows(state === "simple" ? "hammer" : "dewalt dcd791 drill") || {};
          const f = (R.rows || []).find(x => ["mp", "book", "item"].includes(x.kind));
          if (f) omniPick(f);
        }
        if (state === "priced") { st.cond = "good"; st.condSet = true; st.completeSet = true; }
        render();
        const d = document.documentElement;
        const down = d.scrollHeight - window.innerHeight;
        const across = d.scrollWidth - window.innerWidth;
        if (down > 4 || across > 4) out.push(state + " +" + down + "px down +" + across + "px across");
      }
      return out;
    });
    hit.forEach(s => over.push(name + " " + w + "x" + h + " " + s));
    await pg.close();
  }
  if (over.length) { bad++; console.log("FAIL the phone scrolls: " + over.join(" | ")); }
  else console.log("ok   the phone fits its own screen, four phone sizes x four states");
}

/* CAN THE DESK REACH ITS OWN BOTTOM CARD?
   .dash is height:100dvh with overflow:hidden, so anything taller than the
   window is clipped unless something between it and .dash scrolls. Two
   things had quietly stopped doing that:

   .colQ carried overflow:auto and min-height:0 and STILL could not scroll,
   because #view.item sets align-items:start - a start-aligned grid item is
   sized to its content, so the column grew straight past its minmax(0,1fr)
   row instead of being held to it. Its overflow never had anything to do.

   And every mode that is not the bento - setup, the deal log, devices,
   walk-away - was a plain block at overflow:visible. Setup put 1200px of
   cards in an 800px window and the last two simply ended at the fold.

   Neither had a scrollbar, a wheel or a keyboard route. This drives a REAL
   wheel, because programmatic scrollTop succeeds on an overflow:hidden
   element and would have called both of these passing. */
{
  const MODES = [
    ["setup",      () => { st.mode = "setup"; render(); }],
    ["deal log",   () => { st.mode = "log"; render(); }],
    ["devices",    () => { st.mode = "devices"; render(); }],
    ["gold",       () => { st.mode = "metal"; st.metalKind = "jewelry"; render(); }],
    ["start",      () => { st.mode = "item"; st.picked = false; render(); }],
    ["item priced",() => { st.mode = "item"; st.catId = "elec"; st.itemId = "e1";
                           st.picked = true;
                           st.market = {kind:"hand", key:mkKey(), mid:125}; render(); }],
  ];
  const stuck = [];
  for (const h of [800, 720]) {
    for (const [name, fn] of MODES) {
      const pg = await browser.newPage({viewport:{width:1920, height:h}});
      await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
      await pg.evaluate("(" + fn.toString() + ")()").catch(() => {});
      await pg.mouse.move(700, Math.round(h * 0.6));
      await pg.mouse.wheel(0, 2000);
      await pg.waitForTimeout(250);
      const r = await pg.evaluate(() => {
        /* A card inside a closed <details> is not on the screen, and
           Chromium's skipped layout hands back STALE geometry for it - a
           rect from a position the card does not occupy. Measuring those
           reported Setup as unscrollable when it scrolls perfectly. */
        const c = [...document.querySelectorAll("#view .card, #view .stepCard")]
          .filter(e => !e.closest("details:not([open])") && e.offsetParent !== null);
        if (!c.length) return {n:0, lastBottom:0, vh:innerHeight};
        return {n:c.length,
                lastBottom: Math.round(c[c.length - 1].getBoundingClientRect().bottom),
                vh: innerHeight};
      });
      if (r.n && r.lastBottom > r.vh + 2)
        stuck.push(`${name} ${1920}x${h}: last card ends at ${r.lastBottom}, window is ${r.vh}`);
      await pg.close();
    }
  }
  if (stuck.length) { bad++; console.log("FAIL the desk cannot reach its own bottom card: " + stuck.join(" | ")); }
  else console.log("ok   every desk screen scrolls to its last card, real wheel, two window heights");

  /* REPORTED FROM THE COUNTER: "the gold/silver page does not scroll like
     it's supposed to." It does not, at any desk width, and the sweep above
     missed it twice over - it drove one wheel in the middle of the screen,
     which on a three-column page only reaches the MIDDLE column, and it
     rendered gold with no weight typed in, which is two cards shorter than
     the page a counter is actually looking at.
     So: weigh something, then wheel over each column in turn. */
  {
    const bad2 = [];
    for (const [w, h] of [[1440, 900], [1280, 780], [1100, 820]]) {
      const pg = await browser.newPage({viewport:{width:w, height:h}});
      await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
      await pg.evaluate(() => { st.mode = "metal"; st.metal = "gold"; st.grams = "12.4"; render(); });
      for (const col of ["colL", "colC", "colR"]) {
        const box = await pg.evaluate((c) => {
          const e = document.querySelector("#view ." + c); if (!e) return null;
          const r = e.getBoundingClientRect();
          return {x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height * 0.6)};
        }, col);
        if (!box) { bad2.push(`${w}x${h}: no .${col}`); continue; }
        await pg.mouse.move(box.x, box.y);
        await pg.mouse.wheel(0, 3000);
        await pg.waitForTimeout(200);
        const r = await pg.evaluate((c) => {
          const e = document.querySelector("#view ." + c);
          const cards = [...e.querySelectorAll(".card")];
          return {n: cards.length, moved: e.scrollTop,
                  over: e.scrollHeight - Math.round(e.getBoundingClientRect().height),
                  reach: cards.length ? Math.round(cards[cards.length - 1].getBoundingClientRect().bottom) : 0,
                  vh: innerHeight};
        }, col);
        if (r.n && r.reach > r.vh + 2)
          bad2.push(`${w}x${h} .${col}: last card ends at ${r.reach}, window is ${r.vh}, wheel moved ${r.moved} of ${r.over}`);
      }
      await pg.close();
    }
    if (bad2.length) { bad++; console.log("FAIL the gold page cannot reach its own bottom card: " + bad2.join(" | ")); }
    else console.log("ok   gold with a weight on the scale scrolls every column, real wheel, three desk sizes");
  }
}

/* AND THE RAIL, WHICH THE CHECK ABOVE CANNOT SEE.
   That one measures the last .card, and every card it finds lives in the
   question column - so the rail ran off the bottom of the window and the
   test said all screens were fine. "What that number is made of" is
   twenty-one thumbnails of the sales the price was built from: the
   evidence for the number was the part you could not reach.
   The rail is sticky and start-aligned, so without a height bound it just
   grows and .dash{overflow:hidden} eats the remainder. A probe that
   cannot shrink is the only honest way to test it - a plain tall child
   gets squashed by the flex column and the check passes for the wrong
   reason, which is how the first version of this fooled me. */
{
  const bust = [];
  for (const h of [900, 800]) {
    const pg = await browser.newPage({viewport:{width:1920, height:h}});
    await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
    await pg.evaluate(() => {
      st.mode = "item"; st.catId = "tools"; st.itemId = "t1"; st.picked = true;
      st.market = {kind:"hand", key:mkKey(), mid:100}; render();
      const rail = document.querySelector(".rail");
      const d = document.createElement("div");
      d.style.cssText = "height:900px;flex:0 0 auto";
      d.className = "card"; d.id = "tallProbe";
      rail.appendChild(d);
    });
    await pg.mouse.move(1700, Math.round(h * 0.6));
    await pg.mouse.wheel(0, 1200);
    await pg.waitForTimeout(250);
    const r = await pg.evaluate(() => {
      const rail = document.querySelector(".rail");
      const b = rail.getBoundingClientRect();
      return {clipped: Math.round(b.bottom) > innerHeight + 2,
              scrolled: Math.round(rail.scrollTop),
              canScroll: rail.scrollHeight > rail.clientHeight + 2,
              bottom: Math.round(b.bottom), vh: innerHeight};
    });
    if (r.clipped) bust.push(`1920x${h}: rail ends at ${r.bottom}, window is ${r.vh}`);
    else if (!r.canScroll) bust.push(`1920x${h}: rail fits but cannot scroll its overflow`);
    else if (r.scrolled < 5) bust.push(`1920x${h}: rail ignores the wheel (scrollTop ${r.scrolled})`);
    await pg.close();
  }
  if (bust.length) { bad++; console.log("FAIL the rail runs off the window: " + bust.join(" | ")); }
  else console.log("ok   the rail stays in the window and scrolls its own overflow");
}

/* THE ANSWER SHOULD NOT BE THE FOURTH SCREEN.
   On the desk the gold page is three columns and the offer sits beside the
   scale. On a phone they stack, and reading the desk's columns top to
   bottom put the offer at 2554px of a 3657px page - past the fold three
   times - with the 908px spotting-fakes checklist wedged between the scale
   and the number. "the offer for gold is so far down and the steps for
   determining fakes sit right in the middle of the offer workflow."
   The phone gets its own order: weigh it, see the number, then tune and
   read. The spot price and the 90-day average are filled by the morning
   feed - reference, not questions - so they drop below the answer.
   The exception is a sheet that GATES: bullion holds the price until every
   check is answered, so there its checklist belongs above the offer and
   scrolling it IS the workflow. */
{
  const gold = [];
  const pg = await browser.newPage({viewport:{width:390, height:844}, isMobile:true, hasTouch:true});
  await pg.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const order = async (kind) => pg.evaluate((k) => {
    st.mode = "metal"; st.metalKind = k; st.grams = "12.4"; render();
    return [...document.querySelectorAll("#view .card")].map(c => ({
      label: String((c.querySelector(".label") || {}).textContent || c.id || "").trim(),
      top: Math.round(c.getBoundingClientRect().top + scrollY)}));
  }, kind);

  const j = await order("jewelry");
  const find = (rows, re) => rows.find(r => re.test(r.label));
  /* WHICH METAL IS THE FIRST QUESTION.
     Gold and silver are different jobs - different price, purity, fakes
     and spec table - and the choice used to sit underneath "is he selling
     it" as though it were a detail of that. */
  if (!/Gold or silver/i.test((j[0] || {}).label || ""))
    gold.push(`the first card is "${(j[0]||{}).label}", not the metal`);
  const offer = find(j, /The offer|The loan/), fakes = find(j, /Spotting fakes/),
        weight = find(j, /Weight in grams/);
  if (!offer || !fakes || !weight) { bad++; console.log("FAIL gold phone: cards missing — " + j.map(r=>r.label).join(" | ")); }
  else {
    if (offer.top > 844) gold.push(`offer starts at ${offer.top}px, below the first screen`);
    if (fakes.top < offer.top) gold.push(`the fakes checklist (${fakes.top}px) still sits above the offer (${offer.top}px) on an advising sheet`);
    if (offer.top < weight.top) gold.push(`the offer comes before the scale`);
    /* the numbers must still read 1,2,3 DOWN the page */
    const nums = j.map(r => (r.label.match(/^(\d+)\s/) || [])[1]).filter(Boolean).map(Number);
    for (let i = 1; i < nums.length; i++)
      if (nums[i] < nums[i-1]) { gold.push(`step numbers run ${nums.join(",")} down the page`); break; }
  }

  /* AND THE SPEC TABLE IS ABOUT THAT METAL ONLY. */
  const groups = await pg.evaluate(() => {
    const out = {};
    for (const mt of ["gold", "silver"]) {
      st.mode = "metal"; st.metal = mt; st.metalKind = "bullion"; st.grams = "31.1"; render();
      const sel = document.querySelector("#view select");
      out[mt] = sel ? [...sel.querySelectorAll("optgroup")].map(g => g.label) : [];
    }
    return out;
  });
  if (groups.gold.some(g => /silver/i.test(g)))
    gold.push(`a gold job still lists ${groups.gold.filter(g=>/silver/i.test(g)).join(" and ")} in the spec table`);
  if (!groups.silver.some(g => /silver/i.test(g)))
    gold.push(`a silver job lost its own spec groups — ${groups.silver.join(", ")}`);

  const bl = await order("bullion");
  const bOffer = find(bl, /The offer|The loan/), bFakes = find(bl, /Spotting fakes/);
  if (bOffer && bFakes && bFakes.top > bOffer.top)
    gold.push(`bullion GATES the price but its checklist (${bFakes.top}px) is below the offer (${bOffer.top}px)`);

  await pg.close();

/* THE COUNTER HAD TO ASK WHAT HIS OWN CARD MEANT.
     "What does loupe the stamp mean". It is the jeweller's word for a
     magnifier and five checks used it as a VERB - loupe the dial, loupe
     the band, loupe the date - which is the tool talking to a jeweller
     rather than to the man holding the chain. Plain words, with the word
     itself kept once in brackets so it is taught rather than required.

     And the jewelry check had the law backwards in the way that costs
     money. It said "US law requires both, so a missing one is a warning
     sign", which reads as: unstamped means suspicious. Unstamped is
     normal - old pieces, imports and repairs carry no marks at all and
     the Act does not require any. What it requires is that a quality
     mark be accompanied by the maker's registered trademark, so the
     warning sign is a piece stamped 14K with NO maker's mark: that one is
     misbranded under federal law. As written the card would have had him
     suspicious of an ordinary estate ring and relaxed about the one
     somebody stamped themselves. */
  {
    const fakes = JSON.parse(readFileSync(join(ROOT, "fakes.json"), "utf8"));
    const all = fakes.sheets.flatMap(sh =>
      [...(sh.steps || []), ...(sh.checks || [])].map(t => [sh.id, t]));

    const verb = all.filter(([, t]) => /\b(loupe|loupes)\s+(the|it|a)\b/i.test(t));
    if (verb.length)
      gold.push(`"loupe" is still a verb in ${verb.length} check(s): ${verb.map(v=>v[0]).join(", ")}`);

    const jw = all.find(([id, t]) => id === "jewelry" && /quality mark/i.test(t));
    if (!jw) gold.push("the jewelry stamp check lost its quality-mark wording");
    else {
      if (/US law requires both/i.test(jw[1]))
        gold.push("the jewelry check still says US law requires both marks");
      if (!/no marks at all is a different thing|common on older pieces/i.test(jw[1]))
        gold.push("the jewelry check no longer says an unstamped piece is normal");
      if (!/misbranded/i.test(jw[1]))
        gold.push("the jewelry check no longer names what is actually wrong (misbranded)");
    }
    if (/jeweller|colour/i.test(JSON.stringify(fakes)))
      gold.push("British spelling crept into fakes.json");
  }

  if (gold.length) { bad++; console.log("FAIL the gold page on a phone: " + gold.join(" | ")); }
  else console.log("ok   gold on a phone: weigh it, then the offer, checklist out of the middle (and above it when it gates)");
}

/* WHAT COMES BACK BELONGS BESIDE WHAT GOES OUT.
   Its own page, at desk width: there is no rail on a phone, and the gold
   block's page is 390 wide - which is how the first version of this threw
   on a null rail rather than failing honestly. */
console.log("\n  the rail says what he pays back, not just what he gets");
{
  const pay_bad = [];
  const dk = await browser.newPage({viewport:{width:1920, height:1000}});
  await dk.goto(BASE + "/index.html", {waitUntil:"networkidle"});
    /* WHAT COMES BACK BELONGS BESIDE WHAT GOES OUT.
     The money out the door was on the rail; the money coming back was
     folded shut in step 8, three cards down the middle column. Those are
     two halves of one sentence, and the customer asks the second half out
     loud - "so what do I owe you" - while you are still holding the first.
     Day 30 is the figure the deal turns on, so it is the one that is lit. */
    const pay = await dk.evaluate(() => {
      st.mode = "item"; st.catId = "tools"; st.itemId = "t1"; st.picked = true;
      st.brandSet = true; st.brand = "hi"; st.model = "DCD791";
      st.condSet = true; st.completeSet = true; st.cond = "good"; st.complete = true;
      st.market = {kind:"found", key:mkKey(), mid:120, lo:100, hi:150,
                   n:21, sold:21, basis:"sold", comps:[]};
      (SPEC_CHOICES[st.itemId] || []).forEach((g, gi) => {
        st.specSel[st.itemId + ":" + gi] = specBase(g); });
      /* Stand at the end of the run, which is the moment this block is
         about - the offer is made, and the question the customer asks out
         loud is "so what do I owe you". The answer card only takes over the
         LAST card, so the run has to actually be standing on it. */
      st.askEdit = false; st.askAt = askQueue(calcItem()).length - 1;
      render();
      const rail = document.querySelector(".rail");
      const back = rail && rail.querySelector(".railBack");
      const cells = back ? [...back.querySelectorAll(".rbCell")] : [];
      const lit = back ? back.querySelector(".rbCell.now") : null;
      const x = calcItem();
      return {inRail: !!back,
              cells: cells.length,
              amounts: cells.map(c => (c.querySelector(".d") || {}).textContent),
              litIsFirst: !!(lit && cells[0] === lit),
              litSize: lit ? parseFloat(getComputedStyle(lit.querySelector(".d")).fontSize) : 0,
              plainSize: cells[1] ? parseFloat(getComputedStyle(cells[1].querySelector(".d")).fontSize) : 0,
              answerSize: (() => { const a = document.querySelector("#askCard .adCell .d");
                return a ? parseFloat(getComputedStyle(a).fontSize) : 0; })(),
              forfeit: !!(back && /day 60 it is/i.test(back.textContent)),
              target: x.target, charge: x.charge,
              /* a stray comment rendering as text is a real failure mode here */
              leaked: !!(back && /\/\*|\*\//.test(back.textContent))};
    });
    if (!pay.inRail) pay_bad.push("the rail carries no repayment block");
    else {
      if (pay.cells !== 3) pay_bad.push(`the repayment ladder has ${pay.cells} rungs, expected 3`);
      if (!pay.litIsFirst) pay_bad.push("day 30 is not the lit rung");
      if (!(pay.litSize > pay.plainSize)) pay_bad.push(
        `day 30 (${pay.litSize}px) is not larger than the others (${pay.plainSize}px)`);
      /* There is no hero in the rail any more - it was a second copy of the
         answer card beside it and came out at the counter's request - so the
         day-30 rung is now the largest number the rail carries, and what it
         must not do is shout louder than the answer card itself. */
      if (!(pay.answerSize > pay.litSize)) pay_bad.push(
        `the rail's repayment (${pay.litSize}px) competes with the answer card (${pay.answerSize}px)`);
      if (!pay.forfeit) pay_bad.push("the day-60 forfeit line is not on the card");
      if (pay.leaked) pay_bad.push("a source comment is rendering as text inside the repayment block");
      /* the arithmetic on the card must be the arithmetic in the book */
      const want = ["$" + (pay.target + pay.charge), "$" + (pay.target + pay.charge * 2)];
      const got = pay.amounts.slice(0, 2).map(a => String(a).replace(/[,\s]/g, ""));
      if (got[0] !== want[0] || got[1] !== want[1])
        pay_bad.push(`the ladder does not match ladder(): showed ${got.join(", ")}, expected ${want.join(", ")}`);
    }
  await dk.close();
  if (pay_bad.length) { bad++; console.log("FAIL the repayment on the rail: " + pay_bad.join(" | ")); }
  else console.log("ok   the rail carries the repayment ladder, day 30 lit, forfeit date on the card");
}

/* REPORTED FROM THE COUNTER: "I don't need the separate walk away section,
   and the small left side bar has wasted space." Both are the same panel:
   five buttons in a column drawn 900px tall because grid-row:1/-1 stretches
   it, and a sixth button nobody opens. The tab goes, the panel hugs what is
   left - and the law that was on that page has to still be reachable, or
   this is a deletion wearing a tidy-up's clothes. */
{
  const dk = await browser.newPage({viewport:{width:1440, height:900}});
  await dk.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await dk.evaluate(() => {
    const d = document.getElementById("tabs");
    const bs = [...d.querySelectorAll("button")];
    const last = bs[bs.length - 1].getBoundingClientRect(), box = d.getBoundingClientRect();
    st.mode = "setup"; render();
    const view = document.getElementById("view");
    return {tabs: bs.map(b => b.textContent.trim()),
            slack: Math.round(box.bottom - last.bottom), dockH: Math.round(box.height), vh: innerHeight,
            fold: !!document.getElementById("rulesFold"),
            rules: view.textContent,
            flagsGone: typeof renderFlags === "undefined"};
  });
  const miss = [];
  if (r.tabs.some(t => /walk/i.test(t))) miss.push("the walk-away tab is still on the rail");
  if (r.slack > 24) miss.push(`${r.slack}px of empty panel below the last button`);
  if (!r.fold) miss.push("Setup has no rules fold");
  /* every part of that page, by the bit of it that would hurt to lose */
  for (const [what, re] of [["the red flags", /stolen/i],
                            ["what we don't take", /whatever the price/i],
                            ["the reporting deadline", /end of the next business day/i],
                            ["the hold-order clock", /certified letter/i]])
    if (!re.test(r.rules)) miss.push("Setup lost " + what);
  if (miss.length) { bad++; console.log("FAIL the navigation rail: " + miss.join(" | ")); }
  else console.log(`ok   ${r.tabs.length} tabs, ${r.dockH}px of dock in a ${r.vh}px window, and the walk-away rules kept on Setup`);
  await dk.close();
}

await browser.close();
console.log(bad ? `FAILED (${bad})` : "all screens draw themselves, every id once");
process.exit(bad ? 1 : 0);
/* THE SHELF-TAG RECORD IS NOT PART OF PRICING AN ITEM.
   It is a record of what OTHER shops ask, kept for later, and it was
   reaching the pricing page by TWO paths - once at the foot of the
   question column, once at the foot of the browse box on any screen
   without a rail. The first cut closed one of them and I reported it
   done. Every width and every flow is checked here, because "I removed
   it" was true and wrong at the same time. */
