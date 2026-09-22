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

/* ---------------------------------------------------------------- fit
 * WHAT EXACTLY IS BEING PRICED.
 *
 * A search for DCD791 comes back mostly bare tool bodies, because that is
 * what people list - the battery is worth keeping. Averaging the lot gave
 * $48-95 against a catalogue value of $110 for a drill KIT, and merging
 * that would have halved the shop's drill prices overnight.
 *
 * Separated, on real listings: bare $40-54, kit $90-100. The catalogue was
 * right and the data was wrong. Same story on a Makita XPH12 - $60-80 bare
 * against $135-180 in a kit.
 *
 * Titles that say neither are counted with the bare ones. That is an
 * inference, and it is the one judgement call in here, but the medians bear
 * it out: on three of four models tested, silent listings priced within a
 * couple of dollars of the explicitly-bare ones. Anybody selling a kit says
 * so, because it is worth more.
 */
const PARTS = /\b(part|parts|motor assembly|switch and (board|bord)|armature|stator|chuck only|housing)\b|\bfor\s+(dewalt|milwaukee|makita|ryobi|bosch|m18|m12)\b/i;

/* Components, named outright. Outdoor power equipment is the worst for
   this: a search for "Husqvarna 240" comes back as springs, fuel caps,
   sprockets, crankshafts and mufflers, none of which contain the word
   "part". Priced together they made a $180 chainsaw look like $8-21, and a
   $500 riding mower look like $25-50 - deck belts and spindles.
   Deliberately excludes bar, chain, blade, belt and handle: a real saw
   listing says "with 18in bar", and rejecting those would leave nothing. */
/* An OEM part number. This turned out to be the strongest signal of the
   lot: nearly every parts listing carries one and almost no whole-unit
   listing does. Honda writes 42710-VH7-010ZA, Toro 117-5976, Stihl
   4282 700 34, DeWalt 285807-26.
   Carefully NOT matched: a Milwaukee model number like 2904-20, four
   digits then two - every pattern here needs three digits on the left and
   three on the right, or the hyphenated triple. */
const PARTNO = /\b\d{3,6}-[a-z0-9]{2,4}-[a-z0-9]{3,6}\b|\b\d{3}-\d{3,6}\b|\b\d{6}-\d{2}\b|\b\d{4}\s+\d{3}\s+\d{2,4}\b/i;

const COMPONENT = /\b(carburet(or|tor)|carb kit|sprocket|crankshaft|crankcase|piston|cylinder|muffler|exhaust|flywheel|recoil|ignition coil|spark plug|gasket|handguard|hand guard|spindle|deck belt|air filter|fuel (cap|line|filter|pump|tank)|oil (pump|tank)|clutch (cover|drum)|top cover|side cover|bar cover|intake boot|choke lever|brake lever|handle wrap|rear handle|pull cord|starter rope|primer bulb|av spring|worm gear|oil seal|bearing kit|throttle (lever|control)|manifold|shroud|drive (shaft|tube)|tensioner|trimmer head|autocut|cutting head|bump head|oem head|idler|pulley|fan wheel|wheel rim|(rear|front) wheels?|set screw|insulator|bail plate|control plate|spring arms?|elbow hose|blade guard|deflector|axle coll?er|oil pan|sump|grass bag|grass catcher|bag (and|&) frame|mulch plug|chute)\b/i;

/* What the catalogue calls this kind of thing, reduced to words a seller
   would use. The point is that a listing for the TOOL says what the tool
   is; a listing for a sprocket does not. */
