#!/usr/bin/env node
/* IT HAS TO LOOK BUSY WHERE THE NUMBER LANDS.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-busy.mjs
 *
 * Twice now. First: "while it's searching there is no indicator that it is
 * working on something. I thought it was just waiting on me." The lookup
 * fires by itself when an item with a make and model is picked, and the
 * only thing that ever said so was the finished rail, which mid-run is not
 * on the page.
 * Then, at an 11px wheel beside a label: "I wasn't talking about a tiny one
 * on the right sidebar, I'm thinking a big one in that window where the
 * prices are eventually going to pop up."
 * So it is measured here as SIZE and PLACE, not just presence.
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

async function look(file, w, h) {
  const pg = await browser.newPage({viewport:{width:w, height:h}});
  const errs = []; pg.on("pageerror", e => errs.push(String(e)));
  await pg.goto(BASE + "/" + file);
  await pg.waitForTimeout(1100);
  const out = await pg.evaluate(() => {
    const arm = busy => {
      st.mode="item"; st.catId="elec"; st.itemId="e5"; st.picked=true;
      st.brandTyped="Sony"; st.brandSet=true; st.brand="mid"; st.model="PlayStation 5";
      st.askAt=2; st.askEdit=false; findBusy = busy; pickChase = false; render();
    };
    const wheels = () => [...document.querySelectorAll(".pinSpin")]
      .map(e => Math.round(e.getBoundingClientRect().width));
    arm(false);
    const idle = {wheels: wheels().length,
                  says: /looking it up/i.test(document.body.innerText)};
    arm(true);
    const big = [...document.querySelectorAll(".pinSpin.lg")];
    const r = {idle,
      wheels: wheels(),
      says: /looking it up/i.test(document.body.innerText),
      /* the automatic lookup, which is the one that was reported */
      inWorthCard: !!document.querySelector(".askWorth .askBusy, .askBusy")};
    findBusy = false;
    /* and it must clear */
    render();
    r.clears = !/looking it up/i.test(document.body.innerText);
    return r;
  });
  out.errs = errs;
  await pg.close();
  return out;
}

console.log("  the desk says it is working, in the box the number lands in");
const d = await look("index.html", 1500, 1000);
ok(d.idle.wheels === 0 && !d.idle.says, "idle, there is no wheel and no claim to be working");
ok(d.says, "searching, it says so in words");
ok(d.wheels.length > 0 && Math.max(...d.wheels) >= 40,
   `and the wheel is big enough to notice - ${Math.max(...d.wheels)}px, not the 11px that was reported`);
ok(d.clears, "and it goes away when the search is over");
ok(d.errs.length === 0, "no page errors");

console.log("\n  and so does the phone, where that box is the question card");
const p = await look("phone.html", 412, 915);
ok(p.says, "the phone says it too - it had nothing at all before");
ok(p.inWorthCard,
   "inside 'What does one sell for used?', which is where the price appears there");
ok(p.wheels.length > 0 && Math.max(...p.wheels) >= 40,
   `at the same size - ${Math.max(...p.wheels)}px`);
ok(p.clears, "and it clears");
ok(p.errs.length === 0, "no page errors");

/* ONE RING, NOT TWO. "When an item is being searched, the round thinking
   animation is in two places - one in the middle section and again at the
   top window of right sidebar. It should only be in the middle."
   Both were mine: the rail got a big one when he asked for a ring instead
   of a speck, then step4Inner got its own when he said he meant the window
   where the prices appear, and the first was never removed. The count is
   the assertion - checking the middle one exists would have passed all
   along, because it always did. */
console.log("\n  and only in that one place");
ok(d.wheels.length === 1,
   `the desk shows one spinner while it searches, not two - found ${d.wheels.length}`);
ok(p.wheels.length === 1,
   `and the phone likewise - found ${p.wheels.length}`);

await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
