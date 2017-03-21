
var idb=require ("idb");

const cacheName = 'v1.0.0';

function getDB() {
  return idb.open('chat-db', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore("room", {keyPath:"id"});
  }
});
}

self.addEventListener('install', (e) => {

  e.waitUntil(
    fetch("/appshell.json").then((response) => {
      return response.json();
    }).then((list) => {
      return caches.open(cacheName).then((cache) => {
        return cache.addAll(list);
      })
    })
  );
});

self.addEventListener('activate', (e) => {
});

self.addEventListener('fetch', (e) => {

  e.respondWith(
    caches.match(e.request).then((response) => {
        if(response) {
          console.log("sw ["+cacheName+"] fetch from cache : "+e.request.url);
          return response;
        } else {

            console.log("sw ["+cacheName+"] fetch from network : "+e.request.url);
            return fetch(e.request).catch( err => {
              if(e.request.url.indexOf("/rest/v1/social/activities")>=0) {
                return getDB().then(db => {
                  return db.transaction("activities").objectStore("activities").getAll().then(all=> {
                    console.log("sw ["+cacheName+"] returning result from DB");
                    return new Response(JSON.stringify({activities:all}), {
                      headers: {"Content-type" :"application/json"}
                    });
                  })
                });
              }
            });
          }
        }
    })

  )

});
