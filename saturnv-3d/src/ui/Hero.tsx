import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SplitHeading } from '@/ui/motion'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const hero = heroRef.current
    const content = contentRef.current
    if (!hero || !content) return

    // The exit tween flies the copy 70vh up and out. That is scroll-jacked
    // translation, which is exactly what the preference is a request to be spared,
    // so the trigger is not created at all rather than created and neutralised.
    // The section is still two screens tall, so the scroll track's section
    // arithmetic is unchanged and the copy simply stays put as it passes.
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.to(content, {
        y: '-70vh',
        opacity: 0,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: hero,
          // Measured rather than assumed from innerHeight: the section is sized
          // in svh so it is stable on mobile, and the trigger has to agree with
          // the element it is attached to.
          start: () => `top+=${hero.offsetHeight * 0.2} top`,
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }, hero)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative h-[200svh] w-full"
    >
      <div
        ref={contentRef}
        className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center px-6 text-center will-change-transform"
      >
        <p className="telemetry mb-8 text-faint">
          National Aeronautics and Space Administration · Launch Vehicle
        </p>

        <SplitHeading
          tag="h1"
          text="SATURN V"
          className="text-[clamp(3rem,13vw,11rem)] leading-[0.85] font-semibold tracking-[-0.03em] text-chalk"
        />

        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          One hundred and ten metres of rocket, in eight sections. Scroll to take it apart from the
          escape tower down to the engines.
        </p>

        <div className="mt-14 flex items-center gap-3" aria-hidden="true">
          <span className="telemetry text-faint">Scroll</span>
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-nasa" />
        </div>
      </div>
    </section>
  )
}