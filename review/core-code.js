
/* ===== CATALOG — the aisles and their items (app.js) ===== */
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
   /* Measured 24 Sep: a generic "acoustic guitar" search returns 17 real sales, median $99, quartiles $43-$248. 99/0.8 is 124. The old $110 was close and is now exact */
   {id:"m1",name:"Acoustic guitar",value:124,liq:"slow"},
   {id:"m2",name:"Electric guitar",value:150,liq:"slow"},
   /* Measured 24 Sep: "guitar amplifier", 18 real sales, median $135, quartiles $75-$275. 135/0.8 is 169. The old $100 priced every amp at $80 resale */
   {id:"m3",name:"Amplifier",value:169,liq:"slow"}]},
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

/* ===== ITEM_OVERRIDES — per-item makes, tiers, detail hints (app.js) ===== */
const ITEM_OVERRIDES={
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

/* ===== BRANDBOOK — makes per aisle (app.js) ===== */
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

/* ===== SPEC_CHOICES — the spec questions (app.js) ===== */
const SPEC_CHOICES={
 g1:[CH_GAUGE,CH_BARREL],g2:[CH_GAUGE,CH_BARREL],
 g3:[CH_CALIBER,CH_OPTIC],g4:[CH_CALIBER,CH_OPTIC],
 g5:[CH_CALIBER,{label:"Build",options:[{t:"Basic / irons",m:1},{t:"Optic + real upgrades",m:1.15,note:"upgraded build: +15%"}]}],
 g6:[{label:"Action",options:[{t:"Semi-auto (10/22 class)",m:1},{t:"Bolt / single-shot",m:.85,note:"bolt/single .22s sell slower: −15%"}]},CH_OPTIC],
 g7:[CH_CALIBER,{label:"Size",options:[{t:"Full / compact",m:1},{t:"Pocket (.25/.380 junk-class)",m:.8,note:"pocket-class: −20%"}]}],
 g8:[CH_CALIBER,{label:"Barrel",options:[{t:"3–6 in",m:1},{t:"Snub 2 in",m:1},{t:"7 in + hunter",m:.9,note:"long hunter barrel — narrower market: −10%"}]}],
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
 t1:[CH_VOLT,{label:"What came with it",options:[
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
  {label:"What came with it",options:[
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
 r1:[CH_TITLE,{label:"Condition to tow",options:[{t:"Ready to tow",m:1},{t:"Needs lights / wiring",m:.85,note:"wiring work: −15%"}]}],
 r2:[CH_TITLE,{label:"Class",options:[{t:"Full-size (400cc +)",m:1},{t:"Youth quad",m:.7,note:"youth quad — smaller market: −30%"}]}]};

/* ===== askQueue — the question run (app.js) ===== */
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
  if(cat.brand.on){
    const tiers=(ov&&ov.tiers)||cat.brand;
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
      hint:known?""
        :unknownTyped?"<b>"+esc(st.brandTyped)+"</b> is not on the list for "
          +esc(String(cat.label||"this").toLowerCase())+" \u2014 say where it sits and the price follows."
        :"Nothing picked yet \u2014 the price is using the standard tier until you say.",
      answered:known});
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
    hint:"Model number or name, and anything that changes the price. Skip it if you cannot see one.",
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
    answered:!!(st.model||st.mpNone)});
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
    hint:"", kind:"worth", answered:!!x.checked});
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
      answered:st.specSel[key]!=null});
  });
  if(cat.complete.on){
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
    opts:CONDITIONS.map(c=>{const w=COND_WORDS[c.id]||[c.label,""];
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
    answered:true});
  return q;
}

/* ===== calcItem — the offer arithmetic (app.js) ===== */
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
  const namedBrand=(cat.brand.on&&!st.brandTyped&&!st.brandSet)
    ? brandFromName(cat.id,(item.name||"")+" "+(st.model||"")+" "+(st.bookName||"")) : null;
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
          brandMult,brandName:cat.brand.on?(((ITEM_OVERRIDES[st.itemId]||{}).tiers)||cat.brand)[brandTier]:null,spec,specMult:spec.mult,
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

