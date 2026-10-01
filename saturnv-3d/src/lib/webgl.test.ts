import { describe, expect, it } from 'vitest'
import { isWebGLAvailable } from '@/lib/webgl'

/**
 * These run in the default node environment, where there is no document. That is
 * itself the case worth pinning down: the probe must report "unavailable"
 * rather than throwing when it is reached during server-side rendering or in a
 * test, since every caller uses the result to decide whether to mount a canvas.
 */
describe('isWebGLAvailable', () => {
  it('reports unavailable when there is no document', () => {
    expect(typeof document).toBe('undefined')
    expect(isWebGLAvailable()).toBe(false)
  })

  it('does not throw when it cannot check', () => {
    expect(() => isWebGLAvailable()).not.toThrow()
  })
})