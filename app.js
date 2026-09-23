
/* ================= DAILY FEED — updated automatically each morning =================
   A scheduled task fetches these from Kitco and republishes this page daily.
   avg90 = trailing ~90-day average (the peak guard); gold7/silver7 = ~a week ago (the trend read). */
const FEED = { date: "2026-09-19", gold: 4377, silver: 66.1, gold90: 4219, silver90: 61.8, gold7: 4341, silver7: 64.6, source: "Kitco + TradingEconomics + USAGOLD" };
/* =================================================================================== */

const CATALOG = [
 {id:"guns",label:"Firearms",ltv:50,
  driver:"Model and caliber. Age barely matters — an old Model 70 can beat a new one.",
  killer:"Bad bore. Oddball caliber nobody around here stocks.",
  brand:{on:true,hi:"Premium maker",mid:"Standard maker",lo:"Budget / off brand"},
  complete:{on:true,label:"Magazine, choke tubes, case"},
  items:[
   {id:"g1",name:"Pump shotgun",value:200,liq:"fast"},
   {id:"g2",name:"Semi-auto shotgun",value:400,liq:"fast"},
   {id:"g3",name:"Bolt-action rifle",value:275,liq:"fast"},
   {id:"g4",name:"Lever-action rifle",value:450,liq:"fast"},
   {id:"g5",name:"AR-15 / modern sporting rifle",value:650,liq:"normal"},
   {id:"g6",name:".22 rifle",value:175,liq:"fast"},
   {id:"g7",name:"Semi-auto pistol",value:300,liq:"fast"},
   {id:"g8",name:"Revolver",value:325,liq:"fast"},
   {id:"g9",name:"Muzzleloader",value:150,liq:"slow"},
   {id:"g10",name:"Semi-auto rifle — hunting",value:450,liq:"normal"}]},
 {id:"power",label:"Outdoor power",ltv:35,
  driver:"Brand tier first, then does it start. Pro saws are worth three of a box-store saw.",
  killer:"Won't start. Then it's parts, not a tool.",
  brand:{on:true,hi:"Stihl / Husqvarna / Echo",mid:"Mid grade",lo:"Poulan / Craftsman / no name"},
  complete:{on:true,label:"Bar, chain, guards"},
  items:[
   {id:"p1",name:"Chainsaw",value:180,liq:"fast"},
   {id:"p2",name:"String trimmer",value:110,liq:"fast"},
   {id:"p3",name:"Backpack blower",value:200,liq:"normal"},
   {id:"p4",name:"Push mower",value:90,liq:"fast"},
   {id:"p5",name:"Riding mower",value:500,liq:"normal"},
   {id:"p6",name:"Pressure washer",value:125,liq:"normal"},
   {id:"p7",name:"Generator — 3.5 to 7.5kW",value:350,liq:"fast"}]},
 {id:"tools",label:"Tools",ltv:35,
  driver:"Brand tier, then completeness. Battery and charger are half the value of a cordless tool.",
  killer:"Bare tool, no battery. Worth a third.",
  brand:{on:true,hi:"DeWalt / Milwaukee / Makita",mid:"Ryobi / Ridgid",lo:"Harbor Freight / no name"},
  complete:{on:true,label:"Battery, charger, case"},
  items:[
   /* Was "Cordless drill / driver kit", which said two things at once and
      got both wrong. "Drill / driver" is the TOOL - not a hammer drill, not
      an impact driver - and "kit" was meant to mean tool plus batteries plus
      charger. But the desk then asked "Kit?" on top of it, and worse, it was
      named after the rarest case: two batteries and a charger is 25 listings
      out of 629. What came with it is the question, not the name. */
   {id:"t1",name:"Cordless drill / driver",value:110,liq:"fast"},
   {id:"t2",name:"Impact wrench",value:130,liq:"fast"},
   {id:"t3",name:"Angle grinder",value:45,liq:"normal"},
   {id:"t4",name:"Air compressor — pancake",value:70,liq:"normal"},
   {id:"t5",name:"Air compressor — 60 gal upright",value:250,liq:"slow"},
   {id:"t6",name:"MIG welder — 110v",value:250,liq:"normal"},
   {id:"t7",name:"Rolling tool box",value:150,liq:"slow"},
   {id:"t8",name:"Framing nailer",value:120,liq:"normal"}]},
 {id:"hunt",label:"Hunting & fishing",ltv:40,
  driver:"Brand tier on glass. Leupold and Vortex hold their money; Tasco does not.",
  killer:"Fogged or scratched glass. Seasonal — thin money in spring.",
  brand:{on:true,hi:"Leupold / Vortex / Zeiss",mid:"Bushnell / Nikon",lo:"Tasco / no name"},
  complete:{on:true,label:"Rings, caps, case"},
  items:[
   {id:"h1",name:"Rifle scope",value:120,liq:"fast"},
   {id:"h2",name:"Binoculars",value:70,liq:"normal"},
   {id:"h3",name:"Rangefinder",value:110,liq:"normal"},
   {id:"h4",name:"Trail camera",value:45,liq:"fast"},
   {id:"h5",name:"Compound bow",value:200,liq:"slow"},
   {id:"h6",name:"Crossbow",value:250,liq:"normal"},
   {id:"h7",name:"Rod & reel combo",value:70,liq:"fast"},
   {id:"h8",name:"Trolling motor",value:250,liq:"normal"},
   {id:"h9",name:"Outboard — 9.9 to 25hp",value:900,liq:"slow"}]},
 {id:"elec",label:"Electronics",ltv:25,
  driver:"Age. Model year is nearly the whole equation — two years old is half price.",
  killer:"Activation lock. A locked phone is a brick. See the Devices tab before you lend a dollar.",
  brand:{on:true,hi:"Apple / Samsung flagship",mid:"Mainstream",lo:"Off brand"},
  /* 0.90 measured 23 Sep off sold comps: an Xbox Series X, Series S, PS5 or
     Switch listed "console only" went for 0.92, 0.94, 0.89 and 0.88 of one
     with a controller. The same run says EXTRAS are worth nothing - two or
     more controllers came out at 1.03x and 0.95x, and games included at
     1.04x - so there is no question to ask about them, only this toggle. */
  complete:{on:true,label:"Charger, cables, remote",mult:.9},
  items:[
   /* Named for a size band, it read as the only size the desk knew - the
      counter with a 75in TCL in front of them saw "50 to 65in" and stopped.
      The size has always been a spec, with four bands and a multiplier on
      each; the name was just contradicting the picker. The $175 is still the
      50-65in figure, which is the band the picker treats as neutral. */
   {id:"e1",name:"TV — smart, any size",value:175,liq:"normal"},
   {id:"e2",name:"Laptop",value:175,liq:"normal"},
   {id:"e3",name:"Tablet",value:150,liq:"normal"},
   {id:"e4",name:"Smartphone",value:200,liq:"fast"},
   {id:"e5",name:"Game console — current gen",value:225,liq:"fast"},
   {id:"e6",name:"Bluetooth speaker",value:50,liq:"normal"},
   {id:"e7",name:"Car audio — amp & sub",value:80,liq:"slow"}]},
 /* Big, heavy, and slow to move - a pawn shop is not an appliance store.
    They are worth taking, but at a fraction of what they cost, and the offer
    has to carry the cost of having it sit on the floor. */
 {id:"appl",label:"Appliances & household",ltv:33,
  driver:"Age and whether it runs. Anything over ten years old is scrap with a cord on it.",
  killer:"Won't power up, or it's built-in and you'd have to pull it out of a wall. Rust, mold, smell \u2014 pass.",
  brand:{on:true,hi:"Speed Queen / Sub-Zero / Bosch",mid:"Whirlpool / Maytag / LG / Samsung / GE",lo:"Kenmore / Frigidaire / Amana / Hotpoint / no name"},
  complete:{on:true,label:"Racks, shelves, hoses, remote"},
  items:[
   {id:"a1",name:"Range / oven",value:150,liq:"slow"},
   {id:"a2",name:"Refrigerator",value:240,liq:"slow"},
   {id:"a3",name:"Washer",value:175,liq:"normal"},
   {id:"a4",name:"Dryer",value:175,liq:"normal"},
   {id:"a5",name:"Washer & dryer pair",value:375,liq:"normal"},
   {id:"a6",name:"Chest freezer",value:120,liq:"normal"},
   {id:"a7",name:"Window air conditioner",value:80,liq:"fast"},
   {id:"a8",name:"Microwave",value:35,liq:"slow"},
   {id:"a9",name:"Sewing machine",value:70,liq:"slow"},
   {id:"a10",name:"Vacuum cleaner",value:60,liq:"normal"}]},
 {id:"music",label:"Instruments",ltv:35,
  driver:"Brand and model, more than anything else on this list.",
  killer:"Cracked neck, warped top. Unfixable and unsellable.",
  brand:{on:true,hi:"Fender / Gibson / Martin",mid:"Squier / Epiphone / Yamaha",lo:"No name"},
  complete:{on:true,label:"Case, cable, strap"},
  items:[
   {id:"m1",name:"Acoustic guitar",value:110,liq:"slow"},
   {id:"m2",name:"Electric guitar",value:150,liq:"slow"},
   {id:"m3",name:"Amplifier",value:100,liq:"slow"}]},
 /* Jewellery and watches where the NAME carries the value. Plain gold with
    no name on it belongs on the Gold & silver tab, priced by weight - this is
    for the pieces the scale badly under-values. Four of these five sheets
    gate: a fake Rolex is not worth a fraction of a real one. */
 {id:"jewel",label:"Jewelry & watches",ltv:40,
  driver:"The name, then the condition of the case and band. A real one is worth many times its metal; a fake is worth nothing.",
  killer:"Cannot be proven. Run the spotting-fakes card first \u2014 lend on the metal or pass.",
  brand:{on:true,hi:"Rolex / Cartier / Tiffany",mid:"TAG / Seiko / James Avery",lo:"Fashion / no name"},
  complete:{on:true,label:"Box, papers, extra links"},
  items:[
   {id:"j1",name:"Watch \u2014 luxury",value:1800,liq:"slow"},
   {id:"j2",name:"Watch \u2014 name brand",value:120,liq:"normal"},
   {id:"j3",name:"Designer jewelry piece",value:150,liq:"slow"},
   {id:"j4",name:"Engagement / bridal set",value:400,liq:"slow"}]},
 /* Bulky, seasonal, and half of it was bought on a New Year's resolution -
    but it walks in constantly and it did not have anywhere to land. */
 {id:"fit",label:"Fitness & sporting",ltv:25,
  driver:"Whether it folds and whether it powers up. A treadmill nobody can move is worth what it weighs.",
  killer:"Broken deck or motor, a subscription bike with a dead account, anything you cannot get through a door.",
  brand:{on:true,hi:"Peloton / NordicTrack / Rogue",mid:"ProForm / Bowflex / Schwinn / Sole",lo:"Weider / Gold's Gym / no name"},
  complete:{on:true,label:"Safety key, pins, all the plates"},
  items:[
   {id:"f1",name:"Treadmill",value:300,liq:"slow"},
   {id:"f2",name:"Exercise bike / spin bike",value:150,liq:"slow"},
   {id:"f3",name:"Elliptical",value:150,liq:"slow"},
   {id:"f4",name:"Weight bench",value:60,liq:"normal"},
   {id:"f5",name:"Dumbbells / weight set",value:70,liq:"fast"},
   {id:"f6",name:"Home gym / power rack",value:200,liq:"slow"},
   {id:"f7",name:"Golf clubs \u2014 full set",value:150,liq:"normal"}]},
 /* The name on it carries the price, and so does whether it is real. These
    gate to a spotting-fakes card the same way the luxury watches do. */
 {id:"coll",label:"Cards, coins & collectibles",ltv:40,
  driver:"Grade, then the name. Two of the same card can be $8 and $800 \u2014 the slab is the difference.",
  killer:"Cannot be proven, or it is a reprint. Run the fakes card first, and never lend on a raw card at slab money.",
  brand:{on:true,hi:"PSA / BGS / SGC graded",mid:"Raw, named player or set",lo:"Common / bulk / reprint"},
  complete:{on:true,label:"Slab, case, certificate"},
  items:[
   {id:"c1",name:"Sports card \u2014 graded single",value:60,liq:"slow"},
   {id:"c2",name:"Card lot \u2014 sports or Pok\u00e9mon",value:60,liq:"slow"},
   {id:"c3",name:"Comic books \u2014 long box",value:80,liq:"slow"},
   {id:"c4",name:"Coin collection \u2014 numismatic",value:150,liq:"slow"},
   {id:"c5",name:"Zippo / collectible lighter",value:20,liq:"slow"}]},
 {id:"rolling",label:"Trailers & ATVs",ltv:35,
  driver:"Title, before you look at anything else. Then condition.",
  killer:"No title. No deal, at any price. Don't negotiate around it.",
  brand:{on:false},complete:{on:false},
  items:[
   {id:"r1",name:"Utility trailer — 5x8",value:600,liq:"normal"},
   {id:"r2",name:"ATV / four wheeler",value:1500,liq:"normal"}]}
];
const CONDITIONS=[
 {id:"new",label:"New in box",hint:"Sealed"},
 {id:"exc",label:"Excellent",hint:"Barely used"},
 {id:"good",label:"Good",hint:"Normal wear"},
 {id:"fair",label:"Fair",hint:"Heavy wear"},
 {id:"rough",label:"Rough",hint:"Needs work"}];
/* One condition curve, anchored at Good, because Good is what the counter is
   told every resale figure assumes.

   There were two. A market price used 1.3/1.12/1/.75/.45 while a catalog
   estimate used its own set, which normalised to +56% and +25% for the two
   upgrades. The buttons show the first set, so on the catalog path "New in
   box" added 56% while the button said 30%. Good, Fair and Rough already
   agreed; only the upgrades were wrong, and only on that path.

   CATALOG_AT_GOOD keeps the catalog path's Good price exactly where it was -
   its base values were anchored a step above Good - so nothing moves except
   the two figures that were misreporting themselves. */
const COND_MULT={new:1.3,exc:1.12,good:1,fair:.75,rough:.45};
const CATALOG_AT_GOOD=0.8;
const BRANDS=[{id:"hi",mult:1.4},{id:"mid",mult:1.0},{id:"lo",mult:0.55}];
const LIQUIDITY=[
 {id:"fast",label:"Sells fast",hint:"Gone in a week",adj:0},
 {id:"normal",label:"Normal",hint:"Few weeks",adj:-5},
 {id:"slow",label:"Slow here",hint:"Months, or never",adj:-13}];
const PURITY=[{k:"10k",p:.4167},{k:"14k",p:.5833},{k:"18k",p:.75},{k:"22k",p:.9167},{k:"24k",p:.999}];
/* THE BRAND BOOK — type a brand, get the tier. Seeded for rural North Florida;
   correct it as the counter teaches you. hi = +40%, mid = baseline, lo = -45%. */
const BRANDBOOK={
 guns:{
  hi:["Colt","Sig Sauer","Heckler & Koch","HK","Benelli","Beretta","Browning","CZ","Tikka","Weatherby","Kimber","FN","Dan Wesson","Wilson Combat","Henry","Nighthawk","Staccato","Franchi","Bergara","Christensen Arms","Walther","Sako","Caesar Guerini"],
  mid:["Glock","Smith & Wesson","S&W","Ruger","Remington","Winchester","Mossberg","Savage","Marlin","Springfield Armory","Springfield","Stoeger","Canik","Rossi","CVA","Traditions","Tristar","Girsan","Diamondback","IWI","Kel-Tec"],
  lo:["Taurus","Hi-Point","SCCY","Heritage","Jimenez","Raven","Phoenix","Cobra","Anderson","Palmetto","PSA","Bear Creek","Del-Ton","ATI","Citadel","EAA","Radical Firearms","Charter Arms","Jennings"]},
 power:{
  hi:["Stihl","Husqvarna","Echo","Honda","Shindaiwa","RedMax","John Deere","Kubota","Exmark","Scag","Gravely","Ferris","Wright"],
  mid:["Toro","Cub Cadet","Troy-Bilt","Snapper","Bad Boy","DeWalt","Milwaukee","EGO","Ryobi","Generac","Champion","Ariens","Simplicity","Makita","Kawasaki"],
  lo:["Poulan","Craftsman","Murray","Weed Eater","Hyper Tough","PowerSmart","Predator","Black Max","Remington outdoor","Wild Badger","SENIX","Greenworks"]},
 appl:{
  hi:["Speed Queen","Sub-Zero","Wolf","Viking","Thermador","Bosch","Miele","Fisher & Paykel","KitchenAid","Monogram","Cafe"],
  mid:["Whirlpool","Maytag","LG","Samsung","GE","Electrolux","Frigidaire Gallery","Bosch 300","Dyson","Shark","Singer","Brother","Janome"],
  lo:["Kenmore","Frigidaire","Amana","Hotpoint","Roper","Insignia","Hisense","Magic Chef","Danby","Avanti","Galanz","Bissell","Hoover","Black+Decker"]},
 fit:{
  hi:["Peloton","NordicTrack","Rogue","Life Fitness","Precor","Concept2","Hydrow","Tonal","Titleist","Callaway","TaylorMade","Ping","Scotty Cameron"],
  mid:["ProForm","Bowflex","Schwinn","Sole","Horizon","Echelon","Cybex","Cap Barbell","Rep Fitness","Cobra","Wilson","Mizuno","Cleveland"],
  lo:["Weider","Gold's Gym","Everlast","Sunny Health","Marcy","Body Champ","Top Flite","Strata","no name"]},
 coll:{
  hi:["PSA","BGS","Beckett","SGC","CGC","CBCS","NGC","PCGS"],
  mid:["Topps","Bowman","Panini","Upper Deck","Fleer","Marvel","DC","Morgan","Peace"],
  lo:["Donruss","Score","Pro Set","Leaf","common","bulk","reprint"]},
 tools:{
  hi:["DeWalt","Milwaukee","Makita","Snap-on","Festool","Hilti","Bosch","Mac Tools","Matco","Ingersoll Rand","Lincoln Electric","Miller","Fluke","Knipex"],
  mid:["Ryobi","Ridgid","Craftsman","Kobalt","Hart","Skil","Porter-Cable","Metabo","Metabo HPT","Husky","Flex","Dremel","Hobart","Stanley","Irwin","Klein","Channellock","Campbell Hausfeld"],
  lo:["Harbor Freight","Bauer","Hercules","Chicago Electric","Pittsburgh","Central Pneumatic","Warrior","Drill Master","WEN","Vevor","Hyper Tough","Tool Shop","Black & Decker","Wagner"]},
 hunt:{
  hi:["Leupold","Vortex","Zeiss","Swarovski","Nightforce","Trijicon","Aimpoint","EOTech","Garmin","Sig Sauer optics","Mathews","Hoyt","Bowtech","Ravin","TenPoint","Shimano","G Loomis","St. Croix","Minn Kota"],
  mid:["Bushnell","Nikon","Burris","Athlon","Holosun","Primary Arms","Bear Archery","PSE","Diamond","Barnett","Abu Garcia","Penn","Lew's","13 Fishing","Ugly Stik","Daiwa","Moultrie","Tactacam","Spypoint","MotorGuide","Excalibur"],
  lo:["Tasco","Simmons","BSA","CVLIFE","Pinty","Truglo","CenterPoint","Wildgame Innovations","Stealth Cam","Zebco","Shakespeare","South Bend","Wicked Ridge"]},
 elec:{
  hi:["Apple","Samsung","Sony","Nintendo","Bose","Sonos","JL Audio","Alienware","ASUS ROG"],
  mid:["Microsoft","Xbox","Dell","HP","Lenovo","LG","Google","Pixel","Motorola","OnePlus","JBL","Beats","Klipsch","Kicker","Rockford Fosgate","Alpine","Pioneer","Acer","Asus","MSI","Vizio","TCL"],
  lo:["Onn","RCA","Element","Westinghouse","Sceptre","Hisense","Boss Audio","Pyle","Dual","Insignia","Blackweb","Coby","Sylvania"]},
 jewel:{
  hi:["Rolex","Cartier","Omega","Tiffany","Tiffany & Co","Patek Philippe","Audemars Piguet","Van Cleef","Bulgari","David Yurman","Tudor","Breitling","Grand Seiko","IWC","Jaeger-LeCoultre","Panerai","Hublot","Vacheron"],
  mid:["TAG Heuer","Tissot","Longines","Seiko","Citizen","Hamilton","Oris","Rado","Movado","James Avery","Pandora","John Hardy","Kendra Scott","Swarovski","Bulova","Shinola"],
  lo:["Fossil","Michael Kors","Invicta","MVMT","Armitron","Timex","Guess","Anne Klein","Stuhrling","Daniel Wellington","Skagen"]},
 music:{
  hi:["Fender","Gibson","Martin","Taylor","PRS","Rickenbacker","Mesa Boogie","Gretsch"],
  mid:["Squier","Epiphone","Yamaha","Ibanez","Jackson","ESP","LTD","Schecter","Takamine","Seagull","Alvarez","Peavey","Orange","Marshall","Boss","Line 6","Blackstar","Fender Squier","Mitchell"],
  lo:["First Act","Rogue","Glarry","Donner","Monoprice","Sawtooth","Best Choice","Lyx"]}
};
/* The brand is often already written on the thing that was picked.
 *
 * "DeWalt 20V drill kit" was picked from the price list, and the make
 * question opened with Ryobi / Ridgid lit - because st.brand defaults to
 * "mid" and nothing had read the name. Mid tier against top tier is 40% of
 * the price, so the desk was not merely asking a question it could answer:
 * it was answering it wrong and waiting to be corrected.
 *
 * Whole words only. brandLookup matches on substrings, which is right when
 * somebody is typing a name into a box and wrong when scanning a sentence -
 * "kit" would find Kitchenaid. */
function brandFromName(catId,txt){
  const words=String(txt||"").split(/[^A-Za-z0-9&+.-]+/).filter(w=>w.length>=3);
  for(const w of words){
    const hit=brandLookup(catId,w);
    if(hit&&hit.name.toLowerCase()===w.toLowerCase())return hit;
  }
  return null;
}
function brandLookup(catId,txt){
  const ov=ITEM_OVERRIDES[st.itemId];
  const book=(ov&&ov.brands)||BRANDBOOK[catId]; if(!book)return null;
  const t=String(txt).trim().toLowerCase(); if(t.length<3)return null;
  let best=null;
  for(const tier of["hi","mid","lo"]) for(const b of book[tier]){
    const bl=b.toLowerCase();
    /* An exact name wins outright. Without this the longest containing name
       won instead, so "seiko" answered Grand Seiko and a $90 watch was filed
       as a premium maker. */
    if(bl===t)return {tier,name:b};
    if(bl.includes(t)||t.includes(bl)){
      if(!best||b.length>best.name.length)best={tier,name:b};
    }
  }
  return best;
}
/* brandLookup matches a brand FIELD, where the whole field is the brand. When
   the counter just types the item ("stihl br800 blower") the brand is a word
   inside a sentence, so it has to be spotted on word boundaries - and names
   too short to be safe that way (HK, FN, ATI) are left to the tier buttons. */
function brandInText(catId,txt){
  const ov=ITEM_OVERRIDES[st.itemId];
  const book=(ov&&ov.brands)||BRANDBOOK[catId]; if(!book)return null;
  const flat=x=>String(x).toLowerCase().replace(/[^a-z0-9& ]+/g," ").replace(/\s+/g," ").trim();
  const t=" "+flat(txt)+" "; if(t.length<5)return null;
  let best=null;
  for(const tier of["hi","mid","lo"]) for(const b of book[tier]){
    const bl=flat(b);
    if(bl.length<4)continue;
    if(t.indexOf(" "+bl+" ")>=0&&(!best||bl.length>flat(best.name).length))best={tier,name:b};
  }
  return best;
}
/* THE PRICE BOOK — common walk-ins that aren't on the main lists.
   Values are starting resale estimates for rural North Florida, excellent
   condition, mid brand, complete. The counter person is still the judge. */
/* Checked against the open market on 2026-09-20. What could be reached was
   live ASKING prices and published resale guides, not completed sales -
   eBay's sold pages could not be opened from here - so these are treated the
   way a shelf tag is: the observed ask, one markdown step down. Eleven rows
   moved. The rest of this list has not been checked against anything and
   should be read as a starting point until a shelf tag or a logged sale
   says otherwise. */
const PRICEBOOK=[
 /* gaps the counter walked into: every one of these was photographed on a
    shelf in Tallahassee and had nowhere to land in this list. Values are
    the observed asking price taken one markdown step down, the same way a
    shelf tag is treated everywhere else. */
 ["Wireless earbuds",60,"elec","fast"],["DSLR / mirrorless camera",200,"elec","slow"],
 /* Desk clutter that walks in constantly and had no row at all, which is how
    a Logitech mouse came to be priced as a gaming tower. Both unverified -
    from used listings, not from anything sold here. */
 ["Wireless mouse \u2014 computer",10,"elec","slow"],["Computer keyboard",15,"elec","slow"],
 ["Band saw \u2014 benchtop",160,"tools","slow"],["Audio mixer \u2014 PA board",140,"music","slow"],
 ["TIG / stick welder",320,"tools","slow"],
 /* guns & shooting */
 ["Gun safe",400,"guns","slow"],["Single-shot shotgun",100,"guns","fast"],["SKS rifle",500,"guns","normal"],
 ["AK-pattern rifle",650,"guns","normal"],["Derringer",125,"guns","normal"],["Air rifle / pellet gun",40,"guns","normal"],
 ["Reloading press",100,"guns","slow"],["Black-powder revolver",125,"guns","slow"],["Bayonet / military knife",60,"guns","slow"],
 /* outdoor power */
 ["Zero-turn mower",2200,"power","normal"],["Tiller",150,"power","normal"],["Log splitter",600,"power","normal"],
 ["Pole saw",130,"power","fast"],["Hedge trimmer",70,"power","normal"],["Lawn edger",80,"power","normal"],
 ["Water pump — gas",150,"power","normal"],["Inverter generator — 2kW",300,"power","fast"],["Welder/generator combo",800,"power","slow"],
 /* tools */
 ["Table saw",200,"tools","normal"],["Miter saw / chop saw",150,"tools","fast"],["Circular saw",50,"tools","fast"],
 ["Reciprocating saw",60,"tools","fast"],["Jigsaw",40,"tools","normal"],["Router",70,"tools","normal"],
 ["Benchtop planer",180,"tools","normal"],["Drill press",150,"tools","slow"],["Bench grinder",45,"tools","normal"],
 ["Shop vac",40,"tools","fast"],["Extension ladder",90,"tools","normal"],["Floor jack",60,"tools","fast"],
 ["Jack stands — pair",25,"tools","fast"],["Socket set — complete",60,"tools","fast"],["Torque wrench",40,"tools","normal"],
 ["Come-along / hand winch",40,"tools","normal"],["Chain hoist",60,"tools","normal"],["Engine hoist",120,"tools","slow"],
 ["Finish nail gun",80,"tools","normal"],["Tile saw",120,"tools","slow"],["Concrete mixer",250,"tools","slow"],
 ["Stick welder",180,"tools","normal"],["Plasma cutter",300,"tools","normal"],["Oxy-acetylene torch set",150,"tools","normal"],
 ["Sewing machine",60,"tools","slow"],["Stand mixer — KitchenAid class",120,"tools","fast"],
 /* hunting, fishing, water */
 ["Climbing tree stand",90,"hunt","normal"],["Ladder stand",70,"hunt","slow"],["Ground blind",60,"hunt","normal"],
 ["Deer feeder — barrel",60,"hunt","fast"],["Cellular game camera",70,"hunt","fast"],["Duck decoys — dozen",40,"hunt","normal"],
 ["Kayak — sit-on-top",300,"hunt","normal"],["Jon boat — 12ft, no motor",400,"hunt","slow"],["Boat trailer",800,"hunt","slow"],
 ["Cast net",25,"hunt","fast"],["Fish finder",120,"hunt","normal"],["Offshore rod & reel",90,"hunt","normal"],
 ["Fly rod & reel",80,"hunt","slow"],["Hard gun case",25,"hunt","fast"],["Waders",40,"hunt","normal"],
 ["Spotting scope",130,"hunt","normal"],["Red dot sight",70,"hunt","fast"],["Crossbow bolts & broadheads — lot",25,"hunt","fast"],
 /* electronics */
 ["Soundbar",60,"elec","fast"],["AV receiver",80,"elec","slow"],["Turntable",70,"elec","normal"],
 ["Gaming desktop PC",550,"elec","normal"],["Monitor — 27in",80,"elec","fast"],["Camera drone",300,"elec","normal"],
 ["GoPro / action camera",90,"elec","fast"],["Smartwatch \u2014 Apple / Galaxy",120,"elec","fast"],["VR headset",180,"elec","normal"],
 ["Handheld game console",170,"elec","fast"],["Video game — current title",25,"elec","fast"],["Projector",120,"elec","normal"],
 ["Two-way radios — pair",40,"elec","normal"],["Wristwatch — quartz, name brand",60,"jewel","slow"],["DJ controller",120,"elec","slow"],
 /* instruments */
 ["Bass guitar",120,"music","slow"],["Keyboard — 61 key",90,"music","normal"],["Digital piano — 88 key",350,"music","slow"],
 ["Banjo",120,"music","slow"],["Mandolin",90,"music","slow"],["Fiddle / violin",100,"music","slow"],
 ["Full drum set",250,"music","slow"],["Vocal mic — SM58 class",60,"music","normal"],["Powered PA speaker",150,"music","normal"],
 ["Guitar pedal",50,"music","normal"],["Trumpet",180,"music","slow"],["Alto saxophone",400,"music","slow"],
 /* rolling stock */
 ["Golf cart",4000,"rolling","normal"],["Dirt bike",1500,"rolling","normal"],["Go-kart",400,"rolling","slow"],
 ["Lawn / dump trailer cart",120,"rolling","fast"],["Enclosed trailer — 6x12",2800,"rolling","slow"],
 ["UTV / side-by-side",6000,"rolling","normal"],["Jet ski with trailer",3500,"rolling","slow"],
 ["Truck toolbox",90,"rolling","fast"],["ATV winch",60,"rolling","normal"],["Truck rims & tires — set",300,"rolling","normal"],
 ["Bicycle — adult",60,"rolling","normal"],["E-bike",600,"rolling","normal"],
 /* grilling, smoking and camping - the back half of every truck around here */
 ["Gas grill",90,"appl","normal"],["Charcoal grill / kettle",40,"appl","normal"],
 ["Pellet grill / smoker",275,"appl","normal"],["Offset smoker",150,"appl","slow"],
 ["Flat-top griddle \u2014 Blackstone class",120,"appl","fast"],["Propane tank \u2014 20lb, full",20,"appl","fast"],
 ["Camp stove",30,"hunt","normal"],["Tent \u2014 4 to 6 person",40,"hunt","normal"],
 ["Sleeping bag",20,"hunt","normal"],["Hard cooler \u2014 Yeti class",200,"hunt","fast"],
 ["Soft cooler / tote",35,"hunt","normal"],["Camp chairs \u2014 pair",20,"hunt","normal"],
 /* small kitchen and comfort - cheap each, but they come through the door
    every week and every one of them used to come up empty */
 ["Air fryer",35,"appl","fast"],["Pressure cooker \u2014 Instant Pot class",35,"appl","normal"],
 ["Blender",30,"appl","normal"],["Coffee maker",25,"appl","normal"],
 ["Space heater",25,"appl","normal"],["Box fan / tower fan",15,"appl","normal"],
 ["Dehumidifier",80,"appl","normal"],["Portable air conditioner",120,"appl","normal"],
 ["Dishwasher",75,"appl","slow"],["Garbage disposal",25,"appl","slow"],
 /* furniture. Mattresses, car seats and strollers are deliberately not here
    - they are on the Walk away list instead. */
 ["Recliner",80,"appl","slow"],["Sofa / couch",120,"appl","slow"],
 ["Dresser / chest of drawers",70,"appl","slow"],["Dining table & chairs",120,"appl","slow"],
 ["TV stand / entertainment center",40,"appl","slow"],["Gun cabinet \u2014 wood",150,"guns","slow"],
 /* farm and ranch */
 ["Post hole digger \u2014 gas",140,"power","slow"],["Fence charger",60,"power","normal"],
 ["Sprayer tank \u2014 25 to 55 gal",120,"power","slow"],["Earth auger \u2014 one man",180,"power","normal"],
 ["Livestock water trough",40,"power","slow"],["Chicken coop",120,"power","slow"],
 /* the rest of the shop */
 ["Paint sprayer \u2014 airless",180,"tools","normal"],["Laser level",90,"tools","normal"],
 ["OBD scan tool",50,"tools","fast"],["Scaffolding \u2014 section",80,"tools","slow"],
 ["Wheelbarrow",35,"tools","normal"],["Mechanic's creeper",20,"tools","fast"],
 ["Drywall lift",120,"tools","slow"],["Battery charger / jump box",40,"tools","fast"],
 ["Transfer pump \u2014 gas",90,"power","normal"],["Grease gun",25,"tools","normal"],
 /* school band. Rental returns turn up every June. */
 ["Clarinet",80,"music","slow"],["Flute",80,"music","slow"],
 ["Trombone",150,"music","slow"],["French horn",300,"music","slow"],
 ["Cello",300,"music","slow"],["Ukulele",40,"music","normal"],
 /* the rest of the sporting goods */
 ["Bowling ball",20,"fit","slow"],["Skateboard",40,"fit","normal"],
 ["Surfboard",150,"fit","slow"],["Paddle board \u2014 SUP",250,"fit","normal"],
 ["Life jackets \u2014 set",30,"hunt","normal"],
 /* devices that are not the trail camera they kept matching */
 ["Ring / smart doorbell",40,"elec","normal"],["Dash camera",40,"elec","normal"],
 ["Security camera system",120,"elec","normal"],["Wifi router / modem",30,"elec","normal"],
 ["Printer \u2014 all in one",40,"elec","slow"],["Record player / turntable set",70,"elec","normal"],
 ["Karaoke machine",50,"elec","slow"],["E-reader \u2014 Kindle class",40,"elec","normal"],
 ["Power wheels / ride-on toy",60,"rolling","normal"],["Wet tile saw",100,"tools","slow"],
 ["Scooter / moped",400,"rolling","normal"],["Pop-up camper",1800,"rolling","slow"],
 ["Boat anchor & rode",30,"hunt","normal"]
];
const CATLABEL=Object.fromEntries(CATALOG.map(c=>[c.id,c.label]));
/* Compiled suggested lending rates — pawn-industry norms (loans run 25-60% of
   resale nationally) tuned for this market. Never anywhere near 100%. */
const LTV_BOOK={
 guns:{p:50,why:"guns are the best collateral in the building — they hold value, sell fast here, and get redeemed"},
 power:{p:35,why:"seasonal, condition-fragile, and every August the market is full of them"},
 tools:{p:35,why:"plentiful supply, and cordless value dies with the battery"},
 hunt:{p:40,why:"good glass holds money, but it's seasonal — thin in spring"},
 elec:{p:25,why:"fastest-depreciating thing you take in — two model years is half the value"},
 jewel:{p:40,why:"a real one holds its price, but it must be proven first and it sells slowly"},
 music:{p:35,why:"holds value but sits on the shelf for months"},
 rolling:{p:35,why:"real money but title friction and a slow, local buyer pool"}};
function ltvSuggestHTML(cat,cur){
  const s=LTV_BOOK[cat.id]; if(!s)return "";
  if(cur===s.p)return `<div class="cardHint" style="margin-top:8px"><span style="color:var(--accent);font-family:var(--mono);font-weight:600">Suggested: ${s.p}%</span> — ${s.why}. You're on it.</div>`;
  return `<div class="cardHint" style="margin-top:8px"><span style="color:var(--accent);font-family:var(--mono);font-weight:600">Suggested: ${s.p}%</span> — ${s.why}.
    <button id="useLtv" class="ghostBtn" style="padding:5px 12px;font-size:11.5px;margin-left:8px">Use ${s.p}%</button></div>`;
}
/* The price list used to want every typed word to appear inside the row name,
   which only ever worked for someone typing the row name. A photo read comes
   back as "Anker Soundcore wireless earbud charging case (green)" and could
   never reach "Wireless earbuds", and the synonym list was not consulted at
   all. Score the words instead, same machinery the main search uses. */
let BOOK_IDX=null,BOOK_DF=null;
function bookIdx(){
  if(BOOK_IDX)return BOOK_IDX;
  BOOK_DF=new Map();
  BOOK_IDX=PRICEBOOK.map(e=>{
    const nw=omniWords(e[0]).filter(w=>!STOP.has(w));
    const sw=omniWords(BOOK_SYN[e[0]]||"");
    const all=Array.from(new Set(nw.concat(sw)));
    all.forEach(w=>BOOK_DF.set(w,(BOOK_DF.get(w)||0)+1));
    /* The thing itself, with the trim cut off: "Hard cooler - Yeti class" is
       a cooler, "Post hole digger - gas" is a digger, "Box fan / tower fan"
       is a fan either way. The photo read has to land on one of these. */
    const core=String(e[0]).split(/[\u2014\u2013,(]/)[0];
    /* A slash in a row name means "or", so each side is a name in its own
       right: "Soft cooler / tote" is covered by the words "soft cooler"
       alone. Counting tote against it let a brand word on another row
       ("Igloo") outrank the row the words literally spell. */
    const nc=core.split("/").map(part=>omniWords(part).filter(w=>!STOP.has(w))).filter(a=>a.length);
    const head=Array.from(new Set(nc.map(a=>a[a.length-1])));
    return {e,nw,nc,sw,all,head};
  });
  return BOOK_IDX;
}
/* Scored rows, best first. Typed search only wants the names; the photo read
   prices off the top row without anyone looking at it, so it wants the
   numbers too - see photoBook() below. */
function searchBookHits(txt){
  const raw=String(txt).trim(); if(raw.length<3)return [];
  const q=omniWords(raw).filter(w=>!STOP.has(w));
  if(!q.length)return [];
  const out=[];
  for(const b of bookIdx()){
    let score=0,strong=0,rare=false,headHit=false;
    for(const w of q){
      let h=0,hw="";
      for(const bw of b.all){ const x=wordHit(w,[bw]); if(x>h){h=x;hw=bw;} }
      if(!h)continue;
      score+=h;
      if(h>=2){
        strong++;
        if(b.head.includes(hw))headHit=true;
        /* a word this row owns outright - "airpods", "sawzall", "yeti".
           Short ones are usually half of a two-word alias ("lazy boy"), and
           on their own they land anywhere: "game boy" found the recliner. */
        if(h===3&&hw.length>=4&&!b.nc.some(alt=>alt.includes(hw))&&(BOOK_DF.get(hw)||9)<=2)rare=true;
      }
    }
    if(!strong)continue;
    /* How much of the name the words cover, so "Wireless earbuds" beats "Hard
       gun case" on a query carrying both. Only the name proper counts - the
       trim after the dash ("- 2kW", "- Yeti class") is not what someone
       types. A word the row owns outright ("airpods") stands in for it. */
    const nameCover=b.nc.reduce((best,alt)=>
      Math.max(best,alt.filter(n=>q.some(w=>wordHit(w,[n])>0)).length/alt.length),0);
    /* A name the row owns ("airpods", "yeti", "logitech") stands in for its
       name words. It used to stand in only where the name matched nothing at
       all, which read well and priced badly: "Logitech K350 wireless
       keyboard" half-matched the computer row and wholly matched the music
       book's one-word "Keyboard", so a PC keyboard was a 61-key. It counts
       either way now, and where two rows tie it is the one with more of the
       words behind it that wins, then the one the words literally spell -
       which is what keeps an Igloo soft cooler a soft cooler rather than the
       Yeti-class hard one Igloo also makes. */
    const cover=Math.max(nameCover,rare?1:0);
    if(!cover)continue;
    out.push({e:b.e,score,cover,nameCover,rare,headHit,qCover:strong/q.length,len:b.e[0].length});
  }
  /* how much of the row the words covered comes first: someone typing two
     words wants the row those two words are, not the row that happens to
     share a word with every other thing in the shop. */
  out.sort((a,b)=>b.cover-a.cover||b.score-a.score||b.nameCover-a.nameCover||a.len-b.len);
  return out.slice(0,6);
}
function searchBook(txt){ return searchBookHits(txt).map(o=>o.e); }
/* The photo path has nobody checking the answer before it becomes a price, so
   it takes a row only when the words land on what the row actually is - the
   head word ("cooler", "digger", "earbuds") or a name the row owns outright
   ("airpods"). Matching the trim is not enough: a Kenmore range came back
   "E-bike" on "electric", a chainsaw "Gun cabinet" on "case", and a Samsung
   TV a Blackstone griddle on "flat". */
/* The reader is asked for a model and sometimes answers with a sentence:
   "Likely M510 (Unifying wireless mouse) - model number on underside". Cut
   to the part that is actually a model - no hedge, nothing bracketed,
   nothing past a dash or a comma - or the ticket carries prose, and the
   phone's headline reads "Logitech Likely M510 (Unifying wireless mo". */
function tidyModel(t){
  let v=String(t||"").replace(/[\u2014\u2013]/g," - ").trim();
  v=v.replace(/^(likely|probably|possibly|possible|maybe|appears to be|looks like|seems to be)\s+/i,"");
  v=v.replace(/^(a|an|the)\s+/i,"");
  v=v.split(/\s-\s|[(,;:]/)[0];
  return v.replace(/\s+/g," ").trim().slice(0,28);
}
/* a row named outright, spelled the way the book spells it */
function bookRow(name){
  const n=omniNorm(name);
  return PRICEBOOK.find(e=>omniNorm(e[0])===n)||null;
}
function photoBook(txt){
  const h=searchBookHits(txt).find(x=>(x.headHit&&x.cover>=0.75)||(x.cover>=0.66&&x.score>=4)||(x.rare&&x.qCover>=0.4));
  return h?h.e:null;
}
function brandVerdictHTML(){
  if(!st.brandTyped)return "";
  const hit=brandLookup(st.catId,st.brandTyped);
  if(!hit)return `<span style="color:var(--warn)">Not in the book — pick the tier below yourself.</span>`;
  const words={hi:"top tier here — worth ~40% over standard",mid:"standard tier — the baseline number",lo:"budget tier — worth about half of standard"};
  return `<b style="color:var(--accent)">${hit.name}</b> — ${words[hit.tier]}.`;
}
const FLAGS=[
 "No photo ID, or the ID doesn't match the face",
 "Serial number ground, filed, or scratched off",
 "Still in retail packaging with security tags on",
 "Doesn't know how to work his own item",
 "Three of the same thing, or six identical tools",
 "Under 18 — statutory, no judgment involved",
 "Apparently drunk or high — statutory, we may not transact",
 "Using somebody else's name, or another business's name",
 "Won't hold still for the transaction form",
 "Price doesn't matter to him — takes any offer",
 "Wants to stay in his vehicle — no drive-up transactions, ever"];
/* Not red flags about the person - these are items that are simply more
   trouble than they are worth. Kept out of the price lists on purpose. */
const NO_TAKE=[
 ["Mattresses and box springs","Bedbugs, stains and state bedding law. You cannot resell a used one in Florida without it being sanitised and tagged, and nobody is set up for that. No price is low enough."],
 ["Car seats and boosters","They expire, they are recalled constantly, and one that has been in a wreck looks exactly like one that has not. If a child is hurt in a seat you sold, that is yours."],
 ["Strollers, cribs, playpens","Same recall problem, and drop-side cribs are outright banned. Small money, real liability."],
 ["Anything with a ground-off serial","Already on the walk-away list above, and it is worth repeating: that is a felony waiting on the counter."]];
const DEVICE_STEPS=[
 {t:"Dial *#06# and check the IMEI",d:"Free at stolenphonechecker.org. Blacklisted means reported stolen OR unpaid carrier financing — either way it won't activate on any US carrier and it's worth nothing."},
 {t:"He removes the lock — at the counter, not later",d:"iPhone: Settings → his name → Find My → Find My iPhone → off. Needs his Apple ID password. Android: Settings → Accounts → remove the Google account BEFORE any reset."},
 {t:"Then factory reset, still standing there",d:"Order matters on Android. Reset before removing the account and it locks itself."},
 {t:"Boot it and watch the screen",d:"Setup screen with no account prompt = clean. Asks for an Apple ID or Google account = brick. Hand it back."},
 {t:"Never take a password",d:"Not written down, not typed in, not 'he told you.' He does the removal or there's no deal. Passwords change; a promise is worth nothing in thirty days."},
 {t:"Buy phones. Don't lend on them.",d:"A pawn customer wants it back with his photos on it. You need it wiped. Those can't both be true — so buy outright, or pass."}];

/* THE COUNTER ANSWER — what to say when he asks why the number is what it is.
   Written to be read out loud across the counter, not recited from a policy
   binder. Metal and merchandise get different answers because he is asking
   two different questions. */
const WHY={
 metal:[
  ["Selling it outright","The gold becomes ours the moment we pay you. It still has to sit here untouched for 30 days before it can go anywhere \u2014 that is state law, not our rule \u2014 and then it goes to the refiner. One outcome, and half the waiting."],
  ["Pawning it","The gold stays yours. You are borrowing against it, and you get it back when you pay off the ticket."],
  ["Why the loan is the smaller number","A loan doubles that wait and leaves the ending open. Your ticket matures at day 30 and you have until day 60 to come get it, so we carry the price for twice as long without knowing whether we end up with the gold or the money. If it drops while we hold it, we are sitting on something worth less than we handed you. Lending lower is what makes both endings survivable."],
  ["Why neither one is full melt","Melt is what the metal is worth as a bar at a refinery, not across this counter. The difference pays the refiner, the counter, and the lights."]],
 item:[
  ["What it sells for is not what it is worth today","It has to sit on the shelf first, and around here some things sit a long while."],
  ["Listed is not sold","A price online that nobody actually paid does not tell us anything. We go by what these really bring."],
  ["Why the loan is a share of that","If you pay the ticket, you get it back and we have made the fee. If you do not, we own it and we have to sell it ourselves, for whatever it brings then. The loan has to be small enough that both of those endings work."],
  ["Why slow movers get less","That is not a knock on your item. It is how long our money sits in it before it turns back into money."]]};
function whyHTML(kind){
  if(!st.whyOpen)
    return `<button id="whyBtn" class="ghostBtn" style="width:100%;margin-top:11px;padding:10px 0">Why is it this much? &mdash; what to tell him</button>`;
  return `<div class="tagNote" style="margin-top:11px">
    ${WHY[kind].map(r=>`<div style="margin-bottom:9px"><b style="color:var(--ink)">${r[0]}.</b> ${r[1]}</div>`).join("")}
    <button id="whyBtn" class="ghostBtn" style="width:100%;margin-top:4px;padding:9px 0">Close</button></div>`;
}

const money = n => "$" + Math.round(n).toLocaleString("en-US");
const ladder = (p,c) => [
 {k:"BY DAY 30",due:p+c},
 {k:"DAY 31–60",due:p+c*2},
 {k:"DAY 90",due:p+c*2+(c/30)*30}];

/* ---------------- state ---------------- */
const KEY="pawndesk:web:v1";
let st={mode:"item",catId:"guns",itemId:"g1",picked:false,cond:"good",brand:"mid",complete:true,liq:null,brandTyped:"",model:"",detail:"",specSel:{},
        overrides:{},bookVals:{},modelVals:{},ltvs:{},buys:{},buyFloor:25,buyMult:2,payPct:70,payTouched:false,loanPct:48,loanTouched:false,editing:false,
        manual:null, /* {date, spot:{gold,silver}, avg90:{gold,silver}} — a same-day hand edit beats the feed */
        deal:"buy",metal:"gold",karat:"14k",grams:"",whyOpen:false,photoRead:null,bookQ:"",bookName:""};
try{
  const s=JSON.parse(localStorage.getItem(KEY)||"null");
  if(s){ st.overrides=s.overrides||{}; st.ltvs=s.ltvs||{}; st.buys=s.buys||{};
    st.bookVals=s.bookVals||{}; st.modelVals=s.modelVals||{};
    if(s.buyFloor!=null)st.buyFloor=Math.max(0,Number(s.buyFloor)||0);
    if(s.buyMult!=null)st.buyMult=Math.max(1,Number(s.buyMult)||1);
         /* A hand-set pay rate wins only for the day it was set — tomorrow's
            feed brings new numbers, so the rate goes back to following them. */
         if(s.payDate===FEED.date && typeof s.payPct==="number"){ st.payPct=s.payPct; st.payTouched=!!s.payTouched; }
         if(s.payDate===FEED.date && typeof s.loanPct==="number"){ st.loanPct=s.loanPct; st.loanTouched=!!s.loanTouched; }
         if(s.manual && s.manual.date===FEED.date) st.manual=s.manual; }
}catch(e){}
/* The catalog's first item is only a fallback so the math always has something
   to hold — it is not a choice the clerk made. Nothing counts as chosen until
   something actually assigns itemId, which only ever happens on a tap, a
   search pick, or a photo read. */
(function(){ let _iid=st.itemId; Object.defineProperty(st,"itemId",{
  get(){ return _iid; }, set(v){ _iid=v; st.picked=true; },
  enumerable:true, configurable:true }); })();
let saveTimer=null;
function persist(){
  try{
    localStorage.setItem(KEY,JSON.stringify({overrides:st.overrides,ltvs:st.ltvs,buys:st.buys,
      bookVals:st.bookVals,modelVals:st.modelVals,
      buyFloor:st.buyFloor,buyMult:st.buyMult,payPct:st.payPct,flow:st.flow,
      payTouched:st.payTouched,loanPct:st.loanPct,loanTouched:st.loanTouched,payDate:FEED.date,manual:st.manual}));
    flashSave("Saved");
  }catch(e){ flashSave("Couldn't save"); }
}
function flashSave(msg){
  const el=document.getElementById("saveNote"); if(!el)return;
  el.textContent=msg; clearTimeout(saveTimer); saveTimer=setTimeout(()=>{el.textContent="";},1600);
}
function spotOf(m){ return st.manual ? st.manual.spot[m] : FEED[m]; }
function avgOf(m){ return st.manual ? st.manual.avg90[m] : FEED[m+"90"]; }
function makeManual(){ if(!st.manual) st.manual={date:FEED.date,spot:{gold:FEED.gold,silver:FEED.silver},avg90:{gold:FEED.gold90,silver:FEED.silver90}}; }

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");

/* fill the recessed track up to the knob */
function paintSlider(el){
  if(!el)return;
  const p=(el.value-el.min)/(el.max-el.min)*100;
  el.style.background=`linear-gradient(90deg,#4DFFC4 0%,var(--accent) ${p}%,var(--recess) ${p}%)`;
}

/* the anchor gauge: 270° sweep, recessed track, emissive gradient arc.
   Quiet mode: the tick ring is static — no rotation. */
function gauge(pct,label,big,small,id){
  const T=613,C=817,v=(Math.max(0,Math.min(1,pct))*T).toFixed(0);
  return `<div class="gwrap"><svg viewBox="0 0 340 340" role="img" aria-label="${label} ${big}">
   <defs>
    <linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#00D9FF"/><stop offset="100%" stop-color="#00E8A0"/>
    </linearGradient>
   </defs>
   <circle cx="170" cy="170" r="163" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1" stroke-dasharray="1.5 13"/>
   <circle cx="170" cy="170" r="130" fill="none" stroke="rgba(0,0,0,.65)" stroke-width="24" stroke-linecap="round" stroke-dasharray="613 817" transform="rotate(135 170 170)"/>
   ${+v>0?`<circle cx="170" cy="170" r="130" fill="none" stroke="url(#${id})" stroke-width="22" stroke-linecap="round" stroke-dasharray="${v} 817" transform="rotate(135 170 170)"/>`:""}
  </svg>
  <div class="gcenter"><span class="gl">${label}</span><b>${big}</b><span class="gs">${small}</span></div></div>`;
}

/* ---------------- tabs ---------------- */
const PRICE_TABS=[["item","Price an item"],["metal","Gold & silver"]];
const REF_TABS=[["log","Deal log"],["device","Phones & devices"],["flags","Walk away"],["setup","Setup"]];
function renderTabs(){
  const btn=([id,l])=>`<button class="${st.mode===id?"on":""}" data-tab="${id}">${l}</button>`;
  document.getElementById("tabs").innerHTML =
    `<div class="pills">${PRICE_TABS.map(btn).join("")}</div>`+
    `<div class="pills ref">${REF_TABS.filter(t=>t[0]!=="log"||CAP.db).map(btn).join("")}</div>`;
}
document.getElementById("view").addEventListener("click",e=>{
  if(e.target.closest("#whyBtn")){ st.whyOpen=!st.whyOpen; render(); }
  /* The tab strip's own handler sits on #tabs, so a button inside the view
     that wants to send you to a tab needs saying so here. */
  const go=e.target.closest&&e.target.closest("[data-gotab]");
  if(go){ st.mode=go.dataset.gotab; st.editing=false; render(); }
});
document.getElementById("tabs").addEventListener("click",e=>{
  const b=e.target.closest("[data-tab]"); if(!b)return;
  st.mode=b.dataset.tab; st.editing=false; render();
});

/* ---------------- item tab ---------------- */
const custId = catId => "cust-"+catId;
function custItem(cat){
  return {id:custId(cat.id), name:"Something else", value:st.overrides[custId(cat.id)]??100, liq:"normal"};
}
function calcItem(){
  const cat=CATALOG.find(c=>c.id===st.catId);
  const item=st.itemId===custId(cat.id) ? custItem(cat) : (cat.items.find(i=>i.id===st.itemId)||cat.items[0]);
  const baseValue=st.overrides[item.id]??item.value;
  const baseLtv=st.ltvs[st.catId]??cat.ltv;
  const condition=CONDITIONS.find(c=>c.id===st.cond);
  /* The make is often written on the thing itself: "DeWalt 20V drill kit"
     was picked off the price list and the desk still priced it as Ryobi,
     because st.brand defaults to "mid" and nothing read the name. Mid
     against top is 40% of the price - the desk was not just failing to
     answer a question it could answer, it was answering it wrong.
     A make typed by hand always wins; this only fills the silence. */
  const namedBrand=(cat.brand.on&&!st.brandTyped)
    ? brandFromName(cat.id,(item.name||"")+" "+(st.bookName||"")) : null;
  const brandTier=namedBrand?namedBrand.tier:st.brand;
  const brandMult=cat.brand.on?BRANDS.find(b=>b.id===brandTier).mult:1;
  /* What a missing piece costs. It was a flat 30% for everything, which was
     a guess nobody had checked - and it is the wrong number where it has
     been checked. Consoles sold WITHOUT a controller went for 0.88 to 0.94
     of one with, across four models: a tenth off, not a third. Docking 30%
     for a missing controller was lending $180 against an Xbox that resells
     for $500. Per-category now; the ones still at 0.7 are still guesses and
     say so in the catalog. */
  const completeMult=cat.complete.on&&!st.complete?(Number(cat.complete.mult)||0.7):1;
  const liqId=st.liq||item.liq;
  const liquidity=LIQUIDITY.find(l=>l.id===liqId);
  let spec;
  const _ch=SPEC_CHOICES[item.id];
  if(_ch){
    spec={mult:1,notes:[],stop:false,absSuggest:null};
    _ch.forEach((g,gi)=>{const sel=st.specSel[item.id+":"+gi]??specBase(g);const o=g.options[sel]||g.options[specBase(g)];
      spec.mult*=o.m;if(o.note)spec.notes.push(o.note);if(o.stop)spec.stop=true;});
    const gw=genWatts(item.name,st.model+" "+st.detail);
    if(gw){spec.absSuggest=gw.abs;spec.notes.push(gw.note);}
    spec.mult=Math.max(.4,Math.min(1.8,spec.mult));
  } else {
    spec=specRead(st.catId,item.name,st.model+" "+st.detail);
  }
  const market=marketNow(), checked=!!(market&&!market.stale);
  /* A number the counter typed themselves is what THIS one is worth. They
     have the thing in their hands; the scratches are already in the figure.
     Multiplying it by the condition adjustment prices the wear twice - type
     $150 for a rough one and the desk quietly made it $112 - so a hand-set
     resale is taken as it stands. Everything else (a list price, a shelf
     tag, a price worked back from new) describes a typical good one, and
     those still get adjusted. */
  const handSet=checked&&market.kind==="hand";
  const cond=handSet?1:(COND_MULT[st.cond]||1);
  const resale=checked ? market.mid*cond*completeMult
                       : baseValue*CATALOG_AT_GOOD*cond*brandMult*completeMult*spec.mult;
  const ltv=Math.max(10,baseLtv+liquidity.adj);
  const target=Math.max(5,Math.round(resale*ltv/100));
  const buyBase=(st.buys&&st.buys[st.catId]!=null)?st.buys[st.catId]:((typeof BUY_DEFAULT!=="undefined"&&BUY_DEFAULT[st.catId]!=null)?BUY_DEFAULT[st.catId]:Math.min(90,baseLtv+5));
  const buyPct=Math.max(10,Math.min(90,buyBase+liquidity.adj));
  /* Three things cap what you can pay, and the tightest one wins.

     The RATE is a share of resale, and it is the only one that bites on
     expensive things - it is what stops you paying $1,650 for a $3,000 saw
     because doubling your money still technically worked.

     The FLOOR is the least you will clear in dollars, and it bites at the
     bottom: it stops the $30 item you haul home, photograph, list and ship
     for nine dollars of profit.

     The MULTIPLE is how many times your money has to come back, and it bites
     in the middle, where a percentage looks reasonable and the dollars are
     thin.

     Whichever leaves the most profit decides, and the desk says which it
     was - because "why only $85?" is the question you ask standing in
     somebody's driveway. */
  const buyFloor=Math.max(0,Number(st.buyFloor)||0);
  const buyMult=Math.max(1,Number(st.buyMult)||1);
  const capRate ={k:"rate", pay:resale*buyPct/100};
  const capFloor={k:"floor",pay:resale-buyFloor};
  const capMult ={k:"mult", pay:resale/buyMult};
  const cap=[capRate,capFloor,capMult].sort((a,b)=>a.pay-b.pay)[0];
  const buyCapBy=cap.k;
  /* Below this there is nothing left to make: clearing the floor would cost
     more than the thing sells for. */
  const buyTooThin=cap.pay<1;
  const buy=Math.max(1,Math.round(cap.pay));
  return {cat,item,baseValue,baseLtv,condition,liquidity,liqId,resale,ltv,target,market,checked,handSet,buyBase,buyPct,buy,
          brandTier,namedBrand:namedBrand&&namedBrand.name,
          brandMult,brandName:cat.brand.on?(((ITEM_OVERRIDES[st.itemId]||{}).tiers)||cat.brand)[brandTier]:null,spec,specMult:spec.mult,
          low:Math.max(5,Math.round(resale*Math.max(8,ltv-12)/100)),
          high:Math.max(5,Math.round(resale*Math.min(100,ltv+8)/100)),
          charge:Math.max(5,target*0.25),margin:resale-target,buyMargin:resale-buy,
          buyCapBy,buyTooThin,buyFloor,buyMult};
}
/* The panel that does not move. Everything else on this page walks the
   counter through a decision; this one just shows where those decisions have
   landed, and it is short enough to stay on screen while they do - which the
   1406px loan card never was. */
/* Why the buy price is what it is, in the words you would use out loud. */
function buyCapWhy(x){
  return x.buyCapBy==="rate"  ? x.buyPct+"% of resale, your "+x.cat.label.toLowerCase()+" rate"
       : x.buyCapBy==="floor" ? "leaving you the "+money(x.buyFloor)+" you asked to clear"
       :                        x.buyMult+"\u00d7 your money back";
}
function pinHTML(x){
  const F=fakeState(fakeSheet(x));
  const bare=t=>`<div class="pinStrip"><span class="pinLab">${window.PHONE?"What it's worth to you":"The numbers"}</span><span class="pinNote">${t}</span></div>`;
  if(F&&F.blocks)return bare(F.verdict==="fail"?"A check failed \u2014 don't lend on the name."
    :"Not checked yet \u2014 "+F.done+" of "+F.n+" on the "+esc(F.sh.title.toLowerCase())+" sheet.");
  if(!x.checked)return bare("No resale value yet \u2014 step 4 sets it.");
  /* Each figure is named so a narrow screen can lay them out as a grid with
     the loan on top. On the desk they stay a single row and the name is
     ignored. */
  const cell=(k,l,v,big)=>`<div class="pinCell${big?" big":""}" data-k="${k}"><span>${l}</span><b>${v}</b></div>`;
  /* The phone goes to yard sales and thrift stores, where there is no loan to
     make - you pay their price or you walk. So it leads with the most you
     should pay, and the loan drops to an aside. The fee and the loan-to-
     resale percentage are pawn-counter mechanics and mean nothing over a
     folding table, so the phone does not carry them at all. */
  const P=!!window.PHONE;
  /* These two numbers are the only things on the page anyone says out loud,
     and they used to sit in a row of six at the same weight - the buy price
     second, prefixed "Or", reading as an afterthought, and "Loan / resale
     35%" given equal billing beside it. Buy and lend are the decision; the
     other four are the arithmetic behind it. So the two lead, together and
     the same size, and the rest drop to a subordinate line.

     The strip was called "Where it stands", which describes the state of
     the app rather than the money. It is the numbers. */
  return `<div class="pinStrip pinDecide${deskRail()?" pinRail":""}${P&&x.buyTooThin?" thin":""}">
    <span class="pinLab">${P?"What it's worth to you":"The numbers"}</span>
    <button class="pinNew" id="pinNew" type="button" title="Clear this item and start the next one. Your rates, shelf record, listings and deal log are kept.">Start over</button>
    ${P?(x.buyTooThin?cell("buy","Not worth buying","Walk away",1)
                     :cell("buy","Pay up to",money(x.buy),1))
        +cell("lend","Or lend on it",money(x.target),1)
       :cell("buy","Buy it for",money(x.buy),1)+cell("lend","Lend him",money(x.target),1)}
    ${cell("resale",x.handSet?(P?"Resells for":"Resale, yours"):(P?"Resells for":"Resale, "+esc(COND_WORDS[st.cond][0].toLowerCase())),money(x.resale))}
    ${P&&!x.buyTooThin?cell("gain","You'd make",money(x.buyMargin)):""}
    ${cell("cushion","Your cushion",money(x.margin))}
    ${cell("fee","Fee / 30 days",money(x.charge))}
    ${cell("ltv","Loan \u00f7 resale",x.ltv+"%")}
    <span class="pinNote">${P?(x.buyTooThin
        ?`It doesn\u2019t sell for enough to clear the ${money(x.buyFloor)} you want out of a buy.`
        :`Capped by ${esc(buyCapWhy(x))}. Over ${money(x.buy)} and you\u2019re eating the ${money(x.buyMargin)}.`)
      :`Range ${money(x.low)}&ndash;${money(x.high)}. Never above the top.`}${x.buy===x.target?` Buy and lend match in ${esc(x.cat.label.toLowerCase())} on purpose \u2014 ${esc(BUY_WHY[x.cat.id]||"")}.`:""}</span>
  </div>`;
}
/* HOW MUCH IS BEHIND THE NUMBER.
   The desk has always known this and said it in one line of small grey type:
   how many listings the resale value rests on, how many of those were real
   sales rather than asking prices, and which sites they came from. A price
   built on nine completed eBay sales and a price built on two hopeful
   Craigslist ads were exactly the same size on the screen.

   They are not the same number. The difference is whether you hold your
   offer when he argues, and it is the first thing you would want to know
   standing there - so it gets drawn rather than mentioned.

   The bar is the share that were real sales. Amber, not green, when most of
   what is behind the figure is somebody's asking price: asks run high, and
   high is the wrong way to be wrong when the money is going out. */
function weightHTML(x){
  const m=x.market;
  const CONF={h:[100,"","good data"],m:[62,"warn","fair data"],l:[28,"warn","thin - check it"]};
  const bar=(pct,tone)=>`<div class="wBar"><i class="${tone||""}" style="width:${Math.max(3,Math.min(100,Math.round(pct)))}%"></i></div>`;
  const card=(head,right,barHTML,foot)=>`<div class="card wCard">
    <span class="label" style="margin:0">Behind this number</span>
    <div class="wHead"><b>${head}</b><span>${right}</span></div>
    ${barHTML}${foot?`<div class="wFoot">${foot}</div>`:""}</div>`;

  if(!m||!x.checked)
    return card("Not checked","built-in estimate",bar(100,"none"),
      "Nothing has been looked up for this one. The figure is the desk's own starting point, not a sale anybody made. Look it up and this fills in.");

  if(m.kind==="found"||m.kind==="harvest"){
    const n=m.n||0, sold=m.sold||0, share=n?sold/n:0;
    const asks=n-sold;
    /* The pictures belong HERE, not only on the step that set the price.
       By the time the counter is deciding, the price is already set and
       step 2 is long gone - and "12 sold" is a claim, while twelve pictures
       are something they can check against the thing in their hand. */
    return card(n+" listing"+(n===1?"":"s"), sold+" sold · "+asks+" asking",
      bar(n?share*100:3,share>=0.5?"":"warn"),
      (m.from?esc(m.from)+"<br>":"")
      +(share>=0.5
        ?"Most of these are prices somebody actually paid."
        :"<b>Mostly asking prices.</b> Nobody paid these - they are what sellers hope for, and they run high. Treat the figure as a ceiling."))
      +thumbStripCard(compsMatch(x));
  }

  if(m.kind==="list"){
    const c=CONF[m.conf]||CONF.m;
    return card(esc(srcName(m.src)),c[2],bar(c[0],c[1]),
      "From the desk's price list for <b>"+esc(m.name||"this model")+"</b>, checked "+esc(fmtDay(m.date))+"."
      +(m.mine?" This one is your own figure off the master sheet.":""));
  }

  if(m.kind==="shot")
    return card(m.n+" sold","on "+esc(m.site||"the sold page"),bar(100,""),
      "Read off a sold page you photographed. These are completed sales.");

  if(m.kind==="seen")
    return card(m.n+" seen locally","asking "+money(m.ask),bar(30,"warn"),
      "<b>Another shop's shelf tags.</b> Asking prices, and they have their own markdown to come.");

  if(m.kind==="own")
    return card("your "+m.n+" sales","your own counter",bar(100,""),
      "What this shop actually got for one. Nothing beats it.");

  if(m.kind==="retail")
    return card("No sales found","worked back from new",bar(25,"warn"),
      "Nothing sold turned up, so this is "+money(m.retail)+" new taken down to a used share. A real sold price beats it every time.");

  if(m.kind==="hand")
    return card("Your own figure","typed in",bar(100,""),
      "You set this by hand, so it is taken as this one sits - condition does not adjust it again.");

  return "";
}
function paintPin(x){ const p=document.getElementById("pin"); if(p)p.innerHTML=pinHTML(x||calcItem()); }
function ticketHTML(x){
  const F=fakeState(fakeSheet(x));
  if(F&&F.blocks)return fakeHoldHTML(F);
  if(!x.checked)return uncheckedTicketHTML(x);
  return `<div class="card">
    <span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    ${gauge(x.ltv/100,"Lend him",money(x.target),"pawn loan","gi")}
    ${(st.model||st.detail)?`<div class="cardHint" style="text-align:center;margin-top:2px">Pricing: <b style="color:var(--ink)">${[st.model,st.detail].filter(Boolean).map(esc).join(" · ")}</b></div>`:""}
    ${x.spec&&x.spec.stop?`<div class="tagWarn" style="border-left-color:var(--bad);background:rgba(255,66,87,.12);color:#FFAAB4"><b>NO TITLE — NO DEAL.</b> Don't negotiate around a missing title, at any price.</div>`:""}
    <div class="tiles" style="grid-template-columns:1fr 1fr 1fr;margin-top:4px">
      <div class="widget"><div class="l">Low loan</div><div class="v">${money(x.low)}</div></div>
      <div class="widget" style="box-shadow:inset 0 1px 0 rgba(255,255,255,.13),inset 0 -1px 0 rgba(0,0,0,.5),0 4px 10px -6px rgba(0,0,0,.9),inset 0 0 0 1px rgba(0,232,160,.9)"><div class="l">Suggested loan</div><div class="v">${money(x.target)}</div></div>
      <div class="widget"><div class="l">Top loan</div><div class="v">${money(x.high)}</div></div>
    </div>
    <div class="cardHint" style="margin-top:8px">Open at the suggested loan. Go low when cash is tight or the deal feels off; go toward the top for a regular you want back. Never lend above the top — that's your cushion.</div>
    ${buyRowHTML(x)}
    ${ticketDetailHTML(x)}
  </div>${paybackHTML(x)}`;
}
/* Split out so the two halves can be read on their own. The rail carries
   the numbers panel and nothing else - see below. */
function ticketDetailHTML(x){
  return `<details class="fold"${st.openWhy?" open":""} id="whyFold"><summary class="foldLine">The detail &mdash; cushion, fee, and why it is this much</summary>
    ${x.liquidity.adj!==0?`<div class="tagNote">Cut ${Math.abs(x.liquidity.adj)} points because it's a ${x.liquidity.label.toLowerCase()} item here. Your money sits in it longer, so lend less — don't drop the price.</div>`:""}
    <div class="tiles">
      <div class="widget"><div class="l">Resale value in this condition</div><div class="v">${money(x.resale)}</div></div>
      <div class="widget"><div class="l">Your cushion (resale &minus; loan)</div><div class="v">${money(x.margin)}</div></div>
      <div class="widget"><div class="l">Your fee, each 30 days</div><div class="v">${money(x.charge)}</div></div>
      <div class="widget"><div class="l">Loan &divide; resale — the ring above</div><div class="v">${x.ltv}%</div></div>
    </div>
    ${whyHTML("item")}
    </details>`;
}
function paybackHTML(x){
  return `<details class="card foldCard"${st.openPayback?" open":""} id="paybackFold">
    <summary><span class="label" style="margin:0">8 &middot; After the money moves</span><span class="foldSub">what he pays back, and the day it becomes ours</span></summary>
    <span class="label" style="margin-bottom:0;color:var(--ink-2)">He pays back</span>
    <div class="ladder">${ladder(x.target,x.charge).map(r=>`<div class="widget rung"><div class="k">${r.k}</div><div class="d">${money(r.due)}</div></div>`).join("")}</div>
    <div style="font-size:12px;line-height:1.5;color:var(--ink-2);margin-top:9px">
      It is <b style="color:var(--ink)">not</b> 25% again every month. The charge is capped at <b style="color:var(--ink)">twice</b> the 30-day amount from day 31 through day 60, then accrues <b style="color:var(--ink)">$${(x.charge/30).toFixed(2)}/day</b> after that — and remember, past day 60 the item is already yours; late redemption is a courtesy you price with this rate.
    </div>
    <div class="tagWarn"><b>Day 60 it's ours.</b> Maturity is day 30, then we must hold it 30 more. Not redeemed by day 60 and title passes to us automatically — no notice, no letter, no auction. Within the first 30 days only he or his attorney-in-fact may redeem it.</div>
    <div class="fine">&sect; 539.001(11) caps the charge at 25% of the amount financed per 30 days, minimum $5. Overcharging voids the transaction and forfeits twice the charge — but an honest mistake corrected when you catch it carries no penalty. Fix it, don't hide it.</div>
  </details>`;
}
/* THE SPEC BOOK — compiled spec economics. Read from the Details/Model text,
   applied as visible multipliers with the reasoning shown. Capped 0.4–1.8. */
const SPECBOOK={
 guns:[
  {re:/16\s*(ga|gauge)/i,mult:.85,note:"16 gauge — dying gauge, ammo scarce: −15%, and slower"},
  {re:/28\s*(ga|gauge)/i,mult:1.3,note:"28 gauge — boutique: +30%, but fewer buyers — consider Slow"},
  {re:/\.410|410\s*(bore|ga)/i,mult:1.1,note:".410 — popular little bore: +10%"},
  {re:/(12|20)\s*(ga|gauge)/i,mult:1,note:"12/20 gauge — the liquid gauges: baseline"},
  {re:/(9\s*mm|\.?223|5\.56|\.?22\b|\.?308|30-06|\.?243|6\.5)/i,mult:1,note:"common caliber — sells fast: baseline"},
  {re:/(10\s*mm|45-70|\.?357)/i,mult:1.08,note:"desirable caliber: +8%"}],
 power:[
  {re:/inverter/i,mult:1.6,note:"inverter — quiet tech runs ~60% over open-frame at the same watts"},
  {re:/(2[0-9])\s*(in|\")\s*bar/i,mult:1.15,note:"pro-length bar: +15%, slower buyer"}],
 hunt:[
  {re:/cellular/i,mult:1.25,note:"cellular model: +25% — IF it activates on a current plan"}],
 tools:[
  {re:/\b12\s*v/i,mult:.6,note:"12V platform — worth ~40% less than 18/20V"},
  {re:/\b(36|40|56|60)\s*v/i,mult:1.2,note:"high-voltage platform: +20%"}],
 elec:[
  {re:/\b(7\d|8\d)\s*(in|\")/,mult:1.4,note:"75in-class screen: +40%"},
  {re:/\b(3[0-9])\s*(in|\")/,mult:.5,note:"small screen: about half"}],
 rolling:[
  {re:/(no|lost|missing)\s+title/i,mult:1,note:"NO TITLE — NO DEAL, at any price",stop:true}]};
/* PER-ITEM OVERRIDES — where the category default misleads. Each entry can
   replace the tier pill labels, the typed-brand book, and the details prompt. */
/* STRUCTURED SPEC CHOICES — pick, don't type. First option is always the
   baseline. Each item asks 2–3 questions; every answer carries its exact
   multiplier and reasoning. Stacked, capped 0.4–1.8. */
const CH_GAUGE={label:"Gauge",options:[
  {t:"12 ga",m:1},{t:"20 ga",m:1},
  {t:"16 ga",m:.85,note:"16 gauge — ammo scarce: −15%, and slower"},
  {t:"28 ga",m:1.3,note:"28 gauge — boutique: +30%, fewer buyers — consider Slow"},
  {t:".410",m:1.1,note:".410 — popular little bore: +10%"}]};
const CH_BARREL={label:"Barrel",options:[
  {t:"Field length (24–28 in)",m:1},
  {t:"Short / home-defense (18–20 in)",m:1.05,note:"defense length: +5%"},
  {t:"Extra-long (30 in +)",m:.9,note:"long target barrel — fewer local buyers: −10%"}]};
const CH_CALIBER={label:"Caliber",options:[
  {t:"Common (9mm, .223, .308…)",m:1},
  {t:"Desirable (10mm, .45-70…)",m:1.08,note:"desirable caliber: +8%"},
  {t:"Oddball",m:.85,note:"oddball caliber — fewer local buyers: −15%, consider Slow"}]};
const CH_OPTIC={label:"Optics mounted",options:[
  {t:"None / irons",m:1},
  {t:"Scoped — decent glass",m:1.15,note:"decent glass on top: +15%"},
  {t:"Scoped — junk glass",m:1,note:"junk glass adds nothing — price the gun alone"}]};
const CH_TITLE={label:"Title",options:[
  {t:"Title in hand",m:1},
  {t:"NO title",m:1,stop:true,note:"NO TITLE — NO DEAL, at any price"}]};
const CH_VOLT={label:"Battery platform",options:[
  {t:"18 / 20V",m:1},
  {t:"12V",m:.6,note:"12V platform — worth ~40% less"},
  {t:"36V+",m:1.2,note:"high-voltage platform: +20%"}]};
const CH_PWR={label:"Power",options:[
  {t:"Gas",m:1},
  {t:"Battery — with battery & charger",m:.9,note:"battery unit: −10%, and the battery is most of the value"},
  {t:"Battery — bare, no battery",m:.4,note:"bare battery tool: −60%"},
  {t:"Corded electric",m:.5,note:"corded: about half"}]};
const CH_AGE={label:"Age",options:[
  {t:"Under 3 yr",m:1},
  {t:"3–6 yr",m:.6,note:"3-6 years old: −40%"},
  {t:"6 yr +",m:.4,note:"aged electronics — accessory money"}]};
const CH_GRADE={label:"Grade",options:[
  {t:"Homeowner",m:1},
  {t:"Farm / ranch",m:1.1,note:"farm grade: +10%"},
  {t:"Pro / commercial",m:1.25,note:"pro grade: +25%"}]};
/* Which option stands when nobody has answered yet: the neutral one, the one
   that does not move the price. Never "whichever is listed first" - the bands
   read best in size order, and reading order and neutral only ever coincided
   by luck. */
function specBase(g){ const i=g.options.findIndex(o=>(o.m||1)===1); return i<0?0:i; }
/* Appliances die on age more than anything else - a ten-year-old washer is
   a repair call waiting to happen, and everyone at the counter knows it. */
const CH_APPL_AGE={label:"Age",options:[
 {t:"Under 3 yr",m:1.2,note:"nearly new: +20%"},
 {t:"3\u20137 yr",m:1},
 {t:"8\u201312 yr",m:.7,note:"getting old: \u221230%"},
 {t:"Over 12 yr / unknown",m:.45,note:"old or unknown age \u2014 it is scrap with a cord on it"}]};
const SPEC_CHOICES={
 g1:[CH_GAUGE,CH_BARREL],g2:[CH_GAUGE,CH_BARREL],
 g3:[CH_CALIBER,CH_OPTIC],g4:[CH_CALIBER,CH_OPTIC],
 g5:[CH_CALIBER,{label:"Build",options:[{t:"Basic / irons",m:1},{t:"Optic + real upgrades",m:1.15,note:"upgraded build: +15%"}]}],
 g6:[{label:"Action",options:[{t:"Semi-auto (10/22 class)",m:1},{t:"Bolt / single-shot",m:.85,note:"bolt/single .22s sell slower: −15%"}]},CH_OPTIC],
 g7:[CH_CALIBER,{label:"Size",options:[{t:"Full / compact",m:1},{t:"Pocket (.25/.380 junk-class)",m:.8,note:"pocket-class: −20%"}]}],
 g8:[CH_CALIBER,{label:"Barrel",options:[{t:"3–6 in",m:1},{t:"Snub 2 in",m:1},{t:"7 in + hunter",m:.9,note:"long hunter barrel — narrower market: −10%"}]}],
 g9:[{label:"Type",options:[{t:"In-line (modern)",m:1},{t:"Sidelock / traditional",m:.8,note:"traditional — thin buyer pool: −20%"}]},CH_OPTIC],
 g10:[CH_CALIBER,CH_OPTIC],
 p1:[{label:"Bar length",options:[{t:"Under 16 in",m:.85,note:"short bar — homeowner saw: −15%"},{t:"16–18 in",m:1},{t:"19 in +",m:1.15,note:"pro-length bar: +15%, slower buyer"}]},CH_GRADE],
 p2:[CH_PWR,CH_GRADE],p3:[CH_PWR,CH_GRADE],
 /* No "battery mower, no battery" option, and that is deliberate. eBay
    cannot price a mower at all: 0 of 10 push mowers in the harvest came
    back usable, and the share gate marked four of them local-only outright
    - a Honda HRX217 returned 4 real machines out of 39 listings, the rest
    spindles and deck belts. Measuring bare against with-battery on that
    data gave bare as DEARER, 1.25x, which is the pooled-mix trap and not a
    market. A mower without its battery is a real thing that walks in; it is
    just not a thing eBay can put a number on. Price it off the shelf record
    and your own sales, and do not invent a multiplier here. */
 p4:[{label:"Drive",options:[{t:"Gas push",m:1},{t:"Self-propelled",m:1.15,note:"self-propelled: +15%"},{t:"Battery — with battery",m:.9,note:"battery mower: −10%"},{t:"Corded electric",m:.5,note:"corded: about half"}]},
     {label:"Deck",options:[{t:"Standard 20–22 in",m:1},{t:"Wide-area 26 in +",m:1.2,note:"wide-area: +20%"}]}],
 p5:[{label:"Deck",options:[{t:"Under 42 in",m:.85,note:"small deck: −15%"},{t:"42–45 in",m:1},{t:"46 in +",m:1.15,note:"bigger deck: +15%"}]},
     {label:"Hours",options:[{t:"Under 300",m:1},{t:"300–800",m:.85,note:"mid-life hours: −15%"},{t:"High / unknown",m:.7,note:"high or unknown hours: −30%"}]}],
 p6:[{label:"Power",options:[{t:"Gas",m:1},{t:"Electric",m:.6,note:"electric washer: −40%"}]},
     {label:"Pressure",options:[{t:"Under 2,500 PSI",m:.8,note:"light duty: −20%"},{t:"2,500–3,200 PSI",m:1},{t:"3,200 PSI +",m:1.2,note:"commercial PSI: +20%"}]}],
 p7:[{label:"Type",options:[{t:"Open-frame",m:1},{t:"Inverter",m:1.6,note:"inverter — ~60% over open-frame at the same watts"}]},
     {label:"Start",options:[{t:"Pull start",m:1},{t:"Electric start",m:1.1,note:"electric start: +10%"}]}],
 /* Measured 22 Sep off 1,057 eBay listings across 30 drill models.
    One battery against two, same model, single tool only: 0.87 - so the
    0.9 here was right and stays.

    The combo figure was not. A combo is a drill AND a second tool, and it
    was carrying +15% when the listings say +60%: single-tool kits with two
    batteries run $86, combos $150 (n=30). The counter was lending against
    one tool while two were on the bench.

    Worth knowing for the baseline: of 560 real listings only 23 were a
    single tool with two batteries. The used drill kit that actually walks
    in has ONE battery, and a bare one is 0.60 of that. */
 /* Measured 23 Sep off 629 listings. The shares matter as much as the
    prices: BARE is the biggest group at 274, and it was not on the list at
    all. A bare drill could only be entered as "One battery", which prices a
    $45 tool at $75 - a two-thirds over-lend on the commonest thing that
    crosses the counter.

      bare    n=274   $45   0.52x
      one     n=266   $75   0.87x
      two     n= 25   $86   1.00x   <- the baseline, and the rarest
      combo   n= 64   $141  1.64x

    The baseline stays on two-batteries so the catalogue value does not have
    to move; what changes is that the other three can now be said. */
 t1:[CH_VOLT,{label:"What came with it",options:[
   {t:"Two batteries + charger",m:1},
   {t:"One battery + charger",m:.87,note:"one battery: −13%"},
   {t:"Tool only — no battery",m:.52,note:"bare tool: about half a kit"},
   {t:"Combo — a second tool with it",m:1.64,note:"two tools, not one: +64%"}]}],
 /* An impact wrench asks Battery platform, so it is a battery tool - and it
    had no way to say the battery was missing. A bare one entered as a kit
    prices 45% over.

    Measured 23 Sep and THIN: of three models only the Milwaukee 2767 had a
    usable sample (bare n=4 $122, kit n=8 $221, 0.55x); the other two rested
    on a single bare listing each and are worth nothing. What makes 0.55
    usable is that the drill says 0.52 off 274 bare listings, independently,
    and it is the same battery and the same charger missing. Recheck when
    there are more bare impact wrenches on the market. */
 t2:[CH_VOLT,{label:"Drive",options:[{t:"1/2 in",m:1},{t:"3/8 in",m:.9,note:"3/8 drive: −10%"},{t:"1 in / big iron",m:1.2,note:"heavy drive: +20%"}]},
  {label:"What came with it",options:[
    {t:"Battery + charger",m:1},
    {t:"Tool only — no battery",m:.55,note:"bare tool: about half"}]}],
 /* A corded grinder and a cordless one are not the same tool wearing a
    different cord - they are two tools that happen to share a name, and the
    gap is about two and a half times, not ten percent. Priced at +10% the
    counter lends $49 against something that resells for $108. The figures
    came out of asking prices, which read high, but the RATIO between two
    asks taken from the same search carries the same bias on both sides and
    largely cancels - it is a far safer thing to lean on than either level.
    There will be no recheck against sold prices through the API. eBay
    declined the Marketplace Insights application on 23 Sep 2026 - "highly
    limited and generally reserved for eBay's approved partners only" - so
    the ratio is what the desk has, and it is a sounder thing to stand on
    than either level. */
 t3:[{label:"Power",options:[{t:"Corded",m:1},{t:"Cordless — with battery",m:2.4,note:"cordless with a battery — a different tool: about 2.4x the corded one"},{t:"Cordless — bare",m:1.35,note:"bare cordless — the battery was most of it, but still over a corded unit"}]},
     {label:"Size",options:[{t:"4.5–6 in",m:1},{t:"7–9 in",m:1.15,note:"big grinder: +15%"}]}],
 t4:[{label:"Size",options:[{t:"Mini 2–3 gal",m:.8,note:"small tank: −20%"},{t:"Pancake 4–6 gal",m:1},{t:"8 gal +",m:1.15,note:"bigger tank: +15%"}]},
     {label:"Extras",options:[{t:"Unit only",m:1},{t:"With hose & nailer",m:1.1,note:"working combo: +10%"}]}],
 t5:[{label:"Stage",options:[{t:"Single-stage",m:1},{t:"Two-stage",m:1.3,note:"two-stage — real shop money: +30%"}]},
     {label:"Tank",options:[{t:"60 gal",m:1},{t:"80 gal",m:1.15,note:"80 gallon: +15%"}]}],
 t6:[{label:"Setup",options:[{t:"110V, gas-ready MIG",m:1},{t:"Flux-core only",m:.8,note:"flux-only: −20%"},{t:"220/240V",m:1.25,note:"220V unit: +25%"}]},
     {label:"Duty",options:[{t:"Under 160A",m:1},{t:"160–200A",m:1.1,note:"mid duty: +10%"},{t:"200A +",m:1.2,note:"heavy duty: +20%"}]}],
 t7:[{label:"Keys",options:[{t:"Keys in hand",m:1},{t:"No keys",m:.85,note:"no keys: −15%"}]},
     {label:"Size",options:[{t:"Mid box",m:1},{t:"Full-size stack",m:1.2,note:"full stack: +20%"}]}],
 /* Same story as the grinder: a pneumatic nailer is about $105 and a
    cordless one is $230-300. +20% was covering a 2x gap.

    The bare figure WAS a placeholder - built, not measured. It is
    measured now: 22 Sep, bare against kit within the same model across
    six nailers (2744, 2745, DCN692, DCN920, DCN21PL, CF325XP), ratios
    0.63 0.78 0.83 0.95 0.96 1.04, median 0.89. Pairing inside one model
    is the whole trick - pooled, the bare listings came out DEARER than
    the kits, because the bare ones were higher-end nailers.

    So bare is 0.89 of the kit: 2.0 x 0.89 = 1.8, up from the built 1.5.
    The battery is a smaller share of a nailer than of a drill, which is
    what the placeholder was reaching for - it just undershot.

    On the kit figure itself: this run puts cordless kits at $280 against
    $110 for a pneumatic, which is 2.5, not 2.0. 2.0 is the conservative
    end of the original $230-300 measurement and it is left alone on
    purpose - it is the lending side, and low is the safe way to be wrong. */
 t8:[{label:"Drive",options:[{t:"Pneumatic",m:1},{t:"Cordless — with battery",m:2,note:"cordless with a battery — roughly twice a pneumatic"},{t:"Cordless — bare",m:1.8,note:"bare cordless — no battery or charger, about a tenth under the kit"}]}],
 h1:[{label:"Type",options:[{t:"Standard 3-9x class",m:1},{t:"High-mag 4-16x+",m:1.1,note:"high-mag glass: +10%"},{t:"Fixed / oddball",m:.85,note:"odd configuration: −15%"}]},
     {label:"Features",options:[{t:"Standard",m:1},{t:"Illuminated / FFP",m:1.1,note:"premium features: +10%"}]}],
 h2:[{label:"Size",options:[{t:"Full-size (8/10x42)",m:1},{t:"Compact",m:.8,note:"compacts: −20%"}]}],
 h3:[{label:"Type",options:[{t:"Hunting (600–1000 yd)",m:1},{t:"Golf model",m:.85,note:"golf unit — wrong buyer here: −15%"}]}],
 h4:[{label:"Type",options:[{t:"SD card",m:1},{t:"Cellular — live plan",m:1.25,note:"cellular on a current plan: +25%"},{t:"Cellular — dead plan",m:.6,note:"discontinued plan — SD-card money: −40%"}]}],
 /* Bare bow checked 22 Sep against 329 compound-bow listings. Only 8 said
    bare, which is thin, but they ran 0.88 of the packages - so 0.85 stands.
    Adding up what the accessories fetch on their own (sight $79, rest $25,
    quiver $29) would argue for less, nearer 0.6; accessories sold loose
    carry a markup they never carry bolted to a bow, so the direct comps
    win and 0.85 is, if anything, a shade generous. */
 h5:[{label:"Age",options:[{t:"Current gen (under 5 yr)",m:1},{t:"5–10 yr",m:.8,note:"older bow: −20%"},{t:"10 yr +",m:.6,note:"old bow — near-accessory money"}]},
     {label:"Setup",options:[{t:"Ready-to-hunt package",m:1},{t:"Bare bow",m:.85,note:"bare bow: −15%"}]}],
 /* A bare crossbow cannot be measured on eBay: 22 Sep, ONE listing in 312
    said no scope. Crossbows are sold as packages and that is that - the
    same wall the outdoor power equipment hit, where the machine is not
    listed because nobody ships it. Comparing scope-stated against silent
    listings was tried and is noise (0.49 to 3.75 across seven brands):
    silent does not mean scopeless, it means the seller did not say.

    So this one is DERIVED, not measured, and says so. A crossbow scope on
    its own runs $165 (n=84) against a $400 package. Deducting all of it
    gives 0.59; an accessory is worth less as part of a rig than loose, so
    the true figure sits above that and well under the 0.85 that was here.
    0.7 is the middle, and the low side is the safe side to lend from.
    Revisit if bare crossbows ever start showing up listed. */
 h6:[{label:"Cocking",options:[{t:"Rope / standard",m:1},{t:"Crank-cocking",m:1.15,note:"crank models sell to older hunters: +15%"}]},
     {label:"Package",options:[{t:"Scope package",m:1},{t:"Bare",m:.7,note:"bare crossbow — the scope is most of what is missing: −30%"}]}],
 h7:[{label:"Type",options:[{t:"Spinning combo",m:1},{t:"Baitcast combo",m:1.1,note:"baitcasters: +10%"},{t:"Kids / Zebco-class",m:.6,note:"kid combos: −40%"}]}],
 h8:[{label:"Class",options:[{t:"Basic 12V",m:1},{t:"24V high-thrust",m:1.25,note:"24V thrust: +25%"},{t:"GPS / spot-lock",m:1.5,note:"spot-lock — the premium motor: +50%"}]},
     {label:"Mount",options:[{t:"Transom",m:1},{t:"Bow mount",m:1.1,note:"bow mount: +10%"}]}],
 h9:[{label:"Stroke",options:[{t:"4-stroke",m:1},{t:"2-stroke",m:.85,note:"2-stroke — older tech: −15%"}]},
     {label:"Controls",options:[{t:"Tiller",m:1},{t:"Remote w/ controls & cables",m:1.1,note:"remote rig: +10%"}]}],
 e1:[{label:"Screen size",options:[{t:"Under 43 in",m:.5,note:"small screen: about half"},{t:"43–49 in",m:.75,note:"smaller panel: −25%"},{t:"50–65 in",m:1},{t:"66 in +",m:1.4,note:"big screen: +40%"}]},
     {label:"Age",options:[{t:"Under 2 yr",m:1},{t:"2–3 yr",m:.85,note:"2-3 years: −15%"},{t:"3–5 yr",m:.7,note:"3-5 years: −30%"},{t:"5 yr +",m:.5,note:"old panel: half"}]}],
 a1:[{label:"Fuel",options:[{t:"Electric",m:1},{t:"Gas",m:1.1,note:"gas range \u2014 easier sale here: +10%"}]},CH_APPL_AGE],
 a2:[{label:"Style",options:[{t:"Top freezer",m:1},{t:"Side-by-side",m:1.15,note:"side-by-side: +15%"},{t:"French door",m:1.35,note:"french door: +35%"},{t:"Mini / dorm",m:.4,note:"mini fridge \u2014 small money"}]},CH_APPL_AGE],
 a3:[{label:"Style",options:[{t:"Top load",m:1},{t:"Front load",m:1.15,note:"front load: +15%"}]},CH_APPL_AGE],
 a4:[{label:"Fuel",options:[{t:"Electric",m:1},{t:"Gas",m:.9,note:"gas dryer \u2014 fewer hookups around here: \u221210%"}]},CH_APPL_AGE],
 a5:[{label:"Match",options:[{t:"Matching set",m:1},{t:"Mismatched",m:.85,note:"mismatched pair: \u221215%"}]},CH_APPL_AGE],
 a6:[{label:"Size",options:[{t:"Under 7 cu ft",m:.8,note:"small freezer: \u221220%"},{t:"7\u201315 cu ft",m:1},{t:"15 cu ft +",m:1.15,note:"big freezer: +15%"}]},CH_APPL_AGE],
 a7:[{label:"Size",options:[{t:"Under 8,000 BTU",m:.75,note:"small unit: \u221225%"},{t:"8,000\u201312,000 BTU",m:1},{t:"12,000 BTU +",m:1.3,note:"big unit: +30%"}]},CH_APPL_AGE],
 a9:[{label:"Type",options:[{t:"Household machine",m:1},{t:"Serger / embroidery",m:1.4,note:"serger or embroidery machine: +40%"},{t:"Vintage cabinet model",m:.6,note:"vintage cabinet \u2014 slow, bulky: \u221240%"}]}],
 /* Cordless stick checked 22 Sep: 97 stick listings against 117 uprights,
    $144 to $115 - 1.25 pooled, 1.19 within brand. 1.2 is right where it
    was. Worth noting the brands disagree sharply (Dyson 1.46, Shark 0.92):
    a stick is worth more than an upright of the same make only where the
    make is one people want cordless. */
 /* No "cordless stick, no battery" option, and that is deliberate too.
    Checked 23 Sep across Dyson V8, V10 and Shark: ONE bare listing in 35.
    The battery in a stick vacuum is built in, so one without a working
    battery is not a configuration somebody sells - it is a dead vacuum,
    and the condition scale already says that. */
 a10:[{label:"Type",options:[{t:"Upright / canister",m:1},{t:"Cordless stick",m:1.2,note:"cordless stick: +20%"},{t:"Shop vac",m:.8,note:"shop vac: \u221220%"}]}],
 e2:[CH_AGE,{label:"Class",options:[{t:"Standard",m:1},{t:"Gaming / workstation",m:1.3,note:"gaming class: +30%"}]}],
 e3:[CH_AGE],
 e4:[{label:"Age",options:[{t:"Under 2 yr, flagship-class",m:1},{t:"2–3 yr",m:.8,note:"2-3 years old: −20%"},{t:"3–5 yr",m:.6,note:"3-5 years old: −40%"},{t:"5 yr +",m:.4,note:"old phone — accessory money"}]},
     {label:"Lock",options:[{t:"Unlocked",m:1},{t:"Carrier-locked",m:.85,note:"carrier-locked: −15% (and run the Devices checklist)"}]}],
 e5:[{label:"Version",options:[{t:"Current gen, disc",m:1},{t:"Current gen, digital",m:.9,note:"digital edition: −10%"},{t:"Previous gen",m:.5,note:"last generation: half"}]},
     {label:"Controllers",options:[{t:"One",m:1},{t:"Two +",m:1.05,note:"extra controller: +5%"}]}],
 e6:[{label:"Size",options:[{t:"Standard portable",m:1},{t:"Party-size",m:1.2,note:"big speaker: +20%"}]}],
 e7:[{label:"Setup",options:[{t:"Amp + sub combo",m:1},{t:"Sub only",m:.8,note:"sub without amp: −20%"}]}],
 /* Two questions each, and neither of them prices a stone by itself - the
    shop's rule is that the metal is what is paid on and the stone rides free
    unless there is a report to read. Sheet 4 says so; this follows it. */
 j1:[{label:"Movement",options:[{t:"Automatic / mechanical",m:1},{t:"Quartz",m:.55,note:"quartz in a luxury case \u2014 far less: \u221245%"}]},
     {label:"Papers",options:[{t:"Box and papers",m:1},{t:"Watch only",m:.8,note:"no box or papers: \u221220%"}]}],
 j2:[{label:"Movement",options:[{t:"Quartz",m:1},{t:"Automatic",m:1.25,note:"automatic: +25%"}]},
     {label:"Case",options:[{t:"Clean",m:1},{t:"Scratched / worn band",m:.75,note:"worn case and band: \u221225%"}]}],
 j3:[{label:"Metal",options:[{t:"Sterling silver",m:1},{t:"Gold",m:2.4,note:"gold rather than silver: more than double"}]},
     {label:"Marks",options:[{t:"Maker's mark reads clean",m:1},{t:"Faint or missing",m:.6,note:"unproven mark \u2014 price it as no-name: \u221240%"}]}],
 j4:[{label:"Report",options:[{t:"No report",m:1},{t:"GIA or IGI report in hand",m:1.4,note:"a report you can look up: +40%"}]},
     {label:"Center stone",options:[{t:"Under 0.5 ct",m:.8,note:"small center stone: \u221220%"},{t:"0.5\u20131 ct",m:1},{t:"Over 1 ct",m:1.5,note:"over a carat: +50%, and get the report"}]}],
 m1:[{label:"Type",options:[{t:"Steel-string",m:1},{t:"Acoustic-electric",m:1.15,note:"pickup built in: +15%"},{t:"Classical / nylon",m:.8,note:"nylon-string — slow here: −20%"}]},
     {label:"Wood",options:[{t:"Laminate",m:1},{t:"Solid top",m:1.2,note:"solid top: +20%"}]}],
 m2:[{label:"Orientation",options:[{t:"Right-handed",m:1},{t:"Left-handed",m:.8,note:"lefty — tiny buyer pool: −20%, consider Slow"}]},
     {label:"Level",options:[{t:"Player grade",m:1},{t:"Beginner pack",m:.7,note:"starter pack: −30%"}]}],
 m3:[{label:"Type",options:[{t:"Solid-state",m:1},{t:"Tube amp",m:1.3,note:"tube amp: +30%"}]},
     {label:"Size",options:[{t:"Practice (under 30W)",m:1},{t:"30–50W",m:1.1,note:"mid-size: +10%"},{t:"Gigging (50W +)",m:1.2,note:"gig-size: +20%"}]}],
 r1:[CH_TITLE,{label:"Condition to tow",options:[{t:"Ready to tow",m:1},{t:"Needs lights / wiring",m:.85,note:"wiring work: −15%"}]}],
 r2:[CH_TITLE,{label:"Class",options:[{t:"Full-size (400cc +)",m:1},{t:"Youth quad",m:.7,note:"youth quad — smaller market: −30%"}]}]};
/* generator wattage from the details text — kept even with choices, since watts
   are a number, not a pick */
function genWatts(itemName,txt){
  if(!/gener/i.test(itemName))return null;
  let t=String(txt||"").replace(/[-\/]/g," ").replace(/\bkilowatts?\b/gi,"kw").replace(/\bwatts?\b/gi,"w");
  let kw=null,mm;
  if(mm=t.match(/(\d+(?:\.\d+)?)\s*k\s*w/i))kw=parseFloat(mm[1]);
  else if(mm=t.match(/(\d{3,5})\s*w\b/i))kw=parseFloat(mm[1])/1000;
  if(!kw||kw<=0.5||kw>=20)return null;
  const abs=Math.round(kw*85/5)*5;
  return {abs,note:`${kw}kW → about $${abs} used, open-frame ($85 per 1,000W; the inverter pick stacks on top)`};
}
const ITEM_OVERRIDES={
 h4:{driver:"Cellular vs SD first, then brand — a cam on a live plan is worth double a dead-plan one.",killer:"Discontinued cellular plan, corroded battery tray.",tiers:{hi:"Reconyx / Tactacam / Browning",mid:"Spypoint / Moultrie / Bushnell",lo:"Wildgame / Stealth Cam / no name"},
     brands:{hi:["Reconyx","Tactacam","Browning"],mid:["Spypoint","Moultrie","Bushnell","Muddy Pro"],lo:["Wildgame Innovations","Stealth Cam","Muddy","Vikeri","Campark"]},
     detail:{ph:"cellular or SD / megapixels — cellular, 32MP",hint:"Cellular cams only bring money if they activate on a CURRENT plan — discontinued-plan models are SD-card money."}},
 h5:{driver:"Brand and draw specs — the bow has to FIT a local buyer.",killer:"Dry-fired or cracked limbs — walk away.",tiers:{hi:"Mathews / Hoyt / Bowtech",mid:"Bear / PSE / Diamond / Elite",lo:"Box-store / no name"},
     brands:{hi:["Mathews","Hoyt","Bowtech","Elite"],mid:["Bear Archery","PSE","Diamond","Mission","Prime"],lo:["Barnett bow","Genesis","no name"]},
     detail:{ph:"draw weight & length — 70lb, 29in",hint:"The bow must FIT a local buyer — odd draw lengths sit for months."}},
 h6:{driver:"Brand tier and speed; crank-cocking models sell to older hunters.",killer:"Cracked limbs or a frayed string on a budget unit.",tiers:{hi:"Ravin / TenPoint",mid:"Excalibur / Barnett / Killer Instinct",lo:"CenterPoint / no name"},
     brands:{hi:["Ravin","TenPoint"],mid:["Excalibur","Barnett","Killer Instinct","Wicked Ridge"],lo:["CenterPoint","Bear X","no name"]},
     detail:{ph:"speed & cocking — 400fps, crank cocker",hint:"Crank-cocking models sell to older hunters — worth real money here."}},
 h7:{driver:"Brand on the REEL — the rod mostly rides along.",killer:"Gritty retrieve or a bent spool.",tiers:{hi:"Shimano / St. Croix / G Loomis",mid:"Abu Garcia / Penn / Lew's / Ugly Stik",lo:"Zebco / Shakespeare"},
     brands:{hi:["Shimano","St. Croix","G Loomis","Daiwa Tatula"],mid:["Abu Garcia","Penn","Lew's","13 Fishing","Ugly Stik","Daiwa"],lo:["Zebco","Shakespeare","South Bend"]},
     detail:{ph:"type & size — baitcaster, 7ft medium",hint:"Combos sell; oddball specialty rods sit."}},
 h8:{driver:"Thrust, voltage, and whether it has spot-lock.",killer:"Bent shaft or water in the head.",tiers:{hi:"Minn Kota Terrova+ / Garmin",mid:"Minn Kota base / MotorGuide",lo:"Newport / no name"},
     brands:{hi:["Garmin Force","Minn Kota Terrova","Minn Kota Ulterra"],mid:["Minn Kota","MotorGuide"],lo:["Newport","Watersnake","no name"]},
     detail:{ph:"thrust & shaft — 55lb, 54in, 24V",hint:"Thrust and voltage drive the price; spot-lock models are the premium."}},
 h9:{driver:"Hours and brand; 4-stroke over 2-stroke.",killer:"Low or no compression — then it is parts, not a motor.",tiers:{hi:"Yamaha / Honda / Suzuki",mid:"Mercury / Tohatsu",lo:"Off-brand import"},
     brands:{hi:["Yamaha","Honda","Suzuki"],mid:["Mercury","Tohatsu","Evinrude","Johnson"],lo:["Hangkai","Coleman outboard","no name"]},
     detail:{ph:"HP, shaft length, 2- or 4-stroke — 9.9HP, short shaft, 4-stroke",hint:"4-strokes bring more; a seized or no-compression motor is parts, not a motor."}},
 p7:{driver:"Watts, and inverter or open-frame — value tracks watts almost linearly.",killer:"Will not start, or surges under load.",tiers:{hi:"Honda / Yamaha",mid:"Generac / Champion / Westinghouse",lo:"Predator / no name"},
     brands:{hi:["Honda","Yamaha"],mid:["Generac","Champion","Westinghouse","DeWalt generator","Firman"],lo:["Predator","PowerSmart","Pulsar","no name"]},
     detail:{ph:"wattage & type — 6,500W, inverter",hint:"Value tracks watts — about $85 per 1,000 running watts open-frame; inverters run ~60% over that."}},
 p5:{driver:"Deck size, hours, and brand tier.",killer:"Blown spindles or a bent deck.",tiers:{hi:"John Deere / Kubota / Toro comm.",mid:"Cub Cadet / Troy-Bilt / Husqvarna",lo:"Murray / MTD / no name"},
     brands:{hi:["John Deere","Kubota","Toro Commercial","Exmark","Gravely"],mid:["Cub Cadet","Troy-Bilt","Husqvarna rider","Snapper","Ariens"],lo:["Murray","MTD","Yard Machines","no name"]},
     detail:{ph:"deck size & hours — 42in, ~300hrs",hint:"Deck size and hours are the price; a straight deck and clean cut matter more than paint."}},
 e1:{driver:"Size and model year are nearly the whole price.",killer:"Any panel line or burn-in — then it is worthless.",tiers:{hi:"Sony / Samsung / LG OLED",mid:"TCL / Hisense / Vizio",lo:"Onn / RCA / Sceptre"},
     brands:{hi:["Sony","Samsung","LG OLED","LG"],mid:["TCL","Hisense","Vizio"],lo:["Onn","RCA","Sceptre","Element","Westinghouse"]},
     detail:{ph:"size & year — 65in, 2024",hint:"Size and model year ARE the price — two model years old is half of new."}}
};
function itemOv(){return ITEM_OVERRIDES[st.itemId]||null;}
function specRead(catId,itemName,txt){
  const out={mult:1,notes:[],stop:false,absSuggest:null};
  let t=String(txt||""); if(!t.trim())return out;
  /* forgive typing: hyphens and slashes become spaces, spelled-out words map
     to the forms the rules expect */
  t=t.replace(/[-\/]/g," ").replace(/\s+/g," ")
     .replace(/\bgauge\b/gi,"ga").replace(/\bgage\b/gi,"ga")
     .replace(/\bvolts?\b/gi,"v").replace(/\bwatts?\b/gi,"w")
     .replace(/\bkilowatts?\b/gi,"kw").replace(/\binch(es)?\b/gi,"in");
  for(const r of (SPECBOOK[catId]||[])){
    if(r.re.test(t)){out.mult*=r.mult;out.notes.push(r.note);if(r.stop)out.stop=true;}
  }
  /* generators: value tracks watts — $85 per 1,000 running watts open-frame;
     the inverter multiplier above stacks on top (≈ $136/kW). */
  if(/gener/i.test(itemName)){
    let kw=null,m;
    if(m=t.match(/(\d+(?:\.\d+)?)\s*k\s*w/i))kw=parseFloat(m[1]);
    else if(m=t.match(/(\d{3,5})\s*w\b/i))kw=parseFloat(m[1])/1000;
    if(kw&&kw>0.5&&kw<20){
      out.absSuggest=Math.round(kw*85/5)*5;
      out.notes.push(`${kw}kW → about $${out.absSuggest} used, open-frame ($85 per 1,000W; the inverter bonus stacks on top)`);
    }
  }
  out.mult=Math.max(.4,Math.min(1.8,out.mult));
  return out;
}
const DETAIL_HINTS={
 guns:{ph:"caliber & barrel — 12ga 28in, 9mm…",hint:"Common calibers (9mm, .223, 12ga, .30-06) sell; oddballs sit — for an oddball, set speed to Slow and let the number fall."},
 power:{ph:"wattage / bar / deck — 5,500W, 20in bar, 42in deck",hint:"Generators track watts — figure roughly $80–100 per 1,000 running watts, used. Pro sizes bring more but sell slower here."},
 tools:{ph:"voltage / drive — 20V, 1/2in drive",hint:"Higher-voltage platforms and 1/2in drive carry more; a bare 12V tool is nearly worthless."},
 hunt:{ph:"magnification / length / draw — 3-9x40, 7ft, 70lb",hint:"Standard specs sell fastest; extreme specs shrink the buyer pool — consider setting speed to Slow."},
 elec:{ph:"size / year / storage — 65in, 2024, 256GB",hint:"Size and model year ARE the price on TVs and phones — two model years old is half of new."},
 jewel:{ph:"model / metal / size — Datejust 36, 14k, 7in",hint:"The reference or model number is most of the price on a watch. Metal and stone weight matter on jewelry."},
 music:{ph:"type / size — dreadnought, 4-string",hint:""},
 rolling:{ph:"year / title — 2019, clean title in hand",hint:"No title, no deal — at any price."}};
function specVerdictHTML(x){
  if(x.checked)return "";
  const s=x.spec;
  if(!s)return "";
  if(!s.notes.length){
    return (st.model+st.detail).trim()
      ? `<span style="color:var(--ink-3)">No price rules matched these specs — they're noted on the ticket, but the number is unchanged. If a spec should move money, adjust step 4 yourself.</span>`
      : "";
  }
  let h=s.notes.map(n=>`<span style="color:${/NO DEAL/.test(n)?"var(--bad)":"var(--accent)"};font-weight:600">&#9656;</span> ${n}`).join("<br>");
  if(s.absSuggest&&(st.overrides[st.itemId]??null)!==s.absSuggest)
    h+=` <button id="useSpec" class="ghostBtn" style="padding:4px 10px;font-size:11px;margin-left:6px">Use $${s.absSuggest} baseline</button>`;
  return h;
}
function valSubText(x){
  const bits=[];
  if(x.brandName&&x.brandMult!==1)bits.push(`${x.brandName} tier`);
  if(x.specMult!==1)bits.push(`specs ×${x.specMult.toFixed(2)}`);
  if(bits.length)return `${bits.join(" + ")} applied — standard baseline ${money(x.baseValue)}; condition from step 5 comes off next. Change edits the baseline`;
  return st.overrides[x.item.id]?"Your number":"Starting estimate — replace it with what you actually sell these for";
}
/* One step at a time, the way the phone works. Which one is live follows
   the same run the Next step panel reads: what it is, then what it resells
   for, then what shape it is in. A step that is not live folds to a line
   carrying its answer, and any line opens on a click. */
/* Three layouts. "pages" is the default: one job on the screen at a time,
   cycled with a bar across the top, because everything at once is thirteen
   cards and three and a half thousand pixels of them. */
/* The three-column desk layout has been in the stylesheet the whole time.
   The paging default hid it: .paged carries display:block!important, so a
   1440px window ran the phone's one-job-at-a-time wizard stretched across
   the whole monitor - one tall column, the numbers scrolled off the top,
   and a thousand pixels of slack down the side of every card.

   So the default now follows the screen instead of assuming a phone. A desk
   gets its columns; anything narrow keeps the pages, which is what they
   were written for. An explicit choice in Setup still beats both. */
function deskWide(){
  try{ return !window.PHONE && window.matchMedia("(min-width:1080px)").matches; }
  catch(e){ return false; }
}
/* The desk lays an item out as a questionnaire down the left and a live
   numbers rail down the right: you answer, the money moves beside you, and
   nothing you are working on is ever off the screen. Three columns of cards
   was the old shape, and it meant the answer to a question you were reading
   lived in a different column from the question. */
function deskRail(){ return deskWide() && st.mode==="item" && st.picked; }
/* ---- one question on the screen -----------------------------------------
 * Asked for repeatedly and never actually built. "One page at a time" was
 * four PAGES, and the first of them still carried six questions in one
 * scrolling card: brand, tier, platform, kit, model, specs. That is a form,
 * not a questionnaire.
 *
 * This is the questionnaire. One question, big answers, and answering it
 * moves to the next by itself. The specifics - how many batteries, whether
 * the accessories are there - are questions in the run rather than fields
 * buried under it, because they are what move the money.
 *
 * The queue is built from the item, so an item with no brand tier and no
 * spec pickers asks two questions and an Xbox asks five. Nothing is padded
 * to a fixed shape.
 */
function askQueue(x){
  const q=[], cat=x.cat, ov=itemOv();
  if(cat.brand.on){
    const tiers=(ov&&ov.tiers)||cat.brand;
    /* If the name carries a make, that IS the answer - show it answered
       rather than lighting a tier nobody chose. */
    const named=x.namedBrand?{name:x.namedBrand,tier:x.brandTier}:null;
    /* Nothing lit until something actually says so. A default that lights
       "Ryobi / Ridgid" reads as an answer somebody gave, and the counter
       walks past it. The price still uses mid as its neutral - it has to
       use something - but the screen does not claim that was a choice. */
    const known=!!st.brandTyped||!!named||!!st.brandSet;
    const sel=known?x.brandTier:null;
    q.push({id:"brand", title:"What make is it?",
      named:named&&named.name,
      opts:BRANDS.map(br=>({t:tiers[br.id], on:sel===br.id, set:"brand", v:br.id})),
      hint:known?"":"Nothing picked yet \u2014 the price is using the standard tier until you say.",
      answered:known});
  }
  const sc=SPEC_CHOICES[st.itemId]||[];
  sc.forEach((g,gi)=>{
    const key=st.itemId+":"+gi, sel=st.specSel[key]??specBase(g);
    q.push({id:"spec:"+gi, title:g.label+"?",
      hint:g.options.map(o=>o.note).filter(Boolean)[0]||"",
      opts:g.options.map((o,oi)=>({t:o.t, sub:o.note||"", on:sel===oi, set:"spec", v:gi+":"+oi})),
      answered:st.specSel[key]!=null});
  });
  if(cat.complete.on){
    const what=cat.complete.label||"the bits that come with it";
    q.push({id:"complete", title:"Is it all there?",
      hint:what+". Missing pieces come off the price.",
      opts:[{t:"All there", on:st.complete===true, set:"comp", v:"1"},
            {t:"Something missing", sub:"worth "+Math.round((Number(cat.complete.mult)||0.7)*100)+"% of a complete one",
             on:st.complete===false, set:"comp", v:"0"}],
      answered:true});
  }
  q.push({id:"worth", title:"What does one sell for used?",
    hint:"", kind:"worth", answered:!!x.checked});
  q.push({id:"cond", title:"What shape is it in?",
    hint:"Next to a typical used one.",
    opts:CONDITIONS.map(c=>{const w=COND_WORDS[c.id]||[c.label,""];
      return {t:w[0], sub:w[1]||"", on:st.cond===c.id, set:"cond", v:c.id};}),
    answered:!!st.condSet});
  return q;
}
function askHTML(x){
  const q=askQueue(x);
  const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
  const cur=q[at];
  const opt=(o)=>`<button class="askOpt${o.on?" on":""}" data-ask="${esc(o.set)}" data-askv="${esc(o.v)}">`
    +`<span class="askT">${esc(o.t)}</span>${o.sub?`<span class="askS">${esc(o.sub)}</span>`:""}</button>`;
  const body=cur.kind==="worth"
    ? `<div class="askWorth">${step4Inner(x,true)}</div>`
    : `<div class="askOpts">${(cur.opts||[]).map(opt).join("")}</div>`;
  return `<div class="card askCard" id="askCard">
    <div class="askWhere">${at+1} of ${q.length}${q.every(z=>z.answered)?" \u00b7 all answered":""}</div>
    <div class="askQ">${esc(cur.title)}</div>
    ${cur.named?`<div class="cardHint" style="margin-top:0"><b style="color:var(--accent)">${esc(cur.named)}</b> &mdash; read off the name. Tap another if it is wrong.</div>`
      :cur.hint?`<div class="cardHint" style="margin-top:0">${esc(cur.hint)}</div>`:""}
    ${body}
    <div class="askNav">
      <button class="ghostBtn" data-askmove="-1"${at<=0?" disabled":""}>&larr; Back</button>
      <div class="askDots">${q.map((z,i)=>`<i class="${i===at?"on":""}${z.answered?" done":""}" title="${esc(z.title)}" data-askgo="${i}"></i>`).join("")}</div>
      <button class="${at>=q.length-1?"ghostBtn":"brassBtn"}" data-askmove="1"${at>=q.length-1?" disabled":""}>${cur.answered?"Next":"Skip"} &rarr;</button>
    </div>
  </div>`;
}
function stepFlow(){
  if(st.flow==="ask")return "ask";
  if(st.flow==="all")return "all";
  if(st.flow==="steps")return "steps";
  if(st.flow==="pages")return "pages";
  /* A questionnaire is ONE question on the screen with a way forward, back
     and past it. "Pages" was four pages and the first of them still carried
     six questions in a scrolling card - a form wearing a pager. The default
     is the real thing now; the other three are still there for anyone who
     wants the whole item at once. */
  return "ask";
}

/* Which page each card belongs to. Every card carries a stable id, so this
   is a lookup rather than a guess at its wording. */
const ITEM_PAGES=[
  ["what",  "What it is",  ["browseBox","photoCard","s3"]],
  ["check", "Checks",      ["fakeCard"]],
  ["worth", "Worth",       ["compsCard","s4","seenCard"]],
  ["cond",  "Condition",   ["s5"]],
  ["offer", "Your offer",  ["ticket","rateFold","paybackFold","logCard"]]
];
function pagesOn(){ return stepFlow()==="pages"&&st.mode==="item"&&st.picked; }
/* A page with nothing on it is not offered - the fakes card is only there for
   the sheets that gate, and the deal log only once there is a service. */
function livePages(v){
  return ITEM_PAGES.filter(([id,,ids])=>ids.some(i=>v.querySelector("#"+i)));
}
function applyPages(){
  const v=document.getElementById("view"); if(!v)return;
  v.classList.toggle("paged",pagesOn());
  v.classList.toggle("railed",deskRail());
  const old=v.querySelector("#pageNav"); if(old)old.remove();
  if(!pagesOn())return;
  const pages=livePages(v); if(!pages.length)return;
  if(!pages.some(p=>p[0]===st.page))st.page=pages[0][0];
  const at=pages.findIndex(p=>p[0]===st.page);
  /* Hide, never remove: the inputs keep their values and their handlers, and
     a card that is off-screen is still wired when you page back to it. */
  ITEM_PAGES.forEach(([id,,ids])=>ids.forEach(i=>{
    const el=v.querySelector("#"+i); if(el)el.classList.toggle("pgOff",id!==st.page);
  }));
  const nav=document.createElement("div");
  nav.id="pageNav"; nav.className="pageNav";
  /* "1 of 4" next to a panel saying ALL ANSWERED - NOTHING LEFT TO SET read
     as a contradiction, and fairly: one is where you are LOOKING and the
     other is what is DONE, and nothing on screen said which was which.
     A tick on the pages that are answered settles it - the strip now shows
     the same thing the panel does, and the counter is plainly just standing
     on page one of a finished item. */
  const x=calcItem();
  const done={ what:!!st.picked, check:true, worth:!!x.checked,
               cond:!!st.condSet, offer:!!(x.checked&&st.condSet) };
  const allDone=pages.every(([id])=>done[id]!==false);
  nav.innerHTML=`<div class="pageTabs">${pages.map(([id,label],i)=>
      `<button class="${id===st.page?"on":""}${done[id]?" done":""}" data-page="${id}">`
      +`<i>${done[id]?"\u2713":i+1}</i>${esc(label)}</button>`).join("")}</div>
    <div class="pageStep">
      <button class="ghostBtn" data-pgmove="-1"${at<=0?" disabled":""}>&larr; Back</button>
      <span class="pageWhere">${allDone?"all answered \u00b7 ":""}page ${at+1} of ${pages.length}</span>
      ${at<pages.length-1&&!done[st.page]?`<button class="ghostBtn pageSkip" data-pgmove="1" title="Leave this one unanswered and carry on. You can come back to it from the row above.">Skip</button>`:""}
      <button class="brassBtn" data-pgmove="1"${at>=pages.length-1?" disabled":""}>Next &rarr;</button>
    </div>`;
  /* In the rail layout the nav steers the left column, so it lives at the
     top of it. Anywhere else and the controls for the questions are not
     beside the questions. */
  const q=v.querySelector(".colQ");
  if(q){ q.insertBefore(nav,q.firstChild); return; }
  const pin=v.querySelector("#pin");
  if(pin&&pin.nextSibling)v.insertBefore(nav,pin.nextSibling); else v.appendChild(nav);
}
function goPage(id){ st.page=id; render(); const v=document.getElementById("view");
  const n=v&&v.querySelector("#pageNav"); if(n)n.scrollIntoView({block:"start",behavior:"instant"}); }
function liveStep(x){
  /* Without a resale value nothing downstream means anything, so that is the
     step. After it, condition - and it stays the live one, because it is what
     gets adjusted while the customer is standing there, and slamming it shut
     the instant it is answered would be worse than leaving it open. */
  return x.checked?5:4;
}
function stepHead(n,title,answer,live){
  return `<summary class="stepSum${live?" live":""}"><span class="stepN">${n}</span>`
    +`<span class="stepT">${title}</span><span class="stepA">${answer||"&mdash;"}</span></summary>`;
}
function brandAnswer(x){
  const bits=[st.brandTyped||(x.brandName||""),st.model||"",st.detail||""].map(t=>String(t).trim()).filter(Boolean);
  return bits.length?esc(bits.join(" \u00b7 ")):"not set";
}
function renderItem(){
  const x=calcItem(); const cat=x.cat;
  /* the pipeline: 1 category → 2 item → 3 your resale → 4 what changes it → 5 rate → 6 THE LOAN → 7 the rules */
  /* The search bar reaches every one of these and the price book besides, so
     the two columns of buttons are a second way to do what it already does -
     17 of them, taking the top of the screen before anything has been asked.
     They fold away. Open once and they stay open for the session: thumbing
     the lists is a habit, not a one-off. */
  const left=`<div class="colL"><details class="browse" id="browseBox"${st.browse?" open":""}>
    <summary><span class="label" style="margin:0">Browse the lists</span><span class="browseSub">${CATALOG.length} groups &middot; ${CATALOG.reduce((a,c)=>a+c.items.length,0)} items &middot; or just type above</span></summary>
    <div class="card" style="margin-top:10px">
      <span class="label">1 &middot; Category</span>
      ${CATALOG.map(c=>`<button class="catBtn${c.id===st.catId?" on":""}" data-cat="${c.id}">${c.label}</button>`).join("")}
    </div>
    <div class="card"><span class="label">2 &middot; Item</span>
      <div class="cardHint" style="margin-top:0;font-size:13.5px">Not here? Type it in the search bar at the top. It also searches ${PRICEBOOK.length}+ more items.</div>
      ${cat.items.map((it,ix)=>`<button class="itemBtn${st.picked&&it.id===st.itemId?" on":""}" data-item="${it.id}"><span class="idx">${String(ix+1).padStart(2,"0")}</span><span style="flex:1">${it.name}</span>${ownAvgTag(it.id)}</button>`).join("")}
      <button class="itemBtn${st.picked&&st.itemId===custId(cat.id)?" on":""}" data-item="${custId(cat.id)}"><span class="idx">+</span><span style="flex:1">${st.itemId===custId(cat.id)&&st.bookName?esc(st.bookName):"Not on any list — I set the price"}</span></button>
    /* On the phone this column is hidden and the camera card is drawn in the
       visible run instead - drawing it here too would put two of every id on
       the page, and the handlers would wire to the invisible copy. */
    /* In the rail layout these two are reference, not questions - the camera
       switch and the shelf-tag record - so they go to the foot of the
       questionnaire rather than above the first thing being asked. */
    </div></details>${deskRail()?"":(window.PHONE?"":photoCardHTML())+seenCardHTML()}</div>`;
  /* The market check is a tool, not a question - it interrupted the run
     between the browse bar and step 3 with 292px of buttons. It goes with
     the other reference cards at the foot, where it is still a click away
     when step 4 wants a real sold price. */
  const leftRef=deskRail()?`<div class="colL">${compsCardHTML(x)}${photoCardHTML()}${seenCardHTML()}</div>`:"";
  const ST=stepFlow()==="steps"&&!window.PHONE, LIVE=ST?liveStep(x):0;
  /* A step opened by hand stays open through the re-render a click inside it
     causes - otherwise it shuts under the hand that opened it. It is let go
     when the work moves to a different step. */
  if(ST&&st.stepAt!==LIVE){ st.openS3=st.openS4=st.openS5=false; st.stepAt=LIVE; }
  let mid=`<div class="colC">${fakeCardHTML(x)}${deskRail()?"":compsCardHTML(x)}${ST?`<details class="card stepCard" id="s3"${st.openS3?" open":""}>`+stepHead(3,"Brand, make &amp; model",brandAnswer(x),false):`<div class="card" id="s3"><span class="label">3 &middot; Brand, make &amp; model</span>`}
    ${/* Four lines of coaching, every item, for ever. True and worth
          reading - once. Folded, so it is one line until somebody wants it. */""}
    <details class="fold driverFold"${st.openDriver?" open":""} id="driverFold"><summary class="foldLine">What sets the price on one of these</summary>
    <div class="driver"><p><b class="go">What sets the price:</b> ${(itemOv()&&itemOv().driver)||cat.driver}</p><p><b class="no">What kills it:</b> ${(itemOv()&&itemOv().killer)||cat.killer}</p></div></details>`;
  if(cat.brand.on){
    const ov=itemOv();
    const book=(ov&&ov.brands)||BRANDBOOK[cat.id];
    const tiers=(ov&&ov.tiers)||cat.brand;
    mid+=`<span class="label">Brand — type it, I'll place it</span>
    <input id="brandIn" type="text" autocomplete="off" list="dlBrands" placeholder="${book?book.hi[0]+", "+book.lo[0]+"…":"brand…"}" value="${esc(st.brandTyped)}" class="numIn" style="font-family:var(--sans);font-size:15px">
    ${book?`<datalist id="dlBrands">${["hi","mid","lo"].flatMap(t=>book[t]).sort().map(b=>`<option value="${b}">`).join("")}</datalist>`:""}
    <div class="cardHint" id="brandVerdict" style="min-height:16px">${brandVerdictHTML()}</div>
    ${/* Typing "DeWalt" and being told "DeWalt - top tier here" already
          answers the tier. Showing three buttons underneath asks the same
          question a second time, and the counter has to read all three to
          notice the right one is already lit. Only when the book does NOT
          know the brand is there a question left to ask. */""}
    ${brandLookup(st.catId,st.brandTyped)
      ? `<details class="fold"${st.openTier?" open":""} id="tierFold"><summary class="foldLine">Placed as ${esc(tiers[st.brand])} &mdash; change it</summary>
         <div class="pills mb14" style="border-radius:var(--r-s);margin-top:8px">${BRANDS.map(br=>`<button class="${st.brand===br.id?"on":""}" style="flex:1;font-size:11px;padding:7px 6px" data-brand="${br.id}">${tiers[br.id]}</button>`).join("")}</div></details>`
      : `<div class="pills mb14" style="border-radius:var(--r-s);margin-top:8px">${BRANDS.map(br=>`<button class="${st.brand===br.id?"on":""}" style="flex:1;font-size:11px;padding:7px 6px" data-brand="${br.id}">${tiers[br.id]}</button>`).join("")}</div>`}`;
  }
  const _ov=itemOv();
  const dh=(_ov&&_ov.detail)||DETAIL_HINTS[cat.id]||{ph:"",hint:""};
  const _sc=SPEC_CHOICES[st.itemId];
  if(_sc)_sc.forEach((g,gi)=>{
    const sel=st.specSel[st.itemId+":"+gi]??specBase(g);
    mid+=`<span class="label">${g.label}</span><div class="pills mb14" style="border-radius:var(--r-s)">${g.options.map((o,oi)=>`<button class="${sel===oi?"on":""}" style="flex:1;padding:7px 5px;font-size:11px" data-spec="${gi}:${oi}">${o.t}</button>`).join("")}</div>`;
  });
  /* Both optional, and when the pickers above set the price these are notes
     for the ticket rather than questions. Folded unless something has been
     typed in them, so a page that was six questions is four. */
  const notes=!!(st.model||st.detail);
  mid+=`<details class="fold"${notes||st.openNotes?" open":""} id="notesFold"><summary class="foldLine">Model and specs${notes?` &mdash; ${esc([st.model,st.detail].filter(Boolean).join(" \u00b7 ").slice(0,44))}`:" (optional)"}</summary>
    <span class="label">Model (optional)</span>
    <input id="modelIn" type="text" autocomplete="off" placeholder="870 Wingmaster, MS 271, 10/22…" value="${esc(st.model)}" class="numIn" style="font-family:var(--sans);font-size:15px">
    <span class="label" style="margin-top:12px">Details — ${_ov?"specs for this item":cat.id==="guns"?"caliber & barrel":cat.id==="power"?"size & wattage":cat.id==="elec"?"size & year":"specs"} (optional)</span>
    <input id="detailIn" type="text" autocomplete="off" placeholder="${dh.ph}" value="${esc(st.detail)}" class="numIn" style="font-family:var(--sans);font-size:15px">
    <div class="cardHint" id="specVerdict">${specVerdictHTML(x)}</div>
    ${_sc&&!x.checked?`<div class="cardHint" style="opacity:.8">This item prices from the pickers above — the text boxes are for the ticket record${/gener/i.test(x.item.name)?" (watts typed here still compute a value)":""}.</div>`:""}
    <div class="cardHint">${dh.hint?dh.hint+" ":""}The exact model and specs can move money more than anything else on this page — when they matter, check sold listings and put the real number in step 4.</div>
    </details>
  ${ST?"</details>":"</div>"}
  ${ST?`<details class="card stepCard" id="s4"${LIVE===4||st.openS4?" open":""}>`+stepHead(4,"Resale value",x.checked?money(Math.round(x.resale)):"not checked",LIVE===4)+`<div id="step4">${step4Inner(x)}</div>`
      :`<div class="card" id="s4"><div id="step4">${step4Inner(x)}</div>`}`;
  mid+=`${ST?"</details>":"</div>"}${ST?`<details class="card stepCard" id="s5"${LIVE===5||st.openS5?" open":""}>`+stepHead(5,"Condition &amp; speed",esc(COND_WORDS[st.cond][0]),LIVE===5)
      :`<div class="card" id="s5"><span class="label">5 &middot; Condition, completeness &amp; speed</span>`}`;
  /* Say it here too, where the buttons are. Without a word the counter
     presses Rough, watches the price not move, and reasonably concludes the
     thing is broken. */
  mid+=`<span class="label">Condition${x.handSet?" &mdash; already in your figure":(x.checked?" &mdash; next to a typical used one":"")}</span>`
    +(x.handSet?`<div class="tagNote">You typed the resale value yourself, so this doesn't move the price &mdash; your number is taken as this one sits, wear and all. Clear it in <b>Resale value</b> to price off the list again and have condition adjust it.</div>`:"")
    +`<div class="pills mb14" style="border-radius:var(--r-s)">${CONDITIONS.map(c=>`<button class="${c.id===st.cond?"on":""}" style="flex:1;padding:7px 5px;font-size:11px${x.handSet?";opacity:.55":""}" data-cond="${c.id}" title="${x.handSet?"Does not change the price while the resale value is your own figure":c.hint}">${c.label.replace("New in box","New")}</button>`).join("")}</div>`;
  if(cat.complete.on){
    mid+=`<span class="label">${cat.complete.label}</span><div class="pills mb14" style="border-radius:var(--r-s)">
      <button class="${st.complete?"on":""}" style="flex:1" data-comp="1">All there</button>
      <button class="${!st.complete?"on":""}" style="flex:1" data-comp="0">Pieces missing</button></div>`;
  }
  mid+=`<span class="label">How fast it moves in Bristol</span><div class="pills" style="border-radius:var(--r-s)">${LIQUIDITY.map(l=>`<button class="${x.liqId===l.id?"on":""}" style="flex:1;padding:7px 5px;font-size:11px" data-liq="${l.id}" title="${l.hint}">${l.label}</button>`).join("")}</div>
  ${ST?"</details>":"</div>"}
  <details class="card foldCard"${st.openRates?" open":""} id="rateFold">
    <summary><span class="label" style="margin:0">6 &middot; Lending and buying rates</span><span class="foldSub">${x.baseLtv}% lend &middot; ${x.buyPct}% buy &mdash; shop policy, rarely per deal</span></summary>
    <div class="rateRow" style="margin-top:10px"><span class="label">Base lending rate for ${cat.label.toLowerCase()} (%)</span><input id="ltvNum" class="numIn rateNum" type="number" inputmode="numeric" min="15" max="100" value="${x.baseLtv}"></div>
    <input type="range" min="15" max="100" value="${x.baseLtv}" id="ltvSlider">
    <div class="sliderScale"><span>15% — tight</span><span>100% — your whole cushion, gone</span></div>
    <div id="ltvSuggest">${ltvSuggestHTML(cat,x.baseLtv)}</div>${buyRateHTML(x)}</details></div>`;
  const right=`<div class="colR"><div id="ticket">${ticketHTML(x)}</div>${logCardHTML(x)}</div>`;
  /* The pin sat at the top of the right column, and that column starts below
     the Next step panel - so the number the counter is working toward was
     off-screen until they scrolled to it, which is what it existed to avoid.
     It goes in the top row instead, in the empty half of that panel. */
  /* Nothing has been chosen yet, so there is no price, no loan and nothing
     to check it against - and drawing the whole machinery empty is what was
     filling the first screen with blank boxes. Until step 1 is answered the
     page is the search box and the two other ways in. */
  /* This was a full card restating the search placeholder in 132px of prose,
     above three columns stretched to the tallest one - so a 58-character
     summary bar sat in a 468px box. The cards stand at their own height now,
     across the full desk width.

     The headline went too: "What's on the counter?" is the placeholder text
     in the box directly above it, word for word, and repeating it put two
     lines of small print nose to nose under the search bar. What is left is
     the one thing the box does not already say - how much it knows. */
  if(!st.picked&&!window.PHONE)return omniHTML()+`<div class="startPane">
    <p class="startLede">It knows <b>${CATALOG.reduce((a,c)=>a+c.items.length,0)}</b> kinds of thing and <b>${mpCount()}</b> models by name. Anything else, type it in anyway and set the price yourself.</p>
    <div class="startTwo">${left.replace('<div class="colL">','<div class="startCol">')}</div>
  </div>`;
  /* The phone hides the three columns outright, and the camera card lived in
     one of them - so the phone has had a photo reader built, wired and
     working that nobody could see. It goes in the visible run instead.

     Before anything is picked it sits directly under the search box, because
     that is the whole point at a yard sale: you photograph the thing BECAUSE
     you do not know what it is. Once something is picked it drops below the
     price, so it never pushes the answer off the screen again. */
  if(window.PHONE){
    const cam=photoCardHTML();
    /* On a phone with nothing on the go, the camera IS the first move. You
       see something on a table, you want to shoot it and let the desk work
       out what it is - being handed a search box first means typing, which
       is the one thing you cannot do when you do not know what the thing is.
       So: camera first, search underneath as the way in when you would
       rather type. Once something is picked the price takes the top and the
       camera drops below it. */
    return st.picked
      ? omniHTML()+nextStepHTML(x)+`<div id="pin">${pinHTML(x)}</div>`+cam+left+mid+right
      : cam+omniHTML()+nextStepHTML(x)+`<div id="pin">${pinHTML(x)}</div>`+left+mid+right;
  }
  /* The rail holds the numbers panel and nothing else.
     The loan card was in it too, and it was the same figures again: a ring
     the size of a fist saying LEND HIM $32 directly under a panel already
     saying LEND HIM $32, with low/suggested/top under that repeating a range
     the panel's own note line carries. Two copies of one number, and the
     second one so tall it pushed the rest of the rail off the screen - the
     one thing a pinned column must never do. The loan card is still there in
     full, at the foot of the questionnaire, ring and all. */
  /* One question on the screen, the number beside it, and nothing else to
     scroll past. The reference cards and the ticket live at the foot for
     when somebody wants them, but the run itself is the card. */
  if(stepFlow()==="ask"&&st.picked)
    return omniHTML()
      +(deskWide()
        ? `<div class="rail"><div id="pin">${pinHTML(x)}</div>${weightHTML(x)}</div>`
          +`<div class="colQ">${askHTML(x)}<div id="ticket">${ticketHTML(x)}</div>${leftRef}${logCardHTML(x)}</div>`
        : `<div id="pin">${pinHTML(x)}</div>`+weightHTML(x)+askHTML(x)
          +`<div id="ticket">${ticketHTML(x)}</div>`+logCardHTML(x));
  if(deskRail())return omniHTML()+nextStepHTML(x)
    +`<div class="rail"><div id="pin">${pinHTML(x)}</div>${weightHTML(x)}</div>`
    +`<div class="colQ">${left}${mid}<div id="ticket">${ticketHTML(x)}</div>`
      +`${leftRef}${logCardHTML(x)}</div>`;
  /* The meter went out with the rail, and the rail needs 1080px - so on a
     phone, and on a tablet held upright, the one card that says how much
     evidence is behind the number simply did not exist. It was asked for
     precisely so a thin number could not pass as a solid one, and it was
     missing on the two devices that get carried to a yard sale. It goes
     under the pin here, where the pin is. */
  return omniHTML()+nextStepHTML(x)
    +`<div id="pin">${pinHTML(x)}</div>`+weightHTML(x)
    +left+mid+right;
}
function wireItem(){
  const v=document.getElementById("view");
  /* Opened once, it stays open for the session - thumbing the lists is a
     habit, not a one-off, and it must survive the re-render that picking a
     category causes. */
  const br=document.getElementById("browseBox");
  if(br)br.ontoggle=()=>{ st.browse=br.open; };
  /* Opened by hand, it stays open through the re-render a click inside it
     causes - otherwise it shuts under the hand that opened it. */
  for(const [id,key] of [["whyFold","openWhy"],["paybackFold","openPayback"],["rateFold","openRates"],
                         ["driverFold","openDriver"],["tierFold","openTier"],["notesFold","openNotes"],
                         ["s3","openS3"],["s4","openS4"],["s5","openS5"]]){
    const d=document.getElementById(id); if(d)d.ontoggle=()=>{ st[key]=d.open; };
  }
  v.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{
    /* Typing something the lists don't carry parks you on a custom item and
       asks what kind of thing it is - and these buttons are the answer on this
       page. Answering must not throw away what was typed. */
    /* A photo that was read but could not be placed is the same situation:
       the name is known, the kind of thing is not. Keep the name. */
    const un=(st.photoRead&&st.photoRead.unplaced&&st.photoRead.what)?st.photoRead.what:"";
    const typed=un||((st.mpNone&&isCustom()&&st.bookName)?st.bookName:"");
    st.catId=b.dataset.cat;st.market=null;st.omniDone="";st.mpPin=null;st.condSet=false;st.cond="good";
    if(typed){ st.itemId=custId(st.catId); st.bookName=typed; st.mpNone=true; }
    else { st.mpNone=false; const c=CATALOG.find(x=>x.id===st.catId); st.itemId=c.items[0].id; st.bookName=""; }
    st.needKind=false;
    if(un&&st.photoRead)st.photoRead=Object.assign({},st.photoRead,{unplaced:false});
    st.liq=null;st.brandTyped="";st.model="";st.detail="";st.complete=true;st.editing=false;
    const h=typed?brandInText(st.catId,typed):null; st.brand=h?h.tier:"mid";
    render();});
  v.querySelectorAll("[data-item]").forEach(b=>b.onclick=()=>{st.needKind=false;st.itemId=b.dataset.item;st.market=null;st.omniDone="";st.mpPin=null;st.mpNone=false;st.condSet=false;st.cond="good";st.bookName="";st.liq=null;st.brand="mid";st.brandTyped="";st.model="";st.detail="";st.complete=true;st.askAt=0;st.brandSet=false;
    /* picking "Something else" with no saved value drops you straight into the price box */
    st.editing=(st.itemId===custId(st.catId));
    render();if(st.editing)document.getElementById("valIn")?.focus();});
  v.querySelectorAll("[data-brand]").forEach(b=>b.onclick=()=>{st.brand=b.dataset.brand;st.brandTyped="";render();});
  const bIn=document.getElementById("brandIn");
  if(bIn)bIn.oninput=()=>{
    st.brandTyped=bIn.value;
    const hit=brandLookup(st.catId,st.brandTyped);
    if(hit)st.brand=hit.tier;
    document.getElementById("brandVerdict").innerHTML=brandVerdictHTML();
    v.querySelectorAll("[data-brand]").forEach(b=>b.classList.toggle("on",b.dataset.brand===st.brand));
    const xx=calcItem();
    const vn=document.getElementById("valNum");if(vn)vn.textContent=money(xx.baseValue*xx.brandMult);
    const vs=document.getElementById("valSub");if(vs)vs.textContent=valSubText(xx).replace(/<[^>]*>/g,"");
    document.getElementById("ticket").innerHTML=ticketHTML(xx); paintPin(xx);
    refreshStep4();
  };
  v.querySelectorAll("[data-cond]").forEach(b=>b.onclick=()=>{st.cond=b.dataset.cond;st.condSet=true;render();});
  v.querySelectorAll("[data-comp]").forEach(b=>b.onclick=()=>{st.complete=b.dataset.comp==="1";render();});
  /* Answering IS moving on. A questionnaire that makes you answer and then
     press Next has two actions where the counter's hand expects one. The
     last question does not advance - there is nowhere to go, and the price
     is already beside it. */
  v.querySelectorAll("[data-ask]").forEach(b=>b.onclick=()=>{
    const kind=b.dataset.ask, val=b.dataset.askv;
    if(kind==="brand"){ st.brand=val; st.brandTyped=""; st.brandSet=true; }
    else if(kind==="comp"){ st.complete=val==="1"; }
    else if(kind==="cond"){ st.cond=val; st.condSet=true; }
    else if(kind==="spec"){ const [gi,oi]=val.split(":"); st.specSel[st.itemId+":"+gi]=Number(oi); }
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    if(at<q.length-1)st.askAt=at+1;
    persist(); render();
  });
  v.querySelectorAll("[data-askmove]").forEach(b=>b.onclick=()=>{
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    st.askAt=Math.max(0,Math.min(q.length-1,at+Number(b.dataset.askmove)));
    render();
  });
  v.querySelectorAll("[data-askgo]").forEach(b=>b.onclick=()=>{ st.askAt=Number(b.dataset.askgo); render(); });
  v.querySelectorAll("[data-liq]").forEach(b=>b.onclick=()=>{st.liq=b.dataset.liq;render();});
  v.querySelectorAll("[data-spec]").forEach(b=>b.onclick=()=>{
    const [gi,oi]=b.dataset.spec.split(":").map(Number);
    st.specSel[st.itemId+":"+gi]=oi;render();});
  function specRefresh(){
    const xx=calcItem();
    const sv=document.getElementById("specVerdict");if(sv){sv.innerHTML=specVerdictHTML(xx);wireUseSpec();}
    const vn=document.getElementById("valNum");if(vn)vn.textContent=money(xx.baseValue*xx.brandMult*xx.specMult);
    const vs=document.getElementById("valSub");if(vs)vs.textContent=valSubText(xx).replace(/<[^>]*>/g,"");
    document.getElementById("ticket").innerHTML=ticketHTML(xx); paintPin(xx);
    refreshStep4();
  }
  function wireUseSpec(){
    const u=document.getElementById("useSpec");
    if(u)u.onclick=()=>{const s=calcItem().spec;if(!s||!s.absSuggest)return;
      st.overrides[st.itemId]=s.absSuggest;persist();render();};
  }
  const mIn=document.getElementById("modelIn");
  if(mIn)mIn.oninput=()=>{st.model=mIn.value;specRefresh();};
  const dIn=document.getElementById("detailIn");
  if(dIn)dIn.oninput=()=>{st.detail=dIn.value;specRefresh();};
  wireUseSpec();
  const lk=document.getElementById("lookupIn");
  if(lk){
    lk.oninput=()=>{
      const hits=searchBook(lk.value);
      document.getElementById("lookupHits").innerHTML=hits.map((e,i)=>
        `<button class="itemBtn" data-hit="${i}" style="margin-top:6px"><span style="flex:1">${e[0]}</span><span class="price" style="color:var(--accent-2)">${money(e[1])} &middot; ${CATLABEL[e[2]]}</span></button>`).join("");
      document.getElementById("view").querySelectorAll("[data-hit]").forEach(b=>b.onclick=()=>{
        const e=hits[Number(b.dataset.hit)];
        st.catId=e[2]; st.itemId=custId(e[2]); st.bookName=e[0]; st.overrides[custId(e[2])]=bookVal(e);
        st.liq=e[3]; st.brand="mid"; st.brandTyped=""; st.complete=true; st.editing=false;
        persist(); render();
      });
    };
  }
  wireStep4();
  const sl=document.getElementById("ltvSlider"), ln=document.getElementById("ltvNum");
  function ltvRefresh(){
    document.getElementById("ticket").innerHTML=ticketHTML(calcItem()); paintPin(calcItem());
    refreshStep4(); refreshBuyRate();
    const c=CATALOG.find(x=>x.id===st.catId);
    document.getElementById("ltvSuggest").innerHTML=ltvSuggestHTML(c,st.ltvs[st.catId]??c.ltv);
    wireUseLtv();
  }
  function wireUseLtv(){
    const u=document.getElementById("useLtv");
    if(u)u.onclick=()=>{const s=LTV_BOOK[st.catId];if(!s)return;
      st.ltvs[st.catId]=s.p;sl.value=s.p;if(ln)ln.value=s.p;paintSlider(sl);persist();ltvRefresh();};
  }
  if(sl){paintSlider(sl);
    sl.oninput=()=>{st.ltvs[st.catId]=Number(sl.value);if(ln)ln.value=sl.value;paintSlider(sl);ltvRefresh();};
    sl.onchange=()=>persist();}
  if(ln)ln.oninput=()=>{let n=parseInt(ln.value);if(isNaN(n))return;n=Math.max(15,Math.min(100,n));
    st.ltvs[st.catId]=n;sl.value=n;paintSlider(sl);ltvRefresh();};
  if(ln)ln.onblur=()=>{ln.value=st.ltvs[st.catId]??calcItem().baseLtv;persist();};
  wireUseLtv();
  wirePhoto();
  wireComps();
  wireBookSearch();
  wireLogButton();
  wireOmni();
  wireShots();
}

/* ---------------- gold tab ---------------- */
/* Suggested pay% — the peak/valley buy rule:
   gold base 70, silver base 62 (thinner refiner spreads, wilder swings).
   Trim as spot runs above its own 90-day average; a valley keeps the normal
   rate — the discipline there is shipping on day 31, not paying up. */
function suggestPay(){
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  if(!avg||avg<=0)return null;
  const prem=(spot-avg)/avg;
  const base=st.metal==="gold"?70:62;
  let cut=0, why;
  const p=Math.round(prem*100);
  if(prem>0.15){cut=st.metal==="gold"?10:12; why=`spot is ${p}% over the 90-day average — that is a hard spike, and spikes like this usually snap back; the discount is your insurance for the 30-day hold`;}
  else if(prem>PEAK_OVER){cut=st.metal==="gold"?8:10; why=`spot is ${p}% over the 90-day average — peak conditions; sellers are walking in anyway, you don't have to pay up to win deals`;}
  else if(prem>0.05){cut=4; why=`spot is ${p}% over the 90-day average — running warm, trim a little`;}
  else if(prem<-0.05){cut=0; why=`spot is ${Math.abs(p)}% UNDER the average — hold the normal rate and ship on day 31 like always; "it's cheap" is not a reason to buy heavy`;}
  else {cut=0; why=`spot is close to its 90-day average — nothing unusual happening, so use the normal rate`;}
  /* Trend read: a steady weekly slide raises the odds of more slide during the
     30-day hold — a fast drop trims ON TOP of the level rule. Rising weeks
     add nothing; the level tiers already handle a run-up. */
  const wk=FEED[st.metal+"7"];
  if(wk&&wk>0){
    const tr=(spotOf(st.metal)-wk)/wk, t=Math.round(Math.abs(tr)*100);
    if(tr<-0.06){cut+=8; why+=`. And it has dropped ${t}% in a week — it is dropping fast and has not stopped; every day of your 30-day hold is exposed to more of that`;}
    else if(tr<-0.03){cut+=5; why+=`. And it's down ${t}% on the week — sliding; trim extra for the hold window`;}
    else if(tr<-0.015){cut+=2; why+=`. Down ${t}% on the week — drifting lower, take a small extra point`;}
  }
  return {pay:Math.max(50,base-cut), why};
}
/* The rate DEFAULTS to today's suggestion and keeps tracking it as spot, the
   average or the metal changes — until the counter moves the slider, which
   then wins for the rest of the day. */
function suggestRate(){
  const s=suggestPay(); if(!s)return null;
  if(!PAWN()) return s;
  /* A loan runs about 30% under a buy: you carry the price for 60 days before
     the metal is even yours. Same market reasoning, lower landing point. */
  return {pay:Math.max(25,Math.round(s.pay*0.7)),
          why:s.why+". A loan lands about 30% under the buy rate, because you carry the price for 60 days"};
}
function syncPay(){
  if(curTouched()) return;
  const s=suggestRate();
  if(s) setRate(s.pay);
}
function suggestHTML(){
  const s=suggestRate();
  if(!s)return "";
  const match=curRate()===s.pay;
  return `<div class="cardHint" style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
    <span style="color:var(--accent);font-family:var(--mono);font-weight:600">Suggested today: ${s.pay}%</span> — ${s.why}.
    ${match?`<span style="color:var(--ink-2)"> ${curTouched()?"You're on it.":"Filled in for you \u2014 drag the slider to set your own for today."}</span>`
      :`<button id="useSuggest" class="ghostBtn" style="padding:5px 12px;font-size:11.5px;margin-left:8px">Use ${s.pay}%</button>`}
  </div>`;
}
/* The slider is a share of melt, but a loan also takes the peak guard and the
   30% loan cut on top — so the loan lands well below the slider number. This
   is that true share, for honest labelling. */
/* What a refiner actually returns on scrap, as a share of melt. Widely
   quoted at 90-95%; no refiner is lined up yet, so the card shows the band. */
const REFINER_LO=0.90, REFINER_HI=0.95;
/* When spot is this far above its 90-day average, the loan is sized off the
   average instead. It was written out at each of the three places that ask
   the question, which is how two of them end up disagreeing later. */
const PEAK_OVER=0.08;
/* What a jeweller sells a piece for against what they paid, from Folmar's in
   Tallahassee and matching the trade's triple-keystone convention. The card
   used to multiply by 3 and 4 and then say "three to four" in words beside
   it, so changing one would have left the other lying. */
const JEWELRY_LO=3, JEWELRY_HI=4;
const PAWN=()=>st.deal==="pawn";
function curRate(){ return PAWN()?st.loanPct:st.payPct; }
function setRate(n){ if(PAWN())st.loanPct=n; else st.payPct=n; }
function curTouched(){ return PAWN()?st.loanTouched:st.payTouched; }
function setTouched(v){ if(PAWN())st.loanTouched=v; else st.payTouched=v; }
function rateBounds(){ return PAWN()?{min:25,max:75}:{min:50,max:100}; }
function loanPctOfMelt(){
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  if(!spot||spot<=0)return null;
  const guardOz=Math.min(spot,avg||spot);
  const prem=avg>0?(spot-avg)/avg:0;
  return Math.round((guardOz/spot)*(st.loanPct/100)*(prem>PEAK_OVER?0.9:1)*100);
}
function calcMetal(){
  const g=parseFloat(st.grams); if(!g||g<=0)return null;
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  const purity=st.metal==="gold"?PURITY.find(p=>p.k===st.karat).p:0.925;
  const melt=(spot/31.1035)*purity*g;
  const guardOz=Math.min(spot,avg||spot);
  const meltGuard=(guardOz/31.1035)*purity*g;
  const premium=avg>0?(spot-avg)/avg:0;
  const peakTrim=premium>PEAK_OVER?0.9:1;
  return {melt,buy:melt*(st.payPct/100),loan:meltGuard*(st.loanPct/100)*peakTrim,
          premium,guarded:guardOz<spot,trimmed:peakTrim<1};
}
function feedTagHTML(){
  const days=Math.round((Date.now()-new Date(FEED.date+"T12:00:00").getTime())/86400000);
  const stale=days>3;
  if(st.manual) return `<div class="feedTag">Your hand-entered number for today — the morning update takes back over tomorrow.</div>`;
  return `<div class="feedTag${stale?" stale":""}">${stale
    ? `Last updated ${days} days ago (${FEED.date}) — check Kitco and type today's number in.`
    : `<b>Auto-filled ${FEED.date}</b> from ${FEED.source} — updated every morning. Type over it any time; your number wins for the day.`}</div>`;
}
/* The centre column used to sit empty. Two things belong there: the arithmetic
   behind the number (so it can be walked through with a doubtful customer) and,
   on a loan, what he actually owes to get it back. */
function meltMathHTML(m){
  if(!m)return "";
  const spot=spotOf(st.metal), avg=avgOf(st.metal), g=parseFloat(st.grams);
  const purity=st.metal==="gold"?PURITY.find(x=>x.k===st.karat).p:0.925;
  const basis=PAWN()?Math.min(spot,avg||spot):spot;
  const perG=basis/31.1035, perGk=perG*purity, gross=perGk*g;
  const rate=curRate(), out=PAWN()?m.loan:m.buy;
  const row=(k,v)=>`<div class="valRow" style="padding:6px 0"><span style="font-size:13px;color:var(--ink-2)">${k}</span><span class="num" style="font-size:15px">${v}</span></div>`;
  return `<div class="card"><span class="label">How the number is built</span>
    ${row("Spot today, per troy ounce","$"+spot.toLocaleString("en-US"))}
    ${PAWN()&&basis<spot?row("Loans price off the 90-day average","$"+basis.toLocaleString("en-US")):""}
    ${row("Per gram of pure","$"+perG.toFixed(2))}
    ${row((st.metal==="gold"?st.karat:".925")+" is "+(purity*100).toFixed(1)+"% metal","$"+perGk.toFixed(2)+" / g")}
    ${row("\u00d7 "+esc(st.grams)+" grams",money(gross))}
    ${row("\u00d7 "+rate+"% "+(PAWN()?"lending rate":"buy rate"),`<b style="color:var(--accent)">${money(out)}</b>`)}
    <div class="cardHint">Walk a doubtful customer down this list. Every line is a number he can check himself.</div>
  </div>`;
}
function metalLadderHTML(m){
  if(!m||!PAWN())return "";
  const charge=Math.max(5,m.loan*0.25);
  return `<div class="card"><span class="label">What he pays back</span>
    <div class="ladder">${ladder(m.loan,charge).map(r=>`<div class="widget rung"><div class="k">${r.k}</div><div class="d">${money(r.due)}</div></div>`).join("")}</div>
    <div style="font-size:13.5px;line-height:1.5;color:var(--ink-2);margin-top:9px">
      It is <b style="color:var(--ink)">not</b> 25% again every month. The charge caps at <b style="color:var(--ink)">twice</b> the
      30-day amount from day 31 through day 60, then runs <b style="color:var(--ink)">$${(charge/30).toFixed(2)}/day</b>.
      Past day 60 the metal is already ours \u2014 late redemption is a courtesy you price with that rate.
    </div>
    <div class="fine">&sect; 539.001(11) caps the charge at 25% of the amount financed per 30 days, minimum $5.</div>
  </div>`;
}
function metalExtraInner(){
  const m=calcMetal();
  return meltMathHTML(m)+metalLadderHTML(m);
}
function metalResultHTML(){
  const m=calcMetal();
  if(!m)return `<div class="card" style="text-align:center;color:var(--ink-3);font-size:13px;padding:28px">Put it on the scale and enter the grams.</div>`;
  const pawn=st.deal==="pawn";
  const wt=esc(st.grams)+"g "+(st.metal==="gold"?st.karat:".925");
  const shown=pawn?m.loan:m.buy;
  const pctMelt=m.melt>0?Math.round(shown/m.melt*100):st.payPct;
  return `<div class="card">
    <span class="label">6 &middot; ${pawn?"The loan":"The offer"}</span>
    ${gauge(pctMelt/100,pawn?"Lend him":"Buy it for",money(shown),wt+" &middot; "+pctMelt+"% of melt","gm")}
    <div class="tiles">
      <div class="widget"><div class="l">${pawn?"Or buy it outright":"Or lend against it instead"}</div><div class="v">${money(pawn?m.buy:m.loan)}</div></div>
      <div class="widget"><div class="l">Full melt value (never pay this)</div><div class="v">${money(m.melt)}</div></div>
    </div>
    ${!pawn?`<div class="tagNote"><b style="color:var(--ink)">Once you own it.</b>
      <b style="color:var(--ink)">Sell it as jewelry:</b> about ${money(Math.round(shown)*JEWELRY_LO)} to ${money(Math.round(shown)*JEWELRY_HI)}.
      That is what Folmar's in Tallahassee gets &mdash; they sell for ${JEWELRY_LO} to ${JEWELRY_HI} times what they pay.
      ${(function(){
        /* Melt is what the metal is worth at the refinery gate, not what the
           refiner hands back. Read as 90-95% returned; no refiner is lined up
           yet, so it shows the band rather than pretending to one figure.
           Change these two when one is. */
        const meltR=Math.round(m.melt), offR=Math.round(shown);
        const lo=Math.round(meltR*REFINER_LO), hi=Math.round(meltR*REFINER_HI);
        const left=`<b style="color:var(--ink)">Scrap it:</b> about ${money(lo)} to ${money(hi)} &mdash; a refiner returns
          ${Math.round(REFINER_LO*100)}&ndash;${Math.round(REFINER_HI*100)}% of the ${money(meltR)} melt.`;
        /* Three cases, because a high buy rate can put the offer inside or above
           the refiner's range, and "leaves $-16 to $25" is not an answer. */
        if(hi<=offR) return left+` That is less than the ${money(offR)} you would pay, so there is nothing in scrapping at this rate.`;
        if(lo<offR)  return left+` Against the ${money(offR)} you would pay that is about a wash &mdash; anywhere from ${money(offR-lo)} short to ${money(hi-offR)} ahead. Scrapping is not the way out of this one.`;
        return left+` That leaves ${money(lo-offR)} to ${money(hi-offR)} over the ${money(offR)} you paid.`;
      })()}</div>`:""}
    ${pawn&&(m.guarded||m.trimmed)?`<div class="tagNote">${(m.premium>0.05||m.trimmed)
      ?`<b style="color:var(--ink)">Peak guard is on.</b> ${st.metal==="gold"?"Gold":"Silver"} is ${Math.round(m.premium*100)}% above its 90-day average, so the loan is sized off the average${m.trimmed?" and trimmed another 10%":""} \u2014 as if today's high never happened.`
      :`<b style="color:var(--ink)">The loan is sized off the 90-day average</b>, not today's spot.`}
      You may own this metal in 60 days. Sizing the loan low is what keeps it covering the ticket if the market falls first.</div>`:""}
    ${whyHTML("metal")}
  </div>
  <div class="card">
    <span class="label">7 &middot; After the money moves</span>
    <div class="tagWarn" style="margin-top:0"><b>This does not ship for 30 days.</b> Everything we buy or take in has to sit unaltered, here in Liberty County, for 30 calendar days before it can be sold or disposed of — &sect; 539.001(9)(c). Date-tag it and put it in the hold bin. "Melt" is how we price it, not something we may do to it inside that window.</div>
  </div>`;
}
function renderMetal(){
  syncPay();
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  /* the pipeline: 1 metal → 2 today's price → 3 the guard → 4 weight → 5 pay rate → 6 THE OFFER → 7 the rules */
  const left=`<div class="colL"><div class="card">
    <span class="label">1 &middot; Is he selling it, or pawning it?</span>
    <div class="pills mb14" style="border-radius:var(--r-s)">
      <button class="${st.deal==="buy"?"on":""}" style="flex:1" data-deal="buy">Buying it</button>
      <button class="${st.deal==="pawn"?"on":""}" style="flex:1" data-deal="pawn">Pawn loan</button>
    </div>
    <span class="label">Metal</span>
    <div class="pills mb14" style="border-radius:var(--r-s)">
      <button class="${st.metal==="gold"?"on":""}" style="flex:1" data-metal="gold">Gold</button>
      <button class="${st.metal==="silver"?"on":""}" style="flex:1" data-metal="silver">Silver .925</button>
    </div>
    ${st.metal==="gold"?`<span class="label">Karat — read the stamp</span>
      <div class="pills" style="border-radius:var(--r-s)">${PURITY.map(p=>`<button class="${st.karat===p.k?"on":""}" style="flex:1;padding:7px 4px" data-karat="${p.k}">${p.k}</button>`).join("")}</div>`:""}
  </div>
  <div class="card"><span class="label">2 &middot; Today's ${st.metal} price, per troy ounce</span>
    <input id="spotIn" type="number" inputmode="decimal" value="${spot}" class="numIn">
    ${feedTagHTML()}
  </div>
  <div class="card"><span class="label">3 &middot; 90-day average — the peak guard</span>
    <input id="avgIn" type="number" inputmode="decimal" value="${avg}" class="numIn">
    <div class="cardHint">Auto-filled by the morning feed. Buys price off today's spot (scrap ships fast — the spread is the profit). Loans are a 60-day bet, so they price off the LOWER of spot or this average — if today is a peak, the loan is sized as if the peak never happened.</div>
  </div></div>`;
  const rb=rateBounds();
  const mid=`<div class="colC">${fakeCardHTML(null)}<div class="card"><span class="label">4 &middot; Weight in grams</span>
    <input id="gramsIn" type="number" inputmode="decimal" placeholder="0.0" value="${esc(st.grams)}" class="numIn big">
    <div class="cardHint">Pull stones, clasps, and anything that isn't the metal. On a diamond ring, the setting is the money — resale on the stone is 20&ndash;30% of retail.</div>
  </div>
  <div class="card"><div class="rateRow"><span class="label">5 &middot; ${PAWN()?"What I lend against melt (%)":"What I pay against melt (%)"}</span><input id="payNum" class="numIn rateNum" type="number" inputmode="numeric" min="${rb.min}" max="${rb.max}" value="${curRate()}"></div>
    <input type="range" min="${rb.min}" max="${rb.max}" value="${curRate()}" id="paySlider">
    <div id="paySuggest">${suggestHTML()}</div>
    ${PAWN()?`<div class="cardHint" style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
      Your lending rate, kept separate from the buy rate. When ${st.metal} sits above its 90-day average the peak
      guard trims it, so the money out the door today is <b style="color:var(--accent)">${loanPctOfMelt()}% of melt</b>.
      </div>`:`<div class="cardHint" style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
      Your buy rate. The lending rate is set separately &mdash; switch to <b style="color:var(--ink)">Pawn loan</b> above to change it.</div>`}
  </div><div id="metalExtra">${metalExtraInner()}</div></div>`;
  const right=`<div class="colR"><div id="metalResult">${metalResultHTML()}</div></div>`;
  return left+mid+right;
}
function wireMetal(){
  const v=document.getElementById("view");
  v.querySelectorAll("[data-deal]").forEach(b=>b.onclick=()=>{st.deal=b.dataset.deal;render();});
  v.querySelectorAll("[data-metal]").forEach(b=>b.onclick=()=>{st.metal=b.dataset.metal;st.payTouched=false;st.loanTouched=false;render();});
  v.querySelectorAll("[data-karat]").forEach(b=>b.onclick=()=>{st.karat=b.dataset.karat;render();});
  const p=document.getElementById("paySlider"), pn=document.getElementById("payNum");
  function wireSuggest(){
    const b=document.getElementById("useSuggest");
    if(b)b.onclick=()=>{const s=suggestRate();if(!s)return;
      setTouched(false);setRate(s.pay);p.value=s.pay;if(pn)pn.value=s.pay;paintSlider(p);
      persist();upd();};
  }
  const upd=()=>{
    syncPay();
    if(p){p.value=curRate();paintSlider(p);}
    if(pn)pn.value=curRate();
    document.getElementById("metalResult").innerHTML=metalResultHTML();
    document.getElementById("paySuggest").innerHTML=suggestHTML();
    const ex=document.getElementById("metalExtra"); if(ex)ex.innerHTML=metalExtraInner();
    wireSuggest();
  };
  const sIn=document.getElementById("spotIn");
  sIn.oninput=()=>{makeManual();st.manual.spot[st.metal]=parseFloat(sIn.value)||0;upd();};
  sIn.onblur=()=>persist();
  const aIn=document.getElementById("avgIn");
  aIn.oninput=()=>{makeManual();st.manual.avg90[st.metal]=parseFloat(aIn.value)||0;upd();};
  aIn.onblur=()=>persist();
  const gIn=document.getElementById("gramsIn");
  gIn.oninput=()=>{st.grams=gIn.value;upd();};
  paintSlider(p);
  p.oninput=()=>{setTouched(true);setRate(Number(p.value));if(pn)pn.value=p.value;paintSlider(p);upd();};
  p.onchange=()=>persist();
  const rb=rateBounds();
  if(pn)pn.oninput=()=>{let n=parseInt(pn.value);if(isNaN(n))return;n=Math.max(rb.min,Math.min(rb.max,n));
    setTouched(true);setRate(n);p.value=n;paintSlider(p);upd();};
  if(pn)pn.onblur=()=>{pn.value=curRate();persist();};
  wireSuggest();
}

/* ---- building the price list from the tool, not from a terminal ----------
   The harvester has been a command the whole time, and the counter has said
   twice now that a command line is not where he works. It runs here instead,
   on the device that already has the service address and the token: it walks
   the target list, runs the same searches the green button runs, keeps every
   listing it finds the same way a lookup does - so the answers are live on
   this device immediately and reach the phone on the next sync - and hands
   back a prices.json when it is done, for the copy everyone downloads.

   Stoppable, resumable, and it says what it has spent while it spends it. */
const HARV_KEY="pawndesk_harvest";
let HARV=null, harvBusy=false, harvStop=false, harvSeed=null, harvNow="";
function harvAll(){
  if(HARV)return HARV;
  try{ HARV=JSON.parse(localStorage.getItem(HARV_KEY)||"{}")||{}; }catch(e){ HARV={}; }
  return HARV;
}
function harvSave(){ try{ localStorage.setItem(HARV_KEY,JSON.stringify(HARV||{})); }catch(e){} }
async function harvLoadSeed(){
  if(harvSeed)return harvSeed;
  const r=await fetch("tools/seed-models.json",{cache:"no-store"});
  if(!r.ok)throw new Error("the target list did not load");
  const j=await r.json();
  harvSeed=(j&&j.rows)||[];
  return harvSeed;
}
const harvKey=t=>t.ref+"|"+t.name;
function harvBookFor(ref){
  for(const c of CATALOG){ const it=c.items.find(i=>i.id===ref); if(it)return it.value; }
  return 0;
}
/* Same band the command-line one uses: a search that came back with parts or
   the wrong model lands far from what the catalog says the thing is worth. */
function harvWild(ref,med){
  const b=harvBookFor(ref); if(!b||!med)return null;
  const ratio=Math.round((med/b)*100)/100;
  return {book:b,ratio,wild:ratio>4||ratio<0.25};
}
/* A phone locks its screen after half a minute of nobody touching it, and a
   locked phone throttles the page to a stop mid-run. The run survives it -
   it is resumable, so pressing the button again carries on - but a counter
   watching a progress line stop for no reason has been given a fault, not a
   feature. Hold the screen awake while it works, and let it go after. */
let harvLock=null;
async function harvWake(on){
  try{
    if(on&&!harvLock&&navigator.wakeLock)harvLock=await navigator.wakeLock.request("screen");
    else if(!on&&harvLock){ await harvLock.release(); harvLock=null; }
  }catch(e){ harvLock=null; }
}
async function harvRun(ref,count){
  if(harvBusy||!CAP.sample)return;
  harvBusy=true; harvStop=false; st.harvErr=""; harvWake(true); render();
  let seed;
  try{ seed=await harvLoadSeed(); }
  catch(e){ harvBusy=false; st.harvErr="Could not load the target list."; render(); return; }
  const done=harvAll();
  let todo=seed.filter(t=>!done[harvKey(t)]);
  if(ref)todo=todo.filter(t=>t.ref===ref);
  if(count>0)todo=todo.slice(0,count);
  const pass1={where:"eBay",say:"completed, sold eBay listings - the price it actually went for, not what it was listed at"};
  const pass2={where:"Shopping",say:"used-condition listings currently for sale on Google Shopping and the marketplaces"};
  for(let i=0;i<todo.length;i++){
    if(harvStop)break;
    const t=todo[i];
    harvNow=`${i+1} of ${todo.length} — ${t.name}`;
    const el=document.getElementById("harvNow"); if(el)el.textContent=harvNow; else render();
    let comps=[];
    for(const p of [pass1,pass2]){
      if(harvStop)break;
      try{ const d=await CAP.sample.json(findPrompt(t.name,p),{search:true});
           comps=comps.concat(((d&&d.comps)||[]).filter(c=>c&&Number(c.price)>0)); }
      catch(e){}
      if(comps.length>=8)break;
    }
    const seen={};
    const uniq=comps.filter(c=>{ const k=Math.round(c.price)+"|"+String(c.where||"").toLowerCase();
      if(seen[k])return false; seen[k]=1; return true; });
    const ps=uniq.map(c=>Math.round(Number(c.price))).filter(n=>n>0).sort((a,b)=>a-b);
    const at=f=>ps[Math.min(ps.length-1,Math.max(0,Math.round(f*(ps.length-1))))];
    if(ps.length<3){
      done[harvKey(t)]={ts:Date.now(),ref:t.ref,name:t.name,n:ps.length,date:todayStr(),note:"nothing usable"};
    }else{
      const sold=uniq.filter(c=>c.basis==="sold").length, share=sold/ps.length;
      const w=harvWild(t.ref,at(0.5));
      done[harvKey(t)]={ts:Date.now(),ref:t.ref,name:t.name,alias:t.alias||"",n:ps.length,sold,
        lo:at(0.25),hi:at(0.75),med:at(0.5),
        conf:(ps.length>=6&&share>=0.6)?"h":(ps.length>=4?"m":"l"),
        date:todayStr(),wild:!!(w&&w.wild),ratio:w?w.ratio:null,book:w?w.book:null,
        note:`${ps.length} listings, ${sold} sold${share<0.5?" - mostly asks":""}`};
      /* These used to be filed as ordinary listings. A device keeps 3,000 of
         those and the shared store 5,000, and 610 models at eight or ten
         listings apiece is six thousand - so the back half of a full run
         quietly evicted the front half, and the counter's own lookups with
         it. The finding itself is the useful part: one row a model, priced
         off the listings, small enough that the whole list syncs. */
    }
    harvSave(); render();
  }
  harvBusy=false; harvNow=""; harvWake(false); render();
  try{ pdSync(); }catch(e){}
}
function todayStr(){ const d=new Date(), p=n=>String(n).padStart(2,"0");
  return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate()); }
/* The file the site serves, with everything harvested folded in. Downloaded
   rather than written, because a web page cannot commit to the repository -
   this is the one step that still needs a person. */
function harvFile(){
  const rows=MODEL_PRICES.map(r=>r.slice());
  const byName=new Map(rows.map((r,i)=>[String(r[1])+"|"+String(r[2]).toLowerCase(),i]));
  let n=0, added=0, updated=0, held=0, thin=0;
  const nextId=()=>{ let id; do{ id="h"+(++n); }while(rows.some(r=>r[0]===id)); return id; };
  for(const f of Object.values(harvAll())){
    if(!f||!f.n||f.n<4||!(f.lo>0)||!(f.hi>=f.lo)){ thin++; continue; }
    if(f.wild){ held++; continue; }
    const row=[null,f.ref,f.name,Math.round(f.lo),Math.round(f.hi),f.conf,f.date,
      "https://www.ebay.com/sch/i.html?_nkw="+encodeURIComponent(f.name)+"&LH_Sold=1&LH_Complete=1",
      f.note,f.alias||""];
    const at=byName.get(f.ref+"|"+f.name.toLowerCase());
    if(at==null){ row[0]=nextId(); rows.push(row); byName.set(f.ref+"|"+f.name.toLowerCase(),rows.length-1); added++; }
    else { row[0]=rows[at][0]; rows[at]=row; updated++; }
  }
  return {json:JSON.stringify({updated:todayStr(),
    note:"Resale price list. Refreshed by the weekly task; app.js carries the same rows as a fallback.",
    rows}),added,updated,held,thin,total:rows.length};
}
function harvDownload(){
  const f=harvFile();
  try{
    const b=new Blob([f.json],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(b); a.download="prices.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),5000);
  }catch(e){ st.harvErr="This browser would not save the file."; render(); }
}
function harvStats(){
  const all=Object.values(harvAll());
  return {done:all.length,
    priced:all.filter(f=>f&&f.n>=4&&f.lo>0&&!f.wild).length,
    wild:all.filter(f=>f&&f.wild).length,
    empty:all.filter(f=>!f||!(f.n>=3)).length};
}
/* Is the record actually shared between the devices? The service knows - it
   reports on every sync whether it has a disk to write to - so this asks it
   and says so plainly, in words, rather than leaving the counter to read an
   absence of warnings as a yes. Costs nothing: /sync spends no API money. */
function harvShareHTML(){
  const when=st.syncSeen?fmtDay(new Date(st.syncSeen).toISOString().slice(0,10)):"";
  if(st.syncShared==="no")return `<div class="tagWarn" style="background:rgba(255,66,87,.12);color:#FFAAB4">
    <b>Not shared \u2014 and not saved.</b> The service says: ${esc(st.syncWarn||"no disk attached to the service")}.
    Prices built here stay on this device, and the service forgets its copy every time it restarts.
    In Railway: open the service, <b>Variables and Settings</b>, add a <b>Volume</b> mounted at
    <b style="font-family:var(--mono)">/data</b>, then redeploy. Do that before paying for a long run.
    <div style="margin-top:8px"><button class="ghostBtn" id="harvCheck">${syncBusy?"Checking\u2026":"Check again"}</button></div></div>`;
  if(st.syncShared==="yes")return `<div class="tagNote" style="margin-top:10px">
    <b style="color:var(--accent)">Shared.</b> The service has a disk, so what this device prices reaches the others,
    and it survives a restart. Checked ${esc(when)}.
    <div style="margin-top:8px"><button class="ghostBtn" id="harvCheck" style="padding:5px 11px;font-size:11.5px">${syncBusy?"Checking\u2026":"Check again"}</button></div></div>`;
  return `<div class="cardHint">Whether these reach your other devices depends on the service having a disk attached.
    <button class="ghostBtn" id="harvCheck" style="padding:6px 12px;font-size:12px;margin-left:6px">${syncBusy?"Checking\u2026":"Check sharing"}</button>
    Costs nothing to ask.</div>`;
}
function harvCardHTML(){
  if(!CAP.sample)return "";
  const S=harvStats(), total=harvSeed?harvSeed.length:610, left=Math.max(0,total-S.done);
  const f=S.priced?harvFile():null;
  return `<div class="card"><span class="label">Build the price list</span>
    <div class="cardHint" style="margin-top:0">The tool ships knowing about ${MODEL_PRICES.length} models. This goes and prices
      the rest &mdash; ${total} makes and models, the saws and mowers and phones and four-wheelers that actually come through a counter &mdash;
      using the same searches the green button runs. What it finds is kept as one row a model &mdash; live on this device at once, and
      on every other device the moment it syncs, so a price found on the phone at a yard sale is on the desk that afternoon.</div>
    <div class="cardHint"><b style="color:var(--ink)">It costs money.</b> About two searches each, so roughly <b style="color:var(--accent)">4&cent;</b> a model
      against your Anthropic balance &mdash; ${money(Math.round(total*0.04))} for the lot. Do a few first and look at what comes back.</div>
    <div class="cardHint">Works the same on the phone &mdash; it holds the screen awake while it runs. If it gets interrupted anyway,
      nothing is lost or paid for twice: press the button again and it carries on from where it stopped.</div>
    ${harvBusy?`<div class="tagWarn" style="background:rgba(0,217,255,.10);color:var(--ink-2)">
        <b style="color:var(--accent-2)">Working…</b> <span id="harvNow">${esc(harvNow)}</span>
        <div style="margin-top:8px"><button class="ghostBtn" id="harvStop">Stop</button></div></div>`
      :`<div class="row2" style="gap:8px;flex-wrap:wrap;margin-top:10px">
        <button class="brassBtn" data-harv="5" style="padding:10px 16px">Price 5</button>
        <button class="ghostBtn" data-harv="25" style="padding:10px 16px">Price 25</button>
        <button class="ghostBtn" data-harv="100" style="padding:10px 16px">Price 100</button>
        <button class="ghostBtn" data-harv="0" style="padding:10px 16px">Price all ${left}</button>
       </div>`}
    ${st.harvErr?`<div class="tagWarn" style="background:rgba(255,66,87,.12);color:#FFAAB4">${esc(st.harvErr)}</div>`:""}
    ${harvShareHTML()}
    ${S.done?`<div class="tagNote" style="margin-top:10px">
      <b style="color:var(--ink)">${S.done} done</b> &middot; ${S.priced} priced${S.wild?` &middot; <span style="color:var(--warn)">${S.wild} looked wrong and were held back</span>`:""}${S.empty?` &middot; ${S.empty} found nothing`:""} &middot; ${left} left.
      ${f?`<div style="margin-top:9px">To put them in the copy everyone downloads, save the file and send it to me:
        <button class="ghostBtn" id="harvDl" style="padding:6px 12px;font-size:12px;margin-left:6px">Save prices.json (${f.total} rows)</button></div>`:""}
      <div style="margin-top:6px"><button class="ghostBtn" id="harvClear" style="padding:5px 11px;font-size:11.5px">Start the list over</button></div>
    </div>`:""}
  </div>`;
}
/* ---- the master price sheet, back from the spreadsheet ------------------
   427 numbers is a spreadsheet's job, not a phone screen's. tools/
   pawn-desk-prices.xlsx carries every one of them, a sheet per kind of
   thing, and this reads the edited version back in.

   It takes a CSV saved out of Excel or Sheets, or rows pasted straight from
   either - a paste is tab-separated, a saved file is comma-separated with
   quotes around anything containing a comma, and both arrive here. Only the
   YOUR VALUE column is read; a blank means the row was fine as it was. */
function csvRows(text){
  const t=String(text||"").replace(/\r\n?/g,"\n");
  if(!t.trim())return [];
  /* Tabs mean a paste, commas mean a saved file. Whichever appears more in
     the first line is the separator - a comma inside a quoted item name
     cannot outvote the real ones. */
  const first=t.split("\n")[0];
  const sep=(first.split("\t").length>first.split(",").length)?"\t":",";
  const rows=[]; let row=[], cell="", q=false;
  for(let i=0;i<t.length;i++){
    const c=t[i];
    if(q){
      if(c==='"'){ if(t[i+1]==='"'){ cell+='"'; i++; } else q=false; }
      else cell+=c;
    } else if(c==='"') q=true;
    else if(c===sep){ row.push(cell); cell=""; }
    else if(c==="\n"){ row.push(cell); rows.push(row); row=[]; cell=""; }
    else cell+=c;
  }
  if(cell.length||row.length){ row.push(cell); rows.push(row); }
  return rows.filter(r=>r.some(x=>String(x).trim()));
}
const shNorm=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function shMoney(v){
  const n=Number(String(v==null?"":v).replace(/[$,\s]/g,""));
  return isFinite(n)&&n>0?Math.round(n):0;
}
/* Which column is which, found by name rather than position, so a column
   moved or a sheet exported with extra ones still reads. */
function shCols(head){
  const at=re=>head.findIndex(h=>re.test(shNorm(h)));
  return {key:at(/^key$/), item:at(/^item$|^make and model$|^model$/),
          val:at(/^your value/), lo:at(/^your low/), hi:at(/^your high/),
          note:at(/^your notes?$/), now:at(/^resale now/)};
}
function sheetRead(text){
  const rows=csvRows(text);
  if(!rows.length)return {err:"There was nothing in that."};
  let head=-1, C=null;
  for(let i=0;i<Math.min(rows.length,12);i++){
    const c=shCols(rows[i]);
    if(c.key>=0&&(c.val>=0||c.lo>=0)){ head=i; C=c; break; }
  }
  if(head<0)return {err:"I couldn’t find the heading row. It needs the Key column and a YOUR VALUE column, exactly as the master sheet has them."};
  const isModels=C.lo>=0&&C.hi>=0;
  const items={}, books={}, models={}, changes=[], skipped=[];
  const bookByName={}; PRICEBOOK.forEach(e=>{ bookByName[shNorm(e[0])]=e; });
  const itemById={}; CATALOG.forEach(c=>c.items.forEach(i=>{ itemById[i.id]=i; }));
  for(let i=head+1;i<rows.length;i++){
    const r=rows[i], key=String(r[C.key]||"").trim();
    if(!key)continue;
    const val=C.val>=0?shMoney(r[C.val]):0;
    const lo=C.lo>=0?shMoney(r[C.lo]):0, hi=C.hi>=0?shMoney(r[C.hi]):0;
    if(!val&&!(lo&&hi))continue;                 /* blank means keep */
    const name=C.item>=0?String(r[C.item]||"").trim():key;
    /* "a1" is both the Range / oven on the appliance sheet and the Remington
       870 Express on the models sheet - the two lists were numbered
       separately and nobody noticed they would ever meet. Which list a row
       belongs to is settled by the sheet it came off: a YOUR LOW and YOUR
       HIGH pair is the models sheet, a single YOUR VALUE is everything else.
       Checked the wrong way round, every colliding model row was silently
       swallowed by an appliance. */
    if(isModels){
      const mm=MP_BY_ID[key];
      if(mm){
        if(lo>0&&hi>=lo){
          const cur=st.modelVals&&st.modelVals[key];
          const wasLo=(cur&&cur.lo)||mm[3], wasHi=(cur&&cur.hi)||mm[4];
          if(lo!==wasLo||hi!==wasHi){ models[key]={lo,hi};
            changes.push({what:mm[2],from:wasLo+"\u2013"+wasHi,to:lo+"\u2013"+hi,range:true}); }
        }
      } else skipped.push(key+(name&&name!==key?" ("+name+")":""));
      continue;
    }
    if(itemById[key]){
      if(val>0&&val!==(st.overrides[key]??itemById[key].value)){
        items[key]=val; changes.push({what:itemById[key].name,from:st.overrides[key]??itemById[key].value,to:val}); }
      continue;
    }
    const b=bookByName[shNorm(key)]||bookByName[shNorm(name)];
    if(b){
      const was=bookVal(b);
      if(val>0&&val!==was){ books[b[0]]=val; changes.push({what:b[0],from:was,to:val}); }
      continue;
    }
    const m=MP_BY_ID[key];
    if(m){
      if(lo>0&&hi>=lo){
        const cur=st.modelVals&&st.modelVals[key];
        const wasLo=(cur&&cur.lo)||m[3], wasHi=(cur&&cur.hi)||m[4];
        if(lo!==wasLo||hi!==wasHi){ models[key]={lo,hi};
          changes.push({what:m[2],from:wasLo+"–"+wasHi,to:lo+"–"+hi,range:true}); }
      }
      continue;
    }
    skipped.push(key+(name&&name!==key?" ("+name+")":""));
  }
  return {items,books,models,changes,skipped,rows:rows.length-head-1};
}
function sheetApply(r){
  Object.keys(r.items).forEach(k=>{ st.overrides[k]=r.items[k]; });
  st.bookVals=Object.assign({},st.bookVals||{},r.books);
  st.modelVals=Object.assign({},st.modelVals||{},r.models);
  persist();
}
let shPend=null, shMsg="";
function sheetCardHTML(){
  const n=(CATALOG.reduce((a,c)=>a+c.items.length,0))+PRICEBOOK.length+MODEL_PRICES.length;
  const mine=Object.keys(st.overrides||{}).length+Object.keys(st.bookVals||{}).length+Object.keys(st.modelVals||{}).length;
  return `<div class="card"><span class="label">Your own prices, from a spreadsheet</span>
    <div class="cardHint" style="margin-top:0">The tool prices <b style="color:var(--ink)">${n}</b> things, and a spreadsheet
      beats a phone screen for going through them. <b style="color:var(--ink)">tools/pawn-desk-prices.xlsx</b> in the repository has
      every one, a sheet per kind of thing. Put what you actually get for it in the <b style="color:var(--ink)">YOUR VALUE</b> column,
      save that sheet as CSV, and drop it here. Blank rows are left exactly as they are.</div>
    ${mine?`<div class="tagNote" style="margin-top:9px"><b style="color:var(--accent)">${mine}</b> of them are already carrying your numbers rather than the built-in ones.</div>`:""}
    <div class="row2" style="gap:9px;flex-wrap:wrap;margin-top:10px">
      <label class="brassBtn" style="cursor:pointer;margin:0;padding:11px 18px">Choose the CSV
        <input id="shFile" type="file" accept=".csv,.tsv,.txt,text/csv" style="display:none"></label>
      <button class="ghostBtn" id="shPasteGo" style="padding:11px 16px">or paste the rows</button>
    </div>
    ${st.shPaste?`<textarea id="shPaste" placeholder="Select the rows in Excel or Sheets, copy, and paste them here — headings included."
      style="width:100%;margin-top:9px;min-height:110px;background:#0E1117;color:var(--ink);border:1px solid var(--e2);border-radius:10px;padding:10px;font-family:var(--mono);font-size:12px"></textarea>
      <div class="row2" style="margin-top:8px"><button class="ghostBtn" id="shPasteRead">Read what I pasted</button></div>`:""}
    ${shMsg?`<div class="cardHint" style="color:var(--warn)">${esc(shMsg)}</div>`:""}
    ${shPend?sheetPreviewHTML():""}
  </div>`;
}
/* Nothing is applied until the counter has seen every line of it. */
function sheetPreviewHTML(){
  const r=shPend;
  if(!r.changes.length)return `<div class="tagNote" style="margin-top:10px">Read ${r.rows} rows and none of them differ from what the tool already uses. Nothing to change.</div>`;
  const rows=r.changes.slice(0,40).map(c=>`<div style="display:flex;gap:10px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06)">
      <span style="flex:1">${esc(c.what)}</span>
      <span style="font-family:var(--mono);color:var(--ink-3)">${c.range?esc(String(c.from)):money(c.from)}</span>
      <span style="color:var(--ink-3)">&rarr;</span>
      <span style="font-family:var(--mono);color:var(--accent);font-weight:600">${c.range?esc(String(c.to)):money(c.to)}</span>
    </div>`).join("");
  return `<div class="tagNote" style="margin-top:12px">
    <b style="color:var(--ink)">${r.changes.length} price${r.changes.length===1?"":"s"} would change</b> out of ${r.rows} rows read.
    <div style="margin-top:8px;max-height:280px;overflow:auto">${rows}</div>
    ${r.changes.length>40?`<div class="cardHint">…and ${r.changes.length-40} more.</div>`:""}
    ${r.skipped.length?`<div class="cardHint" style="color:var(--warn)">${r.skipped.length} row${r.skipped.length===1?"":"s"} I could not match and ignored: ${esc(r.skipped.slice(0,6).join(", "))}${r.skipped.length>6?"…":""}. Check the Key column on those.</div>`:""}
    <div class="row2" style="gap:9px;margin-top:11px">
      <button class="brassBtn" id="shApply" style="padding:10px 18px">Use these ${r.changes.length}</button>
      <button class="ghostBtn" id="shCancel" style="padding:10px 16px">Cancel</button>
    </div></div>`;
}
/* ---------------- device + flags tabs ---------------- */
/* Everything about this copy of the tool rather than about an item: which
   build it is running, how the pricing page is laid out, and moving the
   shelf record by hand. None of it is part of buying or lending. */
function renderSetup(){
  return `<div class="narrow">

  <div class="card"><span class="label">This copy of the tool</span>
    <div class="cardHint" style="margin-top:0">Running <b style="color:var(--ink);font-family:var(--mono)">${APP_BUILD}</b>${st.newBuild
      ?` &mdash; the site has <b style="color:var(--warn);font-family:var(--mono)">${esc(st.newBuild)}</b>, so this device is behind. Fetch it.`
      :` &mdash; the newest there is.`} The same number sits beside SYS.OK at the top, so you can tell at a glance what a device is actually running.</div>
    <div class="row2" style="margin-top:9px"><button class="ghostBtn" id="pdFresh">Get the newest version</button></div>
  </div>
  ${pdServer()?harvCardHTML():""}
  ${sheetCardHTML()}
  ${pdServer()&&window.PHONE?`<div class="card"><span class="label">Connected</span>
    <div class="cardHint" style="margin-top:0"><b style="color:var(--accent)">This phone is on.</b> It can look up what things sold for, and the camera works \u2014 the card for it is on the <b style="color:var(--ink)">Check a price</b> tab, headed <i>Snap it</i>.</div>
  </div>`:""}
  ${window.PHONE||!pdServer()?"":`<div class="card"><span class="label">Switching another device on</span>
    <div class="cardHint" style="margin-top:0">This computer is connected. Every phone and tablet keeps its own copy, so each one has to be told once \u2014 point its camera at the code below, or type these two lines into it.</div>
    ${pdServer()?`<span class="label" style="margin-top:12px">Service address</span>
    <div class="roOut" style="user-select:all">${esc(pdServer())}</div>
    <span class="label" style="margin-top:10px">Token</span>
    <div class="roOut" style="user-select:all">${esc(pdToken()||"(none set)")}</div>
    ${typeof qrSVG==="function"?`<div style="margin-top:12px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <div style="background:#fff;padding:9px;border-radius:10px;line-height:0">${qrSVG(pdHandoffLink(),196)}</div>
      <div class="cardHint" style="margin:0;flex:1;min-width:190px">Open the phone\u2019s camera and point it at this. Tap the link it offers and the phone switches itself on \u2014 nothing to type, and the token never goes into a text message.<br><br>The link works once per device and wipes itself out of the phone\u2019s address bar as soon as it is read.</div>
    </div>`:""}
    <div class="row2" style="margin-top:9px"><button class="ghostBtn" id="pdCopyConn" title="Copy both lines so you can send them to yourself">Copy both</button></div>
    <div class="cardHint" style="font-size:12.5px">Treat the token like a key to the shop. If a phone goes missing, change PAWN_TOKEN in Railway and switch each device on again.</div>`:""}
  </div>`}
  ${pdServer()?"":pdConnectHTML()}
  ${pdServer()?`<div class="card"><span class="label">Is the service working?</span>
    <div class="cardHint" style="margin-top:0">Switched on and pointing at <b style="color:var(--ink)">${esc(pdServer())}</b>. This sends a real request the same way the camera does and says exactly what comes back &mdash; or exactly what is wrong.</div>
    <div class="row2" style="margin-top:9px"><button class="brassBtn" id="pdConnTest" style="padding:11px 18px">Test the connection</button>
      <button class="ghostBtn" id="pdConnOff">Disconnect</button></div>
    <div class="cardHint" id="pdConnMsg" style="min-height:16px"></div>
  </div>`:""}
  <div class="card"><span class="label">Move the shelf record between devices</span>
    <div class="cardHint" style="margin-top:0">${seenAll().length} tag${seenAll().length===1?"":"s"} on this device. With the service on, <b style="color:var(--ink)">Sync</b> on the pricing page does this by itself &mdash; these are for moving the record by hand, or keeping a copy.</div>
    <div class="row2" style="margin-top:9px;gap:8px;flex-wrap:wrap">
      <button class="ghostBtn" id="seenOut" title="Save every recorded tag to a file">Export</button>
      <label class="ghostBtn" style="margin:0;cursor:pointer" title="Load tags from a file exported on another device">Import<input id="seenImp" type="file" accept="application/json,.json" style="display:none"></label>
    </div>
  </div>
${window.PHONE?"":`  <div class="card"><span class="label">How the pricing page is laid out</span>
    <div class="pills mb14" style="border-radius:var(--r-s);margin-top:8px;flex-wrap:wrap">
      <button class="${stepFlow()==="ask"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="ask">One question at a time</button>
      <button class="${stepFlow()==="pages"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="pages">One page at a time</button>
      <button class="${stepFlow()==="steps"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="steps">One step at a time</button>
      <button class="${stepFlow()==="all"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="all">Everything open</button>
    </div>
    <div class="cardHint" style="margin-top:0"><b style="color:var(--ink)">One question at a time</b> is the questionnaire: one question on the screen, big answers, and answering it moves to the next by itself. The specifics &mdash; how many batteries, whether it is all there &mdash; are questions in the run rather than fields buried under it. Back, or tap any dot, to go anywhere.<br><b style="color:var(--ink)">One page at a time</b> puts one job on the screen &mdash; what it is, what it is worth, condition, your offer &mdash; with a bar to move between them and the price always on top. The default, because everything at once is thirteen cards.<br><b style="color:var(--ink)">One step at a time</b> shows the step you are on and folds the rest to a line carrying its answer &mdash; click any line to open it. The way the phone works, and it puts an item on about one screen.<br><b style="color:var(--ink)">Everything open</b> is the old layout, every step expanded at once.</div>
    <div class="cardHint" style="font-size:12.5px">Throws away everything this browser has cached and reloads from the site. Nothing you have recorded is touched &mdash; the shelf tags, listings and deal log are kept separately.</div>
  </div>`}
</div>`;
}
/* Taking in a phone: what to check before money changes hands. Setup does
   not belong on this tab - it is a counter checklist, not a settings drawer. */
function renderDevice(){
  return `<div class="narrow">
  <div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Do all of this before money changes hands. A locked phone is worth nothing and there is no fixing it afterward.</p></div>
  ${DEVICE_STEPS.map((s,i)=>
    `<div class="card step"><div style="display:flex;gap:12px;align-items:flex-start"><span class="n">${String(i+1).padStart(2,"0")}</span><div><div class="t">${s.t}</div><div class="d">${s.d}</div></div></div></div>`).join("")}</div>`;
}
function renderFlags(){
  return `<div class="narrow"><div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Any one of these and the answer is no. A stolen item costs you the loan, the goods, and a conversation with the sheriff.</p></div>
  ${FLAGS.map(f=>`<div class="card flag" style="display:flex;gap:12px;align-items:center"><span class="x">&times;</span><span>${f}</span></div>`).join("")}
  <div class="card"><span class="label">Things we don't take, whatever the price</span>
    <div class="cardHint" style="margin-top:0">Nothing wrong with the customer &mdash; these just cost more than they make. They are kept off the price lists on purpose, so nothing here quotes you a number for one.</div>
    ${NO_TAKE.map(n=>`<div class="rules sect"><span class="hd"><b>${n[0]}</b></span> ${n[1]}</div>`).join("")}
  </div>
  <div class="card">
    <div class="rules">Every transaction goes to the sheriff's office on the approved state form. Photo ID, <b>right</b> thumbprint, serial numbers, full description — no exceptions, no favors, no matter who's standing there.</div>
    <div class="rules sect"><span class="hd"><b>By the end of the next business day.</b></span> Yesterday's forms go to the sheriff today — &sect; 539.001(9)(a). Keep our copies on the premises a year, and don't destroy any of them for three.</div>
    <div class="rules sect"><span class="hd"><b>If a hold order lands on something:</b></span> it runs 90 days. When it expires, we send the sheriff a certified letter, return receipt. If no court extends it within 10 days of them receiving that letter, the item becomes ours. Nothing else starts that clock — if nobody sends the letter, we simply lose it.</div>
  </div></div>`;
}

/* ================= RUNTIME CAPABILITIES =================================
   Photo reading and the deal log are OPTIONAL. Every one of them resolves
   late, or resolves to nothing at all (older viewer, permission declined,
   page opened outside a Claude viewer). Nothing below is allowed to be
   load-bearing: when a capability is absent its whole card is hidden and
   the counter tool behaves exactly as it did before any of this existed. */
/* ---- the shop's own price service ----------------------------------------
   A static page cannot hold an API key and cannot read another website, so
   photo identification and the new-price lookup need a small service of the
   shop's own. Its address and token live in this device's storage, never in
   the page and never in the repository: nothing here ships a secret, and a
   phone that is lost takes only its own copy. */
const PD_SRV="pawndesk_server", PD_TOK="pawndesk_token";
function pdServer(){ try{ return localStorage.getItem(PD_SRV)||""; }catch(e){ return ""; } }
function pdToken(){ try{ return localStorage.getItem(PD_TOK)||""; }catch(e){ return ""; } }
function pdSetServer(u,t){ try{ if(u){ localStorage.setItem(PD_SRV,u); localStorage.setItem(PD_TOK,t||""); }
                                 else { localStorage.removeItem(PD_SRV); localStorage.removeItem(PD_TOK); } }catch(e){} }
function pdErr(c,why){ const e=new Error(c); e.code=c; if(why)e.why=why; return e; }
function pdBase(){ return pdServer().replace(/\/+$/,""); }
function pdPart(f){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onerror=()=>rej(pdErr("image_rejected"));
    r.onload=()=>{ const s=String(r.result||""), i=s.indexOf(",");
                   res({media_type:f.type||"image/jpeg", data:i>=0?s.slice(i+1):""}); };
    r.readAsDataURL(f);
  });
}
async function pdLimits(){
  try{ const r=await fetch(pdBase()+"/limits"); return await r.json(); }
  catch(e){ return {images:{mediaTypes:["image/jpeg","image/png","image/webp"],maxCount:4,maxBytes:5242880}}; }
}
/* eBay's own listing data, through the service. This is the only source the
   desk can reach that is able to say what something SOLD for - everything
   else, this tool's own web searches included, can only see listings that
   are still up, and the overpriced one that sat for six months is still up
   while the one that sold in a day is gone. Averaging what is left reads
   high, and high is the wrong direction to be wrong in when a loan is
   riding on it.

   It costs nothing to call. No model, no search, no balance - so the
   lookup tries it first, and when it comes back full the searches below it
   are never paid for at all.

   It throws like the rest of the service calls, and the caller falls
   through to the searches. A shop with no eBay keyset set on the service
   gets exactly what it got before. */
async function pdEbayComps(q,signal){
  if(!pdServer())throw pdErr("no_server");
  const ctl=new AbortController();
  const stop=()=>ctl.abort();
  if(signal){ if(signal.aborted)stop(); else signal.addEventListener("abort",stop); }
  /* eBay answers in a second or two. Anything past half a minute is a
     service that is not coming back, and the searches are still waiting. */
  const timer=setTimeout(stop,30000);
  let r;
  try{
    r=await fetch(pdBase()+"/ebay",{method:"POST",
      headers:{"content-type":"application/json","x-pawn-token":pdToken()},
      body:JSON.stringify({q:String(q||"").slice(0,120),limit:40}),signal:ctl.signal});
  }catch(e){ throw pdErr("upstream_error"); }
  finally{ clearTimeout(timer); if(signal)signal.removeEventListener("abort",stop); }
  let j=null; try{ j=await r.json(); }catch(e){}
  if(!r.ok||!j||!j.ok)throw pdErr((j&&j.code)||"upstream_error");
  return j;
}
async function pdJSON(prompt,opts){
  if(!pdServer())throw pdErr("no_server");
  opts=opts||{};
  let imgs=opts.images||[]; if(imgs&&!Array.isArray(imgs))imgs=[imgs];
  const parts=[]; for(const f of imgs){ if(f)parts.push(await pdPart(f)); }
  /* There was no timeout here at all. If the service stopped answering - it
     had died, Railway was asleep, the phone lost signal mid-read - the fetch
     sat there until the browser gave up minutes later, and what came back
     was an anonymous failure. A read that has not answered in this long is
     not going to. Searching is allowed longer because it really does go and
     read pages. */
  const MS=opts.search?120000:90000;
  let r, timedOut=false;
  const ctl=new AbortController();
  const timer=setTimeout(()=>{ timedOut=true; ctl.abort(); },MS);
  const onCancel=()=>ctl.abort();
  if(opts.signal){ if(opts.signal.aborted)ctl.abort();
                   else opts.signal.addEventListener("abort",onCancel,{once:true}); }
  try{
    r=await fetch(pdBase()+"/json",{method:"POST",
      headers:{"content-type":"application/json","x-pawn-token":pdToken()},
      body:JSON.stringify({prompt:String(prompt||""),images:parts,search:!!opts.search}),
      signal:ctl.signal});
  }catch(e){
    /* "Failed to fetch" is all a browser gives for a blocked request, a dead
       host and a dropped connection alike - but the wording differs a little
       between them, and it is the only clue there is. Carry it. */
    const why=String((e&&e.name)||"")+": "+String((e&&e.message)||e||"");
    throw pdErr(timedOut?"timeout"
      :(e&&e.name==="AbortError")?"cancelled"
      :"no_answer", why);
  }finally{
    clearTimeout(timer);
    if(opts.signal)opts.signal.removeEventListener("abort",onCancel);
  }
  let j=null; try{ j=await r.json(); }catch(e){}
  if(!j||!j.ok)throw pdErr((j&&j.code)||"upstream_error");
  return j.data;
}
/* The counter's own new-price lookup: no tab opens, the number comes back here. */
let retailBusy=false;
/* Asked in one place, because the sweep wants the same answer the button
   does. Returns the number or nothing; it sets no state of its own. */
async function retailFetch(q,signal){
  try{
    const d=await CAP.sample.json(
      'What does a new "'+q+'" cost today at a United States retailer? Search the web for current prices. '+
      'Reply with JSON and nothing else: {"price": <number, the typical new retail price in US dollars>, '+
      '"where": "<retailer>", "note": "<8 words or fewer>"}. '+
      'If there is no real new price for it, reply {"price": 0, "where": "", "note": "not found"}.',
      {search:true,signal});
    const n=Math.round(Number(d&&d.price));
    return n>0?{price:n,where:String((d&&d.where)||"").slice(0,40)}:null;
  }catch(e){ return null; }
}
async function retailLookup(){
  if(retailBusy||!CAP.sample)return;
  const x=calcItem(), q=compQuery(x);
  retailBusy=true; render();
  const say=t=>{ const el=document.getElementById("pdRetMsg"); if(el)el.textContent=t; };
  {
    const got=await retailFetch(q);
    const n=got?got.price:0, d=got?{where:got.where}:null;
    retailBusy=false;
    if(n>0){
      const p=retailPct(x);
      st.market={kind:"retail",key:mkKey(),retail:n,pct:p,where:String((d&&d.where)||"").slice(0,40),
                 mid:Math.max(5,Math.round(n*p/100/5)*5)};
      render(); return;
    }
    render(); say("No new price found for that. Type one in.");
  }
}
/* A device is switched on by opening a link the desk drew as a QR code. The
   settings ride in the hash, which never leaves the browser - it is not sent
   to GitHub Pages or anywhere else - and it is wiped from the address bar and
   from history the instant it is read, so the token does not sit in a
   bookmark or a back button. */
function pdReadHandoff(){
  try{
    const h=String(location.hash||"");
    const m=h.match(/[#&]pd=([A-Za-z0-9+/=_-]+)/);
    if(!m)return false;
    const txt=decodeURIComponent(escape(atob(m[1].replace(/-/g,"+").replace(/_/g,"/"))));
    const [srv,tok]=txt.split("\n");
    if(!/^https?:\/\//.test(srv||""))return false;
    pdSetServer(srv.trim(),(tok||"").trim());
    history.replaceState(null,"",location.pathname+location.search);
    return true;
  }catch(e){ return false; }
}
function pdHandoffLink(){
  const t=pdServer()+"\n"+pdToken();
  const b64=btoa(unescape(encodeURIComponent(t))).replace(/\+/g,"-").replace(/\//g,"_");
  return location.origin+location.pathname.replace(/[^/]*$/,"")+"phone.html#pd="+b64;
}
function pdConnectHTML(){
  if(window.claude&&window.claude.use)return "";
  const on=!!pdServer();
  /* Named for the camera for a long time, and that was wrong twice over.
     "Connect" read as "connect a camera", and there is none to buy - it uses
     the one in the device. Worse, the camera is the SMALLEST thing behind
     this switch: what it really turns on is the shop's service, and the
     service is what looks up sold prices. Somebody who did not want to
     photograph anything read "Camera and photo lookups" as optional and
     left the price lookups switched off. */
  return '<div class="card" id="pdConnCard" style="border:1px dashed var(--e2-hi)"><span class="label">This device is not connected to the shop&rsquo;s service</span>'+
    '<div class="cardHint">'+(on
      ? "Connected, but the shop&rsquo;s service did not answer. Check that it is running."
      : "Until it is, this device cannot <b style=\"color:var(--ink)\">look up what things sold for</b>. It works off the built-in price list alone, and you do the searching by hand.")+'</div>'+
    '<div class="cardHint" style="font-size:12.5px">Connecting also lets this device photograph an item and price it, read another shop&rsquo;s price tag, and share the shelf record with your other devices. It means pasting two lines once. The API key lives on the service, never in this page.</div>'+
    /* These used to be two browser prompt() boxes. A prompt is torn down the
       moment the tab loses focus - and the token lives in another tab, so
       going to fetch it closed the box you were pasting into. Fields on the
       page survive switching tabs, which is the whole job. */
    '<span class="label" style="margin-top:12px">Service address</span>'+
    '<input id="pdSrvIn" class="numIn" type="url" inputmode="url" autocomplete="off" spellcheck="false" '+
      'style="font-family:var(--mono);font-size:14px" placeholder="https://your-service.up.railway.app" value="'+esc(pdServer()||"")+'">'+
    '<span class="label" style="margin-top:10px">Token</span>'+
    '<input id="pdTokIn" class="numIn" type="text" autocomplete="off" spellcheck="false" '+
      'style="font-family:var(--mono);font-size:14px" placeholder="the PAWN_TOKEN you set in Railway" value="'+esc(pdToken()||"")+'">'+
    '<div class="cardHint" style="font-size:12.5px">Switch tabs to copy them if you need to &mdash; what you have typed stays put.'+
      (window.PHONE?" <b style=\"color:var(--ink)\">Already switched on at the desk?</b> Both are printed on the desk computer under <b style=\"color:var(--ink)\">Setup</b> &mdash; this phone keeps its own copy, so it has to be told once too.":"")+'</div>'+
    '<div class="row2" style="margin-top:8px"><button class="brassBtn" id="pdConnBtn" style="padding:10px 18px">'+
      (on?"Save and reconnect":"Switch it on")+'</button>'+
      '<button class="ghostBtn" id="pdConnTest">Test the connection</button>'+
      (on?'<button class="ghostBtn" id="pdConnOff">Disconnect</button>':'')+'</div>'+
    '<div class="cardHint" id="pdConnMsg" style="min-height:16px"></div></div>';
}
/* "Couldn't reach the service" has three quite different causes and the
   browser reports all of them the same way: a thrown fetch. This tells them
   apart and says which, instead of leaving the counter to guess.

   A no-cors request still completes when the server is alive but refusing
   the browser's origin - so if the plain request dies and the opaque one
   lives, it is CORS, which means ALLOW_ORIGIN, not a dead service. */
async function pdTestConn(){
  const out=document.getElementById("pdConnMsg");
  const srvEl=document.getElementById("pdSrvIn"), tokEl=document.getElementById("pdTokIn");
  let u=String((srvEl&&srvEl.value)||pdServer()||"").trim().replace(/\/+$/,"");
  const tok=String((tokEl&&tokEl.value)||pdToken()||"").trim();
  const say=(tone,t)=>{ if(out)out.innerHTML='<span style="color:'+tone+'">'+t+'</span>'; };
  if(!u){ say("var(--warn)","Put the service address in first."); return; }
  if(!/^https?:\/\//i.test(u))u="https://"+u;
  if(/^http:\/\//i.test(u)&&location.protocol==="https:"){
    say("var(--bad)","That address starts with <b>http://</b>. This page is https, so the phone blocks it before it leaves. Change it to <b>https://</b>.");
    return; }
  say("var(--ink-3)","Testing\u2026");
  /* 1. is anything there at all? */
  let limits=null, threw=null;
  try{
    const r=await fetch(u+"/limits",{signal:AbortSignal.timeout(15000)});
    limits={status:r.status}; try{ limits.body=await r.json(); }catch(e){}
  }catch(e){ threw=e; }
  if(threw){
    let opaque=false;
    try{ await fetch(u+"/limits",{mode:"no-cors",signal:AbortSignal.timeout(15000)}); opaque=true; }catch(e){}
    if(opaque) say("var(--bad)","The service is <b>alive</b> but refusing this page. That is <b>ALLOW_ORIGIN</b> in Railway \u2014 set it to <b>"+esc(location.origin)+"</b> and redeploy.");
    else       say("var(--bad)","<b>Nothing answered at that address.</b> Either it is wrong, or the service is not running. Open <b>"+esc(u)+"/limits</b> in this phone's browser: a line of JSON means it is alive, an error page means Railway is down or asleep.");
    return;
  }
  if(limits.status!==200||!limits.body||!limits.body.ok){
    say("var(--bad)","Something answered at that address, but it is not the pawn service (HTTP "+limits.status+"). Check the address.");
    return; }
  /* 2. it is there - does it accept the token? */
  if(!tok){ say("var(--warn)","The service is up and reachable. Now put the token in."); return; }
  const post=async(body,ms)=>{
    const r=await fetch(u+"/json",{method:"POST",
      headers:{"content-type":"application/json","x-pawn-token":tok},
      body:JSON.stringify(body),signal:AbortSignal.timeout(ms||45000)});
    return await r.json().catch(()=>({ok:false,code:"http_"+r.status}));
  };
  try{
    const j=await post({prompt:'Reply with JSON and nothing else: {"ok":1}',images:[]},30000);
    if(!j||!j.ok){ const c=(j&&j.code)||"upstream_error";
      say("var(--bad)","Reached it, but it answered <b>"+esc(c)+"</b>. "+esc(photoErrCopy(c))); return; }
  }catch(e){ say("var(--bad)","Reached the service, but a plain request timed out. Railway may be waking up \u2014 try once more."); return; }

  /* 3. and with a PICTURE on it? This is the ONLY difference between the
        request the camera makes and the one above, so when plain requests
        work and photographs do not, the answer is in here. Two sizes: a tiny
        one to prove pictures are handled at all, then one the size of a real
        phone photo to prove the upload survives the trip. */
  say("var(--ink-3)","Plain requests work. Trying one with a small picture\u2026");
  const madeJPEG=px=>new Promise(res=>{
    const c=document.createElement("canvas"); c.width=c.height=px;
    const g=c.getContext("2d");
    for(let y=0;y<px;y+=8)for(let x=0;x<px;x+=8){
      g.fillStyle="rgb("+((x*7)%256)+","+((y*11)%256)+","+((x*y)%256)+")"; g.fillRect(x,y,8,8); }
    c.toBlob(b=>res(b),"image/jpeg",0.9);
  });
  const asPart=blob=>new Promise(res=>{ const r=new FileReader();
    r.onload=()=>{ const t=String(r.result||""),i=t.indexOf(","); res({media_type:"image/jpeg",data:i>=0?t.slice(i+1):""}); };
    r.readAsDataURL(blob); });
  const tryImg=async px=>{
    const blob=await madeJPEG(px); const part=await asPart(blob);
    const kb=Math.round(part.data.length/1024);
    try{
      const j=await post({prompt:'Reply with JSON and nothing else: {"ok":1}',images:[part]},60000);
      if(j&&j.ok)return {ok:true,kb};
      return {ok:false,kb,code:(j&&j.code)||"upstream_error"};
    }catch(e){ return {ok:false,kb,threw:String((e&&e.name)||"")+": "+String((e&&e.message)||e)}; }
  };
  const small=await tryImg(64);
  if(!small.ok){
    say("var(--bad)","Plain requests work, but one carrying even a tiny picture ("+small.kb+"KB) "+
      (small.threw?("died on the way: <b>"+esc(small.threw)+"</b>. Something between this phone and the service refuses requests with a picture on them.")
                  :("was answered <b>"+esc(small.code)+"</b>. "+esc(photoErrCopy(small.code)))));
    return; }
  /* Climb until something refuses it. Knowing the ceiling is the difference
     between "photographs sometimes fail" and a number to shrink to. */
  let lastOK=small.kb, firstBad=null, badWhy="";
  for(const px of [1400,2000,2600,3200]){
    say("var(--ink-3)","Pictures work so far ("+lastOK+"KB). Trying a bigger one\u2026");
    const r=await tryImg(px);
    if(r.ok){ lastOK=r.kb; continue; }
    firstBad=r.kb; badWhy=r.threw||("answered "+r.code); break;
  }
  if(firstBad==null){
    /* Everything above answers in about a second. A real photo read takes
       Claude ten to thirty seconds to think, and nothing so far has tested
       whether the connection survives that wait - which is the one thing
       left that differs between a request that works and one that does not.
       So do the real thing, with the real prompt, and time it. */
    say("var(--ink-3)","Every size arrives. Now the slow part \u2014 a full read, the way the camera does it. This takes 10 to 30 seconds\u2026");
    const blob=await madeJPEG(1200), part=await asPart(blob);
    const t0=Date.now();
    try{
      const j=await post({prompt:photoPrompt(),images:[part]},120000);
      const secs=((Date.now()-t0)/1000).toFixed(1);
      if(j&&j.ok) say("var(--accent)","<b>All good, including the slow part.</b> A full read came back in "+secs+"s. Photographs arrive up to "+lastOK+"KB and the connection holds while Claude thinks.");
      else say("var(--bad)","Pictures arrive, but a full read answered <b>"+esc((j&&j.code)||"upstream_error")+"</b> after "+secs+"s. "+esc(photoErrCopy((j&&j.code)||"upstream_error")));
    }catch(e){
      const secs=((Date.now()-t0)/1000).toFixed(1);
      say("var(--bad)","<b>Found it.</b> Pictures arrive at any size, but a full read \u2014 the one the camera makes \u2014 died after <b>"+secs+"s</b> ("+esc(String((e&&e.name)||"")+": "+String((e&&e.message)||e))+"). Nothing is wrong with the picture or the service: the connection is being cut while Claude is still thinking.");
    }
  }else{
    say("var(--warn)","<b>Found the ceiling.</b> Pictures up to <b>"+lastOK+"KB</b> get through; <b>"+firstBad+"KB</b> does not ("+esc(badWhy)+"). Photos are now shrunk to sit under that, so this should not bite \u2014 but it is worth knowing.");
  }
}
document.addEventListener("click",e=>{
  const tst=e.target&&e.target.closest?e.target.closest("#pdConnTest"):null;
  if(tst){ pdTestConn(); return; }
  const so=e.target&&e.target.closest?e.target.closest("#pinNew"):null;
  if(so){ startOver(); return; }
  const fr=e.target&&e.target.closest?e.target.closest("#pdFresh"):null;
  if(fr){ fr.textContent="Fetching\u2026"; fr.disabled=true;
    forceUpdate((msg)=>{
      /* Back where it was, with the reason beside it. A button that has
         visibly given up is kinder than one still saying "Fetching..." */
      fr.textContent="Get the newest version"; fr.disabled=false;
      let n=fr.parentNode&&fr.parentNode.querySelector(".freshMsg");
      if(!n&&fr.parentNode){ n=document.createElement("div");
        n.className="cardHint freshMsg"; n.style.flexBasis="100%";
        fr.parentNode.appendChild(n); }
      if(n)n.textContent=msg;
    });
    return; }
  const pv=e.target&&e.target.closest?e.target.closest("[data-page],[data-pgmove]"):null;
  if(pv){
    if(pv.dataset.page)return goPage(pv.dataset.page);
    const v=document.getElementById("view"), pages=livePages(v);
    const at=pages.findIndex(p=>p[0]===st.page)+Number(pv.dataset.pgmove);
    if(pages[at])goPage(pages[at][0]);
    return;
  }
  const sf=e.target&&e.target.closest?e.target.closest("#specFold>summary"):null;
  if(sf){ st.specOpen=!st.specOpen; return; }   /* the browser toggles it; just remember */
  const f=e.target&&e.target.closest?e.target.closest("[data-fake],[data-mkind],[data-flow],#fakeClear"):null;
  if(f){
    if(f.id==="fakeClear"){ st.fakeAns={}; st.fakeKey=mkKey(); st.specIn={}; st.specPick=""; render(); return; }
    if(f.dataset.mkind){ st.metalKind=f.dataset.mkind; st.fakeAns={}; st.fakeKey=mkKey(); render(); return; }
    if(f.dataset.flow){ st.flow=f.dataset.flow; try{ persist(); }catch(e){} render(); return; }
    const [id,i,v]=String(f.dataset.fake).split(":"); fakeSet(id,i,v); return;
  }
  const b=e.target&&e.target.closest?e.target.closest("#pdConnBtn,#pdConnOff,#pdRetGo"):null; if(!b)return;
  if(b.id==="pdRetGo"){ retailLookup(); return; }
  if(b.id==="pdConnOff"){ pdSetServer("",""); location.reload(); return; }
  const si=document.getElementById("pdSrvIn"), ti=document.getElementById("pdTokIn");
  const msg=document.getElementById("pdConnMsg");
  const say=t=>{ if(msg)msg.innerHTML='<span style="color:var(--warn)">'+esc(t)+'</span>'; };
  let u=String((si&&si.value)||"").trim().replace(/\/+$/,"");
  const t=String((ti&&ti.value)||"").trim();
  if(!u){ say("Put the service address in first."); if(si)si.focus(); return; }
  if(!/^https?:\/\//i.test(u))u="https://"+u;
  /* A trailing /limits is the address people have in a tab from testing it. */
  u=u.replace(/\/(limits|sync|json)$/i,"");
  pdSetServer(u,t);
  location.reload();
});
const CAP = {sample:null, images:false, imgLimits:null, db:null, dbErr:""};
let DEALS = [];        /* the shop's own sold history — newest first */
let dealsReady = false;

(async function bootCaps(){
  const use = (window.claude && window.claude.use) ? window.claude.use : null;
  if(!use){ setTimeout(()=>{ if(window.standaloneBoot)window.standaloneBoot(); },0); return; }   /* its own website */
  try{
    CAP.sample = await use("sample");
    if(CAP.sample){
      const lim = await CAP.sample.limits().catch(()=>null);
      CAP.images = !!(lim && lim.images);
      CAP.imgLimits = (lim && lim.images) || null;
    }
  }catch(e){ CAP.sample=null; }
  try{ CAP.db = await use("db"); }catch(e){ CAP.db=null; }
  if(CAP.db) watchDeals();
  try{ render(); }catch(e){}
})();

/* ---------------- the shop's own comps ----------------
   Every priced deal can be logged. Item facts only — never a name, never an
   ID number, never anything off the state form. That record belongs in the
   POS; this is a price book that teaches itself. */
function watchDeals(){
  try{
    CAP.db.collection("deals").orderBy("ts","desc").limit(400)
      .onSnapshot(snap=>{
        DEALS = snap.docs.map(d=>Object.assign({_id:d.id}, d.data()||{}));
        dealsReady = true;
        try{ refreshDealViews(); }catch(e){}
      }, err=>{ CAP.dbErr = (err&&err.code)||"unavailable"; });
  }catch(e){ CAP.dbErr="invalid_argument"; }
}
function refreshDealViews(){
  if(st.mode==="log"){ const v=document.getElementById("view"); v.innerHTML=renderLog(); wireLog(); return; }
  const oc=document.getElementById("ownComps"); if(oc)oc.innerHTML=ownCompsInner(calcItem());
  const lg=document.getElementById("logCard"); if(lg)lg.innerHTML=logCardInner(calcItem());
}
/* A price-book pick lands in the category's one custom slot, so every book
   item in a category would otherwise share an id — and share a sales history
   that isn't theirs. Key them by the book name instead. */
function isCustom(){ return String(st.itemId||"").indexOf("cust-")===0; }
function itemKey(){ return st.itemId + (isCustom()&&st.bookName ? "|"+st.bookName : ""); }
function displayName(x){ return (isCustom()&&st.bookName) ? st.bookName : x.item.name; }
function dealsFor(key){ return DEALS.filter(d=>(d.key||d.itemId)===key); }
function soldStats(key){
  const sold=dealsFor(key).filter(d=>d.status==="sold"&&Number(d.soldPrice)>0).map(d=>Number(d.soldPrice));
  if(!sold.length)return null;
  const avg=sold.reduce((a,b)=>a+b,0)/sold.length;
  return {n:sold.length, avg, lo:Math.min.apply(null,sold), hi:Math.max.apply(null,sold)};
}
function ownCompsInner(x){
  if(!CAP.db) return "";
  const k=itemKey(), s=soldStats(k), open=dealsFor(k).filter(d=>d.status==="open").length;
  if(!s&&!open) return `<div class="cardHint" style="margin-top:9px">No history on this one yet — log the deal below and this becomes your own price book.</div>`;
  let h=`<div class="tagNote" style="margin-top:10px">`;
  if(s){
    h+=`<b style="color:var(--ink)">Your own sales: ${s.n}</b> — average <b style="color:var(--accent)">${money(s.avg)}</b>`;
    h+=(s.n>1?`, range ${money(s.lo)}&ndash;${money(s.hi)}`:``)+`. `;
    h+=`This is Bristol money, not eBay money. <button id="useOwn" class="ghostBtn" style="padding:6px 12px;font-size:12.5px;margin-left:4px">Use ${money(s.avg)}</button>`;
  }
  if(open)h+=`${s?" ":""}${open} still on the shelf or in loan.`;
  return h+`</div>`;
}
function ownCompsHTML(x){ return `<div id="ownComps">${ownCompsInner(x)}</div>`; }

/* ---------------- the price book, searchable from anywhere ----------------
   The category lists hold the everyday walk-ins. The book behind this search
   holds the rest. Nothing in either one? The last row of every item list lets
   the counter set its own number, which is the honest answer for a one-off. */
function bookHitsHTML(){
  const q=String(st.bookQ||"").trim();
  if(q.length<3)return "";
  const hits=searchBook(q);
  if(!hits.length)return `<div class="cardHint" style="margin-top:7px">Nothing in the book for that. Use <b style="color:var(--ink)">Not on any list</b> at the bottom and put in what you'd sell it for &mdash; then log the deal, and next time the tool remembers.</div>`;
  return hits.map((e,i)=>`<button class="itemBtn" data-bookhit="${i}" style="margin-top:6px"><span style="flex:1">${esc(e[0])}</span><span class="price" style="color:var(--accent-2)">${money(e[1])} &middot; ${CATLABEL[e[2]]}</span></button>`).join("");
}
/* A price-book row had nowhere to keep a number of its own. Picking one
   dropped the book's figure into the category's single custom slot, which the
   next book row overwrote - so "what this shop really gets for a chainsaw"
   could not be recorded against the row it belonged to. It can now, and the
   master price sheet writes straight into it. */
function bookVal(e){
  const v=Number(st.bookVals&&st.bookVals[e[0]]);
  return v>0?Math.round(v):e[1];
}
function pickBookEntry(e){
  st.catId=e[2]; st.itemId=custId(e[2]); st.bookName=e[0]; st.overrides[custId(e[2])]=bookVal(e);
  st.liq=e[3]; st.brand="mid"; st.brandTyped=""; st.model=""; st.detail="";
  st.complete=true; st.editing=false; st.specSel={};
  persist(); render();
}
function wireBookSearch(){
  const b=document.getElementById("bookIn");
  if(!b)return;
  b.oninput=()=>{
    st.bookQ=b.value;
    const box=document.getElementById("bookHits");
    if(box){ box.innerHTML=bookHitsHTML(); wireBookHits(); }
  };
  wireBookHits();
}
function wireBookHits(){
  const hits=searchBook(String(st.bookQ||"").trim());
  document.querySelectorAll("[data-bookhit]").forEach(btn=>{
    btn.onclick=()=>{ const e=hits[Number(btn.dataset.bookhit)]; if(e)pickBookEntry(e); };
  });
}

/* ---------------- comp searches ----------------
   The page cannot reach these sites itself — it is sandboxed. These open the
   right search in a new tab, and print the search text so it can be copied
   onto a phone when the tab is blocked.
   WatchCount is the main one: eBay's own sold listings, searched without an
   eBay sign-in, and it shows the price a Best Offer sale actually closed at
   instead of the crossed-out list price. It only opens the search; it never
   pulls prices back into this page (the site blocks automated readers). */
function compQuery(x){
  const bits=[st.brandTyped||"", st.model||"", displayName(x).replace(/\s*—.*$/,""), st.detail||""];
  return bits.map(s=>String(s).trim()).filter(Boolean).join(" ").slice(0,120);
}
/* GunWatcher looks a gun up by model name. The category word the keyword
   searches want - "Pump shotgun" on the end of "Remington 870 Express" - only
   blurs it, and so does the gauge. Brand and model, nothing else. When a
   built-in price row is in play its own name is better still: that is the
   name GunWatcher published the sold prices under. */
function gunQuery(x){
  const row=st.mpPin&&MP_BY_ID[st.mpPin.id];
  if(row)return String(row[2]).slice(0,80);
  if(String(st.model||"").trim())
    return [st.brandTyped||"",st.model||""].map(t=>String(t).trim()).filter(Boolean).join(" ").slice(0,80);
  return compQuery(x);
}
function watchCountUrl(q){
  /* WatchCount puts the search words in the path, so a slash would split it
     into the wrong route — turn slashes into spaces (10/22 still finds 10/22). */
  const kw=String(q).replace(/[\/\\]+/g," ").replace(/\s+/g," ").trim().toLowerCase()||"-";
  return "https://www.watchcount.com/sold/"+encodeURIComponent(kw)+"/-/all?site=EBAY_US";
}
function compTargets(x){
  const q=compQuery(x), e=encodeURIComponent(q), t=[], guns=(st.catId==="guns");
  if(guns){
    t.push({id:"gw",name:"GunWatcher",sub:"sold prices, no sign-in",
      url:"https://gunwatcher.com/gun-value-sold-information/market-price?itemName="+encodeURIComponent(gunQuery(x)).replace(/%20/g,"+")});
    t.push({id:"gb",name:"GunBroker",sub:"then tick Completed &mdash; the real gun comp",
      url:"https://www.gunbroker.com/All/search?Keywords="+e});
  }
  t.push({id:"wc",name:"WatchCount &mdash; eBay sold",
    sub:guns?"parts &amp; optics only &mdash; eBay bans guns":"real Best Offer prices, no eBay sign-in",
    url:watchCountUrl(q)});
  t.push({id:"ebay",name:"eBay sold",sub:"backup &mdash; sign in first or it bounces you",
    url:"https://www.ebay.com/sch/i.html?_nkw="+e+"&LH_Sold=1&LH_Complete=1"});
  return t;
}
function compsCardHTML(x){
  const q=compQuery(x), guns=(st.catId==="guns");
  return `<div class="card" id="compsCard"><span class="label">Check it against the market</span>
    <div class="compGrid">${compTargets(x).map(t=>
      `<a class="compBtn" data-compsite="${t.id}" data-url="${esc(t.url)}" data-label="${t.name}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${t.name}</span><span class="cs">${t.sub}</span></a>`
    ).join("")}</div>
    <div class="cardHint" id="compMsg" style="min-height:18px;margin-top:9px"></div>
    <div id="compFallback"></div>
    ${shotZoneHTML(x)}
    <span class="label" style="margin-top:8px">What those buttons search for</span>
    <div class="row2"><input id="compQ" class="roOut" readonly tabindex="-1" aria-label="What those buttons search for" value="${esc(q)}" style="flex:1;min-width:0;font-size:13px"><button id="compCopy" class="ghostBtn" style="padding:10px 15px">Copy</button></div>
    <div class="cardHint">Sold prices, not asking prices. An item listed at $400 that nobody bought is worth nothing to you. On WatchCount, a Best Offer sale shows what the seller actually took &mdash; use that number, never the crossed-out one.${guns?" eBay doesn't sell guns &mdash; GunBroker completed auctions is the only real firearm comp.":""}</div>
  </div>`;
}
/* The ones the number was built from.
 *
 * A count and a median are a claim; these are the evidence. The counter is
 * holding the actual item, and twelve pictures of what the median was made
 * of is the fastest way to see that three of them are a different
 * generation, or the wrong colour, or came with the case this one is
 * missing. Cheapest first, so the two ends of the band are the two ends of
 * the strip and an outlier is obvious where a list of numbers hides it.
 *
 * Sales before asks - a sale is the better evidence and should be the first
 * thing in the eye. Sold ones carry the date; an ask has none to carry.
 */
/* The strip on its own card, for beside the number rather than beside the
   question. Same pictures, its own box. */
function thumbStripCard(rows){
  const inner=thumbStripHTML(rows,true);
  return inner?`<div class="card wCard" style="margin-top:8px">${inner}</div>`:"";
}
function thumbStripHTML(rows,bare){
  const withPics=(rows||[]).filter(r=>r&&r.img&&r.price>0)
    .sort((a,b)=>(a.basis==="sold"?0:1)-(b.basis==="sold"?0:1)||a.price-b.price)
    .slice(0,12);
  if(withPics.length<3)return "";
  const cell=(r)=>{
    const when=r.basis==="sold"&&r.ts?fmtDay(new Date(r.ts).toISOString().slice(0,10)):"";
    const cap=`${money(r.price)}${when?" \u00b7 "+when:""}`;
    /* No signal in somebody's driveway means eBay's image host is
       unreachable, and twelve broken-image boxes are worse than no strip
       at all - they read as a fault in the desk. A picture that will not
       load takes its whole cell with it, and if none load the card is
       empty and the count below it still tells the truth. */
    const inner=`<img src="${esc(r.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="var t=this.closest('.thumb'); if(t)t.remove();">`
      +`<span class="tPrice">${esc(cap)}</span>`
      +`<span class="tWhat">${esc(r.what||"")}</span>`;
    return r.url
      ? `<a class="thumb${r.basis==="sold"?" sold":""}" href="${esc(r.url)}" target="_blank" rel="noopener" referrerpolicy="no-referrer" title="${esc(r.what||"")}">${inner}</a>`
      : `<span class="thumb${r.basis==="sold"?" sold":""}" title="${esc(r.what||"")}">${inner}</span>`;
  };
  const sold=withPics.filter(r=>r.basis==="sold").length;
  return `<div class="label" style="${bare?"margin:0":"margin-top:12px"}">What that number is made of</div>
    <div class="thumbStrip">${withPics.map(cell).join("")}</div>
    <div class="cardHint" style="margin-top:6px">${withPics.length} of them, cheapest first${sold?`, ${sold} sold`:""}. Tap one to open the listing &mdash; if several are not the same thing you are holding, the number is not yours.</div>`;
}
function setCompMsg(txt,kind){
  const el=document.getElementById("compMsg"); if(!el)return;
  const c = kind==="bad"?"var(--warn)" : kind==="ok"?"var(--accent)" : "var(--ink-2)";
  el.innerHTML = txt ? `<span style="color:${c}">${esc(txt)}</span>` : "";
}
async function copyText(v){
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ await navigator.clipboard.writeText(v); return true; } }catch(e){}
  try{ return !!document.execCommand("copy"); }catch(e){ return false; }
}
function flashBtn(b,word,back){
  b.textContent=word; setTimeout(()=>{b.textContent=back;},1800);
}
function wireCopy(btnId,inputId,back){
  const b=document.getElementById(btnId); if(!b)return;
  b.onclick=async()=>{
    const i=document.getElementById(inputId); if(!i)return;
    i.focus(); i.select(); try{ i.setSelectionRange(0,9999); }catch(e){}
    flashBtn(b, (await copyText(i.value)) ? "Copied" : "Selected \u2014 press copy", back);
  };
}
/* The page is sandboxed, so a new tab can be refused with no error and no
   navigation — which looks exactly like a dead button. Open it ourselves so
   we know whether it worked, and hand over the link when it didn't. */
function wireComps(){
  document.querySelectorAll("[data-compsite]").forEach(a=>{
    /* NO preventDefault. A scripted window.open from this sandboxed page makes
       a sandboxed tab, and GunBroker refuses to render into one — that is the
       ERR_BLOCKED_BY_RESPONSE the counter sees. Letting the real anchor
       navigate gives the browser its best chance. The copy-link box below is
       the guaranteed path: a pasted URL is a clean top-level load. */
    a.onclick=()=>{
      const url=a.dataset.url, label=a.dataset.label;
      pasteTo="shot";
      const fb=document.getElementById("compFallback");
      a.classList.add("pending");
      setTimeout(()=>a.classList.remove("pending"),500);
      setCompMsg("Opening "+label+"\u2026","");
      if(fb){
        fb.innerHTML=`<div class="tagWarn"><b>Blank tab, or "blocked / refused to connect"?</b>
          That is ${esc(label)} turning away the page, not a broken button. Copy this link into a
          fresh browser tab &mdash; pasted links always load.
          <input class="numIn" id="compUrl" readonly value="${esc(url)}" style="margin-top:9px;font-family:var(--mono);font-size:11px;padding:9px 11px">
          <button id="compUrlCopy" class="ghostBtn" style="margin-top:9px;padding:8px 14px">Copy link</button></div>`;
        wireCopy("compUrlCopy","compUrl","Copy link");
      }
    };
  });
  wireCopy("compCopy","compQ","Copy");
}

/* ---------------- photo read ----------------
   Identification only. It never sets a price: the number stays yours. */
let photoFile=null, photoBusy=false, photoCtl=null;
function photoCardHTML(){
  if(!CAP.sample||!CAP.images){
    /* The full connect card is five hundred pixels of setup copy and two
       inputs. On the start screen and under Setup that is right. In the
       middle of pricing something, on a desk, it was holding the centre
       column while SWITCHED OFF - half a screen given to a thing nobody is
       using, pushing the actual questions below the fold. Once an item is
       on the go it collapses to a line saying what is missing and where to
       fix it. The phone still gets the full card: it is the phone's main
       move, and there is no second column to lose. */
    if(!window.PHONE && st.picked) return `<div class="card" id="photoCard">
      <span class="label" style="margin:0">Not connected &mdash; no sold-price lookups on this device</span>
      <div class="cardHint" style="margin:5px 0 0">Connect it to the shop's service and it can look up what things sold for, photograph an item and price it, and read another shop's tag.
        <button class="ghostBtn" data-gotab="setup" type="button" style="padding:5px 12px;font-size:12px;margin-left:6px">Set it up</button></div>
    </div>`;
    return pdConnectHTML();
  }
  const r=st.photoRead;
  /* Leading the phone's start screen, this is the main move and is dressed
     as one. Once an item is on the go it is a tool among tools again. */
  const lead=window.PHONE&&!st.picked;
  let h=`<div class="card${lead?" camLead":""}" id="photoCard"><span class="label">${lead
      ?"Snap it &mdash; I'll work out what it is"
      :"Photograph it &mdash; I'll fill in what I can see"}</span>
    <div class="row2" style="gap:9px;flex-wrap:wrap">
      ${camButtonHTML(lead)}
      <label class="ghostBtn" style="display:inline-block;cursor:pointer;margin:0">
        ${photoFile?"Choose another":"Choose photo"}
        <input id="photoIn" type="file" accept="image/jpeg,image/png,image/webp" style="display:none">
      </label>
      ${photoFile?`<button id="photoGo" class="ghostBtn" style="padding:9px 18px" ${photoBusy?"disabled":""}>${photoBusy?"Looking…":(st.photoRead?"Identify again":"Identify it")}</button>`:""}
      ${photoBusy?`<button id="photoStop" class="ghostBtn" style="padding:9px 14px">Stop</button>`:""}
    </div>
    ${photoFile?`<div class="photoWrap"><img id="photoPrev" alt="the item"></div>`:""}
    ${photoErrHTML()}${photoLookHTML()}
    <div class="cardHint" id="photoMsg">${photoBusy?"Reading the picture — 10 to 30 seconds."
      :(isTouch()?"The photo goes straight in - nothing else to press. ":"Choose a photo, or drag one onto this card. ")
        +"Fill the frame and get the model plate or barrel stamp in focus."
        +(lead?" Or type it in the box below if you already know what it is.":"")}</div>`;
  if(r){
    h+=`<div class="tagWarn" style="background:rgba(0,217,255,.10);color:var(--ink-2)">
      <b style="color:var(--accent-2)">Read from the photo &mdash; check every field.</b>
      ${r.what?` It looks like <b style="color:var(--ink)">${esc(r.what)}</b>.`:""}
      ${r.confidence?` Confidence: <b style="color:var(--ink)">${esc(r.confidence)}</b>.`:""}
      ${r.note?`<br>${esc(r.note)}`:""}
      <br><span style="color:var(--ink-3)">It has not touched the price. Step 4 is still your number.</span></div>`;
    if(r.concerns&&r.concerns.length){
      h+=`<div class="tagWarn" style="background:rgba(255,66,87,.12);color:#FFAAB4"><b>Look closer at:</b><br>${r.concerns.map(c=>"&bull; "+esc(c)).join("<br>")}</div>`;
    }
  }
  return h+`</div>`;
}
function catalogText(){
  return CATALOG.map(c=>c.id+" ("+c.label+"): "+c.items.map(i=>i.id+"="+i.name).join("; ")).join("\n");
}
function specMenuText(){
  return Object.keys(SPEC_CHOICES).map(id=>
    id+" | "+SPEC_CHOICES[id].map(g=>g.label+": "+g.options.map(o=>o.t).join(" / ")).join(" | ")
  ).join("\n");
}
/* What the counter can tell it that the camera could not: words stamped on
   the thing, a number, how big it is, what it is made of. A second look with
   these in hand lands far more often than the first, and they cost nothing
   to collect - the counter is holding the object. */
function photoHintText(){
  const h=st.photoHints||{};
  const rows=[["words","Words, names or logos on it"],["nums","Numbers or a model stamped on it"],
              ["size","Roughly how big it is"],["made","What it is made of"],["extra","Anything else"]];
  const said=rows.filter(([k])=>String(h[k]||"").trim());
  if(!said.length)return "";
  return ["","THE COUNTER IS HOLDING THE ITEM AND SAYS:",
    ...said.map(([k,l])=>"- "+l+": "+String(h[k]).trim().slice(0,160)),
    "Trust these over your own reading of the photograph - they can turn it over and you cannot.",""].join("\n");
}
function photoPrompt(){
  return [
"You are helping the counter at a small pawn shop in Bristol, Florida identify an item a customer has just set on the counter. You are looking at one photograph of that item.",
"",
"Your job is IDENTIFICATION ONLY. Do not estimate any price, value, or loan amount — the shop has its own price book and its own market. A price in your answer is a wrong answer.",
"",
"What matters most, in order:",
"1. The maker and the exact model, read off the item — a stamp, a plate, a barrel roll mark, a label. This is the single most valuable thing you can give the counter, because it is what they will type into a completed-auction search.",
"2. Which row of the shop's catalog this item belongs in.",
"3. The spec answers the shop's pricing form asks for.",
"4. Anything visible that should slow the deal down.",
"",
"CATALOG — pick one catId and one itemId from this list:",
catalogText(),
"",
"SPEC OPTIONS — if the itemId you chose appears here, answer its questions using ONLY the exact option strings listed for it:",
specMenuText(),
"",
"If nothing in the catalog fits, leave catId and itemId empty and instead name the item plainly in \"what\".",
photoHintText(),
"",
"CONDITION — one of: new (sealed), exc (barely used), good (normal wear), fair (heavy wear), rough (needs work). Judge only what the photo shows.",
"",
"CONCERNS — short phrases, only when the photo actually shows them: a serial number that looks ground, filed or scratched; retail packaging or security tags still attached; visible damage, rust, cracks; missing parts; a screen showing an activation lock. Say nothing you cannot see.",
"",
"Reply with ONLY this JSON:",
'{"what":"plain name of the item","catId":"","itemId":"","brand":"","model":"","detail":"short spec text for the ticket","cond":"good","specs":[{"label":"Gauge","choice":"12 ga"}],"concerns":[],"confidence":"high|medium|low","note":"one sentence on what you could and could not make out"}'
  ].join("\n");
}
/* ---- pictures put by ----------------------------------------------------
   A photograph nobody could place is still worth keeping: at a yard sale you
   move on, and the research happens that evening. localStorage cannot hold
   photographs - a few of them would blow its quota - so these live in
   IndexedDB, on the device, and never go anywhere. */
const SHOT_DB="pawndesk_shots";
function shotDB(){
  return new Promise((res,rej)=>{
    let rq; try{ rq=indexedDB.open(SHOT_DB,1); }catch(e){ return rej(e); }
    rq.onupgradeneeded=()=>{ const d=rq.result;
      if(!d.objectStoreNames.contains("shots"))d.createObjectStore("shots",{keyPath:"id"}); };
    rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error);
  });
}
async function shotSave(blob,meta){
  try{
    const d=await shotDB();
    const rec=Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),
                             ts:Date.now(),blob},meta||{});
    await new Promise((res,rej)=>{ const t=d.transaction("shots","readwrite");
      t.objectStore("shots").put(rec); t.oncomplete=res; t.onerror=()=>rej(t.error); });
    return rec.id;
  }catch(e){ return null; }
}
async function shotAll(){
  try{
    const d=await shotDB();
    return await new Promise((res,rej)=>{ const t=d.transaction("shots","readonly");
      const rq=t.objectStore("shots").getAll();
      rq.onsuccess=()=>res((rq.result||[]).sort((a,b)=>b.ts-a.ts)); rq.onerror=()=>rej(rq.error); });
  }catch(e){ return []; }
}
async function shotDrop(id){
  try{ const d=await shotDB();
    await new Promise((res,rej)=>{ const t=d.transaction("shots","readwrite");
      t.objectStore("shots").delete(id); t.oncomplete=res; t.onerror=()=>rej(t.error); });
  }catch(e){}
}
let SHOTS=[];
async function shotsRefresh(){ SHOTS=await shotAll(); try{ render(); }catch(e){} }

async function runPhotoRead(){
  if(!CAP.sample||!photoFile||photoBusy)return;
  photoBusy=true; photoCtl=new AbortController(); st.photoErr=null; st.photoLook=null; st.shotKept=false; render();
  try{
    const r=await CAP.sample.json(photoPrompt(),{
      images:photoFile, modelTier:"default", signal:photoCtl.signal
    });
    photoBusy=false;
    applyPhotoRead(r||{});
  }catch(err){
    photoBusy=false;
    const code=(err&&err.code)||"upstream_error";
    if(code==="cancelled"){ render(); return; }
    /* This used to be written straight into #photoMsg - a node that only
       exists on the desk's photo card. The phone's snap screen has no such
       node, so a failed read wrote its reason into nothing and the screen
       just went back to the camera button, having explained itself to no
       one. It goes into state instead, and one function renders it, so no
       screen can quietly drop it again. The code is shown as well: it is
       the one thing that separates an out-of-credit key from a refused
       picture from a service that never answered. */
    st.photoRead=null; st.photoErr={code,text:photoErrCopy(code),why:(err&&err.why)||""}; render();
  }
}
function photoErrHTML(){
  const e=st.photoErr; if(!e)return "";
  const i=st.photoInfo, mb=n=>(n/1e6).toFixed(2)+"MB";
  return `<div class="tagWarn" style="border-left-color:var(--bad);background:rgba(255,66,87,.12);color:#FFAAB4;margin-top:9px">
    <b>The photo didn\u2019t read.</b> ${esc(e.text)}
    <div style="font-family:var(--mono);font-size:11.5px;opacity:.75;margin-top:6px">reason code: ${esc(e.code)}${e.why?"<br>browser said: "+esc(e.why):""}
    ${i?`<br>photo: ${esc(i.type)} &middot; ${mb(i.was)} \u2192 ${mb(i.sent)} sent${i.shrunk?"":" (NOT shrunk)"}`:""}
    <br>from: ${esc(location.origin)}<br>to: ${esc(pdServer()||"(none)")}</div></div>`;
}
function photoErrCopy(code){
  switch(code){
    case "not_granted": case "sampling_disabled": return "This tablet isn't allowed to use Claude — fill the form in by hand.";
    case "rate_limited": return "Too many reads too fast. Give it a minute.";
    case "image_rejected": return "Couldn't use that picture — try another, under 20MB.";
    case "invalid_json": return "The answer came back garbled. Try the photo again.";
    case "session_expired": return "Signed out — sign back in and try again.";
    case "refused": return "It wouldn't read that picture. Try another angle.";
    case "no_key": return "The service has no API key, or Anthropic rejected it. Check ANTHROPIC_API_KEY in Railway, and that the balance isn't empty.";
    case "bad_token": case "unauthorized": case "forbidden": return "The service refused the token. Check PAWN_TOKEN in Railway matches what you typed in.";
    case "too_big": return "That photo was too large for the service. Try a smaller one.";
    case "timeout": case "upstream_timeout": return "The service took too long and gave up. Try again - if it keeps happening, Railway may be asleep or overloaded.";
    case "server_error": return "The service hit an error reading it. Try again, then look at the Railway logs.";
    case "no_answer": return "Couldn't reach the service at all. Check the phone has signal, and that the address under Setup is right.";
    case "no_server": return "No service address saved on this device. Switch it on under Setup.";
    case "upstream_error": return "The service answered, but the read failed upstream. Usually an empty Anthropic balance or a bad key - check Railway.";
    default: return "The read failed. Fill the form in by hand — the tool works fine without it.";
  }
}
/* ---- when the lists cannot place it, go and look it up ------------------
   The photo reader is told not to shop: it names what it can see and stops
   there, which is right for a drill and useless for a charging case with one
   word on the lid. When nothing on the lists fits, this takes what was read
   off the thing - the maker, the model, the words on the label - and
   searches the web the way the counter would, then places the answer. It
   runs only on a read nothing could place, so the ordinary photo still costs
   one call. */
let photoLookBusy=false;
function photoLookPrompt(r,withImg){
  return [
"An item is on the counter at a small pawn shop in Bristol, Florida. A photograph of it has just been read, and the reader could not place it on the shop's lists.",
(withImg?"The photograph itself is attached above. Look at it as well as at what the reader made of it.":""),
"",
"WHAT THE PHOTO READER SAW:",
'what: "'+String(r.what||"").slice(0,120)+'"',
'brand: "'+String(r.brand||"").slice(0,60)+'"   model: "'+String(r.model||"").slice(0,60)+'"',
'its own note: "'+String(r.note||"").slice(0,200)+'"',
photoHintText(),
"",
"Search the web and work out exactly what this is - the maker, the product line, what the thing actually does. The words read off it are what to search for.",
"",
"Then place it, in this order:",
"1. CATALOG - if one of these is what it is, give its catId and itemId:",
catalogText(),
"",
"2. PRICE BOOK - if the catalog has nothing but one of these rows is what it is, put that row's name, spelled exactly as it appears here, in \"book\":",
PRICEBOOK.map(e=>e[0]).join("; "),
"",
"3. Neither fits - leave itemId and book empty, still give the catId of the kind of thing it is, and put in \"resale\" what a used one really sells for in the United States, in dollars: completed sales and used listings, never new retail. Name the source in \"where\".",
"",
"Reply with ONLY this JSON:",
'{"what":"plain name of the item","catId":"","itemId":"","book":"","resale":0,"where":"","brand":"","model":"","detail":"short spec text for the ticket","cond":"good","concerns":[],"confidence":"high|medium|low","note":"one sentence: what it is and how you know"}'
  ].join("\n");
}
async function photoWebLookup(r){
  if(photoLookBusy||!CAP.sample)return;
  st.photoLast=r; photoLookBusy=true; st.photoLook={busy:true}; render();
  let d=null;
  /* The picture goes with it. The first read is told not to shop, so it
     gives up the moment the lists run out - this pass gets to look at the
     thing and search at the same time, which is what the counter would do
     with their own phone.

     If that combination is what fails - a service that will carry a picture
     or a search but baulks at both, a picture that pushes the request over a
     limit, a slow read that runs out of time - it goes again on the words
     alone rather than reporting defeat. Searching on what was read off the
     thing is most of the value; the picture is the bonus. */
  const RETRY=/^(image_rejected|too_big|timeout|upstream_error|server_error|unreadable)$/;
  let err=null;
  for(const withImg of (photoFile?[true,false]:[false])){
    try{ d=await CAP.sample.json(photoLookPrompt(r,withImg),
           {search:true,images:withImg?[photoFile]:[]}); err=null; break; }
    catch(e){ err=e; if(!RETRY.test(String((e&&e.code)||"")))break; }
  }
  if(err){ const e=err;
    photoLookBusy=false;
    st.photoLook={err:photoErrCopy((e&&e.code)||"upstream_error"),
                   code:(e&&e.code)||"upstream_error",why:(e&&e.why)||""};
    keepShot(r); render(); return;
  }
  photoLookBusy=false; st.photoLook=null;
  d=d||{};
  const cat=CATALOG.find(c=>c.id===String(d.catId||""));
  const it=cat?cat.items.find(i=>i.id===String(d.itemId||"")):null;
  const row=(d.book&&bookRow(d.book))||photoBook(String(d.what||""));
  /* Anything it could place goes back through the ordinary path, so a web
     answer and a photo answer behave the same from here on. A catId with no
     item is not a placement - left alone it lands on whatever happens to be
     first in that category, which is how you sell a drone as a chainsaw. */
  if(it||row){
    applyPhotoRead(Object.assign({},d,{catId:it?cat.id:"",itemId:it?it.id:"",
      book:row?row[0]:"",web:true}));
    if(st.photoRead)st.photoRead=Object.assign({},st.photoRead,
      {note:String(st.photoRead.note||"")+" (found on the web)"});
    render(); return;
  }
  const price=Math.round(Number(d.resale));
  if(cat&&price>0){
    const id=custId(cat.id), where=String(d.where||"").slice(0,40);
    st.catId=cat.id; st.itemId=id; st.bookName=String(d.what||r.what||"").slice(0,60);
    st.overrides[id]=price; st.liq="normal"; st.specSel={}; st.editing=false; st.market=null;
    st.model=tidyModel(d.model);
    st.detail=String(d.detail||"").slice(0,80);
    st.brandTyped=String(d.brand||"").slice(0,40);
    const bh=st.brandTyped?brandLookup(st.catId,st.brandTyped):null;
    st.brand=bh?bh.tier:"mid";
    const c2=CONDITIONS.find(c=>c.id===String(d.cond||"")); if(c2)st.cond=c2.id;
    st.photoRead={webPrice:{price,where},what:String(d.what||"").slice(0,90),confidence:String(d.confidence||"").slice(0,10),
      note:"Not on any list — priced at "+money(price)+" from what used ones sell for"
        +(where?" ("+where+")":"")+". Change it if that is wrong. "+String(d.note||"").slice(0,160),
      concerns:(Array.isArray(d.concerns)?d.concerns:[]).slice(0,6).map(c=>String(c).slice(0,120))};
    persist(); render(); return;
  }
  st.photoLook={err:"I looked it up and still couldn’t pin it down.",code:"no_match"};
  keepShot(r); render();
}
/* Nobody could place it and the web did not know it either: put the picture
   on the shelf without being asked. At a yard sale you move on - the
   research happens that evening, and only if the photograph is still there. */
async function keepShot(r){
  if(st.shotKept||!photoFile||typeof shotSave!=="function")return;
  st.shotKept=true;
  try{
    await shotSave(photoFile,{what:String((r&&r.what)||""),hints:Object.assign({},st.photoHints)});
    if(typeof shotsRefresh==="function")shotsRefresh();
  }catch(e){}
}
function photoLookHTML(){
  const l=st.photoLook; if(!l)return "";
  if(l.busy)return `<div class="tagWarn" style="background:rgba(0,217,255,.10);color:var(--ink-2)">
    <b style="color:var(--accent-2)">Looking it up on the web…</b> Searching on what was read off it — this one takes 10 to 40 seconds.</div>`;
  /* The same rule the failed read follows: say which failure it was. "It
     didn’t work" sends us both guessing; a code says whether the service
     never answered, the key is dry, or the web simply had nothing. */
  return `<div class="tagWarn" style="background:rgba(255,201,143,.12)"><b>The web didn’t settle it.</b> ${esc(l.err||"")}
    <div style="font-family:var(--mono);font-size:11.5px;opacity:.75;margin-top:6px">reason code: ${esc(l.code||"unknown")}${l.why?"<br>browser said: "+esc(l.why):""}<br>build ${esc(BUILD||"unknown")}</div>
    ${st.photoLast?`<button class="ghostBtn" id="lookAgain" style="padding:6px 12px;font-size:12px;margin-left:6px">Search the web again</button>`:""}</div>`;
}
function wireLook(){
  const b=document.getElementById("lookAgain");
  if(b)b.onclick=()=>{ if(st.photoLast)photoWebLookup(st.photoLast); };
}
/* A photograph that landed on a row is not a price yet. The row is a class
   of thing - "Wireless earbuds" covers AirPods and a $20 pair alike - and the
   read usually knows the exact make and model. So having placed it, go and
   find what that make and model actually sells for, without being asked: the
   whole point of a photograph is not having to press anything. The phone has
   done this since the snap screen was built; the desk was still waiting to be
   told, which made the built-in list look like the tool's final answer when
   it was only its first. */
let photoChase=false;
function autoPriceAfterPhoto(){
  if(photoChase||findBusy||!CAP.sample||!st.picked)return;
  const x=calcItem(); if(x.checked)return;
  photoChase=true;
  /* A deadline, because this one nobody asked for. Each pass is allowed two
     minutes on its own, so a search that hangs used to leave "the live price
     lands in a moment" on screen for four - which reads as broken, and is.
     A minute, then the built-in number stands and says so. */
  setTimeout(async()=>{
    const ctl=new AbortController();
    const t=setTimeout(()=>ctl.abort(),60000);
    try{ await priceFind(ctl.signal,true); }catch(e){}
    clearTimeout(t);
    photoChase=false;
    try{ render(); }catch(e){}
  },0);
}
function applyPhotoRead(r){
  let cat=CATALOG.find(c=>c.id===String(r.catId||""));
  /* nothing in the catalog fits — try the price book on what it says the thing is */
  if(!cat&&(r.what||r.book)){
    /* There used to be a second try here on the last two words of the read,
       from when matching needed every word to appear in the row name. With
       the words scored it is no longer a rescue, it is a trap: the last two
       words of "Logitech wireless optical mouse (computer peripheral)" are
       "computer peripheral", and "computer" is a synonym the desktop PC row
       owns - so a mouse was priced as a $110 gaming PC. The whole sentence,
       or nothing. */
    const hit=(r.book&&bookRow(r.book))||photoBook(String(r.what||""));
    if(hit){
      st.catId=hit[2]; st.itemId=custId(hit[2]); st.bookName=hit[0]; st.overrides[custId(hit[2])]=bookVal(hit);
      st.liq=hit[3]; st.specSel={}; st.editing=false;
      cat=CATALOG.find(c=>c.id===hit[2]);
      st.model=tidyModel(r.model);
      st.detail=String(r.detail||"").slice(0,80);
      st.brandTyped=String(r.brand||"").slice(0,40);
      const h2=st.brandTyped?brandLookup(st.catId,st.brandTyped):null;
      st.brand=h2?h2.tier:"mid";
      const c2=CONDITIONS.find(c=>c.id===String(r.cond||""));
      if(c2)st.cond=c2.id;
      st.photoRead={what:String(r.what||"").slice(0,90),confidence:String(r.confidence||"").slice(0,10),
        note:"Not on the main lists — priced from the book as "+hit[0]+". "+String(r.note||"").slice(0,160),
        concerns:(Array.isArray(r.concerns)?r.concerns:[]).slice(0,6).map(c=>String(c).slice(0,120))};
      persist(); render(); autoPriceAfterPhoto(); return;
    }
  }
  /* A read that came back fine but matched nothing used to fall through
     here: no category, so no itemId, so nothing counted as picked, so the
     screen quietly returned to the camera button having said nothing at all.
     A successful call that produces silence is worse than a failure - at
     least a failure explains itself. Say what was read and let the counter
     place it. */
  if(!cat){
    const what=String(r.what||"").trim();
    st.photoRead={what:what.slice(0,90),confidence:String(r.confidence||"").slice(0,10),
      unplaced:true,
      note:String(r.note||"").slice(0,160),
      concerns:(Array.isArray(r.concerns)?r.concerns:[]).slice(0,6).map(c=>String(c).slice(0,120))};
    /* Put what it read into the search box so one tap finishes the job. */
    if(what)st.omniQ=what;
    render();
    /* ...and meanwhile go and look it up, which is what the counter would do
       next anyway. Not on a web answer that already failed to place, or it
       would search itself in a circle. */
    if(what&&!r.web&&CAP.sample)photoWebLookup(r);
    return;
  }
  {
    st.catId=cat.id;
    const it=cat.items.find(i=>i.id===String(r.itemId||""));
    st.itemId = it ? it.id : cat.items[0].id;
    st.bookName=""; st.liq=null; st.specSel={};
  }
  st.model = tidyModel(r.model);
  st.detail = String(r.detail||"").slice(0,80);
  st.brandTyped = String(r.brand||"").slice(0,40);
  st.complete = true;
  if(st.brandTyped){
    const hit=brandLookup(st.catId,st.brandTyped);
    st.brand = hit ? hit.tier : "mid";
  } else st.brand="mid";
  const cond=CONDITIONS.find(c=>c.id===String(r.cond||""));
  if(cond)st.cond=cond.id;
  /* map the spec answers onto this item's pickers, by exact option text */
  const groups=SPEC_CHOICES[st.itemId];
  if(groups&&Array.isArray(r.specs)){
    r.specs.forEach(sp=>{
      const lbl=String((sp&&sp.label)||"").trim().toLowerCase();
      const ch=String((sp&&sp.choice)||"").trim().toLowerCase();
      groups.forEach((g,gi)=>{
        if(g.label.trim().toLowerCase()!==lbl)return;
        const oi=g.options.findIndex(o=>o.t.trim().toLowerCase()===ch);
        if(oi>=0)st.specSel[st.itemId+":"+gi]=oi;
      });
    });
  }
  st.photoRead={
    what:String(r.what||"").slice(0,90),
    confidence:String(r.confidence||"").slice(0,10),
    note:String(r.note||"").slice(0,220),
    concerns:(Array.isArray(r.concerns)?r.concerns:[]).slice(0,6).map(c=>String(c).slice(0,120))
  };
  st.editing=false;
  render();
  autoPriceAfterPhoto();
}
function wirePhoto(){
  const inp=document.getElementById("photoIn");
  if(inp)inp.onchange=()=>{ const f=(inp.files&&inp.files[0])||null; inp.value=""; if(f)setPhoto(f); };
  const cam=document.getElementById("photoCam");
  if(cam)cam.onchange=()=>{ const f=(cam.files&&cam.files[0])||null; cam.value=""; if(f)setPhoto(f); };
  const live=document.getElementById("camLive"); if(live)live.onclick=openCam;
  const pc=document.getElementById("photoCard");
  if(pc){ pc.onpointerdown=()=>{ pasteTo="photo"; };
    pc.ondragover=e=>{ e.preventDefault(); };
    pc.ondrop=e=>{ e.preventDefault(); const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0]; if(f&&/^image\//.test(f.type))setPhoto(f); }; }
  const prev=document.getElementById("photoPrev");
  if(prev&&photoFile){ try{ prev.src=URL.createObjectURL(photoFile); }catch(e){} }
  const go=document.getElementById("photoGo");
  if(go)go.onclick=runPhotoRead;
  wireLook();
  const stop=document.getElementById("photoStop");
  if(stop)stop.onclick=()=>{ if(photoCtl)photoCtl.abort(); };
}

/* ---------------- logging a deal ---------------- */
function logCardInner(x){
  if(!CAP.db){
    return `<div class="card"><span class="label">Deal log</span>
      <div class="cardHint">Not available on this device. Every deal you log builds the shop's own price book, which beats any outside comp inside a year.</div></div>`;
  }
  if(!x.checked)return `<div class="card"><span class="label">Deal log</span>
      <div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">Check the market first (step 4), so the log only keeps real numbers.</div></div>`;
  const s=soldStats(itemKey());
  /* The ticket number is the one thing that ties this record to the pawn
     system, and it is the only number on a ticket that is not about the
     customer - no name, no address, no ID. Without it, matching a row here
     to the item in Bravo means going by the date and the description. */
  return `<div class="card"><span class="label">Deal log</span>
    <div class="row2" style="margin-bottom:9px"><input id="logTicket" class="numIn" type="text" inputmode="numeric"
      autocomplete="off" placeholder="Ticket # (optional)" value="${esc(st.ticket||"")}"
      style="flex:1;min-width:0;font-family:var(--mono);font-size:14px"></div>
    <button id="logDeal" class="brassBtn" title="Saves the item, your estimate, the offer and the ticket number. Mark it Sold later and the desk prices the next one from what it actually brought." style="width:100%;padding:11px 0">Log this deal</button>
    <div class="cardHint" id="logMsg">Records the item, your estimate, the offer and the ticket number &mdash; nothing else off the ticket. No name, no address, no ID. Mark it sold later and it teaches the next appraisal.${s?` You've sold ${s.n} of these.`:""}</div>
  </div>`;
}
function logCardHTML(x){ return `<div id="logCard">${logCardInner(x)}</div>`; }
async function saveDeal(){
  if(!CAP.db)return;
  const x=calcItem();
  const msg=document.getElementById("logMsg");
  const specTxt=(SPEC_CHOICES[st.itemId]||[]).map((g,gi)=>{
    const o=g.options[st.specSel[st.itemId+":"+gi]??specBase(g)]||g.options[specBase(g)];
    return g.label+": "+o.t;
  }).join(" · ");
  try{
    if(msg)msg.textContent="Saving…";
    await CAP.db.collection("deals").add({
      ts: Date.now(), day: new Date().toISOString().slice(0,10),
      catId: st.catId, catLabel: x.cat.label,
      itemId: x.item.id, key: itemKey(), itemName: displayName(x),
      brand: st.brandTyped||"", tier: st.brand, model: st.model||"", detail: st.detail||"",
      specs: specTxt, cond: st.cond, complete: !!st.complete, liq: x.liqId,
      market: x.market?x.market.kind:"", marketMid: x.market?x.market.mid:null,
      resale: Math.round(x.resale), ltv: x.ltv, loan: x.target, charge: Math.round(x.charge),
      ticket: String((document.getElementById("logTicket")||{}).value||"").trim().slice(0,24),
      status: "open", soldPrice: null, soldTs: null
    });
    if(msg)msg.textContent="Logged. It sits under Not settled yet in the Deal log until you mark it Sold or Redeemed.";
  }catch(err){
    const code=(err&&err.code)||"unavailable";
    if(msg)msg.innerHTML=`<span style="color:var(--warn)">${esc(code==="quota_exceeded"?"The log is full — clear out old deals.":"Couldn't save that one. Try again.")}</span>`;
  }
}
function wireLogButton(){
  const tk=document.getElementById("logTicket");
  if(tk)tk.oninput=()=>{ st.ticket=tk.value; };
  const b=document.getElementById("logDeal");
  if(b)b.onclick=saveDeal;
}

/* ---------------- deal log tab ---------------- */
function renderLog(){
  if(!CAP.db){
    return `<div class="narrow"><div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">The deal log isn't available on this device. Open the page from the Claude app on the counter tablet.</p></div></div>`;
  }
  if(!dealsReady){
    return `<div class="narrow"><div class="card" style="text-align:center;color:var(--ink-3);padding:26px">Loading the log…</div></div>`;
  }
  if(!DEALS.length){
    return `<div class="narrow"><div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Nothing logged yet. Price something on the first tab and hit <b style="color:var(--ink)">Log this deal</b>. After a few months this list is worth more than any outside price guide &mdash; it is the only record of what things actually bring in Bristol.</p></div></div>`;
  }
  const open=DEALS.filter(d=>d.status==="open"), done=DEALS.filter(d=>d.status!=="open");
  const row=d=>{
    const title=[d.brand,d.model,d.itemName].filter(Boolean).join(" ");
    return `<div class="card" style="padding:12px">
      <div class="valRow" style="align-items:flex-start">
        <div style="min-width:0">
          <div style="font-weight:700;font-size:14px">${esc(title)}</div>
          <div class="feedTag" style="margin-top:3px">${esc(d.day||"")}${d.ticket?` &middot; <b style="color:var(--ink-2)">#${esc(d.ticket)}</b>`:""} &middot; ${esc(d.catLabel||"")}${d.specs?" &middot; "+esc(d.specs):""}</div>
          <div class="feedTag" style="margin-top:2px">Est. resale ${money(d.resale||0)} &middot; lent ${money(d.loan||0)}${d.status==="sold"&&d.soldPrice?` &middot; <b style="color:var(--accent)">sold ${money(d.soldPrice)}</b>`:""}${d.status==="redeemed"?` &middot; <b style="color:var(--accent-2)">redeemed</b>`:""}</div>
        </div>
        <button class="ghostBtn" style="padding:6px 12px;font-size:11.5px" data-del="${esc(d._id)}">Delete</button>
      </div>
      ${d.status==="open"?`<div class="row2" style="margin-top:9px;gap:7px;flex-wrap:wrap">
        <input class="numIn" type="number" inputmode="decimal" placeholder="Sold for $" data-price="${esc(d._id)}" style="flex:1;min-width:110px;font-size:15px;padding:9px 11px">
        <button class="brassBtn" style="padding:9px 15px" data-sold="${esc(d._id)}">Sold</button>
        <button class="ghostBtn" style="padding:9px 15px" data-red="${esc(d._id)}">Redeemed</button>
      </div>`:""}
    </div>`;
  };
  return `<div class="narrow">
    <div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Your own sold history. Item facts only &mdash; no names, no ID numbers, nothing off the state form. That record lives in the pawn system, not here.</p></div>
    ${open.length?`<div class="card" style="padding:12px 15px"><span class="label" style="margin:0">Not settled yet &mdash; ${open.length}</span>
      <div class="cardHint" style="margin-top:4px;font-size:12.5px">Logged, and nothing has happened since. On a pawn that means your money is still out; on a buy it means the item has not sold. Close it with <b style="color:var(--ink)">Sold</b> or <b style="color:var(--ink)">Redeemed</b> and it starts teaching the next appraisal.</div></div>${open.map(row).join("")}`:""}
    ${done.length?`<div class="card" style="padding:12px 15px"><span class="label" style="margin:0">Settled &mdash; ${done.length}</span>
      <div class="cardHint" style="margin-top:4px;font-size:12.5px">Sold, or redeemed by the customer. These are what the desk prices from next time.</div></div>${done.map(row).join("")}`:""}
  </div>`;
}
function wireLog(){
  const v=document.getElementById("view");
  if(!v||!CAP.db)return;
  v.querySelectorAll("[data-sold]").forEach(b=>b.onclick=async()=>{
    const id=b.dataset.sold;
    const inp=v.querySelector('[data-price="'+id+'"]');
    const p=parseFloat(inp&&inp.value);
    if(!(p>0)){ if(inp)inp.focus(); return; }
    b.disabled=true;
    try{ await CAP.db.doc("deals/"+id).update({status:"sold",soldPrice:p,soldTs:Date.now()}); }
    catch(e){ b.disabled=false; }
  });
  v.querySelectorAll("[data-red]").forEach(b=>b.onclick=async()=>{
    b.disabled=true;
    try{ await CAP.db.doc("deals/"+b.dataset.red).update({status:"redeemed",soldTs:Date.now()}); }
    catch(e){ b.disabled=false; }
  });
  v.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{
    b.disabled=true;
    try{ await CAP.db.doc("deals/"+b.dataset.del).delete(); }
    catch(e){ b.disabled=false; }
  });
}


/* ================= THE SEARCH BAR =================
   Type anything: "stihl 271", "remington 870 12 gauge", "kayak", "14k ring".
   It pulls the brand, the model and the specs out of what was typed, offers
   the closest lines from the lists and the price book, and one tap fills
   steps 1-3. It never sets a price by itself. */
st.omniQ=""; st.omniHl=0; st.omniDone=""; st.compRead=null;

const ITEM_SYN={
 g1:"pump shotgun scattergun gun firearm",g2:"semi auto semiauto autoloader shotgun gun firearm",
 g3:"bolt rifle deer rifle hunting rifle gun firearm",g4:"lever action rifle 30-30 3030 cowboy gun firearm",
 g5:"ar ar15 m4 carbine black rifle msr gun firearm",g6:"22 rimfire 22lr squirrel rifle gun firearm",
 g7:"pistol handgun semi auto sidearm carry gun firearm",g8:"revolver wheelgun six shooter handgun gun firearm",
 g9:"muzzleloader muzzle loader black powder blackpowder inline gun firearm",
 g10:"semi auto semiauto autoloading rifle woodsmaster 7400 750 742 four bar browning mini-14 mini14 mini-30 sks m1a garand hunting rifle gun firearm",
 p1:"chainsaw chain saw",p2:"string trimmer weed eater weedeater weed wacker weedwacker whacker",
 p3:"backpack blower leaf blower",p4:"push mower lawn mower lawnmower",
 p5:"riding mower rider lawn tractor riding lawnmower",p6:"pressure washer power washer",p7:"generator genny",
 t1:"cordless drill driver impact driver kit",t2:"impact wrench impact gun",t3:"angle grinder cut off",
 t4:"pancake air compressor",t5:"air compressor upright shop compressor",t6:"mig welder wire feed flux core",
 t7:"rolling tool box toolbox tool chest roll cabinet",t8:"framing nailer nail gun",
 h1:"rifle scope optic",h2:"binoculars binos",h3:"rangefinder range finder",
 h4:"trail camera trail cam game camera deer camera",h5:"compound bow archery",h6:"crossbow cross bow",
 h7:"rod reel combo fishing pole fishing rod",h8:"trolling motor",h9:"outboard boat motor",
 e1:"tv television smart flat screen",e2:"laptop notebook computer chromebook",e3:"tablet",
 e4:"smartphone phone cell cellphone android",e5:"game console gaming playstation xbox",
 e6:"bluetooth speaker",e7:"car audio amp sub subwoofer",
 j1:"rolex omega cartier submariner datejust daytona seamaster speedmaster tudor breitling luxury watch wristwatch",
 j2:"seiko citizen tissot tag heuer movado bulova fossil timex invicta watch watches wristwatch chronograph dive quartz automatic eco-drive ecodrive kinetic",
 j3:"tiffany david yurman pandora james avery van cleef bulgari designer jewelry necklace bracelet cuff pendant earrings ring charm",
 j4:"diamond engagement bridal wedding solitaire halo gia certified stone ring",
 a1:"range oven stove cooktop cook top electric range gas range appliance kitchen",
 a2:"refrigerator fridge icebox freezer side by side french door appliance kitchen",
 a3:"washer washing machine clothes washer front load top load appliance laundry",
 a4:"dryer clothes dryer gas dryer electric dryer appliance laundry",
 a5:"washer dryer pair set matching laundry pair appliance laundry",
 a6:"chest freezer deep freeze deep freezer upright freezer appliance",
 a7:"window air conditioner ac unit window unit window ac air conditioner appliance",
 a8:"microwave over the range countertop appliance kitchen",
 a9:"sewing machine serger singer brother embroidery machine",
 a10:"vacuum cleaner vac shop vac upright vacuum dyson bissell hoover",
 f1:"treadmill running machine walking pad",
 f2:"exercise bike spin bike stationary bike peloton recumbent",
 f3:"elliptical cross trainer",
 f4:"weight bench workout bench incline bench press bench",
 f5:"dumbbells dumbells weights weight set barbell plates kettlebell free weights",
 f6:"home gym power rack squat rack smith machine cage universal",
 f7:"golf clubs golf set irons driver putter callaway taylormade ping",
 c1:"sports card graded card slab psa bgs sgc rookie baseball football basketball topps bowman panini",
 c2:"card lot pokemon pokémon cards magic gathering yugioh trading cards collection binder",
 c3:"comic books comics long box marvel dc golden age silver age cgc",
 c4:"coin collection numismatic morgan peace wheat penny proof set mint set silver dollar bullion",
 c5:"zippo lighter collectible lighter ronson dupont",
 m1:"acoustic guitar",m2:"electric guitar",m3:"amplifier guitar amp",
 r1:"utility trailer",r2:"atv four wheeler 4 wheeler fourwheeler quad"};
const BOOK_SYN={"Reciprocating saw":"sawzall saws all recip saw",
 "Scooter / moped":"scooter moped vespa 50cc ruckus",
 "Pop-up camper":"camper pop up popup travel trailer rv teardrop",
 "Boat anchor & rode":"anchor rode boat anchor",
 "Flat-top griddle \u2014 Blackstone class":"blackstone griddle flat top flattop grill",
 "Pellet grill / smoker":"traeger pit boss pellet smoker bbq barbeque barbecue",
 "Offset smoker":"smoker bbq barbeque barbecue stick burner",
 "Gas grill":"bbq barbeque barbecue propane grill weber char broil",
 "Charcoal grill / kettle":"weber kettle charcoal bbq barbeque barbecue",
 "Propane tank \u2014 20lb, full":"propane tank bottle lp gas",
 "Hard cooler \u2014 Yeti class":"yeti cooler rtic igloo coleman ice chest",
 "Soft cooler / tote":"soft cooler bag tote",
 "Pressure cooker \u2014 Instant Pot class":"instant pot instapot pressure cooker crock pot crockpot slow cooker ninja foodi",
 "Air fryer":"airfryer ninja air fryer",
 "Box fan / tower fan":"box fan tower fan pedestal fan floor fan",
 "TV stand / entertainment center":"tv stand entertainment center media console",
 "Dining table & chairs":"dining table kitchen table dinette table and chairs",
 "Dresser / chest of drawers":"dresser chest of drawers bureau armoire",
 "Sofa / couch":"sofa couch loveseat sectional futon",
 "Recliner":"recliner lazy boy lazyboy la-z-boy armchair easy chair",
 "Gun cabinet \u2014 wood":"gun cabinet gun case wood cabinet rack",
 "Post hole digger \u2014 gas":"post hole digger posthole auger fence post",
 "Earth auger \u2014 one man":"auger earth drill ice auger",
 "Sprayer tank \u2014 25 to 55 gal":"sprayer tank boom sprayer atv sprayer spot sprayer",
 "Fence charger":"fence charger electric fence fencer energizer",
 "Livestock water trough":"trough stock tank water tank cattle",
 "Chicken coop":"chicken coop hen house rabbit hutch",
 "Paint sprayer \u2014 airless":"paint sprayer airless graco wagner titan",
 "OBD scan tool":"obd obd2 scanner scan tool code reader diagnostic autel",
 "Mechanic's creeper":"creeper mechanic crawler",
 "Battery charger / jump box":"battery charger jump box jump starter booster trickle charger",
 "Transfer pump \u2014 gas":"transfer pump water pump trash pump utility pump",
 "Grease gun":"grease gun lube gun",
 "Wet tile saw":"wet saw tile saw wet tile",
 "Drywall lift":"drywall lift panel lift sheetrock",
 "Scaffolding \u2014 section":"scaffolding scaffold baker frame",
 "Laser level":"laser level rotary laser self leveling",
 "Ring / smart doorbell":"ring doorbell smart doorbell video doorbell nest hello blink",
 "Dash camera":"dash cam dashcam backup camera reverse camera",
 "Security camera system":"security camera nvr dvr surveillance cctv blink arlo wyze",
 "Wifi router / modem":"wifi router modem netgear eero orbi mesh internet",
 "Printer \u2014 all in one":"printer all in one scanner copier inkjet laser hp epson brother canon",
 "Record player / turntable set":"record player turntable vinyl victrola crosley",
 "Karaoke machine":"karaoke singing machine",
 "E-reader \u2014 Kindle class":"kindle ereader e reader nook paperwhite",
 "Power wheels / ride-on toy":"power wheels ride on toy kids electric car battery car",
 "Bowling ball":"bowling ball",
 "Paddle board \u2014 SUP":"paddle board paddleboard sup stand up paddle",
 "Life jackets \u2014 set":"life jacket life vest pfd float coat",
 "Camp chairs \u2014 pair":"camp chair folding chair lawn chair",
 "Tent \u2014 4 to 6 person":"tent camping tent pop up tent canopy",
 "Sleeping bag":"sleeping bag bedroll",
 "Camp stove":"camp stove coleman stove propane stove backpacking stove",
 "Dishwasher":"dishwasher",
 "Garbage disposal":"garbage disposal insinkerator disposer",
 "Portable air conditioner":"portable ac portable air conditioner rolling ac",
 "Dehumidifier":"dehumidifier",
 "Space heater":"space heater electric heater kerosene heater mr heater",
 "Ukulele":"ukulele uke",
 "Cello":"cello",
 "French horn":"french horn",
 "Trombone":"trombone",
 "Clarinet":"clarinet",
 "Flute":"flute piccolo",
 "Surfboard":"surfboard surf board",
 "Skateboard":"skateboard skate board longboard",
 "Wireless earbuds":"airpods air pods earbuds buds earphones galaxy buds",
 /* The maker is in here on purpose: the music book already carries a
    "Keyboard - 61 key", and a bare "keyboard" reaches that one first because
    its name is a single word. "Logitech" is what tells the two apart. */
 "Wireless mouse \u2014 computer":"mouse mice trackball logitech computer",
 "Computer keyboard":"keyboard mechanical keys logitech","DSLR / mirrorless camera":"dslr slr mirrorless canon nikon sony rebel eos t6 t7 d3500 alpha","Band saw \u2014 benchtop":"bandsaw band saw","Audio mixer \u2014 PA board":"mixer mixing board soundboard sound board zed behringer yamaha mackie","TIG / stick welder":"tig stick arc welder weldpro everlast","Zero-turn mower":"zero turn zturn ztr","Golf cart":"golf cart","Kayak — sit-on-top":"kayak yak",
 "Jon boat — 12ft, no motor":"jon boat johnboat","UTV / side-by-side":"utv side by side sxs","Dirt bike":"motorcycle",
 "E-bike":"ebike electric bike","Camera drone":"drone","Smartwatch \u2014 Apple / Galaxy":"smartwatch smart watch apple watch galaxy watch fitbit","Handheld game console":"handheld",
 "Gaming desktop PC":"desktop pc computer tower","Air rifle / pellet gun":"bb gun pellet air rifle",
 "AK-pattern rifle":"ak ak47 ak-47","Deer feeder — barrel":"feeder","Cellular game camera":"cellular trail cam cell cam",
 "Fish finder":"depth finder sonar","Stand mixer — KitchenAid class":"kitchenaid mixer","Log splitter":"wood splitter",
 "Truck rims & tires — set":"wheels rims tires","Two-way radios — pair":"walkie talkie radios",
 "Wristwatch — quartz, name brand":"watch wristwatch","Inverter generator — 2kW":"inverter generator genny",
 "Gun safe":"safe","Climbing tree stand":"treestand tree stand climber","Ladder stand":"treestand tree stand",
 "Monitor — 27in":"monitor","Extension ladder":"ladder","Jack stands — pair":"jackstands"};

const omniNorm=s=>String(s||"").toLowerCase().replace(/[—–’']/g," ").replace(/[^a-z0-9.&\/+\- ]+/g," ").replace(/\s+/g," ").trim();
const omniWords=s=>Array.from(new Set(omniNorm(s).replace(/[\/\-]/g," ").split(" ").map(w=>w.replace(/^\.+|\.+$/g,"")).filter(w=>w&&(w.length>1||/\d/.test(w)))));
const omniEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const pretty=s=>String(s||"").trim().split(/\s+/).filter(Boolean).map(w=>/[\d&]/.test(w)||w.length<=2?w.toUpperCase():w.charAt(0).toUpperCase()+w.slice(1)).join(" ");

const OMNI_IDX=(function(){
  const out=[];
  CATALOG.forEach(c=>c.items.forEach(it=>out.push({kind:"item",catId:c.id,itemId:it.id,name:it.name,value:it.value,liq:it.liq,
    words:omniWords(it.name+" "+(ITEM_SYN[it.id]||""))})));
  PRICEBOOK.forEach(e=>out.push({kind:"book",catId:e[2],name:e[0],value:e[1],liq:e[3],
    words:omniWords(e[0]+" "+(BOOK_SYN[e[0]]||""))}));
  return out;
})();
function findEntry(ref){
  if(!ref)return null;
  return /^[a-z]\d$/.test(ref) ? OMNI_IDX.find(e=>e.kind==="item"&&e.itemId===ref)||null
                               : OMNI_IDX.find(e=>e.kind==="book"&&e.name===ref)||null;
}

/* brands: every name in the brand book, the per-item brand lists, and a few
   the book doesn't tier (four-wheelers, golf carts, fish finders) */
const EXTRA_BRANDS=[
 ["Polaris","rolling",["r2","UTV / side-by-side"]],["Can-Am","rolling",["r2","UTV / side-by-side"]],
 ["Arctic Cat","rolling",["r2","UTV / side-by-side"]],["Kawasaki","rolling",["r2","UTV / side-by-side","Dirt bike"]],
 ["Honda","rolling",["r2","UTV / side-by-side","Dirt bike"]],["Yamaha","rolling",["r2","UTV / side-by-side","Dirt bike","Golf cart"]],
 ["Suzuki","rolling",["r2","Dirt bike"]],["KTM","rolling",["Dirt bike"]],["Club Car","rolling",["Golf cart"]],
 ["EZGO","rolling",["Golf cart"]],["Humminbird","hunt",["Fish finder"]],["Lowrance","hunt",["Fish finder"]],
 ["DJI","elec",["Camera drone"]],["GoPro","elec",["GoPro / action camera"]],["Thompson Center","guns",["g9"]],
 ["Howa","guns",["g3"]],["Mossberg","guns",null]];
const BRAND_ALIAS=[[/\bsmith\s*(and|&|n)\s*wesson\b/,"smith & wesson"],[/\bsig\b(?!\s*sauer)/,"sig sauer"],
 [/\bh\s*&\s*k\b/,"heckler & koch"],[/\b(jd|deere)\b/,"john deere"],[/\bez\s*-?\s*go\b|\be\s*-\s*z\s*-\s*go\b/,"ezgo"],
 [/\bcan\s*am\b/,"can-am"],[/\bhi\s*point\b/,"hi-point"],[/\bkel\s*tec\b/,"kel-tec"],[/\bharbor\s*freight\b/,"harbor freight"]];
const BRAND_IDX=(function(){
  const m=new Map();
  const add=(name,cat,tier,items)=>{
    if(/^no name$/i.test(name))return;
    const k=name.toLowerCase(); if(!m.has(k))m.set(k,{name,cats:[]});
    const e=m.get(k); let c=e.cats.find(x=>x.cat===cat);
    if(!c){ e.cats.push({cat,tier,items:items?items.slice():null}); return; }
    if(c.items&&items)items.forEach(i=>{if(c.items.indexOf(i)<0)c.items.push(i);}); else c.items=null;
  };
  Object.keys(BRANDBOOK).forEach(cat=>["hi","mid","lo"].forEach(t=>BRANDBOOK[cat][t].forEach(b=>add(b,cat,t,null))));
  Object.keys(ITEM_OVERRIDES).forEach(id=>{const ov=ITEM_OVERRIDES[id]; if(!ov.brands)return;
    const cat=CATALOG.find(c=>c.items.some(i=>i.id===id)); if(!cat)return;
    ["hi","mid","lo"].forEach(t=>(ov.brands[t]||[]).forEach(b=>{ if(!m.has(b.toLowerCase())||!m.get(b.toLowerCase()).cats.some(c=>c.cat===cat.id&&!c.items)) add(b,cat.id,t,[id]); }));});
  EXTRA_BRANDS.forEach(([n,cat,items])=>add(n,cat,"mid",items));
  return Array.from(m.values()).map(e=>Object.assign(e,{re:new RegExp("(^|[^a-z0-9])"+omniEsc(e.name.toLowerCase())+"(?=$|[^a-z0-9])")}))
    .sort((a,b)=>b.name.length-a.name.length);
})();
/* when a brand is typed alone, these items go to the top of its list */
const BRAND_FIRST={"weed eater":["p2"],"glock":["g7"],"sig sauer":["g7"],"canik":["g7"],"kimber":["g7"],"staccato":["g7"],"hi-point":["g7","g5"],
 "sccy":["g7"],"charter arms":["g8"],"benelli":["g2","g1"],"mossberg":["g1","g2"],"henry":["g4","g6"],"marlin":["g4","g6"],"cva":["g9"],
 "traditions":["g9"],"tikka":["g3"],"bergara":["g3"],"minn kota":["h8"],"mathews":["h5"],"hoyt":["h5"],"ravin":["h6"],"tenpoint":["h6"],
 "leupold":["h1"],"nightforce":["h1"],"trijicon":["h1","Red dot sight"],"aimpoint":["Red dot sight"],"eotech":["Red dot sight"],
 "holosun":["Red dot sight"],"moultrie":["h4"],"tactacam":["h4"],"spypoint":["h4"],"reconyx":["h4"],"generac":["p7"],"champion":["p7"],
 "predator":["p7"],"exmark":["Zero-turn mower","p5"],"scag":["Zero-turn mower"],"bad boy":["Zero-turn mower"],"gravely":["Zero-turn mower"],
 "apple":["e4","e3","e2"],"nintendo":["e5","Handheld game console"],"xbox":["e5"],"gibson":["m2","m1"],"martin":["m1"],"taylor":["m1"],
 "fender":["m2","m3","Bass guitar"],"squier":["m2","Bass guitar"],"epiphone":["m2"],"marshall":["m3"],"mesa boogie":["m3"],"orange":["m3"]};
function brandEntry(name){ const k=String(name||"").toLowerCase(); return BRAND_IDX.find(b=>b.name.toLowerCase()===k)||null; }
function findBrand(text){
  let best=null,pos=1e9,hit=null;
  for(const b of BRAND_IDX){ const mm=b.re.exec(text); if(mm&&mm.index<pos){best=b;pos=mm.index;hit=mm;} }
  return best?{b:best,m:hit}:null;
}

/* THE MODEL BOOK — the models that walk in most. A hit fills brand, model and
   item in one go. "loose" = a bare number, ignored when another brand was typed. */
const MB=(re,brand,item,o)=>Object.assign({re,brand,item},o||{});
const pick=(m,map,dflt)=>{ const s=m[0]; for(const k in map){ if(new RegExp(k).test(s))return map[k]; } return dflt; };
const MODELBOOK=[
 /* shotguns */
 MB(/\b(mossberg\s*)?maverick\s*88\b/,"Mossberg","g1"),
 MB(/\bmossberg\s*(500|590|835|535|930|940|sa\s*-?\s*(20|28|410))\w*/,"Mossberg",m=>/9[34]0|sa/.test(m[1])?"g2":"g1"),
 MB(/\b(remington\s*)?870(\s*(express|wingmaster|tactical|marine|super\s*mag|fieldmaster))?\b/,"Remington","g1"),
 MB(/\bwingmaster\b/,"Remington","g1"),
 MB(/\b(remington\s*)?(1100|11\s*-\s*87|1187)\b/,"Remington","g2"),
 MB(/\bremington\s*(v3|versa\s*max)\b/,"Remington","g2"),
 MB(/\bbenelli\s*(m2|m4|sbe(\s*(ii|iii|3|2))?|super\s*black\s*eagle(\s*\w+)?|montefeltro|ethos|vinci|legacy)\b/,"Benelli","g2"),
 MB(/\b(benelli\s*)?(super\s*)?nova\b/,"Benelli","g1"),
 MB(/\b(beretta\s*)?a(300|400)(\s*(outlander|xtreme|xplor|ultima))?\b/,"Beretta","g2"),
 MB(/\b(browning\s*)?(a5|auto\s*-?\s*5|maxus|silver\s*hunter)\b/,"Browning","g2"),
 MB(/\b(browning\s*)?bps\b/,"Browning","g1"),
 MB(/\b(winchester\s*)?sx[34]\b/,"Winchester","g2"),
 MB(/\b(winchester\s*)?sxp\b/,"Winchester","g1"),
 MB(/\bstoeger\s*(m3000|m3500|p3000|p350)\b/,"Stoeger",m=>/^m/.test(m[1])?"g2":"g1"),
 MB(/\b(kel-tec\s*)?ksg\b/,"Kel-Tec","g1"),
 /* rifles */
 MB(/\b(remington|model)\s*700(\s*(adl|bdl|sps|cdl|vtr|5r))?\b/,"Remington","g3"),
 MB(/\b(winchester\s*(model\s*)?70|model\s*70)\b/,"Winchester","g3",{label:"Model 70"}),
 MB(/\bsavage\s*(110|111|112|116|10|11|12|16|axis(\s*ii)?|arrow)\b|\baxis\s*ii\b/,"Savage","g3"),
 MB(/\bruger\s*(american(\s*(rifle|predator|ranch|hunter|compact|gen\s*2))?|m77|hawkeye|precision\s*rifle|rpr)\b/,"Ruger","g3"),
 MB(/\b(tikka\s*)?t3x?(\s*(lite|hunter|ctr|superlite))?\b/,"Tikka","g3"),
 MB(/\b(browning\s*)?x\s*-?\s*bolt\b/,"Browning","g3",{label:"X-Bolt"}),
 MB(/\b(browning\s*)?blr\b/,"Browning","g4"),
 MB(/\b(weatherby\s*)?(vanguard|mark\s*v)\b/,"Weatherby","g3"),
 MB(/\b(bergara\s*)?b\s*-?\s*14\b/,"Bergara","g3",{label:"B-14"}),
 MB(/\bhowa\s*1500\b/,"Howa","g3"),
 MB(/\bmarlin\s*(336|1894|1895|444)\w*\b/,"Marlin","g4"),MB(/\b(336|1894|1895)\w*\b/,"Marlin","g4",{loose:true}),
 MB(/\bmarlin\s*(model\s*)?(60|795)\b/,"Marlin","g6"),
 MB(/\b(winchester\s*(model\s*)?94|model\s*94)\b/,"Winchester","g4",{label:"Model 94"}),
 MB(/\b(henry\s*)?(big\s*boy|golden\s*boy|long\s*ranger|h001|h009|side\s*gate)\b/,"Henry","g4"),
 MB(/\b(rossi\s*)?r92\b/,"Rossi","g4"),
 MB(/\b(ruger\s*)?ar\s*-?\s*556\b/,"Ruger","g5",{label:"AR-556"}),
 MB(/\b(smith\s*&\s*wesson\s*|s&w\s*)?(m&p\s*-?\s*15|mp\s*-?\s*15)\w*/,"Smith & Wesson","g5",{label:"M&P15"}),
 MB(/\b(springfield\s*(armory\s*)?)?saint\b/,"Springfield Armory","g5"),
 MB(/\b(kel-tec\s*)?sub\s*-?\s*2000\b/,"Kel-Tec","g5",{label:"Sub-2000"}),
 MB(/\bar\s*-?\s*15\b/,"","g5",{label:"AR-15"}),MB(/\bar\s*-?\s*10\b/,"","g5",{label:"AR-10"}),MB(/\bm4\b/,"","g5",{label:"M4"}),
 MB(/\b(ruger\s*)?(10\s*\/\s*22|1022|10\s+22)(\s*(takedown|carbine|tactical|target|sporter))?\b/,"Ruger","g6",{label:m=>"10/22"+(m[3]?" "+pretty(m[3]):"")}),
 MB(/\bsavage\s*(mark\s*ii|93r17|a22|64)\w*/,"Savage","g6"),
 /* handguns */
 MB(/\bglock\s*(17|19x?|20|21|22|23|26|27|29|30|34|40|42|43x?|44|45|47|48)(\s*(gen\s*\d|mos))?\b|\bg(17|19x?|26|43x?|48)\b/,"Glock","g7",{label:m=>"G"+(m[1]||m[4]).toUpperCase()+(m[2]?" "+pretty(m[2]):"")}),
 MB(/\b(sig\s*sauer\s*)?p\s*(365|320|226|229|938|238|210|239|250)(\s*(xl|x\s*-?\s*macro|macro|sas|x\s*-?\s*carry|x\s*-?\s*five|compact|carry|legion|spectre))?\b/,"Sig Sauer","g7",{label:m=>"P"+m[2]+(m[3]?" "+pretty(m[3]):"")}),
 MB(/\b(springfield\s*(armory\s*)?)?(hellcat(\s*pro)?|xd[sme]?(\s*mod\s*\.?\s*2)?|echelon|prodigy)\b/,"Springfield Armory","g7"),
 MB(/\bcolt\s*(1911|government|commander|defender|series\s*70|gold\s*cup)\b/,"Colt","g7"),
 MB(/\b1911\b/,"","g7",{label:"1911",loose:true}),
 MB(/\b(taurus\s*)?(g2c|g2s|g3c?|g3x|gx4|th9|pt\s*-?\s*111|pt\s*-?\s*709|tx22)\b/,"Taurus","g7"),
 MB(/\b(taurus\s*)?(judge|raging\s*bull|public\s*defender)\b|\btaurus\s*(605|856|tracker|692)\b/,"Taurus","g8"),
 MB(/\b(ruger\s*)?(lcp(\s*(ii|max|2))?|lc9s?|lc380|security\s*-?\s*9|max\s*-?\s*9|sr9c?|sr22|ec9s)\b|\bruger\s*(mark\s*(ii|iii|iv)|22\s*\/\s*45|p89|p95|57)\b/,"Ruger","g7"),
 MB(/\b(ruger\s*)?(gp\s*-?\s*100|sp\s*-?\s*101|lcr\w*|super\s*blackhawk|blackhawk|single\s*-?\s*six|wrangler|super\s*redhawk|redhawk|vaquero)\b/,"Ruger","g8"),
 MB(/\b(smith\s*&\s*wesson\s*|s&w\s*)?m&p\s*(9|40|45|380|22)?(\s*(shield(\s*(plus|ez))?|2\.0|m2\.0|compact|ez))?(?![\w&])|\b(shield\s*(plus|ez)|bodyguard|csx|sd9ve?|sd40)\b/,"Smith & Wesson","g7",{label:m=>pretty(m[0].replace(/smith\s*&\s*wesson|s&w/,""))}),
 MB(/\b(smith\s*&\s*wesson|s&w)\s*(model\s*)?(686|629|642|637|638|617|586|610|66|19|10|36|60|500|460)\b|\bmodel\s*(686|629|642|637|638|617|586|66|19|10|36)\b/,"Smith & Wesson","g8",{label:m=>"Model "+(m[3]||m[4])}),
 MB(/\b(686|629|642|637|638|617|586)(\s*plus)?\b/,"Smith & Wesson","g8",{label:m=>"Model "+m[1]+(m[2]?" Plus":""),loose:true}),
 MB(/\b(colt\s*)?(python|anaconda|king\s*cobra|detective\s*special|official\s*police)\b/,"Colt","g8"),
 MB(/\bcz\s*(75\w*|shadow\s*2|p\s*-?\s*10\s*\w*|p\s*-?\s*09|p\s*-?\s*07|scorpion)\b|\b(shadow\s*2)\b/,"CZ","g7"),
 MB(/\b(beretta\s*)?(92\s*(fs|x|a1)|m9a?\d?|px4(\s*storm)?|apx(\s*a1)?)\b/,"Beretta","g7"),
 MB(/\b(kel-tec\s*)?(pf\s*-?\s*9|p\s*-?\s*3at|p\s*-?\s*32|p\s*-?\s*17|pmr\s*-?\s*30|p50)\b/,"Kel-Tec","g7"),
 MB(/\b(canik\s*)?(tp\s*-?\s*9\w*|mete\s*\w*)\b/,"Canik","g7"),
 /* muzzleloaders */
 MB(/\bcva\s*(optima|accura|wolf|paramount)\b/,"CVA","g9"),
 MB(/\b(thompson(\s*center)?|t\/c|tc)\s*(encore|impact|omega|triumph|pro\s*hunter)\b/,"Thompson Center","g9",{label:m=>pretty(m[3])}),
 MB(/\btraditions\s*(pursuit|vortek|buckstalker|nitrofire)\b/,"Traditions","g9"),
 /* four-wheelers, side-by-sides, carts, bikes — before the saw numbers */
 MB(/\bhonda\s*(rancher|foreman|recon|rubicon|fourtrax|pioneer|talon|trx\s*\d+\w*)(\s*\d+\w*)?\b|\b(foreman|rubicon|fourtrax|trx\s*\d{3}\w*)\b/,"Honda",m=>/pioneer|talon/.test(m[0])?"UTV / side-by-side":"r2"),
 MB(/\b(polaris\s*)?(sportsman|scrambler)(\s*\d+\w*)?\b|\brzr(\s*\w+)?\b/,"Polaris",m=>/rzr/.test(m[0])?"UTV / side-by-side":"r2"),
 MB(/\bpolaris\s*(ranger|general)(\s*\d+\w*)?\b/,"Polaris","UTV / side-by-side"),
 MB(/\b(can-am\s*)?(outlander|renegade)(\s*\d+\w*)?\b/,"Can-Am","r2"),
 MB(/\bcan-am\s*(defender|maverick|commander)(\s*\w+)?\b/,"Can-Am","UTV / side-by-side"),
 MB(/\b(yamaha\s*)?(grizzly|kodiak|raptor|wolverine|viking|rhino|yfz\s*\d*)(\s*\d+\w*)?\b/,"Yamaha",m=>/wolverine|viking|rhino/.test(m[0])?"UTV / side-by-side":"r2"),
 MB(/\byamaha\s*drive\s*2?\b/,"Yamaha","Golf cart"),
 MB(/\b(kawasaki\s*)?(brute\s*force|mule|teryx|kfx)(\s*\d+\w*)?\b/,"Kawasaki",m=>/mule|teryx/.test(m[0])?"UTV / side-by-side":"r2"),
 MB(/\b(john\s*deere\s*)?gator(\s*\w+)?\b/,"John Deere","UTV / side-by-side"),
 MB(/\bclub\s*car(\s*(precedent|onward|ds|tempo))?\b/,"Club Car","Golf cart",{label:m=>pretty((m[1]||"").trim())}),
 MB(/\bezgo(\s*(txt|rxv|s4|l6))?\b/,"EZGO","Golf cart",{label:m=>pretty((m[1]||"").trim())}),
 MB(/\b(kx|crf|yz|rm|klx|ttr|xr|cr|drz|wr|exc)\s*-?\s*\d{2,3}\s*[a-z]{0,2}\b/,"","Dirt bike"),
 /* outdoor power */
 MB(/\b(stihl\s*)?ms\s*-?\s*(\d{3}\s*c?(\s*-?\s*[a-z]{1,3})?)(\s*farm\s*boss)?\b/,"Stihl","p1",{label:m=>"MS "+m[2].replace(/\s+/g,"").toUpperCase()+(m[4]?" Farm Boss":"")}),
 MB(/\bfarm\s*boss\b/,"Stihl","p1",{label:"Farm Boss"}),
 MB(/\b(stihl\s*)?(fsa|fs|km)\s*-?\s*(\d{2,3}\s*r?c?)\b/,"Stihl","p2",{label:m=>m[2].toUpperCase()+" "+m[3].replace(/\s+/g,"").toUpperCase(),spec:m=>m[2]==="fsa"?{Power:"Battery — with battery & charger"}:null}),
 MB(/\b(stihl\s*)?br\s*-?\s*(\d{3})\b/,"Stihl","p3",{label:m=>"BR "+m[2]}),
 MB(/\bstihl\s*(1[78]0|1[89]1|2[5-9]1|250|311|362|391|400|4[56][12]|500i|661|880)\s*(c)?\b/,"Stihl","p1",{label:m=>"MS "+m[1].toUpperCase()+(m[2]?"C":"")}),
 MB(/\b(echo\s*)?cs\s*-?\s*(\d{3,4})\w*|\btimber\s*wolf\b/,"Echo","p1"),
 MB(/\b(echo\s*)?srm\s*-?\s*(\d{3,4})\w*/,"Echo","p2"),
 MB(/\b(echo\s*)?pb\s*-?\s*(\d{3,4})\w*/,"Echo","p3"),
 MB(/\b(husqvarna\s*)?(125|150|350|360|570|580)\s*b(t|ts|vx)?\b/,"Husqvarna","p3"),
 MB(/\b(husqvarna\s*)?(435|440|445|450|455|460|545|550|562|565|572|372|365|390|395)\s*(xp|rancher|xpg)?\b/,"Husqvarna","p1",{loose:true}),
 MB(/\b(honda\s*)?eu\s*-?\s*(1000|2000|2200|3000|7000)\s*i?\w*/,"Honda","p7",{label:m=>"EU"+m[2]+"i",spec:{Type:"Inverter"},detail:m=>m[2]+"W inverter"}),
 MB(/\b(honda\s*)?(eb|em|eg)\s*-?\s*(2800|3000|3500|4000|5000|6500|7000)\s*i?\b/,"Honda","p7",{label:m=>m[2].toUpperCase()+m[3],detail:m=>m[3]+"W"}),
 MB(/\b(honda\s*)?hr[xnrcu]\s*-?\s*\d*\w*/,"Honda","p4",{spec:{Drive:"Self-propelled"}}),
 MB(/\b(john\s*deere\s*)?z\s*-?\s*(3\d\d|5\d\d|9\d\d)\s*[a-z]?\b/,"John Deere","Zero-turn mower",{loose:true}),
 MB(/\b(john\s*deere\s*)?(d1\d\d|e1\d\d|x3\d\d|x5\d\d|x7\d\d|la1\d\d|s1\d\d|l1\d\d|gt\s*235|stx\s*38)\b/,"John Deere","p5",{loose:true}),
 /* tools */
 MB(/\b(dewalt\s*)?dcd\s*-?\s*(\d{3,4})\w*/,"DeWalt","t1",{label:m=>"DCD"+m[2],spec:{"Battery platform":"18 / 20V"}}),
 MB(/\b(dewalt\s*)?dcf\s*-?\s*(\d{3,4})\w*/,"DeWalt",m=>/^(89|9)/.test(m[2])?"t2":"t1",{label:m=>"DCF"+m[2],spec:{"Battery platform":"18 / 20V"}}),
 MB(/\b(dewalt\s*)?dcg\s*-?\s*(\d{3,4})\w*/,"DeWalt","t3",{label:m=>"DCG"+m[2],spec:{Power:"Cordless — with battery"}}),
 MB(/\b(milwaukee\s*)?m18(\s*fuel)?\b/,"Milwaukee",null,{spec:{"Battery platform":"18 / 20V"}}),
 MB(/\b(milwaukee\s*)?m12(\s*fuel)?\b/,"Milwaukee",null,{spec:{"Battery platform":"12V"}}),
 MB(/\b(dewalt\s*)?(20\s*v\s*max|flexvolt|atomic)\b/,"DeWalt",null,{spec:m=>/flex/.test(m[0])?{"Battery platform":"36V+"}:{"Battery platform":"18 / 20V"}}),
 MB(/\b(makita\s*)?(lxt|xgt)\b/,"Makita",null,{spec:m=>/xgt/.test(m[0])?{"Battery platform":"36V+"}:{"Battery platform":"18 / 20V"}}),
 MB(/\b(ryobi\s*)?one\s*\+(\s*hp)?/,"Ryobi",null,{label:"ONE+",spec:{"Battery platform":"18 / 20V"}}),
 /* hunting & fishing */
 MB(/\b(leupold\s*)?vx\s*-?\s*(1|2|3i?|3hd|5hd|6hd|6|r|freedom)\b/,"Leupold","h1",{label:m=>"VX-"+pretty(m[2])}),
 MB(/\bvortex\s*(crossfire(\s*ii)?|diamondback(\s*tactical)?|viper(\s*pst)?|strike\s*eagle|razor(\s*hd)?|venom|golden\s*eagle|triumph|ranger(\s*\d+)?|impact(\s*\d+)?)\b/,"Vortex",m=>/ranger|impact/.test(m[1])?"h3":null),
 MB(/\b(minn\s*kota\s*)?(terrova|ultrex|ulterra|riptide|endura|traxxis|powerdrive|maxxum)\b/,"Minn Kota","h8",
   {spec:m=>/terrova|ultrex|ulterra/.test(m[2])?{Class:"GPS / spot-lock",Mount:"Bow mount"}:/powerdrive|maxxum|riptide/.test(m[2])?{Mount:"Bow mount"}:null}),
 MB(/\b(garmin\s*)?(striker(\s*(plus|vivid|cast))?|echomap\w*|livescope|panoptix)\b/,"Garmin","Fish finder"),
 MB(/\b(humminbird\s*)?(helix(\s*\d+)?|solix|piranhamax)\b/,"Humminbird","Fish finder"),
 MB(/\blowrance\s*(hook\w*(\s*reveal)?|elite\w*|hds\w*)\b|\bhook\s*reveal\b/,"Lowrance","Fish finder"),
 MB(/\b(tactacam\s*)?reveal(\s*(x|xb|pro|sk|ultra|x\s*pro))?\b/,"Tactacam","h4",{spec:{Type:"Cellular — live plan"}}),
 MB(/\bspypoint\s*(link\w*|flex\w*|force\w*)\b/,"Spypoint","h4",{spec:{Type:"Cellular — live plan"}}),
 MB(/\bmathews\s*(v3x?|phase\s*4|lift(\s*\d+)?|halon(\s*\d+)?|vxr(\s*\d+)?|triax|traverse|z7|dxt|switchback|creed|chill|avail|vertix)\b|\b(v3x|halon|triax|traverse|switchback|vxr)\b/,"Mathews","h5"),
 MB(/\b(hoyt\s*)?(rx\s*-?\s*\d|carbon\s*rx|ventum|torrex|axius|hyperforce)\b/,"Hoyt","h5"),
 MB(/\b(ravin\s*)?r\s*-?\s*(10|15|20|26|29|500)x?\b/,"Ravin","h6",{loose:true}),
 /* electronics */
 MB(/\biphone\s*(\d{1,2}|se|xs|xr|x)?(\s*(pro\s*max|pro|plus|mini|max|e))?\b/,"Apple","e4",{label:m=>"iPhone"+(m[1]?" "+m[1].toUpperCase():"")+(m[2]?" "+pretty(m[2]):"")}),
 MB(/\bgalaxy\s*tab(\s*[a-z]?\d+\w*)?(\s*(ultra|plus|\+|fe))?\b/,"Samsung","e3",{label:m=>"Galaxy Tab"+(m[1]?" "+m[1].trim().toUpperCase():"")+(m[2]?" "+pretty(m[2]):"")}),
 MB(/\bgalaxy\s*watch(\s*\d+)?\b/,"Samsung","Smartwatch \u2014 Apple / Galaxy",{label:m=>"Galaxy Watch"+(m[1]||"")}),
 MB(/\bgalaxy\s*(s\d{1,2}|note\s*\d{1,2}|z\s*(fold|flip)\s*\d*|a\d{2})(\s*(ultra|plus|\+|fe))?\b/,"Samsung","e4",{label:m=>"Galaxy "+pretty(m[1])+(m[3]?" "+pretty(m[3]):"")}),
 MB(/\bapple\s*watch(\s*(series\s*\d+|ultra\s*\d*|se))?\b/,"Apple","Smart watch",{label:m=>"Apple Watch"+(m[1]?" "+pretty(m[1]):"")}),
 MB(/\bpixel\s*\d{1,2}a?(\s*(pro\s*xl|pro|xl|fold))?\b/,"Google","e4"),
 MB(/\bipad(\s*(pro|air|mini))?(\s*\d+)?\b/,"Apple","e3",{label:m=>"iPad"+(m[1]?" "+pretty(m[1]):"")+(m[3]||"")}),
 MB(/\bmacbook(\s*(pro|air))?(\s*m\d)?\b/,"Apple","e2",{label:m=>"MacBook"+(m[1]?" "+pretty(m[1]):"")+(m[3]?" "+m[3].trim().toUpperCase():"")}),
 MB(/\b(sony\s*)?(ps5|ps4|playstation\s*\d?)(\s*(pro|slim|digital))?\b/,"Sony","e5",{label:m=>pretty(m[2].replace("playstation","PlayStation"))+(m[3]?" "+pretty(m[3]):""),
   spec:m=>/ps4|playstation\s*4/.test(m[0])?{Version:"Previous gen"}:/digital/.test(m[0])?{Version:"Current gen, digital"}:null}),
 MB(/\bxbox(\s*(series\s*[xs]|one\s*[xs]?|one|360))?\b/,"Microsoft","e5",{label:m=>"Xbox"+(m[1]?" "+pretty(m[1]):""),
   spec:m=>/one|360/.test(m[0])?{Version:"Previous gen"}:/series\s*s/.test(m[0])?{Version:"Current gen, digital"}:null}),
 MB(/\b(nintendo\s*)?switch(\s*(oled|lite|2))?\b/,"Nintendo",m=>/lite/.test(m[0])?"Handheld game console":"e5",{label:m=>"Switch"+(m[2]?" "+pretty(m[2]):"")}),
 MB(/\bsteam\s*deck\b/,"","Handheld game console",{label:"Steam Deck"}),
 MB(/\brog\s*ally\b/,"ASUS","Handheld game console",{label:"ROG Ally"}),
 MB(/\bgopro(\s*hero\s*\d+(\s*black)?|\s*max)?\b|\bhero\s*\d{1,2}\s*black\b/,"GoPro","GoPro / action camera",{label:m=>pretty(m[0].replace("gopro",""))}),
 MB(/\b(dji\s*)?(mavic\s*\w*|phantom\s*\d|avata\s*\d?)\b|\bdji\s*(mini|air)\s*\d\w*(\s*pro)?\b/,"DJI","Camera drone",{label:m=>pretty(m[0].replace("dji",""))}),
 MB(/\b(meta\s*|oculus\s*)?quest\s*(2|3s?|pro)\b|\boculus\b/,"Meta","VR headset"),
 MB(/\bjbl\s*(charge|flip|boombox|xtreme|partybox|clip|go)(\s*\d+)?\b/,"JBL","e6",{spec:m=>/boombox|partybox/.test(m[0])?{Size:"Party-size"}:null}),
 /* instruments */
 MB(/\b(fender\s*)?(blues\s*junior|blues\s*jr|hot\s*rod\s*deluxe|hot\s*rod\s*deville|deluxe\s*reverb|twin\s*reverb)\b/,"Fender","m3",{spec:{Type:"Tube amp"}}),
 MB(/\b(fender\s*)?(precision\s*bass|p\s*-?\s*bass|jazz\s*bass|j\s*-?\s*bass)\b/,"Fender","Bass guitar"),
 MB(/\b(fender\s*)?(strat(ocaster)?|tele(caster)?|jazzmaster)\b/,"Fender","m2",{label:m=>/strat/.test(m[2])?"Stratocaster":/tele/.test(m[2])?"Telecaster":"Jazzmaster"}),
 MB(/\b(gibson\s*)?(j\s*-?\s*45|hummingbird)\b/,"Gibson","m1"),
 MB(/\b(gibson\s*)?(les\s*paul(\s*(standard|studio|custom|junior|special|classic|tribute))?|sg(\s*(standard|special|junior))?|es\s*-?\s*335|flying\s*v)\b/,"Gibson","m2",{label:m=>pretty(m[2]).replace(/^Sg/,"SG").replace(/^Es/,"ES")}),
 MB(/\b(martin\s*)?(d\s*-?\s*(18|28|35|45|15m?|10e|x1e|x2e)|dx\s*-?\s*1\w*|000\s*-?\s*\d+\w*|lx1\w*)\b/,"Martin","m1",{loose:true}),
 MB(/\b(taylor\s*)?([1-8]1[0-9]|[1-8][0-2]4)\s*(ce|e)\b|\btaylor\s*\d{3}\w*|\bgs\s*mini\w*\b|\bbig\s*baby\b/,"Taylor","m1"),
 MB(/\b(boss\s*)?katana(\s*\w+)?\b/,"Boss","m3")
];
function modelHit(text,typedBrand){
  for(const pass of[false,true]) for(const m of MODELBOOK){
    if(!!m.loose!==pass)continue;
    const mm=text.match(m.re); if(!mm)continue;
    if(m.loose&&typedBrand&&m.brand&&typedBrand.toLowerCase()!==m.brand.toLowerCase())continue;
    return {m,mm};
  }
  return null;
}

/* spec words typed anywhere → the matching picker button */
const SPEC_AUTO=[
 {g:"Gauge",re:/\b12\s*(ga|gauge|gage)\b/,o:"12 ga"},{g:"Gauge",re:/\b20\s*(ga|gauge|gage)\b/,o:"20 ga"},
 {g:"Gauge",re:/\b16\s*(ga|gauge|gage)\b/,o:"16 ga"},{g:"Gauge",re:/\b28\s*(ga|gauge|gage)\b/,o:"28 ga"},
 {g:"Gauge",re:/(^|\s)\.?410\b/,o:".410"},
 {g:"Caliber",re:/\b(10\s*mm|45\s*-?\s*70|\.?357)\b/,o:"Desirable (10mm, .45-70…)"},
 {g:"Caliber",re:/\b(9\s*mm|\.?223|5\.56|\.?308|30\s*-?\s*06|\.?243|6\.5|\.?270|\.?380|\.?45\s*acp|\.?40\s*s&w)\b/,o:"Common (9mm, .223, .308…)"},
 {g:"Battery platform",re:/\b12\s*v\b|\bm12\b/,o:"12V"},{g:"Battery platform",re:/\b(18|20)\s*v\b|\bm18\b|\blxt\b|\bone\s*\+/,o:"18 / 20V"},
 {g:"Battery platform",re:/\b(36|40|56|60|80)\s*v\b|\bflexvolt\b|\bxgt\b/,o:"36V+"},
 {g:"Type",re:/\binverter\b/,o:"Inverter"},{g:"Drive",re:/\bself\s*-?\s*propelled\b/,o:"Self-propelled"},
 {g:"Type",re:/\btube\b/,o:"Tube amp"},{g:"Orientation",re:/\b(left\s*-?\s*handed|lefty)\b/,o:"Left-handed"},
 {g:"Type",re:/\bcellular\b/,o:"Cellular — live plan"},{g:"Cocking",re:/\bcrank\b/,o:"Crank-cocking"},
 {g:"Title",re:/\bno\s*title\b/,o:"NO title"},{g:"Stroke",re:/\b2\s*-?\s*stroke\b/,o:"2-stroke"},
 {g:"Stage",re:/\btwo\s*-?\s*stage\b/,o:"Two-stage"},{g:"Mount",re:/\bbow\s*mount\b/,o:"Bow mount"},
 {g:"Pressure",re:/\b(3,?[2-9]\d{2}|[4-9],?\d{3})\s*psi\b/,o:"3,200 PSI +"},{g:"Pressure",re:/\b(1,?\d{3}|2,?[0-4]\d{2}|\d{3})\s*psi\b/,o:"Under 2,500 PSI"},
 {g:"Screen size",re:/\b(6[6-9]|[7-9]\d|100)\s*(in|inch|")/,o:"66 in +"},{g:"Screen size",re:/\b(5\d|6[0-5])\s*(in|inch|")/,o:"50–65 in"},
 {g:"Screen size",re:/\b(4[3-9])\s*(in|inch|")/,o:"43–49 in"},{g:"Screen size",re:/\b([12]\d|3\d|4[0-2])\s*(in|inch|")/,o:"Under 43 in"}];
const DETAIL_RE=[/\b(10|12|16|20|28)\s*(ga|gauge|gage)\b/g,/(^|\s)\.410(\s*(ga|gauge|bore))?\b/g,/\b410\s*(ga|gauge|bore)\b/g,
 /\b\d{1,2}\s*mm\b/g,/\b(22\s*lr|22\s*mag|22\s*wmr|30\s*-?\s*06|45\s*-?\s*70|6\.5\s*(creedmoor|cm|prc)|300\s*(win\s*mag|blackout|blk|wsm|prc)|5\.56|7\.62\s*(x\s*39)?|9\s*x\s*19)\b/g,
 /(^|\s)\.(17|22|223|243|25|257|270|30|308|32|35|357|38|380|40|44|45|50)\b(\s*(lr|wmr|mag|magnum|special|spl|acp|auto|win|rem|colt))?/g,
 /\b\d{2}\s*v(olt)?s?\b/g,/\b\d+(\.\d+)?\s*kw\b/g,/\b\d{3,5}\s*(w|watts?)\b/g,/\b\d{2,3}\s*(in|inch)\b/g,/\b\d+(\.\d+)?\s*hp\b/g,
 /\b\d{2,4}\s*cc\b/g,/\b\d{1,2},?\d{3}\s*psi\b/g,/\b\d{1,2}\s*-\s*\d{1,2}\s*x\s*\d{0,2}\b/g,/\b\d{2,4}\s*(gb|tb)\b/g,/\b\d+\s*(ft|foot)\b/g,/\b\d+\s*lbs?\b/g,
 /\b(19|20)\d{2}\b/g,/\b\d+\s*x\s*\d+\b/g,
 /\b(inverter|cellular|self\s*-?\s*propelled|tube|left\s*-?\s*handed|lefty|crank|bow\s*mount|no\s*title|two\s*-?\s*stage|[24]\s*-?\s*stroke)\b/g];
const COND_RE=[[/\b(new\s*in\s*box|nib|sealed|brand\s*new)\b/,"new"],[/\b(excellent|mint|like\s*new|barely\s*used)\b/,"exc"],
 [/\b(good\s*(shape|condition))\b/,"good"],[/\b(fair|worn|heavy\s*wear)\b/,"fair"],
 [/\b(rough|broken|needs\s*work|not\s*working|doesn\s*t\s*work|won\s*t\s*(start|run)|for\s*parts|parts\s*only)\b/,"rough"]];
const INCOMPLETE_RE=/\b(missing\s*\w+|no\s*(battery|charger|case|mag|magazine)|bare\s*tool|tool\s*only)\b/;
const STOP=new Set(["a","an","the","for","with","and","or","of","on","to","my","his","her","some","old","used","nice","w","w/","it","one","this","that","has","have","came","comes"]);
/* Built from the jewellery brand book, so adding a maker there is enough. */
const NAMED_JEWEL=new RegExp("\\b("+["Rolex","Cartier","Omega","Tiffany","Patek","Audemars","Van Cleef","Bulgari","David Yurman","Tudor","Breitling","Seiko","Citizen","Tissot","TAG","Longines","Movado","James Avery","Pandora","John Hardy","Kendra Scott","Swarovski","Fossil","Michael Kors","Invicta","Shinola","Hamilton","Bulova"]
  .map(b=>b.toLowerCase().replace(/[^a-z0-9 ]/g,"")).join("|")+")\\b","i");
const NOT_METAL=/\b(ring\s*(doorbell|camera|cam|light|alarm|security|video|floodlight)|(door|key|tow|snap|piston|boxing|lifting|split|o|d)\s*-?\s*rings?|ring\s*gear|coin\s*(op|operated|machine|laundry|counter|sorter)|silver\s*(bullet|lake)|gold\s*(gym|club\s*member))\b/;
const METAL_RE=/\b(gold|silver|sterling|925|karat|carat|ring|rings|necklace|bracelet|earrings?|jewelry|jewellery|pendant|bullion|scrap|coin|coins|(10|14|18|22|24)\s*(k|kt|karat))\b/;

function omniParse(q){
  const raw=omniNorm(q);
  const P={raw,brand:"",brandCats:[],modelLabel:"",modelItem:null,spec:{},detail:[],words:[],left:[],cond:null,complete:true,metal:null,karat:null,hints:[]};
  if(!raw)return P;
  let t=" "+raw+" ";
  /* "bracelet" alone is metal on a scale. "tiffany bracelet" is not: the name
     is most of what it is worth, and weighing it would under-value it badly.
     A named maker from the jewellery book wins over the scale - unless the
     karat is spelled out, which is someone weighing a marked piece. */
  const byName=(NAMED_JEWEL.test(t)||/\b(diamond|engagement|bridal|solitaire|halo)\b/i.test(t))
    &&!/\b(10|14|18|22|24)\s*(k|kt|karat)\b/.test(t);
  /* "ring" and "coin" carry the scale page with them, which is right for a
     class ring and wrong for a Ring doorbell or a coin-operated washer. The
     compounds below are the item, not the metal in it. */
  if(METAL_RE.test(t)&&!byName&&!NOT_METAL.test(t)){
    P.metal=/silver|sterling|925/.test(t)?"silver":"gold";
    const k=t.match(/\b(10|14|18|22|24)\s*(k|kt|karat)\b/); if(k)P.karat=k[1]+"k";
  }
  BRAND_ALIAS.forEach(([re,canon])=>{ if(re.test(t)&&t.indexOf(canon)<0)t=t.replace(re," "+canon+" "); });
  for(const [re,c] of COND_RE){ if(re.test(t)){ P.cond=P.cond||c; t=t.replace(re," "); } }
  if(INCOMPLETE_RE.test(t)){ P.complete=false; t=t.replace(INCOMPLETE_RE," "); }
  const pre=findBrand(t);
  const mh=modelHit(t,pre?pre.b.name:"");
  if(mh){
    const m=mh.m, mm=mh.mm;
    P.modelItem=typeof m.item==="function"?m.item(mm):m.item;
    let lbl=m.label!=null?(typeof m.label==="function"?m.label(mm):m.label)
           :pretty(mm[0].replace(new RegExp(omniEsc((m.brand||"~").toLowerCase()),"g"),""));
    P.modelLabel=String(lbl||"").trim();
    const sp=typeof m.spec==="function"?m.spec(mm):m.spec; if(sp)Object.assign(P.spec,sp);
    if(m.detail)P.detail.push(typeof m.detail==="function"?m.detail(mm):m.detail);
    t=t.replace(mm[0]," ");
    if(m.brand){ P.brand=m.brand; const be=brandEntry(m.brand); P.brandCats=be?be.cats:[]; }
  }
  const fb=findBrand(t);
  if(fb){
    const me=P.modelItem?findEntry(P.modelItem):null;
    if(!me||!P.brand||fb.b.cats.some(c=>c.cat===me.catId)){ P.brand=fb.b.name; P.brandCats=fb.b.cats; }
    t=t.replace(fb.b.re,"$1 ");
  }
  DETAIL_RE.forEach(re=>{ t=t.replace(re,(s)=>{ const v=s.trim(); if(v)P.detail.push(v); return " "; }); });
  omniWords(t).forEach(w=>{
    if(STOP.has(w))return;
    if(OMNI_IDX.some(e=>wordHit(w,e.words)))P.words.push(w);
    else if(!(P.metal&&METAL_RE.test(" "+w+" ")))P.left.push(w);
  });
  return P;
}
const WORD_END=/^(s|es|ed|ing|er|ers|s\u2019|'s)$/;
function wordHit(tok,words){
  let best=0;
  for(const w of words){
    if(w===tok)return 3;
    if(tok.length>=3&&w.startsWith(tok))best=Math.max(best,2);
    /* The typed word running past a catalog word is meant for word endings -
       "chainsaws" reaching "chainsaw", "drills" reaching "drill". Any old
       remainder let "cello" reach "cell" and put a Smartphone at the top of
       the list for a musical instrument. Only real endings count. */
    else if(tok.length>=4&&w.length>=4&&tok.startsWith(w)&&WORD_END.test(tok.slice(w.length)))best=Math.max(best,1);
  }
  return best;
}
const OMNI_MAX=16;
function omniRows(q){
  const P=omniParse(q), rows=[];
  /* Did anything really match what was typed - a known model, a price-list
     row, or an entry carrying every word? Brand-only listings do not count:
     typing "apple airpods pro" lists what Apple things the catalog has,
     which is how a projector ends up answering for earbuds. */
  let strong=false;
  if(P.raw.length<2)return {P,rows};
  const model=[P.modelLabel].concat(P.modelLabel?[]:P.left.map(w=>pretty(w))).filter(Boolean).join(" ");
  const KEEP=/^(impact|hammer|digital|pro|max|plus|lite|oled|slim|xl|compact|magnum)$/;
  const detail=P.detail.concat(P.modelLabel?P.left:[]).concat(P.words.filter(w=>KEEP.test(w))).join(" ");
  const base={brand:P.brand,model,detail,spec:P.spec,cond:P.cond,complete:P.complete};
  /* Eight was too few once the price list started answering too: typing
     "remington" spent five rows on models and had three left for the ten
     kinds of firearm Remington makes, so lever-action, the AR, the .22, the
     pistol, the revolver and the muzzleloader never appeared. The list
     scrolls; the cap only needs to stop it running away. */
  const add=(e,extra)=>{ if(!e||rows.length>=OMNI_MAX)return;
    if(rows.some(r=>r.kind===e.kind&&r.name===e.name&&r.catId===e.catId))return;
    rows.push(Object.assign({},e,base,extra||{})); };
  if(P.metal&&!P.modelItem)rows.push({kind:"metal",metal:P.metal,karat:P.karat,q});
  if(P.modelItem){ add(findEntry(P.modelItem),{strong:true}); strong=true; }
  { const bw=omniWords(P.brand||""), mq=omniWords(q).filter(w=>!STOP.has(w)&&bw.indexOf(w)<0);
    /* The brand words come out so that "husqvarna 455" is matched on 455
       rather than made to carry the brand into every comparison. When the
       brand is ALL that was typed there is nothing left to search with, and
       this step used to be skipped - so typing the whole brand showed fewer
       models than typing half of it. With nothing left, search the brand. */
    const keys=mq.length?mq:bw;
    if(keys.length){
      const r0=rows[0], strongId=r0&&r0.strong?((mpFor(r0.kind==="item"?r0.itemId:r0.name,[r0.brand,r0.model,r0.detail].join(" "))||[])[0]):null;
      MODEL_PRICES.map(r=>{ const nw=omniWords(r[2]); let s=0; for(const w of keys){ const h=wordHit(w,nw); if(!h)return null; s+=h; } if(omniNorm(r[2]).indexOf(omniNorm(q))>=0)s+=5; return {r,s}; })
        .filter(Boolean).sort((a,b)=>b.s-a.s||a.r[2].length-b.r[2].length).slice(0,5)
        .forEach(({r})=>{ if(rows.length>=OMNI_MAX||r[0]===strongId)return; const e=findEntry(String(r[1]).split("|")[0]); if(!e)return;
          rows.push(Object.assign({},e,{kind:"mp",base:e.kind,mp:r,brand:"",model:"",detail:"",spec:{},cond:P.cond,complete:P.complete}));   strong=true; });
    } }
  const inBrand=e=>P.brandCats.some(c=>c.cat===e.catId&&(!c.items||c.items.indexOf(e.kind==="item"?e.itemId:e.name)>=0));
  if(P.words.length){
    let sc=[];
    const score=(e,and)=>{ let s=0; for(const w of P.words){ const h=wordHit(w,e.words); if(!h&&and)return 0; s+=h; } return s; };
    /* The maker is taken out of the words before scoring, so on "seiko watch"
       only "watch" is left and the two watch rows tie - and the tie-break,
       shorter name first, handed a Seiko to the luxury row. An entry that
       names the maker itself is the better answer. */
    const brandW=omniWords(P.brand||"");
    const namesBrand=e=>brandW.length&&brandW.some(w=>wordHit(w,e.words)>=2);
    OMNI_IDX.forEach(e=>{ const s=score(e,true); if(s)sc.push({e,s:s+(inBrand(e)?3:0)+(namesBrand(e)?4:0)+(e.kind==="item"?.5:0)}); });
    /* Nothing matched every word, so fall back to matching any of them - but
       remember that we did. A loose match is how "airpods pro" reaches
       Projector on the strength of three letters, and it must not sit above
       the words the counter actually typed. */
    /* The parser hands this pass only what is left after the brand and the
       model are taken out, so a match here can rest on one generic noun:
       "skil band saw bw9501" arrives as "saw" and lands on Tile saw, having
       quietly dropped "band". A match counts as strong only if the entry
       carries every distinguishing word - or if the parser recognised a model
       and therefore understood the whole thing. */
    if(sc.length){
      const bw=omniWords(P.brand||"");
      const need=omniWords(q).filter(w=>!STOP.has(w)&&bw.indexOf(w)<0);
      const top=sc.slice().sort((a,b)=>b.s-a.s)[0].e;
      strong=!!P.modelLabel||!need.length||need.every(w=>wordHit(w,top.words));
    }
    else OMNI_IDX.forEach(e=>{ const s=score(e,false); if(s)sc.push({e,s:s+(inBrand(e)?3:0)}); });
    sc.sort((a,b)=>b.s-a.s||a.e.name.length-b.e.name.length).forEach(x=>add(x.e));
  } else if(P.brandCats.length&&!P.modelItem){
    (BRAND_FIRST[P.brand.toLowerCase()]||[]).forEach(ref=>add(findEntry(ref)));
    const order={hi:0,mid:1,lo:2};
    P.brandCats.slice().sort((a,b)=>order[a.tier]-order[b.tier]).forEach(c=>{
      if(c.items)c.items.forEach(ref=>add(findEntry(ref)));
      else OMNI_IDX.filter(e=>e.kind==="item"&&e.catId===c.cat).forEach(e=>add(e));
    });
  } else if(!P.modelItem&&P.detail.length){
    const d=P.detail.join(" "), refs=[];
    if(/ga|gauge|gage|410/.test(d))refs.push("g1","g2","Single-shot shotgun");
    else if(/mm|\.\d|lr|acp|magnum|special|5\.56|30\s*-?\s*06|creedmoor|blackout/.test(d))refs.push("g7","g8","g3","g5","g6");
    if(/\d\s*v\b|volt/.test(d))refs.push("t1","t2","t3");
    if(/kw|\d\s*w\b|watt|inverter/.test(d))refs.push("p7","Inverter generator — 2kW");
    if(/\d\s*(in|inch)\b/.test(d))refs.push("e1");
    if(/hp\b/.test(d))refs.push("h9");
    if(/cc\b/.test(d))refs.push("r2","Dirt bike");
    refs.forEach(r=>add(findEntry(r)));
  }
  if(!rows.some(r=>r.kind==="item"||r.kind==="book")&&P.brandCats.length){
    const cat=P.brandCats[0].cat;
    rows.push(Object.assign({kind:"custom",catId:cat,name:pretty(q).slice(0,60)},base,{model:""}));
  }
  const guns=rows.length?rows.some(r=>r.catId==="guns")&&rows.filter(r=>r.catId&&r.catId!=="guns").length===0:false;
  const qq=String(q).trim().slice(0,100);
  rows.push({kind:"sold",q:qq,guns,url:guns?"https://www.gunbroker.com/All/search?Keywords="+encodeURIComponent(qq):watchCountUrl(qq)});
  /* Whatever was typed is always something the counter can price. No button
     for it: type, and either the catalog has it or those words become the
     item. It goes above the matches when they are only loose ones, since a
     wrong category is worse than no category. */
  { const t=String(q||"").trim();
    if(t.length>=3&&!P.metal){
      const own={kind:"own",q:t.slice(0,60)};
      const before=rows.findIndex(r=>r.kind==="sold");
      rows.splice(strong?(before<0?rows.length:before):0,0,own);
    } }
  return {P,rows};
}

function isTouch(){ try{ return matchMedia("(pointer:coarse)").matches; }catch(e){ return false; } }
function omniHintHTML(){
  /* The box holds what was chosen now, so this stopped saying it twice. */
  if(st.omniDone)return `Follow <b>Next step</b> below. Type here again to price something else.`;
  return `Try <b>stihl 271</b>, <b>remington 870 12 gauge</b>, <b>kayak</b> or <b>14k ring</b>.${isTouch()?"":" On a computer you can just start typing."}`;
}
const SEARCH_SVG=`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#00E8A0" stroke-width="2.6"/><path d="M15.5 15.5L21 21" stroke="#00E8A0" stroke-width="2.6" stroke-linecap="round"/></svg>`;
function omniHTML(){
  return `<div class="omni" id="omni"><div class="omniWrap">
    <div class="omniBox">${SEARCH_SVG}<input id="omniIn" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
      placeholder="What's on the counter? Type a brand, model or item" value="${esc(st.omniQ||"")}" aria-label="Search items" aria-controls="omniList" aria-expanded="false"><button class="omniClr" id="omniClr" type="button" aria-label="Clear the search">&times;</button></div>
    <div class="omniList" id="omniList" role="listbox" hidden></div></div>
    <div class="omniHint" id="omniHint">${omniHintHTML()}</div></div>`;
}
let omniRowsCache=[];
function omniRowHTML(r,i){
  const hl=i===st.omniHl?" hl":"";
  if(r.kind==="own")return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">Price &ldquo;${esc(r.q)}&rdquo;</span><span class="on2">not on the lists &mdash; pick what kind of thing it is, then what it sells for</span></span><span class="ov">&rsaquo;</span></button>`;
  if(r.kind==="mp")return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">${esc(r.mp[2])}</span><span class="on2">${esc(r.name)} &middot; resale value from ${esc(srcName(r.mp[7]))}, ${esc(fmtDay(r.mp[6]))}</span></span><span class="ov">${money(r.mp[3])}&ndash;${money(r.mp[4])}<small>resale</small></span></button>`;
  if(r.kind==="metal")return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">Gold &amp; silver &mdash; price it by weight</span><span class="on2">${r.metal==="silver"?"Sterling .925":esc(r.karat||"Gold")} &middot; opens the scale-and-spot page</span></span><span class="ov">&rsaquo;</span></button>`;
  if(r.kind==="sold")return `<a class="omniRow sold${hl}" data-omni="${i}" role="option" href="${esc(r.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span class="ot"><span class="on1">Check sold prices for &ldquo;${esc(r.q)}&rdquo;</span><span class="on2">${r.guns?"GunBroker &mdash; tick Completed":"WatchCount &mdash; eBay sold"} &middot; opens a new tab</span></span><span class="ov">&#8599;</span></a>`;
  const cat=CATLABEL[r.catId]||"";
  const who=[r.brand,r.model].filter(Boolean).join(" ");
  const head=r.strong&&who?who:r.name;
  const bits=[];
  if(r.strong&&who)bits.push(r.name); else if(who)bits.push(who);
  bits.push(cat);
  if(r.detail)bits.push(r.detail);
  const mp=(r.kind==="item"||r.kind==="book")?mpFor(r.kind==="item"?r.itemId:r.name,[r.brand,r.model,r.detail,r.kind==="book"?r.name:""].join(" ")):null;
  if(r.kind==="book")bits.push("price book");
  if(r.kind==="custom")bits.push("not on any list &mdash; you set the price");
  return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">${esc(head)}</span><span class="on2">${bits.map(b=>b.indexOf("&mdash;")>=0?b:esc(b)).join(" &middot; ")}</span></span>${mp?`<span class="ov">${money(mp[3])}&ndash;${money(mp[4])}<small>resale</small></span>`:""}</button>`;
}
/* Which row, if any, Enter should take. Typing a brand is not choosing a
   model: "husq" brings up four Husqvarnas and arming the first of them makes
   a backpack blower look like something already picked - the same thing the
   old shotgun default did. So a row is armed only when the typing actually
   points at one: a model number, or a single thing on the list that matches.
   Otherwise nothing is highlighted and the arrows are there to choose with. */
function omniArm(rows,q){
  const isPick=r=>!!r&&(r.kind==="item"||r.kind==="book"||r.kind==="mp"||r.kind==="metal"||r.kind==="custom");
  const first=rows.findIndex(isPick); if(first<0)return -1;
  if(/\d/.test(q))return first;
  return rows.filter(isPick).length===1?first:-1;
}
function omniShow(){
  const list=document.getElementById("omniList"), inp=document.getElementById("omniIn"); if(!list||!inp)return;
  const q=st.omniQ||"";
  if(q.trim().length<2){ list.hidden=true; inp.setAttribute("aria-expanded","false"); omniRowsCache=[]; return; }
  const rows=omniRows(q).rows; omniRowsCache=rows;
  if(st.omniHl===null)st.omniHl=omniArm(rows,q);
  if(st.omniHl>=rows.length)st.omniHl=omniArm(rows,q);
  const real=rows.some(r=>r.kind!=="sold");
  list.innerHTML=(real?"":`<div class="omniEmpty">Nothing on the lists or in the price book for that. Pick a category on the left and tap <b>Not on any list</b>, or see what it sold for:</div>`)
    +rows.map(omniRowHTML).join("");
  list.hidden=false; inp.setAttribute("aria-expanded","true");
  list.querySelectorAll("[data-omni]").forEach(el=>{
    el.onmousedown=e=>e.preventDefault();
    el.onclick=e=>{
      const r=omniRowsCache[Number(el.dataset.omni)]; if(!r)return;
      if(r.kind==="sold"){ pasteTo="shot"; setTimeout(()=>{ list.hidden=true; },0); return; }
      e.preventDefault(); omniPick(r);
    };
  });
}
function omniHlPaint(){
  const list=document.getElementById("omniList"); if(!list)return;
  list.querySelectorAll("[data-omni]").forEach(el=>{ const on=Number(el.dataset.omni)===st.omniHl; el.classList.toggle("hl",on); if(on&&el.scrollIntoView)el.scrollIntoView({block:"nearest"}); });
}
function applySpecPicks(spec,text){
  const groups=SPEC_CHOICES[st.itemId]; if(!groups)return;
  const t=" "+omniNorm(text)+" ";
  groups.forEach((g,gi)=>{
    let want=spec&&spec[g.label];
    if(want&&!g.options.some(o=>o.t===want))want=null;
    if(!want)for(const r of SPEC_AUTO){ if(r.g===g.label&&r.re.test(t)&&g.options.some(o=>o.t===r.o)){want=r.o;break;} }
    if(!want)return;
    const oi=g.options.findIndex(o=>o.t===want); if(oi>=0)st.specSel[st.itemId+":"+gi]=oi;
  });
}
/* Back to an empty counter. Everything about the thing being priced goes -
   what it is, what it is worth, its condition, the fake-check answers, the
   asking price. What belongs to the shop stays: the rates, the shelf record,
   the listings, the deal log, and the service this device is connected to. */
function startOver(){
  st.omniQ=""; st.omniDone=""; st.omniHl=null;
  st.mode="item";                 /* from the scale too, not just the item page */
  st.picked=false; st.bookName=""; st.brandTyped=""; st.model=""; st.detail="";
  st.brand="mid"; st.liq=null; st.market=null; st.mpPin=null; st.mpNone=false;
  st.cond="good"; st.condSet=false; st.complete=true; st.specSel={}; st.editing=false;
  st.ask=0; st.askKey=""; st.ticket=""; st.needKind=false; st.photoRead=null; st.compRead=null;
  st.fakeAns={}; st.fakeKey=""; st.stepAt=0; st.openS3=st.openS4=st.openS5=false;
  photoFile=null; findMsg="";
  render();
  const o=document.getElementById("omniIn"); if(o)o.focus();
}
function omniPick(r){
  if(!r||r.kind==="sold")return;
  if(r.kind==="own"){
    st.omniQ=r.q; st.omniHl=0; st.mode="item"; st.itemId=custId(st.catId); st.bookName=r.q;
    st.brandTyped=""; st.model=""; st.detail=""; st.brand="mid"; st.liq=null; st.market=null;
    st.mpPin=null; st.mpNone=true; st.condSet=false; st.phKindsOpen=true; st.omniDone=r.q;
    st.needKind=true;               /* nothing is priced until this is answered */
    render();
    const k=document.querySelector(".phKinds"); if(k&&k.scrollIntoView)k.scrollIntoView({block:"center"});
    return;
  }
  if(r.kind==="mp"){ const row=r.mp; omniPick(Object.assign({},r,{kind:r.base,model:row[2]})); st.mpPin={id:row[0],model:st.model}; render(); return; }
  st.omniQ=""; st.omniHl=0;
  if(r.kind==="metal"){
    st.mode="metal";
    /* Arriving from words that name bullion - "silver eagle", "krugerrand" -
       starts on the coin check rather than making the counter say so. */
    const bl=FAKES&&FAKES.sheets.find(z=>z.id==="bullion");
    if(bl){ const t=" "+String(r.q||st.omniQ||"").toLowerCase()+" ";
      st.metalKind=bl.match.some(w=>t.indexOf(w)>=0)?"bullion":"jewelry"; }
    if(st.metal!==r.metal){ st.metal=r.metal; st.payTouched=false; st.loanTouched=false; }
    if(r.metal==="gold"&&r.karat&&PURITY.some(p=>p.k===r.karat))st.karat=r.karat;
    st.omniDone=""; render(); return;
  }
  st.mode="item"; st.catId=r.catId; st.bookQ="";
  if(r.kind==="item"){ st.itemId=r.itemId; st.bookName=""; st.liq=null; }
  else if(r.kind==="book"){ st.itemId=custId(r.catId); st.bookName=r.name;
    st.overrides[custId(r.catId)]=bookVal([r.name,r.value,r.catId,r.liq]); st.liq=r.liq; persist(); }
  else { st.itemId=custId(r.catId); st.bookName=r.name; st.liq=null; }
  st.needKind=false;
  st.brandTyped=r.brand||"";
  const hit=st.brandTyped?brandLookup(st.catId,st.brandTyped):null; st.brand=hit?hit.tier:"mid";
  st.model=r.model||""; st.detail=r.detail||"";
  st.complete=r.complete!==false;
  if(r.cond)st.cond=r.cond;
  st.specSel={}; applySpecPicks(r.spec,st.detail+" "+st.model);
  st.editing=(r.kind==="custom");
  st.photoRead=null; st.compRead=null; st.market=null; st.mpPin=null; st.mpNone=false; st.condSet=!!r.cond; if(!r.cond)st.cond="good";
  /* Leave the chosen thing in the box. Emptying it and saying underneath what
     was filled in meant reading a sentence to learn what the box could have
     just shown. Clicking it selects the lot, so typing still replaces. */
  st.omniQ=[r.brand||"",r.model||"",r.name||""].map(t=>String(t).trim()).filter(Boolean).join(" ").slice(0,80);
  st.omniDone=[r.brand,r.model,r.name].filter(Boolean).join(" ");
  render();
  if(st.editing){ const vi=document.getElementById("valIn"); if(vi)vi.focus(); }
  else if(!matchMedia("(min-width:1080px)").matches){ const c=document.getElementById("nextStep")||document.querySelector(".colC"); if(c&&c.scrollIntoView)c.scrollIntoView({behavior:"smooth",block:"start"}); }
}
function wireOmni(){
  const inp=document.getElementById("omniIn"); if(!inp)return;
  inp.oninput=()=>{
    st.omniQ=inp.value; st.omniHl=null;   /* omniShow decides what, if anything, is armed */
    if(st.omniDone){ st.omniDone=""; const h=document.getElementById("omniHint"); if(h)h.innerHTML=omniHintHTML(); }
    omniShow();
  };
  inp.onfocus=()=>{ if(st.omniDone||!st.omniQ)inp.select(); omniShow(); };
  inp.onblur=()=>setTimeout(()=>{ const l=document.getElementById("omniList"), i2=document.getElementById("omniIn");
    if(l&&document.activeElement!==i2){ l.hidden=true; if(i2)i2.setAttribute("aria-expanded","false"); } },150);
  inp.onkeydown=e=>{
    const n=omniRowsCache.length, list=document.getElementById("omniList"), open=list&&!list.hidden;
    const hl=st.omniHl==null?-1:st.omniHl;
    if(e.key==="ArrowDown"&&open&&n){ e.preventDefault(); st.omniHl=hl<0?0:(hl+1)%n; omniHlPaint(); }
    else if(e.key==="ArrowUp"&&open&&n){ e.preventDefault(); st.omniHl=hl<0?n-1:(hl-1+n)%n; omniHlPaint(); }
    else if(e.key==="Enter"&&open&&n){
      e.preventDefault();
      /* Nothing armed: Enter highlights rather than picks, so a brand name
         cannot become an item by reflex. A second Enter takes it. */
      if(hl<0){ st.omniHl=0; omniHlPaint(); return; }
      const r=omniRowsCache[hl];
      if(r&&r.kind==="sold"){ const a=list.querySelector('[data-omni="'+hl+'"]'); if(a)a.click(); } else omniPick(r);
    }
    else if(e.key==="Escape"){ if(inp.value){ st.omniQ=""; inp.value=""; omniShow(); } else inp.blur(); }
  };
  const clr=document.getElementById("omniClr");
  /* With something priced, the X was clearing the words and leaving the item,
     its price, its condition and its checks standing - so there was no way
     back to a clean start short of reloading. It clears the deal now. */
  if(clr){ clr.onmousedown=e=>e.preventDefault();
    clr.onclick=()=>{ st.omniQ=""; inp.value=""; if(st.picked)startOver(); else { inp.focus(); omniShow(); } }; }
}
/* on a computer: start typing anywhere on the item page and it lands in the search bar */
document.addEventListener("keydown",e=>{
  if(st.mode!=="item"||e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;
  const a=document.activeElement;
  if(a&&(a.tagName==="INPUT"||a.tagName==="TEXTAREA"||a.tagName==="SELECT"||a.isContentEditable))return;
  if(document.getElementById("camModal"))return;
  const inp=document.getElementById("omniIn"); if(!inp)return;
  if(e.key==="/"){ e.preventDefault(); inp.focus(); return; }
  if(e.key.length===1&&/\S/.test(e.key)){ inp.focus({preventScroll:true}); try{ const n=inp.value.length; inp.setSelectionRange(n,n); }catch(x){} }
});

/* ================= SOLD-PRICE SCREENSHOTS =================
   The page can't reach WatchCount, eBay or GunBroker: it is sandboxed and
   those sites block automated readers. So the counter screenshots the sold
   results and drops them here. Claude only reads the listings off the
   picture; the low / middle / high math happens on this page. */
let shotFiles=[], shotBusy=false, shotCtl=null, pasteTo="shot";
const IMG_OK=["image/jpeg","image/png","image/webp","image/gif"];
function imgAccept(){ const t=CAP.imgLimits&&CAP.imgLimits.mediaTypes; return (t&&t.length?t:IMG_OK).join(","); }
function shotMax(){ const n=CAP.imgLimits&&CAP.imgLimits.maxCount; return Math.max(1,Math.min(4,n||4)); }
/* Every phone photo is shrunk before it is sent, and that is not a nicety.

   This used to hand anything under 15MB straight through. A modern phone
   takes 3-12MB pictures; base64 adds a third; the service stops reading at
   8MB and kills the connection, so the browser saw a dead socket rather than
   an answer and reported that it could not reach the service at all. A photo
   read failed while a price search from the same phone worked, because a
   search sends no picture.

   Nothing is lost by shrinking. Claude never sees more than 2576px on the
   long edge - anything past that is discarded at the far end after being
   paid for in upload time on a phone signal. 2600px at quality 0.85 lands
   around half a megabyte. */
/* A pixel cap alone is not enough: something between a phone and the service
   can refuse a body over a few hundred KB, and a 2600px photo of a detailed
   scene sails past that. So shrink to a BYTE budget, stepping the quality and
   then the size down until it fits. 380KB encodes to about 500KB of base64,
   which is comfortably inside what was measured to get through. */
const IMG_MAX_EDGE=2600, IMG_MAX_BYTES=200e3;
async function normImage(f){
  try{
    /* from-image so a picture taken sideways arrives the right way up. */
    let b=null;
    try{ b=await createImageBitmap(f,{imageOrientation:"from-image"}); }
    catch(e){ b=await createImageBitmap(f); }
    const big=Math.max(b.width,b.height);
    if(big<=IMG_MAX_EDGE&&f.size<=IMG_MAX_BYTES&&IMG_OK.indexOf(f.type)>=0)return f;
    /* Wider steps first (quality is cheap), then narrower (pixels cost more).
       Stops at the first that fits, so a clean photo keeps its detail and only
       a busy one gets cut down. */
    const steps=[[IMG_MAX_EDGE,0.85],[2000,0.8],[1800,0.75],[1600,0.7],[1400,0.65],[1200,0.6],[1000,0.55],[800,0.5]];
    let best=null;
    for(const [edge,q] of steps){
      const k=Math.min(1,edge/big);
      const c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(b.width*k)); c.height=Math.max(1,Math.round(b.height*k));
      c.getContext("2d").drawImage(b,0,0,c.width,c.height);
      const out=await new Promise(r=>c.toBlob(r,"image/jpeg",q));
      if(!out)continue;
      best=out;
      if(out.size<=IMG_MAX_BYTES)break;
    }
    return best?new File([best],"image.jpg",{type:"image/jpeg"}):f;
  }catch(e){ return f; }
}
/* Claude sees each picture at about 1.2 megapixels. A tall phone screenshot
   or a wide monitor shrinks until the prices blur, so cut big ones into
   overlapping bands, top to bottom, and send the bands. */
async function prepShots(files){
  const max=Math.max(1,(CAP.imgLimits&&CAP.imgLimits.maxCount)||4), metas=[];
  for(const f of files){ let bmp=null; try{ bmp=await createImageBitmap(f); }catch(e){}
    metas.push({f,bmp,want:bmp?Math.max(1,Math.ceil(bmp.width*bmp.height/1.3e6)):1,need:1}); }
  let left=max-metas.length, gave=true;
  while(left>0&&gave){ gave=false;
    metas.slice().sort((a,b)=>(b.want-b.need)-(a.want-a.need)).forEach(m=>{ if(left>0&&m.need<m.want){ m.need++; left--; gave=true; } }); }
  const out=[];
  for(const m of metas){
    if(!m.bmp||m.need<=1){ out.push(m.f); continue; }
    const W=m.bmp.width,H=m.bmp.height,k=m.need,band=Math.ceil(H/k),ov=Math.round(band*0.08)+16;
    for(let i=0;i<k;i++){
      const y0=Math.max(0,i*band-ov), y1=Math.min(H,(i+1)*band+ov), h=y1-y0;
      const c=document.createElement("canvas"); c.width=W; c.height=h;
      c.getContext("2d").drawImage(m.bmp,0,y0,W,h,0,0,W,h);
      const b=await new Promise(r=>c.toBlob(r,"image/jpeg",0.92)); if(b)out.push(b);
    }
  }
  return out.slice(0,max);
}
function shotPrompt(x){
  const what=[st.brandTyped,st.model,displayName(x),st.detail].filter(Boolean).join(" ");
  return [
"You are reading screenshots of SOLD listings for the counter at a small pawn shop in Bristol, Florida.",
"The item being priced: \""+what+"\" (category: "+x.cat.label+").",
"The screenshots come from WatchCount (eBay sold listings), eBay's own sold search, or GunBroker completed auctions. When there are several images they may be bands cut from one tall screenshot, in top-to-bottom order, overlapping a little. List each listing only once.",
"",
"For every listing you can read, give:",
"- title: the listing title, cut to 80 characters",
"- price: what it SOLD for in US dollars, as a plain number. Leave out shipping. If a Best Offer was accepted and the accepted price is shown, use the accepted price. If a Best Offer sale shows only a crossed-out or list price, give that number and set offerHidden to true.",
"- offerHidden: true or false",
"- condition: \"new\", \"used\", \"parts\" (parts, not working, for repair), or \"\" when not shown",
"- match: \"same\" when it is the same kind of item as the one being priced (and the same maker and model, when those are given); \"close\" when it is the same kind of item in a different model, size or version that is still fair to compare; \"different\" when it is something else: parts only, broken, a lot of several, an accessory, a box or manual, a toy, or another product",
"- why: for close or different, 2 to 5 words saying why (\"lot of 3\", \"different model\", \"bare tool, no battery\"). Empty for same.",
"",
"Only listings that actually SOLD. eBay marks them \"Sold\" with a date; GunBroker completed auctions show a winning bid. If the pictures show items still FOR SALE, set soldOnly to false and return no listings. Never invent a listing or a price you cannot read. Do not estimate a value; the page does the math.",
"",
"Reply with ONLY this JSON:",
'{"site":"WatchCount","soldOnly":true,"listings":[{"title":"","price":0,"offerHidden":false,"condition":"used","match":"same","why":""}],"note":"one short sentence on anything that limits the read"}'
  ].join("\n");
}
function pct(a,q){ if(a.length===1)return a[0]; const i=(a.length-1)*q, lo=Math.floor(i), hi=Math.ceil(i); return a[lo]+(a[hi]-a[lo])*(i-lo); }
function crunchComps(res){
  const L=Array.isArray(res&&res.listings)?res.listings:[], seen=new Set(), kept=[], out=[];
  L.forEach(l=>{
    if(!l||typeof l!=="object")return;
    const title=String(l.title||"").replace(/\s+/g," ").trim().slice(0,90);
    const price=Math.round(Number(String(l.price==null?"":l.price).replace(/[^0-9.]/g,""))||0);
    const k=title.toLowerCase()+"|"+price; if(seen.has(k))return; seen.add(k);
    const match=String(l.match||"").toLowerCase(), cond=String(l.condition||"").toLowerCase();
    let why="";
    if(!(price>0))why="no price shown";
    else if(match==="different")why=String(l.why||"not the same item").slice(0,40);
    else if(l.offerHidden===true)why="Best Offer, real price hidden";
    else if(cond==="parts")why="parts / not working";
    if(why){ out.push({title,price,why}); return; }
    kept.push({title,price,cond,why:match==="close"?String(l.why||"close match").slice(0,40):""});
  });
  let pool=kept;
  const used=kept.filter(k=>k.cond!=="new");
  if(used.length>=3&&used.length<kept.length){ kept.filter(k=>k.cond==="new").forEach(k=>out.push({title:k.title,price:k.price,why:"new in box"})); pool=used; }
  let p=pool.map(k=>k.price).sort((a,b)=>a-b);
  if(p.length>=5){
    const q1=pct(p,.25),q3=pct(p,.75),iqr=q3-q1,lo=q1-1.5*iqr,hi=q3+1.5*iqr;
    pool=pool.filter(k=>{ if(k.price<lo||k.price>hi){ out.push({title:k.title,price:k.price,why:k.price>hi?"way above the rest":"way below the rest"}); return false; } return true; });
    p=pool.map(k=>k.price).sort((a,b)=>a-b);
  }
  const allNew=pool.length>0&&pool.every(k=>k.cond==="new");
  if(!p.length)return {stats:null,kept:[],out};
  return {stats:{n:p.length,lo:Math.round(pct(p,.25)),mid:Math.round(pct(p,.5)),hi:Math.round(pct(p,.75)),allNew},
          kept:pool.slice().sort((a,b)=>a.price-b.price),out};
}
function leftOutText(r){
  if(!r.out.length)return "";
  const g={}, lbl={}; r.out.forEach(o=>{ const k=o.why.toLowerCase(); g[k]=(g[k]||0)+1; if(!lbl[k])lbl[k]=o.why; });
  const parts=Object.keys(g).sort((a,b)=>g[b]-g[a]).slice(0,4).map(k=>g[k]+" "+lbl[k]);
  return `Left out ${r.out.length}: ${parts.map(esc).join(", ")}.`;
}
function compReadHTML(r,x){
  if(r.msg)return `<div class="tagWarn">${esc(r.msg)}</div>`;
  if(!r.stats)return `<div class="tagWarn">No usable sold prices in that screenshot. ${leftOutText(r)} Try a screenshot of just the sold list, zoomed in so the prices are sharp.</div>`;
  const s=r.stats, onNow=!!(st.market&&st.market.kind==="shot"&&st.market.key===mkKey()&&st.market.mid===s.mid);
  return `<div class="compRead">
    <div class="tiles" style="grid-template-columns:1fr 1fr 1fr;margin-top:12px">
      <div class="widget"><div class="l">Low</div><div class="v">${money(s.lo)}</div></div>
      <div class="widget" style="box-shadow:inset 0 1px 0 rgba(255,255,255,.13),inset 0 0 0 2px var(--accent)"><div class="l">Middle</div><div class="v">${money(s.mid)}</div></div>
      <div class="widget"><div class="l">High</div><div class="v">${money(s.hi)}</div></div>
    </div>
    <div class="cardHint" style="color:var(--ink)">From ${s.n} ${s.n===1?"sale":"sales"} on ${esc(r.site)}.${s.n<4?" That's thin &mdash; treat it as a rough guide.":""} ${leftOutText(r)}</div>
    ${s.allNew?`<div class="tagWarn">These all sold new in the box. A used one brings less &mdash; lean toward Low.</div>`:""}
    ${r.note?`<div class="cardHint">${esc(r.note)}</div>`:""}
    ${!onNow?`<button id="useComp" class="brassBtn" style="width:100%;padding:12px 0;margin-top:11px;font-size:14px">Use ${money(s.mid)} as the market price</button>`
      :`<div class="cardHint" style="color:var(--accent);font-weight:600">Step 4 is using the middle sold price.</div>`}
    <div class="cardHint">Middle means half sold for more and half for less, so one odd sale can't drag it. Set condition in step 5 against a typical used one.</div>
    <details class="shotList"><summary>See the ${r.kept.length} ${r.kept.length===1?"sale":"sales"} it used</summary>
      ${r.kept.map(k=>`<div class="shotLi"><span>${esc(k.title)}${k.why?` <i>${esc(k.why)}</i>`:""}</span><b>${money(k.price)}</b></div>`).join("")}
      ${r.out.length?`<div class="shotSub">Left out</div>${r.out.map(k=>`<div class="shotLi out"><span>${esc(k.title||"(no title)")} <i>${esc(k.why)}</i></span><b>${k.price?money(k.price):"&mdash;"}</b></div>`).join("")}`:""}
    </details></div>`;
}
function shotZoneHTML(x){
  if(!CAP.sample||!CAP.images)return "";
  const r=(st.compRead&&st.compRead.key===itemKey())?st.compRead:null, touch=isTouch();
  return `<div class="shotZone" id="shotZone">
    <span class="label" style="color:var(--ink);margin-bottom:6px">Bring the sold prices back</span>
    <div class="cardHint" style="margin-top:0">${touch
      ?"Screenshot the sold results, then tap <b style=\"color:var(--ink)\">Add screenshot</b>. It's your newest photo."
      :"Screenshot the sold list (<b style=\"color:var(--ink)\">Windows + Shift + S</b>, drag over the results), then press <b style=\"color:var(--ink)\">Ctrl + V</b> anywhere on this page. Or drag the picture in here."}</div>
    <div class="row2" style="gap:9px;flex-wrap:wrap;margin-top:10px">
      <label class="ghostBtn" style="margin:0;cursor:pointer">${shotFiles.length?"Add another":"Add screenshot"}<input id="shotIn" type="file" accept="${imgAccept()}" multiple style="display:none"></label>
      ${shotFiles.length?`<button id="shotGo" class="brassBtn" style="padding:10px 18px" ${shotBusy?"disabled":""}>${shotBusy?"Reading…":(r?"Read again":"Read the prices")}</button>`:""}
      ${shotBusy?`<button id="shotStop" class="ghostBtn">Stop</button>`:""}
    </div>
    ${shotFiles.length?`<div class="shotThumbs">${shotFiles.map((s,i)=>`<div class="shotT"><img data-shotimg="${i}" alt="screenshot ${i+1}"><button class="shotX" type="button" data-shotx="${i}" aria-label="Remove screenshot ${i+1}">&times;</button></div>`).join("")}</div>`:""}
    <div class="cardHint" id="shotMsg">${shotBusy?"Reading the prices. Usually 15 to 40 seconds.":(shotFiles.length&&!r?"Each read uses a little of your Claude usage.":"")}</div>
    ${r?compReadHTML(r,x):""}
  </div>`;
}
function refreshShots(){
  const z=document.getElementById("shotZone"); if(!z)return;
  const tmp=document.createElement("div"); tmp.innerHTML=shotZoneHTML(calcItem());
  const nz=tmp.firstElementChild; if(nz){ z.replaceWith(nz); wireShots(); }
}
async function addShots(files){
  const ok=(files||[]).filter(f=>f&&/^image\//.test(f.type||""));
  if(!ok.length)return;
  for(const f0 of ok){ if(shotFiles.length>=shotMax())break; const f=await normImage(f0); shotFiles.push({file:f,url:URL.createObjectURL(f)}); }
  refreshShots();
  const z=document.getElementById("shotZone"); if(z&&z.scrollIntoView)z.scrollIntoView({block:"nearest",behavior:"smooth"});
}
function shotErrCopy(code){
  switch(code){
    case "not_granted": case "sampling_disabled": return "This device isn't allowed to use Claude. Type the sold number into step 4 yourself.";
    case "rate_limited": return "Too many reads too fast. Give it a minute.";
    case "image_rejected": case "images_unavailable": return "Couldn't use that picture. Try a PNG or JPG screenshot.";
    case "invalid_json": return "The answer came back garbled. Tap Read the prices again.";
    case "session_expired": return "Signed out. Sign back in and try again.";
    default: return "The read failed. Type the sold number into step 4 yourself.";
  }
}
async function runShotRead(){
  if(!CAP.sample||!shotFiles.length||shotBusy)return;
  const x=calcItem(), key=itemKey();
  shotBusy=true; shotCtl=new AbortController(); refreshShots();
  try{
    const imgs=await prepShots(shotFiles.map(s=>s.file));
    const res=await CAP.sample.json(shotPrompt(x),{images:imgs,modelTier:"default",signal:shotCtl.signal});
    const c=crunchComps(res||{});
    st.compRead=Object.assign({key,site:String((res&&res.site)||"the screenshot").slice(0,24),note:String((res&&res.note)||"").slice(0,200)},c);
    if(res&&res.soldOnly===false&&!c.stats)st.compRead.msg="Those are items still for sale, not sold ones. On eBay turn on Sold Items (under Filter or All Filters), then screenshot again.";
  }catch(err){
    const code=(err&&err.code)||"upstream_error";
    shotBusy=false; refreshShots();
    if(code!=="cancelled"){ const m=document.getElementById("shotMsg"); if(m)m.innerHTML=`<span style="color:var(--warn)">${esc(shotErrCopy(code))}</span>`; }
    return;
  }
  shotBusy=false; refreshShots();
}
function useCompMid(){
  const r=st.compRead; if(!r||!r.stats)return;
  st.market={kind:"shot",key:mkKey(),mid:r.stats.mid,lo:r.stats.lo,hi:r.stats.hi,n:r.stats.n,site:r.site};
  st.editing=false; render();
}
function wireShots(){
  const z=document.getElementById("shotZone"); if(!z)return;
  const inp=document.getElementById("shotIn");
  if(inp)inp.onchange=()=>{ const f=Array.from(inp.files||[]); inp.value=""; addShots(f); };
  const go=document.getElementById("shotGo"); if(go)go.onclick=runShotRead;
  const stop=document.getElementById("shotStop"); if(stop)stop.onclick=()=>{ if(shotCtl)shotCtl.abort(); };
  z.querySelectorAll("[data-shotimg]").forEach(im=>{ const s=shotFiles[Number(im.dataset.shotimg)]; if(s)im.src=s.url; });
  z.querySelectorAll("[data-shotx]").forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.shotx), s=shotFiles[i]; if(s){ try{ URL.revokeObjectURL(s.url); }catch(e){} }
    shotFiles.splice(i,1); refreshShots(); });
  const u=document.getElementById("useComp"); if(u)u.onclick=useCompMid;
  z.ondragover=e=>{ e.preventDefault(); z.classList.add("drag"); };
  z.ondragleave=()=>z.classList.remove("drag");
  z.ondrop=e=>{ e.preventDefault(); z.classList.remove("drag"); addShots(Array.from((e.dataTransfer&&e.dataTransfer.files)||[])); };
  const card=document.getElementById("compsCard"); if(card)card.onpointerdown=()=>{ pasteTo="shot"; };
}
/* Ctrl+V a screenshot anywhere on the item page */
document.addEventListener("paste",e=>{
  if(st.mode!=="item"||!CAP.sample||!CAP.images)return;
  const cd=e.clipboardData; if(!cd)return;
  let files=Array.from(cd.files||[]).filter(f=>/^image\//.test(f.type));
  if(!files.length)files=Array.from(cd.items||[]).filter(i=>i.kind==="file"&&/^image\//.test(i.type)).map(i=>i.getAsFile()).filter(Boolean);
  if(!files.length)return;
  e.preventDefault();
  if(pasteTo==="photo"&&document.getElementById("photoCard")){ setPhoto(files[0]); return; }
  addShots(files);
});

/* ================= CAMERA =================
   Tablet or phone: "Take picture" opens the camera itself, no photo roll.
   Computer with a webcam or a counter camera: a live view with a button,
   only where the Claude viewer lets the page use the camera. Either way the
   picture goes straight into the reader. */
let camStream=null, camDevices=[], camIdx=-1, camFailed=false;
function camLiveOK(){
  if(camFailed||isTouch()||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;
  /* Ask the permissions policy only if the browser has one to ask. It used to
     fall through to false when it did not, which is every browser but Chrome
     - so a camera plugged into the desk was never offered there at all. If
     it cannot be checked, offer it: getUserMedia says no soon enough, and a
     refusal sets camFailed and takes the button away. */
  try{ const pol=document.permissionsPolicy||document.featurePolicy;
       if(pol&&typeof pol.allowsFeature==="function")return !!pol.allowsFeature("camera"); }catch(e){}
  return true;
}
/* lead: this is the phone's first move, so the target is thumb-sized. The
   padding is set here rather than in a stylesheet rule because the inline
   style on this label would win over one anyway. */
function camButtonHTML(lead){
  if(isTouch())return `<label class="brassBtn camBtn${lead?" camBtnLead":""}" style="cursor:pointer;margin:0;padding:${lead?"18px 24px":"10px 18px"};display:inline-flex;align-items:center;justify-content:center;${lead?"flex:1;min-width:190px;font-size:17px;":""}">${lead?"\uD83D\uDCF7 Take a picture":"Take picture"}<input id="photoCam" type="file" accept="image/*" capture="environment" style="display:none"></label>`;
  if(camLiveOK())return `<button id="camLive" class="brassBtn" style="padding:10px 18px">Use camera</button>`;
  return "";
}
async function setPhoto(f){
  if(!f)return;
  photoFile=await normImage(f);
  /* Kept so a failure can say what it was carrying. A read that dies without
     saying how big the picture was, or what format it was in, costs another
     round trip to find out - and HEIC from a phone camera is exactly the
     case that slips through the shrinking step untouched. */
  st.photoInfo={type:f.type||"(unknown)",was:f.size,sent:(photoFile&&photoFile.size)||0,
                shrunk:!!(photoFile&&photoFile!==f)};
  st.photoRead=null; render();
  runPhotoRead();
}
async function openCam(){
  closeCam();
  const m=document.createElement("div"); m.id="camModal"; m.className="camModal"; m.setAttribute("role","dialog"); m.setAttribute("aria-label","Camera");
  m.innerHTML=`<div class="camBox"><video id="camVid" autoplay playsinline muted></video>
    <div class="camMsg" id="camMsg">Starting the camera…</div>
    <div class="row2" style="gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
      <button id="camSnap" class="brassBtn" style="padding:14px 28px;font-size:16px" disabled>Take picture</button>
      <button id="camSwap" class="ghostBtn" style="padding:12px 18px;font-size:14px" hidden>Switch camera</button>
      <button id="camX" class="ghostBtn" style="padding:12px 18px;font-size:14px">Cancel</button></div></div>`;
  document.body.appendChild(m);
  document.getElementById("camX").onclick=closeCam;
  document.getElementById("camSnap").onclick=snapCam;
  document.getElementById("camSwap").onclick=()=>{ if(camDevices.length>1){ camIdx=(camIdx+1)%camDevices.length; startCam(); } };
  m.addEventListener("keydown",e=>{ if(e.key==="Escape")closeCam(); if(e.key===" "||e.key==="Enter"){ if(e.target&&e.target.id==="camSnap")return; } });
  await startCam();
}
async function startCam(){
  const msg=document.getElementById("camMsg");
  if(camStream){ camStream.getTracks().forEach(t=>t.stop()); camStream=null; }
  let saved=null; try{ saved=localStorage.getItem("pawndesk:cam"); }catch(e){}
  const video={width:{ideal:1920},height:{ideal:1080}}, dev=camDevices[camIdx];
  if(dev)video.deviceId={exact:dev.deviceId}; else if(saved)video.deviceId={ideal:saved}; else video.facingMode={ideal:"environment"};
  try{
    camStream=await navigator.mediaDevices.getUserMedia({video,audio:false});
    const v=document.getElementById("camVid");
    if(!v){ camStream.getTracks().forEach(t=>t.stop()); camStream=null; return; }
    v.srcObject=camStream; try{ await v.play(); }catch(e){}
    const snap=document.getElementById("camSnap"); if(snap){ snap.disabled=false; snap.focus(); }
    if(msg)msg.textContent="Fill the frame. Get the model plate or stamp in focus.";
    const all=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==="videoinput"); camDevices=all;
    const tr=camStream.getVideoTracks()[0], s=tr&&tr.getSettings?tr.getSettings():null;
    if(s&&s.deviceId){ camIdx=Math.max(0,all.findIndex(d=>d.deviceId===s.deviceId)); try{ localStorage.setItem("pawndesk:cam",s.deviceId); }catch(e){} }
    const sw=document.getElementById("camSwap"); if(sw)sw.hidden=all.length<2;
  }catch(err){
    camFailed=true;
    if(msg)msg.innerHTML=`<span style="color:var(--warn)">${esc(err&&err.name==="NotAllowedError"?"The camera is blocked here. Close this and use Choose photo.":"Couldn't start the camera. Close this and use Choose photo.")}</span>`;
  }
}
function snapCam(){
  const v=document.getElementById("camVid"); if(!v||!v.videoWidth)return;
  const c=document.createElement("canvas"); c.width=v.videoWidth; c.height=v.videoHeight; c.getContext("2d").drawImage(v,0,0);
  c.toBlob(b=>{ if(!b)return; closeCam(); setPhoto(new File([b],"counter-photo.jpg",{type:"image/jpeg"})); },"image/jpeg",0.92);
}
function closeCam(){
  if(camStream){ camStream.getTracks().forEach(t=>t.stop()); camStream=null; }
  const m=document.getElementById("camModal"); if(m)m.remove();
  if(camFailed){ try{ render(); }catch(e){} }
}

/* the tab icon, for when the page is opened on its own */
(function(){ try{
  const svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#0B0D13'/><circle cx='32' cy='32' r='19' fill='none' stroke='#2A3142' stroke-width='8'/><path d='M18.6 45.4A19 19 0 1 1 45.4 45.4' fill='none' stroke='#00E8A0' stroke-width='8' stroke-linecap='round'/></svg>";
  const href="data:image/svg+xml,"+encodeURIComponent(svg), head=document.head||document.documentElement;
  const put=(rel,h,type)=>{ let l=document.querySelector('link[rel="'+rel+'"]'); if(!l){ l=document.createElement("link"); l.rel=rel; head.appendChild(l); } if(type)l.type=type; l.href=h; };
  put("icon",href,"image/svg+xml");
  let tc=document.querySelector('meta[name="theme-color"]'); if(!tc){ tc=document.createElement("meta"); tc.name="theme-color"; head.appendChild(tc); } tc.content="#0B0D13";
}catch(e){} })();



/* ================= MODEL PRICE LIST — refreshed weekly by a scheduled task =================
   What a USED one in good working shape really sells for: the middle half of recent
   sales, whole dollars. Row: [id, item(s) it belongs to, name, low, high, confidence
   h/m/l, date checked, source page, what moves the price]. The weekly task rewrites
   only the low, high, confidence, date and source values. It never adds or removes rows. */
let MODEL_PRICES=[
 ["a1","g1","Remington 870 Express",300,400,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+870+express","Super Mag or extra barrels add; rust lowers"],
 ["a2","g1","Remington 870 Wingmaster",450,625,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+870+wingmaster","Bluing and wood; 16, 28 and .410 bring far more"],
 ["a3","g1","Mossberg 500",225,325,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+500","Combo barrels and chokes add"],
 ["a4","g1","Mossberg 590 / 590A1",380,550,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+590a1","590A1 heavy barrel on top; plain 590 less"],
 ["a5","g1","Maverick 88",150,210,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=maverick+88","Extra barrel adds a little"],
 ["a6","g1","Mossberg 835 Ulti-Mag",250,350,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+835+ulti-mag","Camo turkey or waterfowl combos on top"],
 ["a7","g1","Benelli Nova / SuperNova",290,410,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=benelli+nova","SuperNova and camo bring more"],
 ["a8","g1","Browning BPS",525,725,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=browning+bps","Walnut over synthetic; small gauges far more"],
 ["a9","g2","Remington 1100",450,675,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+1100","Plain 12 ga lowest; LT-20 and small gauges higher"],
 ["a10","g2","Remington 11-87",550,750,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+11-87","Premier walnut over synthetic; slug barrels add"],
 ["a11","g2","Beretta A300 Outlander",525,675,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=beretta+a300+outlander","Camo and wood over black synthetic"],
 ["a12","g2","Beretta A400",1175,1500,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=beretta+a400","Xtreme Plus higher; base Xplor Action lower"],
 ["a13","g2","Benelli M2",875,1150,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=benelli+m2","Field camo and 20 ga higher; worn guns lower"],
 ["a14","g2","Benelli Super Black Eagle",1075,1450,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=benelli+super+black+eagle+3","SBE 3 about $1,350+; SBE II $1,000–1,200"],
 ["a15","g2","Browning A5",1050,1300,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=browning+a5+hunter","Hunter walnut and Wicked Wing above Stalker"],
 ["a16a","g2","Mossberg 930",400,500,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+930","Waterfowl camo on top"],
 ["a16b","g2","Mossberg 940",575,700,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+940","JM Pro brings the top end"],
 ["a17","g2","Stoeger M3000 / M3500",350,450,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=stoeger+m3500","M3500 camo over M3000 synthetic"],
 ["a18","g2","Winchester SX4",625,800,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=winchester+sx4","Waterfowl camo and 20 ga Field bring more"],
 ["a19","g3","Remington 700",450,700,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+700+bdl","Older walnut BDL highest; SPS synthetic lowest"],
 ["a20","g3","Winchester Model 70",750,975,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=winchester+model+70","Featherweight walnut higher; synthetic lower"],
 ["a21","g3","Savage Axis",240,325,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=savage+axis","Axis II AccuTrigger adds"],
 ["a22","g3","Savage 110",375,525,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=savage+110","Newer AccuFit and Apex higher; old plain 110s lower"],
 ["a23","g3","Ruger American Rifle",340,450,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+american+rifle","Gen II and magnum calibers higher"],
 ["a24","g3","Tikka T3x",650,825,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=tikka+t3x","Stainless and Roughtech higher"],
 ["a25","g3","Browning X-Bolt",700,900,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=browning+x-bolt","Medallion walnut and stainless bring more"],
 ["a26","g4","Marlin 336",575,800,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=marlin+336","JM-stamped walnut on top; Remington-era lower"],
 ["a27","g4","Winchester Model 94",500,700,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=winchester+94+30-30","Commemoratives vary; 1964–71 guns lower"],
 ["a28","g4","Henry Big Boy",650,775,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=henry+big+boy","Side gate slightly higher; scratched brass lower"],
 ["a29","g4","Henry lever .22 (H001 / Golden Boy)",325,475,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=henry+golden+boy","Golden Boy $450–500; plain H001 $325–375"],
 ["a30","g6","Ruger 10/22",215,300,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+10%2F22+carbine","Walnut, older or stainless higher"],
 ["a31","g6","Marlin Model 60",175,250,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=marlin+model+60","Feed tube condition matters"],
 ["a32","g5","AR-15, entry-level",375,500,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=psa+ar-15","Optic, mags and free-float rail add; unknown builds lower"],
 ["a33","g5","S&W M&P15 Sport II",425,525,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=m%26p15+sport+ii","M-LOK versions and extra mags help"],
 ["a34","g5","Ruger AR-556",425,500,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+ar-556","Free-float MPR higher"],
 ["a35","SKS rifle","SKS",450,625,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=sks","Matching Chinese over Yugo; sporterized much lower"],
 ["a36","AK-pattern rifle","AK-pattern rifle",625,825,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=wasr-10","WASR-10 and forged builds higher"],
 ["a37a","g9","CVA Accura",400,525,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=cva+accura","Scope and case add"],
 ["a37b","g9","CVA Optima",190,260,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=cva+optima","Scope and case add"],
 ["a37c","g9","CVA Wolf",125,175,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=cva+wolf","Entry-level; scope adds a little"],
 ["a38a","g9","Thompson/Center Encore",550,700,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=encore+209x50","Pro Hunter on top"],
 ["a38b","g9","Thompson/Center Impact",175,250,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=thompson+center+impact","Entry-level break-action"],
 ["b1","g7","Glock 17",370,440,"m","2026-09-19","https://gunwatcher.com/glock-17-gen-5-value-sold-information/market-price","Gen 5 and MOS on top; police trade-ins lower"],
 ["b2","g7","Glock 19",390,470,"h","2026-09-19","https://gunwatcher.com/glock-19-gen-5-value-sold-information/market-price","Gen 5 about $50 over Gen 4; night sights add"],
 ["b3","g7","Glock 26",370,440,"m","2026-09-19","https://gunwatcher.com/glock-26-value-sold-information/market-price","Gen 5 and extra mags on top"],
 ["b4","g7","Glock 43 / 43X",350,430,"m","2026-09-19","https://gunwatcher.com/glock-43x-value-sold-information/market-price","43X and MOS on top; G43 about $50 less"],
 ["b5","g7","Glock 48",360,425,"m","2026-09-19","https://gunwatcher.com/glock-48-value-sold-information/market-price","MOS and two-tone bring more"],
 ["b6","g7","Glock 22 / 23 (.40)",300,370,"m","2026-09-19","https://gunwatcher.com/glock-23-value-sold-information/market-price",".40 is soft; lots of police trade-ins"],
 ["b7","g7","Sig Sauer P365",375,475,"m","2026-09-19","https://gunwatcher.com/sig-sauer-p365-value-sold-information/market-price","XL, X-Macro or optic on top"],
 ["b8","g7","Sig Sauer P320",360,440,"m","2026-09-19","https://gunwatcher.com/sig-sauer-p320-value-sold-information/market-price","Trade-ins and holster wear cheaper"],
 ["b9","g7","Sig Sauer P226 / P229",575,800,"m","2026-09-19","https://gunwatcher.com/sig-sauer-p226-value-sold-information/market-price","Police trade-ins $450–650; Legion much higher"],
 ["b10","g7","S&W M&P9 2.0",320,400,"m","2026-09-19","https://gunwatcher.com/smith-wesson-m-p9-value-sold-information/market-price","Optics-ready on top; 1.0 models lower"],
 ["b11","g7","S&W M&P Shield / Shield Plus",260,340,"m","2026-09-19","https://gunwatcher.com/smith-wesson-m-p-shield-plus-value-sold-information/market-price","Shield Plus about $50 over the original"],
 ["b12","g7","S&W Bodyguard 380",220,280,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=bodyguard+380","Laser adds; Bodyguard 2.0 higher"],
 ["b13","g7","Springfield Hellcat",340,410,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=hellcat","OSP, Pro or a mounted optic on top"],
 ["b14","g7","Springfield XD / XDs",240,310,"m","2026-09-19","https://gunwatcher.com/springfield-xd-value-sold-information/market-price","XD Mod.2 and Elite above"],
 ["b15","g7","Taurus G2C / G3C",130,185,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=taurus+g3c","Cheap new price caps it; G3C over G2C"],
 ["b16","g7","Taurus G3 / GX4",145,210,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=taurus+gx4","GX4 above G3; optic cut adds"],
 ["b17","g7","Ruger LCP",170,230,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+lcp+max","LCP MAX on top; original LCP bottom"],
 ["b18","g7","Ruger Security-9 / Max-9",185,245,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+max-9","Max-9 edges Security-9"],
 ["b19","g7","Ruger Mark IV",370,490,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+mark+iv","Target, Hunter and Lite above 22/45"],
 ["b20","g7","Canik TP9",265,335,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=canik+tp9sf+elite","SFx, Mete and Rival on top"],
 ["b21a","g7","CZ P-10",330,400,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=cz+p-10","Optics-ready adds"],
 ["b21b","g7","CZ 75",550,700,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=cz+75+b","SP-01 and Shadow on top"],
 ["b22","g7","Beretta 92FS / M9",450,575,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=beretta+92fs","Italian and Inox on top; police trade-ins near $400"],
 ["b23","g7","1911 (Rock Island, Tisas, Springfield Mil-Spec)",330,480,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=rock+island+1911","Tisas and RIA $300–400; Springfield $450–550"],
 ["b24","g7","Hi-Point C9",110,150,"l","2026-09-19","https://gunwatcher.com/hi-point-c9-value-sold-information/market-price","Low new price caps it"],
 ["b25","g7","SCCY CPX",100,140,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=sccy+cpx-2","New CPX-2 near $130 caps it"],
 ["b26","g8","S&W 686",625,800,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=smith+wesson+686","Pre-lock, 686 Plus and 6 in bring more"],
 ["b27","g8","S&W 642 / 638",320,400,"h","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=smith+wesson+642","No-lock and laser grips add"],
 ["b28","g8","Ruger GP100",540,660,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+gp100","Wiley Clapp, Match Champion and 10mm above base"],
 ["b29","g8","Ruger SP101",450,560,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+sp101","3 in and 4 in above 2.25 in"],
 ["b30","g8","Ruger LCR",370,450,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+lcr",".357 and laser above .38 or .22"],
 ["b31","g8","Ruger Blackhawk / Single-Six",400,575,"l","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+blackhawk","Blackhawk above Single-Six; convertibles add"],
 ["b32","g8","Taurus Judge",320,400,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=taurus+judge","Public Defender, stainless and Magnum above basic"],
 ["b33","g8","Colt Python (2020+)",950,1200,"m","2026-09-19","https://www.webuyguns.com/valuations/colt/python","New retail near $1,100 caps it; older Pythons far more"],
 ["c1","p1","Stihl MS 170 / 180",100,150,"m","2026-09-19","https://chainsawnerds.com/stihl-ms-170-chainsaw-price-guide/","MS 180 slightly more; easy start and good chain"],
 ["c2","p1","Stihl MS 250",175,260,"m","2026-09-19","https://chainsawnerds.com/ms-250-stihl-chainsaw-price-guide/","Compression and bar wear"],
 ["c3","p1","Stihl MS 271 Farm Boss",250,350,"m","2026-09-19","https://www.tractorhouse.com/listings/for-sale/stihl/ms/chainsaws/1186","20 in bar, low hours"],
 ["c4","p1","Stihl MS 291",240,340,"l","2026-09-19","https://www.tractorhouse.com/listings/for-sale/stihl/ms-291/chainsaws/1186","Tracks the MS 271"],
 ["c5","p1","Stihl MS 362",425,600,"m","2026-09-19","https://opeforum.com/threads/lightly-used-stihl-ms362.32837/","M-Tronic vs carb; cylinder condition"],
 ["c6","p1","Stihl MS 461 / 462",650,850,"m","2026-09-19","https://opeforum.com/threads/ms462.32595/","MS 462 more; piston condition"],
 ["c7","p1","Husqvarna 450 / 445",160,240,"m","2026-09-19","https://chainsawnerds.com/used-husqvarna-chainsaws-worth-owning/","450 over 445"],
 ["c8","p1","Husqvarna 455 Rancher",200,300,"m","2026-09-19","https://chainsawnerds.com/used-husqvarna-chainsaws-worth-owning/","Bar, starting and compression"],
 ["c9","p1","Husqvarna 460 Rancher",250,360,"m","2026-09-19","https://chainsawnerds.com/used-husqvarna-chainsaws-worth-owning/","24 in bar adds"],
 ["c10","p1","Echo CS-400 / CS-4010",110,175,"l","2026-09-19","","Thin sales data; CS-4010 is newer"],
 ["c11","p1","Echo CS-590 Timber Wolf",220,320,"l","2026-09-19","https://www.treetrader.com/listings/for-sale/echo/cs590-timber-wolf/chainsaws-outdoor-power/1186","Bar and chain included matters a lot"],
 ["c12","p2","Stihl FS 56 / FS 91",90,180,"l","2026-09-19","https://used.equipmentshare.com/products/stihl-fs-91-r-563012","FS 91 about double the FS 56"],
 ["c13","p2","Stihl FS 131",200,300,"l","2026-09-19","","Bike-handle and blade kits add"],
 ["c14","p2","Echo SRM-225",85,140,"l","2026-09-19","","Starts easily; head and shaft condition"],
 ["c15","p3","Stihl BR 600",275,375,"l","2026-09-19","https://used.equipmentshare.com/search?q=stihl","Commercial wear, harness and tube"],
 ["c16","p3","Stihl BR 800",350,475,"l","2026-09-19","","Hours and landscaper wear"],
 ["c17","p3","Echo PB-580T",190,275,"l","2026-09-19","https://opeforum.com/threads/need-backpack-blower-asap-please.26602/","Lawn-crew wear lowers price"],
 ["c18","p3","Echo PB-770T",275,375,"l","2026-09-19","https://opeforum.com/threads/would-you-buy-a-used-echo-pb-770t.8184/","Hours and carb history"],
 ["c19","p3","Husqvarna 350BT",120,180,"l","2026-09-19","","Homeowner grade; starting condition"],
 ["c20","p7|Inverter generator — 2kW","Honda EU2200i",650,850,"m","2026-09-19","https://www.machinerytrader.com/listings/for-sale/honda/eu2200i/construction-equipment","Hours and stale fuel"],
 ["c21","p7","Honda EU3000iS",1150,1600,"m","2026-09-19","https://www.machinerytrader.com/listings/for-sale/honda/eu3000is/construction-equipment","Hours; electric start working"],
 ["c22","p4","Honda HRX / HRN mower",225,375,"l","2026-09-19","https://www.tractorhouse.com/listings/used-honda-hrx217vka-lawn-mowers-outdoor-power-for-sale/?Category=1188&Manufacturer=HONDA&ModelGroup=HRX217VKA&Condition=USED","HRX over HRN; drive working"],
 ["c23","p5","John Deere E100–E130 / S100–S130",950,1500,"m","2026-09-19","https://www.tractorhouse.com/listings/for-sale/john-deere/e130/riding-lawn-mowers/1170","Hours, deck rust, transmission"],
 ["c24","p5","John Deere X350 / X380",2000,2900,"m","2026-09-19","https://www.machinerypete.com/lawn-and-garden/lawn-mowers/john-deere/x350","X380 and 48–54 in deck higher"],
 ["c25","Zero-turn mower","Residential zero-turn, 48–54 in",1700,2700,"m","2026-09-19","https://www.tractorhouse.com/listings/for-sale/husqvarna/z254/zero-turn-lawn-mowers/1191","Deere highest; hours and deck rust"],
 ["c26","t1","DeWalt 20V drill kit",65,110,"m","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Brushless DCD791 over DCD771; battery size"],
 ["c27","t1","DeWalt 20V impact driver kit",75,115,"l","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","2Ah vs 5Ah battery drives most of it"],
 ["c28","t1","Milwaukee M18 Fuel drill kit",150,220,"m","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Hammer drill and 5Ah batteries on top"],
 ["c29","t1","Milwaukee M18 Fuel impact driver kit",120,180,"m","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","5Ah packs add $35–55"],
 ["c30","t2","Milwaukee M18 Fuel 1/2 in impact wrench",185,250,"l","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Bare tool $150–190 plus a 5Ah pack"],
 ["c31","t1","Makita 18V LXT drill kit",60,100,"l","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Brushless and battery size"],
 ["c32","t1","Ryobi ONE+ drill kit",30,55,"m","2026-09-19","https://lambertpawn.com/the-power-tool-brands-that-hold-their-value-best-and-why-pawn-shops-love-them/","Low resale; brushless lifts it"],
 ["d1","h1","Leupold VX-3HD",300,390,"m","2026-09-19","https://www.hunttalk.com/threads/sold-leupold-vx-3hd-3-5-10x40-cds-zl-scope.331969/","CDS dial and box bring the top end"],
 ["d2","h1","Leupold VX-Freedom",155,220,"m","2026-09-19","https://www.hunttalk.com/threads/leupold-vx-freedom-3-9x40-matte-duplex.326600/","CDS version up to about $275"],
 ["d3","h1","Vortex Crossfire II",65,100,"m","2026-09-19","https://rokslide.com/forums/threads/vortex-crossfire-ii-3-9x40.363828/","New on sale near $130 caps it"],
 ["d4","h1","Vortex Diamondback scope",100,150,"m","2026-09-19","https://www.hunttalk.com/threads/vortex-diamondback-4-12x40.322162/","Tactical version a bit more"],
 ["d5","h1","Vortex Viper PST Gen II",550,750,"m","2026-09-19","https://rokslide.com/forums/threads/vortex-viper-pst-gen-ii-5x25x50-550.355234/","FFP and like-new with box higher"],
 ["d6","h3","Vortex Ranger 1800",110,150,"m","2026-09-19","https://www.hunttalk.com/threads/sold-vortex-ranger-1800-range-finder-125-tyd.327366/","Box and case help"],
 ["d7","h2","Vortex Diamondback HD 10x42",110,160,"m","2026-09-19","https://rokslide.com/forums/threads/150-diamondback-hd-10x42.308408/","New sale prices hold used down"],
 ["d8","h8","Minn Kota Terrova",850,1350,"l","2026-09-19","https://www.in-depthoutdoors.com/community/forums/topic/whats-my-terrova-worth/","i-Pilot Link, shaft length and year"],
 ["d9","h8","Minn Kota Endura",80,150,"l","2026-09-19","","30 lb near low end, 55 lb near high"],
 ["d10","h4|Cellular game camera","Tactacam Reveal X",50,75,"l","2026-09-19","https://www.trailcampro.com/products/used-tactacam-reveal-x-gen-2","Needs a working plan"],
 ["d11","h5","Mathews V3X",550,750,"m","2026-09-19","https://www.podiumarcher.com/collections/used-v3x-33","Draw weight and length; lefty lower"],
 ["d12","h5","Hoyt RX-7",750,1000,"l","2026-09-19","https://www.podiumarcher.com/collections/used-bows/hoyt","Ultra vs standard; string condition"],
 ["d13","h6","Ravin R10 / R26",600,950,"l","2026-09-19","https://ravincrossbows.com/crossbows/crossbow-series/reconditioned","R26 over R10"],
 ["d14","h6","TenPoint crossbow",450,750,"l","2026-09-19","https://www.tenpointcrossbows.com/product-category/certified-pre-owned-crossbows/","Titan low, Viper S400 high; ACUdraw adds"],
 ["d15","Fish finder","Garmin Striker Vivid",170,290,"l","2026-09-19","","7cv over 5cv; must include transducer"],
 ["d16","Fish finder","Humminbird Helix 7",300,550,"l","2026-09-19","","Generation and Mega SI imaging"],
 ["d17","m2","Fender Player Stratocaster",480,620,"h","2026-09-19","https://axedb.com/fender/stratocaster/player","Player II launch pushed prices down"],
 ["d18a","m2","Squier Affinity Stratocaster",150,200,"m","2026-09-19","https://axedb.com/squier/affinity-series-stratocaster-with-maple-fretboard","Pack amps add little"],
 ["d18b","m2","Squier Classic Vibe Stratocaster",290,370,"m","2026-09-19","https://axedb.com/brand/squier","About double an Affinity"],
 ["d19","m2","Gibson Les Paul Standard",1750,2100,"h","2026-09-19","https://axedb.com/gibson/les-paul/standard-50s","Case, finish and top figure"],
 ["d20","m2","Epiphone Les Paul Standard",320,500,"m","2026-09-19","https://axedb.com/epiphone/les-paul/standard","2020+ models sell higher"],
 ["d21","m1","Martin D-28",2300,2900,"m","2026-09-19","https://axedb.com/martin/d-28/standard","Original case, no cracks or neck reset"],
 ["d22a","m1","Taylor 114ce",550,700,"m","2026-09-19","https://axedb.com/brand/taylor","Case helps"],
 ["d22b","m1","Taylor 214ce",800,1050,"m","2026-09-19","https://treblemakers.shop/instruments/taylor-214ce","Case helps"],
 ["d23","m3","Fender Blues Junior",450,560,"m","2026-09-19","https://reverb.com/p/fender-blues-junior-iv-15-watt-1x12-guitar-combo","Special editions higher"],
 ["e1","e4","iPhone 13",215,275,"h","2026-09-19","https://swappa.com/prices/apple-iphone-13","Battery health and carrier lock"],
 ["e2","e4","iPhone 14",255,330,"h","2026-09-19","https://swappa.com/prices/apple-iphone-14","Battery health; unlocked adds about $20"],
 ["e3","e4","iPhone 15",350,430,"h","2026-09-19","https://swappa.com/prices/apple-iphone-15","Unlocked and battery health"],
 ["e4a","e4","iPhone 15 Pro",440,530,"m","2026-09-19","https://swappa.com/prices/apple-iphone-15-pro","Storage and battery health"],
 ["e4b","e4","iPhone 15 Pro Max",540,640,"m","2026-09-19","https://swappa.com/prices/apple-iphone-15-pro-max","Storage and battery health"],
 ["e5","e4","iPhone 16",480,580,"h","2026-09-19","https://swappa.com/prices/apple-iphone-16","Carrier-locked sells lower"],
 ["e6a","e4","iPhone 16 Pro",600,700,"m","2026-09-19","https://swappa.com/prices/apple-iphone-16-pro","Storage and battery health"],
 ["e6b","e4","iPhone 16 Pro Max",700,800,"m","2026-09-19","https://swappa.com/prices/apple-iphone-16-pro-max","Storage and battery health"],
 ["e7","e4","iPhone 17",660,770,"m","2026-09-19","https://swappa.com/prices/apple-iphone-17","Still the current base model"],
 ["e8","e4","Galaxy S23",210,265,"m","2026-09-19","https://swappa.com/prices/samsung-galaxy-s23","Screen burn-in and carrier lock"],
 ["e9","e4","Galaxy S24",290,370,"m","2026-09-19","https://swappa.com/prices/samsung-galaxy-s24","Unlocked brings noticeably more"],
 ["e10","e4","Galaxy S25",380,470,"m","2026-09-19","https://swappa.com/prices/samsung-galaxy-s25","256GB adds about $80"],
 ["e11","e3","iPad 9th gen",140,185,"m","2026-09-19","https://swappa.com/prices/apple-ipad-9th-gen","Cheap refurbs cap it"],
 ["e12","e3","iPad 10th gen",220,300,"m","2026-09-19","https://swappa.com/prices/apple-ipad-10th-gen","Cheap refurbs drag it down"],
 ["e13","e5","PlayStation 5 (disc)",370,460,"h","2026-09-19","https://www.pricecharting.com/game/playstation-5/playstation-5-console-disc-version","Slim about $40 over original"],
 ["e14","e5","PlayStation 5 Digital",320,410,"m","2026-09-19","https://www.pricecharting.com/game/playstation-5/playstation-5-slim-digital-edition","$40–60 under the disc model"],
 ["e15","e5","PlayStation 4",90,140,"h","2026-09-19","https://www.pricecharting.com/console/playstation-4?genre-name=systems","PS4 Pro runs $150–200"],
 ["e16","e5","Xbox Series X",420,530,"m","2026-09-19","https://www.pricecharting.com/game/xbox-series-x/xbox-series-x-console","New price hikes pushed used up"],
 ["e17","e5","Xbox Series S",210,290,"m","2026-09-19","https://www.pricecharting.com/game/xbox-series-x/xbox-series-s-console","1TB and boxed sell higher"],
 ["e18","e5","Xbox One S / One X",100,170,"m","2026-09-19","https://www.pricecharting.com/console/xbox-one?genre-name=systems","One X $140–180"],
 ["e19","e5","Nintendo Switch OLED",185,240,"h","2026-09-19","https://www.pricecharting.com/console/nintendo-switch?genre-name=systems","Special editions and box add $20–40"],
 ["e20","e5","Nintendo Switch",135,180,"h","2026-09-19","https://www.pricecharting.com/console/nintendo-switch?genre-name=systems","Needs dock and Joy-Cons; drift cuts value"],
 ["e21","e5|Handheld game console","Nintendo Switch Lite",95,130,"h","2026-09-19","https://www.pricecharting.com/console/nintendo-switch?genre-name=systems","Special editions $140–160"],
 ["e22","e5","Nintendo Switch 2",350,415,"h","2026-09-19","https://www.pricecharting.com/game/nintendo-switch-2/nintendo-switch-2-console","Complete with dock and Joy-Cons"],
 ["e23","Handheld game console","Steam Deck",400,520,"m","2026-09-19","https://www.pricecharting.com/game/pc-games/steam-deck-256-gb","512GB and case add"],
 ["e24","e2","MacBook Air M1",320,410,"m","2026-09-19","https://swappa.com/prices/macbook-air-2020-13","Battery cycles; 16GB adds"],
 ["e25","e2","MacBook Air M2",540,660,"m","2026-09-19","https://swappa.com/prices/macbook-air-2022-13","512GB or 16GB adds about $100"],
 ["e26","GoPro / action camera","GoPro Hero 11 / 12",180,270,"m","2026-09-19","https://swappa.com/prices/gopro-hero12","Extra batteries add"],
 ["e27a","Camera drone","DJI Mini 3",330,420,"l","2026-09-19","https://swappa.com/drones/price/dji-mini-3","Fly More combo adds"],
 ["e27b","Camera drone","DJI Mini 4 Pro",690,850,"l","2026-09-19","https://swappa.com/drones/price/dji-mini-4-pro","Fly More combo adds"],
 ["e28","VR headset","Meta Quest 3",320,420,"m","2026-09-19","https://swappa.com/prices/meta-quest-3","New price went up in 2026"],
 ["e29","Smart watch","Apple Watch Series 8 / 9",120,190,"m","2026-09-19","https://swappa.com/prices/apple-watch-series-9-45mm","Battery health; 45mm adds"],
 ["f1","r2","Honda Rancher 420",3800,5400,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/honda/trx420fm1-ft-rnchr-4x4-420cc/values","Newer years and EPS/DCT trims on top"],
 ["f2","r2","Honda Foreman 520",4200,5900,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/honda/trx520fm1-ft-frmn-4x4-518cc/values","EPS and low hours add"],
 ["f3","r2","Polaris Sportsman 570",3600,5200,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/polaris/sportsman-570-567cc/values","EPS and Premium trims add"],
 ["f4","r2","Can-Am Outlander 570",3800,5500,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/can-am/outlander-570-570cc/values","DPS and XT trims add $700–1,500"],
 ["f5","r2","Yamaha Grizzly 700",5400,7400,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/yamaha/grizzly-eps-4wd-686cc/values","SE trims and low hours add"],
 ["f6","r2","Kawasaki Brute Force 750",4900,6900,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/kawasaki/kvf750glf-bruteforce-4x4i-749cc/values","EPS adds about $800"],
 ["f7a","UTV / side-by-side","Polaris Ranger 570",5800,8000,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/polaris/ranger-570-567cc/values","Full-size and EPS add"],
 ["f7b","UTV / side-by-side","Polaris Ranger 1000",8300,10500,"l","2026-09-19","https://www.jdpower.com/motorcycles/2020/polaris/ranger-1000-eps-999cc/values","Crew and Premium trims add"],
 ["f8","UTV / side-by-side","Polaris RZR 900 / XP 1000",7500,11500,"l","2026-09-19","https://www.jdpower.com/motorcycles/2020/polaris/rzr-900-eps-875cc/values","RZR 900 low end, XP 1000 top"],
 ["f9","UTV / side-by-side","Kawasaki Mule",4300,7000,"m","2026-09-19","https://www.jdpower.com/motorcycles/2020/kawasaki/kaf620mlf-mule-4010-4x4-617cc/values","Mule SX low end; 4010 4x4 top"],
 ["f10","UTV / side-by-side","John Deere Gator XUV",8500,13500,"l","2026-09-19","https://www.machinerypete.com/other/atvs-and-utility-vehicles/john-deere/xuv590m","835 and cab push the top"],
 ["f11","Golf cart","Club Car Precedent",3800,5800,"m","2026-09-19","https://golfcartsearch.com/golf-cart-value-calculator/club-car/precedent","Lithium or new batteries add $1,500+"],
 ["f12","Golf cart","EZGO TXT",3300,5000,"m","2026-09-19","https://golfcartsearch.com/golf-cart-value-calculator/ezgo/txt","Battery age, lift and seats"],
 ["f13","Golf cart","Yamaha Drive2",4500,6800,"m","2026-09-19","https://golfcartsearch.com/golf-cart-value-calculator/yamaha/drive","Gas QuieTech and lithium bring more"]
];
/* =================================================================================== */

/* how each row is recognized from the brand, model and details typed.
   First match wins, so the specific models sit above the general ones. */
const MP_MATCH=[
 ["a2",/wingmaster/],["a1",/\b870\b/],["a5",/maverick\s*88/],["a4",/\b590(a1)?\b/],["a6",/\b835\b/],["a3",/mossberg.*\b500\b/],
 ["a7",/\b(super\s*)?nova\b/],["a8",/\bbps\b/],["a10",/\b11\s*-?\s*87\b|\b1187\b/],["a9",/\b1100\b/],["a11",/\ba300\b/],["a12",/\ba400\b/],
 ["a14",/\bsbe\b|super\s*black\s*eagle/],["a13",/\bm2\b/],["a15",/\ba5\b|auto\s*-?\s*5\b/],["a16b",/\b940\b/],["a16a",/\b930\b/],
 ["a17",/\bm3[05]00\b/],["a18",/\bsx4\b/],["a19",/remington.*\b700\b|model\s*700\b/],["a20",/model\s*70\b|winchester.*\b70\b/],
 ["a21",/\baxis\b/],["a22",/savage.*\b110\b/],["a23",/ruger.*american|\bamerican\s*(rifle|predator|ranch|hunter)/],["a24",/\bt3x?\b/],
 ["a25",/x\s*-?\s*bolt/],["a26",/\b336\b/],["a27",/model\s*94\b|winchester.*\b94\b/],["a28",/big\s*boy/],["a29",/golden\s*boy|\bh001\b|henry/],
 ["a30",/10\s*\/\s*22|\b1022\b/],["a31",/marlin.*\b60\b/],["a33",/m&p\s*-?\s*15|\bmp\s*-?\s*15\b/],["a34",/ar\s*-?\s*556/],["a32",/\bar\s*-?\s*15\b|\bm4\b/],
 ["a35",/\bsks\b/],["a36",/\bak\b|\bak\s*-?\s*(47|74)\b|\bwasr\b/],["a37a",/accura/],["a37b",/optima/],["a37c",/cva.*\bwolf\b/],
 ["a38a",/encore|pro\s*hunter/],["a38b",/(thompson|t\/c|\btc\b).*impact/],
 ["b1",/\b(g|glock\s*)17\b/],["b2",/\b(g|glock\s*)19x?\b/],["b3",/\b(g|glock\s*)26\b/],["b4",/\b(g|glock\s*)43x?\b/],["b5",/\b(g|glock\s*)48\b/],["b6",/\b(g|glock\s*)2[23]\b/],
 ["b7",/p\s*365/],["b8",/p\s*320/],["b9",/p\s*22[69]\b/],["b12",/bodyguard/],["b11",/shield/],["b10",/m&p/],
 ["b13",/hellcat/],["b14",/\bxd[sme]?\b/],["b15",/\bg[23]c\b/],["b16",/\bg3x?\b|\bgx4\b/],["b17",/\blcp\b/],["b18",/security\s*-?\s*9|max\s*-?\s*9/],
 ["b19",/mark\s*iv|22\s*\/\s*45/],["b20",/canik|\btp\s*-?\s*9/],["b21a",/\bp\s*-?\s*10\b/],["b21b",/cz\s*75|shadow\s*2|sp\s*-?\s*01/],
 ["b22",/beretta.*\b92|\b92\s*fs\b|\bm9\b/],["b23",/\b1911\b/],["b24",/hi-?\s*point|\bc9\b/],["b25",/sccy|\bcpx/],
 ["b26",/\b686\b/],["b27",/\b64[2]\b|\b63[78]\b/],["b28",/gp\s*-?\s*100/],["b29",/sp\s*-?\s*101/],["b30",/\blcr/],["b31",/blackhawk|single\s*-?\s*six/],
 ["b32",/judge|public\s*defender/],["b33",/python/],
 ["c3",/ms\s*-?\s*271|farm\s*boss/],["c1",/ms\s*-?\s*1[78][01]\b/],["c2",/ms\s*-?\s*25[01]\b/],["c4",/ms\s*-?\s*291\b/],["c5",/ms\s*-?\s*362\b/],["c6",/ms\s*-?\s*46[12]\b/],
 ["c8",/\b455\b/],["c9",/\b460\b/],["c7",/\b(450|445)\b/],["c11",/cs\s*-?\s*590|timber\s*wolf/],["c10",/cs\s*-?\s*40(0|10)\b/],
 ["c13",/fs\s*-?\s*131/],["c12",/fs\s*-?\s*(56|91)\b/],["c14",/srm\s*-?\s*225/],["c16",/br\s*-?\s*800/],["c15",/br\s*-?\s*600/],
 ["c18",/pb\s*-?\s*770/],["c17",/pb\s*-?\s*580/],["c19",/350\s*-?\s*bt/],["c20",/eu\s*-?\s*2[02]00/],["c21",/eu\s*-?\s*3000/],["c22",/\bhr[xn]/],
 ["c24",/\bx3[58]0\b/],["c23",/\b(e1[0-3]0|s1[0-3]0)\b/],["c25",/\bz\s*-?\s*[23]\d\d\s*[a-z]?\b|\bzt1\b|ultima/],
 ["c27",/dewalt.*impact|dcf\s*-?\s*8/],["c26",/dewalt|dcd/],["c29",/(m18|milwaukee).*impact|impact.*(m18|milwaukee)/],["c28",/m18|milwaukee/],
 ["c30",/m18|milwaukee/],["c31",/makita|\blxt\b/],["c32",/ryobi|one\s*\+/],
 ["d2",/vx\s*-?\s*freedom/],["d1",/vx\s*-?\s*3/],["d3",/crossfire/],["d5",/viper\s*pst|\bpst\b/],["d4",/diamondback/],["d7",/diamondback/],
 ["d6",/ranger/],["d8",/terrova/],["d9",/endura/],["d10",/reveal\s*x|tactacam/],["d11",/\bv3x?\b/],["d12",/\brx\s*-?\s*7/],
 ["d13",/ravin|\br\s*-?\s*(10|26)\b/],["d14",/tenpoint|titan|viper\s*s400/],["d15",/striker/],["d16",/helix/],
 ["d18b",/squier.*(classic\s*vibe|\bcv\b)/],["d18a",/squier/],["d17",/fender.*strat|strat.*fender|player\s*strat/],
 ["d20",/epiphone.*les\s*paul/],["d19",/gibson.*les\s*paul(?!\s*(studio|tribute|junior|special|jr))/],["d21",/\bd\s*-?\s*28\b/],
 ["d22b",/\b214/],["d22a",/\b114/],["d23",/blues\s*(junior|jr)/],
 ["e4b",/iphone\s*15\s*pro\s*max/],["e4a",/iphone\s*15\s*pro/],["e3",/iphone\s*15\b/],["e6b",/iphone\s*16\s*pro\s*max/],["e6a",/iphone\s*16\s*pro/],
 ["e5",/iphone\s*16\b/],["e7",/iphone\s*17\b(?!\s*pro)/],["e2",/iphone\s*14\b(?!\s*pro)/],["e1",/iphone\s*13\b(?!\s*pro)/],
 ["e10",/galaxy\s*s25\b(?!\s*(ultra|\+|plus))/],["e9",/galaxy\s*s24\b(?!\s*(ultra|\+|plus))/],["e8",/galaxy\s*s23\b(?!\s*(ultra|\+|plus))/],
 ["e12",/ipad\s*10\b|ipad.*10th/],["e11",/ipad\s*9\b|ipad.*9th/],
 ["e14",/(ps5|playstation\s*5).*digital|digital.*(ps5|playstation\s*5)/],["e13",/\bps5\b|playstation\s*5/],["e15",/\bps4\b|playstation\s*4/],
 ["e16",/series\s*x/],["e17",/series\s*s/],["e18",/xbox\s*one/],["e19",/switch\s*oled/],["e22",/switch\s*2\b/],["e21",/switch\s*lite/],["e20",/\bswitch\b/],
 ["e23",/steam\s*deck/],["e25",/macbook\s*air.*\bm2\b/],["e24",/macbook\s*air.*\bm1\b/],["e26",/hero\s*1[12]\b/],
 ["e27b",/mini\s*4/],["e27a",/mini\s*3/],["e28",/quest\s*3\b/],["e29",/series\s*[89]\b/],
 ["f1",/rancher/],["f2",/foreman/],["f3",/sportsman\s*570/],["f4",/outlander\s*570/],["f5",/grizzly/],["f6",/brute\s*force/],
 ["f7b",/ranger\s*1000/],["f7a",/ranger/],["f8",/\brzr\b/],["f9",/\bmule\b/],["f10",/gator|\bxuv\b/],
 ["f11",/precedent|club\s*car/],["f12",/\btxt\b|ezgo/],["f13",/drive\s*2|yamaha\s*drive/]];

let MP_BY_ID=Object.fromEntries(MODEL_PRICES.map(r=>[r[0],r]));
/* The count is spoken to the user in step 3, and prices.json rewrites the list
   every week, so read it off the list instead of typing a number that rots. */
function mpCount(){ return Math.round(MODEL_PRICES.length/10)*10; }
/* prices.json is the list the weekly refresh writes; the copy baked in above is
   the fallback for a first load with no network. A bad or truncated file must
   never wipe the price book, so the replacement has to look like a price list
   before it is allowed in: enough rows, and every one shaped right with a
   sane low and high. Anything less and the baked-in copy simply stays. */
function mpOk(rows){
  if(!Array.isArray(rows)||rows.length<100)return false;
  return rows.every(r=>Array.isArray(r)&&r.length>=9&&typeof r[0]==="string"&&typeof r[2]==="string"
    &&typeof r[3]==="number"&&typeof r[4]==="number"&&r[3]>0&&r[4]>=r[3]&&r[4]<1000000);
}
async function refreshPrices(){
  try{
    const res=await fetch("prices.json",{cache:"no-store"});
    if(!res.ok)return;
    const j=await res.json();
    const rows=j&&j.rows;
    if(!mpOk(rows))return;
    MODEL_PRICES=rows;
    MP_BY_ID=Object.fromEntries(MODEL_PRICES.map(r=>[r[0],r]));
    try{ render(); }catch(e){}
  }catch(e){}
}
/* ---- spotting fakes -------------------------------------------------------
   The counter cheat sheets, as data. The printed sheets in the binder are the
   full version; these are their 60-second checks, and fakes.json is the one
   copy the tool reads - nothing about them is typed out in here.

   Four sheets GATE: Rolex and luxury watches, graded cards, coins and bullion,
   and Apple. On those the tool gives no price until every check is answered,
   because a fake one is not worth a fraction of a real one - it is worth
   nothing, and taking it in knowing is a crime (§831.032). The other seven
   advise: the checks show, the price does not wait on them. */
let FAKES=null;
function fakesOk(j){ return !!(j&&Array.isArray(j.sheets)&&j.sheets.length
  &&j.sheets.every(x=>x&&typeof x.id==="string"&&Array.isArray(x.checks)&&Array.isArray(x.match))); }
async function loadFakes(){
  try{ const r=await fetch("fakes.json",{cache:"no-store"}); if(!r.ok)return;
    const j=await r.json(); if(!fakesOk(j))return; FAKES=j; try{ render(); }catch(e){}
  }catch(e){}
}
/* What is on the counter, in the words available - whatever the counter
   typed, plus the name of the thing it was filed as. */
function fakeText(x){
  /* The item words on the metal page are whatever was last priced on the
     other tab - a Charizard does not follow a customer to the scale. */
  return (" "+[st.bookName||"",st.brandTyped||"",st.model||"",st.detail||"",
    x?displayName(x):""].join(" ")+" ").toLowerCase();
}
function fakeSheet(x){
  if(!FAKES)return null;
  /* A scale cannot tell a chain from a Krugerrand, and the two sheets differ
     on whether a price waits: bullion gates, jewelry advises. Guessing would
     put a mandatory checklist on every gold chain, so the metal page asks.
     Jewelry until told otherwise, because that is most of what comes in. */
  if(st.mode==="metal")return FAKES.sheets.find(z=>z.id===(st.metalKind==="bullion"?"bullion":"jewelry"))||null;
  const t=fakeText(x);
  let best=null;
  for(const sh of FAKES.sheets){
    for(const w of sh.match){
      if(t.indexOf(" "+w)>=0||t.indexOf(w+" ")>=0){
        /* longest match wins, so "airpods pro" beats "ipad" in a jumble */
        if(!best||w.length>best.w.length)best={sh,w};
        break;
      }
    }
  }
  return best?best.sh:null;
}
/* The answers belong to the thing on the counter, not to the sheet. When the
   item changes they are gone - the next Rolex through the door has not been
   checked just because the last one was. */
function fakeAns(id){
  if(!st.fakeAns||st.fakeKey!==mkKey())return {};
  return st.fakeAns[id]||{};
}
function fakeSet(id,i,v){
  if(st.fakeKey!==mkKey()){ st.fakeAns={}; st.fakeKey=mkKey(); }
  st.fakeAns=st.fakeAns||{};
  const a=st.fakeAns[id]=Object.assign({},st.fakeAns[id]);
  if(a[i]===v)delete a[i]; else a[i]=v;     /* tapping the same answer clears it */
  render();
}
/* pass / unsure / fail, per check. Nothing assumed: an unanswered check is
   not a pass, which is the whole point of the gate. */
function fakeState(sh){
  if(!sh)return null;
  const a=fakeAns(sh.id), n=sh.checks.length;
  let pass=0,unsure=0,fail=0;
  for(let i=0;i<n;i++){ const v=a[i]; if(v==="pass")pass++; else if(v==="unsure")unsure++; else if(v==="fail")fail++; }
  const done=pass+unsure+fail;
  return {sh,n,pass,unsure,fail,done,
    verdict: fail?"fail" : done<n ? "open" : unsure?"unsure" : "clear",
    blocks: !!sh.gate && (fail>0 || done<n || unsure>0)};
}
/* ---- Check it by the numbers -------------------------------------------
   Weight, diameter and thickness are the cheapest fake-catchers there are,
   and unlike everything else in this tool they need no internet, no service
   and no API call - they are arithmetic against a published mint spec. A
   scale and a caliper catch more fakes than any photograph.

   Every figure below is the official specification, not an observed average.
   Sources are named on the card. */
const SPEC_GROUPS=[["silver","Silver bullion"],["gold","Gold bullion"],["us","US silver coins"],["watch","Watch cases"]];
const SPECS=[
 /* g = grams, d = diameter mm, t = thickness mm, sg = specific gravity.
    wear:true means a circulated coin legitimately loses metal, so light is
    normal and HEAVY is the suspicious direction. */
 {id:"ase",  grp:"silver", name:"American Silver Eagle — 1 oz", g:31.103, d:40.6, t:2.98, sg:10.49, metal:".999 silver"},
 {id:"cml",  grp:"silver", name:"Canadian Silver Maple — 1 oz", g:31.10,  d:38.0, t:3.29, sg:10.49, metal:".9999 silver"},
 {id:"phil", grp:"silver", name:"Austrian Philharmonic — 1 oz",  g:31.103, d:37.0, t:3.2,  sg:10.49, metal:".999 silver"},
 {id:"round",grp:"silver", name:"Generic 1 oz .999 silver round",     g:31.103, d:null, t:null, sg:10.49, metal:".999 silver",
              note:"Rounds vary in diameter by mint — weight and specific gravity are the checks that hold."},
 {id:"bar10",grp:"silver", name:"10 oz .999 silver bar",              g:311.03, d:null, t:null, sg:10.49, metal:".999 silver"},

 {id:"age1", grp:"gold", name:"American Gold Eagle — 1 oz",   g:33.931, d:32.70, t:2.87, sg:17.3, metal:"22k (.9167)",
              note:"Gross weight is 33.931 g because it is 22k — it holds one full ounce of gold plus alloy. A coin weighing 31.1 g is not a Gold Eagle."},
 {id:"agehalf",grp:"gold",name:"American Gold Eagle — 1/2 oz", g:16.966, d:27.00, t:2.24, sg:17.3, metal:"22k (.9167)"},
 {id:"agequarter",grp:"gold",name:"American Gold Eagle — 1/4 oz",g:8.483, d:22.00, t:1.78, sg:17.3, metal:"22k (.9167)"},
 {id:"agetenth",grp:"gold",name:"American Gold Eagle — 1/10 oz",g:3.393, d:16.50, t:1.19, sg:17.3, metal:"22k (.9167)"},
 {id:"krug", grp:"gold", name:"Krugerrand — 1 oz",            g:33.93,  d:32.77, t:2.84, sg:17.3, metal:"22k (.9167)"},
 {id:"gml",  grp:"gold", name:"Canadian Gold Maple — 1 oz",   g:31.10,  d:30.00, t:2.87, sg:19.3, metal:".9999 gold"},

 {id:"dime",  grp:"us", name:"Dime — pre-1965, 90% silver",    g:2.50,  d:17.9, t:null, sg:10.34, metal:"90% silver", wear:true},
 {id:"quart", grp:"us", name:"Quarter — pre-1965, 90% silver", g:6.25,  d:24.3, t:null, sg:10.34, metal:"90% silver", wear:true},
 {id:"half",  grp:"us", name:"Half dollar — pre-1965, 90%",    g:12.50, d:30.6, t:null, sg:10.34, metal:"90% silver", wear:true},
 {id:"half40",grp:"us", name:"Kennedy half — 1965-70, 40%",    g:11.50, d:30.6, t:null, sg:9.53,  metal:"40% silver", wear:true},
 {id:"morgan",grp:"us", name:"Morgan / Peace dollar",               g:26.73, d:38.1, t:null, sg:10.34, metal:"90% silver", wear:true},

 /* Watch weight moves with how many bracelet links are in it, so it is not a
    pass/fail number. The CASE is fixed, and a caliper across it is a real
    check: fakes are very often a millimetre or two out. */
 {id:"sub40", grp:"watch", name:"Rolex Submariner 116610 / 114060", d:40.0, lug:20, g:null, metal:"904L steel"},
 {id:"sub41", grp:"watch", name:"Rolex Submariner 126610",          d:41.0, lug:20, g:null, metal:"904L steel"},
 {id:"dj36",  grp:"watch", name:"Rolex Datejust 36",                d:36.0, lug:20, g:null, metal:"904L steel"},
 {id:"dj41",  grp:"watch", name:"Rolex Datejust 41",                d:41.0, lug:21, g:null, metal:"904L steel"},
 {id:"gmt",   grp:"watch", name:"Rolex GMT-Master II 116710",       d:40.0, lug:20, g:null, metal:"904L steel"},
 {id:"day",   grp:"watch", name:"Rolex Daytona 116500",             d:40.0, lug:20, g:null, metal:"904L steel"},
 {id:"exp",   grp:"watch", name:"Rolex Explorer 214270",            d:39.0, lug:20, g:null, metal:"904L steel"}
];
const SPEC_BY=Object.fromEntries(SPECS.map(s=>[s.id,s]));
/* How far out is too far. Bullion is struck to a tight tolerance; a coin that
   spent fifty years in a till is allowed to be light from wear and nothing
   else. Thickness moves most with strike, so it is the loosest. */
const SPEC_TOL={g:0.006, gWear:0.025, d:0.3, t:0.15, sg:0.03, lug:0.5};
function specJudge(sp,f,v){
  if(!(v>0))return null;
  const want=sp[f]; if(want==null)return null;
  const tol=f==="g"?(sp.wear?SPEC_TOL.gWear:SPEC_TOL.g)*want
           :f==="sg"?SPEC_TOL.sg*want
           :SPEC_TOL[f];
  const off=v-want, ok=Math.abs(off)<=tol;
  const pct=want?off/want*100:0;
  return {f,v,want,off,pct,ok,tol,
    heavyLight: off>0?"over":"under"};
}

/* Specific gravity: weigh it dry, then weigh it hanging in water. The ratio
   is the density, and density is what a fake cannot fake - except tungsten
   against gold, which the card says out loud rather than quietly passing. */
function specGravity(air,water){
  if(!(air>0)||!(water>0)||water>=air)return null;
  return air/(air-water);
}
function specRow(label,j,extra){
  if(!j)return "";
  const tone=j.ok?"var(--accent)":"var(--bad)";
  return `<div class="cardHint" style="margin-top:5px;font-size:13px">
    <b style="color:${tone}">${j.ok?"\u2713":"\u2717"}</b> ${esc(label)}:
    you measured <b style="color:var(--ink)">${j.v}</b>, spec is <b style="color:var(--ink)">${j.want}</b>
    (${j.pct>=0?"+":""}${j.pct.toFixed(1)}%). ${esc(extra||"")}</div>`;
}
function specCardHTML(sh){
  const pick=st.specPick||"", sp=SPEC_BY[pick];
  const inp=st.specIn||{};
  const num=k=>Number(inp[k])||0;
  const grp=sh&&sh.id==="watch"?"watch":sh&&sh.id==="bullion"?null:null;
  const opts=SPEC_GROUPS.map(([g,label])=>{
    const rows=SPECS.filter(z=>z.grp===g);
    return `<optgroup label="${esc(label)}">`+rows.map(z=>
      `<option value="${z.id}"${z.id===pick?" selected":""}>${esc(z.name)}</option>`).join("")+`</optgroup>`;
  }).join("");

  let out="";
  if(sp){
    const rows=[];
    const jg=specJudge(sp,"g",num("g"));
    if(jg)rows.push(specRow("Weight",jg, sp.wear
      ? (jg.off>0 ? "Wear only ever REMOVES metal. An overweight coin is the wrong alloy - this is the bad direction."
                  : jg.ok ? "Light is normal on a circulated coin." : "Too light even for a worn one.")
      : (jg.ok ? "Within mint tolerance." : "Bullion is struck to a tight weight. This is not wear.")));
    const jd=specJudge(sp,"d",num("d"));
    if(jd)rows.push(specRow(sp.grp==="watch"?"Case width":"Diameter",jd, jd.ok?""
      :sp.grp==="watch"?"Case size is fixed for the reference. A millimetre or two out is the commonest tell on a fake."
      :"Die size is fixed. Millimetres out is not wear - it is a different coin."));
    const jt=specJudge(sp,"t",num("t"));
    if(jt)rows.push(specRow("Thickness",jt, jt.ok?"":"Thickness moves a little with strike, but not this much."));
    const jl=specJudge(sp,"lug",num("lug"));
    if(jl)rows.push(specRow("Lug width",jl, jl.ok?"":"Lug width is fixed per model and fakes are often out."));
    const isGold=sp.grp==="gold", isWatch=sp.grp==="watch";
    const sg=specGravity(num("g"),num("w"));
    if(sg!=null&&sp.sg!=null){
      const j=specJudge(sp,"sg",sg); j.v=sg.toFixed(2);
      const gold=isGold;
      rows.push(specRow("Specific gravity",j, j.ok
        ? (gold?"Consistent with gold - but see the tungsten note below.":"Consistent with the stated metal.")
        : "Not this metal. Lead reads about 11.3, brass 8.5, steel 7.9."));
    }
    const any=rows.length;
    const bad=[jg,jd,jt,jl].filter(z=>z&&!z.ok).length;
    out=`<div style="margin-top:10px">
      ${any?rows.join(""):`<div class="cardHint" style="margin-top:5px;font-size:13px">Type a measurement above and it will be checked against the spec.</div>`}
      ${any?`<div class="cardHint" style="font-size:13px;margin-top:8px">
        <b style="color:${bad?"var(--bad)":"var(--accent)"}">${bad?bad+" of "+any+" measurements are out.":"Every measurement you gave matches."}</b>
        ${bad?(isWatch?" A real one is made to its own factory spec. Treat this as a fail until something explains it."
                      :" A real one does not miss its own mint spec. Treat this as a fail until something explains it.")
             :" That rules out the cheap fakes. It does not rule out a good one \u2014 keep working the checks above."}</div>`:""}
      ${isGold?`<div class="tagWarn" style="margin-top:9px;font-size:12.5px"><b>Tungsten reads 19.25, gold reads 19.32.</b> Specific gravity cannot tell them apart on a shop scale, and a tungsten core in a gold shell is the fake that matters. On a big gold loan, weight and gravity are not enough \u2014 ping it, or send it out.</div>`:""}
      <div class="cardHint" style="font-size:12px;margin-top:8px">Spec figures are the mint's own. Silver Eagle 31.103 g / 40.6 mm; Gold Eagle 33.931 g gross (22k) / 32.70 mm; Krugerrand 33.93 g / 32.77 mm; Gold Maple 31.10 g / 30.0 mm; pre-1965 US silver at 90%.</div>
    </div>`;
  }

  return `<details class="fold" style="margin-top:12px"${st.specOpen?" open":""} id="specFold">
    <summary class="foldLine">Check it by the numbers &mdash; weight, size, density</summary>
    <div class="cardHint" style="margin-top:8px;font-size:13px">A scale and a caliper catch more fakes than any photograph, and this costs nothing: it is arithmetic against the published spec, done here on the device. Leave a box empty and it is simply not checked.</div>
    <span class="label" style="margin-top:10px">What is it supposed to be?</span>
    <select id="specPick" class="numIn" style="width:100%;font-size:14px">
      <option value=""${pick?"":" selected"}>&mdash; pick one &mdash;</option>${opts}
    </select>
    ${sp?`<div class="cardHint" style="margin-top:6px;font-size:12.5px">${esc(sp.metal||"")}${sp.note?" &mdash; "+esc(sp.note):""}${sp.grp==="watch"?` <b style="color:var(--ink)">Weight is not scored here</b> &mdash; it moves with how many bracelet links are in it. It is still worth knowing: a steel sports Rolex on a full bracelet is heavy in the hand, and a fake usually feels obviously light.`:""}</div>`:""}
    <div class="row2" style="margin-top:10px;flex-wrap:wrap;gap:8px">
      <label style="flex:1;min-width:120px"><span class="label">Weight (g)</span>
        <input id="spec_g" class="numIn" type="number" inputmode="decimal" step="0.001" value="${esc(String(inp.g||""))}" placeholder="31.103"></label>
      <label style="flex:1;min-width:120px"><span class="label">${sp&&sp.grp==="watch"?"Case across (mm)":"Diameter (mm)"}</span>
        <input id="spec_d" class="numIn" type="number" inputmode="decimal" step="0.01" value="${esc(String(inp.d||""))}" placeholder="40.6"></label>
    </div>
    <div class="row2" style="margin-top:8px;flex-wrap:wrap;gap:8px">
      <label style="flex:1;min-width:120px"><span class="label">${sp&&sp.grp==="watch"?"Lug width (mm)":"Thickness (mm)"}</span>
        <input id="${sp&&sp.grp==="watch"?"spec_lug":"spec_t"}" class="numIn" type="number" inputmode="decimal" step="0.01" value="${esc(String((sp&&sp.grp==="watch"?inp.lug:inp.t)||""))}" placeholder="2.98"></label>
      <label style="flex:1;min-width:120px"><span class="label">Weight in water (g)</span>
        <input id="spec_w" class="numIn" type="number" inputmode="decimal" step="0.001" value="${esc(String(inp.w||""))}" placeholder="optional"></label>
    </div>
    <div class="cardHint" style="font-size:12.5px;margin-top:5px">For <b style="color:var(--ink)">weight in water</b>: hang it on thread in a cup of water so it touches nothing, and read the scale. That gives the density, which is what most fakes cannot copy.</div>
    ${out}
  </details>`;
}
const FAKE_BTN=[["pass","Pass"],["unsure","Not sure"],["fail","Fail"]];
function fakeCardHTML(x){
  const sh=fakeSheet(x); if(!sh)return "";
  const F=fakeState(sh), a=fakeAns(sh.id);
  const tone=F.verdict==="fail"?"var(--bad)":F.verdict==="clear"?"var(--accent)":F.verdict==="unsure"?"#FFC98F":"var(--ink-3)";
  const head=sh.gate
    ? (F.verdict==="open"?`<b>No price until this is checked.</b> ${F.done} of ${F.n} done.`
      :F.verdict==="fail"?`<b style="color:#FFAAB4">A check failed.</b> Don't lend on the name.`
      :F.verdict==="unsure"?`<b style="color:#FFC98F">Not proven.</b> Price only what you can verify.`
      :`<b style="color:var(--accent)">All ${F.n} checks pass.</b>`)
    : `Worth a look &mdash; this one advises, it does not hold the price. ${F.done} of ${F.n} done.`;
  return `<div class="card" id="fakeCard" style="border-left:3px solid ${tone}">
    <span class="label">Spotting fakes &middot; ${esc(sh.title)}</span>
    ${st.mode==="metal"?`<div class="pills mb14" style="border-radius:var(--r-s);margin-top:6px">
      <button class="${st.metalKind!=="bullion"?"on":""}" style="flex:1;padding:8px 6px;font-size:11.5px" data-mkind="jewelry">Jewelry</button>
      <button class="${st.metalKind==="bullion"?"on":""}" style="flex:1;padding:8px 6px;font-size:11.5px" data-mkind="bullion">Coin or bar</button>
    </div>`:""}
    <div class="cardHint" style="margin-top:0;font-size:13.5px;color:var(--ink-2)">${esc(sh.why||"")}</div>
    <div class="cardHint" style="font-size:13.5px">${head}</div>
    ${sh.checks.map((c,i)=>`<div class="fakeRow${a[i]?" done":""}">
      <div class="fakeQ">${esc(c)}</div>
      <div class="pills" style="border-radius:var(--r-s);margin-top:6px">${FAKE_BTN.map(([v,l])=>
        `<button class="${a[i]===v?"on "+v:""}" style="flex:1;padding:7px 5px;font-size:11px" data-fake="${sh.id}:${i}:${v}">${l}</button>`).join("")}</div>
    </div>`).join("")}
    ${sh.lookup.length?`<span class="label" style="margin-top:10px">Look it up free</span>
      <div class="cardHint" style="margin-top:0;font-size:13px">Type the address in yourself. Never scan a QR code on a holder or tag &mdash; fake cases point at copycat sites.</div>
      ${sh.lookup.map(l=>`<div class="cardHint" style="font-size:13px;margin-top:4px">${l.what?`<b style="color:var(--ink)">${esc(l.what)}</b> &mdash; `:""}${esc(l.where)}</div>`).join("")}`:""}
    ${specCardHTML(sh)}
    ${sh.rule?`<div class="cardHint" style="font-size:13px;margin-top:9px"><b style="color:var(--ink)">Shop rule:</b> ${esc(sh.rule)}</div>`:""}
    ${F.verdict==="fail"?`<div class="tagWarn" style="border-left-color:var(--bad);background:rgba(255,66,87,.12);color:#FFAAB4;margin-top:9px"><b>Set it aside.</b> ${esc(FAKES.law)}</div>`:""}
    <div class="row2" style="margin-top:8px"><button class="ghostBtn" id="fakeClear" style="padding:9px 15px">Start the check over</button></div>
  </div>`;
}
/* What stands in for the loan while a gating check is unanswered. */
function fakeHoldHTML(F){
  const t=F.verdict==="fail"
    ? `<b>A check on the ${esc(F.sh.title.toLowerCase())} sheet failed.</b> Don't lend on the brand name. Lend on what you can prove &mdash; the metal, a no-name value &mdash; or pass.`
    : F.verdict==="unsure"
    ? `<b>Not proven.</b> ${F.unsure} check${F.unsure===1?" is":"s are"} unresolved. Price only what you can verify today, not the name.`
    : `<b>Not checked yet.</b> ${F.done} of ${F.n} checks answered. Work the spotting-fakes card first &mdash; a fake is not worth a share of the real one, it is worth nothing.`;
  return `<div class="card unchecked"><span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    ${gauge(0,"Lend him","&mdash;",F.verdict==="fail"?"failed the check":"not checked yet","gi")}
    <div class="mkNo" style="margin-top:6px">${t}</div></div>`;
}
/* Which copy of the tool is running.

   This used to be read out of sw.js off the network and shown as "build", on
   the reasoning that the page could not then claim a version it was not. It
   is the opposite: sw.js was fetched fresh every time, so a phone running a
   month-old app.js out of the browser cache displayed the newest build
   number quite happily, and there was no way to tell from the screen that
   the code was old. It cost a whole round of "it didn’t work on the phone"
   to find that out.

   So the running copy stamps itself, and the published copy is read off the
   network, and where they differ the screen says so.

   THIS MUST BE BUMPED WITH THE CACHE NAME IN sw.js, every change. */
const APP_BUILD="0926.2430";
let BUILD=APP_BUILD;
async function readBuild(){
  try{
    /* sw.js carries the published number in its cache name, and is fetched
       past every cache. Not the caches the worker made: those are empty
       until it registers, and on a page served without one never appear. */
    const r=await fetch("sw.js",{cache:"no-store"}); if(!r.ok)return;
    const m=(await r.text()).match(/pawndesk-(\d{8})(\d{4})/); if(!m)return;
    const pub=m[1].slice(4,6)+m[1].slice(6,8)+"."+m[2];
    st.newBuild=(pub&&pub!==APP_BUILD)?pub:"";
    try{ render(); }catch(e){}
  }catch(e){}
}
/* Said on every screen, not tucked inside Setup: an out-of-date copy looks
   exactly like a working one right up until it behaves like last month. */
function staleHTML(){
  if(!st.newBuild)return "";
  return `<div class="tagWarn" style="background:rgba(255,201,143,.16);border-left-color:var(--accent);margin:0 0 12px">
    <b>This copy is out of date.</b> It is running <b style="font-family:var(--mono)">${esc(APP_BUILD)}</b>
    and the site has <b style="font-family:var(--mono)">${esc(st.newBuild)}</b>.
    <button class="ghostBtn" id="pdFresh" style="padding:6px 12px;font-size:12px;margin-left:6px">Get the newest version</button></div>`;
}
/* Clear everything cached and come back with whatever the site is serving.
   The service worker already asks the network first, so this is for the
   browser's own copy - the one a plain reload can keep for ten minutes. */
const CORE_FILES=["app.js","app-head.js","app.css","phone.js","phone.css","sw.js","prices.json","fakes.json"];
/* This used to clear everything and reload, and trust that the reload
   brought back something new. When it did not - a CDN edge still holding
   the old copy, a browser that kept its own - the page came back on the
   same build with the same "you are out of date" banner, and pressing the
   button again did exactly the same thing. A loop with no way out and no
   explanation.

   So it now CHECKS before it reloads: pull the new app.js past every cache,
   read the build number out of the text that actually came back, and only
   reload once it is genuinely newer. If the site is still handing over the
   old copy, say that, because the answer then is to wait a minute rather
   than press the button a fifth time. */
async function fetchedBuild(){
  try{
    const r=await fetch("app.js",{cache:"reload"});
    if(!r.ok)return null;
    const m=(await r.text()).match(/APP_BUILD\s*=\s*"([\d.]+)"/);
    return m?m[1]:null;
  }catch(e){ return null; }
}
async function forceUpdate(say){
  const tell=(t)=>{ try{ if(typeof say==="function")say(t); }catch(e){} };
  try{
    if(window.caches){ for(const k of await caches.keys())await caches.delete(k); }
    if(navigator.serviceWorker){ const rs=await navigator.serviceWorker.getRegistrations(); for(const r of rs)await r.unregister(); }
    await Promise.allSettled(CORE_FILES.map(f=>fetch(f,{cache:"reload"})));
  }catch(e){}
  const got=await fetchedBuild();
  if(got&&got!==APP_BUILD){
    /* The build number rides in the address too. The script tag inside
       index.html asks for "app.js" with nothing on it, and a browser holding
       a copy under that exact name is within its rights to serve it. A
       different address is a different thing to look up. */
    location.replace(location.pathname+"?b="+encodeURIComponent(got));
    return;
  }
  if(got===APP_BUILD){
    tell("The site is still serving "+APP_BUILD+". Nothing to fetch yet \u2014 a new copy can take a few minutes to reach every device. Try again shortly.");
    return;
  }
  tell("Could not reach the site to check. If you are offline the desk keeps working on what it has.");
}
const MP_STALE_DAYS=45;
function mpFor(cur,text){
  const t=" "+omniNorm(text)+" ";
  if(!t.trim())return null;
  for(const [id,re] of MP_MATCH){
    const r=MP_BY_ID[id]; if(!r)continue;
    if(String(r[1]).split("|").indexOf(cur)<0)continue;
    if(re.test(t))return r;
  }
  return mpAuto(cur,text);
}
/* Every row above was recognized by a pattern somebody wrote by hand, which
   is fine for 180 rows and impossible for the thousands this shop actually
   needs. A row gathered in bulk carries no pattern, so it is matched on its
   own name instead - but only on hard evidence: a token with a digit in it,
   matched exactly (ms 250, dcd771, 10/22, p365), plus most of the rest of
   the name. A model number is the one thing in a name that cannot be
   coincidence; without one this stays quiet and the categories answer.
   Row 10, when a harvest writes one, is extra ways the thing gets typed. */
/* A model number gets typed as one word about as often as two - ms391,
   dcd771, cs590 - and splitting the letters from the digits is what lets
   "stihl ms391" reach a row named "Stihl MS 391". Only here: the rest of the
   tool has no business guessing that "a4" is "a" and "4". */
const MP_SPLIT=/^([a-z]{1,4})[\s-]?(\d{2,5})([a-z]{0,3})$/;
function mpTokens(ws){
  const out=[];
  ws.forEach(w=>{ out.push(w);
    const m=String(w).match(MP_SPLIT);
    if(m){ out.push(m[1]); out.push(m[2]); if(m[3])out.push(m[2]+m[3]); } });
  return Array.from(new Set(out));
}
let MP_AUTO_IDX=null;
function mpAutoIdx(){
  if(MP_AUTO_IDX&&MP_AUTO_IDX.n===MODEL_PRICES.length)return MP_AUTO_IDX;
  const byHand=new Set(MP_MATCH.map(m=>m[0]));
  MP_AUTO_IDX={n:MODEL_PRICES.length,rows:MODEL_PRICES
    .filter(r=>!byHand.has(r[0]))
    .map(r=>({r,refs:String(r[1]).split("|"),
              nw:omniWords(r[2]).filter(w=>!STOP.has(w)),
              aw:mpTokens(omniWords(r[9]||"").concat(omniWords(r[2])))}))
    .filter(e=>e.nw.length)};
  return MP_AUTO_IDX;
}
function mpAuto(cur,text){
  const q=mpTokens(omniWords(text).filter(w=>!STOP.has(w)));
  if(!q.length)return null;
  let best=null,bestScore=0;
  for(const e of mpAutoIdx().rows){
    if(e.refs.indexOf(cur)<0)continue;
    let hit=0,pin=false;
    for(const n of e.nw.concat(e.aw)){
      let h=0; for(const w of q){ const x=wordHit(w,[n]); if(x>h)h=x; }
      if(!h)continue;
      if(e.nw.indexOf(n)>=0)hit++;
      if(h===3&&/\d/.test(n))pin=true;
    }
    if(!pin)continue;
    const cover=hit/e.nw.length;
    if(cover<0.6)continue;
    const sc=cover*10+hit;
    if(sc>bestScore){ bestScore=sc; best=e.r; }
  }
  return best;
}
/* The same hard evidence mpAuto wants: a token with a digit, matched exact,
   and most of the name. A harvested row is machine-made and must not answer
   for something it is not. */
function harvFind(cur,text){
  const q=mpTokens(omniWords(text).filter(w=>!STOP.has(w)));
  if(!q.length)return null;
  let best=null,bestScore=0;
  for(const f of Object.values(harvAll())){
    if(!f||f.ref!==cur||!(f.lo>0)||f.wild||!(f.n>=4))continue;
    const nw=omniWords(f.name).filter(w=>!STOP.has(w));
    const aw=mpTokens(omniWords(f.alias||"")).concat(mpTokens(nw));
    if(!nw.length)continue;
    let hit=0,pin=false;
    for(const n of nw.concat(aw)){
      let h=0; for(const w of q){ const x=wordHit(w,[n]); if(x>h)h=x; }
      if(!h)continue;
      if(nw.indexOf(n)>=0)hit++;
      if(h===3&&/\d/.test(n))pin=true;
    }
    const cover=hit/nw.length;
    if(!pin||cover<0.6)continue;
    const sc=cover*10+hit;
    if(sc>bestScore){ bestScore=sc; best=f; }
  }
  if(!best)return null;
  return {kind:"harvest",lo:best.lo,hi:best.hi,mid:Math.round((best.lo+best.hi)/2/5)*5,
          name:best.name,n:best.n,sold:best.sold||0,conf:best.conf,date:best.date,
          src:"https://www.ebay.com/sch/i.html?_nkw="+encodeURIComponent(best.name)+"&LH_Sold=1&LH_Complete=1"};
}
function curItemRef(){ return isCustom()?st.bookName:st.itemId; }
function mkKey(){ return itemKey()+"|"+omniNorm((st.brandTyped||"")+" "+(st.model||"")); }
function daysOld(d){ const t=new Date(String(d)+"T12:00:00").getTime(); return isNaN(t)?999:Math.round((Date.now()-t)/864e5); }
/* the market price for what's on the counter, best source first:
   a price you set (screenshot read, your own sales, typed) → the model price list */
function marketNow(){
  if(st.market&&st.market.key===mkKey())return st.market;
  let r=null;
  if(st.mpPin&&st.mpPin.model===st.model){ const pr=MP_BY_ID[st.mpPin.id]; if(pr&&String(pr[1]).split("|").indexOf(curItemRef())>=0)r=pr; }
  if(!r)r=mpFor(curItemRef(),[st.brandTyped,st.model,st.detail,isCustom()?st.bookName:""].join(" "));
  /* Nothing in the list the tool shipped with? Then whatever the harvest
     found for this model, which is a real range off real listings and is
     usually the only thing that knows about it at all. */
  if(!r){ const h=harvFind(curItemRef(),[st.brandTyped,st.model,st.detail].join(" ")); if(h)return h; }
  if(!r)return null;
  const age=daysOld(r[6]);
  /* The counter's own figures for this exact model, off the master sheet,
     stand in front of the published ones. */
  const mine=st.modelVals&&st.modelVals[r[0]];
  const lo=(mine&&mine.lo>0)?Math.round(mine.lo):r[3];
  const hi=(mine&&mine.hi>0)?Math.round(mine.hi):r[4];
  return {kind:"list",lo,hi,mid:Math.round((lo+hi)/2/5)*5,name:r[2],conf:mine?"h":r[5],
          date:mine?todayStr():r[6],src:r[7],note:r[8],mine:!!mine,stale:mine?false:age>MP_STALE_DAYS,age};
}
function fmtDay(d){ try{ return new Date(String(d)+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}); }catch(e){ return String(d); } }
const SRC_NAMES={"pricecharting.com":"PriceCharting","swappa.com":"Swappa","gunwatcher.com":"GunWatcher (GunBroker sales)","jdpower.com":"J.D. Power",
  "axedb.com":"AxeDB","golfcartsearch.com":"GolfCartSearch","underpriced.app":"Underpriced","reverb.com":"Reverb","tractorhouse.com":"TractorHouse",
  "machinerypete.com":"Machinery Pete","machinerytrader.com":"MachineryTrader","ebay.com":"eBay","watchcount.com":"WatchCount","gunbroker.com":"GunBroker"};
function srcName(u){ try{ const h=new URL(u).hostname.replace(/^(www|used)\./,""); return SRC_NAMES[h]||h; }catch(e){ return "the source"; } }
function srcLink(u,txt){ return /^https:\/\//.test(u||"")?`<a class="srcLink" href="${esc(u)}" target="_blank" rel="noopener" referrerpolicy="no-referrer">${txt||"Check it yourself"} &#8599;</a>`:""; }
function marketSrcHTML(m){
  if(m.kind==="list")return `Resale value from <b>${esc(srcName(m.src))}</b> for <b>${esc(m.name)}</b>, checked ${esc(fmtDay(m.date))}. ${srcLink(m.src)}${m.conf==="l"
    ?` <span style="color:#FFC98F">Thin data on this one &mdash; it rests on forum posts or a single listing, so double-check it.</span>`
    :m.conf==="h"?` The data behind this one is good.`
    :` The data behind this one is fair &mdash; a starting point, not the last word.`}`;
  if(m.kind==="shot"&&m.via==="button")return `From ${m.n} ${m.n===1?"sale":"sales"} on ${esc(m.site||"the sold page")}, read by your Pawn price button today. ${srcLink(m.url,"See those sales")}`;
  if(m.kind==="shot")return `From ${m.n} ${m.n===1?"sale":"sales"} you read off ${esc(m.site||"the screenshot")} today.`;
  if(m.kind==="own")return `From your own ${m.n} ${m.n===1?"sale":"sales"} of this item.`;
  if(m.kind==="found")return `From <b>${m.n}</b> listing${m.n===1?"":"s"} on file${m.sold?`, ${m.sold} of them sold`:""}: the middle one is <b>${money(m.med)}</b>, the middle half ${money(m.lo)}&ndash;${money(m.hi)}.${m.from?` From ${esc(m.from)}.`:""}${m.mostlyAsks?` Mostly asking prices rather than sales.`:""}${m.conf==="l"?` <span style="color:#FFC98F">Few listings behind this &mdash; look at the sold pages before you lean on it.</span>`:""} The middle one is used, not the average, so one bad listing cannot move it.`;
  if(m.kind==="seen")return `From <b>${m.n}</b> shelf tag${m.n===1?"":"s"} you recorded, asking ${money(m.lo)}&ndash;${money(m.hi)}, typically ${money(m.ask)} &mdash; what a used one goes for at a shop near you.`;
  if(m.kind==="harvest")return `From the price list this shop built: <b>${esc(m.name)}</b>, ${m.n} listing${m.n===1?"":"s"}${m.sold?`, ${m.sold} sold`:""} on ${esc(fmtDay(m.date))}. ${srcLink(m.src,"See those sales")} Nobody has checked this one by hand &mdash; it is a search, kept.`;
  if(m.kind==="retail")return `Estimated from <b>${money(m.retail)}</b> new retail, taken to ${(m.pct||retailPct())}% for a used one. This is not a sold price &mdash; check sold prices when you can.`;
  return "Your number, typed in.";
}
function step4Inner(x,bare){
  const m=x.market, who=[st.brandTyped,st.model].filter(Boolean).join(" "), name=displayName(x);
  /* In the one-question run the question IS the heading, and a card that
     announces "4 - Resale value" under "What does one sell for used?" says
     it twice and numbers it wrong: it is question five of six there, not
     step four of anything. */
  let h=bare?"":`<span class="label">4 &middot; Resale value &mdash; what it sells for used</span>`;
  if(st.editing){
    h+=`<div class="row2"><input id="valIn" type="number" inputmode="numeric" placeholder="What one really sells for" value="${m&&m.kind==="hand"?m.mid:""}" class="numIn" style="flex:1;min-width:0"><button class="brassBtn" id="valSave" style="padding:11px 18px">Save</button><button class="ghostBtn" id="valCancel" style="padding:11px 14px">Cancel</button></div>
      <div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">What one like this actually sells for used, in normal shape. The loan works from this number.</div>`;
  } else if(x.checked){
    h+=`<div class="mkRow"><div><div class="mkBig">${money(m.mid)}</div>${m.lo!=null&&m.hi!=null&&m.lo!==m.hi?`<div class="mkRange">usually ${money(m.lo)} to ${money(m.hi)}</div>`:""}</div><span class="mkOk">&#10003; Checked</span></div>
      <div class="mkWhat">This is what it <b>resells</b> for, used &mdash; not what you lend or pay. The loan and the buy price are beside this.</div>
      <div class="mkSrc">${marketSrcHTML(m)}</div>
      ${m.note?`<div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">What moves it: ${esc(m.note)}.</div>`:""}
      ${m.kind==="list"?`<div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">Want today's exact number? Pull the sold prices above and read the screenshot.</div>`:""}
      <div class="row2" style="gap:8px;margin-top:10px;flex-wrap:wrap"><button class="ghostBtn" id="valEdit">Type my own number</button>${m.kind!=="list"?`<button class="ghostBtn" id="mkClear">Clear it</button>`:""}</div>`;
  } else {
    h+=`<div class="mkNo"><b>Not checked yet.</b> ${m&&m.stale?`The price list for ${esc(m.name)} is ${m.age} days old.`:`There's no market price for ${esc(who?who+" ":"")}${esc(name.toLowerCase())} yet.`}</div>
      <ol class="mkSteps"><li>${pdBridge?"Click a sold-price button above. The sold page reads itself and the price lands here.":isTouch()?"Tap a sold-price button above, screenshot the sold results, and read the screenshot here.":"Open a sold-price button above, look at what these <b>actually sold for</b>, and type the middle price in."}</li><li>${who?"":`Or type the brand and model where it asks for the make &mdash; about ${mpCount()} common models have prices built in. `}Or type what these really sell for.</li></ol>
      <button class="brassBtn" id="valEdit" style="padding:11px 18px">Type the real price</button>
`;
  }
  return h+ownCompsHTML(x);
}
function wireStep4(){
  wireNext(); wireBuy();
  const edit=document.getElementById("valEdit");
  if(edit)edit.onclick=()=>{ st.editing=true; render(); const v=document.getElementById("valIn"); if(v)v.focus(); };
  const cancel=document.getElementById("valCancel"); if(cancel)cancel.onclick=()=>{ st.editing=false; render(); };
  const save=document.getElementById("valSave"), vin=document.getElementById("valIn");
  const doSave=()=>{ const n=parseFloat(vin&&vin.value); if(n>0){ st.market={kind:"hand",key:mkKey(),mid:Math.round(n)}; } st.editing=false; render(); };
  if(save)save.onclick=doSave;
  if(vin)vin.onkeydown=e=>{ if(e.key==="Enter")doSave(); };
  const clr=document.getElementById("mkClear"); if(clr)clr.onclick=()=>{ st.market=null; render(); };
  const own=document.getElementById("useOwn");
  if(own)own.onclick=()=>{ const s=soldStats(itemKey()); if(!s)return; st.market={kind:"own",key:mkKey(),mid:Math.round(s.avg),lo:s.lo,hi:s.hi,n:s.n}; render(); };
}
function refreshStep4(){
  const xx=calcItem();
  const s4=document.getElementById("step4"); if(s4&&!st.editing){ s4.innerHTML=step4Inner(xx); wireStep4(); }
  const ns=document.getElementById("nextStep"); if(ns){ ns.outerHTML=nextStepHTML(xx); wireNext(); }
  const tk=document.getElementById("ticket"); if(tk)tk.innerHTML=ticketHTML(xx); paintPin(xx);
  const lg=document.getElementById("logCard"); if(lg){ lg.innerHTML=logCardInner(xx); wireLogButton(); }
}
function uncheckedTicketHTML(x){
  return `<div class="card unchecked"><span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    ${gauge(0,"Lend him","&mdash;","not checked yet","gi")}
    <div class="mkNo" style="margin-top:6px"><b>Hold off.</b> There's no market price for this yet. Get one in step 4 and the loan shows up here.</div>
    <div class="cardHint" style="font-size:14px;color:var(--ink-2)">Follow <b style="color:var(--ink)">Next step</b> at the top of the page.</div></div>`;
}
function ownAvgTag(id){ const s=CAP.db?soldStats(id):null; return s?`<span class="price mine">you: ${money(s.avg)}</span>`:""; }

/* The Pawn price favorite sends "PAWNDESK:{...}" straight back to the desk tab
   that opened the sold page (window.opener), and the desk answers so that tab can
   close itself. Ctrl+V still works for a sold page opened some other way. */
let pawnLastTs=0;
/* Which kind of page the counter just opened, so a price coming back through
   the bridge is filed as what it actually is: a sold comp, or a new-retail
   number that still has to take the used haircut. */
var pawnWant="shot";
document.addEventListener("click",e=>{
  const a=e.target&&e.target.closest?e.target.closest("a.nsRetail,a.nsSold,a.compBtn"):null; if(!a)return;
  pawnWant=a.classList.contains("nsRetail")?"retail":"shot";
},true);
function applyPawn(t){
  if(!/^PAWNDESK:/.test(t||""))return "bad";
  if(st.mode!=="item")return "noitem";
  let d; try{ d=JSON.parse(String(t).slice(9)); }catch(x){ return "bad"; }
  const mid=Math.round(Number(d&&d.mid)); if(!(mid>0))return "bad";
  const ts=Number(d.ts)||0; if(ts&&ts===pawnLastTs)return "ok";
  pawnLastTs=ts;
  if(pawnWant==="retail"){
    const p=retailPct(calcItem());
    st.market={kind:"retail",key:mkKey(),retail:mid,pct:p,mid:Math.max(5,Math.round(mid*p/100/5)*5)};
    st.editing=false; render(); return "ok";
  }
  st.market={kind:"shot",via:"button",key:mkKey(),mid,lo:Math.round(Number(d.lo))||null,hi:Math.round(Number(d.hi))||null,
             n:Math.max(1,Math.round(Number(d.n))||1),site:String(d.site||"eBay").slice(0,24),
             url:/^https:\/\//.test(String(d.url||""))?String(d.url).slice(0,400):""};
  st.editing=false; render();
  const s4=document.getElementById("step4");
  if(s4){ if(s4.scrollIntoView)s4.scrollIntoView({block:"nearest",behavior:"smooth"});
          s4.classList.add("justIn"); setTimeout(()=>{ const c=document.getElementById("step4"); if(c)c.classList.remove("justIn"); },2600); }
  return "ok";
}
/* Tampermonkey add-on ("Pawn Desk - sold prices"): its claude.ai half answers our hello,
   opens sold pages in a clean tab (GunBroker refuses tabs opened from this page), and
   passes the price back in. */
var pdBridge=false;
window.addEventListener("message",e=>{
  const t=e.data; if(typeof t!=="string"||t.indexOf("PAWNDESK")!==0)return;
  const reply=m=>{ try{ if(e.source&&e.source!==window&&e.source.postMessage)e.source.postMessage(m,"*"); }catch(x){} };
  if(t==="PAWNDESK_PING"){ reply("PAWNDESK_PONG"); return; }
  if(t.indexOf("PAWNDESK_BRIDGE")===0){ if(!pdBridge){ pdBridge=true; if(st.mode==="item"&&!st.editing)refreshStep4(); } return; }
  if(t.indexOf("PAWNDESK:")!==0)return;
  const r=applyPawn(t);
  reply(r==="ok"?"PAWNDESK_OK":r==="noitem"?"PAWNDESK_NOITEM":"PAWNDESK_BAD");
});
function pdHello(){ try{ if(window.top&&window.top!==window)window.top.postMessage("PAWNDESK_HELLO","*"); }catch(x){} }
[300,1500,4000,9000].forEach(t=>setTimeout(pdHello,t));
document.addEventListener("click",e=>{
  if(!pdBridge)return;
  const a=e.target&&e.target.closest?e.target.closest("a.compBtn,a.omniRow.sold,a.nsSold,a.nsRetail,a.srcLink"):null; if(!a)return;
  const url=a.getAttribute("href")||""; if(!/^https:\/\//.test(url))return;
  e.preventDefault();
  try{ window.top.postMessage("PAWNDESK_OPEN:"+url,"*"); }catch(x){ return; }
  if(a.classList.contains("compBtn")||a.classList.contains("nsSold")){
    e.stopPropagation(); pasteTo="shot";
    const fb=document.getElementById("compFallback"); if(fb)fb.innerHTML="";
    setCompMsg("Opened "+(a.dataset.label||"the sold page")+". The price comes back here by itself.","ok");
  }
},true);
document.addEventListener("paste",e=>{
  if(st.mode!=="item")return;
  const cd=e.clipboardData, t=cd&&cd.getData?cd.getData("text/plain"):"";
  if(!/^PAWNDESK:/.test(t||""))return;
  e.preventDefault(); e.stopImmediatePropagation();
  applyPawn(t);
},true);


/* ================= NEXT STEP — one place that says where you are and what to do ================= */
/* Whose model is this. Most rows lead with the maker - "Stihl MS 250" - but
   the ones that do not are the ones that matter here: a MacBook says nothing
   about Apple, so a Sony laptop was being offered two of them. A row whose
   maker cannot be told is left in; only a row that plainly belongs to someone
   else is dropped. */
const MP_FAMILY={macbook:"apple",imac:"apple",ipad:"apple",iphone:"apple",airpod:"apple",beats:"apple",
  galaxy:"samsung",pixel:"google",thinkpad:"lenovo",inspiron:"dell",latitude:"dell",
  xbox:"microsoft",playstation:"sony",switch:"nintendo",wingmaster:"remington",rancher:"husqvarna"};
function mpBrandOf(text){
  const t=" "+omniNorm(text)+" ";
  for(const k of Object.keys(MP_FAMILY)) if(t.indexOf(k)>=0)return MP_FAMILY[k];
  for(const cat of Object.keys(BRANDBOOK)){ const bk=BRANDBOOK[cat];
    for(const tier of ["hi","mid","lo"]) for(const b of bk[tier]){
      const bl=omniNorm(b); if(bl.length>=3&&t.indexOf(" "+bl+" ")>=0)return bl; } }
  return null;
}
function mpCandidates(){
  const ref=curItemRef(); let rows=MODEL_PRICES.filter(r=>String(r[1]).split("|").indexOf(ref)>=0);
  /* When the maker is known and the price list has none of theirs, the answer
     is none - not "here is everyone else's". It offered a Sony laptop two
     MacBooks, because an empty filter fell back to the unfiltered rows. */
  const want=st.brandTyped?mpBrandOf(st.brandTyped):null;
  if(want){
    rows=rows.filter(r=>{ const b=mpBrandOf(r[2]); return !b||b===want; });
    if(!rows.length)return [];
  }
  const words=omniWords(st.model||"").filter(w=>!STOP.has(w));
  if(words.length){ const f=rows.filter(r=>{ const nw=omniWords(r[2]); return words.some(w=>wordHit(w,nw)>=2); }); if(f.length)rows=f; }
  return rows.slice(0,8);
}
const COND_WORDS=Object.fromEntries(CONDITIONS.map(c=>{
  const d=Math.round(((COND_MULT[c.id]||1)-1)*100);
  return [c.id,[c.label, d===0?"as is":(d>0?"+":"\u2212")+Math.abs(d)+"%"]];
}));
/* A new retail price is not a sold price, but it beats nothing when the sold
   pages come up empty. These are what a used one books at here as a share of
   new, per category — deliberately visible in the UI so the counter can see
   the haircut being taken and override it by typing the resale directly. */
/* These are the shop's own working figures, not a measurement. The shelf tags
   photographed 19 Sep 2026 cannot settle them: a tag's printed REGULAR turned
   out to be that shop's earlier asking price rather than MSRP (a Werner 24ft
   ladder at $124.95 against a $199.95 "regular" when new ones run about $330),
   so the ticket-to-regular ratios say more about their markdown policy than
   about what a used one is worth here. A real sold price overrides all of
   this, which is why the card says so every time it shows the estimate. */
const RETAIL_PCT={guns:65,jewel:55,power:55,tools:50,hunt:45,elec:45,music:45,rolling:60,appl:35,fit:35,coll:60};
/* Shelf tags photographed 19 Sep 2026, second batch. Within one category the
   brand moves the number more than the category does: a Stihl MS180C asks
   $199.95 against about $229 new, a Husqvarna 455 Rancher $374.95 against the
   same shop's own $499.95 new one — while a Hilti SCW 22-A with no battery
   asks $74.95 against $300-plus, and a discontinued Ridgid R4030 tile saw
   $99.95 against about $299. So the brand tier shifts the percentage, and a
   cordless tool sold without its battery is treated as the different item it
   is. Bounded either way so no combination can run off. */
const BRAND_SHIFT={hi:8,mid:0,lo:-8};
const BARE_TOOL=/\bbare\b|tool only|no battery|body only|without battery/;
/* Small electronics fall much faster than a TV does: AirPods Pro ticketed at
   $99 against $249 new. One number cannot cover both, so these get their own. */
const FAST_DROP=/airpod|ear ?bud|headphone|ear ?phone|phone|watch|tablet|ipad|laptop|console/;
function retailPct(x){
  const t=((x?displayName(x):"")+" "+(st.brandTyped||"")+" "+(st.model||"")+" "+(st.bookName||"")+" "+(st.detail||"")).toLowerCase();
  let p=(st.catId==="elec"&&FAST_DROP.test(t))?38:(RETAIL_PCT[st.catId]||45);
  p+=BRAND_SHIFT[st.brand]||0;
  if(BARE_TOOL.test(t))p=Math.min(p-15,32);   /* a bare cordless tool asks about a third of new, whatever the badge says */
  return Math.max(25,Math.min(75,Math.round(p)));
}
function retailTargets(q){
  const e=encodeURIComponent(q), t=[];
  t.push({name:"Google Shopping", url:"https://www.google.com/search?tbm=shop&q="+e});
  t.push({name:"Amazon", url:"https://www.amazon.com/s?k="+e});
  if(st.catId==="tools"||st.catId==="power")
    t.push({name:"Home Depot", url:"https://www.homedepot.com/s/"+e});
  else
    t.push({name:"Walmart", url:"https://www.walmart.com/search?q="+e});
  return t;
}
/* ---- shelf sightings: the shop's own record of what other shops ask ------
   A photographed tag is an ASKING price, never a sale, and it says so
   everywhere it is shown. The tags are other pawn shops' retail prices on used
   goods, which is the same thing this counter sells, so a sighting is used at
   its ticket rather than discounted: the buy rate is what holds the margin,
   and a second haircut here would just be an invented discount on top of it.
   The record lives on this device; Export moves it to another one. */
const SEEN_KEY="pawndesk_seen", SEEN_MAX=800;
const VARIANT=/^(pro|max|plus|mini|xl|se|ultra|lite|gen)$/;
function seenAll(){ try{ return JSON.parse(localStorage.getItem(SEEN_KEY)||"[]"); }catch(e){ return []; } }
function seenSave(a){ try{ localStorage.setItem(SEEN_KEY,JSON.stringify(a.slice(-SEEN_MAX))); }catch(e){} }
function seenAdd(r){
  const name=String(r.name||"").trim().slice(0,70), ask=Math.round(Number(r.ask))||0;
  if(!name||!(ask>0))return 0;
  const a=seenAll();
  a.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6), ts:Date.now(),
    name, brand:String(r.brand||"").trim().slice(0,30), model:String(r.model||"").trim().slice(0,40),
    cat:String(r.cat||st.catId||"").slice(0,10), ask, reg:Math.round(Number(r.reg))||0,
    store:String(r.store||"").trim().slice(0,30),
    words:omniWords([name,r.brand,r.model].filter(Boolean).join(" "))});
  seenSave(a); return a.length;
}
function seenMedian(ns){ const a=ns.slice().sort((p,q)=>p-q), n=a.length;
  return !n?0:(n%2?a[(n-1)/2]:Math.round((a[n/2-1]+a[n/2])/2)); }
/* Matched on shared words, with one hard rule: if the counter has given a
   number — a model, a size — a tag must carry that same number to count.
   Without it "husqvarna 455 rancher chainsaw" scores three shared words
   against a 450 Rancher and quietly prices the wrong saw. */
function pdQueryWords(x){
  return omniWords([st.brandTyped,st.model,x?displayName(x):"",st.bookName].filter(Boolean).join(" "));
}
/* One matcher for both records - shelf tags and looked-up prices are matched
   on the same rules, so a 450 Rancher cannot answer for a 455 in either. */
function pdMatch(rows,x,limit){
  const w=pdQueryWords(x);
  if(!w.length)return [];
  /* A number is not the only thing that separates two models: Pro, Max and
     Mini do the same work. AirPods Pro at $99 otherwise averages with a
     second-generation pair at $49 and prices neither of them. */
  const key=w.filter(t=>/\d/.test(t)||VARIANT.test(t)), need=w.length>1?2:1;
  return (rows||[]).map(s=>({s,hit:(s.words||[]).filter(t=>w.indexOf(t)>=0).length}))
    .filter(o=>o.hit>=need&&(!key.length||key.some(t=>(o.s.words||[]).indexOf(t)>=0)))
    .sort((a,b)=>b.hit-a.hit||b.s.ts-a.s.ts).map(o=>o.s).slice(0,limit||12);
}
function seenMatch(x){ return pdMatch(seenAll(),x); }

/* ---- looked-up prices: the dataset growing itself ------------------------
   A few hundred rows cannot cover a counter. When nothing matches, the service can go
   and find what the thing sells for used, and the answer is kept, so the
   second time it is asked it is already known. What the answer rests on is
   kept with it and shown, because a completed-listing price and somebody's
   asking price are not the same evidence. */
/* ---- comparable listings: many rows, then the middle one ----------------
   One range from one source is one opinion. A lookup now brings back the
   individual listings it found and every one is kept, so the set grows each
   time the same thing is priced.

   The number taken off that set is the MEDIAN, not the average. Scraped
   listings always carry junk - a chain and bar listed under the saw's name, a
   dealer bundling three machines in one lot, a typo. On twelve rows with two
   of them wrong, the average moves $180 and the median does not move at all.
   The middle half is shown beside it so a set that disagrees with itself
   cannot hide behind a single tidy figure. */
const COMP_KEY="pawndesk_comps", COMP_MAX=3000;
function compsAll(){ try{ return JSON.parse(localStorage.getItem(COMP_KEY)||"[]"); }catch(e){ return []; } }
function compsSave(a){ try{ localStorage.setItem(COMP_KEY,JSON.stringify(a.slice(-COMP_MAX))); }catch(e){} }
function compsAdd(q,list){
  q=String(q||"").trim().slice(0,80);
  if(!q||!Array.isArray(list))return 0;
  const w=omniWords(q), a=compsAll(), now=Date.now();
  let added=0;
  list.slice(0,48).forEach((c,i)=>{
    const p=Math.round(Number(c&&c.price));
    if(!(p>0)||p>1000000)return;
    a.push({id:now.toString(36)+i.toString(36)+Math.random().toString(36).slice(2,5), ts:now, q, words:w, price:p,
      what:String((c&&c.what)||"").slice(0,60), where:String((c&&c.where)||"").slice(0,24),
      basis:((c&&c.basis)==="sold")?"sold":"asking",
      /* Only https, only eBay's image host, and only the thumbnail - this
         string is written into an <img src> on the counter's screen, and a
         comp arrives from a service rather than from here. */
      img:(function(u){ u=String((c&&c.img)||"");
        return /^https:\/\/i\.ebayimg\.com\//.test(u)?u.slice(0,300):""; })(),
      url:(function(u){ u=String((c&&c.url)||"");
        return /^https:\/\/(www\.)?ebay\.com\//.test(u)?u.slice(0,300):""; })()});
    added++;
  });
  compsSave(a); return added;
}
function compsMatch(x){ return pdMatch(compsAll(),x,60); }

/* ---- sharing the record between the phone and the desk ------------------
   Each device keeps working from its own copy, online or not. This
   reconciles them: push what this one has, take back what it has not seen,
   and merge by id with the newer timestamp winning. Nothing is deleted and
   nothing is authoritative but the rows themselves, so two devices that both
   recorded something while apart end up with both. */
const SYNC_AT="pawndesk_syncat";
function syncAt(k){ try{ return Number(JSON.parse(localStorage.getItem(SYNC_AT)||"{}")[k])||0; }catch(e){ return 0; } }
function syncSetAt(k,ts){ try{ const o=JSON.parse(localStorage.getItem(SYNC_AT)||"{}"); o[k]=ts;
  localStorage.setItem(SYNC_AT,JSON.stringify(o)); }catch(e){} }
/* The deal log keys on _id; everything else keys on id. Translating at the
   edge keeps one merge rule for all three rather than a special case running
   through the middle of it. Deals hold item facts only - no name, no ID
   number - so they are safe to share the same way. */
const SYNC_STORES={
  comps:{all:compsAll,save:compsSave},
  /* One row a model, a few hundred bytes each - the whole harvest fits in a
     sync where its listings never could. This is what makes a price found on
     the phone in a yard sale available at the desk that afternoon. */
  harvest:{
    all:()=>Object.entries(harvAll()).map(([id,f])=>Object.assign({id,ts:f.ts||Date.parse(f.date+"T12:00:00")||Date.now()},f)),
    save:rows=>{ const m={};
      (rows||[]).forEach(r=>{ if(r&&r.id)m[r.id]=r; });
      HARV=m; harvSave(); }
  },
  seen: {all:seenAll, save:seenSave},
  deals:{
    all:()=>((window.PD_DEALS&&window.PD_DEALS.all())||[]).map(d=>Object.assign({},d,{id:d._id})),
    save:rows=>{ if(!window.PD_DEALS)return;
      window.PD_DEALS.save(rows.map(d=>{ const c=Object.assign({},d); c._id=c._id||c.id; delete c.id; return c; })); }
  }
};
let syncBusy=false, syncNote="";
async function pdSync(){
  if(syncBusy||!pdServer())return;
  syncBusy=true; syncNote="Syncing\u2026"; try{ render(); }catch(e){}
  let pulled=0, pushed=0, warn="", failed=0;
  for(const k of Object.keys(SYNC_STORES)){
    const S=SYNC_STORES[k], since=syncAt(k), mine=S.all();
    /* Only what this device has that the others may not: everything on the
       first run, then whatever arrived since. */
    const send=since?mine.filter(r=>(Number(r.ts)||0)>since):mine;
    try{
      const res=await fetch(pdBase()+"/sync",{method:"POST",
        headers:{"content-type":"application/json","x-pawn-token":pdToken()},
        body:JSON.stringify({store:k,rows:send,since})});
      const j=await res.json();
      if(!j||!j.ok){ failed++; continue; }
      pushed+=send.length;
      if(j.warning)warn=j.warning;
      st.syncWarn=j.warning||"";
      const byId={}; mine.forEach(r=>{ byId[r.id]=r; });
      let newest=since, add=0;
      (j.rows||[]).forEach(r=>{
        if(!r||!r.id)return;
        newest=Math.max(newest,Number(r.ts)||0);
        const o=byId[r.id];
        if(!o||(Number(r.ts)||0)>(Number(o.ts)||0)){ byId[r.id]=r; if(!o)add++; }
      });
      if(add)S.save(Object.values(byId).sort((a,b)=>(a.ts||0)-(b.ts||0)));
      pulled+=add;
      syncSetAt(k,newest);
    }catch(e){ failed++; }
  }
  syncBusy=false;
  /* Whether the record is really shared is not a thing to go hunting for in
     a hosting dashboard. The service answers it on every sync; this keeps
     the answer, so the tool can say which it is rather than leaving silence
     to be read as good news. */
  const allFailed=failed===Object.keys(SYNC_STORES).length;
  if(!allFailed)st.syncSeen=Date.now();
  st.syncShared=allFailed?"": (warn?"no":"yes");
  syncNote = allFailed ? "Couldn't reach the service."
           : warn ? ("Shared, but "+warn)
           : (pulled||pushed) ? ("Synced \u00b7 "+pushed+" sent, "+pulled+" received")
           : "Synced \u00b7 nothing new";
  try{ render(); }catch(e){}
}

function compStats(rows){
  const ps=(rows||[]).map(r=>r.price).filter(n=>n>0).sort((p,q)=>p-q);
  const n=ps.length;
  if(n<3)return null;
  const at=f=>ps[Math.min(n-1,Math.max(0,Math.round(f*(n-1))))];
  const med=seenMedian(ps), lo=at(0.25), hi=at(0.75);
  const sold=(rows||[]).filter(r=>r.basis==="sold").length;
  /* Which places the listings came from. The message under the button is gone
     the moment the price lands and the card moves to condition, so the
     breakdown has to live on the price itself to survive. */
  const by={}; (rows||[]).forEach(r=>{ const k=(r.where||"?").trim()||"?"; by[k]=(by[k]||0)+1; });
  const from=Object.keys(by).sort((a,b)=>by[b]-by[a]).map(k=>k+" "+by[k]).join(" \u00b7 ");
  const soldShare=sold/n;
  /* Asking prices sit above sales. The flag does not move the number - it is
     said on the card, so the counter can weigh it against a real sold page. */
  const mostlyAsks=soldShare<0.5;
  return {n, med, lo, hi, sold, soldShare, mostlyAsks, from,
    conf:(n>=6&&soldShare>=0.6)?"h":(n>=4?"m":"l"),
    mid:Math.max(5,Math.round(med/5)*5)};
}
/* Where a lookup goes. One general search answers from wherever it lands;
   these name the places the trade actually prices from, so the pile gets
   listings from each instead of whatever one pass happened to find. They run
   together rather than in turn - coverage costs a call each, it does not have
   to cost the wait as well - and one failing does not lose the others. */
function findPasses(x){
  /* Firearms get their own places entirely. eBay bans gun sales, so an eBay
     or Shopping pass on "Remington 870" comes back with barrels, stocks,
     optics and airsoft - priced like the gun and wrong by a factor of five.
     The card has always said so; the lookup was still asking. And GunBroker's
     completed auctions sit behind a login no search can reach, so asking for
     them by name returns nothing: what can be read is GunWatcher, which
     publishes the sold prices, and GunBroker's live listings as asks. */
  if(st.catId==="guns") return [
    {name:"GunWatcher", where:"GunWatcher", q:gunQuery(x),
     say:"gunwatcher.com, which publishes sold prices gathered from completed GunBroker auctions - use its sold or average sold figures, not asking prices"},
    /* guns.com publishes the WINNING BID on auctions it closed, for ninety
       days back - real sales, and a second source so the whole firearms
       category does not hang on GunWatcher alone, which refuses a direct
       read and is reachable only when a search happens to get through.

       Its stock leans hard toward collector and high-end pieces: the ended
       board runs to four-figure Colts and Smiths while the counter is
       looking at an 870 or a Mossberg 500. So the pass is told to throw
       away anything that is not the same class of gun - a $6,000 engraved
       collectible is not a comp for a pump gun, and averaging it in is
       worse than having no comp at all. */
    {name:"Guns.com ended", where:"Guns.com", q:gunQuery(x),
     say:"guns.com/auctions/recently-ended, which lists the winning bid on auctions closed in the last ninety days - those are sales, not asks. That site leans to collector and high-end guns, so keep only listings for the same ordinary working model that was asked about and discard rare, engraved, commemorative or historic pieces however well the name matches"},
    {name:"Auction results", where:"Auction",
     say:"published results from gun auction houses and sold-price archives - Rock Island, Morphy, Proxibid, GunsAmerica sold - for what the gun actually brought"},
    {name:"GunBroker, asking", where:"GunBroker",
     say:"current GunBroker listings, which are asking prices rather than sales - mark every one of these \"asking\""}];
  /* eBay first, and through its API rather than by searching for it. The
     pass below used to be named "eBay sold" and ask a web search for
     completed listings - which it could never return, because eBay's sold
     pages sit behind a login and the site refuses an automated reader
     outright. What came back was active listings: asking prices wearing a
     label that said sold. The API can answer the question properly, and it
     is free, so it goes first and the paid searches are the fallback. */
  const p=[{name:"eBay", where:"eBay", ebay:true}];
  p.push({name:"Searched, used", where:"eBay",
          say:"used-condition eBay listings and completed sales where you can reach them - mark anything still for sale \"asking\""});
  p.push({name:"Shopping, used", where:"Shopping",
          say:"used-condition listings currently for sale on Google Shopping and the marketplaces"});
  return p;
}
function findPrompt(q,pass){
  return 'Find what a used "'+q+'" sells for in the United States. Search '+pass.say+'. '+
    'List the individual listings you find, up to 12. Reply with JSON and nothing else: '+
    '{"comps":[{"price":<number, one listing\'s price>,"what":"<the item in a few words>",'+
    '"where":"<site>","basis":"sold" or "asking"}]}. '+
    'Only listings for the same thing - not parts, not accessories, not multi-item lots. '+
    'If you find none, reply {"comps":[]}.';
}
let findBusy=false, findMsg="", findAgain=false;
/* One press, every source. The counter said it plainly: if I am looking a
   thing up I want all the data there is, and I should not have to pick which
   search to run. So this no longer stops at the first pass that comes back
   full, and it asks what a new one costs in the same sweep - then keeps
   every answer side by side in st.evidence rather than quietly choosing one
   and throwing the rest away. */
async function priceFind(signal,all){
  if(findBusy||!CAP.sample)return;
  const x=calcItem(), q=compQuery(x);
  if(!q)return;
  const passes=findPasses(x);
  /* Every search costs money, so two things happen before one is fired.

     First: has this already been looked up? Listings are kept, so a chainsaw
     priced this morning and again this afternoon used to be paid for twice.
     If there are enough recent ones on file, use those and spend nothing.
     Holding the button down deliberately (a second press) searches anyway,
     because sometimes you do want the market rechecked. */
  const have=compStats(compsMatch(x));
  const FRESH=1000*60*60*24*10;
  const recent=compsMatch(x).filter(c=>Date.now()-(c.ts||0)<FRESH).length;
  if(have&&recent>=5&&!findAgain&&!all){
    findAgain=true;
    useComps(have);
    findMsg=have.n+" listings already on file from the last few days \u2014 no search needed. "+
            "Press again to check the market fresh.";
    render(); return;
  }
  findAgain=false;
  findBusy=true; render();
  /* Keep it in state and let the render put it on screen. Writing straight
     into the node loses the message whenever anything re-renders afterwards,
     which is exactly what happens when the lookup lands a price. */
  const say=t=>{ findMsg=t; const el=document.getElementById("pdFindMsg"); if(el)el.textContent=t; };
  say("Searching "+passes[0].name+"\u2026");
  /* Second: the passes run one at a time instead of all at once. The first
     is the best source for the category - sold eBay listings, or GunWatcher
     for a firearm - and when it comes back with plenty, the rest are paid
     for to confirm a number that is already good. Thin or failed, and it
     carries on to the next. Most lookups now cost one search, not two. */
  /* A pass may want the name put differently - GunWatcher by model alone.
     What comes back is still filed under the item's own search text. */
  const ENOUGH=8;
  const out=[], tally=[];
  const got=[]; let failed=0;
  for(let i=0;i<passes.length;i++){
    const P=passes[i];
    if(i)say("Thin so far \u2014 trying "+P.name+"\u2026");
    let r, note="";
    if(P.ebay){
      /* Free, so it never counts against the "enough" saving below - it is
         the thing doing the saving. */
      try{
        const j=await pdEbayComps(P.q||q,signal);
        r={status:"fulfilled",value:{comps:(j.comps||[])}};
        /* Say which kind of number came back. Without the Marketplace
           Insights grant eBay can only serve active listings, and the
           counter should see that on the tally rather than assume a sale. */
        note=j.basis==="sold"?" sold":" asks";
      }catch(e){ r={status:"rejected"}; }
    }else{
      try{ r={status:"fulfilled",value:await CAP.sample.json(findPrompt(P.q||q,P),{search:true,signal})}; }
      catch(e){ r={status:"rejected"}; }
    }
    out.push(r);
    if(r.status!=="fulfilled"){ failed++; tally.push(P.name+" failed"); continue; }
    const cs=((r.value&&r.value.comps)||[]).filter(c=>c&&Number(c.price)>0);
    cs.forEach(c=>got.push(Object.assign({},c,{where:String(c.where||P.where).slice(0,24)})));
    tally.push(P.name+note+" "+cs.length);
    if(!all&&got.length>=ENOUGH){ if(i<passes.length-1)tally.push("enough \u2014 "+(passes.length-1-i)+" search saved"); break; }
  }
  /* What a new one costs, gathered in the same sweep. It is the weakest
     number here and it is never chosen over a sale, but it is the one that
     answers "is this worth anything at all" when nothing else lands. */
  let retail=null;
  if(all&&!(signal&&signal.aborted)){
    say("Checking what it costs new\u2026");
    retail=await retailFetch(q,signal);
    tally.push(retail?"new "+money(retail.price):"new none");
  }
  findBusy=false;
  /* The same listing can surface in more than one pass; count it once. */
  const seen={};
  const uniq=got.filter(c=>{ const k=Math.round(c.price)+"|"+String(c.where||"").toLowerCase();
                             if(seen[k])return false; seen[k]=1; return true; });
  const added=compsAdd(q,uniq);
  if(added)pdSync();
  const x2=calcItem();
  const t=compStats(compsMatch(x2));
  if(all)gatherEvidence(x2,t,retail);
  if(!added&&!t){
    /* Nothing sold anywhere. A new price is still an answer, and before the
       sweep it was sitting behind a second button nobody pressed. */
    if(retail){ useEvidence("retail"); say(tally.join(" \u00b7 ")+" \u2014 no sales found, priced off new."); return; }
    render(); say(failed&&failed===out.length?"Every search failed. Try the sold pages.":"No listings found. Try the sold pages.");
    return;
  }
  if(t)useComps(t); else if(retail)useEvidence("retail");
  say(tally.join(" \u00b7 ")+" \u2014 "+added+" new"+(t?", "+t.n+" on file":"")+(got.length-uniq.length?", "+(got.length-uniq.length)+" duplicate dropped":""));
}
/* Every number the sweep turned up, kept side by side. The card below lists
   them all and marks the one in use, so nothing found is lost behind the
   one the tool happened to pick. */
function gatherEvidence(x,t,retail){
  const own=soldStats(itemKey()), seen=seenEstimate(seenMatch(x)), pct=retailPct(x);
  st.evidence={key:mkKey(),ts:Date.now(),
    comps:t?{n:t.n,med:t.med,lo:t.lo,hi:t.hi,sold:t.sold,from:t.from,mid:t.mid}:null,
    retail:retail?{price:retail.price,where:retail.where,pct,
                   mid:Math.max(5,Math.round(retail.price*pct/100/5)*5)}:null,
    own:own?{n:own.n,avg:Math.round(own.avg),mid:Math.max(5,Math.round(own.avg/5)*5)}:null,
    seen:seen?{n:seen.n,lo:seen.lo,hi:seen.hi,mid:seen.mid}:null,
    book:Math.round(x.baseValue)};
}
function useEvidence(kind){
  const E=st.evidence; if(!E)return;
  if(kind==="comps"&&E.comps){ useComps(compStats(compsMatch(calcItem()))); return; }
  if(kind==="retail"&&E.retail){
    st.market={kind:"retail",key:mkKey(),retail:E.retail.price,pct:E.retail.pct,
               where:E.retail.where,mid:E.retail.mid}; render(); return; }
  if(kind==="own"&&E.own){ st.market={kind:"own",key:mkKey(),n:E.own.n,mid:E.own.mid}; render(); return; }
  if(kind==="seen"&&E.seen){ st.market={kind:"seen",key:mkKey(),n:E.seen.n,ask:E.seen.mid,
               lo:E.seen.lo,hi:E.seen.hi,mid:E.seen.mid}; render(); return; }
  if(kind==="book"){ st.market=null; render(); }
}
/* Where the number on screen came from when nothing has been looked up yet.
   The counter asked how he is meant to know whether the tool is right about
   things he has not checked himself. The honest answer is per item, and it
   belongs on the item: a built-in number is a starting point somebody
   compiled, and until this shop has searched it once it has no evidence
   behind it at all. Saying so is the difference between a tool that is
   trusted where it has earned it and one that is trusted everywhere. */
function checkedNote(x){
  if(x&&x.checked)return "";
  const n=compsMatch(x).length;
  return n?`Built-in number \u2014 ${n} listing${n===1?"":"s"} on file from an earlier search. Look it up to check it again.`
          :`Built-in number \u2014 never checked against real sales here. Look it up and it will be.`;
}
/* One card, every source, the one in use marked. */
function evidenceHTML(){
  const E=st.evidence; if(!E||E.key!==mkKey())return "";
  const now=(st.market&&st.market.kind)||"book";
  const row=(kind,label,num,note)=>{
    const on=(kind===now)||(kind==="comps"&&now==="found");
    return `<button class="nsBtn${on?" on":""}" data-use="${kind}"${on?" disabled":""}>
      <span>${label}${note?`<i style="display:block;font-style:normal;opacity:.7;font-size:11.5px">${note}</i>`:""}</span>
      <b>${money(num)}</b><i>${on?"in use":"use this"}</i></button>`;
  };
  let h=`<div class="label" style="margin-top:14px">Everything it found</div>`;
  if(E.comps)h+=row("comps",`${E.comps.n} listing${E.comps.n===1?"":"s"}${E.comps.sold?`, ${E.comps.sold} sold`:""}`,
    E.comps.mid,`middle half ${money(E.comps.lo)}–${money(E.comps.hi)}${E.comps.from?" · "+esc(E.comps.from):""}`);
  if(E.own)h+=row("own",`Your own sales — ${E.own.n}`,E.own.mid,"what this shop actually got");
  if(E.seen)h+=row("seen",`Shelf tags you recorded — ${E.seen.n}`,E.seen.mid,
    `asking ${money(E.seen.lo)}–${money(E.seen.hi)}`);
  if(E.retail)h+=row("retail",`New retail${E.retail.where?" — "+esc(E.retail.where):""}`,E.retail.mid,
    `${money(E.retail.price)} new, ${E.retail.pct}% of new for a used one — not a sold price`);
  h+=row("book","The built-in list",E.book,"where the tool starts before it searches");
  return h;
}
function useComps(t){
  if(!t)return;
  st.market={kind:"found",key:mkKey(),n:t.n,med:t.med,lo:t.lo,hi:t.hi,sold:t.sold,
             mostlyAsks:t.mostlyAsks,conf:t.conf,mid:t.mid,from:t.from};
  render();
}
/* A price on another shop's shelf is what a used one goes for here - it is
   already the selling price, so it is used as it stands. How far that shop
   will discount it before it moves is their markdown policy and the POS's
   business, not this tool's. The count of asks against sales is still shown,
   so the counter can judge the evidence rather than have it adjusted for
   them. */
function seenEstimate(list){
  const asks=(list||[]).map(s=>s.ask).filter(n=>n>0);
  if(!asks.length)return null;
  const m=seenMedian(asks);
  return {n:asks.length, lo:Math.min.apply(null,asks), hi:Math.max.apply(null,asks), ask:m,
          mid:Math.max(5,Math.round(m/5)*5)};
}
function seenExport(){
  const a=seenAll();
  if(!a.length){ alert("Nothing recorded yet."); return; }
  try{
    const b=new Blob([JSON.stringify(a,null,1)],{type:"application/json"});
    const u=URL.createObjectURL(b), el=document.createElement("a");
    el.href=u; el.download="pawn-desk-shelf-prices.json"; el.click();
    setTimeout(()=>URL.revokeObjectURL(u),4000);
  }catch(e){ alert("Couldn't export."); }
}
function seenImport(f){
  const r=new FileReader();
  r.onload=()=>{
    let rows=null; try{ rows=JSON.parse(String(r.result||"")); }catch(e){}
    if(!Array.isArray(rows)){ alert("That file isn't a shelf-price export."); return; }
    const have=seenAll(), ids={};
    have.forEach(s=>{ ids[s.id]=1; });
    let added=0;
    rows.forEach(s=>{ if(s&&s.id&&!ids[s.id]&&s.ask>0&&s.name){ have.push(s); ids[s.id]=1; added++; } });
    seenSave(have); render();
    alert(added+" added. "+seenAll().length+" on this device now.");
  };
  r.readAsText(f);
}
let seenBusy=false;
async function seenFromPhoto(f){
  if(!f||seenBusy||!CAP.sample)return;
  seenBusy=true; render();
  try{
    const d=await CAP.sample.json(
      'This is a price tag in a pawn or second-hand shop. Read it and reply with JSON and nothing else: '+
      '{"name":"<what the item is, in plain words>","brand":"<brand or empty>","model":"<model or empty>",'+
      '"ask":<the price being asked, a number>,"reg":<the REGULAR or WAS price if one is printed, else 0>,'+
      '"store":"<shop name if visible, else empty>"}. '+
      'If this is not a price tag, reply {"name":"","ask":0}.',
      {images:f});
    seenBusy=false;
    if(!d||!(Number(d.ask)>0)){ render(); alert("Couldn't read a price off that tag."); return; }
    seenAdd(d); render(); pdSync();
  }catch(e){ seenBusy=false; render(); alert("Couldn't read that tag ("+((e&&e.code)||"error")+")."); }
}
function seenCardHTML(){
  const all=seenAll();
  return '<div class="card" id="seenCard"><span class="label">Shelf prices you\'ve recorded</span>'+
    '<div class="cardHint">'+(all.length
      ? all.length+" tag"+(all.length===1?"":"s")+" recorded &mdash; what other shops are asking for a used one."
      : "Photograph another shop&rsquo;s price tag and it goes in here. These are asking prices, not sales.")+'</div>'+
    '<div class="row2" style="margin-top:8px;flex-wrap:wrap;gap:8px">'+
      (CAP.sample?'<label class="ghostBtn" style="margin:0;cursor:pointer">'+(seenBusy?"Reading&hellip;":"Photograph a tag")+
        '<input id="seenIn" type="file" accept="image/*" capture="environment" style="display:none"></label>':'')+
      '<button class="ghostBtn" id="seenHand">Type one in</button>'+
      (pdServer()?'<button class="ghostBtn" id="seenSync">'+(syncBusy?"Syncing&hellip;":"Sync")+'</button>':'')+
      /* Export and Import moved to Phones & devices. Moving the record
         between devices is a setup job, not a counter job - Sync does it by
         itself once the service is on. */
    '</div>'+
    (syncNote?'<div class="cardHint">'+esc(syncNote)+'</div>':'')+
    '</div>';
}
document.addEventListener("change",e=>{
  const t=e.target;
  if(t&&t.id==="seenIn"&&t.files&&t.files[0]){ seenFromPhoto(t.files[0]); t.value=""; }
  if(t&&t.id==="seenImp"&&t.files&&t.files[0]){ seenImport(t.files[0]); t.value=""; }
  if(t&&t.id==="shFile"&&t.files&&t.files[0]){
    const f=t.files[0]; t.value="";
    const rd=new FileReader();
    rd.onerror=()=>{ shMsg="Couldn\u2019t read that file."; render(); };
    rd.onload=()=>{ const r=sheetRead(String(rd.result||""));
      if(r.err){ shMsg=r.err; shPend=null; } else { shPend=r; shMsg=""; }
      render(); };
    rd.readAsText(f);
  }
},true);
document.addEventListener("click",e=>{
  const b=e.target&&e.target.closest?e.target.closest("#seenHand,#seenOut,#seenUse,#seenSync,#pdFindGo,#foundUse,#pdCopyConn,#harvStop,#harvDl,#harvClear,#harvCheck,#shPasteGo,#shPasteRead,#shApply,#shCancel,[data-use],[data-harv]"):null; if(!b)return;
  if(b.id==="pdFindGo"){ priceFind(null,true); return; }
  if(b.dataset.harv!=null){ harvRun("",Number(b.dataset.harv)); return; }
  if(b.id==="harvStop"){ harvStop=true; return; }
  if(b.id==="harvDl"){ harvDownload(); return; }
  if(b.id==="harvClear"){ HARV={}; harvSave(); render(); return; }
  if(b.id==="harvCheck"){ pdSync(); return; }
  if(b.id==="shPasteGo"){ st.shPaste=!st.shPaste; shMsg=""; render(); return; }
  if(b.id==="shPasteRead"){
    const t=document.getElementById("shPaste"); const r=sheetRead(t?t.value:"");
    if(r.err){ shMsg=r.err; shPend=null; } else { shPend=r; shMsg=""; }
    render(); return; }
  if(b.id==="shApply"){ if(shPend){ const n=shPend.changes.length; sheetApply(shPend); shPend=null;
    st.shPaste=false; shMsg=n+" price"+(n===1?"":"s")+" are now yours."; render(); } return; }
  if(b.id==="shCancel"){ shPend=null; shMsg=""; render(); return; }
  if(b.dataset.use){ useEvidence(b.dataset.use); return; }
  if(b.id==="foundUse"){ useComps(compStats(compsMatch(calcItem()))); return; }
  if(b.id==="seenSync"){ pdSync(); return; }
  if(b.id==="seenOut"){ seenExport(); return; }
  /* Typing a Railway address and a token on a phone keyboard is where this
     gets abandoned. Copy them here, send them to yourself, paste there. */
  if(b.id==="pdCopyConn"){
    const t=pdServer()+"\n"+pdToken();
    const said=ok=>{ b.textContent=ok?"Copied \u2014 now paste it on the phone":"Select the two lines above and copy them";
                     setTimeout(()=>{ b.textContent="Copy both"; },4000); };
    try{ navigator.clipboard.writeText(t).then(()=>said(true),()=>said(false)); }catch(e){ said(false); }
    return; }
  if(b.id==="seenUse"){
    const est=seenEstimate(seenMatch(calcItem()));
    if(est){ st.market={kind:"seen",key:mkKey(),n:est.n,ask:est.ask,lo:est.lo,hi:est.hi,mid:est.mid}; render(); }
    return;
  }
  const name=prompt("What is it? (e.g. husqvarna 455 rancher chainsaw)"); if(name===null||!name.trim())return;
  const ask=prompt("What are they asking? ($)"); if(ask===null)return;
  const reg=prompt("Regular or was price, if the tag shows one (blank if not):","");
  const store=prompt("Which shop? (blank if you'd rather not)","");
  if(seenAdd({name:name,ask:parseFloat(ask),reg:parseFloat(reg||0),store:store||""})){ render(); pdSync(); }
});
/* Each price row carries a confidence flag, and a letter is no use at a
   counter. It grades how good the data behind the row is - not what kind of
   source it came from: GunWatcher is GunBroker sold data and Swappa is a sold
   marketplace, and both are flagged m. Saying "from a price guide" on those
   would be a lie the data does not support, so these report the confidence
   and let the source name, which is shown beside it, speak for itself.
   Most rows are m; a handful are h and the rest l. */
const CONF_WORD={h:"good data",m:"fair data",l:"thin data"};
function confShort(c){ return CONF_WORD[c]||""; }
/* The price sources that are not the sold pages. The desk and the phone draw
   their step cards differently, but the evidence they offer is the same and in
   the same order - what was looked up before, a fresh lookup, then what the
   shops nearby are asking - so it is written once here. */
function altSourcesHTML(x,noFind){
  let h="";
  const M=compsMatch(x), T=compStats(M);
  if(T) h+=`<div class="label" style="margin-top:14px">Listings on file</div>`
         +`<button class="nsBtn on" id="foundUse"><span>${T.n} listing${T.n===1?"":"s"}${T.sold?", "+T.sold+" sold":""} &middot; middle half ${money(T.lo)}&ndash;${money(T.hi)}</span><b>${money(T.mid)}</b><i>use this</i></button>`
         +thumbStripHTML(M);
  /* The desk carries this in the Next step panel, where it is on screen
     whatever step is showing. Two of them would mean two elements with one
     id, and the message would be written to whichever came first - which is
     how it ended up being written to a hidden one. */
  if(CAP.sample&&window.PHONE&&!noFind)
    h+=`<button class="nsBtn${T?"":" on"}" id="pdFindGo" style="margin-top:8px"><span>${findBusy?"Looking it up&hellip;":"Look up what it sells for used"}</span></button>`
      +`<div class="cardHint" id="pdFindMsg"></div>`;
  /* Google Shopping's used filter: asking prices for used ones, which sits
     below a completed sale and above a new-retail figure. The structured
     filter rides in an opaque per-query blob that cannot be built for an
     arbitrary item, so the Shopping tab plus the word "used" does the same
     work for anything. Read the price and type it in the box above - it is a
     selling price already, so it must not take the new-to-used haircut. */
  h+=`<div class="label" style="margin-top:14px">Used ones, for sale now</div>`
    +`<a class="nsBtn" href="https://www.google.com/search?udm=28&q=${encodeURIComponent("used "+compQuery(x))}" target="_blank" rel="noopener" referrerpolicy="no-referrer"><span>Used on Google Shopping</span><b>&#8599;</b></a>`
    +`<div class="cardHint">Asking prices, not sales &mdash; but for what a used one is actually listed at, closer than a new price. Type it into the box above.</div>`;
  const E=seenEstimate(seenMatch(x));
  if(E) h+=`<div class="label" style="margin-top:14px">Seen on shelves near you</div>`
         +`<button class="nsBtn on" id="seenUse"><span>${E.n} tag${E.n===1?"":"s"}, asking ${money(E.lo)}&ndash;${money(E.hi)}</span><b>${money(E.mid)}</b><i>use this</i></button>`;
  return h;
}
function nsSrcShort(m){
  if(!m)return "";
  if(m.kind==="list")return srcName(m.src)+", "+fmtDay(m.date)+(confShort(m.conf)?" \u00b7 "+confShort(m.conf):"");
  if(m.kind==="shot")return m.n+" sold on "+(m.site||"the sold page");
  if(m.kind==="own")return "your "+m.n+" sales";
  if(m.kind==="retail")return "est. from "+money(m.retail)+" new";
  if(m.kind==="seen")return m.n+" seen locally, asking "+money(m.ask);
  if(m.kind==="found")return m.n+" listings, median "+money(m.med)+(confShort(m.conf)?" \u00b7 "+confShort(m.conf):"");
  if(m.kind==="harvest")return "your own price list \u00b7 "+m.n+" listings, "+fmtDay(m.date);
  return "your number";
}
function nextStepHTML(x){
  if(window.PHONE&&window.phoneStepHTML)return phoneStepHTML(x);
  const m=x.market, what=[st.brandTyped,st.model].filter(Boolean).join(" ")||displayName(x);
  const cands=(!x.checked&&!st.mpNone)?mpCandidates():[];
  const started=!!st.picked;
  /* A hand-set resale already has the wear in it, so condition is not
     asked - asking it would be asking for something the desk has just
     decided to ignore, and the run would stall on a step that does nothing. */
  const s1done=started&&(x.checked||!cands.length), s2done=started&&x.checked,
        s3done=started&&x.checked&&(!!st.condSet||x.handSet);
  const cur=!s1done?1:!s2done?2:!s3done?3:4;
  const step=(n,label,val,done)=>`<div class="nsStep${done?" done":""}${cur===n?" cur":""}"><span class="nsDot">${done?"&#10003;":n}</span><span class="nsL">${label}</span><span class="nsV">${val}</span></div>`;
  const cw=COND_WORDS[st.cond]||["Good",""];
  const steps=`<div class="nsSteps">
    ${step(1,"What it is",started?esc(what):"not set",s1done)}
    ${step(2,"Resale value",x.checked?money(m.mid)+` <small>${esc(nsSrcShort(m))}</small>`:(m&&m.stale?"list is old":"not checked"),s2done)}
    ${step(3,"Condition",x.handSet?"in your number":(s3done?cw[0]:"not set"),s3done)}
    ${step(4,"Your offer",x.checked&&s3done
      /* On the desk the pinned panel is six inches to the right of this row
         with both figures in it. Saying them again here, side by side, is the
         same number twice on one line of sight. The phone has no pin. */
      ?(window.PHONE?`Loan ${money(x.target)}<small>or buy it for ${money(x.buy)}</small>`
                    :`Ready<small>${deskRail()?"the numbers are on the right":"the numbers are in the bar above"}</small>`)
      :"&mdash;",cur===4)}</div>`;
  let h="",sub="",act="";
  if(cur===1&&!started){
    h=`What are you looking at?`;
    sub=`Search above and tap what it is &mdash; the desk fills in its <b>resale value</b> from there.`;
    act="";
  } else if(cur===1){
    h=`Which ${esc(what)} is it?`;
    sub=`Pick one and the desk fills in its <b>resale value</b> &mdash; what it sells for used. Each one comes from a real sales source you can open and check.`;
    act=cands.map(r=>`<button class="nsBtn" data-mp="${esc(r[0])}"><span>${esc(r[2])}</span><b>${money(r[3])}&ndash;${money(r[4])}</b><i>resale</i></button>`).join("")
       +`<button class="nsBtn ghost" id="nsNone"><span>Not one of these</span></button>`;
  } else if(st.needKind&&!window.PHONE){
    /* Until this is answered the category is whatever was last used, so the
       sources, the percentages and the buy rate all belong to the wrong kind
       of thing - a recliner was being offered GunBroker. */
    h=`What kind of thing is <b>${esc(st.bookName||"it")}</b>?`;
    sub=`Pick one and the desk knows where to look for prices and what share of new to work from. Nothing is priced until it does.`;
    act=CATALOG.map(c=>`<button class="nsBtn" data-cat="${c.id}"><span>${esc(c.label)}</span></button>`).join("");
  } else if(cur===2){
    h=m&&m.stale?`The price list for ${esc(m.name)} is ${m.age} days old. Check what it sells for now.`:`Check what it actually sold for.`;
    /* The "Pawn price favorite" is a browser button that has to be installed
       first. Telling everyone to click one they may not have is telling them
       to do something they cannot. It is mentioned only once it is there. */
    sub=CAP.sample?"Tap <b>Look up what it sells for used</b>. It searches eBay sold and Google Shopping used together and brings the middle price back here &mdash; you do not open or read anything. Already know the price? Type it in the box."
      :pdBridge?"Click a button. The sold page opens, reads itself, and the price lands here."
      :"Open one and look at what the thing <b>actually sold for</b> &mdash; not what it was listed at. Then come back and type the middle price into the box.";
    const solds=compTargets(x).map(t=>`<a class="nsBtn nsSold" title="Opens ${esc(t.name)} in a new tab so you can look at what these actually sold for. Come back and type the middle price in." data-label="${t.name}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${t.name}</span><b>&#8599;</b></a>`).join("");
    /* A button saying "type it" that jumped the page 900px down to a box
       somewhere else. The box belongs here, beside the one for the new
       price, which has worked this way all along. */
    const typeIt=`<div class="row2" style="margin-top:8px;flex-basis:100%"><input id="nsVal" class="numIn" title="What ONE OF THESE sells for used \u2014 not what you will lend, and not what it cost new." type="number" inputmode="decimal" placeholder="I know the price \u2014 type what it sells for used" style="flex:1;min-width:0"><button class="ghostBtn" id="nsValGo" title="Use the price you typed as the resale value" style="padding:10px 15px">Use it</button></div>`;
    const rest=altSourcesHTML(x)
       +`<div class="label" style="margin-top:14px;flex-basis:100%">No sold prices? Use what it costs new</div>`
       +(CAP.sample?`<button class="nsBtn on" id="pdRetGo"><span>${retailBusy?"Looking it up&hellip;":"Look up the new price"}</span></button><div class="cardHint" id="pdRetMsg"></div>`:retailTargets(compQuery(x)).map(t=>`<a class="nsBtn nsRetail" title="Opens ${esc(t.name)} to find what it costs NEW. Use this only when there are no sold prices." data-label="${esc(t.name)}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${esc(t.name)}</span><b>&#8599;</b></a>`).join(""))
       +`<div class="row2" style="margin-top:8px;flex-basis:100%"><input id="nsRet" class="numIn" title="What it costs NEW today. The desk takes it down to a used price using the share for this category \u2014 a last resort when the sold pages come up empty." type="number" inputmode="decimal" placeholder="What it costs new" style="flex:1;min-width:0"><button class="ghostBtn" id="nsRetGo" title="Take the new price down to a used estimate" style="padding:10px 15px">Use it</button></div>`
       +`<div class="cardHint">In ${esc(x.cat.label.toLowerCase())}, a used one books at about <b>${retailPct(x)}%</b> of new here &mdash; $100 new lands at ${money(Math.round(retailPct(x)))}. A real sold price beats this every time, so use this only when the sold pages come up empty.</div>`;
    /* When the service can do the looking, a row of buttons that only open a
       tab sits beside the one that does the work and looks exactly like it -
       so the counter taps "eBay sold", lands on eBay, and nothing comes back.
       Shut them away: the green button, and a box for a price already known,
       are the whole step. */
    act=CAP.sample
      ?typeIt+`<details class="fold" style="flex-basis:100%"><summary class="foldLine">Rather look yourself &mdash; open the sold pages, or work from the new price</summary><div class="nsAct">${solds+rest}</div></details>`
      :solds+typeIt+rest;
  } else if(cur===3){
    h=`What shape is it in?`;
    sub=`Next to a typical used one. The resale value assumes <b>Good</b>, normal wear.`;
    act=CONDITIONS.map(c=>{ const w=COND_WORDS[c.id]||[c.label,""]; return `<button class="nsBtn" data-ncond="${c.id}"><span>${w[0]}</span><b>${w[1]}</b></button>`; }).join("");
  } else if(!window.PHONE){
    /* The pinned panel holds the loan and the buy price and does not scroll
       away, so saying them again here made one figure appear five times on a
       screen. What it cannot show is where they came from. That is this. */
    h=`Where those numbers come from.`;
    sub=`<b>Resale value ${money(m.mid)}</b> ${x.handSet?"&mdash; your own figure, taken as this one sits"
        :`used (${esc(nsSrcShort(m))})${Math.round(x.resale)!==m.mid?`, ${money(x.resale)} in ${cw[0].toLowerCase()} shape`:""}`}.<br>
      Lend <b>${x.ltv}%</b> of that, buy at <b>${x.buyPct}%</b>. A loan he pays back with the fee to get it back; a buy is yours to sell.<br>
      The offer is on the right, and it moves as you change the answers.`;
  } else {
    h=`Lend him ${money(x.target)}, or buy it for ${money(x.buy)}.`;
    sub=`<b>Pawn loan ${money(x.target)}</b>: the cash you lend him. He pays it back with the fee to get it back. Room to move: ${money(x.low)} to ${money(x.high)}.<br>
      <b>Buy price ${money(x.buy)}</b>: you pay him once and it's yours to sell.<br>
      Both come from the <b>resale value</b>, ${money(m.mid)} used (${esc(nsSrcShort(m))})${Math.round(x.resale)!==m.mid?`, about ${money(x.resale)} in ${cw[0].toLowerCase()} shape`:""}. Lend ${x.ltv}% of it, buy at ${x.buyPct}%.`;
    const u=m.kind==="list"?m.src:m.url;
    /* The live lookup lives in step 4, which is folded shut once there is a
       price - so the one thing that does the work for you was out of sight
       exactly when you would want to check the figure it found. */
    act=(srcLink(u,m.kind==="list"?"Check "+srcName(u):"See those sales").replace('class="srcLink"','class="srcLink nsBtn ghost"'))
       +`<button class="nsBtn ghost" data-ncond="${st.cond}" id="nsCond"><span>Change condition</span></button>`;
  }
  /* The lookup is the one thing that does the work instead of handing the
     counter a page to read, and it was only drawn on the step that happened
     to be showing. It belongs in the action row whatever step that is. */
  /* Not while it is still asking what kind of thing this is. The category
     picks the search sources and the share of new to work from, so a lookup
     fired before that answer searches as whatever was priced last - and the
     line above it says in plain words that nothing is priced yet. */
  const asking=st.needKind&&!window.PHONE;
  if(CAP.sample&&st.picked&&!asking&&!findBusy&&!(act||"").includes("pdFindGo"))
    act=`<button class="nsBtn${x.checked?" ghost":" on"}" id="pdFindGo" title="Searches the sold pages, the used listings and what it costs new, all in one press, and brings every number back here. You do not have to open or read anything.\u000aFor firearms it searches GunWatcher, auction results and GunBroker instead \u2014 eBay bans gun sales."><span>${x.checked?"Look it up again":"Look it up \u2014 everywhere"}</span></button>`+act;
  else if(CAP.sample&&!asking&&findBusy&&!(act||"").includes("pdFindGo"))
    act=`<button class="nsBtn on" id="pdFindGo" disabled><span>Looking it up&hellip;</span></button>`+act;
  if(CAP.sample&&st.picked&&!asking)act+=`<div class="cardHint" id="pdFindMsg" style="flex-basis:100%">${esc(findMsg||(findBusy?"":checkedNote(x)))}</div>`
    +`<div style="flex-basis:100%">${evidenceHTML()}</div>`;
  /* In step-at-a-time the run down the middle already carries the steps with
     their answers, and the strip carries the numbers. Repeating the list here
     is a third copy of the same progress, and it is what pushes the loan card
     off the first screen. Keep what it alone has: what to do now. */
  const bare=stepFlow()==="steps"&&!window.PHONE&&st.picked;
  /* Once every question is answered this panel stops being a next step and
     becomes an explanation of the figures - but it went on calling itself
     NEXT STEP, so the counter was left looking for a step that was not
     there. Say which it is. */
  const done=cur===4;
  return `<div class="card nextStep${bare?" bare":""}" id="nextStep"><span class="label">${done?"All answered &mdash; nothing left to set":"Next step"}</span><div class="nsGrid">${bare?"":steps}
    <div class="nsMain"><div class="nsH">${h}</div><div class="nsSub">${sub}</div><div class="nsAct">${act}</div></div></div></div>`;
}
/* The measurement boxes. Each keystroke re-judges, so the verdict moves as
   the caliper does - but only the verdict is redrawn, never the input the
   finger is in, or the number being typed would jump away mid-digit. */
function wireSpec(){
  const sel=document.getElementById("specPick");
  if(sel)sel.onchange=()=>{ st.specPick=sel.value; st.specOpen=true; render(); };
  const box=document.getElementById("specFold");
  if(box&&!box.dataset.wired){ box.dataset.wired="1";
    box.addEventListener("toggle",()=>{ st.specOpen=box.open; }); }
  [["spec_g","g"],["spec_d","d"],["spec_t","t"],["spec_lug","lug"],["spec_w","w"]].forEach(([id,k])=>{
    const el=document.getElementById(id); if(!el)return;
    el.oninput=()=>{ st.specIn=Object.assign({},st.specIn,{[k]:el.value}); repaintSpec(); };
  });
}
function repaintSpec(){
  const sh=fakeSheet(calcItem()); if(!sh)return;
  const card=document.getElementById("fakeCard"); if(!card)return;
  const old=card.querySelector("#specFold"); if(!old)return;
  /* Swap only the answer block under the inputs. */
  const tmp=document.createElement("div");
  tmp.innerHTML=specCardHTML(sh);
  const fresh=tmp.querySelector("#specFold");
  const a=old.lastElementChild, b=fresh&&fresh.lastElementChild;
  if(a&&b&&a.tagName===b.tagName&&!/^(SELECT|INPUT|LABEL)$/.test(a.tagName))a.replaceWith(b);
}
function wireNext(){
  if(window.PHONE&&window.wirePhone){ wirePhone(); return; }
  const ns=document.getElementById("nextStep"); if(!ns)return;
  ns.querySelectorAll("[data-mp]").forEach(b=>b.onclick=()=>{
    const r=MP_BY_ID[b.dataset.mp]; if(!r)return;
    let name=r[2]; const bt=(st.brandTyped||"").trim();
    if(bt&&name.toLowerCase().indexOf(bt.toLowerCase()+" ")===0)name=name.slice(bt.length+1);
    st.model=name; st.mpPin={id:r[0],model:name}; st.mpNone=false; st.market=null; st.editing=false; render();
  });
  const none=document.getElementById("nsNone"); if(none)none.onclick=()=>{ st.mpNone=true; render(); };
  const ri=document.getElementById("nsRet"), rg=document.getElementById("nsRetGo");
  const useRetail=()=>{ const n=parseFloat(ri&&ri.value);
    if(n>0){ const p=retailPct(calcItem()); st.market={kind:"retail",key:mkKey(),retail:Math.round(n),pct:p,mid:Math.max(5,Math.round(n*p/100/5)*5)}; render(); } };
  if(rg)rg.onclick=useRetail; if(ri)ri.onkeydown=e=>{ if(e.key==="Enter")useRetail(); };
  const vi=document.getElementById("nsVal"), vg=document.getElementById("nsValGo");
  /* Same shape as the new-price box beside it, and the same place the step-4
     box writes to, so it makes no difference which one is used. */
  const useTyped=()=>{ const n=parseFloat(vi&&vi.value);
    if(n>0){ st.market={kind:"hand",key:mkKey(),mid:Math.round(n)}; st.editing=false; render(); } };
  if(vg)vg.onclick=useTyped; if(vi)vi.onkeydown=e=>{ if(e.key==="Enter")useTyped(); };
  ns.querySelectorAll("[data-ncond]").forEach(b=>b.onclick=()=>{
    if(b.id==="nsCond"){ st.condSet=false; render(); return; }
    st.cond=b.dataset.ncond; st.condSet=true; render();
  });
}


/* ================= BUY OUTRIGHT — you own it, no loan =================
   Starting rates Jace approved 9/19: about 5 points over the lending rate,
   same as the loan for seasonal outdoor power. */
var BUY_DEFAULT={guns:55,hunt:45,jewel:45,power:45,tools:40,music:40,rolling:40,elec:30,appl:35,fit:28,coll:40};
var BUY_WHY={guns:"guns sell fast here and hold their value",jewel:"a proven one holds its price, but it sits until the right buyer walks in",hunt:"steady seller in season",tools:"steady seller",
  music:"they sell, just slower",rolling:"big dollars, needs a clean title, sells slower",
  power:"seasonal and often needs a carb cleaned, but it sells and the shelves around here ask real money for it",elec:"loses value fast and can come in locked"};
function buyRateHTML(x){
  const set=st.buys&&st.buys[st.catId]!=null;
  return `<div id="buyRate" style="margin-top:18px">
    <div class="rateRow"><span class="label">Buy-outright rate for ${x.cat.label.toLowerCase()} (%)</span><input id="buyNum" class="numIn rateNum" type="number" inputmode="numeric" min="10" max="90" value="${x.buyBase}"></div>
    <input type="range" min="10" max="90" value="${x.buyBase}" id="buySlider">
    <div class="sliderScale"><span>10% &mdash; lowball</span><span>90% &mdash; almost no profit</span></div>
    <div class="rateRow" style="margin-top:16px"><span class="label">Least you\u2019ll clear on any buy ($)</span><input id="buyFloorNum" class="numIn rateNum" type="number" inputmode="numeric" min="0" max="500" value="${x.buyFloor}"></div>
    <div class="rateRow" style="margin-top:8px"><span class="label">Times your money back (\u00d7)</span><input id="buyMultNum" class="numIn rateNum" type="number" inputmode="decimal" min="1" max="10" step="0.1" value="${x.buyMult}"></div>
    <div class="cardHint" style="font-size:13px">These two apply everywhere rather than per category, and the tightest of the three decides. The rate bites on expensive things; the ${money(x.buyFloor)} floor stops the cheap item you haul home for nothing; the ${x.buyMult}\u00d7 bites in the middle, where a percentage looks fine and the dollars are thin. <b style="color:var(--ink)">On this one: ${esc(buyCapWhy(x))}.</b></div>
    <div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">What you pay to buy it outright, as a share of the resale value. ${(()=>{ const d=BUY_DEFAULT[x.cat.id]; if(d==null)return ""; return set&&x.buyBase!==d?`Suggested: <b style="color:var(--ink)">${d}%</b> (${BUY_WHY[x.cat.id]||""}). <button id="buyReset" class="ghostBtn" style="padding:5px 12px;font-size:12px;margin-left:4px">Use ${d}%</button>`:`Suggested: <b style="color:var(--ink)">${d}%</b> &mdash; ${BUY_WHY[x.cat.id]||""}.`; })()} You carry the risk and hold it 30 days before you can sell.</div></div>`;
}
function buyRowHTML(x){
  return `<div class="buyRow"><div><div class="l">Or buy it outright</div><div class="s">${esc(buyCapWhy(x))} &mdash; the tightest of your three buying rules, against ${money(Math.round(x.resale))} resale. You own it, no loan to pay back.</div></div><div class="v">${money(x.buy)}</div></div>`;
}
function refreshBuyRate(){
  if(st.buys&&st.buys[st.catId]!=null)return;
  const br=document.getElementById("buyRate"); if(!br)return;
  br.outerHTML=buyRateHTML(calcItem()); wireBuy();
}
function wireBuy(){
  const fl=document.getElementById("buyFloorNum"), mu=document.getElementById("buyMultNum");
  if(fl)fl.onchange=()=>{ st.buyFloor=Math.max(0,Number(fl.value)||0); persist(); render(); };
  if(mu)mu.onchange=()=>{ st.buyMult=Math.max(1,Number(mu.value)||1); persist(); render(); };
  const sl=document.getElementById("buySlider"), n=document.getElementById("buyNum");
  if(!sl)return;
  try{ paintSlider(sl); }catch(e){}
  const setTo=v=>{ if(!st.buys)st.buys={}; st.buys[st.catId]=v; refreshStep4(); };
  sl.oninput=()=>{ const v=Number(sl.value); if(n)n.value=v; try{ paintSlider(sl); }catch(e){} setTo(v); };
  sl.onchange=()=>{ persist(); const br=document.getElementById("buyRate"); if(br&&!document.getElementById("buyReset")){ br.outerHTML=buyRateHTML(calcItem()); wireBuy(); } };
  if(n){ n.oninput=()=>{ let v=parseInt(n.value); if(isNaN(v))return; v=Math.max(10,Math.min(90,v)); sl.value=v; try{ paintSlider(sl); }catch(e){} setTo(v); };
         n.onblur=()=>{ persist(); render(); }; }
  const rs=document.getElementById("buyReset"); if(rs)rs.onclick=()=>{ delete st.buys[st.catId]; persist(); render(); };
}

/* ---------------- render ---------------- */
function render(){
  const _ae=document.activeElement, _omF=!!(_ae&&_ae.id==="omniIn"), _omS=_omF?[_ae.selectionStart,_ae.selectionEnd]:null;
  renderTabs();
  const v=document.getElementById("view");
  /* keep the user's place — no jump to top, no column reset */
  const pageY=window.scrollY, zones={};
  ["colL","colC","colR"].forEach(c=>{const el=v.querySelector("."+c);if(el)zones[c]=el.scrollTop;});
  /* The start state is not the three-column layout - it is one pane. The
     class says so, because without it the pane lands in the 300px column the
     grid reserves for the lists. */
  v.className=st.mode+((st.mode==="item"&&!st.picked&&!window.PHONE)?" start":"");
  const sy=document.getElementById("sysline");
  /* Short enough to sit on the same row as the title and the tabs. It used
     to wrap onto a second row, which left a gap beside the title and another
     beside itself. The green dot already says SYS.OK, so the words went. */
  if(sy)sy.textContent=fmtDay(FEED.date)+" · Gold $"+Math.round(FEED.gold).toLocaleString("en-US")+" · Silver $"+Number(FEED.silver).toFixed(2)
    +(BUILD?" · build "+BUILD+(st.newBuild?" (old — "+st.newBuild+" is out)":""):"");
  if(st.mode==="item"){v.innerHTML=renderItem();wireItem();}
  else if(st.mode==="metal"){v.innerHTML=renderMetal();wireMetal();}
  else if(st.mode==="log"){v.innerHTML=renderLog();wireLog();}
  else if(st.mode==="device"){v.innerHTML=renderDevice();}
  else if(st.mode==="setup"){v.innerHTML=renderSetup();}
  else {v.innerHTML=renderFlags();}
  /* After the chain, never inside it: dropped between the last else-if and
     its else, this line stole the else, and every screen that was not
     out of date drew the walk-away list instead of itself. */
  if(st.newBuild)v.insertAdjacentHTML("afterbegin",staleHTML());
  /* The spotting-fakes card shows on the item page and the metal page both,
     so its measurement boxes are wired after whichever one drew it. */
  try{ wireSpec(); }catch(e){}
  try{ applyPages(); }catch(e){}
  ["colL","colC","colR"].forEach(c=>{const el=v.querySelector("."+c);if(el&&zones[c]!=null)el.scrollTop=zones[c];});
  window.scrollTo(0,pageY);
  if(_omF&&st.mode==="item"){ const o=document.getElementById("omniIn"); if(o){ o.focus({preventScroll:true}); try{ o.setSelectionRange(_omS[0],_omS[1]); }catch(e){}
    /* Something was just picked, so do not reopen the list over the answer.
       The box keeps the name; typing again opens it. */
    if(st.omniDone){ const l=document.getElementById("omniList");
      if(l){ l.hidden=true; o.setAttribute("aria-expanded","false"); } }
    else omniShow(); } }
  document.getElementById("foot").innerHTML=
   `Metal prices refresh automatically each morning (last: ${FEED.date}). Your item prices, lending rates, and any same-day hand edits save on this device only — set them once on the counter tablet. Starting numbers are estimates for rural North Florida — the tool is only as good as what you put in it.<span class="saveNote" id="saveNote"></span>`;
}
/* Settings handed over by QR have to land before anything asks whether the
   service is on, so this runs ahead of the first draw. */
try{ pdReadHandoff(); }catch(e){}
render();
