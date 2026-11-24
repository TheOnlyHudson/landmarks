/**
 * Astro Tower, Luna Park, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-astro-tower.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is the centre of the
 * shaft at OSM node/8816101417 (attraction=drop_tower, name "Astro Tower",
 * height=42), on the ground. The model is built square to the park's grid;
 * the placement's bearing (351.5°, the grid of the neighbouring OSM
 * buildings way/1017690939 and way/1483353317) turns it into place. Luna
 * Park is level here, so elevation 0.
 *
 * The ride. A Zamperla drop tower that opened on 26 May 2018 next to
 * Endeavor and across from the Thunderbolt, at West 15th Street and the
 * Riegelmann Boardwalk, named after Astroland's old Astrotower (taken down
 * in 2013). Riders sit round the shaft in a ring gondola that turns as it
 * climbs, then drops. 137 ft 4 in (41.9 m) tall, 5,258 lights (Luna Park,
 * lunaparknyc.com/rides/astro-tower; Coasterpedia "Luna Park (USA-New
 * York; opened 2010)" for the maker). Still standing in June 2025 (Jim
 * Henderson's Mermaid Parade photo below).
 *
 * Evidence and what rests on it:
 *   height 42 m to the spike's tip: published (above) and OSM height=42;
 *   position: the OSM node, checked against the tower's 40 m shadow on the
 *     USGS NAIP orthophoto, which runs north-west from that point;
 *   every other proportion: scaled from Giorgio Galeotti's October 2023
 *     photo against the 42 m total (about 37 px a metre at 3840 px): the
 *     shaft is about 2 m wide and runs to 34.6 m; a blue-and-white skirt
 *     widening upward to 35.3 m; the red drum (about 3.6 m across) to
 *     36.9 m with the yellow "ASTRO TOWER" sign band round it and yellow
 *     crown points on its rim; the armillary sphere of red and yellow rings
 *     (about 3 m across) round a white mast to 40.6 m; the gold spike to
 *     42 m. Estimated, about ±10%;
 *   the shaft's look: a square lattice of four white corner posts with the
 *     ride's lights (red and white bulbs) up every face, so from any
 *     distance it reads as a pale salmon column with white edges;
 *   the gondola: the grey ring parked at the foot of the shaft in the
 *     October 2023 photo, about 5.2 m across and 2 m tall (its lower part is
 *     hidden behind Salt & Sizzle's roof there; estimated).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Riegelmann Boardwalk - Coney Island, Brooklyn, New York City, New York,
 *     USA - October 3, 2023 03", Giorgio Galeotti, CC BY-SA 4.0 (from the
 *     east-south-east along the boardwalk; the whole tower and crown)
 *   "Coney Island August 2022 008", "009", Kidfly182, CC BY-SA 4.0 (from
 *     the south-east, the crown close)
 *   "Coney Island Brooklyn July 2024 020", "025", "034", Kidfly182,
 *     CC BY 4.0 (from the south and south-east)
 *   "Coney Island Brooklyn Jul 2019 54", Epicgenius, CC BY-SA 4.0 (from the
 *     west along the boardwalk, with Endeavor)
 *   "CI Mermaid paraders near Thunderbolt 2025 jeh", Jim.henderson,
 *     CC BY-SA 4.0 (from the east, June 2025)
 * Look-only: none. No lidar: the USGS NYC flight (2017) predates the ride.
 *
 * Style: the lattice is drawn as solid light-strip faces between white
 * corner posts, with a white tie every 4.3 m (the real lattice's horizontal
 * members are much closer; these are the bands that read). The armillary
 * rings are drawn thicker than the real tubes. No lettering on the sign
 * band: it is not a landmark sign, and it is too small to read.
 *
 * It moves (experimental; see "Animation" in STYLE.md): the gondola is one
 * node, lifted up the shaft over 40 s while it makes two turns, held at the
 * top, dropped in free fall, braked and held at the foot. Frame 0 is the
 * gondola parked at the foot, as the photos show it.
 *
 * Night: the shaft's faces are `neon-astro-lights` (the 5,258 bulbs, which
 * light the tower red and white), and the sign band and crown points are
 * `neon-astro-sign` in their yellow.
 *
 * Doubts: the shaft's width and the crown's sizes are photo estimates; the
 * gondola's exact form and its seats; whether the faces' lights are red on
 * every side (the photos show the south and east faces).
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A ring of `n` points round the z axis at radius r, height z, counter-clockwise from above. */
const circle = (r: number, z: number, n: number, phase = 0): V3[] =>
  Array.from({ length: n }, (_, k) => {
    const a = phase + (k / n) * TAU
    return [r * Math.cos(a), r * Math.sin(a), z] as V3
  })

