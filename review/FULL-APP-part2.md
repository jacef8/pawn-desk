# Whole-app review — part 2 of 4

Continuation of the Pawn Desk review. The brief was in part 1. More follows; do not answer yet.
## The shop's own service (Railway) — it holds the API keys, the app never does

### `server/server.js` — 74 lines

```javascript
/* Railway (or any Node host). Nothing here but plumbing: read the request,
 * hand it to core.js, write the answer back. No dependencies - Node's own
 * http and fetch are enough, so there is no install step to go stale. */
import { createServer } from "node:http";
import { handle, corsHeaders } from "./core.js";

const PORT = process.env.PORT || 3000;
const MAX_BODY = 8 * 1024 * 1024;   /* four photographs, comfortably */

/* Destroying the socket the moment the body ran long meant the caller never
 * got the 413 - the connection simply died under it, and a browser reports
 * that as "could not reach the service", which sends you looking for a
 * service that is running perfectly well. Stop reading, keep the socket open
 * long enough to say why, and let the handler answer. */
const readBody = (req) => new Promise((resolve, reject) => {
  let n = 0, over = false; const chunks = [];
  req.on("data", (c) => {
    if (over) return;
    n += c.length;
    if (n > MAX_BODY) { over = true; chunks.length = 0; reject(new Error("too_big")); return; }
    chunks.push(c);
  });
  req.on("end", () => { if (!over) resolve(Buffer.concat(chunks).toString("utf8")); });
  req.on("error", (e) => { if (!over) reject(e); });
});

const srv = createServer(async (req, res) => {
  const cors = corsHeaders(process.env, req.headers.origin);
  const send = (status, obj) =>
    res.writeHead(status, { "content-type": "application/json", ...cors }).end(JSON.stringify(obj));

  try {
    if (req.method === "OPTIONS") return res.writeHead(204, cors).end();

    const u = new URL(req.url, "http://localhost");
    const path = u.pathname;
    const query = Object.fromEntries(u.searchParams);
    let body = null;
    if (req.method === "POST") {
      let raw;
      try { raw = await readBody(req); }
      catch (e) { return send(413, { ok: false, code: "too_big" }); }
      try { body = JSON.parse(raw || "{}"); }
      catch (e) { return send(400, { ok: false, code: "bad_request" }); }
    }

    const out = await handle({
      path, query, method: req.method,
      token: req.headers["x-pawn-token"] || "",
      body, env: process.env,
    });
    send(out.status, out.body);
  } catch (e) {
    /* A thrown request must not take the process with it; Railway would
       restart and the counter would see a dead service. */
    send(500, { ok: false, code: "server_error" });
  }
});

srv.listen(PORT, () => console.log("pawn desk service listening on " + PORT));

/* Railway stops the container with SIGTERM on every redeploy. Without this,
 * node dies by the signal, npm reports "command failed / signal SIGTERM",
 * and the platform mails "Deploy Crashed" for an ordinary restart - which
 * sends you reading logs for a fault that is not there. Close up and leave
 * with a zero, and give an in-flight photo lookup a few seconds to land. */
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => {
    console.log("pawn desk service stopping on " + sig);
    srv.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 8000).unref();
  });
}

```

### `server/core.js` — 315 lines

