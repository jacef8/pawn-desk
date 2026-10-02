#!/usr/bin/env node
/* The middle, and a fence that cannot close on it.
 *
 *   python3 -m http.server 8099 &
 *   node tools/check-middle.mjs
 *
 * TWO BUGS, ONE IDEA. Both came from reading a pile of sales wrongly.
 *
 * The fence. Outliers were cut at 1.5x the middle half, the textbook rule,
 * which collapses when most of a list sits on one round number: the spread
 * goes to zero, the fence closes to that single point, and every other sale
 * is absurd. 20 at $200 with a $240 and a $300 in the list reported "$200 to
 * $200 from 20 sales" - false confidence, and the $240 thrown out as "way
 * above the rest". The fence is now the wider of the spread rule and a flat
 * third-to-triple of the middle, so a sale must be absurd by BOTH to go.
 *
 * The shop's own sales were AVERAGED, which is the one statistic a single odd
 * sale can drag, in the place the counter trusts most.
 *
 * WHAT WOULD MAKE THESE GO RED: the fence test asserts the $240 SURVIVES and
 * that n counts every sale kept - asserting the middle is $200 would pass
 * under the old code too, because the middle was the one thing it got right.
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

console.log("\n  a list that sits on one price keeps the sales around it");
const r=await page.evaluate(()=>{
  const mk=(n,price,t)=>Array.from({length:n},(_,i)=>({title:t+i,price,condition:"used",match:"same"}));
  const listings=[...mk(20,200,"a"),...mk(1,50,"b"),...mk(3,450,"c"),
    {title:"d",price:240,condition:"used",match:"same"},
    {title:"e",price:300,condition:"used",match:"same"}];
  const c=crunchComps({listings});
  return {stats:c.stats,prices:c.kept.map(k=>k.price),
          outPrices:c.out.map(o=>o.price),n:listings.length};
});
ok(r.stats && r.stats.mid===200, `the middle is still the going rate — $${r.stats&&r.stats.mid}`);
ok(r.prices.includes(240), "a $240 sale is not absurd next to $200 — it survives");
ok(r.prices.includes(300), "nor is $300");
ok(r.prices.includes(450), "nor is $450, at 2.25x the middle");
ok(!r.prices.includes(50), "$50 at a quarter of the middle is still thrown out");
ok(r.stats.n===r.n-1, `n counts every sale kept, not just the ties — ${r.stats.n} of ${r.n}`);
ok(r.prices.filter(p=>p!==200).length===5,
   `every sale within a third-to-triple of the middle is kept — the $240, the $300 and three $450s, got ${r.prices.filter(p=>p!==200).length}`);
/* The quarter marks legitimately both read $200 here: 3 sales in 25 is 12%,
   nowhere near the three-quarter mark, so no fence change can move the High
   tile. The dearer sales show in the list under it instead. Asserting a wider
   band would have been asserting a falsehood. */
ok(r.stats.lo===200 && r.stats.hi===200,
   `and the quarter marks honestly read the ties — $${r.stats.lo} to $${r.stats.hi}`);

console.log("\n  a genuinely spread list is unchanged, and rubbish still goes");
const sp=await page.evaluate(()=>{
  const L=[100,105,110,115,5000].map((price,i)=>({title:"x"+i,price,condition:"used",match:"same"}));
  const c=crunchComps({listings:L});
  return {stats:c.stats,out:c.out.map(o=>o.price),kept:c.kept.map(k=>k.price)};
});
ok(sp.out.includes(5000), "a $5,000 typo among $100 sales still goes");
ok(sp.stats.mid===108, `and the middle of the four survivors is unchanged — $${sp.stats.mid}`);

/* THE $10,000 TCL, TWICE REPORTED. First: "watch count always brings up
   these wildly outrageous prices ... I'm looking up at TCL cheap TV and
   it's showing $10,000 which is obviously incorrect." That got a sentence
   on the card telling him to skip such rows. He came back with the page
   still open - "Still seeing this 10000 dollar listing" - and he was
   right to. A tool that asks the counter to do the filtering is a
   checklist, not a tool.

   The row off his screen, verbatim: TCL 55" 4K UHD QM5 Series Mini LED
   Smart Roku OS TV - 55QM52LR, $10,000.00, New, Fixed Price, 0 available,
   Sold: 1, Start 26-Jul-26, End 26-Jul-26, "Ran for 3.2 minutes". The run
   length is the thing that gives it away and it was on the page the whole
   time, unread.

   WHAT WOULD MAKE THIS GO RED rather than pass on the old code: the list
   is FOUR listings long. The spread fence needs five before it fires, so
   nothing but the run-length rule can throw this one out. Asserting on a
   long list would have passed before the change. */
