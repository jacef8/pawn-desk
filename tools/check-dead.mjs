#!/usr/bin/env node
/* QUESTIONS THAT CANNOT MOVE THE NUMBER.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-dead.mjs
 *
 * "Run a complete review of the app and make sure this quits happening."
 *
 * It started with one report - a Sega Saturn opening on "What make is it?"
 * when the make cannot reach a measured price - and the sweep that chased
 * it found the same shape 649 more times. calcItem had two branches:
 *
 *   resale = checked ? market.mid * cond * completeMult
 *                    : baseValue * CATALOG_AT_GOOD * cond * brandMult
 *                      * completeMult * spec.mult
 *
 * spec.mult was in the second and not the first, so on every item with a
 * measured price every specification answer was collected and thrown away.
 * A chainsaw that would not start priced as a running one. A quartz
 * Datejust priced as an automatic, $1,830 against the $1,010 it is worth.
 *
 * This suite is the guard. It walks every catalog item and every book row,
 * tries every option of every question, and fails if the answers all land
 * on the same number. A question the counter answers has to reach the money
 * or it is a keystroke at a counter with a customer waiting.
 *
 * AN EXEMPTION HAS TO EARN ITSELF. Three questions legitimately do not move
 * the number, and each one does its job another way - the make is already
 * inside a measured figure, a special edition is too wide to guess at and
 * says to look it up, no title stops the deal outright. The allowlist below
 * does not just excuse them: every entry is followed by an assertion that
 * the other mechanism still works. Excusing a question without proving that
 * is how a dead question gets written down as intentional.
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

/* The three exemptions, by the question's own label. Each one is asserted
   against further down - remove the assertion and the exemption is void. */
const ALLOWED = {
  "What make is it?":
    "a measured figure for this exact model already has the maker in it - multiplying by a tier would price it twice",
  "Plain one, or special?":
    "measured 1.7x to 4.4x over the plain machine, far too wide for one multiplier - the option says to look it up instead",
  "Title":
    "no title is not a discount, it is a stop - the option carries stop:true and ends the deal",
};

const browser = await chromium.launch({executablePath: EXE});
const page = await browser.newPage({viewport:{width:1440, height:900}});
const errs = []; page.on("pageerror", e => errs.push(String(e)));
await page.goto(BASE + "/index.html", {waitUntil:"networkidle"});
await page.waitForTimeout(1200);

/* ── the sweep ─────────────────────────────────────────────────────────── */
const sweep = await page.evaluate(() => {
  const dead = [], seenTitles = {};
  const money = () => { const x = calcItem();
    return [Math.round(x.buy||0), Math.round(x.target||0), Math.round(x.resale||0)].join("/"); };

  const probe = (cat, item, model, row) => {
    const reset = () => {
      st.mode="item"; st.flow="ask"; st.catId=cat.id; st.itemId=item.id; st.picked=true;
      st.brand="mid"; st.brandTyped=""; st.brandSet=false; st.brandQ="";
      st.model=model||""; st.mpNone=false; st.mpPin=row?{id:row[0],model:model}:null;
      st.detail=""; st.bookName=""; st.specSel={}; st.market=null;
      st.cond="good"; st.condSet=false; st.complete=true; st.completeSet=false;
      st.liq=null; st.askAt=0; st.askFrom=null;
    };
    reset();
    const x0 = calcItem();
    if (row && !x0.checked) return;            /* the row is not driving this price */
    const out = [];
    for (const z of askQueue(x0)) {
      if (z.id==="worth" || z.id==="extra" || z.kind==="model") continue;
      const seen = new Set(); let tried = 0, label = z.title;
      if (z.id === "brand") {
        for (const b of ["hi","mid","lo"]) { reset(); st.brand=b; st.brandSet=true; seen.add(money()); tried++; }
      } else if (z.id === "cond") {
        for (const c of CONDITIONS) { reset(); st.cond=c.id; st.condSet=true; seen.add(money()); tried++; }
      } else if (z.id === "complete") {
        for (const v of [true,false]) { reset(); st.complete=v; st.completeSet=true; seen.add(money()); tried++; }
      } else if (/^spec:/.test(z.id)) {
        const gi = Number(z.id.split(":")[1]);
        const g = (SPEC_CHOICES[item.id]||[])[gi]; if (!g) continue;
        label = g.label;
        g.options.forEach((o, oi) => { reset(); st.specSel[item.id+":"+gi]=oi; seen.add(money()); tried++; });
      } else continue;
      seenTitles[label] = true;
      if (tried > 1 && seen.size === 1)
        out.push({cat:cat.id, item:item.id, itemName:item.name, label,
                  model:model||"", row:row?row[0]:"", value:[...seen][0], tried});
    }
    dead.push(...out);
  };

  let items = 0, rows = 0;
  for (const c of CATALOG) for (const i of c.items) { items++; probe(c, i, "", null); }
  for (const r of MODEL_PRICES) {
    const ref = String(r[1]).split("|")[0];
    let cat=null, item=null;
    for (const c of CATALOG) for (const i of c.items) if (i.id===ref) { cat=c; item=i; }
    if (!cat) continue;
    rows++; probe(cat, item, r[2], r);
  }
  return {dead, items, rows, titles:Object.keys(seenTitles).length};
});

