const CACHE_VERSION = 'ciaapp-shell-v1'
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/brand/cia-logo-source.png',
]

async function cacheApplicationShell() {
  const cache = await caches.open(CACHE_VERSION)
  const indexResponse = await fetch('/index.html', { cache: 'no-cache' })

  if (!indexResponse.ok) {
    throw new Error('Application shell could not be fetched.')
  }

  const html = await indexResponse.clone().text()
  const referencedAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((path) => path.startsWith('/'))

  await cache.put('/index.html', indexResponse)
  await cache.addAll([...new Set([...CORE_ASSETS, ...referencedAssets])])
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheApplicationShell().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_VERSION)
            await cache.put('/index.html', response.clone())
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match('/index.html')
          return cached ?? Response.error()
        }),
    )
    return
  }

  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) {
        return cached
      }

      const response = await fetch(request)
      if (response.ok) {
        const cache = await caches.open(CACHE_VERSION)
        await cache.put(request, response.clone())
      }
      return response
    }),
  )
})
