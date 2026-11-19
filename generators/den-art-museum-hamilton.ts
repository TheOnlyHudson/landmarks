/**
 * Denver Art Museum, Frederic C. Hamilton Building (2006, Daniel Libeskind
 * with Davis Partnership) — original procedural geometry, CC0-1.0.
 * bun generators/den-art-museum-hamilton.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -104.989206, 39.736374,
 * the centroid of OSM way/35205641; bearing 0 (the shards follow no grid).
 *
 * Identity (photos below):
 *  1. Titanium-clad shards with sloped planar roofs, sharp edges and no
 *     right angles.                                    (se, s, ext, hust)
 *  2. The long prow reaching north over 13th Avenue, its underside rising
 *     to a knife point about 31 m up.                 (ne, hart1, hust)
 *  3. The east shard leaning out over the entrance plaza as a huge soffit.
 *                                                                (se, s)
 *  4. The tall peak in the middle (about 37 m) and the flat-topped block
 *     beside it; the low wedge running south.                      (ext)
 *  5. Few windows: thin slot windows in the cladding and the glazed
 *     ground floor at the east entrance.               (ne, hart1, s)
 *
 * Plan: each shard is a polygon from the lidar's roof facets (region
 * growing on the 1 m surface model, see SCRATCH planes.png), snapped to the
 * OSM outline way/35205641 where they meet it. The roof of each shard is the
 * plane least-squares fitted to its lidar cells (measured).
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid.
 * ground_min 1596.05 m; y = 0 here is 1.0 m above it (the lowest street
 * ground at the west and south faces; the east plaza is about 1.4 m higher).
 * Measured: the prow roof 23.0 + 0.128x + 0.105y (31.5 at the tip, OSM says
 * 23 + 3 skillion); the east shard 33 falling to 23 at its east edge; the
 * flat block 28; the tall shard's ridge about 37–38, its face falling about
 * 40° to the north-east; the south wedge 13–17; the low west shard 13–16.
 * Estimated: the prow's underside, a plane from the ground at y = 33 (the
 * north wall) to 1 m under the tip, drawn from the ne, hart1 and hust photos;
 * the leans of the faces: the east shard's foot 9–13 m in from its roof
 * edge (about 30° off vertical, a soffit over the entrance plaza, from the s
 * and se photos and the ground returns the lidar caught under it), the prow's
 * sides 2–3 m, the south-east and south points 5–9 m, the west faces 2–3 m; slot window and ground
 * glazing positions, from the photos.
 * Left out: the many secondary folds, panel seams, the skylights, the glass
 * bridge to the Martin Building (part of den-art-museum-martin), sculpture.
 *
 * Photos (evidence, Wikimedia Commons):
 *  se     "Frederic C. Hamilton building, Denver Art Museum. . View from
 *         south-east.jpg", Sarbjit Bahga, CC BY-SA 4.0 (from the east lawn)
 *  s      "Denver Art Museum - Frederic C. Hamilton building. View from
 *         south.jpg", Sarbjit Bahga, CC BY-SA 4.0 (also from the east)
 *  ne     "Denver Art Museum - Frederic C. Hamilton building. View from
 *         north-east.jpg", Sarbjit Bahga, CC BY-SA 4.0
 *  hart1  "Denver Art Museum (54940437051).jpg", Daniel Hartwig, CC BY 4.0
 *  hust   "Denver Art Museum Frederic C. Hamilton building.jpg", Hustvedt,
 *         CC BY-SA 3.0 (from the east across the plaza)
 *  ext    "DenverArtMuseumExtension.jpg", Studio Daniel Libeskind, CC BY 3.0
 *         (elevated, from the south-west)
 *  aerial USGS NAIP orthophoto (public domain)
 * Photo directions are read from the street layout; the two "south" photos
 * are in fact taken from the east lawn, looking west. No look-only sources.
 * No commercial imagery.
 *
 * Shape: every roof edge is chamfered 0.4 m. Colour: warm silver titanium
 * (champagne grey) from the sunlit photos, with a darker tone on every face
 * that tilts down (the soffits), so the folds read. Night: the titanium is not floodlit here; the slot
 * windows and the entrance glazing glow.
 */
import { Part, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, offset, save, type XY } from './atl-tech-tower'

type ZF = (x: number, y: number) => number
const plane = (c: number, a: number, b: number): ZF => (x, y) => c + a * x + b * y

