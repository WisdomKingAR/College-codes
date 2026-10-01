/**
 * The vehicle, split into independently animated parts.
 *
 * The GLB is cloned once on mount and every material is cloned per part, so
 * fading one stage cannot bleed into another: the source file shares one
 * material across many meshes, and mutating a shared material would dim the
 * whole rocket at once.
 */
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { Material, MeshStandardMaterial, Object3D } from 'three'
import { Color } from 'three'
import { PART_CENTER, SCROLL_PART_ORDER, VEHICLE_Y_OFFSET, type PartId } from '@/data/parts'
import { sceneState } from '@/lib/scroll-state'

const MODEL_URL = '/models/SaturnV-parts.glb'
const DIMMED_OPACITY = 0.14
const SEPARATION = 0.3

/**
 * Rim colour for the active stage. GLTF materials load with a black emissive,
 * so intensity alone would be invisible; the colour itself has to be driven.
 */
const HIGHLIGHT = new Color('#fc3d21')
const NO_HIGHLIGHT = new Color('#000000')
const emissiveTarget = new Color()

interface PartNode {
  id: PartId
  object: Object3D
  materials: MeshStandardMaterial[]
}

export function Vehicle({ onLoaded }: { onLoaded?: () => void }) {
  const { scene } = useGLTF(MODEL_URL)
  const notifiedRef = useRef(false)

  // Deep clone so the cached GLTF scene is never mutated, then take private
  // material copies for every part. The part list is returned alongside the
  // root and captured directly by useFrame, rather than parked in a ref that
  // would have to be written during render.
  const { root, parts } = useMemo(() => {
    const cloned = scene.clone(true)
    const found: PartNode[] = []

    cloned.traverse((object) => {
      if (!object.name.startsWith('part_')) return
      const id = object.name.slice('part_'.length) as PartId
      const materials: MeshStandardMaterial[] = []

      object.traverse((child) => {
        const mesh = child as Object3D & { isMesh?: boolean; material?: Material | Material[] }
        if (!mesh.isMesh || !mesh.material) return
        const clonedMaterial = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.clone())
          : mesh.material.clone()
        mesh.material = clonedMaterial
        for (const m of Array.isArray(clonedMaterial) ? clonedMaterial : [clonedMaterial]) {
          materials.push(m as MeshStandardMaterial)
        }
      })

      found.push({ id, object, materials })
    })

    return { root: cloned, parts: found }
  }, [scene])

  useLayoutEffect(() => {
    if (notifiedRef.current) return
    notifiedRef.current = true
    onLoaded?.()
  }, [onLoaded])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const activeId =
      sceneState.activeIndex >= 0 ? SCROLL_PART_ORDER[sceneState.activeIndex] : null
    const reveal = sceneState.reveal
    const still = sceneState.reducedMotion

    for (const part of parts) {
      const isActive = part.id === activeId
      const activeCentre = activeId ? PART_CENTER[activeId][1] : 0

      // Exploded view: every part slides away from the active one along the
      // vehicle axis, which keeps the active part framed and reads as the
      // stack coming apart around it.
      const targetY =
        !still && activeId ? (PART_CENTER[part.id][1] - activeCentre) * SEPARATION * reveal : 0
      part.object.position.y += (targetY - part.object.position.y) * Math.min(1, dt * 5)

      const targetOpacity = !activeId || isActive ? 1 : DIMMED_OPACITY
      const targetHighlight = isActive ? 1 : 0
      emissiveTarget.copy(NO_HIGHLIGHT).lerp(HIGHLIGHT, targetHighlight)

      for (const material of part.materials) {
        const needsTransparency = targetOpacity < 1
        if (material.transparent !== needsTransparency) {
          material.transparent = needsTransparency
          material.needsUpdate = true
        }
        material.opacity += (targetOpacity - material.opacity) * Math.min(1, dt * 5)
        if (material.emissive) {
          material.emissive.lerp(emissiveTarget, Math.min(1, dt * 4))
        }
      }
    }
  })

  return (
    <group position={[0, VEHICLE_Y_OFFSET, 0]}>
      <primitive object={root} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)