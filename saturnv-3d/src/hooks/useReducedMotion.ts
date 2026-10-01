import { useEffect, useState } from 'react'

/**
 * Tracks the user's reduced-motion preference, live.
 *
 * When this is on the page drops Lenis smoothing, stops the camera drifting and
 * the star field rotating, and holds the exploded view closed. The content is
 * still fully readable and every part is still reachable from the nav rail.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}