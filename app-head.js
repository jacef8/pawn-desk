
/* ===== stand-alone website extras: deal log saved on this device, live gold & silver, works offline ===== */
function localDB(){
  const KEY="pawnDeskDeals";
  const load=()=>{ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return []; } };
  const save=a=>{ try{ localStorage.setItem(KEY,JSON.stringify(a)); }catch(e){} };
  const subs=[];
  const emit=()=>{ const a=load().sort((x,y)=>(y.ts||0)-(x.ts||0)).slice(0,400);
    const snap={docs:a.map(d=>({id:d._id,data:()=>{ const c=Object.assign({},d); delete c._id; return c; }}))};
    subs.forEach(f=>{ try{ f(snap); }catch(e){} }); };
  const q={orderBy(){return q;},limit(){return q;},onSnapshot(f){ subs.push(f); setTimeout(emit,0); return ()=>{}; }};
  return {
    collection(){ return Object.assign({},q,{ async add(o){ const a=load(), id=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
      a.push(Object.assign({_id:id},o)); save(a); emit(); return {id}; } }); },
    doc(p){ const id=String(p).split("/")[1]; return {
      async update(o){ const a=load(), d=a.find(x=>x._id===id); if(d)Object.assign(d,o); save(a); emit(); },
      async delete(){ save(load().filter(x=>x._id!==id)); emit(); } }; }
  };
}
async function liveMetals(){
  try{
    const get=async sym=>{ const r=await fetch("https://api.gold-api.com/price/"+sym,{cache:"no-store"}); if(!r.ok)throw 0; const j=await r.json(); return Number(j&&j.price); };
    const [g,sv]=await Promise.all([get("XAU"),get("XAG")]);
    if(!(g>1000&&g<20000&&sv>5&&sv<500))return;
    const d=new Date(), p=n=>String(n).padStart(2,"0");
    FEED.gold=Math.round(g); FEED.silver=Math.round(sv*100)/100;
    FEED.date=d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate()); FEED.source="gold-api.com, live";
    try{ render(); }catch(e){}
  }catch(e){}
}
window.standaloneBoot=function(){
  try{ CAP.db=localDB(); CAP.dbLocal=true; watchDeals(); }catch(e){}
  if(pdServer()){
    CAP.sample={limits:pdLimits,json:pdJSON};
    pdLimits().then(l=>{ CAP.images=!!(l&&l.images); CAP.imgLimits=(l&&l.images)||null;
                         try{ render(); }catch(e){} }).catch(()=>{});
  }
  try{ render(); }catch(e){}
  liveMetals();
  if("serviceWorker" in navigator&&location.protocol==="https:"){ try{ navigator.serviceWorker.register("sw.js").catch(()=>{}); }catch(e){} }
};
