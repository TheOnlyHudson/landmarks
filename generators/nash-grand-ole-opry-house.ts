/**
 * Grand Ole Opry House, Opryland, Nashville (1974): procedural, CC0-1.0.
 * bun generators/nash-grand-ole-opry-house.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 349.5 (the
 * OSM walls run 79.5°/169.5°): +y is the building's north, +x its east.
 * Origin: the area centroid of OSM way/285022928 (-86.6918652, 36.2068862).
 * y = 0 is the lowest lidar ground under the outline (3.8 m above the
 * lidar's ground_min, on the east service side); the entrance plaza on the
 * west is 1.2 m higher, and the front's openings start there.
 *
 * Form (lidar, photos): the entrance faces WEST onto the plaza: a two-storey
 * board-formed concrete loggia (five openings below, five balconies above,
 * solid corner piers) under the front slope of a big grey metal roof. The
 * auditorium's roof is a flat-topped box, edged by a 2 m concrete band that
 * carries the "GRAND OLE OPRY HOUSE" letters, with long slopes to the west
 * (front), north and south; the north and south slopes taper in plan to a
 * 12 m end, over red-brick walls with a broad concrete fascia. Lower brick
 * wings with metal roofs sloping outward fill the corners beside the front.
 * The stage's fly tower stands east of the hall, and the flat-roofed
 * backstage blocks run east to the service yard.
 * The brief described a "white-columned gabled entrance": no photo shows
 * one (that is the Opryland Hotel's front); the model follows the photos.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, 1 m grid, read with
 * tools/lidar_frame.py at bearing 349.5. Heights above y = 0:
 * hall flat top 27.6 (x -46..-4, y -28..8); the slopes' upper edge 25.6;
 * front slope down to ~13.6 at the front (rate 0.59); north/south slopes
 * to 13.7 at y = 37.5 / -57.5, where they are 12 m wide (x -28.5..-16.5);
 * fly tower 35.2 at its west side falling to 29.2 at the east (x -4..12.5);
 * the corner wings' roofs 13.4 falling to 6.2; backstage blocks 11.2,
 * 16.7, 9.5, 9.9 and 6.6.
 * OSM: way/285022928 (Q7098695), building=yes, no heights or parts; its
 * outline gives the front block (x -66.5..-56.7, y -28..8), the wings, the
 * tapered ends and the backstage blocks.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-grand-ole-opry-house/photos):
 *  p1 "Grand Ole Opry House 2022b.jpg", Antony-22, CC BY-SA 4.0: front from
 *     the north-west; the north wing, the Circle Room glazing, brick sides.
 *  p2 "Grand Ole Opry House 2022a.jpg", Antony-22, CC BY-SA 4.0: front,
 *     frontal; the roof slope, the lettered band, the side wings' raking
 *     roofs, metal roof colour.
 *  p3 "Grand Ole Opry House, Aug 17.jpg", An Errant Knight, CC BY-SA 4.0.
 *  p4 "Backside Grand Ole Opry House, Aug 17.jpg", An Errant Knight,
 *     CC BY-SA 4.0: brick and concrete back.
 *  p6 "Grand Ole Opry (97056906).jpg", Ken Lund, CC BY-SA 2.0: front
 *     frontal, used for the bay layout (openings 6.6 / 3.1 / 6.8 / 3.1 /
 *     6.6 m, narrow end bays 2.2 m, piers 0.7–0.8 m, corner piers 0.8 m)
 *     and storey heights (ground
 *     openings 4.7 m, band 2.3, balconies 3.7, top band 1.7).
 *  p9 "Grand Ole Opry - Nashville - Tennessee - USA (10234065546).jpg",
 *     Adam Jones, CC BY-SA 2.0: the side: concrete raking fascia over brick,
 *     the lower wing's metal roof.
 *  NAIP (USDA, public domain): white flat roofs, grey metal slopes.
 *
 * Estimated: the front block's height (photo p6 scaled by its OSM width,
 * 13 m above the plaza, against lidar's 12.4 at the eave: 12.4 used); the
 * fascia depth (1.2 m); the loggia depth (3 m, from the shadows in p1/p6);
 * the letters' size (a plain strip, 18 × 1.1 m).
 * Terraces: either side of the front stand 8.6 m brick-and-concrete
 * terraces over the Circle Room (north) and the box office (south), with a
 * stair down from the south one (lidar 8–9 m, photos p1, p2). They lie
 * outside the OSM outline; the north one stops at the Opry Shop (x -64).
 * Left out: the temporary banners on the front, the north stair and
 * terraces, the plaza planters, rooftop plant, the letters' shapes (a plain
 * strip, as STYLE.md asks for signs that are not the landmark itself).
 * Night: the loggia glass is `window-2` (a darker slate: it sits 3 m back
 * in shadow in every photo; lit lobby at night); the letters
 * are `neon-opry-letters`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, triangulate, flatShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { triO, quadO, box } from './nash-tennessee-state-capitol'

// ---------------------------------------------------------------- heights (lidar, above y = 0)
const PLAZA = 1.2
const TOP = 27.6 // the flat top's band
const SLOPE_TOP = 25.6
const FRONT = 13.6 // the front's eave
const END = 13.7 // the tapered ends' eave
const X_FRONT = -66.5, X_TOPW = -46, X_TOPE = -4
const Y_N = 8, Y_S = -28, Y_C = -10
const END_HALF = 37.5 - Y_C, END_X0 = -28.5, END_X1 = -16.5
const FASCIA = 1.2

/** The hall's roof height: the lowest of its facet planes. */
function roofH(x: number, y: number) {
  const w = FRONT + ((x - X_FRONT) * (SLOPE_TOP - FRONT)) / (X_TOPW - X_FRONT)
  const d = Math.abs(y - Y_C) - (Y_N - Y_C)
  const ns = SLOPE_TOP - (d * (SLOPE_TOP - END)) / (END_HALF - (Y_N - Y_C))
  return Math.min(SLOPE_TOP, w, ns)
}

