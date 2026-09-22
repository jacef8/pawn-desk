/* eBay comps — what things actually sold for.
 *
 * Why this exists: every other source the desk can reach publishes ASKING
 * prices. The $400 listing that sat for six months is still in the index;
 * the $220 one that sold in a day is gone. Averaging what is left reads high,
 * and for a pawn loan high is the dangerous direction — you lend against a
 * price that never cleared. eBay is the only marketplace that publishes what
 * was paid, so this is the one honest number available without a receipt.
 *
 * Two eBay APIs, in order of preference:
 *
 *   Marketplace Insights  — real sold prices, last 90 days. This is the one
 *                           we want. It is RESTRICTED: a developer account
 *                           alone does not get it, you apply and eBay grants
 *                           it. Until it is granted the token request comes
 *                           back without the scope and the call 403s.
 *   Browse                — active listings. Any developer account has it,
 *                           no application. These are asking prices, same
 *                           bias as everything else — but structured, so at
 *                           least the condition and the model are the ones
 *                           asked for rather than whatever a search scraped.
 *
 * So Insights is tried first and Browse is the fallback, and every comp
 * carries basis:"sold" or basis:"asking" so nothing downstream can mistake
 * one for the other. The failure is remembered — asking for a scope that has
 * not been granted fails the same way every time, and paying that round trip
 * on all 600 targets is a slow way to learn nothing.
 *
 * Settings, from the host environment. Never in this file, never in the
 * repository, never on a phone:
 *   EBAY_CLIENT_ID      — App ID   (developer.ebay.com, an application keyset)
 *   EBAY_CLIENT_SECRET  — Cert ID
 *   EBAY_ENV            — optional; "sandbox" to point at eBay's test host
 *   EBAY_MARKETPLACE    — optional; defaults to EBAY_US
 *
 * These are read-only credentials for public listing data. They buy nothing,
 * list nothing and cannot touch an eBay account.
 */

const HOSTS = {
  production: { api: "https://api.ebay.com" },
  sandbox:    { api: "https://api.sandbox.ebay.com" },
};
const SCOPE_BROWSE   = "https://api.ebay.com/oauth/api_scope";
const SCOPE_INSIGHTS = "https://api.ebay.com/oauth/api_scope/buy.marketplace.insights";

const SOLD_DAYS = 90;          /* all Insights carries */
const MAX_LIMIT = 50;

/* Condition ids: 3000 used, 4000 very good, 5000 good, 6000 acceptable,
   2000/2500 refurbished. 7000 is "for parts or not working" and is left out
   on purpose — a broken one is not a comp for a working one. */
const CONDITIONS = "{3000|4000|5000|6000|2000|2500}";

/* Titles that are a different thing wearing the right words. A search for a
   DeWalt DW735 will happily return the dust hood for one. */
const JUNK = /\b(for parts|parts only|not working|as[- ]is|repair|broken|lot of|bundle of|\d+\s*pcs?\b|manual|sticker|decal|poster|empty box|box only|case only|bag only|cover only|replacement (part|handle|blade|belt|cord|switch)|compatible with|fits\b|for use with|adapter for)\b/i;

/* ---- token, one per scope, cached until shortly before it expires ---- */
const tokens = new Map();       /* scope -> { value, until } */
let insightsDenied = false;     /* set once the grant is known to be missing */

function apiBase(env) {
  /* EBAY_API_URL is for the tests, which stand a stub up on localhost. */
  if (env.EBAY_API_URL) return String(env.EBAY_API_URL).replace(/\/+$/, "");
  return (HOSTS[String(env.EBAY_ENV || "production").toLowerCase()] || HOSTS.production).api;
}

async function appToken(scope, env, signal) {
  const hit = tokens.get(scope);
  if (hit && hit.until > Date.now()) return hit.value;

  const id = env.EBAY_CLIENT_ID, secret = env.EBAY_CLIENT_SECRET;
  if (!id || !secret) throw Object.assign(new Error("no_ebay_key"), { code: "no_ebay_key" });

  const r = await fetch(apiBase(env) + "/identity/oauth2/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"),
    },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent(scope),
    signal,
  });
  if (!r.ok) {
    /* A scope that was never granted is refused here, before any search. */
    const code = r.status === 400 || r.status === 401 ? "ebay_scope" : "ebay_auth";
    throw Object.assign(new Error(code + " " + r.status), { code, status: r.status });
  }
  const j = await r.json().catch(() => null);
  if (!j || !j.access_token) throw Object.assign(new Error("ebay_auth"), { code: "ebay_auth" });

  /* Expire our copy a minute early so a search never starts on a token that
     dies mid-flight. */
  tokens.set(scope, { value: j.access_token, until: Date.now() + Math.max(60, (j.expires_in || 7200) - 60) * 1000 });
  return j.access_token;
}

const call = async (url, token, env, signal) => {
  const r = await fetch(url, {
    headers: {
      authorization: "Bearer " + token,
      "X-EBAY-C-MARKETPLACE-ID": env.EBAY_MARKETPLACE || "EBAY_US",
      accept: "application/json",
    },
    signal,
  });
  return r;
};

const num = (v) => { const n = Number(v); return n > 0 ? n : 0; };
const keep = (title) => !!title && !JUNK.test(title);

