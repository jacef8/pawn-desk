#!/usr/bin/env node
/* What is an asking price worth, against a sale?
 *
 *   node tools/calibrate-asks.mjs                 # what it would do
 *   node tools/calibrate-asks.mjs --go            # do it
 *   node tools/calibrate-asks.mjs --go --n 40     # a different sample size
 *   node tools/calibrate-asks.mjs --report        # read the answer again
 *
 * WHY THIS EXISTS. Asked at the counter on 26 Sep: with the sold-price
 * quota gone, should the desk take asking prices and knock a percentage off
 * to stand in for a sale? The idea is right in shape and I could not answer
 * it, because nothing we hold measures it. The 382 harvested rows that
 * carry a basis are each ONE basis - a model was priced off sales or off
 * asks, never both - so the only comparison available was sold rows in one
 * aisle against asking rows in another, which came out:
 *
 *     tablets   4.30x      laptops   0.83x      trail cameras   1.06x
 *
 * Four to five rows each and one of them pointing the wrong way. Laptop
 * asks came back BELOW laptop sales, which cannot be an ask premium - it
 * means the two searches found different things. That is the mix, not the
 * market, and no single haircut survives it.
 *
 * So: price the SAME query both ways, in the same hour, and keep the pair.
 * That is the only number that can honestly be called a ratio.
 *
 * WHAT IT COSTS. The asking side is eBay Browse and is free. The sold side
 * is SoldComps at up to 2 lookups a target, so 40 targets is up to 80 of
 * the 2,000 a month. It records what it spent in the same ledger the
 * harvest uses, so the two cannot overspend each other.
 *
 * WHAT IT WILL NOT DO. It refuses targets on aisles the desk has retired -
 * saws, mowers, televisions, generators. Those searches return carburettors
 * and door seals, and a ratio measured on them would be the ratio between
 * two kinds of wrong. A haircut cannot fix contamination; it can only make
 * a wrong number smaller and give it the authority of a decimal point.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const has  = (f) => argv.includes("--" + f);
const arg  = (f, d) => { const i = argv.indexOf("--" + f); return i >= 0 ? argv[i + 1] : d; };

const GO     = has("go");
const N      = Math.max(4, Number(arg("n", 40)) || 40);
const OUT    = join(ROOT, "tools", "ask-calibration.json");
const LEDGER = join(ROOT, "tools", "harvest.json");
const SERVER = process.env.PAWN_SERVER || "";
const TOKEN  = process.env.PAWN_TOKEN  || "";

/* ---- the sample ------------------------------------------------------
   DEPTH, NOT BREADTH. The first version of this spread the 40 targets over
   40 different aisles, one each, which is the most natural-looking sample
   and completely useless here: the question is whether a haircut HOLDS
   STILL within a kind of thing, and one pair per aisle cannot answer that
   about any of them. It reproduces exactly the useless comparison that
   prompted the run.
   So: a few aisles, deep. Aisles are ranked by how many of their targets
   already produced a sold row, because those are the ones that can produce
   a pair at all - an aisle that has never returned a sale will spend the
   quota proving it again. Within an aisle, same rule, sold rows first. */
