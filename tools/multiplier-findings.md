# Multiplier check — 22 Sep 2026

Five spec multipliers had never been measured. This is what the listings say.

**Everything here is ASKING prices.** eBay still has not granted Marketplace
Insights, so the service answers `sold data unavailable: this keyset is not
granted Marketplace Insights` and falls back to active listings. Asks read
high. What is used below is always a RATIO between two asks pulled from the
same search, which carries the same bias on both sides and largely cancels.
No level from this file should be treated as a sale price.

Raw listings kept in `tools/multiplier-comps-2026-09-22.json` (94 queries,
~3,600 listings).

## Results

| Spec | Option | Was | Measured | Now |
|---|---|---|---|---|
| t1 | One battery | 0.90 | **0.87** (n=263 vs 23) | 0.90 — kept |
| t1 | Combo kit | 1.15 | **1.60** (n=30) | **1.60** |
| t8 | Cordless — bare | 1.50 | **1.78** (kit × 0.89, 6 models) | **1.80** |
| h5 | Bare bow | 0.85 | **0.88** (n=8, thin) | 0.85 — kept |
| h6 | Bare crossbow | 0.85 | not measurable | **0.70** derived |
| a10 | Cordless stick | 1.20 | **1.19–1.25** (n=97 vs 117) | 1.20 — kept |

## The method that mattered: pair inside one model

Pooled across models, bare cordless framing nailers came out **dearer** than
the kits ($279 vs $268) — which is impossible, and is the same trap the drill
work hit in the spring. The bare listings were higher-end nailers. Paired
inside a single model the picture is consistent:

| Model | Bare | Kit | Ratio |
|---|---|---|---|
| DCN21PL | $185 (n11) | $293 (n4) | 0.63 |
| CF325XP | $150 (n3) | $193 (n8) | 0.78 |
| 2744 | $278 (n14) | $335 (n8) | 0.83 |
| DCN692 | $265 (n3) | $280 (n14) | 0.95 |
| 2745 | $250 (n17) | $260 (n5) | 0.96 |
| DCN920 | $292 (n16) | $280 (n3) | 1.04 |

Median 0.89. Against the kit's 2.0 that puts bare at 1.8.

## t1: the combo was the real error

A combo kit is a drill AND a second tool. It was priced at +15%; it is +60%.

| | n | Median |
|---|---|---|
| Single tool, one battery | 263 | $75 |
| Single tool, two batteries | 23 | $86 |
| Single tool, bare | 274 | $45 |
| Combo (two+ tools) | 30 | $150 |

Until combos were separated out, one-vs-two read as 0.57 — because the
two-battery bucket was mostly combos. Separated, it is 0.87 and the 0.90 in
the app was fine.

Also worth knowing: **23 of 560 real listings were a single tool with two
batteries.** The catalog treats two-batteries-plus-charger as the baseline,
but the used drill kit that actually walks in has one battery.

## h6: eBay cannot price a bare crossbow

One listing in 312 said "no scope". Crossbows are sold as packages — the same
wall the outdoor power equipment hit, where the machine is not listed because
nobody ships it.

Comparing scope-stated listings against silent ones was tried and is noise:
ratios 0.49, 0.69, 0.91, 1.12, 1.22, 1.53, 3.75 across seven brands. Silent
does not mean scopeless, it means the seller did not say.

So 0.70 is **derived, not measured**: a crossbow scope alone runs $165 (n=84)
against a $400 package. Deducting all of it gives 0.59; an accessory is worth
less bolted to a rig than sold loose, so the true figure sits above that and
well under 0.85. 0.70 is the middle, and low is the safe side to lend from.

## Still open

- Everything above is asks, and now permanently so through the API: eBay
  declined the Marketplace Insights application on 23 Sep 2026. Re-run
  against sold comps only if a sold-price source is found - Product Research
  by hand, or a licensed third party.
- The t8 kit multiplier itself now measures **2.5** ($280 cordless vs $110
  pneumatic), not the 2.0 in the app. 2.0 is the conservative end of the
  original measurement and was deliberately left alone — it is the lending
  side. Worth revisiting with sold data.
- h5's bare-bow figure rests on 8 listings. Thin.

---

# Consoles and what comes with them — 23 Sep 2026

Asked: should the desk ask how many controllers came with a console?

**No.** Sold comps through SoldComps, four consoles:

| | Console only | 2+ controllers | With games |
|---|---|---|---|
| Xbox Series X | 0.92x | — | — |
| PlayStation 5 | 0.89x | **1.03x** | **1.04x** |
| Xbox Series S | 0.94x | **0.95x** | — |
| Nintendo Switch | 0.88x | — | — |

**Extras are worth nothing.** Two or more controllers: 1.03x and 0.95x, which
is noise either side of zero. Games included: 1.04x. An Xbox with four
controllers sells for what an Xbox with one sells for. A question about it
would have three options where two are identical - a tap that costs the
counter time and changes no number.

What DOES move is having none: **0.88 to 0.94, about a tenth off**,
consistent across all four.

Sample sizes are thin in the interesting buckets - one to four listings -
so the level is soft. The direction is not: console-only never once came
out above a console with a controller.

