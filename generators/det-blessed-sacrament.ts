/**
 * Cathedral of the Most Blessed Sacrament (9844 Woodward Avenue, Detroit,
 * 1913-1915, towers finished 1951, Henry A. Walsh; English Gothic Revival):
 * procedural, CC0-1.0.
 * bun generators/det-blessed-sacrament.ts
 *
 * Map frame: x, y, z up, metres, turned to the church's walls: +y runs
 * along bearing 63 (east-north-east, from the front on Woodward Avenue to
 * the apse), +x along 153 (south-south-east). The anchor is the centroid of
 * the OSM outline way/1011595455 (42.3886233, -83.0848010); the catalog
 * bearing is 63. The front is the -y face. The nave's axis is at x = -4.85.
 *
 * Identity, in order: the twin square towers of pale Indiana limestone
 * either side of a flat screen front, each with heavy stepped buttresses,
 * a belfry of paired traceried lancets and a parapet with four tall
 * crocketed corner pinnacles and smaller ones between; the rose window and
 * the great pointed portal in the screen, with the statue gallery and cross
 * over; the green copper flèche over the crossing; the long nave with big
 * clerestory windows between buttresses over low aisles, under a dark slate
 * roof; the transepts' gables with corner pinnacles; the lower stone parish
 * wing with its green copper hipped roof on the south side.
 *
 * Evidence:
 *  - plan: OSM way/1011595455 (Q2942932): the front block 28 m wide and
 *    8.6 m deep, the nave with its aisles x -16.4..6.6, transepts y 2..20.5,
 *    the chancel and apse to y = 33.5, low sacristies beside it, and the
 *    parish wing x 9.6..21.9, y -21.4..0.8, which the outline includes.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame. Heights above the street (about 1.8 m over the box's
 *    minimum): the towers x -17.2..-9.0 and -0.7..7.5, parapets 32.5,
 *    corner pinnacles 40.8; the screen between them 23; nave and transept
 *    ridges 24, their eaves 18.5; aisles 6.5; chancel ridge 21; the flèche
 *    46.2 at the crossing; the parish wing 8-10; the sacristies 6.
 *  - published: begun 1913, dedicated 1915, the towers and the flèche
 *    completed 1951; cathedral since 1938 (Wikipedia "Cathedral of the Most
 *    Blessed Sacrament (Detroit)"; NRHP 82002912).
 *  - photos: every opening's shape and place, the buttresses and pinnacles,
 *    the screen front, the flèche's lantern and spire; colours: pale grey
 *    limestone (`bs-limestone`), the tan rubble of the parish wing
 *    (`bs-wing`), dark blue-grey roofs (`bs-slate`, pulled light), palette
 *    copper for the flèche and the wing roof.
 *  Estimated: stage and window heights from the front photos scaled to the
 *  lidar tower height; the flèche's lantern proportions from the spire
 *  photo; the finial (0.8 m) over the lidar tip.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - BlessedScarement.jpg, Goldnpuppy, CC BY-SA 4.0 (the front, square on)
 *  - Cathedral_of_the_Most_Blessed_Sacrament_(Detroit,_Michigan)_-_exterior.JPG,
 *    _-_exterior_2.JPG, _-_exterior,_rear.JPG, _-_spire.JPG and
 *    _-_view_from_across_Woodward.JPG, Nheyob, CC BY-SA 4.0 (front from the
 *    south-west, the north side, the apse, the flèche, the front)
 * USGS NAIP orthophoto (public domain) for the plan and roofs. No
 * commercial imagery.
 *
 * Doubts: the south side of the nave behind the parish wing is seen only
 * in part; the chancel's low surroundings are simplified to two flat
 * blocks (the south one under green copper, as in the rear photo). The front steps and plaza are the map's.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, arc, lathe } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const lancet = (sc: number, w: number, z0: number, zs: number, n = 4): XY[] => [
  [sc - w / 2, z0], [sc + w / 2, z0],
  ...arc(sc - w / 2, zs, w, 0, 60, n),
  ...arc(sc + w / 2, zs, w, 120, 180, n).slice(1),
]
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}
function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
function box(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1); walls(p, r, z0, z1); if (top) cap(top, r, z1)
}
/** A square pinnacle: shaft and a four-sided spike. */
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number, tip: number) {
  box(p, null, x - h, y - h, x + h, y + h, z0, z1)
  const r = rect(x - h - 0.1, y - h - 0.1, x + h + 0.1, y + h + 0.1)
  for (let i = 0; i < 4; i++) { const a = r[i], b = r[(i + 1) % 4]; p.tri([a[0], a[1], z1], [b[0], b[1], z1], [x, y, tip]) }
}
const F = {
  front: (y: number): Face => ({ o: [0, y, 0], n: [0, -1] }), // s = x
  back: (y: number): Face => ({ o: [0, y, 0], n: [0, 1] }), // s = -x
  south: (x: number): Face => ({ o: [x, 0, 0], n: [1, 0] }), // s = y
  north: (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] }), // s = -y
}

