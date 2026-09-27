/* WHAT A 60-DAY HOLD HAS ACTUALLY COST, MEASURED.
   The gold page used to trim the rate off three hand-set thresholds: 5% over
   the 90-day average trim 4, 8% over trim 8, 15% over trim 10. Reasonable
   guesses, and never checked against anything.

   This checks them. It reads every LBMA fixing back to 2000, and for every
   single day asks: if I had taken metal in at that price and still been
   holding it 60 calendar days later - which is the pawn window, 30 days to
   maturity plus the 30 the statute makes you hold it - what would it have
   been worth? Then it sorts those answers and keeps the bad tail.

   The number that matters is the 5th percentile: one hold in twenty went at
   least this far against you. That is the haircut. It is not a forecast and
   it is not an opinion - it is what the last quarter-century did.

   Two things turn out to condition it, and only one of them was in the old
   rule:
     - how far spot sits over its own 90-day average (the old rule's input)
     - how VIOLENTLY the metal is moving right now, measured as 30-day
       realised volatility against its own history

   The second one is the bigger lever and the tool was blind to it. Gold's
   5th-percentile 60-day loss is 6.5% when it is calm and 12.1% when it is
   violent. Today it is violent and sitting right on its 90-day average, so
   the old rule reads "nothing unusual happening" and trims nothing.

     node tools/build-metal-risk.mjs            (writes both files)
     node tools/build-metal-risk.mjs --dry      (prints the table, writes nothing)

   Re-run it whenever you want the table to learn from another few months of
   prices. It writes:
     metals-risk.json     the lookup table the desk reads
     metals-history.json  two years of daily fixings, for the chart and for
                          working out today's premium and volatility */
import {writeFileSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/* The London fixings, free and authoritative - these are the prices the
   refiners settle against, which is what a scrap buyer is paid on. */
const SRC = {gold: "https://prices.lbma.org.uk/json/gold_pm.json",
             silver: "https://prices.lbma.org.uk/json/silver.json"};
const FROM = "2000-01-01";
const HOLD = 42;        /* fixings ~ 60 calendar days - the pawn window */
/* A BUY IS NOT A LOAN AND MUST NOT CARRY THE LOAN'S HAIRCUT.
   Metal you have bought is yours the moment it crosses the counter: it goes
   in the next refiner lot and the money is back in days, not sixty. So the
   buy side is measured over a SHORT hold, and it comes out a fraction of
   the loan's risk - which is the whole reason the two prices differ. */
const QUICK = 7;        /* fixings ~ 10 calendar days - the buy window */

async function pull(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(url + " -> " + r.status);
  const rows = await r.json();
  const out = [];
  for (const x of rows) {
    const v = (x.v || [])[0];
    if (v != null && Number(v) > 0) out.push([x.d, Number(v)]);
  }
  out.sort((a, b) => a[0] < b[0] ? -1 : 1);
  return out;
}

const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];

/* 30-day realised volatility, annualised - the standard measure, so the
   number can be checked against anybody else's. */
function volAt(lr, i) {
  const w = lr.slice(Math.max(0, i - 21), i);
  if (w.length < 15) return null;
  return sd(w) * Math.sqrt(252);
}

/* The premium buckets keep the old rule's shape so the two can be compared
   directly. The volatility bands are the metal's OWN history, not a fixed
   percentage: 40% annualised is ordinary for silver and unheard of for gold. */
const PREM = [[-9, -0.05, "under"], [-0.05, 0.05, "at"], [0.05, 0.10, "warm"],
              [0.10, 0.15, "hot"], [0.15, 9, "spike"]];
const VOL  = [[0, .33, "calm"], [.33, .66, "normal"], [.66, .85, "busy"], [.85, 1.01, "violent"]];

