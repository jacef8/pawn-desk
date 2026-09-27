#!/usr/bin/env node
/* DOES OUR MATH LAND WHERE REAL SHOPS PRICE THINGS.
 *
 *   python3 -m http.server 8099 &
 *   node tools/backtest-shelf.mjs
 *
 * 27 shelf tags photographed in other pawn shops. Their `ask` is what the
 * ticket said, which is a RETAIL price on a shelf - so the figure of ours
 * it should be compared against is `resale`, not the buy or the loan.
 *
 * The old tools/backtest-shelf.js scored itself. Its comment said the tag
 * under test was held out "so nothing scores itself", but the code loaded
 * every row once, before the loop, and seenMatch() reads all of them - so
 * the tool was predicting each shelf price from that same shelf price. Any
 * number it printed was worthless. Here the seen record is rewritten before
 * every tag with that tag removed, which needs no reload because seenAll()
 * reads localStorage on each call.
 *
 * Two runs, because they answer different questions:
 *   COLD  - no shelf record at all. What the built-in book and the model
 *           say on their own. This is the real test.
 *   WARM  - the other 26 tags present. What the counter would actually see
 *           once the shop has been collecting tickets for a while.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
import {readFileSync} from "node:fs";
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const tags = JSON.parse(readFileSync(new URL("../seed-shelf-prices.json", import.meta.url), "utf8"));
const rows = Array.isArray(tags) ? tags : (tags.rows || tags.tags);

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport:{width:1512, height:950}});
const perr = []; page.on("pageerror", e => perr.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"load"});
await page.waitForTimeout(1400);

async function run(useSeen) {
  const out = [];
  for (const t of rows) {
    const q = [t.brand, t.model, t.name].filter(Boolean).join(" ").slice(0, 70);
    const others = useSeen ? rows.filter(r => r.id !== t.id) : [];
    const r = await page.evaluate(async ({q, others}) => {
      localStorage.setItem("pawndesk_seen", JSON.stringify(others));
      startOver(); await new Promise(r => setTimeout(r, 80));
      const i = document.getElementById("omniIn");
      i.value = q; i.dispatchEvent(new Event("input", {bubbles:true}));
      await new Promise(r => setTimeout(r, 200));
      const pick = [...document.querySelectorAll(".omniRow")]
        .filter(e => !/sold prices|not on the lists/i.test(e.innerText));
      if (!pick.length) return null;
      pick[0].click(); await new Promise(r => setTimeout(r, 300));
      if (others.length) {
        const seen = seenEstimate(seenMatch(calcItem()));
        if (seen && !calcItem().checked) {
          st.market = {kind:"seen", key:mkKey(), mid:seen.mid, n:seen.n, lo:seen.lo, hi:seen.hi};
          render(); await new Promise(r => setTimeout(r, 50));
        }
      }
      const x = calcItem();
      /* CIRCULAR ROWS ARE NOT A CHECK. Several book rows were seeded from
         these very photographs - their source field says "shelf tags
         photographed 19 Sep 2026, Bristol". Scoring our price against the
         ticket it was copied from returns 1.00 and proves nothing, so it
         is marked rather than counted. */
      const row = x.market && x.market.key && typeof MP_BY_ID === "object"
        ? Object.values(MP_BY_ID).find(r => omniNorm(r[2]) === omniNorm(st.model || x.item.name))
        : null;
      const src = (x.market && x.market.src) || (row && row[7]) || "";
      return {item: st.bookName || x.item.name, checked: x.checked,
              via: (x.market && x.market.kind) || "-",
              circular: /shelf tag/i.test(String(src)),
              resale: Math.round(x.resale), loan: x.target, buy: x.buy};
    }, {q, others});
    out.push({tag: t, got: r});
  }
  return out;
}

function report(label, out) {
  /* NOT ONLY THE ROWS THE BOOK KNOWS BY MODEL. x.checked is false for a
     generic catalogue item, but the desk still shows a figure for it - the
     built-in estimate, which is exactly what the counter sees before any
     lookup runs. That estimate IS the math being asked about, so it is
     scored too, marked "est". The rows priced from these same photographs
     stay excluded either way. */
  const hit = out.filter(o => o.got && o.tag.ask > 0 && o.got.resale > 0);
  console.log(`\n=== ${label} ===`);
  console.log("TAGS: " + rows.length + "   THE DESK PUTS A FIGURE ON: " + hit.length + "\n");
  console.log("item".padEnd(32) + "ticket".padStart(8) + "ours".padStart(8)
            + "ratio".padStart(7) + "  buy".padStart(7) + "   source");
  const ratios = [];
  let circ = 0;
  for (const o of hit.sort((a,b) => (a.got.resale/a.tag.ask) - (b.got.resale/b.tag.ask))) {
    const rat = o.got.resale / o.tag.ask;
    if (o.got.circular) circ++; else ratios.push(rat);
    console.log((o.tag.name||"").slice(0,31).padEnd(32)
      + ("$"+o.tag.ask).padStart(8) + ("$"+o.got.resale).padStart(8)
      + rat.toFixed(2).padStart(7) + ("$"+o.got.buy).padStart(7) + "   " + (o.got.checked?o.got.via:"est")
      + (o.got.circular ? "   <- PRICED FROM THIS TICKET, not a check" : ""));
  }
  if (circ) console.log("\n  " + circ + " of these came from the photographs themselves and are excluded.");
  ratios.sort((a,b) => a-b);
  const q = p => ratios.length ? ratios[Math.min(ratios.length-1, Math.floor(ratios.length*p))] : 0;
  const within = f => ratios.filter(r => r >= 1-f && r <= 1+f).length;
  if (ratios.length) {
    console.log("\n  median ours / their ticket   " + q(.5).toFixed(2));
    console.log("  quarter / three-quarter      " + q(.25).toFixed(2) + "  " + q(.75).toFixed(2));
    console.log("  within 25% of the ticket     " + within(.25) + " of " + ratios.length);
    console.log("  within 40%                   " + within(.40) + " of " + ratios.length);
    console.log("  we read HIGH (>1.25x)        " + ratios.filter(r => r > 1.25).length);
    console.log("  we read LOW  (<0.75x)        " + ratios.filter(r => r < 0.75).length);
  }
  const miss = out.filter(o => !o.got || !o.got.checked);
  if (miss.length) {
    console.log("\n  no built-in figure, would need a live lookup:");
    miss.forEach(o => console.log("    " + (o.tag.name||"").slice(0,44).padEnd(46)
      + "ticket $" + o.tag.ask + (o.got ? "   -> " + o.got.item : "   -> no match")));
  }
  return ratios;
}

report("COLD - the book and the model alone, no shelf record", await run(false));
report("WARM - the other 26 tickets on file", await run(true));
if (perr.length) console.log("\npage errors: " + perr.length + "  " + perr[0]);
await browser.close();
