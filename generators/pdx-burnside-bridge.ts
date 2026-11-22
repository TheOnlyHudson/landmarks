/**
 * Burnside Bridge (1926; Gustav Lindenthal, towers by Thomas Lamb), over
 * the Willamette River in Portland, Oregon: procedural, CC0-1.0, no
 * textures. bun generators/pdx-burnside-bridge.ts
 *
 * A double-leaf Strauss bascule whose deck-girder leaves meet in a shallow
 * arch, on two massive concrete piers; on the piers' south ends, beside the
 * sidewalk, two Italian Renaissance operator's towers: pale cast stone, a
 * green cornice band of windows, a red tile octagonal roof and finial. Deck
 * trusses carry the two fixed river spans; concrete girder approaches run
 * on over Waterfront Park and the east bank to the ends of the outline.
 * Balustrades line both sidewalks. Drawn closed.
 *
 * Frame: x across, y along the outline's axis (bearing 91.99, toward the east
 * bank), z up, metres. Origin at the centroid of the man_made=bridge outline
 * way/863983396; z = 0 the river in the map's terrain (Mapterhorn, 1.75 m
 * NAVD88; the 2019 lidar's water 1.84 m). elevation 0.
 *
 * OSM: way/863983396 the outline (replaced, with the towers way/392706130
 * and way/392706131), 705 m from y = -348.8 to +355.9 (bridge:structure=beam);
 * the towers mapped as 4 m squares at y = -74.9 and +6.5, x = 12.5..14.8;
 * the footways at x = -11.8 and +10.2.
 *
 * Lidar, USGS 3DEP OR_OLCMetro_2019 (2019), 1 m grid over the bascule span:
 * the roadway 22.5 m over the water at the piers, 22.7 m at mid-span; the
 * towers' roofs to 31.3 m (their finials, thin, to about 33); the piers'
 * fenders 8.2 m. Roadway elsewhere: see ROAD; its east end (19.6 m) is set
 * to meet the map's terrain at the east bank (terrain.ts check).
 * Terrain: the west seawall at y = -168, the east bank at y = +100.
 *
 * Published (Wikipedia "Burnside Bridge"; Multnomah County): bascule span
 * 252 ft (77 m), fixed spans 268 ft (82 m); 2,308 ft (703 m) with
 * approaches; 73.8 ft wide; 64 ft over the river when closed.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Burnside Bridge (south side) with motorboats.jpg" (Steve Morgan, CC
 *   BY-SA 3.0): the arched leaves, the piers with their corbels, both
 *   towers, the deck trusses of the fixed spans;
 * - "Burnside Bridge east tower.jpg" (Steve Morgan, CC BY-SA 3.0): the tower:
 *   chamfered shaft, door, green window band, red tile roof, balustrade;
 * - "Burnside Bridge (north side) with Portland Spirit passing under.jpg"
 *   (Steve Morgan, CC BY-SA 3.0): the north face, no towers there.
 *
 * Estimated: the piers' plans (21 x 30 m), the leaves' arch (the girders 11.3 m
 * deep at the piers, 1.8 m at mid-span; the south-side photo shows the soffit springing about halfway down the piers), the fixed spans' deck trusses (13 m
 * deep, Warren with verticals), the approach bents every ~25 m, the towers'
 * proportions (4.4 m across, window band 5.5-8 m over the sidewalk, roof to
 * 11 m) from the tower photo.
 * Colour: the steel weathered red-brown #8e5a40, pulled to #9c6b52; cast
 * stone towers #e3d9c6 (stone); the trim green #3f8a74 pulled to #5f9a86;
 * tile #b5503d.
 *
 * Doubts: the approaches are drawn as plain girders on bents; their real
 * spans (some concrete arches on the east side) were not photographed for
 * this model. Night: street lamps; the towers' windows lit.
 */
import { Part, type MaterialSpec } from './mesh'
import { chamferedRect, face, footedLoft, piecewise, stations, strip, type GroundGrid } from './bridge-kit'
import { finish, PALETTE } from './palette'
import { block, CONCRETE, deckBand, groundOf, pier, save, sidewalks, trussSide, WINDOW } from './pdx-hawthorne-bridge'

