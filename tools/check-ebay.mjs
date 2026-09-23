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
import { ebayReset, fitOf } from "../server/ebay.js";

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

const hits = [];
const stub = createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  hits.push(u.pathname);
  const j = (code, o) => res.writeHead(code, { "content-type": "application/json" }).end(JSON.stringify(o));

  if (u.pathname === "/identity/v1/oauth2/token") {
    let b = ""; for await (const c of req) b += c;
    const scope = new URLSearchParams(b).get("scope") || "";
    if (mode === "denied" && scope.includes("marketplace.insights"))
      return j(400, { error: "invalid_scope", error_description: "The requested scope is invalid" });
    if (mode === "badkey")
      return j(401, { error: "invalid_client", error_description: "client authentication failed" });
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

/* TELLING A MACHINE FROM ITS SPARE PARTS.
   A search for "Husqvarna 240" comes back as springs, fuel caps, sprockets
   and crankcases. Priced together they made a $180 chainsaw read $8-21 and
   a $500 riding mower read $25-50. Two things separate them: the catalogue
   knows this row is a Chainsaw and a sprocket never claims to be one, and
   nearly every parts listing carries an OEM part number while almost no
   whole-unit listing does.
   The second half of this - that real machines SURVIVE - matters as much:
   a filter that drops everything leaves the counter with no price at all,
   which is its own kind of wrong. */
console.log("\n  parts against whole machines");
{
  const none = new Set();
  const junk = [
    [["chainsaw"],            "Husqvarna 240 Sprocket (Used) Genuine"],
    [["chainsaw"],            "Husqvarna 240S Chainsaw OEM Crankcase"],
    [["backpack","blower"],   "STIHL BR600 Blower Fan Wheel - Genuine OEM - 4282 700 34"],
    [["push","mower"],        "Honda HRX217 Walk Behind Mower OEM Rear Wheel 42710-VH7-010ZA"],
    [["push","mower"],        "Stens Mower Blade 345-165 Steel for Toro TimeMaster 18 in"],
    [["pressure","washer"],   "Spring 285800-33 , honda gx200 dewalt 3100 psi washer"],
    [["string","trimmer"],    "STIHL FS45 FS46 TRIMMER AUTOCUT HEAD 4006-713-3600"],
  ];
  for (const [k, t] of junk)
    ok(fitOf(t, none, k) === "part" || fitOf(t, none, k) === "wrong",
       "dropped: " + t.slice(0, 52));

  const real = [
    [["chainsaw"],          "HUSQVARNA 240 X-TORQ 14in CHAIN SAW 38CC"],
    [["backpack","blower"], "Stihl BR 600 Backpack Leaf Blower"],
    [["push","mower"],      "Honda HRX217 VKA Self Propelled Lawn Mower 21in"],
    [["cordless","drill"],  "Milwaukee 2904-20 M18 FUEL Hammer Drill Kit with Battery"],
  ];
  for (const [k, t] of real) {
    const f = fitOf(t, none, k);
    ok(f !== "part" && f !== "wrong", "KEPT (" + f + "): " + t.slice(0, 46));
  }
  /* the one that would quietly wreck the drills */
  ok(fitOf("Milwaukee 2904-20 M18 FUEL Hammer Drill", new Set(), ["cordless","drill"]) !== "part",
     "a model number four-digits-then-two is not read as a part number");
}

/* A WRONG KEY MUST NOT LOOK LIKE AN UNGRANTED SCOPE. Both used to be called
   ebay_scope, and a scope refusal falls back to asking prices quietly - so a
   mistyped Cert ID produced a lookup that worked and returned asks, with
   nothing anywhere saying the key was bad. That is the silent wrongness this
   whole endpoint exists to stamp out. */
mode = "badkey"; ebayReset();
/* The stub only answers /identity/v1/oauth2/token, so every case below
   fails if the path regresses. Say so explicitly too, since a 404 here
   masquerades as an auth failure and cost an evening. */
console.log("\n  the token endpoint path");
{
  mode = "sold"; ebayReset();
  const r = await post({ q: "DeWalt DW735" });
  ok(r.body.ok, "the token is fetched from /identity/v1/oauth2/token (a wrong path 404s and reads as bad credentials)");
  ok(hits.includes("/identity/v1/oauth2/token"), "and that is the path actually called — saw: "
     + hits.filter(h => /oauth/.test(h)).join(", "));
}

mode = "badkey"; ebayReset();
console.log("\n  the credentials are wrong");
{
  const r = await post({ q: "DeWalt DW735" });
  ok(!r.body.ok, "the lookup FAILS rather than quietly serving asking prices");
  ok(r.body.code === "ebay_auth", 'it is ebay_auth, not ebay_scope — got ' + r.body.code);
  ok(r.body.status === 401, "carries eBay's status, 401 — got " + r.body.status);
  ok(r.body.upstream === "invalid_client", "and eBay's own error name — got " + r.body.upstream);
}

/* THE HANDSHAKE THAT ENABLES THE KEYSET. eBay will not turn a production
   keyset on until this answers correctly, and the failure mode is silent:
   a wrong hash just leaves the keyset disabled with no message saying why.
   The usual cause is the endpoint URL - it is hashed, so it must be exactly
   what was typed into eBay's portal, which is why it comes from the
   environment and not from the request a proxy handed us. */
console.log("\n  the account-deletion handshake");
{
  const crypto = await import("node:crypto");
  const VERIFY = "pawndesk-verify-token-0123456789abcd";
  const URL_ = "https://svc.example.com/ebay/deletion";
  const e = { EBAY_VERIFY_TOKEN: VERIFY, EBAY_DELETION_URL: URL_ };

  const r = await handle({ path:"/ebay/deletion", method:"GET", query:{challenge_code:"abc123"}, env:e });
  const want = crypto.createHash("sha256").update("abc123").update(VERIFY).update(URL_).digest("hex");
  ok(r.status === 200, "answers 200");
  ok(r.body.challengeResponse === want, "hash is sha256(code + token + url), hex");
  ok(r.body.challengeResponse.length === 64, "64 hex chars, not base64 — got " + (r.body.challengeResponse || "").length);

  /* the same code with a different endpoint must NOT collide - this is the
     bit that catches a URL typed one way here and another way at eBay */
  const r2 = await handle({ path:"/ebay/deletion", method:"GET", query:{challenge_code:"abc123"},
                            env:{...e, EBAY_DELETION_URL:"https://svc.example.com/ebay/deletion/"} });
  ok(r2.body.challengeResponse !== want, "a trailing slash on the URL changes the hash (so it must match eBay exactly)");

  const post = await handle({ path:"/ebay/deletion", method:"POST", body:{}, env:e });
  ok(post.status === 200, "a real notification is acknowledged 200 so eBay stops retrying");

  const noTok = await handle({ path:"/ebay/deletion", method:"GET", query:{challenge_code:"x"}, env:{} });
  ok(noTok.status === 500 && noTok.body.code === "no_verify_token", "says so when the token is not set");

  const noCode = await handle({ path:"/ebay/deletion", method:"GET", query:{}, env:e });
  ok(noCode.body.code === "bad_request", "a GET with no challenge code is refused");

  /* it must answer without PAWN_TOKEN - eBay has no way to send one */
  const gated = await handle({ path:"/ebay/deletion", method:"GET", query:{challenge_code:"abc123"},
                               token:"", env:{...e, PAWN_TOKEN:"secret"} });
  ok(gated.body.challengeResponse === want, "answers eBay even though PAWN_TOKEN is set — eBay cannot send one");
}

/* WHICH MODEL READS THE PHOTO IS A RAILWAY VARIABLE.
   Opus 5 reads a worn badge well and charges five times what Haiku does.
   Whether Haiku reads the same badges is a question for ten awkward items
   off the shelf, not for arithmetic - so the switch has to be a restart,
   not a deploy, or the comparison never gets made.
   MODEL is read once at import, so each value needs its own process. */
console.log("\n  the photo model is a variable, and it is priced for what it is");
{
  const { execFileSync } = await import("node:child_process");
  const probe = (model) => {
    const src = `
      const {handle} = await import(${JSON.stringify(new URL("../server/core.js", import.meta.url).href)});
      const r = await handle({path:"/limits", method:"GET", token:"", body:null, env:{}, query:{}});
      console.log(JSON.stringify(r.body.photo));`;
    const out = execFileSync(process.execPath, ["--input-type=module", "-e", src],
      { encoding: "utf8", env: { ...process.env, PHOTO_MODEL: model } });
    return JSON.parse(out.trim().split("\n").pop());
  };
  const def   = probe("");
  const haiku = probe("claude-haiku-4-5");
  const typo  = probe("claude-haiku-45-nope");

  ok(def.model === "claude-opus-5" && def.usdPerMTok.in === 5,
     "unset leaves it on Opus 5 at $5/$25 \u2014 a deploy changes nothing by itself");
  ok(haiku.model === "claude-haiku-4-5" && haiku.usdPerMTok.in === 1 && haiku.usdPerMTok.out === 5,
     "  PHOTO_MODEL=claude-haiku-4-5 switches it, priced at $1/$5");
  ok(typo.model === "claude-opus-5" && typo.ignored === true && typo.asked === "claude-haiku-45-nope",
     "  a typo is refused and SAID, not run \u2014 it keeps the default and reports what it ignored");
  ok(def.dayCap > 0, "  and the daily spend cap is reported so it can be checked from outside \u2014 $" + def.dayCap);
}

/* The model has to reach the wire, and the spend has to be priced for the
   model that actually answered - reporting Opus rates for a Haiku call
   would make the cap and the harvest's budget both wrong. */
console.log("\n  the chosen model reaches the call, and prices it");
{
  const { execFileSync } = await import("node:child_process");
  const run = (model) => {
    const src = `
      import {createServer} from "node:http";
      const seen = [];
      const srv = createServer((req,res)=>{ let b=""; req.on("data",c=>b+=c); req.on("end",()=>{
        seen.push(JSON.parse(b));
        res.writeHead(200,{"content-type":"application/json"});
        res.end(JSON.stringify({stop_reason:"end_turn",content:[{type:"text",text:'{"ok":1}'}],
          usage:{input_tokens:3500,output_tokens:300}}));});});
      await new Promise(r=>srv.listen(0,r));
      const url = "http://127.0.0.1:" + srv.address().port;
      const {handle} = await import(${JSON.stringify(new URL("../server/core.js", import.meta.url).href)});
      const r = await handle({path:"/json", method:"POST", token:"t", query:{},
        body:{prompt:"read this", images:[]},
        env:{PAWN_TOKEN:"t", ANTHROPIC_API_KEY:"x", ANTHROPIC_URL:url}});
      srv.close();
      console.log(JSON.stringify({wire: seen[0] && seen[0].model, spend: r.body.spend}));`;
    const out = execFileSync(process.execPath, ["--input-type=module", "-e", src],
      { encoding: "utf8", env: { ...process.env, PHOTO_MODEL: model } });
    return JSON.parse(out.trim().split("\n").pop());
  };
  const o = run("claude-opus-5"), h = run("claude-haiku-4-5");
  ok(o.wire === "claude-opus-5" && h.wire === "claude-haiku-4-5",
     "the variable reaches the request body, not just the status page");
  ok(o.spend.model === o.wire && h.spend.model === h.wire,
     "  the spend names the model that answered");
  /* 3500 in + 300 out: Opus $0.0175+$0.0075, Haiku $0.0035+$0.0015 */
  ok(Math.abs(o.spend.usd - 0.025) < 1e-6 && Math.abs(h.spend.usd - 0.005) < 1e-6,
     "  and is priced for it \u2014 the same read costs $" + o.spend.usd + " on Opus, $" + h.spend.usd + " on Haiku");
  ok(Math.abs(o.spend.usd / h.spend.usd - 5) < 0.01,
     "  a five-fold difference, which on 200 photos a month is $5.00 against $1.00");
}

/* A FAILURE HAS TO SAY WHY.
   Everything but 401 and 429 came back as "upstream_error", so an empty
   balance - which Anthropic reports as a 400, not a 401 - looked exactly
   like a network fault. On the day the key moved to a fresh account that
   was the likeliest cause of all, and the counter was told nothing that
   pointed at it. The upstream status and error type carry through; the
   upstream MESSAGE does not, because it is somebody else's text. */
console.log("\n  a failed read names its own cause");
{
  const { createServer } = await import("node:http");
  const { handle: h } = await import("../server/core.js");
  const cases = [
    [400, "invalid_request_error", "Your credit balance is too low to access the Claude API.", "no_credit"],
    [401, "authentication_error",  "invalid x-api-key",  "no_key"],
    [403, "permission_error",      "not allowed",        "not_allowed"],
    [429, "rate_limit_error",      "slow down",          "rate_limited"],
    [500, "api_error",             "boom",               "upstream_error"],
  ];
  let at = 0;
  const srv = createServer((req, res) => { let b = ""; req.on("data", c => b += c); req.on("end", () => {
    const [st, type, message] = cases[at];
    res.writeHead(st, {"content-type": "application/json"});
    res.end(JSON.stringify({ error: { type, message } })); }); });
  await new Promise(r => srv.listen(0, r));
  const url = "http://127.0.0.1:" + srv.address().port;
  for (at = 0; at < cases.length; at++) {
    const [st, type, message, want] = cases[at];
    const r = await h({ path: "/json", method: "POST", token: "t", query: {},
      body: { prompt: "x", images: [] },
      env: { PAWN_TOKEN: "t", ANTHROPIC_API_KEY: "k", ANTHROPIC_URL: url } });
    ok(r.body.code === want,
       `upstream ${st} reads as "${want}" \u2014 got "${r.body.code}"`);
    ok(r.body.status === st && r.body.upstream === type,
       `  carrying the status and type through \u2014 ${r.body.status}/${r.body.upstream}`);
    ok(!JSON.stringify(r.body).includes(message),
       "  without repeating the upstream's own words");
  }
  srv.close();
  /* The counter has to be told something it can act on. */
  const app = (await import("node:fs")).readFileSync(new URL("../app.js", import.meta.url), "utf8");
  ok(/case "no_credit":/.test(app) && /platform\.claude\.com/.test(app),
     "and the counter is told to top the account up, not that the tool is broken");
  ok(/case "not_allowed":/.test(app), "  with its own line for a refused key");
}

stub.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
