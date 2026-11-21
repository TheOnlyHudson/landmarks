/**
 * Cathedral Basilica of St. Peter in Chains, Eighth and Plum Streets,
 * Cincinnati (1845, Henry Walter, Greek Revival; enlarged 1957) —
 * original procedural geometry, CC0-1.0.
 * bun generators/cin-st-peter-in-chains.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 349.0, the street grid: the portico faces Plum
 * Street at +x (east), the nave runs west along -x, Eighth Street is on
 * the north (+y) side.
 * Anchor = centroid of OSM way/34230640, -84.519541, 39.103441.
 *
 * Identity (from the photos below):
 *  1. The tall white steeple: a square plinth over the portico, a tall
 *     chamfered stage with cross-shaped openings, a columned belfry with
 *     louvres, a smaller columned lantern, a drum, and a long octagonal
 *     spire with a cross.
 *  2. The hexastyle Corinthian portico, four columns deep, under a flat
 *     entablature and attic (no pediment), on a podium with steps.
 *  3. A plain white limestone temple body with tall gridded stone window
 *     screens, a low roof behind the entablature, and pedimented transept
 *     ends on Eighth Street and the south side.
 *
 * Plan: OSM way/34230640 and its building:part ways (relation/3670595),
 * read in the turned frame: nave x -20..44.2, transept x -4.3..11.7 (to
 * y -25.3 and 27), portico x 44.2..58.6, y -4.7..11.1, its columns from
 * the 14 column parts (front row x 57.6; flanks x 54.4, 50.5, 46.6), the
 * steeple's tiers centred on x 50.1, y 3.5; the 1957 west wing x -43..-18;
 * the low links south of the nave x -20.8..-4.3, y -13.4..-9.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (2021), 1 m grid, read in
 * this frame, less 1.2 m from the grid's ground_min to the ground at the
 * west end (the lowest under the footprint; Plum Street at the portico
 * is 1.8 m higher). Measured: nave eaves 17, ridge 20.8; transept ridge
 * 19.5; portico top 18.0, its platform 3.1; west wing 15, its low middle
 * 9; sacristy 7.5; the belfry stage to about 46; spire tip 65.2.
 * Published: steeple 220 ft (67 m) (Wikipedia). OSM part heights fix the
 * tier widths (9.0, 7.6, 6.3, 4.4 m) and order. Estimated from the photos:
 * column and capital sizes, the tier splits above 28 m, openings, steps.
 *
 * Ground: Mapterhorn and lidar rise about 1.8 m from the west end to
 * Plum Street; elevation 0. The portico steps start at Plum Street level.
 *
 * Night: the steeple and portico are floodlit; the nave screens glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - St. Peter in Chains - Cincinnati 01.jpg, Farragutful, CC BY-SA 4.0
 *    (portico, steeple and north side from the north-east)
 *    https://commons.wikimedia.org/wiki/File:St._Peter_in_Chains_-_Cincinnati_01.jpg
 *  - St. Peter in Chains - Cincinnati City Hall.jpg, Farragutful, CC BY-SA
 *    4.0 (portico and steeple from the north-east, with City Hall)
 *    https://commons.wikimedia.org/wiki/File:St._Peter_in_Chains_-_Cincinnati_City_Hall.jpg
 *  - St. Peter in Chains - Cincinnati 07.jpg, Farragutful, CC BY-SA 4.0
 *    (the Eighth Street side and the transept pediment)
 *    https://commons.wikimedia.org/wiki/File:St._Peter_in_Chains_-_Cincinnati_07.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south side and the west wing are not in the photos; they
 * are drawn plain in the same stone. The roof's colour is not seen.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { faces, type Face } from './cin-city-hall'

/** A chamfered square ring (an irregular octagon) of half-size h and chamfer c about centre q. */
export function chamfered(q: XY, h: number, c: number): XY[] {
  const [x, y] = q
  return [[x - h + c, y - h], [x + h - c, y - h], [x + h, y - h + c], [x + h, y + h - c], [x + h - c, y + h], [x - h + c, y + h], [x - h, y + h - c], [x - h, y - h + c]]
}

