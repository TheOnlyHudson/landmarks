/**
 * Gateway Bridge (Korean War Veterans Memorial Bridge), Nashville, 2004:
 * Korean Veterans Blvd over the Cumberland River. Twin white steel tied-arch
 * ribs with nine cross struts over the main span, vertical hangers, red steel
 * plate girders under concrete parapets and sidewalks, concrete approach bents.
 *
 * Frame: +Y up, -Z north, +X east, metres; built along the bridge's axis
 * (bearing 15.6°), origin at the centroid of the man_made=bridge outline
 * (OSM way/655292643, Q48807659: -86.769204, 36.161691), y = 0 on the river.
 * Low and detail GLBs (writeBoth from dal-margaret-hunt-hill-bridge.ts): the
 * low one has single 0.4 m hangers and coarser stations; the detail one has
 * hanger pairs every 7 m and the red floor-beam ends under each hanger.
 * No road surface: the map draws the roadway; the model owns the sidewalks.
 *
 * Sources
 * - OSM way/655292643 (outline, 518 m along its axis, ends at -253 and
 *   +265.5 m), road and sidewalk ways for the deck's edges. OSM API.
 * - USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight): river surface 119.44 m
 *   NAVD88; roadway centreline profile (`road`), rib planes at x = -14 and +18
 *   (2.2 m east of OSM's road, drawn symmetric at ±16), deck 29–30 m wide,
 *   rib top fit (crown 57.6 m, 45.8 at ±42 m, 28.5 at ±66 m), strut stations.
 *   Measured.
 * - Mapterhorn terrain grid (bun tools/terrain.ts grid, z15) for the footings
 *   and bents, metres above its own river reading (119.0 m). Measured.
 * - Photos (all EVIDENCE, Wikimedia Commons):
 *   - "Gateway Bridge,Nashville, TN", Brent Moore, CC BY 2.0:
 *     https://commons.wikimedia.org/wiki/File:Gateway_Bridge,Nashville,_TN.jpg
 *     (under the arch: strut shapes, hanger pairs, red girders and beam ends)
 *   - "View of Gateway Bridge in Nashville over Cumberland River", David Kidd,
 *     CC BY-SA 2.0: https://commons.wikimedia.org/wiki/File:View_of_Gateway_Bridge_in_Nashville_over_Cumberland_River.jpg
 *   - "Korean Veterans Bridge Nashville 2022", Antony-22, CC BY-SA 4.0:
 *     https://commons.wikimedia.org/wiki/File:Korean_Veterans_Bridge_Nashville_2022.jpg
 *     (side elevation from the Seigenthaler bridge, view 285°: rise/span)
 *   - "Korean Veterans Bridge Nashville 2024", Antony-22, CC BY-SA 4.0:
 *     https://commons.wikimedia.org/wiki/File:Korean_Veterans_Bridge_Nashville_2024.jpg
 *   - "Korean War Veterans Memorial Bridge and Ascend Amphitheater",
 *     Walker Kinsler, CC BY-SA 4.0:
 *     https://commons.wikimedia.org/wiki/File:Korean_War_Veterans_Memorial_Bridge_and_Ascend_Amphitheater.jpg
 *   - "Nashville TN 2013-07-20 001", Thomas R Machnitzki, CC BY 3.0:
 *     https://commons.wikimedia.org/wiki/File:Nashville_TN_2013-07-20_001.jpg
 *     (oblique from the west bank: struts reach down to about a third of the rise)
 * - No look-only references.
 *
 * Numbers
 * - Roadway profile, rib parabola, rib planes, deck width, strut stations:
 *   lidar (measured). Roadway heights built to: see the GLB extras
 *   (south end 22.9 m, crown 26.8 m, north end 12.0 m above the river).
 * - Rib section 2.2 × 2.6 m, strut 1.5 m, girder depth 2.0 m, parapet 1.05 m,
 *   hanger spacing 7 m: estimated from the photos against the deck width.
 * - Footings (6 × 7–9 m concrete blocks where the rib meets the bank) and the
 *   approach bents (three columns under a cap, positions from lidar gaps and
 *   photos): estimated.
 * - Colours from the photos: arch white-grey, girders oxide red (pulled light),
 *   concrete warm grey. The arch and hangers carry _FLOODLIGHT (lit at night).
 *
 * Doubts
 * - The struts' curved haunches where they meet the ribs (Brent Moore's photo)
 *   are drawn as straight bars.
 * - The ribs are drawn in vertical planes at ±16 m; lidar puts them 2 m east
 *   of OSM's road centre, which is within OSM's error, so symmetry was kept.
 * - terrain.ts check: 11.6 m² of tops 0.3–0.45 m under the terrain at the
 *   outline's two ends, where the deck meets the abutment fill; left as is.
 * - Approach bent positions away from the river are approximate.
 */
