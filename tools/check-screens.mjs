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
console.log("\n  the rail says what it costs him to get it back, not just what he gets");
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
      const rows = back ? [...back.querySelectorAll(".dRow")] : [];
      const x = calcItem();
      const txt = n => (n.querySelector("span") || {}).textContent || "";
      const amt = n => (n.querySelector("b") || {}).textContent || "";
      const tot = rows.filter(r => r.classList.contains("tot"));
      return {inRail: !!back,
              rows: rows.length,
              labels: rows.map(txt),
              amounts: rows.map(amt),
              totAmounts: tot.map(amt),
              /* THE ORIGINAL COMPLAINT, AS AN ASSERTION. "It appears that
                 this should be selectable but its not." Nothing in this
                 panel may be a button or carry the chosen-pill treatment,
                 because nothing in it is a choice. */
              pressable: rows.some(r => r.tagName === "BUTTON" || r.querySelector("button")
                                     || r.hasAttribute("data-ideal")),
              litSize: tot[0] ? parseFloat(getComputedStyle(tot[0].querySelector("b")).fontSize) : 0,
              plainSize: rows[0] ? parseFloat(getComputedStyle(rows[0].querySelector("b")).fontSize) : 0,
              /* and the tiles that ARE the choice must really be buttons */
              tilesArePressable: [...document.querySelectorAll(".adDeal")]
                .every(b => b.tagName === "BUTTON" && b.hasAttribute("data-ideal")),
              pawnChosen: !!document.querySelector('.adDeal.lend.on'),
              /* THE UNCHOSEN TILE STILL HAS TO BE READABLE.
                 The first cut told the states apart with opacity .52 and
                 saturate .55, which made the unchosen $130 dark blue ink
                 on a mid-blue fill. check-contrast reads the CSS tokens,
                 so it saw nothing wrong - the damage happens between the
                 token and the glass. This measures what is actually
                 painted, in both states, which is the only way to catch
                 it. */
              tileInk: (() => {
                const lum = c => { const [r,g,b] = c.match(/[\d.]+/g).map(Number)
                    .slice(0,3).map(v => { v/=255; return v<=.03928 ? v/12.92
                      : Math.pow((v+.055)/1.055, 2.4); });
                  return .2126*r + .7152*g + .0722*b; };
                /* walk up for the first opaque backdrop, then fold in every
                   opacity between here and there */
                const paint = el => { let o = 1, n = el;
                  while (n && n !== document.documentElement) {
                    o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
                  let bg = "rgb(11,13,19)", m = el;
                  while (m) { const c = getComputedStyle(m).backgroundColor;
                    if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) { bg = c; break; }
                    m = m.parentElement; }
                  const fg = getComputedStyle(el).color;
                  const L1 = lum(fg)*o + lum(bg)*(1-o), L2 = lum(bg);
                  const hi = Math.max(L1,L2), lo = Math.min(L1,L2);
                  return Math.round(((hi+.05)/(lo+.05))*100)/100; };
                return [...document.querySelectorAll(".adDeal")].map(t => ({
                  deal: t.dataset.ideal, on: t.classList.contains("on"),
                  /* AND THE MECHANISM ITSELF, not only its result. The
                     composite ratio below stays healthy for white ink on a
                     dark well even at .52 opacity, so it would NOT have
                     caught the original defect, which was dark on-accent
                     ink on an accent fill, faded. Forbidding the fade
                     outright is the assertion that actually holds: these
                     tiles are told apart by which one carries the colour,
                     never by making one of them dim. */
                  faded: getComputedStyle(t).opacity !== "1"
                      || getComputedStyle(t).filter !== "none",
                  ratio: paint(t.querySelector(".d")) })); })(),
              /* The answer card's two decisions - buy and pawn loan - are the
                 biggest numbers on the screen by the counter's own request,
                 so the rail's day-30 rung has to sit under them. */
              answerSize: (() => { const a = document.querySelector("#askCard .adDeal .d");
                return a ? parseFloat(getComputedStyle(a).fontSize) : 0; })(),
              forfeitAnywhere: (() => {
                document.querySelectorAll("details").forEach(d => d.open = true);
                return /day 60 it['’]?s ours|day 60 it is/i.test(document.body.innerText);
              })(),
              target: x.target, charge: x.charge,
              /* a stray comment rendering as text is a real failure mode here */
              leaked: !!(back && /\/\*|\*\//.test(back.textContent))};
    });
    if (!pay.inRail) pay_bad.push("the rail carries no repayment block");
    else {
      /* FOUR ROWS, NOT THREE RUNGS. The ladder this replaced said BY DAY
         30 / DAY 31-60 / DAY 90, and "DAY 31-60 $158" never said whether
         $158 was the whole thing or the second month's part - which is the
         same ambiguity that got $131 read as interest. Asked for directly
         from the counter: the interest for a month, the total at one
         month, the total at two. Day 90 came out; the ticket is dead at
         day 60 and a figure past it is arithmetic nobody can collect. */
      if (pay.rows !== 4) pay_bad.push(`the pawn panel has ${pay.rows} rows, expected 4`);
      if (pay.totAmounts.length !== 2) pay_bad.push(
        `${pay.totAmounts.length} totals, expected 2 - one month and two`);
      if (!/interest/i.test(pay.labels.join(" "))) pay_bad.push(
        "the panel never names the interest on its own");
      if (!pay.labels.some(l => /1 month/i.test(l)) || !pay.labels.some(l => /2 months/i.test(l)))
        pay_bad.push("the two totals are not labelled by month: " + pay.labels.join(" / "));
      if (/pays back/i.test(pay.labels.join(" "))) pay_bad.push(
        "'pays back' is the phrase that got read as interest at the counter");
      if (pay.pressable) pay_bad.push(
        "a row in the panel is pressable - that is the thing that was reported");
      if (!pay.tilesArePressable) pay_bad.push(
        "the buy/pawn tiles are not real buttons, so the choice is still fake");
      if (!pay.pawnChosen) pay_bad.push("no deal is shown as chosen");
      for (const t of pay.tileInk || []) {
        if (t.faded) pay_bad.push(
          `the ${t.deal} tile is dimmed when ${t.on ? "chosen" : "not chosen"} - tell the states apart by fill, not by fading the money`);
        if (!(t.ratio >= 4.5)) pay_bad.push(
          `the ${t.deal} tile's figure is ${t.ratio}:1 when ${t.on ? "chosen" : "not chosen"} - needs 4.5`);
      }
      if (!(pay.litSize > pay.plainSize)) pay_bad.push(
        `the totals (${pay.litSize}px) are not larger than the parts (${pay.plainSize}px)`);
      /* There is no hero in the rail any more - it was a second copy of the
         answer card beside it and came out at the counter's request - so the
         day-30 rung is now the largest number the rail carries, and what it
         must not do is shout louder than the answer card itself. */
      if (!(pay.answerSize > pay.litSize)) pay_bad.push(
        `the rail's repayment (${pay.litSize}px) competes with the answer card (${pay.answerSize}px)`);
      /* The day-60 line came off the rail at the counter's request - statute
         background, not a figure. The rule it stood for is that the counter
         can still find out the item is forfeit on day 60, and that holds:
         the payback fold says it in full ("no notice, no letter, no
         auction") and step 8 is named for it. Verified on the rendered page
         with every fold open before this was repointed, because deleting a
         guard on an unchecked assumption is how the fact goes missing.
         Asserted where it now lives rather than where it used to. */
      if (!pay.forfeitAnywhere) pay_bad.push("day-60 forfeit is not stated anywhere the counter can reach");
      if (pay.leaked) pay_bad.push("a source comment is rendering as text inside the repayment block");
      /* the arithmetic on the card must be the arithmetic in the book */
      const want = ["$" + (pay.target + pay.charge), "$" + (pay.target + pay.charge * 2)];
      const got = pay.totAmounts.map(a => String(a).replace(/[,\s]/g, ""));
      if (got[0] !== want[0] || got[1] !== want[1])
        pay_bad.push(`the totals are wrong: showed ${got.join(", ")}, expected ${want.join(", ")}`);
    }
  await dk.close();
  if (pay_bad.length) { bad++; console.log("FAIL the repayment on the rail: " + pay_bad.join(" | ")); }
  else console.log("ok   the rail shows the chosen deal - interest, one month, two months - and nothing in it pretends to be a control");
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

/* MY NAME FOR THE TOOL IS NOT ANYBODY ELSE'S.
   Asked at the counter, plainly: "what is 'the desk'?" It is what I have
   called this thing to myself since the first commit, and it had leaked
   into seventeen strings the counter actually reads - "the desk has no
   measured price for", "the desk will not look this one up", "the desk
   fills in its resale value". A tool that refers to itself by a name
   nobody taught you is asking you to learn its vocabulary before it will
   answer your question.
   It has no name on screen now. Where a subject was needed the sentence
   was turned around instead. This keeps it out. */
/* AND ON THE PHONE, WHICH IS ITS OWN FILE AND ITS OWN COPY OF EVERY PANEL.
   This check passed while the phone's rail still read "Desk price list /
   eBay, as of Sep 24" - because it only ever loaded index.html. Three
   surfaces say where a price came from: the desk's rail, the price card,
   and phone.js's own rail. I fixed them one at a time across three
   reports, and each time the fix looked complete because the test only
   watched the surface I had just touched. It watches all of them now. */
for (const [file, w, h] of [["index.html", 1280, 900], ["phone.html", 412, 915]]) {
  const jp = await browser.newPage({viewport:{width:w, height:h}});
  const seen = [];
  await jp.goto(BASE + "/" + file, {waitUntil:"networkidle"});
  for (const mode of ["item", "metal", "device", "setup", "log"]) {
    const t = await jp.evaluate((m) => { st.mode = m; render();
      return document.body.innerText; }, mode);
    if (/\bthe desk\b/i.test(t)) seen.push(mode + ": " + (t.match(/.{0,40}the desk.{0,40}/i)||[""])[0].trim());
  }
  /* and the one card that carries the most of it - a priced item mid-run */
  const t2 = await jp.evaluate(() => {
    const c = CATALOG.find(y => y.items.some(i => i.id === "e5"));
    st.mode="item"; st.catId=c.id; st.itemId="e5"; st.picked=true;
    st.brandSet=true; st.brandTyped="Microsoft"; st.model="Xbox"; st.market=null;
    const q = askQueue(calcItem()); st.askAt = q.findIndex(z => z.id === "worth"); render();
    return document.body.innerText;
  });
  if (/\bthe desk\b/i.test(t2)) seen.push("priced run: " + (t2.match(/.{0,40}the desk.{0,40}/i)||[""])[0].trim());

  /* THE OTHER HALF OF THE SAME REPORT: "still says eBay without stating if
     it is sold prices or for sale prices." Naming the site settles nothing,
     because eBay publishes both. Wherever a source is named, the kind of
     price has to be named with it. */
  const src = await jp.evaluate(() => {
    const at = (note) => {
      const c = CATALOG.find(y => y.items.some(i => i.id === "h4"));
      st.mode="item"; st.catId=c.id; st.itemId="h4"; st.picked=true;
      st.brandSet=true; st.brandTyped="Moultrie"; st.model="Edge"; st.mpNone=false;
      (SPEC_CHOICES[st.itemId]||[]).forEach((g,gi)=>{ st.specSel[st.itemId+":"+gi]=0; });
      st.completeSet=true; st.condSet=true; st.cond="excellent";
      st.market={kind:"list", key:mkKey(), conf:"h", mid:62, lo:50, hi:75,
                 name:"Moultrie Edge", date:"2026-09-24", note,
                 src:"https://www.ebay.com/sch/i.html?_nkw=x"};
      render();
      return document.body.innerText.replace(/\s+/g, " ");
    };
    at("12 eBay sales in the last 90 days");              /* warm the layout */
    return {sold: at("12 eBay sales in the last 90 days"),
            ask:  at("29 listings, asking prices - no sold data")};
  });
  if (!/real sales|sold prices/i.test(src.sold))
    seen.push("a sold row does not say so: " + src.sold.slice(0, 70));
  if (!/asking prices/i.test(src.ask))
    seen.push("an asking row does not say so: " + src.ask.slice(0, 70));
  if (/Desk price list/i.test(src.sold + src.ask))
    seen.push('still headlines "Desk price list"');
  if (/loan \u00f7 resale/i.test(src.sold))
    seen.push("still writes the cushion as an arithmetic expression");

  await jp.close();
  if (seen.length) { bad++; console.log("FAIL " + file + " says where a price came from badly: " + seen.join(" | ")); }
  else console.log("ok   " + file + ": no \"the desk\", and a named source always says sold or asking");
}

/* THE PHONE'S FRONT SCREEN MUST HAVE A WAY TO TAKE A PICTURE.
   Reported from the counter: "what happened to the camera function?" The
   camera was the phone's first move, and a CSS rule written for the
   mid-run hero - .snapWrap:not(.ready) .hero .acts{display:none} - also
   matched the START page, whose wrapper is not "ready" either. So the
   four round actions went, Snap it with them, and the framing tip stayed
   underneath: the phone explained how to frame a photo it had no way to
   take. Every suite passed, because every suite read text, and the text
   was still there.
   So this one presses it: a visible control that reaches #photoCam, and
   no framing tip where there is no camera. */
console.log("\n  the phone's front screen can take a picture");
{
  const p = await browser.newPage({viewport:{width:390,height:844}});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  const r = await p.evaluate(async () => {
    /* what a connected phone with image lookups looks like */
    CAP.sample = {limits: async () => ({images:{}}), json: async () => ({})};
    CAP.images = true;
    st.mode = "item"; st.picked = false; render();
    const out = {tip: /fill the frame/i.test(document.getElementById("view").innerText)};
    const vis = e => { if (!e) return false; const b = e.getBoundingClientRect();
                       return b.width > 8 && b.height > 8 && getComputedStyle(e).visibility !== "hidden"; };
    const snap = document.querySelector('[data-whome="snap"]');
    out.snapThere  = !!snap;
    out.snapShown  = vis(snap);
    out.snapLive   = !!(snap && !snap.disabled);
    out.inputThere = !!document.getElementById("photoCam");
    /* the input existing is not the same as the input being READ: an
       unwired one opens the camera and then swallows the picture. */
    out.inputWired = typeof (document.getElementById("photoCam") || {}).onchange === "function";
    /* and it actually opens the picker rather than doing nothing */
    let clicked = false;
    const inp = document.getElementById("photoCam");
    if (inp) inp.click = () => { clicked = true; };
    if (snap) snap.click();
    out.opensPicker = clicked;
    /* with no camera the tip must not be there either */
    CAP.sample = null; CAP.images = false; render();
    out.tipWhenOff = /fill the frame/i.test(document.getElementById("view").innerText);
    return out;
  });
  const want = [
    ["a Snap it control exists", r.snapThere],
    ["and is visible on the front screen", r.snapShown],
    ["and is not disabled on a connected phone", r.snapLive],
    ["the camera input is on the page", r.inputThere],
    ["and something reads what comes back", r.inputWired],
    ["and pressing Snap it opens it", r.opensPicker],
    ["the framing tip is shown with a camera", r.tip],
    ["and not shown without one", !r.tipWhenOff],
  ];
  for (const [what, ok] of want) {
    if (ok) console.log("ok   " + what);
    else { bad++; console.log("FAIL " + what); }
  }
  if (errs.length) { bad++; console.log("FAIL phone front screen — page errors: " + errs.join(" | ")); }
  await p.close();
}

/* THE ADVICE ON THE CARD HAS TO BE ABOUT THE THING ON THE COUNTER.
   Reported from the counter, with a PlayStation 5 on the glass and the
   card reading "Activation lock. A locked phone is a brick": the killer
   and driver lines are written per AISLE, and an aisle holds a TV, a
   laptop, a speaker and a car amp as well as a phone. Nothing catches
   this - the card renders, the words are spelled right, and only somebody
   who knows what a PlayStation is would notice.
   So: no item may be handed a line naming a DIFFERENT kind of thing. */
console.log("\n  the advice names the thing in front of you");
{
  const p = await browser.newPage({viewport:{width:1400,height:900}});
  await p.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const wrong = await p.evaluate(() => {
    /* A word that names one specific kind of thing, and the only items
       allowed to say it. Word boundaries, so "crossbow" is not "bow". */
    const OWNED = [
      [/\bphones?\b/i,      ["e4"]],
      [/\btablets?\b/i,     ["e3"]],
      [/\blaptops?\b/i,     ["e2"]],
      [/\bconsoles?\b/i,    ["e5"]],
      [/\bmowers?\b/i,      ["p4", "p5"]],
      [/\bgenerators?\b/i,  ["p7"]],
      [/\bchainsaws?\b/i,   ["p1"]],
      [/\bcompressors?\b/i, ["t4", "t5"]],
      [/\bwelders?\b/i,     ["t6"]],
      [/\bbows?\b/i,        ["h5"]],
      [/\bscopes?\b/i,      ["h1"]],
    ];
    const out = [];
    for (const cat of CATALOG) for (const it of cat.items) {
      st.catId = cat.id; st.itemId = it.id;
      const ov = (typeof itemOv === "function" && itemOv()) || {};
      const said = [ov.killer || cat.killer || "", ov.driver || cat.driver || ""].join(" ");
      for (const [re, owners] of OWNED) {
        if (re.test(said) && !owners.includes(it.id)) {
          const m = said.match(re)[0];
          out.push(`${cat.id}/${it.id} "${it.name}" is told about a ${m}`);
        }
      }
    }
    return out;
  });
  if (wrong.length) { bad++; wrong.forEach(w => console.log("FAIL " + w)); }
  else console.log("ok   no item is handed advice about something else");
  await p.close();
}

/* THE BUTTON THAT SAID NOTHING.
   Reported from the counter: "the lookup button doesn't do anything." It
   fired every time - it searched, and it could move the price. But every
   word it produced went to #pdFindMsg, which lives on the comps card and
   is not on the page at all when the rail is up, so pressing it moved
   nothing on screen whether it won or lost. A button that works silently
   is a button that does not work. */
console.log("\n  and the Look up button says what it is doing");
{
  const p = await browser.newPage({viewport:{width:1400,height:900}});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await p.evaluate(async () => {
    let release; const held = new Promise(r => release = r);
    CAP.sample = {limits: async () => ({images:{}}),
                  json: async () => { await held; return {comps: []}; }};
    CAP.images = true;
    st.mode = "item"; st.catId = "elec"; st.itemId = "e5"; st.picked = true;
    st.cond = "good"; st.condSet = true; st.complete = true; st.completeSet = true;
    st.brandTyped = "Sony"; st.model = "PLAYSTATION5";
    (SPEC_CHOICES[st.itemId] || []).forEach((g, gi) => { st.specSel[st.itemId + ":" + gi] = 0; });
    render();
    const btn = () => document.querySelector('[data-dact="look"]');
    const msg = () => document.getElementById("railFindMsg");
    const shown = () => { const m = msg(); if (!m) return null;
      const b = m.getBoundingClientRect();
      return b.height > 0 && b.top >= 0 && b.bottom <= window.innerHeight ? m.textContent : null; };
    const out = {startedQuiet: !msg()};
    btn().click();
    await new Promise(r => setTimeout(r, 120));
    out.busyLabel = btn().innerText.trim();
    out.busyLocked = btn().disabled;
    out.busySays   = shown();
    release();
    await new Promise(r => setTimeout(r, 300));
    out.doneLabel = btn().innerText.trim();
    out.doneSays  = shown();
    return out;
  });
  const want = [
    ["nothing is claimed before it is pressed", r.startedQuiet],
    ["the button reads as busy while it searches", /looking/i.test(r.busyLabel || "")],
    ["and cannot be pressed twice", r.busyLocked === true],
    ["it says what it is searching, in the window", !!r.busySays],
    ["the button comes back when it is done", /look up/i.test(r.doneLabel || "")],
    ["and the outcome is on screen, not swallowed", !!r.doneSays],
  ];
  for (const [what, ok] of want) {
    if (ok) console.log("ok   " + what);
    else { bad++; console.log("FAIL " + what); }
  }
  if (errs.length) { bad++; console.log("FAIL Look up — page errors: " + errs.join(" | ")); }
  await p.close();
}

/* THE TOOL MUST NOT USE THE TRADE'S WORDS AS IF EVERYBODY KNOWS THEM.
   Reported from the counter: "I'm still learning the lingo and rational. I
   don't know what spot vs loan means." The offending line was in a fold
   whose entire job was explaining something, and it explained it with a
   word that had never been defined. Same fault as calling the tool "the
   desk" at the counter, three weeks earlier.

   The rule is not that the word is banned - a dealer on the phone will say
   "spot" and the counter should know it. The rule is that the screen says
   "today's price" everywhere it means today's price, and the word is
   TAUGHT exactly once, in the card that exists to teach it. */
console.log("\n  the trade's words are taught, not assumed");
{
  const p = await browser.newPage({viewport:{width:1500,height:1100}});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  /* The guard card needs metals-risk.json to have landed. Without the wait
     the card is simply absent, the page has no "spot" on it, and the test
     passes by looking at nothing — which is exactly how it passed a revert
     the first time it was tried. `sawCard` makes that impossible. */
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const out = {loose: [], defined: false, words: 0, sawCard: false};
    for (const deal of ["buy", "pawn"]) for (const metal of ["gold", "silver"]) {
      st.mode = "metal"; st.metal = metal; st.deal = deal; st.grams = "4";
      st.openWords = true; render();
      /* folds open: a word hidden in a fold is still a word he has to read */
      document.querySelectorAll("#view details").forEach(d => d.open = true);
      const glossary = document.getElementById("wordsFold");
      if (glossary) out.words = glossary.innerText.trim().split(/\s+/).length;
      const gloss = glossary ? glossary.innerText : "";
      /* EXCLUDE THE GLOSSARY BY LOCATION, NOT BY TEXT.
         The first version matched a bare "spot" and then skipped any match
         the glossary's text also contained - and the glossary contains the
         word "spot", which is its whole job. So it skipped every match and
         passed a revert. Take the node out of a copy of the page and read
         what is left. */
      const copy = document.getElementById("view").cloneNode(true);
      const g2 = copy.querySelector("#wordsFold"); if (g2) g2.remove();
      copy.querySelectorAll("details").forEach(d => d.open = true);
      document.body.appendChild(copy);
      const page = copy.innerText;
      copy.remove();
      for (const m of page.matchAll(/.{0,30}\bspot\b.{0,20}/gis)) {
        if (/spot-lock/i.test(m[0])) continue;
        out.loose.push(deal + "/" + metal + ": ..." + m[0].replace(/\s+/g, " ") + "...");
      }
      if (/the trade calls it/i.test(gloss)) out.defined = true;
      if (document.querySelector(".mGuard details")) out.sawCard = true;
    }
    return out;
  });
  const t = [
    ["no screen uses \"spot\" undefined — " + (r.loose.length ? r.loose[0] : "none found"),
     r.loose.length === 0],
    ["the word IS taught, so a dealer saying it is not new", r.defined === true],
    ["the glossary is short enough to read once — " + r.words + " words", r.words > 0 && r.words <= 200],
    ["and the card that carries the prose was actually on the page", r.sawCard === true],
  ];
  for (const [what, ok2] of t) { if (ok2) console.log("ok   " + what);
                                 else { bad++; console.log("FAIL " + what); } }
  if (errs.length) { bad++; console.log("FAIL glossary — page errors: " + errs.join(" | ")); }
  await p.close();
}

