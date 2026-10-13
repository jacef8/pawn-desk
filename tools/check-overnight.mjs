#!/usr/bin/env node
/* THE OVERNIGHT GUN READER, TESTED WHERE IT CAN BE.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-overnight.mjs
 *
 * guns.com cannot be reached from here - it answers a datacentre with a
 * 403, which is the whole reason the reader runs on the shop computer. So
 * this suite does NOT test that the reader can fetch. It tests the two
 * things that decide whether a bad night is loud or quiet:
 *
 * Both real pages it reads, tools/fixtures/gunscom-used.txt and
 * tools/fixtures/guns-com-ended.txt, came off Jace's own machine on 13 Oct
 * 2026. readPage() is lifted out of the reader by regex rather than copied,
 * so the thing under test is the thing that ships.
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

/* A LISTING ON THE REAL PAGE, built the way guns.com builds it: the make,
   the model, the chambering, the barrel, then "Condition:" and the word on
   its own line, then the cart button, and only then the price, alone. Every
   fixture below is made with this so that what the suite tests is the guard
   and not a page shape I invented. */
function listing(model, price, o) {
  o = o || {};
  const head = [model.toUpperCase(), "12 GA", (o.rounds || 5) + " Rounds", '28" Barrel', "PUMP ACTION"];
  /* AN AUCTION LOT IS LAID OUT DIFFERENTLY, and this is off the real ended
     page: the condition and the word share a line, then AUCTION, Closed and
     the bid count sit between it and the price. The buy-it-now listings on
     the used page put "Condition:" alone and the word under it. Both shapes
     are here because the reader has to read both. */
  if (o.auction)
    return head.concat(["Condition:  " + (o.cond || "USED"), "AUCTION", "Closed",
                        o.bid || "WINNING BID (20)", "$" + price + ".99"]).join("\n");
  return head.concat(["Condition:", o.cond || "USED", "Add To Cart",
                      "$" + price + ".99"]).join("\n");
}
const HEAD = `Used Guns For Sale
Filter  Sort  Clear all filters
Showing 1-24 of 212 results
Free shipping on orders over $99. Certified used. 3-day inspection period.
`;
/* six real-looking asks for the same gun, quarters at 300 and 450 */
const SIX = [220, 290, 310, 400, 500, 620];
const goodPage = (model) => HEAD + SIX.map((p) => listing(model, p)).join("\n") + "\n";

console.log("\n  the reader refuses a page that is not the listings");

/* the exact failure that started this: a wall with no listings on it.
   PADDED ON PURPOSE. The first version of this fixture was 110 characters
   and the suite passed - on the length check, not on the wall check. The
   real eBay wall was 5,774 bytes. An assertion that goes green for a
   reason other than the one it names is worth less than no assertion.

   AND IT CARRIES A FULL PAGE OF GOOD LISTINGS UNDERNEATH. Without them
   the length gate or the four-listing gate catches this fixture first and
   the wall pattern is never reached - which is what happened once already:
   the wall guard was deleted and this line stayed green. A real sign-in
   redirect carries the search terms in its return URL, so a wall that
   names the gun and shows its own cached results is the realistic shape. */
const LOGIN = `Sign in to your account
New to eBay? Create account
Email or username
Continue
Password
Sign in
Stay signed in
` + goodPage("Remington 870 Express");
let r = readPage(LOGIN, "Remington 870 Express");
ok(!!r.skip, `  a sign-in page is refused — ${r.skip || "ACCEPTED, and that is the bug"}`);

const CF = `Attention Required! | Cloudflare
Please enable cookies.
Checking your browser before accessing guns.com.
Ray ID: 8f2c1a
` + goodPage("Remington 870 Express");
r = readPage(CF, "Remington 870 Express");
ok(!!r.skip, `  a Cloudflare interstitial is refused even with listings under it — ${r.skip || "ACCEPTED"}`);