function analyse(series) {
  const d = series.filter(r => r[0] >= FROM);
  const v = d.map(r => r[1]);
  const lr = [];
  for (let i = 1; i < v.length; i++) lr.push(Math.log(v[i] / v[i - 1]));
  const vols = v.map((_, i) => volAt(lr, i));
  const known = vols.filter(x => x != null).sort((a, b) => a - b);
  const cuts = VOL.map(b => pct(known, b[1]));

  const obs = [];
  for (let i = 63; i < v.length - HOLD; i++) {
    if (vols[i] == null) continue;
    const a90 = mean(v.slice(i - 62, i + 1));
    obs.push({prem: (v[i] - a90) / a90, vol: vols[i], fwd: v[i + HOLD] / v[i] - 1,
              quick: v[i + QUICK] / v[i] - 1});
  }

  const band = (rows, label) => {
    const f = rows.map(r => r.fwd).sort((a, b) => a - b);
    const q = rows.map(r => r.quick).sort((a, b) => a - b);
    if (f.length < 60) return null;
    return {n: f.length,
            q5: +(pct(q, .05) * 100).toFixed(1),
            /* overlapping windows, so the honest sample is n/HOLD */
            indep: Math.round(f.length / HOLD),
            p5: +(pct(f, .05) * 100).toFixed(1),
            p10: +(pct(f, .10) * 100).toFixed(1),
            mid: +(pct(f, .50) * 100).toFixed(1),
            down: Math.round(100 * f.filter(x => x < 0).length / f.length),
            worst: +(f[0] * 100).toFixed(1),
            label};
  };

  const byVol = {}, byPrem = {};
  VOL.forEach((b, i) => {
    const lo = i ? cuts[i - 1] : 0, hi = cuts[i];
    byVol[b[2]] = band(obs.filter(o => o.vol >= lo && o.vol < (i === VOL.length - 1 ? 1e9 : hi)), b[2]);
  });
  PREM.forEach(([lo, hi, k]) => { byPrem[k] = band(obs.filter(o => o.prem >= lo && o.prem < hi), k); });

  const all = band(obs, "all");
  return {from: d[0][0], to: d[d.length - 1][0], fixings: d.length,
          volCuts: cuts.slice(0, 3).map(x => +(x * 100).toFixed(1)),
          all, byVol, byPrem};
}

const out = {built: new Date().toISOString().slice(0, 10),
             source: "LBMA daily fixings, prices.lbma.org.uk",
             holdDays: 60, quickDays: 10, note: "Forward return over ~60 calendar days. p5 = one hold in twenty was at least this bad.",
             metals: {}};
const hist = {built: out.built, source: out.source, days: {}};

for (const [metal, url] of Object.entries(SRC)) {
  const rows = await pull(url);
  out.metals[metal] = analyse(rows);
  /* two years of dailies ride along, for the chart and for working out
     today's premium and volatility on the device */
  const cut = new Date(Date.now() - 760 * 864e5).toISOString().slice(0, 10);
  hist.days[metal] = rows.filter(r => r[0] >= cut).map(r => [r[0], +r[1].toFixed(2)]);
  const m = out.metals[metal];
  console.log(`\n== ${metal}  ${m.fixings} fixings ${m.from} -> ${m.to}`);
  console.log(`   volatility bands: calm <${m.volCuts[0]}%  normal <${m.volCuts[1]}%  busy <${m.volCuts[2]}%  violent above`);
  console.log(`   all days          p5 ${m.all.p5}%   worst ${m.all.worst}%   down ${m.all.down}% of the time`);
  for (const k of ["calm", "normal", "busy", "violent"]) {
    const b = m.byVol[k];
    if (b) console.log(`   vol ${k.padEnd(8)} n=${String(b.n).padStart(4)} (~${b.indep} indep)  60-day p5 ${String(b.p5).padStart(6)}%   10-day p5 ${String(b.q5).padStart(6)}%   down ${b.down}%`);
  }
  for (const k of ["under", "at", "warm", "hot", "spike"]) {
    const b = m.byPrem[k];
    if (b) console.log(`   prem ${k.padEnd(7)} n=${String(b.n).padStart(4)} (~${b.indep} independent)  p5 ${String(b.p5).padStart(6)}%  down ${b.down}%`);
  }
}

if (DRY) { console.log("\n--dry: nothing written"); process.exit(0); }
writeFileSync(join(ROOT, "metals-risk.json"), JSON.stringify(out));
writeFileSync(join(ROOT, "metals-history.json"), JSON.stringify(hist));
console.log("\nwrote metals-risk.json and metals-history.json");
