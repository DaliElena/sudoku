const CACHE_NAME = 'sudoku-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/themes.css',
  '/css/board.css',
  '/css/ui.css',
  '/js/i18n.js',
  '/js/settings.js',
  '/js/generator.js',
  '/js/board.js',
  '/js/validator.js',
  '/js/history.js',
  '/js/timer.js',
  '/js/storage.js',
  '/js/renderer.js',
  '/js/input.js',
  '/js/main.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
