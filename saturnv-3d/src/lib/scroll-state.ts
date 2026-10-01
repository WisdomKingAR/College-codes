/**
 * Scroll-driven scene state.
 *
 * A plain mutable object rather than React state, on purpose. Scroll fires
 * every animation frame; routing that through useState would re-render the whole
 * tree 60 times a second. GSAP's scrubbed timeline is the only writer and
 * `useFrame` inside the Canvas is the only reader.
 */
import type { PartId } from '@/data/parts'
import { SCROLL_PART_ORDER } from '@/data/parts'

export interface SceneState {
  /** 0..1 across the whole scroll track. */
  progress: number
  /** Index into SCROLL_PART_ORDER, or -1 during the hero/outro. */
  activeIndex: number
  /** 0..1 eased separation for the active part's exploded view. */
  reveal: number
  /** Camera path parameter; lags `progress` slightly for a weighted feel. */
  cameraT: number
  /** Signed scroll velocity, drives the parallax layers. */
  velocity: number
  reducedMotion: boolean
}

export const sceneState: SceneState = {
  progress: 0,
  activeIndex: -1,
  reveal: 0,
  cameraT: 0,
  velocity: 0,
  reducedMotion: false,
}

export function activePartId(): PartId | null {
  return sceneState.activeIndex >= 0 ? SCROLL_PART_ORDER[sceneState.activeIndex] : null
}

/**
 * Lets React components react to the active part without polling scene state on
 * every frame. Only the active index changes are published, not the float.
 */
const listeners = new Set<(id: PartId | null) => void>()

export function onActivePartChange(fn: (id: PartId | null) => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function setActiveIndex(index: number) {
  if (index === sceneState.activeIndex) return
  sceneState.activeIndex = index
  const id = activePartId()
  for (const fn of listeners) fn(id)
}