const CX = -4.85, NHW = 7.2, EAVE = 18.5, RIDGE = 24
const FRONT = -36.6, TBACK = -28.3, CR0 = 2.0, CR1 = 20.5, CH1 = 29.0
const AN = -16.4, AS = 6.6, AISLE = 6.5, AISLE_TOP = 9.5
type P = { stone: Part; wing: Part; win: Part; slate: Part; copper: Part; door: Part }

/** A ridge-along-y roof over x = CX ± hw from y0 to y1. */
function roofY(o: P, hw: number, y0: number, y1: number, eave: number, ridge: number) {
  const ov = 0.4, sl = (ridge - eave) / hw
  for (const s of [-1, 1]) qf(o.slate, [CX + s * (hw + ov), y0, eave - ov * sl], [CX + s * (hw + ov), y1, eave - ov * sl], [CX, y1, ridge], [CX, y0, ridge], [s, 0, 1])
}

function tower(o: P, x0: number, x1: number, outer: number) {
  const y0 = FRONT + 0.6, y1 = TBACK, cx = (x0 + x1) / 2, TOP = 32.5
  box(o.stone, null, x0, y0, x1, y1, 0, TOP - 1.0)
  // the parapet band, and the pinnacles: four tall at the corners, two smaller on each face
  const pr = rect(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3)
  walls(o.stone, pr, TOP - 1.0, TOP); cap(o.stone, pr, TOP)
  for (const x of [x0 + 0.6, x1 - 0.6]) for (const y of [y0 + 0.6, y1 - 0.6]) pinnacle(o.stone, x, y, 0.75, TOP, 36.0, 40.8)
  for (const t of [0.36, 0.64]) {
    pinnacle(o.stone, x0 + t * (x1 - x0), y0 + 0.3, 0.3, TOP, 33.8, 35.6)
    pinnacle(o.stone, x0 + t * (x1 - x0), y1 - 0.3, 0.3, TOP, 33.8, 35.6)
    pinnacle(o.stone, x0 + 0.3, y0 + t * (y1 - y0), 0.3, TOP, 33.8, 35.6)
    pinnacle(o.stone, x1 - 0.3, y0 + t * (y1 - y0), 0.3, TOP, 33.8, 35.6)
  }
  // stepped buttresses at the front corners, and on the outer side at the back corner
  const steps: [number, number, number][] = [[0, 11, 1.7], [11, 21.5, 1.15], [21.5, 30.5, 0.6]]
  for (const bx of [x0 + 1.1, x1 - 1.1]) for (const [z0, z1, d] of steps) {
    box(o.stone, null, bx - 1.1, y0 - d, bx + 1.1, y0, z0, z1)
    qf(o.stone, [bx - 1.1, y0 - d, z1], [bx + 1.1, y0 - d, z1], [bx + 1.1, y0 - d + 0.55, z1 + 0.9], [bx - 1.1, y0 - d + 0.55, z1 + 0.9], [0, -1, 1])
  }
  const ox = outer < 0 ? x0 : x1
  for (const by of [y0 + 1.1, y1 - 1.1]) for (const [z0, z1, d] of steps) {
    const xa = outer < 0 ? ox - d : ox, xb = outer < 0 ? ox : ox + d
    box(o.stone, null, xa, by - 1.1, xb, by + 1.1, z0, z1)
    qf(o.stone, [ox + outer * d, by - 1.1, z1], [ox + outer * d, by + 1.1, z1], [ox + outer * (d - 0.55), by + 1.1, z1 + 0.9], [ox + outer * (d - 0.55), by - 1.1, z1 + 0.9], [outer, 0, 1])
  }
  // openings
  const fr = F.front(y0), w0 = x1 - x0
  for (const { f, c, low } of [
    { f: fr, c: cx, low: true },
    { f: outer < 0 ? F.north(x0) : F.south(x1), c: outer < 0 ? -(y0 + y1) / 2 : (y0 + y1) / 2, low: true },
    { f: outer < 0 ? F.south(x1) : F.north(x0), c: outer < 0 ? (y0 + y1) / 2 : -(y0 + y1) / 2, low: false },
    { f: F.back(y1), c: -cx, low: false },
  ]) {
    if (low) {
      flatShape(o.win, f, lancet(c, 1.1, 11.6, 14.8, 3), 0.06)
      for (const d of [-1.0, 1.0]) flatShape(o.win, f, lancet(c + d, 0.6, 17.6, 19.4, 3), 0.06)
    }
    for (const d of [-1.25, 1.25]) {
      flatShape(o.win, f, lancet(c + d, 1.7, 21.8, 28.4, 4), 0.06)
      flatShape(o.stone, f, R(c + d - 0.08, 21.8, c + d + 0.08, 29.1), 0.09)
      flatShape(o.stone, f, R(c + d - 0.8, 25.9, c + d + 0.8, 26.1), 0.09)
    }
    void w0
  }
  // the side portal on the front, in a deep pointed surround
  flatShape(o.stone, fr, lancet(cx, 3.6, 0, 4.0, 5), 0.12)
  flatShape(o.door, fr, R(cx - 1.05, 0, cx + 1.05, 3.6), 0.16)
  flatShape(o.win, fr, lancet(cx, 2.1, 3.6, 4.0, 4).slice(1), 0.16)
}

