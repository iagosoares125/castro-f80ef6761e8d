// Service worker do site do celular: permite "Instalar" como app e guarda as artes já vistas (abre mais rápido).
// Página e dados: rede primeiro (sempre a versão nova). Imagens (m/, g/, marca/, icones/): cache primeiro.
const CACHE = 'castro-921e89899d'; // trocada a cada montagem: artes atualizadas não ficam presas no cache
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('.pptx')) return;
  const img = /\/(m|g|marca|icones)\//.test(u.pathname);
  e.respondWith(caches.open(CACHE).then(async (c) => {
    if (img) { const h = await c.match(e.request); if (h) return h; }
    try { const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; }
    catch (err) { const h = await c.match(e.request); if (h) return h; throw err; }
  }));
});
