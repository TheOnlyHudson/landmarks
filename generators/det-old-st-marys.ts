/**
 * Old St. Mary's Church (646 Monroe Street, Greektown, Detroit, 1885,
 * Peter Dederichs): procedural, CC0-1.0.
 * bun generators/det-old-st-marys.ts
 *
 * Map frame: x, y, z up, metres, turned to the church's walls: +x runs
 * along bearing 64 (east-north-east, from the front on St. Antoine Street to
 * the apse), +y along 334 (towards Monroe Street). The anchor is the
 * centroid of the OSM outline way/114189063 (42.3355665, -83.0404415).
 *
 * Identity, in order: the red brick front with cream stone trim, two
 * unequal towers either side of the gable, each a square brick shaft with
 * cream cornices, arched windows and roundels, an octagonal louvred belfry
 * and a dark slate spire banded in cream with a lantern and cross (the
 * south tower the taller); the arcaded portico across the front and the
 * rose window over it; the cruciform body with a high slate roof, lean-to
 * aisles and transepts; the semicircular apse.
 *
 * Evidence:
 *  - plan: OSM way/114189063 (St. Mary Church, Q3585169): the towers
 *    (7 × 7.8 m), nave and aisles, transepts (x -3.5..11), the apse
 *    (radius about 12 m about x = 16).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; it sits about 2 m east of OSM and is shifted to it. Heights
 *    above the ground (flat, 0.3 m over the box minimum): nave and
 *    transept ridges 26.5, their eaves 21.5; aisles 12.5-14; the apse
 *    ring 11.5-14; portico 9.2; south tower body 28.2, belfry 38, cross
 *    49.2; north tower body 27, belfry 36.6, cross 44.0.
 *  - published: 1885, Peter Dederichs, Romanesque Revival / Renaissance
 *    (Wikipedia, "Old St. Mary's Church (Detroit)"; NRHP 74001006).
 *  - photos: the towers' stages, windows and roundels, the belfries and the
 *    banded slate spires, the portico, the rose window, the side windows;
 *    colours: red brick (`st-marys-brick`), cream stone (`st-marys-cream`),
 *    dark slate (`st-marys-slate`).
 *  Estimated: stage heights between the measured tops, window sizes, the
 *  portico's depth, from the photos scaled to the lidar.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - StMarysGreektownDetroit.jpg, Mikerussell, CC BY-SA 3.0 (the south
 *    tower, portico and south side from the south-west)
 *  - GreektownCasinohotelandStMaryRCChurchDetroit.jpg, Mike Russell,
 *    CC BY-SA 3.0 (both towers and the front from the south-west)
 * Look-only (CC BY-NC / ND on Flickr, seen in Openverse, not used for any
 * shape or colour): sazbean, Amaury Laporte, JoyVanBuhler, Lawrence OP.
 * No commercial imagery.
 *
 * Doubts: only two open photos, both from the south-west; the north side,
 * the transepts' ends and the apse are drawn from the plan and lidar with
 * the south side's window rhythm. The 2008 parish centre (way/107456760)
 * and the link to the rectory (way/107456768) are separate buildings and
 * left out, as the brief asks.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, circle, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc, lathe } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const archR = (sc: number, w: number, z0: number, zs: number, segs = 6): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]
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
/** A round-headed window in a cream surround. */
function arched(cream: Part, win: Part, f: Face, sc: number, w: number, z0: number, zs: number, m = 0.22) {
  flatShape(cream, f, archR(sc, w + 2 * m, z0 - m, zs, 6), 0.03)
  flatShape(win, f, archR(sc, w, z0, zs, 6), 0.06)
}
/** A gabled block along x (ridge along x) or y. */
function gabledX(wall: Part, roof: Part, x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, ends: [boolean, boolean]) {
  walls(wall, rect(x0, y0, x1, y1), 0, eave)
  const ym = (y0 + y1) / 2, o = 0.4, sl = (ridge - eave) / ((y1 - y0) / 2)
  qf(roof, [x0, y0 - o, eave - o * sl], [x1, y0 - o, eave - o * sl], [x1, ym, ridge], [x0, ym, ridge], [0, -1, 1])
  qf(roof, [x0, y1 + o, eave - o * sl], [x1, y1 + o, eave - o * sl], [x1, ym, ridge], [x0, ym, ridge], [0, 1, 1])
  if (ends[0]) tf(wall, [x0, y0, eave], [x0, y1, eave], [x0, ym, ridge], [-1, 0, 0])
  if (ends[1]) tf(wall, [x1, y0, eave], [x1, y1, eave], [x1, ym, ridge], [1, 0, 0])
}
function gabledY(wall: Part, roof: Part, x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number) {
  walls(wall, rect(x0, y0, x1, y1), 0, eave)
  const xm = (x0 + x1) / 2, o = 0.4, sl = (ridge - eave) / ((x1 - x0) / 2)
  qf(roof, [x0 - o, y0, eave - o * sl], [x0 - o, y1, eave - o * sl], [xm, y1, ridge], [xm, y0, ridge], [-1, 0, 1])
  qf(roof, [x1 + o, y0, eave - o * sl], [x1 + o, y1, eave - o * sl], [xm, y1, ridge], [xm, y0, ridge], [1, 0, 1])
  tf(wall, [x0, y0, eave], [x1, y0, eave], [xm, y0, ridge], [0, -1, 0])
  tf(wall, [x0, y1, eave], [x1, y1, eave], [xm, y1, ridge], [0, 1, 0])
}
/** A lean-to aisle roof from the outer wall (z0) up to the nave wall (z1); `side` +1 north, -1 south. */
function leanTo(wall: Part, roof: Part, x0: number, x1: number, yIn: number, yOut: number, z0: number, z1: number) {
  const r = rect(x0, Math.min(yIn, yOut), x1, Math.max(yIn, yOut))
  walls(wall, r, 0, z0)
  const s = Math.sign(yOut - yIn), o = 0.35
  qf(roof, [x0, yOut + s * o, z0 - 0.2], [x1, yOut + s * o, z0 - 0.2], [x1, yIn, z1], [x0, yIn, z1], [0, s, 1])
  for (const x of [x0, x1]) tf(wall, [x, yOut, z0], [x, yIn, z0], [x, yIn, z1], [x === x0 ? -1 : 1, 0, 0])
}

