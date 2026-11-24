/**
 * Electro Spin, Luna Park, Coney Island: a Zamperla Disk'O, a round
 * platform of outward-facing seats that spins as it rolls back and forth
 * along a half-pipe track. Procedural, CC0-1.0.
 * bun generators/nyc-electro-spin.ts
 *
 * Map frame: x east, y north, z up, metres. Built with the track along +y;
 * the placement's bearing (4°) turns it to the real track, whose north end
 * stands a few metres east of its south end. The origin is the track's low
 * point, on the ground. Luna Park is level here, so elevation 0.
 *
 * Evidence and what rests on it:
 *   position and plan: USGS lidar (NY_NewYorkCity, flown 2017) shows the
 *     track as a ridge running from (park frame, metres from lon -73.9785,
 *     lat 40.5742) x -25.5, y -18 to x -22.4, y 23: 41 m long, turned about
 *     4° east of north, centred at lon -73.978784, lat 40.574223. The 2024
 *     NYS orthophoto shows the same red track, with the disc parked at its
 *     middle and the sign at its north end. The OSM node node/8816101458
 *     (Electro Spin, attraction=amusement_ride) is 1.5 m from the centre;
 *   the track's profile: measured, lidar, along its length: 1.8 m at the
 *     bottom, 4.6 m at 10 m out, 6.7 m at 14 m, 15.8 m at both ends. A
 *     circular arc of radius 22 m through the low point at 1.5 m (the rail
 *     top) fits every reading within 0.5 m;
 *   the disc, 7.4 m across: orthophoto (7 m ring of seats) and Zamperla's
 *     24-seat Disk'O; its height over the rail, the seats, the centre ball:
 *     estimated from the photos;
 *   the supports: an A-frame at each end and two pairs of legs between,
 *     from the orthophoto's shadows and the 2011 photo; their exact number
 *     is estimated;
 *   colours: a maroon-red track and legs, a red disc with a gold rim, red
 *     seats, an orange-red ball in the middle, and a round purple sign with a
 *     gold rim at the track's end, from the photos.
 *
 * Photos (EVIDENCE):
 *   "Luna Park Coney Island 3", Eliedion, CC BY-SA 3.0 (Wikimedia Commons,
 *     2011, the ride from above, from the Tickler)
 *   "Electro Spin", Loozrboy, CC BY-SA 2.0
 *     (flickr.com/photos/30624156@N00/6928438110, the disc tilted at a track
 *     end, and the sign)
 *   "Electro Spin", Studio Sarah Lou, CC BY 2.0
 *     (flickr.com/photos/86665756@N00/5857580296, the seats and the sign)
 *   "Luna Park", Roller Coaster Philosopher, CC BY 2.0
 *     (flickr.com/photos/32916425@N04/53159341193, 2023, the sign still up)
 * NYS ITS orthoimagery 2024 (orthos.its.ny.gov), public: the plan.
 * Look-only: none.
 *
 * Style: the track's lattice girder is drawn as one solid maroon box with
 * the rails as a broad band on top, not lattice; the legs are square tubes;
 * the sign is a plain disc with no lettering (not a landmark sign).
 *
 * Doubts: no recent ground-level photo of the track was found; the 2024
 * orthophoto and the 2023 photo of the sign show the ride is still there and
 * unchanged in plan. The sign's height and the leg layout are estimated.
 */