import { Part, type V3 } from './mesh'
import { face, groundAt, piecewise, stations, type GroundGrid } from './bridge-kit'
import { writeBoth } from './dal-margaret-hunt-hill-bridge'
import { finish } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** The roadway, metres above the river (lidar centreline; the river reads 119.44 m NAVD88). */
const road = piecewise([
  [-256, 22.9], [-244, 23.3], [-232, 23.7], [-220, 24.2], [-208, 24.7], [-196, 25.2], [-184, 25.6], [-172, 26.1],
  [-160, 26.4], [-148, 26.6], [-136, 26.7], [-124, 26.8], [-112, 26.8], [-100, 26.7], [-88, 26.6], [-76, 26.3],
  [-64, 26.0], [-46, 25.3], [-34, 24.8], [-22, 24.4], [-10, 23.9], [2, 23.3], [14, 22.8], [26, 22.3], [38, 21.8],
  [50, 21.2], [62, 20.7], [74, 20.2], [86, 19.7], [98, 19.2], [110, 18.7], [122, 18.2], [134, 17.7], [146, 17.1],
  [158, 16.6], [170, 16.1], [182, 15.6], [194, 15.1], [206, 14.6], [218, 14.0], [230, 13.5], [242, 13.0],
  [254, 12.5], [266, 12.0],
])
/** Mapterhorn in this frame, metres above its own river reading (119.0 m). */
const GROUND: GroundGrid = { y0: -280, x0: -40, step: 10, z: [
  [19.2, 20.7, 21.4, 22, 22.4, 23.4, 24.6, 24.6, 24.7],
  [19, 20.9, 21.8, 22.2, 22.7, 23.3, 24, 23.6, 24.2],
  [18.8, 20.8, 22.3, 22.5, 23, 23.5, 23.8, 23.8, 23.4],
  [18.7, 20.8, 22.1, 22.9, 23.3, 23.8, 22.1, 21.1, 20.8],
  [19, 20.2, 20.3, 20.9, 21, 20.6, 19.1, 18.5, 12.1],
  [18.8, 18.7, 18.5, 17.7, 15.9, 11.4, 10.3, 10.5, 10.4],
  [18.3, 13.4, 10, 10.3, 10.4, 10.3, 10.1, 10, 9.9],
  [10.2, 10.3, 10.3, 10.1, 10.1, 10, 9.9, 9.5, 6.6],
  [10, 9.9, 9.6, 8.4, 5.9, 5.3, 6.1, 2.9, 0.2],
  [9.6, 9.3, 8, 6, 1.4, 0.1, 0.1, 0.1, 0.1],
  [7.4, 4, 1.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 1.5, 4.1, 5.6],
  [0.4, 0.7, 4.5, 5.8, 4.8, 5.2, 7.6, 7.4, 8.1],
  [8.7, 8.6, 8.7, 8.9, 9, 9, 9.1, 8.9, 8.5],
  [9, 9, 9.2, 9, 9.1, 9, 8.9, 8.6, 8.6],
  [10.1, 11, 9.5, 9.2, 9.1, 8.9, 8.7, 8.6, 8.6],
  [12.7, 11.4, 9.8, 9.1, 9, 8.8, 8.6, 8.5, 8.5],
  [13.9, 12.6, 10.1, 8.9, 8.8, 8.6, 8.5, 8.4, 8.3],
  [13, 12.4, 10, 8.7, 8.5, 8.4, 8.3, 8.2, 8.1],
  [12, 12.5, 9.6, 8.4, 8.3, 8.2, 8.1, 8.1, 8],
  [12.1, 11.8, 8.9, 8.1, 8.1, 8, 7.9, 7.8, 8],
  [12.3, 10.4, 8.2, 7.9, 7.8, 7.7, 7.5, 7.3, 7.4],
  [9.9, 8.2, 7.9, 7.8, 7.6, 7.5, 7.4, 7.4, 7.3],
  [7.8, 7.6, 7.6, 7.6, 7.5, 7.5, 7.4, 7.4, 7.3],
  [8.1, 8.2, 7.8, 7.6, 7.5, 7.4, 7.4, 7.4, 7.2],
  [8, 8.1, 7.7, 7.5, 7.4, 7.4, 7.3, 7.3, 7.1],
  [7.9, 8, 8.1, 7.4, 7.3, 7.3, 7.2, 7.1, 7],
  [8.1, 8.1, 8.1, 7.5, 7.4, 7.2, 7, 6.9, 6.9],
  [8.3, 8.1, 8, 7.4, 7.1, 6.9, 6.7, 6.9, 7],
  [8.2, 8, 7.9, 7.6, 7.4, 7.1, 6.9, 7, 7],
  [8.1, 8, 7.9, 7.5, 7.3, 7.1, 7, 7.1, 7.1],
  [8.2, 8, 7.7, 7.5, 7.4, 7.2, 7.1, 7, 7.3],
  [8.1, 7.9, 7.6, 7.4, 7.3, 7.2, 7.1, 7.1, 7.5],
  [8.1, 7.9, 7.5, 7.5, 7.5, 7.4, 7.3, 7.3, 7.5],
  [8, 7.7, 7.6, 7.7, 7.9, 8.1, 7.7, 7.2, 7.5],
  [7.9, 7.8, 7.9, 8.3, 8.4, 8.5, 8.4, 7.9, 7.9],
  [7.9, 7.9, 8, 8.4, 8.5, 8.7, 8.7, 8.6, 8.6],
  [8, 8.1, 8.1, 8.4, 8.5, 8.6, 8.6, 8.8, 8.9],
  [8.3, 8.3, 8.3, 8.6, 8.6, 8.7, 8.7, 8.8, 9],
  [8.5, 8.5, 8.5, 8.7, 8.7, 8.8, 8.8, 8.9, 9],
  [8.8, 8.8, 8.8, 8.8, 8.9, 8.9, 8.8, 8.9, 9.1],
  [9, 9, 9.1, 9.5, 9.3, 9.1, 8.9, 9, 9.1],
  [9.2, 9.3, 9.8, 11.2, 11.4, 10.8, 9.2, 8.9, 9.1],
  [9.4, 9.5, 11.6, 12.3, 12.1, 11.8, 10.4, 9, 9.1],
  [9.6, 9.8, 11.9, 12, 11.7, 11.4, 10.4, 9.1, 9.1],
]}
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

