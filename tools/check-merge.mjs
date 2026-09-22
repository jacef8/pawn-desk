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

ok(untouched(), "prices.json is back exactly as it started");
console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
