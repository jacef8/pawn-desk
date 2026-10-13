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
