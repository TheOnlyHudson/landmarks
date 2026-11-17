/**
 * Frost Bank Tower, 401 Congress Avenue, Austin (2003, Duda/Paine Architects
 * with HKS) — original procedural geometry, CC0-1.0.
 * bun generators/atx-frost-bank-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.7: the model's axes follow Austin's street grid
 * (Congress Avenue runs along y). Anchor = area centroid of OSM
 * way/37546502 ("Frost Bank Tower", 33 levels, height 157), -97.7427211,
 * 30.2663845. The outline covers the whole block's building: the tower and
 * its parking podium (the Mexic-Arte Museum corner is a separate way and is
 * left alone).
 *
 * Identity (from the photos):
 *  1. The crown: a cluster of steep pointed glass spires, so that every face
 *     shows two tall "ears" with a V between them (the "owl"), over sloped
 *     glass shoulders. Lit white at night.
 *  2. A square tower whose four faces each carry a central bay that rises
 *     past the corners to the crown, with the Frost sunburst logo at its top
 *     (128 m, the highest logo in the city).
 *  3. Corners that step back up the tower and then chamfer, in sloped
 *     glass facets, into the bays and the crown.
 *  4. Silvery-blue reflective glass all over, with pale mullion lines.
 *
 * Evidence:
 *  - plan: OSM way/37546502 for the podium. The tower itself is not split
 *    out in OSM; it is placed from the lidar: a 42 m square centred at
 *    (-10.4, -2.5) in this frame, with a 24 m central bay on each face, 2 m
 *    proud below 104 m, and a lower wing on the east side.
 *  - heights: USGS 3DEP lidar USGS_LPC_TX_Central_B1_2017 (2017 flight),
 *    1 m grid, read in the frame with tools/lidar_frame.py, less 1 m for the
 *    ground (Mapterhorn: the block is within 1 m of flat). Measured: the
 *    central bays' tops 127 m; the corners at 96 m; the bays' projecting
 *    lower parts 104 m; the east wing 72 and 80 m; spire tips 155-159 m,
 *    four of them about 10 m apart round the centre; the crown's base about
 *    137 m; the podium 32 m, with a 20 m strip on the west.
 *  - published: 515 ft (157 m) roof, 33 storeys (Wikipedia, "Frost Bank
 *    Tower"; OSM height 157); logo at 420 ft (128 m).
 *  - estimated from the photos ("dad2" at about 0.21 m/px above the podium,
 *    "dad1", "lsm"): the taper, three tiers stepping in at 66 and 104 m
 *    (half-widths 21.5, 19.8, 18.2 m with corner chamfers 2.5, 5, 7 m; the
 *    central bays 23.5, 22, 20.5 m out). The lidar's top outline (bays 21 m
 *    out at 127 m, 2 m proud strips to 104 m) fits within about 1.5 m. The
 *    crown is one faceted cap whose skyline on every face is the photo's
 *    zigzag: the logo V at 138 m, ears at 157 m, gables at 146.5 and
 *    137.5 m, the eave at 124 m. The logo's size (about 7 m) and the 6 x
 *    12 m mullion grid.
 *  - colours: the bright reflective blue glass, the pale crown and white logo, from the
 *    daylight photos; the podium's buff precast from "dad2", drawn plain (its fine window
 *    grid is too small to draw).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  dad1  "Frost Bank Tower - Austin, Texas - DSC08342.jpg", Daderot, CC0
 *        (from 6th Street, north-east) https://commons.wikimedia.org/wiki/File:Frost_Bank_Tower_-_Austin,_Texas_-_DSC08342.jpg
 *  dad2  "Frost Bank Tower - Austin, Texas - DSC08325.jpg", Daderot, CC0
 *        https://commons.wikimedia.org/wiki/File:Frost_Bank_Tower_-_Austin,_Texas_-_DSC08325.jpg
 *  lsm   "FrostBankTower-Jul2010-a.JPG", LoneStarMike, CC BY-SA 3.0 (a face
 *        and the crown at dusk) https://commons.wikimedia.org/wiki/File:FrostBankTower-Jul2010-a.JPG
 *  hans  "Frost Bank Tower Austin.jpg", HanFSolo, CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Frost_Bank_Tower_Austin.jpg
 *  high  "The upper reaches of Frost Bank Tower ... LCCN2014631900.tif",
 *        Carol M. Highsmith, public domain (the crown at night)
 *  cmbj  "Frostbanktoweraustintx.jpg", CMBJ, CC BY-SA 2.5 (from below)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the tier heights and setbacks are read off oblique photos and
 * drawn a little bolder than the lidar's top outline so they read at phone
 * size. The crown's real facets are smaller and more numerous; here every
 * gable is a pitched pair of planes of one cap (height = min(zig(x),
 * zig(y)) about the centre). The podium is plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, prism, save, type XY } from './atl-flatiron-building'

// Small helpers, copied from atx-google-tower.ts so this generator stands alone.
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle wound to face `out`. */
function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  if (dot3(cross3(sub3(b, a), sub3(c, a)), out) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  triOut(p, a, b, c, out)
  triOut(p, a, c, d, out)
}

