/**
 * The map's 3D terrain under a model: Mapterhorn, the DEM the map draws.
 *
 *   bun tools/terrain.ts grid <lon> <lat> [half-m=60] [step-m=5] [--bearing <deg>] [--zoom <z>]
 *   bun tools/terrain.ts check <id|model.glb> [--entrances] [--scene-out review.glb] [--lng <deg> --lat <deg> --bearing <deg>] [--elevation <m>] [--zoom <z>]
 *
 * `grid` prints the ground in a model's own frame (x east, z south, metres,
 * turned by --bearing like a placement) as heights above the lowest point
 * in the table, so a builder can see how the site slopes before modelling
 * its base, plaza or steps.
 *
 * `check` stands a model on the terrain the way the map does (Parchment's
 * `landmark-layer.ts` and `landmark-ground.ts`) and reports where its
 * visible tops end up under the ground and where its base stands off it.
 * The map reads Mapterhorn (terrarium, 512 px tiles, z15, about 2 m a pixel
 * in the US, from USGS 3DEP lidar). It sets every model on the terrain as
 * one rigid body and never bends it. It finds whether the model follows the
 * DEM (its feet built down to the terrain, as a coaster's or a bridge's
 * are) with landmark-ground.ts. Under a flat model it replaces the terrain
 * inside the footprint (its plan coverage, grown by 2 m) with a smooth fill
 * from the ground just outside, never higher than the real ground, so
 * podiums, steps and rockwork that lidar counts as ground don't poke through
 * the model. It reads that ground on a 7 x 7 grid over the plan extent and
 * puts y = 0 on the lowest point, 0.3 m under it. A model that follows the
 * DEM keeps the bare ground and is moved by the one offset that puts its own
 * ground on the map's, with no sink. Then `elevation` moves the whole model.
 * The terrain is drawn life-size (Parchment PR #913). `fill.ts` and
 * `landmark-coverage.ts` under `tools/parchment/` are copies of the map's own
 * code.
 *
 * A model passes when no upward-facing surface more than 0.2 m above its
 * base (a deck, a plaza, a step, a planter) is buried by more than 0.15 m,
 * and no point of its base (for a flat model what stands at y = 0, for one
 * that follows the DEM its feet) stands more than 0.25 m over the ground.
 * Nothing bends a model to fit, so the fixes are in the model: build the
 * base, decks, podiums and steps to the ground's real heights from the
 * evidence (`grid` shows the slope; the terrain is not evidence for what the
 * fill takes out), run walls and feet down to the ground they stand on, and
 * if the terrain under the site is wrong (a demolished hill, a new dig),
 * leave the model true to the photos and say so in the header.
 *
 * Heights are cached under ~/.cache/landmarks/mapterhorn.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { readGlb, Part, writeGlb, type V3 } from '../generators/mesh'
import { entranceThresholds } from './entrances'
import { groundContacts, groundModel, groundSink, modelGround } from '../web/landmark-ground'
import type { Catalog } from '../src/catalog'
// Parchment's own fill and coverage, so this mirrors the map exactly.
import { fillAt, groundFill, type GroundFill } from './parchment/fill'
import { planCoverage } from './parchment/landmark-coverage'
import { readCatalog } from '../src/catalog-files'
import type { Scene } from './render'

const ROOT = join(import.meta.dir, '..')
const TILES = 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'
/** Mapterhorn's z15 covers lidar countries; elsewhere it stops lower (z12 at Giza), so `--zoom` reads that. */
let Z = 15
const SIZE = 512
const CACHE = join(homedir(), '.cache', 'landmarks', 'mapterhorn')

/** As the map draws it; see `terrain.ts` and `landmark-layer.ts` in Parchment. */
const EXAGGERATION = 1
const GROUND_GRID = 7

/** What `check` tolerates: a visible top more than LIFTED above the base, buried more than BURIED; a point of the base FLOATS over the ground. */
const LIFTED = 0.2
const BURIED = 0.15
const FLOATS = 0.25
/** Metres over its own ground a contact is still base: a flat model's floor, or a terrain model's feet (CONTACT_BAND in landmark-ground.ts). */
const BASE_BAND = 0.05, FEET_BAND = 1

const tiles = new Map<string, Promise<Float32Array>>()
const loadedTiles = new Map<string, Float32Array>()

