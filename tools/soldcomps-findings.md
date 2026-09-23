# SoldComps — measured 23 Sep 2026

The free tier was tested against a control before anything was wired in.
Result: the data is real, one methodology bug nearly produced a backwards
finding, and asks run about 9% high rather than the 30-40% feared.

## The control passed

eBay's own Product Research, read by hand out of Seller Hub, put the
"barnett crossbow package scope" 90-day sold average at **$308.45**.

SoldComps, same search: **$349 average, $279 median, 25 sales.** Within 13%
on a like-for-like average. Genuine eBay crossbow sales, not invention.

## The bug that nearly produced a false finding

First pass said sold prices were HIGHER than asking - 1.11x across the
board, which would have overturned the whole basis of the project.

Two causes, both mine:

**A blunt junk filter.** The first run used the simple regex from the
multiplier work, which does not know "Hyway High-Quality Piston Kit
Compatible with Stihl MS261, MS271" is a part. Re-running through the
pipeline's own `fitOf` classifier moved the Ravin crossbow from 0.35x to
0.77x and dropped 24 parts listings out of 40 on the Hitachi nailer.

**Condition mix — the big one.** Our eBay call filters to used conditions
(`conditionIds:{3000|4000|5000|6000|2000|2500}`). SoldComps does not filter
at all, and **a third to half of every sold sample was BRAND NEW**:

| Item | sold records | new | used |
|---|---|---|---|
| Shark upright vacuum | 35 | 18 | 14 |
| Dyson V8 | 31 | 16 | 12 |
| Milwaukee 2744 | 35 | 16 | 13 |
| Milwaukee 2904 | 31 | 13 | 10 |

New sales against used listings. Of course it read high.

## With used-condition on both sides

| Item | Sold (used) | Asking | Ratio |
|---|---|---|---|
| DeWalt DCD777 | $45 | $42 | 1.07 |
| Milwaukee 2904 | $98 | $95 | 1.03 |
| Milwaukee 2744 | $280 | $283 | 0.99 |
| Barnett crossbow | $225 | $270 | 0.83 |
| Shark upright | $100 | $135 | 0.74 |
| Dyson V8 | $99 | $169 | 0.59 |

**Median 0.91x.** Spread 0.59 to 1.07.

**Power tools need no correction at all** - 0.99 to 1.07. The gap is in
vacuums and electronics. That is a category problem, not a global one, and
it is exactly why a single correction factor should not be applied: it
would have cut tool prices that were already right.

## Dates

Advertised as 90 days. A handful of stragglers go back further - one DCD777
sale from Sep 2025 - but 21 of 23, 34 of 36, 35 of 35 fall inside 90 days,
and restricting to 90 moves the medians by a few dollars. Filter to 90 days
anyway; do not assume it.

## What this means

Do not build a correction factor. A correction factor is what you use when
sold prices cannot be had. They can now, for $9/month - 610 targets fits
inside the 2,000-request Starter plan with room over.

Switch the harvest to sold prices and the whole question disappears: no
ratio, no calibration, no hedging in the app.

**Two things to build in before it touches a price:**

- **conditionId filter.** Used only: 2000, 2500, 3000, 4000, 5000, 6000.
  Never 1000 (new), never 7000 (for parts). This is the bug above, and
  without it every row inflates.
- **90-day cutoff** on `endedAt`.

## Caveat worth keeping in view

Their endpoint is `/v1/scrape`, and eBay put sold listings behind a sign-in
wall on 22 July 2026. This is a business standing on ground eBay is actively
fencing off. Keep eBay Browse underneath as the fallback - it already is -
so the desk degrades to asking prices rather than to nothing.
