# The Pawn Desk

Pricing tools for the counter at Lamar's. Two views of one app.

- **https://jacef8.github.io/pawn-desk/** — the full desk
- **https://jacef8.github.io/pawn-desk/phone.html** — Price Check, the phone view

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

These two files were copies of each other until they were merged: 3,112 of
their lines were identical and five changes had already landed in one and not
the other. A fix now goes in one place.

## When changing things

- **`sw.js` caches everything.** Bump `C` at the top on every change or phones
  keep serving the old copy.
- The phone shell must load `phone.css` and `phone.js` *before* `app.css` and
  `app.js`. The overlay wraps functions the app defines and the cascade order
  matters.
- Keep the repo public and named `pawn-desk`; the URLs above depend on it.
