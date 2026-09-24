
/* ===== PRICE CHECK — the phone version: identify it, get the resale value, check the asking price ===== */
window.PHONE=true;
function phAskNow(){ return (st.askKey===mkKey()&&st.ask>0)?st.ask:0; }
function phVerdictHTML(x){
  /* The gate is the desk's ticket; the phone answers in this box instead, so
     it has to hold the same line or the counter just uses the phone. */
  const F=fakeState(fakeSheet(x));
  if(F&&F.blocks)return `<div class="phVerdict pass"><div class="phWord">${F.verdict==="fail"?"Stop":"Not checked"}</div>
    <div class="phLine">${F.verdict==="fail"
      ? `A check on the <b>${esc(F.sh.title.toLowerCase())}</b> sheet failed. Don't lend on the brand name — lend on what you can prove, or pass.`
      : F.verdict==="unsure"
      ? `${F.unsure} check${F.unsure===1?"":"s"} on the <b>${esc(F.sh.title.toLowerCase())}</b> sheet unresolved. Price only what you can verify today, not the name.`
      : `${F.done} of ${F.n} checks done on the <b>${esc(F.sh.title.toLowerCase())}</b> sheet. No price until they are answered.`}</div></div>`
    +fakeCardHTML(x);
  const ask=phAskNow(); if(!ask||!x.checked)return "";
  const resale=Math.round(x.resale), buy=x.buy, pct=Math.round(ask/resale*100), left=resale-ask;
  const catName=x.cat.label.toLowerCase();
  let cls,word,line;
  if(ask>=resale){ cls="pass"; word="Pass"; line=`They want ${money(ask)} &mdash; more than it resells for (${money(resale)}).`; }
  else if(ask<=buy){ cls="good"; word="Good buy"; line=`${money(ask)} is ${pct}% of what it resells for. You'd clear about <b>${money(left)}</b> when it sells, before any selling fees.`; }
  else if(pct<=Math.min(95,x.buyPct+20)){ cls="thin"; word="Thin"; line=`${money(ask)} is ${pct}% of what it resells for. That leaves about ${money(left)} &mdash; less room than you like. Offer <b>${money(buy)}</b>.`; }
  else { cls="pass"; word="Pass"; line=`${money(ask)} is ${pct}% of what it resells for. Not enough room. The most you'd normally pay is <b>${money(buy)}</b>.`; }
  return `<div class="phVerdict ${cls}"><div class="phWord">${word}</div><div class="phLine">${line}</div>
    <div class="phMath">Resells for about <b>${money(resale)}</b> &middot; your buy rate for ${esc(catName)} is ${x.buyPct}%, so you'd pay up to <b>${money(buy)}</b>.</div></div>`;
}
function phoneStepHTML(x){
  const m=x.market, what=[st.brandTyped,st.model].filter(Boolean).join(" ")||displayName(x);
  const cands=(!x.checked&&!st.mpNone)?mpCandidates():[];
  const started=!!st.picked;
  /* The model question was a pick-list and nothing else. When the desk had no
     rows to offer - a Samsung tablet, where it holds none - the list came
     back empty and step one ticked itself DONE: "What it is, Samsung Galaxy
     Tab", with a price under it. A Galaxy Tab runs from a Tab A7 Lite at
     about $45 to a Tab S9 Ultra ten times that. The one thing that decides
     the price was never asked for.

     An empty list is a question now, not an answer. Only where the maker
     matters - the same flag that turns the brand question on - because a
     wheelbarrow has no model plate to read. */
  const wantModel=started&&!x.checked&&!st.mpNone&&!st.model&&!cands.length&&!!(x.cat.brand&&x.cat.brand.on);
  /* THE PHONE WAS NAMING THINGS IT HAD NO WAY TO ASK FOR.
     "Still needs the make, what it sells for and the condition" is built
     from the same question list the desk uses - but the phone's own flow
     was four steps and none of them was the make. There was no field, on
     any screen, and the run could not be finished from the phone at all.
     So the make joins step one, in front of the model: the same list the
     desk filters, the same one tap that sets the spelling and the tier. */
  const _q=askQueue(x);
  const needs=(id)=>_q.some(z=>z.id===id&&!z.answered&&!z.optional);
  const wantBrand=started&&!x.checked&&needs("brand");
  const s1=started&&(x.checked||(!wantBrand&&!cands.length&&!wantModel)), s2=started&&x.checked, s3=started&&x.checked&&!!st.condSet, ask=phAskNow();
  const cur=!s1?1:!s2?2:!s3?3:4;
  const cw=COND_WORDS[st.cond]||["Good",""];
  const row=(n,label,val,done,id)=>`<div class="nsStep${done?" done":""}${cur===n?" cur":""}"><span class="nsDot">${done?"&#10003;":n}</span><span class="nsL">${label}</span><span class="nsV"${id?` id="${id}"`:""}>${val}</span></div>`;
  const steps=`<div class="nsSteps">
    ${row(1,"What it is",started?esc(what):"not set",s1)}
    ${row(2,"Resale value",x.checked?`${money(Math.round(x.resale))}<small>${esc(nsSrcShort(m))}${Math.round(x.resale)!==m.mid?`, in ${cw[0].toLowerCase()} shape`:""}</small>`:"not checked",s2)}
    ${row(3,"Condition",s3?cw[0]:"not set",s3)}
    ${row(4,"Asking price",ask?money(ask):"&mdash;",cur===4&&ask>0,"phAskV")}</div>`;
  let h="",sub="",act="";
  if(cur===1&&!started){
    h=`What are you looking at?`;
    /* The camera sits above this on the start screen, so pointing at the
       search box as the only way in reads as if it were not there. */
    sub=(CAP&&CAP.images)
      ?`<b>Take a picture</b> above and I'll work out what it is \u2014 or search and tap it, if you already know.`
      :`Search above and tap what it is &mdash; the resale value fills in from there.`;
    act="";
  } else if(cur===1&&wantBrand){
    /* Seeded from what is already known. The box said "DJI" - read off the
       search, or off a photo - while the hit list was computed from an
       empty query, so there was nothing under it to tap and nothing that
       recognised what was already written. A box with your own answer in
       it and no way to confirm it is a dead end. */
    const bq=st.brandQ||st.brandTyped||"";
    const hits=brandHits(st.catId,bq);
    h=`Who makes it?`;
    sub=`Start typing and tap it &mdash; that sets the spelling and where it sits in one go.`;
    /* The tier buttons are ALWAYS here. They used to appear only once
       something had been typed, so an empty box offered nothing at all -
       no hits, no tiers, no way forward. There is always a way forward. */
    act=`<div class="phIn"><input id="phBrand" type="text" placeholder="Make" value="${esc(bq)}"></div>`
      +(hits.length?hits.map(b=>`<button class="nsBtn" data-phbrand="${esc(b.name)}" data-phtier="${esc(b.tier)}"><span>${esc(b.name)}</span><b>${esc(tierLabel(x,b.tier))}</b></button>`).join("")
        :`<div class="cardHint">${bq?`<b>${esc(bq)}</b> is not on the list for `+esc(String(x.cat.label||"this").toLowerCase())+` &mdash; say where it sits instead.`
             :"Type a make above, or just say where it sits."}</div>`
          +BRANDS.map(br=>`<button class="nsBtn" data-phtieronly="${esc(br.id)}"><span>${esc(tierLabel(x,br.id))}</span></button>`).join(""));
  } else if(cur===1&&wantModel){
    h=`Which ${esc(what)} is it?`;
    sub=`The model decides the price here, and I don’t have a list for this one. Read it off the back, the label or the box.`;
    act=`<div class="phIn"><input id="phModel" type="text" autocapitalize="characters" placeholder="Model number" value="${esc(st.model||"")}"><button class="nsBtn on" id="phModelGo"><span>Use it</span></button></div>`
       +`<button class="nsBtn ghost" id="nsNone"><span>I can’t see a model</span></button>`;
  } else if(cur===1){
    h=`Which ${esc(what)} is it?`;
    sub=`Pick one and the resale value fills in.`;
    act=cands.map(r=>`<button class="nsBtn" data-mp="${esc(r[0])}"><span>${esc(r[2])}</span><b>${money(r[3])}&ndash;${money(r[4])}</b><i>resale</i></button>`).join("")
       +`<button class="nsBtn ghost" id="nsNone"><span>Not one of these</span></button>`;
  } else if(cur===2){
    h=`What does it sell for, used?`;
    /* This screen was every way of finding a price at once: two sold links, a
       box, the listings on file, Google Shopping, the new-price lookup and a
       second box - nine controls, and the one that actually does the work
       was in the middle of them. The one that does the work leads now and
       the rest folds away. */
    const manual=compTargets(x).map(t=>`<a class="nsBtn nsSold" data-label="${t.name}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${t.name}</span><b>&#8599;</b></a>`).join("")
       +`<div class="phIn"><span>$</span><input id="phVal" type="number" inputmode="decimal" placeholder="What it sells for"><button class="nsBtn on" id="phValGo"><span>Use it</span></button></div>`
       +altSourcesHTML(x,true)
       +`<div class="label" style="margin-top:14px">No sold prices? Use what it costs new</div>`
       +(CAP.sample?`<button class="nsBtn on" id="pdRetGo"><span>${retailBusy?"Looking it up&hellip;":"Look up the new price"}</span></button><div class="cardHint" id="pdRetMsg"></div>`:retailTargets(compQuery(x)).map(t=>`<a class="nsBtn nsRetail" data-label="${esc(t.name)}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${esc(t.name)}</span><b>&#8599;</b></a>`).join(""))
       +`<div class="phIn"><span>$</span><input id="phRet" type="number" inputmode="decimal" placeholder="What it costs new"><button class="nsBtn" id="phRetGo"><span>Use it</span></button></div>`
       +`<div class="cardHint">In ${esc(x.cat.label.toLowerCase())}, a used one books at about <b>${retailPct(x)}%</b> of new here &mdash; $100 new lands at ${money(Math.round(retailPct(x)))}. A real sold price beats this every time &mdash; use it only when the sold pages come up empty.</div>`;
    if(CAP.sample){
      sub=`One tap searches the sold pages, the used listings and what it costs new, all at once.`;
      act=`<button class="nsBtn${x.checked?" ghost":" on"}" id="pdFindGo"><span>${findBusy?"Looking it up&hellip;":x.checked?"Look it up again":"Look it up \u2014 everywhere"}</span></button>`
         +`<div class="cardHint" id="pdFindMsg">${esc(findMsg||"")}</div>`
         +evidenceHTML()
         +`<details class="phKinds" id="phMore"${st.phMoreOpen?" open":""}><summary>Look it up myself</summary>
            <div style="margin-top:10px">${manual}</div></details>`;
    } else {
      sub=`Tap a button to see what these actually sold for. Then type the middle price here.`;
      act=manual;
    }
  } else if(cur===3){
    h=`What shape is it in?`;
    sub=`Next to a typical used one. The resale value assumes <b>Good</b>, normal wear.`;
    act=CONDITIONS.map(c=>{ const w=COND_WORDS[c.id]||[c.label,""]; return `<button class="nsBtn" data-ncond="${c.id}"><span>${w[0]}</span><b>${w[1]}</b></button>`; }).join("");
  } else {
    h=ask?"":`What are they asking?`;
    act=`<div class="phIn big"><span>$</span><input id="phAsk" type="number" inputmode="decimal" placeholder="Their price" value="${ask||""}"></div>
      <div id="phVerdictBox">${phVerdictHTML(x)}</div>
      <button class="nsBtn ghost" id="nsCond" data-ncond="${st.cond}"><span>Condition: ${cw[0]} &mdash; change</span></button>`;
  }
  /* Once there is a price this card moves past step 2, and with it went the
     one button that does the searching. It belongs on every step after the
     item is known, the same as on the desk. */
  /* Not on step one. "Look it up - everywhere" was being pushed in ABOVE
     the answer field for the question actually being asked, so the biggest
     green button on the screen belonged to a different step and the make
     box sat under it looking like an afterthought. Nothing can be looked
     up before the desk knows what it is anyway. */
  if(CAP.sample&&started&&cur>2)
    act=`<button class="nsBtn${x.checked?" ghost":" on"}" id="pdFindGo"><span>${findBusy?"Looking it up&hellip;":x.checked?"Look it up again":"Look it up \u2014 everywhere"}</span></button>`
        +`<div class="cardHint" id="pdFindMsg">${esc(findMsg||"")}</div>`+evidenceHTML()+act;
  const src=x.checked?`<div class="phSrc">Resale value from ${m.kind==="list"?`<b>${esc(srcName(m.src))}</b>, checked ${esc(fmtDay(m.date))}. ${srcLink(m.src)}`:m.kind==="shot"?`${m.n} sold on ${esc(m.site||"the sold page")}. ${srcLink(m.url,"See those sales")}`:m.kind==="retail"?`${money(m.retail)} new retail, taken to ${(m.pct||retailPct())}% for used. Not a sold price.`:m.kind==="found"?`${m.n} listing${m.n===1?"":"s"} on file, middle one ${money(m.med)} (middle half ${money(m.lo)}&ndash;${money(m.hi)})${m.mostlyAsks?", mostly asks rather than sales":""}.${m.from?` From ${esc(m.from)}.`:""}`:m.kind==="seen"?`${m.n} shelf tag${m.n===1?"":"s"} you recorded, asking ${money(m.lo)}&ndash;${money(m.hi)} \u2014 what a used one goes for at a shop near you.`:"the price you typed."}</div>`:"";
  const kinds=`<details class="phKinds"${st.phKindsOpen?" open":""}><summary>${st.phKindsOpen?"What kind of thing is it?":"Wrong kind of item?"}</summary><div class="phKindRow">${CATALOG.map(c=>`<button class="nsBtn${c.id===st.catId?" on":""}" data-phcat="${c.id}"><span>${c.label}</span></button>`).join("")}</div></details>`;
  return `<div class="card nextStep" id="nextStep"><div class="nsGrid">${steps}
    <div class="nsMain">${h?`<div class="nsH">${h}</div>`:""}${sub?`<div class="nsSub">${sub}</div>`:""}<div class="nsAct">${act}</div>${src}</div></div>${kinds}</div>`;
}
function wirePhone(){
  const ns=document.getElementById("nextStep"); if(!ns)return;
  ns.querySelectorAll("[data-mp]").forEach(b=>b.onclick=()=>{
    const r=MP_BY_ID[b.dataset.mp]; if(!r)return;
    let name=r[2]; const bt=(st.brandTyped||"").trim();
    if(bt&&name.toLowerCase().indexOf(bt.toLowerCase()+" ")===0)name=name.slice(bt.length+1);
    st.model=name; st.mpPin={id:r[0],model:name}; st.mpNone=false; st.market=null; render();
  });
  const none=document.getElementById("nsNone"); if(none)none.onclick=()=>{ st.mpNone=true; render(); };
  {
    const bi=document.getElementById("phBrand");
    if(bi)bi.oninput=()=>{ st.brandQ=bi.value; render();
      const again=document.getElementById("phBrand");
      if(again){ again.focus(); again.setSelectionRange(again.value.length,again.value.length); } };
  }
  ns.querySelectorAll("[data-phbrand]").forEach(b=>b.onclick=()=>{
    st.brandTyped=b.dataset.phbrand; st.brand=b.dataset.phtier; st.brandSet=true;
    st.brandQ=b.dataset.phbrand; st.mpPin=null; st.market=null; render(); });
  ns.querySelectorAll("[data-phtieronly]").forEach(b=>b.onclick=()=>{
    st.brand=b.dataset.phtieronly; st.brandSet=true; render(); });
  /* Typed by hand when the desk has no list. Enter does the same as the
     button, because a phone keyboard puts Enter under the thumb. */
  {
    const mi=document.getElementById("phModel"), mg=document.getElementById("phModelGo");
    const go=()=>{ const v=String(mi&&mi.value||"").trim().slice(0,60);
      if(!v){ st.mpNone=true; } else { st.model=v; st.market=null; st.mpPin=null; }
      render(); };
    if(mg)mg.onclick=go;
    if(mi)mi.onkeydown=e=>{ if(e.key==="Enter"){ e.preventDefault(); go(); } };
  }
  const more=document.getElementById("phMore");
  if(more&&!more.dataset.w){ more.dataset.w="1"; more.addEventListener("toggle",()=>{ st.phMoreOpen=more.open; }); }
  const vi=document.getElementById("phVal"), vg=document.getElementById("phValGo");
  const useVal=()=>{ const n=parseFloat(vi&&vi.value); if(n>0){ st.market={kind:"hand",key:mkKey(),mid:Math.round(n)}; render(); } };
  if(vg)vg.onclick=useVal; if(vi)vi.onkeydown=e=>{ if(e.key==="Enter")useVal(); };
  const ri=document.getElementById("phRet"), rg=document.getElementById("phRetGo");
  const useRetail=()=>{ const n=parseFloat(ri&&ri.value);
    if(n>0){ const p=retailPct(calcItem()); st.market={kind:"retail",key:mkKey(),retail:Math.round(n),pct:p,mid:Math.max(5,Math.round(n*p/100/5)*5)}; render(); } };
  if(rg)rg.onclick=useRetail; if(ri)ri.onkeydown=e=>{ if(e.key==="Enter")useRetail(); };
  ns.querySelectorAll("[data-ncond]").forEach(b=>b.onclick=()=>{
    if(b.id==="nsCond"){ st.condSet=false; render(); return; }
    st.cond=b.dataset.ncond; st.condSet=true; render();
    const a=document.getElementById("phAsk"); if(a&&!phAskNow())a.focus();
  });
  const ai=document.getElementById("phAsk");
  if(ai)ai.oninput=()=>{ const n=parseFloat(ai.value); st.ask=n>0?n:0; st.askKey=mkKey();
    const x=calcItem(), vb=document.getElementById("phVerdictBox"); if(vb)vb.innerHTML=phVerdictHTML(x);
    const v=document.getElementById("phAskV"); if(v)v.innerHTML=st.ask?money(st.ask):"&mdash;"; };
  ns.querySelectorAll("[data-phcat]").forEach(b=>b.onclick=()=>{
    const c=b.dataset.phcat, nm=((isCustom()&&st.bookName)||[st.brandTyped,st.model].filter(Boolean).join(" ")||"").slice(0,60);
    st.catId=c; st.itemId=custId(c); st.bookName=nm||"Something else"; st.liq=null;
    st.brandTyped=""; st.model=""; st.detail=""; st.phKindsOpen=false;
    /* the brand is sitting in what was typed - read the tier off it */
    const bh=nm?brandInText(c,nm):null; st.brand=bh?bh.tier:"mid";
    st.market=null; st.mpPin=null; st.mpNone=true; st.condSet=false; st.editing=false; render();
  });
}
function phoneBoot(){
  document.body.classList.add("phone");
  /* The phone used to rename itself "Price Check", from when it really was
     a cut-down thing: point the camera, get a number. It now carries the
     scale, Setup, the shelf tags, the deal log, the walk-away list and the
     price-list builder - everything the desk has. Calling it something
     smaller told the counter they were holding a lesser copy of the tool. */
  document.title="The Pawn Desk";
  const e=document.querySelector(".brand .eyebrow"); if(e)e.textContent="Lamar's";
  try{
    /* THE DOCK. These were a wrapping pill strip along the TOP of the
       phone - two rows of them at 360px wide, in the one band of the
       screen a hand holding the phone cannot reach, and 192px of a 780px
       screen gone before the item got a pixel.

       Same three places, same data-tab, same handler. A drawing over one
       word, fixed along the bottom, the current one lit rather than
       filled: a bottom bar reads as where you ARE, and a solid pill under
       the thumb reads as a button waiting to be pressed.

       "Simple view" is not here any more. It was a tab that appeared and
       disappeared, which is the one thing a bottom bar must never do -
       and .snapPin already rides the top of the detailed screen saying
       the same thing in more words. */
    const DOCK=[
      ["item","Price","Check a price",
       '<path d="M3 11.5V4.5A1.5 1.5 0 0 1 4.5 3h7L21 12.5 12.5 21 3 11.5Z"/><circle cx="7.6" cy="7.6" r="1.3"/>'],
      ["metal","Gold","Gold & silver",
       '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.4v9.2M9.6 9.6h4a1.9 1.9 0 0 1 0 3.8h-3.6a1.9 1.9 0 0 0 0 3.8h4"/>'],
      ["setup","Setup","Setup",
       '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.6v3M12 18.4v3M21.4 12h-3M5.6 12h-3M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1M18.6 18.6l-2.1-2.1M7.5 7.5 5.4 5.4"/>'],
    ];
    renderTabs=function(){
      document.getElementById("tabs").innerHTML=DOCK.map(([id,short,full,icon])=>
        `<button class="${st.mode===id?"on":""}" data-tab="${id}" aria-label="${full}"`+
        `${st.mode===id?' aria-current="page"':""}>`+
        `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><i>${short}</i></button>`).join("");
    };
  }catch(x){}
  if(st.mode!=="item"&&st.mode!=="metal"&&st.mode!=="setup")st.mode="item";
  /* Snap -> price replaces the whole item page here. The detailed one is a
     tap away and everything in it still works; it is simply not what you
     want in your hand in somebody's driveway. */
  try{
    const _item=renderItem;
    /* The way out of the detailed view used to live only in the tab bar,
       which scrolls away - so two screens down there was no visible way
       back and the counter was simply stranded. It rides along the top
       now, pinned, wherever you are on the page. */
    renderItem=function(){
      if(snapOn())return snapHTML();
      return `<button class="snapPin" id="snapBackTop">&lsaquo; Back to the simple screen</button>`
             +_item.apply(this,arguments);
    };
    const _wire=wireItem;
    wireItem=function(){
      _wire.apply(this,arguments);
      const more=document.getElementById("snapMore");
      if(more)more.onclick=()=>{ st.snapDetail=true; render(); };
      /* The hero's four circular actions, and the evidence row, which is
         the same "look it up" in a different shape. */
      document.querySelectorAll("[data-whome]").forEach(btn=>btn.onclick=()=>{
        const a=btn.dataset.whome;
        if(a==="snap"){ const c=document.getElementById("photoCam"); if(c)c.click(); return; }
        if(a==="gold"){ st.mode="metal"; render(); return; }
        if(a==="log"){ st.mode="log"; render(); return; }
        if(a==="type"){ const i2=document.getElementById("omniIn");
                        if(i2){ i2.focus(); try{ i2.scrollIntoView({block:"center"}); }catch(e){} } return; }
      });
      document.querySelectorAll("[data-wact]").forEach(btn=>btn.onclick=()=>{
        const a=btn.dataset.wact;
        if(a==="look"){ try{ priceFind(null,true); }catch(e){} return; }
        if(a==="more"){ st.snapDetail=true; render(); return; }
        if(a==="new"){ const b2=document.getElementById("pinNew"); if(b2)b2.click();
                       else { st.picked=false; st.omniDone=""; st.market=null; render(); } return; }
        if(a==="log"){ st.mode="log"; render(); return; }
      });
      /* Naming what is missing and leaving the counter to find it was the
         bug. The same tap that reads the sentence opens the screen the
         answers live on. */
      const ans=document.getElementById("snapAnswer");
      if(ans)ans.onclick=()=>{ st.snapDetail=true; render(); };
      /* The four questions. Kept in state as they are typed, so a re-render
         never wipes what has been entered. */
      document.querySelectorAll("[data-hint]").forEach(inp=>{
        inp.oninput=()=>{ st.photoHints=Object.assign({},st.photoHints,{[inp.dataset.hint]:inp.value}); };
      });
      try{ wireLook(); }catch(e){}
      const again=document.getElementById("snapAgain");
      if(again)again.onclick=()=>{ if(photoFile)runPhotoRead(); };
      const keep=document.getElementById("snapKeep");
      if(keep)keep.onclick=async()=>{
        if(!photoFile)return;
        keep.disabled=true; keep.textContent="Kept";
        await shotSave(photoFile,{what:(st.photoRead&&st.photoRead.what)||"",
                                  hints:Object.assign({},st.photoHints)});
        shotsRefresh();
      };
      const fold=document.getElementById("shotFold");
      if(fold&&!fold.dataset.w){ fold.dataset.w="1";
        fold.addEventListener("toggle",()=>{ st.shelfOpen=fold.open; }); }
      document.querySelectorAll("[data-shot]").forEach(btn=>{
        btn.onclick=async()=>{
          const rec=SHOTS.find(z=>z.id===btn.dataset.shot); if(!rec)return;
          photoFile=rec.blob; st.photoHints=Object.assign({},rec.hints||{});
          st.photoRead=null; st.photoErr=null; render(); runPhotoRead();
        };
      });
      document.querySelectorAll("[data-shotdrop]").forEach(btn=>{
        btn.onclick=async()=>{ await shotDrop(btn.dataset.shotdrop); shotsRefresh(); };
      });
      /* Placing a read-but-unplaced item by hand is the same moment as a
         photo naming one: it now knows what the thing is, so go and price
         it rather than leaving the built-in guess on screen. */
      document.querySelectorAll(".snapCard [data-cat]").forEach(btn=>{
        const prev=btn.onclick;
        btn.onclick=ev=>{ if(prev)prev(ev); setTimeout(()=>{ try{ snapPriceAfterPhoto(); }catch(e){} },0); };
      });
      ["snapBack","snapBackTop"].forEach(id=>{
        const back=document.getElementById(id);
        if(back)back.onclick=()=>{ st.snapDetail=false; window.scrollTo(0,0); render(); };
      });
    };
    /* When a photo names the thing, go and get its price without being asked. */
    const _apply=applyPhotoRead;
    applyPhotoRead=function(r){ _apply.apply(this,arguments);
      if(snapOn())setTimeout(()=>{ try{ snapPriceAfterPhoto(); }catch(e){} },0); };
  }catch(x){}
  /* search: anything not on the lists can still be checked */
  try{
    const _render=render;
    render=function(){ _render(); const i=document.getElementById("omniIn"); if(i)i.placeholder="What are you looking at?"; };
  }catch(x){}
  try{ render(); }catch(x){}
  try{ shotsRefresh(); }catch(x){}
}
document.addEventListener("DOMContentLoaded",phoneBoot);