/**
 * A smooth-shaded frustum (cylinder when r0 = r1) about the vertical through
 * `c`, with optional caps; `inward` turns its walls to face the axis.
 */
function frustum(p: Part, r0: number, r1: number, z0: number, z1: number, n: number, caps: [boolean, boolean] = [true, true], c: [number, number] = [0, 0], inward = false) {
  const at = (r: number, z: number) => circle(r, z, n).map(([x, y]) => [x + c[0], y + c[1], z] as V3)
  const a = at(r0, z0), b = at(r1, z1)
  const slope = (r0 - r1) / (z1 - z0), s = inward ? -1 : 1
  const nrm = (k: number): V3 => {
    const ang = (k / n) * TAU
    return unit([s * Math.cos(ang), s * Math.sin(ang), s * slope])
  }
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    p.tri(a[k], a[j], b[j], undefined, undefined, undefined, [nrm(k), nrm(j), nrm(j)])
    if (r1 > 0) p.tri(a[k], b[j], b[k], undefined, undefined, undefined, [nrm(k), nrm(j), nrm(k)])
  }
  if (caps[1]) p.cap(b, true)
  if (caps[0]) p.cap(a, false)
}

/** A flat annulus (ring) between radii, facing up or down. */
function annulus(p: Part, rIn: number, rOut: number, z: number, n: number, up: boolean) {
  const i = circle(rIn, z, n), o = circle(rOut, z, n)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    if (up) p.quad(i[k], o[k], o[j], i[j])
    else p.quad(i[k], i[j], o[j], o[k])
  }
}

/** A round tube from a to b, smooth-shaded, open ends. */
function tube(p: Part, a: V3, b: V3, r: number, sides = 6) {
  const ax = unit(sub(b, a)), ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit(cross(ax, ref)), v = cross(ax, u)
  for (let k = 0; k < sides; k++) {
    const t0 = (k / sides) * TAU, t1 = ((k + 1) / sides) * TAU
    const d0 = add(mul(u, Math.cos(t0)), mul(v, Math.sin(t0))), d1 = add(mul(u, Math.cos(t1)), mul(v, Math.sin(t1)))
    const a0 = add(a, mul(d0, r)), a1 = add(a, mul(d1, r)), b0 = add(b, mul(d0, r)), b1 = add(b, mul(d1, r))
    p.tri(a0, a1, b1, undefined, undefined, undefined, [d0, d1, d1]); p.tri(a0, b1, b0, undefined, undefined, undefined, [d0, d1, d0])
  }
}

/** A torus: a ring of radius R about `c` in the plane spanned by unit vectors e1, e2, tube radius r. */
function torus(p: Part, c: V3, e1: V3, e2: V3, R: number, r: number, seg = 20, sides = 6) {
  const nrm = unit(cross(e1, e2))
  const at = (i: number, k: number): [V3, V3] => {
    const a = (i / seg) * TAU, b = (k / sides) * TAU
    const radial = add(mul(e1, Math.cos(a)), mul(e2, Math.sin(a)))
    const n = add(mul(radial, Math.cos(b)), mul(nrm, Math.sin(b)))
    return [add(add(c, mul(radial, R)), mul(n, r)), n]
  }
  for (let i = 0; i < seg; i++) for (let k = 0; k < sides; k++) {
    const [p00, n00] = at(i, k), [p10, n10] = at(i + 1, k), [p11, n11] = at(i + 1, k + 1), [p01, n01] = at(i, k + 1)
    p.tri(p00, p10, p11, undefined, undefined, undefined, [n00, n10, n11])
    p.tri(p00, p11, p01, undefined, undefined, undefined, [n00, n11, n01])
  }
}

