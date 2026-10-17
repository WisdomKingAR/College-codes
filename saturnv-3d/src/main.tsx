import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted, so the typography is identical offline. Both stacks in index.css
// name these families first, but nothing was loading them — no @font-face, no
// <link>, no files in public/ — so the page rendered in Segoe UI and Cascadia
// Mono and every type decision was being made against a fallback. The wght axis
// is the only one the design uses; the unused subset files are never fetched
// because each @font-face is scoped by unicode-range.
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import App from './App.tsx'
import './index.css'

// The #boot overlay in index.html is intentionally left in the DOM here; App
// removes it once the vehicle model has actually finished loading, so the user
// never sees an empty black screen while the GLB streams in.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)