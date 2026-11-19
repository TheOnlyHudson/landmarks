/**
 * Shared pieces for the Cathedral Square models of the Moscow Kremlin
 * (moscow-assumption-cathedral, moscow-archangel-cathedral,
 * moscow-annunciation-cathedral, moscow-ivan-the-great-bell-tower,
 * moscow-patriarchs-palace): zakomara roofs, drums, onion and helmet domes,
 * crosses, apses and round-headed window panels. Builds nothing by itself.
 *
 * Every model is built in its own turned frame: x along the church's axis
 * (towards the altar, east), y to its north, z up, metres, the origin at
 * the OSM outline's area centroid. The placement's bearing turns that frame
 * onto the map.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { box, lathe, planar, report, type XY } from './sf-de-young'

export type { XY }
export { box, lathe, planar }

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]

/** Height of a segmental arch over [a, b] with the given rise, at x; 0 outside. */
export function arcAt(x: number, a: number, b: number, rise: number) {
  if (x <= a || x >= b || rise <= 0) return 0
  const s = (b - a) / 2, c = (a + b) / 2, R = (s * s + rise * rise) / (2 * rise)
  return Math.max(0, Math.sqrt(Math.max(0, R * R - (x - c) ** 2)) - (R - rise))
}

/** Sample positions across a row of bays, `n` steps per bay, bay edges included. */
export function samples(bounds: number[], n: number) {
  const out: number[] = [bounds[0]]
  for (let i = 0; i < bounds.length - 1; i++)
    for (let k = 1; k <= n; k++) out.push(bounds[i] + ((bounds[i + 1] - bounds[i]) * k) / n)
  return out
}

export type Sides = { s?: boolean; n?: boolean; w?: boolean; e?: boolean }

/**
 * A block of bays covered "po zakomaram": the walls run up to the springing
 * `zs`, every bay of every facade ends in a segmental gable (a zakomara),
 * and the roof follows the vaults behind them, as the highest of the
 * barrels running across x and across y. The roof's rim, a little proud of
 * the walls, is drawn in `edge` (the gilded or white archivolt line).
 * `walls` leaves out sides that butt against another block.
 * Returns the roof height at (x, y).
 */