console.log("\n  a listing that ran three minutes is not a sale");
const tcl = await page.evaluate(() => {
  if (typeof runMinutes !== "function") return {wired:false};
  /* His screen, plus three ordinary 55-inch sales to have a pool at all.
     ALL NEW, and that detail is the whole reproduction. The first version
     of this had the three comps used and the $10,000 one new - and it
     passed with the fix DELETED, because the new-against-used split threw
     it out as "new in box" and I would have called a working guard broken.
     His listing is marked New and new televisions are what a TV search
     mostly returns, so all-new is both the honest case and the only one
     where nothing else can catch it: four rows is one short of the five
     the spread fence needs, and with no used rows the split never fires. */
  const listings = [
    {title:'TCL 55" 4K UHD QM5 Mini LED Roku TV 55QM52LR', price:10000,
     condition:"new", ranFor:"3.2 minutes", match:"same", why:""},
    {title:'TCL 55" QM5 Roku TV', price:260, condition:"new", ranFor:"6 days", match:"same", why:""},
    {title:'TCL 55 inch Mini LED Roku', price:300, condition:"new", ranFor:"12 hours", match:"same", why:""},
    /* no run length printed at all - missing is not short, and dropping it
       would quietly halve every read of a page that omits the figure */
    {title:'TCL 55" QM5', price:280, condition:"new", ranFor:"", match:"same", why:""},
  ];
  const c = crunchComps({listings});
  const why = t => (c.out.find(o => o.title.indexOf(t) >= 0) || {}).why || "";
  return {wired:true, stats:c.stats, kept:c.kept.map(k => k.price).sort((a,b)=>a-b),
          out:c.out.map(o => ({price:o.price, why:o.why})),
          whyTcl: why("10000") || why("55QM52LR"),
          n: listings.length,
          mins: {m: runMinutes("3.2 minutes"), d: runMinutes("1.3 days"),
                 h: runMinutes("7 hours"), s: runMinutes("45 seconds"),
                 none: runMinutes(""), junk: runMinutes("a while")}};
});
ok(tcl.wired, "  the run length is read and turned into minutes");
if (!tcl.wired) {
  console.log("  (nothing reads a run length — the rest of this section cannot be checked)");
} else {
  ok(tcl.kept.indexOf(10000) < 0,
     `  the $10,000 one is out of the pool — kept ${tcl.kept.map(p=>"$"+p).join(", ")}`);
  ok(/minutes/i.test(tcl.whyTcl),
     `  and it is out for the reason printed on the page — "${tcl.whyTcl}"`);
  /* A SMELL, NOT A VERDICT. It must be visible and named, not silently
     deleted: he gets to see what was thrown away and disagree with it. */
  ok(tcl.out.some(o => o.price === 10000),
     "  it is listed under Left out by name and price, not quietly deleted");
  ok(tcl.stats && tcl.stats.n === 3 && tcl.stats.mid === 280,
     `  the middle of what is left is the number — $${tcl.stats&&tcl.stats.mid} from ${tcl.stats&&tcl.stats.n} sales`);
  ok(tcl.kept.indexOf(280) >= 0,
     "  a listing with no run length printed is kept — missing is not short");
  ok(tcl.kept.indexOf(300) >= 0 && tcl.kept.indexOf(260) >= 0,
     "  and ordinary sales that ran hours or days are untouched");
  ok(tcl.mins.m === 3.2 && tcl.mins.d === 1872 && tcl.mins.h === 420 && tcl.mins.s === 0.75,
     `  minutes, days, hours and seconds all parse — 3.2, ${tcl.mins.d}, ${tcl.mins.h}, ${tcl.mins.s}`);
  ok(tcl.mins.none === null && tcl.mins.junk === null,
     "  and an empty or unreadable one comes back as nothing rather than zero");
}

