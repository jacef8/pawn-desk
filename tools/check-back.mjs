#!/usr/bin/env node
/* HOW DO I GET BACK TO THE BEGINNING?
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-back.mjs
 *
 * Asked twice from the counter - "how do i reset and start a new lookup?"
 * and then, with a run in progress, "how do i back out back to the
 * beginning?" Twice is not a wording problem, it is a missing affordance,
 * and there were three faults behind it:
 *
 *   startOver() never cleared needItem, which was added later with the
 *   "Which of these is it?" card. The home screen is gated on
 *   !picked && !needItem and the ask flow on picked || needItem, so after
 *   Start over BOTH were false: no start page, and a run still running.
 *
 *   The way out on the ask card clicked #pinNew - a button in the rail -
 *   and only fell back to its own partial reset when the rail was absent.
 *   On the Which-of-these card there is no rail, so the four-line fallback
 *   is what ran.
 *
 *   The two buttons for the identical action were called different things,
 *   and the one thing always on screen - the tab he was already on - did
 *   nothing when tapped.
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
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(900);

/* His exact state: tapped the Outdoor power tile, looking at the list. */
const intoWhich = () => page.evaluate(() => {
  st.mode="item"; st.catId="power"; st.picked=true; st.needItem=true;
  st.itemId=CATALOG.find(c=>c.id==="power").items[0].id;
  st.omniDone="outdoor power"; render();
});
/* Mid-run on a real item, the other place he asked from. */
const intoRun = () => page.evaluate(() => {
  st.mode="item"; st.catId="tools"; st.itemId="t1"; st.picked=true; st.needItem=false;
  st.brandTyped="DeWalt"; st.brandSet=true; st.model="DCD791"; st.cond="good";
  st.condSet=true; st.askAt=2; render();
});
/* HOME means the start page, and it is not one flag - it is the pair the
   two gates read. Both must be false or the desk shows neither screen. */
const home = () => page.evaluate(() => ({
  picked: st.picked, needItem: st.needItem,
  model: st.model, brandTyped: st.brandTyped, market: st.market,
  omniDone: st.omniDone,
  box: !!document.getElementById("omniIn"),
  asking: !!document.querySelector("#askCard"),
}));
const atHome = h => !h.picked && !h.needItem && h.box && !h.asking;

console.log("\n  the way out on the card he was looking at");
{
  await intoWhich();
  const label = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(b => b.dataset.askout);
    return b ? b.textContent.replace(/\s+/g, " ").trim() : null;
  });
  ok(!!label, `  the Which-of-these card carries a way out — "${label}"`);
  /* ONE NAME FOR ONE ACTION. The rail's button for this is "Start over";
     this one said "Pick another", which on a card listing seven things to
     pick reads as "choose a different one of these". */
  ok(label && /start over/i.test(label),
     "  called the same thing as the rail's button, not a second name for it");
  ok(!/pick another/i.test(label || ""),
     "  and not \"Pick another\", which on this card means something else entirely");

  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(b => b.dataset.askout);
    if (!b) return false; b.click(); return true;
  });
  ok(clicked, "  it is wired");
  await page.waitForTimeout(300);
  const h = await home();
  ok(atHome(h),
     `  AND IT REALLY GOES HOME — picked ${h.picked}, needItem ${h.needItem}, box ${h.box}, still asking ${h.asking}`);
  /* needItem is the one that was left behind, so it is named rather than
     folded into atHome alone. */
  ok(h.needItem === false,
     "    needItem is cleared, which is what left the desk showing no start page and a live run");
}

