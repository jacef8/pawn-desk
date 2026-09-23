/* The merge can push straight to main now, so the thing that decides
   whether a run is sane has to be tested like anything else that reaches
   the counter. Builds fake findings against the REAL prices.json and
   checks the breaker stops what it should and passes what it should. */
import { readFileSync, writeFileSync, copyFileSync, existsSync, unlinkSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRICES = join(ROOT, "prices.json");
const TMP = mkdtempSync(join(tmpdir(), "pdmerge-"));
const pj = JSON.parse(readFileSync(PRICES, "utf8"));
const SAFE = join(TMP, "prices.original.json");
copyFileSync(PRICES, SAFE);
/* A merge writes tools/price-changes.md. Snapshot it BEFORE anything runs -
   snapshotting later catches a report one of these tests just wrote, and
   the fixture gets left in the repo. */
const REPORT = join(ROOT, "tools/price-changes.md");
const reportBefore = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : null;
const restoreReport = () => {
  if (reportBefore === null) { if (existsSync(REPORT)) unlinkSync(REPORT); }
  else writeFileSync(REPORT, reportBefore);
};

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ok    " + m); } else { fail++; console.log("  FAIL  " + m); } };

function findings(mult, count, from = 0) {
  const f = {};
  pj.rows.slice(from, from + count).forEach((r) => {
    const m = typeof mult === "function" ? mult(r) : mult;
    f[r[1] + "|" + r[2]] = { id: r[0], ref: r[1], name: r[2],
      lo: Math.max(1, Math.round(r[3] * m)), hi: Math.max(1, Math.round(r[4] * m)),
      n: 12, conf: r[5], date: "2026-01-01", src: "https://www.ebay.com", note: "test" };
  });
  const p = join(TMP, "f" + Math.random().toString(36).slice(2) + ".json");
  writeFileSync(p, JSON.stringify({ found: f }));
  return p;
}
function run(out, extra = []) {
  try {
    const stdout = execFileSync(process.execPath, [join(ROOT, "tools/harvest.js"), "--merge", "--out", out, ...extra],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out: stdout };
  } catch (e) { return { code: e.status, out: String(e.stdout || "") + String(e.stderr || "") }; }
}
const untouched = () => readFileSync(PRICES, "utf8") === readFileSync(SAFE, "utf8");
const restore = () => { copyFileSync(SAFE, PRICES); const b = PRICES + ".bak"; if (existsSync(b)) unlinkSync(b); };

console.log("\nthe merge circuit breaker\n");

let r = run(findings(0.45, 30));
ok(r.code === 2, "a run that halves 30 rows is stopped");
ok(untouched(), "  and prices.json is not written");
restore();

r = run(findings(0.2, 4));
ok(r.code === 2, "a single row falling past a third stops the whole run");
ok(untouched(), "  and prices.json is not written");
restore();

r = run(findings(4, 3));
ok(r.code === 2, "a single row more than tripling stops it too");
restore();

r = run(findings(1.03, 30));
ok(r.code === 0, "a run that moves 30 rows by 3% goes through");
ok(!untouched(), "  and prices.json is written");
restore();

r = run(findings(0.45, 30), ["--force"]);
ok(r.code === 0, "--force merges what the breaker objected to");
restore();

r = run(findings((x) => 1.03, 30));
ok(/rows/.test(r.out), "the merge still reports what it did");
restore();

console.log("\nthe change report\n");

/* a realistic week: small drift on most, two big movers, one new row */
const mixed = {};
pj.rows.slice(0, 20).forEach((r, i) => {
  const m = i < 2 ? 1.34 : 1 + ((i % 7) - 3) / 100;
  mixed[r[1] + "|" + r[2]] = { id: r[0], ref: r[1], name: r[2],
    lo: Math.round(r[3] * m), hi: Math.round(r[4] * m),
    n: i < 2 ? 9 : 20, conf: r[5], date: "2026-01-01", basis: "asking",
    src: "https://www.ebay.com", note: "t" };
});
mixed["p1|Zzz Test Saw"] = { ref: "p1", name: "Zzz Test Saw", lo: 100, hi: 150, n: 14,
  conf: "m", date: "2026-01-01", basis: "asking", note: "t" };
const mixedPath = join(TMP, "mixed.json");
writeFileSync(mixedPath, JSON.stringify({ found: mixed }));

r = run(mixedPath);
ok(r.code === 0, "a mixed week merges");
const rep = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : "";
ok(/^# Price changes/m.test(rep), "  a report is written");
ok(/Worth a look/.test(rep), "  it has a 'worth a look' section");
ok(/\*\*\+34%\*\*/.test(rep), "  the 34% movers are called out as big");
ok(/## Ordinary drift/.test(rep), "  small drift is listed separately");
ok(/Zzz Test Saw/.test(rep), "  a new row is reported as new");
ok(/asking/.test(rep), "  it says the prices are asks");
const lookIdx = rep.indexOf("Worth a look"), driftIdx = rep.indexOf("Ordinary drift");
ok(lookIdx > 0 && driftIdx > lookIdx, "  the big movers come before the small ones");
restore();
restoreReport();

ok(untouched(), "prices.json is back exactly as it started");
ok(existsSync(REPORT) === (reportBefore !== null), "the test leaves no report behind");
/* A PRICE-BOOK ROW CANNOT TRAVEL AS A MODEL ROW.
   The one-offs are the generic kind of thing - "Wheelbarrow", "Grease gun"
   - and their names carry no model number. Both routes a measured price
   normally takes to the counter, mpAuto and harvFind, refuse to pin
   without a token containing a DIGIT, because a model number is the one
   part of a name that cannot be coincidence. So harvesting these into the
   model list would have paid for 166 lookups and thrown every one away.
   They travel in prices.json's "book" map instead. */
console.log("\n  a one-off lands in the book map, not the model list");
{
  const tmp = join(tmpdir(), "bookmerge-" + Date.now() + ".json");
  const before = JSON.parse(readFileSync(PRICES, "utf8"));
  writeFileSync(tmp, JSON.stringify({ updated: "2026-09-23", found: {
    "Wheelbarrow|Wheelbarrow": { ref: "Wheelbarrow", name: "Wheelbarrow",
      lo: 55, hi: 85, n: 14, conf: "m", date: "2026-09-23", basis: "sold" },
    "Remington 870 Express|x": { ref: "g1", name: "Remington 870 Express",
      lo: 310, hi: 410, n: 9, conf: "m", date: "2026-09-23", basis: "sold" },
  }}));
  let out = "";
  try { out = execFileSync("node", [join(ROOT, "tools/harvest.js"), "--merge", "--out", tmp],
                           { cwd: ROOT, encoding: "utf8" }); } catch (e) { out = String(e.stdout || e); }
  const after = JSON.parse(readFileSync(PRICES, "utf8"));
  ok(after.book && after.book["Wheelbarrow"] === 70,
     "the wheelbarrow lands in the book map at the mid of 55-85 — " + JSON.stringify(after.book));
  ok(after.rows.length === before.rows.length,
     "  and adds no row to the model list — " + before.rows.length + " → " + after.rows.length);
  ok(!after.rows.some(r => r[2] === "Wheelbarrow"),
     "  there is no 'Wheelbarrow' row among the models");
  const shot = after.rows.find(r => r[2] === "Remington 870 Express");
  ok(shot && shot[3] === 310 && shot[4] === 410,
     "  while an ordinary model row still goes where it always did — " + (shot ? shot[3] + "-" + shot[4] : "MISSING"));
  const report = readFileSync(join(ROOT, "tools/price-changes.md"), "utf8");
  ok(/One-off rows/.test(report) && /Wheelbarrow/.test(report),
     "  and the change report gives the one-offs their own section");
  /* put everything back */
  writeFileSync(PRICES, JSON.stringify(before, null, 0));
  try { unlinkSync(PRICES + ".bak"); } catch (e) {}
  try { unlinkSync(tmp); } catch (e) {}
  const restored = JSON.parse(readFileSync(PRICES, "utf8"));
  ok(!restored.book && restored.rows.length === before.rows.length,
     "prices.json is back exactly as it started");
}

/* A DRY RUN OF ALL 166 ONE-OFFS FOUND TWO HOLES. Both are here so they
   stay shut.
   The band that refuses an absurd row was computed during the LOOKUP, and
   the merge simply trusted the flag in the findings file. A merge can be
   run against a file from another day, another branch, or a version of
   this script from before the price book had a band at all - which is how
   a fabricated run put a $600 e-bike in at $2,583. The merge is the last
   gate before the counter, so it checks for itself now. */
console.log("\n  the merge re-checks the band itself");
{
  const tmp = join(TMP, "bookwild.json");
  /* no `wild` flag on either - exactly what an older findings file looks like */
  writeFileSync(tmp, JSON.stringify({ updated: "2026-09-23", found: {
    "E-bike|E-bike":   { ref: "E-bike", name: "E-bike", lo: 2100, hi: 3100,
                         n: 12, conf: "m", date: "2026-09-23", basis: "sold" },
    "Blender|Blender": { ref: "Blender", name: "Blender", lo: 26, hi: 38,
                         n: 11, conf: "m", date: "2026-09-23", basis: "sold" },
  }}));
  let out = "";
  try { out = execFileSync(process.execPath, [join(ROOT, "tools/harvest.js"), "--merge", "--out", tmp],
                           { cwd: ROOT, encoding: "utf8" }); } catch (e) { out = String(e.stdout || e); }
  const bk = JSON.parse(readFileSync(PRICES, "utf8")).book || {};
  ok(bk["E-bike"] === undefined,
     "a $600 e-bike coming back at $2,600 is refused, flag or no flag — " + JSON.stringify(bk["E-bike"]));
  ok(bk["Blender"] === 32, "  while a sane row beside it still lands — " + JSON.stringify(bk["Blender"]));
  ok(/held back as wild/.test(out), "  and the run says so");
  restore(); restoreReport();
}

/* The one-offs were rewritten in their own lane and never reached the
   breaker's list, so a run could rewrite 153 price-book rows - four of them
   past 4x - and exit 0 having seen nothing. They reach the counter through
   the same screens as every other price. */
console.log("\n  the breaker counts the one-offs");
{
  const APP = readFileSync(join(ROOT, "app.js"), "utf8");
  const i = APP.indexOf("const PRICEBOOK=["), j = APP.indexOf("[", i);
  let d = 0, end = j;
  for (let k = j; k < APP.length; k++) {
    if (APP[k] === "[") d++;
    else if (APP[k] === "]" && --d === 0) { end = k; break; }
  }
  const PB = new Function("return " + APP.slice(j, end + 1))();
  /* every one-off jumping about 80% - the shape of a broken search, not a market */
  const found = {};
  for (const e of PB) {
    const mid = e[1] * 1.8;
    found[e[0] + "|" + e[0]] = { ref: e[0], name: e[0], lo: Math.round(mid * 0.9),
      hi: Math.round(mid * 1.1), n: 12, conf: "m", date: "2026-09-23", basis: "sold" };
  }
  const tmp = join(TMP, "bookbreak.json");
  writeFileSync(tmp, JSON.stringify({ updated: "2026-09-23", found }));
  let code = 0, out = "";
  try { out = execFileSync(process.execPath, [join(ROOT, "tools/harvest.js"), "--merge", "--out", tmp],
                           { cwd: ROOT, encoding: "utf8" }); }
  catch (e) { code = e.status; out = String(e.stdout || "") + String(e.stderr || ""); }
  ok(code === 2, "a run where every one-off jumps 80% is refused — exit " + code);
  ok(/moved more than 60%/.test(out), "  and it says why — " + (out.match(/.*moved more than 60%.*/) || [""])[0].trim());
  ok(!JSON.parse(readFileSync(PRICES, "utf8")).book, "  and nothing was written");
  restore(); restoreReport();
}

ok(untouched(), "prices.json is back exactly as it started after the one-off tests");
ok(existsSync(REPORT) === (reportBefore !== null), "  and no report is left behind");

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