/** A tile's pixels if loaded, else null, starting its load. */
function tileNow(x: number, y: number): Float32Array | null {
  const key = `${Z}/${x}/${y}`
  const found = loadedTiles.get(key)
  if (found) return found
  void tile(x, y).then(d => loadedTiles.set(key, d), () => {})
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
    await Promise.all([...tiles].filter(([key]) => key.startsWith(`${Z}/`)).map(([, t]) => t))
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
export async function height(lng: number, lat: number): Promise<number> {
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

export type Place = { lng: number; lat: number; bearing: number; elevation: number }

/** As `modelToLngLat` in Parchment: x east, z south, turned clockwise by the bearing. */
export function toLngLat({ lng, lat, bearing }: Place, x: number, z: number): [number, number] {
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

/**
 * Stand a model on the terrain the way the map does, whole: returns `lift`,
 * which takes a vertex in the model's frame (x east, y up, z south) to its
 * drawn height in metres above `lowest`, the lowest drawn ground under the
 * model, and is the same `shift` for every vertex; and `ground`, the drawn
 * ground height at a point (filled under a flat model).
 */
export async function placeOnTerrain(prims: ReturnType<typeof readGlb>, place: Place) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const { position: p } of prims)
    for (let i = 0; i < p.length; i += 3) {
      minX = Math.min(minX, p[i]), maxX = Math.max(maxX, p[i])
      minZ = Math.min(minZ, p[i + 2]), maxZ = Math.max(maxZ, p[i + 2])
    }

  let minY = Infinity, maxY = -Infinity
  for (const { position: p } of prims) for (let i = 1; i < p.length; i += 3) minY = Math.min(minY, p[i]), maxY = Math.max(maxY, p[i])
  const contacts = groundContacts(prims.map(p => ({ ...p, node: -1 })), { minX, maxX, minZ, maxZ })
  const contactGround = await Promise.all(contacts.map(([x, , z]) => height(...toLngLat(place, x, z))))
  const own = modelGround(contacts, contactGround, 1)
  // No fill under a raised model, nor under one built on the DEM.
  const fill = place.elevation <= 0 && !own.follows ? await fillUnder(prims, place, [minX, minY, minZ], [maxX, maxY, maxZ]) : null
  const ground = (lng: number, lat: number) => filledHeight(lng, lat, fill)

  // The map's view of the ground: a 7 x 7 grid over the plan extent, exaggerated.
  const n = GROUND_GRID - 1
  const gridAt = (i: number, j: number): [number, number] => [minX + ((maxX - minX) * i) / n, minZ + ((maxZ - minZ) * j) / n]
  const at = (k: number) => toLngLat(place, ...gridAt(k % GROUND_GRID, Math.floor(k / GROUND_GRID)))
  const raw = await Promise.all(Array.from({ length: GROUND_GRID ** 2 }, (_, k) => ground(...at(k))))
  const bare = await Promise.all(Array.from({ length: GROUND_GRID ** 2 }, (_, k) => height(...at(k))))
  const sink = groundSink(own, true)
  const grounded = groundModel(raw.map(h => h * EXAGGERATION), EXAGGERATION, own, 1, sink, bare)
  const lowest = grounded.lowest
  const rise = raw.map(h => h * EXAGGERATION - lowest)
  const shift = grounded.offset - sink + place.elevation
  const lift = (_x: number, y: number, _z: number) => y + shift
  return { lift, shift, ground, lowest, own, contacts, contactGround, fill, raw, rise, n, bounds: { minX, maxX, minY, maxY, minZ, maxZ } }
}

/** The ground drawn around a model in a terrain scene: how far past its plan, as a share of its size, and at least this many metres. */
const SURROUND = 0.35, SURROUND_MIN = 12
const TERRAIN_COLOUR = [0.37, 0.42, 0.31]

/**
 * Put a render scene on the map's terrain, as the map draws it: the whole
 * model moved by `placeOnTerrain` (the same grounding, fill and sink the map
 * applies, and the placement's `elevation`), and the filled Mapterhorn
 * ground around it added as a surface. Materials, floodlighting and lamps are
 * kept, so the night view still works. The scene stays in the model's own
 * frame; turn it to its bearing afterwards. Returns the model's height above
 * the lowest ground, as placed.
 */
export async function groundScene(scene: Scene, glb: Uint8Array, place: Place): Promise<number> {
  // Mapterhorn's z15 covers lidar countries only (not Mexico City, not Giza):
  // step down a zoom where a tile is missing, as the map does.
  const start = Z
  try {
    for (let z = start; ; z--) {
      Z = z
      try { return await groundAt(scene, glb, place) } catch (err) {
        if (z <= 10 || !/: 404$/.test((err as Error).message)) throw err
      }
    }
  } finally { Z = start }
}

async function groundAt(scene: Scene, glb: Uint8Array, place: Place): Promise<number> {
  const { lift, ground, lowest, bounds: { minX, maxX, minZ, maxZ } } = await placeOnTerrain(readGlb(glb), place)
  let top = -Infinity
  for (const pr of scene.primitives) {
    for (let k = 0; k < pr.p.length; k += 3) {
      pr.p[k + 1] = lift(pr.p[k], pr.p[k + 1], pr.p[k + 2])
      top = Math.max(top, pr.p[k + 1])
    }
  }
  const margin = Math.max(SURROUND_MIN, SURROUND * Math.max(maxX - minX, maxZ - minZ))
  const x0 = minX - margin, z0 = minZ - margin, span = Math.max(maxX - minX, maxZ - minZ) + 2 * margin
  const cells = Math.min(80, Math.max(16, Math.ceil(span / 2))), step = span / cells
  const row = cells + 1, p = new Float32Array(row * row * 3), nrm = new Float32Array(row * row * 3)
  const h = await Promise.all(Array.from({ length: row * row }, (_, k) =>
    ground(...toLngLat(place, x0 + (k % row) * step, z0 + Math.floor(k / row) * step))))
  for (let k = 0; k < row * row; k++) {
    const i = k % row, j = Math.floor(k / row)
    p.set([x0 + i * step, h[k] - lowest, z0 + j * step], k * 3)
    const dx = (h[j * row + Math.min(i + 1, cells)] - h[j * row + Math.max(i - 1, 0)]) / (2 * step)
    const dz = (h[Math.min(j + 1, cells) * row + i] - h[Math.max(j - 1, 0) * row + i]) / (2 * step)
    const l = Math.hypot(dx, 1, dz)
    nrm.set([-dx / l, 1 / l, -dz / l], k * 3)
  }
  const ix = new Uint32Array(cells * cells * 6)
  for (let j = 0, t = 0; j < cells; j++) for (let i = 0; i < cells; i++) {
    const a = j * row + i, b = a + 1, c = a + row, d = c + 1
    ix.set([a, c, b, b, c, d], t); t += 6
  }
  const mat = { name: 'terrain', doubleSided: true, pbrMetallicRoughness: { baseColorFactor: [...TERRAIN_COLOUR, 1], roughnessFactor: 1 } }
  scene.primitives.unshift({ p, n: nrm, uv: null, ix, mat, flood: null })
  return top
}

/** Turn a scene to a placement's bearing (degrees clockwise from north) and refresh its bounds. */
export function turnScene(scene: Scene, bearing: number) {
  const t = (bearing * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t)
  for (const pr of scene.primitives) for (const a of [pr.p, pr.n]) for (let k = 0; k < a.length; k += 3) {
    const x = a[k], z = a[k + 2]
    a[k] = x * c - z * s
    a[k + 2] = x * s + z * c
  }
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity]
  for (const pr of scene.primitives) for (let k = 0; k < pr.p.length; k += 3) {
    const v = [pr.p[k], -pr.p[k + 2], pr.p[k + 1]]
    for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], v[i]); hi[i] = Math.max(hi[i], v[i]) }
  }
  scene.lo = lo; scene.hi = hi
  scene.centre = lo.map((v, i) => (v + hi[i]) / 2)
  scene.radius = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2
}

