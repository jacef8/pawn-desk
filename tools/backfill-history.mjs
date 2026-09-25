/* SEED THE PRICE HISTORY FROM GIT.
 *
 * Every merge since 19 Sep committed prices.json, so the past is already in
 * the repo - it has just never been readable as a series. This walks those
 * commits oldest first and writes one entry per CHANGE, which is what the
 * harvest will append to from now on.
 *
 * Run once. It is safe to run again: entries are keyed by date and value, so
 * a second pass adds nothing.
 *
 * What it produces is thin and honest about it. Five days, and most of the
 * movement in it is corrections - a hand raise on 20 Sep, the first real eBay
 * measurement on 24 Sep - rather than the market moving. It is a floor to
 * build on, not a trend to price off.
 */
import { execSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const HIST = join(HERE, "harvest-history.json");
const sh = (c) => execSync(c, { cwd: join(HERE, ".."), encoding: "utf8", maxBuffer: 1 << 28 });

const log = sh('git log --format="%H %ad" --date=short --follow --reverse -- prices.json')
  .split("\n").filter(Boolean);

let H = {};
if (existsSync(HIST)) { try { H = JSON.parse(readFileSync(HIST, "utf8")).rows || {}; } catch (e) {} }

let commits = 0, points = 0;
for (const line of log) {
  const [sha, date] = line.split(/\s+/);
  let d;
  try { d = JSON.parse(sh(`git show ${sha}:prices.json`)); } catch (e) { continue; }
  const rows = Array.isArray(d) ? d : d.rows;
  if (!Array.isArray(rows)) continue;
  commits++;
  for (const r of rows) {
    if (!Array.isArray(r) || r.length < 5) continue;
    const k = r[1] + "|" + String(r[2]).toLowerCase();
    const at = (H[k] = H[k] || []);
    const last = at[at.length - 1];
    if (last && last[1] === r[3] && last[2] === r[4]) continue;
    at.push([r[6] || date, r[3], r[4], /sales? in the last/i.test(String(r[8] || "")) ? "sold" : "ask"]);
    points++;
  }
}
for (const k of Object.keys(H)) H[k].sort((a, b) => String(a[0]).localeCompare(String(b[0])));

writeFileSync(HIST, JSON.stringify(
  { updated: new Date().toISOString().slice(0, 10),
    note: "What each row used to be worth. One entry per change. Seeded from git, then appended by the harvest.",
    rows: H }, null, 1));

const moved = Object.values(H).filter((v) => v.length > 1).length;
console.log(`\n  ${commits} commits of prices.json read`);
console.log(`  ${Object.keys(H).length} rows now have a history, ${moved} of them more than one point`);
console.log(`  ${points} points written to ${HIST}\n`);
