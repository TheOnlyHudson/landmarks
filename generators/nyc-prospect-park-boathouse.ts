/**
 * Prospect Park Boathouse (Audubon Center at the Boathouse), Brooklyn
 * (Helmle & Huberty, 1905; restored 1980s and 2002) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-prospect-park-boathouse.ts
 *
 * Frame: x across the building (toward 97.1°, the land side), y along it
 * (toward 7.1°, north-north-east), z up, metres. Placed at bearing 7.1°.
 * Anchor: the area centroid of OSM way/241846597 (-73.965281, 40.660823),
 * which the model replaces. The water (Lullwater) side is −x.
 *
 * Also exports small wall helpers (`wallFrame`, `archPanel`, `arcBand`,
 * `box`) used by the other Prospect Park Lullwater generators.
 *
 * Evidence
 * - OSM way/241846597 (ODbL): 12.1 m × 31.6 m rectangle (small 0.4 m jogs at
 *   the middle of each short end, ignored), height=11.4, main axis 7.1°.
 * - Published (Wikipedia "Prospect Park Boathouse"; NYC LPC designation
 *   1968): 1905, Beaux-Arts, white matte-glazed terracotta after
 *   Sansovino's Library in Venice; arcade on the Lullwater; upper terrace
 *   with balustrade; red tile hipped roof.
 * - Map terrain (Mapterhorn z15): ground under the footprint 1.0–1.4 m
 *   above the water's level; the floor is set 0.4 m over y = 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Rhododendrites, "Prospect Park boathouse (61446p).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_boathouse_(61446p).jpg
 *     (frontal from the west across the water: bay rhythm and heights);
 *   Ben Franske, "Prospect Park Boathouse.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Boathouse.jpg
 *     (from the north-west: arcade, north end, loggia and awning);
 *   Garry R. Osgood, "Prospect Park Boathouse and Lullwater.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Boathouse_and_Lullwater.jpg
 *     (from the north-east: north face, upper block over the east part);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 69.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_69.jpg
 *     (west side; arch count);
 *   Vevisuals, "The Prospect Park Boathouse.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Prospect_Park_Boathouse.jpg
 *     (dusk: the arcade and loggia lit).
 *
 * Estimated from the frontal photo scaled to OSM's 31.6 m length (≈25.5
 * px/m): nine equal arches at 2.82 m pitch, 2.0 m wide, crowns 4.6 m over
 * the floor, the north end bay wider (5 m) with its own arch; ground storey
 * 0.4–5.0 m, entablature and cornice to 5.9 m, terrace balustrade to 6.9 m;
 * upper block from 3.1 m off the north end to 5.5 m off the south end,
 * eaves 9.6 m, hipped roof ridge 11.4 m (OSM height); chimneys over the
 * hips. Upper block width (the east ~7 m of the 12 m depth) from the
 * Osgood photo; awning loggia over the west part of the terrace.
 *
 * Doubts: no licensed photo shows the east (East Drive) face or the south
 * face square on; the east face is drawn with plain rectangular windows per
 * bay and the south face mirrors the north. Lamp posts and the water-side
 * landing with its steps stand outside the outline and are left to the map.
 * The arch grilles are drawn as one lighter window panel each.
 */
import { Part, type V3 } from './mesh'
import { finishModel, chamferRect, prism, type XY } from './nyc-570-lexington'
import { PALETTE, finish } from './palette'

/** A local frame on a vertical wall: s along it, z up, d out of it. */
export function wallFrame(o: XY, u: XY) {
  const n: V3 = [u[1], -u[0], 0]
  const at = (s: number, z: number, d = 0): V3 => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z]
  return { n, at }
}

/** Triangle wound to face direction n. */
export function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
export const quadF = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { triN(p, a, b, c, n); triN(p, a, c, d, n) }

/** A flush round-headed panel on a wall: jambs from z0 to the springing, a semicircle of radius r. */
export function archPanel(p: Part, w: ReturnType<typeof wallFrame>, s: number, z0: number, spring: number, r: number, d = 0.05, seg = 10) {
  quadF(p, w.at(s - r, z0, d), w.at(s + r, z0, d), w.at(s + r, spring, d), w.at(s - r, spring, d), w.n)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    triN(p, w.at(s, spring, d), w.at(s + r * Math.cos(a0), spring + r * Math.sin(a0), d), w.at(s + r * Math.cos(a1), spring + r * Math.sin(a1), d), w.n)
  }
}

