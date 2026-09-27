/* THE BUNDLE MUST NOT INVENT BUGS.
   The first review came back with "ITEM_OVERRIDES is declared twice, which
   is a SyntaxError that halts execution". app.js declares it once and the
   app runs. What happened is that this extractor used a lazy `[\s\S]*?\n\};`
   to find the end of a const block, and SPEC_CHOICES contains a line that
   ends `\n};` before its own end - so that grab ran on past its block and
   swallowed ITEM_OVERRIDES a second time. The reviewer reported a fault in
   my packaging as a fault in the code, and was right to.

   Brace-counting from the opening brace now, so a block ends where it
   actually ends. Every extract is checked for balance before it is written,
   and the whole bundle is parsed as JavaScript at the end: if the bundle
   does not parse, it does not ship.

     node tools/make-review-bundle.mjs */
import {readFileSync, writeFileSync, mkdirSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "app.js"), "utf8");

/* From the first brace/bracket after `start`, walk forward counting depth,
   skipping strings, template literals, regexes and comments. Returns the
   whole declaration including its terminator. */
function block(startIdx) {
  let i = src.indexOf("{", startIdx);
  const sq = src.indexOf("[", startIdx);
  if (sq >= 0 && (i < 0 || sq < i)) i = sq;
  if (i < 0) return null;
  let depth = 0, inS = null, esc = false, line = false, blk = false;
  for (let k = i; k < src.length; k++) {
    const c = src[k], n = src[k + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (blk) { if (c === "*" && n === "/") { blk = false; k++; } continue; }
    if (inS) {
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (c === inS) inS = null;
      continue;
    }
    if (c === "/" && n === "/") { line = true; k++; continue; }
    if (c === "/" && n === "*") { blk = true; k++; continue; }
    if (c === '"' || c === "'" || c === "`") { inS = c; continue; }
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0) {
        let end = k + 1;
        if (src[end] === ";") end++;
        return src.slice(startIdx, end);
      }
    }
  }
  return null;
}
function grab(name, needle) {
  const at = src.indexOf(needle);
  if (at < 0) { console.error("MISS " + name); return ""; }
  const text = block(at);
  if (!text) { console.error("UNBALANCED " + name); return ""; }
  return "\n/* ===== " + name + " (app.js) ===== */\n" + text + "\n";
}

const WANT = [
  ["CATALOG — the aisles and their items", "const CATALOG = ["],
  ["ITEM_OVERRIDES — per-item makes, tiers, detail hints", "const ITEM_OVERRIDES={"],
  ["BRANDBOOK — makes per aisle", "const BRANDBOOK={"],
  ["SPEC_CHOICES — the spec questions", "const SPEC_CHOICES={"],
  ["askQueue — the question run", "function askQueue"],
  ["calcItem — the offer arithmetic", "function calcItem()"],
  ["omniParse — reading the typed words", "function omniParse"],
  ["omniRows — the suggestion list", "function omniRows"],
  ["omniPick — what happens when a suggestion is picked", "function omniPick"],
  ["mpFor — matching typed words to a priced row", "function mpFor"],
  ["marketNow — which measured price is in play", "function marketNow"],
  ["compQuery — the words a lookup actually searches", "function compQuery"],
  ["itemFromBrand — the make names the item", "function itemFromBrand"],
  ["sameMaker — a maker and its product lines", "function sameMaker"],
  ["itemGuard — how firm an item price is", "function itemGuard"],
  ["metalGuard — the metals risk guard", "function metalGuard"],
  ["metalTrend — the metals trend read", "function metalTrend"],
  ["suggestPay — the suggested rate", "function suggestPay"],
  ["findPasses — the lookup source ladder", "function findPasses"],
  ["priceFind — running a lookup", "async function priceFind"],
  ["itemsByUse — ordering by what came in", "function itemsByUse"],
  ["catsByUse — the same for aisles", "function catsByUse"],
];
let out = "";
for (const [name, needle] of WANT) out += grab(name, needle);

/* nothing may appear twice */
const dupes = [];
for (const [name, needle] of WANT) {
  const key = needle.replace(/^(async )?function /, "").replace(/[(={[].*$/, "").trim();
  const re = new RegExp("(?:^|\\n)(?:const |function |async function )" + key + "\\b", "g");
  const n = (out.match(re) || []).length;
  if (n > 1) dupes.push(key + " ×" + n);
}
if (dupes.length) { console.error("DUPLICATED, refusing to write: " + dupes.join(", ")); process.exit(1); }

/* and the whole thing has to be valid JavaScript */
try { new Function(out); }
catch (e) { console.error("bundle does not parse: " + e.message); process.exit(1); }

mkdirSync(join(ROOT, "review"), {recursive: true});
writeFileSync(join(ROOT, "review/core-code.js"), out);
const prompt = readFileSync(join(ROOT, "review/REVIEW-PROMPT.md"), "utf8");
writeFileSync(join(ROOT, "review/PASTE-THIS.md"),
  prompt + "\n\n```javascript\n" + out + "\n```\n");
console.log(`wrote review/core-code.js — ${WANT.length} sections, ${out.split("\n").length} lines, no duplicates, parses clean`);
