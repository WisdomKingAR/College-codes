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
  className?: string
}

export function Scene({ onLoaded, className }: SceneProps) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        camera={{ fov: 32, near: 0.5, far: 2000, position: [0, 173, 1] }}
        style={{ pointerEvents: 'none' }}
      >
        <color attach="background" args={['#04060a']} />
        <Suspense fallback={null}>
          <SceneContents onLoaded={onLoaded} />
        </Suspense>
      </Canvas>
    </div>
  )
}