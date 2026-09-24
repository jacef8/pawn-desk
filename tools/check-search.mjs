/* DOES THE DESK FIND THE RIGHT THING?
 *
 * Every wrong answer this tool has produced was found by a person at the
 * counter looking at a screen and saying "that isn't right" - a DJI Osmo
 * priced off a selfie stick, a Yamaha piano called an outboard motor, a
 * television declared unpriceable because the parts filter knew only
 * chainsaw words. The tool never once caught itself.
 *
 * So this runs the search the app would really run, for a sample of what
 * the shop actually sees, and grades what comes back:
 *
 *   NOTHING   no usable listings at all
 *   ASKS      fell off sold prices onto asking prices
 *   MIXED     middle half spans 3x or more - more than one product
 *   WILD      median is 4x the book or under a quarter of it
 *   OK        sold prices, tight band, near the book
 *
 * It costs one SoldComps lookup per row and no Anthropic call at all.
 * Run it with --limit N to cap that.
 *
 *   PAWN_TOKEN=... node tools/check-search.mjs --limit 60
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n);
  return i < 0 ? d : process.argv[i + 1]; };
const SERVER = (process.env.PAWN_SERVER || "https://pawn-desk-production.up.railway.app").replace(/\/+$/, "");
const TOKEN = process.env.PAWN_TOKEN || "";
const LIMIT = Number(arg("limit", 40));
const ONLY = String(arg("only", "") || "").toLowerCase();

const APP = readFileSync(join(ROOT, "app.js"), "utf8");
const PRICES = JSON.parse(readFileSync(join(ROOT, "prices.json"), "utf8"));
/* the book value for a row, so "near the book" means something */
const BOOK = {};
for (const m of APP.matchAll(/\["([^"]+)",(\d+),"(\w+)","(\w+)"\]/g)) BOOK[m[1]] = Number(m[2]);
for (const m of APP.matchAll(/\{id:"(\w+)",name:"([^"]+)",value:(\d+)/g)) BOOK[m[1]] = Number(m[3]);
Object.assign(BOOK, PRICES.book || {});

/* Every measured model row is a target: the desk claims to know these, so
   they are exactly what it should be able to find again. */
/* The desk refuses to search eBay where eBay is blind - firearms, which
   it is not allowed to sell, and anything nobody ships. Those are not
   failures any more, they are a decision, so they are out of the sample:
   this measures what the tool actually attempts. */
const BLIND_REF = new Set(["g1","g2","g3","g4","g5","g6","g7","g8","g9","g10","r1","r2","r3","p4","p5"]);
const BLIND_NAME = /\b(shotgun|rifle|pistol|revolver|muzzleloader|ar-?15|ak-?pattern|sks|atv|utv|side-?by-?side|golf cart|dirt bike|four wheeler|riding mower|zero-?turn|push mower)\b/i;
let rows = PRICES.rows.map(r => ({ ref: String(r[1]), name: String(r[2]), lo: r[3], hi: r[4] }))
  .filter(r => !BLIND_REF.has(r.ref) && !BLIND_NAME.test(r.name) && !BLIND_NAME.test(r.ref));
if (ONLY) rows = rows.filter(r => (r.ref + " " + r.name).toLowerCase().includes(ONLY));
/* spread the sample across items rather than taking one item's whole shelf */
const byRef = {};
rows.forEach(r => (byRef[r.ref] = byRef[r.ref] || []).push(r));
const spread = [];
for (let i = 0; spread.length < rows.length; i++) {
  let added = false;
  for (const k of Object.keys(byRef)) if (byRef[k][i]) { spread.push(byRef[k][i]); added = true; }
  if (!added) break;
}
const targets = spread.slice(0, LIMIT);

const ask = async (q) => {
  const r = await fetch(SERVER + "/ebay", { method: "POST",
    headers: { "content-type": "application/json", "x-pawn-token": TOKEN },
    body: JSON.stringify({ q, limit: 25 }) });
  if (!r.ok) return { ok: false, http: r.status };
  return r.json();
};
const pct = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : 0;

const tally = { OK: 0, MIXED: 0, WILD: 0, ASKS: 0, NOTHING: 0, ERROR: 0 };
const bad = [];
console.log("\n  " + targets.length + " searches, the same ones the app builds\n");
for (const t of targets) {
  let g, note = "";
  try {
    const d = await ask(t.name);
    const ps = (d.comps || []).map(c => Math.round(Number(c.price))).filter(n => n > 0).sort((a, b) => a - b);
    if (!d.ok) { g = "ERROR"; note = "http " + (d.http || "?"); }
    else if (ps.length < 4) { g = "NOTHING"; note = ps.length + " listings"; }
    else {
      const lo = pct(ps, .25), hi = pct(ps, .75), mid = pct(ps, .5);
      const book = BOOK[t.ref];
      const spreadX = lo > 0 ? hi / lo : 0;
      note = "$" + lo + "-$" + hi + " (n=" + ps.length + ")";
      if (d.basis !== "sold") { g = "ASKS"; }
      else if (spreadX >= 3) { g = "MIXED"; note += "  " + (Math.round(spreadX * 10) / 10) + "x wide"; }
      else if (book > 0 && (mid / book > 4 || mid / book < 0.25)) {
        g = "WILD"; note += "  vs book $" + book; }
      else g = "OK";
    }
  } catch (e) { g = "ERROR"; note = e.message.slice(0, 40); }
  tally[g]++;
  if (g !== "OK") bad.push([g, t.ref, t.name, note]);
  process.stdout.write(g === "OK" ? "." : g[0].toLowerCase());
}
console.log("\n");
const n = targets.length;
const pc = (k) => Math.round(tally[k] / n * 100);
console.log("  OK      " + String(tally.OK).padStart(3) + "  " + pc("OK") + "%   sold prices, tight band, near the book");
["MIXED","WILD","ASKS","NOTHING","ERROR"].forEach(k =>
  tally[k] && console.log("  " + k.padEnd(8) + String(tally[k]).padStart(3) + "  " + pc(k) + "%"));
if (bad.length) {
  console.log("\n  what came back wrong:");
  bad.slice(0, 40).forEach(([g, ref, name, note]) =>
    console.log("    " + g.padEnd(8) + String(name).slice(0, 34).padEnd(36) + note));
}
console.log("\n  " + pc("OK") + "% of what the desk claims to know, it can find again.\n");
process.exit(0);
