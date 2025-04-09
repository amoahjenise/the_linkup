/* eslint-disable no-restricted-globals */
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

  // Skip non-GET requests and API calls
  if (request.method !== "GET" || request.url.includes("/api/")) {
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
      // Return cached response if available
      if (cached) {
        return cached;
      }

      // Otherwise fetch from network and cache it
      return fetch(request).then((response) => {
        // Only cache successful, non-opaque responses
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});

// Push notifications with badge support
self.addEventListener("push", async (event) => {
  try {
    const data = event.data?.json();
    if (!data) return;

    await self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/badge-icon.png",
      data: { url: data.url }, // Add URL for navigation
    });

    // Update app badge count if supported
    if ("setAppBadge" in navigator) {
      await navigator.setAppBadge(data.unreadCount || 1);
    }
  } catch (error) {
    console.error("Error handling push event:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Navigate to specific URL if provided in notification data
  if (event.notification.data?.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// Handle messages from clients (e.g., badge updates)
self.addEventListener("message", async (event) => {
  try {
    if (event.data?.type === "UPDATE_BADGE") {
      if ("setAppBadge" in navigator) {
        await navigator.setAppBadge(event.data.count);
      }
    } else if (event.data?.type === "CLEAR_BADGE") {
      if ("clearAppBadge" in navigator) {
        await navigator.clearAppBadge();
      }
    }
  } catch (error) {
    console.error("Error handling message event:", error);
  }
});
