/**
 * Tsitsernakaberd, the Armenian Genocide Memorial (Հայոց ցեղասպանության
 * զոհերի հուշահամալիր), on Tsitsernakaberd hill, Yerevan: procedural,
 * CC0-1.0, no textures.
 *   bun generators/yerevan-tsitsernakaberd.ts
 * Writes models/yerevan-tsitsernakaberd.glb and a detail model
 * (.detail.glb: the slabs' and the wall's coursed joints cut as real V
 * grooves, the dark granite plaques on the wall's back, rounder rings).
 *
 * The three structures of the 1967 memorial (architects Arthur Tarkhanyan
 * and Sashur Kalashyan, artist Hovhannes Khachatryan): the Temple of
 * Eternity, twelve grey basalt slabs leaning inward round the eternal
 * flame; the 44 m stele split by a deep cleft into a taller and a shorter
 * blade; and the 100 m memorial wall along the alley. The museum (1995) is
 * dug into the hill to the west and is left to the map; the paved platform
 * and its stairs are ground and are not modelled.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin at the area
 * centroid of the sanctuary's outline relation/15806889 (OSM-local
 * (116.44, 6.21) m from 44.4892, 40.1857): anchor 44.490569, 40.185756.
 * y = 0 is the ground, and the floor of the sunken hall inside the ring.
 * The ring stands on a raised paved platform modelled as a plinth 1.5 m
 * high and 37 m across (the real platform stands about 2 m over the lawns
 * in the photos), with the hall 1.5 m below its top (published) and five
 * steps down in each gap. Elevation 0; the stele and the wall stand on the
 * ground.
 *
 * Identity: the open truncated cone of twelve slabs, each a steep wedge
 * whose outer face slopes up to a narrow flat top and whose inner face
 * leans over the hall, with stair-wide gaps between them, so from any side
 * it reads as a ring of grey fins round an empty crater; beside it the
 * light-grey needle of the stele, two tapering blades with a slot between
 * them, the north one taller; the long low wall to the north-west.
 *
 * Evidence
 * - OSM (ODbL): the sanctuary relation/15806889 (building, roof:shape
 *   pyramidal; a 16.2 m radius circle, its twelve slab footprints as inner
 *   ways, the slabs centred at 0, 30, ... 330 deg from east), the parts
 *   between the slabs relation/15807133 (building:part), the eternal flame
 *   relation/15810873 (a 3 m radius circle at the centre), the stele
 *   node/3465608027 (man_made=obelisk, height 44), the memorial wall
 *   way/306703397 (barrier=wall, 100 m), the memorial area way/1168573628.
 * - Published: Wikipedia "Tsitsernakaberd" (en): twelve slabs in a circle
 *   round the eternal flame, the 44 m stele in two parts, the 100 m wall;
 *   ru.wikipedia "Цицернакаберд": the flame burns 1.5 m below the
 *   platform.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Genocide Memorial complex from air on a sunny day, September
 *     2017.jpg", Aleksey Chalabyan (Xelgen), CC BY-SA 4.0: the plan from
 *     the north, slab ring, stele and wall; colours
 *     https://commons.wikimedia.org/wiki/File:Genocide_Memorial_complex_from_air_on_a_sunny_day,_September_2017.jpg
 *   - "A girl putting flowers to Armenian Genocide memorial. View from
 *     top.jpg", same author, CC BY-SA 4.0: the ring straight down: slab
 *     widths, the gaps, the flame
 *     https://commons.wikimedia.org/wiki/File:A_girl_putting_flowers_to_Armenian_Genocide_memorial._View_from_top.jpg
 *   - "Tsitsernakaberd Memorial in 2015.jpg", Armineaghayan, CC BY-SA 4.0:
 *     the ring face on with people for scale: slab height 8.6 m
 *     https://commons.wikimedia.org/wiki/File:Tsitsernakaberd_Memorial_in_2015.jpg
 *   - "Tsitsernakaberd 01.jpg", Dav Sargsyan, CC BY-SA 4.0: from the west
 *     along the alley: the wall, the stele's cleft, slab height against the
 *     44 m stele
 *     https://commons.wikimedia.org/wiki/File:Tsitsernakaberd_01.jpg
 *   - "Arrow-shaped stele, Tsitsernakaberd 05.jpg" and "Armenian Genocide
 *     Memorial complex, Tsitsernakaberd 01.jpg" / "... 02.jpg", Մարի
 *     Ավետիսյան, CC BY-SA 4.0: the stele's two blades (the short one's tip
 *     at 0.8 of the tall one), the ring's silhouette
 *     https://commons.wikimedia.org/wiki/File:Arrow-shaped_stele,_Tsitsernakaberd_05.jpg
 *     https://commons.wikimedia.org/wiki/File:Armenian_Genocide_Memorial_complex,_Tsitsernakaberd_02.jpg
 *   - "Yerevan-Tsitsernakaberd-26-2019-gje.jpg", Gerd Eichmann, CC BY-SA
 *     4.0, and "Tsitsernakaberd Genocide Memorial Yerevan.jpg", Rita
 *     Willaert, CC BY 2.0: inside the ring, the inner faces leaning in
 *     https://commons.wikimedia.org/wiki/File:Yerevan-Tsitsernakaberd-26-2019-gje.jpg
 *     https://commons.wikimedia.org/wiki/File:Tsitsernakaberd_Genocide_Memorial_Yerevan.jpg
 *   - "Tsitsernakaberd - Armenian Genocide memorial complex (18.09.2019)
 *     64.jpg", Gardmanahay, CC BY-SA 4.0: the wall's basalt
 *     https://commons.wikimedia.org/wiki/File:Tsitsernakaberd_-_Armenian_Genocide_memorial_complex_(18%E2%80%A409%E2%80%A42019)_64.jpg
 *
 * Numbers: plan from OSM (measured). Stele 44 m over the platform
 * (published), the short blade 35 m and the base 5.0 x 5.4 m (estimated
 * from the photos against the 44 m). Slabs 9 m over the platform, 10.5 m
 * over the hall floor (estimated: in the 2015 face-on photo the ring is
 * 0.30 as tall as it is wide at its feet, and the side slabs' profiles
 * rise at 41-48 deg; people for scale); feet at r 15.0, tops r 7.3 to
 * 8.1, inner feet r 9.0 on the hall floor, a 1.8 m stair gap with five
 * steps down (estimated from the overhead photo and the OSM footprints).
 * The flame's bowl in three steps, 6.2 m across (OSM: 3 m radius). Wall 3.0 m
 * high, 1.2 m thick (estimated). Colours sampled from the photos: slabs
 * and wall basalt #86807d (overcast) .. #93948c (sun), the stele granite
 * #909191 in sun, read a little lighter in every photo than the slabs.
 *
 * Doubts and terrain: the plinth is the ring's paved circle only, not the
 * whole rectangular platform with its stairs (ground for the map). The
 * rest of the platform is raised about 2 m over the
 * lawns on its north and east (photos); Mapterhorn here is z12 only, gently
 * sloped (about 2.5 m across the 175 m site) and shows no platform, so the
 * wall's west end sinks into it a little. The stele's cleft is taken as
 * running east-west (the cleft shows from the west in Sargsyan's photo and
 * not from the north in the aerial).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { lathe } from './sf-de-young'
import { quadOut, triOut } from './moscow-church-kit'
import { writeModel } from './tbilisi-holy-trinity-cathedral'

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const normalOf = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  return unit([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]])
}
/** A convex face given counter-clockwise from outside, fanned. */
function poly(p: Part, pts: V3[], c: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], d = pts[i + 1]
    const m: V3 = [(a[0] + b[0] + d[0]) / 3 - c[0], (a[1] + b[1] + d[1]) / 3 - c[1], (a[2] + b[2] + d[2]) / 3 - c[2]]
    triOut(p, a, b, d, m)
  }
}

