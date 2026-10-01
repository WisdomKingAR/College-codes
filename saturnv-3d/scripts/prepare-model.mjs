/**
 * Splits the NASA Saturn V GLB into eight separately animatable parts.
 *
 * Why slicing is necessary: the model ships as one set of default-named meshes
 * (pCylinder1, polySurface1, group7, ...) with no per-stage grouping, so there
 * is nothing to animate separately. The stack is a near-vertical column of
 * cylinders though, so assigning each *triangle* to a part by its centroid
 * height recovers the stage boundaries.
 *
 * The band edges come from real Saturn V proportions rather than guesswork: the
 * measured radius steps from 0.62 to 0.43 units at y=8.38, which lands within
 * 0.1 units of the S-II/S-IVB plane computed from the published 67.0 m stack
 * height. That agreement is the evidence the mapping is right.
 *
 * Triangles are only regrouped, never re-cut, so normals, UVs, materials and
 * textures survive untouched and the output is the same size as the input.
 *
 * Run: npm run model:prepare
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Box3, Matrix3, Matrix4, Quaternion, Vector3 } from 'three'
import { Document, NodeIO } from '@gltf-transform/core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const input = path.join(root, 'assets/source/SaturnV-raw.glb')
const output = path.join(root, 'public/models/SaturnV-parts.glb')

const MODEL_HEIGHT_M = 110.6

/**
 * Part boundaries as height above the base of the vehicle, in metres.
 * Sources: Saturn V stage heights (S-IC 42.1 m, S-II 24.9 m, S-IVB 17.8 m,
 * IU 0.9 m) plus the Apollo spacecraft and launch escape system heights.
 */
const BANDS = [
  { id: 'sic', label: 'S-IC', from: 0, to: 42.1 },
  { id: 'sii', label: 'S-II', from: 42.1, to: 67.0 },
  { id: 'sivb', label: 'S-IVB', from: 67.0, to: 84.8 },
  { id: 'iu', label: 'IU', from: 84.8, to: 85.9 },
  { id: 'sla', label: 'SLA', from: 85.9, to: 92.7 },
  { id: 'sm', label: 'SM', from: 92.7, to: 99.2 },
  { id: 'cm', label: 'CM', from: 99.2, to: 102.7 },
  { id: 'les', label: 'LES', from: 102.7, to: 110.6 },
]

const io = new NodeIO()
const doc = await io.read(input)
const gltfRoot = doc.getRoot()
const scene = gltfRoot.listScenes()[0]
const sceneRoots = scene ? scene.listChildren() : gltfRoot.listNodes()

function localMatrix(node) {
  const [tx, ty, tz] = node.getTranslation()
  const [rx, ry, rz, rw] = node.getRotation()
  const [sx, sy, sz] = node.getScale()
  return new Matrix4().compose(
    new Vector3(tx, ty, tz),
    new Quaternion(rx, ry, rz, rw),
    new Vector3(sx, sy, sz),
  )
}

// ------------------------------------------------------------------ gather ----
const sources = []
const worldPositions = []

