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
  /* The tally used to read "eBay sold 10". It reports in English now, so
     the assertion follows the FACTS rather than the old phrasing: ten of
     them, called sold, off eBay. */
  ok(/\b10 sold prices?\b/i.test(out.msg) && /eBay/.test(out.msg),
     'says 10 sold prices on eBay — got: ' + out.msg);
  ok(hits.includes("/ebay"), "eBay was asked");
  ok(!hits.includes("/json"), "NO paid search was fired (" + hits.filter(h=>h==="/json").length + " seen)");
  ok(out.sold === 10, "all 10 comps stored as sold, got " + out.sold);
  ok(out.mostlyAsks === false, "the card does not flag it as mostly asks");
  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
}

console.log("\n  eBay answers, but with asking prices (no Insights grant)");
{
  const {out, hits, errs} = await run("asks");
  ok(/\b10 asking prices?\b/i.test(out.msg) && /eBay/.test(out.msg),
     'says 10 asking prices on eBay — got: ' + out.msg);
  ok(/nobody paid/i.test(out.msg),
     'and spells out that nobody paid them — got: ' + out.msg);
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
  ok(/eBay did not answer/i.test(out.msg), 'it says eBay did not answer — got: ' + out.msg);
  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
}

/* Firearms are their own world. eBay bans gun sales outright, so an eBay
   pass on "Remington 870" comes back with barrels, stocks, optics and
   airsoft priced like the gun - wrong by a factor of five, and wrong in the
   direction that costs money. The API pass must never reach that branch,
   however convenient it is everywhere else. */
console.log("\n  the firearms branch");
{
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  const errs = [];
  page.on("pageerror", e => errs.push(String(e)));
  await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const passes = await page.evaluate(() => {
    const cat = CATALOG.find(c => c.id === "guns") || CATALOG.find(c => c.items.some(i => i.id === "g1"));
    st.mode = "item"; st.catId = cat.id; st.itemId = "g1"; st.picked = true; render();
    return findPasses(calcItem()).map(p => ({name:p.name, where:p.where, ebay:!!p.ebay, say:p.say || ""}));
  });
  ok(!passes.some(p => p.ebay), "NO eBay API pass on guns — eBay bans gun sales");
  ok(passes.some(p => /guns\.com/i.test(p.name + p.say)), "guns.com ended auctions is one of the passes");
  ok(passes.some(p => /gunwatcher/i.test(p.name + p.say)), "GunWatcher is still there");
  const gc = passes.find(p => /guns\.com/i.test(p.name + p.say));
  ok(gc && /winning bid/i.test(gc.say), "the guns.com pass asks for the winning bid, not the ask");
  ok(gc && /collector|engraved|commemorative/i.test(gc.say), "and it is warned off collector pieces");
  const names = passes.map(p => p.name);
  ok(names.indexOf("Guns.com ended") < names.findIndex(n => /asking/i.test(n)),
     "sold sources come before the asking one — order: " + names.join(" > "));
  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
  await page.close();
}


/* WORTHPOINT IS A LINK OUT, AND IT IS NOT ON EVERY ITEM.
   It exists for things whose identity is a hallmark or a maker's mark
   rather than a model number - the aisle where eBay's 90 days and its
   model-number index both come up empty, and where the 24 Sep run found
   nothing usable across five jewellery makers. A drill has a model number
   and eBay prices it fine, so putting the button there is noise on a card
   that is already eight buttons wide.
   The half of this that matters is the ABSENCE. A button that shows up
   everywhere teaches the counter to ignore it. */