export function zakomaraBlock(o: {
  wall: Part; roof: Part; edge?: Part
  xb: number[]; yb: number[]; z0: number; zs: number
  rise: (span: number) => number
  n?: number; overhang?: number; walls?: Sides; arcs?: Sides
  /** a pointed keel on each gable: extra height at the bay's middle */
  keel?: number
  /** the keel's half-width as a share of the bay (0.3) and its curve: 1 straight, above 1 concave, an ogee point */
  keelWidth?: number; keelPow?: number
  /** how far the barrels sink towards the middle of the block (0: not at all), so the gables stand above the roof behind them */
  sag?: number
  /** over how many metres from the facade the sag sets in (half the block's depth by default) */
  sagDepth?: number
  /** draw the overhang's underside (default true) */
  underside?: boolean
}) {
  const { wall, roof, edge, xb, yb, z0, zs } = o
  const n = o.n ?? 6, ov = o.overhang ?? 0.35
  const walls = { s: true, n: true, w: true, e: true, ...o.walls }
  const X0 = xb[0], X1 = xb[xb.length - 1], Y0 = yb[0], Y1 = yb[yb.length - 1]
  const arc1 = (v: number, bs: number[]) => {
    const c = Math.min(bs[bs.length - 1], Math.max(bs[0], v))
    for (let i = 0; i < bs.length - 1; i++) if (c >= bs[i] && c <= bs[i + 1]) {
      const w = bs[i + 1] - bs[i], m = (bs[i] + bs[i + 1]) / 2
      return arcAt(c, bs[i], bs[i + 1], o.rise(w)) + (o.keel ?? 0) * Math.max(0, 1 - Math.abs(c - m) / ((o.keelWidth ?? 0.3) * w)) ** (o.keelPow ?? 1)
    }
    return 0
  }
  const sag = o.sag ?? 0
  const fall = (v: number, a: number, b: number) => 1 - sag * Math.min(1, Math.max(0, Math.min(v - a, b - v)) / (o.sagDepth ?? (b - a) / 2))
  const h = (x: number, y: number) => zs + Math.max(arc1(x, xb) * fall(y, Y0, Y1), arc1(y, yb) * fall(x, X0, X1))
  // roof grid: the wall lines and an overhang strip outside them, which drops a little
  const gx = [X0 - ov, ...samples(xb, n), X1 + ov], gy = [Y0 - ov, ...samples(yb, n), Y1 + ov]
  const zr = (i: number, j: number) => {
    const x = gx[i], y = gy[j]
    const out = i === 0 || j === 0 || i === gx.length - 1 || j === gy.length - 1
    return h(x, y) - (out ? 0.12 : 0)
  }
  // smooth-shaded: each grid point takes the mean of the faces round it, so
  // the barrels read round and the file stays small
  const P = (i: number, j: number): V3 => [gx[i], gy[j], zr(i, j)]
  const tris: Array<[number[], number[], number[]]> = []
  for (let i = 0; i < gx.length - 1; i++)
    for (let j = 0; j < gy.length - 1; j++) {
      // split each cell along the diagonal nearer the true surface at its centre
      const cx = (gx[i] + gx[i + 1]) / 2, cy = (gy[j] + gy[j + 1]) / 2, hc = h(cx, cy)
      const d1 = Math.abs((zr(i, j) + zr(i + 1, j + 1)) / 2 - hc), d2 = Math.abs((zr(i + 1, j) + zr(i, j + 1)) / 2 - hc)
      if (d1 <= d2) tris.push([[i, j], [i + 1, j], [i + 1, j + 1]], [[i, j], [i + 1, j + 1], [i, j + 1]])
      else tris.push([[i, j], [i + 1, j], [i, j + 1]], [[i + 1, j], [i + 1, j + 1], [i, j + 1]])
    }
  const acc = new Map<string, V3>()
  for (const t of tris) {
    const [a, b, c] = t.map(([i, j]) => P(i, j))
    const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const f: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    for (const [i, j] of t) { const k = `${i},${j}`; const q = acc.get(k) ?? [0, 0, 0]; acc.set(k, [q[0] + f[0], q[1] + f[1], q[2] + f[2]]) }
  }
  for (const t of tris) roof.tri(P(t[0][0], t[0][1]), P(t[1][0], t[1][1]), P(t[2][0], t[2][1]), undefined, undefined, undefined, t.map(([i, j]) => unit(acc.get(`${i},${j}`)!)) as V3[])
  // rim: a fascia under the roof's outer edge, and the underside back to the wall
  const rim = edge ?? roof, t = 0.3
  const ring: Array<[number, number]> = []
  for (let i = 0; i < gx.length; i++) ring.push([i, 0])
  for (let j = 1; j < gy.length; j++) ring.push([gx.length - 1, j])
  for (let i = gx.length - 2; i >= 0; i--) ring.push([i, gy.length - 1])
  for (let j = gy.length - 2; j >= 1; j--) ring.push([0, j])
  for (let k = 0; k < ring.length; k++) {
    const [i0, j0] = ring[k], [i1, j1] = ring[(k + 1) % ring.length]
    const a: V3 = [gx[i0], gy[j0], zr(i0, j0)], b: V3 = [gx[i1], gy[j1], zr(i1, j1)]
    const out: V3 = [(a[0] + b[0]) / 2 - (X0 + X1) / 2, (a[1] + b[1]) / 2 - (Y0 + Y1) / 2, 0]
    const ax = Math.abs(out[0]) / (X1 - X0), ay = Math.abs(out[1]) / (Y1 - Y0)
    const dirOut: V3 = ax > ay ? [Math.sign(out[0]), 0, 0] : [0, Math.sign(out[1]), 0]
    quadOut(rim, [a[0], a[1], a[2] - t], [b[0], b[1], b[2] - t], b, a, dirOut)
    // underside: from the fascia's foot in to the wall line
    const ai: V3 = [Math.min(X1, Math.max(X0, a[0])), Math.min(Y1, Math.max(Y0, a[1])), 0]
    const bi: V3 = [Math.min(X1, Math.max(X0, b[0])), Math.min(Y1, Math.max(Y0, b[1])), 0]
    ai[2] = h(ai[0], ai[1]) - 0.05; bi[2] = h(bi[0], bi[1]) - 0.05
    if (o.underside !== false) quadOut(rim, [b[0], b[1], b[2] - t], [a[0], a[1], a[2] - t], ai, bi, [0, 0, -1])
  }
  // walls, their tops following the gables
  const side = (pts: XY[]) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1]
      wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], h(b[0], b[1])], [a[0], a[1], h(a[0], a[1])])
    }
  }
  const sx = samples(xb, n), sy = samples(yb, n)
  if (walls.s) side(sx.map((x) => [x, Y0] as XY))
  if (walls.e) side(sy.map((y) => [X1, y] as XY))
  if (walls.n) side([...sx].reverse().map((x) => [x, Y1] as XY))
  if (walls.w) side([...sy].reverse().map((y) => [X0, y] as XY))
  return h
}

