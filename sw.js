// Imports
importScripts('js/sw-utils.js');

// Constantes
const STATIC_CACHE    = 'static-cache-v2';
const DYNAMIC_CACHE   = 'dynamic-cache-v1';
const INMUTABLE_CACHE = 'inmutable-cache-v1';

const APP_SHELL_CACHE = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/sw-utils.js'
];

const APP_SHELL_CACHE_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


// Creación de los caches.
self.addEventListener('install', event => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(APP_SHELL_CACHE);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        return cache.addAll(APP_SHELL_CACHE_INMUTABLE);
    });

    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

// Borrado de caches
self.addEventListener('activate', event => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                caches.delete(key);
            }
        });
    });
    event.waitUntil(respuesta);
});

// Fetching
self.addEventListener('fetch', event => {
    const respuesta = caches.match(event.request).then(res => {
        if (res) {
            return res;
        } else {
            return fetch(event.request).then(newRes => {
                return actualizarCacheDinamico(DYNAMIC_CACHE, event.request, newRes )
            });
        }
    });
    event.respondWith(respuesta);
});
