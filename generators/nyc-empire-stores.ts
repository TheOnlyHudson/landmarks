/**
 * Empire Stores, 53–83 Water Street, DUMBO (Brooklyn Bridge Park):
 * procedural, CC0-1.0.
 * bun generators/nyc-empire-stores.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.3° (the
 * OSM outline's sides run 2.3° clockwise of north). The origin is the
 * centre of the OSM outline (relation/9710630, outer way 250402627), on
 * the ground. The site is level (Mapterhorn: 0.6 m across), so elevation 0.
 *
 * The building. A row of seven brick coffee warehouses built 1869 and 1885
 * between Water Street and the river (now the park), five storeys of dark
 * red-brown brick walls pierced in a dense regular grid of round-headed
 * windows with dark iron shutters, big round-arched openings on the ground
 * floor. Restored 2017 by S9 Architecture with a one-storey glass-and-
 * steel rooftop addition set back from the parapets and an open courtyard
 * cut into the block (Wikipedia, "Empire Stores"; NYC LPC, DUMBO Historic
 * District designation report, 2007).
 *
 * Numbers:
 *   plan 81.0 x 57.5 m: OSM outline (a clean rectangle in this frame).
 *   courtyard: OSM inner way 698881895, simplified to its rectangle
 *     x 14.5..24.5, y 9..25.6 (its slanted north-west corner is squared).
 *   walls 15.2 m: measured, lidar (USGS NY_NewYorkCity, 2017): roof
 *     17.8 m and street 2.6 m above the box's ground_min; the roof is
 *     nearly flat (16.7 m at the eaves, 18.0 m on the ridge line).
 *   rooftop addition 3.4 m, to OSM's height=18.6: published (OSM) minus the
 *     measured walls. It postdates the 2017 flight. NAIP shows a busy roof
 *     (a planted perimeter, terraces, raised pavilions, a skylight) that
 *     can't be read into exact volumes at 0.6 m; the addition is drawn as
 *     one long black-framed glass pavilion (as in "Empire Stores View 004"
 *     and the Clocktower photo from the north-west), 70 x 19.5 m, set back
 *     ~15 m from Water Street and ~23 m from the park side, clear of the
 *     courtyard, with a glass roof: estimated, footprint uncertain. NAIP's deep shadow in the north-east suggests the open
 *     courtyard may be larger than OSM's inner way, which is followed.
 *   storeys: ground 4.4 m and four of 2.7 m (sums to the lidar height):
 *     estimated. The real bays are ~3.85 m (21 on the long sides); they are
 *     drawn at ~5.4 m (15 and 11) with bigger openings, each a dark iron
 *     arch 3.5 m wide (the shutters folded open) round a 1.3 m window
 *     arch, and 3.6 m iron arches at street level, so the arches read at
 *     map distance rather than as a dot grid (lead review, round 1).
 *   colours: brick a dark weathered red-brown (photos), pulled to the
 *     palette; shutters and the addition's frame charcoal iron.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Empire Stores by S9Architecture", Ivane Katamashvili, CC BY-SA 4.0
 *     (Water Street front, from the south-west)
 *   "Empire Stores", R.scholz at English Wikipedia, CC BY-SA 3.0
 *     (before the restoration, the west end and Water Street)
 *   "Empire Stores March 2023", "... March 2023 001", Kidfly182,
 *     CC BY-SA 4.0 (the windows and shutters, close)
 *   "Empire Stores View 004", Kidfly182, CC BY-SA 4.0 (the roof terrace
 *     and the addition's dark steel and glass)
 *   USGS NAIP orthophoto (public domain): the roof plan.
 * Look-only: none.
 *
 * Style: one bold iron-and-glass arch per drawn bay (see storeys above). Night: the windows and the
 * addition's glass glow.
 *
 * Doubts: the courtyard's walls and how it opens to the park; the
 * addition's exact plan and its several heights (one height drawn); the
 * EMPIRE STORES entrance canopy on Water Street is not drawn (its place
 * along the front isn't certain from the photos).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, massing, prism, type Facade } from './nyc-570-lexington'

const X0 = -40.4, X1 = 40.55, Y0 = -28.8, Y1 = 28.7
const CX0 = 14.5, CX1 = 24.5, CY0 = 9, CY1 = 25.6     // courtyard
const WALL = 15.2, ADD = 3.4
const GROUND = 4.4, FLOOR = (15.2 - 4.4) / 4

const brick = new Part(), win = new Part(), roof = new Part(), iron = new Part(), glass = new Part(), glassRoof = new Part()

// ------------------------------------------------------------ the block ---
massing({
  wall: brick, win: null, roof, facade: null, bevel: 0.35,
  boxes: [
    [X0, Y0, CX0, Y1, WALL],
    [CX0, Y0, CX1, CY0, WALL],
    [CX0, CY1, CX1, Y1, WALL],
    [CX1, Y0, X1, Y1, WALL],
  ],
})

/** A round-headed panel d m proud of a wall a→b (outward to the right of travel). */
function arch(p: Part, a: [number, number], b: [number, number], s: number, w: number, z0: number, z1: number, d = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const n = [uy, -ux]
  const P = (u: number, z: number): V3 => [a[0] + ux * u + n[0] * d, a[1] + uy * u + n[1] * d, z]
  const r = w / 2, zs = z1 - r
  p.quad(P(s - r, z0), P(s + r, z0), P(s + r, zs), P(s - r, zs))
  const SEG = 6
  for (let k = 0; k < SEG; k++) {
    const t0 = (k / SEG) * Math.PI, t1 = ((k + 1) / SEG) * Math.PI
    p.tri(P(s, zs), P(s + r * Math.cos(t0), zs + r * Math.sin(t0)), P(s + r * Math.cos(t1), zs + r * Math.sin(t1)))
  }
}

