// CACHE name is rewritten at build time by scripts/stamp-sw.js to include
// the package.json version, so each release publishes a new cache key and
// the activate handler purges the previous cache automatically. The "dev"
// suffix only ever appears during local development.
const CACHE = 'dealbreaker-__BUILD_VERSION__';
const SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }
  e.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(res => {
      const copy = res.clone();
      if (res.ok && new URL(request.url).origin === location.origin) {
        caches.open(CACHE).then(c => c.put(request, copy));
      }
      return res;
    }).catch(() => hit))
  );
});
