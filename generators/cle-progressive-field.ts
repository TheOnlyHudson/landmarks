/**
 * Progressive Field, Cleveland (MLB, Cleveland Guardians; opened 1994 as
 * Jacobs Field, HOK Sport) — procedural, CC0-1.0, no textures.
 * bun generators/cle-progressive-field.ts
 *
 * Map frame: x east, y north, z up, metres (bearing 0). Home plate is at the
 * south tip of the field, centre field to the north (the line from home to
 * the mound in the NAIP runs at 358°). Anchor: area centroid of the outline
 * (building=yes relation/3421281, outer way/25312466 with leisure=stadium),
 * -81.685201, 41.495938. The grandstand is lofted round C = (0, -25), near
 * the mound.
 *
 * z = 0 is the field. The lidar puts the streets round the park (Ontario,
 * Carnegie, East 9th, the Gateway plaza) 4.8-6.5 m above it; the map's
 * Mapterhorn terrain already has the pit, so `elevation` is 0 (as for PNC
 * Park and Comerica Park). No published field depth was found.
 *
 * What makes it read as itself, from the photos: the "toothbrush" light
 * towers, white masts with tall lamp heads standing on the grandstand roof in
 * rows along both foul lines and in left field; the exposed white steel of
 * the frame, the roof's trusses and the outer concourses; the dark green
 * seats of a grandstand that wraps from the right-field corner round home
 * plate to left field, with the long right-field upper deck; the huge
 * scoreboard on a diagonal in left field (67 m long, 18 m high, published
 * 221 x 59 ft), its script crown sign and three light towers above it; the
 * 19 ft left-field wall; the buff barrel-roofed building at the Ontario and
 * Carnegie corner; low open outfield with downtown behind.
 *
 * Evidence
 * - OSM: relation/3421281 (building=yes; outer way/25312466 with
 *   leisure=stadium, name, wikidata Q1154053; inner way/245219318, the
 *   pitch). No building:part is mapped. Neighbours not touched: Gateway East
 *   garage way/94452248, 12 m beyond the left-field outline; Rocket Arena
 *   way/25312465, 15 m beyond the outline's west corner.
 * - Measured, lidar: USGS 3DEP OH_Statewide_Phase1_1_2019 (flown 2019), 1 m
 *   grid, read along rays from C every 3° (table GS), heights above the
 *   field (2.4 m above the box's lowest return):
 *   - lower bowl to 7.5 m (third-base side) / a mezzanine to 11.7 m (first
 *     base side); suite face to 22 m; upper deck 22 m rising about 6 m to
 *     the roof's front; roof 42.4 m (lidar 41-44 over the trusses), 14-20 m
 *     deep; outer concourse roofs 22-25 m, 4-15 m beyond;
 *   - 19 light towers, heads to 66.5 m: six along each foul line, four
 *     along the right-field stand, three over the scoreboard;
 *   - the scoreboard from (-84, 57) to (-27, 97), top 38.9 m, the crown
 *     sign 54.3 m; the left-field bleachers rising to 15 m; the left-field
 *     wall 6 m;
 *   - the corner building at Ontario and Carnegie: parapet 24.3 m (lidar
 *     at its edges 24.3-24.4), and over it the arched truss canopy rising
 *     to 32.3 m (across it 24.3, 30, 31.5, 32.3 ... 31.3, 28.9). The first
 *     version drew a 28.6 m box under a 3.7 m barrel; photo q2 (Chris
 *     Light) shows the parapet at about two thirds of the arch's crown
 *     height with the arch open over it, which this lidar profile matches,
 *     so the box now stops at 24.3 m and the arch rises 7.6 m.
 * - Measured, USGS NAIP orthophoto (0.38 m): plan, the roof's truss grid,
 *   green seats.
 * - Published (Wikipedia, "Progressive Field"): opened 1994; HOK Sport;
 *   the toothbrush light towers; the 19 ft left-field wall; the 2016
 *   scoreboard 59 x 221 ft; 2015 and 2023-25 renovations.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Jsawczuk, "Progressive Field.jpg" (public domain; the scoreboard,
 *     crown sign and towers from the first-base upper deck)
 *     https://commons.wikimedia.org/wiki/File:Progressive_Field.jpg
 *   Chris Light, "Jacobs Field, Cleveland.jpg" (CC BY-SA 4.0; the
 *     Ontario Street side: buff building, arched truss roof, toothbrushes)
 *     https://commons.wikimedia.org/wiki/File:Jacobs_Field,_Cleveland.jpg
 *   Stefan Knaack, "Progressive Field (Oct. 7, 2022).jpg" (CC BY-SA 4.0;
 *     the third-base stand, roof and towers from right field)
 *     https://commons.wikimedia.org/wiki/File:Progressive_Field_(Oct._7,_2022).jpg
 *   Cards84664, "Progressive Field, June 2019.jpg" (CC BY-SA 4.0; the
 *     right-field stand, roof, white steel)
 *     https://commons.wikimedia.org/wiki/File:Progressive_Field,_June_2019.jpg
 *   User IBHMC, "Jacobs Field 2003.jpg" (CC BY-SA 3.0; the Gate D facade:
 *     white steel frame over the concourses)
 *     https://commons.wikimedia.org/wiki/File:Jacobs_Field_2003.jpg
 *   Erik Drost, "Progressive Field (51104441359).jpg" (CC BY 2.0; the
 *     Carnegie and Ontario corner from the street)
 *     https://commons.wikimedia.org/wiki/File:Progressive_Field_(51104441359).jpg
 *   Erik Drost, "Progressive Field (32539120656).jpg" (CC BY 2.0; the bowl
 *     and both rows of towers from left field)
 *     https://commons.wikimedia.org/wiki/File:Progressive_Field_(32539120656).jpg
 *   Erik Drost, "Progressive Field (8736392825).jpg" (CC BY 2.0; the
 *     first-base stand, roof and towers)
 *     https://commons.wikimedia.org/wiki/File:Progressive_Field_(8736392825).jpg
 * - Estimated: the board's bottom (from its published height); the mast
 *   and head sizes of the towers (from photos: 2 m bevelled white posts, heads
 *   6.6 x 3 x 12 m, drawn a little bolder than real so the rows read on a
 *   phone); the white steel columns in front of the outer concourse, every
 *   9 m (spacing counted from photos q9 and q12 against the bay widths;
 *   bevelled 1.6 x 1.5 m), and the raised white truss line along the roof's
 *   back edge (lidar 41-44 m over the trusses); the white steel colour, a
 *   neutral white (the paint reads whiter than the palette's warm trim beside
 *   the buff masonry in every daylight photo); the window and frame bands on
 *   the outer faces; the seats under the roof (continued at the upper deck's
 *   measured rake).
 * - Not drawn: lettering and the board's images (the crown sign is a red
 *   block), the bullpens, the right-field district's bars and decks, the
 *   flagpoles, the Gate C statues. The 2023-25 renovation (after the
 *   lidar) reworked parts of the upper deck and outfield; the photos of
 *   2019-2022 match the lidar.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, loftSections, mul, quad, rayHit, triangulate, unit, type SectionPt, type XY } from './dc-nationals-park'
import { cross, sub } from './mesh'

// OSM in this frame (bearing 0, about the anchor).
const OUTLINE: XY[] = [[7.0, 117.1], [-90.3, 52.5], [-92.5, 50.8], [-99.0, 40.9], [-119.5, 2.9], [-125.9, 6.0], [-155.9, -48.1], [-106.5, -75.7], [-102.9, -77.2], [-100.4, -78.9], [-97.1, -80.5], [-91.9, -83.3], [-89.3, -85.3], [-85.8, -87.4], [-66.9, -98.0], [-63.0, -92.2], [-41.7, -109.4], [-13.9, -117.8], [15.2, -114.5], [28.4, -107.1], [41.0, -100.1], [46.9, -105.3], [63.1, -86.8], [106.7, -19.1], [101.4, -15.7], [132.5, 24.0], [144.2, 34.1], [137.1, 44.8], [83.3, 122.8], [59.1, 105.8], [47.6, 104.4], [22.3, 115.7]]
const FIELD: XY[] = [[-15.5, 80.4], [39.6, 60.1], [63.8, 24.3], [51.0, 11.3], [8.3, -55.7], [5.7, -58.5], [2.0, -60.9], [-1.3, -62.4], [-5.2, -63.0], [-8.8, -63.1], [-12.4, -62.3], [-16.0, -61.0], [-19.2, -58.9], [-22.3, -55.8], [-67.4, 12.2], [-78.3, 23.2], [-67.7, 45.2]]

const C: XY = [0, -25]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const wallR = (a: number) => rayHit(FIELD, C, dirOf(a))
const outlineR = (a: number) => rayHit(OUTLINE, C, dirOf(a))
const at3 = (a: number, r: number, z: number): V3 => [C[0] + dirOf(a)[0] * r, C[1] + dirOf(a)[1] * r, z]

const steel = new Part(), buff = new Part(), roof = new Part(), seats = new Part(), dark = new Part(), red = new Part()

/**
 * A bevelled post: an upright octagonal prism (a rectangle hw x hd with its
 * corners cut by ch) at c, its depth along o. With `back` false the faces
 * turned away from o are left out (the post stands against a wall).
 */