const Y0 = -253, Y1 = 265.5         // the outline's ends
const HWD = 14.6                     // deck edge (parapets' outer face): lidar 29–30 m, OSM sidewalks at ±12–15
const SW = 10.8                      // sidewalk's inner edge
const XR = 16                        // arch ribs' planes (lidar ribs at -14 and +18, 2.2 m east of OSM's road)
const YC = -118                      // the arch's crown
const RIB_TOP = (y: number) => 57.6 - 0.00669 * (y - YC) ** 2   // lidar fit: crown 57.6, ±42 m 45.8, ±66 m 28.5
const RIB_D = 2.6, RIB_W = 2.2
const STRUTS = stations(-175, -63, 14)                             // nine cross struts (lidar)

function bar(p: Part, a: V3, b: V3, w: number, t: number, side: V3 = [0, 0, 1]) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, side[0] * d[0] + side[1] * d[1] + side[2] * d[2])))
  const W = cross(S, d)
  const c = (o: V3, u: number, v: number) => add(o, add(mul(W, (u * w) / 2), mul(S, (v * t) / 2)))
  for (const [u0, v0, u1, v1, n] of [[1, -1, 1, 1, W], [1, 1, -1, 1, S], [-1, 1, -1, -1, mul(W, -1)], [-1, -1, 1, -1, mul(S, -1)]] as [number, number, number, number, V3][])
    face(p, c(a, u0, v0), c(b, u0, v0), c(b, u1, v1), c(a, u1, v1), n)
}