// ---- The Temple of Eternity ------------------------------------------
// z = 0 is the ground and the floor of the sunken hall; the plinth round
// the ring is PZ high.
const PZ = 1.5
const H = PZ + 9.0 // slab tops: 9 m over the platform
const R_FOOT = 15.0, R_TOP_OUT = 8.1, R_TOP_IN = 7.3, R_FOOT_IN = 9.0
const GAP = 1.8 // the stair gap between slabs, constant across its run
const SIN = Math.sin(Math.PI / 12)
const half = (r: number) => r * SIN - GAP / 2 // the slab's half width at radius r

/**
 * A quad face a0 a1 (bottom) b0 b1 (top), split into `n` courses with a
 * V joint `d` deep cut between them (real geometry), facing `out`.
 */
function coursed(p: Part, a0: V3, a1: V3, b0: V3, b1: V3, out: V3, n: number, d = 0.07, g = 0.07) {
  if (n <= 1) { quadOut(p, a0, a1, b1, b0, out); return }
  const len = Math.hypot(b0[0] - a0[0], b0[1] - a0[1], b0[2] - a0[2]), gt = g / len
  const at = (t: number, dd: number): [V3, V3] => {
    const q0 = a0.map((v, k) => v + (b0[k] - v) * t - out[k] * dd) as V3, q1 = a1.map((v, k) => v + (b1[k] - v) * t - out[k] * dd) as V3
    return [q0, q1]
  }
  for (let k = 0; k < n; k++) {
    const t0 = k / n + (k ? gt : 0), t1 = (k + 1) / n - (k < n - 1 ? gt : 0)
    const [p0, p1] = at(t0, 0), [q0, q1] = at(t1, 0)
    quadOut(p, p0, p1, q1, q0, out)
    if (k < n - 1) {
      const [j0, j1] = at((k + 1) / n, d), [r0, r1] = at((k + 1) / n + gt, 0)
      quadOut(p, q0, q1, j1, j0, out)
      quadOut(p, j0, j1, r1, r0, out)
    }
  }
}

