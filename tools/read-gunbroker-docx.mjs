#!/usr/bin/env node
/* THE WORD EXPORT IS THE MACHINE-READABLE ONE.
 *
 *   node tools/read-gunbroker-docx.mjs <file.docx> <type> <new|used>
 *   e.g. ... Top_Selling.docx semi_auto_pistols used
 *
 * The viz's DATA download is switched off by its author, and its PDF
 * export embeds subset fonts with Identity encoding - readable only by
 * decoding a per-font ToUnicode CMap, which I got halfway through and
 * abandoned. The Word export just contains the text. A .docx is a zip of
 * XML, so this needs no library at all, and the numbers arrive exactly
 * rather than read off an image.
 *
 * What it does NOT contain is which firearm type or which condition the
 * table is for - the filters live in the viz, not the export, and the
 * header only says "Top Selling Families". So both are arguments, and
 * getting them wrong files good numbers under the wrong gun. There is no
 * way to check that from the file; it has to come from whoever exported
 * it.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [file, type, cond] = process.argv.slice(2);
if (!file || !type || !cond) {
  console.error("usage: read-gunbroker-docx.mjs <file.docx> <firearm_type> <new|used>");
  console.error("  firearm_type e.g. bolt_action_rifles, semi_auto_pistols, revolvers");
  process.exit(2);
}
if (!["new","used"].includes(cond)) { console.error("condition must be new or used"); process.exit(2); }

const dir = mkdtempSync(join(tmpdir(), "gbdocx-"));
execFileSync("unzip", ["-qo", file, "-d", dir]);
const xml = readFileSync(join(dir, "word/document.xml"), "utf8");

/* cells, in document order */
const cells = [];
for (const m of xml.matchAll(/<w:tc[ >][\s\S]*?<\/w:tc>/g)) {
  const txt = m[0].replace(/<[^>]+>/g, "")
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')
    .replace(/\s+/g," ").trim();
  cells.push(txt);
}
/* The export lays each table out twice - once name/share, once name/price -
   so a row is assembled by NAME rather than by position. */
const share = {}, price = {};
for (let i = 0; i < cells.length - 1; i++) {
  const a = cells[i], b = cells[i+1];
  if (!a || /^\$|%$/.test(a)) continue;
  if (/^\d+(\.\d+)?%$/.test(b)) share[a] = parseFloat(b);
  else if (/^\$[\d,]+$/.test(b)) price[a] = +b.replace(/[$,]/g,"");
}
const names = [...new Set([...Object.keys(share), ...Object.keys(price)])]
  .filter(n => price[n] != null);
if (!names.length) { console.error("no name/price pairs found - is this a Tableau crosstab export?"); process.exit(1); }

const out = {};
for (const n of names) out[n] = [share[n] ?? null, price[n]];
console.log(`${type} / ${cond} — ${names.length} rows`);
for (const n of names) console.log(`   ${String(out[n][0] ?? "?").padStart(5)}%  $${String(out[n][1]).padStart(6)}  ${n}`);

/* merge into the store, so each export adds rather than replaces */
const storePath = new URL("../tools/gunbroker/2026-08-used.json", import.meta.url);
const store = JSON.parse(readFileSync(storePath, "utf8"));
store[type] = store[type] || {};
const key = cond === "new" ? "families_new" : "families";
/* MERGE BY THE NAME, NOT BY THE SPELLING OF IT. The first rows in this
   store were typed by hand off a screenshot as "Sig Sauer P320"; the
   export says "SIG SAUER P320". Assigning one over the other kept both
   and the file quietly doubled. Keys are matched case- and
   punctuation-insensitively, and the parsed value wins, because it was
   read from the file rather than off an image. */
const before = Object.keys(store[type][key] || {}).length;
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const merged = {};
for (const [k, v] of Object.entries(store[type][key] || {})) merged[norm(k)] = [k, v];
for (const [k, v] of Object.entries(out)) merged[norm(k)] = [k, v];
store[type][key] = Object.fromEntries(Object.values(merged));
writeFileSync(storePath, JSON.stringify(store, null, 1));
console.log(`\nstored under ${type}.${key} — ${before} rows before, ${Object.keys(store[type][key]).length} after`);
