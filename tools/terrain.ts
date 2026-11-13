/**
 * The map's 3D terrain under a model: Mapterhorn, the DEM the map draws.
 *
 *   bun tools/terrain.ts grid <lon> <lat> [half-m=60] [step-m=5] [--bearing <deg>] [--zoom <z>]
 *   bun tools/terrain.ts check <id|model.glb> [--lng <deg> --lat <deg> --bearing <deg>] [--elevation <m>] [--map new|sink|old] [--zoom <z>]
 *
 * `grid` prints the ground in a model's own frame (x east, z south, metres,
 * turned by --bearing like a placement) as heights above the lowest point
 * in the table, so a builder can see how the site slopes before modelling
 * its base, plaza or steps.
 *
 * `check` stands a model on the terrain the way the map does (Parchment,
 * from PR #809) and reports where its visible tops end up under the ground.
 * The map reads Mapterhorn (terrarium, 512 px tiles, z15, about 2 m a pixel
 * in the US, from USGS 3DEP lidar). Inside the model's footprint (its plan
 * coverage, grown by 2 m) it replaces the terrain with a smooth fill from
 * the ground just outside, never higher than the real ground, so podiums,
 * steps and rockwork that lidar counts as ground don't poke through the
 * model. It then reads that ground on a 7 x 7 grid over the plan extent,
 * puts y = 0 on the lowest point, and lifts every vertex by the ground's
 * rise under it, fully at the model's own ground and fading to the
 * footprint's mean rise by y = 25 m. Only the base (within 0.05 m of its
 * ground) is sunk a further 0.5 m. The terrain is drawn life-size
 * (Parchment PR #913). `fill.ts` and `landmark-coverage.ts` under `tools/parchment/` are
 * copies of the map's own code. `--map old` checks against the map before
 * that PR (the whole model sunk 0.5 m, no fill), `--map sink` with only the
 * base sink.
 *
 * The lift is per vertex: a big flat face between far-apart vertices stays
 * a plane while the ground under it bulges. A model passes when no
 * upward-facing surface more than 0.2 m above its base (a deck, a plaza, a
 * step, a planter) is buried by more than 0.15 m. The fixes, in order:
 * split long ground-hugging faces into pieces no longer than about 5 m, so
 * the drape can bend them; build decks, podiums and steps to their real
 * heights from the evidence (the terrain is not evidence for them, since the
 * fill takes them out); and if the terrain under the site is wrong (a
 * demolished hill, a new dig), leave the model true to the photos and say
 * so in the header.
 *
 * Heights are cached under ~/.cache/landmarks/mapterhorn.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { readGlb } from '../generators/mesh'
import type { Catalog } from '../src/catalog'
// Parchment's own fill and coverage, so this mirrors the map exactly.
import { fillAt, groundFill, type GroundFill } from './parchment/fill'
import { planCoverage } from './parchment/landmark-coverage'

const ROOT = join(import.meta.dir, '..')
const TILES = 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'
/** Mapterhorn's z15 covers lidar countries; elsewhere it stops lower (z12 at Giza), so `--zoom` reads that. */
let Z = 15
const SIZE = 512
const CACHE = join(homedir(), '.cache', 'landmarks', 'mapterhorn')

/** As the map draws it; see `terrain.ts` and `landmark-layer.ts` in Parchment. */
const EXAGGERATION = 1
const GROUND_GRID = 7
const GROUND_SINK = 0.5
/** Metres above its own ground a vertex still counts as base, and is sunk; see `baseSink` in Parchment. */
const BASE_BAND = 0.05
const GROUND_BLEND = 25

/** What `check` tolerates: a visible top more than LIFTED above the base, buried more than BURIED. */
const LIFTED = 0.2
const BURIED = 0.15

const tiles = new Map<string, Promise<Float32Array>>()
const loadedTiles = new Map<string, Float32Array>()

/** A tile's pixels if loaded, else null, starting its load. */
function tileNow(x: number, y: number): Float32Array | null {
  const key = `${Z}/${x}/${y}`
  const found = loadedTiles.get(key)
  if (found) return found
  void tile(x, y).then(d => loadedTiles.set(key, d))
  return null
}

