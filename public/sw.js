const CACHE_NAME = 'fwp-app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/assets/images/logo_icon.svg',
  '/assets/images/exercise_rdl.png',
  '/assets/images/exercise_split_squat.png',
  '/assets/images/exercise_shoulder_press.png',
  '/assets/images/exercise_lat_pulldown.png',
  '/assets/images/exercise_hip_thrust.png',
  '/assets/images/exercise_goblet_squat.png',
  '/assets/images/hero_mirna.png'
];

// Perform installation and cache core PWA shells
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install Event triggered. Pre-caching static shells.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Clear stale dynamic caches on activation
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation Event triggered. Purging obsolete cache groups.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache slice:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Capture and intercept fetch triggers to secure offline capabilities
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip caching for Clerk API endpoints, next-internal hot reloading, and standard POST API endpoints
  if (
    url.hostname.includes('clerk') ||
    url.pathname.startsWith('/api/chat') ||
    req.method !== 'GET' ||
    url.pathname.includes('_next/webpack-hmr')
  ) {
    return;
  }

  // Caching strategy: Network-First with Cache-Fallback for Page views (HTML)
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // Serve offline backup if standard fetch breaks
          return caches.match(req).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the specific route is not cached, return index shell
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Cache-First with Network-Update for Next.js static builds, icons, and local styles
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background refresh to keep cache fresh
        fetch(req).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      return fetch(req).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });

        return response;
      });
    })
  );
});
