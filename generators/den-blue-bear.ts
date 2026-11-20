/**
 * I See What You Mean ("the Big Blue Bear"), Lawrence Argent, 2005, at the
 * Colorado Convention Center, Denver — original procedural geometry, CC0-1.0.
 * bun generators/den-blue-bear.ts
 *
 * A 12 m faceted blue bear standing on its hind legs, leaning in with its
 * nose and both forepaws pressed to the lobby's glass wall on 14th Street.
 *
 * Also exports `tube` and `blob`, small figure helpers (a lofted limb along a
 * spine, faceted or smooth, with rounded ends), used by den-the-dancers.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 215.6: the
 * model's +y (north) is the way the bear faces, south-west into the glass
 * (OSM way/26281758's 14th Street wall runs at 125.6°/305.6°). y = 0 is the
 * ground at its feet.
 *
 * Placement: anchor -104.9952556, 39.7436076, bearing 215.6. The bear is
 * about 8.1 m from paw to rump (scaled from mcleod, a square side view).
 * The lidar sees only its back 4.3 m: the front half, head and paws stand
 * under the convention center's canopy, which OSM's outline follows, so
 * the real glass is about 3.8 m inside that outline. Placed truly, the
 * head and paws would sit inside the map's 24 m extrusion of the
 * convention center and vanish. So the model is moved 3.9 m out, along its
 * own axis, until paws and snout meet OSM's wall line (y = +4.0 here; the
 * model reaches y = 3.95). Sideways it keeps the lidar's position; OSM
 * node/1353161210 falls at (1.9, 2.4) in this frame.
 *
 * Identity (from the photos below):
 *  1. The pose: upright on its hind legs, body leaning forward about 20°,
 *     the rump well back over the feet, head and paws at the glass.
 *                                                (fire, nick, mash, phase2)
 *  2. Both forepaws raised to the glass either side of the face, elbows
 *     dropped and out, "shading its eyes".               (wag1, wag2, nick)
 *  3. A short snout pressed to the glass, small round ears.  (mash, fire)
 *  4. Thick column legs on big flat feet.                (fire, phase2)
 *  5. Low-poly triangulated facets in one strong cobalt blue.
 *                                                (mcleod, fire, mash)
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, read
 * with tools/lidar_frame.py at bearing 215.6. The bear shows as a patch
 * about 4.8 m wide and 4.3 m deep outside the canopy; its back rises from
 * about 6 m over the rump through 8 to 10 m to 11.7 m at the head by the glass, with
 * ground at 0.2-0.3 m. The head is partly under the convention center's
 * 30 m canopy, so its top is sampled thinly. Published height 40 ft
 * (12.2 m; OSM height=40', Wikidata Q85768576). Model: ears 12.0 m, crown
 * of the head 11.5 m.
 * Measured: the width, the back profile and lean, the head height.
 * Estimated from the photos scaled to those (mcleod above all): the full
 * depth (8.1 m), the legs (about 2.2 m deep, feet 2.8 m long), the arm
 * and paw positions, the head's shape.
 *
 * Photos (evidence):
 *  nick    "Big Blue Bear at the Colorado Convention Center", NickCatal,
 *          CC BY 2.0, https://www.flickr.com/photos/17928381@N00/2794924179
 *          (bear's right side, from the north-west along the glass)
 *  mash    "The Big Blue Bear", Monkey Mash Button, CC BY-SA 2.0,
 *          https://www.flickr.com/photos/62698615@N08/5850798189 (head and
 *          paws at the glass, right side)
 *  fire    "Big Blue Denver Bear", firepile, CC BY 2.0,
 *          https://www.flickr.com/photos/17643132@N00/2421585966 (left
 *          rear three-quarter, whole bear)
 *  mcleod  "Big blue bear, Colorado Convention Center, Denver", Scott
 *          McLeod, CC BY 2.0, https://www.flickr.com/photos/93393982@N00/28017543641
 *          (right side, sunlit colour)
 *  phase2  "Big Blue Bear", @Phase2, CC BY 2.0,
 *          https://www.flickr.com/photos/34094027@N03/6875850732 (right side)
 *  wag1, wag2  "Denver Blue Bear 1" and "2", Roger Wagner, CC BY 2.0,
 *          https://www.flickr.com/photos/10135618@N05/4825203210 and /4824593709
 *          (from inside the lobby: the face between the two paws)
 *  wag3    "Denver Blue Bear 3", Roger Wagner, CC BY 2.0,
 *          https://www.flickr.com/photos/10135618@N05/4824593581
 *  dnc     "DNC 2008 (2807052700).jpg", freewheelinbiker, CC BY 2.0,
 *          https://commons.wikimedia.org/wiki/File:DNC_2008_(2807052700).jpg
 *          (far view along 14th Street with the building)
 * Look-only (seen in search results, not used for shape): many CC BY-NC
 * Flickr photos (Elizabeth Thomsen, MomentsForZen and others).
 * No commercial imagery.
 *
 * Doubts: the paws are drawn symmetric at eye level; in the side photos one
 * paw sits a little lower than the other. The back of the bear (seen from
 * the street side, south-east) is only in fire and dnc, both at a slant.
 * The facets are generic, not traced: the real triangulation is finer.
 *
 * Night: no evidence of floodlighting; the bear stays unlit (it reads as a
 * silhouette against the lit lobby, as in the night photos).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-flatiron-building'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))

/** A deterministic pseudo-random number in [-1, 1] from integers. */
export function hash(...k: number[]) {
  let h = 2166136261
  for (const v of k) h = Math.imul(h ^ (v * 2654435761), 16777619)
  return ((h >>> 0) % 10000) / 5000 - 1
}

