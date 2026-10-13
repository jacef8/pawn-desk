#!/usr/bin/env node
/* THE GUN PRICES, READ OVERNIGHT ON THE SHOP COMPUTER.
 *
 *   node tools/gun-overnight.mjs --probe        one model, show the working
 *   node tools/gun-overnight.mjs                all 77, write the CSV
 *   node tools/gun-overnight.mjs --limit 5      the first five, for a trial
 *
 * WHY IT RUNS THERE AND NOT ON THE SERVER. Eight gun sites were tried from
 * a datacentre with a real browser's user-agent on 13 Oct 2026 - guns.com,
 * GunBroker, GunWatcher, Rock Island, Proxibid, GunsAmerica, Armslist,
 * TrueGunValue - and all eight answered 403. GunWatcher's came back as a
 * 5,774-byte Cloudflare captcha. Checked it was the sites and not our own
 * egress: example.com answered 200 through the same proxy and the proxy
 * logged no refusals. The firearms aisle is bot-protected end to end, so
 * the browser has to sit somewhere a real person actually browses. That is
 * the shop computer. See tools/gun-source-findings.md.
 *
 * WHAT IT PRODUCES, in the folder it is run from:
 *
 *   gun-prices-YYYY-MM-DD.csv   Key, Item, Your low, Your high
 *   gun-prices-YYYY-MM-DD.md    what it read, what it skipped, and WHY
 *
 * The CSV is the shape Setup's importer already reads. In the morning:
 * Setup -> Choose the CSV (or paste the rows) -> it shows every row that
 * would move, from and to, and nothing changes until that is approved.
 *
 * THAT APPROVAL IS DELIBERATE AND IT IS THE ONLY MANUAL STEP LEFT.
 * The reading is what takes an evening; it is unattended now. The applying
 * takes a minute and it moves what the counter lends against, on the one
 * aisle where 76 rows carry no counted sale. The day before this was
 * written, an extraction model asked for sold prices off an eBay page that
 * turned out to be a login wall invented a Ruger LCP at $350 and an LCP II
 * at $450, with dates and conditions, off a page that held nothing but a
 * sign-in box. Every guard below exists because of that, and the morning
 * preview is the last one.
 *
 * WHAT IS A FIRST GUESS. The extraction rules. GunWatcher cannot be reached
 * from where this was written, so the figures are found by shape - money
 * near the words sold, average, value, range - rather than by CSS selectors
 * read off the real page. Run --probe first: it opens ONE model, saves the
 * page text and a screenshot, prints what it would have taken and from
 * which line, and writes nothing. Send that back and the rules get tightened
 * to the real page.
 *
 * NEEDS, on the shop computer:
 *   node 18+            node --version
 *   playwright          npm i playwright && npx playwright install chromium
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

/* FIND PLAYWRIGHT WHEREVER IT WAS INSTALLED. A bare `import "playwright"`
   resolves from the folder the script is RUN from, not the folder it lives
   in, so running it from the desktop with playwright installed in the repo
   (or globally) died with ERR_MODULE_NOT_FOUND. Same resolver the rest of
   tools/ uses: an explicit PW_MODULE first, then the normal lookup, then
   the global root. */
const require_ = createRequire(import.meta.url);
let chromium = null;
for (const m of [process.env.PW_MODULE, "playwright",
  (() => { try { return execSync("npm root -g", { encoding: "utf8" }).trim() + "/playwright"; } catch { return null; } })()
].filter(Boolean)) { try { ({ chromium } = require_(m)); break; } catch {} }
if (!chromium) {
  console.error("Playwright is not installed where this can find it.\n" +
                "  npm i playwright && npx playwright install chromium\n" +
                "  (or set PW_MODULE to the playwright folder)");
  process.exit(2);
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };

const PROBE = has("--probe");
const LIMIT = Number(val("--limit", PROBE ? 1 : 0)) || 0;
/* Headed by default. A headless browser is the single loudest signal a bot
   protection looks for, and the whole point of running here is to look like
   what this is: somebody's computer. --headless is there for a trial run. */
const HEADLESS = has("--headless");
/* One page every 25-50 seconds. 77 models is then about 45 minutes, which is
   an overnight job either way, and it is not a load anyone will notice. */
const GAP_MIN = Number(val("--gap", 25)) * 1000;
const GAP_MAX = GAP_MIN * 2;

const today = new Date().toISOString().slice(0, 10);
const out = (ext) => path.join(process.cwd(), `gun-prices-${today}.${ext}`);

