// OKAYiT Service Worker
// Bump this version whenever the service-worker changes so clients pick up fresh assets
const CACHE_VERSION = 'okayit-v3.0.0';
const STATIC_CACHE = `okayit-static-${CACHE_VERSION}`;
const IMAGE_CACHE  = `okayit-images-${CACHE_VERSION}`;
const API_CACHE    = `okayit-api-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline';

// Minimal files to pre-cache on install. Keep small so install never fails.
const PRECACHE_URLS = [
  OFFLINE_URL,
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/okayit-logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Use addAll with individual fetches so one 404 doesn't blow up install.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) await cache.put(url, res);
          } catch (_) {
            // ignore individual precache errors
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, IMAGE_CACHE, API_CACHE].includes(k))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  // P0-01: Purge ALL caches on logout to prevent data leakage on shared devices
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))));
  }
});

// -------- fetch strategies --------

async function networkFirst(request, cacheName, { timeoutMs = 4000 } = {}) {
  const cache = await caches.open(cacheName);
  try {
    const network = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ]);
    if (network && network.ok) cache.put(request, network.clone()).catch(() => {});
    return network;
  } catch (_) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw _;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const network = await fetch(request);
  if (network && network.ok) cache.put(request, network.clone()).catch(() => {});
  return network;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
      return res;
    })
    .catch(() => undefined);
  return cached || (await networkPromise);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Do not touch authentication flows – let them go to network
  if (url.pathname.startsWith('/api/auth')) return;

  // Navigations: network-first, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await networkFirst(request, STATIC_CACHE, { timeoutMs: 4000 });
        } catch (_) {
          const cache = await caches.open(STATIC_CACHE);
          const offline = await cache.match(OFFLINE_URL);
          return (
            offline ||
            new Response(
              '<h1>You are offline</h1><p>Please reconnect to use OKAYiT.</p>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
          );
        }
      })()
    );
    return;
  }

  // Next.js built assets – immutable, cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // P0-01: API calls — NEVER CACHE authenticated responses.
  // User data (check-ins, journals, safety plans) must not persist in Cache Storage.
  if (url.pathname.startsWith('/api/')) {
    return; // Let the browser handle API requests normally — no SW caching
  }

  // Default – SWR
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

// -------- push notifications (best-effort) --------
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch (_) {
    payload = { title: 'OKAYiT', body: event.data.text() };
  }
  const title = payload.title || 'OKAYiT';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: payload.tag || 'okayit',
    data: payload.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) client.navigate(target);
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })()
  );
});
