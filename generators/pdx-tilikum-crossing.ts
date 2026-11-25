/**
 * Tilikum Crossing, Bridge of the People, Portland, Oregon (2015; TriMet,
 * MacDonald Architects, T.Y. Lin International) — procedural, CC0-1.0, no
 * textures.
 * bun generators/pdx-tilikum-crossing.ts   (uses helpers from pdx-st-johns-bridge.ts)
 *
 * The whole bridge inside its OSM man_made=bridge outline as one placement:
 * the two white towers, each a pair of tall pentagonal concrete legs ending
 * in points, standing on a footing in the river either side of the
 * transitway; the white fans of stay cables in the two planes of the legs;
 * the slim light-grey concrete deck with its cantilevered paths; the two
 * landside piers. The deck carries MAX light rail, buses and the streetcar
 * on a transitway between the legs, and a 14 ft path for people on bikes
 * and on foot outside each line of legs. The paths are the model's,
 * surfaces and all; the transitway is left open for the map's busway.
 * Writes a low model (stays at half density, thicker) and a detail model
 * (every stay, railings, the light poles, the underside's cross ribs),
 * drawn from detailZoom 16.
 *
 * Frame: x across (+x south-east), y along toward the east bank (north-
 * east), z up, metres; origin at the outline's centroid on the river
 * (Mapterhorn water 1.75 m NAVD88). Bearing 47.6 (the outline's main axis).
 *
 * What makes it Tilikum Crossing: the paired needle-pointed legs of each
 * tower, white against the river; the two great fans of white stays, with
 * a gap at mid-span where no stay reaches; the low, thin deck rising to a
 * gentle crest. At night the stays, towers and deck underside are lit in
 * colours driven by the river's speed, depth and temperature.
 *
 * Sources:
 * - OSM: outline way/392704404 (man_made=bridge, layer 1, no height),
 *   527 m long, x −17..18, with bulges where the paths pass outside the
 *   tower legs at y −117 and +121 (238 m apart: the published main span);
 *   busway way/285156477 and 389738957, light rail 278356062 and
 *   389738958 (x −4..4), cycleways 334030020 and 389738959 (x ±6..13).
 *   Relation/11736200 (type=bridge). No building or building:part inside.
 * - Lidar, USGS 3DEP OR_OLCMetro_2019 (flown 2019, after the 2015 opening):
 *   - the path's top (tools/bridge_ele.py measure 334030020 --every 30,
 *     spread < 0.15 m): 14.7 m over the water at the west end, a crest of
 *     25.7 m at y ≈ +5, 15.2 m at the east end; `ROAD` below;
 *   - a 1 m grid on the east tower: the legs at x −5.5 and +4.5 (so the
 *     deck is centred on x = −0.5 and the legs 10 m apart; published
 *     transitway 31 ft), centred at y = +123; the tips 59.6 m over the
 *     water; the stays in the legs' planes.
 * - Published (Wikipedia "Tilikum Crossing"; TriMet fact sheet, August
 *   2013): length 1,720 ft (524 m), main span 780 ft (238 m), towers 180 ft,
 *   clearance 77.5 ft, five spans with two piers in the water and two on
 *   land, paths 14 ft wide, cables continuous through saddles at the tower
 *   tops; 178 LED modules light the cables, towers and deck underside.
 * - Photos (Wikimedia Commons):
 *   - "Tilikum Crossing from Ross Island Bridge with MAX.jpg" (Steve
 *     Morgan, CC BY-SA 4.0): the whole bridge from upstream (south): both
 *     towers, the fans and the mid-span gap, the footings, the deck's
 *     crest;
 *   - "Tilikum Crossing (30496242922).jpg" (Atomic Taco, CC BY-SA 2.0):
 *     from the west bank: the legs from footing to tip, the stays' anchors
 *     on the legs and along the deck, the bracketed deck edge, a landside
 *     pier;
 *   - "Tilikum Crossing at night Nov 2015.jpg" (Michael Dunn, CC BY 3.0):
 *     the night look: legs and stays lit in colour, the deck edge lit.
 *
 * Estimated: the legs' section (a pentagon 4.6 m along the bridge and 2.8 m
 *   across, pointing outward, tapering to 3.6 x 2.2 m) and their 7 m
 *   pointed tips; the footings (18 x 11 m, 4 m high); the landside piers'
 *   positions (y −207, +236, at the banks) and their two columns; the
 *   deck's section (a 2.6 m box under the transitway, paths cantilevered
 *   on brackets every 6 m); ten stays a side on each leg, anchored from
 *   21 m under the tip to 6 m under it, landing 14 to 104 m out.
 *
 * Colours: the towers' white concrete and the deck's lighter grey from the
 *   daylight photos; white stays.
 * Night: the stays are `neon-stays` (white by day; the real lighting
 *   changes colour, so they glow in their own pale colour); the legs and
 *   the deck's underside carry `_FLOODLIGHT`; the path light poles' heads
 *   are `lamp`.
 *
 * Doubts: the stays' exact count and anchor heights; the landside piers;
 *   the deck's underside (photos show transverse brackets, here a plain
 *   box in the low model).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { band, bead, face, footedLoft, piecewise, rod, stations, tube, type GroundGrid } from './bridge-kit'
import { box, profileGround, writeBridge, type Mat } from './pdx-st-johns-bridge'
import { PALETTE, finish } from './palette'

const BEARING = 47.6
const GROUND: GroundGrid = {"y0":-270,"x0":-24,"step":6,"z":[[8.8,8.9,9.1,9.1,9.1,9,8.9,9.1,9.2],[9,9.2,9.3,9.3,9.2,9.1,9,9.2,9.3],[9.2,9.3,9.3,9.1,9,8.9,9,9.3,9.4],[9.2,9.3,9.2,8.9,8.9,8.9,8.9,9.3,9.5],[9.4,9.4,9,8.9,8.9,8.9,8.9,9.3,9.4],[9.5,9.3,8.8,8.8,8.7,8.7,8.7,9.1,9.4],[9.5,9.3,8.8,8.7,8.7,8.7,8.7,9,8.9],[9.4,9.3,8.9,8.7,8.6,8.5,8.4,8.1,7.7],[9.3,9.3,8.9,8.6,8.2,7.8,7.2,6.4,5.8],[9.2,8.7,8.7,7.4,6.5,5.7,5.1,4.4,3.7],[8,7.2,6.5,6,5.1,4.1,3.1,2.5,1.9],[6.2,5.3,4.4,3.8,3.1,2.3,1.5,1.1,0.8],[4.3,3.3,2.4,1.9,1.4,0.9,0.5,0,0],[2.5,1.5,1.1,0.7,0.2,0,0,0,0],[0.9,0.5,0.1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0.5,1.4,1.5],[0,0,0,0.3,1.1,2.3,3.6,4.2,4.9],[0,0.4,1.9,2.7,3.4,4.3,5.3,6.6,7.7],[1.8,3.1,4.5,5,5.5,6,7,8.1,9.1],[4.8,5.4,7.2,7.5,7.6,7.9,8.5,9.1,9.6],[8.1,8.5,8.4,8.5,8.6,8.7,8.8,9.2,10.4],[8.9,8.6,8.5,9.3,9.6,9.9,9.3,10.8,11.2],[9,8.8,9,12.7,13.1,12.6,12.7,11.6,11.3],[9.3,9.3,10.6,14.2,14.3,14.2,14.2,11.8,11.3]]}
const ground = profileGround(GROUND)

/** The paths' top above the water (lidar NAVD88 − 1.75), by y. */
const ROAD = piecewise([
  [-264, 14.6], [-232, 16.05], [-172, 18.92], [-142, 20.33], [-117, 21.54], [-104, 22.14], [-85, 23.01], [-55, 24.44],
  [-25, 25.47], [5, 25.74], [35, 25.46], [65, 24.45], [92, 23.20], [113, 22.27], [134, 21.28], [153, 20.34],
  [183, 18.91], [213, 17.51], [243, 16.06], [265, 15.1],
])
const Y0 = -262.9, Y1 = 264.4                    // the outline's ends
const TOWERS = [-116, 123]                       // lidar (east), outline bulges; 239 m apart (published 238)
const XC = -0.5, LEG = 5.0                       // deck centre; legs at XC ± 5 (lidar)
const TIP = 59.6                                 // lidar
const EDGE = 11.4, BOX = 7, OPEN = 4.6           // deck edge, box web, the transitway left to the map
const LAND = [-207, 236]

