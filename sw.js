const CACHE_NAME = 'traveltrip-v4';
const APP_SHELL = ['./', './index.html', './data.js', './assets/js/app.js', './assets/css/app.css', './manifest.webmanifest', './assets/icons/app-icon.svg'];

self.addEventListener('install', event => {
  // Keep the existing app active until the user explicitly accepts the update.
  // Calling skipWaiting here caused unexpected refreshes while people were using the app.
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : cached)));
});
