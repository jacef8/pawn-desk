# The dead-question sweep — 30 Sep 2026

"Run a complete review of the app and make sure this quits happening."

Swept every catalog item (76) and every book row (507, of which 377 drive a
price), trying every option of every question and recording what the buy,
the loan and the resale came out at. A question whose every answer lands on
the same number is collecting a keystroke at a counter with a customer
waiting and giving nothing back.

## What it found

**649 discarded specification answers across 377 measured rows**, in 42
distinct questions. One cause, one line:

    resale = checked ? market.mid * cond * completeMult
                     : baseValue * CATALOG_AT_GOOD * cond * brandMult
                       * completeMult * spec.mult

`spec.mult` was in the second branch and not the first, so the moment an
item had a measured price every specification answer was thrown away.

The worst of them, by what the multiplier says it should have done:

| question | rows | spread | what was being priced wrong |
|---|---|---|---|
| Does it start? | 19 | 0.4 | a chainsaw that will not run priced as a running one |
| Movement | 26 | 0.55 | a quartz Datejust priced as an automatic |
| Power | 12 | 0.4–1.0 | a bare battery trimmer priced as a gas one |
| Drive | 10 | 0.5–1.15 | a corded mower priced as self-propelled |
| Screen size | 1 | 0.5–1.4 | a 32in set priced as a 55in |
| What came with it | 53 | 0.52–1.64 | a bare tool priced as a two-battery kit |
| Battery platform | 19 | 0.6–1.2 | a 12V drill priced as 20V |
| Lock | 15 | 0.85 | an iCloud-locked iPhone priced as clean |
| Box and papers | 26 | 1.0–1.6 | a console complete in box priced as loose |
| Caliber / Gauge / Type / Size | 189 | 0.8–1.3 | the gun rows, every one of them |

Measured after the fix:

    Rolex Datejust 36, quartz        $1,830 -> $1,010
    Honda mower, corded electric       $160 ->   $80
    Samsung 55in row, under 43in        $40 ->   $20
    DeWalt 20V drill, 12V platform      $35 ->   $20
    Sega Saturn, console alone          $55 ->   $35
    Sega Saturn, complete in box        $55 ->   $90

**The baseline is what makes the fix safe.** Audited all 125 spec groups:
every one has an option at exactly 1.0, and `specBase` already returns the
first `m===1` option as the unanswered default. So the neutral of every
group is the standard configuration, which is what the book row was
measured on. Nothing is rebased. Checked all 377 rows before and after with
nothing answered: **0 changed**. The fix bites only when somebody answers.

**A stop that arrived seven questions late.** "NO title" sets `spec.stop`
the moment it is tapped, and the NO DEAL banner was only on the finished
answer card. So the counter said the quad has no title and the desk asked
him what class it was, what shape it was in, what came with it and what one
sells for before telling him not to buy it at any price. It rides the run
now, from the tap onward.

## The three that legitimately do not move the number

Each is exempt in `tools/check-dead.mjs`, and each exemption is followed by
an assertion that the other mechanism still works — excusing a question
without proving that is how a dead question gets written down as intentional.

- **What make is it?** (371 rows) — a measured figure for this exact model
  already has the maker in it; multiplying by a tier would price it twice.
  Stays in the run, marked settled rather than outstanding, still reachable
  because the make is part of what chose the row.
- **Plain one, or special?** (26 rows) — measured 1.7x to 4.4x over the
  plain machine. Far too wide for one multiplier, so the option carries none
  and says to look it up.
- **Title** (6 rows) — no title is not a discount, it is a stop.

## Still open

- `r1` / `r2` "Title" and the console variant are the only questions in the
  app that a counter answers and the arithmetic deliberately ignores. Both
  are right to, but both depend on the counter reading a note.
- 130 book rows do not drive a price at all under a bare pick (no matching
  item ref, or the row is filed under a band the pick does not land on).
  Not investigated here.
