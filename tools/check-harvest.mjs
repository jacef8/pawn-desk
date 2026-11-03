#!/usr/bin/env node
/* WHERE THE HARVEST GETS ITS NUMBERS, AND WHETHER THEY ARE SALES.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-harvest.mjs
 *
 * Asked at the counter on 3 Nov: "when is the last time we pulled sold
 * comps". The answer was 23 and 24 September, 309 rows over two days, and
 * nothing since. Everything after that - the 610-item harvest on the 22nd,
 * the 67 gun rows on 13 Oct - is an ASKING price.
 *
 * Reading the harvest to find out why turned up the reason. It never asked
 * the service for a price at all. It asked Claude, with web search, twice a
 * target, and the first of those two passes asks in so many words for
 * "completed, sold eBay listings - the price it actually went for". A
 * search engine cannot see eBay's completed listings. So every row it
 * produced was an ask with the word sold next to it, and the day a model
 * was handed an eBay login wall instead of listings it filled the gap in
 * with a Ruger LCP at $350 and an LCP II at $450, neither of which existed.
 *
 * Meanwhile /ebay answers with SoldComps, which is bought and paid for,
 * returns real sold prices, and costs no Anthropic money. /limits on the
 * live service says soldSource "soldcomps", sold true. It had been sitting
 * there unused since September while the harvest spent model money to get
 * worse answers.
 *
 * So this suite holds three things:
 *
 *   1. the harvest asks /ebay FIRST, and when real sold prices come back
 *      it does not pay for a search at all
 *   2. asking prices from /ebay are not good enough to stop it - an ask is
 *      what it already had too much of
 *   3. it never asks eBay about a gun or a four-wheeler
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport:{width:1500, height:1000}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(900);

/* ONE RUN OF THE HARVEST, WITH EVERYTHING OUTSIDE IT STOOD IN FOR.
 *
 * The service is a stub on window.fetch, the model is a stub on CAP.sample,
 * and the target list is one row. What comes back is the count of calls each
 * stub took and the row the harvest filed, which between them say where the
 * number came from. Nothing here reaches eBay, SoldComps or Anthropic. */
async function run(opts) {
  return await page.evaluate(async (o) => {
    const realFetch = window.fetch;
    const realSeed  = window.harvLoadSeed;
    const realSample = CAP.sample;
    const seen = {ebay: 0, search: 0, queries: []};
    window.fetch = (...a) => {
      const url = String(a[0] || "");
      if (!url.includes("/ebay")) return realFetch(...a);
      seen.ebay++;
      seen.queries.push(String((a[1] && a[1].body) || ""));
      if (o.ebay === "down") return Promise.reject(new Error("no service"));
      const n = o.ebay === "thin" ? 2 : 8;
      const comps = Array.from({length: n}, (_, i) => ({price: 100 + i * 10, fit: "bare"}));
      return Promise.resolve({ok: true, json: async () => ({
        ok: true, basis: o.ebay === "asking" ? "asking" : "sold",
        source: "soldcomps", comps, found: n, dropped: {part: 0, lot: 0, wrong: 0}})});
    };
    CAP.sample = {json: async () => {
      seen.search++;
      return {comps: Array.from({length: 6}, (_, i) => ({price: 500 + i * 10, where: "a search", basis: "sold"}))};
    }};
    window.harvLoadSeed = async () => [{ref: o.ref, name: o.name, alias: ""}];
    HARV = {}; harvSave();
    try { localStorage.setItem("pawndesk_server", "https://stub.invalid");
          localStorage.setItem("pawndesk_token", "stub"); } catch (e) {}
    await harvRun("", 1);
    const rows = Object.values(harvAll());
    window.fetch = realFetch; window.harvLoadSeed = realSeed; CAP.sample = realSample;
    HARV = {}; harvSave();
    return {seen, row: rows[0] || null};
  }, opts);
}

console.log("\n  sold prices come from the service, and stop it paying for a search");
{
  const r = await run({ref: "p1", name: "Stihl MS 170", ebay: "sold"});
  ok(r.seen.ebay === 1, `  it asked /ebay once — ${r.seen.ebay}`);
  /* THE ASSERTION THAT PAYS FOR ITSELF. Before this change the search ran
     twice a target whatever the service had. 1,032 targets at two model
     calls each, against a $10 day cap, is the whole reason the full list
     has never been run. */
  ok(r.seen.search === 0, `  and paid for NO search — ${r.seen.search} model calls`);
  ok(!!r.row && r.row.n === 8, `  the row is priced off the 8 sold prices — ${r.row && r.row.n}`);
  /* 100..170 by tens: the quarter and three-quarter marks are 120 and 150. */
  ok(!!r.row && r.row.lo === 120 && r.row.hi === 150,
     `  banded $120-$150 off them — $${r.row && r.row.lo}-$${r.row && r.row.hi}`);
  ok(!!r.row && /sold prices from/.test(String(r.row.note)),
     `  and the row says where they came from — "${r.row && r.row.note}"`);
  ok(!!r.row && r.row.from === "SoldComps",
     `  named as SoldComps, not just "eBay" — "${r.row && r.row.from}"`);
}

