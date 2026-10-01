import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SCROLL_PART_ORDER, VEHICLE_HEIGHT_M, type PartId } from '@/data/parts'
import { onActivePartChange, sceneState, setActiveIndex } from '@/lib/scroll-state'
import { Scene } from '@/three/Scene'
import { Grain } from '@/ui/Grain'
import { Hero } from '@/ui/Hero'
import { PartNav } from '@/ui/PartNav'
import { PartSection } from '@/ui/PartSection'
import { StatsOutro } from '@/ui/StatsOutro'
import { WebGLBoundary } from '@/ui/WebGLBoundary'
import { TooltipProvider } from '@/components/ui/tooltip'

gsap.registerPlugin(ScrollTrigger)

/** hero + one section per part + the outro */
const TOTAL_SECTIONS = SCROLL_PART_ORDER.length + 2

/** Maps overall scroll progress onto the active part, or -1 for hero/outro. */
function indexForProgress(progress: number) {
  const section = Math.floor(progress * TOTAL_SECTIONS)
  const index = section - 1
  // Sections 0 (hero) and the last one (outro) have no active part.
  return index < 0 || index >= SCROLL_PART_ORDER.length ? -1 : index
}

export default function App() {
  const trackRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<{ scrollTo: (target: string | number, options?: object) => void } | null>(
    null,
  )
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState<PartId | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    sceneState.reducedMotion = reducedMotion
  }, [reducedMotion])

  // Keep React in step with the active part. setActiveIndex fires listeners only
  // when the index actually changes, so this does not re-render per frame.
  useEffect(() => onActivePartChange(setActive), [])

  useEffect(() => {
    const boot = document.getElementById('boot')
    if (ready && boot) boot.remove()
  }, [ready])

  // One ScrollTrigger owns the whole page: it writes scroll progress and the
  // camera parameter into sceneState, which the Canvas reads in useFrame.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          sceneState.progress = self.progress
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
    lenisRef.current?.scrollTo(top + section.offsetHeight * 0.12)
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
        ref={(instance) => {
          lenisRef.current = instance as unknown as typeof lenisRef.current
        }}
      >
        <a
          href="#part-les"
          className="telemetry sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-nasa focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to the breakdown
        </a>

        <WebGLBoundary>
          <Scene
            onLoaded={() => setReady(true)}
            className="fixed inset-0 z-0 h-screen w-full"
          />
        </WebGLBoundary>

        <Grain />

        <PartNav active={active} onSelect={scrollToPart} />

        <div ref={trackRef} className="scroll-track">
          <Hero />
          {SCROLL_PART_ORDER.map((id, index) => (
            <PartSection key={id} id={id} index={index} active={active === id} />
          ))}
          <StatsOutro />
        </div>

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