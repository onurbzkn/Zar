const CACHE_NAME = 'dice-pro-v2';
const ASSETS = [
  '/Zar/',
  '/Zar/index.html',
  '/Zar/manifest.json',
  '/Zar/icon-512.png',
  '/Zar/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
