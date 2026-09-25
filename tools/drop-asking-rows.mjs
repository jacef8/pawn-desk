#!/usr/bin/env node
/* Take out of the price book the rows that the desk itself says it cannot
 * price.
 *
 *   node tools/drop-asking-rows.mjs            # say what it would do
 *   node tools/drop-asking-rows.mjs --go       # do it
 *   node tools/drop-asking-rows.mjs --go p7    # one aisle only
 *
 * A row qualifies when BOTH are true:
 *   1. its aisle is on the desk's blind list (EBAY_CANNOT_ITEM in app.js),
 *      so the model screen tells the counter "the desk will not look this
 *      one up"; and
 *   2. its note says the figure rests on asking prices with no sold data.
 *
 * Together those mean the book is quoting a number built out of the exact
 * listings the warning is about - carburettors, belts, control boards -
 * printed in the same type as a measured sale. Stihl MS 170 came out at
 * $130-$185 when a NEW one is about $200. At a 40% buy rate that is not a
 * small error, it is lending new-retail money on a used saw.
 *
 * With the row gone the desk falls back to its own typical figure and says
 * so in orange: "Estimate - nothing looked up yet." That is worth more than
 * a precise-looking wrong number, and the local buttons on those aisles now
 * go somewhere that actually sells the thing.
 *
 * Both readers are edited: prices.json (what the site serves) and the
 * fallback copy of the same rows inside app.js.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const GO   = args.includes("--go");
const ONLY = args.filter(a => !a.startsWith("--"));

const app = readFileSync(join(ROOT, "app.js"), "utf8");
const i = app.indexOf("const EBAY_CANNOT_ITEM={"), j = app.indexOf("\n};", i);
if (i < 0 || j < 0) { console.error("could not find the blind list in app.js"); process.exit(2); }
const blind = new Set([...app.slice(i, j).matchAll(/^\s*([a-z]\d+):"/gm)].map(m => m[1]));

const ASKING = /asking prices? *- *no sold data|listings, asking/i;
const doomed = (r) => blind.has(r[1]) && ASKING.test(String(r[8] || ""))
                      && (!ONLY.length || ONLY.includes(r[1]));

const book = JSON.parse(readFileSync(join(ROOT, "prices.json"), "utf8"));
const hit = book.rows.filter(doomed);

console.log(`  blind aisles: ${[...blind].sort().join(" ")}`);
console.log(`  ${hit.length} of ${book.rows.length} rows quote a price on an aisle the desk says it cannot price\n`);
for (const r of hit)
  console.log(`  ${r[1].padEnd(4)} ${String(r[2]).padEnd(36)} $${r[3]}-$${r[4]}   ${String(r[8]).slice(0, 38)}`);

if (!hit.length) { console.log("\n  nothing to do."); process.exit(0); }
if (!GO) { console.log("\n  dry run. Add --go to take them out."); process.exit(0); }

/* prices.json */
const ids = new Set(hit.map(r => r[0]));
book.rows = book.rows.filter(r => !ids.has(r[0]));
writeFileSync(join(ROOT, "prices.json"), JSON.stringify(book) + "\n");

/* the same rows inside app.js, matched on the row id at the front of each
   line so nothing else that happens to share a name is touched */
let out = app, gone = 0;
for (const id of ids) {
  const re = new RegExp('^ *\\["' + id + '","[^\\n]*\\],?\\n', "m");
  if (re.test(out)) { out = out.replace(re, ""); gone++; }
}
writeFileSync(join(ROOT, "app.js"), out);
console.log(`\n  removed ${ids.size} from prices.json and ${gone} from app.js`);
if (gone !== ids.size) console.log("  NOTE: app.js and prices.json did not hold the same rows - check by hand.");