/** Raw pixel at a global pixel index, sync; null while loading. */
function pixelNow(gx: number, gy: number): number | null {
  const tx = Math.floor(gx / SIZE), ty = Math.floor(gy / SIZE)
  const data = tileNow(tx, ty)
  return data ? data[(gy - ty * SIZE) * SIZE + (gx - tx * SIZE)] : null
}

/** Bilinear raw height at a mercator point, as `height` reads it, sync; null while loading. */
function heightNow([mx, my]: [number, number]): number | null {
  const px = mx * 2 ** Z * SIZE - 0.5, py = my * 2 ** Z * SIZE - 0.5
  const x0 = Math.floor(px), y0 = Math.floor(py)
  const v = [pixelNow(x0, y0), pixelNow(x0 + 1, y0), pixelNow(x0, y0 + 1), pixelNow(x0 + 1, y0 + 1)]
  if (v.some(h => h === null)) return null
  const [a, b, c, d] = v as number[]
  const fx = px - x0, fy = py - y0
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
}

const mercator = (lng: number, lat: number): [number, number] => {
  const s = Math.sin((lat * Math.PI) / 180)
  return [(lng + 180) / 360, 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)]
}

/** The fill the map lays under a model, once the ground round it has loaded. */
async function fillUnder(prims: ReturnType<typeof readGlb>, place: Place, min: number[], max: number[]): Promise<GroundFill | null> {
  const coverage = planCoverage({ min, max, primitives: prims.map(p => ({ position: p.position, index: p.index, node: -1 })) })
  for (let tries = 0; tries < 20; tries++) {
    const fill = groundFill(coverage, (x, z) => mercator(...toLngLat(place, x, z)), 1, heightNow)
    if (fill) return fill
    await Promise.all([...tiles.values()])
    await new Promise(r => setTimeout(r, 0))
  }
  return null
}

/** As the map draws it with the fill: each pixel brought down to the fill there, then bilinear. */
async function filledHeight(lng: number, lat: number, fill: GroundFill | null): Promise<number> {
  if (!fill) return height(lng, lat)
  const n = 2 ** Z
  const [mx, my] = mercator(lng, lat)
  const px = mx * n * SIZE - 0.5, py = my * n * SIZE - 0.5
  const x0 = Math.floor(px), y0 = Math.floor(py)
  const at = async (gx: number, gy: number) => {
    const tx = Math.floor(gx / SIZE), ty = Math.floor(gy / SIZE)
    const raw = (await tile(tx, ty))[(gy - ty * SIZE) * SIZE + (gx - tx * SIZE)]
    const f = fillAt(fill, [(gx + 0.5) / SIZE / n, (gy + 0.5) / SIZE / n])
    return f === null ? raw : Math.min(raw, f)
  }
  const [a, b, c, d] = await Promise.all([at(x0, y0), at(x0 + 1, y0), at(x0, y0 + 1), at(x0 + 1, y0 + 1)])
  const fx = px - x0, fy = py - y0
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
}

async function tile(x: number, y: number): Promise<Float32Array> {
  const key = `${Z}/${x}/${y}`
  let found = tiles.get(key)
  if (!found) tiles.set(key, (found = loadTile(x, y)))
  return found
}

