# The Pawn Desk price and photo service

The website can't identify a photo or look up a price by itself. A web page is
not allowed to read another website, and it can't hold a secret key — anything
in the page is public. This small service does both jobs for it.

Once it's running you get, on the phone and at the desk:

- **Photograph an item** and have it identified
- **Photograph a price tag** and have it read into your shelf record
- **Look up what it sells for used** — eBay completed, Google Shopping used,
  and GunBroker for firearms, all at once, with no tab opening
- **Read sold prices off a screenshot**

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

   And two more, optional, once you have an eBay keyset (see **Sold prices**
   below): `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET`.

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
| `ebay_auth` | The keyset is wrong, or it is a sandbox keyset against the live host. |

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
