/**
 * Tbilisi TV Broadcasting Tower on Mtatsminda, 1972, 274.5 m: procedural,
 * CC0-1.0, no textures.
 *   bun generators/tbilisi-tv-tower.ts
 * Writes models/tbilisi-tv-tower.glb and a detail model
 * models/tbilisi-tv-tower.detail.glb (the mast's lattice at full density,
 * the bracing rods between the legs and the shaft, rounder tubes).
 *
 * Uses writeModel from tbilisi-chronicle-of-georgia.ts.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin at the area
 * centroid of the outline way/437940450: 44.7849377, 41.6957606.
 *
 * Identity: not a symmetric lattice pylon but a lopsided tripod: a vertical
 * tubular shaft carrying the round cabin at 137-155 m, propped on its west
 * side by two great inclined tubular legs that lean in from feet 50 m
 * apart to meet it under the cabin; each leg forks at 35 m into an outer
 * and an inner foot; a horizontal frame ties the knees at 35 m; a big boxy
 * equipment platform hangs between the legs and the shaft at 41-52 m, and
 * smaller platforms ring the shaft higher up. Above the cabin a square
 * steel lattice mast tapers to 259 m, then a pole to 274.5 m. Every tube
 * and lattice member is painted in red and white bands. At night it is lit
 * in coloured LEDs, magenta and violet in the photos.
 *
 * Evidence
 * - OSM (ODbL): way/437940450 (man_made=communications_tower, height
 *   274.5, start_date 1972); building:parts 1218304159/1218304160 (the leg
 *   triangle at 70 m with the shaft at its east corner, skillion to 155),
 *   1218304161 (the legs between 35 and 70 m), 1218304163 and 1218304164
 *   (the forked lower legs, 0-35 m, feet at (-31.7, -27.4) and (-28.7,
 *   30.9) m from 44.7850, 41.6958), 1021675581 (the cabin, 137-155 m, 19 m
 *   across), 1021675582 and 1218304162 (the mast's base and the mast to
 *   274.5 m). The model takes the shaft's centre, the knees, the feet and
 *   the cabin from these.
 * - Published: Wikipedia (en, "Tbilisi TV Broadcasting Tower"): 274.5 m,
 *   1972. https://en.wikipedia.org/wiki/Tbilisi_TV_Broadcasting_Tower
 * - Photos (all evidence):
 *   - "თბილისის სატელევიზიო ანძა 01.jpg", Davit butulashvili, CC BY-SA 4.0:
 *     from the park to the south-west, close: the legs' fork and the frame
 *     at 35 m, the box platform, the bands, the cabin.
 *     https://commons.wikimedia.org/wiki/File:%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98%E1%83%A1_%E1%83%A1%E1%83%90%E1%83%A2%E1%83%94%E1%83%9A%E1%83%94%E1%83%95%E1%83%98%E1%83%96%E1%83%98%E1%83%9D_%E1%83%90%E1%83%9C%E1%83%AB%E1%83%90_01.jpg
 *   - "Torre de televisió de Tbilisi.jpg", Lohen11, CC BY 4.0: at night
 *     from the city to the east-north-east; every height below scaled from
 *     it (0.2745 m/px): cabin centre 143 m, box platform 41-52 m, the
 *     frame near 10 m, the foot spread; and the LED colours.
 *     https://commons.wikimedia.org/wiki/File:Torre_de_televisi%C3%B3_de_Tbilisi.jpg
 *   - "Mt. Mtatsminda as seen from the Public Service Hall parking area.
 *     Tbilisi, Georgia. 2023.jpg", Kober, CC0: from the north-east, the
 *     daylight silhouette on the ridge.
 *     https://commons.wikimedia.org/wiki/File:Mt._Mtatsminda_as_seen_from_the_Public_Service_Hall_parking_area._Tbilisi,_Georgia._2023.jpg
 *   - "Teleandza.Tbilisi.jpg", Ninuc10, CC BY 4.0: at dusk from the east,
 *     the tripod's lean, lit pink.
 *     https://commons.wikimedia.org/wiki/File:Teleandza.Tbilisi.jpg
 *
 * Numbers: plan and the 35/70/137/155/274.5 m levels from OSM; the box
 * platform, the shaft and leg diameters (5 m, 3 m), the mast's taper (5.6
 * m wide at its foot to 1.2 m) and the band lengths estimated from the
 * photos. Doubts: the inner fork feet are placed from butulashvili's photo
 * only; the bracing rods are drawn at half density. Night: the red bands
 * are `neon` (the tower glows magenta-pink), the white paint floodlit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { writeModel, quadOut } from './tbilisi-chronicle-of-georgia'

const TAU = Math.PI * 2
const O: [number, number] = [-5.18, -4.36] // outline centroid in OSM local metres from 44.7850, 41.6958
const L = (x: number, y: number): [number, number] => [x - O[0], y - O[1]]
const S = L(21.2, -6.8) // the shaft
const K1 = L(-11.1, -20.3), K2 = L(-6.7, 15.7), KM = L(-9.0, -2.4) // the knees and the frame's middle at 35 m
const F1 = L(-31.7, -27.4), F2 = L(-28.7, 30.9) // the outer feet
const H = 274.5, KZ = 35, JZ = 131, CAB0 = 137, CAB1 = 155, MAST1 = 259

type Parts = { red: Part; white: Part; cabin: Part; win: Part }

/** An open tube from a to b, radius r, n sides, smooth. */
function tube(p: Part, a: V3, b: V3, r: number, n: number, r1 = r) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(...d)
  const u: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  let e1: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const m = Math.hypot(...e1); e1 = [e1[0] / m, e1[1] / m, e1[2] / m]
  const e2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
  const N = (t: number): V3 => [e1[0] * Math.cos(t) + e2[0] * Math.sin(t), e1[1] * Math.cos(t) + e2[1] * Math.sin(t), e1[2] * Math.cos(t) + e2[2] * Math.sin(t)]
  const P = (c: V3, rr: number, t: number): V3 => { const n = N(t); return [c[0] + n[0] * rr, c[1] + n[1] * rr, c[2] + n[2] * rr] }
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * TAU, t1 = ((i + 1) / n) * TAU
    p.tri(P(a, r, t0), P(a, r, t1), P(b, r1, t1), undefined, undefined, undefined, [N(t0), N(t1), N(t1)])
    p.tri(P(a, r, t0), P(b, r1, t1), P(b, r1, t0), undefined, undefined, undefined, [N(t0), N(t1), N(t0)])
  }
}
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** A banded tube: alternating red and white bands about `band` metres long, starting red at the bottom. */
function banded(P: Parts, a: V3, b: V3, r: number, n: number, band: number, startRed = true, r1 = r) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  const k = Math.max(1, Math.round(l / band))
  for (let i = 0; i < k; i++) {
    const red = (i % 2 === 0) === startRed
    tube(red ? P.red : P.white, lerp3(a, b, i / k), lerp3(a, b, (i + 1) / k), r + (r1 - r) * (i / k), n, r + (r1 - r) * ((i + 1) / k))
  }
}

