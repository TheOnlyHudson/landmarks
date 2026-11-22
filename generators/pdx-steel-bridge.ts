/**
 * Steel Bridge (1912; Waddell & Harrington), over the Willamette River in
 * Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-steel-bridge.ts
 *
 * The world's only double-deck bridge with independent lifts: a 211 ft
 * through-truss lift span between two tall lattice towers, the lower rail
 * deck able to rise alone into the upper span (drawn down, both decks
 * closed); two fixed Pratt spans of about 85 m to the banks with the upper
 * deck riding on their top chords and the Union Pacific tracks on the lower
 * deck between them; the road lanes cantilevered outside the trusses on the
 * upper deck, MAX light rail between them; the concrete counterweights high
 * in the towers; the gate tender's house on the lift span. Black steel.
 *
 * Frame: x across, y along bearing 56.8 (the lift span's tracks, toward the
 * east bank), z up, metres. Origin at the centroid of the man_made=bridge
 * outline way/733481169; z = 0 the river in the map's terrain (Mapterhorn,
 * 1.75 m NAVD88; the 2019 lidar's water reads 1.83 m). elevation 0.
 * The structure's centre line is x = -8 (the outline also takes in the
 * curved ramps at both ends, which pull its centroid off the river spans).
 *
 * OSM: the rail ways (layer 1) split at y = 3 and 69, the lift span's ends;
 * the upper-deck road ways at x = -15 and +1, the MAX tracks at x = -9 and
 * -5, footways at x = -17 and +3; the lower-deck walkway at x = +3 (layer
 * 1). The bridge relation/11739427.
 *
 * Placement: `replaces` is left empty. The outline way/733481169 runs on
 * over the curved ramps and approach viaducts at both ends (y < -95 and
 * y > 185), which this model doesn't draw; listing it would leave those
 * without piers on the map. The map draws its own piers and parapets under
 * and along the river spans. Splitting the outline in OSM at the banks
 * would let a later version list the river part.
 *
 * Lidar, USGS 3DEP OR_OLCMetro_2019 (2019), 1 m grid over the lift span:
 * truss planes at x = -14 and -2 (the top bracing between them); the
 * upper deck 25.6 m over the water from x = -19 to +4.5, past the trusses on
 * both sides; the lift span's top chord 43-44.6 m, the gate tender's house
 * on it to 50.6 m over y = 28..44; the towers' tops 81.7 m over y = -6..4
 * and 68..78, x = -14..0.
 * Terrain (Mapterhorn): the west seawall at y = -90 (bank 8.8 m), the east
 * bank from y = 165 (9.5 m).
 *
 * Published (Wikipedia "Steel Bridge"): lift span 211 ft (64 m); 26 ft
 * (7.9 m) under the lower deck at low water, 72 ft with the lower deck
 * raised, 163 ft fully raised; 71 ft (22 m) wide; the lift cables roughly
 * 270 ft high.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Double lift bridge across Willamette River in Portland,Oregon -
 *   panoramio (1).jpg" (Loco Steve, CC BY 3.0): the towers, their
 *   counterweights, the house, the fixed span's Pratt web and the two decks;
 * - "General view from northwest - Steel Bridge ... HAER ORE,26-PORT,14-1"
 *   (HAER, public domain): the whole river crossing in elevation;
 * - USGS NAIP (public domain): the plan, the house on the lift span;
 * - "Aerial views of Portland bridges (54042794214).jpg" (Oregon Department
 *   of Transportation, CC BY 2.0): from the south, with the other bridges.
 *
 * Estimated: the lower deck (rail at 10 m, from the published clearance and
 * the banks); the fixed spans' depth (the bottom chord at the lower deck,
 * the top chord under the upper deck); panel counts; member sizes; the
 * towers' bracing, counterweights (concrete, z 56-77) and sheaves; the
 * piers' plans; the short straight approaches drawn to y = -112 and +185.
 * Colour: black steel, drawn charcoal #4c5158 (STYLE: a dark colour that is
 * the identity stays dark, no darker than charcoal); concrete counterweights
 * #8f8b84; the house #e6e0d4.
 *
 * Doubts: no photo shows the lower deck's underside closely; the approaches
 * beyond the banks are left to the map. Night: street lamps only.
 */
