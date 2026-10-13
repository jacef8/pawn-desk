#!/usr/bin/env node
/* THE OVERNIGHT GUN READER, TESTED WHERE IT CAN BE.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-overnight.mjs
 *
 * GunWatcher cannot be reached from here - it answers a datacentre with a
 * Cloudflare captcha, which is the whole reason the reader runs on the shop
 * computer. So this suite does NOT test that the reader can fetch. It tests
 * the two things that decide whether a bad night is loud or quiet:
 *
 *   1. readPage() refuses every page that is not what it claims to be
 *   2. the CSV it writes is a shape the desk's own importer reads
 *
 * The first matters because of what happened the day before it was written:
 * an extraction model asked for sold prices off an eBay page that was a
 * login wall handed back a Ruger LCP at $350 and an LCP II at $450, with
 * dates and conditions, off a page holding nothing but a sign-in box. The
 * fixtures below include that exact shape.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; } catch { return null; } })()
].filter(Boolean)) { try { ({chromium} = req(m)); break; } catch {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

/* readPage is not exported - the reader is a script, not a module - so it is
   lifted out of the source. Reading the real file rather than a copy is the
   point: a copy drifts and then this suite is testing something that is not
   shipping. */
const src = fs.readFileSync("tools/gun-overnight.mjs", "utf8");
const WALL_SRC = src.match(/const WALL = (\/[\s\S]*?\/i);/)[1];
const FN_SRC = src.match(/function readPage\(text, model\) \{[\s\S]*?\n\}/)[0];
const readPage = new Function("WALL", FN_SRC + "; return readPage;")(eval(WALL_SRC));

console.log("\n  the reader refuses a page that is not the price page");

/* the exact failure that started this: a wall with no listings on it.
   PADDED ON PURPOSE. The first version of this fixture was 110 characters
   and the suite passed - on the length check, not on the wall check. The
   real eBay wall was 5,774 bytes. An assertion that goes green for a
   reason other than the one it names is worth less than no assertion, so
   every wall fixture below is padded past the length gate and the thing
   actually under test is the WALL pattern. */
const PAD = "\nShop by category. Daily Deals. Brand Outlet. Gift Cards. Help & Contact. Sell. Watchlist. My eBay. Notification. Expand Cart.".repeat(12);
/* AND IT MENTIONS THE GUN, AND IT HAS MONEY ON IT. Without those two the
   wrong-model guard and the figure-count guard catch this fixture first
   and the wall pattern is never reached - which is what happened: the wall
   guard was deleted and this line stayed green. A real sign-in redirect
   carries the search terms in its return URL, so a wall that names the gun
   is the realistic shape, not a contrived one. */
const LOGIN = `Sign in to your account
New to eBay? Create account — Ruger LCP
Email or username
Continue
Password
Sign in
Stay signed in
Ruger LCP average sold $350
Ruger LCP sold range $340 to $450` + PAD;
let r = readPage(LOGIN, "Ruger LCP");
ok(!!r.skip, `  a sign-in page is refused — ${r.skip || "ACCEPTED, and that is the bug"}`);

const CF = `Attention Required! | Cloudflare
Please enable cookies.
Checking your browser before accessing gunwatcher.com.
Ray ID: 8f2c1a
Remington 870 Express average sold $500
Remington 870 Express sold value range $500 to $900` + PAD;
r = readPage(CF, "Remington 870 Express");
ok(!!r.skip, `  a Cloudflare interstitial is refused even with money on it — ${r.skip || "ACCEPTED"}`);

r = readPage("Loading..." + PAD, "Remington 870 Express");
ok(!!r.skip, `  a page still loading is refused — ${r.skip || "ACCEPTED"}`);

r = readPage("", "Remington 870 Express");
ok(!!r.skip, `  an empty page is refused — ${r.skip || "ACCEPTED"}`);

/* THE ONE THAT CATCHES A SILENT WRONG ANSWER. The page loads, it is a real
   price page, and it is about a different gun. Nothing about it looks broken
   and every number on it is real. */
const WRONGGUN = "x".repeat(600) + `
Mossberg 500 market values
Average sold $280
Sold range $225 to $325
Recent sold prices`;
r = readPage(WRONGGUN, "Remington 870 Express");
ok(!!r.skip && /wrong model|does not mention/i.test(r.skip),
   `  a real price page for the WRONG gun is refused — ${r.skip || "ACCEPTED, and the book gets a Mossberg price"}`);

/* asks must not be read as sales */
/* EVERY LINE HERE MATCHES A SOLD WORD *AND* AN ASK WORD. The first version
   used bare "Asking price $400", which matches no sold word at all, so the
   figure-count guard rejected it and the asks filter was never exercised -
   deleting the asks filter left this line green. These lines can only be
   excluded by the asks filter itself. */
const ASKS = "y".repeat(600) + `
Remington 870 Express
Average asking price $400
Sold out — asking $425 buy it now
Current value, asking $410`;
r = readPage(ASKS, "Remington 870 Express");
ok(!!r.skip, `  a page of asking prices only is refused — ${r.skip || "ACCEPTED, and asks run high"}`);

/* a page of mixed models, where low and high are not one gun */
const MIXED = "z".repeat(600) + `
Remington 870 Express
Sold $150
Sold $4200
average sold range`;
r = readPage(MIXED, "Remington 870 Express");
ok(!!r.skip && /too wide/i.test(r.skip), `  a 28x spread is refused as more than one model — ${r.skip || "ACCEPTED"}`);