console.log("\n  the WorthPoint link-out, where it belongs and where it does not");
{
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  const errs = [];
  page.on("pageerror", e => errs.push(String(e)));
  await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});

  const at = async (catId) => page.evaluate((cid) => {
    const cat = CATALOG.find(c => c.id === cid);
    st.mode = "item"; st.catId = cat.id; st.itemId = cat.items[0].id;
    st.picked = true; render();
    return compTargets(calcItem()).map(t => ({id:t.id, name:t.name, url:t.url, sub:t.sub}));
  }, catId);

  const jewel = await at("jewel");
  const wp = jewel.find(t => t.id === "wp");
  ok(!!wp, "jewelry offers a WorthPoint button");
  ok(wp && /worthpoint\.com/.test(wp.url), "  and it points at worthpoint.com");
  ok(wp && wp.url.length > "https://www.worthpoint.com/worthopedia/search?query=".length,
     "  with the search words on the end, not a bare landing page");
  ok(wp && /sign-in/i.test(wp.sub),
     "  and it warns the sign-in is paid before the counter clicks it");

  for (const cid of ["coll", "music"])
    ok((await at(cid)).some(t => t.id === "wp"), `  ${cid} offers it too`);

  /* The absence, which is the whole point. */
  for (const cid of ["tools", "power", "elec", "appl", "fit"])
    ok(!(await at(cid)).some(t => t.id === "wp"),
       `  ${cid} does NOT — it has model numbers and eBay prices it`);

  /* And the other buttons must survive the change. */
  ok(jewel.some(t => t.id === "wc") && jewel.some(t => t.id === "ebay"),
     "  WatchCount and Seller Hub are still on the card");

  /* "i get this error every single time." Every Seller Hub click came back
     "Our server failed to respond to your query". Two fixes were shipped at
     it and neither worked; what the second one taught is that Terapeak
     working at 90 days IN THE PAGE is a different fact from our LINK
     working at 90 days, and Jace said so plainly: "it still has the server
     failed message even after selecting 90 days."
     The only URL with evidence behind it is the one in his address bar
     while the numbers were up, and its shape is what this asserts: an
     explicit startDate/endDate pair 90 days apart, plus the offset and
     limit that an earlier round had thrown away as decoration.
     The dates are checked by ARITHMETIC, not by presence. A link that
     merely contains "startDate" would pass on a version that wrote the
     wrong span, and a green tick that cannot go red for the actual bug has
     cost this project a session before. */
  const eb = jewel.find(t => t.id === "ebay");
  const qs = eb ? new URL(eb.url).searchParams : null;
  ok(!!qs, "the Seller Hub link parses as a URL at all");
  ok(qs && qs.get("dayRange") === "90",
     "  it asks for 90 days — " + (qs ? qs.get("dayRange") : "no button"));
  /* Number(null) is 0, and 0 is finite. The first version of the next line
     read Number.isFinite on a missing parameter and went green against the
     very URL it was written to catch. Read the raw strings. */
  const rawS = qs && qs.get("startDate"), rawE = qs && qs.get("endDate");
  ok(/^\d{10,}$/.test(rawS || "") && /^\d{10,}$/.test(rawE || ""),
     "  and carries the explicit date pair Terapeak's own UI writes — " +
     (rawS || "no startDate") + " to " + (rawE || "no endDate"));
  const sd = Number(rawS), ed = Number(rawE);
  const span = (ed - sd) / 864e5;
  ok(Math.abs(span - 90) < 0.01,
     `  spanning exactly 90 days, not merely present — ${span.toFixed(3)} days`);
  ok(/^\d{10,}$/.test(rawE || "") && Math.abs(Date.now() - ed) < 6e4,
     "  ending now, so the window moves with the counter rather than a fixed date");
  ok(qs && qs.get("offset") === "0" && qs.get("limit") === "50",
     "  with the offset and limit the working URL had — " +
     (qs ? qs.get("offset") + "/" + qs.get("limit") : "none"));
  ok(qs && qs.get("tabName") === "SOLD" && !!qs.get("keywords"),
     "  on the Sold tab, with the search words on it");

  ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
  await page.close();
}