/** A vertical wall a→b (outside on the right of a ring wound counter-clockwise), bottom za0/zb0, top za1/zb1. */
function wall(p: Part, a: XY, b: XY, za0: number, zb0: number, za1: number, zb1: number) {
  const out: V3 = [b[1] - a[1], a[0] - b[0], 0]
  if (za1 - za0 < 1e-3 && zb1 - zb0 < 1e-3) return
  quadO(p, [a[0], a[1], za0], [b[0], b[1], zb0], [b[0], b[1], zb1], [a[0], a[1], za1], out)
}

/** A sloped (or flat) cap over a ring, its height from h(x, y) (planar over the ring). */
function cap(p: Part, ring: XY[], h: (x: number, y: number) => number) {
  for (const [a, b, c] of triangulate(ring)) {
    const P = (q: XY): V3 => [q[0], q[1], h(q[0], q[1])]
    triO(p, P(ring[a]), P(ring[b]), P(ring[c]), [0, 0, 1])
  }
}

/** Walls of a roofed block over ring: brick up to the fascia, a concrete band above. */
function walls(brick: Part, conc: Part, ring: XY[], h: (x: number, y: number) => number, band: number, skip: (a: XY, b: XY) => boolean = () => false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (skip(a, b)) continue
    const ha = h(a[0], a[1]), hb = h(b[0], b[1])
    wall(brick, a, b, 0, 0, ha - band, hb - band)
    wall(conc, a, b, ha - band, hb - band, ha, hb)
  }
}

/** A flat-roofed backstage block: brick walls, a concrete coping, a pale flat roof. */
function flatBlock(brick: Part, conc: Part, x0: number, y0: number, x1: number, y1: number, z: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(brick, conc, r, () => z, 0.8)
  cap(conc, r, () => z)
}

const mirror = (r: XY[]): XY[] => r.map(([x, y]): XY => [x, 2 * Y_C - y]).reverse()
const FB = -56.5 // the front block's back (the wings' west face)
const XB = X_FRONT + 3.0 // the loggia's back wall: the frame stands 3 m in front of it

