
/* ===== PRICE CHECK — the phone version: identify it, get the resale value, check the asking price ===== */
window.PHONE=true;
function phAskNow(){ return (st.askKey===mkKey()&&st.ask>0)?st.ask:0; }
function phVerdictHTML(x){
  const ask=phAskNow(); if(!ask||!x.checked)return "";
  const resale=Math.round(x.resale), buy=x.buy, pct=Math.round(ask/resale*100), left=resale-ask;
  const catName=x.cat.label.toLowerCase();
  let cls,word,line;
  if(ask>=resale){ cls="pass"; word="Pass"; line=`They want ${money(ask)} &mdash; more than it resells for (${money(resale)}).`; }
  else if(ask<=buy){ cls="good"; word="Good buy"; line=`${money(ask)} is ${pct}% of what it resells for. You'd clear about <b>${money(left)}</b> when it sells, before any selling fees.`; }
  else if(pct<=Math.min(95,x.buyPct+20)){ cls="thin"; word="Thin"; line=`${money(ask)} is ${pct}% of what it resells for. That leaves about ${money(left)} &mdash; less room than you like. Offer <b>${money(buy)}</b>.`; }
  else { cls="pass"; word="Pass"; line=`${money(ask)} is ${pct}% of what it resells for. Not enough room. The most you'd normally pay is <b>${money(buy)}</b>.`; }
  return `<div class="phVerdict ${cls}"><div class="phWord">${word}</div><div class="phLine">${line}</div>
    <div class="phMath">Resells for about <b>${money(resale)}</b> &middot; your buy rate for ${esc(catName)} is ${x.buyPct}%, so you'd pay up to <b>${money(buy)}</b>.</div>${sitLine(x)?`<div class="phMath">${sitLine(x)}</div>`:""}</div>`;
}
function phoneStepHTML(x){
  const m=x.market, what=[st.brandTyped,st.model].filter(Boolean).join(" ")||displayName(x);
  const cands=(!x.checked&&!st.mpNone)?mpCandidates():[];
  const started=!!st.picked;
  const s1=started&&(x.checked||!cands.length), s2=started&&x.checked, s3=started&&x.checked&&!!st.condSet, ask=phAskNow();
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
    sub=`Search above and tap what it is &mdash; the resale value fills in from there.`;
    act="";
  } else if(cur===1){
    h=`Which ${esc(what)} is it?`;
    sub=`Pick one and the resale value fills in.`;
    act=cands.map(r=>`<button class="nsBtn" data-mp="${esc(r[0])}"><span>${esc(r[2])}</span><b>${money(r[3])}&ndash;${money(r[4])}</b><i>resale</i></button>`).join("")
       +`<button class="nsBtn ghost" id="nsNone"><span>Not one of these</span></button>`;
  } else if(cur===2){
    h=`What does it sell for, used?`;
    sub=`Tap a button to see what these actually sold for. Then type the middle price here.`;
    act=compTargets(x).map(t=>`<a class="nsBtn nsSold" data-label="${t.name}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${t.name}</span><b>&#8599;</b></a>`).join("")
       +`<div class="phIn"><span>$</span><input id="phVal" type="number" inputmode="decimal" placeholder="What it sells for"><button class="nsBtn on" id="phValGo"><span>Use it</span></button></div>`
       +(function(){ const E=seenEstimate(seenMatch(x)); return E?`<div class="label" style="margin-top:14px">Seen on shelves near you</div><button class="nsBtn on" id="seenUse"><span>${E.n} tag${E.n===1?"":"s"}, asking ${money(E.lo)}&ndash;${money(E.hi)}</span><b>${money(E.mid)}</b><i>use this</i></button>`:""; })()
       +`<div class="label" style="margin-top:14px">No sold prices? Use what it costs new</div>`
       +(CAP.sample?`<button class="nsBtn on" id="pdRetGo"><span>${retailBusy?"Looking it up&hellip;":"Look up the new price"}</span></button><div class="cardHint" id="pdRetMsg"></div>`:retailTargets(compQuery(x)).map(t=>`<a class="nsBtn nsRetail" data-label="${esc(t.name)}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${esc(t.name)}</span><b>&#8599;</b></a>`).join(""))
       +`<div class="phIn"><span>$</span><input id="phRet" type="number" inputmode="decimal" placeholder="What it costs new"><button class="nsBtn" id="phRetGo"><span>Use it</span></button></div>`
       +`<div class="cardHint">In ${esc(x.cat.label.toLowerCase())}, a used one books at about <b>${retailPct(x)}%</b> of new here &mdash; $100 new lands at ${money(Math.round(retailPct(x)))}. A real sold price beats this every time &mdash; use it only when the sold pages come up empty.</div>`;
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
  const src=x.checked?`<div class="phSrc">Resale value from ${m.kind==="list"?`<b>${esc(srcName(m.src))}</b>, checked ${esc(fmtDay(m.date))}. ${srcLink(m.src)}`:m.kind==="shot"?`${m.n} sold on ${esc(m.site||"the sold page")}. ${srcLink(m.url,"See those sales")}`:m.kind==="retail"?`${money(m.retail)} new retail, taken to ${(m.pct||retailPct())}% for used. Not a sold price.`:"the price you typed."}</div>`:"";
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
    st.brandTyped=""; st.model=""; st.detail=""; st.brand="mid"; st.phKindsOpen=false;
    st.market=null; st.mpPin=null; st.mpNone=true; st.condSet=false; st.editing=false; render();
  });
}
function phoneBoot(){
  document.body.classList.add("phone");
  document.title="Price Check";
  const h=document.querySelector(".brand h1"); if(h)h.textContent="Price Check";
  const e=document.querySelector(".brand .eyebrow"); if(e)e.textContent="Lamar's";
  try{
    renderTabs=function(){
      const btn=([id,l])=>`<button class="${st.mode===id?"on":""}" data-tab="${id}">${l}</button>`;
      document.getElementById("tabs").innerHTML=`<div class="pills">${[["item","Check a price"],["metal","Gold & silver"]].map(btn).join("")}</div>`;
    };
  }catch(x){}
  if(st.mode!=="item"&&st.mode!=="metal")st.mode="item";
  /* search: anything not on the lists can still be checked */
  try{
    const _rows=omniRows;
    omniRows=function(q){ const o=_rows(q), t=String(q||"").trim();
      if(t.length>=3){ const i=o.rows.findIndex(r=>r.kind==="sold"); o.rows.splice(i<0?o.rows.length:i,0,{kind:"phnew",q:t.slice(0,60)}); }
      return o; };
    const _rowHTML=omniRowHTML;
    omniRowHTML=function(r,i){ if(r.kind==="phnew")return `<button type="button" class="omniRow${i===st.omniHl?" hl":""}" data-omni="${i}" role="option"><span class="ot"><span class="on1">Something else: &ldquo;${esc(r.q)}&rdquo;</span><span class="on2">pick what kind of thing it is, then what it sells for</span></span><span class="ov">&rsaquo;</span></button>`; return _rowHTML(r,i); };
    const _pick=omniPick;
    omniPick=function(r){ if(r&&r.kind==="phnew"){ st.omniQ=""; st.omniHl=0; st.mode="item"; st.itemId=custId(st.catId); st.bookName=r.q;
        st.brandTyped=""; st.model=""; st.detail=""; st.brand="mid"; st.liq=null; st.market=null; st.mpPin=null; st.mpNone=true; st.condSet=false;
        st.phKindsOpen=true; st.omniDone=r.q; render(); const k=document.querySelector(".phKinds"); if(k&&k.scrollIntoView)k.scrollIntoView({block:"center"}); return; }
      st.phKindsOpen=false; return _pick(r); };
    const _render=render;
    render=function(){ _render(); const i=document.getElementById("omniIn"); if(i)i.placeholder="What are you looking at?"; };
  }catch(x){}
  try{ render(); }catch(x){}
}
document.addEventListener("DOMContentLoaded",phoneBoot);

