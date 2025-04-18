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
self.addEventListener("fetch", (event) => {
  if (isDevelopment) return; // Bypass completely in development

  const { request } = event;

  if (
    request.method !== "GET" ||
    request.url.includes("hot-update.json") ||
    request.url.includes("/api/") ||
    !request.url.startsWith("http")
  ) {
    return;
  }

  // Respond with the cache first if available, otherwise fetch and cache
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic" &&
            request.url.startsWith("http") &&
            !request.url.includes("chrome-extension://")
          ) {
            // Clone the response early so we can use it for both caching and returning it to the client
            const responseClone = response.clone();

            // Cache the cloned response
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone).catch((err) => {
                console.warn("Could not cache:", request.url, err);
              });
            });

            // Return the original response to the client
            return response;
          }

          // If the response is not suitable, just return it
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
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
      icon: "/apple-touch-icon.png",
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