/**
 * Where a triangle lands. `pick` chooses the part from the face normal (to
 * give down-facing faces a second tone); `smooth` gives per-vertex normals.
 */
export type Sink = { pick: (n: V3) => Part; smooth: boolean }

function emit(s: Sink, a: V3, b: V3, c: V3, inside: V3, na?: V3, nb?: V3, nc?: V3) {
  let g = cross(sub(b, a), sub(c, a))
  const ctr = mul(add(add(a, b), c), 1 / 3)
  if (dot(g, sub(ctr, inside)) < 0) {
    ;[b, c] = [c, b]
    ;[nb, nc] = [nc, nb]
    g = mul(g, -1)
  }
  const p = s.pick(unit(g))
  if (s.smooth && na && nb && nc) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  else p.tri(a, b, c)
}

/**
 * A limb lofted along a spine. `pts` are the spine points, `rad` the
 * half-widths at each [across, front-back], `side` a direction the
 * "across" axis leans to. n sides round. `jitter` roughens the rings
 * (fraction of the radius) for a faceted, carved look. Ends are closed
 * with a rounded cap that reaches `capK` times the end radius beyond the
 * end point (0 = flat).
 */
export function tube(s: Sink, pts: V3[], rad: [number, number][], side: V3, n = 8,
  o: { jitter?: number; seed?: number; capA?: number; capB?: number; phase?: number } = {}) {
  const J = o.jitter ?? 0, seed = o.seed ?? 1, ph = o.phase ?? Math.PI / n
  const rings: V3[][] = [], norms: V3[][] = []
  const tang = (i: number) => unit(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]))
  for (let i = 0; i < pts.length; i++) {
    const t = tang(i)
    const sx = unit(sub(side, mul(t, dot(side, t))))
    const fy = cross(t, sx)
    const [ra, rb] = rad[i]
    const ring: V3[] = [], nr: V3[] = []
    for (let k = 0; k < n; k++) {
      const a = ph + (k / n) * Math.PI * 2
      const j = 1 + J * hash(seed, i, k)
      const ca = Math.cos(a), sa = Math.sin(a)
      ring.push(add(pts[i], add(mul(sx, ca * ra * j), mul(fy, sa * rb * j))))
      nr.push(unit(add(mul(sx, ca / ra), mul(fy, sa / rb))))
    }
    rings.push(ring); norms.push(nr)
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const inside = mul(add(pts[i], pts[i + 1]), 0.5)
    for (let k = 0; k < n; k++) {
      const l = (k + 1) % n
      const a = rings[i][k], b = rings[i][l], c = rings[i + 1][l], d = rings[i + 1][k]
      emit(s, a, b, c, inside, norms[i][k], norms[i][l], norms[i + 1][l])
      emit(s, a, c, d, inside, norms[i][k], norms[i + 1][l], norms[i + 1][k])
    }
  }
  const cap = (i: number, dir: number, kk: number) => {
    const t = mul(tang(i), dir), r = Math.min(...rad[i])
    if (kk <= 0) {
      const c = pts[i]
      for (let k = 0; k < n; k++) emit(s, c, rings[i][k], rings[i][(k + 1) % n], sub(c, t), t, t, t)
      return
    }
    // a half-way ring, pulled in, then a tip
    const midR = rings[i].map((q) => add(add(pts[i], mul(sub(q, pts[i]), 0.72)), mul(t, r * kk * 0.62)))
    const midN = norms[i].map((q) => unit(add(q, t)))
    const tip = add(pts[i], mul(t, r * kk))
    const inside = pts[i]
    for (let k = 0; k < n; k++) {
      const l = (k + 1) % n
      emit(s, rings[i][k], rings[i][l], midR[l], inside, norms[i][k], norms[i][l], midN[l])
      emit(s, rings[i][k], midR[l], midR[k], inside, norms[i][k], midN[l], midN[k])
      emit(s, midR[k], midR[l], tip, inside, midN[k], midN[l], t)
    }
  }
  cap(0, -1, o.capA ?? 0.8)
  cap(pts.length - 1, 1, o.capB ?? 0.8)
}