const NAVE_Y0 = -5.6, NAVE_Y1 = 5.3, EAVE = 21.5, RIDGE = 26.5
const FRONT = -23.0, PORTICO = -25.8
const AC: XY = [16.0, -0.1], AR = 12.2 // the apse

/** A tower: square brick shaft, cream cornices, octagonal louvred belfry, banded slate spire, lantern, cross. */
function tower(o: { brick: Part; cream: Part; win: Part; slate: Part }, x0: number, y0: number, x1: number, y1: number, body: number, bel: number, tip: number) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = Math.min(x1 - x0, y1 - y0) / 2
  box(o.brick, null, x0, y0, x1, y1, 0, body - 1.2)
  // cornices: a heavy cream band at the first stage, the crowning cornice with a pediment on each face
  for (const [z0, z1, d] of [[12.4, 13.4, 0.35], [body - 1.2, body, 0.45]] as [number, number, number][]) {
    const r = rect(x0 - d, y0 - d, x1 + d, y1 + d)
    walls(o.cream, r, z0, z1); cap(o.cream, r, z1); cap(o.cream, r, z0, false)
  }
  const faces: Face[] = [{ o: [x0, y1, 0], n: [-1, 0] }, { o: [x0, y0, 0], n: [0, -1] }, { o: [x1, y0, 0], n: [1, 0] }, { o: [x1, y1, 0], n: [0, 1] }]
  const L = (f: Face) => (f.n[0] !== 0 ? y1 - y0 : x1 - x0)
  for (const f of faces) {
    const l = L(f), c = l / 2
    // the curved pediment over each face: a cream half-disc standing on the cornice
    extrudeShape(o.cream, f, archR(c, l * 0.42, body, body, 6), 0, 0.45)
    // the windows: paired round-headed below, a pair of tall ones in the shaft, roundels above
    for (const d of [-1.3, 1.3]) {
      arched(o.cream, o.win, f, c + d, 1.0, 2.6, 5.4)
      arched(o.cream, o.win, f, c + d, 1.0, 7.8, 10.6)
      arched(o.cream, o.win, f, c + d, 1.3, 15.5, 20.8)
      flatShape(o.cream, f, arc(c + d, body - 4.2, 0.95, 0, 360, 10).slice(0, 10), 0.03)
      flatShape(o.win, f, arc(c + d, body - 4.2, 0.72, 0, 360, 10).slice(0, 10), 0.06)
    }
    // the cream quoin strips up the corners
    for (const s of [0.35, l - 0.35]) flatShape(o.cream, f, R(s - 0.35, 13.4, s + 0.35, body - 1.2), 0.04)
  }
  // the octagonal belfry: brick with cream bands and a louvred arched opening on each face
  const rb = hw * 0.86, ring = circle(cx, cy, rb, 8, Math.PI / 8)
  walls(o.brick, ring, body, bel - 0.9)
  // the dark slate apron from the square shaft up to the belfry
  lathe(o.slate, cx, cy, [[hw * 1.04, body], [rb + 0.1, body + 1.3]], 8, 22.5)
  const lip = circle(cx, cy, rb + 0.35, 8, Math.PI / 8)
  walls(o.cream, lip, bel - 0.9, bel); cap(o.cream, lip, bel - 0.9, false)
  walls(o.cream, circle(cx, cy, rb + 0.15, 8, Math.PI / 8), body + 1.3, body + 1.9)
  const side = 2 * rb * Math.sin(Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4 + Math.PI / 4 // the face normal, between the corners at π/8 offsets
    const ap = Math.cos(Math.PI / 8) * rb
    const f: Face = { o: [cx + ap * Math.cos(a) + Math.sin(a) * side / 2, cy + ap * Math.sin(a) - Math.cos(a) * side / 2, 0], n: [Math.cos(a), Math.sin(a)] }
    arched(o.cream, o.win, f, side / 2, side * 0.5, body + 2.6, bel - 2.6, 0.18)
    for (let j = 0; j < 4; j++) flatShape(o.cream, f, R(side * 0.27, body + 3.1 + j * 1.0, side * 0.73, body + 3.22 + j * 1.0), 0.09)
    flatShape(o.cream, f, R(0.05, body + 4.6, side - 0.05, body + 5.0), 0.04)
  }
  // the spire: eight faces, slightly bellied, dark slate banded in cream
  const sp = tip - 2.6 - bel, rs = rb + 0.2
  const prof: XY[] = [[rs, bel], [rs * 0.82, bel + sp * 0.18], [rs * 0.5, bel + sp * 0.55], [rs * 0.16, bel + sp]]
  lathe(o.slate, cx, cy, prof, 8, 22.5)
  for (const t of [0.12, 0.42]) {
    const z = bel + sp * t, r = rs * (t < 0.18 ? 1 - t : 0.82 - (t - 0.18) * 0.87) + 0.05
    walls(o.cream, circle(cx, cy, r, 8, Math.PI / 8), z, z + 0.6)
  }
  // lantern and cross
  lathe(o.cream, cx, cy, [[0.5, bel + sp], [0.5, bel + sp + 1.0], [0.6, bel + sp + 1.1], [0.15, bel + sp + 1.6]], 8)
  box(o.cream, o.cream, cx - 0.08, cy - 0.08, cx + 0.08, cy + 0.08, tip - 1.0, tip)
  box(o.cream, o.cream, cx - 0.08, cy - 0.45, cx + 0.08, cy + 0.45, tip - 0.65, tip - 0.45)
}

