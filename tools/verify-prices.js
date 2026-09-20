#!/usr/bin/env node
/* Check every price in the desk against what the thing actually sells for.
 *
 * This runs the SAME two searches the green "Look up what it sells for used"
 * button runs, against the shop's own service - which has the key, and has
 * the open internet. It is the instrument for this job; a sandbox that cannot
 * reach eBay is not.
 *
 *   PAWN_SERVER=https://pawn-desk-production.up.railway.app \
 *   PAWN_TOKEN=your-token \
 *   node tools/verify-prices.js --limit 10        # dry run, prints the plan
 *   node tools/verify-prices.js --limit 10 --go   # actually spends money
 *
 * Flags:
 *   --go            really run the searches (without it, nothing is spent)
 *   --limit N       only the first N rows
 *   --only WORD     only rows whose name contains WORD (e.g. --only grill)
 *   --cat ID        only one category (appl, fit, coll, tools, ...)
 *   --out FILE      where the report goes (default tools/price-check.json)
 *
 * It never writes to app.js. It prints what is off and by how much, and you
 * decide. Progress is saved after every row, so a run that dies or is stopped
 * picks up where it left off instead of paying twice.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const arg = (name, dflt) => { const i = process.argv.indexOf("--" + name);
  return i < 0 ? dflt : (process.argv[i + 1] || "").startsWith("--") ? true : process.argv[i + 1]; };
const has = (name) => process.argv.includes("--" + name);

const SERVER = (process.env.PAWN_SERVER || "").replace(/\/+$/, "");
const TOKEN  = process.env.PAWN_TOKEN || "";
const GO     = has("go");
const OUT    = arg("out", join(HERE, "price-check.json"));

/* ---- read the lists straight out of app.js -------------------------------
   Both are plain array literals of strings and numbers, so they can be read
   without running the page. Nothing else in app.js is touched. */
function literal(src, decl) {
  const i = src.indexOf(decl);
  if (i < 0) throw new Error("could not find " + decl + " in app.js");
  let d = 0, j = src.indexOf("[", i);
  for (let k = j; k < src.length; k++) {
    if (src[k] === "[") d++;
    else if (src[k] === "]" && --d === 0) return new Function("return " + src.slice(j, k + 1))();
  }
  throw new Error("unterminated " + decl);
}
const APP = readFileSync(join(ROOT, "app.js"), "utf8");
const CATALOG   = literal(APP, "const CATALOG = [");
const PRICEBOOK = literal(APP, "const PRICEBOOK=[");

/* Every priced thing, from both lists, in one shape. */
let rows = [];
CATALOG.forEach(c => c.items.forEach(it =>
  rows.push({ id: it.id, name: it.name, cat: c.id, catLabel: c.label, book: it.value, from: "catalog" })));
PRICEBOOK.forEach(([name, value, cat]) => {
  const c = CATALOG.find(x => x.id === cat);
  rows.push({ id: name, name, cat, catLabel: c ? c.label : cat, book: value, from: "price book" });
});

const only = arg("only", ""), cat = arg("cat", ""), limit = Number(arg("limit", 0));
if (typeof only === "string" && only) rows = rows.filter(r => r.name.toLowerCase().includes(only.toLowerCase()));
if (typeof cat  === "string" && cat)  rows = rows.filter(r => r.cat === cat);
if (limit > 0) rows = rows.slice(0, limit);

/* ---- resume ---- */
let done = {};
if (existsSync(OUT)) { try { done = JSON.parse(readFileSync(OUT, "utf8")).results || {}; } catch (e) {} }
const todo = rows.filter(r => !done[r.id]);

/* ---- the same passes the button runs ---- */
const passes = (cat) => cat === "guns" ? [
  { name: "GunWatcher", where: "GunWatcher",
    say: "gunwatcher.com, which publishes sold prices gathered from completed GunBroker auctions - use its sold or average sold figures, not asking prices" },
  { name: "GunBroker, asking", where: "GunBroker",
    say: "current GunBroker listings, which are asking prices rather than sales - mark every one of these \"asking\"" },
] : [
  { name: "eBay sold", where: "eBay",
    say: "completed, sold eBay listings - the price it actually went for, not what it was listed at" },
  { name: "Shopping, used", where: "Shopping",
    say: "used-condition listings currently for sale on Google Shopping and the marketplaces" },
];
const prompt = (q, pass) =>
  'Find what a used "' + q + '" sells for in the United States. Search ' + pass.say + '. ' +
  'List the individual listings you find, up to 12. Reply with JSON and nothing else: ' +
  '{"comps":[{"price":<number, one listing\'s price>,"what":"<the item in a few words>",' +
  '"where":"<site>","basis":"sold" or "asking"}]}. ' +
  'Only listings for the same thing - not parts, not accessories, not multi-item lots. ' +
  'If you find none, reply {"comps":[]}.';

