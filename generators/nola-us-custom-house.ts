/**
 * U.S. Custom House, 423 Canal Street, New Orleans (Alexander T. Wood,
 * begun 1848, finished 1881; now the Audubon Insectarium) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nola-us-custom-house.ts
 *
 * Built with the classical kit exported from nola-gallier-hall.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 38.4, the bearing of the Decatur
 * Street wall, so model -y is the Canal Street front (facing compass 218),
 * model -x Decatur Street, +y Iberville Street and +x North Peters Street,
 * which runs 15 degrees off square: the plan is a trapezoid, 101 m on Canal
 * and 80 m on Iberville. Anchor: the area centroid of OSM way/208520459.
 *
 * Identity: one massive grey granite block filling the whole city block,
 * four storeys over a tall ground floor, under a heavy cornice and a flat
 * roof; on the middle of every face a recessed portico of four huge engaged
 * Egyptian-revival columns (lotus capitals) two storeys and more tall under
 * a low pediment rising over the cornice; end pavilions with pilasters;
 * tiers of tall punched windows; the rounded corner at Canal and North
 * Peters; the dark slate roof of the Marble Hall rising in the middle of
 * the white roof, with its skylights and four small roof houses.
 *
 * Evidence
 * - OSM way/208520459 (building, 4 levels, NRHP 74000938, NHL): the plan,
 *   with the projecting central and end pavilions on every face and the
 *   rounded corner; the central pavilions are drawn as recessed porticos
 *   (columns on the outline, the wall behind on the main wall line).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame. Ground 0.5 (Canal/Decatur) to 1.5
 *   (North Peters). Cornice/parapet 24.3 all round; the roof inside falls
 *   to 22.4-23.4; the Marble Hall roof a gable along x from x = -22 to 18.5,
 *   y = -11 to 19, ridge 28.8 at y = 4; pediments 25.8-26.1 at the Canal
 *   and Decatur centres; roof houses 27.4-29.9.
 * - Terrain (Mapterhorn): about 1 m of fall from North Peters to Decatur.
 *   elevation 0.
 * - NAIP 2021 (USGS, public domain): the white roof, the dark Marble Hall
 *   roof with its two rows of skylights, the roof houses.
 * - Photos (all evidence):
 *   - "United States Custom House - New Orleans (55151935019).jpg",
 *     ajay_suresh, CC BY 4.0: the Canal front face on (storeys, bays,
 *     pavilions, the four columns and the pediment)
 *     https://commons.wikimedia.org/wiki/File:United_States_Custom_House_-_New_Orleans_(55151935019).jpg
 *   - "U.S. Custom House in New Orleans, Louisiana LCCN2013634398.tif" and
 *     "...LCCN2013634399.tif", Carol M. Highsmith, public domain: the Canal
 *     front
 *     https://commons.wikimedia.org/wiki/File:U.S._Custom_House_in_New_Orleans,_Louisiana_LCCN2013634398.tif
 *   - "Aerial view of U.S. Custom House in New Orleans, Louisiana
 *     LCCN2013634401.tif", Carol M. Highsmith, public domain: the Canal
 *     front, the rounded corner, the roof, the Marble Hall roof and the
 *     roof houses
 *     https://commons.wikimedia.org/wiki/File:Aerial_view_of_U.S._Custom_House_in_New_Orleans,_Louisiana_LCCN2013634401.tif
 *   - "New Orleans, Louisiana views 16 - Custom House.jpg", Geraldshields11,
 *     CC BY-SA 4.0: a side face in shade, its portico, pediment and corner
 *     pavilion (the granite's colour out of the sun)
 *     https://commons.wikimedia.org/wiki/File:New_Orleans,_Louisiana_views_16_-_Custom_House.jpg
 *   - "United States Custom House - New Orleans (49635953362).jpg", Tony
 *     Webster, CC BY 2.0: the columns, capitals and windows close up
 *     https://commons.wikimedia.org/wiki/File:United_States_Custom_House_-_New_Orleans_(49635953362).jpg
 * - Published: Wikipedia "United States Custom House (New Orleans)":
 *   1848-81, granite, one of the largest buildings in the country when
 *   begun.
 *
 * Measured (lidar/OSM): plan, cornice 24.3, pediment apex 26.4, Marble
 * Hall roof, roof houses. Estimated from the Canal front photo scaled to the
 * 101 m front: the ground floor and belt course (0-7.2), the columns
 * (7.2-21.3, r 1.2, standing in a portico recessed 1.5-2 m behind the
 * wall), the entablature and a 2.2 m cornice projecting 1.1 m, the giant
 * pilasters of the end pavilions (2 m wide), the window tiers (arched
 * 1.4-5.4, then 7.8-11.6, 12.6-15.0, 16.8-19.8, two windows per bay), the
 * bay counts (five in each wing on Canal, end pavilions of three bays). The North Peters and
 * Iberville faces are not photographed face on and repeat the Canal
 * arrangement over their own pavilions from OSM.
 * Left out: the capitals' carving, the lettering, the lamps, the round
 * attic windows.
 *
 * Night: the windows glow. No floodlight attribute: it would push the file
 * past 250 KB, and the night photos show the building mostly dark.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, cornice, box, offset, save, type XY } from './atl-flatiron-building'
import { faceOf, fp, fprism, fpanel, farch, fblock, shaft, drum, qf, tf, type Face } from './nola-gallier-hall'

const granite = new Part(), trim = new Part(), win = new Part(), roof = new Part(), slate = new Part(), glass = new Part()

// The OSM ring (model frame, bearing 38.4) with the four central pavilions
// taken out: they are built below as recessed porticos.
const ring: XY[] = ([
  [-46.62, -44.37], [-46.57, -27.02], [-46.00, -27.01], [-45.94, -6.97],
  [-45.90, 8.43], [-45.84, 28.05], [-46.42, 28.03], [-46.68, 42.57], [-46.12, 42.59], [-46.21, 47.80],
  [-41.62, 47.87], [-41.63, 48.37], [-27.37, 48.60], [-27.37, 48.10], [-14.34, 48.30],
  [1.41, 48.56], [14.58, 48.77], [14.57, 49.35], [28.65, 49.57], [28.65, 48.99], [33.50, 49.07],
  [40.17, 24.44], [39.71, 24.32], [42.88, 12.58],
  [46.90, -2.25], [47.36, -2.12], [57.63, -40.08], [57.23, -41.25], [56.56, -42.37], [55.62, -43.17],
  [54.60, -43.88], [50.07, -43.90], [50.00, -44.38], [35.81, -44.42], [35.82, -44.08], [11.97, -44.16],
  [-3.38, -44.22], [-27.27, -44.30], [-27.27, -44.99], [-41.35, -45.05], [-41.36, -44.53], [-46.61, -44.55],
] as XY[]).reverse() // counter-clockwise

const TOP = 24.3, BELT = 7.2, COLTOP = 21.3


// ── the faces: main wall lines, corner to corner, outside on the right ──
type Side = { F: Face; pav: [number, number]; pavOut: number; ends: [number, number][]; wings: [number, number, number][] }
const proj = (F: Face, p: XY) => (p[0] - F.o[0]) * F.t[0] + (p[1] - F.o[1]) * F.t[1]
function side(a: XY, b: XY, pav: [XY, XY], pavOut: number, ends: [XY, XY][], wingBays: number): Side {
  const F = faceOf(a, b)
  const P: [number, number] = [proj(F, pav[0]), proj(F, pav[1])]
  const E = ends.map(([p, q]) => [proj(F, p), proj(F, q)] as [number, number])
  // wings: between the end pavilions and the central one
  const cuts = [0, ...E.flat(), ...P, F.L].sort((u, v) => u - v)
  const wings: [number, number, number][] = []
  for (let i = 0; i < cuts.length - 1; i++) {
    const s0 = cuts[i], s1 = cuts[i + 1]
    const inside = [...E, P].some(([u, v]) => s0 >= u - 0.01 && s1 <= v + 0.01)
    if (!inside && s1 - s0 > 3) wings.push([s0, s1, Math.max(1, Math.round((s1 - s0) / ((s1 - s0) > 12 ? 4.8 : 4.6)))])
  }
  void wingBays
  return { F, pav: P, pavOut, ends: E, wings }
}
const sides: Side[] = [
  // Canal Street (the front)
  side([-46.6, -44.45], [50.0, -44.2], [[-3.36, -44.2], [11.98, -44.2]], 2.0, [[[-41.35, -44.5], [-27.27, -44.5]], [[35.81, -44.4], [50.0, -44.4]]], 5),
  // North Peters Street (skewed)
  side([57.63, -40.08], [33.5, 49.07], [[46.9, -2.25], [42.88, 12.58]], 1.1, [[[57.63, -40.08], [53.0, -23.0]], [[40.17, 24.44], [33.5, 49.07]]], 5),
  // Iberville Street (the back)
  side([33.5, 49.07], [-46.21, 47.8], [[1.41, 48.56], [-14.34, 48.3]], 1.4, [[[28.65, 49.3], [14.57, 49.0]], [[-27.37, 48.4], [-41.62, 48.1]]], 5),
  // Decatur Street
  side([-46.21, 47.8], [-46.6, -44.45], [[-45.9, 8.43], [-45.94, -6.97]], 1.35, [[[-46.42, 42.57], [-46.42, 28.03]], [[-46.0, -27.01], [-46.0, -44.0]]], 5),
]

const tiers: [number, number][] = [[7.8, 11.6], [12.6, 15.0], [16.8, 19.8]]
const CR = 1.2 // the portico columns' radius
const recessOf = (D: number) => Math.max(1.5, 2 * CR + 0.05 - D + 0.4)
/** How far out of the face line the ring's wall stands at s (the end pavilions project). */
function wallD(F: Face, s: number) {
  const P = fp(F, s, 0, 0)
  let best = -1
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    // solve P + n*d = a + (b - a)*u
    const ex = b[0] - a[0], ey = b[1] - a[1], det = F.n[0] * -ey - F.n[1] * -ex
    if (Math.abs(det) < 1e-9) continue
    const rx = a[0] - P[0], ry = a[1] - P[1]
    const d = (rx * -ey - ry * -ex) / det, u = (F.n[0] * ry - F.n[1] * rx) / det
    if (u >= -1e-6 && u <= 1 + 1e-6 && d > -3 && d < 3) best = Math.max(best, d)
  }
  return best < -0.99 ? 0 : best
}
const W = 0.58 // half a window's width (two per bay)

