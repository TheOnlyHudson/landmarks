/**
 * Cathedral Basilica of the Assumption, 1140 Madison Avenue, Covington,
 * Kentucky (1894–1915, Leon Coquard; French Gothic after Notre-Dame de
 * Paris and Saint-Denis) — original procedural geometry, CC0-1.0.
 * bun generators/cin-cathedral-basilica-assumption.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest ground.
 * Bearing 258.8: +y points west along the church's axis to the front on
 * Madison Avenue; +x is north. Anchor = centroid of OSM way/123059448,
 * -84.508248, 39.078195. The axis runs at x = 2.8 in this frame.
 *
 * Identity (from the photos below):
 *  1. The west front: one broad flat-topped block, the twin towers left
 *     unfinished at the height of Notre-Dame's tower bases, split by four
 *     buttresses into three bays: three pointed portals, an arcaded gallery
 *     band, the rose window in the middle bay and paired lancets in the
 *     side bays, then an open arcaded top stage and a balustrade. The
 *     middle bay's top stage is a screen: lidar shows the roof between the
 *     towers about 7 m lower behind it.
 *  2. The long nave and choir under a red tile roof, aisles with big
 *     traceried windows, flying buttresses on pinnacled piers.
 *  3. The transepts: the north one a huge traceried window under a gable
 *     between two pinnacles; the south one a rose window.
 *  4. Grey-white Bedford limestone throughout.
 *
 * Plan: OSM way/123059448 and its parts read in the turned frame: front
 * block x -12.2..17.8, y 20.4..31.3, buttresses to y 32.3; nave x
 * -3.1..8.5; aisles to x -8.9 and 13.6 with piers at y 6, 10, 14, 18;
 * transept x -11.5..16.4, y -8.3..1.9; apse to y -23.9; low sacristy and
 * chapel blocks round the east end (x -24.5..17.8, y -26.4..-8.3).
 *
 * Heights: USGS 3DEP lidar KY_FullState (KyFromAbove statewide lidar;
 * tile flight year not reported by the service, flown 2019–2022), 1 m
 * grid read in this frame; y = 0 is Madison Avenue in front (ground_min
 * + 1.0). Measured: front block top 35.4, balustrade 36.5; the roof
 * between the towers behind the screen 28.1; nave ridge 33.2, eaves about
 * 26; transept ridge about 32; aisles 15.5; chapels and sacristies round
 * the east end 12.5–15.5. Published: none used for heights. Estimated
 * from the photos: every opening, the gallery band, the rose (r 3.6), the
 * buttresses' setbacks, pinnacle heights.
 *
 * Ground: Mapterhorn is within 1 m across the site; elevation 0.
 *
 * Night: the windows (rose, lancets, gallery) glow; the stone is not
 * floodlit in the model.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - St. Mary's Cathedral Basilica of the Assumption in Covington, KY.JPG,
 *    Poghia, public domain (the west front, straight on)
 *    https://commons.wikimedia.org/wiki/File:St._Mary%27s_Cathedral_Basilica_of_the_Assumption_in_Covington,_KY.JPG
 *  - St. Mary's Cathedral Basilica of the Assumption (Covington, Kentucky),
 *    exterior, north.jpg, Nheyob (changes by Rabanus Flavus), CC BY-SA 4.0
 *    (the whole north side: tower, nave, transept, apse buttresses)
 *    https://commons.wikimedia.org/wiki/File:St._Mary%27s_Cathedral_Basilica_of_the_Assumption_(Covington,_Kentucky),_exterior,_north.jpg
 *  - St. Mary - Covington 04.jpg, Farragutful, CC BY-SA 4.0 (from the
 *    south-west: the front and the south transept's rose)
 *    https://commons.wikimedia.org/wiki/File:St._Mary_-_Covington_04.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east end is not photographed; the low blocks round it are
 * plain boxes at lidar height. The south transept below the rose is
 * hidden by the annex. Statues, crockets, gargoyles and the open tracery
 * of the gables are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, gableRoof, onWall, pyramid, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { faces, type Face } from './cin-city-hall'
import { lancet } from './cin-old-st-marys'

const stone = new Part(), trim = new Part(), roofT = new Part(), win = new Part(), dark = new Part(), flat = new Part()

const CX = 2.8
/** Position along face f of the world point p. */
const S = (f: Face, p: XY) => {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  return ((p[0] - f[0][0]) * (f[1][0] - f[0][0]) + (p[1] - f[0][1]) * (f[1][1] - f[0][1])) / L
}
/** The along-face coordinate of world x (or y) on an axis-aligned face. */
const sOn = (f: Face, c: number) => (f[0][1] === f[1][1] ? S(f, [c, f[0][1]]) : S(f, [f[0][0], c]))
/** A block standing d proud of face f, from s0 to s1 along it. */
function proud(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number, bev = 0.15, top: Part | null = p) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, o: number): XY => [f[0][0] + t[0] * s + n[0] * o, f[0][1] + t[1] * s + n[1] * o]
  const a = P(s0, -0.05), b = P(s1, d)
  box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, top, bev)
}
const circle = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
/** A bar from (s0,z0) to (s1,z1), w wide, as a wall shape. */
function bar(s0: number, z0: number, s1: number, z1: number, w: number): [number, number][] {
  const l = Math.hypot(s1 - s0, z1 - z0), ns = (-(z1 - z0) / l) * w / 2, nz = ((s1 - s0) / l) * w / 2
  return [[s0 + ns, z0 + nz], [s0 - ns, z0 - nz], [s1 - ns, z1 - nz], [s1 + ns, z1 + nz]]
}
/** A traceried pointed window: a trim surround, the glass, mullions and a transom. */
function gothic(f: Face, s: number, w: number, z0: number, zs: number, lights = 2, surround = 0.35) {
  onWall(trim, f[0], f[1], lancet(s, w + 2 * surround, z0 - 0.2, zs, 4), 0.04)
  onWall(win, f[0], f[1], lancet(s, w, z0, zs, 4), 0.08)
  for (let k = 1; k < lights; k++) {
    const m = s - w / 2 + (w * k) / lights
    onWall(trim, f[0], f[1], rectShape(m - 0.09, m + 0.09, z0, zs + 0.35 * w), 0.11)
  }
  if (lights > 1 && zs - z0 > 6) onWall(trim, f[0], f[1], rectShape(s - w / 2, s + w / 2, (z0 + zs) / 2 - 0.09, (z0 + zs) / 2 + 0.09), 0.11)
}
/** A rose window: surround, glass, a hub and spokes. */
function rose(f: Face, s: number, z: number, r: number, spokes = 12) {
  onWall(trim, f[0], f[1], circle(s, z, r + 0.7, 20), 0.05)
  onWall(win, f[0], f[1], circle(s, z, r, 20), 0.09)
  onWall(trim, f[0], f[1], circle(s, z, r * 0.28, 10), 0.13)
  for (let k = 0; k < spokes; k++) {
    const a = (k / spokes) * Math.PI * 2
    onWall(trim, f[0], f[1], bar(s + r * 0.28 * Math.cos(a), z + r * 0.28 * Math.sin(a), s + r * Math.cos(a), z + r * Math.sin(a), 0.2), 0.12)
  }
}
/** A slender square pinnacle: shaft and spirelet. */
function pinnacle(c: XY, h: number, z0: number, z1: number, tip: number) {
  box(stone, c[0] - h, c[0] + h, c[1] - h, c[1] + h, z0, z1, trim, 0.1)
  pyramid(trim, c, h * 0.9, z1, tip)
}
/** A parapet ring (balustrade) round a rectangle, t thick. */
function parapet(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, t = 0.35) {
  box(trim, x0, x1, y0, y0 + t, z0, z1, trim, 0.08)
  box(trim, x0, x1, y1 - t, y1, z0, z1, trim, 0.08)
  box(trim, x0, x0 + t, y0 + t, y1 - t, z0, z1, trim, 0.08)
  box(trim, x1 - t, x1, y0 + t, y1 - t, z0, z1, trim, 0.08)
}
/** A flying buttress: a sloping slab from a pier top (a) to the wall (b), w wide. */
function flyer(a: V3, b: V3, w: number, th = 0.7) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), px = (-dy / l) * w / 2, py = (dx / l) * w / 2
  const sec = (q: V3): V3[] => [[q[0] + px, q[1] + py, q[2]], [q[0] + px, q[1] + py, q[2] - th], [q[0] - px, q[1] - py, q[2] - th], [q[0] - px, q[1] - py, q[2]]]
  stone.sweep([sec(a), sec(b)])
}