/* $131 MUST NOT BE READABLE AS $131 OF INTEREST.
   Reported from the counter, about a $105 loan: "I read it as he was
   paying 131 in interest." The line said "He pays back $131 by day 30",
   and on a screen where every other sentence pairs "pays" with a fee that
   is a fair reading. The figure is the whole redemption - his $105 back
   plus $26 - and the difference between those two readings is the whole
   deal.
   So wherever the redemption total is shown, the loan and the interest
   have to be shown beside it, named. A total standing on its own next to
   the word "pays" is the bug. */
console.log("\n  the redemption total cannot be mistaken for the interest");
{
  const p = await browser.newPage({viewport:{width:1400,height:900}});
  await p.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await p.evaluate(() => {
    st.mode = "item"; st.catId = "tools"; st.itemId = "t1"; st.picked = true;
    st.brandSet = true; st.brand = "hi"; st.model = "DCD791";
    st.condSet = true; st.completeSet = true; st.cond = "good"; st.complete = true;
    st.market = {kind:"found", key:mkKey(), mid:120, lo:100, hi:150,
                 n:21, sold:21, basis:"sold", comps:[]};
    (SPEC_CHOICES[st.itemId] || []).forEach((g, gi) => {
      st.specSel[st.itemId + ":" + gi] = specBase(g); });
    /* stand on the last card, which is where the answer takes over */
    st.askEdit = false; st.askAt = askQueue(calcItem()).length - 1;
    render();
    const x = calcItem();
    const card = document.querySelector(".adDeal.lend");
    return {line: card ? card.innerText.replace(/\s+/g, " ") : null,
            loan: money(x.target), fee: money(x.charge),
            total: money(x.target + x.charge),
            page: document.getElementById("view").innerText};
  });
  const L = r.line || "";
  const want = [
    ["the pawn-loan card states the redemption total", L.includes(r.total)],
    ["names the loan inside it", L.includes(r.loan)],
    ["names the interest inside it", L.includes(r.fee)],
    ["and calls that part interest", /interest/i.test(L)],
    ["it says what the total IS, not just that he pays it", /get it back/i.test(L)],
    ["the bare phrase that was misread is gone", !/pays back/i.test(r.page)],
  ];
  for (const [what, ok] of want) {
    if (ok) console.log("ok   " + what);
    else { bad++; console.log("FAIL " + what + " — card reads: " + L.slice(0, 120)); }
  }
  await p.close();
}

