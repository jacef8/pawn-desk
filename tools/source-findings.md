# Adding sources — what the measurements say

22 Sep 2026. Before wiring any new marketplace into the tool, each one gets
measured against what eBay already returns for the same item.

## Reverb — measured, NOT added

Reverb's listing search needs no key at all (200, unauthenticated). Their
**price guide is closed**: `/api/priceguide` answers 403, "no longer
publicly available". So Reverb offers asking prices, same as eBay Browse.

Four instruments, 50 listings each, parts and cases filtered out:

| Item | Reverb median | eBay median | Reverb / eBay |
|---|---|---|---|
| Fender Stratocaster | $1,800 | $500 | **3.6x** |
| Gibson Les Paul Studio | $1,559 | $1,000 | 1.6x |
| Fender Rumble 40 | $240 | $110 | 2.2x |
| Yamaha FG800 | $260 | $250 | **1.04x** |

**Adding Reverb as written would have inflated every instrument in the book**,
and since resale drives the loan, the counter would over-lend on guitars.

But look at the Yamaha FG800: 1.04x. Dead level.

The FG800 is one guitar. There is no such thing as a cheap one. "Fender
Stratocaster" covers a $200 Squier-alike and a $4,000 Custom Shop, and
Reverb's mix leans to the expensive end because its sellers are dealers and
enthusiasts, not people clearing a closet. The gap is the MIX, not the
market - the same trap that made bare nailers look dearer than kits until
they were paired inside one model.

So: Reverb agrees with eBay when the model is pinned, and disagrees wildly
when it is not. It would add real comps on specific models and quiet poison
on vague ones. Not worth the risk for a category that is a handful of
pawns a month, and not until there is a reason to trust the query.

## What this says generally

More sources is not the bottleneck. Every marketplace that will talk to a
program sells ASKING prices; the ones with sold prices (eBay Marketplace
Insights, Product Research, WorthPoint) are gated, and no amount of extra
sources fixes that.

**eBay settled this on 23 Sep 2026: the Marketplace Insights application was
declined.** "Highly limited and generally reserved for eBay's approved
partners only." Ticket closed. A licensed pawnbroker running an internal
valuation tool is not who that API is for, and asking again will not change
it. The asking-price fallback is the arrangement now, not a stopgap. Four asking-price sources average to a better-supported
asking price, not to a sale.

The thing worth doing is still the calibration: twelve sold lookups by hand,
one ratio, applied to the 280 rows already harvested.

## Checked and set aside

| Source | Why not |
|---|---|
| Reverb | asks only, price guide closed, inflates on vague queries (above) |
| WorthPoint | terms forbid automated access and commercial use; robots.txt disallows /search and /worthopedia/*/price to every crawler; 403s non-browser requests |
| Google Shopping | no sold data at all - current merchant offers, skewed to new retail |

## Worth looking at

**PriceCharting.** Games, consoles, trading cards, comics, coins, LEGO -
categories eBay prices badly because the listings are lots and reprints.
Paid subscription, documented key, 1 call/second, and it returns loose /
complete-in-box / new as separate prices, which maps onto the condition
question the desk already asks. Not yet measured.

**GunBroker.** eBay does not sell firearms at all, so every gun in the
catalog is priced off a source that has never seen one. Set aside for now
at Jace's direction.
