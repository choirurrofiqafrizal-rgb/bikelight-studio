const CACHE_NAME = 'bikelight-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json'
];

// Pasang aset masuk ke memori HP saat web dibuka pertama kali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ambil aset langsung dari memori internal HP (Mendukung Akses Offline 100%)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
