/**
 * Fixed overlay that binds the DOM layer to the WebGL layer.
 *
 * The canvas renders stars and a clean starfield gradient; without a grain
 * texture on top, DOM text sitting over WebGL reads as a different image
 * entirely.
 *
 * This is an encoded SVG `feTurbulence` tiled as a background rather than the
 * vendored `Noise` canvas. `Noise` builds a 1024x1024 ImageData — four megabytes
 * — and writes it from inside a requestAnimationFrame loop, and the only way to
 * stop that loop is `patternRefreshInterval={0}`, which makes its
 * `frame % patternRefreshInterval === 0` test `NaN === 0`, i.e. false forever:
 * the texture never draws at all while the loop keeps rescheduling itself for
 * the life of the page. One encoded SVG gives the same result for no JavaScript
 * per frame.
 */
const GRAIN_IMAGE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: GRAIN_IMAGE, backgroundRepeat: 'repeat' }}
    />
  )
}