/** A vertical cylinder (smooth), optionally capped. */
export function cylinder(p: Part, c: XY, z0: number, z1: number, r: number, n = 16, cap = false, a0 = 0) {
  lathe(p, [[r, z0], [r, z1]], n, c, a0)
  if (cap) lathe(p, [[r, z1], [0, z1]], n, c, a0, false)
}

/**
 * A round-headed panel (a window, a door, a fresco), flush on a wall: `o`
 * is the middle of its sill, `u` the wall's horizontal direction, `nrm` its
 * outward normal. Set 4 cm proud of the wall.
 */
export function archPanel(p: Part, o: V3, u: V3, nrm: V3, w: number, jamb: number, seg = 8, off = 0.04) {
  const pts: XY[] = [[-w / 2, 0], [w / 2, 0], [w / 2, jamb]]
  for (let k = 1; k < seg; k++) { const t = (Math.PI * k) / seg; pts.push([(w / 2) * Math.cos(t), jamb + (w / 2) * Math.sin(t)]) }
  pts.push([-w / 2, jamb])
  const uu = unit(u), nn = unit(nrm)
  // planar's normal is su x tv; flip u if needed so it faces out
  const zc = [0, 0, 1] as V3
  const cr: V3 = [uu[1] * zc[2] - uu[2] * zc[1], uu[2] * zc[0] - uu[0] * zc[2], uu[0] * zc[1] - uu[1] * zc[0]]
  const su = cr[0] * nn[0] + cr[1] * nn[1] + cr[2] * nn[2] >= 0 ? uu : ([-uu[0], -uu[1], -uu[2]] as V3)
  planar(p, add(o, nn, off), su, zc, pts)
}

/** A plain rectangle panel flush on a wall, as archPanel. */
export function rectPanel(p: Part, o: V3, u: V3, nrm: V3, w: number, hgt: number, off = 0.04) {
  const nn = unit(nrm), uu = unit(u), zc: V3 = [0, 0, 1]
  const cr: V3 = [uu[1], -uu[0], 0]
  const su = cr[0] * nn[0] + cr[1] * nn[1] >= 0 ? uu : ([-uu[0], -uu[1], -uu[2]] as V3)
  planar(p, add(o, nn, off), su, zc, [[-w / 2, 0], [w / 2, 0], [w / 2, hgt], [-w / 2, hgt]])
}

/** A curved panel following the top of a segmental gable: the tympanum under a zakomara. */
export function tympanum(p: Part, o: V3, u: V3, nrm: V3, span: number, rise: number, below: number, inset = 0.35, seg = 8) {
  const a = -span / 2 + inset, b = span / 2 - inset
  const pts: XY[] = [[a, -below], [b, -below]]
  for (let k = 0; k <= seg; k++) {
    const x = b - ((b - a) * k) / seg
    pts.push([x, Math.max(0, arcAt(x, -span / 2, span / 2, rise) - inset)])
  }
  const nn = unit(nrm), uu = unit(u), zc: V3 = [0, 0, 1]
  const cr: V3 = [uu[1], -uu[0], 0]
  const su = cr[0] * nn[0] + cr[1] * nn[1] >= 0 ? uu : ([-uu[0], -uu[1], -uu[2]] as V3)
  planar(p, add(o, nn, 0.04), su, zc, pts.filter((q, i) => i === 0 || Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) > 1e-4))
}

