# The Pawn Desk price and photo service

The website can't identify a photo or look up a price by itself. A web page is
not allowed to read another website, and it can't hold a secret key — anything
in the page is public. This small service does both jobs for it.

Once it's running you get, on the phone and at the desk:

- **Photograph an item** and have it identified
- **Photograph a price tag** and have it read into your shelf record
- **Look up what it sells for used** — eBay **asking** prices (`/ebay`), plus
  SoldComps for real sold prices while its quota lasts, plus Claude with web
  search for anything neither covers
- **Read sold prices off a screenshot**

### What this service does NOT do, despite what this file used to say

It used to claim "eBay completed, Google Shopping used, and GunBroker for
firearms, all at once, with no tab opening". Asked at the counter — "why
cant you click these for me and get the numbers?" — and checked: the
service contacts **three hosts and no others**, `api.anthropic.com`,
`api.ebay.com` and `api.sold-comps.com`. There is no GunBroker code in this
directory and there never was. There is no Google Shopping call either.

- **eBay completed** was applied for and **declined on 23 Sep 2026** —
  Marketplace Insights is "generally reserved for eBay's approved partners".
  `/ebay` returns Browse results, which are ASKING prices, and the app
  labels them as such. See `tools/source-findings.md`.
- **GunBroker and GunWatcher** are link-outs in the app and nothing more.
  eBay does not sell firearms at all, so the one API here that could answer
  is blind to the whole guns aisle; that is why `EBAY_CANNOT.guns` exists
  and why the automatic lookup does not fire on a gun.
- The way to get gun numbers in without typing them is the **screenshot
  reader**, which is real and wired: screenshot the completed-auctions page,
  paste it into the desk, and Claude reads the prices off the picture. It
  costs a Claude call per read and says so on the button.

Do not restore the old sentence without code to back it.

## The files

| File | |
|---|---|
| `railway.json` | tells Railway to run `node server.js`, not `npm start` |
| `core.js` | everything the service does |
| `server.js` | the Railway host: takes a request, hands it to `core.js` |
| `store.js` | the shared record — the only file that knows where it is kept |
| `package.json` | no dependencies; Node's own http, fetch and fs are enough |

---

## Deploying on Railway

1. **railway.app** → **New Project** → **Deploy from GitHub repo** → pick
   `jacef8/pawn-desk`.
2. **Settings** → **Root Directory**: `server`. Railway reads `package.json`
   and runs `npm start`; there is nothing to install.
3. **Variables** → add three:

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your `sk-ant-…` key |
   | `PAWN_TOKEN` | a password you invent, e.g. `lamars-desk-7788` |
   | `ALLOW_ORIGIN` | `https://jacef8.github.io` |

   And, once you have an eBay keyset (see **Sold prices** below):
   `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, and — to get the keyset switched
   on at all — `EBAY_VERIFY_TOKEN` and `EBAY_DELETION_URL`.

   Two more are optional, and both exist because of one afternoon in
   September when a harvest spent $43.77 through this service before anybody
   noticed:

   | Name | Value | What it does |
   |---|---|---|
   | `DAILY_USD_CAP` | a number, default `10` | `/json` refuses once the day's spend passes it. Counted in memory, so a redeploy resets it and a second instance keeps its own — a brake on a runaway loop, not an accounting system. The spend limit in the Anthropic console is the backstop that cannot be restarted away. `0` turns it off. |
   | `PHOTO_MODEL` | `claude-opus-5` (default), `claude-sonnet-5` or `claude-haiku-4-5` | Which model reads the photo. Opus reads a worn badge well and costs five times what Haiku does — about $5 against $1 for 200 photos a month. Whether Haiku reads the same badges is a question for ten awkward things off the shelf, not for arithmetic, and this makes that test a restart rather than a deploy. A name that is not on the list is ignored, the default is kept, and `/limits` says so. |

   `/limits` reports which model is live, what it costs per million tokens,
   the cap and the day's spend so far.

4. **Settings** → **Networking** → **Generate Domain**. That address is the
   service.
5. Check it: open `https://your-address/limits` in a browser. A short line of
   JSON about image types means it is running.
6. On the phone, open the desk, find **Photo ID & price lookup**, tap
   **Connect**, paste the address and the token. Repeat on the desk computer —
   it is stored per device.

Pushing to `main` redeploys it.

