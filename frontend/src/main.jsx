import React from 'react'
import ReactDOM from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import App from './App.jsx'
import './index.css'

// Self-destruct / unregister all service workers and clear caches from PWA config
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) console.log('Successfully unregistered service worker:', registration);
        });
      }
    }).catch((err) => {
      console.error('Error unregistering service workers:', err);
    });
  }

  if ('caches' in window) {
    caches.keys().then((keys) => {
      return Promise.all(keys.map(key => {
        console.log('Clearing cache storage:', key);
        return caches.delete(key);
      }));
    }).catch((err) => {
      console.error('Error clearing caches:', err);
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>
)