/**
 * A drum: a cylinder from z0 to z1 with round-headed slit windows on every
 * `every`-th facet, a cornice ring at its top and, optionally, a ring of
 * kokoshnik gables at its foot.
 */
export function drum(o: {
  wall: Part; win?: Part; trim?: Part; c: XY; z0: number; z1: number; r: number; n?: number
  windows?: number; winW?: number; winH?: number; sill?: number; cornice?: number
}) {
  const n = o.n ?? 16, a0 = Math.PI / n
  cylinder(o.wall, o.c, o.z0, o.z1, o.r, n, false, 0)
  const k = o.cornice ?? 0.3
  if (k > 0) lathe(o.trim ?? o.wall, [[o.r, o.z1 - 0.7], [o.r + k, o.z1 - 0.45], [o.r + k, o.z1]], n, o.c, 0)
  if (o.win && o.windows) {
    const step = n / o.windows, fr = o.r * Math.cos(Math.PI / n)
    for (let i = 0; i < o.windows; i++) {
      const t = a0 + (2 * Math.PI * Math.round(i * step)) / n
      const nn: V3 = [Math.cos(t), Math.sin(t), 0]
      const base: V3 = [o.c[0] + fr * nn[0], o.c[1] + fr * nn[1], o.sill ?? o.z0 + 1]
      archPanel(o.win, base, [-nn[1], nn[0], 0], nn, o.winW ?? 0.6, o.winH ?? 2.2, 6)
    }
  }
}

export type DomeShape = 'helmet' | 'fullhelmet' | 'onion' | 'bulb' | 'tent'

const PROFILES: Record<Exclude<DomeShape, 'tent'>, Array<[number, number]>> = {
  // Assumption's helmet: barely wider than its drum, a long taper.
  helmet: [[1.0, 0], [1.06, 0.1], [1.08, 0.22], [1.05, 0.35], [0.96, 0.48], [0.8, 0.61], [0.58, 0.74], [0.35, 0.85], [0.16, 0.94], [0.06, 1]],
  // A fuller helmet, its shoulders swelling past the drum (the Assumption's).
  fullhelmet: [[1.0, 0], [1.09, 0.1], [1.13, 0.22], [1.12, 0.35], [1.04, 0.48], [0.88, 0.61], [0.64, 0.74], [0.38, 0.85], [0.17, 0.94], [0.06, 1]],
  // A full onion: swells well past its drum and draws to a point.
  onion: [[0.82, 0], [0.94, 0.07], [1.0, 0.17], [1.02, 0.29], [0.97, 0.42], [0.84, 0.56], [0.64, 0.69], [0.42, 0.8], [0.24, 0.89], [0.11, 0.96], [0.05, 1]],
  // A rounder, lower onion (Archangel's silver heads, the Twelve Apostles).
  bulb: [[0.9, 0], [0.98, 0.1], [1.0, 0.24], [0.96, 0.4], [0.84, 0.56], [0.65, 0.71], [0.43, 0.83], [0.22, 0.93], [0.08, 0.99], [0.05, 1]],
}

/**
 * A dome on a drum top at z0: its bulb `H` tall with widest radius `R`, then
 * a spike `spike` tall. Returns the spike's top.
 */
export function dome(p: Part, c: XY, z0: number, R: number, H: number, shape: DomeShape, n = 16, spike = 0.8, rFoot?: number, coarse = false) {
  if (shape === 'tent') {
    lathe(p, [[R, z0], [0.08, z0 + H], [0, z0 + H + spike]], n, c, 0, false)
    return z0 + H + spike
  }
  const base = PROFILES[shape].filter((_, i, a) => !coarse || i % 2 === 0 || i === a.length - 1)
  const prof: Array<[number, number]> = base.map(([r, z]) => [r * R, z0 + z * H])
  if (rFoot !== undefined) prof.unshift([rFoot, z0 - 0.25])
  prof.push([0.035 * R + 0.04, z0 + H + spike * 0.7], [0, z0 + H + spike])
  lathe(p, prof, n, c)
  return z0 + H + spike
}

