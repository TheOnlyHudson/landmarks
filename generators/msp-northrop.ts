/**
 * Northrop (Cyrus Northrop Memorial Auditorium), University of Minnesota
 * (Clarence H. Johnston, 1929; interior rebuilt 2014): procedural, CC0-1.0.
 * bun generators/msp-northrop.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * north-south and east-west; the front faces south down Northrop Mall).
 * Origin at the area centroid of OSM way/255808964 (-93.235368, 44.976477).
 * y = 0 is the ground along the north and side walls (lidar 257.8 m), the
 * lowest the footprint touches; the mall in front is 2.1 m higher.
 *
 * Form: an orange-brown brick auditorium under a low gable whose brick end
 * faces the mall over a limestone frame: ten Ionic columns between square
 * end piers, an entablature and a tall inscribed attic, raised on a wide
 * stair; nine bays of tall windows over doors behind the columns. Lower
 * brick wings on both sides with limestone corner pilasters, a stone
 * cornice and a brick attic, square pavilions at the front corners, a lower
 * stage house and back range to the north, and the 2014 glass entrance
 * canopy on the east side (a smaller one on the west).
 *
 * Sources
 * - OSM (ODbL): way/255808964 "Northrop Memorial Auditorium"
 *   (building=university, 4 levels); way/159934632 (building=roof, the east
 *   glass canopy) and way/248678680 (building=roof, the west canopy), both
 *   drawn by the model.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 1 m grid, above
 *   y = 0: gable ridge 37.4, eaves 29.4 at x +-21; portico attic 23.0; front
 *   pavilions 19.4; side wings 25.4; north wing parts 19.4 and 14.4; stage
 *   house ridge 32.4, eaves 27.4; back range 16.4; canopies about 5; the
 *   mall 2.1 and the steps to y -44.
 * - USGS NAIP (public domain): plan; the dark grey gable roof, the pale
 *   wing roofs, the dark glass of the east canopy.
 * - Photos (Wikimedia Commons, evidence): AlexiusHoratius, "Northrop
 *   Auditorium Minneapolis 1.jpg", CC BY-SA 3.0 (the south front, frontal:
 *   column count, bay rhythm, all front proportions); A Gude, "University of
 *   Minnesota - Northrop Memorial Auditorium (3098267031).jpg", CC BY-SA 2.0
 *   (the front and the stair); SavagePanda845 (Elliot F),
 *   "UMN-NorthropRepairs.jpg", CC BY-SA 4.0 (the east side: wing windows,
 *   cornice, attic pilasters, the glass canopy); Dragne SDI, "Northrop Mall
 *   Panorama.JPG" and "Northrop Mall.JPG", CC BY-SA 4.0 (from down the mall),
 *   "Northrop Auditorium at dusk.jpg", CC BY-SA 3.0 (night: lit portico).
 * - Published: Clarence H. Johnston, 1929; renovated 2011-14 (Wikipedia,
 *   "Northrop Auditorium").
 * Measured (lidar): every height above and the plan.
 * Estimated from the front photo, scaled by the portico's 43.5 m width (OSM):
 *   the columns (11.4 m, 1.7 m across, 3.84 m centres), the entablature
 *   (2.7 m), the attic (5.1 m), the stair (four flights' worth of steps to a
 *   floor 3.8 m up), the doors (3.6 m) and windows over them, the pavilions'
 *   windows; from the east photo, the wing windows and the cornice (17.4 m).
 * Doubts: the north and west sides have no good licensed photo; they repeat
 *   the east side's treatment. The column count (ten) is from the photos,
 *   not a drawing.
 * Night: the portico and front are floodlit (`floodlight`); windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

export function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part(), glass = new Part()
  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = roof, c = 0.35) =>
    prism(p, top, c > 0 ? chamfer(rect(x0, y0, x1, y1), c) : rect(x0, y0, x1, y1), z0, z1)
  const MALL = 2.1, FLOOR = 3.8

  // ---- central hall under its gable (ridge along y, at x = 0)
  const gable = (x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, front: boolean) => {
    box(brick, x0, y0, x1, y1, 0, eave, null, 0.4)
    const xm = (x0 + x1) / 2
    roof.quad([x1, y0, eave], [x1, y1, eave], [xm, y1, ridge], [xm, y0, ridge])
    roof.quad([x0, y1, eave], [x0, y0, eave], [xm, y0, ridge], [xm, y1, ridge])
    brick.tri([x0, y0, eave], [x1, y0, eave], [xm, y0, ridge])
    brick.tri([x1, y1, eave], [x0, y1, eave], [xm, y1, ridge])
    if (front) {
      // a raised brick gable parapet with a limestone coping along the rake, shoulders at the eaves
      const t = 0.9, h = 0.7
      for (const s of [-1, 1]) {
        const xe = s < 0 ? x0 : x1
        const sec = (x: number, z: number): V3[] => [[x, y0 - 0.25, z - 0.25], [x, y0 + t, z - 0.25], [x, y0 + t, z + h], [x, y0 - 0.25, z + h]]
        stone.sweep([sec(xe, eave), sec(xm, ridge)])
        box(brick, xe - (s < 0 ? 0 : 2.6), y0 - 0.3, xe + (s < 0 ? 2.6 : 0), y0 + 2, 0, eave + h - 0.1, null, 0.2) // shoulder pier
        box(stone, xe - (s < 0 ? 0.15 : 2.75), y0 - 0.45, xe + (s < 0 ? 2.75 : 0.15), y0 + 2.15, eave + h - 0.1, eave + h + 0.5, stone, 0.15)
      }
    }
  }
  gable(-21, 21, -35, 20.5, 29.4, 37.4, true)
  gable(-20, 20, 20.5, 32, 27.4, 32.4, false)
  box(brick, -19.5, 32, 18.1, 40.4, 0, 16.4)
  box(stone, -19.8, 31.8, 18.4, 40.7, 15.6, 16.4, roof, 0.2)
  // small windows in the gable over the attic
  for (const x of [-1.6, 0, 1.6]) flatShape(win, { o: [x, -35, 0], n: [0, -1] }, rect(-0.5, 24.2, 0.5, 25.6), 0.06)

  // ---- side wings, north parts, front pavilions
  for (const s of [-1, 1]) {
    const X = (a: number, b: number): [number, number] => (s < 0 ? [-b, -a] : [a, b])
    const [wx0, wx1] = X(21, 32.7)
    box(brick, wx0, -25, wx1, 12, 0, 25.4)
    const [cx0, cx1] = X(21, 33.1)
    box(stone, cx0, -25.2, cx1, 12.2, 16.8, 17.6, null, 0.2) // the wing cornice
    const [nx0, nx1] = X(21, 33.6)
    box(brick, nx0, 12, nx1, 23.3, 0, 19.4)
    box(stone, nx0 - 0.2, 11.8, nx1 + 0.2, 23.5, 18.6, 19.4, roof, 0.2)
    const [bx0, bx1] = X(19.8, 30.5)
    box(brick, bx0, 23.3, bx1, 36.4, 0, 14.4)
    box(stone, bx0 - 0.2, 23.1, bx1 + 0.2, 36.6, 13.6, 14.4, roof, 0.2)
    // front corner pavilion: brick, limestone corner pilasters, cornice, stone base
    const [px0, px1] = X(21.7, 34)
    box(brick, px0, -34.4, px1, -25, 0, 18.4, null)
    box(stone, px0 - 0.3, -34.7, px1 + 0.3, -24.8, 18.4, 19.4, roof, 0.25)
    box(stone, px0 - 0.15, -34.55, px1 + 0.15, -24.9, 0, MALL + 1.4, null, 0.2)
    const xo = s < 0 ? px0 : px1, xi = s < 0 ? px1 : px0
    box(stone, xo - 0.9, -34.6, xo + 0.9, -32.8, 0, 18.4, null, 0.15)
    box(stone, xi - (s < 0 ? 1.8 : 0), -34.6, xi + (s < 0 ? 0 : 1.8), -33.6, 0, 18.4, null, 0.15)
    // pavilion front: a stack of paired windows in the middle
    const pc = (px0 + px1) / 2
    const PF: Face = { o: [pc, -34.4, 0], n: [0, -1] }
    for (const [z0, z1] of [[5, 9.2], [10.4, 15.6]]) flatShape(win, PF, rect(-1.5, z0, 1.5, z1), 0.06)
    // the wing's outer face: a ground row and grouped upper windows per bay, attic pilasters above the cornice
    const WF: Face = { o: [s < 0 ? -32.7 : 32.7, -6.5, 0], n: [s, 0] }
    for (let i = 0; i < 7; i++) {
      const c = -15.6 + i * 5.2
      flatShape(win, WF, rect(c - 1.5, 8.6, c + 1.5, 14.4), 0.06)
      flatShape(win, WF, rect(c - 1.3, 2.6, c + 1.3, 6.2), 0.06)
      flatShape(stone, WF, rect(c + 2.6 - 0.45, 17.6, c + 2.6 + 0.45, 25.0), 0.06)
    }
    flatShape(stone, WF, rect(-18.5, 7.6, 18.5, 8.1), 0.05) // a sill course
    // north-wing faces: grouped windows
    const NF: Face = { o: [s < 0 ? -33.6 : 33.6, 17.6, 0], n: [s, 0] }
    for (const c of [-3, 3]) flatShape(win, NF, rect(c - 1.4, 4, c + 1.4, 15.5), 0.06)
  }
  // pavilion and wing fronts flanking the gable: limestone strips where the wings meet the hall
  // ---- the north (back) faces of the hall: a few tall windows
  for (const x of [-10, 0, 10]) flatShape(win, { o: [x, 40.4, 0], n: [0, 1] }, rect(-1.4, 4, 1.4, 13), 0.06)

  // ---- the portico: limestone frame, ten Ionic columns, entablature, attic, the stair
  const PY0 = -38.5, PY1 = -35
  box(stone, -21.7, PY0, 21.7, PY1 + 0.2, 0, FLOOR, stone, 0.2) // podium
  box(stone, -17.8, -40.1, 17.8, PY0 + 0.1, 0, FLOOR, stone, 0.15)
  for (const [y0, z] of [[-44, MALL + 0.4], [-43, MALL + 0.85], [-42, 3.0 + 0.0], [-41, FLOOR - 0.4]] as [number, number][])
    box(stone, -18.6, y0, 18.6, -40.0, 0, z, stone, 0.1)
  for (const s of [-1, 1]) {
    // end piers, carried up to the attic
    box(stone, s < 0 ? -21.7 : 18.1, PY0, s < 0 ? -18.1 : 21.7, PY1 + 0.2, FLOOR, 18.4, null, 0.3)
    // lamp standards on the stair cheeks
    box(stone, s * 19.6 - 0.8, -42.6, s * 19.6 + 0.8, -41, 0, MALL + 1.6, stone, 0.2)
  }
  for (let i = 0; i < 10; i++) {
    const x = -17.28 + i * 3.84
    lathe(stone, x, -39.1, [[1.05, FLOOR], [1.05, FLOOR + 0.45], [0.85, FLOOR + 0.6], [0.72, 14.5], [1.05, 14.8], [1.12, 15.2]], 12)
  }
  box(stone, -21.9, -40.3, 21.9, PY1 + 0.2, 15.2, 18.4, null, 0.15) // architrave and frieze
  box(stone, -22.3, -40.7, 22.3, PY1 + 0.2, 18.4, 19.2, null, 0.2) // cornice
  box(stone, -21.7, -39.9, 21.7, PY1 + 0.2, 19.2, 23.0, roof, 0.3) // the inscribed attic
  // behind the columns: nine bays of doors under tall windows
  const BF: Face = { o: [0, -35, 0], n: [0, -1] }
  flatShape(stone, BF, rect(-18.1, FLOOR, 18.1, 15.2), 0.04) // the limestone back wall
  for (let i = 0; i < 9; i++) {
    const c = -15.36 + i * 3.84
    flatShape(door, BF, rect(c - 0.95, FLOOR, c + 0.95, FLOOR + 3.6), 0.08)
    flatShape(win, BF, rect(c - 1.15, FLOOR + 4.3, c + 1.15, 14.2), 0.08)
  }

  // ---- the glass entrance canopies (2014): glass roofs on slim piers
  const canopy = (x0: number, y0: number, x1: number, y1: number, z: number) => {
    box(glass, x0, y0, x1, y1, z - 0.5, z, glass, 0.1)
    box(stone, x0, y0, x1, y1, z - 0.9, z - 0.5, null, 0.1)
    const nx = Math.max(2, Math.round((x1 - x0) / 7)), ny = Math.max(2, Math.round((y1 - y0) / 7))
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
      if (i > 0 && i < nx && j > 0 && j < ny) continue
      const x = x0 + 0.4 + ((x1 - x0 - 0.8) * i) / nx, y = y0 + 0.4 + ((y1 - y0 - 0.8) * j) / ny
      if (Math.abs(x - (x0 < 0 ? x1 : x0)) < 1) continue // against the wall
      box(stone, x - 0.3, y - 0.3, x + 0.3, y + 0.3, 0, z - 0.9, null, 0.08)
    }
  }
  canopy(32.7, -23.2, 48.4, 9.8, 6.0)
  canopy(-39, -14.3, -32.7, -0.1, 5.0)

  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : p[1] < -33 ? 0.9 : 0)
  return finishGlb('msp-northrop', [
    { part: brick, material: { ...finish('northrop-brick', 0xc48562), floodlight: lit } },
    { part: stone, material: { ...finish('northrop-limestone', 0xece2cf), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('northrop-door', 0x9c6c4c) },
    { part: glass, material: PALETTE.glass },
  ], { name: 'Northrop' }, 5000)
}

if (import.meta.main) await writeModel('msp-northrop', build())
