/**
 * St Mary's Cathedral, College Street, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-st-marys-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 6.3
 * (the long axis of OSM's outline way/16749128). Origin at the outline's
 * area centroid (151.2133703, -33.8711851); the church's axis runs at
 * x = -3.1. y = 0 at the floor of the south front, the lowest ground under
 * the footprint (the map stands it on its terrain).
 *
 * Geometric Decorated Gothic Revival by William Wardell, 1868-1928, in
 * Sydney sandstone; the south front's twin spires were added in 2000. The
 * cathedral runs north-south: the liturgical west front faces south onto
 * the forecourt, the square-ended chancel is at the north.
 *
 * Published (Wikipedia "St Mary's Cathedral, Sydney"): 107 m long; roof
 * 30.3 m above the floor of nave and choir; crossing tower pinnacles 46 m;
 * south spires 74.6 m; three rose windows (south front and both transepts);
 * slate roof.
 *
 * OSM (turned frame): the outline is 109 m from the south front (y -60.5)
 * to the chancel (48.4); nave with aisles x -15.5..8.7 (24.2 m); the
 * transepts project to x -22 and 15.6 from y -7; chapels fill the angle
 * west of the choir (to y 28.9) and an annex east of it (x 8.7..30,
 * y 15.7..46); two side porches at y -37..-30. No building:parts.
 *
 * Measured on photos: s3 (a telephoto from the east) scaled by the
 * published ridge (30.3) and crossing pinnacles (46), which agree with its
 * length scale (0.108 m/px): aisle parapets 15.8, aisle windows 6.7-12.1,
 * clerestory windows 17-23.4, clerestory eaves 24.4, crossing tower 11.5 m
 * wide, its parapet 39.4, belfry lights 31.5-37.8; transept turrets 33.5.
 * s7 (the south front, frontal) for the front's layout: towers 8.4 m
 * square over the aisles, the nave front 7.8 m between them, the portal
 * and its gable (to 15 m), the rose (centre 18.6, r 3.5), the front's
 * screen gable rising above the nave roof to 36 m, level with the
 * belfry openings (lead review against s7), the belfry lancets (30-41.7 m), the
 * octagonal stair turrets on the outer corners with their conical caps, and
 * the four pinnacles round each spire's foot. The towers' body top (43.5)
 * from s3 corrected for distance (the towers stand 10% further off than the
 * crossing), the spire from there to the published 74.6.
 * Estimated: the nave vessel 9 m wide (s7's gable), bay counts (7 in the
 * nave, 6 in the choir, from s4), buttress sizes, the chapels' and annex's
 * heights (12 m, from s1/s4 against the aisles), the lucarnes' size.
 * Left out: crockets, finials' leafwork, statues, the forecourt steps and
 * terraces (the map's ground), the roof's small dormers and its diamond
 * slate pattern, the crypt.
 *
 * Colours (sample2.ts on daylight photos): sandstone sunlit #caa076 (s1),
 * #e2c39f (s4, from above), shade #916e48 -> honey 0xd2aa7c; slate
 * #9ca4af -> 0x939ca8; the aisle roofs pale green-grey #d2d8cc/#aca799 in
 * s4 -> 0xb4bfb4 (lead and copper); tracery a paler stone.
 *
 * Night: the stone is floodlit (strongest on the south front and the
 * towers); the windows are `window`, the doors `entrance`.
 *
 * LODs: the low model has every window as a real pointed recess, the
 * buttresses, pinnacles, spires and gables; the detail model adds tracery
 * (mullions and rose spokes), more pinnacles (the crossing tower's middle
 * ones, the buttress pinnacles), the spires' upper lucarnes and the
 * arcaded string courses' depth.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - s1 "Sydney (AU), St Mary's Cathedral -- 2019 -- 3107.jpg", Dietmar Rabich, CC BY-SA 4.0 (from the north-east)
 * - s2 "Sydney (AU), St Mary's Cathedral -- 2019 -- 3111.jpg", Dietmar Rabich, CC BY-SA 4.0 (portal detail)
 * - s3 "St. Mary's Cathedral, Sydney, west remote view 20230206 1.jpg", DXR, CC BY-SA 4.0 (telephoto, east side)
 * - s4 "Sydney (AU), View from Sydney Tower, St Mary's Cathedral -- 2019 -- 3141.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial from the west)
 * - s7 "St. Mary's Cathedral, Sydney, Front.jpg", Horst Günther Burkhardt III, CC BY-SA 3.0 (south front)
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arch, box, face, lathe, loftRings, prism, saveLods, skin, tube, type Layer, type XY } from './sydney-tower-eye'

const AX = -3.1 // the church's axis
const NAVE = 4.5, AISLE_X0 = -15.5, AISLE_X1 = 8.7
const YS = -60.5, YT = -52.1, YX0 = -7.0, YX1 = 5.7, YN = 48.4
const TX0 = -22, TX1 = 15.6
const AISLE_Z = 15.8, CLER_Z = 24.4, RIDGE = 30.3
const FG_EAVE = 27.0, FG_APEX = 36.0 // the south front's screen gable, standing above the nave roof (s7)
const D = 0.4

type Set = { stone: Part; trim: Part; win: Part; slate: Part; lead: Part; door: Part }
const mk = (): Set => ({ stone: new Part(), trim: new Part(), win: new Part(), slate: new Part(), lead: new Part(), door: new Part() })
const low = mk(), det = mk()

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const circ = (sc: number, zc: number, r: number, n = 12): XY[] => Array.from({ length: n }, (_, i) => [sc + r * Math.cos((i / n) * Math.PI * 2), zc + r * Math.sin((i / n) * Math.PI * 2)] as XY)
const pt = (s0: number, s1: number, zb: number, zs: number, d: boolean) => arch(s0, s1, zb, zs, true, d ? 8 : 4)

type Side = 'e' | 'n' | 'w' | 's'
type Holes = Partial<Record<Side, (L: number) => XY[][]>>

/** A walled block: a mass inset by D and four facade skins, with openings per side (s from the side's start corner). */
function block(s: Set, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, holes: Holes = {}, skip: Side[] = []) {
  prism(s.stone, [[x0 + D, y0 + D], [x1 - D, y0 + D], [x1 - D, y1 - D], [x0 + D, y1 - D]], z0, z1, { top: true })
  const sides: [Side, XY, XY, boolean][] = [
    ['e', [x1 - D, y0], [x1 - D, y1], true], ['n', [x1 - D, y1 - D], [x0 + D, y1 - D], false],
    ['w', [x0 + D, y1], [x0 + D, y0], true], ['s', [x0 + D, y0 + D], [x1 - D, y0 + D], false],
  ]
  for (const [k, a, b, long] of sides) {
    if (skip.includes(k)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    skin(s.stone, s.win, a, b, z0, z1, D, holes[k]?.(L) ?? [], { top: true, ends: long, s0: long ? 0 : -0.001, s1: long ? L : L + 0.001 })
  }
}

/** A pitched roof over x0..x1 (ridge along y) or y0..y1 (ridge along x), with stone gable walls at the ends. */
function roof(s: Set, x0: number, x1: number, y0: number, y1: number, zE: number, zR: number, along: 'y' | 'x', mat: Part, o: { gables?: boolean; over?: number } = {}) {
  const ov = o.over ?? 0.35
  if (along === 'y') {
    const xc = (x0 + x1) / 2
    const h = (zR - zE) * (ov / ((x1 - x0) / 2))
    face(mat, [[x0 - ov, y0, zE - h], [xc, y0, zR], [xc, y1, zR], [x0 - ov, y1, zE - h]], [-(zR - zE), 0, (x1 - x0) / 2])
    face(mat, [[x1 + ov, y0, zE - h], [x1 + ov, y1, zE - h], [xc, y1, zR], [xc, y0, zR]], [(zR - zE), 0, (x1 - x0) / 2])
    if (o.gables !== false) for (const [y, sg] of [[y0, -1], [y1, 1]] as [number, number][]) face(s.stone, [[x0, y, zE], [x1, y, zE], [xc, y, zR]], [0, sg, 0])
    // undersides of the eaves
    face(mat, [[x0 - ov, y0, zE - h], [x0 - ov, y1, zE - h], [x0, y1, zE], [x0, y0, zE]], [0, 0, -1])
    face(mat, [[x1 + ov, y0, zE - h], [x1, y0, zE], [x1, y1, zE], [x1 + ov, y1, zE - h]], [0, 0, -1])
  } else {
    const yc = (y0 + y1) / 2
    const h = (zR - zE) * (ov / ((y1 - y0) / 2))
    face(mat, [[x0, y0 - ov, zE - h], [x1, y0 - ov, zE - h], [x1, yc, zR], [x0, yc, zR]], [0, -(zR - zE), (y1 - y0) / 2])
    face(mat, [[x0, y1 + ov, zE - h], [x0, yc, zR], [x1, yc, zR], [x1, y1 + ov, zE - h]], [0, (zR - zE), (y1 - y0) / 2])
    if (o.gables !== false) for (const [x, sg] of [[x0, -1], [x1, 1]] as [number, number][]) face(s.stone, [[x, y0, zE], [x, y1, zE], [x, yc, zR]], [sg, 0, 0])
    face(mat, [[x0, y0 - ov, zE - h], [x0, y0, zE], [x1, y0, zE], [x1, y0 - ov, zE - h]], [0, 0, -1])
    face(mat, [[x0, y1 + ov, zE - h], [x1, y1 + ov, zE - h], [x1, y1, zE], [x0, y1, zE]], [0, 0, -1])
  }
}

/** A lean-to roof from the outer wall (lower) up against an inner wall. */
function leanTo(p: Part, x0: number, x1: number, y0: number, y1: number, zLow: number, zHigh: number, lowSide: 'w' | 'e') {
  const ov = 0.3
  if (lowSide === 'w') face(p, [[x0 - ov, y0, zLow - 0.1], [x1, y0, zHigh], [x1, y1, zHigh], [x0 - ov, y1, zLow - 0.1]], [-(zHigh - zLow), 0, x1 - x0])
  else face(p, [[x0, y0, zHigh], [x1 + ov, y0, zLow - 0.1], [x1 + ov, y1, zLow - 0.1], [x0, y1, zHigh]], [(zHigh - zLow), 0, x1 - x0])
}

/** A square pinnacle: shaft and pyramid, or octagonal when n = 8. */
function pinnacle(p: Part, c: XY, half: number, z0: number, z1: number, tip: number, n = 4) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2 + (n === 4 ? Math.PI / 4 : Math.PI / 8)
    const rr = n === 4 ? r * Math.SQRT2 : r / Math.cos(Math.PI / 8)
    return [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t), z]
  })
  loftRings(p, [ring(half, z0), ring(half, z1)])
  loftRings(p, [ring(half * 1.15, z1), ring(0.001, tip)].map((r, k) => (k === 1 ? r.map(() => [c[0], c[1], tip] as V3) : r)), { bottom: true })
}