/* WHAT THE LOOKUP SAYS WHEN IT LANDS HAS TO BE ENGLISH.
   It used to print the engine's own tally - "eBay asks 35 · Searched, used
   failed · Shopping, used failed · new none — 21 new, 44 on file, 14
   duplicate dropped" - which was fine while it was buried on a card nobody
   opened, and became the most prominent line in the rail the moment the
   rail started showing it. Reported from the counter: "I have no idea what
   the circled section means."
   The one thing that must always be in it is the answer to the question
   asked more than any other here: sold, or asking? */
console.log("\n  the lookup reports in English");
{
  const p = await browser.newPage({viewport:{width:1400,height:900}});
  await p.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const lines = await p.evaluate(() => {
    const mk = (n, basis, where) => Array.from({length:n}, (_, i) => ({price:100+i, basis, where}));
    return {
      asks:  findSaid(mk(35, "asking", "eBay"), 21, {n:44},
                      [{name:"Searched, used", ok:false}, {name:"Shopping, used", ok:false}]),
      sold:  findSaid(mk(12, "sold", "eBay"), 12, {n:12}, []),
      mixed: findSaid(mk(9, "sold", "eBay").concat(mk(26, "asking", "Shopping")), 35, {n:44}, []),
      none:  findSaid([], 0, {n:44}, []),
    };
  });
  const all = Object.values(lines).join(" | ");
  const want = [
    ["asking prices are called asking", /asking/i.test(lines.asks) && /nobody paid/i.test(lines.asks)],
    ["sold prices are called sold", /sold/i.test(lines.sold) && /actually paid/i.test(lines.sold)],
    ["a mixed answer counts both", /\b9 sold\b/.test(lines.mixed) && /\b26 asking\b/.test(lines.mixed)],
    ["nothing new says so plainly", /nothing new/i.test(lines.none)],
    /* the tells of the old tally, none of which mean anything at a counter */
    ["no 'duplicate dropped'", !/duplicate/i.test(all)],
    ["no bare 'failed'", !/\bfailed\b/i.test(all)],
    ["no 'new none'", !/new none/i.test(all)],
    ["no dot-separated pass list", !/·.*·/.test(all)],
    /* and it has to stay short enough to read while somebody waits */
    ["every line is 30 words or fewer",
     Object.values(lines).every(l => l.trim().split(/\s+/).length <= 30)],
  ];
  for (const [what, ok] of want) {
    if (ok) console.log("ok   " + what);
    else { bad++; console.log("FAIL " + what); }
  }
  await p.close();
}

