/* ONE BOOK, TWO COPIES, KEPT IDENTICAL.
 *
 * prices.json is fetched on every page load. app.js carries the same rows
 * as MODEL_PRICES, for a device that cannot reach the file at all. The two
 * drifted 171 rows apart once, because a harvest wrote prices.json and
 * nothing wrote app.js - so a disconnected tablet fell back on half a book
 * and quoted an Acer Aspire 5 at $327-660 when the measured figure was
 * $272-391. check-merge now refuses to pass unless they are byte-identical.
 *
 * This is how you make them identical. Do not do it by hand: the first
 * attempt used a blanket ", " -> "," replace that reached inside the
 * strings and turned "AR-15, entry-level" into "AR-15,entry-level" -
 * corrupting the data it was supposed to be copying. json.stringify with
 * an explicit separator touches only the structural comma.
 *
 *   node tools/sync-book.mjs           # rewrite app.js from prices.json
 *   node tools/sync-book.mjs --check   # report drift, change nothing
 *
 * Exits non-zero when --check finds drift, so it can gate a commit.        */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const APP = join(ROOT, "app.js"), PJ = join(ROOT, "prices.json");
const check = process.argv.includes("--check");

const rows = JSON.parse(readFileSync(PJ, "utf8")).rows;
if (!Array.isArray(rows) || !rows.length) {
  console.error("prices.json has no rows — refusing to touch app.js.");
  process.exit(2);
}
/* The same shape the app validates with mpOk(): nine fields, a low and a
   high that are numbers, high not below low. A malformed row must never
   reach the fallback, because the fallback is what answers when nothing
   else can. */
const bad = rows.filter(r => !(Array.isArray(r) && r.length >= 9 &&
  typeof r[0] === "string" && typeof r[2] === "string" &&
  typeof r[3] === "number" && typeof r[4] === "number" &&
  r[3] > 0 && r[4] >= r[3] && r[4] < 1000000));
if (bad.length) {
  console.error(`${bad.length} row(s) in prices.json would be rejected by the app; fix them first.`);
  console.error("  first: " + JSON.stringify(bad[0]).slice(0, 140));
  process.exit(2);
}

const src = readFileSync(APP, "utf8");
const i = src.indexOf("let MODEL_PRICES=[");
const j = src.indexOf("\n];", i);
if (i < 0 || j < 0) { console.error("Could not find MODEL_PRICES in app.js."); process.exit(2); }

const body = rows.map(r => " " + JSON.stringify(r, null, 0)).join(",\n");
const next = src.slice(0, i) + "let MODEL_PRICES=[\n" + body + "\n];" + src.slice(j + 3);

if (next === src) { console.log(`in sync — both books carry ${rows.length} rows.`); process.exit(0); }
if (check) {
  const had = (src.slice(i, j).match(/^\s*\["/gm) || []).length;
  console.error(`DRIFT: app.js carries ${had} rows, prices.json ${rows.length}. Run: node tools/sync-book.mjs`);
  process.exit(1);
}
writeFileSync(APP, next);
console.log(`app.js fallback rewritten from prices.json — ${rows.length} rows.`);