/** An Orthodox cross: a post with a crossbar and a slanted foot bar, bars along `along`. */
export function cross(p: Part, c: XY, z: number, L: number, along: 'x' | 'y' = 'y', w = 0.22) {
  const d: V3 = along === 'x' ? [1, 0, 0] : [0, 1, 0]
  const at = (s: number, h: number): V3 => [c[0] + d[0] * s, c[1] + d[1] * s, z + h]
  const bar = (a: V3, b: V3) => beam(p, a, b, w, w)
  bar(at(0, 0), at(0, L))
  bar(at(-0.27 * L, 0.72 * L), at(0.27 * L, 0.72 * L))
  bar(at(-0.18 * L, 0.33 * L), at(0.18 * L, 0.42 * L))
}

/** A square member from a to b (thin crosses, posts). */
export function beam(p: Part, a: V3, b: V3, w: number, h = w) {
  const u = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(u[2]) > 0.95 ? [1, 0, 0] : [0, 0, 1]
  const s = unit([u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]])
  const t: V3 = [s[1] * u[2] - s[2] * u[1], s[2] * u[0] - s[0] * u[2], s[0] * u[1] - s[1] * u[0]]
  const C = (o: V3, i: number): V3 => {
    const [cs, ct] = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [o[0] + s[0] * (w / 2) * cs + t[0] * (h / 2) * ct, o[1] + s[1] * (w / 2) * cs + t[1] * (h / 2) * ct, o[2] + s[2] * (w / 2) * cs + t[2] * (h / 2) * ct]
  }
  const A = [0, 1, 2, 3].map((i) => C(a, i)), B = [0, 1, 2, 3].map((i) => C(b, i))
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(A[i], A[j], B[j], B[i]) }
  p.quad(A[3], A[2], A[1], A[0]); p.quad(B[0], B[1], B[2], B[3])
}

/**
 * An apse: half an elliptic cylinder standing on a wall at x = c[0], bulging
 * towards `dir` (+1 east, -1 west) by `rx`, `ry` to either side, from z0 to z1,
 * under a half-dome roof. One round-headed window in its middle if `win`.
 */
export function apse(o: {
  wall: Part; roof: Part; win?: Part; c: XY; rx: number; ry: number; z0: number; z1: number
  dir?: 1 | -1; seg?: number; roofRise?: number; winW?: number; winH?: number; sill?: number; ov?: number
}) {
  const seg = o.seg ?? 8, dir = o.dir ?? 1, ov = o.ov ?? 0.3
  const P = (t: number, r: number, z: number): V3 => [o.c[0] + dir * (o.rx + r) * Math.cos(t), o.c[1] + (o.ry + r) * Math.sin(t), z]
  const ts = Array.from({ length: seg + 1 }, (_, k) => -Math.PI / 2 + (Math.PI * k) / seg)
  const ord = dir > 0 ? ts : [...ts].reverse()
  for (let k = 0; k < seg; k++) {
    const a = ord[k], b = ord[k + 1]
    o.wall.quad(P(a, 0, o.z0), P(b, 0, o.z0), P(b, 0, o.z1), P(a, 0, o.z1))
  }
  // half dome over it, from a slight overhang
  const rise = o.roofRise ?? Math.min(o.rx, o.ry) * 0.8
  const rings = 4
  const R = (i: number) => { const f = Math.cos((Math.PI / 2) * (i / rings)); return { r: (ov + Math.max(o.rx, o.ry)) * f, z: o.z1 + rise * Math.sin((Math.PI / 2) * (i / rings)), f } }
  for (let i = 0; i < rings; i++) {
    const A = R(i), B = R(i + 1)
    for (let k = 0; k < seg; k++) {
      const a = ord[k], b = ord[k + 1]
      const q = (t: number, f: number, z: number): V3 => [o.c[0] + dir * (o.rx + ov) * f * Math.cos(t), o.c[1] + (o.ry + ov) * f * Math.sin(t), z]
      const a0 = q(a, A.f, A.z - (i === 0 ? 0.1 : 0)), b0 = q(b, A.f, A.z - (i === 0 ? 0.1 : 0)), a1 = q(a, B.f, B.z), b1 = q(b, B.f, B.z)
      if (i === rings - 1) o.roof.tri(a0, b0, a1)
      else o.roof.quad(a0, b0, b1, a1)
    }
  }
  // the rim under the overhang
  for (let k = 0; k < seg; k++) {
    const a = ord[k], b = ord[k + 1]
    const q = (t: number, r: number, z: number): V3 => [o.c[0] + dir * (o.rx + r) * Math.cos(t), o.c[1] + (o.ry + r) * Math.sin(t), z]
    o.roof.quad(q(a, ov, o.z1 - 0.35), q(b, ov, o.z1 - 0.35), q(b, ov, o.z1 - 0.1), q(a, ov, o.z1 - 0.1))
    quadOut(o.roof, q(b, ov, o.z1 - 0.35), q(a, ov, o.z1 - 0.35), q(a, 0, o.z1 - 0.3), q(b, 0, o.z1 - 0.3), [0, 0, -1])
  }
  if (o.win) {
    const nn: V3 = [dir, 0, 0]
    archPanel(o.win, [o.c[0] + dir * o.rx, o.c[1], o.sill ?? o.z0 + (o.z1 - o.z0) * 0.35], [0, 1, 0], nn, o.winW ?? 0.8, o.winH ?? 2.4, 6, 0.06)
  }
  return o.z1 + rise
}

