/**
 * Denver City and County Building (1932, Allied Architects Association;
 * Neoclassical, Colorado granite) — original procedural geometry, CC0-1.0.
 * bun generators/den-city-and-county-building.ts
 *
 * Also holds the small Civic Center kit (arc points, free-standing and
 * engaged columns) that den-greek-theater, den-voorhies-memorial and
 * den-mcnichols-building import; this file's own build is behind
 * `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint (the west side, on Cherokee Street), at the centroid
 * of OSM's outline. Bearing 0: OSM's walls run north–south and east–west.
 *
 * Identity (from the photos below):
 *  1. A long concave front: two quarter-circle wings sweep out from a
 *     central temple front toward Civic Center Park and the Capitol, each
 *     with a giant order of engaged columns over a plain ground storey, an
 *     entablature, an attic and a balustrade.      (hart, south, se, moore)
 *  2. The central portico: six giant Corinthian columns, two deep at the
 *     sides, under a low pediment, up a broad flight of steps.  (south, se)
 *  3. The clock tower rising from the pediment's roof: a square base with
 *     corner urns, a round colonnade of Corinthian columns, a round clock
 *     stage, a small dome and the gilded eagle.     (habscupola, moore)
 *  4. Square end pavilions at the wing tips, with two columns in antis on
 *     their east faces, and low grey metal hip roofs.     (habselev, lund)
 *  5. Pale grey granite throughout; dark bronze windows and doors.
 *
 * Plan: OSM relation/4661432 (outer way/34009683), moved into this frame,
 * made symmetric about y = -0.3 (OSM's halves differ by under 0.8 m). The
 * wings' front is a circle fitted to OSM's arc (centre 38.43 m east and
 * 10.78 m off the axis, radius 32.06; residuals under 0.15 m). The two round
 * light wells (way/332075351, way/332075352) are left out: they are hidden
 * behind the roof from the street.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py; ground_min 1594.7 m; y = 0 here is 0.7 m above
 * it (the ground along the west front); the park side is 1.5 m higher.
 * Measured (model metres): wings' balustrade 22.3 and their low hip roofs
 * to 24.9; the central block's gable eave 24.9 and ridge 28.9, running the
 * whole depth of the building; the tower's square base 34.9 (urns 36.7),
 * the colonnade's cornice 47.8 (radius about 4.7), the clock stage 53.4
 * (radius about 2.7), the eagle's top 58.8. Portico floor 4.7, steps down to
 * the park at 1.5. OSM's height tags (15.5 m wings, 41 m tower) are well
 * under the lidar's and were not used.
 *
 * Estimated: the wings' storey bands (ground storey to 6.3, giant columns
 * to 18.2, entablature to 19.8, attic to 21.4) from the "south" photo
 * scaled to the lidar balustrade; the bay rhythm (11 bays to each arc)
 * from "south" and "hart"; the portico's column spacing (4.3 m) and size
 * (radius 0.85, drawn 0.95 with 16 sides so they hold at phone size) from
 * "south"; the wall behind them a darker granite, the portico's shade; the tower's stage heights between the lidar's
 * steps from "habscupola"; the end pavilions' faces from "habselev".
 * The west (back) side is unphotographed: it is drawn with the same storey
 * bands and plain bays, no columns. Left out: the balustrade's balusters,
 * the clock faces, the urns along the steps, the flagpoles, the light wells.
 *
 * Photos (evidence, Wikimedia Commons unless noted):
 *  hart       "Denver City and County Building (54940359241).jpg", Daniel
 *             Hartwig, CC BY 4.0 (east front, square on)
 *  moore      "City County Building Denver Colorado 2024.jpg", Larry D.
 *             Moore, CC BY 4.0 (portico and tower from the south-east)
 *  south      "Denver City Council building. View from south.jpg", Sarbjit
 *             Bahga, CC BY-SA 4.0 (in fact the east front, square on)
 *  se         "Denver City Council building. View from south-east.jpg",
 *             Sarbjit Bahga, CC BY-SA 4.0 (east front from the south-east)
 *  habselev   "Elevated view of City Hall - City and County Building, Civic
 *             Center, Denver, Denver County, CO HABS COLO,16-DENV,7-8.tif",
 *             HABS, public domain (from the north-east, above)
 *  habscupola "Cupola - City and County Building, ... HABS COLO,16-DENV,7-10
 *             .tif", HABS, public domain (the tower)
 *  lund       "Denver City and County Building from Colorado State Capitol"
 *             (Flickr 68184846), Ken Lund, CC BY-SA 2.0 (east, from afar)
 *  daderot24  "City and County Building - Civic Center Park, Denver -
 *             DSC01224.jpg", Daderot, CC0 (east, from the park)
 * No look-only sources. No commercial imagery.
 *
 * Night ("Denver City and County Building cupola at night.JPG", Jeffrey
 * Beall, CC BY 4.0): the tower is floodlit (in that photo in seasonal
 * colours; drawn warm white here), the rest of the building much less; the
 * portico gets a little more than the wings. Windows and doors are
 * `window`; the eagle is gilded and floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, band, box, ccw, cornice, gableRoof, onWall, prism, rectShape, revolve, save, wall, type XY } from './atl-tech-tower'
import { at, capPoly, column, offset, smoothWall } from './atl-flatiron-building'

// ───────────────────────────── Civic Center kit ─────────────────────────────

/** Points on a circle about c of radius r, from angle a0 to a1 (degrees) in n steps. */
export function arcPts(c: XY, r: number, a0: number, a1: number, n: number): XY[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
}

