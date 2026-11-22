/**
 * Adams Power Plant Transformer House (1895, McKim, Mead & White), 1501
 * Buffalo Avenue, Niagara Falls, New York: procedural, CC0-1.0. National
 * Historic Landmark, the surviving building of the Edward Dean Adams
 * power station, the first large alternating-current plant.
 * bun generators/niagara-adams-transformer-house.ts
 *
 * Map frame: x across the building (toward bearing 132.7, south-east), y
 * along it (toward bearing 42.7, north-east), z up, metres; placed at
 * bearing 42.7. Anchor = centroid of the OSM outline way/593546305's
 * vertices, 43.081826, -79.042815.
 *
 * Identity: a long one-storey hall of rough-faced buff ashlar under a grey
 * slate hipped roof, lit by a long row of round-headed windows on both
 * sides; two cross-gabled pavilions break the roof at about a quarter and
 * three-quarters of its length, with plain classical pediments (an oculus
 * in each) on both long sides; on the south-east side the pavilions
 * project, and the north-eastern one has the big round-arched doorway.
 *
 * Evidence:
 * - plan: OSM way/593546305: the hall 76.5 x 12.5 m; pavilions 9.5-10 m
 *   wide projecting 5.7 m to the south-east (as the south-side photo
 *   shows them).
 * - heights: estimated from the photos (no published height; one storey):
 *   eaves 7 m, ridge 9.9 m (a 23-degree slate roof), the cross gables'
 *   ridges at the same height; windows about 1.9 m wide, sills 1.4 m,
 *   heads 5.95 m, at about 3.2 m centres. +-1 m.
 * - colours: daylight photos, pulled to the palette (buff-grey stone,
 *   grey slate).
 * No lidar used: a low building whose roof the photos settle.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "AdamsPowerPlantSE.jpg", Lvklock, CC BY-SA 3.0 (from the south-east)
 *   https://commons.wikimedia.org/wiki/File:AdamsPowerPlantSE.jpg
 * - "AdamsPowerPlantSside.jpg", Lvklock, CC BY-SA 3.0 (south-east side)
 *   https://commons.wikimedia.org/wiki/File:AdamsPowerPlantSside.jpg
 * - "AdamsPowerPlantNside.jpg", Lvklock, CC BY-SA 3.0 (north-west side)
 *   https://commons.wikimedia.org/wiki/File:AdamsPowerPlantNside.jpg
 * - "AdamsPowerPlant DateUnknown HABS 15 GeneralViewFromSoutheast
 *   cropped.jpg", HABS, public domain (the plant before the power house
 *   was demolished)
 *   https://commons.wikimedia.org/wiki/File:AdamsPowerPlant_DateUnknown_HABS_15_GeneralViewFromSoutheast_cropped.jpg
 * No commercial imagery.
 *
 * Simplified: the rustication, the window glazing bars and the pediment
 * mouldings are left out; window counts follow the photos roughly (one
 * every 3.2 m). Doubt: which pavilion has the big doorway is read from the
 * oblique SE photo; the other pavilion gets three arched windows, as the
 * south-side photo shows. Night: the building is disused and unlit, so
 * nothing glows but the windows' material name.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { archPanel, densify, gableRoof, hipRoof } from './niagara-table-rock-centre'

const X0 = -12.3, X1 = 0.17, Y0 = -38.5, Y1 = 38.0 // the hall
const PX = 5.8 // the pavilions' south-east face
const PAV: [number, number][] = [[-19.8, -9.8], [10.3, 19.8]]
const EAVE = 7, RISE = 2.9

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), door = new Part(), trim = new Part()

  // walls, split for terrain
  walls(stone, densify(rect(X0, Y0, X1, Y1), 5), 0, EAVE)
  for (const [y0, y1] of PAV) walls(stone, densify(rect(X1 - 0.5, y0, PX, y1), 5), 0, EAVE)
  // a plinth course round the base
  walls(trim, densify(rect(X0 - 0.12, Y0 - 0.12, X1 + 0.12, Y1 + 0.12), 5), 0, 0.9)

  hipRoof(roof, X0, Y0, X1, Y1, EAVE, RISE, 0.6, 0.35, trim)
  for (const [y0, y1] of PAV) {
    gableRoof(roof, stone, X0, y0, PX, y1, EAVE, RISE, true, 0.5, 0.3)
    // the stone pediments, set just proud of the roof slab's ends so they
    // read as stone (as in the photos), not as roof
    const m = (y0 + y1) / 2, zt = EAVE + RISE - 0.25
    trim.tri([PX + 0.36, y0 - 0.3, EAVE], [PX + 0.36, y1 + 0.3, EAVE], [PX + 0.36, m, zt])
    trim.tri([X0 - 0.36, y1 + 0.3, EAVE], [X0 - 0.36, y0 - 0.3, EAVE], [X0 - 0.36, m, zt])
  }

  const W = 1.9, SILL = 1.4, SPRING = 5.0
  const row = (a: XY, b: XY, from: number, to: number) => {
    const n = Math.max(1, Math.round((to - from) / 3.2)), pitch = (to - from) / n
    for (let k = 0; k < n; k++) {
      const c = from + (k + 0.5) * pitch
      archPanel(win, a, b, c - W / 2, c + W / 2, SILL, SPRING, 0.05, 8)
    }
  }
  // north-west side: one long row (wall runs from y = Y1 to Y0)
  row([X0, Y1], [X0, Y0], 1.2, Y1 - Y0 - 1.2)
  // south-east side, between and beyond the pavilions (wall runs Y0 -> Y1)
  const se = (y: number) => y - Y0
  row([X1, Y0], [X1, Y1], 1.2, se(PAV[0][0]) - 0.6)
  row([X1, Y0], [X1, Y1], se(PAV[0][1]) + 0.6, se(PAV[1][0]) - 0.6)
  row([X1, Y0], [X1, Y1], se(PAV[1][1]) + 0.6, Y1 - Y0 - 1.2)
  // the hipped ends: three windows each
  row([X1, Y1], [X0, Y1], 2.2, X1 - X0 - 2.2)
  row([X0, Y0], [X1, Y0], 2.2, X1 - X0 - 2.2)

  // the pavilions' south-east faces: the doorway, or three windows; an
  // oculus in every pediment
  PAV.forEach(([y0, y1], i) => {
    const a: XY = [PX, y0], b: XY = [PX, y1]
    const L = y1 - y0, c = L / 2
    if (i === 1) {
      archPanel(door, a, b, c - 1.8, c + 1.8, 0, 3.6, 0.06, 10)
      archPanel(trim, a, b, c - 2.3, c + 2.3, 0, 3.6, 0.03, 10)
      for (const s of [c - 3.4, c + 3.4]) archPanel(win, a, b, s - 0.7, s + 0.7, SILL, SPRING - 0.3, 0.05, 8)
    } else {
      for (const s of [c - 2.6, c, c + 2.6]) archPanel(win, a, b, s - 0.9, s + 0.9, SILL, SPRING, 0.05, 8)
    }
    for (const [p, q] of [[a, b], [[X0, y1] as XY, [X0, y0] as XY]]) oculus(win, p, q, L / 2, EAVE + 1.15, 0.6)
    // the pediment's base cornice across the face
    panel(trim, a, b, -0.3, L + 0.3, EAVE - 0.45, EAVE, 0.12)
    panel(trim, [X0, y1], [X0, y0], -0.3, L + 0.3, EAVE - 0.45, EAVE, 0.12)
  })

  return [
    { part: stone, material: finish('adams-stone', 0xd6c9ad) },
    { part: trim, material: finish('adams-trim', 0xe6dcc6) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('adams-door', 0x6e6257) },
  ]
}

/** A round window (12 sides) on wall a→b, centred s along it at height z. */
function oculus(p: Part, a: XY, b: XY, s: number, z: number, r: number) {
  const { P } = onWall(a, b)
  const c = P(s, z, 0.42)
  for (let i = 0; i < 12; i++) {
    const t0 = (i / 12) * Math.PI * 2, t1 = ((i + 1) / 12) * Math.PI * 2
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), 0.42), P(s + r * Math.cos(t1), z + r * Math.sin(t1), 0.42))
  }
}

if (import.meta.main) await save('niagara-adams-transformer-house', 'Adams Power Plant Transformer House', [43.081826, -79.042815], 42.7, build())
