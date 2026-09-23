#!/usr/bin/env node
/* The desk asks one thing at a time, with a way forward, back and past it.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-wizard.mjs
 *
 * Paging and the two-column rail have to work together: the pages decide
 * what is on the left, the rail keeps the money beside it. They nearly do
 * not - .paged carries display:block!important, written for the phone where
 * there is one column and nothing to lay out, and on a desk that flattens
 * the two columns back into one. So the first thing checked is that the
 * grid survives paging at all.
 *
 * Then that the controls do what they say, and - the one that matters - that
 * a card paged away is HIDDEN and not removed. Removing it would drop the
 * value typed into it and the handler wired to it, so a counter who pages
 * back to fix an answer finds an empty box and a dead button.
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
const page = await browser.newPage({viewport:{width:1440,height:900}});
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});

await page.evaluate(() => {
  const cat = CATALOG.find(c => c.items.some(i => i.id === "t1"));
  /* This suite is about the PAGED layout and the rail beside it. The default
     flow is the one-question run now, so the mode has to be asked for by
     name rather than assumed. */
  st.flow = "pages";
  st.mode = "item"; st.catId = cat.id; st.itemId = "t1"; st.picked = true; st.model = "DCD791";
  render();
});

const read = () => page.evaluate(() => {
  const v = document.getElementById("view");
  const nav = v.querySelector("#pageNav");
  const railBox = v.querySelector(".rail") ? v.querySelector(".rail").getBoundingClientRect() : null;
  const qBox = v.querySelector(".colQ") ? v.querySelector(".colQ").getBoundingClientRect() : null;
  const shown = [...v.querySelectorAll(".card")].filter(e => e.offsetParent !== null)
    .map(e => (e.querySelector(".label,summary") || {}).textContent || "").filter(Boolean);
  return {
    cls: v.className,
    display: getComputedStyle(v).display,
    page: st.page,
    where: (nav && (nav.querySelector(".pageWhere") || {}).textContent) || "",
    tabs: nav ? [...nav.querySelectorAll("[data-page]")].map(b => b.textContent.trim()) : [],
    hasSkip: !!(nav && nav.querySelector(".pageSkip")),
    backOff: !!(nav && nav.querySelector('[data-pgmove="-1"]').disabled),
    navInQ: !!(nav && nav.closest(".colQ")),
    railLeft: railBox ? Math.round(railBox.left) : null,
    qRight: qBox ? Math.round(qBox.right) : null,
    shown,
    hiddenCards: [...v.querySelectorAll(".pgOff")].length,
  };
});

console.log("\n  the grid survives paging");
{
  const s = await read();
  ok(/railed/.test(s.cls) && /paged/.test(s.cls), "view is both railed and paged — " + s.cls);
  ok(s.display === "grid", "still a grid, not flattened to block — got " + s.display);
  ok(s.railLeft !== null && s.qRight !== null && s.railLeft >= s.qRight - 2,
     "the rail sits beside the questions, not under them (q ends " + s.qRight + ", rail starts " + s.railLeft + ")");
  ok(s.navInQ, "the nav is inside the question column, beside what it steers");
}

console.log("\n  the controls");
{
  let s = await read();
  ok(s.tabs.length >= 3, "there are page tabs — " + s.tabs.join(" | "));
  ok(/1 of/i.test(s.where), 'it says where you are — "' + s.where + '"');
  ok(s.backOff, "Back is dead on the first page");
  /* Skip and Next fire the same thing - data-pgmove="1" - so Skip is Next
     wearing a different word, for when you are leaving a question
     unanswered. On a page that IS answered the word is simply wrong, and it
     is hidden there. "What it is" counts as answered the moment an item is
     picked, which it is here, so the offer to skip belongs on a page that
     still wants something. */
  ok(!s.hasSkip, "no Skip on a page that is already answered");
  {
    const onOpen = await page.evaluate(() => {
      /* Not "worth": the built-in price list already knows this item, so
         worth counts as answered whether or not anything was looked up.
         Condition is the one nothing can answer for you. */
      st.page = "cond"; st.condSet = false; render();
      const nav = document.getElementById("pageNav");
      return {skip: !!(nav && nav.querySelector(".pageSkip")),
              where: (nav && (nav.querySelector(".pageWhere")||{}).textContent) || ""};
    });
    ok(onOpen.skip, "but there is one on a page still waiting for an answer");
    ok(!/all answered/.test(onOpen.where), "  and it does not claim to be finished — " + onOpen.where);
    await page.evaluate(() => { st.page = "what"; render(); });
  }
  const first = s.page, firstShown = s.shown.join("|");

  await page.click('#pageNav [data-pgmove="1"]');
  s = await read();
  ok(s.page !== first, "Next moves on — " + first + " → " + s.page);
  ok(s.shown.join("|") !== firstShown, "and different cards are on screen");
  ok(!s.backOff, "Back is alive now");
  ok(s.hiddenCards > 0, s.hiddenCards + " cards are hidden rather than removed");

  await page.click('#pageNav [data-pgmove="-1"]');
  s = await read();
  ok(s.page === first, "Back returns to " + first);
  ok(s.shown.join("|") === firstShown, "with the same cards as before");
}

console.log("\n  a paged-away card keeps what was typed in it");
{
  await page.evaluate(() => { st.page = "what"; render(); });
  const typed = await page.evaluate(() => {
    const el = document.getElementById("brandIn"); if (!el) return null;
    el.value = "DeWalt"; el.dispatchEvent(new Event("input", {bubbles:true}));
    return el.value;
  });
  ok(typed === "DeWalt", "typed a brand on this page");
  await page.click('#pageNav [data-pgmove="1"]');
  const away = await page.evaluate(() => {
    const el = document.getElementById("brandIn");
    return {exists: !!el, visible: el ? el.offsetParent !== null : false, value: el ? el.value : null};
  });
  ok(away.exists && !away.visible, "paged away it is hidden, NOT removed");
  ok(away.value === "DeWalt", "and it still holds what was typed — got " + JSON.stringify(away.value));
}

ok(!errs.length, "no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? "\n  " + fails + " FAILED\n" : "\n  all passed\n");
process.exit(fails ? 1 : 0);
