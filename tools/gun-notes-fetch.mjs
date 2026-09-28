#!/usr/bin/env node
/* Cache KYGUNCO's whole-gun listings for every gun row, once.
 *   node tools/gun-notes-fetch.mjs        -> tools/gunbroker/kygunco-cache.json
 * Polite: one request at a time, 1.5s apart, read-only, no API money.
 * The parse and the parts filter are lifted from gun-ceiling.mjs, which
 * learned the hard way that a $124 barrel is not an 870.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const ROOT = new URL("..", import.meta.url);
const OUT = new URL("tools/gunbroker/kygunco-cache.json", ROOT);
const book = JSON.parse(readFileSync(new URL("prices.json", ROOT), "utf8")).rows;
const guns = book.filter(r => String(r[1]||"").split("|").some(x => /^g\d+$/.test(x)));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
         + "(KHTML, like Gecko) Chrome/125.0 Safari/537.36";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const q = name => String(name).split("/")[0].replace(/\([^)]*\)/g, "").trim();
const PART = /\bsb\b|\b(barrel|barrels|stock|stk|forend|fore-?end|hand ?guard|rail|rails|mount|base|ring set|choke|chokes|plug|seal|sling|swivel|grip|grips|pad|magazine|mag|clip|follower|spring|sight|sights|holster|side ?saddle|trigger (group|kit|guard)|firing pin|extractor|safety|screw|kit|case|bag|sleeve|cover|wrench|tool|adapter|spacer|shim|bushing|nut|pin|bipod|scope|optic)\b/i;
const WHOLE = /\b\d+\s*(rd|round|shot)\b|\b\d+\+\d\b|\b(pump|semi-?auto|bolt|lever|single ?shot|break ?action|over\/?under|side ?by ?side|revolver|pistol|rifle|shotgun)\b/i;
const FOR = /\b(for|fits)\b[^.]{0,40}\b(\d{3,4}|maverick|mossberg|remington|glock|ruger)\b/i;
const cache = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
let done = 0;
for (const r of guns) {
  const id = r[0];
  if (cache[id]) { done++; continue; }
  const u = "https://www.kygunco.com/search?q=" + encodeURIComponent(q(r[2]));
  let h = null, err = null;
  try {
    const res = await fetch(u, {headers:{"user-agent":UA,"accept":"text/html"}});
    if (!res.ok) err = "HTTP " + res.status; else h = await res.text();
  } catch (e) { err = String(e.message || e).slice(0, 50); }
  const list = [];
  if (h) for (const c of h.split('<div class="item col-12').slice(1)) {
    const t = /title="([^"]+?) for sale at KYGUNCO/.exec(c);
    const p = [...c.matchAll(/\$([0-9][0-9,]*\.[0-9]{2})/g)].map(m => +m[1].replace(/,/g,""));
    if (!t || !p.length) continue;
    const name = t[1].replace(/&quot;/g,'"'), price = Math.min(...p);
    if (price < 150) continue;
    if (FOR.test(name)) continue;
    if (PART.test(name) && !WHOLE.test(name)) continue;
    list.push({name, price});
  }
  cache[id] = {name: r[2], query: q(r[2]), err, list};
  writeFileSync(OUT, JSON.stringify(cache, null, 1));
  done++;
  process.stdout.write(`${String(done).padStart(2)}/${guns.length} ${id} ${r[2].slice(0,28).padEnd(28)} ${err?err:list.length+" listings"}\n`);
  await sleep(1500);
}
console.log("cached " + Object.keys(cache).length + " rows");
