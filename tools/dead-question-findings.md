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

---

# The reachability sweep — 30 Sep 2026

"do the whole set."

A measured price nobody can reach is worse than no price: the desk quotes
something else with the same confidence. So: type each price-list row's own
name into the search box, take the FIRST result — what the counter takes,
and what Enter takes — and see where it lands.

**112 of 507 did not land on themselves.**

| you type | the desk offered | the book says |
|---|---|---|
| ps5 controller | the PS5 console, lend $100 | a DualSense is $35–80 |
| hp omen 16 | "Something else", lend $15 | $450–1,450 |
| Stihl FS 56 | an **acoustic guitar** | a string trimmer, $110–215 |
| Barnett Hyper Raptor | an **ATV** | a crossbow, $375–500 |
| Neo Geo AES | a **camera drone** | $600–850 |
| Echelon EX-3 | a **semi-auto pistol** | an exercise bike, $250–500 |
| Brother CS7000X | a **chainsaw** | a sewing machine, $150–200 |
| TaylorMade M4 iron set | an **AR-15**, lend $220 | golf clubs, $349–360 |
| Beats Solo 3 | "not on the lists", $15 | $34–55 |
| Razer Wolverine V2 | "Something else", lend $1,680 | a controller, $20–60 |

## Four causes

1. **A keyword pass that overwrote a measured match.** `omniRows` set
   `strong=true` when a price-list row matched the query, then a later line
   *reassigned* `strong` from the loose keyword pass instead of OR-ing it. A
   measured row matching is the strongest thing that can happen in that
   function, and it was being thrown away — which is why "Beats Solo 3" put
   "not on the lists" on top with the measured row underneath. **91 rows.**
2. **The aisle band outranking the exact row inside it.** A MODELBOOK hit is
   added first and marked strong, which is right when the words name a KIND
   of thing and wrong when they name a particular one. **~14 rows**, plus
   every variant: "iPhone 15" led with the 15 Pro, "Nintendo Switch" with
   the Switch 2, "PlayStation 4" with the PS4 Pro — a longer, dearer machine
   answering for the plain one.
3. **A model pattern from a different maker.** Yamaha makes an FS (guitar)
   and a Raptor (ATV); DJI makes a Neo; Springfield makes an Echelon; Echo
   makes a CS chainsaw. Each collided with a different maker's model and won.
   The same rule already guarded the price-list scoring — "a row carrying a
   maker the counter did not type is a different product" — it just was not
   applied one step earlier, where the wrong maker gets in. **6 rows**, and
   every one of them put a confident wrong item at the top of the list.
4. **A part priced as the machine it plugs into.** "ps5 controller" hit the
   PlayStation 5 on the word ps5 and the word saying which PART was never
   read. Fixed by dropping the machine when the query names the part — and
   by wiring the alias column (`r[9]`) into the search scoring, which has
   always existed and which the search had never read. Nobody hands you a
   "Sony DualSense"; they hand you a PS5 controller.

Plus one data bug: `e29` was filed under "Smart watch", which is not an
aisle the app has. One broken filing in 518.

**After: 507 of 507 land on their own row as the first result.**

## What I got wrong on the way

- My first accessory fix also promoted the generic "Game controller" shelf
  row to the top. That was worse than the bug: it led with a $30 row,
  resolved no measured price at all and quoted $1. Dropping the console is
  the whole fix.
- I broke the accessory regex myself writing it — `\b` in a Python patch
  string became a literal backspace character, so the pattern could never
  match and I spent four probes hunting a phantom. Scanned every file
  afterwards: no other damage.
- Two assertions in `check-reach.mjs` passed on the broken build, so they
  did not hold their fix; replaced with a count taken across all 507 rows.
  One of those counts has still never gone red, so it is reported as
  evidence rather than as a green tick of its own.

---

# The lend rate follows the evidence — 1 Oct 2026, NOT YET PUBLISHED

"Wouldn't we just need to keep most all items around 50% if we can get
verified prices from a source such as eBay?"

He was right, and the shape was worse than the question assumed. The lend
rate was:

    ltv = the aisle's rate + a liquidity adjustment

and nothing else. **Evidence strength did not enter it anywhere.** A Rolex
figure built from twelve verified eBay sales and a built-in guess nobody
had ever looked up lent the same share of resale.

## Why raising it pays

A Saturn that resells for $175, at 25% per 30 days:

| lend | he redeems (30d) | he redeems (60d) | he forfeits |
|---|---|---|---|
| $21 (12%) | +$5 | +$10 | yours at $21 |
| $53 (30%) | +$13 | +$26 | yours at $53 |
| $88 (50%) | +$22 | +$44 | yours at $88 |

Most pawns redeem, and 50% earns 4.4x what 12% does on the same ticket.
On a forfeit you still clear $64 after eBay fees.

## Why not a flat 50%

Of 519 rows: 305 graded high, 172 medium, 42 low; 304 name a count of real
sales, 28 name asking prices. Asks run high, and high is the wrong way to
be wrong when money is going out. The Saturn that started this is one of
the thin ones — "four listings on the whole page".

    real sales, several, recent      50%
    sold data but thin               32%
    asking prices only               25%
    nothing looked up                the aisle rate, unchanged

less a softened liquidity adjustment (fast 0, normal −2, slow −6) — because
how sure you are of the price and how long your money is out are two
different risks, and part of the aisle's big −13 was standing in for the
first one.

## Measured across the whole book

378 rows drive a price. **240 go up, 138 unchanged, 0 down.**

    total lent if you wrote every ticket:  $55,705 -> $69,550

| | conf | evidence | rate | lend |
|---|---|---|---|---|
| Sega Saturn | l | thin | 12% → 26% | $21 → $46 |
| Nintendo 64 | h | sold | 12% → 44% | $11 → $42 |
| iPhone 13 | h | sold | 25% → 50% | $48 → $95 |
| Xbox Series X | h | sold | 25% → 50% | $129 → $258 |
| Samsung TU7000 55in | h | sold | 20% → 48% | $20 → $48 |
| Rolex Datejust 36 | h | sold | 27% → 44% | $1,546 → $2,519 |
| DeWalt 20V drill kit | m | asking | 35% → 35% | unchanged |
| Remington 870 Express | m | thin | 50% → 50% | unchanged |

By aisle: Electronics 19%→41%, Fitness 16%→45%, Appliances 25%→47%,
Jewelry 32%→46%, Tools 33%→44%, Hunting 36%→46%, Firearms 49%→49%.

## It only ever raises

Where the aisle already lends more than the evidence band, the aisle wins.
**135 rows have evidence that says LESS than today** — the shotguns are the
clearest: Firearms lends 50% and their rows are conf=m with no sale count,
so the evidence band would say 32%. Cutting rates the counter has worked
to for months is a different decision and nobody asked for it. Those rows
are untouched and listed here for Jace to rule on separately.

## The question that is his, not mine

At these rates the same till carries fewer tickets — $55,705 of book value
becomes $69,550, a quarter more money out for the same number of loans.
That is a business call about how much he wants tied up, not a pricing one.
