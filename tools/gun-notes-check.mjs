#!/usr/bin/env node
/* Do our gun notes point the same way the shelf does?
 *   node tools/gun-notes-check.mjs [--all]
 *
 * The Judge note said "Public Defender, stainless and Magnum above basic".
 * The Public Defender is the CHEAPEST Judge a retailer sells - it is the 2in
 * compact. A counter reading that marks a gun UP for the feature that should
 * mark it DOWN, which costs money whatever the price range says. That was
 * found by hand. This looks for the rest.
 *
 * HOW. A note's clause names a feature and a direction: "walnut over
 * synthetic", "stainless higher", ".40 is soft". The cached KYGUNCO listings
 * are split on whether the title carries that feature, and the two medians
 * compared. Agreement, disagreement, or not enough to say.
 *
 * WHAT THIS CANNOT CHECK, and it is a lot: a retailer sells NEW guns, so
 * every claim about age, era or provenance - pre-64, JM-stamped, three-screw,
 * West German, police trade-in, "older" - has no shelf to test against. Those
 * are counted and named, not silently passed.
 */
import { readFileSync } from "node:fs";
const ROOT = new URL("..", import.meta.url);
const cache = JSON.parse(readFileSync(new URL("tools/gunbroker/kygunco-cache.json", ROOT), "utf8"));
const book = JSON.parse(readFileSync(new URL("prices.json", ROOT), "utf8")).rows;
const NOTE = new Map(book.map(r => [r[0], r[8] || ""]));

/* a feature is only testable if a retailer's title would carry the word */
const F = [
  ["stainless", /\bstainless\b|\bs\/s\b|\bsst\b/i],
  ["walnut",    /\bwalnut\b/i],
  ["wood",      /\bwood\b|\bwalnut\b/i],
  ["synthetic", /\bsynthetic\b|\bpolymer\b/i],
  ["camo",      /\bcamo\b|\bmax-?5\b|\brealtree\b|\bmossy oak\b/i],
  ["magnum",    /\bmagnum\b|\bmag\b(?!azine)/i],
  ["compact",   /\bcompact\b|\bsubcompact\b/i],
  ["threaded",  /\bthreaded\b|\bthd\b/i],
  ["optic",     /\boptic ?ready\b|\btoro\b|\bmos\b|\brmr\b/i],
  ["fiber optic", /\bfiber ?optic\b|\bfo\b/i],
  ["laser",     /\blaser\b|\bviridian\b|\bcrimson\b/i],
  ["takedown",  /\btakedown\b/i],
  ["20 gauge",  /\b20 ?(ga|gauge)\b/i],
  [".410",      /\b\.?410\b/i],
  ["16 gauge",  /\b16 ?(ga|gauge)\b/i],
  ["28 gauge",  /\b28 ?(ga|gauge)\b/i],
  [".40",       /\b\.?40 ?(s&w|cal)?\b/i],
  ["public defender", /\bpublic ?defender\b/i],
  ["gen 5",     /\bgen ?5\b/i],
];
const DEMAND = /\bis soft\b|\bsofter\b|\bslow(er)?\b|\bnobody\b|\bthin buyer\b|\bfewer buyers\b|\bsells? slow/i;
const UNTESTABLE = /\bpre-?64\b|\bjm-?stamp|\bthree-?screw\b|west german|police trade|trade-?in|\bolder\b|\bvintage\b|\bcommemorative\b|\b19\d\d\b|\bera\b|\bmatching\b|\bsporterized\b/i;
const UP   = /\b(above|over|higher|more|adds?|add|on top|premium|bring|brings|dearer|up)\b/i;
const DOWN = /\b(lower|less|below|cheaper|down|soft|softer|discount|penal)\b/i;
/* "not a step up" carries the word up and means the opposite. A negated
   fragment is dropped before the direction is read, which is why the
   CORRECTED Judge note reads as cheaper and not as a fresh contradiction -
   the first fix flagged the very sentence it had just been given. */
const dirOf = t => {
  const clean = t.replace(/\bnot\b[^,;.]{0,24}/gi, " ");
  return UP.test(clean) ? +1 : DOWN.test(clean) ? -1 : 0;
};
const med = a => { a = a.slice().sort((x,y)=>x-y); return a.length?a[Math.floor((a.length-1)/2)]:null; };

