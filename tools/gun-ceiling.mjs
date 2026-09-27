#!/usr/bin/env node
/* WHAT A NEW ONE COSTS IS THE CEILING ON WHAT A USED ONE BRINGS.
 *
 *   node tools/gun-ceiling.mjs            # first 12 rows
 *   node tools/gun-ceiling.mjs --all      # all of them
 *
 * All 74 gun rows are "researched" - not one is measured off a sale - and
 * every firearm marketplace worth quoting blocks automated reading:
 * GunBroker, Armslist, Guns.com, GunsAmerica, TrueGunValue, GunWatcher
 * and Rock Island all answer a script with a Cloudflare challenge. That is
 * the site refusing a bot, not our network, so a person in a real browser
 * still gets through - but the desk can never fetch from them.
 *
 * KYGUNCO answers. It is a retailer, so what it gives is NEW retail, which
 * is not a comp - you cannot price a used pump off it. What it is, is a
 * hard ceiling: a used gun that books above what a new one costs is wrong
 * no matter where the number came from, and that is checkable without
 * anybody's permission or money.
 *
 * Polite: one request at a time, a second and a half apart, read-only.
 */
import { readFileSync } from "node:fs";
const ROOT = new URL("..", import.meta.url);
const book = JSON.parse(readFileSync(new URL("prices.json", ROOT), "utf8")).rows;
const guns = book.filter(r => String(r[1]||"").split("|").some(x => /^g\d+$/.test(x)));
const rows = process.argv.includes("--all") ? guns : guns.slice(0, 12);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
         + "(KHTML, like Gecko) Chrome/125.0 Safari/537.36";
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* the model name as a shop would search it - our rows carry slashes for
   "this or the near variant", and only the first half is a real model */
const q = name => String(name).split("/")[0].replace(/\([^)]*\)/g, "").trim();

async function newPrices(name) {
  const u = "https://www.kygunco.com/search?q=" + encodeURIComponent(q(name));
  let h;
  try {
    const res = await fetch(u, {headers:{"user-agent":UA,"accept":"text/html"}});
    if (!res.ok) return {err: "HTTP " + res.status};
    h = await res.text();
  } catch (e) { return {err: String(e.message || e).slice(0, 40)}; }
  const out = [];
  for (const c of h.split('<div class="item col-12').slice(1)) {
    const t = /title="([^"]+?) for sale at KYGUNCO/.exec(c);
    const p = [...c.matchAll(/\$([0-9][0-9,]*\.[0-9]{2})/g)].map(m => +m[1].replace(/,/g,""));
    if (t && p.length) out.push({name: t[1].replace(/&quot;/g,'"'), price: Math.min(...p)});
  }
  /* A BARREL IS NOT A SHOTGUN. First run of this quoted "REMINGTON 870
     Express Shotgun Barrel" at $124.99 as the price of an 870, a $26.99
     set of side rails as the price of a Maverick 88, and a $2.99 magazine
     plug as the price of an 1100 - which is the same parts-for-machines
     mistake the app itself was fixed for in September, made again in the
     tool checking it.
     Excluding parts vocabulary alone gets it wrong the other way: the
     "MOSSBERG 590 Heat Shield 12 Gauge 20in 9rd" IS a complete shotgun,
     sold with a heat shield on it. So a parts word only disqualifies a
     listing that carries no positive sign of being a whole firearm - a
     magazine capacity, an action, or a gauge-and-barrel pairing - and a
     floor price catches the rest, since nothing complete leaves a
     retailer under a hundred dollars. */
  const PART = /\bsb\b|\b(barrel|barrels|stock|stk|forend|fore-?end|hand ?guard|rail|rails|mount|base|ring set|choke|chokes|plug|seal|sling|swivel|grip|pad|recoil pad|magazine|mag|clip|follower|spring|sight|sights|front sight|rear sight|shell holder|side ?saddle|trigger (group|kit|guard)|firing pin|extractor|ejector|bolt (handle|knob)|safety|screw|kit|case|bag|sleeve|cover|wrench|tool|adapter|spacer|shim|bushing|nut|pin|bipod|scope|optic)\b/i;
  const WHOLE = /\b\d+\s*(rd|round|shot)\b|\b\d+\+\d\b|\b(pump|semi-?auto|bolt|lever|single ?shot|break ?action|over\/?under|side ?by ?side)\b[^.]{0,24}\b(shotgun|rifle|action)\b|\b\d{2}(ga|gauge)\b[^.]{0,30}\b\d{2}(in|")\b/i;
  const FOR = /\b(for|fits)\b[^.]{0,40}\b(\d{3,4}|maverick|mossberg|remington|glock|ruger)\b/i;
  const whole = o => {
    if (o.price < 100) return false;                 /* nothing complete is under $100 */
    if (FOR.test(o.name)) return false;              /* "fits 870/1100/11-87" */
    if (!PART.test(o.name)) return true;
    return WHOLE.test(o.name);                       /* a part word, but it is a gun */
  };
  /* only the listings that actually name the model we asked about */
  const key = q(name).toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const hit = out.filter(o => key.every(w => o.name.toLowerCase().includes(w)) && whole(o));
  if (!hit.length) return {n: out.length, matched: 0};
  /* THE MIDDLE ONE, NOT THE CHEAPEST. Taking the minimum means a single
     part that slips the filter becomes the price of the gun - and one
     does: Browning lists barrels as "SB BPS STK 98,12-3,24", which
     carries a gauge and a length and so reads as a whole shotgun. Real
     BPS guns run $611-817 there and those barrels are $261.99, so the
     minimum said $262 and the median says $636. A ceiling built from the
     middle of forty listings survives a few bad ones; one built from the
     cheapest cannot. */
  hit.sort((a,b) => a.price - b.price);
  const med = hit[Math.floor(hit.length/2)].price;
  return {n: out.length, matched: hit.length, low: med, cheapest: hit[0].price,
          example: hit[Math.floor(hit.length/2)].name};
}

console.log("row".padEnd(30) + "ours (used)".padStart(13) + "new mid".padStart(10)
          + "  used-top vs new");
console.log("-".repeat(74));
const flags = [];
for (const r of rows) {
  const got = await newPrices(r[2]);
  let verdict = "";
  if (got.err) verdict = "  " + got.err;
  else if (!got.matched) verdict = "  not stocked - no ceiling to check";
  else {
    const ratio = r[4] / got.low;
    verdict = "  " + (ratio*100).toFixed(0) + "% of new"
            + (ratio >= 1 ? "   <-- OVER a new one" : ratio > 0.85 ? "   <-- within 15% of new" : "");
    if (ratio > 0.85) flags.push({name:r[2], id:r[0], used:[r[3],r[4]], newLow:got.low,
                                  ratio:+ratio.toFixed(2), example:got.example});
  }
  console.log(String(r[2]).slice(0,29).padEnd(30)
    + ("$"+r[3]+"-"+r[4]).padStart(13)
    + (got.low ? "$"+got.low.toFixed(0) : "-").padStart(10) + verdict);
  await sleep(1500);
}
console.log("\n" + flags.length + " of " + rows.length + " book at 85% of a new one or above");
for (const f of flags)
  console.log("   " + f.id + "  " + f.name + "   ours $" + f.used.join("-")
            + "  new $" + f.newLow + "  (" + f.ratio + "x)\n        cheapest new: " + f.example);
