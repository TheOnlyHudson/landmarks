/**
 * Comerica Park, Detroit (MLB, Detroit Tigers, opened 2000) — procedural,
 * CC0-1.0, no textures.  bun generators/det-comerica-park.ts
 *
 * Map frame: x across the park (first-base side +x), y from home plate
 * toward centre field, z up, metres. Placed at bearing 148°, the line from
 * home plate to second base in the USGS NAIP orthophoto (home plate at
 * (-3.8, -32.7) in this frame). Anchor: the area centroid of the stadium
 * outline (leisure=stadium way/1307250153).
 *
 * The stands only: grass, infield and warning track are the map's. z = 0 is
 * the playing field. The streets outside stand 7 to 9.5 m higher (Adams
 * Avenue beyond centre field lowest, Montcalm behind home plate highest), so
 * the outer facades start their detail at about 9 m.
 *
 * Elevation: 0, not the field's depth. The field is published as 25 ft
 * (7.6 m) below street level, and the 2017 lidar agrees (6.8–9.5 m below
 * the surrounding streets), but the map's Mapterhorn terrain already
 * carries the pit: its lowest ground under the footprint is the field.
 * `terrain.ts check` buries the whole lower bowl by ~6 m at -7.6 and
 * passes at 0. Flagged for the lead.
 *
 * How it is built: the bowl is lofted round C = (-3.75, -14), near the
 * pitcher's mound, with `loftSections` from dc-nationals-park.ts. At each
 * angle θ (clockwise from centre field) the section runs out from the field
 * wall, whose radius comes from the OSM lower-bowl part (way/1307250151).
 * Every radius and height below is measured, angle by angle, from the USGS
 * lidar (USGS_LPC_MI_WayneCo_2017_LAS_2018, flown 2017, 1 m grid), in 6°
 * steps (tables BLOCK_B and BLOCK_A):
 *   - home plate and the third-base side (θ 120° → 300°): lower bowl to
 *     6.2 m, upper deck front 20.3 m rising to 29.6 m, a 9–10 m deep green
 *     steel canopy at 37.3 m over its back rows and concourse;
 *   - first base and right field (θ 63° → 108°): the deck is lower, front
 *     16.7 m, top 25.4 m, canopy 32.6 m; between the two blocks (θ ≈ 112°)
 *     the upper deck breaks;
 *   - light towers on the canopies, 52–55 m, in groups of two to four (the
 *     lidar peaks), and a lone right-field tower, 62.7 m;
 *   - the left-field scoreboard on a diagonal from (-104, 70) to (-60, 110),
 *     top 50 m with its 54.5 m crown, flanked by two light towers 63–65 m;
 *   - the right-field terrace at 13.5 m and the low centre-field plaza.
 * The street buildings inside the outline (offices and gates on Brush and
 * Montcalm, the centre-field building on Adams) are OSM prisms at their
 * lidar heights. The brick gate building on Witherell at the home-plate
 * corner (x 104–128, y -110 to -62, 19 m) isn't mapped in OSM; it is drawn
 * from the lidar.
 *
 * Identity (from the photos): the dark green steel canopy and light towers,
 * the green seats, the red brick outer walls with pale precast bands and
 * green-glazed openings, the giant tigers prowling on the walls at the gates,
 * the left-field scoreboard with tigers on its corners, and the carousel in
 * the first-base food court.
 *
 * Evidence
 * - OSM: outline way/1307250153 (leisure=stadium, Q868482); parts
 *   way/107327514 (grandstand), 559288136, 559288137, 559288138,
 *   1307250150, 1307250151; buildings 559604687, 559604688, 1307250152,
 *   1307250163, 1307250164, 1307250166, 1307250167, 1307250169; the
 *   carousel way/946026928.
 * - Measured: USGS lidar 2017 (every height and radius above); USGS NAIP
 *   orthophoto (plan, home-plate line, roof colours).
 * - Published: opened 2000, HOK Sport / SHG; capacity about 41,000; field
 *   25 ft below street level (Wikipedia, "Comerica Park").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Comerica Park - 2026 (215A6096).jpg", City of Detroit (public
 *     domain): from high in the west over Witherell, the facade, tigers,
 *     canopies, light towers, scoreboard, Ford Field behind.
 *   - "Comerica-Park-Detroit-MI-Panorama.jpg" (CC BY 2.5): the third-base
 *     stands, canopy and light towers from the first-base side, scoreboard.
 *   - "Comerica Park main entrance.jpg", WallyTalent (public domain): the
 *     gate, brick and precast walls, tigers on the wall tops.
 *   - "Comerica Park scoreboard from Adams Avenue, Detroit - 20201215.jpg",
 *     Andre Carrotflower (CC BY-SA 4.0): the scoreboard and its towers.
 *   - "Comerica-park-corner-shot (Unsplash).jpg", Gary Shear (CC0): the
 *     bowl from the third-base upper deck.
 *   - "Aerial View of Downtown Detroit - Ford Field and Comerica Park.jpg",
 *     Barbara Eckstein (CC BY 2.0): the plan from the air.
 * Estimated: the glass bands on the suite level and the brick walls; the
 * light towers' lamp banks (size and number per tower); the tigers' size
 * (about 6 m long on the walls); the carousel's 7 m canopy. Not drawn: the
 * Ferris wheel (no evidence fixed its position), the gate's steel arch and
 * giant bats, flagpoles, and lettering on the scoreboard.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cylinder, loftSections, prism, rayHit, type SectionPt, type XY } from './dc-nationals-park'

// OSM in this frame (bearing 148°, about the anchor).
const OUTLINE: XY[] = [[-120.1, 86.2], [-122.7, 56.0], [-122.8, 54.9], [-123.6, 45.3], [-123.7, 43.9], [-126.0, 18.3], [-123.3, 18.0], [-124.0, 10.8], [-126.5, 11.1], [-130.9, -33.2], [-132.3, -46.4], [-133.7, -60.2], [-135.9, -81.3], [-138.0, -101.4], [-46.9, -104.2], [-28.5, -104.6], [-26.7, -99.5], [-13.1, -102.8], [0.4, -103.9], [12.6, -102.3], [14.0, -107.1], [31.6, -107.7], [75.7, -109.6], [125.6, -110.7], [127.3, -65.7], [127.4, -62.5], [121.4, -61.8], [116.4, -59.9], [112.3, -56.3], [109.2, -52.0], [107.4, -47.4], [107.2, -42.8], [108.0, -37.8], [110.8, -32.9], [115.7, -28.0], [120.3, -25.7], [127.6, -25.0], [127.7, -23.3], [129.4, 27.6], [130.6, 29.1], [131.8, 35.9], [130.9, 43.1], [129.6, 44.6], [130.1, 78.3], [128.5, 78.3], [129.3, 81.2], [129.6, 83.7], [129.6, 86.0], [129.3, 88.5], [128.6, 91.0], [127.2, 93.7], [126.1, 95.4], [125.7, 96.0], [123.8, 98.3], [121.3, 100.7], [118.9, 102.1], [116.2, 103.5], [113.4, 104.2], [110.6, 104.5], [107.4, 104.4], [104.5, 103.8], [104.6, 105.6], [67.1, 107.3], [22.7, 108.7], [-23.6, 110.0], [-43.6, 111.0], [-43.8, 104.3], [-53.8, 104.9], [-60.1, 111.5], [-77.6, 112.0], [-88.4, 112.3], [-91.8, 112.5], [-97.9, 106.8], [-95.1, 103.6], [-101.2, 98.0], [-107.6, 92.2], [-110.4, 95.2]]
// The lower bowl, way/1307250151: its inner edge is the field wall.
const BOWL: XY[] = [[-28.9, 96.0], [-37.1, 88.6], [-44.8, 81.7], [-49.9, 77.2], [-54.2, 73.2], [-63.7, 64.7], [-71.9, 57.3], [-72.4, 53.2], [-73.3, 40.9], [-61.9, 28.6], [-62.3, 26.2], [-38.0, -19.4], [-42.5, -22.2], [-18.4, -48.7], [-15.0, -44.9], [-12.3, -47.0], [-7.7, -48.7], [-3.0, -49.2], [0.1, -48.7], [3.5, -47.5], [6.0, -46.0], [6.3, -45.9], [9.5, -50.0], [12.8, -47.1], [19.5, -41.0], [26.2, -35.0], [32.9, -29.0], [35.8, -26.4], [31.7, -23.2], [32.1, -22.7], [37.7, -15.6], [43.8, -7.8], [51.7, 2.3], [55.6, 7.2], [55.7, 13.5], [55.8, 17.4], [65.7, 26.1], [70.5, 30.4], [70.5, 37.5], [73.3, 37.4], [73.4, 38.7], [71.3, 41.0], [81.3, 49.9], [76.7, 54.8], [64.8, 44.2], [62.3, 47.3], [54.5, 55.9], [45.6, 65.8], [44.3, 67.2], [43.2, 74.9], [42.4, 75.8], [35.3, 83.6], [25.6, 94.2], [46.8, 94.2], [52.9, 94.0], [53.8, 92.9], [54.9, 93.9], [58.4, 89.9], [64.5, 83.0], [73.7, 73.0], [81.6, 64.2], [88.8, 56.1], [94.2, 50.2], [98.1, 46.0], [97.4, 35.9], [85.9, 40.8], [85.8, 36.9], [85.5, 25.1], [85.1, 12.3], [84.7, -0.2], [84.6, -3.9], [56.7, -40.4], [54.0, -43.9], [24.1, -70.4], [17.8, -74.5], [10.2, -77.6], [2.1, -79.2], [-5.9, -79.3], [-15.1, -78.0], [-23.3, -75.3], [-31.6, -69.7], [-35.1, -67.1], [-63.0, -35.7], [-92.3, 19.6], [-88.9, 63.3], [-105.4, 57.9], [-107.0, 57.4], [-105.8, 67.2], [-73.0, 97.6], [-69.4, 97.5], [-53.1, 97.1], [-44.5, 96.9]]

const C: XY = [-3.75, -14]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
// The part leaves centre field open; the wall there runs between its two ends (lidar: 110 m from C).
const CF_WALL: XY[] = [[-28.9, 96.0], [0, 96.6], [25.6, 94.2]]
const wallR = (a: number) => Math.min(rayHit(BOWL, C, dirOf(a)), rayHit(CF_WALL, C, dirOf(a)))
const outlineR = (a: number) => rayHit(OUTLINE, C, dirOf(a))
const at = (a: number, r: number): XY => [C[0] + dirOf(a)[0] * r, C[1] + dirOf(a)[1] * r]

const brick = new Part(), stone = new Part(), roof = new Part(), steel = new Part(), seats = new Part(), glass = new Part()

// Street level above the field, by side (lidar).
const STREET = 9

/** [θ, upper-deck front, deck top, canopy front, canopy back] from the lidar, 6° steps. */
type Row = [number, number, number, number, number]
const BLOCK_B: Row[] = [ // home plate and the third-base side; front 20.3, top 29.6, canopy 37.3
  [120, 62.2, 79.8, 80.2, 85.2], [126, 60.5, 78.0, 78.5, 87.5], [132, 60.2, 77.0, 77.5, 86.5], [138, 59.5, 76.8, 77.2, 86.8],
  [144, 59.5, 76.5, 77.0, 86.5], [150, 61.5, 78.0, 78.5, 87.5], [156, 61.8, 79.5, 80.0, 88.2], [162, 63.0, 80.2, 80.8, 90.0],
  [168, 63.8, 80.5, 81.0, 90.2], [174, 64.5, 80.5, 81.0, 91.0], [180, 64.5, 81.0, 81.5, 91.0], [186, 64.2, 81.0, 81.5, 91.0],
  [192, 63.8, 80.2, 80.8, 90.2], [198, 62.8, 79.8, 80.2, 89.5], [204, 61.5, 79.2, 79.8, 88.8], [210, 61.0, 77.5, 78.0, 88.0],
  [216, 59.0, 76.5, 77.0, 86.0], [222, 58.8, 75.5, 76.0, 85.2], [228, 58.2, 75.2, 75.8, 85.2], [234, 58.0, 76.0, 76.5, 85.0],
  [240, 59.5, 76.5, 77.0, 86.0], [246, 60.8, 79.0, 79.5, 89.0], [252, 62.5, 80.2, 80.8, 90.0], [258, 64.5, 82.8, 83.2, 92.0],
  [264, 66.2, 84.5, 85.0, 95.5], [270, 69.5, 89.0, 89.5, 99.8], [276, 74.5, 95.0, 95.5, 106.8], [282, 80.8, 102.8, 103.2, 116.0],
  [288, 88.5, 110.2, 110.8, 120.5], [294, 96.0, 113.5, 114.0, 124.2], [300, 100.0, 118.5, 119.0, 128.0], [304, 103, 119.5, 120, 128.5],
]
const BLOCK_A: Row[] = [ // first base and right field; front 16.7, top 25.4, canopy 32.6
  [64, 98.5, 117.0, 117.5, 124.0], [66, 97.0, 116.0, 116.5, 123.0], [72, 92.2, 112.2, 112.8, 123.2], [78, 90.8, 108.2, 108.8, 118.5],
  [84, 86.5, 107.2, 107.8, 117.0], [90, 79.2, 102.5, 103.0, 114.8], [96, 72.5, 95.5, 96.0, 107.0],
  [102, 69.5, 89.2, 89.8, 100.2], [108, 66.2, 85.2, 85.8, 96.2],
]

