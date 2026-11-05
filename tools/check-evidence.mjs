#!/usr/bin/env node
/* "HOW IS IT THAT WE HAVE A PRICE YET NOTHING WAS LOOKED UP?"
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-evidence.mjs
 *
 * He picked a string trimmer off the home screen, the record named it a
 * Stihl FS 131, and the card printed BUY $150 / PAWN $105 with no warning
 * on it at all - while the rail three inches away said "Nothing looked up,
 * no source at all". Both were true about different things, which is the
 * worst kind of screen. "this is one of our shorcut items from the
 * homepage. i thought atleast those had a some data backing them up."
 *
 * Traced:
 *
 *   Stihl FS 131       checked=TRUE  conf=l  src=""     no count
 *   Ryobi 40V trimmer  checked=TRUE  conf=h  src=ebay   4 eBay sales
 *
 * `checked` means THE BOOK HAS A FIGURE. It never meant anybody measured
 * anything, and the money card could not tell those two apart.
 *
 * THE BOOK IS THREE THINGS, measured: 320 rows counted, 181 carrying a
 * page you can open but nothing counted, 6 carrying neither. The first cut
 * of this treated the middle 181 as backed, which would let a gunwatcher
 * link stand in for a sale - and "i want verifiable sales data to back up
 * every purchase" is not satisfied by a link nobody has opened.
 *
 * NO ARITHMETIC CHANGES HERE and the last section proves it. resale, buy
 * and lend are identical either way; what changes is whether the card
 * admits what it is standing on.
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
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };
const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport: {width: 1400, height: 900}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil: "networkidle"});
await page.waitForTimeout(700);

console.log("\n  the machinery this suite is about exists");
const wired = await page.evaluate(() => typeof evidenceTier === "function");
ok(wired, "  the evidence tier is wired");
if (!wired) { console.log("\n  (nothing to check)"); await browser.close();
  console.log(`\n${fails} FAILED`); process.exit(1); }

const read = (q) => page.evaluate((qq) => {
  st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
  st.condSet = false; st.completeSet = false; st.brandSet = false; st.model = ""; st.specSel = {};
  const R = omniRows(qq) || {}, rows = R.rows || [];
  const f = rows.find(x => ["mp", "book", "item"].includes(x.kind));
  if (!f) return null;
  omniPick(f); st.condSet = true; st.completeSet = true;
  (SPEC_CHOICES[st.itemId] || []).forEach((g, i) => { st.specSel[st.itemId + ":" + i] = specBase(g); });
  const x = calcItem();
  return {tier: evidenceTier(x), checked: !!x.checked,
          buy: x.buy, lend: x.target, resale: Math.round(x.resale),
          card: String(askDoneHTML(x)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")};
}, q);

/* ------------------------------------------------------------------ */
console.log("\n  the three things a book row can be standing on");
/* THE FIXTURE USED TO BE THREE MODEL NAMES AND IT ROTTED ON A CALENDAR.
   "Remington 870 Express" was the sourced example, and on 3 Nov it quietly
   stopped being one: the row is dated 19 September, MP_STALE_DAYS is 45,
   and on day 46 evidenceTier calls a stale row "none" like everything
   else. Nothing in the app or the test had changed. 139 rows had crossed
   that line by 5 Nov and 354 more cross it within the week, so naming any
   row here is a bomb with a date on it.
   So the examples are found by asking the app which rows are which, right
   now, and the suite says plainly when a tier has no example left rather
   than reporting the wrong row's behaviour. */
