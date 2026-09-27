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
| WorthPoint | **for automation, still no** — terms forbid automated access and commercial use; robots.txt disallows /search and /worthopedia/*/price to every crawler; 403s non-browser requests. **Wired as a LINK OUT on 24 Sep** for jewelry, collectibles and instruments: a person clicking through to a site they subscribe to is ordinary use, a program fetching it is not, and the desk never reads a number back. $29.99/mo or $249.99/yr, 7-day trial; Jace has no subscription yet, so the button lands on their signup wall until he does. The search URL could not be verified from here for the same robots.txt reason — it is one constant, `WORTHPOINT_SEARCH` in app.js, to correct from the address bar after one real search. |
| Google Shopping | no sold data at all - current merchant offers, skewed to new retail |
| Facebook Marketplace (scraped) | **no.** No public listings API, and Meta's terms forbid automated collection; the only way in is a third-party scraper actor, which costs a couple of dollars a run and puts the shop's name on the wrong side of somebody else's terms for asking prices we can get for free by tapping a link. **Wired as a LINK OUT on 25 Sep instead** — see below. |

## Facebook Marketplace and Craigslist — added as link-outs, 25 Sep 2026

Eighteen aisles carry a notice saying the desk will not look this up and to
price it locally. The comps card then offered four buttons, every one of
them pointing at eBay — the place the notice had just finished saying does
not carry it. The instruction was right and there was nowhere to follow it
to.

Two buttons now appear on exactly those aisles, and nowhere else:

- **Facebook Marketplace** — where a mower, a window unit or a generator
  actually changes hands around here. It opens in the counter's own
  signed-in session, which is also what keeps the results local: Marketplace
  searches around wherever that account sits, and these devices sit in
  Bristol.
- **Craigslist, Tallahassee** — the whole panhandle, no sign-in.

Both are **asking prices** and are labelled as such on the button. That is
not a step down on these aisles: there is no sold data for a used window
unit anywhere a program can reach, and a neighbour's asking price forty
miles away is a truer read on what one brings in Liberty County than a
national average of control boards.

**Link-outs only, and that is the whole point.** Facebook has no public
Marketplace listings API and its terms forbid automated collection, so the
desk can never read a number back off it — no auto-fill, no row in the
book, nothing to go stale. The same line WorthPoint sits on. Scraping it
through a third-party actor was considered and declined: a couple of
dollars a run to obtain, against the terms, asking prices that a tap
already gives us for nothing.

Not guns. Facebook bans firearms outright, so that search comes back empty
or full of holsters, and GunWatcher is the real comp there.

**Unverified from here, same as WorthPoint.** Facebook will not serve a page
to anything that is not a signed-in browser, so the search URL is the shape
their site uses rather than one anyone here loaded. It is one constant,
`FB_MARKETPLACE_SEARCH` in app.js. If a tap lands somewhere useless: one
real search on facebook.com, copy the address bar up to and including the
`=`, paste it in. The comps card has a Copy button for the search words, so
it is never a dead end.

## Worth looking at

**PriceCharting.** Games, consoles, trading cards, comics, coins, LEGO -
categories eBay prices badly because the listings are lots and reprints.
Paid subscription, documented key, 1 call/second, and it returns loose /
complete-in-box / new as separate prices, which maps onto the condition
question the desk already asks. Not yet measured.

**GunBroker.** eBay does not sell firearms at all, so every gun in the
catalog is priced off a source that has never seen one. Set aside in
September at Jace's direction; picked back up on 28 Sep.

### Firearm sources, tested 28 Sep 2026

Every marketplace worth quoting refuses a script. These are the sites
themselves blocking bots, not our network - a person in a real browser
still gets through, which is why the buttons that OPEN a search still
work. What none of them can do is let the desk fetch a price.

| source | result |
|---|---|
| GunBroker | 403, Cloudflare challenge |
| Armslist | 403, Cloudflare challenge |
| Guns.com | 403, Cloudflare |
| GunsAmerica | 403, Cloudflare |
| TrueGunValue | 403, Cloudflare |
| GunWatcher (what all 74 rows came from) | 403, Cloudflare captcha |
| Rock Island Auction | 403, Cloudflare |
| GunAuction | 403, Cloudflare |
| Impact Guns, Buds | 404 on the search paths tried |
| **KYGUNCO** | **200, readable, 48 products a page** |

KYGUNCO is a retailer, so what it gives is NEW retail. That is not a comp
and no used gun should ever be priced off it. What it IS is a hard
ceiling that nobody has to grant us access to: a used gun booked above
what a new one costs is wrong whatever the source, and that is checkable
today. tools/gun-ceiling.mjs does it.

Two traps, both hit on the first run:

*Parts read as guns.* "REMINGTON 870 Express Shotgun Barrel" at $124.99
became the price of an 870, side rails became the price of a Maverick 88,
and a $2.99 magazine plug became the price of an 1100 - the same
parts-for-machines mistake the app was fixed for in September, repeated
in the tool checking it. Excluding parts vocabulary outright is wrong
too: a "MOSSBERG 590 Heat Shield 12Ga 20in 9rd" is a whole shotgun. A
parts word now only disqualifies a listing carrying no sign of being a
complete firearm - a capacity, an action, or a gauge-and-length pair.

*The cheapest is not the price.* Browning lists barrels as "SB BPS STK
98,12-3,24", which carries a gauge and a length and so survives the
filter. Real BPS shotguns are $611-817 there; those barrels are $261.99.
Taking the minimum said a new BPS costs $262. The median says $667. The
ceiling is built from the middle of the listings, which survives a few
bad ones.

### Outdoor Analytics on Tableau Public — the first real gun comp

https://public.tableau.com/shared/5RMJPZ22G — "Top Selling Firearms by
Month" by Tim Lafferty, badged Outdoor Analytics. Found by Jace on 28 Sep
after his own GunBroker account was blocked.

**Top Selling USED Firearms on GunBroker.com**, by month, filtered by
firearm type (bolt action, lever action, over/under, pump shotgun,
revolver, semi-auto pistol / rifle / shotgun) and by condition — New or
Used. Each type lists top brands and top model FAMILIES with market
share and **median sell price**. Sold prices, used, by model. That is
exactly what the gun aisle has never had.

August 2026, bolt action rifles, used, against our book:

| model | ours | GunBroker used median | ours |
|---|---|---|---|
| Remington 700 | $450-700 | $1,024 | mid is 56% |
| Browning X-Bolt | $700-900 | $1,028 | 78% |
| Winchester Model 70 | $750-975 | $1,010 | 85% |
| Tikka T3 | $650-825 | $853 | 86% |

Four of the top eight are not in our book at all: Ruger M77 Hawkeye
$922, Ruger Mark II $1,005, Browning A-Bolt $829, Weatherby Mark V
$1,388.

**Read family medians carefully.** "Remington 700" pools a base ADL with
custom and tactical builds, which is why its median sits ABOVE the $792
new-retail figure KYGUNCO gives for the same name. A family median is a
centre of gravity for the name, not the price of the plain one. Our rows
are generic, so the right comparison is probably the lower half of each
family rather than its middle.

Also national rather than north Florida, and one month. Still the best
gun evidence available to us by a distance: everything else either
refuses a script or sells new.

Getting it out: the viz carries Tableau's own Download button, which is
the one-click route to a crosstab CSV. The underlying vizql endpoint
exists - bootstrapSession answers 405, so it is there and wants a POST
with a session token - but reaching it needs a rendered page, and this
container's headless Chromium cannot open external HTTPS at all
(ERR_CERT_AUTHORITY_INVALID: the proxy re-terminates TLS and certutil is
not installed to put its CA in the browser's NSS store). curl trusts the
CA fine, which is why every other source here could be tested. So the
browser is the blocked part, not the network.