let agree=0, clash=0, thin=0, era=0, noList=0, demand=0;
const clashes=[], agrees=[];
for (const [id, c] of Object.entries(cache)) {
  const note = NOTE.get(id) || "";
  if (!note) continue;
  if (!c.list || c.list.length < 8) { noList++; continue; }
  /* NOT ON COMMAS. "Public Defender, stainless and Magnum above basic" is one
     claim with a list in front of it - the direction sits at the END and
     governs every item. Splitting on the comma left "Public Defender" alone
     with no direction word, so it was skipped, and the tool reported ZERO
     contradictions on a note we already KNEW was wrong. A check that cannot
     fail on the one case it was built from is worth nothing; this one is
     re-run against the original Judge note every time it changes. */
  for (const clause of note.split(/[;.]/)) {
    const t = clause.trim(); if (!t) continue;
    if (UNTESTABLE.test(t)) { era++; continue; }
    if (DEMAND.test(t)) { demand++; continue; }
    /* IN THE ORDER THE CLAUSE SAYS THEM, not the order this list happens to
       be written in. "M3500 camo over M3000 synthetic" was read as
       "synthetic over camo" because synthetic sits earlier in F, and the
       tool reported our note as contradicted when the note was right and the
       reading was backwards. */
    const found = F.filter(([, re]) => re.test(t))
      .map(f => [f, t.search(f[1])]).sort((a,b) => a[1]-b[1]).map(a => a[0]);
    if (!found.length) continue;
    /* "A over B" is two claims in one clause, pointing opposite ways */
    const pair = found.length >= 2 && /\bover\b/i.test(t);
    const claims = pair
      ? [[found[0][0], found[0][1], +1], [found[1][0], found[1][1], -1]]
      : found.map(([n, re]) => [n, re, dirOf(t)]);
    for (const [fname, re, dir] of claims) {
      if (!dir) continue;
      const yes = c.list.filter(o => re.test(o.name)).map(o => o.price);
      const no  = c.list.filter(o => !re.test(o.name)).map(o => o.price);
      if (yes.length < 3 || no.length < 3) { thin++; continue; }
      const my = med(yes), mn = med(no), gap = (my - mn) / mn;
      if (Math.abs(gap) < 0.08) { thin++; continue; }
      const shelf = gap > 0 ? +1 : -1;
      const line = {id, gun: c.name, clause: t, fname, dir, my, mn, gap,
                    n: yes.length + "/" + no.length};
      if (shelf === dir) { agree++; agrees.push(line); }
      else { clash++; clashes.push(line); }
    }
  }
}
const pad=(x,n)=>String(x).padEnd(n).slice(0,n);
const show=r=>pad(r.id,5)+pad(r.gun,26)+pad(r.fname,15)
  +pad((r.dir>0?"note: dearer":"note: cheaper"),15)
  +pad(`shelf ${r.gap>0?"+":""}${Math.round(r.gap*100)}%`,13)
  +pad(`$${r.my} vs $${r.mn}`,16)+`n=${r.n}`;
console.log("NOTES THE SHELF CONTRADICTS\n");
if(!clashes.length) console.log("  none\n");
for (const r of clashes.sort((a,b)=>Math.abs(b.gap)-Math.abs(a.gap))) {
  console.log(show(r)); console.log(pad("",5)+'  note says: "'+r.clause+'"');
}
if (process.argv.includes("--all")) {
  console.log("\nNOTES THE SHELF AGREES WITH\n");
  for (const r of agrees.sort((a,b)=>Math.abs(b.gap)-Math.abs(a.gap))) console.log(show(r));
}
console.log(`\n${Object.keys(cache).length} gun rows checked.`);
console.log(`claims tested ${agree+clash} — agree ${agree}, CONTRADICTED ${clash}`);
console.log(`not tested: ${era} about age or provenance, ${demand} about used-market demand `
  + `(a retailer sells new guns, so neither has a shelf to test against), `
  +`${thin} too few listings or too small a gap, ${noList} rows with under 8 listings.`);
