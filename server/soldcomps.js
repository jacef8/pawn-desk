/* Sold prices, bought in.
 *
 * eBay declined the Marketplace Insights application on 23 Sep 2026 -
 * "highly limited and generally reserved for eBay's approved partners only",
 * ticket closed. So the desk cannot get sold prices from eBay directly, and
 * every number it had came from active listings: what people are ASKING.
 *
 * SoldComps sells eBay sold listings through an API and permits commercial
 * use on every plan. Measured against a control on 23 Sep - eBay's own
 * Product Research put the Barnett crossbow at $308.45 over 90 days, this
 * returned $349 average on 25 sales - the data is genuine.
 *
 * TWO FILTERS THAT ARE NOT OPTIONAL, both learned the hard way:
 *
 * CONDITION. SoldComps filters nothing. A third to half of every sample
 * came back BRAND NEW - 18 of 35 on a Shark vacuum, 16 of 31 on a Dyson.
 * Priced together with the used ones they read 11% ABOVE the asking prices
 * they were meant to correct, which briefly looked like a discovery and was
 * really just new stock. Used conditions only, same set the Browse call
 * asks for, and never 7000: a broken one is not a comp for a working one.
 *
 * DATE. Advertised as 90 days, and mostly is, but stragglers come back
 * much older - one DeWalt sale from a year before. A year-old sale is not
 * a comp either.
 *
 * Settings, from the host environment, never in this file or the repository:
 *   SOLDCOMPS_KEY  - starts sc_, from sold-comps.com/dashboard/api-keys
 */
import { fitOf, modelCodes, kindWords } from "./ebay.js";

const BASE = "https://api.sold-comps.com";
const SOLD_DAYS = 90;
const MAX_LIMIT = 50;

/* The same conditions the Browse call asks eBay for. 1000 is brand new and
   7000 is for-parts; both are excluded on purpose. */
const USED_IDS = new Set([2000, 2500, 3000, 4000, 5000, 6000]);

export function soldCompsReady(env) {
  const key = env && env.SOLDCOMPS_KEY && String(env.SOLDCOMPS_KEY).trim();
  return { configured: !!key, source: "soldcomps" };
}

export async function soldCompsFetch({ q, limit, kind, env, signal }) {
  const key = env && env.SOLDCOMPS_KEY && String(env.SOLDCOMPS_KEY).trim();
  if (!key) throw Object.assign(new Error("no_soldcomps_key"), { code: "no_soldcomps_key" });

  const query = String(q || "").trim().slice(0, 120);
  if (!query) throw Object.assign(new Error("bad_request"), { code: "bad_request" });
  const n = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 40));

  const u = new URL(BASE + "/v1/scrape");
  u.searchParams.set("keyword", query);
  u.searchParams.set("count", String(n));

  const r = await fetch(u, { headers: { authorization: "Bearer " + key, accept: "application/json" }, signal });
  if (r.status === 401 || r.status === 403)
    throw Object.assign(new Error("soldcomps_auth"), { code: "soldcomps_auth", status: r.status });
  if (r.status === 429)
    throw Object.assign(new Error("soldcomps_quota"), { code: "soldcomps_quota", status: 429 });
  if (!r.ok)
    throw Object.assign(new Error("soldcomps_error " + r.status), { code: "soldcomps_error", status: r.status });

  const j = await r.json().catch(() => null);
  const items = (j && (j.items || j.listings || j.results)) || [];

  const wanted = modelCodes(query);
  const kinds = kindWords(kind);
  const cutoff = Date.now() - SOLD_DAYS * 864e5;

  /* Counted, not silently dropped: a run where most of the sample was new
     stock is a run worth knowing about before the price lands on a ticket. */
  const skipped = { newStock: 0, stale: 0, badPrice: 0 };

  const comps = [];
  for (const it of items) {
    const price = Number(it.soldPrice);
    if (!(price > 0)) { skipped.badPrice++; continue; }

    const cid = Number(it.conditionId);
    if (!USED_IDS.has(cid)) { skipped.newStock++; continue; }

    const when = String(it.endedAt || "").slice(0, 10);
    const t = when ? Date.parse(when + "T12:00:00Z") : NaN;
    if (!Number.isFinite(t) || t < cutoff) { skipped.stale++; continue; }

    comps.push({
      price,
      what: it.title || "",
      where: "eBay",
      basis: "sold",
      fit: fitOf(it.title, wanted, kinds),
      cond: it.condition || "",
      when,
      /* Haggled down and accepted - the truest number in the set, because
         it is what it took to actually move the thing. */
      offer: !!it.acceptsOffers && !it.bidCount,
      url: it.url || "",
      /* eBay's own thumbnail of the thing that sold. The counter is holding
         the real item; twelve pictures of what the median was built from is
         the fastest way to see that three of them are the wrong generation.
         The small one only - the full-res version is a different URL and
         nothing here displays at that size. */
      img: typeof it.thumbnailUrl === "string" && /^https:\/\//.test(it.thumbnailUrl)
        ? it.thumbnailUrl.slice(0, 300) : "",
    });
  }
  return { comps, skipped, seen: items.length };
}
