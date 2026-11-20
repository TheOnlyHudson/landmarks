/**
 * McNichols Civic Center Building, Denver (1909–1910, Albert Randolph Ross;
 * built as the Carnegie public library; Greek Revival) — original
 * procedural geometry, CC0-1.0.
 * bun generators/den-mcnichols-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the street-level
 * ground round the building, at the centroid of OSM's outline. Bearing 0:
 * OSM's walls run east–west and north–south (within 0.3°).
 *
 * Identity (from the photos below):
 *  1. A long temple-like block: a giant Corinthian colonnade standing free
 *     in front of the long north (Colfax) face, fourteen columns between
 *     corner piers, and the same screen on the south face either side of a
 *     later wing.                                        (beall, sable)
 *  2. A plain rusticated basement storey under the columns, a deep
 *     entablature with a dentil cornice, and a low grey hip roof.
 *                                                (beall, sable, americana)
 *  3. End faces with engaged columns between corner piers. (americana)
 *  4. The south wing toward Civic Center Park: a tall grid of narrow stone
 *     piers between solid end blocks.               (dad-crop, lund-crop)
 *  5. Pale buff-grey sandstone; dark windows.
 *
 * Plan: OSM way/35205495; the column positions are OSM's column parts
 * (way/533156820 and the other 10 m parts): 14 on the north at y 10.8,
 * six on the south at y -7.4, piers on the ends at x ±26.1, the south
 * wing's 14 narrow piers at y -14.8. The walls behind the colonnades
 * (north y 8.2, south y -4.8) are estimated from "sable" (columns standing
 * about a column-and-a-half clear of the wall).
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid,
 * read with tools/lidar_frame.py; ground_min 1595.05 m and the street
 * round the building 1.3 m above it, which is y = 0 here (a sunken areaway
 * along Colfax reads lower and is not ground the building stands on).
 * Measured: the entablature's top 14.9 (lidar 16.0–16.4 at the edges), the
 * hip roof's ridge 18.0 (lidar 19.3) running east–west at y ≈ 1.8, the
 * south wing 15.6 with its end blocks to 16.4. OSM's tags (13 m, columns
 * 10 m) are under the lidar's and were not used.
 * Estimated from "beall" scaled to the lidar: basement 2.6, column
 * capitals 12.0, column radius 0.7, the window rows behind the colonnade.
 *
 * Photos (evidence, Wikimedia Commons):
 *  beall     "McNichols Civic Center Building.JPG", Jeffrey Beall, CC BY-SA
 *            3.0 (north face, square on)
 *  sable     "McNichols Civic Center Building (4935322343).jpg", Paul
 *            Sableman, CC BY 2.0 (north face from the north-west, close)
 *  xnate     "McNicholsCivicCenterBuilding.jpg", Xnatedawgx, CC BY-SA 3.0
 *            (the Colfax entrance in the basement)
 *  americana "Americana 1920 Libraries - Denver Public Library.jpg",
 *            unknown photographer, public domain (as built, from the
 *            north-east, before the south wing)
 *  dad-crop  crop of "City and County Building - Civic Center Park, Denver
 *            - DSC01224.jpg", Daderot, CC0 (south wing, from the south-west)
 *  lund-crop crop of "Denver City and County Building from Colorado State
 *            Capitol" (Flickr 68184846), Ken Lund, CC BY-SA 2.0 (south side)
 * No look-only sources. No commercial imagery.
 * Doubts: the wing's east face and the building's east end are seen only in
 * the 1920 photo; the wing's piers are drawn as OSM maps them.
 *
 * The walls behind the colonnades are a darker stone finish, the shade the
 * photos show there, so the free-standing columns read against them.
 *
 * Night: the stone is softly floodlit; windows are `window`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, hipRoof, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { engagedColumn, freeColumn } from './den-city-and-county-building'

const stone = new Part(), roof = new Part(), win = new Part(), shade = new Part()

const X0 = -26.85, X1 = 27.15, Y0 = -8.45, Y1 = 12.0
const BASE = 2.6, CAPT = 12.0, ENT = 14.9, RIDGE = 18.0
const NW = 8.2, SW = -4.8 // the walls behind the north and south colonnades
const XI0 = -24.6, XI1 = 24.9 // the corner piers' inner faces

// basement and stylobate over the whole outline
box(stone, X0, X1, Y0, Y1, 0, BASE, stone, 0.12)
// the core: full-width ends, the long walls set back behind the columns
const core: XY[] = ccw([[X0, Y0], [XI0, Y0], [XI0, SW], [XI1, SW], [XI1, Y0], [X1, Y0], [X1, Y1], [XI1, Y1], [XI1, NW], [XI0, NW], [XI0, Y1], [X0, Y1]])
prism(stone, core, BASE, CAPT, null, 0)
// entablature and cornice over everything, then the hip roof
box(stone, X0, X1, Y0, Y1, CAPT, ENT - 0.9, null, 0, true)
cornice(stone, ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]), ENT - 0.9, 0.9, 0.5, roof)
hipRoof(roof, X0 + 0.3, X1 - 0.3, Y0 + 0.3, Y1 - 0.3, ENT, RIDGE, 0)

// ── Colonnades ──
const north = [-23, -19.2, -15.3, -11.5, -8.1, -4.7, -1.3, 2.1, 5.6, 9.2, 12.7, 16.4, 20.0, 23.5]
// bold round shafts (16 sides, a little over the real 0.7 m radius so they
// hold at phone size), standing 2.6 m clear of the shaded wall behind
for (const x of north) freeColumn(stone, [x, 10.8], 0.78, BASE, CAPT, 16, 1.35)
for (const x of [-22.8, -18.1, -13.5, 13.1, 17.8, 22.3]) freeColumn(stone, [x, -7.4], 0.78, BASE, CAPT, 16, 1.35)
// the recessed walls behind the colonnades, in the shadow the photos show
onWall(shade, [XI1, NW], [XI0, NW], rectShape(0, XI1 - XI0, BASE, CAPT), 0.02)
onWall(shade, [XI0, SW], [XI1, SW], rectShape(0, -11.8 - XI0, BASE, CAPT), 0.02)
onWall(shade, [XI0, SW], [XI1, SW], rectShape(10.8 - XI0, XI1 - XI0, BASE, CAPT), 0.02)
// windows on the walls behind: two storeys a bay, spandrel between
const loggia = (a: XY, b: XY, xs: number[], sgn: number) => {
  for (let i = 0; i < xs.length - 1; i++) {
    const m = (xs[i] + xs[i + 1]) / 2, s = sgn > 0 ? a[0] - m : m - a[0]
    onWall(win, a, b, rectShape(s - 0.75, s + 0.75, 3.6, 6.3))
    onWall(win, a, b, rectShape(s - 0.75, s + 0.75, 8.3, 11.0))
  }
}
const nx = [XI0, ...north, XI1]
loggia([XI1, NW], [XI0, NW], nx, 1)
loggia([XI0, SW], [XI1, SW], [XI0, -22.8, -18.1, -13.5, -11.8], -1)
loggia([XI0, SW], [XI1, SW], [10.8, 13.1, 17.8, 22.3, XI1], -1)
// basement windows and the Colfax door
for (let i = 0; i < nx.length - 1; i++) {
  const m = (nx[i] + nx[i + 1]) / 2, s = X1 - m
  if (Math.abs(m - 0.4) < 1) onWall(win, [X1, Y1], [X0, Y1], rectShape(s - 1, s + 1, 0, 2.4))
  else onWall(win, [X1, Y1], [X0, Y1], rectShape(s - 0.8, s + 0.8, 0.8, 2.0))
}

// ── The ends: engaged columns between the corner piers ──
for (const [a, b] of [[[X1, Y0], [X1, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
  const toS = (y: number) => (a[1] < b[1] ? y - Y0 : Y1 - y)
  const ys = [-5.5, -1.85, 1.85, 5.45]
  for (const y of ys) engagedColumn(stone, a, b, toS(y), 0.7, BASE, CAPT, 8)
  for (const [ya, yb] of [[-7.6, -5.5], [-5.5, -1.85], [-1.85, 1.85], [1.85, 5.45], [5.45, 9.4]]) {
    const s = toS((ya + yb) / 2)
    onWall(win, a, b, rectShape(s - 0.75, s + 0.75, 3.4, 6.6))
    onWall(win, a, b, rectShape(s - 0.75, s + 0.75, 8.0, 11.0))
    onWall(win, a, b, rectShape(s - 0.6, s + 0.6, 0.8, 2.0))
  }
}

// ── The south wing: solid end blocks, a grid of narrow piers between ──
const WY = -15.8, GY = -14.6
box(stone, -11.8, -8.6, WY, SW, 0, 16.4, roof, 0.15)
box(stone, 7.6, 10.8, WY, SW, 0, 16.4, roof, 0.15)
box(stone, -8.6, 7.6, GY, SW, 0, 15.6, roof, 0.15)
cornice(stone, ccw([[-11.8, WY], [10.8, WY], [10.8, Y0], [-11.8, Y0]]), 14.0, 0.6, 0.3, null)
onWall(win, [-8.6, GY], [7.6, GY], rectShape(0, 16.2, 1.6, 13.4), 0.04)
for (let i = 0; i < 14; i++) {
  const x = -8.0 + (15.2 * i) / 13
  box(stone, x - 0.28, x + 0.28, GY - 0.55, GY, 1.6, 13.4, stone, 0)
}
box(stone, -8.6, 7.6, GY - 0.6, GY, 0, 1.6, stone, 0.05)
box(stone, -8.6, 7.6, GY - 0.6, GY, 13.4, 14.0, stone, 0)
// a column of windows on each end block's outer faces
for (const [a, b] of [[[-11.8, SW - 0.2], [-11.8, WY]], [[10.8, WY], [10.8, SW - 0.2]]] as [XY, XY][]) {
  onWall(win, a, b, rectShape(4.5, 5.6, 3.4, 6.6))
  onWall(win, a, b, rectShape(4.5, 5.6, 8.0, 11.0))
}

await save('den-mcnichols-building', 'McNichols Civic Center Building', [
  { part: stone, material: { ...finish('mcn-sandstone', 0xd8d0bf), floodlight: (_p, n) => (n[2] > 0.8 ? 0.1 : 0.45) } },
  { part: roof, material: finish('mcn-roof', 0x9ea2a3) },
  { part: shade, material: finish('mcn-loggia', 0xa29b8c) },
  { part: win, material: PALETTE.window },
], { height: RIDGE, anchor: [39.739702, -104.989549], bearing: 0 }, 5000)
