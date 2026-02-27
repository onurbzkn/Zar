self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('dice-store').then((cache) => cache.addAll([
      '/Zar/',
      '/Zar/index.html',
      '/Zar/manifest.json',
      '/Zar/icon-512.png'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

