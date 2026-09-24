/* EVERY INK IS MEASURED AGAINST THE SURFACE IT LANDS ON, IN BOTH THEMES.

   The palette has two brasses on purpose: --accent is a FILL you look at
   and --accent-ink is TEXT you read, because the fill that works as a
   fill fails badly as 13px type on glass. That distinction is only worth
   anything if something checks it, so this does - it reads the tokens out
   of the live page, composites each translucent layer onto the one under
   it exactly as the browser does, and computes the real ratio.

   Glass sits over the ambient field, which is a gradient, so each pair is
   checked against every place that field reaches. A ratio that only holds
   in one corner of the screen is not a ratio.

   One palette, because the app commits to dark. When there were two this
   ran both and the light one failed four pairs on its first run - hint
   text, warning text, the verdict green and the label inside a well. That
   is what the suite is for, and it is why the light one is gone rather
   than shipped with four unreadable pairs in it.

     python3 -m http.server 8099 &
     node tools/check-contrast.mjs                                        */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found"); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

/* [what it is, ink token, the stack it sits on (nearest first), minimum].
   4.5 for body copy, 3.0 for large text (24px+ or 19px bold) and for the
   edges of controls. */
const PAIRS = [
  ["body text on a card",        "--ink",       ["--glass"],            4.5],
  ["secondary text on a card",   "--ink-2",     ["--glass"],            4.5],
  ["labels + hints on a card",   "--ink-3",     ["--glass"],            4.5],
  ["body text on a widget",      "--ink",       ["--g2","--glass"],     4.5],
  ["secondary on a widget",      "--ink-2",     ["--g2","--glass"],     4.5],
  ["ghost-button text",          "--accent-ink",["--g2","--glass"],     4.5],
  ["link + source text",         "--accent-ink",["--glass"],            4.5],
  ["blue link text",             "--info-ink",  ["--glass"],            4.5],
  ["ink on a brass fill",        "--on-accent", ["--accent"],           4.5],
  ["ink on the pale brass edge", "--on-accent", ["--accent-2"],         4.5],
  ["warning text",               "--warn-ink",  ["--warn-wash","--glass"], 4.5],
  ["failure text",               "--bad-ink",   ["--bad-wash","--glass"],  4.5],
  ["good/verdict text",          "--good",      ["--glass"],            4.5],
  ["text in a recessed well",    "--ink",       ["--well","--glass"],   4.5],
  ["label in a recessed well",   "--ink-3",     ["--well","--glass"],   4.5],
  ["figure in a rail tile",      "--ink-2",     ["--well","--glass"],   4.5],
  ["the anchor numeral",         "--ink",       ["--glass"],            3.0],
  ["hairline between rows",      "--line",      ["--glass"],            1.2],
  /* The wallet hero is a saturated fill, not glass: white type sits
     straight on it. The sample's gradient topped out at #3B82F6, where
     white is 3.3:1 - fine for a 60px numeral and a fail for the 13px
     line under it. Both ends of the gradient are checked. */
  ["text on the hero card, light end", "--on-hero",   ["--hero1"],        4.5],
  ["text on the hero card, dark end",  "--on-hero",   ["--hero2"],        4.5],
  ["hero sub-line, light end",         "--on-hero-2", ["--hero1"],        4.5],
  ["hero sub-line, dark end",          "--on-hero-2", ["--hero2"],        4.5],
];

const browser = await chromium.launch({executablePath: EXE});
let bad = 0;
{
  const p = await browser.newPage({colorScheme: "dark"});
  await p.goto(BASE + "/index.html", {waitUntil: "networkidle"});
  const rows = await p.evaluate((pairs) => {
    const cs = getComputedStyle(document.documentElement);
    const tok = n => cs.getPropertyValue(n).trim();
    const parse = (c) => {
      const d = document.createElement("span");
      d.style.color = c; document.body.appendChild(d);
      const m = getComputedStyle(d).color.match(/[\d.]+/g); d.remove();
      return [ +m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3] ];
    };
    /* src over dst, straight alpha, exactly as the compositor does it */
    const over = (s, d) => {
      const a = s[3];
      return [s[0]*a + d[0]*(1-a), s[1]*a + d[1]*(1-a), s[2]*a + d[2]*(1-a), 1];
    };
    const lum = (c) => {
      const f = (v) => { v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); };
      return .2126*f(c[0]) + .7152*f(c[1]) + .0722*f(c[2]);
    };
    const ratio = (a, b) => { const [x,y] = [lum(a), lum(b)].sort((m,n)=>n-m);
                              return (x + .05) / (y + .05); };
    /* The floor is the paper; the field sits on it and is what glass has
       to refract, so each pair is tried at both extremes of the field. */
    const paper = parse(tok("--paper"));
    const floors = [["bare paper", paper]];
    for (const f of ["--field-a","--field-b","--field-c"])
      floors.push([f.replace("--field-","field "), over(parse(tok(f)), paper)]);

    const out = [];
    for (const [what, ink, stack, min] of pairs) {
      const fg = parse(tok(ink));
      let worst = Infinity, where = "";
      for (const [fname, floor] of floors) {
        let bgc = floor;
        for (let i = stack.length - 1; i >= 0; i--) bgc = over(parse(tok(stack[i])), bgc);
        /* a translucent ink is composited onto its own background too */
        const fgc = over(fg, bgc);
        const r = ratio(fgc, bgc);
        if (r < worst) { worst = r; where = fname; }
      }
      out.push({what, ink, min, r: Math.round(worst * 100) / 100, where});
    }
    return out;
  }, PAIRS);

  console.log("── graphite");
  for (const r of rows) {
    const ok = r.r >= r.min;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} ${String(r.r).padStart(6)}:1  (need ${r.min})  ${r.what}  [${r.ink} over ${r.where}]`);
  }
  await p.close();
}
await browser.close();
console.log(bad ? `\nFAILED (${bad}) — a colour that cannot be read is a colour that is wrong`
                : "\nevery ink clears the glass it lands on, everywhere the field reaches");
process.exit(bad ? 1 : 0);
