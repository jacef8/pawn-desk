/* Shared record store. The phone and the desk each keep their own copy in the
 * browser and work offline; this is what makes those copies the same record.
 *
 * It sits behind the service on purpose. A database the page talks to directly
 * would mean putting its config in a file anyone can read and defending the
 * data with rules alone. The service already holds the secrets and already
 * checks PAWN_TOKEN, so syncing through it exposes nothing new.
 *
 * The record is a JSON file per store on a disk attached to the service. That
 * is the whole database: one shop, three lists, a few thousand short rows. A
 * hosted database would be another account to own and another key to keep, and
 * it would not hold anything this cannot.
 *
 * DATA_DIR is where that disk is mounted (default /data). Without a writable
 * one the store falls back to memory, which is useful for trying the flow out
 * but forgets everything when the service restarts - it says so in the reply.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const STORES = { comps: "pawndesk_comps", seen: "pawndesk_seen", deals: "pawndesk_deals" };
const DIR = process.env.DATA_DIR || "/data";
const PULL_LIMIT = 2000;
const KEEP = 5000;                /* per store; the devices themselves keep 800 */

let mode = "memory", tried = false;
const mem = {};                   /* store -> id -> row */
let chain = Promise.resolve();    /* one writer at a time, so two devices syncing
                                     at once cannot interleave a read and a write */

/* A volume that has gone unresponsive would otherwise hang every sync that
   touches it, forever, rather than falling back. Bound the check. */
function within(ms, work) {
  return Promise.race([work, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms).unref())]);
}

async function connect() {
  if (tried) return;
  tried = true;
  try {
    await within(5000, (async () => {
      await fs.mkdir(DIR, { recursive: true });
      const probe = path.join(DIR, ".writable");
      await fs.writeFile(probe, String(Date.now()));
      await fs.unlink(probe);
    })());
    mode = "disk";
  } catch (e) {
    /* No volume attached, or it is read-only. The counter keeps its own copy
       either way, it just stops being shared - and the reply says so. */
    mode = "memory";
  }
}

const fileFor = store => path.join(DIR, STORES[store] + ".json");

async function readStore(store) {
  if (mode !== "disk") return mem[store] = mem[store] || {};
  try {
    const raw = await fs.readFile(fileFor(store), "utf8");
    const o = JSON.parse(raw);
    return (o && typeof o === "object" && o.rows) || {};
  } catch (e) {
    if (e.code === "ENOENT") return {};
    /* Unreadable rather than absent: keep the file so it can be looked at
       rather than writing over the top of it, and carry on empty. */
    try { await fs.rename(fileFor(store), fileFor(store) + ".bad-" + Date.now()); } catch (e2) {}
    return {};
  }
}

async function writeStore(store, map) {
  if (mode !== "disk") { mem[store] = map; return; }
  const f = fileFor(store), tmp = f + ".tmp";
  /* Write beside it and rename: a restart mid-write leaves the old file
     whole rather than half a new one. */
  await fs.writeFile(tmp, JSON.stringify({ updated: Date.now(), rows: map }));
  await fs.rename(tmp, f);
}

function trim(map) {
  const ids = Object.keys(map);
  if (ids.length <= KEEP) return map;
  const keep = ids.sort((a, b) => (map[b].ts || 0) - (map[a].ts || 0)).slice(0, KEEP);
  const out = {};
  keep.forEach(id => { out[id] = map[id]; });
  return out;
}

export function storeMode() { return mode; }

/* Push what this device has, then hand back everything it has not seen.
   Rows carry their own id and ts, so merging is by id and the newer ts wins -
   no ordering between devices to get wrong. */
export async function syncMerge(store, rows, since) {
  if (!STORES[store]) return { ok: false, code: "bad_store" };
  await connect();

  const incoming = (Array.isArray(rows) ? rows : [])
    .filter(r => r && typeof r.id === "string" && r.id.length <= 64)
    .slice(0, 2000);
  const from = Number(since) || 0;

  const run = async () => {
    const map = await readStore(store);
    incoming.forEach(r => { const o = map[r.id]; if (!o || (r.ts || 0) >= (o.ts || 0)) map[r.id] = r; });
    const kept = trim(map);
    if (incoming.length) await writeStore(store, kept);
    const out = Object.values(kept)
      .filter(r => (r.ts || 0) > from)
      .sort((a, b) => (a.ts || 0) - (b.ts || 0))
      .slice(0, PULL_LIMIT);
    const res = { ok: true, mode, rows: out, held: Object.keys(kept).length };
    if (mode !== "disk") res.warning = "not saved: no disk attached to the service";
    return res;
  };

  /* Queue behind whatever else is syncing, and never let one failed sync
     wedge the queue for the next one. */
  const next = chain.then(run, run);
  chain = next.catch(() => {});
  return next;
}
