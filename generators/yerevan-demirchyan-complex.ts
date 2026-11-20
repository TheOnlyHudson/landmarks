/**
 * Karen Demirchyan Sports and Concerts Complex (Կարեն Դեմիրճյանի անվան
 * մարզահամերգային համալիր, "Hamalir"), Tsitsernakaberd hill, Yerevan:
 * procedural, CC0-1.0, no textures.
 *   bun generators/yerevan-demirchyan-complex.ts
 *
 * Opened 1983 (architects A. Tarkhanian, S. Khachikyan, G. Pogosyan,
 * G. Mushegyan), rebuilt after the 1985 fire and renovated 2005-08.
 *
 * Frame: x across, y along the axis towards the back, z up, metres.
 * Bearing 115: the model's +y (the back, the dark "head") points to compass
 * 115, the main front with the relief and the long cascade of stairs to
 * 295 (west-north-west, down to the Hrazdan gorge). Origin at the crossing
 * of the red beams, OSM-local (-11.4, 11.6) m from 44.4833297, 40.1881503:
 * anchor 44.483196, 40.188255.
 *
 * Identity: a bird with spread wings seen from above. Four grey shell
 * roofs meet at a central deck: a front shell whose white edge is a broad
 * arch over the glass "eye" and the copper relief, two great lens-shaped
 * side shells ("wings") whose white edges arch over glass walls with
 * ribs, and a back shell climbing to the dark pointed helmet dome with its
 * glazed lift shaft. Two pairs of broad red beams run from the central deck
 * down to the ground at the four corners, the front pair meeting in a
 * pointed arch, the back pair in a U, so the plan reads as an X. Red
 * stepped terraces round the back.
 *
 * Evidence
 * - OSM (ODbL): way/33169374 (building, the whole complex with its side
 *   aprons, its four corners at the red beams' feet: compass 270/326 at
 *   the front, 80/145 at the back, 112-118 m out), the cascade's stairs
 *   way/49601643, way/49601644 and pools way/1290190039, way/1290190040
 *   (the axis, compass 295 to the front).
 * - Published: Wikipedia "Karen Demirchyan Complex" (dates, architects,
 *   the two halls, the 184 stairs). No published dimensions found.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Karen Demirchyan Sports and Concerts Complex top down view from
 *     drone 2019.jpg", Aleksey Chalabyan (Xelgen), CC BY-SA 4.0: the plan,
 *     scaled to the OSM corners (0.175 m per px of the 1280 px crop): the
 *     beams, the shells, the dome, the red pyramids and terraces; colours
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Sports_and_Concerts_Complex_top_down_view_from_drone_2019.jpg
 *   - "Karen Demirchyan Sports and Concerts Complex from air, September
 *     2017.jpg", same author, CC BY-SA 4.0: a side, the wing's arch over
 *     its glass wall and ribs
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Sports_and_Concerts_Complex_from_air,_September_2017.jpg
 *   - "Karen Demirchyan Sports and Concerts Complex shot from air, May
 *     2019.jpg", same author, CC BY-SA 4.0: the front and the cascade
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Sports_and_Concerts_Complex_shot_from_air,_May_2019.jpg
 *   - "Karen Demirchyan Complex 03.jpg" and "... 04.jpg", Violmsyan, CC
 *     BY-SA 4.0: the front face on, with people
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Complex_03.jpg
 *   - "Karen Demirchyan Sports and Concerts Complex 01.jpg" and "... 05.jpg",
 *     Մարի Ավետիսյան, CC BY-SA 4.0: the back (the helmet dome, the lift
 *     shaft, the red terraces) and a wing from the side
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Sports_and_Concerts_Complex_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Sports_and_Concerts_Complex_05.jpg
 *   - "Karen Demirchyan Complex 01.jpg", Violmsyan, CC BY-SA 4.0: the side
 *     silhouette, low
 *     https://commons.wikimedia.org/wiki/File:Karen_Demirchyan_Complex_01.jpg
 *
 * Numbers: plan measured from the drone photo scaled to OSM. Heights
 * estimated: front arch 22.5 m (people in Violmsyan's photo give 12-15 m at
 * the facade plane; the drone photo shows the arch's crown nearly level
 * with the beams' meeting), the central deck 24.6 m, the wings' arches
 * 22 m, the helmet 46 m (its width against its height in the back photo,
 * about 1:0.47 over its gold band), the red terraces 10.5 m. The z12
 * terrain shows the building as a 27 m bump, which agrees in order.
 * Colours sampled: shells #99968f .. #9b9997 in the hazy front photo,
 * read light silvery grey and drawn #b4babd; the helmet #898c8c (sun) ..
 * #5e6263 (shade), drawn mid-grey #878b8d; red #b9686b (sun) .. #775d56 (shade), the relief #6d4b35, the
 * white concrete #b3a7a1 (overcast), glass #476177.
 *
 * Doubts: heights are photo estimates, no drawing or published figure; the
 * shells are drawn as smooth patches between their measured edges, their
 * exact curvature is guessed; the side aprons and the cascade are ground
 * and left to the map; the podium under the plaza is not modelled.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { lathe } from './sf-de-young'
import { quadOut, triOut } from './moscow-church-kit'
import { writeModel } from './tbilisi-holy-trinity-cathedral'

type F = (s: number) => V3
const L = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
/** A polyline through points, as a function of s in 0..1 (by length), Catmull-Rom smoothed. */
function curve(pts: V3[]): F {
  const seg: number[] = [0]
  for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(...sub(pts[i], pts[i - 1])))
  const T = seg[seg.length - 1]
  return (s: number) => {
    const d = Math.max(0, Math.min(1, s)) * T
    let i = 0
    while (i < pts.length - 2 && seg[i + 1] < d) i++
    const t = (d - seg[i]) / (seg[i + 1] - seg[i] || 1)
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const t2 = t * t, t3 = t2 * t
    return [0, 1, 2].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)) as V3
  }
}
/**
 * A Coons patch between four edges: a(u) at v=0, b(u) at v=1, c(v) at
 * u=0, d(v) at u=1 (corners shared), plus an optional lift(u, v) in z.
 * Smooth-shaded, wound to face `up` (a rough outward direction).
 */
