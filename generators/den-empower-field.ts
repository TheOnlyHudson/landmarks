/**
 * Empower Field at Mile High, Denver (NFL, Denver Broncos; opened 2001,
 * HNTB with Fentress Bradburn and Bertram A. Bruton) — procedural, CC0-1.0,
 * no textures.  bun generators/den-empower-field.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the field's long
 * axis runs north–south (OSM's inner ring and outline are within 1.2° of
 * it). Anchor -105.0201075, 39.7439512: the area centroid of the stadium
 * multipolygon (relation/4423254, outer way/334252460 less the field,
 * inner way/589933183).
 *
 * The stands only: the field is the map's. z = 0 is the playing field
 * (lidar 1583.3 m). The plaza round the stadium stands 6–8 m above the
 * field on the east, north and south and 12–14 m on the west, where the
 * ground rises; the map's terrain carries the pit, so elevation is 0
 * (`terrain.ts check` puts y = 0 at 1582.5 m, 0.8 m under the lidar field:
 * the lowest map ground under the footprint, and passes).
 *
 * How it is built: lofted round C = (0, -2) with `loftSections` from
 * dc-nationals-park.ts. The bowl is symmetric east–west in the lidar to a
 * metre, so the table ROWS (θ clockwise from north, every 5°, the mean of
 * the two sides) serves both: from USGS 3DEP lidar CO_DRCOG_2_2020 (flown
 * 2020, 1 m grid), the lower bowl rising to 9.5–9.9 m at the club fascia,
 * the club deck at 17–19 m, the two suite tiers up to the upper-deck front
 * at 29 m, the upper deck rising to 35–46 m at the rim, the canopy over the
 * top rows with its light truss, whose crest rises and falls round the
 * bowl from 53 m at the corners to 62 m at the sidelines and 60 m at the
 * north end (the "wave"), the 31–39 m roofs of the outer drum and corner
 * buildings, and the street face from OSM's outline. The upper ring stops
 * at the south corners (θ 145° and 215°); between them the south stands
 * rise to 21.5 m against the scoreboard. The south scoreboard: a box 66 m
 * wide and 7 m deep, lidar top 35.5 m with Bucky to 43 m; drawn to 46 m
 * from the photos (see Doubts) with Bucky on it to 58.3 m.
 *
 * Identity (from the photos): the white canopy band with its wavy crest
 * and the light truss over a dark open upper concourse; the glazed outer
 * drum with pale floor lines over a brick ground storey; the four corner
 * buildings; the open south end with the tall white scoreboard box,
 * its video board, steel masts and Bucky the Bronco rearing on top; navy
 * seats (Broncos blue, pulled light).
 *
 * Evidence
 * - OSM: relation/4423254 (leisure=stadium, building=stadium, height 39,
 *   Q1046135) and its 138 building:part ways, all inside the outline; the
 *   "Bucky the Bronco" artwork node/4408127185 at the south scoreboard.
 * - Measured: USGS lidar CO_DRCOG_2_2020 (all heights and radii above);
 *   USGS NAIP orthophoto (plan, seat and roof colours).
 * - Published: opened 2001; Bucky is a 27 ft (8.2 m) copy of the statue
 *   from the old Mile High Stadium, on the south scoreboard (Wikipedia,
 *   "Empower Field at Mile High").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Invesco Field at Mile High.jpg", David Shankbone, CC BY 3.0: the
 *     east side from downtown (from ~75°): wave, dark concourse, drum.
 *   - "Empower Field at Mile High 20241001.jpg", Pdubs.94, CC BY-SA 4.0:
 *     the south end straight on (from 180°): scoreboard box, Bucky,
 *     corner drums, the ends of the upper ring.
 *   - "Empower Field at Mile High, 2025.jpg", MhcL947, CC BY 4.0: the
 *     south end from the south-south-east (~160°).
 *   - "Empower Field at Mile High exterior 2022.jpg", Troutfarm27,
 *     CC BY-SA 4.0: the south end and the plaza.
 *   - "Sports Authority Field at Mile High entrance.jpg", Thelastcanadian,
 *     CC BY-SA 3.0: the scoreboard box, Bucky's pose and the south entrance.
 *   - "Sports Authority Field at Mile High.jpg", Jeffrey Beall,
 *     CC BY-SA 2.0: the canopy truss, rim lights and glazing at night.
 * Lead review (2026-11): the outer drum is silver-grey metal (`empower-metal`)
 * with dark glass bays (`window`) in groups of two storeys between white
 * steel floor lines and posts, as in shankbone and e2024, replacing the
 * earlier pale sky-blue bands.
 * Estimated: the suite and club band heights between the lidar steps; the
 * canopy's section (band 15 m under the crest, front 8 m), the light
 * truss's depth; the drum's floor lines and the 10 m brick ground storey
 * from the photos; Bucky's side silhouette traced from e2024 and the
 * entrance photo, drawn 1.5× (12.3 m) so he reads on a phone; the flat roofs over the south stands. The south
 * board's big banners, the sign lettering and the corner drums' open steel
 * lattice are left out; the drums follow OSM's outline.
 * Doubts: the photos make the scoreboard box look taller and deeper than
 * the 2020 lidar (35.5 m, 7 m deep). Every photo shows the box standing
 * well over the corner drums, which the same lidar puts at 31–34 m: its
 * height is about 1.75× theirs in e2024 (from 180°) and 1.6× in ext2022,
 * and about six times Bucky's. At the lead's review the box is drawn to
 * 46 m, photo-scaled from the drums; the lidar may predate a rebuilt or
 * enlarged board, which is unconfirmed. Bucky's
 * facing (west) is read from the 2015 entrance photo; later photos are too
 * small to be sure.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, loftSections, quad, rayHit, type SectionPt, type XY } from './dc-nationals-park'

// OSM in this frame (bearing 0°, about the anchor): outer way/334252460 of relation/4423254.
const OUTLINE: XY[] = [[-78.8, 112.2], [-69.3, 114.8], [-57.2, 115.5], [-51.8, 116.4], [-36.9, 123.8], [-26.3, 128.3], [-20.9, 129.7], [2.3, 131.4], [9.5, 130.9], [17.8, 129.6], [28.9, 126.5], [34.4, 124.4], [49.6, 116.8], [54.0, 115.4], [66.1, 114.8], [78.0, 112.5], [89.0, 107.0], [94.1, 103.6], [98.7, 99.6], [107.1, 90.3], [113.2, 80.0], [115.5, 74.7], [118.8, 62.1], [119.2, 56.6], [118.5, 46.4], [117.5, 41.4], [112.1, 26.3], [111.8, 21.2], [112.6, -7.4], [111.4, -24.0], [111.7, -28.5], [117.0, -45.1], [118.4, -51.9], [118.7, -58.8], [117.5, -69.7], [113.2, -81.9], [107.2, -92.3], [103.7, -97.0], [94.9, -106.0], [79.9, -114.6], [69.1, -103.1], [61.2, -109.0], [63.7, -112.7], [47.3, -121.0], [38.5, -123.0], [30.3, -126.2], [14.5, -130.8], [6.3, -131.8], [-0.6, -131.8], [-8.1, -131.4], [-21.6, -129.2], [-49.2, -120.6], [-64.3, -113.0], [-61.0, -107.6], [-67.9, -102.2], [-81.0, -114.0], [-89.9, -109.8], [-95.6, -105.9], [-105.6, -96.3], [-109.8, -90.9], [-113.3, -85.0], [-116.0, -78.7], [-118.0, -72.1], [-119.2, -65.4], [-119.5, -50.9], [-112.5, -28.6], [-112.0, -24.5], [-112.6, 0.9], [-110.9, 19.2], [-111.8, 28.2], [-118.1, 48.8], [-117.7, 62.1], [-114.7, 74.7], [-109.5, 85.9], [-106.0, 91.0], [-102.1, 95.8], [-92.8, 104.3], [-87.4, 107.9]]
// The field: inner way/589933183.
const FIELD: XY[] = [[-27.5, 59.5], [-29.3, 58.5], [-33.7, 53.9], [-36.1, 48.0], [-38.6, 28.9], [-39.5, 16.9], [-39.5, -5.3], [-44.2, -5.3], [-44.2, -7.2], [-39.5, -7.2], [-38.4, -31.2], [-37.3, -43.4], [-35.5, -53.5], [-31.9, -58.9], [-27.1, -62.3], [-28.7, -67.4], [-26.7, -68.1], [-24.3, -68.6], [-23.1, -63.2], [-6.8, -64.4], [5.1, -64.5], [21.3, -63.2], [22.7, -68.7], [26.8, -67.6], [25.4, -62.1], [30.3, -59.4], [32.7, -56.8], [34.9, -51.1], [36.3, -44.0], [38.6, -18.9], [42.9, -19.1], [42.9, -17.6], [38.7, -17.3], [38.5, 16.4], [36.6, 40.4], [35.5, 48.0], [34.3, 51.5], [33.1, 54.0], [31.0, 56.1], [24.6, 59.8], [21.7, 60.5], [23.0, 67.1], [17.2, 67.9], [16.6, 61.2], [8.1, 61.8], [8.2, 64.4], [6.6, 64.4], [6.5, 61.9], [-6.8, 61.7], [-6.8, 64.5], [-10.3, 64.4], [-10.2, 61.7], [-24.8, 60.4]]

/** Centre of the lofts, the middle of the field. */
const C: XY = [0, -2]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const norm = (a: number) => ((a % 360) + 360) % 360
const fieldR = (a: number) => rayHit(FIELD, C, dirOf(norm(a)))
const outlineR = (a: number) => rayHit(OUTLINE, C, dirOf(norm(a))) - 0.3
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const glassWall = new Part(), brick = new Part(), white = new Part(), roof = new Part(), seats = new Part(), glass = new Part()

