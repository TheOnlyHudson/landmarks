/**
 * Conference Center (2000, Zimmer Gunsul Frasca), 60 West North Temple,
 * Salt Lake City: the 21,000-seat hall of The Church of Jesus Christ of
 * Latter-day Saints, on the block north of Temple Square. Procedural,
 * CC0-1.0. bun generators/slc-conference-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the block is on the
 * city grid). Origin: the area centroid of OSM relation/6146196
 * (-111.8924092, 40.7727615). y = 0 is the lowest ground under the outline:
 * West Temple, at the west side (lidar ground 1297.9 m). The block rises
 * about 8 m to the North Temple / Main Street corner and about 20 m to the
 * north-east corner; the uphill walls run down to y = 0 and sink into it.
 *
 * Form, from the photos and lidar: a vast, nearly square granite mass whose
 * flat top is a roof garden (meadow, conifer and aspen planters, a circular
 * garden round the chandelier skylight), stepping down at its edges in
 * planted terraces: in a staircase on the south-west toward the West Temple
 * / North Temple corner, in long terraces down the east (Main Street) and
 * north sides. On the south front, over the plaza: a projecting entrance
 * portico of five tall square openings (doors 15-19) under a frieze band
 * and a row of tall recessed windows; a taller granite cube at the
 * south-east corner; west of centre the slender square tower and spire,
 * standing on a wider base on the roof edge. The theater (Conference Center
 * Theater) is the lower block on the west side, along West Temple, with
 * rows of tall narrow windows.
 *
 * Numbers, all measured from lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016,
 * flown 2013, 1 m grid, heights above y = 0 here): the main roof rises from
 * 27.3 m at the south edge to about 31 m at the north (drawn as a plane
 * rising 3 cm per metre north); the terraces at 8.4, 13, 20.5, 23 and
 * 25.5 m; the south-east cube 35 m; the theater roof 14.5 m and its north
 * end 22.5 m; the tower base 10 x 10 m to 34 m, the shaft about 5 m square
 * to 51 m (drawn 6 m square, a little bolder for phone size). The spire
 * needle above (about 7 m, to 58 m) is too thin for the lidar: estimated
 * from p2 and p6. Plan of each tier from the OSM outline and the lidar
 * grid, simplified to rectangles (to within about 2 m). Window rows,
 * portico openings and the tower slots estimated from p2, p5, p6.
 * Spire position: west of centre on the south front (lidar, NAIP, p5, p6),
 * not at the south-east corner.
 *
 * Photos (EVIDENCE):
 *  p2 https://commons.wikimedia.org/wiki/File:LDS_Conference_Center_(41596000491).jpg
 *     Ben P L, CC BY-SA 2.0 (the south portico, doors 15-19, from the south-east;
 *     identified by its 4962 x 3378 frame)
 *  p5 https://commons.wikimedia.org/wiki/File:Overview_LDS_Conference_Center_from_LDS_Church_Office_Building_-_panoramio.jpg
 *     Jordan W., CC BY-SA 3.0 (from the south-east, above: roof garden, terraces, tower)
 *  p6 https://commons.wikimedia.org/wiki/File:Lds_conference_center_panoramic_view_slc_utah.jpg
 *     Ricardo630 (public domain): the south and west fronts from West Temple
 * NAIP (USGS, public domain) for the roof plan. Lidar as above.
 * Doubts: the north side is seen only from above (p5); the terraces'
 * planting is drawn as flat green tops; the south plaza steps are
 * simplified to two levels; the waterfall is left out (water is the map's).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, panel, poly, prism, rect, type Face, type XY } from './slc-beehive-house'

const gran = new Part(), trim = new Part(), win = new Part(), garden = new Part(), paving = new Part(), glass = new Part()

/** The main roof: a plane rising to the north. */
const roofZ = (_x: number, y: number) => 29.2 + 0.03 * y

