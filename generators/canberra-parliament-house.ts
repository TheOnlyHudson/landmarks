/**
 * Parliament House, Capital Hill, Canberra: procedural, CC0-1.0.
 * bun generators/canberra-parliament-house.ts
 *
 * Builds with the kit exported by generators/sydney-tower-eye.ts (lathe,
 * tube, box, prism, skin, face, saveLods) and polyTris from
 * generators/berlin-oberbaum-bridge.ts; merge sydney-tower-eye.ts first.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 37 (the land
 * axis: +y runs from the flagmast through the Great Verandah and forecourt
 * toward Old Parliament House and the War Memorial). Origin at the flagmast
 * (OSM node/163535624, 149.124438, -35.308186), the building's centre of
 * symmetry; the X-shaped outline way/5035605 has its centroid 11 m in front
 * of it (its front and rear arms differ). y = 0 is the ground the building
 * is set into: the forecourt and the foot of the grass ramps.
 *
 * Designed by Mitchell/Giurgola & Thorp (Romaldo Giurgola), opened 1988.
 * Built into Capital Hill: two great boomerang-shaped walls curve away from
 * each other through the centre; between them in front and behind, grass
 * ramps rise over the roof to the flagmast; the House of Representatives
 * (east, x > 0) and Senate (west) wings sit in the walls' concave sides.
 *
 * Published (Wikipedia "Parliament House, Canberra"): 107 m to the top;
 * flagmast 81 m, polished stainless steel, 250 t; flag 12.8 x 6.4 m; the
 * roof slab (RL617) is the base of the flagmast, so the mast's feet stand
 * 26 m up.
 * OSM (LPI imagery, parts on way/5035605 and around it): grass ramps
 * 513059766, 513726045 (front) and 514514098 (rear) rising to 18 m; the
 * central grass strips 513072030 and 513445420 and the roof terrace
 * 512994082 at 20 m; the glass pyramid 514911884 to 25 m; the curved walls'
 * crowns 518453394 / 518136398 (opening 20.1-23.5 m under a beam to 27 m),
 * the walls at 23 m to |y| 72 (opening 19-22 m at the step), 19 m to |y| 103
 * (opening 15-18 m), 15 m beyond; the east (House) wing's blocks at 10-16 m,
 * its chamber 511936333 at 18.3 m under a roof to 25.8 m; the ministerial
 * wing 208691150 (relation/3180204, 16 m) and its block 512690738 at 15.25 m; the
 * Great Verandah 511178500. OSM maps the Senate wing only as an outline
 * (relation/2829202, 11 m) with no parts; it is drawn as the House wing
 * mirrored, as the building is symmetrical about the land axis.
 * Photo-scaled (p6, square-on from the forecourt; the flagmast hung from
 * its published 81 m at 5.9 px/m): the legs land on the walls' crowns and
 * rise to two twin posts at 59 m, ties at 62 m and 80 m, posts to 85 m, the
 * mast to 107 m; posts 4.6 m apart; legs about 1.8 m thick. The Great
 * Verandah (77 m wide, OSM) stands 11.5 m: an open central loggia of tall
 * square white marble columns, side sections with two rows of windows
 * between piers; the ramps' faces to the forecourt are sloping pale stone.
 * Estimated: the ramps' slope (OSM's skillion, read as falling evenly from
 * 18 m at the centre to 4.5 m at the arm tips, where OSM's small tip roofs
 * stand 4.75-5.9 m); the walls' fall from 15 m to 5 m at their
 * tips; the foyer block behind the verandah (11.2 m, grass roof, OSM's
 * green roof 518132869); window panels on the wings.
 * Left out: the forecourt's mosaic and pool, paving, roads, gardens and
 * courtyard planting; the many small roof structures and skylights.
 *
 * Terrain (Mapterhorn z12 only): the z12 surface shows the building itself
 * as a flat mesa about 19.6 m above the table's lowest ground (a surface
 * model), and the ground falling away to the arm tips. The model keeps its
 * real heights from the ground at the forecourt and arm tips.
 *
 * Colours from daylight photos: the walls and ramp faces pale grey-beige
 *   granite (p6 #cdc8bd sunlit) -> granite 0xd5d0c4; the grass bright
 *   green (p4, p6) -> 0x8fae5a; the verandah and wings white marble and
 *   cream render -> 0xf0ece3; the chambers' roofs orange-copper (p4, p5)
 *   -> 0xbf7552; the flagmast polished steel -> 0xd2d6da.
 * Night (p13): the verandah and walls are floodlit, the flagmast lit white,
 *   the flag floodlit; the verandah glazing and the wings' windows are
 *   `window`. The flag is drawn in the `window` slate (no seventh material).
 *
 * LODs: the low model has the walls in 21 segments a side, six-sided legs
 *   drawn about a quarter thicker than real so the mast holds at phone size,
 *   and window panels on the long wing faces; the detail model
 *   (models/canberra-parliament-house.detail.glb) has the full wall curve,
 *   round legs, the verandah's full column and window rhythm and panels on
 *   every wing face.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - p1 "Parliament house Canberra from above.jpg", David Burke (Orangedrummaboy), CC BY-SA 4.0
 * - p3 "CSIRO ScienceImage 11533 Parliament House Canberra.jpg", Nick Pitsas, CSIRO, CC BY 3.0
 * - p4 "CSIRO ScienceImage 11531 Parliament House Canberra.jpg", Nick Pitsas, CSIRO, CC BY 3.0
 * - p5 "CSIRO ScienceImage 11612 Parliament House Canberra.jpg", Nick Pitsas, CSIRO, CC BY 3.0
 * - p6 "Canberra (AU), Parliament House -- 2019 -- 1746.jpg", Dietmar Rabich, CC BY-SA 4.0
 * - p9 "Canberra Parliament House in April 2019.jpg", Amritpal Singh Mann, CC BY-SA 4.0
 * - p13 "Parliament House at dusk, Canberra ACT.jpg", Thennicke, CC BY-SA 4.0
 * - p16 "Parliament House roof pano, Canberra.jpg", Dicklyon, CC BY-SA 4.0
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { PALETTE } from './palette'
import { tube, box, prism, skin, face, saveLods, type Layer, type XY } from './sydney-tower-eye'
import { polyTris } from './berlin-oberbaum-bridge'

// East wing blocks (OSM building:parts, simplified to 0.6 m), [height, outline]; the west wing mirrors them.
const WING: [number, XY[]][] = [
  [11.0, [[118.0, 128.8], [128.2, 139.3], [128.5, 128.0], [132.2, 128.1], [132.7, 98.0], [143.9, 98.6], [144.6, 32.4], [133.5, 32.5], [133.4, 25.1], [138.3, 25.2], [138.3, 26.8], [147.8, 27.2], [148.2, 5.4], [117.0, 5.2], [116.8, 21.1], [118.9, 24.7], [118.4, 68.7], [122.9, 68.7], [122.7, 73.9], [118.1, 73.7]]], // way/511936293
  [11.0, [[118.9, 24.7], [105.7, 24.6], [105.8, 22.6], [94.5, 22.3], [95.1, -25.6], [118.7, -24.8], [117.4, -22.4], [107.9, -22.5], [107.5, -6.0], [106.3, -5.9], [106.2, 4.6], [107.6, 4.7], [107.2, 20.9], [116.8, 21.1]]], // way/511936305
  [11.0, [[79.2, 97.6], [85.8, 97.9], [85.9, 108.6], [89.6, 112.0], [92.7, 112.2], [95.5, 110.9], [96.8, 109.3], [96.9, 106.4], [104.5, 106.5], [104.9, 73.6], [79.5, 73.3]]], // way/511936316
  [16.0, [[65.2, 72.7], [100.3, 73.4], [100.4, 68.1], [105.0, 68.2], [105.8, 22.6], [94.5, 22.3], [89.1, 24.8], [88.9, 28.5], [83.7, 28.3], [83.5, 38.3], [58.1, 38.0], [58.2, 67.0], [65.3, 67.2]]], // way/511936318
  [11.0, [[107.3, -76.0], [107.2, -107.5], [100.1, -107.5], [98.9, -110.2], [96.4, -112.2], [91.1, -112.2], [88.0, -109.4], [87.0, -103.4], [81.6, -103.2], [81.3, -76.6]]], // way/511936325
  [16.0, [[107.2, -70.6], [102.5, -70.7], [102.6, -76.2], [67.7, -76.6], [67.6, -71.6], [60.0, -71.7], [59.6, -41.0], [84.6, -40.0], [84.7, -29.9], [90.6, -29.9], [90.4, -25.8], [106.2, -25.1]]], // way/511936327
  [16.0, [[42.5, 23.0], [89.1, 24.8], [94.5, 22.3], [95.1, -25.6], [43.2, -26.3], [43.3, -3.5], [46.8, -3.5], [46.6, 2.6], [43.3, 2.7]]], // way/511936329
  [11.0, [[146.6, -4.9], [148.3, -4.8], [148.5, -25.9], [138.9, -26.2], [138.9, -25.1], [134.7, -25.2], [134.7, -32.5], [145.7, -32.3], [146.8, -99.0], [135.7, -99.2], [136.2, -129.1], [132.3, -129.1], [132.2, -139.9], [121.0, -128.9], [120.4, -75.9], [125.1, -75.8], [124.9, -70.4], [120.2, -70.4], [118.7, -24.8], [117.4, -22.4], [116.8, -5.8]]], // way/512718043
  [10.5, [[122.5, 5.0], [146.5, 5.4], [146.6, -4.9], [122.6, -5.7], [122.5, -3.9], [130.0, -3.5], [130.1, 3.4], [122.4, 3.2]]], // way/512718046
  [10.0, [[122.4, 3.2], [122.5, -3.9], [130.0, -3.5], [130.1, 3.4]]], // way/512718049
  [5.67, [[117.0, 5.2], [122.5, 5.0], [122.6, -5.7], [116.8, -5.8], [116.8, -3.9], [107.5, -4.3], [107.5, -6.0], [106.3, -5.9], [106.2, -2.3], [116.9, -2.1], [116.8, 1.4], [106.3, 1.3], [106.2, 4.6], [107.6, 4.7], [107.6, 3.5], [117.0, 3.6]]], // way/511936301
  [11.0, [[154.5, 4.9], [156.2, 4.9], [156.3, -3.9], [154.7, -4.0]]], // way/511936289
  [10.0, [[146.6, 2.5], [147.9, 2.6], [147.9, 3.9], [154.5, 3.9], [154.6, -3.1], [148.0, -3.2], [148.0, -1.9], [146.6, -2.0]]], // way/511936291
]
const CHAMBER: XY[] = [[51.5, 9.2], [60.4, 18.7], [82.3, 19.0], [91.3, 10.6], [91.5, -12.2], [83.1, -21.1], [60.5, -21.2], [51.8, -12.6]] // way/511936333
const FRONT_E: XY[] = [[33.2, 57.5], [-1.0, 56.6], [-1.1, 75.4], [25.6, 76.2], [40.9, 115.7], [86.1, 222.8], [164.1, 223.6], [147.9, 182.9], [143.3, 182.5], [71.9, 116.1], [50.1, 89.7], [37.7, 67.9]] // way/513059766
const FRONT_W: XY[] = [[-1.0, 56.6], [-32.1, 56.1], [-44.9, 81.1], [-54.4, 95.0], [-64.7, 106.8], [-105.3, 142.3], [-149.1, 178.2], [-152.9, 178.0], [-170.6, 217.7], [-90.5, 219.2], [-29.1, 74.7], [-1.1, 75.4]] // way/513726045
const REAR: XY[] = [[-163.2, -230.7], [-149.7, -183.4], [-143.8, -183.0], [-68.5, -115.2], [-50.1, -93.3], [-36.7, -70.6], [37.4, -68.7], [51.2, -90.7], [69.0, -111.0], [146.5, -177.5], [151.5, -177.4], [168.8, -226.0], [105.5, -226.2], [89.6, -190.5], [93.3, -190.6], [60.5, -114.3], [50.8, -114.3], [50.4, -98.3], [40.6, -98.8], [40.3, -82.6], [32.4, -83.1], [31.9, -75.0], [-29.9, -76.1], [-30.1, -83.7], [-38.8, -84.4], [-38.8, -99.4], [-48.2, -100.6], [-47.8, -116.5], [-58.0, -116.9], [-89.1, -193.5], [-85.0, -193.3], [-100.4, -230.1]] // way/514514098
const STRIP_F: XY[] = [[25.5, 29.5], [-24.4, 27.9], [-26.0, 36.2], [-32.1, 56.1], [-11.2, 56.5], [-11.0, 34.4], [9.7, 34.8], [9.4, 56.8], [33.2, 57.5], [29.7, 47.7]] // way/513072030
const STRIP_R: XY[] = [[-23.1, -29.0], [-28.8, -51.5], [-36.7, -70.6], [37.4, -68.7], [31.3, -54.6], [24.4, -27.4]] // way/513445420
const TERRACE: XY[] = [[-24.4, 27.9], [25.5, 29.5], [24.4, -27.4], [-23.1, -29.0]] // way/512994082
const MINISTERIAL: XY[] = [[-46.2, -152.4], [-46.4, -134.4], [-48.1, -133.2], [-48.8, -131.3], [-48.1, -129.3], [-46.4, -127.9], [-46.6, -102.1], [-36.9, -102.0], [-37.0, -86.2], [-28.4, -86.1], [-28.5, -78.1], [29.5, -76.9], [29.7, -85.0], [38.3, -84.9], [38.5, -100.6], [48.2, -100.4], [48.6, -125.9], [51.0, -128.6], [50.7, -130.7], [48.7, -132.5], [49.0, -150.7], [33.4, -151.1], [33.2, -142.8], [-30.5, -143.9], [-30.2, -152.1]] // way/208691150
const MIN_BLOCK: XY[] = [[-12.6, -126.0], [-12.5, -129.8], [15.2, -129.3], [15.1, -125.5]] // way/512690738
const VERANDAH: XY[] = [[-21.5, 126.6], [-11.8, 129.6], [2.2, 130.5], [16.4, 127.3], [14.7, 121.9], [32.6, 122.3], [34.9, 126.9], [36.1, 127.0], [33.2, 120.1], [33.5, 116.6], [-37.4, 115.5], [-37.3, 119.6], [-40.9, 125.5], [-39.8, 125.7], [-37.2, 121.4], [-19.4, 121.8]] // way/511178500

// The east wall's inner face (toward the axis), rear tip to front tip, from way/5035605.
const CURVE: XY[] = [[152, -177], [141, -168], [129, -158], [116, -147], [100, -134], [89, -124], [76, -113], [66, -103], [60, -96], [54, -90], [49, -83], [45, -77], [42, -71], [39, -65], [36, -59], [34, -50], [31, -41], [28, -30], [27, -20], [26, -12], [26, -4], [26, 4], [27, 12], [27, 17], [28, 20], [29, 30], [31, 37], [33, 44], [35, 50], [37, 57], [40, 63], [44, 72], [52, 86], [60, 98], [71, 110], [79, 119], [88, 127], [97, 136], [108, 147], [118, 156], [127, 165], [136, 173], [148, 183]]
const WALL_T = 3.2

/** The walls' top and the opening (z0..z1) at |y|, after OSM's wall parts. */
function wallAt(ay: number): { h: number; open?: [number, number] } {
  if (ay < 25.5) return { h: 27, open: [20.1, 23.5] }
  if (ay < 28.5) return { h: 27 }
  if (ay < 66) return { h: 23 }
  if (ay < 73) return { h: 23, open: [19, 22] }
  if (ay < 103) return { h: 19 }
  if (ay < 110) return { h: 19, open: [15, 18] }
  if (ay < 135) return { h: 15 }
  return { h: 15 - ((ay - 135) / 48) * 10 }
}
const FRONT_TIP = 223, REAR_TIP = -231, RAMP_TOP = 18
// the ramps fall from 18 m to 4.5 m at the arm tips, where OSM's tip roofs (518942550-559, 518803278-9) stand 4.75-5.9 m
const RAMP_TIP = 4.5
const rampZ = (y: number) => RAMP_TIP + (RAMP_TOP - RAMP_TIP) * (y >= 0 ? Math.min(1, Math.max(0, (FRONT_TIP - y) / (FRONT_TIP - 75))) : Math.min(1, Math.max(0, (y - REAR_TIP) / (-84 - REAR_TIP))))

