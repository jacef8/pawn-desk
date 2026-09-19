/* Shared record store. The phone and the desk each keep their own copy in the
 * browser and work offline; this is what makes those copies the same record.
 *
 * It sits behind the service on purpose. Firestore from the page would mean
 * putting the project's config in a file anyone can read and defending the
 * data with rules alone. The service already holds the secrets and already
 * checks PAWN_TOKEN, so syncing through it exposes nothing new.
 *
 * Set FIREBASE_SERVICE_ACCOUNT to the service-account JSON. Without it the
 * store falls back to memory, which is useful for trying the flow out but
 * forgets everything when the process restarts - it says so in the reply.
 */

const STORES = { comps: "pawndesk_comps", seen: "pawndesk_seen", deals: "pawndesk_deals" };
const PULL_LIMIT = 2000;
const WRITE_CHUNK = 400;          /* Firestore caps a batch at 500 */

let db = null, mode = "memory", tried = false;
const mem = {};                   /* store -> id -> row */

async function connect() {
  if (tried) return;
  tried = true;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return;
  try {
    const admin = await import("firebase-admin");
    const cred = JSON.parse(raw);
    const app = admin.default.apps?.length
      ? admin.default.apps[0]
      : admin.default.initializeApp({ credential: admin.default.credential.cert(cred) });
    db = admin.default.firestore(app);
    mode = "firestore";
  } catch (e) {
    /* A bad key or a missing package must not take the service down: the
       counter keeps its own copy either way, it just stops being shared. */
    db = null; mode = "memory";
  }
}

export function storeMode() { return mode; }

/* Push what this device has, then hand back everything it has not seen.
   Rows carry their own id and ts, so merging is by id and the newer ts wins -
   no ordering between devices to get wrong. */
export async function syncMerge(store, rows, since) {
  const col = STORES[store];
  if (!col) return { ok: false, code: "bad_store" };
  await connect();

  const incoming = (Array.isArray(rows) ? rows : [])
    .filter(r => r && typeof r.id === "string" && r.id.length <= 64)
    .slice(0, 2000);
  const from = Number(since) || 0;

  if (mode === "memory") {
    const m = (mem[store] = mem[store] || {});
    incoming.forEach(r => { const o = m[r.id]; if (!o || (r.ts || 0) >= (o.ts || 0)) m[r.id] = r; });
    const out = Object.values(m).filter(r => (r.ts || 0) > from).slice(0, PULL_LIMIT);
    return { ok: true, mode, rows: out, held: Object.keys(m).length, warning: "not saved: no Firebase credentials" };
  }

  for (let i = 0; i < incoming.length; i += WRITE_CHUNK) {
    const batch = db.batch();
    incoming.slice(i, i + WRITE_CHUNK).forEach(r => batch.set(db.collection(col).doc(r.id), r, { merge: true }));
    await batch.commit();
  }

  const snap = await db.collection(col).where("ts", ">", from).orderBy("ts").limit(PULL_LIMIT).get();
  return { ok: true, mode, rows: snap.docs.map(d => d.data()) };
}