if (import.meta.main) {
  const lime = new Part(), col = new Part(), win = new Part(), roof = new Part(), dark = new Part()

  const EAVE = 17.0, RIDGE = 20.8
  // ── Nave and transept ──
  const NX0 = -20, NX1 = 44.2, NY0 = -9, NY1 = 16.5
  box(lime, NX0, NX1, NY0, NY1, 0, EAVE, null, 0)
  cornice(lime, [[NX0, NY0], [NX1, NY0], [NX1, NY1], [NX0, NY1]], EAVE - 1.6, 1.0, 0.45, null)
  box(lime, NX0 - 0.45, NX1, NY0 - 0.45, NY1 + 0.45, EAVE - 0.6, EAVE, roof, 0.15)
  gableRoof(roof, lime, NX0, NX1, NY0, NY1, EAVE, RIDGE, 'x', 0.1, 0.1)
  const TX0 = -4.3, TX1 = 11.7, TY0 = -25.3, TY1 = 27
  box(lime, TX0, TX1, TY0, TY1, 0, EAVE, null, 0)
  cornice(lime, [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]], EAVE - 1.6, 1.0, 0.45, null)
  gableRoof(roof, lime, TX0, TX1, TY0, TY1, EAVE, 19.8, 'y', 0.3, 0.3)
  // raking cornices on the transept pediments
  for (const y of [TY0 - 0.35, TY1 + 0.05]) for (const k of [-1, 1]) {
    const xm = (TX0 + TX1) / 2, sec = (x: number, z: number): V3[] => [[x, y, z], [x, y + 0.3, z], [x, y + 0.3, z - 0.45], [x, y, z - 0.45]]
    lime.sweep([sec(xm + k * ((TX1 - TX0) / 2 + 0.35), EAVE + 0.05), sec(xm, 19.95)])
  }

  // gridded stone window screens: a slate panel with bold stone bars
  const screen = (f: Face, s: number, w: number, z0: number, z1: number) => {
    onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.05)
    for (const d of [-w / 6, w / 6]) onWall(lime, f[0], f[1], rectShape(s + d - 0.1, s + d + 0.1, z0, z1), 0.08)
    for (let k = 1; k < 4; k++) { const z = z0 + ((z1 - z0) * k) / 4; onWall(lime, f[0], f[1], rectShape(s - w / 2, s + w / 2, z - 0.1, z + 0.1), 0.08) }
  }
  const nave = faces(NX0, NX1, NY0, NY1), tr = faces(TX0, TX1, TY0, TY1)
  // north (Eighth St) side: bays east of the transept; south side likewise; west of it on both
  for (const x of [17.5, 25, 32.5, 40]) { screen(nave.N, NX1 - x, 2.6, 4.2, 12.6); screen(nave.S, x - NX0, 2.6, 4.2, 12.6) }
  for (const x of [-15, -9]) { screen(nave.N, NX1 - x, 2.6, 4.2, 12.6); screen(nave.S, x - NX0, 2.6, 4.2, 12.6) }
  // transept ends: a big screen between two pilasters, and two side screens
  for (const f of [tr.N, tr.S]) {
    const m = (TX1 - TX0) / 2
    screen(f, m, 4.2, 2.2, 13.4)
    for (const d of [-3.4, 3.4]) onWall(lime, f[0], f[1], rectShape(m + d - 0.6, m + d + 0.6, 0, EAVE - 1.6), 0.25)
    for (const d of [-6.1, 6.1]) screen(f, m + d, 1.4, 4.2, 11.0)
  }
  screen(tr.E, 47.3, 2.2, 4.2, 12.6)
  for (const s of [5, 47.3]) screen(tr.W, s, 2.2, 4.2, 12.6)

  // ── West wing (1957) ──
  const wing = (x0: number, x1: number, y0: number, y1: number, h: number) => {
    box(lime, x0, x1, y0, y1, 0, h - 0.5, null, 0)
    box(lime, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, h - 0.5, h, roof, 0.12)
  }
  wing(-43.1, -33.2, -25, 19.8, 15)
  wing(-33.2, -18, -25, -13.4, 15)
  wing(-33.2, -21, 4.2, 15.9, 14.5)
  wing(-33.2, -20.8, -13.5, 4.2, 9)
  wing(11.6, 19.5, -22.7, -9, 7.5)
  // the low links along the nave's south side, west of the transept (OSM way/275922750, way/275920795;
  // lidar about 5-6 m for the first, the second meets the 9 m block)
  wing(-18, -4.3, -13.4, -9, 6.5)
  wing(-20.8, -18, -13.4, -9, 9)
  {
    const w1 = faces(-43.1, -33.2, -25, 19.8), w2 = faces(-33.2, -18, -25, -13.4), w3 = faces(-33.2, -21, 4.2, 15.9)
    for (const s of [6, 14, 22, 30, 38]) screen(w1.W, s, 2.0, 3.5, 11.5)
    for (const s of [3, 7]) screen(w1.N, s, 1.8, 3.5, 11.5)
    for (const s of [3, 7]) screen(w1.S, s, 1.8, 3.5, 11.5)
    for (const s of [4, 11]) screen(w2.S, s, 1.8, 3.5, 11.5)
    for (const s of [4, 8.5]) screen(w3.N, s, 1.8, 3.5, 11.0)
  }

  // ── Portico ──
  const PX0 = 44.2, PX1 = 58.6, PY0 = -4.7, PY1 = 11.1, PLAT = 3.1, COLTOP = 15.3, PTOP = 18.0
  // podium and steps (front and both flanks)
  box(lime, PX0 - 1, PX1 + 0.4, PY0 - 0.8, PY1 + 0.8, 0, PLAT, lime, 0.05)
  for (let k = 1; k <= 3; k++) {
    const d = k * 0.7, z = PLAT - k * 0.75
    box(lime, PX0 - 1, PX1 + 0.4 + d, PY0 - 0.8 - d, PY1 + 0.8 + d, 0, z, lime, 0.03)
  }
  // columns: shaft, base and a flared Corinthian capital
  const cols: XY[] = []
  for (const y of [-3.8, -0.7, 2.05, 4.8, 7.45, 10.3]) cols.push([57.6, y])
  for (const x of [54.4, 50.5, 46.6]) for (const y of [-3.8, 10.3]) cols.push([x, y])
  for (const c of cols) {
    revolve(col, c, [[0.85, PLAT], [0.85, PLAT + 0.5], [0.66, PLAT + 0.7], [0.58, COLTOP - 1.3], [0.66, COLTOP - 1.0], [0.9, COLTOP - 0.2], [0.9, COLTOP]], 12, 0, false, false)
  }
  // entablature over the columns and the portico ceiling
  box(lime, PX0, PX1 + 0.2, PY0 - 0.2, PY1 + 0.2, COLTOP, PTOP - 0.6, null, 0)
  box(lime, PX0, PX1 + 0.6, PY0 - 0.6, PY1 + 0.6, PTOP - 0.6, PTOP, roof, 0.15)
  lime.quad([PX0, PY1 + 0.2, COLTOP], [PX1 + 0.2, PY1 + 0.2, COLTOP], [PX1 + 0.2, PY0 - 0.2, COLTOP], [PX0, PY0 - 0.2, COLTOP])
  // the front wall behind the portico: the great bronze-grilled doorway and two side doors
  {
    const f = nave.E, m = 3.75 - NY0
    onWall(dark, f[0], f[1], rectShape(m - 2.0, m + 2.0, PLAT, 12.5), 0.05)
    for (let k = 1; k < 4; k++) onWall(lime, f[0], f[1], rectShape(m - 2.0, m + 2.0, PLAT + ((12.5 - PLAT) * k) / 4 - 0.1, PLAT + ((12.5 - PLAT) * k) / 4 + 0.1), 0.08)
    for (const d of [-0.67, 0.67]) onWall(lime, f[0], f[1], rectShape(m + d - 0.1, m + d + 0.1, PLAT, 12.5), 0.08)
    for (const d of [-5.6, 5.6]) onWall(dark, f[0], f[1], rectShape(m + d - 0.9, m + d + 0.9, PLAT, 7.6), 0.05)
  }

  // ── Steeple ──
  const C: XY = [50.1, 3.5]
  const tier = (h: number, c: number, z0: number, z1: number, p = lime, top: Part | null = lime) => {
    const ring = chamfered(C, h, c)
    p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
    if (top) {
      const pts = ring.map(([x, y]) => [x, y, z1] as V3)
      for (let i = 1; i < pts.length - 1; i++) top.tri(pts[0], pts[i], pts[i + 1])
    }
  }
  /** The four main faces of a tier as wall segments (outside to the right). */
  const tfaces = (h: number, c: number): Face[] => {
    const r = chamfered(C, h, c)
    return [[r[0], r[1]], [r[2], r[3]], [r[4], r[5]], [r[6], r[7]]]
  }
  // square plinth over the portico attic
  tier(4.6, 0.01, PTOP, 21.2)
  tier(4.9, 0.3, 21.2, 21.8)
  tier(4.1, 0.6, 21.8, 27.4)
  tier(4.35, 0.75, 27.4, 28.1)
  // the tall stage with cross-shaped openings
  tier(3.4, 0.75, 28.1, 37.5)
  for (const f of tfaces(3.4, 0.75)) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    onWall(dark, f[0], f[1], rectShape(m - 0.32, m + 0.32, 30.6, 34.4), 0.05)
    for (const d of [-1.55, 1.55]) {
      onWall(dark, f[0], f[1], rectShape(m + d - 0.2, m + d + 0.2, 31.0, 33.8), 0.05)
      onWall(dark, f[0], f[1], rectShape(m + d - 0.62, m + d + 0.62, 32.7, 33.15), 0.05)
    }
  }
  tier(3.7, 0.85, 37.5, 38.2)
  // belfry: engaged columns and louvred openings
  tier(2.85, 0.7, 38.2, 44.8)
  for (const f of tfaces(2.85, 0.7)) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    for (const d of [-0.9, 0.9]) onWall(dark, f[0], f[1], rectShape(m + d - 0.36, m + d + 0.36, 39.2, 43.8), 0.05)
    const dir: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], nn: XY = [dir[1], -dir[0]]
    for (const d of [-1.75, 0, 1.75]) {
      const p: XY = [f[0][0] + dir[0] * (m + d) + nn[0] * 0.15, f[0][1] + dir[1] * (m + d) + nn[1] * 0.15]
      revolve(lime, p, [[0.24, 38.2], [0.24, 44.8]], 6, 0, false, false)
    }
  }
  tier(3.25, 0.8, 44.8, 45.5)
  tier(3.0, 0.75, 45.5, 46.0)
  // lantern: a smaller columned stage with slit windows
  tier(1.95, 0.55, 46.0, 49.6)
  for (const f of tfaces(1.95, 0.55)) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    onWall(dark, f[0], f[1], rectShape(m - 0.3, m + 0.3, 46.9, 48.9), 0.05)
  }
  tier(2.25, 0.65, 49.6, 50.1)
  tier(1.5, 0.45, 50.1, 51.3)
  tier(1.7, 0.5, 51.3, 51.6)
  // octagonal spire and cross
  revolve(lime, C, [[1.35, 51.6], [0.0, 65.5]], 8, Math.PI / 8, true, false)
  box(col, C[0] - 0.13, C[0] + 0.13, C[1] - 0.13, C[1] + 0.13, 65.0, 67.5, col, 0)
  box(col, C[0] - 0.13, C[0] + 0.13, C[1] - 0.65, C[1] + 0.65, 66.4, 66.7, col, 0)

  const lit = (p: V3, n: V3) => (p[0] > 43 && n[2] < 0.7 ? 0.85 : 0)
  await save('cin-st-peter-in-chains', 'Cathedral Basilica of St. Peter in Chains', [
    { part: lime, material: { ...finish('spc-limestone', 0xece5d6), floodlight: lit } },
    { part: col, material: { ...finish('spc-column', 0xdcd0b6), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: dark, material: finish('spc-grille', 0x6e7276) },
  ], { height: 67.5, anchor: [39.103441, -84.519541], bearing: 349.0 })
}
