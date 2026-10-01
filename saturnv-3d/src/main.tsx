import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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