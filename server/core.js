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
      const out = await ebayComps({ q: body.q, limit: body.limit, kind: body.kind, env, signal });
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
