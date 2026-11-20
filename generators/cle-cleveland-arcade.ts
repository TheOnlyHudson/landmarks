/**
 * The Arcade (1890, John Eisenmann and George H. Smith), Cleveland:
 * procedural, CC0-1.0.
 * bun generators/cle-cleveland-arcade.ts [out.glb]
 *
 * Map frame: x across the arcade (bearing 56, toward the east side), y along
 * it toward Superior Avenue (bearing 326), z up, metres. Placed at bearing
 * 326. The origin is the OSM outline's area centroid (-81.6906173,
 * 41.5004148); z = 0 is Superior Avenue's pavement in front of the building,
 * the lowest ground under the footprint (lidar 198.7 m NAVD88). Euclid Avenue
 * at the other end is 3.4 m higher.
 *
 * Form: two nine-storey brick office blocks of dark red-brown brick on a
 * rose-brown stone base, one on Superior Avenue (180 ft front, a tenth-floor
 * tower over the arcade entrance, three arched bays east of it and five
 * west) and one on Euclid Avenue (132 ft front, turned 23.5 degrees onto
 * Euclid's grid, three bays each side of its tower), joined by the arcade:
 * two five-storey ranges of shops and offices either side of a 300 ft
 * skylit nave whose gabled glass roof ends in polygonal hips at both ends,
 * the north hip sitting in a court at the back of the Superior block.
 * Each block's front: a two-storey stone base with shopfronts, five-storey
 * round-arched window bays (floors 3-7), a band of windows and a heavy
 * cornice, paired arched windows (floor 9) and a top row; the tower has a
 * great arched window over its entrance (a semicircular arch on Superior, a
 * flat 1939-era opening with the "THE ARCADE" sign on Euclid), four small
 * arches and a crowning band.
 *
 * Sources
 * - OSM (ODbL): way/126820675 "Cleveland Arcade" (building=commercial, 8
 *   levels, Q5132057), no building:parts. The Hyatt Regency is a node only
 *   (node/2838195203) inside the building. The outline's footprint is used
 *   as drawn, including its west lobe (see Doubts).
 * - HABS OHIO,18-CLEV,6- (Library of Congress, public domain, 1962
 *   drawings): sheet 7 (second-floor plan: Superior block 180 x 65 ft,
 *   arcade 300 ft, Euclid block 132 ft front), sheet 4 (plan at Superior
 *   level), sheet 10 (upper-floor plans: the courts behind both towers),
 *   sheet 11 (Superior elevation), sheet 12 (Euclid elevation), sheet 14
 *   (east elevation of the ranges), sheet 15 (east-west section: five-storey
 *   ranges, gabled glass roof and hipped end).
 *   https://commons.wikimedia.org/wiki/File:Cleveland_Arcade,_401_Euclid_Avenue,_Cleveland,_Cuyahoga_County,_OH_HABS_OHIO,18-CLEV,6-_(sheet_11_of_22).tif
 *   (and sheets 4, 7, 10, 12, 14, 15 of the same set).
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid read in this frame, heights above Superior's
 *   pavement: Superior wings 36.8, Superior tower 42.5, Euclid wings 41.8,
 *   Euclid tower 47.1-47.7, ranges 22.4, glass ridge 31.1-31.4 on x = 3.5,
 *   eaves about 23 at x = -6 and 13, glass from y = -45 to 43; the west lobe
 *   10 and 13.
 * - USGS NAIP orthophoto (public domain): the grey glass roof and its
 *   rounded Euclid end in plan.
 * - Published: 1890, five-storey arcade, two nine-storey buildings, 300 ft
 *   long (Wikipedia "Cleveland Arcade"; HABS).
 * - Photos (Wikimedia Commons, evidence):
 *   Erik Drost, "Cleveland Arcade (16474788975)" (CC BY 2.0; elevated, the
 *   Superior front: bays, tower, entrance arch, brick colour)
 *   https://commons.wikimedia.org/wiki/File:Cleveland_Arcade_(16474788975).jpg
 *   Daderot, "Cleveland Arcade facade - Cleveland, Ohio - DSC07967" (CC0; the
 *   Euclid front, its stone base and flat entrance)
 *   https://commons.wikimedia.org/wiki/File:Cleveland_Arcade_facade_-_Cleveland,_Ohio_-_DSC07967.JPG
 *   Cards84664, "Superior Avenue, The Arcade" (CC BY-SA 4.0; the Superior
 *   front from the west, the blind west side wall)
 *   https://commons.wikimedia.org/wiki/File:Superior_Avenue,_The_Arcade.png
 *   Michael Barera, "Cleveland August 2015 16 (The Arcade)" (CC BY-SA 4.0;
 *   the nave and its glass roof from inside)
 *   https://commons.wikimedia.org/wiki/File:Cleveland_August_2015_16_(The_Arcade).jpg
 *   Martin Linsey, "Cleveland Arcade, 1966" (public domain; the nave, the
 *   hipped glass end)
 *   https://commons.wikimedia.org/wiki/File:Cleveland_Arcade,_1966.jpg
 * Estimated: the facade heights (bands, arches, cornices) scaled from the
 *   HABS elevations to the lidar tops; the Euclid front uses the same scheme
 *   raised 3.4 m and stretched 4% to its taller lidar top; bay counts and
 *   widths from the elevations; the tower widths (14.7 m Superior, 11.8 m
 *   Euclid) from the elevations; the range sides' window grid from sheet 14.
 * Colours: the brick is a dark red-brown and the base a rose-brown stone in
 *   the daylight photos, both pulled to the palette's lightness; window
 *   frames are dark green-grey (palette window); the glass roof reads grey.
 * Left out: the bay windows on the ranges' outer walls, the small arcade of
 *   arched windows over each entrance, awnings, signs, lettering, rooftop
 *   equipment, the skylight's lantern.
 * Doubts: the OSM outline's west lobe (x -28 to -14, y 2 to 31) is a lower
 *   building (10-13 m) not on the HABS plans; it is drawn plainly at its
 *   lidar heights so the replaced outline isn't left empty. The ranges'
 *   outer walls are mostly hidden by neighbours and drawn from the HABS
 *   east elevation. The smokestack on HABS sheet 14 is not in the 2019 lidar
 *   and is left out.
 * Night: windows and the two entrances glow; the glass roof stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capRing, edgeBase, outward, finishGlb, type Prism, type XY } from './sea-columbia-center'
import { inset, panels, wallQuad, writeModel, type Grid } from './cle-200-public-square'

const brick = new Part(), stone = new Part(), win = new Part(), glass = new Part(), roof = new Part()

// ------------------------------------------------------------------ helpers

type Face = { a: XY; t: XY; n: XY; L: number }
const face = (a: XY, b: XY): Face => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { a, L, t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: outward(a, b) }
}
const at = (f: Face, s: number, z: number, d = 0.06): V3 => [f.a[0] + f.t[0] * s + f.n[0] * d, f.a[1] + f.t[1] * s + f.n[1] * d, z]

function rect(part: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  part.quad(at(f, s0, z0, d), at(f, s1, z0, d), at(f, s1, z1, d), at(f, s0, z1, d))
}
/** A round-headed panel: a rectangle from z0 to the springing, then a true semicircle. */
function arch(part: Part, f: Face, s0: number, s1: number, z0: number, spring: number, d = 0.06, seg = 8) {
  if (spring > z0) rect(part, f, s0, s1, z0, spring, d)
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2, C = at(f, c, spring, d)
  for (let k = 0; k < seg; k++) {
    const p = (q: number): V3 => at(f, c + r * Math.cos((q * Math.PI) / seg), spring + r * Math.sin((q * Math.PI) / seg), d)
    part.tri(C, p(k), p(k + 1))
  }
}
/** A bevelled ledge or string course across part of a face, d proud. */
function ledge(part: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const b = d * 0.45 // the lower edge is chamfered back
  const o0 = (s: number) => at(f, s, z0, 0), o1 = (s: number) => at(f, s, z0 + b, d), o2 = (s: number) => at(f, s, z1, d), o3 = (s: number) => at(f, s, z1, 0)
  part.quad(o0(s0), o0(s1), o1(s1), o1(s0)) // chamfer
  part.quad(o1(s0), o1(s1), o2(s1), o2(s0)) // face
  part.quad(o2(s0), o2(s1), o3(s1), o3(s0)) // top
  // ends
  part.tri(o0(s0), o1(s0), o2(s0)); part.tri(o0(s0), o2(s0), o3(s0))
  part.tri(o0(s1), o3(s1), o2(s1)); part.tri(o0(s1), o2(s1), o1(s1))
}
/** A cornice band round a ring, from z0 to z1, with each edge set out by its own distance. */
function cornice(r: XY[], z0: number, z1: number, out: number | number[]) {
  const ds = typeof out === 'number' ? r.map(() => out) : out
  const n = r.length
  const lines = r.map((a, i) => {
    const b = r[(i + 1) % n], o = outward(a, b)
    return [[a[0] + o[0] * ds[i], a[1] + o[1] * ds[i]], [b[0] - a[0], b[1] - a[1]]] as [XY, XY]
  })
  const R = lines.map((l, i) => {
    const [p0, pd] = lines[(i - 1 + n) % n], [q0, qd] = l
    const den = pd[0] * qd[1] - pd[1] * qd[0]
    if (Math.abs(den) < 1e-9) return q0
    const t = ((q0[0] - p0[0]) * qd[1] - (q0[1] - p0[1]) * qd[0]) / den
    return [p0[0] + pd[0] * t, p0[1] + pd[1] * t] as XY
  })
  const lift = Math.min(0.3, (z1 - z0) / 3) // chamfered underside
  const zt = z1 + 0.3 // a low parapet lip, so the band never shares a plane with the roof
  for (let i = 0; i < n; i++) {
    if (ds[i] <= 0) continue
    const a = R[i], b = R[(i + 1) % n], ra = r[i], rb = r[(i + 1) % n]
    stone.quad([ra[0], ra[1], z0], [rb[0], rb[1], z0], [b[0], b[1], z0 + lift], [a[0], a[1], z0 + lift])
    stone.quad([a[0], a[1], z0 + lift], [b[0], b[1], z0 + lift], [b[0], b[1], zt], [a[0], a[1], zt])
    stone.quad([a[0], a[1], zt], [b[0], b[1], zt], [rb[0], rb[1], zt], [ra[0], ra[1], zt])
    stone.quad([rb[0], rb[1], z1], [ra[0], ra[1], z1], [ra[0], ra[1], zt], [rb[0], rb[1], zt])
  }
}

