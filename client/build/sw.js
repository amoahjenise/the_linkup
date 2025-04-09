/* eslint-disable no-restricted-globals */

const CACHE_NAME = "thelinkup-v1";
const OFFLINE_URL = "/offline.html";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/themes/bootstrap4-light-blue/theme.css",
  "/themes/bootstrap4-dark-blue/theme.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      if (event.request.mode === "navigate") return caches.match(OFFLINE_URL);
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});