async function check() {
  const lngO = option('--lng'), latO = option('--lat'), bearingO = option('--bearing'), elevationO = option('--elevation')
  const entrances = args.includes('--entrances')
  const sceneOut = option('--scene-out')
  const what = args[1]
  if (!what) usage()
  let file = what
  let place: Place = { lng: NaN, lat: NaN, bearing: 0, elevation: 0 }
  if (!what.endsWith('.glb')) {
    const catalog = readCatalog(ROOT)
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
    console.error(`${what}: not placed in the catalog; give --lng, --lat and --bearing`)
    process.exit(1)
  }

  const prims = readGlb(new Uint8Array(readFileSync(file)))
  const { lift, shift, ground, lowest, own, contacts, contactGround, fill, raw, rise, n, bounds: { minX, maxX, minZ, maxZ } } = await placeOnTerrain(prims, place)
  if (place.elevation <= 0 && !own.follows && !fill) console.log('warning: no fill (ground did not load)')
  console.log(`model ground: ${JSON.stringify(own)}; minimum ${lowest}; whole model moved ${f2(shift)} m`)

  // Optional review scene: the placed geometry with filled Mapterhorn.
  if (sceneOut) {
    const parts = prims.map(({ position: p, index, material }) => {
      const part = new Part()
      for (let t = 0; t < index.length; t += 3) {
        const v = [...index.slice(t, t + 3)].map(k =>
          [p[k * 3], -p[k * 3 + 2], lift(p[k * 3], p[k * 3 + 1], p[k * 3 + 2])] as V3)
        part.tri(v[0], v[1], v[2])
      }
      const rgb = material.color.slice(0, 3).map(c => Math.round(255 * c ** (1 / 2.2)))
      return { part, material: { name: material.name, color: (rgb[0] << 16) | (rgb[1] << 8) | rgb[2] } }
    })
    const terrain = new Part(), step = 2
    for (let z = minZ - 6; z < maxZ + 6; z += step) for (let x = minX - 6; x < maxX + 6; x += step) {
      const corners = [[x, z], [x, z + step], [x + step, z + step], [x + step, z]]
      const v = await Promise.all(corners.map(async ([x, z]) =>
        [x, -z, await ground(...toLngLat(place, x, z)) - lowest] as V3))
      terrain.quad(v[0], v[1], v[2], v[3])
    }
    parts.push({ part: terrain, material: { name: 'review-terrain', color: 0xa3ad96 } })
    writeFileSync(sceneOut, writeGlb('Terrain grounding review', parts))
    console.log(`terrain review scene: ${sceneOut}`)
  }

  // Unlike the top-surface check, this catches floating entrance thresholds.
  if (entrances) {
    const doors = entranceThresholds(prims)
    if (!doors.length) throw new Error('No door material found for entrance verification')
    console.log(`entrances: checking ${doors.length} connected door leaves against Mapterhorn`)
    for (const [i, door] of doors.entries()) {
      const gaps = await Promise.all(door.points.map(async ([x, y, z]) =>
        lowest + lift(x, y, z) - await ground(...toLngLat(place, x, z))))
      const highest = Math.max(...gaps)
      const lowestGap = Math.min(...gaps)
      console.log(`  door ${i + 1}: threshold ${f2(lowestGap)}..${f2(highest)} m relative to terrain`)
      if (highest > BURIED || lowestGap < -0.75) process.exitCode = 1
    }
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
      const lifted = v.map(([x, y, z]) => lift(x, y, z))
      // Nothing higher than the highest ground under the plan can be buried.
      if (Math.min(...lifted) > Math.max(...rise) + 1) continue
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

  // The base: a flat model's floor at y = 0, or a terrain model's feet on its own ground.
  const base = contacts.flatMap(([x, y, z], i) => {
    const over = own.follows ? y - (contactGround[i] + own.offset) : y
    return over <= (own.follows ? FEET_BAND : BASE_BAND) ? [{ x, y, z }] : []
  })
  const gaps = await Promise.all(base.map(async (b) => ({ ...b, gap: lowest + lift(b.x, b.y, b.z) - await ground(...toLngLat(place, b.x, b.z)) * EXAGGERATION })))
  const floating = place.elevation > 0 ? [] : gaps.filter((g) => g.gap > FLOATS).sort((a, b) => b.gap - a.gap)

  const relief = Math.max(...raw) - Math.min(...raw)
  console.log(`${what} at ${place.lng}, ${place.lat}, bearing ${place.bearing}, elevation ${place.elevation}${fill ? ', filled' : ''}`)
  console.log(`plan x ${f1(minX)}..${f1(maxX)}  z ${f1(minZ)}..${f1(maxZ)}; Mapterhorn relief over the 7x7 grid ${f2(relief)} m`)
  console.log('grid rise above the lowest point, drawn metres (rows minZ..maxZ, columns minX..maxX):')
  for (let j = 0; j <= n; j++) console.log('  ' + rise.slice(j * GROUND_GRID, (j + 1) * GROUND_GRID).map((r) => f1(r).padStart(5)).join(''))
  if (!hits.length) console.log(`ok: no visible top above y ${LIFTED} m is buried more than ${BURIED} m (${f1(topArea)} m² checked)`)
  else {
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
  if (!floating.length) console.log(`ok: no point of the base stands more than ${FLOATS} m over the drawn terrain (${gaps.length} checked)`)
  else {
    console.log(`FLOATS: ${floating.length} of ${gaps.length} base points stand over the drawn terrain; highest ${f2(floating[0].gap)} m`)
    for (const g of floating.slice(0, 12))
      console.log(`  x ${f1(g.x).padStart(6)}  z ${f1(g.z).padStart(6)}  base y ${f2(g.y)}  over the ground by ${f2(g.gap)} m`)
    if (floating.length > 12) console.log(`  ... and ${floating.length - 12} more`)
    process.exitCode = 1
  }
}

function usage(): never {
  console.error('usage: bun tools/terrain.ts grid <lon> <lat> [half-m] [step-m] [--bearing <deg>]')
  console.error('       bun tools/terrain.ts check <id|model.glb> [--entrances] [--scene-out review.glb] [--lng <deg> --lat <deg> --bearing <deg>] [--elevation <m>] [--zoom <z>]')
  process.exit(1)
}

if (import.meta.main) {
  if (args[0] === 'grid') await grid()
  else if (args[0] === 'check') await check()
  else usage()
}
