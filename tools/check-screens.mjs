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
  item:   /take a picture|photograph|camera|what it is|try stihl/i,
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
  await p.close();
}

await browser.close();
console.log(bad ? `FAILED (${bad})` : "all screens draw themselves, every id once");
process.exit(bad ? 1 : 0);
