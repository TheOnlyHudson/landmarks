/**
 * Grant Building, Pittsburgh (Henry Hornbostel, 1929)
 * — original procedural geometry, CC0-1.0.
 * bun generators/pit-grant-building.ts
 *
 * Map frame turned to the building: +y along bearing 26.3 (along Grant
 * Street), +x along 116.3 (toward Grant Street), z up, metres. BEARING 26.3:
 * the OSM outline is a rectangle with edges at 26.4/116.1/206.4/296.1°.
 * Origin = centroid of the OSM outline way/203411113, 40.437649, -79.997542.
 *
 * Identity, in order: the tan brick slab stepping up from 84 m wings to the
 * 117 m body and the 135 m tower pushed to the Grant Street side; the
 * penthouse and the beacon mast on top (its red light has spelled out
 * P-I-T-T-S-B-U-R-G-H in Morse since 1929); the plain punched-window grid;
 * the light well notched into the west side.
 *
 * Evidence
 * - OSM way/203411113 (height 149 incl. mast, 40 levels), wikidata
 *   Q5596127. No building:parts.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 1 m grid read in this
 *   frame (SCRATCH/work/pit-grant-building/lidar.json), heights above the
 *   lowest ground under the footprint (south-west corner; the site rises
 *   ≈ 3 m to the north-east): a 16 m base over the whole lot, which is all
 *   that stands in the north-east corner (x > 11, y > 2.5); the light well
 *   x -20..-3, y ±7 down to it; the 84 m block over the rest; the 117 m
 *   block x -15..20, y ±21 (x < 11 north of y 2.5); the tower x 1..20,
 *   y -15..2.5 and x 1..11 north to y 15, at 135 m with a 127 m step along
 *   its west edge (x < 4.5); the penthouse ≈ x 8..17, y -4..2, top ≈ 141 m;
 *   the mast too thin for the grid.
 * - Published: 485 ft (148 m) with the mast, 37-40 floors; Hornbostel's
 *   floor plans on Commons ("Grant Building 4th to 16th floor plan.png",
 *   "… 24th to 32nd floor plan.png", public domain) show the light well and
 *   the stepped plan; the beacon (Wikipedia "Grant Building").
 * - Photos (Wikimedia Commons): "Grant Building, 2021-05-11, 01.jpg" and
 *   "Grant Building, 2022-04-21, 01.jpg" (Cbaile19, CC0) — the stepped
 *   corners and the punched grid from Grant Street; "Grant Building,
 *   Pittsburgh, 2014-06-27.jpg" (Cbaile19, CC0) — from the south, the
 *   penthouse and mast; "One Oxford Centre and Grant Building from South Side
 *   Slopes, 2022-09-27.jpg" (Cbaile19, CC0); "Grant Building Pittsburgh.jpg"
 *   (Allie Caufield, CC BY 2.0) — from above, the setbacks; the postcard
 *   "Grant Building at night, Pittsburgh, Pa (61410).jpg" (public domain) —
 *   the wings and the tower. No commercial imagery.
 *
 * Estimated: the mast's height (to 149 m, OSM) and section (drawn 2.2 m at
 * the foot, bolder than the real lattice, as a solid shaft); the penthouse
 * height; windows drawn as panels two windows wide (bays ≈ 5.6 m) and three
 * storeys tall;
 * the brick colour from the daylight photos. Left out: the Huntington signs,
 * the street-level shopfronts' detail, rooftop plant.
 *
 * Night: windows are `window`; the beacon at the mast top is
 * `neon-grant-beacon`, red.
 *
 * Doubts: the base's height in the low north-east corner and the light well
 * are from lidar only (no photo shows them clearly); the mast is drawn as a
 * solid tapering shaft, not the real open lattice.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, panel, save, walls, type XY } from './chi-aon-center'

const ID = 'pit-grant-building'
const ANCHOR: [number, number] = [40.437649, -79.997542]
const BEARING = 26.3

const rowsOf = (z0: number, z1: number, n: number, gap: number): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + gap / 2, z0 + (i + 1) * (z1 - z0) / n - gap / 2])

/** Window panels on every edge of a ring that is long enough. */
function grid(win: Part, r: XY[], z0: number, z1: number, rows: number, bay = 5.6, pier = 1.8, gap = 2.4, end = 1.4) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * end + bay) continue
    const k = Math.round((L - 2 * end) / bay), w = (L - 2 * end) / k
    for (let q = 0; q < k; q++) for (const [za, zb] of rowsOf(z0, z1, rows, gap)) panel(win, a, b, end + q * w + pier / 2, end + (q + 1) * w - pier / 2, za, zb)
  }
}

