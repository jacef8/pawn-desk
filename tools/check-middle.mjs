#!/usr/bin/env node
/* The middle, and a fence that cannot close on it.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-middle.mjs
 *
 * TWO BUGS, ONE IDEA. Both came from reading a pile of sales wrongly.
 *
 * The fence. Outliers were cut at 1.5x the middle half, the textbook rule,
 * which collapses when most of a list sits on one round number: the spread
 * goes to zero, the fence closes to that single point, and every other sale
 * is absurd. 20 at $200 with a $240 and a $300 in the list reported "$200 to
 * $200 from 20 sales" - false confidence, and the $240 thrown out as "way
 * above the rest". The fence is now the wider of the spread rule and a flat
 * third-to-triple of the middle, so a sale must be absurd by BOTH to go.
 *
 * The shop's own sales were AVERAGED, which is the one statistic a single odd
 * sale can drag, in the place the counter trusts most.
 *
 * WHAT WOULD MAKE THESE GO RED: the fence test asserts the $240 SURVIVES and
 * that n counts every sale kept - asserting the middle is $200 would pass
 * under the old code too, because the middle was the one thing it got right.
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req=createRequire(import.meta.url);
let chromium=null;
for(const m of [process.env.PW_MODULE,"playwright",(()=>{try{return execSync("npm root -g",{encoding:"utf8"}).trim()+"/playwright";}catch(e){return null;}})()].filter(Boolean))
  { try{ ({chromium}=req(m)); break; }catch(e){} }
if(!chromium){ console.error("playwright not found - set PW_MODULE."); process.exit(2); }
const BASE=process.env.PD_BASE||"http://127.0.0.1:8099";
const EXE=process.env.PW_CHROME||"/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let fails=0;
const ok=(c,m)=>{ console.log((c?"  ok    ":"  FAIL  ")+m); if(!c)fails++; };

const browser=await chromium.launch({executablePath:EXE});
const page=await browser.newPage({viewport:{width:1400,height:900}});
await page.goto(BASE+"/index.html",{waitUntil:"networkidle"});

console.log("\n  a list that sits on one price keeps the sales around it");
const r=await page.evaluate(()=>{
  const mk=(n,price,t)=>Array.from({length:n},(_,i)=>({title:t+i,price,condition:"used",match:"same"}));
  const listings=[...mk(20,200,"a"),...mk(1,50,"b"),...mk(3,450,"c"),
    {title:"d",price:240,condition:"used",match:"same"},
    {title:"e",price:300,condition:"used",match:"same"}];
  const c=crunchComps({listings});
  return {stats:c.stats,prices:c.kept.map(k=>k.price),
          outPrices:c.out.map(o=>o.price),n:listings.length};
});
ok(r.stats && r.stats.mid===200, `the middle is still the going rate — $${r.stats&&r.stats.mid}`);
ok(r.prices.includes(240), "a $240 sale is not absurd next to $200 — it survives");
ok(r.prices.includes(300), "nor is $300");
ok(r.prices.includes(450), "nor is $450, at 2.25x the middle");
ok(!r.prices.includes(50), "$50 at a quarter of the middle is still thrown out");
ok(r.stats.n===r.n-1, `n counts every sale kept, not just the ties — ${r.stats.n} of ${r.n}`);
ok(r.prices.filter(p=>p!==200).length===5,
   `every sale within a third-to-triple of the middle is kept — the $240, the $300 and three $450s, got ${r.prices.filter(p=>p!==200).length}`);
/* The quarter marks legitimately both read $200 here: 3 sales in 25 is 12%,
   nowhere near the three-quarter mark, so no fence change can move the High
   tile. The dearer sales show in the list under it instead. Asserting a wider
   band would have been asserting a falsehood. */
ok(r.stats.lo===200 && r.stats.hi===200,
   `and the quarter marks honestly read the ties — $${r.stats.lo} to $${r.stats.hi}`);

console.log("\n  a genuinely spread list is unchanged, and rubbish still goes");
const sp=await page.evaluate(()=>{
  const L=[100,105,110,115,5000].map((price,i)=>({title:"x"+i,price,condition:"used",match:"same"}));
  const c=crunchComps({listings:L});
  return {stats:c.stats,out:c.out.map(o=>o.price),kept:c.kept.map(k=>k.price)};
});
ok(sp.out.includes(5000), "a $5,000 typo among $100 sales still goes");
ok(sp.stats.mid===108, `and the middle of the four survivors is unchanged — $${sp.stats.mid}`);

console.log("\n  the shop's own sales read the middle, not the average");
const own=await page.evaluate(()=>{
  const save=window.DEALS;
  DEALS=[150,180,400].map((soldPrice,i)=>({key:"ZZtest",itemId:"ZZtest",status:"sold",soldPrice}));
  const s=soldStats("ZZtest");
  DEALS=save;
  return s;
});
ok(own && own.mid===180, `$150, $180 and $400 read $${own&&own.mid} — the average would say $243`);
ok(own && own.lo===150 && own.hi===400, `and the range is still shown whole — $${own.lo} to $${own.hi}`);
ok(own && own.avg===undefined, "the averaged figure is gone, not left beside it to be picked up again");

await browser.close();
console.log(fails?`\ncheck-middle FAIL (${fails})`:"\ncheck-middle OK");
process.exit(fails?1:0);
