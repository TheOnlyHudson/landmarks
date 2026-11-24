/**
 * Endeavor, Luna Park, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-endeavor.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is OSM
 * node/8816101418 (attraction=amusement_ride, name "Endeavor"), on the
 * ground: the centre of the ride's round deck, which the USGS NAIP
 * orthophoto shows as a circle about 17 m across at that point (the wheel
 * parked flat). The model is built square to the park's grid; the
 * placement's bearing (351.5°, as the Astro Tower beside it) turns it into
 * place, so the wheel faces west-south-west along the boardwalk. The map's
 * terrain rises about 0.7 m across the deck's 17 m (`bun tools/terrain.ts`),
 * so the deck is drawn 0.9 m tall and its top stands clear of it on every
 * side; elevation 0.
 *
 * The ride. A Zamperla Enterprise (Coasterpedia, "Luna Park (USA-New York;
 * opened 2010)": Endeavor, Zamperla Enterprise, 2016), on the boardwalk
 * side of the Scream Zone between the Astro Tower and Luna Games. A wheel of
 * twenty cars on a blue boom that lifts it from flat to nearly upright
 * while it turns. It is drawn raised and turning, as every photo shows it.
 *
 * Evidence and what rests on it:
 *   the deck: the NAIP circle (about 17 m; drawn 17 m) at the OSM node;
 *   the wheel: twenty cars (counted on "Jul 2019 54" and "July 2024 025");
 *     orange-and-white spokes, a blue polygon of car carriers near the rim
 *     and a blue inner ring, white cars with red seats, a blue hub and
 *     motor, and a single blue boom from the deck to the hub: photos;
 *   sizes: the wheel's radius to the cars' outer ends about 8 m and the hub
 *     about 10.5 m up are scaled from "Jul 2019 54" against the 2 m-wide
 *     Astro Tower shaft beside it, and agree with the 18–20 m operating
 *     height of an Enterprise; the 80° tilt from the same photo. Estimated,
 *     about ±15%;
 *   the facing: in "Jul 2019 54", taken from the boardwalk to the west, the
 *     wheel is seen almost face on with the boom behind it.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Coney Island Brooklyn Jul 2019 54", Epicgenius, CC BY-SA 4.0
 *   "Coney Island Brooklyn July 2024 025", Kidfly182, CC BY 4.0
 * Look-only: none.
 *
 * Style: spokes and rings are round tubes drawn thicker than the real
 * lattice; the cars are plain boxes with a red seat face. No sign.
 *
 * It moves (experimental; see "Animation" in STYLE.md): the wheel, cars
 * included, is one node turning about its tilted axle, a turn every 6 s
 * (10 rpm, about the real ride's speed). The cars are fixed to the
 * wheel in the real ride too, held out by its speed. Frame 0 is the raised
 * wheel.
 *
 * Night: the ride has running lights along the spokes; they are not
 * modelled (no night photo).
 *
 * Doubts: the boom's exact form and pivot; the wheel's facing within about
 * 30°; whether it is still there after 2024 (no later photo); the size,
 * which rests on photo scaling.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

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

/** A box about centre c with half-extents h along the orthonormal axes e (right-handed). */
function obox(p: Part, c: V3, e: [V3, V3, V3], h: [number, number, number]) {
  const P = (i: number, j: number, k: number): V3 => add(add(add(c, mul(e[0], i * h[0])), mul(e[1], j * h[1])), mul(e[2], k * h[2]))
  // Each face counter-clockwise seen from outside (e0 × e1 = e2).
  p.quad(P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1))
  p.quad(P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1))
  p.quad(P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1))
  p.quad(P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1))
  p.quad(P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1))
  p.quad(P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1))
}

/** A closed polygon of tubes through points round `c` in the plane (e1, e2). */
function ring(p: Part, c: V3, e1: V3, e2: V3, R: number, r: number, n: number, phase = 0) {
  const pt = (k: number): V3 => {
    const a = phase + (k / n) * TAU
    return add(c, add(mul(e1, R * Math.cos(a)), mul(e2, R * Math.sin(a))))
  }
  for (let k = 0; k < n; k++) tube(p, pt(k), pt(k + 1), r, 6)
}

// ------------------------------------------------------------- materials ---
const BLUE = finish('endeavor-blue', 0x3f5fa8)
const ORANGE = finish('endeavor-orange', 0xd9733f)
const WHITE = PALETTE.trim
const SEAT = finish('endeavor-red', 0xc4473c)
const DECK = PALETTE.roof

const blue = new Part(), deck = new Part()
const wBlue = new Part(), wOrange = new Part(), wWhite = new Part(), wSeat = new Part()

// ------------------------------------------------------------------ deck ---
// The round deck, 17 m across and 0.9 m high (it stands clear of the map's gently sloping terrain), with a blue skirt.
{
  const n = 20, R = 8.5, H = 0.9
  const ring0 = Array.from({ length: n }, (_, k) => [R * Math.cos((k / n) * TAU), R * Math.sin((k / n) * TAU), 0] as V3)
  const ring1 = ring0.map(([x, y]) => [x, y, H] as V3)
  blue.loft([ring0, ring1])
  deck.cap(ring1, true)
}

