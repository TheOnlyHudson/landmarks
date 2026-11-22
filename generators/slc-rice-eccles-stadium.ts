/**
 * Rice-Eccles Stadium, University of Utah, Salt Lake City (1998, on the
 * site of Ute Stadium of 1927; the 2002 Winter Olympics opening and closing
 * ceremonies; the Ken Garff south end zone, 2021) — procedural, CC0-1.0,
 * no textures.
 *   bun generators/slc-rice-eccles-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the field runs due
 * north-south: the field ring's long axis is 358.9°). The anchor is the area
 * centroid of the stadium outline (outer way/33632892 of building=stadium
 * relation/1734895).
 *
 * A closed single-tier bowl round a sunken field, with the tall west tower
 * (suites and press box) and its two red sandstone stair towers:
 *   - The bowl: lofted round C = (4, 11) every 5°, from the field wall (a
 *     rounded rectangle x -29.5…37.5, y -53…75, corner radius 20; lidar) up
 *     one rake of six treads with grey riser lips to the rim, ~0.5 m inside
 *     the OSM outline, then a white fascia and a raked grey underside
 *     (the open steel back of the stands, An Errant Knight's and Another
 *     Believer's photos). Rim heights above the field, lidar 2013: north
 *     end 15.7, the north corners rising through 21.7 to 30, the east side
 *     29–30, the south-east and south-west corners 30, the west side 23.6 to
 *     the tower face.
 *   - The south end (2021, after the lidar flight): from OSM's
 *     building:part levels, calibrated on the west tower (15.25 levels =
 *     47.9 m lidar, 3.14 m a level): the end-zone seats rise to 12.5 m at
 *     y -88; behind them the south building (x -28…33, y -112…-88, 18.5 m)
 *     with its suite glass facing the field; a 9.5 m concourse deck out to
 *     the outline; the video board on its roof, 32 × 20 m, its bottom at
 *     21 m (OSM 6.5–13 levels; the board's aspect from Mattstorms' photo).
 *     The corners blend from 30 m to the end's 12.5 m.
 *   - Seats: Ute red along both sides (60–120° and 240–300° round C) and
 *     in the 2021 south end; pale aluminium benches in the north end and
 *     corners (USGS aerial; Kuleralsen's 2021 photo).
 *   - West tower (OSM parts, lidar): field face x -79, west face curving
 *     from x -97 at the ends to -102 in the middle, y -50…58, the enclosed
 *     box from 24 m to its roof at 47.9 m; the teal glass curtain wall on
 *     its west face, two glass bands (suites, press box) on the white field
 *     face; under the box the open white steel X-bracing over the grey back
 *     of the rake. Brick stair towers x -97.5…-88.5, y -48…-36 and 56…68,
 *     to 58 m (lidar). Three light rigs on the tower's field edge, top 55.6
 *     (lidar, y 48, 12, -28), three on poles on the east rim, top 37.7
 *     (lidar, x 85, y -30, 10, 46).
 *
 * Elevation: z = 0 is the field. The field is sunk 3.2 m below the street
 * on the west (lidar ground 4.4 against the field's 1.2) and about 10 m on
 * the east (the stands are cut into the bench), but it is the lowest
 * ground under the outline (Mapterhorn shows it too, ~1411 m against
 * 1413–1424 m around), so the map stands z = 0 on it and elevation stays 0.
 *
 * Evidence
 * - OSM: relation/1734895 (building=stadium), outer way/33632892
 *   (leisure=stadium, Q922761), inner way/128455733 (the field), and 449
 *   building:part ways inside the outline, with levels and colours.
 * - Lidar: USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013), 1 m: the
 *   field, every rim height, the tower and its stair towers, the light
 *   rigs. The 2021 south end isn't in it.
 * - USGS aerial "Rice-Eccles Stadium-UtahUtes.jpg" (public domain): plan,
 *   seat colours, the bowl's rounded north corners.
 * - Photos (Wikimedia Commons):
 *   An Errant Knight, "Rice–Eccles Stadium from Stadium station, Aug 17.jpg"
 *     (CC BY-SA 4.0, 2017; the west face from the west: the stair towers,
 *     teal glass, white X-bracing);
 *   Fsendek1904, "University of Utah Stadium.jpg" (CC BY-SA 4.0; the
 *     tower's south end, white panels and glass bands, light rigs);
 *   Another Believer, "Salt Lake City, Utah (2021) - 147.jpg" and "- 149"
 *     (CC BY-SA 4.0; the south-west corner's open steel back, a stair
 *     tower);
 *   Kuleralsen, "Ken-Garff-Red-Zone-at-Rice-Eccles-Stadium-4 081121.jpg"
 *     (CC BY-SA 4.0, 2021; the bowl from the north, the tower's field face,
 *     the south end and its board);
 *   Mattstorms, "Ken Garff South End zone at Rice-Eccles Stadium.jpg"
 *     (CC BY-SA 4.0; the south end stands, suites and board);
 *   Byarin, "Rice Eccles Stadium, Salt Lake City, Utah.jpg" (CC0; the bowl
 *     looking north before 2021).
 * - Published (Wikipedia, "Rice-Eccles Stadium"): rebuilt 1997–98, capacity
 *   51,444 after the 2021 south end zone.
 * Estimated: the rake's curve between lidar samples; the underside and the
 *   X-bracing drawn as a few bold members; the suite and press band heights
 *   (photos); the south building's front, from photos.
 * Left out: lettering and logos ("U" on the stair towers), railings, the
 *   vomitories, a 40 m object in the north-east corner in the 2013 lidar
 *   (not in any photo I have), the Olympic cauldron (moved out of the
 *   south plaza).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, loftSections, prism, quad, rayHit, type SectionPt, type XY } from './dc-nationals-park'

const red = new Part(), alu = new Part(), stone = new Part(), white = new Part(), glass = new Part(), brick = new Part()

// The outline (outer way/33632892), simplified to 0.8 m, in this frame.
const OUTLINE: XY[] = [[-78.1, -81.7], [-85.9, -65.9], [-89.7, -49.3], [-92.6, -50.3], [-96.1, -36.4], [-100.7, -37.5], [-102.4, -30.9], [-97.1, -30.8], [-101.3, 2.2], [-106.7, 2.2], [-106.8, 19.6], [-101.4, 19.6], [-96.6, 52.3], [-102.6, 52.3], [-101.1, 58.2], [-95.9, 56.8], [-92.7, 70.2], [-88.0, 68.5], [-84.5, 86.0], [-76.4, 102.4], [-74.0, 100.7], [-71.4, 104.6], [-53.8, 105.6], [-50.3, 108.2], [-48.6, 105.7], [-34.6, 105.7], [-21.6, 107.9], [28.3, 108.0], [40.1, 105.8], [53.5, 105.7], [55.4, 108.7], [61.3, 104.2], [80.6, 99.9], [83.1, 101.6], [91.2, 85.1], [97.6, 86.8], [97.1, 88.6], [102.4, 89.8], [104.8, 80.4], [102.3, 79.7], [101.4, 77.1], [104.0, 76.6], [99.4, 63.9], [94.7, 65.6], [94.8, -43.4], [93.8, -53.6], [91.3, -63.8], [85.5, -76.3], [77.0, -88.0], [69.8, -95.0], [48.6, -109.3], [31.0, -117.1], [12.2, -121.0], [-5.5, -121.2], [-29.0, -115.9], [-51.0, -105.6], [-64.1, -96.9]]

// The field wall: a rounded rectangle (lidar), as a ring.
function roundRect(x0: number, x1: number, y0: number, y1: number, R: number, seg = 6): XY[] {
  const out: XY[] = []
  const corners: [number, number, number][] = [[x1 - R, y0 + R, -90], [x1 - R, y1 - R, 0], [x0 + R, y1 - R, 90], [x0 + R, y0 + R, 180]]
  for (const [cx, cy, a0] of corners) for (let i = 0; i <= seg; i++) {
    const a = ((a0 + (90 * i) / seg) * Math.PI) / 180
    out.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
  }
  return out
}
const FIELD = roundRect(-29.5, 37.5, -53, 75, 20)
const C: XY = [4, 11]

// The west tower's field face: the bowl stops there.
const TOWER_X = -79, TOWER_Y0 = -50, TOWER_Y1 = 58

// Rim heights above the field by angle round C (lidar 2013; the south end
// from OSM, 2021). [angle, rim height, back deck height]
const RIM: [number, number, number][] = [
  [0, 15.7, 0], [15, 15.7, 0], [30, 21.7, 0], [45, 30, 0], [60, 29, 0], [90, 29.2, 0], [120, 29, 0], [135, 30, 0],
  [148, 25, 4], [160, 12.5, 9.5], [200, 12.5, 9.5], [212, 25, 4],
  [225, 30, 0], [240, 26.5, 0], [255, 23.8, 0], [285, 23.8, 0], [300, 26.5, 0], [315, 30, 0], [330, 21.7, 0], [345, 15.6, 0], [360, 15.7, 0],
]
function rimAt(a: number): [number, number] {
  for (let i = 0; i < RIM.length - 1; i++) {
    const [a0, h0, b0] = RIM[i], [a1, h1, b1] = RIM[i + 1]
    if (a >= a0 && a <= a1) {
      const t = (a - a0) / (a1 - a0), s = t * t * (3 - 2 * t)
      return [h0 + (h1 - h0) * s, b0 + (b1 - b0) * s]
    }
  }
  return [RIM[0][1], RIM[0][2]]
}
const dir = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]

const angles: number[] = []
for (let a = 0; a <= 360; a += 5) angles.push(a)
const TREADS = 6
const sections: SectionPt[][] = angles.map((a) => {
  const d = dir(a)
  const rf = rayHit(FIELD, C, d)
  let rb = rayHit(OUTLINE, C, d) - 0.5
  // The tower face cuts the west side.
  if (d[0] < -0.1) {
    const t = (TOWER_X - C[0]) / d[0], y = C[1] + d[1] * t
    if (y > TOWER_Y0 && y < TOWER_Y1) rb = Math.min(rb, t)
  }
  let [h, zb] = rimAt(a)
  // The south end's seats stop at y -88, where the south building stands.
  let rr = rb
  if (zb > 0) {
    const tS = (-88 - C[1]) / d[1]
    rr = Math.min(rb - 2, d[1] < 0 ? tS : rb)
  }
  const sideline = (a >= 60 && a < 120) || (a >= 240 && a < 300) || (a >= 155 && a < 205)
  const seat = sideline ? red : alu
  const pts: SectionPt[] = [{ r: rf, z: 0, part: stone }, { r: rf, z: 1.2, part: seat }]
  const z0 = 1.2, run = rr - 0.8 - rf
  for (let i = 1; i <= TREADS; i++) {
    const t = i / TREADS, z = z0 + (h - z0) * (0.75 * t + 0.25 * t * t)
    const r = rf + run * t
    pts.push({ r, z: z - 0.9, part: alu }, { r, z, part: i === TREADS ? white : seat })
  }
  // The back rail and fascia, then either the deck (south end) or the
  // raked underside of the stands down to a back wall.
  pts.push({ r: rr, z: h, part: white }, { r: rr, z: h - 2, part: zb > 0 ? stone : alu })
  // Always four more points, so every section lofts onto the next.
  if (zb > 0) {
    const zd = Math.min(zb, h - 2.5)
    pts.push({ r: rr, z: zd, part: stone }, { r: rb, z: zd, part: stone }, { r: rb, z: 0, part: null })
  } else {
    const back = Math.min(0.32 * h, 9)
    pts.push({ r: rr - back, z: h * 0.38, part: stone }, { r: rr - back, z: h * 0.38, part: stone }, { r: rr - back, z: 0, part: null })
  }
  return pts
})
loftSections(C, angles, sections, null)

// --- The south building (2021): suites facing the field, deck, board ---
const SB: XY[] = [[-28, -112], [33, -112], [33, -88], [-28, -88]]
prism(SB, 0, 18.5, stone, alu)
prism([[-29, -113], [34, -113], [34, -87], [-29, -87]], 18.5, 19.4, white, alu) // roof edge
quad(glass, [[-26, -87.94, 13], [31, -87.94, 13], [31, -87.94, 17.6], [-26, -87.94, 17.6]], [0, 1, 0])
// The video board on the roof, facing north: 32 × 20 m, its bottom at 21 m.
{
  const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]
  box(brick, [1.5, -96, 31], [X, Y, Z], [16.5, 1.4, 10.5], true)
  box(glass, [1.5, -94.55, 30], [X, Y, Z], [15.4, 0.05, 8.4])
  for (const x of [-9, 12]) box(white, [x, -97, 20], [X, Y, Z], [0.6, 0.6, 1.6])
}

// --- The west tower ---
// West face: x = -97 at the ends, -102 in the middle (a shallow arc).
const wx = (y: number) => -97 - 5 * (1 - ((y - 4) / 54) ** 2)
const TY: number[] = []
for (let y = TOWER_Y0; y <= TOWER_Y1 + 0.01; y += 9) TY.push(y)
const WEST: XY[] = [...TY.map((y): XY => [wx(y), y])].reverse()
const TOWER: XY[] = [[TOWER_X, TOWER_Y0], [TOWER_X, TOWER_Y1], ...WEST]
prism(TOWER, 24, 47.9, white, alu)
prism(TOWER.map(([x, y]): XY => [x < -90 ? x - 0.4 : x + 0.4, y < 0 ? y - 0.4 : y + 0.4]), 47.9, 48.6, white, alu) // cornice
// Teal glass on the west face, 27 to 45.5 m, set just proud of the wall.
for (let i = 0; i < TY.length - 1; i++) {
  const ya = TY[i], yb = TY[i + 1]
  const A: XY = [wx(ya) - 0.05, ya], B: XY = [wx(yb) - 0.05, yb]
  quad(glass, [[A[0], A[1], 27], [B[0], B[1], 27], [B[0], B[1], 45.5], [A[0], A[1], 45.5]], [-1, 0, 0])
}
// Field face: suite band and press-box band.
for (const [z0, z1] of [[26.5, 31], [36.5, 41.5]]) quad(glass, [[TOWER_X + 0.05, TOWER_Y0 + 3, z0], [TOWER_X + 0.05, TOWER_Y1 - 3, z0], [TOWER_X + 0.05, TOWER_Y1 - 3, z1], [TOWER_X + 0.05, TOWER_Y0 + 3, z1]], [1, 0, 0])
// Under the box: the grey back of the rake, and white steel X-bracing on
// the west face line.
prism([[TOWER_X, TOWER_Y0], [TOWER_X, TOWER_Y1], [-90, TOWER_Y1], [-90, TOWER_Y0]], 0, 24, alu, null)
{
  const Z: V3 = [0, 0, 1]
  for (let i = 0; i < TY.length; i++) {
    const y = TY[i], x = wx(y) + 0.8
    box(white, [x, y, 12], [[1, 0, 0], [0, 1, 0], Z], [0.55, 0.55, 12])
    if (i < TY.length - 1) {
      const y2 = TY[i + 1], x2 = wx(y2) + 0.8
      // Two diagonals per bay, drawn as thin swept boxes.
      for (const [za, zb] of [[1, 23], [23, 1]]) {
        const a: V3 = [x, y, za], b: V3 = [x2, y2, zb]
        const along: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
        const L = Math.hypot(...along), u: V3 = [along[0] / L, along[1] / L, along[2] / L]
        const side: V3 = [1, 0, 0], up: V3 = [u[1] * side[2] - u[2] * side[1], u[2] * side[0] - u[0] * side[2], u[0] * side[1] - u[1] * side[0]]
        box(white, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], [u, side, up], [L / 2, 0.3, 0.3])
      }
    }
  }
  // A white beam along the top of the bracing.
  for (let i = 0; i < TY.length - 1; i++) {
    const y = (TY[i] + TY[i + 1]) / 2, x = wx(y) + 0.8
    box(white, [x, y, 23.6], [[1, 0, 0], [0, 1, 0], Z], [0.6, 4.6, 0.6])
  }
}
// The red sandstone stair towers, to 58 m.
for (const [y0, y1] of [[-48, -36], [56, 68]]) prism([[-97.5, y0], [-88.5, y0], [-88.5, y1], [-97.5, y1]], 0, 58, brick, brick)

// Light rigs: a lamp panel on two legs, facing the field.
function rig(x: number, y: number, z0: number, top: number, face: number) {
  const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]
  for (const dy of [-2.5, 2.5]) box(alu, [x - face * 0.6, y + dy, (z0 + top - 4) / 2], [X, Y, Z], [0.3, 0.3, (top - 4 - z0) / 2])
  box(alu, [x, y, top - 2], [X, Y, Z], [0.5, 4.2, 2], true)
  box(white, [x + face * 0.52, y, top - 2], [X, Y, Z], [0.05, 3.9, 1.7])
}
for (const y of [48, 12, -28]) rig(-78.2, y, 47.9, 55.6, 1)
for (const y of [-30, 10, 46]) rig(85, y, 20, 37.7, -1)

// ---------------------------------------------------------------------------
const parts = [
  { part: red, material: finish('ute-red-seats', 0xb8534c) },
  { part: alu, material: finish('rice-aluminium', 0xc9cdd1) },
  { part: stone, material: finish('rice-concrete', 0xddd6cb) },
  { part: white, material: PALETTE.trim },
  { part: glass, material: { ...PALETTE.window, color: 0x6a95a0 } },
  { part: brick, material: finish('rice-sandstone', 0xb0624c) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Rice-Eccles Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'relation/1734895', height: 58,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/slc-rice-eccles-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
