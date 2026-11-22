/**
 * Balcony Bridge, Central Park, West Drive over a neck of the Lake (Calvert
 * Vaux, c. 1860) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-balcony-bridge.ts
 *
 * This file also exports a small portal kit used by the other Lake and
 * Ramble arches (nyc-trefoil-arch, nyc-ramble-arch, nyc-riftstone-arch):
 * faces with an opening of any profile (`openFace`), a voussoir ring
 * (`ring`), a barrel (`barrel`), arch profiles with jambs (`archPr`) and a
 * pierced balustrade (`balustrade`). Its own build runs only when it is the
 * main module. It builds on the arch kit in nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): y through the arch, along the Lake's neck
 * (bearing 141.7°, SE: the placement's bearing), x along West Drive
 * (bearing 231.7°, SW), z up, metres; z = 0 is the Lake's water under the
 * arch. Anchor: the centroid of OSM way/689009141 (man_made=bridge,
 * "Balcony Bridge"), which the model draws across and so replaces.
 *
 * Evidence
 * - OSM (ODbL): outline way/689009141, 8.5 m along the drive by 19 m across
 *   it (its two bulges are the balconies); West Drive on the bridge
 *   way/689009148 and the footway beside it way/689009159, 10.5 m apart.
 * - Map terrain (Mapterhorn z15, bearing 51.7): the Lake at 0 on both sides
 *   (|across| ≥ 12 m), the drive's embankment 4.5–4.8 m above it, 15 m wide.
 *   The deck is taken at 4.7 m; the infill stops at 4.4 m.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-balcony-bridge/photos):
 *   King of Hearts, "Central Park New York August 2012 007.jpg",
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_New_York_August_2012_007.jpg
 *     (the south-east face from across the Lake: the arch, the balustrade,
 *     the balcony on its stepped corbel south-west of the arch);
 *   Epicgenius, "Central Park Apr 2019 63/64/65.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Apr_2019_64.jpg
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Apr_2019_65.jpg
 *     (on the deck: the balustrade of interlocking rings between capped
 *     posts, the balcony's solid curved parapet with its bench);
 *   L. G. Strand / W. M. Chase stereograph "Balcony Bridge, Central Park"
 *     (NYPL, public domain),
 *     https://commons.wikimedia.org/wiki/File:Balcony_Bridge,_Central_Park,_by_Chase,_W._M._(William_M.),_ca._1818-1901.jpg
 *     (the other face: ashlar, round arch, cornice, balcony to the right of
 *     the arch, i.e. also south-west of it).
 * - Estimated from the King of Hearts photo, scaled to the 1.05 m
 *   balustrade: span 8.0 m, a flattened arch springing 0.3 m above the
 *   water with its crown at 3.3 m; ring 0.55 m; cornice 0.35 m; the balcony
 *   a 4.1 m chord projecting 1.4 m, its centre 6.0 m south-west of the
 *   arch's; the faces 20 m long, running into the banks.
 *
 * Simplified: the balustrade's interlocking rings are a dark inset band in
 * a buff frame; the face's coursing and the corbel's mouldings are plain.
 *
 * Doubts: both balconies are put south-west of the arch from two views (the
 * 2012 photo and the stereograph); the face length past the banks and the
 * corbel's depth are estimated.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, bevelBox, box, profile, qn, steps } from './nyc-greyshot-arch'

// ===========================================================================
// The portal kit
// ===========================================================================

export type Pr = [number, number][]

/** An arch profile with vertical jambs from the ground: (−a,0) … (a,0). */
export function archPr(kind: 'ellipse' | 'segment', a: number, rise: number, spring: number, n = 14): Pr {
  const pr = profile(kind, a, rise, spring, n).map((p): [number, number] => [p[0], p[1]])
  return spring > 0.01 ? [[-a, 0], ...pr, [a, 0]] : pr
}

/** Outward (away from the opening) unit normals at each point of a profile. */
export function prNormals(pr: Pr): [number, number][] {
  return pr.map((_, i) => {
    const p = pr[Math.max(0, i - 1)], q = pr[Math.min(pr.length - 1, i + 1)]
    const tx = q[0] - p[0], tz = q[1] - p[1], l = Math.hypot(tx, tz) || 1
    return [-tz / l, tx / l]
  })
}

/** The profile offset outward by d. */
export const offsetPr = (pr: Pr, d: number): Pr => {
  const nr = prNormals(pr)
  return pr.map(([x, z], i) => [x + nr[i][0] * d, Math.max(0, z + nr[i][1] * d)])
}

/**
 * A face at y with the opening `pr` cut out (x non-decreasing along pr),
 * facing ±y (s), from x0 to x1 and from the ground to top(x).
 */
