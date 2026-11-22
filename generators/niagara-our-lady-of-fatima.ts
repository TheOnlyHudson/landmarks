/**
 * Basilica of the National Shrine of Our Lady of Fatima, Lewiston, New
 * York: procedural, CC0-1.0.
 * bun generators/niagara-our-lady-of-fatima.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM's outline way/1251763730.
 *
 * The basilica (1965, the Barnabite Fathers' shrine) is a low round church
 * under a great glass dome: a ring of round-arched bays, a flat-roofed
 * annex on the north, and a shallow dome of green glass on a steel
 * skeleton, which pilgrims climb to a walkway round its top, where a
 * statue of Our Lady of Fatima stands. Two small round pavilions flank the
 * annex (way/830545262, way/1251763729).
 *
 * Measured (USGS 3DEP NY_FEMAR2_Central_B1_2018 lidar, flown 2018, metres
 * above the ground round the building):
 * - the drum's and annex's flat roofs 4.2 (the annex's middle 5.0-5.5);
 * - the dome centred at (0.6, -4.0), springing at r 14.5 from the drum
 *   roof; 7.0 at r 12, 8.9 at r 10, 10.1 at r 8, 11.1 at r 6: flatter than
 *   a spherical cap, so drawn from these points;
 * - the walkway ring at the top 12.5 inside r 5, a band 1.2 m tall
 *   below it; the statue to about 16.4 (one return, a thin figure);
 * - the pavilions 4.0 at the edge, 5.5 in the middle.
 * The plan is OSM's outline as mapped.
 *
 * From photos: the ring of round arches in a warm pink-brown stone with a
 *   pale band at the eaves; the porch on the south with a flat canopy band;
 *   the glass a pale sea-green in panels between light steel ribs, 24 round
 *   and three rings; the walkway's dark band (its white rosettes left out) and posted rail; the white
 *   statue; a stair up the dome's west side (the white line in Voll's
 *   photo, its side estimated).
 * Estimated: the arch sizes (one per outline edge), the rib count, the
 * statue's shape (a robed figure, hands joined, facing south to the
 * porch), the stair's width and side.
 *
 * Night: the arcade's openings are `window`; the dome is `glass` and stays
 * dark; the statue is floodlit.
 *
 * Photos:
 * - "Shrine of Our Lady of Fatima, Lewiston, NY.jpg", Cfpops at English Wikipedia, public domain (south porch, dome, ribs, top walkway, statue)
 * - "Our Lady of Fatima Shrine, Lewiston, New York, April 2015.jpg", Jason F. Voll, CC BY-SA 3.0 (distant: arcade, dome profile, stair)
 * Look-only (Openverse, CC BY-NC-ND, looked at only): Flickr "Happy Photo
 * Guy" and ihrivera views of the dome and arcade; nothing rests on them.
 * Doubt: only two licensed exterior photos; the north annex and the
 * pavilions are unphotographed and drawn plain at their lidar heights.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const D2R = Math.PI / 180
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const stone = new Part()
const roof = new Part()
const glass = new Part()
const white = new Part() // ribs, rings, the walkway band and rail, the statue, the eaves band
const win = new Part()

function poly(p: Part, pts: V3[], hint: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = dot(n, hint) >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(pts: [number, number][]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: number[], a: number[], b: number[], c: number[]) => cr(a, b, p) >= 0 && cr(b, c, p) >= 0 && cr(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = pts[i0], b = pts[i1], c = pts[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(pts[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Surface of revolution about (cx, cy) from [r, z], smooth below `smooth` degrees. */
function lathe(p: Part, cx: number, cy: number, profile: [number, number][], k: number, smooth = 40) {
  const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1], er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos(smooth * D2R)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const aa = (s / k) * TAU, ab = ((s + 1) / k) * TAU
      const q = [P(r0, aa, z0), P(r0, ab, z0), P(r1, ab, z1), P(r1, aa, z1)]
      const nn = [N(n0, aa), N(n0, ab), N(n1, ab), N(n1, aa)]
      if (r0 === 0) p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(p, q, nn)
    }
  }
}

/** A box swept between two points, w wide (horizontal) and t thick (along `up`). */
function strip(p: Part, a: V3, b: V3, w: number, t: number, up: V3) {
  const ax = unit(sub(b, a)), side = unit(cross(ax, up)), nrm = unit(cross(side, ax))
  const c = (o: V3, u: number, v: number): V3 => add(add(o, mul(side, u * w / 2)), mul(nrm, v * t))
  const r0 = [c(a, -1, 0), c(a, 1, 0), c(a, 1, 1), c(a, -1, 1)], r1 = [c(b, -1, 0), c(b, 1, 0), c(b, 1, 1), c(b, -1, 1)]
  const ns = [mul(nrm, -1), side, nrm, mul(side, -1)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    face(p, [r0[i], r0[j], r1[j], r1[i]], Array(4).fill(ns[i]))
  }
  face(p, r1, Array(4).fill(ax))
}

