/**
 * Gallier Hall, New Orleans (James Gallier Sr., 1845-53; the city hall until
 * 1957) — procedural, CC0-1.0, no textures.
 * bun generators/nola-gallier-hall.ts
 *
 * Also the small classical kit (faces, prisms on a face, columns, oriented
 * quads) shared by the other New Orleans models of this builder:
 * nola-us-custom-house, nola-hibernia-bank-building and nola-saenger-theatre
 * import it, so merge this generator first.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 283.9, the bearing of the OSM
 * outline's long walls, so model -y is the front on St. Charles Avenue,
 * facing compass 104 across the avenue to Lafayette Square; model +x is the
 * Poydras side (compass 14), model -x the Lafayette Street side.
 * Anchor: the area centroid of OSM way/328669303.
 *
 * Identity: the white marble temple front: a portico of two rows of six
 * fluted Ionic columns on tall grey granite pedestals, a broad flight of
 * granite steps between two big granite cheek blocks, a full entablature and
 * a low pediment with its sculpture group (Justice, Liberty and Commerce) and
 * palmette acroteria; the marble three-storey body behind, slightly wider
 * than the portico, with antae, a cornice and tall windows in two tiers, and
 * one long low gable roof running back from the pediment to a hip.
 *
 * Evidence
 * - OSM way/328669303 (building=government, height 17, 3 levels): the plan:
 *   the body 28.7 m wide and 53 m deep, the portico 20.6 m wide and
 *   projecting 7.6 m, a shallow recess in the Lafayette Street side.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame. Ground flat (0.2-0.5 all round).
 *   One gable ridge 22.3 from the pediment back to y = 17, then a hip to the
 *   back eave; eaves 18.0 at x = +-12; side parapets 18.7; the pediment's
 *   corners 18.8-19.1; the granite pedestals' tops 4.8; the steps 1.3 one
 *   cell in; the cheek blocks 3.0-3.4, standing 2.5 m forward of the OSM
 *   outline. The tagged height (17) is the side wall, not the ridge.
 * - Terrain (Mapterhorn): flat (0.35 m over the site). elevation 0.
 *   `terrain.ts check` reports the two lowest steps (tops 0.36) under the
 *   drawn ground by up to 1.16 m: the flight and the cheek blocks stand
 *   2.5-3 m forward of the OSM outline, where the terrain is not filled and
 *   carries the real steps' own lidar bump. The steps are right by the
 *   lidar (1.3 one cell in, cheek blocks to y = -34) and the photos.
 * - NAIP 2021 (USGS, public domain): the roof (dark grey, the portico's own
 *   gable on the St. Charles end).
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Gallier Hall, New Orleans 01.jpg", Ktkvtsh, CC BY 4.0: the front
 *     face on (column count and spacing, the steps and pedestals, the
 *     pediment group and acroteria)
 *     https://commons.wikimedia.org/wiki/File:Gallier_Hall,_New_Orleans_01.jpg
 *   - "Gallier Hall, New Orleans 03.jpg", "04", "05", "06", Ktkvtsh,
 *     CC BY 4.0: the great door, its surround, the portico ceiling, the
 *     granite base course and the marble ashlar
 *     https://commons.wikimedia.org/wiki/File:Gallier_Hall,_New_Orleans_03.jpg
 *     https://commons.wikimedia.org/wiki/File:Gallier_Hall,_New_Orleans_05.jpg
 *   - "Gallier Hall, New Orleans 18 December 2025.jpg", Infrogmation,
 *     CC BY-SA 4.0: front and side from the north-east (the second row of
 *     columns, the side's two tiers of windows, the antae)
 *     https://commons.wikimedia.org/wiki/File:Gallier_Hall,_New_Orleans_18_December_2025.jpg
 *   - "Gallier Hall-New Orleans.jpg", Yair-haklai, CC BY-SA 4.0: from the
 *     south-east across St. Charles (the proportions of the whole)
 *     https://commons.wikimedia.org/wiki/File:Gallier_Hall-New_Orleans.jpg
 *   - "Gallier Hall at night, New Orleans February 2014.jpg", Tom Woodward,
 *     CC BY-SA 2.0: the portico floodlit at night
 *     https://commons.wikimedia.org/wiki/File:Gallier_Hall_at_night,_New_Orleans_February_2014.jpg
 * - Published: Wikipedia "Gallier Hall": 1845-53, three-storey marble,
 *   "fronted by two rows of fluted Ionic columns"; NHL 1974.
 *
 * Measured (lidar/OSM): plan, ridge 22.3, eaves 18.0, parapet 18.7,
 * pedestal tops 4.8, cheek blocks 3.3. Estimated from the photos scaled to
 * those: the portico floor 2.5 (7 steps), the columns 4.8-16.4 (r 0.72,
 * about 1:8 -- the lidar's pedestal tops and pediment corners leave no
 * room for 1:9-10 at the photo's thickness), a slim entablature 16.4-18.5,
 * Ionic capitals with bold volute drums, the body cornice 15.6-17.4, the windows (lower
 * 5.3-8.2, upper 10.0-13.2, 1.5 wide), the door (3.4 x 7.6). The side bay
 * count (eleven) is estimated; the back (Lafayette Street end) is not
 * photographed and repeats the sides' windows.
 * Left out: the fluting, the dentils, the lamp posts, the iron fence, the
 * statues by the door.
 *
 * Night: the portico and the front are floodlit (as in the night photo);
 * the windows and the door glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, smoothWall, circle, save, type XY } from './atl-flatiron-building'

// ─────────────────────────────────── kit ───────────────────────────────────

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle turned to face `want`. */
export function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  if (dot(crs(sub3(b, a), sub3(c, a)), want) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
/** A quad turned to face `want`. */
export function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  tf(p, a, b, c, want)
  tf(p, a, c, d, want)
}

