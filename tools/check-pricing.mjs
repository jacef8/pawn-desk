#!/usr/bin/env node
/* Money rules that are easy to break and expensive to get wrong.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-pricing.mjs
 *
 * WHOSE NUMBER IS IT. A resale value the counter typed is what THIS one is
 * worth - they have the thing in their hands and the scratches are already
 * in the figure. A resale value off the price list describes a typical good
 * one. Multiply the first by the condition adjustment and the wear is priced
 * twice: type $300 for a rough TV and the desk quietly lends against $135.
 * The second must still be adjusted, or condition stops meaning anything.
 * Both directions are checked here because a fix for either one alone looks
 * right and is wrong.
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
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport:{width:1400,height:900}});
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});

const r = await page.evaluate(() => {
  const c = CATALOG.find(x => x.items.some(i => i.id === "e1"));
  st.mode = "item"; st.catId = c.id; st.itemId = "e1"; st.picked = true;

  const at = (cond) => { st.cond = cond; const x = calcItem();
    return {resale: Math.round(x.resale), hand: x.handSet, target: x.target}; };

  /* typed by hand */
  st.market = {kind:"hand", key: mkKey(), mid: 300};
  const handGood = at("good"), handRough = at("rough"), handNew = at("new");

  /* off the list - same shape of object, different provenance */
  st.market = {kind:"list", key: mkKey(), mid: 300, lo:280, hi:320, name:"x", conf:"h",
               date: todayStr(), src:"https://www.ebay.com", note:"", stale:false};
  const listGood = at("good"), listRough = at("rough");

  st.market = null; st.cond = "good";
  return {handGood, handRough, handNew, listGood, listRough};
});

console.log("\n  a resale value the counter typed");
ok(r.handGood.hand === true, "is flagged as hand-set");
ok(r.handGood.resale === 300, "reads $300 in good — got $" + r.handGood.resale);
ok(r.handRough.resale === 300, "STILL $300 in rough — the wear is already in it (got $" + r.handRough.resale + ")");
ok(r.handNew.resale === 300, "still $300 at new in box — got $" + r.handNew.resale);
ok(r.handRough.target === r.handGood.target, "so the loan does not move with condition either");

console.log("\n  a resale value off the price list");
ok(r.listGood.hand === false, "is not flagged as hand-set");
ok(r.listGood.resale === 300, "reads $300 in good — got $" + r.listGood.resale);
ok(r.listRough.resale < r.listGood.resale,
   "and DOES drop in rough — $" + r.listGood.resale + " to $" + r.listRough.resale
   + " (a list price describes a typical good one)");

console.log("\n  the TV is not named for one size band");
{
  const tv = await page.evaluate(() => {
    const c = CATALOG.find(x => x.items.some(i => i.id === "e1"));
    const g = (SPEC_CHOICES["e1"] || []).find(z => /screen/i.test(z.label));
    return {name: c.items.find(i => i.id === "e1").name, sizes: g ? g.options.map(o => o.t) : []};
  });
  ok(!/50\s*to\s*65/i.test(tv.name), 'the name does not claim a size — "' + tv.name + '"');
  ok(/tv/i.test(tv.name), "and still says TV, so it is still searchable");
  ok(tv.sizes.length >= 4, "the picker offers every band — " + tv.sizes.join(" / "));
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
