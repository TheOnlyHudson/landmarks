/**
 * Saint Paul Union Depot (1917-1926, Charles Sumner Frost) — original
 * procedural geometry, CC0-1.0.
 * bun generators/msp-union-depot.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, turned by the placement bearing 326.6 deg
 * (the Lowertown grid): +y faces north-west onto 4th Street, -y runs south-
 * east down the concourse toward the river. Origin at -93.08588, 44.94740,
 * inside the footprint; z = 0 is the track-deck side, 2 m above the lowest
 * lidar ground; 4th Street is 8.2 m higher (lidar ground), so the street
 * front's lower 8 m sinks into the slope.
 *
 * Form: the Neoclassical head house on 4th Street, its ten giant Doric
 * columns in antis between plain end pavilions under a tall attic; the
 * skylit waiting room behind it; and the long brick concourse running
 * south-east over the track deck on an open, pier-carried lower level, its
 * upper storey lined with round-headed windows under a red-tiled hip and a
 * glazed clerestory; plus the east arm to the bus deck and the stair block
 * at the far end (all one OSM multipolygon).
 *
 * Sources
 * - OSM: relation/6894450 (building=train_station, Union Depot, 214 E 4th St),
 *   outers way/141862558 (head house and waiting room), way/141862560
 *   (concourse and east arm) and way/155094077 (the far-end block).
 *   "Oaks Union Depot" (way/141873206) across 4th Street is not part of it.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_5_B22, flown ~2022, two
 *   tiles): head house 96 x 50 m, centre front projecting to the column line,
 *   attic 27.5 m (19.3 m above 4th St), end pavilions 23.5 m, waiting room
 *   25 m; concourse 27 m wide, 129 m long, eaves ~22 m, clerestory ~28 m over
 *   a track deck ~3 m; east arm and stair block ~15 m.
 * - USGS NAIP (public domain): the roofs, skylight ridges, the concourse's
 *   red roof strip.
 * - Published: built 1917-1926, Charles Sumner Frost, NRHP 1974; reopened
 *   2012 (Wikipedia, "Union Depot (Saint Paul)").
 * - Photos (Wikimedia Commons, all evidence):
 *   McGhiever, "Saint Paul Union Station.jpg", CC BY-SA 4.0: the colonnade, attic.
 *     https://commons.wikimedia.org/wiki/File:Saint_Paul_Union_Station.jpg
 *   Michael Barera, "Saint Paul April 2025 04 / 06 / 29 (Saint Paul Union Depot).jpg",
 *     CC BY-SA 4.0: column count (10 in antis, 11 bays), end pavilions.
 *     https://commons.wikimedia.org/wiki/File:Saint_Paul_April_2025_04_(Saint_Paul_Union_Depot).jpg
 *   Jerry Huddleston, "Empire Builder at Union Depot (21751301612).jpg", CC BY 2.0:
 *     the concourse from the east (brick, arched windows, red roof, open lower level).
 *     https://commons.wikimedia.org/wiki/File:Empire_Builder_at_Union_Depot_(21751301612).jpg
 *
 * Estimated from photos: column, entablature and attic proportions (scaled
 * to the lidar attic), window rows on the pavilions and wings, the concourse
 * window count (26 a side) and its lower level's piers; colours.
 *
 * Night: windows glow; the skylights are glass and stay dark; no floodlight
 * (no night photo checked).
 *
 * Doubts: the rear wings' and east arm's facades are generic; the concourse
 * lower level is drawn as a dark recessed wall between piers; the far-end
 * stair block and east arm are simplified boxes.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, chamfer, capRing, wallEdge, outward, finishGlb } from './sea-rainier-square-tower'

const STREET = 8.2 // 4th Street, above the model's base (the track deck side)
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

function prism(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number, bottom?: Part) {
  for (let i = 0; i < ring.length; i++) wallEdge(wall, ring, i, z0, z1)
  if (top) capRing(top, ring, z1)
  if (bottom) capRing(bottom, ring, z0, false)
}
/** Panels along edge i of ring r: `n` evenly spaced, each w wide, from z0 to z1, optional round head. */
function row(part: Part, r: XY[], i: number, count: number, w: number, z0: number, z1: number, arch = false, inset = 1.5) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b), pr = 0.06
  const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * pr, a[1] + t[1] * u + n[1] * pr, z]
  const step = (L - 2 * inset) / count
  for (let k = 0; k < count; k++) {
    const s = inset + (k + 0.5) * step, h = w / 2, zs = arch ? z1 - h : z1
    part.quad(P(s - h, z0), P(s + h, z0), P(s + h, zs), P(s - h, zs))
    if (arch) for (let j = 0; j < 8; j++) {
      const a0 = (Math.PI * j) / 8, a1 = (Math.PI * (j + 1)) / 8
      part.tri(P(s, zs), P(s + h * Math.cos(a0), zs + h * Math.sin(a0)), P(s + h * Math.cos(a1), zs + h * Math.sin(a1)))
    }
  }
}
/** A low hipped roof over a rectangle from zE, rising `rise` over `run`, eaves overhanging `over`. */
function hip(tile: Part, flat: Part | null, x0: number, y0: number, x1: number, y1: number, zE: number, rise: number, run: number, over = 0.5) {
  const ox0 = x0 - over, oy0 = y0 - over, ox1 = x1 + over, oy1 = y1 + over, zt = zE + rise
  const r = Math.min(run, (ox1 - ox0) / 2 - 0.01, (oy1 - oy0) / 2 - 0.01)
  const B: V3[] = [[ox0, oy0, zE], [ox1, oy0, zE], [ox1, oy1, zE], [ox0, oy1, zE]]
  const T: V3[] = [[ox0 + r, oy0 + r, zt], [ox1 - r, oy0 + r, zt], [ox1 - r, oy1 - r, zt], [ox0 + r, oy1 - r, zt]]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; tile.quad(B[i], B[j], T[j], T[i]) }
  if (flat) flat.quad(T[0], T[1], T[2], T[3])
  const W: V3[] = [[x0, y0, zE], [x1, y0, zE], [x1, y1, zE], [x0, y1, zE]]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; tile.quad(W[j], W[i], B[i], B[j]) }
}
/** A gabled glass light along y over [x0, x1] x [y0, y1], from z0 to the ridge z1. */
function glassGable(g: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const xm = (x0 + x1) / 2
  g.quad([x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1])
  g.quad([x0, y1, z0], [x0, y0, z0], [xm, y0, z1], [xm, y1, z1])
  g.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1])
  g.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1])
}
function column(part: Part, c: XY, r: number, z0: number, z1: number, n = 12) {
  const ring: XY[] = Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)])
  for (let i = 0; i < n; i++) wallEdge(part, ring, i, z0, z1, 40)
}

