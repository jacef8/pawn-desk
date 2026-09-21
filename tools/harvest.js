#!/usr/bin/env node
/* Build the model price list out, one make and model at a time.
 *
 * The desk ships with about 180 model rows. A pawn shop sees thousands of
 * things, and waiting for each one to walk in before it has a number is not
 * a dataset, it is a diary. This walks a list of targets - makes and models
 * written down in tools/seed-models.json - runs the SAME searches the green
 * button runs, and writes what it finds into prices.json, which the app
 * refetches on every load. Nothing in app.js changes; the list just grows.
 *
 *   PAWN_SERVER=https://pawn-desk-production.up.railway.app \
 *   PAWN_TOKEN=your-token \
 *   node tools/harvest.js --limit 5             # dry run, prints the plan
 *   node tools/harvest.js --limit 5 --go        # spends money
 *   node tools/harvest.js --ref p1 --go         # only chainsaws
 *   node tools/harvest.js --merge               # write findings into prices.json
 *
 * Flags:
 *   --go         really run the searches (without it nothing is spent)
 *   --limit N    only the first N targets still outstanding
 *   --ref ID     only targets for one catalog item (p1, t1, e4 ...)
 *   --only WORD  only targets whose name contains WORD
 *   --seed FILE  a different target list
 *   --out FILE   where findings are kept (default tools/harvest.json)
 *   --merge      merge findings into prices.json (no searching, no spending)
 *   --min N      merge only rows built on at least N listings (default 4)
 *
 * Progress is written after every target, so a run that is stopped or dies
 * picks up where it left off and never pays for the same search twice.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n);
  return i < 0 ? d : (process.argv[i + 1] || "").startsWith("--") ? true : process.argv[i + 1]; };
const has = (n) => process.argv.includes("--" + n);

const SERVER = (process.env.PAWN_SERVER || "").replace(/\/+$/, "");
const TOKEN  = process.env.PAWN_TOKEN || "";
const GO     = has("go");
const OUT    = arg("out",  join(HERE, "harvest.json"));
const SEED   = arg("seed", join(HERE, "seed-models.json"));
const PRICES = join(ROOT, "prices.json");
const MIN    = Number(arg("min", 4));

const money = (n) => "$" + Math.round(n).toLocaleString();
const today = () => new Date().toISOString().slice(0, 10);
const pct = (a, f) => a[Math.min(a.length - 1, Math.max(0, Math.round(f * (a.length - 1))))];

/* ---- findings so far ---- */
let found = {};
if (existsSync(OUT)) { try { found = JSON.parse(readFileSync(OUT, "utf8")).found || {}; } catch (e) {} }
const save = () => writeFileSync(OUT,
  JSON.stringify({ updated: new Date().toISOString(), found }, null, 1));

/* ================= merge: findings -> prices.json ================= */
if (has("merge")) {
  const pj = JSON.parse(readFileSync(PRICES, "utf8"));
  const rows = pj.rows.slice();
  const byName = new Map(rows.map((r, i) => [String(r[1]) + "|" + String(r[2]).toLowerCase(), i]));
  let added = 0, updated = 0, skipped = 0;
  let n = 0;
  const nextId = () => { let id; do { id = "h" + (++n); } while (rows.some(r => r[0] === id)); return id; };
  for (const [key, f] of Object.entries(found)) {
    if (!f || !f.n || f.n < MIN || !(f.lo > 0) || !(f.hi >= f.lo)) { skipped++; continue; }
    const row = [f.id || nextId(), f.ref, f.name, Math.round(f.lo), Math.round(f.hi),
                 f.conf, f.date, f.src || "https://www.ebay.com", f.note, f.alias || ""];
    const at = byName.get(f.ref + "|" + f.name.toLowerCase());
    if (at == null) { row[0] = nextId(); rows.push(row); byName.set(f.ref + "|" + f.name.toLowerCase(), rows.length - 1); added++; }
    else { row[0] = rows[at][0]; rows[at] = row; updated++; }
  }
  /* the app refuses a file it cannot trust, so check it here rather than
     finding out as a silent fallback on the counter's phone */
  const bad = rows.filter(r => !(Array.isArray(r) && r.length >= 9 && typeof r[0] === "string"
    && typeof r[2] === "string" && typeof r[3] === "number" && typeof r[4] === "number"
    && r[3] > 0 && r[4] >= r[3] && r[4] < 1000000));
  if (bad.length) { console.error("  " + bad.length + " row(s) the app would reject - nothing written."); process.exit(1); }
  copyFileSync(PRICES, PRICES + ".bak");
  writeFileSync(PRICES, JSON.stringify({ updated: today(),
    note: pj.note, rows }, null, 0));
  console.log(`\n  ${added} added, ${updated} updated, ${skipped} skipped (under ${MIN} listings).`);
  console.log(`  prices.json now carries ${rows.length} rows. The old one is at prices.json.bak.\n`);
  process.exit(0);
}

