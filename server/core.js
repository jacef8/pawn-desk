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
 */

export const MODEL = "claude-opus-5";
const API = "https://api.anthropic.com/v1/messages";
const DEFAULT_ORIGIN = "https://jacef8.github.io";
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const corsHeaders = (env) => ({
  "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || DEFAULT_ORIGIN,
  "Access-Control-Allow-Headers": "content-type,x-pawn-token",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
});

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
export async function handle({ path, method, token, body, env, signal }) {
  if (path === "/limits" || path === "/") {
    return reply(200, { ok: true, images: { mediaTypes: OK_TYPES, maxCount: MAX_IMAGES, maxBytes: MAX_IMAGE_BYTES } });
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

  if (!r.ok) {
    const code = r.status === 429 ? "rate_limited" : r.status === 401 ? "no_key" : "upstream_error";
    return fail(code, r.status === 429 ? 429 : 502);
  }

  let msg;
  try { msg = await r.json(); } catch (e) { return fail("upstream_error", 502); }

  /* A refusal comes back as an ordinary 200, so it has to be checked before
     the content is read or it looks like an empty answer. */
  if (msg.stop_reason === "refusal") return fail("refused", 200);

  const text = (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const data = extractJSON(text);
  if (!data) return fail("unreadable", 200);

  return reply(200, { ok: true, data });
}