/* ===== omniParse — reading the typed words (app.js) ===== */
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

/* ===== omniRows — the suggestion list (app.js) ===== */
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
      MODEL_PRICES.map(r=>{ const nw=omniWords(r[2]); let s=0; for(const w of keys){ const h=wordHit(w,nw); if(!h)return null; s+=h; } if(omniNorm(r[2]).indexOf(omniNorm(q))>=0)s+=5;
          if(qb){ const rb=rowBrand(r);
            if(rb&&!sameMaker(rb,qb))return null;
            if(rb)s+=6; }
          return {r,s}; })
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
      /* A word the parser already PLACED is not a word the entry has to
         carry. "samsung 55 inch tv" was built from the raw query, so 55
         and inch counted as unmatched, the TV row was called a miss and
         "not on the lists" went above it - on the commonest thing in the
         shop, and the make was dropped along with the row. The TV row is
         named "any size" and asks the screen size itself; the size is an
         answer to that question, not evidence of a different item. */
      const placed=omniWords(P.detail.join(" ")+" "+Object.values(P.spec||{}).join(" "));
      const need=omniWords(q).filter(w=>!STOP.has(w)&&bw.indexOf(w)<0&&placed.indexOf(w)<0);
      const top=sc.slice().sort((a,b)=>b.s-a.s)[0].e;
      strong=!!P.modelLabel||!need.length||need.every(w=>wordHit(w,top.words));
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
      rows.splice(strong?(before<0?rows.length:before):0,0,own);
    } }
  return {P,rows};
}

/* ===== omniPick — what happens when a suggestion is picked (app.js) ===== */
function omniPick(r){
  if(!r||r.kind==="sold")return;
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
    st.mpNone=!kindFromMake;
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
  st.brandTyped=r.brand||"";
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
  st.photoRead=null; st.compRead=null; st.market=null; st.mpPin=null; st.mpNone=false; st.condSet=!!r.cond; if(!r.cond)st.cond="good";
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
  st.askAt=firstOpenAsk(calcItem());
  render();
  try{ autoPriceOnPick(); }catch(e){}
  if(st.editing){ const vi=document.getElementById("valIn"); if(vi)vi.focus(); }
  else if(!matchMedia("(min-width:1080px)").matches){ const c=document.getElementById("nextStep")||document.querySelector(".colC"); if(c&&c.scrollIntoView)c.scrollIntoView({behavior:"smooth",block:"start"}); }
}

/* ===== mpFor — matching typed words to a priced row (app.js) ===== */
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

/* ===== marketNow — which measured price is in play (app.js) ===== */
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

/* ===== compQuery — the words a lookup actually searches (app.js) ===== */
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
    ? [st.brandTyped, st.model, st.detail||"", specQuery()]
    : [st.brandTyped||"", st.model||"", displayName(x).replace(/\s*—.*$/,""),
       st.detail||"", specQuery()];
  return bits.map(s=>String(s).trim()).filter(Boolean).join(" ").slice(0,120);
}

/* ===== itemFromBrand — the make names the item (app.js) ===== */
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

/* ===== sameMaker — a maker and its product lines (app.js) ===== */
function sameMaker(rowBrand,typed){
  if(!rowBrand||!typed)return true;
  const r=omniNorm(rowBrand), t=omniNorm(typed);
  if(r===t)return true;
  if(makerOf(r)===t)return true;               /* the row is a line of what was typed */
  return r.indexOf(t)>=0||t.indexOf(r)>=0;     /* "sig" and "sig sauer" */
}

