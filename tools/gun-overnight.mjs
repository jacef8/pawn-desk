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
 * WHAT IT READS NOW, AND WHAT CHANGED. It used to read GunWatcher's free
 * market-price page. That page turned out to be one monthly model figure
 * with the current month behind a sign-in, backed by three sold rows - not
 * something to price 77 lines of the book off. So it reads guns.com's used
 * section instead:
 *
 *     https://www.guns.com/used-guns?keyword=<the model>
 *
 * which filters to the model properly, is all used stock, and came off
 * Jace's own machine on 13 Oct 2026 with 212 results for one shotgun.
 *
 * THESE ARE ASKING PRICES AND THE BOOK HAS TO SAY SO. They are what a
 * large national dealer lists the same used model at today. That is a real
 * signal and a far better one than nothing on an aisle where 76 rows carry
 * no counted sale. But an ask is not a sale, asks run high, and high is the
 * wrong way to be wrong when money is going out.
 *
 * THE EXTRACTION RULES ARE NO LONGER GUESSES. They are written against two
 * real pages saved off the shop computer, both in tools/fixtures/, and
 * tools/check-overnight.mjs lifts readPage() out of THIS file and runs it
 * against them. One of those pages is the recently-ended page, which is
 * here because it beat the first version of the guard: headed "REMINGTON
 * 870 EXPRESS 15450 RESULTS" and listing a Glock, a Springfield and a gold
 * Colt Python. Run --probe first on any new site before trusting it.
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
  /* The gun rows are the ones whose recorded source is GunWatcher - that is
     how they were sourced originally and it is still what marks them out as
     the firearms aisle. Where they are READ from is guns.com now. */
  return rows.filter((r) => /gunwatcher\.com/.test(String(r[7] || "")))
             .map((r) => ({ key: r[0], name: r[2], lo: r[3], hi: r[4], checked: r[6],
                            q: searchFor(r[2]), url: usedUrl(searchFor(r[2])) }));
}

/* ── WHERE THE NUMBERS COME FROM NOW ──────────────────────────────────
   guns.com's used section, which is the one thing on the open web that
   is reachable, filters to one model, and is about USED guns.

   Measured 13 Oct 2026, from Jace's own machine and from a stealth
   proxy, five sources for the same gun:

     GunBroker completed   "Just a moment..."   Cloudflare
     GunBroker sold        "Just a moment..."   Cloudflare
     Guns.com ended        opens, 24 prices, IGNORES the search - it
                           answered a Remington query with Glocks
     Guns.com search       opens, filters properly, mixes new and used
     GunWatcher sold-data  Cloudflare

   And GunWatcher's free market-price page, which this used to read, is
   its own monthly MODEL value with the current month behind a sign-in,
   backed by three actual sold rows. Not something to price 77 rows off.

   SO THESE ARE ASKING PRICES, and the app must say so. They are what a
   large national used-gun dealer lists the same model at today, which is
   a real market signal and a far better one than nothing - 76 of these
   rows carry no counted sale at all. But an ask is not a sale, asks run
   high, and high is the wrong way to be wrong when money is going out. */
function usedUrl(q){ return "https://www.guns.com/used-guns?keyword=" + encodeURIComponent(q); }

/* A SEARCH BOX WANTS A PRODUCT NAME, NOT A BOOK ENTRY. "Mossberg 590 /
   590A1" is two guns in one row; "Ruger 10/22" and "Thompson/Center
   Encore" are what the gun is CALLED. So cut only at a SPACED slash -
   cutting at every slash gave "Ruger 10" and "Thompson", which would
   have searched for something else and come back looking perfectly
   fine. Three rows say something a shop says rather than something a
   catalogue lists, and they are named here rather than mangled. */