function post(p: Part, c: XY, o: XY, z0: number, z1: number, hw: number, hd: number, ch: number, back = true, top: Part | null = null) {
  const e: XY = [o[1], -o[0]]
  const ring: XY[] = back
    ? [[hw - ch, -hd], [hw, -hd + ch], [hw, hd - ch], [hw - ch, hd], [-hw + ch, hd], [-hw, hd - ch], [-hw, -hd + ch], [-hw + ch, -hd]]
    : [[hw, -hd], [hw, hd - ch], [hw - ch, hd], [-hw + ch, hd], [-hw, hd - ch], [-hw, -hd]]
  const n = ring.length
  const P = ([u, v]: XY, z: number): V3 => [c[0] + e[0] * u + o[0] * v, c[1] + e[1] * u + o[1] * v, z]
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const nu = b[1] - a[1], nv = -(b[0] - a[0]) // outward in (u, v): the ring runs counter-clockwise
    const L = Math.hypot(nu, nv)
    if (!back && nv / L < -0.3) continue
    quad(p, [P(a, z0), P(b, z0), P(b, z1), P(a, z1)], [(e[0] * nu + o[0] * nv) / L, (e[1] * nu + o[1] * nv) / L, 0])
  }
  if (top) for (let i = 1; i < n - 1; i++) quad(top, [P(ring[0], z1), P(ring[i], z1), P(ring[i + 1], z1), P(ring[i + 1], z1)], [0, 0, 1])
}
/** A square-section member from A to B (no end caps), `side` across it. */
function beam(p: Part, A: V3, B: V3, side: V3, hw: number, hh: number) {
  const t = unit(sub(B, A)), s = unit(sub(side, mul(t, t[0] * side[0] + t[1] * side[1] + t[2] * side[2]))), u = cross(t, s)
  const c = (P: V3, a: number, b: number) => add(add(P, mul(s, a * hw)), mul(u, b * hh))
  for (const [a0, b0, a1, b1, n] of [[1, -1, 1, 1, s], [1, 1, -1, 1, u], [-1, 1, -1, -1, mul(s, -1)], [-1, -1, 1, -1, mul(u, -1)]] as [number, number, number, number, V3][])
    quad(p, [c(A, a0, b0), c(B, a0, b0), c(B, a1, b1), c(A, a1, b1)], n)
}