// ------------------------------------------------------- drum and annex ---
// OSM's outline, relative to its centroid, turned counter-clockwise.
const OUTLINE: [number, number][] = ([[-11.3, 13.9], [-10.3, 18.6], [-8.5, 21.5], [-6.6, 23.2], [-2.9, 24.6], [-0.5, 25.0], [2.6, 24.7], [5.3, 23.9], [7.4, 22.8], [9.4, 20.4], [10.3, 18.1], [11.0, 15.8], [11.3, 14.0], [19.2, 3.0], [16.8, 1.9], [17.3, -0.2], [17.4, -3.3], [18.2, -3.5], [17.9, -6.4], [17.4, -8.0], [18.8, -8.4], [17.6, -11.7], [15.6, -14.9], [13.4, -17.1], [12.3, -16.1], [10.6, -17.5], [8.6, -18.8], [6.0, -20.0], [4.1, -20.4], [4.5, -22.3], [-0.5, -22.7], [-5.9, -22.0], [-5.3, -20.7], [-8.5, -19.5], [-11.2, -17.9], [-13.5, -15.7], [-14.7, -16.6], [-17.4, -13.4], [-18.7, -10.6], [-19.5, -7.9], [-17.8, -7.4], [-18.6, -2.8], [-17.8, -2.8], [-17.2, 1.8], [-14.2, 5.8], [-16.3, 7.4]] as [number, number][]).reverse()
const ROOF = 4.2, BAND = 3.6
{
  const n = OUTLINE.length, P3 = (i: number, z: number): V3 => [OUTLINE[i][0], OUTLINE[i][1], z]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const out: V3 = [OUTLINE[j][1] - OUTLINE[i][1], -(OUTLINE[j][0] - OUTLINE[i][0]), 0]
    poly(stone, [P3(i, 0), P3(j, 0), P3(j, BAND), P3(i, BAND)], out)
    poly(white, [P3(i, BAND), P3(j, BAND), P3(j, ROOF), P3(i, ROOF)], out) // the pale eaves band
    // One round-arched opening per edge long enough to hold it.
    const L = Math.hypot(out[0], out[1])
    if (L < 2.4) continue
    const u = unit(out), e: V3 = [-u[1], u[0], 0]
    const m: V3 = [(OUTLINE[i][0] + OUTLINE[j][0]) / 2 + u[0] * 0.04, (OUTLINE[i][1] + OUTLINE[j][1]) / 2 + u[1] * 0.04, 0]
    const w = Math.min(2.0, L - 0.9), r = w / 2, top = 3.1
    const pts: V3[] = [add(m, mul(e, -r)), add(m, mul(e, r))]
    for (let k = 0; k <= 8; k++) { const q = (k / 8) * Math.PI; pts.push(add(add(m, mul(e, r * Math.cos(q))), [0, 0, top - r + r * Math.sin(q)])) }
    pts[0][2] = 0.05; pts[1][2] = 0.05
    poly(win, pts, out)
  }
  for (const [a, b, c] of earcut(OUTLINE)) roof.tri(P3(a, ROOF), P3(b, ROOF), P3(c, ROOF))
}
// The annex's raised middle (lidar 5.0-5.5).
{
  const ring: V3[] = Array.from({ length: 16 }, (_, i) => [7.5 * Math.cos((i / 16) * TAU), 14 + 7.5 * Math.sin((i / 16) * TAU), ROOF] as V3)
  stone.loft([ring, ring.map(([x, y]) => [x, y, 5.4] as V3)])
  roof.cap(ring.map(([x, y]) => [x, y, 5.4] as V3), true)
}
// The south porch's flat canopy band.
{
  const z0 = 3.3, z1 = 4.0
  const q: V3[] = [[-5.6, -24.2, z1], [4.8, -24.2, z1], [4.8, -21.8, z1], [-5.6, -21.8, z1]]
  roof.cap(q, true)
  const qb = q.map(([x, y]) => [x, y, z0] as V3)
  roof.cap(qb, false)
  white.loft([qb, q])
}
// The flanking round pavilions.
for (const [cx, cy] of [[19.5, 11.4], [-19.2, 12.0]]) lathe(stone, cx, cy, [[5.0, 0], [5.0, 4.0], [4.2, 5.0], [2.0, 5.5], [0, 5.5]], 16, 30)

