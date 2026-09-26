# The weekly harvest: standing rules

Read this at the start of every run. It is the operating manual, and it wins
over anything remembered from a previous week — when a rule changes it
changes here, in git, where the change is visible and reversible.

## The loop

    node tools/harvest.js --go        # price every outstanding target
    node tools/harvest.js --merge     # fold the findings into prices.json
    node tools/sync-book.mjs          # copy the rows into app.js's fallback

Then the suites, then commit, then push to `main`.

The ten suites, all of which must pass before the push. They need
`python3 -m http.server 8099` running:

    check-merge  check-pricing  check-screens  check-lookup  check-wizard
    check-ask    check-ebay     check-soldcomps  check-contrast  check-search

`PAWN_TOKEN` must be set. `PAWN_SERVER` has a default and rarely needs one.

## What to commit, and what never to touch

Commit **`prices.json`, `app.js` and `tools/price-changes.md`**. Nothing else.

> **If your instructions say "`prices.json` and `tools/price-changes.md`,
> nothing else", they are quoting an older version of this file.** That
> wording is superseded as of 24 Sep 2026. `app.js` carries a second copy
> of the book and `check-merge` fails if it is left behind, so a run that
> follows the older line spends its lookups and then halts on the suites.
> This file wins — that is what the first line of it says.

`app.js` is on that list now, and only because of `MODEL_PRICES`. The book
lives in two places: `prices.json`, fetched on every load, and a copy in
`app.js` for a device that cannot reach the file at all. They drifted 171
rows apart once — a harvest wrote one and nothing wrote the other — so a
disconnected tablet fell back on half a book. `check-merge` now refuses to
pass unless the two are byte-identical.

**`node tools/sync-book.mjs` is how you make them match.** Never by hand:
the first attempt at it used a blanket `", "` → `","` replace that reached
inside the strings and turned "AR-15, entry-level" into
"AR-15,entry-level". `--check` reports drift without writing, and exits
non-zero, so it can gate the commit.

**Do not bump `APP_BUILD` in app.js or the cache key `C` in sw.js on a
price-only run — including one that rewrote the `MODEL_PRICES` block.** The
service worker is network-first: it calls `fetch()` for everything and only
falls back to the cache when the device is offline. Both the new
prices.json AND the new app.js are picked up on the very next page load
with no cache bump at all. Bumping forces every phone and the desk PC to
re-download the whole app for nothing.

Bump the build only when a run changes what the app DOES — app.css,
phone.js, sw.js, or app.js beyond its price rows. A harvest should not.

Never open a pull request. Never touch app.js to "fix" a price; prices live
in prices.json.

## Firearms: leave them out

eBay bans gun sales outright. Anything that comes back for a firearm target
is a barrel, a stock, an optic, a holster or an airsoft replica, priced as
though it were the gun. A $180 "Remington 870" is a barrel.

Do not merge firearm rows from eBay or SoldComps, whatever the numbers say.
If the price book is to carry guns they come from GunBroker, which is not
wired in.

## The three flags that are not yours to pass

- **`--force`** overrides the circuit breaker. The breaker exists because
  this run pushes to `main` unread. If it fires, stop and report the biggest
  movers it printed and what you think went wrong. A halted week is free.
- **`--wild`** merges rows the sanity band rejected for being far from what
  the catalogue says the item is worth. Those are a bad search, not a
  bargain.
- **`--min` below 4.** Under four listings a median is a rumour.

If a row will not merge cleanly, the answer is to find out why. Never
hand-edit prices.json to get a run through.

## Sold prices, and the quota

The service returns real SOLD prices through SoldComps when the key is set,
and falls back to eBay asking prices when it cannot. Each comp says which it
is, and the fallback says WHY — "only 2 used sales in 90 days" is a
different thing from a spent quota, and both are worth repeating in the
report rather than summarising away.

**The quota is finite**, and the arithmetic matters:

| | |
|---|---|
| Targets in the seed list | **971** |
| Lookups per target | up to 2 (a second only when the first is thin) |
| A full sweep | up to **1,942 requests** |
| The $9 Starter plan | **2,000 requests a month** |

That table used to say 610, and the margin it implied no longer exists. At
971 targets a single full sweep is 97% of the month. **A wasted sweep is
the month.**

So the cap is a number, not a judgement. Run the dry run first
(`node tools/harvest.js`, no flags) and read the "This run" line:

- **150 or fewer outstanding** — run it uncapped.
- **More than 150** — run `--go --limit 150` and nothing larger. Not 200
  because it looks like a light week, not 400 because the backlog is big.
  150 targets is up to 300 lookups, 15% of the month, and leaves room for
  three more weeks plus the desk's own live lookups, which come out of the
  same 2,000.

A backlog is meant to take several weeks to clear. That is the design, not
a problem to be solved by spending more in one run. Report how many are
still outstanding when the run finishes.