const median = (a) => { const s = a.slice().sort((x, y) => x - y); const m = s.length >> 1;
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const money = (n) => "$" + Math.round(n).toLocaleString();

async function ask(text) {
  const r = await fetch(SERVER + "/json", {
    method: "POST",
    headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
    body: JSON.stringify({ prompt: text, search: true }),
  });
  if (!r.ok) throw new Error("service answered " + r.status);
  const j = await r.json();
  if (!j.ok) throw new Error(j.code || "service said no");
  return ((j.data && j.data.comps) || []).filter(c => c && Number(c.price) > 0);
}

/* ---- the plan, before anything is spent ---- */
console.log("");
console.log("  Rows in the lists        : " + rows.length);
console.log("  Already checked          : " + (rows.length - todo.length));
console.log("  To check this run        : " + todo.length);
console.log("  Searches                 : " + todo.length * 2 + "  (two per row)");
console.log("  Rough cost               : a few cents each, so about $" +
            (todo.length * 2 * 0.02).toFixed(2) + " against your Anthropic balance");
console.log("  Service                  : " + (SERVER || "(PAWN_SERVER not set)"));
console.log("  Report                   : " + OUT);
console.log("");
if (!SERVER || !TOKEN) { console.log("  Set PAWN_SERVER and PAWN_TOKEN first. Nothing run.\n"); process.exit(1); }
if (!GO) { console.log("  Dry run. Add --go to actually search.\n"); process.exit(0); }
if (!todo.length) { console.log("  Nothing left to check. Delete " + OUT + " to start over.\n"); process.exit(0); }

/* ---- run, three at a time, saving as it goes ---- */
const save = () => writeFileSync(OUT, JSON.stringify({ ran: new Date().toISOString(), results: done }, null, 1));
let n = 0;
async function one(r) {
  const tag = (++n) + "/" + todo.length;
  try {
    const out = await Promise.allSettled(passes(r.cat).map(p => ask(prompt(r.name, p))));
    const got = [];
    out.forEach((x, i) => { if (x.status === "fulfilled")
      x.value.forEach(c => got.push({ price: Math.round(c.price), where: c.where || passes(r.cat)[i].where, basis: c.basis || "" })); });
    const seen = {}, uniq = got.filter(c => { const k = c.price + "|" + String(c.where).toLowerCase();
      return seen[k] ? false : (seen[k] = 1); });
    if (!uniq.length) { done[r.id] = { ...r, found: 0, note: "nothing found" };
      console.log(`  ${tag}  ${r.name.padEnd(34).slice(0,34)} book ${money(r.book).padStart(7)}   nothing found`); save(); return; }
    const prices = uniq.map(c => c.price), med = median(prices);
    const sold = uniq.filter(c => /sold/i.test(c.basis)).length;
    const ratio = med / r.book;
    done[r.id] = { ...r, found: uniq.length, sold, med, lo: Math.min(...prices), hi: Math.max(...prices),
                   ratio: Number(ratio.toFixed(2)), comps: uniq.slice(0, 12) };
    const flag = ratio > 1.4 ? "  <-- book LOW"  : ratio < 0.7 ? "  <-- book HIGH" : "";
    console.log(`  ${tag}  ${r.name.padEnd(34).slice(0,34)} book ${money(r.book).padStart(7)}   found ${money(med).padStart(7)}` +
                ` (${uniq.length} listings, ${sold} sold)  x${ratio.toFixed(2)}${flag}`);
  } catch (e) {
    done[r.id] = { ...r, error: String(e.message || e) };
    console.log(`  ${tag}  ${r.name.padEnd(34).slice(0,34)} FAILED: ${e.message || e}`);
  }
  save();
}
const queue = todo.slice();
await Promise.all([0,1,2].map(async () => { while (queue.length) await one(queue.shift()); }));

/* ---- what to do about it ---- */
const all = Object.values(done).filter(d => d.ratio);
const low  = all.filter(d => d.ratio > 1.4).sort((a,b) => b.ratio - a.ratio);
const high = all.filter(d => d.ratio < 0.7).sort((a,b) => a.ratio - b.ratio);
console.log("\n  ---- rows worth moving ----\n");
if (low.length)  { console.log("  The book is LOW here (you are lending less than you could):");
  low.forEach(d => console.log(`    ${d.name.padEnd(34).slice(0,34)} ${money(d.book).padStart(7)} -> about ${money(d.med)}   (${d.found} listings, ${d.sold} sold)`)); console.log(""); }
if (high.length) { console.log("  The book is HIGH here (you are over-lending):");
  high.forEach(d => console.log(`    ${d.name.padEnd(34).slice(0,34)} ${money(d.book).padStart(7)} -> about ${money(d.med)}   (${d.found} listings, ${d.sold} sold)`)); console.log(""); }
if (!low.length && !high.length) console.log("  Nothing off by more than a third. The book holds.\n");
console.log("  A row with few listings, or none marked sold, is weak evidence - look");
console.log("  at it yourself before moving it. Full detail: " + OUT + "\n");