const deckBot = (y: number) => ROAD(y) - 2.6
const ys = stations(Y0, Y1, 10)

/** A leg: pentagonal section pointing outward (side s), tapering, with a pointed tip. */
function leg(p: Part, x0: number, s: number, y0: number, zFoot: number) {
  const sec = (z: number) => {
    const t = (z - zFoot) / (TIP - 7 - zFoot)
    const d = 4.6 - 1.0 * t, w = 2.8 - 0.6 * t
    // inner face flat (toward the transitway), outer point.
    const u = (k: number) => x0 + s * k
    const pts: [number, number][] = [[u(-w / 2), y0 - d / 2], [u(w * 0.15), y0 - d / 2], [u(w / 2), y0], [u(w * 0.15), y0 + d / 2], [u(-w / 2), y0 + d / 2]]
    return s > 0 ? pts : [...pts].reverse()   // CCW from above
  }
  const zs = [zFoot, 30, TIP - 7]
  const rings = zs.map((z) => sec(z).map(([x, y]) => [x, y, z] as V3))
  p.loft(rings)
  // The tip: the section closes to a point over the leg's centre, a little toward the inner face.
  const apex: V3 = [x0 - s * 0.3, y0, TIP]
  const top = rings[rings.length - 1]
  for (let i = 0; i < top.length; i++) p.tri(top[i], top[(i + 1) % top.length], apex)
}

