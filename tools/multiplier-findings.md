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

- Everything above is asks. Re-run against sold comps if Insights is granted,
  or against Terapeak.
- The t8 kit multiplier itself now measures **2.5** ($280 cordless vs $110
  pneumatic), not the 2.0 in the app. 2.0 is the conservative end of the
  original measurement and was deliberately left alone — it is the lending
  side. Worth revisiting with sold data.
- h5's bare-bow figure rests on 8 listings. Thin.
