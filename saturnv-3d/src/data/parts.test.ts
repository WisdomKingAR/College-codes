import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import geometryJson from '@/data/generated/geometry.json'
import {
  PARTS,
  PART_CENTER,
  PART_GEOMETRY,
  PART_TRIANGLES,
  SCROLL_PART_ORDER,
  VEHICLE_HEIGHT_M,
  VEHICLE_Y_OFFSET,
} from '@/data/parts'

/**
 * These guard the one thing that silently breaks the 3D: the centring offset.
 *
 * Vehicle.tsx translates the model by VEHICLE_Y_OFFSET, while PART_CENTER bakes
 * that same offset into the camera and explode targets. If the offset were ever
 * applied twice, or forgotten in one of the two places, every camera keyframe
 * would aim at empty space and the parts would fly away from each other — with
 * no type error and no console warning, only a wrong picture.
 */

interface GeometryPart {
  id: string
  from: number
  to: number
  tris: number
  bbox: { center: [number, number, number]; size: [number, number, number] }
}

// Read straight from the generated artefact rather than through parts.ts, so
// these assertions check what `npm run model:prepare` actually wrote.
const raw = geometryJson as unknown as { heightM: number; parts: GeometryPart[] }

describe('generated geometry', () => {
  it('covers every part in the content layer', () => {
    expect(raw.parts).toHaveLength(SCROLL_PART_ORDER.length)
    expect(raw.parts.map((p) => p.id).sort()).toEqual([...SCROLL_PART_ORDER].sort())
  })

  it('reports the same height the copy quotes', () => {
    expect(raw.heightM).toBe(VEHICLE_HEIGHT_M)
  })

  it('runs from the base of the vehicle to the tip of the tower', () => {
    const lowest = Math.min(...raw.parts.map((p) => p.from))
    const highest = Math.max(...raw.parts.map((p) => p.to))
    expect(lowest).toBeCloseTo(0, 1)
    expect(highest).toBeCloseTo(VEHICLE_HEIGHT_M, 1)
  })

  it('matches the published triangle budget', () => {
    const total = Object.values(PART_TRIANGLES).reduce((sum, n) => sum + n, 0)
    expect(total).toBe(34814)
  })

  it('gives every part a non-empty mesh', () => {
    for (const id of SCROLL_PART_ORDER) {
      expect(PART_TRIANGLES[id]).toBeGreaterThan(0)
      expect(PART_GEOMETRY[id].size[0]).toBeGreaterThan(0)
    }
  })
})

describe('centring offset', () => {
  it('is exactly half the height, so the stack straddles the origin', () => {
    expect(VEHICLE_Y_OFFSET).toBe(-VEHICLE_HEIGHT_M / 2)
  })

  it('centres the vehicle on the origin in scene space', () => {
    // Asserted on the bounding box rather than the part centres. The centres
    // are deliberately asymmetric: the S-IC is a fat 42 m stage sitting low and
    // the LES is a thin spike at the very tip, so the extremes do not mirror.
    // The stack as a whole is what has to straddle the origin.
    const lowest = Math.min(...raw.parts.map((p) => p.from)) + VEHICLE_Y_OFFSET
    const highest = Math.max(...raw.parts.map((p) => p.to)) + VEHICLE_Y_OFFSET
    expect(lowest).toBeCloseTo(-VEHICLE_HEIGHT_M / 2, 6)
    expect(highest).toBeCloseTo(VEHICLE_HEIGHT_M / 2, 6)

    // And the tips genuinely straddle it, so the camera orbits are symmetric.
    const centres = SCROLL_PART_ORDER.map((id) => PART_CENTER[id][1])
    expect(Math.min(...centres)).toBeLessThan(0)
    expect(Math.max(...centres)).toBeGreaterThan(0)
  })

  it('applies the offset to every part centre, exactly once', () => {
    for (const id of SCROLL_PART_ORDER) {
      const raw_ = raw.parts.find((p) => p.id === id)
      if (!raw_) throw new Error(`no generated geometry for ${id}`)
      expect(PART_CENTER[id][1]).toBeCloseTo(raw_.bbox.center[1] + VEHICLE_Y_OFFSET, 6)
    }
  })

  it('keeps the parts stacked in ascending height order', () => {
    const byHeight = [...SCROLL_PART_ORDER].sort((a, b) => PART_CENTER[a][1] - PART_CENTER[b][1])
    const expected = [...SCROLL_PART_ORDER].reverse()
    expect(byHeight).toEqual(expected)
  })
})

