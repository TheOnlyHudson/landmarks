/**
 * The Moscow Kremlin's towers and walls: a shared kit, procedural, CC0-1.0.
 *
 * Not a model itself: each tower (`moscow-kremlin-*-tower.ts`), the Kutafya
 * Tower, the Trinity Bridge and the three wall models import it and describe
 * their own tiers with it, so every tower is matched to its own photos while
 * the brick, the white trim, the green tile, the swallowtail merlons and the
 * gilt read the same across the set.
 *
 * Frame (as in `mesh.ts`): x east, y north, z up, metres, in each model's
 * turned frame (its placement's `bearing`), origin at its anchor on the
 * ground. A `Kit` may carry an `origin` offset, so a tower can be written
 * about its shaft's axis while its anchor stays at the OSM outline's centroid.
 *
 * Materials (six at most per model):
 * - `kremlin-brick`, the red brick, from daylight photos (#b5503f to
 *   #c2614c), pulled to the palette's lightness: #c4604c;
 * - `kremlin-white`, the whitewashed stone trim, string courses, Gothic
 *   tracery and pinnacles: #f1ebe0;
 * - `kremlin-green`, the glazed tile of the tents: most are a dark
 *   bottle green (#26372e to #34503f in the photos), pulled light to
 *   #456d5a; the Senate, Corner Arsenal, Borovitskaya and a few others
 *   have a bright green glaze (#3f9a5c to #4caf6a), pulled to #5c9f70;
 * - `kremlin-gold`, gilt vanes, balls and clock rims: #d6ae4c;
 * - `kremlin-opening`, the dark of windows, loopholes, gate arches and the
 *   clock faces: charcoal #4a4f57 (the openings are unlit at night: the
 *   towers are floodlit from outside, not lit from within);
 * - `neon-kremlin-star`, the ruby stars, lit red at night as they are.
 *
 * At night the brick, the white stone and the tents are floodlit
 * (`_FLOODLIGHT`), as in every night photo of the Kremlin.
 *
 * Simplifications shared by every model built with the kit:
 * - merlons are the Kremlin's swallowtail ("Ghibelline") shape, two horns
 *   and a V notch, 22 triangles each, without the loophole slits;
 * - windows and loopholes are flush dark panels with their real head shape
 *   (round, pointed, flat), never cut through;
 * - dormers on the tents are small gabled boxes with a dark window;
 * - the stars are two crossed five-point plates, so they read from every
 *   side (the real stars turn with the wind).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { ccw, earcut, offset, type XY } from './sf-de-young'

export type { XY }
export type Mat = 'brick' | 'white' | 'green' | 'gold' | 'dark' | 'star'
export type Plan = XY[]

const lit = (k: number) => (_p: V3, n: V3) => (n[2] > 0.95 ? 0.25 * k : k)
export const MATERIALS: Record<Mat, MaterialSpec> = {
  brick: { ...finish('kremlin-brick', 0xc4604c), floodlight: lit(0.9) },
  white: { ...finish('kremlin-white', 0xf1ebe0), floodlight: lit(0.9) },
  green: { ...finish('kremlin-green', 0x4b8a66), floodlight: lit(0.6) },
  gold: { ...finish('kremlin-gold', 0xd6ae4c, 0.4), floodlight: lit(0.6) },
  dark: finish('kremlin-opening', 0x4a4f57),
  star: finish('neon-kremlin-star', 0xc8283a, 0.4),
}

// ------------------------------------------------------------------ plans

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A w x d rectangle about c, corners chamfered by ch (0 for square), CCW. */
export function rect(w: number, d: number, ch = 0, c: XY = [0, 0]): Plan {
  const x0 = c[0] - w / 2, x1 = c[0] + w / 2, y0 = c[1] - d / 2, y1 = c[1] + d / 2
  if (ch <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
}
/** A regular n-gon of apothem a (the half-width across flats) about c, a flat face toward -y. */
export function ngon(n: number, a: number, c: XY = [0, 0]): Plan {
  const r = a / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, i) => {
    const t = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n
    return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)] as XY
  })
}
/** A circle as a 16-gon of radius r (round towers). */
export const circle = (r: number, c: XY = [0, 0], n = 16): Plan => ngon(n, r * Math.cos(Math.PI / n), c)
/** Grow (d > 0) or shrink a convex CCW plan by d, edge by edge. */
export const grow = (p: Plan, d: number): Plan => (d === 0 ? p : offset(ccw(p), d))
/** Scale a plan about its centroid. */
export function scalePlan(p: Plan, k: number): Plan {
  const c = centre(p)
  return p.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k])
}
export const centre = (p: Plan): XY => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length]
const edges = (p: Plan) => p.map((a, i) => [a, p[(i + 1) % p.length]] as [XY, XY])

// ------------------------------------------------------------------ the kit

