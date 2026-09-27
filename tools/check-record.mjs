#!/usr/bin/env node
/* THE RECORD ANSWERS WHAT IT KNOWS, AND SAYS THAT IT DID.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-record.mjs
 *
 * "Shouldn't the tool already know the answer to this question? If we're
 * going to have a database the database needs to cover not just bits and
 * pieces of the item, it needs to be a complete record for the item for
 * every question that we're going to ask."
 *
 * Reported on a Husqvarna 450 the book knows by name, quotes $210-290 for,
 * and then asks what grade of saw it is. A 450 Rancher is a farm saw -
 * that is a fact about every one ever made, not about the one on the
 * counter. The book was nine fields and all nine were about the price.
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

const r = await page.evaluate(() => {
  const setup = pin => { startOver();
    st.mode="item"; st.catId="power"; st.itemId="p1"; st.picked=true;
    st.brandTyped="Husqvarna"; st.brandSet=true; st.brand="mid"; st.model="450 Rancher";
    st.specSel={}; st.mpPin = pin ? {id:"c7", model:"450 Rancher"} : null;
    st.cond="good"; st.condSet=true; st.complete=true; st.completeSet=true;
    render(); };
  const labels = () => askQueue(calcItem()).map(z => z.title);
  setup(false);
  const cold = {asked: labels(), mult: +(calcItem().spec.mult).toFixed(3)};
  setup(true);
  const warm = {asked: labels(), mult: +(calcItem().spec.mult).toFixed(3),
                said: Object.values(specFromRecord)};
  /* FINISH THE RUN, because the disclosure lives on the answer card and
     mid-run there is no answer card to carry it. */
  setup(true);
  st.market={kind:"found", key:mkKey(), mid:250, lo:210, hi:290, n:9, sold:9, basis:"sold", comps:[]};
  /* "Does it start?" is about THIS saw, so the record does not answer it
     and the fixture must - otherwise the run cannot finish and the answer
     card that carries the disclosure never renders. */
  st.specSel["p1:0"]=0;
  st.askEdit=false; st.askAt=askQueue(calcItem()).length-1; render();
  warm.finished = runFinished(calcItem());
  warm.unanswered = askQueue(calcItem()).filter(z=>!z.answered).map(z=>z.id);
  warm.onScreen = /from the record/i.test(document.body.innerText);
  warm.hasUndo  = !!document.getElementById("recUndo");
  /* and pressing it really does put the questions back, through the UI */
  const btn=document.getElementById("recUndo");
  if(btn){ btn.click(); }
  warm.afterUndo = askQueue(calcItem()).map(z=>z.title);
  warm.undoSaid  = Object.values(specFromRecord);
  /* and it belongs to the model, so it goes when the model does */
  setup(true);
  st.mpPin = null; render();
  const gone = {said: Object.values(specFromRecord), asked: labels()};
  /* a renamed option must fall back to asking, never set the wrong answer */
  const bad = (() => { const keep = MODEL_SPEC.c7;
    MODEL_SPEC.c7 = {"Grade":"Ranch-ish", "Bar length":"16–18 in"};
    setup(true); const out = Object.values(specFromRecord);
    MODEL_SPEC.c7 = keep; return out; })();
  return {cold, warm, gone, bad};
});

console.log("  a model the book knows by name is not asked what it is");
ok(r.cold.asked.some(t => /grade/i.test(t)), "without the record, Grade is asked");
ok(!r.warm.asked.some(t => /grade/i.test(t)), "with it, Grade is not");
ok(!r.warm.asked.some(t => /bar length/i.test(t)), "and neither is Bar length");
ok(r.cold.asked.length - r.warm.asked.length === 2,
   `two questions fewer - ${r.cold.asked.length} down to ${r.warm.asked.length}`);
ok(r.warm.asked.some(t => /shape|start|all there/i.test(t)),
   "but what shape it is in is still asked, because that IS about this one");

console.log("\n  and it still counts, and still shows");
ok(r.warm.mult > r.cold.mult,
   `the answers feed the arithmetic - spec multiplier ${r.cold.mult} to ${r.warm.mult}`);
ok(r.warm.said.length === 2 && r.warm.onScreen,
   "the screen names what the record supplied - " + r.warm.said.join(" / "));
ok(r.warm.hasUndo, "and that line is the way back in, not just a notice");
ok(r.warm.afterUndo.some(t => /grade/i.test(t)) && r.warm.afterUndo.some(t => /bar length/i.test(t)),
   "pressing it puts both questions back in the run - " + r.warm.afterUndo.length + " questions");
ok(r.warm.undoSaid.length === 0, "and the record stops claiming to have answered them");

console.log("\n  and it does not outlive what it describes");
ok(r.gone.said.length === 0 && r.gone.asked.some(t => /grade/i.test(t)),
   "drop the model and the facts go with it, and Grade is asked again");
ok(r.bad.length === 1,
   "a fact naming an option that no longer exists is dropped, not forced onto the nearest one - "
   + r.bad.length + " of 2 applied");

ok(errs.length === 0, "no page errors");
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
