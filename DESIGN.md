# The Pawn Desk — design directive

This governs how this app looks and behaves. It is not a general style
guide; it is written from four references Jace chose, the screenshots he
sent back, and what he said when he rejected two earlier designs.

Where a rule can be measured, the test that measures it is named. That is
the point of the document. Two full redesigns were shipped on judgement
and both were rejected; every rule below that has a test attached has
stayed put.

**October 2026: the third design.** The governing directive changed and
now rejects see-through panels outright, raises the secondary type floor
to 14px, requires 44px tap targets, bans browser pop-ups and caps motion at
300ms. It also makes an effects layer compulsory; that part lasted one
build and is now explicitly refused (Section 8). The
liquid glass this document was written around is gone; Sections 3, 4 and
8 are rewritten and `check-design` holds the new numbers.

The first attempt at it was shown to Jace as one screen, per the
directive's rule about showing one before building the rest. His entire
reply was **"kind of boring"**, and he was right: it was the same stack
of cards in the same order with new paint, which Section 1 of the
directive calls a failed redesign in so many words. The second attempt
changed what is biggest, what is first and what got cut, and he said to
roll it out. Both of those are the same lesson this document already
carries twice.

---

## 0. The four sources, and what each one actually contributed

Read them before arguing with anything here.

| Source | What it gave this app |
|---|---|
| **futureplatforms — 10 key UX trends for 2026** | **Liquid Glass** ("translucent materials and depth-rich aesthetics"); **the New Minimalism**, described as "the brave act of getting out of the way"; **micro-interactions** as "your defence against digital sameness"; accessibility "as a core principle from day one" rather than a final checklist; sustainable UX, where "a smaller carbon footprint almost always means a faster, better user experience". |
| **elegantmedia — best app designs of the future** | Navigation so fluid "the user does not even realise they are navigating"; the **tab bar** as the iOS pattern over the Android drawer; "cohesive iconography"; "accessible contrast requirements"; clarity over decoration. |
| **vocal.media — top mobile UI trends** | **Dark mode**, specifically because it "allows you to create accent colour highlighting due to huge contrast with dark backgrounds"; **gradients, shadows and blur** as layered depth; animation of icons and small details "where they are appropriate". |
| **muz.li — mobile app design inspiration** | "Choose legible fonts and maintain a clear hierarchy of text sizes"; "maintain a unified colour scheme, typography and iconography"; tab bars and gesture navigation with "a clear hierarchy"; scalable text and screen-reader compatibility. |
| **The Smart Wallet screenshot** | One dominant number in a hero card; a row of action controls directly beneath it; icon-led list rows with the value right-aligned; a fixed bottom tab bar; generous rounding and vertical rhythm. |

Three of the four independently say the same two things: **dark, because
accent colour only sings against it**, and **a bottom tab bar**. Both are
locked below.

---

## 1. The counter's rules

These outrank everything else in this document. They are quoted because
paraphrasing them is how they got broken.

1. **"I like buttons and clear, concise windows that keep everything on
   the screen without any need for scrolling."**
   The page never scrolls. A panel may scroll inside itself. → `check-screens`
   measures four desk sizes × three states and four phone sizes × four states.

2. **"If more detail is needed I shouldn't need to click a button to open
   up the fields to input that data."**
   If the desk wants an answer, the field for it is on the screen already.
   Never a button whose only job is to reveal an input.

3. **"A lot of the remaining stuff needs to go away unless it's necessary
   for that particular item."**
   Anything not needed for the thing in hand is not on the screen. The
   shelf-tag recorder is not part of pricing an item. → `check-screens`
   pins that one at every width and flow.

4. **"Same boring empty space on front page."**
   Dead space is a bug. If a screen has room, it is withholding something
   the counter could use.

5. **"This looks almost just like the old app with a colour change."**
   A restyle is not a redesign. If the skeleton, the hierarchy and the
   controls are unchanged, nothing happened.

6. **"Don't like the off-white and gold."** → dark only. See §2.

7. **"The text in the middle of the graph is obscured by the graph."**
   Nothing may overlap the thing it sits inside. → `check-screens`.

---

## 2. Palette — locked

Chosen from four live renders of the real app. Dark only: the light
palette is deleted, not disabled. A counter is worked at night as often as
at noon, and a light screen in a dim shop is a lamp pointed at the person
you are talking to.

```
--paper   #15171C   graphite, no warmth in it at all
--accent  #3B82F6   electric blue — a FILL you look at
--accent-ink #A9CEFF  — TEXT you read
--on-accent  #04122E  — ink ON a blue fill
```

**Two inks per accent, always.** `#3B82F6` is a good button and an
unreadable 13px caption. Any new accent gets both a fill value and a text
value, and the text value is proved, not chosen.

**Status colour never moves when the palette does.** `--good`, `--warn`,
`--bad` and their washes are a separate set. The bar under "Behind this
number" is amber because the *data* is thin, not because the theme is
warm. It stayed amber through all four palette samples; that is the test.

**The elevation ladder is a ladder.** `--glass` → `--g2` → `--well`.
Closer is lighter; recessed is darker. Never freehand a surface colour.

