/**
 * The London Eye, South Bank, London (1999–2000, Marks Barfield) — original
 * procedural geometry, CC0-1.0.
 * bun generators/london-eye.ts
 *
 * Map frame: x east, y north, z up, metres; origin under the hub, in the
 * wheel's plane, at the water and pier-deck base. The wheel turns in the
 * y–z plane, so its axle runs along x, with +x toward the land (County Hall
 * and Jubilee Gardens) and −x out over the Thames. Placed at bearing 7.4°:
 * OSM's outline of the wheel (way/204068874) is a strip 134 m long whose
 * long sides run 7.4°/187.4°, the 32 capsules that OSM maps as parts lie on
 * the same line, and every part of the OSM 3D model (rim slices, legs,
 * platform) squares up in that frame to a few centimetres.
 *
 * Identity, each tied to a photo (credits below):
 *  1. A huge, thin, bicycle-like wheel: an open white rim truss and a fan of
 *     fine cable spokes to a central hub (north-bank face-on view,
 *     Rhododendrites).
 *  2. 32 egg-shaped glass capsules on the OUTSIDE of the rim, long axis
 *     along the axle, so face-on they read as beads standing proud of the
 *     ring (face-on view; Perituss's capsule close-up).
 *  3. Cantilevered: one white A-frame of two cigar-shaped legs on the land
 *     side only, leaning back out over the river, holding a spindle that
 *     sticks out past the hub; backstay cables run from the spindle's end
 *     down to an anchor inland (Dietmar Rabich and Domob from Westminster
 *     Bridge; mattbuck from below).
 *  4. The low boarding pier over the water under the wheel, with its canopy
 *     and the rim's drive units either side (Rabich, Domob).
 *
 * Measured from OSM (the mapped 3D parts of way/204068874; ODbL), in the
 * wheel's frame:
 *  - hub 67–71 m (axle ≈ 69 m), 10 m long, ≈4 m across; spindle 68–70 m,
 *    from the hub out to x = 19 m on the land side;
 *  - rim truss at hub height: 8.4 m across (x ±4.2), radially 54.6–60.4 m,
 *    and the slices round the bottom widen toward the outside: a triangular
 *    truss, two outer chords and one inner chord;
 *  - capsule parts: 32, 8.1 m along the axle, 4.2 m across, 4 m tall,
 *    centres 65 m from the axle; lowest 1.6 m, highest 136.4 m;
 *  - A-frame legs, sliced every 2.4 m: centre line at z = 9.7 m x 31.9,
 *    y ±10.8; at z = 65.6 m x 6.75, y ±0.95. So each leg leans 24.2° from
 *    the vertical away from the wheel (the A-frame's plane is inclined
 *    65.8° to the horizontal), and splays 10.0° out along the plane; the
 *    feet land at x 36.3, y ±12.5 (OSM's footing slices: x 32.6–38.2,
 *    y ±10.7–14.2), 25 m apart. The legs are cigar-shaped: 1.6–1.8 m across
 *    at either end, 4.4 m (along x, a slanted cut) by 3.8 m at mid-height;
 *  - backstay anchor (way/335716202, "tension cable anchor point"):
 *    x 73–78, on the axle line, 2 m high;
 *  - boarding pier (way/153273222 and its parts): deck x −8.6–13.7,
 *    y −31.5–30.9; boarding strip x 5.5–9.5, 1–2 m; canopy x 6.9–12.9,
 *    y −31.5–29.1 at 4.4 m; boarding building x 3.9–6.9, y ±15, to 4.6 m
 *    with a roof to 6.2 m; end blocks x −5.5–7.3, y ±21.6–28, to 4.3 m;
 *    rim drive units at y ±17–31, x 4.3–8.5 (white) and x −7.7 to −4.3
 *    (grey, with a small orange part on top), 8.2–15.5 m, on posts at x ±5.5, y ±21.7 and ±28.1.
 * Published (Wikipedia, "London Eye"; londoneye.com; Structurae): 135 m
 *  tall, wheel 120 m across, 32 capsules (numbered 1–33, no 13), 10 t and
 *  25 people each, 26 cm/s, one turn in about 30 minutes.
 * Reconciled: OSM's own height tag is 136.5 m against the published 135 m.
 *  The model keeps the published figures: axle at 68.5 m, capsule centres
 *  at 64.5 m, capsules 4 m tall, so the top capsule's top is at 135.0 m and
 *  the bottom capsule's floor at the 2 m boarding deck. Rim outer chords at
 *  60.2 m (120.4 m across), inner chord at 55 m.
 * Checked against photos: the face-on view gives a rim depth of about 6 m
 *  (≈35 px of 705 px across the wheel), legs ≈3 m across at mid-height and
 *  their feet ≈20 m apart (with perspective), matching OSM; the views from
 *  Westminster Bridge show the legs leaning back toward County Hall at
 *  about 65° and the spindle sticking out beyond them.
 * Estimated: chord, diagonal and cable thicknesses (drawn about twice their
 *  real size so they read); the cable count (the real wheel has a cable to
 *  every rim node, about twice the 64 drawn here, following STYLE.md's
 *  half-density rule for thin members); capsule mounting reduced to one
 *  bracket per capsule; the two backstay cables (photos show at least two,
 *  how many in all is not clear); the turning direction (see Motion).
 * Simplified: the rim lattice is one V per capsule bay on each sloping face
 *  plus a tie across the outer face; the capsules' cage of white hoops is
 *  left out, the glass egg and a white band at its waist stand for it.
 *
 * Ground: y = 0 is the water and pier base the terrain shows (the river at
 * 2.5 m in Mapterhorn, the embankment walk at 4.5–5.5 m, so the land is
 * about 2 m above y = 0). The deck top is at 2 m, the level of the walk;
 * the legs' feet and the anchor stand on the land and run down to y = 0.
 *
 * Night: the rim, the spindle and the A-frame are lit (the rim's LEDs are
 * often coloured; here a plain cool white): `neon-eye-white` glows in its
 * day colour. The capsules are lit inside: `window`.
 *
 * It turns (experimental; see "Animation" in STYLE.md). The wheel (rim,
 * spokes, hub, brackets) is a glTF node at the axle; each capsule is a
 * child node at its centre, turned back by as much as the wheel turns so it
 * stays level, as the real capsules are kept level by their own motors.
 * The real wheel takes about 30 minutes a turn; like the other wheels here
 * (Wonder Wheel, Centennial Wheel, Seattle Great Wheel) this loop is 90 s a
 * turn, 20 times the real speed, so the motion shows on a map. Direction:
 * anticlockwise as seen from the river (west), i.e. capsules rise on the
 * Westminster (south) side. Not confirmed by an open source; treat it as a
 * guess. Frame 0 is the static model.
 *
 * Replaces the wheel's outline (way/204068874), the platform outline
 * (way/153273222), the backstay anchor (way/335716202), the "building:part=no"
 * site outline (way/1133007198) and every building:part of the OSM 3D model
 * the model draws over (see the catalog entry). Upstream OpenLandmarks'
 * `london-eye` uses the same OSM way and Wikidata (Q160659), so the map
 * draws this local model over it. Nothing from that model was used.
 *
 * Photos (Wikimedia Commons; all EVIDENCE licences):
 *  - London_Eye_(00776p).jpg — Rhododendrites, CC BY-SA 4.0 (face-on, from
 *    the north bank)
 *  - London,_London_Eye_--_2016_--_4625.jpg — Dietmar Rabich, CC BY-SA 4.0
 *    (from Westminster Bridge, south-west)
 *  - London,_London_Eye_--_2016_--_1445.jpg — Dietmar Rabich, CC BY-SA 4.0
 *    (night, from the north-east)
 *  - Thames_and_London_Eye_from_Westminster_Bridge.jpg — Domob,
 *    CC BY-SA 4.0 (south, along the river)
 *  - London_eye_and_county_hall_pano_edited_2008-02-19.jpg — Kim Hansen,
 *    CC BY-SA 4.0 (face-on with County Hall)
 *  - London_MMB_»0X2_London_Eye.jpg — mattbuck, CC BY-SA 4.0 (spindle and
 *    legs from below)
 *  - London_Eye_2011_013.jpg — Perituss, CC0 (capsule and its cage)
 *  - British_Airways_London_Eye_Profile.jpg — Tim-desser, CC0 (rim truss
 *    and capsules in profile)
 * No commercial imagery, Street View or 3D tiles were used, and nothing was
 * taken from the OpenLandmarks model.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const H = 68.5            // axle height
const R_OUT = 60.2        // the rim's two outer chords
const W_OUT = 3.8         // their distance either side of the wheel's plane
const R_IN = 55.0         // the rim's inner chord, in the plane
const R_CAP = 64.5        // capsule centres
const BAYS = 32           // one rim bay per capsule
const SPOKES = 64
const HUB_X = 5           // hub ends, where the spokes meet it

const lit = new Part()      // rim and hub (turn with the wheel): lit at night
const cables = new Part()   // spokes (turn with the wheel)
const frame = new Part()    // spindle and A-frame (static): lit at night
const stays = new Part()    // backstay cables (static)
const glass = new Part()    // one capsule's glass, shared by all 32
const band = new Part()     // its white waist band
const white = new Part()    // brackets, drive units, posts, pier roofs
const deck = new Part()     // pier deck, end blocks, kiosks
const orange = new Part()   // the river-side drive units
const bracket = new Part()  // capsule brackets (turn with the wheel)

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel at radius r, angle t (0 = north, π/2 = up), offset x along the axle; about the axle. */
const wheel = (r: number, t: number, x: number): V3 => [x, r * Math.cos(t), r * Math.sin(t)]

