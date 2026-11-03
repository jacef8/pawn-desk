#!/usr/bin/env node
/* THE SOLD PRICE PASS, OVER THE WHOLE BOOK.
 *
 *   node tools/sold-pass.mjs                  what it would do, spends nothing
 *   node tools/sold-pass.mjs --go --limit 25  do 25
 *   node tools/sold-pass.mjs --go             do the lot
 *
 * NEEDS SOLDCOMPS_KEY in the environment. Not in a file, not in the
 * repository, not pasted into a chat: it goes in the session environment's
 * settings as a variable called SOLDCOMPS_KEY and this reads it from
 * process.env, the same way tools/soldcomps-test.mjs has since September.
 * That is how the first pass ran. Nothing here ever prints it.
 *
 * WHY IT EXISTS. Asked on 3 Nov: "when is the last time we pulled sold
 * comps". 23 and 24 September. 309 rows over two days and nothing since -
 * everything after is an asking price, because eBay refused the Marketplace
 * Insights scope on the 23rd. 219 of the 523 rows in the book have never
 * had a sale behind them at all.
 *
 * WHAT IT COSTS. One lookup a row. The plan is 2,000 a month and the whole
 * non-gun book is about 446, so a full pass is roughly a fifth of a month.
 * It prints the count as it goes and stops the moment the service says the
 * quota is gone, rather than grinding through 300 failures.
 *
 * WHAT IT WILL NOT TOUCH. Guns and anything on wheels. eBay sells neither,
 * so SoldComps has nothing real on either, and a median built out of
 * holsters and trailer couplings is a number with nothing behind it.
 *
 * THE TWO FILTERS ARE NOT REIMPLEMENTED HERE. server/soldcomps.js already
 * drops new stock and anything older than 90 days, and both were learned
 * the hard way - a third to half of every sample came back BRAND NEW, and
 * priced together with the used ones they read 11% ABOVE the asking prices
 * they were meant to correct. This imports that module rather than writing
 * the rules out again, so the two cannot drift.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { soldCompsFetch } from "../server/soldcomps.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const has = (f) => argv.includes("--" + f);
const arg = (f, d) => { const i = argv.indexOf("--" + f); return i >= 0 ? argv[i + 1] : d; };
const GO = has("go");
const LIMIT = Number(arg("limit", 0)) || 0;

const KEY = process.env.SOLDCOMPS_KEY;
if (GO && !KEY) {
  console.error("\n  SOLDCOMPS_KEY is not set in this environment.\n" +
                "  It goes in the environment's settings as a variable of that name.\n" +
                "  A new session picks it up. Nothing was spent.\n");
  process.exit(1);
}

/* ---- the targets ------------------------------------------------------
   The book itself, not the seed list: these are the rows a price actually
   lands on. [id, cat, name, lo, hi, conf, date, src, note] */
const BLIND = new Set(["g1","g2","g3","g4","g5","g6","g7","g8","g9","g10","r1","r2"]);
/* AND THE 141 ROWS THAT CARRY A NAME WHERE THE ITEM ID SHOULD BE. Two of
   them are "SKS rifle" and "AK-pattern rifle"; eight more are "UTV /
   side-by-side" and "Golf cart". Every one of those went straight past the
   id check on the first dry run of this file, which is the only reason it
   was caught before a single lookup was spent. Same words the desk uses. */
const BLIND_WORDS = /\b(gun|guns|rifle|shotgun|pistol|revolver|firearm|carbine|muzzleloader|ar-?15|ak-?(47|pattern)|sks)\b|\b(atv|utv|side.by.side|golf cart|four.wheeler|quad|go.kart|dirt bike|moped|scooter|motorcycle|trailer)\b/i;
const blind = (cat, name) => BLIND.has(String(cat || "")) ||
  (!/^[a-z]+[0-9]+[a-z]?$/.test(String(cat || "")) &&
   (BLIND_WORDS.test(String(cat || "")) || BLIND_WORDS.test(String(name || ""))));