// The recessed porticos: cut the ring back between the antae of each central pavilion.
for (const S of sides) {
  const F = S.F, [p0, p1] = [Math.min(...S.pav), Math.max(...S.pav)], dep = recessOf(S.pavOut)
  const a = p0 + 1.3, b = p1 - 1.3, m = (a + b) / 2, M = fp(F, m, 0, 0)
  let best = 0, bd = 1e9
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length], ex = B[0] - A[0], ey = B[1] - A[1], L2 = ex * ex + ey * ey
    const u = Math.max(0, Math.min(1, ((M[0] - A[0]) * ex + (M[1] - A[1]) * ey) / L2))
    const dd = Math.hypot(A[0] + ex * u - M[0], A[1] + ey * u - M[1])
    if (dd < bd) { bd = dd; best = i }
  }
  const da = wallD(F, a), db = wallD(F, b)
  const pts: XY[] = [fp(F, a, da, 0), fp(F, a, -dep, 0), fp(F, b, -dep, 0), fp(F, b, db, 0)].map((q) => [q[0], q[1]] as XY)
  ring.splice(best + 1, 0, ...pts)
}

// ── the block ──
prism(granite, ring, 0, TOP - 2.2, null, 0)
cornice(trim, ring, TOP - 2.2, 2.2, 1.1, roof)
// belt course over the ground floor
cornice(trim, ring, BELT - 0.6, 0.6, 0.25, null)