/** A semicircular band (archivolt) from radius r0 to r1, d proud, with its outer edge closed. */
export function arcBand(p: Part, w: ReturnType<typeof wallFrame>, s: number, spring: number, r0: number, r1: number, d = 0.1, seg = 10) {
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    const P = (r: number, a: number, dd: number) => w.at(s + r * Math.cos(a), spring + r * Math.sin(a), dd)
    quadF(p, P(r0, a0, d), P(r1, a0, d), P(r1, a1, d), P(r0, a1, d), w.n)
    const mid = (a0 + a1) / 2, out: V3 = [Math.cos(mid) * w.at(1, 0)[0] - Math.cos(mid) * w.at(0, 0)[0], Math.cos(mid) * w.at(1, 0)[1] - Math.cos(mid) * w.at(0, 0)[1], Math.sin(mid)]
    quadF(p, P(r1, a0, 0), P(r1, a1, 0), P(r1, a1, d), P(r1, a0, d), out)
    const inn: V3 = [-out[0], -out[1], -out[2]]
    quadF(p, P(r0, a0, 0), P(r0, a1, 0), P(r0, a1, d), P(r0, a0, d), inn)
  }
}

/** An axis-aligned box (bottom face omitted unless asked). */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  quadF(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1), [0, -1, 0])
  quadF(p, c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1), [1, 0, 0])
  quadF(p, c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1), [0, 1, 0])
  quadF(p, c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1), [-1, 0, 0])
  quadF(p, c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1), [0, 0, 1])
  if (bottom) quadF(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y1, z0), c(x0, y1, z0), [0, 0, -1])
}

