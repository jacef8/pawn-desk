/* HOW REPEATABLE IS AN ITEM PRICE? Measured, before trusting one.
   The counter asked for trends on items, the same as the metals got. The
   first thing to do was look at whether the item history can carry a trend
   read at all. It cannot, and the reason is worth writing down.

   tools/harvest-history.json records a row every time a re-search comes
   back with a DIFFERENT range. Read those pairs and you are not reading
   the market moving - you are reading the same question asked twice and
   answered differently, because eBay handed back a different basket of
   listings. A Stihl MS 250 does not change value 20% in three days.

   So the number this prints is not a trend. It is the tool's own
   measurement error, and it is the right guard for an item price: how far
   the midpoint on screen could be from the midpoint the same search would
   give tomorrow.

     node tools/measure-noise.mjs            print the figures
     node tools/measure-noise.mjs --write    write them into item-noise.json

   Re-run it as the history fills. When the same rows start moving the SAME
   WAY over months rather than scattering over days, that is a trend and
   this file is where it will show up first. */
import {readFileSync, writeFileSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WRITE = process.argv.includes("--write");

const H = JSON.parse(readFileSync(join(ROOT, "tools/harvest-history.json"), "utf8"));
const rows = H.rows || H;
const q = (a, p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
const mid = e => (e[1] + e[2]) / 2;
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

/* every pair of consecutive measurements of the SAME row */
const pairs = [];
for (const [k, v] of Object.entries(rows))
  for (let i = 1; i < v.length; i++)
    if (mid(v[i - 1]) > 0)
      pairs.push({key: k, gap: days(v[i - 1][0], v[i][0]),
                  from: v[i - 1][0], to: v[i][0],
                  move: mid(v[i]) / mid(v[i - 1]) - 1});

/* the spread inside a single search - how wide the listings themselves ran */
const spreads = [];
for (const v of Object.values(rows))
  for (const e of v) if (mid(e) > 0) spreads.push((e[2] - e[1]) / mid(e));
spreads.sort((a, b) => a - b);

/* A DAY WHERE EVERYTHING MOVED THE SAME WAY IS THE TOOL, NOT THE MARKET.
   The 19->22 September run has 24 rows out of 24 up, median +20%. Chainsaws,
   bows, scopes and laptops do not all gain a fifth in three days. What
   happened is that the source changed underneath: SoldComps ran out of
   quota and the ladder fell through to eBay's asking prices, which sit
   above sold prices. That is a step change in what is being measured.
   Left in, it poisons the noise figure and, worse, would read as a rising
   market. So any run-pair where nearly everything moves one way is set
   aside and reported separately. */
const runs = {};
for (const p of pairs) { const k = p.key2 = p.from + ">" + p.to; (runs[k] ||= []).push(p); }
const steps = [], clean = [];
for (const [k, g] of Object.entries(runs)) {
  const up = g.filter(x => x.move > 0).length;
  const oneWay = g.length >= 8 && (up / g.length >= 0.9 || up / g.length <= 0.1);
  if (oneWay) steps.push({run: k, n: g.length, up,
                          median: +(100 * g.map(x => x.move).sort((a, b) => a - b)[Math.floor(g.length / 2)]).toFixed(1)});
  else clean.push(...g);
}

const abs = clean.map(p => Math.abs(p.move)).sort((a, b) => a - b);
const up = clean.filter(p => p.move > 0).length;
const allDates = Object.values(rows).flat().map(e => e[0]).sort();

const out = {
  built: new Date().toISOString().slice(0, 10),
  source: "tools/harvest-history.json",
  from: allDates[0], to: allDates[allDates.length - 1],
  spanDays: days(allDates[0], allDates[allDates.length - 1]),
  rows: Object.keys(rows).length,
  rechecked: Object.values(rows).filter(v => v.length > 1).length,
  pairs: pairs.length,
  usable: clean.length,
  /* runs where the whole book moved one way - the source changed, not the market */
  stepChanges: steps,
  gapLo: Math.min(...pairs.map(p => p.gap)), gapHi: Math.max(...pairs.map(p => p.gap)),
  /* the headline: the same search, days apart, on a thing that did not change */
  noiseMid: +(q(abs, .50) * 100).toFixed(1),
  noise75: +(q(abs, .75) * 100).toFixed(1),
  noise90: +(q(abs, .90) * 100).toFixed(1),
  upShare: clean.length ? Math.round(100 * up / clean.length) : null,
  spreadMid: +(q(spreads, .50) * 100).toFixed(0),
  spread75: +(q(spreads, .75) * 100).toFixed(0),
  spread90: +(q(spreads, .90) * 100).toFixed(0),
  /* A trend read needs the same rows measured repeatedly over MONTHS and
     leaning one way. This says whether that is true yet. It is not. */
  trendReady: false
};
out.trendReady = out.spanDays >= 120 && out.usable >= 200;

console.log(`history: ${out.rows} rows, ${out.from} to ${out.to} (${out.spanDays} days)`);
console.log(`${out.rechecked} rows re-searched, ${out.pairs} before/after pairs, ${out.gapLo}-${out.gapHi} days apart`);
for (const s2 of steps)
  console.log(`  SET ASIDE ${s2.run}: ${s2.up}/${s2.n} rows moved the same way, median ${s2.median}%` +
              ` - that is the source changing, not the market`);
console.log(`${out.usable} pairs left to measure noise from\n`);
console.log(`  same item, re-searched: median move ${out.noiseMid}%  p75 ${out.noise75}%  p90 ${out.noise90}%`);
console.log(`  ${out.upShare}% of them went up - a real trend leans one way, noise sits near 50%`);
console.log(`  lo-hi spread inside one search: median ${out.spreadMid}%  p75 ${out.spread75}%  p90 ${out.spread90}%\n`);
console.log(out.trendReady
  ? "  ENOUGH HISTORY for a trend read - months of repeats, and they lean."
  : `  NOT a trend read. ${out.spanDays} days of history and ${out.pairs} pairs is measurement\n` +
    `  error, not a market moving. Needs ~120 days and ~200 pairs before the\n` +
    `  question can even be asked. What it IS good for: knowing how much the\n` +
    `  number on screen could be wrong by.`);

if (WRITE) { writeFileSync(join(ROOT, "item-noise.json"), JSON.stringify(out)); console.log("\nwrote item-noise.json"); }
