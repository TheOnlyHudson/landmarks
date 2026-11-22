/**
 * Treaty Oak, Jessie Ball duPont Park, Southbank, Jacksonville, FL (a
 * southern live oak, Quercus virginiana, about 250 years old): procedural,
 * CC0-1.0, no textures.
 * bun generators/jax-treaty-oak.ts [out.glb]
 *
 * A broad, low, flat-topped canopy of a few bold lumpy masses over a short
 * thick trunk, with the sprawling limbs that make the tree famous: two
 * running out almost level and coming down to rest near the ground, the
 * others climbing into the crown.
 *
 * Identity: OSM node/5637868194 (natural=tree, "Treaty Oak", wikidata
 * Q7836941; height 21, diameter_crown 44, circumference 7.62). Anchor at
 * the node (-81.6581206, 30.3169851), bearing 0. Not a building:
 * `replaces` is empty.
 *
 * Published (OSM tags, from the City of Jacksonville's figures): 21 m tall,
 * crown 44 m across, trunk girth 7.62 m (2.4 m across). Estimated from
 * photos p1–p3: the trunk forking at ~3 m, the low limbs reaching 13–15 m
 * out and dipping to ~1 m, the canopy's underside ~5–8 m, sagging at the
 * edges to ~3–4 m. The limb directions are drawn from the photos' general
 * look, not surveyed: invented in detail.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/jax/work/jax-treaty-oak/photos):
 *  p1 "Treaty Oak, Jacksonville Florida (26709370248).jpg", Lorie Shaull,
 *     CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Treaty_Oak,_Jacksonville_Florida_(26709370248).jpg
 *     — the trunk and the low limbs, from under the crown.
 *  p2 "Jax FL Treaty Oak01.jpg", Ebyabe, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Jax_FL_Treaty_Oak01.jpg
 *     — the whole crown from outside: broad, domed, sagging to the ground.
 *  p3 "Treaty Oak.JPG", 3bCat, public domain,
 *     https://commons.wikimedia.org/wiki/File:Treaty_Oak.JPG
 *     — the trunk, its fork and the limbs.
 *
 * Colours: bark grey-brown 0x8c7d6c, leaves muted green 0x7f9868 (p2,
 * pulled to the palette's lightness). Doubts: no tree model exists in the
 * repo to match; this sets the style. Resurrection fern and moss left out.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishGlb, writeModel } from './sea-tacoma-union-station'

/** A cheap deterministic hash in [0, 1). */
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453
  return s - Math.floor(s)
}

/** A lumpy ellipsoid: a UV sphere with radial noise, smooth-shaded. */
function blob(p: Part, c: V3, r: V3, seed: number, nu = 12, nv = 7, lump = 0.14) {
  const pt = (i: number, j: number): [V3, V3] => {
    const u = ((i % nu) / nu) * 2 * Math.PI, v = (j / nv) * Math.PI
    const k = j === 0 || j === nv ? 1 : 1 + lump * (hash(i % nu, j, seed) * 2 - 1)
    const d: V3 = [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)]
    const q: V3 = [c[0] + d[0] * r[0] * k, c[1] + d[1] * r[1] * k, c[2] + d[2] * r[2] * k]
    const n: V3 = [d[0] / r[0], d[1] / r[1], d[2] / r[2]]
    const l = Math.hypot(...n)
    return [q, [n[0] / l, n[1] / l, n[2] / l]]
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const [a, na] = pt(i, j), [b, nb] = pt(i + 1, j), [cc, nc] = pt(i + 1, j + 1), [d, nd] = pt(i, j + 1)
    if (j > 0) p.tri(a, d, b, undefined, undefined, undefined, [na, nd, nb])
    if (j < nv - 1) p.tri(b, d, cc, undefined, undefined, undefined, [nb, nd, nc])
  }
}

/** A tapered limb along a polyline: an n-sided tube, radii per point, the far end capped. */
function limb(p: Part, pts: V3[], rad: number[], n = 7) {
  const rings: V3[][] = [], norms: V3[][] = []
  pts.forEach((q, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)]
    let t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const tl = Math.hypot(...t); t = [t[0] / tl, t[1] / tl, t[2] / tl]
    const up: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
    let u: V3 = [t[1] * up[2] - t[2] * up[1], t[2] * up[0] - t[0] * up[2], t[0] * up[1] - t[1] * up[0]]
    const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
    const w: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
    const ring: V3[] = [], nr: V3[] = []
    for (let i = 0; i < n; i++) {
      const a2 = (2 * Math.PI * i) / n, d: V3 = [u[0] * Math.cos(a2) + w[0] * Math.sin(a2), u[1] * Math.cos(a2) + w[1] * Math.sin(a2), u[2] * Math.cos(a2) + w[2] * Math.sin(a2)]
      ring.push([q[0] + d[0] * rad[k], q[1] + d[1] * rad[k], q[2] + d[2] * rad[k]]); nr.push(d)
    }
    rings.push(ring); norms.push(nr)
  })
  for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.tri(rings[k][i], rings[k][j], rings[k + 1][j], undefined, undefined, undefined, [norms[k][i], norms[k][j], norms[k + 1][j]])
    p.tri(rings[k][i], rings[k + 1][j], rings[k + 1][i], undefined, undefined, undefined, [norms[k][i], norms[k + 1][j], norms[k + 1][i]])
  }
  const last = rings[rings.length - 1], e = pts[pts.length - 1]
  for (let i = 0; i < n; i++) p.tri(last[i], last[(i + 1) % n], e)
}

