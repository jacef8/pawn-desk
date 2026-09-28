// What fraction of a NEW gun's price does a USED one bring?
//   node tools/gunbroker/used-to-new.mjs
// Pairs every name that appears under both conditions and reports the spread.
// The point is the 39 gun rows with no sold comp at all: a new price is
// gettable for most of them, so a ratio that holds tightly turns a new price
// into a defensible used figure. A ratio that scatters means it does not, and
// saying so is the useful answer.
import fs from "fs";
const d=JSON.parse(fs.readFileSync("tools/gunbroker/2026-08-used.json","utf8"));
const key=s=>s.toUpperCase().replace(/[^A-Z0-9]+/g," ").trim();
const rows=[];
for(const [type,v] of Object.entries(d)){
  if(!v||typeof v!=="object")continue;
  for(const slot of ["brands","families"]){
    const used=v[slot], neu=v[slot+"_new"];
    if(!used||!neu)continue;
    const idx=new Map(Object.entries(neu).map(([k,p])=>[key(k),p]));
    for(const [name,[,up]] of Object.entries(used)){
      const np=idx.get(key(name)); if(!np)continue;
      rows.push({type,slot,name,used:up,neu:np[1],r:up/np[1]});
    }
  }
}
if(!rows.length){ console.log("No name appears under both conditions yet — load the New pass first."); process.exit(0); }
rows.sort((a,b)=>a.r-b.r);
const pad=(x,n)=>String(x).padEnd(n).slice(0,n);
console.log(pad("name",26)+pad("used",9)+pad("new",9)+"used/new");
for(const r of rows) console.log(pad(r.name,26)+pad("$"+r.used,9)+pad("$"+r.neu,9)+r.r.toFixed(2)+"x");
const rs=rows.map(r=>r.r).sort((a,b)=>a-b);
const q=p=>rs[Math.min(rs.length-1,Math.floor((rs.length-1)*p))];
console.log(`\n${rows.length} pairs · median ${q(.5).toFixed(2)}x · quarter ${q(.25).toFixed(2)}x · three-quarter ${q(.75).toFixed(2)}x`);
console.log(`over new retail: ${rows.filter(r=>r.r>1).length}`);
