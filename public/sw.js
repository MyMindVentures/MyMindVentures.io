// Service Worker voor MyMindVentures.io PWA
// Advanced caching, offline support, en background sync

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Workbox configuratie
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/'
});

// Cache namen
const CACHE_NAMES = {
  STATIC: 'mymindventures-static-v1',
  DYNAMIC: 'mymindventures-dynamic-v1',
  API: 'mymindventures-api-v1',
  IMAGES: 'mymindventures-images-v1',
  FONTS: 'mymindventures-fonts-v1',
  PDFS: 'mymindventures-pdfs-v1'
};

// Cache strategieën
const cacheStrategies = {
  // Static assets - Cache First met fallback
  static: new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.STATIC,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dagen
        purgeOnQuotaError: true
      })
    ]
  }),

  // Dynamic content - Network First met fallback
  dynamic: new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAMES.DYNAMIC,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 uur
        purgeOnQuotaError: true
      })
    ]
  }),

  // API calls - Network First met fallback
  api: new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAMES.API,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minuten
        purgeOnQuotaError: true
      })
    ]
  }),

  // Images - Cache First met fallback
  images: new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.IMAGES,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dagen
        purgeOnQuotaError: true
      })
    ]
  }),

  // Fonts - Cache First met fallback
  fonts: new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.FONTS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 jaar
        purgeOnQuotaError: true
      })
    ]
  }),

  // PDFs - Cache First met fallback
  pdfs: new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.PDFS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dagen
        purgeOnQuotaError: true
      })
    ]
  })
};

// Route handlers
workbox.routing.registerRoute(
  // Static assets
  ({ request }) => 
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'worker',
  cacheStrategies.static
);

workbox.routing.registerRoute(
  // Images
  ({ request }) => request.destination === 'image',
  cacheStrategies.images
);

workbox.routing.registerRoute(
  // Fonts
  ({ request }) => request.destination === 'font',
  cacheStrategies.fonts
);

workbox.routing.registerRoute(
  // PDFs
  ({ request }) => request.url.includes('.pdf') || request.destination === 'document',
  cacheStrategies.pdfs
);

workbox.routing.registerRoute(
  // API calls naar Supabase
  ({ url }) => url.origin === 'https://your-project.supabase.co',
  cacheStrategies.api
);

workbox.routing.registerRoute(
  // Dynamic content (HTML pages)
  ({ request }) => request.destination === 'document',
  cacheStrategies.dynamic
);

// Background sync voor offline operaties
workbox.backgroundSync.register('ai-insights-sync', {
  onSync: async ({ queue }) => {
    const entries = await queue.getAll();
    for (const entry of entries) {
      try {
        // Probeer de operatie opnieuw uit te voeren
        await fetch(entry.request);
        await queue.deleteRequestId(entry.id);
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    }
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Bekijk',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Sluit',
          icon: '/icons/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/ai-insights')
    );
  }
});

// Install event - Pre-cache belangrijke assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC).then((cache) => {
      return cache.addAll([
        '/',
        '/ai-insights',
        '/database',
        '/workflows',
        '/manifest.json',
        '/offline.html'
      ]);
    })
  );
});

// Activate event - Cleanup oude caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Custom fetch handler
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle offline fallback
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Handle API requests met offline queue
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Queue voor background sync
          const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('ai-insights-sync');
          return bgSyncPlugin.fetch(event.request);
        })
    );
    return;
  }
});

// Message handler voor communicatie met main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.waitUntil(
    fetch(event.request)
      .then((response) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log performance metrics
        if (duration > 1000) {
          console.warn(`Slow request: ${event.request.url} took ${duration}ms`);
        }
        
        return response;
      })
  );
});

console.log('🚀 MyMindVentures.io Service Worker geladen!');
console.log('📱 PWA features: Offline caching, Background sync, Push notifications');
