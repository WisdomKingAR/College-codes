/**
 * Lighting and postprocessing.
 *
 * There is no ground plane in space, so a shadow map buys nothing here. The
 * vehicle is lit instead by a warm key from the sun side, a cool rim to separate
 * the silhouette from the star field, and a very dim fill so the shadowed side
 * never goes fully black.
 *
 * The environment is built from Lightformers rather than a downloaded HDR, so
 * the site has no runtime dependency on a CDN and renders identically offline.
 */
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Environment, Lightformer } from '@react-three/drei'

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.14} color="#4d5f7d" />

      {/* Key: the sun, warm and high. */}
      <directionalLight position={[120, 90, 70]} intensity={3.1} color="#fff6e8" />
      <directionalLight position={[-90, 30, -60]} intensity={0.5} color="#8fb4ff" />

      {/* Rim: separates the white hull from the black background. */}
      <directionalLight position={[-40, -70, 120]} intensity={1.25} color="#9fc4ff" />

      <Environment resolution={256}>
        <Lightformer
          intensity={2.4}
          position={[6, 5, 4]}
          rotation-x={Math.PI / 2}
          scale={[10, 10, 1]}
          color="#fff4e4"
        />
        <Lightformer
          intensity={1.1}
          position={[-6, 2, -5]}
          rotation-y={Math.PI / 2}
          scale={[10, 10, 1]}
          color="#7fa8ff"
        />
        <Lightformer intensity={0.5} position={[0, -6, 0]} scale={[12, 12, 1]} color="#2b3550" />
      </Environment>
    </>
  )
}

export function Effects({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {/* Low intensity: enough for the sun-side highlights to bleed slightly,
          not enough to wash out the white hull. */}
      <Bloom intensity={0.42} luminanceThreshold={0.72} luminanceSmoothing={0.28} mipmapBlur />
      <Vignette offset={0.28} darkness={0.72} />
    </EffectComposer>
  )
}