/** The grandstand section at one angle: lower-bowl back, suites, upper deck, canopy back, outer walls. */
function standSection(a: number, row: Row, front: number, top: number, canopy: number, lowBack: number): SectionPt[] {
  const [, ud, dt, , cb] = row
  const lim = outlineR(a) - 0.4
  const rb = Math.min(cb - 0.6, lim - 0.2) // the screen wall at the canopy's back
  const ro = Math.min(cb + 2.5, lim) // the brick concourse building's street face
  const rs = ud + 2
  return [
    { r: ud - 1, z: lowBack, part: roof }, // the concourse behind the lower bowl, in shadow
    { r: rs, z: lowBack, part: steel },
    { r: rs, z: lowBack + 0.8, part: glass }, // club level
    { r: rs, z: front - 7.5, part: steel },
    { r: rs, z: front - 6, part: glass }, // suites
    { r: rs, z: front - 1.6, part: steel },
    { r: rs, z: front - 1.2, part: steel }, // underside of the upper deck front
    { r: ud, z: front - 1.2, part: steel }, // its green fascia
    { r: ud, z: front + 0.4, part: seats }, // upper deck, green seats
    { r: dt, z: top, part: roof }, // top concourse under the canopy
    { r: rb, z: top, part: steel }, // green steel screen up to the canopy
    { r: rb, z: canopy - 1.3, part: null },
    { r: rb, z: 22, part: roof }, // roof of the brick concourse building
    { r: ro, z: 22, part: stone }, // its precast cornice
    { r: ro, z: 20.6, part: brick }, // red brick street walls
    { r: ro, z: 16.5, part: glass }, // green-glazed openings
    { r: ro, z: 11, part: brick },
    { r: ro, z: 0, part: null },
  ]
}

