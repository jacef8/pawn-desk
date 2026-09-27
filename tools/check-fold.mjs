#!/usr/bin/env node
/* ONE ITEM, ONE PRICE, EVEN WHEN TWO SITES ANSWERED.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-fold.mjs
 *
 * Reported from the counter with a screenshot: a Tactacam Reveal X listed
 * twice, $50-$75 from trailcampro and $60-$147 from eBay. "Why does the
 * same item have 2 different prices? Our tool should review both sites or
 * more if available, then determine a single suggested price."
 *
 * The rule is the OVERLAP, not the average. An average invents a figure
 * neither source ever claimed; the overlap is where two independent reads
 * of the same thing agree, and that is the strongest thing either of them
 * says. When they do not overlap they genuinely disagree, and that has to
 * cost confidence rather than be smoothed away.
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

console.log("  the same item does not carry two prices");

const r = await page.evaluate(() => {
  const names = MODEL_PRICES.map(x => omniNorm(x[2]));
  const dup   = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
  const by    = n => MODEL_PRICES.find(x => omniNorm(x[2]) === omniNorm(n));

  /* the fold must be a pure function of the rows, so run it on fixtures
     rather than trusting whatever shipped */
  const mk = (id, ref, name, lo, hi, conf, date, url, note) =>
    [id, ref, name, lo, hi, conf, date, url, note];
  const two = mpFold([
    mk("a", "h4|Cellular game camera", "Widget", 50, 75, "l", "2026-09-19", "https://www.trailcampro.com/x", "hand"),
    mk("b", "h4", "Widget", 60, 147, "m", "2026-09-24", "https://www.ebay.com/y", "25 listings, asking prices - no sold data")]);
  const apart = mpFold([
    mk("c", "h4", "Gizmo", 10, 20, "h", "2026-09-19", "https://www.trailcampro.com/x", "hand"),
    mk("d", "h4", "Gizmo", 80, 90, "h", "2026-09-24", "https://www.ebay.com/y", "asks")]);
  const one = mpFold([mk("e", "h4", "Solo", 5, 9, "m", "2026-09-19", "https://www.ebay.com/z", "n")]);

  return {dup, total: MODEL_PRICES.length,
          tact: (t => t && {lo:t[3], hi:t[4], conf:t[5], ref:t[1], sites:t[9], note:t[8]})(by("Tactacam Reveal X")),
          lite: (t => t && [t[3], t[4]])(by("Nintendo Switch Lite")),
          ps5:  (t => t && [t[3], t[4]])(by("PlayStation 5 disc")),
          two:  two.length === 1 ? {lo:two[0][3], hi:two[0][4], conf:two[0][5], ref:two[0][1], note:two[0][8]} : {n:two.length},
          apart: apart.length === 1 ? {lo:apart[0][3], hi:apart[0][4], conf:apart[0][5], note:apart[0][8]} : {n:apart.length},
          soloUntouched: one.length === 1 && one[0][3] === 5 && one[0][9] === undefined,
          idsStillResolve: ["d10","h572","h148","h163"].map(i => MP_BY_ID[i] ? omniNorm(MP_BY_ID[i][2]) : null),
          said: (t => t && mpSaid(t))(by("Tactacam Reveal X"))};
});

ok(r.dup.length === 0, `no item is listed twice - ${r.dup.length ? r.dup.join(", ") : "none of " + r.total}`);
ok(r.tact && r.tact.lo === 60 && r.tact.hi === 75,
   `the Tactacam is one price, the overlap - $${r.tact.lo}-$${r.tact.hi}, not $50-75 and $60-147`);
ok(r.tact && /trailcampro/.test(r.tact.sites||"") && /eBay/i.test(r.tact.sites||""),
   "and it still names both sites it came from");
ok(/2 sources agree/.test(r.said||""), `the row says so on the screen - "${r.said}"`);
ok(r.tact && String(r.tact.ref).split("|").length === 2,
   "it stays filed under every aisle and item its copies were filed under");
/* the two other real folds in the book, so this is not one lucky case */
ok(r.lite && r.lite[0] === 95 && r.lite[1] === 105,
   `three sources on the Switch Lite narrow to $${r.lite}, inside all of them`);
ok(r.ps5 && r.ps5[0] === 400 && r.ps5[1] === 449, `the PS5 narrows to $${r.ps5}`);

console.log("\n  and the rule itself, on fixtures");
ok(r.two.lo === 60 && r.two.hi === 75, `two overlapping sources give the overlap - $${r.two.lo}-$${r.two.hi}`);
ok(r.two.conf === "m", `agreement takes the better confidence, not the worse - ${r.two.conf}`);
ok(/agree/.test(r.two.note||""), "and the note says they agreed");
ok(r.apart.lo === 10 && r.apart.hi === 90,
   `sources that do NOT overlap span both rather than averaging to a figure neither claimed - $${r.apart.lo}-$${r.apart.hi}`);
ok(r.apart.conf === "m", `and disagreement costs a step of confidence - h + h became ${r.apart.conf}`);
ok(/DISAGREE/.test(r.apart.note||""), "and it says so rather than reading as agreement");
ok(r.soloUntouched, "a row with one source passes through untouched");
ok(r.idsStillResolve.every(Boolean),
   "every id that went into a fold still resolves - " + r.idsStillResolve.join(", "));
ok(errs.length === 0, "no page errors");

await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