const GROUND: GroundGrid = {"y0":-360,"x0":-30,"step":10,"z":[[8.4,8.6,8.4,7.5,7.4,7.8,8.6],[8.1,7.9,7.6,7.8,8.2,8.5,8.6],[8,7.8,7.8,7.8,7.9,7.9,8.1],[7.9,7.5,7.5,7.6,7.6,7.7,7.8],[8.7,8.5,7.9,7.6,7.6,7.7,7.9],[8.6,8.4,8.2,8.1,7.8,7.6,8],[8.6,8.4,8.3,8.3,8.2,8,8.2],[8.5,8.3,8.3,8.3,8.3,8.1,8.3],[8.4,8.3,8.3,8.3,8.3,8.1,8.3],[8.4,8.3,8.3,8.3,8.3,8.2,8.3],[8.3,8.3,8.3,8.1,8,8,8.3],[8.2,8.2,8.2,8.2,8.2,8.1,8.1],[8.1,8.2,8.2,8.3,8.3,8.2,8.2],[8.4,8.5,8.4,8.4,8.3,8.4,8.4],[8.7,8.5,8.4,8.5,8.6,8.6,8.7],[8.1,8.2,8.6,8.6,8.8,8.8,8.9],[9,8.9,8.7,8.8,8.8,8.8,8.8],[8.7,8.7,8.8,8.8,8.8,8.7,8.6],[8.6,8.7,8.8,8.8,8.8,8.6,8.5],[8.5,8.6,7.8,6.5,6,8.3,8.4],[0,0,0.8,0.2,0.1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0.4,3.7],[0,0,0,0,0.6,3.5,8.8],[0.1,0.1,0.1,1,2.2,4.5,10],[0.7,0.7,1.5,3.5,5,6.3,9.7],[3.4,3.5,4.3,6.2,6.6,8.1,10.2],[6.6,6.6,7,7.1,7.2,8.4,10.4],[8,7.9,7.7,7.6,7.5,8.4,10.5],[8,7.8,7.8,7.7,7.6,8.2,10.1],[7.8,7.8,7.8,7.8,7.8,7.8,8.1],[7.9,7.8,7.9,7.9,7.9,7.8,7.8],[7.6,7.7,7.8,7.8,7.8,7.8,7.8],[8.2,8.4,8.6,8.5,8.3,8.4,8.3],[8.7,8.9,8.7,8.4,8.2,8.6,8.1],[8.8,8.8,8.6,8.4,8.3,8.4,7.8],[8.8,8.7,8.6,8.4,8.3,8,7.6],[8.9,8.6,8.5,8.4,8.4,7.6,7.7],[8.6,8.5,8.5,8.5,8.4,8.2,8.3],[8.4,8.4,8.5,8.5,8.5,8.4,8.5],[8.5,8.5,8.6,8.6,8.5,8.5,8.5],[9.2,8.9,8.7,8.6,8.5,8.6,8.8],[10.2,9.6,9.2,8.9,8.6,8.7,8.8],[10.7,11,10.6,10.1,9.6,9,9],[12.5,12.6,12.1,11.2,10.8,10.5,10.2],[13.3,12.7,12.2,11.9,11.6,11.5,11.3],[13.5,13.2,12.8,12.7,12.5,12.3,12.5],[13.6,13.2,14.1,13.5,12.9,12.5,12.5],[13.5,13.4,16.9,16,13.7,12.5,12.5],[18.1,18.3,18,15.9,13.9,13.1,12.7]]}
const gnd = groundOf(GROUND)

const Y0 = -348.8, Y1 = 355.9
const XC = -0.7, HW = 11.8              // deck centre line, half width
const BW: [number, number] = [-94, -72.7], BE: [number, number] = [4.3, 25.6] // bascule piers
const FW = -174, FE = 106               // the fixed spans' outer piers
const MID = (BW[1] + BE[0]) / 2
const ROAD = piecewise([[-348.8, 11.5], [-174, 20.0], [-94, 22.4], [-34.2, 22.7], [25.6, 22.4], [106, 21.2], [355.9, 19.6]])

const steel = new Part(), conc = new Part(), stone = new Part(), tile = new Part(), green = new Part(), glass = new Part()
const xs = (s: number) => XC + s * HW