/**
 * One bay's openings: a tall dark iron arch at street level (doors and
 * shutters), and above it on each storey a big round-arched opening, its
 * iron shutters folded open either side of the glazing, drawn as a wide
 * iron arch with a narrower window arch on it.
 */
function bay(a: [number, number], b: [number, number], s: number, upper = true) {
  arch(iron, a, b, s, 3.6, 0.25, GROUND - 0.2)
  arch(win, a, b, s, 1.8, 0.7, GROUND - 0.6, 0.08)
  if (!upper) return
  for (let f = 0; f < 4; f++) {
    const base = GROUND + f * FLOOR
    arch(iron, a, b, s, 3.5, base + 0.25, base + FLOOR - 0.15)
    arch(win, a, b, s, 1.3, base + 0.5, base + FLOOR - 0.4, 0.08)
  }
}
function grid(a: [number, number], b: [number, number], bays: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = L / bays
  for (let k = 0; k < bays; k++) bay(a, b, pitch * (k + 0.5))
}
// Counter-clockwise round the block, so each facade faces out to the right.
// Bays of ~5.4 m: fewer and larger than the real ~3.9 m, so each opening
// reads as a big dark arch at map distance (lead review, round 1).
grid([X0, Y0], [X1, Y0], 15)     // south, Water Street
grid([X1, Y0], [X1, Y1], 11)     // east
grid([X1, Y1], [X0, Y1], 15)     // north, the park
grid([X0, Y1], [X0, Y0], 11)     // west, towards the Tobacco Warehouse
// The courtyard's walls, three bays each.
const courtyard = (a: [number, number], b: [number, number], bays: number) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = L / bays
  for (let k = 0; k < bays; k++) bay(a, b, pitch * (k + 0.5))
}
courtyard([CX0, CY0], [CX0, CY1], 3)  // west wall of the courtyard, facing east
courtyard([CX1, CY1], [CX1, CY0], 3)  // east wall, facing west

// ------------------------------------------------------- rooftop addition ---
// A long black-framed glass pavilion along the middle of the roof, set back
// from Water Street and the park side and clear of the courtyard: glass
// walls between black piers, a glass roof inside a black frame.
const addFacade: Facade = { bay: 3.2, ratio: 0.86, floor: 2.6, group: 1, spandrel: 0, sill: 0.2, head: 0.45, minLength: 3 }
{
  const ring: [number, number][] = [[-35, -14], [35, -14], [35, 5.5], [-35, 5.5]]
  prism({ wall: iron, win: glass, roof: null, ring, z0: WALL - 0.1, z1: WALL + ADD, facade: addFacade, bevel: 0.2 })
  // the roof frame (a 0.8 m black rim) and the glass inside it
  const z = WALL + ADD, e = 0.8
  const [x0, y0] = ring[0], [x1, y1] = ring[2]
  iron.quad([x0, y0, z], [x1, y0, z], [x1, y0 + e, z], [x0, y0 + e, z])
  iron.quad([x0, y1 - e, z], [x1, y1 - e, z], [x1, y1, z], [x0, y1, z])
  iron.quad([x0, y0 + e, z], [x0 + e, y0 + e, z], [x0 + e, y1 - e, z], [x0, y1 - e, z])
  iron.quad([x1 - e, y0 + e, z], [x1, y0 + e, z], [x1, y1 - e, z], [x1 - e, y1 - e, z])
  glassRoof.quad([x0 + e, y0 + e, z - 0.02], [x1 - e, y0 + e, z - 0.02], [x1 - e, y1 - e, z - 0.02], [x0 + e, y1 - e, z - 0.02])
}

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: brick, material: finish('empire-brick', 0x7a5547) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: iron, material: finish('empire-iron', 0x4a4f57) },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: glassRoof, material: PALETTE.glass },
]
finishModel('Empire Stores', 'nyc-empire-stores', parts, {
  bearing: 2.3, elevation: 0, height: WALL + ADD, osm: 'relation/9710630',
})