function build() {
  const brick = new Part(), win = new Part(), slate = new Part(), cream = new Part(), door = new Part()
  const o = { brick, cream, win, slate }

  // ---------------------------------------------------------------- nave, aisles, transepts
  gabledX(brick, slate, FRONT, AC[0], NAVE_Y0, NAVE_Y1, EAVE, RIDGE, [true, false])
  gabledY(brick, slate, -3.5, 11.0, -16.7, 17.2, EAVE, RIDGE)
  for (const [x0, x1] of [[-19.4, -3.5], [11.0, AC[0]]]) {
    leanTo(brick, slate, x0, x1, NAVE_Y1, 11.7, 11.8, 14.5)
    leanTo(brick, slate, x0, x1, NAVE_Y0, -11.9, 11.8, 14.5)
  }
  // a cream cornice band under the eaves of nave and transepts
  for (const r of [rect(FRONT, NAVE_Y0 - 0.2, AC[0], NAVE_Y1 + 0.2), rect(-3.7, -16.9, 11.2, 17.4)]) walls(cream, r, EAVE - 0.9, EAVE - 0.2)

  // ---------------------------------------------------------------- apse: high half-round choir end and the low ring around it
  {
    const seg = 8, hw = (NAVE_Y1 - NAVE_Y0) / 2, cy = (NAVE_Y0 + NAVE_Y1) / 2
    const P = (r: number, a: number, z: number): V3 => [AC[0] + r * Math.cos(a), cy + r * Math.sin(a), z]
    for (let k = 0; k < seg; k++) {
      const a0 = -Math.PI / 2 + (k * Math.PI) / seg, a1 = -Math.PI / 2 + ((k + 1) * Math.PI) / seg, m = (a0 + a1) / 2
      // high choir wall and its half-cone roof
      qf(brick, P(hw, a0, 14), P(hw, a1, 14), P(hw, a1, EAVE), P(hw, a0, EAVE), [Math.cos(m), Math.sin(m), 0])
      tf(slate, P(hw + 0.4, a0, EAVE - 0.3), P(hw + 0.4, a1, EAVE - 0.3), [AC[0], cy, RIDGE], [Math.cos(m), Math.sin(m), 1])
      // low ring: outer wall and lean-to roof
      qf(brick, P(AR, a0, 0), P(AR, a1, 0), P(AR, a1, 11.5), P(AR, a0, 11.5), [Math.cos(m), Math.sin(m), 0])
      qf(slate, P(AR + 0.35, a0, 11.3), P(AR + 0.35, a1, 11.3), P(hw, a1, 14.2), P(hw, a0, 14.2), [Math.cos(m), Math.sin(m), 1])
      const f: Face = { o: P(AR, a0, 0), n: [Math.cos(m), Math.sin(m)] }
      const sl = 2 * AR * Math.sin(Math.PI / seg / 2)
      arched(cream, win, f, sl / 2, 1.3, 4.0, 8.6)
      const fh: Face = { o: P(hw, a0, 0), n: [Math.cos(m), Math.sin(m)] }
      if (k > 0 && k < seg - 1) arched(cream, win, fh, hw * Math.sin(Math.PI / seg), 0.9, 15.8, 19.4, 0.15)
    }
  }

  // ---------------------------------------------------------------- windows along the sides
  for (const [y, s] of [[11.7, 1], [-11.9, -1]] as [number, number][]) {
    const f: Face = { o: [0, y, 0], n: [0, s] } // s = -x on the north, x on the south
    const sx = (x: number) => (s > 0 ? -x : x)
    for (const x of [-16.7, -12.2, -7.7, 13.5]) arched(cream, win, f, sx(x), 1.6, 3.5, 9.4)
    const fc: Face = { o: [0, s > 0 ? NAVE_Y1 : NAVE_Y0, 0], n: [0, s] }
    for (const x of [-16.7, -12.2, -7.7, 13.5]) arched(cream, win, fc, sx(x), 1.2, 15.6, 19.6, 0.18)
    // the transept ends: a tall pair and a round window
    const ft: Face = { o: [0, s > 0 ? 17.2 : -16.7, 0], n: [0, s] }
    for (const d of [-2.2, 2.2]) arched(cream, win, ft, sx(3.75) + d, 1.8, 4.0, 13.0)
    flatShape(cream, ft, arc(sx(3.75), 17.0, 2.0, 0, 360, 12).slice(0, 12), 0.03)
    flatShape(win, ft, arc(sx(3.75), 17.0, 1.6, 0, 360, 12).slice(0, 12), 0.06)
  }
  for (const [x, s] of [[-3.5, -1], [11.0, 1]] as [number, number][]) {
    const f: Face = { o: [x, 0, 0], n: [s, 0] } // s = y on the east face, -y on the west
    for (const y of [-14.2, 14.7]) arched(cream, win, f, s > 0 ? y : -y, 1.6, 15.5, 19.2)
  }

  // ---------------------------------------------------------------- the front
  {
    const ff: Face = { o: [FRONT, 0, 0], n: [-1, 0] } // s = -y
    const c = -(NAVE_Y0 + NAVE_Y1) / 2
    // the front gable stands a little proud, with a cream raking cornice and a cross
    const y0 = NAVE_Y0, y1 = NAVE_Y1, ym = (y0 + y1) / 2
    for (const [ya, yb] of [[y0, ym], [ym, y1]]) {
      const za = ya === ym ? RIDGE + 0.5 : EAVE, zb = yb === ym ? RIDGE + 0.5 : EAVE
      qf(cream, [FRONT - 0.3, ya, za], [FRONT - 0.3, yb, zb], [FRONT + 0.4, yb, zb], [FRONT + 0.4, ya, za], [0, 0, 1])
      qf(cream, [FRONT - 0.3, ya, za - 0.6], [FRONT - 0.3, yb, zb - 0.6], [FRONT - 0.3, yb, zb], [FRONT - 0.3, ya, za], [-1, 0, 0])
    }
    box(cream, cream, FRONT - 0.1, ym - 0.1, FRONT + 0.1, ym + 0.1, RIDGE + 0.5, RIDGE + 2.6)
    box(cream, cream, FRONT - 0.1, ym - 0.6, FRONT + 0.1, ym + 0.6, RIDGE + 1.7, RIDGE + 1.95)
    // the rose window in a deep cream ring, with spokes
    const rz = 14.2, rr = 3.0
    flatShape(cream, ff, arc(c, rz, rr + 0.55, 0, 360, 16).slice(0, 16), 0.03)
    flatShape(win, ff, arc(c, rz, rr, 0, 360, 16).slice(0, 16), 0.06)
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 4, dx = Math.cos(a), dz = Math.sin(a), b = 0.11
      flatShape(cream, ff, [[c - dx * rr - dz * b, rz - dz * rr + dx * b], [c + dx * rr - dz * b, rz + dz * rr + dx * b], [c + dx * rr + dz * b, rz + dz * rr - dx * b], [c - dx * rr + dz * b, rz - dz * rr - dx * b]], 0.09)
    }
    flatShape(cream, ff, arc(c, rz, 0.8, 0, 360, 8).slice(0, 8), 0.1)
    arched(cream, win, ff, c, 2.6, 18.8, 21.4, 0.2)
    // the portico: three round arches on columns, a cream entablature and balustrade
    const px = PORTICO, pz = 8.4
    box(cream, cream, px, NAVE_Y0, FRONT, NAVE_Y1, pz, pz + 0.9)
    for (let k = 0; k <= 3; k++) {
      const y = NAVE_Y0 + 0.4 + (k * (NAVE_Y1 - NAVE_Y0 - 0.8)) / 3
      box(cream, null, px, y - 0.35, px + 0.7, y + 0.35, 0, pz)
      box(cream, null, FRONT - 0.7, y - 0.35, FRONT, y + 0.35, 0, pz)
    }
    const pf: Face = { o: [px, 0, 0], n: [-1, 0] }
    for (let k = 0; k < 3; k++) {
      const s0 = -(NAVE_Y0 + 0.4 + (k * (NAVE_Y1 - NAVE_Y0 - 0.8)) / 3), s1 = -(NAVE_Y0 + 0.4 + ((k + 1) * (NAVE_Y1 - NAVE_Y0 - 0.8)) / 3)
      const a = Math.max(s0, s1) - 0.35, b = Math.min(s0, s1) + 0.35, w = a - b, sc = (a + b) / 2
      // the spandrels over each arch, in brick
      flatShape(brick, pf, [[b, 5.0], ...arc(sc, 5.0, w / 2, 180, 0, 6), [a, 5.0], [a, pz], [b, pz]], 0.02)
      flatShape(door, ff, R(sc - 0.9, 0, sc + 0.9, 3.6), 0.06)
      flatShape(win, ff, archR(sc, 1.8, 3.6, 3.6, 6).slice(1), 0.06)
    }
    for (let y = NAVE_Y0 + 0.4; y < NAVE_Y1 - 0.2; y += 0.9) box(cream, cream, px + 0.05, y - 0.13, px + 0.35, y + 0.13, pz + 0.9, pz + 1.7)
    box(cream, cream, px, NAVE_Y0, px + 0.4, NAVE_Y1, pz + 1.7, pz + 1.95)
  }

  // ---------------------------------------------------------------- the towers
  tower(o, -26.7, -13.4, -19.6, -5.6, 28.2, 38.0, 49.2) // south, the taller
  tower(o, -26.9, 5.2, -19.4, 12.9, 27.0, 36.6, 44.0) // north

  return [
    { part: brick, material: finish('st-marys-brick', 0xb9735b) },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('st-marys-slate', 0x7d8489) },
    { part: cream, material: finish('st-marys-cream', 0xeedcb4) },
    { part: door, material: finish('st-marys-door', 0x7a5640) },
  ]
}

if (import.meta.main) await save('det-old-st-marys', "Old St. Mary's Church", [42.3355665, -83.0404415], 334, build(), 6500)
