#!/usr/bin/env node
/* WHAT KILLS IT HAS TO BE ON THE PHONE TOO.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-phone-killer.mjs
 *
 * The phone is not a small desk. It is the screen he carries into yard
 * sales, clearance racks and other shops, and there he is BUYING, not
 * lending. The number the hero shows him is "pay up to $X", and the one
 * thing that turns that into a $0 paperweight is the killer: an
 * activation or BIOS password nobody can clear, a board that will not
 * post, a proprietary battery that is missing. The desk has carried that
 * line since the PlayStation report. The phone never did, which meant the
 * warning was on the screen he uses least for buying and absent from the
 * one he uses most.
 *
 * phone.html already loads app.js and app.css, so this is the desk's own
 * killerHTML and the desk's own .killCard styling - one call site, not a
 * second copy to drift out of step.
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

/* A priced PlayStation, the item the killer line was written for. The run
   has to be FINISHED - askAt past the end of the queue - or both surfaces
   are still asking questions and neither shows an offer. */
async function priced(file, w, h){
  const pg = await browser.newPage({viewport:{width:w, height:h}});
  const errs = []; pg.on("pageerror", e => errs.push(String(e)));
  await pg.goto(BASE + "/" + file);
  await pg.waitForTimeout(900);
  const out = await pg.evaluate(() => {
    st.mode="item"; st.catId="elec"; st.itemId="e5"; st.picked=true;
    st.cond="good"; st.condSet=true; st.complete=true; st.completeSet=true;
    st.brandTyped="Sony"; st.model="PlayStation 5";
    st.market={kind:"found", key:mkKey(), mid:380, lo:200, hi:560, n:11, sold:0,
               note:"11 listings, asking prices - no sold data"};
    (SPEC_CHOICES[st.itemId]||[]).forEach((g,gi)=>{ st.specSel[st.itemId+":"+gi]=specBase(g); });
    st.askEdit=false; st.askAt=askQueue(calcItem()).length-1;
    render();
    /* The desk shows .killCard. The phone hangs the same two strings off
       the line it already spends on "Shape it is in", so there it is a
       .phKill fold - open it and read it, the way he would. */
    const ph = document.querySelector(".phKill");
    if (ph) ph.open = true;
    const card = document.querySelector(".killCard, .phKill");
    const doc  = document.documentElement;
    return {build: APP_BUILD, card: !!card, fold: !!ph,
            text: card ? card.innerText.replace(/\s+/g," ") : "",
            /* closed, it must cost the screen nothing */
            shutOver: ph ? (() => { ph.open = false;
                const o = doc.scrollHeight - window.innerHeight;
                ph.open = true; return o; })() : 0};
  });
  out.errs = errs;
  await pg.close();
  return out;
}

const d = await priced("index.html", 1500, 1000);
const p = await priced("phone.html",  412,  915);

console.log("  the warning that stops a bad buy is on the screen he buys from");
ok(d.card, `the desk still carries it (build ${d.build})`);
ok(p.card, `and now the phone does too (build ${p.build})`);
ok(/what kills it/i.test(p.text),  "it names what kills it, not just what sets the price");
ok(/what sets the price/i.test(p.text), "and what sets the price, so it is not only bad news");
ok(!/activation lock/i.test(p.text) && /controller|HDMI|disc/i.test(p.text),
   "and it is the PlayStation's killer, not the phone aisle's");
ok(p.fold, "on the phone it is the condition line itself, not a card of its own");
ok(p.shutOver <= 4, `and closed it costs the screen nothing (${p.shutOver}px)`);
ok(p.errs.length === 0 && d.errs.length === 0, "no page errors on either surface");
ok(d.build === p.build, "both surfaces on the same build");

await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