console.log("\n  the X beside the search box, which is the one always on screen");
{
  /* WRITING THIS TEST IS WHAT FOUND THE REAL SHAPE OF IT. I assumed the
     rail carried a Start over button and asserted it. There is none:
     pinHTML hands straight off to railHTML at desk width and only the
     narrow phone strip carries #pinNew. So on his 1920px desk, mid-run,
     there was NOTHING on screen that went back - the ask card draws its
     way out on question one only, and from question three the route was
     Back, Back, Back.
     The X was always the intended answer; it calls startOver whenever
     something is picked. It was simply invisible, hidden by CSS on an
     empty box, which is exactly the state tapping a category tile leaves
     you in. */
  await intoRun();
  const vis = () => page.evaluate(() => {
    const c = document.getElementById("omniClr");
    if (!c) return {there:false};
    return {there:true, shown: getComputedStyle(c).visibility !== "hidden",
            empty: !(document.getElementById("omniIn") || {}).value,
            title: c.getAttribute("title") || ""};
  });
  let v = await vis();
  ok(v.there && v.shown && v.empty,
     `  mid-run with an EMPTY box the X is visible \u2014 shown ${v.shown}, box empty ${v.empty}`);
  ok(/start over/i.test(v.title),
     `  and says what it does, not "clear the search" \u2014 "${v.title}"`);
  await page.evaluate(() => document.getElementById("omniClr").click());
  await page.waitForTimeout(300);
  const h = await home();
  ok(atHome(h), `  and it goes home \u2014 picked ${h.picked}, needItem ${h.needItem}`);
  ok(!h.model && !h.brandTyped && !h.market,
     "  taking the make, the model and the looked-up price with it");
  v = await vis();
  ok(v.there && !v.shown,
     `  back at the start, nothing to back out of, it hides again \u2014 shown ${v.shown}`);
  await intoWhich();
  v = await vis();
  ok(v.shown, "  and it is there on the Which-of-these card, where he asked from");
}

console.log("\n  tapping the tab you are already on");
{
  /* The one thing always on screen. It used to set st.mode to the mode it
     was already in and re-render the same screen - a no-op on the only
     control that never leaves the page. */
  await intoWhich();
  await page.evaluate(() => {
    const b = document.querySelector('[data-tab="item"]'); if (b) b.click();
  });
  await page.waitForTimeout(300);
  let h = await home();
  ok(atHome(h), `  from the Which-of-these card it goes home — picked ${h.picked}, needItem ${h.needItem}`);

  await intoRun();
  await page.evaluate(() => {
    const b = document.querySelector('[data-tab="item"]'); if (b) b.click();
  });
  await page.waitForTimeout(300);
  h = await home();
  ok(atHome(h), "  and mid-run it goes home too");

  /* AND IS STILL A NO-OP WHEN THERE IS NOTHING TO BACK OUT OF. Tapping
     Price on the start page must not feel like anything happened. */
  const before = await page.evaluate(() => { st.omniQ = "milwaukee"; render();
    const i = document.getElementById("omniIn"); if (i) i.value = "milwaukee";
    return (document.getElementById("omniIn") || {}).value; });
  await page.evaluate(() => {
    const b = document.querySelector('[data-tab="item"]'); if (b) b.click(); });
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => (document.getElementById("omniIn") || {}).value);
  ok(before === after,
     `  but on the start page it changes nothing — typing survives the tap ("${after}")`);

  /* The other tabs must still be tabs. */
  const moved = await page.evaluate(() => {
    const b = document.querySelector('[data-tab="metal"]'); if (b) b.click();
    return st.mode; });
  ok(moved === "metal", `  and the other tabs still switch — ${moved}`);
  await page.evaluate(() => { st.mode = "item"; render(); });
}

console.log("\n  the phone");
{
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  const perr = []; ph.on("pageerror", e => perr.push(String(e)));
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  await ph.waitForTimeout(900);
  const h = await ph.evaluate(() => {
    st.mode="item"; st.catId="power"; st.picked=true; st.needItem=true;
    st.itemId=CATALOG.find(c=>c.id==="power").items[0].id; render();
    if (typeof startOver === "function") startOver();
    return {picked: st.picked, needItem: st.needItem};
  });
  ok(h.picked === false && h.needItem === false,
     `  the field screen clears both flags too — picked ${h.picked}, needItem ${h.needItem}`);
  ok(perr.length === 0, "  no page errors on the phone" + (perr.length ? ": " + perr[0] : ""));
  await ph.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
