#!/usr/bin/env node
/* THE MAKE QUESTION HAS TO BE ONE HE CAN ANSWER.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-tiers.mjs
 *
 * "lets get back to the mobile buying functions." Measured twelve things
 * off a driveway, counting taps from picking it to a number on the
 * screen, and two of them could not get one because the make question was
 * unanswerable:
 *
 *   Weber kettle grill  offered  Speed Queen / Sub-Zero / Bosch
 *                                Whirlpool / Maytag / LG / Samsung / GE
 *                                Kenmore / Frigidaire / Amana / Hotpoint
 *   Coleman cooler      offered  Leupold / Vortex / Zeiss
 *                                Bushnell / Nikon
 *                                Tasco / no name
 *
 * Washing-machine brands for a grill and rifle-scope brands for a cooler,
 * because tiers belonged to the AISLE and an aisle holds many kinds of
 * thing. Weber is the premium grill name and was on none of the three
 * lists; Yeti is the cooler everything else is measured against and was
 * on none either. He cannot answer, so the run cannot finish, so there is
 * no price - standing in a driveway.
 *
 * This suite is the rule, not the two examples: type what the counter
 * types, and the make must either resolve to a tier by itself or be a
 * tier he can see and tap. A row where the maker does not move the price
 * turns the question off instead, and that counts as answerable too.
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

/* What he types, and the make inside it. Every one of these is a thing
   that turns up at a yard sale in this county, and the make is a name a
   person would actually say out loud. */
const FIELD = [
  ["Weber kettle grill", "Weber"],
  ["Traeger pellet smoker", "Traeger"],
  ["Blackstone griddle", "Blackstone"],
  ["Yeti cooler", "Yeti"],
  ["Coleman cooler", "Coleman"],
  ["Vitamix blender", "Vitamix"],
  ["Ninja air fryer", "Ninja"],
  ["Keurig coffee maker", "Keurig"],
  ["La-Z-Boy recliner", "La-Z-Boy"],
  ["Shure vocal mic", "Shure"],
  ["Bach trumpet", "Bach"],
  ["Selmer alto saxophone", "Selmer"],
  ["Gemeinhardt flute", "Gemeinhardt"],
  ["Pearl drum set", "Pearl"],
  ["Roland keyboard", "Roland"],
  ["Kala ukulele", "Kala"],
  ["Simms waders", "Simms"],
  ["Pelican hard gun case", "Pelican"],
  ["Garmin fish finder", "Garmin"],
  ["Hobie kayak", "Hobie"],
  ["Lone Wolf climbing tree stand", "Lone Wolf"],
  ["Aimpoint red dot sight", "Aimpoint"],
  ["Storm bowling ball", "Storm"],
  ["Element skateboard", "Element"],
];

const browser = await chromium.launch({executablePath: EXE});
const errs = [];
const pg = await browser.newPage({viewport: {width: 390, height: 844}});
pg.on("pageerror", e => errs.push(String(e)));
await pg.goto(BASE + "/phone.html", {waitUntil: "networkidle"});
await pg.waitForTimeout(800);

console.log("\n  what he types, and whether the make question can be answered");
const out = [];
for (const [typed, make] of FIELD) {
  await pg.goto(BASE + "/phone.html", {waitUntil: "networkidle"});
  await pg.waitForTimeout(500);
  await pg.fill("#omniIn", typed);
  await pg.waitForTimeout(350);
  const row = pg.locator('#omniList [data-omni="0"]');
  if (!await row.count()) { out.push({typed, make, noRow: true}); continue; }
  await row.click();
  await pg.waitForTimeout(400);
  out.push(Object.assign({typed, make}, await pg.evaluate(mk => {
    const x = calcItem(), Q = askQueue(x);
    const b = Q.find(z => z.id === "brand");
    const BR = brandOf(x.cat);
    const tiers = BR.on ? [BR.hi, BR.mid, BR.lo].join(" | ") : "";
    /* The make counts as answerable when the desk resolved it by itself,
       OR when it is sitting in one of the three tiers on screen for him
       to tap, OR when the row says the maker does not matter here. */
    const low = tiers.toLowerCase();
    return {row: st.bookName || displayName(x), cat: x.cat.label,
            brandOn: !!BR.on, named: b ? b.named : null,
            inTiers: low.indexOf(String(mk).toLowerCase()) >= 0,
            open: b ? !(b.answered || b.optional) : false,
            tiers};
  }, make)));
}

for (const r of out) {
  if (r.noRow) { ok(false, `${r.typed} — nothing to pick in the search box`); continue; }
  const answerable = !r.brandOn || !!r.named || r.inTiers;
  ok(answerable,
     `${r.make} on "${r.row}" — ${!r.brandOn ? "the maker does not price this one"
       : r.named ? `read as ${r.named}`
       : r.inTiers ? "on the list to tap"
       : `NOT on any tier: ${r.tiers}`}`);
}

console.log("\n  and the rule, not the examples");
const bad = out.filter(r => !r.noRow && r.brandOn && !r.named && !r.inTiers);
ok(bad.length === 0,
   `${out.length - bad.length} of ${out.length} makes are answerable where they land`);
/* A suite that passed by turning every brand question off would be worse
   than the bug. Most of these must still ASK, and resolve. */
const resolved = out.filter(r => r.named).length;
ok(resolved >= Math.round(out.length * 0.6),
   `  and ${resolved} of ${out.length} resolve with no tap at all, so this is not a suite passed by switching the question off`);

/* THE TWO THAT STARTED IT, BY NAME, so a regression says which. */
console.log("\n  the two off the driveway that could not be answered");
for (const mk of ["Weber", "Coleman"]) {
  const r = out.find(z => z.make === mk);
  /* The message said "tappable" on a FAILURE, because it only looked at
     `named`. A red line that describes the passing case is a red line
     somebody argues with instead of fixing. */
  ok(!!r && (r.named || r.inTiers),
     `  ${mk} on "${r && r.row}" — ${!r ? "no row"
       : r.named ? "reads as " + r.named
       : r.inTiers ? "tappable"
       : "NOT on any tier: " + r.tiers}`);
}

ok(errs.length === 0, "\n  no page errors" + (errs.length ? ": " + errs[0] : ""));
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall good");
process.exit(fails ? 1 : 0);