/** A square bar from a to b (four sides, no ends): lattice members. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(...d)
  const u: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  let s: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const m = Math.hypot(...s); s = [s[0] / m * w / 2, s[1] / m * w / 2, s[2] / m * w / 2]
  const t: V3 = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]]
  const C = (o: V3, i: number): V3 => { const [x, y] = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i]; return [o[0] + s[0] * x + t[0] * y, o[1] + s[1] * x + t[1] * y, o[2] + s[2] * x + t[2] * y] }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const out: V3 = [(C(a, i)[0] + C(a, j)[0]) / 2 - a[0], (C(a, i)[1] + C(a, j)[1]) / 2 - a[1], (C(a, i)[2] + C(a, j)[2]) / 2 - a[2]]
    quadOut(p, C(a, i), C(a, j), C(b, j), C(b, i), out)
  }
}

/** A closed box with chamfer-free corners. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)]); p.cap(r(z1), true); p.cap(r(z0), false)
}

/** A lathe about (cx, cy): profile [r, z] bottom to top, smooth, capped top and bottom when r > 0. */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    const nr = dz / l, nz = -dr / l
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * TAU, t1 = ((i + 1) / n) * TAU
      const A = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const Nn = (t: number): V3 => [nr * Math.cos(t), nr * Math.sin(t), nz]
      if (r0 > 1e-4) p.tri(A(r0, z0, t0), A(r0, z0, t1), A(r1, z1, t1), undefined, undefined, undefined, [Nn(t0), Nn(t1), Nn(t1)])
      if (r1 > 1e-4) p.tri(A(r0, z0, t0), A(r1, z1, t1), A(r1, z1, t0), undefined, undefined, undefined, [Nn(t0), Nn(t1), Nn(t0)])
    }
  }
}