---

## 3. Type

Display **Sora**, text **Instrument Sans**, mono **JetBrains Mono**.

- Numerals are the design: `tabular-nums`, tight tracking, display weight.
- Minimums: body 15px, **secondary 14px**, labels 12px and ONLY for a
  short uppercase label. Nothing smaller. → `check-design`
- No glow, halo or text-shadow on any text, ever. Sharp beats luminous.

**The floor went from 13px to 14px, and 12px lost its general licence**,
on the October 2026 pass. Rolling that out took four sweeps because each
one measured less than it reported: a grep of the stylesheets missed 80
inline sizes written from JS; a probe of the screen the app opens to
missed 499 more on the other tabs; one viewport missed a whole media
query; measuring element boxes called a 44px hit area 18px. Every one of
those sweeps printed "0 violations". That is why `check-design` walks
every tab on both surfaces at four sizes and reads computed values rather
than source.

⚠️ **Webfonts are a network dependency and they do not always arrive.**
They are blocked in the build sandbox, which means every screenshot in
this project's history rendered a system fallback. Do not judge type from
a screenshot taken here, and keep the fallback stack good enough to ship.

---

## 4. Material and shape

**Solid. There is no glass left in this app.** Surfaces are opaque
colours on a ladder — `#161A22` housing → `#1E2430` widget → `#0D1017`
well — and `backdrop-filter` appears nowhere. → `check-design` asserts
both: no declaration in the source, and nothing see-through on the
painted page.

This replaces the liquid-glass material the first two sections of this
document were written around. The rule it broke was already written here
in the old wording — *anything you read OFF is opaque* — and the honest
reading of it is that on a pricing tool, everything is something you read
off. The directive now says so outright: see-through panels make the text
over them muddy.

What depth is made of instead: a one-pixel lit top lip, a short shadow
(14px blur or less), and the ladder above. Nothing hazy.

Concentric radii: `18px` housing → `14px` widget → `12px` readout. Pills
only for a segmented control sunk into a well — never a floating pill.

**Every tap target is 44×44**, including the part you cannot see: the
info buttons draw an 18px circle and carry the other 26px on an invisible
`::after`. → `check-design` hit-tests rather than measuring boxes,
because the first version of that check called those buttons a failure.

---

## 5. Layout

- **Bottom dock on the phone, left dock on the desk.** Navigation is a
  place, not a control: the current one is *lit*, never filled. A solid
  pill sitting under the thumb all day reads as a button mid-press.
- **One screen.** See rule 1.
- **Every card holds something at a different elevation than itself.** A
  card containing only text is unfinished.
- **The front page is made of controls, not prose.** Worked examples are
  buttons that run themselves; categories are laid out, not folded away.
  → `check-screens` clicks one and checks the box filled and the list opened.

---

## 6. The number, and hierarchy by state

The offer is the screen. The hierarchy follows the state:

- **No price yet** → the *question* is the hero; progress is a slim bar.
  A 200px dial around an em-dash is a placeholder occupying the space the
  question needs.
- **Priced** → the dial at full size, the figure inside it, the two
  supporting numbers as recessed readouts beneath.
- **Walk away** → same dial, bad colour, the reason underneath.

**Geometry:** a 270° arc at r=130 with a 24px stroke in a 340 box leaves a
clear circle 236 wide — **69.4%**. `.gcenter` is inset to it. Do not cap
the children with percentages instead (see §9).

---

## 7. Honesty — the rules this app breaks most

This is a pricing tool. A number that looks confident and is wrong costs
real money at the counter.

1. **Never show a price before the run that produced it is finished.**
2. **Say where a figure came from and how old it is.** "eBay prices for
   Sony WH-CH720N, as of Sep 23. Not re-checked since."
3. **Never say "nothing looked up" about work that was done.** Both halves
   can be true and still read as a lie.
4. **A headline slot holds a verdict or a quantity, never a hostname.**
   "Swappa" alone, with nothing saying what the word was doing there,
   survived three of my own screenshots.
5. **An empty meter is drawn empty.** A full grey bar reads as full
   at arm's length.
6. **Where a source is blind, say so and stop paying for it.** Eighteen
   kinds of thing are on the blind list — 15 of them measured in one
   sweep, plus the television and the two mowers — the searches return parts. → `check-pricing`
   holds the list to the measurement *in both directions*: every aisle
   under a quarter is muted, and every aisle that did price still
   searches. A blind list that quietly grows is how a tool stops answering.

---

## 8. Motion

Nothing runs longer than **300ms**. Guard everything with
`prefers-reduced-motion`. → `check-design` scans every duration in both
stylesheets; a loading spinner's rotation period and the ambient drift
behind the panels are named exemptions, because a period is not a
duration.

**Never put an entrance animation on a container that re-renders.** This
screen re-renders on every answer; `.card { animation: rise }` faded the
whole page back in on every tap, which reads as the app stalling. The
entrance now fires only when the SCREEN changes — `deskRise()` keys on
mode, item, category and detail, and does nothing when the key is
unchanged.

