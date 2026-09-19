# The Pawn Desk price service

The website can't identify a photo or look up a price by itself. A web page is
not allowed to read another website, and it can't hold a secret key — anything
in the page is public. This little service does both jobs for it.

Once it's running, on the phone and at the desk you get:

- **Photograph an item** and have it identified
- **Look up the new price** without a tab opening — the number lands in the app
- **Read sold prices off a screenshot**

You set it up once. It takes about ten minutes.

---

## What it costs

- **Cloudflare** — free. This fits inside the free plan.
- **Anthropic** — pay per use. Each photo or lookup is a fraction of a cent;
  a busy counter day is cents, not dollars. You add credit up front and it
  draws down, so it can't run away from you.

## What you need first

1. A **Cloudflare** account — free, at `dash.cloudflare.com`.
2. An **Anthropic API key** — from `console.anthropic.com`, under API Keys.
   It starts with `sk-ant-`. Treat it like a credit card number.
3. A **token you make up** — any password-like string, say `lamars-desk-7788`.
   It stops a stranger who finds the address from spending your credit.

---

## Setting it up

1. In Cloudflare, go to **Workers & Pages** → **Create** → **Create Worker**.
2. Name it `pawn-desk` and click **Deploy**. It deploys a placeholder — fine.
3. Click **Edit code**. Delete everything in the editor, paste in the whole of
   `worker.js` from this folder, then **Deploy**.
4. Go to the worker's **Settings** → **Variables and Secrets**. Add three,
   each as type **Secret**:

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your `sk-ant-...` key |
   | `PAWN_TOKEN` | the token you made up |
   | `ALLOW_ORIGIN` | `https://jacef8.github.io` |

5. **Deploy** again so the secrets take effect.
6. Copy the worker's address. It looks like
   `https://pawn-desk.<your-name>.workers.dev`.

## Connecting the desk to it

1. Open https://jacef8.github.io/pawn-desk/phone.html
2. Find the **Photo ID & price lookup** card and tap **Connect**.
3. Paste the worker address, then the token.

The page reloads and the camera appears. Do this once per phone or computer —
the address is stored on that device only, never in the website.

To check it's alive, open `https://your-worker-address/limits` in a browser.
You should see a short line of text, not an error.

---

## If something goes wrong

| What you see | What it means |
|---|---|
| Card still says **Off** | The address didn't save. Tap Connect and re-paste it. |
| **Connected, but the service did not answer** | Wrong address, or the worker isn't deployed. Try the `/limits` check above. |
| **Lookup failed** | Usually `PAWN_TOKEN` in Cloudflare not matching the token you typed into the app. |
| Nothing works after a key change | Redeploy the worker. Secrets only take effect on deploy. |

## Notes

- The key lives only in Cloudflare. It is never in this repository, never in
  the website, and never on a phone.
- `ALLOW_ORIGIN` limits which site may call the service, and `PAWN_TOKEN`
  limits who may call it. The token does sit in your phone's storage, so
  anyone holding your unlocked phone could read it — rotate it in Cloudflare
  if a device goes missing.
- Built as one file with no build step so it can be pasted into the dashboard.
  The same endpoints run under `wrangler` with `@anthropic-ai/sdk` if you'd
  rather build it properly later.
- It uses `claude-opus-5`. To spend less per lookup, add
  `output_config: {effort: "low"}` to the request in `worker.js`.
