/**
 * Morrison Bridge (1958), over the Willamette River in Portland, Oregon:
 * procedural, CC0-1.0, no textures. bun generators/pdx-morrison-bridge.ts
 *
 * A Chicago-style double-leaf trunnion bascule: two great concrete piers,
 * tall plain blocks from the river to the deck holding the 940-ton
 * counterweights, each with a small concrete control house on its south
 * side; the leaves are deck trusses, deep at the piers and shallow at the
 * tips; deck trusses carry the two fixed spans to the banks. Grey-green
 * steel, pale concrete. Drawn closed.
 *
 * Frame: x across, y along the outline's axis (bearing 112.13, toward the
 * east bank), z up, metres. Origin at the centroid of the man_made=bridge
 * outline way/722118660; z = 0 the river in the map's terrain (Mapterhorn,
 * 1.75 m NAVD88; the 2019 lidar's water 1.82 m). elevation 0.
 *
 * OSM: way/722118660 the outline (replaced), 231 m from y = -115.6 to
 * +115.7, bulging south at the piers (y = +-37..53); the control houses
 * way/392702864 (y = -35) and way/392702866 (y = +35), x = 12..20, both
 * replaced. The approach outlines beyond the ends are left to the map.
 *
 * Lidar, USGS 3DEP OR_OLCMetro_2019 (2019), 1 m grid over the bascule span:
 * the roadway 23.3 m over the water (23.5 at mid-span), the deck from x =
 * -14 to +12; the control houses' roofs 30.0 m at y = +-34..38, x = 12..16;
 * the piers' fender tops 8.5 m at x = 16..24. Roadway elsewhere: see ROAD.
 *
 * Published (Wikipedia "Morrison Bridge"): main span 284 ft (87 m), 760 ft
 * (232 m) long, 90 ft (27 m) wide, 69 ft clear; 36 ft gears drive 940-ton
 * counterweights inside the piers.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Morrison Bridge - Portland, Oregon by MB298.jpg" (Kingofthedead, CC
 *   BY-SA 4.0): the whole bridge from the south-west bank, the piers, the
 *   houses, the deck trusses;
 * - "Morrison Bridge July 2016 - Portland, Oregon.jpg" (Kingofthedead, CC
 *   BY-SA 4.0) and "Morrison Bridge from Eastbank Esplanade.jpg" (Steve
 *   Morgan, CC BY-SA 3.0): the east side, the leaves' trusses;
 * - "Morrison Bridge west tower (operator's tower).jpg" (Steve Morgan, CC
 *   BY-SA 3.0): the control house, a narrow concrete shaft rising beside the
 *   deck to a wider glazed cab under a flat overhanging roof.
 *
 * Estimated: the piers' plans (16 x 32 m, y = +-37..53), the leaves' truss
 * depth (8 m at the piers to 2.5 m at the tips), the fixed spans' deck
 * trusses (6.5 m, Warren), the houses (a 3.8 m shaft, a 5 m cab glazed all
 * round, the roof 6.8 m over the deck to match the lidar).
 * Colour: the steel grey-green #6f7d74 in sun, pulled to #84918a; concrete
 * #c9c3b8.
 *
 * Doubts: the deck's underside at the tips of the leaves is not photographed
 * closely. Night: street lamps; the houses' windows lit.
 */
