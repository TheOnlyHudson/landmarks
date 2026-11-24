/**
 * Brooklyn Flyer, Luna Park, Coney Island: a tower swing ride. Procedural,
 * CC0-1.0.
 * bun generators/nyc-brooklyn-flyer.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the ride is round).
 * The origin is the foot of the mast, on the ground. Luna Park is level
 * here, so elevation 0.
 *
 * The ride. A tall cream lattice mast with a gilded crown, and round it a
 * star of 14 cream arms that carries the swings: double seats in red, each
 * hung from an arm's tip on chains. When it runs, the star climbs the mast
 * and turns, and the seats fly out. At rest (and in every overhead image),
 * the star sits low on the mast with the seats hanging down to the
 * platform. That rest pose is what is drawn; the star and its seats are their
 * own node, so they can be animated later.
 *
 * Evidence and what rests on it:
 *   position: USGS lidar (NY_NewYorkCity, flown 2017), the mast's top cells
 *     centred at lon -73.978681, lat 40.574513, a metre from the OSM node
 *     node/8816101473 (Brooklyn Flyer, attraction=amusement_ride);
 *   mast 29.4 m to the top of the crown: measured, lidar (highest cells over
 *     ground_min, which is the platform here);
 *   the star at rest: lidar puts a ring of returns 6.3 m up (mean), out to a
 *     radius of 6.5 m; NYS orthoimagery (2024) shows 14 pale arms, about
 *     6 m long, and the seats' circle on the platform about 15 m across;
 *   the arms rising a little to their tips, the seats hanging to the ground
 *     at rest: the July 2019 photo from Surf Avenue (below);
 *   the mast's section (about 1.2 m, tapering a little), the crown's form,
 *     the hub and the stays: estimated from the photos;
 *   colours: cream mast and arms, gold crown, red seats, from the photos.
 *
 * Photos (EVIDENCE):
 *   "Coney Island Brooklyn Jul 2019 93", Epicgenius, CC BY-SA 4.0
 *     (Wikimedia Commons; the ride at rest, seen from Surf Avenue)
 *   "Luna Park", Roller Coaster Philosopher, CC BY 2.0
 *     (flickr.com/photos/32916425@N04/53159341333 and /53159341193, 2023,
 *     the ride running, so it is still there)
 *   "Brooklyn Flyer", Studio Sarah Lou, CC BY 2.0
 *     (flickr.com/photos/86665756@N00/5857562006, /5857573528, /5857024313,
 *     2011, the star and arms from below)
 *   "Coney Island Towers", edenpictures, CC BY 2.0
 *     (flickr.com/photos/10485077@N06/9115233427, the mast)
 * NYS ITS orthoimagery 2024 (orthos.its.ny.gov), public: the plan.
 * Look-only: none.
 *
 * Style: the lattice mast is a solid, slightly tapered square shaft, not
 * lattice; chains are drawn as one thin rod per side of each seat; no
 * lights or lettering.
 *
 * Doubts: the published height (none found) — the lidar's 29.4 m is used;
 * the star's exact rest height; the seat count (14, one per arm, from the
 * orthophoto).
 */
import { Part, cross, sub, writeGlb, type NodeSpec, type V3 } from './mesh'
import { finish } from './palette'

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/**
 * A square-section beam from a to b, `w` wide and `h` deep, capped. Shared
 * with nyc-electro-spin.ts.
 */
export function beam(p: Part, a: V3, b: V3, w: number, h = w) {
  const t = unit(sub(b, a))
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const s = unit(cross(t, ref)), n = cross(t, s)
  const ring = (c: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => add(c, add(mul(s, (i * w) / 2), mul(n, (j * h) / 2))))
  // A leg that starts on the ground is cut flat there, so a slanted foot
  // doesn't dip below y = 0.
  const r0 = ring(a).map((q): V3 => (a[2] === 0 ? [q[0], q[1], 0] : q)), r1 = ring(b)
  p.loft([r0, r1])
  p.cap(r1, true)
  p.cap(r0, false)
}

/** A vertical prism (or frustum) about (x, y), radius r0 at z0 and r1 at z1. */
export function prism(p: Part, x: number, y: number, z0: number, z1: number, r0: number, r1 = r0, n = 12, a0 = 0) {
  const ring = (z: number, r: number) => Array.from({ length: n }, (_, i): V3 => {
    const a = a0 + (2 * Math.PI * i) / n
    return [x + r * Math.cos(a), y + r * Math.sin(a), z]
  })
  const lo = ring(z0, r0), hi = ring(z1, r1)
  p.loft([lo, hi])
  if (r1 > 0) p.cap(hi, true)
  if (r0 > 0) p.cap(lo, false)
}

/** A smooth sphere. */
export function sphere(p: Part, c: V3, r: number, seg = 12, rings = 6) {
  const pt = (i: number, j: number): V3 => {
    const th = (Math.PI * j) / rings, ph = (2 * Math.PI * i) / seg
    return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const q = [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)]
    const v = q.map((u) => add(c, mul(u, r)))
    if (j > 0) p.tri(v[0], v[2], v[1], [0, 0], [0, 0], [0, 0], [q[0], q[2], q[1]])
    if (j < rings - 1) p.tri(v[0], v[3], v[2], [0, 0], [0, 0], [0, 0], [q[0], q[3], q[2]])
  }
}