import { Part, cross, sub, writeGlb, type NodeSpec, type V3 } from './mesh'
import { finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A square-section beam from a to b, `w` wide and `h` deep, capped. */
function beam(p: Part, a: V3, b: V3, w: number, h = w) {
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
function prism(p: Part, x: number, y: number, z0: number, z1: number, r0: number, r1 = r0, n = 12, a0 = 0) {
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
function sphere(p: Part, c: V3, r: number, seg = 12, rings = 6) {
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

// ------------------------------------------------------------------ track ---
const R = 22, LOW = 1.5, HALF = 20.5   // arc radius, rail top at the bottom, half-length (lidar)
const railZ = (s: number) => LOW + R - Math.sqrt(R * R - s * s)
const TW = 2.4, GIRDER = 1.2           // track width; girder depth under the rail top

const track = new Part(), legs = track   // one maroon material for the track and its legs
{
  // The girder: a box swept along the arc, its section square to the track.
  const N = 24
  const rings: V3[][] = []
  for (let i = 0; i <= N; i++) {
    const s = -HALF + (2 * HALF * i) / N, z = railZ(s)
    const slope = s / Math.sqrt(R * R - s * s)
    const up = unit([0, -slope, 1])                         // normal to the track, upward
    const c: V3 = [0, s, z]
    const lo = add(c, mul(up, -GIRDER))
    // CCW seen from +y (the direction of travel): +x up, -x up, -x down, +x down.
    rings.push([add(c, [TW / 2, 0, 0]), add(c, [-TW / 2, 0, 0]), add(lo, [-TW / 2 + 0.35, 0, 0]), add(lo, [TW / 2 - 0.35, 0, 0])].map((p) => [p[0], p[1], p[2]] as V3))
  }
  // loft wants rings CCW from "above" along the sweep; the sweep runs along +y.
  for (let k = 0; k < rings.length - 1; k++) {
    const a = rings[k], b = rings[k + 1]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      track.quad(a[i], b[i], b[j], a[j])
    }
  }
  track.quad(rings[0][0], rings[0][1], rings[0][2], rings[0][3])
  const L = rings[N]
  track.quad(L[0], L[3], L[2], L[1])
}
// End towers: an A-frame across the track at each end, legs splayed east and west.
for (const sgn of [-1, 1]) {
  const s = sgn * (HALF - 0.6), z = railZ(s) - GIRDER + 0.2
  for (const x of [-1, 1]) {
    beam(legs, [x * 3.4, s + sgn * 0.6, 0], [x * 0.8, s, z], 0.7)
    beam(legs, [x * 2.6, s - sgn * 3.2, 0], [x * 0.8, s, z], 0.55)
  }
  beam(legs, [-2.2, s, z * 0.45], [2.2, s, z * 0.45], 0.3)
}
// Two pairs of legs under each slope, and a low cradle under the middle.
for (const s of [-12.5, 12.5, -6.5, 6.5]) {
  const z = railZ(s) - GIRDER + 0.2
  for (const x of [-1, 1]) beam(legs, [x * 2.2, s, 0], [x * 0.8, s, z], 0.55)
}
for (const x of [-1, 1]) beam(legs, [x * 1.6, 0, 0], [x * 0.7, 0, LOW - GIRDER + 0.2], 0.4)

// The sign: a round purple board with a gold rim on a post beyond the north end.
const sign = new Part(), gold = new Part()
{
  const sy = HALF + 1.4, cz = 15.2, r = 2.0
  beam(legs, [0, sy, 0], [0, sy, cz - r + 0.2], 0.4)
  const ring = (rad: number, y: number) => Array.from({ length: 16 }, (_, i): V3 => {
    const a = (-2 * Math.PI * i) / 16   // counter-clockwise seen from +y (north)
    return [rad * Math.cos(a), y, cz + rad * Math.sin(a)]
  })
  // A disc facing south and north: rings CCW seen from +y.
  const f = ring(r, sy - 0.2), b = ring(r, sy + 0.2)
  sign.loft([f, b])
  sign.cap(b, true)
  sign.cap(f, false)
  // Gold rims on both faces.
  for (const [y0, y1] of [[sy - 0.3, sy - 0.18], [sy + 0.18, sy + 0.3]]) {
    const o0 = ring(r + 0.15, y0), o1 = ring(r + 0.15, y1), i0 = ring(r - 0.25, y0), i1 = ring(r - 0.25, y1)
    gold.loft([o0, o1])
    gold.loft([i1.slice().reverse(), i0.slice().reverse()])
    for (let k = 0; k < 16; k++) {
      const l = (k + 1) % 16
      gold.quad(o1[k], i1[k], i1[l], o1[l])
      gold.quad(o0[k], o0[l], i0[l], i0[k])
    }
  }
}

// ------------------------------------------------------- the disc (a node) ---
// Authored in place, parked at the low point; its pivot is the origin.
const disc = new Part(), seat = new Part(), ball = new Part()
const DZ = LOW + 0.35, DR = 3.7
prism(disc, 0, 0, LOW, DZ, 1.2, 1.2, 12)                 // the bogie on the rails
prism(disc, 0, 0, DZ, DZ + 0.45, DR - 0.3, DR, 24)      // the dish
prism(gold, 0, 0, DZ + 0.45, DZ + 0.62, DR + 0.05, DR + 0.05, 24)
prism(disc, 0, 0, DZ + 0.45, DZ + 1.0, 1.5, 1.3, 12)    // the centre drum
for (let k = 0; k < 24; k++) {
  const a = (2 * Math.PI * k) / 24, c = Math.cos(a), s = Math.sin(a)
  const out: V3 = [c, s, 0], tan: V3 = [-s, c, 0]
  const at = (u: number, v: number, z: number): V3 => add(add(mul(out, u), mul(tan, v)), [0, 0, z])
  const box = (u0: number, u1: number, w: number, z0: number, z1: number) => {
    const ring = (z: number) => [at(u1, w, z), at(u0, w, z), at(u0, -w, z), at(u1, -w, z)]
    seat.loft([ring(z0), ring(z1)])
    seat.cap(ring(z1), true)
  }
  // Outward-facing seats: a back toward the middle, the pan outside it.
  box(2.35, 2.65, 0.32, DZ + 0.45, DZ + 1.65)
  box(2.65, 3.25, 0.3, DZ + 0.45, DZ + 0.95)
}
sphere(ball, [0, 0, DZ + 1.9], 0.95, 12, 6)

// ------------------------------------------------------------------ output ---
const maroon = finish('electro-maroon', 0x9c3a4b)
const red = finish('electro-red', 0xc8413d)
const parts = [
  { part: track, material: maroon },
  { part: sign, material: finish('neon-electro-spin', 0x8d58a6) },
  { part: gold, material: finish('electro-gold', 0xd6ae4c) },
]
const nodes: NodeSpec[] = [{
  name: 'disc',
  parts: [
    { part: disc, material: red },
    { part: seat, material: finish('electro-seat', 0xb8333b) },
    { part: ball, material: finish('electro-ball', 0xe07b45) },
  ],
}]
const all = [...parts, ...nodes.flatMap((n) => n.parts)]
const triangles = all.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Electro Spin', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 4, elevation: 0, height: 17.4, osm: 'node/8816101458',
}, { nodes })
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-electro-spin.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(all.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
