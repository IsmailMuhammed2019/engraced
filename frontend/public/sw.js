// CRITICAL: Update this version number with EVERY deployment to force cache refresh
const CACHE_VERSION = 'v3.0.0';
const CACHE_NAME = `engracedsmile-${CACHE_VERSION}`;

// Install event - skip caching chunks, only cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing version', CACHE_VERSION);
  // Force immediate activation
  self.skipWaiting();
});

// Activate event - AGGRESSIVELY delete ALL old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating version', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('Service Worker: Found caches:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Service Worker: DELETING cache', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('Service Worker: ALL caches deleted, taking control');
        return self.clients.claim();
      })
  );
});

// Fetch event - NETWORK FIRST for everything
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // NETWORK FIRST for all requests (especially Next.js chunks)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Successfully fetched from network
        console.log('Service Worker: Fetched from network', request.url);
        
        // Only cache successful responses for static assets (not chunks)
        if (networkResponse && networkResponse.status === 200 && 
            !url.pathname.includes('/_next/static/chunks/')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
        }
        
        return networkResponse;
      })
      .catch((error) => {
        console.error('Service Worker: Network fetch failed', request.url, error);
        
        // Only use cache as fallback for non-chunk requests
        if (!url.pathname.includes('/_next/static/chunks/')) {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Service Worker: Serving from cache (fallback)', request.url);
                return cachedResponse;
              }
              
              // Return offline page for navigation requests
              if (request.mode === 'navigate') {
                return caches.match('/offline.html') || new Response('Offline', { status: 503 });
              }
              
              return new Response('Network error', { status: 503 });
            });
        }
        
        // For chunks, don't use cache - let it fail and retry
        throw error;
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Engracedsmile',
    icon: '/icon-192x192.png',
    badge: '/icon-128x128.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Engracedsmile', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    return;
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    console.log('Service Worker: Performing background sync');
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
    return Promise.reject(error);
  }
}

// Message handler
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clear request
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Service Worker: Clearing cache on request', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('Service Worker: All caches cleared');
        return self.clients.claim();
      })
    );
  }
});
