/**
 * Carew Tower complex, Cincinnati (1930, W. W. Ahlschlager with Delano &
 * Aldrich): the 49-storey office tower on Fifth and Vine and the Netherland
 * Plaza hotel block west of it, on one stone podium — original procedural
 * geometry, CC0-1.0.
 * bun generators/cin-carew-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor -84.51329, 39.10072 (inside the tower's OSM outline
 * way/100146895, near its centroid). The street grid runs at 348.9° /
 * 78.9°, so the catalog bearing is 348.9 and the walls are square to the
 * model's frame: Fifth Street is the north front (y = 37.4), Vine Street
 * the east (x = 23.8), the hotel runs west to x = -96.
 *
 * Identity, in order: the tall tan-brick shaft with its cascade of setbacks
 * at the north and south ends of the top (the E and W faces rise almost
 * sheer), the lower shoulders north and south of the shaft, the pale
 * limestone podium on Fifth and Vine; the hotel's long slab with its raised
 * centre and the two lower end wings reaching to Fifth Street. At night the
 * crown is floodlit.
 *
 * Evidence:
 *  - plan: OSM outline way/100146895 and relation/3620333 (parts
 *    way/270851577, 271093037, 270852301, 270852302, 91292276); the hotel's
 *    relation/3630559 (outline way/91327377, parts way/272007531,
 *    272007532, 272007533). OSM's part outlines are roughly right; their
 *    heights are not (the 50 m whole-block part is a 23.5 m podium).
 *  - heights and the plan of every tier: measured, USGS 3DEP lidar
 *    OH_StatewideP3_6_B21 (Ohio statewide phase 3, ~2021 flight), 1 m grid
 *    read in the model frame, less 2.5 m for the street (Fifth Street reads
 *    ~3 m over the box minimum; Mapterhorn shows the block flat within
 *    1.5 m). Podium 23.5; tower shoulders 58.5 with a 2 m ledge to 76.5;
 *    shaft 141.5 (x -7.5..12.5, y -17..25); crown steps at ~155, 162, 166.5
 *    to the roof at 171 (published 574 ft / 175 m to the top, Wikipedia;
 *    the extra is the penthouse and mast). Hotel: wings 54.5, slab 100.5,
 *    raised centre 107.5, Fifth Street front 19.5, a 32.5 m block behind.
 *  - the cascade: N/S ends step in ~2 m per step (lidar); the E/W faces
 *    only ~0.5–1 m (lidar, and the photos below, which show the long faces
 *    narrowing to about 60% at the top through the end steps).
 *  - colour: tan brick sampled from the sunlit photos (#c8a87a sun,
 *    #7a6650 shade), pulled to the palette's lightness; podium limestone =
 *    stone.
 *  - windows: punched in pairs, 49 floors in 171 m (~3.5 m); drawn as
 *    panels per bay over three storeys (estimated bay rhythm from photos).
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 *  - Carew_Tower,_Cincinnati,_Ohio.jpg, EEJCC, CC BY-SA 4.0 (from Fountain
 *    Square, NE) https://commons.wikimedia.org/wiki/File:Carew_Tower,_Cincinnati,_Ohio.jpg
 *  - Carew_Tower_from_Fountain_Square,_Cincinnati,_OH_(27226901857).jpg,
 *    Warren LeMay, CC0 (NNE) https://commons.wikimedia.org/wiki/File:Carew_Tower_from_Fountain_Square,_Cincinnati,_OH_(27226901857).jpg
 *  - Cincinnati-carew-tower.jpg, CC BY 2.0 (the crown and hotel slab)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati-carew-tower.jpg
 *  - Cincinnati,_Ohio,_The_Carew_Tower_-_panoramio.jpg, Carlo Pelagalli,
 *    CC BY-SA 3.0 (from Fifth Street, east) https://commons.wikimedia.org/wiki/File:Cincinnati,_Ohio,_The_Carew_Tower_-_panoramio.jpg
 *  - Carew_Tower,_January_2007_-_panoramio.jpg, Kevin.Daniels, CC BY 3.0
 *    (crown corner steps) https://commons.wikimedia.org/wiki/File:Carew_Tower,_January_2007_-_panoramio.jpg
 *  - Carew_Tower_and_Union_Central_Tower,_Cincinnati,_OH_(46777811591).jpg,
 *    Warren LeMay, CC0 (from the south-west) https://commons.wikimedia.org/wiki/File:Carew_Tower_and_Union_Central_Tower,_Cincinnati,_OH_(46777811591).jpg
 * No commercial imagery.
 *
 * Doubts: the south faces are seen only at a distance (LeMay SW); the
 * hotel's south side and the 32.5 m block behind it are from lidar alone.
 * The crown's corner notches are simplified into whole tiers. Left out: the
 * mast and flagpole, the Art Deco ornament, the arcade entrances.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, rect, rows, save, walls, type XY } from './chi-aon-center'
import { rectBays } from './chi-board-of-trade'

const FLOOR = 3.5

/** A tier: walls in `wall`, bevelled top lip in `lip`, roof in `roof`. */
function tier(wall: Part, lip: Part, roof: Part, r: XY[], z0: number, z1: number) {
  walls(wall, r, z0, z1 - 0.5)
  block(lip, roof, r, z1 - 0.5, z1, 0.35)
}

