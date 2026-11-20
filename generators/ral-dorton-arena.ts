/**
 * J. S. Dorton Arena, North Carolina State Fairgrounds, Raleigh (Maciej
 * Nowicki with William Henley Dietrick, 1952): procedural, CC0-1.0.
 * bun generators/ral-dorton-arena.ts [out.glb]
 *
 * The "paraboleum": two parabolic concrete arches, each lying in a plane
 * tilted outward, cross a little above the ground at the north-east and
 * south-west ends and run on past each other as legs into the ground. A
 * saddle-shaped cable-net roof hangs between them, and vertical piers with
 * glass between carry each arch down to the ground.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 64.1, the line
 * through the two arch crossings (OSM tips); +y is the north-east crossing
 * (the NRHP's "north end"), +x the south-east side.
 * Origin: on that axis midway between the tips (-78.710371, 35.793988),
 * 1.7 m south-east of the OSM centroid so both arches are symmetric about it.
 * y = 0 is the ground; Mapterhorn (z13) varies under 1 m across the
 * footprint (1.0–2.0 m above the lowest cell, rising to the south-east).
 * Elevation 0.
 *
 * The arches, in their own tilted plane: s = S(1 − y²/a²) from the line
 * through the crossings, so in plan x = ±s cos θ and z = Z0 + s sin θ.
 *  - a = 48 m: the crossings are 96 m apart (OSM tips, measured).
 *  - Z0 = 7.9 m: "the arches cross about 26 feet above ground" (Wikipedia;
 *    NRHP: "slightly above the ground level").
 *  - crown 27.4 m: "rise to a height of ninety feet in the center" (NRHP).
 *  - plan half-width 46.0 m at the arch centreline: OSM's outline is fitted
 *    by x = V(1 − y²/a²) to within 0.5 m all round, with V = 47.4 m at the
 *    roof rim (measured), and "a length and width of 300 feet" (NRHP: 91 m
 *    inside the walls). θ = atan(19.5 / 46.0) = 23.0° follows from these.
 *  - check: carried past the crossings, these curves reach the ground
 *    20 m out at 65° to the axis; NAIP shows the legs 20 m long at 64–67°.
 *  - arch section 3.2 m wide in its plane, 1.4 m deep: estimated from NAIP
 *    (the pale rim) and photos d03, d05 (the fascia against the piers).
 * The roof: cables across between the arches sag; the saddle's centre is
 *   put 9 m under the crowns (18.4 m up), sag ratio 1:10, estimated from
 *   d03/d04 (the roof is seen rising from the crossing over the far arch).
 *   Each cross-cable's sag scales with the square of its span.
 * The wall: vertical white piers about 4.2 m apart (counted in d02, d05)
 *   with dark green-tinted glass between, under the arch's inner half.
 * The seating platform's edge: a white band 2 m deep across each long wall,
 *   10.6 m up at the centre and running down toward the crossings (d02, d03,
 *   d05, d06): scaled from photos, estimated.
 * Entrances: ten pairs of red doors under a flat cantilevered canopy at the
 *   centre of each long side (NRHP; d02, d05); two pairs of large red doors
 *   under the north-east crossing (NRHP; d03).
 *
 * Sources:
 *  OSM way/47947592 "J.S. Dorton Arena" (no height tags).
 *  NRHP nomination, WA0012 (1973): https://files.nc.gov/ncdcr/nr/WA0012.pdf
 *  Wikipedia "Dorton Arena": https://en.wikipedia.org/wiki/Dorton_Arena
 *  USGS NAIP (public domain): plan, legs, roof colour.
 *  No lidar covers Wake County.
 * Photos (evidence):
 *  d01 "Dorton Arena.jpg", Justin Doub, CC BY 2.0
 *      https://commons.wikimedia.org/wiki/File:Dorton_Arena.jpg
 *  d02 "Dorton Arena 2012.JPG", Leah Rucker, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:Dorton_Arena_2012.JPG
 *  d03 "Dorton Arena West Side.JPG", Leah Rucker, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:Dorton_Arena_West_Side.JPG
 *  d04 "Raleigh, Dorton Arena , June 1981.jpg", Peter Christian Riemann, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Raleigh,_Dorton_Arena_,_June_1981.jpg
 *  d05 "Dorton Arena (35997447053).jpg", Billie Grace Ward, CC BY 2.0
 *      https://commons.wikimedia.org/wiki/File:Dorton_Arena_(35997447053).jpg
 *  d06 "Dorton Arena, State Fairgrounds, Raleigh, NC (27892928877).jpg", Warren LeMay, CC0
 *      https://commons.wikimedia.org/wiki/File:Dorton_Arena,_State_Fairgrounds,_Raleigh,_NC_(27892928877).jpg
 *  d07 "J.S. Dorton Arena in November 2022.jpg", DiscoA340, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:J.S._Dorton_Arena_in_November_2022.jpg
 *
 * Colours: arches, piers and band white concrete (all photos); glass dark
 * (window); roof pale grey membrane (NAIP); doors red (d02, d03); the entry
 * canopies' dark fascia (d02, d05).
 * Left out: the lettering on the band, the hinged vent sashes, the brackets
 * under the arch rim, the drainage spouts at the crossings, the stair at the
 * south-west end.
 * Doubts: the roof's sag is estimated (no section drawing found); the
 * band's height is photo-scaled; the north-east crossing's doors rest on
 * the NRHP text alone (no photo of that end found).
 * Night: the glass glows (the hall is lit inside); nothing else is lit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishGlb, writeModel } from './sea-tacoma-union-station'
import { quadO } from './nash-tennessee-state-capitol'

// ---------------------------------------------------------------- the paraboleum
const A = 48 // half the distance between the crossings
const Z0 = 7.9 // crossing height
const CROWN = 27.4
const VC = 46.0 // plan half-width of the arch centreline
const RISE = CROWN - Z0
const TH = Math.atan2(RISE, VC)
const S = Math.hypot(RISE, VC) // in-plane height of the arch over the crossing line
const AW = 3.2, AH = 1.4 // arch section: width in its plane, depth across it
const VW = 45.0 // plan half-width of the glass wall
const SAG = 9.0 // roof sag at the centre
const BAND_C = 10.6, BAND_T = 0.8, BAND_H = 2.0 // the seating platform's edge
const p = (u: number) => 1 - (u * u) / (A * A)

const cos = Math.cos(TH), sin = Math.sin(TH)
/** A point in arch `side`'s tilted plane: along the axis u, s out from the crossing line, d off the plane. */
function onArch(side: number, u: number, s: number, d = 0): V3 {
  // plane normal (pointing up and inward): (−side·sin, 0, cos)
  return [side * (s * cos - d * sin), u, Z0 + s * sin + d * cos]
}

