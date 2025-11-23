const CACHE_VERSION = 'v3';
const CACHE_NAME = `sfh-cache-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  'index.html',
  'favicon.png',
  'main.css',
  'main.js',
  'disclaimer.html',
  'assets/screenshots/screenshots.json',
  'assets/screenshots/steamtools-warning.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // claim clients and delete old caches
      await clients.claim();
      const keys = await caches.keys();
      await Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); }));
    })()
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // For same-origin requests: try cache first, then network and cache the response
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(networkResp => {
          // put a copy in cache
          const respClone = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, respClone));
          return networkResp;
        }).catch(() => caches.match('index.html'));
      })
    );
    return;
  }

  // For cross-origin (fonts, cdnjs), try network first then fallback to cache
  event.respondWith(
    fetch(req).then(resp => {
      return resp;
    }).catch(() => caches.match(req))
  );
});
