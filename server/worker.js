/* Cloudflare Workers. Same plumbing job as server.js, different host.
 * Deploy with wrangler from this folder; the logic is in core.js. */
import { handle, corsHeaders } from "./core.js";

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env);
    const send = (status, obj) =>
      new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", ...cors } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    let body = null;
    if (request.method === "POST") {
      try { body = await request.json(); }
      catch (e) { return send(400, { ok: false, code: "bad_request" }); }
    }
    const out = await handle({
      path: new URL(request.url).pathname, method: request.method,
      token: request.headers.get("x-pawn-token") || "",
      body, env, signal: request.signal,
    });
    return send(out.status, out.body);
  },
};
