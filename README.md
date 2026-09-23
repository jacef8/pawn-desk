# The Pawn Desk

Pricing tools for the counter at Lamar's. Two views of one app.

- **https://jacef8.github.io/pawn-desk/** — the full desk
- **https://jacef8.github.io/pawn-desk/phone.html** — Price Check, the phone view

Moving it to another computer or another account? **`HANDOVER.md`** is the
list of everything that is *not* in this repository and therefore does not
come with a clone — the accounts, the Railway variables, and the things
that live only on the device at the counter.

## Layout

The app is one codebase. `index.html` and `phone.html` are thin shells that
load it; neither holds application code.

| File | What it is |
|---|---|
| `app.js` | the whole application — catalog, prices, valuation, gold & silver |
| `app.css` | the whole stylesheet |
| `app-head.js` | boot bits: local deal log, live metals, the standalone startup |
| `phone.js` | the phone overlay — its own step card, verdict and boot |
| `phone.css` | the phone overlay's styles |
| `index.html` | desk shell: loads app-head, app.css, app.js |
| `phone.html` | phone shell: the same, plus phone.css and phone.js in front |
| `sw.js` | offline cache |
| `server/` | the price and photo service (see `server/README.md`) |
| `seed-shelf-prices.json` | shelf tags photographed at the counter, to Import |
| `prices.json` | the model price list, refetched on every load — this is the file that grows |
| `tools/seed-models.json` | makes and models to go and price, 610 of them |
| `tools/harvest.js` | prices those targets through the shop's own service, then merges them in |
| `tools/verify-prices.js` | rechecks the prices already in the lists |

These two files were copies of each other until they were merged: 3,112 of
their lines were identical and five changes had already landed in one and not
the other. A fix now goes in one place.

## Growing the price list

`prices.json` is fetched fresh on every load and falls back to the copy baked
into `app.js`, so the list grows without touching the code. Rows it holds are
matched from what the counter types: by a hand-written pattern where there is
one, otherwise by the row's own name, which needs a model number matched
exactly (`ms391`, `dcd771`) so a bulk row cannot answer for something it is
not.

    PAWN_SERVER=... PAWN_TOKEN=... node tools/harvest.js --ref p1 --limit 5
    PAWN_SERVER=... PAWN_TOKEN=... node tools/harvest.js --ref p1 --limit 5 --go
    node tools/harvest.js --merge

It is resumable, it never pays for the same target twice, and `--merge` keeps
a `.bak` and refuses to write a file the app would reject.

## When changing things

- **`sw.js` caches everything.** Bump `C` at the top on every change or phones
  keep serving the old copy.
- The phone shell must load `phone.css` and `phone.js` *before* `app.css` and
  `app.js`. The overlay wraps functions the app defines and the cascade order
  matters.
- Keep the repo public and named `pawn-desk`; the URLs above depend on it.
