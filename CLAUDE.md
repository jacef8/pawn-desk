# Working on the Pawn Desk

A pricing tool for the counter at Lamar's pawn shop in Bristol, Florida.
Jace runs it. Somebody is standing at the counter waiting while it answers,
and the answer is money out of the till — that is the whole context for
every rule below.

Every rule here was written because something went wrong. Nothing in it is
general advice.

---

## Before you commit anything that changes behaviour

**Bump both, or the change does not ship.**

    app.js    const APP_BUILD="MMDD.HHMM"
    sw.js     const C="pawndesk-YYYYMMDDHHMM"

233 of this repo's 302 commits touch both files. That is not a coincidence,
it is the ritual. Bump `APP_BUILD` and forget the service-worker cache key
and the desk keeps serving the old version while you report success — the
worst kind of failure, because everything looks fine from here.

**Run the suites.** `tools/check-*.mjs`, twenty of them:

    python3 -m http.server 8099 &
    node tools/check-screens.mjs        # ~75s, the slow one
    node tools/check-ask.mjs            # ~15s

They need the server on 8099 and Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Several take over a
minute; run them in the background rather than chaining sleeps.

**Then:** commit to the feature branch, push it, and publish by
fast-forwarding `main`:

    git push -u origin <branch>
    git push origin <branch>:main        # this is what goes live

GitHub Pages serves `main`. Pushing the branch alone changes nothing the
counter can see.

**Do not publish research.** Tooling, findings, source notes and data files
do not go to `main` — nothing user-facing changed, so there is nothing for
the desk or the phone to pick up. Say so when you push the branch only.

---

## The two surfaces drift

`index.html` + `app.js` is the desk. `phone.html` + `phone.js` is the phone,
and **`phone.js` carries its own copies of several panels**. This is the
single most persistent bug source in the codebase: a fix lands on one
surface and the other keeps the old behaviour silently.

`phone.html` loads `app.js` and `app.css` too, so a shared component is
usually one call rather than a port. Prefer that over copying.

After any change to a panel either surface shows, check both. The phone is
the field screen — yard sales, clearance racks, other shops — so it is
about **buying outright**, not lending. The desk is the counter.

---

## Tests

**Delete the fix and watch the test fail.** A test that passes before your
change proves nothing.

**And verify the revert reproduces the original defect.** This is the part
that has gone wrong. Re-adding a removed CSS line on top of already-
corrected CSS is not the original bug; it passed, and the conclusion drawn
was that the guard was broken when the reproduction was. If the revert
passes, suspect your reproduction before your test.

**An assertion that cannot fail is worse than no assertion.** Three times
in one session a green tick meant nothing: a jargon test that waited 600ms
and read a card that was not on the page yet; a test that matched a bare
word and skipped everything the glossary contained, which was everything;
an assertion that checked an object existed. Ask what would have to be true
for this line to go red.

**When a suite fails after your change, read it before repointing it.**
Sometimes the test is stale and the intent should move — a battery
assertion that matched question titles had to move to matching options when
the title it caught became a record fact. Sometimes the test is right and
your change is wrong — two suites had encoded a double-charging bug as
correct behaviour and repointing them would have shipped it. Say which one
it was in the commit.

---

## Money

Florida § 539.001(11): 25% per 30 days is the **ceiling**, not the price.
The shop's rate is policy, set once, kept like the other rates. Day 30 the
ticket matures, day 60 it is forfeit — a pawn is a 60-day position, which
is why the loan is guarded and the buy is not.

`§ 539.001(9)` governs the record. **The deal log holds item facts only** —
no customer name, no address, no ID number, nothing off the state form. The
ticket number is the one field tying a row to the pawn system, and it must
never outlive the deal it belongs to.

Three rules cap a buy and the tightest wins: the category rate, the dollar
floor, and the multiple. When a price looks wrong, find which one is
binding before changing anything — it is usually the rate, and usually the
category rate is doing an exception's job.

**Say how strong the evidence is.** Sold prices, asking prices and
researched figures are not the same thing, and the app draws that
distinction everywhere. Asks run high, and high is the wrong way to be
wrong when money is going out. A check that catches the absurd is a smell,
not a verdict; do not present it as one.

---

## Secrets and services

The Anthropic and eBay keys live **only** in Railway environment variables.
Never in the repository, never in the website, never on a phone. `PAWN_TOKEN`
gates the service and `ALLOW_ORIGIN` defaults to `https://jacef8.github.io`.

Never put a token in a commit message, a file, or a scheduled prompt. Never
ask for the eBay Cert ID or an account password.

API calls cost money. Jace has said not to spend against county billing —
check before anything that bills.

---

## Commit messages

Long and narrative, in Jace's own words where he reported something, and
honest about what went wrong. They are the real memory of this project:
there is more history in `git log` than in any document here. Say what was
measured, give the numbers, and name the mistakes — including your own,
especially where a green test meant nothing.

---

## Where things are

    app.js              the desk, ~10k lines — catalog, pricing, rendering
    phone.js            the phone's own screens
    server/             the Railway service: /ebay, /sync, /json, /limits
    tools/check-*.mjs   twenty Playwright suites
    tools/*findings.md  what was measured and what it said
    DESIGN.md           the design rules, each tied to the test that holds it
    HANDOVER.md         everything a clone does NOT give you

