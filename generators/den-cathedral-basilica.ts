/**
 * Cathedral Basilica of the Immaculate Conception, Denver (1902–1911,
 * Leon Coquard / Aristide Leonori; French Gothic) — original procedural
 * geometry, CC0-1.0.
 * bun generators/den-cathedral-basilica.ts
 *
 * Also exports small church helpers (lancet, disc, bar, faces, onFace,
 * spire) used by the other den- churches in this batch; the build is behind
 * `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (OSM's walls run
 * within half a degree of north). Origin on the ground at the anchor, the
 * area centroid of OSM way/91933848 (-104.9819809, 39.7404054). The twin
 * towers and the west front (liturgical west) face south onto East Colfax
 * Avenue (-y); the chevet is to the north.
 *
 * Identity, in order (photos below):
 *  1. twin square towers with stepped corner buttresses, a tall belfry of
 *     paired open lancets, an octagonal lantern ringed by corner pinnacles,
 *     and slender octagonal spires.            (cath, sable, ely, hath)
 *  2. the front between them: a great rose window under an arcaded band
 *     and a steep gable with a small rosette and a cross. (cath, sable)
 *  3. three deep pointed portals under gablets, one in each tower and a
 *     larger one in the middle.                          (ely, cim)
 *  4. pale grey Indiana limestone all over; a pale green copper roof.
 *                                                  (workman, cim, dream)
 *  5. a cruciform plan: aisles with flying buttresses and pinnacles, a
 *     transept whose ends carry corner turrets, a chevet of chapels round
 *     the apse.                                    (workman, cim, OSM)
 *
 * Plan: OSM way/91933848 and its building:parts (towers 7.4 m square,
 * nave 14.2 m wide, aisles to ±10.4, transept ±16.5 by 14 m, chevet to
 * y 29.2), used as drawn and made symmetric about x = -0.2.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, read
 * with a window maximum in this frame. y = 0 is the front and west ground,
 * 1610.4 m (0.8 m above ground_min; the east side is 0.6 m higher and
 * Mapterhorn agrees). Measured: spire tips 62.0 (published 210 ft / 64 m,
 * Wikipedia, likely to the crosses: stone tip put at 62, cross to 63.6);
 * the octagonal lantern's top 42; corner pinnacles 45.5 (thin tips missed,
 * drawn to 46); nave and transept ridges 25.6–26, eaves about 21.5–23;
 * front gable 28 with its cross; aisles and chevet chapels 13–14.5;
 * transept turrets 27; apse flanking turrets 27.
 * OSM's height=13 on the outline is wrong (it is the aisles at most).
 *
 * Estimated from the photos (cath, sable, ely), scaled to the lidar: the
 * square tower body to 36.5; belfry openings 26.5–34.2; the paired lancet
 * window below 15–22; the rose window centred 16.5, radius 3.7; the
 * arcaded band 22.3–24.3; portals 4.2 m (middle) and 3.2 m wide with
 * gablets to 11.5 and 10; aisle lancets 3.5–9.5; clerestory 15–20.2.
 * Left out: crockets, the spires' lucarne detail beyond four gablets,
 * sculpture, the tracery's cusps, railings, the steps.
 *
 * Photos (Wikimedia Commons, evidence):
 *  cath    "Cathedral Basilica of the Immaculate Conception, Denver.jpg",
 *          Sharon Mollerus, CC BY 2.0 (front, from below)
 *  sable   "Cathedral Basilica of the Immaculate Conception
 *          (23775939900).jpg", Paul Sableman, CC BY 2.0 (front, upper part)
 *  ely     "Denver, Church of the Immaculate Conception.jpg", Martin Ely,
 *          CC BY 2.0 (south front, from slightly west)
 *  cim     "CIMDenver.jpg", Vertigo700, CC BY-SA 3.0 (from the south-west)
 *  dream   "Cathedral Basilica of the Immaculate Conception in Denver
 *          Colorado.jpg", Always dreamin, CC BY-SA 4.0 (south-west, far)
 *  workman "Denver Cathedral, exterior, view of the Cathedral.jpg", Workman,
 *          CC BY-SA 4.0 (from the south-east: east side, green roof)
 *  hath    "Revised twin spires, Immaculate Conception Cathedral, Denver IMG
 *          5612.JPG", Billy Hathorn, CC BY-SA 3.0 (spires from the north-east)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north (chevet) and west sides have no close photo; the
 * chevet is drawn from OSM and the lidar, plain. The lidar puts the tower
 * fronts' buttresses about a metre south of OSM's outline; OSM is kept.
 *
 * Night: windows glow (window); the towers and spires are floodlit, the
 * rest of the stone a little.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, gableRoof, onWall, prism, pyramid, rectShape, save, type XY } from './atl-tech-tower'
import { circle } from './atl-flatiron-building'
import { beam } from './den-city-and-county-building'

export type Shape = [number, number][]

/** A pointed (equilateral) arch: width w centred at s, from z0, springing at zs. */
export function lancet(s: number, w: number, z0: number, zs: number, seg = 5): Shape {
  const pts: Shape = [[s - w / 2, z0], [s + w / 2, z0]]
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(a), zs + w * Math.sin(a)]) }
  for (let i = 1; i <= seg; i++) { const a = (Math.PI * 2) / 3 + (i / seg) * (Math.PI / 3); pts.push([s + w / 2 + w * Math.cos(a), zs + w * Math.sin(a)]) }
  return pts
}
/** A round-headed opening: width w centred at s, from z0, springing at zs. */
export function roundArch(s: number, w: number, z0: number, zs: number, seg = 8): Shape {
  const pts: Shape = [[s - w / 2, z0], [s + w / 2, z0]]
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI; pts.push([s + (w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)]) }
  return pts
}
export const disc = (s: number, z: number, r: number, n = 14): Shape =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)])
/** A bar from radius r0 to r1 at angle a (radians) about (s, z), w wide. */
export function bar(s: number, z: number, r0: number, r1: number, a: number, w: number): Shape {
  const c = Math.cos(a), si = Math.sin(a), nx = -si * (w / 2), nz = c * (w / 2)
  return [[s + c * r0 - nx, z + si * r0 - nz], [s + c * r1 - nx, z + si * r1 - nz], [s + c * r1 + nx, z + si * r1 + nz], [s + c * r0 + nx, z + si * r0 + nz]]
}
/** A gable triangle: base from s0 to s1 at z0, apex at z1. */
export const tri = (s0: number, s1: number, z0: number, z1: number): Shape => [[s0, z0], [s1, z0], [(s0 + s1) / 2, z1]]