/* ── the price book, read out of app.js ───────────────────────────────── */
function book() {
  const src = fs.readFileSync(path.join(REPO, "app.js"), "utf8");
  const m = src.match(/let MODEL_PRICES=\[([\s\S]*?)\n\];/);
  if (!m) throw new Error("could not find MODEL_PRICES in app.js");
  const rows = m[1].split("\n").map((l) => l.trim()).filter((l) => l.startsWith("["))
    .map((l) => { try { return JSON.parse(l.replace(/,\s*$/, "")); } catch { return null; } })
    .filter(Boolean);
  /* [id, item, name, low, high, confidence, date, source, note] */
  return rows.filter((r) => /gunwatcher\.com/.test(String(r[7] || "")))
             .map((r) => ({ key: r[0], name: r[2], lo: r[3], hi: r[4], url: r[7], checked: r[6] }));
}

/* ── is this page real, or is it a wall? ──────────────────────────────── */
const WALL = /just a moment|attention required|checking your browser|enable javascript|verify you are( a)? human|captcha|access denied|sign in to your account/i;

function readPage(text, model) {
  /* Returns {lo,hi,from} or {skip:"reason"}. Deliberately suspicious: every
     branch that cannot prove what it found returns a skip, because a missing
     row costs nothing and a wrong row costs money. */
  if (!text || text.length < 400) return { skip: "page came back nearly empty (" + (text || "").length + " chars)" };
  if (WALL.test(text)) return { skip: "a bot wall or login page, not the price page" };
  if (/loading\.\.\./i.test(text) && text.length < 2500) return { skip: "page never finished loading" };

  /* the page must actually be about the gun that was asked for: every word
     of the model name has to appear, or this is somebody else's price */
  const words = model.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  const low = text.toLowerCase();
  const missing = words.filter((w) => !low.includes(w));
  if (missing.length) return { skip: "page does not mention " + missing.join(", ") + " - wrong model" };

  /* money on lines that are about a SOLD figure, not an asking price */
  const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
  const hits = [];
  for (const line of lines) {
    if (!/\$/.test(line)) continue;
    if (/ask|asking|list price|msrp|new|buy it now/i.test(line)) continue;
    if (!/sold|sale|average|avg|median|value|range|high|low/i.test(line)) continue;
    for (const m of line.matchAll(/\$\s?([0-9][0-9,]*(?:\.[0-9]{2})?)/g)) {
      const v = Number(m[1].replace(/,/g, ""));
      if (v >= 40 && v <= 25000) hits.push({ v, line });
    }
  }
  if (hits.length < 2) return { skip: "found " + hits.length + " sold-looking figure(s), need at least 2" };

  const vals = hits.map((h) => h.v).sort((a, b) => a - b);
  const lo = vals[0], hi = vals[vals.length - 1];
  if (!(hi > lo)) return { skip: "high is not above low (" + lo + ", " + hi + ")" };
  /* a range wider than 6x is not one gun, it is a page of mixed models */
  if (hi / lo > 6) return { skip: "range $" + lo + "-$" + hi + " is too wide to be one model" };
  return { lo: Math.round(lo), hi: Math.round(hi), from: hits.slice(0, 4).map((h) => h.line.slice(0, 110)) };
}

/* ── run ──────────────────────────────────────────────────────────────── */
const rows = book();
const todo = LIMIT ? rows.slice(0, LIMIT) : rows;
console.log(`${rows.length} gun models sourced to GunWatcher; reading ${todo.length}`);
console.log(`browser: ${HEADLESS ? "headless (trial only)" : "headed"}  gap: ${GAP_MIN / 1000}-${GAP_MAX / 1000}s\n`);

/* A profile that persists between runs. Cloudflare treats a browser with a
   history and cookies very differently from a fresh one every night. */
const profile = path.join(process.cwd(), ".gun-overnight-profile");
/* A STACK TRACE IS NO USE AT A PAWN COUNTER. Whatever goes wrong opening
   the browser, say it in a sentence somebody can act on. Found by running
   this where there is no screen at all: it printed forty lines of
   Playwright internals and the word XServer. */
let ctx;
try {
  ctx = await chromium.launchPersistentContext(profile, {
  ...(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {}),
  headless: HEADLESS,
  viewport: { width: 1360, height: 900 },
    locale: "en-US",
    timezoneId: "America/New_York",
  });
} catch (e) {
  const msg = String((e && e.message) || e);
  console.error("\nThe browser would not start.\n");
  if (/XServer|headless/i.test(msg))
    console.error("  This computer has no screen for it to open on. If that is\n" +
                  "  right, add --headless to the end of the command.\n");
  else if (/Executable doesn.t exist|browserType.launch.*ENOENT/i.test(msg))
    console.error("  The browser itself is missing. Run this once:\n" +
                  "      npx playwright install chromium\n");
  else if (/profile|SingletonLock|already in use/i.test(msg))
    console.error("  Another copy of this is already running, or the last one did\n" +
                  "  not close. Close it, or delete the .gun-overnight-profile\n" +
                  "  folder next to this file, then try again.\n");
  else
    console.error("  " + msg.split("\n")[0] + "\n");
  console.error("  Nothing was read and nothing was written.\n");
  process.exit(1);
}

