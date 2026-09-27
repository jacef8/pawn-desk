# Review request: The Pawn Desk

You are reviewing the pricing logic of a working tool, not a coding exercise.
Please be blunt. I would rather hear that something is wrong than be told it
is fine.

## What this is

A pawnbroker's pricing desk for a small shop in Bristol, Florida. One person
uses it, standing at a counter, with a customer waiting. He types or
photographs what is in front of him, answers a short run of questions, and
the tool tells him **what to pay to buy it outright** and **what to lend on
it as a pawn loan**.

It is a static single-page app: plain HTML, CSS and vanilla JavaScript, no
build step and no framework, served from GitHub Pages. About 9,700 lines in
`app.js`. There are two surfaces — a desk browser and a phone — and the
phone has its **own copies of several panels**, which has repeatedly caused
a fix to land on one surface and not the other.

Florida law sets hard limits the code must respect: statute §539.001(11)
caps the pawn service charge at **25% of the amount financed per 30 days,
minimum $5**. A loan matures at day 30; the shop must hold the item 30 more
days; at day 60 title passes to the shop automatically. So a pawn loan is a
**60-day position in the item**, while a buy can be resold immediately. That
asymmetry drives a lot of the arithmetic.

## What I want reviewed, in priority order

### 1. The aisles and the category grouping
`CATALOG` is 11 aisles ("Firearms", "Tools", "Hunting & fishing",
"Electronics", …) holding about 90 items. Each aisle carries a loan-to-value
rate, a brand tier book, a "what kills it" line and a "what sets the price"
line. Some items override those with their own.

- Are the groupings right for a pawn shop, or are they organised the way a
  catalogue is organised rather than the way things walk through a door?
- The aisle's brand tiers are the **headline product's** makes. Hunting's
  tiers are optics — Leupold / Vortex / Zeiss — which was wrong for a trail
  camera until items got their own lists. How many other items are still
  inheriting tiers that do not describe them? (See `ITEM_OVERRIDES`: only
  about ten items have their own.)
- `FAST_DECAY` marks which aisles lose value while they sit. Is it right?

### 2. The lookups
The tool finds what a thing sells for used, through a ladder in
`findPasses` / `priceFind`:
1. **eBay Browse API** (free, via the shop's own small server). Since
   September 2026 this returns **asking prices, not sold prices** — the
   Marketplace Insights grant that gives sold data was refused.
2. **AI web search passes** for used listings.
3. **New-retail price** as a last resort.
Firearms take a different ladder entirely, because eBay bans gun sales, so
an eBay search for a Remington 870 returns barrels and stocks priced like
whole guns.

- Is the ladder sensible? Is anything missing that a US pawn shop could
  actually reach?
- `EBAY_CANNOT` / `EBAY_CANNOT_ITEM` lists things eBay is useless for
  (quads, golf carts, generators, guns). Is that list too short?
- **The honest problem:** most of the price book now rests on *asking*
  prices. I measured the ask-to-sold gap and declined to apply a blanket
  haircut — the aggregate was 1.18× but per aisle it ran 4.30×, 0.83× and
  1.06×, pointing opposite ways. Is there a defensible way to convert
  asking prices to sold prices, or is refusing correct?

### 3. The question workflow
`askQueue` builds the run: make → model → what it sells for → spec
questions → is it all there → what shape is it in → anything else. One
question per screen. Nothing is highlighted until the counter picks it,
because a pre-lit default was read as an answer already given.

- Is the order right? Is anything asked that does not move the money, or
  not asked that does?
- `calcItem` turns the answers into an offer. Walk the arithmetic and look
  for double-counting — a multiplier applied twice, a condition adjustment
  on a figure that already includes condition.
- The suggestion list (`omniRows`) and what happens on picking
  (`omniPick`). Typing a make plus a family ("microsoft xbox") must offer
  the models; a bare family must **not** silently pick one, because an Xbox
  Series X is $470 and an Xbox One is $71.

### 4. The guards
Two separate mechanisms decide how far below the measured price to lend:
- **Metals** (`metalGuard`, `metalTrend`): measured from every LBMA gold and
  silver fixing back to 2000. For each day, what a 60-day hold was worth
  when it ended; the 5th percentile of that is the haircut. Volatility
  conditions it — gold's 5th-percentile 60-day loss is 6.5% when calm and
  12.1% when violent. A buy is measured over a 10-day hold instead.
- **Items** (`itemGuard`): there is not enough history for a trend read (5
  days), so instead it measures the tool's own **repeatability** — the same
  lookup re-run days apart moved the answer a median of 17.3%. The guard
  comes from evidence quality, sample spread, and age.

Is this sound, or is it false precision? Am I charging the same doubt twice
anywhere — the guard lowers the per-ounce price *and* the trend read lowers
the rate, and I tried to keep those separate.

## Things I already know, so you need not find them

- `stepFlow()` always returns `"ask"`, so several older layouts are dead
  code, including a browse list and `#nextStep`. I measured this; I have not
  yet removed them.
- The phone duplicates panels from the desk rather than sharing them.
- 161 price rows dated 19–22 Sep 2026 came from AI web research and were
  never verified against live listings.
- 74 firearm rows rest on a source (GunWatcher) that cannot be read
  automatically and has not been checked by hand.
- `WORTHPOINT_SEARCH` and `FB_MARKETPLACE_SEARCH` are unverified URL shapes.

## What I would like back

1. **Correctness bugs first** — anything that produces a wrong number, in
   priority order, with the input that triggers it. A wrong offer is the
   only kind of bug that costs money.
2. **Where the domain model is wrong** — a grouping, a tier, a question or
   a multiplier that does not match how pawn actually works. You may know
   the trade better than I do; say so where you do.
3. **What is missing** — a question that should be asked, a source that
   should be in the ladder, a check that should exist.
4. Only then, code quality.

Please cite the function or the data you are talking about. If you are
uncertain, say you are uncertain rather than guessing — I would rather have
five findings I can act on than thirty I have to triage.

The code follows. It is the core of the tool: the catalog and its data, the
question run, the offer arithmetic, the search and matching, the lookup
ladder, and the guards. Ask me for any other part and I will paste it.