// ───────────────────────────── the west front ─────────────────────────────
const FY0 = 20.6, FY1 = 31.3, FX0 = -12.2, FX1 = 17.8
const TOP = 35.4, BAL = 36.5, MIDTOP = 28.1
const TS: [number, number] = [-12.2, -2.3], TN: [number, number] = [7.9, 17.8] // tower spans in x
{
  // the two towers and the lower block between them, with the screen in front
  box(stone, TS[0], TS[1], FY0, FY1, 0, TOP, flat, 0.25)
  box(stone, TN[0], TN[1], FY0, FY1, 0, TOP, flat, 0.25)
  box(stone, TS[1] - 0.1, TN[0] + 0.1, FY0, FY1 - 1.6, 0, MIDTOP, flat, 0.2)
  box(stone, TS[1] - 0.1, TN[0] + 0.1, FY1 - 1.6, FY1, 0, TOP, flat, 0.2)
  for (const t of [TS, TN]) parapet(t[0] + 0.1, t[1] - 0.1, FY0 + 0.1, FY1 - 0.1, TOP, BAL)
  box(trim, TS[1], TN[0], FY1 - 0.45, FY1 - 0.05, TOP, BAL, trim, 0.08)

  const F: Face = [[FX1, FY1], [FX0, FY1]] // the west face, s = 17.8 - x
  // buttresses: corners and either side of the middle bay, stepping back
  for (const [x0, x1] of [[-12.2, -10.2], [-4.3, -2.3], [7.9, 9.9], [15.8, 17.8]]) {
    const s0 = sOn(F, x1), s1 = sOn(F, x0)
    proud(stone, F, s0, s1, 0, 12.5, 1.0)
    proud(stone, F, s0 + 0.1, s1 - 0.1, 12.5, 26.5, 0.7)
    proud(stone, F, s0 + 0.2, s1 - 0.2, 26.5, TOP, 0.45)
    pinnacle([(x0 + x1) / 2, FY1 + 0.2], 0.45, BAL, BAL + 0.6, BAL + 1.8)
  }
  // granite base course
  proud(trim, F, 0, 30, 0, 1.2, 0.25, 0.08)
  // portals: the middle one larger, all pointed, with doors and tympana
  for (const [x, w, apex] of [[CX, 7.4, 13.2], [-7.25, 4.8, 11.0], [12.85, 4.8, 11.0]] as [number, number, number][]) {
    const s = sOn(F, x), zs = apex - w * 0.866
    onWall(trim, F[0], F[1], lancet(s, w, 1.2, zs, 5), 0.06)
    onWall(stone, F[0], F[1], lancet(s, w * 0.72, 1.2, zs + 0.2, 5), 0.1)
    onWall(dark, F[0], F[1], rectShape(s - w * 0.3, s + w * 0.3, 1.2, zs - 0.6), 0.14)
  }
  // the gallery band: an arcade across each bay with a balustrade over it
  for (const [x0, x1] of [[-10.2, -4.3], [-2.3, 7.9], [9.9, 15.8]]) {
    const s0 = sOn(F, x1) + 0.3, s1 = sOn(F, x0) - 0.3, n = Math.round((s1 - s0) / 1.25)
    onWall(win, F[0], F[1], rectShape(s0, s1, 14.2, 17.0), 0.06)
    for (let k = 0; k <= n; k++) onWall(trim, F[0], F[1], rectShape(s0 + ((s1 - s0) * k) / n - 0.12, s0 + ((s1 - s0) * k) / n + 0.12, 14.2, 17.4), 0.1)
  }
  proud(trim, F, -0.05, 30.05, 13.6, 14.2, 0.5, 0.1)
  proud(trim, F, -0.05, 30.05, 17.4, 18.4, 0.75, 0.12)
  // the rose in the middle bay
  rose(F, sOn(F, CX), 22.0, 3.6)
  // side bays: paired lancets under a pointed arch, an oculus in its head
  for (const x of [-7.25, 12.85]) {
    const s = sOn(F, x)
    onWall(trim, F[0], F[1], lancet(s, 4.6, 18.4, 23.8, 5), 0.04)
    for (const d of [-1.05, 1.05]) onWall(win, F[0], F[1], lancet(s + d, 1.5, 19.0, 23.4, 4), 0.08)
    onWall(win, F[0], F[1], circle(s, 25.5, 0.55, 10), 0.08)
  }
  // cornice under the top stage
  proud(trim, F, -0.05, 30.05, 26.5, 27.3, 0.6, 0.12)
  // the open top stage: tall lancets, three to a tower and five across the middle
  for (const [x0, x1, n] of [[-10.2, -4.3, 3], [-2.3, 7.9, 5], [9.9, 15.8, 3]] as [number, number, number][]) {
    const s0 = sOn(F, x1), s1 = sOn(F, x0), p = (s1 - s0) / n
    for (let k = 0; k < n; k++) onWall(dark, F[0], F[1], lancet(s0 + p * (k + 0.5), p * 0.66, 27.7, 33.3 - p * 0.57, 4), 0.06)
  }
  proud(trim, F, -0.05, 30.05, 33.7, TOP, 0.4, 0.12)

  // the towers' other faces
  for (const t of [TS, TN]) {
    const f = faces(t[0], t[1], FY0, FY1)
    const side = t === TN ? f.E : f.W // the outer face (north or south)
    const sides = [side, f.S]
    // outer face: two tall lancets low, paired lancets in an arch, the top stage
    const L = FY1 - FY0
    for (const s of [0, L]) proud(stone, side, s - (s ? 1.6 : 0), s + (s ? 0 : 1.6), 0, TOP, 0.6)
    for (const s of [L * 0.36, L * 0.64]) gothic(side, s, 1.7, 3.0, 10.5, 2, 0.25)
    onWall(trim, side[0], side[1], lancet(L / 2, 4.6, 16.6, 22.0, 5), 0.04)
    for (const d of [-1.05, 1.05]) onWall(win, side[0], side[1], lancet(L / 2 + d, 1.5, 17.2, 21.6, 4), 0.08)
    onWall(win, side[0], side[1], circle(L / 2, 23.8, 0.55, 10), 0.08)
    proud(trim, side, 0, L, 26.5, 27.3, 0.5, 0.1)
    proud(trim, side, 0, L, 33.7, TOP, 0.35, 0.1)
    for (const fc of sides) {
      const l = Math.hypot(fc[1][0] - fc[0][0], fc[1][1] - fc[0][1]), p = (l - 2.4) / 3
      for (let k = 0; k < 3; k++) onWall(dark, fc[0], fc[1], lancet(1.2 + p * (k + 0.5), p * 0.66, 27.7, 33.3 - p * 0.57, 4), 0.06)
    }
    // the inner faces above the middle block's roof
    const inner = t === TN ? f.W : f.E
    const ls = FY1 - 1.6 - FY0
    for (let k = 0; k < 2; k++) onWall(dark, inner[0], inner[1], lancet(sOn(inner, FY0 + ls * (k + 0.5) / 2), 1.6, 29.0, 31.8, 4), 0.06)
  }
  // back of the screen over the middle block
  {
    const f: Face = [[TS[1], FY1 - 1.6], [TN[0], FY1 - 1.6]]
    const l = TN[0] - TS[1], p = l / 5
    for (let k = 0; k < 5; k++) onWall(dark, f[0], f[1], lancet(p * (k + 0.5), p * 0.66, 28.6, 33.3 - p * 0.57, 4), 0.06)
  }
}

