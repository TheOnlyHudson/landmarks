/**
 * Spoonbridge and Cherry (1985-88, Claes Oldenburg and Coosje van Bruggen),
 * Minneapolis Sculpture Garden: procedural, CC0-1.0.
 * bun generators/msp-spoonbridge-and-cherry.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; placement bearing 0 (the spoon's
 * own axis, 131 degrees, is built into the geometry). Origin at the anchor
 * (-93.28911, 44.97026), inside OSM way/574151474's outline near the neck.
 * y = 0 is the lowest point of the sculpture, at the pool's water level
 * (lidar 249.4 m); the handle's end and the bowl rest on low planted islands
 * that the map doesn't model (left out, like the water).
 *
 * Form: a stainless-steel spoon 15.7 m long lying on one straight axis from
 * north-west (handle end) to south-east (bowl). The handle is a broad flat
 * ribbon rising gently from its rounded end to a crest about 2.2 m up, then
 * dropping to the neck just above the water; the bowl climbs from the neck at
 * about 50 degrees, its hollow facing up and back toward the handle and
 * turned a little to the south-west; the dark-red cherry rests near the
 * bowl's upper end and its dark stem rises and bends over toward the
 * south-west, ending in a knob at 9.0 m (the real stem sprays a fountain
 * mist, left out).
 *
 * Sources
 * - OSM (ODbL): way/574151474, tourism=artwork, "Spoonbridge and Cherry",
 *   Q18084723 (outline: the axis bearing, the handle end and the bowl).
 *   Not a building: replaces nothing.
 * - Published (Walker Art Center collection page, linked from OSM; Wikipedia
 *   "Spoonbridge and Cherry"): 1985-88, stainless steel and aluminium painted
 *   with polyurethane enamel; 354 x 618 x 162 in (9.0 x 15.7 x 4.1 m).
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 0.5 m grid:
 *   the handle strip at bearing 131 deg, its crest 2.3 m above the water
 *   (measured), the neck about 0.6-0.9 m. The returns over the bowl and cherry
 *   (a flat 6.0 m plateau and an 8-10 m patch west of the bowl) don't fit any
 *   photo and were not used; the sculpture may have been under wraps or work
 *   at the flight.
 * - USGS NAIP (public domain): plan, handle to the north-west, bowl and its
 *   shadow to the south-east.
 * - Photos (evidence, Flickr via Openverse):
 *   puroticorico, "Spoonbridge & Cherry Reflection Pool", CC BY 2.0,
 *     https://www.flickr.com/photos/10058483@N00/3612486230 (from the
 *     south-west, side on: the handle's profile, the bowl's pitch, cherry and
 *     stem proportions, colours);
 *   puroticorico, "Vertical Spoonbridge & Cherry Reflection Pool", CC BY 2.0,
 *     https://www.flickr.com/photos/10058483@N00/3612484030;
 *   joshdbrown, "Spoonbridge and Cherry - Claes Oldenburg & Coosje van
 *     Bruggen", CC BY 2.0, https://www.flickr.com/photos/89407885@N00/4880411222
 *     (from the north-east: the bowl's back, the neck, the cherry at the
 *     bowl's top);
 *   Sharon Mollerus, "Claese Oldenburg, Spoonbridge and Cherry, Minneapolis",
 *     CC BY 2.0, https://www.flickr.com/photos/38315261@N00/53917016041 (from
 *     the south-east, above: the bowl's back, the stem's bend);
 *   J Wynia, "Spoonbridge And Cherry", CC BY 2.0,
 *     https://www.flickr.com/photos/73451168@N00/3565059684 (from the
 *     north-west along the handle: the stem's bend toward the south-west);
 *   tophrrrr, "Spoonbridge, Cherry and Topher", CC BY 2.0,
 *     https://www.flickr.com/photos/11317612@N03/20264084551.
 * - Look-only (NC/ND, not used for shape): jpellgen's Flickr series
 *   (CC BY-NC-ND 2.0).
 * Measured: the axis and plan (OSM, lidar), the handle's crest (lidar).
 * Published: overall height 9.0 m (the knob's top), length 15.7 m.
 * Estimated from the photos, scaled to the published height: the handle's
 *   profile and width (1.3 m at the end, 0.55 m at the neck), its 0.4 m
 *   thickness, the bowl (5.4 x 3.9 m, 0.7 m deep, pitched 50 deg, turned 12
 *   deg), the cherry's 2.9 m diameter and where it rests, the stem's bend.
 * Doubts: the bowl's exact pitch and turn (no photo straight from the
 *   south-east at eye level); the cherry may be a little smaller than
 *   modelled (the side-on photo gives 2.7 m, the others look larger); the
 *   real bowl is egg-shaped with a ridge holding the cherry, drawn as a plain
 *   egg-shaped dish.
 * Night: the spoon and cherry carry a modest `floodlight` (the garden lights
 *   the sculpture after dark; no licensed night photo was checked, so the
 *   amount is estimated); the stem is unlit.
 */
