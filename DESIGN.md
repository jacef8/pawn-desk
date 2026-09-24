# The Pawn Desk — design directive

This governs how this app looks and behaves. It is not a general style
guide; it is written from four references Jace chose, the screenshots he
sent back, and what he said when he rejected two earlier designs.

Where a rule can be measured, the test that measures it is named. That is
the point of the document. Two full redesigns were shipped on judgement
and both were rejected; every rule below that has a test attached has
stayed put.

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
- Minimums: body 15px, secondary 13px, labels 12px. Nothing smaller.
- No glow, halo or text-shadow on any text, ever. Sharp beats luminous.

⚠️ **Webfonts are a network dependency and they do not always arrive.**
They are blocked in the build sandbox, which means every screenshot in
this project's history rendered a system fallback. Do not judge type from
a screenshot taken here, and keep the fallback stack good enough to ship.

---

## 4. Material and shape

Liquid glass: translucent surfaces over a live colour field, so depth is
refraction rather than a drawn bevel. `backdrop-filter: blur(20px)
saturate(165%)`.

**Glass is for surfaces you look AT. Anything you read OFF is opaque.**
The search dropdown was folded in with the cards once and you could read
the page's own hint line straight through the suggestions.

Concentric radii: `26px` housing → `18px` widget → `12px` readout. Pills
only for a segmented control sunk into a well — never a floating pill.

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

Micro-interactions only: a press answers, a card that genuinely just
arrived rises 14px. Guard everything with `prefers-reduced-motion`.

**Never put an entrance animation on a container that re-renders.** This
screen re-renders on every answer; `.card { animation: rise }` faded the
whole page back in on every tap, which reads as the app stalling.

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
composites every translucent layer the way the compositor does, and
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

**Before trusting a new test, delete the fix and watch it fail.**

Current suites, with the counts they actually print when run —
`check-ask` (75), `check-merge` (47), `check-soldcomps` (37), and
`check-pricing`, `check-ebay`, `check-lookup`, `check-wizard`,
`check-screens`, `check-contrast`, `check-search`, which report pass or
fail without a total. Counting `ok(` in the source instead gives a
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
