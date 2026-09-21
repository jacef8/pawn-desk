#!/usr/bin/env node
/* The /ebay endpoint, checked against a stand-in for eBay.
 *
 *   node tools/check-ebay.mjs
 *
 * Nothing here touches the real eBay or costs anything. It stands a stub up
 * on localhost and points the service at it with EBAY_API_URL, then runs the
 * three situations that actually happen:
 *
 *   sold    — the keyset has the Marketplace Insights grant. Real sold prices.
 *   denied  — the keyset does not. Must fall back to asking prices, must say
 *             so, and must never label an ask as a sale.
 *   guard   — the token, the method, an empty query, a missing keyset.
 *
 * The middle one is the one worth keeping a test for. The failure that costs
 * money is not a crash; it is asking prices quietly arriving labelled "sold"
 * and getting graded high, because then the price book reads high and the
 * loan follows it.
 */
import { createServer } from "node:http";
import { handle } from "../server/core.js";
import { ebayReset } from "../server/ebay.js";

const PORT = 3097;
let fails = 0, mode = "sold";
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

/* ---- the stand-in ---- */
const sales = (n, base) => Array.from({ length: n }, (_, i) => ({
  title: "DeWalt DW735 13in Planer",
  lastSoldPrice: { value: String(base + i * 15) },
  lastSoldDate: "2026-08-1" + (i % 9) + "T00:00:00.000Z",
  condition: "Used", itemWebUrl: "https://ebay.com/itm/" + i,
}));

const stub = createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  const j = (code, o) => res.writeHead(code, { "content-type": "application/json" }).end(JSON.stringify(o));

  if (u.pathname === "/identity/oauth2/token") {
    let b = ""; for await (const c of req) b += c;
    const scope = new URLSearchParams(b).get("scope") || "";
    if (mode === "denied" && scope.includes("marketplace.insights")) return j(400, { error: "invalid_scope" });
    return j(200, { access_token: "tok", expires_in: 7200 });
  }
  if (u.pathname === "/buy/marketplace_insights/v1_beta/item_sales/search") {
    if (mode !== "sold") return j(403, { errors: [{ message: "Insufficient permissions" }] });
    return j(200, { itemSales: sales(8, 200).concat([
      { title: "DW735 dust hood FOR PARTS", lastSoldPrice: { value: "12" } },
      { title: "Lot of 3 planer blades compatible with DW735", lastSoldPrice: { value: "22" } },
    ]) });
  }
  if (u.pathname === "/buy/browse/v1/item_summary/search") {
    return j(200, { itemSummaries: [
      { title: "DeWalt DW735 Planer",       price: { value: "420" }, condition: "Used" },
      { title: "DeWalt DW735X Planer",      price: { value: "455" }, condition: "Used" },
      { title: "DW735 planer w/ stand",     price: { value: "399" }, condition: "Used" },
      { title: "DeWalt DW735 auction",      currentBidPrice: { value: "260" }, bidCount: 14, condition: "Used" },
      { title: "DW735 replacement blade set", price: { value: "35" }, condition: "New" },
      { title: "Manual for DeWalt DW735",   price: { value: "9" }, condition: "Used" },
    ] });
  }
  j(404, {});
});

await new Promise(r => stub.listen(PORT, r));

const env = (extra = {}) => ({ PAWN_TOKEN: "t", EBAY_CLIENT_ID: "id", EBAY_CLIENT_SECRET: "sec",
  EBAY_API_URL: "http://127.0.0.1:" + PORT, ...extra });
const post = (body, token = "t", e = env()) => handle({ path: "/ebay", method: "POST", token, body, env: e });

/* ---- sold ---- */
mode = "sold"; ebayReset();
console.log("\n  the keyset has the Insights grant");
{
  const r = await post({ q: "DeWalt DW735" });
  ok(r.status === 200 && r.body.ok, "answers 200");
  ok(r.body.basis === "sold", "basis is sold, got " + r.body.basis);
  ok(r.body.comps.length === 8, "the parts listing and the lot are dropped (8 left, got " + r.body.comps.length + ")");
  ok(r.body.comps.every(c => c.basis === "sold" && c.price > 0), "every comp is a priced sale");
}

/* ---- denied ---- */
mode = "denied"; ebayReset();
console.log("\n  the keyset does NOT have the Insights grant");
{
  const r = await post({ q: "DeWalt DW735" });
  ok(r.status === 200 && r.body.ok, "still answers rather than failing");
  ok(r.body.basis === "asking", "basis is asking, got " + r.body.basis);
  ok(/not granted Marketplace Insights/.test(r.body.warning || ""), "says why");
  ok(r.body.comps.length === 4, "the manual and the blades are dropped (4 left, got " + r.body.comps.length + ")");
  ok(!r.body.comps.some(c => c.basis === "sold"), "NOTHING is labelled sold");
  const auction = r.body.comps.find(c => c.bids > 0);
  ok(auction && auction.price === 260, "an auction is priced at the live bid, got " + (auction && auction.price));
  const again = await post({ q: "Makita 5007" });
  ok(again.body.ok && again.body.basis === "asking", "the next lookup works without re-asking for the refused scope");
}

/* ---- guards ---- */
mode = "sold"; ebayReset();
console.log("\n  the guards");
{
  ok((await post({ q: "x" }, "wrong")).body.code === "bad_token", "a wrong token is refused");
  ok((await handle({ path: "/ebay", method: "GET", token: "t", env: env() })).status === 404, "GET is refused");
  ok((await post({ q: "" })).body.code === "bad_request", "an empty query is refused");
  const none = await post({ q: "x" }, "t", { PAWN_TOKEN: "t" });
  ok(none.status === 501 && none.body.code === "no_ebay_key", "no keyset answers no_ebay_key");
  ok((await handle({ path: "/limits", method: "GET", env: env() })).body.ebay.configured === true, "/limits reports a keyset");
  ok((await handle({ path: "/limits", method: "GET", env: {} })).body.ebay.configured === false, "/limits reports no keyset");
}

stub.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