## What it costs

Railway bills for the container, which idles at a few dollars a month.
Anthropic bills per use: a photo read or one search pass is a fraction of a
cent. A price lookup fires two passes, three for a firearm, so reckon on low
single-digit cents per lookup against a prepaid balance.

## If something goes wrong

| What you see | What it means |
|---|---|
| Card still says **Off** | The address did not save. Tap Connect again. |
| **Connected, but the service did not answer** | Wrong address, or it is not running. Try the `/limits` check. |
| **Lookup failed** | Usually `PAWN_TOKEN` not matching what you typed into the app. |
| `no_key` in the reply | `ANTHROPIC_API_KEY` missing or rejected. |
| `no_ebay_key` in the reply | `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` missing. |
| `ebay_auth` | The keyset is wrong, or it is a sandbox keyset against the live host. Also what a **disabled** keyset gives — see *Enabling the production keyset*. |
| `no_verify_token` | `EBAY_VERIFY_TOKEN` / `EBAY_DELETION_URL` not set. |

## Sold prices

Every other source the desk can reach publishes **asking** prices, and asking
prices read high: the overpriced listing that sat for six months is still in
the index, the one that sold in a day is gone. Build a price book out of them
and you lend against a number that never cleared. eBay is the only
marketplace that publishes what was actually paid, so the service talks to it
directly.

`POST /ebay` with `{"q": "DeWalt DCD791"}` returns a list of comps and, next
to them, `basis` — `"sold"` or `"asking"`. Nothing downstream is allowed to
confuse the two: a finding built on asks can never be graded high, and its
note says so in the price book.

### Enabling the production keyset

A new production keyset arrives **disabled**, saying:

> Your keyset is currently disabled. Comply with marketplace deletion/account
> closure notification process or apply for an exemption.

eBay requires every production application to either receive account-deletion
notices or be excused from doing so. The exemption is a review; the endpoint
is a deploy, so the service carries the endpoint.

1. Invent a **verification token**: 32-80 characters, letters, numbers,
   `_` and `-` only. Set it on Railway as `EBAY_VERIFY_TOKEN`.
2. Set `EBAY_DELETION_URL` to `https://your-address/ebay/deletion` — the
   whole thing, exactly as you will type it at eBay.
3. Redeploy, then check it answers:
   `curl "https://your-address/ebay/deletion?challenge_code=test"`
   You want a line of JSON with a 64-character `challengeResponse`.
4. At eBay: **Application Keys** → the alert on the disabled keyset →
   **marketplace deletion/account closure notification**. Paste the same URL
   and the same token. eBay immediately GETs the URL with a challenge code;
   the keyset enables the moment the hash comes back right.

The endpoint hashes the challenge code, then the token, then the URL, and
returns the hex digest. **The URL is hashed**, so a trailing slash or `http`
against `https` makes it fail — which is why it is read from
`EBAY_DELETION_URL` and not from the request, since the proxy in front of a
hosted service rewrites the host it sees. That mismatch is the usual reason
this handshake fails, and it fails silently: the keyset simply stays off.

The endpoint is not behind `PAWN_TOKEN`, because eBay has no way to send one.
Nothing is exposed by that: a GET returns a hash, a POST returns an
acknowledgement, and neither reads nor writes anything. There is also nothing
to erase when a notice arrives — this service keeps prices, titles and which
site a listing was on. It has never held an eBay username, an account id or
anybody's personal details.

**Getting a keyset.** At `developer.ebay.com`, register, then **Application
keysets** → the **Production** keyset. The App ID is `EBAY_CLIENT_ID`, the
Cert ID is `EBAY_CLIENT_SECRET`. They are read-only credentials for public
listing data — they buy nothing, list nothing, and cannot touch an eBay
account. There is no charge for using them.

**The catch.** Sold prices come from eBay's *Marketplace Insights* API, and
that one is **restricted**: a developer account alone does not get it, you
apply through the developer portal and eBay grants it. Until it is granted,
the service falls back to the *Browse* API — active listings, so asking
prices — and says so once per run rather than six hundred times. Open
`/limits` to see which you have: `ebay.configured` is the keyset,
`ebay.sold` goes false once a lookup has proved Insights is not granted.

So the honest state of it:

