# Moving the Pawn Desk to another computer or another account

The code is all in git. Everything else is not, and this is the list of
everything else — the things a fresh clone does **not** give you.

Written down because the question "where are the pawn desk files?" has an
easy answer (`jacef8/pawn-desk`) and a real one, and the real one is below.

---

## 1. The code — nothing to move

    git clone https://github.com/jacef8/pawn-desk

That is the whole application, the service, the price lists, the tools and
the tests. GitHub Pages serves the site straight off `main`, so the live
desk follows the repository without anything being copied anywhere.

**Do not keep the working copy inside Google Drive or OneDrive.** Sync and
git write to the same files at the same time, the `.git` index gets
corrupted, and it is usually noticed weeks later when a commit fails.
Somewhere local — `C:\Users\<you>\Projects\pawn-desk` — and let GitHub be
the backup. It already is one.

## 2. The accounts, and who each one bills

| What | Where it lives | What it costs |
|---|---|---|
| The repository | GitHub, `jacef8/pawn-desk` | nothing |
| The live site | GitHub Pages, off `main` | nothing |
| The service | Railway | Railway's own plan |
| Photo reads | an **Anthropic API key**, in Railway | per token, prepaid |
| Sold prices | a **SoldComps** account | $9/month |
| eBay comps | an **eBay developer keyset** | nothing |
| Building the thing | a **Claude account** | subscription or credits |

Two of those decide whose card pays, and neither is in the repository: the
**Anthropic API key in Railway** and the **Claude account you work from**.
Moving the folder changes neither. Changing the key changes the first;
signing in as somebody else changes the second.

## 3. Railway — the variables

The service is `server/`, deployed from this same repository. Nothing in it
is secret; everything secret is a variable. `server/README.md` has the full
table. The short version of what has to exist on a new deployment:

| Variable | Where it comes from |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |
| `PAWN_TOKEN` | you invent it; the desk sends it back on every call |
| `ALLOW_ORIGIN` | `https://jacef8.github.io` |
| `SOLDCOMPS_KEY` | sold-comps.com → dashboard → API keys |
| `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` | developer.ebay.com, production keyset |
| `EBAY_VERIFY_TOKEN` / `EBAY_DELETION_URL` | needed to get the keyset switched on |
| `DAILY_USD_CAP` | optional, default 10 |
| `PHOTO_MODEL` | optional, default `claude-opus-5` |

Then **Settings → Networking → Generate Domain**, and put that address and
the token into each device under Setup.

## 4. What lives on the device and nowhere else

This is the part that is genuinely lost if a tablet is dropped, because it
is in that browser's local storage and in no repository:

- **your own prices** — anything typed over a built-in figure, per item,
  per price-book row and per model
- **the deal log**
- **shelf tags** photographed at the counter
- **the service address and token**
- **your rates** — loan percentages, the buy floor, the multiple

**Export them.** The desk has Export and Import under **Phones & devices**,
and the shelf record has its own Export. Do it before a move, not after.
A fresh device starts from the built-in numbers and knows nothing you
taught it.

The master spreadsheet (`tools/pawn-desk-prices.xlsx`) is the durable way
to hold your own prices: fill the shaded column, save that sheet as CSV,
drop it on Setup. A figure entered that way beats every published one and
never goes stale. Keep the filled copy somewhere backed up — that one
**can** live in Drive, because it is a document, not a git checkout.

## 5. What lives on the Claude account

These do not travel with the repository and have to be recreated on a new
account:

- the **weekly harvest** Routine (currently disabled)
- the **What Walks In** page — which of the 248 things the shop takes
- this project's session history

## 6. The order to do it in

1. Clone the repository somewhere local.
2. New Anthropic API key on the account that should pay. **Put it in
   Railway. Delete the old one** so it cannot be used again.
3. New Claude account signed in for pawn-desk work, so the building of it
   stops landing on the other one.
4. Export the deal log, the shelf tags and your own prices from each device
   before it changes hands.
5. Re-enter the service address and token on each device.
6. Check `/limits` in a browser: it names the model, the cost, the cap and
   the day's spend. If that answers, the service is up.

## 7. One outstanding thing

`PAWN_TOKEN` has been shared in a chat transcript. It gates both the photo
endpoint — an Opus-class model with web search — and the SoldComps quota.
Rotate it at the next convenient moment: change the Railway variable,
redeploy, re-enter it on each device. Nothing else needs to change.