function patch(p: Part, a: F, b: F, c: F, d: F, nu: number, nv: number, up: (q: V3) => V3, lift: (u: number, v: number) => number = () => 0, both = false) {
  const P = (u: number, v: number): V3 => {
    const A = a(u), B = b(u), C = c(v), D = d(v)
    const a0 = a(0), a1 = a(1), b0 = b(0), b1 = b(1)
    return [0, 1, 2].map((k) => (1 - v) * A[k] + v * B[k] + (1 - u) * C[k] + u * D[k]
      - ((1 - u) * (1 - v) * a0[k] + u * (1 - v) * a1[k] + (1 - u) * v * b0[k] + u * v * b1[k]) + (k === 2 ? lift(u, v) : 0)) as V3
  }
  const e = 1e-3
  const N = (u: number, v: number): V3 => {
    const q = P(u, v)
    const du = sub(P(Math.min(1, u + e), v), P(Math.max(0, u - e), v)), dv = sub(P(u, Math.min(1, v + e)), P(u, Math.max(0, v - e)))
    let n = unit(crossV(du, dv))
    if (!isFinite(n[0]) || Math.hypot(...n) < 0.5) n = up(q)
    const o = up(q)
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] < 0) n = [-n[0], -n[1], -n[2]]
    return n
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const u0 = i / nu, u1 = (i + 1) / nu, v0 = j / nv, v1 = (j + 1) / nv
    const q = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], n = [N(u0, v0), N(u1, v0), N(u1, v1), N(u0, v1)]
    p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n[0], n[1], n[2]])
    p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n[0], n[2], n[3]])
    if (both) {
      const m = n.map((x) => [-x[0], -x[1], -x[2]] as V3)
      p.tri(q[0], q[2], q[1], undefined, undefined, undefined, [m[0], m[2], m[1]])
      p.tri(q[0], q[3], q[2], undefined, undefined, undefined, [m[0], m[3], m[2]])
    }
  }
}
/** A straight box between two points: w across (horizontal), h thick (down from the line). */
function beamBox(p: Part, a: V3, b: V3, w: number, h: number, ends = true) {
  const t = unit(sub(b, a)), s = unit(crossV(t, [0, 0, 1])), n = crossV(s, t)
  const C = (o: V3, cs: number, cn: number): V3 => [o[0] + s[0] * cs + n[0] * cn, o[1] + s[1] * cs + n[1] * cn, o[2] + s[2] * cs + n[2] * cn]
  const A = [C(a, -w / 2, -h), C(a, w / 2, -h), C(a, w / 2, 0), C(a, -w / 2, 0)]
  const B = [C(b, -w / 2, -h), C(b, w / 2, -h), C(b, w / 2, 0), C(b, -w / 2, 0)]
  const outs: V3[] = [[-n[0], -n[1], -n[2]], s, n, [-s[0], -s[1], -s[2]]]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quadOut(p, A[i], A[j], B[j], B[i], outs[i]) }
  if (ends) { quadOut(p, A[0], A[1], A[2], A[3], [-t[0], -t[1], -t[2]]); quadOut(p, B[0], B[1], B[2], B[3], t) }
}
/** A beam swept along a polyline as one continuous body: w across, h down from the line, capped. */
function beamPath(p: Part, pts: V3[], w: number, h: number) {
  const secs = pts.map((q, i) => {
    const t = unit(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]))
    const s = unit(crossV(t, [0, 0, 1])), n = crossV(s, t)
    const C = (cs: number, cn: number): V3 => [q[0] + s[0] * cs + n[0] * cn, q[1] + s[1] * cs + n[1] * cn, q[2] + s[2] * cs + n[2] * cn]
    return { r: [C(-w / 2, -h), C(w / 2, -h), C(w / 2, 0), C(-w / 2, 0)], s, n, t }
  })
  for (let i = 0; i < secs.length - 1; i++) {
    const A = secs[i].r, B = secs[i + 1].r, s = secs[i].s, n = secs[i].n
    const outs: V3[] = [[-n[0], -n[1], -n[2]], s, n, [-s[0], -s[1], -s[2]]]
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; quadOut(p, A[k], A[j], B[j], B[k], outs[k]) }
  }
  const f = secs[0], l = secs[secs.length - 1]
  quadOut(p, f.r[0], f.r[1], f.r[2], f.r[3], [-f.t[0], -f.t[1], -f.t[2]])
  quadOut(p, l.r[0], l.r[1], l.r[2], l.r[3], l.t)
}
const mx = (q: V3): V3 => [-q[0], q[1], q[2]]

