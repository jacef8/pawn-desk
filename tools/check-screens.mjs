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
  item:   /take a picture|photograph|camera|what it is|try stihl|start from one of these/i,
  metal:  /gold|silver/i,
  device: /money changes hands/i,
  flags:  /answer is no/i,
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
    const leaked = mode !== "flags" && FLAGS_LINE.test(txt);
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
        st.condSet = false; st.specSel = {}; st.brandTyped = ""; st.brandQ = "";
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
      st.cond = "good"; st.condSet = true;
      for (let i = 0; i < 8; i++) {
        const q = askQueue(calcItem());
        const o = q.find(z => !z.answered && !z.optional);
        if (!o || !o.opts || !o.opts.length) break;
        const pick = o.opts[0], k = pick.set, v = String(pick.v);
        if (k === "brand") { st.brand = v; st.brandTyped = ""; st.brandQ = ""; st.brandSet = true; }
        else if (k === "comp") st.complete = v === "1";
        else if (k === "cond") { st.cond = v; st.condSet = true; }
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
   with 600px of empty screen beneath it. They are buttons now, and the
   twelve kinds the desk carries are laid out instead of folded away. Both
   are only an improvement while they still DO anything, and a chip that
   fills nothing looks exactly like a chip that works. */
{
  const p = await browser.newPage({viewport: {width: 1440, height: 900}});
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  const r = await p.evaluate(() => {
    const out = {};
    st.picked = false; st.omniDone = ""; render();
    const chips = [...document.querySelectorAll("[data-try]")];
    const tiles = [...document.querySelectorAll(".kindTile[data-cat]")];
    out.chips = chips.length;
    out.tiles = tiles.length;
    out.kinds = CATALOG.length;
    if (chips.length) {
      chips[0].click();
      const inp = document.getElementById("omniIn");
      out.filled = inp ? inp.value : "";
      const list = document.getElementById("omniList");
      out.opened = !!(list && !list.hidden && list.querySelectorAll("[data-omni]").length);
    }
    return out;
  });
  const ok = r.chips >= 4 && r.tiles === r.kinds && r.filled && r.opened;
  if (!ok) { bad++; console.log(`FAIL front page ways in — chips:${r.chips} tiles:${r.tiles}/${r.kinds} filled:"${r.filled}" listOpened:${r.opened}`); }
  else console.log(`ok   ${r.chips} worked examples fill the box and open the list, ${r.tiles} kinds laid out`);
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
        st.condSet = false; st.specSel = {}; st.brandTyped = ""; st.brandQ = "";
        st.model = ""; st.bookName = ""; st.picked = false; st.askAt = 0; st.cond = "";
        if (state !== "start") {
          const R = omniRows("dewalt dcd791 drill") || {}, rows = R.rows || [];
          const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
          if (f) omniPick(f);
        }
        if (state === "priced") { st.cond = "good"; st.condSet = true; }
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
        st.flow = "ask"; st.market = null; st.condSet = false; st.specSel = {};
        st.brandTyped = ""; st.brandQ = ""; st.model = ""; st.bookName = "";
        st.picked = false; st.askAt = 0; st.cond = "";
        if (state !== "start") {
          const R = omniRows(state === "simple" ? "hammer" : "dewalt dcd791 drill") || {};
          const f = (R.rows || []).find(x => ["mp", "book", "item"].includes(x.kind));
          if (f) omniPick(f);
        }
        if (state === "priced") { st.cond = "good"; st.condSet = true; }
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