/** An ellipsoid (rx, ry, rz) about c, as a short vertical tube with round caps. */
export function blob(s: Sink, c: V3, rx: number, ry: number, rz: number, n = 8, o: { jitter?: number; seed?: number; tilt?: V3 } = {}) {
  const ax = unit(o.tilt ?? [0, 0, 1])
  const side: V3 = Math.abs(ax[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const k = [-0.62, -0.3, 0.3, 0.62]
  const pts = k.map((f) => add(c, mul(ax, rz * f)))
  const rad = k.map((f) => { const w = Math.sqrt(1 - f * f); return [rx * w, ry * w] as [number, number] })
  tube(s, pts, rad, side, n, { jitter: o.jitter, seed: o.seed, capA: (0.38 * rz) / Math.min(...rad[0]), capB: (0.38 * rz) / Math.min(...rad[3]) })
}

/** Drop the parts so the lowest vertex sits exactly on y = 0 (glTF up). */
export function ground(parts: Part[]) {
  let m = Infinity
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) m = Math.min(m, p.pos[i])
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= m
}

// ──────────────────────────────── the bear ─────────────────────────────────

if (import.meta.main) {
  const blue = new Part(), shade = new Part()
  const S: Sink = { pick: (n) => (n[2] < -0.45 ? shade : blue), smooth: false }
  const J = 0.06

  for (const sx of [-1, 1]) {
    const x = (v: number) => sx * v
    const back = sx > 0 ? 0 : -0.35 // the left foot sits a little further back
    // foot: long, low and flat, toes toward the glass
    tube(S, [[x(1.2), -2.25 + back, 0.48], [x(1.25), -0.75 + back, 0.55], [x(1.3), 0.55 + back, 0.45]],
      [[0.66, 0.48], [0.82, 0.55], [0.72, 0.45]], [1, 0, 0], 8, { jitter: J, seed: 10 + sx, capA: 0.5, capB: 0.65 })
    // leg: short and deep, from the ankle up into the haunch
    tube(S, [[x(1.2), -1.0 + back / 2, 0.4], [x(1.22), -1.05, 1.3], [x(1.2), -1.2, 2.3], [x(1.1), -1.45, 3.3], [x(0.95), -1.6, 4.2]],
      [[0.86, 1.0], [0.92, 1.1], [1.02, 1.25], [1.15, 1.5], [1.1, 1.5]], [1, 0, 0], 9, { jitter: J, seed: 20 + sx, capA: 0, capB: 0.3 })
    // arm: shoulder, elbow dropped and out, forearm forward and up to the paw
    tube(S, [[x(1.45), -0.75, 9.7], [x(2.0), 0.15, 9.0], [x(2.3), 0.95, 8.35], [x(2.2), 2.0, 8.85], [x(1.9), 3.05, 9.65]],
      [[0.85, 0.85], [0.78, 0.78], [0.7, 0.7], [0.62, 0.62], [0.55, 0.55]], [0, 0, 1], 8, { jitter: J, seed: 30 + sx, capA: 0.3, capB: 0.2 })
    // paw: a broad pad flat against the glass, beside the eyes
    blob(S, [x(1.75), 3.52, 10.0], 0.64, 0.36, 0.78, 8, { jitter: J, seed: 40 + sx, tilt: [sx * -0.1, 0.25, 1] })
    // ear
    blob(S, [x(0.7), 1.95, 11.65], 0.32, 0.22, 0.42, 6, { jitter: 0.05, seed: 50 + sx, tilt: [sx * 0.3, -0.3, 1] })
  }
  // body: a big leaning pear — haunches, rump, belly, chest, shoulder hump, neck
  tube(S, [[0, -1.6, 2.7], [0, -1.8, 3.9], [0, -1.8, 5.1], [0, -1.6, 6.3], [0, -1.1, 7.6], [0, -0.3, 8.9], [0, 0.55, 10.0], [0, 1.2, 10.6]],
    [[1.75, 1.65], [2.05, 2.05], [2.2, 2.28], [2.22, 2.3], [2.12, 2.08], [1.95, 1.8], [1.6, 1.5], [1.15, 1.1]], [1, 0, 0], 12,
    { jitter: J, seed: 60, capA: 0.7, capB: 0.0 })
  // head: cranium, then the muzzle bowed down to the glass
  tube(S, [[0, 1.05, 10.9], [0, 1.75, 11.0], [0, 2.45, 10.8], [0, 2.95, 10.4]],
    [[0.95, 0.85], [1.05, 0.92], [0.92, 0.8], [0.62, 0.55]], [1, 0, 0], 9, { jitter: 0.05, seed: 70, capA: 0.9, capB: 0.0 })
  tube(S, [[0, 2.9, 10.4], [0, 3.15, 10.2], [0, 3.35, 10.05]], [[0.55, 0.48], [0.46, 0.4], [0.32, 0.28]], [1, 0, 0], 7,
    { jitter: 0.04, seed: 80, capA: 0, capB: 0.0 })

  ground([blue, shade])
  await save('den-blue-bear', 'I See What You Mean (Big Blue Bear)', [
    { part: blue, material: finish('bear-blue', 0x3f72bd) },
    { part: shade, material: finish('bear-blue-shade', 0x33609f) },
  ], {}, 5000)
}