/* THE ICONS ARE THE ONE PART OF THE TOOL SEEN WITH THE TOOL SHUT.
   A manifest naming a 512 that is really a 180, or a favicon link pointing
   at a file nobody generated, fails silently: the browser drops back to a
   blank page-corner and the installed app to a grey square, and nothing in
   the console says why. Read the PNG headers and check the sizes match
   what is claimed. */
console.log("\n  what it looks like with the tool shut");
{
  const bytes = f => readFileSync(join(ROOT, f));
  /* IHDR is the first chunk of every PNG: 8 bytes signature, 4 length,
     4 "IHDR", then width and height as big-endian 32-bit. */
  const png = f => { const b = bytes(f);
    if (b.slice(1, 4).toString() !== "PNG") throw new Error(f + " is not a PNG");
    return {w: b.readUInt32BE(16), h: b.readUInt32BE(20)}; };
  const head = readFileSync(join(ROOT, "index.html"), "utf8")
             + readFileSync(join(ROOT, "phone.html"), "utf8");
  for (const mf of ["manifest.webmanifest", "manifest-phone.webmanifest"]) {
    const m = JSON.parse(bytes(mf).toString());
    for (const ic of m.icons) {
      const want = Number(ic.sizes.split("x")[0]);
      try {
        const got = png(ic.src);
        if (got.w === want && got.h === want) console.log(`ok   ${mf}: ${ic.src} really is ${want}x${want}`);
        else { bad++; console.log(`FAIL ${mf}: ${ic.src} claims ${want}x${want}, is ${got.w}x${got.h}`); }
      } catch (e) { bad++; console.log(`FAIL ${mf}: ${ic.src} — ${e.message}`); }
    }
    /* A launcher may crop a maskable icon to a circle, so one has to exist
       or Android draws the square one shrunk inside a white blob. */
    if (m.icons.some(i => i.purpose === "maskable")) console.log(`ok   ${mf}: has a maskable icon`);
    else { bad++; console.log(`FAIL ${mf}: no maskable icon — Android will letterbox it`); }
  }
  /* Everything the two pages point at by hand: the tab icon and iOS's. */
  for (const f of ["favicon.svg", "favicon-32.png", "apple-touch-icon.png"]) {
    if (!head.includes(f)) { bad++; console.log(`FAIL nothing links ${f}`); continue; }
    try { bytes(f); console.log(`ok   ${f} is linked and present`); }
    catch (e) { bad++; console.log(`FAIL ${f} is linked but missing`); }
  }
  /* Offline, an icon that is not in the cache list is an icon the installed
     app loses the first time it opens with no signal. */
  const sw = bytes("sw.js").toString();
  const missed = ["icon-192.png", "icon-512.png", "icon-maskable-512.png",
                  "apple-touch-icon.png", "favicon.svg", "favicon-32.png"].filter(f => !sw.includes(f));
  if (missed.length) { bad++; console.log("FAIL not cached for offline: " + missed.join(", ")); }
  else console.log("ok   every icon is cached for offline");
}

