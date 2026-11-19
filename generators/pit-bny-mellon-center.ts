/**
 * BNY Mellon Center (formerly One Mellon Center / Dravo Tower), Pittsburgh
 * (Welton Becket & Associates, 1983) — original procedural geometry, CC0-1.0.
 * bun generators/pit-bny-mellon-center.ts
 *
 * Map frame turned to the building: +y along bearing 343.5 (the tower's long
 * west and east faces), +x along 73.5, z up, metres. BEARING 343.5: the OSM
 * tower part's main faces run at 343.5/163.5 and 73.9/250.3°, its chamfers at
 * 116.8/295.9 (long) and 22.4/205.1 (short). Origin = centroid of the OSM
 * outline way/759022351, 40.439649, -79.995893.
 *
 * Identity, in order: the tall octagonal shaft, two opposite corners cut by
 * long chamfers and the other two by short ones, each chamfer with a small
 * re-entrant notch at its ends; the crown, where the chamfers lean back over
 * the top storeys so the four main faces stand up as broad flat planes to the
 * parapet; the light warm-grey stainless steel skin with a dense, even
 * punched-window grid; the lower 15-storey block to the south in the same
 * skin, stepping back in tiers at its top; the glass lobby pavilion on the
 * north plaza.
 *
 * Evidence
 * - OSM (all in the outline way/759022351, height 221, 55 levels): tower
 *   parts way/121046648 and way/759266626 (duplicates, height 221, 55
 *   levels); way/561883822 (15 levels, the south block); way/561883823 and
 *   way/759266627 (3 levels, west and east wings); way/759266625 (2 levels,
 *   the north plaza and lobby); relation/8027851 (2 levels, the Steel Plaza
 *   station entrance, under the plaza) and relation/8027852 (an untagged
 *   part east of the tower). Wikidata Q2740919. The brief named a
 *   relation/8027853: no such element is on or inside the outline; the
 *   outline is a way.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 1 m grid read in this
 *   frame (SCRATCH/work/pit-bny-mellon-center/lidar.json), heights above the
 *   lowest ground under the outline (north-west; the site rises ≈ 4 m to the
 *   south-east): the tower's parapet 220-223 m on the main faces; the
 *   chamfers' tops fall to 187 m at their outer edge and rise to 200-214 m
 *   inward (the leaning crown facets); the roof inside the screen ≈ 214 m;
 *   a plant block x -12..0, y 8..24 to 228 m. The south block 72 m with a
 *   77 m spine, stepping down at its edges to 67, 60 and 46-50 m. The west
 *   and east wings ≈ 20 m; the north lobby and plaza ≈ 15-16 m.
 * - Published: 725 ft (221 m), 54 floors above ground, stainless-steel
 *   cladding, octagonal plan (Wikipedia "BNY Mellon Center (Pittsburgh)").
 * - Photos (Wikimedia Commons):
 *   "BNY Mellon Center (Pittsburgh) as seen at Fifth at Grant in 2016.jpg"
 *   (Dllu, CC BY-SA 4.0) — the shaft over the south block, its tiers and the
 *   lobby; "BNY Mellon Center building in morning (11846068283).jpg"
 *   (daveynin, CC BY 2.0) — dusk, lit windows, the glass lobby;
 *   "BNY Mellon Center Pittsburgh 2022.jpg" (InvadingInvader, CC BY-SA 4.0) —
 *   from above: the octagon, the notched chamfers, the leaning crown facets,
 *   the screened roof and plant; "BNY Mellon Center, 2022-10-04.jpg"
 *   (Cbaile19, CC BY-SA 4.0) and "One Mellon Center, 2025-10-03.jpg"
 *   (Cbaile19, CC0) — whole tower from the south and south-west, the crown,
 *   the window grid; "Front of BNY Mellon Center (3583589876).jpg" (daveynin,
 *   CC BY 2.0) — the glass lobby front on Grant Street; night:
 *   "Pittsburgh-mellon-center-2007-night.jpg" (Derek Jensen (Tysto), public
 *   domain). No commercial imagery.
 *
 * Estimated: the crown's lean (the chamfers set back 7 m at the long and
 * 4.5 m at the short corners by the parapet, from the aerial and the lidar
 * rise from 187 to 214 m); the window panels (bays ≈ 4.4 m, three storeys a
 * row) standing for the dense punched grid; the south block's tier insets
 * (3.5 m each, outer faces only); the lobby glass; the skin colour from the
 * daylight photos. Left out: the BNY MELLON signs at the top (lit at night),
 * the roof screen's open frame, the plaza's planting.
 *
 * Night: windows are `window`; the lobby pavilion glass is `entrance`.
 *
 * Doubts: the tower faces north and east are seen only from far off; the
 * relation/8027852 part has no tags and is drawn as the east wing's height.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-aon-center'

const ID = 'pit-bny-mellon-center'
const ANCHOR: [number, number] = [40.439649, -79.995893]
const BEARING = 343.5

const H = 221, CROWN = 187, LOBBY = 12

// Tower plan (OSM way/121046648 in this frame, 1 m jogs smoothed), counter-clockwise.
const TOWER: XY[] = [
  [-1.3, 42.2], [-21.8, 42.2], [-21.9, 36.2], [-29.3, 27.8], [-33.5, 27.5], [-33.5, 5.8], [-29.5, 6.1],
  [-16.9, -5.7], [-10.5, -10.3], [-10.4, -14.9], [11.5, -14.9], [11.6, -9.8], [18.1, -1.7], [23.0, -0.9],
  [22.6, 19.0], [18.2, 19.2], [-1.3, 36.9],
]
// Chamfer vertices that lean back over the crown, with how far.
const LEAN: Record<number, number> = { 2: 4.5, 3: 4.5, 6: 7, 7: 7, 8: 7, 11: 4.5, 12: 4.5, 15: 7, 16: 7 }

// The south block (way/561883822), counter-clockwise; edges 11.. run along the tower.
const SOUTH: XY[] = [
  [-16.9, -5.7], [-29.6, -17.6], [-32.7, -18.2], [-32.5, -38.1], [-28.2, -38.3], [-19.8, -47.1], [-20.0, -50.6],
  [1.3, -50.8], [1.7, -45.8], [19.3, -27.2], [23.4, -27.0], [23.0, -0.9], [18.1, -1.7], [11.6, -9.8],
  [11.5, -14.9], [-10.4, -14.8], [-10.5, -10.3],
]
const WEST: XY[] = [[-32.7, -18.2], [-29.6, -17.6], [-16.9, -5.7], [-29.5, 6.1], [-33.5, 5.8]]
const EAST: XY[] = [[23.1, -20.3], [40.3, -2.0], [36.1, 2.4], [28.6, 9.8], [27.7, 8.8], [22.3, 13.9], [23.0, -0.9]]
const NORTH: XY[] = [
  [-1.3, 36.9], [18.2, 19.2], [22.2, 19.0], [22.3, 13.9], [27.7, 8.8], [28.6, 9.8], [36.1, 2.4], [40.3, -2.0],
  [45.2, 2.9], [49.4, 7.8], [49.3, 13.9], [41.5, 20.5], [34.2, 20.5], [20.3, 33.2], [19.6, 36.3], [13.4, 42.6],
  [13.4, 46.2], [7.8, 51.3], [-1.2, 41.7],
]

/** Offset each edge of a counter-clockwise ring inward by its own distance. */
function offsetEdges(r: XY[], d: number[]): XY[] {
  const n = r.length
  const line = (i: number) => {
    const a = r[i], b = r[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l
    return { p: [a[0] + nx * d[i], a[1] + ny * d[i]] as XY, u: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] as XY }
  }
  return r.map((_, i) => {
    const A = line((i - 1 + n) % n), B = line(i)
    const den = A.u[0] * B.u[1] - A.u[1] * B.u[0]
    if (Math.abs(den) < 1e-6) return B.p
    const t = ((B.p[0] - A.p[0]) * B.u[1] - (B.p[1] - A.p[1]) * B.u[0]) / den
    return [A.p[0] + A.u[0] * t, A.p[1] + A.u[1] * t] as XY
  })
}