/**
 * The bowl, measured from the lidar every 5°, θ clockwise from north (the
 * east side; the west mirrors it within a metre, and these are the means):
 * [θ, club fascia, lower-bowl back height, upper-deck front, rim front,
 *  top-row height, canopy back, canopy crest, outer roof].
 */
type Row = [number, number, number, number, number, number, number, number, number]
const ROWS: Row[] = [
  [0, 92.3, 9.9, 99.3, 121.3, 43.3, 130.3, 60.4, 39.2], [5, 91.5, 9.6, 99.5, 121.5, 43.5, 125.5, 58.8, 39], [10, 92.6, 9.7, 100.6, 121.1, 42.7, 125.6, 58.0, 39],
  [15, 93.7, 9.6, 101.7, 120.4, 41.2, 126.7, 57.2, 39], [20, 93.8, 9.4, 101.8, 120.0, 40.6, 123.5, 55.5, 37], [25, 94.7, 9.6, 102.4, 115.4, 37.2, 122.2, 55.5, 34.2],
  [30, 93.5, 9.2, 101.5, 112.7, 35.6, 121.0, 55.5, 34.2], [35, 92.5, 9.5, 100.2, 111.5, 35.5, 119.5, 55.5, 34.2], [40, 89.5, 9.4, 98.2, 111.8, 36.8, 114.2, 55.0, 34.2],
  [45, 87.2, 9.8, 95.0, 111.2, 38.5, 114.2, 53.7, 34.2], [50, 81.8, 9.5, 90.8, 108.8, 39.1, 113.1, 54.7, 34.3], [55, 78.4, 9.6, 87.7, 107.2, 40.6, 110.7, 55.5, 34.1],
  [60, 75.5, 9.6, 84.0, 104.8, 41.5, 109.5, 57.5, 34.1], [65, 72.5, 9.7, 81.3, 102.5, 42.4, 110.0, 59.4, 34.3], [70, 70.7, 9.8, 78.7, 103.2, 44.7, 106.2, 59.8, 34.0],
  [75, 69.1, 9.8, 76.3, 101.1, 44.9, 105.3, 60.2, 34.0], [80, 67.7, 9.6, 75.9, 100.9, 45.6, 106.4, 61.2, 34.0], [85, 66.9, 9.7, 75.2, 100.7, 46.1, 107.7, 61.0, 38.8],
  [90, 66.8, 9.6, 74.2, 99.8, 45.5, 107.8, 61.7, 38.8], [95, 67.0, 9.6, 75.0, 100.5, 46.0, 107.8, 61.4, 38.8], [100, 67.8, 9.7, 76.0, 101.5, 45.8, 106.5, 60.6, 34.0],
  [105, 69.2, 9.6, 76.7, 101.2, 45.0, 105.2, 60.0, 34.0], [110, 70.5, 9.7, 78.5, 102.0, 43.8, 106.2, 59.7, 34.0], [115, 72.5, 9.8, 80.8, 102.3, 42.4, 108.0, 59.6, 34.3],
  [120, 74.8, 9.5, 83.5, 105.0, 41.6, 108.8, 57.4, 34.1], [125, 78.3, 9.7, 87.3, 106.6, 40.0, 110.6, 55.7, 34.1], [130, 82.5, 9.7, 91.0, 107.8, 38.2, 112.5, 54.5, 34.3],
  [135, 85.8, 9.3, 95.1, 110.6, 38.4, 114.1, 53.5, 34.1], [140, 90.2, 9.8, 97.5, 112.5, 38.0, 116.0, 53.4, 34.1], [145, 92.1, 9.8, 100.1, 114.3, 38.1, 117.6, 53.0, 31],
]
const rowFor = (a: number): Row => { // the west side mirrors the east
  const m = norm(a) <= 180 ? norm(a) : 360 - norm(a)
  const r = ROWS.find((q) => Math.abs(q[0] - m) < 0.01)!
  return r
}
/** Ground storey: brick up to 10 m over the field (the plaza is 6–8 m up on the east, north and south, 13 m on the west). */
const BASE = 10