r = readPage("Loading...".repeat(60), "Remington 870 Express");
ok(!!r.skip, `  a page still loading is refused — ${r.skip || "ACCEPTED"}`);

r = readPage("", "Remington 870 Express");
ok(!!r.skip, `  an empty page is refused — ${r.skip || "ACCEPTED"}`);

/* THE ONE THAT CATCHES A SILENT WRONG ANSWER. The page loads, it is a real
   listings page, every price on it is real, and it is a different gun.
   Nothing about it looks broken. */
r = readPage(goodPage("Mossberg 500"), "Remington 870 Express");
ok(!!r.skip && /\b0 used listing/.test(r.skip),
   `  a real listings page for the WRONG gun is refused — ${r.skip || "ACCEPTED, and the book gets a Mossberg price"}`);

/* NEW STOCK IS A CEILING, NOT A COMP. The same keyword search returns new
   guns beside the used ones, and the whole reason for this URL is that the
   book wants used asks. Six new ones at the same prices must read as none. */
console.log("\n  new stock is not a used comp");
{
  const newOnly = HEAD + SIX.map((p) => listing("Remington 870 Express", p, {cond: "NEW"})).join("\n") + "\n";
  const rn = readPage(newOnly, "Remington 870 Express");
  ok(!!rn.skip && /\b0 used listing/.test(rn.skip),
     `  a page of new guns is refused — ${rn.skip || "ACCEPTED, and a new price became a used one"}`);
  /* and the mixed page keeps only the used half */
  const mixed = HEAD
    + SIX.map((p) => listing("Remington 870 Express", p)).join("\n") + "\n"
    + [900, 950, 1000, 1100].map((p) => listing("Remington 870 Express", p, {cond: "NEW"})).join("\n") + "\n";
  const rm = readPage(mixed, "Remington 870 Express");
  ok(!rm.skip && rm.n === 6, `  and a mixed page counts the 6 used, not all 10 — got ${rm.n || rm.skip}`);
}

/* STARTING BID (NO BIDS) IS NOT A SALE, and it is not even a dealer's ask.
   Two on the real ended page: a Ruger LCP II at $300 and a Marlin Model 60
   at $200, both closed, both unsold.

   SHAPED LIKE THE REAL PAGE, which is the only way this tests anything: the
   words that say what kind of price it is sit ABOVE the number. The first
   version put the label on the same line as the price and went green
   because the four-listing gate caught it - the no-bids filter was never
   reached. */
console.log("\n  an unsold lot is not a price");
{
  const unsold = HEAD + SIX.map((p) => listing("Remington 870 Express", p,
    {auction: true, bid: "STARTING BID (NO BIDS)"})).join("\n") + "\n";
  /* and the proof that this fixture is readable when somebody DID bid, so
     the only thing refusing it above is the no-bids rule */
  const sold = HEAD + SIX.map((p) => listing("Remington 870 Express", p,
    {auction: true, bid: "WINNING BID (14)"})).join("\n") + "\n";
  const rs = readPage(sold, "Remington 870 Express");
  ok(!rs.skip && rs.n === 6, `  the same six lots WITH bids read fine — ${rs.skip || rs.n}`);
  const ru = readPage(unsold, "Remington 870 Express");
  ok(!!ru.skip, `  a closed lot nobody bid on is refused — ${ru.skip || "ACCEPTED, and an unsold ask became a comp"}`);
}

/* MORE THAN ONE MODEL UNDER ONE NAME. Trimming the tails handles collector
   pieces and parts guns; it does not handle a keyword that pulled in two
   different guns. If the middle half still spans more than 4x, the search
   was wrong, not the stock. */
console.log("\n  a range too wide to be one gun");
{
  const wide = HEAD + [90, 95, 120, 2400, 6000, 7000].map((p) =>
    listing("Remington 870 Express", p)).join("\n") + "\n";
  const rw = readPage(wide, "Remington 870 Express");
  ok(!!rw.skip && /more than one model/.test(rw.skip),
     `  the middle half spanning 20x is refused — ${rw.skip || "ACCEPTED"}`);
}

