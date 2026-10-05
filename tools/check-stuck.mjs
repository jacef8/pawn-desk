#!/usr/bin/env node
/* THE RUN THAT WOULD NOT END, AND THE BUTTON THAT WOULD NOT PRESS.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-stuck.mjs
 *
 * "It keeps cycling back to the same question and will not look up any
 * prices on this common item." Sent with two screenshots of a TCL a
 * minute apart, both showing "What does one sell for used?" at 7 of 8
 * answered, and no lookup button anywhere on the card.
 *
 * Two faults, and they compound: the one question he could not answer
 * was the one the lookup existed to answer, and the lookup was switched
 * off for that item.
 *
 * 1  EBAY BEING BLIND IS NOT THE LOOKUP BEING BLIND. EBAY_CANNOT and
 *    EBAY_CANNOT_ITEM are about eBay and are right about eBay: a
 *    television does not ship, a gun is not sold there. But canLook and
 *    priceFind read those lines as "there is no way to price this", and
 *    findPasses has always had other passes - four of them for a firearm,
 *    none of which is the eBay call. The eBay pass is what cannot answer,
 *    so the eBay pass is what gets dropped.
 *
 * 2  SKIP HAS TO ANSWER, OR IT IS A LOOP. Only the model question was
 *    answered by moving on. The run goes to the first UNANSWERED question
 *    when it is not finished, so skipping your way through means arriving
 *    at the end and being sent back to the start. Walked it: askAt went
 *    1, 3, 5, 6, 7 while the first unanswered question sat on spec:1 the
 *    whole way round.
 *
 * Skip answers with the value the arithmetic is ALREADY using for an
 * unanswered question, so the third section here is the one that matters:
 * finishing a run by skipping must not move a single figure.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; } catch (e) { return null; } })()
].filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const SVC = "https://svc.example.test";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
const errs = [];

async function connected(file, w, h) {
  const pg = await browser.newPage({viewport: {width: w, height: h}});
  pg.on("pageerror", e => errs.push(String(e)));
  await pg.route("**/*", async r => {
    const u = r.request().url();
    if (!u.startsWith(SVC)) return r.continue();
    const p = new URL(u).pathname;
    const json = (c, b) => r.fulfill({status:c, contentType:"application/json",
      headers:{"access-control-allow-origin":"*","access-control-allow-headers":"content-type,x-pawn-token"},
      body:JSON.stringify(b)});
    if (p === "/limits") return json(200, {ok:true, ebay:true,
      images:{mediaTypes:["image/jpeg"],maxCount:4,maxBytes:5242880},
      photo:{key:true, model:"m", usdPerMTok:{in:1,out:1}, dayCap:10, spentToday:0}});
    if (p === "/sync") return json(200, {ok:true, mode:"memory", rows:[]});
    if (p === "/json") return json(200, {ok:true, data:{comps:[
      {price:300, what:"x", where:"GunWatcher", basis:"sold"},
      {price:320, what:"x", where:"GunWatcher", basis:"sold"}]}});
    return json(404, {ok:false});
  });
  await pg.addInitScript(([s, t]) => {
    localStorage.setItem("pawndesk_server", s);
    localStorage.setItem("pawndesk_token", t);
    try { localStorage.removeItem("pawndesk_comps"); } catch (e) {}
  }, [SVC, "t"]);
  await pg.goto(BASE + "/" + file, {waitUntil:"networkidle"});
  await pg.waitForTimeout(800);
  return pg;
}
const pick = async (pg, q) => {
  await pg.evaluate(() => { st.picked=false; st.market=null; st.mpNone=false; st.condSet=false;
    st.completeSet=false; st.brandSet=false; st.brandTyped=""; st.model=""; st.specSel={};
    st.worthNone=false; st.askAt=0; render(); });
  await pg.fill("#omniIn", q);
  await pg.waitForTimeout(400);
  const row = pg.locator('#omniList [data-omni="0"]');
  if (!await row.count()) return false;
  await row.click();
  await pg.waitForTimeout(450);
  return true;
};