/** A small gabled lucarne (dormer) on a spire face: a triangular prism facing `dir`. */
function lucarne(p: Part, c: XY, dir: number, z0: number, w: number, h: number, depth: number) {
  const ux = Math.cos(dir), uy = Math.sin(dir), vx = -uy, vy = ux
  const P = (s: number, t: number, z: number): V3 => [c[0] + ux * t + vx * s, c[1] + uy * t + vy * s, z]
  const front = [P(-w / 2, depth, z0), P(w / 2, depth, z0), P(w / 2, depth, z0 + h * 0.55), P(0, depth, z0 + h), P(-w / 2, depth, z0 + h * 0.55)]
  face(p, front, [ux, uy, 0])
  face(p, [P(-w / 2, 0, z0), P(-w / 2, depth, z0), P(-w / 2, depth, z0 + h * 0.55), P(-w / 2, 0, z0 + h * 0.55)], [-vx, -vy, 0])
  face(p, [P(w / 2, depth, z0), P(w / 2, 0, z0), P(w / 2, 0, z0 + h * 0.55), P(w / 2, depth, z0 + h * 0.55)], [vx, vy, 0])
  face(p, [P(-w / 2, 0, z0 + h * 0.55), P(-w / 2, depth, z0 + h * 0.55), P(0, depth, z0 + h), P(0, 0, z0 + h)], [-vx, -vy, 0.8])
  face(p, [P(w / 2, depth, z0 + h * 0.55), P(w / 2, 0, z0 + h * 0.55), P(0, 0, z0 + h), P(0, depth, z0 + h)], [vx, vy, 0.8])
}

