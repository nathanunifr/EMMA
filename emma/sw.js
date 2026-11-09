// EMMA : réseau prioritaire et contenu hors ligne conservé.
var V='emma-v8-20261109-live';
var FILES=['./','index.html','content.enc.js','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(n){return n.indexOf('emma-v')===0&&n!==V}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 var req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin||!url.pathname.startsWith(new URL('./',location.href).pathname))return;
 var canonical=new URL(url.href);
 if(canonical.pathname.endsWith('/content.enc.js'))canonical.search='';
 var key=new Request(canonical.href);
 e.respondWith(fetch(req,{cache:'no-store'}).then(function(r){
   if(r.ok){var copy=r.clone();e.waitUntil(caches.open(V).then(function(c){return c.put(key,copy)}))}
   return r;
 }).catch(function(){
   return caches.match(key).then(function(cached){
     if(cached)return cached;
     if(req.mode==='navigate')return caches.match(new URL('index.html',location.href).href);
     return Response.error();
   });
 }));
});