// ------------------------------------------------------- boom and pedestal ---
// The wheel faces -x (west in the model, WSW once placed), tilted 80° from flat.
const TILT = (80 * Math.PI) / 180
const N: V3 = [-Math.sin(TILT), 0, Math.cos(TILT)] // the axle, pointing out of the wheel's face
const E1: V3 = [0, 1, 0] // in the wheel's plane, horizontal
const E2: V3 = unit(cross(N, E1)) // in the wheel's plane, up the face
const HUB: V3 = [0.6, 0, 10.5]
const PIVOT: V3 = [3.4, 0, 1.6]
// The pedestal on the deck under the pivot.
obox(blue, [3.4, 0, 1.1], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1.4, 1.3, 0.5])
// The boom: a box beam from the pivot to the back of the hub.
{
  const back = add(HUB, mul(N, -1.0))
  const ax = unit(sub(back, PIVOT)), side: V3 = [0, 1, 0], third = unit(cross(ax, side))
  const mid = mul(add(back, PIVOT), 0.5), half = Math.hypot(...sub(back, PIVOT)) / 2
  obox(blue, mid, [side, third, ax], [0.6, 0.45, half])
}

// ----------------------------------------------------------------- wheel ---
// Authored about the hub, the node's origin.
const O: V3 = [0, 0, 0]
const CARS = 20, R_CAR = 7.4, R_RIM = 6.6, R_IN = 3.4
// Hub and motor along the axle.
{
  const n = 12, r = 0.9, a = mul(N, -0.9), b = mul(N, 0.5)
  const pts = (c: V3) => Array.from({ length: n }, (_, k) => add(c, add(mul(E1, r * Math.cos((k / n) * TAU)), mul(E2, r * Math.sin((k / n) * TAU)))))
  const A = pts(a), B = pts(b)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const nk = unit(sub(A[k], a)), nj = unit(sub(A[j], a))
    wBlue.tri(A[k], B[j], A[j], undefined, undefined, undefined, [nk, nj, nj])
    wBlue.tri(A[k], B[k], B[j], undefined, undefined, undefined, [nk, nk, nj])
  }
  for (let k = 1; k < n - 1; k++) { wBlue.tri(B[0], B[k], B[k + 1], undefined, undefined, undefined, [N, N, N]); const m = mul(N, -1); wBlue.tri(A[0], A[k + 1], A[k], undefined, undefined, undefined, [m, m, m]) }
}
for (let k = 0; k < CARS; k++) {
  const a = ((k + 0.5) / CARS) * TAU
  const rad = add(mul(E1, Math.cos(a)), mul(E2, Math.sin(a)))
  // Spokes, orange, from the hub to the carriers.
  tube(wOrange, mul(rad, 0.8), mul(rad, R_RIM), 0.17, 5)
}
// The blue rings: the car carriers' polygon near the rim and the inner ring.
ring(wBlue, O, E1, E2, R_RIM, 0.16, CARS, (0.5 / CARS) * TAU)
ring(wBlue, O, E1, E2, R_IN, 0.13, 10, (0.5 / CARS) * TAU)
// The cars: white boxes out beyond the rim, each on a short blue carrier,
// their red seat face looking out of the wheel's face.
for (let k = 0; k < CARS; k++) {
  const a = ((k + 0.5) / CARS) * TAU
  const rad = add(mul(E1, Math.cos(a)), mul(E2, Math.sin(a)))
  const tan = cross(N, rad)
  tube(wBlue, mul(rad, R_RIM), add(mul(rad, R_CAR - 0.7), mul(N, 0.2)), 0.12, 5)
  const c = add(mul(rad, R_CAR), mul(N, 0.25))
  obox(wWhite, c, [rad, tan, N], [0.75, 0.5, 0.5])
  // Seat face, just proud of the car's front.
  obox(wSeat, add(c, mul(N, 0.52)), [rad, tan, N], [0.55, 0.38, 0.04])
}

// ------------------------------------------------------------- animation ---
// Two turns in 12 s, a key every 20°.
const STEPS = 36, LOOP = 12
const times = Array.from({ length: STEPS + 1 }, (_, i) => +((LOOP * i) / STEPS).toFixed(4))
const turns: Quat[] = times.map((_, i) => axisAngle(N, (2 * TAU * i) / STEPS))
const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: HUB,
  parts: [
    { part: wBlue, material: BLUE },
    { part: wOrange, material: ORANGE },
    { part: wWhite, material: WHITE },
    { part: wSeat, material: SEAT },
  ],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: turns }]

// ---------------------------------------------------------------- output ---
const parts = [
  { part: blue, material: BLUE },
  { part: deck, material: DECK },
]
const all = [...parts, ...nodes.flatMap((n) => n.parts)]
const triangles = all.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Endeavor', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 351.5, elevation: 0, height: 18.6, osm: 'node/8816101418',
}, { nodes, animation: { name: 'turn', times, channels } })
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/nyc-endeavor.glb', import.meta.url).pathname
await Bun.write(out, glb)
const top = HUB[2] + R_CAR * Math.sin(TILT) + 0.75
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, top ≈ ${top.toFixed(1)} m`)
console.log(all.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