function build() {
  const wall = new Part(), trim = new Part(), win = new Part(), grille = new Part(), roof = new Part(), awning = new Part()

  const X0 = -6.05, X1 = 6.05, Y0 = -15.6, Y1 = 15.6
  const FLOOR = 0.4, EAVE1 = 5.0, CORN = 5.9, BAL = 6.9

  // Plinth and ground storey of glazed terracotta.
  prism({ wall: trim, win: null, roof: trim, ring: chamferRect(X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1 + 0.15, 0), z0: 0, z1: FLOOR, facade: null, bevel: 0.1 })
  prism({ wall, win: null, roof: null, ring: chamferRect(X0, Y0, X1, Y1, 0), z0: FLOOR, z1: EAVE1, facade: null, bevel: 0.3 })
  // Entablature and the projecting cornice, then the terrace floor.
  prism({ wall: trim, win: null, roof: null, ring: chamferRect(X0 + 0.02, Y0 + 0.02, X1 - 0.02, Y1 - 0.02, 0), z0: EAVE1, z1: 5.55, facade: null, bevel: 0.3 })
  prism({ wall: trim, win: null, roof: trim, ring: chamferRect(X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3, 0), z0: 5.55, z1: CORN, facade: null, bevel: 0.15 })
  {
    // underside of the cornice overhang
    const o: XY[] = [[X0 - 0.3, Y0 - 0.3], [X1 + 0.3, Y0 - 0.3], [X1 + 0.3, Y1 + 0.3], [X0 - 0.3, Y1 + 0.3]]
    for (let i = 0; i < 4; i++) {
      const a = o[i], b = o[(i + 1) % 4], ia: XY = [Math.sign(a[0]) * 6.03, Math.sign(a[1]) * 15.58], ib: XY = [Math.sign(b[0]) * 6.03, Math.sign(b[1]) * 15.58]
      quadF(trim, [a[0], a[1], 5.55], [b[0], b[1], 5.55], [ib[0], ib[1], 5.55], [ia[0], ia[1], 5.55], [0, 0, -1])
    }
  }

  // The balustrade round the terrace, with piers at the corners and over the columns.
  const BT = 0.32, bx0 = X0 - 0.15, bx1 = X1 + 0.15, by0 = Y0 - 0.15, by1 = Y1 + 0.15
  box(trim, bx0, by0, bx0 + BT, by1, CORN, BAL - 0.15)
  box(trim, bx1 - BT, by0, bx1, by1, CORN, BAL - 0.15)
  box(trim, bx0 + BT, by0, bx1 - BT, by0 + BT, CORN, BAL - 0.15)
  box(trim, bx0 + BT, by1 - BT, bx1 - BT, by1, CORN, BAL - 0.15)
  // the balusters' shadowed gaps: a recessed darker band is too fine; a top rail reads instead
  box(trim, bx0 - 0.05, by0 - 0.05, bx0 + BT + 0.05, by1 + 0.05, BAL - 0.15, BAL)
  box(trim, bx1 - BT - 0.05, by0 - 0.05, bx1 + 0.05, by1 + 0.05, BAL - 0.15, BAL)
  box(trim, bx0 + BT + 0.05, by0 - 0.05, bx1 - BT - 0.05, by0 + BT + 0.05, BAL - 0.15, BAL)
  box(trim, bx0 + BT + 0.05, by1 - BT - 0.05, bx1 - BT - 0.05, by1 + 0.05, BAL - 0.15, BAL)

  // West (Lullwater) arcade: nine arches at 2.82 m pitch and the north end bay's arch.
  const west = wallFrame([X0, Y1], [0, -1]) // s runs north → south along the west face
  const PITCH = 2.82, R = 1.0, SPRING = 3.6
  const arches: number[] = [2.85] // the north end bay
  for (let k = 0; k < 9; k++) arches.push(6.3 + k * PITCH)
  const piers: number[] = []
  for (let k = 0; k < 10; k++) piers.push(6.3 - PITCH / 2 + k * PITCH)
  piers.push(0.55, 5.0)
  for (const s of arches) {
    const r = s < 4 ? 0.85 : R
    archPanel(grille, west, s, FLOOR + 0.25, SPRING + (R - r) - 0.25, r, 0.04)
    archPanel(win, west, s, SPRING + (R - r) - 0.25, SPRING + (R - r), r - 0.12, 0.06)
    arcBand(trim, west, s, SPRING + (R - r), r + 0.02, r + 0.32, 0.1)
    // impost blocks
    for (const sg of [-1, 1]) box(trim, X0 - 0.12, Y1 - s - sg * (r + 0.2) - 0.2, X0, Y1 - s - sg * (r + 0.2) + 0.2, SPRING + (R - r) - 0.25, SPRING + (R - r))
  }
  // Engaged columns between the arches: a bold pier strip each, with base and capital.
  for (const s of piers) {
    const y = Y1 - s
    box(trim, X0 - 0.3, y - 0.32, X0, y + 0.32, FLOOR, EAVE1 - 0.05)
    box(trim, X0 - 0.38, y - 0.4, X0, y + 0.4, FLOOR, FLOOR + 0.35)
    box(trim, X0 - 0.4, y - 0.42, X0, y + 0.42, EAVE1 - 0.35, EAVE1)
  }
  // End faces (north photographed, south mirrored): one arch toward the water, a window inland.
  for (const sg of [-1, 1]) {
    const f = sg > 0 ? wallFrame([X1, Y1], [-1, 0]) : wallFrame([X0, Y0], [1, 0]) // s from east (north face) / from west (south face)
    const fw = (sw: number) => (sg > 0 ? 12.1 - sw : sw) // a distance from the west corner
    const sArch = fw(4.6), sWin = fw(9.0)
    archPanel(grille, f, sArch, FLOOR + 0.25, SPRING - 0.25, R, 0.04)
    archPanel(win, f, sArch, SPRING - 0.25, SPRING, R - 0.12, 0.06)
    arcBand(trim, f, sArch, SPRING, R + 0.02, R + 0.32, 0.1)
    quadF(win, f.at(sWin - 0.75, 1.5, 0.05), f.at(sWin + 0.75, 1.5, 0.05), f.at(sWin + 0.75, 4.0, 0.05), f.at(sWin - 0.75, 4.0, 0.05), f.n)
    for (const sw of [1.6, 7.0, 11.0]) {
      const s = fw(sw), p0 = f.at(s - 0.32, 0, 0), p1 = f.at(s + 0.32, 0, 0.3)
      box(wall, Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1]), FLOOR, EAVE1 - 0.05)
    }
  }
  // East (land) face: rectangular windows per bay, an arched entrance in the middle.
  const east = wallFrame([X1, Y0], [0, 1])
  for (let k = 0; k < 10; k++) {
    const s = 2.2 + k * 3.0
    if (k === 4 || k === 5) continue
    quadF(win, east.at(s - 0.7, 1.5, 0.05), east.at(s + 0.7, 1.5, 0.05), east.at(s + 0.7, 4.0, 0.05), east.at(s - 0.7, 4.0, 0.05), east.n)
  }
  archPanel(grille, east, 15.6, FLOOR + 0.1, SPRING, 1.2, 0.04)
  arcBand(trim, east, 15.6, SPRING, 1.22, 1.55, 0.1)

  // Upper block: the east part of the terrace, short of both ends; windows and doors on all faces.
  const U = { x0: -1.6, x1: 5.6, y0: -10.1, y1: 12.5 }, EAVE2 = 9.6, RIDGE = 11.4
  prism({ wall, win: null, roof: null, ring: chamferRect(U.x0, U.y0, U.x1, U.y1, 0), z0: CORN, z1: EAVE2, facade: null, bevel: 0.25 })
  prism({ wall: trim, win: null, roof: null, ring: chamferRect(U.x0 - 0.05, U.y0 - 0.05, U.x1 + 0.05, U.y1 + 0.05, 0), z0: EAVE2 - 0.45, z1: EAVE2, facade: null, bevel: 0.1 })
  const uw = wallFrame([U.x0, U.y1], [0, -1]), ue = wallFrame([U.x1, U.y0], [0, 1])
  const ulen = U.y1 - U.y0
  for (let k = 0; k < 10; k++) {
    const s = (ulen / 10) * (k + 0.5)
    quadF(win, uw.at(s - 0.6, CORN + 0.2, 0.05), uw.at(s + 0.6, CORN + 0.2, 0.05), uw.at(s + 0.6, 8.8, 0.05), uw.at(s - 0.6, 8.8, 0.05), uw.n)
    if (k < 8) quadF(win, ue.at((ulen / 8) * (k + 0.5) - 0.6, 6.6, 0.05), ue.at((ulen / 8) * (k + 0.5) + 0.6, 6.6, 0.05), ue.at((ulen / 8) * (k + 0.5) + 0.6, 8.6, 0.05), ue.at((ulen / 8) * (k + 0.5) - 0.6, 8.6, 0.05), ue.n)
  }
  for (const [o, u] of [[[U.x1, U.y1], [-1, 0]], [[U.x0, U.y0], [1, 0]]] as [XY, XY][]) {
    const f = wallFrame(o, u)
    for (const s of [2.0, 5.2]) quadF(win, f.at(s - 0.6, 6.6, 0.05), f.at(s + 0.6, 6.6, 0.05), f.at(s + 0.6, 8.6, 0.05), f.at(s - 0.6, 8.6, 0.05), f.n)
  }
  // Hipped red tile roof with a 0.5 m overhang.
  {
    const o = 0.5, a: XY = [U.x0 - o, U.y0 - o], b: XY = [U.x1 + o, U.y0 - o], c: XY = [U.x1 + o, U.y1 + o], d: XY = [U.x0 - o, U.y1 + o]
    const hw = (U.x1 - U.x0) / 2 + o, cx = (U.x0 + U.x1) / 2
    const r0: V3 = [cx, a[1] + hw, RIDGE], r1: V3 = [cx, c[1] - hw, RIDGE]
    const A: V3 = [a[0], a[1], EAVE2], B: V3 = [b[0], b[1], EAVE2], C: V3 = [c[0], c[1], EAVE2], D: V3 = [d[0], d[1], EAVE2]
    triN(roof, A, B, r0, [0, -1, 1])
    quadF(roof, B, C, r1, r0, [1, 0, 1])
    triN(roof, C, D, r1, [0, 1, 1])
    quadF(roof, D, A, r0, r1, [-1, 0, 1])
    quadF(trim, A, B, C, D, [0, 0, -1])
    // Chimneys near the hips.
    for (const y of [10.9, -7.4]) box(trim, cx - 0.45, y - 0.6, cx + 0.45, y + 0.6, 10.2, 12.3)
  }

  // The loggia's striped awning over the west terrace, on slender posts.
  const AW = { x0: -5.4, y0: U.y0 + 0.4, y1: U.y1 - 0.4 }
  const zIn = 9.1, zOut = 8.6
  const pA: V3 = [AW.x0, AW.y0, zOut], pB: V3 = [U.x0, AW.y0, zIn], pC: V3 = [U.x0, AW.y1, zIn], pD: V3 = [AW.x0, AW.y1, zOut]
  quadF(awning, pA, pB, pC, pD, [0.3, 0, 1])
  quadF(awning, pA, pD, pC, pB, [-0.3, 0, -1])
  // its valance
  quadF(awning, [AW.x0, AW.y0, zOut - 0.45], [AW.x0, AW.y1, zOut - 0.45], [AW.x0, AW.y1, zOut], [AW.x0, AW.y0, zOut], [-1, 0, 0])
  quadF(awning, [AW.x0, AW.y0, zOut - 0.45], [AW.x0, AW.y0, zOut], [AW.x0, AW.y1, zOut], [AW.x0, AW.y1, zOut - 0.45], [1, 0, 0])
  for (let k = 0; k <= 6; k++) {
    const y = AW.y0 + 0.2 + ((AW.y1 - AW.y0 - 0.4) * k) / 6
    box(awning, AW.x0 + 0.05, y - 0.09, AW.x0 + 0.23, y + 0.09, CORN, zOut - 0.4)
  }

  finishModel('Prospect Park Boathouse', 'nyc-prospect-park-boathouse', [
    { part: wall, material: finish('glazed-terracotta', 0xe4dccb) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: grille, material: { name: 'window-2', color: 0xb3bcbd, roughness: 0.5 } },
    { part: roof, material: finish('red-tile', 0xc0614a) },
    { part: awning, material: finish('awning', 0xcfd9cc) },
  ], { bearing: 7.1, osm: 'way/241846597', height: 12.3 })
}

if (import.meta.main) build()
