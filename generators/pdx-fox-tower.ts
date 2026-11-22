/**
 * Fox Tower (805 SW Broadway, 2000, TVA Architects), Portland, Oregon.
 * Original procedural geometry, CC0-1.0.
 * bun generators/pdx-fox-tower.ts
 *
 * Built with the kit in pdx-us-bancorp-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground, turned to the street grid. Anchor = area centroid of the OSM
 * outline way/689879853, 45.5184933, -122.6807004; bearing 21 (the grid,
 * measured from the OSM edges). Every ring below is an OSM part in this
 * frame.
 *
 * Identity, in order: the contrast between a boxy banded side (white
 * spandrel bands and blue glass ribbons) and a curving all-glass side; the
 * lower 100 m west shoulder beside the 113 m main block, so the top
 * steps; the four-storey white podium with glass ribbons.
 *
 * Evidence:
 *  - plan and heights: OSM parts. Main block way/36741655 (113 m, 27
 *    levels; published 113.4 m, Wikipedia) with its curved east side;
 *    west shoulder way/689879851 (100 m, 26 levels); podium parts way/152294661 and way/689879850 (4
 *    levels, no height: 21 m estimated from the photos, four tall retail
 *    and cinema storeys).
 *  - facade: the main block (straight and curved faces) is white bands over blue glass ribbons,
 *    one ribbon per storey (Another Believer's and M.O. Stevens' photos),
 *    grouped here two storeys to a ribbon; the curved faces and the west
 *    shoulder are blue glass with thin pale floor lines every three
 *    storeys (Cacophony's north-east photo, M.O. Stevens' west face).
 *  - colours: the glass reads sky blue in daylight, drawn light; the bands
 *    are the palette's stone.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fox_Tower_North-East_Face_-_Portland,_Oregon.jpg, Cacophony,
 *    CC BY-SA 3.0
 *  - Fox_Tower_west_face_-_Portland,_Oregon.JPG, M.O. Stevens, CC BY-SA 3.0
 *  - Fox_Tower_Portland_Oregon.JPG, M.O. Stevens, CC BY-SA 3.0
 * No commercial imagery. A lidar crop was tried but the download did not
 * finish (shared machine overloaded); heights are OSM and published.
 *
 * Departure from OSM: way/689879852, the wedge between the curved face
 * and the south-east corner, is tagged 100 m / 26 levels. Drawn that tall
 * it hides the curve, which every photo shows running the full height
 * above the podium (and Wikipedia's "curving east side"). It is drawn at
 * podium height here; it is still listed in `replaces`. Lidar would settle
 * it.
 *
 * Doubts: which faces are banded and which are all glass is read from
 * three photos and simplified to "straight = banded, curved = glass"; the
 * small stepped notches of the crown are left out; the podium height is
 * estimated.
 */
import { Part } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { bandRows, ccw, ribbons, save, type XY } from './pdx-us-bancorp-tower'
import { block } from './chi-aon-center'

const R = (pts: number[][]) => ccw(pts as XY[])
const MAIN = R([[8.4, 11.8], [8.5, 15.4], [8.4, 18.9], [7.8, 22.6], [5.6, 30.3], [-11.9, 25.0], [-11.8, 21.5], [-11.7, 19.5], [-19.9, 17.3], [-19.8, 9.0], [-21.4, 8.9], [-21.3, -20.4], [-21.2, -28.7], [-12.0, -28.7], [-8.6, -26.0], [-5.1, -22.6], [-2.5, -19.4], [-2.3, -16.9], [-0.6, -16.9], [2.1, -12.7], [4.1, -8.4], [5.8, -4.1], [7.1, 0.3], [7.8, 4.6], [8.2, 8.3]])
const WEST = R([[-11.7, 19.5], [-11.8, 21.5], [-24.5, 21.5], [-24.4, -20.5], [-21.3, -20.4], [-21.4, 8.9], [-19.8, 9.0], [-19.9, 17.3]])
const SE = R([[10.3, 11.8], [8.4, 11.8], [8.2, 8.3], [7.8, 4.6], [7.1, 0.3], [5.8, -4.1], [4.1, -8.4], [2.1, -12.7], [-0.6, -16.9], [-2.3, -16.9], [-2.5, -19.4], [-5.1, -22.6], [-8.6, -26.0], [-12.0, -28.7], [-12.0, -30.6], [10.5, -30.5]])
const POD_E = R([[10.5, -30.5], [31.6, -30.5], [31.6, 30.4], [5.6, 30.3], [7.8, 22.6], [8.4, 18.9], [8.5, 15.4], [8.4, 11.8], [10.3, 11.8]])
const POD_W = R([[-12.0, -30.6], [-12.0, -28.7], [-21.2, -28.7], [-21.3, -20.4], [-24.4, -20.5], [-24.5, 21.5], [-11.8, 21.5], [-11.9, 25.0], [5.6, 30.3], [-29.2, 30.2], [-29.2, -30.7], [-19.0, -30.6]])

const TOP = 113.4, SHOULDER = 100, POD = 21, FL = TOP / 27

export function build() {
  const stone = new Part(), ribbon = new Part(), glass = new Part(), roof = new Part()

  block(stone, roof, MAIN, 0, TOP, 0.4)
  block(stone, roof, WEST, 0, SHOULDER, 0.4)
  block(stone, roof, SE, 0, POD, 0.4)
  block(stone, roof, POD_E, 0, POD, 0.4)
  block(stone, roof, POD_W, 0, POD, 0.4)

  // Long straight walls get white bands over glass ribbons; short walls
  // (the curve) and all-glass parts get glass with floor lines.
  const one = (p: Part, a: XY, b: XY, rows: [number, number][], end = 0) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const [z0, z1] of rows) {
      const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [u[1], -u[0]]
      const P = (s: number, z: number) => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z] as [number, number, number]
      p.quad(P(end, z0), P(L - end, z0), P(L - end, z1), P(end, z1))
    }
  }
  const face = (r: XY[], z0: number, z1: number, allGlass = false) => {
    const bands = bandRows(z0, z1 - 1.2, 2 * FL, 5.4, 1.2)
    const glassRows = bandRows(z0, z1 - 0.8, 3 * FL, 3 * FL - 0.3, 0.15)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 1.5) continue
      if (allGlass) one(glass, a, b, glassRows)
      else one(ribbon, a, b, bands, L < 6 ? 0 : 0.4)
    }
  }
  face(MAIN, POD, TOP)
  face(WEST, POD, SHOULDER, true)
  // Podium: two glass ribbons on the street faces.
  const podRows: [number, number][] = [[0.6, 6.0], [9.0, 18.5]]
  for (const r of [POD_E, POD_W, SE, MAIN, WEST]) ribbons(ribbon, r, podRows, { minLen: 6, end: 0.6 })

  return [
    { part: stone, material: PALETTE.stone },
    { part: ribbon, material: windowVariant(1, 0x7f9ab3) },
    { part: glass, material: windowVariant(2, 0xa9bfd1) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pdx-fox-tower', 'Fox Tower', [45.5184933, -122.6807004], 21, build())