/* ================= harvest ================= */
const seed = JSON.parse(readFileSync(SEED, "utf8"));
let targets = seed.rows.slice();
const ref = arg("ref", ""), only = arg("only", ""), limit = Number(arg("limit", 0));
if (typeof ref  === "string" && ref)  targets = targets.filter(t => t.ref === ref);
if (typeof only === "string" && only) targets = targets.filter(t => t.name.toLowerCase().includes(only.toLowerCase()));
const key = (t) => t.ref + "|" + t.name;
let todo = targets.filter(t => !found[key(t)]);
if (limit > 0) todo = todo.slice(0, limit);

const PASSES = [
  { where: "eBay",     say: "completed, sold eBay listings - the price it actually went for, not what it was listed at" },
  { where: "Shopping", say: "used-condition listings currently for sale on Google Shopping and the marketplaces" },
];
const prompt = (q, p) =>
  'Find what a used "' + q + '" sells for in the United States. Search ' + p.say + '. ' +
  'List the individual listings you find, up to 12. Reply with JSON and nothing else: ' +
  '{"comps":[{"price":<number, one listing\'s price>,"what":"<the item in a few words>",' +
  '"where":"<site>","basis":"sold" or "asking"}]}. ' +
  'Only listings for the same thing - not parts, not accessories, not multi-item lots. ' +
  'If you find none, reply {"comps":[]}.';

async function ask(text) {
  const r = await fetch(SERVER + "/json", { method: "POST",
    headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
    body: JSON.stringify({ prompt: text, search: true }) });
  if (!r.ok) throw new Error("service answered " + r.status);
  const j = await r.json();
  if (!j.ok) throw new Error(j.code || "service said no");
  return ((j.data && j.data.comps) || []).filter(c => c && Number(c.price) > 0);
}

console.log("");
console.log("  Targets in the list      : " + targets.length);
console.log("  Already harvested        : " + (targets.length - targets.filter(t => !found[key(t)]).length));
console.log("  This run                 : " + todo.length);
console.log("  Searches                 : up to " + todo.length * 2 + "  (a second only when the first is thin)");
console.log("  Rough cost               : about $" + (todo.length * 2 * 0.02).toFixed(2) +
            " against your Anthropic balance, worst case");
console.log("");
if (!GO) {
  console.log("  Dry run. Nothing was searched and nothing was spent.");
  console.log("  Add --go to run it.\n");
  todo.slice(0, 12).forEach(t => console.log("    " + t.ref + "  " + t.name));
  if (todo.length > 12) console.log("    ... and " + (todo.length - 12) + " more");
  console.log("");
  process.exit(0);
}
if (!SERVER || !TOKEN) { console.error("  Set PAWN_SERVER and PAWN_TOKEN first.\n"); process.exit(2); }

let hit = 0, miss = 0;
for (let i = 0; i < todo.length; i++) {
  const t = todo[i];
  const tag = `[${i + 1}/${todo.length}] ${t.name}`;
  let comps = [];
  for (const p of PASSES) {
    try { comps = comps.concat(await ask(prompt(t.name, p))); }
    catch (e) { console.log(`  ${tag} - ${p.where} failed: ${e.message}`); }
    if (comps.length >= 8) break;            /* enough to stand on */
  }
  const seen = new Set();
  const uniq = comps.filter(c => { const k = Math.round(c.price) + "|" + String(c.where || "").toLowerCase();
    if (seen.has(k)) return false; seen.add(k); return true; });
  const ps = uniq.map(c => Math.round(Number(c.price))).filter(n => n > 0).sort((a, b) => a - b);
  if (ps.length < 3) {
    found[key(t)] = { ref: t.ref, name: t.name, n: ps.length, date: today(), note: "no usable listings" };
    miss++; save();
    console.log(`  ${tag} - nothing usable`);
    continue;
  }
  const sold = uniq.filter(c => c.basis === "sold").length;
  const share = sold / ps.length;
  found[key(t)] = {
    ref: t.ref, name: t.name, alias: t.alias || "",
    n: ps.length, sold,
    lo: pct(ps, 0.25), hi: pct(ps, 0.75), med: pct(ps, 0.5),
    conf: (ps.length >= 6 && share >= 0.6) ? "h" : (ps.length >= 4 ? "m" : "l"),
    date: today(),
    src: "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(t.name) + "&LH_Sold=1&LH_Complete=1",
    note: `${ps.length} listings, ${sold} sold${share < 0.5 ? " - mostly asks" : ""}`,
  };
  hit++; save();
  const f = found[key(t)];
  console.log(`  ${tag} - ${money(f.lo)}-${money(f.hi)}  (${f.n} listings, ${f.sold} sold, ${f.conf})`);
}
console.log(`\n  ${hit} priced, ${miss} with nothing usable. Findings in ${OUT}.`);
console.log(`  Review them, then: node tools/harvest.js --merge\n`);
