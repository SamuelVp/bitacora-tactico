const CACHE_NAME = 'promocion-2027-shell-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Do not pre-cache or retain the large audio library automatically.
  // Audio streams continue to come from GitHub when the user plays them.
  if (/\.(mp3|m4a|wav|ogg)(\?.*)?$/i.test(url.pathname)) return;

  // Navigation/app shell: cached response immediately, refresh cache in background.
  if (req.mode === 'navigate' || url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req, {ignoreSearch:true});
      const networkPromise = fetch(req).then(response => {
        if (response && response.ok && response.type === 'basic') {
          cache.put(req, response.clone());
        }
        return response;
      }).catch(() => null);

      if (cached) {
        event.waitUntil(networkPromise);
        return cached;
      }
      const network = await networkPromise;
      if (network) return network;
      return (await cache.match('./index.html')) || Response.error();
    })());
  }
});