/** A triangle whose winding follows its normals. */
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

/** Sweep a profile along a path; flat across the section, smooth along it. */
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

/** The frame across a straight member running along T. */
function across(T: V3, side: V3 = [0, 0, 1]) {
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([0, 1, 0], T)
  N = unit(N)
  return { N, B: unit(cross(T, N)) }
}

/** A straight member from a to b, tapering from section s0 to s1. */
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const f = across(unit(sub(b, a)), side)
  sweep(p, [a, b], [f, f], [s0, s1], false, caps)
}

/** A straight member through several stations, each with its own section. */
function tapered(p: Part, a: V3, b: V3, stations: [number, Profile][], side: V3 = [0, 0, 1]) {
  const f = across(unit(sub(b, a)), side)
  sweep(p, stations.map(([t]) => add(a, mul(sub(b, a), t))), stations.map(() => f), stations.map(([, s]) => s), false, true)
}

/** An axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  beam(p, [(x0 + x1) / 2, (y0 + y1) / 2, z0], [(x0 + x1) / 2, (y0 + y1) / 2, z1], rect((x1 - x0) / 2, (y1 - y0) / 2), rect((x1 - x0) / 2, (y1 - y0) / 2), [0, 1, 0])
}

// --- Rim: a triangular truss ---------------------------------------------------
// Two outer chords either side of the plane and one inner chord in it. The
// chords are drawn at 64 segments so the ring stays round; the lattice is a
// V on each sloping face per capsule bay, and a tie across the outer face at
// every capsule.
const ring = (r: number, x: number, n: number) => Array.from({ length: n }, (_, i) => wheel(r, i / n * TAU, x))
const radial = (path: V3[]) => path.map((q) => ({ N: unit([0, q[1], q[2]] as V3), B: [1, 0, 0] as V3 }))
for (const x of [-W_OUT, W_OUT]) {
  const path = ring(R_OUT, x, 64)
  sweep(lit, path, radial(path), path.map(() => rect(0.65, 0.55)), true)
}
{
  const path = ring(R_IN, 0, 64)
  sweep(lit, path, radial(path), path.map(() => rect(0.55, 0.45)), true)
}
for (let k = 0; k < BAYS; k++) {
  const t0 = k / BAYS * TAU, tm = (k + 0.5) / BAYS * TAU
  for (const x of [-W_OUT, W_OUT]) {
    beam(lit, wheel(R_OUT - 0.3, t0, x), wheel(R_IN + 0.2, tm, 0), circle(0.32, 3), circle(0.32, 3), [1, 0, 0], false)
    beam(lit, wheel(R_IN + 0.2, tm, 0), wheel(R_OUT - 0.3, t0 + TAU / BAYS, x), circle(0.32, 3), circle(0.32, 3), [1, 0, 0], false)
  }
  beam(lit, wheel(R_OUT, t0, -W_OUT), wheel(R_OUT, t0, W_OUT), circle(0.4, 3), circle(0.4, 3), [0, 0, 1], false)
}

// --- Spokes and hub ---------------------------------------------------------------
// Cables from the inner chord to the hub's two ends, alternately, so the two
// spoke planes form a shallow cone each side, as on a bicycle wheel.
for (let k = 0; k < SPOKES; k++) {
  const t = (k + 0.5) / SPOKES * TAU
  const x = k % 2 ? HUB_X : -HUB_X
  beam(cables, wheel(2.4, t, x), wheel(R_IN - 0.3, t, 0), circle(0.2, 3), circle(0.2, 3), [1, 0, 0], false)
}
// The hub turns with the wheel; flanges at its ends carry the cables.
const hub = new Part()
beam(hub, [-HUB_X + 0.4, 0, 0], [HUB_X - 0.4, 0, 0], circle(2.0, 12), circle(2.0, 12), [0, 0, 1])
for (const s of [-1, 1]) beam(hub, [s * (HUB_X - 0.4), 0, 0], [s * (HUB_X + 0.3), 0, 0], circle(2.7, 12), circle(2.7, 12), [0, 0, 1])

// Capsule brackets: from the outer face out to the capsule's cradle.
for (let k = 0; k < BAYS; k++) {
  const t = k / BAYS * TAU
  beam(bracket, wheel(R_OUT, t, 0), wheel(R_CAP - 1.7, t, 0), rect(0.35, 2.6), rect(0.3, 2.0), [1, 0, 0])
}

// --- Capsules ------------------------------------------------------------------------
/**
 * One capsule, centred on its node: an egg 8 m long along the axle, 4.2 m
 * across and 4 m tall, eight-sided, with a white band at its waist where
 * the cage's two big hoops ride on the cradle.
 */
{
  const L = 4.0, RY = 2.1, RZ = 2.0
  const station = (x: number) => Math.sqrt(Math.max(0, 1 - (x / L) ** 2))
  const xs = [-3.3, -1.0, 1.0, 3.3]
  const rings = xs.map((x) => Array.from({ length: 8 }, (_, i) => {
    const a = (i + 0.5) / 8 * TAU, f = station(x)
    return [x, RY * f * Math.cos(a), RZ * f * Math.sin(a)] as V3
  }))
  const nrm = (q: V3): V3 => unit([q[0] / (L * L), q[1] / (RY * RY), q[2] / (RZ * RZ)])
  const strip = (p: Part, A: V3[], B: V3[]) => {
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      tri(p, [A[i], A[j], B[j]], [nrm(A[i]), nrm(A[j]), nrm(B[j])])
      tri(p, [A[i], B[j], B[i]], [nrm(A[i]), nrm(B[j]), nrm(B[i])])
    }
  }
  strip(glass, rings[0], rings[1])
  strip(band, rings[1], rings[2])
  strip(glass, rings[2], rings[3])
  for (const [r, x] of [[rings[0], -L], [rings[3], L]] as [V3[], number][]) {
    const pole: V3 = [x, 0, 0]
    for (let i = 0; i < 8; i++) tri(glass, [pole, r[i], r[(i + 1) % 8]], [[Math.sign(x), 0, 0], nrm(r[i]), nrm(r[(i + 1) % 8])])
  }
}