import { Part, type MaterialSpec } from './mesh'
import { face, piecewise, stations, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'
import { beam, block, box, CONCRETE, deckBand, drumX, groundOf, hipRoof, pier, save, sidewalks, throughTruss, trussSide, WINDOW } from './pdx-hawthorne-bridge'

// Map terrain (Mapterhorn) minus 1.75 m, 10 m apart in this frame (x -30..30, y -130..200).
const GROUND: GroundGrid = { y0: -130, x0: -30, step: 10, z: [
  [8.7, 8.9, 8.6, 8.8, 9.2, 9.3, 9.5],
  [8.4, 8.6, 8.6, 8.7, 9.3, 9.4, 9.3],
  [4, 3.1, 4.5, 7.2, 9.1, 9.3, 9.3],
  [0, 0.4, 3, 7.2, 8.8, 8.9, 8.9],
  [0, 0, 0, 4.6, 8.7, 8.4, 6.6],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [3, 4.5, 5.1, 7.6, 0.2, 0, 0],
  [8.6, 9.4, 9.5, 9.5, 6.4, 4.4, 1],
  [9.3, 9.5, 9.7, 9.6, 9.4, 8.6, 7.4],
  [9.5, 9.6, 9.8, 9.6, 9.4, 9.4, 8.7],
  [9.6, 9.8, 9.8, 9.7, 9.6, 9.4, 9.3],
] }
const gnd = groundOf(GROUND)

const XC = -8, XT = 6                    // centre line; truss planes at XC +- XT
const X0 = -19, X1 = 4.5                 // the upper deck's edges
const L0 = 3, L1 = 69                    // the lift span (rail way splits)
const TW = [-6, 4], TE = [68, 78]        // the towers' bases along y
const YW = -90, YE = 165                 // the bank piers
const UP = 25.6                          // upper deck
const RAIL = 10.0, LOW = RAIL - 1.2      // lower deck rail, its bottom chord
const TOP = 44.0, TOWER = 81.7

const steel = new Part(), cw = new Part(), conc = new Part(), house = new Part(), glass = new Part()
const up = piecewise([[-112, UP], [185, UP]])

// Fixed spans: Pratt trusses with the lower deck on the bottom chord, the upper deck on the top.
for (const [a, b] of [[YW, TW[0]], [TE[1], YE]] as [number, number][]) {
  const t = { x: XT, y0: a, y1: b, panels: 10, bot: () => LOW, top: () => UP - 1.3, ends: 'vertical' as const, web: 'pratt' as const, chordW: 0.8, chordD: 1.2, post: 0.6, diag: 0.5, endW: 1.1 }
  for (const s of [-1, 1]) trussSide(steel, { ...t, x: XC + s * XT })
  // Lateral struts under the upper deck.
  for (const y of stations(a, b, (b - a) / 5)) beam(steel, [XC - XT, y, UP - 1.3], [XC + XT, y, UP - 1.3], 0.5, 0.8)
}
// The lift span: the rail span below and the upper span above, read as one tall truss.
{
  const t = { x: XT, y0: L0, y1: L1, panels: 8, ends: 'vertical' as const, web: 'x' as const, chordW: 0.8, chordD: 1.1, post: 0.7, diag: 0.45, endW: 1.2 }
  for (const s of [-1, 1]) {
    trussSide(steel, { ...t, x: XC + s * XT, bot: () => LOW, top: () => UP - 1.3 })
    trussSide(steel, { ...t, x: XC + s * XT, bot: () => UP - 0.6, top: () => TOP - 0.6 })
  }
  for (const y of stations(L0, L1, (L1 - L0) / 8)) beam(steel, [XC - XT, y, TOP - 0.7], [XC + XT, y, TOP - 0.7], 0.4, 0.6)
  // The gate tender's house on the top chord, to 50.6 m.
  box(house, XC - 5, XC + 5, 28, 44, TOP, TOP + 4.8, true)
  hipRoof(house, XC - 5.4, XC + 5.4, 27.6, 44.4, TOP + 4.8, 1.8, 6)
  for (const s of [-1, 1]) face(glass, [XC + s * 5.03, 29.5, TOP + 2.2], [XC + s * 5.03, 42.5, TOP + 2.2], [XC + s * 5.03, 42.5, TOP + 3.9], [XC + s * 5.03, 29.5, TOP + 3.9], [s, 0, 0])
}

// Towers: four plumb legs from the pier, X-braced in every face above the decks,
// the concrete counterweights high up, the sheaves on the crown.
for (const [y0, y1] of [TW, TE]) {
  const zb = 3.5, xa = XC - XT, xb = XC + XT
  for (const x of [xa, xb]) for (const y of [y0, y1]) beam(steel, [x, y, zb], [x, y, TOWER], 1.3, 1.3)
  const levels = [zb, LOW, UP - 1.3, TOP - 0.6, 54, 64, 73, TOWER - 0.6]
  for (let k = 1; k < levels.length; k++) {
    const za = levels[k - 1], z = levels[k]
    for (const x of [xa, xb]) {
      beam(steel, [x, y0, z], [x, y1, z], 0.6, 0.8)
      strip(steel, [x, y0, za + 0.5], [x, y1, z - 0.5], 0.55, [1, 0, 0])
      strip(steel, [x, y1, za + 0.5], [x, y0, z - 0.5], 0.55, [1, 0, 0])
    }
    if (z >= TOP - 1) for (const y of [y0, y1]) {
      beam(steel, [xa, y, z], [xb, y, z], 0.6, 0.8)
      strip(steel, [xa, y, za + 0.5], [xb, y, z - 0.5], 0.55, [0, 1, 0])
      strip(steel, [xb, y, za + 0.5], [xa, y, z - 0.5], 0.55, [0, 1, 0])
    }
  }
  box(cw, xa + 0.9, xb - 0.9, y0 + 1.2, y1 - 1.2, 56, 77, true)
  box(steel, xa - 0.9, xb + 0.9, y0 - 0.6, y1 + 0.6, TOWER - 0.8, TOWER)
  for (const x of [xa, xb]) drumX(steel, x - 0.5, x + 0.5, (y0 + y1) / 2, TOWER + 2.6, 3.0, 12)
}

// Decks: the upper deck's underside and fascia from bank to bank and on the straight approaches;
// the MAX track bed and the footways on it; the rail deck and the lower walkway below.
const ALL = stations(-112, 185, 8.6)
for (let i = 0; i < ALL.length - 1; i++) {
  const a = ALL[i], b = ALL[i + 1]
  face(conc, [X0, a, UP - 1.0], [X1, a, UP - 1.0], [X1, b, UP - 1.0], [X0, b, UP - 1.0], [0, 0, -1])
  for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) face(steel, [x, a, UP - 1.0], [x, b, UP - 1.0], [x, b, UP + 0.2], [x, a, UP + 0.2], [s, 0, 0])
  face(conc, [XC - 4.6, a, UP + 0.05], [XC + 4.6, a, UP + 0.05], [XC + 4.6, b, UP + 0.05], [XC - 4.6, b, UP + 0.05], [0, 0, 1])
  for (const [xa, xb] of [[X0, X0 + 2.4], [X1 - 2.4, X1]]) face(conc, [xa, a, UP + 0.2], [xb, a, UP + 0.2], [xb, b, UP + 0.2], [xa, b, UP + 0.2], [0, 0, 1])
  for (const x of [X0, X1]) strip(steel, [x, a, UP + 0.75], [x, b, UP + 0.75], 1.1, [1, 0, 0])
}
const LOWYS = stations(YW, YE, 8.5)
for (let i = 0; i < LOWYS.length - 1; i++) {
  const a = LOWYS[i], b = LOWYS[i + 1]
  face(conc, [XC - XT, a, RAIL], [XC + XT, a, RAIL], [XC + XT, b, RAIL], [XC - XT, b, RAIL], [0, 0, 1])
  face(conc, [XC - XT, a, LOW - 0.6], [XC + XT + 3.6, a, LOW - 0.6], [XC + XT + 3.6, b, LOW - 0.6], [XC - XT, b, LOW - 0.6], [0, 0, -1])
  face(conc, [XC + XT, a, RAIL - 0.1], [XC + XT + 3.6, a, RAIL - 0.1], [XC + XT + 3.6, b, RAIL - 0.1], [XC + XT, b, RAIL - 0.1], [0, 0, 1])
  strip(steel, [XC + XT + 3.6, a, RAIL + 0.45], [XC + XT + 3.6, b, RAIL + 0.45], 1.1, [1, 0, 0])
}

