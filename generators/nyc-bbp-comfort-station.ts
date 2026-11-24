/**
 * Pier 1 Pavilion (the park's gatehouse and comfort station), Brooklyn
 * Bridge Park: procedural, CC0-1.0.
 * bun generators/nyc-bbp-comfort-station.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the outline is drawn
 * from OSM as it lies). The origin is the centre of the extents of OSM
 * relation/19396006 ("Pier 1 Pavilion", alt_name "Brooklyn Bridge Park
 * Gatehouse", building=yes, height=5), a multipolygon whose outer way is
 * the canopy's oval and whose inner way is its oculus.
 *
 * Which building. The batch asked for "the Brooklyn Bridge Park bathroom
 * building". OSM's two amenity=toilets buildings near the park are small
 * NYC Parks comfort stations outside it: way/241823715 is in Pierrepont
 * Playground (Brooklyn Heights) and way/245118715 is in Squibb Park. The
 * Pier 6 comfort station shares a plain block building with Fornino
 * (way/245114038; photos "Pier 6 Fornino and Comfort Station"). The park's
 * architecturally distinctive restroom building is this one: the Pier 1
 * Pavilion by Tod Williams Billie Tsien Architects with Michael Van
 * Valkenburgh Associates, completed April 2025 (AIA 2026 Small Project
 * Award), whose programme is the park's main public restrooms (its first
 * family and gender-neutral ones), a concession (Breads Bakery) and
 * utility rooms, raised above the floodplain (twbta.com project page;
 * brooklynbridgepark.org "Pier 1 Pavilion"; 6sqft.com, 2025).
 *
 * The building: three pale stone blocks under one big oval cantilevered
 * canopy with a thin pale rim, an underside of yellow-green porcelain
 * penny tile, PV shingles on top, and an oculus over the open gathering
 * space between the blocks (published: twbta.com, 6sqft.com).
 *
 * Numbers:
 *   canopy plan and oculus: OSM relation/19396006, ~30.2 x 21.5 m, the
 *     long axis about 70–80° east of north; oculus ~4.6 m across.
 *   canopy top 6.4 m above the floor, its pale fascia 1.55 m deep (about a
 *     quarter of the wall height, as in "006" and "009"), soffit rising
 *     from 4.6 m to 4.85 m at the rim over the outer 2 m: estimated from the
 *     Tdorante10 photos. The bistro chairs under the canopy in "008"
 *     (~0.85 m) give ~6.5 m to the top, and in "006" and "009" the canopy is
 *     about four times as wide as it is tall, which on OSM's 30 m oval
 *     (5,000 sq ft published by TWBTA; OSM's oval is 490 m²) gives ~7 m.
 *     OSM's height=5 (source not given) looks low and is not used.
 *   walls 4.6 m tall, up to the soffit: estimated, same photos. They
 *     follow the oval, set back 2.2 m from the canopy edge (estimated from
 *     the overhang in "008"), with the gathering space cut in on the north
 *     under the oculus, between the lettered block (east) and the
 *     concession (west), as the photos from the north show.
 *   wall plan: estimated. The north side (photos) (camera north, looking south: the
 *     Watchtower building on the left, 1 Hotel behind) shows an east block
 *     with the BROOKLYN BRIDGE PARK lettering, a west block with the
 *     concession window and menu boards, and the open seating space between them under
 *     the oculus; the third block is put to the south, behind, where no
 *     licensed photo shows it.
 *   floor 0.9 m above y = 0: the map's terrain (Mapterhorn, older than the
 *     2025 pavilion) rises 0.9 m across the footprint where the real floor
 *     sits on a raised plaza about 1.5 m above the Old Fulton side (nine
 *     risers in the photos). The blocks run down to y = 0 so nothing floats.
 *   Lidar: none useful (NY_NewYorkCity is from 2017; the pavilion is 2025).
 *
 * Photos (Wikimedia Commons, EVIDENCE, all Tdorante10, CC BY-SA 4.0):
 *   "Brooklyn Bridge Park td (2026-01-18) 006 - Pier 1, Entrance Pavilion,
 *     1 Hotel Brooklyn Bridge" (from the north-east)
 *   "... 008 - Pier 1, Entrance Pavilion" (from the north, close: the rim,
 *     the soffit, the east block's concession)
 *   "... 009 - Pier 1, Entrance Pavilion" (from the north)
 *   "... 011 - Pier 1, Entrance Pavilion, 1 Hotel Brooklyn Bridge"
 *   "... 014 - Pier 1, Entrance Pavilion" (from the north, wide)
 * Look-only: none.
 *
 * Night: the concession window and door glazing are `window`; the soffit's
 * downlights are given as a `_FLOODLIGHT` wash on the blocks under it.
 *
 * Doubts: the south and west sides are unphotographed (no openings
 * drawn there); the roof's colour: published as PV shingles, but USGS NAIP predates the
 * 2025 pavilion (it shows trees and parking there) and no licensed photo
 * shows the roof, so it is drawn light grey; the floor
 * height against the map's terrain.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, quadN, unit, prism, insetRing, type XY } from './nyc-570-lexington'

const TAU = Math.PI * 2
// OSM outer way 1417858158 and inner way 1417858157, metres from the anchor.
const OUTER: XY[] = [[-14.65, -5.71], [-15.12, -3.99], [-15.12, -2.51], [-14.79, -1.13], [-14.11, 0.42], [-13.02, 1.92], [-11.22, 3.87], [-9.41, 5.53], [-7.61, 6.82], [-5.73, 7.95], [-3.58, 8.97], [-1.90, 9.61], [0.21, 10.17], [2.24, 10.59], [4.48, 10.80], [6.14, 10.83], [7.72, 10.65], [9.14, 10.21], [10.84, 9.40], [12.26, 8.28], [13.62, 6.78], [14.52, 4.98], [15.02, 3.38], [15.08, 1.39], [14.94, -0.43], [14.26, -2.26], [13.35, -3.89], [11.68, -5.44], [9.81, -6.87], [7.66, -7.96], [5.74, -8.78], [3.76, -9.45], [1.60, -9.96], [-1.16, -10.35], [-4.06, -10.54], [-6.57, -10.38], [-9.01, -10.07], [-10.78, -9.59], [-11.91, -8.97], [-13.00, -8.12], [-13.88, -7.05]]
const INNER: XY[] = [[-5.93, 4.41], [-6.17, 3.60], [-6.11, 2.73], [-5.69, 1.92], [-5.10, 1.27], [-4.10, 0.83], [-3.14, 0.93], [-2.38, 1.43], [-1.80, 2.23], [-1.70, 3.26], [-2.13, 4.41], [-2.95, 5.22], [-3.87, 5.53], [-4.73, 5.47], [-5.31, 5.13]]

const FLOOR = 0.9
const SOFF = FLOOR + 4.6, RIM_LO = FLOOR + 4.85, TOP = FLOOR + 6.4, SLOPE_IN = 2.0

const stone = new Part(), rim = new Part(), soffit = new Part(), roof = new Part(), win = new Part(), red = new Part()

// Oculus centre and radius from the inner way.
const OC: XY = [INNER.reduce((s, p) => s + p[0], 0) / INNER.length, INNER.reduce((s, p) => s + p[1], 0) / INNER.length]
const OR = INNER.reduce((s, p) => s + Math.hypot(p[0] - OC[0], p[1] - OC[1]), 0) / INNER.length

/** Where a ray from the oculus centre at angle a leaves the outer outline. */
function hit(a: number): XY {
  const d: XY = [Math.cos(a), Math.sin(a)]
  let best = Infinity
  for (let i = 0; i < OUTER.length; i++) {
    const p = OUTER[i], q = OUTER[(i + 1) % OUTER.length]
    const ex = q[0] - p[0], ey = q[1] - p[1]
    const den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-12) continue
    const t = ((p[0] - OC[0]) * ey - (p[1] - OC[1]) * ex) / den
    const s = ((p[0] - OC[0]) * d[1] - (p[1] - OC[1]) * d[0]) / den
    if (t > 0 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.min(best, t)
  }
  return [OC[0] + d[0] * best, OC[1] + d[1] * best]
}

