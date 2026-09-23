#!/usr/bin/env node
/* Does SoldComps tell the truth?
 *
 * Everything in prices.json that came from eBay is an ASKING price, because
 * Marketplace Insights is not granted. SoldComps sells sold prices through
 * an API and permits commercial use on every plan, including the free 100
 * requests a month. If its numbers are real, the whole problem costs $9/mo.
 *
 * "If" is the word. This does not take the vendor's word for it.
 *
 * THE CONTROL. eBay's own Product Research says the Barnett crossbow search
 * averaged $308.45 sold over 90 days. That number came from eBay, through
 * Jace's own Seller Hub, and it is the only sold figure here that is beyond
 * doubt. If SoldComps lands near it, the rest of its answers are worth
 * something. If it does not, nothing else it says matters and we stop.
 *
 * Then the other eleven from the worksheet, each against the asking median
 * and average measured on 22 Sep, to get the ask-to-sold ratio the price
 * book has been waiting on.
 *
 *   SOLDCOMPS_KEY=sc_... node tools/soldcomps-test.mjs
 *
 * 12 queries against a 100-request free tier. Failed requests do not count
 * against quota, so a wrong key costs nothing.
 */
const KEY = process.env.SOLDCOMPS_KEY;
if (!KEY) { console.error("\n  Set SOLDCOMPS_KEY first (it starts with sc_).\n"); process.exit(1); }

const BASE = "https://api.sold-comps.com";

/* asking median and average, measured 22 Sep off the eBay Browse API,
   parts and junk filtered the same way both times */
const TARGETS = [
  { q: "barnett crossbow package scope", askMed: 270,  askAvg: 305,  control: 308.45 },
  { q: "bear archery compound bow",      askMed: 230,  askAvg: 228 },
  { q: "dewalt dcd777",                  askMed: 42,   askAvg: 50 },
  { q: "dewalt dcn692",                  askMed: 265,  askAvg: 262 },
  { q: "dyson v8 cordless stick vacuum", askMed: 169,  askAvg: 168 },
  { q: "hitachi nr83a framing nailer",   askMed: 288,  askAvg: 270 },
  { q: "milwaukee 2744",                 askMed: 283,  askAvg: 255 },
  { q: "milwaukee 2745",                 askMed: 255,  askAvg: 207 },
  { q: "milwaukee 2904",                 askMed: 95,   askAvg: 99 },
  { q: "paslode framing nailer",         askMed: 122,  askAvg: 121 },
  { q: "ravin crossbow",                 askMed: 1000, askAvg: 1057 },
  { q: "shark upright vacuum cleaner",   askMed: 135,  askAvg: 148 },
];

const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1;
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null);
/* the same junk filter used on the asking side - comparing a clean median
   against a dirty one would invent a gap that is not there */
const junk = (t) => /\b(parts?|repair|for parts|not working|broken|charger only|battery only|case only|bag only|manual|sticker|decal|lot of|\d+\s*pack|filter|hose|attachment|replacement|belt|string|cable|arrow|bolt|scope only|mount|limb)\b/i.test(t);

async function pull(keyword) {
  const u = new URL(BASE + "/v1/scrape");
  u.searchParams.set("keyword", keyword);
  u.searchParams.set("count", "40");
  const r = await fetch(u, { headers: { Authorization: "Bearer " + KEY, Accept: "application/json" } });
  const body = await r.text();
  if (!r.ok) throw Object.assign(new Error("HTTP " + r.status), { status: r.status, body: body.slice(0, 300) });
  let j; try { j = JSON.parse(body); } catch (e) { throw new Error("not JSON: " + body.slice(0, 200)); }
  const list = j.items || j.listings || j.results || j.data || (Array.isArray(j) ? j : []);
  const rows = list.map((x) => ({
    p: Number(x.soldPrice ?? x.price ?? 0),
    t: String(x.title || ""),
    when: x.endedAt || x.soldDate || "",
    cond: x.condition || "",
    offer: !!x.bestOfferAccepted,
  })).filter((x) => x.p > 0);
  return { raw: list.length, rows, shape: Object.keys(list[0] || {}).slice(0, 12) };
}

console.log("\n  SoldComps — does it tell the truth?\n");
const out = [];
let firstShape = null;

for (const t of TARGETS) {
  try {
    const { raw, rows, shape } = await pull(t.q);
    if (!firstShape) { firstShape = shape; console.log("  fields returned: " + shape.join(", ") + "\n"); }
    const clean = rows.filter((r) => !junk(r.t));
    const ps = clean.map((r) => r.p);
    const m = med(ps), a = avg(ps);
    const offers = clean.filter((r) => r.offer).length;
    out.push({ ...t, n: ps.length, raw, med: m, avg: a, offers });

    if (t.control != null) {
      const gap = a ? (a / t.control - 1) * 100 : null;
      console.log("  CONTROL  " + t.q);
      console.log(`    eBay Product Research said   $${t.control.toFixed(2)}`);
      console.log(`    SoldComps says               $${a} avg / $${m} median  (n=${ps.length} of ${raw})`);
      console.log(gap == null ? "    -> no data"
        : `    -> ${gap >= 0 ? "+" : ""}${gap.toFixed(1)}% against the control  ${Math.abs(gap) <= 15 ? "PASS" : "*** FAILS — stop here ***"}\n`);
    } else {
      console.log(`  ${t.q.padEnd(34)} sold $${String(a).padStart(5)} avg  vs ask $${String(t.askAvg).padStart(5)}  ` +
        `= ${a ? (a / t.askAvg).toFixed(2) : "-"}x   (n=${String(ps.length).padStart(2)}${offers ? ", " + offers + " best-offer" : ""})`);
    }
    await new Promise((r) => setTimeout(r, 1100));      /* 60/min */
  } catch (e) {
    console.log(`  ${t.q.padEnd(34)} FAILED  ${e.message}${e.body ? "  " + e.body : ""}`);
  }
}

const ratios = out.filter((o) => o.control == null && o.avg && o.askAvg).map((o) => o.avg / o.askAvg);
if (ratios.length >= 4) {
  const r = med(ratios.map((v) => Math.round(v * 100))) / 100;
  const lo = Math.min(...ratios).toFixed(2), hi = Math.max(...ratios).toFixed(2);
  console.log(`\n  ${ratios.length} items: sold / asking runs ${lo}x to ${hi}x, median ${r.toFixed(2)}x`);
  console.log(hi - lo > 0.5
    ? "  The spread is too wide to apply as one factor. Per-category, or not at all."
    : `  Tight enough to use: harvested asking rows would carry a ${r.toFixed(2)}x correction.`);
}
console.log("");
