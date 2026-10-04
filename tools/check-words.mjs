#!/usr/bin/env node
/* HOW MANY WORDS EACH SCREEN COSTS.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-words.mjs
 *
 * "get rid of these extemrly long and wordy explanations. maybe an info
 * button that we can hover over and get more detail." Said twice, and
 * before that "im also tired of the constant scrolling and scrolling of
 * windows with info buried under other windowss."
 *
 * check-ask has held a word budget on ONE card since the day he said it,
 * and that budget is the only reason that card is still short. Nothing
 * held the other nine screens, so this is the same idea everywhere: a
 * budget, not a target. A rewrite that needs more words than this needs a
 * reason, and the place for the reason is an info button.
 *
 * Measured before any cutting, every visible word on every screen:
 *
 *            phone                desk
 *   item      56                  163
 *   setup    248  <- worst        450  <- worst
 *   log       86                   90
 *   device   231                  235
 *   metal    720  <- worst block  724
 *
 * Setup was the wordiest screen on both surfaces and one block was a
 * third of it: 153 words explaining four layout modes, permanently on
 * screen, under four buttons whose names already say what they do. The
 * gold screen carried 93 more in two hints about why the arithmetic is
 * what it is, and 45 in three closers that restated the line above them.
 * All of it is still reachable. None of it is on the screen.
 *
 * WHAT IS EXEMPT, AND WHY. The fakes checks out of fakes.json are the
 * counter's step-by-step for spotting a plated fake, and one of them runs
 * to 90 words. CLAUDE.md does not let that gate soften, a wrong call
 * there costs the whole price of the piece, and he opens a fakes sheet on
 * purpose rather than being handed it. Completeness wins over brevity in
 * exactly that one place, so .fakeQ is excluded from the block budget by
 * name. Everything else on every screen is in.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; } catch (e) { return null; } })()
].filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

/* Budget per screen, total visible words. Measured value plus about a
   fifth, so an honest new control does not go red while a paragraph
   coming back does. */
const BUDGET = {
  phone: {item: 90, setup: 200, log: 115, device: 275, metal: 420},
  desk:  {item: 200, setup: 240, log: 115, device: 275, metal: 430}
};
/* No single run of prose longer than this, anywhere, fakes checks aside.
   40 words is about three lines on a phone. */
const BLOCK = 40;
/* The gold screen's budget came down from 650 to 430 when the spotting-
   fakes card was shut by default: "yes close it until i tap it." 724
   words when this started, 363 now. The budget is what stops it drifting
   back open. */

const browser = await chromium.launch({executablePath: EXE});
const errs = [];
const seen = {};

for (const [tag, file, w, h] of [["phone", "phone.html", 390, 844],
                                 ["desk", "index.html", 1500, 1000]]) {
  const pg = await browser.newPage({viewport: {width: w, height: h}});
  pg.on("pageerror", e => errs.push(tag + ": " + e));
  await pg.goto(BASE + "/" + file, {waitUntil: "networkidle"});
  await pg.waitForTimeout(900);
  seen[tag] = {};
  for (const mode of Object.keys(BUDGET[tag])) {
    await pg.evaluate(m => { st.mode = m; st.openRules = false; render(); }, mode);
    await pg.waitForTimeout(400);
    seen[tag][mode] = await pg.evaluate(() => {
      const all = (document.body.innerText || "").replace(/\s+/g, " ").trim();
      /* The longest unbroken run of prose on the screen, which is what
         reads as "wordy" rather than the total. Leaf elements only, so a
         card is not counted as one block of everything inside it. */
      /* "LEAF ELEMENTS ONLY" WAS AN ASSERTION THAT COULD NOT FAIL.
         Reverted the 153-word layout paragraph to check this budget and
         the total went red while the block budget stayed green: that
         paragraph is one div carrying <b> and <br>, so it has children
         and the leaf rule skipped it. Every long hint in this app has
         that shape, which means the budget could not see the thing it
         was written for.
         A prose block is an element with no BLOCK-level descendant -
         inline markup inside it is still one run of prose to read. */
      const BLOCKISH = "div,p,section,details,summary,ul,ol,li,table,tr,td,button,input,textarea,label,h1,h2,h3,h4,svg";
      let worst = {n: 0, t: ""};
      document.querySelectorAll("#view *").forEach(e => {
        if (e.querySelector(BLOCKISH)) return;    /* a container, not a run of prose */
        if (!e.offsetParent) return;
        if (e.closest(".infoPop")) return;        /* the detail lives here on purpose */
        if (e.closest(".fakeQ") || e.classList.contains("fakeQ")) return;
        const t = (e.innerText || "").replace(/\s+/g, " ").trim();
        const n = t ? t.split(" ").length : 0;
        if (n > worst.n) worst = {n, t: t.slice(0, 80)};
      });
      return {words: all ? all.split(" ").length : 0, worst,
              info: document.querySelectorAll("#view .infoBtn").length};
    });
  }
  await pg.close();
}

for (const tag of ["phone", "desk"]) {
  console.log(`\n  ${tag}: what each screen costs to read`);
  for (const mode of Object.keys(BUDGET[tag])) {
    const r = seen[tag][mode], b = BUDGET[tag][mode];
    ok(r.words <= b, `  ${mode} is ${r.words} words (budget ${b})`);
    ok(r.worst.n <= BLOCK,
       `    longest run of prose ${r.worst.n} words (budget ${BLOCK})${r.worst.n > BLOCK ? ' — "' + r.worst.t + '"' : ""}`);
  }
}

/* THE WORDS WENT SOMEWHERE. Cutting a screen by deleting what it said
   would pass every assertion above and be a worse tool. The two screens
   the paragraphs came off have to carry the buttons that now hold them. */
console.log("\n  and the detail is still reachable, not deleted");
ok(seen.desk.setup.info >= 4,
   `  setup carries ${seen.desk.setup.info} info buttons`);
ok(seen.desk.metal.info >= 3,
   `  the gold screen carries ${seen.desk.metal.info}`);
ok(seen.phone.setup.info >= 3,
   `  and the phone's setup ${seen.phone.setup.info}, so the detail is not desk-only`);

/* An info button nobody can open is a deletion with extra steps. */
console.log("\n  and an info button opens on a tap, on both surfaces");
for (const [tag, file, w, h] of [["phone", "phone.html", 390, 844],
                                 ["desk", "index.html", 1500, 1000]]) {
  const pg = await browser.newPage({viewport: {width: w, height: h}});
  pg.on("pageerror", e => errs.push(tag + ": " + e));
  await pg.goto(BASE + "/" + file, {waitUntil: "networkidle"});
  await pg.waitForTimeout(900);
  await pg.evaluate(() => { st.mode = "setup"; render(); });
  await pg.waitForTimeout(400);
  const b = pg.locator("#view .infoBtn").first();
  if (await b.count()) {
    await b.click();
    await pg.waitForTimeout(250);
    const r = await pg.evaluate(() => {
      const p = document.querySelector("#view .infoBtn.open .infoPop");
      if (!p) return null;
      const cs = getComputedStyle(p);
      return {vis: cs.visibility, op: Number(cs.opacity),
              words: (p.textContent || "").trim().split(/\s+/).length};
    });
    ok(!!r && r.vis !== "hidden" && r.op > 0.5 && r.words > 8,
       `  ${tag}: it opens and holds ${r ? r.words : 0} words`);
  } else { ok(false, `  ${tag}: no info button to open`); }
  await pg.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