/* ---- sold, via Marketplace Insights ---- */
async function soldComps(q, limit, env, signal) {
  const token = await appToken(SCOPE_INSIGHTS, env, signal);
  const since = new Date(Date.now() - SOLD_DAYS * 864e5).toISOString().replace(/\.\d+Z$/, ".000Z");
  const url = apiBase(env) + "/buy/marketplace_insights/v1_beta/item_sales/search"
    + "?q=" + encodeURIComponent(q)
    + "&limit=" + limit
    + "&filter=" + encodeURIComponent("conditionIds:" + CONDITIONS + ",lastSoldDate:[" + since + "]");

  const r = await call(url, token, env, signal);
  if (r.status === 403) throw Object.assign(new Error("ebay_scope"), { code: "ebay_scope", status: 403 });
  if (!r.ok) throw Object.assign(new Error("ebay_error " + r.status), { code: "ebay_error", status: r.status });

  const j = await r.json().catch(() => null);
  return ((j && j.itemSales) || []).map((it) => ({
    price: num(it.lastSoldPrice && it.lastSoldPrice.value),
    what: it.title || "",
    where: "eBay",
    basis: "sold",
    cond: it.condition || "",
    when: (it.lastSoldDate || "").slice(0, 10),
    url: it.itemWebUrl || "",
  })).filter((c) => c.price > 0 && keep(c.what));
}

/* ---- asking, via Browse ---- */
async function askingComps(q, limit, env, signal) {
  const token = await appToken(SCOPE_BROWSE, env, signal);
  const url = apiBase(env) + "/buy/browse/v1/item_summary/search"
    + "?q=" + encodeURIComponent(q)
    + "&limit=" + limit
    + "&filter=" + encodeURIComponent("conditionIds:" + CONDITIONS + ",buyingOptions:{FIXED_PRICE|AUCTION}");

  const r = await call(url, token, env, signal);
  if (!r.ok) throw Object.assign(new Error("ebay_error " + r.status), { code: "ebay_error", status: r.status });

  const j = await r.json().catch(() => null);
  return ((j && j.itemSummaries) || []).map((it) => {
    /* An auction with bids on it is a price somebody has agreed to pay, even
       though it has not closed. Worth more than a fixed-price ask, but it is
       still not a sale, so it is labelled honestly and only noted. */
    const bids = Number(it.bidCount || 0);
    const p = (it.currentBidPrice && num(it.currentBidPrice.value)) || num(it.price && it.price.value);
    return {
      price: p,
      what: it.title || "",
      where: "eBay",
      basis: "asking",
      bids: bids || 0,
      cond: it.condition || "",
      url: it.itemWebUrl || "",
    };
  }).filter((c) => c.price > 0 && keep(c.what));
}

/* What the service hands back. One query in, a list of comps out, and a
   plain statement of which kind of number they are. */
export async function ebayComps({ q, limit, env, signal }) {
  const query = String(q || "").trim().slice(0, 120);
  if (!query) return { ok: false, code: "bad_request" };
  const n = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 25));

  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) return { ok: false, code: "no_ebay_key" };

  let note = "";
  if (!insightsDenied) {
    try {
      const comps = await soldComps(query, n, env, signal);
      return { ok: true, basis: "sold", source: "marketplace_insights", q: query, comps };
    } catch (e) {
      if (e.code === "ebay_scope") {
        /* Not granted. Say so once, then stop asking for the rest of the run. */
        insightsDenied = true;
        note = "sold data unavailable: this keyset is not granted Marketplace Insights";
      } else if (e.code === "no_ebay_key" || e.code === "ebay_auth") {
        return { ok: false, code: e.code };
      } else {
        note = "sold lookup failed (" + e.code + "), fell back to asking prices";
      }
    }
  } else {
    note = "sold data unavailable: this keyset is not granted Marketplace Insights";
  }

  try {
    const comps = await askingComps(query, n, env, signal);
    return { ok: true, basis: "asking", source: "browse", q: query, comps, warning: note };
  } catch (e) {
    return { ok: false, code: e.code || "ebay_error" };
  }
}

/* For the tests and for /limits, so the counter can see which kind of number
   it is going to get before it spends an afternoon harvesting. */
export function ebayReady(env) {
  /* Which of the four settings this process can actually see. Names only -
     never a value, and never a length, so nothing about the secret leaks.
     Without this, a keyset that is set but misspelt, or set on the wrong
     service, looks identical to one that was never set: configured:false
     and no way to tell which. That is a long evening. */
  const want = ["EBAY_CLIENT_ID", "EBAY_CLIENT_SECRET", "EBAY_VERIFY_TOKEN", "EBAY_DELETION_URL"];
  const set = (k) => !!(env[k] && String(env[k]).trim());
  const seen = want.filter(set);
  const missing = want.filter((k) => seen.indexOf(k) < 0);
  /* A name that is nearly right is the usual cause, so say what IS there
     that looks like it was meant to be one of these. Again: names only. */
  const strays = Object.keys(env || {})
    .filter((k) => /ebay/i.test(k) && want.indexOf(k) < 0)
    .slice(0, 8);
  return {
    /* Trimmed, so a variable holding nothing but spaces - which is what
       pasting into the wrong box tends to leave - reads as absent here and
       in `seen`, rather than as present here and absent there. */
    configured: set("EBAY_CLIENT_ID") && set("EBAY_CLIENT_SECRET"),
    sold: !insightsDenied,
    marketplace: env.EBAY_MARKETPLACE || "EBAY_US",
    env: String(env.EBAY_ENV || "production").toLowerCase(),
    seen, missing,
    ...(strays.length ? { unrecognised: strays } : {}),
  };
}

/* Tests reach in to clear the remembered refusal between cases. */
export function ebayReset() { tokens.clear(); insightsDenied = false; }