const rows = JSON.parse(readFileSync(join(ROOT, "prices.json"), "utf8")).rows;

/* Which rows have ever had a sale behind them. Those that have not go
   first: a row priced off nothing is worth more than a row priced off a
   six-week-old sale. */
let everSold = new Set();
try {
  const h = JSON.parse(readFileSync(join(ROOT, "tools/harvest-history.json"), "utf8")).rows;
  for (const [key, evs] of Object.entries(h))
    if (evs.some((e) => e[3] === "sold")) everSold.add(key.toLowerCase());
} catch (e) {}
const histKey = (r) => (String(r[1]) + "|" + String(r[2])).toLowerCase();

const targets = rows
  .filter((r) => !blind(r[1], r[2]))
  .map((r) => ({ key: r[0], cat: r[1], name: r[2], lo: r[3], hi: r[4], date: r[6],
                 cold: !everSold.has(histKey(r)) }))
  .sort((a, b) => (b.cold - a.cold) || String(a.date).localeCompare(String(b.date)));

const todo = LIMIT ? targets.slice(0, LIMIT) : targets;
const cold = todo.filter((t) => t.cold).length;

console.log(`\n  ${rows.length} rows in the book. ${rows.length - targets.length} are guns or on wheels and are skipped.`);
console.log(`  ${targets.length} can be priced. ${targets.filter((t) => t.cold).length} have never had a sale behind them.`);
console.log(`  This run: ${todo.length} rows, ${cold} of them cold, one lookup each.\n`);

if (!GO) {
  console.log("  Dry run. Nothing was spent and nothing was written.");
  console.log("  Add --go to do it, --limit 25 to do a few first.\n");
  todo.slice(0, 12).forEach((t) => console.log(`    ${t.cold ? "cold" : "    "}  ${t.key.padEnd(6)} ${t.name}`));
  if (todo.length > 12) console.log(`    ... and ${todo.length - 12} more`);
  console.log("");
  process.exit(0);
}

/* ---- the run ---------------------------------------------------------- */
const got = [], skipped = [];
let spent = 0, stop = "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const q25 = (v, p) => { const i = (v.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
                        return Math.round(v[lo] + (v[hi] - v[lo]) * (i - lo)); };

for (let i = 0; i < todo.length; i++) {
  const t = todo[i];
  let out = null;
  try {
    out = await soldCompsFetch({ q: t.name, limit: 40, kind: "", env: process.env });
    spent++;
  } catch (e) {
    const code = (e && e.code) || String(e && e.message || e);
    /* A SPENT QUOTA IS NOT A ROW THAT FAILED. Grinding on would turn one
       real answer into three hundred identical errors and make the log
       useless for seeing which rows are genuinely thin. */
    if (code === "soldcomps_quota" || code === "soldcomps_auth") { stop = code; break; }
    skipped.push({ ...t, why: code });
    console.log(`  skip  ${t.key} ${t.name} — ${code}`);
    continue;
  }

  /* Parts, lots and the wrong model, dropped the same way the service
     drops them for the desk. */
  const comps = out.comps.filter((c) => c.fit !== "part" && c.fit !== "lot" && c.fit !== "wrong");
  const vals = comps.map((c) => Math.round(c.price)).filter((n) => n > 0).sort((a, b) => a - b);
  if (vals.length < 4) {
    skipped.push({ ...t, why: `only ${vals.length} used sale(s) in 90 days, need 4` });
    console.log(`  skip  ${t.key} ${t.name} — ${vals.length} sales`);
  } else {
    const lo = q25(vals, 0.25), hi = q25(vals, 0.75), med = q25(vals, 0.5);
    const was = (t.lo + t.hi) / 2, now = (lo + hi) / 2;
    const move = was > 0 ? Math.round((now - was) / was * 100) : 0;
    /* ONE NAME, MORE THAN ONE THING - the same rule the gun reader uses.
       A row whose middle half spans more than two to one is a family, not
       a price, and it is reported rather than applied. */
    const wide = lo > 0 && hi / lo > 2;
    got.push({ ...t, newLo: lo, newHi: hi, med, n: vals.length, move, wide,
               newStock: out.skipped.newStock, stale: out.skipped.stale });
    console.log(`  ${wide ? "WIDE" : "sold"}  ${t.key} ${t.name} — $${lo}-$${hi} off ${vals.length}` +
                ` (book $${t.lo}-$${t.hi}, ${move >= 0 ? "+" : ""}${move}%)` +
                (wide ? "   <-- held back" : ""));
  }
  if (i < todo.length - 1) await sleep(400);
}

