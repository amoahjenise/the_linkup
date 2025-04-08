// /client/public/sw.js

const CACHE_NAME = "thelinkup-v1";
const OFFLINE_URL = "/offline.html"; // Optional fallback page
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/apple-touch-icon.png",
  // Add other critical assets (CSS, JS, fonts)
];

// Install: Cache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Fetch: Serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests (e.g., API calls)
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file if found
      if (cachedResponse) return cachedResponse;

      // Fallback for navigation requests
      if (event.request.mode === "navigate") {
        return caches.match(OFFLINE_URL); // Show offline page if exists
      }

      // Fetch from network otherwise
      return fetch(event.request);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Delete old caches
          }
        })
      );
    })
  );
});