const pol = (r: number, deg: number, z: number): V3 => [r * Math.sin((deg * Math.PI) / 180), r * Math.cos((deg * Math.PI) / 180), z]

function build() {
  const bark = new Part(), leaf = new Part()

  // the trunk: a flared foot, 2.4 m across, forking at ~3 m
  const prof: [number, number][] = [[2.6, 0], [1.75, 0.6], [1.35, 1.4], [1.35, 2.4], [1.7, 3.2]]
  for (let k = 0; k + 1 < prof.length; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < 10; i++) {
      const a = (2 * Math.PI * i) / 10, b = (2 * Math.PI * (i + 1)) / 10
      const A: V3 = [r0 * Math.cos(a), r0 * Math.sin(a), z0], B: V3 = [r0 * Math.cos(b), r0 * Math.sin(b), z0]
      const C: V3 = [r1 * Math.cos(b), r1 * Math.sin(b), z1], D: V3 = [r1 * Math.cos(a), r1 * Math.sin(a), z1]
      bark.quad(A, B, C, D)
    }
  }

  // the sprawling limbs (p1, p3): two run out low and come down near the ground, the rest climb
  const low: [number, number][] = [[250, 14.5], [80, 13.5], [160, 11]]
  for (const [deg, reach] of low) {
    limb(bark, [pol(0.6, deg, 2.8), pol(reach * 0.3, deg + 6, 3.6), pol(reach * 0.6, deg + 10, 3.2), pol(reach * 0.85, deg + 8, 2.0), pol(reach, deg + 4, 0.9)], [1.15, 0.95, 0.75, 0.58, 0.42])
  }
  for (const [deg, reach, top] of [[20, 9, 11], [120, 10, 10], [200, 8, 12], [300, 10, 10.5], [340, 6, 13]]) {
    limb(bark, [pol(0.4, deg, 3.0), pol(reach * 0.35, deg + 8, 5.0), pol(reach * 0.75, deg + 14, top - 2.5), pol(reach, deg + 18, top)], [1.0, 0.8, 0.6, 0.4])
  }

  // the canopy: a broad, flat-topped crown of a few lumpy masses, 44 m across, 21 m tall
  blob(leaf, [0, 0, 15.5], [11.5, 11.5, 5.4], 1, 14, 8)
  const ring: [number, number, number, number, number, number][] = [
    // bearing, distance, centre z, radius across, radius along, half height
    [20, 11.5, 13.0, 8.5, 8.0, 5.2],
    [85, 13.0, 11.0, 8.0, 8.5, 4.6],
    [145, 12.0, 12.5, 8.5, 7.5, 5.0],
    [205, 11.5, 13.5, 8.0, 8.0, 5.2],
    [255, 13.5, 10.5, 8.5, 8.0, 4.6],
    [315, 12.0, 12.5, 8.0, 8.5, 5.0],
  ]
  ring.forEach(([deg, d, z, ra, rb, h], k) => {
    const c = pol(d, deg, z), a = (deg * Math.PI) / 180
    // radii in x/y from the blob's along/across radii, turned to its bearing (approximate: the larger of the two)
    void a
    blob(leaf, c, [Math.max(ra, rb), Math.max(ra, rb) * 0.95, h], 10 + k)
  })
  // low outer masses over the sprawling limbs, sagging toward the ground
  for (const [deg, d, z, r, h] of [[255, 17.5, 6.8, 5.0, 3.4], [85, 17.0, 7.0, 5.0, 3.4], [162, 15.5, 8.0, 5.2, 3.6]]) blob(leaf, pol(d, deg + 4, z), [r, r, h], 30 + deg)

  return finishGlb('Treaty Oak', [
    { part: bark, material: finish('oak-bark', 0x8c7d6c) },
    { part: leaf, material: finish('oak-leaf', 0x7f9868) },
  ], { bearing: 0, height: 21, replaces: [] })
}

if (import.meta.main) await writeModel('jax-treaty-oak', build())