const PER_AISLE = 8;
function sample() {
  const seed = JSON.parse(readFileSync(join(ROOT, "tools", "seed-models.json"), "utf8")).rows;
  const app  = readFileSync(join(ROOT, "app.js"), "utf8");
  const i = app.indexOf("const EBAY_CANNOT_ITEM={"), j = app.indexOf("\n};", i);
  const blind = new Set([...app.slice(i, j).matchAll(/^\s*([a-z]\d+):"/gm)].map((m) => m[1]));
  "g1 g2 g3 g4 g5 g6 g7 g8 g9 g10 r1 r2 r3".split(" ").forEach((r) => blind.add(r));

  let found = {};
  try { found = JSON.parse(readFileSync(LEDGER, "utf8")).found || {}; } catch (e) {}
  const hasSold = (t) => { const f = found[t.ref + "|" + t.name]; return !!(f && f.basis === "sold"); };

  const byRef = {};
  for (const t of seed) {
    if (blind.has(t.ref)) continue;
    (byRef[t.ref] = byRef[t.ref] || []).push(t);
  }
  for (const r in byRef) byRef[r].sort((a, b) => (hasSold(b) ? 1 : 0) - (hasSold(a) ? 1 : 0));

  /* --refs p1,t1,h4 picks the aisles by hand. The automatic ranking goes
     by which aisles have already produced sales, and those are nearly all
     electronics - because that is what eBay actually sells used. A run
     that measures only electronics can only answer for electronics, which
     the dry run says out loud. */
  const pick = String(arg("refs", "") || "").split(",").map((z) => z.trim()).filter(Boolean);
  if (pick.length) return pick.flatMap((r) => (byRef[r] || []).slice(0, PER_AISLE)).slice(0, N);

  const rank = Object.keys(byRef)
    .map((r) => ({ ref: r, proven: byRef[r].filter(hasSold).length, size: byRef[r].length }))
    .filter((a) => a.size >= 4)
    .sort((a, b) => b.proven - a.proven || b.size - a.size);

  const want = Math.max(1, Math.ceil(N / PER_AISLE));
  const out = [];
  for (const a of rank.slice(0, want)) {
    for (const t of byRef[a.ref].slice(0, PER_AISLE)) { if (out.length < N) out.push(t); }
  }
  return out;
}

/* ---- one query, both ways -------------------------------------------- */
async function priceVia(q, via) {
  const r = await fetch(SERVER.replace(/\/+$/, "") + "/ebay", {
    method: "POST",
    headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
    body: JSON.stringify({ q, limit: 40, via }),
  });
  const j = await r.json().catch(() => null);
  if (!j || !j.ok) return { ok: false, code: (j && j.code) || "error", note: j && j.note };
  const ps = (j.comps || []).map((c) => Number(c.price)).filter((n) => n > 0).sort((a, b) => a - b);
  if (ps.length < 3) return { ok: false, code: "thin", n: ps.length };
  const at = (f) => ps[Math.min(ps.length - 1, Math.max(0, Math.round(f * (ps.length - 1))))];
  return { ok: true, n: ps.length, source: j.source, basis: j.basis,
           med: at(0.5), q1: at(0.25), q3: at(0.75) };
}

/* ---- the report ------------------------------------------------------ */
const med = (a) => { const s = a.slice().sort((x, y) => x - y);
  return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };

function report(pairs) {
  const good = pairs.filter((p) => p.sold && p.ask);
  console.log(`\n  ${good.length} pairs of ${pairs.length} targets\n`);
  if (!good.length) { console.log("  Nothing to measure.\n"); return; }

  const byRef = {};
  good.forEach((p) => (byRef[p.ref] = byRef[p.ref] || []).push(p));
  console.log("  aisle  pairs   sold med   ask med   sold/ask   sold vs the CHEAP quarter of asks");
  console.log("  " + "-".repeat(76));
  for (const r of Object.keys(byRef).sort()) {
    const g = byRef[r];
    const ratio = med(g.map((p) => p.sold.med / p.ask.med));
    const vsQ1  = med(g.map((p) => p.sold.med / p.ask.q1));
    console.log("  " + r.padEnd(6) + String(g.length).padStart(4) + "  "
      + String(Math.round(med(g.map((p) => p.sold.med)))).padStart(8)
      + String(Math.round(med(g.map((p) => p.ask.med)))).padStart(10)
      + ("  " + ratio.toFixed(2) + "x").padStart(11)
      + ("  " + vsQ1.toFixed(2) + "x").padStart(16)
      + (g.length < 5 ? "   (thin)" : ""));
  }
  const all = med(good.map((p) => p.sold.med / p.ask.med));
  const allQ1 = med(good.map((p) => p.sold.med / p.ask.q1));
  console.log("  " + "-".repeat(76));
  console.log("  every pair together:  sold is " + all.toFixed(2) + "x the median ask, "
    + allQ1.toFixed(2) + "x the cheap quarter\n");

  /* The question this run exists to settle. */
  const spread = Object.keys(byRef).filter((r) => byRef[r].length >= 5)
    .map((r) => med(byRef[r].map((p) => p.sold.med / p.ask.med)));
  console.log("  READ IT LIKE THIS");
  console.log("    A haircut is only worth applying if the aisles AGREE. Look down the");
  console.log("    sold/ask column: if the shelves with 5+ pairs sit inside about 10");
  console.log("    points of each other, one factor per aisle is a measurement worth");
  console.log("    having. If they scatter the way the unpaired rows did - 4.30x, 0.83x,");
  console.log("    1.06x - then the searches are finding different things and no haircut");
  console.log("    fixes that. Keep labelling the figure a ceiling instead.");
  if (spread.length >= 2) {
    const lo = Math.min(...spread), hi = Math.max(...spread);
    console.log(`\n    This run: ${spread.length} aisles with 5+ pairs, ${lo.toFixed(2)}x to ${hi.toFixed(2)}x`
      + (hi - lo <= 0.10 ? "  - they agree. A per-aisle factor is defensible."
                         : "  - they do not agree. Do not apply a haircut."));
  } else {
    console.log("\n    This run: not enough aisles reached 5 pairs to judge. Raise --n.");
  }
  console.log("");
}

/* ---- run ------------------------------------------------------------- */
if (has("report")) {
  if (!existsSync(OUT)) { console.error("  Nothing measured yet."); process.exit(1); }
  report(JSON.parse(readFileSync(OUT, "utf8")).pairs || []);
  process.exit(0);
}

const targets = sample();
console.log("\n  ASKING PRICES AGAINST SALES — the same query, both ways, the same hour\n");
console.log("  Targets            : " + targets.length + " across "
  + new Set(targets.map((t) => t.ref)).size + " aisles, "
  + PER_AISLE + " deep \u2014 depth is the point, a single pair per aisle measures nothing");
console.log("  SoldComps lookups  : up to " + targets.length * 2 + " of the 2,000 a month");
console.log("  eBay Browse        : free");
if (!GO) {
  console.log("\n  The answer will only speak for the aisles below. Left to itself this\n"
    + "  picks the shelves that have already produced sales, and those are nearly\n"
    + "  all electronics, because that is what eBay actually sells used. To make\n"
    + "  it answer for tools or hunting gear, name them: --refs t1,h4,h6");
  console.log("\n  Dry run. --go to measure.\n");
  const grp = {};
  targets.forEach((t) => (grp[t.ref] = grp[t.ref] || []).push(t.name));
  for (const r of Object.keys(grp)) {
    console.log("    " + r + "  (" + grp[r].length + ")");
    grp[r].forEach((n) => console.log("       " + n));
  }
  console.log("");
  process.exit(0);
}
if (!SERVER || !TOKEN) { console.error("  Set PAWN_SERVER and PAWN_TOKEN.\n"); process.exit(2); }

const pairs = [];
let spent = 0;
for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  process.stdout.write(`  [${i + 1}/${targets.length}] ${t.name} `.padEnd(52));
  /* Asking first, because it is free: if the query comes back empty there
     is no pair to be had and the sold lookup would be wasted quota. */
  const ask = await priceVia(t.name, "browse");
  if (!ask.ok) { console.log("no asks (" + ask.code + ")"); pairs.push({ ...t, ask: null, sold: null }); continue; }
  const sold = await priceVia(t.name, "soldcomps");
  spent += 2;
  if (!sold.ok) { console.log(`asks ${ask.n} · no sales (${sold.code})`); pairs.push({ ...t, ask, sold: null }); continue; }
  console.log(`sold ${sold.med} · ask ${ask.med} · ${(sold.med / ask.med).toFixed(2)}x`);
  pairs.push({ ...t, ask, sold });
}

writeFileSync(OUT, JSON.stringify({ ran: new Date().toISOString(), spent, pairs }, null, 1) + "\n");

/* Into the same ledger the harvest uses, so the two cannot overspend each
   other behind the other's back. */
try {
  const led = JSON.parse(readFileSync(LEDGER, "utf8"));
  const mk = new Date().toISOString().slice(0, 7);
  led.spend = led.spend || {};
  led.spend[mk] = (Number(led.spend[mk]) || 0) + spent;
  writeFileSync(LEDGER, JSON.stringify(led));
  console.log("\n  " + spent + " lookups, written to the harvest ledger for " + mk);
} catch (e) { console.log("\n  " + spent + " lookups (could not update the ledger: " + e.message + ")"); }

report(pairs);