**An entrance must start from a visible base state.** Written the wrong
way round first: `.rise{opacity:0}` with a `forwards` animation, which is
a card that stays blank for good if the animation never runs. It also
read as 1:1 contrast to `check-screens`, which folds in the composite
opacity of every ancestor and was right to. Base visible, keyframe fades
in from nothing. → `check-design`

**View Transitions go on the tab press, not around `render()`.** Wrapping
`render()` looked obvious and broke six `check-screens` blocks at once
with "drew:false": `startViewTransition` runs its callback
asynchronously, and this file reads the DOM straight after `render()` in
dozens of places.

**There is no field behind the panels.** One was built — a plain-canvas
star field, three depth layers, tilt parallax — because Section 6 of the
governing directive makes an effects layer compulsory and Section 4.2
names that exact look as the one to aim at. It lasted a single build.
"get rid of the particles." → `check-design` asserts its absence by id
*and by shape*, because the directive still says to build one and the
next pass over this file will read that and put it back.

The ambient colour washes on `body::before` stay. They predate all of
this and nobody has complained about them.

This is Section 1 doing its job: the counter's rules outrank everything
else in this document, and that includes a directive that outranks the
rest of it. A general standard written for projects trying to impress
does not get to add moving decoration to a screen somebody uses while a
customer waits.

No three.js and no Lenis either — 6.2 scopes three.js to Showpiece and
real 3D work and the desk has to come up off a cached copy with no
signal, and 6.3 excludes Lenis from shells that fit one screen, which
both of these are.

---

## 9. Rules with teeth — things that look right and measure wrong

Each of these was shipped, or nearly shipped, in this project.

- `overflow-wrap: anywhere` also collapses an element's min-content width
  to one character. `$35` came out stacked as `$ / 3 / 5`. Use `break-word`.
- A **percentage `max-width` on a grid item in an auto-sized track**
  resolves against the track it is helping to size. Circular; the answer
  changes with whatever else is in the box. Constrain the container.
- A **fixed px cap inside a proportional component** is a bug waiting for
  a smaller phone. `max-width: 170px` beat a 111px ring.
- **Two sources of truth drift.** `prices.json` and the `app.js` fallback
  were 171 rows apart. → `check-merge` requires them byte-identical.
- **A blanket string replace reaches inside strings.** `", " → ","` turned
  "AR-15, entry-level" into "AR-15,entry-level".

---

## 10. Accessibility is measured, not asserted

The reference asks for contrast "from day one" rather than a checklist at
the end. `tools/check-contrast.mjs` reads the tokens out of the live page,
composites every layer the way the compositor does (it still does the
alpha maths, even though the surfaces are opaque now — a future
translucent one would be caught rather than waved through), and
measures the real ratio **at every place the ambient field reaches** — a
ratio that only holds in one corner is not a ratio.

Body text 4.5:1. Large text and UI edges 3:1. It has failed five real
pairs so far; all five were fixed rather than excused.

Also required: a visible `:focus-visible` on everything interactive, and
`aria-current` on the dock.

---

## 11. Every rule gets a test, and the test must fail without the fix

**A test that passes with the fix removed is not a test.** This has
happened three times here:

- The dial-overlap check walked every state the app reaches — all of
  which have short labels — and passed with the constraint deleted. It
  now injects the longest strings the app ships.
- The auto-lookup check read the gate's *inputs* and called that a pass,
  proving the gate is reachable and nothing about whether it fires.
- The price-book drift check called a counter the suite does not have, so
  its failure branches would have thrown and the run would still exit 0.

- `check-design`, written on the October 2026 directive pass, failed on
  its own terms three separate ways before it was worth reading: it
  called a computed 13.9998px "under 14"; it probed 21px from the centre
  of controls whose box was already 44px and landed on their borders;
  and it treated `elementFromPoint` returning null for a control below
  the fold as "unreachable". Each of those printed a red line that was
  the suite's fault, which is as bad as a green one that is.

**Before trusting a new test, delete the fix and watch it fail.**
`check-design` was taken through five: the glass put back on `.card`,
one prose class dropped to 12.5px, one pill shrunk to 34px, one
`alert()` restored, and the entrance set back to `opacity:0`. All five
went red; restoring all five went green.

Current suites, with the counts they actually print when run —
`check-ask` (75), `check-merge` (47), `check-soldcomps` (37), and
`check-pricing`, `check-ebay`, `check-lookup`, `check-wizard`,
`check-screens`, `check-contrast`, `check-search`, `check-design`, which
report pass or fail without a total. Counting `ok(` in the source instead gives a
bigger, wrong number: some are never reached.

---

## 12. Before shipping

Any "no" is a revise, not a ship.

1. Side by side with the previous version, is the difference more than
   colour, font and radius? (Rule 5)
2. Does the page scroll at any of the eight measured sizes?
3. Is there a button whose only job is to reveal an input? (Rule 2)
4. Is anything on screen that this particular item does not need? (Rule 3)
5. Is there dead space a counter could have used? (Rule 4)
6. Does every card hold something at another elevation?
7. Is anything you read off it translucent?
8. Does every new ink clear its surface in `check-contrast`?
9. Does any figure appear without its source and its date?
10. Did you delete the fix and watch the new test fail?
