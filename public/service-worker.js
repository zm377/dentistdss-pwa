// This is the service worker with the Cache-first network

const CACHE = "dentistdss-v1";
const precacheFiles = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/js/vendors~main.chunk.js',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// The install handler takes care of precaching the resources we always need
self.addEventListener('install', event => {
  console.log('Service worker installing...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(precacheFiles))
  );
});

// The activate handler takes care of cleaning up old caches
self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE) {
            console.log('Service worker: clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// The fetch handler serves responses for same-origin resources from a cache
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (response.ok) {
              const responseToCache = response.clone();
              caches.open(CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // If both cache and network fail, show a generic fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // For images, we can show a generic offline image
            if (event.request.headers.get('accept').includes('image/')) {
              return caches.match('/images/fallback.png');
            }
            
            // If we can't fetch and there's nothing in the cache, return an error
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
    );
  }
}); 