// ──────────────────────────────── the church ───────────────────────────────
const NX0 = -3.1, NX1 = 8.7, EAVE = 26.0, RIDGE = 33.2
const AISLE = 15.5
const NY0 = -19.1 // choir's east end, where the apse begins
{
  // nave and choir walls, the red tile roof
  box(stone, NX0, NX1, NY0, FY0 + 0.3, 0, EAVE, null, 0)
  gableRoof(roofT, stone, NX0, NX1, NY0 - 0.2, FY0, EAVE, RIDGE, 'y', 0.5, 0)
  box(trim, NX0 - 0.3, NX1 + 0.3, NY0, FY0, EAVE - 0.7, EAVE, null, 0.1)
  // apse: a half-octagon on the choir, its roof a half-pyramid to the ridge
  const AC: XY = [CX, NY0], AR = (NX1 - NX0) / 2
  const ap: XY[] = []
  for (let i = 0; i <= 4; i++) { const a = Math.PI + (i / 4) * Math.PI; ap.push([AC[0] + AR * Math.cos(a), AC[1] + AR * 0.8 * Math.sin(a)]) }
  for (let i = 0; i < 4; i++) {
    const a = ap[i], b = ap[i + 1]
    stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE], [a[0], a[1], EAVE])
    roofT.tri([a[0], a[1], EAVE - 0.3], [b[0], b[1], EAVE - 0.3], [AC[0], AC[1], RIDGE])
    const f: Face = [a, b], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    gothic(f, l / 2, 1.9, 15.4, 22.6, 2, 0.25)
  }
  // clerestory windows: nave bays between the piers, choir bays
  const sideN: Face = [[NX1, -30], [NX1, 40]], sideS: Face = [[NX0, 40], [NX0, -30]]
  for (const y of [4.1, 8.0, 12.0, 16.0, -10.8, -15.5]) for (const f of [sideN, sideS]) gothic(f, sOn(f, y), 2.3, 17.6, 23.0, 2, 0.3)

  // aisles with lean-to tile roofs and big two-light windows
  for (const [xo, xi] of [[13.6, NX1], [-8.9, NX0]]) {
    const x0 = Math.min(xo, xi), x1 = Math.max(xo, xi)
    box(stone, x0, x1, 1.9, FY0, 0, AISLE, null, 0)
    const lo = AISLE, hi = AISLE + 2.0
    if (xo > 0) roofT.quad([xo, 1.9, lo], [xo, FY0, lo], [xi, FY0, hi], [xi, 1.9, hi])
    else roofT.quad([xi, 1.9, hi], [xi, FY0, hi], [xo, FY0, lo], [xo, 1.9, lo])
    const f: Face = xo > 0 ? [[xo, -30], [xo, 40]] : [[xo, 40], [xo, -30]]
    for (const y of [4.1, 8.0, 12.0, 16.0]) gothic(f, sOn(f, y), 2.4, 2.6, 11.4, 2, 0.3)
    // piers with pinnacles, flying buttresses to the clerestory
    for (const y of [6.0, 10.0, 14.0, 18.0]) {
      const xp = xo > 0 ? xo - 0.4 : xo + 0.4
      box(stone, xp - 0.9, xp + 0.9, y - 0.5, y + 0.5, 0, 20.5, trim, 0.15)
      pyramid(trim, [xp, y], 0.55, 20.5, 23.0)
      const xw = xi + (xo > 0 ? 0.2 : -0.2)
      flyer([xp, y, 20.2], [xw, y, 23.6], 0.6)
    }
  }

  // transepts: gabled arms, the north with its great window, the south with a rose
  const TY0 = -8.3, TY1 = 1.9, TRIDGE = 32.2
  box(stone, -11.5, 16.4, TY0, TY1, 0, EAVE, null, 0)
  gableRoof(roofT, stone, -11.5, 16.4, TY0, TY1, EAVE, TRIDGE, 'x', 0.4, 0.3)
  box(trim, -11.8, 16.7, TY0 - 0.3, TY1 + 0.3, EAVE - 0.7, EAVE, null, 0.1)
  const tf = faces(-11.5, 16.4, TY0, TY1)
  // north transept front
  {
    const f = tf.E, l = TY1 - TY0
    gothic(f, l / 2, 6.8, 3.0, 19.2, 4, 0.4)
    onWall(trim, f[0], f[1], rectShape(l / 2 - 3.4, l / 2 + 3.4, 11.0, 11.25), 0.12)
    onWall(trim, f[0], f[1], lancet(l / 2, 4.0, EAVE + 0.4, EAVE + 1.0, 4), 0.06)
    for (const y of [TY0, TY1]) pinnacle([16.6, y], 0.75, 0, 31.0, 35.2)
  }
  // south transept: the rose over the annex
  {
    const f = tf.W, l = TY1 - TY0
    rose(f, l / 2, 21.6, 3.3, 10)
    for (const y of [TY0, TY1]) pinnacle([-11.7, y], 0.75, 0, 31.0, 35.2)
  }
  // transept side windows over the aisle and chapel roofs
  for (const [x0, x1] of [[NX1, 16.4], [-11.5, NX0]]) {
    const m = (x0 + x1) / 2
    for (const f of [tf.N, tf.S]) gothic(f, sOn(f, m), 2.4, 17.4, 23.0, 2, 0.3)
  }

  // the low ranges round the east end: chapels, ambulatory, sacristy
  box(stone, 8.3, 17.8, -13.2, -8.3, 0, 15.5, flat, 0.3)
  box(stone, -11.5, NX0, -13.2, -8.3, 0, 15.5, flat, 0.3)
  box(stone, -11.5, 17.8, -26.4, -13.2, 0, 13.0, flat, 0.3)
  box(stone, -24.5, -11.5, -26.3, -8.4, 0, 14.5, flat, 0.3)
  box(stone, -16.1, -11.5, -8.4, 1.8, 0, 16.0, flat, 0.3)
  for (const [x0, x1, y0, y1, z] of [[8.3, 17.8, -13.2, -8.3, 15.5], [-11.5, NX0, -13.2, -8.3, 15.5], [-11.5, 17.8, -26.4, -13.2, 13.0], [-24.5, -11.5, -26.3, -8.4, 14.5], [-16.1, -11.5, -8.4, 1.8, 16.0]] as [number, number, number, number, number][]) {
    parapet(x0, x1, y0, y1, z, z + 0.7, 0.3)
    const fc = faces(x0, x1, y0, y1)
    for (const f of [fc.S, fc.N, fc.E, fc.W]) {
      const l = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), n = Math.floor(l / 4.5)
      for (let k = 0; k < n; k++) {
        const s = (l * (k + 0.5)) / n, mid: XY = [f[0][0] + (f[1][0] - f[0][0]) * s / l, f[0][1] + (f[1][1] - f[0][1]) * s / l]
        // skip windows hidden against the church or other blocks
        if (mid[0] > NX0 - 0.1 && mid[0] < NX1 + 0.1 && mid[1] > -26) continue
        if (Math.abs(mid[1] - (-8.3)) < 0.2 && mid[0] > -11.6) continue
        if (Math.abs(mid[0] - (-11.5)) < 0.1 && mid[1] > -26.3 && mid[1] < 1.8) continue
        if (Math.abs(mid[1] - (-13.2)) < 0.1) continue
        if (Math.abs(mid[1] - (-8.4)) < 0.2) continue
        onWall(win, f[0], f[1], lancet(s, 1.6, 3.0, z - 4.5, 4), 0.06)
      }
    }
  }
  // the small entry porches on the south side (OSM parts, 1 to 1.5 storeys)
  box(stone, -17.7, -14.2, -0.3, 3.4, 0, 5.0, flat, 0.25)
  box(stone, -14.2, -11.5, 1.8, 5.3, 0, 4.0, flat, 0.25)
  // flying buttresses round the apse from the ambulatory roof
  for (let i = 0; i <= 4; i++) {
    const a = Math.PI + (i / 4) * Math.PI, d: XY = [Math.cos(a), Math.sin(a)]
    const pr: XY = [AC[0] + d[0] * (AR + 3.0), AC[1] + d[1] * (AR + 3.0) * 0.72]
    box(stone, pr[0] - 0.6, pr[0] + 0.6, pr[1] - 0.6, pr[1] + 0.6, 12.5, 19.5, trim, 0.12)
    pyramid(trim, pr, 0.45, 19.5, 21.8)
    flyer([pr[0], pr[1], 19.2], [AC[0] + d[0] * (AR + 0.1), AC[1] + d[1] * (AR + 0.1) * 0.8, 23.4], 0.55)
  }
  // a cross on the apse roof and a ridge cresting is too fine; a flèche is not on this church
  void revolve
  void archShape
}

await save('cin-cathedral-basilica-assumption', 'Cathedral Basilica of the Assumption', [
  { part: stone, material: finish('cin-limestone', 0xe4e0d6) },
  { part: trim, material: finish('cin-limestone-trim', 0xf1eee6) },
  { part: roofT, material: finish('cin-red-tile', 0xc0674c) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('cin-shadow', 0x5b5d61) },
  { part: flat, material: PALETTE.roof },
], { height: BAL + 1.8, anchor: [39.078195, -84.508248], bearing: 258.8 }, 6500)