const example = async (want) => {
  const name = await page.evaluate((w) => {
    for (const r of MODEL_PRICES) {
      st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
      st.condSet = false; st.completeSet = false; st.brandSet = false; st.model = ""; st.specSel = {};
      const R = omniRows(String(r[2])) || {}, rows = R.rows || [];
      const f = rows.find((x) => ["mp", "book", "item"].includes(x.kind));
      if (!f) continue;
      omniPick(f); st.condSet = true; st.completeSet = true;
      (SPEC_CHOICES[st.itemId] || []).forEach((g, i) => { st.specSel[st.itemId + ":" + i] = specBase(g); });
      const x = calcItem();
      /* TWO DIFFERENT ROWS READ "none" AND ONLY ONE OF THEM IS THE POINT.
         A row with no source and no count is the confusion this suite is
         about: it still reads as CHECKED, so the card prints money with
         nothing behind it. A row that has merely gone stale also reads
         "none", but reads as unchecked, and the assertions below about
         "it STILL reads as checked" are not about that one. The first
         pick after de-rotting the fixture landed on a stale row and two
         lines went red saying so. */
      if (evidenceTier(x) === w && (w !== "none" || x.checked === true)) return String(r[2]);
    }
    return null;
  }, want);
  if (!name) return null;
  console.log("          " + want + ": " + name);
  return await read(name);
};
const none = await example("none");
const counted = await example("counted");
const sourced = await example("sourced");
ok(!!none && !!counted && !!sourced,
   "all three kinds of row are reachable" +
   (sourced ? "" : " — NO 'sourced' ROW LEFT, which means every row with a page and no count has gone stale"));
if (!none || !counted || !sourced) {
  console.log("\n  (cannot check the three tiers without one of each)");
  await browser.close(); console.log(`\n${fails + 1} FAILED`); process.exit(1);
}

/* THE ROW HE PICKED. A figure, low confidence, no count, no source. */
ok(none.tier === "none", `a row standing on nothing reads as nothing — tier "${none.tier}"`);
/* AND THE ASSERTION THAT IS THE WHOLE POINT. It was `checked` before, and
   `checked` is why the card printed the money with no warning. */
ok(none.checked === true,
   "  and it STILL reads as checked, which is the confusion this fixes");
ok(/nothing counted and no source/i.test(none.card),
   "  so the card says so in the warning ink, on the card with the money on it");

ok(counted.tier === "counted", `a row with counted sales reads as counted — tier "${counted.tier}"`);
ok(!/Estimate|Not a counted sale/i.test(counted.card),
   "  and carries no warning, because there is nothing to warn about");

ok(sourced.tier === "sourced", `a row with a page but no count reads as sourced — tier "${sourced.tier}"`);
ok(/not a counted sale/i.test(sourced.card),
   "  and is not allowed to pass as measured");
ok(/check it before real money moves/i.test(sourced.card),
   "  it says what to do about it");
/* the three must be DIFFERENT, or the tiering is decorative */
ok(new Set([none.tier, counted.tier, sourced.tier]).size === 3,
   "  and the three really are three — not one label on everything");

/* ------------------------------------------------------------------ */
console.log("\n  the whole book, counted");
const book = await page.evaluate(() => {
  let c = 0, s = 0, n = 0;
  for (const r of MODEL_PRICES) {
    if (/\b\d+\s+(ebay\s+)?(sales|listings|sold)/i.test(String(r[8] || ""))) c++;
    else if (String(r[7] || "").trim()) s++; else n++;
  }
  return {c, s, n, total: MODEL_PRICES.length};
});
ok(book.total > 450, `${book.total} rows in the book`);
ok(book.c > 0 && book.s > 0,
   `  ${book.c} counted, ${book.s} sourced but not counted, ${book.n} neither`);
/* A WATCHABLE NUMBER. "over the hump" stops being a feeling when it is a
   share you can read off. If a re-harvest improves the book this rises; if
   somebody pastes in unsourced figures it falls. */
ok(book.c / book.total > 0.5,
   `  ${Math.round(book.c / book.total * 100)}% of the book is backed by a counted figure`);

/* ------------------------------------------------------------------ */
console.log("\n  and not one number moved");
/* THE GUARD ON THIS WHOLE CHANGE. Labelling is mine; the figures are his.
   If a later edit makes the tier feed the arithmetic, this goes red. */
/* IT READS THE STIHL BY NAME, not whichever row the tier picker happened
   to land on. These are that row's figures, frozen on purpose; when the
   picker above stopped returning the Stihl they went red against a
   different machine entirely, which proved nothing about either. */
const stihl = await read("Stihl FS 131");
ok(!!stihl, "the Stihl FS 131 is still in the book");
ok(!!stihl && stihl.buy === 135 && stihl.lend === 95,
   `the Stihl still pays $${stihl && stihl.buy} and lends $${stihl && stihl.lend} — the same as before the tier existed`);
ok(!!stihl && stihl.resale === 300, `  off the same $${stihl && stihl.resale} resale`);
ok(counted.buy > 0 && sourced.buy > 0,
   "  and the other two are untouched as well");

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
