/**
 * Rainbow Tower (the Rainbow Carillon Tower, 1947), Rainbow Bridge plaza,
 * Niagara Falls, Ontario, with the plaza building at its foot:
 * procedural, CC0-1.0.
 * bun generators/niagara-rainbow-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Anchor = centroid of the tower's OSM outline way/363657093,
 * 43.091835, -79.069888. The tower's plan is turned 45 degrees: its sides
 * run 44.6 / 134.2 degrees.
 *
 * Identity: a slender, plain pale-limestone shaft at the Canadian end of the
 * Rainbow Bridge, Moderne rather than Gothic: tall narrow louvred slots for
 * the carillon's bell chamber in the upper half (five on the broad faces,
 * four on the narrow ones, each cut in four by stone transoms), a row of
 * small square windows under them, a plain flat top with a slightly set-in
 * crowning block. At its foot the plaza building: pale stone walls with a
 * deep stone fascia and a pale green standing-seam metal roof.
 *
 * Evidence:
 * - plan: OSM. Tower way/363657093 (man_made=tower, tower:type=bell_tower,
 *   height=50.3): 9.3 x 8.1 m. Plaza building way/55553249 ("Rainbow Plaza
 *   Border Control Station").
 * - height: 50.3 m (OSM height tag; 165 ft published for the carillon
 *   tower, Niagara Parks / Wikipedia "Rainbow Bridge (Niagara Falls)").
 * - slots, transoms, small windows, crown: the Draconichiaro photo (from
 *   the west, close): slot zone about 27-44 m, small windows about 23 m,
 *   crown block from 47.6 m. Estimated by scaling the photo on the 9.3 m
 *   face; the upward view compresses the top, so these are +-1.5 m.
 * - plaza building: walls about 7 m, roof to about 9.5 m, estimated from the
 *   same photo (2 storeys under the green roof). Its other sides have no
 *   close photo; they follow OSM, drawn the same way.
 * - colours: daylight photos, pulled to the palette (limestone a warm pale
 *   grey; the roof the palette's copper green, as the photo's pale green).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Rainbow Carillon Tower.jpg", Draconichiaro, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:Rainbow_Carillon_Tower.jpg
 * - "Rainbow Bridge from Niagara Falls Observation Tower.jpeg", Dough4872,
 *   CC BY-SA 4.0 (from the south-east, across the gorge)
 *   https://commons.wikimedia.org/wiki/File:Rainbow_Bridge_from_Niagara_Falls_Observation_Tower.jpeg
 * - "Rainbow Bridge, July 2026.jpg", PenPineapplePinniped, CC0 (from the
 *   south, far)
 *   https://commons.wikimedia.org/wiki/File:Rainbow_Bridge,_July_2026.jpg
 * No commercial imagery. No lidar used (Ontario; 3DEP stops at the river).
 *
 * Night: the tower's stone is floodlit (`_FLOODLIGHT` on the shaft only);
 * windows glow; the louvres stay dark.
 *
 * Not drawn: the Rainbow Bridge and its stone approach viaduct (their own
 * model, niagara-rainbow-bridge, which ends about 29 m south-east of the
 * tower); the inspection canopies way/1154355355 and way/1154364268
 * (layer 1, no close photo), left to the map; the glass skylight on the
 * plaza roof (its position isn't known).
 * Ground: Mapterhorn is flat to +-0.5 m over the site; elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, block, cap, inset, onWall, panel, save, turn, walls, type XY } from './chi-aon-center'
import { densify } from './niagara-table-rock-centre'

// The tower, about its own centre: local x along the 9.3 m sides (bearing
// 134.2), y along the 8.1 m sides; turned onto the map by ROT.
const ROT = -44.2
const HX = 4.64, HY = 4.04
const H = 50.3, CROWN = 47.6

// The plaza building, way/55553249, in metres from the anchor.
const PLAZA_RAW: XY[] = [[-16.43, -8.88], [-12.18, -1.53], [-9.02, 2.76], [-4.89, 7.77], [-1.8, 9.32], [2.81, 13.75], [-2.23, 20.11], [-6.23, 15.7], [-11.08, 20.27], [-4.1, 24.2], [-10.84, 36.45], [2.07, 44.08], [-4.67, 56.8], [-7.93, 55.29], [-14.69, 66.63], [-40.17, 52.3], [-39.03, 50.89], [-50.6, 38.99], [-60.98, 24.11], [-53.9, 21.08], [-59.37, 10.68], [-42.61, 3.28], [-43.08, 2.12], [-37.94, 0.09], [-26.32, -4.47], [-24.69, -0.88], [-22.01, -2.74], [-23.55, -5.31]]
const PLAZA: XY[] = area(PLAZA_RAW) > 0 ? PLAZA_RAW : [...PLAZA_RAW].reverse()
const WALL = 7.0, RIDGE = 9.5, SLOPE_IN = 2.2

function build() {
  const stone = new Part(), louvre = new Part(), win = new Part(), green = new Part(), roof = new Part()

  // ---- tower
  const local = (r: XY[]) => turn(r, ROT)
  const shaft: XY[] = local([[-HX, -HY], [HX, -HY], [HX, HY], [-HX, HY]])
  walls(stone, shaft, 0, CROWN - 0.3)
  const ledge = inset(shaft, 0.3)
  walls(stone, shaft, CROWN - 0.3, CROWN, ledge)
  const crown = inset(shaft, 0.6)
  walls(stone, ledge, CROWN, CROWN, crown) // the ledge's top
  block(stone, stone, crown, CROWN, H, 0.3)

  // Slots and small windows on each face. Faces 0 and 2 are the broad
  // (9.3 m) ones: five slots across 7.4 m. Faces 1 and 3: four across 4.2 m.
  const SLOT0 = 27.0, SLOT1 = 44.0
  for (let f = 0; f < 4; f++) {
    const a = shaft[f], b = shaft[(f + 1) % 4]
    const { L } = onWall(a, b)
    const broad = f % 2 === 0
    const n = broad ? 5 : 4, span = broad ? 7.4 : 4.2, gap = broad ? 0.62 : 0.5
    const w = (span - (n - 1) * gap) / n, s0 = (L - span) / 2
    for (let k = 0; k < n; k++) {
      const x0 = s0 + k * (w + gap), x1 = x0 + w
      panel(louvre, a, b, x0, x1, SLOT0, SLOT1, 0.04)
      // three stone transoms cut each slot in four, as the photo shows
      for (let t = 1; t < 4; t++) {
        const z = SLOT0 + (SLOT1 - SLOT0) * t / 4
        panel(stone, a, b, x0 - 0.02, x1 + 0.02, z - 0.22, z + 0.22, 0.07)
      }
    }
    // small square windows under the slots: four on the narrow faces,
    // three (centred) on the broad ones, one more lower down on the broad
    const m = broad ? 3 : 4
    for (let k = 0; k < m; k++) {
      const c = broad ? L / 2 + (k - 1) * (w + gap) : s0 + w / 2 + k * (w + gap)
      panel(win, a, b, c - 0.33, c + 0.33, 22.6, 23.4, 0.04)
    }
    if (broad) panel(win, a, b, L / 2 - 0.3, L / 2 + 0.3, 18.2, 18.9, 0.04)
  }

  // ---- plaza building: stone walls, a stone fascia, a green sloped roof
  const ring = densify(PLAZA, 5)
  walls(stone, ring, 0, WALL)
  // glazing under the deep fascia, broad bays between stone piers
  for (let i = 0; i < PLAZA.length; i++) {
    const a = PLAZA[i], b = PLAZA[(i + 1) % PLAZA.length]
    const { L } = onWall(a, b)
    if (L < 4) continue
    const k = Math.max(1, Math.round((L - 1.2) / 4.2)), w = (L - 1.2 - (k - 1) * 0.9) / k
    for (let q = 0; q < k; q++) panel(win, a, b, 0.6 + q * (w + 0.9), 0.6 + q * (w + 0.9) + w, 0.9, 4.4, 0.04)
  }
  // the fascia projects a little, then the green roof slopes in and up
  const eave = inset(ring, -0.5)
  walls(stone, ring, WALL - 1.6, WALL - 1.6, eave) // soffit
  walls(stone, eave, WALL - 1.6, WALL)
  const top = inset(ring, SLOPE_IN)
  walls(green, eave, WALL, RIDGE, top)
  cap(roof, top, RIDGE)

  // floodlight only the tower's stone
  const towerLight = (p: V3, n: V3) => (Math.hypot(p[0], p[1]) < 7.5 && n[2] < 0.5 ? 0.75 : 0)
  return [
    { part: stone, material: { ...finish('rainbow-limestone', 0xe3dccf), floodlight: towerLight } },
    { part: louvre, material: finish('rainbow-louvre', 0x6c6a66) },
    { part: win, material: PALETTE.window },
    { part: green, material: PALETTE.copper },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('niagara-rainbow-tower', 'Rainbow Tower', [43.091835, -79.069888], 0, build())