/* THE AUTOMATIC LOOKUP ONLY EVER RAN AFTER A PHOTO.
   autoPriceAfterPhoto was the only thing that started a search on its
   own, so the camera path got live sold prices and the path everybody
   uses - type it, pick it - got the book figure and a button to press.
   It fires on a pick now, and the gate is the whole design: a make AND a
   model, because "laptop" as a query comes back as screens and
   batteries, and because one lookup per keystroke would eat a
   2,000-a-month quota in an afternoon.

   Counting the calls, not reading the conditions: the first version of
   this check read the gate's inputs and called that a pass, which proves
   the gate is reachable and nothing about whether it fires. */
console.log("\n  the lookup starts itself when the desk knows exactly what it is");
{
  const page = await browser.newPage({viewport:{width:1280, height:900}});
  await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
  const r = await page.evaluate(async () => {
    const out = {};
    window.CAP = window.CAP || {};
    CAP.sample = {json: async () => ({}), limits: async () => ({})};
    /* The trigger defers through setTimeout(...,0). The first version of
       this check installed a spy, picked, and pulled the spy back out in
       the same synchronous breath - so the call landed after the spy had
       gone and every count read 0, including the one that should fire.
       The spy stays in place for the whole run and each pick is given a
       turn of the event loop to land. */
    let fired = 0;
    window.priceFind = async () => { fired++; return null; };
    const settle = () => new Promise(res => setTimeout(res, 60));
    const run = async (q, kind) => {
      const before = fired;
      Object.assign(st, {picked:false, market:null, mpPin:null, brandTyped:"", model:"",
                         bookName:"", condSet:false, omniDone:""});
      const R = omniRows(q) || {};
      const row = (R.rows || []).find(x => x.kind === kind) ||
                  (R.rows || []).find(x => ["mp","book","item"].includes(x.kind));
      if (row) omniPick(row);
      await settle();
      return {fired: fired - before, brand: st.brandTyped, model: st.model};
    };
    out.named = await run("dewalt dcd791", "mp");
    out.bare  = await run("sony laptop", "item");
    out.tv    = await run("samsung tv", "item");
    /* the same model twice must not pay twice */
    out.again = await run("dewalt dcd791", "mp");
    return out;
  });
  ok(r.named.fired === 1,
     `a named model starts one lookup — got ${r.named.fired} (${r.named.brand} ${r.named.model})`);
  ok(r.bare.fired === 0,
     `a bare category starts none, the query would be "laptop" — got ${r.bare.fired}`);
  ok(r.tv.fired === 0,
     `a television starts none, eBay is blind to it — got ${r.tv.fired}`);
  ok(r.again.fired === 0,
     `and the same model picked twice does not pay twice — got ${r.again.fired}`);
  await page.close();
}

/* ══════════════════════════════════════════════════════════════════════
   THE BUTTON HE PRESSES, ON BOTH SURFACES.

   "lets get the lookup working so i dont have to type prices."

   Everything above calls priceFind(null, FALSE). Not one button does:
   both surfaces' Look up, the desk's pdFindGo and the two photo paths all
   pass true. So the saving the section above proves - "NO paid search was
   fired" when eBay answers with sales - was proved on a code path the
   counter cannot reach, and on the path he does reach three paid searches
   went out on top of ten counted sold prices.

   And the desk's one-question run, which is the DEFAULT layout, had no
   lookup button at all on the price question. Measured: the only controls
   were "Enter what one sold for", "Nothing to find", Back and Skip.
   Typing was the only way to answer the question he asked to stop typing.

   This section finds the button on the screen, presses it, and counts
   what it spent.
   ══════════════════════════════════════════════════════════════════════ */
async function press(page, mode) {
  /* the button, wherever the surface keeps it */
  const btn = await page.evaluate(() => {
    const b = document.getElementById("pdFindGo") || document.querySelector('[data-wact="look"]');
    return b && !b.disabled ? {id: b.id || "", wact: b.dataset.wact || "",
                               text: (b.textContent || "").trim().slice(0, 30)} : null;
  });
  if (!btn) return {btn: null};
  await page.evaluate(() => {
    const b = document.getElementById("pdFindGo") || document.querySelector('[data-wact="look"]');
    if (b) b.click();
  });
  await page.waitForTimeout(2500);
  return Object.assign({btn}, await page.evaluate(() => {
    const x = calcItem(), t = compStats(compsMatch(x));
    return {checked: !!x.checked, resale: Math.round(x.resale || 0),
            n: t && t.n, sold: t && t.sold, msg: findMsg};
  }));
}