export class Kit {
  P: Record<Mat, Part> = { brick: new Part(), white: new Part(), green: new Part(), gold: new Part(), dark: new Part(), star: new Part() }
  materials: Record<Mat, MaterialSpec>
  /** `tent` picks the tile: most tents are a dark green glaze, a few (Senate, Corner Arsenal, Borovitskaya) a bright one. */
  constructor(public origin: XY = [0, 0], o: { tent?: 'dark' | 'bright' | number; materials?: Partial<Record<Mat, MaterialSpec>> } = {}) {
    const c = o.tent === 'bright' ? 0x5c9f70 : o.tent === 'dark' || o.tent === undefined ? 0x456d5a : o.tent
    this.materials = { ...MATERIALS, green: { ...MATERIALS.green, color: c }, ...o.materials }
  }

  /** A point in the kit's frame (its origin added). */
  v(p: XY, z: number): V3 {
    return this.at(p, z)
  }
  private at(p: XY, z: number): V3 {
    return [p[0] + this.origin[0], p[1] + this.origin[1], z]
  }
  /** A triangle wound to face n. */
  tri(m: Mat, a: V3, b: V3, c: V3, n?: V3) {
    const g = cross3(sub3(b, a), sub3(c, a))
    if (Math.hypot(...g) < 1e-7) return
    if (n && dot3(g, n) < 0) this.P[m].tri(a, c, b)
    else this.P[m].tri(a, b, c)
  }
  quad(m: Mat, a: V3, b: V3, c: V3, d: V3, n?: V3) {
    this.tri(m, a, b, c, n)
    this.tri(m, a, c, d, n)
  }
  /** A flat polygon in plan at z, facing up (or down). */
  cap(m: Mat, plan: Plan, z: number, up = true) {
    const r = ccw(plan)
    for (const [i, j, k] of earcut(r)) this.tri(m, this.at(r[i], z), this.at(r[j], z), this.at(r[k], z), [0, 0, up ? 1 : -1])
  }