/** A stage: walls from z0 to z1 with a small bevelled parapet lip, roof capped. */
function stage(wall: Part, roof: Part, r: XY[], z0: number, z1: number) {
  walls(wall, r, z0, z1)
  cap(roof, r, z1)
}

function build() {
  const brick = new Part(), win = new Part(), roof = new Part(), mast = new Part(), beacon = new Part()
  const X0 = -19.9, X1 = 19.9, Y0 = -26.3, Y1 = 26.3

  // --- Base: 16 m over the whole lot. ---
  const lot: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  stage(brick, roof, lot, 0, 16)
  grid(win, lot, 3, 15.4, 2, 4.4, 1.4, 1.6)

  // --- 84 m block round the west light well, short of the north-east corner. ---
  const b84: XY[] = [[X0, Y0], [X1, Y0], [X1, 2.5], [11, 2.5], [11, Y1], [X0, Y1], [X0, 7], [-3, 7], [-3, -7], [X0, -7]]
  stage(brick, roof, b84, 16, 84)
  grid(win, b84, 17, 83, 6)

  // --- 117 m body. ---
  const b117: XY[] = [[-15, -21], [X1, -21], [X1, 2.5], [11, 2.5], [11, 21], [-15, 21], [-15, 7], [-3, 7], [-3, -7], [-15, -7]]
  stage(brick, roof, b117, 84, 117)
  grid(win, b117, 85, 116, 3)

  // --- The tower: a 127 m step on its west edge, 135 m behind it. ---
  const t127: XY[] = [[1, -15], [X1, -15], [X1, 2.5], [11, 2.5], [11, 15], [1, 15]]
  stage(brick, roof, t127, 117, 127)
  grid(win, t127, 117.5, 126.5, 1)
  const t135: XY[] = [[4.5, -15], [X1, -15], [X1, 2.5], [11, 2.5], [11, 15], [4.5, 15]]
  stage(brick, roof, t135, 127, 135)
  grid(win, t135, 127.5, 134.5, 1)

  // --- Penthouse, mast, beacon. ---
  const ph: XY[] = [[8, -4.5], [17, -4.5], [17, 2], [8, 2]]
  stage(brick, roof, ph, 135, 141)
  grid(win, ph, 136.5, 140, 1, 3, 1.2, 0.6, 0.9)
  const mx = 12.5, my = -1.2
  const sq = (h: number): XY[] => [[mx - h, my - h], [mx + h, my - h], [mx + h, my + h], [mx - h, my + h]]
  walls(mast, sq(1.1), 141, 147.4, sq(0.45))
  const lampR = sq(0.8)
  walls(beacon, lampR, 147.6, 149)
  cap(beacon, lampR, 149)
  cap(beacon, lampR, 147.6, false)

  return [
    { part: brick, material: finish('grant-brick', 0xc9a27f) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: mast, material: { ...PALETTE.metal, color: 0x6d6a66 } },
    { part: beacon, material: finish('neon-grant-beacon', 0xc4473d, 0.5) },
  ]
}

if (import.meta.main) await save(ID, 'Grant Building', ANCHOR, BEARING, build(), 5000)
