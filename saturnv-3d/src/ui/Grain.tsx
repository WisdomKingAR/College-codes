import Noise from '@/components/Noise'

/**
 * Fixed overlay that binds the DOM layer to the WebGL layer.
 *
 * The canvas renders stars and a clean starfield gradient; without a grain
 * texture on top, DOM text sitting over WebGL reads as a different image
 * entirely. This is a static overlay rather than an animation so it costs
 * nothing per frame.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 opacity-[0.035] mix-blend-overlay"
    >
      <Noise patternSize={180} patternRefreshInterval={0} patternAlpha={140} />
    </div>
  )
}