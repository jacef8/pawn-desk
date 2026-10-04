
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
  /* Same fault as the electronics aisle: a compressor, a welder and a tool
     box were all being told about batteries. */
  killer:"Bare tool with no battery, or a battery that won't hold a charge. Worth a third.",
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
   /* Measured 24 Sep: "compound bow", 22 real sales, median $341, quartiles $125-$599. 341/0.8 is 426. The old $200 was less than half what a plain bow sells for, which is why a Mathews read as wild against it */
   {id:"h5",name:"Compound bow",value:426,liq:"slow"},
   {id:"h6",name:"Crossbow",value:250,liq:"normal"},
   {id:"h7",name:"Rod & reel combo",value:70,liq:"fast"},
   {id:"h8",name:"Trolling motor",value:250,liq:"normal"},
   {id:"h9",name:"Outboard — 9.9 to 25hp",value:900,liq:"slow"}]},
 {id:"elec",label:"Electronics",ltv:25,
  driver:"Age. Model year is nearly the whole equation — two years old is half price.",
  /* THIS LINE USED TO BE THE PHONE LINE, ON EVERYTHING IN THE AISLE.
     Reported from the counter with a PlayStation 5 on the glass: "Activation
     lock? This is a playstation not a phone." It was the category line, and
     a category line is read by a TV, a laptop, a speaker and a car amp as
     well. The aisle keeps what is true of anything with a circuit board in
     it; every item below says its own. */
  killer:"Won't power up, or it is locked to an account nobody can sign out of. Anything with a screen: look for cracks and dead pixels before you talk money.",
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
   /* $175 was below every laptop the harvest measured except one, a tired
      HP Pavilion at $132. Ten mid-tier machines came back with a median
      resale of $249 - Chromebook, Inspiron, EliteBook, Surface, Vivobook,
      Envy, Swift, Aspire, ZenBook, Pavilion - and 249/0.8 is 311. The
      gaming machines are a different row now rather than dragging this
      one up. */
   {id:"e2",name:"Laptop",value:311,liq:"normal"},
   {id:"e3",name:"Tablet",value:150,liq:"normal"},
   {id:"e4",name:"Smartphone",value:200,liq:"fast"},
   {id:"e5",name:"Game console — current gen",value:225,liq:"fast"},
   /* FOUR CONSOLE ROWS WHERE THERE WAS ONE. A PS4, an N64 and a Dreamcast
      all landed on "current gen" at $225 - three different markets and one
      number. The values below are the class typical divided by
      CATALOG_AT_GOOD, the same arithmetic as the compound bow row, off
      PriceCharting loose (completed eBay sales) cross-checked against
      Racketboy:

        last gen    PS4 $90-140, Xbox One $121, Wii U $143      -> ~$115
        2005-2012   PS3 $75-87, 360 $52-117, Wii $50-74         -> ~$75
        retro       Saturn $180, Dreamcast $162, SNES $110,
                    PS2 $105, Xbox $95, NES $94, GameCube
                    $92-115, N64 $90, Genesis $75, PS1 $60      -> ~$95
        handhelds   Game Boy $66, DSi $61-95, PSP $64, DS $39-56 -> ~$60

      Read them as ceilings: PriceCharting excludes shipping
      inconsistently, which on a heavy boxed console is real money, and it
      runs high on hardware specifically. The liquidity drops as the band
      gets older because it should - a retro machine in Bristol is a
      months-or-never item however well it does on eBay, and that is what
      the liq flag is for. */
   {id:"e5a",name:"Game console — last gen (PS4 / Xbox One)",value:144,liq:"normal"},
   {id:"e5b",name:"Game console — 2005–2012 (PS3 / 360 / Wii)",value:94,liq:"normal"},
   {id:"e5c",name:"Game console — retro, pre-2001",value:119,liq:"slow"},
   {id:"e5d",name:"Handheld — retro (Game Boy / DS / PSP)",value:75,liq:"slow"},
   {id:"e6",name:"Bluetooth / smart speaker",value:50,liq:"normal"},
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
   /* Measured 24 Sep: a generic "acoustic guitar" search returns 17 real sales, median $99, quartiles $43-$248. 99/0.8 is 124. The old $110 was close and is now exact */
   {id:"m1",name:"Acoustic guitar",value:124,liq:"slow"},
   {id:"m2",name:"Electric guitar",value:150,liq:"slow"},
   /* Measured 24 Sep: "guitar amplifier", 18 real sales, median $135, quartiles $75-$275. 135/0.8 is 169. The old $100 priced every amp at $80 resale */
   {id:"m3",name:"Amplifier",value:169,liq:"slow"},
   /* "dont have alot of instrument options" — three kinds covered the
      whole aisle: two guitars and an amp. Everything else a customer
      carries through the door fell to "Not on any list — I set the
      price", which means the desk had nothing to say about a school
      trumpet or a drum kit.

      THESE EIGHT VALUES ARE ESTIMATES AND THE CARD WILL SAY SO. m1, m2
      and m3 above carry measured medians off 17, 18 and 18 real sales;
      these do not, because no harvest has run on them. Each is a typical
      used midpoint divided by 0.8 (CATALOG_AT_GOOD), which is the same
      arithmetic the measured three use — so when a harvest does run,
      the shape is already right and only the number moves. Until then
      every one of them prices with "Estimate — nothing looked up yet"
      on the card, which is the truth.

      Band instruments are the ones to get right in a small town: the
      school rents them, families buy them, and they come back through a
      pawn counter in September and again in June. A saxophone is its own
      row because it is worth three times what a clarinet is, and lumping
      them would have priced both wrong. */
   {id:"m4",name:"Bass guitar",value:175,liq:"slow"},
   {id:"m5",name:"Keyboard / digital piano",value:138,liq:"slow"},
   {id:"m6",name:"Drum kit",value:250,liq:"slow"},
   {id:"m7",name:"Saxophone",value:375,liq:"slow"},
   {id:"m8",name:"Band instrument — school",value:112,liq:"slow"},
   {id:"m9",name:"Violin / fiddle",value:100,liq:"slow"},
   {id:"m10",name:"PA / powered speaker",value:162,liq:"normal"},
   {id:"m11",name:"Banjo / mandolin",value:188,liq:"slow"}]},
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
  /* THE CONSOLE MAKERS WERE NEVER ON THIS LIST. Twenty-eight console rows
     went on the book and not one of their makers did, so "sega saturn"
     read the word Sega off the search box, failed to place it, and the run
     asked "What make is it?" with three phone tiers underneath. Mid, not
     hi: mid is the 1.0 multiplier, so adding them cannot inflate anything
     that has no measured row of its own - and where there IS a measured
     row the tier is out of the arithmetic entirely (see below). Nintendo
     and Sony are already in hi and stay there; moving them would reprice
     every PlayStation and Switch in the book for the sake of tidiness. */
 mid:["Microsoft","Xbox","Dell","HP","Lenovo","LG","Google","Pixel","Motorola","OnePlus","JBL","Beats","Klipsch","Kicker","Rockford Fosgate","Alpine","Pioneer","Acer","Asus","MSI","Vizio","TCL","Sega","Atari","SNK","Neo Geo","NEC","TurboGrafx","Coleco","ColecoVision","Mattel","Intellivision","Panasonic","Sharp","Toshiba","Philips","JVC"],
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
 * "kit" would find Kitchenaid.
 *
 * It used to be only the word scan below, and that could not see a make
 * whose name is two words - it asked for ONE word equal to a whole book
 * entry. Eighty-two of the makes on the books are two words, so Sig Sauer,
 * Smith & Wesson, John Deere, Harbor Freight, Black & Decker, Speed Queen,
 * Michael Kors and seventy others read as no make at all, and the card said
 * "nothing picked yet" with the name sitting in front of it.
 *
 * Five read as the WRONG make, which costs money rather than silence: the
 * scan stopped at the first word it knew, so a Fender Squier priced as a
 * Fender (+40%), a Bosch 300 as a Bosch (+40%), a Frigidaire Gallery as a
 * Frigidaire (-45%), and a Grand Seiko and an ASUS ROG both lost their
 * premium (-29%). brandInText matches whole names and the longest one wins,
 * which is what settles every one of those - the same guard brandLookup
 * already had, which is why "seiko" does not answer Grand Seiko.
 *
 * The word scan stays as the fallback: brandInText skips anything under
 * four characters, so S&W, PSA, IWI, JBL, TCL, RCA, IWC, PRS and seventeen
 * others are only findable that way. Strongest reader first, and it only
 * falls through when that one found nothing. */
/* NOBODY SAYS "SONY" WHEN THEY MEAN A PLAYSTATION.
   The brand book holds MAKERS, and the counter types what is written on
   the thing: PlayStation 4, iPhone 13, MacBook Air, Galaxy Watch 6, Switch
   OLED. None of those carries its maker's name, so brandFromName returned
   nothing for every one of them and the desk priced the most common items
   in the shop at the neutral middle tier. Hi against mid is 40% - an
   iPhone was being read as a no-name handset.
   A product line resolves to its maker, and the maker is then looked up in
   the book as usual, so the tier still comes from one place and the screen
   still shows the make somebody would recognise. Longest match first, so
   "apple watch" beats "watch" and "galaxy buds" beats "galaxy". */
const BRAND_LINE={
  elec:[["playstation","Sony"],["ps5","Sony"],["ps4","Sony"],["ps3","Sony"],
        ["psvr","Sony"],["bravia","Sony"],["walkman","Sony"],
        ["iphone","Apple"],["ipad","Apple"],["macbook","Apple"],["imac","Apple"],
        ["airpods","Apple"],["apple watch","Apple"],["airtag","Apple"],["ipod","Apple"],
        ["mac mini","Apple"],["mac studio","Apple"],
        ["galaxy","Samsung"],["odyssey","Samsung"],["frame tv","Samsung"],
        ["switch","Nintendo"],["wii","Nintendo"],["3ds","Nintendo"],["game boy","Nintendo"],
        ["surface","Microsoft"],["thinkpad","Lenovo"],["ideapad","Lenovo"],
        ["inspiron","Dell"],["latitude","Dell"],["optiplex","Dell"],["xps","Dell"],
        ["chromecast","Google"],["nest","Google"],
        ["soundlink","Bose"],["quietcomfort","Bose"],["soundtouch","Bose"],
        ["beats","Beats"],["roku","Roku"]]
};
function aliasBrand(catId,txt){
  const list=BRAND_LINE[catId]; if(!list)return null;
  const t=" "+String(txt||"").toLowerCase().replace(/[^a-z0-9]+/g," ")+" ";
  let best=null;
  for(const [word,maker] of list){
    if(t.indexOf(" "+word+" ")>=0||t.indexOf(" "+word)>=0){
      if(!best||word.length>best[0].length)best=[word,maker];
    }
  }
  return best?brandLookup(catId,best[1]):null;
}
function brandFromName(catId,txt){
  const whole=brandInText(catId,txt);
  if(whole)return whole;
  /* Before giving up on the words, try what the thing is actually called. */
  const al=aliasBrand(catId,txt);
  if(al)return al;
  /* Two characters is safe HERE because this scan only accepts a word that
     equals a whole book entry - it is the containment matching that needs a
     floor, and there is none in this loop. */
  const words=String(txt||"").split(/[^A-Za-z0-9&+.-]+/).filter(w=>w.length>=2);
  for(const w of words){
    const hit=brandLookup(catId,w);
    if(hit&&hit.name.toLowerCase()===w.toLowerCase())return hit;
  }
  return null;
}
/* The override belongs to the item on the counter, so it may only answer
   for that item's OWN category. It was applied whatever catId was asked
   about, so after pricing a Harbor Freight generator the generator's brand
   list answered for tools too - DeWalt was not in it, "DeWalt 20V drill
   kit" read as carrying no maker, and a Black & Decker drill was handed
   the DeWalt row at +40%. Which book answered depended on what had been
   looked at last, which is why the same search gave two answers. */
/* A TIER LIST IS ALREADY A LIST OF MAKES, SO IT DOES NOT NEED TYPING TWICE.
   The row's three tiers are display strings - "Weber / Big Green Egg /
   Kamado Joe" - and brandLookup wants names. Writing both for 68 rows
   would be the same content in two places, which in this repo means one
   of them drifts. So the names are read off the tiers, with the phrases
   that are not makes thrown out: "no name", "house ball", "particle
   board", "solid wood, named maker".

   Trailing qualifiers go too, because "RTIC higher" and "Yamaha student"
   are a tier's note about a make, not the make. That is what puts a plain
   Yamaha trumpet in the student tier and a Yamaha Xeno in the top one:
   brandLookup prefers an exact name over a containing one, so "Yamaha"
   hits mid exactly while "Yamaha Xeno" is only reachable by containment.
   A typed "Coleman" lands on mid's "Coleman Xtreme" the same way. */
const NOT_A_MAKE=/^(no name|house ball|student outfit|particle board|soft-top|home-built|big-box|named |solid wood|riveted|welded|premium maker|standard maker|budget|off brand|fashion|mid grade|common|bulk|reprint|raw)/i;
function tierBrands(t){
  const out={hi:[],mid:[],lo:[]};
  for(const k of ["hi","mid","lo"]){
    String((t&&t[k])||"").split("/").forEach(raw=>{
      const x=String(raw).trim();
      if(!x||NOT_A_MAKE.test(x))return;
      out[k].push(x.replace(/\s+(higher|basic|pro|student|class)$/i,"").trim());
    });
  }
  return out;
}
/* Every make word named in a tier table, flattened once. Used only to
   decide whether a word in the search counts against an item match - see
   the `need` filter in omniRows. Two letters is the floor because a
   one-letter token matches everything. */
/* BUILT ON FIRST USE, NOT AT LOAD. My first version ran here at load
   time, which is 2,700 lines above where BOOK_OV is declared - so it threw
   on the temporal dead zone, my own try/catch swallowed it, and the set
   was silently empty. Nothing broke, nothing logged, and the ranking it
   was written to fix went on being wrong. The measurement is the only
   reason I know: size 0, hasVitamix false. A catch around a build step is
   the same bug as an assertion that cannot fail. */
let _makeWords=null;
function knownMakeWord(w){
  if(!_makeWords){
    _makeWords=new Set();
    const eat=t=>{ const d=tierBrands(t);
      for(const k of ["hi","mid","lo"]) d[k].forEach(nm=>
        String(nm).toLowerCase().split(/[^a-z0-9&+.-]+/).forEach(x=>{
          if(x.length>=2)_makeWords.add(x); })); };
    const tbl=[typeof BOOK_OV!=="undefined"?BOOK_OV:null,
               typeof ITEM_OVERRIDES!=="undefined"?ITEM_OVERRIDES:null];
    tbl.forEach(T=>{ if(!T)return;
      Object.keys(T).forEach(k=>{ if(T[k]&&T[k].tiers)eat(T[k].tiers); }); });
  }
  return _makeWords.has(w);
}
/* MERGED INTO THE AISLE'S BOOK, NEVER REPLACING IT. Replacing would make
   every make the row does not list unfindable - a Whirlpool typed on the
   grill row would read as no maker at all - and these overrides exist to
   add an answer, not to remove the ones that already worked. */
/* THE SEARCH MUST NOT READ THE ITEM ON THE COUNTER.
   check-reach caught this: two Jabra earbud rows stopped being reachable,
   landing on "Something else" and "ATV / four wheeler". The sweep walks
   all 500 measured rows in one session and PICKS each one, so st.bookName
   is whatever was priced last - and ovBrands was handing that row's brand
   book to the parser reading the NEXT query. The tent row's book answered
   for a hunting search, and what the search found depended on what had
   been looked at before it, which is the same bug the comment above this
   one describes from the other direction.

   It was already true of ITEM_OVERRIDES, on 17 items. BOOK_OV made it 131
   rows, which is why it surfaced now rather than being found at the
   counter later.

   An override belongs to the thing in his hands. While a query is being
   parsed there is nothing in his hands yet, so the aisle's own book
   answers and the override stays out of it. knownMakeWord is the stateless
   half the search does need, and it reads the tables directly. */
let _omniDepth=0;
function ovBrands(catId){
  if(_omniDepth)return null;
  if(catId!==st.catId)return null;
  const ov=itemOv();
  if(!ov)return null;
  if(ov.brands)return ov.brands;
  if(!ov.tiers)return null;
  const d=tierBrands(ov.tiers), book=BRANDBOOK[catId];
  if(!book)return d;
  return {hi:d.hi.concat(book.hi||[]), mid:d.mid.concat(book.mid||[]), lo:d.lo.concat(book.lo||[])};
}
function brandLookup(catId,txt){
  const book=ovBrands(catId)||BRANDBOOK[catId]; if(!book)return null;
  const t=String(txt).trim().toLowerCase(); if(!t)return null;
  /* Three characters was the floor for EVERY kind of match, so the makes
     with two-letter names could not be looked up at all: LG, GE, HK, FN,
     CZ, DC are all on the books and none of them was reachable. An LG OLED
     read as no maker and priced as standard, which on a set the book puts
     in the top tier is 29% of it. The floor is there to stop a short
     fragment matching by CONTAINMENT - "lg" inside something else - so it
     belongs on that loop only. An exact name is never a fragment. */
  for(const tier of["hi","mid","lo"]) for(const b of book[tier])
    if(b.toLowerCase()===t)return {tier,name:b};
  if(t.length<3)return null;
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
  const book=ovBrands(catId)||BRANDBOOK[catId]; if(!book)return null;
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
 /* Two kinds that walk in constantly and had nowhere to land: over-ear
    headphones (the book had earbuds and nothing else) and a loose
    controller. Both figures are STARTING POINTS nobody has checked - the
    same state as 166 of the rows above - and the desk can no longer quote
    a book figure as a price, so neither is an answer until the sold page
    or the counter says otherwise. The harvest is what makes them real. */
 ["Headphones — over-ear",50,"elec","fast"],["Game controller",30,"elec","fast"],
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
 /* A DJI Osmo is not a drone and has nowhere else to land. Priced off the
    five real sold listings the search returned on 23 Sep - a Pocket 3 at
    $300, $316 and $282, an RS 4 Mini at $230, a faulty Pocket 3 at $181 -
    taken a markdown step down, the way every shelf figure here is. */
 ["Gimbal / pocket camera",250,"elec","normal"],
 /* SPLITS THE HARVEST ASKED FOR. Each of these was one row covering a
    spread no single number could hold, and the sanity band kept refusing
    perfectly good measurements because the row underneath them was wrong.

    Gaming laptop: six measured, median resale $732, but Alienware is the
    only hi-tier make among them and the x1.4 lands on top - so the base
    is the mid-tier median, $675, over 0.8. Against a $175 "Laptop" row an
    HP Omen at $950 read as 5.4x and was held back; against this it is
    within the band and merges.

    Sports title: five measured - Madden 25 at $4, NBA 2K24 $7, College
    Football 25 $10, FC 24 $11, FC 25 $13 - and they crater on a schedule,
    every year, which is the most predictable thing in the whole book.

    Nintendo title: only TWO measured, Mario Kart 8 at $28 and Pokemon
    Scarlet at $52, so treat this one as a placeholder with a direction
    rather than a price. Nintendo first-party holds where everything else
    falls; how much it holds is not yet known. */
 ["Gaming laptop",844,"elec","normal"],
 ["Video game — sports title",13,"elec","fast"],
 ["Video game — Nintendo title",50,"elec","fast"],
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
  if(!hit)return `<span style="color:var(--warn)">Not in the book — pick the tier yourself.</span>`;
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

/* WHAT HE PAYS TO GET IT BACK IS A PRICE. IT WAS WRITTEN AS A STATUTE.

   The charge was hardcoded `Math.max(5, target*0.25)` - 25% per 30 days,
   which is the CEILING §539.001(11) sets, not a rate anybody at this shop
   chose. So the desk quoted the legal maximum on every single ticket and
   printed it in the largest type on the rail: $105 out the door came back
   as $131 by day 30, $158 by day 60. Reading that off a screen to the man
   standing there is how you watch him leave.

   A ceiling belongs at the top of a control, not inside the arithmetic. The
   rate is shop policy now - one number, set once, kept like buyFloor and
   buyMult - and 25% is where the slider stops, with the statute quoted
   underneath so nobody has to remember where the line is.

   26 Sep: asked for, and set to, 25% - the ceiling. That is Lamar's call
   and it is legal; what changed here is that it is now a NUMBER SOMEBODY
   CHOSE rather than a constant nobody could see or move, which was the
   whole complaint. Everything still follows the setting, so dropping it
   to 20 is one drag of a slider.

   The $5 floor stays: the same subsection allows it outright, and on a $40
   loan the percentage alone does not cover writing the ticket. */
const PAWN_CAP=25;
function pawnPct(){ const n=Number(st.pawnPct); return Math.min(PAWN_CAP,Math.max(0,isNaN(n)?0:n)); }
/* ROUNDING MUST NEVER PUSH THE CHARGE OVER THE CEILING.
   The arithmetic here was already under 25% to the cent - but every place
   that SHOWS it runs through money(), which rounds to the nearest dollar,
   and rounding up is how a legal charge becomes an illegal one. A $510 loan
   is $127.50 at 25%; the fee tile printed $128, which is 25.098%, and $128
   is the figure that gets written on the ticket. Swept whole-dollar loans
   from $20 to $3,000: 1,490 of them - half - displayed a fee over the cap,
   and the same rounding pushed "total to clear" over on all 1,490.

   So the charge is floored to whole dollars at the source. The number shown
   is then the number charged, and no display anywhere downstream can round
   it up again - which a fix at each print site could not promise, because
   there are nine of them and missing one is a breach.

   It costs under a dollar a ticket. Overcharging voids the transaction and
   forfeits twice the charge, so that is not a close call.

   The $5 minimum stands: the same subsection allows it outright, and it is
   the one case where the charge is above 25% of a small loan on purpose. */
function pawnCharge(p){ return Math.max(5,Math.floor((Number(p)||0)*pawnPct()/100)); }

/* ---------------- state ---------------- */
const KEY="pawndesk:web:v1";
/* The shop's floor, shipped. One name, so the default and the fallback at
   bookSimple() cannot drift apart - they already had, at 25 in two places. */
const BUY_FLOOR_DEF=10;
let st={mode:"item",catId:"guns",itemId:"g1",picked:false,needItem:false,askFrom:null,cond:"good",brand:"mid",complete:true,completeSet:false,struck:"",struckKind:"loan",liq:null,brandTyped:"",model:"",detail:"",specSel:{},
        overrides:{},bookVals:{},modelVals:{},ltvs:{},buys:{},buyFloor:BUY_FLOOR_DEF,floorSet:false,buyMult:2,itemTab:"item",pawnPct:25,pawnSet:false,spotHold:null,meltTgt:null,payPct:70,payTouched:false,loanPct:48,loanTouched:false,editing:false,
        manual:null, /* {date, spot:{gold,silver}, avg90:{gold,silver}} — a same-day hand edit beats the feed */
        deal:"buy",metal:"gold",karat:"14k",grams:"",whyOpen:false,photoRead:null,bookQ:"",bookName:"",
        /* The shop's own reference weights, by sheet. See REF_SHEETS. */
        refs:{}};
try{
  const s=JSON.parse(localStorage.getItem(KEY)||"null");
  if(s){ st.overrides=s.overrides||{}; st.ltvs=s.ltvs||{}; st.buys=s.buys||{};
    st.bookVals=s.bookVals||{}; st.modelVals=s.modelVals||{};
    /* THE SAME TRAP THE PAWN RATE ALREADY FELL INTO, AND THE SAME FLAG.
       "lets adjust the minimum required for me to do that deal down from
       $25 to 10." The shipped floor moved 25 -> 10, and on its own that
       would have reached nobody: persist() writes buyFloor on every save,
       so every device in the shop was already sitting on a STORED 25 that
       outranked the code. The counter would have asked for a change,
       watched it ship, and seen no change at all.
       So a stored floor only outranks the shipped one once somebody has
       actually moved the control, which floorSet records. A device that
       never touched it follows the shop's number, the way the pawn rate
       does four lines down. */
    st.floorSet=!!s.floorSet;
    if(s.itemTab)st.itemTab=String(s.itemTab);
    if(s.floorSet && s.buyFloor!=null)st.buyFloor=Math.max(0,Number(s.buyFloor)||0);
    if(s.buyMult!=null)st.buyMult=Math.max(1,Number(s.buyMult)||1);
    /* Shop policy, not a daily figure - it does not expire with the feed.
       But a stored number only outranks the code's default once somebody
       has actually MOVED the control. Without that flag, every device that
       had quietly saved the old default would have gone on using it, and
       changing the shipped rate would have reached only brand-new devices
       - the tablet and the phone quoting different repayments on the same
       loan, with nothing on either screen to say why. */
    st.pawnSet=!!s.pawnSet;
    if(s.pawnSet && s.pawnPct!=null)
      st.pawnPct=Math.min(PAWN_CAP,Math.max(0,Number(s.pawnPct)||0));
         /* A hand-set pay rate wins only for the day it was set — tomorrow's
            feed brings new numbers, so the rate goes back to following them. */
         if(s.payDate===FEED.date && typeof s.payPct==="number"){ st.payPct=s.payPct; st.payTouched=!!s.payTouched; }
         if(s.payDate===FEED.date && typeof s.loanPct==="number"){ st.loanPct=s.loanPct; st.loanTouched=!!s.loanTouched; }
         if(s.manual && s.manual.date===FEED.date) st.manual=s.manual;
         /* The target is shop policy, not a same-day edit, so unlike the
            rate it survives tomorrow's feed. */
         if(s.meltTgt && typeof s.meltTgt==="object") st.meltTgt=s.meltTgt;
         if(s.refs && typeof s.refs==="object") st.refs=s.refs; }
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
      buyFloor:st.buyFloor,floorSet:st.floorSet,itemTab:st.itemTab,buyMult:st.buyMult,pawnPct:st.pawnPct,pawnSet:st.pawnSet,payPct:st.payPct,flow:st.flow,
      payTouched:st.payTouched,loanPct:st.loanPct,loanTouched:st.loanTouched,payDate:FEED.date,manual:st.manual,meltTgt:st.meltTgt,
      /* The counter's own reference weights - see REF_SHEETS. These are
         measurements off the shop's own known-good stock, so they are the
         shop's data and they have to survive a reload like the rates do. */
      refs:st.refs}));
    flashSave("Saved");
  }catch(e){ flashSave("Couldn't save"); }
}
function flashSave(msg){
  const el=document.getElementById("saveNote"); if(!el)return;
  el.textContent=msg; clearTimeout(saveTimer); saveTimer=setTimeout(()=>{el.textContent="";},1600);
}
/* THE PRICE FREEZES ONCE IT IS QUOTED.
   "freeze the price once it's quoted." Asked for as soon as the refetch
   went from once-a-boot to every fifteen minutes, and he is right that the
   two go together: a number that refreshes while somebody is deciding is
   worse than one that is slightly old. You say $559, he thinks about it,
   the timer fires, and the screen now says $551 with a customer looking at
   it.

   So the moment there is a real figure on the glass - a weight entered -
   the spot behind it is held, and every figure on that ticket is worked
   out from the held number until the deal is done or it is deliberately
   re-quoted. The live price keeps running and is shown beside it when it
   has drifted, so the counter can see the market moved and choose.

   THE SPLIT INSIDE THE GUARD IS THE SUBTLE PART, and it already falls the
   right way. metalState reads two different things:

     the BAND (calm/normal/busy/violent) comes from 21 days of returns over
     the logged SERIES, which spotLogWrite keeps filling with whatever
     arrives. Freezing a quote does not freeze that, so the regime read
     stays current.
     the LEVEL (premium over the 90-day, drawdown off the peak) comes from
     spotOf, which IS the held number while a quote stands.

   That is what it has to be. If the level went on using the live price the
   guard would keep moving lendOz underneath a frozen melt, and the figure
   on the glass would drift anyway through the back door - a freeze that
   only looks like one. And if the freeze reached the series, a quote left
   open over lunch would stop the guard learning the day. */
function spotHeld(m){ return (st.spotHold&&st.spotHold[m]>0)?st.spotHold[m]:0; }
function holdSpot(){
  if(st.manual)return;                       /* a typed number is already fixed */
  if(!st.spotHold)st.spotHold={};
  if(st.spotHold[st.metal]>0)return;         /* first figure wins, not the latest */
  const v=FEED[st.metal];
  if(v>0){ st.spotHold[st.metal]=v; st.spotHold.at=FEED.at||null;
           st.spotHold.struck=Date.now(); }
}
function releaseSpot(){ st.spotHold=null; }
/* What the market says NOW, whatever is being quoted off. The guard and the
   drift line read this; the offer does not. */
function spotLive(m){ return st.manual ? st.manual.spot[m] : FEED[m]; }
/* A HAND-TYPED NUMBER OUTRANKS A HELD ONE. This read spotHeld() first and
   a test caught it: strike a quote, then type today's spot over it, and
   the typed number was ignored in favour of the hold. The counter typing a
   figure IS the most deliberate act on this page - "your number wins for
   the day" is what the card promises - and a freeze that overrides it is a
   freeze that stopped serving the person it was built for. */
function spotOf(m){ return st.manual ? spotLive(m) : (spotHeld(m)||spotLive(m)); }
function avgOf(m){ return st.manual ? st.manual.avg90[m] : FEED[m+"90"]; }
function makeManual(){ if(!st.manual) st.manual={date:FEED.date,spot:{gold:FEED.gold,silver:FEED.silver},avg90:{gold:FEED.gold90,silver:FEED.silver90}}; }

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
/* The worked examples, in one place. They were prose under the search box
   naming four things you could type - which is a list of instructions for
   retyping something by hand. They are buttons now, and the hint line and
   the buttons cannot drift apart because they read the same array. */
const START_TRY=["stihl 271","remington 870 12 gauge","dewalt dcd791","iphone 15",
                 "kayak","14k ring","generac 7500","yamaha p-125"];

/* fill the recessed track up to the knob */
function paintSlider(el){
  if(!el)return;
  const p=(el.value-el.min)/(el.max-el.min)*100;
  el.style.background=`linear-gradient(90deg,var(--accent-2) 0%,var(--accent) ${p}%,var(--well) ${p}%)`;
}

/* the anchor gauge: 270° sweep, recessed track, emissive gradient arc.
   Quiet mode: the tick ring is static — no rotation. */
function gauge(pct,label,big,small,id){
  const T=613,C=817,v=(Math.max(0,Math.min(1,pct))*T).toFixed(0);
  return `<div class="gwrap"><svg viewBox="0 0 340 340" role="img" aria-label="${label} ${big}">
   <defs>
    <linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--accent-2)"/><stop offset="100%" stop-color="var(--accent)"/>
    </linearGradient>
   </defs>
   <circle cx="170" cy="170" r="163" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1" stroke-dasharray="1.5 13"/>
   <circle cx="170" cy="170" r="130" fill="none" stroke="rgba(0,0,0,.65)" stroke-width="24" stroke-linecap="round" stroke-dasharray="613 817" transform="rotate(135 170 170)"/>
   ${+v>0?`<circle cx="170" cy="170" r="130" fill="none" stroke="url(#${id})" stroke-width="22" stroke-linecap="round" stroke-dasharray="${v} 817" transform="rotate(135 170 170)"/>`:""}
  </svg>
  <div class="gcenter"><span class="gl">${label}</span><b>${big}</b><span class="gs">${small}</span></div></div>`;
}

/* ══ THE HOME CARD ════════════════════════════════════════════════════
   One component, both machines. The phone had this first and the desk
   was still showing a search box over an empty screen; writing it twice
   is how the two drift into two apps, which is the thing design A was
   picked to stop.

   It is the item screen's own shape doing the day's job: a hero with
   the one number that matters before anything is on the counter, the
   ways to start as circular actions, and a feed of what has actually
   been priced today. The feed reads the deal log - it is not decoration,
   it is the thing you reach for when a customer comes back. */
const HOME_ICON={
  cam :'<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.4" r="3.4"/><path d="M8 7l1.6-3h4.8L16 7"/>',
  look:'<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
  gold:'<circle cx="12" cy="12" r="8"/><path d="M12 7.6v8.8M9.8 10h4a1.9 1.9 0 010 3.8h-3.6a1.9 1.9 0 000 3.8h4"/>',
  log :'<path d="M5 4h11l3 3v13H5z"/><path d="M9 9h6M9 13h6"/>',
  tag :'<path d="M3 11.5V4.5A1.5 1.5 0 014.5 3h7L21 12.5 12.5 21 3 11.5Z"/><circle cx="7.6" cy="7.6" r="1.2"/>',
  pics:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 16l4.5-4.5 3.5 3.5 3-3L21 16"/><circle cx="8.4" cy="9.2" r="1.4"/>'
};
function homeToday(){
  const day=(typeof todayStr==="function")?todayStr():"";
  const rows=(typeof DEALS!=="undefined"&&DEALS.length)
    ? DEALS.filter(d=>!day||d.day===day) : [];
  return {day,rows,out:rows.reduce((a,d)=>a+(Number(d.loan)||0),0)};
}
/* THE FOUR QUICK ACTIONS WERE FOUR DUPLICATES. Jace circled Gold and the
   navigation rail together: same button, twice, a few inches apart. It was
   worse than the one he caught - on the desk every one of the four repeated
   something already on the same screen. Type it focused the search box that
   is the largest thing on the page. Gold and Log went where the rail goes.
   Photo opened the camera that has its own card directly underneath.
   So the desk drops the row outright (acts:false) and the phone keeps one
   button. Not symmetry for its own sake: #photoCam is a hidden input, and on
   the phone that button is its ONLY visible trigger - take it away and the
   field screen has no camera. The desk has the card instead. */
function homeHeroHTML(opts){
  const o=opts||{}, t=homeToday();
  const gold=(typeof spotOf==="function")?spotOf("gold"):0;
  const silver=(typeof spotOf==="function")?spotOf("silver"):0;
  const act=(id,l,ic,on)=>`<button class="act" data-whome="${id}"${on?"":" disabled"}>`
    +`<i><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></i><span>${l}</span></button>`;
  const camOn=!!(CAP.sample&&CAP.images);
  return `<div class="hero homeHero">
    ${/* "The time should be up next to the date." It was down beside
          "GOLD, PER TROY OUNCE", which put it next to the label rather
          than next to the day it belongs to.
          BOTH HALVES COME OFF THE FEED'S OWN STAMP, not the device clock
          and not the app's idea of today. A date from one source next to a
          time from another is the kind of pair that reads as one fact and
          is not: if the price last arrived yesterday evening, this says
          "Sep 29 · 8:30pm" rather than pinning yesterday's time to today's
          date. When the feed has not answered at all there is no time to
          show, so it falls back to the plain day. */""}
    <div class="heroWho">${(()=>{
      const t0=FEED.at?Date.parse(FEED.at):0;
      if(!t0)return esc(fmtDay(t.day)||"Today");
      const d=new Date(t0), z=n=>String(n).padStart(2,"0");
      const ds=d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
      /* THE DAY AND THE TIME ARE TWO FACTS, NOT ONE STRING. Joined by a
         bare middot with a single space either side they ran together
         into "Oct 1 · 12:30am" and read as one lump - and the first
         thing anybody asks of this line is which day, then how old. So
         the separator gets real air and dims, and the time steps back a
         weight: same line, two things on it. */
      return `<span class="whoDay">${esc(fmtDay(ds))}</span>`
        +`<span class="whoDot">\u00b7</span>`
        +`<span class="whoAt">${esc(feedClock())}</span>`;
    })()}</div>
    ${/* THE HOME HERO HAS NO SUBJECT LINE. It used to say "Nothing on the
          counter" where an item hero names the item - a whole line of
          blue spent telling the counter the thing it can already see,
          which is that nothing has been started yet. Jace: "we dont need
          the blue box on home screen to say 'nothing on the counter'."
          The class stays - phone.js uses .heroWhat for the real item
          heroes, where the line names something. */""}
    ${/* TWO METALS, ONE SIZE, A RULE BETWEEN THEM. Gold was a 62px
          numeral with its own label and silver was four words inside the
          grey line underneath, next to the day's log - so the card read
          as "the gold price, plus some notes", and one of those notes was
          the rate the till pays. "lets make the gold and silver prices
          the same size with a seperator. then have our buy percent
          clearly labeled."
          THE PERCENT NOW SITS UNDER THE METAL IT BELONGS TO, which is the
          point rather than a layout nicety: gold targets 80% of melt and
          silver 70%, and a single "buying 80% of melt" line under two
          prices is exactly the mistake he was guarding against when he
          asked for it on the card at all - "We don't need a mistake by
          not realizing that our buy rate or percentage is set to the
          wrong thing on a hidden window." Two prices, two rates, each
          named.
          Both come off meltPctNow, which divides the guarded buy by melt.
          It is what the till will actually hand over, not the target it
          aims at - a target printed here would be the card lying by six
          points again. No price means no rate to state, so it says so
          instead of falling back to the target. */""}
    <div class="heroMet">${(()=>{
      const cell=(metal,lab,v,dp)=>{
        const g=(typeof meltPctNow==="function")?meltPctNow(metal,"buy"):null;
        return `<div class="metCell"><div class="heroLab">${lab}</div>`
          +`<div class="metBig">${v?(dp?"$"+v.toFixed(2):money(Math.round(v))):"\u2014"}${v?trendIconHTML(metal):""}</div>`
          +(v&&g?`<div class="metBuy">Buying <b>${g}%</b> of melt</div>`
                :`<div class="metBuy metBuyOff">Buy rate needs a price</div>`)
          +`</div>`;
      };
      return cell("gold","Gold / troy oz",gold,false)
        +`<i class="metSep" aria-hidden="true"></i>`
        +cell("silver","Silver / troy oz",silver,true);
    })()}</div>
    ${/* TWO BUTTONS, BECAUSE ONE CANNOT DO BOTH RELIABLY.
          First it was capture="environment", which told the phone "camera
          only" and hid the gallery: "Need to be able to submit previously
          taken pictures." Taking it off was supposed to produce the OS
          sheet - Camera, Gallery, Files - and on his phone it did not:
          "now when I hit the sap it button, I only get the gallery and no
          option for the camera." Android's newer photo picker takes
          accept="image/*" with no capture straight to the gallery and
          never offers the lens.
          So the choice stops depending on which picker the phone feels
          like showing. Camera is a button, Gallery is a button, each wired
          to its own input with its own attributes, and what happens is
          what the label says on both. */""}
    ${o.acts===false?"":`<div class="acts${camOn?"":" one"}">
      ${act("snap",o.snapLabel||"Camera",HOME_ICON.cam,camOn)}
      ${camOn?act("pick","Gallery",HOME_ICON.pics,true):""}
    </div>`}</div>`;
}
/* THE DAY'S TALLY IS NOT A METAL FACT, so it stopped living in the hero.
   "on that section what does 'nothing logged yet today' mean?" - a fair
   question, because the line sat directly under two spot prices and their
   buy rates and read as though it were about them. It never was: it counts
   rows in the deal log stamped today and totals what went out on them.
   Out of the blue box, onto its own row, where it is the header for the
   feed of those same rows rather than a footnote to the price of gold.
   It is ALWAYS rendered, in both states - the feed disappears when nothing
   has been priced, and a tally that disappeared with it would leave the
   question "has anything happened today" answered only by absence. */
function homeDayHTML(){
  const t=homeToday();
  return `<div class="dayRow"><span>Priced today</span>`
    +(t.rows.length
      ? `<b>${t.rows.length} deal${t.rows.length===1?"":"s"} \u00b7 ${money(t.out)} out</b>`
      : `<b class="dayNone">Nothing yet</b>`)
    +`</div>`;
}
function homeFeedHTML(limit){
  const t=homeToday(), rows=t.rows.slice(0,limit||4);
  if(!rows.length)return "";
  /* The "Priced today" wSect header went with it: homeDayHTML sits
     immediately above this on both surfaces and says the same thing with
     the money on it, so keeping both was one label printed twice. */
  return rows.map(d=>
    `<div class="wRow"><i><svg viewBox="0 0 24 24" aria-hidden="true">${HOME_ICON.tag}</svg></i>
      <div class="t"><b>${esc([d.brand,d.model,d.itemName].filter(Boolean).join(" "))||"Item"}</b>
        <span>${esc(d.catLabel||"")}${d.ticket?" \u00b7 #"+esc(d.ticket):""}</span></div>
      <div class="v">${money(d.loan||0)}<small>${d.status==="sold"?"sold":"lent"}</small></div></div>`).join("");
}

/* ---------------- tabs ---------------- */
const PRICE_TABS=[["item","Price an item"],["metal","Gold & silver"]];
/* WALK AWAY WAS A TAB NOBODY OPENED.
   Reported from the counter: "I don't need the separate walk away section."
   Fair - it is a page of law and a list of things we do not take, read once
   and then never again, holding a sixth of a navigation column all day. But
   none of it is disposable: the sheriff's reporting deadline and the hold
   order clock live on it, and losing those would be losing the one thing on
   the page with a penalty attached. So it folds into Setup, which is where
   the things you read once already live. */
const REF_TABS=[["log","Deal log"],["device","Phones & devices"],["setup","Setup"]];
/* A dock label is one or two words under a drawing, because a column 96px
   wide is what is left once the working area has what it needs. Line art
   at one weight: a tag, a coin, a ledger, a phone, a hand, a dial. */
const TAB_SHORT={item:"Price",metal:"Gold",log:"Deal log",device:"Devices",setup:"Setup"};
const TAB_ICON={
  item:'<path d="M3 11.5V4.5A1.5 1.5 0 0 1 4.5 3h7L21 12.5 12.5 21 3 11.5Z"/><circle cx="7.6" cy="7.6" r="1.3"/>',
  metal:'<circle cx="12" cy="12" r="8.2"/><path d="M12 7.4v9.2M9.6 9.6h4a1.9 1.9 0 0 1 0 3.8h-3.6a1.9 1.9 0 0 0 0 3.8h4"/>',
  log:'<path d="M5 3.8h11a2 2 0 0 1 2 2v14.4H7a2 2 0 0 1-2-2V3.8Z"/><path d="M8.6 8.2h6M8.6 12h6M8.6 15.8h3.4"/>',
  device:'<rect x="6.4" y="2.6" width="11.2" height="18.8" rx="2.4"/><path d="M10.6 18.4h2.8"/>',
  flags:'<path d="M5.6 20.4V4.2M5.6 5.2h10.8l-1.9 3.6 1.9 3.6H5.6"/>',
  setup:'<circle cx="12" cy="12" r="3.1"/><path d="M12 2.6v3M12 18.4v3M21.4 12h-3M5.6 12h-3M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1M18.6 18.6l-2.1-2.1M7.5 7.5 5.4 5.4"/>'};
function renderTabs(){
  /* Six destinations were a row of pills along the top bar - laid out on
     the one edge the eye leaves last, over the top of the thing being
     worked on, and taking the width the title needed. Down the left they
     read as places. Same buttons, same data-tab, same handler; the
     current one is LIT rather than filled, because a solid pill sitting
     in a navigation column all day reads as a button mid-press. */
  const tabs=PRICE_TABS.concat(REF_TABS.filter(t=>t[0]!=="log"||CAP.db));
  document.getElementById("tabs").innerHTML = tabs.map(([id,full])=>
    `<button class="${st.mode===id?"on":""}" data-tab="${id}" aria-label="${full}"`+
    `${st.mode===id?' aria-current="page"':""} title="${full}">`+
    `<svg viewBox="0 0 24 24" aria-hidden="true">${TAB_ICON[id]||""}</svg>`+
    `<i>${TAB_SHORT[id]||full}</i></button>`).join("");
}
document.getElementById("view").addEventListener("click",e=>{
  if(e.target.closest("#whyBtn")){ st.whyOpen=!st.whyOpen; render(); }
  /* The tab strip's own handler sits on #tabs, so a button inside the view
     that wants to send you to a tab needs saying so here. */
  const go=e.target.closest&&e.target.closest("[data-gotab]");
  if(go){ st.mode=go.dataset.gotab; st.editing=false; render(); }
  /* Setup draws itself with no wiring pass of its own, so the one fold on it
     that is worth remembering is remembered from here. */
  if(e.target.closest&&e.target.closest("#rulesFold>summary"))
    setTimeout(()=>{ const d=document.getElementById("rulesFold"); if(d)st.openRules=d.open; },0);
});
document.getElementById("tabs").addEventListener("click",e=>{
  const b=e.target.closest("[data-tab]"); if(!b)return;
  /* TAPPING THE TAB YOU ARE ALREADY ON GOES BACK TO THE TOP OF IT.
     "how do i back out back to the beginning?" - asked with a run in
     progress, and the honest answer was that the only ways out were a
     button in a rail that card does not draw and a second one named
     something else. Meanwhile the one thing always on screen, the Price
     tab he was already looking at, did nothing at all when tapped: the
     handler set st.mode to the mode it was already in and re-rendered the
     same screen.
     Every phone app in his pocket returns to the root of a section when
     you tap its current tab. It costs nothing, it is always reachable, and
     it needs no explaining. Only when something is actually in progress -
     otherwise it is still the no-op it always was. */
  if(b.dataset.tab===st.mode&&st.mode==="item"&&(st.picked||st.needItem)){
    startOver(); return; }
  st.mode=b.dataset.tab; st.editing=false; render();
});

/* ---------------- item tab ---------------- */
const custId = catId => "cust-"+catId;
function custItem(cat){
  return {id:custId(cat.id), name:"Something else", value:st.overrides[custId(cat.id)]??100, liq:"normal"};
}
/* ================= HOW MUCH THE ITEM NUMBER COULD BE WRONG BY =================
   Asked for at the counter: trends on items, the same as gold got.

   The first job was to find out whether the item history can carry a trend
   read at all, and the answer is no - not yet, and not close. Five days of
   history, 47 before-and-after pairs. tools/measure-noise.mjs reads them
   and reports what they actually are:

     - 24 rows out of 24 moved UP on the 19->22 September run, median +20%.
       Chainsaws, bows, scopes and laptops do not all gain a fifth in three
       days. That is the source changing underneath - SoldComps ran out of
       quota and the ladder fell through to eBay's asking prices, which sit
       above sold ones. A step change in what is being measured, set aside.
     - What is left scatters both ways, 43% up, median 17.3%.

   So an item "trend" built on this today would be the tool reading its own
   noise back to the counter and calling it a market. That is worse than
   showing nothing, because it would be believed.

   What the same measurement IS good for is the question underneath the
   trend question: how much can I trust the number on screen? A midpoint
   that could be 17% different tomorrow should not be lent against as
   though it were exact - and unlike gold, where the guard comes from
   25 years of prices, here it comes from the tool's own repeatability.

   When months of re-checks exist and they start leaning one way rather
   than scattering, measure-noise.mjs says so (trendReady) and a real trend
   read can be built on top of this. It is not ready and it says so. */
let INOISE=null;
async function loadItemNoise(){
  try{ const r=await fetch("item-noise.json",{cache:"no-store"});
    if(!r.ok)return; const j=await r.json();
    if(j&&j.noiseMid>0){ INOISE=j; try{ render(); }catch(e){} }
  }catch(e){}
}
/* Aisles where the thing itself loses value while it sits, so a price from
   last month is wrong in a way a wrench's is not. */
const FAST_DECAY={elec:1,phone:1,coll:0.5};
function itemGuard(x){
  const m=x&&x.market;
  if(!m||!x.checked||!INOISE)return null;
  const mid=Number(m.mid)||0, lo=Number(m.lo)||0, hi=Number(m.hi)||0;
  if(!(mid>0))return null;
  /* A figure the counter typed is about THIS thing, in their hands. There
     is no sampling error to guard against - they looked at it. */
  if(m.kind==="hand"){
    /* "Nothing to guard" rested on "he looked at it", which the record
       now either confirms or does not. A declared guess and an asking
       price are the two it was never true of, so they say so. The guard
       FIGURE is untouched either way - moving that is his call, not mine,
       and this card is about what it admits. */
    const hs=handSrc(m.src);
    const soft=hs&&(hs.id==="gut"||hs.id==="ask");
    return {kind:"hand",mid,guard:mid,cut:0,why:[],warn:!!soft,
      head:soft?(hs.id==="gut"?"Your own read, nothing behind it":"An asking price, not a sale")
               :"Your own number for this one",
      detail:soft
        ? (hs.id==="gut"
            ? "You typed this as your own judgement, so there is no sample and nothing counted. The loan works off it exactly as typed \u2014 which is why it is worth checking a sold page before this much money goes out."
            : "This is what somebody was asking. Asks run high, so the loan is working off a ceiling rather than a price.")
        : "You typed this in, so it is about the thing in front of you rather than a sample of listings. Nothing to guard."};
  }
  const ev=(typeof rowEvidence==="function")?rowEvidence(m.note,m.src):{kind:"research",n:0};
  const spread=(hi>lo&&mid>0)?(hi-lo)/mid:0;
  const age=Number(m.age)||0;
  const decay=FAST_DECAY[x.cat&&x.cat.id]||0;
  const why=[];
  let cut=0;
  /* Short phrases, not sentences: they are read at a counter with somebody
     waiting, and they get stacked into one line. */
  if(ev.kind==="asking"){ cut+=INOISE.noiseMid/2;
    why.push(`${ev.n||"a few"} asking prices, not sales`); }
  else if(ev.kind==="research"){ cut+=8; why.push("nothing looked up"); }
  else if(ev.kind==="read"){ cut+=8; why.push("a range read off a sold page, not a tally"); }
  else if(ev.kind==="guide"){ cut+=8; why.push("a value guide, not sold prices"); }
  else if(ev.n&&ev.n<5){ cut+=5; why.push(`only ${ev.n} sale${ev.n===1?"":"s"}`); }
  if(spread>(INOISE.spread75||51)/100){ cut+=5;
    why.push(`${money(lo)}\u2013${money(hi)}, a ${Math.round(spread*100)}% spread`); }
  if(decay&&age>30){ cut+=Math.min(8,Math.round(decay*age/10));
    why.push(`${age} days old, and this aisle fades`); }
  else if(age>90){ cut+=4; why.push(`${age} days old`); }
  cut=Math.min(25,Math.round(cut));
  return {kind:ev.kind,n:ev.n,mid,lo,hi,spread,age,cut,
          guard:Math.max(1,mid*(1-cut/100)),
          noise:INOISE.noiseMid,
          band:[mid*(1-INOISE.noiseMid/100),mid*(1+INOISE.noiseMid/100)],
          warn:cut>=8, why,
          head:(cut>=8?"Soft":cut>0?"Fair":"Solid")+" — "
              +(why.length?why.join(", "):(ev.n?ev.n+" real sales, tight range":"real sales, tight range"))};
}
/* The same strip the metals page carries, saying the item version of the
   same thing: here is how good this number is, here is what it does to the
   offer, and here is the figure if you disagree. */
function itemGuardHTML(x){
  const G=x&&x.guard;
  if(!G||G.kind==="hand")return "";
  const m0=n=>money(Math.round(n));
  /* WORDY. Reported from the counter, and it was: 190 words on a card that
     answers one question. What he needs while somebody is waiting is whether
     the number is good and what the loan comes off. The rest - the
     repeatability band, why items have no trend read - is background, and
     background goes in a fold. */
  /* NOT ITS OWN CARD ANY MORE. It sat directly under "Behind this number"
     and said the same thing twice - that card's headline already reads
     "Researched / fair data" and this one answered "Soft - researched, never
     measured". Reported from the counter as duplicated and confusing, and it
     was MY doing: moving the evidence card to the top of the rail put the
     two side by side and made the overlap plain. They are one card now, in
     the order the question is actually asked: what is behind the number,
     then what the desk does about it. */
  return `<div class="iGuard">
    <div class="iRule"><span>What the desk does about it</span></div>
    ${/* The verdict line went. It read "Soft - researched, never measured"
          directly under a headline already reading "Estimate - no real sale
          behind it", which was two of the five ways this card said one thing.
          What is left is the only part that moves money, said in a sentence
          instead of as two figures with the counter left to work out which
          is which. */""}
    ${G.cut>0
      ? `<div class="iLine ${G.warn?"warn":""}">The loan is figured off <b>${m0(G.guard)}</b> instead of ${m0(G.mid)} &mdash; ${G.cut}% off, because the price above is not a measured one. A buy keeps the full ${m0(G.mid)}.</div>`
      : `<div class="iLine good">Solid enough to use as it stands. The loan is figured off the full ${m0(G.mid)}.</div>`}
    <details class="fold iFold"><summary class="foldLine">Why, and why items have no trend read</summary>
      <div class="iMore">
        ${G.cut>0?`<p>A buy you can price and move. A pawn is 60 days on a number that came out of a sample, so the loan takes the ${G.cut}%. Type your own resale in and the guard steps aside.</p>`:""}
        <p><b>${m0(G.band[0])}–${m0(G.band[1])}</b> is what the same search would likely say tomorrow. Re-running it days apart moved the answer ${G.noise}% in testing — the tool's own repeatability, not the market.</p>
        ${INOISE&&!INOISE.trendReady?`<p><b>No trend read on items yet.</b> Gold's guard has 25 years of daily prices. This has ${INOISE.spanDays} day${INOISE.spanDays===1?"":"s"} and ${INOISE.usable} usable pairs, scattering both ways (${INOISE.upShare}% up)${INOISE.stepChanges&&INOISE.stepChanges.length?`, after throwing out a run where ${INOISE.stepChanges[0].up} of ${INOISE.stepChanges[0].n} rows moved together — the price source changing, not the market`:""}. Months of re-checks that lean one way would make it a trend. This is not that.</p>`:""}
      </div>
    </details>
  </div>`;
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
     A make typed by hand always wins; this only fills the silence.
     Everything the counter has told us about what this is gets read: the
     catalog row, the model they picked off the list ("DeWalt 20V drill
     kit" - the make is the first word of it), and anything typed in the
     price book. A tier they tapped themselves outranks all of it. */
  const BR=brandOf(cat);
  const namedBrand=(BR.on&&!st.brandTyped&&!st.brandSet)
    ? brandFromName(cat.id,(item.name||"")+" "+(st.model||"")+" "+(st.bookName||"")) : null;
  const brandTier=namedBrand?namedBrand.tier:st.brand;
  const brandMult=BR.on?BRANDS.find(b=>b.id===brandTier).mult:1;
  /* What a missing piece costs. It was a flat 30% for everything, which was
     a guess nobody had checked - and it is the wrong number where it has
     been checked. Consoles sold WITHOUT a controller went for 0.88 to 0.94
     of one with, across four models: a tenth off, not a third. Docking 30%
     for a missing controller was lending $180 against an Xbox that resells
     for $500. Per-category now; the ones still at 0.7 are still guesses and
     say so in the catalog. */
  const completeMult=(cat.complete.on&&!st.complete&&!specCoversComplete(item.id))
    ?(Number(cat.complete.mult)||0.7):1;
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
  /* AND THE ARITHMETIC CLAMPS IT TOO, not just the list of buttons. A
     condition is remembered across items: pick a boxed drill, answer New
     in box, then pick a console, and st.cond is still "new" on a screen
     that no longer offers it. The button would be gone and the +30% would
     still be in the price. The list and the sum have to agree. */
  const condId=(!handSet&&specCoversBox(item.id)&&st.cond==="new")?"exc":st.cond;
  const cond=handSet?1:(COND_MULT[condId]||1);
  /* THE SPECIFICATION REACHES A MEASURED PRICE TOO, and for six months it
     did not. brandMult staying out is right - a measured figure for a Sega
     Saturn already has Sega in it. spec.mult staying out was not: what the
     thing IS is not what the thing is WORTH, and a book row prices the
     standard configuration, not the one on the counter.
     Swept the whole book to find out how much was being thrown away: 377
     of 507 rows drive a price, and 649 specification answers across them
     reached nothing. A chainsaw that will not start (0.4) priced as a
     running one on 19 rows. A bare DeWalt with no battery (0.6) priced as
     a two-battery kit. An iCloud-locked iPhone (0.85) priced as clean. A
     quartz Datejust (0.55) priced as an automatic. A Saturn with no
     controller and no cables (0.6) priced the same as one complete in box
     (1.6) - which is where this started: "the next question still asks me
     for a brand/make."
     THE BASELINE IS WHAT MAKES THIS SOUND. Audited all 125 spec groups:
     every one has an option at exactly 1.0, and specBase already returns
     the first m===1 option as the unanswered default. So the neutral of
     every group IS the standard configuration, which is what the measured
     row was measured on. Nothing is rebased; an unanswered run multiplies
     by 1 and lands exactly where it landed yesterday. */
  const resale=checked ? market.mid*cond*completeMult*spec.mult
                       : baseValue*CATALOG_AT_GOOD*cond*brandMult*completeMult*spec.mult;
  const ltv=lendPct(baseLtv,liquidity,checked?market:null);
  /* set by hand for the category > this item's own rate > the category's */
  const buySuggest=(typeof BUY_ITEM!=="undefined"&&BUY_ITEM[item.id]!=null)?BUY_ITEM[item.id]
                  :((typeof BUY_DEFAULT!=="undefined"&&BUY_DEFAULT[st.catId]!=null)?BUY_DEFAULT[st.catId]:Math.min(90,baseLtv+5));
  const buyWhy=(typeof BUY_ITEM_WHY!=="undefined"&&BUY_ITEM_WHY[item.id])||(typeof BUY_WHY!=="undefined"&&BUY_WHY[st.catId])||"";
  const buyBase=(st.buys&&st.buys[st.catId]!=null)?st.buys[st.catId]:buySuggest;
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
  /* THE LOAN COMES AFTER THE BUY, AND NEVER GOES ABOVE IT.
     The floor was applied to buying and not to lending, so the two numbers
     drifted apart at the bottom of the book and ended up contradicting each
     other: a $32 air rifle read "pay $7" and "lend $14" side by side, and 40
     of the 248 rows the desk prices did the same thing.
     There is no version of the trade where that is right. A loan that is not
     redeemed leaves you owning the thing at what you lent, with the same
     hauling, listing and shipping the floor was written to cover - so
     lending $14 on it is a worse deal than buying it for $7, not a better
     one. You never lend more than you would pay to own it outright.
     Nothing new is invented here: the loan is simply held to the same three
     caps the buy price already answers to. */
  /* MONEY THAT CHANGES HANDS IS ROUNDED TO THE NEAREST FIVE.
     Nobody counts $31 out of a till, and "thirty" is a number a customer
     hears and repeats. The resale value, the cushion and the fee are NOT
     rounded - they are the arithmetic behind the offer, not the offer.
     Rounding happens after the caps, and the caps are then re-applied to
     the rounded figures: $42 rounds down to $40 while $38 rounds UP to
     $40, so without that the loan could land above the buy price and undo
     the very thing the caps are for. */
  const r5=(n)=>Math.max(5,Math.round(n/5)*5);
  /* THE LOAN IS SIZED OFF THE GUARDED RESALE, THE BUY OFF THE PLAIN ONE.
     Same split as the metals page, for the same reason: a buy you can price
     and shift, a pawn is a 60-day position in a number that came out of a
     sample. Where the sample is thin, old, or asking prices rather than
     sales, the loan comes off a figure that allows for it. The buy keeps
     the straight resale - its own rate and the floor already answer for it,
     and guarding both would charge the same doubt twice. */
  const _g=(typeof itemGuard==="function")
    ? itemGuard({market,checked,cat}) : null;
  const guardResale=_g? Math.min(resale, resale*(1-_g.cut/100)) : resale;
  const lendWant=Math.round(guardResale*ltv/100);
  const targetRaw=Math.min(lendWant,cap.pay);
  const lendCapped=lendWant>cap.pay;
  /* Below this there is no deal to write, buy or loan. The desk already
     refused to write a loan under five dollars; the same five dollars now
     decides whether there is anything here at all, rather than printing a
     one-dollar offer next to an eight-dollar loan. */
  const buyTooThin=cap.pay<5;
  /* A row too thin to deal on keeps its true pennies: the screens say walk
     away rather than naming a figure, and rounding $1 up to $5 would put a
     number back on a deal that has none. */
  const buy=buyTooThin?Math.max(1,Math.round(cap.pay)):r5(cap.pay);
  const target=buyTooThin?Math.max(1,Math.round(targetRaw)):Math.min(buy,r5(targetRaw));
  return {cat,item,baseValue,baseLtv,condition,liquidity,liqId,resale,guardResale,guard:_g,ltv,target,market,checked,handSet,buyBase,buySuggest,buyWhy,buyPct,buy,lendWant,lendCapped,
          brandTier,namedBrand:namedBrand&&namedBrand.name,
          brandMult,brandName:BR.on?BR[brandTier]:null,spec,specMult:spec.mult,
          /* The range is held to the same ceiling as the suggested loan -
             a "top loan" above what you would pay to own the thing is the
             original fault wearing a different label. Capped at the BUY
             ceiling, not at the suggested loan: clamping to the suggestion
             would flatten the range to a single number on every ordinary
             row, where the top loan is meant to sit above it. */
          low:buyTooThin?Math.max(1,Math.round(resale*Math.max(8,ltv-12)/100))
              :Math.min(target,r5(resale*Math.max(8,ltv-12)/100)),
          high:buyTooThin?Math.max(1,Math.min(Math.round(cap.pay),Math.round(resale*Math.min(100,ltv+8)/100)))
              :Math.min(buy,r5(resale*Math.min(100,ltv+8)/100)),
          charge:pawnCharge(target),margin:resale-target,buyMargin:resale-buy,
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
  /* NOTHING ON SCREEN SAID IT WAS WORKING.
     Reported from the counter: "when an item does not have a number in the
     dataset, and you first select it, while it's searching there is no
     indicator that it is working on something. I thought it was just
     waiting on me to make a selection."
     It was searching. Picking an item with a make and a model fires the
     lookup by itself, and priceFind does set findBusy and does re-render -
     but the only place that says so is railHTML, which is not reached
     until the run is FINISHED. Mid-run the rail is this strip, and this
     strip had no idea. So the tool looked idle at exactly the moment it
     was doing the one thing it is for, and the person waiting on it
     thought they were the ones being waited on.
     The wheel goes where the eye already is, in the box that is otherwise
     telling them what is still missing. */
  /* A TINY WHEEL IN A WALL OF TEXT IS NOT AN ANSWER EITHER.
     First cut put an 11px spinner beside the label and pushed "Looking it
     up" into the front of the paragraph that was already there. Reported:
     "I wasn't talking about a tiny one on the right sidebar, I'm thinking
     a big one in that window where the prices are eventually going to pop
     up."
     Right. This box is where the number lands, so while the number is
     being fetched the box should be visibly busy fetching it - not a
     paragraph with a speck in the corner. The searching state gets its own
     layout: the ring at 46px, one line saying what it is doing, and the
     list of what is still missing kept underneath in small type, because
     that is still true and still worth reading while you wait. */
  /* ONE SPINNER, AND IT IS THE ONE IN THE MIDDLE. "When an item is being
     searched, the round thinking animation is in two places - one in the
     middle section and again at the top window of right sidebar. It should
     only be in the middle." Both of those are mine: this one went in when he
     asked for a big ring instead of a speck, and then step4Inner got its own
     when he said he meant the window where the prices appear. The second was
     the right place and the first was never taken out.
     Safe on both surfaces: step4Inner is in app.js and the phone runs the
     same question, so the field screen keeps its ring too. The `working`
     flag went with it - nothing else in here read it, and a live-looking
     variable that decides nothing is how the next person reads this wrong. */
  const bare=t=>`<div class="pinStrip"><span class="pinLab">${window.PHONE?"What it's worth to you":"The numbers"}</span><span class="pinNote">${t}</span></div>`;
  /* "CHECKED" WAS DOING TWO JOBS AND BOTH WERE ON SCREEN AT ONCE.
     "why is there nothing looked up on a iphone?" - and there was: $440 to
     $530 off Swappa, read on 19 Sep, showing in Behind this number three
     inches away. What was unchecked was AUTHENTICITY. This strip said "Not
     checked yet", the loan gauge said "not checked yet", and the price
     panel says "Not checked / nothing looked up" for something completely
     different. Same two words, two meanings, one screen.
     The price side keeps "checked" because that is what the whole tool
     means by it everywhere else. The fakes side says what it actually is. */
  if(F&&F.blocks)return bare(F.verdict==="fail"?"A check failed \u2014 don't lend on the name."
    :"Authenticity not proven \u2014 "+F.done+" of "+F.n+" on the "+esc(F.sh.title.toLowerCase())+" sheet. The price is looked up; this is not.");
  if(!priceReady(x))return bare("<b>No price yet \u2014 still needs "+esc(needList(x))
    +".</b> Finish the run and the number comes with everything behind it.");
  /* It used to stop here and say "no resale value yet". The desk HAD a
     value - the built-in price book is the whole reason it knows what a
     laptop is worth - and it computed it, called it "the desk's own
     starting point" in the card above, and then refused to show it. On a
     tablet with no service connection, which is the one carried to the
     counter, that meant the tool never answered at all.
     An estimate is worth having as long as it is labelled an estimate, so
     it is shown and labelled. Only a failed authenticity check still
     blanks the money, because that is a reason not to lend, not a missing
     number. */
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
  /* THE DESK GETS THE DIAL TOO.
     The phone's whole screen was rebuilt around the anchor and the desk
     was left with what it always had: a stack of six labelled figures in
     small type, with the one number anybody says out loud the same size
     as "Loan / resale 35%". The rail is the desk's equivalent of the
     phone's hero card, so it holds the same thing - one enormous number
     in a dial, the second decision beside it, and the arithmetic
     underneath in a quiet grid where arithmetic belongs. */
  if(deskRail()) return railHTML(x);
  return `<div class="pinStrip pinDecide${P&&x.buyTooThin?" thin":""}">
    <span class="pinLab">${P?"What it's worth to you":"The numbers"}</span>
    <button class="pinNew" id="pinNew" type="button" title="Clear this item and start the next one. Your rates, shelf record, listings and deal log are kept.">Start over</button>
    ${x.buyTooThin
      ? cell("buy","Not worth buying","Walk away",1)+cell("lend","Not worth lending","Walk away",1)
      : (P?cell("buy","Pay up to",money(x.buy),1)+cell("lend","Or lend on it",money(x.target),1)
          :cell("buy","Buy it for",money(x.buy),1)+cell("lend","Lend him",money(x.target),1))}
    ${cell("resale",x.handSet?(P?"Resells for":"Resale, yours"):(P?"Resells for":"Resale, "+esc(COND_WORDS[st.cond][0].toLowerCase())),money(x.resale))}
    ${P&&!x.buyTooThin?cell("gain","You'd make",money(x.buyMargin)):""}
    ${cell("cushion","Your cushion",money(x.margin))}
    ${cell("fee","Fee / 30 days",money(x.charge))}
    ${cell("ltv","Loan \u00f7 resale",x.ltv+"%")}
    <span class="pinNote">${x.checked?"":`<b style="color:var(--warn-ink)">Estimate \u2014 nothing looked up yet.</b> `}${x.buyTooThin
      ? `It doesn\u2019t sell for enough to clear the ${money(x.buyFloor)} you want out of it \u2014 not as a buy, and not as a loan you end up owning.`
      : P?(x.buyTooThin
        ?`It doesn\u2019t sell for enough to clear the ${money(x.buyFloor)} you want out of a buy.`
        :`Capped by ${esc(buyCapWhy(x))}. Over ${money(x.buy)} and you\u2019re eating the ${money(x.buyMargin)}.`)
      :`Range ${money(x.low)}&ndash;${money(x.high)}. Never above the top.`}${x.buy===x.target&&!x.lendCapped&&!x.buyTooThin?` Buy and lend match in ${esc(x.cat.label.toLowerCase())} on purpose \u2014 ${esc(x.buyWhy||"")}.`:""}</span>
  </div>`;
}
/* The rail: one dial, one partner figure, then the working.
   Built as its own function rather than a variant of the strip, because
   the strip is a ROW of equals and this is a hierarchy - trying to be both
   is how the old one ended up with a 40px buy price and a 14px fee
   sharing a flexbox. */
/* WHAT COMES BACK BELONGS BESIDE WHAT GOES OUT.
   The money out the door was on the rail; the money coming back was folded
   shut in step 8, three cards down the middle column. Those are the two
   halves of one sentence, and the customer asks the second half out loud -
   "so what do I owe you" - while you are still holding the first. It is
   also the number he decides on.
   Day 30 is the one that matters, so it is the one that is big. The other
   two are what he asks next. The forfeit date is not a footnote either: it
   is the whole deal, and it goes on the card rather than in a fold. */
/* THE DEAL YOU PICKED, IN FULL.
   Two things were reported at once and they are the same fault. The pair
   of deal tiles on the answer card looked like a choice and was not one,
   and this panel's first rung was drawn with an accent border and an
   accent fill - the exact treatment every chosen pill on the screen wears
   - so it read as a selected tab. "It appears that this should be
   selectable but its not." Both were promising a control and delivering a
   label.
   Now the tiles ARE the control, and this panel is what they control. It
   shows one deal at a time, the one picked, and it says the arithmetic in
   the words used across the counter rather than as a rung ladder: what
   the interest is for a month, what he hands over to clear it at one
   month, and what he hands over at two. That was asked for directly -
   "monthly interest, total pay back after 1 month and another line for 2
   months" - and it is better than the ladder was, because DAY 31-60 never
   said whether $158 was the whole thing or the second month's part.
   Day 90 came out. The ticket is dead at day 60; a figure past it was
   arithmetic nobody can collect. */
function dealPanelHTML(x){
  const P=payAmt(x);
  const m1=P.amt+P.charge, m2=P.amt+P.charge*2;
  if(st.struckKind==="buy") return `<div class="railBack">
    <div class="railBackHd"><b>If you buy it</b><span>no ticket, no clock</span></div>
    ${/* Same cut on the buy side: the card carries BUY IT OUTRIGHT and the
          line under it already says what it resells for. What it does not
          say is what is left over once it sells. */""}
    <div class="dealRows">
      <div class="dRow tot"><span>You make, once it sells</span><b>${money(Math.round(x.resale)-x.buy)}</b></div>
    </div>
    <div class="rbDay60">Yours the moment you pay. Nothing to hold, nothing
      to give back \u2014 and nothing coming in until it sells.</div>
  </div>`;
  return `<div class="railBack">
    <div class="railBackHd"><b>If he pawns it</b><span>${pawnPct()}% per 30 days</span></div>
    ${/* "DUPLICATE INFO." Four figures printed twice, a few inches apart:
          the answer card says PAWN LOAN $45 and "to get it back $56 by day
          30 - the $45 plus $11 interest", and this panel said You hand over
          $45, Interest per month $11, Total to clear 1 month $56. The rule
          for this rail was already written when the buy side was cut - it
          must NOT restate what the answer card says, and it must carry what
          that card does not. Only the two-month total does, so that is all
          that is left of these rows. */""}
    ${/* "why are we showing 2 months arbitrarily?" It is not arbitrary and
          it never said so, which amounts to the same thing at a counter.
          s. 539.001: the ticket MATURES at day 30 and the item is FORFEIT at
          day 60. Sixty days is the longest he can take and the longest the
          shop's money is out - it is the end of the clock, not a guess at
          how long he will be. The answer card already says what day 30
          costs; this is the other end, and it now says which end it is. */""}
    ${/* AND ONLY THE ONE ROW, because the rule above is still the rule. I
          added a day-30 row next to it and check-pricing went red for the
          right reason: the answer card already says "to get it back $62 by
          day 30", and this panel exists to carry what that card does NOT.
          The complaint was never that the second month was missing company
          - it was that nobody said why sixty days. So the row keeps its
          place and gets its name. */""}
    <div class="dealRows">
      <div class="dRow tot"><span>If he runs to the last day \u2014 day 60${P.typed?" on "+money(P.amt):""}</span><b>${money(m2)}</b></div>
    </div>
    <div class="rbDay60">Day 30 the ticket matures, day 60 it is forfeit. Sixty
      days is as long as he can take and as long as your money is out \u2014 that
      is the whole clock, not a guess.</div>
    ${/* THE CONSERVATIVE-VS-AGGRESSIVE LIST, PUT BACK.
          Reported from the counter: "we used to have a conservative vs
          aggressive offer list." It was not deleted - it is the Low /
          Suggested / Top row, and it is still there under 1080px wide. The
          rail layout dropped it, along with the buy-outright row, as
          duplicates of the rail; the rail kept "Range $55-$130" in grey
          footnote type, which is the same three numbers with the judgement
          taken out. On a wide screen - the one the shop actually uses -
          the list had simply gone.
          It comes back FLAT: no accent fill, no ring, no tile. The middle
          figure is marked by weight alone. The rung ladder above this was
          reported as looking selectable when it was not, and three boxes
          with one of them lit is exactly how that mistake is made. */""}
    <div class="offerRow">
      <div class="oCell"><div class="k">Go low</div><div class="d">${money(x.low)}</div></div>
      <div class="oCell mid"><div class="k">Suggested</div><div class="d">${money(x.target)}</div></div>
      <div class="oCell"><div class="k">Go high</div><div class="d">${money(x.high)}</div></div>
    </div>
    <div class="oWhy">Low when cash is tight or the deal feels off. High for a
      regular you want back. Never above the top \u2014 that is your cushion.</div>
    ${/* The day-30/day-60 line sat here and was called unnecessary at the
          counter. It is statute background rather than a figure, and it is
          already on step 8 - "what it costs him to get it back, and the day
          it becomes ours" - and in the payback ladder. The rail is numbers. */""}
  </div>`;
}
function railHTML(x){
  /* THE RAIL ONCE THERE IS AN ANSWER.
     It used to open with a saturated card carrying the offer, the loan and
     the resale - the phone's hero, on the desk. That was right while the
     middle column was a question; it stopped being right the moment the
     run started ending in the answer six inches to the left. Reported from
     the counter as redundant, and it was.
     What is here instead is everything the middle column does NOT say:
     the actions, what kills one of these, the rungs past day 30, and the
     cushion. */
  const thin=x.buyTooThin;
  const I={
    look:'<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
    log :'<path d="M5 4h11l3 3v13H5z"/><path d="M9 9h6M9 13h6"/>',
    add :'<path d="M12 5v14M5 12h14"/>',
    ev  :'<path d="M3 17l5-6 4 4 5-7 4 5"/>',
    lend:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    math:'<path d="M4 18V9M10 18V5M16 18v-6M2 21h20"/>'
  };
  const canLook=!!(CAP.sample&&!ebayBlind(x));
  const act=(id,label,icon,on)=>`<button class="act" data-dact="${id}"${on?"":" disabled"}>`
    +`<i><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></i><span>${label}</span></button>`;
  /* THE SAME THREE NUMBERS, TWICE, SIX INCHES APART.
     Reported from the counter: once the run ends in the answer, the blue
     hero beside it is "redundant of the new middle section." It is - buy
     it for, lend him, resells, all of it repeated in a bigger typeface
     than the card that just produced them.
     What the rail keeps is what the middle does NOT say. The three actions
     are actions, not numbers, so they stay - "Another" especially, since
     it is how the next customer gets served. The ladder keeps days 31-60
     and 90; the middle only names day 30. The cushion is nowhere else. And
     the space the hero gave up goes to the thing a counter actually wants
     in the last second before the money moves: what kills one of these. */
  /* pinHTML above returns a bare strip whenever the run is not finished,
     so this function is only ever reached once there IS an answer - which
     is why the old hero branch that used to follow was unreachable and has
     been taken out rather than left sitting here looking live. */
  /* The name was here AND at the top of the answer card, which now leads
     with "Laptop · Excellent". One of them had to go, and it is this one:
     the card that carries the money should carry the name of the thing the
     money is for. What is left is the three actions, which are the only
     reason this strip exists. */
  return `<div class="railTop${thin?" bad":""}">
      ${thin?`<div class="railNo"><b>Walk away.</b> It will not clear the ${money(x.buyFloor)} you want out of it &mdash; not as a buy, and not as a loan you end up owning.</div>`:""}
      <div class="acts">
        ${act("look",findBusy?"Looking\u2026":"Look up",I.look,canLook&&!findBusy)}
        ${act("log","Log it",I.log,true)}
        ${act("new","Another",I.add,true)}
      </div>
      ${/* IT WAS NOT THAT THE BUTTON DID NOTHING - IT WAS THAT IT SAID
            NOTHING. Reported from the counter: "the lookup button doesn't
            do anything." It fires, it searches, it can change the price.
            But every word it produces - "Searching eBay...", the tally,
            "No listings found", "Every search failed" - was written into
            #pdFindMsg, which belongs to the comps card and is not on the
            page at all when the rail is up. Press it and the screen does
            not move, win or lose. So the rail carries the running
            commentary itself, right under the button that started it. */""}
      ${(findBusy||findMsg)?`<div class="railFind${findBusy?" busy":""}" id="railFindMsg">${esc(findMsg||"Searching\u2026")}</div>`:""}
    </div>
    ${/* MONEY FIRST, CAUTIONS UNDER IT.
          "All prices and numbers should take precedent. Move the cautions
          and guides down below the finances." They were above it: the
          evidence-quality guard, then what kills one of these, then - four
          hundred pixels down - the figures the whole screen exists to
          produce. Both of those cards are real and neither is the answer;
          a panel that opens with two paragraphs of warning and buries the
          number is a panel you read past.
          So: what you hand over, the interest, the totals, the room to
          move and the cushion, and THEN how good the number is and what
          would kill the deal. Nothing is dropped - the guard still moves
          the loan and still says so, it just says it after the figure it
          moved rather than before it. */""}
    ${thin?"":dealPanelHTML(x)}
    ${/* THE CUSHION ROW AND THE RANGE LINE BOTH WENT, called redundant at the
          counter and they were. The row's fee repeated "Interest, per month"
          two rows above it; its "lending N% of resale" is a setting, not a
          figure for this deal; and the cushion itself is a tile on step 7,
          the card literally named "cushion, fee, and why it is this much".
          The range line repeated the Go low / Go high tiles directly above
          it, and "Never above the top" was already the last sentence of the
          note beside those tiles - the same warning twice in four lines.
          What the note said that nothing else does is kept below: that
          nothing has been looked up yet, and that the thing is too thin to
          deal on at all. Those only render when they are true, so the rail
          ends on the figures rather than on a line of filler. */""}
    ${(!x.checked||thin)?`<div class="pinNote railNote">${x.checked?"":`<b style="color:var(--warn-ink)">Estimate \u2014 nothing looked up yet.</b> `}${thin
      ? `Not worth buying, and not worth lending on either.`
      : ``}</div>`:""}
`;
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
/* WHAT KILLS ONE OF THESE.
   The desk has carried a driver and a killer for every kind of thing since
   the beginning, and they sat folded inside a details on the step that sets
   the brand - read once while typing a model, gone by the time anybody is
   deciding. They belong in the last second before the money moves, which
   on a desk is the rail: the price is settled, the offer is on the screen,
   and the only question left is whether the thing in your hands is the
   thing the price assumed. */
/* WHERE THESE TWO SIT. They were the tail of the price card, which put the
   cautions above "Behind this number" - so the rail read price, warning,
   warning, and only then how much evidence the price rests on. Reported from
   the counter: money first, then how good the number is, then what to watch
   for. The rail places them now; they are still desk-rail only, which is
   where they have always been. */
function railGuardHTML(x,pin){
  /* Only under the FULL price card. pinHTML falls back to a bare strip while
     the run is unfinished or a check has failed, and these two never showed
     under that - moving them out of the price card put "Before the money
     moves" onto the mid-run screen, which nobody asked for. Reading the pin
     that was already built beats restating the condition it was built from,
     because a restated condition is one that drifts. */
  /* The guard moved INTO the evidence card above, so only the cautions are
     placed here. Leaving the call in as well drew it twice. */
  return String(pin).includes('class="railTop') ? killerHTML(x) : "";
}
function killerHTML(x){
  const ov=itemOv()||{}, cat=x.cat||{};
  const kill=ov.killer||cat.killer||"", drive=ov.driver||cat.driver||"";
  if(!kill&&!drive)return "";
  return `<div class="card killCard">
    <span class="label" style="margin:0">Before the money moves</span>
    ${kill?`<div class="killRow no"><b>What kills it</b><span>${esc(kill)}</span></div>`:""}
    ${drive?`<div class="killRow go"><b>What sets the price</b><span>${esc(drive)}</span></div>`:""}
  </div>`;
}
/* Sale, hope, or hearsay - read off the row's own note.
   The harvest writes these strings, so the shapes are fixed:
     "14 eBay sales in the last 90 days"        a measured sale
     "11 listings, asking prices - no sold data" a measured ask
   and anything else is one of the 161 rows that were researched by hand in
   September, which are neither and should not pretend to be either. */
/* "still dont understand how we got a number of the item was not looked up"
   - reported with a Marlin Model 60 on the screen, and it was the third
   time this card had been queried. The first two times I rewrote the
   wording. This time I counted, and the wording was never the fault.

   THE CARD WAS CONTRADICTING ITSELF, THREE LINES APART. It printed
   "SOURCE  GunWatcher (GunBroker sales)" and then, underneath,
   "Nobody checked what one actually sold for." Both on screen at once. Of
   course it made no sense - it was two opposite claims about the same
   number, and he was reading it correctly.

   The cause: this function decided where a price came from by GREPPING THE
   FREE-TEXT NOTE. The Marlin's note is "Feed tube condition matters" -
   a sentence about feed tubes, with no word like "sales" in it - so it
   fell through to "no evidence". The src field on the same row reads
   gunwatcher.com/gun-value-sold-information, which is GunBroker sold
   prices, and nothing ever looked at it.

   Counted across the book: 117 rows said "no real sale behind it" while
   carrying a sold-price source. SIX rows genuinely have no source at all.
   The card was wrong 117 times and right 6.

   So provenance is read off the SOURCE, which is the field that records
   it, and the note goes back to being what it is - a remark about feed
   tubes. Four states now, because "read off a sold page" and "nothing at
   all" are not the same thing and collapsing them is what caused this:

     sold      individual sales counted, n known
     read      a real sold-price source, but a RANGE read off the page by
               eye rather than a tally. This is the 117.
     asking    listings. Nobody paid these.
     guide     something WAS consulted and it was not a sold-price page:
               a published value guide (jdpower), a forum thread, a
               dealer's own page, shelf tags photographed in Bristol. 55
               rows. These were being told "nothing was looked up" too,
               which is just as false - "you had to of used something to
               base your number from" is exactly right about them.
     research  no source at all. Six rows, and only six.

   The cut arithmetic above treats "read" exactly as it treated "research"
   (8 points), ON PURPOSE: not one price in the book moves because of this
   change. What was wrong was what the desk SAID about the number, not the
   number, and fixing the words is not licence to quietly reprice 117 rows
   of firearms. If the haircut on a read-off range should differ from the
   haircut on nothing at all, that is its own change with its own argument. */
const SOLD_SRC=/gunwatcher|gunbroker|pricecharting|worthpoint|swappa|lh_sold|lh_complete|tabname=sold|sh\/research/i;
/* ---- WHAT THE LOAN IS WORTH IS WHAT THE PRICE IS WORTH ----------------
   "Wouldn't we just need to keep most all items around 50% if we can get
   verified prices from a source such as eBay?"

   He is right, and the shape of it was worse than he thought. The lend
   rate was

     ltv = the aisle's rate + a liquidity adjustment

   and nothing else. Evidence strength did not enter it anywhere, so a
   Rolex figure built from twelve verified eBay sales and a built-in guess
   nobody had ever looked up lent the same share of resale. Uncertainty
   about what a thing is worth is the whole reason to lend low, so the one
   thing that should move the rate was the one thing that did not.

   On a Saturn that resells for $175, at the shop's 25% per 30 days:

     lend $21 (12%)   he redeems: +$5/mo    he forfeits: yours at $21
     lend $53 (30%)   he redeems: +$13/mo   he forfeits: yours at $53
     lend $88 (50%)   he redeems: +$22/mo   he forfeits: yours at $88

   Most pawns redeem, and 50% earns four and a half times what 12% does on
   the same ticket. On a forfeit you still clear $64 after eBay fees.

   BUT NOT A FLAT 50% ON EVERYTHING VERIFIED, because the book's evidence
   is not uniform: of 519 rows, 305 are graded high, 172 medium, 42 low,
   and 28 are asking prices rather than sales. Asks run high, and high is
   the wrong way to be wrong when money is going out. The Saturn that
   started this is one of the low ones - "four listings on the whole page,
   treat the figure as thin". Lending half of a thin number is the one
   place to stay careful. So the rate follows the evidence.

   AND IT ONLY EVER RAISES. Where the aisle already lends more than the
   evidence band would, the aisle wins and nothing changes. Cutting rates
   the counter has been working to for months is a different decision and
   nobody asked for it - the rows where the evidence says LESS than today
   are listed in the findings for him to rule on separately. */
const LEND_EV={sold:50, thin:32, asking:25};
/* Liquidity still bites, because how sure you are of the price and how
   long your money is out are two different risks. It bites less than the
   aisle's own adjustment, because part of that big number was standing in
   for price uncertainty, and a verified price has just removed it. */
const LEND_LIQ={fast:0, normal:-2, slow:-6};
function lendEvidence(market){
  if(!market||market.stale)return null;
  /* A figure the counter typed is his own judgement with the thing in his
     hands. It is not the book's evidence to grade, so it leaves the rate
     where the aisle put it. */
  if(market.kind==="hand")return null;
  const ev=rowEvidence(market.note,market.src);
  if(ev.kind==="asking")return "asking";
  if(ev.kind==="sold"||ev.kind==="read")
    return ((ev.kind==="sold"&&ev.n>=3)||market.conf==="h")?"sold":"thin";
  /* A shelf tag or a maker's own page is not a sale. */
  return "asking";
}
function lendPct(baseLtv,liquidity,market){
  const base=Math.max(10,baseLtv+(liquidity?liquidity.adj:0));
  const band=lendEvidence(market);
  if(!band)return base;
  const want=Math.max(10,LEND_EV[band]+(LEND_LIQ[liquidity&&liquidity.id]||0));
  return Math.min(50,Math.max(base,want));
}
function rowEvidence(note,src){
  const t=String(note||"");
  const sold=t.match(/(\d+)\s+[^.]*\bsales?\b[^.]*\blast\b/i);
  if(sold)return {kind:"sold", n:Number(sold[1])||0};
  if(/asking price|no sold data|listings,\s*asking/i.test(t)){
    const n=t.match(/(\d+)\s+listing/i);
    return {kind:"asking", n:n?Number(n[1]):0};
  }
  const u=String(src||"");
  if(SOLD_SRC.test(u))return {kind:"read", n:0};
  if(u.trim())return {kind:"guide", n:0};
  return {kind:"research", n:0};
}
function weightHTML(x){
  const m=x.market;
  const CONF={h:[100,"","good data"],m:[62,"warn","fair data"],l:[28,"warn","thin - check it"]};
  const bar=(pct,tone)=>`<div class="wBar"><i class="${tone||""}" style="width:${Math.max(3,Math.min(100,Math.round(pct)))}%"></i></div>`;
  const card=(head,right,barHTML,foot)=>`<div class="card wCard">
    <span class="label" style="margin:0">Behind this number</span>
    <div class="wHead"><b>${head}</b><span>${right}</span></div>
    ${barHTML}${foot?`<div class="wFoot">${foot}</div>`:""}${itemGuardHTML(x)}</div>`;

  /* A meter that means "no evidence" was drawn FULL and merely greyed out.
     Grey or not, a full bar reads as a full bar at arm's length across a
     counter - the one glance this card exists for said maximum confidence
     when it meant none at all. Empty is the honest picture, and it is the
     same shape as the sentence underneath it. */
  if(!m||!x.checked)
    return card("Not checked","nothing looked up",bar(0,"none"),
      "No sale behind this yet \u2014 the figure is a built-in starting point, not a price anybody paid. The buttons on the right open a sold page in your browser; read the middle price off it and type it in, and this bar fills.");

  if(m.kind==="found"||m.kind==="harvest"){
    const n=m.n||0, sold=m.sold||0, share=n?sold/n:0;
    const asks=n-sold;
    /* The pictures belong HERE, not only on the step that set the price.
       By the time the counter is deciding, the price is already set and
       step 2 is long gone - and "12 sold" is a claim, while twelve pictures
       are something they can check against the thing in their hand. */
    /* WHICH SOURCE, IN WORDS, AND WHY IT IS NOT THE BETTER ONE.
       Asked from the counter: "how are we searching eBay right now? sold
       comps usage is maxed out." The desk knew - the service answers every
       lookup with the source it reached and a warning saying what it fell
       past to get there - and the only place that ever appeared was one
       word on the progress line, which is gone the moment the price lands.
       So the counter was looking at a number with no idea whether it came
       from sales, from asking prices, or from the built-in list.
       It is named here now, on the price itself, in the order the service
       tries them. */
    /* FOUR WAYS OF SAYING THE SAME THING.
       This card read: "34 listings / 0 sold - 34 asking", then "eBay
       listings - what is for sale right now", then "sold-price quota spent
       for the month, fell back to asking prices", then "eBay 34", then
       "Mostly asking prices. Nobody paid these..." Every one of those is
       the sentence "these are asks", and a counter reading the same fact
       five times in five wordings starts skimming - which is how the one
       line that is NOT a repeat gets missed.
       One statement each: what they are, where from, why not better, and
       what it means for the number. */
    const askOnly=sold===0;
    /* THE SAME THREE WORDS AS THE BOOK BRANCH. This is the live-comps copy
       of the card and it kept the old wording after the book copy was
       rewritten - caught by a suite, which is the second surface of the
       drift this repo warns about: one card, two branches, and only one of
       them was fixed. The count keeps its place on the right, where it is
       news rather than a verdict. */
    const head=askOnly ? "Asking prices"
             : share>=0.5 ? "Measured"
             : "Part measured";
    const right=askOnly ? n+" asking price"+(n===1?"":"s")+", nobody paid these"
              : share>=0.5 ? sold+" real sale"+(sold===1?"":"s")
              : sold+" sold \u00b7 "+asks+" asking";
    const VIA={soldcomps:"SoldComps \u2014 completed sales",
               marketplace_insights:"eBay \u2014 sold and completed",
               browse:"eBay listings, not sales"};
    const via=VIA[m.via]||(m.from?esc(m.from):"");
    /* The service's own sentence carries "fell back to asking prices" on
       the end, which the headline has already said. Keep the half that is
       news - WHY there is no sold data this time. */
    const why=String(m.viaWhy||"").replace(/,?\s*fell back to asking prices\.?$/i,"").trim();
    return card(`<span class="wKind ${askOnly?"asking":share>=0.5?"sold":""}">${head}</span>`, right,
      bar(n?share*100:3,share>=0.5?"":"warn"),
      (via?`<div class="wVia"><span>Source</span><b>${esc(via)}</b></div>`:"")
      +(why?`<div class="wWhy">${esc(why.charAt(0).toUpperCase()+why.slice(1))}.</div>`:"")
      +(share>=0.5
        ? "Prices somebody actually paid, in the last 90 days."
        : "What sellers are hoping for. They run high, so treat this as a ceiling rather than a price."))
      +thumbStripCard(compsMatch(x));
  }

  if(m.kind==="list"){
    const c=CONF[m.conf]||CONF.m;
    /* THE HEADLINE SLOT HOLDS A VERDICT, NOT A HOSTNAME.
       This branch used to put srcName(m.src) there, so the card read
       "Swappa" - one word on its own, in the same slot where every other
       branch of this function puts a quantity or a judgement: "12
       listings", "Not checked", "No sales found", "your 3 sales". Swappa
       is right and the price behind it is right; the screen just never
       said what the word was doing there. It went past me in three of my
       own screenshots reading "Underpriced", which is also a price site
       and not, as it looks, a verdict on the offer.

       The source belongs in the sentence, where it has "researched from"
       in front of it and is worth something. */
    /* "Researched from eBay, checked Sep 23. Nothing looked up live yet."
       Both halves were true and together they read as a contradiction -
       a great deal WAS looked up, on 23 Sep, by the weekly harvest; what
       had not happened was this device re-checking it today. The sentence
       said "nothing" about work that is the entire reason the row has a
       number. It says which day the figure is from and leaves it there. */
    /* WAS IT A SALE OR A HOPE? THE ONE THING IT DID NOT SAY.
       Asked at the counter looking at a PlayStation: "is this truly a sold
       number or a for sale number?" It was a sold number - fourteen
       completed eBay sales - and nothing on the screen said so. The panel
       led with "Desk price list", which describes where the figure is
       STORED rather than what is behind it, and the only clue was a
       confidence word.
       The row has always known. Its note is written by the harvest and
       says either "14 eBay sales in the last 90 days" or "11 listings,
       asking prices - no sold data". So the panel leads with that, in the
       slot where every other branch of this function puts a verdict. */
    /* THREE WORDS, ONE SLOT, PLAIN ENGLISH. Reported from the counter three
       times running, the last time as "someone brand new to the tool has no
       idea what this means, i dont even know what it means".
       Two faults, and rewording was never going to fix either.
       FIRST, it was written from the tool's point of view. "Nothing was
       counted" only lands if you already know the tool SOMETIMES counts real
       eBay sales; a new person does not, so the sentence answered a question
       nobody asked.
       SECOND, the card said the same thing five ways - "Researched", "fair
       data", "not counted by the tool", "Nothing was counted", and "Soft -
       researched, never measured" - and not one of them said what to DO.
       So: Measured / Asking prices / Estimate. One word for what is behind
       the price, the same slot every time, and then the action. */
    /* "the explanations need to be simpler and just show where the number
       came from. you had to of used something to base your number from."
       That is the whole brief, and it is the right one - he is not asking
       to be reassured about the evidence, he is asking the plainest
       possible question about a figure that is about to leave the till.

       So the card answers it in ONE SENTENCE that names the range, the
       source and the day. Everything that used to argue about how much to
       trust it is gone from here: the headline word says what kind of
       evidence it is, the fold below already carries what the desk does
       about it, and five sentences of hedging is what made the last two
       versions unreadable. */
    const ev=rowEvidence(m.note,m.src);
    const head=ev.kind==="sold"   ? "Real sales"
             : ev.kind==="read"   ? "Real sales"
             : ev.kind==="asking" ? "Asking prices"
             : ev.kind==="guide"  ? "A value guide"
             : "Nothing looked up";
    const right=ev.kind==="sold"   ? (ev.n?ev.n+" counted":"counted")
              : ev.kind==="read"   ? "read off the page, not counted"
              : ev.kind==="asking" ? "nobody paid these"
              : ev.kind==="guide"  ? "not sold prices"
              : "no source at all";
    const pct=ev.kind==="sold"?c[0]:ev.kind==="read"?52:ev.kind==="asking"?26:ev.kind==="guide"?34:8;
    const tone=ev.kind==="sold"?c[1]:"warn";
    const via=esc(srcName(m.src));
    /* THE RANGE ITSELF, SPELLED OUT. He asked where the number came from
       twice and the card never once showed him the number it came from -
       it showed $241 and $120 and $110, all worked out from $175-250, and
       never printed $175-250 anywhere. That omission is most of why the
       question kept coming back. */
    const band=(m.lo&&m.hi)?money(m.lo)+"\u2013"+money(m.hi):money(m.mid);
    const when=esc(fmtDay(m.date));
    const line=ev.kind==="sold"
      ?`<b>${band}</b>, from ${ev.n?ev.n+" sales":"sales"} counted on ${when}.`
      :ev.kind==="read"
      /* "look one up" survives here in four words. Three wordings of this
         card failed at the counter before the rule was learned: a line
         that is true but needs explaining has failed, and what a new
         person can always use is the ACTION. Open it and check. */
      ?`<b>${band}</b> was read off that page on ${when} and typed in. Real sold prices \u2014 but a range read by eye, not a count. Open it and check.`
      :ev.kind==="asking"
      /* "Treat it as a ceiling, not a price" came off in the first draft of
         this rewrite and check-pricing caught it. That was me being wrong,
         not the test being stale: asks run high, and high is the wrong way
         to be wrong when money is going out of the till. Simpler is the
         brief; simpler is not licence to drop the one line on this card
         that protects the money. */
      ?`<b>${band}</b>, from ${ev.n?ev.n+" listings":"listings"} on ${when}. What sellers wanted, not what anybody paid \u2014 a ceiling, not a price.`
      :ev.kind==="guide"
      ?`<b>${band}</b> came off that page on ${when}. A published guide \u2014 not a record of what one sold for.`
      :`<b>${band}</b> is a built-in starting figure. Nothing was looked up \u2014 open a sold page before real money moves.`;
    return card(`<span class="wKind ${ev.kind}">${head}</span>`,right,bar(pct,tone),
      /* srcName("") returns the words "the source", so a row with nothing
         behind it was printing "Source: the source" directly above a line
         saying nothing was looked up. Caught by rendering one card of each
         kind rather than by reading the code. No source, no Source row. */
      (m.mine?`<div class="wVia"><span>Source</span><b>Your own master sheet</b></div>`
             :m.src?`<div class="wVia"><span>Source</span><b>${via}</b></div>`:"")
      +(m.note?`<div class="wFrom">${esc(m.note)}</div>`:"")
      +line);
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

  if(m.kind==="hand"){
    /* ONE CARD FOR FIVE DIFFERENT KINDS OF NUMBER WAS THE BUG.
       It drew every typed figure at 100% and told him he had looked at
       the thing in front of him, which is true of a sold page he read and
       not true of a number off the top of his head. */
    const hs=handSrc(m.src);
    const tail=" Picking a condition will not change it \u2014 the wear is already in your number.";
    if(!hs)return card("Your own figure","typed in, source not recorded",bar(64,"warn"),
      "You typed this in before the desk asked where figures come from, so it cannot say. Type it again and it will."+tail);
    if(hs.id==="gut")return card("Your own judgement","nothing looked up",bar(14,"warn"),
      "You said this one is your own read rather than anything looked up, and the desk is taking you at your word. It prices exactly as typed. Check a sold page before real money moves."+tail);
    if(hs.id==="ask")return card("An asking price","nobody paid it",bar(30,"warn"),
      "This is what somebody wanted, not what anybody got. Asks run high, so treat it as a ceiling rather than a price."+tail);
    if(hs.id==="bravo")return card("Bravo Estimator","their figure, real pawn deals",bar(88,""),
      "Read off Bravo\u2019s estimator, which works from real pawn transactions. You did not count these sales yourself, but somebody did."+tail);
    if(hs.id==="sold")return card("A sold price you read","what somebody paid",bar(84,""),
      "You read this off a sold page, so it is what the thing actually went for rather than what anybody is asking."+tail);
    return card("This shop\u2019s own sales","what we get here",bar(96,""),
      "What this shop has actually got for them. No national median beats knowing what sells in Bristol."+tail);
  }

  return "";
}
function paintPin(x){ const p=document.getElementById("pin"); if(p)p.innerHTML=pinHTML(x||calcItem()); }
function ticketHTML(x){
  const F=fakeState(fakeSheet(x));
  if(F&&F.blocks)return fakeHoldHTML(F);
  /* Same gate as the numbers strip: a loan figure is a price like any other,
     and quoting one off a half-finished run is the thing being stopped. */
  /* The numbers strip already says "No price yet - still needs the model,
     what it sells for and the condition", three inches away. This card
     said the same sentence again in different words, on every step of
     every run. Where the strip is on screen, one of them is enough. */
  if(!priceReady(x))return deskRail()?"":`<div class="card unchecked">
    <span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    <div class="cardHint" style="margin-top:0">No loan figure yet. The run still needs
      <b style="color:var(--ink)">${esc(needList(x))}</b> &mdash; each one moves the number,
      and a figure quoted without them is a guess wearing a dollar sign.</div>
  </div>`;
  /* A loan the shop would lose money owning is not a smaller loan, it is
     no loan. The desk used to print one anyway - "lend $8" beside "pay $1"
     for a wheelbarrow - so the card says the same thing the numbers strip
     says rather than quoting a figure nobody should write. */
  if(x.buyTooThin)return `<div class="card unchecked">
    <span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    <div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink)">
      <b>Walk away.</b> It resells for about ${money(x.resale)}, and clearing the
      ${money(x.buyFloor)} you want out of a deal leaves ${money(x.buy)} to offer.
      There is nothing here to lend against either \u2014 an unredeemed loan
      leaves you owning it with the same hauling and listing to do.</div>
    <div class="cardHint" style="font-size:14px;color:var(--ink-2)">If you want it anyway,
      set your own price in the run above and the desk will work from that.</div>
  </div>`;
  /* WHEN THE RAIL IS THERE, THE RAIL IS THE MONEY.
     The panel on the right already carries buy, lend, resale, cushion, fee,
     loan-to-resale, the range and the estimate warning. This card then drew
     a gauge of the same loan, three tiles of the same range, the same buy
     price and a fold to the same cushion and fee - the whole card was one
     duplicate, and it pushed everything worth reading below the fold.
     What the rail cannot say stays: a check that failed, a missing title,
     which model the price came from, and the reasoning behind the cap. */
  if(deskRail())return `<div class="card${x.checked?"":" unchecked"}">
    <span class="label">7 &middot; Pawn loan &mdash; the detail</span>
    ${(st.model||st.detail)?`<div class="cardHint" style="margin-top:0">Pricing: <b style="color:var(--ink)">${[st.model,st.detail].filter(Boolean).map(esc).join(" \u00b7 ")}</b></div>`:""}
    ${x.spec&&x.spec.stop?`<div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink)"><b>NO TITLE &mdash; NO DEAL.</b> Don't negotiate around a missing title, at any price.</div>`:""}
    ${/* The rail carries GO LOW / SUGGESTED / GO HIGH as three figures now,
          restored there after it went missing from the wide layout. This
          sentence is the same advice in prose, four inches away - the
          third copy of one idea on one screen. The rail's version is the
          one with the numbers in it, so this one goes. */""}
    ${ticketDetailHTML(x)}
  </div>${paybackHTML(x)}`;
  return `<div class="card${x.checked?"":" unchecked"}">
    <span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    ${x.checked?"":`<div class="mkNo" style="margin-bottom:6px"><b>Nothing looked up yet.</b> This is a built-in figure for a typical one, not a sale anybody made. Check the sold prices and it will change.</div>`}
    ${gauge(x.ltv/100,"Lend him",money(x.target),x.checked?"pawn loan":"estimate","gi")}
    ${(st.model||st.detail)?`<div class="cardHint" style="text-align:center;margin-top:2px">Pricing: <b style="color:var(--ink)">${[st.model,st.detail].filter(Boolean).map(esc).join(" · ")}</b></div>`:""}
    ${x.spec&&x.spec.stop?`<div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink)"><b>NO TITLE — NO DEAL.</b> Don't negotiate around a missing title, at any price.</div>`:""}
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
/* THE RATE SITS WITH THE NUMBER IT EXPLAINS.
   Putting it in the rates fold with the lending percentages would have been
   tidier and wronger: the question "why is he paying back $131" gets asked
   while looking at the $131, and an answer two cards away is not an answer. */
function pawnRateHTML(){
  const p=pawnPct();
  return `<div class="rateRow" style="margin-top:2px"><span class="label" style="margin:0">Your charge, each 30 days (%)</span>
      <input id="pawnNum" class="numIn rateNum" type="number" inputmode="numeric" min="0" max="${PAWN_CAP}" step="1" value="${p}"></div>
    <input type="range" min="0" max="${PAWN_CAP}" step="1" value="${p}" id="pawnSlider">
    <div class="sliderScale"><span>0% — no charge</span><span>${PAWN_CAP}% — the legal ceiling</span></div>
    ${p>=PAWN_CAP?`<div class="tagWarn" style="margin-top:9px"><b>${PAWN_CAP}% is the ceiling &sect; 539.001(11) allows.</b> ${money(100)} lent comes back as ${money(125)} by day 30. This is the shop’s rate, set here on purpose — and there is no room above it: overcharging voids the transaction and forfeits twice the charge.</div>`:""}`;
}
function paybackHTML(x){
  return `<details class="card foldCard"${st.openPayback?" open":""} id="paybackFold">
    <summary><span class="label" style="margin:0">8 &middot; After the money moves</span><span class="foldSub">what it costs him to get it back, and the day it becomes ours</span></summary>
    ${pawnRateHTML()}
    ${/* THE SCHEDULE WAS FOR A LOAN HE MIGHT NOT BE MAKING.
          "i think there should be some way to see the interest schedule
          based on the pawn amount." There already was one - this ladder -
          and it was built off x.target, the SUGGESTED figure, no matter
          what he had typed into Lent. So a counter writing a $45 ticket
          read a schedule for $30: $37 by day 30 against the $56 he would
          actually be collecting. The rail's day-60 row had the same fault.
          Both now read the amount that is going on the ticket, and the
          heading says which amount that is, because a schedule with no
          principal named is the thing that caused this. */""}
    <span class="label" style="margin-bottom:0;margin-top:14px;color:var(--ink-2)">To get it back &mdash; on ${money(payAmt(x).amt)}${payAmt(x).typed?" (what you typed)":" (the suggested loan)"}</span>
    <div class="ladder" id="payLadder">${ladder(payAmt(x).amt,payAmt(x).charge).map(r=>`<div class="widget rung"><div class="k">${r.k}</div><div class="d">${money(r.due)}</div></div>`).join("")}</div>
    <div style="font-size:12px;line-height:1.5;color:var(--ink-2);margin-top:9px">
      ${/* "this by statute?" Asked of the sentence that used to sit here,
            and worth asking: three of its four clauses were statute and the
            fourth was wrong in the direction that costs money.

            Read against the text of s. 539.001(11), which the counter can
            check for himself:

            (11)(c) "The total amount of pawn service charges that a
            pawnbroker may collect in the case of redemptions occurring at
            any time more than 30 days after the date of the pawn is TWICE
            the amount provided in paragraph (a), except that, for
            redemptions occurring more than 60 days after the date of the
            pawn, pawn service charges CONTINUE TO ACCRUE from and after the
            60th day at the daily rate determined as provided in paragraph
            (b)."

            (11)(b) "...the daily pawn service charge ... shall be equal to
            the pawn service charge for the original 30-day period divided
            by 30 days."

            So the twice-the-amount cap is statute. The daily rate after day
            60 is statute, and it is this card's own charge/30, which is
            what (b) prescribes. The day-90 rung - principal plus twice plus
            thirty days of daily - is (c) carried out, not an invention.

            WHAT WAS WRONG was the last clause: "late redemption is a
            courtesy you price with this rate." It read as though the shop
            sets that price. It does not. (11)(c) FIXES the rate for a
            redemption after day 60, and (11)(e) makes anything above the
            authorised amount "prohibited, may not be collected, and render
            the pawn transaction voidable", forfeiting twice the service
            charge. Calling a statutory ceiling a courtesy is the sentence
            most likely to walk a counter straight into that penalty, and it
            was in the one place that explains the arithmetic.

            AND "NOT 25% AGAIN EVERY MONTH" was only true to day 60. After
            it, one-thirtieth a day IS 25% a month, carrying on. */""}
      Through day 60 the charge stops at <b style="color:var(--ink)">twice</b> the 30-day amount &mdash; it does not take another ${pawnPct()}% at day 31. After that, <b style="color:var(--ink)">$${(payAmt(x).charge/30).toFixed(2)}/day</b>. ${infoBtn("pawn-charge")}
    </div>
    ${/* "get rid of these extemrly long and wordy explanations. maybe an
          info button that we can hover over and get more detail." The
          headline is the half he needs at a counter. The four clauses
          explaining it are the half he reads once and then knows. */""}
    <div class="tagWarn"><b>Day 60 it&rsquo;s ours.</b> Title passes automatically. ${infoBtn("pawn-clock")}</div>
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
  {re:/cellular/i,mult:.6,note:"cellular: −40% — priced with no plan on it, because the plan leaves with the customer"}],
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
/* Same fault on a shotgun: the gauge was asked and never reached the
   search. gunQuery's comment said the gauge "only blurs it" on GunWatcher,
   which was a judgement made from here and never tested against the site -
   and the counter is now asking for the opposite. It goes in; the query
   box on the card shows exactly what the buttons will search for, so it is
   one glance to see whether it helped. */
const CH_GAUGE={label:"Gauge",options:[
  {t:"12 ga",q:"12 gauge",m:1},{t:"20 ga",q:"20 gauge",m:1},
  {t:"16 ga",q:"16 gauge",m:.85,note:"16 gauge — ammo scarce: −15%, and slower"},
  {t:"28 ga",q:"28 gauge",m:1.3,note:"28 gauge — boutique: +30%, fewer buyers — consider Slow"},
  {t:".410",q:"410",m:1.1,note:".410 — popular little bore: +10%"}]};
const CH_BARREL={label:"Barrel",options:[
  {t:"Field length (24–28 in)",m:1},
  {t:"Short / home-defense (18–20 in)",m:1.05,note:"defense length: +5%"},
  {t:"Extra-long (30 in +)",m:.9,note:"long target barrel — fewer local buyers: −10%"}]};
/* THE CALIBER WAS A PRICE BAND AND THE SEARCH NEEDED AN IDENTITY.
   "i think guns should have a specific claiber selection so that when i
   clck the gunwatcher or gunbbroker search button, it gives me more
   accurate data."

   The question asked was Common / Desirable / Oddball. Those are the right
   three buckets for the MULTIPLIER and they are useless to a search: you
   cannot look up "Common" on GunBroker. So the caliber was being asked,
   and then thrown away before the buttons were built - his query box read
   "Browning Semi-auto rifle" with the caliber he had just supplied nowhere
   in it. On a rifle that is most of the identity. A BAR in .30-06 and a
   BAR in .338 are different guns at different money.

   Each option now carries both jobs: q is what goes in the search, m is
   the band it falls in.

   NO NEW PRICE CLAIMS. The multipliers are the three shipped bands, 1.0 /
   1.08 / 0.85, re-expressed per caliber - not a new set of numbers. The
   only two calibers named as desirable are the two the old option itself
   named, 10mm and .45-70; everything listed sits at 1.0, which is where
   the default "Common" already put them, and "not on this list" takes the
   oddball 0.85 the old option gave it. So no gun changes price because of
   this, and a caliber that ought to move bands moves on a counter report,
   not on my guess.

   FIRST OPTION IS "NOT SAID", NEUTRAL, AND CARRIES NO q. specBase picks
   the first m===1 option as the fallback, so without this the first real
   caliber would become a silent default and every unanswered rifle would
   be searched as something nobody said it was. */
const CAL_NOT={t:"Not said",m:1};
const CH_CALIBER={label:"Caliber",options:[CAL_NOT,
  {t:".223 / 5.56",q:"223",m:1},{t:".22-250",q:"22-250",m:1},
  {t:".243",q:"243",m:1},{t:".270",q:"270",m:1},
  {t:".308 / 7.62",q:"308",m:1},{t:".30-06",q:"30-06",m:1},
  {t:"6.5 Creedmoor",q:"6.5 Creedmoor",m:1},
  {t:"7mm Rem Mag",q:"7mm Rem Mag",m:1},
  {t:".300 Win Mag",q:"300 Win Mag",m:1},
  {t:".350 Legend",q:"350 Legend",m:1},
  {t:".45-70",q:"45-70",m:1.08,note:"desirable caliber: +8%"},
  {t:"Not on this list",m:.85,note:"oddball caliber — fewer local buyers: −15%, consider Slow"}]};
/* A lever gun takes a different set entirely, and offering a .270 on a
   Marlin 336 is the bar-length-on-a-weedeater fault again. */
const CH_CAL_LEVER={label:"Caliber",options:[CAL_NOT,
  {t:".30-30",q:"30-30",m:1},{t:".45-70",q:"45-70",m:1.08,note:"desirable caliber: +8%"},
  {t:".357 Mag",q:"357 Magnum",m:1},{t:".44 Mag",q:"44 Magnum",m:1},
  {t:".22 LR",q:"22 LR",m:1},{t:".450 Bushmaster",q:"450 Bushmaster",m:1},
  {t:"Not on this list",m:.85,note:"oddball caliber — fewer local buyers: −15%, consider Slow"}]};
const CH_CAL_AR={label:"Caliber",options:[CAL_NOT,
  {t:"5.56 / .223",q:"5.56",m:1},{t:".300 Blackout",q:"300 Blackout",m:1},
  {t:"7.62x39",q:"7.62x39",m:1},{t:".308 / 7.62 NATO",q:"308",m:1},
  {t:"6.5 Grendel",q:"6.5 Grendel",m:1},{t:".22 LR",q:"22 LR",m:1},
  {t:"Not on this list",m:.85,note:"oddball caliber — fewer local buyers: −15%, consider Slow"}]};
const CH_CAL_PISTOL={label:"Caliber",options:[CAL_NOT,
  {t:"9mm",q:"9mm",m:1},{t:".380 ACP",q:"380 ACP",m:1},
  {t:".40 S&W",q:"40 S&W",m:1},{t:".45 ACP",q:"45 ACP",m:1},
  {t:".22 LR",q:"22 LR",m:1},
  {t:"10mm",q:"10mm",m:1.08,note:"desirable caliber: +8%"},
  {t:"Not on this list",m:.85,note:"oddball caliber — fewer local buyers: −15%, consider Slow"}]};
const CH_CAL_REVOLVER={label:"Caliber",options:[CAL_NOT,
  {t:".38 Special",q:"38 Special",m:1},{t:".357 Magnum",q:"357 Magnum",m:1},
  {t:".22 LR",q:"22 LR",m:1},{t:".44 Magnum",q:"44 Magnum",m:1},
  {t:".45 Colt",q:"45 Colt",m:1},{t:".327 Federal",q:"327 Federal",m:1},
  {t:"Not on this list",m:.85,note:"oddball caliber — fewer local buyers: −15%, consider Slow"}]};
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
  {t:"Battery — bare, no battery",q:"tool only",m:.4,note:"bare battery tool: −60%"},
  {t:"Corded electric",m:.5,note:"corded: about half"}]};
const CH_AGE={label:"Age",options:[
  {t:"Under 3 yr",m:1},
  {t:"3–6 yr",m:.6,note:"3-6 years old: −40%"},
  {t:"6 yr +",m:.4,note:"aged electronics — accessory money"}]};
/* DOES IT RUN? The aisle's killer line has always said "Won't start. Then
   it's parts, not a tool" - and the run never asked. An outside reviewer
   pointed at the same gap from the other side: a gas engine that starts
   today often will not after sitting sixty days with pump gas in the
   carburettor, which is exactly the hold a pawn loan puts it through.

   I have not encoded a figure for how often that happens - I have no
   measurement of it and would not put somebody else's statistic in the
   arithmetic. What IS certain is that a small engine which will not start
   sells for parts, and the desk should ask rather than assume. The 0.35 is
   a shop judgement, not a measurement, and it says so on the option.

   Pull the cord before you price it; drain the tank before you shelve it. */
const CH_RUNS={label:"Does it start?",options:[
  {t:"Starts and runs",m:1},
  /* .4 and not the .35 first written: spec.mult is clamped to a floor of
     .4 in calcItem, so .35 would have printed "about a third" on the card
     while the arithmetic did 40%. The number shown has to be the number
     used. */
  {t:"Won't start, or didn't try",m:.4,
   note:"not proven to run \u2014 priced as parts, 40% of a running one. A shop judgement, not a measured figure",
   q:"for parts not working"}]};
const CH_GRADE={label:"Grade",options:[
  {t:"Homeowner",m:1},
  {t:"Farm / ranch",m:1.1,note:"farm grade: +10%"},
  {t:"Pro / commercial",m:1.25,note:"pro grade: +25%"}]};
/* CONSOLES ARE FOUR MARKETS AND THE DESK HAD ONE ROW.
   Measured 29 Sep off PriceCharting loose prices, which are completed eBay
   sales and not asks. Cross-checked against Racketboy's hardware guide,
   which is an enthusiast reference built the other way round - by hand,
   from what the community sees - and the two agree: Racketboy puts a loose
   NES at $50-$160 and PriceCharting's figure is $94, SNES $50-$225 against
   $110, Genesis $40-$160 against $75. PriceCharting sits mid-range of the
   community guide every time. That is the second source the gun data had
   and the console data did not.

   THE LINE IS ROUGHLY 2001, and it is the media rather than nostalgia.
   Cartridge and early-optical machines stopped being manufactured and the
   things that play those games are finite; a PS4 is not finite. Pre-2001
   has stopped falling and started rising (retro up about 15% year on year
   across two sources). Post-2001 is a used appliance still on the way down.

   The aisle's own completeness toggle is 0.90, and that figure is right -
   for the machines it was measured on. It came off four CURRENT-GEN
   consoles listed "console only" against ones with a controller: 0.92,
   0.94, 0.89, 0.88. A tenth off. Retro does not behave like that, so these
   groups carry covers:"complete" and take the question over. */

/* WHAT CAME WITH IT. Two independent routes to the same number, neither of
   them a direct measurement of the pair:

     Racketboy's own bands   loose LOW is "console only, no packaging,
                             minimal accessories" and loose HIGH is "a
                             controller or two, power and video cables,
                             excellent cosmetic". NES $50 against a $94
                             mid is 0.53.
     Built up from parts     PriceCharting loose for a console INCLUDES
                             cables and one controller. An official N64
                             controller is $19 loose and the cables about
                             $12, so a bare N64 is 90-19-12 = $59 on a $90
                             console: 0.66.

   0.53 and 0.66, arrived at from opposite directions, so 0.6 sits between
   them. NOT 3x, which is what Racketboy's full loose spread looks like at
   a glance - that spread also contains cosmetic condition, and the run
   asks about condition separately. Pricing the scratches here and again on
   the condition card is the double-charge this codebase has shipped before.

   The +10% for extras is the weakest number on the group and says so: it
   is the controller's own $19 against a $90 console, not a measured pair.
   The current-gen harvest found extras worth NOTHING (1.03x, 0.95x, 1.04x)
   - but that was on machines where a controller is a twentieth of the
   price rather than a fifth. Recheck it when there are retro pairs to
   measure. */
const CH_CONSOLE_KIT={label:"What came with it",covers:"complete",options:[
  {t:"Console, a controller and all the cables",m:1},
  {t:"Console and cables — no controller",m:.8,note:"no controller: −20%"},
  {t:"Console alone — no cables, no controller",q:"console only",m:.6,
   note:"bare console: −40%. Two sources, 0.53 and 0.66, meeting in the middle"},
  {t:"Two or more controllers, memory card, extras",m:1.1,
   note:"extras: +10% — built from the controller's own price, not a measured pair"}]};

/* BOX AND PAPERS, RETRO. Measured loose -> CIB, same source, same day:

     SNES     $110 -> $390   3.5x        Xbox     $95 -> $223   2.3x
     N64       $90 -> $308   3.4x        GameCube $92 -> $192   2.1x
     Saturn   $180 -> $575   3.2x        Dreamcast $162 -> $232 1.4x
     Game Boy  $66 -> $201   3.0x        PS1       $60 ->  $75  1.3x
     NES       $94 -> $268   2.8x
     PS2      $105 -> $271   2.6x        median about 2.8x

   PS1 and Dreamcast are the exceptions and both make sense: PS1s are
   everywhere, and a Dreamcast box is cardboard that mostly did not
   survive being a 1999 toy.

   THE +60% IS NOT THE 2.8x, ON PURPOSE. spec.mult is clamped to 1.8 in
   calcItem, and a genuine CIB machine is exactly the case where a book row
   should stand aside rather than guess - "complete in box" covers a beaten
   box with no manual and a mint one with the inner tray, and those are not
   the same item. The multiplier is a floor and the note says to look it up.
   Printing 2.8 while the arithmetic did 1.8 is the bug this file has been
   burned by before: the number shown has to be the number used. */
const CH_CONSOLE_BOX={label:"Box and papers",covers:"box",options:[
  {t:"No box — the machine on its own",m:1},
  {t:"Box, but rough or missing the inserts",m:1.25,note:"box only: +25%"},
  {t:"Complete in box — manuals, inserts, clean",m:1.6,
   note:"CIB: +60% here, but measured loose→CIB is about 2.8x. If it really is complete, look it up — this is a floor"},
  {t:"Sealed, never opened",m:1.6,
   note:"SEALED IS NOT A BOOK ITEM. Measured 10x to 45x a loose one, on two or three sales a YEAR. The +60% is a floor, not a price — look it up before you lend"}]};

/* THE SAME QUESTION FOR THE 2005-2012 MACHINES, WHERE THE BOX IS WORTH
   FAR LESS. Measured loose -> CIB: Xbox One 1.13x, 360 Slim 1.16x, PS3
   160GB 1.31x, PS4 1.30x, Wii U 1.74x. Median 1.30, and 1.25 is taken
   rather than the median because the Wii U row is thin and the white-Wii
   row on the same page reads 4.1x, which is not credible for a machine
   that sold a hundred million units and is the kind of figure that means
   somebody listed a bundle. */
const CH_CONSOLE_BOX_LATE={label:"Box and papers",covers:"box",options:[
  {t:"No box",m:1},
  {t:"Boxed, with the papers",m:1.25,note:"boxed: +25%"}]};

/* IS IT A SPECIAL EDITION - AND WHY THIS GROUP MOVES NO MONEY.
   The variant is worth more than the machine once you are in the collector
   band, and it is a spec you cannot see from across a counter. Measured,
   all loose, all the same day:

     N64 standard        $90      PS3 160GB            $75
     N64 Funtastic  $157-$245     PS3 80GB backward-compatible  $206
     N64 Gold           $236      PS3 60GB backward-compatible  $330
     N64 Pikachu        $390      Wii white $50 against Wii blue $121

   That is 1.7x to 4.4x on the same shelf. EVERY OPTION HERE IS 1.0 AND
   THAT IS THE POINT. A single multiplier inside a 1.8 clamp would be
   wrong at both ends - it would under-price a Pikachu by half and
   over-price an ordinary blue Wii - and a special edition is precisely
   the case where the book should send the counter to a lookup instead of
   answering. What the question buys is the prompt and a better search:
   the answer goes into the query, so the sold-price search asks about the
   machine in front of them rather than a generic one. */
/* A HANDHELD HAS NO CONTROLLER AND NO CABLES, so it must not be asked
   about them. This is the weedeater fault reported from the counter -
   "i clciked the outdoor power tools button it went straight to bar
   lenght. what if it was a weedeater or a blower?" - and it would have
   shipped again here: CH_CONSOLE_KIT opens with "Console, a controller and
   all the cables", which is nonsense held in one hand.

   What actually moves a handheld, in the order the counter can see it:

     CHARGER. Proprietary on every one of these and long out of
     production. A DS Lite charger does not fit a DSi, which does not fit
     a 3DS. Treated as a fifth of the machine - the same shape as the bare
     drill finding, where the missing part is the part nobody has spare.
     A judgement, anchored on chargers running $10-15 against a $60
     handheld, not a measured pair.
     BATTERY COVER AND STYLUS. Famously gone, individually cheap. A tenth.
     BATTERY CORROSION. Not a discount, a different item. A Game Boy that
     sat thirty years with cells in it has green crust on the terminals,
     and it spreads to the board - flagged as the thing that decides
     whether this is a machine or a parts donor. */
const CH_HANDHELD_KIT={label:"What came with it",covers:"complete",options:[
  {t:"All there — charger, cover, stylus if it takes one",m:1},
  {t:"No charger",m:.8,note:"no charger: −20%. These are proprietary and out of production"},
  {t:"Missing the battery cover or stylus",m:.9,note:"small bits missing: −10%"},
  {t:"No charger AND bits missing",m:.7,note:"both: −30%"},
  {t:"Corroded battery compartment",q:"for parts not working",m:.4,
   note:"GREEN CRUST IS NOT WEAR. It spreads to the board — price it as a parts donor until it powers on and holds a charge"}]};
const CH_CONSOLE_VARIANT={label:"Plain one, or special?",options:[
  {t:"Plain — standard colour, standard model",m:1},
  {t:"Special colour, limited run, or a bundle",m:1,q:"limited edition",
   note:"LOOK THIS ONE UP. Measured 1.7x to 4.4x over the plain machine — far too wide for the book to guess, and no multiplier is applied here"},
  {t:"Not sure",m:1,
   note:"If the colour is anything but the standard one, or the label says a game's name, treat it as special and look it up"}]};
/* THE SAME MISSING BATTERY, PRICED TWICE.
   Caught by an outside review and confirmed with numbers. A cordless drill
   is asked "what came with it" - tool only is .52, because a bare tool IS
   about half a kit - and then the aisle asks "is it all there? battery,
   charger, case", which takes another 30% for the battery that the first
   answer already said was missing. A $123 kit came out at $45 instead of
   $64, and the loan is a share of that.

   Where a spec group already asks the question, the aisle's must not ask it
   again. The group says so itself rather than this being matched on its
   label, so a renamed group cannot quietly turn the double-count back on. */
function specCoversComplete(id){
  return (SPEC_CHOICES[id||st.itemId]||[]).some(g=>g&&g.covers==="complete");
}
/* THE SAME BOX, PRICED TWICE. Reported off the counter screen with a Sega
   Saturn on it: "These two questions seem to have overlap." They do, and
   it is the same shape as the missing battery above - "What shape is it
   in?" offers New in box at +30%, and then "Box and papers?" offers
   Complete in box at +60% and Sealed at +60%. Both are true of one sealed
   console, the counter answers both honestly, and the box is charged
   twice: 1.3 x 1.6 = 2.08.

   MEASURED on the Saturn's own book row, $175 loose:

     Good, no box                              $175
     Good, complete in box                     $280
     New in box, box question left alone       $228
     New in box AND complete in box            $364   <- one box, twice

   It was latent until yesterday, when spec.mult started reaching measured
   prices. Before that the box question was discarded on any item with a
   book row, so the overlap could not fire - which is a reminder that
   fixing one thing can arm another.

   So where the specs price the box, the condition question stops doing
   it: New in box comes out of the list and Excellent is the top of it.
   Condition is wear; the box is the box. */
function specCoversBox(id){
  return (SPEC_CHOICES[id||st.itemId]||[]).some(g=>g&&g.covers==="box");
}
/* The list the counter is actually offered. Everywhere CONDITIONS is shown
   it goes through this, so the desk, the phone and the one-question run
   cannot drift apart on it. */
function condList(id){
  return specCoversBox(id)?CONDITIONS.filter(c=>c.id!=="new"):CONDITIONS;
}
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
 /* The retro bands get all three questions. The 2005-2012 band gets the
    kit question and the lighter box question but NOT the variant one: its
    special editions exist (a blue Wii, a backward-compatible PS3) and are
    worth real money, so the variant question is on it too - the PS3 60GB
    is a 4.4x on a shelf full of 1.0x machines and is the single most
    expensive thing in this aisle to miss.

    Last gen gets the kit question only. A boxed PS4 is 1.30x and that is
    inside the noise of what condition already does; there is no collector
    variant market for a machine still being sold second-hand by the
    thousand. */
 e5a:[CH_CONSOLE_KIT],
 e5b:[CH_CONSOLE_KIT,CH_CONSOLE_BOX_LATE,CH_CONSOLE_VARIANT],
 e5c:[CH_CONSOLE_KIT,CH_CONSOLE_BOX,CH_CONSOLE_VARIANT],
 e5d:[CH_HANDHELD_KIT,CH_CONSOLE_BOX,CH_CONSOLE_VARIANT],
 g1:[CH_GAUGE,CH_BARREL],g2:[CH_GAUGE,CH_BARREL],
 g3:[CH_CALIBER,CH_OPTIC],g4:[CH_CAL_LEVER,CH_OPTIC],
 g5:[CH_CAL_AR,{label:"Build",options:[{t:"Basic / irons",m:1},{t:"Optic + real upgrades",m:1.15,note:"upgraded build: +15%"}]}],
 g6:[{label:"Action",options:[{t:"Semi-auto (10/22 class)",m:1},{t:"Bolt / single-shot",m:.85,note:"bolt/single .22s sell slower: −15%"}]},CH_OPTIC],
 g7:[CH_CAL_PISTOL,{label:"Size",options:[{t:"Full / compact",m:1},{t:"Pocket (.25/.380 junk-class)",m:.8,note:"pocket-class: −20%"}]}],
 g8:[CH_CAL_REVOLVER,{label:"Barrel",options:[{t:"3–6 in",m:1},{t:"Snub 2 in",m:1},{t:"7 in + hunter",m:.9,note:"long hunter barrel — narrower market: −10%"}]}],
 g9:[{label:"Type",options:[{t:"In-line (modern)",m:1},{t:"Sidelock / traditional",m:.8,note:"traditional — thin buyer pool: −20%"}]},CH_OPTIC],
 g10:[CH_CALIBER,CH_OPTIC],
 p1:[CH_RUNS,{label:"Bar length",options:[{t:"Under 16 in",m:.85,note:"short bar — homeowner saw: −15%"},{t:"16–18 in",m:1},{t:"19 in +",m:1.15,note:"pro-length bar: +15%, slower buyer"}]},CH_GRADE],
 p2:[CH_RUNS,CH_PWR,CH_GRADE],p3:[CH_RUNS,CH_PWR,CH_GRADE],
 /* No "battery mower, no battery" option, and that is deliberate. eBay
    cannot price a mower at all: 0 of 10 push mowers in the harvest came
    back usable, and the share gate marked four of them local-only outright
    - a Honda HRX217 returned 4 real machines out of 39 listings, the rest
    spindles and deck belts. Measuring bare against with-battery on that
    data gave bare as DEARER, 1.25x, which is the pooled-mix trap and not a
    market. A mower without its battery is a real thing that walks in; it is
    just not a thing eBay can put a number on. Price it off the shelf record
    and your own sales, and do not invent a multiplier here. */
 p4:[CH_RUNS,{label:"Drive",options:[{t:"Gas push",m:1},{t:"Self-propelled",m:1.15,note:"self-propelled: +15%"},{t:"Battery — with battery",m:.9,note:"battery mower: −10%"},{t:"Corded electric",m:.5,note:"corded: about half"}]},
     {label:"Deck",options:[{t:"Standard 20–22 in",m:1},{t:"Wide-area 26 in +",m:1.2,note:"wide-area: +20%"}]}],
 p5:[{label:"Deck",options:[{t:"Under 42 in",m:.85,note:"small deck: −15%"},{t:"42–45 in",m:1},{t:"46 in +",m:1.15,note:"bigger deck: +15%"}]},
     {label:"Hours",options:[{t:"Under 300",m:1},{t:"300–800",m:.85,note:"mid-life hours: −15%"},{t:"High / unknown",m:.7,note:"high or unknown hours: −30%"}]}],
 p6:[CH_RUNS,{label:"Power",options:[{t:"Gas",m:1},{t:"Electric",m:.6,note:"electric washer: −40%"}]},
     {label:"Pressure",options:[{t:"Under 2,500 PSI",m:.8,note:"light duty: −20%"},{t:"2,500–3,200 PSI",m:1},{t:"3,200 PSI +",m:1.2,note:"commercial PSI: +20%"}]}],
 p7:[CH_RUNS,{label:"Type",options:[{t:"Open-frame",m:1},{t:"Inverter",m:1.6,note:"inverter — ~60% over open-frame at the same watts"}]},
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
 t1:[CH_VOLT,{label:"What came with it",covers:"complete",options:[
   {t:"Two batteries + charger",m:1},
   {t:"One battery + charger",m:.87,note:"one battery: −13%"},
   {t:"Tool only — no battery",q:"tool only",m:.52,note:"bare tool: about half a kit"},
   {t:"Combo — a second tool with it",q:"combo kit",m:1.64,note:"two tools, not one: +64%"}]}],
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
  {label:"What came with it",covers:"complete",options:[
    {t:"Battery + charger",m:1},
    {t:"Tool only — no battery",q:"tool only",m:.55,note:"bare tool: about half"}]}],
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
 t3:[{label:"Power",options:[{t:"Corded",m:1},{t:"Cordless — with battery",m:2.4,note:"cordless with a battery — a different tool: about 2.4x the corded one"},{t:"Cordless — bare",q:"tool only",m:1.35,note:"bare cordless — the battery was most of it, but still over a corded unit"}]},
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
 t8:[{label:"Drive",options:[{t:"Pneumatic",m:1},{t:"Cordless — with battery",m:2,note:"cordless with a battery — roughly twice a pneumatic"},{t:"Cordless — bare",q:"tool only",m:1.8,note:"bare cordless — no battery or charger, about a tenth under the kit"}]}],
 h1:[{label:"Type",options:[{t:"Standard 3-9x class",m:1},{t:"High-mag 4-16x+",m:1.1,note:"high-mag glass: +10%"},{t:"Fixed / oddball",m:.85,note:"odd configuration: −15%"}]},
     {label:"Features",options:[{t:"Standard",m:1},{t:"Illuminated / FFP",m:1.1,note:"premium features: +10%"}]}],
 h2:[{label:"Size",options:[{t:"Full-size (8/10x42)",m:1},{t:"Compact",m:.8,note:"compacts: −20%"}]}],
 h3:[{label:"Type",options:[{t:"Hunting (600–1000 yd)",m:1},{t:"Golf model",m:.85,note:"golf unit — wrong buyer here: −15%"}]}],
 /* A LIVE PLAN IS THE CUSTOMER'S, NOT OURS.
    This asked whether the cam was on a current plan and paid +25% when it
    was. Jace, 26 Sep: "someone else's live plan is of no use to me. All
    cellular devices need to be assumed no active plan."
    Exactly right, and the old option was worse than useless - it was a
    trap. The plan sits on the previous owner's account and their card. It
    is not transferable, it stops the day they stop paying, and on a pawn
    it stops the day they decide not to come back. So the one state that
    matters for a loan is the state it will be in when it becomes ours:
    no plan, needing one activated before it sends a picture.
    One cellular option now, priced where the dead-plan one was. */
 h4:[{label:"Type",options:[{t:"SD card",m:1},{t:"Cellular",m:.6,note:"assume no plan — SD-card money: −40%"}]}],
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
 /* WHAT MOVES A HORN IS WHETHER IT PLAYS. A trumpet with a stuck valve or
    a clarinet with rotted pads is a repair bill with a case around it, and
    the repair costs more than the horn is worth at this end of the market.
    That is the one question worth asking on every band instrument, and it
    is the biggest multiplier in this aisle. */
 m4:[{label:"Orientation",options:[{t:"Right-handed",m:1},{t:"Left-handed",m:.8,note:"lefty — tiny buyer pool: −20%"}]},
     {label:"Strings",options:[{t:"4-string",m:1},{t:"5-string",m:.9,note:"5-string — narrower buyer pool here: −10%"}]}],
 m5:[{label:"Keys",options:[{t:"61 keys",m:1},{t:"76 keys",m:1.2,note:"76 keys: +20%"},{t:"88 weighted / digital piano",m:1.6,note:"weighted 88 is a different instrument: +60%"}]},
     {label:"What came with it",covers:"complete",options:[{t:"Stand, pedal and power supply",m:1},{t:"Power supply only",m:.85,note:"no stand or pedal: −15%"},{t:"No power supply",m:.6,note:"no supply — often a proprietary brick: −40%"}]}],
 m6:[{label:"What came with it",covers:"complete",options:[{t:"Shells, hardware and cymbals",m:1},{t:"Shells and hardware, no cymbals",m:.7,note:"cymbals are half a kit's value: −30%"},{t:"Shells only",m:.5,note:"shells alone — no stands, no pedal: −50%"}]},
     {label:"Kind",options:[{t:"Acoustic kit",m:1},{t:"Electronic kit",m:1.3,note:"electronic kits sell faster and dearer: +30%"}]}],
 m7:[{label:"Which one",options:[{t:"Alto",m:1},{t:"Tenor",m:1.3,note:"tenor over alto: +30%"},{t:"Soprano",m:.9,note:"soprano — thinner market: −10%"},{t:"Baritone",m:2,note:"bari is a different animal: 2x, and look it up"}]},
     {label:"Does it play?",options:[{t:"Plays — pads seal, keys move",m:1},{t:"Sticky keys or torn pads",m:.45,note:"a pad job is $150–300 — more than most of these are worth: −55%"},{t:"Not tried",m:.75,note:"untried horn: price it as a maybe, −25%"}]}],
 m8:[{label:"Which one",options:[{t:"Clarinet or flute",m:1},{t:"Trumpet or cornet",m:1.1,note:"trumpet: +10%"},{t:"Trombone",m:1.2,note:"trombone: +20%"},{t:"Violin for school band",m:.9,note:"school fiddle: −10%"}]},
     {label:"Does it play?",options:[{t:"Plays — pads seal, valves move",m:1},{t:"Stuck valves, torn pads, bent keys",m:.45,note:"the repair costs more than the horn: −55%"},{t:"Not tried",m:.75,note:"untried: price it as a maybe, −25%"}]}],
 m9:[{label:"Size",options:[{t:"Full size (4/4)",m:1},{t:"Fractional (3/4, 1/2, 1/4)",m:.75,note:"a child outgrows it — narrow resale: −25%"}]},
     {label:"What came with it",covers:"complete",options:[{t:"Case and bow",m:1},{t:"No bow",m:.7,note:"a bow is a third of a student fiddle: −30%"},{t:"No case",m:.85,note:"no case: −15%"}]}],
 m10:[{label:"Powered?",options:[{t:"Powered (amp built in)",m:1},{t:"Passive — needs an amp",m:.55,note:"a passive cab needs gear nobody brings: −45%"}]},
      {label:"Pair or one",options:[{t:"One speaker",m:1},{t:"Matched pair",m:2.1,note:"a pair sells for more than two singles: 2.1x"}]}],
 m11:[{label:"Which one",options:[{t:"Banjo",m:1},{t:"Mandolin",m:.8,note:"mandolin — smaller market here: −20%"}]},
      {label:"Build",options:[{t:"Resonator (closed back)",m:1},{t:"Open back",m:.8,note:"open back — clawhammer players only: −20%"}]}],
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
 /* THE AISLE'S OWN LINES ARE GUITAR LINES. "Cracked neck, warped top" is
    the right killer for the three rows that were here before and says
    nothing to a man holding a trumpet; "Fender / Gibson / Martin" is not
    the tier list for a drum kit. Each new row says its own. */
 m4:{driver:"Brand, then whether it plays. A bass is a slower sell than a guitar \u2014 fewer players, and they already own one.",
     killer:"Dead electronics or a twisted neck. A setup is cheap; a neck is not.",
     tiers:{hi:"Fender / Music Man / Rickenbacker",mid:"Squier / Ibanez / Yamaha / Sterling",lo:"Glarry / no name"},
     brands:{hi:["Fender","Music Man","Rickenbacker","Warwick","Spector"],mid:["Squier","Ibanez","Yamaha","Sterling","Schecter","ESP","LTD","Peavey"],lo:["Glarry","Donner","Best Choice","Rogue","First Act"]}},
 m5:{driver:"Key count and whether the keys are weighted. An 88-key weighted board is a different instrument from a 61-key toy.",
     killer:"Dead keys, or no power supply and a proprietary plug \u2014 the brick can cost more than the board.",
     tiers:{hi:"Roland / Nord / Kawai / Korg",mid:"Yamaha / Casio / Alesis / Akai",lo:"RockJam / no name"},
     brands:{hi:["Roland","Nord","Kawai","Korg","Kurzweil"],mid:["Yamaha","Casio","Alesis","Akai","M-Audio","Novation","Arturia"],lo:["RockJam","Donner","Best Choice","Costzon"]},
     detail:{ph:"key count and make \u2014 88 weighted, Yamaha P-45",hint:"Count the keys and press a few at each end. Dead keys at the ends are the common fault."}},
 m6:{driver:"Whether the cymbals and hardware came with it. Shells alone are half a kit.",
     killer:"Cracked cymbals or missing a kick pedal and stands \u2014 the parts cost more than the kit.",
     tiers:{hi:"DW / Ludwig / Gretsch / Tama Star",mid:"Pearl / Tama / Mapex / PDP / Yamaha",lo:"Mendini / no name"},
     brands:{hi:["DW","Ludwig","Gretsch","Sonor"],mid:["Pearl","Tama","Mapex","PDP","Yamaha","Alesis","Roland"],lo:["Mendini","Best Choice","Ashthorpe","no name"]},
     detail:{ph:"make and what is in it \u2014 Pearl Export, 5 piece, cymbals",hint:"Count the drums, then look for stands, a kick pedal and a throne. Cymbals are half the money."}},
 m7:{driver:"Alto or tenor, and whether it plays. A pad job is $150\u2013300 and the horn is often not worth it.",
     killer:"Torn pads, stuck keys, a dented neck. Repair outruns the value on anything but a Selmer.",
     tiers:{hi:"Selmer Paris / Yanagisawa / Yamaha pro",mid:"Yamaha student / Jupiter / Conn-Selmer / Bundy",lo:"Mendini / Glory / Cecilio"},
     brands:{hi:["Selmer Paris","Yanagisawa","Keilwerth"],mid:["Yamaha","Jupiter","Conn-Selmer","Bundy","Selmer","Conn","King","Buescher"],lo:["Mendini","Glory","Cecilio","Eastar","no name"]},
     detail:{ph:"make and which horn \u2014 Yamaha YAS-23 alto",hint:"Press the keys and watch the pads seal. Blow it if he will let you \u2014 a horn that will not play is a repair bill in a case."}},
 m8:{driver:"Which instrument, and whether it plays. School horns come back every June and most of them need pads.",
     killer:"Stuck valves, rotted pads, a bent key rod. The repair is more than the horn.",
     tiers:{hi:"Bach / Conn / King / Yamaha",mid:"Jupiter / Bundy / Selmer student / Gemeinhardt",lo:"Mendini / Glory / Eastar"},
     brands:{hi:["Bach","Conn","King","Yamaha","Buffet","Gemeinhardt"],mid:["Jupiter","Bundy","Selmer","Armstrong","Blessing","Olds"],lo:["Mendini","Glory","Eastar","Cecilio","Hawk","no name"]},
     detail:{ph:"make and which instrument \u2014 Yamaha YCL-255 clarinet",hint:"Work the valves or the keys and look at the pads. A rental-return that will not play is worth the case it came in."}},
 m9:{driver:"Full size or fractional, and whether the bow is with it.",
     killer:"An open seam, a cracked top, or a bridge that has gone over. A luthier costs more than a student fiddle.",
     tiers:{hi:"Stentor Conservatoire / Eastman / Yamaha",mid:"Stentor Student / Cremona / Scherl & Roth",lo:"Cecilio / Mendini / Glarry"},
     brands:{hi:["Eastman","Yamaha","Stentor Conservatoire","Knilling"],mid:["Stentor","Cremona","Scherl & Roth","Bellafina","Franz Hoffmann"],lo:["Cecilio","Mendini","Glarry","Kennedy","no name"]}},
 m10:{driver:"Powered or passive, and whether it is a matched pair. A pair sells for more than two singles.",
     killer:"A blown driver or a dead amp module. You will hear it the second you plug it in.",
     tiers:{hi:"QSC / Electro-Voice / JBL Pro",mid:"Mackie / Behringer / Alto / Peavey",lo:"Pyle / Rockville / no name"},
     brands:{hi:["QSC","Electro-Voice","JBL","RCF","Yamaha DBR"],mid:["Mackie","Behringer","Alto","Peavey","Yamaha","Harbinger"],lo:["Pyle","Rockville","Gemini","Technical Pro","no name"]},
     detail:{ph:"make, size and powered or not \u2014 Mackie Thump 15, powered",hint:"Plug it in before you talk money. A blown driver is obvious in two seconds and invisible in a photograph."}},
 m11:{driver:"Banjo or mandolin, and resonator or open back. Bluegrass country, but a thin counter market.",
     killer:"A warped neck or a cracked rim. Both are terminal at this end.",
     tiers:{hi:"Deering / Gibson / Collings",mid:"Recording King / Gold Tone / Eastman / Kentucky",lo:"Rogue / Glarry / no name"},
     brands:{hi:["Deering","Gibson","Collings","Huber"],mid:["Recording King","Gold Tone","Eastman","Kentucky","Ibanez","Washburn","Epiphone"],lo:["Rogue","Glarry","Jameson","no name"]}},
 h4:{driver:"Brand, then megapixels. A cellular cam is priced with NO plan on it — the plan is the customer's account and it leaves with them.",killer:"Corroded battery tray. A cellular cam nobody can activate.",tiers:{hi:"Reconyx / Tactacam / Browning",mid:"Spypoint / Moultrie / Bushnell",lo:"Wildgame / Stealth Cam / no name"},
     brands:{hi:["Reconyx","Tactacam","Browning"],mid:["Spypoint","Moultrie","Bushnell","Muddy Pro"],lo:["Wildgame Innovations","Stealth Cam","Muddy","Vikeri","Campark"]},
     detail:{ph:"cellular or SD / megapixels — cellular, 32MP",hint:"Price a cellular cam as if it has no plan. The one on it belongs to the customer's account and stops when they do."}},
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
 /* Every item in the electronics and tools aisles says its own line. The
    aisle line is the fallback, and a fallback that names a phone is wrong
    on five of the seven things filed under it. */
 e2:{driver:"Age first, then processor and memory. Five years old is parts money whatever it cost new.",
     killer:"No charger. A swollen battery, a BIOS or activation password nobody can clear, or a machine that will not boot past the maker's logo."},
 e3:{driver:"Model year and storage. Brand carries more of the price here than anywhere else in the aisle \u2014 an iPad holds money, the rest mostly does not.",
     killer:"Activation lock \u2014 an iCloud or Google account still signed in makes it a brick. Cracked glass costs more to fix than the tablet is worth."},
 e4:{driver:"Model year, storage and whether it is carrier-locked. Two years old is half price.",
     killer:"Activation lock. A locked phone is a brick. See the Devices tab before you lend a dollar."},
 e5:{driver:"Which generation, and disc drive or digital-only. A current-gen machine holds its money; the one before it falls off a cliff.",
     killer:"No controller and no power or HDMI lead \u2014 that is a paperweight until you source them. Run a game before you call it working: a noisy fan or a drive that will not read is the end of it."},
 e6:{driver:"Brand and size. A JBL or a Bose moves; everything else sits on the shelf.",
     killer:"Won't hold a charge, a driver you can hear buzzing, or a proprietary charger that is not with it."},
 e7:{driver:"Brand and RMS watts \u2014 the RMS figure, never the number printed on the box.",
     killer:"Burnt voice coil, a torn surround, or no wiring harness. Installed gear pulled out of a car is often somebody else's \u2014 ask."},
 t3:{driver:"Brand, and whether it is cordless with a battery. A corded grinder is $20 money.",
     killer:"Seized spindle, or a burnt smell out of the vents. No guard."},
 t4:{driver:"Brand and tank size, and whether the pump still builds pressure.",
     killer:"Won't build pressure, or leaks down overnight. A rusted or cracked tank is scrap \u2014 never lend on one."},
 t5:{driver:"Motor horsepower and voltage \u2014 a 240v unit narrows the buyers a lot. Tank condition is the rest.",
     killer:"Rusted tank bottom, or a pump that will not build. And you have to get it back out the door: this is a two-man load and slow money."},
 t6:{driver:"Brand and amperage, and whether the gun, leads and regulator came with it.",
     killer:"No gun or ground clamp, or a dead transformer. The gas bottle is not his to pawn \u2014 those are leased from the gas supplier."},
 t7:{driver:"Brand and size. An empty box is furniture \u2014 the money is the steel and the name on it.",
     killer:"Bent drawers, dead casters, rust. Slow money even when it is clean."},
 t8:{driver:"Brand, and pneumatic or cordless \u2014 a cordless one needs its battery to be worth anything.",
     killer:"Dry-fired to death: leaking o-rings, a bent driver blade. No case and no fittings."},
 e1:{driver:"Size and model year are nearly the whole price.",killer:"Any panel line or burn-in — then it is worthless.",tiers:{hi:"Sony / Samsung / LG OLED",mid:"TCL / Hisense / Vizio",lo:"Onn / RCA / Sceptre"},
     brands:{hi:["Sony","Samsung","LG OLED","LG"],mid:["TCL","Hisense","Vizio"],lo:["Onn","RCA","Sceptre","Element","Westinghouse"]},
     detail:{ph:"size & year — 65in, 2024",hint:"Size and model year ARE the price — two model years old is half of new."}}
};
/* Keyed on the PRICEBOOK row's own name, so a row can answer for itself
   rather than inheriting whatever its aisle sells most of. Two shapes:
   its own three tiers, or brandOff where the maker does not move the
   price and inventing a ladder would be worse than not asking. */
const BOOK_OV={
 /* ---- instruments: the aisle's tiers are guitar tiers --------------- */
 "Audio mixer \u2014 PA board":{tiers:{hi:"Allen & Heath / Midas",mid:"Yamaha / Soundcraft / Mackie",lo:"Behringer / no name"}},
 "Bass guitar":{tiers:{hi:"Fender / Gibson / Rickenbacker",mid:"Squier / Ibanez / Yamaha",lo:"No name"}},
 "Keyboard \u2014 61 key":{tiers:{hi:"Roland / Korg / Nord",mid:"Yamaha / Casio higher range",lo:"Casio basic / no name"}},
 "Digital piano \u2014 88 key":{tiers:{hi:"Roland / Kawai / Nord",mid:"Yamaha / Casio Privia",lo:"Williams / no name"}},
 "Banjo":{tiers:{hi:"Deering / Gibson",mid:"Recording King / Gold Tone",lo:"Rogue / no name"}},
 "Mandolin":{tiers:{hi:"Gibson / Collings",mid:"Eastman / Kentucky",lo:"Rogue / no name"}},
 "Fiddle / violin":{tiers:{hi:"Named luthier / handmade",mid:"Yamaha / Eastman / Cremona",lo:"Student outfit / no name"}},
 "Full drum set":{tiers:{hi:"DW / Tama Star / Gretsch USA",mid:"Pearl / Tama / Yamaha / Ludwig",lo:"First Act / no name"}},
 "Vocal mic \u2014 SM58 class":{tiers:{hi:"Shure / Neumann / Sennheiser",mid:"Audio-Technica / AKG",lo:"Behringer / no name"}},
 "Powered PA speaker":{tiers:{hi:"QSC / JBL Pro / RCF",mid:"Yamaha / Mackie / Electro-Voice",lo:"Rockville / no name"}},
 "Guitar pedal":{tiers:{hi:"Strymon / Eventide",mid:"Boss / MXR / Electro-Harmonix",lo:"Behringer / no name"}},
 "Trumpet":{tiers:{hi:"Bach Stradivarius / Yamaha Xeno",mid:"Yamaha student / Getzen / Jupiter",lo:"Mendini / no name"}},
 "Alto saxophone":{tiers:{hi:"Selmer Paris / Yanagisawa",mid:"Yamaha / Jupiter / Conn-Selmer",lo:"Mendini / no name"}},
 "Clarinet":{tiers:{hi:"Buffet Crampon / Selmer Paris",mid:"Yamaha / Jupiter",lo:"Mendini / no name"}},
 "Flute":{tiers:{hi:"Yamaha pro / solid silver",mid:"Gemeinhardt / Jupiter student",lo:"Mendini / no name"}},
 "Trombone":{tiers:{hi:"Bach / Yamaha Xeno",mid:"Yamaha student / Jupiter",lo:"Mendini / no name"}},
 "French horn":{tiers:{hi:"Conn / Holton pro",mid:"Yamaha / Jupiter student",lo:"Mendini / no name"}},
 "Cello":{tiers:{hi:"Named luthier / Eastman higher",mid:"Cremona / Yamaha",lo:"Student outfit / no name"}},
 "Ukulele":{tiers:{hi:"Kamaka / Martin",mid:"Kala / Cordoba / Lanikai",lo:"Mahalo / no name"}},

 /* ---- hunting & fishing: the aisle's tiers are scope tiers ---------- */
 "Climbing tree stand":{tiers:{hi:"Lone Wolf / Summit",mid:"Millennium / Muddy / Ol\u2019 Man",lo:"Guide Gear / no name"}},
 "Ladder stand":{tiers:{hi:"Millennium / Summit",mid:"Muddy / Rivers Edge / Big Game",lo:"Guide Gear / no name"}},
 "Ground blind":{tiers:{hi:"Primos / Ameristep higher",mid:"Barronett / Rhino",lo:"No name"}},
 "Deer feeder \u2014 barrel":{tiers:{hi:"Boss Buck / Moultrie Pro",mid:"American Hunter / Wildgame",lo:"Home-built / no name"}},
 "Cellular game camera":{tiers:{hi:"Tactacam / Spypoint / Moultrie Edge",mid:"Stealth Cam / Wildgame",lo:"No name"}},
 "Duck decoys \u2014 dozen":{tiers:{hi:"Avian-X / Dive Bomb",mid:"Greenhead Gear / Flambeau",lo:"No name"}},
 "Kayak \u2014 sit-on-top":{tiers:{hi:"Hobie / Native / Old Town",mid:"Perception / Pelican higher",lo:"Lifetime / Sun Dolphin / no name"}},
 "Jon boat \u2014 12ft, no motor":{tiers:{hi:"Lowe / Alumacraft / Tracker",mid:"Lund / welded generic",lo:"Riveted, no name"}},
 "Fish finder":{tiers:{hi:"Garmin / Humminbird Solix / Lowrance HDS",mid:"Humminbird Helix / Lowrance Hook",lo:"No name"}},
 "Offshore rod & reel":{tiers:{hi:"Shimano / Penn International / Daiwa Saltiga",mid:"Penn / Daiwa / Okuma",lo:"No name"}},
 "Fly rod & reel":{tiers:{hi:"Sage / Scott / Orvis Helios",mid:"Orvis Clearwater / Redington / TFO",lo:"No name"}},
 "Hard gun case":{tiers:{hi:"Pelican / Nanuk",mid:"SKB / Plano Field Locker",lo:"Plano basic / no name"}},
 "Waders":{tiers:{hi:"Simms / Orvis Pro",mid:"Redington / Frogg Toggs higher",lo:"Hodgman / no name"}},
 "Red dot sight":{tiers:{hi:"Aimpoint / Trijicon / EOTech",mid:"Holosun / Vortex / Sig Romeo",lo:"Bushnell / no name"}},
 "Camp stove":{tiers:{hi:"Camp Chef / Jetboil",mid:"Coleman / Stansport",lo:"No name"}},
 "Tent \u2014 4 to 6 person":{tiers:{hi:"Big Agnes / REI / NEMO",mid:"Coleman / Kelty",lo:"Ozark Trail / no name"}},
 "Sleeping bag":{tiers:{hi:"Western Mountaineering / Marmot down",mid:"Coleman / Kelty",lo:"No name"}},
 "Hard cooler \u2014 Yeti class":{tiers:{hi:"Yeti / Orca / RTIC higher",mid:"Igloo BMX / Coleman Xtreme",lo:"Igloo basic / no name"}},
 "Soft cooler / tote":{tiers:{hi:"Yeti Hopper / RTIC",mid:"Coleman / Igloo",lo:"No name"}},
 /* The maker does not move these enough to be worth a question. */
 "Boat trailer":{brandOff:true},
 "Cast net":{brandOff:true},
 "Crossbow bolts & broadheads \u2014 lot":{brandOff:true},
 "Camp chairs \u2014 pair":{brandOff:true},
 "Life jackets \u2014 set":{brandOff:true},
 "Boat anchor & rode":{brandOff:true},

 /* ---- appliances: the aisle's tiers are white-goods tiers ----------- */
 "Gas grill":{tiers:{hi:"Weber / Napoleon",mid:"Char-Broil / Nexgrill / Dyna-Glo",lo:"Expert Grill / no name"}},
 "Charcoal grill / kettle":{tiers:{hi:"Weber / Big Green Egg / Kamado Joe",mid:"Char-Griller / Oklahoma Joe\u2019s",lo:"Expert Grill / no name"}},
 "Pellet grill / smoker":{tiers:{hi:"Traeger / Yoder / Recteq",mid:"Pit Boss / Camp Chef",lo:"No name"}},
 "Offset smoker":{tiers:{hi:"Oklahoma Joe\u2019s / Yoder",mid:"Char-Griller / Dyna-Glo",lo:"No name"}},
 "Flat-top griddle \u2014 Blackstone class":{tiers:{hi:"Blackstone / Camp Chef",mid:"Royal Gourmet / Nexgrill",lo:"No name"}},
 "Air fryer":{tiers:{hi:"Ninja / Instant / Cosori",mid:"Chefman / Gourmia",lo:"No name"}},
 "Pressure cooker \u2014 Instant Pot class":{tiers:{hi:"Instant Pot / Ninja Foodi",mid:"Crock-Pot / Cosori",lo:"No name"}},
 "Blender":{tiers:{hi:"Vitamix / Blendtec",mid:"Ninja / KitchenAid / Oster",lo:"Hamilton Beach / no name"}},
 "Coffee maker":{tiers:{hi:"Breville / Jura / Technivorm",mid:"Keurig / Cuisinart / Ninja",lo:"Mr. Coffee / no name"}},
 "Space heater":{tiers:{hi:"Dyson / Vornado",mid:"Lasko / Honeywell / DeLonghi",lo:"No name"}},
 "Box fan / tower fan":{tiers:{hi:"Dyson / Vornado",mid:"Lasko / Honeywell",lo:"No name"}},
 "Dehumidifier":{tiers:{hi:"Frigidaire higher / hOmeLabs",mid:"Honeywell / GE",lo:"No name"}},
 "Portable air conditioner":{tiers:{hi:"Midea / LG / Whynter",mid:"Frigidaire / Honeywell",lo:"Black+Decker / no name"}},
 "Garbage disposal":{tiers:{hi:"InSinkErator Evolution",mid:"InSinkErator Badger / Waste King",lo:"No name"}},
 "Recliner":{tiers:{hi:"La-Z-Boy / Ekornes / named leather",mid:"Ashley / Lane / Flexsteel",lo:"No name"}},
 "Sofa / couch":{tiers:{hi:"Ekornes / Natuzzi leather",mid:"Ashley / La-Z-Boy / Flexsteel",lo:"No name"}},
 "Dresser / chest of drawers":{tiers:{hi:"Solid wood, named maker",mid:"Ashley / Sauder higher",lo:"Particle board / no name"}},
 "Dining table & chairs":{tiers:{hi:"Solid wood, named maker",mid:"Ashley / Sauder higher",lo:"Particle board / no name"}},
 "TV stand / entertainment center":{tiers:{hi:"Solid wood, named maker",mid:"Sauder / Ameriwood",lo:"Particle board / no name"}},
 "Propane tank \u2014 20lb, full":{brandOff:true},

 /* ---- fitness: the aisle's tiers are treadmill tiers ---------------- */
 "Bowling ball":{tiers:{hi:"Storm / Hammer / Roto Grip",mid:"Brunswick / Ebonite",lo:"House ball / no name"}},
 "Skateboard":{tiers:{hi:"Independent / Thunder / named deck",mid:"Element / Santa Cruz / Girl",lo:"Big-box complete / no name"}},
 "Surfboard":{tiers:{hi:"Channel Islands / Lost / Firewire",mid:"NSP / Torq / Catch Surf",lo:"Soft-top / no name"}},
 "Paddle board \u2014 SUP":{tiers:{hi:"Red Paddle / Starboard / BOTE",mid:"iRocker / Bluefin",lo:"Big-box inflatable / no name"}},

 /* ---- tools: the aisle's tiers are cordless-power-tool tiers --------
    Right for a circular saw, a miter saw, a jigsaw, a nail gun. Wrong
    the moment the row is a hand tool, a jack, a welder or a thing that
    only looks like it came off the same shelf: a sewing machine was
    offered "DeWalt / Milwaukee / Makita". */
 "Band saw \u2014 benchtop":{tiers:{hi:"Jet / Rikon / Laguna",mid:"Grizzly / WEN",lo:"Harbor Freight / no name"}},
 "TIG / stick welder":{tiers:{hi:"Miller / Lincoln Electric",mid:"Hobart / Everlast",lo:"Harbor Freight / no name"}},
 "Stick welder":{tiers:{hi:"Miller / Lincoln Electric",mid:"Hobart / Everlast",lo:"Harbor Freight / no name"}},
 "Plasma cutter":{tiers:{hi:"Hypertherm / Miller",mid:"Lincoln Electric / Everlast",lo:"Harbor Freight / no name"}},
 "Oxy-acetylene torch set":{tiers:{hi:"Victor / Harris",mid:"Lincoln Electric / Forney",lo:"Harbor Freight / no name"}},
 "Benchtop planer":{tiers:{hi:"DeWalt / Makita",mid:"WEN / Craftsman",lo:"Harbor Freight / no name"}},
 "Drill press":{tiers:{hi:"Jet / Powermatic",mid:"WEN / Ryobi / Craftsman",lo:"Harbor Freight / no name"}},
 "Bench grinder":{tiers:{hi:"Baldor / Jet",mid:"DeWalt / Ryobi / WEN",lo:"Harbor Freight / no name"}},
 "Shop vac":{tiers:{hi:"Festool / Nilfisk",mid:"Ridgid / Shop-Vac / DeWalt",lo:"Harbor Freight / no name"}},
 "Extension ladder":{tiers:{hi:"Werner / Little Giant",mid:"Louisville / Gorilla",lo:"Harbor Freight / no name"}},
 "Scaffolding \u2014 section":{tiers:{hi:"Werner / Bil-Jax",mid:"Metaltech / big-box",lo:"Harbor Freight / no name"}},
 "Floor jack":{tiers:{hi:"Snap-on / Hein-Werner",mid:"Daytona / Arcan / Craftsman",lo:"Harbor Freight / no name"}},
 "Jack stands \u2014 pair":{tiers:{hi:"Esco / Hein-Werner",mid:"Craftsman / Torin",lo:"Harbor Freight / no name"}},
 "Socket set \u2014 complete":{tiers:{hi:"Snap-on / Matco / Mac",mid:"Craftsman / Husky / Kobalt",lo:"Harbor Freight / no name"}},
 "Torque wrench":{tiers:{hi:"Snap-on / CDI / Precision Instruments",mid:"Tekton / Husky / Craftsman",lo:"Harbor Freight / no name"}},
 "Come-along / hand winch":{tiers:{hi:"Lug-All / Maasdam",mid:"Tekton / big-box",lo:"Harbor Freight / no name"}},
 "Chain hoist":{tiers:{hi:"CM / Harrington",mid:"Jet / Vevor",lo:"Harbor Freight / no name"}},
 "Engine hoist":{tiers:{hi:"OTC / Sunex",mid:"Torin / big-box",lo:"Harbor Freight / no name"}},
 "Concrete mixer":{tiers:{hi:"Multiquip / Crown",mid:"Kushlan / YardMax",lo:"Harbor Freight / no name"}},
 "Sewing machine":{tiers:{hi:"Bernina / Juki industrial",mid:"Brother / Singer / Janome",lo:"No name"}},
 "Stand mixer \u2014 KitchenAid class":{tiers:{hi:"KitchenAid Pro / Hobart",mid:"KitchenAid Classic / Cuisinart",lo:"Hamilton Beach / no name"}},
 "Paint sprayer \u2014 airless":{tiers:{hi:"Graco / Titan",mid:"Wagner / HomeRight",lo:"Harbor Freight / no name"}},
 "Laser level":{tiers:{hi:"Leica / Topcon / Hilti",mid:"Bosch / DeWalt / Johnson",lo:"Harbor Freight / no name"}},
 "OBD scan tool":{tiers:{hi:"Snap-on / Autel / Launch",mid:"Innova / Ancel / BlueDriver",lo:"No name"}},
 "Drywall lift":{tiers:{hi:"Telpro / PanelLift",mid:"Troy / big-box",lo:"Harbor Freight / no name"}},
 "Battery charger / jump box":{tiers:{hi:"NOCO / Schumacher pro",mid:"Schumacher / DeWalt",lo:"Harbor Freight / no name"}},
 "Tile saw":{tiers:{hi:"MK Diamond / Husqvarna",mid:"Ridgid / DeWalt",lo:"Harbor Freight / no name"}},
 "Wet tile saw":{tiers:{hi:"MK Diamond / Husqvarna",mid:"Ridgid / DeWalt",lo:"Harbor Freight / no name"}},
 "Wheelbarrow":{brandOff:true},
 "Mechanic\u2019s creeper":{brandOff:true},
 "Mechanic's creeper":{brandOff:true},
 "Grease gun":{brandOff:true},

 /* ---- electronics: the aisle's tiers are phone tiers ----------------
    "Apple / Samsung flagship" is right for a phone, a tablet and a
    smartwatch and wrong for everything else in the aisle. Neither makes
    a turntable, a drone, an AV receiver or an airless printer. */
 "Wireless earbuds":{tiers:{hi:"Apple AirPods / Sony / Bose",mid:"Samsung / Jabra / Anker",lo:"Off brand"}},
 "DSLR / mirrorless camera":{tiers:{hi:"Canon / Nikon / Sony",mid:"Fujifilm / Olympus / Panasonic",lo:"No name"}},
 "Headphones \u2014 over-ear":{tiers:{hi:"Sony / Bose / Sennheiser",mid:"Audio-Technica / JBL / Beats",lo:"Off brand"}},
 "Game controller":{tiers:{hi:"Sony / Microsoft / Nintendo official",mid:"8BitDo / PowerA",lo:"Off brand"}},
 "Wireless mouse \u2014 computer":{tiers:{hi:"Logitech MX / Razer",mid:"Logitech / Microsoft",lo:"Off brand"}},
 "Computer keyboard":{tiers:{hi:"Keychron / Das / Razer",mid:"Logitech / Microsoft / Corsair",lo:"Off brand"}},
 "Soundbar":{tiers:{hi:"Sonos / Bose / Sennheiser",mid:"Samsung / LG / Vizio",lo:"Off brand"}},
 "AV receiver":{tiers:{hi:"Denon / Marantz / Yamaha",mid:"Onkyo / Sony / Pioneer",lo:"Off brand"}},
 "Turntable":{tiers:{hi:"Technics / Rega / Pro-Ject",mid:"Audio-Technica / Fluance",lo:"Crosley / no name"}},
 "Record player / turntable set":{tiers:{hi:"Technics / Rega",mid:"Audio-Technica / Fluance",lo:"Crosley / no name"}},
 "Gaming desktop PC":{tiers:{hi:"Custom build, named GPU",mid:"Alienware / HP Omen / Lenovo Legion",lo:"No name prebuilt"}},
 "Monitor \u2014 27in":{tiers:{hi:"Apple / LG UltraFine / Dell UltraSharp",mid:"Dell / Asus / Acer",lo:"Off brand"}},
 "Camera drone":{tiers:{hi:"DJI",mid:"Autel / Skydio",lo:"Off brand"}},
 "Gimbal / pocket camera":{tiers:{hi:"DJI / Insta360",mid:"Zhiyun / Hohem",lo:"Off brand"}},
 "Gaming laptop":{tiers:{hi:"Razer / Asus ROG / Alienware",mid:"Lenovo Legion / HP Omen / MSI",lo:"Off brand"}},
 "GoPro / action camera":{tiers:{hi:"GoPro / DJI / Insta360",mid:"Akaso",lo:"Off brand"}},
 "VR headset":{tiers:{hi:"Apple / Valve / Meta Quest Pro",mid:"Meta Quest / PSVR",lo:"Off brand"}},
 "Handheld game console":{tiers:{hi:"Nintendo / Steam Deck / ROG Ally",mid:"Anbernic",lo:"Off brand emulator"}},
 "Projector":{tiers:{hi:"Epson / BenQ / Sony",mid:"Optoma / ViewSonic / Anker",lo:"Off brand"}},
 "Two-way radios \u2014 pair":{tiers:{hi:"Motorola / Garmin Rino",mid:"Midland / Cobra",lo:"Off brand"}},
 "DJ controller":{tiers:{hi:"Pioneer DJ / Denon DJ",mid:"Numark / Hercules",lo:"Off brand"}},
 "Ring / smart doorbell":{tiers:{hi:"Ring / Nest / Arlo",mid:"Eufy / Wyze",lo:"Off brand"}},
 "Dash camera":{tiers:{hi:"BlackVue / Thinkware / Viofo",mid:"Garmin / Vantrue",lo:"Off brand"}},
 "Security camera system":{tiers:{hi:"Ubiquiti / Lorex / Reolink",mid:"Ring / Wyze / Eufy",lo:"Off brand"}},
 "Wifi router / modem":{tiers:{hi:"Ubiquiti / Asus ROG / Netgear Nighthawk",mid:"TP-Link / Netgear / Linksys",lo:"Off brand"}},
 "Printer \u2014 all in one":{tiers:{hi:"HP OfficeJet Pro / Brother laser",mid:"Canon / Epson / HP",lo:"Off brand"}},
 "Karaoke machine":{tiers:{hi:"JBL PartyBox / Singing Machine",mid:"Ion / Singsation",lo:"Off brand"}},
 "E-reader \u2014 Kindle class":{tiers:{hi:"Kindle Oasis / Kobo Elipsa / reMarkable",mid:"Kindle / Kobo",lo:"Off brand"}},
 /* The publisher is already in the row name on these three, and a game
    does not have a maker tier the way a drill does. */
 "Video game \u2014 sports title":{brandOff:true},
 "Video game \u2014 Nintendo title":{brandOff:true},
 "Video game \u2014 current title":{brandOff:true}
};
function itemOv(){return (st.bookName&&BOOK_OV[st.bookName])||ITEM_OVERRIDES[st.itemId]||null;}
/* ══════════════════════════════════════════════════════════════════════
   THE MAKE QUESTION BELONGS TO THE ROW, NOT THE AISLE.

   "lets get back to the mobile buying functions." Measured first: twelve
   things off a driveway, counting taps from picking it to a number on the
   screen. Eight of the twelve never got one, and two of them were stuck
   on a question nobody could answer:

     Weber kettle grill   offered  Speed Queen / Sub-Zero / Bosch
                                   Whirlpool / Maytag / LG / Samsung / GE
                                   Kenmore / Frigidaire / Amana / Hotpoint
     Coleman cooler       offered  Leupold / Vortex / Zeiss
                                   Bushnell / Nikon
                                   Tasco / no name

   Washing-machine brands for a grill, and rifle-scope brands for a
   cooler. Weber is THE premium grill name and it is on neither list;
   Yeti is the cooler everything else is measured against and it is on
   neither. He cannot answer, so the run cannot finish, so there is no
   price - in a driveway, with somebody else reaching for the same grill.

   This is not a new bug, it is a recurring one. ITEM_OVERRIDES was built
   when a Tactacam game camera was offered Leupold and Zeiss, and its own
   comment says the aisle's lines are guitar lines and say nothing to a
   man holding a trumpet. But ITEM_OVERRIDES is keyed on st.itemId, and
   every PRICEBOOK row in a category shares one id - cust-appl for all 21
   appliance rows - so a book row had nowhere to put its own answer.

   Counted how far it goes, by category, comparing the aisle's three
   tiers against what its rows actually are:

     Instruments         17 of 19 rows wrong   trumpet, flute, drum set
     Hunting & fishing   23 of 26             tents, kayaks, waders
     Appliances          19 of 21             grills, recliners, sofas
     Fitness & sporting   4 of 4              bowling ball, surfboard

   So the row gets to answer for itself, two ways. Where the maker really
   does move the price it carries its own three tiers. Where it does not -
   a propane tank, a bowling ball, duck decoys - the question goes off
   rather than being answered with invented brands, which is the same
   reasoning the model question already uses for a wheelbarrow.

   THE TIER LISTS BELOW ARE MY READING AND HE SHOULD CHECK THEM. Moving
   one changes a price, so they are on the screen where he can see them
   and the table is one place rather than scattered.
   ══════════════════════════════════════════════════════════════════════ */
function brandOf(cat){
  const ov=itemOv();
  if(ov&&ov.brandOff)return {on:false,hi:"",mid:"",lo:""};
  return (ov&&ov.tiers)?Object.assign({},cat.brand,ov.tiers):cat.brand;
}
/* THE MAKE OFTEN SAYS WHAT THE THING IS.
   Reported from the counter, with a Tactacam Reveal SK on the glass: the
   make question offered "Leupold / Vortex / Zeiss", "Bushnell / Nikon" and
   "Tasco / no name" - the hunting aisle's OPTICS tiers - for a game
   camera. Leupold and Zeiss do not make one. And it never asked what kind
   of thing a Tactacam is before deciding.

   What happened: the words did not match the book row (a Reveal SK typed
   as "real sk"), so the search offered "use what I typed", which makes a
   CUSTOM item in the aisle. A custom item has no overrides, so it inherits
   the AISLE's brand tiers - and the hunting aisle's tiers are about glass.

   But the aisle already knows the answer. h4, the trail camera, lists
   Reconyx, Tactacam and Browning as its own top tier. A make that appears
   in exactly one item's brand list in that aisle names that item. Nothing
   consulted it, so the desk had Tactacam written down as a make and still
   did not know it was looking at a camera. */
function itemFromBrand(catId,txt){
  const cat=CATALOG.find(c=>c.id===catId); if(!cat)return null;
  /* Scans the ITEMS' own brand lists rather than asking the aisle's brand
     book what the make is. The aisle book is about the aisle's headline
     product - the hunting one is full of glass - so it never heard of
     Mathews or Minn Kota, and leaning on it found Tactacam and missed the
     rest. These lists are the thing that actually knows. */
  const t=" "+omniNorm(txt)+" ";
  /* A MAKE THE AISLE ITSELF NAMES IS NOT DECISIVE.
     The aisle's brand book is a flat union of every product in it, so it
     says nothing. But the aisle's TIER LABELS name the makes of its
     headline product - hunting reads "Leupold / Vortex / Zeiss",
     "Bushnell / Nikon", "Tasco / no name", which is glass. Bushnell is in
     the trail camera's list too, and Bushnell is at least as much a scope
     maker, so "bushnell" must not land on a camera. Tactacam, Mathews,
     Shimano and Minn Kota appear in no label and stay decisive. */
  const labels=" "+omniNorm(["hi","mid","lo"].map(k=>(cat.brand&&cat.brand[k])||"").join(" "))+" ";
  let found=null;
  for(const it of cat.items){
    const ov=ITEM_OVERRIDES[it.id]; if(!ov||!ov.brands)continue;
    const mine=["hi","mid","lo"].some(tier=>(ov.brands[tier]||[]).some(b=>{
      const n=omniNorm(b);
      /* whole words only: "bear" must not fire on "bearing" */
      if(!(n.length>=3&&t.indexOf(" "+n+" ")>=0))return false;
      return labels.indexOf(" "+n+" ")<0;   /* the aisle claims it: says nothing */
    }));
    if(!mine)continue;
    if(found&&found!==it.id)return null;   /* two items claim it - it says nothing */
    found=it.id;
  }
  return found;
}
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
/* What the "details" box is for differs by category, and the wording lived
   inline in the whole-page layout. The run needs the same words. */
function detailHint(x){
  const ov=itemOv(), id=(x&&x.cat?x.cat.id:st.catId);
  const d=(ov&&ov.detail)||DETAIL_HINTS[id]||{ph:"",hint:""};
  return {ph:d.ph||"", hint:d.hint||"",
    /* Keyed on the DETAIL hint, not on the override existing: an item that
       overrides only its driver and killer still wants the aisle's wording
       for what to type in the box. */
    what: (ov&&ov.detail)?"specs for this item"
        : id==="guns"?"caliber & barrel"
        : id==="power"?"size & wattage"
        : id==="elec"?"size & year":"specs"};
}
/* A WHEELBARROW HAS NO MAKE AND A HAMMER HAS NO MODEL.

   Picking a line out of the price book already names the exact thing -
   "Wheelbarrow", "Jigsaw", "Shop vac" - and for most of that book the make
   is not worth a tap. But the same book holds a $2,200 zero-turn and a $400
   gun safe, where it certainly is, so "came out of the book" cannot be the
   whole rule.

   The line is drawn where the answer could change the decision. The make
   tiers swing about 40% either way, so when 40% of the thing's own value
   comes to less than the floor you want to clear, no answer to "what make"
   can move what you do. A $40 jigsaw: sixteen dollars, under the $25 floor,
   so it is not asked. A $400 gun safe: a hundred and sixty, so it is. The
   floor is yours to set, and this follows it.

   The questions are still offered - a branded wheelbarrow can still be said -
   they just do not hold the price back. */
function bookSimple(x){
  return isCustom() && !!st.bookName
      && (Number(x.resale)||0)*0.4 < (Number(x.buyFloor)||BUY_FLOOR_DEF);
}
/* A SURFACE BOOK WAS BEING FILED AS A FIREARM.
   "Not on the lists" parked the item in custId(st.catId) - whatever
   category happened to be selected - and the desk opens on guns. So the
   thing on the counter became cust-guns: the gun brand book, the gun buy
   rate, GunBroker offered as its comp, and no chance of reading "Microsoft"
   out of the words because Microsoft is not a gun maker. The counter saw
   only the end of that chain: NOTHING PICKED YET on the make step.
   The words usually say which aisle. Read them against every category and
   take the one that answers; a tie or a blank still asks. */
function guessCat(txt){
  const t=String(txt||"").trim(); if(t.length<3)return null;
  const hits=CATALOG.map(c=>c.id).filter(id=>!!brandFromName(id,t));
  return hits.length===1?hits[0]:null;
}
function askQueue(x){
  const q=[], cat=x.cat, ov=itemOv(), easy=bookSimple(x);
  /* THE DESK ASKED A QUESTION IT NEVER DREW.
     needKind means "I do not know what sort of thing this is, and nothing
     is priced until somebody says". The buttons for it lived inside
     #nextStep - a card the one-question run does not render on either the
     phone or the desk - so the counter was asked nothing, and the item sat
     in whatever aisle was last open. A question belongs in the run with the
     rest of the questions. */
  if(st.needKind){
    q.push({id:"kind", title:"What kind of thing is it?",
      hint:"Nothing is priced until this is answered \u2014 it decides where to look for a price, and what share of new to work from.",
      opts:CATALOG.map(c=>({t:c.label, on:false, set:"kind", v:c.id})),
      answered:false});
  }
  /* AND WHICH OF THAT CATEGORY'S THINGS IT IS. "When i clicked the outdoor
     power tools button it went straight to bar length. What if it was a
     weedeater or a blower?" Outdoor power holds seven kinds and tapping the
     tile silently made it the first one, a chainsaw, bar length and all.
     Same shape as needKind above and the same answer: the desk did not know,
     so it asks, in the run, rather than assuming and hoping the counter
     spots it. st.picked is false exactly when nothing has actually chosen an
     item - the setter at the top of the file guarantees that - so this is
     the condition, not a new flag to keep in step. */
  if(st.needItem&&!st.needKind){
    q.push({id:"which", title:"Which of these is it?",
      hint:"Tapping "+esc(String(cat.label||"a category").toLowerCase())+" narrowed it this far. Pick the thing itself and the questions that follow are its own.",
      opts:cat.items.map(i=>({t:i.name, on:false, set:"item", v:i.id}))
        .concat([{t:"Not on any list — I set the price", on:false, set:"item", v:custId(cat.id)}]),
      answered:false});
    /* AND NOTHING AFTER IT UNTIL IT IS ANSWERED. The fallback item is still
       a chainsaw, so its questions queued up behind this one and the numbers
       card read "still needs which one it is, the make, the model ... bar
       length" - the exact question he was told makes no sense for a blower,
       listed before he has had the chance to say it is not one. One question
       on the screen until the thing is chosen; the rest belong to the item
       and are built the moment there is one. */
    return q;
  }
  /* A MAKE TIER CANNOT MOVE A MEASURED PRICE, so the run stops WAITING on
     one. calcItem has exactly two branches:

       resale = checked ? market.mid*cond*completeMult
                        : baseValue*CATALOG_AT_GOOD*cond*brandMult*completeMult*spec.mult

     brandMult is in the second and not the first, and it is right that it
     is not: a measured figure for a Sega Saturn already has Sega in it, and
     multiplying it again by a tier would price the maker twice. But the
     question went on being asked anyway. Measured on a Saturn with the
     book row driving: Apple/Samsung flagship $55, Mainstream $55, Off
     brand $55 - three taps, three identical numbers, on the first card of
     the run. "This seems to be a recurring issue where your suggested item
     is selected but then the next question still asks me for a brand/make."
     This is the same rule the hand-set figure already follows two screens
     down ("A QUESTION THAT CANNOT MOVE THE NUMBER IS NOT A QUESTION") -
     it was simply never applied to the checked branch.
     FIRST ATTEMPT TOOK THE QUESTION OUT OF THE QUEUE AND THAT WAS WRONG,
     for the reason the note further up this file already gave: "a question
     that is gone from the queue is gone from the dots, so a misread make
     could never be corrected". Worse here than anywhere else, because the
     make is part of what CHOOSES the measured row - mpFor reads
     st.brandTyped - so removing the question would have made the row's own
     input unreachable the moment the row was found. A circular trap.
     So it stays in the run, marked answered and filled-in rather than
     outstanding: the run opens past it, the dots still reach it, and a tap
     still overrules it. */
  if(brandOf(cat).on){
    const tiers=brandOf(cat);
    /* If the make is known, that IS the answer - show it answered rather
       than lighting a tier nobody chose.
       Known two ways, and both have to say the make out loud. Typing
       "Sony Laptop" lit "Apple / Samsung flagship" and explained nothing,
       so the screen read as the desk calling a Sony an Apple. It is the
       right TIER - the buttons are named after their examples, and Sony
       keeps company with Apple - but the counter is owed the word Sony. */
    const typedHit=st.brandTyped?brandLookup(st.catId,st.brandTyped):null;
    const named=x.namedBrand?{name:x.namedBrand,tier:x.brandTier}
      :typedHit?{name:typedHit.name,tier:typedHit.tier}:null;
    /* Nothing lit until something actually says so. A default that lights
       "Ryobi / Ridgid" reads as an answer somebody gave, and the counter
       walks past it. The price still uses mid as its neutral - it has to
       use something - but the screen does not claim that was a choice.
       TYPED IS NOT THE SAME AS KNOWN. This counted any text at all as an
       answer, so a make the category's list does not carry - Harbor Freight
       among the generators, anything at all on a chainsaw - fell to the
       standard tier and lit "Mid grade" as though somebody had picked it.
       The make was typed, the desk did not recognise it, and the screen
       said it had. It has to have resolved to a tier, or be a tap. */
    const unknownTyped=!!st.brandTyped&&!named;
    const known=!!named||!!st.brandSet;
    const sel=known?x.brandTier:null;
    /* "I typed Google home mini but then you asked for make." Right, and the
       desk had already read Google off it - the question came up with Google
       lit and the make underneath. Filtering it out of the queue the way the
       record specs are filtered was the obvious fix and it is WRONG: five
       suites went red, and one of them for the right reason - "the answered
       ones are still reachable, the dots still open the make". A question
       that is gone from the queue is gone from the dots, so a misread make
       could never be corrected. The run should OPEN past it, not lose it.
       Left as it was until that is done properly. */
    q.push({id:"brand", title:"What make is it?", optional:easy,
      named:named&&named.name,
      /* The lit button wears the actual make, with the tier it sits in
         underneath. The other two keep their examples, so there is still
         somewhere obvious to move it. */
      opts:BRANDS.map(br=>({t:(named&&sel===br.id)?named.name:tiers[br.id],
        sub:(named&&sel===br.id)?tiers[br.id]:"",
        on:sel===br.id, set:"brand", v:br.id})),
      /* Saying WHICH make went unrecognised beats a blank "nothing picked":
         the counter typed it, and being told the list does not carry it is
         the difference between a bug and a question. */
      hint:(x.checked&&!known)
        ?(st.brandTyped?"Read as <b>"+esc(st.brandTyped)+"</b>. ":"")
          +"The price here is a measured figure for this exact model, and a make tier is not part of that arithmetic \u2014 nothing below changes the number. Tap one only to put it on the ticket."
        :known?""
        :unknownTyped?"<b>"+esc(st.brandTyped)+"</b> is not on the list for "
          +esc(String(cat.label||"this").toLowerCase())+" \u2014 say where it sits and the price follows."
        :"Nothing picked yet \u2014 the price is using the standard tier until you say.",
      /* Answered because it is settled, either way: somebody said so, or
         the arithmetic cannot hear the answer. */
      answered:known||!!x.checked,
      auto:!st.brandSet,
      /* And the card says which of those it is, rather than leaving the
         counter to wonder why a question he never answered is ticked. */
      tierMoot:!!x.checked});
  }
  /* WHICH ONE IS IT. The run never asked, and the model is the single
     thing on the page that moves money most: it is what the sold-price
     lookup searches on, it is what the measured rows are matched against,
     and it is where the make is read from. It existed only as an optional
     fold on the old whole-page layout, so the one-question run - now the
     default - walked straight past it to the price and left the lookup
     searching for "laptop".
     Never required. A model nobody knows is a blank box and a Skip. */
  q.push({id:"model", title:"Which one is it?", kind:"model", optional:easy,
    /* "ARE THESE BASICALLY ASKING THE SAME THING?" - this and Anything else.
       They are not, but this hint said they were: "and anything that changes
       the price" is word for word what the later box asks for, so the two
       screens read as one question posed twice.
       The real split is what KIND of fact, not where it goes - both end up in
       the sold-price search. This box is the name of the exact thing, which
       is what finds the right product. The later box is the facts that move
       its worth when no question above covered them. So this one asks for the
       model and nothing else. */
    hint:"The model number or name — just that. Skip it if you cannot see one.",
    /* Skip is an ANSWER here, not a dodge: plenty of things - a wheelbarrow,
       a gold chain - carry no model at all, and the price now waits for
       every question, so a question with no way to say "there isn't one"
       would wait for ever. st.mpNone is the phone's existing "I can't see a
       model" flag; the desk's Skip sets the same one.

       Only this question works that way. The specs each have a default that
       is wrong often enough to matter - defaulting a bare drill to a
       two-battery kit doubles it - and the shape and the sold price can
       always be answered, so neither may be waved past. */
    /* st.detail used to count here, back when its box was on this card.
       It is its own question now, so a model is answered by a model. */
    answered:!!(st.model||st.mpNone),
    /* Read off what was picked, not typed by anybody. */
    auto:!!st.model&&!st.mpNone&&!st.modelTyped});
  /* THE RESEARCH STEP COMES WHILE THE ITEM IS STILL IN MIND.
     This used to sit at 7 of 8, between "is it all there" and the
     condition. On anything the desk cannot price itself - a television,
     a saw, a model not in the book - that step is not a question, it is
     an instruction to go and look something up, and arriving at it on the
     second-to-last card reads as a form asking you for the answer you
     came to get. Straight after the model, where the thing you would
     search for is what you just typed.
     Nothing is lost by the move: only 5 options in the whole catalogue
     add a word to the search, and the automatic lookup fires when the
     item is picked, well before either position. */
  q.push({id:"worth", title:"What does one sell for used?",
    hint:"", kind:"worth", answered:!!x.checked||!!st.worthNone,
    /* The book had a figure for this model. Nobody looked anything up. */
    auto:!!(x.checked&&x.market&&x.market.kind==="list")});
  /* A QUESTION THAT CANNOT MOVE THE NUMBER IS NOT A QUESTION.
     When the resale figure is typed by hand, calcItem takes it as it
     stands: cond is forced to 1 and brandMult and spec.mult are not in
     that branch at all. The counter has the thing in his hands and has
     priced THIS one - the scratches and the screen size are already in
     his figure, and applying them again would price the wear twice.
     That much is deliberate and right. What was not right is that the run
     went on asking anyway: screen size, age, and then "what shape is it
     in?" on the last card, every one of them thrown away. Keystrokes at a
     counter with a customer waiting, spent on answers the arithmetic never
     reads, on the very items the desk had already failed to price.
     So they come out of the run. Condition still rides on the ticket as a
     record of what walked in; it is just not asked as though it were an
     input. Completeness stays, because completeMult IS applied to a
     hand-set figure. */
  const handSet=!!(x.checked&&x.market&&x.market.kind==="hand");
  const sc=handSet?[]:(SPEC_CHOICES[st.itemId]||[]);
  sc.forEach((g,gi)=>{
    const key=st.itemId+":"+gi;
    q.push({id:"spec:"+gi, title:g.label+"?",
      hint:g.options.map(o=>o.note).filter(Boolean)[0]||"",
      /* `sel` is what the ARITHMETIC uses - the recorded pick, or the
         book's neutral default when there isn't one. It is not what the
         screen may claim was chosen. A bare drill defaults to the
         two-battery kit and doubles the price, and the card was showing
         that answer already highlighted, so Next read as agreement to a
         guess nobody made. Only a recorded pick lights up now. */
      opts:g.options.map((o,oi)=>({t:o.t, sub:o.note||"", on:st.specSel[key]===oi, set:"spec", v:gi+":"+oi})),
      /* A question the record already answers is not asked - it is filtered
         out of the run below. Which means the dots do NOT reach it, and the
         first draft of this comment claimed they did. The way back in is
         the "From the record" line on the answer card: press it and the
         record's answers are dropped for this item, so the questions
         return and can be answered by hand for the one on the counter - an
         aftermarket bar, a saw somebody has already rebuilt. */
      fromRecord:specFromRecord[key]!=null&&st.specSel[key]!=null,
      answered:st.specSel[key]!=null});
  });
  /* and it is not ASKED twice either: being asked what came with it and
     then whether it is all there is the same question, and the counter
     answering both honestly is what produced the double cut. */
  if(cat.complete.on&&!specCoversComplete(x&&x.item?x.item.id:st.itemId)){
    const what=cat.complete.label||"the bits that come with it";
    q.push({id:"complete", title:"Is it all there?",
      /* Same rule, and this one was the worst of them: st.complete starts
         true so "All there" came up lit AND the question counted itself
         answered, which means a drill with no battery in it priced as a
         kit unless the counter happened to re-tap the button that was
         already glowing. Nothing lit, and nothing answered, until he says. */
      opts:[{t:"All there", on:!!st.completeSet&&st.complete===true, set:"comp", v:"1"},
            {t:"Something missing", sub:"worth "+Math.round((Number(cat.complete.mult)||0.7)*100)+"% of a complete one",
             on:!!st.completeSet&&st.complete===false, set:"comp", v:"0"}],
      hint:what+". Missing pieces come off the price."+(st.completeSet?"":" Nothing picked yet \u2014 the price is treating it as complete until you say."),
      answered:!!st.completeSet});
  }
  if(!handSet)q.push({id:"cond", title:"What shape is it in?",
    hint:"Next to a typical used one.",
    opts:condList(x&&x.item?x.item.id:st.itemId).map(c=>{const w=COND_WORDS[c.id]||[c.label,""];
      /* NOTHING LIT UNTIL SOMEBODY SAYS SO - the same rule the make above
         already follows, and for the same reason. st.cond defaults to
         "good" because the arithmetic needs something, so Good came up
         already highlighted and read as a choice that had been made. The
         counter sees his answer sitting there, moves on, and the desk
         prices a rough drill as a good one. Condition swings the number
         from +30% to -55%: it is the widest lever on the page and it was
         showing an answer nobody gave.
         The price still uses good as its neutral. The screen just stops
         claiming that was a decision. */
      return {t:w[0], sub:w[1]||"", on:!!st.condSet&&st.cond===c.id, set:"cond", v:c.id};}),
    answered:!!st.condSet});
  /* ANYTHING ELSE COMES LAST - AFTER THE CONDITION, NOT BEFORE IT.
     It used to sit under the model box, which put a catch-all "anything
     else" in front of the specific questions - on a TV the thing you
     reach for after the make is the screen size, and the card was asking
     for free text before it asked for that. Its own step, after every
     question that has a real answer.
     26 Sep, asked for from the counter: it was landing at 7, one step
     AHEAD of the condition, so the run asked "anything else?" and then
     carried on asking. A catch-all that comes before the last real
     question is not a catch-all. Condition is 7 now and this is 8.
     It sits after the price step now. That is safe: the automatic lookup
     fires when the item is PICKED, long before either, and what is typed
     here only ever reaches the link-out buttons and the ticket - which
     re-read it. And the Osmo measurement says extra words narrow a search
     until it finds a different product, so keeping them out of the
     automatic one is the better half of the trade. */
  q.push({id:"extra", title:"Anything else?", kind:"extra", optional:true,
    hint:"Only what changes the price and was not already asked. Usually nothing.",
    answered:true, auto:!String(st.detail||"").trim()});
  /* THE RUN DOES NOT ASK WHAT THE RECORD ALREADY SAYS.
     These stay answered in state and keep feeding the arithmetic - they are
     simply not presented as questions. "Shouldn't the tool already know the
     answer to this question?" It does, for these, and stopping to ask
     anyway is the tool pretending it does not. */
  /* WHERE THE LOOKUP SITS FOLLOWS WHO DOES THE LOOKING.
     This step is third on purpose and the note above it says why - it was
     moved UP from 7 of 8 because arriving at it second-to-last "reads as a
     form asking you for the answer you came to get". That reasoning ends on
     the thing that settles both cases: "the automatic lookup fires when the
     item is picked, well before either position."
     It does not fire when there is no service. Then third is the one step
     that throws the counter out of the app into a browser tab, in the
     middle of a run whose remaining questions are all single taps and none
     of which change what you search for. So the position follows the work:
     automatic and it stays third, fetching while the taps happen; by hand
     and it goes last, so the cheap answers are done and the app is left
     once, at the end.
     Not a preference either way - one rule, applied to whichever situation
     the desk is actually in.

     AND THE GATE WAS THE WRONG QUESTION. Reported with a Browning on the
     glass: "this question is still being asked before the other relevant
     questions" - the sold-price step at 3 of 8, ahead of caliber, optics,
     completeness and condition. It reproduced only with a service
     configured, which is why it looked fixed from here: on a desk with no
     token the step already went last.

     The gate asked "IS THERE A SERVICE?" when the rule above turns on
     "WILL THE LOOKUP ACTUALLY HAPPEN FOR THIS ITEM?", and for a firearm
     the answer is never. eBay does not sell guns; priceFind bails out on
     ebayBlind before it fetches anything; and the card on his screen SAID
     SO, three lines under the question - "So this one is yours to look
     up." The desk knew the service would not answer and put the step third
     anyway, to fetch in the background while the taps happen. Nothing was
     fetching. That is the whole guns aisle, the whole rolling aisle, and
     every item in EBAY_CANNOT_ITEM - mowers, fridges, treadmills,
     outboards, welders: the ones where the counter is always the one doing
     the looking.

     canLook, which is the same test line 1480 already uses to decide
     whether to offer the automatic lookup at all. One predicate for "the
     desk will do this for you", asked in both places. */
  const willFetch=(typeof CAP!=="undefined"&&CAP.sample&&!ebayBlind(x));
  if(!willFetch){
    const wi=q.findIndex(z=>z.id==="worth");
    if(wi>=0){
      const [w]=q.splice(wi,1);
      const xi=q.findIndex(z=>z.id==="extra");
      q.splice(xi<0?q.length:xi,0,w);
    }
  }
  return q.filter(z=>!z.fromRecord);
}
/* NOTHING IS PRICED UNTIL THE RUN HAS BEEN MADE.

   The desk used to answer the moment an item was picked: a Samsung tablet
   with no model named came back "pay up to $40, resells for $168" in mint
   green, with "nothing looked up yet" underneath in small orange. A Galaxy
   Tab runs from a Tab A7 Lite at about $45 to a Tab S9 Ultra ten times
   that, so $168 was not an estimate - it was the middle of a range wide
   enough to be useless, printed in the same type as a checked price.

   The run already asks everything that moves the number: the make, the
   model, the specs that matter for the thing in hand (age, battery, barrel,
   deck), what it sells for, and the shape it is in. Every one of those
   carries an `answered` flag. So the gate is the run itself - no hand-picked
   list of conditions to drift out of date, and a question added later gates
   the price for free.

   This deliberately reverses an earlier call. The price used to be hidden
   when the market was unknown, that stranded an unconnected tablet, and it
   was made to show the built-in figure instead. The offline case still
   works, because looking it up is not the only way to answer "what does it
   sell for" - typing the number, or the new price, answers it too. What is
   gone is the desk answering a question nobody finished asking. */
/* The first question with nothing in it. Everything before it has either
   been answered or does not apply to this thing. */
function firstOpenAsk(x){
  const q=askQueue(x);
  const i=q.findIndex(z=>!z.answered&&!z.optional);
  return i<0?0:i;
}
/* FORWARD FROM HERE TO THE NEXT THING THAT IS ACTUALLY OPEN.
   Advancing was at+1 flat, which was harmless while every answered question
   sat at the front. Moving the sold-price lookup to the end when the service
   is off put an ANSWERED question after the condition, and answering the
   condition then walked onto "What does one sell for used?" with the answer
   already in it - the run refusing to end because runFinished needs the
   counter on the last card.
   When nothing is left open it lands on the last card, which is what makes
   the run read as finished rather than stopping one short. */
function nextOpenAsk(q,at){
  for(let i=at+1;i<q.length;i++) if(!q[i].answered) return i;
  return q.length-1;
}
function priceReady(x){ return !!st.picked && askQueue(x).every(q=>q.answered||q.optional); }
const NEED_WORD={which:"which one it is", brand:"the make", model:"the model",
                 worth:"what it sells for",
                 cond:"the condition", complete:"what's with it"};
function priceMissing(x){
  /* needItem counts as started: the category is chosen and the one thing
     outstanding is which of its kinds it is. Returning nothing here printed
     "still needs ." on the numbers card - a sentence with its subject
     missing, on the screen that is meant to say what is left. */
  if(!st.picked&&!st.needItem)return [];
  return askQueue(x).filter(q=>!q.answered&&!q.optional).map(q=>NEED_WORD[q.id]
    || (String(q.id).indexOf("spec:")===0
        ? String(q.title||"").replace(/\?+$/,"").toLowerCase()
        : "one more answer"));
}
/* "the make, the model and what it sells for" - an Oxford-less list, because
   it is read aloud off a counter. */
function needList(x){
  const n=priceMissing(x);
  return n.length<2?(n[0]||"") : n.slice(0,-1).join(", ")+" and "+n[n.length-1];
}
/* TYPE THREE LETTERS, TAP THE NAME, NEVER SPELL IT.

   The make question offered three tiers and nothing else - "Top tier",
   "Mid grade", "Budget" - so the counter had to know which tier a Ryobi sat
   in to answer it, and the model box below was raw text, where "Stihl MS
   271" and "stil ms271" are two different searches and only one of them
   finds anything. The desk holds 423 makes across ten categories and 179
   measured models; it was asking the counter to remember them.

   Too many for buttons, so it filters as you type. Tapping a hit writes the
   canonical spelling and sets the tier with it - one tap answers both the
   make and which tier it sits in, which is the thing nobody should have to
   look up. The tier buttons stay underneath for a make the book has never
   heard of. */
function tierLabel(x,tier){
  const ov=itemOv(), t=(ov&&ov.tiers)||(x&&x.cat&&x.cat.brand)||{};
  return String(t[tier]||tier);
}
function brandHits(catId,q){
  const book=ovBrands(catId)||BRANDBOOK[catId]; if(!book)return [];
  const t=String(q||"").trim().toLowerCase();
  /* Nothing typed lists nothing. The first ten makes in book order are not a
     shortlist of anything - they are the first ten - and a list you have to
     read to find out it is useless is worse than no list. */
  if(!t)return [];
  const out=[];
  for(const tier of["hi","mid","lo"]) for(const name of (book[tier]||[])){
    const n=name.toLowerCase();
    if(n===t){ out.push({name,tier,rank:0}); }
    else if(n.indexOf(t)===0){ out.push({name,tier,rank:1}); }
    else if(n.indexOf(t)>=0){ out.push({name,tier,rank:2}); }
  }
  out.sort((a,b)=>a.rank-b.rank||a.name.localeCompare(b.name));
  return out.slice(0,10);
}
/* What the buttons on the NEXT screens already ask for, so the free-text
   box stops inviting it a second time. A riding mower asked for the deck
   and the hours as buttons and then offered "42in deck" as a placeholder
   one step earlier; the counter typed it twice or wondered which one
   counted. */
function specCovered(){
  return (SPEC_CHOICES[st.itemId]||[]).map(g=>String(g.label||"").toLowerCase()).filter(Boolean);
}
/* AND THE BOX ITSELF STOPS SUGGESTING THEM.
   "ALSO THIS PAGE, SHOULDNT IT COME BEFORE THE PAGE ASKING FOR PRICE?" -
   asked on "Anything else?" at 8 of 8, and the order was already right:
   the price is 7 and this is 8. What made it read backwards was the BOX,
   which still offered "caliber & barrel - 12ga 28in, 9mm..." as its
   placeholder. The caliber is question 3 now, with a picker. So the last
   card was inviting him to type the thing the desk had already asked him
   two screens earlier, and a card asking for the caliber after the price
   card reads exactly like a card that is in the wrong place.

   coveredLine() has said "asked next - no need to type them here" since
   the riding mower had the same fault, and it was only ever a NOTE. The
   placeholder went on suggesting them regardless, on the one card where
   there is nothing else to read.

   The synonyms are an explicit short list rather than anything clever.
   Guessing at synonyms is how a filter starts eating placeholders it
   should have left alone; if a new one is needed it gets added here, by
   somebody who has looked at both strings. */
const PH_SYN={"battery platform":["voltage"],"what came with it":["kit","came with"],
              "does it start?":["runs","starts"]};
/* WORDS, NOT SUBSTRINGS. The first version used includes(), and the very
   comment above it warned that a careless filter eats placeholders it
   should leave alone - then it did, immediately: a laptop's "size / year /
   storage" lost its hint because the Age group's label "age" is inside
   stor-AGE. Found by printing one card of every aisle rather than by
   reading the code, which is the only way these ever turn up. */
function phWord(t,w){
  return new RegExp("\\b"+String(w).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(t);
}
function phCovered(ph){
  const t=String(ph||"").toLowerCase();
  if(!t)return false;
  return specCovered().some(lab=>
    phWord(t,lab)||(PH_SYN[lab]||[]).some(w=>phWord(t,w)));
}
/* The placeholder with anything the buttons already ask stripped out - and
   "stripped" means gone, not trimmed. These hints are prose, not a list,
   so editing half a sentence out leaves something worse than nothing. The
   card's own line already says what to do with an empty box: "Usually
   nothing - skip it." */
function detailPh(x){
  const ph=detailHint(x).ph;
  return phCovered(ph)?"":ph;
}
function coveredLine(){
  const c=specCovered(); if(!c.length)return "";
  const list=c.length<2?c[0]:c.slice(0,-1).join(", ")+" and "+c[c.length-1];
  return list.charAt(0).toUpperCase()+list.slice(1)
    +(c.length<2?" is":" are")+" asked next \u2014 no need to type "+(c.length<2?"it":"them")+" here.";
}
/* THE LAST QUESTION ENDED IN NOTHING.

   Answer step 8 and the card sat exactly where it was, carrying a live
   button and no verdict. The answer HAD appeared - over in the rail, off to
   the right, in the same panel that had been sitting there half-filled since
   the item was picked - so from the counter it read as a screen still
   waiting on you rather than a screen that had finished. On a phone there is
   no rail at all, so it read as nothing happening whatsoever.

   A run of questions has to end in an answer, and the answer belongs on the
   card that asked the last question. Nothing here is new arithmetic; it is
   the decision the rail already holds, said once, where the eye already is. */
/* THE NUMBER YOU ACTUALLY AGREED ON HAD NOWHERE TO GO.

   The desk handed over a window - low, suggested, top - as three read-only
   tiles, and then logged `x.target` as though the middle tile were the deal.
   It never is. What gets counted out of the drawer is a negotiation, and the
   one figure that matters six months later is that one: it is what the
   shop's own price book learns from, what a redemption is measured against,
   and what ties the row to the ticket.

   So the run ends with a box. Empty still logs the suggestion, because a
   counter in a hurry should not be blocked - but the moment a number is
   typed, that is the number, and the screen says so before it is saved. */
/* THE TICKET NUMBER OUTLIVED THE DEAL IT BELONGED TO.
   Reported from the counter: "when i move to a different item the old deal
   number still sits in the log book at the bottom of the tool." It did.
   st.struck and st.ticket are one draft - what you handed over, and the
   ticket it was written on - and they have to be cleared together. They
   were cleared by hand in six different places, and st.ticket had only
   ever been added to one of them, startOver(). Every other way of moving
   to the next item - picking from the list, picking off a search, picking
   a book row, reading a make off a photo - cleared the amount and left the
   number.
   What that costs is not cosmetic. The ticket number is the one field on
   the row that ties it to the pawn system, so the next customer's drill
   gets logged against the last customer's ticket, and the shop's own price
   book is built out of those rows.
   One function now, called everywhere, so the two cannot drift apart
   again. */
function clearDeal(){ st.struck=""; st.ticket=""; specFromRecord={}; }
/* AND CLEARED BY THE THING ITSELF CHANGING, not by remembering to.
   Adding clearDeal() to the six by-hand sites fixed six paths and missed
   the one actually reported - picking off the search never cleared the
   draft at all, neither the amount nor the ticket. I had read the first
   test as proof it cleared the amount; it was not, the test had never
   typed one. Both survived from a PlayStation onto a DeWalt drill.
   Chasing call sites is what put this bug here. The draft belongs to one
   thing on the counter, so it is keyed to that thing: when what is being
   priced changes, the draft for the last one goes, whatever route the
   change came in by, including routes not written yet. */
/* AND THE RECORD'S FACTS ARE APPLIED THE SAME WAY, for the same reason.
   Three different places set a real st.mpPin, and wiring the first one I
   found is precisely the mistake that left st.ticket behind on the last
   customer. The facts belong to whichever model is pinned, so they are
   applied when that changes, by whatever route. */
let recordFor=null;
function recordGuard(){
  if(st.mode!=="item")return;
  const id=(st.mpPin&&st.mpPin.id)||null;
  if(id===recordFor)return;
  recordFor=id;
  specFromRecord={};
  if(id)applyRecordSpec(id);
}
let dealFor=null;
function dealGuard(){
  if(st.mode!=="item")return;
  const k=itemKey()+"|"+(st.model||"");
  if(dealFor===null){ dealFor=k; return; }
  if(k!==dealFor){ dealFor=k; clearDeal(); }
}
/* WHAT THE REDEMPTION ARITHMETIC IS FOR. One function, because the ladder
   and the rail's day-60 row were computing it separately off the suggested
   figure and there was nothing keeping them with the ticket. A pawn ticket
   is written for an AMOUNT; every figure the customer is quoted has to come
   off that same amount or one of them is a number nobody can collect.
   Only a loan has a redemption. On a buy there is no ticket, so it falls
   back to the suggested loan figure for the panels that still draw one. */
function payAmt(x){
  const k=struckAmt(x);
  const amt=(k.kind==="loan"&&k.typed)?k.amt:x.target;
  return {amt, typed:(k.kind==="loan"&&k.typed), charge:pawnCharge(amt)};
}
function struckAmt(x){
  const kind=st.struckKind==="buy"?"buy":"loan";
  const n=Number(st.struck);
  const typed=st.struck!==""&&st.struck!=null&&isFinite(n)&&n>0;
  return {kind, typed, amt:Math.round(typed?n:(kind==="buy"?x.buy:x.target))};
}
function struckNoteHTML(x){
  const k=struckAmt(x), sug=k.kind==="buy"?x.buy:x.target;
  /* 26 words to say "empty keeps $30". The reason it matters - that the
     price book is built out of typed figures - is read once and then
     known, so it moved behind the button. */
  if(!k.typed)return `Empty keeps the suggested <b style="color:var(--ink)">${money(sug)}</b>. ${infoBtn("log-what")}`;
  if(k.kind==="loan"&&k.amt>x.high)
    return `<b style="color:var(--bad-ink)">${money(k.amt)} is over the ${money(x.high)} top.</b> That is the cushion spent. It will log exactly as typed — he gets it back for ${money(k.amt+pawnCharge(k.amt))} by day 30, interest ${money(pawnCharge(k.amt))}.`;
  return k.kind==="loan"
    ? `Lent <b style="color:var(--ink)">${money(k.amt)}</b> — he gets it back for <b style="color:var(--ink)">${money(k.amt+pawnCharge(k.amt))}</b> by day 30, interest ${money(pawnCharge(k.amt))}. This is what the log keeps.`
    : `Bought outright for <b style="color:var(--ink)">${money(k.amt)}</b> — no loan, no ticket to redeem. This is what the log keeps.`;
}
function struckHTML(x){
  const k=struckAmt(x), sug=k.kind==="buy"?x.buy:x.target;
  return `<div class="struck">
    <span class="label" style="margin:0">What you actually did — the number that gets logged</span>
    <div class="struckRow">
      ${/* THE SAME DECISION, ASKED TWICE. Reported from the counter:
            "should we need an additional selector (lent, bought) under the
            two large buy or pawn buttons... if we pick one of the large
            buttons it should autopopulate the other parts." It should, and
            now it does - the tiles ARE this control. Two states for one
            decision could also disagree: the tiles could say Pawn while the
            log said Bought, and the log is what the price book is built
            out of. There is one field now, st.struckKind, and struckAmt
            already reads the suggested figure, the Use button and the note
            off it, so pressing a tile fills this strip in. */""}
      <div class="struckWas">${k.kind==="loan"?"Lent":"Bought"}</div>
      <input class="numIn struckIn" type="number" inputmode="decimal" min="0" step="1" autocomplete="off"
        placeholder="${Math.round(sug)}" value="${esc(st.struck==null?"":String(st.struck))}"
        aria-label="What you actually ${k.kind==="loan"?"lent":"paid"}">
      <button type="button" class="ghostBtn struckUse" data-struckset="${Math.round(sug)}">Use ${money(sug)}</button>
    </div>
    <div class="struckNote cardHint" style="margin-top:8px">${struckNoteHTML(x)}</div>
    ${/* ONE PLACE TO WRITE THE DEAL DOWN.
          "Seems like there are about 4 different spots to log the deal."
          There were: this strip, a SECOND copy of this same strip inside a
          separate Deal log card, the button that scrolls between them, and
          the button that actually saves. Two live inputs bound to one
          value, 365px apart.
          The ticket number and the Save button belong with the amount they
          describe, so they are here, and the separate card is gone. That
          is 365px off the finished page and one fewer thing that can
          disagree with itself. */""}
    ${CAP.db?`<div class="row2" style="margin:9px 0">
      <input id="logTicket" class="numIn" type="text" inputmode="numeric" autocomplete="off"
        placeholder="Ticket # (optional)" value="${esc(st.ticket||"")}"
        style="flex:1;min-width:0;font-family:var(--mono);font-size:14px"></div>
    <button id="logDeal" class="brassBtn" style="width:100%;padding:11px 0"
      title="Saves the item, your estimate, the offer and the ticket number.">Log this deal</button>
    <div class="cardHint" id="logMsg" style="margin-top:7px">${/* The privacy line STAYS on the screen. s. 539.001(9) is why this log
         holds item facts only, and a compliance reminder behind a hover is
         a compliance reminder nobody reads. What went is the list of the
         four fields, which the form above it already shows. */""}Item facts only &mdash; no name, no address, no ID.${(()=>{const t=soldStats(dealKey());return t?` You've sold ${t.n} of these.`:"";})()}</div>`
    :`<div class="cardHint" style="margin-top:7px">Logging is not available on this device.</div>`}
  </div>`;
}
/* "HOW IS IT THAT WE HAVE A PRICE YET NOTHING WAS LOOKED UP? this is one of
   our shorcut items from the homepage. i thought atleast those had a some
   data backing them up."

   He picked a string trimmer, the record named it a Stihl FS 131, and the
   card printed BUY $150 / PAWN $105 with no warning on it at all while the
   rail three inches away said "Nothing looked up - no source at all".
   Both were telling the truth about different things, which is the worst
   kind of screen.

   Traced:

     Stihl FS 131   checked=TRUE  conf=l  source=""           no count
     Ryobi 40V      checked=TRUE  conf=h  source=ebay link    4 eBay sales

   `checked` means THE BOOK HAS A FIGURE. It does not mean anybody measured
   anything. For the Ryobi that is the same thing; for the Stihl it is a
   range somebody typed on 22 September with a low-confidence flag and no
   source, and the money card could not tell them apart.

   187 of the book's 519 rows are in the Stihl's position - a figure with no
   count behind it. He has now hit one twice and had to ask me to find out
   which kind he was looking at.

   THIS CHANGES NO ARITHMETIC. resale, buy and lend are untouched, and so is
   the 8% guard on the loan, because moving those is his call and not mine.
   What changes is whether the card ADMITS what it is standing on. */
/* ══════════════════════════════════════════════════════════════════════
   WHERE A TYPED NUMBER CAME FROM.

   "when you type a price in, you pick where you got it."

   Until now every typed figure was recorded the same way - kind "hand",
   a number, nothing else - and the desk described all of them with one
   sentence: "You typed this price for the item in front of you, so it is
   used exactly as you entered it." The evidence bar drew it at 100% and
   evidenceTier called it COUNTED, the same tier as twelve counted eBay
   sales.

   That sentence is a guess about where he was looking. A figure read off
   a sold page, a figure off Bravo's estimator, a figure off this shop's
   own sales and a figure off the top of his head all landed in the same
   record and all read as proof. "i want verifiable sales data to back up
   every purchase" cannot be satisfied by a field that cannot tell those
   apart.

   So the typed figure carries a source and a date now. The source is not
   an extra tap: the five source buttons ARE the save, so it is the one
   tap it always was, and there is no path that records a number with no
   provenance at all - including his own judgement, which is a real answer
   and says so in those words.

   THIS MOVES NO MONEY. resale, buy and lend are untouched, and so is the
   8% guard. What changes is what the screen admits it is standing on.
   evidenceTier is display, and the two figures that stop claiming to be
   counted - an asking price and his own judgement - are the two that were
   never counted. */
const HAND_SRC=[
  {id:"mine",  t:"What we get for them here", sub:"this shop's own sales",  tier:"counted"},
  {id:"bravo", t:"Bravo Estimator",           sub:"their figure, off real pawn deals", tier:"counted"},
  {id:"sold",  t:"A sold price I read",       sub:"eBay, GunBroker, a sold page", tier:"counted"},
  {id:"ask",   t:"An asking price I saw",     sub:"nobody has paid it yet", tier:"sourced"},
  {id:"gut",   t:"My own judgement",          sub:"nothing looked up",      tier:"none"}
];
const HAND_BY_ID={}; HAND_SRC.forEach(s=>{ HAND_BY_ID[s.id]=s; });
function handSrc(id){ return HAND_BY_ID[String(id||"")]||null; }
/* ONE WRITER, BECAUSE THERE ARE THREE BOXES.
   Step 4 on the desk, the step card's own box, and the phone all wrote
   this record separately and identically, which is how a fourth field
   ends up on two of them and not the third. */
function handMarket(n,src){
  return {kind:"hand",key:mkKey(),mid:Math.round(n),src:String(src||""),date:todayStr()};
}
/* An older record, saved before the source existed, has no src. It is not
   relabelled as a guess - nobody asked it that question - it says it was
   not asked. */
function handSrcHTML(cur){
  return `<div class="label" style="margin-top:12px">Where did that figure come from?</div>
    <div class="handSrc">${HAND_SRC.map(s=>`<button type="button" class="nsBtn${cur===s.id?" on":""}" data-handsrc="${s.id}"><span>${esc(s.t)}</span><b>${esc(s.sub)}</b></button>`).join("")}</div>`;
}
function wireHandSrc(valId){
  document.querySelectorAll("[data-handsrc]").forEach(b=>b.onclick=()=>{
    const v=document.getElementById(valId), n=parseFloat(v&&v.value);
    /* No number yet: the tap is not an error, it is early. Put him back in
       the box rather than saving nothing and re-rendering as though
       something happened. */
    if(!(n>0)){ if(v){ v.focus(); } return; }
    st.market=handMarket(n,b.dataset.handsrc); st.editing=false; render();
  });
}
function evidenceBacked(x){
  const m=x&&x.market;
  if(!m||m.stale)return false;
  /* typed in by hand at the counter is evidence - he saw the page */
  if(m.kind==="hand"||m.kind==="shot"||m.kind==="found"||m.kind==="harvest"||m.kind==="own")return true;
  if(m.kind!=="list")return !!x.checked;
  /* a book row is backed when something was actually counted, or there is
     a page to go and check. Low confidence alone is not disqualifying -
     a counted figure that is thin is still a counted figure - but a low
     one with neither a count nor a source is just somebody's number. */
  const counted=/\b\d+\s+(ebay\s+)?(sales|listings|sold)/i.test(String(m.note||""));
  const sourced=!!String(m.src||"").trim();
  return counted||sourced;
}
/* THREE TIERS, NOT TWO, BECAUSE THE FIRST CUT WAS TOO GENEROUS.
   Measured across the book: 303 rows carry a counted figure, 178 carry a
   page you can open but nothing counted, and 6 carry neither. Treating the
   middle 178 as "backed" would have let a gunwatcher link stand in for a
   sale, and "i want verifiable sales data to back up every purchase" is
   not satisfied by a link nobody has opened.
   So the card says which of the three it is standing on. */
function evidenceTier(x){
  const m=x&&x.market;
  if(!m||m.stale)return "none";
  /* A TYPED FIGURE IS WORTH WHAT ITS SOURCE IS WORTH.
     This returned "counted" for every hand-typed number, so a price off
     the top of his head read as verified on the same line that twelve
     counted eBay sales read as verified. The source says which. A record
     saved before the source field existed keeps the old answer rather
     than being downgraded for a question it was never asked. */
  if(m.kind==="hand"){
    const hs=handSrc(m.src);
    return hs?hs.tier:(x.checked?"counted":"none");
  }
  if(m.kind!=="list")return x.checked?"counted":"none";
  if(/\b\d+\s+(ebay\s+)?(sales|listings|sold)/i.test(String(m.note||"")))return "counted";
  return String(m.src||"").trim()?"sourced":"none";
}
function askDoneHTML(x){
  /* THE GATE WAS ON THE QUIET CARD AND MISSING FROM THE LOUD ONE.
     Reported from the counter with two screenshots of the same iPhone and
     the question "what is the difference in these 2". The difference was
     that card 7 refused to quote a loan - "0 of 3 checks answered ... a
     fake is not worth a share of the real one, it is worth nothing" - while
     THIS card, headed "That is everything - here is the answer", printed
     BUY $130 and PAWN LOAN $130 in the largest type on the screen.
     ticketHTML has carried `if(F&&F.blocks)` since the fakes sheets went
     in. askDoneHTML never got it. So the one card a counter actually reads
     off answered a question the tool had decided it could not answer, and
     the honest refusal was four hundred pixels below the fold.
     A stolen or counterfeit iPhone is the exact case these sheets exist
     for, and $130 of the shop's money was riding on which card he read. */
  {
    const F=fakeState(fakeSheet(x));
    if(F&&F.blocks)return `<div class="askDone bad">
      <div class="adHd">That is everything &mdash; <b>except the one that decides it</b></div>
      <div class="adWhat">${esc(displayName(x))}${st.condSet?` \u00b7 ${esc((COND_WORDS[st.cond]||[st.cond])[0])}`:""}</div>
      <div class="adBig">${F.verdict==="fail"?"Don\u2019t lend on the name":"No figure yet"}</div>
      <div class="adWhy">${F.verdict==="fail"
        ? `A check on the ${esc(F.sh.title.toLowerCase())} sheet failed. Lend on what you can prove &mdash; the metal, a no-name value &mdash; or pass.`
        : `${F.done} of ${F.n} authenticity checks done on the ${esc(F.sh.title.toLowerCase())} sheet. Work that card first: a fake is not worth a share of the real one, it is worth nothing. The price research is finished &mdash; this is the other question.`}</div>
    </div>`;
  }
  if(x.buyTooThin)return `<div class="askDone bad">
    <div class="adHd">That is everything &mdash; <b>and the answer is no</b></div>
    <div class="adWhat">${esc(displayName(x))}${st.condSet?` \u00b7 ${esc((COND_WORDS[st.cond]||[st.cond])[0])}`:""}</div>
    <div class="adBig">Walk away</div>
    <div class="adWhy">It will not clear the ${money(x.buyFloor)} you want out of it &mdash; not as a buy, and not as a loan you end up owning. Hand it back.</div>
  </div>`;
  return `<div class="askDone">
    <div class="adHd">That is everything &mdash; <b>here is the answer</b></div>
    <div class="adWhat">${esc(displayName(x))}${st.condSet?` \u00b7 ${esc((COND_WORDS[st.cond]||[st.cond])[0])}`:""}</div>
    <!-- THREE EQUAL BOXES AND NO WAY TO TELL WHICH WAS WHICH.
         Reported from the counter: "the pawn price and buy now price
         should be the most visible numbers so I don't get confused on what
         number is what." They were three identical tiles in a row, and one
         of them was not even a decision - resale is what the other two are
         BUILT from, and it was wearing the same size and the same box.
         So: two decisions, large, side by side, each labelled with the kind
         of deal rather than a verb - a counter reading "Or lend him" has to
         work out that this is the pawn number, and "Buy it for" and "Or
         lend him" look alike at arm's length. Each carries the one line
         that says what it commits you to. Resale drops to a line of
         evidence underneath, where it explains the two above it.
         "He pays back by day 30" came out of this row entirely: it is the
         first rung of the ladder on the rail, in the same typeface, four
         inches away - the duplication the counter asked about, and mine. -->
    ${/* THEY LOOKED LIKE A CHOICE AND WERE NOT ONE.
          Reported from the counter, about the rail: "it appears that this
          should be selectable but its not." The same is true of this pair,
          and more so - two deal names, two prices, one of them filled in
          the accent every other button on the screen uses to mean
          "chosen". Reading that as a control is not a misreading, it is
          the only sensible reading. Either the shape stops promising a
          choice, or the choice becomes real. It is a real choice: which
          of these two deals you are doing is THE decision at the counter,
          and the rail has room to show the one you picked in full. */""}
    <div class="adPair" role="group" aria-label="Which deal are you doing?">
      <button type="button" class="adDeal buy${st.struckKind==="buy"?" on":""}"
              data-ideal="buy" aria-pressed="${st.struckKind==="buy"}">
        <div class="k">Buy it outright</div>
        <div class="d">${money(x.buy)}</div>
        <div class="s">Yours. Nothing to pay back, nothing to hold.</div>
      </button>
      <button type="button" class="adDeal lend${st.struckKind!=="buy"?" on":""}"
              data-ideal="loan" aria-pressed="${st.struckKind!=="buy"}">
        <div class="k">Pawn loan</div>
        <div class="d">${money(x.target)}</div>
        ${/* "He pays back $131" was read at the counter as $131 of INTEREST
              on a $105 loan. Understandable: the words sit next to a fee, and
              "pays" goes with "fee" in every other sentence on this screen.
              So the line names what the figure IS - the amount that gets the
              thing off the shelf - and then splits it, which makes reading it
              as interest impossible. */""}
        <div class="s">To get it back: <b>${money(x.target+x.charge)}</b> by day 30 \u2014 the ${money(x.target)} plus ${money(x.charge)} interest.</div>
      </button>
    </div>
    ${/* IF IT STOPS ASKING, IT HAS TO SAY WHAT IT ASSUMED.
          Two questions no longer reach the counter because the record
          answers them. That is only an improvement while the answer is
          visible - a tool that quietly decides a saw is farm grade and
          prices it 10% up has taken a decision away rather than saved a
          step. So the facts it supplied are named, with the model they
          came from, and every one is still reachable through the dots to
          be overruled on the one in his hands. */""}
    ${Object.keys(specFromRecord).length?`<button type="button" class="adRec" id="recUndo"><b>From the record</b>${st.mpPin&&st.mpPin.model?` for ${esc(st.mpPin.model)}`:""} &mdash; ${Object.values(specFromRecord).map(esc).join(" \u00b7 ")}. <span class="adRecHow">Press to answer these yourself if this one differs.</span></button>`:""}
    ${/* "we need to show our buy at percent for items, so i can see how we
          got to certain numbers." The gold card has said "buying 75% of
          melt" since the day he asked for it there, and the item card never
          said the same thing - it printed two numbers and the resale they
          came from and left the arithmetic between them unstated. Same
          figure, same words, read off the same calcItem that produced the
          numbers rather than worked out again here, which is the mistake
          that once had the melt card claiming 48% while handing over 42%. */""}
    <div class="adWhy">${(()=>{const T=evidenceTier(x);
      if(T==="counted")return "";
      if(T==="sourced")return `<b style="color:var(--warn-ink)">Not a counted sale.</b> A figure off a page nobody has opened today &mdash; check it before real money moves. `;
      return `<b style="color:var(--warn-ink)">${x.checked?"Estimate &mdash; a built-in figure, nothing counted and no source.":"Estimate &mdash; nothing looked up."}</b> `;})()}<b>Resells for ${money(Math.round(x.resale))}</b> in this shape &mdash; that is where both numbers come from.${(x.resale>0)?` Buying at <b>${Math.round(x.buy/x.resale*100)}%</b> of that, lending <b>${Math.round(x.target/x.resale*100)}%</b>.`:""}${deskRail()?"":` Lend anywhere in ${money(x.low)}&ndash;${money(x.high)}, never above the top.`}${/*
      "I DONT SEE THE PAWN SCHEDULE." Said the day after I told him it
      follows the amount he types in. It does - and it lives in a closed
      fold on card 8, four cards and a scroll below the answer, which at a
      counter is the same as not existing.
      IT RIDES THIS LINE RATHER THAN GETTING ITS OWN. A row of its own cost
      20px and check-stage went red for the right reason: the finished page
      is held to one screen and was at 960 of 960. The budget is not
      negotiable just because my link is nice to have, and this sentence
      already ends where a link can follow it. */""}${st.struckKind!=="buy"?` <button type="button" class="adSched" id="toSchedule">Full schedule &rsaquo;</button>`:""}</div>
    ${/* THE LOG STRIP WAS THE WHOLE OVERAGE, MEASURED TO THE PIXEL.
          On the Item tab at 150% Windows scaling: colQ shows 552px and
          held 848. The strip is 297px. The overage was 296.
          It is also not an Item: "what you actually did - the number that
          gets logged" is the record of a deal, and it already knows which
          deal it is, because it reads st.struckKind and says Lent or
          Bought. So it moves to whichever tab that is, where there is room
          for it, and the Item tab fits the screen without one. */""}
    ${itemTabbed(x)?"":struckHTML(x)}
    <!-- ANYTHING ELSE IS A NOTEPAD, NOT A QUESTION, AND IT IS STEP 8 NOW.
         Moving it after the condition made it the last card - and the
         answer card replaces the last card, so the box would have been
         swallowed before the counter ever saw it. A catch-all has no
         answer to give up its card for, and it also does not deserve a
         card: it comes into the answer, beside the amount, where the last
         thing before writing a ticket is "anything odd about this one". -->
    <label class="adNote"><span>Anything else? <i>optional &mdash; only what changes the price</i></span>
      <input id="detailIn" type="text" autocomplete="off" placeholder="${esc(detailPh(x))}" value="${esc(st.detail)}" class="numIn"></label>
  </div>`;
}
/* IS THE RUN OVER. It was a local inside askHTML, which was fine while the
   only thing that cared was the card asking the questions. Two other things
   care now - the deal log, which has no business on screen before there is
   a deal to log, and the market-check panel, which is a tool for getting TO
   a price rather than something to read once you have one. Copying the test
   into each of them is exactly how st.ticket and st.struck drifted apart.
   One predicate, three readers. */
function runFinished(x){
  const q=askQueue(x);
  const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
  return q.every(z=>z.answered)&&at>=q.length-1&&!st.askEdit;
}
function askHTML(x){
  const q=askQueue(x);
  const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
  const cur=q[at];
  const opt=(o)=>`<button class="askOpt${o.on?" on":""}" data-ask="${esc(o.set)}" data-askv="${esc(o.v)}">`
    +`<span class="askT">${esc(o.t)}</span>${o.sub?`<span class="askS">${esc(o.sub)}</span>`:""}</button>`;
  const dh=detailHint(x);
  const cov=coveredLine();
  const mods=(cur.kind==="model")?mpCandidates():[];
  const bq=st.brandQ||st.brandTyped||"";
  const hits=(cur.id==="brand")?brandHits(st.catId,bq):[];
  const body=cur.kind==="worth"
    ? `<div class="askWorth">${step4Inner(x,true)}</div>`
    : cur.id==="brand"
    ? `<div class="askWorth">
         <span class="label">Make</span>
         <input id="askBrandIn" type="text" autocomplete="off" placeholder="Start typing \u2014 Stihl, DeWalt, Ryobi\u2026" value="${esc(bq)}" class="numIn" style="font-family:var(--sans);font-size:15px">
         ${hits.length?`<div class="askOpts askHits">${hits.map(h=>
             `<button class="askOpt${(st.brandTyped||"").toLowerCase()===h.name.toLowerCase()?" on":""}" data-brandpick="${esc(h.name)}" data-brandtier="${esc(h.tier)}"><span class="askT">${esc(h.name)}</span><span class="askS">${esc(tierLabel(x,h.tier))}</span></button>`
           ).join("")}</div>`
          :`<div class="cardHint">${bq?"<b>"+esc(bq)+"</b> is not on the list for "+esc(String(x.cat.label||"this").toLowerCase())+" \u2014 say where it sits below and the price follows.":"Type a make above, or just say where it sits below."}</div>`}
         <span class="label" style="margin-top:14px">Or just say where it sits</span>
         <div class="askOpts">${(cur.opts||[]).map(opt).join("")}</div>
       </div>`
    : cur.kind==="model"
    ? `<div class="askWorth">
         ${mods.length?`<span class="label">${esc(st.brandTyped||"Known")} models with measured prices</span>
           <div class="askOpts askHits">${mods.map(r=>
             `<button class="askOpt${(st.model||"")===String(r[2])?" on":""}" data-modelpick="${esc(r[0])}"><span class="askT">${esc(r[2])}</span><span class="askS">${money(r[3])}&ndash;${money(r[4])} resale</span></button>`
           ).join("")}</div>
           <span class="label" style="margin-top:14px">Or type it</span>`
          :`<span class="label">Model</span>`}
         <input id="modelIn" type="text" autocomplete="off" placeholder="870 Wingmaster, MS 271, 10/22\u2026" value="${esc(st.model)}" class="numIn" style="font-family:var(--sans);font-size:15px">
         ${(()=>{ /* SAY IT HERE, NOT AT THE PRICE STEP.
              A television, a chainsaw, a fridge: the desk will not look
              these up, on purpose, because the search comes back with
              remotes and bars and door seals. Typing a model in good faith
              and only finding that out two cards later - on a screen that
              then asks you to go do the research yourself - is the tool
              wasting your time and then blaming you for it. */
            const b=(typeof ebayBlind==="function")?ebayBlind(x):"";
            return b?`<div class="cardHint" style="margin-top:8px;border-left:2px solid var(--warn);padding-left:9px;color:var(--ink-2)"><b style="color:var(--warn-ink)">This one cannot be looked up.</b> ${esc(b)} Put the model in anyway &mdash; it sharpens the sold-price buttons, and you type the figure in at the next step.</div>`:"";
          })()}
         ${cov?`<div class="cardHint" style="margin-top:6px">${esc(cov)}</div>`:""}
         <div class="cardHint" id="specVerdict">${specVerdictHTML(x)}</div>
       </div>`
    : cur.kind==="extra"
    ? `<div class="askWorth">
         <input id="detailIn" type="text" autocomplete="off" placeholder="${esc(detailPh(x))}" value="${esc(st.detail)}" class="numIn" style="font-family:var(--sans);font-size:15px">
         ${/* Three sentences of theory about how search narrowing works, on
              a box most people should walk straight past. "I have no idea
              what the second picture is." The reason extra words hurt is
              true and belongs in the commit, not on the counter's screen at
              the moment he is deciding whether to type anything. One line:
              what to do, and the one case where typing helps. */""}
         <div class="cardHint" style="margin-top:8px">Usually nothing &mdash; skip it. Only type something if it changes the price and nothing above asked for it.</div>
       </div>`
    : `<div class="askOpts">${(cur.opts||[]).map(opt).join("")}</div>`;
  /* THE LAST QUESTION STAYED ON SCREEN AFTER IT WAS ANSWERED.
     Reported from the counter: "after I'm done with step 8, it needs to go
     away and move the deal details into the top section." Right - five
     condition buttons with one of them lit, above the answer they produced,
     is the form still asking after it has been filled in. The answer takes
     the card; Back and the dots still reach every question, including this
     one, so nothing is locked in. */
  const allDone=q.every(z=>z.answered);
  /* "Change an answer" has to reach the question this card REPLACED, not
     the one before it - the counter just answered the condition, and a back
     button that lands on "Anything else?" is answering a question nobody
     asked. askEdit puts the last question back on screen in place of the
     answer; anything that moves the run clears it. */
  const finished=runFinished(x);
  /* "Change an answer" has to land on a question with an answer in it. Once
     "Anything else?" became step 8 the card being replaced was the notepad,
     so the button reopened an empty text box - technically the card it had
     taken over, and useless. It goes to the last question that actually
     asked something, which is the condition. */
  /* THE QUESTION THIS CARD REPLACED, which is not the same as the last one
     in the list. lastReal walked backwards for the final non-optional
     question, and that was the condition while the condition was last. Move
     the sold-price lookup to the end - which happens whenever there is no
     service - and the last non-optional question IS the lookup, so the
     button reopened a price instead of the condition just answered.
     st.askFrom is the card the run actually left. The old walk stays as the
     fallback: a run restored from storage, or one that finished without
     ever advancing, has no card to go back to. */
  const lastReal=(()=>{
    const f=Number(st.askFrom);
    if(Number.isInteger(f)&&f>=0&&f<q.length&&!q[f].optional)return f;
    for(let i=q.length-1;i>=0;i--) if(!q[i].optional)return i;
    return Math.max(0,q.length-1);
  })();
  if(finished)return `<div class="card askCard askFin" id="askCard">
    <div class="askWhere">${q.length} of ${q.length} \u00b7 all answered</div>
    ${x&&x.spec&&x.spec.stop?`<div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink);margin-bottom:10px"><b>NO TITLE &mdash; NO DEAL.</b> Don't negotiate around a missing title, at any price.</div>`:""}
    ${askDoneHTML(x)}
    <div class="askNav">
      <button class="ghostBtn" data-askgo="${lastReal}">&larr; Change an answer</button>
      <div class="askDots">${q.map((z,i)=>`<i class="${i===at?"on":""}${z.answered?(z.auto?" auto":" done"):""}" title="${esc(z.title)}${z.auto?" \u2014 filled in for you":""}" data-askgo="${i}"></i>`).join("")}</div>
      <button class="brassBtn" data-askdone="log">Write the ticket &darr;</button>
    </div>
  </div>`;
  /* A STOP HAS TO LAND WHEN IT IS SAID, NOT SEVEN QUESTIONS LATER.
     "NO title" sets spec.stop the moment it is tapped, and the banner that
     says NO DEAL AT ANY PRICE was only on the answer card at the end of the
     run. So the counter told the desk the quad has no title and the desk
     asked him what class it was, what shape it was in, what came with it,
     and what one sells for - and only then said not to buy it. Found by
     the dead-question sweep, which is the same family: an answer the screen
     collects and does not act on. It rides the run now, above the question,
     from the tap onward. */
  const stopNow=x&&x.spec&&x.spec.stop
    ?`<div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink);margin-bottom:10px"><b>NO TITLE &mdash; NO DEAL.</b> Don't negotiate around a missing title, at any price. Nothing below changes that.</div>`
    :"";
  return `<div class="card askCard" id="askCard">
    <div class="askWhere">${at+1} of ${q.length}${allDone?" \u00b7 all answered":""}</div>
    ${stopNow}
    <div class="askQ">${esc(cur.title)}</div>
    ${/* When a measured row is driving the price the tier is not in that
          arithmetic, so the card has to say the tap will not move the
          number - otherwise a make read off the name looks like the thing
          the price is built on. */""}
    ${cur.named?`<div class="cardHint" style="margin-top:0"><b style="color:var(--accent)">${esc(cur.named)}</b> &mdash; read off the name. Tap another if it is wrong.${cur.tierMoot?" The price here is a measured figure for this exact model, and a make tier is not part of that arithmetic \u2014 the tap goes on the ticket, not into the number.":""}</div>`
      :cur.hint?`<div class="cardHint" style="margin-top:0">${esc(cur.hint)}</div>`:""}
    ${body}
    <div class="askNav">
      ${at<=0
        /* THE SAME DEAD BUTTON, AT THE OTHER END OF THE RUN.
           Back was disabled on question one because there is no earlier
           question - true, and useless. What the counter wants there is
           the way OUT: he has picked the wrong thing off the search box
           and needs to pick again. A greyed control where the way back
           should be reads as broken, exactly as the dead "Next" did on
           the last card, and it was reported as broken for the same
           reason. So question one goes back to the search. */
        /* Was "Pick another", while the rail's button for the identical
           action said "Start over". Two names for one thing, and he asked
           twice how to get back to the beginning - once as "how do i reset
           and start a new lookup?" and again here. "Pick another" reads as
           "choose a different one from this list", which on the Which-of-
           these card is a different action entirely. */
        ? `<button class="ghostBtn" data-askout="1" title="Clear this item and go back to the search box">&larr; Start over</button>`
        : `<button class="ghostBtn" data-askmove="-1">&larr; Back</button>`}
      <div class="askDots">${q.map((z,i)=>`<i class="${i===at?"on":""}${z.answered?(z.auto?" auto":" done"):""}" title="${esc(z.title)}${z.auto?" \u2014 filled in for you":""}" data-askgo="${i}"></i>`).join("")}</div>
      ${at>=q.length-1
        /* A DEAD BUTTON IS NOT AN ENDING.
           The last card used to carry a DISABLED button still labelled
           "Next", which reads as broken, not finished - you answer the
           last question and the only thing that looks like a way forward
           stops responding. There is more page below it and nothing says
           so. So the last step gets a live button that says what it does
           and takes you to the detail. */
        ? (()=>{ /* "SEE THE DETAIL" SAID NOTHING AND DID NOTHING.
               It was my guess at what comes after the last question, and
               it was wrong twice: nobody knows which detail, and on a desk
               the card it scrolled to is already on screen, so the click
               had no visible effect at all. A button that does nothing
               visible is a broken button, whatever it does internally.
               What comes next is not a place, it is the next ACTION -
               either the run has a gap in it, or it is finished and the
               deal wants logging. Say which. */
             const open=q.findIndex(z=>!z.answered);
             if(open<0)return `<button class="brassBtn" data-askdone="log">Write the ticket &darr;</button>`;
             /* "Still to answer: What does one sell for used?" reads as a
                question printed on a button rather than somewhere to go.
                The move first, the destination after it. */
             if(open!==at)return `<button class="brassBtn" data-askgo="${open}">Next → ${esc(q[open].title.replace(/\?$/,""))}</button>`;
             return `<button class="brassBtn" data-askdone="here">Pick one above &uarr;</button>`;
           })()
        : `<button class="brassBtn" data-askmove="1">${cur.answered?"Next":"Skip"} &rarr;</button>`}
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
  const bits=[makeIfMissing(st.brandTyped||(x.brandName||""),st.model||""),
              st.model||"",st.detail||""].map(t=>String(t).trim()).filter(Boolean);
  return bits.length?esc(bits.join(" \u00b7 ")):"not set";
}
/* "GET RID OF THESE EXTREMLY LONG AND WORDY EXPLANATIONS. MAYBE AN INFO
   BUTTON THAT WE CAN HOVER OVER AND GET MORE DETAIL."

   The standing complaint about this tool, said plainly enough this time to
   build against. Measured on a finished DeWalt: 705 words across six cards,
   and the single worst was the redemption card at 258.

   One button, one store of text. The short sentence stays on the card; the
   paragraph lives in here and appears on hover or on tap. Tap matters: the
   phone has no hover, and a detail only a mouse can reach is a detail the
   field screen does not have. */
const INFO={
 "sale-why":"A buy is a nought-day position. You own it the moment you pay, so the only risk is whether it sells and for how much \u2014 there is no 60-day clock and nothing to hand back. That is why the buy rate is higher than the lend rate on the same item.",
 "pawn-clock":"Day 30 the ticket matures. You must then hold it 30 more days. Not redeemed by day 60 and title passes to you automatically \u2014 no notice, no letter, no auction. Within the first 30 days only he, or his attorney-in-fact, may redeem it.",
 "pawn-charge":"After day 60 it keeps running at the 30-day charge split over 30 days. All of that is \u00a7 539.001(11)(b) and (c), not shop policy \u2014 the rate for a late redemption is set by statute, not priced by you, and charging above it voids the transaction.",
 "log-what":"Leave it empty and the log keeps the suggested figure. Type what you actually handed over instead \u2014 the shop's own price book is built out of this number, so a typed figure teaches it and a blank one does not.",
 "evidence":"Sold prices are what somebody paid. Asking prices are what a seller hopes for and run high. A built-in figure is neither \u2014 it is this book's starting point for the kind of thing it is. The bar shows which one is behind the number.",
 /* ══ THE SETUP SCREEN'S PARAGRAPHS ═══════════════════════════════════
    "get rid of these extemrly long and wordy explanations. maybe an info
    button that we can hover over and get more detail." Said twice, and the
    info button he asked for was built for the item screens and never
    reached the screen that needed it most.

    Measured every screen state on both surfaces before cutting anything,
    counting every visible word:

      phone  home 56   mid-run 80-109   finished 82-84   SETUP 248
      desk   home 163  mid-run 192-203  finished 340-363 SETUP 450

    Setup was the wordiest screen in the tool on both, and one block was a
    third of it: 153 words explaining four layout modes, permanently on
    screen, under four buttons whose names already say what they do. That
    is documentation, and documentation is what an info button is for.

    Each entry below came off the screen and went in here. Nothing was
    deleted - every one of these is reachable in one tap or hover. */
 "flow-modes":"One question at a time: one question on the screen, big answers, and answering it moves on by itself. Back, or any dot, goes anywhere. One page at a time: one job to a page \u2014 what it is, what it is worth, condition, your offer \u2014 with the price always on top. It is the default, because everything at once is thirteen cards. One step at a time: the step you are on, with the rest folded to a line carrying its answer. The way the phone works, and it fits an item on about one screen. Everything open: every step expanded at once, the old layout.",
 "own-prices":"tools/pawn-desk-prices.xlsx in the repository has all of them, a sheet per kind of thing, and a spreadsheet beats a phone screen for going through them. Blank rows are left exactly as they are, so a few at a time is fine.",
 "handoff-qr":"The link works once per device, and wipes itself out of the phone's address bar as soon as it is read \u2014 so the token never goes into a text message or sits in a history.",
 "shelf-move":"With the service on, Sync on the pricing page does this by itself. These two are for moving the record by hand between devices, or for keeping a copy.",
 "hard-reload":"This throws away the files this browser has cached and fetches them again from the site. Nothing you have recorded is touched \u2014 shelf tags, listings and the deal log are kept separately.",
 /* THREE OF THESE CAME BACK AT 19 TO 24 WORDS AND check-tabs WAS RIGHT
    TO GO RED. Its rule is that an info button holds a real paragraph,
    not the same six words the label already said - which is the
    difference between moving an explanation off a screen and pretending
    to. A fact that short was never the clutter; it either belongs on the
    screen or it belongs here with the rest of what it means. These three
    had the rest. */
 "conn-test":"It sends a real request, the same way the camera does, and prints what comes back. A good answer names the service and the lookups it can reach. A bad one says which part failed \u2014 the address, the token, or the service itself being down \u2014 so you are not guessing which of the three to fix.",
 "device-each":"Every phone and tablet keeps its own copy of the settings, so each one has to be told once. A device nobody told looks like it is working: it prices things off the built-in figures and simply never looks anything up. If a phone is quiet about sold prices, this is the first thing to check.",
 "token-key":"The token is the only thing between the open internet and this shop's lookups, and the lookups cost money, so treat it like a key to the building. If a phone goes missing, change PAWN_TOKEN in Railway and switch each device on again \u2014 that locks out the lost one and nothing else.",
 /* The gold screen was 720 words, more than any other screen in the tool,
    and these two hints were 93 of them. Both say why the arithmetic is
    what it is, which is what this map is for. The suggested-rate line
    kept its arithmetic and lost its market analysis to infoBtnText,
    which takes the text rather than a key because that half is worked
    out this morning. */
 "melt-policy":"Shop policy, set here and kept \u2014 it does not reset tomorrow. The trade puts a walk-in counter at 75\u201385% of melt on a gold buy; a mail-in refiner pays 85\u201395% and holds nothing for 30 days.",
 "melt-avg":"A buy is priced off today's price: scrap ships fast and the spread is the profit. A loan is a 60-day bet, so it is priced off the LOWER of today's price or this average \u2014 if today is a peak, the loan is sized as if the peak never happened.",
 "melt-double":"This is for the DIRECTION the market has been going. How hard it is swinging is priced into the guard below instead, so the two are not charging you for the same thing twice.",
 "log-why":"After a few months this list is worth more than any outside price guide \u2014 it is the only record of what things actually bring in Bristol."
};
function infoBtn(key){
  const t=INFO[key]; if(!t)return "";
  return infoBtnText(t,key);
}
/* THE DETAIL IS NOT ALWAYS A FIXED STRING.
   The gold card's long half is worked out this morning - how far off the
   peak, which side of the 200-day average, how hard it is swinging - so it
   cannot live in the INFO map. The popup text is already inline in the
   HTML, so taking the text instead of a key costs nothing. The handler
   only looks for data-info. */
function infoBtnText(t,key){
  if(!t)return "";
  return `<button type="button" class="infoBtn" data-info="${esc(key||"x")}"
    aria-label="More detail">i<span class="infoPop" role="tooltip">${esc(String(t).replace(/<[^>]+>/g,""))}</span></button>`;
}
/* TABS ACROSS THE TOP, BECAUSE EVERYTHING WAS IN ONE COLUMN.
   "we need tabs across the top so i canfind everything. the item, the
   pawn, the sale" - and before that, "im also tired of the constant
   scrolling and scrolling of windows with info buried under other
   windowss."

   Measured first. At 100% Windows scaling nothing scrolls, which is why I
   had never seen it: every suite in this repo runs at 1400x900 or wider.
   At HIS scaling it is a third of the column:

     100%  1990x1180  colQ hides   0px
     125%  1592x944   colQ hides  38px   5%
     150%  1327x787   colQ hides 284px  34%
     175%  1138x674   colQ hides 405px  47%

   So a third of the work area was below an internal scrollbar on the
   machine it is used on, and the tool was built and measured at a size
   nobody runs it at.

   Three names, his words. Item is what it is and what it sells for - the
   run, the research, the evidence. Pawn is the loan and what it costs to
   get back. Sale is buying it outright and what you make. Nothing is
   removed; it is the same cards, routed, so each tab is short enough to
   need no scrollbar. */
/* THE SALE SIDE, WHICH HAD NO CARD OF ITS OWN. Buying outright was two
   numbers inside the answer card and a sentence about margin. On the phone
   it is the whole job; on the desk it was a tile. It gets a tab, so the
   question "what do I make if I just buy it" has somewhere to be asked. */
function saleTabHTML(x){
  const made=Math.round(x.resale)-x.buy;
  return `<div class="card">
    <span class="label" style="margin:0">Buy it outright</span>
    <div class="tiles" style="grid-template-columns:1fr 1fr 1fr;margin-top:12px">
      <div class="widget"><div class="l">You pay</div><div class="v">${money(x.buy)}</div></div>
      <div class="widget"><div class="l">It resells for</div><div class="v">${money(Math.round(x.resale))}</div></div>
      <div class="widget" style="box-shadow:inset 0 1px 0 rgba(255,255,255,.13),inset 0 0 0 2px var(--accent)"><div class="l">You make</div><div class="v">${money(made)}</div></div>
    </div>
    <div class="cardHint">Yours the moment you pay \u2014 no ticket, no clock, nothing to give back. ${infoBtn("sale-why")}</div>
    ${x.checked?"":`<div class="tagWarn"><b>Estimate.</b> Nothing has been looked up, so that resale figure is the built-in one.</div>`}
  </div>`;
}
const ITEM_TABS=[
  ["item","Item","what it is, and what it sells for"],
  ["pawn","Pawn","the loan, and what it costs him back"],
  ["sale","Sale","buying it outright"]];
/* Whether the tab strip is carrying the layout. The answer card asks this
   before deciding to draw the log strip itself, so there is exactly one
   place that decides and the two cannot disagree. */
function itemTabbed(x){
  try{ return stepFlow()==="ask" && (st.picked||st.needItem) && runFinished(x||calcItem()); }
  catch(e){ return false; }
}
function itemTab(){
  const t=String(st.itemTab||"item");
  return ITEM_TABS.some(z=>z[0]===t)?t:"item";
}
function itemTabsHTML(){
  const cur=itemTab();
  return `<div class="iTabs" role="tablist" aria-label="Which part of the deal">`
    +ITEM_TABS.map(([id,lab,sub])=>
      `<button type="button" class="iTab${id===cur?" on":""}" role="tab"
         aria-selected="${id===cur}" data-itab="${id}" title="${esc(sub)}">${esc(lab)}</button>`).join("")
    +`</div>`;
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
      ${itemsByUse(cat).map(({it,seen},ix)=>`<button class="itemBtn${st.picked&&it.id===st.itemId?" on":""}" data-item="${it.id}"><span class="idx">${String(ix+1).padStart(2,"0")}</span><span style="flex:1">${it.name}</span>${seen?`<span class="seenTag">${seen}\u00d7 taken in</span>`:""}${ownAvgTag(it.id)}</button>`).join("")}
      <button class="itemBtn${st.picked&&st.itemId===custId(cat.id)?" on":""}" data-item="${custId(cat.id)}"><span class="idx">+</span><span style="flex:1">${st.itemId===custId(cat.id)&&st.bookName?esc(st.bookName):"Not on any list — I set the price"}</span></button>
    /* On the phone this column is hidden and the camera card is drawn in the
       visible run instead - drawing it here too would put two of every id on
       the page, and the handlers would wire to the invisible copy. */
    /* The shelf-tag record used to hang here on any screen without a rail -
       the second of two paths it was reaching the pricing page by, and the
       one the first cut missed. It is a record of what OTHER shops ask,
       and it lives on the deal log with the rest of the shop's own
       records. It has no business beside the thing in your hand.
       The camera stays, but only until something is picked: it is how you
       find out WHAT this is, not something to re-open halfway down a run
       about one already named. */
    </div></details>${(deskRail()||window.PHONE||st.picked)?"":photoCardHTML()}</div>`;
  /* The market check is a tool, not a question - it interrupted the run
     between the browse bar and step 3 with 292px of buttons. It goes with
     the other reference cards at the foot, where it is still a click away
     when step 4 wants a real sold price. */
  /* WHAT BELONGS ON A STEP IS THAT STEP.
     The column under the question carried the market card, the camera,
     the shelf-tag recorder and the deal log - all of them, at every step,
     whatever was being asked. Seven cards in the run and thirteen in the
     page flow, to answer one question.
     None of those three belong to a step. The camera is how you find out
     WHAT the thing is, so it goes before an item is picked and not after.
     Shelf tags are a record of other shops' prices, kept for later, and
     have nothing to do with the item in your hand - they moved to the
     deal log, where the shop's own records live. And the log itself says
     "check the market first, so the log only keeps real numbers", which
     is an admission that it is useless until there is a price.
     What is left is the market card, on the one step that asks about the
     market. */
  const onWorth=(stepFlow()==="ask")
    ? (function(){ const q=askQueue(x), at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
                   return q[at]&&q[at].id==="worth"; })()
    : (st.page==="worth"||st.page==="what");
  /* "Some of this can be moved to the right side bar while we are in the
     process of going through the prompts." The market panel is 411px, and
     .colL is nested INSIDE .colQ - so it was not a side column at all, it
     was stacked under the question, and it is what pushed the middle 76px
     past the window on the one step that needs both of them at once.
     On a wide desk it goes to the rail, beside the question rather than
     below it. Narrow, there is no rail to put it in, so it stays where it
     was. */
  const railComps=deskRail()&&onWorth&&!runFinished(x);
  const leftRef=(deskRail()&&onWorth&&!railComps)?`<div class="colL">${compsCardHTML(x)}</div>`:"";
  /* Before anything is picked, the camera IS the first step. After, it is
     a way to re-identify something already named, which nobody needs
     halfway down a run. */
  const camRef=(!st.picked&&!window.PHONE)?`<div class="colL">${photoCardHTML()}</div>`:"";
  /* The log appears when there is something worth logging. */
  /* ONLY THE WINDOWS THAT BELONG TO THIS STAGE.
     "The log deal window only needs to be open on the last page after a
     price has been selected." It was keyed to x.checked, which goes true
     the moment the desk has ANY figure - so 365px of ticket box and Save
     button sat under the questions from step 4 onward, while the counter
     was still being asked what condition the thing is in. There is nothing
     to log at step 4. It waits for the run to finish. */
  /* The deal log card WAS this, plus a second copy of the strip that is
     already on the answer card. The strip carries the ticket and the Save
     button now, so the card is gone rather than gated - a stage it is
     never right on is not a stage. */
  const logRef="";
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
  if(brandOf(cat).on){
    const ov=itemOv();
    const book=(ov&&ov.brands)||BRANDBOOK[cat.id];
    const tiers=brandOf(cat);
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
    <input id="detailIn" type="text" autocomplete="off" placeholder="${esc(detailPh(x))}" value="${esc(st.detail)}" class="numIn" style="font-family:var(--sans);font-size:15px">
    <div class="cardHint" id="specVerdict">${specVerdictHTML(x)}</div>
    ${_sc&&!x.checked?`<div class="cardHint" style="opacity:.8">This item prices from the pickers, not the text boxes — those are for the ticket record${/gener/i.test(x.item.name)?" (watts typed here still compute a value)":""}.</div>`:""}
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
    +(x.handSet?`<div class="tagNote">You typed the resale value yourself, so condition does not move the price &mdash; the wear is already in your number. Clear it in <b>Resale value</b> to price off the list again and have condition adjust it.</div>`:"")
    +`<div class="pills mb14" style="border-radius:var(--r-s)">${condList(x.item.id).map(c=>`<button class="${c.id===st.cond?"on":""}" style="flex:1;padding:7px 5px;font-size:11px${x.handSet?";opacity:.55":""}" data-cond="${c.id}" title="${x.handSet?"Does not change the price while the resale value is your own figure":c.hint}">${c.label.replace("New in box","New")}</button>`).join("")}</div>`;
  if(cat.complete.on){
    mid+=`<span class="label">${cat.complete.label}</span><div class="pills mb14" style="border-radius:var(--r-s)">
      <button class="${st.completeSet&&st.complete?"on":""}" style="flex:1" data-comp="1">All there</button>
      <button class="${st.completeSet&&!st.complete?"on":""}" style="flex:1" data-comp="0">Pieces missing</button></div>`;
  }
  mid+=`<span class="label">How fast it moves in Bristol</span><div class="pills" style="border-radius:var(--r-s)">${LIQUIDITY.map(l=>`<button class="${x.liqId===l.id?"on":""}" style="flex:1;padding:7px 5px;font-size:11px" data-liq="${l.id}" title="${l.hint}">${l.label}</button>`).join("")}</div>
  ${ST?"</details>":"</div>"}
  <details class="card foldCard"${st.openRates?" open":""} id="rateFold">
    <summary><span class="label" style="margin:0">6 &middot; Lending and buying rates</span><span class="foldSub">${x.baseLtv}% lend &middot; ${x.buyPct}% buy &mdash; shop policy, rarely per deal</span></summary>
    <div class="rateRow" style="margin-top:10px"><span class="label">Base lending rate for ${cat.label.toLowerCase()} (%)</span><input id="ltvNum" class="numIn rateNum" type="number" inputmode="numeric" min="15" max="100" value="${x.baseLtv}"></div>
    <input type="range" min="15" max="100" value="${x.baseLtv}" id="ltvSlider">
    <div class="sliderScale"><span>15% — tight</span><span>100% — your whole cushion, gone</span></div>
    <div id="ltvSuggest">${ltvSuggestHTML(cat,x.baseLtv)}</div>${buyRateHTML(x)}</details></div>`;
  const right=`<div class="colR"><div id="ticket">${ticketHTML(x)}</div>${logRef}</div>`;
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
  /* THE FRONT PAGE WAS A SEARCH BOX AND 600px OF NOTHING.
     Under the box sat two lines of prose naming four things you could
     type, then a closed fold and, when disconnected, the setup card -
     and then the bottom two-thirds of a 1440x900 screen, empty. The
     prose was the worst of it: it listed the four best ways in as text
     you have to retype by hand, and the fold hid the twelve categories
     behind a click, so the page managed to be both bare AND to withhold
     everything it knew.

     Both become controls. The examples are buttons that run themselves,
     and the twelve kinds the desk carries are laid out rather than
     folded away. Same information, no more cards, and the screen is
     doing something. */
  /* THE DESK GETS THE HOME CARD TOO.
     It had the search box, the worked examples and the eleven kinds -
     all useful, all a way IN - and nothing about the day it is already
     halfway through. The hero and the feed come from the same two
     functions the phone calls, so the two cannot drift. The ways in
     keep the main column; the day sits in the rail, where the money
     sits once something is on the counter. */
  if(!st.picked&&!st.needItem&&!window.PHONE)return `<div class="startHome">
    <div class="startMain">
      ${omniHTML()}
      <!-- The worked examples used to sit here: eight chips that typed
           themselves into the box. They were built to show what the search
           accepts, and after a week at the counter that is not a thing
           anybody needs shown twice - it is a row of somebody else's items
           standing between the search box and the real lists. Taken out at
           the counter's request. START_TRY stays: the phone has no room for
           the tiles below and still names a few in one line of prose. -->
      <div class="startWays">
        <span class="label" style="margin:0">Or pick the kind of thing it is &mdash; ${CATALOG.reduce((a,c)=>a+c.items.length,0)} of them, and ${mpCount()} models by name</span>
        <div class="startGrid">${catsByUse().map(({c,seen})=>
          `<button class="kindTile" type="button" data-cat="${c.id}"><b>${esc(c.label)}</b>`
          +`<span>${seen?seen+"\u00d7 taken in":c.items.length+" kind"+(c.items.length===1?"":"s")}</span></button>`).join("")}</div>
      </div>
    </div>
    <div class="startRail">
      ${homeHeroHTML({snapLabel:"Photo",acts:false})}
      ${homeDayHTML()}
      ${homeFeedHTML(5)}
      ${left.replace('<div class="colL">','<div class="startCol">')
            .replace(/<details class="browse"[\s\S]*?<\/details>/,"")}
    </div>
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
  /* needItem runs too: the category is chosen, the thing in it is not, and
     the question that settles it is the first one in the queue. Gating on
     st.picked alone sent that screen to the step list instead. */
  if(stepFlow()==="ask"&&(st.picked||st.needItem)){
    /* THE TABS BELONG ON THE BRANCH THAT ACTUALLY RUNS. My first attempt
       put them on the deskRail() layout below, which is not the one a
       finished run lands on - the run stays in the ask flow, so the tabs
       rendered nowhere and all three read identical. The test caught it by
       counting [data-itab] on screen: zero.

       DURING the run there are no tabs. The run is linear, one question at
       a time, and Pawn and Sale have nothing to show until it is answered.
       They appear when it is finished, which is the moment he starts
       needing to find things rather than be led. */
    const done=runFinished(x);
    const tab=done?itemTab():"item";
    const body=!done
      ? `${askHTML(x)}<div id="ticket">${ticketHTML(x)}</div>${leftRef}${camRef}${logRef}`
      : tab==="pawn" ? `<div id="ticket">${ticketHTML(x)}</div>${struckHTML(x)}`
      : tab==="sale" ? `${saleTabHTML(x)}${struckHTML(x)}${logRef}`
      : `${askHTML(x)}${leftRef}${camRef}`;
    return omniHTML()
      +(deskWide()
        ? (pin=>`<div class="rail"><div id="pin">${pin}</div>${weightHTML(x)}${railGuardHTML(x,pin)}${railComps?compsCardHTML(x):""}</div>`)(pinHTML(x))
          +`<div class="colQ">${done?itemTabsHTML():""}${body}</div>`
        : `<div id="pin">${pinHTML(x)}</div>`+weightHTML(x)
          +(done?itemTabsHTML():"")+body);
  }
  if(deskRail()){
    /* Each tab carries only its own cards, so none of them is tall enough
       to need the scrollbar that was eating a third of this column. */
    const tab=itemTab();
    const body=tab==="pawn" ? `<div id="ticket">${ticketHTML(x)}</div>`
             : tab==="sale" ? `${saleTabHTML(x)}${logRef}`
             : `${left}${mid}${leftRef}${camRef}`;
    return omniHTML()+nextStepHTML(x)
      +(pin=>`<div class="rail"><div id="pin">${pin}</div>${weightHTML(x)}${railGuardHTML(x,pin)}${railComps?compsCardHTML(x):""}</div>`)(pinHTML(x))
      +`<div class="colQ">${itemTabsHTML()}${body}</div>`;
  }
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
/* THE TAP HANDLER WAS WIRED INSIDE wireItem, AND ONLY THE ITEM PAGE RUNS IT.
   Caught by the assertion in check-words that says an info button has to
   OPEN - which is the whole premise of moving words into one. The button
   was drawn on setup and on the gold screen, the popup existed, and on a
   desk it even appeared, because CSS shows it on :hover. On a phone there
   is no hover. So the detail those screens had just handed to an info
   button was, on the field surface, gone.

   Exactly the failure the suite's own comment calls a deletion with extra
   steps, found the first time anything asked the button to work. It is
   wired for every screen now, off the view element, after whichever
   render drew it. */
function wireInfo(){
  const v=document.getElementById("view"); if(!v)return;
  /* Opens on tap as well as hover - the phone has no hover, and a detail
     only a mouse can reach is one the field screen does not have. */
  v.querySelectorAll("[data-info]").forEach(b=>{
    b.onclick=e=>{ e.preventDefault(); e.stopPropagation();
      const was=b.classList.contains("open");
      v.querySelectorAll("[data-info].open").forEach(o=>o.classList.remove("open"));
      if(!was)b.classList.add("open"); };
  });
}
function wireItem(){
  const v=document.getElementById("view");
  /* Opened once, it stays open for the session - thumbing the lists is a
     habit, not a one-off, and it must survive the re-render that picking a
     category causes. */
  /* Opens the fold the schedule lives in and takes him to it. The fold's
     own ontoggle below keeps it open through the re-render, so it does not
     shut under the hand that opened it. */
  const ts=document.getElementById("toSchedule");
  if(ts)ts.onclick=()=>{
    /* THE LINK AND THE THING IT OPENS ARE ON DIFFERENT TABS NOW. The
       schedule lives inside the ticket card, which is the Pawn tab; the
       link sits on the answer card, which is Item. Setting openPayback
       alone left him on Item with nothing visibly changed - check-pricing
       caught it, because the rungs it reads came back empty.
       So it SWITCHES, which is what a link between two tabs has to do, and
       is a better answer than the fold ever was: one press and he is
       looking at the schedule rather than at a fold he has to find. */
    st.openPayback=true; st.itemTab="pawn";
    try{ persist(); }catch(e){}
    const go=()=>{ const d=document.getElementById("paybackFold");
      if(d){ d.open=true; if(d.scrollIntoView)d.scrollIntoView({block:"start",behavior:"smooth"}); } };
    try{ render(); }catch(e){} go(); setTimeout(go,0);
  };
  /* The tab strip. Keyboard too: a tablist a mouse can reach and a keyboard
     cannot is half a control. */
  v.querySelectorAll("[data-itab]").forEach(b=>{
    b.onclick=()=>{
      /* THE TAB AND THE DEAL KIND WERE TWO CONTROLS FOR ONE DECISION.
         Reported from the counter: "im on the sale tab but this is talkin
         about pawn and lent." He was on Sale, the card said YOU PAY $240,
         and underneath it the log strip said LENT 220 and the rail said
         "If he pawns it ... GO LOW $180 SUGGESTED $220".

         st.itemTab said Sale. st.struckKind still said loan, because
         nothing tied them together - I put the log strip on both deal tabs
         and never made the tab mean anything about WHICH deal.

         Picking Sale IS saying you are buying it. Picking Pawn IS saying
         you are lending. One state, set from either control, which is the
         rule this file already learned once when the deal tiles replaced a
         separate Lent/Bought pill. */
      st.itemTab=b.dataset.itab;
      if(st.itemTab==="sale")st.struckKind="buy";
      else if(st.itemTab==="pawn")st.struckKind="loan";
      try{ persist(); }catch(e){} render(); };
    b.onkeydown=e=>{
      const i=ITEM_TABS.findIndex(z=>z[0]===b.dataset.itab);
      if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
        e.preventDefault();
        const n=(i+(e.key==="ArrowRight"?1:ITEM_TABS.length-1))%ITEM_TABS.length;
        st.itemTab=ITEM_TABS[n][0];
        if(st.itemTab==="sale")st.struckKind="buy";
        else if(st.itemTab==="pawn")st.struckKind="loan";
        render();
        const el=document.querySelector('[data-itab="'+ITEM_TABS[n][0]+'"]'); if(el)el.focus();
      }};
  });
  const br=document.getElementById("browseBox");
  if(br)br.ontoggle=()=>{ st.browse=br.open; };
  /* Opened by hand, it stays open through the re-render a click inside it
     causes - otherwise it shuts under the hand that opened it. */
  for(const [id,key] of [["whyFold","openWhy"],["paybackFold","openPayback"],["rateFold","openRates"],
                         ["driverFold","openDriver"],["tierFold","openTier"],["notesFold","openNotes"],
                         ["compFold","openComp"],
                         ["s3","openS3"],["s4","openS4"],["s5","openS5"],["wordsFold","openWords"]]){
    const d=document.getElementById(id); if(d)d.ontoggle=()=>{ st[key]=d.open; };
  }
  /* A worked example is only worth showing if pressing it works. */
  /* The home card's four actions, on whichever machine drew it. */
  v.querySelectorAll("[data-whome]").forEach(b=>b.onclick=()=>{
    const a=b.dataset.whome;
    if(a==="snap"){
      /* The live camera first. This button said "Camera" and opened a
         gallery three builds running, because every version of it went
         through a picker the device controls. */
      if(typeof camLiveOK==="function"&&camLiveOK()&&typeof openCam==="function"){ openCam(); return; }
      const c=document.getElementById("photoCam")||document.getElementById("photoIn");
      if(c)c.click(); return; }
    if(a==="pick"){ const g=document.getElementById("photoIn")||document.getElementById("photoCam");
                    if(g)g.click(); return; }
    if(a==="gold"){ st.mode="metal"; render(); return; }
    if(a==="log"){ st.mode="log"; render(); return; }
    if(a==="type"){ const i2=document.getElementById("omniIn");
                    if(i2){ i2.focus(); try{ i2.scrollIntoView({block:"nearest"}); }catch(e){} } return; }
  });
  v.querySelectorAll("[data-dact]").forEach(b=>b.onclick=()=>{
    const a=b.dataset.dact;
    if(a==="look"){ try{ priceFind(null,true); }catch(e){} return; }
    if(a==="log"){ st.mode="log"; render(); return; }
    if(a==="new"){ const n=document.getElementById("pinNew"); if(n)n.click();
                   else { st.picked=false; st.omniDone=""; st.market=null; render(); } return; }
  });
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
    /* TAPPING A CATEGORY IS NOT PICKING THE FIRST THING IN IT. Reported from
       the counter: "when i clicked the outdoor power tools button it went
       straight to bar length. what if it was a weedeater or a blower?" It
       went to p1, Chainsaw, because this line sets itemId to items[0] - and
       the setter at the top of the file flips st.picked on ANY assignment,
       so the fallback became a choice nobody made. The rule is already
       written up there: "the catalog's first item is only a fallback so the
       math always has something to hold - it is not a choice the clerk
       made." The arithmetic still needs an item, so the fallback stays and
       picked goes back to false, which is what puts the seven kinds on the
       screen instead of a chainsaw's bar length. */
    else { st.mpNone=false; const c=CATALOG.find(x=>x.id===st.catId); st.itemId=c.items[0].id; st.bookName=""; st.picked=false; st.needItem=true; }
    st.needKind=false;
    if(un&&st.photoRead)st.photoRead=Object.assign({},st.photoRead,{unplaced:false});
    st.liq=null;st.brandTyped="";st.brandQ="";st.model="";st.detail="";st.complete=true;st.completeSet=false;clearDeal();st.askEdit=false;st.editing=false;
    /* THE MAKE WAS READ AND THEN THROWN AWAY.
       Reported from the counter: typed "microsoft surface book", answered
       "Electronics", and the make step still said NOTHING PICKED YET. The
       desk had in fact read it - this line set the TIER off those same
       words and priced against it - it just never wrote down WHICH make,
       so the screen claimed ignorance about something it had already
       used. "It should understand Microsoft as a brand." It did. It was
       hiding it.
       brandFromName rather than brandInText, because the words on the
       counter are as often a product line as a maker: "surface" is
       Microsoft, "inspiron" is Dell, "quietcomfort" is Bose, and the
       whole-name scan alone finds none of those. brandSet goes with it -
       a make the desk is confident enough to price with is a make it is
       confident enough to show, and the counter can tap another if it is
       wrong. */
    const h=typed?brandFromName(st.catId,typed):null;
    st.brand=h?h.tier:"mid";
    if(h){ st.brandTyped=h.name; st.brandQ=h.name; st.brandSet=true; }
    render();});
  v.querySelectorAll("[data-item]").forEach(b=>b.onclick=()=>{st.needKind=false;st.needItem=false;st.itemId=b.dataset.item;st.market=null;st.omniDone="";st.mpPin=null;st.mpNone=false;st.condSet=false;st.cond="good";st.bookName="";st.liq=null;st.brand="mid";st.brandTyped="";st.brandQ="";st.model="";st.detail="";st.complete=true;st.completeSet=false;clearDeal();st.askEdit=false;st.askAt=0;st.askFrom=null;st.brandSet=false;
    /* picking "Something else" with no saved value drops you straight into the price box */
    st.editing=(st.itemId===custId(st.catId));
    render();if(st.editing)document.getElementById("valIn")?.focus();});
  /* A tier tapped by hand is the counter overruling whatever was read off
     the name, so it has to outrank it - brandSet is what says so. */
  v.querySelectorAll("[data-brand]").forEach(b=>b.onclick=()=>{st.brand=b.dataset.brand;st.brandTyped="";st.brandQ="";st.brandSet=true;render();});
  const bIn=document.getElementById("brandIn");
  if(bIn)bIn.oninput=()=>{
    st.brandTyped=bIn.value;
    st.brandSet=false;
    const hit=brandLookup(st.catId,st.brandTyped);
    if(hit)st.brand=hit.tier;
    document.getElementById("brandVerdict").innerHTML=brandVerdictHTML();
    v.querySelectorAll("[data-brand]").forEach(b=>b.classList.toggle("on",b.dataset.brand===st.brand));
    const xx=calcItem();
    const vn=document.getElementById("valNum");if(vn)vn.textContent=money(xx.baseValue*xx.brandMult);
    const vs=document.getElementById("valSub");if(vs)vs.textContent=valSubText(xx).replace(/<[^>]*>/g,"");
    /* GUARDED, BECAUSE #ticket IS NOT ALWAYS ON THE SCREEN NOW. The Pawn
       tab carries it; Item and Sale do not. Three call sites wrote to it
       unguarded and check-wizard caught the crash the moment the tabs
       landed - "Cannot set properties of null". Line 11701 had the guard
       already; these did not. */
    {const tk=document.getElementById("ticket"); if(tk)tk.innerHTML=ticketHTML(xx);} paintPin(xx);
    refreshStep4();
  };
  v.querySelectorAll("[data-cond]").forEach(b=>b.onclick=()=>{st.cond=b.dataset.cond;st.condSet=true;render();});
  /* Which deal you are doing. It drives the panel on the rail and nothing
     else - no price moves, so a mis-click costs a click. Kept separate
     from st.deal, which is the metals run's own buy-or-pawn question:
     picking "buy" on a PlayStation has no business answering a question
     on the gold page. */
  /* The way back into a question the record answered. Dropping the facts
     puts them back in the run, and recordGuard must not immediately
     re-apply them - so the model is marked as already handled. */
  const ru=document.getElementById("recUndo");
  if(ru)ru.onclick=()=>{
    for(const k of Object.keys(specFromRecord))delete st.specSel[k];
    specFromRecord={}; st.askEdit=false; st.askAt=0; st.askFrom=null; render(); };
  v.querySelectorAll("[data-ideal]").forEach(b=>b.onclick=()=>{
    st.struckKind=b.dataset.ideal==="buy"?"buy":"loan";
    /* The other half of the same rule: pressing "Buy it outright" on the
       answer card takes him to the tab that is about buying, rather than
       leaving him on Item with the rail quietly switching underneath. */
    if(itemTabbed(calcItem()))st.itemTab=st.struckKind==="buy"?"sale":"pawn";
    persist(); render(); });
  v.querySelectorAll("[data-comp]").forEach(b=>b.onclick=()=>{st.complete=b.dataset.comp==="1";st.completeSet=true;render();});
  /* Answering IS moving on. A questionnaire that makes you answer and then
     press Next has two actions where the counter's hand expects one. The
     last question does not advance - there is nowhere to go, and the price
     is already beside it. */
  v.querySelectorAll("[data-ask]").forEach(b=>b.onclick=()=>{
    const kind=b.dataset.ask, val=b.dataset.askv;
    if(kind==="brand"){ st.brand=val; st.brandTyped="";st.brandQ=""; st.brandSet=true; }
    else if(kind==="kind"){
      /* Same work the category buttons did, minus the reset: the words the
         counter typed are the only thing known about this item, so they are
         kept and the make is read out of them against the aisle just
         chosen - which is the whole reason it could not be read before. */
      const typed=st.bookName||"";
      st.catId=val; st.itemId=custId(val); st.bookName=typed||"Something else";
      st.needKind=false; st.mpNone=true; st.liq=null; st.market=null; st.mpPin=null;
      const bh=typed?brandFromName(val,typed):null;
      st.brand=bh?bh.tier:"mid";
      st.brandTyped=bh?bh.name:""; st.brandQ=st.brandTyped; st.brandSet=!!bh;
    }
    /* Picking the thing itself. The same reset the item buttons do, because
       the questions after this one belong to the item that was just chosen
       and the answers to a chainsaw's are no use to a blower. */
    else if(kind==="item"){
      st.needItem=false; st.itemId=val; st.market=null; st.mpPin=null; st.mpNone=false;
      st.condSet=false; st.cond="good"; st.bookName=""; st.liq=null;
      st.brand="mid"; st.brandTyped=""; st.brandQ=""; st.brandSet=false;
      st.model=""; st.detail=""; st.complete=true; st.completeSet=false;
      st.specSel={}; clearDeal();
      st.editing=(val===custId(st.catId));
    }
    else if(kind==="comp"){ st.complete=val==="1"; st.completeSet=true; }
    else if(kind==="cond"){ st.cond=val; st.condSet=true; }
    else if(kind==="spec"){ const [gi,oi]=val.split(":"); st.specSel[st.itemId+":"+gi]=Number(oi); }
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    st.askFrom=at; if(at<q.length-1)st.askAt=nextOpenAsk(q,at);
    persist(); render();
  });
  v.querySelectorAll("[data-askmove]").forEach(b=>b.onclick=()=>{
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    /* Moving on from the model question without typing one IS the answer
       "there is no model". Every other question stays where it is. */
    const d=Number(b.dataset.askmove);
    if(d>0&&q[at]&&q[at].id==="model"&&!q[at].answered)st.mpNone=true;
    /* FORWARD SKIPS WHAT IS ANSWERED. BACK DOES NOT. Going on should not
       park the counter on a question that already has its answer in it -
       that is the same rule the option handlers follow. Going BACK is the
       opposite: the whole reason to step back is to reach an answer and
       change it, so it moves one card at a time.
       This handler was a flat delta both ways, which was invisible while
       every answered question sat at the front. With the sold-price step
       moved to the end when there is no service, Next out of the reopened
       condition landed on an answered lookup instead of returning to the
       answer card. */
    st.askFrom=at;
    st.askAt=d>0 ? nextOpenAsk(q,at)
                 : Math.max(0,Math.min(q.length-1,at+d));
    st.askEdit=false;
    render();
  });
  v.querySelectorAll("[data-askout]").forEach(b=>b.onclick=()=>{
    /* CALL IT, do not click a button that might not be on the page. This
       reached for #pinNew - the rail's Start over - and only fell back to
       its own partial reset when the rail was absent. On the "Which of
       these is it?" card there IS no rail, so the fallback is what ran,
       and the fallback cleared four things out of the twenty startOver
       clears. Same function, one behaviour, everywhere. */
    startOver();
  });
  v.querySelectorAll("[data-askdone]").forEach(b=>b.onclick=()=>{
    if(b.dataset.askdone==="here"){
      /* the answer is on this card - put the options where the eye is */
      const o=document.querySelector("#askCard .askOpts,#askCard .askWorth");
      if(o&&o.scrollIntoView)o.scrollIntoView({behavior:"smooth",block:"center"});
      return;
    }
    /* The run is done, so the next thing the counter does is write it
       down. Straight to the ticket box, focused - and on a desk, where that
       box is very often already on screen, the scroll alone is invisible and
       was reported as a dead button. So the card it lands on says so. */
    const log=document.getElementById("logCard")||document.getElementById("nextStep");
    if(log&&log.scrollIntoView)log.scrollIntoView({behavior:"smooth",block:"start"});
    if(log){ log.classList.remove("flashTo"); void log.offsetWidth; log.classList.add("flashTo");
             setTimeout(()=>log.classList.remove("flashTo"),1400); }
    const t=document.getElementById("ticketIn")||(log&&log.querySelector("input"));
    if(t&&t.focus)setTimeout(()=>{try{t.focus({preventScroll:true});}catch(e){}},260);
  });
  v.querySelectorAll("[data-askedit]").forEach(b=>b.onclick=()=>{
    st.askEdit=b.dataset.askedit==="1"; render(); });
  v.querySelectorAll("[data-askgo]").forEach(b=>b.onclick=()=>{ st.askAt=Number(b.dataset.askgo); st.askEdit=false; render(); });
  v.querySelectorAll("[data-liq]").forEach(b=>b.onclick=()=>{st.liq=b.dataset.liq;render();});
  v.querySelectorAll("[data-spec]").forEach(b=>b.onclick=()=>{
    const [gi,oi]=b.dataset.spec.split(":").map(Number);
    st.specSel[st.itemId+":"+gi]=oi;render();});
  /* THE BUTTON WAS TELLING THE TRUTH ABOUT THE WRONG MOMENT.
     Its label is decided when the card is drawn, and typing in the model
     box deliberately does NOT redraw the card - redrawing on every
     keystroke threw the cursor out of the box mid-word. So the label froze
     at whatever it was when the card appeared: type a model, and the way
     forward still read "Skip".
     The click itself was always right - it re-reads the queue and does not
     set "there is no model" when one has been typed - so nothing was lost.
     But a button that says Skip over a filled-in box makes the counter
     doubt that the typing registered, which is worse than a wasted tap.
     So: repaint the label and the dot on input, and nothing else. A full
     render would take the cursor with it. */
  function askNavRefresh(){
    const nav=document.querySelector('[data-askmove="1"]'); if(!nav)return;
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    const cur=q[at]; if(!cur)return;
    if(at<q.length-1)nav.innerHTML=(cur.answered?"Next":"Skip")+" \u2192";
    const dot=document.querySelectorAll(".askDots i")[at];
    if(dot)dot.classList.toggle("done",!!cur.answered);
  }
  function specRefresh(){
    const xx=calcItem();
    askNavRefresh();
    const sv=document.getElementById("specVerdict");if(sv){sv.innerHTML=specVerdictHTML(xx);wireUseSpec();}
    const vn=document.getElementById("valNum");if(vn)vn.textContent=money(xx.baseValue*xx.brandMult*xx.specMult);
    const vs=document.getElementById("valSub");if(vs)vs.textContent=valSubText(xx).replace(/<[^>]*>/g,"");
    /* GUARDED, BECAUSE #ticket IS NOT ALWAYS ON THE SCREEN NOW. The Pawn
       tab carries it; Item and Sale do not. Three call sites wrote to it
       unguarded and check-wizard caught the crash the moment the tabs
       landed - "Cannot set properties of null". Line 11701 had the guard
       already; these did not. */
    {const tk=document.getElementById("ticket"); if(tk)tk.innerHTML=ticketHTML(xx);} paintPin(xx);
    refreshStep4();
  }
  function wireUseSpec(){
    const u=document.getElementById("useSpec");
    if(u)u.onclick=()=>{const s=calcItem().spec;if(!s||!s.absSuggest)return;
      st.overrides[st.itemId]=s.absSuggest;persist();render();};
  }
  /* The make box filters the book as you type; the hits redraw under it
     without losing the caret, so the whole card is not rebuilt on a
     keystroke. Tapping a hit writes the canonical spelling AND the tier. */
  const abIn=document.getElementById("askBrandIn");
  if(abIn)abIn.oninput=()=>{ st.brandQ=abIn.value; render();
    const again=document.getElementById("askBrandIn");
    if(again){ again.focus(); again.setSelectionRange(again.value.length,again.value.length); } };
  document.querySelectorAll("[data-brandpick]").forEach(b=>b.onclick=()=>{
    st.brandTyped=b.dataset.brandpick; st.brand=b.dataset.brandtier;
    st.brandSet=true; st.brandQ=b.dataset.brandpick;
    /* A different make means the model list under it is a different list. */
    st.mpPin=null; st.market=null;
    /* Answering is moving on here too, the same as tapping a tier. */
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    st.askFrom=at; if(at<q.length-1)st.askAt=nextOpenAsk(q,at);
    persist(); render(); });
  /* A measured row picked by hand - the same thing the phone's list does,
     so the model is spelled the way the sold-price search expects. */
  document.querySelectorAll("[data-modelpick]").forEach(b=>b.onclick=()=>{
    const r=MP_BY_ID[b.dataset.modelpick]; if(!r)return;
    st.model=String(r[2]); st.mpPin={id:r[0],model:String(r[2])};
    st.mpNone=false; st.market=null;
    /* Answering is moving on, the same as a tier or a make. */
    const q=askQueue(calcItem());
    const at=Math.max(0,Math.min(q.length-1,Number(st.askAt)||0));
    st.askFrom=at; if(at<q.length-1)st.askAt=nextOpenAsk(q,at);
    persist(); render(); });
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
        st.liq=e[3]; st.brand="mid"; st.brandTyped="";st.brandQ=""; st.brandSet=false; st.complete=true;st.completeSet=false;clearDeal();st.askEdit=false; st.editing=false;
        persist(); render();
      });
    };
  }
  wireStep4();
  const sl=document.getElementById("ltvSlider"), ln=document.getElementById("ltvNum");
  function ltvRefresh(){
    {const tk=document.getElementById("ticket"); if(tk)tk.innerHTML=ticketHTML(calcItem());} paintPin(calcItem());
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
  wirePawnRate();
}

/* ---------------- gold tab ---------------- */
/* THE TARGET IS A SHARE OF MELT, AND THE RATE IS WORKED BACK FROM IT.
   "do all 3 and target 80% but make sure we are still accounting for the
   trends so we don't over pay between buy date and sell date."

   Before this, the rate was a number (70) and what actually went out the
   door was something else (65%), because the guard took its cut after. He
   set one figure and the desk delivered another, which is how "are we
   competitive?" became impossible to answer from the screen.

   Now the TARGET is the thing he picks, and it is the share of melt that
   reaches the customer in NORMAL conditions. The rate is derived from it,
   so the number he aims at is the number that lands.

   WHERE 80 CAME FROM: a competitor's posted sheet, which he sent in. US
   Gold Buyers pays 84.6% of melt on lots under 3 ozt, 95.5% at 5-25 ozt -
   but that is a mail-in refiner buy with no Florida holding period. For a
   walk-in counter the trade puts it at 75-85% (a verified goldsmith: "If I
   like you, I pay 80%. I know some shops that only pay 40-60%"; a jeweler:
   "scrap credit of about 75-85% to my client"). 80 sits with the jewelers
   rather than the low-end shops, and it is his call, not a measurement.

   SILVER at 70 is not a second guess - it keeps the ratio he had already
   set himself. The old bases were gold 70 and silver 62; 62/70 is 0.886,
   and 80 x 0.886 is 70.9.

   THE LOAN IS A DIFFERENT DECISION AND HE DID NOT ASK ME TO MOVE IT. Its
   targets are set to what the desk delivers today - gold 42%, silver 37% -
   so nothing about lending changes here. They are named rather than
   buried, so moving them later is one number instead of an archaeology
   expedition. */
const MELT_TARGET={gold:{buy:80,loan:42}, silver:{buy:70,loan:37}};
/* AND IT IS SETTABLE AT THE COUNTER. "Can I set it inside the tool or do I
   have to come back here?" He should never have to come back here for a
   number that is shop policy - the pawn rate, the buy floor and the
   multiple are all set on the counter and this is the same kind of thing.
   MELT_TARGET above is the shipped default; st.meltTgt is what this device
   is actually using, and it persists like the other rates.
   NOT put on the Setup tab, deliberately. "We don't need a mistake by not
   realizing that our bid rate or percentage is set to the wrong thing on a
   hidden window" - a number that decides what leaves the till does not
   belong behind a tab nobody opens. It sits on the gold page beside the
   slider it drives, and what it currently delivers is in the header on
   every screen. */
function meltTarget(metal,which){
  const d=(MELT_TARGET[metal]||MELT_TARGET.gold)[which];
  const v=st.meltTgt&&st.meltTgt[metal]&&st.meltTgt[metal][which];
  return (v>0)?v:d;
}
function setMeltTarget(metal,which,v){
  const n=Math.max(30,Math.min(100,Math.round(Number(v)||0)));
  if(!st.meltTgt)st.meltTgt={};
  if(!st.meltTgt[metal])st.meltTgt[metal]={};
  st.meltTgt[metal][which]=n;
  /* The rate follows the target unless the counter has dragged the slider
     for today; moving the target IS setting the rate, so the hand-set flag
     is cleared and the slider re-derives. */
  if(which==="buy")st.payTouched=false; else st.loanTouched=false;
  syncPay(); persist();
  return n;
}
/* The share of melt that goes out the door RIGHT NOW, with no item on the
   counter. buy/melt is (buyOz/spot) x rate - the grams and the karat
   cancel - so the header can say it without anything being weighed. */
function meltPctNow(metal,which){
  const keepM=st.metal, keepD=st.deal;
  try{
    st.metal=metal; st.deal=(which==="loan")?"pawn":"buy";
    const spot=spotOf(metal); if(!(spot>0))return null;
    const G=(typeof metalGuard==="function")?metalGuard(metal):null;
    const avg=avgOf(metal);
    const oz=(which==="loan")
      ? Math.min(G?G.lend:spot, Math.min(spot,avg||spot))
      : Math.min(G?G.buy:spot, spot);
    /* THE STORED RATE IS ONE NUMBER AND THERE ARE TWO METALS. On a metal
       screen st.payPct is right - it is what the slider is set to, moved
       or not. On the home card, where nothing has been picked, it is
       whatever the last thing priced left behind, so gold and silver both
       read off a rate that belongs to neither: 62% and 56% on a card
       whose targets are 80 and 70. Untouched, take the suggestion for
       THIS metal; touched, the counter's own number still wins, because
       a moved slider is a decision and this must not paper over it. */
    let rate=(which==="loan")?st.loanPct:st.payPct;
    const touched=(typeof curTouched==="function")?curTouched():true;
    if(!touched){
      const sr=(typeof suggestRate==="function")?suggestRate():null;
      if(sr&&sr.pay>0)rate=sr.pay;
    }
    return Math.round((oz/spot)*(rate/100)*100);
  } finally { st.metal=keepM; st.deal=keepD; }
}
/* The measured cut for a hold of the right length, by today's conditions.
   buy = 30 calendar days, because s. 539.001(9)(c) makes it 30 whatever the
   refiner could do; loan = 60, because a pawn is 30 to maturity and 30 more
   the statute makes you hold. */
function meltCut(metal,band,which){
  const R=MRISK&&MRISK.metals&&MRISK.metals[metal];
  const b=R&&R.byVol&&R.byVol[band||"normal"];
  if(!b)return 0;
  const v=which==="loan"?b.p5:b.q5;
  return Math.max(0,Math.min(30,Math.abs(Number(v)||0)));
}
/* Suggested rate - the share of MELT he is aiming at, turned into the
   slider number that gets there.

   The rate is worked back from the NORMAL band, not from today's, and that
   is the whole mechanism: in a normal market the customer gets the target,
   and when the market is worse than normal the guard pulls the delivered
   figure BELOW it. That is "still accounting for the trends so we don't
   over pay between buy date and sell date" - the pull-back is real and it
   is measured over the 30 days the metal actually has to sit here.

   Gold, measured over 6,705 LBMA fixings since 2000:
     calm    30-day cut 5.2%   ->  80.1% of melt reaches him
     normal              5.3%  ->  80.0%
     busy                6.9%  ->  78.6%
     violent            10.9%  ->  75.3%

   WHAT CAME OUT OF THIS FUNCTION: the premium tiers (-4/-8/-10 as spot ran
   over its 90-day average) and the weekly-slide trim (-2/-5/-8). Both were
   charging for things already charged elsewhere - the premium by the
   guard's own premium bucket and by the loan's min(spot, 90-day) floor, the
   slide by the guard's volatility band and by the trend read below. That
   was the triple charge: at a 16% premium a loan fell from 43% of melt to
   28%, and only part of that was a decision anybody made on purpose.

   WHAT STAYED: the trend read, which is DIRECTION and nothing else. The
   guard's bands see how hard a market is moving and where it sits against
   its own average; neither sees a metal 21% off its peak and under its
   200-day. That is a different fact and it is the only one still allowed
   to move the rate. */
function suggestPay(){
  const metal=st.metal, S=metalState(metal);
  const T=(typeof metalTrend==="function")?metalTrend(metal):null;
  const tgt=meltTarget(metal,"buy");
  const nc=meltCut(metal,"normal","buy");
  const base=nc>0?tgt/(1-nc/100):tgt;
  const band=S?S.band:"normal";
  const todayCut=meltCut(metal,band,"buy");
  const lands=Math.round(base*(1-todayCut/100));
  const bare=Math.max(50,Math.round(base));
  let cut=0;
  let why=`you are aiming at <b>${tgt}% of melt</b>. The ${todayCut.toFixed(1)}% guard for a 30-day hold in ${band==="violent"?"a market moving this hard":band==="busy"?"a busy market":band==="calm"?"a calm market":"a normal market"} brings that to about <b>${lands}%</b> out the door`;
  if(T&&T.cut>0){ cut+=T.cut; why+=`. And ${String(T.detail||"").replace(/\.$/,"")}`; }
  return {pay:Math.max(50,Math.round(base-cut)), bare, why, trend:T, target:tgt, lands};
}
/* The rate DEFAULTS to today's suggestion and keeps tracking it as spot, the
   average or the metal changes — until the counter moves the slider, which
   then wins for the rest of the day. */
function suggestRate(){
  const s=suggestPay(); if(!s)return null;
  if(!PAWN()) return s;
  /* A loan runs about 30% under a buy: you carry the price for 60 days before
     the metal is even yours. Same market reasoning, lower landing point. */
  /* THE LOAN HAS ITS OWN TARGET NOW. It used to be the buy rate x 0.7,
     which meant raising the buy to hit 80% of melt would have quietly
     raised every loan with it - from 42% of melt to about 52%, a change to
     the shop's risk that nobody asked for. The targets are named in
     MELT_TARGET and the loan's is set to what the desk delivers today, so
     lending is untouched by the buy-side change and moves only when
     somebody moves it on purpose. */
  const metal=st.metal, S=metalState(metal);
  const tgt=meltTarget(metal,"loan");
  const nc=meltCut(metal,"normal","loan");
  const base=nc>0?tgt/(1-nc/100):tgt;
  const todayCut=meltCut(metal,S?S.band:"normal","loan");
  const lands=Math.round(base*(1-todayCut/100));
  let cut=0;
  /* THE REASONING COMES OFF THE SCREEN AND THE ARITHMETIC STAYS ON IT.
     Measured: this card was the longest block of prose in the tool, ~95
     words above a slider, and most of it was market analysis - how far off
     the 12-month peak, which side of the 200-day average, the annual
     swing, which fifth of its own history. All true, none of it the thing
     he is about to do, and the guard it explains is already a row in the
     ladder below. So `why` is the arithmetic he is being asked to agree
     with, and `more` is why, one tap away. */
  let why=`a pawn is a 60-day position, so it aims lower: <b>${tgt}% of melt</b>. The ${todayCut.toFixed(1)}% guard for 60 days brings it to about <b>${lands}%</b> out the door`;
  let more="";
  if(s.trend&&s.trend.cut>0){ cut+=s.trend.cut; more=String(s.trend.detail||"").replace(/\.$/,"")+"."; }
  return {pay:Math.max(25,Math.round(base-cut)),
          bare:Math.max(25,Math.round(base)), trend:s.trend, target:tgt, lands, why, more};
}
function syncPay(){
  if(curTouched()) return;
  const s=suggestRate();
  if(s) setRate(s.pay);
}
/* WHAT IS BETWEEN MELT AND THE OFFER, AS A LADDER YOU CAN READ.
   "if we haircut the haircut the haircut we're not going to be competitive
   on our gold prices and we're going to miss sales." He was right that it
   was stacked, and the reason he could not tell was that none of it was on
   screen: the card showed a rate, and the money was somewhere else.
   Every rung is named, with its reason and its size, and they add up to the
   figure at the bottom - which is the figure the customer is handed. If a
   rung looks wrong he can see which one it is instead of guessing at the
   whole. */
function meltLadderHTML(){
  const m=(typeof calcMetal==="function")?calcMetal():null;
  if(!m||!(m.melt>0))return "";
  const pawn=PAWN(), s=suggestRate(), S=metalState(st.metal);
  if(!s)return "";
  const out=pawn?m.loan:m.buy;
  const pct=Math.round(out/m.melt*100);
  const band=S?S.band:"normal";
  const nc=meltCut(st.metal,"normal",pawn?"loan":"buy");
  const tc=meltCut(st.metal,band,pawn?"loan":"buy");
  const guardPts=Math.round(s.target*((1-nc/100)-(1-tc/100))/(1-nc/100));
  const trendPts=(s.trend&&s.trend.cut>0)?s.trend.cut:0;
  const row=(l,r,note,tone)=>`<div style="display:flex;gap:10px;align-items:baseline;padding:3px 0">
    <span style="flex:0 0 96px;font-family:var(--mono);font-size:12.5px;color:${tone||"var(--ink-2)"}">${r}</span>
    <span style="flex:0 0 auto;font-size:13px;color:var(--ink)">${l}</span>
    <span style="font-size:12.5px;color:var(--ink-2)">${note||""}</span></div>`;
  return `<div style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
    <span class="label" style="margin:0 0 4px">What is between melt and the offer</span>
    ${/* "what the metal in it is worth at spot" - and check-screens was
          right to fail it. There is a standing rule that the screen says
          "today's price" everywhere it means today's price, and teaches
          the word "spot" exactly once, in the card that exists to teach
          it. A ladder whose whole job is making the arithmetic plain is
          the last place to drop a word the counter has not been given. */""}
    ${row(`Melt`,money(m.melt),"what the metal in it is worth at today's price","var(--ink)")}
    ${row(`Your target`,s.target+"%","what you aim to pay in a normal market")}
    ${trendPts?row(`Falling market`,"−"+trendPts,esc(String((s.trend&&s.trend.short)||"the direction has been down")),"var(--warn-ink)"):""}
    ${guardPts>0?row(`Moving hard`,"−"+guardPts,`1 in 20 ${pawn?"sixty":"thirty"}-day holds lost more than ${tc.toFixed(1)}% in a ${band} market`,"var(--warn-ink)"):""}
    ${row(`<b>You pay</b>`,"<b>"+money(out)+"</b>",`<b>${pct}% of melt</b>`,"var(--accent)")}
  </div>`;
}
function suggestHTML(){
  const s=suggestRate();
  if(!s)return "";
  const match=curRate()===s.pay;
  return `<div class="cardHint" style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
    <span style="color:var(--accent);font-family:var(--mono);font-weight:600">Suggested today: ${s.pay}%</span> — ${s.why}.${s.more?" "+infoBtnText(s.more,"melt-trend"):""}
    ${match?`<span style="color:var(--ink-2)"> ${curTouched()?"You're on it.":"Drag the slider to set your own."}</span>`
      :`<button id="useSuggest" class="ghostBtn" style="padding:5px 12px;font-size:11.5px;margin-left:8px">Use ${s.pay}%</button>`}
    <div class="rateRow" style="margin-top:12px"><span class="label">What you aim to pay, as a share of melt (%) ${infoBtn("melt-policy")}</span><input id="meltTgtNum" class="numIn rateNum" type="number" inputmode="numeric" min="30" max="100" value="${meltTarget(st.metal,PAWN()?"loan":"buy")}"></div>
    ${meltLadderHTML()}
  </div>`;
}
/* The slider is a share of melt, but a loan also takes the peak guard and the
   30% loan cut on top — so the loan lands well below the slider number. This
   is that true share, for honest labelling. */
/* What a refiner actually returns on scrap, as a share of melt. Widely
   quoted at 90-95%; no refiner is lined up yet, so the card shows the band. */
const REFINER_LO=0.90, REFINER_HI=0.95;
/* PEAK_OVER WAS HERE AND IS GONE. It was the threshold at which spot
   counted as "over its 90-day average", and its own comment said the
   trouble with it: "written out at each of the three places that ask the
   question, which is how two of them end up disagreeing later." That is
   exactly what happened - suggestPay trimmed the rate for it, oldGuard
   multiplied the ounce by 0.9 for it, and loanPctOfMelt applied it a third
   time while reporting. The premium is priced once now, by the loan's
   min(spot, 90-day average) floor, and there is no threshold left to
   disagree about. Dead constants with comments claiming they matter are
   worse than no comment at all. */
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
/* THE CARD USED TO WORK THIS OUT A SECOND TIME AND GET IT WRONG.
   It re-derived the share of melt from spot, the 90-day average and the
   rate - and left out metalGuard's cut entirely, which is most of the
   difference. So the card said "48% of melt" while calcMetal handed the
   customer 42%, a six-point lie in the only place the counter could have
   checked. It closed to zero only when the market ran hot enough for the
   old floor to bind, which is why it looked right whenever anybody went
   looking at a spike.
   One source now: ask calcMetal what it actually did and report that. The
   label cannot disagree with the money because it is the money. */
function pctOfMelt(which){
  const m=(typeof calcMetal==="function")?calcMetal():null;
  if(!m||!(m.melt>0))return null;
  const out=(which==="buy")?m.buy:m.loan;
  return Math.round(out/m.melt*100);
}
function loanPctOfMelt(){ return pctOfMelt("loan"); }
/* ================= WHAT THE MARKET HAS ACTUALLY DONE =================
   The counter's question, in his words: don't just lend off today's rate.
   He is right, and the reason is arithmetic rather than opinion. A buy is
   over in days - the lot ships, the money comes back. A pawn is a 60-day
   position in the metal whether you wanted one or not: thirty days to
   maturity, then thirty more the statute makes you hold it. Those are two
   different exposures and they should not be priced off the same number.

   The old guard was `min(spot, 90-day average)` plus a 10% trim when spot
   ran hot. Honest, and blind in one eye: it only ever looked at the LEVEL.
   In September 2026 gold sat within 0.1% of its 90-day average, so the
   guard did nothing at all - while the metal was swinging at the 85th
   percentile of its own 25-year history and sitting 21% below January's
   peak. Calm price, violent market.

   metals-risk.json is what tools/build-metal-risk.mjs measured off 6,700
   LBMA fixings back to 2000: for every day, what a 60-day hold was worth
   when it ended. The fifth percentile of that - one hold in twenty went at
   least this far against you - IS the haircut. It is not a forecast. It is
   what the last quarter-century did, sorted.

   Re-run the tool whenever you want the table to learn from more months. */
let MRISK=null, MHIST=null;
async function loadMetalRisk(){
  try{
    const [a,b]=await Promise.all([
      fetch("metals-risk.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch("metals-history.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).catch(()=>null)]);
    if(a&&a.metals)MRISK=a;
    if(b&&b.days)MHIST=b;
    if(MRISK||MHIST){ try{ render(); }catch(e){} }
  }catch(e){}
}
/* THE PART THAT KEEPS BUILDING.
   Every price the morning feed brings in is written down here, so the
   series the desk reasons from grows by a day, every day, without anybody
   re-running anything. The shipped history is the seed; this is the log. */
const SPOTLOG="pawnDeskSpotLog";
function spotLogRead(){ try{ return JSON.parse(localStorage.getItem(SPOTLOG)||"{}")||{}; }catch(e){ return {}; } }
function spotLogWrite(day,gold,silver){
  if(!day||!(gold>0)||!(silver>0))return;
  try{
    const L=spotLogRead();
    if(L[day]&&L[day][0]===gold&&L[day][1]===silver)return;
    L[day]=[gold,silver];
    /* three years is plenty to hold on a device; the table behind the
       haircut lives in the shipped file, not here */
    const keys=Object.keys(L).sort();
    while(keys.length>1100)delete L[keys.shift()];
    localStorage.setItem(SPOTLOG,JSON.stringify(L));
  }catch(e){}
}
/* shipped history + everything logged since, one series, newest last */
function metalSeries(metal){
  const out={};
  if(MHIST&&MHIST.days&&MHIST.days[metal])for(const [d,v] of MHIST.days[metal])out[d]=v;
  const L=spotLogRead(), i=metal==="silver"?1:0;
  for(const d in L){ const v=L[d]&&L[d][i]; if(v>0)out[d]=v; }
  return Object.keys(out).sort().map(d=>[d,out[d]]);
}
/* Today's reading of the market, from that series. Everything here is
   arithmetic on prices - no judgement is applied until metalGuard(). */
function metalState(metal){
  const S=metalSeries(metal);
  if(S.length<80)return null;
  const v=S.map(r=>r[1]), n=v.length;
  const live=spotOf(metal);
  /* the counter's own typed number wins for today, same as everywhere else */
  const spot=(live>0)?live:v[n-1];
  const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
  const a90=mean(v.slice(-63)), a200=mean(v.slice(-140));
  const peak=Math.max.apply(null,v.slice(-252));
  const lr=[]; for(let i=1;i<n;i++)lr.push(Math.log(v[i]/v[i-1]));
  const w=lr.slice(-21);
  if(w.length<15)return null;
  const m=mean(w);
  const vol=Math.sqrt(w.reduce((x,y)=>x+(y-m)*(y-m),0)/(w.length-1))*Math.sqrt(252);
  const R=MRISK&&MRISK.metals&&MRISK.metals[metal];
  const cuts=(R&&R.volCuts)||null;
  let band="normal";
  if(cuts){ const p=vol*100;
    band = p<cuts[0]?"calm" : p<cuts[1]?"normal" : p<cuts[2]?"busy" : "violent"; }
  return {spot, a90, a200, peak, days:n, last:S[n-1][0],
          prem:(spot-a90)/a90, dd:(spot/peak-1), vol, band,
          aboveLong:spot>=a200, cuts};
}
/* ---- THE LITTLE ARROW BY THE PRICE -------------------------------------
   "next to the metal prices, can we put a little icon for trends.
   somehting like an up trend arrow or down trend arrow."

   Read off this repo's own LBMA series, not invented: the spot against
   where it was 22 trading days back, which is about a calendar month. The
   same figure metalTrend already computes for its own purposes - it was
   just never on the screen.

   THE DEAD BAND IS THE WHOLE DESIGN. Gold's median day-over-day move is
   0.71%, so a month can drift a point and a half on noise alone. An arrow
   that flips on noise is worse than no arrow: it is a claim about
   direction that the data does not support, and at a counter it would be
   read as a reason to pay differently. Under 2% in either direction it
   shows a flat bar, which says what is true - nothing is happening.

   It does not touch a price. Nothing in calcMetal reads it. It is a thing
   to glance at, and the number it stands for is in the title so the
   counter can see what the arrow is actually claiming. */
const TREND_DEAD=2;
function metalArrow(metal){
  const S=(typeof metalSeries==="function")?metalSeries(metal):null;
  if(!S||S.length<23)return null;
  const v=S.map(r=>r[1]);
  /* The live feed, or the counter's own typed number, against a month ago.
     A struck quote freezes the PRICE on purpose; the trend behind it has
     not frozen, so this reads the live one. */
  const now=(typeof spotLive==="function")?spotLive(metal):v[v.length-1];
  const then=v[v.length-23];
  if(!(now>0)||!(then>0))return null;
  const pct=(now/then-1)*100;
  return {pct, dir: pct>=TREND_DEAD?"up" : pct<=-TREND_DEAD?"down" : "flat",
          days:30};
}
function trendIconHTML(metal){
  const t=metalArrow(metal); if(!t)return "";
  const n=(t.pct>=0?"+":"")+t.pct.toFixed(1)+"%";
  const title=t.dir==="flat"
    ? `${n} over about a month \u2014 inside the 2% either way that is just noise`
    : `${n} over about a month`;
  const path=t.dir==="up"   ? '<path d="M3 15.5L8.5 9.5l3.5 3.5L19 5.5"/><path d="M14.5 5.5H19V10"/>'
            :t.dir==="down" ? '<path d="M3 5.5L8.5 11.5l3.5-3.5L19 15.5"/><path d="M14.5 15.5H19V11"/>'
            :                 '<path d="M4 10.5h15"/>';
  return `<span class="trendIc ${t.dir}" title="${esc(title)}" aria-label="${esc(title)}">`
    +`<svg viewBox="0 0 22 21" aria-hidden="true">${path}</svg></span>`;
}
/* WHICH WAY IT HAS BEEN GOING, AND WHETHER TO SAY SOMETHING.
   Asked for at the counter, and fairly: "can't you at least warn me a trend
   may be going down and suggest a price, like you do now, and let me take it
   or not."

   Yes. The rate suggestion has always had a Use button; the trend just was
   not feeding it. Two readings do the work, both measured above:

     falling  - under the 200-day average AND well off the 12-month peak.
                Not a prediction that it keeps falling. It is that you are
                holding a thing whose buyers have been getting cheaper.
     unsettled- 30-day swing in the top fifth of its own 25-year history.

   The trim it asks for is deliberately SMALL, and the reason matters: the
   guard price has already taken the big cut off the per-ounce figure. Cut
   the rate hard on top of that and the same fear gets charged twice, which
   is how a shop stops writing tickets. So the guard does the heavy lifting
   and this adds a couple of points of margin for the sitting-on-it risk. */
function metalTrend(metal){
  const s2=metalState(metal);
  if(!s2)return null;
  const S=metalSeries(metal), v=S.map(r=>r[1]);
  const m30=v.length>22?(s2.spot/v[v.length-22]-1):0;
  const falling=(!s2.aboveLong)&&s2.dd<-0.08;
  const unsettled=s2.band==="violent";
  const busy=s2.band==="busy";
  if(!falling&&!unsettled&&!busy)
    return {dir:"steady",warn:false,cut:0,
            short:`${s2.aboveLong?"Above":"Below"} its 200-day average, moving at an ordinary pace.`,
            head:"Nothing unusual in the trend",
            detail:`${metal==="gold"?"Gold":"Silver"} is ${s2.aboveLong?"above":"below"} its 200-day average and moving at an ordinary pace. No trend reason to change your rate.`};
  /* VOLATILITY IS PRICED ONCE, AND IT IS PRICED IN THE GUARD.
     An outside review caught this and the arithmetic backed it up: the
     guard took 12.1% off the per-ounce figure for a violent market, and
     then this took another 5 points off the rate for the same violence.
     Total 17.5% against a measured 60-day tail of 12.1% - five and a half
     points of the same fear, charged twice.

     So the volatility bands no longer move the rate. They still appear in
     the warning, because the counter should know the market is moving; the
     guard below is what answers for it.

     What still moves the rate is DIRECTION. The guard's bands are
     volatility and price-against-90-day-average; neither sees a metal 21%
     off its peak and under its 200-day. A falling market is a different
     fact from a violent one, and it is the only one left here. */
  let cut=0; const bits=[];
  if(falling){ cut+=3;
    bits.push(`it is ${Math.abs(Math.round(s2.dd*100))}% off its 12-month peak and under its 200-day average — the direction has been down, not sideways`); }
  if(unsettled){
    bits.push(`it is swinging ${Math.round(s2.vol*100)}% a year, the top fifth of its own history — the guard price below already carries that`); }
  else if(busy){
    bits.push(`it is moving faster than usual, though not wildly`); }
  if(m30<-0.05)bits.push(`and it is down ${Math.abs(Math.round(m30*100))}% in the last month alone`);
  const head=falling&&unsettled ? `${metal==="gold"?"Gold":"Silver"} is falling, and moving fast`
           : falling ? `${metal==="gold"?"Gold":"Silver"} has been trending down`
           : `${metal==="gold"?"Gold":"Silver"} is moving fast right now`;
  /* One line for the face; the stat tiles under the chart carry the rest,
     so repeating them in prose was 40 words saying what was already there. */
  const short=[
    falling?`${Math.abs(Math.round(s2.dd*100))}% off its 12-month peak, under its 200-day average`:null,
    (unsettled||busy)?`swinging ${Math.round(s2.vol*100)}% a year`:null,
    m30<-0.05?`down ${Math.abs(Math.round(m30*100))}% this month`:null
  ].filter(Boolean).join(", ")+".";
  return {dir:falling?"falling":"unsettled", warn:true, cut:Math.min(5,cut), head,
          short, detail:bits.join("; ")+".", m30, dd:s2.dd, vol:s2.vol};
}
const PREM_BAND=p => p< -0.05?"under" : p<0.05?"at" : p<0.10?"warm" : p<0.15?"hot" : "spike";
/* The two guard prices, and the evidence for each. */
function metalGuard(metal){
  const st2=metalState(metal), R=MRISK&&MRISK.metals&&MRISK.metals[metal];
  if(!st2||!R)return null;
  const byVol=R.byVol&&R.byVol[st2.band];
  const pb=PREM_BAND(st2.prem), byPrem=R.byPrem&&R.byPrem[pb];
  /* Volatility is the better-sampled of the two and the bigger lever, so it
     always counts. The level only overrides it when it is WORSE and has
     enough independent windows behind it to mean anything - gold's "hot"
     bucket is five independent windows in twenty-five years and is not
     something to size a loan off. */
  let use=byVol, from="how hard it is moving";
  if(byPrem&&byPrem.indep>=20&&byVol&&byPrem.p5<byVol.p5){ use=byPrem; from="where the price sits"; }
  if(!use)return null;
  const cap=x=>Math.max(0,Math.min(30,Math.abs(x)));
  const lendCut=cap(use.p5), buyCut=cap(use.q5);
  return {st:st2, band:st2.band, premBand:pb, from, ev:use,
          lendCut, buyCut,
          lend:st2.spot*(1-lendCut/100),
          buy:st2.spot*(1-buyCut/100),
          fixings:R.fixings, from_:R.from, to:R.to};
}
/* The two years behind the number, drawn small enough to live in a column.
   The counter asked for a trend chart on this page; what makes it worth the
   space is not the line but the two marks on it - where the 90-day average
   runs, and where the guard price sits under today. You can see the gap you
   are lending inside. */
function metalChartHTML(metal){
  const S=metalSeries(metal);
  if(S.length<80)return "";
  const G=metalGuard(metal), st2=G?G.st:metalState(metal);
  if(!st2)return "";
  const v=S.map(r=>r[1]);
  const W=340,H=96,PL=4,PR=54,PT=8,PB=14;
  const lo=Math.min.apply(null,v)*0.97, hi=Math.max.apply(null,v)*1.03;
  const X=i=>PL+i/(v.length-1)*(W-PL-PR);
  const Y=p=>H-PB-(p-lo)/(hi-lo)*(H-PT-PB);
  let d="";
  for(let i=0;i<v.length;i++)d+=(i?"L":"M")+X(i).toFixed(1)+" "+Y(v[i]).toFixed(1);
  /* the 90-day average as a trailing line, so "above or below" is visible
     rather than asserted */
  let a="";
  for(let i=62;i<v.length;i++){
    let t=0; for(let k=i-62;k<=i;k++)t+=v[k];
    a+=(a?"L":"M")+X(i).toFixed(1)+" "+Y(t/63).toFixed(1);
  }
  const yGuard=G?Y(G.lend):null;
  const money0=n=>"$"+Math.round(n).toLocaleString("en-US");
  const yr=(()=>{ const out=[]; let seen="";
    for(let i=0;i<S.length;i++){ const m=S[i][0].slice(0,7);
      if(m.slice(5)==="01"&&m!==seen){ seen=m;
        out.push(`<text class="mcAx" x="${X(i).toFixed(1)}" y="${H-3}" text-anchor="middle">${S[i][0].slice(0,4)}</text>`); } }
    return out.join(""); })();
  return `<div class="mChart">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${metal} price, two years, ${money0(v[0])} to ${money0(st2.spot)} per ounce">
      ${G&&yGuard!=null&&yGuard<H-PB?`<rect x="${PL}" y="${yGuard.toFixed(1)}" width="${(W-PL-PR).toFixed(1)}" height="${(H-PB-yGuard).toFixed(1)}" class="mcSafe"/>`:""}
      <path d="${d}" class="mcLine"/>
      <path d="${a}" class="mcAvg"/>
      ${G&&yGuard!=null?`<line x1="${PL}" y1="${yGuard.toFixed(1)}" x2="${(W-PR).toFixed(1)}" y2="${yGuard.toFixed(1)}" class="mcGuard"/>
        <text class="mcLab guard" x="${(W-PR+5)}" y="${(yGuard+3.5).toFixed(1)}">${money0(G.lend)}</text>`:""}
      <circle cx="${X(v.length-1).toFixed(1)}" cy="${Y(st2.spot).toFixed(1)}" r="3.2" class="mcNow"/>
      <text class="mcLab now" x="${(W-PR+5)}" y="${(Y(st2.spot)+3.5).toFixed(1)}">${money0(st2.spot)}</text>
      ${yr}
    </svg>
    <div class="mcKey"><span><i class="k1"></i>${metal} fix</span><span><i class="k2"></i>90-day average</span>${G?`<span><i class="k3"></i>lend against</span>`:""}</div>
  </div>`;
}
/* The reading, and the number it produces, with the evidence attached. The
   counter has to be able to argue with it - so it says what it measured,
   how many windows are behind it, and what it would say instead if the
   market were calm. */
function metalGuardHTML(metal){
  const G=metalGuard(metal);
  if(!G)return metalChartHTML(metal);
  const s2=G.st, ev=G.ev, T=metalTrend(metal);
  const money0=n=>"$"+Math.round(n).toLocaleString("en-US");
  const pc=n=>(n>=0?"+":"−")+Math.abs(n).toFixed(1)+"%";
  const BAND={calm:["Calm","good"],normal:["Normal",""],busy:["Busy","warn"],violent:["Moving fast","bad"]}[G.band]||["",""];
  const lending=st.deal!=="buy";
  /* WORDY, and it was: 270 words. The face now carries the reading, the
     number and the button. The reasoning behind the number is true and
     worth having, and it is worth having in a fold. */
  return `<div class="card mGuard">
    <span class="label">${metal==="gold"?"Gold":"Silver"} &mdash; what the market has been doing</span>
    ${T?`<div class="mWarn ${T.warn?"on":"off"}">
      <div class="h">${T.warn?"⚠ ":""}${esc(T.head)}</div>
      <div class="p">${esc(T.short)}</div>
      ${(()=>{ const S=suggestRate();
        if(!(T.cut>0&&S))return "";
        const on=curRate()===S.pay;
        /* THREE CLOSERS IN FORTY-FIVE WORDS. "not the same one twice" and
           "a suggestion, not a rule" both restated the line above them
           rather than adding anything, and the first one answers a worry
           about double-counting that is worth answering - in the button,
           where a worry belongs. What is left is the number, the button,
           and what to do if he disagrees. */
        return `<div class="ask">Suggested ${lending?"lending":"buy"} rate <b>${S.pay}%</b>, not <b>${S.bare}%</b>, for the direction. ${infoBtn("melt-double")}
          ${on?`<span class="ison">You're on it.</span>`:`<button class="ghostBtn" id="useTrend">Use ${S.pay}%</button>`}
          <span class="no">Work off ${S.bare}% if you read it differently.</span></div>`;
      })()}
    </div>`:""}
    ${metalChartHTML(metal)}
    <div class="mRead">
      <div class="mStat"><span class="k">30-day swing</span><b class="${BAND[1]}">${Math.round(s2.vol*100)}%</b><span class="s">${BAND[0]}</span></div>
      <div class="mStat"><span class="k">Off its 12-month peak</span><b>${pc(s2.dd*100)}</b><span class="s">peak ${money0(s2.peak)}</span></div>
      <div class="mStat"><span class="k">Against the 90-day</span><b>${pc(s2.prem*100)}</b><span class="s">${s2.aboveLong?"above":"below"} its 200-day</span></div>
    </div>
    <div class="mVerdict ${lending?"lend":"buy"}">
      <div class="k">${lending?"Lend against":"Buy against"}</div>
      <div class="d">${money0(lending?G.lend:G.buy)}<small>/oz</small></div>
      <div class="s">${(lending?G.lendCut:G.buyCut).toFixed(1)}% off today's ${money0(s2.spot)}</div>
    </div>
    <details class="fold iFold"><summary class="foldLine">Where that ${(lending?G.lendCut:G.buyCut).toFixed(1)}% comes from</summary>
      <div class="iMore">
        <p>${lending
          ? `A pawn is 60 days: 30 to maturity, 30 more you must hold it. Across every 60-day stretch since 2000, one in twenty lost more than <b>${Math.abs(ev.p5).toFixed(1)}%</b> when ${metal} was ${G.band==="violent"?"moving this hard":G.band==="busy"?"this busy":G.band==="calm"?"this calm":"moving normally"}. Lend under that and a bad two months still leaves you whole.`
          : `A buy ships in the next refiner lot, so the exposure is days. Over a 10-day hold in conditions like today's, one in twenty lost more than <b>${Math.abs(ev.q5).toFixed(1)}%</b> &mdash; so a buy can be offered closer to today's price than a loan can.`}</p>
        <p>From <b>${(G.fixings||0).toLocaleString("en-US")}</b> London fixings, ${G.from_}&ndash;${G.to}. This band matches ${ev.n.toLocaleString("en-US")} days (about ${ev.indep} independent windows); ${ev.down}% ended lower, median ${pc(ev.mid)}, worst ${pc(ev.worst)}. Chosen on ${G.from}.
        ${ev.indep<20?`<b class="thin">Thin band &mdash; about ${ev.indep} windows. A hint, not a rule.</b>`:""}</p>
      </div>
    </details>
  </div>`;
}
function calcMetal(){
  const g=parseFloat(st.grams); if(!g||g<=0)return null;
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  const purity=st.metal==="gold"?PURITY.find(p=>p.k===st.karat).p:0.925;
  const melt=(spot/31.1035)*purity*g;
  const premium=avg>0?(spot-avg)/avg:0;
  /* THE GUARD PRICE, MEASURED RATHER THAN GUESSED.
     Was min(spot, 90-day average) with a 10% trim when spot ran hot. That
     only ever read the LEVEL, so a market that was calm in price and
     violent in movement got no guard at all. metalGuard() prices the loan
     off what a 60-day hold has actually cost in conditions like today's,
     and the buy off what a 10-day hold has cost - because a buy ships and
     a pawn sits. The old rule stays as the floor: if it is more cautious
     than the measurement on a given day, it wins. */
  const G=(typeof metalGuard==="function")?metalGuard(st.metal):null;
  /* THE x0.9 CAME OFF. min(spot, 90-day average) is already the premium
     charge - it refuses to lend off a spike by pricing the ounce at the
     average instead. Multiplying by 0.9 on top charged the same fact a
     second time, and suggestPay used to charge it a third. The floor
     stays, because "do not lend off a spike" is a real rule and it is the
     one place that fact is now priced. */
  const oldGuard=Math.min(spot,avg||spot);
  const lendOz=G?Math.min(G.lend,oldGuard):oldGuard;
  const buyOz=G?Math.min(G.buy,spot):spot;
  const meltGuard=(lendOz/31.1035)*purity*g;
  const meltBuy=(buyOz/31.1035)*purity*g;
  return {melt,buy:meltBuy*(st.payPct/100),loan:meltGuard*(st.loanPct/100),
          premium,guard:G,lendOz,buyOz,
          guarded:lendOz<spot,trimmed:buyOz<spot};
}
/* When the quote was struck, in words, off the feed's own timestamp rather
   than this device's clock. */
/* THE CLOCK TIME THE PRICE WAS STRUCK. "We should probably add a time
   metals was updated next to the date" - asked looking at the phone's hero
   card, which said "Sep 29" over $4,123 and gave no hint whether that
   number was twenty seconds or nine hours old. A date alone cannot tell
   those apart, and now that the price refreshes on a timer rather than
   once at boot, the difference is the whole point.
   Empty when the feed never answered, because a time invented from this
   device's clock would be the exact lie this is here to stop. */
function feedClock(){
  const t=FEED.at?Date.parse(FEED.at):0;
  if(!t)return "";
  return new Date(t).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})
    .replace(/\s?([AP])M/i,(m,a)=>a.toLowerCase()+"m");
}
function feedAgo(){
  const t=FEED.at?Date.parse(FEED.at):0;
  if(!t)return "";
  const s=Math.max(0,Math.round((Date.now()-t)/1000));
  if(s<90)return "seconds ago";
  const m=Math.round(s/60);
  if(m<90)return m+" minute"+(m===1?"":"s")+" ago";
  const h=Math.round(m/60);
  return h+" hour"+(h===1?"":"s")+" ago";
}
function feedTagHTML(){
  /* Age off the FEED'S OWN timestamp when it has one. FEED.date is stamped
     from this device's clock at fetch time, so it says "today" for a number
     that arrived this morning and has not moved since - which is exactly
     the case this line exists to warn about. */
  const at=FEED.at?Date.parse(FEED.at):0;
  const days=at?Math.floor((Date.now()-at)/86400000)
               :Math.round((Date.now()-new Date(FEED.date+"T12:00:00").getTime())/86400000);
  const stale=days>3;
  if(st.manual) return `<div class="feedTag">Your hand-entered number for today — the morning update takes back over tomorrow.</div>`;
  /* THE QUOTE IS HELD AND THE MARKET IS NOT. Both said, because saying only
     one of them is what makes a counter distrust the screen: a price that
     silently refuses to move looks as broken as one that moves while
     somebody is deciding. Drift under a tenth of a percent is not said at
     all - it is noise, and a line that appears constantly gets ignored. */
  const held=spotHeld(st.metal), live=FEED[st.metal];
  if(held>0&&live>0){
    const d=(live-held)/held*100;
    const moved=Math.abs(d)>=0.1;
    return `<div class="feedTag">
      <b>Quoted at ${money(held)}</b> — held for this ticket, so the figures below will not move while he decides.
      ${moved?`Spot is <b>${money(live)}</b> now, ${d>0?"up":"down"} ${Math.abs(d).toFixed(1)}%${feedAgo()?" as of "+feedAgo():""}. <button type="button" id="reQuote" class="ghostBtn" style="padding:6px 12px;margin-left:6px">Re-quote at ${money(live)}</button>`
              :`Spot has not moved since.`}</div>`;
  }
  return `<div class="feedTag${stale?" stale":""}">${stale
    ? `Last updated ${days} days ago (${FEED.date}) — check Kitco and type today's number in.`
    : `<b>${money(FEED[st.metal])}</b> from ${FEED.source}${feedAgo()?", struck "+feedAgo():""} — it refreshes by itself and holds still once you enter a weight. Type over it any time; your number wins for the day.`}</div>`;
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
    ${row("Today's price, per troy ounce","$"+spot.toLocaleString("en-US"))}
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
  const charge=pawnCharge(m.loan);
  return `<div class="card"><span class="label">What it costs him to get it back</span>
    ${pawnRateHTML()}
    <div class="ladder" id="payLadder" style="margin-top:14px">${ladder(m.loan,charge).map(r=>`<div class="widget rung"><div class="k">${r.k}</div><div class="d">${money(r.due)}</div></div>`).join("")}</div>
    <div style="font-size:13.5px;line-height:1.5;color:var(--ink-2);margin-top:9px">
      It is <b style="color:var(--ink)">not</b> ${pawnPct()}% again every month. The charge caps at <b style="color:var(--ink)">twice</b> the
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
function metalResultHTML(num){
  /* The step numbers are the ORDER THEY ARE READ IN, and on a phone that
     is not the order the desk stacks them. The caller hands them out. */
  const n=(typeof num==="function")?num:(()=>{let i=5;return()=>++i;})();
  const m=calcMetal();
  if(!m)return `<div class="card" style="text-align:center;color:var(--ink-3);font-size:13px;padding:28px">Put it on the scale and enter the grams.</div>`;
  const pawn=st.deal==="pawn";
  const wt=esc(st.grams)+"g "+(st.metal==="gold"?st.karat:".925");
  const shown=pawn?m.loan:m.buy;
  const pctMelt=m.melt>0?Math.round(shown/m.melt*100):st.payPct;
  return `<div class="card">
    <span class="label">${n()} &middot; ${pawn?"The loan":"The offer"}</span>
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
        /* "That leaves $48 to $60 over the $169 you paid" was asked about
           from the counter, and rightly. "Leaves ... over" reads as a
           leftover BALANCE rather than the profit it is, and it slipped
           into the past tense - "you paid" - on a card describing an offer
           nobody has made yet. The other two branches on this very line
           say "would pay". Say profit, and say it in the same tense. */
        return left+` That is <b style="color:var(--ink)">${money(lo-offR)} to ${money(hi-offR)} profit</b> on the ${money(offR)} you would pay.`;
      })()}</div>`:""}
    ${pawn&&(m.guarded||m.trimmed)?`<div class="tagNote">${(m.premium>0.05||m.trimmed)
      ?`<b style="color:var(--ink)">Peak guard is on.</b> ${st.metal==="gold"?"Gold":"Silver"} is ${Math.round(m.premium*100)}% above its 90-day average, so the loan is sized off the average${m.trimmed?" and trimmed another 10%":""} \u2014 as if today's high never happened.`
      :`<b style="color:var(--ink)">The loan is sized off the 90-day average</b>, not today's spot.`}
      You may own this metal in 60 days. Sizing the loan low is what keeps it covering the ticket if the market falls first.</div>`:""}
    ${whyHTML("metal")}
  </div>
  <div class="card">
    <span class="label">${n()} &middot; After the money moves</span>
    <div class="tagWarn" style="margin-top:0"><b>This does not ship for 30 days.</b> Everything we buy or take in has to sit unaltered, here in Liberty County, for 30 calendar days before it can be sold or disposed of — &sect; 539.001(9)(c). Date-tag it and put it in the hold bin. "Melt" is how we price it, not something we may do to it inside that window.</div>
  </div>`;
}
function renderMetal(){
  syncPay();
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  /* the pipeline: 1 metal → 2 today's price → 3 the guard → 4 weight → 5 pay rate → 6 THE OFFER → 7 the rules */
  /* WHICH METAL IS THE FIRST QUESTION, NOT THE SECOND HALF OF ONE.
     Gold and silver are different jobs - different price, different
     purity, different fakes, different spec table - and the choice sat
     under "is he selling it" as though it were a detail of that. Put it
     first and everything below it is about that metal only. */
  const metalCard=()=>`<div class="card">
    <span class="label">${n()} &middot; Gold or silver?</span>
    <div class="pills${st.metal==="gold"?" mb14":""}" style="border-radius:var(--r-s)">
      <button class="${st.metal==="gold"?"on":""}" style="flex:1" data-metal="gold">Gold</button>
      <button class="${st.metal==="silver"?"on":""}" style="flex:1" data-metal="silver">Silver .925</button>
    </div>
    ${st.metal==="gold"?`<span class="label">Karat &mdash; read the stamp</span>
      <div class="pills" style="border-radius:var(--r-s)">${PURITY.map(p=>`<button class="${st.karat===p.k?"on":""}" style="flex:1;padding:7px 4px" data-karat="${p.k}">${p.k}</button>`).join("")}</div>`:""}
  </div>`;
  const dealCard=()=>`<div class="card">
    <span class="label">${n()} &middot; Is he selling it, or pawning it?</span>
    <div class="pills" style="border-radius:var(--r-s)">
      <button class="${st.deal==="buy"?"on":""}" style="flex:1" data-deal="buy">Buying it</button>
      <button class="${st.deal==="pawn"?"on":""}" style="flex:1" data-deal="pawn">Pawn loan</button>
    </div>
  </div>`;
  const spotCard=()=>`<div class="card"><span class="label">${n()} &middot; Today's ${st.metal} price, per troy ounce</span>
    <input id="spotIn" type="number" inputmode="decimal" value="${spot}" class="numIn">
    ${feedTagHTML()}
  </div>`;
  const avgCard=()=>`<div class="card"><span class="label">${n()} &middot; 90-day average — the peak guard</span>
    <input id="avgIn" type="number" inputmode="decimal" value="${avg}" class="numIn">
    <div class="cardHint">Auto-filled by the morning feed. ${infoBtn("melt-avg")}</div>
  </div>`;
  const rb=rateBounds();
  /* THE SCALE COMES FIRST.
     This used to render the spotting-fakes card above the weight box. The
     right-hand panel says "put it on the scale and enter the grams" and the
     box it meant was four checklist rows further down, off the bottom of a
     1080p screen - the one instruction the page gives you pointed at
     something you could not see. The checks are what you do WHILE the piece
     is on the scale, not before you weigh it. */
  const weightCard=()=>`<div class="card"><span class="label">${n()} &middot; Weight in grams</span>
    <input id="gramsIn" type="number" inputmode="decimal" placeholder="0.0" value="${esc(st.grams)}" class="numIn big">
    <div class="cardHint">Pull stones, clasps, and anything that isn't the metal. On a diamond ring, the setting is the money — resale on the stone is 20&ndash;30% of retail.</div>
  </div>`;
  const rateCard=()=>`<div class="card"><div class="rateRow"><span class="label">${n()} &middot; ${PAWN()?"What I lend against melt (%)":"What I pay against melt (%)"}</span><input id="payNum" class="numIn rateNum" type="number" inputmode="numeric" min="${rb.min}" max="${rb.max}" value="${curRate()}"></div>
    <input type="range" min="${rb.min}" max="${rb.max}" value="${curRate()}" id="paySlider">
    <div id="paySuggest">${suggestHTML()}</div>
    ${PAWN()?`<div class="cardHint" style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
      Your lending rate, kept separate from the buy rate. When ${st.metal} sits above its 90-day average the peak
      guard trims it, so the money out the door today is <b style="color:var(--accent)">${loanPctOfMelt()}% of melt</b>.
      </div>`:`<div class="cardHint" style="border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding-top:9px">
      Your buy rate. The lending rate is set separately &mdash; switch to <b style="color:var(--ink)">Pawn loan</b> to change it.</div>`}
  </div>`;
  const extra=()=>`<div id="metalExtra">${metalExtraInner()}</div>`;
  /* The trend chart the counter asked for, and the guard price it explains.
     Empty string until the two data files land, so a cold load or an
     offline device simply does not show it rather than showing a hole. */
  const guardCard=()=>(typeof metalGuardHTML==="function")?metalGuardHTML(st.metal):"";
  /* THE TRADE'S WORDS, ONCE, IN PLAIN ONES.
     Reported from the counter: "I'm still learning the lingo and rational.
     I don't know what spot vs loan means." Mine to answer for - the page
     was using "spot" as though everybody knew it, in a fold whose whole job
     was explaining something. Every screen says "today's price" now. This
     card teaches the trade word anyway, because a customer or a dealer WILL
     say it and it should not be the first time you hear it. Folded shut:
     read once, then never again. */
  const wordsCard=()=>`<details class="card fold wordsFold"${st.openWords?" open":""} id="wordsFold">
    <summary class="foldLine">What the words mean</summary>
    <dl class="words">
      <dt>Today's price &mdash; the trade calls it <i>spot</i></dt>
      <dd>What one troy ounce of pure gold is trading for right now: <b>${money(Math.round(spotOf("gold")))}</b>.
        Every dealer quotes off it. It is the number in box 3 and up in the header.</dd>
      <dt>Troy ounce</dt>
      <dd>How metal is weighed. <b>31.1 grams</b>, not the 28.3 in a kitchen ounce &mdash; about 10% heavier.</dd>
      <dt>Melt</dt>
      <dd>What the gold <i>inside</i> the piece is worth at today's price. A 14k ring is 58.5% gold,
        so its melt is 58.5% of its weight priced as pure. The rest is alloy and worth nothing.</dd>
      <dt>Buying it, or a pawn loan</dt>
      <dd><b>Buying</b> &mdash; it is yours when he walks out. It goes in the next refiner lot and the money
        is back in days. <b>Pawn loan</b> &mdash; he keeps ownership, you hold the piece. Day 30 it matures,
        day 60 it is yours. So a loan leaves you holding gold for two months, and that is why the loan
        is priced lower than the buy.</dd>
    </dl>
  </details>`;

  /* THE ANSWER SHOULD NOT BE THE FOURTH SCREEN.
     On the desk these are three columns and the offer is already beside
     the weight. On a phone they stack, and the order the desk reads
     left-to-right became 3657px of scroll: the offer started at 2554px,
     past the fold three times over, with the 908px spotting-fakes
     checklist sitting between the scale and the number.
     So the phone gets its own order. The counter's only real inputs are
     whether he is buying and what it weighs - the spot price and the
     90-day average are filled in by the morning feed and are reference,
     not questions. Weigh it, see the number, then tune and read.
     The numbers are handed out in reading order, so they still count 1,
     2, 3 down the screen whichever order that is. */
  /* deskRail() is item-mode only; the metal page needs the WIDTH question. */
  const phone=!deskWide();
  let N=0; const n=()=>++N;

  if(phone){
    /* A GATING SHEET GOES BEFORE THE NUMBER IT GATES.
       Bullion holds the price until every check is answered, so its
       checklist belongs above the offer. Jewelry only advises, so it
       drops below, out of the middle of the workflow. */
    const gates=(()=>{ const f=fakeState(fakeSheet(null)); return !!(f&&f.sh&&f.sh.gate); })();
    const parts=[metalCard(), dealCard(), weightCard()];
    if(gates)parts.push(fakeCardHTML(null));
    /* the offer and the rules it carries take the next numbers */
    const res=metalResultHTML(n);
    parts.push(`<div id="metalResult">${res}</div>`, rateCard(), guardCard(), extra(), spotCard(), avgCard(), wordsCard());
    if(!gates)parts.push(fakeCardHTML(null));
    return `<div class="colC">${parts.join("")}</div>`;
  }

  const left=`<div class="colL">${metalCard()}${dealCard()}${wordsCard()}${spotCard()}${avgCard()}</div>`;
  const mid=`<div class="colC">${weightCard()}${guardCard()}${fakeCardHTML(null)}${rateCard()}${extra()}</div>`;
  const right=`<div class="colR"><div id="metalResult">${metalResultHTML(n)}</div></div>`;
  return left+mid+right;
}
function wireMetal(){
  const v=document.getElementById("view");
  v.querySelectorAll("[data-deal]").forEach(b=>b.onclick=()=>{st.deal=b.dataset.deal;render();});
  v.querySelectorAll("[data-metal]").forEach(b=>b.onclick=()=>{st.metal=b.dataset.metal;st.payTouched=false;st.loanTouched=false;render();});
  v.querySelectorAll("[data-karat]").forEach(b=>b.onclick=()=>{st.karat=b.dataset.karat;render();});
  const p=document.getElementById("paySlider"), pn=document.getElementById("payNum");
  function wireSuggest(){
    /* The trend strip's button and the rate card's button do exactly the
       same thing - take today's suggestion - so they share the handler
       rather than growing a second way to set the same number. */
    const t=document.getElementById("useTrend");
    if(t)t.onclick=()=>{const s=suggestRate();if(!s)return;
      setTouched(false);setRate(s.pay);if(p)p.value=s.pay;if(pn)pn.value=s.pay;
      if(p)paintSlider(p);persist();upd();};
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
  const mt=document.getElementById("meltTgtNum");
  if(mt)mt.onchange=()=>{ mt.value=setMeltTarget(st.metal,PAWN()?"loan":"buy",mt.value); upd(); };
  const rq=document.getElementById("reQuote");
  if(rq)rq.onclick=()=>{ releaseSpot(); holdSpot(); upd(); };
  const gIn=document.getElementById("gramsIn");
  gIn.oninput=()=>{ st.grams=gIn.value;
    /* A weight is the moment a figure exists, so it is the moment to hold.
       Clearing the weight means there is nothing quoted, so it lets go
       again - otherwise the next customer is priced off the last one's
       market. */
    if(parseFloat(st.grams)>0)holdSpot(); else releaseSpot();
    upd(); };
  paintSlider(p);
  p.oninput=()=>{setTouched(true);setRate(Number(p.value));if(pn)pn.value=p.value;paintSlider(p);upd();};
  p.onchange=()=>persist();
  const rb=rateBounds();
  if(pn)pn.oninput=()=>{let n=parseInt(pn.value);if(isNaN(n))return;n=Math.max(rb.min,Math.min(rb.max,n));
    setTouched(true);setRate(n);p.value=n;paintSlider(p);upd();};
  if(pn)pn.onblur=()=>{pn.value=curRate();persist();};
  wireSuggest();
  wirePawnRate();
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
  if(st.syncShared==="no")return `<div class="tagWarn" style="background:var(--bad-wash);color:var(--bad-ink)">
    <b>Not shared \u2014 and not saved.</b> The service says: ${esc(st.syncWarn||"no disk attached to the service")}.
    Prices built here stay on this device, and the service forgets its copy every time it restarts.
    In Railway: open the service, <b>Variables and Settings</b>, add a <b>Volume</b> mounted at
    <b style="font-family:var(--mono)">/data</b>, then redeploy. Do that before paying for a long run.
    <div style="margin-top:8px"><button class="ghostBtn" id="harvCheck">${syncBusy?"Checking\u2026":"Check again"}</button></div></div>`;
  if(st.syncShared==="yes")return `<div class="tagNote" style="margin-top:10px">
    <b style="color:var(--accent)">Saved, and on all your devices.</b> A price you build here shows up on the
    phone too, and none of it is lost when the service restarts. Nothing to do — this is the way it should read.
    Last checked ${esc(when)}.
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
    ${st.harvErr?`<div class="tagWarn" style="background:var(--bad-wash);color:var(--bad-ink)">${esc(st.harvErr)}</div>`:""}
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
  /* The steps STAY on the screen. An info button is for the reasons and
     the background, not for what he has to do next - hiding an instruction
     behind a hover is the same bug as burying it in a paragraph. What went
     into the button is why a spreadsheet, where the file lives, and what
     happens to a blank row. */
  return `<div class="card"><span class="label">Your own prices, from a spreadsheet ${infoBtn("own-prices")}</span>
    <div class="cardHint" style="margin-top:0">Put what you get for it in the <b style="color:var(--ink)">YOUR VALUE</b> column,
      save the sheet as CSV, and drop it here. ${n} things priced.</div>
    ${mine?`<div class="tagNote" style="margin-top:9px"><b style="color:var(--accent)">${mine}</b> of them are already carrying your numbers rather than the built-in ones.</div>`:""}
    <div class="row2" style="gap:9px;flex-wrap:wrap;margin-top:10px">
      <label class="brassBtn" style="cursor:pointer;margin:0;padding:11px 18px">Choose the CSV
        <input id="shFile" type="file" accept=".csv,.tsv,.txt,text/csv" style="display:none"></label>
      <button class="ghostBtn" id="shPasteGo" style="padding:11px 16px">or paste the rows</button>
    </div>
    ${st.shPaste?`<textarea id="shPaste" placeholder="Select the rows in Excel or Sheets, copy, and paste them here — headings included."
      style="width:100%;margin-top:9px;min-height:110px;background:var(--well);color:var(--ink);border:1px solid var(--e2);border-radius:10px;padding:10px;font-family:var(--mono);font-size:12px"></textarea>
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
/* One line each, for the mode he is actually in. The other three are a
   hover away rather than three paragraphs he is not reading. */
const FLOW_LINE={
  ask:"One question on the screen at a time. Answering it moves on.",
  pages:"One job to a page, with the price always on top.",
  steps:"The step you are on; the rest folded to a line.",
  all:"Every step expanded at once."
};
function renderSetup(){
  return `<div class="narrow">

  <div class="card"><span class="label">This copy of the tool</span>
    <div class="cardHint" style="margin-top:0">Running <b style="color:var(--ink);font-family:var(--mono)">${APP_BUILD}</b>${st.newBuild
      ?` &mdash; the site has <b style="color:var(--warn);font-family:var(--mono)">${esc(st.newBuild)}</b>, so this device is behind. Fetch it.`
      :` &mdash; the newest there is.`} It also sits beside SYS.OK at the top of every screen.</div>
    <div class="row2" style="margin-top:9px;align-items:center"><button class="ghostBtn" id="pdFresh">Get the newest version</button>${infoBtn("hard-reload")}</div>
  </div>
  ${pdServer()?harvCardHTML():""}
  ${sheetCardHTML()}
  ${pdServer()&&window.PHONE?`<div class="card"><span class="label">Connected</span>
    <div class="cardHint" style="margin-top:0"><b style="color:var(--accent)">This phone is on.</b> It can look up what things sold for, and the camera works \u2014 the card for it is on the <b style="color:var(--ink)">Check a price</b> tab, headed <i>Snap it</i>.</div>
  </div>`:""}
  ${window.PHONE||!pdServer()?"":`<div class="card"><span class="label">Switching another device on</span>
    <div class="cardHint" style="margin-top:0">This computer is connected. Point a phone\u2019s camera at the code below, or type these two lines into it. ${infoBtn("device-each")}</div>
    ${pdServer()?`<span class="label" style="margin-top:12px">Service address</span>
    <div class="roOut" style="user-select:all">${esc(pdServer())}</div>
    <span class="label" style="margin-top:10px">Token</span>
    <div class="roOut" style="user-select:all">${esc(pdToken()||"(none set)")}</div>
    ${typeof qrSVG==="function"?`<div style="margin-top:12px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <div style="background:#fff;padding:9px;border-radius:10px;line-height:0">${qrSVG(pdHandoffLink(),196)}</div>
      <div class="cardHint" style="margin:0;flex:1;min-width:190px">Point the phone\u2019s camera at this and tap the link. Nothing to type. ${infoBtn("handoff-qr")}</div>
    </div>`:""}
    <div class="row2" style="margin-top:9px"><button class="ghostBtn" id="pdCopyConn" title="Copy both lines so you can send them to yourself">Copy both</button></div>
    <div class="cardHint" style="font-size:12.5px">The token is a key to the shop. ${infoBtn("token-key")}</div>`:""}
  </div>`}
  ${pdServer()?"":pdConnectHTML()}
  ${pdServer()?`<div class="card"><span class="label">Is the service working?</span>
    <div class="cardHint" style="margin-top:0">On, and pointing at <b style="color:var(--ink)">${esc(pdServer())}</b>. ${infoBtn("conn-test")}</div>
    <div class="row2" style="margin-top:9px"><button class="brassBtn" id="pdConnTest" style="padding:11px 18px">Test the connection</button>
      <button class="ghostBtn" id="pdConnOff">Disconnect</button></div>
    <div class="cardHint" id="pdConnMsg" style="min-height:16px"></div>
  </div>`:""}
  <div class="card"><span class="label">Move the shelf record between devices</span>
    <div class="cardHint" style="margin-top:0">${seenAll().length} tag${seenAll().length===1?"":"s"} on this device. ${infoBtn("shelf-move")}</div>
    <div class="row2" style="margin-top:9px;gap:8px;flex-wrap:wrap">
      <button class="ghostBtn" id="seenOut" title="Save every recorded tag to a file">Export</button>
      <label class="ghostBtn" style="margin:0;cursor:pointer" title="Load tags from a file exported on another device">Import<input id="seenImp" type="file" accept="application/json,.json" style="display:none"></label>
    </div>
  </div>
${window.PHONE?"":`  <div class="card"><span class="label">How the pricing page is laid out ${infoBtn("flow-modes")}</span>
    <div class="pills mb14" style="border-radius:var(--r-s);margin-top:8px;flex-wrap:wrap">
      <button class="${stepFlow()==="ask"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="ask">One question at a time</button>
      <button class="${stepFlow()==="pages"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="pages">One page at a time</button>
      <button class="${stepFlow()==="steps"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="steps">One step at a time</button>
      <button class="${stepFlow()==="all"?"on":""}" style="flex:1;padding:9px 6px;font-size:12px;min-width:110px" data-flow="all">Everything open</button>
    </div>
    <div class="cardHint" style="margin-top:0">${esc(FLOW_LINE[stepFlow()]||"")}</div>
  </div>`}
  <details class="card foldCard" id="rulesFold"${st.openRules?" open":""}>
    <summary><span class="label" style="margin:0">Walk away, and what goes to the sheriff</span><span class="foldSub">the red flags, what we don't take, and the reporting deadlines</span></summary>
    ${flagsInner()}
  </details>
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
function flagsInner(){
  return `<div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Any one of these and the answer is no. A stolen item costs you the loan, the goods, and a conversation with the sheriff.</p></div>
  ${FLAGS.map(f=>`<div class="card flag" style="display:flex;gap:12px;align-items:center"><span class="x">&times;</span><span>${f}</span></div>`).join("")}
  <div class="card"><span class="label">Things we don't take, whatever the price</span>
    <div class="cardHint" style="margin-top:0">Nothing wrong with the customer &mdash; these just cost more than they make. They are kept off the price lists on purpose, so nothing here quotes you a number for one.</div>
    ${NO_TAKE.map(n=>`<div class="rules sect"><span class="hd"><b>${n[0]}</b></span> ${n[1]}</div>`).join("")}
  </div>
  <div class="card">
    <div class="rules">Every transaction goes to the sheriff's office on the approved state form. Photo ID, <b>right</b> thumbprint, serial numbers, full description — no exceptions, no favors, no matter who's standing there.</div>
    <div class="rules sect"><span class="hd"><b>By the end of the next business day.</b></span> Yesterday's forms go to the sheriff today — &sect; 539.001(9)(a). Keep our copies on the premises a year, and don't destroy any of them for three.</div>
    <div class="rules sect"><span class="hd"><b>If a hold order lands on something:</b></span> it runs 90 days. When it expires, we send the sheriff a certified letter, return receipt. If no court extends it within 10 days of them receiving that letter, the item becomes ours. Nothing else starts that clock — if nobody sends the letter, we simply lose it.</div>
  </div>`;
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
/* WHAT THE SERVICE SAID ABOUT THE LAST LOOKUP, AND WHY.
   /ebay answers with basis ("sold" or "asking"), the source it actually
   reached, and a warning saying why it is not the better one - "sold-price
   quota spent for the month, fell back to asking prices" is the live case
   today. All three were read for one thing, a single word on the tally
   strip, and then dropped on the floor: the tally is gone the moment the
   price lands and the card moves on, so by the time anybody is deciding,
   the screen had no idea where its own number came from.
   It is kept here and carried onto the price itself. */
let LAST_EBAY=null;
const EBAY_SOURCE_NAME={soldcomps:"SoldComps", marketplace_insights:"eBay sold prices",
                        browse:"eBay listings"};
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
  /* THE SIEVE, CARRIED. "so on all of ebay there are almost no DeWalt 20V
     impact driver kit Cordless drill / driver? I find that hard to
     believe" - and he is right not to. There are thousands. The card said
     "18 asking prices on eBay" and left him to conclude eBay had eighteen
     of them.
     What actually happened is that eBay returned a page of listings and
     this tool threw most of it away: parts, multi-packs, and the wrong
     model. The service has counted that from the beginning and sent it
     back in `found` and `dropped`, and the desk dropped both on the floor
     the moment they arrived. Eighteen is what SURVIVED, and the sieve is
     the interesting half. */
  LAST_EBAY={basis:j.basis==="sold"?"sold":"asking",
             source:String(j.source||""), warning:String(j.warning||""),
             found:Math.round(Number(j.found)||0),
             dropped:(j.dropped&&typeof j.dropped==="object")?j.dropped:null,
             ts:Date.now()};
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
  /* The headline used to say "not connected" even when `on` was true - so a
     device that WAS switched on and had merely lost the service for a moment
     was told it had never been set up, under a button reading "Switch it on".
     The headline follows the state now.

     The prose under it was four paragraphs deep, 250px of it, and on a phone
     that pushed the two fields and the search box off the bottom of the
     screen. What someone setting this up needs is the consequence in a line
     and then the boxes. */
  return '<div class="card" id="pdConnCard" style="border:1px dashed var(--e2-hi)"><span class="label">'+(on
      ? "Switched on, but the shop&rsquo;s service is not answering"
      : "This device is not connected to the shop&rsquo;s service")+'</span>'+
    '<div class="cardHint">'+(on
      ? "Check that it is running, then test the connection below."
      : "No <b style=\"color:var(--ink)\">sold-price lookups</b> until it is. Two lines, pasted once.")+'</div>'+
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
    '<div class="cardHint" style="font-size:12.5px">Switch tabs to copy &mdash; what you typed stays put.'+
      (window.PHONE?" Both are under <b style=\"color:var(--ink)\">Setup</b> on the counter computer.":"")+'</div>'+
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
  /* A MISSING KEY IS NOT A CONNECTION FAULT, AND IT LOOKED LIKE ONE.
     /limits now says whether the service has an Anthropic key at all, and
     that read is free. Without one, every picture read comes back "no_key"
     after a POST that could not have worked - so it is said here, before
     the POST, and it names the variable and the place to put it. The eBay
     line is said in the same breath because sold-price lookups do NOT need
     this key: a shop with eBay configured and no Anthropic key still gets
     its comps, and should be told so rather than left thinking nothing
     works. */
  {
    const ph=(limits.body&&limits.body.photo)||null, eb=(limits.body&&limits.body.ebay)||null;
    if(ph&&ph.key===false){
      say("var(--bad)","The service is up, but it has <b>no Anthropic key</b>, so it cannot read photographs or screenshots. "
        +"Add <b>ANTHROPIC_API_KEY</b> in Railway (Variables) and redeploy."
        +(eb&&eb.sold?" Sold-price lookups do not need that key and are working \u2014 those come straight from eBay.":""));
      return; }
  }
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
  /* The shop's own reference weights. Kept out of the [data-fake] handler
     below because these do not answer a check - they set up what the next
     measurement is compared against. */
  const rf=e.target&&e.target.closest?e.target.closest("[data-refpick],[data-refdel],[data-refsave]"):null;
  if(rf){
    if(rf.dataset.refpick){ const [sid,...n]=String(rf.dataset.refpick).split(":");
      st.refPick=Object.assign({},st.refPick,{[sid]:n.join(":")}); st.refOpen=true; render(); return; }
    if(rf.dataset.refdel){ const [sid,...n]=String(rf.dataset.refdel).split(":");
      refDel(sid,n.join(":")); st.refOpen=true; render(); return; }
    if(rf.dataset.refsave){ const sid=rf.dataset.refsave;
      const nm=(st.refName&&st.refName[sid])||"", g=(st.refG&&st.refG[sid])||"";
      if(refAdd(sid,nm,g)){
        st.refName=Object.assign({},st.refName,{[sid]:""});
        st.refG=Object.assign({},st.refG,{[sid]:""});
        st.refPick=Object.assign({},st.refPick,{[sid]:String(nm).trim().slice(0,48)});
      }
      st.refOpen=true; render(); return; }
  }
  const fl=e.target&&e.target.closest?e.target.closest("#fakeLookGo,#fakeLookStop"):null;
  if(fl){
    const sh=fakeSheet(calcItem()); if(!sh)return;
    if(fl.id==="fakeLookStop"){ try{ fakeLookCtl&&fakeLookCtl.abort(); }catch(e){} return; }
    runFakeLook(sh); return;
  }
  const rs=e.target&&e.target.closest?e.target.closest("#refFold>summary"):null;
  if(rs){ st.refOpen=!st.refOpen; return; }
  const f=e.target&&e.target.closest?e.target.closest("[data-fake],[data-mkind],[data-flow],#fakeClear,#worthNone"):null;
  if(f){
    /* LAND ON THE LAST CARD, NOT THE FIRST. firstOpenAsk returns 0 when
       nothing is open, and runFinished needs the counter ON the last card
       - so answering the last question sent him back to question one and
       the run still did not read as finished. The test caught it: "the run
       finishes instead of recycling" went red with nothing left open. */
    if(f.id==="worthNone"){
      st.worthNone=true;
      const q=askQueue(calcItem());
      const nx=q.findIndex(z=>!z.answered&&!z.optional);
      st.askAt=nx<0?q.length-1:nx;
      render(); return; }
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
  const lg=document.getElementById("logCard");
  if(lg){ lg.innerHTML=logCardInner(calcItem()); wireLogButton(); }
}
/* A price-book pick lands in the category's one custom slot, so every book
   item in a category would otherwise share an id — and share a sales history
   that isn't theirs. Key them by the book name instead. */
function isCustom(){ return String(st.itemId||"").indexOf("cust-")===0; }
function itemKey(){ return st.itemId + (isCustom()&&st.bookName ? "|"+st.bookName : ""); }
/* WHAT A LOGGED SALE IS FILED UNDER. The item type was too coarse: a Glock 19
   and a Hi-Point C9 both went in under "semi-auto pistol", so four sales
   averaging $185 might be two of each and the tool could not say which. When
   a priced row is pinned the sale is filed under that row instead, so what
   comes back is sales of THAT gun. No model pinned and it still files under
   the item - the honest answer for something with no row.
   Changed before the shop opened, with nothing in the log. Later would have
   meant migrating real records or pooling wrong forever. Only the deal log
   uses this; the cache and step keys stay on itemKey, which is about which
   screen you are on and not about what sold. */
function dealKey(){ return (st.mpPin&&st.mpPin.id) ? "m:"+st.mpPin.id : itemKey(); }
function displayName(x){ return (isCustom()&&st.bookName) ? st.bookName : x.item.name; }
/* "Microsoft microsoft surface book". The make is prefixed to the item's
   name, which is right for "Microsoft laptop" and wrong the moment the name
   is the counter's own words - because those words are where the make was
   read FROM. Say it once. */
/* "I type google home mini, then click the brand Google, and it searches for
   google google home mini." The make is prepended to the model without ever
   looking at whether the model already starts with it - and when the counter
   types the whole name, which is the normal way to use the box, it always
   does. A doubled word costs sold-price hits: eBay is matching titles, and no
   seller writes the make twice.
   dedupeMake below does this already but lower-cases what it returns, which
   is right for an internal key and wrong for a label the counter reads. This
   one returns the make only when the name is missing it, so it drops out of
   the list instead of being glued on. */
function makeIfMissing(make,name){
  const m=String(make||"").trim(), n=String(name||"").trim();
  if(!m)return "";
  return n.toLowerCase().includes(m.toLowerCase()) ? "" : m;
}
function dedupeMake(make,name){
  const n=String(name||"").toLowerCase().trim(), m=String(make||"").toLowerCase().trim();
  if(!m)return n;
  return n.indexOf(m)>=0 ? n : m+" "+n;
}
function dealsFor(key){ return DEALS.filter(d=>(d.key||d.itemId)===key); }
/* The shop's own sales are the best evidence there is, and they were being
   AVERAGED - the one statistic that lets a single odd sale drag the number,
   in the one place the counter trusts most. Three guns out at $150, $180 and
   $400 read $243 when the truthful figure is $180. Worst where it matters
   most, too: the mean misleads hardest on a handful of sales, and a handful
   is what a shop has. Everything else in this tool reads the middle. This
   does now as well. */
function soldStats(key){
  const sold=dealsFor(key).filter(d=>d.status==="sold"&&Number(d.soldPrice)>0)
    .map(d=>Number(d.soldPrice)).sort((a,b)=>a-b);
  if(!sold.length)return null;
  return {n:sold.length, mid:pct(sold,.5), lo:sold[0], hi:sold[sold.length-1]};
}
function ownCompsInner(x){
  if(!CAP.db) return "";
  const k=dealKey(), s=soldStats(k), open=dealsFor(k).filter(d=>d.status==="open").length;
  if(!s&&!open) return `<div class="cardHint" style="margin-top:9px">No sales of your own yet.</div>`;
  let h=`<div class="tagNote" style="margin-top:10px">`;
  if(s){
    h+=`<b style="color:var(--ink)">Your own sales: ${s.n}</b> — middle <b style="color:var(--accent)">${money(s.mid)}</b>`;
    h+=(s.n>1?`, range ${money(s.lo)}&ndash;${money(s.hi)}`:``)+`. `;
    h+=`This is Bristol money, not eBay money. <button id="useOwn" class="ghostBtn" style="padding:6px 12px;font-size:12.5px;margin-left:4px">Use ${money(s.mid)}</button>`;
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
/* WHAT THE HARVEST FOUND FOR A ONE-OFF.
   A price-book row is the generic kind of thing - "Wheelbarrow", "Grease
   gun" - and it has no model number in its name. Both of the routes a
   measured price normally travels, mpAuto and harvFind, require a token
   with a DIGIT in it before they will pin a row, because a model number is
   the one part of a name that cannot be coincidence. So a harvested
   wheelbarrow could never have reached the counter: the lookup would have
   been paid for and thrown away.
   These get their own lane instead. prices.json may carry a "book" map of
   name to value, and it sits between the baked-in guess and the counter's
   own figure - published measurement beats my estimate, and what the
   counter typed beats both, because they are holding the thing. */
let BOOK_PRICES={};
function bookVal(e){
  const mine=Number(st.bookVals&&st.bookVals[e[0]]);
  if(mine>0)return Math.round(mine);
  const pub=Number(BOOK_PRICES[e[0]]);
  if(pub>0)return Math.round(pub);
  return e[1];
}
/* Is this row still the figure nobody checked? The screens say so, and the
   answer has to survive a harvest landing. */
function bookChecked(name){ return Number(BOOK_PRICES[name])>0; }
function pickBookEntry(e){
  st.catId=e[2]; st.itemId=custId(e[2]); st.bookName=e[0]; st.overrides[custId(e[2])]=bookVal(e);
  st.liq=e[3]; st.brand="mid"; st.brandTyped="";st.brandQ=""; st.brandSet=false; st.model=""; st.detail="";
  st.complete=true;st.completeSet=false;clearDeal();st.askEdit=false; st.editing=false; st.specSel={};
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
/* A few spec answers split the market so hard that searching without them
   pools two different tools into one price. A bare drill is 0.52 of a kit
   and a combo is 1.64 of it, so a search that says neither returns a blend
   of all three and the counter reads the blend as the answer. Those
   options carry a `q` - the words a seller actually types in the title,
   "tool only" and "combo kit" - and only those. Every other answer stays
   out: the voltage is already in the model number, and each extra word
   narrows an eBay search that is thin to begin with. */
/* ONLY WORDS SOMEBODY ACTUALLY CHOSE GO INTO A SEARCH.
   This used to fall back to specBase when a group was unanswered, so an
   option's q could enter the query with nobody having picked it. Nothing
   shipped tripped it - no base option carried a q - but the caliber lists
   below make it live and dangerous: the first real caliber in a list would
   become the default, and every unanswered rifle would be searched as a
   .223 that nobody said it was. A silent wrong search is worse than a
   vague right one, because the counter cannot see what it asked for.
   The MULTIPLIER still falls back to the neutral option, as it always did.
   This is about the words, not the arithmetic. */
function specQuery(){
  return (SPEC_CHOICES[st.itemId]||[]).map((g,gi)=>{
    const sel=st.specSel[st.itemId+":"+gi];
    if(sel==null)return "";
    const o=g.options[sel];
    return (o&&o.q)||"";
  }).filter(Boolean).join(" ");
}
function compQuery(x){
  /* THE ROW'S OWN NAME WAS WRECKING THE SEARCH.
     Once the make and the model are known, the kind of thing is already
     implied by them, and tacking the catalog row's description on the end
     turns a good search into a different product. Measured on the live
     service: "DJI Osmo Action 4" returns seven real SOLD listings with
     the Action 4 itself at $165 and $181; "DJI Osmo Action 4 Gimbal /
     pocket camera" falls off sold prices altogether and comes back with
     Osmo POCKETS, a different camera, at asking prices. Nobody searching
     eBay by hand would type the category after the model.
     With no model, the row name is the only description there is, so it
     stays. */
  const named=!!(String(st.brandTyped||"").trim()&&String(st.model||"").trim());
  const bits=named
    ? [makeIfMissing(st.brandTyped,st.model), st.model, st.detail||"", specQuery()]
    : [makeIfMissing(st.brandTyped||"",st.model||""), st.model||"",
       displayName(x).replace(/\s*—.*$/,""), st.detail||"", specQuery()];
  return bits.map(s=>String(s).trim()).filter(Boolean).join(" ").slice(0,120);
}
/* GunWatcher looks a gun up by model name. The category word the keyword
   searches want - "Pump shotgun" on the end of "Remington 870 Express" - only
   blurs it, and so does the gauge. Brand and model, nothing else. When a
   built-in price row is in play its own name is better still: that is the
   name GunWatcher published the sold prices under. */
function gunQuery(x){
  /* THE CALIBER GOES IN. "i think guns should have a specific claiber
     selection so that when i clck the gunwatcher or gunbbroker search
     button, it gives me more accurate data." It was asked and then
     dropped: this function returned the row name or brand+model and never
     touched specQuery, so the one thing the counter had just told the desk
     about the gun was the one thing missing from the search for it.
     The old comment here said the gauge "only blurs it" on GunWatcher.
     That was a judgement made from this container, never tested against
     the site - it answers a server with 403, so it never could be - and
     the counter is reporting the opposite from in front of it. His read
     wins over my untested one. It is one line to put back, and the query
     box on the card shows exactly what the buttons will search for, so it
     takes one glance to see whether it helped or hurt. */
  const cal=specQuery();
  const head=(()=>{
    const row=st.mpPin&&MP_BY_ID[st.mpPin.id];
    if(row)return String(row[2]);
    if(String(st.model||"").trim())
      return [st.brandTyped||"",st.model||""].map(t=>String(t).trim()).filter(Boolean).join(" ");
    return "";
  })();
  if(!head)return compQuery(x);
  return [head,cal].filter(Boolean).join(" ").trim().slice(0,80);
}
function watchCountUrl(q){
  /* WatchCount puts the search words in the path, so a slash would split it
     into the wrong route — turn slashes into spaces (10/22 still finds 10/22). */
  const kw=String(q).replace(/[\/\\]+/g," ").replace(/\s+/g," ").trim().toLowerCase()||"-";
  return "https://www.watchcount.com/sold/"+encodeURIComponent(kw)+"/-/all?site=EBAY_US";
}
/* THE ONE LINE TO CHANGE IF THE WORTHPOINT LINK EVER LANDS WRONG.
   Their search path is blocked to crawlers, so this could not be verified
   from outside the way the eBay and GunBroker links were - it is written
   from the shape their site uses, not from a page anyone here loaded. If a
   click lands somewhere useless, do ONE search on worthpoint.com, copy what
   the address bar says up to and including the "=", and paste it here. The
   comps card has a Copy button for the search words, so the fallback is a
   paste into their own search box and nothing is ever a dead end. */
const WORTHPOINT_SEARCH="https://www.worthpoint.com/worthopedia/search?query=";
/* Marketplace has no public API and Facebook will not serve a page to
   anything that is not a signed-in browser, so this URL could not be
   checked from here any more than WorthPoint's could. It is the shape their
   search uses and it opens in the counter's own signed-in session, which is
   also what keeps the results local - Marketplace searches around wherever
   that account is set, and these devices are set to Bristol.
   If a tap lands somewhere useless: do ONE search on facebook.com, copy the
   address bar up to and including the "=", and paste it here. The comps
   card has a Copy button for the search words, so it is never a dead end. */
const FB_MARKETPLACE_SEARCH="https://www.facebook.com/marketplace/search/?query=";
/* Where it earns its keep. Not a blanket button: everywhere else has a
   model number and eBay is better at those. */
const WORTHPOINT_CATS={jewel:1,coll:1,music:1};
/* PRICECHARTING, AND WHY IT IS ON THE CONSOLE ROWS AND NOWHERE ELSE.
   It is completed eBay sales - the same kind of figure WatchCount gives -
   but indexed the way this market is actually shaped: BY VARIANT. eBay
   searched for "nintendo 64" returns one blended number across a $90 plain
   machine and a $390 Pikachu. PriceCharting has them as separate rows with
   separate prices, which is the whole difficulty of the collector band and
   the reason the variant question exists.

   It also splits loose / CIB / sealed, which is the other two questions on
   these rows, so the counter can read the answer to what the run just
   asked instead of doing the arithmetic in their head.

   Free, no sign-in, and a LINK OUT only - nothing reads a number back off
   it and nothing enters the book by this route, the same line WorthPoint
   and Facebook Marketplace sit on. Its own figures were the source for the
   console rows, measured 29 Sep; see tools/console-findings.md, including
   what is wrong with them (it excludes shipping inconsistently and runs
   high on heavy hardware). */
const PRICECHARTING_ITEMS={e5:1,e5a:1,e5b:1,e5c:1,e5d:1,"Handheld game console":1};
/* WORTHPOINT ON THE RETRO BANDS ONLY. The argument for it is the one the
   jewellery row makes: eBay reaches back 90 days, and a Sega Saturn is a
   four-listing market. WorthPoint goes back years. It is NOT put on the
   post-2001 rows - a PS4 sells every day and eBay prices it fine. */
const WORTHPOINT_ITEMS={e5c:1,e5d:1};
function compTargets(x){
  const q=compQuery(x), e=encodeURIComponent(q), t=[], guns=(st.catId==="guns");
  if(guns){
    t.push({id:"gw",name:"GunWatcher",sub:"",
      url:"https://gunwatcher.com/gun-value-sold-information/market-price?itemName="+encodeURIComponent(gunQuery(x)).replace(/%20/g,"+")});
    t.push({id:"gb",name:"GunBroker",sub:"tick Completed",
      url:"https://www.gunbroker.com/All/search?Keywords="+e});
  }
  t.push({id:"wc",name:"WatchCount",
    sub:guns?"eBay parts &amp; optics only":"",
    url:watchCountUrl(q)});
  /* This used to be the plain sold search, ?LH_Sold=1&LH_Complete=1. It
     reaches back 90 days and no further, so anything that sells a few times
     a year comes back empty - a Kobalt string trimmer returns nothing at
     all, and an empty page reads as "worthless" when it means "not this
     quarter". Seller Hub research gives an average and a sell-through rate
     rather than a list to eyeball. It needs a seller sign-in, which the
     desk has; WatchCount above is the no-sign-in lane and is unchanged.
     It does NOT reach back further: see the dayRange note below. */
  /* THE LANE THAT NEEDS NO SIGN-IN AND HAS NEVER FAILED. Seller Hub is
     below and it has now failed at the counter three times on three
     different URLs - "the ebay button gave me this oops try again here so
     I'm not sure if the ebay link is working or not". It needs a seller
     sign-in nothing here can test with, so every version of it has been
     written blind and checked by him.
     A plain sold search needs no sign-in, no Terapeak entitlement and no
     guessing at parameters. It reaches back 90 days and no further, which
     is why it was replaced in the first place - but ninety days of real
     sales beats a page that says Oops. So it goes back, FIRST, and Seller
     Hub keeps its place underneath for when it works. */
  t.push({id:"ebaysold",name:"eBay sold",sub:"no sign-in, 90 days",
    url:"https://www.ebay.com/sch/i.html?_nkw="+e+"&LH_Sold=1&LH_Complete=1&_sop=13"});
  t.push({id:"ebay",name:"eBay Seller Hub",
    sub:"",   /* "the ebay button doesn't need to say a full year" */
    /* "OUR SERVER FAILED TO RESPOND TO YOUR QUERY" - every single time, on
       a URL this line builds, and TWO guesses at it were wrong before this
       one. Guess one was clutter: categoryId=0 named no category, offset=0
       and limit=50 were the defaults, sorting=-sold was a sort key never
       checked against Terapeak's own, so all five came off. It still
       failed. Guess two was the window: Jace got a good answer out of
       Terapeak at 90 days - avg sold $46.65, 32.36% sell-through, 16,005
       sellers - so dayRange=365 looked like a year his account is not
       entitled to. He tried it. "it still has the server failed message
       even after selecting 90 days." Wrong again, and worth writing down:
       the page working at 90 days is not the same fact as OUR LINK working
       at 90 days, and I treated them as one.
       What is actually known is one URL, the one in his address bar while
       the numbers were on the screen:
         ...&dayRange=90&endDate=1790700432987&startDate=1782924432987
            &offset=0&limit=50&tabName=SOLD
       Those two stamps are exactly 90 days apart. Terapeak's own UI writes
       an explicit date pair - and offset and limit, the two I threw away as
       decoration - and dayRange alone is apparently not a request it will
       answer cold. So this stops guessing at which parameter offends and
       REBUILDS THE ONE URL THAT WORKED, parameter for parameter, with the
       dates computed at render.
       Still unconfirmed from this container: Terapeak needs a seller
       sign-in there is no way to have here, so every version of this line
       has been tested at the counter or not at all. WatchCount above needs
       no sign-in and is the lane that has worked throughout. */
    url:(()=>{ const end=Date.now(), st90=end-90*864e5;
      return "https://www.ebay.com/sh/research?marketplace=EBAY-US&keywords="+e
        +"&dayRange=90&endDate="+end+"&startDate="+st90
        +"&offset=0&limit=50&tabName=SOLD"; })()});

  /* WORTHPOINT, AND ONLY WHERE IT BEATS EBAY.
     eBay reaches back 90 days and indexes by model number. That is the
     wrong shape for an item whose identity is a hallmark, a pattern name
     or a maker's mark and which sells a few times a decade - the run that
     put designer jewellery on the blind list found nothing usable across
     five makers. WorthPoint is a sold-price database for exactly those,
     going back years.
     It is a LINK OUT and nothing more. WorthPoint's terms forbid automated
     access and their robots.txt blocks the search path, so the desk can
     never read a number back off it: no auto-fill, no row in the book.
     A person clicking through to a site they subscribe to is ordinary use;
     a program fetching it is not, and this stays on the right side of that
     line. See tools/source-findings.md.
     Jewelry, collectibles and instruments only - a DeWalt drill has a model
     number and eBay prices it fine. */
  /* WHERE "PRICE IT LOCALLY" ACTUALLY GOES.
     Eighteen aisles carry a notice saying the desk will not look this up
     and to price it locally, and then offered four buttons all pointing at
     eBay - the one place the notice just said does not carry it. The
     instruction was right and there was nowhere to follow it to.

     These are ASKING prices and they are labelled as such. That is not a
     step down here: on a mower, a window unit or a generator there is no
     sold data anywhere a program can reach, and a neighbour's asking price
     forty miles away is a truer read on what one brings in Liberty County
     than a national average of carburettors.

     Link-outs only, on purpose. Facebook's terms forbid automated
     collection and Marketplace has no public listings API; a person tapping
     through to a site they already use is ordinary, a scraper is not - the
     same line WorthPoint sits on. Nothing reads a number back, so nothing
     enters the book by this route. See tools/source-findings.md. */
  /* Not guns: Facebook bans firearms outright, so that search comes back
     empty or full of holsters, and GunWatcher above is the real comp. */
  if(ebayBlind(x)&&!guns){
    t.push({id:"fbm",name:"Facebook Marketplace",sub:"asking, near here",
      url:FB_MARKETPLACE_SEARCH+e});
    t.push({id:"cl",name:"Craigslist \u2014 Tallahassee",sub:"asking, the panhandle",
      url:"https://tallahassee.craigslist.org/search/sss?query="+e});
  }
  if(PRICECHARTING_ITEMS[st.itemId])
    t.push({id:"pc",name:"PriceCharting",
      sub:"sold, split by variant &amp; box",
      url:"https://www.pricecharting.com/search-products?q="+e+"&type=prices"});
  if(WORTHPOINT_CATS[st.catId]||WORTHPOINT_ITEMS[st.itemId])
    t.push({id:"wp",name:"WorthPoint",
      sub:"marks &amp; makers \u2014 paid sign-in",
      url:WORTHPOINT_SEARCH+encodeURIComponent(q)});
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
    ${/* CONDENSED, BECAUSE IT MOVED. This card is 514px and it now sits in
          the rail beside the question rather than stacked under it. Four
          buttons and the search text are what somebody uses; the
          screenshot-paste block and the paragraph about Best Offer are
          what somebody reads once and then knows. Read-once goes behind a
          fold, which is the difference between a panel that fits and a
          panel you scroll. The fold stays open once opened, like every
          other fold on the page. */""}
    <span class="label" style="margin-top:8px">What those buttons search for</span>
    <div class="row2"><input id="compQ" class="roOut" readonly tabindex="-1" aria-label="What those buttons search for" value="${esc(q)}" style="flex:1;min-width:0;font-size:13px"><button id="compCopy" class="ghostBtn" style="padding:10px 15px">Copy</button></div>
    <details class="fold" id="compFold"${st.openComp?" open":""}>
      <summary class="foldLine">Paste a sold screenshot, and what to read off it</summary>
      ${shotZoneHTML(x)}
      ${/* "are these actually sold, or just the auction recently ended?"
            Asked with an eBay sold page open. They ARE sold - LH_Sold=1
            plus the green "Sold <date>" is eBay saying somebody paid -
            but TWO of the rows on his screen were not clean prices, and
            this paragraph only warned about one of them, on the wrong
            site. It said "On WatchCount, a Best Offer sale shows what
            the seller actually took". On eBay’s OWN sold page it does
            the opposite: the number stays at the list price and the
            accepted offer is hidden. That is the lane this card now
            lists FIRST, so the guidance was pointing at the wrong one.
            The bid count is the other, and nothing mentioned it. */""}
      <div class="cardHint">Sold prices, not asking prices. An item listed at $400 that nobody bought is worth nothing to you. <b style="color:var(--ink)">Two rows that say Sold but are not a price:</b> a row reading <b style="color:var(--ink)">Best offer accepted</b> — on eBay the figure shown is what was ASKED and the real take is hidden, so treat it as a ceiling; and <b style="color:var(--ink)">1 bid</b>, which closed at whatever the seller opened at, so it is the floor and not the middle. WatchCount is the other way round on offers: there the figure IS what the seller took, so use it.${guns?" eBay doesn't sell guns &mdash; GunBroker completed auctions is the only real firearm comp.":""}</div>
    </details>
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
      h+=`<div class="tagWarn" style="background:var(--bad-wash);color:var(--bad-ink)"><b>Look closer at:</b><br>${r.concerns.map(c=>"&bull; "+esc(c)).join("<br>")}</div>`;
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
  return `<div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink);margin-top:9px">
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
    case "no_credit": return "The Anthropic account behind the service is out of credit. Top it up at platform.claude.com \u2014 nothing is wrong with the tool.";
    case "not_allowed": return "Anthropic refused the key for this call. Check the key is active and the account has access to the model set in PHOTO_MODEL.";
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
    st.liq="normal"; st.specSel={}; st.editing=false; st.market=null;
    st.model=tidyModel(d.model);
    st.detail=String(d.detail||"").slice(0,80);
    st.brandTyped=String(d.brand||"").slice(0,40);
    const bh=st.brandTyped?brandLookup(st.catId,st.brandTyped):null;
    st.brand=bh?bh.tier:"mid";
    const c2=CONDITIONS.find(c=>c.id===String(d.cond||"")); if(c2)st.cond=c2.id;
    /* THE WEB'S FIGURE IS A MARKET READING, NOT A CATALOG BASELINE.
       Two faults, both found by an outside review and both measured.

       It used to land in st.overrides, which is the CATALOG price - what a
       new-ish one of this kind is worth before the desk works it down. So
       $200 of "what a used one really sells for" was multiplied by
       CATALOG_AT_GOOD (0.8) and then by brand and spec on top, and the
       desk priced off $160. The question asked is "what a used one really
       sells for"; that is a market mid, and the market path applies
       condition and completeness and nothing else.

       Worse, st.overrides was keyed on custId(cat.id) - ONE id shared by
       every custom item in the aisle, and persisted. Photograph an
       unlisted chainsaw at $180 and the next hand-typed custom item in
       outdoor power opened at $180 with nothing on screen saying why.

       Carrying it as the market fixes both: no shared key to leak, and the
       arithmetic stops taking a catalog haircut off a used price. The
       band is the tool's own measured repeatability, and the note says it
       is a web figure so itemGuard grades it as the weak evidence it is. */
    const spread=(INOISE&&INOISE.noiseMid>0?INOISE.noiseMid:17.3)/100;
    st.market={kind:"web", key:mkKey(), mid:price,
               lo:Math.max(1,Math.round(price*(1-spread))),
               hi:Math.round(price*(1+spread)),
               n:0, sold:0, date:todayStr(), src:String(d.where||""),
               note:"researched from the photo, never measured against live listings"};
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
/* THE LOOKUP ONLY EVER FIRED AFTER A PHOTO.
   autoPriceAfterPhoto is the only thing that ever started a search on its
   own, so the camera path got live sold prices and the path everybody
   actually uses - type it, pick it off the list - got the book figure and
   a button to press. Nothing said so; the number just sat there dated
   whenever the harvest last ran.

   It fires on a pick now, but only where the query is worth spending on:
   a make AND a model, which is what an "mp" row or a recognised model
   name gives. A bare category pick ("Laptop - Sony") is deliberately
   left alone - the search would be the word "laptop" and would come back
   with screens and batteries, which is exactly what the "you set it"
   column in the list is telling you. Same reason it is not wired to
   typing: one lookup per keystroke against a 2,000-a-month quota.

   priceFind already refuses where eBay is blind, so a television or a
   quad costs nothing here. */
let pickChase=false, pickLast="";
function autoPriceOnPick(){
  if(pickChase||findBusy||!CAP.sample||!st.picked)return;
  if(!String(st.brandTyped||"").trim()||!String(st.model||"").trim())return;
  const x=calcItem();
  /* NOT x.checked. "Checked" is true the moment the desk has ANY figure,
     and the book price list is a figure - so a DeWalt DCD791, which the
     book knows, was gated out of the very lookup it most needs. That is
     the whole complaint: the row says "as of Sep 23" and nothing goes and
     refreshes it.

     What must not be re-run is a LIVE result: a search already done, a
     sold page photographed, the counter's own sales or shelf tags. A
     book row and a worked-back retail figure are exactly what a live
     lookup is meant to replace. */
  const k=x.market&&x.market.kind;
  if(k==="found"||k==="harvest"||k==="shot"||k==="own"||k==="seen"||k==="hand")return;
  if(ebayBlind(x))return;
  const q=compQuery(x); if(!q||q===pickLast)return;
  pickLast=q; pickChase=true;
  setTimeout(async()=>{
    const ctl=new AbortController();
    const t=setTimeout(()=>ctl.abort(),60000);
    try{ await priceFind(ctl.signal,true); }catch(e){}
    clearTimeout(t); pickChase=false;
    try{ render(); }catch(e){}
  },0);
}
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
  st.complete = true; st.completeSet=false;
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
  const s=soldStats(dealKey());
  /* The ticket number is the one thing that ties this record to the pawn
     system, and it is the only number on a ticket that is not about the
     customer - no name, no address, no ID. Without it, matching a row here
     to the item in Bravo means going by the date and the description. */
  return `<div class="card"><span class="label">Deal log</span>
    ${struckHTML(x)}
    <div class="row2" style="margin:9px 0"><input id="logTicket" class="numIn" type="text" inputmode="numeric"
      autocomplete="off" placeholder="Ticket # (optional)" value="${esc(st.ticket||"")}"
      style="flex:1;min-width:0;font-family:var(--mono);font-size:14px"></div>
    <button id="logDeal" class="brassBtn" title="Saves the item, your estimate, the offer and the ticket number. Mark it Sold with the price it brought, and next time this item comes in the tool offers that figure alongside the outside comps — you still choose it." style="width:100%;padding:11px 0">Log this deal</button>
    <div class="cardHint" id="logMsg">Records the item, your estimate, the offer and the ticket number &mdash; nothing else off the ticket. No name, no address, no ID. Mark it sold later and it teaches the next appraisal.${s?` You've sold ${s.n} of these.`:""}</div>
  </div>`;
}
function logCardHTML(x){ return `<div id="logCard">${logCardInner(x)}</div>`; }
async function saveDeal(){
  if(!CAP.db)return;
  const x=calcItem();
  const _k=struckAmt(x);
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
      itemId: x.item.id, key: dealKey(), itemName: displayName(x),
      brand: st.brandTyped||"", tier: st.brand, model: st.model||"", detail: st.detail||"",
      specs: specTxt, cond: st.cond, complete: !!st.complete, liq: x.liqId,
      market: x.market?x.market.kind:"", marketMid: x.market?x.market.mid:null,
      /* `loan` is what was actually handed over, not the suggestion - that
         is kept beside it as `suggested` so the two can be compared later. */
      resale: Math.round(x.resale), ltv: x.ltv,
      loan: _k.amt, dealKind: _k.kind, struck: _k.typed, suggested: Math.round(x.target),
      charge: _k.kind==="loan"?Math.round(pawnCharge(_k.amt)):0, pawnPct: pawnPct(),
      ticket: String((document.getElementById("logTicket")||{}).value||"").trim().slice(0,24),
      status: "open", soldPrice: null, soldTs: null
    });
    clearDeal();
    if(msg)msg.textContent=(_k.kind==="buy"?"Logged \u2014 bought for ":"Logged \u2014 lent ")+money(_k.amt)
      +". It sits under Not settled yet in the Deal log until you mark it Sold or Redeemed.";
    const si=document.querySelectorAll(".struckIn"); si.forEach(e=>{ e.value=""; });
    document.querySelectorAll(".struckNote").forEach(n=>{ n.innerHTML=struckNoteHTML(calcItem()); });
  }catch(err){
    const code=(err&&err.code)||"unavailable";
    if(msg)msg.innerHTML=`<span style="color:var(--warn)">${esc(code==="quota_exceeded"?"The log is full — clear out old deals.":"Couldn't save that one. Try again.")}</span>`;
  }
}
/* Two instances can be on screen at once - the one that ends the run and the
   one beside the Log button - so they are found by class, kept in step by
   hand, and the note repaints without a render so the cursor stays put. */
function wireStruck(){
  document.querySelectorAll("[data-struckkind]").forEach(b=>b.onclick=()=>{
    st.struckKind=b.dataset.struckkind==="buy"?"buy":"loan"; render(); });
  document.querySelectorAll("[data-struckset]").forEach(b=>b.onclick=()=>{
    st.struck=Number(b.dataset.struckset)||""; render(); });
  document.querySelectorAll(".struckIn").forEach(el=>{
    el.oninput=()=>{ st.struck=el.value;
      document.querySelectorAll(".struckIn").forEach(o=>{ if(o!==el)o.value=el.value; });
      const x=calcItem();
      document.querySelectorAll(".struckNote").forEach(n=>{ n.innerHTML=struckNoteHTML(x); }); };
  });
}
function wireLogButton(){
  wireStruck();
  const tk=document.getElementById("logTicket");
  if(tk)tk.oninput=()=>{ st.ticket=tk.value; };
  const b=document.getElementById("logDeal");
  if(b)b.onclick=saveDeal;
}

/* ---------------- deal log tab ---------------- */
function renderLog(){
  /* Shelf tags are a record of what other shops ask, kept for later. They
     were sitting in the middle of pricing an item, where they have nothing
     to do with the thing in your hand. This is where the shop's own
     records live, so this is where they go. */
  const shelf=seenCardHTML();
  const wrap=(inner)=>`<div class="narrow">${inner}${shelf}</div>`;
  if(!CAP.db){
    return wrap(`<div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">The deal log isn't available on this device. Open the page from the Claude app on the counter tablet.</p></div>`);
  }
  if(!dealsReady){
    return wrap(`<div class="card" style="text-align:center;color:var(--ink-3);padding:26px">Loading the log…</div>`);
  }
  if(!DEALS.length){
    /* 41 words on an empty screen, and the budget caught it once the
       block measure could see past an inline <b>. The instruction stays;
       the reason it is worth doing goes in the button. */
    return wrap(`<div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Nothing logged yet. Price something on the first tab and hit <b style="color:var(--ink)">Log this deal</b>. ${infoBtn("log-why")}</p></div>`);
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
  return wrap(`
    <div class="card"><p style="font-size:14px;line-height:1.6;margin:0;color:var(--ink-2)">Your own sold history. Item facts only &mdash; no names, no ID numbers, nothing off the state form. That record lives in the pawn system, not here.</p></div>
    ${open.length?`<div class="card" style="padding:12px 15px"><span class="label" style="margin:0">Not settled yet &mdash; ${open.length}</span>
      <div class="cardHint" style="margin-top:4px;font-size:12.5px">Logged, and nothing has happened since. On a pawn that means your money is still out; on a buy it means the item has not sold. Close it with <b style="color:var(--ink)">Sold</b> or <b style="color:var(--ink)">Redeemed</b> and it starts teaching the next appraisal.</div></div>${open.map(row).join("")}`:""}
    ${done.length?`<div class="card" style="padding:12px 15px"><span class="label" style="margin:0">Settled &mdash; ${done.length}</span>
      <div class="cardHint" style="margin-top:4px;font-size:12.5px">Sold, or redeemed by the customer. These are what the next price is built from.</div></div>${done.map(row).join("")}`:""}
  `);
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
 e4:"smartphone phone cell cellphone android",
 /* ROUTING THE FOUR BANDS. Before this, every one of these words landed on
    e5 "current gen" at $225 - measured last session, and the reason a PS4,
    an N64 and a Dreamcast all priced the same. The generation names are
    spelled out because that is what gets typed at a counter: nobody writes
    "fifth generation console", they write "n64" or "super nintendo" or
    "sega genesis". The bare word "playstation" or "xbox" with no number
    stays on current gen, which is the right guess when there is nothing
    else to go on - the model question and MP_MATCH sort the rest. */
 e5:"game console gaming playstation 5 ps5 xbox series x xbox series s switch oled",
 e5a:"ps4 playstation 4 xbox one xbox one s xbox one x wii u wiiu last gen previous gen",
 e5b:"ps3 playstation 3 xbox 360 xbox360 nintendo wii",
 e5c:"n64 nintendo 64 super nintendo snes nes famicom sega genesis mega drive sega saturn dreamcast gamecube game cube ps2 playstation 2 ps1 psx playstation 1 psone original xbox retro console vintage console neo geo aes turbografx turbo grafx tg16 pc engine colecovision coleco intellivision intv atari 2600 7800 5200 woody vader sixer",
 e5d:"game boy gameboy game boy color gbc game boy advance gba sp nintendo ds ds lite dsi psp playstation portable game gear handheld retro",
 /* "I typed Google home mini but then you asked for make." Chasing that
     found something worse than a wasted question: "google home mini" was
     landing on f6, HOME GYM / POWER RACK, at $200 - on the word "home". A
     $20 speaker priced as a $200 rack, and Google is not a fitness make, so
     the run stopped to ask for a make it had already read.
     It was not one bad match. Every voice assistant missed, and two landed
     somewhere dearer: "amazon echo dot" found RED DOT SIGHT, "apple
     homepod" found Smartphone, "google nest hub" found a smart doorbell.
     The row existed - e6 - with "bluetooth speaker" as its whole vocabulary,
     which none of those four say. The names people actually use are here
     now, and the row is named for what it holds. */
 e6:"bluetooth speaker smart speaker voice assistant alexa echo dot echo show google home nest mini nest hub homepod sonos jbl bose soundlink flip charge",
 e7:"car audio amp sub subwoofer",
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
 m4:"bass guitar bass four string precision jazz p-bass",
 m5:"keyboard digital piano synth synthesizer electric piano stage piano casio keyboard",
 m6:"drum kit drums drum set snare kick cymbal cymbals electronic drums edrums",
 m7:"saxophone sax alto sax tenor sax soprano sax baritone sax",
 m8:"band instrument clarinet flute trumpet cornet trombone school band marching band",
 m9:"violin fiddle viola",
 m10:"pa speaker powered speaker monitor speaker dj speaker sound system subwoofer",
 m11:"banjo mandolin resonator open back bluegrass",
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
 "E-bike":"ebike electric bike","Camera drone":"drone",
 "Gaming laptop":"gaming laptop rgb omen nitro legion katana alienware predator tuf rog zephyrus blade raider stealth",
 "Video game — sports title":"madden nba 2k fifa fc college football nhl mlb the show ufc sports game",
 "Video game — Nintendo title":"mario zelda pokemon smash splatoon animal crossing kirby metroid donkey kong nintendo game",
 "Gimbal / pocket camera":"osmo gimbal pocket camera ronin stabilizer action cam","Smartwatch \u2014 Apple / Galaxy":"smartwatch smart watch apple watch galaxy watch fitbit","Handheld game console":"handheld",
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
  /* THIS TEST USED TO BE /^[a-z]\d$/ - ONE LETTER, ONE DIGIT. Every
     catalog item was e1..e7, g1..g10, so it held for years and nobody had
     reason to look at it. Adding e5a..e5d broke it silently: findEntry
     fell through to the book branch, searched PRICEBOOK for an entry NAMED
     "e5a", found none, and returned null. The effect at the counter was
     that typing "playstation 4" matched the PS4 model row, could not
     resolve the item it points at, dropped the strong match, and answered
     from the keyword map instead - which put it back on "current gen" at
     $225. The row was right, the price was right, and the lookup threw
     them away one step before the screen.
     A book entry is a NAME ("Handheld game console"), an item is a short
     id, so the two are told apart on shape: letters, digits, and an
     optional letter suffix, with no spaces. */
  return /^[a-z]+\d+[a-z]?$/.test(ref) ? OMNI_IDX.find(e=>e.kind==="item"&&e.itemId===ref)||null
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
 /* DJI was mapped to "Camera drone" outright, so every DJI thing became a
    drone - and Osmo is not one. Osmo is the gimbal and pocket-camera line,
    Ronin and RS are gimbals, Mic is a microphone; the drones are Mavic,
    Mini, Air, Avata, Neo, Phantom and Inspire. A DJI Osmo Pocket 3 landed
    on a $300 drone row and then searched as one. The rows are listed in
    the order the model word picks them. */
 ["DJI","elec",["Camera drone","Gimbal / pocket camera"]],["GoPro","elec",["GoPro / action camera"]],["Thompson Center","guns",["g9"]],
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
  /* THE MAKE QUESTION READS A DIFFERENT BOOK FROM THE ROUTER.
     These seventeen were registered here, for routing, and nowhere else -
     so brandLookup and brandHits, which read BRANDBOOK, had never heard of
     DJI, GoPro, Polaris, Honda-in-powersports, Lowrance or any of them.
     At the counter that is a dead end: the make question asks who makes
     it, the box already says DJI, and there is nothing to tap and nothing
     that recognises what is typed. The router knew all along.
     They go into the book too, at the tier they were declared with, so
     one list answers both. */
  EXTRA_BRANDS.forEach(([n,cat,items])=>{
    add(n,cat,"mid",items);
    const bk=BRANDBOOK[cat];
    if(bk&&bk.mid&&!["hi","mid","lo"].some(t=>(bk[t]||[]).some(x=>x.toLowerCase()===n.toLowerCase())))
      bk.mid.push(n);
  });
  return Array.from(m.values()).map(e=>Object.assign(e,{re:new RegExp("(^|[^a-z0-9])"+omniEsc(e.name.toLowerCase())+"(?=$|[^a-z0-9])")}))
    .sort((a,b)=>b.name.length-a.name.length);
})();
/* WHAT A MAKE ACTUALLY SELLS.
 *
 * A brand carries a category, not a product list, so typing one alone
 * offered every item in its category: Garmin proposed a compound bow and
 * a crossbow, Leupold a trolling motor, Shimano a rifle scope, Bowtech a
 * rod and reel. Forty-one of the fifty-five hunting makes had no list at
 * all, which is most of the shelf.
 *
 * BRAND_FIRST below is an ordering hint and stays one - restricting on it
 * would hide a Mossberg rifle behind its shotguns. This is the stricter
 * statement: these makes sell THESE THINGS AND NOTHING ELSE, so anything
 * else in the category is not offered. Only written where it is plainly
 * true; a make that really does span its category simply is not listed
 * here and behaves as before. */
const OPTICS=["h1","h2","h3","Spotting scope","Red dot sight"];
const RODS=["h7","Offshore rod & reel","Fly rod & reel"];
const BRAND_ONLY={
  /* glass */
  "leupold":OPTICS,"vortex":OPTICS,"zeiss":OPTICS,"swarovski":OPTICS,"bushnell":OPTICS,
  "nikon":OPTICS,"burris":OPTICS,"athlon":OPTICS,"primary arms":OPTICS,"tasco":OPTICS,
  "simmons":OPTICS,"bsa":OPTICS,"cvlife":OPTICS,"pinty":OPTICS,"truglo":OPTICS,
  "sig sauer optics":OPTICS,"trijicon":OPTICS,"aimpoint":["Red dot sight"],"eotech":["Red dot sight"],
  "nightforce":["h1","Spotting scope"],
  /* bows and crossbows */
  "mathews":["h5"],"hoyt":["h5"],"bowtech":["h5"],"bear archery":["h5"],"pse":["h5"],"diamond":["h5"],
  "ravin":["h6","Crossbow bolts & broadheads — lot"],"tenpoint":["h6","Crossbow bolts & broadheads — lot"],
  "barnett":["h6","Crossbow bolts & broadheads — lot"],"excalibur":["h6","Crossbow bolts & broadheads — lot"],
  "wicked ridge":["h6","Crossbow bolts & broadheads — lot"],"centerpoint":["h6","Crossbow bolts & broadheads — lot"],
  /* rods, reels and what pushes the boat */
  "shimano":RODS,"g loomis":RODS,"st. croix":RODS,"abu garcia":RODS,"penn":RODS,"lew's":RODS,
  "13 fishing":RODS,"ugly stik":RODS,"daiwa":RODS,"zebco":RODS,"shakespeare":RODS,"south bend":RODS,
  "minn kota":["h8"],"motorguide":["h8"],
  /* sonar. Garmin also makes watches, which live in electronics and are
     reached from there - this is the hunting half of what it sells. */
  "humminbird":["Fish finder"],"lowrance":["Fish finder"],
  "garmin":["Fish finder","h3","Smartwatch — Apple / Galaxy"],
  /* cameras in the woods */
  "wildgame innovations":["h4","Cellular game camera"],"stealth cam":["h4","Cellular game camera"],
  "tactacam":["h4","Cellular game camera"],"moultrie":["h4","Cellular game camera"],
  "spypoint":["h4","Cellular game camera"],"browning trail cameras":["h4","Cellular game camera"]
};
/* when a brand is typed alone, these items go to the top of its list */
const BRAND_FIRST={"weed eater":["p2"],"glock":["g7"],"sig sauer":["g7"],"canik":["g7"],"kimber":["g7"],"staccato":["g7"],"hi-point":["g7","g5"],
 "sccy":["g7"],"charter arms":["g8"],"benelli":["g2","g1"],"mossberg":["g1","g2"],"henry":["g4","g6"],"marlin":["g4","g6"],"cva":["g9"],
 "traditions":["g9"],"tikka":["g3"],"bergara":["g3"],"minn kota":["h8"],"mathews":["h5"],"hoyt":["h5"],"ravin":["h6"],"tenpoint":["h6"],
 "leupold":["h1"],"nightforce":["h1"],"trijicon":["h1","Red dot sight"],"aimpoint":["Red dot sight"],"eotech":["Red dot sight"],
 "holosun":["Red dot sight"],"moultrie":["h4"],"tactacam":["h4"],"spypoint":["h4"],"reconyx":["h4"],"generac":["p7"],"champion":["p7"],
 "predator":["p7"],"exmark":["Zero-turn mower","p5"],"scag":["Zero-turn mower"],"bad boy":["Zero-turn mower"],"gravely":["Zero-turn mower"],
 /* Sonos is a known electronics make, so the desk routed it to that
    aisle's likeliest thing - a TV - and a $100 speaker came back priced as
    a television. Vizio going to a TV is right and stays; Sonos makes
    speakers and nothing else. Found while checking the smart-speaker fix,
    not reported: "sonos" alone still missed after the keywords were widened,
    because a make the desk RECOGNISES never reaches the keyword list. */
 "sonos":["e6"],
 "apple":["e4","e3","e2"],"nintendo":["e5","e5c","e5d","Handheld game console"],"xbox":["e5"],"sega":["e5c"],"gibson":["m2","m1"],"martin":["m1"],"taylor":["m1"],
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
 /* YAMAHA MAKES PIANOS, AND THE DESK CALLED THEM ALL OUTBOARD MOTORS.
    Same shape as DJI: the brand is registered against powersports, so a
    model name the book did not recognise fell through to the brand's
    category and came out an outboard. Every one of these was wrong - a
    P-125 digital piano, a PSR keyboard, a Clavinova, an FG800 acoustic,
    a YAS-23 alto sax, HS8 monitors, an RX-V385 receiver. Yamaha's
    instruments are among the commonest things across a pawn counter and
    the tool had no idea what any of them were.
    The rows all already existed; nothing pointed at them. */
 MB(/\b(yamaha\s*)?(clavinova|clp|cvp|csp)\s*-?\s*\d*\b/,"Yamaha","Digital piano — 88 key"),
 MB(/\b(yamaha\s*)?p\s*-\s*(45|71|85|105|115|121|125|143|145|225|255|515|525)\b/,"Yamaha","Digital piano — 88 key",
    {label:m=>"P-"+m[2]}),
 MB(/\b(yamaha\s*)?psr\s*-?\s*\w*\d+\w*/,"Yamaha","Keyboard — 61 key"),
 MB(/\b(yamaha\s*)?(fg|fs|apx|ll|ls|csf|storia)\s*-?\s*\d{2,3}\w*/,"Yamaha","m1"),
 MB(/\b(yamaha\s*)?pacifica\s*\d*\b/,"Yamaha","m2"),
 MB(/\b(yamaha\s*)?yas\s*-?\s*\d+\b/,"Yamaha","Alto saxophone"),
 MB(/\b(yamaha\s*)?hs\s*-?\s*(5|7|8)\b/,"Yamaha","Powered PA speaker"),
 MB(/\b(yamaha\s*)?(rx\s*-?\s*[va]|tsr|aventage)\s*-?\s*\d*\w*/,"Yamaha","AV receiver"),
 MB(/\b(yamaha\s*)?(mg|emx)\s*-?\s*\d+\w*/,"Yamaha","Audio mixer — PA board"),
 MB(/\b(yamaha\s*)?dtx\s*-?\s*\d*\w*/,"Yamaha","Full drum set"),
 /* Thompson Center. The brand pointed at the muzzleloader row outright,
    so a Compass and a Venture - both plain bolt-action centrefire rifles -
    came back as muzzleloaders. The Encore and Contender are left alone:
    those really are made in both forms, and guessing either way would be
    the same mistake in the other direction. */
 MB(/\b(thompson\s*center\s*|t\/?c\s*)?(compass|venture)\b/,"Thompson Center","g3"),
 /* DJI. The brand alone used to mean "Camera drone", so an Osmo Pocket 3
    landed on a $300 drone row and then searched as a drone. Osmo, Ronin
    and RS are the gimbal and pocket-camera lines; Mavic, Mini, Air,
    Avata, Neo, Phantom and Inspire are the aircraft. */
 /* The generation number has to be CAPTURED, not just matched past. It
    was falling outside the groups, so "dji osmo action 4" came back
    labelled "Osmo action" - and a search for that returns Action 3s, 4s
    and 5s together. The number is most of the model. */
 MB(/\b(dji\s*)?osmo\s*(pocket|action|mobile|nano)?\s*(\d+)?\s*(pro|plus|se)?\b/,"DJI","Gimbal / pocket camera",
    {label:m=>("Osmo "+(m[2]?pretty(m[2]):"")+" "+(m[3]||"")+" "+(m[4]?pretty(m[4]):"")).replace(/\s+/g," ").trim()}),
 MB(/\b(dji\s*)?(ronin|rs)\s*-?\s*\d*\b/,"DJI","Gimbal / pocket camera"),
 MB(/\b(dji\s*)?(mavic|avata|phantom|inspire|neo)\b/,"DJI","Camera drone"),
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
 MB(/\b(tactacam\s*)?reveal(\s*(x|xb|pro|sk|ultra|x\s*pro))?\b/,"Tactacam","h4",{spec:{Type:"Cellular"}}),
 MB(/\bspypoint\s*(link\w*|flex\w*|force\w*)\b/,"Spypoint","h4",{spec:{Type:"Cellular"}}),
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
 /* SURFACE IS FOUR DIFFERENT MACHINES AND THE DESK KNEW NONE OF THEM.
    "microsoft surface" found the laptop rows fine, but "surface book" and
    "surface pro" - the two names anybody actually says - found nothing:
    Surface Book went to COMIC BOOKS on the strength of the word "book",
    and Surface Pro offered a coin collection and a gas grill off "pro".
    A Book, a Laptop and a Studio are laptops; a Pro and a Go are tablets. */
 MB(/\bsurface\s*(book|laptop|studio)(\s*\d+)?\b/,"Microsoft","e2",{label:m=>"Surface "+pretty(m[1])+(m[2]||"")}),
 MB(/\bsurface\s*(pro|go)(\s*\d+)?\b/,"Microsoft","e3",{label:m=>"Surface "+pretty(m[1])+(m[2]||"")}),
 /* THE GENERATION IS THE ITEM NOW, so the brand-model reader has to say
    which one. It returned "e5" for every PlayStation and every Xbox ever
    made, and that is not a cosmetic miss: a modelItem match is STRONG and
    leads the list, so "playstation 2" came back as "Game console - current
    gen, $225" while the measured $90-120 PS2 row sat underneath it,
    correct and ignored. The row was right and the reader threw it away.
    A bare "playstation" or "xbox" with no number still goes to current
    gen. That is the right guess with nothing else to go on, and the model
    question sorts it from there. */
 MB(/\b(sony\s*)?(ps[1-5]|psx|psone|playstation\s*\d?)(\s*(pro|slim|digital))?\b/,"Sony",
   m=>{ const g=m[2];
        if(/ps4|playstation\s*4/.test(g))return "e5a";
        if(/ps3|playstation\s*3/.test(g))return "e5b";
        if(/ps2|playstation\s*2|ps1\b|psx|psone|playstation\s*1/.test(g))return "e5c";
        return "e5"; },
   {label:m=>(/psone|ps1\b|playstation\s*1/.test(m[2])?"PlayStation 1":
              pretty(m[2].replace("playstation","PlayStation")))+(m[3]?" "+pretty(m[3]):""),
    spec:m=>/digital/.test(m[0])?{Version:"Current gen, digital"}:null}),
 MB(/\b(original\s*xbox|xbox\s*(classic|og)|\bogxbox\b)\b/,"Microsoft","e5c",{label:"Xbox (original)"}),
 MB(/\bxbox(\s*(series\s*[xs]|one\s*[xs]?|one|360))?\b/,"Microsoft",
   m=>/360/.test(m[0])?"e5b":/one/.test(m[0])?"e5a":"e5",
   {label:m=>"Xbox"+(m[1]?" "+pretty(m[1]):""),
    spec:m=>/series\s*s/.test(m[0])?{Version:"Current gen, digital"}:null}),
 MB(/\b(nintendo\s*)?switch(\s*(oled|lite|2))?\b/,"Nintendo",m=>/lite/.test(m[0])?"Handheld game console":"e5",{label:m=>"Switch"+(m[2]?" "+pretty(m[2]):"")}),
 /* The rest of the aisle, which the reader had never heard of at all.
    Order is deliberate where two patterns could both fire: Wii U before
    Wii, SNES before NES, Advance before Game Boy, DSi before DS. */
 MB(/\b(nintendo\s*)?wii\s*u\b|\bwiiu\b/,"Nintendo","e5a",{label:"Wii U"}),
 MB(/\b(nintendo\s*)?wii\b/,"Nintendo","e5b",{label:"Wii"}),
 MB(/\bsuper\s*(nintendo|nes)\b|\bsnes\b/,"Nintendo","e5c",{label:"Super Nintendo"}),
 MB(/\bn\s*-?\s*64\b|\bnintendo\s*64\b/,"Nintendo","e5c",{label:"Nintendo 64"}),
 MB(/\bgame\s*cube\b|\bgamecube\b|\bgcn\b/,"Nintendo","e5c",{label:"GameCube"}),
 MB(/\bnes\b|\bnintendo\s*entertainment\s*system\b/,"Nintendo","e5c",{label:"NES"}),
 MB(/\bdream\s*cast\b|\bdreamcast\b/,"Sega","e5c",{label:"Dreamcast"}),
 MB(/\bsega\s*saturn\b|\bsaturn\b/,"Sega","e5c",{label:"Saturn"}),
 MB(/\b(sega\s*)?(genesis|mega\s*drive)\b/,"Sega","e5c",{label:"Genesis"}),
 MB(/\bgame\s*boy\s*advance(\s*sp)?\b|\bgba(\s*sp)?\b/,"Nintendo","e5d",{label:"Game Boy Advance"}),
 MB(/\bgame\s*boy(\s*(color|colour|pocket))?\b|\bgameboy\b|\bdmg\b/,"Nintendo","e5d",{label:"Game Boy"}),
 MB(/\bdsi\b/,"Nintendo","e5d",{label:"DSi"}),
 MB(/\b(nintendo\s*)?ds\s*lite\b|\bndsl\b|\bnintendo\s*ds\b/,"Nintendo","e5d",{label:"Nintendo DS"}),
 MB(/\bpsp\b|\bplaystation\s*portable\b/,"Sony","e5d",{label:"PSP"}),
 MB(/\bgame\s*gear\b/,"Sega","e5d",{label:"Game Gear"}),
 MB(/\bneo\s*geo\b/,"SNK","e5c",{label:"Neo Geo AES"}),
 MB(/turbo\s*graf?x|\btg\s*-?16\b|\bpc\s*engine\b/,"NEC","e5c",{label:"TurboGrafx-16"}),
 MB(/\bcoleco\s*vision\b|\bcoleco\b/,"Coleco","e5c",{label:"ColecoVision"}),
 MB(/\bintellivision\b|\bintv\b/,"Mattel","e5c",{label:"Intellivision"}),
 MB(/\batari\s*(2600|7800|5200)?\b/,"Atari","e5c",{label:"Atari 2600"}),
 MB(/\bgame\s*boy\s*colou?r\b|\bgbc\b/,"Nintendo","e5d",{label:"Game Boy Color"}),
 MB(/\bnintendo\s*3ds\b|\b3ds\b/,"Nintendo","Handheld game console",{label:"Nintendo 3DS"}),
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
 {g:"Type",re:/\bcellular\b/,o:"Cellular"},{g:"Cocking",re:/\bcrank\b/,o:"Crank-cocking"},
 {g:"Title",re:/\bno\s*title\b/,o:"NO title"},{g:"Stroke",re:/\b2\s*-?\s*stroke\b/,o:"2-stroke"},
 {g:"Stage",re:/\btwo\s*-?\s*stage\b/,o:"Two-stage"},{g:"Mount",re:/\bbow\s*mount\b/,o:"Bow mount"},
 {g:"Pressure",re:/\b(3,?[2-9]\d{2}|[4-9],?\d{3})\s*psi\b/,o:"3,200 PSI +"},{g:"Pressure",re:/\b(1,?\d{3}|2,?[0-4]\d{2}|\d{3})\s*psi\b/,o:"Under 2,500 PSI"},
 {g:"Screen size",re:/\b(6[6-9]|[7-9]\d|100)\s*(in|inch|")/,o:"66 in +"},{g:"Screen size",re:/\b(5\d|6[0-5])\s*(in|inch|")/,o:"50–65 in"},
 {g:"Screen size",re:/\b(4[3-9])\s*(in|inch|")/,o:"43–49 in"},{g:"Screen size",re:/\b([12]\d|3\d|4[0-2])\s*(in|inch|")/,o:"Under 43 in"},
 /* WHAT THE COUNTER ALREADY TYPED. Picking a suggestion fills in the make
    and the model and then asked for things the same sentence had already
    said: "remington 870 express 12 gauge 28 inch" answered the gauge and
    still asked the barrel back; "stihl ms 271 20 inch bar" asked the bar
    length. Every group below existed with no rule pointing at it.
    Safe by construction: a rule only fires on a group that actually
    carries the option it names, so a shotgun's inches cannot answer a
    revolver's barrel question or a television's screen size. */
 {g:"Barrel",re:/\b(3\d|[4-9]\d)\s*(in|inch|")/,o:"Extra-long (30 in +)"},
 {g:"Barrel",re:/\b(2[4-8])\s*(in|inch|")/,o:"Field length (24\u201328 in)"},
 {g:"Barrel",re:/\b(1[89]|20)\s*(in|inch|")/,o:"Short / home-defense (18\u201320 in)"},
 {g:"Barrel",re:/\bsnub\b|\b2\s*(in|inch|")/,o:"Snub 2 in"},
 {g:"Barrel",re:/\b([7-9]|1\d)\s*(in|inch|")/,o:"7 in + hunter"},
 {g:"Barrel",re:/\b[3-6]\s*(in|inch|")/,o:"3\u20136 in"},
 {g:"Bar length",re:/\b(19|[2-9]\d)\s*(in|inch|")/,o:"19 in +"},
 {g:"Bar length",re:/\b(1[678])\s*(in|inch|")/,o:"16\u201318 in"},
 {g:"Bar length",re:/\b(\d|1[0-5])\s*(in|inch|")/,o:"Under 16 in"},
 {g:"Class",re:/\b(gaming|workstation|rgb)\b/,o:"Gaming / workstation"},
 {g:"Version",re:/\bdigital\b/,o:"Current gen, digital"},
 {g:"Version",re:/\bdisc\b/,o:"Current gen, disc"},
 /* A model year, turned into whichever age band this item happens to use.
    The bands differ - a phone ages faster than a tablet - so the label is
    read off the group rather than written down twice. */
 {g:"Age",re:/\b(19|20)\d{2}\b/,o:function(t,g){
   var m=String(t).match(/\b((?:19|20)\d{2})\b/); if(!m)return null;
   var yr=Number(m[1]), age=(new Date()).getFullYear()-yr;
   if(age<0||age>40)return null;
   var has=function(x){ return g.options.some(function(z){return z.t===x;})?x:null; };
   if(age<2)return has("Under 2 yr, flagship-class")||has("Under 3 yr");
   if(age<3)return has("2\u20133 yr")||has("Under 3 yr");
   if(age<5)return has("3\u20135 yr")||has("3\u20136 yr");
   if(age<6)return has("3\u20136 yr")||has("5 yr +");
   return has("5 yr +")||has("6 yr +");
 }}];
const DETAIL_RE=[/\b(10|12|16|20|28)\s*(ga|gauge|gage)\b/g,/(^|\s)\.410(\s*(ga|gauge|bore))?\b/g,/\b410\s*(ga|gauge|bore)\b/g,
 /\b\d{1,2}\s*mm\b/g,/\b(22\s*lr|22\s*mag|22\s*wmr|30\s*-?\s*06|45\s*-?\s*70|6\.5\s*(creedmoor|cm|prc)|300\s*(win\s*mag|blackout|blk|wsm|prc)|5\.56|7\.62\s*(x\s*39)?|9\s*x\s*19)\b/g,
 /(^|\s)\.(17|22|223|243|25|257|270|30|308|32|35|357|38|380|40|44|45|50)\b(\s*(lr|wmr|mag|magnum|special|spl|acp|auto|win|rem|colt))?/g,
 /\b\d{2}\s*v(olt)?s?\b/g,/\b\d+(\.\d+)?\s*kw\b/g,/\b\d{3,5}\s*(w|watts?)\b/g,/\b\d{1,3}\s*(in|inch)\b/g, /* one digit too: a revolver barrel is 2, 4 or 6 inches, and "4 inch" was being dropped before the spec matcher ever saw it *//\b\d+(\.\d+)?\s*hp\b/g,
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
  _omniDepth++;
  try{ return _omniParse(q); } finally { _omniDepth--; }
}
function _omniParse(q){
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
  let mh=modelHit(t,pre?pre.b.name:"");
  /* A MODEL PATTERN FROM A DIFFERENT MAKER IS A DIFFERENT PRODUCT.
     The model book is matched on the pattern, and plenty of patterns
     collide across makers. Typing a maker the desk knows and then being
     handed another maker's machine is not a near miss, it is the wrong
     aisle:

       "Stihl FS 56 / FS 91"      -> Yamaha FS, an ACOUSTIC GUITAR
       "Barnett Hyper Raptor"     -> Yamaha Raptor, an ATV
       "Neo Geo AES"              -> DJI Neo, a CAMERA DRONE
       "Echelon EX-3"             -> Springfield Echelon, a PISTOL
       "Brother CS7000X"          -> Echo CS, a CHAINSAW
       "Apple Watch Series 8 / 9" -> its own ref names nothing at all

     Six of the seven price-list rows the search could not reach at all,
     and every one of them put a confident wrong item at the top of the
     list. A string trimmer offering to be priced as a guitar is not a
     ranking problem, it is the desk answering a question nobody asked.
     The same rule already guards the price-list scoring a few lines down
     ("a row carrying a maker the counter did not type is a different
     product, so it is dropped rather than demoted"). It belongs here too,
     one step earlier, where the wrong maker gets in. */
  if(mh&&pre&&mh.m&&mh.m.brand&&!sameMaker(omniNorm(mh.m.brand),omniNorm(pre.b.name)))mh=null;
  /* AND A PART IS NOT THE MACHINE IT PLUGS INTO. "ps5 controller" hit the
     PlayStation 5 in the model book on the word ps5, and the word that said
     which PART of a PlayStation was on the counter was never read - so the
     desk offered to lend $100 against the $400-449 console row for a pad
     the book prices at $35-80. Reported straight off the counter screen.
     The rule is narrow on purpose: the query has to NAME the accessory, and
     the model book has to have landed on something that is not it. Then the
     hit is dropped and the price list answers for itself - it carries
     seventeen controller rows, a DualSense among them. */
  { const ACC=[[/\b(controllers?|gamepad|game\s*pad|joy\s*-?\s*cons?|joycons?)\b/,"Game controller"]];
    for(const [re,ref] of ACC){
      if(re.test(t)){
        const item=mh?(typeof mh.m.item==="function"?mh.m.item(mh.mm):mh.m.item):null;
        if(item!==ref){
          /* DROPPING THE CONSOLE IS NOT ENOUGH ON ITS OWN. With the model
             hit gone the keyword pass still scored "Game console - current
             gen" above "Game controller" - ps5 is in the console's synonym
             list and controller is one word against it - so the top row was
             the console again and the measured PS5 row came with it. The
             query named the part; the part leads. */
          /* AND ONLY DROP IT. The first attempt also promoted the
             generic "Game controller" entry to the top, which was worse
             than the bug: it led with a $30 shelf row, resolved no
             measured price at all, and quoted $1. Dropping the console is
             the whole fix - the price list carries seventeen controller
             rows with the spoken names on them now, and with the console
             out of the way the right one leads on its own. */
          mh=null;
        }
      }
    } }
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
  _omniDepth++;
  try{ return _omniRows(q); } finally { _omniDepth--; }
}
function _omniRows(q){
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
  { const bw=omniWords(P.brand||"");
    /* TYPING BOTH THE MAKER AND ITS LINE MUST NOT DEMAND BOTH IN THE NAME.
       "fender squier" read Squier as the make, took it out of the words,
       and then required "fender" to appear in the row name - so every
       "Squier Affinity Stratocaster" was dropped by the word its own maker
       is called. The same shape as the Xbox fault, one level down.
       When the query names a line AND its parent, the parent is redundant:
       the row is named after the line. */
    const qw=omniWords(q);
    const parentSaid=new Set();
    for(const w of qw){ const par=MP_FAMILY[w]; if(par&&qw.indexOf(par)>=0)parentSaid.add(par); }
    const mq=qw.filter(w=>!STOP.has(w)&&bw.indexOf(w)<0&&!parentSaid.has(w));
    /* The brand words come out so that "husqvarna 455" is matched on 455
       rather than made to carry the brand into every comparison. When the
       brand is ALL that was typed there is nothing left to search with, and
       this step used to be skipped - so typing the whole brand showed fewer
       models than typing half of it. With nothing left, search the brand. */
    /* When every word was a brand word, the search falls back to the brand.
       But the brand book's own label can be richer than the row name - the
       music shelf calls it "Fender Squier", while the rows are named
       "Squier Affinity Stratocaster". Requiring both words drops them all.
       So the fallback keeps the LINE and lets the parent go. */
    const bwKeys=bw.filter(w=>!parentSaid.has(w));
    const keys=mq.length?mq:(bwKeys.length?bwKeys:bw);
    if(keys.length){
      const r0=rows[0], strongId=r0&&r0.strong?((mpFor(r0.kind==="item"?r0.itemId:r0.name,[r0.brand,r0.model,r0.detail].join(" "))||[])[0]):null;
      /* These rows are measured prices for a NAMED tool, and the maker is
         most of what they are worth. Nothing here compared that maker to
         the one typed, so "milwaukee drill" put the DeWalt row on top with
         the Milwaukee row third - $65-110 offered for a tool the desk's
         own row prices at $150-220. "black & decker drill" was handed a
         DeWalt (+40%), and "john deere mower" a Honda, which is not even
         the same kind of machine.
         A row carrying a maker the counter did not type is a different
         product, so it is dropped rather than demoted - the plain catalog
         row underneath answers properly, and reads the typed make itself.
         Rows that name no maker are left alone; so is a query that names
         none. */
      const qb=omniNorm(P.brand||"");
      const rowBrand=r=>{ const e=findEntry(String(r[1]).split("|")[0]);
        const h=e?brandInText(e.catId,r[2]):null; return h?omniNorm(h.name):""; };
      /* THE ALIAS COLUMN WAS INVISIBLE TO THE SEARCH. r[9] carries the
         other names a row goes by, and mpAuto has always read it - but
         this scoring pass looked at the row's NAME alone, so the words a
         counter actually says could not reach the row. Nobody hands you a
         "Sony DualSense"; they hand you a PS5 controller. */
      MODEL_PRICES.map(r=>{ const nw=omniWords(r[2]).concat(omniWords(r[9]||"")); let s=0; for(const w of keys){ const h=wordHit(w,nw); if(!h)return null; s+=h; } if(omniNorm(r[2]).indexOf(omniNorm(q))>=0)s+=5;
          if(qb){ const rb=rowBrand(r);
            if(rb&&!sameMaker(rb,qb))return null;
            if(rb)s+=6; }
          return {r,s}; })
        .filter(Boolean).sort((a,b)=>b.s-a.s||a.r[2].length-b.r[2].length).slice(0,5)
        .forEach(({r})=>{ if(rows.length>=OMNI_MAX||r[0]===strongId)return; const e=findEntry(String(r[1]).split("|")[0]); if(!e)return;
          rows.push(Object.assign({},e,{kind:"mp",base:e.kind,mp:r,brand:"",model:"",detail:"",spec:{},cond:P.cond,complete:P.complete}));   strong=true; });
      /* THE EXACT ROW GOES ABOVE THE AISLE IT LIVES IN.
         A MODELBOOK hit is added first and marked strong, which is right
         when the words name a KIND of thing and wrong when they name a
         particular one. "xbox wireless controller" hits the Xbox entry in
         the model book, so "Game console - current gen" led the list and
         the measured controller row - $17-49 - sat underneath it. Take the
         top row and the desk offers to lend $45 on a $25 controller. Same
         shape on "ps5 controller", which reaches the console at $190.
         Swept all 507 rows through the search: 105 of them had the right
         answer sitting at number two, under the band they belong to.
         The test is the whole query, not a word of it: a price-list row
         whose name CONTAINS everything that was typed is a more exact
         answer than the aisle, every time, because the counter typed the
         thing's name. A row that merely shares words with the query is
         left where it was - "xbox" alone should still open the aisle. */
      /* AND THE CLOSEST OF THEM, NOT THE FIRST ONE FOUND. The first pass
         at this took whichever containing row came up first, so typing
         "iPhone 15" was answered with the iPhone 15 Pro - a row that also
         contains "iphone 15" and is a different phone at a different
         price. Exact name first, then the shortest row that contains
         everything typed, which is the least the counter can have meant. */
      const qn=omniNorm(q);
      if(qn.length>=4){
        let best=-1,bestKey=null;
        rows.forEach((r,i)=>{
          if(r.kind!=="mp"||!r.mp)return;
          const rn=omniNorm(r.mp[2]);
          if(rn.indexOf(qn)<0)return;
          const key=[rn===qn?0:1, rn.length];
          if(!bestKey||key[0]<bestKey[0]||(key[0]===bestKey[0]&&key[1]<bestKey[1])){ best=i; bestKey=key; }
        });
        if(best>0&&!(rows[0].kind==="mp"&&rows[0].mp&&omniNorm(rows[0].mp[2])===qn))
          rows.unshift(rows.splice(best,1)[0]);
        /* AND THE ONE ROW THAT IS NEVER IN THIS LIST IS THE EXACT MATCH.
           A row the strong item already resolves to is left out on purpose
           (strongId) so the list does not show the same answer twice - but
           that is the row that exactly names what was typed. So "iPhone 15"
           had the 15 Pro on top, "Nintendo Switch" had the Switch 2, and
           "PlayStation 4" had the PS4 Pro: a longer, dearer variant leading
           for a query that named the plain one. The strong item IS that
           answer, so it goes first. */
        if(strongId){
          const sr=MP_BY_ID&&MP_BY_ID[strongId];
          if(sr&&omniNorm(sr[2])===qn){
            const si=rows.findIndex(r=>r.strong);
            if(si>0)rows.unshift(rows.splice(si,1)[0]);
          }
        }
      }
    } }
  const inBrand=e=>P.brandCats.some(c=>c.cat===e.catId&&(!c.items||c.items.indexOf(e.kind==="item"?e.itemId:e.name)>=0));
  if(P.words.length){
    let sc=[];
    /* THE SAME UNIT AT TEN TIMES THE SIZE IS A DIFFERENT PRODUCT.
       "dewalt compressor dwfp55126 6 gal" put "Air compressor - 60 gal
       upright" above "Air compressor - pancake", and priced a $150 ticket
       at $280. Both rows score the same, because "gal" matches both
       exactly and the "6" matches neither: wordHit needs three characters
       before it will prefix-match, so a one-digit token can only hit an
       identical one. Nothing was wrong, nothing was preferred, and the
       tie fell to whichever row came first.
       A measurement the counter typed is one of the strongest things they
       can tell you, and a row carrying a DIFFERENT figure in the same unit
       is telling you it is the wrong product. So a magnitude that matches
       is worth as much as a word, and one that conflicts costs more than
       any word can win back. This reads the pair out of both strings
       rather than knowing anything about compressors, so it works the
       same on a 50 inch television, a 24 ft ladder and a 60 gal tank. */
    const UNITS=/(\d+(?:\.\d+)?)\s*(gal|gallon|in|inch|ft|foot|feet|cc|hp|amp|a|v|w|watt|lb|ton|qt|l)\b/g;
    const sizesOf=t=>{ const m={}; let x; const str=" "+String(t||"").toLowerCase()+" ";
      UNITS.lastIndex=0;
      while((x=UNITS.exec(str))){ const u=x[2].replace(/^(gallon|inch|foot|feet|watt)$/,
        v=>({gallon:"gal",inch:"in",foot:"ft",feet:"ft",watt:"w"}[v]));
        (m[u]=m[u]||new Set()).add(Number(x[1])); }
      return m; };
    const qSize=sizesOf(P.q||q);
    const sizeFit=e=>{
      if(!Object.keys(qSize).length)return 0;
      const es=sizesOf(e.name||"");
      let fit=0;
      for(const [u,want] of Object.entries(qSize)){
        const have=es[u]; if(!have||!have.size)continue;
        if([...want].some(v=>have.has(v)))fit+=4;          /* it says the same figure */
        else fit-=9;                                        /* it says a different one */
      }
      return fit;
    };
    const score=(e,and)=>{ let s=0; for(const w of P.words){ const h=wordHit(w,e.words); if(!h&&and)return 0; s+=h; } return s+sizeFit(e); };
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
      /* A word the parser already PLACED is not a word the entry has to
         carry. "samsung 55 inch tv" was built from the raw query, so 55
         and inch counted as unmatched, the TV row was called a miss and
         "not on the lists" went above it - on the commonest thing in the
         shop, and the make was dropped along with the row. The TV row is
         named "any size" and asks the screen size itself; the size is an
         answer to that question, not evidence of a different item. */
      const placed=omniWords(P.detail.join(" ")+" "+Object.values(P.spec||{}).join(" "));
      /* A MAKE THE SEARCH HAS NEVER HEARD OF WAS DEMOTING ITS OWN ROW.
         Measured on eighteen searches. The book row is FOUND every time -
         it is the ranking that goes wrong:

           blender          -> [book] Blender   first
           Vitamix blender  -> [own] Vitamix blender first, Blender second

         Typing the make in front pushed the row the make belongs to below
         "price what I typed", and the top row is the one a thumb takes. It
         then lands in a custom row, which has no category, which means the
         gun aisle - so "Vitamix blender" priced as a firearm at 50%.

         `bw` already excuses a word the parser placed as a brand, and that
         is why "Ninja air fryer" works and "Vitamix blender" does not:
         Ninja is in a BRANDBOOK, Vitamix is only in the blender row's own
         tiers, and you cannot be on the row until the search has put you
         there. Chicken and egg.

         So every make named anywhere in the tier tables counts as a make
         word here. It assigns no tier and picks no row - it only stops a
         maker's name from being counted as evidence of a different item.
         That can make a match stronger and never weaker, so nothing that
         ranks correctly today can start ranking worse. */
      const need=omniWords(q).filter(w=>!STOP.has(w)&&bw.indexOf(w)<0&&placed.indexOf(w)<0
                                        &&!knownMakeWord(w));
      const top=sc.slice().sort((a,b)=>b.s-a.s)[0].e;
      /* OR, NOT ASSIGN. This line used to overwrite `strong`, and `strong`
         had already been set true a few lines up by a measured price-list
         row matching the query - which is the strongest thing that can
         happen in this function. So typing "Beats Solo 3", a model the book
         carries at $34-55, recomputed strong from the loose keyword pass,
         got false, and put "not on the lists" at the top of the list with
         the measured row underneath it. Taking the top row then priced a
         pair of headphones as "Something else" at $15.
         Whatever this pass decides about ITS matches cannot unmake a row
         the book measured. */
      strong=strong||!!P.modelLabel||!need.length||need.every(w=>wordHit(w,top.words));
    }
    else OMNI_IDX.forEach(e=>{ const s=score(e,false); if(s)sc.push({e,s:s+(inBrand(e)?3:0)}); });
    sc.sort((a,b)=>b.s-a.s||a.e.name.length-b.e.name.length).forEach(x=>add(x.e));
  } else if(P.brandCats.length&&!P.modelItem){
    (BRAND_FIRST[P.brand.toLowerCase()]||[]).forEach(ref=>add(findEntry(ref)));
    const order={hi:0,mid:1,lo:2};
    const only=BRAND_ONLY[String(P.brand||"").toLowerCase()];
    P.brandCats.slice().sort((a,b)=>order[a.tier]-order[b.tier]).forEach(c=>{
      if(c.items)c.items.forEach(ref=>add(findEntry(ref)));
      else if(only)only.forEach(ref=>add(findEntry(ref)));
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
      /* A ROW THAT ACCOUNTS FOR EVERY WORD HE TYPED IS NOT A LOOSE MATCH.
         `strong` is worked out inside one of several passes, and the two
         searches that were still wrong - "Epson projector" and "Jet drill
         press" - are found by a different pass that never sets it. Rather
         than teach each pass the same lesson, the question is asked here,
         where `rows` is final and the only decision left is whether the
         matches or the typed words go on top.

         The question: is one of these rows carrying every word of the
         query that is not a stop word and not the name of a make? If so
         he did not type anything the row fails to explain, and "price
         what I typed" belongs underneath it rather than above.

         Epson is an alias on the printer row, so Printer outscored
         Projector and the single-top-scorer test asked the wrong row.
         This asks all of them. */
      const left=omniWords(t).filter(w=>!STOP.has(w)&&!knownMakeWord(w));
      const explained=left.length>0&&rows.some(r=>
        (r.kind==="book"||r.kind==="item"||r.kind==="mp")&&(()=>{
          const e=findEntry(r.kind==="item"?r.itemId:r.name);
          const w=(e&&e.words)||omniWords(String(r.name||""));
          return left.every(x=>wordHit(x,w));
        })());
      const lead=strong||explained;
      rows.splice(lead?(before<0?rows.length:before):0,0,own);
    } }
  return {P,rows};
}

function isTouch(){ try{ return matchMedia("(pointer:coarse)").matches; }catch(e){ return false; } }
function omniHintHTML(){
  /* The box holds what was chosen now, so this stopped saying it twice. */
  if(st.omniDone)return `Follow <b>Next step</b> below. Type here again to price something else.`;
  /* The desk lists the same four examples as buttons directly underneath
     now, so naming them here printed them twice - once as something to
     press and once as something to copy out by hand. The phone has no
     buttons, so it keeps the words. */
  if(!window.PHONE)return isTouch()?"":`Just start typing &mdash; the box takes focus on its own.`;
  return `Try <b>${esc(START_TRY[0])}</b>, <b>${esc(START_TRY[1])}</b>, <b>${esc(START_TRY[4])}</b> or <b>${esc(START_TRY[5])}</b>.`;
}
const SEARCH_SVG=`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="var(--accent-ink)" stroke-width="2.6"/><path d="M15.5 15.5L21 21" stroke="var(--accent-ink)" stroke-width="2.6" stroke-linecap="round"/></svg>`;
function omniHTML(){
  /* WITH A RUN LIVE, THE X IS NOT "CLEAR THE TEXT" - IT IS THE WAY OUT.
     "how do i back out back to the beginning?", asked looking at the
     Which-of-these card. The X above the question already calls startOver,
     and it was invisible: the CSS hides it on :placeholder-shown, and he
     had tapped a category tile without typing anything, so the box was
     empty and the one control that does what he wanted was not drawn.
     Worse on the desk than it sounds, because the desk rail carries no
     Start over button at all - pinHTML hands off to railHTML at desk
     width, and only the narrow strip has one. Mid-run there was nothing on
     that screen that went back.
     So: something picked, the X shows whether or not anything is typed. */
  const live=!!(st.picked||st.needItem);
  return `<div class="omni${live?" omniLive":""}" id="omni"><div class="omniWrap">
    <div class="omniBox">${SEARCH_SVG}<input id="omniIn" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
      placeholder="What's on the counter? Type a brand, model or item" value="${esc(st.omniQ||"")}" aria-label="Search items" aria-controls="omniList" aria-expanded="false"><button class="omniClr" id="omniClr" type="button" aria-label="${live?"Start over \u2014 clear this item and go back to the beginning":"Clear the search"}" title="${live?"Start over":"Clear the search"}">&times;</button></div>
    <div class="omniList" id="omniList" role="listbox" hidden></div></div>
    <div class="omniHint" id="omniHint">${omniHintHTML()}</div></div>`;
}
let omniRowsCache=[];
function omniRowHTML(r,i){
  const hl=i===st.omniHl?" hl":"";
  if(r.kind==="own")return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">Price &ldquo;${esc(r.q)}&rdquo;</span><span class="on2">not on the lists &mdash; pick what kind of thing it is, then what it sells for</span></span><span class="ov">&rsaquo;</span></button>`;
  if(r.kind==="mp")return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">${esc(r.mp[2])}</span><span class="on2">${esc(r.name)} &middot; ${esc(mpSaid(r.mp))}</span></span><span class="ov">${money(r.mp[3])}&ndash;${money(r.mp[4])}<small>resale</small></span></button>`;
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
  /* The column always says something. A price means the desk has a
     researched figure for this one; "you set it" means it knows the KIND
     of thing and the number comes out of the run. Leaving the slot empty
     on the second sort made the difference an absence, and an absence is
     not something you can scan a list for. */
  const val=mp
    ? `<span class="ov">${money(mp[3])}&ndash;${money(mp[4])}<small>resale</small></span>`
    : `<span class="ov none">&mdash;<small>you set it</small></span>`;
  return `<button type="button" class="omniRow${hl}" data-omni="${i}" role="option"><span class="ot"><span class="on1">${esc(head)}</span><span class="on2">${bits.map(b=>b.indexOf("&mdash;")>=0?b:esc(b)).join(" &middot; ")}</span></span>${val}</button>`;
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
/* WHAT THE RECORD KNOWS ABOUT THE PRODUCT, AS OPPOSED TO ITS PRICE.
   Reported from the counter, on a Husqvarna 450 the book knows by name:
   "Shouldn't the tool already know the answer to this question? If we're
   going to have a database the database needs to cover not just bits and
   pieces of the item, it needs to be a complete record for the item for
   every question that we're going to ask."

   Right, and the book was never a product record. A row is nine fields -
   id, ref, name, low, high, confidence, date, source, note - and every one
   of them is about the PRICE or where the price came from. Nothing in it
   describes the thing. So the desk can know it is looking at a Husqvarna
   450 / 445, quote $210-290 for it, and still ask what grade of saw it is.
   A 450 Rancher is a farm saw. That is not a fact about the one on the
   counter, it is a fact about every 450 Rancher ever made.

   The machinery to use such facts already existed and was half-wired:
   applySpecPicks() takes a label -> answer map, and SPEC_AUTO reads 39
   patterns out of whatever was typed. But SPEC_AUTO only fires when the
   text carries the clue - "18 in bar" does, "450 Rancher" does not - and
   Grade has no rules at all. What was missing is the data.

   This is that data, keyed by the price row it belongs to. It is
   deliberately small: these are models I can state a grade and a bar
   length for without guessing, and a wrong fact here is worse than a
   question, because a question gets answered by somebody holding the saw.
   The other ~490 rows have none of this yet. */
const MODEL_SPEC={
  "b1":{"Caliber":"9mm","Size":"Full / compact"},
  "b10":{"Caliber":"9mm","Size":"Full / compact"},
  "b11":{"Size":"Full / compact"},
  "b12":{"Caliber":".380 ACP"},
  "b13":{"Caliber":"9mm","Size":"Full / compact"},
  "b14":{"Size":"Full / compact"},
  "b15":{"Caliber":"9mm","Size":"Full / compact"},
  "b16":{"Caliber":"9mm","Size":"Full / compact"},
  "b17":{"Caliber":".380 ACP","Size":"Pocket (.25/.380 junk-class)"},
  "b18":{"Caliber":"9mm","Size":"Full / compact"},
  "b19":{"Caliber":".22 LR","Size":"Full / compact"},
  "b2":{"Caliber":"9mm","Size":"Full / compact"},
  "b20":{"Caliber":"9mm","Size":"Full / compact"},
  "b21a":{"Caliber":"9mm","Size":"Full / compact"},
  "b21b":{"Caliber":"9mm","Size":"Full / compact"},
  "b22":{"Caliber":"9mm","Size":"Full / compact"},
  "b23":{"Size":"Full / compact"},
  "b24":{"Caliber":"9mm","Size":"Full / compact"},
  "b25":{"Caliber":"9mm","Size":"Full / compact"},
  "b3":{"Caliber":"9mm","Size":"Full / compact"},
  "b4":{"Caliber":"9mm","Size":"Full / compact"},
  "b5":{"Caliber":"9mm","Size":"Full / compact"},
  "b6":{"Caliber":".40 S&W","Size":"Full / compact"},
  "b7":{"Caliber":"9mm","Size":"Full / compact"},
  "b8":{"Size":"Full / compact"},
  "b9a":{"Size":"Full / compact"},
  "b9b":{"Size":"Full / compact"},
  "c1":{"Bar length":"16–18 in","Grade":"Homeowner"},
  "c12":{"Grade":"Homeowner"},
  "c13":{"Grade":"Farm / ranch"},
  "c16":{"Grade":"Pro / commercial"},
  "c19":{"Grade":"Homeowner"},
  "c26":{"Battery platform":"18 / 20V"},
  "c27":{"Battery platform":"18 / 20V"},
  "c28":{"Battery platform":"18 / 20V"},
  "c29":{"Battery platform":"18 / 20V"},
  "c3":{"Bar length":"19 in +","Grade":"Farm / ranch"},
  "c30":{"Battery platform":"18 / 20V"},
  "c31":{"Battery platform":"18 / 20V"},
  "c32":{"Battery platform":"18 / 20V"},
  "c6":{"Bar length":"19 in +","Grade":"Pro / commercial"},
  "c7":{"Bar length":"16–18 in","Grade":"Farm / ranch"},
  "d8":{"Class":"GPS / spot-lock"},
  "d9":{"Class":"Basic 12V"},
  "e14":{"Version":"Current gen, digital"},
  "e17":{"Version":"Current gen, digital"},
  "e24":{"Class":"Standard"},
  "e25":{"Class":"Standard"},
  "h148":{"Version":"Previous gen"},
  "h161":{"Version":"Current gen, digital"},
  "h226":{"Size":"Standard portable"},
  "h228":{"Size":"Standard portable"},
  "h230":{"Size":"Standard portable"},
  "h232":{"Size":"Standard portable"},
  "h234":{"Size":"Party-size"},
  "h236":{"Size":"Standard portable"},
  "h238":{"Size":"Standard portable"},
  "h240":{"Size":"Standard portable"},
  "h242":{"Size":"Party-size"},
  "h244":{"Size":"Standard portable"},
  "h246":{"Size":"Party-size"},
  "h248":{"Size":"Party-size"},
  "h250":{"Size":"Standard portable"},
  "h252":{"Size":"Standard portable"},
  "h254":{"Size":"Standard portable"},
  "h256":{"Size":"Standard portable"},
  "h258":{"Size":"Standard portable"},
  "h260":{"Size":"Party-size"},
  "h262":{"Size":"Standard portable"},
  "h264":{"Size":"Standard portable"},
  "h303":{"Class":"Standard"},
  "h305":{"Class":"Standard"},
  "h307":{"Class":"Standard"},
  "h309":{"Class":"Gaming / workstation"},
  "h311":{"Class":"Gaming / workstation"},
  "h313":{"Class":"Standard"},
  "h315":{"Class":"Standard"},
  "h317":{"Class":"Standard"},
  "h335":{"Class":"Standard"},
  "h341":{"Class":"Standard"},
  "h344":{"Movement":"Automatic / mechanical"},
  "h346":{"Movement":"Automatic / mechanical"},
  "h348":{"Movement":"Automatic / mechanical"},
  "h350":{"Movement":"Automatic / mechanical"},
  "h352":{"Movement":"Automatic / mechanical"},
  "h356":{"Movement":"Automatic / mechanical"},
  "h358":{"Movement":"Automatic / mechanical"},
  "h366":{"Setup":"110V, gas-ready MIG"},
  "h377":{"Class":"Standard"},
  "h387":{"Class":"Standard"},
  "h395":{"Class":"Standard"},
  "h4":{"Version":"Current gen, disc"},
  "h401":{"Class":"Standard"},
  "h410":{"Movement":"Automatic"},
  "h412":{"Movement":"Automatic"},
  "h414":{"Movement":"Automatic"},
  "h416":{"Movement":"Quartz"},
  "h418":{"Movement":"Quartz"},
  "h426":{"Movement":"Automatic"},
  "h428":{"Movement":"Quartz"},
  "h430":{"Movement":"Quartz"},
  "h432":{"Movement":"Quartz"},
  "h434":{"Movement":"Quartz"},
  "h436":{"Movement":"Quartz"},
  "h438":{"Movement":"Quartz"},
  "h440":{"Movement":"Quartz"},
  "h442":{"Movement":"Quartz"},
  "h634":{"Type":"Standard 3-9x class"},
  "h636":{"Type":"High-mag 4-16x+"},
  "h638":{"Type":"High-mag 4-16x+"},
  "h640":{"Type":"High-mag 4-16x+"},
  "h642":{"Type":"Standard 3-9x class"},
  "h645":{"Type":"Standard 3-9x class"},
  "h647":{"Type":"Standard 3-9x class"},
};
/* The facts the record supplied, so the run can decline to ask them and the
   answer card can show where they came from. Cleared with the draft. */
let specFromRecord={};
function applyRecordSpec(rowId){
  specFromRecord={};
  const rec=MODEL_SPEC[rowId]; if(!rec)return;
  const groups=SPEC_CHOICES[st.itemId]||[];
  groups.forEach((g,gi)=>{
    const want=rec[g.label]; if(!want)return;
    const oi=g.options.findIndex(o=>o.t===want);
    /* a label or an option that has been renamed since must not silently
       set the wrong answer - it just goes back to being asked */
    if(oi<0)return;
    if(st.specSel[st.itemId+":"+gi]==null){
      st.specSel[st.itemId+":"+gi]=oi;
      specFromRecord[st.itemId+":"+gi]=g.label+": "+want;
    }
  });
}
function applySpecPicks(spec,text){
  const groups=SPEC_CHOICES[st.itemId]; if(!groups)return;
  const t=" "+omniNorm(text)+" ";
  groups.forEach((g,gi)=>{
    let want=spec&&spec[g.label];
    if(want&&!g.options.some(o=>o.t===want))want=null;
    if(!want)for(const r of SPEC_AUTO){
      if(r.g!==g.label||!r.re.test(t))continue;
      /* A year is not a fixed answer - 2023 means a different band every
         January - so an entry may compute its label from what was typed. */
      const o=(typeof r.o==="function")?r.o(t,g):r.o;
      if(o&&g.options.some(z=>z.t===o)){want=o;break;}
    }
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
  st.picked=false; st.bookName=""; st.brandTyped="";st.brandQ=""; st.model=""; st.detail="";
  st.brand="mid"; st.brandSet=false; st.liq=null; st.market=null; st.mpPin=null; st.mpNone=false;
  st.cond="good"; st.condSet=false; st.complete=true;st.completeSet=false;clearDeal();st.askEdit=false; st.specSel={}; st.editing=false;
  /* needItem was added with the "Which of these is it?" card and never
     added here, so Start over left the desk in a half-state: picked false,
     needItem still true. The home screen is gated on !picked && !needItem
     and the ask flow on picked || needItem, so BOTH were false at once -
     no start page, and a run still running. That is what "how do i back
     out back to the beginning?" was looking at. */
  st.ask=0; st.askKey=""; st.needKind=false; st.needItem=false;
  st.photoRead=null; st.compRead=null;
  st.fakeAns={}; st.fakeKey=""; st.stepAt=0; st.openS3=st.openS4=st.openS5=false;
  /* A held quote belongs to the customer it was struck for. */
  st.spotHold=null;
  photoFile=null; findMsg="";
  render();
  const o=document.getElementById("omniIn"); if(o)o.focus();
}
/* PICKING SOMETHING ENDS THE TYPING.
   Reported from the counter: "when I'm typing in the top text box then
   select something from the drop down or hit enter, it should no longer
   let me type in that text box - it should complete the typing unless I
   click back into it."
   The box gives up the focus here, and the list closes with it. That half
   is easy. The half that actually mattered is below, on the document-wide
   "start typing anywhere" handler - letting go of the focus achieves
   nothing while the next keystroke hands it straight back, which is why
   the state looked right and the keyboard still did the wrong thing.
   I had a guard in render() here too, on the theory that its focus-restore
   would undo this. It would not: this blur runs BEFORE that render, so the
   restore sees an unfocused box and does nothing. Taking the fix out one
   piece at a time is what showed it was dead, and dead code with a comment
   claiming it matters is worse than none. Clicking back into the box works
   exactly as before. */
/* What is left of the typed words once the matched row's own name is taken
   out of them. "Weber kettle grill" against "Charcoal grill / kettle"
   leaves "Weber". Used only as a fallback, and only to fill in a make
   nobody else supplied - it never overrides a make the row itself carries,
   and it never sets brandSet, because an unrecognised make still prices at
   the standard tier and the screen has to keep saying so. */
function leftoverMake(q,rowName){
  const stop=new Set(["the","a","an","and","with","for","in","of","my","used","new","old"]);
  const words=w=>String(w||"").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const had=new Set(words(rowName));
  const left=words(q).filter(w=>!had.has(w)&&!stop.has(w)&&w.length>2&&!/^\d+$/.test(w));
  if(!left.length)return "";
  /* One or two words at most: a make, not a sentence. */
  return left.slice(0,2).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
}
function omniPick(r){
  if(!r||r.kind==="sold")return;
  /* WHAT HE TYPED, BEFORE THIS FUNCTION REPLACES IT. omniPick puts the
     chosen row's name into the box - "leave the chosen thing in the box" -
     so by the time the brand fallback runs, st.omniQ says "Charcoal grill
     / kettle" and the word Weber is gone. Held here, where it still
     exists. */
  const typedQ=String(st.omniQ||"");
  { const i=document.getElementById("omniIn"), l=document.getElementById("omniList");
    if(i){ try{ i.blur(); }catch(e){} i.setAttribute("aria-expanded","false"); }
    if(l)l.hidden=true; }
  if(r.kind==="own"){
    /* Before anything else: if the words name a make the desk knows, and
       only one aisle carries it, that is the aisle. */
    const g=guessCat(r.q);
    if(g)st.catId=g;
    st.omniQ=r.q; st.omniHl=0; st.mode="item";
    /* Before settling for a custom row, see whether the make names the
       thing: a Tactacam is a trail camera, a Mathews is a compound bow, a
       Minn Kota is a trolling motor. Landing on the real item brings its
       own brand tiers, its own detail hint and the book rows filed under
       it - all of which a custom row has none of. */
    const kindFromMake=g?itemFromBrand(g,r.q):null;
    st.itemId=kindFromMake||custId(st.catId);
    st.bookName=kindFromMake?"":r.q;
    st.mpNone=!kindFromMake; st.worthNone=false;
    const bh=g?brandFromName(g,r.q):null;
    st.brandTyped=bh?bh.name:""; st.brandQ=st.brandTyped; st.brand=bh?bh.tier:"mid"; st.brandSet=!!bh;
    st.model=""; st.detail=""; st.liq=null; st.market=null;
    /* The lookup's last word belongs to the item it was about. Left set, the
       rail told the counter about listings on file for the thing before. */
    findMsg="";
    st.mpPin=null; st.condSet=false; st.phKindsOpen=true; st.omniDone=r.q;
    /* A guess that came off a make the desk actually carries is not a
       silent one - the aisle shows in the breadcrumb and the make step
       shows the maker it was read from, which is the evidence for it. Only
       when the words say nothing does the run stop and ask. */
    st.needKind=!g;
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
  /* Same rule one path over: when the matched row carries no make of its
     own, read one out of what was actually typed before settling for the
     standard tier. */
  /* THE COMMENT ABOVE WAS RIGHT AND THE LINE DID NOT DO IT.
     "read one out of what was actually typed" - but it only ever read
     r.brand, which a price-book row does not carry. So "Weber kettle
     grill" matched the book row "Charcoal grill / kettle", lost the word
     Weber, and the field screen then asked whether the thing in the
     driveway was a Speed Queen, a Frigidaire or a Sub-Zero. That row is
     filed under Appliances, so it inherits washing-machine brand tiers,
     and no tier list in this app fits a charcoal grill.
     Re-filing the row does not fix it - tool brands are no better for a
     Weber. Keeping the make he actually typed does. */
  st.brandTyped=r.brand||leftoverMake(typedQ,r.name||"")||"";
  st.brandSet=false;
  let hit=st.brandTyped?brandLookup(st.catId,st.brandTyped):null;
  if(!hit){
    const fromWords=brandFromName(st.catId,String(r.q||st.omniQ||r.name||""));
    if(fromWords){ hit=fromWords; st.brandTyped=fromWords.name; st.brandSet=true; }
  }
  st.brand=hit?hit.tier:"mid";
  st.model=r.model||""; st.detail=r.detail||"";
  st.complete=r.complete!==false; st.completeSet=true;
  if(r.cond)st.cond=r.cond;
  st.specSel={}; applySpecPicks(r.spec,st.detail+" "+st.model);
  st.editing=(r.kind==="custom");
  st.photoRead=null; st.compRead=null; st.market=null; st.mpPin=null; st.mpNone=false; st.worthNone=false; st.condSet=!!r.cond; if(!r.cond)st.cond="good";
  findMsg="";   /* the last lookup's word belonged to the last item */
  /* Leave the chosen thing in the box. Emptying it and saying underneath what
     was filled in meant reading a sentence to learn what the box could have
     just shown. Clicking it selects the lot, so typing still replaces. */
  st.omniQ=[r.brand||"",r.model||"",r.name||""].map(t=>String(t).trim()).filter(Boolean).join(" ").slice(0,80);
  st.omniDone=[r.brand,r.model,r.name].filter(Boolean).join(" ");
  /* LAND ON THE FIRST THING IT DOES NOT KNOW.
     Picking "dewalt dcd791 drill" out of the box opened on "1 of 7 - What
     make is it?" with DeWalt already read off the name, and a wheelbarrow
     opened on a make question it does not even ask for. The strip beside
     it said what was actually outstanding while the run marched from the
     top through everything it had already worked out.
     The answered ones are still there - the dots reach them, Back reaches
     them, a make read off a name can still be overruled - they are just
     not where the run starts. */
  st.askAt=firstOpenAsk(calcItem()); st.askFrom=null;
  render();
  try{ autoPriceOnPick(); }catch(e){}
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
  /* THE KEYBOARD TAKES HALF THE PHONE AND THE HERO TAKES THE OTHER HALF.
     "when I start to type in something, especially on my phone, the big
     blue middle price icon stays at the top and then the keyboard comes in
     from the bottom, making it extremely difficult to see any of the
     populated lists in the middle." Measured on his screen: the hero is
     about 700px of a 2000px phone, the keyboard takes the bottom 850, and
     what is left for the thing he is actually reading - the list of
     matches - is one row and a sliver of the next.

     A CLASS, NOT A RE-RENDER. The obvious fix is to drop the hero from the
     markup while the box has focus, and it is the wrong one: render()
     rebuilds the input, the input loses focus, the keyboard closes, and
     the counter is typing into a box that keeps shutting. So nothing is
     rebuilt. A class goes on <body>, CSS folds the hero away, and the
     element the finger is in is never touched. */
  const searching=on=>{ try{ document.body.classList.toggle("searching",!!on); }catch(e){} };
  inp.onfocus=()=>{ if(st.omniDone||!st.omniQ)inp.select(); searching(true); omniShow(); };
  inp.onblur=()=>setTimeout(()=>{ const l=document.getElementById("omniList"), i2=document.getElementById("omniIn");
    if(l&&document.activeElement!==i2){ l.hidden=true; if(i2)i2.setAttribute("aria-expanded","false"); }
    if(document.activeElement!==i2)searching(false); },150);
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
/* on a computer: start typing anywhere on the START page and it lands in
   the search bar.
   ONLY the start page. It used to be the whole item page, and that is the
   real reason the box went on taking letters after a pick: releasing the
   focus was not enough, because the next keystroke handed it straight
   back. Reported from the counter - "it should no longer let me type in
   that text box, it should complete the typing unless I click back into
   it" - and the feature only ever made sense on an empty screen, where
   the box is the single thing to do. With something on the counter the
   counter is answering questions, and a stray letter belongs nowhere near
   the search. The screen already says so: "Type here again to price
   something else."
   "/" still works either way, because that is a deliberate reach for the
   search rather than an accident. */
document.addEventListener("keydown",e=>{
  if(st.mode!=="item"||e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;
  const a=document.activeElement;
  if(a&&(a.tagName==="INPUT"||a.tagName==="TEXTAREA"||a.tagName==="SELECT"||a.isContentEditable))return;
  if(document.getElementById("camModal"))return;
  const inp=document.getElementById("omniIn"); if(!inp)return;
  if(e.key==="/"){ e.preventDefault(); inp.focus(); return; }
  if(st.picked)return;
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
/* The byte budget above was set for a phone on a cell signal at a yard sale,
   and it was the right call there. On the desk it was throttling the tool by
   forty times: the service accepts an 8MB body, and the page was shrinking
   every photograph to fit 200KB - which on a busy shot means stepping the
   ladder down to about 1500px. Claude can see 2576, so half the detail in a
   model plate was being thrown away before it was ever sent.

   So the budget forks. A real desk - no touch screen, not the phone page -
   gets 1.5MB, which at 2576px lands on the first rung of the ladder and
   sends the picture at full size. Everything else keeps the tight budget,
   because a tablet in the yard is still a tablet in the yard.

   The cap comes down from 2600 to 2576 on both. Nothing is lost: the far end
   discards anything past 2576 anyway, and the extra 24px were paid for in
   upload time and then thrown away. */
const IMG_MAX_EDGE=2576;
function imgDesk(){ try{ return !window.PHONE && !isTouch(); }catch(e){ return false; } }
function imgMaxBytes(){ return imgDesk()?1.5e6:200e3; }
async function normImage(f){
  const IMG_MAX_BYTES=imgMaxBytes();
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
"- bids: the number of bids, as a plain number, when the row shows one (\"1 bid\", \"12 bids\"). Use 0 for a fixed-price listing that shows no bid count. A one-bid auction sold at whatever the seller opened at, which is worth knowing and is not the same as a price the market argued over.",
"- condition: \"new\", \"used\", \"parts\" (parts, not working, for repair), or \"\" when not shown",
"- ranFor: the listing's run length EXACTLY as the page prints it, e.g. \"3.2 minutes\", \"1.3 days\", \"7 hours\", \"30 days\". WatchCount prints this as \"Ran for ...\" beside the listing. Empty string when the page does not show it. Do not work it out from the start and end dates; copy what is written.",
"- match: \"same\" when it is the same kind of item as the one being priced (and the same maker and model, when those are given); \"close\" when it is the same kind of item in a different version that is still fair to compare; \"different\" when it is something else: parts only, broken, a lot of several, an accessory, a box or manual, a toy, or another product",
"  SIZE IS NOT A SMALL DIFFERENCE. When the title states a size, capacity, length or count \u2014 screen inches, storage GB or TB, horsepower, barrel length, carat, tonnage, battery amp-hours \u2014 and it is not the size being priced, that is \"different\", not \"close\". A 98-inch television cannot price a 55-inch one.",
"- why: for close or different, 2 to 5 words saying why (\"lot of 3\", \"different model\", \"bare tool, no battery\"). Empty for same.",
"",
"Only listings that actually SOLD. eBay marks them \"Sold\" with a date; GunBroker completed auctions show a winning bid. If the pictures show items still FOR SALE, set soldOnly to false and return no listings. Never invent a listing or a price you cannot read. Do not estimate a value; the page does the math.",
"",
"Reply with ONLY this JSON:",
'{"site":"WatchCount","soldOnly":true,"listings":[{"title":"","price":0,"offerHidden":false,"condition":"used","ranFor":"","bids":0,"match":"same","why":""}],"note":"one short sentence on anything that limits the read"}'
  ].join("\n");
}
function pct(a,q){ if(a.length===1)return a[0]; const i=(a.length-1)*q, lo=Math.floor(i), hi=Math.ceil(i); return a[lo]+(a[hi]-a[lo])*(i-lo); }
/* A LISTING THAT OPENED AND CLOSED INSIDE THE QUARTER HOUR DID NOT FIND A
   BUYER AT THAT PRICE. Reported twice from the counter, the second time
   with the page still on his screen: "still seeing this 10000 dollar
   listing" - a 55-inch TCL Roku at $10,000, New, Fixed Price, 0 available,
   Sold: 1, and on the same row, in WatchCount's own words, "Ran for 3.2
   minutes". Start 26-Jul-26, end 26-Jul-26.

   That is a mis-keyed price taken down, a cancelled order, or a relist
   artifact. It is not a sale anybody made, and WatchCount reports it as
   Sold like every other row because it has no way to tell the difference.

   The first attempt at this was a sentence on the card telling him to skip
   such rows by eye. He came back with the listing still on his screen, and
   he was right to: a tool that asks the counter to do the filtering is a
   checklist, not a tool. So the run length is now read off the page and
   the arithmetic is done here.

   IT IS A SMELL, NOT A VERDICT, so the row is not deleted quietly. It goes
   in the "Left out" list by name and price with its reason, where he can
   see what was thrown away and argue with it.

   FIFTEEN MINUTES is the line. A real fixed-price sale inside a quarter
   hour of listing happens, but rarely, and the cost of dropping one is one
   comp out of a list; the cost of keeping a $10,000 TCL is the median on a
   screen that decides what leaves the till. Anything without a run length
   on the page is kept - no figure is not a short figure. */
const SHORT_RUN_MIN=15;
function runMinutes(v){
  const t=String(v==null?"":v).toLowerCase().trim();
  if(!t)return null;
  const m=t.match(/(\d+(?:\.\d+)?)\s*(second|sec|minute|min|hour|hr|day|week|month)/);
  if(!m)return null;
  const n=Number(m[1]); if(!(n>=0))return null;
  const u=m[2];
  const per={second:1/60,sec:1/60,minute:1,min:1,hour:60,hr:60,day:1440,week:10080,month:43200}[u];
  return per?n*per:null;
}
function crunchComps(res){
  const L=Array.isArray(res&&res.listings)?res.listings:[], seen=new Set(), kept=[], out=[];
  L.forEach(l=>{
    if(!l||typeof l!=="object")return;
    const title=String(l.title||"").replace(/\s+/g," ").trim().slice(0,90);
    const price=Math.round(Number(String(l.price==null?"":l.price).replace(/[^0-9.]/g,""))||0);
    const k=title.toLowerCase()+"|"+price; if(seen.has(k))return; seen.add(k);
    const match=String(l.match||"").toLowerCase(), cond=String(l.condition||"").toLowerCase();
    const ran=runMinutes(l.ranFor);
    let why="";
    if(!(price>0))why="no price shown";
    else if(ran!=null&&ran<SHORT_RUN_MIN)why="listed for minutes, not a real sale";
    else if(match==="different")why=String(l.why||"not the same item").slice(0,40);
    else if(l.offerHidden===true)why="Best Offer, real price hidden";
    else if(cond==="parts")why="parts / not working";
    if(why){ out.push({title,price,why}); return; }
    /* A ONE-BID AUCTION IS A REAL SALE AND A WEAK ONE. Somebody paid, so
       it does not get thrown out - but nobody argued over it, so it closed
       at whatever the seller opened at. That is the floor of the market,
       not the middle, and the counter should see which rows are like that
       in the list underneath. It changes no arithmetic: one row cannot
       move a median, and silently dropping real sales to flatter the
       figure is the opposite of what this card is for. */
    const bids=Math.round(Number(l.bids)||0);
    const weak=bids===1?"1 bid \u2014 opened there and nobody argued":"";
    kept.push({title,price,cond,
      why:match==="close"?String(l.why||"close match").slice(0,40):weak});
  });
  let pool=kept;
  const used=kept.filter(k=>k.cond!=="new");
  if(used.length>=3&&used.length<kept.length){ kept.filter(k=>k.cond==="new").forEach(k=>out.push({title:k.title,price:k.price,why:"new in box"})); pool=used; }
  let p=pool.map(k=>k.price).sort((a,b)=>a-b);
  if(p.length>=5){
    /* Throwing out the absurd used the spread alone - 1.5 times the middle
       half, the textbook rule. It collapses. When most of a list sits on one
       round number the spread is ZERO, the fence closes to that single point,
       and every other sale is called absurd: 20 sold at $200 with a $240 and
       a $300 among them reported "$200 to $200 from 20 sales" and threw the
       $240 out as way above the rest. False confidence, and it hid the one
       useful thing in the list.
       So the fence is the WIDER of two rules, and a sale has to be absurd by
       BOTH to go: the spread rule, and a flat third-to-triple of the middle.
       The second cannot collapse, because the middle is never zero. */
    const q1=pct(p,.25),q3=pct(p,.75),iqr=q3-q1,med=pct(p,.5);
    const lo=Math.min(q1-1.5*iqr,med/3),hi=Math.max(q3+1.5*iqr,med*3);
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
/* TWO INPUTS, TWO BUTTONS, AND capture IS BACK WHERE IT BELONGS.
   The first version of this carried capture="environment" on the only
   input, which tells the phone "camera only" and hides the gallery:
   "Need to be able to submit previously taken pictures." I took it off,
   expecting the OS sheet - Camera, Gallery, Files - and the counter
   reported the opposite fault: "now when I hit the sap it button, I only
   get the gallery and no option for the camera." Android's newer photo
   picker answers accept="image/*" with no capture by going straight to the
   gallery and never offering the lens.
   Both attempts were the same mistake: one control, and a guess about
   which picker the phone would decide to show. It is two controls now -
   #photoCam keeps capture and really opens the camera, #photoIn has none
   and really opens the gallery - so the label on each is what happens,
   whatever the device thinks. */
  const gallery=`<label class="ghostBtn camBtn" style="cursor:pointer;margin:0;padding:${lead?"18px 20px":"10px 16px"};display:inline-flex;align-items:center">Choose a picture<input id="photoIn" type="file" accept="image/jpeg,image/png,image/webp" style="display:none"></label>`;
  if(isTouch()){
    /* THE LIVE CAMERA FIRST, the file input only when there is not one.
       Every previous version of this button went through a picker the
       device controls, and the device kept choosing the gallery. */
    const shoot=camLiveOK()
      ? `<button id="camLive" class="brassBtn camBtn${lead?" camBtnLead":""}" style="margin:0;padding:${lead?"18px 24px":"10px 18px"};${lead?"flex:1;min-width:190px;font-size:17px;":""}">${lead?"\uD83D\uDCF7 Take a picture":"Take picture"}</button>`
      : `<label class="brassBtn camBtn${lead?" camBtnLead":""}" style="cursor:pointer;margin:0;padding:${lead?"18px 24px":"10px 18px"};display:inline-flex;align-items:center;justify-content:center;${lead?"flex:1;min-width:190px;font-size:17px;":""}">${lead?"\uD83D\uDCF7 Take a picture":"Take picture"}<input id="photoCam" type="file" accept="image/*" capture="environment" style="display:none"></label>`;
    /* Wrapped in their own row. .snapCam on the phone is a COLUMN, so the
       pair would have stacked with the gallery button carrying a stray
       left margin - and the desk's card is a row, so neither container
       could be relied on to lay them out. The pair brings its own. */
    return `<div style="display:flex;align-items:stretch;gap:8px;flex-wrap:wrap">${shoot}${gallery}</div>`;
  }
  /* NOT the gallery here. The desk's photo card already draws its own
     #photoIn a few hundred lines up, and emitting a second one gave two
     nodes the same id - getElementById returns the first, so wirePhoto
     would have wired one and the counter clicked the other. The touch
     branch above needs the pair because it IS the whole control; the desk
     card is not. check-screens' "every id once" sweep is what caught it. */
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
  /* 1080p was asked for on every machine, so a 4K camera on an arm over the
     table handed back 1080p and the extra sensor did nothing. "ideal" is a
     preference, not a demand - a 1080p webcam still answers 1080p - so the
     desk asks for 4K and takes whatever it gets. The phone stays at 1080p:
     it is holding the thing in one hand, and the frame is already full. */
  const want=imgDesk()?{width:{ideal:3840},height:{ideal:2160}}
                      :{width:{ideal:1920},height:{ideal:1080}};
  const video=want, dev=camDevices[camIdx];
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
  /* The icon is the app's own dial, in the app's own colours - graphite
     ring, electric-blue arc. It is pinned rather than read off the page
     because the palette is pinned: there is one, and it is dark. */
  const paper="#15171C", track="#2A2F3A", arc="#3B82F6";
  const svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='"+paper+"'/><circle cx='32' cy='32' r='19' fill='none' stroke='"+track+"' stroke-width='8'/><path d='M18.6 45.4A19 19 0 1 1 45.4 45.4' fill='none' stroke='"+arc+"' stroke-width='8' stroke-linecap='round'/></svg>";
  const href="data:image/svg+xml,"+encodeURIComponent(svg), head=document.head||document.documentElement;
  const put=(rel,h,type)=>{ let l=document.querySelector('link[rel="'+rel+'"]'); if(!l){ l=document.createElement("link"); l.rel=rel; head.appendChild(l); } if(type)l.type=type; l.href=h; };
  put("icon",href,"image/svg+xml");
  let tc=document.querySelector('meta[name="theme-color"]'); if(!tc){ tc=document.createElement("meta"); tc.name="theme-color"; head.appendChild(tc); } tc.content=paper;
}catch(e){} })();



/* ================= MODEL PRICE LIST — refreshed weekly by a scheduled task =================
   What a USED one in good working shape really sells for: the middle half of recent
   sales, whole dollars. Row: [id, item(s) it belongs to, name, low, high, confidence
   h/m/l, date checked, source page, what moves the price]. The weekly task rewrites
   only the low, high, confidence, date and source values. It never adds or removes rows. */
let MODEL_PRICES=[
 ["a1","g1","Remington 870 Express",300,400,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+870+express","Super Mag or extra barrels add; rust lowers. CHECK BEFORE LENDING NEAR $400: a NEW one runs about $381 (median of 24 dealer listings, Aug 2026), so the top of this range is above new. Our high needs sold data it has not had yet."],
 ["a2","g1","Remington 870 Wingmaster",450,625,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+870+wingmaster","Bluing and wood; 16, 28 and .410 bring far more"],
 ["a3","g1","Mossberg 500",225,325,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+500","Combo barrels and chokes add"],
 ["a4","g1","Mossberg 590 / 590A1",380,550,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+590a1","590A1 heavy barrel on top; plain 590 less. CHECK BEFORE LENDING NEAR $550: a NEW one runs about $525 (median of 41 dealer listings, Aug 2026), so the top of this range is above new. Our high needs sold data it has not had yet."],
 ["a5","g1","Maverick 88",150,210,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=maverick+88","Extra barrel adds a little"],
 ["a6","g1","Mossberg 835 Ulti-Mag",250,350,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+835+ulti-mag","Camo turkey or waterfowl combos on top"],
 ["a7","g1","Benelli Nova / SuperNova",290,410,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=benelli+nova","SuperNova and camo bring more"],
 ["a8","g1","Browning BPS",525,725,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=browning+bps","Walnut over synthetic; small gauges far more. CHECK BEFORE LENDING NEAR $725: a NEW one runs about $667 (median of 25 dealer listings, Aug 2026), so the top of this range is above new. Our high needs sold data it has not had yet."],
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
 ["b9a","g7","Sig Sauer P226",800,1100,"m","2026-09-27","https://gunwatcher.com/sig-sauer-p226-value-sold-information/market-price","Police trade-ins are the cheap end; West German, stainless Elite and Legion far higher"],
 ["b9b","g7","Sig Sauer P229",575,750,"m","2026-09-27","https://gunwatcher.com/sig-sauer-p229-value-sold-information/market-price","Trade-ins common; .40 softer than 9mm"],
 ["b10","g7","S&W M&P9 2.0",320,400,"m","2026-09-19","https://gunwatcher.com/smith-wesson-m-p9-value-sold-information/market-price","Optics-ready on top; 1.0 models lower"],
 ["b11","g7","S&W M&P Shield / Shield Plus",260,340,"m","2026-09-19","https://gunwatcher.com/smith-wesson-m-p-shield-plus-value-sold-information/market-price","Shield Plus about $50 over the original"],
 ["b12","g7","S&W Bodyguard 380",220,280,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=bodyguard+380","Laser adds; Bodyguard 2.0 higher"],
 ["b13","g7","Springfield Hellcat",340,410,"m","2026-09-19","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=hellcat","OSP, Pro or a mounted optic on top"],
 ["b14","g7","Springfield XD / XDs",240,310,"m","2026-09-19","https://gunwatcher.com/springfield-xd-value-sold-information/market-price","XD Mod.2 and Elite above"],
 ["b15","g7","Taurus G2C / G3C",110,185,"m","2026-09-27","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=taurus+g3c","Cheap new price caps it; a G2C is the bottom of this range and a G3C the top"],
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
 ["b31a","g8","Ruger Blackhawk",575,775,"m","2026-09-27","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+blackhawk","Convertibles and Super Blackhawk add; three-screw guns far higher"],
 ["b31b","g8","Ruger Single-Six",400,525,"m","2026-09-27","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=ruger+single-six","Convertible with the .22 Mag cylinder adds"],
 ["b32","g8","Taurus Judge",350,450,"m","2026-09-28","https://gunwatcher.com/gun-value-sold-information/market-price?itemName=taurus+judge","Public Defender is the cheap 2in compact, not a step up; stainless, Magnum and Home Defender above the plain 3in"],
 ["b33","g8","Colt Python (2020+)",950,1200,"m","2026-09-19","https://www.webuyguns.com/valuations/colt/python","New retail near $1,100 caps it; older Pythons far more"],
 ["c1","p1","Stihl MS 170 / 180",170,230,"m","2026-09-22","shelf tags photographed 19 Sep 2026, Bristol area","MS 180 slightly more; easy start and good chain"],
 ["c3","p1","Stihl MS 271 Farm Boss",300,420,"m","2026-09-22","https://www.tractorhouse.com/listings/for-sale/stihl/ms/chainsaws/1186","20 in bar, low hours"],
 ["c6","p1","Stihl MS 461 / 462",780,1020,"m","2026-09-22","https://opeforum.com/threads/ms462.32595/","MS 462 more; piston condition"],
 ["c7","p1","Husqvarna 450 / 445",210,290,"m","2026-09-22","shelf tags photographed 19 Sep 2026, Bristol area","450 over 445"],
 ["c10","p1","Echo CS-400 / CS-4010",130,210,"l","2026-09-22","","Thin sales data; CS-4010 is newer"],
 ["c11","p1","Echo CS-590 Timber Wolf",265,385,"l","2026-09-22","https://www.treetrader.com/listings/for-sale/echo/cs590-timber-wolf/chainsaws-outdoor-power/1186","Bar and chain included matters a lot"],
 ["c12","p2","Stihl FS 56 / FS 91",110,215,"l","2026-09-22","https://used.equipmentshare.com/products/stihl-fs-91-r-563012","FS 91 about double the FS 56"],
 ["c13","p2","Stihl FS 131",240,360,"l","2026-09-22","","Bike-handle and blade kits add"],
 ["c14","p2","Echo SRM-225",100,170,"l","2026-09-22","","Starts easily; head and shaft condition"],
 ["c16","p3","Stihl BR 800",425,575,"m","2026-09-22","shelf tags photographed 19 Sep 2026, Bristol area","Hours and landscaper wear"],
 ["c17","p3","Echo PB-580T",230,330,"l","2026-09-22","https://opeforum.com/threads/need-backpack-blower-asap-please.26602/","Lawn-crew wear lowers price"],
 ["c18","p3","Echo PB-770T",330,450,"l","2026-09-22","https://opeforum.com/threads/would-you-buy-a-used-echo-pb-770t.8184/","Hours and carb history"],
 ["c19","p3","Husqvarna 350BT",255,345,"m","2026-09-22","shelf tags photographed 19 Sep 2026, Bristol area","Homeowner grade; starting condition"],
 ["c20","p7|Inverter generator — 2kW","Honda EU2200i",780,1020,"m","2026-09-22","https://www.machinerytrader.com/listings/for-sale/honda/eu2200i/construction-equipment","Hours and stale fuel"],
 ["c21","p7","Honda EU3000iS",1380,1920,"m","2026-09-22","https://www.machinerytrader.com/listings/for-sale/honda/eu3000is/construction-equipment","Hours; electric start working"],
 ["c22","p4","Honda HRX / HRN mower",270,450,"l","2026-09-22","https://www.tractorhouse.com/listings/used-honda-hrx217vka-lawn-mowers-outdoor-power-for-sale/?Category=1188&Manufacturer=HONDA&ModelGroup=HRX217VKA&Condition=USED","HRX over HRN; drive working"],
 ["c23","p5","John Deere E100–E130 / S100–S130",1140,1800,"m","2026-09-22","https://www.tractorhouse.com/listings/for-sale/john-deere/e130/riding-lawn-mowers/1170","Hours, deck rust, transmission"],
 ["c24","p5","John Deere X350 / X380",2400,3480,"m","2026-09-22","https://www.machinerypete.com/lawn-and-garden/lawn-mowers/john-deere/x350","X380 and 48–54 in deck higher"],
 ["c25","Zero-turn mower","Residential zero-turn, 48–54 in",1700,2700,"m","2026-09-19","https://www.tractorhouse.com/listings/for-sale/husqvarna/z254/zero-turn-lawn-mowers/1191","Deere highest; hours and deck rust"],
 ["c26","t1","DeWalt 20V drill kit",65,110,"m","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Brushless DCD791 over DCD771; battery size"],
 ["c27","t1","DeWalt 20V impact driver kit",75,115,"l","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","2Ah vs 5Ah battery drives most of it"],
 ["c28","t1","Milwaukee M18 Fuel drill kit",150,220,"m","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Hammer drill and 5Ah batteries on top"],
 ["c29","t1","Milwaukee M18 Fuel impact driver kit",120,180,"m","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","5Ah packs add $35–55"],
 ["c30","t2","Milwaukee M18 Fuel 1/2 in impact wrench",185,250,"l","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Bare tool $150–190 plus a 5Ah pack"],
 ["c31","t1","Makita 18V LXT drill kit",60,100,"l","2026-09-19","https://www.underpriced.app/blog/where-to-sell-used-power-tools","Brushless and battery size"],
 ["c32","t1","Ryobi ONE+ drill kit",30,55,"m","2026-09-19","https://lambertpawn.com/the-power-tool-brands-that-hold-their-value-best-and-why-pawn-shops-love-them/","Low resale; brushless lifts it"],
 ["d1","h1","Leupold VX-3HD",425,595,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Leupold%20VX-3HD&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["d2","h1","Leupold VX-Freedom",155,220,"m","2026-09-19","https://www.hunttalk.com/threads/leupold-vx-freedom-3-9x40-matte-duplex.326600/","CDS version up to about $275"],
 ["d3","h1","Vortex Crossfire II",65,100,"m","2026-09-19","https://rokslide.com/forums/threads/vortex-crossfire-ii-3-9x40.363828/","New on sale near $130 caps it"],
 ["d4","h1","Vortex Diamondback scope",100,150,"m","2026-09-19","https://www.hunttalk.com/threads/vortex-diamondback-4-12x40.322162/","Tactical version a bit more"],
 ["d5","h1","Vortex Viper PST Gen II",550,750,"m","2026-09-19","https://rokslide.com/forums/threads/vortex-viper-pst-gen-ii-5x25x50-550.355234/","FFP and like-new with box higher"],
 ["d6","h3","Vortex Ranger 1800",130,175,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Ranger%201800&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["d7","h2","Vortex Diamondback HD 10x42",120,144,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Diamondback%20HD%2010x42&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["d8","h8","Minn Kota Terrova",850,1350,"l","2026-09-19","https://www.in-depthoutdoors.com/community/forums/topic/whats-my-terrova-worth/","i-Pilot Link, shaft length and year"],
 ["d9","h8","Minn Kota Endura",80,150,"l","2026-09-19","","30 lb near low end, 55 lb near high"],
 ["d10","h4|Cellular game camera","Tactacam Reveal X",50,75,"l","2026-09-19","https://www.trailcampro.com/products/used-tactacam-reveal-x-gen-2","Needs a working plan"],
 ["d11","h5","Mathews V3X",800,1450,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Mathews%20V3X&LH_Sold=1&LH_Complete=1","27 eBay sales in the last 90 days",""],
 ["d12","h5","Hoyt RX-7",800,1080,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Hoyt%20RX-7&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
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
 ["e1","e4","iPhone 13",162,216,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=iPhone%2013&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
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
 ["e14","e5","PlayStation 5 digital",329,430,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PlayStation%205%20digital&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["e15","e5a","PlayStation 4",90,140,"h","2026-09-19","https://www.pricecharting.com/console/playstation-4?genre-name=systems","PS4 Pro runs $150–200"],
 ["e16","e5","Xbox Series X",470,560,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20Series%20X&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["e17","e5","Xbox Series S",210,305,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20Series%20S&LH_Sold=1&LH_Complete=1","28 eBay sales in the last 90 days",""],
 ["e18","e5a","Xbox One S / One X",100,170,"m","2026-09-19","https://www.pricecharting.com/console/xbox-one?genre-name=systems","One X $140–180"],
 ["e19","e5","Nintendo Switch OLED",175,190,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%20OLED&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["e20","e5","Nintendo Switch",135,180,"h","2026-09-19","https://www.pricecharting.com/console/nintendo-switch?genre-name=systems","Needs dock and Joy-Cons; drift cuts value"],
 ["e21","e5|Handheld game console","Nintendo Switch Lite",95,130,"h","2026-09-19","https://www.pricecharting.com/console/nintendo-switch?genre-name=systems","Special editions $140–160"],
 ["e22","e5","Nintendo Switch 2",169,449,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%202&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["e23","Handheld game console","Steam Deck",400,520,"m","2026-09-19","https://www.pricecharting.com/game/pc-games/steam-deck-256-gb","512GB and case add"],
 ["e24","e2","MacBook Air M1",320,410,"m","2026-09-19","https://swappa.com/prices/macbook-air-2020-13","Battery cycles; 16GB adds"],
 ["e25","e2","MacBook Air M2",540,660,"m","2026-09-19","https://swappa.com/prices/macbook-air-2022-13","512GB or 16GB adds about $100"],
 ["e26","GoPro / action camera","GoPro Hero 11 / 12",180,270,"m","2026-09-19","https://swappa.com/prices/gopro-hero12","Extra batteries add"],
 ["e27a","Camera drone","DJI Mini 3",330,420,"l","2026-09-19","https://swappa.com/drones/price/dji-mini-3","Fly More combo adds"],
 ["e27b","Camera drone","DJI Mini 4 Pro",690,850,"l","2026-09-19","https://swappa.com/drones/price/dji-mini-4-pro","Fly More combo adds"],
 ["e28","VR headset","Meta Quest 3",170,330,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Meta%20Quest%203&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["e29","j2","Apple Watch Series 8 / 9",120,190,"m","2026-09-19","https://swappa.com/prices/apple-watch-series-9-45mm","Battery health; 45mm adds"],
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
 ["f13","Golf cart","Yamaha Drive2",4500,6800,"m","2026-09-19","https://golfcartsearch.com/golf-cart-value-calculator/yamaha/drive","Gas QuieTech and lithium bring more"],
 ["h2","e3","Samsung Galaxy Tab A8",61,116,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Tab%20A8&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h4","e5","PlayStation 5 disc",400,449,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PlayStation%205%20disc&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h7","e5","PlayStation 5 Slim",360,462,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PlayStation%205%20Slim&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h9","e5a","PlayStation 4 Pro",125,180,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PlayStation%204%20Pro&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h11","e5a","PlayStation 4 Slim",100,135,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PlayStation%204%20Slim&LH_Sold=1&LH_Complete=1","27 eBay sales in the last 90 days",""],
 ["h14","Headphones — over-ear","Sony WH-1000XM4",95,150,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20WH-1000XM4&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h16","Headphones — over-ear","Sony WH-1000XM5",109,128,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20WH-1000XM5&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h18","Headphones — over-ear","Sony WH-CH720N",35,55,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20WH-CH720N&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h20","Headphones — over-ear","Bose QuietComfort 45",85,100,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20QuietComfort%2045&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h22","Headphones — over-ear","Bose QuietComfort Ultra",143,209,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20QuietComfort%20Ultra&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h24","Headphones — over-ear","Bose QuietComfort 35 II",47,100,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20QuietComfort%2035%20II&LH_Sold=1&LH_Complete=1","29 eBay sales in the last 90 days",""],
 ["h26","Wireless earbuds","Apple AirPods 4",60,108,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Apple%20AirPods%204&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h28","Wireless earbuds","Apple AirPods Pro",50,97,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Apple%20AirPods%20Pro&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h30","Wireless earbuds","Apple AirPods Pro 2",60,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Apple%20AirPods%20Pro%202&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h32","Game controller","Xbox Wireless Controller Series X|S",17,49,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20Wireless%20Controller%20Series%20X%7CS&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days","xbox series x s controller"],
 ["h34","Game controller","Xbox Elite Series 2",40,65,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20Elite%20Series%202&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days","xbox elite controller"],
 ["h36","Game controller","Xbox Elite Series 2 Core",45,68,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20Elite%20Series%202%20Core&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days","xbox elite core controller"],
 ["h38","Game controller","Xbox One Wireless Controller",15,26,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20One%20Wireless%20Controller&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days","xbox one controller"],
 ["h40","Game controller","Sony DualSense",35,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20DualSense&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days","ps5 playstation 5 controller dual sense"],
 ["h42","Game controller","Sony DualSense Edge",89,140,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20DualSense%20Edge&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days","ps5 playstation 5 controller dual sense edge pro"],
 ["h44","Headphones — over-ear","Bose 700",78,90,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20700&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h46","Headphones — over-ear","Beats Studio3",30,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Studio3&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h48","Headphones — over-ear","Beats Studio Pro",60,79,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Studio%20Pro&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h50","Headphones — over-ear","Beats Solo 3",34,55,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Solo%203&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h52","Headphones — over-ear","Beats Solo 4",60,76,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Solo%204&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h54","Headphones — over-ear","Sennheiser HD 450BT",35,50,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sennheiser%20HD%20450BT&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h56","Headphones — over-ear","Sennheiser Momentum 4",110,140,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sennheiser%20Momentum%204&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h58","Headphones — over-ear","Audio-Technica ATH-M50x",60,95,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Audio-Technica%20ATH-M50x&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days",""],
 ["h60","Headphones — over-ear","Audio-Technica ATH-M20x",28,40,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Audio-Technica%20ATH-M20x&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h62","Headphones — over-ear","JBL Tune 760NC",25,36,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Tune%20760NC&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h64","Headphones — over-ear","JBL Live 660NC",20,36,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Live%20660NC&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h66","Headphones — over-ear","Skullcandy Crusher Evo",63,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Skullcandy%20Crusher%20Evo&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h68","Headphones — over-ear","Marshall Major IV",35,52,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Marshall%20Major%20IV&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h70","Wireless earbuds","Samsung Galaxy Buds2",22,40,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Buds2&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h72","Wireless earbuds","Samsung Galaxy Buds2 Pro",40,50,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Buds2%20Pro&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h74","Wireless earbuds","Samsung Galaxy Buds FE",22,34,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Buds%20FE&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h76","Wireless earbuds","Samsung Galaxy Buds Live",40,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Buds%20Live&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h78","Wireless earbuds","Samsung Galaxy Buds3",40,58,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Buds3&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h80","Wireless earbuds","Sony WF-1000XM4",45,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20WF-1000XM4&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h82","Wireless earbuds","Sony WF-1000XM5",90,106,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20WF-1000XM5&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h84","Wireless earbuds","Sony WF-C500",21,29,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20WF-C500&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h86","Wireless earbuds","Sony LinkBuds S",32,46,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20LinkBuds%20S&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h88","Wireless earbuds","Bose QuietComfort Earbuds II",45,100,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20QuietComfort%20Earbuds%20II&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h90","Wireless earbuds","Bose Sport Earbuds",50,70,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20Sport%20Earbuds&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h92","Wireless earbuds","Beats Fit Pro",33,54,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Fit%20Pro&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h94","Wireless earbuds","Beats Studio Buds",25,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Studio%20Buds&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h96","Wireless earbuds","Beats Powerbeats Pro",55,70,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Beats%20Powerbeats%20Pro&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h98","Wireless earbuds","Jabra Elite 75t",43,55,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Jabra%20Elite%2075t&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h100","Wireless earbuds","Jabra Elite 85t",30,79,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Jabra%20Elite%2085t&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h102","Wireless earbuds","Jabra Elite 4",50,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Jabra%20Elite%204&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h104","Wireless earbuds","Google Pixel Buds Pro",80,105,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Google%20Pixel%20Buds%20Pro&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h106","Wireless earbuds","Google Pixel Buds A-Series",22,45,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Google%20Pixel%20Buds%20A-Series&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h108","Wireless earbuds","JBL Tune 230NC",20,26,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Tune%20230NC&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h110","Wireless earbuds","Anker Soundcore Liberty 4",40,70,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Anker%20Soundcore%20Liberty%204&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h112","Wireless earbuds","Anker Soundcore Life P3",29,40,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Anker%20Soundcore%20Life%20P3&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h114","Wireless earbuds","Skullcandy Indy Evo",15,20,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Skullcandy%20Indy%20Evo&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h116","Wireless earbuds","Raycon Everyday",33,40,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Raycon%20Everyday&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h118","Game controller","Sony DualShock 4",15,35,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20DualShock%204&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days","ps4 playstation 4 controller dual shock"],
 ["h120","Game controller","Nintendo Switch Pro Controller",16,48,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%20Pro%20Controller&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days","switch pro controller nintendo"],
 ["h122","Game controller","Nintendo Joy-Con pair",25,30,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Joy-Con%20pair&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days","switch joycon joy con nintendo"],
 ["h124","Game controller","Nintendo Switch 2 Pro Controller",25,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%202%20Pro%20Controller&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days","switch 2 pro controller nintendo"],
 ["h126","Game controller","8BitDo Pro 2",20,30,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=8BitDo%20Pro%202&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h128","Game controller","8BitDo Ultimate",18,34,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=8BitDo%20Ultimate&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h130","Game controller","Scuf Instinct Pro",46,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Scuf%20Instinct%20Pro&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h132","Game controller","Razer Wolverine V2",20,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Razer%20Wolverine%20V2&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h134","Game controller","PowerA Enhanced Wired",13,20,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PowerA%20Enhanced%20Wired&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h136","Game controller","Turtle Beach Recon Controller",7,16,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Turtle%20Beach%20Recon%20Controller&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h138","Game controller","Hori Split Pad Pro",12,19,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Hori%20Split%20Pad%20Pro&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h141","e5a","Xbox One X",120,410,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20One%20X&LH_Sold=1&LH_Complete=1","26 eBay sales in the last 90 days",""],
 ["h143","e5a","Xbox One S",80,100,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20One%20S&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["h146","e5","Nintendo Switch V2",103,140,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%20V2&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h148","e5","Nintendo Switch Lite",95,109,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%20Lite&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h150","e5a","Xbox One",71,99,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20One&LH_Sold=1&LH_Complete=1","24 eBay sales in the last 90 days",""],
 ["h152","e5b","Xbox 360",60,110,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20360&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h154","e5b","PlayStation 3",70,290,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=PlayStation%203&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h156","e5a","Nintendo Wii U",65,160,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Wii%20U&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h158","e5b","Nintendo Wii",45,160,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Wii&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h161","e5","Xbox Series X Digital",265,470,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Xbox%20Series%20X%20Digital&LH_Sold=1&LH_Complete=1","24 eBay sales in the last 90 days",""],
 ["h163","Handheld game console","Nintendo Switch Lite",91,105,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%20Lite&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h165","Handheld game console","Nintendo Switch OLED",175,190,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%20Switch%20OLED&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h167","Handheld game console","Steam Deck 256GB",400,440,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Steam%20Deck%20256GB&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h169","Handheld game console","Steam Deck OLED",630,700,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Steam%20Deck%20OLED&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h171","Handheld game console","Nintendo 3DS XL",180,280,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Nintendo%203DS%20XL&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h173","Handheld game console","New Nintendo 2DS XL",193,279,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=New%20Nintendo%202DS%20XL&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h175","Handheld game console","Sony PS Vita",128,193,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20PS%20Vita&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h177","Handheld game console","Anbernic RG35XX",47,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Anbernic%20RG35XX&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h179","Handheld game console","Analogue Pocket",281,420,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Analogue%20Pocket&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h181","VR headset","Meta Quest 2",55,200,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Meta%20Quest%202&LH_Sold=1&LH_Complete=1","29 eBay sales in the last 90 days",""],
 ["h184","VR headset","Meta Quest 3S",100,199,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Meta%20Quest%203S&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days",""],
 ["h186","VR headset","Meta Quest Pro",300,445,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Meta%20Quest%20Pro&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["h188","VR headset","Sony PlayStation VR2",189,284,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20PlayStation%20VR2&LH_Sold=1&LH_Complete=1","28 eBay sales in the last 90 days",""],
 ["h190","VR headset","Sony PlayStation VR",170,284,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20PlayStation%20VR&LH_Sold=1&LH_Complete=1","26 eBay sales in the last 90 days",""],
 ["h192","VR headset","Valve Index",115,375,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Valve%20Index&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h194","VR headset","Pico 4",378,579,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Pico%204&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h196","Smartwatch — Apple / Galaxy","Samsung Galaxy Watch 5",56,135,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Watch%205&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h198","Smartwatch — Apple / Galaxy","Samsung Galaxy Watch 6",65,70,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Watch%206&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h200","Smartwatch — Apple / Galaxy","Samsung Galaxy Watch 7",85,99,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Watch%207&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h202","Smartwatch — Apple / Galaxy","Fitbit Versa 4",42,55,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Fitbit%20Versa%204&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h204","Smartwatch — Apple / Galaxy","Fitbit Sense 2",50,61,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Fitbit%20Sense%202&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h206","Smartwatch — Apple / Galaxy","Garmin Forerunner 265",270,285,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Garmin%20Forerunner%20265&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h208","Smartwatch — Apple / Galaxy","Garmin Venu 2",61,180,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Garmin%20Venu%202&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h210","Monitor — 27in","Dell S2721DGF",100,179,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Dell%20S2721DGF&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h212","Monitor — 27in","Dell U2720Q",130,200,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Dell%20U2720Q&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h214","Monitor — 27in","LG 27GL83A-B",32,110,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=LG%2027GL83A-B&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h216","Monitor — 27in","LG 27GN800",95,115,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=LG%2027GN800&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h218","Monitor — 27in","Samsung Odyssey G5",95,129,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Odyssey%20G5&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h220","Monitor — 27in","Samsung Odyssey G7",139,250,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Odyssey%20G7&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h222","Monitor — 27in","AOC 24G2",67,99,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=AOC%2024G2&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h224","Monitor — 27in","HP 24mh",44,75,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=HP%2024mh&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h226","e6","JBL Flip 5",40,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Flip%205&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h228","e6","JBL Flip 6",37,49,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Flip%206&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h230","e6","JBL Charge 4",35,65,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Charge%204&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h232","e6","JBL Charge 5",70,90,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Charge%205&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h234","e6","JBL Xtreme 3",41,150,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Xtreme%203&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h236","e6","Bose SoundLink Flex",58,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20SoundLink%20Flex&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h238","e6","Bose SoundLink Revolve",40,105,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20SoundLink%20Revolve&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h240","e6","Ultimate Ears Boom 3",40,54,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Ultimate%20Ears%20Boom%203&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h242","e6","Ultimate Ears Megaboom 3",50,64,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Ultimate%20Ears%20Megaboom%203&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h244","e6","Sony SRS-XB13",20,30,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20SRS-XB13&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days","xb-13 xb13"],
 ["h246","e6","Sony SRS-XB43",128,169,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20SRS-XB43&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days","xb-43 xb43"],
 ["h248","e6","Anker Soundcore Motion Boom",60,82,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Anker%20Soundcore%20Motion%20Boom&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h250","e6","Anker Soundcore Flare 2",26,35,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Anker%20Soundcore%20Flare%202&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h252","e6","Marshall Emberton",60,80,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Marshall%20Emberton&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h254","e6","JBL Clip 4",16,32,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Clip%204&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h256","e6","JBL Go 3",15,20,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Go%203&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h258","e6","Bose SoundLink Micro",34,50,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Bose%20SoundLink%20Micro&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h260","e6","Sony SRS-XG300",77,105,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sony%20SRS-XG300&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h262","e6","Anker Soundcore 3",26,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Anker%20Soundcore%203&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h264","e6","Marshall Willen",48,60,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Marshall%20Willen&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h266","e7","Rockford Fosgate R500X1D",100,120,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Rockford%20Fosgate%20R500X1D&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h268","e7","Kicker 46CXA8001",115,150,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Kicker%2046CXA8001&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h270","e7","JL Audio 12W3v3",105,349,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JL%20Audio%2012W3v3&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h272","e7","JL Audio JX1000/1D",200,300,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JL%20Audio%20JX1000%2F1D&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days","jx-1000 jx1000"],
 ["h274","e7","Pioneer GM-D8601",78,90,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Pioneer%20GM-D8601&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days","d-8601 d8601"],
 ["h276","e7","Sundown SA-12",220,342,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Sundown%20SA-12&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days","sa-12 sa12"],
 ["h278","e4","iPhone 12",105,200,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=iPhone%2012&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h281","e4","OnePlus 10T",125,155,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=OnePlus%2010T&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h283","Video game — current title","NBA 2K24",4,10,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=NBA%202K24&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h285","Video game — current title","EA Sports FC 25",11,15,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=EA%20Sports%20FC%2025&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h287","Video game — current title","EA Sports FC 24",9,13,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=EA%20Sports%20FC%2024&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h289","Video game — current title","Mario Kart 8 Deluxe",25,32,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Mario%20Kart%208%20Deluxe&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h291","Video game — current title","Pokemon Scarlet",35,70,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Pokemon%20Scarlet&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h293","Video game — current title","Red Dead Redemption 2",10,15,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Red%20Dead%20Redemption%202&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h295","Video game — current title","Baldur's Gate 3",49,58,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Baldur's%20Gate%203&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h297","e3","Lenovo Tab M10",50,75,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Lenovo%20Tab%20M10&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days","m-10 m10"],
 ["h299","e3","onn. 10 Tablet Pro",40,50,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=onn.%2010%20Tablet%20Pro&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h301","e1","Samsung TU7000 55in",50,150,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Samsung%20TU7000%2055in&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days","tu-7000 tu7000"],
 ["h303","e2","Dell Inspiron 15 3520",135,255,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Dell%20Inspiron%2015%203520&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h305","e2","HP Pavilion 15",99,230,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=HP%20Pavilion%2015&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h307","e2","HP Envy x360 15",250,450,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=HP%20Envy%20x360%2015&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days","x-360 x360"],
 ["h309","e2","Lenovo Legion 5 15",450,600,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Lenovo%20Legion%205%2015&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h311","e2","Asus TUF Gaming A15",600,750,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Asus%20TUF%20Gaming%20A15&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days","a-15 a15"],
 ["h313","e2","Acer Aspire 5",272,391,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Acer%20Aspire%205&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h315","e2","Microsoft Surface Laptop 4",165,225,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Microsoft%20Surface%20Laptop%204&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h317","e2","Acer Swift 3",258,522,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Acer%20Swift%203&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h319","e3","Samsung Galaxy Tab S6 Lite",110,150,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Tab%20S6%20Lite&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h321","e3","Samsung Galaxy Tab A7 Lite",40,65,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Tab%20A7%20Lite&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h284","Video game — sports title","NBA 2K24",4,10,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=NBA%202K24&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h288","Video game — sports title","EA Sports FC 25",11,15,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=EA%20Sports%20FC%2025&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h292","Video game — sports title","EA Sports FC 24",9,13,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=EA%20Sports%20FC%2024&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h296","Video game — Nintendo title","Mario Kart 8 Deluxe",25,32,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Mario%20Kart%208%20Deluxe&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h300","Video game — Nintendo title","Pokemon Scarlet",35,70,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Pokemon%20Scarlet&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h320","Gaming laptop","Lenovo Legion 5 15",450,600,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Lenovo%20Legion%205%2015&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h323","Gaming laptop","Asus TUF Gaming A15",600,750,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Asus%20TUF%20Gaming%20A15&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days","a-15 a15"],
 ["h45","Video game — sports title","Madden NFL 25",2,7,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Madden%20NFL%2025&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h310","Video game — current title","Grand Theft Auto V",4,9,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Grand%20Theft%20Auto%20V&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h331","Gaming laptop","HP Omen 16",450,1450,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=HP%20Omen%2016&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h334","Gaming laptop","Alienware m15 R7",675,1134,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Alienware%20m15%20R7&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h336","Gaming laptop","MSI Katana 15",680,900,"h","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=MSI%20Katana%2015&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h335","e2","Lenovo ThinkPad T14",240,430,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Lenovo%20ThinkPad%20T14&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days","t-14 t14"],
 ["h341","e2","Microsoft Surface Laptop 5",180,249,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Microsoft%20Surface%20Laptop%205&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h344","j1","Rolex Datejust 36",4999,6450,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Rolex%20Datejust%2036&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h346","j1","Rolex Explorer",5900,8299,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Rolex%20Explorer&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h348","j1","Omega Seamaster 300M",1800,3200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Omega%20Seamaster%20300M&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h350","j1","Omega Speedmaster Professional",1975,4101,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Omega%20Speedmaster%20Professional&LH_Sold=1&LH_Complete=1","20 eBay sales in the last 90 days",""],
 ["h352","j1","Tudor Black Bay 58",3900,4200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Tudor%20Black%20Bay%2058&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days","bay-58 bay58"],
 ["h354","j1","Cartier Tank Must",1395,2900,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Cartier%20Tank%20Must&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days",""],
 ["h356","j1","Breitling Navitimer",3250,3950,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Breitling%20Navitimer&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h358","j1","TAG Heuer Carrera",449,1820,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=TAG%20Heuer%20Carrera&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h360","j1","TAG Heuer Aquaracer",575,1199,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=TAG%20Heuer%20Aquaracer&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h362","f1","NordicTrack Commercial 1750",60,280,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=NordicTrack%20Commercial%201750&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h364","f1","Bowflex Treadmill 10",100,150,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bowflex%20Treadmill%2010&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h366","t6","Lincoln Power MIG 140C",240,470,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Lincoln%20Power%20MIG%20140C&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days","mig-140c mig140c"],
 ["h368","a3","LG WM3400CW washer",40,75,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=LG%20WM3400CW%20washer&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days","wm-3400cw wm3400cw"],
 ["h370","t7","Snap-on KRA tool box",36,170,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Snap-on%20KRA%20tool%20box&LH_Sold=1&LH_Complete=1","28 eBay sales in the last 90 days",""],
 ["h372","a1","Whirlpool WFE505W0HS range",80,125,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Whirlpool%20WFE505W0HS%20range&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h374","f2","Peloton Bike",190,350,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Peloton%20Bike&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h376","f2","Peloton Bike Plus",200,350,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Peloton%20Bike%20Plus&LH_Sold=1&LH_Complete=1","21 eBay sales in the last 90 days",""],
 ["h378","f2","NordicTrack S22i",85,375,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=NordicTrack%20S22i&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days","s-22i s22i"],
 ["h380","f2","Schwinn IC4",179,450,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Schwinn%20IC4&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h382","f2","Schwinn 170",23,110,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Schwinn%20170&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h384","f2","Keiser M3i",305,650,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Keiser%20M3i&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h386","f3","Sole E25",100,300,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Sole%20E25&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days","e-25 e25"],
 ["h388","f3","Schwinn 470",99,150,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Schwinn%20470&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h390","f7","Callaway Strata complete set",275,325,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Callaway%20Strata%20complete%20set&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h392","f7","TaylorMade SIM2 iron set",385,473,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=TaylorMade%20SIM2%20iron%20set&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h394","f7","TaylorMade M4 iron set",349,360,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=TaylorMade%20M4%20iron%20set&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h396","f7","Mizuno JPX 921 iron set",420,550,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Mizuno%20JPX%20921%20iron%20set&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days","jpx-921 jpx921"],
 ["h398","f7","Wilson Profile complete set",115,220,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Wilson%20Profile%20complete%20set&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h400","p6","Ryobi 3100 PSI pressure washer",30,40,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Ryobi%203100%20PSI%20pressure%20washer&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h402","t8","Paslode CF325XP",130,200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Paslode%20CF325XP&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days","cf-325xp cf325xp"],
 ["h404","t8","Paslode 900420",70,100,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Paslode%20900420&LH_Sold=1&LH_Complete=1","4 eBay sales in the last 90 days",""],
 ["h406","t8","Bostitch F21PL",118,165,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bostitch%20F21PL&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days","f-21pl f21pl"],
 ["h408","t8","Metabo HPT NR90AES1",80,126,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Metabo%20HPT%20NR90AES1&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days",""],
 ["h410","j2","Seiko SKX007",145,340,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Seiko%20SKX007&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days","skx-007 skx007"],
 ["h412","j2","Seiko 5 Sports SRPD",190,199,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Seiko%205%20Sports%20SRPD&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h414","j2","Seiko Prospex Turtle",328,499,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Seiko%20Prospex%20Turtle&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h416","j2","Citizen Eco-Drive Promaster",145,280,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Citizen%20Eco-Drive%20Promaster&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h418","j2","Bulova Marine Star",93,229,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bulova%20Marine%20Star&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h420","j2","Fossil Grant",40,55,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Fossil%20Grant&LH_Sold=1&LH_Complete=1","27 eBay sales in the last 90 days",""],
 ["h422","j2","Tissot PRX",195,415,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Tissot%20PRX&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h424","j2","Hamilton Khaki Field",425,495,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Hamilton%20Khaki%20Field&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h426","j2","Invicta Pro Diver 8926",50,70,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Invicta%20Pro%20Diver%208926&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h428","j2","Movado Museum",85,260,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Movado%20Museum&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h430","j2","Michael Kors Lexington",25,75,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Michael%20Kors%20Lexington&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h432","j2","Apple Watch Series 7",70,140,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Apple%20Watch%20Series%207&LH_Sold=1&LH_Complete=1","25 eBay sales in the last 90 days",""],
 ["h434","j2","Apple Watch Series 8",59,120,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Apple%20Watch%20Series%208&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["h436","j2","Apple Watch SE",75,110,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Apple%20Watch%20SE&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["h438","j2","Garmin Fenix 6",175,217,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Garmin%20Fenix%206&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days",""],
 ["h440","j2","Garmin Fenix 7",300,410,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Garmin%20Fenix%207&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h442","j2","Garmin Forerunner 245",90,136,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Garmin%20Forerunner%20245&LH_Sold=1&LH_Complete=1","26 eBay sales in the last 90 days",""],
 ["h444","t4","Porter-Cable C2002",65,104,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Porter-Cable%20C2002&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days","c-2002 c2002"],
 ["h446","t4","California Air Tools 8010",145,210,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=California%20Air%20Tools%208010&LH_Sold=1&LH_Complete=1","5 eBay sales in the last 90 days",""],
 ["h448","h7","Penn Battle III",80,119,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Penn%20Battle%20III&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days",""],
 ["h450","h7","Penn Slammer III",177,194,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Penn%20Slammer%20III&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h452","h7","Shimano Stradic",118,190,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Shimano%20Stradic&LH_Sold=1&LH_Complete=1","16 eBay sales in the last 90 days",""],
 ["h454","h7","Shimano Curado",123,190,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Shimano%20Curado&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h456","h7","Shimano Sedona",36,65,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Shimano%20Sedona&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h458","h7","Abu Garcia Ambassadeur 6500",50,85,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Abu%20Garcia%20Ambassadeur%206500&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h460","h7","Abu Garcia Revo SX",55,103,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Abu%20Garcia%20Revo%20SX&LH_Sold=1&LH_Complete=1","22 eBay sales in the last 90 days",""],
 ["h462","h7","Daiwa BG 3000",80,90,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Daiwa%20BG%203000&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days","bg-3000 bg3000"],
 ["h464","h7","Daiwa Tatula",115,153,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Daiwa%20Tatula&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h466","h7","Ugly Stik GX2 combo",30,55,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Ugly%20Stik%20GX2%20combo&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h468","h7","Lew's Mach Crush",50,70,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Lew's%20Mach%20Crush&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h470","a9","Brother CS7000X sewing machine",150,200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Brother%20CS7000X%20sewing%20machine&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days","cs-7000x cs7000x"],
 ["h472","a9","Singer Heavy Duty 4423",100,155,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Singer%20Heavy%20Duty%204423&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days","duty-4423 duty4423"],
 ["h474","f5","Bowflex SelectTech 552",25,76,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bowflex%20SelectTech%20552&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h476","f5","Bowflex SelectTech 1090",25,64,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bowflex%20SelectTech%201090&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h478","f5","PowerBlock Elite",145,305,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=PowerBlock%20Elite&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h480","a10","Dyson V8",40,128,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Dyson%20V8&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h482","a10","Dyson V10",85,219,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Dyson%20V10&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days","v-10 v10"],
 ["h484","a10","Dyson V11",124,290,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Dyson%20V11&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days","v-11 v11"],
 ["h486","a10","Dyson V15",105,334,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Dyson%20V15&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days","v-15 v15"],
 ["h488","t3","DeWalt DWE402",45,60,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=DeWalt%20DWE402&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days","dwe-402 dwe402"],
 ["h490","t3","DeWalt DCG413",70,110,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=DeWalt%20DCG413&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days","dcg-413 dcg413"],
 ["h492","t3","Makita 9557PB",55,65,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Makita%209557PB&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h494","h4","Browning Strike Force",55,72,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Browning%20Strike%20Force&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h496","h4","Browning Dark Ops",39,60,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Browning%20Dark%20Ops&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h498","h4","Stealth Cam Fusion X",29,36,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Stealth%20Cam%20Fusion%20X&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h500","h4","Spypoint Flex (base)",28,45,"l","2026-10-02","https://www.ebay.com/sch/i.html?_nkw=Spypoint%20Flex&LH_Sold=1&LH_Complete=1","no clean sale price on the page — BASE FLEX ONLY, AND THE ONE SALE IS A CEILING NOT A PRICE. The counter: \"there are also several versions of the camera but what I selected is the base, original version.\" Spypoint sells Flex, Flex-M, Flex-M2, Flex-S, Flex Plus and Flex Dark under the one word Flex and this book has ONE row for all of them. Off the counter’s sold page 2 Oct 2026, exactly one row was a single BASE camera: $50.00 used — and that row reads BEST OFFER ACCEPTED, so on eBay $50.00 is what was ASKED and what was actually paid is hidden and lower. There is no clean sale price for this camera on that page at all. Everything else was a different thing: twin packs ($55 and $85, so $27.50 and $42.50 a camera), a $145 pair of Flex Darks, a $16 rain cover, a $19.43 parts-only body, and a NEW Flex-M at $49.99 — a different model, and the only clean figure on the page. That $49.99 new Flex-M is the CEILING: a used base camera cannot be worth more than a new better one. The band is a judgement between a hidden-offer $50 ask and that ceiling. MOVE IT IF YOU KNOW BETTER.","spypoint flex base original"],
 ["h502","h4","Spypoint Link Micro",26,45,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Spypoint%20Link%20Micro&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h27","Wireless earbuds","Apple AirPods 3rd generation",14,60,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Apple%20AirPods%203rd%20generation&LH_Sold=1&LH_Complete=1","17 listings, asking prices - no sold data",""],
 ["h119","Wireless earbuds","JBL Vibe Beam",20,30,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=JBL%20Vibe%20Beam&LH_Sold=1&LH_Complete=1","27 listings, asking prices - no sold data",""],
 ["h235","Monitor — 27in","Asus TUF VG27AQ",50,150,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Asus%20TUF%20VG27AQ&LH_Sold=1&LH_Complete=1","33 listings, asking prices - no sold data",""],
 ["h308","e4","Samsung Galaxy A13",48,65,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20A13&LH_Sold=1&LH_Complete=1","13 listings, asking prices - no sold data","a-13 a13"],
 ["h328","Video game — current title","Hogwarts Legacy",8,20,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Hogwarts%20Legacy&LH_Sold=1&LH_Complete=1","12 listings, asking prices - no sold data",""],
 ["h330","Video game — sports title","EA Sports College Football 25",8,12,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=EA%20Sports%20College%20Football%2025&LH_Sold=1&LH_Complete=1","12 listings, asking prices - no sold data",""],
 ["h338","e3","Samsung Galaxy Tab S9 FE",210,275,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Tab%20S9%20FE&LH_Sold=1&LH_Complete=1","14 listings, asking prices - no sold data",""],
 ["h345","Gaming laptop","Acer Nitro 5",320,499,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Acer%20Nitro%205&LH_Sold=1&LH_Complete=1","8 listings, asking prices - no sold data",""],
 ["h355","e3","iPad Air 5",280,309,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=iPad%20Air%205&LH_Sold=1&LH_Complete=1","6 listings, asking prices - no sold data",""],
 ["h361","e3","Samsung Galaxy Tab S8",230,270,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Tab%20S8&LH_Sold=1&LH_Complete=1","8 listings, asking prices - no sold data",""],
 ["h365","e3","Samsung Galaxy Tab S9",215,330,"m","2026-09-23","https://www.ebay.com/sch/i.html?_nkw=Samsung%20Galaxy%20Tab%20S9&LH_Sold=1&LH_Complete=1","9 listings, asking prices - no sold data",""],
 ["h377","e2","Dell Latitude 7420",170,180,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Dell%20Latitude%207420&LH_Sold=1&LH_Complete=1","7 listings, asking prices - no sold data",""],
 ["h387","e2","Asus ZenBook 14",400,850,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Asus%20ZenBook%2014&LH_Sold=1&LH_Complete=1","10 listings, asking prices - no sold data",""],
 ["h395","e2","Lenovo Chromebook Flex 5",125,180,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Lenovo%20Chromebook%20Flex%205&LH_Sold=1&LH_Complete=1","6 listings, asking prices - no sold data",""],
 ["h401","e2","Asus Vivobook 15",202,320,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Asus%20Vivobook%2015&LH_Sold=1&LH_Complete=1","6 listings, asking prices - no sold data",""],
 ["h465","f2","Echelon EX-3",250,500,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Echelon%20EX-3&LH_Sold=1&LH_Complete=1","16 listings, asking prices - no sold data",""],
 ["h531","t4","Craftsman CMEC6150",60,88,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Craftsman%20CMEC6150&LH_Sold=1&LH_Complete=1","7 listings, asking prices - no sold data","cmec-6150 cmec6150"],
 ["h533","t4","DeWalt DWFP55126",65,160,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=DeWalt%20DWFP55126&LH_Sold=1&LH_Complete=1","6 listings, asking prices - no sold data","dwfp-55126 dwfp55126"],
 ["h535","t4","Bostitch BTFP02012",120,130,"l","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bostitch%20BTFP02012&LH_Sold=1&LH_Complete=1","5 listings, asking prices - no sold data","btfp-02012 btfp02012"],
 ["h565","h4","Moultrie A-40",27,60,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Moultrie%20A-40&LH_Sold=1&LH_Complete=1","27 listings, asking prices - no sold data","a-40 a40"],
 ["h567","h4","Moultrie Edge",44,67,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Moultrie%20Edge&LH_Sold=1&LH_Complete=1","29 listings, asking prices - no sold data",""],
 ["h569","h4","Stealth Cam G42NG",40,70,"l","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Stealth%20Cam%20G42NG&LH_Sold=1&LH_Complete=1","5 listings, asking prices - no sold data","g-42ng g42ng"],
 ["h572","h4","Tactacam Reveal X",60,147,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Tactacam%20Reveal%20X&LH_Sold=1&LH_Complete=1","25 listings, asking prices - no sold data",""],
 ["h574","h4","Tactacam Reveal SK",60,147,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Tactacam%20Reveal%20SK&LH_Sold=1&LH_Complete=1","26 listings, asking prices - no sold data",""],
 ["h599","p2","Ryobi 40V string trimmer",104,119,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Ryobi%2040V%20string%20trimmer&LH_Sold=1&LH_Complete=1","complete kits only - 4 eBay sales in the last 90 days",""],
 ["h604","p7","Champion 3500 watt generator",279,600,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Champion%203500%20watt%20generator&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h610","t1","DeWalt DCD771",50,55,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=DeWalt%20DCD771&LH_Sold=1&LH_Complete=1","complete kits only - 4 eBay sales in the last 90 days","dcd-771 dcd771"],
 ["h612","t1","DeWalt DCD996",55,80,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=DeWalt%20DCD996&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days","dcd-996 dcd996"],
 ["h614","t1","Milwaukee 2801-20",110,110,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Milwaukee%202801-20&LH_Sold=1&LH_Complete=1","complete kits only - 4 eBay sales in the last 90 days",""],
 ["h616","t1","Milwaukee M12 Fuel 2504",80,85,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Milwaukee%20M12%20Fuel%202504&LH_Sold=1&LH_Complete=1","complete kits only - 4 eBay sales in the last 90 days","fuel-2504 fuel2504 m-12 m12"],
 ["h618","t1","Makita XFD10",81,95,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Makita%20XFD10&LH_Sold=1&LH_Complete=1","complete kits only - 4 listings, asking prices - no sold data","xfd-10 xfd10"],
 ["h620","t1","Makita XPH12",80,120,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Makita%20XPH12&LH_Sold=1&LH_Complete=1","complete kits only - 4 eBay sales in the last 90 days","xph-12 xph12"],
 ["h622","t1","Ryobi P252",25,48,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Ryobi%20P252&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days","p-252 p252"],
 ["h624","t1","Kobalt 24V drill",40,50,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Kobalt%2024V%20drill&LH_Sold=1&LH_Complete=1","14 eBay sales in the last 90 days",""],
 ["h626","t2","Milwaukee 2767-20",199,239,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Milwaukee%202767-20&LH_Sold=1&LH_Complete=1","complete kits only - 7 eBay sales in the last 90 days",""],
 ["h628","t2","DeWalt DCF899",125,150,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=DeWalt%20DCF899&LH_Sold=1&LH_Complete=1","7 eBay sales in the last 90 days","dcf-899 dcf899"],
 ["h630","t2","Ingersoll Rand 2235TiMAX",75,175,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Ingersoll%20Rand%202235TiMAX&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h632","t2","Makita XWT08",180,200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Makita%20XWT08&LH_Sold=1&LH_Complete=1","complete kits only - 4 eBay sales in the last 90 days","xwt-08 xwt08"],
 ["h634","h1","Vortex Crossfire II 3-9x40",80,100,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Crossfire%20II%203-9x40&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h636","h1","Vortex Diamondback 4-12x40",136,165,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Diamondback%204-12x40&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h638","h1","Vortex Viper HS 4-16x44",280,400,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Viper%20HS%204-16x44&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h640","h1","Vortex Strike Eagle 1-6x24",150,225,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Strike%20Eagle%201-6x24&LH_Sold=1&LH_Complete=1","13 eBay sales in the last 90 days",""],
 ["h642","h1","Leupold VX-Freedom 3-9x40",220,250,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Leupold%20VX-Freedom%203-9x40&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h645","h1","Nikon Prostaff 3-9x40",125,175,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Nikon%20Prostaff%203-9x40&LH_Sold=1&LH_Complete=1","25 eBay sales in the last 90 days",""],
 ["h647","h1","Bushnell Banner 3-9x40",35,50,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bushnell%20Banner%203-9x40&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h649","h1","Burris Fullfield II",100,203,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Burris%20Fullfield%20II&LH_Sold=1&LH_Complete=1","15 eBay sales in the last 90 days",""],
 ["h651","h1","Athlon Argos BTR",200,200,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Athlon%20Argos%20BTR&LH_Sold=1&LH_Complete=1","4 eBay sales in the last 90 days",""],
 ["h653","h1","Primary Arms SLx 1-6",210,259,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Primary%20Arms%20SLx%201-6&LH_Sold=1&LH_Complete=1","18 eBay sales in the last 90 days",""],
 ["h656","h2","Nikon Monarch 5 10x42",165,229,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Nikon%20Monarch%205%2010x42&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h658","h2","Bushnell H2O 10x42",32,50,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bushnell%20H2O%2010x42&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h660","h2","Leupold BX-2 Alpine",155,200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Leupold%20BX-2%20Alpine&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days",""],
 ["h663","h3","Vortex Impact 850",125,140,"l","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Vortex%20Impact%20850&LH_Sold=1&LH_Complete=1","5 listings, asking prices - no sold data",""],
 ["h665","h3","Leupold RX-1400i",130,150,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Leupold%20RX-1400i&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days","rx-1400i rx1400i"],
 ["h667","h3","Sig Sauer Kilo 1400",151,190,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Sig%20Sauer%20Kilo%201400&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days","kilo-1400 kilo1400"],
 ["h669","h3","TecTecTec ProWild",45,80,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=TecTecTec%20ProWild&LH_Sold=1&LH_Complete=1","6 listings, asking prices - no sold data",""],
 ["h672","h5","Mathews Phase4",800,1250,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Mathews%20Phase4&LH_Sold=1&LH_Complete=1","17 eBay sales in the last 90 days",""],
 ["h675","h5","Hoyt Carbon RX",855,1390,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Hoyt%20Carbon%20RX&LH_Sold=1&LH_Complete=1","23 eBay sales in the last 90 days",""],
 ["h677","h5","Bowtech Solution",425,650,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bowtech%20Solution&LH_Sold=1&LH_Complete=1","28 eBay sales in the last 90 days",""],
 ["h679","h5","PSE Nock On",650,980,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=PSE%20Nock%20On&LH_Sold=1&LH_Complete=1","8 eBay sales in the last 90 days",""],
 ["h681","h5","Diamond Edge 320",150,300,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Diamond%20Edge%20320&LH_Sold=1&LH_Complete=1","11 eBay sales in the last 90 days","edge-320 edge320"],
 ["h683","h5","Diamond Infinite Edge Pro",165,265,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Diamond%20Infinite%20Edge%20Pro&LH_Sold=1&LH_Complete=1","26 eBay sales in the last 90 days",""],
 ["h685","h5","Bear Species",200,280,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bear%20Species&LH_Sold=1&LH_Complete=1","19 eBay sales in the last 90 days",""],
 ["h687","h5","Bear Cruzer G2",180,250,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Bear%20Cruzer%20G2&LH_Sold=1&LH_Complete=1","25 eBay sales in the last 90 days",""],
 ["h689","h5","Elite Ember",340,460,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Elite%20Ember&LH_Sold=1&LH_Complete=1","10 eBay sales in the last 90 days",""],
 ["h691","h6","TenPoint Turbo M1",451,800,"m","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=TenPoint%20Turbo%20M1&LH_Sold=1&LH_Complete=1","10 listings, asking prices - no sold data",""],
 ["h693","h6","Barnett Whitetail Hunter STR",200,338,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Barnett%20Whitetail%20Hunter%20STR&LH_Sold=1&LH_Complete=1","12 eBay sales in the last 90 days",""],
 ["h695","h6","Barnett Hyper Raptor",375,500,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Barnett%20Hyper%20Raptor&LH_Sold=1&LH_Complete=1","6 eBay sales in the last 90 days",""],
 ["h697","h6","Excalibur Matrix",466,600,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=Excalibur%20Matrix&LH_Sold=1&LH_Complete=1","9 eBay sales in the last 90 days",""],
 ["h699","h6","CenterPoint Sniper 370",150,200,"h","2026-09-24","https://www.ebay.com/sch/i.html?_nkw=CenterPoint%20Sniper%20370&LH_Sold=1&LH_Complete=1","29 eBay sales in the last 90 days",""],
 ["gc5","e5c","Sega Saturn",150,200,"l","2026-09-29","https://www.pricecharting.com/search-products?q=sega+saturn+system&type=prices","Four listings on the whole page — treat the figure as thin"],
 ["gc6","e5c","Sega Dreamcast",140,180,"m","2026-09-29","https://www.pricecharting.com/search-products?q=sega+dreamcast+system&type=prices","Box rarely survived: loose→CIB is only 1.4x, against 2.8x typical"],
 ["gc7","e5c","Super Nintendo (SNES)",95,130,"h","2026-09-29","https://www.pricecharting.com/search-products?q=super+nintendo+system&type=prices","1 sale a day loose. CIB $390"],
 ["gc8","e5c","PlayStation 2",90,120,"h","2026-09-29","https://www.pricecharting.com/search-products?q=playstation+2+system&type=prices","2 sales a week loose. Check the laser with more than one disc"],
 ["gc9","e5c","Xbox (original)",80,110,"m","2026-09-29","https://www.pricecharting.com/search-products?q=original+xbox+system&type=prices","1 sale a week loose. 2001 machine — the clock capacitor leaks"],
 ["gc10","e5c","Nintendo NES",80,110,"h","2026-09-29","https://www.pricecharting.com/search-products?q=nes+system&type=prices","Racketboy $50–160, PriceCharting $94 — two sources agreeing"],
 ["gc11","e5c","Nintendo GameCube",85,115,"m","2026-09-29","https://www.pricecharting.com/search-products?q=gamecube+system&type=prices","Special editions run to $2,499 — look at the colour before you price it"],
 ["gc12","e5c","Nintendo 64",80,110,"h","2026-09-29","https://www.pricecharting.com/search-products?q=nintendo+64+system&type=prices","1 sale a day. Funtastic colours $157–245, Gold $236, Pikachu $390"],
 ["gc13","e5c","Sega Genesis",65,90,"m","2026-09-29","https://www.pricecharting.com/search-products?q=sega+genesis+model+1+system&type=prices","Model 1 $75; Racketboy $40–160 over the same machine"],
 ["gc14","e5c","PlayStation 1 / PSone",50,75,"h","2026-09-29","https://www.pricecharting.com/search-products?q=playstation+system&type=prices","1 sale a day. The box adds almost nothing — 1.3x, PS1s are everywhere"],
 ["gc15","e5d","Game Boy (original)",55,80,"m","2026-09-29","https://www.pricecharting.com/search-products?q=gameboy+system&type=prices","Check the battery terminals for green crust before anything else"],
 ["gc16","e5d","Game Boy Advance SP",50,85,"m","2026-09-29","https://www.pricecharting.com/search-products?q=gameboy+advance+sp+system&type=prices","Pokemon and Pikachu editions $1,000–4,500 CIB — look at the shell"],
 ["gc17","e5d","Nintendo DS / DS Lite",35,60,"m","2026-09-29","https://www.pricecharting.com/search-products?q=nintendo+ds+lite+system&type=prices","The cheapest thing in the aisle and still falling"],
 ["gc18","e5d","Nintendo DSi",55,95,"m","2026-09-29","https://www.pricecharting.com/search-products?q=nintendo+dsi+system&type=prices","Pokemon White DSi is $279 loose, $1,200 CIB"],
 ["gc19","e5d","Sony PSP",55,80,"m","2026-09-29","https://www.pricecharting.com/search-products?q=psp+system&type=prices","US figures thin — the page came back PAL. Look it up before you lend"],
 ["gc20","e5c","Neo Geo AES",600,850,"l","2026-09-30","https://www.pricecharting.com/search-products?q=neo+geo+aes+system&type=prices","Loose measured $816 — the dearest machine in the aisle by far. Two listings on the whole page; look it up, do not price it off this row"],
 ["gc21","e5c","TurboGrafx-16",150,200,"m","2026-09-30","https://www.pricecharting.com/search-products?q=turbografx-16+system&type=prices","Loose $183. The CD add-ons are worth more than the console"],
 ["gc22","e5c","ColecoVision",95,130,"m","2026-09-30","https://www.pricecharting.com/search-products?q=colecovision+system&type=prices","Loose $119"],
 ["gc23","e5c","Intellivision",55,95,"m","2026-09-30","https://www.pricecharting.com/search-products?q=intellivision+system&type=prices","Standard $63, Intellivision II $91 — check which one"],
 ["gc24","e5c","Atari 2600",30,70,"m","2026-09-30","https://www.pricecharting.com/search-products?q=atari+2600+system&type=prices","THE VARIANT IS THE PRICE: Vader $31, Junior $47, Light Sixer $48, Woody $65, Heavy Sixer $174. Six switches on the front means look it up"],
 ["gc25","e5d","Game Boy Color",60,85,"m","2026-09-30","https://www.pricecharting.com/search-products?q=gameboy+color+system&type=prices","Plain colours $66–80. Pokemon and Tommy Hilfiger editions $120–136 loose and over $1,000 boxed"],
 ["gc26","e5d","Game Boy Advance",45,85,"m","2026-09-30","https://www.pricecharting.com/search-products?q=gameboy+advance+system&type=prices","Original, not the SP. Platinum $42, most colours $50–85"],
 ["gc27","e5d","Sega Game Gear",55,90,"l","2026-09-30","https://www.pricecharting.com/search-products?q=sega+game+gear+system&type=prices","THIN: the only figure found was a $137 bundle with Super Columns, so this range is a read, not a measurement. Look it up"],
 ["gc28","Handheld game console","Nintendo 3DS",120,170,"m","2026-09-30","https://www.pricecharting.com/search-products?q=nintendo+3ds+system&type=prices","Plain 3DS $135–170; the XL and New 3DS XL are dearer and have their own rows"]
];
/* =================================================================================== */

/* how each row is recognized from the brand, model and details typed.
   First match wins, so the specific models sit above the general ones. */
const MP_MATCH=[
 /* THE CONSOLES HAD TO BE WRITTEN BY HAND, and the reason is worth saying
    because it is not obvious: mpAuto matches a bulk row on its own name,
    but only on "a token with a digit in it". Most of this aisle has no
    digit anywhere. Dreamcast, Saturn, Genesis, GameCube, NES, Game Boy -
    none of them would ever have matched, and typing "dreamcast" would have
    fallen through to the category and priced a $162 machine off the class
    figure. The ones that DO carry a number (Nintendo 64, PlayStation 2)
    are here anyway, because "n64" and "ps2" are what gets typed and neither
    is the row's spelling.
    Order matters only within one item, and where it does it is deliberate:
    SNES before NES, Wii U before Wii, DSi before DS, Advance before Game
    Boy. The item gate above (r[1] must be the row being priced) is what
    keeps a bare /xbox/ on the original machine from stealing a Series X. */
 ["gc7",/super\s*nintendo|\bsnes\b|super\s*nes/],["gc10",/\bnes\b|nintendo\s*entertainment/],
 ["gc12",/\bn\s*-?\s*64\b|nintendo\s*64/],["gc11",/game\s*cube|\bgcn\b/],
 ["gc6",/dream\s*cast/],["gc5",/\bsaturn\b/],["gc13",/\bgenesis\b|mega\s*drive/],
 ["gc8",/\bps\s*-?\s*2\b|playstation\s*2/],["gc14",/\bps\s*-?\s*(1|x)\b|playstation\s*(1|one)\b|\bpsone\b/],
 ["gc9",/\bxbox\b/],
 ["h156",/wii\s*u\b|\bwiiu\b/],["h158",/\bwii\b(?!\s*u)/],
 ["h154",/\bps\s*-?\s*3\b|playstation\s*3/],["h152",/\b360\b/],
 ["gc18",/\bdsi\b/],
 /* SP AND COLOUR ARE THEIR OWN MACHINES, and these two patterns used to
    swallow them. "game boy advance" hit the SP row because gc16 matched a
    bare "advance", and "game boy color" hit the original DMG because
    gc15's only exclusion was "advance". A Game Boy Color is $70 and a
    plain Game Boy is $66, so the money barely moved - but a GBA SP and a
    GBA are different machines and the counter would have been reading the
    wrong name back off the card. Caught by typing all ten names in, not by
    reading the list. */
 ["gc16",/game\s*boy\s*advance\s*sp\b|\bgba\s*sp\b/],
 ["gc26",/game\s*boy\s*advance\b|\bgba\b/],
 ["gc25",/game\s*boy\s*colou?r\b|\bgbc\b/],
 ["gc15",/game\s*boy(?!\s*(advance|colou?r))|\bdmg\b/],
 ["gc17",/\bds\s*lite\b|\bndsl?\b|nintendo\s*ds\b/],
 ["gc19",/\bpsp\b|playstation\s*portable/],
 /* THE SECOND BATCH, and the same reason the first needed hand-written
    patterns: mpAuto matches a bulk row on a token containing a DIGIT, and
    Neo Geo, TurboGrafx, ColecoVision, Intellivision and Game Gear have
    none. Atari 2600 and Game Boy Color do, but "2600" and "color" are not
    how they get typed. */
 ["gc20",/\bneo\s*geo\b|\baes\b/],["gc21",/turbo\s*graf?x|\btg\s*-?16\b|\bpc\s*engine\b/],
 ["gc22",/\bcoleco\s*vision\b|\bcoleco\b/],["gc23",/\bintellivision\b|\bintv\b/],
 ["gc24",/\batari\b/],
 ["gc27",/game\s*gear\b/],["gc28",/\b3ds\b(?!\s*xl)|nintendo\s*3ds/],
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
 ["b7",/p\s*365/],["b8",/p\s*320/],["b9a",/p\s*226\b/],["b9b",/p\s*229\b/],["b12",/bodyguard/],["b11",/shield/],["b10",/m&p/],
 ["b13",/hellcat/],["b14",/\bxd[sme]?\b/],["b15",/\bg[23]c\b/],["b16",/\bg3x?\b|\bgx4\b/],["b17",/\blcp\b/],["b18",/security\s*-?\s*9|max\s*-?\s*9/],
 ["b19",/mark\s*iv|22\s*\/\s*45/],["b20",/canik|\btp\s*-?\s*9/],["b21a",/\bp\s*-?\s*10\b/],["b21b",/cz\s*75|shadow\s*2|sp\s*-?\s*01/],
 ["b22",/beretta.*\b92|\b92\s*fs\b|\bm9\b/],["b23",/\b1911\b/],["b24",/hi-?\s*point|\bc9\b/],["b25",/sccy|\bcpx/],
 ["b26",/\b686\b/],["b27",/\b64[2]\b|\b63[78]\b/],["b28",/gp\s*-?\s*100/],["b29",/sp\s*-?\s*101/],["b30",/\blcr/],["b31a",/blackhawk/],["b31b",/single\s*-?\s*six|\bsingle\s*6\b/],
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

/* ONE ITEM, ONE PRICE, EVEN WHEN TWO SITES ANSWERED.
   Reported from the counter, with a screenshot of a Tactacam Reveal X
   listed twice: $50-$75 from trailcampro and $60-$147 from eBay, four days
   apart. "Why does the same item have 2 different prices? Our tool should
   review both sites or more if available, then determine a single
   suggested price."

   It should, and the reason it did not is the harvest's merge key, which
   is ref + name. The hand-researched row was filed against the item
   ("h4|Cellular game camera") and the harvested one against the aisle
   ("h4"), so to the merge they were never the same thing and both were
   kept. Eleven items in the book are doubled this way, 23 rows in all.

   The rule is the OVERLAP, not the average. Two independent estimates of
   the same thing are far stronger where they agree than either is alone,
   and an average invents a number neither source ever claimed. Measured
   over all eleven: eight pairs are identical and pass through untouched,
   the Switch Lite's three sources narrow 95-130/95-109/91-105 to 95-105,
   the PS5 narrows to 400-449, and the Tactacam lands at 60-75. Nothing
   moved outside what a source actually said.

   When the bands do NOT overlap the sources genuinely disagree, and
   pretending otherwise is how you lend on a number nobody stands behind.
   Then it spans them and drops the confidence a step, so the guard on the
   item page reads it as the soft evidence it is.

   Asks run high and high is the wrong way to be wrong when the money is
   going out, so the merged note keeps the weakest reading of the evidence
   rather than the flattering one. */
function mpFold(rows){
  if(!Array.isArray(rows))return rows;
  const CONF={l:0,m:1,h:2}, UNCONF=["l","m","h"];
  const g=new Map();
  for(const r of rows){
    const k=omniNorm(r[2]||"");
    if(!k){ g.set("\u0000"+g.size,[r]); continue; }
    (g.get(k)||g.set(k,[]).get(k)).push(r);
  }
  const out=[];
  for(const v of g.values()){
    if(v.length===1){ out.push(v[0]); continue; }
    const lo=Math.max(...v.map(r=>r[3])), hi=Math.min(...v.map(r=>r[4]));
    const agree=lo<=hi;
    const m=v.slice().sort((a,b)=>String(b[6]||"").localeCompare(String(a[6]||"")))[0].slice();
    m[3]=agree?lo:Math.min(...v.map(r=>r[3]));
    m[4]=agree?hi:Math.max(...v.map(r=>r[4]));
    /* agreement corroborates, it does not upgrade hearsay to a sale - the
       best input's confidence, never better than that; disagreement costs
       a step */
    let c=UNCONF[Math.max(...v.map(r=>CONF[r[5]]==null?1:CONF[r[5]]))]||"m";
    if(!agree)c=UNCONF[Math.max(0,(CONF[c]||1)-1)];
    m[5]=c;
    /* every aisle and item any copy was filed under still finds it */
    m[1]=[...new Set(v.flatMap(r=>String(r[1]||"").split("|")).filter(Boolean))].join("|");
    const sites=[...new Set(v.map(r=>srcName(r[7])).filter(Boolean))];
    m[7]=v.map(r=>r[7]).filter(Boolean)[0]||m[7];
    const worst=v.slice().sort((a,b)=>(CONF[a[5]]??1)-(CONF[b[5]]??1))[0];
    m[8]=(agree
      ? sites.join(" and ")+" agree where they overlap"
      : sites.join(" and ")+" DISAGREE \u2014 this spans both")
      +(worst&&worst[8]?" \u2014 "+worst[8]:"");
    m[9]=sites.join(", ");
    out.push(m);
  }
  return out;
}
/* Fold the shipped list too, not only the fetched one. The duplicates are
   in both copies - they are the same book - and a tool that only dedupes
   after a successful network call shows two prices to anybody offline. */
MODEL_PRICES=mpFold(MODEL_PRICES);
/* Every id that went into a merged row still resolves to it, so nothing
   holding an id from before the fold lands on nothing. */
function mpIndex(rows,src){
  const ix={};
  for(const r of rows) ix[r[0]]=r;
  for(const r of src||[]) if(!ix[r[0]]){
    const m=rows.find(x=>omniNorm(x[2])===omniNorm(r[2])); if(m)ix[r[0]]=m;
  }
  return ix;
}
let MP_BY_ID=mpIndex(MODEL_PRICES);
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
    MODEL_PRICES=mpFold(rows);
    MP_BY_ID=mpIndex(MODEL_PRICES,rows);
    /* Same rule as the rows: a malformed map must never wipe the book, so
       only the entries that look like a price are taken and the rest of
       the file is ignored rather than the whole load being refused. */
    const bk=j&&j.book;
    if(bk&&typeof bk==="object"&&!Array.isArray(bk)){
      const clean={};
      for(const k of Object.keys(bk)){
        const v=Number(bk[k]);
        if(typeof k==="string"&&k&&v>0&&v<1000000)clean[k]=Math.round(v);
      }
      BOOK_PRICES=clean;
    }
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
  &&j.sheets.every(x=>x&&typeof x.id==="string"&&Array.isArray(x.checks)&&Array.isArray(x.match)
    &&(x.steps===undefined||Array.isArray(x.steps)))); }
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
const SPEC_GROUPS=[["silver","Silver bullion"],["gold","Gold bullion"],["us","US silver coins"],["watch","Watch cases"],["karat","Jewelry \u2014 by density"]];
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
 {id:"exp",   grp:"watch", name:"Rolex Explorer 214270",            d:39.0, lug:20, g:null, metal:"904L steel"},

 /* ---- KARAT JEWELRY, BY DENSITY ONLY ---------------------------------
    A ring has no spec weight and no spec diameter - there is nothing to
    compare a chain against. But density is not a product specification,
    it is arithmetic on the alloy, and it is the same for every piece ever
    made to that karat. Weigh it dry, weigh it hanging in water, divide.

    This is the one that matters most by volume: jewelry is the counter's
    daily business, and plated brass is the fake that walks in. Brass
    reads 8.5 where 14k reads 13.2 - not a close call, not a judgement,
    a third of the way out.

    The figures are the standard density ranges for the common trade
    alloys, quoted as the middle of the range; the 3% tolerance this file
    already uses covers the rest of it, and each row prints its own range
    so the counter can see what the number is being asked to sit inside.
    White golds run a little higher than yellow when they carry palladium,
    which is why the white rows are separate and say so. */
 {id:"k10",  grp:"karat", name:"10k gold (417)",        g:null,d:null,t:null, sg:11.50, metal:"10k, 41.7% gold",
              note:"Range 11.4-11.6. Solid, plain metal only - see the warning on the card."},
 {id:"k14",  grp:"karat", name:"14k gold (585)",        g:null,d:null,t:null, sg:13.25, metal:"14k, 58.5% gold",
              note:"Range 12.9-13.6 yellow. Plated brass reads about 8.5 - nowhere near."},
 {id:"k14w", grp:"karat", name:"14k white gold (585)",  g:null,d:null,t:null, sg:13.70, metal:"14k white",
              note:"Range 13.1-14.2 - white alloys vary most, nickel low and palladium high."},
 {id:"k18",  grp:"karat", name:"18k gold (750)",        g:null,d:null,t:null, sg:15.55, metal:"18k, 75% gold",
              note:"Range 15.2-15.9 yellow."},
 {id:"k18w", grp:"karat", name:"18k white gold (750)",  g:null,d:null,t:null, sg:15.90, metal:"18k white",
              note:"Range 14.7-16.9 - the widest of them. A pass here proves less than a pass on yellow."},
 {id:"k22",  grp:"karat", name:"22k gold (916)",        g:null,d:null,t:null, sg:17.75, metal:"22k, 91.6% gold",
              note:"Range 17.7-17.8."},
 {id:"k24",  grp:"karat", name:"24k / pure gold (999)", g:null,d:null,t:null, sg:19.32, metal:"pure gold",
              note:"19.32 exactly. Tungsten reads 19.25 - see the warning below."},
 {id:"ster", grp:"karat", name:"Sterling silver (925)", g:null,d:null,t:null, sg:10.36, metal:".925 silver",
              note:"Silver-plated nickel reads about 8.9, steel 7.9."},
 {id:"fines",grp:"karat", name:"Fine silver (999)",     g:null,d:null,t:null, sg:10.49, metal:".999 silver"},
 {id:"plat", grp:"karat", name:"Platinum (950)",        g:null,d:null,t:null, sg:20.10, metal:"950 platinum",
              note:"Range 20.0-20.3. Nothing else in the case is this heavy for its size."},
 {id:"pall", grp:"karat", name:"Palladium (950)",       g:null,d:null,t:null, sg:12.00, metal:"950 palladium",
              note:"Range 11.9-12.1 - close to 14k gold, so this one does NOT tell those two apart."}
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
  /* WHICH TABLE THIS SHEET GETS. It used to be the metal screen's own
     metal that chose, which works on bullion and nowhere else: on the
     jewelry sheet it offered coin rows, and on any item sheet it would
     have offered gold bullion to somebody holding a drill battery. The
     sheet knows what is on the counter; it chooses. */
  const SHEET_GRP={jewelry:["karat"], watch:["watch","karat"], bullion:null};
  /* AND NO NUMBERS CARD AT ALL ON A SHEET WITH NOTHING TO CHECK. This
     used to fall through to the metal screen's own metal, which is
     whatever was last priced and defaults to gold - so the Pokemon card
     sheet and the autograph sheet both offered "Gold bullion / Gold Eagle
     1 oz" and a box for its diameter. A table of coin specs on a trading
     card is not a harmless extra: it is the desk offering to check
     something it cannot check. */
  if(!sh||!Object.prototype.hasOwnProperty.call(SHEET_GRP,sh.id))return "";
  const byS=SHEET_GRP[sh.id];
  const densityOnly=!!(byS&&byS.length===1&&byS[0]==="karat");
  /* ONE METAL AT A TIME.
     This listed every group on every job, so buying a gold Eagle you
     scrolled a table of Silver bullion and US silver coins to reach the
     one row you wanted - "if I'm buying gold, I don't need a big box with
     the silver price in the middle of the workflow". The bullion card is
     1379px on a phone and nine of its mentions were the other metal.
     Watch cases stay on both: a watch case is a watch case. */
  const MET_GRP={gold:["gold","watch","karat"],silver:["silver","us","watch","karat"]};
  const keep=byS||MET_GRP[st.metal]||null;
  const opts=SPEC_GROUPS.filter(([g])=>!keep||keep.indexOf(g)>=0).map(([g,label])=>{
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
    /* The tungsten note follows GOLD, not the table it was picked from -
       a 24k bangle has the same problem a 1 oz bar does. */
    const isGold=sp.grp==="gold"||(sp.grp==="karat"&&/gold/i.test(sp.name)),
          isWatch=sp.grp==="watch", isKarat=sp.grp==="karat";
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
                      :isKarat?" Density is the alloy, not a maker's choice \u2014 but read the note above before calling it: a hollow piece or a stone in it reads light for honest reasons."
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
    ${/* A CHAIN HAS NO SPEC DIAMETER. On the jewelry table the only two
          boxes that mean anything are the two weights, and showing a
          caliper field next to them invites a measurement that gets
          compared to nothing. */""}
    ${densityOnly||(sp&&sp.grp==="karat")?`
    <div class="tagWarn" style="margin-top:10px;font-size:12.5px"><b>Solid, plain metal only.</b> A stone, a hollow chain, a spring clasp or solder all make a real piece read light \u2014 that is the piece, not a fake. Weigh a plain band, a solid link, or nothing at all. Light on a hollow rope proves nothing; light on a solid band is worth acid.</div>
    <div class="row2" style="margin-top:10px;flex-wrap:wrap;gap:8px">
      <label style="flex:1;min-width:120px"><span class="label">Weight, dry (g)</span>
        <input id="spec_g" class="numIn" type="number" inputmode="decimal" step="0.001" value="${esc(String(inp.g||""))}" placeholder="8.40"></label>
      <label style="flex:1;min-width:120px"><span class="label">Weight in water (g)</span>
        <input id="spec_w" class="numIn" type="number" inputmode="decimal" step="0.001" value="${esc(String(inp.w||""))}" placeholder="7.76"></label>
    </div>`:`
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
    </div>`}
    <div class="cardHint" style="font-size:12.5px;margin-top:5px">For <b style="color:var(--ink)">weight in water</b>: hang it on thread in a cup of water so it touches nothing, and read the scale. That gives the density, which is what most fakes cannot copy.</div>
    ${out}
  </details>`;
}
/* ---- WEIGH ONE YOU KNOW IS REAL ---------------------------------------
   The numbers card above works because a mint publishes what a coin
   weighs. Nobody publishes a trustworthy figure for a Milwaukee M18 pack,
   a sealed PSA slab or an AirPods case - the numbers that circulate are
   forum hearsay, and a hearsay figure in a pricing tool is worse than no
   figure, because it will be believed. I am not putting invented specs in
   a book that decides what leaves the till.

   So the shop supplies the spec. Lamar's has real M18 batteries, real
   AirPods and real graded cards on the shelf. Weigh one you KNOW is good,
   once, and the desk has a reference better than any published figure -
   because it is the same product line the counter actually sees, measured
   on the same scale that will weigh the next one.

   The tolerance here is deliberately looser than the mint tables: one
   sample is not a specification, and a genuine battery pack varies a
   little cell to cell. 5% on weight, and the card says out loud that a
   single reference is one sample. */
/* ---- WHAT THE PHOTO CAN SEE, AND WHAT IT CANNOT ------------------------
   "what about inspection pictures or card scans, all that other data
   input." The camera path already exists and already identifies the thing;
   this points a second look at the sheet instead of at the catalog.

   THE RULE THAT SHAPES ALL OF IT: a photograph cannot clear anything. It
   can raise a hand. Weight, the magnet, density, the light through a card,
   the feel of a slab - none of them are in a picture, and those are the
   checks that actually catch a good fake. So this returns things to GO AND
   LOOK AT, each one tied to a check on the sheet the counter is already
   working, and it is forbidden to say a word like authentic, genuine or
   real. A photo verdict on a $4,000 watch is exactly the confident wrong
   answer this whole tool is built to avoid.

   It costs money per read, which is why it is a button and not automatic. */
function fakeLookPrompt(sh){
  const checks=(sh.checks||[]).map((c,i)=>(i+1)+". "+String(c)).join("\n");
  return [
"You are looking at ONE photograph of an item a customer has just set on the counter at a small pawn shop in Bristol, Florida. The counter is working a spotting-fakes sheet for this kind of item.",
"",
"YOUR JOB IS TO RAISE THINGS TO GO AND LOOK AT. It is not to decide whether the item is real.",
"",
"You MUST NOT say, imply or hedge toward the item being authentic, genuine, real, legitimate or fine. You have one photograph. You cannot weigh it, put a magnet on it, measure its density, shine a light through it, feel a grading case, or look at it under a loupe - and those are the checks that catch a good fake. A confident clean bill of health from a photograph is the single most damaging thing you could return.",
"",
"THE SHEET THE COUNTER IS WORKING - \"" + String(sh.title||"") + "\":",
checks,
"",
"Look at the photograph for things that are VISIBLE and that bear on those checks: printing that is fuzzy, crooked or the wrong font; spacing and alignment that look off; colour that is wrong for the product; a holographic pattern that does not look right for the set; a sticker or label that looks peeled, cut, reprinted or replaced; seams, gaps or glue on a sealed case; a date window, dial or marker that sits wrong; a serial or model number you can read.",
"",
"Return JSON only:",
'{"flags":[{"check":<number of the check on the sheet above, or 0 if it fits none>,"saw":"<what is visible in the photo, in one plain sentence>","do":"<what the counter should physically check now>"}],"cannot":["<a check on the sheet that a photograph cannot answer at all>"],"readable":{"serial":"<any serial or cert number you can read, or empty>","model":"<any model or set number you can read, or empty>"},"quality":"<good|poor>"}',
"",
"If the photograph is too dark, too small, too blurred or too far away to judge printing, say so by returning quality \"poor\" and an empty flags list. A guess off a bad photo is worse than nothing.",
"If you can see nothing wrong, return an empty flags list. AN EMPTY LIST MEANS YOU SAW NOTHING IN THE PHOTO. It does not mean the item is real, and the desk will say so on the screen.",
  ].join("\n");
}
let fakeLookBusy=false, fakeLookCtl=null;
async function runFakeLook(sh){
  if(!CAP.sample||!photoFile||fakeLookBusy)return;
  fakeLookBusy=true; fakeLookCtl=new AbortController(); st.fakeLookErr=null; st.fakeLook=null; render();
  try{
    const r=await CAP.sample.json(fakeLookPrompt(sh),{images:photoFile,modelTier:"default",signal:fakeLookCtl.signal});
    fakeLookBusy=false;
    st.fakeLook=Object.assign({sheet:sh.id,at:Date.now()},r||{});
  }catch(err){
    fakeLookBusy=false;
    st.fakeLookErr=(err&&err.code==="cancelled")?null:"The read did not come back. Work the sheet by hand.";
  }
  render();
}
function fakeLookHTML(sh){
  if(!CAP.sample||!CAP.images)return "";
  const have=!!photoFile;
  const r=(st.fakeLook&&st.fakeLook.sheet===sh.id)?st.fakeLook:null;
  const flags=(r&&Array.isArray(r.flags))?r.flags:[];
  const poor=r&&r.quality==="poor";
  return `<div style="margin-top:12px">
    <span class="label">Look at the photo for tells</span>
    <div class="cardHint" style="margin-top:0;font-size:12.5px">${have
      ? "Reads the picture you just took against this sheet. It costs a service call, so it is a button. <b style=\"color:var(--ink)\">It cannot clear anything</b> — no photograph can weigh it, magnet it or shine a light through it."
      : "Take a picture of it first and this will read that picture against this sheet."}</div>
    <div class="row2" style="margin-top:7px">
      <button class="ghostBtn" id="fakeLookGo" style="padding:9px 15px"${have&&!fakeLookBusy?"":" disabled"}>${fakeLookBusy?"Looking…":"Look at the photo"}</button>
      ${fakeLookBusy?`<button class="ghostBtn" id="fakeLookStop" style="padding:9px 15px">Stop</button>`:""}
    </div>
    ${st.fakeLookErr?`<div class="cardHint" style="margin-top:7px;font-size:13px;color:var(--bad-ink)">${esc(st.fakeLookErr)}</div>`:""}
    ${r?`<div style="margin-top:9px">
      ${/* THE LIMIT HAS TO RIDE THE RESULT. It was written into the line
            above the button, which is replaced by the result the moment
            there is one - so the sentence saying a photograph cannot
            clear anything disappeared at exactly the moment somebody was
            reading a photograph's answer. Caught by the suite. */""}
      <div class="cardHint" style="font-size:12.5px;margin-bottom:2px"><b style="color:var(--ink)">A photograph cannot clear anything.</b> It has not weighed it, magneted it, or shone a light through it.</div>
      ${poor?`<div class="tagWarn" style="font-size:12.5px"><b>That picture is not good enough to judge printing.</b> Closer, flatter, more light — or skip it and work the sheet by hand.</div>`:""}
      ${flags.length?flags.map(f=>{
        const n=Number(f.check)||0;
        return `<div class="cardHint" style="margin-top:6px;font-size:13px">
          <b style="color:var(--warn-ink)">⚠</b> ${esc(String(f.saw||""))}
          ${f.do?`<br><b style="color:var(--ink)">Now check:</b> ${esc(String(f.do))}`:""}
          ${n>0&&sh.checks[n-1]?`<br><span style="opacity:.8">That is check ${n} on this sheet.</span>`:""}</div>`;
        }).join("")
        :poor?"":`<div class="cardHint" style="margin-top:6px;font-size:13px"><b style="color:var(--ink)">Nothing visible in the photo.</b> That is not a pass. It means the picture showed nothing wrong — the checks above are still the ones that decide.</div>`}
      ${(r.readable&&(r.readable.serial||r.readable.model))?`<div class="cardHint" style="margin-top:7px;font-size:13px"><b style="color:var(--ink)">Read off it:</b> ${esc([r.readable.serial,r.readable.model].filter(Boolean).join(" · "))} — type that into the free lookup yourself.</div>`:""}
      ${(r.cannot&&r.cannot.length)?`<div class="cardHint" style="margin-top:7px;font-size:12.5px"><b style="color:var(--ink)">A photo cannot answer:</b> ${esc(r.cannot.slice(0,3).join("; "))}</div>`:""}
    </div>`:""}
  </div>`;
}
const REF_SHEETS={
  cards:  {label:"graded slabs and raw cards", unit:"g", hint:"A sealed PSA/BGS slab, or a raw card you are sure of. Weigh the slab as it comes."},
  battery:{label:"tool battery packs",         unit:"g", hint:"A pack you bought new or know the history of. Note the voltage and amp-hours in the name."},
  apple:  {label:"AirPods, watches, phones",   unit:"g", hint:"Case with the buds in it, or the bare unit - whichever you will weigh next time. Say which in the name."},
  optics: {label:"red dots and scopes",        unit:"g", hint:"Without the mount unless you always weigh it with the mount. Say which in the name."}
};
const REF_TOL=0.05;
function refList(sheetId){ const r=st.refs&&st.refs[sheetId]; return Array.isArray(r)?r:[]; }
function refAdd(sheetId,name,g){
  const w=Number(g)||0, n=String(name||"").trim().slice(0,48);
  if(!n||!(w>0))return false;
  if(!st.refs)st.refs={};
  const list=refList(sheetId).slice();
  const at=(typeof todayStr==="function")?todayStr():"";
  const i=list.findIndex(z=>z.name.toLowerCase()===n.toLowerCase());
  if(i>=0)list[i]={name:n,g:w,at}; else list.push({name:n,g:w,at});
  st.refs[sheetId]=list.slice(0,40); persist(); return true;
}
function refDel(sheetId,name){
  if(!st.refs)return;
  st.refs[sheetId]=refList(sheetId).filter(z=>z.name!==name);
  persist();
}
function refJudge(ref,v){
  if(!ref||!(v>0)||!(ref.g>0))return null;
  const off=v-ref.g, pct=off/ref.g*100, tol=ref.g*REF_TOL;
  return {v,want:ref.g,off,pct,ok:Math.abs(off)<=tol,tol};
}
function refCardHTML(sh){
  const cfg=sh?REF_SHEETS[sh.id]:null; if(!cfg)return "";
  const list=refList(sh.id);
  const pick=(st.refPick&&st.refPick[sh.id])||"";
  const ref=list.find(z=>z.name===pick)||null;
  const v=Number((st.refIn&&st.refIn[sh.id])||0);
  const j=refJudge(ref,v);
  const rows=list.length
    ? list.map(z=>`<div class="cardHint" style="display:flex;align-items:baseline;gap:8px;margin-top:5px;font-size:13px">
        <button class="${z.name===pick?"on":""}" style="flex:1;text-align:left;border:none;background:none;padding:0;cursor:pointer;color:${z.name===pick?"var(--accent)":"var(--ink-2)"};font:inherit" data-refpick="${esc(sh.id)}:${esc(z.name)}">
          <b style="color:var(--ink)">${esc(z.name)}</b> &mdash; ${z.g} g${z.at?" &middot; "+esc(fmtDay(z.at)):""}</button>
        <button class="ghostBtn" style="padding:2px 8px;font-size:11px" data-refdel="${esc(sh.id)}:${esc(z.name)}">Remove</button></div>`).join("")
    : `<div class="cardHint" style="margin-top:5px;font-size:13px">Nothing recorded yet. There is nothing to compare against until you weigh one.</div>`;
  return `<details class="fold" style="margin-top:12px"${st.refOpen?" open":""} id="refFold">
    <summary class="foldLine">Weigh one you know is real &mdash; ${esc(cfg.label)}</summary>
    <div class="cardHint" style="margin-top:8px;font-size:13px">Nobody publishes a figure for these that is worth trusting, so the shop supplies it. Weigh one you are sure of, once. After that the desk can tell you when the next one is out. <b style="color:var(--ink)">One sample is not a specification</b> &mdash; it is a good reference, and it is allowed to be 5% out before this says anything.</div>
    <div class="cardHint" style="margin-top:6px;font-size:12.5px">${esc(cfg.hint)}</div>
    <span class="label" style="margin-top:10px">Your references</span>
    ${rows}
    <div class="row2" style="margin-top:9px;flex-wrap:wrap;gap:8px">
      <label style="flex:2;min-width:150px"><span class="label">What is it</span>
        <input id="refName" class="numIn" type="text" maxlength="48" value="${esc(String((st.refName&&st.refName[sh.id])||""))}" placeholder="M18 5.0Ah XC"></label>
      <label style="flex:1;min-width:110px"><span class="label">Weighs (g)</span>
        <input id="refG" class="numIn" type="number" inputmode="decimal" step="0.1" value="${esc(String((st.refG&&st.refG[sh.id])||""))}" placeholder="1032"></label>
      <button class="ghostBtn" id="refSave" style="align-self:flex-end;padding:9px 15px" data-refsave="${esc(sh.id)}">Record it</button>
    </div>
    ${list.length?`<span class="label" style="margin-top:12px">Check the one on the counter</span>
    <div class="cardHint" style="margin-top:0;font-size:12.5px">${ref?`Comparing against <b style="color:var(--ink)">${esc(ref.name)}</b>. Tap another above to switch.`:"Tap one of your references above first."}</div>
    <label style="display:block;margin-top:7px"><span class="label">This one weighs (g)</span>
      <input id="refIn" class="numIn" type="number" inputmode="decimal" step="0.1" style="width:100%" value="${esc(String((st.refIn&&st.refIn[sh.id])||""))}" placeholder="0"></label>
    ${j?`<div class="cardHint" style="margin-top:7px;font-size:13px">
      <b style="color:${j.ok?"var(--accent)":"var(--bad)"}">${j.ok?"✓":"✗"}</b> You measured <b style="color:var(--ink)">${j.v}</b> g against your own <b style="color:var(--ink)">${j.want}</b> g (${j.pct>=0?"+":""}${j.pct.toFixed(1)}%).
      ${j.ok?"Within 5% of the one you know. That rules out a pack built on cheaper cells or a card on the wrong stock - it does not rule out a careful copy."
            :"Out by more than 5%. On batteries that is usually fewer or cheaper cells inside; on a slab it is the wrong plastic. Work the checks above before you pay."}</div>`:""}`:""}
  </details>`;
}
const FAKE_BTN=[["pass","Pass"],["unsure","Not sure"],["fail","Fail"]];
function fakeCardHTML(x){
  const sh=fakeSheet(x); if(!sh)return "";
  const F=fakeState(sh), a=fakeAns(sh.id);
  const tone=F.verdict==="fail"?"var(--bad)":F.verdict==="clear"?"var(--accent)":F.verdict==="unsure"?"var(--warn-ink)":"var(--ink-3)";
  const head=sh.gate
    ? (F.verdict==="open"?`<b>No price until this is checked.</b> ${F.done} of ${F.n} done.`
      :F.verdict==="fail"?`<b style="color:var(--bad-ink)">A check failed.</b> Don't lend on the name.`
      :F.verdict==="unsure"?`<b style="color:var(--warn-ink)">Not proven.</b> Price only what you can verify.`
      :`<b style="color:var(--accent)">All ${F.n} checks pass.</b>`)
    : `Worth a look &mdash; this one advises, it does not hold the price. ${F.done} of ${F.n} done.`;
  /* CLOSED UNTIL HE TAPS IT, UNLESS IT IS HOLDING THE PRICE.
     "yes close it until i tap it." It was 261 words sitting open on the
     gold screen, the largest single thing left on the wordiest screen in
     the tool, and most days it is advice rather than a question.

     BUT NOT ALWAYS, AND THE DIFFERENCE IS THE WHOLE OF THIS. Of the
     eleven sheets, four gate: bullion, watch, cards, apple. A gating
     sheet is the reason there is no price on the screen, so folding that
     one shut would hide the thing doing the blocking and leave him
     looking at a card that says nothing while the desk refuses to quote.
     On the gold screen both live one tab apart - Jewelry advises, Coin or
     bar gates.

     So it opens itself when it is gating, and when any check has been
     answered. A closed card can therefore never be hiding a failed check
     or a held price: a failed check has an answer on it, and an answer
     forces it open. What it can hide is advice nobody has touched, which
     is what he asked for.

     The summary carries the state either way, so the shut card still says
     how many checks are done and still wears the colour of its verdict. */
  const started=F.done>0;
  const open=!!(sh.gate||started||st.openFakes);
  return `<details class="card foldCard" id="fakeCard" style="border-left:3px solid ${tone}"${open?" open":""}>
    <summary><span class="label" style="margin:0">Spotting fakes &middot; ${esc(sh.title)}</span><span class="foldSub">${
      sh.gate?`holds the price &middot; ${F.done} of ${F.n} done`
      :started?`${F.done} of ${F.n} done`
      :`${F.n} check${F.n===1?"":"s"} &mdash; what gets faked, and how to tell`}</span></summary>
    ${st.mode==="metal"?`<div class="pills mb14" style="border-radius:var(--r-s);margin-top:6px">
      <button class="${st.metalKind!=="bullion"?"on":""}" style="flex:1;padding:8px 6px;font-size:11.5px" data-mkind="jewelry">Jewelry</button>
      <button class="${st.metalKind==="bullion"?"on":""}" style="flex:1;padding:8px 6px;font-size:11.5px" data-mkind="bullion">Coin or bar</button>
    </div>`:""}
    <div class="cardHint" style="margin-top:0;font-size:13.5px;color:var(--ink-2)">${esc(sh.why||"")}</div>
    <div class="cardHint" style="font-size:13.5px">${head}</div>
    ${(sh.steps||[]).map(t=>`<div class="fakeRow"><div class="fakeQ" style="color:var(--ink-2)">${esc(t)}</div></div>`).join("")}
    ${sh.checks.map((c,i)=>`<div class="fakeRow${a[i]?" done":""}">
      <div class="fakeQ">${esc(c)}</div>
      <div class="pills" style="border-radius:var(--r-s);margin-top:6px">${FAKE_BTN.map(([v,l])=>
        `<button class="${a[i]===v?"on "+v:""}" style="flex:1;padding:7px 5px;font-size:11px" data-fake="${sh.id}:${i}:${v}">${l}</button>`).join("")}</div>
    </div>`).join("")}
    ${sh.lookup.length?`<span class="label" style="margin-top:10px">Look it up free</span>
      <div class="cardHint" style="margin-top:0;font-size:13px">Type the address in yourself. Never scan a QR code on a holder or tag &mdash; fake cases point at copycat sites.</div>
      ${sh.lookup.map(l=>`<div class="cardHint" style="font-size:13px;margin-top:4px">${l.what?`<b style="color:var(--ink)">${esc(l.what)}</b> &mdash; `:""}${esc(l.where)}</div>`).join("")}`:""}
    ${specCardHTML(sh)}
    ${refCardHTML(sh)}
    ${fakeLookHTML(sh)}
    ${sh.rule?`<div class="cardHint" style="font-size:13px;margin-top:9px"><b style="color:var(--ink)">Shop rule:</b> ${esc(sh.rule)}</div>`:""}
    ${F.verdict==="fail"?`<div class="tagWarn" style="border-left-color:var(--bad);background:var(--bad-wash);color:var(--bad-ink);margin-top:9px"><b>Set it aside.</b> ${esc(FAKES.law)}</div>`:""}
    <div class="row2" style="margin-top:8px"><button class="ghostBtn" id="fakeClear" style="padding:9px 15px">Start the check over</button></div>
  </details>`;
}
/* What stands in for the loan while a gating check is unanswered. */
function fakeHoldHTML(F){
  const t=F.verdict==="fail"
    ? `<b>A check on the ${esc(F.sh.title.toLowerCase())} sheet failed.</b> Don't lend on the brand name. Lend on what you can prove &mdash; the metal, a no-name value &mdash; or pass.`
    : F.verdict==="unsure"
    ? `<b>Not proven.</b> ${F.unsure} check${F.unsure===1?" is":"s are"} unresolved. Price only what you can verify today, not the name.`
    : `<b>Authenticity not proven.</b> ${F.done} of ${F.n} checks answered on the ${esc(F.sh.title.toLowerCase())} sheet. Work the spotting-fakes card first &mdash; a fake is not worth a share of the real one, it is worth nothing. This is not about the price: that is looked up and sitting on the right.`;
  return `<div class="card unchecked"><span class="label">7 &middot; Pawn loan &mdash; the cash you lend him</span>
    ${gauge(0,"Lend him","&mdash;",F.verdict==="fail"?"failed the check":"authenticity not proven","gi")}
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
const APP_BUILD="1005.0624";
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
  tell("Could not reach the site to check. If you are offline it keeps working on what it already has.");
}
const MP_STALE_DAYS=45;
/* A measured row is pinned to the item so the counter gets a real price
   instead of the desk's own estimate - but these rows are named tools, and
   the maker is most of what one is worth. Nothing checked it, so typing
   "black & decker drill" pinned the DeWalt row and priced a budget drill
   as a top-tier one. A row naming a different maker than the text does is
   not this tool; a row naming no maker still answers. */
function mpFor(cur,text){
  const t=" "+omniNorm(text)+" ";
  if(!t.trim())return null;
  const said=brandInText(st.catId,text);
  const agrees=r=>{ if(!said||!r)return true;
    const h=brandInText(st.catId,r[2]);
    return !h||sameMaker(h.name,said.name); };
  for(const [id,re] of MP_MATCH){
    const r=MP_BY_ID[id]; if(!r)continue;
    if(String(r[1]).split("|").indexOf(cur)<0)continue;
    if(re.test(t)&&agrees(r))return r;
  }
  const a=mpAuto(cur,text);
  return agrees(a)?a:null;
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
/* WHERE THE NUMBER CAME FROM, WHEN IT CAME FROM MORE THAN ONE PLACE.
   The line used to name a single site because a row only ever had one.
   Now that two sites can be folded into one price, saying "resale value
   from trailcampro.com" would be naming one of the two and hiding the
   other - and the whole point of the fold is that the agreement between
   them is the reason to trust the figure. So the line says how many
   agreed, because that IS the evidence. */
function mpSaid(r){
  const sites=String(r&&r[9]||"");
  const when=fmtDay(r[6]);
  if(sites.indexOf(",")>=0){
    const n=sites.split(",").length;
    return /DISAGREE/.test(String(r[8]||""))
      ? n+" sources disagree \u2014 "+sites+", "+when
      : n+" sources agree \u2014 "+sites+", "+when;
  }
  return "resale value from "+srcName(r[7])+", "+when;
}
function srcName(u){ try{ const h=new URL(u).hostname.replace(/^(www|used)\./,""); return SRC_NAMES[h]||h; }catch(e){ return "the source"; } }
function srcLink(u,txt){ return /^https:\/\//.test(u||"")?`<a class="srcLink" href="${esc(u)}" target="_blank" rel="noopener" referrerpolicy="no-referrer">${txt||"Check it"} &#8599;</a>`:""; }
function marketSrcHTML(m){
  if(m.kind==="list"){
    /* ASKED TWICE NOW: "is this eBay sold or for sale?" The rail panel was
       fixed to say; this line, which is the one under the big number and
       therefore the one actually read, was still saying "Resale value from
       eBay" - and eBay answers both questions, so naming the site names
       nothing. The evidence was on the card, four lines down, wearing the
       label "What moves it:" - which is for a note like "hours; electric
       start working", not for the count the price rests on.
       It leads now, in the first clause, before the site. */
    const ev=rowEvidence(m.note,m.src);
    const lead=ev.kind==="sold"
      ? `<b style="color:var(--accent-ink)">${ev.n?ev.n+" real sales":"Sold prices"}</b> on <b>${esc(srcName(m.src))}</b>`
      : ev.kind==="asking"
      ? `<b style="color:var(--warn-ink)">${ev.n?ev.n+" asking prices, not sales":"Asking prices, not sales"}</b> on <b>${esc(srcName(m.src))}</b>`
      /* "Researched" was the word on 117 rows whose source is a GunBroker
         sold page, and it read as "nobody looked". Say what happened: a
         range was read off a real sold-price page, by eye. The six rows
         with no source at all now say so in their own words. */
      : ev.kind==="read"
      ? `<b style="color:var(--accent-ink)">Real sold prices</b> read off <b>${esc(srcName(m.src))}</b> by eye, not counted`
      : ev.kind==="guide"
      ? `<b>${esc(srcName(m.src))}</b>, a value guide rather than sold prices`
      : `<b>Nothing looked up</b> \u2014 a built-in starting figure`;
    return `${lead}, ${esc(fmtDay(m.date))}. ${srcLink(m.src)}${
      ev.kind==="asking"
      ? ` <span style="color:var(--warn-ink)">${money(m.mid)} is a ceiling, not a price.</span>`
      : m.conf==="l"
      ? ` <span style="color:var(--warn-ink)">Thin \u2014 a forum post or one listing. Double-check it.</span>`
      : m.conf==="h" ? ` Good data.`
      : ` Fair data \u2014 a starting point.`}`;
  }
  if(m.kind==="shot"&&m.via==="button")return `From ${m.n} ${m.n===1?"sale":"sales"} on ${esc(m.site||"the sold page")}, read by your Pawn price button today. ${srcLink(m.url,"See those sales")}`;
  if(m.kind==="shot")return `From ${m.n} ${m.n===1?"sale":"sales"} you read off ${esc(m.site||"the screenshot")} today.`;
  if(m.kind==="own")return `From your own ${m.n} ${m.n===1?"sale":"sales"} of this item.`;
  if(m.kind==="found")return `From <b>${m.n}</b> listing${m.n===1?"":"s"} on file${m.sold?`, ${m.sold} of them sold`:""}: the middle one is <b>${money(m.med)}</b>, the middle half ${money(m.lo)}&ndash;${money(m.hi)}.${m.from?` From ${esc(m.from)}.`:""}${m.mostlyAsks?` Mostly asking prices rather than sales.`:""}${m.conf==="l"?` <span style="color:var(--warn-ink)">Few listings behind this &mdash; look at the sold pages before you lean on it.</span>`:""} The middle one is used, not the average, so one bad listing cannot move it.`;
  if(m.kind==="seen")return `From <b>${m.n}</b> shelf tag${m.n===1?"":"s"} you recorded, asking ${money(m.lo)}&ndash;${money(m.hi)}, typically ${money(m.ask)} &mdash; what a used one goes for at a shop near you.`;
  if(m.kind==="harvest")return `From the price list this shop built: <b>${esc(m.name)}</b>, ${m.n} listing${m.n===1?"":"s"}${m.sold?`, ${m.sold} sold`:""} on ${esc(fmtDay(m.date))}. ${srcLink(m.src,"See those sales")} Nobody has checked this one by hand &mdash; it is a search, kept.`;
  if(m.kind==="retail")return `Estimated from <b>${money(m.retail)}</b> new retail, taken to ${(m.pct||retailPct())}% for a used one. This is not a sold price &mdash; check sold prices when you can.`;
  if(m.kind==="hand"){
    const hs=handSrc(m.src);
    if(!hs)return "Your number, typed in. No source recorded \u2014 type it again to say where it came from.";
    const when=m.date?esc(fmtDay(m.date)):"";
    if(hs.id==="gut")return `<b style="color:var(--warn-ink)">Your own judgement</b>, ${when} \u2014 nothing looked up behind it. It prices exactly as typed.`;
    if(hs.id==="ask")return `An <b>asking price</b> you saw, ${when}. <span style="color:var(--warn-ink)">Nobody has paid it \u2014 asks run high, so this is a ceiling.</span>`;
    if(hs.id==="bravo")return `<b style="color:var(--accent-ink)">Bravo Estimator</b>, read ${when}. Their figure, off real pawn deals. Not a sale you counted, but not a guess either.`;
    if(hs.id==="sold")return `A <b style="color:var(--accent-ink)">sold price</b> you read, ${when}. What somebody actually paid.`;
    return `<b style="color:var(--accent-ink)">This shop's own sales</b>, ${when}. The best figure there is for Bristol.`;
  }
  return "Your number, typed in.";
}
function step4Inner(x,bare){
  /* "no measured price for microsoft xbox game console - current gen" -
     that is the make and model the counter typed, glued to the name of the
     SHELF it landed on, in lower case. Two names for one thing, and it
     reads as though the desk is confused about what is in front of it.
     When the counter has named it, that is its name. */
  const m=x.market, who=[st.brandTyped,st.model].filter(Boolean).join(" "), name=displayName(x);
  const called=who||name;
  /* In the one-question run the question IS the heading, and a card that
     announces "4 - Resale value" under "What does one sell for used?" says
     it twice and numbers it wrong: it is question five of six there, not
     step four of anything. */
  let h=bare?"":`<span class="label">4 &middot; Resale value &mdash; what it sells for used</span>`;
  /* AND IN THE CARD THE FIGURE ACTUALLY LANDS IN.
     The rail got the big wheel, but the rail is the desk's. On the phone
     this card IS the window the price pops up in - "What does one sell for
     used?" - and mid-lookup it showed a figure, a tick reading "Checked"
     and no sign at all that a live search was in flight that could change
     both. Same card on both surfaces, so one line covers them.
     It goes ABOVE the figure rather than replacing it: whatever is showing
     now is the book's or the last lookup's, and it is still the best thing
     known until the search comes back. Hiding it would trade one kind of
     not-knowing for another. */
  if((typeof findBusy!=="undefined"&&findBusy)||(typeof pickChase!=="undefined"&&pickChase))
    h+=`<div class="askBusy"><span class="pinSpin lg" aria-hidden="true"></span>
      <div class="pinWorkT"><b>Looking it up\u2026</b>
        <span>checking what these actually sell for${x.checked?" \u2014 this figure may change":""}</span></div></div>`;
  if(st.editing){
    /* THE SOURCE BUTTONS ARE THE SAVE. There is no Save beside them,
       because a Save button is a way to record a number with no source
       and that is the thing being fixed. Same one tap it always was. */
    h+=`<div class="row2"><input id="valIn" type="number" inputmode="numeric" placeholder="What a used one sold for" value="${m&&m.kind==="hand"?m.mid:""}" class="numIn" style="flex:1;min-width:0"><button class="ghostBtn" id="valCancel" style="padding:11px 14px">Cancel</button></div>
      <div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">What one like this actually sells for used, in normal shape. The loan works from this number.</div>
      ${handSrcHTML(m&&m.kind==="hand"?m.src:"")}`;
  } else if(x.checked){
    h+=`<div class="mkRow"><div><div class="mkBig">${money(m.mid)}</div>${m.lo!=null&&m.hi!=null&&m.lo!==m.hi?`<div class="mkRange">usually ${money(m.lo)} to ${money(m.hi)}</div>`:""}</div><span class="mkOk">&#10003; Checked</span></div>
      <div class="mkWhat">Not the loan &mdash; the loan is worked out from it.</div>
      <div class="mkSrc">${marketSrcHTML(m)}</div>
      ${(m.note&&["research","read"].indexOf(rowEvidence(m.note,m.src).kind)>=0)?`<div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">What moves it: ${esc(m.note)}.</div>`:""}

      <div class="row2" style="gap:8px;margin-top:10px;flex-wrap:wrap"><button class="ghostBtn" id="valEdit">Type my own number</button>${m.kind!=="list"?`<button class="ghostBtn" id="mkClear">Clear it</button>`:""}</div>`;
  } else {
    /* WHY IT IS ASKING, NOT JUST THAT IT IS.
       "Not checked yet" over a Type-the-real-price button reads as the tool
       asking the counter for the answer he came to get. It is asking for an
       INGREDIENT: the resale figure everything else adjusts, and which the
       desk normally supplies from its own book or a lookup. When it cannot,
       it should say which of those failed rather than leave him to guess. */
    const blindWhy=(typeof ebayBlind==="function")?ebayBlind(x):"";
    h+=`<div class="mkNo"><b>Not checked yet.</b> ${m&&m.stale?`The price list for ${esc(m.name)} is ${m.age} days old.`:`No measured price for <b>${esc(called)}</b>.`}</div>
      <div class="cardHint" style="font-size:13.5px;color:var(--ink-2);margin-top:6px">${blindWhy
        ? esc(blindWhy)+" So this one is yours to look up."
        : "The loan works from this number."}</div>
      ${(function(){
        /* IT POINTED AT BUTTONS THAT WERE NOT THERE.
           "Tap a sold-price button above" - and on a phone there is no such
           button anywhere on the screen. The sold-price links live in the
           comps card, which the desk draws beside this question and the
           phone does not draw at all, so the one instruction this card
           exists to give named something that did not exist. The same
           fault as "See the detail", and as eighteen aisles being told to
           price locally with four eBay buttons.
           So the links come INTO the question when nothing else is showing
           them. On a desk rail the card beside this one already has them
           and a second copy would be the duplication the counter keeps
           having to point out. */
        if(!bare||deskRail())return "";
        const t=(typeof compTargets==="function")?compTargets(x):[];
        if(!t.length)return "";
        return `<div class="label" style="margin-top:12px">Look it up</div>
          <div class="compGrid">${t.map(z=>
            `<a class="compBtn" data-compsite="${esc(z.id)}" data-url="${esc(z.url)}" data-label="${esc(z.name)}" href="${esc(z.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${z.name}</span><span class="cs">${z.sub}</span></a>`
          ).join("")}</div>`;
      })()}
      ${/* "watch count always brings up these wildly outrageous prices
            which I think are for like large lots or all-time sales or
            something because I'm looking up at TCL cheap TV and it's
            showing $10,000 which is obviously incorrect."

            He is right and the cause is on the listing itself: that TCL
            says "Ran for 3.2 minutes". A fixed-price listing that opened
            and closed inside the same hour is a mis-key, a cancelled
            order or a scrape, not a sale anybody made - and WatchCount
            reports it as Sold like any other. The other one on his
            screen, $5,899, is a REAL sale of a 98-inch flagship, which
            is a different television from the one on the counter.

            So the two things to throw out are named. The middle of what
            is left is the number, and the middle is already how this
            card reads a list - one absurd row cannot move a median, but
            it can certainly move an eye.

            TEN WORDS, NOT SIXTY. The first version of this was its own
            bullet and a paragraph, and check-ask went red for the right
            reason: 144 words and 756px on a phone against budgets of 80
            and 560. "Also very wordy" is the standing complaint about this
            tool. It is now a half-sentence on the bullet that was already
            there, and the two buttons share one row. 78 words, 553px. */""}
      <ol class="mkSteps"><li>${pdBridge?"Click a link. The page reads itself.":isTouch()?"Open one, screenshot the sold results, read it here.":"Open one, type the middle sold price in."}</li><li><b>Sold, not asking.</b> Skip odd rows — ran for minutes, or a different model. Middle of the rest.${who?"":` ${mpCount()} models have built-in prices.`}</li></ol>
      <div class="worthBtns">
      ${/* THE DESK HAD NO LOOKUP BUTTON ON THE QUESTION THAT NEEDS ONE.
            "lets get the lookup working so i dont have to type prices."
            Measured it against a mock service, both surfaces, with the
            device connected. The phone works: one tap on Look up and a
            figure lands. The desk's price question offered "Enter what
            one sold for", "Nothing to find", Back and Skip - and nothing
            else. Typing was the only way to answer it.

            pdFindGo does exist, in nextStepHTML's step card, which the
            one-question run does not render - and the one-question run is
            the default layout. So the button was two layouts away from
            the question it answers. Same shape of fault as the phone's
            asking-price box: real code, wired, tested, on a screen
            nobody is looking at.

            It leads here, because it is the thing that does the work and
            typing is the fallback. Same id and same message node as the
            other copies so the existing handler and say() reach it
            without a second path to drift. */""}
      ${/* ONLY IN THE ONE-QUESTION RUN, WHICH IS THE LAYOUT THAT LACKED IT.
            First go put it on every layout and made two elements share
            the id pdFindGo on the desk - two visible in "one step at a
            time" and in "everything open". The comment on the phone's
            copy, twenty lines down, warns about precisely that: the
            message gets written to whichever comes first, which is how it
            once ended up on a hidden one. Measured it rather than reading
            the comment and hoping: #pdFindGo=2 in three of four layouts.

            The other layouts already carry a working button in their step
            card. `bare` is true only from askWorth, so this adds the
            button where it was missing and nowhere else. */""}
      ${(bare&&typeof CAP!=="undefined"&&CAP.sample&&!ebayBlind(x))
        ? `<button class="brassBtn" id="pdFindGo">${findBusy?"Looking it up\u2026":(x.checked?"Look it up again":"Look it up \u2014 everywhere")}</button>`
        : ``}
      <button class="${(bare&&typeof CAP!=="undefined"&&CAP.sample&&!ebayBlind(x))?"ghostBtn":"brassBtn"}" id="valEdit">Enter what one sold for</button>
      ${/* THE RUN HAD NO WAY OUT OF THIS QUESTION. Reported from the
            counter: "there's no screen at the end of the workflow that
            indicates there isn't any more steps to take until you look it
            up it just keeps recycling them back through question number
            7". Exactly right, and it is the only question in the run that
            cannot be answered from inside the app - everything else has a
            Skip or a default, and this one waits on a website.

            So it gets the answer the counter actually has: he looked and
            found nothing. The model question has had one of these since
            the day it was written ("plenty of things carry no model at
            all"), and plenty of things have no sold page either - a
            no-name TV, an off-brand trimmer, anything local-only. The run
            finishes, the price comes from the built-in figure, and the
            card keeps saying ESTIMATE in warning ink, which is the true
            thing and is already everywhere else on the screen. */""}
      <button class="ghostBtn" id="worthNone">Nothing to find</button>
      </div>
      ${(bare&&typeof CAP!=="undefined"&&CAP.sample&&!ebayBlind(x))?`<div class="cardHint" id="pdFindMsg">${esc(findMsg||"")}</div>`:``}
`;
  }
  return h+ownCompsHTML(x);
}
function wireStep4(){
  wireNext(); wireBuy();
  const edit=document.getElementById("valEdit");
  if(edit)edit.onclick=()=>{ st.editing=true; render(); const v=document.getElementById("valIn"); if(v)v.focus(); };
  const cancel=document.getElementById("valCancel"); if(cancel)cancel.onclick=()=>{ st.editing=false; render(); };
  const vin=document.getElementById("valIn");
  wireHandSrc("valIn");
  /* Enter used to save with no source. It moves focus to the source
     buttons instead, which is where the answer now has to come from. */
  if(vin)vin.onkeydown=e=>{ if(e.key==="Enter"){ e.preventDefault();
    const b=document.querySelector("[data-handsrc]"); if(b)b.focus(); } };
  const clr=document.getElementById("mkClear"); if(clr)clr.onclick=()=>{ st.market=null; render(); };
  const own=document.getElementById("useOwn");
  if(own)own.onclick=()=>{ const s=soldStats(dealKey()); if(!s)return; st.market={kind:"own",key:mkKey(),mid:Math.round(s.mid),lo:s.lo,hi:s.hi,n:s.n}; render(); };
}
function refreshStep4(){
  const xx=calcItem();
  const s4=document.getElementById("step4"); if(s4&&!st.editing){ s4.innerHTML=step4Inner(xx); wireStep4(); }
  const ns=document.getElementById("nextStep"); if(ns){ ns.outerHTML=nextStepHTML(xx); wireNext(); }
  const tk=document.getElementById("ticket"); if(tk)tk.innerHTML=ticketHTML(xx); paintPin(xx);
  const lg=document.getElementById("logCard"); if(lg){ lg.innerHTML=logCardInner(xx); wireLogButton(); }
}
/* uncheckedTicketHTML lived here. The loan card no longer goes blank when
   nothing has been looked up - it shows the desk's own estimate and says
   so - so there is nothing left for it to draw. */
/* THE ONES THAT WALK IN MOST, FIRST.
   Asked for at the counter. The catalog's order is the order somebody wrote
   it in, which is not the order things come through the door - a pawn shop
   sees ten drills for every welder, and the drill was ninth.

   What it orders BY matters more than that it orders. There is no trade
   table of "what gets pawned most" worth trusting, and inventing a ranking
   would be a guess dressed as data. The shop's own deal log is not a guess:
   every ticket written says what actually walked in. So the list is ordered
   by that, and by nothing else - items the log has never seen keep the
   catalog's order underneath, unchanged.

   Which means on day one this does nothing at all, and that is correct. It
   sharpens with every ticket. */
function itemCounts(catId){
  const out={};
  if(typeof DEALS==="undefined"||!DEALS.length)return out;
  for(const d of DEALS){
    const id=String(d.itemId||(d.key||"").split("|")[0]||"");
    if(!id)continue;
    if(catId&&d.catId&&d.catId!==catId)continue;
    out[id]=(out[id]||0)+1;
  }
  return out;
}
/* Catalog order, with anything the log has seen lifted to the front in the
   order it has seen it. Stable: two items with the same count keep their
   shipped order rather than shuffling between renders. */
function itemsByUse(cat){
  const items=(cat&&cat.items)||[];
  const n=itemCounts(cat&&cat.id);
  if(!Object.keys(n).length)return items.map((it,i)=>({it,seen:0,i}));
  return items.map((it,i)=>({it,seen:n[it.id]||0,i}))
              .sort((a,b)=>b.seen-a.seen||a.i-b.i);
}
/* The same rule one level up, for the aisles - which IS the list the
   counter meets, because the item list above it renders only in a flow
   stepFlow() no longer returns. Same discipline: the log or nothing. */
function catsByUse(){
  const n=itemCounts(null), per={};
  if(typeof DEALS!=="undefined")for(const d of DEALS){
    const c=d.catId||((CATALOG.find(x=>x.items.some(i=>i.id===d.itemId))||{}).id);
    if(c)per[c]=(per[c]||0)+1;
  }
  if(!Object.keys(per).length)return CATALOG.map((c,i)=>({c,seen:0,i}));
  return CATALOG.map((c,i)=>({c,seen:per[c.id]||0,i}))
                .sort((a,b)=>b.seen-a.seen||a.i-b.i);
}
function ownAvgTag(id){ const s=CAP.db?soldStats(id):null; return s?`<span class="price mine">you: ${money(s.mid)}</span>`:""; }

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
  xbox:"microsoft",playstation:"sony",switch:"nintendo",wingmaster:"remington",rancher:"husqvarna",
  /* Found by auditing every maker the brand book detects inside a price-book
     row name - 120 of them. These three are budget or premium LINES of a
     company the counter is likely to type by name, and were unreachable the
     same way Xbox was. The rest of the 120 are companies in their own right.
     Deliberately left out: marlin->ruger and craftsman->stanley are true on
     paper, but nobody walks in calling a Marlin 336 a Ruger, so the mapping
     would only put Marlins in front of somebody who typed Ruger. */
  squier:"fender",epiphone:"gibson",alienware:"dell",tudor:"rolex"};
/* MICROSOFT AND XBOX ARE NOT RIVAL MANUFACTURERS.
   Reported from the counter: typed "microsoft xbox", got "no measured
   price", and was never offered a series to pick - with twenty-three
   console rows and eight Xbox rows sitting in the book.

   The guard that did it is a good guard: a row carrying a maker the
   counter did not type is a different product, which is what stops
   "milwaukee drill" answering with a DeWalt. But the electronics brand
   book carries "Xbox" as a maker in its own right, so the check compared
   microsoft against xbox, found two makers that were not each other, and
   dropped every Xbox row in the book.

   MP_FAMILY above already knows xbox belongs to microsoft, playstation to
   sony, galaxy to samsung. Nothing consulted it here. Now both the search
   and the lookup resolve a name through it before comparing, so a product
   line and the company that makes it agree. */
function makerOf(name){ const n=omniNorm(name||""); return MP_FAMILY[n]||n; }
/* ASYMMETRIC ON PURPOSE, and the asymmetry is the whole safety of it.
   A maker's name should find that maker's product lines: type Microsoft,
   get the Xboxes. A LINE's name must not drag in the parent's other goods:
   type Squier and you must not be offered a Fender, because a Squier
   Affinity is $150 and a Fender Player is $600 and they are both
   Stratocasters. Resolving both sides up to the parent - which is what a
   symmetric version does - makes exactly that mistake.
   So: the ROW is resolved up to its parent, the TYPED name is not. */
function sameMaker(rowBrand,typed){
  if(!rowBrand||!typed)return true;
  const r=omniNorm(rowBrand), t=omniNorm(typed);
  if(r===t)return true;
  if(makerOf(r)===t)return true;               /* the row is a line of what was typed */
  return r.indexOf(t)>=0||t.indexOf(r)>=0;     /* "sig" and "sig sauer" */
}
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
/* WHAT EBAY CANNOT SELL, IT CANNOT PRICE.
 *
 * Measured over seventy searches for things the desk claims to know: 37%
 * came back usable. The single biggest bucket of the rest was firearms,
 * and the reason is not subtle - eBay bans the sale of guns. A search for
 * "Remington 870 Express" returns shell latches at $14.99, a trigger
 * plate at $39, a bolt at $56 and a stock set at $115. Not one shotgun.
 * The desk was pricing a $450 gun off a $15 shell latch, and grading it
 * "good data" because fourteen real sales agreed with each other.
 *
 * The tool has always known this. The comps card says so in plain words -
 * "eBay doesn't sell guns, GunBroker completed auctions is the only real
 * firearm comp" - and then the automatic lookup went and searched eBay
 * anyway. Same for anything nobody ships: quads, side-by-sides, golf
 * carts, riding mowers. Those come back as parts too.
 *
 * Refusing is not a smaller answer than a wrong one. The manual buttons
 * for the right source are already on the screen. */
/* WHAT EBAY CANNOT PRICE, MEASURED ONE AISLE AT A TIME.
   Every entry here is a harvest result, not a hunch. The rule is the
   one the harvest prints at the end of a run: a model counts as clean
   only if it is built on sold prices, lands inside the sanity band, and
   its quartiles are within 3x - and an aisle that cannot clear a
   quarter of its models is an aisle where the search is returning
   accessories. Under that rule these came back:

     outboard 9.9-25hp   0/12      chest freezer     0/3
     air compressor 60g  0/5       window AC         0/3
     refrigerator        0/5       weight bench      0/5
     home gym / rack     0/8       MIG welder      1/10
     dryer               0/4       pressure washer  1/7
     rolling tool box    0/6       elliptical       1/6
     designer jewelry    0/5       washer           1/5
     television         0/16       treadmill       2/10

   The pattern is physical, not technical: none of these ship for less
   than they are worth, so eBay lists their parts. A NordicTrack search
   returns belts that really did sell, eight of them, at $35 - genuine
   sales of the wrong object. Designer jewellery fails for the opposite
   reason: the searches came back with nothing usable at all.

   A few of these still have a book row, from the one or two models that
   DID return clean sold data. That is not a contradiction - a
   researched figure is worth keeping; it is the live lookup that is a
   bad bet, and the lookup is what this switches off. */
const EBAY_CANNOT_ITEM={
  e1:"A television does not ship, so eBay has almost no used ones sold \u2014 19 models were tried and one came back priceable. What is listed is remotes, stands and boards. Price it off Facebook Marketplace locally, your own sales and the shelf record.",
  p4:"A mower does not ship, so eBay lists deck belts and spindles rather than machines. Price it off your own sales and the shelf record.",
  p5:"A mower does not ship, so eBay lists deck belts and spindles rather than machines. Price it off your own sales and the shelf record.",
  h9:"An outboard does not ship, so eBay lists props, carbs and cowlings \u2014 none of twelve motors came back priceable. Price it off local listings and your own sales.",
  t5:"A 60-gallon compressor is freight, so eBay lists pumps, motors and pressure switches rather than machines. Price it locally.",
  a2:"A fridge does not ship, so eBay lists shelves, handles and ice makers. Price it locally and off the shelf record.",
  a3:"A washer does not ship, so eBay lists lids, pumps and control boards. Price it locally.",
  a4:"A dryer does not ship, so eBay lists heating elements, belts and timers. Price it locally.",
  a6:"A chest freezer does not ship, so eBay lists lids and thermostats. Price it locally.",
  a7:"A window unit does not ship, so eBay lists filters, remotes and control boards. Price it locally.",
  f1:"A treadmill does not ship, so eBay lists belts, motors and consoles \u2014 and they really do sell, which is why the number looks plausible and is wrong. Price it locally.",
  f3:"An elliptical does not ship, so eBay lists pedals, consoles and resistance motors. Price it locally.",
  f4:"A weight bench does not ship for less than it is worth, so eBay lists pads and pins. Price it locally.",
  f6:"A rack does not ship, so eBay lists J-cups, pins and attachments. Price it locally.",
  t6:"A welder is heavy, so eBay lists guns, tips, liners and regulators \u2014 one of ten machines came back priceable. Price it locally.",
  t7:"A rolling tool box does not ship, so eBay lists drawer slides, latches and liners. Price it locally.",
  p6:"A pressure washer mostly does not ship, so eBay lists wands, hoses, pumps and nozzles. Price it locally.",
  j3:"Designer jewellery came back with nothing usable across five makers \u2014 the names are too broad and the pieces too varied for a search to mean anything. Price it by metal weight and stone, and check the maker's own resale pages.",
  /* 24 Sep: the harvest priced 51 saws, trimmers and blowers and got ONE
     clean row out of them. Not because the numbers looked mad \u2014 they looked
     plausible \u2014 but because every single one came back with zero sold
     listings. eBay reported one used sale across the whole aisle in 90
     days, so the figures were asking prices on bars, chains, carburettors
     and recoil starters. A Husqvarna 460 spanned $133 to $400 inside one
     search: whole saws mixed with parts. */
  p1:"A saw is cheap to buy new and expensive to ship, so eBay lists bars, chains, carburettors and recoil starters \u2014 32 models came back, not one of them on a real sale. Price it off the shelf record and what the dealers in town are asking.",
  p2:"A trimmer does not ship, so eBay lists heads, spools, shafts and carburettors. One of seven models came back priceable. Price it locally.",
  p3:"A backpack blower does not ship, so eBay lists tubes, elbows, straps and carburettors \u2014 twelve models, not one clean row. Price it locally.",
  /* 25 Sep: 14 generators tried, ONE came back on a real sale. This one is
     not quite the shipping story the rest of the aisle tells - a 47lb
     inverter ships fine - it is that the search cannot tell a machine from
     a carburettor. Honda EU2200i came back $20 to $700 inside one search;
     EU3000iS, a $2,300 machine new, came back $28 to $99. Those are covers,
     wheel kits and carbs sitting in the same list as whole units, and the
     median of that mixture is not a price of anything.
     What made it worse than the rest of the aisle: the three rows it DID
     merge were all asking prices near new retail, so the desk was quoting
     a used generator at what a new one costs. */
  p7:"A generator search cannot tell a machine from a carburettor \u2014 14 models tried, one came back on a real sale, and a Honda EU2200i spanned $20 to $700 inside a single search. Price it off Facebook Marketplace locally, your own sales and the shelf record."
};
const EBAY_CANNOT={
  guns:"eBay does not sell firearms, so a search for one comes back as parts — latches, barrels, stocks. Use the GunBroker and GunWatcher buttons above: completed auctions there are the real comp.",
  rolling:"Nobody ships a quad, a side-by-side or a golf cart, so eBay only ever lists their parts. Price it off your own sales and what the dealers near you are asking."
};
function ebayBlind(x){
  const cat=x&&x.cat?x.cat.id:st.catId;
  if(EBAY_CANNOT[cat])return EBAY_CANNOT[cat];
  const id=x&&x.item?x.item.id:st.itemId;
  return EBAY_CANNOT_ITEM[id]||"";
}
async function priceFind(signal,all){
  if(findBusy||!CAP.sample)return;
  const x=calcItem(), q=compQuery(x);
  if(!q)return;
  const blind=ebayBlind(x);
  if(blind){ findMsg=blind;
    const el=document.getElementById("pdFindMsg"); if(el)el.textContent=blind;
    try{ render(); }catch(e){}
    return; }
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
  /* Both, because which one exists depends on the layout, and the rail is
     the one the counter is looking at when it presses the button. */
  const say=t=>{ findMsg=t;
    for(const id of ["pdFindMsg","railFindMsg"]){
      const el=document.getElementById(id); if(el)el.textContent=t; } };
  say("Searching "+passes[0].name+"\u2026");
  /* Second: the passes run one at a time instead of all at once. The first
     is the best source for the category - sold eBay listings, or GunWatcher
     for a firearm - and when it comes back with plenty, the rest are paid
     for to confirm a number that is already good. Thin or failed, and it
     carries on to the next. Most lookups now cost one search, not two. */
  /* A pass may want the name put differently - GunWatcher by model alone.
     What comes back is still filed under the item's own search text. */
  const ENOUGH=8;
  const out=[], runs=[];
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
        /* The basis comes back once for the whole answer, not per listing.
           Stamp it on each one, because the line the counter reads counts
           sold against asking across everything that came back. */
        const b=j.basis==="sold"?"sold":"asking";
        r={status:"fulfilled",value:{comps:(j.comps||[]).map(c=>Object.assign({basis:b},c))}};
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
    if(r.status!=="fulfilled"){ failed++; runs.push({name:P.name,ok:false}); continue; }
    const cs=((r.value&&r.value.comps)||[]).filter(c=>c&&Number(c.price)>0);
    cs.forEach(c=>got.push(Object.assign({},c,{where:String(c.where||P.where).slice(0,24)})));
    runs.push({name:P.name,ok:true,n:cs.length});
    /* EVERY BUTTON PASSES all=true, SO THIS SAVING NEVER HAPPENED.
       "lets get the lookup working so i dont have to type prices." It
       works - measured on the phone against a mock service, one tap, all
       three cases - but measuring it showed three paid searches going out
       on a lookup where eBay had already handed back TEN counted sold
       prices.

       All five call sites pass true: both surfaces' Look up buttons, the
       desk's pdFindGo, and the two photo paths. The only caller that
       passes false is the automatic read after a photo. So the comment
       above claiming "most lookups now cost one search, not two" was
       false for every lookup he can actually press, and check-lookup
       proved the saving on priceFind(null,false) - a path no button
       takes. An assertion on a code path the counter never reaches.

       The flag means "ignore what is on file and search fresh", which is
       a real thing to want and is left alone. It should never have also
       meant "pay for every source regardless". So the stop now depends on
       what came back rather than on who asked:

         enough comps and mostly SOLD  -> stop, spend nothing more. Three
                                          searches cannot improve on ten
                                          counted sales.
         enough comps but mostly asks  -> carry on. Asks run high and want
                                          corroborating, which is worth
                                          the money.
         eBay thin or failed           -> carry on, as before.

       This is the one place in the lookup that decides whether money goes
       out, so it decides on the evidence. */
    const soldSoFar=got.filter(c=>c&&c.basis==="sold").length;
    if(got.length>=ENOUGH&&(soldSoFar*2>=got.length||!all)){ break; }
  }
  /* What a new one costs, gathered in the same sweep. It is the weakest
     number here and it is never chosen over a sale, but it is the one that
     answers "is this worth anything at all" when nothing else lands. */
  let retail=null;
  /* AND NEITHER DOES THE NEW PRICE, ONCE REAL SALES HAVE LANDED.
     This fired on every press too, so a lookup that came back with ten
     counted sold prices still paid for one more search to find out what a
     new one costs. The comment above says what this figure is for: it is
     the weakest number here and it answers "is this worth anything at
     all" WHEN NOTHING ELSE LANDS. With ten sales on file nothing is being
     answered, so the same test the pass loop uses decides it. */
  const soldGot=got.filter(c=>c&&c.basis==="sold").length;
  const haveSales=got.length>=ENOUGH&&soldGot*2>=got.length;
  if(all&&!haveSales&&!(signal&&signal.aborted)){
    say("Checking what it costs new\u2026");
    retail=await retailFetch(q,signal);
    /* kept as a number, said in words below */
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
    if(retail){ useEvidence("retail"); say("Nothing used came back anywhere. Priced off what a new one costs \u2014 "+money(retail.price)+" \u2014 which is the weakest number here."+failNote(runs)); return; }
    render(); say(failed&&failed===out.length?"Every search failed. Try the sold pages.":"No listings found. Try the sold pages.");
    return;
  }
  if(t)useComps(t); else if(retail)useEvidence("retail");
  say(findSaid(uniq,added,t,runs));
}
/* WHAT THE LOOKUP FOUND, IN WORDS A COUNTER READS ONCE.
   What this used to print was the engine talking to itself:

     eBay asks 35 · Searched, used failed · Shopping, used failed ·
     new none — 21 new, 44 on file, 14 duplicate dropped

   Reported from the counter: "I have no idea what the circled section
   means." Fair - it is a tally of passes, written for whoever was
   debugging the passes. Nobody pricing a PlayStation needs to know that a
   duplicate was dropped.

   What he does need is the thing he has asked about more than anything
   else on this tool: are these SOLD prices or ASKING prices? Every comp
   carries its own basis, so that is countable, and it leads. */
function findSaid(fresh,added,t,runs){
  const sold=fresh.filter(c=>String(c.basis||"").toLowerCase()==="sold").length;
  const asks=fresh.length-sold;
  const where=[...new Set(fresh.map(c=>String(c.where||"").trim()).filter(Boolean))];
  const on=where.length?" on "+where.slice(0,2).join(" and ")+(where.length>2?" and others":""):"";
  let lead;
  if(!added)           lead="Nothing new came back"+(t?" \u2014 pricing off the "+t.n+" already on file.":".");
  else if(sold&&!asks) lead=sold+" sold price"+(sold===1?"":"s")+on+" \u2014 what people actually paid.";
  /* THE SECOND SENTENCE CAME OUT TO PAY FOR THE SIEVE. check-screens holds
     this line to 30 words and it was already at 30; the sieve clause is 10
     more. What went is "It is what sellers want, not what one sold for" -
     which the Behind-this-number panel says in its own words, three inches
     to the right, on screen at the same moment: "What sellers are hoping
     for. They run high." The rail's own rule is that it must not restate
     what is already said, and this was the line restating it. */
  else if(asks&&!sold) lead=asks+" asking price"+(asks===1?"":"s")+on+" \u2014 nobody paid these.";
  else                 lead=sold+" sold and "+asks+" asking"+on+". The price leans on the sold ones.";
  const onFile=(added&&t)?" "+t.n+" on file now.":"";
  return lead+onFile+sieveNote()+failNote(runs);
}
/* HOW MANY EBAY SENT, AND WHAT WAS THROWN OUT OF IT.
   Without this the counter reads the surviving count as the whole market.
   It is one clause, it names the three reasons by the words they mean at a
   counter, and it only appears when something actually was thrown out -
   "eBay sent 22, none dropped" is noise. */
function sieveNote(){
  const L=LAST_EBAY;
  if(!L||!L.found||!L.dropped)return "";
  const d=L.dropped, part=Math.round(Number(d.part)||0),
        lot=Math.round(Number(d.lot)||0), wrong=Math.round(Number(d.wrong)||0);
  const n=part+lot+wrong;
  if(!(n>0))return "";
  /* Ten words, because the line they join is held to thirty. The three-way
     split is the detail; the number eBay SENT is the thing he was missing. */
  const why=[]; if(part)why.push("parts"); if(lot)why.push("lots"); if(wrong)why.push("another model");
  return " eBay sent "+L.found+"; "+n+" were "+why.join(", ")+".";
}
/* A source that did not answer is worth one short clause: it is why the
   answer is thinner than it should be. It is not worth naming three of
   them in full. */
function failNote(runs){
  const bad=(runs||[]).filter(r=>!r.ok);
  if(!bad.length)return "";
  return bad.length===1 ? " "+bad[0].name+" did not answer."
                        : " "+bad.length+" other searches did not answer.";
}
/* Every number the sweep turned up, kept side by side. The card below lists
   them all and marks the one in use, so nothing found is lost behind the
   one the tool happened to pick. */
function gatherEvidence(x,t,retail){
  const own=soldStats(dealKey()), seen=seenEstimate(seenMatch(x)), pct=retailPct(x);
  st.evidence={key:mkKey(),ts:Date.now(),
    comps:t?{n:t.n,med:t.med,lo:t.lo,hi:t.hi,sold:t.sold,from:t.from,mid:t.mid}:null,
    retail:retail?{price:retail.price,where:retail.where,pct,
                   mid:Math.max(5,Math.round(retail.price*pct/100/5)*5)}:null,
    own:own?{n:own.n,mid:Math.max(5,Math.round(own.mid/5)*5)}:null,
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
  /* THE HARVEST CHECKS ITS OWN ANSWERS AND THE APP DID NOT.
     A search for a DJI Osmo came back at $25 against a $300 book row -
     a battery charger, a phone clamp and a selfie stick - and the desk
     called it "good data" and put it in use, because nothing on this
     screen compared the two. The harvest has refused numbers like that
     for weeks; the counter got them anyway. Same band, 4x and a quarter,
     and it does not overrule anything - the figure is still offered,
     it just no longer arrives unremarked. */
  const odd=(E.comps&&E.book>0&&E.comps.mid>0)
    ? (E.comps.mid/E.book>4 ? "high" : E.comps.mid/E.book<0.25 ? "low" : "") : "";
  /* THE SAME GUARD THE MERGE USES, ON THE LIVE LOOKUP. lo and hi are the
     middle half of what sold. For one product that band is tight -
     condition and storage move it, a factor of two at the outside. When it
     comes back three times wide the search found more than one thing. A
     DJI Osmo Action 4 returns Action 3s at $70, Action 4s at $165-$181,
     Action 5 Pros at $290 and Osmo Nanos at $281, all real sales, all
     different cameras; the middle of that is nobody's price. */
  const wide=(E.comps&&E.comps.lo>0&&E.comps.hi>0&&E.comps.hi/E.comps.lo>=3)
    ? Math.round(E.comps.hi/E.comps.lo*10)/10 : 0;
  let h=`<div class="label" style="margin-top:14px">Everything it found</div>`;
  if(E.comps)h+=row("comps",`${E.comps.n} listing${E.comps.n===1?"":"s"}${E.comps.sold?`, ${E.comps.sold} sold`:""}`,
    E.comps.mid,`middle half ${money(E.comps.lo)}–${money(E.comps.hi)}${E.comps.from?" · "+esc(E.comps.from):""}`)
    +(!odd&&wide?`<div class="mkNo" style="margin:-4px 0 8px"><b>Those ${E.comps.n} sales spread ${wide}&times; &mdash; ${money(E.comps.lo)} to ${money(E.comps.hi)}.</b>
        One product does not sell over that kind of range, so the search has almost certainly
        caught more than one model. Open the sold page and take the ones that match what you
        are holding, or type that figure yourself.</div>`:"")
    +(odd?`<div class="mkNo" style="margin:-4px 0 8px"><b>That is ${odd==="low"?"far below":"far above"} the ${money(E.book)} this kind of thing books at.</b>
        ${odd==="low"?"A search that comes back this cheap has usually found the accessories \u2014 chargers, cases, mounts \u2014 rather than the thing itself. Open the sold page and look before you use it."
                     :"Check the listings are the same thing you have in front of you, and not a newer or larger one."}</div>`:"");
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
             mostlyAsks:t.mostlyAsks,conf:t.conf,mid:t.mid,from:t.from,
             /* where it came from and why it is not better than it is */
             via:LAST_EBAY?LAST_EBAY.source:"", viaBasis:LAST_EBAY?LAST_EBAY.basis:"",
             viaWhy:LAST_EBAY?LAST_EBAY.warning:""};
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
        '<input id="seenIn" type="file" accept="image/*" style="display:none"></label>':'')+
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
    sub=`Search above and tap what it is &mdash; the <b>resale value</b> fills in from there.`;
    act="";
  } else if(cur===1){
    h=`Which ${esc(what)} is it?`;
    sub=`Pick one and the <b>resale value</b> fills in &mdash; what it sells for used. Each one comes from a real sales source you can open and check.`;
    act=cands.map(r=>`<button class="nsBtn" data-mp="${esc(r[0])}"><span>${esc(r[2])}</span><b>${money(r[3])}&ndash;${money(r[4])}</b><i>resale</i></button>`).join("")
       +`<button class="nsBtn ghost" id="nsNone"><span>Not one of these</span></button>`;
  } else if(st.needKind&&!window.PHONE){
    /* Until this is answered the category is whatever was last used, so the
       sources, the percentages and the buy rate all belong to the wrong kind
       of thing - a recliner was being offered GunBroker. */
    h=`What kind of thing is <b>${esc(st.bookName||"it")}</b>?`;
    sub=`Pick one so the price comes from the right kind of source, at the right share of new. Nothing is priced until it does.`;
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
    /* "Use it" recorded a number with no source. The source buttons take
       its place here too, so the two boxes on the desk behave the same -
       they already wrote to the same record, and one of them quietly
       growing a field the other lacked is this repo's oldest bug. */
    const typeIt=`<div class="row2" style="margin-top:8px;flex-basis:100%"><input id="nsVal" class="numIn" title="What ONE OF THESE sells for used \u2014 not what you will lend, and not what it cost new." type="number" inputmode="decimal" placeholder="I know the price \u2014 type what it sells for used" style="flex:1;min-width:0"></div>
      <div style="flex-basis:100%">${handSrcHTML(x.market&&x.market.kind==="hand"?x.market.src:"")}</div>`;
    const rest=altSourcesHTML(x)
       +`<div class="label" style="margin-top:14px;flex-basis:100%">No sold prices? Use what it costs new</div>`
       +(CAP.sample?`<button class="nsBtn on" id="pdRetGo"><span>${retailBusy?"Looking it up&hellip;":"Look up the new price"}</span></button><div class="cardHint" id="pdRetMsg"></div>`:retailTargets(compQuery(x)).map(t=>`<a class="nsBtn nsRetail" title="Opens ${esc(t.name)} to find what it costs NEW. Use this only when there are no sold prices." data-label="${esc(t.name)}" href="${esc(t.url)}" target="_blank" rel="opener" referrerpolicy="no-referrer"><span>${esc(t.name)}</span><b>&#8599;</b></a>`).join(""))
       +`<div class="row2" style="margin-top:8px;flex-basis:100%"><input id="nsRet" class="numIn" title="What it costs NEW today. It is taken down to a used price using the share for this category \u2014 a last resort when the sold pages come up empty." type="number" inputmode="decimal" placeholder="What it costs new" style="flex:1;min-width:0"><button class="ghostBtn" id="nsRetGo" title="Take the new price down to a used estimate" style="padding:10px 15px">Use it</button></div>`
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
    act=condList().map(c=>{ const w=COND_WORDS[c.id]||[c.label,""]; return `<button class="nsBtn" data-ncond="${c.id}"><span>${w[0]}</span><b>${w[1]}</b></button>`; }).join("");
  } else if(!window.PHONE){
    /* The pinned panel holds the loan and the buy price and does not scroll
       away, so saying them again here made one figure appear five times on a
       screen. What it cannot show is where they came from. That is this. */
    h=`Where those numbers come from.`;
    sub=`<b>Resale value ${money(m.mid)}</b> ${x.handSet?"&mdash; your own figure, used exactly as you typed it"
        :`used (${esc(nsSrcShort(m))})${Math.round(x.resale)!==m.mid?`, ${money(x.resale)} in ${cw[0].toLowerCase()} shape`:""}`}.<br>
      Lend <b>${x.ltv}%</b> of that, buy at <b>${x.buyPct}%</b>. A loan he clears with the interest to get it back; a buy is yours to sell.<br>
      The offer is on the right, and it moves as you change the answers.`;
  } else {
    h=`Lend him ${money(x.target)}, or buy it for ${money(x.buy)}.`;
    sub=`<b>Pawn loan ${money(x.target)}</b>: the cash you lend him, and he adds the interest to get it back. Room to move: ${money(x.low)} to ${money(x.high)}.<br>
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
  /* Opened by hand, it stays open through the re-render that answering a
     check causes - otherwise it shuts under the finger that opened it.
     Wired here because this card draws on the item page and the gold
     page both, and wireSpec is already called after whichever one drew
     it.

     THE TOGGLE EVENT CANNOT TELL HIS FINGER FROM A RENDER, and that is
     not a detail. Measured it: tap Coin or bar on the gold screen, which
     gates, and the card is drawn with the open attribute - and a details
     inserted open fires `toggle` on the new element. Listening for that
     recorded the gate's own doing as "he opened it", so st.openFakes
     stuck true and from then on every advising sheet came back open. The
     fold would have worked until the first gated item of the day and
     then quietly stopped, which is the kind of thing nobody reports and
     nobody notices is a bug.

     A click on the summary is unambiguous. It runs BEFORE the toggle, so
     the state he is asking for is the opposite of the one on screen. */
  const fc=document.getElementById("fakeCard");
  const sm=fc&&fc.querySelector(":scope > summary");
  if(sm&&!sm.dataset.wired){ sm.dataset.wired="1";
    sm.addEventListener("click",()=>{ st.openFakes=!fc.open; }); }
  const sel=document.getElementById("specPick");
  if(sel)sel.onchange=()=>{ st.specPick=sel.value; st.specOpen=true; render(); };
  const box=document.getElementById("specFold");
  if(box&&!box.dataset.wired){ box.dataset.wired="1";
    box.addEventListener("toggle",()=>{ st.specOpen=box.open; }); }
  [["spec_g","g"],["spec_d","d"],["spec_t","t"],["spec_lug","lug"],["spec_w","w"]].forEach(([id,k])=>{
    const el=document.getElementById(id); if(!el)return;
    el.oninput=()=>{ st.specIn=Object.assign({},st.specIn,{[k]:el.value}); repaintSpec(); };
  });
  /* The reference boxes. The name and weight boxes only feed the Record
     button, so they just hold what is typed; the compare box re-judges on
     every keystroke the way the spec boxes do. */
  const sh=fakeSheet(calcItem());
  if(sh&&REF_SHEETS[sh.id]){
    const sid=sh.id;
    const rb=document.getElementById("refFold");
    if(rb&&!rb.dataset.wired){ rb.dataset.wired="1";
      rb.addEventListener("toggle",()=>{ st.refOpen=rb.open; }); }
    const nm=document.getElementById("refName");
    if(nm)nm.oninput=()=>{ st.refName=Object.assign({},st.refName,{[sid]:nm.value}); };
    const rg=document.getElementById("refG");
    if(rg)rg.oninput=()=>{ st.refG=Object.assign({},st.refG,{[sid]:rg.value}); };
    const ri=document.getElementById("refIn");
    if(ri)ri.oninput=()=>{ st.refIn=Object.assign({},st.refIn,{[sid]:ri.value}); repaintRef(sid); };
  }
}
/* Same rule as repaintSpec: swap the verdict, never the box the finger is
   in, or the number would jump away mid-digit. */
function repaintRef(sid){
  const sh=fakeSheet(calcItem()); if(!sh||sh.id!==sid)return;
  const card=document.getElementById("fakeCard"); if(!card)return;
  const old=card.querySelector("#refFold"); if(!old)return;
  const tmp=document.createElement("div");
  tmp.innerHTML=refCardHTML(sh);
  const fresh=tmp.querySelector("#refFold");
  const a=old.lastElementChild, b=fresh&&fresh.lastElementChild;
  if(a&&b&&a.tagName===b.tagName&&!/^(SELECT|INPUT|LABEL)$/.test(a.tagName))a.replaceWith(b);
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
  const vi=document.getElementById("nsVal");
  /* Same shape as the new-price box beside it, and the same place the step-4
     box writes to, so it makes no difference which one is used. */
  wireHandSrc("nsVal");
  if(vi)vi.onkeydown=e=>{ if(e.key==="Enter"){ e.preventDefault();
    const b=document.querySelector("[data-handsrc]"); if(b)b.focus(); } };
  ns.querySelectorAll("[data-ncond]").forEach(b=>b.onclick=()=>{
    if(b.id==="nsCond"){ st.condSet=false; render(); return; }
    st.cond=b.dataset.ncond; st.condSet=true; render();
  });
}


/* ================= BUY OUTRIGHT — you own it, no loan =================
   Starting rates Jace approved 9/19: about 5 points over the lending rate,
   same as the loan for seasonal outdoor power. */
var BUY_DEFAULT={guns:55,hunt:45,jewel:45,power:45,tools:40,music:40,rolling:40,elec:45,appl:35,fit:28,coll:40};
/* WHEN THE CATEGORY RATE WAS WRITTEN FOR A DIFFERENT THING.
   elec is 30% because a phone "loses value fast and can come in locked" -
   a real risk that earns a hard rate. Neither half is true of a
   television: nothing locks it, and a two-year-old set does not fall off
   the cliff a two-year-old handset does. Its actual problem is that it is
   bulky and slow, and the liquidity band already docks 5 points for that -
   so a TV was being charged twice for the same slowness and coming out at
   25%, which is a $30 offer on a $125 set. Nobody hauls a working TV in
   for that.
   Published pawn rates run 25-60% of resale, and the trade's own stated
   target of a 38-50% margin implies paying 50-62%. Those are national
   chains with national resale, which we are not, so this sits at the
   bottom of that range rather than the middle: 45 here, 40 after the
   liquidity adjustment. Set on 24 Sep from Jace's call.
   A rate the counter has set by hand for the whole category still wins -
   that is a deliberate act, and this only fills the silence. */
/* THE CATEGORY WAS DOING THE EXCEPTION'S JOB.
   "130 on a 425 resell seems low and under our 40-50 percent threshold we
   set." It was 30.6%, and the rate rule was what bound it - the floor
   would have allowed $400 and the multiple $213. Electronics sat at 30%
   because of the note above: a phone "loses value fast and can come in
   locked."
   That is true of a phone. It was already known to be false of a
   television, which is why e1 had an override - and a current-gen console
   is the same case one item over. It holds its money, and while an account
   lock exists it is not the iCloud cliff a handset falls off.
   So the table is the wrong way round: the category carried the
   exception's rate and the exceptions were being added one at a time, each
   after somebody noticed a bad offer at the counter. Now the category is
   45 - inside the 40-50 band, and where eight of the other ten already sat
   - and the things that really do lock hard and crash carry the low rate
   by name. The common case is right by default and the exception is
   explicit, which is the order those two belong in.
     phone, tablet  30  they lock hard and the value falls off a cliff
     laptop         40  locks, but holds its money far better
     TV, console    45  neither locks in a way that kills resale
   Set 28 Sep from Jace's call. */
var BUY_ITEM={e1:45,e2:40,e3:30,e4:30,e5:45};
var BUY_ITEM_WHY={
  e1:"a TV does not lock and does not crash in value like a handset \u2014 it is just bulky and slow, which the liquidity band already counts",
  e2:"a laptop can come in with a BIOS or account lock, but it holds its money far better than a phone",
  e3:"activation lock, and last year's tablet is worth a fraction of this year's",
  e4:"a phone can come in locked and nobody can clear it, and last year's handset falls off a cliff \u2014 this is the item the old 30% was written for",
  e5:"a current-gen console holds its money, and an account lock is not the cliff a handset falls off"};
var BUY_WHY={guns:"guns sell fast here and hold their value",jewel:"a proven one holds its price, but it sits until the right buyer walks in",hunt:"steady seller in season",tools:"steady seller",
  music:"they sell, just slower",rolling:"big dollars, needs a clean title, sells slower",
  power:"seasonal and often needs a carb cleaned, but it sells and the shelves around here ask real money for it",elec:"it sells fast and it sells all year \u2014 the ones that lock or fall off a cliff carry their own lower rate by name"};
function buyRateHTML(x){
  const set=st.buys&&st.buys[st.catId]!=null;
  return `<div id="buyRate" style="margin-top:18px">
    <div class="rateRow"><span class="label">Buy-outright rate for ${x.cat.label.toLowerCase()} (%)</span><input id="buyNum" class="numIn rateNum" type="number" inputmode="numeric" min="10" max="90" value="${x.buyBase}"></div>
    <input type="range" min="10" max="90" value="${x.buyBase}" id="buySlider">
    <div class="sliderScale"><span>10% &mdash; lowball</span><span>90% &mdash; almost no profit</span></div>
    <div class="rateRow" style="margin-top:16px"><span class="label">Least you\u2019ll clear on any buy ($)</span><input id="buyFloorNum" class="numIn rateNum" type="number" inputmode="numeric" min="0" max="500" value="${x.buyFloor}"></div>
    <div class="rateRow" style="margin-top:8px"><span class="label">Times your money back (\u00d7)</span><input id="buyMultNum" class="numIn rateNum" type="number" inputmode="decimal" min="1" max="10" step="0.1" value="${x.buyMult}"></div>
    <div class="cardHint" style="font-size:13px">These two apply everywhere rather than per category, and the tightest of the three decides. The rate bites on expensive things; the ${money(x.buyFloor)} floor stops the cheap item you haul home for nothing; the ${x.buyMult}\u00d7 bites in the middle, where a percentage looks fine and the dollars are thin. <b style="color:var(--ink)">On this one: ${esc(buyCapWhy(x))}.</b></div>
    <div class="cardHint" style="font-size:13.5px;color:var(--ink-2)">What you pay to buy it outright, as a share of the resale value. ${(()=>{
      /* The suggestion has to be THIS item's, not the shelf it stands on.
         A television carries its own rate because the category's was
         written for a phone, and quoting the phone's number under a TV
         would be the tool arguing with itself. */
      const d=x.buySuggest; if(d==null)return "";
      const why=x.buyWhy||"";
      const own=(typeof BUY_ITEM!=="undefined"&&BUY_ITEM[x.item.id]!=null);
      const forWhat=own?esc(x.item.name.replace(/\s*\u2014.*$/,"").toLowerCase()):x.cat.label.toLowerCase();
      return set&&x.buyBase!==d
        ? `Suggested for ${forWhat}: <b style="color:var(--ink)">${d}%</b> (${why}). <button id="buyReset" class="ghostBtn" style="padding:5px 12px;font-size:12px;margin-left:4px">Use ${d}%</button>`
        : `Suggested for ${forWhat}: <b style="color:var(--ink)">${d}%</b> &mdash; ${why}.`; })()} You carry the risk and hold it 30 days before you can sell.</div></div>`;
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
  if(fl)fl.onchange=()=>{ st.buyFloor=Math.max(0,Number(fl.value)||0); st.floorSet=true; persist(); render(); };
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

/* ONE SLIDER, TWO PAGES, AND NO FULL RENDER WHILE A THUMB IS ON IT.
   A render() on `input` replaces the slider node mid-drag and the drag dies
   on the first pixel - the same trap the lending-rate slider already works
   around. So the drag patches just the two things that move (the ladder and
   the rail) and the release does the real render and the save. */
function wirePawnRate(){
  const sl=document.getElementById("pawnSlider"), n=document.getElementById("pawnNum");
  const set=v=>{ st.pawnPct=Math.min(PAWN_CAP,Math.max(0,Number(v)||0)); st.pawnSet=true;
    const lad=document.getElementById("payLadder");
    if(lad){ const c=(st.mode==="metal")?(()=>{const m=calcMetal();return m?[m.loan,pawnCharge(m.loan)]:null;})()
                                       :(()=>{const x=calcItem();return [x.target,x.charge];})();
      if(c)lad.innerHTML=ladder(c[0],c[1]).map(r=>
        `<div class="widget rung"><div class="k">${r.k}</div><div class="d">${money(r.due)}</div></div>`).join(""); }
    if(st.mode!=="metal"){ try{ paintPin(calcItem()); }catch(e){} }
  };
  if(sl){ try{ paintSlider(sl); }catch(e){}
    sl.oninput=()=>{ if(n)n.value=sl.value; try{ paintSlider(sl); }catch(e){} set(sl.value); };
    sl.onchange=()=>{ persist(); render(); }; }
  if(n){ n.oninput=()=>{ let v=parseInt(n.value); if(isNaN(v))return;
           v=Math.max(0,Math.min(PAWN_CAP,v)); if(sl){sl.value=v; try{ paintSlider(sl); }catch(e){}} set(v); };
         n.onblur=()=>{ n.value=pawnPct(); persist(); render(); }; }
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
  /* "We don't need a mistake by not realizing that our bid rate or
     percentage is set to the wrong thing on a hidden window." So the share
     of melt actually going out the door rides in the header, on every
     screen, beside the price it comes off - not only on the gold tab where
     you see it if you go looking, and certainly not on Setup where nobody
     goes. The grams and the karat cancel out of buy/melt, so it can be
     said with nothing on the scale. */
  if(sy)sy.textContent=fmtDay(FEED.date)+(feedClock()?" "+feedClock():"")+" · Gold $"+Math.round(FEED.gold).toLocaleString("en-US")
    +((typeof meltPctNow==="function"&&meltPctNow("gold","buy"))?" · buying "+meltPctNow("gold","buy")+"% of melt":"")
    +" · Silver $"+Number(FEED.silver).toFixed(2)
    +(BUILD?" · build "+BUILD+(st.newBuild?" (old — "+st.newBuild+" is out)":""):"");
  if(st.mode==="item"){dealGuard();recordGuard();v.innerHTML=renderItem();wireItem();}
  else if(st.mode==="metal"){v.innerHTML=renderMetal();wireMetal();}
  else if(st.mode==="log"){v.innerHTML=renderLog();wireLog();}
  else if(st.mode==="device"){v.innerHTML=renderDevice();}
  else if(st.mode==="setup"){v.innerHTML=renderSetup();}
  /* "flags" no longer has a tab, and the rules it held are folded into
     Setup, so a mode with no page of its own lands on Setup rather than on
     a page with no way back to it. */
  else {v.innerHTML=renderSetup();}
  /* After the chain, never inside it: dropped between the last else-if and
     its else, this line stole the else, and every screen that was not
     out of date drew the walk-away list instead of itself. */
  if(st.newBuild)v.insertAdjacentHTML("afterbegin",staleHTML());
  /* Every screen, after whichever render drew it. */
  try{ wireInfo(); }catch(e){}
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
   `Metal prices refresh by themselves every ${Math.round(METAL_FETCH_MS/60000)} minutes and whenever you come back to this window, and hold still once you enter a weight (last: ${FEED.date}${feedClock()?" "+feedClock():""}). Your item prices, lending rates, and any same-day hand edits save on this device only — set them once on the counter tablet. Starting numbers are estimates for rural North Florida — the tool is only as good as what you put in it.<span class="saveNote" id="saveNote"></span>`;
}
/* Settings handed over by QR have to land before anything asks whether the
   service is on, so this runs ahead of the first draw. */
try{ pdReadHandoff(); }catch(e){}
render();