function build() {
  const brick = new Part(), conc = new Part(), roof = new Part(), win = new Part(), wood = new Part(), sign = new Part()

  // ------------------------------------------------------------ the hall: walls under the roof
  const hall: XY[] = [
    [XB, Y_N], [XB, Y_S], [FB, Y_S], [X_TOPW, Y_S], [END_X0, Y_C - END_HALF], [END_X1, Y_C - END_HALF],
    [X_TOPE, Y_S], [X_TOPE, Y_N], [END_X1, Y_C + END_HALF], [END_X0, Y_C + END_HALF], [X_TOPW, Y_N], [FB, Y_N],
  ]
  for (let i = 0; i < hall.length; i++) {
    const a = hall[i], b = hall[(i + 1) % hall.length]
    if (a[0] === X_TOPE && b[0] === X_TOPE) continue // inside the fly tower
    const ha = roofH(a[0], a[1]), hb = roofH(b[0], b[1])
    const front = Math.max(a[0], b[0]) <= FB + 1e-6 // the concrete front block's faces
    if (front) {
      const fa = Math.min(FRONT, ha), fb = Math.min(FRONT, hb)
      wall(conc, a, b, 0, 0, fa, fb)
      wall(brick, a, b, fa, fb, ha - FASCIA, hb - FASCIA)
      wall(conc, a, b, Math.max(fa, ha - FASCIA), Math.max(fb, hb - FASCIA), ha, hb)
      continue
    }
    wall(brick, a, b, 0, 0, ha - FASCIA, hb - FASCIA)
    wall(conc, a, b, ha - FASCIA, hb - FASCIA, ha, hb)
  }
  // the roof: the front slope, the tapered north and south slopes
  cap(roof, [[X_FRONT, Y_N], [X_FRONT, Y_S], [X_TOPW, Y_S], [X_TOPW, Y_N]], roofH)
  cap(roof, [[X_TOPW, Y_N], [X_TOPE, Y_N], [END_X1, Y_C + END_HALF], [END_X0, Y_C + END_HALF]], roofH)
  cap(roof, [[END_X0, Y_C - END_HALF], [END_X1, Y_C - END_HALF], [X_TOPE, Y_S], [X_TOPW, Y_S]], roofH)
  // the flat top and its concrete band
  box(conc, X_TOPW, Y_S, X_TOPE, Y_N, SLOPE_TOP - 1.5, TOP, conc, 0.3)
  // the letters on the band's west face (a plain strip)
  flatShape(sign, { o: [X_TOPW, Y_C, 0], n: [-1, 0] }, [[-9, 26.05], [9, 26.05], [9, 27.15], [-9, 27.15]], 0.08)

  // ------------------------------------------------------------ the corner wings
  const wingH = (_x: number, y: number) => {
    const d = Math.abs(y - Y_C) - (Y_N - Y_C)
    return 13.4 - (d * 7.2) / 21
  }
  const wingN: XY[] = [[FB, Y_N], [X_TOPW, Y_N], [-33.5, 29], [FB, 29]]
  const wingS = mirror(wingN)
  const onHall = (a: XY, b: XY) => (a[1] === b[1] && (a[1] === Y_N || a[1] === Y_S)) || (a[0] !== b[0] && a[1] !== b[1])
  for (const w of [wingN, wingS]) {
    walls(brick, conc, w, wingH, 0.8, onHall)
    cap(roof, w, wingH)
  }
  // The terraces either side of the front (lidar 8–9 m; photos p1, p2): brick
  // under a concrete deck edge, glazed at the plaza (the Circle Room north, the
  // box office south); the south one steps down to the plaza by a stair.
  // They stand outside the OSM outline; the north one stops at the Opry
  // Shop (way/1054121429, x <= -64).
  const TER = 8.6
  const terrace = (x0: number, y0: number, x1: number, y1: number, g0: number, g1: number) => {
    box(brick, x0, y0, x1, y1, 0, TER - 1.0, null)
    box(conc, x0 - 0.1, y0 - 0.1, x1, y1 + 0.1, TER - 1.0, TER, conc, 0.1)
    const f: Face = { o: [x0, Y_C, 0], n: [-1, 0] }
    flatShape(win, f, [[-(g1 - Y_C), PLAZA], [-(g0 - Y_C), PLAZA], [-(g0 - Y_C), TER - 2.2], [-(g1 - Y_C), TER - 2.2]], 0.06)
  }
  terrace(-64, Y_N, FB, 37, Y_N + 1, 31)
  terrace(X_FRONT, -35, FB, Y_S, -34.2, Y_S - 0.8)
  { // the stair down from the south terrace (lidar 5–6 m falling to the plaza at y -48)
    const xa = -63, xb = -58, ya = -35, yb = -48
    const T = (x: number, y: number, z: number): V3 => [x, y, z]
    quadO(conc, T(xa, ya, TER - 0.6), T(xb, ya, TER - 0.6), T(xb, yb, PLAZA), T(xa, yb, PLAZA), [0, -1, 2])
    for (const [x, o] of [[xa, -1], [xb, 1]] as [number, number][]) {
      triO(conc, T(x, ya, TER - 0.6), T(x, yb, PLAZA), T(x, ya, 0), [o, 0, 0])
      triO(conc, T(x, yb, PLAZA), T(x, yb, 0), T(x, ya, 0), [o, 0, 0])
    }
  }

  // ------------------------------------------------------------ the front: concrete loggia
  // The frame (square piers, deep beams) stands on the OSM front line; the
  // glazed back wall of the two-tier loggia is 3 m behind it, in shadow.
  const F: Face = { o: [XB, Y_C, 0], n: [-1, 0] }
  const ys = (s: number) => Y_C - s // s along the front, + to the south
  // p6: five broad bays plus a narrow bay at each end, so the dark openings
  // run nearly the full 36 m; thin piers, 0.8 m corner piers
  const bays: XY[] = [[-17.2, -15.0], [-14.3, -8.2], [-7.4, -4.2], [-3.4, 3.4], [4.2, 7.4], [8.2, 14.3], [15.0, 17.2]]
  const G0 = PLAZA, G1 = 5.9, U0 = 8.2, U1 = 11.9
  for (const [s0, s1] of bays) {
    flatShape(win, F, [[s0, G0], [s1, G0], [s1, G1], [s0, G1]], 0.05)
    flatShape(win, F, [[s0, U0 + 0.9], [s1, U0 + 0.9], [s1, U1], [s0, U1]], 0.05)
    flatShape(wood, F, [[s0, U0], [s1, U0], [s1, U0 + 0.9], [s0, U0 + 0.9]], 0.05)
  }
  const frame = (s0: number, s1: number, z0: number, z1: number, x0 = X_FRONT) => box(conc, x0, Math.min(ys(s0), ys(s1)), XB + 0.02, Math.max(ys(s0), ys(s1)), z0, z1, conc, 0.12)
  frame(-18, -17.2, 0, FRONT)
  frame(17.2, 18, 0, FRONT)
  for (const [a, b] of [[-15.0, -14.3], [14.3, 15.0], [-8.2, -7.4], [-4.2, -3.4], [3.4, 4.2], [7.4, 8.2]]) frame(a, b, 0, U1)
  frame(-17.2, 17.2, G1, U0)
  frame(-17.2, 17.2, U1, FRONT)
  // the balconies' timber parapets, a metre behind the frame
  for (const [s0, s1] of bays) box(wood, X_FRONT + 1.0, Math.min(ys(s0), ys(s1)), X_FRONT + 1.25, Math.max(ys(s0), ys(s1)), U0, U0 + 0.9, wood)

  // ------------------------------------------------------------ the fly tower
  const fly: XY[] = [[X_TOPE, Y_S], [12.5, Y_S], [12.5, Y_N], [X_TOPE, Y_N]]
  const flyH = (x: number) => 35.2 - ((x - X_TOPE) * 6) / 16.5
  walls(brick, conc, fly, (x) => flyH(x), 1.0)
  cap(roof, fly, (x) => flyH(x))

  // ------------------------------------------------------------ backstage blocks (lidar heights)
  flatBlock(brick, conc, X_TOPE, -27.2, 41.8, Y_N, 11.2)
  flatBlock(brick, conc, 41.8, -20.3, 70.2, Y_N, 16.7)
  flatBlock(brick, conc, -12, Y_N, 66.8, 29.7, 9.5)
  flatBlock(brick, conc, 44.3, 29.6, 66.8, 46.6, 9.9)
  flatBlock(brick, conc, 1.8, 29.6, 27.2, 49.1, 6.6)

  return finishGlb('Grand Ole Opry House', [
    { part: brick, material: finish('opry-brick', 0xb26d5d) },
    { part: conc, material: finish('opry-concrete', 0xd6ccb8) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: windowVariant(2, 0x4f5c69) }, // the loggia's glass, deep in shadow
    { part: wood, material: finish('opry-wood', 0xb98559) },
    { part: sign, material: finish('neon-opry-letters', 0xf2efe8) },
  ], { bearing: 349.5, height: 35.2, replaces: ['way/285022928'] }, 5000)
}

if (import.meta.main) await writeModel('nash-grand-ole-opry-house', build())
