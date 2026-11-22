/**
 * Broadway Bridge (1913; Ralph Modjeski), over the Willamette River in
 * Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-broadway-bridge.ts
 *
 * The world's largest Rall-type bascule: two 139 ft leaves that roll back
 * on wheels over two granite-faced piers, between two 297 ft Pennsylvania
 * (Petit) through trusses, with shorter Pratt spans over the banks. The top
 * chords swell to their highest over the bascule piers and dip to mid-span;
 * the counterweights stand over the piers outside the trusses; sidewalks are
 * cantilevered outside the trusses. Painted "Golden Gate" red-orange. Drawn
 * closed.
 *
 * Frame: x across, y along the outline's axis (bearing 52.51, toward the
 * east bank), z up, metres. Origin at the centroid of the man_made=bridge
 * outline way/392707014; z = 0 the river in the map's terrain (Mapterhorn,
 * 1.75 m NAVD88; the 2019 lidar's water 1.86 m). elevation 0.
 *
 * OSM: way/392707014 the outline (replaced), 456 m from y = -231 to +225,
 * all of it trussed; its notch at y = -47..-42 marks the west bascule pier.
 * The west approach outline way/736664843 (ramps over the rail yard) and the
 * road way/119646676's west part are left to the map.
 *
 * Published: HAER OR-22 sheet 1 "South Elevation" (BroadwayBridgeHAER.png,
 * Joseph A. Boquiren and Manuel Hernandez, 1999, public domain): fixed spans
 * 297'-2" (91 m), leaves 139'-0" (42 m) each; the top chords 9 m over the
 * deck at the fixed spans' outer ends, 14.6 m at their middles, 16 m over the
 * bascule piers, 9 m at the leaves' tips; the deck about 27 m over low
 * water; concrete piers with granite facing, 12 ft steel-jacketed caissons
 * at the fixed spans' outer ends. Wikipedia "Broadway Bridge (Portland,
 * Oregon)": 1,742 ft with approaches, 70 ft wide.
 *
 * Lidar, USGS 3DEP OR_OLCMetro_2019 (2019), 1 m grid over the bascule span:
 * the roadway 28.8 m over the water; the trusses at x = +-8; the top chord
 * 39.0 m at mid-span (y = -2), 45.3 m over the piers (y = -44, +40); the
 * counterweight machinery to 35.7 m at x = +-12 beside the piers.
 * Roadway: see ROAD (tools/bridge_ele.py measure on the carriageway).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Broadwaybridgepano.jpg" (Cacophony, CC BY 3.0): the whole bridge from
 *   the Fremont Bridge, the wave of the top chords, the bank spans;
 * - "Broadway Bridge, Portland HDR (18017408858).jpg" (Tony Webster, CC BY
 *   2.0): the portal, the Pennsylvania web with its sub-panels, the
 *   sidewalk outside the truss;
 * - USGS NAIP (public domain): the plan, the piers and banks.
 *
 * Estimated: the bank spans (two Pratt spans each side, 8 m deep), panel
 * counts and member sizes, the counterweight boxes, the piers' plans
 * (bascule piers 12 x 26 m), sidewalk width.
 * Colour: red-orange #c0472e in sun, pulled to #b95a40; concrete #c9c3b8.
 *
 * Doubts: the Pennsylvania trusses' subdivided web is drawn as plain Pratt
 * panels; the bank spans' depths are from the panorama only.
 */
import { Part, type MaterialSpec } from './mesh'
import { piecewise, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { block, box, CONCRETE, deckBand, groundOf, pier, save, sidewalks, throughTruss } from './pdx-hawthorne-bridge'

// Map terrain (Mapterhorn) minus 1.75 m, 10 m apart in this frame (x -20..20, y -240..240).
const GROUND: GroundGrid = {"y0":-240,"x0":-30,"step":10,"z":[[8.7,8.7,8.4,8.3,8.3,8.3,8.4],[8.6,7.9,8.3,8.3,8.4,8.3,8.4],[8.1,8.2,8.3,8.4,8.5,8.5,8.5],[8.2,8.2,8.2,8.3,8.3,8.4,8.4],[8.4,8.4,8.4,8.4,8.3,8.5,8.5],[8.6,8.8,8.6,8.6,8.5,8.6,8.6],[8.8,8.9,9,8.9,9.1,9.2,9.5],[9.4,9.3,9.3,9.1,9.2,9.6,9.1],[8.4,8.5,8.6,9.3,9.4,9.6,9.3],[4.9,5.2,7.8,9.4,9.3,9.7,9.6],[1.6,2.8,6.7,7.7,9.1,9.1,10.1],[0,0,0,0,0.1,8.7,3.3],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0.3,0.8,1.8,2.5],[1.9,4.9,5.9,7.2,8.3,8.6,9.1],[9,9.3,9.3,9.4,9.4,9.4,9.4],[9.4,9.6,9.6,9.6,9.6,10.1,11.8],[9.6,9.7,11.5,13.8,15.6,16.5,16.7],[16.2,18.4,17.7,17.7,17.7,17.5,17.5],[18.8,18.6,18.3,18.2,18.1,18.2,18.1],[17.4,17.2,17.2,17.3,17.2,17.3,17.4],[17.2,17.2,17.3,17.3,17.4,17.4,17.4],[16.4,16.3,20.6,20.9,18,16.4,16.4],[20.3,23.1,23.6,23.7,23.4,22.4,19.5],[23.1,23.2,23.6,23.7,23.4,23.4,22.2]]}
const gnd = groundOf(GROUND)