// ------------------------------------------------------------ the canopy ---
// Sampled by rays from the oculus centre (the oval is convex, so every ray
// leaves it once): the top, the rim, the soffit sloping up to the rim, the
// flat soffit, and the oculus's inner wall. The oculus is open to the sky.
{
  const N = 64
  const O: XY[] = [], H: XY[] = []
  for (let k = 0; k < N; k++) {
    const a = (k / N) * TAU
    O.push(hit(a))
    H.push([OC[0] + OR * Math.cos(a), OC[1] + OR * Math.sin(a)])
  }
  const n: V3[] = O.map((_, k) => {
    const p = O[(k + N - 1) % N], q = O[(k + 1) % N]
    return unit([q[1] - p[1], -(q[0] - p[0]), 0])
  })
  const M: XY[] = O.map((o, k) => [o[0] - n[k][0] * SLOPE_IN, o[1] - n[k][1] * SLOPE_IN])
  const at = (p: XY, z: number): V3 => [p[0], p[1], z]
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    roof.quad(at(H[k], TOP), at(O[k], TOP), at(O[j], TOP), at(H[j], TOP))
    quadN(rim, at(O[k], RIM_LO), at(O[j], RIM_LO), at(O[j], TOP), at(O[k], TOP), [n[k], n[j], n[j], n[k]])
    const sa = unit([n[k][0] * 0.27, n[k][1] * 0.27, -1]), sb = unit([n[j][0] * 0.27, n[j][1] * 0.27, -1])
    quadN(soffit, at(O[k], RIM_LO), at(M[k], SOFF), at(M[j], SOFF), at(O[j], RIM_LO), [sa, sa, sb, sb])
    soffit.quad(at(M[k], SOFF), at(H[k], SOFF), at(H[j], SOFF), at(M[j], SOFF))
    const ia = unit([-(H[k][0] - OC[0]), -(H[k][1] - OC[1]), 0]), ib = unit([-(H[j][0] - OC[0]), -(H[j][1] - OC[1]), 0])
    quadN(rim, at(H[j], SOFF), at(H[k], SOFF), at(H[k], TOP), at(H[j], TOP), [ib, ia, ia, ib])
  }
}