const KIND_STOP = new Set(["and","the","with","kit","for","any","size","current","gen","gal","max","new","used"]);
function kindWords(kind) {
  const head = String(kind || "").toLowerCase().split(/[\u2014\u2013(,]/)[0];
  return head.split(/[^a-z]+/).filter((w) => w.length >= 2 && !KIND_STOP.has(w));
}
const LOTS  = /\blot\b|\bbundle\b|\b\d\s*-?\s*(tool|pc|piece)s?\s*(combo|kit|set)\b|^\s*([2-9]|\d{2})\s+(?!v\b|volt|ah\b|in\b|inch)/i;
const BARE  = /\b(tool|body)\s*[-\u2013]?\s*only\b|\bno\s+batter|\bwithout\s+batter|\bbare\s*(tool)?\b|\bno\s+charger\b/i;
const KITED = /\bkit\b|\bcombo\b|\bw\/?\s*\d*\s*(ah\s*)?batter|\bwith\s+batter|\bbatteries\b|\+\s*charger|\band\s+charger\b|\bw\/\s*charger|\bw\/?\s*batt\b|\bincludes?\s+batter/i;

const squash = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/* Whole tokens, not a regex slid along the string - that read "Milwaukee
   2904-20" as "ukee290420" and then threw away every real listing for not
   matching it. Three digits minimum, so M18, 20V and 4Ah are not models. */
function modelCodes(t) {
  const out = new Set();
  for (let tok of String(t || "").toLowerCase().split(/[^a-z0-9-]+/)) {
    tok = tok.replace(/^-+|-+$/g, "");
    if (!tok) continue;
    /* Letters-then-digits (DCD791), the hyphenated pair Milwaukee uses
       (2904-20), and digits-then-letters, which Husqvarna does: a listing
       headed "140S, 240S, 240SE, 240SG" is four models and therefore a
       parts listing, and that only shows up if 240SE counts as a code. */
    if (/^[a-z]{1,4}-?\d{3,5}(-\d{1,3})?[a-z]{0,3}$/.test(tok)
     || /^\d{3,4}-\d{2}$/.test(tok)
     || /^\d{2,4}[a-z]{1,3}$/.test(tok))
      out.add(squash(tok));
  }
  return out;
}
/* DCD791D2 is a DCD791 in a kit box, not a different drill. */
const sameModel = (a, b) => a === b || a.startsWith(b) || b.startsWith(a);

export function fitOf(title, wanted, kinds) {
  const t = String(title || "");
  if (PARTS.test(t) || COMPONENT.test(t) || PARTNO.test(t)) return "part";
  /* Does this listing even say it is the thing being priced? A sprocket
     never claims to be a chainsaw. Checked against the squashed title so
     "Chain Saw" and "chainsaw" are the same word. */
  if (kinds && kinds.length) {
    const flat = squash(t);
    if (!kinds.some((w) => flat.includes(w))) return "wrong";
  }
  const cs = modelCodes(t);
  /* Codes that are not the thing asked for. A kit naming its own battery
     (DCB204) has one; a listing of six drills has three or more. Counting
     every code called the first a lot. */
  const others = [...cs].filter((c) => ![...wanted].some((q) => sameModel(c, q)));
  if (others.length >= 3 || LOTS.test(t)) return "lot";
  if (wanted.size && ![...wanted].some((q) => [...cs].some((c) => sameModel(c, q)))) return "wrong";
  if (BARE.test(t)) return "bare";
  if (KITED.test(t)) return "kit";
  return "unknown";
}

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

  /* /identity/V1/oauth2/token. Without the v1 eBay answers 404, which this
     reported as an auth failure - so a perfectly good keyset looked like a
     rejected one. Probed both: the versionless path 404s, the v1 path 401s
     on bad credentials, which is how a real endpoint refuses you. */
  const r = await fetch(apiBase(env) + "/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"),
    },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent(scope),
    signal,
  });
  if (!r.ok) {
    /* Telling "this scope was never granted" apart from "these credentials
       are wrong" matters more than it looks. Both were being called
       ebay_scope, and a scope refusal falls back to asking prices quietly -
       so a mistyped Cert ID would have produced a working lookup returning
       asks, with nothing anywhere saying the key was bad. Exactly the kind
       of silent wrongness this whole job has been about.
       eBay refuses an ungranted scope with 400 and invalid_scope; wrong
       credentials come back 401 invalid_client. */
    let detail = null;
    try { detail = await r.json(); } catch (e) {}
    const err = String((detail && detail.error) || "");
    const scopeDenied = r.status === 400 && /scope/i.test(err + " " + ((detail && detail.error_description) || ""));
    const code = scopeDenied ? "ebay_scope" : "ebay_auth";
    throw Object.assign(new Error(code + " " + r.status), {
      code, status: r.status,
      /* eBay's own words. These carry no secret - they are error names like
         invalid_client - and without them this is unfixable from outside. */
      upstream: err || undefined,
      upstreamText: (detail && detail.error_description) || undefined,
    });
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
async function soldComps(q, limit, env, signal, kinds) {
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
  const wanted = modelCodes(q);
  return ((j && j.itemSales) || []).map((it) => ({
    price: num(it.lastSoldPrice && it.lastSoldPrice.value),
    what: it.title || "",
    where: "eBay",
    basis: "sold",
    fit: fitOf(it.title, wanted, kinds),
    cond: it.condition || "",
    when: (it.lastSoldDate || "").slice(0, 10),
    url: it.itemWebUrl || "",
  })).filter((c) => c.price > 0 && keep(c.what));
}

/* ---- asking, via Browse ---- */
async function askingComps(q, limit, env, signal, kinds) {
  const token = await appToken(SCOPE_BROWSE, env, signal);
  const url = apiBase(env) + "/buy/browse/v1/item_summary/search"
    + "?q=" + encodeURIComponent(q)
    + "&limit=" + limit
    + "&filter=" + encodeURIComponent("conditionIds:" + CONDITIONS + ",buyingOptions:{FIXED_PRICE|AUCTION}");

  const r = await call(url, token, env, signal);
  if (!r.ok) throw Object.assign(new Error("ebay_error " + r.status), { code: "ebay_error", status: r.status });

  const j = await r.json().catch(() => null);
  const wanted = modelCodes(q);
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
      fit: fitOf(it.title, wanted, kinds),
      bids: bids || 0,
      cond: it.condition || "",
      url: it.itemWebUrl || "",
    };
  }).filter((c) => c.price > 0 && keep(c.what));
}