/** A box on the ground under each corner, up to z1; sides and top. */
function footed(p: Part, x0: number, x1: number, y0: number, y1: number, z1: number) {
  const c: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = c[i], [bx, by] = c[(i + 1) % 4]
    face(p, [ax, ay, ground(ax, ay) - 0.3], [bx, by, ground(bx, by) - 0.3], [bx, by, z1], [ax, ay, z1], norm([by - ay, -(bx - ax), 0]))
  }
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/** A section swept along y; profile [x, dz from road] walked down the left, along the bottom, up the right. */
function sweepY(p: Part, prof: [number, number][], ys: number[]) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [xa, da] = prof[i], [xb, db] = prof[i + 1], n = norm([db - da, 0, -(xb - xa)])
    for (let k = 0; k < ys.length - 1; k++) {
      const y0 = ys[k], y1 = ys[k + 1]
      face(p, [xa, y0, road(y0) + da], [xb, y0, road(y0) + db], [xb, y1, road(y1) + db], [xa, y1, road(y1) + da], n)
    }
  }
}
function capY(p: Part, prof: [number, number][], y: number, dir: number) {
  const P = prof.map(([x, d]) => [x, y, road(y) + d] as V3)
  for (let i = 1; i < P.length - 1; i++) {
    const g = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    if (Math.hypot(...g) < 1e-6) continue
    if (g[1] * dir >= 0) p.tri(P[0], P[i], P[i + 1]); else p.tri(P[0], P[i + 1], P[i])
  }
}

/** Where the rib's underside meets the ground on each side (its footing), as |y - YC|. */
function footReach(x: number, s: number) {
  for (let d = 60; d < 100; d += 0.25) {
    const y = YC + s * d
    if (RIB_TOP(y) - RIB_D < ground(x, y) + 1.5) return d
  }
  return 100
}