async function loadTile(x: number, y: number): Promise<Float32Array> {
  mkdirSync(CACHE, { recursive: true })
  const file = join(CACHE, `${Z}-${x}-${y}.webp`)
  if (!existsSync(file)) {
    const url = TILES.replace('{z}', String(Z)).replace('{x}', String(x)).replace('{y}', String(y))
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${url}: ${res.status}`)
    writeFileSync(file, new Uint8Array(await res.arrayBuffer()))
  }
  const { data, info } = await sharp(readFileSync(file)).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  if (info.width !== SIZE || info.height !== SIZE) throw new Error(`${file}: ${info.width}x${info.height}, expected ${SIZE}`)
  const out = new Float32Array(SIZE * SIZE)
  for (let i = 0; i < out.length; i++) out[i] = data[i * 3] * 256 + data[i * 3 + 1] + data[i * 3 + 2] / 256 - 32768
  return out
}

/** Metres above sea level at a point, bilinear between pixel centres, as the map samples it. */
async function height(lng: number, lat: number): Promise<number> {
  const n = 2 ** Z
  const u = ((lng + 180) / 360) * n
  const s = Math.sin((lat * Math.PI) / 180)
  const v = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n
  const px = u * SIZE - 0.5, py = v * SIZE - 0.5
  const x0 = Math.floor(px), y0 = Math.floor(py)
  const at = async (gx: number, gy: number) => {
    const tx = Math.floor(gx / SIZE), ty = Math.floor(gy / SIZE)
    const data = await tile(tx, ty)
    return data[(gy - ty * SIZE) * SIZE + (gx - tx * SIZE)]
  }
  const [a, b, c, d] = await Promise.all([at(x0, y0), at(x0 + 1, y0), at(x0, y0 + 1), at(x0 + 1, y0 + 1)])
  const fx = px - x0, fy = py - y0
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
}

type Place = { lng: number; lat: number; bearing: number; elevation: number }

/** As `modelToLngLat` in Parchment: x east, z south, turned clockwise by the bearing. */
function toLngLat({ lng, lat, bearing }: Place, x: number, z: number): [number, number] {
  const k = Math.cos((lat * Math.PI) / 180) * 111320
  const b = (bearing * Math.PI) / 180
  const east = Math.cos(b) * x - Math.sin(b) * z
  const south = Math.sin(b) * x + Math.cos(b) * z
  return [lng + east / k, lat - south / 110574]
}

const args = process.argv.slice(2)
const option = (name: string) => {
  const at = args.indexOf(name)
  return at < 0 ? undefined : args.splice(at, 2)[1]
}
Z = Number(option('--zoom') ?? Z)
const f1 = (v: number) => v.toFixed(1)
const f2 = (v: number) => v.toFixed(2)

async function grid() {
  const bearing = Number(option('--bearing') ?? 0)
  const [, lngA, latA, halfA = '60', stepA = '5'] = args
  if (lngA === undefined || latA === undefined) usage()
  const place = { lng: Number(lngA), lat: Number(latA), bearing, elevation: 0 }
  const half = Number(halfA), step = Number(stepA)
  const coords: number[] = []
  for (let v = -half; v <= half + 1e-9; v += step) coords.push(v)
  const rows = await Promise.all(coords.map((z) => Promise.all(coords.map((x) => height(...toLngLat(place, x, z))))))
  const lowest = Math.min(...rows.flat())
  console.log(`Mapterhorn z${Z} at ${place.lng}, ${place.lat}, bearing ${bearing}: metres above ${f2(lowest)} m (lowest in the table)`)
  console.log(`rows z (south +), columns x (east +), step ${step} m`)
  console.log('z\\x'.padStart(7) + coords.map((x) => String(x).padStart(6)).join(''))
  rows.forEach((row, j) => console.log(String(coords[j]).padStart(7) + row.map((h) => f1(h - lowest).padStart(6)).join('')))
}

async function check() {
  const lngO = option('--lng'), latO = option('--lat'), bearingO = option('--bearing'), elevationO = option('--elevation')
  // old: the map before this change (whole model sunk); sink: base-only sink; new: base-only sink and the terrain filled.
  const mapMode = option('--map') ?? 'new'
  const what = args[1]
  if (!what) usage()
  let file = what
  let place: Place = { lng: NaN, lat: NaN, bearing: 0, elevation: 0 }
  if (!what.endsWith('.glb')) {
    const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8')) as Catalog
    const placed: any = catalog.landmarks.find((l) => l.id === what) ?? catalog.landmarks.find((l) => l.model === what)
    const model = catalog.models.find((m) => m.id === (placed?.model ?? what))
    file = join(ROOT, model?.file ?? `models/${what}.glb`)
    if (placed) place = { lng: placed.lng, lat: placed.lat, bearing: placed.bearing ?? 0, elevation: placed.elevation ?? 0 }
  }
  if (lngO) place.lng = Number(lngO)
  if (latO) place.lat = Number(latO)
  if (bearingO) place.bearing = Number(bearingO)
  if (elevationO) place.elevation = Number(elevationO)
  if (!Number.isFinite(place.lng) || !Number.isFinite(place.lat)) {
    console.error(`${what}: not placed in catalog.json; give --lng, --lat and --bearing`)
    process.exit(1)
  }

  const prims = readGlb(new Uint8Array(readFileSync(file)))
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const { position: p } of prims)
    for (let i = 0; i < p.length; i += 3) {
      minX = Math.min(minX, p[i]), maxX = Math.max(maxX, p[i])
      minZ = Math.min(minZ, p[i + 2]), maxZ = Math.max(maxZ, p[i + 2])
    }

  let minY = Infinity, maxY = -Infinity
  for (const { position: p } of prims) for (let i = 1; i < p.length; i += 3) minY = Math.min(minY, p[i]), maxY = Math.max(maxY, p[i])
  const fill = mapMode === 'new' && place.elevation <= 0 ? await fillUnder(prims, place, [minX, minY, minZ], [maxX, maxY, maxZ]) : null
  if (mapMode === 'new' && place.elevation <= 0 && !fill) console.log('warning: no fill (ground did not load)')
  const ground = (lng: number, lat: number) => filledHeight(lng, lat, fill)

  // The map's view of the ground: a 7 x 7 grid over the plan extent, exaggerated.
  const n = GROUND_GRID - 1
  const gridAt = (i: number, j: number): [number, number] => [minX + ((maxX - minX) * i) / n, minZ + ((maxZ - minZ) * j) / n]
  const raw: number[] = []
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) raw.push(await ground(...toLngLat(place, ...gridAt(i, j))))
  const drawn = raw.map((h) => h * EXAGGERATION)
  const lowest = Math.min(...drawn)
  const rise = drawn.map((h) => h - lowest)
  const mean = rise.reduce((a, b) => a + b, 0) / rise.length
  const riseUnder = (x: number, z: number) => {
    const gx = Math.min(n, Math.max(0, ((x - minX) / Math.max(maxX - minX, 1e-3)) * n))
    const gz = Math.min(n, Math.max(0, ((z - minZ) / Math.max(maxZ - minZ, 1e-3)) * n))
    const i = Math.min(n - 1, Math.floor(gx)), j = Math.min(n - 1, Math.floor(gz))
    const fx = gx - i, fz = gz - j
    const r = (a: number, b: number) => rise[b * GROUND_GRID + a]
    return (r(i, j) * (1 - fx) + r(i + 1, j) * fx) * (1 - fz) + (r(i, j + 1) * (1 - fx) + r(i + 1, j + 1) * fx) * fz
  }
  // A vertex as drawn, relative to the drawn terrain's lowest grid point (GROUND_SINK and elevation included).
  const rigid = place.elevation > 0
  const groundAt = Math.max(-place.elevation, 0)
  const lift = (x: number, y: number, z: number) => {
    const follow = rigid ? 0 : 1 - Math.min(1, Math.max(0, (y - groundAt) / GROUND_BLEND))
    if (mapMode === 'old') return y + mean + (riseUnder(x, z) - mean) * follow - GROUND_SINK + place.elevation
    const sunk = !rigid && y - groundAt <= BASE_BAND ? GROUND_SINK : 0
    return y + mean + (riseUnder(x, z) - mean) * follow - sunk + place.elevation
  }

  // Visible tops: up-facing triangles above the base, sampled about every metre.
  type Hit = { x: number; z: number; y: number; depth: number; material: string }
  const hits: Hit[] = []
  let topArea = 0, buriedArea = 0
  const points: { x: number; y: number; z: number; drawnY: number; area: number; material: string }[] = []
  for (const { position: p, index, material } of prims) {
    for (let t = 0; t < index.length; t += 3) {
      const v = [index[t], index[t + 1], index[t + 2]].map((k) => [p[k * 3], p[k * 3 + 1], p[k * 3 + 2]])
      const e1 = v[1].map((c, i) => c - v[0][i]), e2 = v[2].map((c, i) => c - v[0][i])
      const nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0]
      const area = Math.hypot(nx, ny, nz) / 2
      if (area < 1e-4 || ny / (2 * area) < 0.7) continue
      if (Math.max(v[0][1], v[1][1], v[2][1]) > GROUND_BLEND) continue
      const lifted = v.map(([x, y, z]) => lift(x, y, z))
      const k = Math.max(1, Math.ceil(Math.sqrt(area)))
      const share = area / ((k * (k + 1)) / 2)
      for (let a = 0; a < k; a++)
        for (let b = 0; a + b < k; b++) {
          const wa = (a + 1 / 3) / k, wb = (b + 1 / 3) / k, wc = 1 - wa - wb
          const at = (i: number) => wa * v[1][i] + wb * v[2][i] + wc * v[0][i]
          const y = at(1)
          if (y < LIFTED) continue
          points.push({ x: at(0), y, z: at(2), drawnY: wa * lifted[1] + wb * lifted[2] + wc * lifted[0], area: share, material: material.name })
        }
    }
  }
  const under = await Promise.all(points.map((q) => ground(...toLngLat(place, q.x, q.z))))
  points.forEach((q, i) => {
    topArea += q.area
    const depth = under[i] * EXAGGERATION - lowest - q.drawnY
    if (depth > BURIED) {
      buriedArea += q.area
      hits.push({ x: q.x, z: q.z, y: q.y, depth, material: q.material })
    }
  })

  const relief = Math.max(...raw) - Math.min(...raw)
  console.log(`${what} at ${place.lng}, ${place.lat}, bearing ${place.bearing}, elevation ${place.elevation}, map ${mapMode}${fill ? ', filled' : ''}`)
  console.log(`plan x ${f1(minX)}..${f1(maxX)}  z ${f1(minZ)}..${f1(maxZ)}; Mapterhorn relief over the 7x7 grid ${f2(relief)} m`)
  console.log('grid rise above the lowest point, drawn metres (rows minZ..maxZ, columns minX..maxX):')
  for (let j = 0; j <= n; j++) console.log('  ' + rise.slice(j * GROUND_GRID, (j + 1) * GROUND_GRID).map((r) => f1(r).padStart(5)).join(''))
  if (!hits.length) {
    console.log(`ok: no visible top above y ${LIFTED} m is buried more than ${BURIED} m (${f1(topArea)} m² checked)`)
    return
  }
  console.log(`BURIED: ${f1(buriedArea)} of ${f1(topArea)} m² of visible tops sit under the drawn terrain; deepest ${f2(Math.max(...hits.map((h) => h.depth)))} m`)
  // Worst spot per 5 m cell, deepest first.
  const cells = new Map<string, Hit>()
  for (const h of hits) {
    const key = `${Math.floor(h.x / 5)},${Math.floor(h.z / 5)}`
    if (!cells.has(key) || cells.get(key)!.depth < h.depth) cells.set(key, h)
  }
  const worst = [...cells.values()].sort((a, b) => b.depth - a.depth)
  for (const h of worst.slice(0, 12))
    console.log(`  x ${f1(h.x).padStart(6)}  z ${f1(h.z).padStart(6)}  top y ${f2(h.y)}  buried ${f2(h.depth)} m  (${h.material})`)
  if (worst.length > 12) console.log(`  ... and ${worst.length - 12} more 5 m cells`)
  process.exitCode = 1
}

function usage(): never {
  console.error('usage: bun tools/terrain.ts grid <lon> <lat> [half-m] [step-m] [--bearing <deg>]')
  console.error('       bun tools/terrain.ts check <id|model.glb> [--lng <deg> --lat <deg> --bearing <deg>] [--elevation <m>] [--map new|sink|old]')
  process.exit(1)
}

if (args[0] === 'grid') await grid()
else if (args[0] === 'check') await check()
else usage()