function build() {
  const o: P = { stone: new Part(), wing: new Part(), win: new Part(), slate: new Part(), copper: new Part(), door: new Part() }

  // ---------------------------------------------------------------- the towers and the screen front
  tower(o, -17.2, -9.0, -1)
  tower(o, -0.7, 7.5, 1)
  {
    const y0 = FRONT + 1.0, f = F.front(y0)
    box(o.stone, null, -9.0, y0, -0.7, TBACK, 0, 22.0)
    const pr = rect(-9.0, y0 - 0.3, -0.7, y0 + 1.2)
    walls(o.stone, pr, 22.0, 23.0); cap(o.stone, pr, 23.0)
    for (const x of [-7.6, -4.85, -2.1]) pinnacle(o.stone, x, y0 + 0.4, 0.25, 23.0, 23.9, 25.0)
    box(o.stone, o.stone, CX - 0.12, y0 + 0.3, CX + 0.12, y0 + 0.55, 25.0, 27.0)
    box(o.stone, o.stone, CX - 0.6, y0 + 0.3, CX + 0.6, y0 + 0.55, 26.0, 26.25)
    // the statue gallery: five niches
    for (let k = -2; k <= 2; k++) flatShape(o.win, f, lancet(CX + k * 1.4, 0.75, 19.0, 21.2, 3), 0.05)
    flatShape(o.stone, f, R(-9.0, 18.3, -0.7, 18.7), 0.15)
    // the rose
    const rz = 14.6, rr = 3.1
    flatShape(o.stone, f, arc(CX, rz, rr + 0.5, 0, 360, 16).slice(0, 16), 0.04)
    flatShape(o.win, f, arc(CX, rz, rr, 0, 360, 16).slice(0, 16), 0.07)
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 4, dx = Math.cos(a), dz = Math.sin(a), b = 0.1
      flatShape(o.stone, f, [[CX - dx * rr - dz * b, rz - dz * rr + dx * b], [CX + dx * rr - dz * b, rz + dz * rr + dx * b], [CX + dx * rr + dz * b, rz + dz * rr - dx * b], [CX - dx * rr + dz * b, rz - dz * rr - dx * b]], 0.1)
    }
    flatShape(o.stone, f, arc(CX, rz, 0.7, 0, 360, 8).slice(0, 8), 0.11)
    // the band of shields over the portal
    flatShape(o.stone, f, R(-9.0, 10.2, -0.7, 10.6), 0.15)
    // the great portal
    flatShape(o.stone, f, lancet(CX, 6.2, 0, 5.6, 6), 0.15)
    flatShape(o.door, f, R(CX - 2.0, 0, CX + 2.0, 4.6), 0.2)
    flatShape(o.win, f, lancet(CX, 4.0, 4.6, 5.0, 5).slice(1), 0.2)
    flatShape(o.stone, f, R(CX - 0.15, 0, CX + 0.15, 7.4), 0.22)
  }

  // ---------------------------------------------------------------- the nave and aisles
  box(o.stone, null, CX - NHW, TBACK, CX + NHW, CR0, AISLE_TOP - 0.5, EAVE)
  roofY(o, NHW, TBACK, CR0, EAVE, RIDGE)
  for (const s of [-1, 1]) {
    const xo = s < 0 ? AN : AS, xi = CX + s * NHW
    box(o.stone, null, Math.min(xo, xi), TBACK, Math.max(xo, xi), CR0, 0, AISLE)
    qf(o.slate, [xo + s * 0.35, TBACK, AISLE - 0.2], [xo + s * 0.35, CR0, AISLE - 0.2], [xi, CR0, AISLE_TOP], [xi, TBACK, AISLE_TOP], [s, 0, 1])
    const fa = s < 0 ? F.north(AN) : F.south(AS), fc = s < 0 ? F.north(xi) : F.south(xi)
    const sy = (y: number) => (s < 0 ? -y : y)
    const n = 5, bw = (CR0 - TBACK) / n
    for (let k = 0; k < n; k++) {
      const yc = TBACK + bw * (k + 0.5)
      flatShape(o.win, fc, lancet(sy(yc), 3.0, AISLE_TOP + 0.4, 15.4, 5), 0.06)
      flatShape(o.stone, fc, R(sy(yc) - 0.08, AISLE_TOP + 0.4, sy(yc) + 0.08, 16.6), 0.09)
      for (const d of [-0.7, 0.7]) flatShape(o.win, fa, R(sy(yc) + d - 0.4, 1.6, sy(yc) + d + 0.4, 4.6), 0.06)
    }
    // buttresses on the aisle wall, and the piers up the clerestory between bays
    for (let k = 1; k < n; k++) {
      const y = TBACK + bw * k
      box(o.stone, null, s < 0 ? AN - 1.2 : AS, y - 0.55, s < 0 ? AN : AS + 1.2, y + 0.55, 0, AISLE + 0.6)
      qf(o.stone, [xo + s * 1.2, y - 0.55, AISLE + 0.6], [xo + s * 1.2, y + 0.55, AISLE + 0.6], [xo, y + 0.55, AISLE + 1.6], [xo, y - 0.55, AISLE + 1.6], [s, 0, 1])
      box(o.stone, null, s < 0 ? xi - 0.8 : xi, y - 0.5, s < 0 ? xi : xi + 0.8, y + 0.5, AISLE_TOP - 0.6, EAVE + 0.2)
      box(o.stone, o.stone, s < 0 ? xi - 0.9 : xi - 0.1, y - 0.6, s < 0 ? xi + 0.1 : xi + 0.9, y + 0.6, EAVE + 0.2, EAVE + 0.8)
    }
  }

  // ---------------------------------------------------------------- the transepts
  {
    const X0 = -18.4, X1 = 16.0, ym = (CR0 + CR1) / 2, hw = (CR1 - CR0) / 2, ov = 0.4, sl = (RIDGE - EAVE) / hw
    walls(o.stone, rect(X0, CR0, X1, CR1), 0, EAVE)
    for (const s of [-1, 1]) qf(o.slate, [X0 - 0.3, ym + s * (hw + ov), EAVE - ov * sl], [X1 + 0.3, ym + s * (hw + ov), EAVE - ov * sl], [X1 + 0.3, ym, RIDGE], [X0 - 0.3, ym, RIDGE], [0, s, 1])
    for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) {
      tf(o.stone, [x, CR0, EAVE], [x, CR1, EAVE], [x, ym, RIDGE + 0.6], [s, 0, 0])
      const f = s < 0 ? F.north(x) : F.south(x), c = s < 0 ? -ym : ym
      for (const k of [-1, 1]) flatShape(o.stone, f, [[c + k * (hw + 0.3), EAVE - 0.3], [c + k * (hw - 0.5), EAVE - 0.3], [c, RIDGE + 0.1], [c, RIDGE + 0.9]], 0.08)
      flatShape(o.win, f, lancet(c, 6.0, 5.0, 13.4, 6), 0.06)
      for (const d of [-1.5, 0, 1.5]) flatShape(o.stone, f, R(c + d - 0.09, 5.0, c + d + 0.09, 15.0), 0.09)
      flatShape(o.stone, f, R(c - 3.0, 10.2, c + 3.0, 10.45), 0.09)
      // corner buttresses ending in pinnacles
      for (const y of [CR0 + 0.7, CR1 - 0.7]) {
        box(o.stone, null, s < 0 ? x - 1.0 : x, y - 0.7, s < 0 ? x : x + 1.0, y + 0.7, 0, EAVE)
        pinnacle(o.stone, x + s * 0.3, y, 0.55, EAVE, EAVE + 2.6, EAVE + 5.4)
      }
    }
    // windows on the transepts' east and west faces
    for (const [x0, x1] of [[X0, AN], [AS, X1]]) {
      const xc = (x0 + x1) / 2
      if (x1 - x0 < 3) continue
      flatShape(o.win, F.front(CR0), lancet(xc, 2.4, 7.0, 13.0, 4), 0.06)
      flatShape(o.win, F.back(CR1), lancet(-xc, 2.4, 7.0, 13.0, 4), 0.06)
    }
  }

  // ---------------------------------------------------------------- the chancel, apse and low surroundings
  {
    const hw = 6.3, ce = 16.5, cr = 21.0
    walls(o.stone, rect(CX - hw, CR1, CX + hw, CH1), 0, ce)
    roofY(o, hw, CR1, CH1, ce, cr)
    const ap: XY[] = [[CX + hw, CH1], [CX + 5.0, 31.8], [CX + 1.9, 33.6], [CX - 1.9, 33.6], [CX - 5.0, 31.8], [CX - hw, CH1]]
    for (let i = 0; i < ap.length - 1; i++) {
      const a = ap[i], b = ap[i + 1], n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0], nl = Math.hypot(n[0], n[1])
      qf(o.stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ce], [a[0], a[1], ce], n)
      tf(o.slate, [a[0] + n[0] / nl * 0.35, a[1] + n[1] / nl * 0.35, ce - 0.3], [b[0] + n[0] / nl * 0.35, b[1] + n[1] / nl * 0.35, ce - 0.3], [CX, CH1, cr], [n[0], n[1], 1])
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      flatShape(o.win, { o: [a[0], a[1], 0], n: [n[0] / nl, n[1] / nl] }, lancet(L / 2, Math.min(2.6, L - 1.0), 5.5, 13.2, 4), 0.06)
    }
    for (const s of [-1, 1]) flatShape(o.win, s < 0 ? F.north(CX - hw) : F.south(CX + hw), lancet(s < 0 ? -24.5 : 24.5, 2.2, 7.0, 13.0, 4), 0.06)
    box(o.stone, o.copper, CX + hw, CR1, 14.2, 31.0, 0, 6.0)
    box(o.stone, o.slate, -19.3, CR1, CX - hw, 28.0, 0, 6.0)
  }

  // ---------------------------------------------------------------- the flèche over the crossing
  {
    const cy = (CR0 + CR1) / 2
    lathe(o.slate, CX, cy, [[2.3, RIDGE - 1.5], [2.3, 27.0]], 8, 22.5, 382.5)
    lathe(o.copper, CX, cy, [[2.1, 27.0], [2.1, 33.0], [2.4, 33.4], [1.9, 33.8], [0.1, 46.2]], 8, 22.5, 382.5)
    for (let k = 0; k < 8; k++) {
      const a = (k + 0.5) * Math.PI / 4 + Math.PI / 8, n: [number, number] = [Math.cos(a), Math.sin(a)]
      const ap = 2.1 * Math.cos(Math.PI / 8), side = 2 * 2.1 * Math.sin(Math.PI / 8)
      const f: Face = { o: [CX + ap * n[0] + n[1] * side / 2, cy + ap * n[1] - n[0] * side / 2, 0], n }
      flatShape(o.win, f, lancet(side / 2, side * 0.55, 28.2, 31.6, 3), 0.05)
    }
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4
      pinnacle(o.copper, CX + 2.3 * Math.cos(a), cy + 2.3 * Math.sin(a), 0.22, 31.5, 33.4, 36.0)
    }
    box(o.copper, o.copper, CX - 0.07, cy - 0.07, CX + 0.07, cy + 0.07, 46.0, 47.0)
  }

  // ---------------------------------------------------------------- the parish wing: tan rubble, green copper hipped roof
  {
    const x0 = 9.6, x1 = 21.9, y0 = -21.4, y1 = 0.8, e = 7.5, r = 10.0, ov = 0.4
    walls(o.wing, rect(x0, y0, x1, y1), 0, e)
    walls(o.wing, rect(AS, -1.7, x0, CR0), 0, e)
    cap(o.copper, rect(AS, -1.7, x0, CR0), e)
    const xm = (x0 + x1) / 2, h = (x1 - x0) / 2
    const A: V3 = [x0 - ov, y0 - ov, e - 0.2], B: V3 = [x1 + ov, y0 - ov, e - 0.2], C: V3 = [x1 + ov, y1 + ov, e - 0.2], D: V3 = [x0 - ov, y1 + ov, e - 0.2]
    const r0: V3 = [xm, y0 + h, r], r1: V3 = [xm, y1 - h, r]
    tf(o.copper, A, B, r0, [0, -1, 1]); tf(o.copper, C, D, r1, [0, 1, 1])
    qf(o.copper, B, C, r1, r0, [1, 0, 1]); qf(o.copper, D, A, r0, r1, [-1, 0, 1])
    // two rows of mullioned windows on the street faces
    for (const [f, a, b] of [[F.south(x1), y0, y1], [F.front(y0), x0, x1]] as [Face, number, number][]) {
      const L = b - a, k = Math.round(L / 3.2)
      for (let j = 0; j < k; j++) {
        const c = a + (j + 0.5) * L / k
        for (const [z0, z1] of [[1.2, 3.0], [4.4, 6.4]]) flatShape(o.win, f, R(c - 0.8, z0, c + 0.8, z1), 0.06)
      }
    }
  }

  return [
    { part: o.stone, material: finish('bs-limestone', 0xcfc3b0) },
    { part: o.wing, material: finish('bs-wing', 0xd6c4a5) },
    { part: o.win, material: PALETTE.window },
    { part: o.slate, material: finish('bs-slate', 0x77828c) },
    { part: o.copper, material: PALETTE.copper },
    { part: o.door, material: finish('bs-door', 0x6e4e38) },
  ]
}

if (import.meta.main) { const b = build(); console.log(b.map(x => x.material.name + ' ' + x.part.triangles).join(', ')); await save('det-blessed-sacrament', 'Cathedral of the Most Blessed Sacrament', [42.3886233, -83.0848010], 63, b, 6500) }