/* ------------------------------------------------------------------ */
console.log("\n  eBay being blind does not switch the lookup off");
{
  const pg = await connected("phone.html", 390, 844);
  /* Every one of these carries an EBAY_CANNOT line and is a thing that
     walks through the door. The TCL is the one he sent. */
  for (const [q, why] of [["TCL 55 inch tv", "a television does not ship"],
                          ["Ruger LCP", "eBay does not sell firearms"],
                          ["push mower", "a mower does not ship"]]) {
    if (!await pick(pg, q)) { ok(false, `${q} — nothing to pick`); continue; }
    const r = await pg.evaluate(() => {
      const x = calcItem();
      return {ebay: !!ebayBlind(x), look: !!lookBlind(x),
              passes: lookPasses(x).map(p => p.name),
              btn: (() => { const e = document.querySelector('[data-wact="look"],[data-dact="look"]');
                            return e ? !e.disabled : null; })()};
    });
    ok(r.ebay, `${q} — eBay still says it cannot (${why})`);
    ok(!r.look && r.passes.length > 0,
       `  but the lookup has ${r.passes.length} other way(s): ${r.passes.join(", ")}`);
    ok(r.btn === true, `  and the Look up button is live, not greyed out`);
    /* None of those passes may be the eBay call, or nothing was dropped. */
    ok(await pg.evaluate(() => lookPasses(calcItem()).every(p => !p.ebay)),
       `  with the eBay pass dropped rather than the whole lookup`);
  }
  await pg.close();
}

/* ------------------------------------------------------------------ */
console.log("\n  skipping finishes the run instead of looping");
{
  const pg = await connected("phone.html", 390, 844);
  for (const q of ["TCL 55 inch tv", "Stihl chainsaw", "Weber kettle grill"]) {
    if (!await pick(pg, q)) { ok(false, `${q} — nothing to pick`); continue; }
    const seen = [];
    let done = false;
    for (let i = 0; i < 14; i++) {
      const at = await pg.evaluate(() => {
        const Q = askQueue(calcItem()).filter(z => !z.answered && !z.optional);
        return Q.length ? Q[0].id : null;
      });
      if (at === null) { done = true; break; }
      seen.push(at);
      const did = await pg.evaluate(() => {
        const s = [...document.querySelectorAll("button")]
          .find(b => /^skip/i.test((b.textContent || "").trim()));
        if (s) { s.click(); return true; }
        return false;
      });
      if (!did) break;
      await pg.waitForTimeout(280);
    }
    /* THE ASSERTION. A loop shows up as the same question twice. */
    const twice = seen.filter((v, i) => seen.indexOf(v) !== i);
    ok(done, `${q} — pressing Skip finishes the run (${seen.length} question(s))`);
    ok(twice.length === 0,
       `  and no question comes round twice${twice.length ? ": " + twice.join(", ") : ""}`);
  }
  await pg.close();
}

/* ------------------------------------------------------------------ */
console.log("\n  and skipping does not move a single figure");
{
  const pg = await connected("phone.html", 390, 844);
  for (const q of ["TCL 55 inch tv", "DeWalt 20V impact driver kit", "Stihl chainsaw",
                   "Weber kettle grill", "Ruger LCP"]) {
    if (!await pick(pg, q)) { ok(false, `${q} — nothing to pick`); continue; }
    const before = await pg.evaluate(() => { const x = calcItem();
      return {resale: Math.round(x.resale), buy: x.buy, lend: x.target}; });
    for (let i = 0; i < 14; i++) {
      const did = await pg.evaluate(() => {
        const s = [...document.querySelectorAll("button")]
          .find(b => /^skip/i.test((b.textContent || "").trim()));
        if (s) { s.click(); return true; }
        return false;
      });
      if (!did) break;
      await pg.waitForTimeout(260);
      if (await pg.evaluate(() => priceReady(calcItem()))) break;
    }
    const after = await pg.evaluate(() => { const x = calcItem();
      return {ready: priceReady(x), resale: Math.round(x.resale), buy: x.buy, lend: x.target}; });
    ok(after.ready, `${q} — finished`);
    ok(before.resale === after.resale && before.buy === after.buy && before.lend === after.lend,
       `  resale ${before.resale}, buy ${before.buy}, lend ${before.lend} — unchanged by skipping`);
  }
  await pg.close();
}

/* ------------------------------------------------------------------ */
console.log("\n  and the make is not printed twice");
{
  const pg = await connected("phone.html", 390, 844);
  const r = await pg.evaluate(() => {
    const t = (b, m) => { st.brandTyped = b; st.model = m; return madeName(); };
    return {dup: t("Ruger", "Ruger LCP"), split: t("Ruger", "LCP"),
            caseDup: t("ruger", "Ruger LCP"), noBrand: t("", "Ruger LCP"),
            noModel: t("Ruger", ""), normal: t("Stihl", "MS 271")};
  });
  ok(r.dup === "Ruger LCP", `a model that already carries the make prints once — "${r.dup}"`);
  ok(r.caseDup === "Ruger LCP", `  whatever the case it was typed in — "${r.caseDup}"`);
  ok(r.split === "Ruger LCP", `  a model without it still gets it — "${r.split}"`);
  ok(r.normal === "Stihl MS 271", `  and an ordinary pair is untouched — "${r.normal}"`);
  ok(r.noBrand === "Ruger LCP" && r.noModel === "Ruger", `  one alone is itself`);
  await pg.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
