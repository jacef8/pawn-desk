#!/usr/bin/env node
/* The counter's price lookup must ask eBay before it pays for a search,
 * and it must never call an asking price a sale.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-lookup.mjs
 *
 * What is actually being guarded. The first pass used to be called
 * "eBay sold" and it was a WEB SEARCH asking for completed listings - which
 * it could never return, because eBay's sold pages need a login and the site
 * refuses an automated reader anyway. So it came back with active listings,
 * and the counter saw asking prices labelled as sales. The three cases below
 * are the ones that matter:
 *
 *   sold    - eBay answers with sales. They are used, and the two paid
 *             searches are never fired. That saving is the whole point.
 *   asks    - eBay answers, but with active listings, because the keyset
 *             has no Marketplace Insights grant. Must be labelled "asks".
 *   no key  - eBay refuses. The lookup must fall through to the searches
 *             and still produce a price, exactly as it did before.
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
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const SVC  = "https://service.invalid";

let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const soldComps  = n => Array.from({length:n}, (_,i) => ({price:100+i*6, what:"Angle grinder", where:"eBay", basis:"sold"}));
const askComps   = n => Array.from({length:n}, (_,i) => ({price:150+i*9, what:"Angle grinder", where:"eBay", basis:"asking"}));
const searchBody = n => ({ok:true, data:{comps:Array.from({length:n},(_,i)=>({price:90+i*5, what:"grinder", where:"Shopping", basis:"asking"}))}});

const browser = await chromium.launch({executablePath: EXE});

async function run(mode) {
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  const hits = [];
  const errs = [];
  page.on("pageerror", e => errs.push(String(e)));

  await page.route("**/*", async route => {
    const u = route.request().url();
    if (!u.startsWith(SVC)) return route.continue();
    const path = new URL(u).pathname;
    hits.push(path);
    const json = (code, body) => route.fulfill({status:code, contentType:"application/json",
      headers:{"access-control-allow-origin":"*","access-control-allow-headers":"content-type,x-pawn-token"},
      body:JSON.stringify(body)});

    if (path === "/limits") return json(200, {ok:true, images:{mediaTypes:["image/jpeg"],maxCount:4,maxBytes:5242880}});
    if (path === "/sync")   return json(200, {ok:true, mode:"memory", rows:[]});
    if (path === "/ebay") {
      if (mode === "sold")   return json(200, {ok:true, basis:"sold",   source:"marketplace_insights", comps:soldComps(10)});
      if (mode === "asks")   return json(200, {ok:true, basis:"asking", source:"browse", comps:askComps(10),
                                               warning:"sold data unavailable: this keyset is not granted Marketplace Insights"});
      return json(501, {ok:false, code:"no_ebay_key"});
    }
    if (path === "/json")   return json(200, searchBody(6));
    return json(404, {ok:false});
  });

  await page.addInitScript(([srv, tok]) => {
    localStorage.setItem("pawndesk_server", srv);
    localStorage.setItem("pawndesk_token", tok);
  }, [SVC, "t"]);

  await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});

  const out = await page.evaluate(async () => {
    /* an angle grinder: the row the whole corded/cordless finding came from */
    const cat = CATALOG.find(c => c.items.some(i => i.id === "t3"));
    st.mode = "item"; st.catId = cat.id; st.itemId = "t3"; st.picked = true;
    st.cond = "good"; render();
    try { localStorage.removeItem("pawndesk_comps"); } catch (e) {}
    await priceFind(null, false);
    const x = calcItem();
    const t = compStats(compsMatch(x));
    return {msg: findMsg, n: t && t.n, sold: t && t.sold, mostlyAsks: t && t.mostlyAsks};
  });

  await page.close();
  return {out, hits, errs};
}

console.log("\n  eBay answers with sales");
{
  const {out, hits, errs} = await run("sold");
  ok(/eBay sold 10/.test(out.msg), 'tally says "eBay sold 10" — got: ' + out.msg);
  ok(hits.includes("/ebay"), "eBay was asked");
  ok(!hits.includes("/json"), "NO paid search was fired (" + hits.filter(h=>h==="/json").length + " seen)");
  ok(out.sold === 10, "all 10 comps stored as sold, got " + out.sold);
  ok(out.mostlyAsks === false, "the card does not flag it as mostly asks");
  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
}

console.log("\n  eBay answers, but with asking prices (no Insights grant)");
{
  const {out, hits, errs} = await run("asks");
  ok(/eBay asks 10/.test(out.msg), 'tally says "eBay asks 10" — got: ' + out.msg);
  ok(out.sold === 0, "NOTHING was stored as sold, got " + out.sold);
  ok(out.mostlyAsks === true, "the card flags it as mostly asks");
  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
}

console.log("\n  eBay refuses (no keyset on the service)");
{
  const {out, hits, errs} = await run("nokey");
  ok(hits.includes("/ebay"), "eBay was still tried");
  ok(hits.includes("/json"), "it fell through to the paid searches");
  ok(out.n >= 3, "a price was still produced from " + out.n + " listings");
  ok(/eBay failed/.test(out.msg), 'the tally says eBay failed — got: ' + out.msg);
  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
}

await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
