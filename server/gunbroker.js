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
const UA  = "pawn-desk/1.0 (Lamar's Pawn, Bristol FL)";

export function gunReady(env) {
  return { key: !!env.GUNBROKER_DEVKEY };
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
      headers: { "X-DevKey": key, "User-Agent": UA, accept: "application/json" },
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
  const out = { key: !!env.GUNBROKER_DEVKEY, tried: [] };
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