| | What you get |
|---|---|
| No keyset | `/ebay` answers `no_ebay_key`; the harvest stops rather than walking the whole seed list into the same wall. |
| Keyset, no Insights grant | Asking prices, structured and filtered by condition — better than a web search, still biased high, graded `m` at best. |
| Keyset with Insights | What things sold for on eBay in the last 90 days. This is the one worth building the book on. |

## Sharing the record between devices

Without this, the phone and the desk each keep their own shelf tags and
looked-up listings, and Export/Import is the only way across. With it they are
one record.

1. In Railway, open this service → **Variables** tab → **+ New Volume**.
   Set the mount path to **`/data`**. The smallest size on offer is far more
   than this needs.
2. Redeploy. That is all — there is no account to open and no key to paste.

The service keeps one JSON file per list on that volume —
`pawndesk_comps.json`, `pawndesk_seen.json`, `pawndesk_deals.json`. Rows carry
their own id and timestamp, so merging is by id with the newer one winning;
nothing is deleted, and two devices that both recorded something while apart
end up with both. The **Sync** button appears on the shelf-prices card, and
every device reconciles once at startup and again whenever something is
recorded.

Each file is written beside itself and renamed into place, so a restart during
a write leaves the previous one whole. Syncs are handled one at a time, so two
devices syncing together cannot overwrite each other. The service keeps the
newest 5,000 rows per list; the devices themselves keep 800 each.

**A different mount path** than `/data` is fine — set `DATA_DIR` to match.

**Without a volume the service still answers**, holding the record in memory
so the flow can be tried, and says so: *"Shared, but not saved: no disk
attached to the service."* A restart forgets it.

A device that cannot reach the service keeps working from its own copy and
says *"Couldn't reach the service."* Nothing recorded offline is lost — it
goes up on the next sync.

## Why not a hosted database

There was one here — Firestore, through the Firebase Admin SDK. It was taken
out. This is one shop, three lists and a few thousand short rows; a hosted
database meant another account to own, a service-account key with full admin
rights to keep out of the wrong places, and a console to learn, to do what a
file on the service's own disk does. Nothing was lost in the move: the sync
protocol, the merge rule and the offline behaviour are unchanged.

Moving to a hosted database later is a change to `store.js` alone — it is the
only file that knows where the record lives.

## Why not `npm start`

Railway stops a container with SIGTERM on every redeploy. Sent to `npm`, the
signal is passed down, node exits, and npm then reports its child dying by a
signal as a failed command - so the platform mails "Deploy Crashed!" for an
ordinary restart. `railway.json` sets the start command to `node server.js`
so nothing sits between the signal and the process that handles it. server.js
closes its listener and exits zero, and the logs say
`pawn desk service stopping on SIGTERM`.

If Railway ever ignores that file, set the same command by hand in
**Settings -> Deploy -> Custom Start Command**.

## Checking the price lists against the market

`tools/verify-prices.js` runs the same two searches the green **Look up what
it sells for used** button runs, but over every row in the lists at once, and
reports which ones are off. It talks to this service, so it searches from
here - with the key, and with the open internet.

```
PAWN_SERVER=https://your-address PAWN_TOKEN=your-token \
  node tools/verify-prices.js --cat appl            # dry run: prints the plan
PAWN_SERVER=... PAWN_TOKEN=... \
  node tools/verify-prices.js --cat appl --go       # actually searches
```

Without `--go` nothing is spent. `--limit N`, `--only WORD` and `--cat ID`
narrow it down, so a first run can cost pennies. Progress is saved after every
row, so a run that is stopped or dies picks up where it left off rather than
paying twice.

It never edits the lists. It prints what is off and by how much - a row more
than a third away from the book either way - and the decision stays yours. A
row with few listings, or none marked *sold*, is weak evidence and says so.
The full detail lands in `tools/price-check.json`, which is not committed.

## Notes

- The key lives only in the host's variables. Never in this repository, never
  in the website, never on a phone.
- `ALLOW_ORIGIN` limits which site may call the service; `PAWN_TOKEN` limits
  who may call it. The token does sit in the phone's storage, so rotate it if
  a device goes missing.
- It uses `claude-opus-5`. To spend less per lookup, add
  `output_config: {effort: "low"}` to the request in `core.js`.

### GunBroker — what is true as of 1 Oct 2026

`/gun/probe` (token-gated) exists and answers one question: can this service
price a gun off GunBroker, or not. It spends no money — GunBroker's developer
API is free with a key.

