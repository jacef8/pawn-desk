#!/usr/bin/env node
/* THE DESIGN DIRECTIVE, AS ASSERTIONS.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-design.mjs
 *
 * "update the design with the new design directive." Then, on the first
 * pass: "kind of boring." Then, on the second: "yeah thats better, roll it
 * out everywhere."
 *
 * The directive's hard numbers are the ones a counter feels:
 *
 *   2.1  no see-through panels - text over a blurred backdrop reads muddy
 *   2.2  body 15px+, secondary 14px+, 12px only for SHORT UPPERCASE labels
 *   2.4  every tap target 44x44, including the invisible part
 *   2.9  motion 150-300ms, and off under prefers-reduced-motion
 *   2.11 no alert() or confirm(), one icon set, scrollbars styled
 *
 * WHY THIS SUITE EXISTS RATHER THAN A NOTE IN DESIGN.MD. Rolling the
 * directive out took four sweeps because each one measured LESS than it
 * reported:
 *
 *   sweep 1  grepped the stylesheets          missed 80 inline sizes in JS
 *   sweep 2  measured the page it opens to    missed 499 across other tabs
 *   sweep 3  measured one viewport            missed a whole media query
 *   sweep 4  measured element boxes           called a 44px hit area 18px
 *
 * Every one of those came back "0 violations" and every one of them was
 * wrong. So this walks EVERY tab on BOTH surfaces at FOUR sizes, reads
 * what the browser actually computed rather than what the CSS says, and
 * probes the hit areas by hit-testing instead of by measuring boxes.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
import {readFileSync} from "node:fs";
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

/* ── the two files, read as text ──────────────────────────────────────── */
const css = readFileSync("app.css", "utf8") + readFileSync("phone.css", "utf8");
const js  = readFileSync("app.js",  "utf8") + readFileSync("phone.js",  "utf8");

console.log("\n  what the source says");

/* 2.1 - and the point is the DECLARATION, not the computed value. A
   backdrop-filter resolving to none still tells the next person that
   see-through panels are the house style here. */
ok(!/backdrop-filter\s*:\s*(?!none)/.test(css),
   "no backdrop-filter anywhere — 2.1, cards are solid");

/* 2.11 - and a comment mentioning alert() must not trip it, which the
   first version of this line did. Only a CALL counts. */
/* strip comments first: this file's own note about replacing alert()
   tripped the check, which would have taught the next person to ignore
   a red line here. */
const code = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const calls = code.match(/(^|[^.\w])(alert|confirm)\s*\(/g) || [];
ok(calls.length === 0,
   `no browser pop-ups — 2.11, found ${calls.length}`);

/* 2.9 - nothing animates for longer than 300ms. Written as a scan of
   every duration in the stylesheets rather than a spot check, because the
   one that broke this rule was a .40s card entrance I wrote myself. */
/* The rule is about a CONTROL answering a tap, so it reads transitions
   and the entrance animations - not the ambient drift behind the panels
   (34s on purpose) nor flashTo, the 1.3s "here is the card you were just
   sent to" marker, which is a wayfinding cue and not an interaction. */
/* pinSpin is a loading spinner: an infinite rotation has a period, not a
   duration, and the 150-300ms rule is about a control answering a tap. */
const AMBIENT = /drift|sheen|beat|flashTo|pulse|riseIn|pinSpin|vtIn|vtOut/i;
const longMotion = [...css.matchAll(/(?:animation|transition)\s*:([^;{}]*)/g)]
  .filter(m => !AMBIENT.test(m[1]))
  .flatMap(m => [...m[1].matchAll(/([0-9.]+)s\b/g)].map(x => parseFloat(x[1])))
  .filter(v => v > 0.3 && v < 30);
ok(longMotion.length === 0,
   `every animation is 300ms or under — 2.9, over: ${longMotion.join(", ") || "none"}`);

ok(/@media\s*\(prefers-reduced-motion\s*:\s*reduce\)/.test(css),
   "motion is turned off under prefers-reduced-motion — 2.9");

ok(/scrollbar-color\s*:/.test(css) && /::-webkit-scrollbar-thumb/.test(css),
   "scrollbars are styled in the project's own colours — 2.11");

/* THE ENTRANCE MUST NOT BE ABLE TO LEAVE A CARD BLANK.
   Written the wrong way round first: .rise{opacity:0} with a forwards
   animation, which is a card that stays invisible for good if the
   animation never runs - and it read as 1:1 contrast to check-screens. */
const riseRule = (css.match(/\.rise\{[^}]*\}/) || [""])[0];
ok(!/opacity\s*:\s*0\b/.test(riseRule),
   "the card entrance starts from a VISIBLE base state — a blank card is not a loading state");