function block(rows: Row[], front: number, top: number, canopy: number, lowBack: number) {
  const angles = rows.map((r) => r[0])
  loftSections(C, angles, rows.map((r) => standSection(r[0], r, front, top, canopy, lowBack)), brick)
  // The canopy: a green steel slab over the back rows and concourse.
  loftSections(C, angles, rows.map(([, , , cf, cb]) => [
    { r: cf - 0.8, z: canopy - 1.3, part: steel }, // front fascia
    { r: cf - 0.8, z: canopy, part: steel }, // top
    { r: cb + 0.3, z: canopy, part: steel }, // back
    { r: cb + 0.3, z: canopy - 1.3, part: steel }, // underside
    { r: cf - 0.8, z: canopy - 1.3, part: null },
  ]), steel)
}
block(BLOCK_B, 20.3, 29.6, 37.3, 6.2)
block(BLOCK_A, 16.7, 25.4, 32.6, 6.2)

// The break between the blocks: suites under a low roof, θ 108°–120°.
loftSections(C, [108, 114, 120], [[108, 66.2, 96.2], [114, 64, 92], [120, 62.2, 86]].map(([a, ud, ro]) => {
  const r = Math.min(ro, outlineR(a) - 0.4)
  return [
    { r: ud - 1, z: 6.2, part: roof },
    { r: ud + 2, z: 6.2, part: steel },
    { r: ud + 2, z: 7, part: glass },
    { r: ud + 2, z: 17, part: steel },
    { r: ud + 2, z: 21, part: roof },
    { r: r, z: 21, part: stone },
    { r: r, z: 16.5, part: glass },
    { r: r, z: 11, part: brick },
    { r: r, z: 0, part: null },
  ]
}), brick)