// ---------------------------------------------------------------------------
// The grandstand, right-field corner (24°) round home (180°) to left field
// (282°): [θ, field wall r (lidar), suite face r, roof front r, roof back r,
// outer wall r, outer concourse roof z].
const GS: number[][] = [
  [24, 93.5, 126.0, 139.5, 143.0, 152.0, 22.0], [27, 91.0, 122.5, 134.5, 154.0, 163.0, 22.0], [30, 89.0, 119.0, 132.0, 145.5, 154.5, 24.3], [33, 86.5, 116.0, 129.0, 146.5, 150.5, 24.3],
  [36, 85.5, 114.0, 126.0, 142.5, 153.0, 24.2], [39, 84.0, 112.0, 124.0, 140.0, 150.5, 24.3], [42, 82.5, 110.5, 121.5, 135.5, 149.0, 24.2], [45, 81.0, 109.0, 120.5, 137.0, 147.0, 25.0],
  [48, 81.0, 108.0, 120.0, 135.5, 144.5, 25.0], [51, 80.0, 108.0, 118.5, 135.0, 144.0, 24.2], [54, 64.5, 107.5, 117.5, 134.5, 143.5, 24.9], [57, 57.5, 107.5, 118.0, 134.5, 143.5, 24.6],
  [60, 51.0, 107.5, 118.0, 135.0, 144.0, 25.0], [63, 47.5, 99.0, 119.0, 133.5, 139.0, 24.3], [66, 43.0, 92.0, 112.0, 136.5, 141.0, 24.3], [69, 39.0, 86.0, 103.0, 118.0, 127.0, 25.0],
  [72, 37.0, 80.0, 97.0, 118.5, 129.0, 25.0], [75, 34.5, 75.0, 91.5, 112.5, 122.0, 24.3], [78, 33.0, 71.0, 86.0, 105.0, 114.5, 24.3], [81, 30.5, 67.0, 82.5, 104.0, 109.0, 25.0],
  [84, 34.5, 64.5, 78.5, 96.5, 104.5, 25.0], [87, 28.5, 62.5, 75.5, 95.0, 108.0, 24.2], [90, 27.0, 59.0, 72.0, 88.5, 103.5, 24.3], [93, 27.5, 57.5, 70.5, 86.0, 95.0, 25.0],
  [96, 26.5, 56.5, 68.5, 86.0, 99.5, 25.0], [99, 26.5, 55.0, 66.0, 85.0, 96.0, 24.2], [102, 26.0, 53.5, 65.5, 82.5, 95.0, 24.2], [105, 26.0, 53.0, 64.5, 81.0, 92.5, 25.0],
  [108, 25.0, 52.0, 63.5, 79.5, 91.0, 25.0], [111, 25.0, 50.5, 62.5, 79.0, 89.5, 25.0], [114, 25.0, 50.5, 61.5, 77.5, 89.5, 25.0], [117, 25.0, 51.0, 61.0, 77.0, 88.5, 25.0],
  [120, 25.0, 50.0, 60.5, 75.0, 88.0, 24.2], [123, 25.0, 50.0, 61.0, 77.0, 88.0, 24.2], [126, 25.0, 49.5, 61.0, 74.5, 88.0, 25.0], [129, 25.0, 50.5, 60.5, 77.5, 88.5, 25.0],
  [132, 25.0, 51.0, 61.5, 75.0, 82.0, 25.0], [135, 25.5, 51.0, 62.5, 79.0, 83.0, 25.0], [138, 25.0, 51.5, 63.0, 80.5, 91.5, 25.0], [141, 25.0, 52.5, 64.0, 78.0, 91.0, 25.0],
  [144, 25.0, 53.5, 65.0, 82.5, 92.5, 21.8], [147, 26.5, 55.0, 66.5, 83.0, 93.5, 24.0], [150, 26.0, 56.0, 67.0, 84.0, 94.5, 24.4], [153, 26.5, 56.5, 68.5, 83.5, 88.5, 24.3],
  [156, 27.5, 58.5, 69.0, 83.0, 89.5, 25.0], [159, 28.0, 59.0, 70.0, 86.5, 91.0, 25.0], [162, 29.5, 59.0, 71.5, 87.0, 91.0, 24.3], [165, 31.0, 61.5, 71.5, 88.5, 92.5, 25.0],
  [168, 33.0, 61.5, 73.0, 88.5, 93.0, 25.0], [171, 33.5, 63.0, 73.0, 89.0, 93.0, 24.3], [174, 34.5, 62.5, 73.5, 90.0, 94.5, 24.3], [177, 36.5, 63.5, 74.5, 91.0, 95.0, 24.3],
  [180, 36.0, 64.0, 75.0, 90.5, 94.5, 24.3], [183, 37.5, 64.5, 75.5, 89.0, 102.0, 24.4], [186, 37.5, 64.5, 75.5, 89.0, 95.5, 25.0], [189, 38.5, 65.0, 76.0, 93.0, 97.0, 25.0],
  [192, 38.0, 65.5, 76.0, 89.5, 96.0, 25.0], [195, 38.5, 65.5, 77.0, 90.0, 96.0, 25.0], [198, 39.0, 65.5, 77.0, 90.5, 96.5, 25.0], [201, 39.0, 65.5, 76.5, 93.0, 97.0, 25.0],
  [204, 38.5, 66.0, 76.5, 89.5, 96.0, 25.0], [207, 37.5, 65.5, 75.5, 90.0, 95.0, 25.0], [210, 38.5, 65.0, 76.5, 92.0, 96.0, 24.3], [213, 37.0, 64.5, 75.5, 89.0, 95.0, 25.0],
  [216, 36.0, 64.5, 75.0, 88.5, 95.0, 25.0], [219, 36.5, 63.5, 75.0, 90.5, 95.0, 25.0], [222, 35.0, 63.0, 74.5, 91.0, 100.5, 24.3], [225, 34.0, 62.5, 74.0, 90.5, 101.5, 23.7],
  [228, 34.5, 61.5, 73.0, 88.5, 103.0, 24.2], [231, 35.0, 62.0, 72.5, 88.5, 97.5, 24.3], [234, 33.5, 61.0, 72.0, 88.0, 97.0, 25.0], [237, 33.5, 61.0, 72.0, 86.0, 91.5, 25.0],
  [240, 34.0, 61.5, 72.0, 87.5, 92.0, 25.0], [243, 34.0, 62.0, 72.0, 88.5, 93.0, 25.0], [246, 34.5, 61.5, 73.5, 89.5, 93.5, 24.2], [249, 34.5, 62.5, 74.0, 91.0, 95.0, 24.3],
  [252, 37.0, 63.5, 75.0, 91.0, 95.5, 25.0], [255, 36.5, 64.5, 76.0, 90.0, 104.5, 25.0], [258, 37.0, 65.5, 77.0, 92.0, 101.0, 25.0], [261, 37.5, 67.0, 79.0, 97.0, 106.0, 23.2],
  [264, 37.5, 68.5, 81.5, 100.5, 116.5, 23.1], [267, 39.5, 71.5, 84.5, 103.0, 112.0, 23.5], [270, 41.5, 73.5, 86.5, 106.0, 115.0, 23.9], [273, 43.5, 76.5, 90.5, 110.0, 119.0, 24.3],
  [276, 44.5, 79.5, 94.0, 115.5, 130.5, 25.0], [279, 47.0, 84.5, 98.5, 120.0, 129.5, 25.0], [282, 49.5, 88.0, 103.5, 120.0, 129.0, 22.0],
]
const ZS = 22, ROOF_BOT = 40.2, ROOF_TOP = 42.4, TRUSS = 43.8
// Smooth the noisy columns (roof back, outer wall, concourse roof) over three samples.
const med3 = (col: number) => GS.map((_, i) => {
  const v = [GS[Math.max(0, i - 1)][col], GS[i][col], GS[Math.min(GS.length - 1, i + 1)][col]].sort((p, q) => p - q)
  return v[1]
})
const RCB = med3(4), ROUT = med3(5), ZOUT = med3(6)
const geo = GS.map(([a, , rs, rcf], i) => {
  const rw = wallR(a)
  const rcb = Math.max(RCB[i], rcf + 12)
  const rout = Math.min(Math.max(ROUT[i], rcb + 4), outlineR(a) + 1)
  // Lower bowl: the first-base side has a mezzanine (lidar 9 -> 11.7 m);
  // the third-base side rises straight to 7.5 m; the right-field corner to 12 m.
  const mezz = a >= 63 && a <= 160 ? 9 : a >= 276 ? 6 : 0
  const rm = mezz ? rs - mezz : (rw + rs) / 2
  const zTop = a < 63 ? 12 : a > 273 ? 16 : a <= 160 ? 11.7 : 7.5
  const zm0 = mezz ? (a >= 276 ? 9 : 5.5) : (zTop * (rm - rw)) / (rs - rw)
  const zm1 = mezz ? (a >= 276 ? 14 : 9) : zm0
  const k = 6 / (rcf - rs)
  const rTop = rcb - 1.8, zSeat = Math.min(ROOF_BOT - 2.5, ZS + (rTop - rs) * k)
  return { a, rw, rs, rcf, rcb, rout, zout: ZOUT[i] - 0.2, rm, zm0, zm1, zTop, rTop, zSeat }
})
const angles = geo.map((g) => g.a)