/** Bays of window panels on one wall, in storey groups. */
function wallBays(win: Part, a: XY, b: XY, rows: [number, number][], bay = 4.4, pier = 1.5, end = 1.2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * end + bay * 0.7) return
  const k = Math.max(1, Math.round((L - 2 * end) / bay)), w = (L - 2 * end) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of rows) panel(win, a, b, end + q * w + pier / 2, end + (q + 1) * w - pier / 2, z0, z1)
}
const rowsOf = (z0: number, z1: number, n: number, gap: number): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + gap / 2, z0 + (i + 1) * (z1 - z0) / n - gap / 2])

function tread(p: Part, o: XY[], i: XY[], z: number) {
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    p.quad([o[k][0], o[k][1], z], [o[j][0], o[j][1], z], [i[j][0], i[j][1], z], [i[k][0], i[k][1], z])
  }
}

function build() {
  const skin = new Part(), win = new Part(), roof = new Part(), glass = new Part(), plant = new Part()

  // --- Low parts: west and east wings, the north lobby pavilion. ---
  walls(skin, WEST, 0, 20); cap(roof, WEST, 20)
  walls(skin, EAST, 0, 20); cap(roof, EAST, 20)
  for (let i = 0; i < EAST.length; i++) wallBays(win, EAST[i], EAST[(i + 1) % EAST.length], rowsOf(6, 19, 2, 2.2))
  wallBays(win, WEST[3], WEST[4], rowsOf(6, 19, 2, 2.2))
  wallBays(win, WEST[4], WEST[0], rowsOf(6, 19, 2, 2.2))
  // the north pavilion: glass walls in a light frame, roofed at 15 m
  walls(skin, NORTH, 0, 1)
  walls(glass, inset(NORTH, 0.2), 1, 13.6)
  walls(skin, NORTH, 13.6, 15.5)
  cap(roof, NORTH, 15.5)

  // --- South block: 46 m, then three tiers stepping in on its street faces. ---
  const outer = (dd: number) => SOUTH.map((_, i) => (i <= 10 ? dd : 0))
  walls(skin, SOUTH, 0, 46)
  for (let i = 0; i <= 10; i++) wallBays(win, SOUTH[i], SOUTH[i + 1], rowsOf(LOBBY - 4, 45.5, 3, 2.6))
  let prev = SOUTH, z = 46
  for (const [dd, top] of [[3.5, 56], [7, 64], [10.5, 72]] as [number, number][]) {
    const r = offsetEdges(SOUTH, outer(dd))
    tread(roof, prev, r, z)
    walls(skin, r, z, top)
    for (let i = 0; i <= 10; i++) wallBays(win, r[i], r[i + 1], rowsOf(z + 0.6, top - 0.3, top - z > 9 ? 1 : 1, 2.2))
    prev = r; z = top
  }
  cap(roof, prev, 72)

  // --- Tower: shaft to the crown, then the leaning facets to the parapet. ---
  const topRing = TOWER.map(([x, y], i) => {
    const d = LEAN[i]
    if (!d) return [x, y] as XY
    const l = Math.hypot(x - (-5), y - 13.5) // toward the plan's centre
    return [x + (-5 - x) / l * d, y + (13.5 - y) / l * d] as XY
  })
  walls(skin, TOWER, 0, CROWN)
  walls(skin, TOWER, CROWN, H, topRing)
  // lobby: dark glass between the corner piers on the main faces
  for (const i of [0, 4, 9, 13]) {
    const a = TOWER[i], b = TOWER[(i + 1) % TOWER.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(glass, a, b, 2, L - 2, 0.3, LOBBY - 1)
  }
  for (let i = 0; i < TOWER.length; i++) {
    const a = TOWER[i], b = TOWER[(i + 1) % TOWER.length]
    wallBays(win, a, b, rowsOf(LOBBY, CROWN, 15, 3.6), 4.4, 1.9)
    // crown storeys: only the main faces stay upright
    if (!LEAN[i] && !LEAN[(i + 1) % TOWER.length]) wallBays(win, a, b, rowsOf(CROWN, H - 4, 3, 3.6), 4.4, 1.9)
  }
  // parapet: a screen ring round the roof at 214, plant block to 228
  const scr = inset(topRing, 1.2)
  tread(skin, topRing, scr, H)
  walls(skin, [...scr].reverse(), 214, H)
  cap(roof, scr, 214)
  const pb: XY[] = [[-14, 7], [1, 7], [1, 24], [-14, 24]]
  walls(plant, pb, 214, 227.5); cap(plant, pb, 227.5)

  return [
    { part: skin, material: finish('bny-stainless', 0xd6d0c6, 0.6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: { ...PALETTE.entrance, color: 0x7d8c96 } },
    { part: plant, material: { ...PALETTE.roof, name: 'metal', color: 0xb3b2ae } },
  ]
}

if (import.meta.main) await save(ID, 'BNY Mellon Center', ANCHOR, BEARING, build(), 5000)