import { Part, type V3, cross } from './mesh'
import { finish } from './palette'
import { lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- vectors
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const D2R = Math.PI / 180

// ---------------------------------------------------------------- the plan
// The spoon lies on one straight axis in plan, handle tip at the north-west,
// bowl at the south-east (OSM way/574151474; lidar's handle strip runs at the
// same bearing).
export const AXIS_BEARING = 131
const A: V3 = [Math.sin(AXIS_BEARING * D2R), Math.cos(AXIS_BEARING * D2R), 0] // along the spoon, tip -> bowl
const SW: V3 = [Math.sin((AXIS_BEARING + 90) * D2R), Math.cos((AXIS_BEARING + 90) * D2R), 0] // to its right, the south-west
const UP: V3 = [0, 0, 1]
const TIP: V3 = [-6.55, 5.95, 0] // the handle's end in plan (OSM, lidar)

// ---------------------------------------------------------------- the handle
// Centreline height above the pool by distance u along the axis (m), read
// from the side-on photo (puroticorico, from the south-west) scaled to the
// published 9.0 m overall height, and from lidar (crest 2.3 m).
const PROFILE: [number, number][] = [
  [0, 0.75], [1.5, 1.05], [3.5, 1.5], [5.5, 1.95], [7.0, 2.2], [8.0, 2.22], [8.9, 1.95], [9.6, 1.35], [10.1, 0.8], [10.55, 0.5],
]
const NECK_U = 10.55
/** Catmull-Rom through PROFILE. */
function heightAt(u: number) {
  const P = PROFILE
  let i = 0
  while (i < P.length - 2 && u > P[i + 1][0]) i++
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]
  const t = Math.min(1, Math.max(0, (u - p1[0]) / (p2[0] - p1[0])))
  const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * (p2[0] - p1[0])
  const m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * (p2[0] - p1[0])
  const t2 = t * t, t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2
}
/** Handle width: a broad rounded end narrowing to the neck. */
function widthAt(u: number) {
  if (u < 0.6) return 1.3 * Math.sqrt(Math.max(0.04, 1 - ((0.6 - u) / 0.6) ** 2))
  if (u < 6.5) return 1.3 - (u - 0.6) * 0.045
  return Math.max(0.55, 1.03 - (u - 6.5) * 0.12)
}
const HT = 0.4 // handle thickness

// ---------------------------------------------------------------- the bowl
const PITCH = 50 // bowl axis above horizontal
const ROLL = 12 // the bowl turned so its hollow faces the south-west
const BL = 5.4, BW = 3.9, BD = 0.7, BT = 0.22 // length, width (published 162 in), depth, shell
const B: V3 = add(mul(A, Math.cos(PITCH * D2R)), mul(UP, Math.sin(PITCH * D2R)))
const N0: V3 = unit(cross(SW, B)).map((v, i, n) => (n[2] < 0 ? -v : v)) as V3
const NB: V3 = unit(add(mul(N0, Math.cos(ROLL * D2R)), mul(SW, Math.sin(ROLL * D2R)))) // the hollow's normal
const LB: V3 = unit(cross(B, NB)).map((v) => v) as V3 // across the bowl
const NECK: V3 = add(add(TIP, mul(A, NECK_U)), [0, 0, 0.5])

/** A point on the bowl: a along it from the neck, b across, c out of the hollow. */
const bowlPt = (a: number, b: number, c: number): V3 => add(add(add(NECK, mul(B, a)), mul(LB, b)), mul(NB, c))
const AC = BL / 2 + 0.1
/** Egg outline, (rho, theta) -> (a, b, depth below the rim plane). */
function bowlAB(rho: number, th: number): [number, number, number] {
  const egg = 1 + 0.13 * Math.cos(th) // wider toward the far end
  const a = AC + (BL / 2 + 0.1) * rho * Math.cos(th)
  const b = (BW / 2) * rho * Math.sin(th) * egg
  return [a, b, -BD * (1 - rho * rho)]
}

