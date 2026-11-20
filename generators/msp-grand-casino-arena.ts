/**
 * Grand Casino Arena (Xcel Energy Center until 2025; HOK Sport, opened 2000),
 * 199 West Kellogg Boulevard, Saint Paul: procedural, CC0-1.0.
 * bun generators/msp-grand-casino-arena.ts [out.glb]
 *
 * Frame: bearing 0 (+y north, +x east, z up here). The origin is the area
 * centroid of OSM relation/20658401 (-93.101063, 44.944769). y = 0 is the
 * lowest ground under the footprint (lidar 238.5 m, by Kellogg Boulevard at
 * the south-west); West 7th Street and the plaza on the north and west are
 * 1.7 m higher. An indoor arena, so `elevation` is 0.
 *
 * What makes it itself: the curved glass drum wrapping the north-west corner
 * (the Northwest Entrance on the West 7th / Kellogg plaza), with a pale
 * precast band over it; the big barrel-vaulted roof rising behind, its west
 * end a pale arch with a dark glass panel; the tan-and-brick tower at the
 * south-west corner and the brick Kellogg front.
 *
 * Sources
 * - OSM (ODbL): relation/20658401 (building=stadium, name Grand Casino Arena,
 *   old_name Xcel Energy Center, start_date 2000, Q1421388), outer ways
 *   43377562 + 1510403972 (the outline, followed here as drawn), and
 *   way/620849760 (building=stadium, an older inner outline of the same
 *   arena, under the roof).
 * - USGS 3DEP lidar MN_CentralMissRiver_5_B22 (flown 2022), 1 m grid,
 *   standard classes (class 18 here is scattered noise up to 80 m all over
 *   the box, so it was not used). Heights above y = 0: the outer concourse
 *   ring 23.3; the inner ring 26.8; the roof a barrel vault along x, crown
 *   36.3 at y = 5 falling to ~29.7 at y = 57 and ~27.6 at y = -52, the
 *   vault's ends at x = -45 and 43; the south-west tower 32; the low
 *   north-east corner (entry canopy and loading) 9.8.
 * - USGS NAIP (public domain): the white roof, the vault, the drum's curve.
 * - Photos (Wikimedia Commons), compared side by side with renders:
 *   Michael Barera, "Saint Paul April 2025 13 (Xcel Energy Center).jpg",
 *     CC BY-SA 4.0 (from the west: drum, precast band, vault end, the
 *     south-west tower and brick Kellogg front);
 *   AlexiusHoratius, "Xcel Energy Center St. Paul 5.jpg" and "Xcel Energy
 *     Center 5.JPG", CC BY-SA 3.0 (from the north-west);
 *   Rx StrangeLove, "XcelEnergyCenteroverview.jpg", public domain (from
 *     above: the vault's arched end, the drum, the precast band);
 *   Tony Webster, "Xcel Energy Center (15622401768).jpg" and
 *     "(17626335004).jpg", CC BY 2.0 (the curved glass, Northwest Entrance).
 * Published: opened 2000, about 17,954 seats for hockey (Wikipedia, "Grand
 *   Casino Arena"); renamed 2025.
 * Estimated from the photos (scaled to lidar): the glass band 1.7-20 with
 *   floor lines at 8 and 14; the vault end's dark glass panel; the tower's
 *   brick panels.
 * Left out: the rooftop sign (its letters changed in 2025 and no licensed
 *   photo of the new sign was found, so no sign is drawn), the video board,
 *   canopies, the skyway to RiverCentre (a separate OSM building).
 * Doubts: the east and north sides (against RiverCentre and the loading dock)
 *   are seen in no photo and are plain precast; the Kellogg front's brick is
 *   from one oblique photo.
 * Night: the drum and the vault's glass panel are `window` (the lit
 *   concourse glows); the roof stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, flatShape, ccw, outward, finishGlb, writeModel } from './sea-tacoma-union-station'

const STREET = 1.7 // West 7th and the plaza
const A_TOP = 23.3, B_TOP = 26.8, TOWER = 32, NE_LOW = 9.8
const GLASS0 = STREET, GLASS1 = 20
const VX0 = -45, VX1 = 43, VY0 = -52, VY1 = 57, VC = 5, CROWN = 36.3
const vault = (y: number) => CROWN - 6.6 * Math.pow(Math.abs(y - VC) / 52, 3)

// The OSM outline (relation/20658401), metres from the anchor, with the low
// north-east corner cut out into its own block.
const RING: XY[] = [[-72.8, 35.9], [-69.6, 42.0], [-66.5, 47.3], [-63.5, 51.5], [-58.7, 56.8], [-54.2, 61.7], [-49.7, 66.1], [-44.7, 69.9], [-39.4, 73.4], [-33.1, 77.0], [-31.9, 77.4], [-26.3, 79.7], [-19.5, 81.7], [-12.8, 82.3], [-8.0, 82.3], [-3.4, 81.8], [-5.3, 66.8], [45.9, 59.2], [47, 28], [80.2, 28], [76.8, -0.4], [75.8, -7.6], [71.1, -13.0], [66.3, -19.2], [63.0, -23.7], [61.7, -25.7], [58.6, -31.0], [56.6, -34.7], [52.8, -41.2], [48.3, -49.5], [45.3, -55.5], [41.8, -64.1], [38.6, -72.5], [35.4, -80.9], [26.2, -79.9], [25.5, -84.9], [24.9, -89.6], [19.1, -88.8], [19.6, -86.0], [6.2, -84.2], [-14.5, -81.4], [-25.2, -73.0], [-21.9, -68.9], [-78.6, -24.3], [-82.0, -28.6], [-89.9, -23.1], [-90.2, -15.0], [-86.1, -9.4], [-78.8, -1.5], [-79.2, 7.9], [-78.6, 15.2], [-77.7, 21.9], [-75.7, 28.6]]
const NE: XY[] = [[47, 28], [80.2, 28], [83.3, 52.1], [69.8, 53.8], [43.9, 56.9], [45.9, 59.2]]
const INNER: XY[] = [[-56, -36], [-30, -58], [36, -58], [50, -35], [50, -2], [76, -2], [78, 28], [50, 28], [50, 50], [42, 57], [-40, 60], [-56, 45]]
const TOWER_P: XY[] = [[-81, -27], [-63, -36.4], [-63, -20], [-81, -20]]

const faceOf = (a: XY, b: XY): { f: Face; len: number } => {
  const n = outward(a, b), len = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { f: { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }, len }
}

export function build() {
  const tan = new Part(), brick = new Part(), win = new Part(), roof = new Part(), trim = new Part()

  // ---------------------------------------------------------------- the concourse ring and the drum
  const ring = ccw(RING)
  prism(tan, roof, ring, 0, A_TOP)
  prism(tan, roof, ccw(NE), 0, NE_LOW)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const { f, len } = faceOf(a, b)
    if (mx < -6 && my > -3) {
      // the glass drum: one band of glass with two pale floor lines, mullions at every other bend
      flatShape(win, f, rect(-len / 2, GLASS0, len / 2, GLASS1), 0.06)
      for (const z of [8, 14]) flatShape(trim, f, rect(-len / 2, z, len / 2, z + 0.45), 0.09)
      if (i % 2 === 0) flatShape(trim, f, rect(-len / 2, GLASS0, -len / 2 + 0.4, GLASS1), 0.09)
    } else if (len > 40 && mx < 0 && my < 0) {
      // the Kellogg front: one broad brick wall between precast end piers, under the pale band
      flatShape(brick, f, rect(-len / 2 + 3, 0, len / 2 - 3, 20.5), 0.06)
      flatShape(tan, f, rect(-len / 2 + 3, 10, len / 2 - 3, 10.7), 0.1)
    }
  }

  // ---------------------------------------------------------------- the inner ring
  prism(tan, roof, ccw(INNER), A_TOP - 1, B_TOP)

  // ---------------------------------------------------------------- the barrel vault
  {
    const N = 14, ys: number[] = []
    for (let k = 0; k <= N; k++) ys.push(VY0 + ((VY1 - VY0) * k) / N)
    for (let k = 0; k < N; k++) {
      const y0 = ys[k], y1 = ys[k + 1], z0 = vault(y0), z1 = vault(y1)
      roof.quad([VX0, y0, z0], [VX1, y0, z0], [VX1, y1, z1], [VX0, y1, z1])
    }
    // the arched end walls, pale, with a dark glass panel at the west end
    for (const [x, sgn] of [[VX0, -1], [VX1, 1]] as [number, number][]) {
      const pts: V3[] = [[x, VY0, B_TOP - 0.5], ...ys.map((y): V3 => [x, y, vault(y)]), [x, VY1, B_TOP - 0.5]]
      const c: V3 = [x, (VY0 + VY1) / 2, B_TOP - 0.5]
      for (let k = 0; k < pts.length; k++) {
        const p = pts[k], q = pts[(k + 1) % pts.length]
        if (sgn < 0) tan.tri(c, p, q)
        else tan.tri(c, q, p)
      }
    }
    // the side walls under the vault's long edges
    tan.quad([VX0, VY0, B_TOP - 0.5], [VX1, VY0, B_TOP - 0.5], [VX1, VY0, vault(VY0)], [VX0, VY0, vault(VY0)])
    tan.quad([VX1, VY1, B_TOP - 0.5], [VX0, VY1, B_TOP - 0.5], [VX0, VY1, vault(VY1)], [VX1, VY1, vault(VY1)])
    // the west end's dark glass panel (s = -y on a west face)
    flatShape(win, { o: [VX0, 0, 0], n: [-1, 0] }, rect(-VC - 13, B_TOP + 0.6, -VC + 13, vault(VC) - 2.2), 0.06)
    flatShape(win, { o: [VX1, 0, 0], n: [1, 0] }, rect(VC - 10, B_TOP + 0.6, VC + 10, vault(VC) - 2.6), 0.06)
  }

  // ---------------------------------------------------------------- the south-west tower
  {
    const t = ccw(TOWER_P)
    prism(tan, tan, t, 0, TOWER)
    for (let i = 0; i < t.length; i++) {
      const { f, len } = faceOf(t[i], t[(i + 1) % t.length])
      if (len > 10) flatShape(brick, f, rect(-len / 2 + 2.6, 0, len / 2 - 2.6, TOWER - 4.5), 0.06)
    }
  }

  return finishGlb('Grand Casino Arena', [
    { part: tan, material: finish('arena-precast', 0xdfd0b4) },
    { part: brick, material: finish('arena-brick', 0xa86c5a) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('arena-roof', 0xc9cdd0) },
    { part: trim, material: PALETTE.trim },
  ], {
    bearing: 0, height: TOWER,
    replaces: ['relation/20658401', 'way/620849760'],
  })
}

if (import.meta.main) await writeModel('msp-grand-casino-arena', build())
