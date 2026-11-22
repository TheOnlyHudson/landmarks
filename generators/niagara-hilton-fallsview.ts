/**
 * Hilton Niagara Falls/Fallsview Hotel and Suites, 6361 Fallsview
 * Boulevard, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-hilton-fallsview.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Anchor = centroid of the OSM outline way/808101755,
 * 43.082789, -79.083240.
 *
 * Ground: the site falls about 8 m from Stanley Avenue (west) to Fallsview
 * Boulevard (east) on Mapterhorn. y = 0 is the lowest ground under the
 * outline, near the north-east corner; both towers start at G, the
 * boulevard, and their walls run down to y = 0.
 *
 * Identity: two pale stone towers. The north tower (Tower 2, 2009, the
 * tallest hotel in Canada) is a tall plain shaft with string courses at a
 * third and two thirds, a crown of two storeys of round-arched windows
 * under an attic and cornice, a green hipped roof with a copper-domed
 * cupola, and a full-height dark glass strip at the west end of its north
 * face. The south tower (Tower 1, 1999) has a dark glass band over its
 * top floors under green roofs with big gables. Between them a 13-storey
 * block with a green roof, and low podiums.
 *
 * Evidence:
 * - plan: OSM. Tower 2 way/808101757 and its roof way/1093978401 (OSM
 *   150 m, roof to 162 m); Tower 1 way/808101763 (30 levels); the 13-level
 *   block way/808101751; the 5-level west block way/1093978402; podiums
 *   way/1093978408 and way/1093978409; the east entrance rotunda
 *   way/1093978407 and the turret way/1093978404-406.
 * - heights, published (Wikipedia, "List of tallest buildings in Niagara
 *   Falls, Ontario"): Tower 2 177.1 m (581 ft) to the cupola, 53 floors;
 *   Tower 1 103 m, 30 floors. OSM's 150/162 m for Tower 2 is low against
 *   both; the cornice is put at G + 158 so that 53 floors fit, the hip
 *   rises 8 m and the cupola makes up the published 177 m.
 * - crown, string courses, cupola, glass strip, Tower 1's glass band and
 *   gables: Domenic Scaturchio's photo from the north-east (below). The
 *   arcade has thirteen arches on the broad face, scaled to the faces here.
 * - colour: pale limestone (the palette stone), green standing-seam roofs
 *   (the palette copper), a copper-orange cupola dome.
 *
 * Estimated: the 13-level block's and podium heights (about 3.1 m and
 * 4.5 m a floor), the gable sizes on Tower 1, the turret's dome.
 * The west faces have no close licensed photo; they repeat the east.
 * Left out: the "Hilton" sign, rooftop machinery frame, balconies,
 * the Fallsview Indoor Waterpark and the entertainment centre (separate
 * OSM buildings).
 *
 * Photos (Wikimedia Commons):
 * - "Hilton Niagara Falls.jpg", Domenic Scaturchio, CC BY 2.0 (north-east)
 * - "SkylineNiagaraFalls.jpg", Sundar1, CC BY-SA 3.0 (the skyline from the
 *   US side, east)
 * - "Fallsview Casino and the Horseshoe Falls (5750353909).jpg", Gary J.
 *   Wood, CC BY-SA 2.0 (taken from the Hilton; podium roofs)
 * No commercial imagery. No lidar: Ontario, no 3DEP coverage here.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { bays, block, cap, inset, rows, save, walls, lathe, type XY } from './chi-aon-center'

const G = 2.5

const T2: XY[] = [[-16.79, 62.84], [-16.19, 54.5], [-19.79, 54.36], [-19.42, 46.52], [-15.43, 46.69], [-15.07, 41.55], [-18.88, 41.37], [-18.15, 31.09], [-15.84, 31.11], [-15.61, 21.7], [-7.88, 21.9], [-7.88, 23.5], [-2.61, 23.79], [8.25, 24.35], [6.42, 51.14], [5.47, 63.85], [2.07, 63.69], [-7.25, 63.27]]
const T2_ROOF: XY[] = [[-10.9, 25.98], [4.75, 27.01], [2.24, 60.63], [-13.52, 59.7]]
const T1: XY[] = [[-5.55, -4.59], [-5.01, -18.26], [-3.31, -18.19], [-2.96, -26.95], [0.16, -26.83], [0.41, -33.3], [-2.73, -33.44], [-1.85, -55.51], [7.36, -55.16], [13.79, -54.9], [13.6, -50.23], [16.66, -50.11], [16.32, -41.82], [17.91, -41.76], [16.86, -15.95], [14.97, -16.02], [14.66, -8.31], [11.07, -8.44], [10.88, -3.95], [-0.95, -4.39]]
const MID: XY[] = [[-2.38, 19.1], [-18.24, 18.15], [-16.88, -1.12], [-1.22, -0.24], [-0.95, -4.39], [10.88, -3.95], [10.77, -2.02], [13.3, -1.93], [13.09, 2.2], [14.79, 2.26], [13.86, 18.62], [12.0, 18.54], [11.78, 22.41], [8.4, 22.35], [8.25, 24.35], [-2.61, 23.79]]
const WEST5: XY[] = [[-2.38, 19.1], [-2.61, 23.79], [-7.88, 23.5], [-7.88, 21.9], [-15.61, 21.7], [-15.84, 31.11], [-18.15, 31.09], [-18.88, 41.37], [-15.07, 41.55], [-15.43, 46.69], [-19.42, 46.52], [-19.79, 54.36], [-16.19, 54.5], [-16.79, 62.84], [-7.25, 63.27], [-7.73, 69.56], [-25.69, 68.02], [-25.49, 64.99], [-22.86, 23.41], [-22.5, 17.8], [-18.24, 18.15]]
const EAST2: XY[] = [[13.6, -50.23], [13.79, -54.9], [17.83, -54.31], [17.39, -50.2], [17.89, -50.16], [20.2, -50.0], [21.09, -49.95], [26.78, -49.54], [21.95, 25.06], [21.84, 26.75], [21.71, 28.82], [21.4, 33.64], [16.66, 37.26], [12.47, 41.22], [11.56, 42.01], [15.52, 46.04], [14.14, 47.37], [14.08, 50.13], [15.65, 51.19], [17.82, 53.65], [19.13, 56.64], [19.45, 59.9], [18.73, 63.1], [17.06, 65.92], [14.59, 68.08], [11.56, 69.39], [8.29, 69.7], [1.05, 69.33], [0.98, 70.32], [-7.73, 69.56], [-7.25, 63.27], [2.07, 63.69], [3.0, 64.97], [5.39, 66.56], [8.18, 67.23], [11.04, 66.92], [13.62, 65.66], [15.61, 63.59], [16.77, 60.99], [16.95, 58.13], [16.16, 55.39], [14.46, 53.09], [12.07, 51.51], [9.27, 50.83], [6.42, 51.14], [8.25, 24.35], [8.4, 22.35], [11.78, 22.41], [12.0, 18.54], [13.86, 18.62], [14.79, 2.26], [13.09, 2.2], [13.3, -1.93], [10.77, -2.02], [10.88, -3.95], [11.07, -8.44], [14.66, -8.31], [14.97, -16.02], [16.86, -15.95], [17.91, -41.76], [16.32, -41.82], [16.66, -50.11]]
const SW2: XY[] = [[-1.22, -0.24], [-16.88, -1.12], [-15.15, -26.76], [-24.24, -27.31], [-22.5, -54.76], [-22.13, -64.84], [-22.06, -66.82], [-26.71, -67.17], [-25.93, -75.55], [-13.43, -71.91], [7.58, -65.78], [7.47, -60.69], [7.36, -55.16], [-1.85, -55.51], [-2.73, -33.44], [0.41, -33.3], [0.16, -26.83], [-2.96, -26.95], [-3.31, -18.19], [-5.01, -18.26], [-5.55, -4.59], [-0.95, -4.39]]
const ROTUNDA: XY[] = [[9.27, 50.83], [12.07, 51.51], [14.46, 53.09], [16.16, 55.39], [16.95, 58.13], [16.77, 60.99], [15.61, 63.59], [13.62, 65.66], [11.04, 66.92], [8.18, 67.23], [5.39, 66.56], [3.0, 64.97], [2.07, 63.69], [5.47, 63.85], [6.42, 51.14]]

const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const mix = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const v3 = (p: XY, z: number): V3 => [p[0], p[1], z]

/**
 * A hipped roof over a quadrilateral a b c d (counter-clockwise), where
 * a-b and c-d are the short ends, from z0 to the ridge at z1.
 */