/* ── the rendered page ────────────────────────────────────────────────── */
const browser = await chromium.launch({executablePath: EXE});
const SIZES = [["phone.html", 390, 844, "phone"], ["phone.html", 360, 780, "small phone"],
               ["index.html", 1440, 900, "desk"],  ["index.html", 1100, 820, "narrow desk"]];

const TYPE = () => {
  const out = [];
  document.querySelectorAll("*").forEach(el => {
    let own = ""; for (const n of el.childNodes) if (n.nodeType === 3) own += n.nodeValue;
    own = own.trim(); if (own.length < 2) return;
    const bb = el.getBoundingClientRect(); if (!bb.width || !bb.height) return;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden") return;
    const px = parseFloat(cs.fontSize);
    /* a 12px label is allowed ONLY if it is short AND uppercase ON SCREEN,
       which means reading text-transform, not the source text */
    const shown = cs.textTransform === "uppercase" ? own.toUpperCase() : own;
    const label = shown === shown.toUpperCase() && /[A-Z]/.test(shown) && own.length <= 28;
    if (Math.round(px * 10) / 10 < 14 && !label) out.push(Math.round(px) + "px “" + own.slice(0, 34) + "”");
  });
  return out;
};

/* 2.4 - BY HIT TEST, NOT BY BOX. The info buttons draw an 18px circle and
   carry a 44px invisible target on a pseudo-element; measuring the box
   called them a failure for a whole round. This asks the browser what is
   actually under the finger at the edges of a 44px square. */
const TARGETS = () => {
  const out = []; let offscreen = 0;
  document.querySelectorAll('button,a[href],summary,input,select,[role="button"]').forEach(el => {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.pointerEvents === "none") return;
    const bw = Math.round(r.width), bh = Math.round(r.height);
    if (bw >= 44 && bh >= 44) return;              /* the box alone is enough */
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    /* BUG IN MY OWN SUITE, THREE. elementFromPoint returns null for any
       point outside the viewport, so every small control below the fold
       came back "unreachable" - four info buttons sitting at y=936 and
       y=1347 in a 900px window. A hit test can only answer for what is
       on screen. Counted and printed rather than silently dropped, so
       the gap in the measurement is visible instead of reading as zero. */
    if (cx < 22 || cy < 22 || cx > innerWidth - 22 || cy > innerHeight - 22) {
      offscreen++; return;
    }
    /* ...and the same thing one level in: a control inside a column that
       scrolls itself can sit within the window's rectangle while being
       clipped out of sight by its own container. Its own centre then
       belongs to the clipper, not to it. That is a control you cannot
       see, which is a different complaint from a control that is too
       small, and lumping the two together is how the real one hides. */
    const own = document.elementFromPoint(cx, cy);
    if (!(own && (own === el || el.contains(own)))) { offscreen++; return; }
    const mine = (dx, dy) => { const t = document.elementFromPoint(cx + dx, cy + dy);
      return !!(t && (t === el || el.contains(t) || (t.closest && t.closest("button,summary,a,[role=button]")) === el)); };
    /* only reached when the DRAWN box is under 44: does an invisible
       target carry it? 20px from centre each way is a 40px span, which is
       the most a pseudo-element can be asked for without false alarms at
       the border. */
    const L = mine(-20, 0), R = mine(20, 0), U = mine(0, -20), D = mine(0, 20);
    /* AN AXIS THAT REACHES ONE WAY AND NOT THE OTHER IS CLIPPED, NOT
       SMALL. A control sitting against the bottom of a card has its
       invisible target cut off by the card, and that is the page edge
       doing it, not a missing target. A control with NO expanded target
       fails BOTH ways on both axes, so it is still caught - which is the
       whole reason the test is written as a pair per axis rather than
       as four independent probes. */
    const okX = bw >= 44 || (L && R) || (L !== R);
    const okY = bh >= 44 || (U && D) || (U !== D);
    const reach = okX && okY && (L || R || U || D);
    if (!reach) out.push(el.tagName.toLowerCase() + "." +
      String((el.className && el.className.baseVal !== undefined) ? el.className.baseVal : (el.className || "")).slice(0, 24) +
      " (" + Math.round(r.width) + "x" + Math.round(r.height) + ") “" +
      (el.textContent || "").trim().slice(0, 16) + "”");
  });
  out.offscreen = offscreen;
  return out;
};