```javascript
/* The Pawn Desk price and photo service — the part that is the same
 * everywhere. Platform files (server.js for Railway, worker.js for
 * Cloudflare) do nothing but hand this a request and pass the answer back,
 * so the logic is never copied per host.
 *
 * Settings, read from the environment. Never in this file and never in the
 * repository:
 *   ANTHROPIC_API_KEY  — required
 *   PAWN_TOKEN         — required; the desk sends it back, so a stranger who
 *                        finds the address cannot spend the key
 *   ALLOW_ORIGIN       — optional; defaults to the Pages site
 *   EBAY_CLIENT_ID     — optional; enables /ebay, the sold-comp lookup
 *   EBAY_CLIENT_SECRET — optional; the other half of the eBay keyset
 *   EBAY_VERIFY_TOKEN  — optional; 32-80 chars you invent. eBay will not
 *                        enable a production keyset until this service can
 *                        answer its account-deletion challenge
 *   EBAY_DELETION_URL  — optional; the /ebay/deletion address EXACTLY as it
 *                        is typed into eBay's portal, because it is hashed
 */

import { createHash } from "node:crypto";

/* WHICH MODEL READS THE PHOTO, AND WHAT IT COSTS.
   Hard-coded to Opus 5, which reads a worn badge well and charges $5/$25 a
   million tokens for the privilege. At 200 photos a month Haiku 4.5 does
   the same job for about a fifth of that - IF it reads the same badges. The
   difference is roughly $4 a month, and one misread model number on a $500
   item costs more than a decade of that, so this is a question to settle by
   photographing ten awkward things off the shelf rather than by arithmetic.
   PHOTO_MODEL makes that a Railway variable rather than a code change, so
   the comparison costs a restart instead of a deploy. The default does not
   move: nothing changes until somebody sets it deliberately. */
const PRICES = {
  "claude-opus-5":   { in: 5 / 1e6,  out: 25 / 1e6 },
  "claude-sonnet-5": { in: 2 / 1e6,  out: 10 / 1e6 },
  "claude-haiku-4-5":{ in: 1 / 1e6,  out:  5 / 1e6 },
};
const DEFAULT_MODEL = "claude-opus-5";
/* An unknown name is not quietly accepted: a typo in a Railway variable
   would otherwise fail every photo read with an opaque upstream error, and
   the spend accounting below would be priced against the wrong card. */
const wanted = String(process.env.PHOTO_MODEL || "").trim();
export const MODEL = PRICES[wanted] ? wanted : DEFAULT_MODEL;
export const MODEL_ASKED = wanted;
const API = "https://api.anthropic.com/v1/messages";
/* WHAT A CALL COSTS, AND A CEILING ON THE DAY.
   On 21 Sep a harvest walked the model list through this endpoint and spent
   $43.77 in one afternoon. Nothing here knew that was happening, nothing
   stopped it, and the first anyone knew was the balance. Opus 5 is $5 per
   million tokens in and $25 out, so the endpoint can now say what it just
   spent and refuse to keep going past a day's budget.
   The count is in memory: a redeploy resets it and a second instance keeps
   its own. That is honest about what it is - a brake on a runaway loop, not
   an accounting system. The spend limit in the Anthropic console is the
   backstop that cannot be restarted away. */
/* Priced for whatever model is actually running, or - if that is somehow
   not on the list - for the dearest one we know, so the cap errs toward
   stopping early rather than spending past it. */
const RATE = PRICES[MODEL] || PRICES[DEFAULT_MODEL];
const USD_IN = RATE.in, USD_OUT = RATE.out;
const DAY_CAP = Math.max(0, Number(process.env.DAILY_USD_CAP ?? 10));
let spentDay = "", spentUsd = 0;
function spendToday(add) {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== spentDay) { spentDay = day; spentUsd = 0; }
  spentUsd += add || 0;
  return spentUsd;
}
import { syncMerge } from "./store.js";
import { ebayComps, ebayReady } from "./ebay.js";
const DEFAULT_ORIGIN = "https://jacef8.github.io";
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* A browser compares Allow-Origin against the page's origin EXACTLY: scheme,
 * host and port, nothing else. So "https://jacef8.github.io/" with a trailing
 * slash, or the whole page URL pasted in, or a bare hostname with no scheme,
 * all fail - and they fail invisibly. The request is blocked in the browser,
 * the service never sees it, and the phone reports that it could not reach
 * anything at all. That is a long way to walk for a typed slash.
 *
 * So the setting is normalised to an origin before it is used, and several
 * may be listed, comma separated, for a desk and a phone on different hosts.
 * The origin asking is echoed back when it is one of them. */
const toOrigin = (v) => {
  const t = String(v || "").trim();
  if (!t) return "";
  if (t === "*") return "*";          /* open access means what it says */
  try { return new URL(/^https?:\/\//i.test(t) ? t : "https://" + t).origin; }
  catch (e) { return t.replace(/\/+$/, ""); }
};
export const allowedOrigins = (env) =>
  String(env.ALLOW_ORIGIN || DEFAULT_ORIGIN).split(",").map(toOrigin).filter(Boolean);

export const corsHeaders = (env, reqOrigin) => {
  const list = allowedOrigins(env);
  const asked = toOrigin(reqOrigin);
  /* "*" is honoured as written - someone asking for open access means it. */
  const allow = list.includes("*") ? "*"
    : (asked && list.includes(asked)) ? asked
    : list[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type,x-pawn-token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

const reply = (status, body) => ({ status, body });
const fail = (code, status) => reply(status || 400, { ok: false, code });

/* The model is asked for JSON, but a stray sentence or a code fence should not
   cost the counter the answer. Take the outermost balanced object. */
export function extractJSON(text) {
  const t = String(text || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  try { return JSON.parse(t); } catch (e) {}
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return null;
}

/* path, method, token and the parsed body in; {status, body} out. No platform
   objects cross this line, which is what makes it testable on its own. */
export async function handle({ path, method, token, body, env, signal, query }) {
  /* eBay will not enable a production keyset until the application either
     receives marketplace account-deletion notices or is granted an exemption
     from doing so. This is that endpoint, and it is the quicker of the two -
     an exemption is a review, this is a deploy.
   *
   * It is deliberately NOT behind PAWN_TOKEN: eBay is the caller and has no
   * way to send one. Nothing is exposed by that. A GET returns a hash and a
   * POST returns an acknowledgement, and neither reads or writes anything.
   *
   * The handshake: eBay GETs the address with ?challenge_code=..., and the
   * reply must be the SHA-256 of the challenge code, then the verification
   * token, then the endpoint URL, in that order, hex encoded, as
   * {"challengeResponse": "..."} with a JSON content type.
   *
   * The URL is taken from the environment rather than from the request,
   * because it must be byte-for-byte what was typed into eBay's portal and
   * a proxy in front of this service can and does rewrite the host it sees.
   * That mismatch is the usual reason this handshake fails. */
  if (path === "/ebay/deletion") {
    const verify = env.EBAY_VERIFY_TOKEN || "";
    const endpoint = env.EBAY_DELETION_URL || "";
    if (method === "GET") {
      const code = (query && query.challenge_code) || "";
      if (!code) return fail("bad_request");
      if (!verify || !endpoint) return fail("no_verify_token", 500);
      const hash = createHash("sha256").update(code).update(verify).update(endpoint).digest("hex");
      return reply(200, { challengeResponse: hash });
    }
    if (method === "POST") {
      /* Acknowledged, and there is genuinely nothing to erase: this service
         keeps prices, titles and the site a listing was on. It has never
         held an eBay username, an account id or anyone's personal details,
         and the deal log is item facts only. Answer 200 so eBay does not
         retry, and keep no record of who was named. */
      return reply(200, { ok: true });
    }
    return fail("not_found", 404);
  }

  if (path === "/limits" || path === "/") {
    /* Which model is live, said out loud. Comparing two of them is useless
       if you cannot tell from outside which one answered. */
    return reply(200, { ok: true, images: { mediaTypes: OK_TYPES, maxCount: MAX_IMAGES, maxBytes: MAX_IMAGE_BYTES },
                        ebay: ebayReady(env),
                        photo: { model: MODEL, asked: MODEL_ASKED || null,
                                 ignored: !!(MODEL_ASKED && MODEL_ASKED !== MODEL),
                                 usdPerMTok: { in: USD_IN * 1e6, out: USD_OUT * 1e6 },
                                 dayCap: DAY_CAP, spentToday: Math.round(spendToday(0) * 100) / 100 } });
  }
  /* Comps straight from eBay. This one spends no API money at all — it is
     eBay's own listing data, read with a read-only keyset — so the harvest
     can run over thousands of models without touching the balance. It is
     also the only source here that can return what something SOLD for
     rather than what someone is asking, which is the whole point of it. */
  if (path === "/ebay") {
    if (method !== "POST") return fail("not_found", 404);
    if (env.PAWN_TOKEN && token !== env.PAWN_TOKEN) return fail("bad_token", 403);
    if (!body || typeof body !== "object") return fail("bad_request");
    try {
      /* `via` is for tools/calibrate-asks.mjs only - it forces one rung of
         the source ladder so the same query can be priced both ways. */
      const out = await ebayComps({ q: body.q, limit: body.limit, kind: body.kind,
                                    via: body.via, env, signal });
      if (out.ok) return reply(200, out);
      /* Pass eBay's own error name back. It is not a secret - it is
         invalid_client or invalid_scope - and it is the difference between
         "the key is wrong" and "you were not granted that", which cannot be
         told apart from outside without it. */
      return reply(out.code === "no_ebay_key" ? 501 : 502,
        { ok: false, code: out.code || "ebay_error",
          status: out.status, upstream: out.upstream, upstreamText: out.upstreamText });
    } catch (e) {
      return fail("ebay_error", 502);
    }
  }
  /* Sharing the record between the phone and the desk. Same token as
     everything else; a device that cannot reach this keeps working on its
     own copy. */
  if (path === "/sync") {
    if (method !== "POST") return fail("not_found", 404);
    if (env.PAWN_TOKEN && token !== env.PAWN_TOKEN) return fail("bad_token", 403);
    if (!body || typeof body !== "object") return fail("bad_request");
    try {
      const out = await syncMerge(String(body.store || ""), body.rows, body.since);
      return out.ok ? reply(200, out) : fail(out.code || "bad_request");
    } catch (e) {
      return fail("sync_failed", 502);
    }
  }
  if (path !== "/json" || method !== "POST") return fail("not_found", 404);
  if (!env.ANTHROPIC_API_KEY) return fail("no_key", 500);
  if (env.PAWN_TOKEN && token !== env.PAWN_TOKEN) return fail("bad_token", 403);
  if (!body || typeof body !== "object") return fail("bad_request");

  const prompt = String(body.prompt || "").slice(0, 20000);
  if (!prompt) return fail("bad_request");

  const images = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
  for (const im of images) {
    if (!im || OK_TYPES.indexOf(im.media_type) < 0 || typeof im.data !== "string") return fail("image_rejected");
    if (im.data.length * 0.75 > MAX_IMAGE_BYTES) return fail("image_rejected");
  }

  const content = images.map((im) => ({
    type: "image",
    source: { type: "base64", media_type: im.media_type, data: im.data },
  }));
  content.push({ type: "text", text: prompt });

  /* Checked before the call, not after: the point is not to make the last
     one cheap, it is not to make the next one at all. */
  if (DAY_CAP > 0 && spendToday(0) >= DAY_CAP) return fail("day_cap", 429);

  const req = {
    model: MODEL,
    max_tokens: 8000,
    messages: [{ role: "user", content }],
    fallbacks: "default",
  };
  /* Only a price lookup needs the open web. The photo reader must not go
     wandering off to shop for the thing it is looking at. */
  if (body.search) req.tools = [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }];

  let r;
  try {
    r = await fetch(env.ANTHROPIC_URL || API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "server-side-fallback-2026-07-01",
      },
      body: JSON.stringify(req),
      signal,
    });
  } catch (e) {
    return fail("upstream_error", 502);
  }

  /* SAY WHY IT FAILED, NOT JUST THAT IT DID.
     Everything except 401 and 429 used to come back as "upstream_error",
     so an empty balance - which Anthropic reports as a 400, not a 401 -
     looked exactly like a network fault. On the day the key was swapped to
     a fresh account that is the single likeliest cause, and the counter was
     told nothing that pointed at it.
     The upstream STATUS and error TYPE are carried through; the upstream
     message is not, because it is somebody else's text and may say anything.
     The one exception is the word "credit", which is the difference between
     "something broke" and "go and top up the account". */
  if (!r.ok) {
    let type = "", low = false;
    try {
      const e = (await r.clone().json()).error || {};
      type = String(e.type || "").slice(0, 40);
      low = /credit|balance|quota/i.test(String(e.message || ""));
    } catch (e) {}
    const code = r.status === 429 ? "rate_limited"
      : r.status === 401 ? "no_key"
      : low ? "no_credit"
      : r.status === 403 ? "not_allowed"
      : "upstream_error";
    return reply(r.status === 429 ? 429 : 502,
      { ok: false, code, status: r.status, upstream: type || undefined });
  }

  let msg;
  try { msg = await r.json(); } catch (e) { return fail("upstream_error", 502); }

  /* A refusal comes back as an ordinary 200, so it has to be checked before
     the content is read or it looks like an empty answer. */
  if (msg.stop_reason === "refusal") return fail("refused", 200);

  /* Web search is billed on top of this and does not appear in usage, so a
     searched call really costs more than the figure returned here says. */
  const u = msg.usage || {};
  const usd = (Number(u.input_tokens) || 0) * USD_IN + (Number(u.output_tokens) || 0) * USD_OUT;
  const day = spendToday(usd);

  const text = (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const data = extractJSON(text);
  if (!data) return fail("unreadable", 200);

  return reply(200, { ok: true, data,
    spend: { usd: Math.round(usd * 1e4) / 1e4, day: Math.round(day * 100) / 100,
             cap: DAY_CAP, model: MODEL } });
}

```