const Y0 = -231, Y1 = 225                // the outline's ends
const PW = -44, PE = 40                  // bascule pier centres
const FW = -135, FE = 131                // the fixed spans' outer ends (the banks)
const XT = 8
const ROAD = piecewise([[-231, 28.4], [-135, 28.8], [131, 28.8], [225, 27.0]])
const BOT = (y: number) => ROAD(y) - 0.6

const red = new Part(), conc = new Part()

// Fixed Pennsylvania spans: low at the bank, swelling to the bascule pier.
const fixedTop = (outer: number, inner: number) => {
  const f = piecewise([[0, 9], [0.25, 13], [0.5, 14.6], [0.75, 15.6], [1, 16.5]])
  return (y: number) => ROAD(y) + f((y - outer) / (inner - outer))
}
throughTruss(red, { x: XT, y0: FW, y1: PW - 5, panels: 10, bot: BOT, top: fixedTop(FW, PW - 5), chordW: 0.8, chordD: 1.0, post: 0.55, diag: 0.45, endW: 1.1 })
throughTruss(red, { x: XT, y0: PE + 5, y1: FE, panels: 10, bot: BOT, top: fixedTop(FE, PE + 5), chordW: 0.8, chordD: 1.0, post: 0.55, diag: 0.45, endW: 1.1 })
// The leaves: tall over the piers, dipping to 10 m at mid-span.
const mid = (PW + PE) / 2
const leafTop = (y: number) => ROAD(y) + 10.2 + 6.3 * Math.pow(Math.abs(y - mid) / ((PE - PW) / 2 + 5), 1.6)
throughTruss(red, { x: XT, y0: PW - 5, y1: mid, panels: 5, bot: BOT, top: leafTop, ends: 'vertical', chordW: 0.8, chordD: 1.0, post: 0.6, diag: 0.45, endW: 1.2 })
throughTruss(red, { x: XT, y0: mid, y1: PE + 5, panels: 5, bot: BOT, top: leafTop, ends: 'vertical', chordW: 0.8, chordD: 1.0, post: 0.6, diag: 0.45, endW: 1.2 })
// Bank spans: Pratt trusses with curved tops.
const pratt = (a: number, b: number) => (y: number) => ROAD(y) + 6.2 + 2.2 * Math.sin(Math.PI * (y - a) / (b - a))
for (const [a, b] of [[Y0, (Y0 + FW) / 2], [(Y0 + FW) / 2, FW], [FE, (FE + Y1) / 2], [(FE + Y1) / 2, Y1]] as [number, number][])
  throughTruss(red, { x: XT, y0: a + 0.6, y1: b - 0.6, panels: 6, bot: BOT, top: pratt(a, b), chordW: 0.7, chordD: 0.8, post: 0.45, diag: 0.4 })

// Counterweights and machinery over the bascule piers, outside the trusses.
for (const y of [PW, PE]) for (const s of [-1, 1]) box(red, s > 0 ? XT + 0.6 : -XT - 4.4, s > 0 ? XT + 4.4 : -XT - 0.6, y - 4.5, y + 4.5, ROAD(y) - 1, ROAD(y) + 6.8, true)

// Deck, sidewalks and railings.
const ALL = stations(Y0, Y1, 9.1)
deckBand(conc, ALL, ROAD, 11.4, 1.5, true, 0.2)
sidewalks(conc, red, ALL, ROAD, 8.7, 11.3, 0.2, 1.1)

// Piers: the granite-faced bascule piers, caissons at the banks, bents under the bank spans.
for (const y of [PW, PE]) pier(conc, gnd, y, 6, 13, ROAD(y) - 1.6, 2.0, 0.8)
for (const y of [FW, FE]) pier(conc, gnd, y, 2.4, 10.5, ROAD(y) - 1.6, 1.0, 0.4)
for (const y of [Y0 + 2, (Y0 + FW) / 2, (FE + Y1) / 2, Y1 - 2]) for (const s of [-1, 1]) block(conc, gnd, s * XT - 1.1, s * XT + 1.1, y - 1.1, y + 1.1, ROAD(y) - 1.6, 0.5)

const RED: MaterialSpec = { ...finish('bridge-red-orange', 0xb95a40), doubleSided: true }
await save('pdx-broadway-bridge', 'Broadway Bridge', [{ part: red, material: RED }, { part: conc, material: CONCRETE }], {
  frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/392707014, on the river (1.75 m NAVD88)',
  bearing: 52.51, elevation: 0, height: 45.5,
})