function build() {
  const stone = new Part(), brick = new Part(), roof = new Part(), tile = new Part(), win = new Part(), glass = new Part()

  // ---------------------------------------------------------------- the head house on 4th Street
  const Z = { attic: 27.5, entab: 19.9, ends: 23.5, wait: 25, front: 65, colY: 67.2, edge: 68.75 }
  const centre = rect(-36, 50, 16, Z.front)
  prism(stone, roof, chamfer(centre, 0.4), 0, Z.attic)
  // entablature and attic carried forward over the colonnade, with its soffit
  const over = rect(-36, Z.front - 0.2, 16, Z.edge)
  prism(stone, roof, over, Z.entab, Z.attic, stone)
  const cornice = rect(-36.3, Z.front, 16.3, Z.edge + 0.35)
  prism(stone, stone, cornice, Z.entab + 2.6, Z.entab + 3.2, stone)
  // the antae at both ends of the colonnade, and the platform it stands on
  for (const [x0, x1] of [[-36, -33], [13, 16]]) prism(stone, null, rect(x0, Z.front - 0.1, x1, Z.edge), 0, Z.entab + 0.05)
  prism(stone, stone, rect(-33, Z.front - 0.1, 13, Z.edge + 0.6), 0, STREET + 0.45)
  // ten giant Doric columns in antis; the tall glazed screens behind them
  const bay = 46 / 11
  for (let k = 1; k <= 10; k++) column(stone, [-33 + bay * k, Z.colY], 0.8, STREET + 0.45, Z.entab)
  { const a: XY = [-33, Z.front], P = (u: number, z: number): V3 => [a[0] + u, a[1] + 0.06, z]
    for (let k = 0; k < 11; k++) { const s = bay * (k + 0.5), h = 1.6
      win.quad(P(s + h, STREET + 0.5), P(s - h, STREET + 0.5), P(s - h, Z.entab - 1.2), P(s + h, Z.entab - 1.2)) } }

  // the end pavilions and the wings behind them, down to the rear streets
  const ends = [rect(-58, 18, -36, 65), rect(16, 18, 38, 65)]
  for (const r of ends) {
    const rc = chamfer(r, 0.4)
    prism(stone, roof, rc, 0, Z.ends)
    for (let i = 0; i < rc.length; i++) {
      const a = rc[i], b = rc[(i + 1) % rc.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = outward(a, b)
      if (L < 5) continue
      const cnt = Math.max(1, Math.round(L / 4.5))
      if (n[1] > 0.5) { // the 4th Street face: three tall windows over the street
        row(win, rc, i, 3, 1.8, STREET + 1.2, STREET + 5.2)
        row(win, rc, i, 3, 1.8, STREET + 7.4, STREET + 11.4)
      } else {
        row(win, rc, i, cnt, 2.0, 2.2, 7.4)
        row(win, rc, i, cnt, 2.0, 9.2, 14.6)
        row(win, rc, i, cnt, 1.8, 16.4, 20.8)
      }
    }
  }
  // the waiting room behind the head house, with its skylit roof
  const wait = rect(-36, 18, 16, 50)
  prism(brick, roof, wait, 0, Z.wait)
  { const r = wait
    row(win, r, 0, 9, 2.2, 9.2, 14.6); row(win, r, 0, 9, 2.0, 16.4, 21.4) }
  for (let k = 0; k < 4; k++) glassGable(glass, -32 + k * 11, 22, -24 + k * 11, 46, Z.wait + 0.02, Z.wait + 2.6)

  // ---------------------------------------------------------------- the concourse over the track deck
  const CX0 = -6.5, CX1 = 20.5, CY0 = -111, CY1 = 18, DECK = 9, EAVE = 22
  // the open lower level: a dark recessed wall with stone piers
  const low = rect(CX0 + 1.4, CY0 + 1.4, CX1 - 1.4, CY1)
  prism(stone, null, low, 0, DECK)
  for (const i of [0, 1, 3]) { const a = low[i], b = low[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]); row(win, low, i, Math.max(1, Math.round(L / 7.5)), 5.2, 0.4, DECK - 0.8, false, 0.8) }
  for (let y = CY0 + 1; y < CY1 - 2; y += 7.5) for (const x of [CX0 + 0.6, CX1 - 0.6]) prism(stone, null, rect(x - 0.6, y - 0.6, x + 0.6, y + 0.6), 0, DECK)
  // the brick hall, its long rows of round-headed windows, its red-tiled roof and glazed clerestory
  const hall = rect(CX0, CY0, CX1, CY1)
  prism(brick, null, hall, DECK, EAVE, brick)
  const bandR = rect(CX0 - 0.25, CY0 - 0.25, CX1 + 0.25, CY1)
  prism(stone, stone, bandR, DECK, DECK + 0.8, stone)
  row(win, hall, 0, 5, 2.4, 13.4, 19.8, true, 2)
  row(win, hall, 1, 26, 2.4, 13.4, 19.8, true, 2.5)
  row(win, hall, 3, 26, 2.4, 13.4, 19.8, true, 2.5)
  row(win, hall, 1, 26, 2.0, 10.2, 12.2, false, 2.5)
  row(win, hall, 3, 26, 2.0, 10.2, 12.2, false, 2.5)
  hip(tile, roof, CX0, CY0, CX1, CY1 - 0.5, EAVE, 2.6, 5)
  prism(brick, roof, rect(3.5, CY0 + 6, 10.5, CY1 - 3), EAVE + 2.0, EAVE + 3.4)
  glassGable(glass, 3.5, CY0 + 6, 10.5, CY1 - 3, EAVE + 3.4, EAVE + 6.0)

  // the east arm to the bus deck, and the stair block at the far end
  const arm = rect(CX1, -22, 56, -10)
  prism(brick, roof, arm, 0, 15)
  row(win, arm, 0, 7, 2.6, 9.6, 13.4); row(win, arm, 2, 7, 2.6, 9.6, 13.4); row(win, arm, 1, 2, 2.6, 9.6, 13.4)
  const stair = rect(CX1, -122, 42, CY0 + 0.5)
  prism(brick, roof, stair, 0, 15)
  row(win, stair, 0, 4, 2.4, 9.6, 13.4); row(win, stair, 1, 2, 2.4, 9.6, 13.4)

  return finishGlb('msp-union-depot', 'Saint Paul Union Depot', [
    { part: stone, material: finish('ud-limestone', 0xddd2bf) },
    { part: brick, material: finish('ud-brick', 0xc59f80) },
    { part: roof, material: { ...PALETTE.roof, color: 0xb3b1ab } },
    { part: tile, material: finish('ud-tile', 0xa9604a, 0.9) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 326.6, height: 28.2, replaces: ['relation/6894450'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-union-depot.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