function build() {
  const conc = new Part(), glass = new Part(), roof = new Part(), door = new Part(), dark = new Part()

  // ------------------------------------------------------------ the arches
  const uEnd = A * Math.sqrt(1 + (Z0 / sin) / S) // where the centreline meets the ground
  const N = 56
  for (const side of [1, -1]) {
    const secs: { c: V3; e: V3; n: V3; pts: V3[] }[] = []
    for (let i = 0; i <= N; i++) {
      // denser towards the crossings, where the curve turns fastest in plan
      const t = -1 + (2 * i) / N
      const u = uEnd * Math.sign(t) * (1 - (1 - Math.abs(t)) ** 1.35)
      const s = S * p(u), ds = (-2 * S * u) / (A * A)
      // in-plane unit normal to the curve, (du, ds) ∝ (−ds, 1)
      const L = Math.hypot(ds, 1), nu = -ds / L, ns = 1 / L
      const h = AW / 2, d = AH / 2
      const pt = (k: number, m: number): V3 => {
        const q = onArch(side, u + k * h * nu, s + k * h * ns, m * d)
        return [q[0], q[1], Math.max(0, q[2])]
      }
      const pts = [pt(-1, -1), pt(1, -1), pt(1, 1), pt(-1, 1)]
      secs.push({ c: onArch(side, u, s), e: [0, 0, 0], n: [0, 0, 0], pts })
    }
    for (let i = 0; i < N; i++) {
      const a = secs[i], b = secs[i + 1]
      const mid: V3 = [(a.c[0] + b.c[0]) / 2, (a.c[1] + b.c[1]) / 2, (a.c[2] + b.c[2]) / 2]
      for (let k = 0; k < 4; k++) {
        const l = (k + 1) % 4
        const P = [a.pts[k], a.pts[l], b.pts[l], b.pts[k]]
        const fc: V3 = [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2, (P[0][2] + P[2][2]) / 2]
        quadO(conc, P[0], P[1], P[2], P[3], [fc[0] - mid[0], fc[1] - mid[1], fc[2] - mid[2]])
      }
    }
    // the feet: close the ends
    for (const [sec, dir] of [[secs[0], -1], [secs[N], 1]] as const) {
      const q = sec.pts
      quadO(conc, q[0], q[1], q[2], q[3], [0, dir, 0])
    }
  }

  // ------------------------------------------------------------ the roof
  // the edge: just inside each arch's inner edge, a little under its top face
  const NU = 26, NV = 12
  const edge = (u: number): [number, number] => {
    const s = Math.max(0, S * p(u) - 1.3)
    return [s * cos, Z0 + s * sin + (AH / 2) * cos - 0.25]
  }
  const roofPt = (i: number, j: number): V3 => {
    const t = -1 + (2 * i) / NU
    const u = A * Math.sign(t) * (1 - (1 - Math.abs(t)) ** 1.3)
    const v = -1 + (2 * j) / NV
    const [xe, ze] = edge(u)
    return [v * xe, u, ze - SAG * p(u) ** 2 * (1 - v * v)]
  }
  const grid: V3[][] = []
  for (let i = 0; i <= NU; i++) { grid.push([]); for (let j = 0; j <= NV; j++) grid[i].push(roofPt(i, j)) }
  const rn = (i: number, j: number): V3 => {
    const a = grid[Math.min(i + 1, NU)][j], b = grid[Math.max(i - 1, 0)][j]
    const c = grid[i][Math.min(j + 1, NV)], d = grid[i][Math.max(j - 1, 0)]
    const du: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dv: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
    let n: V3 = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]]
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    const l = Math.hypot(...n) || 1
    return [n[0] / l, n[1] / l, n[2] / l]
  }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
    const a = grid[i][j], b = grid[i][j + 1], c = grid[i + 1][j + 1], d = grid[i + 1][j]
    const na = rn(i, j), nb = rn(i, j + 1), nc = rn(i + 1, j + 1), nd = rn(i + 1, j)
    roof.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    roof.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }

  // ------------------------------------------------------------ the walls
  // plan: x = ±VW·p(u); the top runs up under the arch's underside
  const wallTop = (u: number) => Z0 + VW * p(u) * Math.tan(TH) - (AH / 2) / cos
  const bandZ = (u: number) => BAND_T + (BAND_C - BAND_T) * p(u)
  // stations evenly spaced along the wall's plan length
  const M = 400, cum: number[] = [0], us: number[] = []
  for (let k = 0; k <= M; k++) us.push(-A + (2 * A * k) / M)
  for (let k = 1; k <= M; k++) cum.push(cum[k - 1] + Math.hypot(us[k] - us[k - 1], VW * (p(us[k]) - p(us[k - 1]))))
  const total = cum[M]
  const uAt = (len: number) => {
    let k = 1
    while (k < M && cum[k] < len) k++
    const f = (len - cum[k - 1]) / (cum[k] - cum[k - 1])
    return us[k - 1] + f * (us[k] - us[k - 1])
  }
  const BAYS = Math.round(total / 4.2)
  const bay = total / BAYS
  for (const side of [1, -1]) {
    const W = (u: number, z: number, d = 0): V3 => {
      // d: out from the wall, along its plan normal
      const x = side * VW * p(u), dxdu = side * VW * (-2 * u) / (A * A)
      const L = Math.hypot(dxdu, 1)
      const n = [side / L, (-side * dxdu) / L] // side·(1, −dx/du), normalised
      return [x + n[0] * d, u + n[1] * d, z]
    }
    const out = (u: number): V3 => { const q = W(u, 0, 1), o = W(u, 0); return [q[0] - o[0], q[1] - o[1], 0] }
    // glass, one panel per bay, split at the band
    for (let k = 0; k < BAYS; k++) {
      const u0 = uAt(k * bay), u1 = uAt((k + 1) * bay), um = (u0 + u1) / 2
      const o = out(um)
      const b0 = bandZ(u0), b1 = bandZ(u1)
      quadO(glass, W(u0, 0), W(u1, 0), W(u1, b1), W(u0, b0), o)
      quadO(glass, W(u0, b0 + BAND_H), W(u1, b1 + BAND_H), W(u1, wallTop(u1) + 0.2), W(u0, wallTop(u0) + 0.2), o)
    }
    // piers at every bay line, standing 0.35 m proud, 0.7 m wide
    for (let k = 1; k < BAYS; k++) {
      const len = k * bay, u0 = uAt(len - 0.35), u1 = uAt(len + 0.35), um = uAt(len)
      const top0 = wallTop(u0) + 0.1, top1 = wallTop(u1) + 0.1
      const o = out(um), f = 0.35
      quadO(conc, W(u0, 0, f), W(u1, 0, f), W(u1, top1, f), W(u0, top0, f), o)
      const t: V3 = [W(u1, 0)[0] - W(u0, 0)[0], W(u1, 0)[1] - W(u0, 0)[1], 0]
      quadO(conc, W(u0, 0, 0), W(u0, 0, f), W(u0, top0, f), W(u0, top0, 0), [-t[0], -t[1], 0])
      quadO(conc, W(u1, 0, 0), W(u1, 0, f), W(u1, top1, f), W(u1, top1, 0), t)
    }
    // the seating platform's edge: a band 0.45 m proud, closed top and bottom
    {
      const NB = 40, f = 0.45
      for (let k = 0; k < NB; k++) {
        const u0 = -A + 2 + ((2 * A - 4) * k) / NB, u1 = -A + 2 + ((2 * A - 4) * (k + 1)) / NB
        const z0 = bandZ(u0), z1 = bandZ(u1), o = out((u0 + u1) / 2)
        quadO(conc, W(u0, z0, f), W(u1, z1, f), W(u1, z1 + BAND_H, f), W(u0, z0 + BAND_H, f), o)
        quadO(conc, W(u0, z0 + BAND_H, 0), W(u1, z1 + BAND_H, 0), W(u1, z1 + BAND_H, f), W(u0, z0 + BAND_H, f), [0, 0, 1])
        quadO(conc, W(u0, z0, 0), W(u1, z1, 0), W(u1, z1, f), W(u0, z0, f), [0, 0, -1])
      }
    }
    // the side entrance: ten pairs of red doors under a flat canopy
    {
      const c = total / 2, half = 5 * bay
      for (let k = -5; k < 5; k++) {
        const u0 = uAt(c + k * bay + 0.45), u1 = uAt(c + (k + 1) * bay - 0.45)
        const o = out((u0 + u1) / 2)
        quadO(door, W(u0, 0, 0.06), W(u1, 0, 0.06), W(u1, 3.0, 0.06), W(u0, 3.0, 0.06), o)
      }
      const NC = 8, D = 2.2, z0 = 3.4, z1 = 3.8
      for (let k = 0; k < NC; k++) {
        const u0 = uAt(c - half - 1 + ((2 * half + 2) * k) / NC), u1 = uAt(c - half - 1 + ((2 * half + 2) * (k + 1)) / NC)
        const o = out((u0 + u1) / 2)
        quadO(dark, W(u0, z1, 0), W(u1, z1, 0), W(u1, z1, D), W(u0, z1, D), [0, 0, 1])
        quadO(dark, W(u0, z0, 0), W(u1, z0, 0), W(u1, z0, D), W(u0, z0, D), [0, 0, -1])
        quadO(dark, W(u0, z0, D), W(u1, z0, D), W(u1, z1, D), W(u0, z1, D), o)
        if (k === 0 || k === NC - 1) {
          const ue = k === 0 ? u0 : u1, ui = k === 0 ? u1 : u0
          const t: V3 = [W(ue, 0)[0] - W(ui, 0)[0], W(ue, 0)[1] - W(ui, 0)[1], 0]
          quadO(dark, W(ue, z0, 0), W(ue, z0, D), W(ue, z1, D), W(ue, z1, 0), t)
        }
      }
    }
    // both ends: a pair of large red doors on each wall under the crossing
    for (const [u0, u1] of [[A - 9, A - 3], [-A + 3, -A + 9]]) {
      quadO(door, W(u0, 0, 0.06), W(u1, 0, 0.06), W(u1, 4.8, 0.06), W(u0, 4.8, 0.06), out((u0 + u1) / 2))
    }
  }

  return finishGlb('J. S. Dorton Arena', [
    { part: conc, material: finish('dorton-concrete', 0xeeebe4) },
    { part: glass, material: PALETTE.window },
    { part: roof, material: finish('dorton-roof', 0xc2c7ca) },
    { part: door, material: { ...PALETTE.entrance, color: 0xb0524a } },
    { part: dark, material: finish('dorton-canopy', 0x5d636a) },
  ], { bearing: 64.1, height: CROWN + AH, replaces: ['way/47947592'] }, 5000)
}

if (import.meta.main) await writeModel('ral-dorton-arena', build())