export function openFace(p: Part, y: number, s: number, pr: Pr, x0: number, x1: number, top: (x: number) => number, k = 4) {
  const n: V3 = [0, s, 0]
  const a = pr[0][0], b = pr[pr.length - 1][0]
  for (const xs of [steps(x0, a, k), steps(b, x1, k)])
    for (let i = 0; i + 1 < xs.length; i++) {
      const u = xs[i], v = xs[i + 1]
      if (v - u > 1e-6) qn(p, [u, y, 0], [v, y, 0], [v, y, top(v)], [u, y, top(u)], n)
    }
  for (let i = 0; i + 1 < pr.length; i++) {
    const [u, zu] = pr[i], [v, zv] = pr[i + 1]
    if (v - u > 1e-6) qn(p, [u, y, zu], [v, y, zv], [v, y, top(v)], [u, y, top(u)], n)
  }
}

/** A voussoir ring around the opening, depth d, standing `proud` off the face at y. */
export function ring(p: Part, y: number, s: number, pr: Pr, d: number, proud: number) {
  const out = offsetPr(pr, d), nr = prNormals(pr), yr = y + s * proud
  for (let i = 0; i + 1 < pr.length; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1], [u0, w0] = out[i], [u1, w1] = out[i + 1]
    qn(p, [x0, yr, z0], [x1, yr, z1], [u1, yr, w1], [u0, yr, w0], [0, s, 0])
    const nx = (nr[i][0] + nr[i + 1][0]) / 2, nz = (nr[i][1] + nr[i + 1][1]) / 2
    qn(p, [x0, y, z0], [x1, y, z1], [x1, yr, z1], [x0, yr, z0], [-nx, 0, -nz])
    qn(p, [u0, y, w0], [u1, y, w1], [u1, yr, w1], [u0, yr, w0], [nx, 0, nz])
  }
}

/** The barrel (soffit and jambs) through the opening from y0 to y1, facing in. */
export function barrel(p: Part, pr: Pr, y0: number, y1: number) {
  const nr = prNormals(pr)
  for (let i = 0; i + 1 < pr.length; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
    qn(p, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], [-(nr[i][0] + nr[i + 1][0]) / 2, 0, -(nr[i][1] + nr[i + 1][1]) / 2])
  }
}

/**
 * A convex solid from stacked rings (each a convex polygon at one level,
 * listed bottom to top), sides wound outward; caps the top, and the bottom
 * if asked.
 */
export function hull(p: Part, rings: V3[][], bottom = false) {
  const n = rings[0].length
  for (let k = 0; k + 1 < rings.length; k++) {
    const r0 = rings[k], r1 = rings[k + 1]
    const c = r0.reduce((m, v) => [m[0] + v[0] / n, m[1] + v[1] / n, 0], [0, 0, 0])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, m = [(r0[i][0] + r0[j][0]) / 2 - c[0], (r0[i][1] + r0[j][1]) / 2 - c[1]]
      qn(p, r0[i], r0[j], r1[j], r1[i], [m[0], m[1], 0])
    }
  }
  const capR = (r: V3[], up: number) => { for (let i = 1; i + 1 < r.length; i++) { const t: V3[] = [r[0], r[i], r[i + 1]]; const e = [t[1][0] - t[0][0], t[1][1] - t[0][1]], f = [t[2][0] - t[0][0], t[2][1] - t[0][1]]; if ((e[0] * f[1] - e[1] * f[0]) * up >= 0) p.tri(t[0], t[1], t[2]); else p.tri(t[0], t[2], t[1]) } }
  capR(rings[rings.length - 1], 1)
  if (bottom) capR(rings[0], -1)
}

/**
 * A balustrade on the line y from x0 to x1, standing on z0: a light plinth
 * and coping with one dark pierced band between, and capped posts at xs.
 */
export function balustrade(light: Part, dark: Part, y: number, x0: number, x1: number, z0: number, h: number, posts: number[], th = 0.2, post = 0.25) {
  box(light, x0, x1, y - th - 0.04, y + th + 0.04, z0, z0 + 0.2)
  box(dark, x0, x1, y - th + 0.07, y + th - 0.07, z0 + 0.2, z0 + h - 0.17)
  box(light, x0, x1, y - th - 0.06, y + th + 0.06, z0 + h - 0.17, z0 + h)
  for (const x of posts) {
    bevelBox(light, x, y, post, th + 0.08, z0, z0 + h + 0.1, 0.05)
    bevelBox(light, x, y, post + 0.06, th + 0.14, z0 + h + 0.1, z0 + h + 0.22, 0.05)
  }
}

// ===========================================================================
// Balcony Bridge
// ===========================================================================

