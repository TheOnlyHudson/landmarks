/**
 * Shared facade kit for the berlin-* models: orthogonal rings, faces,
 * panels, arches and the `welded` re-shader. Moved out of the first
 * berlin-reichstag generator when that model was replaced, so the other
 * Berlin generators keep building unchanged. CC0-1.0.
 */
import { Part, addGltfTriangles, type V3 } from './mesh'
import { tube } from './nyc-columbus-monument'
import { type Q } from './london-albert-memorial'

export type XY = [number, number]

/** Signed area (positive = counter-clockwise from above). */
export const ringArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Make a ring counter-clockwise from above. */
export const ccw = (r: XY[]) => (ringArea(r) < 0 ? [...r].reverse() : r)

/** Offset a counter-clockwise ring outward by d (exact for right angles, mitred otherwise). */
export function ringOffset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((v, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const e1 = [v[0] - a[0], v[1] - a[1]], e2 = [b[0] - v[0], b[1] - v[1]]
    const l1 = Math.hypot(e1[0], e1[1]) || 1, l2 = Math.hypot(e2[0], e2[1]) || 1
    const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [v[0] + d * (n1[0] + n2[0]) / k, v[1] + d * (n1[1] + n2[1]) / k] as XY
  })
}

const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

/** Walls of a counter-clockwise ring from z0 to z1, facing out (or in, for a court). */
export function ringLoft(p: Part, r: XY[], z0: number, z1: number, inward = false) {
  const rr = inward ? [...r].reverse() : r
  p.loft([at(rr, z0), at(rr, z1)])
}

/** A flat band between two offsets of the same ring (a ledge top, a soffit). */
export function ringBand(p: Part, inner: XY[], outer: XY[], z: number, up: boolean) {
  const n = inner.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [inner[i][0], inner[i][1], z], b: V3 = [outer[i][0], outer[i][1], z], c: V3 = [outer[j][0], outer[j][1], z], d: V3 = [inner[j][0], inner[j][1], z]
    if (up) p.quad(a, b, c, d)
    else p.quad(a, d, c, b)
  }
}

/** A wall face: from a to b along a counter-clockwise ring, outward on the right. */
export type Face = { a: XY; b: XY }
export const faceOf = (a: XY, b: XY): Face => ({ a, b })
export const flen = (f: Face) => Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
/** Point s along the face, z up, d out from it. */
export const fp = (f: Face, s: number, z: number, d: number): V3 => {
  const L = flen(f), ux = (f.b[0] - f.a[0]) / L, uy = (f.b[1] - f.a[1]) / L
  return [f.a[0] + ux * s + uy * d, f.a[1] + uy * s - ux * d, z]
}

/** A flat panel on a face, d proud of it. */
export function fpanel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  p.quad(fp(f, s0, z0, d), fp(f, s1, z0, d), fp(f, s1, z1, d), fp(f, s0, z1, d))
}

/** A round-headed panel: jambs to zs, a true semicircle above. */
export function farch(p: Part, f: Face, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 8) {
  const r = w / 2
  fpanel(p, f, sc - r, sc + r, z0, zs, d)
  const c = fp(f, sc, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n
    p.tri(c, fp(f, sc + r * Math.cos(a0), zs + r * Math.sin(a0), d), fp(f, sc + r * Math.cos(a1), zs + r * Math.sin(a1), d))
  }
}

/** A block standing on a face: front, ends, top (and soffit). */
export function fblock(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, o: { bottom?: boolean; top?: boolean; ends?: boolean } = {}) {
  const P = (s: number, z: number, d: number) => fp(f, s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1))
  if (o.top !== false) p.quad(P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0), P(s0, z1, d0))
  if (o.ends !== false) {
    p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0))
    p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1))
  }
  if (o.bottom) p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1))
}

