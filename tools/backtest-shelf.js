const { chromium } = require(process.env.SP + '/node_modules/playwright');
const tags = require('/home/user/pawn-desk/seed-shelf-prices.json');
const rows = Array.isArray(tags) ? tags : (tags.rows || tags.tags);
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pg = await b.newPage({viewport:{width:1512,height:950}});
  pg.on('pageerror',e=>console.log('  !! '+e));
  await pg.goto('http://127.0.0.1:8099/index.html',{waitUntil:'load'});
  await pg.waitForTimeout(1400);
  /* Load the shelf tags the way Import does, minus the tag being tested, so
     nothing scores itself. */
  await pg.evaluate(r=>{ localStorage.setItem('pawndesk_seen',JSON.stringify(r)); }, rows);
  await pg.reload({waitUntil:'load'}); await pg.waitForTimeout(1400);
  console.log('shelf tags loaded: '+await pg.evaluate(()=>seenAll().length)+'\n');
  const out=[];
  for (const t of rows) {
    const q=[t.brand,t.model,t.name].filter(Boolean).join(' ').slice(0,70);
    const r = await pg.evaluate(async q=>{
      startOver(); await new Promise(r=>setTimeout(r,90));
      const i=document.getElementById('omniIn'); i.value=q;
      i.dispatchEvent(new Event('input',{bubbles:true})); await new Promise(r=>setTimeout(r,200));
      const pick=[...document.querySelectorAll('.omniRow')].filter(e=>!/sold prices|not on the lists/i.test(e.innerText));
      if(!pick.length)return null;
      pick[0].click(); await new Promise(r=>setTimeout(r,320));
      const seen=seenEstimate(seenMatch(calcItem()));
      if(seen&&!calcItem().checked){ st.market={kind:'seen',key:mkKey(),mid:seen.mid,n:seen.n,lo:seen.lo,hi:seen.hi}; render(); await new Promise(r=>setTimeout(r,60)); }
      const x=calcItem();
      return {item:st.bookName||x.item.name, cat:st.catId, checked:x.checked, via:(x.market&&x.market.kind)||'-',
              resale:Math.round(x.resale), loan:x.target, buy:x.buy};
    }, q);
    out.push({tag:t, got:r});
  }
  const hit=out.filter(o=>o.got&&o.got.checked);
  console.log('TAGS ON FILE: '+rows.length+'   PRICED BY THE TOOL: '+hit.length+'\n');
  console.log('item'.padEnd(34)+'their ask'.padStart(10)+'our resale'.padStart(11)+'ratio'.padStart(7)+'   our loan   our buy');
  const ratios=[];
  for (const o of hit) {
    const rat=o.got.resale/o.tag.ask; ratios.push(rat);
    console.log((o.tag.name||'').slice(0,33).padEnd(34)
      +('$'+o.tag.ask).padStart(10)+('$'+o.got.resale).padStart(11)
      +rat.toFixed(2).padStart(7)+('$'+o.got.loan).padStart(11)+('$'+o.got.buy).padStart(9)+'  '+o.got.via);
  }
  ratios.sort((a,b)=>a-b);
  const med=ratios.length?ratios[Math.floor(ratios.length/2)]:0;
  const within=ratios.filter(r=>r>=0.75&&r<=1.25).length;
  console.log('\nmedian ratio of our resale to their asking price: '+med.toFixed(2));
  console.log('within 25% of the ticket: '+within+' of '+ratios.length);
  console.log('\nnot priced (no built-in figure, would need a lookup):');
  out.filter(o=>!o.got||!o.got.checked).forEach(o=>console.log('   '+(o.tag.name||'').slice(0,46)+'   ticket $'+o.tag.ask+(o.got?'  -> '+o.got.item:'  -> no match')));
  await b.close();
})();