/* ---- what it wrote ----------------------------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const out = (ext) => join(process.cwd(), `sold-pass-${today}.${ext}`);
const firm = got.filter((g) => !g.wide), held = got.filter((g) => g.wide);
const esc = (s) => /[",\n]/.test(String(s)) ? '"' + String(s).replace(/"/g, '""') + '"' : String(s);

writeFileSync(out("csv"), ["Key,Item,Your low,Your high"]
  .concat(firm.map((g) => [g.key, g.name, g.newLo, g.newHi].map(esc).join(","))).join("\n") + "\n");

const L = [];
L.push(`# Sold prices read ${today}`, "");
L.push(`Read ${got.length} of ${todo.length}. Skipped ${skipped.length}. In the CSV: ${firm.length}.`,
       `Lookups spent: ${spent}.`, "");
L.push("These are SOLD PRICES. What the thing actually went for on eBay in the",
       "last 90 days, used condition only, through SoldComps. Not asking prices.",
       "This is the first sold pass since 24 September.", "");
if (stop) L.push(`## IT STOPPED EARLY — ${stop}`, "",
  stop === "soldcomps_quota"
    ? "The month's lookups are gone. What is below was read properly and can be applied; everything else keeps its old date."
    : "The key was refused. Nothing below this point was read.", "");
if (held.length) {
  L.push("## Held back — one name, more than one thing", "",
    "Wider than two to one, which no single used item is. Not in the CSV.", "",
    "| key | item | book | read | off how many | spread |", "|---|---|---|---|---|---|");
  held.forEach((g) => L.push(`| ${g.key} | ${g.name} | $${g.lo}-$${g.hi} | $${g.newLo}-$${g.newHi} | ${g.n} | ${(g.newHi / g.newLo).toFixed(1)}x |`));
  L.push("");
}
const big = firm.filter((g) => Math.abs(g.move) >= 25).sort((a, b) => Math.abs(b.move) - Math.abs(a.move));
if (big.length) {
  L.push("## Moved 25% or more — look at these first", "", "| key | item | book | read | off how many | move |", "|---|---|---|---|---|---|");
  big.forEach((g) => L.push(`| ${g.key} | ${g.name} | $${g.lo}-$${g.hi} | $${g.newLo}-$${g.newHi} | ${g.n} | ${g.move >= 0 ? "+" : ""}${g.move}% |`));
  L.push("");
}
L.push("## Everything read", "", "| key | item | book | read | off how many | new stock dropped | move |", "|---|---|---|---|---|---|---|");
got.forEach((g) => L.push(`| ${g.key} | ${g.name} | $${g.lo}-$${g.hi} | $${g.newLo}-$${g.newHi} | ${g.n} | ${g.newStock} | ${g.move >= 0 ? "+" : ""}${g.move}% |`));
L.push("");
if (skipped.length) {
  L.push("## Skipped, and why", "", "| key | item | why |", "|---|---|---|");
  skipped.forEach((s) => L.push(`| ${s.key} | ${s.name} | ${s.why} |`));
  L.push("");
}
writeFileSync(out("md"), L.join("\n"));

console.log(`\n  read ${got.length} of ${todo.length}, ${spent} lookups spent`);
console.log(`  ${out("csv")}`);
console.log(`  ${out("md")}`);
if (stop) console.log(`\n  STOPPED EARLY: ${stop}. Read the log before applying anything.`);
console.log("");
process.exit(stop ? 1 : 0);