type Block = Prism & { base?: number; grid?: (i: number) => Grid | null }
function buildBlocks(blocks: Block[]) {
  for (const B of blocks) {
    const r = B.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(blocks, B, i)
      if (z0 >= B.z1 - 0.01) continue
      const a = r[i], b = r[(i + 1) % r.length], zb = B.base ?? 0
      if (z0 < zb) wallQuad(stone, a, b, z0, Math.min(zb, B.z1))
      if (B.z1 > Math.max(z0, zb)) wallQuad(B.wall, a, b, Math.max(z0, zb), B.z1)
      const g = B.grid?.(i)
      if (g) panels(win, a, b, z0, B.z1, g)
    }
    capRing(B.roof, r, B.z1)
  }
}

// ------------------------------------------------------------------ the front scheme

/** Heights on a front, drawn for Superior (street at 0, wings to 36.8) and mapped to each front. */
type Zmap = (z: number) => number

/** One wing of a front: n arched bays between s0 and s1. */
function wingFront(f: Face, s0: number, s1: number, n: number, Z: Zmap) {
  const p = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const c = s0 + (i + 0.5) * p, w = Math.min(0.74 * p, 3.6), h = w / 2
    rect(win, f, c - 0.42 * p, c + 0.42 * p, Z(1.0), Z(4.2)) // shopfronts
    rect(win, f, c - h, c + h, Z(5.3), Z(8.2)) // second floor
    rect(win, f, c - h, c + h, Z(9.9), Z(17.4)) // floors 3-5
    arch(win, f, c - h, c + h, Z(18.3), Z(24.0) - h) // floors 6-7 under the arch
    rect(win, f, c - 0.4 * p, c + 0.4 * p, Z(25.7), Z(28.0)) // floor 8
    const w2 = 0.3 * p, g = 0.07 * p
    for (const cc of [c - g - w2 / 2, c + g + w2 / 2]) arch(win, f, cc - w2 / 2, cc + w2 / 2, Z(30.0), Z(32.2) - w2 / 2) // floor 9 pairs
    rect(win, f, c - 0.36 * p, c + 0.36 * p, Z(33.3), Z(35.2)) // floor 10
  }
  ledge(stone, f, s0, s1, Z(9.0), Z(9.5), 0.25) // top of the base
  ledge(stone, f, s0, s1, Z(24.5), Z(25.1), 0.25)
  ledge(stone, f, s0, s1, Z(28.6), Z(29.4), 0.5) // the heavy middle cornice
}

