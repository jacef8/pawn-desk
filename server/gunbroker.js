/* GunBroker, and whether it can answer at all.
 *
 * eBay does not sell firearms, so the one working API in this service is
 * blind to the whole guns aisle - which is why 76 gun rows in the price
 * book carry no count of real sales, and why four of them currently book
 * a USED gun at or above what a new one costs.
 *
 * THIS FILE EXISTS BECAUSE THE README ONCE LIED ABOUT IT. It used to say
 * the service did "GunBroker for firearms, all at once, with no tab
 * opening". Asked at the counter - "why cant you click these for me and
 * get the numbers?" - and checked: the service contacted three hosts and
 * none of them was GunBroker. There was no code. Commit a64971b took the
 * claim out. This is the first line of GunBroker code the repository has
 * ever had.
 *
 * WHAT WE KNOW, MEASURED RATHER THAN ASSUMED:
 *
 *   - api.gunbroker.com answers this container and Jace's phone with the
 *     SAME thing: 403, "Unapproved User Parameter - Please register at:
 *     api.gunbroker.com/User/DevKey/Create". It is live, reachable from
 *     here, and the developer key is self-serve.
 *   - I GOT THIS WRONG ONCE AND IT IS WORTH THE LINE. I read that 403 off
 *     a status code alone, without the body, and reported to the counter
 *     that Cloudflare was blocking the datacentre and the API was a dead
 *     end for everyone. It was never a block. It was the API asking for a
 *     key, in plain English, in a body I had not looked at. A status code
 *     is not a reason; read what the server actually said.
 *
 * THE SECOND THING IT ANSWERS IS THE ONE THAT DECIDES EVERYTHING. GunBroker
 * sells guns by auction, and an API that only lists what is FOR SALE gives
 * asking prices. This book already has a rule about that - asks run high,
 * and high is the wrong way to be wrong when money is going out. If the only
 * thing reachable here is active listings, then this is worth less than the
 * screenshot reader already in the app, and the honest thing is to say so
 * rather than quietly start pricing guns off asks. So the probe asks for
 * completed data explicitly and reports exactly what it is told.
 *
 * Settings, from the host environment, never in this file or the repository:
 *   GUNBROKER_DEVKEY - from api.gunbroker.com/User/DevKey/Create
 *
 * The key is never logged, never echoed and never returned. Everything
 * below reports whether it is SET, never what it is.
 */
const API = "https://api.gunbroker.com/v1";
/* THE USER AGENT IS REGISTERED, NOT CHOSEN. GunBroker's key form takes a
   Software name, a Version and an Application Name, and warns in red:
   "Any attempt to add generic naming such as Mozilla, WordPress, Python,
   etc. will result in request failures." So the string this service sends
   has to be the string on the form, and nothing here may fall back to a
   browser-shaped default.

   Registered as:  Software "PawnDesk"  Version "1.0"  App "Lamars Pawn Desk"

   GUNBROKER_UA overrides it, because if their checker wants a different
   shape than Software/Version the fix must not need a deploy of this file -
   it is an environment variable like every other setting here. */
const DEFAULT_UA = "PawnDesk/1.0";
const ua = (env) => String((env && env.GUNBROKER_UA) || DEFAULT_UA);

/* WHICH ADDRESS GUNBROKER WOULD HAVE TO LET IN.
 *
 * Their developer-key form has a required field: "specify all IP Addresses
 * or IP Address ranges that we need to whitelist before we can give you
 * access to our Production environment." Nobody can answer that from a
 * laptop - the address that matters is the one THIS SERVICE goes out from,
 * and only this service can see it.
 *
 * It samples several times from more than one echo, because a host may
 * answer from a pool rather than a single address: the build container
 * this was written on returned 160.79.106.129, .131 and .25 on three
 * consecutive calls. One sample would have been a confident wrong answer
 * on the one form field that cannot be got wrong. If the set comes back
 * with more than one address, Railway is rotating and a single IP in that
 * box will stop working without warning - which is worth knowing BEFORE
 * the form is submitted, not after the key is issued.
 *
 * No key needed and nothing secret involved: this is the service's own
 * public address, which every host it contacts already sees.
 */
