// Copyright (C) 2026 Outright Mental
// Service Worker for Agendar PWA

const CACHE_NAME = 'agendar-cache-v1';
const RUNTIME_CACHE = 'agendar-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/logo512.png',
  '/apple-touch-icon.png'
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Precaching essential assets');
        return cache.addAll(PRECACHE_ASSETS.map(url => {
          // Create a new Request with no-cache to ensure fresh install
          return new Request(url, { cache: 'reload' });
        }));
      })
      .then(() => {
        console.log('Service Worker: Precaching complete');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // Network-only for external APIs (Google Calendar, etc.)
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first strategy for local assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request for network fetch
        return fetch(request.clone())
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone and cache the response for future use
            const responseToCache = response.clone();
            
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                // Only cache GET requests
                if (request.method === 'GET') {
                  cache.put(request, responseToCache);
                }
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
            // Return cached response if available, even if stale
            return caches.match(request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // Could return a custom offline page here
                throw error;
              });
          });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
