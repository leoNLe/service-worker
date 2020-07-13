const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/indexDb.js",
  "/service-worker.js",
  "/styles.css",
  "/index.js"
];

const DATA_CACHE_NAME = "Budget-v1";
const STATIC_CACHE = "static-v1";
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("cached.");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
self.addEventListener("fetch", event => {
  if (!event.request.url.includes("/api/")) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
  return;
});
