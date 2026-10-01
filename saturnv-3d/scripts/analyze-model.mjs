/**
 * Radius-vs-height profile for the Saturn V GLB.
 *
 * The stage boundaries are not marked by node names in this model, so they have
 * to be found from geometry: a Saturn V steps down in diameter twice (S-IC+S-II
 * are 33 ft wide, S-IVB + IU + spacecraft are 21 ft 8 in). This walks the mesh
 * in thin Y bands and reports, per band, the dominant radius (and the spread),
 * which exposes the shoulders and the black interstage bands.
 *
 * Run: npm run model:profile
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NodeIO } from '@gltf-transform/core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const input = path.join(root, 'public/models/SaturnV-raw.glb')

const document = await new NodeIO().read(input)
const gltfRoot = document.getRoot()
const scene = gltfRoot.listScenes()[0]
const roots = scene ? scene.listChildren() : gltfRoot.listNodes()

// Collect every world-space vertex once.
const points = []
function collect(node) {
  if (!node) return
  const mesh = node.getMesh()
  if (mesh) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION')
      if (!pos) continue
      const size = pos.getElementSize()
      const arr = pos.getArray()
      for (let i = 0; i < pos.getCount(); i++) {
        const o = i * size
        points.push([arr[o], arr[o + 1], arr[o + 2]])
      }
    }
  }
  for (const child of node.listChildren()) collect(child)
}
for (const n of roots) collect(n)

const ys = points.map((p) => p[1])
const yMin = Math.min(...ys)
const yMax = Math.max(...ys)
const xs = points.map((p) => p[0])
const zs = points.map((p) => p[2])

// The axis: median of X and Z is robust against the base flare and the fins,
// which sit off-centre.
const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}
const ax = median(xs)
const az = median(zs)

console.log('vertices:', points.length)
console.log(`y range: ${yMin.toFixed(3)} .. ${yMax.toFixed(3)}  (height ${(yMax - yMin).toFixed(3)})`)
console.log(`x range: ${Math.min(...xs).toFixed(3)} .. ${Math.max(...xs).toFixed(3)}`)
console.log(`z range: ${Math.min(...zs).toFixed(3)} .. ${Math.max(...zs).toFixed(3)}`)
console.log(`axis (median x,z): ${ax.toFixed(4)}, ${az.toFixed(4)}`)

const BAND = 0.25
const bands = new Map()
for (const [x, y, z] of points) {
  const b = Math.floor(y / BAND)
  const r = Math.hypot(x - ax, z - az)
  if (!bands.has(b)) bands.set(b, [])
  bands.get(b).push(r)
}

console.log(`\n=== RADIUS PROFILE (band ${BAND} units) ===`)
console.log('  yMid    n     rMax    rP90    rMed   rMin   note')
for (let b = Math.floor(yMin / BAND); b <= Math.floor(yMax / BAND); b++) {
  const arr = bands.get(b)
  if (!arr || arr.length === 0) continue
  const s = [...arr].sort((a, c) => a - c)
  const q = (p) => s[Math.min(s.length - 1, Math.floor(s.length * p))]
  const rMax = s[s.length - 1]
  const rP90 = q(0.9)
  const rMed = q(0.5)
  const rMin = s[0]
  const yMid = (b + 0.5) * BAND
  // Flag bands where the bulk radius changes noticeably vs the band below.
  const prev = bands.get(b - 1)
  const prevMed = prev ? [...prev].sort((a, c) => a - c)[Math.floor(prev.length / 2)] : rMed
  const delta = rMed - prevMed
  let note = ''
  if (Math.abs(delta) > 0.04) note = delta > 0 ? `<-- STEP OUT ${delta.toFixed(3)}` : `<-- STEP IN ${delta.toFixed(3)}`
  console.log(
    `  ${yMid.toFixed(2).padStart(6)}  ${String(arr.length).padStart(4)}  ${rMax.toFixed(3).padStart(6)}  ${rP90.toFixed(3).padStart(6)}  ${rMed.toFixed(3).padStart(6)}  ${rMin.toFixed(3).padStart(6)}  ${note}`,
  )
}