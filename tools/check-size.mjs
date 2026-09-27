#!/usr/bin/env node
/* A MEASUREMENT THE COUNTER TYPED IS NOT A COINCIDENCE.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-size.mjs
 *
 * From the shelf-ticket backtest: "dewalt compressor dwfp55126 6 gal" put
 * "Air compressor - 60 gal upright" above "Air compressor - pancake", and
 * priced a $150 ticket at $280. Of the three misroutes that backtest
 * found, this is the one that costs money rather than deals - the other
 * two lowball and lose the deal, this one overpays.
 *
 * Nothing was wrong in the scorer. "gal" matched both rows exactly and the
 * "6" matched neither, because wordHit needs three characters before it
 * will prefix-match and a one-digit token can only hit an identical one.
 * Two rows tied and the tie fell to whichever came first.
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
const page = await browser.newPage({viewport:{width:1500, height:1000}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html");
await page.waitForTimeout(1200);

const top = q => page.evaluate(q => {
  const r = omniRows(q);
  return (r.rows||[]).filter(x => x.kind !== "own" && x.kind !== "sold")
    .slice(0,3).map(x => x.mp ? x.mp[2] : (x.name || x.q));
}, q);

console.log("  a size that conflicts is the wrong product, not a near miss");
const small = await top("dewalt compressor dwfp55126 6 gal");
ok(/pancake/i.test(small[0] || ""), `a 6 gal compressor finds the pancake - ${small[0]}`);
ok(!/60 gal/i.test(small[0] || ""), "  and not the 60 gal upright it used to pick");

const big = await top("60 gal air compressor");
ok(/60 gal/i.test(big[0] || ""), `and 60 gal still finds the 60 gal - ${big[0]}`);

console.log("\n  without breaking the searches that were already right");
for (const [q, want] of [["onn 50 inch television", /tv/i],
                         ["werner 24ft extension ladder", /ladder/i],
                         ["dewalt drill", /drill/i],
                         ["stihl ms271 chainsaw", /chainsaw/i],
                         ["apple airpods pro", /airpods/i]]) {
  const t = await top(q);
  ok(want.test(t[0] || ""), `${q} -> ${t[0]}`);
}

ok(errs.length === 0, "no page errors");
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