// Light towers on the canopies: two green posts and a pale lamp bank facing the field.
function tower(a: number, r: number, z0: number, z1: number, w = 6) {
  const d = dirOf(a), t: V3 = [d[1], -d[0], 0], n: V3 = [d[0], d[1], 0]
  const p = at(a, r)
  for (const s of [-1, 1]) box(steel, [p[0] + (t[0] * s * w) / 3, p[1] + (t[1] * s * w) / 3, (z0 + z1 - 3.4) / 2], [t, n, [0, 0, 1]], [0.4, 0.4, (z1 - 3.4 - z0) / 2])
  box(steel, [p[0], p[1], z1 - 1.7], [t, n, [0, 0, 1]], [w / 2, 0.7, 1.7], true)
  box(stone, [p[0] - n[0] * 0.75, p[1] - n[1] * 0.75, z1 - 1.7], [t, n, [0, 0, 1]], [w / 2 - 0.3, 0.06, 1.4])
}
const rowAt = (rows: Row[], a: number, col: number) => {
  for (let i = 0; i < rows.length - 1; i++) if (a >= rows[i][0] && a <= rows[i + 1][0]) {
    const f = (a - rows[i][0]) / (rows[i + 1][0] - rows[i][0])
    return rows[i][col] + (rows[i + 1][col] - rows[i][col]) * f
  }
  return rows[rows.length - 1][col]
}
for (const a of [223, 229, 235, 241, 258, 264]) tower(a, rowAt(BLOCK_B, a, 3) + 2.5, 37.3, 54.5)
for (const a of [126, 132, 138]) tower(a, rowAt(BLOCK_B, a, 3) + 2.5, 37.3, 54.5)
for (const a of [96, 102, 108]) tower(a, rowAt(BLOCK_A, a, 3) + 2.5, 32.6, 54.5)
tower(48, 116, 13.5, 62.7, 7) // the lone right-field tower

