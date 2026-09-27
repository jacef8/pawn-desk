/* THE WHOLE APP, IN ONE FILE, FOR A WHOLE-APP REVIEW.
   The focused bundle (make-review-bundle.mjs) is 22 extracted sections and
   is the right thing for a pricing review. This is everything the browser
   actually loads, plus the server that answers its lookups and the tools
   that build its data - for a review that is allowed to ask "why is it
   shaped like this at all".

   Every file is fenced with its own path and line count so a reviewer can
   cite a location, and the counts are printed at the end so nobody pastes
   700KB into a 32K window by accident.

     node tools/make-full-bundle.mjs */
import {readFileSync, writeFileSync, existsSync, statSync} from "node:fs";
import {join, dirname, extname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const GROUPS = [
  ["What the browser loads", [
    "index.html", "phone.html",
    "app-head.js", "app.js", "phone.js", "qr.js",
    "app.css", "phone.css", "sw.js",
    "manifest.webmanifest", "manifest-phone.webmanifest"]],
  ["The shop's own service (Railway) — it holds the API keys, the app never does", [
    "server/server.js", "server/core.js", "server/ebay.js",
    "server/soldcomps.js", "server/store.js", "server/package.json"]],
  ["The tools that build and measure the data", [
    "tools/harvest.js", "tools/build-metal-risk.mjs", "tools/measure-noise.mjs",
    "tools/add-models.mjs", "tools/gaps.mjs", "tools/sync-book.mjs"]],
];
/* The data files are described rather than pasted: prices.json alone is
   92KB of rows that tell a reviewer nothing a sample does not. */
const SAMPLED = ["prices.json", "fakes.json", "metals-risk.json", "item-noise.json"];

const fence = f => ({".js":"javascript",".mjs":"javascript",".json":"json",
                     ".css":"css",".html":"html"}[extname(f)] || "");
let out = "", tally = [];
for (const [title, files] of GROUPS) {
  out += `\n\n## ${title}\n`;
  for (const f of files) {
    const p = join(ROOT, f);
    if (!existsSync(p)) { console.error("missing " + f); continue; }
    const text = readFileSync(p, "utf8");
    const lines = text.split("\n").length;
    tally.push([f, lines, statSync(p).size]);
    out += `\n### \`${f}\` — ${lines} lines\n\n\`\`\`${fence(f)}\n${text}\n\`\`\`\n`;
  }
}
out += `\n\n## The data files, sampled\n`;
out += `\nThese are data, not logic. Shapes and a few rows each; ask for a`
     + ` whole file if a row's contents matter to a finding.\n`;
for (const f of SAMPLED) {
  const p = join(ROOT, f);
  if (!existsSync(p)) continue;
  const j = JSON.parse(readFileSync(p, "utf8"));
  const rows = j.rows || j.days || j;
  const head = Array.isArray(rows) ? rows.slice(0, 4)
             : Object.fromEntries(Object.entries(rows).slice(0, 2));
  const n = Array.isArray(rows) ? rows.length : Object.keys(rows).length;
  out += `\n### \`${f}\` — ${n} entries\n\n\`\`\`json\n`
       + JSON.stringify(head, null, 1).slice(0, 1400) + "\n```\n";
  tally.push([f + " (sampled)", 0, statSync(p).size]);
}

const prompt = readFileSync(join(ROOT, "review/REVIEW-PROMPT-FULL.md"), "utf8");
writeFileSync(join(ROOT, "review/FULL-APP.md"), prompt + out);

/* AND IN PARTS, because 258K tokens will not go in most paste boxes.
   Split on the group headings, so a part is always whole files. Part one
   is still large — app.js is 700KB on its own and there is no honest way
   to make it small — so a reviewer with a short context should be given
   the focused bundle instead, not a quarter of this one. */
const parts = out.split(/\n\n(?=## )/).filter(Boolean);
parts.forEach((body, i) => {
  const head = `# Whole-app review — part ${i + 1} of ${parts.length}\n\n`
    + (i === 0
      ? prompt + "\n\n**This is part 1. Wait for all "
        + parts.length + " parts before answering.**\n"
      : "Continuation of the Pawn Desk review. The brief was in part 1."
        + (i === parts.length - 1
           ? " This is the last part — please answer now.\n"
           : " More follows; do not answer yet.\n"));
  writeFileSync(join(ROOT, `review/FULL-APP-part${i + 1}.md`), head + body);
});
const chars = prompt.length + out.length;
console.log(tally.map(([f, l, b]) =>
  `  ${f.padEnd(34)}${String(l || "").padStart(6)}  ${(b / 1024).toFixed(0)}KB`).join("\n"));
console.log(`\nreview/FULL-APP.md — ${(chars / 1024).toFixed(0)}KB, roughly ${Math.round(chars / 4000)}K tokens.`);
console.log(`Fits: Gemini, Claude, GPT with a long context. Too big for a 32K window.`);
console.log(`Also wrote ${parts.length} parts for pasting in sequence:`);
parts.forEach((b, i) => console.log(
  `  review/FULL-APP-part${i + 1}.md   ${(b.length / 1024).toFixed(0)}KB  ~${Math.round(b.length / 4000)}K tokens`));
