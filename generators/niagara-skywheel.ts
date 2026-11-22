/**
 * Niagara SkyWheel, Clifton Hill, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-skywheel.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the plaza under the
 * hub. The wheel turns in the x-z plane, so its axle runs along y. Placed at
 * bearing 30: OSM's attraction outline of the wheel (way/232194135, a thin
 * rectangle along the wheel's plane) runs 120/300 degrees, and the 2007 view
 * from the Skylon (looking north-east) shows the wheel face-on, so the
 * model's x axis is turned onto 120 degrees. Anchor at the middle of that
 * outline, 2 m from OSM's ferris_wheel node/1885295340.
 *
 * A 2006 observation wheel of the same Dutch design as the Seattle Great
 * Wheel (2012): 175 ft (53 m) tall, 42 enclosed gondolas, 21 trussed spokes
 * fanning from a white ball over the hub, a twin-chord rim, carried on two
 * white A-frames of tubular legs; a curved white canopy over the boarding
 * platform. This generator follows generators/sea-great-wheel.ts, scaled
 * to the published height, with this wheel's own canopy.
 *
 * It stands on the plaza beside the Great Canadian Midway (way/178352542),
 * not on its roof: the 2007 Skylon view and the street photos show the legs
 * and canopy on the ground of the courtyard, with the Midway's flat roof to
 * the east. So the Midway is not part of the model and stays drawn.
 *
 * Evidence:
 * - Published: 175 ft / 53 m, 42 gondolas, opened 2006 (Wikipedia,
 *   "Niagara SkyWheel", Q1217710).
 * - OSM: the wheel's plane and centre (way/232194135, node/1885295340).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "View of Clifton Hill and Niagara SkyWheel from Skylon Tower, Niagara
 *     Falls, Canada, 2007.jpg", DimiTalen, CC0 (from the south-west, high):
 *     21 spokes, the hub ball, the gondola ring, the white vaulted canopy
 *     between the legs, the plaza around it;
 *   - "Clifton Hill, Niagara Falls, Ontario 01.jpg", K2HWY, CC BY 4.0
 *     (from the north-west, street): white legs and rim, dark gondola glass;
 *   - "Niagara SkyWheel, Niagara Falls, Ontario.jpg", Magnolia677, CC BY 4.0
 *     (night, from the south-west): lit spokes and rim, floodlit legs, the
 *     canopy's arched front;
 *   - "Niagara Skywheel and Other Attractions (40484212200).jpg",
 *     formulanone, CC BY-SA 2.0 (from the Skylon, south-west): placement
 *     among Clifton Hill.
 * - Derived: hub at 27.3 m, rim centre line 23.1 m, gondola centres 24.4 m,
 *   so the top gondola's roof is at 53 m and the bottom one boards at 1.6 m.
 * - Estimated (from the photos, and from the Seattle wheel's lidar, the same
 *   design): leg feet ±9.5 m along the plane and ±8.2 m off it; gondola
 *   size; the canopy (about 22 m along the plane, 12 m across, 6 m high).
 * - Simplified: rim and spokes are trusses, drawn as broad members; the
 *   thin inner cable ring is left out. The LED light show is the rim,
 *   spokes and ball as `neon-skywheel-white`.
 * No lidar (Ontario). No commercial imagery.
 *
 * It turns (experimental; see "Animation" in STYLE.md), as the Wonder Wheel
 * and the Great Wheel do: the wheel is a glTF node at the hub, each gondola a
 * child node turned back by as much as the wheel turns, so it stays plumb.
 *
 * Replaces nothing: OSM maps the wheel as a node and an attraction area,
 * not a building. The plaza is flat to about 1 m (Mapterhorn), elevation 0.
 * Doubt: the small booth way/1144956248 just south-west of the canopy (the
 * ticket building) is left drawn; the canopy and the south leg foot reach
 * its north edge (17% of it, by the overlap check).
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE } from './palette'

const TAU = Math.PI * 2
const H = 27.3        // hub height above the plaza
const R_RIM = 23.1    // rim centre line
const R_CAR = 24.4    // gondola centres: their tops at 53 m
const CHORD = 1.3     // each rim chord's distance from the mid-plane
const CARS = 42
const SPOKES = 21

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
/** A point on the wheel at radius r, angle t (0 = +x, π/2 = up), off-plane y, relative to the hub. */
const wheel = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