/**
 * A free-standing round column: square plinth, shaft, and a square capital
 * block (read as a Corinthian or Ionic capital at map distance).
 */
export function freeColumn(p: Part, c: XY, r: number, z0: number, z1: number, n = 10, cap = 1.25) {
  const pl = r * 1.2, ch = Math.max(0.35, r * 0.9), k = r * cap
  box(p, c[0] - pl, c[0] + pl, c[1] - pl, c[1] + pl, z0, z0 + r * 0.6, p, 0)
  column(p, c, r, z0 + r * 0.6, z1 - ch, n)
  box(p, c[0] - k, c[0] + k, c[1] - k, c[1] + k, z1 - ch, z1, p, 0)
}

/** A beam between two points: `w` wide across, `h` deep below the line (raking cornices). */
export function beam(p: Part, a: V3, b: V3, w: number, h: number) {
  const d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]) || 1, s = [(-d[1] / l) * (w / 2), (d[0] / l) * (w / 2)]
  const C = (q: V3, ss: number, dz: number): V3 => [q[0] + s[0] * ss, q[1] + s[1] * ss, q[2] + dz]
  const v = [C(a, -1, -h), C(a, 1, -h), C(a, 1, 0), C(a, -1, 0), C(b, -1, -h), C(b, 1, -h), C(b, 1, 0), C(b, -1, 0)]
  const mid: V3 = [0, 1, 2].map((k) => v.reduce((t, q) => t + q[k], 0) / 8) as V3
  for (const f of [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]) {
    const [A, B, Cc, D] = f.map((i) => v[i])
    const nrm = [(B[1] - A[1]) * (Cc[2] - A[2]) - (B[2] - A[2]) * (Cc[1] - A[1]), (B[2] - A[2]) * (Cc[0] - A[0]) - (B[0] - A[0]) * (Cc[2] - A[2]), (B[0] - A[0]) * (Cc[1] - A[1]) - (B[1] - A[1]) * (Cc[0] - A[0])]
    const out = [(A[0] + Cc[0]) / 2 - mid[0], (A[1] + Cc[1]) / 2 - mid[1], (A[2] + Cc[2]) / 2 - mid[2]]
    if (nrm[0] * out[0] + nrm[1] * out[1] + nrm[2] * out[2] >= 0) p.quad(A, B, Cc, D)
    else p.quad(A, D, Cc, B)
  }
}

/**
 * An engaged column on a wall from a to b (outside to the right), at s along
 * it: a shaft standing `r * 0.45` proud of the wall, with a capital block.
 */
export function engagedColumn(p: Part, a: XY, b: XY, s: number, r: number, z0: number, z1: number, n = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const c: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
  const ch = Math.max(0.4, r * 0.9)
  // the outer half of the shaft only; the rest is inside the wall
  const a0 = Math.atan2(-t[1], -t[0])
  const half: XY[] = Array.from({ length: n / 2 + 1 }, (_, i) => [c[0] + r * Math.cos(a0 + (i / (n / 2)) * Math.PI), c[1] + r * Math.sin(a0 + (i / (n / 2)) * Math.PI)] as XY)
  smoothWall(p, half, z0, z1 - ch, false)
  const P = (u: number, v: number): XY => [c[0] + t[0] * u + nn[0] * v, c[1] + t[1] * u + nn[1] * v]
  const k = r * 1.3
  prism(p, ccw([P(-k, 0), P(k, 0), P(k, k), P(-k, k)]), z1 - ch, z1, p, 0)
}

// ─────────────────────────────── the building ───────────────────────────────

