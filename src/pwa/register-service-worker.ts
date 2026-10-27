export function registerServiceWorker() {
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.error('Service worker registration failed.', error)
    })
  })
}