describe('content layer', () => {
  it('gives every part copy, specs and an order', () => {
    for (const part of PARTS) {
      expect(part.code.length).toBeGreaterThan(0)
      expect(part.name.length).toBeGreaterThan(0)
      expect(part.blurb.length).toBeGreaterThan(0)
      expect(part.specs.length).toBeGreaterThan(0)
      expect(Number.isFinite(part.order)).toBe(true)
    }
  })

  it('orders the parts from the tip downwards', () => {
    expect(SCROLL_PART_ORDER[0]).toBe('les')
    expect(SCROLL_PART_ORDER[SCROLL_PART_ORDER.length - 1]).toBe('sic')
  })

  it('does not repeat an order value', () => {
    const orders = PARTS.map((p) => p.order)
    expect(new Set(orders).size).toBe(orders.length)
  })
})

describe('scroll state', () => {
  it('starts with no active part and nothing revealed', async () => {
    const { sceneState, activePartId } = await import('@/lib/scroll-state')
    expect(sceneState.activeIndex).toBe(-1)
    expect(sceneState.reveal).toBe(0)
    expect(sceneState.velocity).toBe(0)
    expect(activePartId()).toBeNull()
  })

  it('resolves the active part id from the index', async () => {
    const { activePartId, setActiveIndex } = await import('@/lib/scroll-state')
    setActiveIndex(0)
    expect(activePartId()).toBe('les')
    setActiveIndex(-1)
    expect(activePartId()).toBeNull()
  })

  it('notifies listeners only when the index actually changes', async () => {
    const { sceneState, setActiveIndex, onActivePartChange } = await import('@/lib/scroll-state')
    let calls = 0
    const off = onActivePartChange(() => {
      calls++
    })
    setActiveIndex(3)
    setActiveIndex(3)
    setActiveIndex(4)
    off()
    setActiveIndex(5)
    expect(calls).toBe(2)
    expect(sceneState.activeIndex).toBe(5)
  })
})

describe('sampleCamera', () => {
  it('returns the opening keyframe at zero progress', async () => {
    const { sampleCamera } = await import('@/lib/camera')
    const position = new Vector3()
    const target = new Vector3()
    const fov = sampleCamera(0, position, target)
    expect(position.y).toBeGreaterThan(100)
    expect(fov).toBe(32)
  })

  it('clamps progress outside 0..1 to the two ends of the path', async () => {
    const { sampleCamera } = await import('@/lib/camera')
    const at = (p: number) => {
      const position = new Vector3()
      const target = new Vector3()
      sampleCamera(p, position, target)
      return { position, target }
    }
    // Not equal to each other: out of range pins to the first and last keyframe
    // respectively, which are different places.
    expect(at(-5).position.distanceTo(at(0).position)).toBeCloseTo(0, 6)
    expect(at(5).position.distanceTo(at(1).position)).toBeCloseTo(0, 6)
    expect(at(5).position.distanceTo(at(0).position)).toBeGreaterThan(1)
  })

  it('never leaves the frame and always produces a finite fov', async () => {
    const { sampleCamera } = await import('@/lib/camera')
    const position = new Vector3()
    const target = new Vector3()
    for (let p = 0; p <= 1.0001; p += 0.005) {
      const fov = sampleCamera(p, position, target)
      expect(Number.isFinite(position.x)).toBe(true)
      expect(Number.isFinite(target.y)).toBe(true)
      expect(fov).toBeGreaterThan(0)
      expect(fov).toBeLessThan(180)
    }
  })

  it('descends from the top of the stack to the bottom', async () => {
    const { sampleCamera } = await import('@/lib/camera')
    const position = new Vector3()
    const target = new Vector3()
    sampleCamera(0.3, position, target)
    const high = target.y
    sampleCamera(0.85, position, target)
    expect(target.y).toBeLessThan(high)
  })

  it('writes into the supplied vectors rather than replacing them', async () => {
    const { sampleCamera } = await import('@/lib/camera')
    const position = new Vector3(1, 2, 3)
    const target = new Vector3(4, 5, 6)
    const samePosition = position
    const sameTarget = target
    sampleCamera(0.5, position, target)
    // Identity matters as much as value here: this runs every frame, so a
    // replacement here would allocate 120 Vector3s a second.
    expect(samePosition).toBe(position)
    expect(sameTarget).toBe(target)
  })
})