/* ── THE REAL PAGES ───────────────────────────────────────────────────── */
console.log("\n  the real Guns.com pages, off the shop computer");

/* tools/fixtures/guns-com-ended.txt is the actual recently-ended page as it
   came off the shop computer on 13 Oct 2026. It is here because it beat the
   FIRST guard: headed "REMINGTON 870 EXPRESS 15450 RESULTS", carrying a
   filter chip that says the same, and listing a Glock, a Springfield, a
   gold Colt Python and a Marlin .22. The keyword does nothing on that URL.
   A fixture written by hand would never have had that shape, because I did
   not know a site did that until one did. */
{
  const real = fs.readFileSync("tools/fixtures/guns-com-ended.txt", "utf8");
  const r2 = readPage(real, "Remington 870 Express");
  ok(!!r2.skip, `  the ended page is refused — ${r2.skip || "ACCEPTED, and the book gets a Glock price"}`);
  /* THIS ASSERTION MOVED, AND THE OLD ONE WAS RIGHT WHEN IT WAS WRITTEN.
     It used to demand the words "beside any price" in the reason, because
     the guard was a whole-page word check and that was the sentence it
     wrote. The reader now counts listings that have the model beside the
     price, so the same page comes back as "only 1 used listing(s)" - the
     same refusal, counted instead of described. The test was stale and the
     intent moved with it. What has to stay true is that the count is far
     short of four, not that a particular sentence comes back. */
  const n = Number((r2.skip.match(/only (\d+) used listing/) || [])[1]);
  ok(n === 0,
     `  and refused for the RIGHT reason — ${n} of the lots on it are this gun, not 1 and not 24`);
  /* and the words really are on it, so the old whole-page check really was useless */
  const low = real.toLowerCase();
  ok(["remington", "870", "express"].every((w) => low.includes(w)),
     "  the gun IS named on the page, which is exactly why the old check passed it");
}

/* tools/fixtures/gunscom-used.txt is the used-guns page for the keyword
   Mossberg 500, same machine, same day. This is the one the reader is
   pointed at, so this is the assertion that proves it works on the real
   thing rather than on my idea of it. */
{
  const used = fs.readFileSync("tools/fixtures/gunscom-used.txt", "utf8");
  const ru = readPage(used, "Mossberg 500");
  ok(!ru.skip && ru.lo > 0 && ru.hi > ru.lo,
     `  the used page reads $${ru.lo}-$${ru.hi} off ${ru.n} listings — ${ru.skip || "ok"}`);
  /* the numbers, not just the shape - these come off the real page and a
     change in the reader that moves them should be noticed and explained */
  ok(ru.lo === 287 && ru.hi === 417 && ru.n === 8,
     `  the figures are the ones measured: $287-$417 from 8 — got $${ru.lo}-$${ru.hi} from ${ru.n}`);
  ok(Array.isArray(ru.from) && ru.from.length > 0 && /\$/.test(ru.from[0]) && /used/i.test(ru.from[0]),
     `  and records the listing it took it from — "${(ru.from || [""])[0].slice(-54)}"`);
  /* THE SAME PAGE, A GUN THAT IS NOT ON IT. Proves the 8 above were matched
     on the listings and not on the page being a price page. */
  const rx = readPage(used, "Remington 870 Express");
  ok(!!rx.skip, `  and the same page gives nothing for a gun not on it — ${rx.skip || "ACCEPTED"}`);
}

/* A PRICE THAT IS NOT A LISTING. The real pages carry a trade-in strip and
   a shipping threshold, and both put a bare figure on its own line with the
   gun named right above it. Neither has a condition field, which is the one
   thing that tells a listing from an advert. */