/* NO BUTTON THAT REPEATS THE RAIL. The front card carried four quick
   actions and every one of them repeated something already on the same
   screen: Gold and Log went where the navigation rail goes, Type it focused
   the search box that is the largest thing on the page, Photo opened the
   camera that has its own card underneath. Jace circled the Gold button and
   the rail together.
   The phone keeps one, and the assertion says WHY rather than just counting:
   #photoCam is a hidden input, so that button is the only visible way to the
   camera on the field screen. Counting to one would pass if the button were
   the wrong one. */
{
  const seen = async (url, viewport) => {
    const pg = await browser.newPage({viewport});
    await pg.goto(BASE + url, {waitUntil: "networkidle"});
    await pg.waitForTimeout(500);
    const r = await pg.evaluate(() => {
      const vis = el => { if (!el) return false; const c = getComputedStyle(el), b = el.getBoundingClientRect();
        return c.display !== "none" && c.visibility !== "hidden" && b.width > 0 && b.height > 0; };
      return {
        acts: [...document.querySelectorAll(".acts .act")].filter(vis)
                .map(a => a.dataset.whome),
        rail: [...document.querySelectorAll("#tabs button")].filter(vis)
                .map(t => t.dataset.tab),
        camHidden: !vis(document.getElementById("photoCam")),
        camExists: !!document.getElementById("photoCam"),
      };
    });
    await pg.close();
    return r;
  };
  const d = await seen("/index.html", {width: 1400, height: 900});
  if (d.acts.length) { bad++; console.log("FAIL the desk front card still carries quick actions: " + d.acts.join(", ")); }
  else console.log("ok   the desk front card carries no button the rail already has");

  const ph = await seen("/phone.html", {width: 390, height: 844});
  const dupes = ph.acts.filter(a => ph.rail.includes(a === "log" ? "log" : a === "gold" ? "metal" : a));
  if (dupes.length) { bad++; console.log("FAIL the phone repeats the rail: " + dupes.join(", ")); }
  else console.log("ok   the phone repeats nothing the rail already has");
  if (ph.acts.join(",") !== "snap") { bad++; console.log("FAIL the phone should keep exactly the camera button, got: " + (ph.acts.join(", ") || "none")); }
  else console.log("ok   the phone keeps the camera button");
  if (ph.camExists && !ph.camHidden) { bad++; console.log("FAIL #photoCam is visible on the phone — the button is no longer its only way in"); }
  else console.log("ok   and it is the only visible way to the camera, which is why it stays");
}

