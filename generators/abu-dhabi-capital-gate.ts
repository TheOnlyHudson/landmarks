/**
 * Capital Gate, Abu Dhabi (RMJM, 2011): procedural, CC0-1.0.
 * bun generators/abu-dhabi-capital-gate.ts
 *
 * The "leaning tower of Abu Dhabi": an oval glass tower that rises
 * straight for its first floors and then leans 18 degrees west, wrapped in
 * a diagrid, with the "splash", a steel-framed canopy, sweeping up its
 * east face from the ground to about 55% of its height.
 *
 * Frame: anchor at the centroid of the OSM outline (way/103779658),
 * 54.4346915, 24.4186985. OSM's outline is the tower's plan projection,
 * base and overhang together (68 m long against a floor plate of about
 * 1,500 m2), stretched along compass 262; the model is built leaning
 * toward model -x and placed at bearing 352, so it leans toward 262 (west,
 * as published). The base oval's centre is at x = +16.5 and the roof's at
 * x = -17.5.
 *
 * Published: 160 m, 35 floors, leaning 18 degrees west, 53,100 m2 of
 * floor area (Wikipedia; CTBUH); external diagrid of 720 pieces. The top's
 * overhang is published as 35 m by one source and 54 m by another; 34 m
 * fits OSM's 68 m outline and is used. Estimated: floor plate an oval
 * about 38 m (along the lean) by 52 m (OSM's width across it is about
 * 58 m; floor area 53,100 / 35 floors = 1,517 m2), widening about 8% from
 * base to roof (o03, c04); the lean starts near 40 m and is a steady 18
 * degrees above about 70 m (o04); the splash's top edge at 90 m, about
 * 56% of the height (c04: 0.56), reaching the ground about 40 m east of
 * the base (o04); a round rooftop ring (c04). Diagrid: 20 diamonds round
 * the tower, each about 12.3 m tall (about twice the first pass, near the
 * photo's grain), built as real relief: every glass diamond is recessed
 * 0.7 m at its centre so the members stand as ridges, and a white member
 * strip runs along every ridge.
 *
 * Colour: glass #5b7f9d (daylight samples #2a4d6d, #386587, #194252 in
 * o03 and o04, deep blue, pulled to the palette's lightness); diagrid
 * white `trim`; the splash is an open steel-and-glass frame (c04, o04): a
 * light silver #e2e5e8 frame of real members (verticals as box sections,
 * horizontals as flat members, open strut side frames) over a pale,
 * translucent glass sheet #c9dde8 at 35% opacity, so it reads see-through
 * (lead review round 1: was a solid beige slab). Night: the glass is a lit hotel and offices
 * (`window`); the diagrid and the splash are floodlit (o01).
 *
 * Photos (EVIDENCE):
 * - o01 "Capital Gate at Night, Abu Dhabi, UAE", lam_chihang, CC BY 2.0, https://www.flickr.com/photos/12316147@N05/8584311734
 * - o01b "Capital Gate, Abu Dhabi, UAE", lam_chihang, CC BY 2.0, https://www.flickr.com/photos/12316147@N05/8583214859
 * - o03 "Capital Gate Tower / Hyatt Capital Gate Hotel", Se.By. (Sergey Bystro), CC BY 2.0, https://www.flickr.com/photos/78051511@N03/7717949100 (along the lean)
 * - o04 "Capital Gate", DjordjeR, CC BY-SA 2.0, https://www.flickr.com/photos/47508852@N02/19053072309 (across the lean, splash)
 * - c03 "Capital Gate 20260625 212735", Bishaldev100, CC BY-SA 4.0, Wikimedia Commons
 * - c04 "Boot - panoramio (1)", Xiaotong Gao, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Boot_-_panoramio_(1).jpg (from the east, splash face-on)
 * Facts: https://en.wikipedia.org/wiki/Capital_Gate ; CTBUH ;
 * https://www.building.co.uk/focus/twist-and-shout-rmjms-abu-dhabi-capital-gate-tower/3157416.article
 *
 * Doubts: the overhang is disputed (35 or 54 m); the oval's proportions,
 * where the lean starts and the splash's plan are photo estimates; the
 * splash's grid is coarser than the real one; the low
 * grandstand and the link to ADNEC are not modelled.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 352
const H = 160
const X0 = 16.5 // base centre, model x
const TAU = Math.PI * 2

/** Centre of the oval at height z: straight, easing into an 18-degree lean. */
function cx(z: number) {
  const t = Math.tan((18 * Math.PI) / 180)
  // smooth start: the offset ramps up between 40 and 100 m, then a steady 18 degrees
  const z1 = 40, z2 = 100
  let d: number
  if (z <= z1) d = 0
  else if (z <= z2) d = (t * (z - z1) ** 2) / (2 * (z2 - z1))
  else d = (t * (z2 - z1)) / 2 + t * (z - z2)
  return X0 - d * (34 / ((t * (z2 - z1)) / 2 + t * (H - z2)))
}
/** Semi-axes: a along the lean (x), b across it (y). */
const ax = (z: number) => 18.5 * (1 + 0.08 * (z / H))
const by = (z: number) => 25.5 * (1 + 0.08 * (z / H))
const pt = (th: number, z: number, out = 0): V3 => {
  const a = ax(z), b = by(z), n = nrm(th, z)
  return [cx(z) + a * Math.cos(th) + n[0] * out, b * Math.sin(th) + n[1] * out, z]
}
function nrm(th: number, z: number): V3 {
  const a = ax(z), b = by(z)
  const x = Math.cos(th) / a, y = Math.sin(th) / b, l = Math.hypot(x, y)
  return [x / l, y / l, 0]
}