import { Part, type MaterialSpec } from './mesh'
import { face, piecewise, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { box, CONCRETE, deckBand, groundOf, pier, save, sidewalks, trussSide, WINDOW } from './pdx-hawthorne-bridge'

const GROUND: GroundGrid = {"y0":-130,"x0":-30,"step":10,"z":[[8.7,8.7,8.3,5.5,6,8.5,8.6],[0,0,0,0,0,0,0.1],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]}
const gnd = groundOf(GROUND)

const Y0 = -115.6, Y1 = 115.7
const XC = -1, HW = 13
const P0 = 37, P1 = 53                   // the piers span |y| = 37..53
const ROAD = piecewise([[-115.6, 21.5], [-53, 23.2], [0, 23.5], [53, 23.2], [115.7, 21.8]])

const steel = new Part(), conc = new Part(), glass = new Part()

// The leaves: deck trusses deep at the piers, shallow at the tips.
for (const s of [-1, 1]) {
  const [a, b] = s < 0 ? [-P0, 0] : [0, P0]
  const depth = (y: number) => 2.5 + 5.5 * Math.pow(Math.abs(y) / P0, 1.8)
  for (const x of [-10, -3.5, 3.5, 10]) trussSide(steel, { x: XC + x, y0: a, y1: b, panels: 6, bot: (y) => ROAD(y) - depth(y), top: (y) => ROAD(y) - 0.9, ends: 'vertical', web: 'warren', chordW: 0.6, chordD: 0.9, post: 0.45, diag: 0.5 })
}
// Fixed spans: Warren deck trusses.
for (const [a, b] of [[Y0, -P1], [P1, Y1]] as [number, number][])
  for (const x of [-10, -3.5, 3.5, 10]) trussSide(steel, { x: XC + x, y0: a, y1: b, panels: 8, bot: (y) => ROAD(y) - 7.4, top: (y) => ROAD(y) - 0.9, ends: 'vertical', web: 'warren', chordW: 0.6, chordD: 0.9, post: 0.45, diag: 0.5 })

// Deck plate, fascias, sidewalks and railings.
const ALL = stations(Y0, Y1, 8.9)
const shiftX = (p: Part, from: number) => { for (let i = from; i < p.pos.length; i += 3) p.pos[i] += XC }
const n0 = steel.pos.length
deckBand(steel, ALL, ROAD, HW, 1.0, true, 0.2)
sidewalks(conc, steel, ALL, ROAD, HW - 2.5, HW, 0.2, 1.1)
shiftX(steel, n0); shiftX(conc, 0)

// The piers: plain concrete blocks from the river to just under the deck, with fenders.
for (const s of [-1, 1]) {
  const yc = s * (P0 + P1) / 2
  pier(conc, gnd, yc, (P1 - P0) / 2, HW + 3, ROAD(yc) - 0.5, 1.0, 0.4, XC + 1.5)
  // The control house on the pier's south side, its roof at 30.0 m.
  const y = s * 36, z0 = ROAD(y) + 0.2
  // A narrow concrete shaft beside the deck, a wider glazed cab on top, a flat overhanging roof.
  box(conc, 12.4, 16.2, y - 1.9, y + 1.9, ROAD(y) - 0.5, z0 + 3.6)
  box(conc, 11.6, 17.0, y - 2.7, y + 2.7, z0 + 3.6, z0 + 4.1)
  box(conc, 11.8, 16.8, y - 2.5, y + 2.5, z0 + 4.1, z0 + 6.0)
  box(conc, 11.3, 17.3, y - 3.0, y + 3.0, z0 + 6.0, z0 + 6.6, true)
  for (const [x, nx] of [[11.78, -1], [16.82, 1]] as [number, number][]) face(glass, [x, y - 2.2, z0 + 4.25], [x, y + 2.2, z0 + 4.25], [x, y + 2.2, z0 + 5.9], [x, y - 2.2, z0 + 5.9], [nx, 0, 0])
  for (const ny of [-1, 1]) face(glass, [12.1, y + ny * 2.52, z0 + 4.25], [16.5, y + ny * 2.52, z0 + 4.25], [16.5, y + ny * 2.52, z0 + 5.9], [12.1, y + ny * 2.52, z0 + 5.9], [0, ny, 0])
}
// The bank piers at the ends.
for (const y of [Y0 + 3, Y1 - 3]) pier(conc, gnd, y, 3, HW, ROAD(y) - 8.0, 1.0, 0.5, XC)

const STEEL: MaterialSpec = { ...finish('bridge-grey-green', 0x84918a), doubleSided: true }
await save('pdx-morrison-bridge', 'Morrison Bridge', [{ part: steel, material: STEEL }, { part: conc, material: CONCRETE }, { part: glass, material: WINDOW }], {
  frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/722118660, on the river (1.75 m NAVD88)',
  bearing: 112.13, elevation: 0, height: 30.5,
})