function build() {
  const face = new Part(), trim = new Part(), dark = new Part(), fill = new Part()
  const HY = 8.3, X0 = -10, X1 = 10, T = 0.9 // half width (face to face), face ends, wall thickness
  const DECK = 4.7, FILL = 4.4, TOP = 4.75, BAL = 1.0
  const XC = -1, A = 4.0, RISE = 3.0, SPRING = 0.3
  const pr = archPr('ellipse', A, RISE, SPRING, 16).map(([x, z]): [number, number] => [x + XC, z])
  // the balcony: a circular segment, chord XB ± HB, projecting P past the face
  const XB = 5.0, HB = 2.05, P = 1.4, RB = (HB * HB + P * P) / (2 * P)
  const arc = steps(0, 1, 10).map((u): [number, number] => {
    const t = Math.asin(HB / RB) * (2 * u - 1)
    return [XB + RB * Math.sin(t), P - RB + RB * Math.cos(t)]
  })

  for (const s of [-1, 1]) {
    const y = s * HY, yi = s * (HY - T)
    openFace(face, y, s, pr, X0, X1, () => TOP)
    ring(trim, y, s, pr, 0.55, 0.1)
    // a plinth course at the waterline, and the cornice under the balustrade
    for (const [a, b] of [[X0, XC - A], [XC + A, X1]]) band(trim, s, HY, 0.06, [a, b], () => 0, () => 0.5)
    band(trim, s, HY, 0.2, [X0, X1], () => TOP - 0.35, () => TOP)
    // the wall top, its inner face above the infill, and its ends
    qn(face, [X0, y, TOP], [X1, y, TOP], [X1, yi, TOP], [X0, yi, TOP], [0, 0, 1])
    qn(face, [X0, yi, FILL], [X1, yi, FILL], [X1, yi, TOP], [X0, yi, TOP], [0, -s, 0])
    for (const x of [X0, X1]) qn(face, [x, y, 0], [x, yi, 0], [x, yi, TOP], [x, y, TOP], [Math.sign(x), 0, 0])
    // the balustrade, broken by the balcony
    const yb = s * (HY - 0.25)
    balustrade(trim, dark, yb, X0, XB - HB, TOP, BAL, [X0 + 0.3, -6.5, -3.3, -0.1, XB - HB])
    balustrade(trim, dark, yb, XB + HB, X1, TOP, BAL, [XB + HB, X1 - 0.3])
    // the balcony: its corbel, floor slab, and solid curved parapet
    const cor = [[4.4, 1.25, 2.3], [2.6, 0.9, 1.8], [0.8, 0.45, 1.3]] as const
    hull(face, cor.map(([z, p, w]): V3[] => [[XB - w / 2, y, z], [XB + w / 2, y, z], [XB + w / 2, y + s * p, z], [XB - w / 2, y + s * p, z]]).reverse(), true)
    for (let i = 0; i + 1 < arc.length; i++) {
      const [xa, da] = arc[i], [xb2, db] = arc[i + 1]
      const nrm: V3 = [xa + xb2 - 2 * XB, s * (da + db - 2 * P + 2 * RB), 0], inw: V3 = [-nrm[0], -nrm[1], 0]
      qn(trim, [xa, y + s * da, FILL], [xb2, y + s * db, FILL], [xb2, y + s * db, TOP], [xa, y + s * da, TOP], nrm)
      qn(fill, [xa, y, TOP - 0.03], [xb2, y, TOP - 0.03], [xb2, y + s * db, TOP - 0.03], [xa, y + s * da, TOP - 0.03], [0, 0, 1])
      qn(trim, [xa, y, FILL], [xb2, y, FILL], [xb2, y + s * db, FILL], [xa, y + s * da, FILL], [0, 0, -1])
      // the parapet: outer face, inner face, coping
      const o = (d: number) => y + s * d, iN = (d: number) => y + s * (d - 0.32)
      qn(trim, [xa, o(da), TOP], [xb2, o(db), TOP], [xb2, o(db), TOP + BAL], [xa, o(da), TOP + BAL], nrm)
      qn(trim, [xa, iN(da), TOP], [xb2, iN(db), TOP], [xb2, iN(db), TOP + BAL], [xa, iN(da), TOP + BAL], inw)
      qn(trim, [xa, o(da), TOP + BAL], [xb2, o(db), TOP + BAL], [xb2, iN(db), TOP + BAL], [xa, iN(da), TOP + BAL], [0, 0, 1])
    }
  }
  // the barrel through, and the infill under the roadway (asphalt grey)
  barrel(face, pr, -HY, HY)
  const yi = HY - T
  qn(fill, [X0, -yi, FILL], [X1, -yi, FILL], [X1, yi, FILL], [X0, yi, FILL], [0, 0, 1])
  for (const x of [X0, X1]) qn(face, [x, -yi, 0], [x, yi, 0], [x, yi, FILL], [x, -yi, FILL], [Math.sign(x), 0, 0])

  finishModel('Balcony Bridge', 'nyc-balcony-bridge', [
    { part: face, material: { name: 'stone', color: 0xc2bcae, roughness: 0.9 } },
    { part: trim, material: { name: 'trim', color: 0xd5cbb3, roughness: 0.85 } },
    { part: dark, material: { name: 'openwork', color: 0x8a8372, roughness: 0.9 } },
    { part: fill, material: { name: 'asphalt', color: 0x8e8e8c, roughness: 0.95 } },
  ], { bearing: 141.7, osm: 'way/689009141', height: TOP + BAL + 0.22 }, 5000)
  void DECK
}

if (import.meta.main) build()