/** A triangle whose winding follows its normals, whatever order it came in. */
function tri(p: Part, v: V3[], n: V3[]) {
  const face = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(face, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}

type Profile = [number, number][]
const rect = (a: number, b: number, c = 0): Profile => c
  ? [[-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c]]
  : [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

/** Sweep a profile along a path; flat across the section, smooth along the path (or `smooth` round it). */
function sweep(p: Part, path: V3[], frames: { N: V3; B: V3 }[], profiles: Profile[], closed = false, caps = false, smooth = false) {
  const m = profiles[0].length
  const at = (i: number, k: number) => {
    const [a, b] = profiles[i][k]
    return add(path[i], add(mul(frames[i].N, a), mul(frames[i].B, b)))
  }
  const facet = (i: number, k: number) => {
    const [a, b] = profiles[i][k], [c, d] = profiles[i][(k + 1) % m]
    return unit(add(mul(frames[i].N, d - b), mul(frames[i].B, -(c - a))))
  }
  const radial = (i: number, k: number) => {
    const [a, b] = profiles[i][k]
    return unit(add(mul(frames[i].N, a), mul(frames[i].B, b)))
  }
  const last = closed ? path.length : path.length - 1
  for (let i = 0; i < last; i++) {
    const j = (i + 1) % path.length
    for (let k = 0; k < m; k++) {
      const l = (k + 1) % m
      if (smooth) {
        tri(p, [at(i, k), at(i, l), at(j, l)], [radial(i, k), radial(i, l), radial(j, l)])
        tri(p, [at(i, k), at(j, l), at(j, k)], [radial(i, k), radial(j, l), radial(j, k)])
      } else {
        const ni = facet(i, k), nj = facet(j, k)
        tri(p, [at(i, k), at(i, l), at(j, l)], [ni, ni, nj])
        tri(p, [at(i, k), at(j, l), at(j, k)], [ni, nj, nj])
      }
    }
  }
  if (caps && !closed) {
    const n = path.length - 1
    fan(p, profiles[0].map((_, k) => at(0, k)), unit(sub(path[0], path[1])))
    fan(p, profiles[n].map((_, k) => at(n, k)), unit(sub(path[n], path[n - 1])))
  }
}
/** Frames for a path in a plane of constant y: B across it. */
function inPlane(path: V3[], closed: boolean) {
  return path.map((_, i) => {
    const prev = path[closed ? (i + path.length - 1) % path.length : Math.max(0, i - 1)]
    const next = path[closed ? (i + 1) % path.length : Math.min(path.length - 1, i + 1)]
    const T = unit(sub(next, prev)), B: V3 = [0, 1, 0]
    return { N: unit(cross(T, B)), B }
  })
}
/** A straight member from a to b, tapering from section s0 to s1. */
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true, smooth = false) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps, smooth)
}
/** A smooth UV sphere. */
function sphere(p: Part, c: V3, r: number, seg = 14, rings = 8) {
  const pt = (i: number, j: number): V3 => {
    const th = (j / rings) * Math.PI, ph = (i / seg) * TAU
    return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const q = [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)]
    const v = q.map((n) => add(c, mul(n, r)))
    if (j > 0) tri(p, [v[0], v[2], v[1]], [q[0], q[2], q[1]])
    if (j < rings - 1) tri(p, [v[0], v[3], v[2]], [q[0], q[3], q[2]])
  }
}

// --- Materials ----------------------------------------------------------------
// The whole structure is painted white; the gondolas are dark tinted glass
// with white roofs and floors (Commons daylight photos, K2HWY 2017 and the
// 2007 view from the Skylon). The glass is the palette's window slate a shade
// darker, so the ring of gondolas reads as dark beads against the white rim;
// it glows at night like the lit cars. The legs and canopy are floodlit at
// night (Magnolia677's night photo).
const WHITE: MaterialSpec = { name: 'skywheel-white', color: 0xf1f0ec, roughness: 0.6, floodlight: () => 0.7 }
// The rim, spokes and hub ball carry the LED light show: the same white, lit at night.
const LIT_WHITE: MaterialSpec = { name: 'neon-skywheel-white', color: 0xf1f0ec, roughness: 0.6 }
const CAR_GLASS: MaterialSpec = { ...PALETTE.window, color: 0x56687a }
// The boarding canopy is an opaque white vault (the aerial shows it solid white).
const CANOPY: MaterialSpec = { name: 'skywheel-canopy', color: 0xe9e8e4, roughness: 0.7, doubleSided: true, floodlight: () => 0.5 }

// --- The wheel: two rim chords, ties between them, 21 spokes, the hub ball ----
const rim = new Part()
for (const y of [-CHORD, CHORD]) {
  const ring = Array.from({ length: CARS }, (_, i) => wheel(R_RIM, (i + 0.5) / CARS * TAU, y))
  sweep(rim, ring, inPlane(ring, true), ring.map(() => rect(0.55, 0.26)), true)
}
for (let k = 0; k < SPOKES; k++) {
  const t = -Math.PI / 2 + (k + 0.5) / SPOKES * TAU
  // A tie across the rim where each spoke lands, as the truss's verticals.
  beam(rim, wheel(R_RIM, t, -CHORD), wheel(R_RIM, t, CHORD), rect(0.4, 0.22), rect(0.4, 0.22), [Math.cos(t), 0, Math.sin(t)], false)
  // Each trussed spoke is a front and a back member, from the hub's faces
  // out to the two chords.
  for (const s of [-1, 1])
    beam(rim, wheel(1.8, t, s * 0.9), wheel(R_RIM - 0.5, t, s * CHORD), rect(0.6, 0.17), rect(0.3, 0.17), [0, 1, 0], false) // broad at the hub: the starburst
}
sphere(rim, [0, 0, 0], 2.6)

