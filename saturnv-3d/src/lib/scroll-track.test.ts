import { describe, expect, it } from 'vitest'
import { SCROLL_PART_ORDER } from '@/data/parts'
import {
  SECTION_COUNT,
  indexForProgress,
  revealForProgress,
  sectionForProgress,
  velocityFor,
} from '@/lib/scroll-track'

/** Progress at the very start of section n. */
function progressOfSection(section: number) {
  return section / SECTION_COUNT
}

describe('sectionForProgress', () => {
  it('counts a hero section, one per part, and an outro', () => {
    expect(SECTION_COUNT).toBe(SCROLL_PART_ORDER.length + 2)
    expect(SECTION_COUNT).toBe(10)
  })

  it('maps the start of the track to the hero', () => {
    expect(sectionForProgress(0)).toBe(0)
  })

  it('maps the end of the track to the outro rather than past it', () => {
    // Progress of exactly 1 is the far edge of the last section. Without the
    // clamp this would floor to SECTION_COUNT, one section beyond the outro.
    expect(sectionForProgress(1)).toBe(SECTION_COUNT - 1)
  })

  it('assigns each part section a distinct index', () => {
    const seen = new Set<number>()
    for (let s = 0; s < SECTION_COUNT; s++) {
      seen.add(sectionForProgress(progressOfSection(s) + 0.001))
    }
    expect(seen.size).toBe(SECTION_COUNT)
  })

  it('clamps out-of-range progress instead of returning nonsense', () => {
    expect(sectionForProgress(-3)).toBe(0)
    expect(sectionForProgress(4)).toBe(SECTION_COUNT - 1)
  })
})

describe('indexForProgress', () => {
  it('reports no active part in the hero', () => {
    expect(indexForProgress(0)).toBe(-1)
    expect(indexForProgress(progressOfSection(1) - 0.001)).toBe(-1)
  })

  it('reports no active part in the outro', () => {
    expect(indexForProgress(1)).toBe(-1)
    expect(indexForProgress(progressOfSection(SECTION_COUNT - 1) + 0.001)).toBe(-1)
  })

  it('walks the parts in scroll order, top of the stack downwards', () => {
    SCROLL_PART_ORDER.forEach((id, i) => {
      const section = i + 1
      const mid = progressOfSection(section) + 0.5 / SECTION_COUNT
      expect(indexForProgress(mid)).toBe(i)
      expect(SCROLL_PART_ORDER[indexForProgress(mid)]).toBe(id)
    })
  })

  it('never exceeds the part list at any point on the track', () => {
    for (let p = 0; p <= 1.0001; p += 0.002) {
      const index = indexForProgress(p)
      expect(index === -1 || (index >= 0 && index < SCROLL_PART_ORDER.length)).toBe(true)
    }
  })
})

describe('revealForProgress', () => {
  it('is zero in the hero and the outro, where nothing is active', () => {
    expect(revealForProgress(0)).toBe(0)
    expect(revealForProgress(0.05)).toBe(0)
    expect(revealForProgress(0.99)).toBe(0)
    expect(revealForProgress(1)).toBe(0)
  })

  it('peaks in the middle of each part section', () => {
    SCROLL_PART_ORDER.forEach((_id, i) => {
      const mid = progressOfSection(i + 1) + 0.5 / SECTION_COUNT
      expect(revealForProgress(mid)).toBeCloseTo(1, 5)
    })
  })

  it('is still assembled at the start and end of a section', () => {
    SCROLL_PART_ORDER.forEach((_id, i) => {
      const start = progressOfSection(i + 1) + 0.01 / SECTION_COUNT
      const end = progressOfSection(i + 1) + 0.99 / SECTION_COUNT
      expect(revealForProgress(start)).toBe(0)
      expect(revealForProgress(end)).toBe(0)
    })
  })

  it('is continuous across section boundaries, so the stack never snaps', () => {
    // The active part changes exactly on a boundary. If reveal jumped between
    // the two sides of one, the whole stack would rearrange in a single frame.
    for (let s = 1; s < SECTION_COUNT; s++) {
      const edge = progressOfSection(s)
      const before = revealForProgress(edge - 1e-6)
      const after = revealForProgress(edge + 1e-6)
      expect(Math.abs(after - before)).toBeLessThan(0.01)
    }
  })

  it('rises and then falls symmetrically about the middle of a section', () => {
    const base = progressOfSection(3)
    const at = (local: number) => revealForProgress(base + local / SECTION_COUNT)
    expect(at(0.2)).toBeCloseTo(at(0.8), 6)
    expect(at(0.35)).toBeCloseTo(at(0.65), 6)
    expect(at(0.5)).toBeGreaterThan(at(0.35))
  })

  it('stays within 0..1 everywhere on the track', () => {
    for (let p = 0; p <= 1.0001; p += 0.002) {
      const reveal = revealForProgress(p)
      expect(reveal).toBeGreaterThanOrEqual(0)
      expect(reveal).toBeLessThanOrEqual(1)
    }
  })

  it('rises monotonically up to the middle of a section', () => {
    const base = progressOfSection(2)
    const samples = [0.2, 0.3, 0.4, 0.5].map((f) => revealForProgress(base + f / SECTION_COUNT))
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1])
    }
  })

  it('falls monotonically from the middle to the end of a section', () => {
    const base = progressOfSection(2)
    const samples = [0.5, 0.6, 0.7, 0.8].map((f) => revealForProgress(base + f / SECTION_COUNT))
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]).toBeLessThanOrEqual(samples[i - 1])
    }
  })
})

describe('velocityFor', () => {
  it('passes ordinary scrolling through unscaled', () => {
    expect(velocityFor(1200)).toBe(1200)
    expect(velocityFor(-900)).toBe(-900)
  })

  it('clips the spike produced by a programmatic jump', () => {
    expect(velocityFor(250000)).toBe(8000)
    expect(velocityFor(-250000)).toBe(-8000)
  })

  it('collapses non-finite input to zero', () => {
    expect(velocityFor(Number.NaN)).toBe(0)
    expect(velocityFor(Number.POSITIVE_INFINITY)).toBe(0)
  })
})