### `server/ebay.js` — 481 lines

```javascript
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

import { soldCompsFetch, soldCompsReady } from "./soldcomps.js";

const HOSTS = {
  production: { api: "https://api.ebay.com" },
  sandbox:    { api: "https://api.sandbox.ebay.com" },
};
const SCOPE_BROWSE   = "https://api.ebay.com/oauth/api_scope";
const SCOPE_INSIGHTS = "https://api.ebay.com/oauth/api_scope/buy.marketplace.insights";

const SOLD_DAYS = 90;          /* all Insights carries */
const MAX_LIMIT = 50;
/* Under this many real sales, a median is a rumour. Four is the same floor
   the harvest merge uses before it will write a row. */
const MIN_SOLD = 4;

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

/* THE SAME PROBLEM, IN ELECTRONICS. Everything above is small-engine
   vocabulary - carburettors, sprockets, deck belts - because outdoor power
   was where this was first measured. Nobody extended it when electronics
   arrived, so a television search came back as stands, main boards and
   T-CON boards and none of it was recognised: an LG C2, a $700 set,
   returned nine listings of which eight were parts at $30-$140, and the
   one real TV at $350 was outvoted. It was reported as "eBay can't price
   a television" when the truth was that nothing here knew what a TV stand
   was.

   High-precision on purpose. A real laptop listing says "Screen Defect",
   "SCREEN ISSUE", "NO LCD" - bare "screen", "lcd" or "panel" would throw
   away the machines along with the parts, and a real television says "w/
   Stand" while a part says "TV Stand". So every entry here is a phrase
   that appears in parts listings and not in whole-unit ones. Checked
   against nineteen real titles pulled off the live search, TVs and
   laptops both, and it gets all nineteen right. */
const ELEC_PART = /\b(stand base|base plate|base front stand|tv stand|t-?con|main ?board|power ?board|logic ?board|mother ?board|inverter board|backlight (strip|kit|led)|led strips?|ribbon cable|flex cable|digitizer|palm ?rest|top case|bottom case|hinge (set|kit)|lcd panel|display panel|screen (replacement|assembly)|replacement screen|speakers? set|loudspeaker|w\/ ?screws|no screws|bezel|stand legs?|feet only|screen only|charger only|battery only|cable only|case only|strap only|adapter only|selfie stick|phone accessory|screen protector|carrying case|lens filter|nd filter|tempered glass|replacement (band|strap|charger|cable)|control handle|throttle (rod|cable|linkage)|control box|head control|main wire|wir(e|ing) harness|blade propeller|propeller blade|prop blade|handle bar assembly|trigger assembly|clutch assembly|tiller handle|control cover|height extension|top and bottom control|parallel cable kit|fuel valve|wheel kit|control panel|cdi|ecu|ecm|generator fan|recoil starter|carb(urett?or)? kit|oem battery|battery pack only|lens (cover|cap|protector)|housing case|floaty|chest mount|head strap|suction cup mount)\b/i;

const COMPONENT = /\b(carburet(or|tor)|carb kit|sprocket|crankshaft|crankcase|piston|cylinder|muffler|exhaust|flywheel|recoil|ignition coil|spark plug|gasket|handguard|hand guard|spindle|deck belt|air filter|fuel (cap|line|filter|pump|tank)|oil (pump|tank)|clutch (cover|drum)|top cover|side cover|bar cover|intake boot|choke lever|brake lever|handle wrap|rear handle|pull cord|starter rope|primer bulb|av spring|worm gear|oil seal|bearing kit|throttle (lever|control)|manifold|shroud|drive (shaft|tube)|tensioner|trimmer head|autocut|cutting head|bump head|oem head|idler|pulley|fan wheel|wheel rim|(rear|front) wheels?|set screw|insulator|bail plate|control plate|spring arms?|elbow hose|blade guard|deflector|axle coll?er|oil pan|sump|grass bag|grass catcher|bag (and|&) frame|mulch plug|chute)\b/i;

/* What the catalogue calls this kind of thing, reduced to words a seller
   would use. The point is that a listing for the TOOL says what the tool
   is; a listing for a sprocket does not. */
const KIND_STOP = new Set(["and","the","with","kit","for","any","size","current","gen","gal","max","new","used"]);
export function kindWords(kind) {
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
export function modelCodes(t) {
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
  if (PARTS.test(t) || COMPONENT.test(t) || ELEC_PART.test(t) || PARTNO.test(t)) return "part";
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

export { ELEC_PART };
/* `via` forces ONE rung of the ladder instead of walking it.
 *
 *   undefined  the normal ladder: SoldComps, then Insights, then Browse
 *   "soldcomps" only the paid sold-price service; no fallback
 *   "browse"    only eBay's active listings; spends no SoldComps quota
 *
 * Nothing in the desk passes it. It exists for tools/calibrate-asks.mjs,
 * which has to price the SAME query both ways in the same hour to measure
 * what an asking price is worth against a sale - and the ladder, by
 * design, will not give it the worse answer when it can give the better
 * one. A measurement needs both. */
export async function ebayComps({ q, limit, kind, env, signal, via }) {
  const query = String(q || "").trim().slice(0, 120);
  const kinds = kindWords(kind);
  if (!query) return { ok: false, code: "bad_request" };
  const n = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 25));

  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) return { ok: false, code: "no_ebay_key" };

  let note = "";

  /* SoldComps first, when a key is set. eBay declined Insights, so this is
     the only sold data the desk can reach - and a sold price beats an asking
     price on every item, every time. If it is not configured, or it fails,
     or it comes back too thin to mean anything, the ladder carries on down
     to the asking prices that were there before. Nothing gets worse. */
  const only = via === "soldcomps" || via === "browse" ? via : "";

  if (soldCompsReady(env).configured && only !== "browse") {
    try {
      const got = await soldCompsFetch({ q: query, limit: n, kind, env, signal });
      const usable = got.comps.filter((c) => c.fit !== "part" && c.fit !== "lot" && c.fit !== "wrong");
      if (usable.length >= MIN_SOLD) {
        const bits = [];
        if (got.skipped.newStock) bits.push(got.skipped.newStock + " new");
        if (got.skipped.stale) bits.push(got.skipped.stale + " over 90 days old");
        return withBands({
          ok: true, basis: "sold", source: "soldcomps", q: query,
          warning: bits.length ? "set aside " + bits.join(" and ") : undefined,
        }, got.comps);
      }
      /* Too few to price on. Say so, and fall through rather than hand back
         a median built on two sales. */
      note = "only " + usable.length + " used sale" + (usable.length === 1 ? "" : "s")
        + " in 90 days, fell back to asking prices";
    } catch (e) {
      note = e.code === "soldcomps_quota" ? "sold-price quota spent for the month, fell back to asking prices"
           : e.code === "soldcomps_auth" ? "sold-price key rejected, fell back to asking prices"
           : "sold lookup failed (" + (e.code || "error") + "), fell back to asking prices";
      if (only === "soldcomps") return { ok: false, code: e.code || "soldcomps_error" };
    }
    /* Asked for sold data and there is not enough of it: say so rather than
       quietly handing back asking prices the caller did not ask for. */
    if (only === "soldcomps") return { ok: false, code: "soldcomps_thin", note };
  }
  if (only === "soldcomps") return { ok: false, code: "no_soldcomps_key" };

  if (!insightsDenied && only !== "browse") {
    try {
      const all = await soldComps(query, n, env, signal, kinds);
      return withBands({ ok: true, basis: "sold", source: "marketplace_insights", q: query }, all);
    } catch (e) {
      if (e.code === "ebay_scope") {
        /* Not granted. Say so once, then stop asking for the rest of the
           run. This is now the permanent state: eBay declined the
           application on 23 Sep 2026 ("highly limited and generally
           reserved for eBay's approved partners only", ticket closed). The
           try above is left in place anyway - it costs one refused call per
           cold start, and if the shop ever becomes an approved partner the
           whole desk switches to sold prices without a line changing. */
        insightsDenied = true;
        /* Only if SoldComps has not already said something truer. It knows
           the real reason - two sales in ninety days, or a spent quota -
           and "eBay never granted us Insights" is a permanent background
           fact, not what happened on THIS lookup. The counter reads this
           line to decide whether to trust the number. */
        if (!note) note = "sold data unavailable: this keyset is not granted Marketplace Insights";
      } else if (e.code === "no_ebay_key" || e.code === "ebay_auth") {
        return { ok: false, code: e.code, status: e.status,
                 upstream: e.upstream, upstreamText: e.upstreamText };
      } else if (!note) {
        note = "sold lookup failed (" + e.code + "), fell back to asking prices";
      }
    }
  } else if (!note && only !== "browse") {
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
    /* Which door the sold prices come through, so /limits answers the
       question the counter actually has: am I about to get sales or asks? */
    soldSource: set("SOLDCOMPS_KEY") ? "soldcomps" : (insightsDenied ? "none" : "insights"),
    sold: set("SOLDCOMPS_KEY") || !insightsDenied,
    marketplace: env.EBAY_MARKETPLACE || "EBAY_US",
    env: String(env.EBAY_ENV || "production").toLowerCase(),
    seen, missing,
    ...(strays.length ? { unrecognised: strays } : {}),
  };
}

/* Tests reach in to clear the remembered refusal between cases. */
export function ebayReset() { tokens.clear(); insightsDenied = false; }

```