**Re-checks first, new ground with what is left.** A stale row is a number
the desk states with confidence and lends against; an unpriced row shows an
estimate and says so in orange. The confident wrong number is the dangerous
one, so everything due a re-check runs before anything never priced, oldest
first among the re-checks. (It used to be one queue sorted oldest-first,
which put every unknown at the very front because a row with no date sorts
as infinitely old - a side effect of the sort. With the seed list growing,
that would have starved the re-checks permanently.)

A capped run therefore always refreshes what needed
it most.

**The harvest cannot find anything.** It walks `seed-models.json` and stops
when that list is exhausted, so a bigger allowance buys nothing once
everything on it has a price. The lever for growing what the desk knows is
the list. `node tools/gaps.mjs` ranks every shelf by how few models are
written down for it, which is where adding names buys the most. It costs no
lookups.

### Growing the list is part of the job, every run

Jace, 26 Sep: *"make sure we are constantly adding electronics, outdoor
gear, sporting goods, hunting and fishing equipment, tools, antiques to the
new search list to build the database with those type of items."*

So **every harvest run ends by adding models**, not only by pricing them.
Run `node tools/gaps.mjs`, take the thinnest shelf in one of those
categories, and write 6&ndash;10 more makes and models onto it:

    node tools/add-models.mjs h2 "Vortex Crossfire HD 10x42" "Maven C1 10x42"
    node tools/add-models.mjs --file batch.txt        # "ref<TAB>name" a line

The tool refuses a shelf the desk will not search, refuses a ref that is not
a shelf, drops duplicates and keeps the file sorted, so this is cheap and
hard to get wrong. It costs no lookups: the new rows are never-priced, and
never-priced runs **after** everything due a re-check.

**A name is a SEARCH, not a label.** "Vortex Diamondback HD 10x42" is a
search; "Vortex binoculars" is a mixture, and the median of a mixture is the
price of nothing. Use the model number wherever that is how people say it.

Two categories to leave alone unless asked. **Outdoor power** &mdash; saws,
mowers, trimmers, blowers, pressure washers, generators &mdash; is retired;
models added there would spend lookups measuring carburettors. **Antiques**
has no shelf in the catalog at all, and eBay is the wrong source for one
anyway: an antique's identity is a mark or a pattern, not a model number,
and that is WorthPoint's ground. It needs a decision before it needs rows.


## The allowance, and the shelves

**The harvest may spend 1,900 lookups a month and no more.** SoldComps
counts every lookup the same whether the harvest made it or the counter did
with a customer waiting, so there is no way to reserve half the plan at
their end - the reserve has to be a ceiling at ours. The harvest stops at
the cap and says so; the rest of the plan is the counter's, by construction
rather than by hoping. `--cap N` changes it for one run.

> **1,900 is the SHOP-CLOSED figure**, set 26 Sep: "my store is not open so
> I don't need any usage really right now." Nobody is at the counter, and
> 205 of the 970 targets have never been priced at all, so the allowance
> goes to the backlog.
>
> **Put it back to 900 the week the doors open.** At 1,900 the counter has
> 100 lookups left in a month the harvest fills - about three days of
> walk-ins. A normal month of re-checks is ~600 at the shelf intervals
> below, so 900 leaves the counter 1,400 and the cap only bites on a
> catch-up. The Routine's prompt is where to change it.

The ledger lives in `tools/harvest.json` under `spend`, by calendar month,
and counts every REQUEST rather than every success - a failed lookup costs
the same as a good one.

**Rows come due by shelf, not on one clock.** The old rule was 28 days for
everything, which meant all 970 targets came due every 28 days: a full
sweep, 1,942 lookups, 97% of the plan, with nothing left for the counter.
That is how September was spent.

It was also wrong on its own terms. Used prices do not drift, they STEP. A
DeWalt DCD791 sits flat until DeWalt ships the DCD800 and the line shifts
down a rung. What moves is what has an EVENT - an annual release, a season,
a metal price - and a cordless drill has none of those.

| Shelf | Repriced after | Why |
|---|---|---|
| Electronics | **30 days** | real release-cycle steps |
| Outdoor power, hunting, fitness, cards | **90 days** | seasonal, then flat |
| Tools, instruments, appliances, jewelry, trailers | **180 days** | nothing moves between models |
| Aisles eBay cannot price | 120 days | the answer is a fact, not a price |

`--stale N` overrides all of it for a one-off.

**These are reasoned, not measured.** They were set when the book was two
days old. The way to correct them is cheap: next month re-price 40 rows
priced in September, spread across shelves - about 80 lookups, 4% of a
month - and see what actually moved. If tools moved 1% in 30 days, push
them to a year and bank the difference.

## What it used to be worth

`tools/harvest-history.json` keeps one entry per row per CHANGE: date, low,
high, and whether that figure came from sales or from asks. The merge
appends to it; `tools/backfill-history.mjs` seeded it from the nine commits
of prices.json already in git.

**Nothing reads it yet, and that is fine.** A book row holds one price and a
re-harvest overwrites it, so the desk has never been able to say whether a
thing is falling or flat - and those are different loans. A 60-day ticket on
a phone shedding 5% a month is not the bet a drill is. The gold page already
reasons this way: a loan prices off the LOWER of spot and the 90-day
average, so a peak cannot size a ticket that outlives it. Goods deserve the
same and have never had the data.

