/**
 * Mapping between scroll progress and the track's section layout.
 *
 * The document is a stack of full-height sections: the hero, one per part, then
 * the outro. Progress is a single float across the whole track, so every
 * consumer that needs to know "which part are we on" derives it from here
 * instead of doing its own arithmetic. That keeps the nav highlight and the
 * exploded view from drifting apart, which is the failure mode when two places
 * each assume the section count.
 */
import { SCROLL_PART_ORDER } from '@/data/parts'

/** Number of full-screen equivalents the hero section occupies in scroll space. */
export const HERO_SCREENS = 2

/** hero (2 screens) + one section per part + the outro (1 screen) */
export const SECTION_COUNT = SCROLL_PART_ORDER.length + 1 + HERO_SCREENS

/**
 * Fraction of a section at each end that stays fully assembled, leaving the
 * middle half to carry the separation.
 */
const REVEAL_INSET = 0.15

/**
 * Ceiling on scroll velocity, in pixels per second. A nav-rail jump is reported
 * by ScrollTrigger as an enormous instantaneous velocity, and Starfield's
 * parallax multiplier is tuned for hand-scrolling, so the spike is clipped
 * rather than passed through.
 */
const VELOCITY_LIMIT = 8000

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

/**
 * Which section contains `progress`: 0 and 1 are the hero, the last is the outro.
 * Clamped at the top because progress of exactly 1 is the end of the last
 * section, not the start of one past it.
 */
export function sectionForProgress(progress: number): number {
  return Math.min(Math.floor(clamp01(progress) * SECTION_COUNT), SECTION_COUNT - 1)
}

/** How far through its own section `progress` sits, 0..1. */
function localForProgress(progress: number): number {
  const p = clamp01(progress)
  return p >= 1 ? 1 : (p * SECTION_COUNT) % 1
}

/** Maps overall scroll progress onto the active part, or -1 for hero/outro. */
export function indexForProgress(progress: number): number {
  // First HERO_SCREENS sections are the hero, so the first part section is section HERO_SCREENS.
  const index = sectionForProgress(progress) - HERO_SCREENS
  return index < 0 || index >= SCROLL_PART_ORDER.length ? -1 : index
}

/**
 * Separation amount for the active part's exploded view.
 *
 * A symmetric window over each part's own section: assembled on arrival, fully
 * apart while the panel is centred, reassembled before the next part takes over.
 * Symmetry matters more than it looks — an asymmetric ramp would leave the stack
 * exploded right up to the section boundary and then snap shut, and the active
 * part changes at exactly that boundary, so the whole stack would rearrange in a
 * single frame. Zero at both ends also makes the value continuous across the
 * whole track.
 *
 * The hero and outro always report zero, since nothing is active to separate.
 */
export function revealForProgress(progress: number): number {
  const index = sectionForProgress(progress) - HERO_SCREENS
  if (index < 0 || index >= SCROLL_PART_ORDER.length) return 0

  const local = localForProgress(progress)
  const t = (local - REVEAL_INSET) / (1 - REVEAL_INSET * 2)
  if (t <= 0 || t >= 1) return 0

  // Raised half-sine: zero with zero slope at the edges, one at the centre.
  return smoothstep(Math.sin(Math.PI * t))
}

/**
 * Scroll velocity in pixels per second, clipped to a range the parallax layers
 * can absorb. Deliberately not normalised: Starfield carries its own scale
 * factor, so the value stays in the unit ScrollTrigger reports.
 */
export function velocityFor(rawVelocity: number): number {
  if (!Number.isFinite(rawVelocity)) return 0
  return Math.min(Math.max(rawVelocity, -VELOCITY_LIMIT), VELOCITY_LIMIT)
}