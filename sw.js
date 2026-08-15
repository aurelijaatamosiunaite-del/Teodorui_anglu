// Netz zuerst, Cache als Reserve - damit die App auch ohne Empfang startet.
const CACHE = "vokabellinie-1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const kopie = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopie)).catch(()=>{});
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