/** A triangle wound to face `out` (its own flat normal). */
function outTri(part: Part, a: V3, b: V3, c: V3, out: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let g: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0) g = [-g[0], -g[1], -g[2]]
  const l = Math.hypot(...g) || 1
  const n: V3 = [g[0] / l, g[1] / l, g[2] / l]
  part.tri(a, b, c, [0, 0], [0, 0], [0, 0], [n, n, n])
}

/**
 * The facade: a diamond lattice. Each diamond of glass is recessed 0.7 m at
 * its centre, so the diagrid's members stand as real ridges between the
 * panes, and a white member runs along every ridge (o03, o04).
 */
const COLS = 20, ROWS = 26 // diamonds round the tower; half-diamond rows up it
const ROWH = H / ROWS, DTH = TAU / COLS, REC = 0.7
const node = (k: number, j: number): [number, number] => [(j + 0.5 * (k % 2)) * DTH, Math.min(Math.max(k * ROWH, 0), H)]
function body(glass: Part, roof: Part, trim: Part) {
  for (let k = 0; k <= ROWS; k++) {
    for (let j = 0; j < COLS; j++) {
      const [tl, z] = node(k, j), [tr] = node(k, j + 1), tc = (tl + tr) / 2
      const zb = Math.max(z - ROWH, 0), zt = Math.min(z + ROWH, H)
      const L = pt(tl, z), R = pt(tr, z), Bt = pt(tc, zb), T = pt(tc, zt), C = pt(tc, z, -REC)
      // smooth (surface) normals, so the panes weld; the recess shows in the members' relief
      const nL = nrm(tl, z), nR = nrm(tr, z), nB = nrm(tc, zb), nT = nrm(tc, zt), nC = nrm(tc, z)
      const t3 = (a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3) => glass.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
      if (zb < z) { t3(Bt, R, C, nB, nR, nC); t3(L, Bt, C, nL, nB, nC) }
      if (zt > z) { t3(R, T, C, nR, nT, nC); t3(T, L, C, nT, nL, nC) }
    }
  }
  // the members: a white strip along every ridge, from each node up-left and up-right
  const w = 0.45, lift = 0.1
  for (let k = 0; k < ROWS; k++) {
    for (let j = 0; j < COLS; j++) {
      const [t0, z0] = node(k, j)
      for (const s of [-1, 1]) {
        const t1 = t0 + (s * DTH) / 2, z1 = Math.min((k + 1) * ROWH, H)
        const p0 = pt(t0, z0, lift), p1 = pt(t1, z1, lift), n0 = nrm(t0, z0), n1 = nrm(t1, z1)
        const e: V3 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]
        const sv = (n: V3): V3 => { const c: V3 = [n[1] * e[2] - n[2] * e[1], n[2] * e[0] - n[0] * e[2], n[0] * e[1] - n[1] * e[0]]; const l = Math.hypot(...c) || 1; return [(c[0] / l) * w, (c[1] / l) * w, (c[2] / l) * w] }
        const s0 = sv(n0), s1 = sv(n1)
        const A0: V3 = [p0[0] - s0[0], p0[1] - s0[1], Math.max(0, p0[2] - s0[2])], B0: V3 = [p0[0] + s0[0], p0[1] + s0[1], Math.max(0, p0[2] + s0[2])]
        const A1: V3 = [p1[0] - s1[0], p1[1] - s1[1], Math.min(H + 0.3, p1[2] - s1[2])], B1: V3 = [p1[0] + s1[0], p1[1] + s1[1], Math.min(H + 0.3, p1[2] + s1[2])]
        trim.tri(A0, B0, B1, [0, 0], [0, 0], [0, 0], [n0, n0, n1]); trim.tri(A0, B1, A1, [0, 0], [0, 0], [0, 0], [n0, n1, n1])
      }
    }
  }
  // roof
  const N = 32
  const top: V3 = [cx(H), 0, H]
  for (let i = 0; i < N; i++) {
    const t0 = (TAU * i) / N, t1 = (TAU * (i + 1)) / N
    roof.tri(pt(t0, H), pt(t1, H), top)
  }
}