const lerpXY = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** Clip a counter-clockwise ring to the half-plane n·p <= c. */
function clipHalf(ring: XY[], n: XY, c: number): XY[] {
  const out: XY[] = []
  const f = (p: XY) => n[0] * p[0] + n[1] * p[1] - c
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa <= 0) out.push(a)
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) out.push(lerpXY(a, b, fa / (fa - fb)))
  }
  return out.filter((p, i) => Math.hypot(p[0] - out[(i + 1) % out.length][0], p[1] - out[(i + 1) % out.length][1]) > 0.05)
}

/** A flat band standing `o` off a wall from a to b (outside to the right of a→b), z0..z1. */
function wallBand(p: Part, a: XY, b: XY, z0: number, z1: number, o = 0.06, inset = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * inset + 0.2) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
  const A: XY = [a[0] + t[0] * inset + n[0] * o, a[1] + t[1] * inset + n[1] * o], B: XY = [b[0] - t[0] * inset + n[0] * o, b[1] - t[1] * inset + n[1] * o]
  quadOut(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], n)
}

const glass = new Part(), crown = new Part(), logo = new Part(), trim = new Part(), roof = new Part(), podium = new Part()

const C: XY = [-10.4, -2.5] // the tower's centre
const HALF = 21, ARM = 12 // body half-width; central bay half-width
const Zc = 96, Zb = 104, Zt = 127, TIP = 157

// ─────────────────────────────── the podium ────────────────────────────────
// OSM way/37546502 in the frame (the outline, including the tower's footprint).
const OUTLINE: XY[] = [[-48.05, -30.9], [5.62, -30.58], [55.68, -30.3], [55.58, 21.49], [5.92, 21.2], [0.52, 21.17], [0.5, 38.57], [-35.16, 38.43], [-48.17, 38.39], [-48.15, 26.38], [-48.13, 17.81], [-48.12, 8.99]]
const WEST = -40.4 // the low west strip, 20 m
{
  const main: XY[] = [[WEST, -30.85], [5.62, -30.58], [55.68, -30.3], [55.58, 21.49], [5.92, 21.2], [0.52, 21.17], [0.5, 38.57], [WEST, 38.45]]
  const west: XY[] = [[-48.05, -30.9], [WEST, -30.85], [WEST, 38.45], [-48.17, 38.39]]
  prism(podium, main, 0, 32, roof, 0.4)
  prism(podium, west, 0, 20, roof, 0.4)
  // plain buff precast: the photos show a fine grid of small windows, too
  // fine to draw, so the podium stays a quiet base under the tower
  void OUTLINE
}

