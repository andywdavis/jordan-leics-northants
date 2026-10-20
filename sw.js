const CACHE='rj-jordan-leics-northants-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./pages/001.webp','./pages/002.webp','./icon-192.png','./icon-512.png','./icon-180.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 // Max's 116 pages are shared online and cached only after a customer actually opens them.
 if(u.hostname==='andywdavis.github.io'&&u.pathname.startsWith('/max-merseyside-draft/pages/')){
  e.respondWith(caches.open(CACHE).then(async c=>{
   try{let r=await fetch(e.request);if(r.ok||r.type==='opaque')c.put(e.request,r.clone()).catch(()=>{});return r}
   catch(err){const hit=await c.match(e.request);if(hit)return hit;throw err}
  }));return;
 }
 if(u.origin!==self.location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{
  if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone())).catch(()=>{});return r
 }).catch(async()=>await caches.match(e.request)||await caches.match('./index.html')));
});