/** The parapet ring at the roof, a plinth ring at the foot, and the rooftop ring. */
function rings(trim: Part) {
  const out = 0.42
  // parapet ring at the roof edge and a ring at the foot
  const N = 32
  for (const [z0, z1] of [[H - 1.6, H + 0.8], [0, 1.2]]) {
    for (let i = 0; i < N; i++) {
      const t0 = (TAU * i) / N, t1 = (TAU * (i + 1)) / N
      const a = pt(t0, z0, out), b = pt(t1, z0, out), c = pt(t1, z1, out), d = pt(t0, z1, out)
      trim.tri(a, b, c, [0, 0], [0, 0], [0, 0], [nrm(t0, z0), nrm(t1, z0), nrm(t1, z1)])
      trim.tri(a, c, d, [0, 0], [0, 0], [0, 0], [nrm(t0, z0), nrm(t1, z1), nrm(t0, z1)])
    }
    if (z0 > 1) {
      // cap of the parapet
      for (let i = 0; i < N; i++) {
        const t0 = (TAU * i) / N, t1 = (TAU * (i + 1)) / N
        trim.quad(pt(t0, z1, 0), pt(t0, z1, out), pt(t1, z1, out), pt(t1, z1, 0))
      }
    }
  }
  // rooftop ring (c04): a short drum and a thin ring on posts, drawn as a drum
  const rc: V3 = [cx(H) + 2, 0, H]
  for (let i = 0; i < 20; i++) {
    const t0 = (TAU * i) / 20, t1 = (TAU * (i + 1)) / 20
    const r = 8, z0 = H, z1 = H + 3
    const p = (t: number, z: number, rr = r): V3 => [rc[0] + rr * Math.cos(t), rr * Math.sin(t), z]
    trim.quad(p(t0, z0), p(t1, z0), p(t1, z1), p(t0, z1))
    trim.tri(p(t0, z1), p(t1, z1), [rc[0], 0, z1])
  }
}

/**
 * The splash: a curved sheet hugging the east face from 90 m down, then
 * sweeping out to the ground, with a flat top ledge and ribs (o04, c04).
 * Built as a thick shell (both faces) with ribs on its outer face.
 */
