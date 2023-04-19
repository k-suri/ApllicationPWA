const cacheName = "cacheAssets";

/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(cacheAssets).then(async function (cache) {
      const cachedResponse = await cache.match(event.request);
      const fetchedResponse = fetch(event.request).then(function (
        networkResponse
      ) {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      });
      return cachedResponse || fetchedResponse;
    })
  );
});

self.addEventListener("install", function (event) {
  console.log("[Service worker] Install:", event);
  self.skipWaiting();
  console.log(caches);
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      cache.addAll([
        "/",
        "/index.html",
        "/assets/blog.png",
        "/style.css",
        "/script.js",
        "/js/notifications.js",
        "/icons/favicon-32x32.png",
        "/icons/favicon-192x192.png",
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  // console.log('[Service worker] Activate:', event);
  event.waitUntil(clients.claim());
  caches.delete("cacheAssets");
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      cacheName.forEach((item) => {
        console.log("Found:", item);
        if (item !== cacheName) {
          console.log("- Delete:", item);
        }
      });
    })
  );
});
