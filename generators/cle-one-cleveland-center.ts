/**
 * One Cleveland Center (1983, Hugh Stubbins and Associates), Cleveland:
 * procedural, CC0-1.0.
 * bun generators/cle-one-cleveland-center.ts [out.glb]
 *
 * Map frame: x across the tower (toward bearing 101), y along it (toward
 * bearing 11), z up, metres; placed at bearing 11. The origin is the OSM
 * outline's area centroid (-81.6891930, 41.5036786); z = 0 is the ground
 * (lidar ground_min 195.5 m NAVD88; E 9th Street and the plaza lie within
 * 2 m of it).
 *
 * Form: a 31-storey silver aluminium tower banded with strip windows, its
 * plan a long hexagon whose ends come to points, with small angled notches
 * at the shoulders. The top is the "chisel": a steep gable roof in the same
 * silver, its ridge running the length of the tower from point to point, so
 * the pointed ends rise as tall gables and the long faces stop at the eaves.
 * A sloped glass entrance atrium leans against the west face and a lower
 * aluminium wing stands on the east.
 *
 * Sources
 * - OSM (ODbL): outline way/164342755 (height 137, 31 levels, Q2023965),
 *   tower part way/1535194757 (147, gabled, roof height 13), both replaced.
 *   The tower plan is the part's; the wings are the outline's remainder.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 0.5 m grid read in a frame turned to bearing 11: the ridge
 *   138.7 m runs straight from the north point to the south point; the roof
 *   falls about 1.2 m per metre to eaves of about 121 m on the east face and
 *   119 m on the west; the east wing's roof 16.8 m; the west atrium slopes
 *   from about 9.5 m at its outer edge to 15 m against the tower. The OSM
 *   part's 147 m is the ridge plus masts; the published 137 m and the lidar
 *   ridge agree.
 * - Published: 450 ft (137 m), 31 storeys (Wikipedia "One Cleveland
 *   Center").
 * - Photos: Geowizical, "One Cleveland Center, 2023.jpg" (Wikimedia Commons,
 *   CC BY-SA 4.0: the south-west corner from E 9th Street, the banding, the
 *   lobby); Tim Evanson, "Erie Tower - One Cleveland Center - Cleveland Ohio"
 *   and "... 02" (Flickr, CC BY-SA 2.0: from the south, high up: the chisel
 *   roof, the pointed south end, the silver colour); The Cleveland Kid, "One
 *   Cleveland Center" (Flickr, CC BY 2.0: from below, the gable ends);
 *   Eddie~S, "National City Bank's One Cleveland Center" (Flickr, CC BY 2.0:
 *   the glass entrance atrium); joshdbrown, "one cleveland center - front"
 *   and "- side" (Flickr, CC BY 2.0).
 *   Look-only (CC BY-NC-ND / NC-SA, not used for shapes or colours):
 *   Mr.TinDC, alexabboud, Shoreway Sean and David441491 on Flickr.
 * Estimated: the storey height (3.9 m) and two-storey window groups; the
 *   lobby (two storeys of darker glass); the bay rhythm (6 m); the atrium's
 *   slope drawn as one plane.
 * Colours: the aluminium is a light cool silver in daylight; the strip
 *   windows read dark grey-blue between the spandrels.
 * Left out: masts on the ridge, the entrance signs, the skyway to the
 *   Galleria.
 * The gable ends above the last window band are plain aluminium, as the
 *   Evanson photo shows.
 * Doubts: the lidar's long-face edges are sparse (a band of scattered
 *   returns at 110-114 m about 3 m outside the west eave), so the eave line
 *   follows the OSM plan; the strip windows are grouped two storeys to a
 *   band (the real building is banded floor by floor).
 * Night: strip windows glow; the atrium glass stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, capRing, outward, triangulate, finishGlb } from './sea-columbia-center'
import { wallQuad, panels, type Grid, writeModel } from './cle-200-public-square'

const C: XY = [1.03, -2.21] // the outline's centroid in the raw frame
const at = (p: XY): XY => [p[0] - C[0], p[1] - C[1]]

// the tower part, raw frame, counter-clockwise from the north point
const TOWER: XY[] = ([
  [1.6, 34.1], [-4.5, 28.9], [-11.9, 21.9], [-14.2, 17.9], [-16.4, -23.1], [-10.5, -28.0],
  [0.2, -38.8], [14.2, -27.5], [16.4, -16.4], [16.5, 12.4], [15.5, 21.0], [8.4, 28.0],
] as XY[]).map(at)
const WEST: XY[] = ([[-14.2, 17.9], [-29.3, 12.5], [-29.6, -9.25], [-16.4, -23.1]] as XY[]).map(at)
const EAST: XY[] = ([[16.4, -16.4], [20.8, -15.9], [35.8, -11.8], [35.9, 5.2], [16.5, 12.4]] as XY[]).map(at)

const RIDGE = 138.7, SLOPE = 1.2
const NTIP = TOWER[0], STIP = TOWER[6]
/** signed distance from the ridge line (positive east) */
function side(p: XY) {
  const d: XY = [NTIP[0] - STIP[0], NTIP[1] - STIP[1]], L = Math.hypot(d[0], d[1])
  return ((p[0] - STIP[0]) * d[1] - (p[1] - STIP[1]) * d[0]) / L
}
const roofZ = (p: XY) => RIDGE - SLOPE * Math.abs(side(p))

