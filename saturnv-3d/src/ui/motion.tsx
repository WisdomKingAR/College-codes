/**
 * Reduced-motion aware wrappers around the vendored React Bits components.
 *
 * Those components animate with GSAP and motion, driven from JavaScript, so the
 * `prefers-reduced-motion` block in index.css does not reach them: it collapses
 * CSS transitions and animations, and none of these use either. Left alone they
 * would scramble, float and count up for someone who has asked for none of it.
 *
 * Each wrapper renders the component's finished state as plain markup when the
 * preference is set. Wrapping rather than editing the vendored files keeps them
 * replaceable by the shadcn CLI, and keeps the preference in one place instead of
 * threaded through every call site.
 */
import { createContext, useContext, type ReactNode } from 'react'
import AnimatedContent from '@/components/AnimatedContent'
import CountUp from '@/components/CountUp'
import DecryptedText from '@/components/DecryptedText'
import ScrollFloat from '@/components/ScrollFloat'
import SplitText from '@/components/SplitText'

const ReducedMotionContext = createContext(false)

export function ReducedMotionProvider({
  reduced,
  children,
}: {
  reduced: boolean
  children: ReactNode
}) {
  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>
}

/**
 * Not exported: this module is all components, and a mixed export would defeat
 * fast refresh. App needs the preference for Lenis and the 3D layer, and passes
 * it in through the provider rather than reaching for the hook.
 */
function useReducedMotionPref(): boolean {
  return useContext(ReducedMotionContext)
}

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'

/** SplitText: the heading simply appears, already in its final position. */
export function SplitHeading({
  text,
  tag: Tag = 'p',
  className,
}: {
  text: string
  tag?: Tag
  className?: string
}) {
  const reduced = useReducedMotionPref()
  if (reduced) return <Tag className={className}>{text}</Tag>
  return (
    <SplitText
      tag={Tag}
      text={text}
      className={className}
      splitType="chars"
      from={{ yPercent: 110, opacity: 0, rotateX: -70 }}
      to={{ yPercent: 0, opacity: 1, rotateX: 0 }}
      duration={1.1}
      ease="expo.out"
      delay={0.15}
      threshold={0.05}
    />
  )
}

/** AnimatedContent: copy is present from the start rather than sliding in. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotionPref()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <AnimatedContent distance={44} direction="vertical" duration={0.7} ease="power3.out" className={className}>
      {children}
    </AnimatedContent>
  )
}

/** ScrollFloat: the closing statement sits still. */
export function FloatIn({
  children,
  containerClassName,
}: {
  children: ReactNode
  containerClassName?: string
}) {
  const reduced = useReducedMotionPref()
  if (reduced) return <div className={containerClassName}>{children}</div>
  return (
    <ScrollFloat animationDuration={1} ease="power3.out" containerClassName={containerClassName}>
      {children}
    </ScrollFloat>
  )
}

/**
 * CountUp: the final figure is printed.
 *
 * Formatted with the same rules CountUp uses internally, so the static and
 * animated versions do not disagree — "2,970" stays grouped, "34" stays whole.
 */
export function Tally({
  to,
  separator = '',
}: {
  to: number
  separator?: string
}) {
  const reduced = useReducedMotionPref()
  if (reduced) {
    return <>{new Intl.NumberFormat('en-US', { useGrouping: !!separator }).format(to)}</>
  }
  return <CountUp to={to} duration={1.6} separator={separator} />
}

/** DecryptedText: the label reads as plain text rather than scrambling. */
export function Scramble({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const reduced = useReducedMotionPref()
  if (reduced) return <span className={className}>{text}</span>
  return (
    <DecryptedText
      text={text}
      className={className}
      animateOn="view"
      speed={60}
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/"
    />
  )
}