/** An axis-aligned box from (x0, y0, z0) to (x1, y1, z1), all six faces. */
export function block(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, top: Part | null = p, bevel = 0) {
  box(p, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], (x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2, 0, top, bevel)
}

/** A triangle wound so it faces along `out`. */
export function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A quad wound so it faces along `out`. */
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0]
  if (nx * out[0] + ny * out[1] + nz * out[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/**
 * A barrel-topped block: walls from z0 to the springing zs over the rectangle,
 * a segmental barrel (half-round by default) with its axis along `axis` on
 * top, drawn in `roof`, and the two gable ends in `wall`.
 */
export function barrelBlock(wall: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, z0: number, zs: number, axis: 'x' | 'y', rise?: number, seg = 8, ov = 0) {
  const span = axis === 'x' ? y1 - y0 : x1 - x0
  const r = rise ?? span / 2
  const at = (s: number) => arcAt(s, 0, span, r)
  const ss = Array.from({ length: seg + 1 }, (_, k) => (span * k) / seg)
  const UP: V3 = [0, 0, 1]
  if (axis === 'x') {
    for (let k = 0; k < seg; k++) {
      const a = ss[k], b = ss[k + 1]
      quadOut(roof, [x0 - ov, y0 + a, zs + at(a)], [x0 - ov, y0 + b, zs + at(b)], [x1 + ov, y0 + b, zs + at(b)], [x1 + ov, y0 + a, zs + at(a)], UP)
    }
    quadOut(wall, [x0, y0, z0], [x1, y0, z0], [x1, y0, zs], [x0, y0, zs], [0, -1, 0])
    quadOut(wall, [x0, y1, z0], [x1, y1, z0], [x1, y1, zs], [x0, y1, zs], [0, 1, 0])
    endWall(wall, [x1, y0], [0, 1, 0], [1, 0, 0], z0, zs, at, ss)
    endWall(wall, [x0, y0], [0, 1, 0], [-1, 0, 0], z0, zs, at, ss)
  } else {
    for (let k = 0; k < seg; k++) {
      const a = ss[k], b = ss[k + 1]
      quadOut(roof, [x0 + a, y0 - ov, zs + at(a)], [x0 + a, y1 + ov, zs + at(a)], [x0 + b, y1 + ov, zs + at(b)], [x0 + b, y0 - ov, zs + at(b)], UP)
    }
    quadOut(wall, [x0, y0, z0], [x0, y1, z0], [x0, y1, zs], [x0, y0, zs], [-1, 0, 0])
    quadOut(wall, [x1, y0, z0], [x1, y1, z0], [x1, y1, zs], [x1, y0, zs], [1, 0, 0])
    endWall(wall, [x0, y0], [1, 0, 0], [0, -1, 0], z0, zs, at, ss)
    endWall(wall, [x0, y1], [1, 0, 0], [0, 1, 0], z0, zs, at, ss)
  }
}

/** A gable end: wall from z0 up to the arch, starting at `o` and running along `u`, facing `nrm`. */
function endWall(wall: Part, o: XY, u: V3, nrm: V3, z0: number, zs: number, at: (s: number) => number, ss: number[]) {
  for (let k = 0; k < ss.length - 1; k++) {
    const a = ss[k], b = ss[k + 1]
    const A: XY = [o[0] + u[0] * a, o[1] + u[1] * a], B: XY = [o[0] + u[0] * b, o[1] + u[1] * b]
    quadOut(wall, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], zs + at(b)], [A[0], A[1], zs + at(a)], nrm)
  }
}