const STOREY = 3.9, LOBBY = 8, WTOP = 117.5
const alu = new Part(), win = new Part(), glass = new Part(), roof = new Part(), cap = new Part()

/** A vertical wall a→b from z0 to tops za, zb (linear), split low for the terrain. */
function wall(part: Part, a: XY, b: XY, z0: number, za: number, zb: number) {
  const zl = Math.min(za, zb)
  wallQuad(part, a, b, z0, zl)
  if (za - zl > 0.01) part.tri([a[0], a[1], zl], [b[0], b[1], zl], [a[0], a[1], za])
  if (zb - zl > 0.01) part.tri([a[0], a[1], zl], [b[0], b[1], zl], [b[0], b[1], zb])
}

/** A planar cap over ring r with heights z(p) (r must be planar in z). */
function slopedCap(part: Part, r: XY[], z: (p: XY) => number) {
  for (const [i, j, k] of triangulate(r)) part.tri([...r[i], z(r[i])] as V3, [...r[j], z(r[j])] as V3, [...r[k], z(r[k])] as V3)
}

function build() {
  // ------------------------------------------------------------ the tower
  const office: Grid = { bay: 5.4, pier: 0.6, group: 2 * STOREY, spandrel: 3.4, from: LOBBY, edge: 0.7, head: 0.6, foot: 0.4 }
  const lobbyGrid: Grid = { bay: 2.6, pier: 0.4, group: LOBBY, spandrel: 0, from: 0, edge: 0.6, head: 1.0, foot: 0.2 }
  for (let i = 0; i < TOWER.length; i++) {
    const a = TOWER[i], b = TOWER[(i + 1) % TOWER.length]
    const za = roofZ(a), zb = roofZ(b)
    wall(alu, a, b, 0, za, zb)
    // window bands stop on one level a storey under the lowest eave; the gable ends above are plain aluminium
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panels(win, a, b, 0, LOBBY, lobbyGrid)
    const n = Math.max(1, Math.round(L / 6))
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n
      const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
      const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
      panels(win, A, B, LOBBY, WTOP, { ...office, bay: L / n, pier: 0, edge: 0.2, head: 0 })
    }
  }
  // the chisel roof: two planes either side of the ridge, from point to point
  slopedCap(cap, TOWER.slice(0, 7), roofZ)
  slopedCap(cap, [...TOWER.slice(6), TOWER[0]], roofZ)

  // ------------------------------------------------------------ the west atrium: a glass lean-to
  const wx = Math.min(...WEST.map((p) => p[0])), tx = -15.3 - C[0]
  const atriumZ = (p: XY) => 9.5 + ((p[0] - wx) / (tx - wx)) * 5.5
  const w = ccw(WEST)
  for (let i = 0; i < w.length; i++) {
    const a = w[i], b = w[(i + 1) % w.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o = outward(a, b)
    if (o[0] > 0.9) continue // against the tower
    wall(glass, a, b, 0, atriumZ(a), atriumZ(b))
    void m
  }
  slopedCap(glass, w, atriumZ)

  // ------------------------------------------------------------ the east wing
  const e = ccw(EAST)
  const wingGrid: Grid = { bay: 4.2, pier: 0.8, group: 8, spandrel: 2.4, from: 0, edge: 0.8, head: 1.0, foot: 0.6 }
  for (let i = 0; i < e.length; i++) {
    const a = e[i], b = e[(i + 1) % e.length], o = outward(a, b)
    if (o[0] < -0.9) continue // against the tower
    wallQuad(alu, a, b, 0, 16.8)
    panels(win, a, b, 0, 16.8, wingGrid)
  }
  capRing(roof, e, 16.8)

  return finishGlb('cle-one-cleveland-center', 'One Cleveland Center', [
    { part: alu, material: finish('occ-aluminium', 0xd5d9dd) },
    { part: cap, material: finish('occ-roof', 0xdfe2e5) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 11, height: RIDGE, replaces: ['way/164342755', 'way/1535194757'] })
}

if (import.meta.main) await writeModel('cle-one-cleveland-center', build())