/** The tower over an entrance, centred at s = c, width tw. */
function towerFront(f: Face, c: number, tw: number, Z: Zmap, entrance: 'arch' | 'flat', zStreet: number) {
  if (entrance === 'arch') arch(win, f, c - 4.2, c + 4.2, zStreet + 0.3, zStreet + 2.8, 0.08, 10) // top 7.0 m, from the photo
  else rect(win, f, c - 3.0, c + 3.0, zStreet + 0.3, zStreet + 7.0, 0.08) // 6 x 7 m, from the photo
  const W = Math.min(7.4, tw - 7.0)
  rect(win, f, c - W / 2, c + W / 2, Z(12.4), Z(20.4))
  arch(win, f, c - W / 2, c + W / 2, Z(21.2), Z(31.0) - W / 2, 0.06, 10) // the great arched window
  const sx = W / 2 + 0.7 + 0.65
  for (const sc of [c - sx, c + sx]) {
    rect(win, f, sc - 0.65, sc + 0.65, Z(12.4), Z(20.4))
    rect(win, f, sc - 0.65, sc + 0.65, Z(21.2), Z(30.0))
  }
  const k = (tw - 2.4) / 4
  for (let i = 0; i < 4; i++) {
    const cc = c - 2 * k + (i + 0.5) * k, w = 0.62 * k
    arch(win, f, cc - w / 2, cc + w / 2, Z(32.3), Z(35.4) - w / 2)
  }
  rect(win, f, c - tw / 2 + 1.6, c + tw / 2 - 1.6, Z(38.0), Z(40.6))
  ledge(stone, f, c - tw / 2, c + tw / 2, Z(9.0), Z(9.5), 0.25)
}

