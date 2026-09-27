# Whole-app review: The Pawn Desk

You are reviewing a working tool that decides how much money a small
business hands over the counter. Please be blunt. I would rather be told
something is wrong than be told it is fine.

Two earlier reviews looked only at the pricing core. This is everything:
the two front ends, the shop's own server, the tools that build the data,
and the data itself. You are allowed — encouraged — to ask *why is it
shaped like this at all*, not only *is this line correct*.

## What it is and who uses it

A pawnbroker's pricing desk for a one-person shop in Bristol, Florida
(population about 900, rural North Florida). The owner stands at a counter
with a customer in front of him. He types or photographs what is on the
glass, answers a short run of questions, and the tool tells him **what to
pay to buy it outright** and **what to lend on it as a pawn loan**.

He is learning the trade. He is not a programmer and not a statistician.
Anything the tool says has to be arguable at the counter in plain words,
with a customer listening.

- Static single-page app: plain HTML, CSS, vanilla JavaScript. **No build
  step, no framework, no bundler.** Served from GitHub Pages.
- **Two front ends**: a desk browser (`index.html` + `app.js`) and a phone
  (`phone.html` + `phone.js`). The phone has **its own copies** of several
  panels. This has repeatedly caused a fix to land on one surface and not
  the other, and it is the architectural decision I am least sure about.
- A small Node service on Railway (`server/`) holds the API keys and
  answers lookups. **The app never holds a key.** A shared token gates it.
- `tools/` builds and measures the data: the price harvest, the metals risk
  table, the repeatability measurement, and ten Playwright test suites.

## The law, because it drives the arithmetic

Florida §539.001(11) caps the pawn service charge at **25% of the amount
financed per 30 days, minimum $5**. A loan matures at day 30; the shop must
hold the item **30 more days**; at day 60 title passes to the shop
automatically.

So a pawn loan is a **60-day position in the item** and a buy can be
resold immediately. That asymmetry is deliberate throughout: the loan is
sized off a guarded number, the buy off a less guarded one.

Florida also requires transactions to be reported to law enforcement. The
deal log deliberately holds **item facts only** — never a name, never an ID
number, nothing off the state form. That is a firm line.

## Where I most want a second opinion

### 1. The thing two reviewers have now circled: what a number *represents*
`marketNow()` can return a measured eBay figure, a harvested row, a row
researched by an AI and never verified, a hand-typed figure, or a catalog
baseline — and downstream arithmetic treats several of these as
interchangeable. `rowEvidence()`, `m.kind`, `m.conf` and `itemGuard()` are
the beginnings of provenance, but it is reconstructed from harvest notes
rather than carried as data.

Is making provenance first-class the right next move, and what would you
make it look like in a codebase with no build step?

### 2. The two front ends
Is duplicating panels between `app.js` and `phone.js` a mistake worth
paying to undo, given there is no framework and no bundler? If you would
merge them, how, without introducing a build step?

### 3. The question run
`askQueue` builds the run: make → model → what it sells for → specs → is it
all there → what shape → anything else. One question per screen, nothing
pre-highlighted (a lit default was read as an answer already given).

Is the order right? Is anything asked that does not move money, or not
asked that does? Walk `calcItem()` for multipliers that are not
independent — a recent fix removed one case where a missing battery was
priced twice, once by a spec and once by the aisle's completeness question.

### 4. New models pushing old ones down — my open question
When a new console or phone launches, last year's drops. Today the tool
handles this three ways and I do not know if it is enough:
- `STALE_BY_TIER` in `tools/harvest.js`: electronics re-price every 30
  days, tools every 180, jewelry every 180.
- `PRICE_EVENTS`: known annual launch windows (September iPhone, January
  Galaxy, August Madden, November Call of Duty) pull an aisle's re-pricing
  forward by a month.
- A `Previous gen` spec option on consoles at **×0.5**, which is a guess
  nobody measured.

Three things I can see wrong with it and would like your read on:
**(a)** nothing schedules the harvest — there is no CI job, so none of this
fires unless a human runs it; **(b)** a console *generation* is a ~7-year
event that an annual calendar cannot represent; **(c)** ×0.5 is invented.
Is there a defensible way to detect "a successor now exists" from the
shop's own data rather than from a hand-maintained calendar?

### 5. The aisles and the brand books
11 aisles, ~90 items. Aisle-level brand tiers are the **headline
product's** makes — the hunting aisle's tiers are optics, which was wrong
for a trail camera until items got their own lists. A previous reviewer
suggested a `brandProfile` per item rather than aisle inheritance. Is that
the right shape?

### 6. The lookups
`findPasses`/`priceFind`: eBay Browse API first (free, via the shop's
server, and since September 2026 it returns **asking prices, not sold** —
the Marketplace Insights grant was refused), then AI web-search passes,
then new-retail as a last resort. Firearms take a different ladder because
eBay bans gun sales.

Most of the price book now rests on asking prices. I measured the
ask-to-sold gap and **declined** to apply a blanket haircut: the aggregate
was 1.18× but per aisle it ran 4.30×, 0.83× and 1.06×, pointing opposite
ways. Was refusing right?

### 7. Safety, money and data
The token, the deal log's contents, the service's CORS and rate limits, the
service worker's cache behaviour, anything that could quietly ship a wrong
number without failing loudly.

## Things I already know — please do not spend effort rediscovering them

- `stepFlow()` always returns `"ask"`, so several older layouts are dead
  code, including a browse list and `#nextStep`. Measured, not removed yet.
- The phone duplicates panels from the desk.
- Nothing schedules the harvest.
- 161 price rows dated 19–22 Sep 2026 came from AI web research and were
  never verified against live listings.
- 74 firearm rows rest on a source (GunWatcher) that cannot be read
  automatically and has not been checked by hand.
- The item price history is 5 days long, so there is no item trend read —
  only a measurement of the tool's own repeatability (the same lookup
  re-run days apart moved the answer a median of 17.3%).
- `WORTHPOINT_SEARCH` and `FB_MARKETPLACE_SEARCH` are unverified URL shapes.

## What I would like back

1. **Correctness bugs first** — anything that produces a wrong number, with
   the input that triggers it. A wrong offer is the only kind of bug here
   that costs money.
2. **Where the domain model is wrong** — a grouping, a tier, a question or
   a multiplier that does not match how pawn actually works. If you know
   this trade better than I do, say so and say how.
3. **What is missing** — a question that should be asked, a source that
   should be in the ladder, a check that should exist.
4. **Architecture**, but only where it causes the above.
5. Only then, style.

Please cite the file and the function. If you are uncertain, say so rather
than guessing — five findings I can act on beat thirty I have to triage.
**If a finding depends on a line you cannot see, say that too**: an earlier
review reported a duplicate declaration that turned out to be a bug in how
I packaged the code for review, not in the code.

Everything follows. Ask for any file I have sampled rather than pasted.
