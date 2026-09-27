/* THE ICON IS THE ONE PART OF THE TOOL SEEN WITH THE TOOL SHUT.
   First it was a green ring on near-black - a gauge with nothing in it, in
   an accent the app stopped using when the palette went blue, and a green
   smudge at 32px. Then it was the pawnbroker's three balls, which is the
   one mark on a street that means this trade, drawn as lit spheres with
   sheen and cast shadows. Reported in one word: "thats awful." The
   concept was not the problem. Glossy spheres are a 2008 phone icon, and
   six candidates rendered at real size settled it - flat, it is a
   different object entirely.
   What it is now is the price tag, chosen off those six. It says what the
   tool DOES rather than what the shop is, and it has the strongest
   silhouette of the lot: one shape with one hole in it, which is what
   survives at 16px in a tab where most marks turn to mud. Gold holds its
   own against a light taskbar and a dark one, which the old blue did not.

   Rendered here rather than drawn by hand so the six sizes cannot drift
   apart: same source, six canvases.
     node tools/make-icons.mjs
   PW_CHROME points at the browser if it lives somewhere else. */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
import {writeFileSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const req = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
                 (() => { try { return execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"; }
                          catch (e) { return null; } })()].filter(Boolean)) {
  try { ({chromium} = req(m)); break; } catch (e) {}
}
if (!chromium) { console.error("playwright not found - install it, or point PW_MODULE at it."); process.exit(2); }
const EXE = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

/* The tag. One closed path, no strokes, no gradient stops doing work the
   shape should do - at 16px a stroke is a suggestion and a fill is a fact.
   The hole is punched in the ground colour rather than left transparent,
   so a launcher that drops its own background behind the icon cannot show
   through it. */
function icon({size, scale = 1, radius, bleed = false, hole = 48}) {
  const S = 1000;                       /* drawn big, scaled by the viewBox */
  const rr = radius == null ? S * 0.225 : radius;
  /* the tag is drawn at full size and scaled about the centre, so the
     maskable variant keeps the same drawing inside the launcher's circle */
  const k = scale, c = S / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${size}" height="${size}">
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0%" stop-color="#1C212B"/><stop offset="60%" stop-color="#12151B"/>
        <stop offset="100%" stop-color="#0A0C11"/></linearGradient>
      <linearGradient id="au" x1="0" y1="0" x2=".4" y2="1">
        <stop offset="0%" stop-color="#FFD86B"/><stop offset="100%" stop-color="#E0A521"/></linearGradient>
    </defs>
    <rect x="0" y="0" width="${S}" height="${S}" rx="${bleed ? 0 : rr}" fill="url(#ground)"/>
    <g transform="translate(${c} ${c}) scale(${k}) rotate(-18) translate(${-c} ${-c})">
      <path d="M300 250 H640 a40 40 0 0 1 28 12 L790 394 a40 40 0 0 1 12 28 V700
               a40 40 0 0 1-40 40 H300 a40 40 0 0 1-40-40 V290 a40 40 0 0 1 40-40 Z"
            fill="url(#au)"/>
      <circle cx="690" cy="392" r="${hole}" fill="#12151B"/>
    </g>
  </svg>`;
}
const OUT = [
  /* the launcher icons: rounded ground, the cluster given the room */
  {file:"icon-512.png", size:512, opts:{size:512, scale:1}},
  {file:"icon-192.png", size:192, opts:{size:192, scale:1}},
  /* maskable: full bleed, and the art kept inside the circle a launcher
     may crop to - 80% of the width, so the cluster gets 62% of it */
  {file:"icon-maskable-512.png", size:512, opts:{size:512, scale:.82, bleed:true}},
  /* iOS rounds this itself and refuses transparency, so: square, full bleed */
  {file:"apple-touch-icon.png", size:180, opts:{size:180, scale:1, bleed:true}},
  /* THE TAB, WHERE THE MARK IS 16px AND MOST MARKS DIE.
     At the launcher's proportions the hole is r=48 of 1000, which lands on
     about a pixel and a half here - it closed up, and a tag with no hole
     in it is a lozenge. The tag is pushed out to fill the canvas and the
     hole is opened up to carry at this size. Same drawing, sized for the
     distance it is read from, which is what a punch-cut typeface has done
     for five hundred years. */
  {file:"favicon-32.png", size:32, opts:{size:32, scale:1.3, radius:120, hole:76}},
];

const browser = await chromium.launch({executablePath: EXE});
for (const o of OUT) {
  const p = await browser.newPage({viewport:{width:o.size, height:o.size}, deviceScaleFactor:1});
  await p.setContent(`<!doctype html><meta charset="utf-8">
    <style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>
    ${icon(o.opts)}`);
  const buf = await p.screenshot({omitBackground:true, type:"png"});
  writeFileSync(join(ROOT, o.file), buf);
  console.log("wrote " + o.file + "  " + o.size + "x" + o.size + "  " + buf.length + " bytes");
  await p.close();
}
/* The favicon as an SVG too: a tab at 16px on a high-density screen gets a
   drawing rather than five pixels of a photograph of one. */
writeFileSync(join(ROOT, "favicon.svg"), icon({size:64, scale:1.3, radius:120, hole:76}).replace(/width="64" height="64"/, ""));
console.log("wrote favicon.svg");
await browser.close();