// The lower bowl, foul pole to foul pole round home plate: green seats from
// the field wall up to a pale back lip.
{
  const angles: number[] = []
  for (let a = 56; a <= 304; a += 4) angles.push(a)
  const udAt = (a: number) => (a <= 108 ? (a < 64 ? 101 : rowAt(BLOCK_A, a, 1)) : a >= 120 ? rowAt(BLOCK_B, a, 1) : 66.2 + ((62.2 - 66.2) * (a - 108)) / 12)
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a), rb = udAt(a) - 1
    const rm = rw + (rb - rw) * 0.6, zm = 1.2 + (6.2 - 1.2) * 0.6
    return [
      { r: rw, z: 0, part: seats }, // field wall
      { r: rw, z: 1.2, part: seats },
      { r: rm, z: zm, part: stone }, // cross aisle
      { r: rm + 1.2, z: zm, part: seats },
      { r: rm + 1.2, z: zm + 0.6, part: seats },
      { r: rb, z: 6.2, part: roof },
      { r: rb, z: 0, part: null },
    ]
  }), stone)
}

// Left field, past the end of the upper deck: bleachers up to the concourse
// at street level, θ 304° → 336°.
{
  const angles = [304, 310, 316, 322, 328, 336]
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a), ro = Math.min(outlineR(a) - 0.4, a < 318 ? 118 : 123)
    return [
      { r: rw, z: 0, part: steel }, // green outfield wall
      { r: rw, z: 2.6, part: steel },
      { r: rw + 1.5, z: 2.6, part: seats },
      { r: ro - 3, z: STREET - 0.5, part: roof },
      { r: ro, z: STREET - 0.5, part: brick },
      { r: ro, z: 0, part: null },
    ]
  }), stone)
}

