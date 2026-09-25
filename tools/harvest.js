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
 *   PAWN_TOKEN=your-token \
 *   node tools/harvest.js --limit 5             # dry run, prints the plan
 *
 * PAWN_SERVER defaults to the shop's Railway service; set it only to point
 * somewhere else.
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
 *   --stale N    reprice findings older than N days (default 28; 0 = never)
 *   --ref ID     only targets for one catalog item (p1, t1, e4 ...)
 *   --only WORD  only targets whose name contains WORD
 *   --seed FILE  a different target list
 *   --out FILE   where findings are kept (default tools/harvest.json)
 *   --merge      merge findings into prices.json (no searching, no spending)
 *   --min N      merge only rows built on at least N listings (default 4)
 *   --wild       merge rows the sanity band flagged too (see below)
 *   --force      merge even if the circuit breaker objects (see below)
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
import { ELEC_PART } from "../server/ebay.js";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n);
  return i < 0 ? d : (process.argv[i + 1] || "").startsWith("--") ? true : process.argv[i + 1]; };
const has = (n) => process.argv.includes("--" + n);

/* The shop's service. Not a secret - it is a public URL that answers 403
   to anyone without the token - so it has a default and one less thing has
   to be set up on a machine that only runs the harvest. Override it with
   PAWN_SERVER to point at a staging copy. */
const DEFAULT_SERVER = "https://pawn-desk-production.up.railway.app";
const SERVER = (process.env.PAWN_SERVER || DEFAULT_SERVER).replace(/\/+$/, "");
/* The token IS a secret and has no default. It lives in the environment,
   never in this file and never in the repository. */
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
const BOOK = {}, KIND = {};
try {
  const APP = readFileSync(join(ROOT, "app.js"), "utf8");
  literal(APP, "const CATALOG = [").forEach(c => c.items.forEach(it => {
    BOOK[it.id] = it.value;
    /* What the counter calls this kind of thing. Sent with every lookup so
       the service can throw away listings that never claim to BE one - a
       sprocket does not say chainsaw, and priced with the saws it made a
       $180 saw look like $8. */
    KIND[it.id] = it.name;
  }));
  /* The price book counts too. It was read as catalog-only, so a target
     aimed at a price-book row - "Wheelbarrow", "Grease gun" - came back
     with BOTH guards switched off: no kind word, so the parts filter had
     nothing to match against, and no book value, so wildness() returned
     null and the sanity band never ran. Those two are what stop a $180 saw
     reading $8, and they were silently absent on exactly the 166 rows that
     most need pricing. A book row is keyed by its NAME, which is also what
     the app uses as its ref. */
  literal(APP, "const PRICEBOOK=[").forEach(e => {
    BOOK[e[0]] = e[1];
    KIND[e[0]] = e[0];
  });
} catch (e) { console.error("  (could not read the catalog: " + e.message + " - the sanity band is off)"); }
/* THE MIDDLE HALF OF ONE PRODUCT IS NOT TEN TIMES WIDE.
 *
 * lo and hi are the 25th and 75th percentiles - the middle half of what
 * sold. For a single product that band is tight: condition and storage
 * move it, a factor of two at the outside. When it comes back ten times
 * wide the search was not measuring one thing. A BenQ GW2480 came back
 * $40-$399 off thirteen real sales, and an HTC Vive Pro 2 $45-$350 off
 * fourteen - the low ends are a cable and a controller, the high ends are
 * the headset. Both would have merged: every sale was genuine, the count
 * was healthy, and the MIDPOINT sat close enough to the book for the
 * sanity band to wave it through. The band watches the middle; this
 * watches the width.
 *
 * Deliberately loose at 5x, well past the spread real condition produces,
 * so it catches mixed products and not a wide market. */
const MIX_SPREAD = 5;
const mixedness = (lo, hi) => {
  const a = Number(lo), b = Number(hi);
  if (!(a > 0) || !(b > 0)) return null;
  const spread = Math.round((b / a) * 10) / 10;
  return { spread, mixed: spread > MIX_SPREAD };
};
/* WHAT EBAY CANNOT SELL, IT CANNOT PRICE - AND A HARVEST WOULD WRITE THE
 * WRONG ANSWER DOWN PERMANENTLY.
 *
 * eBay bans firearm sales, so "Remington 870 Express" returns shell
 * latches at $14.99, a trigger plate at $39 and a stock set at $115. The
 * seventy-four gun rows in the book are good - $300-$400 for an 870
 * Express, hand-checked against completed auctions on the firearm sites -
 * and one `--ref g1 --go` would have replaced every one of them with the
 * price of its parts. Fourteen real sales agreeing with each other looks
 * exactly like a healthy row from here.
 *
 * Same for anything nobody ships: quads, side-by-sides, golf carts,
 * mowers. Refused outright rather than filtered, because there is nothing
 * in the result worth filtering. */
/* ONE BLIND LIST, TWO READERS.
   This used to be a hand-kept copy, and it drifted exactly the way the two
   price books did. On 24 Sep the desk refused to price 21 refs and this set
   knew about 2 of them: 185 seed targets in aisles the counter will not
   quote anyway, up to 370 lookups a sweep, 18% of the month, spent to hand
   nobody a number. So the desk's list is the list. app.js is read at
   startup and the guns and rolling stock - which are a legal question, not
   a shipping one, and live in EBAY_CANNOT rather than EBAY_CANNOT_ITEM -
   are added to it. If app.js cannot be read, fall back to the guns alone
   and say so: silently blinding nothing is better than silently blinding
   everything, and the run still prints its aisle verdicts. */