/* What the service hands back. One query in, a list of comps out, and a
   plain statement of which kind of number they are. */
/* The bands, and what was thrown away getting to them. A caller that only
   wants a number can read bands.kit; one that wants to show its working has
   every listing and why each was kept or dropped. */
function band(list) {
  const ps = list.map((c) => c.price).filter((n) => n > 0).sort((a, b) => a - b);
  if (!ps.length) return null;
  const at = (f) => ps[Math.min(ps.length - 1, Math.max(0, Math.round(f * (ps.length - 1))))];
  return { n: ps.length, lo: at(0.25), med: at(0.5), hi: at(0.75) };
}
function split(comps) {
  const kit = comps.filter((c) => c.fit === "kit");
  /* Silent listings go with the bare ones - see the note on fitOf. */
  const bare = comps.filter((c) => c.fit === "bare" || c.fit === "unknown");
  return {
    kit: band(kit), bare: band(bare),
    bareOnly: band(comps.filter((c) => c.fit === "bare")),
    unsaid: band(comps.filter((c) => c.fit === "unknown")),
  };
}

export async function ebayComps({ q, limit, kind, env, signal }) {
  const query = String(q || "").trim().slice(0, 120);
  const kinds = kindWords(kind);
  if (!query) return { ok: false, code: "bad_request" };
  const n = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 25));

  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) return { ok: false, code: "no_ebay_key" };

  let note = "";
  if (!insightsDenied) {
    try {
      const all = await soldComps(query, n, env, signal, kinds);
      return withBands({ ok: true, basis: "sold", source: "marketplace_insights", q: query }, all);
    } catch (e) {
      if (e.code === "ebay_scope") {
        /* Not granted. Say so once, then stop asking for the rest of the run. */
        insightsDenied = true;
        note = "sold data unavailable: this keyset is not granted Marketplace Insights";
      } else if (e.code === "no_ebay_key" || e.code === "ebay_auth") {
        return { ok: false, code: e.code, status: e.status,
                 upstream: e.upstream, upstreamText: e.upstreamText };
      } else {
        note = "sold lookup failed (" + e.code + "), fell back to asking prices";
      }
    }
  } else {
    note = "sold data unavailable: this keyset is not granted Marketplace Insights";
  }

  try {
    const all = await askingComps(query, n, env, signal, kinds);
    return withBands({ ok: true, basis: "asking", source: "browse", q: query, warning: note }, all);
  } catch (e) {
    return { ok: false, code: e.code || "ebay_error" };
  }
}

/* Parts, multi-item lots and listings for a different model number are not
   comps for anything and never reach the caller - but how many there were
   is worth saying, because "40 listings" and "40 listings, 14 of them
   junk" are not the same claim. */
function withBands(head, all) {
  const dropped = { part: 0, lot: 0, wrong: 0 };
  const comps = all.filter((c) => {
    if (c.fit === "part" || c.fit === "lot" || c.fit === "wrong") { dropped[c.fit]++; return false; }
    return true;
  });
  return { ...head, comps, bands: split(comps), dropped, found: all.length };
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
