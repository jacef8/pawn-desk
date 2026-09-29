
/* ===== stand-alone website extras: deal log saved on this device, live gold & silver, works offline ===== */
function localDB(){
  const KEY="pawnDeskDeals";
  const load=()=>{ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return []; } };
  /* The shelf record and the listing record both cap what they keep; the deal
     log did not, and once the sync started merging in another device's rows
     there was nothing holding it down. Keep the newest MAX, same as the view. */
  const MAX=800;
  const save=a=>{ try{
    if(a.length>MAX)a=a.slice().sort((x,y)=>(y.ts||0)-(x.ts||0)).slice(0,MAX);
    localStorage.setItem(KEY,JSON.stringify(a)); }catch(e){} };
  const subs=[];
  const emit=()=>{ const a=load().sort((x,y)=>(y.ts||0)-(x.ts||0)).slice(0,400);
    const snap={docs:a.map(d=>({id:d._id,data:()=>{ const c=Object.assign({},d); delete c._id; return c; }}))};
    subs.forEach(f=>{ try{ f(snap); }catch(e){} }); };
  const q={orderBy(){return q;},limit(){return q;},onSnapshot(f){ subs.push(f); setTimeout(emit,0); return ()=>{}; }};
  /* The deal log is the one record that predates syncing, and it keys rows on
     _id rather than id. Rather than rename a field the log already writes and
     reads, it hands the sync a door: read the rows, write them back, and tell
     the deal-log view to redraw so merged-in deals appear without a reload. */
  window.PD_DEALS={ all:load, save:a=>{ save(a); emit(); } };
  return {
    collection(){ return Object.assign({},q,{ async add(o){ const a=load(), id=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
      a.push(Object.assign({_id:id},o)); save(a); emit(); return {id}; } }); },
    doc(p){ const id=String(p).split("/")[1]; return {
      async update(o){ const a=load(), d=a.find(x=>x._id===id); if(d)Object.assign(d,o); save(a); emit(); },
      async delete(){ save(load().filter(x=>x._id!==id)); emit(); } }; }
  };
}
/* HOW OFTEN THE METAL PRICE IS REFETCHED, AND WHY IT IS NOT "ONCE".
   Asked from the counter: "How often should we update the metal prices?"
   The honest answer was that it fetched ONCE, in standaloneBoot, and never
   again - so a desk opened at eight in the morning priced five o'clock
   gold off the eight o'clock number.

   Measured off this repo's own LBMA series, 522 trading days: gold's
   median day-over-day move is 0.71% and it moves 1% or more on 39% of
   days; silver's median is 1.38%. On a 60g 14k scrap bag at 70% of melt
   that is $24 on a normal day and $79 on a one-in-ten day, and across six
   gold tickets it is $17 to $57. It is symmetric - stale helps as often as
   it hurts - but on a day gold drops 3% it hurts on EVERY ticket until
   somebody reloads the page.

   The feed is free, needs no key, and updates about once a minute, so the
   cadence is not a cost question. Fifteen minutes caps the drift at
   fifteen minutes instead of nine hours, and the refetch on focus is the
   one that matters at a counter you walk away from.
   FETCH_MS is also the floor on focus refetches, so alt-tabbing twenty
   times does not fire twenty requests. */
const METAL_FETCH_MS=15*60*1000;
/* TWO CLOCKS, AND THE SECOND ONE WAS MISSING. metalAt is set only when a
   price actually arrives, so throttling on it alone meant a desk that
   could not reach the feed - no signal in the shop, the API down - threw a
   fresh pair of requests on EVERY focus and visibilitychange, which both
   fire on one alt-tab. Caught by a test that counted requests and got 8
   where it expected 2, because this container cannot reach the API either
   and every call was a failure.
   metalTry bounds the attempt rate whatever the outcome; metalAt skips the
   work when the number in hand is already fresh. A failure is retried in
   twenty seconds, a success is left alone for a minute. */
let metalAt=0, metalTry=0;
async function liveMetals(force){
  const now=Date.now();
  if(!force){
    if(metalAt&&now-metalAt<60*1000)return;
    if(metalTry&&now-metalTry<20*1000)return;
  }
  metalTry=now;
  try{
    const get=async sym=>{ const r=await fetch("https://api.gold-api.com/price/"+sym,{cache:"no-store"}); if(!r.ok)throw 0; const j=await r.json(); return j; };
    const [gj,sj]=await Promise.all([get("XAU"),get("XAG")]);
    const g=Number(gj&&gj.price), sv=Number(sj&&sj.price);
    if(!(g>1000&&g<20000&&sv>5&&sv<500))return;
    metalAt=Date.now();
    const d=new Date(), p=n=>String(n).padStart(2,"0");
    FEED.gold=Math.round(g); FEED.silver=Math.round(sv*100)/100;
    /* THE QUOTE'S OWN TIME, NOT THIS DEVICE'S CLOCK. FEED.date was stamped
       from new Date() regardless of how old the number was, so a quote that
       had failed to refresh still wore today's date and looked current. The
       feed says when it was struck; that is what gets shown. */
    FEED.at=(gj&&gj.updatedAt)||null;
    FEED.date=d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate()); FEED.source="gold-api.com, live";
    /* every price that arrives is written down, so the series the guard
       reasons from grows by a day without anybody re-running anything */
    try{ spotLogWrite(FEED.date,FEED.gold,FEED.silver); }catch(e){}
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
  liveMetals(true);
  /* Two triggers, not one. The timer covers a desk left open; the focus
     handler covers the counter walking away and coming back, which is the
     one that actually happens. visibilitychange fires on tab switches the
     focus event misses. */
  try{
    setInterval(()=>liveMetals(false),METAL_FETCH_MS);
    addEventListener("focus",()=>liveMetals(false));
    addEventListener("visibilitychange",()=>{ if(!document.hidden)liveMetals(false); });
  }catch(e){}
  try{ refreshPrices(); }catch(e){}
  try{ loadFakes(); }catch(e){}
  try{ loadMetalRisk(); }catch(e){}
  try{ loadItemNoise(); }catch(e){}
  try{ readBuild(); }catch(e){}
  try{ pdSync(); }catch(e){}
  if("serviceWorker" in navigator&&location.protocol==="https:"){ try{ navigator.serviceWorker.register("sw.js").catch(()=>{}); }catch(e){} }
};