function hip(p: Part, q: XY[], z0: number, z1: number) {
  const [a, b, c, d] = q
  const w = (Math.hypot(...sub2(b, a)) + Math.hypot(...sub2(d, c))) / 2
  const m1 = mix(a, b, 0.5), m2 = mix(c, d, 0.5)
  const L = Math.hypot(...sub2(m2, m1)), t = Math.min(0.45, (w / 2) / L)
  const r1 = mix(m1, m2, t), r2 = mix(m2, m1, t)
  p.tri(v3(a, z0), v3(b, z0), v3(r1, z1))
  p.quad(v3(b, z0), v3(c, z0), v3(r2, z1), v3(r1, z1))
  p.tri(v3(c, z0), v3(d, z0), v3(r2, z1))
  p.quad(v3(d, z0), v3(a, z0), v3(r1, z1), v3(r2, z1))
}

/** Round-arched window panels across wall a→b: n arches, springing at zs, from z0, out of the wall by `out`. */
function arches(p: Part, a: XY, b: XY, n: number, z0: number, zs: number, fill = 0.62, out = 0.05, seg = 8) {
  const L = Math.hypot(...sub2(b, a)), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const pitch = (L - 1.6) / n, w = pitch * fill, r = w / 2
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * out, a[1] + u[1] * s + nn[1] * out, z]
  for (let k = 0; k < n; k++) {
    const c = 0.8 + pitch * (k + 0.5)
    p.quad(P(c - r, z0), P(c + r, z0), P(c + r, zs), P(c - r, zs))
    for (let i = 0; i < seg; i++) {
      const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
      p.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
    }
  }
}