const ECHOES = [
  "https://api.ipify.org?format=json",
  "https://checkip.amazonaws.com",
  "https://icanhazip.com",
  "https://ifconfig.me/ip",
];
export async function egressIPs(rounds = 2) {
  const seen = new Map();
  const tried = [];
  for (let r = 0; r < rounds; r++) {
    for (const url of ECHOES) {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 8000);
      try {
        const res = await fetch(url, { signal: ctl.signal });
        const text = (await res.text()).trim();
        let ip = text;
        try { const j = JSON.parse(text); if (j && j.ip) ip = String(j.ip); } catch (e) {}
        ip = ip.split(/\s+/)[0];
        if (/^[0-9.]{7,15}$|^[0-9a-f:]{3,}$/i.test(ip)) seen.set(ip, (seen.get(ip) || 0) + 1);
        else tried.push({ url, unreadable: text.slice(0, 40) });
      } catch (e) {
        tried.push({ url, failed: String((e && e.name) || e).slice(0, 40) });
      } finally { clearTimeout(t); }
    }
  }
  const ips = [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([ip, n]) => ({ ip, seen: n }));
  /* A /24 is the usual thing to ask a provider to whitelist when the host
     rotates inside one block. Said out loud so nobody has to work it out
     under a form field. */
  const blocks = [...new Set(ips.map(x => x.ip).filter(x => x.includes("."))
    .map(x => x.split(".").slice(0, 3).join(".") + ".0/24"))];
  return {
    ips, blocks, rotating: ips.length > 1, failures: tried,
    note: !ips.length ? "Could not read the outbound address at all."
      : ips.length === 1
        ? "One address every time. That is the one to whitelist - but confirm Railway gives you a STATIC egress IP, or it will change on a redeploy and the key will stop working."
        : `${ips.length} different addresses across ${rounds} rounds. This host rotates: a single IP in that form field WILL break. Ask for the block, or turn on static egress first.`,
  };
}
export function gunReady(env) {
  return { key: !!env.GUNBROKER_DEVKEY, userAgent: ua(env) };
}

/* One call, with the key in the header and nothing of it in the answer. */
async function ask(env, path, ms = 12000) {
  const key = env.GUNBROKER_DEVKEY;
  if (!key) return { path, ok: false, code: "no_key" };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  const started = Date.now();
  try {
    const r = await fetch(API + path, {
      headers: { "X-DevKey": key, "User-Agent": ua(env), accept: "application/json" },
      signal: ctl.signal,
    });
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) {}
    return {
      path, ok: r.ok, status: r.status, ms: Date.now() - started,
      /* A snippet, because the whole body of a category list is useless
         noise and the whole body of an error is the entire message. */
      says: text.slice(0, 300),
      count: json && (json.countReturned ?? json.count ?? (Array.isArray(json.results) ? json.results.length : null)),
      keys: json && typeof json === "object" ? Object.keys(json).slice(0, 12) : null,
    };
  } catch (e) {
    return { path, ok: false, status: 0, ms: Date.now() - started,
             code: String(e && e.name) === "AbortError" ? "timeout" : "unreachable",
             says: String((e && e.message) || e).slice(0, 200) };
  } finally { clearTimeout(timer); }
}

/* What we need to find out, in the order that decides whether to build
   anything on top of this. */
export async function gunProbe(env, keywords) {
  const kw = encodeURIComponent(String(keywords || "Remington 870 Express").slice(0, 60));
  const out = { key: !!env.GUNBROKER_DEVKEY, userAgent: ua(env), tried: [] };
  if (!out.key) { out.verdict = "no_key"; return out; }

  /* 1. Does Railway get through at all, and is the key accepted? Categories
        is the cheapest call that needs only a DevKey. */
  out.tried.push(await ask(env, "/Categories"));
  /* 2. Active listings - this will almost certainly work, and it is ASKING
        prices, which is the thing we must not mistake for a comp. */
  out.tried.push(await ask(env, `/Items?Keywords=${kw}&PageSize=3`));
  /* 3. The ones that would actually be worth having. Reported whatever they
        say, including a 401 or a 404 - "this endpoint is seller-scoped" is
        a real answer and the reason to stop. */
  out.tried.push(await ask(env, `/ItemsSold?Keywords=${kw}&PageSize=3`));
  out.tried.push(await ask(env, `/Items?Keywords=${kw}&PageSize=3&Completed=1`));

  const first = out.tried[0];
  out.verdict =
    first.code === "unreachable" || first.code === "timeout" ? "railway_cannot_reach" :
    /* 403 here is what an unregistered or wrong key gets, body and all -
       not a network block. The body is in `says`, so read it. */
    first.status === 403 ? (/Unapproved User/i.test(first.says || "") ? "key_not_registered" : "forbidden") :
    first.status === 401 ? "key_rejected" :
    first.ok ? "key_works" : "unexpected_" + first.status;
  /* Said plainly, because the answer to "can we price guns off this" is not
     the same as "did the call succeed". */
  const sold = out.tried.slice(2).some((t) => t.ok);
  out.soldPricesReachable = sold;
  out.note = !out.key ? "No key set."
    : out.verdict === "key_not_registered" ? "Reached GunBroker fine; the key is missing or not approved yet."
    : out.verdict !== "key_works" ? "The key never got a chance - fix reachability first."
    : sold ? "Completed data answered. Worth building on."
    : "Only active listings answer. Those are ASKING prices, and the book must not lean on them.";
  return out;
}
