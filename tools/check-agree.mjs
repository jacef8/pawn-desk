#!/usr/bin/env node
/* A HUNDRED ITEMS, EVERY SCREEN, DO THEY AGREE.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-agree.mjs [N]
 *
 * "i want you to run a test of the tool across 100 random items in our
 * database. review every screen and make sure all screens and windows
 * agree and make sense. make sure the final screen has all windows
 * agreeing and being logical to the user."
 *
 * Every other suite here checks one rule hard. This one checks that the
 * screens do not CONTRADICT each other, which is a different failure and
 * the one he keeps catching by eye:
 *
 *   - the card printed BUY $150 with no warning while the rail said
 *     "nothing looked up, no source at all"
 *   - the answer card quoted a loan while card 7 refused to
 *   - the rail quoted day 60 for the suggested loan beside a typed one
 *   - two cards both called themselves the place to log the deal
 *
 * Each of those shipped, and each was found by a person rather than a
 * test, because every test here was pointed at one card.
 *
 * It walks real rows out of the book, finishes the run, and reads the
 * money off every surface that shows it. A contradiction is any two
 * screens disagreeing about the SAME fact.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; } catch (e) { return null; } })()
].filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const N    = Math.max(1, Number(process.argv[2] || 100));
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
/* 150% scaling, because that is the size he runs it at and the size the
   rest of this repo never tested. */
const page = await browser.newPage({viewport: {width: 1327, height: 787}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil: "networkidle"});
await page.waitForTimeout(800);

console.log(`\n  walking ${N} rows out of the book, every screen, looking for disagreements`);