// The leaves: deck girders whose soffit makes a shallow arch between the piers.
{
  const ys = stations(BW[1], BE[0], 77.0 / 14)
  const bot = (y: number) => ROAD(y) - 1.8 - 9.5 * Math.pow(Math.abs(y - MID) / (MID - BW[1]), 2)
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    for (const s of [-1, 1]) face(steel, [xs(s), a, bot(a)], [xs(s), b, bot(b)], [xs(s), b, ROAD(b) + 0.2], [xs(s), a, ROAD(a) + 0.2], [s, 0, 0])
    face(steel, [xs(-1), a, bot(a)], [xs(1), a, bot(a)], [xs(1), b, bot(b)], [xs(-1), b, bot(b)], [0, 0, -1])
  }
}
// Fixed spans: Warren deck trusses with verticals, four lines under the deck.
for (const [a, b] of [[FW, BW[0]], [BE[1], FE]] as [number, number][]) {
  for (const x of [-9.5, -3.2, 3.2, 9.5]) trussSide(steel, { x: XC + x, y0: a, y1: b, panels: 8, bot: (y) => Math.max(ROAD(y) - 13.0, gnd(XC, y) + 0.5), top: (y) => ROAD(y) - 1.0, ends: 'vertical', web: 'warren', chordW: 0.6, chordD: 0.9, post: 0.45, diag: 0.5 })
}
// Approaches: concrete girders on bents.
const deckYs = stations(Y0, Y1, 8.8)
deckBand(conc, deckYs.filter((y) => y <= FW + 0.1), ROAD, HW, 1.9, true, 0.2)
deckBand(conc, deckYs.filter((y) => y >= FE - 8.9), ROAD, HW, 1.9, true, 0.2)
deckBand(steel, stations(FW, FE, 8.8), ROAD, HW, 1.2, false)
for (const y of [...stations(Y0 + 3, FW - 6, 25), ...stations(FE + 6, Y1 - 3, 25)]) {
  for (const x of [-7, 0, 7]) block(conc, gnd, XC + x - 0.8, XC + x + 0.8, y - 0.8, y + 0.8, ROAD(y) - 1.9, 0.4)
}
// Sidewalks and balustrades along the whole bridge.
sidewalks(conc, conc, deckYs, ROAD, HW - 2.6, HW, 0.2, 1.1)

// Piers: the bascule piers, rising to just under the deck; the fixed spans' outer piers.
for (const [a, b] of [BW, BE]) {
  const yc = (a + b) / 2
  pier(conc, gnd, yc, (b - a) / 2, HW + 2.2, ROAD(yc) - 0.5, 4.0, 1.2, XC)
}
for (const y of [FW, FE]) pier(conc, gnd, y, 3.0, HW, ROAD(y) - 13.5, 1.2, 0.6, XC)

// The operator's towers on the piers' south ends, beside the sidewalk.
for (const yt of [-74.9, 6.5]) {
  const xt = 13.6, r = 2.2, c = 0.65, z0 = ROAD(yt) - 3.5, zs = ROAD(yt) + 0.2
  const ring = (o: number) => chamferedRect(xt - r - o, xt + r + o, yt - r - o, yt + r + o, c + o * 0.4)
  footedLoft(stone, gnd, [{ plan: ring(0.3), z: z0 }, { plan: ring(0.3), z: zs + 0.6 }, { plan: ring(0), z: zs + 0.6 }, { plan: ring(0), z: zs + 5.4 }], 2, false)
  footedLoft(green, gnd, [{ plan: ring(0), z: zs + 5.4 }, { plan: ring(0.25), z: zs + 5.4 }, { plan: ring(0.25), z: zs + 6.0 }, { plan: ring(0.1), z: zs + 6.0 }, { plan: ring(0.1), z: zs + 8.0 }, { plan: ring(0.5), z: zs + 8.0 }, { plan: ring(0.5), z: zs + 8.6 }], 2, false)
  // Windows: a broad pane on each of the four main faces of the band.
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const cx = xt + nx * (r + 0.13), cy = yt + ny * (r + 0.13), w = r - c
    const a: [number, number] = [cx - ny * w, cy + nx * w], b: [number, number] = [cx + ny * w, cy - nx * w]
    face(glass, [a[0], a[1], zs + 6.2], [b[0], b[1], zs + 6.2], [b[0], b[1], zs + 7.8], [a[0], a[1], zs + 7.8], [nx, ny, 0])
  }
  // The octagonal tile roof and its finial.
  const top = ring(0.5), apex: [number, number, number] = [xt, yt, zs + 11.0]
  for (let i = 0; i < top.length; i++) {
    const p = top[i], q = top[(i + 1) % top.length]
    tile.tri([p[0], p[1], zs + 8.6], [q[0], q[1], zs + 8.6], apex)
  }
  strip(green, [xt, yt, zs + 10.6], [xt, yt, zs + 12.0], 0.35, [1, 0, 0])
  strip(green, [xt, yt, zs + 10.6], [xt, yt, zs + 12.0], 0.35, [0, 1, 0])
}

const STEEL: MaterialSpec = { ...finish('bridge-steel-brown', 0x9c6b52), doubleSided: true }
const TILE: MaterialSpec = finish('roof-tile', 0xb5503d)
const GREEN: MaterialSpec = { ...finish('tower-trim-green', 0x5f9a86), doubleSided: true }
await save('pdx-burnside-bridge', 'Burnside Bridge', [
  { part: steel, material: STEEL }, { part: conc, material: CONCRETE }, { part: stone, material: PALETTE.stone },
  { part: tile, material: TILE }, { part: green, material: GREEN }, { part: glass, material: WINDOW },
], {
  frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/863983396, on the river (1.75 m NAVD88)',
  bearing: 91.99, elevation: 0, height: 34.5,
})