function build() {
  const tower = new Part(), deck = new Part(), stays = new Part(), staysD = new Part(), detail = new Part()
  const lampLow = new Part(), lampD = new Part(), ribs = new Part()

  // ---- Towers: footing, two legs, a cross beam under the deck.
  for (const yt of TOWERS) {
    const foot: [number, number][] = [[XC - 9, yt - 4], [XC - 6, yt - 5.5], [XC + 6, yt - 5.5], [XC + 9, yt - 4], [XC + 9, yt + 4], [XC + 6, yt + 5.5], [XC - 6, yt + 5.5], [XC - 9, yt + 4]]
    footedLoft(tower, ground, [{ plan: foot, z: 'ground' }, { plan: foot, z: 4 }], 6)
    for (const s of [-1, 1]) leg(tower, XC + s * LEG, s, yt, 4)
    box(tower, XC - LEG + 1, XC + LEG - 1, yt - 2.2, yt + 2.2, deckBot(yt) - 2.2, deckBot(yt), ['-x', '+x'])
  }

  // ---- Landside piers: two columns and a cap under the box.
  for (const y of LAND) {
    for (const s of [-1, 1]) {
      const c: [number, number][] = [[XC + s * 4 - 1.2, y - 1.6], [XC + s * 4 + 1.2, y - 1.6], [XC + s * 4 + 1.2, y + 1.6], [XC + s * 4 - 1.2, y + 1.6]]
      footedLoft(tower, ground, [{ plan: c, z: 'ground' }, { plan: c, z: deckBot(y) - 1.6 }], 8, false)
    }
    box(tower, XC - 6.5, XC + 6.5, y - 2, y + 2, deckBot(y) - 1.6, deckBot(y), [])
  }

  // ---- Deck: box under the transitway, sloped webs, cantilevered paths, edge fascia.
  for (const s of [-1, 1]) {
    const xs = (k: number) => XC + s * k
    // Path surface (the model's) from the transitway's edge to the deck edge.
    band(deck, xs(OPEN), xs(EDGE), ys, (y) => ROAD(y), (y) => ROAD(y) - 0.6, { top: true, out: true })
    // Inner face of the transitway's kerb.
    band(deck, xs(OPEN), xs(OPEN + 0.01), ys, (y) => ROAD(y), (y) => ROAD(y) - 0.45, { in: true })
    // Box web, sloping out from the soffit to the cantilever's underside.
    for (let i = 0; i < ys.length - 1; i++) {
      const [ya, yb] = [ys[i], ys[i + 1]]
      const a: V3 = [xs(BOX - 2), ya, deckBot(ya)], b: V3 = [xs(BOX - 2), yb, deckBot(yb)]
      const c: V3 = [xs(BOX + 1.5), yb, ROAD(yb) - 0.6], d: V3 = [xs(BOX + 1.5), ya, ROAD(ya) - 0.6]
      face(deck, a, b, c, d, [s * 2.0, 0, -1.0])
    }
    // Underside of the cantilever.
    band(deck, xs(BOX + 1.5), xs(EDGE), ys, (y) => ROAD(y) - 0.6, (y) => ROAD(y) - 0.6, { bottom: true })
    // Parapet at the edge (low: solid; detail adds the rail over it).
    band(deck, xs(EDGE - 0.3), xs(EDGE), ys, (y) => ROAD(y) + 0.7, (y) => ROAD(y), { out: true, in: true, top: true })
    band(detail, xs(EDGE - 0.2), xs(EDGE - 0.1), ys, (y) => ROAD(y) + 1.3, (y) => ROAD(y) + 1.2, { out: true, in: true, top: true })
    for (const y of stations(Y0, Y1, 3)) rod(detail, [xs(EDGE - 0.15), y, ROAD(y) + 0.7], [xs(EDGE - 0.15), y, ROAD(y) + 1.25], 0.05, 3)
    // Brackets under the cantilever every 6 m (detail).
    for (const y of stations(Y0 + 3, Y1 - 3, 6)) {
      const p0: V3 = [xs(BOX + 1.5), y, ROAD(y) - 0.6], p1: V3 = [xs(EDGE - 0.3), y, ROAD(y) - 0.6], p2: V3 = [xs(BOX + 1.0), y, ROAD(y) - 1.6]
      for (const [n, yy] of [[-1, y - 0.25], [1, y + 0.25]] as const) {
        const q = (v: V3): V3 => [v[0], yy, v[2]]
        n < 0 ? ribs.tri(q(p0), q(p1), q(p2), undefined, undefined, undefined, [[0, -1, 0], [0, -1, 0], [0, -1, 0]])
          : ribs.tri(q(p0), q(p2), q(p1), undefined, undefined, undefined, [[0, 1, 0], [0, 1, 0], [0, 1, 0]])
      }
    }
  }
  // Soffit of the box, and the deck's ends.
  band(deck, XC - BOX + 2, XC + BOX - 2, ys, deckBot, deckBot, { bottom: true })
  for (const [y, n] of [[Y0, -1], [Y1, 1]] as const)
    face(deck, [XC - EDGE, y, ROAD(y)], [XC + EDGE, y, ROAD(y)], [XC + EDGE, y, deckBot(y)], [XC - EDGE, y, deckBot(y)], [0, n, 0])

  // ---- Stays: fans in the legs' planes, continuous through the tips' saddles.
  const N = 10
  for (const yt of TOWERS) for (const s of [-1, 1]) for (const dir of [-1, 1]) for (let i = 0; i < N; i++) {
    const zt = TIP - 21 + (15 * i) / (N - 1)
    const yd = yt + dir * (14 + (90 * i) / (N - 1))
    const x = XC + s * LEG
    const top: V3 = [x, yt + dir * 1.6, zt], bot: V3 = [x, yd, ROAD(yd) + 0.6]
    tube(staysD, [top, bot], 0.18, 4)
    if (i % 2 === 1) tube(stays, [top, bot], 0.35, 3)
  }

  // ---- Light poles along the transitway's edges, heads as lamps.
  for (const y of stations(Y0 + 8, Y1 - 8, 24)) for (const s of [-1, 1]) {
    if (TOWERS.some((t) => Math.abs(t - y) < 6)) continue
    const x = XC + s * (OPEN + 0.6)
    rod(detail, [x, y, ROAD(y)], [x, y, ROAD(y) + 7.5], 0.12, 4)
    bead(lampD, [x, y, ROAD(y) + 7.6], 0.3)
    if (Math.round((y - Y0) / 24) % 2 === 0) bead(lampLow, [x, y, ROAD(y) + 7.6], 0.45, true)
  }

  return { tower, deck, stays, staysD, detail, lampLow, lampD, ribs }
}