const ALWAYS_BLIND = ["g1","g2","g3","g4","g5","g6","g7","g8","g9","g10","r1","r2","r3"];
const EBAY_BLIND = new Set(ALWAYS_BLIND);
try {
  const a = readFileSync(join(ROOT, "app.js"), "utf8");
  const i = a.indexOf("const EBAY_CANNOT_ITEM={");
  const j = a.indexOf("\n};", i);
  if (i < 0 || j < 0) throw new Error("EBAY_CANNOT_ITEM not found in app.js");
  const refs = [...a.slice(i, j).matchAll(/^\s*([a-z]\d+):"/gm)].map(m => m[1]);
  if (!refs.length) throw new Error("EBAY_CANNOT_ITEM parsed empty");
  refs.forEach(r => EBAY_BLIND.add(r));
} catch (e) {
  console.error("  (could not read the desk's blind list from app.js: " + e.message +
                " - only firearms and rolling stock will be skipped)");
}
const BLIND_NAME = /\b(shotgun|rifle|pistol|revolver|muzzleloader|ar-?15|ak-?pattern|sks|atv|utv|side-?by-?side|golf cart|dirt bike|four wheeler|riding mower|zero-?turn|push mower)\b/i;
const ebayBlind = (ref, name) =>
  EBAY_BLIND.has(String(ref)) || BLIND_NAME.test(String(name || "")) || BLIND_NAME.test(String(ref || ""));

const wildness = (ref, med) => {
  const b = BOOK[ref];
  if (!b || !med) return null;
  const ratio = med / b;
  return { book: b, ratio: Math.round(ratio * 100) / 100, wild: ratio > WILD_HI || ratio < WILD_LO };
};

/* WHICH BAND IS THE ANSWER.
 *
 * The service labels every listing kit, bare or unknown (see fitOf in
 * server/ebay.js). For a cordless tool those are different products: a
 * DCD791 is $40-54 bare and $90-100 in a kit, and the catalogue row is the
 * kit. Pricing the pile gave $48-95 and would have halved the shop's drill
 * prices.
 *
 * But most of the seed list is not a battery tool. A chainsaw has no kit
 * band and never will, and demanding one would price nothing. So the
 * question asked first is whether this is a battery tool AT ALL - answered
 * by whether sellers bothered to say "tool only", which they only do when
 * a battery could have been included.
 *
 *   sellers say "bare"  ->  it is a battery tool  ->  price the KIT band,
 *                           or refuse if too few kit listings to stand on
 *   nobody says "bare"  ->  it is not             ->  price everything
 */
function bandOf(comps){
  const at = (a,f) => a[Math.min(a.length-1, Math.max(0, Math.round(f*(a.length-1))))];
  const band = list => { const ps=list.map(c=>Math.round(Number(c.price))).filter(n=>n>0).sort((a,b)=>a-b);
    return ps.length ? {n:ps.length, lo:at(ps,0.25), med:at(ps,0.5), hi:at(ps,0.75)} : null; };
  const kit      = band(comps.filter(c=>c.fit==="kit"));
  const bareOnly = band(comps.filter(c=>c.fit==="bare"));
  const all      = band(comps);
  const batteryTool = !!(bareOnly && bareOnly.n >= 3);
  if (!batteryTool) return { use:"all", band:all, kit, bareOnly, why:"not a battery tool - no kit/bare split applies" };
  if (kit && kit.n >= 4)
    return { use:"kit", band:kit, kit, bareOnly,
             why:`battery tool: priced the ${kit.n} kit listings, not the ${bareOnly.n} bare ones` };
  return { use:"thin", band:null, kit, bareOnly,
           why:`battery tool, but only ${kit?kit.n:0} kit listing(s) - the rest are bare tools and would price it low` };
}

const money = (n) => "$" + Math.round(n).toLocaleString();
const today = () => new Date().toISOString().slice(0, 10);
const pct = (a, f) => a[Math.min(a.length - 1, Math.max(0, Math.round(f * (a.length - 1))))];

/* ---- findings so far ---- */
let found = {};
let spend = {};          /* declared HERE, beside found, because the loader
                            below writes to both - and a `let` further down
                            the file put this one in its temporal dead zone,
                            where the assignment threw and the catch ate it.
                            found loaded, spend silently did not, and the
                            allowance read 0 of 900 with a spent month
                            sitting in the file. */
if (existsSync(OUT)) { try {
  const st = JSON.parse(readFileSync(OUT, "utf8"));
  found = st.found || {};
  spend = st.spend || {};
} catch (e) {
  /* Not silent. A state file that will not parse means the run is about to
     re-price a book it thinks is empty - which is the most expensive
     mistake available to it. */
  console.error("  (could not read " + OUT + ": " + e.message + ")");
  console.error("  Treating the book as unpriced would spend the month. Stopping.");
  process.exit(5);
} }
/* WHAT THE HARVEST MAY SPEND IN A MONTH, AND WHAT IS NOT ITS TO SPEND.
   SoldComps counts every lookup the same, whether the harvest made it or
   the counter did with a customer waiting. There is no way to reserve half
   the plan for the counter at their end - so the reserve has to be a
   CEILING at ours. The harvest gets a monthly allowance and stops; the
   rest is Jace's, by construction rather than by hoping.
   900 of 2000 on the $9 plan. At the shelf intervals above a normal month
   needs well under that, so the cap only ever bites on a catch-up. */
const MONTH_CAP = Math.max(0, Number(arg("cap", 900)) || 0);
const monthKey = () => new Date().toISOString().slice(0, 7);
let spentThisRun = 0;
const spentThisMonth = () => (Number(spend[monthKey()]) || 0) + spentThisRun;
const save = () => {
  const s = Object.assign({}, spend);
  if (spentThisRun) s[monthKey()] = (Number(s[monthKey()]) || 0) + spentThisRun;
  writeFileSync(OUT, JSON.stringify(
    { updated: new Date().toISOString(), spend: s, found }, null, 1));
  spend = s; spentThisRun = 0;
};

/* ================= merge: findings -> prices.json ================= */
if (has("merge")) {
  const pj = JSON.parse(readFileSync(PRICES, "utf8"));
  const rows = pj.rows.slice();
  /* A price-book row is the generic kind of thing and its name carries no
     model number, so it can never pin through the model list - both routes
     in app.js require a digit before they will match. It goes in the book
     map instead, which bookVal() reads. Keyed by the row's own name, which
     is also its ref. */
  const bookMap = Object.assign({}, pj.book || {});
  const bookMoves = [];
  const isBookRow = (f) => f && f.ref === f.name && BOOK[f.ref] !== undefined
                        && !/^[a-z]\d{1,2}$/.test(String(f.ref));
  const byName = new Map(rows.map((r, i) => [String(r[1]) + "|" + String(r[2]).toLowerCase(), i]));
  let added = 0, updated = 0, skipped = 0, wild = 0, asks = 0, mixed = 0;
  const heldAsk = [];
  const touched = [], touchedMoves = [], newRows = [], heldWild = [], heldThin = [], heldMixed = [];
  let n = 0;
  const nextId = () => { let id; do { id = "h" + (++n); } while (rows.some(r => r[0] === id)); return id; };
  for (const [key, f] of Object.entries(found)) {
    if (!f || !f.n || f.n < MIN || !(f.lo > 0) || !(f.hi >= f.lo)) { skipped++;
      if (f && f.name && f.n) heldThin.push({ name: f.name, n: f.n }); continue; }
    /* RECOMPUTED, NOT TRUSTED. The book-row lane below has said for weeks
       that f.wild is written at lookup time and a merge may be running
       against a findings file from another day - and then this lane, two
       lines above it, believed the flag anyway. It showed up when the
       catalog rows were split: an HP Omen measured at $950 was marked wild
       against the old $175 "Laptop" row, and stayed marked after a
       "Gaming laptop" row at $844 made it perfectly ordinary. Every
       finding that had ever been wrong about its row was frozen that way.
       The band is the merge's to decide, on both lanes, every time. */
    const mid0 = Math.round((f.lo + f.hi) / 2);
    /* A MODEL IS ITS OWN BEST REFERENCE.
       The band compared every finding against the CATEGORY's base, which
       works where brand moves the price a little and fails completely
       where brand IS the price. A Martin D-28 measured at $2,600 against
       a $110 "acoustic guitar" row reads as 23x and was refused - a
       correct answer, thrown away, because the desk's three brand tiers
       span two and a half times and guitars span twenty. Where the model
       already has a row of its own, that row is what the new figure
       should be checked against; the category base is for models the desk
       has never seen. Kept tight at the same 4x: a real price can move
       over a year, but not fourfold. */
    const prev = rows[byName.get(f.ref + "|" + String(f.name).toLowerCase())];
    const prevMid = prev ? Math.round((prev[3] + prev[4]) / 2) : 0;
    const w0 = prevMid > 0
      ? { book: prevMid, ratio: Math.round(mid0 / prevMid * 100) / 100,
          wild: mid0 / prevMid > WILD_HI || mid0 / prevMid < WILD_LO }
      : (wildness(f.ref, mid0) || wildness(f.name, mid0));
    if (w0 && w0.wild && !has("wild")) { wild++;
      heldWild.push({ name: f.name, lo: Math.round(f.lo), hi: Math.round(f.hi),
                      n: f.n, book: w0.book, ratio: w0.ratio }); continue; }
    if (SOLD_ONLY && f.basis !== "sold") { asks++; continue; }
    if (isBookRow(f)) {
      /* The book wants one resale figure, not a range; the mid is what
         marketNow() would have shown for the same row anyway. */
      const mid = Math.round((f.lo + f.hi) / 2);
      const was = bookMap[f.name] != null ? bookMap[f.name] : BOOK[f.name];
      /* The band is recomputed HERE rather than trusting f.wild. That flag
         is written during the lookup, and a merge can be run against a
         findings file from another day, another branch, or a version of
         this script from before the price book had a band at all - which
         is exactly how a dry run put a $600 e-bike in at $2,583. The merge
         is the last gate before the counter, so it checks for itself. */
      const mx = mixedness(f.lo, f.hi);
      if (mx && mx.mixed && !has("mixed")) {
        mixed++;
        heldMixed.push({ name: f.name, lo: Math.round(f.lo), hi: Math.round(f.hi),
                         n: f.n, spread: mx.spread });
        continue;
      }
      const w = wildness(f.name, mid);
      if (w && w.wild && !has("wild")) {
        wild++;
        heldWild.push({ name: f.name, lo: Math.round(f.lo), hi: Math.round(f.hi),
                        n: f.n, book: w.book, ratio: w.ratio });
        continue;
      }
      if (mid > 0 && mid !== was) {
        bookMoves.push({ name: f.name, was, now: mid, n: f.n, basis: f.basis || "asking" });
        bookMap[f.name] = mid;
        updated++;
      }
      continue;
    }
    const mxr = mixedness(f.lo, f.hi);
    if (mxr && mxr.mixed && !has("mixed")) {
      mixed++;
      heldMixed.push({ name: f.name, lo: Math.round(f.lo), hi: Math.round(f.hi),
                       n: f.n, spread: mxr.spread });
      continue;
    }
    const row = [f.id || nextId(), f.ref, f.name, Math.round(f.lo), Math.round(f.hi),
                 f.conf, f.date, f.src || "https://www.ebay.com", f.note, f.alias || ""];
    const at = byName.get(f.ref + "|" + f.name.toLowerCase());
    if (at == null) { row[0] = nextId(); rows.push(row); byName.set(f.ref + "|" + f.name.toLowerCase(), rows.length - 1); added++;
      newRows.push({ name: f.name, ref: f.ref, lo: row[3], hi: row[4], n: f.n, basis: f.basis || "asking" }); }
    else {
      /* Keep the id: the hand-written patterns in app.js point at it, and a
         new id would quietly orphan them. Say which rows were rewritten -
         some of them were checked by a person against a better source than
         a marketplace search. */
      /* AN ASK MAY NOT PAINT OVER A SALE.
         The row being replaced carries the note it was written with, and
         "12 eBay sales in the last 90 days" is a different kind of fact
         from "24 listings, asking prices". Asks read high, so overwriting
         the first with the second moves the number the wrong way AND
         downgrades what is known about it, silently, in a diff that goes
         to main unread.
         It happens whenever SoldComps goes quiet - a spent quota, a
         rejected key, a model with two sales this quarter - which is to
         say it happens on the runs that most look like they worked.
         The sold row stays. It ages instead, and the row says when it was
         last checked, which is the honest version. */
      const prevNote = String(rows[at][8] || "");
      const prevWasSold = /\bsales?\b.*\b90 days\b|\bsold\b/i.test(prevNote);
      if (prevWasSold && (f.basis || "asking") !== "sold") {
        asks++;
        heldAsk.push({ name: f.name, was: `${rows[at][3]}-${rows[at][4]}`,
                       now: `${row[3]}-${row[4]}`, n: f.n, prev: prevNote });
        continue;
      }
      row[0] = rows[at][0];
      touched.push(`${rows[at][2]}  ${rows[at][3]}-${rows[at][4]} -> ${row[3]}-${row[4]}`);
      touchedMoves.push({ name: rows[at][2], ref: f.ref, wasLo: rows[at][3], wasHi: rows[at][4],
        nowLo: row[3], nowHi: row[4], n: f.n, basis: f.basis || "asking" });
      rows[at] = row; updated++;
    }
  }
  /* ---- the circuit breaker ------------------------------------------
     A merge can now push straight to main and reach the counter without a
     person reading the diff, so the diff has to read itself.

     The sanity band above already throws out a row that is absurd against
     the CATALOG. This asks a different question: is the row absurd against
     what THIS BOOK ALREADY SAID? A price that has stood for months and
     suddenly halves is not a market move, it is a bad search - the wrong
     model, a parts counter, a lot of five. One of those is a mistake. A
     hundred of them is a broken run, and the counter lends against it.

     So: any single row more than tripling or falling below a third stops
     the merge outright. Past that, a run is allowed a few big moves but not
     a faceful - if over a tenth of the rewrites moved more than 60%, the
     run is wrong about something systematic and nothing is written.

     --force says a person looked and meant it. */
  const moves = [];
  for (const t of touchedMoves) {
    const was = (t.wasLo + t.wasHi) / 2, now = (t.nowLo + t.nowHi) / 2;
    if (was > 0) moves.push({ name: t.name, r: now / was, was, now });
  }
  /* The one-offs count. They were rewritten in their own lane and never
     reached this list, so a run could rewrite 153 price-book rows - four of
     them past 4x - and the breaker would exit 0 having seen nothing. They
     reach the counter through exactly the same screens. */
  for (const m of bookMoves) {
    if (m.was > 0) moves.push({ name: m.name, r: m.now / m.was, was: m.was, now: m.now });
  }
  const wild3 = moves.filter(m => m.r >= 3 || m.r <= 1 / 3);
  const big   = moves.filter(m => m.r >= 1.6 || m.r <= 1 / 1.6);
  const bigShare = moves.length ? big.length / moves.length : 0;
  const halts = [];
  if (wild3.length) halts.push(`${wild3.length} row(s) moved more than 3x`);
  if (moves.length >= 20 && bigShare > 0.1 && big.length > 5)
    halts.push(`${big.length} of ${moves.length} rewrites (${Math.round(bigShare * 100)}%) moved more than 60%`);
  if (rows.length < pj.rows.length) halts.push(`the book would SHRINK, ${pj.rows.length} rows to ${rows.length}`);
  if (halts.length && !has("force")) {
    console.error("\n  MERGE STOPPED. This run does not look like a price update:");
    halts.forEach(h => console.error("    - " + h));
    console.error("\n  The biggest movers:");
    moves.sort((a, b) => Math.abs(Math.log(b.r)) - Math.abs(Math.log(a.r))).slice(0, 12)
      .forEach(m => console.error(`    ${m.name}  $${Math.round(m.was)} -> $${Math.round(m.now)}  (${m.r.toFixed(2)}x)`));
    console.error("\n  Nothing was written. Read the rows above; --force merges anyway.\n");
    process.exit(2);
  }
  if (big.length) {
    console.log(`\n  ${big.length} row(s) moved more than 60% - under the limit, merged:`);
    big.slice(0, 8).forEach(m => console.log(`    ${m.name}  $${Math.round(m.was)} -> $${Math.round(m.now)}  (${m.r.toFixed(2)}x)`));
  }

  /* the app refuses a file it cannot trust, so check it here rather than
     finding out as a silent fallback on the counter's phone */
  const bad = rows.filter(r => !(Array.isArray(r) && r.length >= 9 && typeof r[0] === "string"
    && typeof r[2] === "string" && typeof r[3] === "number" && typeof r[4] === "number"
    && r[3] > 0 && r[4] >= r[3] && r[4] < 1000000));
  if (bad.length) { console.error("  " + bad.length + " row(s) the app would reject - nothing written."); process.exit(1); }
  copyFileSync(PRICES, PRICES + ".bak");
  writeFileSync(PRICES, JSON.stringify({ updated: today(),
    note: pj.note, rows,
    ...(Object.keys(bookMap).length ? { book: bookMap } : {}) }, null, 0));
  /* ---- the change report --------------------------------------------
     The breaker above stops a catastrophe. This is for everything that is
     not a catastrophe: an ordinary week of movement, ranked biggest first,
     so a person can run an eye down it in thirty seconds and stop on the
     one that looks wrong. A 4% drift needs no thought. A 30% jump on nine
     listings is worth a look before somebody lends against it.

     One file, overwritten each run - git keeps every previous version, so
     the history is the history without a directory filling up. */
  const pct = (m) => Math.round((((m.nowLo + m.nowHi) / 2) / ((m.wasLo + m.wasHi) / 2) - 1) * 100);
  const withPct = touchedMoves.map((m) => ({ ...m, pct: pct(m) }))
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
  const sign = (v) => (v > 0 ? "+" : "") + v + "%";
  const band = (m) => `$${m.wasLo}\u2013${m.wasHi} \u2192 $${m.nowLo}\u2013${m.nowHi}`;
  /* The one-offs move as a single figure, not a band, so they cannot share
     the table above - and they are the rows that most need reading, since
     166 of them had never been checked against anything at all. */
  const bookPct = (m) => (m.was > 0 ? Math.round((m.now / m.was - 1) * 100) : 0);
  const bookSorted = bookMoves.map((m) => ({ ...m, pct: bookPct(m) }))
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
  const look = withPct.filter((m) => Math.abs(m.pct) >= 25);
  const rest = withPct.filter((m) => Math.abs(m.pct) < 25 && m.pct !== 0);
  const L = [];
  L.push(`# Price changes \u2014 ${today()}`);
  L.push("");
  L.push(`${pj.rows.length} rows \u2192 **${rows.length}**. ${added} added, ${updated} rewritten` +
    (wild ? `, ${wild} held back as wild` : "") +
    (mixed ? `, ${mixed} held back as mixed searches` : "") +
    (skipped ? `, ${skipped} too thin` : "") +
    (asks ? `, ${asks} held back as asking-only` : "") + ".");
  L.push("");
  if (!SOLD_ONLY) {
    L.push("> These are **asking** prices unless a row says otherwise \u2014 eBay has not");
    L.push("> granted Marketplace Insights. Asks read high.");
    L.push("");
  }
  if (look.length) {
    L.push(`## Worth a look \u2014 moved 25% or more (${look.length})`);
    L.push("");
    L.push("| Item | Was | Now | Change | Listings |");
    L.push("|---|---|---|---|---|");
    look.forEach((m) => L.push(`| ${m.name} | $${m.wasLo}\u2013${m.wasHi} | $${m.nowLo}\u2013${m.nowHi} | **${sign(m.pct)}** | ${m.n} |`));
    L.push("");
    L.push("A big move on few listings is the usual shape of a bad search \u2014 the");
    L.push("wrong model, a parts counter, a lot of five. Check those first.");
    L.push("");
  } else if (withPct.length) {
    L.push("## Worth a look");
    L.push("");
    L.push("Nothing moved 25% or more. Quiet week.");
    L.push("");
  }
  if (bookSorted.length) {
    L.push(`## One-off rows \u2014 the price book (${bookSorted.length})`);
    L.push("");
    L.push("These carried a figure nobody had checked against anything. A measured");
    L.push("price now stands in front of it for every device.");
    L.push("");
    L.push("| Item | Was | Now | Change | Listings |");
    L.push("|---|---|---|---|---|");
    bookSorted.forEach((m) => L.push(
      `| ${m.name} | $${m.was} | $${m.now} | **${sign(m.pct)}** | ${m.n} |`));
    L.push("");
  }
  if (rest.length) {
    L.push(`## Ordinary drift (${rest.length})`);
    L.push("");
    rest.forEach((m) => L.push(`- ${m.name} \u2014 ${band(m)} (${sign(m.pct)}, ${m.n} listings)`));
    L.push("");
  }
  if (newRows.length) {
    L.push(`## New rows (${newRows.length})`);
    L.push("");
    newRows.sort((a, b) => a.name.localeCompare(b.name))
      .forEach((r) => L.push(`- ${r.name} \u2014 $${r.lo}\u2013${r.hi} (${r.n} listings, ${r.basis})`));
    L.push("");
  }
  if (heldWild.length) {
    L.push(`## Held back as wild (${heldWild.length})`);
    L.push("");
    L.push("Too far from what the catalog says this kind of thing is worth. Not merged.");
    L.push("");
    heldWild.forEach((r) => L.push(`- ${r.name} \u2014 $${r.lo}\u2013${r.hi} against a book value of $${r.book} (${r.ratio}x, ${r.n} listings)`));
    L.push("");
  }
  if (heldAsk.length) {
    L.push(`## Kept the sale, refused the ask (${heldAsk.length})`);
    L.push("");
    L.push("These rows were built from real sales and this run only found asking");
    L.push("prices for them. Asks read high, so the sold figure stays and ages");
    L.push("rather than being painted over. Usually it means SoldComps went quiet");
    L.push("for that model - or for the month.");
    L.push("");
    heldAsk.slice(0, 40).forEach((r) =>
      L.push(`- ${r.name}: kept $${r.was}, refused $${r.now} (${r.n} listings, asking)`));
    if (heldAsk.length > 40) L.push(`- \u2026 and ${heldAsk.length - 40} more`);
    L.push("");
  }
  if (heldThin.length) {
    L.push(`## Too thin to price (${heldThin.length})`);
    L.push("");
    L.push(`Fewer than ${MIN} usable listings. Not merged.`);
    L.push("");
    heldThin.slice(0, 40).forEach((r) => L.push(`- ${r.name} (${r.n})`));
    if (heldThin.length > 40) L.push(`- \u2026 and ${heldThin.length - 40} more`);
    L.push("");
  }
  writeFileSync(join(ROOT, "tools/price-changes.md"), L.join("\n"));
  console.log("\n  Report written to tools/price-changes.md");

  console.log(`\n  ${added} added, ${updated} updated, ${skipped} skipped (under ${MIN} listings)` +
    (wild ? `, ${wild} held back as wild (--wild merges them)` : "") +
    (mixed ? `, ${mixed} held back as mixed searches (--mixed merges them)` : "") +
    (asks ? `, ${asks} held back as asking-price only`
          + (heldAsk.length ? ` (${heldAsk.length} of them kept a sold row that was already there)` : "") : "") + ".");
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

/* ---- what still needs pricing -------------------------------------------
 * Skipping everything already found is right for RESUMING a run that died -
 * it is what stops a stopped sweep paying twice. Left at that, though, the
 * weekly harvest runs once and is a no-op for ever after: all 610 are
 * "already found", nothing is outstanding, and the price book freezes at
 * whatever that first Monday said. A price book that never moves is a
 * diary of one afternoon.
 *
 * So a finding also goes back on the list once it is old. Twenty-eight days
 * means roughly a quarter of the list comes up for repricing each week,
 * which spreads the work and the spend instead of doing all 610 at once.
 *
 * Rows eBay cannot price at all - the mowers and trimmers nobody ships -
 * are left alone far longer. That is a fact about the market, not a price,
 * and re-proving it monthly would spend 127 lookups to learn nothing.
 */
/* HOW OFTEN A SHELF ACTUALLY NEEDS RE-PRICING.
   One 28-day rule across all 970 targets was the whole problem: the book
   came due every 28 days, a full sweep is up to 1,942 lookups, and the
   plan is 2,000 a month - so the harvest was budgeted to eat the entire
   allowance and the COUNTER, which is what the tool is for, got whatever
   was left. Usually nothing. On 25 Sep SoldComps mailed to say the month
   was gone.

   And the rule was wrong on its own terms. Used prices do not drift, they
   STEP. A DeWalt DCD791 does not wander 5% a month; it sits flat until
   DeWalt ships the DCD800 and the whole line shifts down a rung. What
   moves is what has an EVENT: an annual release, a season, a metal price.
   A cordless drill has none of those, and re-pricing it fortnightly buys
   nothing and costs two lookups every time.

   So: by shelf, by what makes it move. These are reasoned, not measured -
   the book was two days old when they were set - and the sample in
   tools/pipeline-rules.md is how they get corrected with data. */
const STALE_BY_TIER = { fast: 30, steady: 90, slow: 180 };
const TIER_OF = {
  e: "fast",     /* phones, laptops, consoles, titles - real release steps */
  p: "steady",   /* outdoor power - seasonal, then flat */
  h: "steady",   /* hunting & fishing - in season, out of season */
  f: "steady",   /* fitness - January, then flat all year */
  t: "slow",     /* tools - a drill is a drill until the next model */
  m: "slow",     /* instruments */
  a: "slow",     /* appliances & household */
  j: "slow",     /* jewelry - priced off metal weight anyway */
  c: "steady",   /* cards & coins - grading and hype move these */
  r: "slow",     /* trailers & ATVs */
  g: "slow",     /* firearms never price off eBay at all */
};
const tierOf = (ref) => TIER_OF[String(ref || "").trim().charAt(0).toLowerCase()] || "steady";
const staleFor = (ref) => STALE_BY_TIER[tierOf(ref)] || STALE_BY_TIER.steady;

/* THE CALENDAR BEATS THE NEWS FOR THE THINGS THAT MATTER.
   Jace asked whether the desk could watch for a new phone or a new console.
   Most of what moves a used price is not news at all - it is a date that
   has been the same for fifteen years. iPhones land in September and the
   old one steps down within the fortnight. Madden lands in August, Call of
   Duty in November, Samsung's Galaxy S in January.
   So these aisles come due BEFORE the event rather than on their own
   schedule, and the book is right while the customer is standing there
   rather than five weeks later. A month is the lead: long enough to have
   the new prices, short enough that they are still the new prices. */
const PRICE_EVENTS = [
  { month: 9,  refs: ["e"], what: "new iPhone - last year's steps down" },
  { month: 8,  refs: ["e"], what: "Madden and the autumn sports titles" },
  { month: 11, refs: ["e"], what: "Call of Duty, and console bundles for Christmas" },
  { month: 1,  refs: ["e"], what: "Samsung Galaxy S launch" },
  { month: 1,  refs: ["f"], what: "January - treadmills and weights move" },
  { month: 3,  refs: ["p"], what: "spring - mowers, trimmers, pressure washers" },
  { month: 9,  refs: ["h"], what: "hunting season opens" },
  { month: 6,  refs: ["p"], what: "storm season - generators and saws" },
];
/* The month an event lands in, and the month before it. */
const eventNow = () => {
  const m = new Date().getUTCMonth() + 1;
  const next = m === 12 ? 1 : m + 1;
  return PRICE_EVENTS.filter((e) => e.month === m || e.month === next);
};
const dueForEvent = (ref) => {
  const L = String(ref || "").trim().charAt(0).toLowerCase();
  return eventNow().some((e) => e.refs.indexOf(L) >= 0);
};

const STALE_DAYS = Math.max(0, Number(arg("stale", 0)) || 0);
const LOCAL_STALE_DAYS = 120;
const ageOf = (d) => {
  const t = Date.parse(String(d || "") + "T12:00:00Z");
  return Number.isFinite(t) ? Math.round((Date.now() - t) / 864e5) : Infinity;
};
const needsPricing = (t) => {
  const f = found[key(t)];
  if (!f) return true;
  if (STALE_DAYS === 0 && has("stale")) return false;  /* --stale 0: never reprice */
  const age = ageOf(f.date);
  if (f.local) return age >= LOCAL_STALE_DAYS;
  /* --stale N overrides the shelf, for a deliberate one-off */
  const want = STALE_DAYS || staleFor(t.ref);
  /* An aisle with an event this month or next comes due early - but not
     from cold: a row priced last week is still last week's price. */
  if (!STALE_DAYS && dueForEvent(t.ref) && age >= 21) return true;
  return age >= want;
};
let todo = targets.filter(needsPricing);
/* Oldest first, so a run cut short by a quota or a crash refreshes the
   rows that needed it most rather than whichever came first alphabetically. */
todo.sort((a, b) => ageOf((found[key(b)] || {}).date) - ageOf((found[key(a)] || {}).date));
if (limit > 0) todo = todo.slice(0, limit);

/* THE SAME REASONING, APPLIED TO THE FREE PATH.
   The --via claude guard below exists because an unbounded run spent $43.77
   by accident. eBay's API is free, so this path had no guard at all - but
   the lookups are not free: every one goes through SoldComps, which is
   2,000 requests a month on the $9 plan, and the desk's own live lookups
   come out of the same 2,000. A 418-target backlog is 836 requests, 42% of
   the month, reachable by forgetting a flag.
   So a big run has to be asked for. --limit says the number out loud;
   --all is the deliberate way to say "yes, the whole backlog". */
const BIG_RUN = 150;
/* eBay path only: --via claude has its own, stricter guard below, and
   reaching this one first would answer a money question with a quota
   answer. */
if (VIA === "ebay" && GO && !(limit > 0) && todo.length > BIG_RUN && !has("all")) {
  console.error("");
  console.error("  " + todo.length + " targets are outstanding - up to " +
                (todo.length * 2) + " SoldComps requests, " +
                Math.round((todo.length * 2 / 2000) * 100) + "% of the 2,000 a month.");
  console.error("");
  console.error("  A run this size has to say its own size:");
  console.error("");
  console.error("    --limit " + BIG_RUN + "   the standing weekly cap (up to " +
                (BIG_RUN * 2) + " requests)");
  console.error("    --all         yes, price the whole backlog in one run");
  console.error("");
  console.error("  Targets come up oldest first, so a capped run refreshes");
  console.error("  what needed it most. A backlog is meant to take several");
  console.error("  weeks - see tools/pipeline-rules.md.");
  console.error("");
  process.exit(2);
}

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

  let comps = [], basis = "", warned = "", found = 0;
  for (const q of tries) {
    let j;
    spentThisRun++;                                  /* the meter, not the result */
    const r = await fetch(SERVER + "/ebay", { method: "POST",
      headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
      body: JSON.stringify({ q, limit: 40, kind: KIND[t.ref] || "" }) });
    try { j = await r.json(); } catch (e) { j = null; }
    if (!r.ok || !j || !j.ok) throw new Error((j && j.code) || ("service answered " + r.status));
    comps = comps.concat((j.comps || []).filter(c => c && Number(c.price) > 0));
    found += Number(j.found) || 0;
    if (j.warning) warned = j.warning;
    /* "sold" wins: once one query came back with real sales, the finding is
       a sold finding even if the second query only had asks in it. */
    if (j.basis === "sold") basis = "sold"; else if (!basis) basis = j.basis || "asking";
    if (comps.length >= 12) break;
  }
  return { comps, basis, warning: warned, found };
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

/* Every /json answer now carries what it cost. Adding it up here is what
   turns --spend from a warning printed before the run into a thing that
   actually stops it, and it reports the REAL total at the end rather than
   the estimate - the estimate is what was wrong on 21 Sep. */
let blind = 0;
let spentUsd = 0;
async function ask(text) {
  const r = await fetch(SERVER + "/json", { method: "POST",
    headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
    body: JSON.stringify({ prompt: text, search: true }) });
  if (!r.ok) throw new Error("service answered " + r.status);
  const j = await r.json();
  if (!j.ok) throw new Error(j.code === "day_cap"
    ? "the service has hit its daily spend cap (DAILY_USD_CAP)" : (j.code || "service said no"));
  if (j.spend && Number(j.spend.usd) > 0) spentUsd += Number(j.spend.usd);
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
  return { comps, basis: sold > comps.length / 2 ? "sold" : "asking", warning: "", found: comps.length };
}

if (VIA !== "ebay" && VIA !== "claude") {
  console.error("\n  --via takes ebay or claude.\n"); process.exit(2);
}
const gather = VIA === "ebay" ? viaEbay : viaClaude;

/* WHAT THE CLAUDE PATH ACTUALLY COSTS.
   This file used to quote $0.02 a lookup. On 21 Sep a run through it cost
   $43.77 - roughly $0.12 a lookup, six times the estimate - and there was
   nothing between the flag and the bill. eBay and SoldComps carry the book
   now, so this path is for the handful of things they do not carry, and it
   has to be asked for deliberately:
     --limit N   how many targets, because an unbounded run is how $43.77
                 happens by accident
     --spend N   the dollars you are agreeing to, checked against the
                 estimate before anything is searched and against the real
                 total as it runs
   Neither has a default. A path that can spend money should not be
   reachable by forgetting a flag. */
const USD_PER_LOOKUP = 0.12;
const SPEND_CAP = Number(arg("spend", 0)) || 0;
if (VIA === "claude" && GO) {
  const why = [];
  if (!(limit > 0)) why.push("--limit N  (how many targets this run may price)");
  if (!(SPEND_CAP > 0)) why.push("--spend N  (the dollars you are agreeing to)");
  if (why.length) {
    console.error("\n  --via claude spends real money against your Anthropic balance.");
    console.error("  A run on 21 Sep cost $43.77. It needs to be bounded:\n");
    why.forEach((w) => console.error("    " + w));
    console.error("\n  eBay and SoldComps price the book for nothing - only use this");
    console.error("  path for things they do not carry.\n");
    process.exit(2);
  }
}

console.log("");
console.log("  Targets in the list      : " + targets.length);
{
  const priced = targets.filter(t => found[key(t)]).length;
  const fresh  = targets.filter(t => found[key(t)] && !needsPricing(t)).length;
  console.log("  Already priced           : " + priced + (STALE_DAYS ? "  (" + fresh + " still fresh, the rest due a recheck)" : ""));
  if (STALE_DAYS) console.log("  Repriced after           : " + STALE_DAYS + " days  (--stale overrides the shelves)");
  else console.log("  Repriced after           : " + STALE_BY_TIER.fast + "d electronics, "
    + STALE_BY_TIER.steady + "d seasonal, " + STALE_BY_TIER.slow + "d tools & the rest, "
    + LOCAL_STALE_DAYS + "d where eBay is blind");
  {
    const ev = eventNow();
    if (ev.length) console.log("  Pulled forward           : " + ev.map(e => e.what).join("; "));
  }
  if (MONTH_CAP) {
    const used = spentThisMonth(), left = Math.max(0, MONTH_CAP - used);
    console.log("  Harvest allowance        : " + used + " of " + MONTH_CAP
      + " used this month, " + left + " left  (the rest of the plan is the counter's)");
  }
}
console.log("  This run                 : " + todo.length);
console.log("  Source                   : " + (VIA === "ebay"
  ? "eBay API - sold prices where the keyset is granted them, asking prices otherwise"
  : "Claude web search - asking prices"));
console.log("  Lookups                  : up to " + todo.length * 2 + "  (a second only when the first is thin)");
console.log("  Rough cost               : " + (VIA === "ebay" ? "nothing - eBay's API is free"
  : "about $" + (todo.length * 2 * USD_PER_LOOKUP).toFixed(2) + " against your Anthropic balance, worst case"
    + (SPEND_CAP > 0 ? "  (stopping at $" + SPEND_CAP.toFixed(2) + ")" : "")));
if (VIA === "claude" && GO && SPEND_CAP > 0 && todo.length * 2 * USD_PER_LOOKUP > SPEND_CAP) {
  console.log("  \u2014 the estimate is over your --spend, so the run will stop part way.");
}
console.log("");
if (!GO) {
  console.log("  Dry run. Nothing was searched and nothing was spent.");
  console.log("  Add --go to run it.\n");
  todo.slice(0, 12).forEach(t => console.log("    " + t.ref + "  " + t.name));
  if (todo.length > 12) console.log("    ... and " + (todo.length - 12) + " more");
  console.log("");
  process.exit(0);
}
if (!TOKEN) {
  console.error("\n  PAWN_TOKEN is not set, so the service will refuse every lookup.");
  console.error("  It is the same token the desk and the phones use - Setup on the");
  console.error("  desk prints it, or Railway holds it under PAWN_TOKEN.\n");
  console.error("    PAWN_TOKEN=... node tools/harvest.js --go\n");
  console.error("  Pointing at " + SERVER + (process.env.PAWN_SERVER ? " (from PAWN_SERVER)" : " (the default)") + "\n");
  process.exit(2);
}

let hit = 0, miss = 0, fails = 0, said = false;
for (let i = 0; i < todo.length; i++) {
  const t = todo[i];
  if (VIA === "claude" && SPEND_CAP > 0 && spentUsd >= SPEND_CAP) {
    console.log(`\n  Stopping: spent $${spentUsd.toFixed(2)} of the $${SPEND_CAP.toFixed(2)} you agreed to.`);
    console.log(`  ${todo.length - i} target(s) left. Raise --spend to carry on.\n`);
    break;
  }
  if (MONTH_CAP && spentThisMonth() >= MONTH_CAP) {
    console.error(`\n  STOPPING: the harvest has used its ${MONTH_CAP} lookups for ${monthKey()}.`);
    console.error(`  The rest of the plan is the counter's - it is what the tool is for.`);
    console.error(`  ${i} of ${todo.length} priced. The rest stay outstanding and come`);
    console.error(`  up first next month. Raise it for one run with --cap N.\n`);
    save();
    process.exit(4);
  }
  const tag = `[${i + 1}/${todo.length}] ${t.name}`;
  if (ebayBlind(t.ref, t.name)) {
    found[key(t)] = { ref: t.ref, name: t.name, n: 0, date: today(), local: true,
      note: "eBay is not allowed to sell this, or nobody ships one - a search returns its parts. Priced from the firearm sites, your own sales and the shelf record instead." };
    blind++; save();
    console.log(`  ${tag} - eBay cannot sell this; not searched`);
    continue;
  }
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
    /* A lookup that failed to complete is NOT the same as eBay having
       nothing, and recording it as such is worse than not recording it:
       the run skips anything already found, so a service that was
       restarting mid-run would permanently poison those rows with an
       answer nobody ever got. Leave it unwritten and the next run
       retries it. */
    fails++;
    continue;
  }
  /* Say the bad news once, not six hundred times. */
  /* A SPENT QUOTA IS NOT A WARNING, IT IS THE END OF THE RUN.
     The service falls back to eBay asking prices when SoldComps will not
     answer, and says why. Two of those reasons are about ONE model - "only
     2 used sales in 90 days" - and carrying on is right there.
     The other two are about the whole month: the quota is spent, or the key
     was rejected. Every remaining target will come back an asking price,
     and asks read high - so the run would spend an evening replacing real
     sold rows with what sellers are hoping for. That is worse than not
     running, and it is silent: the numbers look plausible.
     SoldComps mailed Jace on 25 Sep to say the month was gone. The harvest
     had no idea and would have carried on. A halted week is free. */
  if (got.warning && /quota spent|key rejected/i.test(got.warning)) {
    console.error(`\n  STOPPING: ${got.warning}`);
    console.error(`  Every target left would come back an asking price, and asking`);
    console.error(`  prices merged over sold rows make the book worse, not staler.`);
    console.error(`  ${i} of ${todo.length} priced before this. Nothing is lost - the`);
    console.error(`  rest stay outstanding and come up first next run.\n`);
    save();
    process.exit(3);
  }
  if (got.warning && !said) { said = true; console.log(`\n  ! ${got.warning}\n    Findings from this run are asking prices. They will be graded and labelled as such.\n`); }

  const seen = new Set();
  const uniq = got.comps.filter(c => {
    /* The service classifies parts, but a service that has not been
       redeployed yet does not know the electronics words. Applying the
       same expression here - imported, not copied - means a harvest run
       gets it right today rather than after a deploy, and the two can
       never drift apart. */
    if (ELEC_PART.test(String(c.what || ""))) return false;
    const k = Math.round(c.price) + "|" + String(c.where || "").toLowerCase() + "|" + String(c.what || "").slice(0, 40).toLowerCase();
    if (seen.has(k)) return false; seen.add(k); return true; });
  const ps = uniq.map(c => Math.round(Number(c.price))).filter(n => n > 0).sort((a, b) => a - b);
  if (ps.length < 3) {
    found[key(t)] = { ref: t.ref, name: t.name, n: ps.length, date: today(), note: "no usable listings" };
    miss++; save();
    console.log(`  ${tag} - nothing usable`);
    continue;
  }
  /* IS EBAY ALLOWED TO SELL THIS THING AT ALL. Checked before the lookup
     is paid for, not after. */
  /* IS EBAY EVEN SELLING THIS THING.
     Nobody ships a riding mower, so what gets listed under one is belts and
     spindles. Measured: 36 of 40 listings for a Milwaukee drill are the
     drill; 1 of 36 for a Toro TimeMaster is the mower. Tools 68-90%,
     outdoor power 3-18% - and no amount of filtering moves that, because
     the machines are simply not listed.
     So rather than name the categories by hand and keep being wrong, the
     share decides. Below a third and this is a parts counter, and a price
     built on whatever survived the filter is a price built on leftovers. */
  /* THE SHARE WAS MEASURING THE NOISE, NOT THE ANSWER.
     A Samsung TU7000 came back with six genuine televisions, $50 to $200,
     a coherent price for a coherent set - and was thrown away because
     fourteen stands and boards came back alongside them and six of twenty
     is under a third. The gate was written for a Toro mower that returned
     ONE real machine out of thirty-six, which is a different thing
     entirely: there the survivors cannot carry a price, here they can.
     So both have to be true now. A low share alone is just a noisy
     search; a low share with nothing left standing is a parts counter. */
  const realShare = got.found ? uniq.length / got.found : 1;
  if (got.found >= 10 && realShare < 0.3 && uniq.length < 6) {
    found[key(t)] = { ref: t.ref, name: t.name, n: 0, date: today(), local: true,
      note: `eBay can't price this - only ${uniq.length} of ${got.found} listings were the machine, the rest were spare parts. Nothing wrong with the item; it sells locally, so the shelf record and your own sales are what price it.` };
    miss++; save();
    console.log(`  ${tag} - eBay can't price it: ${uniq.length}/${got.found} listings were the machine (sells locally)`);
    continue;
  }
  /* Which of these listings are actually the thing the catalogue row means. */
  const B = bandOf(uniq);
  if (B.use === "thin") {
    found[key(t)] = { ref: t.ref, name: t.name, n: 0, date: today(),
                      note: B.why, kit: B.kit, bare: B.bareOnly };
    miss++; save();
    console.log(`  ${tag} - held back: ${B.why}`);
    continue;
  }
  const used = B.use === "kit" ? uniq.filter(c => c.fit === "kit") : uniq;
  const usedPs = used.map(c => Math.round(Number(c.price))).filter(n => n > 0).sort((a, b) => a - b);
  const sold = used.filter(c => c.basis === "sold").length;
  const share = sold / usedPs.length;
  const basis = got.basis === "sold" && share >= 0.5 ? "sold" : "asking";
  const w = wildness(t.ref, pct(usedPs, 0.5));
  /* Asks read high - the ones that sold are the ones that left the index.
     A row built on asks can never be graded high, whatever its count. */
  const conf = basis !== "sold" ? (ps.length >= 6 ? "m" : "l")
    : (ps.length >= 6 && share >= 0.6) ? "h" : (ps.length >= 4 ? "m" : "l");
  found[key(t)] = {
    wild: !!(w && w.wild), ratio: w ? w.ratio : null, book: w ? w.book : null,
    ref: t.ref, name: t.name, alias: t.alias || "",
    n: usedPs.length, seen: ps.length, sold, basis, via: VIA,
    band: B.use, kit: B.kit, bare: B.bareOnly,
    lo: pct(usedPs, 0.25), hi: pct(usedPs, 0.75), med: pct(usedPs, 0.5),
    conf,
    date: today(),
    src: "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(t.name) + "&LH_Sold=1&LH_Complete=1",
    note: (B.use === "kit" ? "complete kits only - " : "")
      + (basis === "sold"
        ? `${usedPs.length} eBay sales in the last 90 days`
        : `${usedPs.length} listings, asking prices - no sold data`),
  };
  hit++; save();
  const f = found[key(t)];
  console.log(`  ${tag} - ${money(f.lo)}-${money(f.hi)}  (${f.n} ${f.basis === "sold" ? "sold" : "asks"}` +
    (B.use === "kit" ? ", kits" : "") + `, ${f.conf})` +
    (B.use === "kit" && B.bareOnly ? `  [bare would have been ${money(B.bareOnly.lo)}-${money(B.bareOnly.hi)}]` : "") +
    (f.wild ? `  ** ${f.ratio}x the catalog's ${money(f.book)} - check this one **` : ""));
}
const wilds = Object.values(found).filter(f => f && f.wild).length;
const soldRows = Object.values(found).filter(f => f && f.basis === "sold").length;
if (fails) console.log(`\n  ! ${fails} lookup(s) never completed - left unrecorded so the next run retries them.`);
console.log(`\n  ${hit} priced, ${miss} with nothing usable` +
  (wilds ? `, ${wilds} outside the sanity band and held back` : "") + `. Findings in ${OUT}.`);
console.log(`  ${soldRows} of them are built on sold prices; the rest are asking prices and read high.`);
console.log(`  Review them, then: node tools/harvest.js --merge   (add --sold-only to take just the sold ones)\n`);

/* ---- CAN EBAY PRICE THIS AISLE AT ALL? ----------------------------------
 * The per-model check above already says "eBay can't price this" when a
 * search comes back as a parts counter. Nothing rolled those up, so
 * deciding whether a whole KIND of thing is worth searching was a person
 * reading the log - and a person reading a log is how "12 priced" got
 * mistaken for twelve good rows when eight of them were treadmill belts
 * sold eight times each.
 *
 * A row only counts here if it is built on sold prices AND lands inside
 * the sanity band AND its quartiles are within 3x. The share of a
 * category's models that clear all three is the verdict, and a category
 * that cannot clear a quarter of them belongs on the desk's blind list
 * next to the televisions, the quads and the mowers.
 */
{
  const byRef = new Map();
  for (const f of Object.values(found)) {
    if (!f || !f.ref) continue;
    if (!byRef.has(f.ref)) byRef.set(f.ref, []);
    byRef.get(f.ref).push(f);
  }
  const verdicts = [];
  for (const [ref, list] of byRef) {
    /* only judge an aisle this run actually touched */
    if (!list.some(f => f.date === today())) continue;
    let good = 0, usable = 0;
    for (const f of list) {
      /* `local` is set when the desk ALREADY knows eBay is blind here and
         skipped the search. Counting those as failures made the verdict
         circular - a quad scored 0/3 and was recommended for the blind
         list it is already on, on the strength of three searches that
         never happened. The first version of this matched the console
         string rather than the record, which does not even contain it. */
      if (f.local) continue;
      usable++;
      const spread = f.lo > 0 ? f.hi / f.lo : 99;
      if (f.basis === "sold" && !f.wild && f.med && spread < 3) good++;
    }
    if (usable < 3) continue;
    verdicts.push({ ref, n: usable, good, share: good / usable });
  }
  verdicts.sort((a, b) => a.share - b.share);
  const blind = verdicts.filter(v => v.share < 0.25);
  if (verdicts.length) {
    console.log("  Can eBay price this kind of thing?");
    for (const v of verdicts)
      console.log(`    ${v.ref.padEnd(6)} ${String(v.good).padStart(3)}/${String(v.n).padEnd(3)} clean sold rows` +
        `   ${v.share >= 0.5 ? "yes" : v.share >= 0.25 ? "thin" : "NO - it sells locally"}`);
    if (blind.length)
      console.log(`\n  Put on the desk's blind list (ebayBlind in app.js): ${blind.map(v => v.ref).join(", ")}` +
        `\n  Each is under a quarter clean rows - the searches are finding parts and accessories,` +
        `\n  so every lookup there spends the quota to hand the counter a number for a belt.\n`);
  }
}