// ----------------------------------------------------------------- dome ---
const CX = 0.6, CY = -4.0
const DOME: [number, number][] = [[14.5, ROOF], [13.3, 5.7], [12, 7.0], [10, 8.9], [8, 10.1], [6, 11.1], [5.0, 11.3]]
lathe(glass, CX, CY, DOME, 24, 30)
const domeAt = (r: number): number => {
  for (let i = 0; i < DOME.length - 1; i++) {
    const [r0, z0] = DOME[i], [r1, z1] = DOME[i + 1]
    if (r <= r0 && r >= r1) return z0 + ((r - r0) / (r1 - r0)) * (z1 - z0)
  }
  return DOME[DOME.length - 1][1]
}
const onDome = (r: number, a: number, lift = 0): V3 => [CX + r * Math.cos(a), CY + r * Math.sin(a), domeAt(r) + lift]
// The steel skeleton: 24 meridian ribs and three rings, standing just proud.
for (let s = 0; s < 24; s++) {
  const a = (s / 24) * TAU
  for (let k = 0; k < DOME.length - 1; k++) {
    const p0 = onDome(DOME[k][0], a, 0.02), p1 = onDome(DOME[k + 1][0], a, 0.02)
    const up = unit([Math.cos(a) * (p0[2] - p1[2]), Math.sin(a) * (p0[2] - p1[2]), DOME[k][0] - DOME[k + 1][0]])
    strip(white, p0, p1, 0.32, 0.14, up)
  }
}
for (const r of [12, 9.5, 7]) {
  for (let s = 0; s < 24; s++) {
    const a0 = (s / 24) * TAU, a1 = ((s + 1) / 24) * TAU
    const p0 = onDome(r, a0, 0.02), p1 = onDome(r, a1, 0.02), am = (a0 + a1) / 2
    const zr = (domeAt(r - 0.5) - domeAt(r + 0.5))
    strip(white, p0, p1, 0.28, 0.14, unit([Math.cos(am) * zr, Math.sin(am) * zr, 1]))
  }
}
// The stair up the west side, from the drum's roof to the walkway.
{
  const a = Math.PI, hw = 0.9
  const e: V3 = [Math.cos(a + Math.PI / 2), Math.sin(a + Math.PI / 2), 0]
  for (let k = 0; k < DOME.length - 1; k++) {
    const r0 = DOME[k][0], r1 = DOME[k + 1][0]
    const p0 = onDome(r0, a, 0.25), p1 = onDome(r1, a, 0.25)
    const q = [add(p0, mul(e, -hw)), add(p0, mul(e, hw)), add(p1, mul(e, hw)), add(p1, mul(e, -hw))]
    poly(white, q, [Math.cos(a), Math.sin(a), 1])
    for (const s of [-1, 1]) poly(white, [add(p0, mul(e, s * hw)), add(p1, mul(e, s * hw)), add(add(p1, mul(e, s * hw)), [0, 0, -0.3]), add(add(p0, mul(e, s * hw)), [0, 0, -0.3])], mul(e, s))
  }
}
// The walkway: the rosette band, the deck, its rail, and the statue.
lathe(roof, CX, CY, [[5.0, 11.2], [5.15, 11.3], [5.15, 12.3], [5.25, 12.35], [5.25, 12.55], [4.9, 12.55], [0, 12.55]], 24, 30)
// The rail's posts (the glass between them is left out).
for (let s = 0; s < 16; s++) {
  const a = (s / 16) * TAU, x = CX + 5.0 * Math.cos(a), y = CY + 5.0 * Math.sin(a)
  strip(white, [x, y, 12.55], [x, y, 14.0], 0.16, 0.16, [Math.cos(a), Math.sin(a), 0])
}
lathe(white, CX, CY, [[5.08, 13.45], [5.08, 13.6], [4.92, 13.6], [4.92, 13.45]], 24, 30)
// Our Lady, facing south: a pedestal, a flared robe, the mantle, her head.
{
  const S = (r: number, z: number): [number, number] => [r, 12.55 + z]
  lathe(white, CX, CY, [S(1.1, 0), S(1.1, 0.7), S(0.85, 0.75), S(0.8, 0.75), S(0.9, 0.9), S(0.78, 2.0), S(0.66, 2.9), S(0.62, 3.2), S(0.32, 3.3), S(0.36, 3.6), S(0.34, 3.85), S(0, 4.0)], 12, 40)
}

// ---------------------------------------------------------------- output ---
const statueLit = (p: V3, n: V3): number => (p[2] > 12.5 && Math.hypot(p[0] - CX, p[1] - CY) < 1.2 ? (n[2] > 0.7 ? 0.4 : 1) : 0)
const parts = [
  { part: stone, material: finish('fatima-stone', 0xd9bfae) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: { name: 'glass', color: 0xa9cbbb, roughness: 0.24 } },
  { part: white, material: { ...PALETTE.trim, floodlight: statueLit } },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Our Lady of Fatima Shrine', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 16.55,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/niagara-our-lady-of-fatima.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
