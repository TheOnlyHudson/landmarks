/**
 * Isaiah D. Hart Bridge, Jacksonville (1967) — procedural, CC0-1.0, no
 * textures.
 * bun generators/jax-hart-bridge.ts
 *
 * The green continuous cantilever through-truss carrying US 1 Alternate
 * (the Hart Bridge Expressway) over the St. Johns River east of downtown.
 * One placement for the structure inside the OSM outline way/1375991581:
 * the two trusses, their top chord one long low arch over the whole truss,
 * the bottom chords sweeping down in Y-shaped knees onto the two main piers,
 * the top lateral struts and end portals, the floor system under the
 * roadway, the main and end piers, and the concrete approach spans on the
 * south (south-east) bank, where the outline runs 145 m past the truss.
 * No road surfaces: the map draws the four lanes between the trusses.
 *
 * The outline was drawn after the 2019–2020 rebuild that took down the
 * elevated ramps at the downtown (north-west) end: it stops at the truss's
 * north-west end, which stands on land, so the model draws nothing past it.
 *
 * Frame: x across (+x to the ENE, downstream), y along the bridge toward
 * downtown (bearing 328.1, the line through the outline's end midpoints),
 * z up, metres. Anchor -81.627122, 30.315081, the outline's area centroid.
 * z = 0 is the map's water (Mapterhorn, -0.63 m NAVD88); the lidar's
 * lowest return (the water) reads -0.43 m, so lidar heights are used
 * +0.2 m.
 *
 * Roadway built to (lidar, FL_Peninsular_FDEM_Duval_2018, the lowest
 * return between the trusses, +0.2 m): 25.5 m at the south end
 * (y = -470), 33.3 at the truss's south end (y = -318), 43.4 at the south
 * main pier (y = -96), crest 46.1 m at y = 60..120, 43.6 at the north main
 * pier (y = 236), 33.8 m at the truss's north end (y = 461); grades about
 * 5 % south and 4.5 % north. The north end lands on the downtown bank at
 * 33.6 m, in the air (the expressway continues on its new approach outside
 * the outline); the south end is in the air at 25.5 m.
 *
 * Replaces: the outline way/1375991581 (man_made=bridge; no building or
 * building:part under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/1375991581,
 *   937 m long and 20 m wide.
 * - Lidar (measured; USGS 3DEP FL_Peninsular_FDEM_Duval_2018, flown 2018,
 *   2 m grid over the whole bridge): the top chord, highest 76.8 m at
 *   y = 60..80, 69.5 m over both main piers, falling smoothly to 46 m at the
 *   truss's square ends, y = -318 and 461; the trusses at x ≈ ±10.5; the
 *   roadway profile above. The flight predates the ramp removal, which
 *   lies outside the outline.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 327.4):
 *   water from y = -405 to 440; the south end 3–4 m, downtown 1.9 m.
 * - Published (Wikipedia, "Hart Bridge"): opened 1967; continuous
 *   cantilever truss; main span 1,088 ft (332 m); clearance 141 ft (43 m);
 *   painted green; lit with LEDs since 2015.
 * Photos (evidence, Wikimedia Commons):
 * - DXR, "Hart Bridge, Jacksonville FL, West view 20160706 1.jpg",
 *   CC BY-SA 4.0 (the whole truss side-on: the arched top chord, the knees
 *   onto the main piers, the paired-column main piers, the south bank
 *   approach columns, the green):
 *   https://commons.wikimedia.org/wiki/File:Hart_Bridge,_Jacksonville_FL,_West_view_20160706_1.jpg
 * - Jonathan Zander (Digon3), "Hart Bridge, Jacksonville FL Pano
 *   Contrast.jpg", CC BY-SA 3.0 (side-on: the knee depth, panel rhythm):
 *   https://commons.wikimedia.org/wiki/File:Hart_Bridge,_Jacksonville_FL_Pano_Contrast.jpg
 * - Jonathan Zander (Digon3), "Hart Bridge, Jacksonville FL 623.JPG",
 *   CC BY-SA 3.0 (oblique: the Warren web with verticals, the top struts):
 *   https://commons.wikimedia.org/wiki/File:Hart_Bridge,_Jacksonville_FL_623.JPG
 *
 * Numbers
 * - Main piers at y = -96 and 236 (the 332 m span centred on the lidar
 *   crest of the top chord; the photos place them at the same fractions,
 *   0.33 and 0.74 of the truss, within their perspective).
 * - Knees: the bottom chord leaves the floor 48 m either side of a main
 *   pier and meets it 25 m over the water (photo-scaled from the 46 m deck).
 * - Panels about 8.3 m (40 in the main span, 28 in each anchor arm;
 *   estimated from the photos' lattice density); chords 1.0 m wide, web
 *   members 0.5 m; top struts every fourth panel point.
 * - Main piers: two columns 4.5 × 6 m under the trusses joined by a strut
 *   under the knees, on a pile cap 2.5 m over the water; end piers two
 *   columns under the floor (photo-scaled).
 * - south approach: concrete girders 2.2 m deep, bents of two columns
 *   at y = -361, -397, -433 (estimated from the DXR photo's rhythm).
 * - Colour: the mint green of the daylight photos, #6cb89a; the floor
 *   system a darker green; concrete piers.
 * - Night: the trusses are lit (LED floodlighting): the green steel carries
 *   `_FLOODLIGHT`.
 *
 * Doubts
 * - Panel counts and the web pattern are simplified to a Warren truss with
 *   verticals; the photos can't settle the exact panel length.
 * - The approach bent positions are estimated; NAIP can't see under the
 *   deck.
 * - The LEDs show many colours; the night look is the floodlit green.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { band, chamferedRect, footedLoft, piecewise, stations, truss } from './bridge-kit'

// ---- Ground (map terrain, metres above the map's water) --------------------
const groundY = piecewise([[-475, 3.8], [-455, 3.5], [-430, 3.0], [-415, 1.0], [-405, 0], [437, 0], [447, 1.8], [470, 1.9]])
const ground = (_x: number, y: number) => groundY(y)

// ---- Roadway and top chord (lidar +0.2) ---------------------------------------
const road = piecewise([
  [-471, 25.5], [-400, 29.4], [-325, 33.3], [-260, 36.3], [-200, 39.4], [-140, 42.2], [-96, 43.4], [-40, 45.3],
  [20, 45.9], [60, 46.1], [120, 46.0], [180, 45.1], [236, 43.6], [300, 41.4], [360, 38.6], [420, 35.6], [467, 33.6],
])
const Y_S = -471, Y_N = 467 // the outline's ends
const T0 = -318, T1 = 461 // the truss's ends (lidar)
const PIERS = [-96, 236]
const topChord = piecewise([
  [T0, 45.6], [-312, 46.5], [-280, 49.0], [-240, 52.6], [-200, 57.5], [-160, 62.9], [-120, 67.5], [-96, 69.7],
  [-56, 72.7], [-16, 74.8], [24, 76.2], [56, 76.8], [88, 76.8], [120, 76.2], [160, 74.8], [200, 72.6], [236, 69.8],
  [280, 65.7], [320, 60.6], [360, 55.2], [400, 50.9], [440, 47.7], [456, 46.3], [T1, 45.4],
])
const TX = 10.5 // the truss planes
const KNEE_L = 48, KNEE_FOOT = 25 // the knees' reach and their foot over the water
const floorBot = (y: number) => road(y) - 1.6
const bottomChord = (y: number) => {
  let z = floorBot(y)
  for (const p of PIERS) {
    const t = Math.abs(y - p) / KNEE_L
    if (t < 1) z = Math.min(z, KNEE_FOOT + (floorBot(p) - KNEE_FOOT) * (1 - (1 - t) ** 2))
  }
  return z
}

// ---- Materials ---------------------------------------------------------------
const GREEN: MaterialSpec = { ...finish('hart-green', 0x6cb89a), doubleSided: true, floodlight: (_p, n) => (n[2] > 0.7 ? 0.4 : 0.9) }
const SHADE: MaterialSpec = finish('hart-green-shade', 0x3f6b5c)
const CONCRETE: MaterialSpec = finish('concrete', 0xc9c6bd)
const CONCRETE_SHADE: MaterialSpec = finish('concrete-shade', 0xa9a69e)
type Kit = { green: Part; shade: Part; concrete: Part; under: Part }

/** A box x0..x1, y0..y1, z0..z1 (z0 'ground' or clamped to it). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, r = 0) {
  footedLoft(p, ground, [
    { plan: chamferedRect(x0, x1, y0, y1, r), z: z0 },
    { plan: chamferedRect(x0, x1, y0, y1, r), z: z1 },
  ], 400)
}

// ---- Trusses -------------------------------------------------------------------
function trusses(k: Kit) {
  // web panel points: 28 in each anchor arm, 40 in the main span; the chords bend every other one
  const ys = [...new Set([...stations(T0, PIERS[0], 8.2), ...stations(PIERS[0], PIERS[1], 8.3), ...stations(PIERS[1], T1, 8.2)].map((v) => Math.round(v * 100) / 100))].sort((a, b) => a - b)
  const curve = [...new Set([...ys.filter((_, i) => i % 2 === 0), T1, ...PIERS.flatMap((p) => stations(p - KNEE_L, p + KNEE_L, 6))])].filter((y) => y >= T0 && y <= T1).sort((a, b) => a - b)
  const opts = { chordW: 1.0, topD: 1.0, botD: 1.0, member: 0.5, post: 0.55, minWeb: 1.0, curve }
  for (const s of [-1, 1]) truss(k.green, k.green, s * TX, ys, topChord, bottomChord, opts)
  // top lateral struts at every other panel point, and the portals at the ends
  ys.forEach((y, i) => {
    if (i % 4 === 0 && topChord(y) - road(y) > 7) box(k.green, -TX, TX, y - 0.4, y + 0.4, topChord(y) - 1.0, topChord(y) - 0.2)
  })
  for (const y of [T0 + 12, T1 - 12]) box(k.green, -TX, TX, y - 0.5, y + 0.5, road(y) + 5.8, road(y) + 7.0)
  // the floor system: a fascia between the trusses under the roadway, and its underside
  band(k.shade, -TX, TX, curve, (y) => road(y) - 0.5, floorBot, { bottom: true, ends: true })
  // the sway frame across each knee, at its foot
  for (const p of PIERS) box(k.green, -TX, TX, p - 0.6, p + 0.6, KNEE_FOOT + 0.4, KNEE_FOOT + 2.4)
}

// ---- Piers -------------------------------------------------------------------
function piers(k: Kit) {
  for (const p of PIERS) {
    box(k.concrete, -TX - 5, TX + 5, p - 7, p + 7, 'ground', 2.5, 1.0)
    for (const s of [-1, 1]) box(k.concrete, s * TX - 2.25, s * TX + 2.25, p - 3, p + 3, 2.5, KNEE_FOOT + 0.4, 0.6)
    box(k.concrete, -TX, TX, p - 2.5, p + 2.5, KNEE_FOOT - 2.6, KNEE_FOOT + 0.4)
  }
  // end piers of the truss: two columns and a cap under the floor
  for (const y of [T0, T1]) {
    for (const s of [-1, 1]) box(k.concrete, s * TX - 1.6, s * TX + 1.6, y - 1.6, y + 1.6, 'ground', floorBot(y) - 1.2, 0.4)
    box(k.concrete, -TX - 1.5, TX + 1.5, y - 1.8, y + 1.8, floorBot(y) - 2.4, floorBot(y))
  }
}

// ---- south approach ---------------------------------------------------------
const BENTS = [-361, -397, -433]
function approach(k: Kit) {
  const W = 10.2 // the deck's half-width (the outline's 20 m)
  const ys = [...new Set([...stations(Y_S, T0 - 1.8, 12), ...BENTS])].sort((a, b) => a - b)
  for (const s of [-1, 1]) {
    // the girder fascia and parapet at each edge
    band(k.concrete, s * (W - 0.4), s * W, ys, (y) => road(y) + 1.0, (y) => road(y) - 2.2, { out: true, in: true, top: true, ends: true })
  }
  band(k.under, -W + 0.4, W - 0.4, ys, (y) => road(y) - 0.4, (y) => road(y) - 2.0, { bottom: true, ends: true })
  for (const y of BENTS) {
    for (const s of [-1, 1]) box(k.concrete, s * 6 - 1.0, s * 6 + 1.0, y - 1.0, y + 1.0, 'ground', road(y) - 3.4, 0.3)
    box(k.concrete, -W + 0.5, W - 0.5, y - 1.2, y + 1.2, road(y) - 3.4, road(y) - 2.0)
  }
}

function build(): Kit {
  const k: Kit = { green: new Part(), shade: new Part(), concrete: new Part(), under: new Part() }
  trusses(k)
  piers(k)
  approach(k)
  return k
}

if (import.meta.main) {
  const k = build()
  const list = [
    { part: k.green, material: GREEN }, { part: k.shade, material: SHADE },
    { part: k.concrete, material: CONCRETE }, { part: k.under, material: CONCRETE_SHADE },
  ]
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Hart Bridge', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, at the map water',
    bearing: 328.1, roadway: { southEnd: road(Y_S), southTrussEnd: road(T0), crest: road(90), crestAt: 90, northEnd: road(Y_N) },
  })
  console.log(`jax-hart-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/jax-hart-bridge.glb', import.meta.url), glb)
}