const out = await page.evaluate(async (n) => {
  /* A fixed shuffle so a failure is reproducible: same N, same hundred. */
  let seed = 20261003;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const pool = MODEL_PRICES.slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const picked = pool.slice(0, n);

  /* NOT `money`. Naming this helper money() shadowed the APP's money()
     formatter inside this evaluate, so every money(x.buy) returned null
     and the audit reported 180 disagreements against the string "null".
     The app's formatter is the thing the screens actually print with, so
     it is the one the comparisons have to use. */
  const dollars = s => { const m = String(s).match(/\$([\d,]+)/); return m ? Number(m[1].replace(/,/g, "")) : null; };
  const txt = h => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const bad = [];          /* every contradiction found, with the item */
  const seen = {rows: 0, skipped: 0, tiers: {counted:0, sourced:0, none:0}, gated: 0, thin: 0};

  for (const row of picked) {
    const name = row[2];
    st.flow = ""; st.mode = "item"; st.picked = false; st.market = null; st.mpNone = false;
    st.condSet = false; st.completeSet = false; st.brandSet = false; st.brandTyped = "";
    st.model = ""; st.detail = ""; st.specSel = {}; st.fakeAns = {}; st.fakeKey = mkKey();
    /* WAS st.struckKind = "loan" FOR EVERY ROW, AND THAT IS WHY THIS AUDIT
       MISSED THE BUG IT WAS BUILT TO CATCH. He pressed Sale and got "LENT
       220" with a rail headed "If he pawns it"; I had pinned the kind to
       loan and never pressed anything, so the tab and the kind could not
       disagree in my walk the way they did on his screen.
       It presses the tabs now, the way he does. */
    st.struck = ""; st.ticket = ""; st.itemTab = "item";
    const R = omniRows(name) || {}, rows = R.rows || [];
    const f = rows.find(z => ["mp", "book", "item"].includes(z.kind));
    if (!f) { seen.skipped++; continue; }
    omniPick(f);
    st.condSet = true; st.completeSet = true;
    (SPEC_CHOICES[st.itemId] || []).forEach((g, i) => { st.specSel[st.itemId + ":" + i] = specBase(g); });
    const q = askQueue(calcItem());
    st.askAt = q.length - 1;
    render(); await new Promise(z => setTimeout(z, 0));
    const x = calcItem();
    seen.rows++;
    const note = (what) => bad.push({name, what});

    /* ---- the facts, as each surface states them ---- */
    const card = txt(askDoneHTML(x));
    const pin  = txt(pinHTML(x));
    const rail = txt(weightHTML(x));
    /* Pressed, not assigned - the handler is where the tab and the deal
       kind are tied together, so setting st.itemTab directly would walk
       straight past the bug again. */
    const press = (name) => { const b = document.querySelector(`[data-itab="${name}"]`);
      if (b) b.click(); else st.itemTab = name; render(); };
    press("pawn");
    const tick = txt(ticketHTML(x));
    const pay  = txt(paybackHTML(x));
    const pawnScreen = txt(document.querySelector(".colQ") ? document.querySelector(".colQ").innerHTML : "");
    const pawnRail = txt(dealPanelHTML(calcItem()));
    press("sale");
    const sale = txt(saleTabHTML(x));
    const saleScreen = txt(document.querySelector(".colQ") ? document.querySelector(".colQ").innerHTML : "");
    const saleRail = txt(dealPanelHTML(calcItem()));
    press("item");

    const gated = (() => { const sh = fakeSheet(x); const F = sh ? fakeState(sh) : null; return !!(F && F.blocks); })();
    if (gated) seen.gated++;
    if (x.buyTooThin) seen.thin++;
    const tier = evidenceTier(x);
    seen.tiers[tier] = (seen.tiers[tier] || 0) + 1;

    /* ---- 1. a gated item must not be priced ANYWHERE ---- */
    if (gated) {
      if (card.indexOf("$" + x.buy) >= 0 || card.indexOf("$" + x.target) >= 0)
        note("fakes-gated, but the answer card still prints the money");
      if (/Lend him \$/.test(pin)) note("fakes-gated, but the numbers strip quotes a loan");
      continue;   /* the rest of the checks are about a priced item */
    }

    /* ---- 2. the loan can never exceed the buy ---- */
    if (x.target > x.buy) note(`lends $${x.target} on something it would only pay $${x.buy} for`);

    /* ---- 3. the printed share must BE the share ---- */
    const said = card.match(/Buying at (\d+)% of that, lending (\d+)%/);
    if (said && x.resale > 0) {
      const b = Math.round(x.buy / x.resale * 100), l = Math.round(x.target / x.resale * 100);
      if (Number(said[1]) !== b) note(`card says buying at ${said[1]}% and pays ${b}%`);
      if (Number(said[2]) !== l) note(`card says lending at ${said[2]}% and lends ${l}%`);
    }

    /* ---- 4. THE ONE HE CAUGHT. The card must not look confident while
             the rail says there is no evidence. ---- */
    const railBlank = /nothing looked up|no source at all/i.test(rail);
    const cardWarns = /Estimate|Not a counted sale/i.test(card);
    if (railBlank && !cardWarns)
      note("the rail says nothing was looked up and the money card carries no warning");
    if (tier === "counted" && railBlank)
      note("counted evidence, yet the rail says no source at all");
    /* THE RULE ITSELF, NOT A SYMPTOM OF IT. The two lines above only fire
       when the RAIL happens to say it is blank, so deleting the money
       card's warning outright went unnoticed on every "sourced" row - I
       injected exactly that fault and this section stayed silent.
       "i want verifiable sales data to back up every purchase" is the
       rule: anything short of a counted figure has to SAY so on the card
       carrying the money, whatever the rail is doing. */
    if (tier !== "counted" && !cardWarns)
      note(`evidence is "${tier}" and the money card carries no warning at all`);
    if (tier === "counted" && cardWarns)
      note("counted evidence, yet the card warns as though there were none");

    /* ---- 5. day 30 must be the same number wherever it is said ---- */
    const d30card = (card.match(/To get it back: \$([\d,]+)/) || [])[1];
    if (d30card) {
      const want = x.target + x.charge;
      if (Number(d30card.replace(/,/g, "")) !== want)
        note(`card says $${d30card} by day 30, the arithmetic says $${want}`);
    }
    const rung = (pay.match(/BY DAY 30 \$([\d,]+)/i) || [])[1];
    if (rung && d30card && rung.replace(/,/g, "") !== d30card.replace(/,/g, ""))
      note(`day 30 is $${d30card} on the card and $${rung} on the ladder`);

    /* ---- 6. the sale tab must agree with the card about the buy ----
       MY BUG FIRST TIME: compared against "$" + x.buy, so a $1,295 watch
       rendered by money() never matched "$1295" and seven expensive items
       were reported as disagreeing when they agreed perfectly. Compare
       what the screen actually prints. */
    if (sale && sale.indexOf(money(x.buy)) < 0)
      note(`the Sale tab does not show the ${money(x.buy)} buy the card quotes`);

    /* ---- 7. the ladder must be the arithmetic, and must rise ----
       MY BUG FIRST TIME, and it cried wolf on 64 of 100 rows: I scraped
       every dollar figure out of the card text and called them rungs. The
       card also carries the rate control's worked example - "$100 lent
       comes back as $125" - and the $5 minimum, so the "ladder" I was
       reading was 100, 125, 20, 25, 30, 35 and of course it went down.
       The real rungs for a Tudor Black Bay are $1,295, $1,618, $1,941,
       $2,264: principal plus one charge, two, three. Rising, correct, and
       I nearly reported 64 false alarms as findings.
       So it is checked against what ladder() actually produces, which is
       also a real cross-check of the card against the arithmetic. */
    const P = payAmt(x);
    const want = ladder(P.amt, P.charge).map(r => Math.round(r.due));
    for (let i = 1; i < want.length; i++)
      if (want[i] < want[i - 1]) { note(`the redemption ladder goes down: $${want[i-1]} then $${want[i]}`); break; }
    for (const due of want)
      if (pay.indexOf(money(due)) < 0)
        { note(`the ladder's ${money(due)} rung is not printed on the card`); break; }

    /* ---- 8. nothing may be free, and nothing may be absurd ---- */
    if (!(x.buy > 0)) note(`offers $${x.buy} to buy it`);
    if (x.resale > 0 && x.buy > x.resale) note(`pays $${x.buy} for something that resells at $${Math.round(x.resale)}`);
    if (x.target > 0 && x.target > x.resale) note(`lends $${x.target} against a $${Math.round(x.resale)} resale`);

    /* ---- 9. A TAB MUST TALK ABOUT ITS OWN DEAL ----
       The one he caught, and the one this audit was built for and missed.
       On Sale the whole screen is about buying it outright; a box headed
       LENT, or a rail headed "If he pawns it", is the screen contradicting
       the tab the user chose. Same in reverse on Pawn. */
    if (/\bLENT\b/i.test(saleScreen) || /If he pawns it/i.test(saleRail))
      note("the Sale tab talks about lending \u2014 a LENT box or a pawn rail");
    if (/\bBOUGHT\b/i.test(pawnScreen) || /If you buy it/i.test(pawnRail))
      note("the Pawn tab talks about buying \u2014 a BOUGHT box or a buy rail");
    /* and the suggested figure on each tab has to be that tab's figure */
    if (saleScreen.indexOf(money(x.target)) >= 0 && x.target !== x.buy)
      note(`the Sale tab shows the ${money(x.target)} loan figure`);

    /* ---- 10. exactly one place to write the deal down ---- */
    const strips = document.querySelectorAll(".struck").length;
    if (strips > 1) note(`${strips} copies of the log strip on one screen`);
  }
  return {bad, seen};
}, N);