// ------------------------------------------------------------- materials ---
const WHITE = PALETTE.trim
const LIGHTS = finish('neon-astro-lights', 0xe8afa3)
const RED = finish('astro-red', 0xc94a3e)
const SIGN = finish('neon-astro-sign', 0xe8b93e)
const BLUE = finish('astro-blue', 0x4a64a8)
const GONDOLA = finish('astro-gondola', 0xb9bfc5)

const white = new Part(), lights = new Part(), red = new Part(), sign = new Part(), blue = new Part()
const gGrey = new Part(), gRed = new Part()

// ----------------------------------------------------------------- shaft ---
const HALF = 1.0, Z_SHAFT = 34.6
// The light-strip faces, set just inside the corner posts.
{
  const s = HALF - 0.1
  lights.loft([[[-s, -s, 0], [s, -s, 0], [s, s, 0], [-s, s, 0]], [[-s, -s, Z_SHAFT], [s, -s, Z_SHAFT], [s, s, Z_SHAFT], [-s, s, Z_SHAFT]]])
}
// Corner posts.
for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) frustum(white, 0.2, 0.2, 0, Z_SHAFT, 8, [false, false], [x * (HALF - 0.08), y * (HALF - 0.08)])
// White ties round the shaft every 4.3 m, and a cap plate at the top.
for (let z = 4.3; z < Z_SHAFT - 1; z += 4.3) white.slab(z, z + 0.3, HALF + 0.04, HALF - 0.14)
white.slab(Z_SHAFT - 0.35, Z_SHAFT, HALF + 0.12)

// ----------------------------------------------------------------- crown ---
// Blue-and-white skirt, widening upward.
frustum(blue, 1.15, 1.55, Z_SHAFT - 0.1, 35.3, 16, [true, false])
// The red drum, with the yellow sign band round it and crown points on its rim.
frustum(red, 1.75, 1.75, 35.3, 36.9, 16)
annulus(red, 1.55, 1.75, 35.3, 16, false)
frustum(sign, 1.86, 1.86, 35.65, 36.5, 16)
annulus(sign, 1.75, 1.86, 36.5, 16, true)
annulus(sign, 1.75, 1.86, 35.65, 16, false)
for (let k = 0; k < 8; k++) {
  const a = ((k + 0.5) / 8) * TAU, w = 0.38
  const d: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
  const base = mul(d, 1.72)
  const l: V3 = add(add(base, mul(t, -w)), [0, 0, 36.9]), r: V3 = add(add(base, mul(t, w)), [0, 0, 36.9]), top: V3 = add(base, [0, 0, 37.55])
  // Both sides: a thin flat point.
  sign.tri(l, r, top); sign.tri(r, l, top)
}
// The armillary sphere: a white mast, three rings and four arms with balls.
const ARM_Z = 38.5
frustum(white, 0.13, 0.1, 36.9, 40.6, 8, [false, true])
torus(red, [0, 0, ARM_Z], [1, 0, 0], [0, 0, 1], 1.55, 0.12, 20, 6)
torus(sign, [0, 0, ARM_Z], [Math.cos(TAU / 6), Math.sin(TAU / 6), 0], [0, 0, 1], 1.45, 0.11, 20, 6)
{
  const tilt = (25 * Math.PI) / 180
  torus(sign, [0, 0, ARM_Z], [Math.cos(-TAU / 8), Math.sin(-TAU / 8), 0], unit([Math.cos(TAU / 8) * Math.cos(tilt), Math.sin(TAU / 8) * Math.cos(tilt), Math.sin(tilt)]), 1.6, 0.11, 20, 6)
}
for (let k = 0; k < 4; k++) {
  const a = (k / 4) * TAU + TAU / 8
  const tip: V3 = [2.0 * Math.cos(a), 2.0 * Math.sin(a), 37.6]
  tube(white, [0, 0, 37.2], tip, 0.07, 5)
  // A small ball at each tip (an octahedron reads as round at this size).
  const b = 0.2, px: V3 = add(tip, [b, 0, 0]), nx: V3 = add(tip, [-b, 0, 0]), py: V3 = add(tip, [0, b, 0]), ny: V3 = add(tip, [0, -b, 0]), pz: V3 = add(tip, [0, 0, b]), nz: V3 = add(tip, [0, 0, -b])
  for (const [u, v] of [[px, py], [py, nx], [nx, ny], [ny, px]] as [V3, V3][]) { red.tri(u, v, pz); red.tri(v, u, nz) }
}
// The gold spike.
frustum(sign, 0.26, 0.0, 40.6, 42.0, 8, [true, false])

