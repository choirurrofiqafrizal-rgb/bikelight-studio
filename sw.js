const CACHE_NAME = 'bikelight-v1';
const assets = [
    './',
    'index.html',
    'manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});
