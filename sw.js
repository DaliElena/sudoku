const CACHE_NAME = 'sudoku-v7';
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'css/base.css',
  BASE + 'css/themes.css',
  BASE + 'css/board.css',
  BASE + 'css/ui.css',
  BASE + 'js/whatsnew.js',
  BASE + 'js/i18n.js',
  BASE + 'js/settings.js',
  BASE + 'js/generator.js',
  BASE + 'js/board.js',
  BASE + 'js/validator.js',
  BASE + 'js/history.js',
  BASE + 'js/timer.js',
  BASE + 'js/storage.js',
  BASE + 'js/renderer.js',
  BASE + 'js/input.js',
  BASE + 'js/main.js',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png'
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