/** A gabled dormer on wall a→b, centred s along it, w wide, d deep into the roof, walls to ze, ridge zr. */
function gable(wall: Part, roof: Part, a: XY, b: XY, s: number, w: number, d: number, z0: number, ze: number, zr: number, out = 0.3) {
  const L = Math.hypot(...sub2(b, a)), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const P = (sx: number, dd: number): XY => [a[0] + u[0] * sx + nn[0] * dd, a[1] + u[1] * sx + nn[1] * dd]
  const f0 = P(s - w / 2, out), f1 = P(s + w / 2, out), k1 = P(s + w / 2, -d), k0 = P(s - w / 2, -d)
  block(wall, null, [f0, f1, k1, k0], z0, ze, 0)
  const fm = P(s, out + 0.4), km = P(s, -d)
  const e0 = P(s - w / 2 - 0.5, out + 0.4), e1 = P(s + w / 2 + 0.5, out + 0.4), g0 = P(s - w / 2 - 0.5, -d), g1 = P(s + w / 2 + 0.5, -d)
  wall.tri(v3(f0, ze), v3(f1, ze), v3(P(s, out), zr))
  roof.quad(v3(e1, ze - 0.4), v3(g1, ze - 0.4), v3(km, zr), v3(fm, zr))
  roof.quad(v3(g0, ze - 0.4), v3(e0, ze - 0.4), v3(fm, zr), v3(km, zr))
}

