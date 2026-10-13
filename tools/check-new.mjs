#!/usr/bin/env node
/* WHAT A NEW ONE COSTS, AND THE LINE THAT SAYS SO.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-new.mjs
 *
 * "Want me to put that check on the rest of the book, so anything you'd
 * lend near its new price says so on the card?" - "Yes add that."
 *
 * A new price is a CEILING, not a comp. The one thing it can do that no
 * other figure can is prove a used range wrong on its own: a used gun
 * booked at or above what a new one costs is an error, and it is an error
 * in the direction that lends too much. Three rows already carried this as
 * prose in their note; the figures moved to MODEL_NEW so a test could read
 * them and so the sentence could not drift from the numbers beside it.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; } catch { return null; } })()
].filter(Boolean)) { try { ({chromium} = req(m)); break; } catch {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };
const browser = await chromium.launch({executablePath: EXE});

/* stand on a model, fully answered, on whichever surface */
const STAND = (id) => {
  const row = MP_BY_ID[id];
  const item = String(row[1]).split("|")[0];
  const cat = CATALOG.find((c) => c.items.some((i) => i.id === item));
  st.mode = "item"; st.catId = cat.id; st.itemId = item; st.picked = true;
  st.model = String(row[2]); st.mpPin = {id: row[0], model: String(row[2])};
  st.brandSet = true; st.brandTyped = ""; st.condSet = true; st.cond = "good";
  st.completeSet = true; st.market = null; st.mpNone = false; st.worthNone = true;
  st.specSel = {}; (SPEC_CHOICES[item] || []).forEach((g, gi) => { st.specSel[item + ":" + gi] = specBase(g); });
  st.snapDetail = false; st.askEdit = false;
  st.askAt = askQueue(calcItem()).length - 1;
  render();
  return row;
};

console.log("\n  the table itself");
{
  const p = await browser.newPage({viewport: {width: 1440, height: 900}});
  await p.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const out = {rows: [], orphans: [], prose: 0};
    out.n = Object.keys(MODEL_NEW).length;
    for (const [id, v] of Object.entries(MODEL_NEW)) {
      const row = MP_BY_ID[id];
      if (!row) { out.orphans.push(id); continue; }
      out.rows.push({id, name: row[2], lo: row[3], hi: row[4], nw: v[0], date: v[1]});
    }
    /* the prose must be GONE, or the card says it twice and the two drift */
    out.prose = MODEL_PRICES.filter((r) => /CHECK BEFORE LENDING NEAR/.test(String(r[8] || ""))).length;
    return out;
  });
  ok(r.n > 0, `  there are new prices on file — ${r.n}`);
  ok(r.orphans.length === 0, `  every one points at a real row — ${r.orphans.join(", ") || "none orphaned"}`);
  ok(r.prose === 0, `  and none of it is still written into a note as prose — ${r.prose} left`);
  /* a new price must be a plausible retail figure, not a used one typed twice */
  const silly = r.rows.filter((x) => !(x.nw > 0) || x.nw < x.lo);
  ok(silly.length === 0,
     `  every new price is above that row's used low — ${silly.map((x) => x.id).join(", ") || "all of them"}`);
  /* THE FINDING, NOT A FAILURE. These are the rows the whole thing exists
     for: a used range whose top is at or above what a new one costs. It is
     reported rather than asserted away, because the fix is re-researching
     the used price, not editing the ceiling. */
  const over = r.rows.filter((x) => x.hi >= x.nw);
  console.log(`\n  ${over.length} of ${r.rows.length} rows are booked at or above new:`);
  over.forEach((x) => console.log(`    ${x.id}  ${x.name}  used $${x.lo}-$${x.hi}  new $${x.nw}`));
  ok(true, `  (reported, not failed — the fix is the used range, not the ceiling)`);
  await p.close();
}

