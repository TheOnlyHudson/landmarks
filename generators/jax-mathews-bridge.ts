/**
 * Mathews Bridge, Jacksonville (1953) — procedural, CC0-1.0, no textures.
 * bun generators/jax-mathews-bridge.ts
 *
 * The maroon-red steel cantilever through-truss carrying US 90 Alternate (the
 * Arlington Expressway) over the St. Johns River east of downtown, from
 * Talleyrand to Arlington. The OSM outline way/917868014 covers the whole
 * 2.25 km bridge, approaches included, so the model draws the structure
 * along all of it: the two trusses (a level top chord about 12.5 m over the
 * road, rising to the two peaked humps over the main piers), the top struts
 * and portals, the floor system under the roadway, the main piers (two
 * columns under a cap), the lighter two-column piers of the eastern spans, and the
 * concrete girder approaches on two-column bents: 700 m over the Talleyrand
 * docks to the west and 750 m over the water to the Arlington shore to the
 * east. No road surfaces: the map draws the four lanes.
 *
 * Frame: x across (+x to the south, the upstream side), y along the bridge
 * toward Arlington (bearing 89.6, the outline's long edges), z up, metres.
 * Anchor -81.622504, 30.32722, the outline's area centroid. z = 0 is the
 * map's water (Mapterhorn, -0.63 m NAVD88); the lidar's water reads 0.0 m
 * NAVD88, its heights are used +0.63 m.
 *
 * Roadway built to (lidar, FL_Peninsular_FDEM_Duval_2018, the median of the
 * lowest returns across ±6 m, +0.63 m): 9.3 m at the west end (y = -1124,
 * on its embankment), rising at 4.8 % to 40.2 at y = -485 and 43.0 at the
 * truss's west end (y = -418), cresting at 48.9 m at y = -210..-130, 47.7 at
 * the east main pier, 28.8 at the truss's east end (y = 370), then down at
 * 4.8 % to 7.0 m at y = 870, level to the east end (y = 1124) on the
 * Arlington shore.
 *
 * Replaces: the outline way/917868014 (man_made=bridge; no building or
 * building:part under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/917868014
 *   (Q6787059), 2,248 m long and 18.5 m wide.
 * - Lidar (measured; USGS 3DEP FL_Peninsular_FDEM_Duval_2018, flown 2018,
 *   2 m grid in a 50 m strip along the whole bridge): the trusses at
 *   x = ±10; the truss from y = -418 to 370; the top chord 12.5–13 m over
 *   the road (56.5 m at the west end, 61.4 level over the middle of the main
 *   span, 57.4 at y = 50 falling with the road to 41.7 at the east end);
 *   the humps' peaks 79.1 m at y = -298 and -49 over the main piers; wall
 *   piers showing beside the truss at y = 72, 156 and 238; the roadway
 *   profile above.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 89.6, 40 m):
 *   Talleyrand land 1.8–3.9 m from the west end to y = -500, water from
 *   y = -440 to 1060, the Arlington shore rising to 6.6 m at the east end.
 * - Published (Wikipedia, "Mathews Bridge"): opened 1953; cantilever
 *   truss; total length 7,375 ft (2,248 m, as the outline); main span
 *   810 ft (247 m; 246 m between the lidar peaks here); painted maroon.
 * Photos (evidence, Wikimedia Commons):
 * - Quintin Soloviev, "Mathews Bridge - Jacksonville.jpg", CC BY 4.0 (from
 *   the west bank, high: both humps, the Warren web with verticals, the
 *   two-column main piers and approach bents, the low eastern spans, the
 *   coral red in sun):
 *   https://commons.wikimedia.org/wiki/File:Mathews_Bridge_-_Jacksonville.jpg
 * - Nichos, "Mathews Bridge from the Saint Johns River.jpg", CC BY-SA 3.0
 *   (side-on from the south: the whole truss, pier rhythm, the slender
 *   eastern piers, the deeper maroon in flat light):
 *   https://commons.wikimedia.org/wiki/File:Mathews_Bridge_from_the_Saint_Johns_River.jpg
 * - Jonathan Zander (Digon3), "Matthews Bridge, Jacksonville FL Pano 690.jpg",
 *   CC BY-SA 3.0 (side-on from the south, the approaches' bents):
 *   https://commons.wikimedia.org/wiki/File:Matthews_Bridge,_Jacksonville_FL_Pano_690.jpg
 *
 * Numbers
 * - Main piers at y = -295 and -49 (lidar peaks); the west anchor arm ends
 *   on a bent at -418, the east anchor arm on the wall pier at 72; wall
 *   piers at 72, 156, 238 (lidar) and the end bent at 370.
 * - Humps: the top chord rises in a concave curve from about 60 m either
 *   side of each main pier to a short level crest over it (lidar, photos).
 * - Panels about 10 m (estimated from the photos' web density), a Warren web
 *   with verticals; chords 1.0 m wide; top struts every other panel point.
 * - Main piers: two columns 4 × 6 m on a pile cap, under a cap beam
 *   (photo-scaled). The eastern piers are two-column portals too, columns
 *   3.4 m square under a cap beam (photo-scaled from the Soloviev photo).
 * - Approaches: girders 2.0 m deep, bents of two columns every ~45 m on the
 *   high approaches and ~30 m on the low eastern trestle (estimated from the
 *   photos; the lidar can't see under the deck).
 * - Colour: maroon-red between the sunlit coral of the Soloviev photo and
 *   the deeper red of the Nichos photo, #b8635a; the floor system darker.
 *
 * Doubts
 * - Approach bent spacing and column shapes are estimated.
 * - The web is simplified to a Warren truss with verticals; the humps' web
 *   is subdivided on the real bridge.
 * - Night: no evidence of feature lighting on the truss; it is left unlit.
 */