console.log(`\n  swept ${sweep.items} catalog items and ${sweep.rows} book rows, ${sweep.titles} distinct questions`);
/* THE GUARD ON THE GUARD. A sweep that probed nothing would report no dead
   questions and pass every assertion under it. */
ok(sweep.items > 60 && sweep.rows > 300 && sweep.titles > 40,
   `  the sweep actually ran — ${sweep.items} items, ${sweep.rows} rows, ${sweep.titles} questions`);

const byLabel = {};
for (const d of sweep.dead) (byLabel[d.label] = byLabel[d.label] || []).push(d);
const unexplained = Object.keys(byLabel).filter(l => !ALLOWED[l]);

console.log("\n  every question the counter answers reaches the money");
ok(unexplained.length === 0,
   unexplained.length
     ? `  ${unexplained.length} question(s) collect an answer and discard it: `
       + unexplained.map(l => `"${l}" on ${byLabel[l].length} (e.g. ${byLabel[l][0].itemName}`
           + `${byLabel[l][0].model?" / "+byLabel[l][0].model:""}, ${byLabel[l][0].tried} options all ${byLabel[l][0].value})`).join("; ")
     : `  no question discards an answer — ${sweep.dead.length} exempt, all three named below`);

/* ── the exemptions, each one earning itself ───────────────────────────── */
console.log("\n  and the three that do not are doing their job another way");

const proof = await page.evaluate(() => {
  const out = {};
  const put = (catId, itemId, model, rowId) => {
    st.mode="item"; st.flow="ask"; st.catId=catId; st.itemId=itemId; st.picked=true;
    st.brand="mid"; st.brandTyped=""; st.brandSet=false; st.model=model||"";
    st.mpNone=false; st.mpPin=rowId?{id:rowId,model}:null; st.detail=""; st.bookName="";
    st.specSel={}; st.market=null; st.cond="good"; st.condSet=false;
    st.complete=true; st.completeSet=false; st.liq=null; st.askAt=0;
  };
  /* 1. The make. It is inside the measured figure, so the question is ticked
        rather than outstanding - and it is still in the run, still reachable,
        because the make is part of what chose the row. */
  const sat = MODEL_PRICES.find(r => r[2] === "Sega Saturn");
  put("elec","e5c","Sega Saturn",sat[0]);
  /* firstOpenAsk is what omniPick calls to decide where the run starts;
     reading st.askAt straight after put() would only read the 0 put() just
     wrote, which is a question asking itself. */
  st.askAt = firstOpenAsk(calcItem());
  const x = calcItem(), q = askQueue(x);
  const bq = q.find(z => z.id === "brand");
  out.make = {checked:!!x.checked, present:!!bq, answered:!!(bq&&bq.answered),
              auto:!!(bq&&bq.auto), moot:!!(bq&&bq.tierMoot),
              opensOn:(q[st.askAt]||{}).id};

  /* 2. The special edition. No multiplier on purpose; the option has to say
        so in words, or it is just a dead option. */
  const g = SPEC_CHOICES.e5c.find(g => g.label === "Plain one, or special?");
  out.variant = {mults:g.options.map(o=>o.m),
                 notes:g.options.map(o=>o.note||"").join(" ")};

  /* 3. No title. Not a discount - a stop. */
  const t = SPEC_CHOICES.r2.find(g => g.label === "Title");
  const noT = t.options.find(o => /no title/i.test(o.t));
  out.title = {mults:t.options.map(o=>o.m), stop:!!(noT&&noT.stop), note:(noT&&noT.note)||""};

  /* And the stop has to actually stop something on the screen. */
  put("rolling","r2","Honda Rancher 420",(MODEL_PRICES.find(r=>r[2]==="Honda Rancher 420")||[])[0]);
  const gi = SPEC_CHOICES.r2.findIndex(g => g.label === "Title");
  st.specSel["r2:"+gi] = t.options.findIndex(o => /no title/i.test(o.t));
  /* MID-RUN, not at the end. The banner used to live only on the finished
     card, so this read false with the run still going and seven questions
     still to answer. */
  st.askAt = firstOpenAsk(calcItem());
  render();
  out.title.midRunAt = st.askAt;
  out.title.onScreen = document.body.innerText.replace(/\s+/g," ");
  return out;
});

