#!/usr/bin/env node
/* Build the model price list out, one make and model at a time.
 *
 * The desk ships with about 180 model rows. A pawn shop sees thousands of
 * things, and waiting for each one to walk in before it has a number is not
 * a dataset, it is a diary. This walks a list of targets - makes and models
 * written down in tools/seed-models.json - prices each one, and writes what
 * it finds into prices.json, which the app refetches on every load. Nothing
 * in app.js changes; the list just grows.
 *
 * WHERE THE NUMBERS COME FROM. This used to ask the model to go and search
 * the web, which meant the answers were built out of ASKING prices: the
 * overpriced listing that sat for six months is still in the index, the one
 * that sold in a day is gone. A price book built that way reads high, and
 * high is the wrong direction to be wrong in when you are lending against it.
 *
 * So it now goes to eBay's own API through the service (--via ebay, the
 * default), which can return what things actually SOLD for. Every finding
 * records its basis - "sold" or "asking" - and a row built on asks is graded
 * down and labelled, so nothing pretends to be a receipt that is not one.
 * eBay's API costs nothing, so a run over the whole seed list is free.
 *
 *   PAWN_SERVER=https://pawn-desk-production.up.railway.app \
 *   PAWN_TOKEN=your-token \
 *   node tools/harvest.js --limit 5             # dry run, prints the plan
 *   node tools/harvest.js --limit 5 --go        # really runs it
 *   node tools/harvest.js --ref p1 --go         # only chainsaws
 *   node tools/harvest.js --merge               # write findings into prices.json
 *
 * Flags:
 *   --go         really run the lookups (without it nothing is fetched)
 *   --via WHICH  ebay (default, free, can return sold prices) or claude
 *                (the old web-search path - asking prices, spends balance)
 *   --sold-only  drop any finding not built on sold prices
 *   --limit N    only the first N targets still outstanding
 *   --ref ID     only targets for one catalog item (p1, t1, e4 ...)
 *   --only WORD  only targets whose name contains WORD
 *   --seed FILE  a different target list
 *   --out FILE   where findings are kept (default tools/harvest.json)
 *   --merge      merge findings into prices.json (no searching, no spending)
 *   --min N      merge only rows built on at least N listings (default 4)
 *   --wild       merge rows the sanity band flagged too (see below)
 *
 * The sanity band: a harvested price is compared against what the catalog
 * says that kind of thing is worth. A search that came back with parts, a
 * lot, or the wrong model usually lands far outside it - a $12 chainsaw or a
 * $4,000 drill - and at 600 rows nobody reads every line. Anything past 4x or
 * under a quarter is marked wild, kept in the findings, and left out of the
 * merge unless you ask for it.
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
const VIA    = String(arg("via", "ebay")).toLowerCase();
const SOLD_ONLY = has("sold-only");
const OUT    = arg("out",  join(HERE, "harvest.json"));
const SEED   = arg("seed", join(HERE, "seed-models.json"));
const PRICES = join(ROOT, "prices.json");
const MIN    = Number(arg("min", 4));
const WILD_HI = 4, WILD_LO = 0.25;

/* What the catalog reckons this kind of thing is worth, read straight out of
   app.js - the same trick tools/verify-prices.js uses. It is the only sense
   of scale available without a human reading every row. */