/** Floodlight shares: walls lit, tops barely; domes lit. */
export const floodWalls = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.75)
export const floodDomes = (_p: V3, n: V3) => (n[2] > 0.85 ? 0.4 : 0.65)

/** Write the GLB, check the budget and print a line. */
export async function finishModel(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, meta: Record<string, unknown>, limit = 6500) {
  if (process.env.PARTS) console.log(parts.map((q) => `${q.material.name}:${q.part.triangles}`).join(' '))
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...meta })
  const tris = report(name, parts, glb, limit)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}

/**
 * A hood over a round-headed opening: a band `w` wide following a
 * semicircle of radius r about `o` (the centre of the springing line),
 * standing `depth` proud of the wall. `u` runs along the wall, `nrm` out.
 */
export function hood(p: Part, o: V3, u: V3, nrm: V3, r: number, w: number, depth: number, seg = 8, front: Part = p) {
  const at = (t: number, rr: number, d: number): V3 => [
    o[0] + u[0] * rr * Math.cos(t) + nrm[0] * d, o[1] + u[1] * rr * Math.cos(t) + nrm[1] * d, o[2] + rr * Math.sin(t),
  ]
  for (let k = 0; k < seg; k++) {
    const a = (Math.PI * k) / seg, b = (Math.PI * (k + 1)) / seg, m = (a + b) / 2
    const radial: V3 = [u[0] * Math.cos(m), u[1] * Math.cos(m), Math.sin(m)]
    quadOut(p, at(a, r + w, 0), at(b, r + w, 0), at(b, r + w, depth), at(a, r + w, depth), radial)
    quadOut(p, at(a, r, 0), at(b, r, 0), at(b, r, depth), at(a, r, depth), [-radial[0], -radial[1], -radial[2]])
    quadOut(front, at(a, r, depth), at(b, r, depth), at(b, r + w, depth), at(a, r + w, depth), nrm)
  }
  // feet
  for (const t of [0, Math.PI]) quadOut(p, at(t, r, 0), at(t, r + w, 0), at(t, r + w, depth), at(t, r, depth), [0, 0, -1])
}

/**
 * A scallop shell filling a round gable (the Archangel Cathedral's
 * zakomary): a half-disc of radius r about `o` on a wall facing `nrm`,
 * its ribs drawn as a fan of facets alternately standing `depth` proud and
 * sitting back, so they catch the light like the carved flutes.
 */
export function shell(p: Part, o: V3, u: V3, nrm: V3, r: number, ribs = 9, depth = 0.3) {
  const nn = unit(nrm), uu = unit(u)
  const at = (t: number, rr: number, d: number): V3 => [
    o[0] + uu[0] * rr * Math.cos(t) + nn[0] * d, o[1] + uu[1] * rr * Math.cos(t) + nn[1] * d, o[2] + rr * Math.sin(t),
  ]
  const hub = at(0, 0, 0.05)
  for (let k = 0; k < ribs; k++) {
    const a = (Math.PI * k) / ribs, b = (Math.PI * (k + 1)) / ribs, m = (a + b) / 2
    // each flute: two facets meeting along a ridge out at `depth`
    const ridge = at(m, r, depth)
    const fa = at(a, r, 0.05), fb = at(b, r, 0.05)
    triOut(p, hub, fa, ridge, nn); triOut(p, hub, ridge, fb, nn)
    // close the flute's outer edge back to the wall
    triOut(p, fa, fb, ridge, [Math.cos(m) * uu[0], Math.cos(m) * uu[1], Math.sin(m)])
  }
}

