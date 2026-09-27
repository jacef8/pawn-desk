// Load tools/gunbroker/2026-08-raw.txt into 2026-08-used.json.
// The raw file is TYPE|CONDITION|TABLE|NAME|SHARE|PRICE, one row per line,
// transcribed from the Outdoor Analytics Tableau dashboard.
// Any row we already hold must match, or the load aborts: the two types we
// captured independently are the only check we have on the transcription.
import fs from "fs";
const P="tools/gunbroker/";
const num=s=>Number(String(s).replace(/[$,%\s]/g,""));
const key=s=>s.toUpperCase().replace(/\bRIFLES?\b|\bSHOTGUNS?\b|\bPISTOLS?\b/g,"")
  .replace(/[^A-Z0-9]+/g," ").trim();
const nice=s=>s.replace(/\S+/g,w=>/^[A-Z]+$/.test(w)&&w.length>3&&!/^(CZ|USA|SB)$/.test(w)
  ?w[0]+w.slice(1).toLowerCase():w);

const doc=JSON.parse(fs.readFileSync(P+"2026-08-used.json","utf8"));
const rows=fs.readFileSync(P+"2026-08-raw.txt","utf8").trim().split("\n");
let kept=0,checked=0;
for(const ln of rows){
  const f=ln.split("|").map(s=>s.trim());
  if(f.length!==6) throw new Error("bad row: "+ln);
  const [type,cond,table,name,share,price]=f;
  if(cond.toLowerCase()!=="used") throw new Error("not used: "+ln);
  const t=type.toLowerCase().replace(/ /g,"_");
  const slot=table.toLowerCase()==="brands"?"brands":"families";
  doc[t]??={}; doc[t][slot]??={};
  const bucket=doc[t][slot];
  const have=Object.entries(bucket).find(([k])=>key(k)===key(name));
  const pair=[num(share),num(price)];
  if(have){
    checked++;
    if(have[1][0]!==pair[0]||have[1][1]!==pair[1])
      throw new Error(`conflict ${t}/${slot} ${name}: held ${have[1]} vs raw ${pair}`);
    continue;                               // keep the name we already had
  }
  bucket[nice(name)]=pair; kept++;
}
const order=["source","market","month","condition","note"];
const out={}; for(const k of order) out[k]=doc[k];
for(const k of Object.keys(doc).sort()) if(!order.includes(k)) out[k]=doc[k];
fs.writeFileSync(P+"2026-08-used.json",JSON.stringify(out,null,1)+"\n");
const types=Object.keys(out).filter(k=>!order.includes(k));
console.log(`confirmed ${checked} held rows, added ${kept}`);
for(const t of types)
  console.log(`  ${t}: brands ${Object.keys(out[t].brands||{}).length}, families ${Object.keys(out[t].families||{}).length}`);
