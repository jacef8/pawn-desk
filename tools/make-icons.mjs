/* THE ICON IS THE ONE PART OF THE TOOL SEEN WITH THE TOOL SHUT.
   What shipped was a green ring on near-black: a gauge with nothing in it,
   in an accent the app stopped using when the palette went blue. At 32px in
   a taskbar it was a green smudge, indistinguishable from every other round
   app on the row, and it said nothing about what it opens.

   What it is now is the pawnbroker's sign - three gold balls, hung outside
   Lombard money-lenders since the Medici and still over pawn shops today.
   It is the one mark on a street that means this trade, it is a cluster
   rather than a disc so it keeps its shape at 16px, and gold holds its own
   against a light taskbar and a dark one, which the blue does not.

   Rendered here rather than drawn by hand so the four sizes cannot drift
   apart: same source, four canvases.
     python3 -m http.server 8099 &   (not needed - this draws its own page)
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

/* One ball: a sphere, not a circle. Lit from the upper left, sitting on its
   own short shadow - the same light the rest of the tool is drawn under. */
const ball = (cx, cy, r) => `
  <ellipse cx="${cx}" cy="${cy + r * 0.92}" rx="${r * 0.82}" ry="${r * 0.20}" fill="url(#cast)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gold)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#rim)" stroke-width="${r * 0.075}"/>
  <ellipse cx="${cx - r * 0.33}" cy="${cy - r * 0.42}" rx="${r * 0.33}" ry="${r * 0.21}"
           fill="#FFF6DD" opacity=".46" transform="rotate(-32 ${cx - r * 0.33} ${cy - r * 0.42})"/>`;

/* `scale` is how much of the canvas the cluster is allowed: full-bleed
   launcher icons give it the room, a maskable one keeps well inside the
   circle the launcher may crop to. */
function icon({size, scale = 1, radius, bleed = false}) {
  const S = 1000;                       /* drawn big, scaled by the viewBox */
  const r = 158 * scale;
  const gap = r * 0.07;
  const cx = S / 2, top = S / 2 - r * 0.78 - 8, bot = S / 2 + r * 0.98 - 8;
  const rr = radius == null ? S * 0.225 : radius;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${size}" height="${size}">
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1C212B"/><stop offset="55%" stop-color="#13161C"/>
        <stop offset="100%" stop-color="#0B0D13"/></linearGradient>
      <radialGradient id="sheen" cx=".26" cy=".18" r=".8">
        <stop offset="0%" stop-color="#3B82F6" stop-opacity=".30"/>
        <stop offset="60%" stop-color="#3B82F6" stop-opacity="0"/></radialGradient>
      <radialGradient id="gold" cx=".34" cy=".30" r=".85">
        <stop offset="0%" stop-color="#FFE9A8"/><stop offset="38%" stop-color="#F2C14E"/>
        <stop offset="76%" stop-color="#D19A28"/><stop offset="100%" stop-color="#9A6B16"/></radialGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFF0BE" stop-opacity=".85"/>
        <stop offset="100%" stop-color="#6E4A0C" stop-opacity=".55"/></linearGradient>
      <radialGradient id="cast" cx=".5" cy=".5" r=".5">
        <stop offset="0%" stop-color="#000" stop-opacity=".55"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>
    <rect x="0" y="0" width="${S}" height="${S}" rx="${bleed ? 0 : rr}" fill="url(#ground)"/>
    <rect x="0" y="0" width="${S}" height="${S}" rx="${bleed ? 0 : rr}" fill="url(#sheen)"/>
    ${ball(cx - r - gap, top, r)}
    ${ball(cx + r + gap, top, r)}
    ${ball(cx, bot, r)}
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
  /* the browser tab, where it is 16px and the ground is all that survives
     unless the balls are big */
  {file:"favicon-32.png", size:32, opts:{size:32, scale:1.04, radius:120}},
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
writeFileSync(join(ROOT, "favicon.svg"), icon({size:64, scale:1.04, radius:120}).replace(/width="64" height="64"/, ""));
console.log("wrote favicon.svg");
await browser.close();