/** A wall face: origin `o`, unit tangent `t` along it, unit outward normal `n`. */
export type Face = { o: XY; t: XY; n: XY; L: number }
/** The face of the wall from a to b with the outside on its right (a counter-clockwise ring's edge). */
export function faceOf(a: XY, b: XY): Face {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { o: a, t, n: [t[1], -t[0]], L }
}
/** A point s along the face, d out from it, at height z. */
export const fp = (F: Face, s: number, d: number, z: number): V3 => [F.o[0] + F.t[0] * s + F.n[0] * d, F.o[1] + F.t[1] * s + F.n[1] * d, z]
const nrm3 = (F: Face): V3 => [F.n[0], F.n[1], 0]

/** Ear-clip a simple polygon (counter-clockwise) into index triples. */
export function earclip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k - 1 + idx.length) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      if (cr(poly[ia], poly[ib], poly[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(poly[j], poly[ia], poly[ib], poly[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
const area2 = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)

/**
 * A polygon drawn on a face in (s, z), extruded from d0 to d1 out of the
 * wall: its front cap at d1 and its sides; `back` closes the d0 side too.
 */
export function fprism(p: Part, F: Face, poly: XY[], d0: number, d1: number, back = false) {
  const P = area2(poly) < 0 ? [...poly].reverse() : poly
  const N = nrm3(F)
  for (const [a, b, c] of earclip(P)) {
    tf(p, fp(F, P[a][0], d1, P[a][1]), fp(F, P[b][0], d1, P[b][1]), fp(F, P[c][0], d1, P[c][1]), N)
    if (back) tf(p, fp(F, P[a][0], d0, P[a][1]), fp(F, P[b][0], d0, P[b][1]), fp(F, P[c][0], d0, P[c][1]), [-N[0], -N[1], 0])
  }
  for (let i = 0; i < P.length; i++) {
    const A = P[i], B = P[(i + 1) % P.length]
    // outward in (s, z) is the right of A→B for a counter-clockwise polygon
    const es = B[0] - A[0], ez = B[1] - A[1]
    const want: V3 = [F.t[0] * ez, F.t[1] * ez, -es]
    qf(p, fp(F, A[0], d0, A[1]), fp(F, B[0], d0, B[1]), fp(F, B[0], d1, B[1]), fp(F, A[0], d1, A[1]), want)
  }
}
/** A flat panel (window, door) on a face: rectangle s0..s1, z0..z1, standing `d` off the wall. */
export function fpanel(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  qf(p, fp(F, s0, d, z0), fp(F, s1, d, z0), fp(F, s1, d, z1), fp(F, s0, d, z1), nrm3(F))
}
/** A round-headed panel: jambs from z0, a true semicircle on top reaching zTop. */
export function farch(p: Part, F: Face, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 8) {
  const r = w / 2, spring = zTop - r
  const poly: XY[] = [[s - r, z0], [s + r, z0]]
  for (let i = 0; i <= segs; i++) { const a = (i / segs) * Math.PI; poly.push([s + r * Math.cos(a), spring + r * Math.sin(a)]) }
  const N = nrm3(F), c = fp(F, s, d, Math.max(z0, spring - r * 0.3))
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i], B = poly[(i + 1) % poly.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    tf(p, c, fp(F, A[0], d, A[1]), fp(F, B[0], d, B[1]), N)
  }
}
/** A proud rectangular block on a face (pilaster, pier, plinth): s0..s1, z0..z1, out to d, top chamfered. */
export function fblock(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, d: number, d0 = -0.05) {
  fprism(p, F, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], d0, d)
}

/** A smooth round shaft with a slight taper (r0 at the foot, r1 at the top). */
export function shaft(p: Part, x: number, y: number, r0: number, r1: number, z0: number, z1: number, n = 12) {
  const a = circle([x, y], r0, n), b = circle([x, y], r1, n)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const ni: V3 = [Math.cos((i / n) * 2 * Math.PI), Math.sin((i / n) * 2 * Math.PI), 0]
    const nj: V3 = [Math.cos((j / n) * 2 * Math.PI), Math.sin((j / n) * 2 * Math.PI), 0]
    p.tri([a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [b[j][0], b[j][1], z1], undefined, undefined, undefined, [ni, nj, nj])
    p.tri([a[i][0], a[i][1], z0], [b[j][0], b[j][1], z1], [b[i][0], b[i][1], z1], undefined, undefined, undefined, [ni, nj, ni])
  }
}
/** A disc (short drum) with a top cap: a torus stand-in for column bases and echinus. */
export function drum(p: Part, x: number, y: number, r: number, z0: number, z1: number, n = 12, top = true) {
  const ring = circle([x, y], r, n)
  smoothWall(p, ring, z0, z1)
  if (top) p.cap(ring.map(([a, b]) => [a, b, z1] as V3), true)
}

/**
 * An Ionic column: a round base, a tapered shaft and a capital whose
 * volutes read as a block wider across the face (`alongX`) than deep,
 * under a thin square abacus.
 */
export function ionic(p: Part, x: number, y: number, r: number, z0: number, z1: number, alongX = true, n = 12) {
  const hb = r * 0.55, hc = r * 0.95
  drum(p, x, y, r * 1.22, z0, z0 + hb * 0.5, n, false)
  drum(p, x, y, r * 1.1, z0 + hb * 0.5, z0 + hb, n, false)
  shaft(p, x, y, r, r * 0.86, z0 + hb, z1 - hc, n)
  // the echinus, the cushion between the volutes, and the two volutes as
  // bold scroll drums on the front and back of the capital
  const zv = z1 - hc, ze = z1 - r * 0.2
  drum(p, x, y, r * 1.02, zv, zv + r * 0.25, n, false)
  const vw = r * 1.15, vd = r * 0.9
  const [hx, hy] = alongX ? [vw, vd] : [vd, vw]
  box(p, x - hx, x + hx, y - hy, y + hy, zv + r * 0.25, ze, p, 0.06)
  const vr = r * 0.42, zc = ze - vr
  for (const k of [-1, 1]) {
    const cx = alongX ? x + k * (vw + vr * 0.35) : x, cy = alongX ? y : y + k * (vw + vr * 0.35)
    const ring = circle([0, 0], vr, 10)
    const P = (u: number, v: number, t: number): V3 => (alongX ? [cx + u, cy + t, zc + v] : [cx + t, cy + u, zc + v])
    const d = vd * 1.05
    for (let i = 0; i < 10; i++) {
      const j = (i + 1) % 10, a = ((i + 0.5) / 10) * 2 * Math.PI
      const want: V3 = alongX ? [Math.cos(a), 0, Math.sin(a)] : [0, Math.cos(a), Math.sin(a)]
      qf(p, P(ring[i][0], ring[i][1], -d), P(ring[j][0], ring[j][1], -d), P(ring[j][0], ring[j][1], d), P(ring[i][0], ring[i][1], d), want)
    }
    for (const t of [-d, d]) {
      const want: V3 = alongX ? [0, Math.sign(t), 0] : [Math.sign(t), 0, 0]
      for (let i = 1; i < 9; i++) tf(p, P(ring[0][0], ring[0][1], t), P(ring[i][0], ring[i][1], t), P(ring[i + 1][0], ring[i + 1][1], t), want)
    }
  }
  box(p, x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25, ze, z1, p, 0.04)
}

/** A plain stepped flight on a face: `n` risers from z0 to z1, treads running out from d1 (top) to d0 (foot). */
export function steps(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, dTop: number, dFoot: number, n: number) {
  for (let k = 0; k < n; k++) {
    const d = dFoot + ((dTop - dFoot) * k) / n
    fblock(p, F, s0, s1, z0, z0 + ((z1 - z0) * (k + 1)) / n, d, dTop - 0.01)
  }
}

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ─────────────────────────────── Gallier Hall ───────────────────────────────

if (import.meta.main) {
  const marble = new Part(), white = new Part(), granite = new Part(), roof = new Part(), win = new Part(), door = new Part()

  const xc = -0.5
  const BX0 = xc - 14.4, BX1 = xc + 14.4, YF = -23.55, YB = 29.5 // the body
  const PH = 10.3, YP = -31.2 // portico half-width and front
  const FLOOR = 2.5, PED = 4.8, COLTOP = 16.4, ENT = 18.5, RIDGE = 22.3, EAVE = 18.0, PARA = 18.7
  const BASE = 3.0 // the granite base course of the body
  const slope = (RIDGE - EAVE) / 12

  // ── body: granite base course, marble walls, the recess in the west side ──
  const body: XY[] = [[BX0, YF], [BX1, YF], [BX1, YB], [xc - 13.7, YB], [xc - 13.7, 18.4], [xc - 12.9, 18.4], [xc - 12.9, -11.5], [BX0, -11.5]]
  prism(granite, body, 0, BASE, null, 0)
  prism(marble, body, BASE, PARA, roof, 0.3)
  // base course projects a little: a granite water table
  for (let i = 0; i < body.length; i++) {
    const F = faceOf(body[i], body[(i + 1) % body.length])
    if (F.L < 1) continue
    fblock(granite, F, 0, F.L, 0, BASE, 0.15)
  }

  // body cornice (trim) round the sides and back, and the antae
  const sides = [faceOf([BX1, YF], [BX1, YB]), faceOf([xc - 12.9, 18.4], [xc - 12.9, -11.5]), faceOf([BX1, YB], [xc - 13.7, YB])]
  const westFront = faceOf([BX0, -11.5], [BX0, YF]), westBack = faceOf([xc - 13.7, YB], [xc - 13.7, 18.4])
  for (const F of [...sides, westFront, westBack]) {
    fblock(white, F, -0.0, F.L, 15.6, 16.6, 0.2)
    fprism(white, F, [[-0.0, 16.6], [F.L, 16.6], [F.L, 17.4], [-0.0, 17.4]], -0.05, 0.5)
  }
  // body front, either side of the portico: cornice and corner antae
  const front = faceOf([BX0, YF], [BX1, YF])
  for (const [s0, s1] of [[0, 4.3], [front.L - 4.3, front.L]]) {
    fblock(white, front, s0, s1, 15.6, 16.6, 0.2)
    fprism(white, front, [[s0, 16.6], [s1, 16.6], [s1, 17.4], [s0, 17.4]], -0.05, 0.5)
  }
  for (const [F, ends] of [[front, [0, front.L]], [sides[0], [0, sides[0].L]], [westFront, [westFront.L]], [sides[2], [0, sides[2].L]], [westBack, [0]]] as [Face, number[]][]) {
    for (const e of ends) {
      const s0 = e === 0 ? 0 : e - 1.3
      fblock(white, F, s0, s0 + 1.3, BASE, 15.6, 0.25)
    }
  }

  // windows: two tiers on the sides and back, in the bays between pilasters
  const tiers: [number, number][] = [[4.9, 8.6], [9.8, 13.6]]
  const bays = (F: Face, n: number, m0 = 2.2, m1 = 2.2) => {
    const step = (F.L - m0 - m1) / n
    for (let k = 0; k < n; k++) {
      const s = m0 + step * (k + 0.5)
      for (const [z0, z1] of tiers) {
        fblock(white, F, s - 1.05, s + 1.05, z0 - 0.45, z0 - 0.15, 0.18) // sill
        fpanel(win, F, s - 0.85, s + 0.85, z0, z1)
      }
      fblock(white, F, s - 1.1, s + 1.1, 13.7, 14.1, 0.15) // the upper window's cap
    }
  }
  bays(sides[0], 11, 2.0, 1.8)
  bays(sides[1], 6, 1.0, 1.0)
  bays(westFront, 2, 1.0, 1.8)
  bays(westBack, 2, 1.8, 1.0)
  bays(sides[2], 6, 2.4, 2.4)

  // ── roof: one gable running back from the pediment, hipped at the back ──
  const yHip = YB - 0.7 - 12 * 0.95
  const eL = xc - 12.4, eR = xc + 12.4, yr0 = YF + 0.5, yr1 = YB - 0.7
  const zr = (dx: number) => RIDGE - slope * Math.abs(dx)
  // slopes over the body
  qf(roof, [eL, yr0, zr(12.4)], [eL, yr1, zr(12.4)], [xc, yHip, RIDGE], [xc, yr0, RIDGE], [-1, 0, 2])
  qf(roof, [eR, yr0, zr(12.4)], [xc, yr0, RIDGE], [xc, yHip, RIDGE], [eR, yr1, zr(12.4)], [1, 0, 2])
  tf(roof, [eL, yr1, zr(12.4)], [eR, yr1, zr(12.4)], [xc, yHip, RIDGE], [0, 1, 2])
  // the body's front gable end under the portico roof
  fprism(marble, faceOf([eL, yr0], [eR, yr0]), [[0, zr(12.4)], [24.8, zr(12.4)], [12.4, RIDGE]], -0.1, 0.0)

  // ── portico ──
  const pF = faceOf([xc - PH, YP], [xc + PH, YP]) // its front, s from the left (west) corner
  const DEP = YF - YP
  // floor/podium
  box(granite, xc - PH, xc + PH, YP + 1.2, YF + 0.2, 0, FLOOR, granite, 0.15)
  // steps between the cheek blocks, running forward of the outline as the lidar shows
  steps(granite, pF, PH - 8.4, PH + 8.4, 0, FLOOR, -1.2, 3.0, 7)
  for (const sgn of [-1, 1]) {
    const x0 = xc + sgn * 8.4, x1 = xc + sgn * 11.0
    box(granite, Math.min(x0, x1), Math.max(x0, x1), YP - 3.0, YP + 2.4, 0, 3.3, granite, 0.25)
  }
  // columns: two rows of six on granite pedestals
  const cx = Array.from({ length: 6 }, (_, k) => xc - 9.3 + (18.6 * k) / 5)
  for (const y of [YP + 1.25, YP + 4.65]) {
    for (const x of cx) {
      box(granite, x - 0.95, x + 0.95, y - 0.95, y + 0.95, 1.2, PED, granite, 0.12)
      ionic(white, x, y, 0.72, PED, COLTOP)
    }
  }
  // the antae where the portico meets the body
  for (const x of [xc - 9.3, xc + 9.3]) box(white, x - 0.8, x + 0.8, YF - 0.3, YF + 0.1, FLOOR, COLTOP, white, 0.1)
  // entablature: architrave, frieze, cornice
  // a slim entablature: architrave, frieze, cornice (2.1 m over 11.6 m columns)
  box(white, xc - PH + 0.2, xc + PH - 0.2, YP + 0.25, YF, COLTOP, COLTOP + 0.7, white, 0.06, true)
  box(marble, xc - PH + 0.05, xc + PH - 0.05, YP + 0.1, YF, COLTOP + 0.7, COLTOP + 1.35, marble, 0.05, true)
  box(white, xc - PH - 0.35, xc + PH + 0.35, YP - 0.35, YF, COLTOP + 1.35, ENT, null, 0.12, true)
  // pediment: tympanum set back, raking cornices, roof slopes back to the body
  const zEnd = zr(PH)
  const tymp = faceOf([xc - PH, YP + 0.25], [xc + PH, YP + 0.25])
  fprism(marble, tymp, [[0.3, ENT], [2 * PH - 0.3, ENT], [PH, RIDGE - 0.55]], -0.2, 0.0)
  for (const sgn of [-1, 1]) {
    // a raking cornice: a sloped bar from the corner to the apex, standing proud
    const s0 = sgn < 0 ? -0.35 : 2 * PH + 0.35
    const poly: XY[] = sgn < 0
      ? [[s0, ENT - 0.05], [0.9, ENT - 0.05], [PH, RIDGE - 0.55], [PH, RIDGE + 0.35], [s0, ENT + 0.6]]
      : [[2 * PH - 0.9, ENT - 0.05], [s0, ENT - 0.05], [s0, ENT + 0.6], [PH, RIDGE + 0.35], [PH, RIDGE - 0.55]]
    fprism(white, pF, poly, -(DEP + 0.0), 0.35)
  }
  // portico roof (same planes as the body's), from the pediment back
  qf(roof, [xc - PH - 0.35, YP - 0.35, zEnd + 0.6], [xc, YP - 0.35, RIDGE + 0.35], [xc, yr0, RIDGE + 0.35], [xc - PH - 0.35, yr0, zEnd + 0.6], [-1, 0, 2])
  qf(roof, [xc + PH + 0.35, YP - 0.35, zEnd + 0.6], [xc + PH + 0.35, yr0, zEnd + 0.6], [xc, yr0, RIDGE + 0.35], [xc, YP - 0.35, RIDGE + 0.35], [1, 0, 2])
  // the sculpture group in the tympanum: Justice standing, two seated figures, reclining ends
  // one low relief mound: Justice standing in the middle, the seated figures, the reclining ends
  const group: XY[] = [[PH - 5.6, ENT], [PH + 5.6, ENT], [PH + 4.2, ENT + 0.9], [PH + 2.6, ENT + 1.3], [PH + 1.9, ENT + 2.0], [PH + 0.9, ENT + 2.1],
    [PH + 0.45, ENT + 2.95], [PH, ENT + 3.15], [PH - 0.45, ENT + 2.95], [PH - 0.9, ENT + 2.1], [PH - 1.9, ENT + 2.0], [PH - 2.6, ENT + 1.3], [PH - 4.2, ENT + 0.9]]
  fprism(white, tymp, group, -0.05, 0.85)
  // acroteria: a palmette on the apex, smaller ones at the corners
  const acro = (s: number, z: number, w: number, h: number) => fprism(white, pF, [[s - w / 2, z], [s + w / 2, z], [s + w * 0.42, z + h * 0.6], [s, z + h], [s - w * 0.42, z + h * 0.6]], -0.6, 0.2, true)
  acro(PH, RIDGE + 0.3, 2.2, 1.4)
  acro(0.1, ENT + 0.55, 1.0, 0.9)
  acro(2 * PH - 0.1, ENT + 0.55, 1.0, 0.9)

  // portico ceiling (cream soffit) closes the underside between the beams
  // — the entablature boxes are closed underneath already.

  // ── the great door and the front wall's windows behind the columns ──
  const bf = faceOf([xc - PH, YF], [xc + PH, YF])
  fblock(white, bf, PH - 2.4, PH + 2.4, FLOOR, FLOOR + 8.4, 0.18) // surround
  fblock(white, bf, PH - 2.8, PH + 2.8, FLOOR + 8.4, FLOOR + 9.3, 0.4) // hood
  fpanel(door, bf, PH - 1.7, PH + 1.7, FLOOR, FLOOR + 7.6, 0.24)
  for (const s of [PH - 6.0, PH + 6.0]) {
    fpanel(win, bf, s - 0.75, s + 0.75, FLOOR + 1.6, FLOOR + 5.0)
    fpanel(win, bf, s - 0.75, s + 0.75, 10.0, 13.2)
  }

  const portico = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[1] < YF + 0.5 ? 0.95 : p[1] < YF + 6 ? 0.4 : 0)
  await save('nola-gallier-hall', 'Gallier Hall', [
    { part: marble, material: { ...finish('gallier-marble', 0xdedbd3), floodlight: portico } },
    { part: white, material: { ...finish('gallier-white', 0xf5f2ec), floodlight: portico } },
    { part: granite, material: { ...finish('gallier-granite', 0x969b9f), floodlight: portico } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0xe8e2d4 } },
  ], { bearing: 283.9, osm: 'way/328669303', height: RIDGE + 1.7 }, 5000)
}