/* ── THE REAL PAGE THAT NEARLY GOT THROUGH ────────────────────────────
   tools/fixtures/guns-com-ended.txt is the actual Guns.com recently-ended
   page, cut down, as it came off the shop computer on 13 Oct 2026. It is
   here because it beat the wrong-model guard: headed "REMINGTON 870
   EXPRESS 15450 RESULTS", carrying a filter chip that says the same, and
   listing a Glock, a Springfield, a gold Colt Python and a Marlin .22.
   The keyword does nothing on that URL. A fixture written by hand would
   never have had that shape, because I did not know a site did that until
   one did. */
console.log("\n  the real Guns.com page, which beat the first guard");
{
  const real = fs.readFileSync("tools/fixtures/guns-com-ended.txt", "utf8");
  const r2 = readPage(real, "Remington 870 Express");
  ok(!!r2.skip, `  it is refused — ${r2.skip || "ACCEPTED, and the book gets a Glock price"}`);
  ok(!!r2.skip && /beside any price|ignored the search/.test(r2.skip),
     `  and refused for the RIGHT reason, not by luck — ${r2.skip || ""}`);
  /* and the words really are on it, so the old guard really was useless */
  const low = real.toLowerCase();
  ok(["remington", "870", "express"].every((w) => low.includes(w)),
     "  the gun IS named on the page, which is exactly why the old check passed it");
}

/* STARTING BID (NO BIDS) IS NOT A SALE. Two on that same page: a Ruger
   LCP II at $300 and a Marlin Model 60 at $200, both closed, both unsold. */
console.log("\n  an unsold lot is not a sale");
{
  /* SHAPED LIKE THE REAL PAGE, which is the only way this tests anything:
     the words that say what kind of price it is sit ABOVE the number, and
     a "WINNING BID" line is there too so the sold-word rule is satisfied
     and the no-bids rule is the only thing that can refuse it. The first
     version put a bare $300.00 on its own line and went green because the
     sold-word rule caught it - the no-bids filter was never reached. */
  const unsold = "q".repeat(600) + `
Remington 870 Express
Condition:  USED
AUCTION
Closed
WINNING BID (0)
STARTING BID (NO BIDS)
$300.00
Remington 870 Express
Condition:  USED
Closed
WINNING BID (0)
STARTING BID (NO BIDS)
$200.00`;
  const r3 = readPage(unsold, "Remington 870 Express");
  ok(!!r3.skip, `  a closed lot nobody bid on is refused — ${r3.skip || "ACCEPTED, and an ask became a sale"}`);
}

console.log("\n  and it does read a good page");
/* The model now has to appear NEXT TO the money, which is what a real
   per-model page looks like and what the ignored-search page did not. */
const GOOD = "w".repeat(600) + `
Remington 870 Express market value
Remington 870 Express average sold price $340
Remington 870 Express sold range low $300 high $395
Based on completed auctions`;
r = readPage(GOOD, "Remington 870 Express");
ok(!r.skip && r.lo === 300 && r.hi === 395,
   `  reads $${r.lo}-$${r.hi} off a real page — ${r.skip || "ok"}`);
ok(Array.isArray(r.from) && r.from.length > 0 && /\$/.test(r.from[0]),
   `  and records the line it took it from — "${(r.from || [""])[0].slice(0, 54)}"`);

/* ── the CSV has to land ──────────────────────────────────────────────── */
console.log("\n  the CSV it writes is one the desk can read");
const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage();
await page.goto(BASE + "/index.html", {waitUntil: "networkidle"});
await page.waitForTimeout(400);

/* built exactly as the reader builds it, from real keys out of the book */
const res = await page.evaluate(() => {
  const gw = MODEL_PRICES.filter((r) => /gunwatcher\.com/.test(String(r[7] || ""))).slice(0, 3);
  const csv = ["Key,Item,Your low,Your high"]
    .concat(gw.map((r) => [r[0], r[2], r[3] + 25, r[4] + 25].join(","))).join("\n") + "\n";
  const out = sheetRead(csv);
  return {gwCount: gw.length, err: out.err || "", changes: (out.changes || []).length,
          skipped: out.skipped || [], models: Object.keys(out.models || {}),
          sample: (out.changes || [])[0] || null};
});
ok(!res.err, `  the importer accepts the headings — ${res.err || "Key, Item, Your low, Your high"}`);
ok(res.skipped.length === 0, `  no row is skipped as unknown — ${res.skipped.join(", ") || "none"}`);
ok(res.changes === res.gwCount, `  all ${res.gwCount} rows land as changes — got ${res.changes}`);
ok(res.models.length === res.gwCount, `  and all ${res.gwCount} land on the MODELS list, not an appliance — got ${res.models.length}`);
ok(!!(res.sample && res.sample.range), `  shown as a range, from and to — ${res.sample ? res.sample.from + " -> " + res.sample.to : "nothing"}`);

/* and nothing is applied by reading it */
const untouched = await page.evaluate(() => {
  const before = JSON.stringify(MODEL_PRICES.slice(0, 5));
  const gw = MODEL_PRICES.filter((r) => /gunwatcher\.com/.test(String(r[7] || ""))).slice(0, 3);
  sheetRead(["Key,Item,Your low,Your high"].concat(gw.map((r) => [r[0], r[2], 11, 22].join(","))).join("\n"));
  return before === JSON.stringify(MODEL_PRICES.slice(0, 5));
});
ok(untouched, "  reading the CSV changes nothing on its own — the preview still has to be approved");

await browser.close();
console.log(fails ? `\n  ${fails} FAILED\n` : "\n  all passed\n");
process.exit(fails ? 1 : 0);