/** Ear-clip a simple counter-clockwise ring into index triples. */
export function earClip(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k - 1 + idx.length) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = ring[ia], b = ring[ib], c = ring[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cr(a, b, ring[j]) > 0 && cr(b, c, ring[j]) > 0 && cr(c, a, ring[j]) > 0)) continue
      out.push([ia, ib, ic]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/**
 * A shard: a counter-clockwise plan ring with a planar (or any) roof `top`,
 * walls down to `bot` (0 by default) along an optional shifted foot ring
 * (same count), so walls lean. Wall edges are cut into ≤5 m pieces so the
 * map's terrain fitting keeps them on the ground. The roof edge is
 * chamfered `bev` metres. Wall faces that tilt down (soffits) go to `shade`,
 * as does the underside, capped wherever the foot is above 0.
 */
export function shard(walls: Part, roof: Part, ringIn: XY[], top: ZF, foot?: XY[], bot: ZF = () => 0, shade: Part = walls, bev = 0.4) {
  const flip = ccw(ringIn) !== ringIn
  const ring = flip ? [...ringIn].reverse() : ringIn
  const fr = foot ? (flip ? [...foot].reverse() : foot) : ring
  const inner = offset(ring, -bev)
  for (const [a, b, c] of earClip(inner)) {
    const P = (i: number): V3 => [inner[i][0], inner[i][1], top(ring[i][0], ring[i][1])]
    roof.tri(P(a), P(b), P(c))
  }
  const quad = (q: V3[]) => {
    const u = sub(q[1], q[0]), v = sub(q[3], q[0]), nz = u[0] * v[1] - u[1] * v[0], L = Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], nz) || 1
    ;(nz / L < -0.12 ? shade : walls).quad(q[0], q[1], q[2], q[3])
  }
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = ring[i], b = ring[j], fa = fr[i], fb = fr[j]
    // the bevel along the roof edge
    walls.quad([a[0], a[1], top(a[0], a[1]) - bev], [b[0], b[1], top(b[0], b[1]) - bev], [inner[j][0], inner[j][1], top(b[0], b[1])], [inner[i][0], inner[i][1], top(a[0], a[1])])
    const k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5))
    for (let s = 0; s < k; s++) {
      const L = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      const t0 = L(a, b, s / k), t1 = L(a, b, (s + 1) / k), b0 = L(fa, fb, s / k), b1 = L(fa, fb, (s + 1) / k)
      quad([[b0[0], b0[1], bot(b0[0], b0[1])], [b1[0], b1[1], bot(b1[0], b1[1])], [t1[0], t1[1], top(t1[0], t1[1]) - bev], [t0[0], t0[1], top(t0[0], t0[1]) - bev]])
    }
  }
  if (fr.some(([x, y]) => bot(x, y) > 0.01)) {
    for (const [a, b, c] of earClip(fr)) {
      const P = (i: number): V3 => [fr[i][0], fr[i][1], bot(fr[i][0], fr[i][1])]
      shade.tri(P(a), P(c), P(b))
    }
  }
}

/** A flat quad laid `out` metres off a (possibly sloping) face p0-p1-p2-p3. */
export function patch(p: Part, q: V3[], n: V3, out = 0.06) {
  const m = q.map(([x, y, z]) => [x + n[0] * out, y + n[1] * out, z + n[2] * out] as V3)
  p.quad(m[0], m[1], m[2], m[3])
}

