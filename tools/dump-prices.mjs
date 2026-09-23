#!/usr/bin/env node
/* Dump what the app prices, for tools/build-price-sheet.py.
 *
 * The catalog, the price book and the model rows all live inside app.js as
 * plain source. Parsing that from outside would be a second implementation
 * of the file, wrong the first time app.js moved, so this loads the real
 * page in a browser and asks it.
 *
 *   python3 -m http.server 8099 &
 *   node tools/dump-prices.mjs > /tmp/prices.json
 *   python3 tools/build-price-sheet.py /tmp/prices.json
 */
import {createRequire} from "node:module";
import {execSync} from "node:child_process";
const req = createRequire(import.meta.url);
let chromium = null;
const tries = [process.env.PW_MODULE, "playwright"];
try { tries.push(execSync("npm root -g", {encoding:"utf8"}).trim() + "/playwright"); } catch (e) {}
for (const m of tries.filter(Boolean)) { try { ({chromium} = req(m)); break; } catch (e) {} }
if (!chromium) { console.error("playwright not found - set PW_MODULE."); process.exit(2); }

const BASE = process.env.PD_BASE || "http://127.0.0.1:8099";
const EXE  = process.env.PW_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const b = await chromium.launch({executablePath: EXE});
const p = await b.newPage();
await p.goto(BASE + "/index.html", {waitUntil: "networkidle"});
const out = await p.evaluate(() => ({
  cats: CATALOG.map(c => ({id:c.id, label:c.label,
    items: c.items.map(i => ({id:i.id, name:i.name, value:i.value, liq:i.liq}))})),
  book: PRICEBOOK.map(e => ({name:e[0], val:bookVal(e), cat:e[2], liq:e[3]})),
  /* r[1] can be "p7|Inverter generator - 2kW": the row fits either, and the
     sheet only needs the first. */
  models: MODEL_PRICES.map(r => ({id:r[0], ref:String(r[1]).split("|")[0], name:r[2],
    lo:r[3], hi:r[4], conf:r[5], date:r[6], src:r[7]||"", note:r[8]||""})),
}));
await b.close();
console.log(JSON.stringify(out, null, 1));