export function build() {
  const shell = new Part(), red = new Part(), white = new Part(), glass = new Part(), relief = new Part(), dome = new Part()
  const UPF = (_q: V3): V3 => [0, 0, 1]

  // ---- The red beams (centre lines on top of the shells) ---------------
  // the beams arch up steeply from their feet (photo from the front) and run nearly level near the deck
  const FB: V3[] = [[-64, -83, 0], [-55, -69, 11], [-44, -52, 18], [-31, -33, 22.5], [-15, -19.5, 25.4], [-4.5, -14.5, 26.4], [0, -13.5, 26.6]]
  const BB: V3[] = [[-71, 108, 0], [-60, 94, 11], [-46, 76, 17.5], [-30, 56, 22], [-17, 40, 24.8], [-7, 28.5, 26.3], [0, 26.5, 26.6]]
  const smoothPath = (pts: V3[], n: number) => { const f = curve(pts); return Array.from({ length: n + 1 }, (_, k) => f(k / n)) }
  for (const side of [1, -1]) {
    const f = side < 0 ? (q: V3) => mx(q) : (q: V3) => q
    beamPath(red, smoothPath(FB, 9).map(f).map((q) => [q[0], q[1], Math.max(q[2] + 2.6, 4.2)] as V3), 6.5, 4.2)
    beamPath(red, smoothPath(BB, 8).map(f).map((q) => [q[0], q[1], Math.max(q[2] + 2.6, 4.2)] as V3), 6.5, 4.2)
  }
  // the central deck where the four shells meet
  {
    const z = 27.0
    const deck: Array<[number, number]> = [[0, -13], [6, -4], [9, 7.5], [6, 19], [0, 27], [-6, 19], [-9, 7.5], [-6, -4]]
    const top = deck.map(([x, y]) => [x, y, z] as V3), bot = deck.map(([x, y]) => [x, y, z - 2.2] as V3)
    for (let i = 1; i < deck.length - 1; i++) triOut(red, top[0], top[i], top[i + 1], [0, 0, 1])
    for (let i = 0; i < deck.length; i++) { const j = (i + 1) % deck.length; const c = deck[i], d = deck[j]; quadOut(red, bot[i], bot[j], top[j], top[i], [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2 - 7.5, 0]) }
  }

  // ---- The front shell and facade -----------------------------------
  const YF = -64.5 // the front arch edge
  const archZ = (x: number, half: number, z0: number, z1: number) => z0 + (z1 - z0) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / half, 2)), 0.55)
  const FH = 50 // the arch's half span where it meets the beams
  const frontEdge: F = (u) => { const x = -FH + 2 * FH * u; return [x, YF, archZ(x, FH, 8, 22.5)] }
  const fTop: F = (u) => [-1 + 2 * u, -13.8, 25.8]
  const fside = (sd: number): F => curve([[sd * FH, YF, 8], [sd * 33.5, -37, 20.5], [sd * 13.5, -19.5, 24.6], [sd * 1, -13.8, 25.8]])
  patch(shell, frontEdge, fTop, fside(-1), fside(1), 12, 8, UPF, (u, v) => 4.0 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v))
  // the white fascia along the arch edge
  for (let i = 0; i < 24; i++) {
    const a = frontEdge(i / 24), b = frontEdge((i + 1) / 24)
    quadOut(white, [a[0], a[1] - 0.2, a[2] - 2.2], [b[0], b[1] - 0.2, b[2] - 2.2], [b[0], b[1] - 0.2, b[2] + 0.35], [a[0], a[1] - 0.2, a[2] + 0.35], [0, -1, 0])
    quadOut(white, [a[0], a[1] - 0.2, a[2] - 2.2], [b[0], b[1] - 0.2, b[2] - 2.2], [b[0], b[1] + 3, b[2] - 2.2], [a[0], a[1] + 3, a[2] - 2.2], [0, 0, -1])
  }
  // the facade wall set 3 m back under the arch: glass eye, white band, relief, colonnade
  {
    const y = YF + 3, W = 44
    const zTop = (x: number) => archZ(x, FH, 8, 22.5) - 1.6
    const n: V3 = [0, -1, 0]
    const strip = (p: Part, x0: number, x1: number, z0: number, z1: (x: number) => number, dy: number, steps = 10) => {
      for (let i = 0; i < steps; i++) {
        const a = x0 + ((x1 - x0) * i) / steps, b = x0 + ((x1 - x0) * (i + 1)) / steps
        const za = Math.max(z0, z1(a)), zb = Math.max(z0, z1(b))
        quadOut(p, [a, y + dy, z0], [b, y + dy, z0], [b, y + dy, zb], [a, y + dy, za], n)
      }
    }
    strip(white, -W, W, 0, zTop, 0, 16)
    strip(glass, -26, 26, 13.4, (x) => zTop(x) - 0.3, -0.06, 10) // the glass eye
    // the relief band, standing proud and a little bowed
    const rb = (x: number) => -1.8 + 0.9 * (x / 40) ** 2
    for (let i = 0; i < 12; i++) {
      const a = -40 + (80 / 12) * i, b = a + 80 / 12
      quadOut(relief, [a, y + rb(a), 6.1], [b, y + rb(b), 6.1], [b, y + rb(b), 12.4], [a, y + rb(a), 12.4], n)
      quadOut(relief, [a, y + rb(a), 12.4], [b, y + rb(b), 12.4], [b, y, 12.4], [a, y, 12.4], [0, 0, 1])
      quadOut(relief, [a, y + rb(a), 6.1], [b, y + rb(b), 6.1], [b, y, 6.1], [a, y, 6.1], [0, 0, -1])
    }
    for (const sx of [-1, 1]) quadOut(relief, [sx * 40, y + rb(40), 6.1], [sx * 40, y, 6.1], [sx * 40, y, 12.4], [sx * 40, y + rb(40), 12.4], [sx, 0, 0])
    // the white floor band over the colonnade, and the glazed foyer behind the columns
    beamBox(white, [-W, y - 1.2, 6.0], [W, y - 1.2, 6.0], 2.4, 2.2)
    strip(glass, -30, 30, 0.2, () => 3.4, -0.06, 2)
    for (let i = 0; i < 8; i++) {
      const x = -26 + (52 * i) / 7
      beamBox(white, [x, y - 1.6, 0], [x, y - 1.6, 3.8], 1.4, 1.4)
    }
  }
  // the lotus finial on the front shell's crown
  lathe(dome, [[0.6, 25.8], [2.6, 26.4], [2.9, 27.2], [1.6, 28.0], [1.9, 28.8], [0.9, 29.6], [0.02, 30.0]], 10, [0, -17], 0, false)

  // ---- The helmet: the back hall's pointed dome ----------------------
  // Its base a teardrop from the beams' U at the front (y 26) to the red
  // terraces at the back (y 112), +-42 across; the apex at 40 m.
  const HC = 69, HRX = 42, HRY = 43, HAP: V3 = [0, 64, 46]
  const zb = (th: number) => { const s = Math.sin(th); return 13 - 3 * Math.max(0, s) + 13 * Math.max(0, -s) ** 2 }
  // a teardrop in plan: narrow towards the beams' U at the front, full at the back
  const hb = (th: number): V3 => [HRX * Math.cos(th) * (1 - 0.55 * Math.max(0, -Math.sin(th))), HC + HRY * Math.sin(th), zb(th)]
  const helm = (th: number, t: number): V3 => {
    const b = hb(th), f = 0.84 * Math.pow(Math.sin((t * Math.PI) / 2), 0.75) + 0.16 * t, g = Math.pow(t, 1.6) // steep bulging flanks to a pointed crown
    return [b[0] + (HAP[0] - b[0]) * g, b[1] + (HAP[1] - b[1]) * g, b[2] + (HAP[2] - b[2]) * f]
  }
  {
    const NT = 9, NB = 28
    const out = (q: V3): V3 => unit([q[0], q[1] - HC, 1.2])
    // drawn in two halves so the seam runs down the shaft at the back
    for (const [a0, a1] of [[Math.PI / 2, Math.PI * 1.5], [-Math.PI / 2, Math.PI / 2]]) {
      const th = (u: number) => a0 + (a1 - a0) * u
      patch(dome, (u) => helm(th(u), 0), (u) => helm(th(u), 0.999), (v) => helm(a0, v), (v) => helm(a1, v), NB / 2, NT, out)
    }
    // the glazed lift shaft up the helmet's back, in its gold-white frame
    const sp = Array.from({ length: 7 }, (_, k) => helm(Math.PI / 2, (0.93 * k) / 6))
    beamPath(white, sp.map((q) => [q[0], q[1] + 1.0, q[2] + 0.9] as V3), 5.2, 2.2)
    beamPath(glass, sp.map((q) => [q[0], q[1] + 1.25, q[2] + 1.2] as V3), 3.2, 0.5)
    // the gold-white band round the helmet's foot
    for (let k = 0; k < 28; k++) {
      const a = helm((Math.PI * 2 * k) / 28, 0.06), b = helm((Math.PI * 2 * (k + 1)) / 28, 0.06)
      const o: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - HC, 0]
      quadOut(white, [a[0] * 1.02, HC + (a[1] - HC) * 1.02, a[2] - 1.1], [b[0] * 1.02, HC + (b[1] - HC) * 1.02, b[2] - 1.1], [b[0] * 1.02, HC + (b[1] - HC) * 1.02, b[2] + 0.4], [a[0] * 1.02, HC + (a[1] - HC) * 1.02, a[2] + 0.4], o)
    }
    // the band of round dormers under the helmet's crown: a white ring
    for (const sd of [-1, 1]) {
      for (let k = 0; k < 6; k++) {
        const q = helm(Math.PI / 2 + sd * (0.18 + k * 0.1), 0.62)
        beamBox(white, [q[0], q[1], q[2] - 0.6], [q[0] + sd * 0.01, q[1] + 0.01, q[2] + 1.2], 1.6, 1.6)
      }
    }
  }
  // the red stepped terraces round the back
  {
    const ring = (sc: number, n = 14): Array<[number, number]> => Array.from({ length: n + 1 }, (_, k) => {
      const a = (Math.PI * k) / n
      return [54 * sc * Math.cos(a), 78 + 48 * sc * Math.sin(a)]
    })
    const steps: Array<[number, number, number]> = [[1.0, 0, 3.6], [0.92, 3.6, 7.2], [0.84, 7.2, 10.5]]
    for (const [sc, z0, z1] of steps) {
      const r = ring(sc)
      for (let i = 0; i < r.length - 1; i++) {
        const a = r[i], b = r[i + 1]
        const n2: V3 = [(a[0] + b[0]) / 2, ((a[1] + b[1]) / 2 - 78) * 1.2, 0]
        quadOut(red, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n2)
        const o = (q: [number, number], k: number): [number, number] => [q[0] * k, 78 + (q[1] - 78) * k]
        const A = o(a, 1.004), B = o(b, 1.004)
        quadOut(glass, [A[0], A[1], z0 + 0.9], [B[0], B[1], z0 + 0.9], [B[0], B[1], z0 + 2.3], [A[0], A[1], z0 + 2.3], n2)
        quadOut(white, [a[0], a[1], z1], [b[0], b[1], z1], [0, 78, z1], [0, 78, z1], [0, 0, 1])
      }
      quadOut(red, [-54 * sc, 78, z0], [54 * sc, 78, z0], [54 * sc, 78, z1], [-54 * sc, 78, z1], [0, -1, 0])
    }
  }
  // the two red-roofed lift towers standing out of the helmet's flanks
  for (const sx of [-1, 1]) {
    const cx = sx * 25, cy = 63, h = 5.6, z0 = 20, z1 = 30
    const r: Array<[number, number]> = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], o: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
      quadOut(white, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], o)
      const g = (q: [number, number]): V3 => [q[0] + Math.sign(q[0] - cx) * 0.7, q[1] + Math.sign(q[1] - cy) * 0.7, z1]
      triOut(red, g(a), g(b), [cx, cy, z1 + 4], [o[0], o[1], 3])
    }
  }

  // ---- The wings: two lens-shaped shells arching over glass walls ------
  for (const sd of [1, -1]) {
    const E: F = (s) => { const x = sd * (43 + 29 * Math.sin(Math.PI * s)); return [x, 56 - 98 * s, 6 + 24 * Math.pow(Math.sin(Math.PI * s), 0.7)] }
    const I = curve([[sd * 30, 54, 19.5], [sd * 13, 30, 24.6], [sd * 8.6, 7.5, 26.2], [sd * 13, -16, 24.6], [sd * 33, -40, 20.5]])
    const A: F = (v) => L(E(0), I(0), v), B: F = (v) => L(E(1), I(1), v)
    // a dish: the wing's rim stands higher than its middle, as the photos from the front and back show
    patch(shell, E, I, A, B, 14, 8, UPF, (u, v) => -2.5 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v))
    // under the arching edge: a soffit back to the glass wall, ribs, and a white plinth
    const G = (s: number): V3 => { const e = E(s), d = 7 * Math.sin(Math.PI * s); return [e[0] - sd * d, e[1], e[2] - 2.4] }
    const NS = 20
    for (let i = 0; i < NS; i++) {
      const s0 = i / NS, s1 = (i + 1) / NS
      const e0 = E(s0), e1 = E(s1), g0 = G(s0), g1 = G(s1)
      const nOut: V3 = [sd, 0, 0]
      quadOut(white, [e0[0], e0[1], e0[2] - 2.2], [e1[0], e1[1], e1[2] - 2.2], [e1[0], e1[1], e1[2] + 0.35], [e0[0], e0[1], e0[2] + 0.35], nOut) // fascia
      quadOut(white, [e0[0], e0[1], e0[2] - 2.2], [e1[0], e1[1], e1[2] - 2.2], g1, g0, [0, 0, -1]) // soffit
      const zg = (g: V3) => Math.max(0, g[2])
      const glassFrom = 3.2
      if (zg(g0) > glassFrom + 0.5 && zg(g1) > glassFrom + 0.5) {
        quadOut(white, [g0[0], g0[1], 0], [g1[0], g1[1], 0], [g1[0], g1[1], glassFrom], [g0[0], g0[1], glassFrom], nOut)
        quadOut(glass, [g0[0], g0[1], glassFrom], [g1[0], g1[1], glassFrom], g1, g0, nOut)
      } else quadOut(white, [g0[0], g0[1], 0], [g1[0], g1[1], 0], [g1[0], g1[1], Math.max(0.1, g1[2])], [g0[0], g0[1], Math.max(0.1, g0[2])], nOut)
    }
    // ribs from the glass head out to the fascia
    for (let k = 1; k <= 7; k++) {
      const s = k / 8, e = E(s), g = G(s)
      beamBox(white, [g[0], g[1], g[2] - 0.6], [e[0] - sd * 0.3, e[1], e[2] - 1.3], 0.9, 1.2)
    }
  }
  return { shell, red, white, glass, relief, dome }
}

if (import.meta.main) {
  const p = build()
  const parts = [
    { part: p.shell, material: finish('hamalir-shell', 0xb4babd, 0.6) },
    { part: p.red, material: { ...finish('hamalir-red', 0xb0645a), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.6) } },
    { part: p.white, material: { ...finish('hamalir-concrete', 0xddd6ca), floodlight: (_q: V3, n: V3) => (n[2] < -0.5 ? 0.9 : 0.5) } },
    { part: p.glass, material: windowVariant(2, 0x5f7f99) },
    { part: p.relief, material: finish('hamalir-relief', 0x9a6a48) },
    { part: p.dome, material: finish('hamalir-helmet', 0x878b8d, 0.6) },
  ]
  await writeModel('yerevan-demirchyan-complex.glb', 'Karen Demirchyan Sports and Concerts Complex', parts, { bearing: 115, osm: 'way/33169374', height: 46.7 }, 6500, 250 * 1024)
}
