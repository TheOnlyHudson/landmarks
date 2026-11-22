/**
 * Fremont Bridge, Portland, Oregon (1973; Parsons, Brinckerhoff, Quade and
 * Douglas) — procedural, CC0-1.0, no textures.
 * bun generators/pdx-fremont-bridge.ts   (uses helpers from pdx-st-johns-bridge.ts)
 *
 * The whole bridge inside its OSM man_made=bridge outline as one placement:
 * the two white trussed arch ribs of the 383 m main span, rising from
 * concrete piers on each bank, through the deck at a third of the span and
 * up to a flat crown 116 m over the river; the white double-deck tie girder
 * (I-405/US 30 on two decks, four lanes each); the side spans, whose curved
 * bottom chords drop from the end piers to the arch springings so the
 * three spans read as one long bow; the hangers; and the approach girders
 * on round concrete columns out to the outline's ends. The map draws both
 * road surfaces; nothing here is a slab at road level across a roadway.
 * Writes a low model (girders as solid bands, the rib trusses with their
 * web, no hangers) and a detail model (hangers, lateral bracing, posts in
 * the open storey between the decks, lamp posts, the crown flagpoles),
 * drawn from detailZoom 16.
 *
 * Frame: x across (+x south-east), y along toward North Portland (north-
 * east), z up, metres; origin at the outline's centroid on the river
 * (Mapterhorn water 1.75 m NAVD88). Bearing 40.3 (the outline's main axis).
 *
 * What makes it the Fremont Bridge: one huge, low, white arch whose ribs
 * are open Warren trusses, passing down through a long white double deck to
 * springings on the banks, with the side spans' curved chords continuing
 * the bow outward; the fan of thin vertical hangers; two flags on the crown.
 *
 * Sources:
 * - OSM: outline way/392823310 (man_made=bridge, bridge:structure=arch,
 *   layer 1, no height), 958 m long, x −22..15 (deck x ≈ −11.5..13.8, so
 *   centred on x = +1); notches in the outline at y −378.8 and +280.2, the
 *   expansion joints over the end piers. Roadways way/5509112 (layer 1),
 *   5509137 and 49098926 (upper deck, layers 2/4), 42230757; no building or
 *   building:part inside the outline.
 * - Lidar, USGS 3DEP OR_OLCMetro_2019 (flown 2019):
 *   - roadway (tools/bridge_ele.py measure, every 30 m, spread < 0.12 m):
 *     the upper deck's top, 54.6 m over the water at y −412, a crest of
 *     66.8 m at y −36..−66, 52.9 m at y +352; `ROAD` below.
 *   - a 1 m grid over the crown (160 m along the axis): the ribs' tops fit
 *     z = 115.9 − 0.002752 (y + 48.7)² to ±0.2 m over 20 samples, so the
 *     main span is centred at y = −48.7 and the crown stands 115.9 m over
 *     the water (published: 381 ft = 116 m); the ribs stand at x ≈ −11 and
 *     +13; lateral struts between them about every 28 m; two flagpoles at
 *     the crown reaching 128–130 m.
 * - Published (Wikipedia "Fremont Bridge (Portland, Oregon)"; Bottenberg,
 *   "Bridges of Portland", 2007; Wood and Wortman, "The Portland Bridge
 *   Book", 2006): main span 1,255 ft (383 m), total 2,154 ft (657 m: side
 *   spans 136.5 m each), the centre 902 ft (275 m) with the rib above the
 *   deck, tie girder 18 ft (5.5 m) deep, lower-deck clearance 18.3 ft,
 *   flags 15 x 25 ft on 50 ft poles at the crest (1976).
 * - Photos (Wikimedia Commons):
 *   - "FremontBridgePano.jpg" (Cacophony, CC BY 3.0): the whole bridge from
 *     the west hills: the rib trusses, the curved side-span chords, the
 *     double deck and the end piers' tall rounded columns;
 *   - "USACE Fremont Bridge Portland (cropped).jpg" (Bob Heims, U.S. Army
 *     Corps of Engineers, public domain): an aerial from the north-west:
 *     the ribs' Warren web, the lateral bracing, the hangers, where the
 *     ribs meet the banks;
 *   - "Fremont Bridge from The Fields - Portland, Oregon.JPG" (M.O.
 *     Stevens, CC BY-SA 3.0): from the south-west, at ground level: the
 *     deck's white fascia over an open storey, the side spans' posts and
 *     X-bracing, the hangers;
 *   - "Fremont Bridge approaches - Portland, Oregon.jpg" (M.O. Stevens,
 *     CC BY-SA 3.0): the pale green approach box girders on round columns.
 *
 * Estimated: the ribs' depth (6 m at the crown to 9 m at the springing),
 *   chord sizes and panel length (13.7 m, 28 panels); the lower deck 9.5 m
 *   under the upper (the 5.5 m girder plus clearance, read from the
 *   panorama); the main piers (34 x 14 m, to 12 m) and end piers (two
 *   columns, 7.5 m across, with a cap beam); the approach columns every
 *   ~38 m; the side spans' chord as a parabola flat at the end pier; the
 *   approaches' road heights past the measured ends (held to the measured
 *   grades); hangers every 13.7 m.
 *
 * Colours: the steel is painted a very pale grey-green that reads white in
 *   every daylight photo, pulled to the palette's lightness; the approach
 *   girders a paler sage; the concrete a warm grey.
 * Night: the deck's lamp posts are `lamp`; the arch is not floodlit.
 *
 * Doubts: the lower deck's height (OSM gives layers only; no lidar sees
 *   it); where the two decks part at the approaches (both are drawn to the
 *   outline's ends here); the rib depth; the main piers' real plan.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { band, bead, footedLoft, piecewise, rod, stations, strip, truss, type GroundGrid } from './bridge-kit'
import { box, profileGround, writeBridge, type Mat } from './pdx-st-johns-bridge'
import { PALETTE, finish } from './palette'

const BEARING = 40.3
const GROUND: GroundGrid = {"y0":-490.0,"x0":-30.0,"step":10.0,"z":[[9.4,9.3,9.2,9.1,9.0,9.0,8.9],[9.4,9.3,9.1,9.1,9.1,9.4,9.3],[9.3,9.1,9.1,9.0,8.9,9.1,9.0],[9.2,9.1,9.1,9.2,8.9,8.8,8.9],[9.1,9.1,9.3,9.3,9.0,8.7,8.8],[9.1,9.2,9.4,9.4,9.2,9.0,8.7],[9.3,9.3,9.5,9.6,9.3,8.9,8.8],[9.3,9.3,9.3,9.4,9.1,8.8,8.6],[9.2,9.2,9.2,9.2,9.0,8.6,8.4],[9.1,9.0,9.0,9.0,8.9,8.4,8.3],[8.8,8.7,8.6,8.6,8.4,8.4,8.2],[8.8,8.8,8.6,8.6,8.5,8.4,7.7],[8.6,8.5,8.4,8.4,8.3,8.2,8.1],[8.4,8.4,8.3,8.3,8.2,8.1,8.1],[8.3,8.4,8.4,8.3,8.1,8.1,8.1],[8.3,8.2,7.9,7.9,7.9,7.9,8.0],[8.3,8.2,8.1,8.0,7.9,7.9,7.8],[8.2,8.2,8.2,8.1,8.0,7.9,7.8],[8.3,8.3,8.4,8.3,8.0,8.0,7.8],[8.2,8.1,8.1,7.8,7.7,7.7,8.0],[8.2,8.1,8.2,7.8,7.7,7.8,7.8],[8.3,8.3,8.2,7.9,7.9,8.0,7.9],[8.6,8.8,8.2,8.0,7.9,8.0,8.1],[8.9,9.2,8.5,8.3,8.3,8.3,8.0],[9.3,9.7,8.8,8.8,8.8,8.4,7.9],[9.6,9.9,9.9,9.9,9.9,8.4,8.0],[3.8,5.4,9.7,9.5,9.2,8.7,8.4],[1.8,3.2,7.9,8.8,8.5,7.7,7.4],[0.2,0.6,1.6,1.8,1.4,1.1,1.1],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0.0,0.0,0.0,0.0,0.0,1.4,3.4],[2.3,1.9,0.8,1.3,2.2,6.5,8.9],[4.5,8.5,9.3,9.1,9.5,9.0,8.2],[5.5,10.7,11.0,10.7,9.4,8.7,8.7],[6.7,8.0,8.4,8.6,8.6,8.5,9.1],[7.7,8.3,8.5,9.6,10.2,8.7,10.0],[7.9,8.5,7.4,10.1,9.1,8.2,10.0],[7.9,10.6,7.8,9.5,11.0,8.3,8.2],[7.8,7.9,8.0,8.1,8.2,8.2,8.3],[7.7,7.8,7.9,8.0,8.1,8.2,8.3],[7.9,7.9,8.1,8.2,8.3,8.4,8.6],[8.3,8.4,8.4,8.4,8.6,8.7,8.8],[8.6,8.6,8.6,8.6,8.6,8.7,8.9],[8.6,8.6,8.6,8.6,8.6,8.8,9.0],[8.6,8.6,8.6,8.7,8.7,8.8,8.9],[8.6,8.4,8.6,8.8,8.8,8.7,8.9],[8.4,8.4,8.5,8.8,8.7,8.6,8.9],[8.2,8.3,8.5,8.6,8.7,8.8,8.8],[8.5,8.7,9.2,9.2,9.2,9.0,8.9],[8.8,9.1,9.3,9.2,9.3,9.1,8.9],[9.1,9.2,9.3,9.3,9.3,9.1,9.0],[9.2,9.3,9.3,9.3,9.3,9.2,9.1],[9.3,9.4,9.3,9.4,9.3,9.3,9.1],[9.3,9.3,9.3,9.3,9.4,9.3,9.2],[9.3,9.3,9.3,9.4,9.4,9.4,9.3],[9.2,9.1,9.2,9.3,9.3,9.3,9.3],[9.1,9.1,9.1,9.0,9.0,9.0,9.0],[9.0,8.9,8.9,8.9,9.0,9.1,9.1],[9.0,8.9,8.9,8.9,8.9,9.0,9.1],[8.9,8.9,8.9,8.9,8.9,8.9,9.1],[8.8,8.9,8.9,8.9,9.0,8.9,9.0],[8.8,8.7,8.8,9.0,9.2,9.1,9.0],[8.6,8.7,8.9,9.2,9.3,9.5,9.2],[8.6,8.8,9.0,9.2,9.4,9.4,9.3],[8.7,8.9,9.1,9.3,9.4,9.4,9.4],[8.9,9.1,9.4,9.3,9.4,9.5,9.2],[9.0,9.3,9.6,9.5,9.5,9.3,9.4],[9.2,9.4,9.4,9.6,9.3,9.3,9.3]]}
const ground = profileGround(GROUND)

/** The upper deck's top above the water (lidar NAVD88 − 1.75), by y; held to the measured grades past the ends. */
const ROAD = piecewise([
  [-480, 51.2], [-412, 54.57], [-393, 55.50], [-363, 57.02], [-333, 58.48], [-304, 59.88], [-274, 61.41], [-244, 62.79],
  [-216, 63.89], [-186, 64.86], [-156, 65.65], [-126, 66.19], [-96, 66.58], [-66, 66.77], [-36, 66.79], [-3, 66.62],
  [27, 66.25], [87, 64.95], [117, 63.99], [139, 63.14], [169, 61.80], [199, 60.37], [221, 59.23], [251, 57.82],
  [281, 56.31], [305, 55.10], [335, 53.62], [352, 52.92], [480, 47.7],
])
const LOWER = 9.5                                // lower deck's top under the upper (estimated)
const low = (y: number) => ROAD(y) - LOWER
const Y0 = -479.2, Y1 = 479.2                    // the outline's ends
const YC = -48.7, HALF = 191.5, SIDE = 136.5     // main span centre (lidar), half span and side spans (published)
const XC = 1, RIB = 12                           // deck centre line; ribs at XC ± 12 (lidar)
const GIRDER = 12.6                              // girders' outer faces at XC ± 12.6
const CROWN = 115.9, K = 0.002752                // rib top = CROWN − K u² (lidar)
const PANEL = (2 * HALF) / 28

