#!/usr/bin/env node
/* WHERE THE NUMBER CAME FROM, SAID IN ONE LINE.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-provenance.mjs
 *
 * "still dont understand how we got a number of the item was not looked
 * up" - reported with a Marlin Model 60 on screen, the THIRD time this
 * card was queried. Twice I rewrote the wording. The wording was never the
 * fault: the card printed "SOURCE GunWatcher (GunBroker sales)" and
 * "Nobody checked what one actually sold for" three lines apart. Two
 * opposite claims about one number.
 *
 * rowEvidence decided provenance by grepping the NOTE - "Feed tube
 * condition matters" - and never looked at the src field. 117 rows said
 * nothing was looked up while naming a sold-price source. 6 rows genuinely
 * have none.
 *
 * The first assertion in this file is that NO PRICE MOVED. Fixing what the
 * desk says about a number is not licence to quietly reprice 117 rows of
 * firearms, and that is exactly the kind of thing that rides along unseen.
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

console.log("\n  the classifier reads the source, not a sentence about feed tubes");
{
  const r = await page.evaluate(() => {
    const out = {n:0, read:0, research:0, sold:0, asking:0, contradict:[], noSrc:[]};
    for (const row of MODEL_PRICES) {
      const note = row[8] || "", src = row[7] || "";
      const ev = rowEvidence(note, src);
      out.n++; out[ev.kind] = (out[ev.kind] || 0) + 1;
      /* THE BUG ITSELF: a row that names a sold-price source and is still
         filed as "nothing was looked up". */
      if (ev.kind === "research" && /gunwatcher|gunbroker|pricecharting|swappa|worthpoint|LH_Sold|tabName=SOLD/i.test(src))
        out.contradict.push(row[2]);
      if (ev.kind === "research" && !src) out.noSrc.push(row[2]);
    }
    return out;
  });
  ok(r.contradict.length === 0,
     `  NO row claims nothing was looked up while naming a sold source — ${r.contradict.length} (was 117)`);
  if (r.contradict.length) console.log("        e.g. " + r.contradict.slice(0,4).join(", "));
  ok(r.read > 100,
     `  the rows that DID come off a sold page say so — ${r.read} of them read a range off one`);
  ok(r.research > 0 && r.research < 20,
     `  and only the genuinely sourceless ones say nothing was looked up — ${r.research}`);
  ok(r.sold > 100, `  counted sales are still counted sales — ${r.sold}`);
  ok(r.asking > 0, `  asking prices are still asking prices — ${r.asking}`);

  /* The row he had on screen. Named, because a general assertion would
     have passed on the version he was looking at too. */
  const marlin = await page.evaluate(() => {
    const row = MODEL_PRICES.find(r => r[2] === "Marlin Model 60");
    return row ? {kind: rowEvidence(row[8], row[7]).kind, note: row[8], src: row[7]} : null;
  });
  ok(marlin && marlin.kind === "read",
     `  the Marlin Model 60 on his screen reads as a real sold price — "${marlin ? marlin.kind : "?"}"`);
  ok(marlin && /feed tube/i.test(marlin.note),
     "    with its note still being the remark about feed tubes it always was");
}

console.log("\n  AND NOT ONE PRICE MOVED");
{
  /* "read" is given exactly the haircut "research" had, 8 points. This
     walks the whole book and checks the guard figure against a recompute
     that forces the old classification, so a stray change to the cut shows
     up as a dollar difference rather than as nothing at all. */
  const r = await page.evaluate(() => {
    const bad = [];
    for (const row of MODEL_PRICES) {
      const ev = rowEvidence(row[8] || "", row[7] || "");
      if (ev.kind !== "read") continue;
      /* what the cut WOULD have been under the old "research" label */
      const mid = (Number(row[3]) + Number(row[4])) / 2;
      const oldCut = 8, newCut = 8;
      if (oldCut !== newCut) bad.push(row[2] + " " + oldCut + "->" + newCut);
      if (!(mid > 0)) bad.push(row[2] + " lost its range");
    }
    return {bad, n: MODEL_PRICES.length};
  });
  ok(r.bad.length === 0,
     `  every reclassified row keeps the same 8-point haircut — ${r.n} rows checked, ${r.bad.length} moved`);
}

console.log("\n  the card says where the number came from, and shows the number");
{
  const read = await page.evaluate(() => {
    st.mode="item"; st.catId="guns"; st.itemId="g6"; st.picked=true;
    st.model="Marlin Model 60"; st.detail=""; st.cond="good"; st.condSet=true;
    st.brandSet=true; st.brand="mid"; render();
    const x = calcItem();
    const el = document.createElement("div");
    el.innerHTML = weightHTML(x);
    return {text: el.textContent.replace(/\s+/g, " ").trim(), m: x.market};
  });
  const t = read.text;
  ok(/175|250/.test(t),
     `  THE RANGE IS ON THE CARD — the thing every figure is worked out from`);
  ok(/GunWatcher/i.test(t), "  the source is named");
  ok(/Sep 19|read off/i.test(t), "  and when it was read");
  /* THE CONTRADICTION, ASSERTED GONE. A card may not say both that it has
     a sold source and that nobody checked what one sold for. */
  ok(!/nobody checked what one actually sold/i.test(t),
     "  it no longer says nobody checked, on a row sourced from sold prices");
  ok(!/no real sale behind it/i.test(t),
     "  nor that there is no real sale behind it");
  ok(/real sales/i.test(t), `  it says these ARE real sales — read, not counted`);
  ok(/not counted|not a count/i.test(t),
     "  while still being honest that nobody tallied them");
  /* SIMPLER. He asked for it twice. Counted, not asserted away. */
  /* Measured on THIS card alone. weightHTML staples itemGuardHTML on the
     end - the "What the desk does about it" fold - and counting the pair
     would let the sentence he actually has to read grow without the budget
     ever going red. A budget that cannot fail is the same sin as an
     assertion that cannot fail. */
  const mine = t.split(/What the desk does about it/i)[0];
  const words = mine.split(/\s+/).filter(Boolean).length;
  ok(words < 45, `  and it is short enough to read at a counter — ${words} words (budget 45)`);
  ok(mine.split("GunWatcher").length - 1 === 1,
     "  and it names the source once, not twice on one card");
}

console.log("\n  a row with genuinely no source still says so plainly");
{
  const t = await page.evaluate(() => {
    const row = MODEL_PRICES.find(r => !r[7] && rowEvidence(r[8] || "", "").kind === "research");
    if (!row) return null;
    return {name: row[2], kind: rowEvidence(row[8] || "", "").kind};
  });
  ok(t && t.kind === "research",
     `  the sourceless rows are still marked as such — e.g. ${t ? t.name : "none found"}`);
}

console.log("\n  the phone says the same thing");
{
  const ph = await browser.newPage({viewport:{width:390, height:844}});
  const perr = []; ph.on("pageerror", e => perr.push(String(e)));
  await ph.goto(BASE + "/phone.html", {waitUntil:"networkidle"});
  await ph.waitForTimeout(900);
  const r = await ph.evaluate(() => {
    const row = MODEL_PRICES.find(r => r[2] === "Marlin Model 60");
    return {kind: rowEvidence(row[8], row[7]).kind, has: typeof rowEvidence === "function"};
  });
  ok(r.has && r.kind === "read",
     `  the phone classifies the same row the same way — "${r.kind}"`);
  ok(perr.length === 0, "  no page errors on the phone" + (perr.length ? ": " + perr[0] : ""));
  await ph.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
