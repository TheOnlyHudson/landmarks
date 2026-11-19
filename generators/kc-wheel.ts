/**
 * KC Wheel, Pennway Point, Kansas City, Missouri (ICON Experiences; Dutch
 * Wheels R50SV, opened December 2023) — original procedural geometry,
 * CC0-1.0.
 * bun generators/kc-wheel.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground under the
 * axle. The wheel turns in the y–z plane, so its axle runs along x. Placed
 * at bearing 338°, so the axle runs 68°/248° and the wheel's face looks
 * east-north-east toward Union Station and west-south-west toward I-35.
 *
 * Identity: a white wheel with a slim tube rim, eighteen white lattice
 * spokes from a big white ball hub, 36 white capsule gondolas carried
 * outside the rim, two white A-frames splayed in the wheel's plane, and at
 * night LED lines along the rim and every spoke (colour-changing; drawn
 * warm white, as in most photos).
 *
 * It turns (experimental; see "Animation" in STYLE.md): the wheel is a node
 * at the axle; each gondola is a child node at its pivot, turned back as
 * the wheel turns so it stays level. One turn takes 90 s here (the real
 * ride is about 12 minutes for a few turns), like the other wheels.
 *
 * Evidence:
 *  - OSM node/11187044804 (name=KC Wheel, height=46): the anchor and the
 *    height. The wheel has no outline in OSM, so `replaces` is empty; the
 *    mini-golf beneath it (way/1373558952) is leisure, not a building.
 *  - Published: 150 ft (45.7 m), 36 climate-controlled gondolas, six
 *    riders each (one four-seat VIP), Dutch Wheels R50SV, rim-bar and spoke
 *    LED lighting, opened December 2023 (dutchwheels.com project page;
 *    KCUR and Startland News, December 2023).
 *  - Lidar and NAIP: none usable. USGS 3DEP here is the 2020 flight and the
 *    newest NAIP is 2022, both before the wheel went up (2023), so the
 *    height is the published one and the plan is from the sources below.
 *  - Mapterhorn terrain: the lot slopes ≈1.5 m up to the south-east under
 *    the footprint; the model stands on its lowest point (elevation 0).
 *  - Estimated: axle 23.7 m and rim centre line R 19.2 m, so the top
 *    gondola reaches 45.5 m and the bottom one clears the boarding deck;
 *    gondola size (≈2 m along the rim and across, 2.4 m tall) from their
 *    spacing; hub ball Ø5.2 m; A-frame feet ±12.5 m along the wheel's plane
 *    and ±6 m along the axle; boarding deck 10 × 7 × 1.5 m.
 *  - Estimated, with doubt: the orientation. No open photo or imagery
 *    shows it (Commons, Openverse, Flickr CC: none; Mapillary needs a
 *    token we don't have). The bearing comes from two look-only
 *    manufacturer photos (Dutch Wheels / ICON Experiences, no licence):
 *    the wheel is seen nearly face-on both from the south-west (Union
 *    Station and the Kansas City Ballet behind it) and from the east-north-
 *    east at sunset (I-35 across the frame), which puts the axle near
 *    65–75°. Rider reports that gondola doors face the skyline (north)
 *    fit that roughly. Treat ±20° as possible.
 *  - Look-only (described, not copied): the two Dutch Wheels photos above
 *    (dutchwheels.com/en/portfolio/kc-wheel-kansas-city) for colours (all
 *    white), the outboard gondolas, the ball hub and the A-frames.
 *
 * No licensed photo of the wheel was found; no commercial imagery used.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const H = 23.7            // axle height
const R = 19.2            // rim centre line
const RG = 20.5           // gondola pivots, outside the rim
const FACE = 0.8          // rim faces from the mid-plane
const N_CARS = 36
const N_SPOKES = 18
const SEG = 36

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
/** A point on the wheel at radius r, angle t (0 = north, π/2 = up), axle offset x, about the axle. */
const wheel = (r: number, t: number, x: number): V3 => [x, r * Math.cos(t), r * Math.sin(t)]