if (import.meta.main) {
  const granite = new Part(), roof = new Part(), win = new Part(), gold = new Part(), shade = new Part()

  const YM = -0.3 // the axis of symmetry
  const mir = (pts: XY[]): XY[] => pts.map(([x, y]) => [x, 2 * YM - y] as XY).reverse()
  const north = (pts: XY[]): XY[] => pts.map(([x, y]) => [x, YM + y] as XY)

  // Storey levels (model metres; the park side's ground is 1.5).
  const BELT = 6.3, CAP = 18.2, ENT = 19.8, ATTIC = 21.4, BAL = 22.3, ROOFTOP = 24.9
  const EAVE = 24.9, RIDGE = 28.9

  // The north wing's front arc, from the portico (west end of the arc) to
  // the end pavilion: 11 bays, one chord each.
  const AC: XY = [38.43, 10.78], AR = 32.06
  const a0 = (Math.atan2(12.3 - AC[1], 6.41 - AC[0]) * 180) / Math.PI // ≈177°
  const arcN = north(arcPts(AC, AR, a0, 90, 11)) // from the portico end clockwise toward the top
  // North half of the outline, counter-clockwise from the front axis.
  const halfN: XY[] = [
    [6.41, YM],
    ...arcN,
    [45.2, YM + 42.85], [45.2, YM + 62.6], [41.1, YM + 62.6], [41.1, YM + 66.1],
    [-37.3, YM + 66.1], [-37.3, YM + 46.0], [-22.0, YM + 46.0], [-22.0, YM + 12.3],
    [-40.8, YM + 12.3],
  ]
  // arcN runs north-east from the portico: the outline's counter-clockwise
  // direction, with the outside (the park) to its right.
  const body = ccw([...halfN.slice(1), ...mir(halfN.slice(1))])

  // ── Massing: the wings and pavilions to the attic, the balustrade ──
  prism(granite, body, 0, ATTIC, roof, 0.05)
  // the balustrade, drawn solid, a little in from the attic face
  const balR = offset(body, -0.25)
  wall(granite, balR, ATTIC, BAL)
  granite.loft([at(body, ATTIC), at(balR, ATTIC)])
  const balIn = offset(body, -0.75)
  granite.loft([at(balR, BAL), at(balIn, BAL)])
  // the belt over the ground storey and the main cornice
  band(granite, body, BELT - 0.5, 0.5, 0.15, null)
  cornice(granite, body, CAP + 0.6, ENT - CAP - 0.6, 0.55, granite)

  // ── Low hip roofs behind the balustrade (grey metal) ──
  const rHalf: XY[] = [[6.41, YM + 12.3], ...arcN.slice(1), [41.1, YM + 42.85], [41.1, YM + 65.6], [-36.8, YM + 65.6], [-36.8, YM + 45.5], [-21.5, YM + 45.5], [-21.5, YM + 12.3]]
  const rRing = ccw([...rHalf, ...mir(rHalf)])
  const rIn = offset(rRing, -0.6), rTop = offset(rRing, -6.2)
  roof.loft([at(rIn, BAL - 0.6), at(rTop, ROOFTOP)])
  capPoly(roof, rTop, ROOFTOP, true)

  // ── The central block: walls to the eave, gable roof from the back wall
  // over the portico; pediments both ends ──
  const W = 12.3, PX = 14.5 // half-width; the pediment's front
  box(granite, -40.8, 6.41, YM - W, YM + W, ATTIC, EAVE - 2.4, granite, 0.1)
  // the entablature, carried out over the portico
  box(granite, -40.8, PX, YM - W - 0.2, YM + W + 0.2, EAVE - 2.4, EAVE, null, 0.1, true)
  cornice(granite, ccw([[-40.8, YM - W - 0.2], [PX, YM - W - 0.2], [PX, YM + W + 0.2], [-40.8, YM + W + 0.2]]), EAVE - 0.8, 0.8, 0.45, null)
  gableRoof(roof, granite, -40.8, PX, YM - W - 0.2, YM + W + 0.2, EAVE, RIDGE, 'x', 0.5, 0.5)
  // raking cornices: bold beams along both pediments' slopes, so the
  // pediment reads against the tower behind it
  for (const x of [PX + 0.35, -41.15]) {
    for (const side of [-1, 1]) beam(granite, [x, YM + side * (W + 0.9), EAVE + 0.1], [x, YM, RIDGE + 0.35], 1.4, 0.75)
  }
  // ── The portico: podium, six columns in front, two more at each side ──
  box(granite, 6.41, PX, YM - W, YM + W, 0, 4.7, granite, 0.15)
  for (const dy of [-10.75, -6.45, -2.15, 2.15, 6.45, 10.75]) freeColumn(granite, [13.4, YM + dy], 0.95, 4.7, EAVE - 2.4, 16, 1.3)
  for (const dy of [-10.75, 10.75]) freeColumn(granite, [9.4, YM + dy], 0.95, 4.7, EAVE - 2.4, 16, 1.3)
  // the portico's back wall in shadow, so the columns stand out against it
  onWall(shade, [6.41, YM - W], [6.41, YM + W], rectShape(0, 2 * W, 4.7, EAVE - 2.4), 0.02)
  // the recessed front wall: three bronze doors with windows over them, a
  // row of grilles under the entablature
  const fa: XY = [6.41, YM - W], fb: XY = [6.41, YM + W]
  for (const s of [W - 4.3, W, W + 4.3]) {
    const w = s === W ? 2.4 : 1.8
    onWall(win, fa, fb, rectShape(s - w / 2, s + w / 2, 4.7, s === W ? 12.5 : 8.2), 0.05)
    onWall(win, fa, fb, rectShape(s - 1.3, s + 1.3, 17.6, 20.6), 0.05)
  }
  for (const s of [W - 8.6, W + 8.6]) onWall(win, fa, fb, rectShape(s - 1.1, s + 1.1, 10.5, 14.5), 0.05)

  // ── Steps from the portico down to the park ──
  const n = 6
  for (let i = 0; i < n; i++) {
    const x0 = PX + (13.3 * i) / n, h = 4.7 - (3.0 * i) / n
    box(granite, x0, 27.8, YM - W + 1.6, YM + W - 1.6, 0, h, granite, 0.1)
  }
  for (const side of [-1, 1]) {
    // cheek blocks and the low side flights
    const y0 = YM + side * (W - 1.6), y1 = YM + side * (W + 0.3)
    box(granite, PX, 23.5, Math.min(y0, y1), Math.max(y0, y1), 0, 5.4, granite, 0.15)
    const z0 = YM + side * W, z1 = YM + side * 17.2
    box(granite, 19.2, 27.8, Math.min(z0, z1), Math.max(z0, z1), 0, 2.0, granite, 0.1)
  }

  // ── Facades ──
  // Rows: ground storey, two floors in the giant order, the attic.
  const ROWS: [number, number][] = [[2.6, 5.2], [7.4, 11.4], [12.8, 16.6], [20.0, 21.0]]
  const bayWindows = (a: XY, b: XY, s: number, w: number, rows = ROWS) => {
    for (const [z0, z1] of rows) onWall(win, a, b, rectShape(s - w / 2, s + w / 2, z0, z1), 0.05)
  }
  for (const half of [arcN, mir(arcN)]) {
    // the arc's chords run toward the outside on the right only for the north
    // half's order; mirror() reverses the south half so both run CCW.
    for (let i = 0; i < half.length - 1; i++) {
      const a = half[i], b = half[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      bayWindows(a, b, L / 2, 1.9)
      engagedColumn(granite, a, b, 0, 0.68, BELT, CAP)
      if (i === half.length - 2) engagedColumn(granite, a, b, L, 0.68, BELT, CAP)
    }
  }
  // the end pavilions' east faces: two columns in antis, a big arched window
  // between them, a window in each outer bay
  for (const [a, b] of [[[45.2, YM + 42.85], [45.2, YM + 62.6]], [[45.2, YM - 62.6], [45.2, YM - 42.85]]] as [XY, XY][]) {
    const L = 19.75
    engagedColumn(granite, a, b, L / 2 - 2.6, 0.68, BELT, CAP)
    engagedColumn(granite, a, b, L / 2 + 2.6, 0.68, BELT, CAP)
    onWall(win, a, b, archShape(L / 2, 3, 7.4, 14.6, 8), 0.05)
    onWall(win, a, b, rectShape(L / 2 - 1.2, L / 2 + 1.2, 2.6, 5.2), 0.05)
    for (const s of [3.2, L - 3.2]) bayWindows(a, b, s, 1.9)
    onWall(win, a, b, rectShape(L / 2 - 1, L / 2 + 1, 20, 21), 0.05)
  }
  // every other wall: plain bays of about 4.4 m
  const isArc = (a: XY) => arcN.some((q) => Math.hypot(q[0] - a[0], q[1] - a[1]) < 0.01) || mir(arcN).some((q) => Math.hypot(q[0] - a[0], q[1] - a[1]) < 0.01)
  for (let i = 0; i < body.length; i++) {
    const a = body[i], b = body[(i + 1) % body.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3 || (isArc(a) && isArc(b))) continue
    if (Math.abs(a[0] - 45.2) < 0.01 && Math.abs(b[0] - 45.2) < 0.01) continue
    if (Math.abs(a[0] - 6.41) < 0.01 && Math.abs(b[0] - 6.41) < 0.01) continue
    const k = Math.max(1, Math.round((L - 2) / 4.4))
    for (let j = 0; j < k; j++) bayWindows(a, b, 1 + ((j + 0.5) * (L - 2)) / k, 1.8)
  }
  // ── The clock tower ──
  const TC: XY = [-10.5, YM]
  // a chamfered square (the lidar's outline at 34–37 m), the chamfers 2.8 m
  const H = 6.3, CH = 2.8
  const oct: XY[] = ccw([[H, -H + CH], [H, H - CH], [H - CH, H], [-H + CH, H], [-H, H - CH], [-H, -H + CH], [-H + CH, -H], [H - CH, -H]].map(([x, y]) => [TC[0] + x, TC[1] + y] as XY))
  prism(granite, oct, EAVE, 33.6, granite, 0.1)
  cornice(granite, oct, 33.6, 1.3, 0.35, granite)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c: XY = [TC[0] + sx * 4.4, TC[1] + sy * 4.4]
    revolve(granite, c, [[0.55, 34.9], [0.7, 35.6], [0.45, 36.3], [0, 36.7]], 8, Math.PI / 8, false, true)
  }
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 5) for (const s of [L / 2 - 1.8, L / 2, L / 2 + 1.8]) onWall(win, a, b, rectShape(s - 0.55, s + 0.55, 29.6, 32.4), 0.05)
  }
  // round podium, colonnade round a core, entablature
  revolve(granite, TC, [[5.0, 34.9], [5.0, 36.0], [4.6, 36.6]], 16, 0, false, false)
  revolve(granite, TC, [[3.3, 36.6], [3.3, 46.2]], 12, 0, true, false)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    freeColumn(granite, [TC[0] + 4.25 * Math.cos(a), TC[1] + 4.25 * Math.sin(a)], 0.42, 36.6, 46.2, 8, 1.4)
    // the openings between the columns: tall grilles on the core
    const b = (i / 8) * Math.PI * 2
    const p0: XY = [TC[0] + 3.3 * Math.cos(b - 0.22), TC[1] + 3.3 * Math.sin(b - 0.22)], p1: XY = [TC[0] + 3.3 * Math.cos(b + 0.22), TC[1] + 3.3 * Math.sin(b + 0.22)]
    onWall(win, p0, p1, rectShape(0, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), 38, 44.6), 0.08)
  }
  revolve(granite, TC, [[4.6, 46.2], [4.75, 46.9], [5.15, 47.5], [5.15, 47.8], [2.8, 47.8]], 16, 0, false, false)
  // clock stage, its cornice, the small dome, lantern and eagle
  revolve(granite, TC, [[2.8, 47.8], [2.8, 52.4], [3.15, 52.9], [3.15, 53.4], [2.6, 53.4], [2.4, 54.4], [1.8, 55.2], [0.9, 55.7]], 16, 0, false, false)
  revolve(gold, TC, [[0.9, 55.7], [0.9, 56.8], [0.5, 56.9]], 8, 0, false, true)
  // the eagle: a body and spread wings, bold enough to read as a gold point
  revolve(gold, TC, [[0.45, 56.9], [0.55, 57.6], [0.35, 58.3], [0, 58.8]], 6, 0, true, false)
  for (const s of [-1, 1]) {
    const w: V3[] = [[TC[0], TC[1] + s * 0.2, 57.3], [TC[0], TC[1] + s * 1.3, 58.6], [TC[0], TC[1] + s * 0.9, 57.6]]
    gold.tri(w[0], w[1], w[2]); gold.tri(w[0], w[2], w[1])
  }

  // Floodlit at night: the portico and the tower strongest, the wings softly.
  await save('den-city-and-county-building', 'Denver City and County Building', [
    { part: granite, material: { ...finish('ccb-granite', 0xdcdad2), floodlight: (p, nn) => (nn[2] > 0.8 ? 0.1 : p[2] > 26 ? 1 : p[0] > 0 && Math.abs(p[1] - YM) < 14 ? 0.6 : 0.15) } },
    { part: roof, material: finish('ccb-roof', 0xd4d6d4) },
    { part: shade, material: finish('ccb-portico-shade', 0xaaa79f) },
  { part: win, material: PALETTE.window },
    { part: gold, material: { ...finish('ccb-gold', 0xd9b866, 0.45), floodlight: () => 1 } },
  ], { height: 58.8, anchor: [39.73924, -104.991018], bearing: 0 }, 6500)
}