const SEARCH_AS = {
  "Henry lever .22 (H001 / Golden Boy)": "Henry Golden Boy",
  "AR-15, entry-level": "AR-15 rifle",
  "1911 (Rock Island, Tisas, Springfield Mil-Spec)": "1911 pistol"
};
function searchFor(name){
  const n = String(name || "");
  return SEARCH_AS[n] || n.split(/\s+\/\s+|\s*[(,]/)[0].replace(/\s+/g, " ").trim();
}

/* ── is this page real, or is it a wall? ──────────────────────────────── */
const WALL = /just a moment|attention required|checking your browser|enable javascript|verify you are( a)? human|captcha|access denied|sign in to your account/i;

function readPage(text, model) {
  /* Returns {lo,hi,n,from} or {skip:"reason"}. Deliberately suspicious:
     every branch that cannot prove what it found returns a skip, because
     a missing row costs nothing and a wrong row costs money.

     Written against the REAL guns.com used page rather than guessed at.
     A listing comes through as a run of lines like

         MOSSBERG
         500
         12 GA
         5 Rounds
         18.5" Barrel
         Condition:
         USED
         Add To Cart
         $449.99

     so the price sits alone and everything that says what it IS sits
     above it. Every rule below reads the block, not the line. */
  if (!text || text.length < 400) return { skip: "page came back nearly empty (" + (text || "").length + " chars)" };
  if (WALL.test(text)) return { skip: "a bot wall or login page, not the listings" };
  if (/loading\.\.\./i.test(text) && text.length < 2500) return { skip: "page never finished loading" };

  const words = model.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  if (!words.length) return { skip: "no searchable words in the model name" };

  const lines = text.split("\n").map((x) => x.trim()).filter(Boolean);
  const hits = [];
  let prev = -1;                                    /* the last price line read */
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\$\s?([0-9][0-9,]*(?:\.[0-9]{2})?)$/);
    if (!m) continue;                               /* a price on its own line */
    const v = Number(m[1].replace(/,/g, ""));
    /* EVERY price line bounds the next one, including one this reader goes
       on to throw away. Advancing the boundary only on the ones it kept
       let a rejected new gun's lines count as part of the used one under
       it. */
    const pstart = prev; prev = i;
    if (!(v >= 40 && v <= 25000)) continue;
    /* WHERE THIS LISTING STARTS. A fourteen-line window above the price
       was wrong twice over, and both were silent. It reached back into the
       listing BEFORE this one, so the first new gun after six used ones
       borrowed their "Condition: USED" - a mixed page counted seven of ten.
       And on the first listing of a page it reached up into the page
       header, which on guns.com is headed with the search term and the
       words "Used Guns For Sale" - that is exactly how the ended page got
       a Glock counted as a Remington. So the block is bounded: it starts
       after the previous price, and no more than eight lines above this
       listing's own "Condition:" line. */
    let j = -1;
    /* TWO SHAPES ON THE SAME SITE. A buy-it-now listing puts "Condition:"
       on its own line and the word under it; an auction lot puts
       "Condition:  USED" on one line and then AUCTION, Closed and the bid
       count before the price. Anchoring on the bare line only found the
       first kind, which quietly made every auction lot unreadable - and
       made the no-bids guard untestable, because the unsold fixture was
       being refused for having no condition field rather than for nobody
       having bid. Found by deleting the no-bids guard and watching the
       suite stay green. */
    for (let k = i - 1; k >= 0 && k >= i - 6; k--)
      if (/^condition:\s*(used|new)?$/i.test(lines[k])) { j = k; break; }
    /* NO CONDITION FIELD IS NOT A SKIP OF ITS OWN. It was one for an hour,
       and deleting it left the suite green - nothing could tell the
       difference, because a price with no condition field beside it is
       already refused by the used-condition rule below. An assertion that
       cannot fail is worse than no assertion, and so is a guard nothing can
       tell the difference about. What the anchor is actually FOR is the
       floor: when a condition line is found, the block starts no more than
       eight lines above it, which is what keeps the first listing on a page
       out of the header. */
    let start = Math.max(pstart + 1, j >= 0 ? j - 8 : 0, 0);
    /* AND IT STOPS AT THE PAGE FURNITURE. The first listing on a page has
       no price above it to bound against, so the window ran up into the
       header - and the header is the one place the search term is
       guaranteed to appear whatever the page is actually showing. That is
       the whole trick the ended page played: "REMINGTON 870 EXPRESS 15450
       RESULTS" over a Glock. So walk forward past anything that is the
       page talking about itself. */
    for (let k = start; k < j; k++)
      if (/\d+ results$|applied filters|clear all filters|^keyword:|^categories$/i.test(lines[k])) start = k + 1;
    const block = lines.slice(start, i + 1).join(" ");
    const low = block.toLowerCase();

    /* THE SEARCH TERM BEING ON THE PAGE IS NOT THE GUN BEING ON THE
       LISTING. The Guns.com ended-auctions page is headed "REMINGTON 870
       EXPRESS 15450 RESULTS" and lists Glocks. The words have to be in
       THIS block, beside THIS price. */
    if (!words.every((w) => low.includes(w))) continue;
    /* USED ONLY - the same search returns new stock beside the used, and a
       new price is a ceiling, not a comp.

       IT HAS TO BE THE LISTING'S OWN CONDITION FIELD. Looking for the bare
       word "used" anywhere in the fourteen lines above the price let the
       page header do it: guns.com heads the page "Used Guns For Sale" and
       puts "Certified used" in the shipping banner, so the FIRST listing on
       every page matched whatever it actually was. A page of six new guns
       came back with one used listing on it, and a mixed page counted seven
       of ten. Both found by the suite, not by reading. The condition sits on
       the line under the word "Condition:", so that is what is read. */
    if (!/condition:?\s*used\b/i.test(block)) continue;
    /* an auction nobody bid on is the seller's ask, not a sale, and not
       even a dealer's asking price */
    if (/starting bid|no bids|opening bid|reserve not met/i.test(low)) continue;
    hits.push({ v, line: block.replace(/\s+/g, " ").slice(-90) });
  }

  if (hits.length < 4)
    return { skip: "only " + hits.length + " used listing(s) for this gun, need 4" };

  /* TRIM THE TAILS. The top of a used list is collector pieces, special
     editions and ones with glass on them; the bottom is damaged, parts
     guns and youth models. Quarter to three-quarters is the ordinary
     working gun somebody actually carries in. Min-to-max on the Mossberg
     590 would have said $330-$850; the quarters say $400-$600. */
  const vals = hits.map((h) => h.v).sort((a, b) => a - b);
  const at = (p) => { const i = (vals.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
                      return vals[lo] + (vals[hi] - vals[lo]) * (i - lo); };
  const lo = Math.round(at(0.25)), hi = Math.round(at(0.75));
  if (!(hi > lo)) return { skip: "the middle half is a single price (" + lo + ") - too few to call a range" };
  if (hi / lo > 4) return { skip: "even the middle half spans " + lo + "-" + hi + " - more than one model" };
  return { lo, hi, n: hits.length, med: Math.round(at(0.5)),
           from: hits.slice(0, 3).map((h) => h.line) };
}

