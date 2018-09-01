// TODO: increase `bundleVersion` to force cache update on a new release
const bundleVersion = 'v1';

const config = {
    cacheRemote: true,
    version: bundleVersion+'::',
    preCachingItems: [
        'app.bundle.js',
        'index.html',
        'index.js',
        'offline.html',
        '404.html',
        'sw.js'
    ],
    blacklistCacheItems: [
        'service-worker.js'
    ],
    offlineImage: '<svg role="img" aria-labelledby="offline-title"\' + \' viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">\' + \'<title id="offline-title">Offline</title>\' + \'<g fill="none" fill-rule="evenodd"><path fill="#121212" d="M0 0h400v300H0z"/>\' + \'<text fill="#fff" font-family="Times New Roman,Times,serif" font-size="72" font-weight="bold">\' + \'<tspan x="93" y="172">offline</tspan></text></g></svg>',
    offlinePage: 'offline.html',
    notFoundPage: '404.html'
};

function cacheName(key, opts) {
    return `${opts.version}${key}`;
}

function addToCache(cacheKey, request, response) {
    if (response.ok) {
        const copy = response.clone();
        caches.open(cacheKey).then(cache => {
            cache.put(request, copy);
        });
    }
    return response;
}

function fetchFromCache(event) {
    return caches.match(event.request).then(response => {
        if (!response) {
            throw Error(`${event.request.url} not found in cache`);
        } else if (response.status === 404) {
            return caches.match(options.notFoundPage);
        }
        return response;
    });
}

function offlineResponse(resourceType, opts) {
    if (resourceType === 'content') {
        return caches.match(opts.offlinePage);
    } else if (resourceType === 'image') {
        return new Response(
            opts.offlineImage,
            {
                headers: { 'Content-Type': 'image/svg+xml' }
            }
        );
    }
    return undefined;
}

self.addEventListener('install', event => {
    event.waitUntil(caches.open(
        cacheName('static', config)
        )
            .then(cache => cache.addAll(config.preCachingItems))
            .then(() => self.skipWaiting())
    );
});
self.addEventListener('activate', event => {
    function clearCacheIfDifferent(event, opts) {
        return caches.keys().then(cacheKeys => {
            const oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
            const deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
            return Promise.all(deletePromises);
        });
    }
    event.waitUntil(
        clearCacheIfDifferent(event, config)
            .then(() => self.clients.claim())
    );
});
self.addEventListener('fetch', event => {
    const request = event.request;
    const acceptHeader = request.headers.get('Accept');
    const url = new URL(request.url);
    let resourceType = 'content';
    let cacheKey;
    if (request.method !== 'GET'
        || (config.cacheRemote !== true && url.origin !== self.location.origin)
        || (config.blacklistCacheItems.length > 0 && config.blacklistCacheItems.indexOf(url.pathname) !== -1)) {
        // default browser behavior
        return;
    }
    if (acceptHeader.indexOf('text/') !== -1 || acceptHeader.indexOf('application/') !== -1) {
        resourceType = 'content';
    } else if (acceptHeader.indexOf('image/') !== -1) {
        resourceType = 'image';
    }
    cacheKey = cacheName(resourceType, config);
    // Cache first
    event.respondWith(
        fetchFromCache(event)
            .catch(() => fetch(request).catch(() => offlineResponse(resourceType, config)))
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => offlineResponse(resourceType, config))
    );
});