function build() {
  const stone = new Part(), win = new Part(), green = new Part(), roof = new Part(), trim = new Part(), dome = new Part()

  // ===== Tower 2 (north)
  const T2C = G + 158 // cornice
  walls(stone, T2, 0, T2C - 1.2)
  // string courses and cornice: proud trim bands
  for (const [z0, z1] of [[G + 54.6, G + 55.6], [G + 104.6, G + 105.6], [G + 144.2, G + 145.0], [G + 153.4, G + 154.0]]) {
    const o = inset(T2, -0.3)
    walls(trim, o, z0, z1); walls(trim, T2, z0 - 0.01, z0, o); walls(trim, o, z1, z1 + 0.01, T2)
  }
  const cor = inset(T2, -0.7)
  walls(trim, T2, T2C - 1.2, T2C - 1.2, cor)
  const corTop = block(trim, null, cor, T2C - 1.2, T2C, 0.3)
  cap(roof, corTop, T2C)
  // shaft windows, three floors a panel, between the courses
  const bayOpt = { bay: 3.0, gap: 1.5, end: 1.0, minLen: 5, out: 0.05 }
  bays(win, T2, [...rows(G + 6, G + 54.2, 6, 1.1), ...rows(G + 56, G + 104.2, 6, 1.1), ...rows(G + 106, G + 143.8, 5, 1.1)], bayOpt)
  // attic: square windows; arcade: round-arched windows over two floors
  bays(win, T2, [[G + 154.6, G + 156.4]], bayOpt)
  for (let i = 0; i < T2.length; i++) {
    const a = T2[i], b = T2[(i + 1) % T2.length], L = Math.hypot(...sub2(b, a))
    if (L < 6) continue
    arches(win, a, b, Math.max(2, Math.round(L / 2.7)), G + 145.6, G + 151.6)
  }
  // the dark glass strip at the west end of the north face, full height
  {
    const a: XY = [-7.25, 63.27], b: XY = [-16.79, 62.84], L = Math.hypot(...sub2(b, a)), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * 0.08, a[1] + u[1] * s + nn[1] * 0.08, z]
    for (const [z0, z1] of [[G + 4, G + 54.4], [G + 55.8, G + 104.4], [G + 105.8, G + 144]]) win.quad(P(2.2, z0), P(L - 1.0, z0), P(L - 1.0, z1), P(2.2, z1))
  }
  // hipped green roof and the cupola near its south end
  const R0 = T2C, R1 = T2C + 8
  hip(green, T2_ROOF, R0, R1)
  const rc: XY = mix(mix(T2_ROOF[0], T2_ROOF[1], 0.5), mix(T2_ROOF[2], T2_ROOF[3], 0.5), 0.28)
  lathe(trim, rc[0], rc[1], [[2.6, R1 - 3], [2.6, R1 + 0.2], [2.9, R1 + 0.6], [2.2, R1 + 0.6]], 12)
  lathe(win, rc[0], rc[1], [[2.2, R1 + 0.6], [2.2, R1 + 4.4]], 12)
  lathe(trim, rc[0], rc[1], [[2.2, R1 + 4.4], [2.7, R1 + 4.8], [2.5, R1 + 5.2]], 12)
  lathe(dome, rc[0], rc[1], [[2.5, R1 + 5.2], [2.35, R1 + 6.4], [1.8, R1 + 7.6], [1.0, R1 + 8.4], [0.001, R1 + 8.7]], 12)
  lathe(trim, rc[0], rc[1], [[0.25, R1 + 8.6], [0.25, 177.1 + G - 0.1], [0.001, 177.1 + G]], 6)

  // ===== Tower 1 (south)
  const T1G = G + 86, T1R = G + 95
  walls(stone, T1, 0, T1G)
  bays(win, T1, rows(G + 6, T1G - 1.5, 9, 1.1), bayOpt)
  const glassRing = inset(T1, 0.3)
  walls(win, glassRing, T1G, T1R)
  // trim band under the glass, and the eave
  walls(trim, T1, T1G - 0.01, T1G, glassRing)
  const eave = inset(T1, -0.5)
  walls(trim, glassRing, T1R, T1R, eave)
  block(trim, null, eave, T1R, T1R + 0.6, 0.2)
  const T1_ROOF: XY[] = [[-2.6, -54.6], [16.6, -53.9], [16.0, -5.6], [-4.4, -5.0]]
  hip(green, T1_ROOF, T1R + 0.6, G + 103)
  // the big gables on the long faces
  const eastA: XY = [16.6, -53.9], eastB: XY = [16.0, -5.6], westA: XY = [-4.4, -5.0], westB: XY = [-2.6, -54.6]
  for (const [a, b] of [[eastA, eastB], [westA, westB]] as [XY, XY][]) {
    const L = Math.hypot(...sub2(b, a))
    for (const f of [0.3, 0.7]) gable(trim, green, a, b, L * f, 9, 6, T1G, T1R + 2.5, G + 103.5, 0.4)
  }

  // ===== the 13-storey block between the towers, with a green hip
  const MZ = G + 43
  block(stone, roof, MID, 0, MZ, 0.4)
  bays(win, MID, rows(G + 6, MZ - 1.5, 4, 1.1), bayOpt)
  hip(green, [[12.6, 1.4], [11.3, 19.0], [-17.9, 17.4], [-17.3, -0.2]], MZ, MZ + 6)

  // ===== low blocks
  block(stone, roof, WEST5, 0, G + 24, 0.4)
  bays(win, WEST5, rows(G + 9, G + 23, 2, 1.0), { ...bayOpt, minLen: 6 })
  block(stone, roof, EAST2, 0, G + 10, 0.4)
  bays(win, EAST2, [[G + 2.5, G + 8]], { bay: 3.0, gap: 1.2, end: 1.0, minLen: 8, out: 0.05 })
  block(stone, roof, SW2, 0, G + 13, 0.4)
  bays(win, SW2, [[G + 5.5, G + 11.5]], { bay: 3.0, gap: 1.2, end: 1.0, minLen: 8, out: 0.05 })
  // entrance rotunda with a low glass dome, and the turret
  block(stone, roof, ROTUNDA, 0, G + 11, 0.3)
  lathe(win, 9.6, 59.1, [[6.2, G + 11], [5.2, G + 12.8], [3.0, G + 14.2], [0.001, G + 14.6]], 12)
  block(stone, trim, [[12.47, 41.22], [16.66, 37.26], [20.6, 41.33], [16.52, 45.29]], 0, G + 14, 0.3)
  lathe(stone, 16.55, 41.28, [[2.3, G + 14], [2.3, G + 18.5]], 8, Math.PI / 8)
  lathe(dome, 16.55, 41.28, [[2.5, G + 18.5], [2.2, G + 20], [1.3, G + 21.6], [0.001, G + 22.4]], 8, Math.PI / 8)

  return [
    { part: stone, material: PALETTE.stone },
    { part: win, material: PALETTE.window },
    { part: green, material: PALETTE.copper },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
    { part: dome, material: finish('hilton-dome-copper', 0xb98a62) },
  ]
}

if (import.meta.main) await save('niagara-hilton-fallsview', 'Hilton Niagara Falls/Fallsview Hotel and Suites', [43.082789, -79.08324], 0, build(), 6500)