/** A wedge buttress: a rectangle in plan, its top sloping from zHigh along one edge down to zLow at the opposite one. */
export function wedge(p: Part, x0: number, y0: number, x1: number, y1: number, zHigh: number, zLow: number, highAt: 'x0' | 'x1' | 'y0' | 'y1', top: Part = p) {
  const z = (x: number, y: number) => {
    const t = highAt === 'x0' ? (x - x0) / (x1 - x0) : highAt === 'x1' ? (x1 - x) / (x1 - x0) : highAt === 'y0' ? (y - y0) / (y1 - y0) : (y1 - y) / (y1 - y0)
    return zHigh + (zLow - zHigh) * t
  }
  const c: Array<[number, number]> = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const outs: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    quadOut(p, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z(b[0], b[1])], [a[0], a[1], z(a[0], a[1])], outs[i])
  }
  quadOut(top, [x0, y0, z(x0, y0)], [x1, y0, z(x1, y0)], [x1, y1, z(x1, y1)], [x0, y1, z(x0, y1)], [0, 0, 1])
}

/**
 * A kokoshnik: a free-standing keel-arched gable, `w` wide, its half-round
 * shoulders rising `w / 2` and drawn up into a keel `keel` higher, standing
 * on a cornice at o (the middle of its foot), facing `nrm`. The face and
 * back are drawn in `face`; the curved top, `t` thick, in `edge` (the
 * gilded roofing that follows the keel).
 */
export function kokoshnik(face: Part, edge: Part | null, o: V3, u: V3, nrm: V3, w: number, keel: number, t = 0.35, seg = 8) {
  const nn = unit(nrm), uu = unit(u)
  const r = w / 2
  const prof: XY[] = []
  for (let k = 0; k <= seg; k++) {
    const a = Math.PI - (Math.PI * k) / seg, x = r * Math.cos(a)
    prof.push([x, r * Math.sin(a) + keel * Math.max(0, 1 - Math.abs(x) / (0.35 * w)) ** 1.5])
  }
  const outline: XY[] = [[-r, 0], ...prof.slice(1, -1), [r, 0]]
  const zc: V3 = [0, 0, 1]
  const cr: V3 = [uu[1], -uu[0], 0]
  const su = cr[0] * nn[0] + cr[1] * nn[1] >= 0 ? uu : ([-uu[0], -uu[1], 0] as V3)
  planar(face, add(o, nn, t / 2), su, zc, outline)
  planar(face, add(o, nn, -t / 2), [-su[0], -su[1], 0], zc, outline)
  if (edge) {
    const P = (q: XY, s: number): V3 => [o[0] + uu[0] * q[0] + nn[0] * s, o[1] + uu[1] * q[0] + nn[1] * s, o[2] + q[1]]
    for (let k = 0; k < prof.length - 1; k++) {
      const a = prof[k], b = prof[k + 1]
      const out: V3 = [uu[0] * (b[1] - a[1]) * -1 + 0, uu[1] * (b[1] - a[1]) * -1, b[0] - a[0]]
      quadOut(edge, P(a, -t / 2 - 0.08), P(b, -t / 2 - 0.08), P(b, t / 2 + 0.08), P(a, t / 2 + 0.08), [-out[0], -out[1], -out[2]].map((v) => -v) as V3)
    }
  }
}

/** A pyramid roof over a rectangle from z up to an apex `rise` higher (a hip when the rectangle is long). */
export function pyramidRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, ov = 0.2) {
  x0 -= ov; y0 -= ov; x1 += ov; y1 += ov
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z + rise]
  const q: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  const outs: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let i = 0; i < 4; i++) triOut(p, q[i], q[(i + 1) % 4], c, outs[i])
  quadOut(p, q[0], q[1], q[2], q[3], [0, 0, -1])
}
