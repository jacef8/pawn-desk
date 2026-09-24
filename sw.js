/* keeps the desk working with no signal; always tries for the newest copy first */
const C="pawndesk-202609241312";
const CORE=["./","./index.html","./phone.html","./app-head.js","./app.css","./app.js","./qr.js","./prices.json","./fakes.json","./phone.css","./phone.js","./manifest.webmanifest","./manifest-phone.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(CORE))); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; })
    .catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
