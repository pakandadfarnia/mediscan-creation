import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { ensureImported } from '@/lib/localDb'

// Register the service worker so the app shell loads offline (production only,
// so it never interferes with the builder's live preview / HMR).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Pull any existing cloud data into the local DB once (fire-and-forget).
// Runs in parallel with the app's auth check, so the local DB is populated
// before pages read it — without ever blocking startup or the login screen.
ensureImported()

ReactDOM.createRoot(document.getElementById('root')).render(<App />)