#!/usr/bin/env node
/* Which shelves the desk hardly knows anything about.
 *
 *   node tools/gaps.mjs           # the thin shelves, worst first
 *   node tools/gaps.mjs --all     # every shelf
 *
 * WHY. Jace, 26 Sep: "with what's left over of the quota, start finding new
 * items based off of logical pawn shop type items that aren't currently in
 * the data set."
 *
 * The harvest cannot find anything. It walks a list of 970 makes and models
 * that were written by hand, and when that list is exhausted it stops - a
 * bigger allowance buys nothing. The lever for growing what the desk knows
 * is the LIST, and the question is where to spend the effort on it.
 *
 * This is that answer, and it needs no lookups: every shelf in the catalog,
 * ranked by how few models the desk can name for it. A shelf the counter
 * sees every week with two models on file is worth ten minutes of writing
 * down the makes that actually come through the door; a shelf with thirty
 * is not.
 *
 * It says nothing about whether a shelf is WORTH knowing - that is the
 * counter's call, and it is why this prints a list to read rather than
 * making the decision itself.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ALL = process.argv.includes("--all");

const app = readFileSync(join(ROOT, "app.js"), "utf8");

/* the catalog: every shelf the counter can pick, with its name */
const unesc = (t) => String(t).replace(/\\u([0-9a-fA-F]{4})/g,
  (_, h) => String.fromCharCode(parseInt(h, 16)));
const items = [...app.matchAll(/\{id:"([a-z]\d+)",name:"([^"]+)"/g)]
  .map((m) => ({ ref: m[1], name: unesc(m[2]) }));

/* the shelves the desk refuses to search - a thin one there is not a gap,
   it is a decision, and adding models would only spend lookups on parts */
const i = app.indexOf("const EBAY_CANNOT_ITEM={"), j = app.indexOf("\n};", i);
const blind = new Set([...app.slice(i, j).matchAll(/^\s*([a-z]\d+):"/gm)].map((m) => m[1]));
const catBlind = /rolling:"/.test(app.slice(app.indexOf("const EBAY_CANNOT={"))) ? ["r", "g"] : [];

const seed = JSON.parse(readFileSync(join(ROOT, "tools", "seed-models.json"), "utf8")).rows;
const byRef = {};
seed.forEach((t) => (byRef[t.ref] = (byRef[t.ref] || 0) + 1));

let found = {};
try { found = JSON.parse(readFileSync(join(ROOT, "tools", "harvest.json"), "utf8")).found || {}; } catch (e) {}
const pricedFor = (ref) => Object.keys(found).filter((k) => k.split("|")[0] === ref).length;

const rows = items
  .filter((it) => !blind.has(it.ref) && !catBlind.includes(it.ref.charAt(0)))
  .map((it) => ({ ...it, models: byRef[it.ref] || 0, priced: pricedFor(it.ref) }))
  .sort((a, b) => a.models - b.models || a.priced - b.priced);

const show = ALL ? rows : rows.filter((r) => r.models < 6);

console.log("\n  WHERE THE DESK IS THIN\n");
console.log("  The harvest can only price what is already on the list. These are the");
console.log("  shelves with the fewest models written down, so they are where writing");
console.log("  a few more names buys the most.\n");
console.log("  models  priced  shelf");
console.log("  " + "-".repeat(58));
for (const r of show)
  console.log("  " + String(r.models).padStart(6) + String(r.priced).padStart(8) + "  "
    + r.ref.padEnd(5) + r.name);

const none = rows.filter((r) => r.models === 0);
console.log("\n  " + show.length + " shelves shown of " + rows.length + " the desk will search");
if (none.length) console.log("  " + none.length + " have no models at all: "
  + none.map((r) => r.name).join(", "));
console.log("\n  Blind shelves are left out — a thin one there is a decision, not a gap.\n");