const ribTop = (y: number) => CROWN - K * (y - YC) ** 2
const ribDepth = (y: number) => 6 + 3 * ((y - YC) / HALF) ** 2
const ribBot = (y: number) => ribTop(y) - ribDepth(y)
const gTop = (y: number) => ROAD(y) + 1.1                  // parapet top of the girder fascia
const gBot = (y: number) => ROAD(y) - 4.4                  // the 5.5 m tie girder
const lTop = (y: number) => low(y) + 1.1
const lBot = (y: number) => low(y) - 1.9
const END = [YC - HALF - SIDE, YC + HALF + SIDE]          // end piers, −376.7 and +279.3
const MAIN = [YC - HALF + 5.5, YC + HALF - 5.5]           // where the ribs land on the main piers
/** The side spans' bottom chord: from the rib's springing up to the lower girder at the end pier, flat there. */
const sideChord = (y: number) => {
  const [ym, ye] = y < YC ? [MAIN[0], END[0]] : [MAIN[1], END[1]]
  const t = (y - ye) / (ym - ye), zs = ribBot(ym), zb = lBot(ye)
  return zb - (zb - zs) * t * t
}

function build() {
  const steel = new Part(), steelD = new Part(), web = new Part(), concrete = new Part(), approach = new Part(), soffit = new Part()
  const lampLow = new Part(), lampD = new Part(), webD = new Part()

  // ---- Arch ribs: open trusses, chords as boxes, the web as flat strips (both models).
  const ribYs = stations(MAIN[0], MAIN[1], PANEL)
  const curve = ribYs
  for (const s of [-1, 1]) {
    truss(steel, web, XC + s * RIB, ribYs, ribTop, ribBot, { chordW: 2.4, topD: 1.9, botD: 1.9, member: 1.0, post: 0.8, curve })
  }
  // Lateral struts between the ribs, every second panel point where the deck is clear below.
  for (const [i, y] of ribYs.entries()) {
    if (i % 2 || ribBot(y) < gTop(y) + 6) continue
    box(steel, XC - RIB + 1, XC + RIB - 1, y - 0.7, y + 0.7, ribTop(y) - 1.4, ribTop(y), ['-x', '+x'])
  }
  // Detail: diagonal bracing between the struts.
  for (let i = 0; i + 2 < ribYs.length; i += 2) {
    const [ya, yb] = [ribYs[i], ribYs[i + 2]]
    if (ribBot(ya) < gTop(ya) + 6 || ribBot(yb) < gTop(yb) + 6) continue
    rod(steelD, [XC - RIB + 1, ya, ribTop(ya) - 0.7], [XC + RIB - 1, yb, ribTop(yb) - 0.7], 0.3, 4)
    rod(steelD, [XC + RIB - 1, ya, ribTop(ya) - 0.7], [XC - RIB + 1, yb, ribTop(yb) - 0.7], 0.3, 4)
  }

  // ---- Deck: the white double-deck girder from end pier to end pier, sage box girders on the approaches.
  const span = [...new Set([...stations(END[0], END[1], 18)].map((v) => +v.toFixed(2)))]
  for (const s of [-1, 1]) {
    const xo = XC + s * GIRDER, xi = XC + s * (GIRDER - 1.0)
    band(steel, xi, xo, span, gTop, gBot, { out: true, in: true, top: true, bottom: true, ends: true })
    band(steel, xi, xo, span, lTop, lBot, { out: true, in: true, top: true, bottom: true, ends: true })
    // The open storey between the decks: posts every 18 m.
    for (const y of span) strip(web, [xo - s * 0.5, y, lTop(y)], [xo - s * 0.5, y, gBot(y)], 0.8, [1, 0, 0])
    for (const y of stations(END[0], END[1], 6)) strip(webD, [xo - s * 0.5, y, lTop(y)], [xo - s * 0.5, y, gBot(y)], 0.45, [1, 0, 0])
  }
  // Soffits: under the upper deck (the lower deck's ceiling) and under the lower deck.
  band(soffit, XC - GIRDER + 1, XC + GIRDER - 1, span, (y) => ROAD(y) - 1.0, (y) => ROAD(y) - 1.0, { bottom: true })
  band(soffit, XC - GIRDER + 1, XC + GIRDER - 1, span, lBot, lBot, { bottom: true })

  // ---- Side spans: curved bottom chord, posts up to the lower girder, X-bracing in the detail.
  for (const [ym, ye] of [[MAIN[0], END[0]], [MAIN[1], END[1]]]) {
    const ys = stations(Math.min(ym, ye), Math.max(ym, ye), SIDE / 10)
    for (const s of [-1, 1]) {
      const x = XC + s * RIB
      truss(steel, web, x, ys, lBot, sideChord, { chordW: 2.0, topD: 0.01, botD: 1.6, member: 0.8, post: 0.8, minWeb: 1.5, flip: ym > 0 })
    }
  }
  // Under the deck in the main span: posts from the ribs' top chord up to the lower girder.
  for (const y of ribYs) {
    if (ribTop(y) > lBot(y) - 1.5) continue
    for (const s of [-1, 1]) strip(web, [XC + s * RIB, y, ribTop(y)], [XC + s * RIB, y, lBot(y)], 0.8, [1, 0, 0])
  }

  // ---- Hangers (detail only): from the ribs' bottom chord to the girder, every panel point.
  for (const y of ribYs) {
    if (ribBot(y) < gTop(y) + 1) continue
    for (const s of [-1, 1]) rod(steelD, [XC + s * RIB, y, ribBot(y)], [XC + s * RIB, y, gTop(y)], 0.25, 3)
  }

  // ---- Flagpoles at the crown (detail only), on the ribs (lidar: 128–130 m).
  for (const s of [-1, 1]) rod(steelD, [XC + s * RIB, YC, CROWN], [XC + s * RIB, YC, CROWN + 14], 0.25, 4)

  // ---- Approaches: twin box girders under each deck, past the end piers.
  for (const [ya, yb] of [[Y0, END[0]], [END[1], Y1]]) {
    const ys = stations(ya, yb, 15)
    band(approach, XC - 11, XC + 11, ys, (y) => ROAD(y) - 0.6, (y) => ROAD(y) - 3.2, { out: true, in: true, bottom: true, ends: false })
    band(approach, XC - 11, XC + 11, ys, (y) => low(y) - 0.6, (y) => low(y) - 3.2, { out: true, in: true, bottom: true, ends: false })
    // Parapets on the edges.
    for (const s of [-1, 1]) for (const f of [ROAD, low])
      band(approach, XC + s * 10.7, XC + s * 11.1, ys, (y) => f(y) + 1.0, (y) => f(y) - 0.6, { out: true, in: true, top: true })
    // Round column pairs with a cap beam under each deck level.
    for (const y of stations(ya, yb, 38).slice(ya < 0 ? 0 : 1, ya < 0 ? -1 : undefined)) {
      for (const s of [-1, 1]) column(concrete, XC + s * 6, y, 1.7, low(y) - 3.2)
      box(concrete, XC - 9, XC + 9, y - 1.4, y + 1.4, low(y) - 4.6, low(y) - 3.2, [])
      box(concrete, XC - 9, XC + 9, y - 1.4, y + 1.4, ROAD(y) - 4.6, ROAD(y) - 3.2, [])
      for (const s of [-1, 1]) box(concrete, XC + s * 8 - 0.9, XC + s * 8 + 0.9, y - 1.0, y + 1.0, low(y) - 0.6, ROAD(y) - 4.6, ['-z', '+z'])
    }
  }

  // ---- End piers: two tall rounded columns flaring into a cap under the lower girder.
  for (const y of END) {
    for (const s of [-1, 1]) column(concrete, XC + s * 7, y, 3.6, lBot(y) - 3)
    box(concrete, XC - GIRDER, XC + GIRDER, y - 3.2, y + 3.2, lBot(y) - 3, lBot(y), [])
  }
  // ---- Main piers: massive concrete blocks on each bank under the springings.
  for (const y of MAIN) {
    const top = Math.max(ribBot(y) + 0.5, 12)
    const rect = (b: number): [number, number][] => [[XC - 17 - b, y - 7 - b], [XC + 17 + b, y - 7 - b], [XC + 17 + b, y + 7 + b], [XC - 17 - b, y + 7 + b]]
    footedLoft(concrete, ground, [{ plan: rect(1.2), z: 'ground' }, { plan: rect(0.6), z: top - 2 }, { plan: rect(0), z: top }], 10)
  }

  // ---- Lamp posts on the upper deck's edges.
  for (const y of stations(Y0 + 10, Y1 - 10, 30)) for (const s of [-1, 1]) {
    bead(lampD, [XC + s * 11.8, y, ROAD(y) + 10], 0.35)
    if (Math.round((y - Y0) / 30) % 2 === 0) bead(lampLow, [XC + s * 11.8, y, ROAD(y) + 10], 0.5, true)
  }

  return { steel, steelD, web, webD, concrete, approach, soffit, lampLow, lampD }
}