// --------------------------------------------------------------- gondola ---
// Authored about the node's origin (the shaft's foot); the node moves it.
// The inner wall clears the corner posts (which reach 1.5 m from the axis).
const G_IN = 1.6, G_OUT = 2.6
frustum(gGrey, G_OUT, G_OUT, 1.2, 2.9, 16, [false, false])
frustum(gGrey, G_IN, G_IN, 1.2, 2.9, 16, [false, false], [0, 0], true)
annulus(gGrey, G_IN, G_OUT, 2.9, 16, true)
annulus(gGrey, G_IN, G_OUT, 1.2, 16, false)
// The seat row and its footrest, under the housing.
frustum(gRed, 2.3, 2.3, 0.65, 1.2, 16, [false, false])
annulus(gRed, G_IN, 2.3, 0.65, 16, false)
annulus(gGrey, G_IN, 2.8, 0.65, 16, true)
annulus(gGrey, G_IN, 2.8, 0.5, 16, false)
frustum(gGrey, 2.8, 2.8, 0.5, 0.65, 16, [false, false])

// ------------------------------------------------------------- animation ---
// Lift 40 s with two turns, hold 4 s at the top, free fall to 6 m, brake,
// hold at the foot. Real speeds; two turns end where the gondola began.
const TOP = 30, BRAKE = 6, G = 9.81
const times: number[] = [], lift: number[] = [], turn: number[] = []
const key = (t: number, z: number, a: number) => { times.push(+t.toFixed(3)); lift.push(z); turn.push(a) }
key(0, 0, 0); key(10, 0, 0)
for (let i = 1; i <= 40; i++) key(10 + i, (TOP * i) / 40, (2 * TAU * i) / 40)
key(54, TOP, 2 * TAU)
const tFall = Math.sqrt((2 * (TOP - BRAKE)) / G)
for (let i = 1; i <= 8; i++) { const t = (tFall * i) / 8; key(54 + t, TOP - 0.5 * G * t * t, 2 * TAU) }
{
  // Braking from the fall's speed to rest over the last 6 m.
  const v = G * tFall, tb = (2 * BRAKE) / v
  for (let i = 1; i <= 4; i++) { const t = (tb * i) / 4; key(54 + tFall + t, BRAKE - v * t + (v / tb) * t * t / 2, 2 * TAU) }
}
key(72, 0, 2 * TAU)
const lifts: V3[] = lift.map((z) => [0, 0, Math.max(0, z)])
const turns: Quat[] = turn.map((a) => axisAngle([0, 0, 1], a))

const nodes: NodeSpec[] = [{
  name: 'gondola',
  translation: lifts[0],
  parts: [{ part: gGrey, material: GONDOLA }, { part: gRed, material: RED }],
}]
const channels: ChannelSpec[] = [
  { node: 0, path: 'translation', values: lifts },
  { node: 0, path: 'rotation', values: turns },
]

// ---------------------------------------------------------------- output ---
const parts = [
  { part: white, material: WHITE },
  { part: lights, material: LIGHTS },
  { part: red, material: RED },
  { part: sign, material: SIGN },
  { part: blue, material: BLUE },
]
const all = [...parts, ...nodes.flatMap((n) => n.parts)]
const triangles = all.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Astro Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 351.5, elevation: 0, height: 42, osm: 'node/8816101417',
}, { nodes, animation: { name: 'ride', times, channels } })
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/nyc-astro-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, loop ${times[times.length - 1]} s, ${times.length} keys`)
console.log(all.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
