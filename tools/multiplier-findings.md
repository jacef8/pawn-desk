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
