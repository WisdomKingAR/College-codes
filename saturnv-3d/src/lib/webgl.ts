/**
 * WebGL capability probe.
 *
 * R3F throws when it cannot get a context, which costs a React error boundary,
 * a console stack and a full re-render of the subtree before the text fallback
 * appears. A single cheap context request up front answers the same question
 * without any of that, and lets the document render normally on a machine where
 * WebGL is unavailable or blocklisted.
 */

/**
 * Asks the browser for a WebGL2 context and immediately gives it back.
 *
 * Probing rather than trusting a user-agent string or a stored preference: the
 * context request is the only thing that reflects the actual driver, and
 * browsers cap the number of live contexts, so the probe context is released
 * again with loseContext() straight away.
 *
 * Returns false rather than throwing when there is no document, which is the
 * case under server-side rendering or in a test environment.
 */
export function isWebGLAvailable(): boolean {
  if (typeof document === 'undefined') return false

  let canvas: HTMLCanvasElement
  try {
    canvas = document.createElement('canvas')
  } catch {
    return false
  }

  let context: WebGL2RenderingContext | null = null
  try {
    context = canvas.getContext('webgl2')
  } catch {
    // Some browsers throw rather than returning null when WebGL is disabled.
    return false
  }

  if (!context) return false

  // Release the probe context immediately; browsers cap concurrent contexts and
  // this one is never going to be drawn to.
  context.getExtension('WEBGL_lose_context')?.loseContext()
  return true
}