## The bug it turned up

`completeMult` was a flat **0.7** for every category, never measured. The
measurement says a tenth for electronics, not a third.

Docking 30% for a missing controller was lending about $180 against an Xbox
Series X that resells near $500, when the same console minus a controller
really sells for about $450. It is now per-category: electronics 0.90,
measured; everything else left at 0.70 and marked in the catalog as the
guess it is.

**Worth measuring next**, in rough order of how often it bites: tools
(battery, charger, case), guns (magazine, choke tubes), instruments (case).
Each is the same shape of question and the same method.

---

# "Drill kit" meant nothing — 23 Sep 2026

The catalogue called it **"Cordless drill / driver kit"**, which said two
things at once and got both wrong. "Drill / driver" is the TOOL - not a
hammer drill, not an impact driver. "Kit" was meant to be tool plus
batteries plus charger. Then the desk asked "Kit?" on top of it.

Worse, it was named after the rarest case. 629 listings:

| What came with it | n | Median | vs a two-battery kit |
|---|---|---|---|
| **Tool only, no battery** | **274** | $45 | **0.52x** |
| One battery + charger | 266 | $75 | 0.87x |
| Two batteries + charger | 25 | $86 | 1.00x |
| Combo, a second tool | 64 | $141 | 1.64x |

**Bare is the biggest group at 274 and it was not on the list at all.** A
bare drill could only be entered as "One battery", which prices a $45 tool
at $75 - a two-thirds over-lend on the commonest thing that crosses the
counter.

The item is "Cordless drill / driver" now and the question is "What came
with it", with all four answers. The baseline stays on two-batteries so the
catalogue value does not have to move.

## The same hole in the impact wrench

t2 asks Battery platform, so it is a battery tool, and it had no way to say
the battery was gone either. Measured, and THIN - of three models only the
Milwaukee 2767 had a usable sample:

| Model | Bare | Kit | Ratio |
|---|---|---|---|
| Milwaukee 2767 | $122 (n=4) | $221 (n=8) | **0.55x** |
| DeWalt DCF899 | $125 (n=1) | $165 (n=2) | 0.76x — one listing |
| Milwaukee 2863 | $180 (n=1) | $209 (n=4) | 0.86x — one listing |

Set to **0.55**, on the one well-sampled model, and because the drill says
**0.52** off 274 bare listings independently - the same battery and the same
charger are what is missing in both. Recheck when more bare impact wrenches
are listed.

## What to look at next

Every other battery tool in the catalogue should be checked for the same
hole: a cordless item that cannot be marked bare will over-lend by about
half on what may be the commonest version of it.

---

# The battery-tool sweep — 23 Sep 2026

Every item in the catalogue that is a battery tool, checked for whether the
counter can say the battery is missing. Eight of them.

| | Item | Can say bare? | |
|---|---|---|---|
| p2 | String trimmer | yes | |
| p3 | Backpack blower | yes | |
| p4 | Push mower | **no** | on purpose — see below |
| t1 | Cordless drill / driver | **added** | 0.52, measured on 274 bare listings |
| t2 | Impact wrench | **added** | 0.55, thin — one good model |
| t3 | Angle grinder | yes | 1.35 vs corded |
| t8 | Framing nailer | yes | 1.8, measured across six models |
| a10 | Vacuum cleaner | **no** | on purpose — see below |

Two were fixed. Two look like holes and are not.

## p4 push mower — eBay cannot price it, so no number was invented

Zero of ten push mowers in the harvest came back usable, and four were
marked local-only outright: a Honda HRX217 returned **4 real machines out of
39 listings**, the rest spindles and deck belts.

Measuring bare against with-battery on that data gave bare as **DEARER, at
1.25x** — the pooled-mix trap, not a market. Per model it read 1.04, 1.52
and 0.50, and a $30 "mower" got through the filter.

A battery mower without its battery is a real thing that walks into a pawn
shop. It is just not a thing eBay can put a number on. Price it off the
shelf record and your own sales.

## a10 cordless stick vacuum — not a configuration

Checked across Dyson V8, V10 and Shark: **one bare listing in 35.** The
battery in a stick vacuum is built in, so one without a working battery is
not something people sell — it is a dead vacuum, and the condition scale
already covers that.

## The shape of the finding

Of eight battery tools, five were already right, two had a real hole, and
two apparent holes were not holes. The two that mattered were the two most
common things on a pawn counter — a cordless drill and an impact wrench.

---

# The firearms check — 23 Sep 2026

The same sweep run over the ten gun rows. It cannot end the same way,
because **none of it can be measured**: eBay bans firearm sales outright, so
SoldComps and the Browse API have never seen a gun. Every multiplier in the
guns category is a judgement nobody has checked against a sale.

What follows is therefore findings, not fixes. Nothing was changed.

## What the desk can already ask

| | Item | Questions |
|---|---|---|
| g1, g2 | Shotguns | Gauge, Barrel length |
| g3, g4, g10 | Rifles | Caliber, Optics |
| g5 | AR-15 | Caliber, Build |
| g6 | .22 rifle | Action, Optics |
| g7 | Pistol | Caliber, Size |
| g8 | Revolver | Caliber, Barrel |
| g9 | Muzzleloader | Type, Optics |