function bowlSection(a: number): SectionPt[] {
  const [, ra, za, rb, rc, zc0, rd0, zr, zo0] = rowFor(a)
  const ro = Math.max(outlineR(a), rd0 + 6)
  const rw = Math.min(fieldR(a), ra - 15)
  const rd = Math.min(rd0, rc + 9)
  const zo = Math.min(zo0, zr - 12)
  const zTop = zc0 + ((zc0 - 29) / (rc - rb)) * (rd - 3 - rc) // the rake carried on under the canopy
  return [
    { r: rw, z: 0, part: seats }, // the field wall
    { r: rw, z: 2, part: seats }, // lower bowl
    { r: ra, z: za, part: white }, // the club fascia
    { r: ra, z: 17, part: seats }, // club seats
    { r: rb - 1, z: 19, part: glassWall }, // two tiers of suites
    { r: rb - 1, z: 27.6, part: white },
    { r: rb, z: 29, part: seats }, // upper deck, running on under the canopy
    { r: rd - 3, z: zTop, part: seats }, // the back wall of the top rows
    { r: rd - 3, z: canopyLow(a), part: seats }, // its outer face: the open upper concourse, in shadow
    { r: rd - 3, z: zo, part: roof },
    { r: ro, z: zo, part: glassWall }, // the glazed outer drum
    { r: ro, z: BASE, part: brick }, // brick ground storey
    { r: ro, z: 0, part: null },
  ]
}
const BOWL_ANGLES: number[] = []
for (let a = 215; a <= 505; a += 5) BOWL_ANGLES.push(a)
loftSections(C, BOWL_ANGLES, BOWL_ANGLES.map(bowlSection), roof)