function tri(p: Part, v: V3[], n: V3[]) {
  const face = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(face, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}
type Profile = [number, number][]
const rect = (a: number, b: number): Profile => [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

function sweep(p: Part, path: V3[], frames: { N: V3; B: V3 }[], profiles: Profile[], closed = false, caps = false) {
  const m = profiles[0].length
  const at = (i: number, k: number) => {
    const [a, b] = profiles[i][k]
    return add(path[i], add(mul(frames[i].N, a), mul(frames[i].B, b)))
  }
  const normal = (i: number, k: number) => {
    const [a, b] = profiles[i][k], [c, d] = profiles[i][(k + 1) % m]
    return unit(add(mul(frames[i].N, d - b), mul(frames[i].B, -(c - a))))
  }
  const last = closed ? path.length : path.length - 1
  for (let i = 0; i < last; i++) {
    const j = (i + 1) % path.length
    for (let k = 0; k < m; k++) {
      const l = (k + 1) % m
      const ni = normal(i, k), nj = normal(j, k)
      tri(p, [at(i, k), at(i, l), at(j, l)], [ni, ni, nj])
      tri(p, [at(i, k), at(j, l), at(j, k)], [ni, nj, nj])
    }
  }
  if (caps && !closed) {
    const n = path.length - 1
    fan(p, profiles[0].map((_, k) => at(0, k)), unit(sub(path[0], path[1])))
    fan(p, profiles[n].map((_, k) => at(n, k)), unit(sub(path[n], path[n - 1])))
  }
}
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([0, 1, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}
/** A ball of radius r at c, `n` segments round and n/2 up. */
function ball(p: Part, c: V3, r: number, n = 14) {
  const P = (i: number, j: number): V3 => {
    const t = (i / n) * TAU, f = -Math.PI / 2 + (j / (n / 2)) * Math.PI
    return [Math.cos(f) * Math.cos(t), Math.cos(f) * Math.sin(t), Math.sin(f)]
  }
  for (let j = 0; j < n / 2; j++)
    for (let i = 0; i < n; i++) {
      const q = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]
      const v = q.map((u) => add(c, mul(u, r)))
      tri(p, [v[0], v[1], v[2]], [q[0], q[1], q[2]])
      tri(p, [v[0], v[2], v[3]], [q[0], q[2], q[3]])
    }
}

// --- the turning wheel (authored about the axle) -------------------------------
const led = new Part()     // rim and spokes, which carry the LED lines
const white = new Part()   // hub
// Rim: one slim tube band, 0.9 m deep and 1.6 m across.
{
  const path = Array.from({ length: SEG }, (_, i) => wheel(R, (i + 0.5) / SEG * TAU, 0))
  const frames = path.map((q) => ({ N: unit([0, q[1], q[2]] as V3), B: [1, 0, 0] as V3 }))
  sweep(led, path, frames, path.map(() => rect(0.45, FACE)), true)
}
// Spokes: eighteen lattice trusses, each drawn as a pair of members from
// the hub's two ends converging on the rim, as the real ones taper.
const HUB_X = 2.6
for (let k = 0; k < N_SPOKES; k++) {
  const t = (k + 0.5) / N_SPOKES * TAU
  for (const s of [-1, 1])
    beam(led, wheel(1.6, t, s * HUB_X), wheel(R - 0.45, t, s * FACE * 0.6), rect(0.26, 0.2), rect(0.2, 0.16), [1, 0, 0], false)
}
// Hub: the white ball and its axle drum.
ball(white, [0, 0, 0], 2.6, 14)
beam(white, [-HUB_X - 0.8, 0, 0], [HUB_X + 0.8, 0, 0], circle(1.1, 12), circle(1.1, 12), [0, 0, 1])

// --- gondolas -------------------------------------------------------------------------
/** A capsule centred on its pivot: 2 m along the rim, 2.1 m across, 2.4 m tall, with a window band. */
const body = new Part(), glazing = new Part()
{
  const ring = (z: number, a: number, b: number): V3[] => {
    const pts: V3[] = []
    for (let i = 0; i < 8; i++) {
      const t = ((i + 0.5) / 8) * TAU
      pts.push([a * Math.cos(t), b * Math.sin(t), z])
    }
    return pts
  }
  const lo = -1.2, hi = 1.2
  const rings = [ring(lo, 0.6, 0.65), ring(lo + 0.3, 1.0, 1.05), ring(-0.2, 1.05, 1.1), ring(0.75, 1.05, 1.1), ring(hi, 0.7, 0.75)]
  // Bottom and roof white, the window band dark.
  body.loft([rings[0], rings[1], rings[2]])
  glazing.loft([rings[2], rings[3]])
  body.loft([rings[3], rings[4]])
  body.cap(rings[4], true)
  body.cap(rings[0], false)
}

// --- motion -----------------------------------------------------------------------------
const LOOP = 90
const KEYS = 36
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [1, 0, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const level: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const WHITE: MaterialSpec = finish('wheel-white', 0xf1f0ec, 0.6)
// The rim bar and spokes carry the LEDs, so they glow after dark.
const LED: MaterialSpec = finish('neon-wheel-led', 0xf5f0e4, 0.5)
const CABIN: MaterialSpec = finish('gondola-white', 0xe4e7ea, 0.5)
const GLAZING: MaterialSpec = PALETTE.window

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: led, material: LED }, { part: white, material: WHITE }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const car = [{ part: body, material: CABIN }, { part: glazing, material: GLAZING }]
for (let k = 0; k < N_CARS; k++) {
  const t = -Math.PI / 2 + (k / N_CARS) * TAU   // one gondola at the bottom, at the platform
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(RG, t, 0), parts: car })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: level })
}

// --- static: A-frames and the boarding deck ------------------------------------------
const legs = new Part(), deck = new Part()
for (const sx of [-1, 1])
  for (const sy of [-1, 1]) {
    const foot: V3 = [sx * 6.0, sy * 12.5, 0]
    beam(legs, [foot[0], foot[1], 0.8], [sx * (HUB_X + 0.5), sy * 0.4, H - 0.3], circle(0.75, 10), circle(0.55, 10))
    beam(legs, [foot[0], foot[1], 0], [foot[0], foot[1], 1.0], rect(1.2, 1.2), rect(1.1, 1.1), [1, 0, 0])
  }
// Boarding deck under the lowest gondola, with stairs' landing to the north.
beam(deck, [0, 0, 0], [0, 0, 1.5], rect(3.5, 5.0), rect(3.5, 5.0), [1, 0, 0])

const parts = [{ part: legs, material: WHITE }, { part: deck, material: PALETTE.roof }]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('KC Wheel', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 45.5, bearing: 338,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/kc-wheel.glb', import.meta.url), glb)
console.log(`kc-wheel.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