/** A rectangular block whose top follows f (walls in pieces of at most 5 m). */
function blockF(side: Part, top: Part, x0: number, y0: number, x1: number, y1: number, f: (x: number, y: number) => number) {
  const ring: XY[] = rect(x0, y0, x1, y1)
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % 4]
    const k = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 5))
    for (let s = 0; s < k; s++) {
      const p = (u: number): [number, number] => [ax + (bx - ax) * u, ay + (by - ay) * u]
      const [px, py] = p(s / k), [qx, qy] = p((s + 1) / k)
      side.quad([px, py, 0], [qx, qy, 0], [qx, qy, f(qx, qy)], [px, py, f(px, py)])
    }
  }
  poly(top, ring.map(([x, y]) => [x, y, f(x, y)] as V3), [0, 0, 1])
}
/** A flat block: granite walls, a top in `top`, and a granite coping band at the top edge. */
function block(top: Part, x0: number, y0: number, x1: number, y1: number, z: number) {
  prism(gran, rect(x0, y0, x1, y1), 0, z, false)
  poly(top, rect(x0, y0, x1, y1).map(([x, y]) => [x, y, z] as V3), [0, 0, 1])
}

// ------------------------------------------------------- the main tier ---
// the meadow and planters (garden) round a paved stair-plaza that climbs
// from the tower toward the circular garden (NAIP, p5)
blockF(gran, garden, -66, -50, -10, 62, roofZ)
blockF(gran, paving, -10, -50, 60, -5, roofZ)
blockF(gran, garden, -10, -5, 60, 62, roofZ)
blockF(gran, garden, 60, -50, 66, 62, roofZ)
blockF(gran, garden, -70, -32, -66, 62, roofZ)
blockF(gran, garden, -52, -62, -10, -50, roofZ)
blockF(gran, paving, -10, -62, 60, -50, roofZ)
blockF(gran, garden, 60, -62, 66, -50, roofZ)
blockF(gran, garden, -37, -73, -10, -62, roofZ)
blockF(gran, paving, -10, -73, 66, -62, roofZ)
// the chandelier skylight in its circular garden (NAIP)
{
  const cx = 39, cy = 25, h = 5.5, zb = roofZ(cx, cy)
  box(gran, cx - h - 0.6, cy - h - 0.6, cx + h + 0.6, cy + h + 0.6, zb - 0.5, zb + 0.9)
  box(glass, cx - h, cy - h, cx + h, cy + h, zb + 0.9, zb + 1.3)
}
// a granite parapet band round the main roof's south and west edges
for (const [a, b, c, d] of [[-37, -73.4, 66, -72.6], [-52, -62.4, -37, -61.6], [-66, -50.4, -52, -49.6], [-70.4, -32, -69.6, 62]] as number[][]) {
  box(trim, a, b, c, d, roofZ(0, (b + d) / 2) - 0.1, roofZ(0, (b + d) / 2) + 0.9, true)
}

// ------------------------------------------------- terraces and wings ---
// south-west staircase (planted terraces)
block(garden, -57, -62, -52, -50, 20.4)
block(garden, -52, -73, -37, -62, 20.4)
block(garden, -38, -82, 22, -73, 20.9)
block(garden, -66, -55, -57, -32, 8.4)
block(garden, -38, -98, -29, -82, 8.4)
// south front: entrance steps and the portico block
block(paving, -29, -91, 22, -82, 13.0)
block(paving, -24, -99, 15, -91, 8.4)
block(paving, 27, -91, 51, -85, 16.0)
block(paving, 22, -85, 51, -73, 28.0)
block(garden, 51, -84, 66, -73, 20.4)
// the south-east cube
block(paving, 64, -77, 77, -20, 35.0)
// east terraces down to Main Street
block(garden, 66, -20, 78, 62, 25.5)
block(garden, 78, -58, 84, -20, 14.0)
block(garden, 78, -20, 85, 20, 17.0)
block(garden, 78, 20, 85, 62, 21.0)
// north terraces
block(garden, -66, 62, 85, 70, 23.0)
block(garden, -60, 70, 20, 79, 15.0)
block(garden, 20, 70, 85, 78, 22.0)
// the theater wing along West Temple
block(paving, -101, 5, -70, 48, 14.5)
block(paving, -101, 48, -70, 62, 22.5)
block(paving, -97, 0, -70, 5, 11.0)
block(garden, -106, 62, -66, 79, 8.4)

