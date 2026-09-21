# Price findings

What a search of the open web says about the numbers the tool ships with.
Nothing here has been applied — these are notes for the counter to decide on.

## Read this before you use any number below

**Everything in this file is built on asking prices, not sold prices.** It
came out of web searches, and a web search can only see listings that are
still up. The overpriced one that sat for six months is still in the index;
the one that sold in a day is gone. So the numbers here read **high**, and
high is the wrong direction to be wrong in when you are lending against them.

That is why the appliance pass below was stopped at 7 of 31 rows: four of six
would have moved prices UP, on listings nobody bought.

Since these notes were taken the service has been wired to **eBay's own API**
(`POST /ebay`, see `server/README.md`), which can return what things actually
**sold** for. Once that keyset carries the Marketplace Insights grant, rerun
the harvest and it will produce sold comps instead:

    PAWN_SERVER=… PAWN_TOKEN=… node tools/harvest.js --ref t1 --go
    node tools/harvest.js --merge --sold-only

**Nothing in this file has been applied to the price book, and nothing in it
should be, except as a sanity check against sold numbers when they arrive.**

Where a row says "local", the item is heavy or doesn't ship, so there is no
online sale to find at all — eBay will not fix those. A refrigerator, a
60-gallon compressor and a rolling tool box are read off the local market or
not at all.

## Appliances — 21 Sep 2026

Checked 7 of 31 rows, then stopped: 5 of 7 rested entirely on asking prices
and 1 found nothing. Four of the six priced rows would have moved UP.

| Row | Book | Search median | Listings | Sold | Verdict |
|---|---|---|---|---|---|
| Range / oven | $150 | — | 0 | 0 | nothing found |
| Refrigerator | $240 | $400 | 13 | 0 | asking only, spread $100–$14,999 — ignore |
| Washer & dryer pair | $375 | $450 | 17 | 0 | asking only — ignore |
| Washer | $175 | $285 | 2 | 0 | asking only, thin — ignore |
| Dryer | $175 | $100 | 9 | 1 | one real sale at $100; worth a look |
| Window air conditioner | $80 | $187 | 2 | 0 | asking only, thin — ignore |
| Microwave | $35 | $35 | 11 | 0 | asking only, but agrees — leave |

**Conclusion: change nothing in appliances.** Big appliances sell on Facebook
Marketplace and in the classifieds, not on eBay — nobody ships a refrigerator.
The whole category is a local-market read, and the tool should say so rather
than offer a researched-looking number.

## Tools — the eight everyday items, 21 Sep 2026

| Row | Book | What the searches found | Verdict |
|---|---|---|---|
| t1 Cordless drill kit | $110 | DeWalt 20V kits $90–130; DCD771 complete $85–120; M18 combo $200–350 | **confirmed** |
| t2 Impact wrench | $130 | M18 FUEL 3/8" $127, 2864-20 $171, high-torque $200; DeWalt DCF900 $180; older $28 | **confirmed** |
| t3 Angle grinder | $45 | corded ~$45; cordless brushless $63–136, DeWalt average $108 | right for corded, **half** what a cordless is worth |
| t4 Pancake compressor | $70 | no used data; new retail $190, which implies ~$76 used | leave |
| t5 60-gal upright compressor | $250 | nothing — too heavy to ship | **local** |
| t6 MIG welder 110v | $250 | new Lincoln 140C $500+; used Lincoln 110v with tank and cart $300; Hobart 140 with table $800 | **confirmed**, low for a complete rig |
| t7 Rolling tool box | $150 | not searched — heavy, local | **local** |
| t8 Framing nailer | $120 | used Paslode from $95, F350-S $110; cordless M18 $230, Ryobi $299 | **slightly high** for pneumatic (~$105), low for cordless |

### The finding that matters more than any single number

Two rows — the angle grinder and the framing nailer — are wrong in *both*
directions at once, because one row is covering two different tools. A corded
grinder is $45 and a cordless brushless one is $108. A pneumatic nailer is
$105 and a cordless one is $230. Whichever number sits in the row, the counter
is wrong half the time, and moving it just moves which half.

**Correction, later the same day:** the tool already asks this. t3 has a
Power group (Corded / Cordless with battery / Cordless bare) and t8 has a
Drive group (Pneumatic / Cordless). The question was never missing — the
*multipliers behind it* were far too small:

| Row | Was | Gave | Is now | Gives |
|---|---|---|---|---|
| t3 cordless with battery | ×1.1 | $49 | **×2.4** | $108 |
| t3 cordless bare | ×0.6 | $27 | **×1.35** | $61 |
| t8 cordless with battery | ×1.2 | $144 | **×2.0** | $240 |

t8 also gained a **Cordless — bare** option it never had (build 0926.1200,
×1.5 → $180). That figure is not measured: a complete cordless nailer is
about $240 and the battery and charger are $60-70 used, leaving ~$180 for
the tool. It is a placeholder to be checked against sold comps.

Applied 21 Sep 2026, builds 0926.1100 and 0926.1200. The corded and pneumatic baselines were
not touched, and they are still the default answer, so an unanswered lookup
returns exactly what it did before.

Why these were safe to change on asking-price evidence when nothing else was:
a **ratio** between two asks taken from the same search carries the same
upward bias on both sides, and it largely cancels. "A cordless grinder is
worth about 2.4x a corded one" survives both figures being 30% high; "a
corded grinder is worth $45" does not. Levels still wait for sold data.


### Rows checked after those eight, 21 Sep 2026

**These are not price-book rows.** The "Book" column below is the `ask` field
from `seed-shelf-prices.json` — other shops' shelf tags, a file used only by
`tools/backtest-shelf.js` and never loaded by the app. So this table compares
asking prices against asking prices, which is close to no check at all. The
tools catalog is t1-t8 and nothing else; none of the items below exist in it.

Kept only because the within-row observations (corded against cordless, hobby
brand against professional) are ratios, and ratios survive the bias. The
levels do not. **Do not apply any number in this table.**

| Row | Book | What the searches found | Verdict |
|---|---|---|---|
| Miter saw | $150 | $50–220 across brands | agrees |
| Circular saw | $50 | corded $107 asking; cordless $83–130 | one row, two tools again |
| Plasma cutter | $300 | Hypertherm $950–1,072; budget units $150–250 | one row, two tools — a very expensive gap |
| Paint sprayer, airless | $180 | Graco X5 $150–230 | agrees |
| Benchtop planer | $180 | DW735 $200–450, new $750 | reads low |
| Stick welder | $180 | Lincoln AC-225 $100–175 | reads high |
| Stand mixer | $120 | $55–200 | agrees |
| TIG/stick welder | $320 | new Primeweld $500, implying $250–300 used | thin |
| Floor jack | $60 | fine for a basic one, low for a Daytona | one row, two tools |
| Laser level | $90 | cross-line agrees; rotary $275–330 | one row, two tools |
| OBD scan tool | $50 | basic agrees; bidirectional Autel $200–400 | one row, two tools |
| Band saw, benchtop | $160 | only new retail — WEN $149, Rikon $299–570 | no used data |

The pattern is the same one the grinder and the nailer showed: **eight of the
twelve rows above are a single price covering two different tools** — corded
against cordless, hobby brand against professional. Worth remembering if any
of them ever becomes a catalog row. None of them is one today.