// ------------------------------------------------------------- dimensions ---
const TOP = 29.4            // crown top, lidar
const MAST_TOP = 26.6       // top of the square shaft; the crown above it
const STAR_Z = 5.6          // hub centre at rest (lidar ring mean 6.3 at the arm tips)
const ARMS = 14, ARM_R = 6.2, TIP_RISE = 0.9
const SEAT_Z = 0.35         // seat pan underside, at rest on the platform

const mast = new Part(), crown = new Part()
const starCream = new Part(), seats = new Part(), chains = new Part()

// The base housing and the mast: a square shaft tapering from 1.3 m to 0.95 m.
prism(mast, 0, 0, 0, 1.4, 2.0, 1.8, 8, Math.PI / 8)
{
  const sq = (z: number, h: number): V3[] => [[h, h, z], [-h, h, z], [-h, -h, z], [h, -h, z]]
  const rings = [sq(1.4, 0.65), sq(MAST_TOP, 0.48)]
  mast.loft(rings)
  mast.cap(rings[1], true)
  // A cap band where the shaft meets the crown.
  prism(mast, 0, 0, MAST_TOP, MAST_TOP + 0.5, 0.85, 0.85, 8, Math.PI / 8)
}
// The crown: a gilded drum, a bulb and a finial.
prism(crown, 0, 0, MAST_TOP + 0.5, MAST_TOP + 1.3, 0.7, 1.0, 12)
prism(crown, 0, 0, MAST_TOP + 1.3, MAST_TOP + 1.5, 1.0, 0.6, 12)
sphere(crown, [0, 0, MAST_TOP + 2.0], 0.55, 10, 5)
prism(crown, 0, 0, MAST_TOP + 2.4, TOP, 0.12, 0.02, 6)

// ------------------------------------------- the star and seats (its node) ---
// Authored in place. The node's pivot is the foot of the mast, on its axis:
// the star turns about that axis and climbs along it, so no offset is needed
// (and the model's lowest point stays at y = 0 in every reader).
const Z = STAR_Z
prism(starCream, 0, 0, Z - 0.8, Z + 0.8, 1.05, 1.05, 14)
prism(starCream, 0, 0, Z + 0.8, Z + 2.2, 1.05, 0.62, 14)
for (let k = 0; k < ARMS; k++) {
  const a = (2 * Math.PI * (k + 0.5)) / ARMS, c = Math.cos(a), s = Math.sin(a)
  const tip: V3 = [ARM_R * c, ARM_R * s, Z + TIP_RISE]
  beam(starCream, [0.9 * c, 0.9 * s, Z - 0.3], tip, 0.32, 0.36)
  // A stay from the hub's top to the arm's outer third.
  beam(starCream, [0.6 * c, 0.6 * s, Z + 2.1], [4.2 * c, 4.2 * s, Z + 0.75], 0.16)
  // The seat: a double seat facing along the turn, hanging below the tip.
  const tz = Z + TIP_RISE - 0.2, sz = SEAT_Z
  const tang: V3 = [-s, c, 0], out: V3 = [c, s, 0]
  const at = (u: number, v: number, z: number): V3 => add(add(mul(out, ARM_R + u), mul(tang, v)), [0, 0, z])
  const box = (u0: number, u1: number, v0: number, v1: number, z0: number, z1: number) => {
    const ring = (z: number) => [at(u1, v1, z), at(u0, v1, z), at(u0, v0, z), at(u1, v0, z)]
    seats.loft([ring(z0), ring(z1)])
    seats.cap(ring(z1), true)
    seats.cap(ring(z0), false)
  }
  box(-0.6, 0.6, -0.35, 0.3, sz, sz + 0.45)          // the pan
  box(-0.6, 0.6, -0.45, -0.25, sz + 0.45, sz + 1.25)  // the back
  for (const u of [-0.5, 0.5]) beam(chains, at(u * 0.6, 0, tz), at(u, -0.05, sz + 0.45), 0.09)
}

// ------------------------------------------------------------------ output ---
// Only when run directly; nyc-electro-spin.ts imports the helpers above.
if (import.meta.main) {
  const cream = finish('flyer-cream', 0xe9ddb4)
  const parts = [
    { part: mast, material: cream },
    { part: crown, material: finish('neon-flyer-crown', 0xd9b24c) },
  ]
  const nodes: NodeSpec[] = [{
    name: 'star',
    parts: [
      { part: starCream, material: cream },
      { part: seats, material: finish('flyer-seat-red', 0xc9483f) },
      { part: chains, material: finish('flyer-chain', 0x8d8f93) },
    ],
  }]
  const all = [...parts, ...nodes.flatMap((n) => n.parts)]
  const triangles = all.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Brooklyn Flyer', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: TOP, osm: 'node/8816101473',
  }, { nodes })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/nyc-brooklyn-flyer.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
  console.log(all.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
}