// ------------------------------------------------------------ the tower ---
{
  const cx = -10, cy = -68, zr = roofZ(cx, cy)
  // the base, rising from the 20.9 m terrace in front of it
  box(gran, cx - 5, cy - 5.5, cx + 5, cy + 5, 20.9, 34.0)
  box(trim, cx - 5.3, cy - 5.8, cx + 5.3, cy + 5.3, 34.0, 34.6, true)
  // the shaft
  // (drawn 6 m square against the lidar's ~5 m, so it reads at phone size)
  box(gran, cx - 3.0, cy - 3.0, cx + 3.0, cy + 3.0, 34.6, 49.0)
  // the crown: a stepped cap over the slots (p2, p6)
  box(trim, cx - 3.4, cy - 3.4, cx + 3.4, cy + 3.4, 49.0, 50.2, true)
  box(gran, cx - 2.6, cy - 2.6, cx + 2.6, cy + 2.6, 50.2, 51.0, true)
  // the needle
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * 2 * Math.PI
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
  trim.loft([ring(1.2, 51.0), ring(0.6, 52.6), ring(0.05, 58.0)])
  // the tall slots on every face of the shaft, and the base's south opening
  for (const f of ['S', 'N', 'E', 'W'] as Face[]) {
    const plane = f === 'S' ? cy - 3.0 : f === 'N' ? cy + 3.0 : f === 'E' ? cx + 3.0 : cx - 3.0
    const u = f === 'S' || f === 'N' ? cx : cy
    for (const s of [-1.1, 1.1]) panel(win, f, plane, u + s, 0.9, 37.0, 48.0, 'flat', 0.05)
  }
  panel(win, 'S', cy - 5.5, cx, 3.0, 24.5, 32.5, 'flat', 0.05)
  void zr
}

// ------------------------------------------------------------- facades ---
// tall recessed windows along the top of the south front
for (let x = -33; x < 62; x += 4.6) {
  if (x > -16.5 && x < -3.5) continue
  if (x > 20 && x < 53) continue
  panel(win, 'S', -73, x, 1.7, 22.3, 26.3, 'flat', 0.05)
}
// the portico: five tall openings on the plaza, a frieze of small windows,
// and the tall windows above
for (let k = 0; k < 5; k++) {
  const x = 29.5 + k * 4.5
  panel(win, 'S', -91, x, 3.0, 8.6, 15.0, 'flat', 0.05)
  panel(win, 'S', -85, x, 1.4, 17.5, 18.7, 'flat', 0.05)
}
// the upper row: twelve tall recessed windows over the portico (p2)
for (let k = 0; k < 12; k++) panel(win, 'S', -85, 24.0 + k * 2.4, 1.4, 21.0, 26.0, 'flat', 0.05)
// the steps' landing: entrance openings under the terrace
for (let x = -24; x <= 16; x += 5) panel(win, 'S', -91, x, 2.6, 8.6, 12.0, 'flat', 0.05)
// the west front: the theater's rows of tall narrow windows, and the main
// hall's upper row behind it
for (let y = 8; y < 46; y += 3.2) panel(win, 'W', -101, y, 1.1, 3.0, 12.5, 'flat', 0.05)
for (let y = 50; y < 61; y += 3.2) panel(win, 'W', -101, y, 1.1, 14.0, 20.5, 'flat', 0.05)
for (let y = -28; y < 60; y += 4.6) panel(win, 'W', -70, y, 1.5, Math.max(23.5, roofZ(0, y) - 5.5), roofZ(0, y) - 1.2, 'flat', 0.05)
// the south-east cube: two tall slots on its south and east faces
for (const x of [67.5, 73.5]) panel(win, 'S', -77, x, 1.6, 25.0, 32.5, 'flat', 0.05)
for (const y of [-60, -40]) panel(win, 'E', 77, y, 1.6, 27.0, 32.5, 'flat', 0.05)
// north front: glazed band under the terrace roof
for (let x = -56; x < 18; x += 5) panel(win, 'N', 79, x, 3.0, 9.5, 13.5, 'flat', 0.05)

// ---------------------------------------------------------------- output ---
// Colours from p2, p5, p6: light grey quartz monzonite (not beige), muted
// green roof garden, pale grey paving, slate windows, glass skylight.
const parts = [
  { part: gran, material: finish('cc-granite', 0xdcdcd6) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: garden, material: finish('cc-roof-garden', 0x98a983) },
  { part: paving, material: finish('cc-paving', 0xc9c8c2) },
  { part: glass, material: PALETTE.glass },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Conference Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 58.0,
})
await Bun.write(new URL('../models/slc-conference-center.glb', import.meta.url), glb)
console.log(`slc-conference-center.glb: ${triangles} triangles, ${glb.length} bytes`)
