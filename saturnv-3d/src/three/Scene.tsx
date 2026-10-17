/**
 * Scene contents and the Canvas wrapper.
 *
 * A single fixed, full-viewport canvas sits behind the scrolling document. It is
 * pointer-transparent by default and only becomes interactive where the UI asks
 * for it, so the page keeps normal link and text selection behaviour.
 */
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { Effects, Lighting } from './Lighting'
import { SceneBoundary } from './SceneBoundary'
import { Starfield } from './Starfield'
import { Vehicle } from './Vehicle'

function SceneContents({ onLoaded }: { onLoaded?: () => void }) {
  return (
    <>
      <CameraRig />
      <Lighting />
      <Starfield />
      <Vehicle onLoaded={onLoaded} />
      <Effects />
    </>
  )
}

interface SceneProps {
  onLoaded?: () => void
  onError?: (error: Error) => void
  className?: string
}

export function Scene({ onLoaded, onError, className }: SceneProps) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        // 1.5, not 2. At dpr 2 the composer renders four times the pixels of dpr 1,
        // and Bloom is the most expensive thing in the frame; the reference device
        // here (a mid-range laptop) spends that budget on the scroll instead. The
        // difference between 1.5 and 2 is not visible on the star field or the
        // flat-shaded hull, which is all this scene draws.
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        camera={{ fov: 32, near: 0.5, far: 2000, position: [0, 173, 1] }}
        style={{ pointerEvents: 'none' }}
      >
        <color attach="background" args={['#04060a']} />
        {/* The boundary is inside the canvas because R3F gives the scene its
            own React root; see SceneBoundary for why that matters. */}
        <SceneBoundary onError={onError}>
          <Suspense fallback={null}>
            <SceneContents onLoaded={onLoaded} />
          </Suspense>
        </SceneBoundary>
      </Canvas>
    </div>
  )
}