for (const S of sides) {
  const F = S.F
  // wings: punched windows in vertical rows, plain granite between
  for (const [s0, s1, n] of S.wings) {
    const step = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const s = s0 + step * (k + 0.5)
      const d = wallD(F, s) + 0.05
      farch(win, F, s, 1.9, 1.4, 5.4, d, 6)
      for (const [z0, z1] of tiers) for (const k of [-1, 1]) fpanel(win, F, s + k * 0.9 - W, s + k * 0.9 + W, z0, z1, d)
    }
  }
  // end pavilions: four pilasters, three bays
  for (const [u, v] of S.ends) {
    const a = Math.min(u, v), b = Math.max(u, v), w = (b - a) / 3
    for (let k = 0; k <= 3; k++) {
      const s = a + k * w
      const d0 = wallD(F, (a + b) / 2), s0 = Math.max(a, s - 1.0), s1 = Math.min(b, s + 1.0)
      fblock(trim, F, s0, s1, BELT, TOP - 3.2, d0 + 0.8) // a giant pilaster, lighter in the light as in the photo
      fblock(trim, F, s0 - 0.15, s1 + 0.15, TOP - 3.2, TOP - 2.2, d0 + 1.0) // its capital
    }
    for (let k = 0; k < 3; k++) {
      const s = a + w * (k + 0.5)
      const d = wallD(F, s) + 0.05
      farch(win, F, s, 1.9, 1.4, 5.4, d, 6)
      for (const [z0, z1] of tiers) for (const k of [-1, 1]) fpanel(win, F, s + k * 0.9 - W, s + k * 0.9 + W, z0, z1, d)
    }
  }
  // central pavilion: a recessed portico of four engaged lotus columns
  const [p0, p1] = [Math.min(...S.pav), Math.max(...S.pav)], D = S.pavOut, pw = p1 - p0, dep = recessOf(D)
  // ground storey and belt, out to the pavilion's front
  fblock(granite, F, p0, p1, 0, BELT, D, -dep - 0.05)
  fblock(trim, F, p0 - 0.1, p1 + 0.1, BELT - 0.6, BELT, D + 0.25)
  // the antae at each end, full height
  fblock(granite, F, p0, p0 + 1.3, BELT, COLTOP, D)
  fblock(granite, F, p1 - 1.3, p1, BELT, COLTOP, D)
  // columns, wider in the middle (the entrance bay)
  const cs = [0.17, 0.39, 0.61, 0.83].map((f) => p0 + pw * f)
  for (const s of cs) {
    const c = fp(F, s, D - CR - 0.05, 0)
    drum(trim, c[0], c[1], CR * 1.15, BELT, BELT + 0.6, 12, true)
    shaft(trim, c[0], c[1], CR, CR * 0.92, BELT + 0.6, COLTOP - 2.2, 12)
    // the lotus capital: a bell flaring out under the abacus
    const n = 12, r0 = CR * 0.92, r1 = CR * 1.4, z0 = COLTOP - 2.2, z1 = COLTOP - 0.4
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
      const P = (a: number, r: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      qf(trim, P(a0, r0, z0), P(a1, r0, z0), P(a1, r1, z1), P(a0, r1, z1), [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), -0.3])
    }
    box(trim, c[0] - CR * 1.45, c[0] + CR * 1.45, c[1] - CR * 1.45, c[1] + CR * 1.45, COLTOP - 0.4, COLTOP, trim, 0.1)
  }
  // the wall behind: windows between the columns
  for (let k = 0; k < 3; k++) {
    const s = (cs[k] + cs[k + 1]) / 2, hw = k === 1 ? 1.3 : 0.75
    for (const [z0, z1] of tiers) fpanel(win, F, s - hw, s + hw, z0, z1, -dep + 0.05)
  }
  for (const s of [p0 + pw * 0.5]) fpanel(win, F, s - 1.2, s + 1.2, 0.8, 5.0, D + 0.05) // the main doors
  for (const s of [cs[0], cs[3]]) fpanel(win, F, s - 0.8, s + 0.8, 1.4, 4.8, D + 0.05)
  // entablature across the portico
  fblock(granite, F, p0, p1, COLTOP, TOP - 2.2, D, -dep - 0.05)
  fprism(trim, F, [[p0 - 0.3, TOP - 2.2], [p1 + 0.3, TOP - 2.2], [p1 + 0.3, TOP], [p0 - 0.3, TOP]], -dep, D + 1.0, true)
  // the pediment over the cornice, its raking cornice proud
  const apex = 26.6
  // tympanum and raking cornice in front; the pediment's own low gable roof running back
  const pm = (p0 + p1) / 2, back = -5.0
  fprism(granite, F, [[p0 + 0.2, TOP], [p1 - 0.2, TOP], [pm, apex - 0.35]], back, D + 0.3)
  fprism(trim, F, [[p0 - 0.3, TOP], [p0 + 0.7, TOP], [pm, apex - 0.3], [p1 - 0.7, TOP], [p1 + 0.3, TOP], [pm, apex + 0.2]], D - 0.2, D + 0.7)
  qf(slate, fp(F, p0 - 0.3, D + 0.7, TOP + 0.01), fp(F, pm, D + 0.7, apex + 0.21), fp(F, pm, back, apex + 0.21), fp(F, p0 - 0.3, back, TOP + 0.01), [0, 0, 1])
  qf(slate, fp(F, p1 + 0.3, D + 0.7, TOP + 0.01), fp(F, pm, D + 0.7, apex + 0.21), fp(F, pm, back, apex + 0.21), fp(F, p1 + 0.3, back, TOP + 0.01), [0, 0, 1])
}

