#!/usr/bin/env node
/* One row must not price two guns the market prices apart.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-split.mjs
 *
 * WHY. "Sig Sauer P226 / P229" was one row at $575-800, and "Ruger Blackhawk
 * / Single-Six" was one row at $400-575. GunBroker's August sold medians put
 * the pairs at $1,189 vs $667 and $727 vs $455 - so each row was priced as
 * the cheaper gun, and the desk was offering P226 money for a P229 and
 * Blackhawk money for a Single-Six. About $400 on the P226.
 *
 * The assertion is the mechanism, not the number: the two names must reach
 * DIFFERENT rows, and the dearer one must actually quote more. Checking only
 * that two rows exist would pass with both patterns pointing at one of them.
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

// item, dearer typed text, cheaper typed text
const PAIRS=[
  ["g7","sig sauer p226","sig sauer p229"],
  ["g8","ruger blackhawk","ruger single-six"],
];
const got=await page.evaluate(ps=>ps.map(([item,dear,cheap])=>{
  const one=t=>{ const r=mpFor(item,t); return r?{id:r[0],name:r[2],lo:r[3],hi:r[4]}:null; };
  return {item,dear:one(dear),cheap:one(cheap),dearText:dear,cheapText:cheap};
}),PAIRS);

for(const g of got){
  ok(!!g.dear, `"${g.dearText}" reaches a priced row (${g.dear?g.dear.name:"nothing"})`);
  ok(!!g.cheap, `"${g.cheapText}" reaches a priced row (${g.cheap?g.cheap.name:"nothing"})`);
  if(!g.dear||!g.cheap) continue;
  ok(g.dear.id!==g.cheap.id,
     `they are different rows (${g.dear.id} vs ${g.cheap.id})`);
  const dm=(g.dear.lo+g.dear.hi)/2, cm=(g.cheap.lo+g.cheap.hi)/2;
  ok(dm>cm*1.15,
     `${g.dear.name} quotes materially more than ${g.cheap.name} ($${dm} vs $${cm})`);
  for(const r of [g.dear,g.cheap])
    ok(!/ \/ /.test(r.name), `${r.id} names one gun, not two ("${r.name}")`);
}

// The Taurus floor: the market clears a G2 at $124, under the old $130 low.
const tt=await page.evaluate(()=>{ const r=mpFor("g7","taurus g2c"); return r&&{id:r[0],lo:r[3],hi:r[4]}; });
ok(!!tt && tt.lo<=124, `Taurus row floor is at or under the $124 sold median (low $${tt&&tt.lo})`);

await browser.close();
console.log(fails?`\ncheck-split FAIL (${fails})`:"\ncheck-split OK");
process.exit(fails?1:0);
