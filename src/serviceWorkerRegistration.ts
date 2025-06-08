// Service worker registration for Vite PWA
// This will be handled automatically by vite-plugin-pwa

export function register(config) {
  // Vite PWA plugin handles service worker registration automatically
  // This function is kept for compatibility with existing code
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    console.log('PWA service worker will be registered automatically by Vite PWA plugin');

    // Execute success callback if provided
    if (config && config.onSuccess) {
      navigator.serviceWorker.ready.then((registration) => {
        config.onSuccess(registration);
      });
    }
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
  }
}