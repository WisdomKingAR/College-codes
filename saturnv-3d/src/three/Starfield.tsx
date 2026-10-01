/**
 * Three parallax star layers.
 *
 * Each layer sits at a different radius and drifts by a different amount of the
 * scroll velocity, which is what produces the sense of depth as the camera
 * moves. Positions are seeded once with a deterministic PRNG so the field does
 * not reshuffle between renders or between reloads.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Object3D } from 'three'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color } from 'three'
import { sceneState } from '@/lib/scroll-state'

interface Layer {
  count: number
  radius: number
  drift: number
  size: number
  opacity: number
}

const LAYERS: Layer[] = [
  { count: 900, radius: 260, drift: 0.4, size: 1.1, opacity: 0.55 },
  { count: 600, radius: 420, drift: 0.9, size: 1.6, opacity: 0.4 },
  { count: 320, radius: 620, drift: 1.6, size: 2.4, opacity: 0.26 },
]

/** Deterministic PRNG (mulberry32) so the star field is stable across mounts. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildLayer(layer: Layer, seed: number) {
  const random = mulberry32(seed)
  const positions = new Float32Array(layer.count * 3)
  const colors = new Float32Array(layer.count * 3)

  // Slight colour spread, from cool blue-white to warm, keeps the field from
  // looking like uniform white noise.
  const tint = new Color()

  for (let i = 0; i < layer.count; i++) {
    // Uniform-ish distribution on a sphere shell.
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    const r = layer.radius * (0.85 + random() * 0.3)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi)
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    const warmth = random()
    tint.setHSL(warmth < 0.75 ? 0.58 : 0.08, 0.25 + random() * 0.3, 0.72 + random() * 0.28)
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  return geometry
}

export function Starfield() {
  const layers = useMemo(
    () => LAYERS.map((layer, i) => ({ layer, geometry: buildLayer(layer, 1337 + i * 91) })),
    [],
  )
  const refs = useRef<Array<Object3D | null>>([])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    layers.forEach(({ layer }, i) => {
      const points = refs.current[i]
      if (!points) return

      // Scroll velocity is signed, so the field pushes forward under a fast
      // flick and settles back when scrolling stops.
      const push = -sceneState.velocity * layer.drift * 0.0006
      points.position.y += (push - points.position.y) * Math.min(1, dt * 2.4)

      if (!sceneState.reducedMotion) {
        points.rotation.y += dt * 0.004 * layer.drift
      }
    })
  })

  return (
    <group>
      {layers.map(({ layer, geometry }, i) => (
        <points
          key={i}
          ref={(node) => {
            refs.current[i] = node
          }}
          geometry={geometry}
          frustumCulled={false}
        >
          <pointsMaterial
            size={layer.size}
            sizeAttenuation
            vertexColors
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      ))}
    </group>
  )
}