Plus the brand book, which is the strongest part of the category: 63 makers
sorted into three tiers, and the tiers are right — Benelli and Wilson Combat
at the top, Glock and Ruger in the middle, Hi-Point and Jimenez at the
bottom.

## The structural problem: accessories add dollars, not percent

An optic is worth what it is worth. The desk adds **15%**, so the same scope
is worth a different amount depending on what it is bolted to:

| Item | "Scoped — decent glass" adds |
|---|---|
| .22 rifle ($175) | **$21** |
| Bolt rifle ($275) | $33 |
| AR-15 ($650) | $78 |

A used 3-9x40 worth having is **$150–400 on its own**. So the desk pays $21
for a scope on a .22 and $78 for the same scope on an AR. Neither is right,
and the .22 case is badly wrong — scoped .22s are one of the commonest
things through a pawn counter.

The same fault runs the other way through completeness. One toggle covers
**"Magazine, choke tubes, case"** at a flat 0.70:

| Item | Missing anything at all |
|---|---|
| .22 rifle | **−$42** |
| AR-15 | **−$156** |

A Glock magazine is $25. A hard case is $20. **Both cost the same 30%.** So
a gun that is merely boxless gets docked as hard as a pistol with no
magazine — and a pistol with no magazine is the one that should hurt,
because some magazines are not obtainable at any price.

## Smaller gaps

- **g5 AR-15** folds optic and upgrades into one answer. A $1,200 LPVO and a
  $40 red dot both land on 1.15.
- **Shotgun choke tubes** are named in the completeness label but never
  asked about, and a missing set is $80–150.
- **No question about heavy modification.** A stock AR is usually worth more
  than one somebody has "improved".

## What would fix it

**GunBroker.** eBay will never carry this, so the category is unmeasurable
until a firearm marketplace is wired in. GunBroker publishes a REST API and
completed-auction data, and the desk already links out to it and to
GunWatcher by hand.

Until then the honest position is: the gun numbers rest on judgement, the
brand tiers are the part most likely to be right, and the accessory
questions are the part most likely to be wrong. **Nothing here was changed
on a guess.**

## The brand-read sweep — 26 Sep

Prompted by "Sony Laptop" lighting "Apple / Samsung flagship". Every place
the desk reads a make was checked against every make on every book. Six
holes, all fixed; two left alone and written down here.

**The reader could not see two-word makes.** It asked for one word equal to
a whole book entry, and 82 of the makes on the books are two words — Sig
Sauer, Smith & Wesson, John Deere, Harbor Freight, Black & Decker, Speed
Queen, Michael Kors and 75 others read as no make at all.

**Five read as the wrong make**, which costs money rather than silence,
because the scan stopped at the first word it recognised:

| typed | read as | cost |
|---|---|---|
| Fender Squier | Fender | +40% |
| Bosch 300 | Bosch | +40% |
| Frigidaire Gallery | Frigidaire | −45% |
| Grand Seiko | Seiko | −29% |
| ASUS ROG | Asus | −29% |

**An item's own brand list answered for other categories.** The override
belongs to the item on the counter and was applied whatever category was
asked about, so the last thing priced decided which book answered. After
pricing a Harbor Freight generator, "black & decker drill" was handed the
DeWalt row at +40%. The same search gave two different answers depending on
what had been looked at before it — the hardest kind of fault to report.

**Two-letter makes were unreachable.** A three-character floor guarded the
containment match and was applied to every match, so LG, GE, HK, FN, CZ and
DC were on the books and could not be looked up at all. An LG set the book
puts in the top tier read as no maker: −29%.

**A measured row could carry somebody else's make.** These rows are named
tools and the maker is most of what one is worth, but nothing compared it
to what was typed. "milwaukee drill" put the DeWalt row on top with the
Milwaukee row third — $65–110 offered for a tool the desk's own measured
row prices at $150–220. "john deere mower" was handed a Honda, which is not
even the same kind of machine.

**A size the desk understood counted as a miss.** The strong-match test was
built from the raw query, so in "samsung 55 inch tv" the words 55 and inch
counted as unmatched, the TV row was called a miss, and "not on the lists"
was offered above it — on the commonest thing in the shop, dropping the
make along with the row. The TV row is named "any size" and asks the screen
size itself.

### Left alone

**Harbor Freight is not in the outdoor-power book.** Typing "harbor freight
generator" lands on the generator row, the make is read and shown, and the
tier falls to standard because that book carries Generac, Champion and
Westinghouse but not Harbor Freight. Predator generators are budget, so
standard overpays. Not fixed here because the honest fix is a book entry
somebody has checked, not a guess — and the same question applies to every
maker that sells across two categories.

**"Smartwatch — Apple / Galaxy"** reads as Apple. The row names two makers
and the reader takes the first. Both are top tier in electronics so the
price is unaffected; only the word on the button is a coin toss.

Eighteen assertions in check-ask hold all of it, including a sweep over
every make on every book asserting that none reads to a tier that is not
its own.