/* MONEY, THEN HOW GOOD THE NUMBER IS, THEN THE CAUTIONS. The rail read
   price, warning, warning, and only then the card saying how much evidence
   the price rests on - Jace circled that card and asked for it near the top.
   The two cautions were the tail of the price card, so moving them meant
   they started appearing MID-RUN, under the bare strip, where they had never
   been. Both halves are asserted: the settled order, and that the mid-run
   rail still carries nothing but the evidence card. */
{
  const pg = await browser.newPage({viewport: {width: 1400, height: 900}});
  await pg.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  const r = await pg.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "g6"));
    const labels = () => [...document.querySelectorAll(".rail .label")].map(l => l.textContent.trim());
    st.mode = "item"; st.catId = c.id; st.itemId = "g6"; st.picked = true; st.cond = "exc";
    st.market = null; render();
    const midRun = labels();
    st.brandTyped = "Ruger"; st.brand = "hi"; st.brandSet = true; st.model = "10/22";
    st.condSet = true; st.complete = true; st.completeSet = true;
    (SPEC_CHOICES["g6"] || []).forEach((g, gi) => { st.specSel["g6:" + gi] = 0; });
    st.market = {kind:"list", key: mkKey(), mid: 291, lo: 110, hi: 145, name: "Ruger 10/22",
                 conf: "m", date: todayStr(), src: "https://gunwatcher.com", note: "", stale: false};
    render();
    const w = document.querySelector(".rail .wCard");
    return {midRun, settled: labels(), card: w ? w.textContent.replace(/\s+/g, " ") : "",
            guardInside: !!(w && w.querySelector(".iGuard")),
            guardCards: document.querySelectorAll(".rail .card.iGuard").length};
  });
  await pg.close();
  if (r.settled[0] !== "Behind this number") {
    bad++; console.log("FAIL the evidence card is not first in the rail: " + r.settled.join(" / "));
  } else console.log("ok   the rail leads with how much is behind the number");
  if (r.midRun.join(",") !== "Behind this number") {
    bad++; console.log("FAIL the mid-run rail grew cards: " + r.midRun.join(" / "));
  } else console.log("ok   and the mid-run rail is unchanged");
  /* "Looked up by hand" meant nothing to the counter. The wording has to say
     that a PERSON read it and NOTHING was counted, not merely that it was
     "researched" - which is the word that was already there and already
     unclear. */
  /* No trailing \\b: the card's own text runs "Estimateno real sale behind
     it" with no space between elements, so a word boundary after the word
     never matches and the assertion failed on copy that was there. */
  const says = /\bEstimate/.test(r.card)
            && /Nobody checked what one actually sold for/.test(r.card)
            /* And that it says what to DO. Three wordings failed at the
               counter before this one - "the sums are exact, the figure they
               start from is not", then "all of these dollars are worked out
               from that one range" - both true, both needing explanation,
               and a line of counter copy that needs explaining has failed.
               The test holds the ACTION, because that is the part a new
               person can use without knowing how the tool works. */
            && /look one up/i.test(r.card)
            && /swaps this estimate for a real price/i.test(r.card);
  if (!says) { bad++; console.log("FAIL an estimate does not say it is one, or does not say to look a real price up"); }
  else console.log("ok   an estimate says so plainly, and says to look a real price up");
  /* ONE CARD, NOT TWO. "Behind this number" and "How good is this number?"
     sat one above the other saying the same thing - reported from the
     counter as duplicated, and caused by moving the evidence card to the
     top. The guard is inside the evidence card now, so it must be present
     AND must not be a card of its own. */
  if (!r.guardInside) { bad++; console.log("FAIL the guard is not inside the evidence card"); }
  else console.log("ok   the guard sits inside the evidence card, not beside it");
  if (r.guardCards) { bad++; console.log("FAIL the guard is still drawn as its own card too"); }
  else console.log("ok   and is not drawn twice");
  if (/looked up by hand/.test(r.card)) { bad++; console.log("FAIL the old 'looked up by hand' wording is back"); }
  else console.log("ok   and does not say 'looked up by hand'");
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