/** A round column (12 sides) standing on the ground at (x, y) up to z. */
function column(p: Part, x: number, y: number, r: number, z: number) {
  const ring = Array.from({ length: 12 }, (_, i) => [x + r * Math.cos((i * Math.PI) / 6), y + r * Math.sin((i * Math.PI) / 6)] as [number, number])
  footedLoft(p, ground, [{ plan: ring, z: 'ground' }, { plan: ring, z }], 50, false)
}

if (import.meta.main) {
  const m = build()
  const STEEL = finish('fremont-steel', 0xd9e1d9)
  const WEB: MaterialSpec = { ...finish('fremont-steel-web', 0xd9e1d9), doubleSided: true }
  const APPROACH = finish('fremont-approach', 0xc3d2c1)
  const CONCRETE = finish('concrete', 0xc4bfb5)
  const SOFFIT = { ...PALETTE.roof, name: 'soffit' }
  const LAMP = finish('lamp', 0xd9d2b8)
  const merge = (a: Part, b: Part) => { const out = new Part(); for (const p of [a, b]) for (const k of ['pos', 'nrm', 'uv'] as const) for (const v of p[k]) out[k].push(v); return out }
  const lowList: Mat[] = [
    { part: m.steel, material: STEEL }, { part: m.web, material: WEB }, { part: m.concrete, material: CONCRETE },
    { part: m.approach, material: APPROACH }, { part: m.soffit, material: SOFFIT }, { part: m.lampLow, material: LAMP },
  ]
  const detailList: Mat[] = [
    { part: merge(m.steel, m.steelD), material: STEEL }, { part: merge(m.web, m.webD), material: WEB }, { part: m.concrete, material: CONCRETE },
    { part: m.approach, material: APPROACH }, { part: m.soffit, material: SOFFIT }, { part: m.lampD, material: LAMP },
  ]
  await writeBridge('pdx-fremont-bridge', 'Fremont Bridge', lowList, detailList, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the anchor on the water', height: CROWN + 14, bearing: BEARING,
    roadwayUpperMidspan: ROAD(YC), lowerDeckBelowUpper: LOWER,
  })
}