console.log("\n  an advert is not a listing");
{
  const promo = HEAD + SIX.map((p) => listing("Remington 870 Express", p)).join("\n")
    + `
REMINGTON 870 EXPRESS
Trade yours in today
Instant offer up to
$1,250.00
Free shipping over
$99.00
`;
  const rp = readPage(promo, "Remington 870 Express");
  ok(!rp.skip && rp.n === 6 && rp.hi < 700,
     `  the trade-in offer and the shipping threshold are not counted — got ${rp.n || rp.skip} at $${rp.lo}-$${rp.hi}`);
}

/* ── THE WHOLE REAL PAGE, 648 LINES OF IT ────────────────────────────
   tools/fixtures/gunscom-used-870.txt is the used-guns page for Remington
   870 Express exactly as it came off the shop computer on 13 Oct 2026,
   start to finish: the age gate, the nav, the filter rail, 24 listings,
   the suppressor advert, four news articles, twenty customer reviews and
   the footer. Nothing trimmed. The two fixtures above are cut down and a
   cut-down page is a page I chose the shape of. */
console.log("\n  the whole page, untrimmed, as it came off his machine");
{
  const real = fs.readFileSync("tools/fixtures/gunscom-used-870.txt", "utf8");
  const rr = readPage(real, "Remington 870 Express");
  ok(!rr.skip && rr.lo === 355 && rr.hi === 430,
     `  reads $355-$430 — ${rr.skip || "$" + rr.lo + "-$" + rr.hi}`);

  /* THE COUNT IS THE ASSERTION THAT DOES THE WORK. There are 25 prices on
     that page. 23 are counted. The two that are not are the live auction
     at the top, which shows STARTING BID $350.00 and BUY NOW $389.99 -
     a starting bid is what the seller hopes for and nothing has been bid.
     Delete the no-bids rule and this goes to 24 and the bottom of the
     range drops to $350, which is how the real page tests that rule
     rather than a fixture I shaped myself. (24 and not 25: the BUY NOW
     price underneath has no gun named between it and the starting bid
     above it, so the model rule drops that one on its own.) */
  const prices = (real.match(/^\$[0-9]/gm) || []).length;
  ok(prices === 25, `  the page carries 25 prices — ${prices}`);
  ok(rr.n === 23, `  and 23 are counted, the live auction's two left out — ${rr.n}`);

  /* the page ends with "Are you at least 18 years old? YES NO", which is a
     gate and not a bot wall, and the listings are on the page behind it */
  ok(/at least 18 years old/i.test(real), "  the age gate IS in the text");
  ok(!rr.skip, "  and it is not mistaken for a sign-in wall");

  /* 76 results, 24 shown. The book is priced off the first page and that is
     deliberate: "LOAD MORE..." is the 25th line and nothing behind it is in
     the text. Worth saying out loud, because 76 looks like the sample size
     and it is not. */
  ok(/76 RESULTS/i.test(real) && rr.n < 30,
     `  76 results on the site, ${rr.n} actually read — the first page only`);

  const rx = readPage(real, "Mossberg 500");
  ok(!!rx.skip, `  and nothing at all for a gun that is not on it — ${rx.skip || "ACCEPTED"}`);
}

console.log("\n  and it does read a good page");
r = readPage(goodPage("Remington 870 Express"), "Remington 870 Express");
ok(!r.skip && r.n === 6, `  six used asks read as six — ${r.skip || r.n}`);
/* THE EXPECTED FIGURES HERE WERE WRONG FIRST TIME AND THE CODE WAS RIGHT.
   I wrote $300-$450 off the round numbers and forgot the listings carry
   cents, the way the real page does - every price is $220.99, not $220. The
   quarters land a dollar high because of it. Worth leaving the note: the
   first instinct was that the percentile was off by one. */
ok(r.lo === 296 && r.hi === 476,
   `  quarter to three-quarters of ${SIX.join(", ")} (.99 each) is $296-$476 — got $${r.lo}-$${r.hi}`);
ok(r.med === 356, `  and the middle is $356 — got $${r.med}`);

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
