// Mode hors ligne : met en cache les fichiers de l'app (aucune donnée personnelle).
var V='emma-v7-20261109c';
var FILES=['./','index.html','content.enc.js?v=20261109c','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(V).then(function(ch){ch.put(e.request,c)});return r}).catch(function(){return caches.match(e.request).then(function(r){return r||caches.match('index.html')})}));
});
