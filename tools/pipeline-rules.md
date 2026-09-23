# The weekly harvest: standing rules

Read this at the start of every run. It is the operating manual, and it wins
over anything remembered from a previous week — when a rule changes it
changes here, in git, where the change is visible and reversible.

## The loop

    node tools/harvest.js --go        # price every outstanding target
    node tools/harvest.js --merge     # fold the findings into prices.json

Then the suites, then commit, then push to `main`.

`PAWN_TOKEN` must be set. `PAWN_SERVER` has a default and rarely needs one.

## What to commit, and what never to touch

Commit **`prices.json` and `tools/price-changes.md`**. Nothing else.

**Do not bump `APP_BUILD` in app.js or the cache key `C` in sw.js on a
price-only run.** The service worker is network-first: it calls `fetch()`
and only falls back to the cache when the device is offline. A new
prices.json is picked up on the very next page load with no cache bump at
all. Bumping it forces every phone and the desk PC to re-download the whole
app for nothing.

Bump the build only when a run genuinely changes app.js, app.css, phone.js
or sw.js — which a harvest should not.

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
| Targets in the seed list | 610 |
| Lookups per target | up to 2 (a second only when the first is thin) |
| A full sweep | up to **1,220 requests** |
| The $9 Starter plan | **2,000 requests a month** |

A finding is repriced once it is **28 days old** (120 days for rows eBay
cannot price at all - mowers and trimmers nobody ships, where the answer is
a fact about the market rather than a price). Without that the harvest runs
once and is a no-op for ever after, and the book freezes at whatever the
first Monday said.

Because the whole list was priced on the same day, it also comes due on the
same day: expect one heavy week roughly every four, not a steady trickle.
That fits 2,000 with room, but it means a WASTED sweep is most of a month's
allowance. Never re-run one that completed. The harvest already skips what
is still fresh; let it.

If the seed list grows much past 610, either raise the plan or widen
`--stale`. `--limit N` caps a single run when the allowance is tight -
targets come up oldest first, so a capped run refreshes what needed it
most.

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
