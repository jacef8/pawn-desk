/* Railway (or any Node host). Nothing here but plumbing: read the request,
 * hand it to core.js, write the answer back. No dependencies - Node's own
 * http and fetch are enough, so there is no install step to go stale. */
import { createServer } from "node:http";
import { handle, corsHeaders } from "./core.js";

const PORT = process.env.PORT || 3000;
const MAX_BODY = 8 * 1024 * 1024;   /* four photographs, comfortably */

const readBody = (req) => new Promise((resolve, reject) => {
  let n = 0; const chunks = [];
  req.on("data", (c) => {
    n += c.length;
    if (n > MAX_BODY) { reject(new Error("too_big")); req.destroy(); return; }
    chunks.push(c);
  });
  req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  req.on("error", reject);
});

createServer(async (req, res) => {
  const cors = corsHeaders(process.env);
  const send = (status, obj) =>
    res.writeHead(status, { "content-type": "application/json", ...cors }).end(JSON.stringify(obj));

  try {
    if (req.method === "OPTIONS") return res.writeHead(204, cors).end();

    const path = new URL(req.url, "http://localhost").pathname;
    let body = null;
    if (req.method === "POST") {
      let raw;
      try { raw = await readBody(req); }
      catch (e) { return send(413, { ok: false, code: "too_big" }); }
      try { body = JSON.parse(raw || "{}"); }
      catch (e) { return send(400, { ok: false, code: "bad_request" }); }
    }

    const out = await handle({
      path, method: req.method,
      token: req.headers["x-pawn-token"] || "",
      body, env: process.env,
    });
    send(out.status, out.body);
  } catch (e) {
    /* A thrown request must not take the process with it; Railway would
       restart and the counter would see a dead service. */
    send(500, { ok: false, code: "server_error" });
  }
}).listen(PORT, () => console.log("pawn desk service listening on " + PORT));
