// Judge the gun rows of MODEL_PRICES against GunBroker sold medians (2026-08, Used).
//
// A family median pools every variant and every Used listing, collector grade
// included, so a median ABOVE our high is weak evidence: the plain counter gun
// sits below the family's centre of gravity, which is exactly where our book
// should be. A median BELOW our low is the loud one — it says the market clears
// the gun for less than we call the floor, so every offer off that row is high.
//
// null in MAP means the sold list has no equivalent. That is a real answer, not
// a gap to paper over: Ruger American is not a M77 Hawkeye and a budget 1911 is
// not a Colt Government, and pairing them would invent a comp.
import fs from "fs";
const src=fs.readFileSync("app.js","utf8");
const s=src.indexOf("let MODEL_PRICES=[");
const rows=[];
for(const m of src.slice(s,src.indexOf("\n];",s)).matchAll(
    /\["([ab]\d+[a-z]?)","([^"]*)","([^"]*)",(\d+),(\d+),"([hml])"/g))
  rows.push({id:m[1],kind:m[2],name:m[3],lo:+m[4],hi:+m[5],conf:m[6]});

const MAP={
 a1:"Remington 870",              a2:"Remington 870",
 a3:"Mossberg Model 500 Shotguns",a4:"Mossberg Model 590 Shotguns",
 a5:"Mossberg Maverick 88 Shotguns",
 a6:null,                         // 835 Ulti-Mag not in the top 15
 a7:"Benelli Nova",               a8:"Browning BPS",
 a9:"Remington 1100",             a10:"Remington 11-87",
 a11:"Beretta A300",              a12:"Beretta A400",
 a13:"Benelli M2",                a14:"Benelli Super Black Eagle",
 a15:"Browning A5",
 a16a:null, a16b:null,            // Mossberg 930 / 940
 a17:null,                        // Stoeger M3000 is an auto; the listed Condor is an O/U
 a18:null,                        // Winchester SX4 is an auto; the listed SXP is a pump
 a19:"Remington 700",             a20:"Winchester Model 70",
 a21:null,                        // Savage Axis is the budget line, not 11/111
 a22:"Savage 11/111 Rifles",
 a23:null,                        // Ruger American is not the M77 Hawkeye
 a24:"Tikka T3",                  a25:"Browning X-Bolt",
 a26:"Marlin Model 336 Rifles",   a27:"Winchester Model 94 Rifles",
 a28:null, a29:null,              // Henry
 a30:"Ruger 10/22",               a31:"Marlin Model 60 Rifles",
 a32:"Anderson Manufacturing AM-15 Rifles",
 a33:null, a34:null, a35:null, a36:null,
 a37a:null, a37b:null, a37c:null, a38a:null, a38b:null,   // muzzleloaders
 b1:"GLOCK G17",                  b2:"GLOCK G19",
 b3:null, b4:null, b5:null, b6:null,
 b7:"SIG SAUER P365",             b8:"SIG SAUER P320",
 b9a:"SIG SAUER P226",            b9b:"SIG SAUER P229",
 b10:null,
 b11:"SMITH & WESSON SHIELD",
 b12:null, b13:null, b14:null,
 b15:"TAURUS G2",
 b16:null, b17:null, b18:null, b19:null, b20:null,
 b21a:null, b21b:"CZ-USA CZ 75",
 b22:"BERETTA MODEL 90 PISTOLS",
 b23:null,                        // our row is Rock Island / Tisas, not a Colt
 b24:null, b25:null,
 b26:"Smith & Wesson Model 686 Pistols",
 b27:null,                        // 642/638 Airweight is not the steel Model 36
 b28:null, b29:null,
 b30:"Ruger LCR",
 b31a:"Ruger Blackhawk",          b31b:"Ruger SINGLE-SIX",
 b32:null,
 b33:"Colt Python",
};
// Rows that once named two guns the sold data prices separately. Both were
// split on 2026-09-27; check-split.mjs holds them apart. Kept here so the
// pairing is still checked, and so a future merge back shows up as a fault.
const SPLIT={
 "b9a/b9b":[["P226","SIG SAUER P226"],["P229","SIG SAUER P229"]],
 "b31a/b31b":[["Blackhawk","Ruger Blackhawk"],["Single-Six","Ruger SINGLE-SIX"]],
};

const doc=JSON.parse(fs.readFileSync("tools/gunbroker/2026-08-used.json","utf8"));
const fam=new Map();
for(const v of Object.values(doc))
  if(v&&v.families) for(const [k,p] of Object.entries(v.families)) fam.set(k,p);
for(const k of [...Object.values(MAP),...Object.values(SPLIT).flat().map(p=>p[1])])
  if(k&&!fam.has(k)) throw new Error("no such family: "+k);

const out=[];
for(const r of rows){
  if(!(r.id in MAP)) throw new Error("unmapped row "+r.id+" "+r.name);
  if(!MAP[r.id]) continue;
  const med=fam.get(MAP[r.id])[1], mid=(r.lo+r.hi)/2;
  out.push({...r,fam:MAP[r.id],med,mid,ratio:med/mid,
    verdict: med<r.lo?"OVER-PAY" : med>r.hi?"above" : "in range"});
}
out.sort((a,b)=>a.ratio-b.ratio);
const pad=(x,n)=>String(x).padEnd(n).slice(0,n);
console.log(pad("row",5)+pad("our gun",34)+pad("our range",12)+pad("sold med",10)+pad("med/mid",9)+"verdict");
for(const r of out) console.log(pad(r.id,5)+pad(r.name,34)+pad(`$${r.lo}-${r.hi}`,12)
  +pad("$"+r.med,10)+pad(r.ratio.toFixed(2)+"x",9)+r.verdict);

console.log("\nPAIRS THAT WERE ONE ROW UNTIL 2026-09-27:");
for(const [id,pairs] of Object.entries(SPLIT)){
  console.log(`  ${id}`);
  for(const [lbl,f] of pairs) console.log(`      ${pad(lbl,12)} sold median $${fam.get(f)[1]}`);
}
const g=v=>out.filter(r=>r.verdict===v).length;
const rs=out.map(r=>r.ratio).sort((a,b)=>a-b);
console.log(`\n${rows.length} gun rows: ${out.length} have a sold comp, ${rows.length-out.length} have none.`);
console.log(`OVER-PAY (median under our low) ${g("OVER-PAY")} | in range ${g("in range")} | median above our high ${g("above")}`);
console.log(`median med/mid across matched rows ${rs[rs.length>>1].toFixed(2)}x`);
