/**
 * Camera rig.
 *
 * Reads the interpolated path parameter from sceneState and applies it to the
 * camera every frame. Position and target are written into reusable vectors so
 * nothing allocates per frame, and the camera only ever writes to itself — the
 * vehicle transform stays entirely controlled by Vehicle.tsx.
 *
 * The sampled value is applied directly rather than eased toward. `cameraT` is
 * already smoothed upstream by Lenis and by ScrollTrigger (`scrub: true`); a
 * second exponential smoother here only added lag.
 */
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import { idleDrift, sampleCamera } from '@/lib/camera'
import { sceneState } from '@/lib/scroll-state'

const position = new Vector3()
const target = new Vector3()

export function CameraRig() {
  const camera = useThree((state) => state.camera)

  useFrame((state) => {
    const still = sceneState.reducedMotion
    // Reduced motion still gets the camera, but not its movement. Sampling the
    // path at the parameter the journey *ends* on and writing that straight in —
    // no idle drift — means nothing translates, dollies or refocuses as the page
    // scrolls, and the vehicle is held in its most arrived, most legible framing
    // rather than the thin top-down opening shot. Panels still change and the nav
    // still jumps, so the page does what it was built to do; it just stops moving
    // the viewer around.
    const fov = sampleCamera(still ? 1 : sceneState.cameraT, position, target)

    if (!still) {
      idleDrift(state.clock.elapsedTime, position, 0.7)
      idleDrift(state.clock.elapsedTime * 0.6, target, 0.25)
    }

    // Written straight in. `cameraT` is smoothed once, upstream, by Lenis and by
    // ScrollTrigger's `scrub: true`; the exponential smoothing that used to sit
    // here was a third smoother, and it meant the camera was always still
    // travelling to where the scrollbar already said it was — which is what made
    // the vehicle read as a layer separate from the copy beside it.
    camera.position.copy(position)
    camera.lookAt(target)

    const perspective = camera as PerspectiveCamera
    if (Math.abs(perspective.fov - fov) > 0.01) {
      perspective.fov = fov
      perspective.updateProjectionMatrix()
    }
  })

  return null
}