type Set = { granite: Part; grass: Part; marble: Part; win: Part; steel: Part; copper: Part }
const mk = (): Set => ({ granite: new Part(), grass: new Part(), marble: new Part(), win: new Part(), steel: new Part(), copper: new Part() })
const low = mk(), det = mk()

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccwR = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)
const mirror = (r: XY[]): XY[] => r.map(([x, y]) => [-x, y] as XY).reverse()

/** A solid whose top is z(x, y) (planar per triangle), with vertical sides down to 0. */
function slopedSolid(top: Part, side: Part, poly: XY[], z: (p: XY) => number) {
  const r = ccwR(poly)
  for (const [a, b, c] of polyTris(r)) face(top, [[a[0], a[1], z(a)], [b[0], b[1], z(b)], [c[0], c[1], z(c)]], [0, 0, 1])
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const za = z(a), zb = z(b)
    if (za < 0.05 && zb < 0.05) continue
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    if (za > 0.05 && zb > 0.05) face(side, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb], [a[0], a[1], za]], n)
    else if (za > 0.05) face(side, [[a[0], a[1], 0], [b[0], b[1], 0], [a[0], a[1], za]], n)
    else face(side, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb]], n)
  }
}

/** Window panels on the outward faces of a prism, 0.05 m proud. */
function panels(p: Part, poly: XY[], z0: number, z1: number, w: number, pitch: number, minLen: number) {
  const r = ccwR(poly)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const count = Math.max(1, Math.floor((L - 2) / pitch))
    const s0 = (L - (count - 1) * pitch) / 2
    for (let k = 0; k < count; k++) {
      const s = s0 + k * pitch
      const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * 0.05, a[1] + u[1] * t + n[1] * 0.05, z]
      face(p, [P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1)], [n[0], n[1], 0])
    }
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // ---- The two curved walls: a ribbon of segments, stepping down outward, with openings at the steps ----
  const curve = d ? CURVE : CURVE.filter((_, i) => i % 2 === 0 || i === CURVE.length - 1)
  for (const side of [1, -1]) {
    const C = curve.map(([x, y]) => [side * x, y] as XY)
    // outward normals (away from the axis)
    const nrm = C.map((_, i) => {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)]
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
      let n: XY = [dy / l, -dx / l]
      if (n[0] * side < 0) n = [-n[0], -n[1]]
      return n
    })
    for (let i = 0; i < C.length - 1; i++) {
      const a = C[i], b = C[i + 1]
      const ao: XY = [a[0] + nrm[i][0] * WALL_T, a[1] + nrm[i][1] * WALL_T], bo: XY = [b[0] + nrm[i + 1][0] * WALL_T, b[1] + nrm[i + 1][1] * WALL_T]
      const quad: XY[] = [a, b, bo, ao]
      const w = wallAt(Math.abs((a[1] + b[1]) / 2))
      if (w.open) {
        prism(s.granite, quad, 0, w.open[0], { top: true })
        prism(s.granite, quad, w.open[1], w.h, { bottom: true })
      } else prism(s.granite, quad, 0, w.h)
    }
    // the openings' jambs: short wall pieces either side of each opening
    for (const yj of [-25.5, 25.5, -66, 66, -73, 73, -103, 103, -110, 110]) {
      // find the point on the curve at this y
      let k = 0
      while (k < C.length - 2 && C[k + 1][1] < yj) k++
      const t = (yj - C[k][1]) / (C[k + 1][1] - C[k][1] || 1)
      const p: XY = [C[k][0] + (C[k + 1][0] - C[k][0]) * t, yj]
      const n = nrm[k]
      const c: XY = [p[0] + n[0] * WALL_T / 2, p[1] + n[1] * WALL_T / 2]
      const w = wallAt(Math.abs(yj) - 0.5)
      const ang = Math.atan2(n[1], n[0])
      box(s.granite, c, WALL_T / 2, 1.2, 0, w.h, ang)
    }
  }

  // ---- Grass ramps over the roof, the central strips, the roof terrace and its glass pyramid ----------
  slopedSolid(s.grass, s.granite, FRONT_E, ([, y]) => rampZ(y))
  slopedSolid(s.grass, s.granite, FRONT_W, ([, y]) => rampZ(y))
  slopedSolid(s.grass, s.granite, REAR, ([, y]) => rampZ(y))
  slopedSolid(s.grass, s.granite, STRIP_F, () => 20)
  slopedSolid(s.grass, s.granite, STRIP_R, () => 20)
  slopedSolid(s.granite, s.granite, TERRACE, () => 20)
  // the Great Hall's raised roof in the front strip's notch (OSM 511607102, 19.7 m)
  slopedSolid(s.marble, s.marble, [[-11.2, 34.4], [9.7, 34.8], [9.4, 56.8], [-11.2, 56.5]], () => 21.2)
  // the glass pyramid over the Members' Hall (OSM 514911884, 16 m square, to 25 m)
  {
    const h = 7.8, z0 = 20, z1 = 25
    const B: V3[] = [[-h, -h, z0], [h, -h, z0], [h, h, z0], [-h, h, z0]]
    box(s.granite, [0, 0], h + 0.6, h + 0.6, z0, z0 + 0.6)
    for (let i = 0; i < 4; i++) {
      const a = B[i], b = B[(i + 1) % 4]
      const A: V3 = [a[0], a[1], z0 + 0.6], Bb: V3 = [b[0], b[1], z0 + 0.6]
      const nx = (a[0] + b[0]) / 2, ny = (a[1] + b[1]) / 2
      face(s.win, [A, Bb, [0, 0, z1]], [nx, ny, h * 0.9])
    }
  }

  // ---- Great Verandah: central loggia of tall marble columns, side sections with two rows of windows ----
  const VF = 127, VB = 115.5
  // side sections, with real window recesses
  for (const [x0, x1] of [[-38, -19], [17, 36]]) {
    prism(s.marble, [[x0, VB], [x1, VB], [x1, VF - 0.6], [x0, VF - 0.6]], 0, 11.5)
    const L = x1 - x0, bays = Math.round(L / 3.8), pw = L / bays
    const holes: XY[][] = []
    for (let k = 0; k < bays; k++) {
      const c = pw * (k + 0.5)
      for (const [z0, z1] of [[1.0, 4.6], [6.0, 9.6]]) holes.push([[c - pw * 0.32, z0], [c + pw * 0.32, z0], [c + pw * 0.32, z1], [c - pw * 0.32, z1]])
    }
    skin(s.marble, s.win, [x1, VF - 0.6], [x0, VF - 0.6], 0, 11.5, 0.6, holes, { ends: true })
  }
  // the loggia: glazed wall set back, square columns, entablature and roof
  const LX0 = -19, LX1 = 17
  face(s.win, [[LX1, 122.4, 0], [LX0, 122.4, 0], [LX0, 122.4, 10], [LX1, 122.4, 10]].map((q) => q as V3), [0, 1, 0])
  prism(s.marble, [[LX0, VB], [LX1, VB], [LX1, 122.3], [LX0, 122.3]], 0, 11.5, { top: true })
  const ncol = 10
  for (let k = 0; k < ncol; k++) {
    const x = LX0 + 0.7 + ((LX1 - LX0 - 1.4) * k) / (ncol - 1)
    box(s.marble, [x, 128.5], 0.7, 0.7, 0, 10, 0)
  }
  prism(s.marble, [[LX0, 122.3], [LX1, 122.3], [LX1, 129.4], [LX0, 129.4]], 10, 11.6, { bottom: true })
  // foyer block behind the verandah, its roof grassed (OSM 518132869)
  slopedSolid(s.grass, s.marble, [[-29.1, 74.7], [25.6, 76.2], [40.9, 115.6], [-46.9, 115.6]], () => 11.2)

  // ---- The wings: OSM's House wing blocks, mirrored for the Senate ------------------------------------
  for (const side of [1, -1]) {
    for (const [h, poly] of WING) {
      const r = side > 0 ? poly : mirror(poly)
      prism(s.marble, r, 0, h)
      if (h >= 10) panels(s.win, r, 3.0, h - 2.2, d ? 3.2 : 4.4, d ? 5.2 : 8.8, d ? 6 : 14)
    }
    // the chamber: a block, its copper roof hipped up to a ridge
    const ch = side > 0 ? CHAMBER : mirror(CHAMBER)
    prism(s.marble, ch, 0, 18.3, { top: false })
    const cx = ch.reduce((a, q) => a + q[0], 0) / ch.length, cy = ch.reduce((a, q) => a + q[1], 0) / ch.length
    const ring0: V3[] = ccwR(ch).map(([x, y]) => [x, y, 18.3] as V3)
    const ring1: V3[] = ccwR(ch).map(([x, y]) => [cx + (x - cx) * 0.42, cy + (y - cy) * 0.18, 25.8] as V3)
    for (let i = 0; i < ring0.length; i++) {
      const j = (i + 1) % ring0.length
      const a = ring0[i], b = ring0[j]
      face(s.copper, [a, b, ring1[j], ring1[i]], [b[1] - a[1], -(b[0] - a[0]), Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.9])
    }
    face(s.copper, ring1, [0, 0, 1])
    if (d) panels(s.win, ch, 12, 16.5, 3.0, 4.2, 6)
  }

  // ---- Ministerial wing at the rear ----------------------------------------------------------------------
  prism(s.marble, MINISTERIAL, 0, 16)
  panels(s.win, MINISTERIAL, 3.0, 13.8, d ? 3.2 : 4.4, d ? 5.2 : 8.8, d ? 6 : 14)
  prism(s.marble, MIN_BLOCK, 0, 15.25)

  // ---- The flagmast: four legs from the walls' crowns into twin posts, the mast and the flag ----------
  const LN = d ? 10 : 6
  const postX = 2.3, KNEE = 58.5, POST_TOP = 85
  for (const sx of [1, -1]) {
    for (const sy of [1, -1]) {
      const F: V3 = [sx * 27.6, sy * 22, 26.6]
      const K: V3 = [sx * postX, sy * 0.9, KNEE - 1.5]
      const M: V3 = [F[0] + (K[0] - F[0]) * 0.86, F[1] + (K[1] - F[1]) * 0.86, F[2] + (K[2] - F[2]) * 0.86]
      tube(s.steel, [F, M, K, [sx * postX, 0, KNEE + 0.5]], d ? 0.9 : 1.15, LN, true) // drawn a little bolder in the low model
      // a foot plate on the crown
      box(s.steel, [F[0], F[1]], 1.4, 1.4, 26.4, 27.2, 0, { bottom: true })
    }
    tube(s.steel, [[sx * postX, 0, KNEE], [sx * postX, 0, POST_TOP]], d ? 0.75 : 0.95, LN, true)
  }
  for (const z of [62, 80]) box(s.steel, [0, 0], postX, 0.45, z - 0.5, z + 0.5, 0, { bottom: true })
  tube(s.steel, [[0, 0, 52], [0, 0, 107]], d ? 0.38 : 0.5, d ? 8 : 5, true)
  // the flag, flying west of the mast (a flat panel)
  box(s.win, [-0.4 - 6.4, 0], 6.4, 0.08, 107 - 6.6, 107 - 0.2, 0, { bottom: true })
}

// ---- Materials and output ----------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : p[1] > 110 ? 0.9 : 0.55)
const GRANITE: MaterialSpec = { ...finish('granite', 0xd5d0c4), floodlight: lit }
const GRASS: MaterialSpec = finish('grass-roof', 0x8fae5a, 0.95)
const MARBLE: MaterialSpec = { ...finish('marble', 0xf0ece3), floodlight: lit }
const STEEL: MaterialSpec = { ...finish('steel', 0xd2d6da, 0.4), floodlight: () => 0.85 }
const COPPER: MaterialSpec = finish('chamber-copper', 0xbf7552)
const layers = (s: Set): Layer[] => [
  { part: s.granite, material: GRANITE },
  { part: s.grass, material: GRASS },
  { part: s.marble, material: MARBLE },
  { part: s.win, material: PALETTE.window },
  { part: s.steel, material: STEEL },
  { part: s.copper, material: COPPER },
]

if (import.meta.main) {
  await saveLods('canberra-parliament-house', 'Parliament House', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the flagmast on the ground the building is set into',
    bearing: 37, height: 107,
  }, 6500)
}
