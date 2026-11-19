/**
 * History Colorado Center, Denver (2012, Tryba Architects with Gensler) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-history-colorado-center.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -104.986843, 39.735655,
 * the centroid of OSM way/105429742; bearing 0 (Broadway on the east,
 * 12th Avenue on the south).
 *
 * Identity (photos below):
 *  1. The pale limestone block on the Broadway–12th corner, its top storey
 *     a recessed glass band under a thin white roof that floats on columns
 *     and rises to a point over the corner.                  (beall)
 *  2. The dark glass "lantern": a tall louvered glass block on 12th Avenue
 *     west of the corner block, running back through the building.
 *                                                        (beall, t0, t1)
 *  3. Limestone wings with few, deep windows and tall glazed slots.
 *                                                        (beall, t1)
 *
 * Plan: OSM way/105429742 (no parts mapped), with the blocks split where the
 * lidar's roof heights change.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid,
 * ground_min 1599.45 m; y = 0 is 0.4 m above it (the west side; 12th Ave
 * and Broadway are 1–1.5 m higher). Measured: the west wing 20.6; the
 * north range 24.6; the lantern 25.5; the corner block's roof eaves about
 * 22, its peak 27.4 (the site's highest lidar return, 27.4, is at the corner).
 * Estimated: the floating roof's shape (two planes meeting on a ridge to
 * the corner, from beall), its 6 m overhang and 0.5 m thickness; the corner block's stone top (17.5)
 * and the clerestory's 3 m recess;  window and louver positions.
 *
 * Photos (evidence):
 *  beall "History Colorado Center", Jeffrey Beall, CC BY-SA 2.0 (Flickr
 *        7298473290; from the south-east, Broadway at right)
 *  t0,t1 "HistoryColoradoCenter.jpg", "HistoryColoradoCenter1.jpg",
 *        Trueshow111, CC0 (Wikimedia Commons; the 12th Avenue front)
 *  aerial USGS NAIP orthophoto (public domain)
 * No look-only sources. No commercial imagery. Doubt: the north and west
 * sides are seen in no photo; they are drawn plain with a few windows.
 *
 * Night: the glass band, the lantern and the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, capPoly, ccw, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { split } from './atl-flatiron-building'

const stone = new Part(), roofP = new Part(), win = new Part(), trim = new Part(), louver = new Part(), soffit = new Part()

const ring: XY[] = ccw([[-23.13, 34.96], [-23.13, 33.96], [-27.11, 34.01], [-23.16, 23.12], [-23.19, 15.23], [-25.14, 15.24], [-25.23, -12.33], [-29.89, -25.62], [12.7, -25.88], [16.83, -25.9], [20.49, -28.54], [26.48, -24.13], [28.31, -24.14], [47.55, -24.2], [47.73, 34.75]])

// the whole plan to the corner block's stone height, the west wing above it
prism(stone, split(ring, 5), 0, 17.5, roofP, 0.4)
prism(stone, ccw([[-29.89, -25.62], [2.5, -25.8], [2.5, 14.5], [-25.17, 14.5], [-25.23, -12.33]]), 17.5, 20.6, roofP, 0.4)
// the north range
box(stone, -23.1, 47.7, 14.5, 34.9, 17.5, 24.6, roofP, 0.4)
// the corner block: stone to 17.5, a dark clerestory band set 3 m back under
// the floating roof, white posts at the old wall line
const X0 = 14.5, X1 = 47.6, Y0 = -24.2, Y1 = 14.5
const band: XY[] = [[X0 + 3, Y0 + 3], [X1 - 3, Y0 + 3], [X1 - 3, Y1], [X0 + 3, Y1]]
prism(louver, band, 17.5, 22.4, null, 0)
capPoly(roofP, band, 22.4, true)
for (let x = X0 + 4; x < X1 - 1; x += 6) box(trim, x - 0.4, x + 0.4, Y0 + 0.4, Y0 + 1.2, 17.5, 23.0, null, 0)
for (let y = Y0 + 5; y < Y1 - 1; y += 6) box(trim, X1 - 1.2, X1 - 0.4, y - 0.4, y + 0.4, 17.5, 23.0, null, 0)
{
  // the floating roof: a thin plane folded on a ridge that runs out to the
  // corner, cantilevered 6 m past the walls on 12th Avenue and Broadway
  const SW: XY = [X0 - 0.5, Y0 - 6], SE: XY = [X1 + 6, Y0 - 6], NE: XY = [X1 + 6, Y1 + 2], NW: XY = [X0 - 0.5, Y1 + 2]
  const zc = (p: XY) => (p === SE ? 27.4 : p === NW ? 24.8 : 22.6)
  const T = (p: XY, d = 0): V3 => [p[0], p[1], zc(p) + d]
  for (const [a, b, c] of [[SW, SE, NW], [SE, NE, NW]] as [XY, XY, XY][]) {
    trim.tri(T(a, 0.5), T(b, 0.5), T(c, 0.5))
    soffit.tri(T(a), T(c), T(b))
  }
  const edge = [SW, SE, NE, NW]
  for (let i = 0; i < 4; i++) {
    const a = edge[i], b = edge[(i + 1) % 4]
    trim.quad(T(a), T(b), T(b, 0.5), T(a, 0.5))
  }
}

// the dark louvered lantern on 12th Avenue, running north
const L0 = 2.5, L1 = 14.5
box(louver, L0, L1, -25.9, 14.5, 0, 25.5, roofP, 0.2)
for (let x = L0 + 0.6; x < L1; x += 1.2) box(trim, x - 0.12, x + 0.12, -26.25, -25.9, 2, 25.2, null, 0)

// windows: deep slots and a few square windows on the stone (beall, t1)
const sface: [XY, XY] = [[X0, Y0], [X1, Y0]]
onWall(win, sface[0], sface[1], rectShape(2.5, 30, 0.6, 5.8), 0.06)
onWall(win, sface[0], sface[1], rectShape(19, 21.5, 12, 15), 0.06)
onWall(win, [X1, Y0], [X1, Y1], rectShape(4, 6, 2, 17), 0.06)
onWall(win, [X1, Y0], [X1, Y1], rectShape(17, 19, 2, 17), 0.06)
onWall(win, [X1, Y0], [X1, Y1], rectShape(28, 31, 0.6, 5.8), 0.06)
// the west wing's 12th Avenue front: a glazed ground floor, a long window band
onWall(win, [-29.89, -25.62], [L0, -25.8], rectShape(6, 31, 0.6, 5.5), 0.06)
onWall(win, [-29.89, -25.62], [L0, -25.8], rectShape(8, 29, 13.5, 17.5), 0.06)
// north and west: plain, a few window bands
onWall(win, [47.73, 34.75], [-23.13, 34.96], rectShape(6, 64, 15.5, 19.5), 0.06)
onWall(win, [-25.14, 15.24], [-25.23, -12.33], rectShape(3, 24, 9, 13), 0.06)

void capPoly
await save('den-history-colorado-center', 'History Colorado Center', [
  { part: stone, material: finish('history-limestone', 0xe2d8c8) },
  { part: roofP, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: louver, material: windowVariant(2, 0x5d6a72) },
  { part: soffit, material: finish('history-soffit', 0xd9d6cf) },
], { height: 27.9, anchor: [39.735655, -104.986843], bearing: 0 })