export function build(detail: boolean) {
  const P: Parts = { red: new Part(), white: new Part(), cabin: new Part(), win: new Part() }
  const NT = detail ? 12 : 8 // tube sides
  const s0: V3 = [S[0], S[1], 0]
  // ---- the shaft: a 5 m tube to the cabin, banded ----
  banded(P, s0, [S[0], S[1], CAB0 - 6], 2.5, detail ? 16 : 10, 16.5)
  // ---- the legs: knee to the shaft under the cabin, and the forked feet ----
  const J: V3 = [S[0], S[1], JZ]
  for (const [K, F] of [[K1, F1], [K2, F2]] as [[number, number], [number, number]][]) {
    const k: V3 = [K[0], K[1], KZ]
    // the leg leans in from the knee to the shaft, stopping at its skin
    const toS = [S[0] - K[0], S[1] - K[1]], dl = Math.hypot(toS[0], toS[1])
    const jEnd: V3 = [S[0] - (toS[0] / dl) * 2.3, S[1] - (toS[1] / dl) * 2.3, JZ]
    banded(P, k, jEnd, 1.6, NT, 16, false, 1.3)
    // the outer foot and the inner foot under the frame
    banded(P, [F[0], F[1], 0], k, 1.5, NT, 13, true, 1.6)
    const inner: V3 = [K[0] + (KM[0] - K[0]) * 0.25, K[1] + (KM[1] - K[1]) * 0.25, 0]
    banded(P, inner, k, 1.3, NT, 13, true, 1.5)
    // a knee joint
    lathe(P.red, K[0], K[1], [[0, KZ - 2], [1.9, KZ - 1], [1.9, KZ + 1], [0, KZ + 2]], NT)
  }
  // ---- the frame at 35 m: knee to middle to knee, and the middle to the shaft ----
  const W = detail ? 0.9 : 1.1
  const k1: V3 = [K1[0], K1[1], KZ], k2: V3 = [K2[0], K2[1], KZ], km: V3 = [KM[0], KM[1], KZ], sk: V3 = [S[0], S[1], KZ]
  for (const [a, b] of [[k1, km], [km, k2], [km, sk], [k1, sk], [k2, sk]] as [V3, V3][]) bar(P.white, a, b, W * 1.4)
  // a lower ring frame near 10 m between the feet, as in the night photo
  const lowZ = 10
  const at = (F: [number, number], K: [number, number], z: number): V3 => { const t = z / KZ; return [F[0] + (K[0] - F[0]) * t, F[1] + (K[1] - F[1]) * t, z] }
  bar(P.red, at(F1, K1, lowZ), at(F2, K2, lowZ), W)
  // ---- struts from the legs to the shaft higher up, with ring platforms on the shaft ----
  const legAt = (K: [number, number], z: number): V3 => { const t = (z - KZ) / (JZ - KZ); return [K[0] + (S[0] - K[0]) * t, K[1] + (S[1] - K[1]) * t, z] }
  for (const z of [62, 88, 110]) {
    for (const K of [K1, K2]) bar(P.white, legAt(K, z), [S[0], S[1], z], W)
    bar(P.white, legAt(K1, z), legAt(K2, z), W)
    lathe(P.red, S[0], S[1], [[2.4, z - 0.6], [4.2, z - 0.3], [4.2, z + 0.5], [2.4, z + 0.6]], detail ? 16 : 10)
  }
  // bracing: diagonals in the leg planes, and (detail) rods from the knees to the shaft
  for (const [za, zb] of [[KZ, 62], [62, 88], [88, 110]]) {
    bar(P.white, legAt(K1, za), legAt(K2, zb), W * 0.7)
    bar(P.white, legAt(K2, za), legAt(K1, zb), W * 0.7)
    if (detail) for (const K of [K1, K2]) {
      bar(P.white, legAt(K, za), [S[0], S[1], zb], 0.35)
      bar(P.white, [S[0], S[1], za], legAt(K, zb), 0.35)
    }
  }
  // ---- the box platform between the legs and the shaft, 41-52 m ----
  {
    const x0 = Math.min(legAt(K1, 44)[0], legAt(K2, 44)[0]) - 1.5, x1 = S[0] + 4
    const y0 = S[1] - 9, y1 = S[1] + 7
    box(P.red, x0, y0, x1, y1, 41, 44.5) // its red underside band
    box(P.white, x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, 44.5, 52)
    // the window band of its equipment rooms
    for (const [a, b, n] of [[[x0, y0], [x1, y0], [0, -1, 0]], [[x1, y0], [x1, y1], [1, 0, 0]], [[x1, y1], [x0, y1], [0, 1, 0]], [[x0, y1], [x0, y0], [-1, 0, 0]]] as [[number, number], [number, number], V3][]) {
      const o = 0.25
      const A: V3 = [a[0] + n[0] * o, a[1] + n[1] * o, 47.5], B: V3 = [b[0] + n[0] * o, b[1] + n[1] * o, 47.5]
      const shrink = (p: V3, q: V3): V3 => [p[0] + (q[0] - p[0]) * 0.04, p[1] + (q[1] - p[1]) * 0.04, p[2]]
      const a2 = shrink(A, B), b2 = shrink(B, A)
      quadOut(P.win, a2, b2, [b2[0], b2[1], 50], [a2[0], a2[1], 50], n)
    }
  }
  // ---- the cabin, 137-155 m ----
  const nc = detail ? 28 : 16
  lathe(P.cabin, S[0], S[1], [[2.5, CAB0 - 6], [6, CAB0 - 2.5], [9.0, CAB0], [9.6, CAB0 + 1.5], [9.6, CAB0 + 4]], nc)
  lathe(P.win, S[0], S[1], [[9.65, CAB0 + 4], [9.65, CAB0 + 8.5]], nc) // the glazed band
  lathe(P.cabin, S[0], S[1], [[9.6, CAB0 + 8.5], [9.6, CAB0 + 10], [9.9, CAB0 + 10.4], [9.9, CAB0 + 12], [9.6, CAB0 + 12.4]], nc)
  lathe(P.win, S[0], S[1], [[9.65, CAB0 + 12.4], [9.65, CAB0 + 15]], nc) // the upper glazed band
  lathe(P.red, S[0], S[1], [[9.6, CAB0 + 15], [9.6, CAB1 - 1.2], [7, CAB1], [4.8, CAB1], [0, CAB1 + 0.01]], nc)
  // ---- the lattice mast: four chords, X-braced panels, banded ----
  const mz0 = CAB1, mz1 = MAST1
  const hw = (z: number) => 2.8 + (0.6 - 2.8) * ((z - mz0) / (mz1 - mz0))
  const panels = detail ? 18 : 12
  const corner = (z: number, c: number): V3 => { const w = hw(z), sx = c === 0 || c === 3 ? 1 : -1, sy = c < 2 ? 1 : -1; return [S[0] + sx * w, S[1] + sy * w, z] }
  for (let i = 0; i < panels; i++) {
    const za = mz0 + ((mz1 - mz0) * i) / panels, zb = mz0 + ((mz1 - mz0) * (i + 1)) / panels
    const p = Math.floor((i * 7) / panels) % 2 === 0 ? P.red : P.white
    const cw = detail ? 0.45 : 0.6
    for (let c = 0; c < 4; c++) {
      const d = (c + 1) % 4
      bar(p, corner(za, c), corner(zb, c), cw)
      bar(p, corner(zb, c), corner(zb, d), cw * 0.6)
      bar(p, corner(za, c), corner(zb, d), cw * 0.5)
      if (detail) bar(p, corner(za, d), corner(zb, c), cw * 0.5)
    }
    // a small gallery round the mast every third panel
    if (i % 4 === 3) lathe(P.white, S[0], S[1], [[0.3, zb - 0.3], [hw(zb) + 1.4, zb - 0.2], [hw(zb) + 1.4, zb + 0.2], [0.3, zb + 0.3]], 8)
  }
  // the top pole, banded
  banded(P, [S[0], S[1], mz1], [S[0], S[1], H], 0.55, 8, 4, true, 0.25)
  // the inclined feet's tubes dip a little below the ground: cut them off flat at y = 0
  for (const p of Object.values(P)) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] < 0) p.pos[i] = 0
  return P
}

export const COLORS = {
  red: 0xc0503f, // the red paint, pulled a touch light; lit magenta-pink at night
  white: 0xe6e2da, // the white paint
  cabin: 0xe9e6df,
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.red, material: finish('neon-tv-tower-red', COLORS.red, 0.6) },
      { part: p.white, material: { ...finish('tv-tower-white', COLORS.white, 0.6), floodlight: () => 0.8 } },
      { part: p.cabin, material: { ...finish('tv-tower-cabin', COLORS.cabin, 0.6), floodlight: () => 0.9 } },
      { part: p.win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    ]
  }
  const meta = { bearing: 0, osm: 'way/437940450', height: H }
  await writeModel('tbilisi-tv-tower.glb', 'Tbilisi TV Broadcasting Tower', make(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-tv-tower.detail.glb', 'Tbilisi TV Broadcasting Tower', make(true), meta, 40000, 1536 * 1024)
}
