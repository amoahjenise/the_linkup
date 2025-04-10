/* eslint-disable no-restricted-globals */
const BADGE_API_ENABLED = "setAppBadge" in navigator;
const CACHE_NAME = `thelinkup-${new Date().toISOString()}`;
const OFFLINE_URL = "/offline.html";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/favicon-96x96.png",
  "/badge-icon.png",
  "/logo.png",
  "/manifest.json",
];

// Development mode detection
const isDevelopment =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1";

// INSTALL
self.addEventListener("install", (event) => {
  if (isDevelopment) return;

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching core assets");
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// FETCH
// FETCH
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests, API calls, and hot updates
  if (
    request.method !== "GET" ||
    request.url.includes("hot-update.json") ||
    request.url.includes("/api/") ||
    !request.url.startsWith("http")
  ) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First try to get from network
          const networkResponse = await fetch(request);
          if (networkResponse.ok) return networkResponse;

          // If network fails, fall back to cache
          const cachedResponse = await caches.match("/index.html");
          return cachedResponse || Response.redirect(OFFLINE_URL);
        } catch (error) {
          // If both fail, show offline page
          const cachedResponse = await caches.match("/index.html");
          return cachedResponse || Response.redirect(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  // For all other requests (JS, CSS, images, etc.)
  event.respondWith(
    (async () => {
      // Try cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;

      try {
        // If not in cache, fetch from network
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // For CSS/JS, return empty response rather than offline page
        if (
          request.destination === "script" ||
          request.destination === "style" ||
          request.destination === "image"
        ) {
          return new Response("", {
            status: 404,
            statusText: "Not Found",
          });
        }
        return caches.match(OFFLINE_URL);
      }
    })()
  );
});

// PUSH
self.addEventListener("push", async (event) => {
  if (!BADGE_API_ENABLED) return;

  try {
    const data = event.data?.json();
    if (!data) return;

    await self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/badge-icon.png",
      data: { url: data.url },
    });

    await navigator.setAppBadge(data.unreadCount || 1);
  } catch (error) {
    console.error("Push notification failed:", error);
  }
});

// NOTIFICATION CLICK
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data?.url) {
    event.waitUntil(self.clients.openWindow(event.notification.data.url));
  }
});

// MESSAGE
self.addEventListener("message", async (event) => {
  if (
    event.data?.type === "UPDATE_BADGE" ||
    event.data?.type === "CLEAR_BADGE"
  ) {
    try {
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: "BADGE_UPDATE",
          count: event.data.count,
        });
      });

      if ("setAppBadge" in navigator) {
        await navigator.setAppBadge(event.data.count).catch(console.error);
      }
    } catch (error) {
      console.error("SW badge handling error:", error);
    }
  }
});
