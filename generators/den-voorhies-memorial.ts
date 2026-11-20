/**
 * Voorhies Memorial, Civic Center Park, Denver (1921, William E. and
 * Arthur A. Fisher; Beaux-Arts) — original procedural geometry, CC0-1.0.
 * bun generators/den-voorhies-memorial.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint, at the centroid of OSM's outline. Bearing 0: the
 * memorial is symmetric about a north–south axis at x = -0.3; its curved
 * colonnade bows north, its pool (not modelled) lies to the south.
 *
 * Identity (from the photos below):
 *  1. The central triumphal arch: a deep granite block with one round-
 *     headed arch on a pair of Ionic columns each side, a dentil cornice
 *     and a tall plain attic.                                (d186, arch)
 *  2. Two quarter-circle Ionic colonnades, two rows deep, under a plain
 *     entablature and a solid curved parapet on each face.   (d186, arch)
 *  3. Small open end pavilions, turned 45°, columns paired at the corners.
 *  4. Pale grey-white stone throughout.
 *
 * Plan: OSM way/316470152 and its parts (the 44 column parts, the arch's
 * piers way/655976750..753, its attic way/655976754). Fitted circles,
 * centred on the axis: the south (pool-side) row of columns 30.81 m south
 * of the anchor, radius 32.88; the north row 30.13 m south, radius 36.71;
 * the platform's edges 29.12 m south, radius 30.67 and 29.29 m south,
 * radius 36.52 (residuals under 0.4 m). Five columns a row a side; the end
 * pavilions' paired corner columns are OSM's, mirrored.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid;
 * ground_min 1596.19 m; y = 0 here is 0.5 m above it (the paving at the
 * west end). Measured: the colonnade's entablature 8.9 (lidar 9.4–9.6) and
 * its parapets 10.4 (lidar 10.7–11.0), the arch's attic parapet 14.0 (lidar
 * 14.5) over a lower roof at 12.6 (lidar 13.1). OSM's heights (columns to
 * 6 m, arch 10 m) are under the lidar's and were not used.
 * Estimated from "d186" scaled to the lidar (20 px a metre at the
 * colonnade): column tops 7.2, radius 0.42; the arch's opening 6.6 m wide,
 * springing at 7.4; its cornice 11.2–11.8.
 *
 * Photos (evidence, Wikimedia Commons):
 *  d186   "Voorhies Memorial - Civic Center Park, Denver - DSC01186.jpg",
 *         Daderot, CC0 (from the south-west, across the pool)
 *  arch   "Civic Center archway.jpg", Enderandpeter, CC BY-SA 3.0 (the arch
 *         from the south, square on)
 *  habsnorth "Looking north from Colonade of Civic Benefactors to Voorhies
 *         Memorial and Fountain ... HABS COLO,16-DENV,7-5.tif", HABS, public
 *         domain (from the Greek Theater's stage, far to the south)
 * No look-only sources. No commercial imagery.
 * Left out: the pool and its seal sculpture (water is the map's), the
 * wreath medallions, the inscriptions, the ceiling murals.
 *
 * Night: the arch and colonnade are floodlit softly.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, ccw, prism, save, type XY } from './atl-tech-tower'
import { arcPts, freeColumn } from './den-city-and-county-building'

const stone = new Part(), roof = new Part()
const AX = -0.3
const COL = 7.2, ENT = 8.9, PAR = 10.4

/** A triangle wound to face along n. */
function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

// Circles about the axis; angles in degrees from east.
type C = { cy: number; r: number }
const S_ROW: C = { cy: -30.81, r: 32.88 }, N_ROW: C = { cy: -30.13, r: 36.71 }
const S_EDGE: C = { cy: -29.12, r: 30.67 }, N_EDGE: C = { cy: -29.29, r: 36.52 }
const at = (c: C, deg: number, s = 1): XY => [AX + s * c.r * Math.cos((deg * Math.PI) / 180), c.cy + c.r * Math.sin((deg * Math.PI) / 180)]
const angX = (c: C, x: number) => (Math.acos(x / c.r) * 180) / Math.PI

// A band between the two edge circles (offset by dS outward of the south
// edge and dN inward of the north edge), from x = xa to xb on the east side.
function band(xa: number, xb: number, dS: number, dN: number, n: number, s: number): XY[] {
  const sC = { cy: S_EDGE.cy, r: S_EDGE.r + dS }, nC = { cy: N_EDGE.cy, r: N_EDGE.r - dN }
  const south = arcPts([0, 0], 1, angX(sC, xa), angX(sC, xb), n).map(([cx, cy]) => [AX + s * cx * sC.r, sC.cy + cy * sC.r] as XY)
  const north = arcPts([0, 0], 1, angX(nC, xb), angX(nC, xa), n).map(([cx, cy]) => [AX + s * cx * nC.r, nC.cy + cy * nC.r] as XY)
  return ccw([...south, ...north])
}

// ── The colonnades ──
for (const s of [1, -1]) {
  for (let k = 0; k < 3; k++) prism(stone, band(6.2 + (13 * k) / 3, 6.2 + (13 * (k + 1)) / 3, 0, 0, 3, s), 0, 0.35, stone, 0.05)
  for (const a of [77.7, 72.95, 68.5, 63.8, 59.25]) freeColumn(stone, at(S_ROW, a, s), 0.42, 0.35, COL, 8, 1.45)
  for (const a of [78.5, 73.3, 67.9, 62.5, 57.0]) freeColumn(stone, at(N_ROW, a, s), 0.42, 0.35, COL, 8, 1.45)
  prism(stone, band(6.0, 19.6, -0.3, -0.3, 10, s), COL, ENT, roof, 0.12)
  // dentil cornice line and the two parapets
  prism(stone, band(6.0, 19.6, -0.55, -0.55, 10, s), ENT - 0.55, ENT - 0.2, null, 0)
  prism(stone, band(6.0, 19.6, -0.3, 4.6, 10, s), ENT, PAR, stone, 0.12)
  prism(stone, band(6.0, 19.6, 4.6, -0.3, 10, s), ENT, PAR, stone, 0.12)
}

