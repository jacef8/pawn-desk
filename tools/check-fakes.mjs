#!/usr/bin/env node
/* THE TOOL DOING THE CHECKS, NOT LISTING THEM.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-fakes.mjs
 *
 * "But don't we just have a checklist of things to check, but our tool
 * doesn't actually do the checks?"
 *
 * Half right, and the half he was right about was the bigger half. The
 * numbers card already did real arithmetic - weight, diameter, density
 * against a published mint spec - but only for bullion and watch cases.
 * Sixteen coin rows and seven watch cases out of eleven sheets. Everything
 * else was a checklist he performs while the tool counts how many he has
 * ticked.
 *
 * Three things went in:
 *   1. JEWELRY BY DENSITY. A ring has no spec weight, but density is not a
 *      product specification - it is arithmetic on the alloy, the same for
 *      every piece ever made to that karat. Plated brass reads 8.5 where
 *      14k reads 13.25. That is the fake that walks in, and the tool can
 *      now catch it with a cup of water.
 *   2. WEIGH ONE YOU KNOW IS REAL. Nobody publishes a figure for an M18
 *      pack or a PSA slab that is worth trusting, and an invented spec in
 *      a book that decides what leaves the till is worse than none. So the
 *      shop supplies it, off its own known-good stock.
 *   3. THE PHOTO PASS. It raises things to go and look at, tied to the
 *      sheet's own checks, and it is forbidden to clear anything.
 *
 * The assertions below are mostly about the last point. A photograph that
 * says "looks genuine" on a $4,000 watch is the confident wrong answer
 * this whole tool exists to avoid.
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
const page = await browser.newPage({viewport:{width:1440, height:900}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(1200);

/* THE MACHINERY HAS TO BE THERE BEFORE ANYTHING BELOW MEANS ANYTHING.
   Without this the suite threw a stack trace on a build that lacked the
   feature instead of going red - and a stack trace is not a red: the
   sweep I run these with counts FAIL lines, saw none, and would have
   recorded a crashed suite as passing. Every probe below is written to
   survive the parts being missing, and this is the assertion that says
   they are missing. */
console.log("\n  the machinery this suite is about exists");
const have = await page.evaluate(() => ({
  karat: !!(typeof SPEC_BY !== "undefined" && SPEC_BY.k14),
  refs:  typeof refAdd === "function" && typeof refJudge === "function",
  look:  typeof fakeLookPrompt === "function" && typeof fakeLookHTML === "function",
}));
ok(have.karat, "  the jewelry density table is loaded");
ok(have.refs,  "  the shop's own reference weights are wired");
ok(have.look,  "  the photo pass is wired");
if (!have.karat || !have.refs || !have.look) {
  console.log("\n  (skipping the rest — there is nothing to check)");
  await browser.close();
  console.log(`\n${fails} FAILED`);
  process.exit(1);
}

console.log("\n  jewelry is checked by density, and the arithmetic is real");
const jew = await page.evaluate(() => {
  const sheet = id => FAKES.sheets.find(s => s.id === id);
  /* Pick the alloy first: the range the figure stands for is printed with
     the row, and a card with nothing picked has nothing to print it for.
     The first version of this assertion read the unpicked card and went
     red for the right reason. */
  st.specPick = "k14";
  const card = specCardHTML(sheet("jewelry"));
  /* Three pieces the same size: real 14k, plated brass, and sterling sold
     as gold. Water weight worked back from the density so the test is
     arithmetic and not a recording of what the code happens to do. */
  const dry = 8.40;
  const wet = d => dry - dry / d;                     /* displaced water = mass/density */
  const judge = d => { const sg = specGravity(dry, wet(d)); const j = specJudge(SPEC_BY.k14, "sg", sg);
                       return {sg:Number(sg.toFixed(2)), ok:j.ok, pct:Number(j.pct.toFixed(1))}; };
  return {
    card, has:/by density/i.test(card),
    real: judge(13.25), brass: judge(8.50), sterling: judge(10.36), tenk: judge(11.50),
    /* and the ranges have to be on the screen, or a pass is a number
       nobody can argue with */
    saysRange: /12\.9-13\.6/.test(card),
    warns: /Solid, plain metal only/.test(card) && /hollow/i.test(card),
    rows: SPECS.filter(z => z.grp === "karat").length,
  };
});
ok(jew.has && jew.rows >= 10, `  the jewelry sheet gets a density table — ${jew.rows} alloys`);
ok(jew.real.ok, `  a solid 14k band passes — density ${jew.real.sg}`);
ok(!jew.brass.ok && jew.brass.pct < -20,
   `  the same ring in plated brass fails, and not narrowly — ${jew.brass.sg}, ${jew.brass.pct}%`);
ok(!jew.sterling.ok, `  sterling sold as 14k fails — ${jew.sterling.sg}`);
/* 10k against 14k is the closest honest pair in the table. If the tolerance
   ever widens enough to call one the other, this goes red. */
