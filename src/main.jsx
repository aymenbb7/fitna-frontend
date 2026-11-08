import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';
import './i18n';

// 1. Recover gracefully from outdated chunks on new deployments:
// Vite triggers 'vite:preloadError' when a dynamically imported chunk fails to load.
window.addEventListener('vite:preloadError', (event) => {
  const key = 'fitna_preload_retry';
  const lastRetry = sessionStorage.getItem(key);
  const now = Date.now();
  if (!lastRetry || now - parseInt(lastRetry, 10) > 10000) {
    sessionStorage.setItem(key, now.toString());
    window.location.reload();
  }
});

// Also catch uncaught module import errors:
window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module')
  ) {
    const key = 'fitna_chunk_retry';
    const lastRetry = sessionStorage.getItem(key);
    const now = Date.now();
    if (!lastRetry || now - parseInt(lastRetry, 10) > 10000) {
      sessionStorage.setItem(key, now.toString());
      window.location.reload();
    }
  }
});

// 2. Defensive cleanup: unregister any legacy service workers & clear obsolete CacheStorage
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        caches.delete(key);
      }
    }).catch(() => {});
  }
}

const savedTheme = localStorage.getItem('fitna_theme') || 'luxury';
document.documentElement.setAttribute('data-theme', savedTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>,
);