/** Window rows of `n`-storey groups between z0 and z1. */
function groups(z0: number, z1: number, n = 3) {
  const k = Math.max(1, Math.round((z1 - z0) / (n * FLOOR)))
  return rows(z0, z1, k, 2.0)
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), trim = new Part()

  // ---- Podium: the whole block, limestone, 23.5 m.
  const PODIUM = 23.5
  const W = -96, E = 23.8, S = -24.4, N = 37.4
  // Office podium (Fifth & Vine) and the hotel's podium behind its front.
  const podium: XY[] = [[W, S], [E, S], [E, N], [-15, N], [-15, 31], [-91, 31], [-91, N], [W, N]]
  tier(stone, trim, roof, podium, 0, PODIUM)
  // Tall shop-front windows: ground floor and the two storeys above.
  rectBays(win, rect(-15, S, E, N), [[4.5, 10], [11.5, 20.5]], { bay: 3.4, gap: 1.6, end: 1.6, skip: [3] })
  rectBays(win, rect(W, S, -15, 31), [[4.5, 10], [11.5, 20.5]], { bay: 3.4, gap: 1.6, end: 1.6, skip: [1, 2] })

  // ---- Netherland Plaza hotel.
  // Fifth Street front between the wings.
  {
    const r = rect(-81, 31, -25, N)
    tier(brick, trim, roof, r, 0, 19.5)
    rectBays(win, r, [[4.5, 9.5], [11, 17.5]], { bay: 2.6, gap: 1.6, skip: [0, 1, 3] })
  }
  // The block behind, on the podium.
  tier(brick, trim, roof, rect(-72, -22, -16, -6), PODIUM - 1, 32.5)
  rectBays(win, rect(-72, -22, -16, -6), [[PODIUM + 1.5, 30.5]], { bay: 2, gap: 1.4 })
  // End wings to Fifth Street, 54.5 m.
  for (const [x0, x1] of [[-91, -81], [-25, -15]]) {
    const r = rect(x0, 8, x1, N)
    tier(brick, trim, roof, r, 0, 54.5)
    rectBays(win, r, groups(PODIUM + 1.5, 53), { bay: 1.3, gap: 1.8, end: 1.3 })
    rectBays(win, r, [[4.5, 10], [11.5, 20.5]], { bay: 2, gap: 1.4, end: 1.3, skip: [0, 1, 3] })
  }
  // The link between the east wing and the tower's shoulder.
  {
    const r = rect(-15, 11, -11, 25)
    tier(brick, trim, roof, r, PODIUM - 1, 47.5)
  }
  // The slab, its top corners stepped, and the raised centre.
  {
    const r = rect(-81, 11, -25, 31)
    tier(brick, trim, roof, r, PODIUM - 1, 92.5)
    const r2 = rect(-79, 11.5, -27, 30.5)
    tier(brick, trim, roof, chamfer(r2, 2), 92.5, 100.5)
    rectBays(win, r, groups(PODIUM + 1.5, 91), { bay: 1.3, gap: 1.8, end: 2.5 })
    rectBays(win, r2, [[93.5, 99]], { bay: 1.3, gap: 1.8, end: 3.5 })
    const c = rect(-64, 13, -42, 31)
    tier(brick, trim, roof, c, 100, 107.5)
    rectBays(win, c, [[101, 106]], { bay: 1.3, gap: 1.8, skip: [1, 3] })
  }

  // ---- Office tower.
  // Shoulders north and south of the shaft, with a ledge at 58.5.
  for (const [y0, y1] of [[-23, -5], [11, 31]]) {
    const lo = rect(-11, y0, 19, y1)
    tier(brick, trim, roof, lo, PODIUM - 1, 58.5)
    const hi = rect(-9, y0 + 2, 17, y1 - 2)
    tier(brick, trim, roof, hi, 58.5, 76.5)
    rectBays(win, lo, groups(PODIUM + 1.5, 57), { bay: 1.3, gap: 1.8, end: 1.4 })
    rectBays(win, hi, groups(60, 75), { bay: 1.3, gap: 1.8, end: 1.4 })
  }
  // The shaft and the cascade of the crown, centred on (2.5, 4).
  const CX = 2.5, CY = 4
  const box = (hx: number, hy: number): XY[] => rect(CX - hx, CY - hy, CX + hx, CY + hy)
  // half-x, half-y, top
  const steps: [number, number, number][] = [
    [10, 21, 141.5],
    [9.5, 19, 148.5],
    [9, 17, 155.5],
    [8.5, 15, 162],
    [8, 13, 166.5],
    [7.5, 11.5, 171],
  ]
  let z = PODIUM - 1
  steps.forEach(([hx, hy, top], i) => {
    // The corners of the upper steps are notched a little, as the photos
    // show each step turning the corner.
    const r = i === 0 ? box(hx, hy) : chamfer(box(hx, hy), 1.0)
    tier(brick, trim, roof, r, z, top)
    const g = i === 0 ? groups(PODIUM + 1.5, top - 1.5) : [[z + 1, top - 1.2]] as [number, number][]
    rectBays(win, box(hx, hy), g, { bay: 1.3, gap: 1.8, end: i === 0 ? 1.4 : 2.2 })
    z = top
  })
  // Penthouse on the roof.
  block(brick, roof, rect(CX - 3, CY - 4, CX + 3, CY + 4), 171, 176, 0.3)

  // The crown floodlit at night, brightest at the top.
  const flood = (p: V3, n: V3) => (p[2] > 138 && p[0] > -12 && p[0] < 18 ? (0.5 + 0.5 * Math.min(1, (p[2] - 138) / 33)) * (n[2] > 0.7 ? 0.3 : 1) : 0)
  return [
    { part: brick, material: { ...finish('carew-brick', 0xd8c4a0), floodlight: flood } },
    { part: stone, material: PALETTE.stone },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('cin-carew-tower', 'Carew Tower', [39.10072, -84.51329], 348.9, build(), 6500)