  /**
   * A loft through plan rings (same corner count, CCW) at heights; the top
   * is capped unless it is a point or `top` is false. A frustum, a batter,
   * a corbelled flare, a tent: everything round a tower is one of these.
   */
  loft(m: Mat, rings: { plan: Plan | XY; z: number }[], top = true, bottom = false) {
    const first = rings.find((r) => typeof r.plan[0] !== 'number')!.plan as Plan
    const n = first.length
    const pts = rings.map(({ plan, z }) => typeof plan[0] === 'number' ? Array.from({ length: n }, () => this.at(plan as XY, z)) : (ccw(plan as Plan)).map((p) => this.at(p, z)))
    const c = centre(first)
    const cz = (rings[0].z + rings[rings.length - 1].z) / 2
    const cc: V3 = this.at(c, cz)
    for (let k = 0; k + 1 < pts.length; k++) {
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const a = pts[k][i], b = pts[k][j], cT = pts[k + 1][j], d = pts[k + 1][i]
        const mid = mul(add(add(a, b), add(cT, d)), 0.25)
        const out: V3 = [mid[0] - cc[0], mid[1] - cc[1], 0]
        const nrm = cross3(sub3(b, a), sub3(d.every((v, q) => v === a[q]) ? cT : d, a))
        // Faces of a CCW ring lofted upward face out; a flare that turns down still does.
        this.tri(m, a, b, cT, dot3(nrm, out) >= 0 ? nrm : mul(nrm, -1))
        this.tri(m, a, cT, d, dot3(nrm, out) >= 0 ? nrm : mul(nrm, -1))
      }
    }
    const last = rings[rings.length - 1]
    if (top && typeof last.plan[0] !== 'number') this.cap(m, last.plan as Plan, last.z, true)
    if (bottom && typeof rings[0].plan[0] !== 'number') this.cap(m, rings[0].plan as Plan, rings[0].z, false)
  }
  /** A straight prism. */
  prism(m: Mat, plan: Plan, z0: number, z1: number, top = true) {
    this.loft(m, [{ plan, z: z0 }, { plan, z: z1 }], top)
  }
  /** A tapering shaft (batter): plan at z0, plan grown by `d` (negative to taper) at z1. */
  frustum(m: Mat, plan: Plan, z0: number, z1: number, d: number, top = true) {
    this.loft(m, [{ plan, z: z0 }, { plan: grow(plan, d), z: z1 }], top)
  }
  /** A band (string course, cornice) standing `out` proud of the plan. */
  band(m: Mat, plan: Plan, z0: number, z1: number, out = 0.15) {
    const g = grow(plan, out), p = ccw(plan)
    this.prism(m, g, z0, z1, false)
    // Only the ledge is capped, so the band never fights the cap of whatever it runs round.
    for (let i = 0; i < p.length; i++) {
      const j = (i + 1) % p.length
      this.quad(m, this.at(p[i], z1), this.at(g[i], z1), this.at(g[j], z1), this.at(p[j], z1), [0, 0, 1])
    }
  }
  /** A corbelled flare: the plan at z0 widening by `out` up to z1, then straight to z2. */
  flare(m: Mat, plan: Plan, z0: number, z1: number, z2: number, out: number) {
    const g = grow(plan, out)
    this.loft(m, [{ plan, z: z0 }, { plan: g, z: z1 }, { plan: g, z: z2 }])
  }
  /** A tent (hipped spire) from the plan at z0 to a point (or to `topPlan`) at z1. */
  tent(m: Mat, plan: Plan, z0: number, z1: number, topPlan?: Plan) {
    this.loft(m, [{ plan, z: z0 }, { plan: topPlan ?? centre(plan), z: z1 }], true)
  }
  /** A low hipped roof skirt: plan at z0 to the plan shrunk by `ins` at z1, capped. */
  skirt(m: Mat, plan: Plan, z0: number, z1: number, ins: number) {
    this.loft(m, [{ plan, z: z0 }, { plan: grow(plan, -ins), z: z1 }], true)
  }

  /**
   * Swallowtail merlons standing on the plan's edges at z, outer faces flush
   * with the edges: width w, height h, thickness t, one every `pitch` metres,
   * centred on each edge and kept clear of the corners. `skip(p)` leaves out
   * any merlon whose centre it returns true for.
   */
  merlons(plan: Plan, z: number, o: { w?: number; h?: number; t?: number; pitch?: number; skip?: (p: XY) => boolean; m?: Mat } = {}) {
    const { w = 1.2, h = 2.3, t = 0.7, pitch = 2.0, m = 'brick' } = o
    for (const [a, b] of edges(ccw(plan))) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = Math.floor((L - t * 2 + (pitch - w)) / pitch)
      if (n < 1) continue
      const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const span = (n - 1) * pitch
      for (let k = 0; k < n; k++) {
        const s = L / 2 - span / 2 + k * pitch
        const c: XY = [a[0] + e[0] * s, a[1] + e[1] * s]
        if (o.skip?.(c)) continue
        this.merlon(c, e, z, w, h, t, m)
      }
    }
  }
  /** One merlon centred at c (plan) on its outer face, running along e (unit, CCW along the plan), on z. */
  merlon(c: XY, e: XY, z: number, w: number, h: number, t: number, m: Mat = 'brick') {
    const nOut: V3 = [e[1], -e[0], 0]
    const hw = 0.3 * w, nd = 0.36 * h
    const prof: [number, number][] = [[-w / 2, 0], [w / 2, 0], [w / 2, h], [w / 2 - hw, h], [0, h - nd], [-w / 2 + hw, h], [-w / 2, h]]
    const P = (u: number, v: number, back: number): V3 => this.at([c[0] + e[0] * u - nOut[0] * back, c[1] + e[1] * u - nOut[1] * back], z + v)
    const F = prof.map(([u, v]) => P(u, v, 0)), B = prof.map(([u, v]) => P(u, v, t))
    const back = mul(nOut, -1)
    for (const [i, j, k] of [[0, 1, 4], [1, 2, 3], [1, 3, 4], [0, 4, 5], [0, 5, 6]]) {
      this.tri(m, F[i], F[j], F[k], nOut)
      this.tri(m, B[i], B[j], B[k], back)
    }
    for (let i = 1; i < prof.length; i++) {
      const j = (i + 1) % prof.length
      const du = prof[j][0] - prof[i][0], dv = prof[j][1] - prof[i][1]
      const n: V3 = add(mul([e[0], e[1], 0], dv), [0, 0, -du])
      this.quad(m, F[i], F[j], B[j], B[i], n)
    }
  }

  /** `count` merlons round a circle of radius r about c, outer faces on the circle, standing on z. */
  merlonRing(c: XY, r: number, z: number, count: number, o: { w?: number; h?: number; t?: number; m?: Mat } = {}) {
    const { w = 0.9, h = 1.6, t = 0.45, m = 'brick' } = o
    for (let i = 0; i < count; i++) {
      const a = (2 * Math.PI * (i + 0.5)) / count
      const p: XY = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
      this.merlon(p, [-Math.sin(a), Math.cos(a)], z, w, h, t, m)
    }
  }
  /** A profile of plans at heights, lofted: a round or square shaft with its batter, corbels and bands in one go. */
  shaft(m: Mat, rings: [Plan, number][], top = true) {
    this.loft(m, rings.map(([plan, z]) => ({ plan, z })), top)
  }
  /**
   * Flush panels on the vertical faces of a plan between z0 and z1: windows,
   * loopholes, arcades, gate arches. `per` per face (or one per `pitch`
   * metres), each `w` wide, with a round, pointed or flat head; `frame`
   * puts a pale surround `frame` metres wide behind each. `faces` picks
   * which edges (by index) get them.
   */
  openings(plan: Plan, z0: number, z1: number, o: { per?: number; pitch?: number; w: number; head?: 'round' | 'pointed' | 'flat'; m?: Mat; frame?: number; frameMat?: Mat; faces?: number[]; minEdge?: number; proud?: number }) {
    const { head = 'round', m = 'dark', frameMat = 'white', proud = 0.05 } = o
    edges(ccw(plan)).forEach(([a, b], idx) => {
      if (o.faces && !o.faces.includes(idx)) return
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < (o.minEdge ?? o.w + 0.3)) return
      const n = o.per ?? Math.max(1, Math.floor(L / (o.pitch ?? L)))
      const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      for (let k = 0; k < n; k++) {
        const s = (L * (k + 0.5)) / n
        const c: XY = [a[0] + e[0] * s, a[1] + e[1] * s]
        if (o.frame) this.panel(c, e, z0 - o.frame, z1 + o.frame, o.w + 2 * o.frame, head, frameMat, proud * 0.5)
        this.panel(c, e, z0, z1, o.w, head, m, proud)
      }
    })
  }
  /** A flush panel on a face: bottom centre c on the face line, along e, z0 to z1 at its crown. */
  panel(c: XY, e: XY, z0: number, z1: number, w: number, head: 'round' | 'pointed' | 'flat', m: Mat, proud = 0.05) {
    const nOut: V3 = [e[1], -e[0], 0]
    const pt = (u: number, v: number): V3 => this.at([c[0] + e[0] * u + nOut[0] * proud, c[1] + e[1] * u + nOut[1] * proud], v)
    const r = w / 2
    const prof: [number, number][] = []
    if (head === 'flat' || z1 - z0 < r) prof.push([-r, z0], [r, z0], [r, z1], [-r, z1])
    else if (head === 'round') {
      const sp = z1 - r
      prof.push([-r, z0], [r, z0])
      for (let i = 0; i <= 6; i++) { const t = (Math.PI * i) / 6; prof.push([r * Math.cos(t), sp + r * Math.sin(t)]) }
      prof.push([-r, z0])
      prof.pop()
    } else {
      const sp = z1 - r * 1.3
      prof.push([-r, z0], [r, z0], [r, sp], [r * 0.55, sp + (z1 - sp) * 0.65], [0, z1], [-r * 0.55, sp + (z1 - sp) * 0.65], [-r, sp])
    }
    const cu = 0, cv = (z0 + z1) / 2 - (head === 'flat' ? 0 : r * 0.2)
    const C = pt(cu, cv)
    for (let i = 0; i < prof.length; i++) {
      const j = (i + 1) % prof.length
      this.tri(m, C, pt(...prof[i]), pt(...prof[j]), nOut)
    }
  }
  /** A flush triangular pediment on a face: base centre c, along e, base at z, w wide, h high, with a raised rim. */
  pediment(c: XY, e: XY, z: number, w: number, h: number, m: Mat = 'white', proud = 0.12) {
    const nOut: V3 = [e[1], -e[0], 0]
    const pt = (u: number, v: number, pr: number): V3 => this.at([c[0] + e[0] * u + nOut[0] * pr, c[1] + e[1] * u + nOut[1] * pr], z + v)
    const A = [pt(-w / 2, 0, proud), pt(w / 2, 0, proud), pt(0, h, proud)]
    const B = [pt(-w / 2, 0, 0), pt(w / 2, 0, 0), pt(0, h, 0)]
    this.tri(m, A[0], A[1], A[2], nOut)
    const eV: V3 = [e[0], e[1], 0]
    this.quad(m, A[1], B[1], B[2], A[2], add(eV, [0, 0, w / 2 / h]))
    this.quad(m, A[2], B[2], B[0], A[0], add(mul(eV, -1), [0, 0, w / 2 / h]))
    this.quad(m, A[0], B[0], B[1], A[1], [0, 0, -1])
  }
  /** Pale strips up the corners of a plan between z0 and z1 (lesenes, quoins). */
  corners(plan: Plan, z0: number, z1: number, w = 0.5, m: Mat = 'white') {
    for (const [a, b] of edges(ccw(plan))) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 2 * w + 0.2) continue
      const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      this.panel([a[0] + e[0] * w / 2, a[1] + e[1] * w / 2], e, z0, z1, w, 'flat', m, 0.03)
      this.panel([b[0] - e[0] * w / 2, b[1] - e[1] * w / 2], e, z0, z1, w, 'flat', m, 0.03)
    }
  }

  /**
   * Gabled dormers ("hearing windows") on the faces of a tent from `plan` at
   * z0 to `top` (a plan with the same corners, or the apex) at z1: `per` per
   * face, at fraction t of the way up, each w wide with walls h high, a dark
   * window and a green gable.
   */
  dormers(plan: Plan, z0: number, z1: number, o: { t: number; per?: number; w: number; h: number; top?: Plan | XY; body?: Mat; faces?: number[] }) {
    const { per = 1, body = 'brick' } = o
    const P0 = ccw(plan)
    const top = o.top ?? centre(plan)
    const P1: XY[] = typeof top[0] === 'number' ? P0.map(() => top as XY) : ccw(top as Plan)
    const zt = z0 + o.t * (z1 - z0)
    const ring = P0.map((p, i) => [p[0] + (P1[i][0] - p[0]) * o.t, p[1] + (P1[i][1] - p[1]) * o.t] as XY)
    edges(ring).forEach(([a, b], idx) => {
      if (o.faces && !o.faces.includes(idx)) return
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const nOut: XY = [e[1], -e[0]]
      const inset = (P0[idx][0] - P1[idx][0]) * nOut[0] + (P0[idx][1] - P1[idx][1]) * nOut[1]
      const slope = inset / (z1 - z0)
      for (let k = 0; k < per; k++) {
        const s = (L * (k + 0.5)) / per
        const f: XY = [a[0] + e[0] * s, a[1] + e[1] * s]
        const depth = slope * (o.h + o.w * 0.55) + 0.4
        this.dormer([f[0] + nOut[0] * 0.25, f[1] + nOut[1] * 0.25], e, zt, o.w, o.h, depth, body)
      }
    })
  }
  dormer(c: XY, e: XY, z: number, w: number, h: number, depth: number, body: Mat = 'brick') {
    const nOut: V3 = [e[1], -e[0], 0]
    const P = (u: number, v: number, back: number): V3 => this.at([c[0] + e[0] * u - nOut[0] * back, c[1] + e[1] * u - nOut[1] * back], z + v)
    const r = w / 2, g = h + w * 0.55
    // front pentagon
    const F = [P(-r, 0, 0), P(r, 0, 0), P(r, h, 0), P(0, g, 0), P(-r, h, 0)]
    const B = [P(-r, 0, depth), P(r, 0, depth), P(r, h, depth), P(0, g, depth), P(-r, h, depth)]
    this.tri(body, F[0], F[1], F[2], nOut); this.tri(body, F[0], F[2], F[4], nOut); this.tri(body, F[4], F[2], F[3], nOut)
    const eV: V3 = [e[0], e[1], 0]
    this.quad(body, F[1], B[1], B[2], F[2], eV)
    this.quad(body, F[0], F[4], B[4], B[0], mul(eV, -1))
    // roof, overhanging the front a little
    const o = 0.18
    const R = (u: number, v: number, back: number): V3 => P(u, v, back)
    this.quad('green', R(r + o, h - o * 0.8, -o), R(0, g + 0.05, -o), R(0, g + 0.05, depth), R(r + o, h - o * 0.8, depth), add(eV, [0, 0, 1]))
    this.quad('green', R(-r - o, h - o * 0.8, -o), R(-r - o, h - o * 0.8, depth), R(0, g + 0.05, depth), R(0, g + 0.05, -o), add(mul(eV, -1), [0, 0, 1]))
    this.panel(c, e, z + h * 0.15, z + h * 0.85, w * 0.45, 'round', 'dark', 0.04)
  }

  /** A pinnacle: a square (or n-sided) shaft of half-width r from z0 to z1, then a spire to z2, tipped in gold. */
  pinnacle(c: XY, z0: number, z1: number, z2: number, r: number, o: { n?: number; shaft?: Mat; spire?: Mat; ball?: boolean } = {}) {
    const { n = 4, shaft = 'white', spire = 'green' } = o
    const p = n === 4 ? rect(2 * r, 2 * r, 0, c) : ngon(n, r, c)
    if (z1 > z0) this.prism(shaft, p, z0, z1, false)
    this.tent(spire, grow(p, 0.05 * r), z1, z2)
    if (o.ball) this.ball(c, z2, Math.max(0.12, r * 0.25))
  }
  /** A small gilt ball (an octahedron). */
  ball(c: XY, z: number, r: number, m: Mat = 'gold') {
    const t = this.at(c, z + 2 * r), b = this.at(c, z), mid = (dx: number, dy: number) => this.at([c[0] + dx, c[1] + dy], z + r)
    const ring = [mid(r, 0), mid(0, r), mid(-r, 0), mid(0, -r)]
    for (let i = 0; i < 4; i++) {
      const a = ring[i], bb = ring[(i + 1) % 4]
      const out: V3 = sub3(mul(add(a, bb), 0.5), this.at(c, z + r))
      this.tri(m, a, bb, t, add(out, [0, 0, 0.5]))
      this.tri(m, bb, a, b, add(out, [0, 0, -0.5]))
    }
  }
  /** A thin gilt rod (4-sided) from z0 to z1. */
  rod(c: XY, z0: number, z1: number, r: number, m: Mat = 'gold') {
    this.prism(m, rect(2 * r, 2 * r, 0, c), z0, z1, true)
  }
  /** A gilt weather vane: rod, ball and a pennant facing along x. */
  vane(c: XY, z: number, h: number, flag = h * 0.35) {
    this.rod(c, z, z + h, 0.07)
    this.ball(c, z + h * 0.18, 0.22)
    const f0 = z + h * 0.55, f1 = f0 + flag * 0.55
    const A = this.at(c, f0), B = this.at([c[0] + flag, c[1]], f0 + 0.1), C = this.at([c[0] + flag, c[1]], f1 - 0.1), D = this.at(c, f1)
    this.quad('gold', A, B, C, D, [0, -1, 0])
    this.quad('gold', A, D, C, B, [0, 1, 0])
  }
  /**
   * A ruby star of span `span` (point to point) centred at height z: two
   * crossed five-point plates in a gilt frame on a short rod.
   */
  star(c: XY, z: number, span: number) {
    const R = span / 2, r = R * 0.42, t = R * 0.16
    for (const ang of [0, Math.PI / 2]) {
      const e: V3 = [Math.cos(ang), Math.sin(ang), 0], nrm: V3 = [-Math.sin(ang), Math.cos(ang), 0]
      const pt = (u: number, v: number, s: number): V3 => add(this.at(c, z), add(add(mul(e, u), [0, 0, v]), mul(nrm, s)))
      const prof: [number, number][] = Array.from({ length: 10 }, (_, i) => { const a = Math.PI / 2 + (Math.PI * i) / 5; const rr = i % 2 ? r : R; return [rr * Math.cos(a), rr * Math.sin(a)] })
      const F = prof.map(([u, v]) => pt(u, v, t / 2)), B = prof.map(([u, v]) => pt(u, v, -t / 2))
      const cF = pt(0, 0, t), cB = pt(0, 0, -t)
      for (let i = 0; i < 10; i++) {
        const j = (i + 1) % 10
        this.tri('star', cF, F[i], F[j], nrm)
        this.tri('star', cB, B[j], B[i], mul(nrm, -1))
        const du = prof[j][0] - prof[i][0], dv = prof[j][1] - prof[i][1]
        this.quad('gold', F[i], B[i], B[j], F[j], add(mul(e, dv), [0, 0, -du]))
      }
    }
    this.rod(c, z - R * 1.6, z - R * 0.5, 0.09)
    this.ball(c, z - R * 1.75, R * 0.22)
  }
  /** A clock dial on a face: dark disc, gilt rim and hands, centred at (c, z), facing along nOut. */
  dial(c: XY, e: XY, z: number, r: number) {
    const nOut: V3 = [e[1], -e[0], 0]
    const pt = (u: number, v: number, pr: number): V3 => this.at([c[0] + e[0] * u + nOut[0] * pr, c[1] + e[1] * u + nOut[1] * pr], z + v)
    const N = 16
    const ang = (i: number) => (2 * Math.PI * i) / N
    for (let i = 0; i < N; i++) {
      const a = ang(i), b = ang(i + 1)
      this.tri('dark', pt(0, 0, 0.08), pt(r * 0.86 * Math.cos(a), r * 0.86 * Math.sin(a), 0.08), pt(r * 0.86 * Math.cos(b), r * 0.86 * Math.sin(b), 0.08), nOut)
      this.quad('gold', pt(r * 0.86 * Math.cos(a), r * 0.86 * Math.sin(a), 0.1), pt(r * Math.cos(a), r * Math.sin(a), 0.1), pt(r * Math.cos(b), r * Math.sin(b), 0.1), pt(r * 0.86 * Math.cos(b), r * 0.86 * Math.sin(b), 0.1), nOut)
    }
    // hands at ten past ten, bold enough to read
    const hand = (a: number, len: number, wd: number) => {
      const ux = Math.cos(a), uy = Math.sin(a), px = -uy * wd / 2, py = ux * wd / 2
      this.quad('gold', pt(px, py, 0.12), pt(ux * len + px, uy * len + py, 0.12), pt(ux * len - px, uy * len - py, 0.12), pt(-px, -py, 0.12), nOut)
    }
    hand((Math.PI * 2) / 3 - 0.1, r * 0.55, r * 0.12)
    hand(Math.PI / 6 + 0.05, r * 0.78, r * 0.08)
  }

  /** Every part, ready for `writeGlb`. */
  parts() {
    return (Object.keys(this.P) as Mat[]).filter((m) => this.P[m].triangles > 0).map((m) => ({ part: this.P[m], material: this.materials[m] }))
  }
  get triangles() {
    return Object.values(this.P).reduce((s, p) => s + p.triangles, 0)
  }
}