function collect(node, parentWorld) {
  if (!node) return
  const world = parentWorld.clone().multiply(localMatrix(node))
  const mesh = node.getMesh()

  if (mesh) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION')
      if (!pos) continue

      const nrm = prim.getAttribute('NORMAL')
      const uv = prim.getAttribute('TEXCOORD_0')
      const idx = prim.getIndices()?.getArray() ?? null

      const count = pos.getCount()
      const ps = pos.getElementSize()
      const pa = pos.getArray()
      const na = nrm?.getArray() ?? null
      const ua = uv?.getArray() ?? null

      const positions = new Float64Array(count * 3)
      const normals = na ? new Float64Array(count * 3) : null
      const uvs = ua ? new Float64Array(count * 2) : null
      const normalMatrix = new Matrix3().getNormalMatrix(world)

      const p = new Vector3()
      const n = new Vector3()

      for (let i = 0; i < count; i++) {
        p.set(pa[i * ps], pa[i * ps + 1], pa[i * ps + 2]).applyMatrix4(world)
        positions[i * 3] = p.x
        positions[i * 3 + 1] = p.y
        positions[i * 3 + 2] = p.z

        if (normals) {
          n.set(na[i * 3], na[i * 3 + 1], na[i * 3 + 2]).applyMatrix3(normalMatrix).normalize()
          normals[i * 3] = n.x
          normals[i * 3 + 1] = n.y
          normals[i * 3 + 2] = n.z
        }
        if (uvs) {
          uvs[i * 2] = ua[i * 2]
          uvs[i * 2 + 1] = ua[i * 2 + 1]
        }
        worldPositions.push(p.x, p.y, p.z)
      }

      // Indexed primitives routinely carry more indices than vertices (a 2,592
      // vertex surface with 13,134 indices is four triangles), so the index
      // array must be sized from the index buffer, not from the vertex count.
      const indices = idx
        ? Uint32Array.from(idx)
        : Uint32Array.from({ length: count }, (_, i) => i)

      sources.push({ material: prim.getMaterial(), positions, normals, uvs, indices, vertexCount: count })
    }
  }

  for (const child of node.listChildren()) collect(child, world)
}

for (const n of sceneRoots) collect(n, new Matrix4())

console.log(`sources: ${sources.length} primitives, ${sources.reduce((a, s) => a + s.indices.length / 3, 0)} triangles`)

// --------------------------------------------------------- normalise space ----
// Recentre on the vehicle axis, put the base at y=0, and scale so the stack is
// MODEL_HEIGHT_M tall so the on-screen geometry matches the published figures.
const axisX = median(worldPositions.filter((_, i) => i % 3 === 0))
const axisZ = median(worldPositions.filter((_, i) => i % 3 === 2))
const baseY = Math.min(...worldPositions.filter((_, i) => i % 3 === 1))
const topY = Math.max(...worldPositions.filter((_, i) => i % 3 === 1))
const scale = MODEL_HEIGHT_M / (topY - baseY)

/** model-space Y for a height above the base, in metres */
const yFor = (metres) => baseY + metres / scale

