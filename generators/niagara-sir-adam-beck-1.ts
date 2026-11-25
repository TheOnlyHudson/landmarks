/**
 * Sir Adam Beck I Generating Station (1922, Ontario Hydro; first named
 * the Queenston-Chippawa plant), Niagara Gorge, Niagara Falls, Ontario:
 * procedural, CC0-1.0.
 * bun generators/niagara-sir-adam-beck-1.ts
 *
 * Uses the gorge helpers in niagara-sir-adam-beck-2.ts (merge that first).
 *
 * Map frame: x towards the river (east-north-east), y along the river
 * (north-north-west), z up, metres, turned to bearing 340.3, the long
 * sides of the OSM building way/663029714. Anchor = that outline's
 * centroid, 43.14902, -79.04447. y = 0 is the river: the lowest ground
 * under the footprint (tailwater, about 76 m above sea level). The water
 * is the map's, not modelled.
 *
 * Identity: a long buff-stone Beaux-Arts powerhouse standing in the river
 * at the foot of the gorge wall: a front hall with a row of tall
 * round-headed windows over a plain base, a taller rear block stepping up
 * behind it with a row of transformers on its roof, a pale roof house on
 * the front hall, and ten round penstock casings slanting down the cliff
 * into the back of the building from an arcade of round arches on the
 * cliff top.
 *
 * Evidence:
 * - plan: OSM building way/663029714 (176 x 46 m) and plant area
 *   way/158460554 (to the cliff top, 70 m behind the building's back).
 * - heights and section: USGS 3DEP lidar NY_FEMAR2_Central_B1_2018 (2018
 *   flight; it reaches the Ontario bank), a 210 m crop read in this frame:
 *   the river wall at x 26 (OSM draws it at 23) with a 2.6 m apron; the
 *   front hall's roof at 33.6 m, its parapet 35.3; the rear block x -36
 *   to -2, its deck at 47.5 m with transformers to 51.5-54.5 m; the roof
 *   house x 2..22, y -14..30 at 42.5 m; the building's ends at y = +-88
 *   on yards at 15 m; the penstocks rising from 48 m at x -37 to 85 m at
 *   x -60 at about 16 m spacing, the troughs between them up to 8 m
 *   lower near the top; the cliff top at 95 m. Mapterhorn agrees (deck
 *   48.3, front roof 35, cliff 96).
 * - photos (Wikimedia Commons), EVIDENCE:
 *   - "Adam Beck Complex.jpg", Ontario Power Generation, CC BY 2.0 (aerial
 *     from the north: the river front, the roofs, the penstocks and the
 *     arcade)
 *   - "Sir Adam Beck No. 1 Generating Station.jpg", Gogerr, CC BY-SA 4.0
 *     (the transformer deck from the cliff)
 *   - "Sir Adam Beck Hydroelectric Generating Station beside the Niagara
 *     River.jpg", Changku88, CC BY-SA 4.0 (the south end, far off)
 *   - "Power station on the Niagara River (27896070345).jpg", shankar s.,
 *     CC BY 2.0 (aerial from the south)
 *
 * Estimated: the window sizes and count (thirteen arched windows on the
 * river front, three on each end), the base and cornice bands, the
 * transformers' size and spacing, the penstock casings' width (9.6 m) and
 * round section, the arcade's arches. Left out: the gantries and wiring
 * on the deck, the stairs on the cliff, the steel in the older penstock
 * bays south of the building, railings, the forebay and screen house on
 * the cliff top behind the arcade. Doubts: the north end and the back are
 * seen only from the air.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, panel, save, walls, type XY } from './chi-aon-center'
import { archPanel, densify, rect } from './niagara-table-rock-centre'
import { capGrid, endWall, penstock, slopeFace, type XZ } from './niagara-sir-adam-beck-2'

function build() {
  const stone = new Part(), conc = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part()
  const YS = -88, YN = 88
  const XR = 26, XF = -2, XB = -36 // river wall, rear block's front wall, rear block's back wall

  // --- the front hall, river level to its parapet at 35.3, roof at 33.6
  const F = rect(XF, YS, XR, YN)
  walls(stone, densify(F, 5), 0, 34.8)
  block(stone, null, F, 34.8, 35.3, 0.25)
  cap(roof, rect(XF + 0.3, YS + 0.3, XR - 0.8, YN - 0.3), 33.6)
  walls(stone, rect(XF + 0.3, YS + 0.3, XR - 0.8, YN - 0.3).reverse(), 33.6, 35.05)
  // the plain base, standing a little proud, to 10 m
  const P = rect(XF, YS - 0.4, XR + 0.4, YN + 0.4)
  walls(stone, densify(P, 5), 0, 10)
  cap(stone, rect(XR, YS - 0.4, XR + 0.4, YN + 0.4), 10)
  for (const y of [YS - 0.4, YN + 0.4]) {
    // the plinth's top along the ends, on the outside only
    const a: XY = [XF, y], b: XY = [XR + 0.4, y]
    if (y < 0) stone.quad([a[0], y, 10], [b[0], y, 10], [b[0], y + 0.4, 10], [a[0], y + 0.4, 10])
    else stone.quad([a[0], y - 0.4, 10], [b[0], y - 0.4, 10], [b[0], y, 10], [a[0], y, 10])
  }
  // the cornice: a pale band round the hall at 29.4-30.6
  const K = rect(XF, YS - 0.45, XR + 0.45, YN + 0.45)
  walls(trim, K, 29.4, 30.6)
  cap(trim, K, 29.4, false)
  cap(trim, K, 30.6)
  // thirteen tall round-headed windows on the river front, three on each end
  const n = 13, L = YN - YS
  for (let k = 0; k < n; k++) {
    const s = ((k + 0.5) * L) / n
    archPanel(win, [XR, YS], [XR, YN], s - 2.7, s + 2.7, 13.5, 24.3, 0.05, 8)
    panel(win, [XR, YS], [XR, YN], s - 1.3, s + 1.3, 4.5, 7.5, 0.45) // a small window in the base under each
  }
  for (const [a, b] of [[[XR, YN], [XF, YN]], [[XF, YS], [XR, YS]]] as [XY, XY][]) {
    for (const s of [5.5, 14, 22.5]) archPanel(win, a, b, s - 2.4, s + 2.4, 17, 25.6, 0.05, 8)
  }

  // --- the rear block, to its transformer deck at 47.5
  const R = rect(XB, YS, XF, YN)
  walls(stone, densify(R, 5), 0, 47)
  block(stone, null, R, 47, 47.8, 0.3)
  capGrid(roof, XB + 0.3, YS + 0.3, XF - 0.3, YN - 0.3, 47.5, 9)
  walls(stone, rect(XB + 0.3, YS + 0.3, XF - 0.3, YN - 0.3).reverse(), 47.5, 47.8)
  // its front over the hall's roof: a row of windows, grouped by bay
  for (let k = 0; k < 16; k++) {
    const s = 2 + ((L - 4) * k) / 16
    panel(win, [XF, YS], [XF, YN], s + 1.2, s + (L - 4) / 16 - 1.2, 38.2, 44.6, 0.05)
  }
  // its ends: two rows of windows over the yards
  for (const [a, b] of [[[XF, YN], [XB, YN]], [[XB, YS], [XF, YS]]] as [XY, XY][]) {
    for (const s of [6, 13.5, 21, 28]) for (const [z0, z1] of [[29, 33], [38, 44]]) panel(win, a, b, s - 2, s + 2, z0, z1, 0.05)
  }
  // transformers in two rows on the deck
  for (let k = 0; k < 10; k++) {
    const y = -72 + 16 * k
    block(dark, roof, rect(-29, y - 4, -21, y + 4), 47.5, 53.5, 0.3)
    block(dark, roof, rect(-12, y - 3, -6, y + 3), 47.5, 51.5, 0.3)
  }

  // --- the roof house on the front hall
  const H = rect(2, -14, 22, 30)
  walls(trim, H, 33.6, 42)
  block(trim, null, H, 42, 42.6, 0.25)
  cap(roof, rect(2.3, -13.7, 21.7, 29.7), 42.6)
  for (const s of [6, 14, 22, 30, 38]) panel(win, [22, -14], [22, 30], s - 2, s + 2, 36, 40, 0.05)

  // --- the penstocks: ten round casings from the arcade down into the rear block
  const face: XZ[] = [[-61, 79.5], [-37, 47.5]]
  slopeFace(conc, face, YS, YN)
  endWall(conc, face, YS, 15, true)
  endWall(conc, face, YN, 15, false)
  for (let k = 0; k < 10; k++) penstock(conc, [[-60.5, 79.8], [-36.8, 47.6]], -72 + 16 * k, 9.6, 6.2, 6)
  // the arcade along the cliff top: a wall with a row of round arches
  const A = rect(-66, YS, -61, YN)
  block(conc, conc, densify(A, 8), 70, 95.6, 0.4)
  for (let k = 0; k < 20; k++) {
    const s = ((k + 0.5) * L) / 20
    archPanel(dark, [-61, YS], [-61, YN], s - 2.7, s + 2.7, 83.6, 90.6, 0.05, 8)
  }

  return [
    { part: stone, material: finish('beck-stone', 0xddcbb0) },
    { part: conc, material: finish('beck-concrete', 0xd3ccbf) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: finish('beck-roof', 0xc4c6c4) },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('beck-dark', 0x51575e) },
  ]
}

if (import.meta.main) await save('niagara-sir-adam-beck-1', 'Sir Adam Beck I Generating Station', [43.14902, -79.04447], 340.3, build(), 6500)