const {bad, seen} = out;
console.log(`\n  ${seen.rows} rows walked, ${seen.skipped} unreachable from the search box`);
console.log(`  evidence: ${seen.tiers.counted} counted, ${seen.tiers.sourced} sourced, ${seen.tiers.none} neither`);
console.log(`  ${seen.gated} fakes-gated, ${seen.thin} too thin to buy\n`);

ok(seen.rows >= Math.floor(N * 0.8),
   `at least four in five rows are reachable and priceable — ${seen.rows} of ${N}`);

/* THE ASSERTION. Every disagreement found, named with its item, because
   "some screens disagree" is not something anybody can act on. */
const byKind = {};
for (const b of bad) (byKind[b.what.replace(/\$[\d,]+/g, "$X").replace(/\d+%/g, "N%")] ||= []).push(b.name);
const kinds = Object.keys(byKind);
if (kinds.length) {
  console.log("  disagreements found:");
  for (const k of kinds.sort((a, b) => byKind[b].length - byKind[a].length))
    console.log(`    ${String(byKind[k].length).padStart(3)}x  ${k}\n          e.g. ${byKind[k].slice(0, 3).join(", ")}`);
  console.log("");
}
ok(bad.length === 0, `no screen contradicts another across ${seen.rows} rows — ${bad.length} found`);
ok(errs.length === 0, `no page errors across the walk${errs.length ? ": " + errs[0] : ""}`);

await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
