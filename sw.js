const CACHE_NAME = 'bikelight-v2';

// 1. Proses Install: Langsung aktif tanpa menunggu re-login browser
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

// 2. Proses Aktivasi: Bersihkan memori cache versi lama agar tidak bentrok
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. KUNCI UTAMA OFFLINE: Strategi Network-First / Cache-Fallback Pintar
self.addEventListener('fetch', event => {
  // Abaikan request eksternal atau request pihak ketiga agar tidak memicu error sandbox
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika internet ada, ambil dari server dan salin ke memori HP secara dinamis
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(async() => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        // JIKA OFFLINE (Wi-Fi Sepeda), paksa browser mengambil file dari memori internal HP Anda 
          // Jika file utama dicari lewat rute root index
          if (event.request.mode === 'navigate') {
            const fallbackResponse = await caches.match('index.html');
            if (fallbackResponse) return fallbackResponse;
          }
        return new Response("Offline mode active. No cache found.",{
  status: 503, 
  statusText: "Service Unavailable"
    });
        
      })
  );
});
