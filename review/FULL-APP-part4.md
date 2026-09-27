# Whole-app review — part 4 of 4

Continuation of the Pawn Desk review. The brief was in part 1. This is the last part — please answer now.
## The data files, sampled

These are data, not logic. Shapes and a few rows each; ask for a whole file if a row's contents matter to a finding.

### `prices.json` — 493 entries

```json
[
 [
  "a1",
  "g1",
  "Remington 870 Express",
  300,
  400,
  "m",
  "2026-09-19",
  "https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+870+express",
  "Super Mag or extra barrels add; rust lowers"
 ],
 [
  "a2",
  "g1",
  "Remington 870 Wingmaster",
  450,
  625,
  "m",
  "2026-09-19",
  "https://gunwatcher.com/gun-value-sold-information/market-price?itemName=remington+870+wingmaster",
  "Bluing and wood; 16, 28 and .410 bring far more"
 ],
 [
  "a3",
  "g1",
  "Mossberg 500",
  225,
  325,
  "m",
  "2026-09-19",
  "https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+500",
  "Combo barrels and chokes add"
 ],
 [
  "a4",
  "g1",
  "Mossberg 590 / 590A1",
  380,
  550,
  "m",
  "2026-09-19",
  "https://gunwatcher.com/gun-value-sold-information/market-price?itemName=mossberg+590a1",
  "590A1 heavy barrel on top; plain 590 less"
 ]
]
```

### `fakes.json` — 4 entries

```json
{
 "updated": "2026-09-20",
 "source": "Lamar's Counter Cheat Sheets - Spotting Fakes (Business Plan and Operations). That document is the full version; these are its 60-second checks. Both are generated from sheets-source.json."
}
```

### `metals-risk.json` — 6 entries

```json
{
 "built": "2026-09-27",
 "source": "LBMA daily fixings, prices.lbma.org.uk"
}
```

### `item-noise.json` — 0 entries

```json
{}
```
