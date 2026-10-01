/**
 * Camera path for the whole page.
 *
 * Keyframes are generated from the measured part geometry rather than typed in
 * by hand, so the camera always frames the real extent of whichever part it is
 * visiting. `sampleCamera` interpolates between the two keyframes bracketing the
 * current progress with a smoothstep, which is enough to feel continuous and
 * costs nothing per frame.
 */
import { Vector3 } from 'three'
import { PART_CENTER, PART_GEOMETRY, SCROLL_PART_ORDER } from '@/data/parts'

export interface CameraKey {
  progress: number
  position: Vector3
  target: Vector3
  fov: number
}

const scratchA = new Vector3()

/** Distance the camera sits from a target, scaled to that target's size. */
function distanceFor(size: number, base: number) {
  return base + size * 2.4
}

function buildKeyframes(): CameraKey[] {
  const keys: CameraKey[] = []

  // The vehicle is recentred on the origin by the model prep step, so the stack
  // spans roughly -55 to +55 in y.
  const halfHeight = 55

  // Act 0 — straight down the length of the vehicle from above.
  keys.push({
    progress: 0,
    position: new Vector3(0, halfHeight + 118, 0.8),
    target: new Vector3(0, 0, 0),
    fov: 32,
  })

  // Act 1 — arc down and around into a three-quarter view.
  keys.push({
    progress: 0.12,
    position: new Vector3(26, halfHeight + 96, 34),
    target: new Vector3(0, 6, 0),
    fov: 34,
  })
  keys.push({
    progress: 0.22,
    position: new Vector3(64, halfHeight + 46, 66),
    target: new Vector3(0, 16, 0),
    fov: 36,
  })

  // Act 2 — one keyframe per part, top of the stack downwards.
  const span = 0.62
  SCROLL_PART_ORDER.forEach((id, i) => {
    const t = i / (SCROLL_PART_ORDER.length - 1)
    const centre = new Vector3(...PART_CENTER[id])
    const footprint = Math.max(PART_GEOMETRY[id].size[0], PART_GEOMETRY[id].size[1])

    // A three-quarter angle that swings around as the camera descends, so the
    // vehicle is never viewed from the exact same side twice in a row.
    const angle = -0.5 + t * 1.5
    const dist = distanceFor(footprint, 26)

    keys.push({
      progress: 0.28 + t * span,
      position: new Vector3(
        Math.sin(angle) * dist * 1.15,
        centre.y + 9,
        Math.cos(angle) * dist * 1.15,
      ),
      target: centre,
      fov: 38,
    })
  })

  // Act 3 — pull back out for the stats outro.
  keys.push({
    progress: 1,
    position: new Vector3(96, 18, 118),
    target: new Vector3(0, -4, 0),
    fov: 40,
  })

  return keys
}

export const CAMERA_KEYS = buildKeyframes()

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

/**
 * Writes the interpolated camera into the supplied vectors to avoid allocating
 * on every frame.
 */
export function sampleCamera(progress: number, position: Vector3, target: Vector3) {
  const keys = CAMERA_KEYS
  const p = Math.min(Math.max(progress, 0), 1)

  let i = 0
  while (i < keys.length - 2 && keys[i + 1].progress < p) i++

  const a = keys[i]
  const b = keys[i + 1]
  const span = b.progress - a.progress
  const local = span <= 0 ? 0 : (p - a.progress) / span
  const t = smoothstep(Math.min(Math.max(local, 0), 1))

  position.lerpVectors(a.position, b.position, t)
  target.lerpVectors(a.target, b.target, t)

  return a.fov + (b.fov - a.fov) * t
}

/** Slow idle drift so a paused page still breathes. */
export function idleDrift(elapsed: number, target: Vector3, strength: number) {
  scratchA.set(Math.sin(elapsed * 0.18) * strength, Math.cos(elapsed * 0.13) * strength * 0.6, 0)
  target.add(scratchA)
}