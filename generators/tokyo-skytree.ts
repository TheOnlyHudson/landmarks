/**
 * Tokyo Skytree (東京スカイツリー), Sumida, Tokyo: procedural, CC0-1.0.
 * bun generators/tokyo-skytree.ts
 *
 * Map frame: x east, y north, z up, metres. Built with one corner of the
 * base triangle due north (+y); the placement's bearing (353) turns it to
 * OSM's corners at bearings 353, 113 and 233. The origin is the centre of
 * OSM's base triangle (way/557938593); y = 0 is the ground.
 *
 * Completed 2012 (Nikken Sekkei). A white steel lattice tower whose plan
 * morphs from an equilateral triangle at the foot (a tripod) to a circle
 * higher up, carrying two observation decks and a mast.
 *
 * Published (Wikipedia, "Tokyo Skytree"):
 * - 634 m overall; observatories at 350 m (Tembo Deck) and 450 m (Tembo
 *   Galleria, a spiral glass skywalk); cylindrical from about 350 m up;
 * - colour "Skytree White", a bluish white (aijiro);
 * - night illumination alternating sky-blue "Iki" and purple "Miyabi".
 *
 * OSM:
 * - way/288269147 outline (634 m, circle r 28.2 m);
 * - building:parts way/557938593 and way/557938595: the base triangle,
 *   corners at r 37.3-38.5 m (side ~65.5 m), turned -7 degrees;
 * - way/362351414 the tower/mast part (r ~3 m, 634 m);
 * - way/362351415 Tembo Deck 290-350 m (r 17.7 m) and way/288269148 Tembo
 *   Galleria 410-450 m (r 13 m). All within the outline, all replaced.
 *
 * From photos. "2019 Tokyo Skytree.jpg" (Kakidai, CC BY-SA 4.0) is a
 * distant, near-level view, scaled at 1.96 px/m: the base reads 66 m wide,
 * matching OSM's triangle, and the 634 m tip and 447 m Galleria give the
 * same scale.
 * - trunk projected width 66 m at the ground, ~52 m at 176 m, ~40 m at
 *   320 m: half-width w = 33 - 0.0406 z;
 * - Tembo Deck pod 329-372 m, ~59 m across at its lip (OSM's 35 m looks
 *   too small against every photo; the photos are followed);
 * - lattice between the decks ~30 m across;
 * - Galleria ring 439-461 m, ~40 m across; the lattice above it ~22 m
 *   across, to the mast at 497 m; the mast ~10 m across, banded, to 634 m.
 *
 * Estimated: the triangle-to-circle blend (complete by 320 m), the lattice
 * drawn as 12 bays of white X-braces with ring bands every ~21 m over a
 * grey-blue shade (the open lattice's interior), braces drawn 1.6 m wide
 * (thicker than real so they read), the pods' profiles between the photo
 * measurements, the mast's bands.
 * Left out: the lattice's finer members, the base station and lobby
 * (separate buildings in OSM), the Galleria's spiral tube.
 * Terrain: flat Sumida ward; elevation 0.
 *
 * Night: in the "Iki" scheme (Kakidai's "Tokyo Skytree at night (Iki).jpg",
 * CC BY-SA 3.0) the lattice is washed warm white and the inner core glows
 * sky blue between the braces. The braces, pods and mast carry a white
 * `floodlight` wash; the blue core can't show through the opaque lattice
 * shell, so it is left out. The decks' glazing is `window`.
 *
 * Photos (Wikimedia Commons):
 * - "2019 Tokyo Skytree.jpg", Kakidai, CC BY-SA 4.0 (distant, proportions)
 * - "Tokyo Skytree (white).jpg", Kakidai, CC BY-SA 4.0 (night, decks, mast)
 * - "Tokyo Skytree at night (Iki).jpg", Kakidai, CC BY-SA 3.0 (night colour)
 * - "Tokyo Skytree above Sumida.jpg", Sashimi-b, CC BY 4.0 (decks, from the west)
 * - "Aerial view of Tokyo Skytree, January 2025.jpg", Uraniwa, CC BY 4.0 (from above)
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ------------------------------------------------------------- materials ---
const shade = new Part()  // the open lattice's interior, seen through it
const brace = new Part()  // white X-braces, rings and corner legs (floodlit)
const white = new Part()  // pods, mast and cladding
const glass = new Part()  // deck glazing (lit)

/** A quad whose winding is chosen so it faces `out`, with per-corner normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** Surface of revolution from [r, z]; the left-hand side of the profile is outside. */
function lathe(profile: [number, number][], pick: (band: number) => Part, k: number, smooth = 40) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const part = pick(b)
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

