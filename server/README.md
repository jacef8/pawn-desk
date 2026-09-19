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
| `core.js` | everything the service does — shared, never copied per host |
| `server.js` | Railway, or any Node host |
| `worker.js` | Cloudflare Workers, via wrangler |
| `package.json` | no dependencies; Node's own http and fetch are enough |

Both host files do nothing but hand a request to `core.js` and pass the answer
back, so there is one copy of the logic.

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

## Sharing the record between devices

Without this, the phone and the desk each keep their own shelf tags and
looked-up listings, and Export/Import is the only way across. With it they are
one record.

1. Firebase console → your project → **Project settings** → **Service
   accounts** → **Generate new private key**. A JSON file downloads.
2. In Railway, add a variable **`FIREBASE_SERVICE_ACCOUNT`** and paste the
   whole contents of that file as the value.
3. Redeploy. The **Sync** button appears on the shelf-prices card, and every
   device reconciles once at startup and again whenever something is recorded.

Firestore holds three collections — `pawndesk_comps`, `pawndesk_seen`,
`pawndesk_deals`. Rows carry their own id and timestamp, so merging is by id
with the newer one winning; nothing is deleted, and two devices that both
recorded something while apart end up with both.

**Firestore's free tier covers this.** The Spark plan allows 1 GiB stored and
50,000 reads and 20,000 writes a day. A counter recording tags and looking up
prices will not come close.

**Without the variable the service still answers**, holding the record in
memory so the flow can be tried, and says so: *"Shared, but not saved: no
Firebase credentials."* A restart forgets it.

A device that cannot reach the service keeps working from its own copy and
says *"Couldn't reach the service."* Nothing recorded offline is lost — it
goes up on the next sync.

## Other hosts

**Cloudflare Workers** — `worker.js` is the adapter. Deploy with
`npx wrangler deploy` from this folder and set the same three as secrets
(`npx wrangler secret put ANTHROPIC_API_KEY`). It imports `core.js`, so it
cannot be pasted into the dashboard as a single file any more.

**Firebase Cloud Functions** could host the service instead of Railway, but
outbound calls to `api.anthropic.com` from a function require the **Blaze**
plan — the free Spark plan blocks them. That restriction is about Cloud
Functions reaching the open internet. It does not apply to how this uses
Firestore, which is from Railway through the Admin SDK.

## Notes

- The key lives only in the host's variables. Never in this repository, never
  in the website, never on a phone.
- `ALLOW_ORIGIN` limits which site may call the service; `PAWN_TOKEN` limits
  who may call it. The token does sit in the phone's storage, so rotate it if
  a device goes missing.
- It uses `claude-opus-5`. To spend less per lookup, add
  `output_config: {effort: "low"}` to the request in `core.js`.
