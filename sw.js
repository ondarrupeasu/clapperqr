/* QRClappeR PWA — Service Worker.
   Hace que la app funcione SIN CONEXIÓN (crítico en rodaje con mala cobertura).
   Estrategia:
   - App shell precacheado en la instalación.
   - HTML/navegación: red primero, cache de reserva → recibes actualizaciones
     cuando hay internet, pero abre igual sin conexión.
   - Resto de recursos: cache primero, red de reserva.
   Para forzar que todos actualicen tras un cambio, sube el número de CACHE. */

const CACHE = 'qrclapper-v33';
const SHELL = [
  './',
  'index.html',
  'manifest.json',
  'lenses.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

// version.json NUNCA se cachea: es el chivato de "hay versión nueva". Sin esto,
// el SW lo serviría cacheado y el aviso no saltaría hasta recargar.
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Solo GET del mismo origen (ignora POST, analytics, etc.).
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }
  // version.json: el chivato de versión. Que lo gestione el navegador (red
  // directa, sin caché del SW); si no, avisaría tarde o nunca.
  if (new URL(req.url).pathname.endsWith('version.json')) return;

  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate'
    || (req.headers.get('accept') || '').includes('text/html');
  // El catálogo de ópticas: red primero (para traer la última versión cuando
  // hay internet), cache de reserva sin conexión.
  const isCatalog = url.pathname.endsWith('/lenses.json') || url.pathname.endsWith('lenses.json');

  if (isHTML || isCatalog) {
    // Red primero para recibir la versión más nueva; si no hay red, cache.
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || (isHTML ? caches.match('index.html') : undefined)))
    );
    return;
  }

  // Recursos: cache primero, red de reserva (y guarda lo nuevo).
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }))
  );
});
