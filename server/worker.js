/* The Pawn Desk — price and photo service.
 *
 * A static page cannot read another website and cannot hold an API key, so the
 * two things the counter wants most — identifying an item from a photo, and
 * pulling a new-retail price without opening a tab — need something small
 * sitting between the app and Anthropic. This is that something.
 *
 * Deliberately one file with no build step: it is meant to be pasted into the
 * Cloudflare dashboard by someone who is not a developer. If you would rather
 * build it properly, the same endpoints work under wrangler with
 * @anthropic-ai/sdk; see README.md.
 *
 * Secrets (set in Cloudflare, never in this file or the repo):
 *   ANTHROPIC_API_KEY  — required
 *   PAWN_TOKEN         — required; the desk sends it back so strangers who
 *                        find the URL cannot spend your key
 *   ALLOW_ORIGIN       — optional; defaults to the Pages site
 */

const MODEL = "claude-opus-5";
const API = "https://api.anthropic.com/v1/messages";
const DEFAULT_ORIGIN = "https://jacef8.github.io";
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

const cors = (env) => ({
  "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || DEFAULT_ORIGIN,
  "Access-Control-Allow-Headers": "content-type,x-pawn-token",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
});

const send = (env, body, status) =>
  new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "content-type": "application/json", ...cors(env) },
  });

const fail = (env, code, status) => send(env, { ok: false, code }, status || 400);

/* The model is asked for JSON, but a stray sentence or code fence should not
   cost the counter the answer. Take the outermost balanced object. */
function extractJSON(text) {
  const t = String(text || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  try { return JSON.parse(t); } catch (e) {}
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(env) });

    if (url.pathname === "/limits") {
      return send(env, { images: { mediaTypes: OK_TYPES, maxCount: MAX_IMAGES, maxBytes: MAX_IMAGE_BYTES } });
    }

    if (url.pathname !== "/json" || request.method !== "POST") return fail(env, "not_found", 404);

    if (!env.ANTHROPIC_API_KEY) return fail(env, "no_key", 500);
    if (env.PAWN_TOKEN && request.headers.get("x-pawn-token") !== env.PAWN_TOKEN)
      return fail(env, "bad_token", 403);

    let body;
    try { body = await request.json(); } catch (e) { return fail(env, "bad_request"); }

    const prompt = String(body && body.prompt || "").slice(0, 20000);
    if (!prompt) return fail(env, "bad_request");

    const images = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
    for (const im of images) {
      if (!im || OK_TYPES.indexOf(im.media_type) < 0 || typeof im.data !== "string")
        return fail(env, "image_rejected");
      if (im.data.length * 0.75 > MAX_IMAGE_BYTES) return fail(env, "image_rejected");
    }

    const content = images.map((im) => ({
      type: "image",
      source: { type: "base64", media_type: im.media_type, data: im.data },
    }));
    content.push({ type: "text", text: prompt });

    const req = {
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: "user", content }],
      fallbacks: "default",
    };
    /* Only the retail lookup needs the open web; the photo reader must not go
       wandering off to shop for the thing it is looking at. */
    if (body.search) req.tools = [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }];

    let r;
    try {
      r = await fetch(API, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "server-side-fallback-2026-07-01",
        },
        body: JSON.stringify(req),
        signal: request.signal,
      });
    } catch (e) {
      return fail(env, "upstream_error", 502);
    }

    if (!r.ok) {
      const code = r.status === 429 ? "rate_limited" : r.status === 401 ? "no_key" : "upstream_error";
      return fail(env, code, r.status === 429 ? 429 : 502);
    }

    const msg = await r.json();

    /* A refusal comes back as a normal 200, so it has to be checked before the
       content is read or it looks like an empty answer. */
    if (msg.stop_reason === "refusal") return fail(env, "refused", 200);

    const text = (msg.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const data = extractJSON(text);
    if (!data) return fail(env, "unreadable", 200);

    return send(env, { ok: true, data });
  },
};