// ── The end pavilions: a square turned 45°, paired columns at the corners ──
for (const s of [1, -1]) {
  const c: XY = [AX + s * 22.9, -5.4], h = 3.0
  const sq = (d: number): XY[] => ccw([[c[0], c[1] - d * Math.SQRT2], [c[0] + d * Math.SQRT2, c[1]], [c[0], c[1] + d * Math.SQRT2], [c[0] - d * Math.SQRT2, c[1]]])
  prism(stone, sq(h + 0.4), 0, 0.35, stone, 0.05)
  const corners = sq(h - 0.3)
  for (let i = 0; i < 4; i++) {
    const p = corners[i], q = corners[(i + 1) % 4], r = corners[(i + 3) % 4]
    const toward = (t: XY, f: number): XY => [p[0] + (t[0] - p[0]) * f, p[1] + (t[1] - p[1]) * f]
    freeColumn(stone, toward(q, 0.16), 0.4, 0.35, COL, 8, 1.45)
    freeColumn(stone, toward(r, 0.16), 0.4, 0.35, COL, 8, 1.45)
  }
  prism(stone, sq(h), COL, ENT, roof, 0.12)
  prism(stone, sq(h + 0.25), ENT - 0.55, ENT - 0.2, null, 0)
  prism(stone, sq(h - 0.1), ENT, PAR, stone, 0.12)
}

// ── The arch ──
const Y0 = -0.2, Y1 = 7.1, PW = 6.15, OW = 3.3, SPR = 7.4, CORN = 11.2
box(stone, AX - PW, AX + PW, Y0, Y1, 0, 0.35, stone, 0.05)
for (const s of [-1, 1]) {
  const xa = AX + s * OW, xb = AX + s * PW
  box(stone, Math.min(xa, xb), Math.max(xa, xb), Y0, Y1, 0.35, CORN, null, 0)
  // a column each side of the opening on both faces, standing proud of the
  // piers, and one more inside the passage behind it
  for (const y of [Y0 - 0.45, Y1 + 0.45]) freeColumn(stone, [AX + s * (OW + 0.55), y], 0.42, 0.35, SPR, 8, 1.45)
  for (const y of [Y0 + 0.75, Y1 - 0.75]) freeColumn(stone, [AX + s * (OW - 0.05), y], 0.42, 0.35, SPR, 8, 1.45)
}
// the arch's spandrels on both faces and its soffit
const arc = arcPts([AX, SPR], OW, 0, 180, 10)
for (const [y, ny] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
  for (let i = 0; i < arc.length - 1; i++) {
    const a = arc[i], b = arc[i + 1], mx = (a[0] + b[0]) / 2
    const corner: V3 = [mx >= AX ? AX + OW : AX - OW, y, CORN]
    triN(stone, [a[0], y, a[1]], [b[0], y, b[1]], corner, [0, ny, 0])
  }
  triN(stone, [AX + OW, y, CORN], [AX - OW, y, CORN], [AX, y, SPR + OW], [0, ny, 0])
}
for (let i = 0; i < arc.length - 1; i++) {
  const a = arc[i], b = arc[i + 1], mx = (a[0] + b[0]) / 2 - AX, mz = (a[1] + b[1]) / 2 - SPR
  const n: V3 = [-mx, 0, -mz]
  triN(stone, [a[0], Y0, a[1]], [b[0], Y0, b[1]], [b[0], Y1, b[1]], n)
  triN(stone, [a[0], Y0, a[1]], [b[0], Y1, b[1]], [a[0], Y1, a[1]], n)
}
// cornice, attic with its parapet round a lower roof
box(stone, AX - PW - 0.35, AX + PW + 0.35, Y0 - 0.35, Y1 + 0.35, CORN, CORN + 0.6, null, 0.15, true)
box(stone, AX - PW, AX + PW, Y0, Y1, CORN + 0.6, 12.6, roof, 0.1)
const outer: XY[] = ccw([[AX - PW, Y0], [AX + PW, Y0], [AX + PW, Y1], [AX - PW, Y1]])
const inner: XY[] = ccw([[AX - PW + 0.7, Y0 + 0.7], [AX + PW - 0.7, Y0 + 0.7], [AX + PW - 0.7, Y1 - 0.7], [AX - PW + 0.7, Y1 - 0.7]])
for (let i = 0; i < 4; i++) {
  const a = outer[i], b = outer[(i + 1) % 4], c = inner[(i + 1) % 4], d = inner[i]
  prism(stone, ccw([a, b, c, d]), 12.6, 14.0, stone, 0.1)
}

await save('den-voorhies-memorial', 'Voorhies Memorial', [
  { part: stone, material: { ...finish('voorhies-stone', 0xe2dfd6), floodlight: (p, n) => (n[2] > 0.8 ? 0.1 : Math.abs(p[0] - AX) < 7 ? 0.8 : 0.45) } },
  { part: roof, material: finish('voorhies-roof', 0xc9c9c4) },
], { height: 14.0, anchor: [39.7403235, -104.9888463], bearing: 0 }, 5000)