loftSections(C, angles, geo.map((g) => [
  { r: g.rw, z: 0, part: seats }, // field wall
  { r: g.rw, z: 1.2, part: seats }, // lower bowl
  { r: g.rm, z: g.zm0, part: dark }, // mezzanine face
  { r: g.rm, z: g.zm1, part: seats },
  { r: g.rs, z: g.zTop, part: dark }, // the suite face, three levels of glass
  { r: g.rs, z: ZS, part: seats }, // upper deck, on under the roof
  { r: g.rTop, z: g.zSeat, part: roof },
  { r: g.rcb - 0.3, z: ROOF_BOT, part: steel }, // the open back of the upper deck, white steel
  { r: g.rcb - 0.3, z: g.zout, part: roof }, // outer concourse roof
  { r: g.rout, z: g.zout, part: steel },
  { r: g.rout, z: g.zout - 1.4, part: steel }, // the outer wall: white steel frame (openings below)
  { r: g.rout, z: 0, part: null },
] as SectionPt[]), buff)

// The roof over the upper deck: white trusses along its front and back
// edges (the back one is the white truss line seen from the street, lidar
// 41-44 m) and white trusses across it every 6°.
const roofSec = (g: (typeof geo)[number]): XY[] => [
  [g.rcf - 0.5, ROOF_BOT], [g.rcf - 0.5, TRUSS], [g.rcf + 1.2, TRUSS], [g.rcf + 1.2, ROOF_TOP],
  [g.rcb - 2.5, ROOF_TOP], [g.rcb, TRUSS + 0.4], [g.rcb, ROOF_BOT - 1],
]
const roofParts = [steel, steel, steel, roof, steel, steel, roof]
loftSections(C, angles, geo.map((g) => [...roofSec(g), roofSec(g)[0]].map(([r, z], i) => ({ r, z, part: roofParts[i] ?? null }))), null)
function capSection(a: number, pts: XY[], part: Part, sgn: 1 | -1) {
  const d = dirOf(a), side: V3 = [d[1] * sgn, -d[0] * sgn, 0]
  const to3 = (p: XY): V3 => [C[0] + d[0] * p[0], C[1] + d[1] * p[0], p[1]]
  for (const [i, j, k] of triangulate(pts)) quad(part, [to3(pts[i]), to3(pts[j]), to3(pts[k]), to3(pts[k])], side)
}
capSection(angles[0], roofSec(geo[0]), steel, -1)
capSection(angles[angles.length - 1], roofSec(geo[geo.length - 1]), steel, 1)
for (let i = 1; i < geo.length - 1; i += 2) {
  const g = geo[i], d = dirOf(g.a), t: V3 = [d[1], -d[0], 0]
  const len = g.rcb - g.rcf - 2.2
  // Two sides and a top; the ends are hidden in the front and back chords.
  const A = at3(g.a, g.rcf + 1.2, 0), B = at3(g.a, g.rcf + 1.2 + len, 0)
  const q = (Q: V3, k: number, z: number): V3 => [Q[0] + t[0] * k, Q[1] + t[1] * k, z]
  for (const k of [-0.45, 0.45]) quad(steel, [q(A, k, ROOF_TOP), q(B, k, ROOF_TOP), q(B, k, ROOF_TOP + 1.2), q(A, k, ROOF_TOP + 1.2)], mul(t, Math.sign(k)))
  quad(steel, [q(A, -0.45, ROOF_TOP + 1.2), q(B, -0.45, ROOF_TOP + 1.2), q(B, 0.45, ROOF_TOP + 1.2), q(A, 0.45, ROOF_TOP + 1.2)], [0, 0, 1])
}