/**
 * The four faces of an axis-aligned rectangle, each a wall a → b with its
 * outside to the right, plus `u`: the world coordinate along it (x on the
 * south and north faces, y on the east and west) to s along a → b.
 */
export type Face = { a: XY; b: XY; u: (w: number) => number }
export function faces(x0: number, x1: number, y0: number, y1: number) {
  return {
    S: { a: [x0, y0], b: [x1, y0], u: (w: number) => w - x0 } as Face,
    N: { a: [x1, y1], b: [x0, y1], u: (w: number) => x1 - w } as Face,
    E: { a: [x1, y0], b: [x1, y1], u: (w: number) => w - y0 } as Face,
    W: { a: [x0, y1], b: [x0, y0], u: (w: number) => y1 - w } as Face,
  }
}
/** onWall with the shape's s given in world coordinates along the face. */
export function onFace(p: Part, f: Face, pts: Shape, out = 0.06) {
  onWall(p, f.a, f.b, pts.map(([w, z]) => [f.u(w), z] as [number, number]), out)
}
/** A window panel with tracery: mullions at the given world offsets, a transom-free Y under the head. */
export function tracery(win: Part, trim: Part, f: Face, s: number, w: number, z0: number, zs: number, lights = 2, out = 0.06) {
  onFace(win, f, lancet(s, w, z0, zs, 6), out)
  const bw = 0.18
  for (let i = 1; i < lights; i++) {
    const m = s - w / 2 + (w * i) / lights
    onFace(trim, f, rectShape(m - bw / 2, m + bw / 2, z0, zs + 0.2), out + 0.04)
  }
  if (lights >= 2 && w > 1.6) onFace(trim, f, disc(s, zs + w * 0.42, Math.min(0.45, w * 0.17), 10), out + 0.04)
}
/** An octagonal spire from radius r at z0 to an apex at z1, flats facing the axes. */
export function spire(p: Part, c: XY, r: number, z0: number, z1: number) {
  pyramid(p, c, r, z0, z1, 8, Math.PI / 8)
}

