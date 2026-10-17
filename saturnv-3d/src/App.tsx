import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SCROLL_PART_ORDER, VEHICLE_HEIGHT_M, type PartId } from '@/data/parts'
import { onActivePartChange, sceneState, setActiveIndex } from '@/lib/scroll-state'
import {
  indexForProgress,
  revealForProgress,
  velocityFor,
} from '@/lib/scroll-track'
import { isWebGLAvailable } from '@/lib/webgl'
import { Grain } from '@/ui/Grain'
import { Hero } from '@/ui/Hero'
import { PartNav } from '@/ui/PartNav'
import { PartSection } from '@/ui/PartSection'
import { StatsOutro } from '@/ui/StatsOutro'
import { FallbackList, WebGLBoundary } from '@/ui/WebGLBoundary'
import { ReducedMotionProvider } from '@/ui/motion'
import { TooltipProvider } from '@/components/ui/tooltip'

gsap.registerPlugin(ScrollTrigger)

/**
 * The 3D layer is deferred so the document's copy paints immediately. three.js
 * and the GLB together are the bulk of the download, and the text is the part
 * that has to be readable first — the canvas is fixed behind it either way, so
 * there is nothing lost by loading it after first paint.
 */
const Scene = lazy(() =>
  import('@/three/Scene').then((module) => ({ default: module.Scene })),
)

/**
 * The drawer is deferred for the same reason, and it matters more: Radix's dialog
 * is sizeable, and it is only ever reachable below the md breakpoint.
 */
const PartNavMobile = lazy(() =>
  import('@/ui/PartNavMobile').then((module) => ({ default: module.PartNavMobile })),
)