for (const [tag, file, w, h] of [["the phone", "phone.html", 390, 844],
                                 ["the desk", "index.html", 1500, 1000]]) {
  console.log(`\n  ${tag}: one press on the real button`);
  for (const mode of ["sold", "asks"]) {
    const page = await browser.newPage({viewport: {width: w, height: h}});
    const hits = [], errs = [];
    page.on("pageerror", e => errs.push(String(e)));
    await page.route("**/*", async route => {
      const u = route.request().url();
      if (!u.startsWith(SVC)) return route.continue();
      const path = new URL(u).pathname;
      hits.push(path);
      const json = (code, body) => route.fulfill({status:code, contentType:"application/json",
        headers:{"access-control-allow-origin":"*","access-control-allow-headers":"content-type,x-pawn-token"},
        body:JSON.stringify(body)});
      if (path === "/limits") return json(200, {ok:true, ebay:true,
        images:{mediaTypes:["image/jpeg"],maxCount:4,maxBytes:5242880},
        photo:{key:true, model:"m", usdPerMTok:{in:1,out:1}, dayCap:10, spentToday:0}});
      if (path === "/sync") return json(200, {ok:true, mode:"memory", rows:[]});
      if (path === "/ebay") return mode === "sold"
        ? json(200, {ok:true, basis:"sold", source:"marketplace_insights", comps:soldComps(10)})
        : json(200, {ok:true, basis:"asking", source:"browse", comps:askComps(10),
                     warning:"sold data unavailable: this keyset is not granted Marketplace Insights"});
      if (path === "/json") return json(200, searchBody(6));
      return json(404, {ok:false});
    });
    await page.addInitScript(([srv, tok]) => {
      localStorage.setItem("pawndesk_server", srv);
      localStorage.setItem("pawndesk_token", tok);
      try { localStorage.removeItem("pawndesk_comps"); } catch (e) {}
    }, [SVC, "t"]);
    await page.goto(BASE + "/" + file, {waitUntil:"networkidle"});
    await page.waitForTimeout(800);
    /* Typed, tapped, and standing on the price question - his route in. */
    await page.fill("#omniIn", "Weber kettle grill");
    await page.waitForTimeout(400);
    const row = page.locator('#omniList [data-omni="0"]');
    if (await row.count()) await row.click();
    await page.waitForTimeout(450);
    await page.evaluate(() => {
      const Q = askQueue(calcItem());
      const i = Q.findIndex(z => z.id === "worth");
      if (i >= 0) st.askAt = i;
      render();
    });
    await page.waitForTimeout(350);

    const r = await press(page, mode);
    const paid = hits.filter(h => h === "/json").length;
    ok(!!r.btn, `  ${mode}: there is a lookup button on the price question${r.btn ? ` — "${r.btn.text}"` : " — NONE, typing is the only way"}`);
    if (r.btn) {
      ok(r.checked && r.resale > 0,
         `    one press and it is priced at $${r.resale}, nothing typed`);
      if (mode === "sold") {
        /* THE MONEY ASSERTION. eBay is free; the searches are not. */
        ok(paid === 0,
           `    and it spent NOTHING on searches — ${paid} paid call(s) against 10 counted sales`);
        ok(r.sold === 10, `    all ten kept as sold, got ${r.sold}`);
      } else {
        ok(paid > 0,
           `    asks only, so it did pay to corroborate — ${paid} search(es)`);
        ok(r.sold === 0, `    and none of them is called a sale, got ${r.sold}`);
      }
    } else { fails += 2; }
    ok(!errs.length, `    no page errors${errs.length ? ": " + errs[0] : ""}`);
    await page.close();
  }
}

await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