// ------------------------------------------------------------- the trunk ---
const TOP = 329            // the trunk meets the Tembo Deck pod
const BLEND_TOP = 320      // triangle fully rounded into a circle by here
/** Projected half-width (photo): 33 m at the ground, 20 m at 320 m. */
const halfW = (z: number) => 33 - 0.0406 * z
const smooth = (t: number) => t * t * (3 - 2 * t)
const CORNER0 = Math.PI / 2 // a corner due north
/** The trunk's radius at angle a and height z: a triangle easing into a circle. */
function trunkR(a: number, z: number) {
  const w = halfW(Math.min(z, BLEND_TOP))
  const Rt = (2 * w) / Math.sqrt(3)           // triangle seen face on is `side` wide
  let m = (((a - CORNER0) % (TAU / 3)) + TAU / 3) % (TAU / 3)
  const rTri = (Rt * 0.5) / Math.cos(m - Math.PI / 3)
  const t = smooth(Math.min(1, z / BLEND_TOP))
  // Slightly round the triangle's corners even at the foot (the legs are
  // broad, not knife edges).
  return Math.min(rTri, Rt * 0.94) * (1 - t) + w * t
}
const NODES = 12           // brace bays around (nodes every 30 deg: corners on nodes)
const RING_PTS = 36        // shell points around
const LEVELS: number[] = []
for (let z = 0; z <= TOP + 0.01; z += TOP / 14) LEVELS.push(Math.min(TOP, z))
const shellPt = (a: number, z: number): V3 => P(trunkR(a, z), a, z)
{
  const rings = LEVELS.map((z) => Array.from({ length: RING_PTS }, (_, i) => shellPt((i / RING_PTS) * TAU, z)))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < RING_PTS; i++) {
      const j = (i + 1) % RING_PTS
      shade.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
}
/** A flat strip from a to b, `w` wide, lifted `lift` off the shell, facing outward. */
function strip(p: Part, a: V3, b: V3, w: number, lift = 0.5) {
  const m = mul(add(a, b), 0.5)
  const out = unit([m[0], m[1], 0])
  const along = unit(sub(b, a))
  let side = unit(cross(along, out))
  const A = add(a, mul(out, lift)), B = add(b, mul(out, lift))
  const h = mul(side, w / 2)
  const g = (q: V3): V3 => [q[0], q[1], Math.max(0, q[2])] // nothing below the ground
  face(p, [g(sub(A, h)), g(add(A, h)), g(add(B, h)), g(sub(B, h))], [out, out, out, out])
}
// X-braces in every bay, ring bands at every level, broad corner legs.
for (let k = 0; k < LEVELS.length - 1; k++) {
  const z0 = LEVELS[k], z1 = LEVELS[k + 1]
  for (let i = 0; i < NODES; i++) {
    const a0 = (i / NODES) * TAU + CORNER0, a1 = ((i + 1) / NODES) * TAU + CORNER0
    strip(brace, shellPt(a0, z0), shellPt(a1, z1), 2.4)
    strip(brace, shellPt(a1, z0), shellPt(a0, z1), 2.4)
    strip(brace, shellPt(a0, z1), shellPt(a1, z1), 2.0, 0.6)
  }
}
for (let c = 0; c < 3; c++) {
  const a = CORNER0 + (c * TAU) / 3
  for (let k = 0; k < LEVELS.length - 1; k++) strip(brace, shellPt(a, LEVELS[k]), shellPt(a, LEVELS[k + 1]), 3.0, 0.7)
}

