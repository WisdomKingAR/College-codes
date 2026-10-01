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
      // nothing advances it unless something calls raf() every frame; GSAP's
      // ticker already drives ScrollTrigger and the R3F render loop, and two
      // competing rAF loops is the usual source of scroll jitter. Registered
      // inside this context so it is torn down with the rest.
      const lenis = lenisRef.current?.lenis
      const update = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(0)

      // Lenis wraps the native scroll position rather than replacing it, so
      // ScrollTrigger needs to be nudged on Lenis's own scroll event to stay in
      // step. on() returns the unsubscribe function it is given below.
      const unsubscribe = lenis?.on('scroll', ScrollTrigger.update)

      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
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

      // The camera trails the content slightly so the move feels weighted
      // rather than locked 1:1 to the scrollbar.
      gsap.to(sceneState, {
        cameraT: 1,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
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

  const scrollToPart = useCallback((id: PartId) => {
    const section = document.getElementById(`part-${id}`)
    if (!section) return
    // Jump to the middle of the section so the part is framed rather than
    // clipped at the top of the viewport.
    const top = section.offsetTop
    lenisRef.current?.lenis?.scrollTo(top + section.offsetHeight * 0.12)
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
      <ReactLenis
        root
        options={{
          autoRaf: false,
          duration: reducedMotion ? 0.01 : 1.15,
          smoothWheel: !reducedMotion,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        }}
        ref={lenisRef}
      >
        <a
          href="#part-les"
          className="telemetry sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-nasa focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to the breakdown
        </a>

        {webgl && !sceneFailed ? (
          <WebGLBoundary>
            <Suspense fallback={null}>
              <Scene
                onLoaded={() => setReady(true)}
                onError={() => setSceneFailed(true)}
                className="fixed inset-0 z-0 h-screen w-full"
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