console.log("\n  an asking price is not a sale and does not stop the search");
{
  /* THE ONE THAT MATTERS MOST. /ebay falls back to Browse - asking prices -
     whenever the sold quota is spent, and it says so in `basis`. Taking
     those would quietly refill the book with exactly what it already has
     too much of, and they would arrive looking like a fresh pass. */
  const r = await run({ref: "p1", name: "Stihl MS 170", ebay: "asking"});
  ok(r.seen.ebay === 1, `  it still asked — ${r.seen.ebay}`);
  ok(r.seen.search > 0, `  got asks, and went on to search anyway — ${r.seen.search} model calls`);
  ok(!!r.row && r.row.med >= 500,
     `  the row is the searched figure, not the ask — $${r.row && r.row.med}`);
  ok(!!r.row && !r.row.from, `  and is not labelled as a sold-price source — "${r.row && r.row.from}"`);
}

console.log("\n  too few sold prices is too few");
{
  const r = await run({ref: "p1", name: "Stihl MS 170", ebay: "thin"});
  ok(r.seen.search > 0, `  two sold prices do not stop the search — ${r.seen.search} model calls`);
}

console.log("\n  a service that is not there does not stop the run");
{
  const r = await run({ref: "p1", name: "Stihl MS 170", ebay: "down"});
  ok(r.seen.search > 0, `  it fell through to the search — ${r.seen.search} model calls`);
  ok(!!r.row, `  and still filed a row — ${r.row ? r.row.n + " listings" : "nothing"}`);
}

console.log("\n  it does not ask eBay about a gun");
{
  /* NEVER GO TO EBAY FOR A GUN PRICE. eBay does not sell firearms; a search
     for one returns holsters, magazines and springs, and the median of that
     is about $29 against a pistol worth $179. EBAY_CANNOT.guns has said so
     since September and this loop had never read it. */
  const r = await run({ref: "g7", name: "Glock 19", ebay: "sold"});
  ok(r.seen.ebay === 0, `  no /ebay call for a semi-auto pistol — ${r.seen.ebay}`);
  const q = await run({ref: "r2", name: "Honda Rancher", ebay: "sold"});
  ok(q.seen.ebay === 0, `  nor for a four wheeler, which nobody ships — ${q.seen.ebay}`);
  /* AND THE ROWS THAT CARRY A NAME WHERE THE ITEM ID SHOULD BE. 141 of the
     519 in the book do. Two are "SKS rifle" and "AK-pattern rifle" and
     eight are "UTV / side-by-side" or "Golf cart" - all of them things
     eBay does not sell, all of them straight past a guard that knew only
     g1 to g10 and r1, r2. Caught on the first dry run of tools/
     sold-pass.mjs, before any lookup was spent, by reading the targets it
     listed rather than the count. */
  for (const [ref, name] of [["SKS rifle", "SKS"], ["AK-pattern rifle", "AK-pattern rifle"],
                             ["UTV / side-by-side", "Polaris Ranger"], ["Golf cart", "EZGO TXT"]]) {
    const b = await run({ref, name, ebay: "sold"});
    ok(b.seen.ebay === 0, `  no /ebay call for "${ref}" — ${b.seen.ebay}`);
  }
  /* AND THE GUARD IS NARROW, three ways. A real item id is never
     second-guessed by a word, or "Rifle scope" stops being priceable; and
     an ordinary named row still goes. If this caught everything, every
     assertion above would be passing for the wrong reason. */
  const p = await run({ref: "p1", name: "Stihl MS 170", ebay: "sold"});
  ok(p.seen.ebay === 1, `  while a chainsaw still goes to eBay — ${p.seen.ebay}`);
  const sc = await run({ref: "h1", name: "Leupold VX-Freedom rifle scope", ebay: "sold"});
  ok(sc.seen.ebay === 1, `  and a RIFLE SCOPE is not a rifle — ${sc.seen.ebay}`);
  const hp = await run({ref: "Headphones — over-ear", name: "Sony WH-1000XM4", ebay: "sold"});
  ok(hp.seen.ebay === 1, `  and a named row that is not a gun still goes — ${hp.seen.ebay}`);
}

console.log("\n  the query it sends is the model, not the whole row");
{
  const r = await run({ref: "p1", name: "DeWalt DCCS670", ebay: "sold"});
  const body = String(r.seen.queries[0] || "");
  ok(/DeWalt DCCS670/.test(body), `  sent "DeWalt DCCS670" — ${body.slice(0, 70)}`);
}

ok(errs.length === 0, `  no page errors — ${errs.slice(0, 2).join(" | ") || "none"}`);
await browser.close();
console.log(fails ? `\n  ${fails} FAILED\n` : "\n  all passed\n");
process.exit(fails ? 1 : 0);