// ------------------------------------------------------------- the decks ---
const K = 32
const R_TOP = halfW(BLEND_TOP)
// Tembo Deck pod: a cone flaring out from the trunk, a band of glass, a
// broad lip, and a sloped roof in to the lattice above.
lathe([[R_TOP - 0.3, TOP - 0.5], [24, 338], [28.5, 342]], () => white, K)
lathe([[28.5, 342], [28.8, 357]], () => glass, K)
lathe([[28.8, 357], [29.5, 358], [29.5, 362.5], [28, 363.5], [24, 366], [15.5, 372]], (b) => (b < 3 ? white : white), K, 50)
// The lattice between the decks: a cylinder of shade with braces.
const UP0 = 372, UP1 = 437, R_UP = 15
lathe([[R_UP, UP0], [R_UP, UP1]], () => shade, 24)
function cylBraces(r: number, z0: number, z1: number, bays: number, levels: number, w: number) {
  for (let k = 0; k < levels; k++) {
    const za = z0 + ((z1 - z0) * k) / levels, zb = z0 + ((z1 - z0) * (k + 1)) / levels
    for (let i = 0; i < bays; i++) {
      const a0 = (i / bays) * TAU, a1 = ((i + 1) / bays) * TAU
      strip(brace, P(r, a0, za), P(r, a1, zb), w)
      strip(brace, P(r, a1, za), P(r, a0, zb), w)
      strip(brace, P(r, a0, zb), P(r, a1, zb), w * 0.9, 0.6)
    }
  }
}
cylBraces(R_UP, UP0, UP1, 10, 3, 1.8)
// Tembo Galleria: a flared underside, a glass ring, and its roof.
lathe([[R_UP - 0.2, UP1], [19.5, 441]], () => white, K)
lathe([[19.5, 441], [19.8, 455]], () => glass, K)
lathe([[19.8, 455], [20.2, 456], [20.2, 458.5], [18, 460], [11.5, 462]], () => white, K, 50)
// The lattice above the Galleria, tapering a little to the mast.
const TOPL0 = 462, TOPL1 = 497
lathe([[11.2, TOPL0], [10, TOPL1]], () => shade, 20)
cylBraces(10.6, TOPL0, TOPL1, 8, 2, 1.2)
lathe([[10, TOPL1], [10.6, 498], [10.6, 500], [5.2, 502]], () => white, 24, 50)

// --------------------------------------------------------------- the mast ---
// The gain tower: a banded white mast, a darker band every ~16 m (its
// antenna sections), and a cap.
{
  const prof: [number, number][] = [[5.2, 502]]
  const bands: number[] = []
  for (let z = 502; z < 622; z += 16) { prof.push([5.0, z + 12.5], [5.4, z + 13], [5.4, z + 16]); bands.push(prof.length - 3) }
  lathe(prof, (b) => (bands.includes(b + 1) || bands.includes(b) ? shade : white), 16, 30)
  const zTop = prof[prof.length - 1][1]
  lathe([[5.4, zTop], [5.4, 626], [4.0, 628.5], [2.2, 631.5], [0.6, 634], [0, 634]], () => white, 16, 40)
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: Skytree White is a pale bluish white; the
// lattice's open interior reads a soft grey-blue between the braces.
const podLit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.85)
const parts = [
  { part: shade, material: finish('skytree-shade', 0xc6d1d9) },
  { part: brace, material: { ...finish('skytree-white', 0xeef4f8), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.4 : 0.95) } },
  { part: white, material: { ...PALETTE.trim, color: 0xeef2f4, floodlight: podLit } },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Tokyo Skytree', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 353, elevation: 0, height: 634,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/tokyo-skytree.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