// ------------------------------------------------------------------ the model

function build() {
  const blocks: Block[] = []
  const side: Grid = { bay: 2.4, pier: 1.8, group: 7.2, spandrel: 1.6, from: 0, edge: 1.2, head: 1.6, foot: 1.2 }
  const sparse: Grid = { bay: 1.6, pier: 5.0, group: 7.2, spandrel: 2.4, from: 0, edge: 2.0, head: 2.0, foot: 1.2 }
  const add = (ring: XY[], z1: number, opt: Partial<Block> = {}) =>
    blocks.push({ ring, z1, wall: brick, roof, kind: 'b', ...opt })

  // ---- Superior block: wings, the middle over the entrance, the tower
  const SUP = 53.5, BACK = 31, COURT = 43, WT = 36.8, TT = 42.5
  const gridFor = (front: number, g: Grid) => (i: number) => (i === front ? null : g)
  add([[-27.9, BACK], [-6, BACK], [-6, SUP], [-27.9, SUP]], WT, { base: 9.1, grid: (i) => (i === 2 ? null : i === 3 ? sparse : side) })
  add([[13, BACK], [26, BACK], [26, SUP], [13, SUP]], WT, { base: 9.1, grid: (i) => (i === 2 ? null : i === 1 ? sparse : side) })
  add([[-6, COURT], [13, COURT], [13, SUP], [-6, SUP]], WT, { base: 9.1, grid: gridFor(2, side) })
  add([[-3.5, COURT], [11.2, COURT], [11.2, SUP], [-3.5, SUP]], TT, { z0: WT, grid: gridFor(2, side) })

  // ---- the arcade ranges, and the outline's lower west lobe
  const RT = 22.4
  add([[-14.3, -38.2], [12.8, -53.6], [20.4, -36.1], [20.4, COURT], [-19.5, COURT], [-19.5, 12], [-14.3, 12]], RT, { base: 4.2, grid: () => side })
  add([[-19.5, 2.4], [-14.3, 2.4], [-14.3, 12], [-19.5, 12]], 13.2, { base: 4.2, grid: () => side })
  add([[-27.9, 2.4], [-19.5, 2.4], [-19.5, BACK], [-27.9, BACK]], 9.8, { base: 4.2, grid: () => side })

  // ---- Euclid block, on Euclid's grid
  const D: XY = [-18.6, -36.3], A: XY = [-26.7, -54.6], Bp: XY = [10.9, -70.5], C: XY = [17.4, -55.7], X: XY = [12.8, -53.6]
  const EZ = 3.4, EK = (41.8 - EZ) / WT
  const ZE: Zmap = (z) => EZ + EK * z
  add([D, A, Bp, C, X], 41.8, { base: ZE(9.1), grid: gridFor(1, side) })
  const fe = face(A, Bp), tw = 11.8, ec = fe.L / 2
  const nIn: XY = [-fe.n[0], -fe.n[1]]
  const backHit = (p: XY): XY => {
    // p + k nIn meets the line D→X
    const d: XY = [X[0] - D[0], X[1] - D[1]]
    const den = nIn[0] * d[1] - nIn[1] * d[0]
    const k = ((D[0] - p[0]) * d[1] - (D[1] - p[1]) * d[0]) / den
    return [p[0] + nIn[0] * k, p[1] + nIn[1] * k]
  }
  const F1 = at(fe, ec - tw / 2, 0, 0), F2 = at(fe, ec + tw / 2, 0, 0)
  const f1: XY = [F1[0], F1[1]], f2: XY = [F2[0], F2[1]]
  const ET = ZE(TT)
  add([f1, f2, backHit(f2), backHit(f1)], ET, { z0: 41.8, grid: gridFor(0, side) })

  buildBlocks(blocks)

  // ---- fronts
  const Zs: Zmap = (z) => z
  wingFront(face([26, SUP], [13, SUP]), 0.4, 13, 3, Zs)
  wingFront(face([-6, SUP], [-27.9, SUP]), 0, 21.5, 5, Zs)
  const fm = face([13, SUP], [-6, SUP]), tc = 13 - 3.85
  towerFront(fm, tc, 14.7, Zs, 'arch', 0)
  ledge(stone, fm, 0, tc - 7.35, 9.0, 9.5, 0.25)
  ledge(stone, fm, tc + 7.35, fm.L, 9.0, 9.5, 0.25)
  wingFront(fe, 0.4, ec - tw / 2, 3, ZE)
  wingFront(fe, ec + tw / 2, fe.L - 0.4, 3, ZE)
  towerFront(fe, ec, tw, ZE, 'flat', EZ)

  // ---- cornices: the wings' tops (round the courts) and the towers' crowns
  cornice([[-27.9, BACK], [-6, BACK], [-6, COURT], [13, COURT], [13, BACK], [26, BACK], [26, SUP], [-27.9, SUP]], 36.0, WT, 0.5)
  cornice([[-3.5, COURT], [11.2, COURT], [11.2, SUP], [-3.5, SUP]], 41.6, TT, 0.5)
  cornice([D, A, Bp, C, X], ZE(36.0), 41.8, 0.5)
  cornice([f1, f2, backHit(f2), backHit(f1)], ZE(41.6), ET, 0.5)
  cornice([[-14.3, -38.2], [12.8, -53.6], [20.4, -36.1], [20.4, BACK], [-19.5, BACK], [-19.5, 12], [-14.3, 12]], 21.8, RT, [0, 0.35, 0.35, 0, 0.35, 0, 0.35])

  // ---- the glass roof over the nave: a gable with polygonal hips at both ends
  const AX = 3.5, HW = 9.5, EAVE = 23.2, RIDGE = 31.4, YN = 33.5, YS = -36
  const out = (p: V3[], hint: V3, part = glass) => {
    const [a, b, c] = p
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    const q = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...p].reverse() : p
    if (q.length === 4) part.quad(q[0], q[1], q[2], q[3])
    else part.tri(q[0], q[1], q[2])
  }
  // the eave line, counter-clockwise: east side north, the north hip, west side south, the south hip
  const SEG = 6
  const eave: XY[] = []
  for (let k = 0; k <= SEG; k++) { const q = (k * Math.PI) / SEG; eave.push([AX + HW * Math.cos(q), YN + HW * Math.sin(q)]) }
  for (let k = 0; k <= SEG; k++) { const q = Math.PI + (k * Math.PI) / SEG; eave.push([AX + HW * Math.cos(q), YS + HW * Math.sin(q)]) }
  // the low glazed wall from the ranges' roof to the eave
  for (let i = 0; i < eave.length; i++) {
    const a = eave[i], b = eave[(i + 1) % eave.length], o = outward(a, b)
    out([[a[0], a[1], RT], [b[0], b[1], RT], [b[0], b[1], EAVE], [a[0], a[1], EAVE]], [o[0], o[1], 0])
  }
  // the slopes, in bays between iron ribs
  const NB = 10
  for (let k = 0; k < NB; k++) {
    const y0 = YS + ((YN - YS) * k) / NB, y1 = YS + ((YN - YS) * (k + 1)) / NB
    out([[AX - HW, y0, EAVE], [AX - HW, y1, EAVE], [AX, y1, RIDGE], [AX, y0, RIDGE]], [-1, 0, 1])
    out([[AX + HW, y0, EAVE], [AX + HW, y1, EAVE], [AX, y1, RIDGE], [AX, y0, RIDGE]], [1, 0, 1])
  }
  // the hips
  for (const [y, from] of [[YN, 0], [YS, SEG + 1]] as const) {
    for (let k = 0; k < SEG; k++) {
      const a = eave[from + k], b = eave[from + k + 1], m: XY = [(a[0] + b[0]) / 2 - AX, (a[1] + b[1]) / 2 - y]
      out([[a[0], a[1], EAVE], [b[0], b[1], EAVE], [AX, y, RIDGE]], [m[0], m[1], 4])
    }
  }
  // iron ribs across the slopes, and the ridge
  const slope = Math.atan2(RIDGE - EAVE, HW), up: V3 = [0, 0, 0.14]
  const rib = (y: number, sgn: number) => {
    const w = 0.22, e: V3 = [AX + sgn * HW, y, EAVE], r: V3 = [AX, y, RIDGE]
    const nx = sgn * Math.sin(slope), nz = Math.cos(slope)
    const lift = (p: V3, dy: number): V3 => [p[0] + nx * up[2], p[1] + dy, p[2] + nz * up[2]]
    out([lift(e, -w), lift(e, w), lift(r, w), lift(r, -w)], [nx, 0, nz], roof)
    out([[e[0], e[1] - w, e[2]], lift(e, -w), lift(r, -w), [r[0], r[1] - w, r[2]]], [0, -1, 0], roof)
    out([[e[0], e[1] + w, e[2]], lift(e, w), lift(r, w), [r[0], r[1] + w, r[2]]], [0, 1, 0], roof)
  }
  for (let k = 0; k <= NB; k++) for (const s of [-1, 1]) rib(YS + ((YN - YS) * k) / NB, s)
  out([[AX - 0.3, YS, RIDGE + 0.05], [AX + 0.3, YS, RIDGE + 0.05], [AX + 0.3, YN, RIDGE + 0.05], [AX - 0.3, YN, RIDGE + 0.05]], [0, 0, 1], roof)

  return finishGlb('cle-cleveland-arcade', 'The Arcade', [
    { part: brick, material: finish('arcade-brick', 0x955c50) },
    { part: stone, material: finish('arcade-stone', 0xb8958b) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 326, height: ET, replaces: ['way/126820675'] }, 6500)
}

if (import.meta.main) await writeModel('cle-cleveland-arcade', build())