// Centre field: the outfield wall and the batter's eye; the plaza behind is
// at street level (the map's ground).
{
  const angles = [336, 344, 352, 360, 368, 376, 384]
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a % 360)
    return [
      { r: rw, z: 0, part: steel },
      { r: rw, z: 3, part: steel },
      { r: rw + 1, z: 3, part: brick }, // retaining wall up to the plaza
      { r: rw + 1, z: STREET - 0.6, part: roof },
      { r: rw + 2.5, z: STREET - 0.6, part: brick },
      { r: rw + 2.5, z: 0, part: null },
    ]
  }), brick)
}

// Right field: seats rising to the 13.5 m terrace, θ 24° → 60°.
{
  const angles = [384, 390, 396, 402, 408, 414, 420]
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a % 360), ro = Math.min(outlineR(a % 360) - 0.4, 150)
    const rt = rw + 20
    return [
      { r: rw, z: 0, part: steel },
      { r: rw, z: 2.6, part: steel },
      { r: rw + 1.5, z: 2.6, part: seats },
      { r: rt, z: 12.4, part: stone },
      { r: rt, z: 13.5, part: roof },
      { r: ro, z: 13.5, part: stone }, // terrace roof
      { r: ro, z: 12.5, part: brick },
      { r: ro, z: 0, part: null },
    ]
  }), brick)
}

// The scoreboard in left-centre, facing home plate: 59 m long with its side
// frames, top 50 m, a 54.5 m crown, a light tower at each end and a tiger
// on each top corner.
{
  const A: XY = [-104, 70], B: XY = [-60, 110]
  const e: V3 = [(B[0] - A[0]) / 59.5, (B[1] - A[1]) / 59.5, 0]
  let n: V3 = [-e[1], e[0], 0]
  if (n[0] * (-3.75 - A[0]) + n[1] * (-32.7 - A[1]) < 0) n = [-n[0], -n[1], 0] // toward home plate
  const mid: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  const p = (u: number, w: number, z: number): V3 => [mid[0] + e[0] * u + n[0] * w, mid[1] + e[1] * u + n[1] * w, z]
  const ax: [V3, V3, V3] = [e, n, [0, 0, 1]]
  box(steel, p(0, -1.2, 33), ax, [27, 1.5, 15.5], true) // the board's body, 18–48.5 m
  box(glass, p(0, 0.35, 34), ax, [19, 0.05, 10]) // the video screen
  box(steel, p(0, -1.2, 51.2), ax, [12, 1.2, 2.8], true) // the crown with the Tigers script
  box(stone, p(0, 0.05, 51.2), ax, [10.5, 0.05, 1.8]) // its pale face
  for (const s of [-1, 1]) {
    box(steel, p(s * 22, -1.2, 13.5), ax, [1.2, 1.2, 4.5]) // legs down to the concourse
  }
  for (const s of [-1, 1]) {
    const c = p(s * 21, -2.5, 0)
    box(steel, [c[0], c[1], 56.5], ax, [1.2, 1.2, 8])
    box(steel, [c[0] + n[0] * 0.2, c[1] + n[1] * 0.2, 63], ax, [3.2, 0.8, 1.8], true)
    box(stone, [c[0] + n[0] * 1.05, c[1] + n[1] * 1.05, 63], ax, [2.9, 0.06, 1.5])
  }
  tigerAt(p(-25.5, -1.2, 48.5), e, 1, 0.9)
  tigerAt(p(25.5, -1.2, 48.5), [-e[0], -e[1], 0], 1, 0.9)
}

