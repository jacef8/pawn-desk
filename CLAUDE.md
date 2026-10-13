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

**Run the suites.** `tools/check-*.mjs`, thirty-nine of them:

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

**Do not ask whether to publish.** "quit asking me for permission to
push/publish. just do it once the work is done." Finish it, run the
suites, bump both numbers, push the branch and fast-forward `main` — in
one go, without stopping to check. A change sitting on a branch waiting
for an answer is a change nobody at the counter has.

That is not a licence to ship something unmeasured. If a change moves
money the figures are not yours to decide, the thing to do is SAY SO IN
THE SAME BREATH AS SHIPPING IT: publish, then put the numbers and the
three bands on the screen so he can move them. Not hold the work.

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

## What this tool is, and what it is not

**It is an appraisal tool. It does not track loans.**

"this tool isn't really for tracking the loans. this is an appraisal tool."
Said after I offered to build pawn extensions — a written memorandum, a new
default date, charges owed — off the back of a question about § 539.001(11)(b).

The line is not where the statute stops, it is where the counter's job
changes. Everything here answers **what do I say to the man standing
there**: what it is worth, what to offer, what to lend, what to quote him
to get it back. The moment something would need to be *kept and updated over
time* — a live ticket, an extension, a payment, a balance, a due date that
moves — it belongs in the pawn system, not here. The ticket number is the
whole of the join between the two.

So the redemption ladder stays: it is what you quote. An extension screen
does not: that is servicing a loan that is already written.

This is easy to drift across, because every one of those features reads as
helpful and sits one step from something already on the screen. The test is
not "would this help?" — it is "does this still end when he walks out?"

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

**NEVER GO TO EBAY FOR A GUN PRICE.** eBay does not sell firearms. A
search for one comes back as holsters, magazines, grips and springs, and
the median of that is about $29 against a pistol worth $179. It is not a
weak comp, it is a different product.

"eBay does not sell guns but it seems like you always go there looking
for them." He is right, and the galling part is that the app has known
this the whole time: `EBAY_CANNOT.guns` in app.js says it in nearly the
same words, and `findPasses` already hands a firearm four other passes -
GunWatcher, Guns.com ended, auction-house results, GunBroker asking. The
rule has never been missing from the code. It was missing from me.

So: guns and anything on wheels (`EBAY_CANNOT.rolling` - nobody ships a
quad or a golf cart) go to their own sources. Before pointing ANY lookup,
scraper or search at eBay, check `EBAY_CANNOT` for the category first.
If there is an entry, eBay is not a fallback, not a sanity check, and not
"worth a look anyway" - it is wrong, and it is wrong in the direction
that costs money.

**And a scraper that finds nothing will invent something.** Asked for
sold prices off an eBay page that turned out to be a login wall, an
extraction model handed back a Ruger LCP at $350 and an LCP II at $450,
with 2023 dates. There were no listings on that page at all. Nothing
about the answer looked wrong; the prices were plausible and the shape
was right. Before any scraped figure is believed, check that the page it
came from actually held listings - the page title and the final URL after
redirects are the cheapest tell.

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

## How to write to Jace

**Run the humanizer on every reply before sending it.** Said three times
now, the last one as a standing instruction: "from now own use the
humanizer." The two before that were both "i dont know what your asking" —
he could not find the question inside the answer.

What keeps going wrong, in order of how much damage it does:

**The answer arrives last.** He asks a yes-or-no question and gets six
headed sections with the answer spread across them. Lead with the answer.
One or two sentences. Then the detail, if it is needed at all.

**Questions written in my own vocabulary.** "Want me to build the
Bravo-as-a-named-source bit?" and "the fakes card is wide open rather than
folded" are both phrases from inside my head. He runs a pawn counter. Ask
in words that make sense at that counter, and ask one thing, not two.

**Bold labels on every point, headings on every paragraph, a table when
three sentences would do.** It reads as a report rather than an answer.

**Lines that restate the line above them.** "Expect a no, and plan as if
you got one." Cut those.

**Dashes doing the work of a comma or a full stop.** Same rule the app's
own copy follows.

The irony is that the app's screens are now measured and budgeted for
exactly this — `tools/check-words.mjs`, 40 words to a block — while the
replies about those screens were three times that. Apply the tool to the
reply, not just the thing it describes.

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
    tools/check-*.mjs   thirty-nine Playwright suites
    tools/*findings.md  what was measured and what it said
    DESIGN.md           the design rules, each tied to the test that holds it
    HANDOVER.md         everything a clone does NOT give you