/* ================= SNAP -> PRICE ==========================================
   What this is for, in one line: you are walking a yard sale, you see
   something, you photograph it, and the phone tells you the most you should
   pay. That is the whole job. Everything else the desk can do - categories,
   rates, the deal log, the step cards - is behind one fold, because on a
   driveway it is in the way.

   The desk is untouched. This replaces renderItem on the phone only. */
function snapOn(){ return window.PHONE && !st.snapDetail; }

/* After a photo names the thing, price it without being asked. Tapping a
   second button to find out what it is worth is the tap this screen exists
   to remove. One lookup, and it reuses listings already on file. */
let snapAuto=false;
async function snapPriceAfterPhoto(){
  if(snapAuto||!CAP.sample||!st.picked)return;
  const x=calcItem(); if(x.checked)return;
  snapAuto=true;
  try{ await priceFind(); }catch(e){}
  snapAuto=false;
  render();
}

function snapHTML(){
  const x=calcItem();
  const has=st.picked, F=fakeState(fakeSheet(x));
  const name=[st.brandTyped,st.model].filter(Boolean).join(" ")||(has?displayName(x):"");
  const bits=[st.detail,COND_WORDS[st.cond]&&COND_WORDS[st.cond][0]].filter(Boolean).join(" \u00b7 ");

  /* The camera, full width, before anything else. */
  /* Written out rather than reusing camButtonHTML: that one carries an inline
     style, and an inline style beats any rule aimed at it - which is how the
     button ended up sharing a row instead of owning one. */
  const camOn=CAP.sample&&CAP.images;
  /* Switched off, this is the 524px setup card - and it was sitting between
     the header and the number, so on an 844px phone "Pay up to" landed below
     the fold. Nothing is being set up while something is on the counter; the
     price leads and the invitation goes to the foot as a line. The desk has
     held this line since the rail went in. Before anything is picked the full
     card stays at the top: that IS the phone's first move. */
  const cam=camOn
    ? `<div class="snapCam">
        <label class="brassBtn camBtn snapShoot">\uD83D\uDCF7 Take a picture<input id="photoCam" type="file" accept="image/*" capture="environment" style="display:none"></label>
        ${photoBusy
          ? `<div class="snapBusy">Reading the picture\u2026 <button class="ghostBtn" id="photoStop">Stop</button></div>`
          : `<label class="snapAlt">or choose one already on the phone<input id="photoIn" type="file" accept="image/jpeg,image/png,image/webp" style="display:none"></label>`}
        ${photoErrHTML()}
       </div>`
    : (has ? "" : pdConnectHTML());
  const camOff=(!camOn&&has)
    ? `<div class="snapOff">Not connected \u2014 no sold-price lookups.
        <button class="ghostBtn" data-gotab="setup" type="button">Set it up</button></div>`
    : "";

  /* Read, but not placed: say what was seen rather than showing an empty
     camera screen as though nothing had happened. */
  const un=st.photoRead&&st.photoRead.unplaced?st.photoRead:null;
  /* THE FRONT PAGE IS A BALANCE SCREEN.
     Same shape as the item screen, because that is what makes it one
     app: a hero carrying today's one number, the four things you can
     start, then a feed of what has actually been priced. It used to be
     a camera button, a search box and a tip, with the bottom two thirds
     of the screen empty - the complaint that started this redesign. */
  if(!has){
    /* Same two functions the desk calls. This used to be its own copy of
       the hero and the feed, which is how two screens become two apps. */
    const t=(typeof homeToday==="function")?homeToday():{rows:[]};
    return `<div class="snapWrap">
      ${homeHeroHTML({})}
      ${un?snapHelpHTML(un):""}
      ${omniHTML()}
      ${t.rows.length?homeFeedHTML(4)
        :`<div class="snapTip">Fill the frame \u2014 a model plate or a label beats the whole object in shot.</div>`}
      ${snapShelfHTML()}
    </div>`;
  }

  /* A gated sheet means no price until it is worked - the phone must hold the
     same line the desk does, or the counter just uses the phone. */
  if(F&&F.blocks) return `<div class="snapWrap">${cam}
    <div class="snapName">${esc(name)}</div>
    ${phVerdictHTML(x)}
    ${camOff}${snapFootHTML()}</div>`;

  const priced=x.checked;
  const busy=(typeof findBusy!=="undefined"&&findBusy)||snapAuto;
  /* "out of a buy" was right when the floor only governed buying. It now
     governs the loan too - an unredeemed one leaves you owning the thing
     with the same hauling and listing - so the phone says both. */
  /* The phone's front screen led with a figure the instant something was
     picked, which is exactly where the Samsung tablet said "pay up to $40"
     having never been asked which tablet it was. Walk-away is gated too: it
     is a verdict on a price, so it needs the same run behind it. */
  const ready=priceReady(x);
  /* THE NUMBER IS THE SCREEN.
     It used to be a 12px mono label - "NO PRICE YET" - over a sentence,
     with the offer, when there was one, as one more line of text among
     six cards of them. The one thing somebody at a counter is holding
     this phone to find out was the same size as everything else on it.

     It is the anchor now: a 270-degree arc round an enormous numeral, the
     same dial the desk has always drawn for the loan. Unpriced, the arc
     is how far through the run you are and the numeral is a dash - so
     "not yet" is a thing you can SEE the size of, and tapping on is
     obviously the way to fill it. */
  const q=(typeof askQueue==="function")?askQueue(x):[];
  const done=q.filter(z=>z.answered||z.optional).length;

  /* ══ THE WALLET ═══════════════════════════════════════════════════
     Design A, picked from three live samples. The thing being priced
     IS a card: a saturated panel carrying one enormous figure, the
     four things you can do to it as circular actions directly
     beneath, and everything else - the evidence, the loan, the
     arithmetic - as icon-led rows with the value on the right.

     The hierarchy still follows the state, because that rule outlives
     any skin: with no price the hero carries the item and how far
     through the run you are, and the QUESTION comes first underneath,
     inline, never behind a button. With a price the number is the
     screen. */
  const ICON={
    look:'<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
    log :'<path d="M5 4h11l3 3v13H5z"/><path d="M9 9h6M9 13h6"/>',
    add :'<path d="M12 5v14M5 12h14"/>',
    more:'<path d="M4 7h16M4 12h16M4 17h10"/>',
    ev  :'<path d="M3 17l5-6 4 4 5-7 4 5"/>',
    lend:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    math:'<path d="M4 18V9M10 18V5M16 18v-6M2 21h20"/>',
    warn:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2v.1"/>'
  };
  const act=(id,label,icon,on)=>`<button class="act" data-wact="${id}"${on?"":" disabled"}>`
    +`<i><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></i><span>${label}</span></button>`;
  const canLook=!!(CAP.sample&&!ebayBlind(x));
  const actions=`<div class="acts">
    ${act("look",busy?"Looking\u2026":"Look up",ICON.look,canLook&&!busy)}
    ${act("log","Log it",ICON.log,ready)}
    ${act("new","Another",ICON.add,true)}
    ${act("more","Detail",ICON.more,true)}
  </div>`;

  const hero = busy&&ready
    ? `<div class="hero"><div class="heroWho">Checking what it sells for\u2026</div>
        <div class="heroWhat">${esc(name)}${bits?" \u00b7 "+esc(bits):""}</div>
        <div class="heroLab">Pay up to</div><div class="heroBig">${money(x.buy)}</div>
        <div class="heroSub">${esc(findMsg||"Searching the sold pages\u2026")} The built-in number stands until it lands.</div>
        ${actions}</div>`
    : !ready
    ? `<div class="hero"><div class="heroWho">On the counter</div>
        <div class="heroWhat">${esc(name)}${bits?" \u00b7 "+esc(bits):""}</div>
        <div class="heroLab">${q.length?done+" of "+q.length+" answered":"nothing answered yet"}</div>
        <div class="heroSub" style="margin-top:4px">No price until the run is finished.</div>
        <div class="heroBar"><i style="width:${q.length?Math.round(done/q.length*100):0}%"></i></div>
        ${actions}</div>`
    : x.buyTooThin
    ? `<div class="hero"><div class="heroWho">On the counter</div>
        <div class="heroWhat">${esc(name)}${bits?" \u00b7 "+esc(bits):""}</div>
        <div class="heroLab">Walk away</div>
        <div class="heroBig bad">&mdash;</div>
        <div class="heroSub">Clearing the ${money(x.buyFloor)} you want leaves ${money(x.buy)} to offer. Not worth buying, and not worth lending on.</div>
        ${actions}</div>`
    : `<div class="hero"><div class="heroWho">On the counter</div>
        <div class="heroWhat">${esc(name)}${bits?" \u00b7 "+esc(bits):""}</div>
        <div class="heroLab">Pay up to</div>
        <div class="heroBig">${money(x.buy)}</div>
        <div class="heroSub">Resells ${money(Math.round(x.resale))} \u00b7 you make ${money(x.buyMargin)}</div>
        ${actions}</div>`;

  /* The evidence row carries the meter the desk grew: how much is behind
     the number, at a glance, without reading a sentence. */
  const m=x.market, mk=m&&m.kind;
  const evid=(()=>{
    if(!m||!x.checked)
      return {b:"Not looked up",s:"the desk's own starting point",pct:0,tone:"none"};
    if(mk==="found"||mk==="harvest"){
      const n=m.n||0,sold=m.sold||0,share=n?sold/n:0;
      return {b:(m.from?esc(srcName(m.from)):"eBay")+" sold prices",
              s:sold+" of "+n+" were sales",pct:Math.round(share*100),tone:share>=0.5?"":"warn"};
    }
    /* The headline is a verdict, never a hostname - "Underpriced prices"
       was the same slip as the bare "Swappa", wearing a noun. */
    if(mk==="list")return {b:"Desk price list",
                           s:esc(srcName(m.src))+", as of "+esc(fmtDay(m.date))+" \u00b7 not re-checked",
                           pct:m.conf==="h"?100:m.conf==="l"?28:62,tone:m.conf==="h"?"":"warn"};
    return {b:"Checked",s:esc(checkedNote(x)),pct:100,tone:""};
  })();

  /* THE EVIDENCE ROW IS NOT GATED ON "IS THE RUN FINISHED".
     check-pricing caught this once already and caught it again when the
     wallet went in: an item can carry twelve looked-up sales while the
     run is still asking about the battery, and hiding the weight of real
     evidence is the opposite of the point. It shows as soon as anything
     has been looked up. The loan and the arithmetic still wait for a
     price, because until then there is no loan and no arithmetic. */
  const evRow = (ready||x.checked) ? `
    ${ready?`<div class="wSect">Behind this number</div>`:""}
    <button class="wRow${ready?"":" tight"}" data-wact="look">
      <i><svg viewBox="0 0 24 24" aria-hidden="true">${ICON.ev}</svg></i>
      <div class="t"><b>${evid.b}</b>${ready?`<span>${evid.s}</span>`:""}
        <div class="wBar"><i class="${evid.tone}" style="width:${Math.max(3,evid.pct)}%"></i></div></div>
    </button>` : "";
  const rows = ready ? `
    <div class="wRow"><i><svg viewBox="0 0 24 24" aria-hidden="true">${ICON.lend}</svg></i>
      <div class="t"><b>Lend him</b><span>60-day pawn loan</span></div>
      <div class="v">${x.buyTooThin?"&mdash;":money(x.target)}</div></div>
    <div class="wRow"><i><svg viewBox="0 0 24 24" aria-hidden="true">${ICON.math}</svg></i>
      <div class="t"><b>Your cushion</b><span>fee ${money(x.charge)} \u00b7 loan \u00f7 resale ${x.ltv}%</span></div>
      <div class="v">${money(x.margin)}</div></div>` : "";

  return `<div class="snapWrap${ready?" ready":""}">${cam}
    ${hero}
    ${/* No price yet: the question is the first thing under the hero,
          inline. askHTML is the same component the detailed screen uses,
          so there is nothing over there that is not already here. */""}
    ${!ready?`<div class="card wAsk">${typeof askHTML==="function"?askHTML(x):""}</div>`:""}
    ${/* Condition is one of the questions while the run is on, so it is
          asked there. Once priced it comes back as its own strip: it is
          the one thing you change again and again as you look the thing
          over. */""}
    ${ready?`<div class="wSect">Shape it is in</div>
      <div class="snapCond">${CONDITIONS.map(c=>`<button class="${st.condSet&&c.id===st.cond?"on":""}" data-cond="${c.id}">${c.label.replace("New in box","New")}</button>`).join("")}</div>`:""}
    ${evRow}${rows}
    ${camOff}
  </div>`;
}
function snapFootHTML(){
  return `<div class="snapFoot">
    <button class="ghostBtn" id="pinNew">Price another</button>
    <button class="ghostBtn" id="snapMore">All the detail &rsaquo;</button>
  </div>`;
}