// ---------------------------------------------------------------- the cherry
const CR = 1.45 // radius: photo, scaled to the published height
const CHERRY_A = 4.2 // where it rests in the hollow
const [ca, cb, cc] = [CHERRY_A, 0.05, -BD * (1 - ((CHERRY_A - AC) / (BL / 2 + 0.1)) ** 2)]
const CHERRY: V3 = bowlPt(ca, cb, cc + CR * 0.97)
const TOP_Z = 8.9 + 0.27 // the stem's knob top, 9.0 m (published: 354 in), less the knob's own height

// ---------------------------------------------------------------- build
export function build() {
  const spoon = new Part(), back = new Part(), cherry = new Part(), stem = new Part()

  // Handle: a swept bevelled ribbon, rolling into the bowl's tilt near the neck.
  const N = 44
  const rings: V3[][] = []
  for (let k = 0; k <= N; k++) {
    const u = (NECK_U * k) / N
    const du = 0.05
    const T = unit(add(mul(A, 2 * du), [0, 0, heightAt(Math.min(NECK_U, u + du)) - heightAt(Math.max(0, u - du))]))
    const roll = u < 8 ? 0 : ROLL * ((u - 8) / (NECK_U - 8)) ** 1.5
    const L0 = SW, Nn0 = unit(cross(L0, T)).map((v, i, n) => (n[2] < 0 ? -v : v)) as V3
    const L = add(mul(L0, Math.cos(roll * D2R)), mul(Nn0, -Math.sin(roll * D2R)))
    const Nn = unit(cross(T, L)).map((v, i, n) => (dot(n as V3, Nn0) < 0 ? -v : v)) as V3
    const c = add(add(TIP, mul(A, u)), [0, 0, heightAt(u)])
    const w = widthAt(u) / 2, t = HT / 2, bv = Math.min(0.1, w * 0.3)
    // section counter-clockwise looking along T: top edge first
    const sec: [number, number][] = [[w - bv, t], [-w + bv, t], [-w, t - bv], [-w, -t + bv], [-w + bv, -t], [w - bv, -t], [w, -t + bv], [w, t - bv]]
    rings.push(sec.map(([s, h]) => add(add(c, mul(L, s)), mul(Nn, h))))
  }
  // sides: top faces (index 0->1) in the light finish, the rest in the darker underside
  for (let k = 0; k < N; k++) {
    const r0 = rings[k], r1 = rings[k + 1]
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const part = i <= 1 || i === 7 ? spoon : back
      part.quad(r0[j], r0[i], r1[i], r1[j])
    }
  }
  // close the tip
  const r0 = rings[0]
  for (let i = 1; i < 7; i++) back.tri(r0[0], r0[i + 1], r0[i])

  // Bowl: hollow (inside, light), back (outside, darker), and the rim band.
  const NR = 7, NT = 20
  const inner: V3[][] = [], outer: V3[][] = []
  for (let r = 0; r <= NR; r++) {
    const rho = r / NR
    inner.push([]), outer.push([])
    for (let s = 0; s < NT; s++) {
      const th = (2 * Math.PI * s) / NT
      const [a, b, c] = bowlAB(rho, th)
      inner[r].push(bowlPt(a, b, c))
      outer[r].push(bowlPt(a, b * (1 + 0.04 * rho), c - BT - 0.15 * (1 - rho * rho)))
    }
  }
  for (let r = 0; r < NR; r++)
    for (let s = 0; s < NT; s++) {
      const t = (s + 1) % NT
      // the hollow faces +NB: wind so
      const q: V3[] = [inner[r][s], inner[r][t], inner[r + 1][t], inner[r + 1][s]]
      const nq = cross([q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]])
      if (r === 0) {
        if (dot(cross([q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]], [q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]]), NB) > 0) spoon.tri(q[0], q[2], q[3])
        else spoon.tri(q[0], q[3], q[2])
      } else if (dot(nq, NB) > 0) spoon.quad(q[0], q[1], q[2], q[3])
      else spoon.quad(q[0], q[3], q[2], q[1])
      const o: V3[] = [outer[r][s], outer[r][t], outer[r + 1][t], outer[r + 1][s]]
      if (r === 0) {
        const n2 = cross([o[2][0] - o[0][0], o[2][1] - o[0][1], o[2][2] - o[0][2]], [o[3][0] - o[0][0], o[3][1] - o[0][1], o[3][2] - o[0][2]])
        if (dot(n2, NB) < 0) back.tri(o[0], o[2], o[3])
        else back.tri(o[0], o[3], o[2])
      } else if (dot(nq, NB) > 0) back.quad(o[0], o[3], o[2], o[1])
      else back.quad(o[0], o[1], o[2], o[3])
      if (r === NR - 1) {
        // rim band from the hollow's edge to the back's edge, facing outward
        const a = inner[NR][s], b = inner[NR][t], c = outer[NR][t], d = outer[NR][s]
        const mid = mul(add(a, b), 0.5), ctr = bowlPt(AC, 0, 0)
        const out = [mid[0] - ctr[0], mid[1] - ctr[1], mid[2] - ctr[2]] as V3
        const n3 = cross([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [d[0] - a[0], d[1] - a[1], d[2] - a[2]])
        if (dot(n3, out) > 0) spoon.quad(a, b, c, d)
        else spoon.quad(a, d, c, b)
      }
    }

  // Cherry: a true sphere.
  const prof: [number, number][] = []
  for (let k = 0; k <= 12; k++) {
    const ph = (Math.PI * k) / 12
    prof.push([CR * Math.sin(ph), CHERRY[2] - CR * Math.cos(ph)])
  }
  lathe(cherry, CHERRY[0], CHERRY[1], prof, 16)

  // Stem: rises from the top of the cherry and bends over toward the south-west.
  const base: V3 = [CHERRY[0], CHERRY[1], CHERRY[2] + CR - 0.2]
  const rise = TOP_Z - 0.2 - base[2]
  const path: V3[] = []
  for (let k = 0; k <= 10; k++) {
    const t = k / 10
    const lean = 0.95 * t * t // bends over near the top
    const drift = 0.25 * Math.sin(Math.PI * t) // a slight swell toward the north-east first
    path.push(add(add(base, mul(SW, lean - drift)), [0, 0, rise * Math.sin((t * Math.PI) / 2 * 0.98 + 0.02 * t)]))
  }
  tube(stem, path, 0.16, 8)
  // the knob at the stem's tip
  const tip = path[path.length - 1]
  const kp: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const ph = (Math.PI * k) / 6; kp.push([0.24 * Math.sin(ph), tip[2] + 0.05 - 0.24 * Math.cos(ph)]) }
  lathe(stem, tip[0], tip[1], kp, 10)

  // Floodlit at night by the garden's lamps (spoon and cherry, from below).
  const lit = (p: V3, n: V3) => Math.max(0.25, 0.8 - 0.3 * Math.max(0, n[2]))
  const spoonM = { ...finish('spoon-steel', 0xdfe3e5, 0.45), floodlight: lit }
  const backM = { ...finish('spoon-back', 0xaeb6bc, 0.45), floodlight: lit }
  const cherryM = { ...finish('cherry-red', 0xb3262f, 0.4), floodlight: lit }
  const stemM = finish('stem-dark', 0x4a4f57, 0.5)
  // y = 0 at the lowest point: the bowl's back and the handle's end rest on
  // their islands (TOP_Z allows for this shift, so the knob tops out at 9.0 m).
  const parts = [spoon, back, cherry, stem]
  let low = Infinity
  for (const q of parts) for (let i = 1; i < q.pos.length; i += 3) low = Math.min(low, q.pos[i])
  for (const q of parts) for (let i = 1; i < q.pos.length; i += 3) q.pos[i] -= low
  return finishGlb('msp-spoonbridge-and-cherry', [
    { part: spoon, material: spoonM }, { part: back, material: backM }, { part: cherry, material: cherryM }, { part: stem, material: stemM },
  ], { name: 'Spoonbridge and Cherry' })
}

/** A round tube along a path, capped at the start. */
function tube(p: Part, path: V3[], r: number, sides: number) {
  const rings: V3[][] = [], norms: V3[][] = []
  for (let k = 0; k < path.length; k++) {
    const a = path[Math.max(0, k - 1)], b = path[Math.min(path.length - 1, k + 1)]
    const T = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
    const ref: V3 = Math.abs(T[2]) < 0.9 ? UP : [1, 0, 0]
    const U = unit(cross(T, ref)), W = unit(cross(T, U))
    rings.push([]), norms.push([])
    for (let i = 0; i < sides; i++) {
      const ang = (2 * Math.PI * i) / sides
      const n = add(mul(U, Math.cos(ang)), mul(W, Math.sin(ang)))
      norms[k].push(n), rings[k].push(add(path[k], mul(n, r)))
    }
  }
  for (let k = 0; k < path.length - 1; k++)
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      p.tri(a, b, c, undefined, undefined, undefined, [norms[k][i], norms[k][j], norms[k + 1][j]])
      p.tri(a, c, d, undefined, undefined, undefined, [norms[k][i], norms[k + 1][j], norms[k + 1][i]])
    }
}

if (import.meta.main) await writeModel('msp-spoonbridge-and-cherry', build())