/** Bottom of the canopy's outer band: 15 m under the crest, clear of the top rows. */
function canopyLow(a: number) {
  const [, , , rb, rc, zc0, rd0, zr] = rowFor(a)
  const rd = Math.min(rd0, rc + 9)
  return Math.max(zr - 15, zc0 + ((zc0 - 29) / (rc - rb)) * (rd - 3 - rc) + 1.5)
}

// The canopy over the top rows: a deep white band seen from outside, a
// thinner edge toward the field, and the light truss along its front edge,
// whose crest rises and falls round the bowl (53–62 m in the lidar): the
// "wave".
loftSections(C, BOWL_ANGLES, BOWL_ANGLES.map((a) => {
  const [, , , , rc, , rd0, zr] = rowFor(a)
  const rd = Math.min(rd0, rc + 9)
  return [
    { r: rc - 1, z: zr - 8, part: white }, // front fascia
    { r: rc - 1, z: zr - 4, part: roof }, // roof, falling outward
    { r: rd, z: zr - 5, part: white }, // the deep outer band
    { r: rd, z: canopyLow(a), part: roof }, // underside
    { r: rc - 1, z: zr - 8, part: null },
  ]
}), white)
loftSections(C, BOWL_ANGLES, BOWL_ANGLES.map((a) => {
  const [, , , , rc, , , zr] = rowFor(a)
  return [
    { r: rc - 0.6, z: zr - 4.3, part: roof }, // the light truss
    { r: rc - 0.6, z: zr, part: roof },
    { r: rc + 0.6, z: zr, part: roof },
    { r: rc + 0.6, z: zr - 4.3, part: null },
  ]
}), roof)