function build(detail: boolean) {
  const white = new Part(), red = new Part(), concrete = new Part(), walk = new Part(), cables = new Part()
  const k = detail ? 1 : 1.25

  // The arch ribs: box sections along the parabola, down to concrete footings either bank.
  for (const sx of [-1, 1]) {
    const x = sx * XR
    const dS = footReach(x, -1), dN = footReach(x, 1)
    const ys = stations(YC - dS, YC + dN, detail ? 3 : 6.5)
    const C = (y: number): V3 => [x, y, RIB_TOP(y) - RIB_D / 2]
    for (let i = 0; i < ys.length - 1; i++) bar(white, C(ys[i]), C(ys[i + 1]), RIB_W * (detail ? 1 : 1.1), RIB_D, [0, 0, 1])
    for (const [y, s] of [[YC - dS, -1], [YC + dN, 1]] as [number, number][]) {
      const z = RIB_TOP(y) - RIB_D / 2
      footed(concrete, x - 3, x + 3, y - 3.5 - (s < 0 ? 2 : 0), y + 3.5 + (s > 0 ? 2 : 0), z + 0.6)
    }
  }
  // Cross struts at the ribs' tops, flush with them.
  for (const y of STRUTS) bar(white, [-XR + RIB_W / 2, y, RIB_TOP(y) - 0.8], [XR - RIB_W / 2, y, RIB_TOP(y) - 0.8], 1.5 * k, 1.5, [0, 1, 0])

  // Hangers: pairs every 7 m in the detail model, single bolder rods in the low one.
  for (let y = YC - 63; y <= YC + 63 + 0.1; y += 7) {
    const top = RIB_TOP(y) - RIB_D, bot = road(y) - 0.6
    if (top - bot < 2) continue
    for (const sx of [-1, 1]) {
      const x = sx * XR
      if (detail) for (const dy of [-0.35, 0.35]) bar(cables, [x, y + dy, bot], [x, y + dy, top], 0.14, 0.14, [1, 0, 0])
      else bar(cables, [x, y, bot], [x, y, top], 0.4, 0.4, [1, 0, 0])
    }
  }

  // The deck, without its roadway: concrete parapets and sidewalks, red plate girders under.
  const ys = stations(Y0, Y1, detail ? 4 : 8)
  for (const s of [-1, 1]) {
    // Each edge's solid, counter-clockwise in (x, z): fascia, parapet, sidewalk top, curb.
    const R: [number, number][] = [[SW - 0.3, -0.6], [HWD, -0.6], [HWD, 1.05], [HWD - 0.35, 1.05], [HWD - 0.35, 0.2], [SW, 0.2], [SW - 0.3, 0.0], [SW - 0.3, -0.6]]
    const P = s > 0 ? R : R.map(([x, d]) => [-x, d] as [number, number]).reverse()
    const iw = s > 0 ? 4 : P.length - 6   // the sidewalk-top segment
    sweepY(concrete, P.slice(0, iw + 1), ys)
    sweepY(walk, P.slice(iw, iw + 2), ys)
    sweepY(concrete, P.slice(iw + 1), ys)
    for (const [y, dir] of [[Y0, -1], [Y1, 1]] as [number, number][]) capY(concrete, P.slice(0, -1), y, dir)
  }
  // The red girders: a fascia band under each edge and the soffit between.
  const G: [number, number][] = [[-(HWD - 0.6), -0.6], [-(HWD - 0.6), -2.6], [HWD - 0.6, -2.6], [HWD - 0.6, -0.6]]
  sweepY(red, G, ys)
  for (const [y, dir] of [[Y0, -1], [Y1, 1]] as [number, number][]) capY(red, [...G, G[0]], y, dir)
  if (detail) for (let y = YC - 70; y <= YC + 70; y += 7) {
    // the floor beams' ends, red, standing proud of the fascia under each hanger
    for (const sx of [-1, 1]) bar(red, [sx * (HWD - 0.8), y, road(y) - 2.9], [sx * (XR - 0.2), y, road(y) - 2.9], 0.8, 1.8, [0, 0, 1])
  }

  // Approach bents: three concrete columns under a cap beam.
  const bents = [-236, -212, -26, 14, 54, 94, 134, 174, 214, 254]
  for (const y of bents) {
    const zt = road(y) - 2.6
    const lo = Math.min(...[-10, 0, 10].map((x) => ground(x, y)))
    if (zt - lo < 2) continue
    bar(concrete, [-13, y, zt - 0.9], [13, y, zt - 0.9], 1.8, 1.8)
    for (const x of [-9, 0, 9]) {
      const zg = ground(x, y) - 0.3
      if (zt - 1.8 - zg > 0.5) bar(concrete, [x, y, zg], [x, y, zt - 1.8], 1.8, 1.8, [0, 1, 0])
    }
  }
  return { white, red, concrete, walk, cables }
}

if (import.meta.main) {
  const archLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.6 : 0.95)
  const WHITE = { ...finish('arch-white', 0xe7e9e8), floodlight: archLit }
  const RED = finish('girder-red', 0xa8434a)
  const CONCRETE = finish('bridge-concrete', 0xd6d2ca)
  const WALK = finish('walkway', 0xc8c3b9)
  const CABLE = { ...finish('hanger-steel', 0xcfd3d4), floodlight: () => 0.8 }
  const low = build(false), det = build(true)
  await writeBoth('nash-gateway-bridge', 'Gateway Bridge', [
    { part: low.white, material: WHITE }, { part: low.red, material: RED }, { part: low.concrete, material: CONCRETE },
    { part: low.walk, material: WALK }, { part: low.cables, material: CABLE },
  ], [
    { part: det.white, material: WHITE }, { part: det.red, material: RED }, { part: det.concrete, material: CONCRETE },
    { part: det.walk, material: WALK }, { part: det.cables, material: CABLE },
  ], {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river',
    bearing: 15.6, elevation: 0, roadway: { south: road(Y0), crown: road(YC), north: road(Y1) },
  })
}