for (const [page, w, h, name] of SIZES) {
  console.log(`\n  ${name} — ${w}x${h}`);
  const p = await browser.newPage({viewport: {width: w, height: h}});
  await p.goto(BASE + "/" + page, {waitUntil: "networkidle"});
  await p.waitForTimeout(400);
  const tabs = await p.evaluate(() => [...document.querySelectorAll("#tabs [data-tab]")].map(b => b.dataset.tab));
  ok(tabs.length > 0, `  the tab strip is wired — ${tabs.length} tabs`);

  let smalls = [], targets = [], skipped = 0;
  for (const t of tabs) {
    /* the deal tabs only exist once an item is fully answered, and those
       are the screens that held the 38px buttons nobody had measured */
    const inner = t === "item" ? ["item", "pawn", "sale"] : [null];
    for (const itab of inner) {
      const r = await p.evaluate(async (a) => {
        const [mode, itab, typeSrc, tgtSrc] = a;
        st.mode = mode;
        if (mode === "item" && itab) {
          const c = CATALOG.find(y => y.items.some(i => i.id === "t1"));
          st.flow = "ask"; st.catId = c.id; st.itemId = "t1"; st.picked = true;
          st.brandSet = true; st.brandTyped = "Samsung"; st.model = "TU7000"; st.specSel = {};
          (SPEC_CHOICES.t1 || []).forEach((g, gi) => { st.specSel["t1:" + gi] = specBase(g); });
          st.condSet = true; st.completeSet = true;
          st.market = {kind: "hand", key: mkKey(), mid: 300};
          st.askAt = askQueue(calcItem()).length - 1; st.itemTab = itab;
        }
        render();
        /* MEASURE THE SETTLED PAGE. The cards animate in now, so a probe
           that reads the first frame is reading a fade, not a layout. */
        await Promise.all(document.getAnimations().map(x => x.finished.catch(() => {})));
        const tg = (new Function("return (" + tgtSrc + ")")())();
        return {type: (new Function("return (" + typeSrc + ")")())(),
                tgt: [...tg], off: tg.offscreen || 0};
      }, [t, itab, TYPE.toString(), TARGETS.toString()]);
      smalls.push(...r.type.map(s => (itab || t) + ": " + s));
      targets.push(...r.tgt.map(s => (itab || t) + ": " + s));
      skipped += r.off || 0;
    }
  }
  const u = a => [...new Set(a)];
  ok(smalls.length === 0,
     `  every line clears the type floor — ${smalls.length} under it${smalls.length ? ": " + u(smalls).slice(0, 4).join(" | ") : ""}`);
  ok(targets.length === 0,
     `  every control on screen is 44px to the finger \u2014 ${targets.length} short` +
     `${targets.length ? ": " + u(targets).slice(0, 4).join(" | ") : ""}` +
     `${skipped ? " (" + skipped + " small controls out of sight, not hit-testable)" : ""}`);

  /* 2.1 again, on the painted page: nothing a card is made of may be
     see-through, because that is what the blur was there to excuse. */
  const sheer = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll(".card,.snapCard,.bar,.pinStrip,.dock,.deskDock").forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.backdropFilter && cs.backdropFilter !== "none") bad.push("blur on ." + String(el.className).slice(0, 18));
      const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (m) { const parts = m[1].split(",").map(Number);
        if (parts.length === 4 && parts[3] < 0.92 && parts[3] > 0)
          bad.push("see-through ." + String(el.className).slice(0, 18) + " @" + parts[3]); }
    });
    return bad;
  });
  ok(sheer.length === 0, `  every panel is solid — ${sheer.length}${sheer.length ? ": " + [...new Set(sheer)].slice(0, 3).join(" | ") : ""}`);

  /* the effects layer is required (6.0) and must sit BEHIND the panels,
     never over text */
  const fx = await p.evaluate(() => {
    const c = document.getElementById("fx");
    if (!c) return {missing: true};
    const cs = getComputedStyle(c);
    return {z: cs.zIndex, pe: cs.pointerEvents, painted: c.width > 0 && c.height > 0};
  });
  ok(!fx.missing && fx.painted && fx.pe === "none",
     `  the field is there, behind everything, and catches no taps — ${JSON.stringify(fx)}`);
  await p.close();
}

