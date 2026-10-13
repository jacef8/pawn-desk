# Can anything read a gun's sold price without a person? — 13 Oct 2026

Written after "yes look into that", about running the browser on Jace's
own machine instead of a server.

## The finding that decides it

**It is not GunWatcher. It is every gun site.** Eight hosts, one request
each, a real browser's user-agent, from this container:

| host | status |
|---|---|
| www.guns.com | 403 |
| www.gunbroker.com | 403 |
| gunwatcher.com | 403 |
| www.rockislandauction.com | 403 |
| www.proxibid.com | 403 |
| www.gunsamerica.com | 403 |
| www.armslist.com | 403 |
| www.truegunvalue.com | 403 |

Checked that this is the sites and not our own egress, because eight 403s
in a row is exactly what a policy block looks like:

- `example.com` answers 200 through the same proxy
- the proxy's `recentRelayFailures` is empty, so it refused nothing
- gunwatcher's 403 carries a real body: 5,774 bytes titled
  "Attention Required! | Cloudflare", with a captcha

So the firearms aisle is bot-protected end to end. **No server will ever
do this** - not Railway, not this container, not a scraper we host. That
is not a GunWatcher quirk to engineer around, it is the category.

## What that leaves

The browser has to be somewhere a real person actually browses. Jace's
own browser already gets in - the $170-230 on the Ruger LCP card was read
off GunWatcher by eye on 19 Sep, which is the proof.

## What is already built, and what is missing

Missing: the reading half, and only that.

Already there: Setup carries a CSV importer and a paste box
(`shFile`, `shPasteGo`), and `sheetPreviewHTML()` shows every single
changed row and applies nothing until it has been looked at. Anything
that can produce rows lands cleanly, and the counter approves each change
by hand.

That preview matters more than usual here. One day earlier, asked for
sold prices off an eBay page that was a login wall, an extraction model
invented a Ruger LCP at $350 and an LCP II at $450. Any route that ends
with a model reading a page can do that again, and the import preview is
the thing standing between it and the price book.

## The size of the job

- 519 rows in `MODEL_PRICES`
- **77 of them sourced to gunwatcher.com**
- 50 models on `tools/gun-worklist.md`
- last checked 19-30 Sep, one row on 2 Oct - two to three weeks stale today

## The three routes

**A. His own Chrome, with me reading it.** He opens the page, the numbers
get read and handed back as rows to paste. Nothing to install in this
repo, nothing to maintain, and it fails honestly - a page that will not
load produces nothing rather than something made up. Needs him at the
machine.

**B. A script on the counter PC.** A real browser, driven locally, on a
schedule. Unattended, which is the whole appeal. Against it: Cloudflare
is in the business of spotting exactly this, so it is a thing that breaks
quietly, and quiet breakage on prices is the worst kind this tool has.
Also needs Node installed on that machine and kept working.

**C. Pay for it.** OutdoorAnalytics is GunBroker's own data arm and is
who they pointed at when they refused the DevKey on ticket 3053032
(4 Oct). A salesman and a contract rather than a key. Price unknown -
nobody has asked.

## Recommendation

A, and not because B is hard. B is a background job whose failure mode is
stale prices that still look current, on the one aisle where 76 rows
already carry no counted sale. A is slower and honest, and it makes the
thing he already does - read the page himself - about ten times faster
rather than replacing it with something he cannot see.

## Not verified from here

Which Claude setup is on his own machine. This session is a cloud
container; it cannot see his desktop app or whether the Chrome extension
is installed. That question goes to him.

---

# What happened next, 13 Oct 2026

He picked B. "Running overnight." The recommendation above was A and he
read it and chose the other one, which is his call to make — so the rest
of this is about making B fail loudly instead of quietly, since that was
the whole objection to it.

## The source changed, and the old one was weaker than it looked

The reader was pointed at GunWatcher's free market-price page. He pasted
one back. It is **one monthly model figure, with the current month behind
a sign-in**, and the actual sold rows on the page numbered three — all
marked New, one of them five months old. That is not something to price 77
lines of the book off, and it had been about to be.

Five addresses, same gun, measured from his machine and from a stealth
proxy:

| address | what came back |
|---|---|
| GunBroker completed | "Just a moment..." — Cloudflare |
| GunBroker sold | "Just a moment..." — Cloudflare |
| Guns.com recently-ended | opens, 24 prices, **ignores the keyword** |
| Guns.com search | opens, filters properly, mixes new and used |
| GunWatcher sold-data | Cloudflare |

The ended page is the dangerous one. It is headed `REMINGTON 870 EXPRESS
15450 RESULTS`, it carries a filter chip saying the same, and it lists a
Glock, a Springfield XD-M, a 24K gold Colt Python and a Marlin .22. A
guard that asks "is the gun named on this page" passes it. That page is
saved as `tools/fixtures/guns-com-ended.txt` and the suite runs against it.

So the reader now uses

    https://www.guns.com/used-guns?keyword=<model>

which filters properly and is all used stock. **These are asking prices.**
What a large national dealer lists the same used model at today is a real
signal, and a better one than nothing on an aisle where 76 rows carry no
counted sale. It is still an ask, asks run high, and high is the wrong way
to be wrong when money is going out. The log file says so at the top of
every run.

## Six read by hand before the repoint

Middle half of their used listings against what the book says now:

| key | model | n | guns.com used asks | book |
|---|---|---|---|---|
| a1 | Remington 870 Express | 18 | $350–$400 | $300–$400 |
| a2 | Remington 870 Wingmaster | 21 | $390–$480 | $450–$625 |
| a3 | Mossberg 500 | 24 | $277–$400 | $225–$325 |
| a4 | Mossberg 590 / 590A1 | 22 | $400–$600 | $380–$550 |
| a5 | Maverick 88 | 20 | $200–$220 | $150–$210 |

Six at five credits each was going to be 71 more one at a time, which is
71 more messages. His own PC reads all 77 for nothing, so it does.

## The guards, and the four that were wrong first

Nine rules decide whether a figure is taken. Each was deleted in turn and
the suite watched; eight went red, and the ninth was dead weight and is
gone. The four that were wrong when first written:

1. **The model has to be beside the price, not on the page.** This is the
   ended-page trick above.
2. **A fourteen-line window above the price reached into the listing
   above it.** A mixed page of six used and four new counted seven used.
   Blocks are now bounded by the previous price line.
3. **And on the first listing of a page it reached into the header** —
   which is the one place the search term always appears. The block now
   stops at anything that is the page talking about itself ("N RESULTS",
   "Applied Filters", "Keyword:").
4. **The condition had to be the listing's own field, not the word "used"
   anywhere nearby.** Guns.com heads the page "Used Guns For Sale" and
   puts "Certified used" in the shipping banner, so the first listing on
   every page matched whatever it actually was. A page of six NEW guns
   came back with one used listing on it.

And the one that could not fail: the no-bids rule, which refuses a closed
auction nobody bid on. Deleting it left the suite green, because the
fixture it was tested against was being refused for a different reason —
it had no condition field within six lines of the price, since the real
auction lots write `Condition:  USED` on one line and the test wrote it on
two. Fixing the anchor to read both shapes made the rule testable, and it
also means the auction lots on the ended page are readable at all.
