/* eslint-disable no-restricted-globals */
const BADGE_API_ENABLED = "setAppBadge" in navigator;
const CACHE_NAME = "thelinkup-v4";
const OFFLINE_URL = "/offline.html";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  // Add essential icons
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/favicon-96x96.png",
  "/badge-icon.png", // For notification badges
  "/logo.png",
];

// Installation - Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching core assets");
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log("[Service Worker] Skipping waiting");
        return self.skipWaiting();
      })
  );
});

// Activation - Clean up old caches
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
      .then(() => {
        console.log("[Service Worker] Claiming clients");
        return self.clients.claim();
      })
  );
});

// Fetch - Network first with cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests, API calls, and non-HTTP(S) requests
  if (
    request.method !== "GET" ||
    request.url.includes("/api/") ||
    !request.url.startsWith("http")
  ) {
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(OFFLINE_URL))
        .then((response) => response || caches.match("/index.html"))
    );
    return;
  }

  // For other requests, try cache first then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Create a clean copy of the request
        const cacheRequest = new Request(request.url, {
          headers: request.headers,
          method: "GET",
          mode: "same-origin", // Ensures cacheable response
          credentials: "omit",
          redirect: "follow",
        });

        // Verify the response is cacheable
        if (
          response &&
          response.status === 200 &&
          response.type === "basic" &&
          request.url.startsWith("http") &&
          !request.url.includes("chrome-extension://")
        ) {
          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => {
              // Use the clean request copy
              return cache.put(cacheRequest, responseToCache).catch((err) => {
                console.warn("Could not cache:", request.url, err);
              });
            })
            .catch(console.warn);
        }
        return response;
      });
    })
  );
});

// Push notifications with badge support
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

    // Update app badge count if supported
    await navigator.setAppBadge(data.unreadCount || 1);
  } catch (error) {
    console.error("Push notification failed:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Navigate to specific URL if provided in notification data
  if (event.notification.data?.url) {
    event.waitUntil(self.clients.openWindow(event.notification.data.url));
  }
});

// Handle messages from clients (e.g., badge updates)
self.addEventListener('message', async (event) => {
  if (event.data?.type === 'UPDATE_BADGE' || event.data?.type === 'CLEAR_BADGE') {
    try {
      // Forward to all clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'BADGE_UPDATE',
          count: event.data.count
        });
      });
      
      // Update badge if supported
      if ('setAppBadge' in navigator) {
        await navigator.setAppBadge(event.data.count).catch(console.error);
      }
    } catch (error) {
      console.error('SW badge handling error:', error);
    }
  }
});