function splash(sp: Part, sglass: Part) {
  const ZT = 90, REACH = 40 // top height; how far east of the base it lands
  const half = 17 // half-width across the lean (y)
  const NZ = 14, NY = 6, TH = 1.2
  // profile: x offset of the sheet from the tower's east face at height z
  const face = (y: number, z: number) => {
    // tower's east face at this y (solve the oval for x >= cx)
    const a = ax(z), b = by(z), yy = Math.min(Math.abs(y) / b, 0.98)
    return cx(z) + a * Math.sqrt(1 - yy * yy)
  }
  const prof = (u: number) => {
    // u = 0 at the top, 1 at the ground: the sheet stands near the face and kicks out at the foot
    const z = ZT * (1 - u)
    const off = 6 + REACH * u ** 3
    return { z, off }
  }
  const P = (iu: number, iy: number, o = 0): V3 => {
    const u = iu / NZ, y = -half + (2 * half * iy) / NY
    const { z, off } = prof(u)
    return [face(y, Math.max(z, 0)) + off + o, y, z]
  }
  // the glazing: one pale glass sheet (double-sided, translucent)
  for (let i = 0; i < NZ; i++) for (let j = 0; j < NY; j++)
    sglass.quad(P(i, j, 0.6), P(i + 1, j, 0.6), P(i + 1, j + 1, 0.6), P(i, j + 1, 0.6))
  // the frame: a box member along every grid line, verticals and horizontals
  const member = (a: V3, b: V3, side: V3, d: number) => {
    const add = (p: V3, q: V3, k = 1): V3 => [p[0] + q[0] * k, p[1] + q[1] * k, p[2] + q[2] * k]
    const o: V3 = [d, 0, 0]
    sp.quad(add(a, side, -1), add(b, side, -1), add(add(b, side, -1), o), add(add(a, side, -1), o))
    sp.quad(add(add(a, side, -1), o), add(add(b, side, -1), o), add(add(b, side), o), add(add(a, side), o))
    sp.quad(add(add(a, side), o), add(add(b, side), o), add(b, side), add(a, side))
  }
  for (let j = 0; j <= NY; j++) for (let i = 0; i < NZ; i++) member(P(i, j), P(i + 1, j), [0, 0.4, 0], TH)
  for (let i = 0; i <= NZ; i++) for (let j = 0; j < NY; j++) {
    // horizontals as flat members on the frame's face (double-sided material)
    const a = P(i, j, TH), b = P(i, j + 1, TH)
    sp.quad([a[0], a[1], Math.max(a[2] - 0.3, 0)], [b[0], b[1], Math.max(b[2] - 0.3, 0)], [b[0], b[1], b[2] + 0.3], [a[0], a[1], a[2] + 0.3])
  }
  // end frames: the two side trusses (o04), drawn as open frames: a strut
  // from the tower face to the sheet at every level, so sky shows between.
  for (const iy of [0, NY]) {
    for (let i = 1; i < NZ; i++) {
      const a = P(i, iy)
      if (a[2] < 2) continue
      const f: V3 = [face(a[1], a[2]), a[1], a[2]]
      const t = 0.5, hy = 0.4
      const box = (x0: number, x1: number, y: number, z: number) => {
        const c = (x: number, dy: number, dz: number): V3 => [x, y + dy, z + dz]
        sp.quad(c(x0, -hy, t), c(x1, -hy, t), c(x1, hy, t), c(x0, hy, t))
        sp.quad(c(x0, -hy, -t), c(x0, -hy, t), c(x0 === x0 ? x1 : x1, -hy, t), c(x1, -hy, -t))
        sp.quad(c(x0, hy, -t), c(x1, hy, -t), c(x1, hy, t), c(x0, hy, t))
      }
      box(f[0], a[0], a[1], a[2])
    }
  }
  for (let j = 0; j < NY; j++) {
    // top ledge, a 3 m deck back to the tower face
    const a = P(0, j), b = P(0, j + 1)
    const ya = a[1], yb = b[1]
    const fa: V3 = [face(ya, ZT), ya, ZT], fb: V3 = [face(yb, ZT), yb, ZT]
    sp.quad(fa, fb, [b[0] + TH, yb, ZT], [a[0] + TH, ya, ZT])
    sp.quad(fa, [a[0] + TH, ya, ZT - 1.4], [b[0] + TH, yb, ZT - 1.4], fb)
  }
}

function build() {
  const glass = new Part(), roof = new Part(), trim = new Part(), sp = new Part(), sg = new Part()
  body(glass, roof, trim)
  rings(trim)
  splash(sp, sg)
  return { glass, roof, trim, sp, sg }
}

if (import.meta.main) {
  const M = build()
  const lit = () => 0.8
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: M.glass, material: { ...PALETTE.window, color: 0x5b7f9d } },
    { part: M.trim, material: { ...PALETTE.trim, color: 0xf2f4f3, floodlight: lit } },
    { part: M.roof, material: PALETTE.roof },
    { part: M.sp, material: { ...finish('capital-gate-splash', 0xe2e5e8), doubleSided: true, floodlight: lit } },
    { part: M.sg, material: { name: 'glass', color: 0xc9dde8, roughness: 0.24, opacity: 0.35, doubleSided: true } },
  ]
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Capital Gate', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: BEARING, elevation: 0, height: H,
  })
  console.log(`abu-dhabi-capital-gate.glb: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > 6500 || glb.length > 250_000) throw new Error('over budget')
  await Bun.write(new URL('../models/abu-dhabi-capital-gate.glb', import.meta.url).pathname, glb)
}