ok(!jew.tenk.ok, `  and 10k does not pass as 14k — ${jew.tenk.sg}`);
ok(jew.saysRange, "  the card prints the range the figure stands for");
ok(jew.warns, "  and warns that a stone or a hollow chain reads light for honest reasons");

console.log("\n  a sheet with nothing to measure gets no numbers card");
const gate = await page.evaluate(() => {
  const sheet = id => FAKES.sheets.find(s => s.id === id);
  const out = {};
  for (const id of ["jewelry","bullion","watch","cards","auto","battery","apple","optics","stones"])
    out[id] = {spec: !!specCardHTML(sheet(id)), ref: !!refCardHTML(sheet(id))};
  return out;
});
/* This used to fall through to the metal screen's own metal, which
   defaults to gold - so the Pokemon sheet offered a table of coin specs
   and a box for the diameter of a trading card. */
ok(!gate.cards.spec && !gate.auto.spec && !gate.stones.spec,
   "  no coin table on the card, autograph or gemstone sheets");
ok(gate.jewelry.spec && gate.bullion.spec && gate.watch.spec,
   "  and it is still there where there is a published spec to check against");

console.log("\n  where nothing is published, the shop weighs its own");
const ref = await page.evaluate(() => {
  st.refs = {};
  const added = refAdd("battery", "M18 5.0Ah XC", 1032);
  const r = refList("battery")[0];
  const at = w => { const j = refJudge(r, w); return {ok:j.ok, pct:Number(j.pct.toFixed(1))}; };
  const stored = JSON.parse(localStorage.getItem("pawndesk:web:v1") || "{}");
  const card = refCardHTML(FAKES.sheets.find(s => s.id === "battery"));
  return {added, close:at(1005), light:at(880), heavy:at(1100),
          persisted: !!(stored.refs && stored.refs.battery && stored.refs.battery.length),
          blank: refAdd("battery","",900), zero: refAdd("battery","Junk",0),
          sample: /One sample is not a specification/.test(card),
          sheets: Object.keys(REF_SHEETS).length};
});
ok(ref.added && ref.sheets === 4, `  four sheets take a reference weight`);
ok(ref.close.ok, `  a pack 2.6% under your own known-good one passes — ${ref.close.pct}%`);
ok(!ref.light.ok && !ref.heavy.ok,
   `  one well under or over does not — ${ref.light.pct}% and +${ref.heavy.pct}%`);
ok(ref.persisted, "  and the reference survives a reload, like the rates do");
ok(ref.blank === false && ref.zero === false, "  a nameless or weightless reference is refused");
ok(ref.sample, "  the card says out loud that one sample is not a specification");

console.log("\n  the photo pass raises hands and never clears anything");
const look = await page.evaluate(() => {
  const sh = FAKES.sheets.find(s => s.id === "watch");
  const pr = fakeLookPrompt(sh);
  CAP.sample = {json: async () => ({})}; CAP.images = true;
  st.fakeLook = {sheet:"watch", quality:"good",
    flags:[{check:3, saw:"The date does not fill the cyclops.", do:"Look through the bubble square on."}],
    cannot:["whether the seconds hand sweeps"], readable:{serial:"", model:"116610"}};
  const withFlags = fakeLookHTML(sh);
  st.fakeLook = {sheet:"watch", quality:"good", flags:[], cannot:[], readable:{}};
  const empty = fakeLookHTML(sh);
  st.fakeLook = {sheet:"watch", quality:"poor", flags:[], cannot:[], readable:{}};
  const poor = fakeLookHTML(sh);
  const text = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  return {
    forbids: /MUST NOT say, imply or hedge toward the item being authentic/.test(pr),
    carriesChecks: sh.checks.every(c => pr.indexOf(String(c)) >= 0),
    emptyIsNotPass: /does not mean the item is real/.test(pr),
    tokens: Math.round(pr.length / 4),
    flagText: text(withFlags), emptyText: text(empty), poorText: text(poor),
  };
});
ok(look.forbids, "  the prompt forbids a clean bill of health outright");
ok(look.carriesChecks, "  and carries the sheet's own checks, so a flag points at one");
ok(/check 3 on this sheet/.test(look.flagText),
   "  a flag names which check to go and work");
ok(/Now check:/.test(look.flagText), "  and what to do with your hands");
/* THE ASSERTION THAT MATTERS. An empty result is the dangerous one: it is
   the moment a photograph is most likely to be read as a pass. */
ok(/not a pass/i.test(look.emptyText) && !/\b(authentic|genuine|looks real)\b/i.test(look.emptyText),
   "  seeing nothing is shown as seeing nothing, never as a pass");
ok(!/\b(authentic|genuine)\b/i.test(look.flagText + look.emptyText + look.poorText),
   "  the word authentic never reaches the screen from a photograph");