/* ── and the replacement actually works ───────────────────────────────
   The source grep above proves alert() is gone. It does not prove that
   anything took its place, and a silent failure is worse than a grey box.
   This drives the real path - Export with nothing recorded, which was
   alert("Nothing recorded yet.") - and watches for a dialog. */
console.log("\n  the thing that replaced the pop-ups");
{
  const p = await browser.newPage({viewport: {width: 390, height: 844}});
  let dialog = false;
  p.on("dialog", async d => { dialog = true; await d.dismiss(); });
  await p.goto(BASE + "/phone.html", {waitUntil: "networkidle"});
  await p.waitForTimeout(300);
  const t = await p.evaluate(async () => {
    seenExport();
    await new Promise(z => setTimeout(z, 350));
    const el = document.getElementById("toast");
    if (!el) return {none: true};
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return {text: el.textContent, opacity: cs.opacity,
            fs: parseFloat(cs.fontSize), live: el.getAttribute("aria-live"),
            onScreen: r.top >= 0 && r.bottom <= innerHeight,
            /* it must clear the dock it would otherwise cover */
            clearsDock: innerHeight - r.bottom >= 56,
            solid: !/rgba\([^)]*,\s*0?\.\d+\)/.test(cs.backgroundColor)};
  });
  ok(!dialog, "  no browser dialog opened on a path that used to alert()");
  ok(!t.none && t.opacity === "1" && t.onScreen,
     `  a message slid in instead \u2014 \u201c${(t.text || "").slice(0, 32)}\u201d`);
  ok(t.fs >= 14, `  and it clears the type floor \u2014 ${t.fs}px`);
  ok(t.live === "polite", "  and a screen reader is told about it \u2014 aria-live");
  ok(t.clearsDock, "  and it sits above the dock rather than over it");
  ok(t.solid, "  and it is solid, like every other surface");
  /* and it must go away on its own, or it is a banner, not a message */
  await p.waitForTimeout(3200);
  const gone = await p.evaluate(() => getComputedStyle(document.getElementById("toast")).opacity);
  ok(gone === "0", `  and it clears itself \u2014 opacity ${gone} after 3.5s`);
  await p.close();
}

await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall green");
process.exit(fails ? 1 : 0);
