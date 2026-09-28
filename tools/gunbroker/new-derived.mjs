// The 39 gun rows with no USED comp: can a NEW price stand in for one?
//   node tools/gunbroker/new-derived.mjs
// Measured ratio from every name carried under both conditions, then applied
// to the rows that have a new family price and nothing else. The ratio is a
// BAND, not a number - printed as such, because a point estimate here would
// be the third time this project dressed a guess as a measurement.
import fs from "fs";
const d=JSON.parse(fs.readFileSync("tools/gunbroker/2026-08-used.json","utf8"));
const key=s=>s.toUpperCase().replace(/[^A-Z0-9]+/g," ").trim();
const famNew=new Map(), rat=[];
for(const [t,v] of Object.entries(d)){
  if(!v||typeof v!=="object")continue;
  v.__t=t;
  for(const [k,p] of Object.entries(v.families_new||{})) famNew.set(v.__t+"|"+key(k),{name:k,price:p[1]});
  const u=v.families,n=v.families_new;
  if(u&&n){ const ix=new Map(Object.entries(n).map(([k,p])=>[key(k),p]));
    for(const [nm,[,up]] of Object.entries(u)){ const np=ix.get(key(nm)); if(np)rat.push(up/np[1]); } }
}
rat.sort((a,b)=>a-b);
const q=p=>rat[Math.floor((rat.length-1)*p)];
const LO=q(.25), MID=q(.5), HI=q(.75);
console.log(`ratio from ${rat.length} family pairs: ${LO.toFixed(2)}x to ${HI.toFixed(2)}x, middle ${MID.toFixed(2)}x\n`);

// The rows with no used comp, and the new family each maps to, as
// "type|FAMILY NAME". The type is part of the key because two types carry a
// family of the SAME NAME at different prices - "Smith & Wesson M&P" is $584
// as a pistol and $590 as a rifle - and a global lookup silently handed the
// rifle's price to the pistol row. null where the new table has no
// equivalent either.
const MAP={
 a6:null, a16a:null, a16b:"semi_auto_shotguns|MOSSBERG MODEL 940 SHOTGUNS", a17:null,
 a18:null,   // SX4 is the semi-auto; the listed SXP is the pump
 a21:null, a23:"bolt_action_rifles|RUGER AMERICAN RIFLE", a28:null, a29:null,
 a33:"semi_auto_rifles|SMITH & WESSON M&P", a34:null, a35:null, a36:null,
 a37a:null, a37b:null, a37c:null, a38a:null, a38b:null,
 b3:null, b4:"semi_auto_pistols|GLOCK G43", b5:null, b6:null,
 b10:"semi_auto_pistols|SMITH & WESSON M&P",
 b12:"semi_auto_pistols|SMITH & WESSON BODYGUARD", b13:null, b14:null, b16:null,
 b17:"semi_auto_pistols|RUGER LCP MAX", b18:null,
 b19:"semi_auto_pistols|RUGER MARK IV",
 b20:"semi_auto_pistols|CANIK METE",
 b21a:null, b23:null, b24:null, b25:null, b27:null, b28:null, b29:null,
 b32:"revolvers|TAURUS JUDGE",
};
const src=fs.readFileSync("app.js","utf8");
const s0=src.indexOf("let MODEL_PRICES=[");
const rows=new Map();
for(const m of src.slice(s0,src.indexOf("\n];",s0)).matchAll(
    /\["([ab]\d+[a-z]?)","([^"]*)","([^"]*)",(\d+),(\d+),"([hml])"/g))
  rows.set(m[1],{id:m[1],name:m[3],lo:+m[4],hi:+m[5]});
const pad=(x,n)=>String(x).padEnd(n).slice(0,n);
console.log(pad("row",5)+pad("our gun",32)+pad("our range",12)+pad("new",8)+pad("implied used",15)+"verdict");
let hit=0,none=0,out=0;
for(const [id,fam] of Object.entries(MAP)){
  const r=rows.get(id); if(!r) throw new Error("no such row "+id);
  if(!fam){ none++; continue; }
  const [ft,fn]=fam.split("|");
  const f=famNew.get(ft+"|"+key(fn)); if(!f) throw new Error("no new family: "+fam);
  hit++;
  const lo=Math.round(f.price*LO), hi=Math.round(f.price*HI);
  const overlap=!(hi<r.lo||lo>r.hi);
  if(!overlap)out++;
  console.log(pad(id,5)+pad(r.name,32)+pad(`$${r.lo}-${r.hi}`,12)+pad("$"+f.price,8)
    +pad(`$${lo}-${hi}`,15)+(overlap?"overlaps":lo>r.hi?"WE READ LOW":"WE READ HIGH"));
}
console.log(`\n${hit} of ${hit+none} uncovered rows now have a new-price check; ${none} have no new family either.`);
console.log(`${out} do not overlap the implied band.`);