if (import.meta.main) {
  const ti = new Part(), shade = new Part(), roof = new Part(), win = new Part()
  const S = (ring: XY[], top: ZF, foot?: XY[], bot?: ZF) => shard(ti, roof, ring, top, foot, bot, shade)

  // ── Shards: roofs are the lidar planes; feet pulled in so the faces lean ──
  const P4 = plane(23.01, 0.128, 0.105)
  // the main north body, its west face leaning out
  S([[-12, -4], [9, -2], [12.5, 30], [11.58, 38.55], [-17.33, 33.48], [-14.5, 10]], P4,
    [[-12, -4], [9, -2], [12.5, 30], [11.58, 38.55], [-15, 32], [-12.5, 10]])
  // the prow over 13th Avenue: its sides lean out, its underside sweeps up
  // from the north wall to just under the 31.5 m tip
  const TIP: XY = [1.17, 79.2], Y0 = 34
  const under: ZF = (x, y) => Math.max(0, Math.min(P4(x, y) - 1.2, (P4(...TIP) - 1.2) * Math.pow(Math.max(0, y - Y0) / (TIP[1] - Y0), 0.85)))
  S([[-17.33, 33.48], [11.58, 38.55], [10.47, 42.9], [7.99, 52.74], [5.04, 64.1], TIP, [-7.76, 64.11], [-14.36, 52.95], [-18.04, 46.49], [-19.37, 44.48], [-19.07, 43.04]], P4,
    [[-17.33, 33.48], [11.58, 38.55], [9.5, 42.5], [5.6, 52.5], [3.4, 64], TIP, [-5.6, 64], [-11.6, 52.8], [-15.8, 46], [-17.4, 44], [-17.2, 42.5]], under)
  // the east shard: its whole east face a soffit hanging 13 m out over the
  // entrance plaza (s, se), about 30° off vertical
  const eastTop: XY[] = [[12.5, -3], [23.16, -1.97], [27.63, 33.03], [14.6, 40.89], [13.53, 30.93]]
  const eastFoot: XY[] = [[12.5, -3], [14, -2.5], [14.3, 31], [13.5, 37], [13.53, 30.93]]
  const eastZ = plane(38.86, -0.476, -0.09)
  S(eastTop, eastZ, eastFoot)
  // the flat-topped block, its south face leaning out
  S([[-15, -35], [-2, -39], [4, -23], [3, -11], [-7, -9], [-16, -32]], () => 28.0,
    [[-13.5, -33], [-1.5, -36.5], [4, -23], [3, -11], [-7, -9], [-16, -32]])
  // the long diagonal shard rising north-east, and its west face
  S([[-17, -46], [3, -6], [7, 9], [6, 21], [-3, 9], [-22, -33]], plane(26.71, 0.098, 0.236))
  S([[-17.82, -46.66], [-5, 4], [-12.77, -7.33], [-27.58, -29.79]], plane(25.71, -0.141, 0.343),
    [[-16, -43], [-5, 4], [-12.77, -7.33], [-24.5, -29]])
  // the low west shard
  S([[-28.33, -2.47], [-18.75, -5.46], [-12, -4], [-14.5, 10], [-17.33, 33.48]], plane(12.82, -0.138, 0),
    [[-25.5, -2.5], [-18.75, -5.46], [-12, -4], [-14.5, 10], [-16.5, 30]])
  // the tall shard: ridge on the west, its face falling steeply to the entrance
  const tall = plane(24.99, -0.71, -0.443)
  S([[6, -39], [21, -40], [29, -10], [22, -4], [5, -7], [4, -33]], (x, y) => Math.max(7, tall(x, y)))
  // the south-east wedge, its point hanging out (hust), and the long low south wedge
  S([[-2, -41], [18.45, -50.42], [32.8, -58.74], [25.23, -22.03], [21, -30]], plane(8.14, -0.086, -0.236),
    [[-2, -41], [18.45, -50.42], [27, -50], [24, -23], [21, -30]])
  S([[-21.27, -56.7], [-16.45, -60.43], [-12.31, -63.6], [-13.47, -65.1], [13.63, -85.88], [15.85, -50.93], [15.9, -50.26], [-2, -41], [-12, -35], [-17.82, -46.66]], plane(12.64, -0.122, -0.034),
    [[-19, -55], [-16.45, -60.43], [-12.31, -63.6], [-11.5, -62.5], [10.5, -79], [15.85, -50.93], [15.9, -50.26], [-2, -41], [-12, -35], [-17.82, -46.66]])

  // ── Windows ──
  // the slot in the prow's east face near its root (ne, hart1, hust)
  {
    const a: XY = [10.47, 42.9], b: XY = [7.99, 52.74], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: V3 = [t[1], -t[0], 0]
    const at = (s: number, z: number): V3 => [a[0] + t[0] * s, a[1] + t[1] * s, z]
    patch(win, [at(1.0, 17), at(2.4, 17), at(3.4, 28), at(2.0, 28)], nrm, 0.6)
  }
  // the entrance glazing at the foot of the leaning east face (s, se)
  {
    const F = (u: number, f: number): V3 => {
      const fx = eastFoot[1][0] + (eastFoot[2][0] - eastFoot[1][0]) * u, fy = eastFoot[1][1] + (eastFoot[2][1] - eastFoot[1][1]) * u
      const tx = eastTop[1][0] + (eastTop[2][0] - eastTop[1][0]) * u, ty = eastTop[1][1] + (eastTop[2][1] - eastTop[1][1]) * u
      return [fx + (tx - fx) * f, fy + (ty - fy) * f, (eastZ(tx, ty) - 0.4) * f]
    }
    for (let k = 0; k < 6; k++) {
      const u0 = 0.04 + k * 0.155, u1 = u0 + 0.13, q = [F(u0, 0.02), F(u1, 0.02), F(u1, 0.2), F(u0, 0.2)]
      const e1 = sub(q[1], q[0]), e2 = sub(q[3], q[0])
      const c: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], l = Math.hypot(...c)
      patch(win, q, [c[0] / l, c[1] / l, c[2] / l], 0.15)
    }
  }
  // glazing at the foot of the tall shard's east face (hust)
  {
    const a: XY = [29, -10], b: XY = [22, -4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: V3 = [t[1], -t[0], 0]
    const at = (s: number, z: number): V3 => [a[0] + t[0] * s, a[1] + t[1] * s, z]
    patch(win, [at(0.8, 1.5), at(L - 0.8, 1.5), at(L - 0.8, 5.2), at(0.8, 5.2)], nrm, 0.08)
  }

  await save('den-art-museum-hamilton', 'Denver Art Museum, Hamilton Building', [
    { part: ti, material: finish('hamilton-titanium', 0xd2cbbe) },
    { part: shade, material: finish('hamilton-titanium-shade', 0xa39b8c) },
    { part: roof, material: finish('hamilton-roof', 0xdcd8cf) },
    { part: win, material: PALETTE.window },
  ], { height: 38.0, anchor: [39.736374, -104.989206], bearing: 0 })
}
