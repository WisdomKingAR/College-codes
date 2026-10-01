/**
 * Camera rig.
 *
 * Reads the interpolated path parameter from sceneState and applies it to the
 * camera every frame. Position and target are written into reusable vectors so
 * nothing allocates per frame, and the camera only ever writes to itself — the
 * vehicle transform stays entirely controlled by Vehicle.tsx.
 */
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import { idleDrift, sampleCamera } from '@/lib/camera'
import { sceneState } from '@/lib/scroll-state'

const position = new Vector3()
const target = new Vector3()
const smoothedTarget = new Vector3()

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const initialisedRef = useRef(false)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const fov = sampleCamera(sceneState.cameraT, position, target)

    if (!initialisedRef.current) {
      smoothedTarget.copy(target)
      initialisedRef.current = true
    }

    if (!sceneState.reducedMotion) {
      idleDrift(state.clock.elapsedTime, position, 0.7)
      idleDrift(state.clock.elapsedTime * 0.6, target, 0.25)
    }

    camera.position.lerp(position, Math.min(1, dt * 6))
    smoothedTarget.lerp(target, Math.min(1, dt * 4))
    camera.lookAt(smoothedTarget)

    const perspective = camera as PerspectiveCamera
    if (Math.abs(perspective.fov - fov) > 0.01) {
      perspective.fov += (fov - perspective.fov) * Math.min(1, dt * 4)
      perspective.updateProjectionMatrix()
    }
  })

  return null
}