ok(/not good enough to judge/i.test(look.poorText),
   "  and a bad picture says so instead of guessing off it");
ok(/cannot clear anything/i.test(look.flagText),
   "  with the limit on the card itself, not just in the prompt");
ok(look.tokens < 900, `  the prompt is ${look.tokens} tokens, so a read is cheap`);

/* ══════════════════════════════════════════════════════════════════════
   SHUT UNTIL HE TAPS IT, UNLESS IT IS HOLDING THE PRICE.

   "yes close it until i tap it." The card was 261 words sitting open on
   the gold screen, which was the wordiest screen in the tool at 724
   words. Closed it is 363.

   The danger in closing it is the reason this section exists. Four of the
   eleven sheets GATE - bullion, watch, cards, apple - and a gating sheet
   is the whole reason there is no price on the screen. Shut that one and
   he is looking at a card that says nothing while the desk silently
   refuses to quote. So it opens itself when it gates and when any check
   has been answered, which means a shut card can never be hiding a
   failed check or a held price: a failed check carries an answer, and an
   answer forces it open.
   ══════════════════════════════════════════════════════════════════════ */
console.log("\n  the card is shut until he taps it, and opens itself when it must");
{
  const pg = await browser.newPage({viewport: {width: 1500, height: 1000}});
  pg.on("pageerror", e => errs.push(String(e)));
  await pg.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  await pg.waitForTimeout(800);
  const at = async (kind) => {
    await pg.evaluate(k => { st.mode = "metal"; st.metalKind = k; render(); }, kind);
    await pg.waitForTimeout(350);
    return pg.evaluate(() => {
      const d = document.getElementById("fakeCard");
      const t = (document.body.innerText || "").replace(/\s+/g, " ").trim();
      return {there: !!d, open: d ? d.open : null, gate: !!(fakeSheet(calcItem()) || {}).gate,
              sum: d ? ((d.querySelector(":scope > summary") || {}).innerText || "").replace(/\s+/g, " ") : "",
              words: t ? t.split(" ").length : 0};
    });
  };
  await pg.evaluate(() => { st.openFakes = false; st.fakeAns = {}; });
  const adv = await at("jewelry");
  ok(adv.there, "the card is on the gold screen");
  ok(!adv.gate && adv.open === false, `  the advising sheet is shut — ${adv.words} words on screen`);
  ok(/\d of \d|check/i.test(adv.sum),
     `  and the shut card still says where it stands — "${adv.sum.slice(0, 54)}"`);

  const gate = await at("bullion");
  ok(gate.gate && gate.open === true,
     "  the GATING sheet opens itself — it is the reason there is no price");
  ok(/holds the price/i.test(gate.sum),
     `  and says so — "${gate.sum.slice(0, 54)}"`);

  /* THE BUG THIS SECTION EXISTS FOR. A details inserted with the open
     attribute fires `toggle` on the new element, so listening for toggle
     recorded the gate's own doing as "he opened it" - st.openFakes stuck
     true and every advising sheet came back open from then on. The fold
     would have worked until the first gated item of the day and then
     quietly stopped. The summary's click is wired instead, because a
     click is unambiguously his finger. */
  const back = await at("jewelry");
  ok(back.open === false,
     "  and coming back from it does not leave the advising one open");
  ok(await pg.evaluate(() => st.openFakes === false),
     "  the gate's own open is not remembered as a tap");

  /* His tap sticks through the re-render that answering a check causes. */
  await pg.locator("#fakeCard > summary").click();
  await pg.waitForTimeout(300);
  const tapped = await pg.evaluate(() => {
    const d = document.getElementById("fakeCard");
    return {open: d.open, st: st.openFakes};
  });
  ok(tapped.open === true && tapped.st === true, "  a tap opens it");
  await pg.evaluate(() => render());
  await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => document.getElementById("fakeCard").open),
     "  and it stays open through a re-render, not shutting under his finger");

  /* An answered check forces it open, so a failed one can never be hidden. */
  await pg.evaluate(() => { st.openFakes = false; st.fakeAns = {}; render(); });
  await pg.waitForTimeout(300);
  const before = await pg.evaluate(() => document.getElementById("fakeCard").open);
  await pg.evaluate(() => {
    const b = document.querySelector('#fakeCard [data-fake$=":fail"]')
           || document.querySelector("#fakeCard [data-fake]");
    if (b) b.click();
  });
  await pg.waitForTimeout(350);
  const after = await pg.evaluate(() => {
    const d = document.getElementById("fakeCard");
    return {open: d.open, sum: ((d.querySelector(":scope > summary") || {}).innerText || "").replace(/\s+/g, " ")};
  });
  ok(before === false && after.open === true,
     "  answering one check forces it open — a shut card cannot hide a failed one");
  ok(/1 of \d done/.test(after.sum), `  and the summary counts it — "${after.sum.slice(0, 50)}"`);
  await pg.close();
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