// --- Spindle and A-frame (static) --------------------------------------------------
// The spindle runs through the hub and out past the legs' tops, with the
// backstays' bearing housing at its end.
beam(frame, [-HUB_X - 0.8, 0, H], [19, 0, H], circle(1.15, 12), circle(1.15, 12), [0, 0, 1])
beam(frame, [15.5, 0, H], [19.5, 0, H], circle(1.7, 12), circle(1.7, 12), [0, 0, 1])
// Legs: straight centre lines from OSM's slices, cigar-shaped.
const LEG_FOOT: V3 = [36.3, 12.5, 0], LEG_TOP: V3 = [6.0, 0.65, H - 1.2]
for (const s of [-1, 1]) {
  const foot: V3 = [LEG_FOOT[0], s * LEG_FOOT[1], 0], top: V3 = [LEG_TOP[0], s * LEG_TOP[1], LEG_TOP[2]]
  tapered(frame, foot, top, [[0.09, circle(1.0, 10)], [0.15, circle(0.95, 10)], [0.5, circle(1.95, 10)], [0.88, circle(1.2, 10)], [1, circle(0.85, 10)]], [1, 0, 0])
  // The pinned footing, as OSM slices it: 7.4 by 3.5 m at the ground,
  // narrowing to 4.9 by 2.3 m where the leg leaves it 7.3 m up.
  const shoe = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] =>
    [[x0, s * y0, z], [x1, s * y0, z], [x1, s * y1, z], [x0, s * y1, z]].map((q) => q as V3)
  const rings = [shoe(32.6, 40.0, 10.8, 14.2, 0), shoe(30.6, 35.4, 10.1, 12.4, 7.3)].map((r) => s > 0 ? r : [...r].reverse())
  frame.loft(rings)
  frame.cap(rings[1], true)
}
// The head where the legs meet the spindle.
beam(frame, [4.8, 0, H], [9.5, 0, H], circle(1.6, 12), circle(1.6, 12), [0, 0, 1])