// --- Static: axle, bearings, two A-frames, canopy -------------------------------
const frame = new Part()
const canopy = new Part()
beam(frame, [0, -3.6, H], [0, 3.6, H], circle(0.75, 12), circle(0.75, 12), [1, 0, 0], true, true)
const FOOT_X = 9.5, FOOT_Y = 8.2, TOP_Y = 3.3 // as Seattle's identical wheel; the photos agree
for (const s of [-1, 1]) {
  // Two tubular legs from the deck to the bearing, splayed along the plane
  // and out from it.
  for (const sx of [-1, 1])
    beam(frame, [sx * FOOT_X, s * FOOT_Y, 0], [sx * 0.7, s * TOP_Y, H - 0.4], circle(0.8, 12), circle(0.6, 12), [0, 0, 1], true, true)
  // The bearing housing where the legs meet.
  beam(frame, [0, s * 2.5, H], [0, s * 4.1, H], rect(1.0, 1.1, 0.3), rect(1.0, 1.1, 0.3), [0, 0, 1])
}

// The canopy: a white vault whose arch spans along the wheel's plane between
// the legs, edged by arched ribs that come down to the plaza, as seen from
// the Skylon. Lower and shorter than Seattle's: about 6 m high and 12 m deep
// in the night photo, set to the south-west (front) of the plane.
{
  const A = 11, RISE = 6, Y0 = -6, Y1 = 6, N = 12 // Y0 stops at the booth way/1144956248 in front
  const arch = (u: number, y: number): V3 => [-A * Math.cos(u), y, RISE * Math.sin(u)]
  const u0 = 0.32, u1 = Math.PI - 0.32
  const normal = (u: number): V3 => unit([-Math.cos(u) / A, 0, Math.sin(u) / RISE])
  // The wheel runs down through a slot in the vault, so the shell is two
  // halves either side of the gondolas' path.
  const SLOT = 1.9
  for (const [ya, yb] of [[Y0, -SLOT], [SLOT, Y1]]) {
    for (let i = 0; i < N; i++) {
      const ua = u0 + (u1 - u0) * i / N, ub = u0 + (u1 - u0) * (i + 1) / N
      tri(canopy, [arch(ua, ya), arch(ub, ya), arch(ub, yb)], [normal(ua), normal(ub), normal(ub)])
      tri(canopy, [arch(ua, ya), arch(ub, yb), arch(ua, yb)], [normal(ua), normal(ub), normal(ua)])
    }
  }
  for (const y of [Y0, Y1]) {
    const path = Array.from({ length: N + 1 }, (_, i) => arch(i / N * Math.PI, y))
    sweep(frame, path, inPlane(path, false), path.map(() => rect(0.45, 0.35)), false, false)
  }
  for (const y of [-SLOT, SLOT]) {
    const path = Array.from({ length: N + 1 }, (_, i) => arch(u0 + (u1 - u0) * i / N, y))
    sweep(frame, path, inPlane(path, false), path.map(() => rect(0.2, 0.2)), false, false)
  }
}

// --- Gondolas -------------------------------------------------------------------
/**
 * A gondola about its own centre (its pivot): 2.3 m along the plane, 1.8 m
 * across it, 2.5 m tall; dark glass between a white roof and floor.
 */
const carGlass = new Part(), carShell = new Part()
{
  const ring = (z: number, a: number, b: number, c: number): V3[] => rect(a, b, c).map(([x, y]) => [x, y, z] as V3)
  // Whiter than Seattle's: the SkyWheel's cabins read as white capsules with
  // a dark window band in the photos.
  const bot = [ring(-1.25, 0.75, 0.5, 0.22), ring(-0.45, 1.15, 0.9, 0.45)]
  const mid = [ring(-0.45, 1.15, 0.9, 0.45), ring(0.55, 1.15, 0.9, 0.45)]
  const top = [ring(0.55, 1.15, 0.9, 0.45), ring(1.25, 0.65, 0.45, 0.2)]
  carShell.loft(bot)
  carShell.cap(bot[0], false)
  carGlass.loft(mid)
  carShell.loft(top)
  carShell.cap(top[1], true)
}

// --- Motion ---------------------------------------------------------------------
/**
 * One turn every 90 s. The real wheel takes a few minutes a turn (three turns
 * a ride); at that rate the motion is invisible on a map, so this is a
 * livelier loop, matching the Wonder Wheel's and the Great Wheel's.
 */
const LOOP = 90
const KEYS = 48
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [0, 1, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const nodes: NodeSpec[] = [{ name: 'wheel', translation: [0, 0, H], parts: [{ part: rim, material: LIT_WHITE }] }]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const carParts = [{ part: carGlass, material: CAR_GLASS }, { part: carShell, material: WHITE }]
for (let k = 0; k < CARS; k++) {
  // One gondola at the bottom, at the boarding platform.
  const t = -Math.PI / 2 + k / CARS * TAU
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R_CAR, t, 0), parts: carParts })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

const parts = [{ part: frame, material: WHITE }, { part: canopy, material: CANOPY }]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Niagara SkyWheel', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 53, bearing: 30,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/niagara-skywheel.glb', import.meta.url), glb)
console.log(`niagara-skywheel.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
