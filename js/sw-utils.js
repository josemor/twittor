

// Actualizar cache dinamicamente
const actualizarCacheDinamico =  (dynamicCache, req, res) => {
    if (res.ok) {
         caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone());
        });
    }
    return res;
};