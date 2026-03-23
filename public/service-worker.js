// Copyright (C) 2026 Outright Mental
// Service Worker for Agendar PWA

const CACHE_NAME = 'agendar-cache-v1';
const RUNTIME_CACHE = 'agendar-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './site.webmanifest',
  './favicon.ico',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './logo512.png',
  './apple-touch-icon.png'
];

// Runtime cache configuration
const MAX_RUNTIME_CACHE_SIZE = 50; // Maximum number of entries in runtime cache

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
        console.log('Service Worker: Cache cleanup complete');
      })
  );
});

// Helper function to limit cache size
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxSize) {
    // Delete oldest entries (first in the array)
    const deleteCount = keys.length - maxSize;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

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

  // Network-first strategy for navigations (HTML) to ensure updates propagate
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the updated navigation response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseToCache))
              .catch((cacheError) => {
                console.warn('Service Worker: Failed to cache navigation:', cacheError);
              });
          }
          return response;
        })
        .catch((error) => {
          console.log('Service Worker: Network failed for navigation, trying cache');
          // Fallback to cache for offline support
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              console.error('Service Worker: No cached fallback available for', request.url);
              throw error;
            });
        })
    );
    return;
  }

  // Cache-first strategy for static assets (scripts, styles, images)
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

            // Only cache specific asset types to prevent unbounded growth
            const shouldCache = request.method === 'GET' && 
              (request.destination === 'script' || 
               request.destination === 'style' || 
               request.destination === 'image' ||
               request.destination === 'font');

            if (shouldCache) {
              // Clone and cache the response for future use
              const responseToCache = response.clone();
              
              caches.open(RUNTIME_CACHE)
                .then(async (cache) => {
                  await cache.put(request, responseToCache);
                  // Limit cache size to prevent unbounded growth
                  await limitCacheSize(RUNTIME_CACHE, MAX_RUNTIME_CACHE_SIZE);
                })
                .catch((cacheError) => {
                  console.warn('Service Worker: Failed to cache response:', cacheError);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed for', request.url, error);
            // Return cached response if available, even if stale
            return caches.match(request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  console.log('Service Worker: Serving stale cache for', request.url);
                  return cachedResponse;
                }
                // Could return a custom offline page here
                console.error('Service Worker: No cached fallback available for', request.url);
                throw error;
              });
          });
      })
  );
});