### `server/soldcomps.js` — 110 lines

```javascript
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

```

### `server/store.js` — 125 lines

```javascript
/* Shared record store. The phone and the desk each keep their own copy in the
 * browser and work offline; this is what makes those copies the same record.
 *
 * It sits behind the service on purpose. A database the page talks to directly
 * would mean putting its config in a file anyone can read and defending the
 * data with rules alone. The service already holds the secrets and already
 * checks PAWN_TOKEN, so syncing through it exposes nothing new.
 *
 * The record is a JSON file per store on a disk attached to the service. That
 * is the whole database: one shop, three lists, a few thousand short rows. A
 * hosted database would be another account to own and another key to keep, and
 * it would not hold anything this cannot.
 *
 * DATA_DIR is where that disk is mounted (default /data). Without a writable
 * one the store falls back to memory, which is useful for trying the flow out
 * but forgets everything when the service restarts - it says so in the reply.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const STORES = { comps: "pawndesk_comps", seen: "pawndesk_seen", deals: "pawndesk_deals",
                 harvest: "pawndesk_harvest" };
const DIR = process.env.DATA_DIR || "/data";
const PULL_LIMIT = 2000;
const KEEP = 5000;                /* per store; the devices themselves keep 800 */

let mode = "memory", tried = false;
const mem = {};                   /* store -> id -> row */
let chain = Promise.resolve();    /* one writer at a time, so two devices syncing
                                     at once cannot interleave a read and a write */

/* A volume that has gone unresponsive would otherwise hang every sync that
   touches it, forever, rather than falling back. Bound the check. */
function within(ms, work) {
  return Promise.race([work, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms).unref())]);
}

async function connect() {
  if (tried) return;
  tried = true;
  try {
    await within(5000, (async () => {
      await fs.mkdir(DIR, { recursive: true });
      const probe = path.join(DIR, ".writable");
      await fs.writeFile(probe, String(Date.now()));
      await fs.unlink(probe);
    })());
    mode = "disk";
  } catch (e) {
    /* No volume attached, or it is read-only. The counter keeps its own copy
       either way, it just stops being shared - and the reply says so. */
    mode = "memory";
  }
}

const fileFor = store => path.join(DIR, STORES[store] + ".json");

async function readStore(store) {
  if (mode !== "disk") return mem[store] = mem[store] || {};
  try {
    const raw = await fs.readFile(fileFor(store), "utf8");
    const o = JSON.parse(raw);
    return (o && typeof o === "object" && o.rows) || {};
  } catch (e) {
    if (e.code === "ENOENT") return {};
    /* Unreadable rather than absent: keep the file so it can be looked at
       rather than writing over the top of it, and carry on empty. */
    try { await fs.rename(fileFor(store), fileFor(store) + ".bad-" + Date.now()); } catch (e2) {}
    return {};
  }
}

async function writeStore(store, map) {
  if (mode !== "disk") { mem[store] = map; return; }
  const f = fileFor(store), tmp = f + ".tmp";
  /* Write beside it and rename: a restart mid-write leaves the old file
     whole rather than half a new one. */
  await fs.writeFile(tmp, JSON.stringify({ updated: Date.now(), rows: map }));
  await fs.rename(tmp, f);
}

function trim(map) {
  const ids = Object.keys(map);
  if (ids.length <= KEEP) return map;
  const keep = ids.sort((a, b) => (map[b].ts || 0) - (map[a].ts || 0)).slice(0, KEEP);
  const out = {};
  keep.forEach(id => { out[id] = map[id]; });
  return out;
}

export function storeMode() { return mode; }

/* Push what this device has, then hand back everything it has not seen.
   Rows carry their own id and ts, so merging is by id and the newer ts wins -
   no ordering between devices to get wrong. */
export async function syncMerge(store, rows, since) {
  if (!STORES[store]) return { ok: false, code: "bad_store" };
  await connect();

  const incoming = (Array.isArray(rows) ? rows : [])
    .filter(r => r && typeof r.id === "string" && r.id.length <= 64)
    .slice(0, 2000);
  const from = Number(since) || 0;

  const run = async () => {
    const map = await readStore(store);
    incoming.forEach(r => { const o = map[r.id]; if (!o || (r.ts || 0) >= (o.ts || 0)) map[r.id] = r; });
    const kept = trim(map);
    if (incoming.length) await writeStore(store, kept);
    const out = Object.values(kept)
      .filter(r => (r.ts || 0) > from)
      .sort((a, b) => (a.ts || 0) - (b.ts || 0))
      .slice(0, PULL_LIMIT);
    const res = { ok: true, mode, rows: out, held: Object.keys(kept).length };
    if (mode !== "disk") res.warning = "not saved: no disk attached to the service";
    return res;
  };

  /* Queue behind whatever else is syncing, and never let one failed sync
     wedge the queue for the next one. */
  const next = chain.then(run, run);
  chain = next.catch(() => {});
  return next;
}

```

### `server/package.json` — 16 lines

```json
{
  "name": "pawn-desk-service",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Price, photo and shared-record service for The Pawn Desk",
  "main": "server.js",
  "scripts": {
    "//": "Railway is told to run node directly (railway.json). Going through npm start means Railway's SIGTERM lands on npm, which reports the child dying by a signal as a failed command - and the platform mails a crash notice for an ordinary redeploy.",
    "start": "node server.js"
  },
  "engines": {
    "node": ">=20"
  },
  "dependencies": {}
}
```
