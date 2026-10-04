#!/usr/bin/env node
/* WHERE A TYPED NUMBER CAME FROM.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-handsrc.mjs
 *
 * "when you type a price in, you pick where you got it."
 *
 * Every typed figure used to be recorded the same way - kind "hand", a
 * number, nothing else - and evidenceTier called all of them COUNTED, the
 * same tier as twelve counted eBay sales. A price off the top of his head
 * and a price off a sold page were the same record.
 *
 * This suite walks the real screen on both surfaces. It types into the
 * search box, taps the row, opens the typing box, types a number, taps a
 * source, and reads the record and the sentence out of the DOM. It calls
 * handMarket in one place only - to check what the screen writes against
 * what the helper writes - and never to stand in for a tap.
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
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails = 0;
const ok = (c, m) => { console.log((c ? "  ok    " : "  FAIL  ") + m); if (!c) fails++; };

const browser = await chromium.launch({executablePath: EXE});
const errs = [];

/* The five sources and what tier each one is worth. The whole point of the
   feature is that these are not all the same, so the suite names them
   rather than reading them back out of the app it is checking. */
const WANT = {mine: "counted", bravo: "counted", sold: "counted",
              ask: "sourced", gut: "none"};

async function surface(file, w, h) {
  const pg = await browser.newPage({viewport: {width: w, height: h}});
  pg.on("pageerror", e => errs.push(file + ": " + e));
  await pg.goto(BASE + "/" + file, {waitUntil: "networkidle"});
  await pg.waitForTimeout(800);
  await pg.fill("#omniIn", "Weber kettle grill");
  await pg.waitForTimeout(450);
  const row = pg.locator('#omniList [data-omni="0"]');
  if (!await row.count()) { await pg.close(); return null; }
  await row.click();
  await pg.waitForTimeout(500);

  /* Stand on the question the box belongs to and open the box, the way
     tapping "Type my own number" does. */
  const open = async () => {
    await pg.evaluate(() => {
      /* The market comes off FIRST. Computing the queue while a figure is
         still on the record gives a different queue, so askAt landed on
         the wrong question on every pass after the first and the box was
         not there - which read as the app failing when it was the probe. */
      st.market = null;
      const q = askQueue(calcItem());
      const i = q.findIndex(z => z.id === "worth");
      if (i >= 0) st.askAt = i;
      st.editing = true; render();
    });
    await pg.waitForTimeout(300);
  };
  await open();

  const out = {btns: await pg.locator("[data-handsrc]").count(),
               box: await pg.locator("#valIn, #nsVal, #phVal").count(),
               /* A leftover button that saves with no source would undo
                  the whole thing quietly, so the suite looks for the ones
                  that used to do it by name. */
               oldSave: await pg.evaluate(() =>
                 ["valSave", "nsValGo", "phValGo"].filter(i => !!document.getElementById(i))),
               each: {}};

  for (const id of Object.keys(WANT)) {
    await open();
    const box = pg.locator("#valIn, #nsVal, #phVal").first();
    if (!await box.count()) break;
    await box.fill("120");
    const b = pg.locator(`[data-handsrc="${id}"]`).first();
    if (!await b.count()) break;
    await b.click();
    await pg.waitForTimeout(350);
    out.each[id] = await pg.evaluate(() => {
      const x = calcItem(), m = x.market || {};
      /* The sentence has to be ON a card that is on the screen, not just
         returned by a function. Find the card weightHTML draws and check
         the document actually holds it. */
      const html = (typeof weightHTML === "function") ? String(weightHTML(x) || "") : "";
      const cls = (html.match(/class="([a-zA-Z0-9_ -]+)"/) || [])[1];
      const onScreen = cls ? !!document.querySelector("." + cls.split(" ")[0]) : false;
      return {kind: m.kind, src: m.src, date: m.date, mid: m.mid,
              tier: evidenceTier(x),
              resale: Math.round(x.resale), buy: x.buy, lend: x.target,
              onScreen, says: html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()};
    });
  }

  /* And what the helper writes, so three boxes cannot drift into three
     shapes again. */
  out.helper = await pg.evaluate(() => {
    const m = handMarket(120, "bravo");
    return {keys: Object.keys(m).sort().join(","), src: m.src, kind: m.kind};
  });
  await pg.close();
  return out;
}

const PHONE = await surface("phone.html", 390, 844);
const DESK  = await surface("index.html", 1500, 1000);

for (const [name, s] of [["the phone", PHONE], ["the desk", DESK]]) {
  console.log(`\n  ${name}: the question asks where the figure came from`);
  ok(!!s, `${name} reaches the item at all`);
  if (!s) { fails += 8; continue; }
  ok(s.box > 0, `  the typing box is there`);
  ok(s.btns === 5, `  and five sources under it, not a Save button (${s.btns})`);
  /* THE ASSERTION THAT KEEPS THIS HONEST. */
  ok(s.oldSave.length === 0,
     `  no button left that saves a figure with no source${s.oldSave.length ? " — " + s.oldSave.join(", ") : ""}`);
  ok(s.helper.keys === "date,key,kind,mid,src",
     `  one writer, carrying the source and the date — ${s.helper.keys}`);

  const got = Object.keys(s.each);
  ok(got.length === 5, `  all five record something (${got.length})`);
  for (const id of got) {
    const r = s.each[id];
    ok(r.kind === "hand" && r.src === id && /^\d{4}-\d\d-\d\d$/.test(String(r.date || "")),
       `  ${id} — recorded as ${r.src}, dated ${r.date}`);
    ok(r.tier === WANT[id], `    and worth tier "${r.tier}", wanted "${WANT[id]}"`);
    ok(r.onScreen, `    its card is on the screen, not just in a function`);
  }
  /* A guess must not read as verified, and a sale must. */
  if (got.length === 5) {
    ok(s.each.gut.tier === "none" && s.each.sold.tier === "counted",
       "  a guess and a sold price are no longer the same record");
    /* Each source says something different, or the feature is a no-op. */
    const said = new Set(got.map(id => s.each[id].says.slice(0, 90)));
    ok(said.size === 5, `  and each one says something different on the card (${said.size} of 5)`);
    ok(/asks run high|ceiling/i.test(s.each.ask.says),
       "  an asking price is called a ceiling");
    ok(/bravo/i.test(s.each.bravo.says), "  Bravo's figure is named as Bravo's");
  }

  /* THIS MOVES NO MONEY, AND THAT IS A CLAIM A TEST CAN HOLD. */
  console.log(`\n  ${name}: and none of it moves the money`);
  if (got.length === 5) {
    const a = s.each[got[0]];
    ok(got.every(id => s.each[id].resale === a.resale),
       `  resale is ${a.resale} whichever source it came from`);
    ok(got.every(id => s.each[id].buy === a.buy), `  buy is ${a.buy} on all five`);
    ok(got.every(id => s.each[id].lend === a.lend), `  lend is ${a.lend} on all five`);
  } else fails += 3;
}

/* Both surfaces must agree. The desk growing a field the phone lacks is
   this repo's oldest and most repeated bug. */
console.log("\n  the two surfaces agree");
if (PHONE && DESK && Object.keys(PHONE.each).length === 5 && Object.keys(DESK.each).length === 5) {
  ok(Object.keys(WANT).every(id => PHONE.each[id].tier === DESK.each[id].tier),
     "  the same source is worth the same tier on both");
  ok(PHONE.helper.keys === DESK.helper.keys,
     "  and both write the same record shape");
} else fails += 2;

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