// The south end, open between the corner drums: lower stands only, rising
// to 21–22 m against the scoreboard; the concourse roof behind at 13 m.
// [θ, top of the stands' radius, its height]
const SOUTH: [number, number, number][] = [[145, 99, 11], [150, 101, 12], [155, 108, 15], [160, 114, 19], [165, 118, 21.5], [170, 117, 21.5], [175, 116, 21.5], [180, 116, 21.5]]
const southRow = (a: number) => { const m = a <= 180 ? a : 360 - a; return SOUTH.find((s) => Math.abs(s[0] - m) < 0.01)! }
const SOUTH_ANGLES: number[] = []
for (let a = 145; a <= 215; a += 5) SOUTH_ANGLES.push(a)
loftSections(C, SOUTH_ANGLES, SOUTH_ANGLES.map((a) => {
  const [, rs, zs] = southRow(a)
  const ro = Math.max(outlineR(a), rs + 4), rw = Math.min(fieldR(a), rs - 30)
  return [
    { r: rw, z: 0, part: seats },
    { r: rw, z: 2, part: seats },
    { r: rs, z: zs, part: roof },
    { r: rs + 1, z: zs, part: brick },
    { r: rs + 1, z: 13, part: roof },
    { r: ro, z: 13, part: glassWall },
    { r: ro, z: 9, part: brick },
    { r: ro, z: 0, part: null },
  ]
}), brick)

// The flat steel roofs over the back of the south stands, either side of the
// scoreboard (lidar 21–25 m).
for (const angles of [[150, 155, 160, 165, 170], [190, 195, 200, 205, 210]]) {
  loftSections(C, angles, angles.map((a) => {
    const [, rs, zs] = southRow(a)
    return [
      { r: rs - 7, z: zs + 1.5, part: roof },
      { r: rs - 7, z: zs + 3, part: roof },
      { r: rs + 1, z: zs + 3, part: roof },
      { r: rs + 1, z: zs + 1.5, part: roof },
      { r: rs - 7, z: zs + 1.5, part: null },
    ]
  }), roof)
}

// Pale mullion and floor lines on the glazed drum.
function drumLines(a0: number, a1: number) {
  const A = (a: number): XY => { const d = dirOf(a), r = Math.max(outlineR(a), rowFor(a)[6] + 6); return [C[0] + d[0] * (r + 0.06), C[1] + d[1] * (r + 0.06)] }
  const p = A(a0), q = A(a1), zo = Math.min(rowFor(a0)[8], rowFor(a0)[7] - 12)
  const n: V3 = [(p[0] + q[0]) / 2 - C[0], (p[1] + q[1]) / 2 - C[1], 0]
  const L = (f: number, z: number, d = 0): V3 => [p[0] + (q[0] - p[0]) * f + (n[0] / Math.hypot(n[0], n[1])) * d, p[1] + (q[1] - p[1]) * f + (n[1] / Math.hypot(n[0], n[1])) * d, z]
  const lines = [BASE, BASE + 8, BASE + 16].filter((z) => z < zo - 2)
  for (const z of lines) quad(white, [L(0, z, 0.04), L(1, z, 0.04), L(1, z + 0.7, 0.04), L(0, z + 0.7, 0.04)], n) // white steel floor lines
  // dark glass bays between silver-grey metal piers, one per 5° bay, in groups of two storeys
  const tops = [...lines.slice(1), zo - 1.2]
  lines.forEach((z, i) => { if (tops[i] - z > 2) quad(glass, [L(0.2, z + 0.7), L(0.8, z + 0.7), L(0.8, tops[i]), L(0.2, tops[i])], n) })
  quad(white, [L(-0.03, BASE, 0.04), L(0.03, BASE, 0.04), L(0.03, zo - 0.4, 0.04), L(-0.03, zo - 0.4, 0.04)], n) // the white steel post
}
for (let i = 0; i < BOWL_ANGLES.length - 1; i++) drumLines(BOWL_ANGLES[i], BOWL_ANGLES[i + 1])