function slab(p: Part, ang: number, courses: number) {
  const c = Math.cos(ang), s = Math.sin(ang)
  const P = (r: number, t: number, z: number): V3 => [r * c - t * s, r * s + t * c, z]
  // section corners, outer foot -> top outer -> top inner -> inner foot
  const sec: Array<[number, number]> = [[R_FOOT, PZ], [R_TOP_OUT, H], [R_TOP_IN, H], [R_FOOT_IN, 0]]
  const out = sec.map(([r, z]) => [P(r, -half(r), z), P(r, half(r), z)])
  const centre = P((R_FOOT + R_TOP_IN) / 2, 0, H / 2)
  for (let k = 0; k < 3; k++) {
    const [a0, a1] = out[k], [b0, b1] = out[k + 1]
    coursed(p, a0, a1, b0, b1, sub(normalOf(a0, a1, b1), centre, a0), k === 1 ? 1 : courses)
  }
  // the two side faces (planar: the half width is linear in r), down to the stair slope
  for (const side of [0, 1]) poly(p, out.map((q) => q[side]), centre)
}
function sub(n: V3, c: V3, a: V3): V3 {
  // orient n away from the slab's centre
  const d = (a[0] - c[0]) * n[0] + (a[1] - c[1]) * n[1] + (a[2] - c[2]) * n[2]
  return d >= 0 ? n : [-n[0], -n[1], -n[2]]
}
/** A box on the ground plane given its four plan corners (counter-clockwise), z0..z1. */
function box4(p: Part, q: Array<[number, number]>, z0: number, z1: number) {
  const cx = q.reduce((t, v) => t + v[0], 0) / 4, cy = q.reduce((t, v) => t + v[1], 0) / 4
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4]
    quadOut(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0])
  }
  quadOut(p, [q[0][0], q[0][1], z1], [q[1][0], q[1][1], z1], [q[2][0], q[2][1], z1], [q[3][0], q[3][1], z1], [0, 0, 1])
}

