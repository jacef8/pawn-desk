/* One question on the screen.
 *
 * Asked for repeatedly and not actually built until now. "One page at a
 * time" was four PAGES, and the first still carried six questions in a
 * scrolling card - brand, tier, platform, kit, model, specs. A form wearing
 * a pager. This suite holds the real thing: one question, big answers,
 * answering moves on by itself, and the specifics are questions in the run
 * rather than fields buried under it. */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";

/* Same resolution the other suites use: playwright lives in the global
   root here, not beside the repo. */
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ok    " + m); } else { fail++; console.log("  FAIL  " + m); } };

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });

const start = (itemId) => page.evaluate((id) => {
  const c = CATALOG.find(x => x.items.some(i => i.id === id));
  st.flow = "ask"; st.mode = "item"; st.catId = c.id; st.itemId = id; st.picked = true;
  st.askAt = 0; st.brand = "mid"; st.brandTyped = ""; st.specSel = {};
  st.condSet = false; st.complete = true; st.market = null;
  render();
}, itemId);

const read = () => page.evaluate(() => {
  const c = document.getElementById("askCard");
  if (!c) return null;
  return { where: c.querySelector(".askWhere").textContent.trim(),
    q: c.querySelector(".askQ").textContent.trim(),
    opts: [...c.querySelectorAll(".askOpt .askT")].map(t => t.textContent.trim()),
    dots: c.querySelectorAll(".askDots i").length,
    done: c.querySelectorAll(".askDots i.done").length,
    backOff: c.querySelector('[data-askmove="-1"]').disabled,
    nextOff: c.querySelector('[data-askmove="1"]').disabled,
    cards: document.querySelectorAll("#view > .card, #view .colQ > .card").length };
});

console.log("\none question at a time\n");

await start("t1");
let r = await read();
ok(!!r, "the run renders at all");
ok(/^1 of 6/.test(r.where), "a cordless drill asks six questions — " + r.where);
ok(/make/i.test(r.q), "it opens on the make — " + r.q);
ok(r.backOff, "  Back is dead on the first one");
ok(r.dots === 6, "  a dot for every question, got " + r.dots);

/* the whole point: answering moves on */
await page.click(".askOpt");
r = await read();
ok(/^2 of 6/.test(r.where), "answering moves to the next by itself — " + r.where);
ok(r.done >= 1, "  and the one behind is marked done, got " + r.done);
ok(!r.backOff, "  Back is alive now");

/* the specifics ARE the questions, not fields under them */
const seen = [];
await start("t1");
for (let i = 0; i < 6; i++) {
  const s = await read(); if (!s) break;
  seen.push(s.q);
  const b = await page.$(".askOpt");
  if (b && s.opts.length) { await b.click(); await page.waitForTimeout(120); } else break;
}
const all = seen.join(" | ").toLowerCase();
ok(/battery|platform/.test(all), "how many batteries is a question in the run — " + seen.join(" | "));
ok(/all there|missing/.test(all) || /is it all there/.test(all), "  so is whether it is all there");
ok(/sell for used/.test(all), "  and the price is the end of the run, not a separate page");

/* a simpler item asks fewer - the queue is built from the item */
await start("e1");
r = await read();
const n = Number((r.where.match(/of (\d+)/) || [])[1]);
ok(n >= 2, "a TV builds its own queue, " + n + " questions");

/* the dots are navigation, not decoration */
await start("t1");
await page.evaluate(() => { document.querySelectorAll(".askDots i")[3].click(); });
r = await read();
ok(/^4 of/.test(r.where), "tapping a dot jumps to that question — " + r.where);

/* nothing else on screen to scroll past */
ok(r.cards <= 5, "the run is the screen, not one card among many — " + r.cards + " cards");

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