// The south scoreboard: a white box 66 m wide on the south concourse, its
// video board facing the field, the sign board facing the plaza, steel
// masts at its corners, and Bucky on top.
{
  const x0 = -33, x1 = 33, y0 = -124, y1 = -117, top = 46
  const ax: [V3, V3, V3] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  box(white, [0, (y0 + y1) / 2, (top + 13) / 2], ax, [(x1 - x0) / 2, (y1 - y0) / 2, (top - 13) / 2])
  box(brick, [0, (y0 + y1) / 2, 6.5], ax, [(x1 - x0) / 2 - 1, (y1 - y0) / 2 - 0.5, 6.5])
  box(seats, [0, y1 + 0.06, top - 9], ax, [24, 0.06, 7]) // the video board
  box(seats, [0, y0 - 0.06, top - 10], ax, [11.5, 0.06, 6]) // the EMPOWER FIELD sign board
  for (const x of [-33, -12, 12, 33]) box(roof, [x, y0 - 0.7, (top + 4) / 2], ax, [0.6, 0.6, (top + 4) / 2]) // steel masts
  bucky([0, (y0 + y1) / 2, top])
}

/**
 * Bucky the Bronco: the white rearing horse (27 ft, 8.2 m), facing west, as
 * one bold extruded side silhouette traced from the photos (e2024,
 * entrance), drawn 1.5× (12.3 m) so he reads as a horse at 200 px.
 */
function bucky(o: V3) {
  const SIL: XY[] = [[-2.1, 0], [-1.2, 0], [-1.0, 1.4], [-0.4, 2.6], [0.6, 3.6], [1.3, 4.6], [2.5, 4.4], [2.8, 3.6], [3.25, 3.75], [2.95, 4.95], [1.9, 5.5], [2.0, 6.2], [2.4, 6.95], [3.1, 7.0], [3.65, 7.3], [3.55, 7.85], [2.75, 8.4], [2.55, 8.95], [2.2, 8.5], [1.6, 8.05], [0.9, 6.7], [-0.5, 5.3], [-1.4, 4.4], [-2.3, 4.0], [-2.9, 2.6], [-2.45, 2.75], [-1.95, 3.35], [-2.0, 2.2], [-2.05, 0.9]]
  const s = (8.2 * 1.5) / 8.95, hw = 0.75
  const W = (u: number, z: number, v: number): V3 => [o[0] - u * s, o[1] + v, o[2] + z * s] // u forward (west)
  // ear-clip the silhouette (counter-clockwise in u–z)
  const area = SIL.reduce((a, p, k) => { const q = SIL[(k + 1) % SIL.length]; return a + p[0] * q[1] - q[0] * p[1] }, 0)
  const ring = area > 0 ? SIL : [...SIL].reverse()
  const idx = ring.map((_, k) => k), tris: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (cr(ring[a], ring[b], ring[c]) <= 1e-9) continue
      if (idx.some((m) => m !== a && m !== b && m !== c && cr(ring[a], ring[b], ring[m]) > 0 && cr(ring[b], ring[c], ring[m]) > 0 && cr(ring[c], ring[a], ring[m]) > 0)) continue
      tris.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  tris.push([idx[0], idx[1], idx[2]])
  for (const [a, b, c] of tris) for (const v of [hw, -hw]) {
    const nn: V3 = [0, Math.sign(v), 0]
    white.tri(W(...ring[a], v), W(...ring[b], v), W(...ring[c], v), undefined, undefined, undefined, [nn, nn, nn])
  }
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length]
    const du = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(du, dz)
    const nn: V3 = [-(dz / l), 0, -du / l] // outward in u–z, u mapped to -x
    const out: V3 = [nn[0], 0, nn[2]]
    white.tri(W(...a, hw), W(...b, hw), W(...b, -hw), undefined, undefined, undefined, [out, out, out])
    white.tri(W(...a, hw), W(...b, -hw), W(...a, -hw), undefined, undefined, undefined, [out, out, out])
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: glassWall, material: finish('empower-metal', 0xbec2c5) },
  { part: glass, material: PALETTE.window },
  { part: brick, material: finish('empower-brick', 0xa9705f) },
  { part: white, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: seats, material: finish('empower-navy', 0x5b6787) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Empower Field at Mile High', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'relation/4423254', height: 62,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/den-empower-field.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
