/* The two filters that are not optional.
 *
 * Without the condition filter, a third to half of every sample is BRAND
 * NEW and the medians read about 11% above the asking prices they exist to
 * correct. Without the date filter, sales over a year old count as comps.
 * Either one silently inflates every row in the book, which is money out of
 * the till, so both are held here against a stubbed API. */
import { soldCompsFetch, soldCompsReady } from "../server/soldcomps.js";

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ok    " + m); } else { fail++; console.log("  FAIL  " + m); } };

const real = globalThis.fetch;
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const item = (o) => ({ title: "Milwaukee 2744 Framing Nailer", conditionId: 3000,
  soldPrice: "280", endedAt: day(10), url: "https://ebay.com/itm/1", condition: "Pre-Owned", ...o });

function stub(items, status) {
  globalThis.fetch = async () => ({ ok: !status || status < 400, status: status || 200,
    json: async () => ({ items }) });
}
const env = { SOLDCOMPS_KEY: "sc_test" };
const get = (items) => { stub(items); return soldCompsFetch({ q: "milwaukee 2744", limit: 40, kind: "Framing nailer", env }); };

console.log("\nsold comps: the filters\n");

ok(soldCompsReady({}).configured === false, "no key means not configured");
ok(soldCompsReady(env).configured === true, "a key means configured");
ok(soldCompsReady({ SOLDCOMPS_KEY: "   " }).configured === false, "a key of spaces is not a key");

let r = await get([item({ conditionId: 1000, soldPrice: "420" }), item(), item()]);
ok(r.comps.length === 2, "brand new (1000) is thrown out");
ok(r.skipped.newStock === 1, "  and counted, not silently dropped");
ok(!r.comps.some((c) => c.price === 420), "  the new one's price never reaches the band");

r = await get([item({ conditionId: 7000, soldPrice: "40" }), item()]);
ok(r.comps.length === 1 && r.skipped.newStock === 1, "for-parts (7000) is thrown out too");

for (const id of [2000, 2500, 3000, 4000, 5000, 6000]) {
  r = await get([item({ conditionId: id })]);
  ok(r.comps.length === 1, "condition " + id + " is kept");
}

r = await get([item({ endedAt: day(400) }), item({ endedAt: day(91) }), item({ endedAt: day(89) })]);
ok(r.comps.length === 1, "sales over 90 days old are thrown out");
ok(r.skipped.stale === 2, "  and counted");

r = await get([item({ endedAt: "" }), item()]);
ok(r.comps.length === 1 && r.skipped.stale === 1, "a sale with no date is not trusted");

r = await get([item({ soldPrice: "0" }), item({ soldPrice: null }), item()]);
ok(r.comps.length === 1 && r.skipped.badPrice === 2, "a sale with no price is thrown out");

r = await get([item()]);
ok(r.comps[0].basis === "sold", "what survives is labelled sold, not asking");
ok(r.comps[0].when === day(10), "  and carries the date it sold");
ok(typeof r.comps[0].fit === "string", "  and is classified like any other comp");

r = await get([item({ title: "Milwaukee 2744 Framing Nailer Piston Driver Assembly" })]);
ok(r.comps[0].fit === "part", "a parts listing is caught by the shared classifier");

for (const [status, code] of [[401, "soldcomps_auth"], [403, "soldcomps_auth"], [429, "soldcomps_quota"], [500, "soldcomps_error"]]) {
  stub([], status);
  let got = null;
  try { await soldCompsFetch({ q: "x", limit: 5, kind: "", env }); } catch (e) { got = e.code; }
  ok(got === code, "HTTP " + status + " raises " + code);
}

let got = null;
try { await soldCompsFetch({ q: "x", limit: 5, kind: "", env: {} }); } catch (e) { got = e.code; }
ok(got === "no_soldcomps_key", "no key raises rather than pretending");

globalThis.fetch = real;
console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