/** A triangular gable block on a face: base s0..s1 at z0, apex h higher, d0..d1 out. */
export function fgable(p: Part, f: Face, s0: number, s1: number, z0: number, h: number, d0: number, d1: number, back = false) {
  const sm = (s0 + s1) / 2, P = (s: number, z: number, d: number) => fp(f, s, z, d)
  p.tri(P(s0, z0, d1), P(s1, z0, d1), P(sm, z0 + h, d1))
  if (back) p.tri(P(s1, z0, d0), P(s0, z0, d0), P(sm, z0 + h, d0))
  p.quad(P(s1, z0, d1), P(s1, z0, d0), P(sm, z0 + h, d0), P(sm, z0 + h, d1))
  p.quad(P(sm, z0 + h, d1), P(sm, z0 + h, d0), P(s0, z0, d0), P(s0, z0, d1))
}

/** An engaged half column on a face (detail) or a flat pilaster (low). */
export function engaged(p: Part, f: Face, s: number, z0: number, z1: number, r: number, round: boolean, n = 8) {
  if (!round) return fblock(p, f, s - r, s + r, z0, z1, 0, r * 0.7, { top: false })
  const ring = (z: number, rr: number): V3[] => Array.from({ length: n + 1 }, (_, i) => fp(f, s + rr * Math.cos(Math.PI * i / n), z, rr * Math.sin(Math.PI * i / n)))
  const a = ring(z0, r), b = ring(z1, r * 0.92)
  for (let i = 0; i < n; i++) p.quad(a[i + 1], a[i], b[i], b[i + 1])
}

/**
 * The standard Wallot bay, centred at s on a face: a small arched window in
 * the rusticated base, a round-arched window and a pedimented window over it.
 */
export function bayWindows(win: Part, trim: Part, f: Face, s: number, Q: Q, dBase: number) {
  const n = Q.detail ? 10 : 6
  if (Q.detail) farch(win, f, s, 1.5, 1.6, 3.4, dBase + 0.05, 8)
  else fpanel(win, f, s - 0.75, s + 0.75, 1.6, 4.0, 0.05)
  if (!Q.detail) farch(trim, f, s, 3.1, 7.3, 12.2, 0.03, 4)
  farch(win, f, s, 2.4, 7.6, 12.2, 0.05, n)
  fpanel(win, f, s - 0.95, s + 0.95, 15.6, 18.3, 0.05)
  if (Q.detail) {
    // Stone surrounds: the arch's archivolt and keystone, the upper window's sill and pediment.
    const arcPts: V3[] = []
    for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; arcPts.push(fp(f, s + 1.45 * Math.cos(a), 12.2 + 1.45 * Math.sin(a), 0.12)) }
    tube(trim, arcPts, arcPts.map(() => 0.16), 4)
    fblock(trim, f, s - 0.25, s + 0.25, 13.1, 13.9, 0, 0.22)
    fblock(trim, f, s - 1.25, s + 1.25, 7.3, 7.6, 0, 0.25, { bottom: true })
    fblock(trim, f, s - 1.2, s + 1.2, 15.3, 15.6, 0, 0.22, { bottom: true })
    for (const e of [-1, 1]) fblock(trim, f, s + e * 1.1 - 0.15, s + e * 1.1 + 0.15, 15.6, 18.5, 0, 0.14)
    fblock(trim, f, s - 1.35, s + 1.35, 18.4, 18.7, 0, 0.3, { bottom: true })
    fgable(trim, f, s - 1.35, s + 1.35, 18.7, 0.9, 0, 0.3)
  } else {
    const P = (u: number, z: number) => fp(f, u, z, 0.12)
    trim.tri(P(s - 1.25, 18.55), P(s + 1.25, 18.55), P(s, 19.35))
  }
}

/**
 * Re-shade a part smooth within `crease` degrees: coplanar and gently curved
 * neighbours then share their corners, which keeps the file small.
 */
export function welded(p: Part, crease = 35): Part {
  const q = new Part()
  addGltfTriangles(q, Float32Array.from(p.pos), Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
  return q
}