/* THE OTHER ONE ON HIS SCREEN WAS A REAL SALE OF THE WRONG TELEVISION.
   98" TCL X11L, $5,899, Used, "Ran for 1.3 days" - a genuine sale that no
   run-length rule can touch, and it would have dragged a 55-inch median
   from $280 to over $3,000. Nothing but the match can catch that one, and
   the read used to be told a different SIZE was a "close" comp. */
console.log("\n  a 98-inch television does not price a 55-inch one");
const size = await page.evaluate(() => {
  const listings = [
    {title:'98" TCL X11L (2026) SQD-Mini LED HDR TV', price:5899, condition:"used",
     ranFor:"1.3 days", match:"different", why:"98-inch, not 55"},
    {title:'TCL 55" QM5 Roku TV', price:260, condition:"used", ranFor:"6 days", match:"same", why:""},
    {title:'TCL 55 inch Mini LED Roku', price:300, condition:"used", ranFor:"12 hours", match:"same", why:""},
  ];
  const c = crunchComps({listings});
  const pr = (typeof shotPrompt === "function" && typeof calcItem === "function")
    ? shotPrompt(calcItem()) : "";
  return {kept:c.kept.map(k=>k.price), mid:c.stats&&c.stats.mid,
          out:c.out.map(o=>o.price), prompt:pr};
});
ok(size.kept.indexOf(5899) < 0 && size.mid === 280,
   `  marked different, it stays out of the figure — $${size.mid} from the two 55-inch sales`);
/* The code cannot judge a 98 from a 55; the READ does. So the assertion
   that matters is on the instruction, which is the only place the
   distinction can be made. A test on crunchComps alone would be testing
   that "different" means different, which it always did. */
ok(/SIZE IS NOT A SMALL DIFFERENCE/.test(size.prompt),
   "  and the read is told in capitals that a different size is different, not close");
ok(/98-inch television cannot price a 55-inch/.test(size.prompt),
   "  with his own two televisions as the example");
ok(/ranFor/.test(size.prompt) && /Ran for/.test(size.prompt),
   "  the read is asked for the run length, by the words WatchCount prints");
ok(!/different model, size or version that is still fair to compare/.test(size.prompt),
   "  and no longer told that a different size is a fair comparison");

console.log("\n  the shop's own sales read the middle, not the average");
const own=await page.evaluate(()=>{
  const save=window.DEALS;
  DEALS=[150,180,400].map((soldPrice,i)=>({key:"ZZtest",itemId:"ZZtest",status:"sold",soldPrice}));
  const s=soldStats("ZZtest");
  DEALS=save;
  return s;
});
ok(own && own.mid===180, `$150, $180 and $400 read $${own&&own.mid} — the average would say $243`);
ok(own && own.lo===150 && own.hi===400, `and the range is still shown whole — $${own.lo} to $${own.hi}`);
ok(own && own.avg===undefined, "the averaged figure is gone, not left beside it to be picked up again");

console.log("\n  a logged sale is filed under the model, not the item type");
/* Wrapped: without dealKey this threw out of the suite instead of going red,
   and an exploding test is not a failing test - nothing tells you WHICH
   assertion was the point. */
const dk=await page.evaluate(()=>{
 try{
  const c=CATALOG.find(x=>x.items.some(i=>i.id==="g7"));
  st.mode="item"; st.catId=c.id; st.itemId="g7"; st.picked=true; st.bookName="";
  st.mpPin=null;
  const noPin=dealKey();
  st.mpPin={id:"b2"};              // Glock 19
  const glock=dealKey();
  st.mpPin={id:"b24"};             // Hi-Point C9
  const hipoint=dealKey();
  st.mpPin=null;
  return {noPin,glock,hipoint,item:itemKey()};
 }catch(e){ return {err:String(e)}; }
});
ok(!dk.err, "the deal log has a key of its own"+(dk.err?" — "+dk.err:""));
ok(dk.glock!==dk.hipoint, `a Glock 19 and a Hi-Point do not share a bucket — ${dk.glock} vs ${dk.hipoint}`);
ok(dk.glock!==dk.item, "a pinned model is not filed under the item type");
ok(dk.noPin==="g7" && dk.noPin===dk.item, `with no model pinned it still files under the item — ${dk.noPin}`);

await browser.close();
console.log(fails?`\ncheck-middle FAIL (${fails})`:"\ncheck-middle OK");
process.exit(fails?1:0);