/** A prowling tiger: body, head, legs and tail as bold blocks, about 6 m long at s = 1. */
function tigerAt(base: V3, fwd: V3, s: number, k = 1) {
  const f: V3 = [fwd[0], fwd[1], 0], l = Math.hypot(f[0], f[1]); f[0] /= l; f[1] /= l
  const side: V3 = [-f[1], f[0], 0]
  const ax: [V3, V3, V3] = [f, side, [0, 0, 1]]
  const P = (u: number, v: number, w: number): V3 => [base[0] + f[0] * u * s * k + side[0] * v * s * k, base[1] + f[1] * u * s * k + side[1] * v * s * k, base[2] + w * s * k]
  box(stone, P(0, 0, 2.2), ax, [2.4 * k * s, 0.75 * k * s, 0.75 * k * s], true) // body
  box(stone, P(2.7, 0, 2.6), ax, [0.75 * k * s, 0.6 * k * s, 0.65 * k * s], true) // head
  for (const [u, v] of [[1.8, 0.45], [1.8, -0.45], [-1.8, 0.45], [-1.8, -0.45]]) box(stone, P(u, v, 0.75), ax, [0.32 * k * s, 0.25 * k * s, 0.75 * k * s])
  box(stone, P(-3.0, 0, 2.6), ax, [0.8 * k * s, 0.14 * k * s, 0.14 * k * s]) // tail
}

// Street buildings inside the outline, at their lidar heights (field = 0).
const B559604687: XY[] = [[-26.7, -99.5], [-40.9, -92.6], [-52.7, -83.9], [-135.9, -81.3], [-138.0, -101.4], [-46.9, -104.2], [-28.5, -104.6]]
const B559604688: XY[] = [[-132.3, -46.4], [-130.9, -33.2], [-122.0, -34.1], [-118.6, 0.6], [-109.8, 0.4], [-91.2, -34.4], [-116.0, -48.0]]
const B1307250152: XY[] = [[-91.2, -34.4], [-81.7, -52.2], [-96.8, -62.2], [-133.7, -60.2], [-132.3, -46.4], [-116.0, -48.0]]
const B1307250163: XY[] = [[-123.7, 43.9], [-113.5, 42.9], [-115.8, 17.3], [-123.3, 18.0], [-126.0, 18.3]]
const B1307250169: XY[] = [[-122.8, 54.9], [-112.5, 54.0], [-113.3, 44.4], [-123.6, 45.3]]
const B1307250167: XY[] = [[-107.6, 92.2], [-103.0, 87.3], [-114.0, 77.4], [-116.0, 55.5], [-122.7, 56.0], [-120.1, 86.2], [-110.4, 95.2]]
const B1307250166: XY[] = [[-95.1, 103.6], [-90.6, 98.6], [-77.7, 109.8], [-77.6, 112.0], [-88.4, 112.3], [-91.8, 112.5], [-97.9, 106.8]]
const B1307250164: XY[] = [[-23.6, 110.0], [22.7, 108.7], [22.4, 97.6], [-12.2, 98.3], [-23.9, 98.9]]
const WITHERELL_GATE: XY[] = [[104, -110.5], [125.4, -110.6], [127.2, -66], [121.4, -61.8], [116.4, -59.9], [112.3, -56.3], [104, -60]] // not in OSM; lidar 19 m
// The Witherell arcade from the gate plaza to the right-field corner: not in OSM; lidar 18.3 m, 9.3 m over the street.
const WITHERELL_ARCADE: XY[] = [[117.5, -25.0], [127.6, -25.0], [127.7, -23.3], [129.4, 27.6], [129.6, 44.6], [130.1, 78.3], [129.6, 86.0], [128.6, 91.0], [126.1, 95.4], [121.3, 100.7], [116.2, 103.5], [110.6, 104.5], [106, 104.2], [106, 96.5], [113, 94.5], [119, 88], [119.5, 60]]
const WITHERELL_PAVILION: XY[] = [[119, 24], [129.5, 24], [129.6, 40], [119, 40]] // the taller centre block, lidar 22–27 m
for (const [poly, h] of [
  [B559604687, 21.3], [B559604688, 28.0], [B1307250152, 16.1], [B1307250163, 12.8], [B1307250169, 12.3],
  [B1307250167, 12.3], [B1307250166, 12.8], [B1307250164, 12.8], [WITHERELL_GATE, 18.0], [WITHERELL_ARCADE, 17.3],
  [WITHERELL_PAVILION, 21.5],
] as [XY[], number][]) {
  prism(poly, 0, h - 1.2, brick, null)
  prism(poly, h - 1.2, h, stone, roof)
}