// Backstays: two cables from the spindle's end down to the anchor inland.
for (const s of [-1, 1]) beam(stays, [18.5, s * 0.8, H - 0.6], [75.5, s * 0.4, 4.0], circle(0.3, 3), circle(0.3, 3), [0, 0, 1], false)
box(deck, 73.1, 78.0, -2.0, 2.2, 0, 4.5)

// --- Boarding pier ---------------------------------------------------------------
box(deck, -8.6, 13.7, -31.5, 30.9, 0, 1.0)            // deck over the water
// The pier reads as a white railed walkway: thin rails round the deck's
// river side and ends, and along the boarding strip's edge.
const rail = (x0: number, x1: number, y0: number, y1: number) => box(white, x0, x1, y0, y1, 1.0, 2.1)
rail(-8.6, -8.4, -31.5, 30.9)
for (const y of [-31.5, 30.7]) rail(-8.6, 13.7, y, y + 0.2)
rail(13.5, 13.7, -31.5, 30.9)
rail(5.5, 5.7, -21, 21)
box(deck, 5.5, 9.5, -21, 21, 1.0, 2.0)                // boarding strip
box(deck, 3.9, 6.9, -15, 15, 2.0, 4.6)                // boarding building
box(white, 3.9, 6.9, -15.5, 15.5, 4.6, 5.6)           // its roof
for (const s of [-1, 1]) box(deck, -5.5, 7.3, s > 0 ? 21.6 : -28, s > 0 ? 28 : -21.6, 1.0, 4.3) // end blocks
box(deck, 6.9, 12.9, -31.5, -21.2, 1.0, 4.4)          // glass exit block
box(deck, 6.9, 12.7, 24.8, 28.8, 1.0, 4.1)            // kiosk
box(white, 6.9, 12.9, -31.5, 29.1, 4.4, 4.8)          // canopy
for (const y of [-14, 0, 14]) box(white, 12.2, 12.8, y - 0.3, y + 0.3, 1.0, 4.4)
// Rim drive units either side of the rim's lower quarters, on posts.
for (const s of [-1, 1]) {
  const y0 = s > 0 ? 17.1 : -30.8, y1 = s > 0 ? 30.8 : -17.1
  box(white, 4.3, 8.5, y0, y1, 8.2, 15.2)
  // River side: a grey housing (OSM's #cccccc and white parts) with only a
  // small red-orange accent on top, as in the Rabich and Domob photos.
  box(deck, -8.5, -4.3, y0, y1, 8.2, 14.1)
  box(orange, -7.0, -4.6, s * 23.7 - 2, s * 23.7 + 2, 14.1, 15.2)
  for (const x of [-5.5, 5.5]) for (const y of [21.7, 28.1]) box(white, x - 0.5, x + 0.5, s * y - 0.5, s * y + 0.5, 1.0, x < 0 ? 9 : 8.2)
}