// ── the roof: the Marble Hall's slate gable and skylights, the roof houses ──
{
  const x0 = -22, x1 = 18.5, y0 = -11, y1 = 19, yr = 4, z0 = TOP, ze = 25.2, zr = 28.8
  box(trim, x0, x1, y0, y1, z0 - 0.5, ze, null, 0)
  qf(slate, [x0, y0, ze], [x1, y0, ze], [x1, yr, zr], [x0, yr, zr], [0, -1, 2])
  qf(slate, [x0, y1, ze], [x0, yr, zr], [x1, yr, zr], [x1, y1, ze], [0, 1, 2])
  tf(trim, [x0, y0, ze], [x0, yr, zr], [x0, y1, ze], [-1, 0, 0])
  tf(trim, [x1, y0, ze], [x1, y1, ze], [x1, yr, zr], [1, 0, 0])
  // two rows of skylights on each slope
  const sl = (zr - ze) / (yr - y0)
  for (const [ya, yb] of [[y0 + 2.5, y0 + 6.0], [yr + 3.5, yr + 7.0]] as [number, number][]) {
    for (let k = 0; k < 8; k++) {
      const xa = x0 + 3 + k * 4.6, xb = xa + 2.2
      const z = (y: number) => (y < yr ? ze + (y - y0) * sl : zr - (y - yr) * sl) + 0.08
      qf(glass, [xa, ya, z(ya)], [xb, ya, z(ya)], [xb, yb, z(yb)], [xa, yb, z(yb)], [0, ya < yr ? -1 : 1, 3])
    }
  }
  // roof houses (lidar 27.4-29.9), cream with low slate hips
  const house = (xa: number, xb: number, ya: number, yb: number, h: number) => {
    box(trim, xa, xb, ya, yb, TOP - 0.5, h - 1.4, null, 0.15)
    const cx = (xa + xb) / 2, cy = (ya + yb) / 2, o = 0.3
    const A: V3 = [xa - o, ya - o, h - 1.4], B: V3 = [xb + o, ya - o, h - 1.4], C: V3 = [xb + o, yb + o, h - 1.4], Dd: V3 = [xa - o, yb + o, h - 1.4]
    const along = xb - xa > yb - ya
    const r0: V3 = along ? [xa + (yb - ya) / 2, cy, h] : [cx, ya + (xb - xa) / 2, h]
    const r1: V3 = along ? [xb - (yb - ya) / 2, cy, h] : [cx, yb - (xb - xa) / 2, h]
    if (along) {
      qf(slate, A, B, r1, r0, [0, -1, 1]); qf(slate, C, Dd, r0, r1, [0, 1, 1]); tf(slate, Dd, A, r0, [-1, 0, 1]); tf(slate, B, C, r1, [1, 0, 1])
    } else {
      qf(slate, B, C, r1, r0, [1, 0, 1]); qf(slate, Dd, A, r0, r1, [-1, 0, 1]); tf(slate, A, B, r0, [0, -1, 1]); tf(slate, C, Dd, r1, [0, 1, 1])
    }
  }
  house(-21, -15, 27, 38, 29.6)
  house(16, 21, 37, 43, 27.6)
  house(-17, -11, -20, -13.5, 27.4)
  house(15, 21, -26, -15, 27.6)
}

await save('nola-us-custom-house', 'U.S. Custom House', [
  { part: granite, material: finish("custom-house-granite", 0xadafac) },
  { part: trim, material: finish("custom-house-trim", 0xd9d9d4) },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: roof, material: finish('roof-membrane', 0xd2d4d3) },
  { part: slate, material: finish('marble-hall-slate', 0xa3aaae) },
  { part: glass, material: { name: 'glass', color: 0xb4c4c8, roughness: 0.24 } },
], { bearing: 38.4, osm: 'way/208520459', height: 29.9 }, 6500)