// ------------------------------------------------------------ the walls ---
// Curved pale stone walls following the oval, set back 2.2 m from the canopy
// edge, with the open gathering space cut in on the north side under the
// oculus, between the lettered (east) and concession (west) blocks.
const SET = 2.2
const ccw = [...OUTER].reverse()                       // OSM runs clockwise
const ring = insetRing(ccw, SET)
const NOTCH = { x0: -9.5, x1: 1.2, y: -0.3 }
const inNotch = (p: XY) => p[1] > 0 && p[0] > NOTCH.x0 && p[0] < NOTCH.x1
const plan: XY[] = []
for (let i = 0; i < ring.length; i++) {
  const p = ring[i], q = ring[(i + 1) % ring.length]
  if (!inNotch(p)) plan.push(p)
  // the ring runs west along the north side: on entering the notch, go in and across
  if (!inNotch(p) && inNotch(q)) plan.push([NOTCH.x1, NOTCH.y], [NOTCH.x0, NOTCH.y])
}
prism({ wall: stone, win: null, roof: null, ring: plan, z0: 0, z1: SOFF, facade: null, bevel: 0.3 })

/** A flat panel 0.05 m proud of the wall segment a→b (outside to the right), centred at t (0–1), w wide. */
function panel(p: Part, a: XY, b: XY, t: number, w: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
  const c = t * L
  p.quad(P(c - w / 2, z0), P(c + w / 2, z0), P(c + w / 2, z1), P(c - w / 2, z1))
}
// The concession's window and, east of it, its small red menu board, on the
// curved wall just west of the gathering space (the right-hand block in the
// photos taken from the north).
{
  const k = plan.findIndex((p) => p[0] === NOTCH.x0 && p[1] === NOTCH.y) + 1
  const a = plan[k], b = plan[(k + 1) % plan.length], c = plan[(k + 2) % plan.length]
  panel(red, a, b, 0.5, Math.min(1.6, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.8), FLOOR + 1.1, FLOOR + 2.5)
  panel(win, b, c, 0.5, Math.min(2.0, Math.hypot(c[0] - b[0], c[1] - b[1]) * 0.8), FLOOR + 0.9, FLOOR + 2.9)
}

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: stone, material: { ...finish('pier1-stone', 0xd8d2c6), floodlight: (_p: V3, nn: V3) => (Math.abs(nn[2]) < 0.5 ? 0.6 : 0) } },
  { part: rim, material: finish('pier1-fascia', 0xece6d6) },
  { part: soffit, material: finish('pier1-soffit', 0xd6d197) },
  { part: roof, material: finish('pier1-roof', 0xc4c8c6) },
  { part: win, material: PALETTE.window },
  { part: red, material: finish('pier1-menu', 0xb04a40) },
]
finishModel('Pier 1 Pavilion', 'nyc-bbp-comfort-station', parts, {
  bearing: 0, elevation: 0, height: TOP, osm: 'relation/19396006',
})
