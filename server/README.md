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

## Other hosts

**Cloudflare Workers** — `worker.js` is the adapter. Deploy with
`npx wrangler deploy` from this folder and set the same three as secrets
(`npx wrangler secret put ANTHROPIC_API_KEY`). It imports `core.js`, so it
cannot be pasted into the dashboard as a single file any more.

**Firebase** — Cloud Functions can host this, but outbound calls to
`api.anthropic.com` require the **Blaze** plan; the free Spark plan blocks
them, which is the usual reason this kind of function fails there.

Firebase is interesting for a different reason: the desk already talks to its
local deal log through a Firestore-shaped interface (`collection`, `doc`,
`onSnapshot`). Pointing that at a real Firestore would make the deal log and
the shelf-price record shared across the phone and the desk instead of living
on each device, which is the main thing Export and Import exist to work
around.

## Notes

- The key lives only in the host's variables. Never in this repository, never
  in the website, never on a phone.
- `ALLOW_ORIGIN` limits which site may call the service; `PAWN_TOKEN` limits
  who may call it. The token does sit in the phone's storage, so rotate it if
  a device goes missing.
- It uses `claude-opus-5`. To spend less per lookup, add
  `output_config: {effort: "low"}` to the request in `core.js`.