// Piers: the tower piers (round-ended caissons), the bank piers, columns under the straight approaches.
for (const [y0, y1] of [TW, TE]) pier(conc, gnd, (y0 + y1) / 2, (y1 - y0) / 2 + 1.5, 12.5, 3.5, 1.2, 0.6, XC)
for (const y of [YW, YE]) pier(conc, gnd, y, 2.5, 12.5, LOW - 0.6, 1.0, 0.5, XC)
for (const y of [-101, 176]) for (const x of [XC - 8, XC + 2, XC + 9]) block(conc, gnd, x - 0.8, x + 0.8, y - 0.8, y + 0.8, UP - 1.0, 0.4)

const STEEL: MaterialSpec = { ...finish('bridge-black', 0x4c5158), doubleSided: true }
const CW: MaterialSpec = finish('counterweight-concrete', 0x8f8b84)
const HOUSE: MaterialSpec = finish('tender-house', 0xe6e0d4)
await save('pdx-steel-bridge', 'Steel Bridge', [
  { part: steel, material: STEEL }, { part: cw, material: CW }, { part: conc, material: CONCRETE },
  { part: house, material: HOUSE }, { part: glass, material: WINDOW },
], {
  frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/733481169, on the river (1.75 m NAVD88)',
  bearing: 56.8, elevation: 0, height: TOWER + 5.6, upperDeck: UP, rail: RAIL,
})