/** Tracery bars for a pointed window (detail): `lights` mullions to the springing, set in the recess. */
function tracery(p: Part, a: XY, b: XY, s0: number, s1: number, zb: number, zs: number, lights: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  for (let k = 1; k < lights; k++) {
    const sc = s0 + ((s1 - s0) * k) / lights
    const c: XY = [a[0] + u[0] * sc + n[0] * 0.12, a[1] + u[1] * sc + n[1] * 0.12]
    box(p, c, 0.09, 0.09, zb, zs + (s1 - s0) * 0.35, Math.atan2(u[1], u[0]))
  }
  // a transom-like ring at the springing
  const c: XY = [a[0] + u[0] * (s0 + s1) / 2 + n[0] * 0.12, a[1] + u[1] * (s0 + s1) / 2 + n[1] * 0.12]
  box(p, c, (s1 - s0) / 2 - 0.02, 0.08, zs - 0.09, zs + 0.09, Math.atan2(u[1], u[0]))
}

/** A rose window's bars: ring and spokes, flush in its recess (detail). */
function rose(p: Part, centre: V3, normal: XY, r: number, spokes: number) {
  const t: XY = [-normal[1], normal[0]]
  const P = (s: number, z: number): V3 => [centre[0] + t[0] * s + normal[0] * 0.1, centre[1] + t[1] * s + normal[1] * 0.1, centre[2] + z]
  const ringPts: V3[] = Array.from({ length: 17 }, (_, i) => P(r * 0.45 * Math.cos((i / 16) * Math.PI * 2), r * 0.45 * Math.sin((i / 16) * Math.PI * 2)))
  tube(p, ringPts, 0.1, 4)
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2
    tube(p, [P(r * 0.45 * Math.cos(a), r * 0.45 * Math.sin(a)), P(r * 0.97 * Math.cos(a), r * 0.97 * Math.sin(a))], 0.09, 4)
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const nx0 = AX - NAVE, nx1 = AX + NAVE

  // ---- Nave and choir: aisles, clerestory, roofs ----
  const bays = (y0: number, y1: number, n: number) => Array.from({ length: n }, (_, i) => [y0 + ((y1 - y0) * i) / n, y0 + ((y1 - y0) * (i + 1)) / n] as XY)
  const naveBays = bays(YT, YX0, 7), choirBays = bays(YX1, YN, 6)
  const allBays = [...naveBays, ...choirBays]
  const aisleHoles = (y0: number, list: XY[], side: 'e' | 'w') => (L: number) => list.map(([a, b]) => {
    const s0 = side === 'e' ? a - y0 : L - (b - y0), s1 = side === 'e' ? b - y0 : L - (a - y0)
    const c = (s0 + s1) / 2
    return pt(c - 1.25, c + 1.25, 6.6, 10.3, d)
  })
  const clerHoles = aisleHoles
  for (const [y0, y1, list] of [[YT, YX0, naveBays], [YX1, YN, choirBays]] as [number, number, XY[]][]) {
    // aisles (west and east)
    block(s, AISLE_X0, nx0 + D, y0, y1, 0, AISLE_Z, { w: aisleHoles(y0, list, 'w') }, ['e', 'n', 's'])
    block(s, nx1 - D, AISLE_X1, y0, y1, 0, AISLE_Z, { e: aisleHoles(y0, list, 'e') }, ['w', 'n', 's'])
    leanTo(s.lead, AISLE_X0, nx0, y0, y1, AISLE_Z, AISLE_Z + 2.2, 'w')
    leanTo(s.lead, nx1, AISLE_X1, y0, y1, AISLE_Z, AISLE_Z + 2.2, 'e')
    // aisle parapets
    for (const x of [AISLE_X0, AISLE_X1 - 0.5]) box(s.stone, [x + 0.25, (y0 + y1) / 2], 0.25, (y1 - y0) / 2, AISLE_Z, AISLE_Z + 0.9)
    // clerestory
    const ch = (y00: number, l: XY[], side: 'e' | 'w') => (L: number) => clerHoles(y00, l, side)(L).map((h) => h.map(([q, z]) => [q, z + 11.2] as XY)).map((h, i) => {
      void i
      // clerestory lights are a little wider
      const cs = h.reduce((sum, q) => sum + q[0], 0) / h.length
      return pt(cs - 1.45, cs + 1.45, 18.0, 21.4, d)
    })
    block(s, nx0, nx1, y0, y1, AISLE_Z - 1, CLER_Z, { w: ch(y0, list, 'w'), e: ch(y0, list, 'e') }, ['n', 's'])
    roof(s, nx0, nx1, y0, y1, CLER_Z, RIDGE, 'y', s.slate, { gables: false })
    // gablets over the clerestory windows, breaking the eaves (s4)
    for (const [a, b] of list) {
      const c = (a + b) / 2
      for (const [x, sg] of [[nx0 + 0.1, -1], [nx1 - 0.1, 1]] as [number, number][]) {
        const P = (dx: number, y: number, z: number): V3 => [x + dx, y, z]
        const w = 1.7
        face(s.stone, [P(0, c - w, CLER_Z - 0.2), P(0, c + w, CLER_Z - 0.2), P(0, c, CLER_Z + 2.3)], [sg, 0, 0])
        face(s.stone, [P(-sg * 1.4, c - w, CLER_Z - 0.2 + 1.4 * (RIDGE - CLER_Z) / NAVE), P(0, c - w, CLER_Z - 0.2), P(0, c, CLER_Z + 2.3), P(-sg * 2.2, c, CLER_Z + 2.3)], [0, -1, 0.6])
        face(s.stone, [P(0, c + w, CLER_Z - 0.2), P(-sg * 1.4, c + w, CLER_Z - 0.2 + 1.4 * (RIDGE - CLER_Z) / NAVE), P(-sg * 2.2, c, CLER_Z + 2.3), P(0, c, CLER_Z + 2.3)], [0, 1, 0.6])
      }
    }
    if (d) for (const [a, b] of list) {
      // two-light tracery in every aisle and clerestory window
      const cw = y1 - (a + b) / 2, ce = (a + b) / 2 - y0
      tracery(s.trim, [AISLE_X0 + D, y1], [AISLE_X0 + D, y0], cw - 1.25, cw + 1.25, 6.6, 10.3, 2)
      tracery(s.trim, [AISLE_X1 - D, y0], [AISLE_X1 - D, y1], ce - 1.25, ce + 1.25, 6.6, 10.3, 2)
      tracery(s.trim, [nx0 + D, y1], [nx0 + D, y0], cw - 1.45, cw + 1.45, 18.0, 21.4, 2)
      tracery(s.trim, [nx1 - D, y0], [nx1 - D, y1], ce - 1.45, ce + 1.45, 18.0, 21.4, 2)
    }
    // buttresses between bays on the aisle walls, with pinnacles above the aisle parapet
    const edges = [y0, ...list.map(([, b]) => b)]
    for (const y of edges.slice(y0 === YT ? 1 : 0, y1 === YN ? -1 : undefined)) {
      for (const [x, sg] of [[AISLE_X0, -1], [AISLE_X1, 1]] as [number, number][]) {
        if (d) {
          box(s.stone, [x + sg * 0.75, y], 0.75, 0.55, 0, 7.5)
          box(s.stone, [x + sg * 0.5, y], 0.5, 0.5, 7.5, AISLE_Z + 0.9)
          pinnacle(s.stone, [x + sg * 0.3, y], 0.42, AISLE_Z + 0.9, AISLE_Z + 2.4, AISLE_Z + 4.6, 8)
        } else {
          box(s.stone, [x + sg * 0.6, y], 0.6, 0.5, 0, AISLE_Z + 2.4)
          loftRings(s.stone, [[[x + sg * 1.2 - 0.6 * (sg + 1), y - 0.5, AISLE_Z + 2.4], [x + sg * 1.2 - 0.6 * (sg + 1) + 1.2, y - 0.5, AISLE_Z + 2.4], [x + sg * 1.2 - 0.6 * (sg + 1) + 1.2, y + 0.5, AISLE_Z + 2.4], [x + sg * 1.2 - 0.6 * (sg + 1), y + 0.5, AISLE_Z + 2.4]], Array(4).fill([x + sg * 0.6, y, AISLE_Z + 4.8]) as V3[]])
        }
      }
    }
  }

  // ---- Crossing and transepts ----
  block(s, TX0, TX1, YX0, YX1, 0, CLER_Z, {
    w: (L) => [pt(L / 2 - 1.5, L / 2 + 1.5, 0, 5.2, d), circ(L / 2, 15.2, 3.2, d ? 16 : 10)],
    e: (L) => [pt(L / 2 - 1.5, L / 2 + 1.5, 0, 5.2, d), circ(L / 2, 15.2, 3.2, d ? 16 : 10)],
    n: (L) => [], s: (L) => [],
  })
  roof(s, TX0, TX1, YX0, YX1, CLER_Z, RIDGE, 'x', s.slate)
  const xc = (YX0 + YX1) / 2
  for (const [x, sg] of [[TX0, -1], [TX1, 1]] as [number, number][]) {
    // corner turrets with pinnacles on the transept fronts
    for (const y of [YX0 + 0.6, YX1 - 0.6]) {
      lathe(s.stone, [x - sg * 0.6, y], [[1.0, 0], [1.0, 27.0], [1.15, 27.0], [1.15, 27.6], [1.0, 27.6]], 8, { phase: Math.PI / 8, crease: 30 })
      pinnacle(s.stone, [x - sg * 0.6, y], 0.85, 27.6, 29.5, 33.5, d ? 8 : 4)
    }
    if (d) {
      rose(s.trim, [x + sg * 0.02 - sg * D, xc, 15.2], [sg, 0], 3.2, 12)
      // gabled portal hood
      const P = (dx: number, y: number, z: number): V3 => [x + sg * dx, y, z]
      face(s.stone, [P(0.6, xc - 2.4, 6.4), P(0.6, xc + 2.4, 6.4), P(0.6, xc, 9.8)], [sg, 0, 0])
    }
    // the doors, set in the portal recess
    face(s.door, [[x - sg * D + sg * 0.06, xc - 1.4, 0], [x - sg * D + sg * 0.06, xc + 1.4, 0], [x - sg * D + sg * 0.06, xc + 1.4, 4.6], [x - sg * D + sg * 0.06, xc - 1.4, 4.6]], [sg, 0, 0])
  }

  // Crossing tower: square 11.5 m, belfry pairs, parapet, pinnacles.
  const TC: XY = [AX, (YX0 + YX1) / 2], TH = 5.75
  const belfry = (L: number) => [pt(L / 2 - 2.6, L / 2 - 0.4, 31.5, 35.6, d), pt(L / 2 + 0.4, L / 2 + 2.6, 31.5, 35.6, d)]
  block(s, TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH, 24.0, 39.4, { e: belfry, w: belfry, n: belfry, s: belfry })
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pinnacle(s.stone, [TC[0] + dx * (TH - 0.6), TC[1] + dy * (TH - 0.6)], 0.75, 39.4, 41.6, 46, 8)
  if (d) for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) for (const k of [-1, 1]) {
    const c: XY = dx ? [TC[0] + dx * (TH - 0.4), TC[1] + k * 1.9] : [TC[0] + k * 1.9, TC[1] + dy * (TH - 0.4)]
    pinnacle(s.stone, c, 0.4, 39.4, 40.6, 43.2, 4)
  }
  box(s.slate, TC, TH - 0.6, TH - 0.6, 39.4 - 0.2, 39.5)

  // ---- Chapels and annexes (lower) ----
  block(s, TX0, AISLE_X0 + D, YX1, 28.9, 0, AISLE_Z, !d ? {} : { w: (L) => bays(0, L, 3).map(([a, b]) => pt((a + b) / 2 - 1.1, (a + b) / 2 + 1.1, 4.5, 8.0, d)) }, ['e'])
  leanTo(s.lead, TX0, AISLE_X0, YX1, 28.9, AISLE_Z, AISLE_Z + 1.4, 'w')
  block(s, AISLE_X1 - D, TX1, YX1, 15.7, 0, 12.0, !d ? {} : { e: (L) => [pt(L / 2 - 1.1, L / 2 + 1.1, 4.5, 8.0, d)] }, ['w'])
  leanTo(s.lead, AISLE_X1, TX1, YX1, 15.7, 12.0, 14.0, 'e')
  block(s, AISLE_X1 - D, 30.0, 15.7, 46.0, 0, 11.5, !d ? {} : {
    e: (L) => bays(0, L, 4).map(([a, b]) => pt((a + b) / 2 - 1.0, (a + b) / 2 + 1.0, 3.8, 7.6, d)),
    n: (L) => [pt(L / 2 - 1.6, L / 2 + 1.6, 3.5, 8.0, d)],
  }, ['w'])
  roof(s, AISLE_X1, 30.0, 15.7, 46.0, 11.5, 16.5, 'y', s.slate)
  // side porches
  for (const [x0, x1] of [[TX0, AISLE_X0 + D], [AISLE_X1 - D, 16.3]]) {
    const outer = x0 === TX0 ? 'w' : 'e'
    block(s, x0, x1, -37.1, -29.6, 0, 8.5, { [outer]: (L: number) => [pt(L / 2 - 1.3, L / 2 + 1.3, 0, 4.0, d)] }, [outer === 'w' ? 'e' : 'w'])
    roof(s, x0, x1, -37.1, -29.6, 8.5, 12.5, 'x', s.slate)
  }

  // ---- Chancel end (north) ----
  const chancel = (L: number) => [pt(L / 2 - 2.6, L / 2 + 2.6, 8.0, 18.5, d)]
  block(s, nx0, nx1, YN - 1.2, YN, 0, CLER_Z, { n: chancel }, ['e', 'w', 's'])
  face(s.stone, [[nx0, YN, CLER_Z], [nx1, YN, CLER_Z], [AX, YN, RIDGE]], [0, 1, 0])
  face(s.stone, [[nx0, YN - 1.2, CLER_Z], [AX, YN - 1.2, RIDGE], [nx1, YN - 1.2, CLER_Z]], [0, -1, 0])
  for (const x of [nx0 - 0.4, nx1 + 0.4]) {
    lathe(s.stone, [x, YN - 0.8], [[1.1, 0], [1.1, 27.5], [1.25, 27.5], [1.25, 28.1], [1.1, 28.1]], 8, { phase: Math.PI / 8, crease: 30 })
    pinnacle(s.stone, [x, YN - 0.8], 0.95, 28.1, 29.8, 33.8, d ? 8 : 4)
  }
  // aisle ends at the north: plain walls with a lancet
  for (const [x0, x1] of [[AISLE_X0, nx0], [nx1, AISLE_X1]]) skin(s.stone, s.win, [x1, YN - D], [x0, YN - D], 0, AISLE_Z, D, [pt((x1 - x0) / 2 - 1.0, (x1 - x0) / 2 + 1.0, 6.0, 10.0, d)], { top: true, ends: false })
  if (d) tracery(s.trim, [nx1, YN], [nx0, YN], NAVE - 2.6, NAVE + 2.6, 8.0, 18.5, 4)

  // ---- South front: twin towers with spires, the nave front between ----
  const FX0 = -15.25, FX1 = 9.15, TW = 8.4
  const towerHoles = (outer: boolean) => (L: number) => [
    ...(d ? [pt(L / 2 - 0.9, L / 2 + 0.9, 13.0, 16.5, d)] : []),
    pt(L / 2 - 2.6, L / 2 - 0.4, 30.0, 39.8, d), pt(L / 2 + 0.4, L / 2 + 2.6, 30.0, 39.8, d),
    ...(outer ? [] : []),
  ]
  for (const [x0, x1, outerSide] of [[FX0, FX0 + TW, 'w'], [FX1 - TW, FX1, 'e']] as [number, number, Side][]) {
    const sideDoor = (L: number) => [pt(L / 2 - 1.1, L / 2 + 1.1, 0, 3.6, d), ...(d ? [pt(L / 2 - 0.8, L / 2 + 0.8, 13.0, 16.5, d)] : []), pt(L / 2 - 2.6, L / 2 - 0.4, 30.0, 39.8, d), pt(L / 2 + 0.4, L / 2 + 2.6, 30.0, 39.8, d)]
    block(s, x0, x1, YS, YT + 0.5, 0, 43.5, { s: sideDoor, [outerSide]: towerHoles(true), n: towerHoles(false), [outerSide === 'w' ? 'e' : 'w']: (L: number) => [pt(L / 2 - 2.6, L / 2 - 0.4, 30.0, 39.8, d), pt(L / 2 + 0.4, L / 2 + 2.6, 30.0, 39.8, d)].filter(() => true) })
    const c: XY = [(x0 + x1) / 2, (YS + YT + 0.5) / 2]
    // string courses
    for (const z of d ? [10.4, 19.8, 29.6, 43.0] : [19.8, 43.0]) box(s.stone, c, TW / 2 + 0.15, (YT + 0.5 - YS) / 2 + 0.15, z - 0.35, z + 0.35)
    // octagonal stair turrets on the outer corners, with conical caps (s7)
    const ox = outerSide === 'w' ? x0 : x1
    for (const y of [YS, YT + 0.5]) {
      lathe(s.stone, [ox, y], d ? [[1.25, 0], [1.25, 38.0], [1.4, 38.0], [1.4, 38.5], [1.2, 38.5]] : [[1.25, 0], [1.25, 38.5]], 8, { phase: Math.PI / 8, crease: 30 })
      lathe(s.stone, [ox, y], [[d ? 1.2 : 1.25, 38.5], [0.05, 43.2]], 8, { phase: Math.PI / 8 })
    }
    // the four pinnacles round the spire's foot
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pinnacle(s.stone, [c[0] + dx * (TW / 2 - 0.6), c[1] + dy * (TW / 2 - 0.6)], 0.55, 43.5, 45.2, 49.0, d ? 8 : 4)
    // the spire: octagonal, with lucarnes
    const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
      const t = (i / 8) * Math.PI * 2 + Math.PI / 8
      return [c[0] + (r / Math.cos(Math.PI / 8)) * Math.cos(t), c[1] + (r / Math.cos(Math.PI / 8)) * Math.sin(t), z]
    })
    const tip: V3 = [c[0], c[1], 73.4]
    loftRings(s.stone, [ring(3.0, 43.5), ring(2.75, 46.0), ring(0.02, 73.4).map(() => tip)])
    lathe(s.trim, c, [[0.08, 73.3], [0.08, 74.6]], 4)
    if (d) box(s.trim, [c[0], c[1]], 0.06, 0.45, 73.9, 74.05)
    for (let i = 0; i < 4; i++) {
      const dir = (i * Math.PI) / 2
      lucarne(s.stone, [c[0] + Math.cos(dir) * 1.9, c[1] + Math.sin(dir) * 1.9], dir, 46.2, 1.8, 4.0, 1.5)
      if (d) lucarne(s.stone, [c[0] + Math.cos(dir) * 1.1, c[1] + Math.sin(dir) * 1.1], dir, 57.0, 0.9, 2.2, 0.9)
    }
  }
  // nave front between the towers
  const NF0 = FX0 + TW, NF1 = FX1 - TW
  block(s, NF0, NF1, YS, YT, 0, FG_EAVE, { s: (L) => [pt(L / 2 - 2.6, L / 2 + 2.6, 0, 4.5, d), circ(L / 2, 18.6, 3.5, d ? 18 : 10), pt(L / 2 - 0.8, L / 2 + 0.8, 25.0, 26.6, d).map(([q, z]) => [q, z] as XY).slice(0, 0)].filter((h) => h.length) }, ['e', 'w'])
  face(s.stone, [[NF0, YS, FG_EAVE], [AX, YS, FG_APEX], [NF1, YS, FG_EAVE]].reverse() as V3[], [0, -1, 0])
  roof(s, NF0 + 0.2, NF1 - 0.2, YS + 0.5, YT, FG_EAVE, FG_APEX, 'y', s.slate, { gables: true, over: 0 })
  lathe(s.trim, [AX, YS + 0.2], [[0.12, FG_APEX], [0.12, FG_APEX + 2.2]], 4)
  box(s.trim, [AX, YS + 0.2], 0.55, 0.1, FG_APEX + 1.3, FG_APEX + 1.55)
  // the portal: a gabled hood standing out from the front
  {
    const P = (x: number, dy: number, z: number): V3 => [x, YS - dy, z]
    const w = 4.0
    skin(s.stone, null, [AX - w, YS - 0.45], [AX + w, YS - 0.45], 0, 9.5, 0.45, [pt(w - 2.6, w + 2.6, 0, 4.5, d)], { through: true, top: false, ends: false })
    face(s.stone, [P(AX - w, 0.9, 9.5), P(AX + w, 0.9, 9.5), P(AX, 0.9, 15.0)], [0, -1, 0])
    face(s.stone, [P(AX - w, 0, 0), P(AX - w, 0.9, 0), P(AX - w, 0.9, 8.0), P(AX - w, 0, 8.0)], [-1, 0, 0])
    face(s.stone, [P(AX + w, 0.9, 0), P(AX + w, 0, 0), P(AX + w, 0, 8.0), P(AX + w, 0.9, 8.0)], [1, 0, 0])
    face(s.stone, [P(AX - w, 0, 9.5), P(AX - w, 0.9, 9.5), P(AX, 0.9, 15.0), P(AX, 0, 15.0)], [-1, 0, 0.8])
    face(s.stone, [P(AX + w, 0.9, 9.5), P(AX + w, 0, 9.5), P(AX, 0, 15.0), P(AX, 0.9, 15.0)], [1, 0, 0.8])
    // the doors in a deep pointed recess through the hood
    face(s.door, [P(AX - 1.9, -D + 0.06, 0), P(AX + 1.9, -D + 0.06, 0), P(AX + 1.9, -D + 0.06, 5.0), P(AX - 1.9, -D + 0.06, 5.0)], [0, -1, 0])
  }
  if (d) {
    rose(s.trim, [AX, YS + D - 0.02, 18.6], [0, -1], 3.5, 16)
    // arcaded string course across the front (s7): a band of shallow pointed niches
    const holes: XY[][] = []
    for (let i = 0; i < 6; i++) holes.push(pt(0.5 + i * 1.3, 1.5 + i * 1.3, 23.2, 24.0, d))
    skin(s.stone, null, [NF0, YS - 0.25], [NF1, YS - 0.25], 22.8, 24.6, 0.25, holes, { top: true })
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[1] < -50 ? 0.9 : 0.6)
const STONE: MaterialSpec = { ...finish('sydney-sandstone', 0xd2aa7c), floodlight: lit }
const TRIM: MaterialSpec = { ...finish('pale-sandstone', 0xe6cfa8), floodlight: lit }
const SLATE: MaterialSpec = { ...PALETTE.roof, color: 0x939ca8 }
const LEAD: MaterialSpec = finish('aisle-roof-green', 0xb4bfb4)
const DOOR: MaterialSpec = { ...PALETTE.entrance, color: 0x8a6a4c }
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.trim, material: TRIM },
  { part: s.win, material: PALETTE.window },
  { part: s.slate, material: SLATE },
  { part: s.lead, material: LEAD },
  { part: s.door, material: DOOR },
]

if (import.meta.main) {
  await saveLods('sydney-st-marys-cathedral', "St Mary's Cathedral", layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, floor level', bearing: 6.3,
  }, 6500)
}