/* ── and the line that says so, on BOTH surfaces ──────────────────────── */
for (const [page, w, h, label, figure] of [
  ["index.html", 1440, 900, "desk", "lends"],
  ["phone.html", 390, 844, "phone", "pays"]]) {
  console.log(`\n  the ${label} says it on the card`);
  const p = await browser.newPage({viewport: {width: w, height: h}});
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(BASE + "/" + page, {waitUntil: "networkidle"});
  await p.waitForTimeout(400);

  /* a1 is the Remington 870 Express: used 300-400 against 381 new */
  const over = await p.evaluate((src) => {
    (new Function("return (" + src + ")")())("a1");
    return {text: document.body.innerText, hi: calcItem().market.hi};
  }, STAND.toString());
  ok(/above new/.test(over.text),
     `  a range booked above new is called out — ${(over.text.match(/A new one runs about[^\n]*/) || ["NOT SAID"])[0].slice(0, 76)}`);
  ok(/\$381/.test(over.text), "  and it gives the new price, not just a warning");

  /* NO CEILING WITHOUT DATA, ACROSS THE WHOLE BOOK.
     Written first as "stand on one row that has no new price and check the
     screen is quiet". That passed with a deliberate bug injected - a
     fallback that made a ceiling up out of the used price - because the
     one row it happened to pick stayed quiet for arithmetic reasons rather
     than because no ceiling existed. One row proves one row.
     This asks every row in the book instead: if it is not in MODEL_NEW,
     newCeilingHTML must return empty, whatever the numbers happen to be.
     Nothing is ever inferred from a used price. */
  const quiet = await p.evaluate((src) => {
    const stand = new Function("return (" + src + ")")();
    const talked = [];
    let n = 0;
    for (const row of MODEL_PRICES) {
      if (MODEL_NEW[row[0]] || !(row[3] > 0)) continue;
      n++;
      const x = Object.assign({}, calcItem(), {
        market: {kind: "list", lo: row[3], hi: row[4], mid: Math.round((row[3] + row[4]) / 2),
                 name: row[2], newAt: newPriceFor(row)},
        target: Math.round(row[4] * 0.9), buy: Math.round(row[4] * 0.9)});
      const a = newCeilingHTML(x, "loan"), b = newCeilingHTML(x, "buy");
      if (a || b) talked.push(row[0] + " " + row[2]);
    }
    stand("a1");
    return {n, talked};
  }, STAND.toString());
  ok(quiet.talked.length === 0,
     `  not one of the ${quiet.n} rows without a new price invents a ceiling — ${quiet.talked.slice(0, 3).join(", ") || "none did"}`);
  ok(!errs.length, `  no page errors${errs.length ? ": " + errs[0] : ""}`);
  await p.close();
}

/* ── the "near new" wording, which is the half he asked for ───────────── */
console.log("\n  and the near-new line, with the ceiling moved under the figure");
{
  const p = await browser.newPage({viewport: {width: 1440, height: 900}});
  await p.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  await p.waitForTimeout(400);
  const r = await p.evaluate((src) => {
    const stand = new Function("return (" + src + ")")();
    stand("a1");
    const x = calcItem();
    /* put the ceiling just above the range top so the FIRST branch cannot
       fire, and just low enough that the loan clears 60% of it - which is
       the only way to exercise the second branch at all */
    const faked = Object.assign({}, x, {
      market: Object.assign({}, x.market, {hi: 10, newAt: {price: Math.round(x.target / 0.7), date: "x", how: "test"}})});
    return {loan: x.target, html: newCeilingHTML(faked, "loan"), buyHtml: newCeilingHTML(faked, "buy")};
  }, STAND.toString());
  ok(/lends/.test(r.html), `  the desk says what it would LEND — ${r.html.replace(/<[^>]*>/g, "").slice(0, 70)}`);
  ok(/pays/.test(r.buyHtml), `  the phone says what it would PAY — ${r.buyHtml.replace(/<[^>]*>/g, "").slice(0, 70)}`);
  await p.close();
}

await browser.close();
console.log(fails ? `\n  ${fails} FAILED\n` : "\n  all passed\n");
process.exit(fails ? 1 : 0);
