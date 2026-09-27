#!/usr/bin/env node
/* THE DEAL DRAFT BELONGS TO THE THING ON THE COUNTER.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-draft.mjs
 *
 * Reported: "when i move to a different item the old deal number still
 * sits in the log book at the bottom of the tool." Both halves of the
 * draft survived - what was handed over AND the ticket it was written on -
 * from one item onto the next, by every route except the Start over
 * button. The ticket number is the one field tying the row to the pawn
 * system, so the next customer's drill logs against the last customer's
 * ticket, and the shop's price book is built out of those rows.
 *
 * The first fix chased call sites and missed the reported one. This is
 * keyed to the item instead, so a route nobody has written yet is covered
 * too - which is the only version of this that stays fixed.
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
await page.waitForTimeout(1100);

const priceIt = (item) => page.evaluate((item) => {
  st.mode="item"; st.catId="elec"; st.itemId=item; st.picked=true;
  st.brandTyped="Sony"; st.model="PS5"; st.cond="good"; st.condSet=true;
  st.complete=true; st.completeSet=true;
  st.market={kind:"found", key:mkKey(), mid:400, lo:300, hi:500, n:9, sold:9, basis:"sold", comps:[]};
  (SPEC_CHOICES[st.itemId]||[]).forEach((g,gi)=>{ st.specSel[st.itemId+":"+gi]=specBase(g); });
  st.askEdit=false; st.askAt=askQueue(calcItem()).length-1; render();
}, item);

console.log("  the last customer's ticket does not follow the next one");

/* the route that was actually reported: price one thing, write the
   customer's ticket on it, then take the next thing off the search */
await priceIt("e5");
await page.evaluate(() => { st.struck="410"; st.ticket="12345"; render(); });
const before = await page.evaluate(() => ({t: st.ticket, s: st.struck, i: st.itemId}));
await page.fill("#omniIn", "dewalt drill");
await page.waitForTimeout(800);
const row = await page.$(".omniRow"); if (row) await row.click();
await page.waitForTimeout(600);
const after = await page.evaluate(() => ({t: st.ticket, s: st.struck, i: st.itemId,
  box: (document.getElementById("logTicket")||{}).value}));

ok(before.t === "12345" && before.s === "410", "a deal was drafted on the first item");
ok(after.i !== before.i, `and the counter moved to a different item - ${before.i} to ${after.i}`);
ok(after.t === "", "the ticket number did NOT follow it across");
ok(after.s === "", "and neither did the amount");
ok(!after.box, "the box on screen is empty too, not just the state behind it");

console.log("\n  but it survives everything that is still the same deal");
await priceIt("e5");
await page.evaluate(() => { st.struck="410"; st.ticket="12345"; render(); });
const same = await page.evaluate(() => {
  const seen = [];
  st.cond = "fair"; render(); seen.push(st.ticket);          /* re-rate the condition */
  st.detail = "256GB"; render(); seen.push(st.ticket);       /* add a note */
  st.struckKind = "buy"; render(); seen.push(st.ticket);     /* switch buy/pawn */
  return seen;
});
ok(same.every(v => v === "12345"),
   "changing the condition, the notes or buy-vs-pawn keeps the draft - " + JSON.stringify(same));

/* and a different MODEL of the same item is a different thing to price */
const model = await page.evaluate(() => { st.model = "PS4"; render(); return st.ticket; });
ok(model === "", "but a different model is a different thing, so the draft goes");

ok(errs.length === 0, "no page errors");
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