// ─────────────────────────────── the tower ─────────────────────────────────
const [cx, cy] = C
const TIERS = [ // [z0, z1, half-width, corner chamfer]: the corners step in at about 1/3 and 2/3 height
  [32, 66, 21.5, 2.5],
  [66, 104, 19.8, 5],
  [104, 124, 18.2, 7],
] as const
// the central bays' faces on each tier: they step back with the tiers
const BAYS = [[32, 66, 23.5], [66, 104, 22], [104, 124, 20.5]] as const
const ZE = 124, BAYOUT = 20.5 // the crown's eave; the top bays' face
/** A square of half-width h about the centre with its corners chamfered c, counter-clockwise. */
const oct = (h: number, c: number): XY[] => [
  [cx - h + c, cy - h], [cx + h - c, cy - h], [cx + h, cy - h + c], [cx + h, cy + h - c],
  [cx + h - c, cy + h], [cx - h + c, cy + h], [cx - h, cy + h - c], [cx - h, cy - h + c],
]
// The four faces: u out of the face, v along it.
const DIRS = [0, 1, 2, 3].map((k) => { const a = (k * Math.PI) / 2 - Math.PI / 2; return { u: [Math.cos(a), Math.sin(a)] as XY, v: [-Math.sin(a), Math.cos(a)] as XY } })
const F = (d: { u: XY; v: XY }, along: number, out: number): XY => [cx + d.v[0] * along + d.u[0] * out, cy + d.v[1] * along + d.u[1] * out]

// The shaft: three tiers, each set back and with bigger chamfered corners,
// so the tower tapers toward the crown; a pale ledge at each setback.
for (const [z0, z1, h, c] of TIERS) prism(glass, oct(h, c), z0, z1, roof, 0.3)
// The central bays: 24 m wide, standing proud of every tier, straight from
// the podium to the crown (they run full height in every photo).
for (const d of DIRS) for (const [z0, z1, o] of BAYS) prism(glass, ccw([F(d, -ARM, 15), F(d, ARM, 15), F(d, ARM, o), F(d, -ARM, o)]), z0, z1, roof, 0.3)
// The east wing: 72 m, its middle 80 m.
prism(glass, [[cx + HALF + 2, cy - 19], [cx + HALF + 10, cy - 19], [cx + HALF + 10, cy + 19], [cx + HALF + 2, cy + 19]], 32, 72, roof, 0.3)
prism(glass, [[cx + HALF + 2, cy - ARM], [cx + HALF + 10, cy - ARM], [cx + HALF + 10, cy + ARM], [cx + HALF + 2, cy + ARM]], 72, 80, roof, 0.3)