ok(proof.make.checked && proof.make.present && proof.make.answered && proof.make.moot,
   `  the make stays in the run and is marked settled, not asked — present ${proof.make.present}, answered ${proof.make.answered}`);
ok(proof.make.opensOn !== "brand",
   `  so the run opens somewhere that can move the number — ${proof.make.opensOn}`);
ok(proof.variant.mults.every(m => m === 1) && /look this one up/i.test(proof.variant.notes)
   && /1\.7x to 4\.4x/i.test(proof.variant.notes),
   "  a special edition carries no multiplier AND says to look it up, with the spread that makes guessing wrong");
ok(proof.title.stop && /no deal/i.test(proof.title.note),
   `  no title is a stop, not a discount — stop:${proof.title.stop}, "${proof.title.note}"`);
ok(/no deal/i.test(proof.title.onScreen) && proof.title.midRunAt > 0,
   `  and the stop is on the screen while the run is still going \u2014 sitting on question ${proof.title.midRunAt + 1}`);

/* ── and the arithmetic that was wrong, asserted directly ──────────────── */
console.log("\n  the specification reaches a measured price");
const arith = await page.evaluate(() => {
  const r = MODEL_PRICES.find(x => x[2] === "Sega Saturn");
  const put = () => { st.mode="item"; st.flow="ask"; st.catId="elec"; st.itemId="e5c"; st.picked=true;
    st.brand="mid"; st.brandTyped=""; st.brandSet=false; st.model="Sega Saturn"; st.mpNone=false;
    st.mpPin={id:r[0],model:"Sega Saturn"}; st.detail=""; st.bookName=""; st.specSel={};
    st.market=null; st.cond="good"; st.condSet=false; st.complete=true; st.completeSet=false; st.liq=null; };
  const buy = () => Math.round(calcItem().buy||0);
  const gi = SPEC_CHOICES.e5c.findIndex(g => g.label === "What came with it");
  const gb = SPEC_CHOICES.e5c.findIndex(g => g.label === "Box and papers");
  put(); const neutral = buy();
  put(); st.specSel["e5c:"+gi] = 2; const bare = buy();          /* console alone, x0.6 */
  put(); st.specSel["e5c:"+gb] = 2; const cib  = buy();          /* complete in box, x1.6 */
  put(); const checked = !!calcItem().checked;
  return {neutral, bare, cib, checked};
});
ok(arith.checked, "  the Saturn is priced off its measured row");
ok(arith.bare < arith.neutral && arith.cib > arith.neutral,
   `  and what came with it moves that price — bare $${arith.bare}, standard $${arith.neutral}, complete in box $${arith.cib}`);

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