// Openings in the white steel frame: dark bands on the upper deck's open
// back and on the outer concourses, between steel posts.
for (let i = 0; i < geo.length - 1; i++) {
  const g0 = geo[i], g1 = geo[i + 1]
  const band = (r0: number, r1: number, z0: number, z1: number) => {
    const p0 = at3(g0.a, r0, 0), p1 = at3(g1.a, r1, 0)
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), e: XY = [(p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L]
    const o: V3 = [-e[1], e[0], 0] // the loft runs clockwise: outside is to the left
    const q = (u: number, z: number): V3 => [p0[0] + e[0] * u + o[0] * 0.06, p0[1] + e[1] * u + o[1] * 0.06, z]
    if (z1 - z0 > 1 && L > 2.5) quad(dark, [q(0.7, z0), q(L - 0.7, z0), q(L - 0.7, z1), q(0.7, z1)], o)
  }
  band(g0.rcb - 0.3, g1.rcb - 0.3, Math.max(g0.zout, g1.zout) + 2.5, ROOF_BOT - 2)
  const zo = Math.min(g0.zout, g1.zout)
  band(g0.rout, g1.rout, 8.5, 14.5)
  band(g0.rout, g1.rout, 16, zo - 2.5)
}

// The white steel columns standing in front of the outer concourse wall,
// ground to just over its roof, about every 9 m along the wall (photos:
// q9 Gate D, q12 East 9th, q2 Ontario).
{
  const W = geo.map((g) => at3(g.a, g.rout, 0))
  let next = 3
  let s0 = 0
  for (let i = 0; i < geo.length - 1; i++) {
    const p0 = W[i], p1 = W[i + 1], L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    const e: XY = [(p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L], o: XY = [-e[1], e[0]]
    while (next <= s0 + L) {
      const u = next - s0, f = u / L
      const zt = geo[i].zout + (geo[i + 1].zout - geo[i].zout) * f + 1.2
      post(steel, [p0[0] + e[0] * u + o[0] * 0.75, p0[1] + e[1] * u + o[1] * 0.75], o, 0, zt, 0.8, 0.75, 0.3, false, steel)
      next += 9
    }
    s0 += L
  }
}

// ---------------------------------------------------------------------------
// The toothbrush light towers (lidar): white masts from the roof, lamp heads
// to 66.5 m, facing the field.
const TOWERS: [number, number, number][] = [
  [-103, -23.5, ROOF_TOP], [-95, -34.5, ROOF_TOP], [-88, -45.5, ROOF_TOP], [-81, -56, ROOF_TOP], [-73.5, -66.5, ROOF_TOP], [-66, -77.5, ROOF_TOP],
  [89, -22.5, ROOF_TOP], [82, -33, ROOF_TOP], [75, -43.5, ROOF_TOP], [68, -54.5, ROOF_TOP], [61, -65.5, ROOF_TOP], [54, -76.5, ROOF_TOP],
  [74, 98.5, ROOF_TOP], [81, 87.5, ROOF_TOP], [89, 76.5, ROOF_TOP], [96, 66.5, ROOF_TOP],
  [-44.5, 83, 38.9], [-55, 76, 38.9], [-66, 69, 38.9],
]
for (const [x, y, z0] of TOWERS) {
  const dx = -x, dy = 10 - y, L = Math.hypot(dx, dy) // face the middle of the field
  const f: V3 = [dx / L, dy / L, 0], t: V3 = [f[1], -f[0], 0], up: V3 = [0, 0, 1]
  post(steel, [x, y], [f[0], f[1]], z0 - 0.3, 55, 1.0, 1.0, 0.35) // the mast, a 2 m white truss post
  box(steel, [x, y, 60.5], [t, f, up], [3.3, 1.5, 6.0], true) // the lamp head, 6.6 x 3 x 12 m, 54.5-66.5 m
  const g = (a: number, b: number): V3 => [x + f[0] * 1.53 + t[0] * a, y + f[1] * 1.53 + t[1] * a, 60.5 + b]
  quad(roof, [g(-2.5, -5.2), g(2.5, -5.2), g(2.5, 5.2), g(-2.5, 5.2)], f) // its lamp grid, framed in white
  const h = (a: number, b: number): V3 => [x - f[0] * 1.53 + t[0] * a, y - f[1] * 1.53 + t[1] * a, 60.5 + b]
  quad(roof, [h(-2.5, -5.2), h(2.5, -5.2), h(2.5, 5.2), h(-2.5, 5.2)], mul(f, -1)) // the open truss behind it
}

// ---------------------------------------------------------------------------
// Left field: the 19 ft wall and the bleachers rising to the scoreboard.
const BOARD_A: XY = [-84, 57], BOARD_B: XY = [-27, 97]
const boardR = (a: number) => rayHit([BOARD_A, BOARD_B, [BOARD_B[0] - 30, BOARD_B[1] + 30]], C, dirOf(a))
{
  const ang: number[] = []
  for (let a = 282; a <= 350; a += 4) ang.push(a)
  loftSections(C, ang, ang.map((a) => {
    const rw = wallR(a), rb = Math.min(boardR(a) - 1.5, outlineR(a) - 1)
    return [
      { r: rw, z: 0, part: seats }, // the 19 ft green wall
      { r: rw, z: 5.8, part: steel },
      { r: rw + 1.2, z: 5.8, part: seats },
      { r: rb, z: 15, part: buff },
      { r: rb, z: 0, part: null },
    ] as SectionPt[]
  }), buff)
  // The outfield wall on round to the right-field stand.
  const ow: number[] = []
  for (let a = 350; a <= 384; a += 4) ow.push(a)
  loftSections(C, ow, ow.map((a) => {
    const rw = wallR(a % 360)
    return [{ r: rw, z: 0, part: seats }, { r: rw, z: 2.6, part: steel }, { r: rw + 1.2, z: 2.6, part: buff }, { r: rw + 1.2, z: 0, part: null }] as SectionPt[]
  }), buff)
  // The centre-field batter's eye block, lidar 11-12 m.
  box(seats, [-6, 85, 6], [[0.94, 0.34, 0], [-0.34, 0.94, 0], [0, 0, 1]], [9, 2.5, 6])
}
// The scoreboard: 67 x 18 m, top 38.9 m, on a dark frame down to the
// bleachers' back; the script crown sign over its left half.
{
  const L = Math.hypot(BOARD_B[0] - BOARD_A[0], BOARD_B[1] - BOARD_A[1])
  const e: V3 = [(BOARD_B[0] - BOARD_A[0]) / L, (BOARD_B[1] - BOARD_A[1]) / L, 0]
  const n: V3 = [e[1], -e[0], 0] // towards the field
  const m: XY = [(BOARD_A[0] + BOARD_B[0]) / 2, (BOARD_A[1] + BOARD_B[1]) / 2]
  const ax: [V3, V3, V3] = [e, n, [0, 0, 1]]
  box(dark, [m[0], m[1], 29.9], ax, [L / 2, 1.5, 9], true) // the board, 20.9-38.9 m
  box(steel, [m[0], m[1], 39.3], ax, [L / 2 + 0.3, 1.8, 0.4]) // its white cap
  box(roof, [m[0] - n[0] * 0.6, m[1] - n[1] * 0.6, 10.5], ax, [L / 2 - 1, 0.9, 10.5]) // the frame under it
  const s: XY = [m[0] - e[0] * 10, m[1] - e[1] * 10]
  box(red, [s[0], s[1], 47], ax, [9, 0.8, 4.5], true) // the crown sign, to 51.5
  box(steel, [s[0] - n[0] * 0.2, s[1] - n[1] * 0.2, 53], ax, [7, 0.5, 1.3]) // "Progressive Field" over it, to 54.3
  for (const u of [-6, 6]) box(steel, [s[0] + e[0] * u, s[1] + e[1] * u, 41], ax, [0.5, 0.5, 1.7])
}

// ---------------------------------------------------------------------------
// The buff office building at Ontario and Carnegie (lidar): parapet 24.3 m,
// and over it the arched white truss canopy, springing at the parapet and
// rising to 32.3 m (lidar across it: 24.3, 30, 31.5, 32.3 ... 31.3, 28.9),
// its ends open (dark) under the arch, as photo q2 shows from Ontario.
{
  const c: XY = [-127, -56.5], e: XY = [0.894, -0.447], n: XY = [0.447, 0.894], hl = 25, hw = 10
  const ZP = 24.3, RISE = 7.6
  const P = (u: number, v: number, z: number): V3 => [c[0] + e[0] * u + n[0] * v, c[1] + e[1] * u + n[1] * v, z]
  const ax: [V3, V3, V3] = [[e[0], e[1], 0], [n[0], n[1], 0], [0, 0, 1]]
  box(buff, P(0, 0, ZP / 2), ax, [hl, hw, ZP / 2])
  // A segmental arch (half-span hw, rise RISE): z over the parapet at v.
  const R = (hw * hw + RISE * RISE) / (2 * RISE), t0a = Math.asin(hw / R)
  const arcV = (k: number) => R * Math.sin(-t0a + (2 * t0a * k) / N), arcZ = (k: number) => ZP + R * Math.cos(-t0a + (2 * t0a * k) / N) - (R - RISE)
  const N = 8
  for (let i = 0; i < N; i++) {
    const v0 = arcV(i), v1 = arcV(i + 1), z0 = arcZ(i), z1 = arcZ(i + 1)
    const tm = -t0a + (2 * t0a * (i + 0.5)) / N
    const nm: V3 = [n[0] * Math.sin(tm), n[1] * Math.sin(tm), Math.cos(tm)]
    quad(roof, [P(-hl, v0, z0), P(hl, v0, z0), P(hl, v1, z1), P(-hl, v1, z1)], nm)
    for (const s of [-1, 1]) quad(dark, [P(s * hl, v0, ZP), P(s * hl, v1, ZP), P(s * hl, v1, z1), P(s * hl, v0, z0)], [e[0] * s, e[1] * s, 0])
  }
  // The white truss arch on each end: a bold rib along the curve, a tie
  // along the parapet and three spokes.
  for (const s of [-1, 1]) {
    const u = s * (hl + 0.45), side: V3 = [e[0], e[1], 0]
    const rib = (k: number): V3 => P(u, arcV(k) * 0.95, arcZ(k) - 0.15)
    for (let i = 0; i < N; i++) beam(steel, rib(i), rib(i + 1), side, 0.45, 0.6)
    beam(steel, P(u, -hw + 0.4, ZP + 0.3), P(u, hw - 0.4, ZP + 0.3), side, 0.45, 0.45)
    for (const k of [2, 4, 6]) beam(steel, P(u, 0, ZP + 0.3), P(u, arcV(k) * 0.9, arcZ(k) - 0.6), side, 0.3, 0.3)
  }
  // Windows in pairs of bays over two storeys each, between buff piers.
  const bands: [number, number][] = [[10.5, 16.2], [17.6, 22.8]]
  for (const v of [-hw, hw]) for (let k = 0; k < 6; k++) {
    const u0 = -hl + 1.6 + k * 8, u1 = u0 + 6.4
    const o: V3 = [n[0] * Math.sign(v), n[1] * Math.sign(v), 0]
    for (const [z0, z1] of bands) {
      const q = (u: number, z: number): V3 => P(u, v + Math.sign(v) * 0.06, z)
      quad(dark, [q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1)], o)
    }
  }
  for (const s of [-1, 1]) for (const [v0, v1] of [[-8.6, -1.2], [1.2, 8.6]]) for (const [z0, z1] of bands) {
    const q = (v: number, z: number): V3 => P(s * (hl + 0.06), v, z)
    quad(dark, [q(v0, z0), q(v1, z0), q(v1, z1), q(v0, z1)], [e[0] * s, e[1] * s, 0])
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: steel, material: finish('pf-white-steel', 0xf7f6f2) }, // painted white steel, whiter than trim beside the buff
  { part: buff, material: finish('pf-buff', 0xddc9a8) },
  { part: roof, material: PALETTE.roof },
  { part: seats, material: finish('pf-seats', 0x5f7d6e) },
  { part: dark, material: PALETTE.window },
  { part: red, material: finish('neon-guardians-red', 0xc0504a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Progressive Field', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'relation/3421281', height: 66.5,
  })
  if (glb.length > 250 * 1024) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cle-progressive-field.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
