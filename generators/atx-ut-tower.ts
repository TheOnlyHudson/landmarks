/**
 * Main Building and Tower, University of Texas at Austin (1937, Paul
 * Philippe Cret) — original procedural geometry, CC0-1.0.
 * bun generators/atx-ut-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 5: the building is square to the Forty Acres grid
 * (OSM way/27397894's long west wall runs at 5.0°). Anchor = the centre of
 * the tower shaft, -97.739368, 30.286257 (OSM's tower part way/516187631
 * centres 1.8 m away).
 *
 * Identity (from the photos below):
 *  1. The tall square limestone shaft, three narrow window strips on each
 *     face with gilded spandrels, under a carved frieze and cornice.
 *                                                (jcutrer, closeup, moore)
 *  2. The top: a narrower clock stage with corner urns and a gilt clock on
 *     every face, a plain block, an open colonnade (corner piers and three
 *     columns a face) and a small attic, 94 m up.          (jcutrer crop)
 *  3. The Main Building's south front: a seven-arch arcade, seven tall
 *     windows, a balustrade and an attic under an orange-red tile hip roof,
 *     the tower rising straight behind it.          (jcutrer, daderot95)
 *  4. The long wings east and west with tile roofs, ending on the South
 *     Mall in pavilions with two-storey columned loggias.     (daderot95)
 *  5. Pale cream Texas limestone everywhere.
 *
 * Plan: from USGS 3DEP lidar (USGS_LPC_TX_Central_B1_2017, 1 m grid) read
 * in the model frame with tools/lidar_frame.py, made symmetric about the
 * tower's axis. OSM's outline (way/27397894) has the east wing about 3 m
 * further east than the lidar and the building as drawn is not symmetric;
 * the lidar is, so the lidar wins. Shaft 19 x 19 m; tower base 22 x 24.5 m;
 * wings 15.5 m wide, 81 m long; south front block 40 m wide.
 *
 * Heights (lidar, above the north grade, 4.8 m over the box's ground_min;
 * the South Mall terrace is 2.6 m higher): shaft cornice 74; clock stage
 * roof 77.4 with the clock surrounds to 81; colonnade block 10 m square;
 * attic 8.6 m square, top 94.3. Published 307 ft = 93.6 m (UT; Wikipedia,
 * "Main Building (University of Texas at Austin)"), so the lidar top agrees
 * to 0.7 m; the antennas and lightning rods above it (lidar 100.5) are left
 * out. Tower base 23.2 (OSM part height 23 agrees). Wings: eaves 21, ridge
 * 24.4; middle wings to 20; south pavilions 16; south front block
 * balustrade 21, attic eaves 25.7, ridge 28.5; connecting block 19.
 *
 * Estimated: the heights of the stages above the clock stage (split from
 * the lidar total in the proportions of the jcutrer photo); the clock's
 * size and height (4.6 m across); window rows and bays on the wings
 * (four storeys, ~3.6 m bays, no close photo of the north and side
 * fronts); the window strips' storey grouping (two storeys per panel); the
 * middle wings' and pavilions' roofs (low tile hips; lidar shows them
 * nearly flat). Left out: the light courts (3 x 8 m), the antennas, the
 * carved frieze panels, the balconies, the inscription.
 *
 * Night: the tower is floodlit, its top stages fully; the clock faces and
 * the colonnade are lit (warm). After wins and on special occasions the
 * top (or the whole tower) is lit orange; that is not modelled — swap the
 * floodlight for a `neon-ut-orange` material on the top stages for it.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  jcutrer   "UT Tower, University of Texas in Austin.jpg", jcutrer,
 *            CC BY-SA 4.0 (south, on axis)
 *  moore     "University of texas at austin main building 2014.jpg",
 *            Larry D. Moore, CC BY 4.0 (south)
 *  daderot95 "Main Building (University of Texas at Austin) - DSC08595.jpg",
 *            Daderot, CC0 (south, the pavilions)
 *  east      "University of Texas at Austin Tower viewed from the east.jpg",
 *            Insightwm, CC BY-SA 4.0
 *  closeup   "University of Texas at Austin Tower Closeup.jpg", Pciet -
 *            Matthew Juran, CC0 (the window strips)
 *  barera38  "University of Texas at Austin August 2019 38 (Main
 *            Building).jpg", Michael Barera, CC BY-SA 4.0 (far, south)
 * No look-only sources. No commercial imagery.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, hipRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stone = new Part(), flat = new Part(), tile = new Part(), win = new Part(), bronze = new Part(), clock = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const GRADE_S = 2.6 // the South Mall terrace above y = 0

// ── The Main Building ──
type Block = { r: XY[]; z: number }
const blocks: Block[] = []
const block = (x0: number, x1: number, y0: number, y1: number, z: number, top: Part | null = flat) => {
  const r = rect(x0, x1, y0, y1)
  blocks.push({ r, z })
  prism(stone, r, 0, z, top, 0.4)
  return r
}
for (const s of [-1, 1]) {
  const X = (a: number, b: number): [number, number] => (s < 0 ? [-b, -a] : [a, b])
  // north wings: tile hip roofs
  cornice(stone, block(...X(20.5, 36), -32.5, 12.5, 21, null), 20.4, 0.6, 0.4, null)
  hipRoof(tile, ...X(20.5, 36), -32.5, 12.5, 21, 24.4, 0.6)
  // middle wings
  cornice(stone, block(...X(20.5, 36), -54.5, -32.5, 18, null), 17.4, 0.6, 0.4, null)
  hipRoof(tile, ...X(20.5, 36), -54.5, -32.5, 18, 20.2, 0.6)
  // the south pavilions, with their loggias
  const pav = block(...X(21, 35.5), -68.8, -54.5, 15, null)
  cornice(stone, pav, 14.4, 0.6, 0.4, null)
  hipRoof(tile, ...X(21, 35.5), -68.8, -54.5, 15, 16.8, 0.6)
  const [x0, x1] = X(21, 35.5)
  onWall(win, [x0, -68.8], [x1, -68.8], rectShape(2, 12.5, GRADE_S + 4.6, 13.2), 0.05)
  for (let k = 0; k < 5; k++) {
    const cx = x0 + 2 + 0.6 + (k * (10.5 - 1.2)) / 4
    revolve(stone, [cx, -69.6], [[0.5, GRADE_S + 4.2], [0.5, GRADE_S + 4.6], [0.42, GRADE_S + 4.6], [0.36, 13.2], [0.55, 13.4], [0.55, 13.8]], 8, 0, false, true)
  }
  box(stone, x0 + 1.2, x1 - 1.2, -69.9, -68.8, GRADE_S + 3.8, GRADE_S + 4.6, stone, 0.2) // loggia floor
  box(stone, x0 + 1.2, x1 - 1.2, -69.9, -68.8, 13.8, 14.4, stone, 0.15) // its lintel
}
// the connecting block and the tower base
block(-20.5, 20.5, -35.5, -8.5, 19)
const towerBase = block(-11, 11, -12.5, 12, 23.2)
cornice(stone, towerBase, 22.4, 0.8, 0.45, flat)
// the south front block: walls, balustrade, attic, hip roof
const front = block(-20, 20, -55.5, -35.5, 19.5)
cornice(stone, front, 18.6, 0.9, 0.5, flat)
prism(stone, rect(-19.8, 19.8, -55.6, -35.6), 19.5, 21, flat, 0.15) // balustrade
const attic = rect(-18.6, 18.6, -53.6, -37.4)
prism(stone, attic, 19.5, 25.7, null, 0)
hipRoof(tile, -18.6, 18.6, -53.6, -37.4, 25.7, 28.5, 0.7)

// ── Windows ──
const inside = (p: XY) => blocks.some(({ r }) => {
  const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
  return p[0] > Math.min(...xs) + 0.05 && p[0] < Math.max(...xs) - 0.05 && p[1] > Math.min(...ys) + 0.05 && p[1] < Math.max(...ys) - 0.05
})
type Rows = [number, number][]
function windows(ring: XY[], rows: Rows, bay = 3.6, w = 1.4, skip?: (a: XY, b: XY) => boolean) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (skip?.(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.floor((L - 2) / bay)
    if (k < 1) continue
    for (let j = 0; j < k; j++) {
      const s = L / 2 + (j - (k - 1) / 2) * bay
      const t = s / L, p: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      if (inside([p[0] + n[0] * 0.6, p[1] + n[1] * 0.6])) continue // a wall hidden in the next block
      for (const [z0, z1] of rows) onWall(win, a, b, rectShape(s - w / 2, s + w / 2, z0, z1))
    }
  }
}
const FOUR: Rows = [[2.5, 4.9], [7, 9.6], [11.6, 14.2], [16.2, 18.6]]
for (const s of [-1, 1]) {
  const X = (a: number, b: number): [number, number] => (s < 0 ? [-b, -a] : [a, b])
  windows(rect(...X(20.5, 36), -32.5, 12.5), FOUR)
  windows(rect(...X(20.5, 36), -54.5, -32.5), FOUR.slice(0, 3).map(([a, b]) => [a + GRADE_S * 0.5, b + GRADE_S * 0.5]))
  windows(rect(...X(21, 35.5), -68.8, -54.5), [[GRADE_S + 1.2, GRADE_S + 3.2]], 3.6, 1.4, (a, b) => Math.abs(a[1] + 68.8) < 0.1 && Math.abs(b[1] + 68.8) < 0.1)
}
windows(rect(-20.5, 20.5, -35.5, -8.5), FOUR)
windows(towerBase, [...FOUR, [19.6, 21.6]], 3.6, 1.4)
// The south front: seven arches, seven tall windows, the attic's windows.
for (let k = 0; k < 7; k++) {
  const s = 20 + (k - 3) * 4.7
  onWall(win, [-20, -55.5], [20, -55.5], archShape(s, 3.1, GRADE_S, GRADE_S + 4.4, 8))
  onWall(bronze, [-20, -55.5], [20, -55.5], rectShape(s - 0.8, s + 0.8, GRADE_S, GRADE_S + 2.9), 0.09) // the doors in the arches
  onWall(win, [-20, -55.5], [20, -55.5], rectShape(s - 0.85, s + 0.85, 10.4, 16.2))
  onWall(win, [-18.6, -53.6], [18.6, -53.6], rectShape(s - 1.4 - 0.85 + 0.5, s - 1.4 + 0.85 - 0.5, 22, 24.3))
}
windows(rect(-20, 20, -55.5, -35.5), [[10.4, 16.2]], 4.7, 1.7, (a, b) => Math.abs(a[1] + 55.5) < 0.1 && Math.abs(b[1] + 55.5) < 0.1)

// ── The tower ──
const H = 9.5, SHAFT = 72.6
const shaft = rect(-H, H, -H, H)
prism(stone, shaft, 0, SHAFT, null, 0)
cornice(stone, shaft, 68.6, 1.6, 0.35, null) // the frieze band
cornice(stone, shaft, 72.6, 1.4, 0.8, flat) // the cornice, top 74
// three window strips a face, two storeys a panel, gilt spandrels between
const faces: [XY, XY][] = [[[-H, -H], [H, -H]], [[H, -H], [H, H]], [[H, H], [-H, H]], [[-H, H], [-H, -H]]]
for (const [a, b] of faces) {
  for (const s of [H - 3.7, H, H + 3.7]) {
    onWall(bronze, a, b, rectShape(s - 0.7, s + 0.7, 24.2, 67.4), 0.04)
    for (let z = 24.6; z + 4.4 <= 67.4; z += 5.35) onWall(win, a, b, rectShape(s - 0.62, s + 0.62, z, z + 4.4), 0.08)
  }
}
// The clock stage, its corner urns, the clock surrounds and faces.
const CS = 8, CLOCK = 77.9
prism(stone, rect(-CS, CS, -CS, CS), 74, 77.4, flat, 0.3)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  box(stone, sx * CS - (sx > 0 ? 1.8 : 0), sx * CS + (sx < 0 ? 1.8 : 0), sy * CS - (sy > 0 ? 1.8 : 0), sy * CS + (sy < 0 ? 1.8 : 0), 77.4, 78.8, stone, 0.2)
  revolve(stone, [sx * (CS - 0.9), sy * (CS - 0.9)], [[0.45, 78.8], [0.7, 79.4], [0.6, 80.2], [0.2, 80.5], [0.15, 80.9], [0, 81]], 8, 0, false, true)
}
for (const [a, b] of [[[-3, -CS], [3, -CS]], [[CS, -3], [CS, 3]], [[3, CS], [-3, CS]], [[-CS, 3], [-CS, -3]]] as [XY, XY][]) {
  // the surround: a slab standing 0.4 m off the face, with a low pediment
  const n: XY = [(b[1] - a[1]) / 6, -(b[0] - a[0]) / 6]
  const r = ccw([a, b, [b[0] + n[0] * 0.4, b[1] + n[1] * 0.4], [a[0] + n[0] * 0.4, a[1] + n[1] * 0.4]])
  prism(stone, r, 74, 80.6, stone, 0.2)
  const a2: XY = [a[0] + n[0] * 0.4, a[1] + n[1] * 0.4], b2: XY = [b[0] + n[0] * 0.4, b[1] + n[1] * 0.4]
  onWall(stone, a2, b2, [[0.3, 80.6], [5.7, 80.6], [3, 81.6]], 0)
  const ring: [number, number][] = Array.from({ length: 16 }, (_, i) => [3 + 2.3 * Math.cos((i / 16) * Math.PI * 2), CLOCK + 2.3 * Math.sin((i / 16) * Math.PI * 2)])
  onWall(clock, a2, b2, ring, 0.06)
}
// The colonnade: a plain block, corner piers and three columns a face round
// a lit core, the entablature and the attic.
prism(stone, rect(-5, 5, -5, 5), 77.4, 81.9, flat, 0.3)
cornice(stone, rect(-5, 5, -5, 5), 81.3, 0.6, 0.25, flat)
prism(win, rect(-3.6, 3.6, -3.6, 3.6), 81.9, 89.5, null, 0)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  box(stone, sx > 0 ? 3.3 : -5, sx > 0 ? 5 : -3.3, sy > 0 ? 3.3 : -5, sy > 0 ? 5 : -3.3, 81.9, 89.5, null, 0)
}
for (const s of [-1.6, 0, 1.6]) {
  for (const c of [[s, -4.4], [s, 4.4], [-4.4, s], [4.4, s]] as XY[]) {
    revolve(stone, c, [[0.42, 81.9], [0.36, 89], [0.5, 89.5]], 8, 0, false, false)
  }
}
prism(stone, rect(-5.3, 5.3, -5.3, 5.3), 89.5, 91.5, flat, 0.4)
prism(stone, rect(-4.3, 4.3, -4.3, 4.3), 91.5, 94.3, flat, 0.3)

const lit = (p: [number, number, number], n: [number, number, number]) => {
  if (n[2] > 0.7) return 0.15
  if (Math.abs(p[0]) <= 11.5 && Math.abs(p[1]) <= 12.5) return p[2] > 72 ? 1 : 0.4 + (0.3 * p[2]) / 72
  return 0
}
await save('atx-ut-tower', 'Main Building and Tower, University of Texas at Austin', [
  { part: stone, material: { ...finish('ut-limestone', 0xe6dac4), floodlight: lit } },
  { part: flat, material: PALETTE.roof },
  { part: tile, material: finish('ut-tile', 0xc0674a, 0.9) },
  { part: win, material: PALETTE.window },
  { part: bronze, material: finish('ut-bronze', 0xb8955a) },
  { part: clock, material: finish('neon-ut-clock', 0xd8b25a) },
], { height: 94.3, anchor: [30.286257, -97.739368], bearing: 5 }, 6500)