export function build(detail: boolean) {
  const basalt = new Part(), granite = new Part(), dark = new Part(), flame = new Part()
  const SEG = detail ? 32 : 16

  for (let i = 0; i < 12; i++) slab(basalt, (i * Math.PI) / 6, detail ? 7 : 1)

  // the sunken hall: its floor, and the stairs down between the slabs
  lathe(dark, [[9.7, 0.02], [0.01, 0.02]], SEG, [0, 0], 0, false)
  const NST = 5, R_ST0 = R_FOOT + 0.2, R_ST1 = 9.4
  for (let i = 0; i < 12; i++) {
    const g = (i * Math.PI) / 6 + Math.PI / 12, c = Math.cos(g), s = Math.sin(g)
    const Q = (r: number, t: number): [number, number] => [r * c - t * s, r * s + t * c]
    for (let j = 0; j < NST; j++) {
      const r0 = R_ST0 - ((R_ST0 - R_ST1) * j) / NST, r1 = R_ST0 - ((R_ST0 - R_ST1) * (j + 1)) / NST
      const w = GAP / 2 + 0.25
      box4(dark, [Q(r1, -w), Q(r0, -w), Q(r0, w), Q(r1, w)], 0, PZ - (PZ * (j + 1)) / (NST + 0.5))
    }
  }

  // the raised paved platform the ring stands on: a plinth PZ high round
  // the slabs' feet, its top the paving between them and its edge
  const RP = 18.5
  lathe(basalt, [[RP, 0], [RP, PZ], [R_FOOT - 0.3, PZ]], SEG, [0, 0], 0, false)
  // the hall's retaining edge under the slabs' inner feet
  lathe(dark, [[9.7, PZ * 0.05], [9.7, 0.02]], SEG, [0, 0], 0, false)

  // the eternal flame in its stepped bowl, and the flame (lit at night)
  lathe(dark, [[3.1, 0], [3.1, 0.5], [2.6, 0.5], [2.6, 0.32], [2.1, 0.32], [2.1, 0.16], [1.5, 0.16], [1.5, 0.06], [0.01, 0.06]], detail ? 24 : 16, [0, 0], 0, false)
  lathe(flame, [[0.8, 0.06], [0.6, 0.6], [0.32, 1.0], [0.02, 1.6]], 8, [0, 0], 0.3)

  // ---- The stele: two blades, the cleft between them east-west ---------
  const SX = -47.84, SY = -13.81
  const HX = 2.5, YN = 2.7, YS = -2.7, CL = 0.2, YC = -0.35 // the cleft's centre line
  const blade = (y0: number, y1: number, apexY: number, h: number) => {
    const b: V3[] = [[SX - HX, SY + y0, 0], [SX + HX, SY + y0, 0], [SX + HX, SY + y1, 0], [SX - HX, SY + y1, 0]]
    const apex: V3 = [SX, SY + apexY, h]
    const c: V3 = [SX, SY + (y0 + y1) / 2, h / 4]
    for (let k = 0; k < 4; k++) {
      const a = b[k], d = b[(k + 1) % 4]
      const m: V3 = [(a[0] + d[0] + apex[0]) / 3 - c[0], (a[1] + d[1] + apex[1]) / 3 - c[1], (a[2] + d[2] + apex[2]) / 3 - c[2]]
      triOut(granite, a, d, apex, m)
    }
  }
  blade(YC + CL, YN, YC + CL, PZ + 44.0) // north, the tall one
  blade(YS, YC - CL, YC - CL, PZ + 35.0) // south, the short one
  // the dark back of the cleft, set in its middle
  quadOut(dark, [SX - HX * 0.6, SY + YC, 0], [SX + HX * 0.6, SY + YC, 0], [SX + 0.1, SY + YC, 30], [SX - 0.1, SY + YC, 30], [0, 1, 0])
  quadOut(dark, [SX - HX * 0.6, SY + YC, 0], [SX + HX * 0.6, SY + YC, 0], [SX + 0.1, SY + YC, 30], [SX - 0.1, SY + YC, 30], [0, -1, 0])

  // ---- The memorial wall --------------------------------------------
  const W = [[-143.67, 29.49], [-86.36, 27.17], [-43.07, 25.41]]
  const WH = PZ + 3.0, WT = 1.2
  for (let i = 0; i < W.length - 1; i++) {
    const [ax, ay] = W[i], [bx, by] = W[i + 1]
    const u = unit([bx - ax, by - ay, 0]), n: V3 = [u[1], -u[0], 0]
    const o = (x: number, y: number, sd: number, z: number): V3 => [x + n[0] * sd, y + n[1] * sd, z]
    const e0 = i === 0 ? 0 : WT / 2, e1 = i === W.length - 2 ? 0 : WT / 2 // overlap at the bend
    const A = [ax - u[0] * e0, ay - u[1] * e0], B = [bx + u[0] * e1, by + u[1] * e1]
    const box = (s0: number, s1: number, z0: number, z1: number, courses: number) => {
      const p = [o(A[0], A[1], s0, z0), o(B[0], B[1], s0, z0), o(B[0], B[1], s1, z0), o(A[0], A[1], s1, z0)]
      const q = p.map((v) => [v[0], v[1], z1] as V3)
      coursed(basalt, p[0], p[1], q[0], q[1], n, courses, 0.06, 0.05)
      coursed(basalt, p[2], p[3], q[2], q[3], [-n[0], -n[1], 0], courses, 0.06, 0.05)
      quadOut(basalt, p[1], p[2], q[2], q[1], u)
      quadOut(basalt, p[3], p[0], q[0], q[3], [-u[0], -u[1], 0])
      quadOut(basalt, q[0], q[1], q[2], q[3], [0, 0, 1])
    }
    // the courses above the platform: the base below it is buried
    box(-WT / 2, WT / 2, 0, PZ, 1)
    box(-WT / 2, WT / 2, PZ, WH - 0.25, detail ? 3 : 1)
    box(-WT / 2 + 0.12, WT / 2 - 0.12, WH - 0.25, WH, 1) // the slightly set-back coping
    if (detail) {
      // the plaques of the righteous on the back (north) face, dark granite standing proud
      const L = Math.hypot(bx - ax, by - ay)
      for (let d = 3; d < L - 2; d += 4.2) {
        const c0 = [ax + u[0] * d, ay + u[1] * d], sd = WT / 2
        const P4 = (du: number, z: number, dn: number): V3 => [c0[0] + u[0] * du - n[0] * (sd + dn), c0[1] + u[1] * du - n[1] * (sd + dn), z]
        const z0 = PZ + 1.05, z1 = PZ + 1.95, h = 0.45
        quadOut(dark, P4(h, z0, 0.06), P4(-h, z0, 0.06), P4(-h, z1, 0.06), P4(h, z1, 0.06), [-n[0], -n[1], 0])
        quadOut(dark, P4(-h, z1, 0), P4(h, z1, 0), P4(h, z1, 0.06), P4(-h, z1, 0.06), [0, 0, 1])
        quadOut(dark, P4(h, z0, 0), P4(-h, z0, 0), P4(-h, z0, 0.06), P4(h, z0, 0.06), [0, 0, -1])
        quadOut(dark, P4(-h, z0, 0), P4(-h, z1, 0), P4(-h, z1, 0.06), P4(-h, z0, 0.06), [-u[0], -u[1], 0])
        quadOut(dark, P4(h, z1, 0), P4(h, z0, 0), P4(h, z0, 0.06), P4(h, z1, 0.06), u)
      }
    }
  }
  return { basalt, granite, dark, flame }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.7)
    return [
      { part: p.basalt, material: { ...finish('tsitsernakaberd-basalt', 0x8b8682), floodlight: lit } },
      { part: p.granite, material: { ...finish('tsitsernakaberd-granite', 0xa9a8a4), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.85) } },
      { part: p.dark, material: finish('tsitsernakaberd-shadow', 0x55524f) },
      { part: p.flame, material: finish('neon-eternal-flame', 0xe8893a, 0.6) },
    ]
  }
  void PALETTE
  const meta = { bearing: 0, osm: 'relation/15806889', height: 45.5 }
  await writeModel('yerevan-tsitsernakaberd.glb', 'Tsitsernakaberd Armenian Genocide Memorial', make(false), meta, 5000, 250 * 1024)
  await writeModel('yerevan-tsitsernakaberd.detail.glb', 'Tsitsernakaberd Armenian Genocide Memorial', make(true), meta, 40000, 1536 * 1024)
}