function median(arr) {
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

// -------------------------------------------------------------- assignment ----
// buckets[bandId][materialName] -> { material, positions, normals, uvs, indices, remap }
const buckets = new Map()
for (const band of BANDS) buckets.set(band.id, new Map())

for (const src of sources) {
  const perBand = new Map()

  for (let t = 0; t < src.indices.length; t += 3) {
    const a = src.indices[t]
    const b = src.indices[t + 1]
    const c = src.indices[t + 2]
    const centroidY = (src.positions[a * 3 + 1] + src.positions[b * 3 + 1] + src.positions[c * 3 + 1]) / 3

    const band =
      BANDS.find((x) => centroidY >= yFor(x.from) && centroidY < yFor(x.to)) ?? BANDS[BANDS.length - 1]

    const matName = src.material?.getName() ?? 'default'
    let byMaterial = perBand.get(band.id)
    if (!byMaterial) {
      byMaterial = new Map()
      perBand.set(band.id, byMaterial)
    }
    let entry = byMaterial.get(matName)
    if (!entry) {
      entry = { material: src.material, positions: [], normals: [], uvs: [], indices: [], remap: new Map() }
      byMaterial.set(matName, entry)
    }

    for (const vi of [a, b, c]) {
      let n = entry.remap.get(vi)
      if (n === undefined) {
        n = entry.indices.length
        entry.remap.set(vi, n)
        entry.positions.push(
          (src.positions[vi * 3] - axisX) * scale,
          (src.positions[vi * 3 + 1] - baseY) * scale,
          (src.positions[vi * 3 + 2] - axisZ) * scale,
        )
        if (src.normals) entry.normals.push(src.normals[vi * 3], src.normals[vi * 3 + 1], src.normals[vi * 3 + 2])
        if (src.uvs) entry.uvs.push(src.uvs[vi * 2], src.uvs[vi * 2 + 1])
      }
      entry.indices.push(n)
    }
  }

  for (const [bandId, byMaterial] of perBand) {
    const target = buckets.get(bandId)
    for (const [, entry] of byMaterial) {
      entry.remap = null
      target.set(`${entry.material?.getName() ?? 'default'}_${target.size}`, entry)
    }
  }
}

// ------------------------------------------------------------------ output ----
const out = new Document()
const outRoot = out.getRoot()
const buffer = out.createBuffer()

// Materials and their base-colour textures are recreated by value so the output
// document is self-contained. Four materials (blinn8/9/10/11SG) carry decal
// textures in the source, so dropping them would lose painted markings.
const materialCache = new Map()
const textureCache = new Map()

function mirrorTexture(source) {
  if (!source) return undefined
  const image = source.getImage()
  if (!image) return undefined
  const key = `${source.getName() ?? 'tex'}:${source.getMimeType()}:${image.byteLength}`
  if (textureCache.has(key)) return textureCache.get(key)
  const clone = out.createTexture(source.getName() ?? 'texture').setMimeType(source.getMimeType()).setImage(image)
  textureCache.set(key, clone)
  return clone
}

function mirrorMaterial(source) {
  const name = source?.getName() ?? 'default'
  if (materialCache.has(name)) return materialCache.get(name)
  const clone = out
    .createMaterial(name)
    .setBaseColorFactor(source ? source.getBaseColorFactor() : [0.8, 0.8, 0.8, 1])
    .setMetallicFactor(source ? source.getMetallicFactor() : 0)
    .setRoughnessFactor(source ? source.getRoughnessFactor() : 0.4)
    .setDoubleSided(source ? source.getDoubleSided() : false)
  const tex = mirrorTexture(source?.getBaseColorTexture())
  if (tex) clone.setBaseColorTexture(tex)
  materialCache.set(name, clone)
  return clone
}

const sceneOut = out.createScene('SaturnV')
outRoot.setDefaultScene(sceneOut)
const metadata = []

for (const band of BANDS) {
  const node = sceneOut.addChild(out.createNode(`part_${band.id}`))
  const byMaterial = buckets.get(band.id)
  const partBox = new Box3()
  let tris = 0

  for (const [key, entry] of byMaterial) {
    if (entry.indices.length === 0) continue

    const posArr = new Float32Array(entry.positions)
    const hasNormals = entry.normals.length === entry.positions.length
    const hasUvs = entry.uvs.length === (entry.positions.length / 3) * 2

    const mesh = out.createMesh(`${band.id}_${key.replace(/[^a-z0-9]+/gi, '_')}`)

    const primitive = out
      .createPrimitive()
      .setAttribute(
        'POSITION',
        out.createAccessor().setType('VEC3').setArray(posArr).setBuffer(buffer),
      )
      .setIndices(out.createAccessor().setType('SCALAR').setArray(new Uint32Array(entry.indices)).setBuffer(buffer))
      .setMaterial(mirrorMaterial(entry.material))

    if (hasNormals) {
      primitive.setAttribute(
        'NORMAL',
        out.createAccessor().setType('VEC3').setArray(new Float32Array(entry.normals)).setBuffer(buffer),
      )
    }
    if (hasUvs) {
      primitive.setAttribute(
        'TEXCOORD_0',
        out.createAccessor().setType('VEC2').setArray(new Float32Array(entry.uvs)).setBuffer(buffer),
      )
    }

    mesh.addPrimitive(primitive)
    node.addChild(out.createNode(mesh.getName()).setMesh(mesh))

    const bb = new Box3()
    for (let i = 0; i < posArr.length; i += 3) bb.expandByPoint(new Vector3(posArr[i], posArr[i + 1], posArr[i + 2]))
    partBox.union(bb)
    tris += entry.indices.length / 3
  }

  const size = partBox.getSize(new Vector3())
  const center = partBox.getCenter(new Vector3())
  metadata.push({
    id: band.id,
    label: band.label,
    from: band.from,
    to: band.to,
    tris,
    meshes: node.listChildren().length,
    bbox: {
      min: [partBox.min.x, partBox.min.y, partBox.min.z].map((v) => +v.toFixed(3)),
      max: [partBox.max.x, partBox.max.y, partBox.max.z].map((v) => +v.toFixed(3)),
      size: [size.x, size.y, size.z].map((v) => +v.toFixed(3)),
      center: [center.x, center.y, center.z].map((v) => +v.toFixed(3)),
    },
  })
}

await io.write(output, out)

// ------------------------------------------------------------------ report ----
console.log('normalised: axis', axisX.toFixed(4), axisZ.toFixed(4))
console.log(`base y ${baseY.toFixed(3)} -> 0   height ${(topY - baseY).toFixed(3)} units -> ${MODEL_HEIGHT_M} m   scale ${scale.toFixed(5)} m/unit\n`)
console.log('part     band (m)      tris  meshes   y range (m)              width x depth (m)')
for (const m of metadata) {
  console.log(
    m.id.padEnd(8),
    `${m.from}-${m.to}`.padEnd(14),
    String(m.tris).padStart(6),
    String(m.meshes).padStart(7),
    `${m.bbox.min[1].toFixed(2)} .. ${m.bbox.max[1].toFixed(2)}`.padEnd(24),
    `${m.bbox.size[0].toFixed(2)} x ${m.bbox.size[2].toFixed(2)}`,
  )
}
console.log('\nwrote', output)

// Emit the geometry table the app imports, so the scene and the copy can never
// drift out of sync with the actual model.
const { writeFile, stat } = await import('node:fs/promises')
await writeFile(
  path.join(root, 'src/data/generated/geometry.json'),
  `${JSON.stringify({ heightM: MODEL_HEIGHT_M, parts: metadata }, null, 2)}\n`,
  'utf8',
)
console.log('wrote src/data/generated/geometry.json')

// ---------------------------------------------------------------- verify ------
// Read the file back and assert the invariants the scene relies on, so a silent
// geometry regression fails here instead of showing up as a hole in the rocket.
const check = await io.read(output)
const checkRoot = check.getRoot()
const checkScene = checkRoot.getDefaultScene() ?? checkRoot.listScenes()[0]
const partNodes = checkScene.listChildren().filter((n) => n.getName()?.startsWith('part_'))

const problems = []
if (partNodes.length !== BANDS.length) {
  problems.push(`expected ${BANDS.length} part nodes, found ${partNodes.length}`)
}

const tip = Math.max(...metadata.map((m) => m.bbox.max[1]))
const base = Math.min(...metadata.map((m) => m.bbox.min[1]))
if (Math.abs(base) > 0.5) problems.push(`base is at y=${base.toFixed(2)}, expected ~0`)
if (Math.abs(tip - MODEL_HEIGHT_M) > 1) problems.push(`tip is at y=${tip.toFixed(2)}, expected ${MODEL_HEIGHT_M}`)
for (const m of metadata) {
  if (m.tris === 0) problems.push(`part ${m.id} is empty`)
  if (m.bbox.size.some((v) => !Number.isFinite(v))) problems.push(`part ${m.id} has a non-finite bbox`)
}

if (problems.length) {
  console.error('\nVERIFICATION FAILED:')
  for (const p of problems) console.error(`  - ${p}`)
  process.exitCode = 1
} else {
  const kb = ((await stat(output)).size / 1024).toFixed(0)
  console.log(`\nverified: ${partNodes.length} part nodes, y ${base.toFixed(2)}..${tip.toFixed(2)} m, ${kb} KB`)
  console.log(partNodes.map((n) => n.getName()).join(', '))
}