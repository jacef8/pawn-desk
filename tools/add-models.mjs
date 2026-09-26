#!/usr/bin/env node
/* Write new makes and models onto the harvest's list.
 *
 *   node tools/add-models.mjs h2 "Vortex Diamondback HD 10x42" "Nikon Monarch 5"
 *   node tools/add-models.mjs --file batch.txt      # "ref<TAB>name" a line
 *   node tools/add-models.mjs --check               # what the list holds now
 *
 * WHY THIS EXISTS. The harvest cannot find anything. It walks
 * seed-models.json and stops, so once that list is priced a bigger
 * allowance buys nothing at all - the lever for growing what the desk
 * knows is the list itself, and the list is written by hand.
 *
 * Jace, 26 Sep: "make sure we are constantly adding electronics, outdoor
 * gear, sporting goods, hunting and fishing equipment, tools, antiques to
 * the new search list to build the database with those type of items."
 *
 * So this makes adding cheap and safe rather than a careful edit of a
 * 970-row JSON file:
 *
 *   - refuses a shelf the desk will not search, because a model added to
 *     the chainsaw aisle spends two lookups to measure a carburettor;
 *   - refuses a ref that is not a real shelf, so a typo cannot create a
 *     silent orphan nothing will ever read;
 *   - drops duplicates, case and spacing ignored;
 *   - keeps the file sorted by shelf so a diff is readable.
 *
 * WHAT MAKES A GOOD ROW. The name is a SEARCH, not a label. It has to be
 * what the thing is called where it sells - "Vortex Diamondback HD 10x42",
 * not "Vortex binoculars" - because a vague name returns a mixture and the
 * median of a mixture is the price of nothing. If a model number is how
 * people say it, use the model number.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEED = join(ROOT, "tools", "seed-models.json");
const argv = process.argv.slice(2);
const arg  = (f, d) => { const i = argv.indexOf("--" + f); return i >= 0 ? argv[i + 1] : d; };

const app = readFileSync(join(ROOT, "app.js"), "utf8");
const unesc = (t) => String(t).replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
/* A shelf is EITHER a catalog id (h2, t4, e7) or a price-book item, which
   is keyed by its own name - "Headphones \u2014 over-ear", "ATV winch". The
   seed list has always held both and a tool that knew only the first would
   have called 182 perfectly good shelves typos. */
const shelves = {};
[...app.matchAll(/\{id:"([a-z]\d+)",name:"([^"]+)"/g)].forEach((m) => (shelves[m[1]] = unesc(m[2])));
{
  const a = app.indexOf("const PRICEBOOK=["), b = app.indexOf("\n];", a);
  [...app.slice(a, b).matchAll(/\[\s*"([^"]+)"/g)].forEach((m) => {
    const n = unesc(m[1]); if (!shelves[n]) shelves[n] = "";
  });
}
const i = app.indexOf("const EBAY_CANNOT_ITEM={"), j = app.indexOf("\n};", i);
const blind = new Set([...app.slice(i, j).matchAll(/^\s*([a-z]\d+):"/gm)].map((m) => m[1]));
"g1 g2 g3 g4 g5 g6 g7 g8 g9 g10 r1 r2 r3".split(" ").forEach((r) => blind.add(r));

const seed = JSON.parse(readFileSync(SEED, "utf8"));
const norm = (t) => String(t).toLowerCase().replace(/\s+/g, " ").trim();
const have = new Set(seed.rows.map((r) => r.ref + "|" + norm(r.name)));

if (argv.includes("--check")) {
  const by = {};
  seed.rows.forEach((r) => (by[r.ref] = (by[r.ref] || 0) + 1));
  console.log("\n  " + seed.rows.length + " rows on the list\n");
  Object.keys(by).sort().forEach((r) => {
    const label = shelves[r] === "" ? r : (shelves[r] ? r.padEnd(6) + shelves[r] : r.padEnd(6) + "(not a shelf)");
    console.log("  " + String(by[r]).padStart(4) + "  " + label + (blind.has(r) ? "   [not searched]" : ""));
  });
  console.log("");
  process.exit(0);
}

/* ref + names, either from the command line or a two-column file */
let want = [];
const file = arg("file", "");
if (file) {
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const [ref, ...rest] = t.split(/\t|\s{2,}/);
    if (rest.length) want.push({ ref: ref.trim(), name: rest.join(" ").trim() });
  }
} else {
  const [ref, ...names] = argv.filter((a) => !a.startsWith("--"));
  if (!ref || !names.length) {
    console.error("\n  node tools/add-models.mjs <shelf> \"Name one\" \"Name two\"\n"
      + "  node tools/add-models.mjs --file batch.txt\n  node tools/add-models.mjs --check\n");
    process.exit(2);
  }
  want = names.map((n) => ({ ref, name: n }));
}

const added = [], skipped = [];
for (const w of want) {
  const ref = w.ref.trim(), name = w.name.replace(/\s+/g, " ").trim();
  if (shelves[ref] === undefined) { skipped.push([name, ref + " is not a shelf"]); continue; }
  if (blind.has(ref))       { skipped.push([name, ref + " is not searched — the results would be parts"]); continue; }
  if (name.length < 3)      { skipped.push([name, "too short to be a search"]); continue; }
  const k = ref + "|" + norm(name);
  if (have.has(k))          { skipped.push([name, "already on the list"]); continue; }
  have.add(k);
  added.push({ ref, name, alias: "" });
}

if (added.length) {
  seed.rows = seed.rows.concat(added);
  const order = Object.keys(shelves);
  seed.rows.sort((a, b) => (order.indexOf(a.ref) - order.indexOf(b.ref)) || a.name.localeCompare(b.name));
  writeFileSync(SEED, JSON.stringify(seed, null, 1) + "\n");
}

console.log("\n  added " + added.length + ", skipped " + skipped.length
  + "  — the list now holds " + seed.rows.length + "\n");
added.forEach((a) => console.log("   + " + a.ref.padEnd(6) + a.name));
skipped.forEach(([n, why]) => console.log("   - " + n + "   (" + why + ")"));
console.log("\n  These are never-priced rows, so they run AFTER everything due a\n"
  + "  re-check. Dry-run the harvest to see where they land.\n");
