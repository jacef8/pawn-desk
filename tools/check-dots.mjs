#!/usr/bin/env node
/* THE PROGRESS DOTS STAY PUT.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-dots.mjs
 *
 * "do you see how the progression dots are reactive to the size of the
 * buttons. it shold be a standard layout."
 *
 * They were. The nav was one flex row - Back, dots, Next - with the dots
 * as the flex:1 middle taking whatever the two buttons left. The buttons
 * change wording on every question: "Skip", "Next", "Write the ticket",
 * and on the last card "Next → Which one is it", 203px of the 390 on his
 * phone. So the dots moved, squeezed and wrapped, question by question.
 *
 * Measured across all eight questions of a TCL, before the fix:
 *
 *   iPhone 390    2 different x positions, wrapping to 2, 3 or EIGHT
 *                 lines, nav 42px tall and then 114px
 *   Android 360   3 lines normally, 8 on the last question
 *   Pixel 412     2, 3 and 5 lines
 *
 * Eight lines is the dots standing in a vertical column beside a button,
 * which is not a progress indicator any more.
 *
 * This suite is the standard layout stated as a measurement: whatever the
 * question, whatever the button says, the dot row starts in the same
 * place, is the same width, sits on ONE row, and the nav is the same
 * height. One position, one width, one row, one height.
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

const browser = await chromium.launch({executablePath: EXE});
const errs = [];

/* An item with a long run, so there are plenty of dots and the last card
   gets the long "Next → ..." label that caused the worst of it. */
const SIZES = [["phone.html", 390, 844, "iPhone"],
               ["phone.html", 360, 780, "small Android"],
               ["phone.html", 412, 915, "Pixel"],
               ["index.html", 1500, 1000, "desk"],
               ["index.html", 1327, 787, "desk at 150%"]];

for (const [file, w, h, tag] of SIZES) {
  const pg = await browser.newPage({viewport: {width: w, height: h}});
  pg.on("pageerror", e => errs.push(tag + ": " + e));
  await pg.goto(BASE + "/" + file, {waitUntil: "networkidle"});
  await pg.waitForTimeout(700);
  await pg.fill("#omniIn", "TCL 55 inch tv");
  await pg.waitForTimeout(400);
  const row = pg.locator('#omniList [data-omni="0"]');
  if (!await row.count()) { ok(false, `${tag} — nothing to pick`); await pg.close(); continue; }
  await row.click();
  await pg.waitForTimeout(450);

  const n = await pg.evaluate(() => askQueue(calcItem()).length);
  const seen = [];
  for (let i = 0; i < n; i++) {
    await pg.evaluate(k => { st.askAt = k; render(); }, i);
    await pg.waitForTimeout(200);
    const r = await pg.evaluate(() => {
      const d = document.querySelector(".askDots"), nav = document.querySelector(".askNav");
      if (!d || !nav) return null;
      const tops = [...d.querySelectorAll("i")].map(e => e.getBoundingClientRect().top);
      /* The active dot is scale(1.4), which moves its box by a pixel or
         two without wrapping anything - so a row is a SPREAD, not a count
         of distinct tops. Counting tops called a perfectly straight row
         two rows, which would have made this suite unfailable in the
         other direction. */
      const spread = tops.length ? Math.max(...tops) - Math.min(...tops) : 0;
      const db = d.getBoundingClientRect();
      return {left: Math.round(db.left), width: Math.round(db.width),
              spread: Math.round(spread), navH: Math.round(nav.getBoundingClientRect().height),
              btn: [...nav.querySelectorAll("button")].map(b => Math.round(b.getBoundingClientRect().width)),
              labels: [...nav.querySelectorAll("button")].map(b => (b.textContent || "").trim())};
    });
    if (r) seen.push(r);
  }
  await pg.close();

  console.log(`\n  ${tag} ${w}x${h}: ${seen.length} question(s)`);
  if (seen.length < 3) { ok(false, "  too few questions to prove anything"); continue; }
  const lefts = [...new Set(seen.map(r => r.left))];
  const widths = [...new Set(seen.map(r => r.width))];
  const navs = [...new Set(seen.map(r => r.navH))];
  const btnWidths = [...new Set(seen.flatMap(r => r.btn))];

  ok(lefts.length === 1, `  the dot row starts in one place — ${JSON.stringify(lefts)}`);
  ok(widths.length === 1, `  and is one width — ${JSON.stringify(widths)}`);
  ok(seen.every(r => r.spread <= 4),
     `  on a single row every time — worst spread ${Math.max(...seen.map(r => r.spread))}px`);
  ok(navs.length === 1, `  and the nav is one height — ${JSON.stringify(navs)}`);
  /* THE CONTROL, AND IT HAD TO MOVE WITH THE FIX.
     It used to require the buttons to differ in width by 40px or more,
     on the grounds that a run where every button happened to be the same
     width would prove nothing. That was right about the OLD layout and
     wrong about this one: fixing the widths IS the fix, so the assertion
     was demanding the bug in order to pass.
     What still has to vary is the thing that caused it - the LABELS. If
     every button said the same word this suite would prove nothing
     either. So: the words differ, and the widths do not. */
  ok(new Set(seen.flatMap(r => r.labels)).size >= 3,
     `  while the buttons say ${new Set(seen.flatMap(r => r.labels)).size} different things — ${[...new Set(seen.flatMap(r => r.labels))].join(" / ")}`);
  ok(btnWidths.length === 1,
     `  and every one of them is the same width — ${JSON.stringify(btnWidths)}`);
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