/* ---- when it cannot place it: ask, don't shrug -------------------------
   The counter is holding the thing. They can read the stamp the camera
   could not, turn it over, feel the weight. Four short questions put that
   into the next read, which is a far better use of their ten seconds than
   scrolling a category list. */
const SNAP_Q=[["words","Any words, names or logos on it?","Stihl, Craftsman, a logo\u2026"],
              ["nums","Any numbers or a model on it?","MS 250, 12 GA, a serial\u2026"],
              ["size","Roughly how big is it?","fits one hand / two feet long\u2026"],
              ["made","What is it made of?","steel, plastic, wood, gold-coloured\u2026"]];
function snapHelpHTML(un){
  const h=st.photoHints||{};
  return `<div class="snapCard" style="border-color:rgba(255,201,143,.45)">
    <div class="snapLab">I read the picture as</div>
    <div class="snapName" style="margin-top:6px">${esc(un.what||"\u2014 couldn\u2019t tell \u2014")}</div>
    <div class="snapSub">${un.what
      ? ((st.photoLook&&st.photoLook.busy)
          ? "It\u2019s not on my lists, so I\u2019m searching the web for it now. Answer these while you wait and I\u2019ll have both."
          : "I can\u2019t place it on my lists, so I can\u2019t price it yet. Tell me what you can see and I\u2019ll look again \u2014 you\u2019re holding it, I\u2019m not.")
      : "The picture didn\u2019t give me enough. Tell me what you can see and I\u2019ll look again, or take another shot closer in."}</div>
    ${un.note?`<div class="snapSrc">${esc(un.note)}</div>`:""}
    ${photoLookHTML()}
    <div class="snapAsk">
      ${SNAP_Q.map(([k,q,ph])=>`<label><span>${esc(q)}</span>
        <input data-hint="${k}" type="text" autocomplete="off" placeholder="${esc(ph)}" value="${esc(String(h[k]||""))}"></label>`).join("")}
    </div>
    <div class="snapFoot" style="margin-top:12px">
      <button class="brassBtn" id="snapAgain"${photoBusy?" disabled":""}>${photoBusy?"Looking again\u2026":"Look again with this"}</button>
      <button class="ghostBtn" id="snapKeep"${st.shotKept?" disabled":""}>${st.shotKept?"Picture kept":"Keep the picture for later"}</button>
    </div>
    <div class="snapSrc">Or just tell me the kind of thing it is:</div>
    <div class="snapCond" style="margin-top:8px">${CATALOG.map(c=>
      `<button data-cat="${c.id}" style="flex:1 1 45%">${esc(c.label)}</button>`).join("")}</div>
  </div>`;
}
/* Pictures put by, waiting for a quiet evening. */
function snapShelfHTML(){
  if(!SHOTS.length)return "";
  return `<details class="fold"${st.shelfOpen?" open":""} id="shotFold">
    <summary class="foldLine">${SHOTS.length} picture${SHOTS.length===1?"":"s"} kept for later</summary>
    <div class="shotGrid">${SHOTS.map(sh=>`<div class="shotItem">
      <img src="${URL.createObjectURL(sh.blob)}" alt="">
      <div class="shotWhat">${esc(sh.what||"not identified")}</div>
      <div class="shotWhen">${new Date(sh.ts).toLocaleDateString()}</div>
      <div class="row2" style="gap:6px;margin-top:6px">
        <button class="ghostBtn" data-shot="${sh.id}" style="flex:1;padding:8px 10px;font-size:12px">Try again</button>
        <button class="ghostBtn" data-shotdrop="${sh.id}" style="padding:8px 10px;font-size:12px">&times;</button>
      </div></div>`).join("")}</div>
  </details>`;
}