if (import.meta.main) {
  const m = build()
  const towerLight = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.min(0.85, 0.25 + 0.6 * p[2] / TIP))
  const deckLight = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.7 : 0)
  const TOWER: MaterialSpec = { ...finish('tilikum-tower', 0xe9e7e1), floodlight: towerLight }
  const DECK: MaterialSpec = { ...finish('tilikum-deck', 0xcfd1ce), floodlight: deckLight }
  const RIBS: MaterialSpec = { ...finish('tilikum-deck-ribs', 0xcfd1ce), doubleSided: true }
  const STAYS = finish('neon-stays', 0xf3f3ef)
  const LAMP = finish('lamp', 0xd9d2b8)
  const RAIL = PALETTE.metal
  const low: Mat[] = [
    { part: m.tower, material: TOWER }, { part: m.deck, material: DECK }, { part: m.stays, material: STAYS }, { part: m.lampLow, material: LAMP },
  ]
  const detail: Mat[] = [
    { part: m.tower, material: TOWER }, { part: m.deck, material: DECK }, { part: m.ribs, material: RIBS },
    { part: m.staysD, material: STAYS }, { part: m.detail, material: RAIL }, { part: m.lampD, material: LAMP },
  ]
  await writeBridge('pdx-tilikum-crossing', 'Tilikum Crossing', low, detail, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the anchor on the water', height: TIP, bearing: BEARING,
  })
}
