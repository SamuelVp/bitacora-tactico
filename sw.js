// PWA retirada. Este archivo solo existe temporalmente para desactivar instalaciones antiguas.
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    } catch (e) {}
    try {
      await self.registration.unregister();
    } catch (e) {}
    try {
      const clients = await self.clients.matchAll({type:'window'});
      clients.forEach(client => client.navigate(client.url));
    } catch (e) {}
  })());
});