function literal(src, decl) {
  const i = src.indexOf(decl);
  if (i < 0) throw new Error("could not find " + decl + " in app.js");
  let d = 0; const j = src.indexOf("[", i);
  for (let k = j; k < src.length; k++) {
    if (src[k] === "[") d++;
    else if (src[k] === "]" && --d === 0) return new Function("return " + src.slice(j, k + 1))();
  }
  throw new Error("unterminated " + decl);
}
const BOOK = (() => {
  const out = {};
  try {
    const APP = readFileSync(join(ROOT, "app.js"), "utf8");
    literal(APP, "const CATALOG = [").forEach(c => c.items.forEach(it => { out[it.id] = it.value; }));
  } catch (e) { console.error("  (could not read the catalog: " + e.message + " - the sanity band is off)"); }
  return out;
})();
const wildness = (ref, med) => {
  const b = BOOK[ref];
  if (!b || !med) return null;
  const ratio = med / b;
  return { book: b, ratio: Math.round(ratio * 100) / 100, wild: ratio > WILD_HI || ratio < WILD_LO };
};

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
  let added = 0, updated = 0, skipped = 0, wild = 0, asks = 0; const touched = [];
  let n = 0;
  const nextId = () => { let id; do { id = "h" + (++n); } while (rows.some(r => r[0] === id)); return id; };
  for (const [key, f] of Object.entries(found)) {
    if (!f || !f.n || f.n < MIN || !(f.lo > 0) || !(f.hi >= f.lo)) { skipped++; continue; }
    if (f.wild && !has("wild")) { wild++; continue; }
    if (SOLD_ONLY && f.basis !== "sold") { asks++; continue; }
    const row = [f.id || nextId(), f.ref, f.name, Math.round(f.lo), Math.round(f.hi),
                 f.conf, f.date, f.src || "https://www.ebay.com", f.note, f.alias || ""];
    const at = byName.get(f.ref + "|" + f.name.toLowerCase());
    if (at == null) { row[0] = nextId(); rows.push(row); byName.set(f.ref + "|" + f.name.toLowerCase(), rows.length - 1); added++; }
    else {
      /* Keep the id: the hand-written patterns in app.js point at it, and a
         new id would quietly orphan them. Say which rows were rewritten -
         some of them were checked by a person against a better source than
         a marketplace search. */
      row[0] = rows[at][0];
      touched.push(`${rows[at][2]}  ${rows[at][3]}-${rows[at][4]} -> ${row[3]}-${row[4]}`);
      rows[at] = row; updated++;
    }
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
  console.log(`\n  ${added} added, ${updated} updated, ${skipped} skipped (under ${MIN} listings)` +
    (wild ? `, ${wild} held back as wild (--wild merges them)` : "") +
    (asks ? `, ${asks} held back as asking-price only` : "") + ".");
  if (touched.length) {
    console.log("\n  Rewritten (these had a price already):");
    touched.slice(0, 20).forEach(t => console.log("    " + t));
    if (touched.length > 20) console.log("    ... and " + (touched.length - 20) + " more");
  }
  console.log(`\n  prices.json now carries ${rows.length} rows. The old one is at prices.json.bak.\n`);
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

/* ---------- where a target's comps come from ---------- */

/* eBay, through the service. Free, and the only one of the two that can hand
   back what something sold for. Two queries: the model as written, then the
   model with the parenthetical trimmed off, because "DW735 (13in planer)"
   finds less on eBay than "DW735" does. The second only runs when the first
   came back thin. */
const trim = (n) => String(n).replace(/\s*[\(\[].*$/, "").replace(/\s*[\u2014\u2013-]\s.*$/, "").trim();

async function viaEbay(t) {
  const tries = [t.name];
  const short = trim(t.name);
  if (short && short.toLowerCase() !== t.name.toLowerCase()) tries.push(short);

  let comps = [], basis = "", warned = "";
  for (const q of tries) {
    let j;
    const r = await fetch(SERVER + "/ebay", { method: "POST",
      headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
      body: JSON.stringify({ q, limit: 40 }) });
    try { j = await r.json(); } catch (e) { j = null; }
    if (!r.ok || !j || !j.ok) throw new Error((j && j.code) || ("service answered " + r.status));
    comps = comps.concat((j.comps || []).filter(c => c && Number(c.price) > 0));
    if (j.warning) warned = j.warning;
    /* "sold" wins: once one query came back with real sales, the finding is
       a sold finding even if the second query only had asks in it. */
    if (j.basis === "sold") basis = "sold"; else if (!basis) basis = j.basis || "asking";
    if (comps.length >= 12) break;
  }
  return { comps, basis, warning: warned };
}

/* The old path: ask the model to go searching. Kept because it reaches
   things eBay does not carry - local-only goods, and anything too big to
   ship - but it is asking prices and it spends the balance, so it is no
   longer the default. */
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

async function viaClaude(t) {
  let comps = [];
  for (const p of PASSES) {
    try { comps = comps.concat(await ask(prompt(t.name, p))); }
    catch (e) { console.log(`  ${t.name} - ${p.where} failed: ${e.message}`); }
    if (comps.length >= 8) break;
  }
  /* Whatever it says about itself, a web search is asks unless a majority of
     what came back claims to be a sale. */
  const sold = comps.filter(c => c.basis === "sold").length;
  return { comps, basis: sold > comps.length / 2 ? "sold" : "asking", warning: "" };
}

if (VIA !== "ebay" && VIA !== "claude") {
  console.error("\n  --via takes ebay or claude.\n"); process.exit(2);
}
const gather = VIA === "ebay" ? viaEbay : viaClaude;

console.log("");
console.log("  Targets in the list      : " + targets.length);
console.log("  Already harvested        : " + (targets.length - targets.filter(t => !found[key(t)]).length));
console.log("  This run                 : " + todo.length);
console.log("  Source                   : " + (VIA === "ebay"
  ? "eBay API - sold prices where the keyset is granted them, asking prices otherwise"
  : "Claude web search - asking prices"));
console.log("  Lookups                  : up to " + todo.length * 2 + "  (a second only when the first is thin)");
console.log("  Rough cost               : " + (VIA === "ebay" ? "nothing - eBay's API is free"
  : "about $" + (todo.length * 2 * 0.02).toFixed(2) + " against your Anthropic balance, worst case"));
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

let hit = 0, miss = 0, said = false;
for (let i = 0; i < todo.length; i++) {
  const t = todo[i];
  const tag = `[${i + 1}/${todo.length}] ${t.name}`;
  let got;
  try { got = await gather(t); }
  catch (e) {
    console.log(`  ${tag} - lookup failed: ${e.message}`);
    /* A missing keyset or a bad token fails identically on every target.
       Stop rather than walk 600 of them into the same wall. */
    if (/no_ebay_key|bad_token|ebay_auth/.test(e.message)) {
      console.error(`\n  Stopping: ${e.message}. Set the eBay keyset on the service and try again.\n`);
      process.exit(2);
    }
    got = { comps: [], basis: "", warning: "" };
  }
  /* Say the bad news once, not six hundred times. */
  if (got.warning && !said) { said = true; console.log(`\n  ! ${got.warning}\n    Findings from this run are asking prices. They will be graded and labelled as such.\n`); }

  const seen = new Set();
  const uniq = got.comps.filter(c => { const k = Math.round(c.price) + "|" + String(c.where || "").toLowerCase() + "|" + String(c.what || "").slice(0, 40).toLowerCase();
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
  const basis = got.basis === "sold" && share >= 0.5 ? "sold" : "asking";
  const w = wildness(t.ref, pct(ps, 0.5));
  /* Asks read high - the ones that sold are the ones that left the index.
     A row built on asks can never be graded high, whatever its count. */
  const conf = basis !== "sold" ? (ps.length >= 6 ? "m" : "l")
    : (ps.length >= 6 && share >= 0.6) ? "h" : (ps.length >= 4 ? "m" : "l");
  found[key(t)] = {
    wild: !!(w && w.wild), ratio: w ? w.ratio : null, book: w ? w.book : null,
    ref: t.ref, name: t.name, alias: t.alias || "",
    n: ps.length, sold, basis, via: VIA,
    lo: pct(ps, 0.25), hi: pct(ps, 0.75), med: pct(ps, 0.5),
    conf,
    date: today(),
    src: "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(t.name) + "&LH_Sold=1&LH_Complete=1",
    note: basis === "sold"
      ? `${ps.length} eBay sales in the last 90 days`
      : `${ps.length} listings, asking prices - no sold data`,
  };
  hit++; save();
  const f = found[key(t)];
  console.log(`  ${tag} - ${money(f.lo)}-${money(f.hi)}  (${f.n} ${f.basis === "sold" ? "sold" : "asks"}, ${f.conf})` +
    (f.wild ? `  ** ${f.ratio}x the catalog's ${money(f.book)} - check this one **` : ""));
}
const wilds = Object.values(found).filter(f => f && f.wild).length;
const soldRows = Object.values(found).filter(f => f && f.basis === "sold").length;
console.log(`\n  ${hit} priced, ${miss} with nothing usable` +
  (wilds ? `, ${wilds} outside the sanity band and held back` : "") + `. Findings in ${OUT}.`);
console.log(`  ${soldRows} of them are built on sold prices; the rest are asking prices and read high.`);
console.log(`  Review them, then: node tools/harvest.js --merge   (add --sold-only to take just the sold ones)\n`);