export default function App() {
  const trackRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<LenisRef>(null)
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState<PartId | null>(null)
  const [ready, setReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  // Asked once at mount: a browser with no WebGL should render the text
  // breakdown without first trying, and failing, to create a context.
  const [webgl] = useState(isWebGLAvailable)

  // The boot overlay must come off even when the 3D never arrives, or the page
  // stays behind a loading screen forever.
  useEffect(() => {
    const boot = document.getElementById('boot')
    if ((ready || sceneFailed || !webgl) && boot) boot.remove()
  }, [ready, sceneFailed, webgl])

  // All three of those flags come from the lazy chunk, so a chunk that never
  // resolves — a dropped connection, a stale cached build, a proxy that eats it —
  // leaves every one of them false and the overlay sitting over copy that is
  // perfectly readable on its own. This is the backstop for the case the other
  // effect cannot observe.
  useEffect(() => {
    if (ready || sceneFailed || !webgl) return
    const timer = window.setTimeout(() => document.getElementById('boot')?.remove(), 6000)
    return () => window.clearTimeout(timer)
  }, [ready, sceneFailed, webgl])

  useEffect(() => {
    sceneState.reducedMotion = reducedMotion
  }, [reducedMotion])

  // Keep React in step with the active part. setActiveIndex fires listeners only
  // when the index actually changes, so this does not re-render per frame.
  useEffect(() => onActivePartChange(setActive), [])

  // One ScrollTrigger owns the whole page: it writes scroll progress and the
  // camera parameter into sceneState, which the Canvas reads in useFrame.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const context = gsap.context(() => {
      // One clock for the whole site. Lenis is configured with autoRaf:false, so
      // nothing advances it unless something calls raf() every frame, and GSAP's
      // ticker has to run for ScrollTrigger regardless. Driving Lenis from it
      // keeps both on the same clock. Registered inside this context so it is
      // torn down with the rest.
      const lenis = lenisRef.current?.lenis

      // That clock has to be safe to hand over. Lenis's raf() advances its
      // animation clock by whatever delta it is given and clamps nothing, and
      // `lagSmoothing(0)` — which used to be set here — switches GSAP's own guard
      // off wholesale ("zero should be interpreted as basically unlimited"). So a
      // single long frame used to arrive as one enormous step: with an ease-out
      // over 0.85s, a 250 ms stall is ~87% of the remaining distance, which is
      // the leap that reads as harsh scrolling. So GSAP's default guard goes back
      // (500 ms threshold, 33 ms of borrowed time) *and* the clock handed to
      // Lenis never advances by more than one frame-cap, which absorbs a stall
      // rather than jumping on it. 50 ms is the 20 fps floor — below that the
      // frame drop is visible whatever happens here.
      gsap.ticker.lagSmoothing(500, 33)
      const MAX_FRAME_MS = 50
      let virtualTime = 0
      const update = (_time: number, deltaTime: number) => {
        virtualTime += Math.min(deltaTime, MAX_FRAME_MS)
        lenis?.raf(virtualTime)
      }
      gsap.ticker.add(update)

      // Lenis wraps the native scroll position rather than replacing it, so
      // ScrollTrigger needs to be nudged on Lenis's own scroll event to stay in
      // step. on() returns the unsubscribe function it is given below.
      const unsubscribe = lenis?.on('scroll', ScrollTrigger.update)

      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        // scrub: true, not a lagging number. Lenis is already the one smoother;
        // a second, slower smoother on top of it means the 3D and the copy
        // travel the same distance on different curves and visibly drift apart.
        scrub: true,
        onUpdate: (self) => {
          sceneState.progress = self.progress
          // Both of these are read every frame inside the Canvas, so they are
          // written here rather than pushed through React state.
          sceneState.reveal = revealForProgress(self.progress)
          sceneState.velocity = velocityFor(self.getVelocity())
          setActiveIndex(indexForProgress(self.progress))
        },
      })

      // Measured off the hero rather than derived from innerHeight. The section is
      // sized in svh so it keeps one height while the mobile URL bar shows and
      // hides, which means innerHeight — the *largest* of the three viewport
      // heights — is not the section's height, and a trigger built from it would
      // scrub against an element it no longer matches. Re-read on every
      // ScrollTrigger.refresh().
      const heroHeight = () => document.getElementById('top')?.offsetHeight ?? window.innerHeight * 2

      // Hero exit progress: across the back half of the hero's two screens.
      ScrollTrigger.create({
        trigger: track,
        start: () => `top+=${heroHeight() * 0.2} top`,
        end: () => `top+=${heroHeight()} top`,
        scrub: true,
        onUpdate: (self) => {
          sceneState.heroProgress = self.progress
        },
      })

      // The camera holds at the top-down view during the hero section (Phase 0 and Phase 1),
      // and begins its arc into the 3D breakdown once the hero has exited.
      gsap.to(sceneState, {
        cameraT: 1,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: track,
          start: () => `top+=${heroHeight() * 0.75} top`,
          end: 'bottom bottom',
          scrub: true,
        },
      })

      return () => {
        gsap.ticker.remove(update)
        unsubscribe?.()
      }
    }, track)

    ScrollTrigger.refresh()

    return () => {
      context.revert()
      context.kill()
    }
  }, [])

  const scrollToPart = useCallback(
    (id: PartId) => {
      const section = document.getElementById(`part-${id}`)
      if (!section) return
      // offsetTop resolves against the nearest *positioned* ancestor, which here
      // is .scroll-track rather than the document — so it is only correct today
      // because every element above the track happens to be fixed, and one added
      // static sibling would silently break every jump in the nav. Measuring
      // against the viewport and adding the current scroll offset is correct
      // whatever the surrounding layout becomes.
      const top = section.getBoundingClientRect().top + window.scrollY
      lenisRef.current?.lenis?.scrollTo(top, { duration: reducedMotion ? 0 : 1.2 })
    },
    [reducedMotion],
  )

  return (
    <TooltipProvider delayDuration={200}>
      <ReactLenis
        root
        options={{
          autoRaf: false,
          // lerp, not duration+easing. Lenis restarts a duration-based animation
          // from its current value on every wheel event, so a continuous scroll
          // never escapes the easing curve's steep head — the page moves in fast
          // bursts and then creeps. lerp settles at one rate regardless
          // (damp(value, to, lerp * 60, deltaTime), so it is frame-rate
          // independent), which is the difference between "weighted" and "harsh".
          // 1 collapses to instant, which is the reduced-motion behaviour.
          lerp: reducedMotion ? 1 : 0.1,
          // Wheel smoothing is inertia the reader never asked for, and it is the one
          // remaining piece of scroll-jacking: below the preference the page should
          // move exactly as far as the reader moves it.
          smoothWheel: !reducedMotion,
          wheelMultiplier: 1.0,
        }}
        ref={lenisRef}
      >
        {/* A button, not an href="#fragment": a native fragment jump scrolls outside
            Lenis, which leaves Lenis's internal target stale so the page snaps
            back on the next wheel event. SCROLL_PART_ORDER is sorted top-down,
            so [0] is the first part rather than a hard-coded id that has to be
            kept in step with the data. */}
        <button
          type="button"
          onClick={() => scrollToPart(SCROLL_PART_ORDER[0])}
          className="telemetry sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:cursor-pointer focus:rounded-sm focus:bg-nasa focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to the breakdown
        </button>

        {webgl && !sceneFailed ? (
          <WebGLBoundary>
            <Suspense fallback={null}>
              <Scene
                onLoaded={() => setReady(true)}
                onError={() => setSceneFailed(true)}
                className="fixed inset-0 z-0 w-full"
              />
            </Suspense>
          </WebGLBoundary>
        ) : (
          <div className="relative z-10">
            <FallbackList />
          </div>
        )}

        <Grain />

        <ReducedMotionProvider reduced={reducedMotion}>
          <PartNav active={active} onSelect={scrollToPart} />
          <Suspense fallback={null}>
            <PartNavMobile active={active} onSelect={scrollToPart} />
          </Suspense>

          <div ref={trackRef} className="scroll-track">
            <Hero />
            {SCROLL_PART_ORDER.map((id, index) => (
              <PartSection key={id} id={id} index={index} active={active === id} />
            ))}
            <StatsOutro />
          </div>
        </ReducedMotionProvider>

        <footer className="relative z-10 border-t border-edge/60 bg-void/70 px-6 py-8 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="telemetry text-faint">
              {VEHICLE_HEIGHT_M} m · 2,970 t at lift-off · 34.0 MN thrust
            </p>
            <p className="telemetry text-faint">Model in the public domain via NASA 3D Resources</p>
          </div>
        </footer>
      </ReactLenis>
    </TooltipProvider>
  )
}