// The crown: one faceted glass cap over the top tier and the bays. Its
// height is min(zig(|x|), zig(|y|)) about the centre, where zig is the
// zigzag skyline every face shows: the V with the logo, the two tall ears,
// then a lower gable and a lower one again on each side, down to the
// eave. So from every side the skyline is that zigzag, every point is a
// pitched gable (two sloped faces meeting on a ridge running back into the
// cap), and neighbouring gables meet below their peaks with no sky between.
const ZIG: [number, number][] = [[0, 138], [5.5, 157], [10.5, 138], [12.6, 146.5], [14.6, 133], [16.4, 137.5], [18.2, 129], [BAYOUT, ZE]]
const zig = (s: number) => {
  s = Math.abs(s)
  for (let i = 0; i < ZIG.length - 1; i++) {
    const [s0, z0] = ZIG[i], [s1, z1] = ZIG[i + 1]
    if (s <= s1) return z0 + ((z1 - z0) * (s - s0)) / (s1 - s0)
  }
  return ZE
}
const capZ = (x: number, y: number) => Math.min(zig(x - cx), zig(y - cy))
{
  const [, , H3, C3] = TIERS[2]
  const br = [0, 5.5, 10.5, 12, 12.6, 14.6, 16.4, 18.2, BAYOUT]
  const grid = [...br.slice(1).reverse().map((v) => -v), ...br]
  const inBay = (x: number, y: number) => (Math.abs(x) <= ARM && Math.abs(y) <= BAYOUT) || (Math.abs(y) <= ARM && Math.abs(x) <= BAYOUT)
  const inTop = (x: number, y: number) => Math.abs(x) <= H3 && Math.abs(y) <= H3
  const edges = new Map<string, { a: XY; b: XY; n: number }>()
  const key = (p: XY) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`
  for (let i = 0; i < grid.length - 1; i++) for (let j = 0; j < grid.length - 1; j++) {
    const x0 = grid[i], x1 = grid[i + 1], y0 = grid[j], y1 = grid[j + 1], mx = (x0 + x1) / 2, my = (y0 + y1) / 2
    let poly: XY[]
    if (inBay(mx, my)) poly = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    else if (inTop(mx, my)) {
      // the top tier's chamfered corners: |x| + |y| <= 2 H3 - C3
      const sx = Math.sign(mx), sy = Math.sign(my)
      poly = clipHalf([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], [sx, sy], 2 * H3 - C3)
      if (poly.length < 3) continue
    } else continue
    const P = poly.map(([x, y]) => [x + cx, y + cy] as XY)
    const m: XY = [P.reduce((t, q) => t + q[0], 0) / P.length, P.reduce((t, q) => t + q[1], 0) / P.length]
    const M: V3 = [m[0], m[1], capZ(...m)]
    for (let k = 0; k < P.length; k++) {
      const a = P[k], b = P[(k + 1) % P.length]
      triOut(crown, [a[0], a[1], capZ(...a)], [b[0], b[1], capZ(...b)], M, [0, 0, 1])
      const ka = key(a), kb = key(b), kk = ka < kb ? ka + '|' + kb : kb + '|' + ka
      const e = edges.get(kk)
      if (e) e.n++
      else edges.set(kk, { a, b, n: 1 })
    }
  }
  // the cap's sides, from the eave up to the cap, round its outline
  for (const { a, b, n } of edges.values()) {
    if (n !== 1) continue
    const za = capZ(...a), zb = capZ(...b)
    if (za <= ZE + 0.01 && zb <= ZE + 0.01) continue
    const mid: XY = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy]
    // outward: away from the centre, across the edge
    const t: XY = [b[0] - a[0], b[1] - a[1]], nn: XY = [t[1], -t[0]]
    const out: V3 = nn[0] * mid[0] + nn[1] * mid[1] > 0 ? [nn[0], nn[1], 0] : [-nn[0], -nn[1], 0]
    quadOut(crown, [a[0], a[1], ZE], [b[0], b[1], ZE], [b[0], b[1], zb], [a[0], a[1], za], out)
  }
}

// The bay tops: a parapet on each face carrying the logo, and the light
// mullion grid: broad panels, about 6 m by 12 m.
for (const d of DIRS) {
  const t = d.v, n = d.u, m = F(d, 0, BAYOUT)
  prism(crown, ccw([F(d, -5, BAYOUT), F(d, 5, BAYOUT), F(d, 5, BAYOUT - 1), F(d, -5, BAYOUT - 1)]), ZE, 136, crown, 0.2)
  const R = 3.4, zc = 130.5, o = 0.08, seg = 14
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2
    const P = (ang: number, r: number): V3 => [m[0] + t[0] * Math.cos(ang) * r + n[0] * o, m[1] + t[1] * Math.cos(ang) * r + n[1] * o, zc + Math.sin(ang) * r]
    triOut(logo, P(0, 0), P(a0, R), P(a1, R), [n[0], n[1], 0])
  }
  for (const [z0, z1, ob] of BAYS) for (const sv of [-ARM, -6, 0, 6, ARM]) {
    const e = Math.sign(sv) * 0.3
    wallBand(trim, F(d, sv - 0.3 - e, ob), F(d, sv + 0.3 - e, ob), z0 + 1, z1 - 0.6, 0.06)
  }
  for (let z = 44; z < ZE - 4; z += 12) {
    const ob = BAYS.find(([z0, z1]) => z >= z0 && z < z1)![2]
    wallBand(trim, F(d, -ARM, ob), F(d, ARM, ob), z, z + 0.5, 0.06)
    const tier = TIERS.find(([z0, z1]) => z > z0 + 1 && z < z1 - 1)
    if (!tier) continue
    const [, , h, c] = tier
    if (h - c > ARM + 1) for (const sg of [-1, 1]) wallBand(trim, F(d, sg < 0 ? -(h - c) : ARM, h), F(d, sg < 0 ? -ARM : h - c, h), z, z + 0.5, 0.06)
  }
}
void capPoly
void Zc; void Zb; void Zt

if (import.meta.main) {
  await save('atx-frost-bank-tower', 'Frost Bank Tower', [
    { part: glass, material: { ...PALETTE.window, color: 0x76a7d8 } },
    { part: crown, material: finish('neon-frost-crown', 0xc9dde6, 0.3) },
    { part: logo, material: finish('neon-frost-logo', 0xf6f2e6, 0.5) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: podium, material: finish('frost-precast', 0xcdbd9f) },
  ], { bearing: 17.7, height: TIP, replaces: ['way/37546502'] })
}