// --- Materials --------------------------------------------------------------------
// White steel, pulled a touch blue so the night glow reads cool white; the
// capsules' glass a mid grey-blue, as they read from across the river; the
// pier's deck a light grey with white rails; a small red-orange accent on
// the river-side drive units.
const LIT: MaterialSpec = finish('neon-eye-white', 0xe4ebf3, 0.5)
const CABLE: MaterialSpec = finish('cable', 0xb4bcc4, 0.5)
const GLASS: MaterialSpec = { name: 'window', color: 0x93a6b7, roughness: 0.35 }
const WHITE: MaterialSpec = finish('eye-white', 0xf3f2ee, 0.6)
const DECK: MaterialSpec = finish('pier-grey', 0xc5cacd, 0.8)
const ORANGE: MaterialSpec = finish('drive-orange', 0xd8743a, 0.6)

// --- Motion -----------------------------------------------------------------------
/** One turn every 90 s (the real wheel takes about 30 minutes); see the header. */
const LOOP = 90
const KEYS = 48
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
// Anticlockwise seen from the west (looking along +x) is a negative turn about +x.
const AXLE: V3 = [1, 0, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, -a))
const level: Quat[] = turned.map((a) => axisAngle(AXLE, a))

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: lit, material: LIT }, { part: cables, material: CABLE }, { part: hub, material: LIT }, { part: bracket, material: WHITE }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const capsule = [{ part: glass, material: GLASS }, { part: band, material: WHITE }]
for (let k = 0; k < BAYS; k++) {
  // Capsule 1 at the bottom, at the boarding deck.
  const t = -Math.PI / 2 + k / BAYS * TAU
  nodes.push({ name: `capsule-${k + 1}`, parent: 0, translation: wheel(R_CAP, t, 0), parts: capsule })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: level })
}

const parts = [
  { part: frame, material: LIT }, { part: stays, material: CABLE }, { part: white, material: WHITE },
  { part: deck, material: DECK }, { part: orange, material: ORANGE },
]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('London Eye', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 135, bearing: 7.4,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/london-eye.glb', import.meta.url), glb)
console.log(`london-eye.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