// ─────────────────────────────── the cathedral ─────────────────────────────

if (import.meta.main) {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part(), door = new Part()

  const XC = -0.2, YF = -27.3
  const NW = 7.1 // nave half width
  const EAVE = 21.5, RIDGE = 25.8

  // ── Nave, transept, aisles, chevet ──
  box(stone, XC - NW, XC + NW, -20.5, 16.3, 0, EAVE, null, 0.2)
  gableRoof(roof, stone, XC - NW, XC + NW, -20.5, 16.3, EAVE, RIDGE, 'y', 0.4, 0)
  box(stone, XC - 16.5, XC + 16.5, -3, 11, 0, EAVE, null, 0.2)
  gableRoof(roof, stone, XC - 16.5, XC + 16.5, -3, 11, EAVE, RIDGE, 'x', 0.4, 0.2)
  // aisles (to ±10.4) and the wider bay before the transept (to ±15.7), lean-to roofs
  for (const sx of [-1, 1]) {
    const xo = XC + sx * 10.4, xi = XC + sx * NW
    const xs = [xo, xi].sort((a, b) => a - b)
    box(stone, xs[0], xs[1], -20.5, -7.5, 0, 12.2, null, 0)
    const xw = [XC + sx * 15.7, xi].sort((a, b) => a - b)
    box(stone, xw[0], xw[1], -7.5, -3, 0, 13, null, 0)
    for (const [xa, y0, y1, z] of [[xo, -20.5, -7.5, 12.2], [XC + sx * 15.7, -7.5, -3, 13]] as [number, number, number, number][]) {
      const o = sx * 0.4
      const A: V3 = [xa + o, y0 - 0.3, z - 0.2], B: V3 = [xa + o, y1, z - 0.2], C: V3 = [xi, y1, 14.8], D: V3 = [xi, y0 - 0.3, 14.8]
      if (sx < 0) roof.quad(A, D, C, B); else roof.quad(A, B, C, D)
    }
  }
  // the chevet: chapels round the apse, flat-topped to 13.5
  const chev: XY[] = ccw([[XC - 15.6, 11], [XC + 15.6, 11], [XC + 15.6, 14.9], [XC + 10.1, 14.9], ...Array.from({ length: 9 }, (_, i) => {
    const a = (i / 8) * Math.PI
    return [XC + 10.1 * Math.cos(a), 19.1 + 10.1 * Math.sin(a)] as XY
  }), [XC - 10.1, 14.9], [XC - 15.6, 14.9]])
  prism(stone, chev, 0, 13.5, roof, 0.4)
  // the apse: half an octagon round (XC, 16.3), roof a half cone to the ridge
  const apse: XY[] = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 4) * Math.PI
    return [XC + NW * Math.cos(a), 16.3 + NW * Math.sin(a)] as XY
  })
  {
    const ring = ccw([...apse, [XC - NW, 15.5], [XC + NW, 15.5]])
    prism(stone, ring, 0, EAVE, null, 0)
    const top: V3 = [XC, 16.3, RIDGE]
    for (let i = 0; i < apse.length - 1; i++) {
      const a = apse[i], b = apse[i + 1]
      const o = (q: XY): V3 => [XC + (q[0] - XC) * 1.06, 16.3 + (q[1] - 16.3) * 1.06, EAVE - 0.25]
      roof.tri(o(a), o(b), top)
    }
    for (let i = 0; i < apse.length - 1; i++) {
      const a = apse[i], b = apse[i + 1]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      void m
      onWall(win, b, a, lancet(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 1.8, 14.8, 19.0, 5), 0.06)
    }
  }
  // chevet pinnacles and lancets
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * Math.PI, c: XY = [XC + 10.5 * Math.cos(a), 19.1 + 10.5 * Math.sin(a)]
    if (i === 0 || i === 8) continue
    box(stone, c[0] - 0.5, c[0] + 0.5, c[1] - 0.5, c[1] + 0.5, 0, 13.8, null, 0.1)
    pyramid(trim, c, 0.5, 13.8, 16.5, 4)
  }
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * Math.PI, a1 = ((i + 1) / 8) * Math.PI
    const A: XY = [XC + 10.1 * Math.cos(a0), 19.1 + 10.1 * Math.sin(a0)], B: XY = [XC + 10.1 * Math.cos(a1), 19.1 + 10.1 * Math.sin(a1)]
    onWall(win, B, A, lancet(Math.hypot(B[0] - A[0], B[1] - A[1]) / 2, 1.5, 3.5, 8.6, 5), 0.06)
  }

  // ── Turrets: transept ends and beside the apse ──
  for (const c of [[XC - 16.6, -2.6], [XC + 16.6, -2.6], [XC - 16.6, 10.6], [XC + 16.6, 10.6], [XC - 7.6, 15.6], [XC + 7.6, 15.6]] as XY[]) {
    prism(stone, circle(c, 1.25, 8, Math.PI / 8), 0, 23.2, trim, 0.15)
    spire(trim, c, 1.1, 23.2, 27.2)
  }
  // transept ends: a great traceried window, a rosette in the gable
  for (const sx of [-1, 1]) {
    const f = faces(XC - 16.5, XC + 16.5, -3, 11)[sx < 0 ? 'W' : 'E']
    tracery(win, trim, f, 4, 5.6, 6, 15.2, 3)
    onFace(trim, f, disc(4, 22.9, 1.1, 12), 0.06)
    onFace(win, f, disc(4, 22.9, 0.8, 12), 0.1)
    onFace(trim, f, rectShape(-2.2, 10.2, 5.0, 5.5), 0.1)
    for (const s of [-0.8, 8.8]) onFace(win, f, lancet(s, 1.3, 1.8, 3.6), 0.06)
  }
  // transept clerestory, south and north
  for (const [fy, key] of [[-3, 'S'], [11, 'N']] as [number, 'S' | 'N'][]) {
    const f = faces(XC - 16.5, XC + 16.5, -3, 11)[key]
    void fy
    for (const s of [-13.2, -9.8, 9.4, 12.8]) tracery(win, trim, f, XC + s, 2.0, 15.0, 18.6, 2)
  }

  // ── Aisle windows, clerestory, flying buttresses ──
  const bays = [-18.0, -13.4, -9.4]
  for (const sx of [-1, 1]) {
    const aisle = faces(XC - 10.4, XC + 10.4, -20.5, -7.5)[sx < 0 ? 'W' : 'E']
    const clere = faces(XC - NW, XC + NW, -20.5, 16.3)[sx < 0 ? 'W' : 'E']
    for (const y of bays) {
      tracery(win, trim, aisle, y, 1.9, 3.5, 8.0, 2)
      tracery(win, trim, clere, y, 2.3, 15.4, 19.0, 2)
    }
    const wide = faces(XC - 15.7, XC + 15.7, -7.5, -3)[sx < 0 ? 'W' : 'E']
    tracery(win, trim, wide, -5.25, 1.8, 3.5, 8.6, 2)
    for (const y of [-15.7, -11.3]) {
      const xo = XC + sx * 10.4
      box(stone, Math.min(xo, xo + sx * 1.0), Math.max(xo, xo + sx * 1.0), y - 0.5, y + 0.5, 0, 13.6, null, 0.1)
      pyramid(trim, [xo + sx * 0.5, y], 0.5, 13.6, 17.0, 4)
      beam(stone, [xo + sx * 0.3, y, 15.2], [XC + sx * NW, y, 19.4], 0.6, 1.0)
      box(stone, Math.min(XC + sx * NW, XC + sx * (NW + 0.6)), Math.max(XC + sx * NW, XC + sx * (NW + 0.6)), y - 0.45, y + 0.45, 12, EAVE + 0.4, null, 0.1)
      pyramid(trim, [XC + sx * (NW + 0.3), y], 0.45, EAVE + 0.4, EAVE + 3.0, 4)
    }
  }

  // ── The front between the towers ──
  const TH = 3.7, TY = -23.9, TXS = [XC - 8.6, XC + 8.6]
  const FX0 = TXS[0] + TH, FX1 = TXS[1] - TH
  box(stone, FX0, FX1, YF, -20.5, 0, 24.3, null, 0)
  gableRoof(roof, stone, FX0, FX1, YF, -20.5, 24.3, 27.6, 'y', 0, 0)
  const front = faces(FX0, FX1, YF, -20.5).S
  // the rose window
  onFace(trim, front, disc(XC, 16.5, 4.1, 20), 0.04)
  onFace(win, front, disc(XC, 16.5, 3.6, 20), 0.08)
  for (let k = 0; k < 12; k++) onFace(trim, front, bar(XC, 16.5, 0.8, 3.6, (k / 12) * Math.PI * 2, 0.2), 0.12)
  onFace(trim, front, disc(XC, 16.5, 0.95, 12), 0.12)
  // the arcaded band over it and the gable rosette and cross
  onFace(trim, front, rectShape(FX0, FX1, 21.2, 21.7), 0.14)
  for (let k = 0; k < 7; k++) onFace(dark, front, lancet(FX0 + 0.75 + k * ((FX1 - FX0 - 1.5) / 6), 0.8, 21.9, 23.2, 3), 0.06)
  onFace(trim, front, rectShape(FX0, FX1, 23.8, 24.3), 0.14)
  onFace(trim, front, disc(XC, 25.6, 0.95, 12), 0.06)
  onFace(win, front, disc(XC, 25.6, 0.7, 12), 0.1)
  box(trim, XC - 0.15, XC + 0.15, YF - 0.15, YF + 0.15, 27.4, 29.2, trim, 0.04)
  box(trim, XC - 0.6, XC + 0.6, YF - 0.15, YF + 0.15, 28.2, 28.5, trim, 0.04)
  onFace(trim, front, rectShape(FX0, FX1, 12.0, 12.4), 0.02)

  // portals: projecting porches under gablets, a deep pointed arch, doors
  function portal(xc: number, w: number, apex: number, gab: number) {
    const x0 = xc - w / 2 - 0.8, x1 = xc + w / 2 + 0.8, y0 = YF - 1.1
    box(stone, x0, x1, y0, YF, 0, apex + 0.6, null, 0)
    gableRoof(trim, stone, x0, x1, y0, YF, apex + 0.6, gab, 'y', 0.1, 0.1)
    const f = faces(x0, x1, y0, YF).S
    const zs = apex - w * 0.866
    onFace(trim, f, lancet(xc, w + 0.7, 0, zs, 6), 0.03)
    onFace(dark, f, lancet(xc, w, 0, zs, 6), 0.06)
    onFace(door, f, rectShape(xc - w / 2 + 0.35, xc + w / 2 - 0.35, 0, zs - 0.3), 0.09)
    onFace(win, f, lancet(xc, w - 0.9, zs, zs + 0.1, 5).slice(2).concat([[xc + (w - 0.9) / 2, zs], [xc - (w - 0.9) / 2, zs]]) as Shape, 0.09)
    onFace(trim, f, disc(xc, apex + 0.6 + (gab - apex - 0.6) * 0.38, 0.45, 10), 0.06)
  }
  portal(XC, 4.6, 10.6, 13.6)

  // ── The towers ──
  for (const tx of TXS) {
    const x0 = tx - TH, x1 = tx + TH, y0 = TY - TH, y1 = TY + TH
    box(stone, x0, x1, y0, y1, 0, 36.5, stone, 0.3)
    const F = faces(x0, x1, y0, y1)
    // stepped clasping buttresses at the corners
    for (const [cx, cy] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) {
      for (const [d, z1] of [[0.75, 14], [0.45, 30.5]] as [number, number][]) {
        const sx = cx === x0 ? -1 : 1, sy = cy === y0 ? -1 : 1
        const xa = cx + sx * d, xb = cx - sx * 1.0, ya = cy + sy * d, yb = cy - sy * 1.0
        box(stone, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), 0, z1, stone, 0.25)
      }
      // corner pinnacles round the lantern
      const pc: XY = [cx + (cx === x0 ? 0.45 : -0.45), cy + (cy === y0 ? 0.45 : -0.45)]
      box(stone, pc[0] - 0.6, pc[0] + 0.6, pc[1] - 0.6, pc[1] + 0.6, 36.5, 40.5, null, 0.1)
      pyramid(trim, pc, 0.6, 40.5, 46, 4)
    }
    // string courses
    for (const z of [13.4, 24.9, 35.4]) {
      for (const k of ['S', 'E', 'N', 'W'] as const) onFace(trim, F[k], rectShape(k === 'S' || k === 'N' ? x0 : y0, k === 'S' || k === 'N' ? x1 : y1, z, z + 0.45), 0.08)
    }
    // the belfry: two tall open lancets under a hood, on every face
    for (const k of ['S', 'E', 'N', 'W'] as const) {
      const m = k === 'S' || k === 'N' ? tx : TY
      onFace(trim, F[k], lancet(m, 4.5, 25.6, 31.4, 6), 0.03)
      for (const d of [-1.0, 1.0]) onFace(dark, F[k], lancet(m + d, 1.6, 25.9, 33.0, 5), 0.06)
    }
    // the stage below: a paired traceried window, on the faces that show
    const outer = tx < XC ? 'W' : 'E'
    for (const k of ['S', outer] as const) {
      const m = k === 'S' ? tx : TY
      onFace(trim, F[k], lancet(m, 4.0, 14.2, 19.6, 6), 0.03)
      for (const d of [-0.95, 0.95]) onFace(win, F[k], lancet(m + d, 1.5, 14.5, 19.8, 5), 0.06)
      onFace(trim, F[k], disc(m, 21.7, 0.6, 10), 0.07)
    }
    // the tower portal on the south, a lancet over it on the outer face
    portal(tx, 3.6, 9.4, 12.4)
    onFace(win, F[outer], lancet(TY, 1.3, 4.0, 9.0), 0.06)
    // the octagonal lantern, its gablets, the spire and cross
    const tc: XY = [tx, TY]
    prism(stone, circle(tc, 2.95 / Math.cos(Math.PI / 8), 8, Math.PI / 8), 36.5, 42.4, stone, 0.15)
    for (let i = 0; i < 8; i++) {
      const a0 = Math.PI / 8 + (i / 8) * Math.PI * 2, a1 = a0 + Math.PI / 4, R = 2.95 / Math.cos(Math.PI / 8)
      const A: XY = [tc[0] + R * Math.cos(a0), tc[1] + R * Math.sin(a0)], B: XY = [tc[0] + R * Math.cos(a1), tc[1] + R * Math.sin(a1)]
      const L = Math.hypot(B[0] - A[0], B[1] - A[1])
      onWall(dark, A, B, lancet(L / 2, 0.95, 37.4, 40.6, 4), 0.06)
      if (i % 2 === 0) onWall(trim, A, B, tri(0.05, L - 0.05, 42.4, 45.0), 0.06)
    }
    spire(stone, tc, 2.35, 42.4, 62.0)
    for (const z of [48.5, 54.5]) prism(trim, circle(tc, (2.35 * (62 - z)) / 19.6 / Math.cos(Math.PI / 8) + 0.12, 8, Math.PI / 8), z, z + 0.4, trim, 0.05)
    box(trim, tx - 0.13, tx + 0.13, TY - 0.13, TY + 0.13, 61.5, 63.6, trim, 0.03)
    box(trim, tx - 0.55, tx + 0.55, TY - 0.13, TY + 0.13, 62.6, 62.9, trim, 0.03)
  }

  const lit = (p: V3, n: V3) => (p[1] < -19.5 ? (n[2] > 0.9 ? 0.3 : 0.9) : n[2] > 0.5 ? 0 : 0.3)
  await save('den-cathedral-basilica', 'Cathedral Basilica of the Immaculate Conception', [
    { part: stone, material: { ...finish('basilica-limestone', 0xd8d5cd), floodlight: lit } },
    { part: trim, material: { ...finish('basilica-trim', 0xeeebe4), floodlight: lit } },
    { part: roof, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('basilica-recess', 0x5f656d) },
    { part: door, material: finish('basilica-door', 0x8a6b4c) },
  ], { height: 63.6, anchor: [39.7404054, -104.9819809], bearing: 0 }, 6500)
}