Set `GUNBROKER_DEVKEY` in Railway, from
<https://api.gunbroker.com/User/DevKey/Create>. The key is never logged,
never echoed and never returned; the probe reports only whether one is set.

**The key form asks three things this service has to match.**

- *IP addresses to whitelist* — for both Sandbox and Production, and nobody
  can answer it from a laptop: the address that matters is the one THIS
  service goes out from. `GET /gun/ip` reports it — **open it in a browser,
  no token needed**, because the man who needs it is standing in front of
  the form with no way to set a header, and the answer is the service's own
  public address. Cached for an hour inside the service, so an open endpoint
  cannot be used to make it hammer anybody. Sampled
  eight times across four echoes, because a host may answer from a pool.
  The build container this was written on returned three different
  addresses in three /24s. **If `rotating` comes back true, a single IP in
  that form field will stop working without warning** — turn on Railway's
  static egress first, or give GunBroker the blocks the endpoint prints.
- *Custom user agent* — "Any attempt to add generic naming such as Mozilla,
  WordPress, Python, etc. will result in request failures." Registered as
  Software `PawnDesk`, Version `1.0`, Application Name `LamarsPawnDesk`,
  so this service sends `PawnDesk/1.0`. **The form forbids spaces in the
  Application Name** (letters, numbers and `/ - _ . ( )` only) and caps the
  production IP field at **200 characters** — both stated in red above the
  form, and both of which the first draft of our answers broke. `GUNBROKER_UA` overrides it without
  a deploy if their checker wants a different shape. `/gun/probe` and
  `/limits` both report the string actually being sent, so what we send can
  be compared against what was registered without guessing.
- *What it is for* — determining gun values from current and historical sold
  prices and current asking prices, when buying and selling at the counter.

Measured, not assumed:

- `api.gunbroker.com` answers this build container and Jace's phone with the
  **same** 403 body: "Unapproved User Parameter — Please register at:
  api.gunbroker.com/User/DevKey/Create". It is **not** a network block. It is
  the API asking for a key. An earlier note in this session called it
  Cloudflare refusing a datacentre address; that was read off a status code
  without the body, and it was wrong.
- `genius.gunbroker.com` (Gun Genius) serves a per-model page carrying
  GunBroker's own market price — a floor and a ceiling over 24 months, with a
  `reliable_sample` flag — from
  `/wp-json/gb-ml-api/v1/firearm-price-points`. That endpoint **is** behind
  Cloudflare for this address, and after a couple of page loads the pages are
  too. A browser on a home connection gets both. This service cannot harvest it.
- `outdooranalytics.com` and `www.gunbroker.com`: 403 from here.

So the order of usefulness WAS expected to be: a registered DevKey
(automatic, nothing to click), then Gun Genius read by hand in a browser
(two numbers a model), then the screenshot reader already in the app. The
first of those is now gone — see below.

### GunBroker answered: NO — 4 Oct 2026

The DevKey request came back refused, on ticket 3053032, from
api@gunbroker.com:

> The API is not open for retrieving pricing, characteristic or sold data.
> We recommend you reaching out to our partner OutdoorAnalytics.com to
> inquire about retrieving this data.

So the whole question above is settled, and settled worse than the file
feared. It was written expecting the answer to be "active listings only",
which would have made the key worth less than the screenshot reader. The
real answer is that prices are not on the API at any level, completed or
active. A DevKey would authenticate a caller to endpoints that will not
answer the one question this service asks.

**Do not set `GUNBROKER_DEVKEY`.** Nothing in this service uses it for a
price, and nothing will. `/gun/probe` and `/gun/ip` are left in place
because they cost nothing when unset and they are the record of what was
asked and what came back, but they are no longer a route to anything.

OutdoorAnalytics is GunBroker's own data arm — 36 million sold items and
$11.9bn of transactions, which IS the sold-price history for guns. Two
things known about it, neither self-serve:

- GunBroker sells a pricing report through it at about **$1.99 a gun**.
  At a pawn counter that is a per-item charge on the one category that
  already takes the longest to price.
- The API connection they mention is sold to retailers through a sales
  conversation, not a key you register for. No public price.

Nothing changes on the counter screens. The guns aisle already prices off
GunWatcher and guns.com read through the search pass, and that path never
touched the GunBroker API.