/** Write models/<id>.glb (and a detail LOD when given), held to the budget. */
export async function save(id: string, name: string, kit: Kit, maxTri = 5000, detail?: Kit, extras: Record<string, unknown> = {}) {
  const write = async (k: Kit, file: string, cap: number, bytes: number) => {
    const parts = k.parts()
    if (parts.length > 6) throw new Error(`${id}: ${parts.length} materials`)
    if (k.triangles > cap) throw new Error(`${id}: ${k.triangles} triangles over ${cap}`)
    const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the ground anchor', ...extras })
    if (glb.length > bytes) throw new Error(`${id}: ${glb.length} bytes`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${k.triangles} triangles, ${glb.length} bytes (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')})`)
  }
  await write(kit, `${id}.glb`, maxTri, 250_000)
  if (detail) await write(detail, `${id}.detail.glb`, 40_000, 1_500_000)
}

/**
 * The common Kremlin tower: a brick shaft to the wall walk, a corbelled
 * band under a parapet (swallowtail merlons or loopholes), a square upper
 * tier, a green tent (truncated where a lookout stands on it, with gabled
 * dormers), the lookout with its arches, a small top tent, and a vane or a
 * star. Each tower passes its own numbers; anything it lacks is left out.
 */
export type TentTower = {
  shaft: Plan; shaftTop: number
  slits?: { z0: number; z1: number; per: number; w: number; faces?: number[] }[]
  corbel?: { h: number; out: number; slots?: number }
  parapet?: { h: number; merlons?: { w: number; h: number; pitch: number; t?: number }; loopholes?: boolean }
  tier?: { plan: Plan; z0: number; z1: number; windows?: { z0: number; z1: number; per: number; w: number; head?: 'round' | 'pointed' | 'flat'; frame?: number }; corners?: boolean; cornice?: boolean }
  tent: { plan: Plan; z0: number; z1: number; top?: Plan; eave?: number; dormers?: { t: number; per: number; w: number; h: number; body?: Mat }[] }
  lookout?: { plan: Plan; z1: number; arches?: { per: number; w: number; z0: number; z1: number; head?: 'round' | 'pointed' }; cornice?: boolean }
  cap?: { plan: Plan; z0: number; z1: number; eave?: number; dormers?: { t: number; per: number; w: number; h: number } }
  top?: { vane?: number; star?: number; z?: number }
}
export function tentTower(k: Kit, s: TentTower) {
  k.prism('brick', s.shaft, 0, s.shaftTop, !s.corbel && !s.parapet)
  for (const sl of s.slits ?? []) k.openings(s.shaft, sl.z0, sl.z1, { per: sl.per, w: sl.w, head: 'round', faces: sl.faces })
  let z = s.shaftTop, rim = s.shaft
  if (s.corbel) {
    k.band('white', s.shaft, z - 0.3, z, 0.08)
    k.flare('brick', s.shaft, z, z + s.corbel.h * 0.6, z + s.corbel.h, s.corbel.out)
    rim = grow(s.shaft, s.corbel.out)
    if (s.corbel.slots) k.openings(rim, z + s.corbel.h * 0.62, z + s.corbel.h * 0.95, { pitch: s.corbel.slots, w: Math.min(0.5, s.corbel.slots * 0.45), head: 'flat', minEdge: 1.5 })
    z += s.corbel.h
  }
  if (s.parapet) {
    if (s.parapet.merlons) k.merlons(rim, z, { ...s.parapet.merlons })
    else {
      k.prism('brick', rim, z, z + s.parapet.h)
      k.band('white', rim, z + s.parapet.h - 0.15, z + s.parapet.h, 0.06)
      if (s.parapet.loopholes) k.openings(rim, z + s.parapet.h * 0.3, z + s.parapet.h * 0.7, { pitch: 1.6, w: 0.45, head: 'flat', minEdge: 2 })
    }
  }
  if (s.tier) {
    const t = s.tier
    k.prism('brick', t.plan, t.z0, t.z1, false)
    if (t.corners !== false) k.corners(t.plan, t.z0 + 0.4, t.z1, 0.45)
    if (t.windows) k.openings(t.plan, t.windows.z0, t.windows.z1, { per: t.windows.per, w: t.windows.w, head: t.windows.head ?? 'round', frame: t.windows.frame ?? 0.15 })
    if (t.cornice !== false) k.band('white', t.plan, t.z1 - 0.35, t.z1, 0.18)
  }
  const T = s.tent
  const eave = T.eave ?? 0.3
  const tp = grow(T.plan, eave)
  k.tent('green', tp, T.z0, T.z1, T.top)
  for (const d of T.dormers ?? []) k.dormers(tp, T.z0, T.z1, { ...d, top: T.top ?? undefined })
  let zTop = T.z1
  if (s.lookout) {
    const L = s.lookout
    k.prism('brick', L.plan, T.z1 - 0.2, L.z1, false)
    k.corners(L.plan, T.z1, L.z1, 0.3)
    if (L.arches) k.openings(L.plan, L.arches.z0, L.arches.z1, { per: L.arches.per, w: L.arches.w, head: L.arches.head ?? 'round', frame: 0.12 })
    if (L.cornice !== false) k.band('white', L.plan, L.z1 - 0.3, L.z1, 0.15)
    zTop = L.z1
  }
  if (s.cap) {
    const C = s.cap
    const cp = grow(C.plan, C.eave ?? 0.25)
    if (C.z0 > zTop) k.prism('brick', C.plan, zTop, C.z0, false)
    k.tent('green', cp, C.z0, C.z1)
    if (C.dormers) k.dormers(cp, C.z0, C.z1, C.dormers)
    zTop = C.z1
  }
  const c = centre(s.cap?.plan ?? s.lookout?.plan ?? T.plan)
  if (s.top?.star) k.star(c, (s.top.z ?? zTop) + s.top.star * 1.6, s.top.star)
  else if (s.top?.vane) k.vane(c, zTop - 0.2, s.top.vane)
}

// ------------------------------------------------------------------ walls

/** Ground heights on a regular grid (see bridge-kit's GroundGrid): rows along y from y0, columns along x from x0. */
export type Ground = { y0: number; x0: number; step: number; z: number[][] }
export function groundAt(g: Ground, x: number, y: number): number {
  const fy = Math.min(Math.max((y - g.y0) / g.step, 0), g.z.length - 1.0001)
  const fx = Math.min(Math.max((x - g.x0) / g.step, 0), g.z[0].length - 1.0001)
  const r = Math.floor(fy), c = Math.floor(fx), ty = fy - r, tx = fx - c
  return (g.z[r][c] * (1 - tx) + g.z[r][c + 1] * tx) * (1 - ty) + (g.z[r + 1][c] * (1 - tx) + g.z[r + 1][c + 1] * tx) * ty
}
const inRing = (p: XY, r: XY[]) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

/**
 * A run of the Kremlin wall: the OSM outline extruded from the map's
 * terrain (vertex by vertex, every few metres, so the map reads it as
 * standing on its ground) up to a walk `height` metres over the terrain
 * smoothed along the wall, with swallowtail merlons along the outer face
 * (the edges facing away from `inside`, the Kremlin's centre), stopping at
 * the towers.
 */
export type WallSpec = {
  rings: XY[][]
  height: number
  ground: Ground
  towers: XY[][]
  inside: XY
  /** The walk's height where it varies along the run; `height` elsewhere. */
  heightAt?: (x: number, y: number) => number
  merlon?: { w: number; h: number; t: number; pitch: number }
}
export function wall(k: Kit, s: WallSpec) {
  const { w = 1.25, h = 2.3, t = 0.68, pitch = 2.0 } = s.merlon ?? {}
  const split = (r: XY[], seg: number) => r.flatMap((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / seg))
    return Array.from({ length: n }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n] as XY)
  })
  const rings = s.rings.map((r) => split(ccw(r), 4))
  const g0 = Math.min(...rings.flat().map(([x, y]) => groundAt(s.ground, x, y)))
  const G = (x: number, y: number) => groundAt(s.ground, x, y) - g0
  // The walk follows the low ground along the wall (the lowest DEM reading
  // within 12 m, averaged over 24 m), as the towers stand on the lowest
  // ground under their footprints, so walls and towers meet at one level.
  const low = (x: number, y: number) => {
    let m = Infinity
    for (const dx of [-12, 0, 12]) for (const dy of [-12, 0, 12]) m = Math.min(m, G(x + dx, y + dy))
    return m
  }
  const smooth = (x: number, y: number) => {
    let sum = 0, n = 0
    for (const dx of [-12, 0, 12]) for (const dy of [-12, 0, 12]) { sum += low(x + dx, y + dy); n++ }
    return sum / n
  }
  const H = (x: number, y: number) => s.heightAt?.(x, y) ?? s.height
  const top = (x: number, y: number) => Math.max(smooth(x, y) + H(x, y), G(x, y) + 0.5 * H(x, y))
  for (const r of rings) {
    const T = r.map(([x, y]) => top(x, y)), F = r.map(([x, y]) => G(x, y))
    for (let i = 0; i < r.length; i++) {
      const j = (i + 1) % r.length
      const a = r[i], b = r[j]
      const n: V3 = [b[1] - a[1], a[0] - b[0], 0]
      k.quad('brick', k.v(a, F[i]), k.v(b, F[j]), k.v(b, T[j]), k.v(a, T[i]), n)
    }
    for (const [i, j, l] of earcut(r)) k.tri('brick', k.v(r[i], T[i]), k.v(r[j], T[j]), k.v(r[l], T[l]), [0, 0, 1])
  }
  // Merlons along the outer edges, at an even pitch round the bends, clear of the towers.
  const towers = s.towers.map((r) => grow(ccw(r), 0.9))
  for (const r0 of s.rings) {
    const r = ccw(r0)
    const outer = r.map((a, i) => {
      const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const m: XY = [(a[0] + b[0]) / 2 - s.inside[0], (a[1] + b[1]) / 2 - s.inside[1]]
      return L > 0.05 && ((b[1] - a[1]) * m[0] - (b[0] - a[0]) * m[1]) / L / Math.hypot(...m) > 0.5
    })
    // Start at an edge that follows an inner one, so a chain isn't cut in two.
    const start = Math.max(0, outer.findIndex((o, i) => o && !outer[(i + r.length - 1) % r.length]))
    let carry = pitch / 2
    for (let q = 0; q < r.length; q++) {
      const i = (start + q) % r.length
      if (!outer[i]) { carry = pitch / 2; continue }
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      let d = carry
      for (; d <= L; d += pitch) {
        const c: XY = [a[0] + e[0] * d, a[1] + e[1] * d]
        if (towers.some((tr) => inRing(c, tr))) continue
        // Keep the merlon on the wall at a bend: its ends no further than the edge's ends.
        const dd = Math.min(Math.max(d, Math.min(w / 2, L / 2)), Math.max(L - w / 2, L / 2))
        const cc: XY = [a[0] + e[0] * dd, a[1] + e[1] * dd]
        const z = top(cc[0], cc[1]) - 0.05
        k.merlon(cc, e, z, w, h, t)
        // The loophole slit through it, on both faces.
        k.panel(cc, e, z + 0.45, z + 1.25, 0.22, 'flat', 'dark', 0.03)
        k.panel([cc[0] - e[1] * t, cc[1] + e[0] * t], [-e[0], -e[1]], z + 0.45, z + 1.25, 0.22, 'flat', 'dark', 0.03)
      }
      carry = d - L
    }
  }
}
