# The sold-price lookup session

The price pipeline cannot reach Product Research. This is the session that
can, and what it would take to run one.

## Why a session on your own PC

Product Research is eBay's sold-price tool — three years of what things
actually sold for, free with Seller Hub, no API behind it. eBay confirms in
their own developer forums that there is no supported way to read it from a
program. The only way in is a browser that is already signed in to your
account.

The price pipeline runs in Anthropic's cloud. It has Chromium, but it cannot
reach ebay.com: the browser does not trust the environment's proxy
certificate, and installing that certificate is blocked as a containment
escape. The way round it would be to switch TLS verification off for every
host, which is not a trade worth making to save a quarter of an hour.

A **bridge session** runs on your own computer and drives your own Chrome,
already logged in. Nothing is stored anywhere, no password is typed into a
cloud environment, and you can watch it work.

## Before you run one

Product Research is behind your eBay login, and eBay's User Agreement
prohibits automated access to member-only areas. The account at risk is the
seller account you would list forfeited goods on.

Twelve lookups, once, with you watching, is not meaningfully different from
clicking twelve times. A scheduled job hitting it every week is a different
thing, and it is the one that gets accounts flagged.

**So: run this for a calibration pass. Do not schedule it.** The recurring
work belongs on the API, which is the sanctioned door.

## Starting it

On the shop computer, in a terminal, in a clone of this repo:

    claude

Then paste everything under the line.

---

You are the Pawn Desk sold-price lookup. One job, one sitting: read the
twelve searches in `tools/product-research-worksheet.md`, run each one in
eBay Product Research, and write down what sold.

**Where to go.** ebay.com/sh/research — Seller Hub, Research tab, Product
Research. Jace is already signed in on this machine. If a login screen
appears, stop and ask him; never type credentials yourself.

**Settings, once:** date range Last 90 days, condition Used, marketplace
eBay US, format All.

**For each of the twelve searches**, type the search string exactly as the
worksheet gives it and record:

- **Avg sold price** — the big number at the top. Not the range, not average
  shipping, not any active-listing figure.
- **Sell-through %**
- **Total sellers**
- If it shows fewer than about 10 sales in 90 days, widen to a year and note
  that you did.

**Then** fill the "Sold average (you)" column in
`tools/product-research-worksheet.md`, commit, and push to
`claude/pawn-desk-github-pages-3p3r2v`.

**Rules.**

- Go at a human pace. Do not hammer the page.
- One sitting, then stop. Do not set yourself a schedule, and do not offer
  to run this weekly.
- If eBay shows a captcha, a rate-limit notice, or anything that looks like
  it has noticed a robot, **stop immediately** and tell Jace. Do not retry,
  do not work around it.
- Record what the page says. If a search returns something that looks wrong
  — the wrong model, a parts counter — write down what you saw rather than
  a number you tidied up.
- Do not touch prices.json, app.js, or anything outside the worksheet.

When the twelve are in, say so and stop. Working out the correction factor
happens in the main session.