import { Part, writeGlb, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { band, chamferedRect, footedLoft, piecewise, stations, truss } from './bridge-kit'

// ---- Ground (map terrain, metres above the map's water) --------------------
const groundY = piecewise([
  [-1130, 5.5], [-1100, 3.6], [-1060, 3.0], [-1020, 3.9], [-900, 3.1], [-820, 2.6], [-700, 2.3], [-540, 2.0],
  [-500, 1.8], [-460, 0.5], [-440, 0], [1060, 0], [1100, 1.2], [1130, 6.6],
])
const ground = (_x: number, y: number) => groundY(y)

// ---- Roadway and top chord (lidar +0.63) ------------------------------------
const road = piecewise([
  [-1124, 9.3], [-1110, 10.4], [-485, 40.2], [-460, 41.3], [-418, 43.2], [-380, 45.0], [-340, 46.5], [-300, 47.6],
  [-260, 48.4], [-220, 48.8], [-170, 48.9], [-130, 48.8], [-90, 48.4], [-50, 47.7], [0, 46.3], [50, 44.4],
  [100, 42.1], [370, 29.2], [420, 26.9], [800, 9.0], [850, 7.4], [880, 7.0], [1124, 7.0],
])
const Y_W = -1124, Y_E = 1124 // the outline's ends
const T0 = -418, T1 = 370 // the truss's ends (lidar)
const MAIN = [-295, -49]
const WALL = [72, 156, 238]
const topChord = piecewise([
  [T0, 55.8], [-412, 56.2], [-388, 57.4], [-364, 59.3], [-346, 62.0], [-334, 64.9], [-322, 68.4], [-310, 73.2],
  [-301, 77.4], [-298, 78.5], [-292, 78.5], [-286, 75.0], [-274, 69.3], [-262, 65.9], [-250, 63.2], [-238, 61.9],
  [-220, 61.2], [-124, 61.2], [-112, 61.7], [-100, 62.5], [-88, 64.6], [-76, 67.6], [-64, 72.6], [-55, 77.0],
  [-52, 78.7], [-46, 78.7], [-40, 75.4], [-28, 70.2], [-16, 66.3], [-4, 63.0], [8, 60.9], [26, 58.6], [50, 57.0],
  [T1 - 2, 41.6], [T1, 41.2],
])
const TX = 10 // the truss planes
const floorBot = (y: number) => road(y) - 1.8

// ---- Materials ---------------------------------------------------------------
const RED: MaterialSpec = { ...finish('mathews-red', 0xb8635a), doubleSided: true }
const SHADE: MaterialSpec = finish('mathews-red-shade', 0x7a4540)
const CONCRETE: MaterialSpec = finish('concrete', 0xc9c6bd)
const CONCRETE_SHADE: MaterialSpec = finish('concrete-shade', 0xa9a69e)
type Kit = { red: Part; shade: Part; concrete: Part; under: Part }

/** A box x0..x1, y0..y1, z0..z1 (z0 'ground' or clamped to it). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, r = 0) {
  footedLoft(p, ground, [
    { plan: chamferedRect(x0, x1, y0, y1, r), z: z0 },
    { plan: chamferedRect(x0, x1, y0, y1, r), z: z1 },
  ], 400)
}

// ---- Trusses -------------------------------------------------------------------
function trusses(k: Kit) {
  const pts = [T0, MAIN[0], MAIN[1], WALL[0], WALL[1], WALL[2], T1]
  const ys: number[] = []
  for (let i = 0; i + 1 < pts.length; i++) ys.push(...stations(pts[i], pts[i + 1], 10.5).slice(i ? 1 : 0))
  // the chords bend at every panel point near the humps, every other one elsewhere
  const hump = (y: number) => MAIN.some((m) => Math.abs(y - m) < 75)
  const curve = ys.filter((y, i) => hump(y) || i % 2 === 0 || y === T1)
  const opts = { chordW: 1.0, topD: 1.0, botD: 1.1, member: 0.55, post: 0.55, minWeb: 1.0, curve }
  const bot = (y: number) => road(y) - 0.3
  for (const s of [-1, 1]) truss(k.red, k.red, s * TX, ys, topChord, bot, opts)
  // top lateral struts at every other panel point; portals near the ends and either side of each crest
  ys.forEach((y, i) => {
    if (i % 2 === 0) box(k.red, -TX, TX, y - 0.4, y + 0.4, topChord(y) - 1.0, topChord(y) - 0.2)
  })
  for (const y of [T0 + 6, T1 - 6]) box(k.red, -TX, TX, y - 0.5, y + 0.5, road(y) + 6.0, road(y) + 7.4)
  // the floor system: a fascia between the trusses under the roadway, and its underside
  band(k.shade, -TX, TX, curve, (y) => road(y) - 0.5, floorBot, { bottom: true, ends: true })
}

// ---- Piers -------------------------------------------------------------------
function piers(k: Kit) {
  for (const p of MAIN) {
    box(k.concrete, -TX - 4, TX + 4, p - 6, p + 6, 'ground', 3.0, 1.0)
    for (const s of [-1, 1]) box(k.concrete, s * TX - 2.0, s * TX + 2.0, p - 3, p + 3, 3.0, floorBot(p) - 1.6, 0.5)
    box(k.concrete, -TX - 2.2, TX + 2.2, p - 3.2, p + 3.2, floorBot(p) - 4.0, floorBot(p), 0.4)
  }
  for (const p of WALL) {
    // two square columns under a cap beam, on a footing (Soloviev photo)
    box(k.concrete, -TX - 3, TX + 3, p - 4, p + 4, 'ground', 2.5, 0.8)
    for (const s of [-1, 1]) box(k.concrete, s * TX - 1.7, s * TX + 1.7, p - 1.7, p + 1.7, 2.5, floorBot(p) - 2.5, 0.4)
    box(k.concrete, -TX - 1.9, TX + 1.9, p - 2.0, p + 2.0, floorBot(p) - 3.0, floorBot(p), 0.3)
  }
}

// ---- Approaches ----------------------------------------------------------------
function bent(k: Kit, y: number, top: number) {
  const g = groundY(y)
  if (top - g < 1.5) return
  for (const s of [-1, 1]) box(k.concrete, s * 5.5 - 1.0, s * 5.5 + 1.0, y - 1.0, y + 1.0, 'ground', top - 1.2)
  box(k.concrete, -8.6, 8.6, y - 1.2, y + 1.2, top - 1.2, top)
}

function approach(k: Kit, y0: number, y1: number, bents: number[]) {
  const W = 9.25 // the deck's half-width (the outline's 18.5 m)
  const breaks = [-1110, -485, 420, 800, 850, 880].filter((y) => y > y0 && y < y1)
  const ys = [...new Set([y0, y1, ...breaks, ...bents])].sort((a, b) => a - b)
  const girderBot = (y: number) => Math.max(road(y) - 2.0, groundY(y))
  for (const s of [-1, 1])
    band(k.concrete, s * (W - 0.4), s * W, ys, (y) => road(y) + 0.9, girderBot, { out: true, in: true, top: true, ends: true })
  band(k.under, -W + 0.4, W - 0.4, ys, (y) => Math.max(road(y) - 0.4, groundY(y)), girderBot, { bottom: true, ends: true })
  for (const y of bents) bent(k, y, road(y) - 2.0)
}

function build(): Kit {
  const k: Kit = { red: new Part(), shade: new Part(), concrete: new Part(), under: new Part() }
  trusses(k)
  piers(k)
  // end bents of the truss
  bent(k, T0, floorBot(T0))
  bent(k, T1, floorBot(T1))
  const west = stations(Y_W + 20, T0, 45).slice(0, -1)
  const eastHigh = stations(T1, 870, 45).slice(1)
  const eastLow = stations(870, Y_E - 15, 30).slice(1)
  approach(k, Y_W, T0 - 1.2, west)
  approach(k, T1 + 1.2, Y_E, [...eastHigh, ...eastLow])
  return k
}

if (import.meta.main) {
  const k = build()
  const list = [
    { part: k.red, material: RED }, { part: k.shade, material: SHADE },
    { part: k.concrete, material: CONCRETE }, { part: k.under, material: CONCRETE_SHADE },
  ]
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Mathews Bridge', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, at the map water',
    bearing: 89.6, roadway: { westEnd: road(Y_W), westTrussEnd: road(T0), crest: road(-170), crestAt: -170, eastTrussEnd: road(T1), eastEnd: road(Y_E) },
  })
  console.log(`jax-mathews-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/jax-mathews-bridge.glb', import.meta.url), glb)
}
