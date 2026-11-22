/**
 * Robert Moses Niagara Power Plant (1961, New York Power Authority; 13
 * units), Niagara Gorge, Lewiston, New York: procedural, CC0-1.0.
 * bun generators/niagara-robert-moses-power-plant.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the plant runs
 * due north-south in the NAIP photo). Anchor = the lead's point inside
 * the OSM plant area way/111646277, 43.14241, -79.03978. y = 0 is the
 * river: the lowest ground under the footprint (tailwater, 77.3 m above
 * sea level in the lidar). The water is the map's, not modelled.
 *
 * Identity: a colossal concrete powerhouse built into the American wall
 * of the gorge: a sheer intake wall 97 m high along the cliff top, with
 * a row of thirteen great triangular buttress fins folded across its
 * lower half, stepping down to a long low powerhouse deck at the river
 * with a row of pyramid skylights and a spine of hexagonal hatches, a
 * red gantry crane, and tall plain towers at both ends (the south one
 * carrying the Power Vista's lookout).
 *
 * Evidence:
 * - plan: USGS NAIP orthophoto (0.8 m, public domain) read in this frame:
 *   the river front at x -97; the deck to x -58, its thirteen skylights
 *   (12 m square, at 25.8 m) and the hatch spine; the fins from x -30 to
 *   the wall at x 16; the deck from y -95 to 240; the north tower x -37
 *   to 31, y 242 to 297 (a grid of beams on top); the red crane at y 227
 *   to 247; the south block x -87 to -36, y -177 to -101 (low pyramid
 *   roof); the Power Vista tower x -50 to -6, y -250 to -214 (joined east to
 *   the end of the intake wall, as the photos show it) and its
 *   footbridge east. OSM plant area way/111646277 agrees on the extent.
 *   The OSM buildings it draws over and replaces: way/948856991 (the
 *   north tower), way/948856964 (the south block), way/948856989 (a small
 *   block at the crane's end of the deck).
 * - section: USGS 3DEP lidar NY_FEMAR2_Central_B1_2018 (2018 flight), one
 *   150 m crop across the middle: the deck at 13.3 m (skylights to 15.0),
 *   the hatch spine x -58..-45 at 27.0, a roadway at 13 m along the foot
 *   of the fins, the fins' crests rising at about 1.2 m/m from 14.6 m at
 *   x -30 to 67.5 m at x 14 and the folds between them about 0.9 m/m to
 *   54 m (crests 25 m apart; drawn 71 and 50 m at the wall, since the
 *   4 m samples miss the sharp crests and deep folds the photos show), the intake wall's face at x 16 and its top
 *   94.6-97.7 m, the road behind at 100.7 m.
 * - photos (Wikimedia Commons), EVIDENCE:
 *   - "Robert Moses Niagara Power Plant.jpg", Gogerr, CC BY-SA 4.0 (from
 *     the north-west, across the river)
 *   - "Robert Moses Niagara Hydroelectric Power Station, New York, United
 *     States.jpg", Kokkarani, CC BY-SA 3.0 (from the west)
 *   - "Robert Moses Power Station from south, July 2023.jpg", Mr. Matté,
 *     CC BY-SA 4.0 (down the deck and the fins from the Power Vista)
 *
 * Estimated: the end towers' heights (to the wall top, from the photos),
 * the south block's height (42 m, scaled in Gogerr's photo against the
 * deck and the wall), the crane's size (scaled likewise), the hatches'
 * and openings' sizes. The crane moves along the deck; drawn where NAIP
 * shows it. Left out: the switchyard gantries, railings, the footbridge
 * to the Power Vista, the river ledge's detail.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, circle, panel, save, walls, type XY } from './chi-aon-center'
import { densify, rect } from './niagara-table-rock-centre'
import { capGrid, endWall, profileAt, slopeFace, type XZ } from './niagara-sir-adam-beck-2'

function build() {
  const conc = new Part(), deck = new Part(), light = new Part(), dark = new Part(), red = new Part(), win = new Part()

  const XR = -97, XD = -58, XS = -45, XT = -30, XW = 16, XE = 36 // river, deck, spine, fins' foot, wall face, wall back
  const YS = -95, YN = 240 // the deck's ends
  const NU = 13, U = (YN - YS) / NU // thirteen units, 25.8 m each
  const crest: XZ[] = [[XT, 14.5], [XW, 71]]
  const fold: XZ[] = [[XT, 13], [XW, 50]]

  // --- the intake wall, 97 m, from the Power Vista tower to the north tower
  const WS = -214, WN = 242
  walls(deck, densify(rect(XW, WS, XE, WN), 6), 0, 96.8)
  block(deck, deck, rect(XW, WS, XE, WN), 96.8, 97.7, 0.4)
  // faint vertical joints on its face, above the fins
  for (let y = WS + 18; y < WN - 6; y += 24) panel(conc, [XW, WN], [XW, WS], WN - y - 0.5, WN - y + 0.5, 72, 95.5, 0.04)

  // --- the folded fins: crest at each unit's middle, fold between
  const n = 6 // pieces down the slope
  const xs = Array.from({ length: n + 1 }, (_, i) => XT + ((XW - XT) * i) / n)
  for (let k = 0; k < NU; k++) {
    const y0 = YS + U * k, ym = y0 + U / 2, y1 = y0 + U
    for (let i = 0; i < n; i++) {
      const a = xs[i], b = xs[i + 1]
      const fa = profileAt(fold, a), fb = profileAt(fold, b), ca = profileAt(crest, a), cb = profileAt(crest, b)
      // the south face (fold y0 up to crest ym) and the north face (crest ym down to fold y1)
      conc.quad([a, y0, fa], [b, y0, fb], [b, ym, cb], [a, ym, ca])
      conc.quad([a, ym, ca], [b, ym, cb], [b, y1, fb], [a, y1, fa])
    }
    // the fin's foot: a small upright triangle where the crest leaves the roadway
    conc.tri([XT, y0, 13], [XT, ym, 14.5], [XT, y1, 13])
  }
  // south of the deck the slope runs on plain, to the Power Vista tower
  slopeFace(conc, fold, WS, YS, 6)
  endWall(conc, fold, WS, 0, true)
  // the slope's north end against the north tower is hidden in it

  // --- the powerhouse deck at the river, 13.3 m, and the roadway along the fins' foot
  walls(conc, densify(rect(XR, YS, XT, YN), 5), 0, 13.3)
  capGrid(deck, XR, YS, XS, YN, 13.3, 6)
  capGrid(deck, XS, YS, XT, YN, 13.0, 6)
  // the hatch spine, 27 m, with a dark opening under it per unit on the river side and a hexagonal hatch on top
  block(conc, deck, rect(XD, YS + 2, XS, YN - 2), 13.3, 27, 0.4)
  for (let k = 0; k < NU; k++) {
    const yc = YS + U * (k + 0.5)
    panel(dark, [XD, YN - 2], [XD, YS + 2], YN - 2 - yc - 9, YN - 2 - yc + 9, 15, 24, 0.05)
    const hex = circle((XD + XS) / 2, yc, 4.6, 6, 0)
    cap(dark, hex, 27.05)
    // the pyramid skylight on the deck
    const s = 6, x0 = -78.5, x1 = -66.5, z0 = 13.3, z1 = 16.2
    const c: V3 = [(x0 + x1) / 2, yc, z1]
    const q: V3[] = [[x0, yc - s, z0], [x1, yc - s, z0], [x1, yc + s, z0], [x0, yc + s, z0]]
    for (let i = 0; i < 4; i++) light.tri(q[i], q[(i + 1) % 4], c)
  }
  // a pale band along the river face's top
  panel(light, [XR, YN], [XR, YS], 0, YN - YS, 11.2, 12.4, 0.05)

  // --- the north tower, to the wall top, a grid of beams over its top
  const NT = rect(-37, WN, 31, 297)
  walls(deck, densify(NT, 6), 0, 97.2)
  block(deck, null, NT, 97.2, 98.2, 0.4)
  const ti = rect(-36.6, WN + 0.4, 30.6, 296.6)
  cap(dark, ti, 96.4)
  walls(conc, ti.slice().reverse(), 96.4, 98.2)
  for (let i = 1; i < 5; i++) { const x = -37 + (68 * i) / 5; block(deck, deck, rect(x - 0.8, WN + 0.4, x + 0.8, 296.6), 96.4, 98.0, 0) }
  for (let j = 1; j < 4; j++) { const y = WN + (55 * j) / 4; block(deck, deck, rect(-36.6, y - 0.8, 30.6, y + 0.8), 96.4, 98.0, 0) }

  // --- the red gantry crane, at the north end of the deck
  block(red, red, rect(-70, 227, -46, 247), 13.3, 38, 0.4)
  for (const [a, b] of [[[-70, 227], [-46, 227]], [[-70, 247], [-70, 227]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(dark, a, b, 3, L - 3, 14, 27, 0.05)
  }

  // --- the south block on the deck's south end, a low pyramid roof
  const SB = rect(-87, -177, -36, -101)
  walls(conc, densify(SB, 6), 0, 42)
  block(conc, null, SB, 42, 42.8, 0.3)
  {
    const c: V3 = [-61.5, -139, 47.5]
    const r: V3[] = [[-86.7, -176.7, 42.8], [-36.3, -176.7, 42.8], [-36.3, -101.3, 42.8], [-86.7, -101.3, 42.8]]
    for (let i = 0; i < 4; i++) deck.tri(r[i], r[(i + 1) % 4], c)
  }
  for (const [a, b] of [[[-87, -101], [-87, -177]], [[-87, -177], [-36, -177]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.round(L / 7)
    for (let k = 0; k < m; k++) panel(win, a, b, (L * k) / m + 1.4, (L * (k + 1)) / m - 1.4, 26, 38, 0.05)
  }

  // --- the Power Vista tower at the south end, its lookout pavilion on top
  const PV = rect(-50, -250, -6, WS)
  walls(deck, densify(PV, 6), 0, 100)
  block(deck, deck, PV, 100, 101, 0.4)
  // its east part closes on the end of the intake wall, at the wall's height
  const PE = rect(-6, -250, XE, WS)
  walls(deck, densify(PE, 6), 0, 96.8)
  block(deck, deck, PE, 96.8, 97.7, 0.4)
  block(win, deck, rect(-44, -246, -16, -220), 101, 105.5, 0.2)
  for (const [a, b] of [[[-50, WS], [-50, -250]]] as [XY, XY][]) panel(win, a, b, 6, 30, 88, 95, 0.05)

  return [
    { part: conc, material: finish('moses-concrete', 0xd0ccc3) },
    { part: deck, material: finish('moses-wall', 0xbcbdba) },
    { part: light, material: PALETTE.trim },
    { part: dark, material: finish('moses-dark', 0x4f555c) },
    { part: red, material: finish('moses-crane-red', 0xcc4652) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('niagara-robert-moses-power-plant', 'Robert Moses Niagara Power Plant', [43.14241, -79.03978], 0, build(), 6500)