Recording costs no lookups and nothing at the counter. It is worth nothing
today and a great deal in three months, which is why it starts now rather
than when somebody wants it.

What it is NOT yet: a trend. As of 25 Sep it holds 570 points across 523
rows, 41 of which have moved, all inside five days - and most of that
movement is CORRECTIONS (a hand raise on the 20th, the first real eBay
measurement on the 24th) rather than the market. Do not price off it until
the shelves have turned over a couple of times on their own intervals.

It lives beside the findings file and follows `--out`, so a test merge
writes a temp history rather than the real one. It is not in the app's
payload: the counter never downloads it.

Three things it is FOR, once there is enough of it:

1. **Size a loan off the trend, not today.** The peak guard the gold page
   already applies, applied to goods.
2. **Say the direction on the card.** "was $272-391 in September" tells the
   counter whether to lean high or low.
3. **Measure the shelf intervals instead of reasoning about them.** The
   sample described above stops being a special exercise and becomes
   arithmetic over a file that is already there.

## The calendar beats the news

Most of what moves a used price is not news, it is a date that has not
changed in fifteen years. iPhones land in September and last year's steps
down within the fortnight; Madden in August, Call of Duty in November,
Samsung's Galaxy S in January; mowers in spring, generators in storm
season, treadmills in January.

`PRICE_EVENTS` in harvest.js pulls those aisles forward a month before the
event, so the book is right while the customer is standing there rather
than five weeks later. A row priced in the last three weeks is still left
alone - last week's price is still last week's price.

Add to that table when a pattern shows up. It is a calendar, so it needs no
network, no key and nothing to go stale.

Because the whole list was priced on the same day, it also comes due on the
same day: expect one heavy week roughly every four, not a steady trickle.
That fits 2,000 with room, but it means a WASTED sweep is most of a month's
allowance. Never re-run one that completed. The harvest already skips what
is still fresh; let it.

The seed list has already grown past what the plan comfortably covers.
Either raise the plan or widen `--stale`; do not quietly let a sweep eat
the allowance.

## What the run says about whole aisles

The harvest prints a verdict per catalogue ref at the end: how many of that
kind's models produced a **clean** row — sold basis, inside the sanity
band, quartiles within 3x. It names any aisle under a quarter.

That is not a curiosity, it is the most valuable thing a run produces.
Sixteen aisles have been retired on it: nobody ships a fridge, a treadmill,
a 60-gallon compressor or a 55-inch television, so eBay lists their parts
and the search returns belts and boards that genuinely sold. A NordicTrack
came back on **eight real sales at a $35 median** against a $300 row.

When the run names an aisle, do not merge it and do not silently drop it:
report it, with the count, so it can be added to `EBAY_CANNOT_ITEM` in
app.js. That is a code change and belongs in its own commit, not the price
commit.

### Retiring an aisle is two jobs, not one

Adding a ref to `EBAY_CANNOT_ITEM` stops the NEXT run spending on it. It
does nothing about the rows already in the book, and those are the ones
doing the damage: the model screen tells the counter "the desk will not
look this one up" and the price book hands him a figure for that exact
model anyway, built out of the carburettors the warning is about, printed
in the same type as a measured sale.

Measured 25 Sep: 27 rows across nine already-retired aisles were sitting
there like that. Stihl MS 170 at **$130&ndash;$185 when a new one is about
$200**. Generac GP6500 at $500&ndash;$750, DuroMax XP12000EH at
$900&ndash;$925 &mdash; near new retail, on machines that had been on the
blind list for a day.

So after the code change, run:

```
node tools/drop-asking-rows.mjs            # what it would take out
node tools/drop-asking-rows.mjs --go       # take it out
node tools/drop-asking-rows.mjs --go p7    # one aisle
```

It removes any row whose aisle is blind **and** whose note says the figure
rests on asking prices with no sold data, from `prices.json` and from the
fallback copy in `app.js` both. The desk falls back to its own typical
figure and says so in orange &mdash; worth more than a precise-looking
wrong number, and the Marketplace and Craigslist buttons on those aisles
now go somewhere that actually sells the thing.

`check-pricing` holds the invariant, so this cannot quietly come back.

## The report

`tools/price-changes.md` is written on every merge. Read it before
reporting, and relay **every row in "Worth a look" with its old price, new
price, percentage and listing count.** That is the part Jace reads. Do not
compress it to "a few big movers".

Add your own judgement: a big swing on few listings is usually the wrong
model, a parts counter, or a lot of several. Say which rows you distrust.

A quiet week is a fine outcome. Do not manufacture findings.

## Never

- Deploy to Railway while a harvest is running. Eighty-four lookups were
  once recorded as failures that way.
- Put a token in a commit message, a file, or a Routine prompt.
- Record anything in the deal log but item facts — never a customer name,
  never an ID number, nothing off the state form.