// Glazed openings on the street faces of those buildings, a band of broad
// panels between brick piers (Witherell, Montcalm, Brush).
function windows(a: XY, b: XY, z0: number, z1: number, bay: number, outward: 1 | -1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nrm: V3 = [e[1] * outward, -e[0] * outward, 0]
  const n = Math.max(1, Math.floor(L / bay))
  for (let i = 0; i < n; i++) {
    const u0 = (L / n) * i + 1.0, u1 = (L / n) * (i + 1) - 1.0
    const q = (u: number, z: number): V3 => [a[0] + e[0] * u + nrm[0] * 0.05, a[1] + e[1] * u + nrm[1] * 0.05, z]
    glass.quad(q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1))
  }
}
windows([-138.0, -101.4], [-46.9, -104.2], 11, 17, 7, -1) // Montcalm, offices behind home
windows([125.4, -110.6], [104, -110.5], 11, 15.5, 6.5, -1) // gate building, Montcalm side
windows([127.2, -66], [125.4, -110.6], 11, 15.5, 6.5, -1) // gate building, Witherell side
windows([-133.7, -60.2], [-138.0, -101.4], 11, 17, 7, -1) // Brush
windows([-123.3, 18.0], [-130.9, -33.2], 11, 16, 7, -1)
windows([127.7, -23.3], [129.4, 23.6], 10.5, 15.5, 6.5, -1) // the Witherell arcade's green-glazed bays
windows([129.6, 40.5], [130.1, 78.3], 10.5, 15.5, 6.5, -1)
windows([129.4, 24.2], [129.6, 39.8], 10.5, 19.5, 5.2, -1) // the pavilion's tall windows

// The tigers on the walls by the gates: on the Witherell gate building, on
// the precast over the home-plate gate, and on the Brush Street side.
tigerAt([121, -95, 18], [0, 1, 0], 1)
tigerAt([118, -66, 18], [0, 1, 0], 1) // over the gate plaza
tigerAt([123, -20.5, 17.3], [0, -1, 0], 1)
tigerAt([60, -106, 22], [1, 0, 0], 1)
tigerAt([-60, -98, 21.3], [-1, 0, 0], 1)
tigerAt([-129, -18, 28], [0, 1, 0], 1)

// The carousel in the first-base food court: a round canopy on its drum.
cylinder(brick, [93.8, -81.2], 5.4, 0, STREET + 3.5, 16, null)
cylinder(steel, [93.8, -81.2], 5.9, STREET + 3.5, STREET + 4.6, 16, steel)
cylinder(stone, [93.8, -81.2], 1.2, STREET + 4.6, STREET + 7, 8, stone)

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('comerica-brick', 0xb9786a) },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: steel, material: finish('comerica-green', 0x587a70) },
  { part: seats, material: finish('comerica-seats', 0x5b7d6b) },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Comerica Park', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 148, osm: 'way/1307250153', height: 65.5,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/det-comerica-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