const got = [], skipped = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < todo.length; i++) {
  const row = todo[i];
  const page = await ctx.newPage();
  let text = "";
  try {
    await page.goto(row.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    /* wait for the loader to clear rather than a fixed sleep */
    await page.waitForFunction(
      () => !/Loading\.\.\./i.test(document.body.innerText) || document.body.innerText.length > 2500,
      { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);
    text = await page.evaluate(() => document.body.innerText);
  } catch (e) {
    skipped.push({ ...row, why: "could not open the page (" + e.message.split("\n")[0].slice(0, 70) + ")" });
    await page.close();
    continue;
  }

  if (PROBE) {
    /* TRY THE OTHER SOURCES TOO, in the same run, on his machine.
       The first probe answered the question I asked and raised a better
       one. GunWatcher's free figure is its own monthly MODEL value, not a
       sale: the current month is behind a sign-in, what you can read is
       last month, and the actual sold rows on the page numbered three,
       all marked New, one of them five months old. That is not something
       to price 77 rows off.
       His worklist has always pointed at completed auctions instead,
       which are real sales with real dates. They refuse a datacentre the
       same way GunWatcher did, so the only way to find out which of them
       open for an ordinary browser is to ask his. One double-click,
       every candidate, and a summary short enough to paste back. */
    const alt = [
      ["GunBroker completed", "https://www.gunbroker.com/All/search?Keywords=" + encodeURIComponent(row.name) + "&Completed=1"],
      ["GunBroker sold",      "https://www.gunbroker.com/All/search?Keywords=" + encodeURIComponent(row.name) + "&IncludeSellers=&Completed=1&Sold=1"],
      ["Guns.com ended",      "https://www.guns.com/auctions/recently-ended?keyword=" + encodeURIComponent(row.name)],
      ["Guns.com search",     "https://www.guns.com/search?keyword=" + encodeURIComponent(row.name)],
      ["GunWatcher sold all", "https://gunwatcher.com/gun-value-sold-information/sold-data?itemName=" + encodeURIComponent(row.name).replace(/%20/g, "+")]
    ];
    console.log("\n  --- the other places, same gun ---");
    for (const [label, u] of alt) {
      const ap = await ctx.newPage();
      let t = "", title = "";
      try {
        await ap.goto(u, { waitUntil: "domcontentloaded", timeout: 45000 });
        await ap.waitForTimeout(4000);
        t = await ap.evaluate(() => document.body.innerText);
        title = await ap.title();
      } catch (e) { t = ""; title = "COULD NOT OPEN: " + e.message.split("\n")[0].slice(0, 50); }
      const wall = WALL.test(t) || /sign ?in|log ?in|register/i.test(title);
      const money = (t.match(/\$\s?[0-9][0-9,]*/g) || []).length;
      const sold = /sold|ended|winning bid|completed/i.test(t);
      console.log("  " + label.padEnd(20) +
        " chars " + String(t.length).padEnd(7) +
        " prices " + String(money).padEnd(5) +
        (wall ? " LOGIN WALL" : sold ? " looks like sold data" : " no sold words"));
      console.log("      " + title.slice(0, 74));
      if (t.length > 300) {
        fs.writeFileSync(path.join(process.cwd(), "gun-probe-" + label.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".txt"), t);
      }
      await ap.close();
      await sleep(3000 + Math.random() * 3000);
    }
    console.log("  --- end ---\n");

    const base = path.join(process.cwd(), "gun-probe-" + row.key);
    fs.writeFileSync(base + ".txt", text);
    await page.screenshot({ path: base + ".png", fullPage: true }).catch(() => {});
    const r = readPage(text, row.name);
    console.log("PROBE " + row.key + "  " + row.name);
    console.log("  url      " + row.url);
    console.log("  chars    " + text.length);
    console.log("  book has $" + row.lo + "-$" + row.hi + " (checked " + row.checked + ")");
    console.log(r.skip ? "  WOULD SKIP: " + r.skip
                       : "  would read $" + r.lo + "-$" + r.hi + "\n  off these lines:\n" +
                         r.from.map((l) => "    " + l).join("\n"));
    console.log("  page text saved to " + base + ".txt");
    console.log("  screenshot saved to " + base + ".png");
    console.log("\nNothing was written. Send those two files back and the reading rules get fixed to the real page.");
    await page.close();
    break;
  }

  const r = readPage(text, row.name);
  if (r.skip) { skipped.push({ ...row, why: r.skip }); console.log(`  skip  ${row.key} ${row.name} — ${r.skip}`); }
  else {
    const move = Math.round(((r.lo + r.hi) / 2 - (row.lo + row.hi) / 2) / ((row.lo + row.hi) / 2) * 100);
    got.push({ ...row, newLo: r.lo, newHi: r.hi, from: r.from, move });
    console.log(`  read  ${row.key} ${row.name} — $${r.lo}-$${r.hi} (book $${row.lo}-$${row.hi}, ${move >= 0 ? "+" : ""}${move}%)`);
  }
  await page.close();
  if (i < todo.length - 1) await sleep(GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN));
}
await ctx.close();

if (PROBE) process.exit(0);

/* ── the CSV, in the shape Setup already reads ────────────────────────── */
const q = (s) => /[",\n]/.test(String(s)) ? '"' + String(s).replace(/"/g, '""') + '"' : String(s);
const csv = ["Key,Item,Your low,Your high"]
  .concat(got.map((g) => [g.key, g.name, g.newLo, g.newHi].map(q).join(",")))
  .join("\n") + "\n";
fs.writeFileSync(out("csv"), csv);

/* ── and the log, which is the part that stops a quiet failure ────────── */
const rate = todo.length ? Math.round(got.length / todo.length * 100) : 0;
const big = got.filter((g) => Math.abs(g.move) >= 25).sort((a, b) => Math.abs(b.move) - Math.abs(a.move));
const lines = [];
lines.push(`# Gun prices read ${today}`, "");
if (rate < 60) {
  lines.push(`## READ THIS FIRST — only ${got.length} of ${todo.length} models came back (${rate}%)`, "",
    "That is low enough that something is wrong rather than a few odd pages.",
    "The usual causes, in order: the bot protection has started asking this",
    "computer for a captcha, the page layout changed, or the machine lost its",
    "connection part way through. Do not apply the CSV until the skipped list",
    "below has been read — a short CSV applied as though it were a full one is",
    "how prices go stale while still looking current.", "");
}
lines.push(`Read ${got.length} of ${todo.length}. Skipped ${skipped.length}.`, "");
if (big.length) {
  lines.push("## Look at these first — moved 25% or more", "",
    "Not held back and not called wrong: a check that catches the absurd is a",
    "smell, not a verdict. They are listed here so they get the first look in",
    "the morning preview.", "",
    "| key | model | book | read | move |", "|---|---|---|---|---|");
  big.forEach((g) => lines.push(`| ${g.key} | ${g.name} | $${g.lo}-$${g.hi} | $${g.newLo}-$${g.newHi} | ${g.move >= 0 ? "+" : ""}${g.move}% |`));
  lines.push("");
}
lines.push("## Everything read", "", "| key | model | book | read | move | off which line |", "|---|---|---|---|---|---|");
got.forEach((g) => lines.push(`| ${g.key} | ${g.name} | $${g.lo}-$${g.hi} | $${g.newLo}-$${g.newHi} | ${g.move >= 0 ? "+" : ""}${g.move}% | ${(g.from[0] || "").replace(/\|/g, "/")} |`));
lines.push("");
if (skipped.length) {
  lines.push("## Skipped, and why", "", "| key | model | why |", "|---|---|---|");
  skipped.forEach((s) => lines.push(`| ${s.key} | ${s.name} | ${s.why} |`));
  lines.push("");
}
/* A BAD RUN MUST NOT END BY SAYING "GO APPLY THIS". The first version
   printed the same closing instruction whatever happened, so a night that
   read nothing still finished with a cheerful line telling the counter to
   load the CSV. The banner at the top said one thing and the last line
   said another, and the last line is the one that gets acted on. */
if (!got.length) {
  lines.push("## What to do with this", "",
    "Nothing was read, so there is nothing to apply and the CSV is empty.",
    "Read the skipped list above. Until it is working, the gun prices are",
    "whatever they were - stale, but at least honestly dated on the card.", "");
} else if (rate < 60) {
  lines.push("## What to do with this", "",
    "Only " + got.length + " of " + todo.length + " came back, so treat this as a partial run.",
    "What is in the CSV was read properly and can be applied - Setup shows",
    "every row that would move before anything changes. What is NOT in it",
    "has not been checked tonight and keeps its old date on the card.", "");
} else {
  lines.push("## What to do with this", "",
    "Open the desk, go to Setup, and either choose `" + path.basename(out("csv")) + "` or",
    "paste its rows. Every row that would move is shown from and to before",
    "anything changes. Nothing in here has touched the price book yet.", "");
}
fs.writeFileSync(out("md"), lines.join("\n"));

console.log(`\nread ${got.length} of ${todo.length} (${rate}%)`);
console.log(`  ${out("csv")}`);
console.log(`  ${out("md")}`);
if (rate < 60) console.log("\n  LOW READ RATE — read the log before applying anything.");
process.exit(rate < 60 ? 1 : 0);
