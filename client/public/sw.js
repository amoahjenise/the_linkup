/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'thelinkup-v3';
const OFFLINE_URL = '/offline.html';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js', // React's main JS bundle
  '/static/css/main.css'  // React's main CSS
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET and API requests
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  // Handle HTML navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(OFFLINE_URL))
        .then(response => response || caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request))
  );
});