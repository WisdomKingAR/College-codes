/**
 * Reads the NASA Saturn V GLB and prints everything needed to decide how to
 * map geometry onto individually animatable parts:
 *   - node tree with world transforms
 *   - per-primitive vertex/index counts and materials
 *   - world-space bounding boxes (the Saturn V is a vertical stack, so the
 *     Y extents are what part boundaries are derived from)
 *
 * Run: npm run model:inspect
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NodeIO } from '@gltf-transform/core'
import { Box3, Matrix4, Quaternion, Vector3 } from 'three'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const input = path.join(root, 'assets/source/SaturnV-raw.glb')

const glb = await readFile(input)
if (glb.toString('ascii', 0, 4) !== 'glTF') throw new Error(`${input} is not a binary glTF`)

const document = await new NodeIO().read(input)
const gltfRoot = document.getRoot()
const materials = gltfRoot.listMaterials()
const textures = gltfRoot.listTextures()
const scene = gltfRoot.listScenes()[0]
const roots = scene ? scene.listChildren() : gltfRoot.listNodes()

const f = (n) => (typeof n === 'number' ? n.toFixed(3) : String(n))
const pad = (s, n) => String(s).padEnd(n)

function localMatrix(node) {
  const t = node.getTranslation()
  const r = node.getRotation()
  const s = node.getScale()
  return new Matrix4().compose(
    new Vector3(t[0], t[1], t[2]),
    new Quaternion(r[0], r[1], r[2], r[3]),
    new Vector3(s[0], s[1], s[2]),
  )
}

const rows = []
const overall = new Box3()

function walk(node, parentWorld, depth) {
  if (!node) return
  const world = parentWorld.clone().multiply(localMatrix(node))
  const label = node.getName() || '<unnamed>'
  const mesh = node.getMesh()

  if (mesh) {
    const meshName = mesh.getName() || '<unnamed-mesh>'
    for (const [i, prim] of mesh.listPrimitives().entries()) {
      const pos = prim.getAttribute('POSITION')
      if (!pos) continue
      const count = pos.getCount()
      const indices = prim.getIndices()?.getCount() ?? count
      const size = pos.getElementSize()
      const arr = pos.getArray()
      const v = new Vector3()
      const box = new Box3()
      for (let k = 0; k < count; k++) {
        const o = k * size
        v.set(arr[o], arr[o + 1], arr[o + 2]).applyMatrix4(world)
        box.expandByPoint(v)
      }
      overall.union(box)
      rows.push({
        depth,
        node: label,
        mesh: meshName,
        prim: i,
        verts: count,
        tris: Math.floor(indices / 3),
        material: prim.getMaterial()?.getName() || '<none>',
        box,
      })
    }
  }

  for (const child of node.listChildren()) walk(child, world, depth + 1)
}

const identity = new Matrix4()
for (const n of roots) walk(n, identity, 0)

console.log('=== FILE ===')
console.log('root nodes:', roots.map((n) => n.getName() || '<none>').join(', '))
console.log('nodes:', gltfRoot.listNodes().length, 'meshes:', gltfRoot.listMeshes().length, 'materials:', materials.length, 'textures:', textures.length)
console.log('generator:', gltfRoot.getAsset().generator || '<none>')
console.log('extensions used:', gltfRoot.listExtensionsUsed().join(', ') || '<none>')
console.log('extensions required:', gltfRoot.listExtensionsRequired().join(', ') || '<none>')

console.log('\n=== MATERIALS ===')
for (const m of materials) {
  const base = m.getBaseColorFactor()?.map(f).join(',') ?? '-'
  console.log(`  ${pad(m.getName() || '<unnamed>', 28)} base=${pad(base, 26)} metallic=${f(m.getMetallicFactor())} rough=${f(m.getRoughnessFactor())}`)
}

console.log('\n=== TEXTURES ===')
for (const t of textures) {
  console.log(`  ${pad(t.getName() || '<unnamed>', 28)} mime=${pad(t.getMimeType(), 14)} ${t.getImage()?.byteLength ?? 0} bytes`)
}

console.log(`\n=== PRIMITIVES (${rows.length}) — world-space Y extents ===`)
console.log(pad('node', 22), pad('mesh', 20), pad('prim', 5), pad('verts', 8), pad('tris', 8), pad('material', 20), pad('yMin', 10), pad('yMax', 10), pad('xSpan', 9))
for (const r of rows) {
  console.log(
    pad(r.node.slice(0, 21), 22),
    pad(r.mesh.slice(0, 19), 20),
    pad(r.prim, 5),
    pad(r.verts, 8),
    pad(r.tris, 8),
    pad(r.material.slice(0, 19), 20),
    pad(f(r.box.min.y), 10),
    pad(f(r.box.max.y), 10),
    pad(f(r.box.max.x - r.box.min.x), 9),
  )
}

const size = overall.getSize(new Vector3())
console.log('\n=== OVERALL BOUNDS (world) ===')
console.log('  min:', `${f(overall.min.x)}, ${f(overall.min.y)}, ${f(overall.min.z)}`)
console.log('  max:', `${f(overall.max.x)}, ${f(overall.max.y)}, ${f(overall.max.z)}`)
console.log('  size:', `${f(size.x)}, ${f(size.y)}, ${f(size.z)}`)
console.log(`  height ${f(size.y)}  base y=${f(overall.min.y)}  tip y=${f(overall.max.y)}`)
console.log(`  widest X ${f(size.x)}  -> diameter/height = ${f(size.x / size.y)}`)

console.log('\n=== VERTEX DENSITY BY Y BAND (1 m bands, base -> tip) ===')
const bands = new Map()
for (const r of rows) {
  for (let b = Math.floor(r.box.min.y); b <= Math.floor(r.box.max.y); b++) bands.set(b, (bands.get(b) ?? 0) + 1)
}
for (let b = Math.floor(overall.min.y); b <= Math.ceil(overall.max.y); b++) {
  const n = bands.get(b) ?? 0
  console.log(`  y=${String(b).padStart(4)}  ${'#'.repeat(Math.min(n, 56))}${n ? ` (${n})` : ''}`)
}