/* ── run ──────────────────────────────────────────────────────────────── */
const rows = book();
const todo = LIMIT ? rows.slice(0, LIMIT) : rows;
console.log(`${rows.length} gun models in the book; reading ${todo.length} off guns.com used`);
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

/* ── GO IN THE FRONT DOOR FIRST ───────────────────────────────────────
   His own Chrome opens guns.com quite happily; the script got "Attention
   Required! | Cloudflare" on the same address. The difference is not the
   address, it is arriving cold. A browser that has never been to the site
   and types a search URL straight into the bar is exactly the shape of a
   scraper. So load the home page once, give the challenge the seconds it
   needs to clear itself, and only then start asking for models. The
   profile persists between runs, so after the first night this should
   already be clear. */
console.log("opening guns.com and letting it settle...");
try {
  const warm = await ctx.newPage();
  await warm.goto("https://www.guns.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await warm.waitForTimeout(9000);
  const t = await warm.evaluate(() => document.body.innerText);
  console.log(WALL.test(t)
    ? "  still showing a check. Carrying on anyway - it often clears on the next page.\n"
    : "  in.\n");
  await warm.close();
  await sleep(3000);
} catch (e) {
  console.log("  could not open the home page (" + String(e.message).split("\n")[0].slice(0, 60) + "). Carrying on.\n");
}

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
    /* SAY IT ON THE SCREEN TOO, NOT ONLY IN THE LOG. A probe run whose page
       would not open printed the two header lines and then exited quietly
       with a zero, which looks exactly like a run that worked. */
    const why = "could not open the page (" + e.message.split("\n")[0].slice(0, 70) + ")";
    skipped.push({ ...row, why });
    console.log(`  skip  ${row.key} ${row.name} — ${why}`);
    if (PROBE) console.log("\n  " + row.url + "\n  Nothing was read and nothing was written.\n");
    await page.close();
    continue;
  }

  if (PROBE) {
    /* THE SOURCE HUNT IS OVER AND THIS IS NOT IT ANY MORE. The probe used
       to open five candidates - GunBroker completed, GunBroker sold, the
       Guns.com ended page, the Guns.com search page, GunWatcher's sold
       data - because the question was which of them opens for an ordinary
       browser. It got answered: GunBroker is Cloudflare both ways, the
       ended page ignores the keyword and answered a Remington query with
       Glocks, GunWatcher's free figure is one monthly model value, and
       guns.com/used-guns filters properly. So the probe does one thing
       now: open the address this reader actually uses, show every figure
       it would take and the listing it would take it off, and write
       nothing to the book. */

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
    console.log("\nNothing was written. These are asking prices off a dealer's used stock, not sold prices.");
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
/* SAY WHAT KIND OF FIGURE THIS IS, AT THE TOP, EVERY TIME. The app draws
   the line between a sold price, an asking price and a researched one
   everywhere else; a file that moves 77 rows of the book cannot be the one
   place that leaves it out. These are asks. Asks run high. */
lines.push("These are ASKING PRICES, not sold prices: what Guns.com lists the same",
  "used model at today, taken as the middle half of their listings. A large",
  "national dealer's ask is a real signal and better than nothing on an aisle",
  "where 76 rows carry no counted sale at all. It is still an ask, and asks",
  "run high. Read it as a ceiling to lend under, not as what the gun fetched.", "");
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