/* ===== itemGuard — how firm an item price is (app.js) ===== */
function itemGuard(x){
  const m=x&&x.market;
  if(!m||!x.checked||!INOISE)return null;
  const mid=Number(m.mid)||0, lo=Number(m.lo)||0, hi=Number(m.hi)||0;
  if(!(mid>0))return null;
  /* A figure the counter typed is about THIS thing, in their hands. There
     is no sampling error to guard against - they looked at it. */
  if(m.kind==="hand")return {kind:"hand",mid,guard:mid,cut:0,why:[],warn:false,
    head:"Your own number for this one",
    detail:"You typed this in, so it is about the thing in front of you rather than a sample of listings. Nothing to guard."};
  const ev=(typeof rowEvidence==="function")?rowEvidence(m.note):{kind:"research",n:0};
  const spread=(hi>lo&&mid>0)?(hi-lo)/mid:0;
  const age=Number(m.age)||0;
  const decay=FAST_DECAY[x.cat&&x.cat.id]||0;
  const why=[];
  let cut=0;
  /* Short phrases, not sentences: they are read at a counter with somebody
     waiting, and they get stacked into one line. */
  if(ev.kind==="asking"){ cut+=INOISE.noiseMid/2;
    why.push(`${ev.n||"a few"} asking prices, not sales`); }
  else if(ev.kind==="research"){ cut+=8; why.push("researched, never measured"); }
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

/* ===== metalGuard — the metals risk guard (app.js) ===== */
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

/* ===== metalTrend — the metals trend read (app.js) ===== */
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

/* ===== suggestPay — the suggested rate (app.js) ===== */
function suggestPay(){
  const spot=spotOf(st.metal), avg=avgOf(st.metal);
  if(!avg||avg<=0)return null;
  const prem=(spot-avg)/avg;
  const base=st.metal==="gold"?70:62;
  let cut=0, why;
  const p=Math.round(prem*100);
  if(prem>0.15){cut=st.metal==="gold"?10:12; why=`today's price is ${p}% over its 90-day average — that is a hard spike, and spikes like this usually snap back; the discount is your insurance for the 30-day hold`;}
  else if(prem>PEAK_OVER){cut=st.metal==="gold"?8:10; why=`today's price is ${p}% over its 90-day average — peak conditions; sellers are walking in anyway, you don't have to pay up to win deals`;}
  else if(prem>0.05){cut=4; why=`today's price is ${p}% over its 90-day average — running warm, trim a little`;}
  else if(prem<-0.05){cut=0; why=`today's price is ${Math.abs(p)}% UNDER its 90-day average — hold the normal rate and ship on day 31 like always; "it's cheap" is not a reason to buy heavy`;}
  else {cut=0; why=`today's price is close to its 90-day average — nothing unusual happening, so use the normal rate`;}
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
  /* The trend's own word, added to the level rule above. Small on purpose:
     the guard price has already taken the big cut off the per-ounce figure,
     and the same worry must not be charged twice. */
  const T=(typeof metalTrend==="function")?metalTrend(st.metal):null;
  /* Carried separately so the card can show what the rate would be WITHOUT
     the trend read. A suggestion you cannot see the alternative to is not a
     suggestion, it is just the number. */
  const bare=Math.max(50,base-cut);
  if(T&&T.cut>0){ cut+=T.cut; why+=`. And ${T.detail.replace(/\.$/,"")}`; }
  return {pay:Math.max(50,base-cut), bare, why, trend:T};
}

/* ===== findPasses — the lookup source ladder (app.js) ===== */
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

/* ===== priceFind — running a lookup (app.js) ===== */
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
    if(!all&&got.length>=ENOUGH){ break; }
  }
  /* What a new one costs, gathered in the same sweep. It is the weakest
     number here and it is never chosen over a sale, but it is the one that
     answers "is this worth anything at all" when nothing else lands. */
  let retail=null;
  if(all&&!(signal&&signal.aborted)){
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

/* ===== itemsByUse — ordering by what came in (app.js) ===== */
function itemsByUse(cat){
  const items=(cat&&cat.items)||[];
  const n=itemCounts(cat&&cat.id);
  if(!Object.keys(n).length)return items.map((it,i)=>({it,seen:0,i}));
  return items.map((it,i)=>({it,seen:n[it.id]||0,i}))
              .sort((a,b)=>b.seen-a.seen||a.i-b.i);
}

/* ===== catsByUse — the same for aisles (app.js) ===== */
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
