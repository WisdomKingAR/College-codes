/**
 * Downloads the NASA Saturn V source model.
 *
 * The GLB is third-party and public domain, so it is deliberately not committed
 * to the repository — it is ignored and re-fetched with this script instead.
 * Keeping it out of git history means the asset can be re-checked against
 * NASA's catalogue later without a 900 KB binary in every clone.
 *
 * Run: npm run model:fetch
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dest = path.join(root, 'assets/source/SaturnV-raw.glb')

// Public domain, NASA / Michael D. Carbajal, via the NASA 3D Resources
// catalogue. The GitHub raw URL is stable and is not subject to the token
// expiry that the science.nasa.gov asset URL can be.
const URL =
  'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Saturn%20V/Saturn%20V.glb'

const EXPECTED_BYTES = 927212

try {
  const existing = await stat(dest)
  if (existing.size === EXPECTED_BYTES) {
    console.log(`already present: assets/source/SaturnV-raw.glb (${existing.size} bytes)`)
    process.exit(0)
  }
  console.log(`found a partial file (${existing.size} bytes), re-downloading`)
} catch {
  // No file yet, fall through to the download.
}

await mkdir(path.dirname(dest), { recursive: true })

console.log(`downloading ${URL}`)
const response = await fetch(URL)

if (!response.ok) {
  console.error(`download failed: HTTP ${response.status} ${response.statusText}`)
  process.exit(1)
}

const buffer = Buffer.from(await response.arrayBuffer())

if (buffer.toString('ascii', 0, 4) !== 'glTF') {
  console.error('download failed: response is not a binary glTF')
  process.exit(1)
}

if (buffer.length !== EXPECTED_BYTES) {
  console.warn(`warning: expected ${EXPECTED_BYTES} bytes, received ${buffer.length}`)
}

await writeFile(dest, buffer)
console.log(`wrote assets/source/SaturnV-raw.glb (${buffer.length} bytes)`)
console.log('next: npm run model:prepare')