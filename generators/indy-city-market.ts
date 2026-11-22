/**
 * Indianapolis City Market (market house 1886, D. A. Bohlen & Son; east
 * additions later), 222 East Market Street, Indianapolis: procedural,
 * CC0-1.0.
 * bun generators/indy-city-market.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; turned 1.7 degrees clockwise to
 * the outline's long walls, placed at bearing 1.7. The origin is the area
 * centroid of the OSM outline way/339449429 (-86.1532753, 39.7688379).
 * The market house is x -31.5..1, y -33..21 (its north annex to y 26); the
 * later east wing x 1..44, y -11..25, with its cut south-east corner.
 *
 * Identity (photos below): a red-brick basilica: a tall central nave with a
 * clerestory and a pale-green standing-seam metal roof, lower side aisles,
 * and on the Market Street (south) front a pedimented gable with tall
 * round-arched windows, flanked by two square towers with louvred belfries
 * and low pyramid caps; limestone bands and base; round-arched aisle
 * windows; the arched main door with its little pediment.
 *
 * Heights (photo-scaled from the 1970 HABS south front against the 16 m
 * nave, +-1 m): aisle cornice 10.3; nave eaves 14.8, gable apex 19.5;
 * towers to 19.8, caps to 22; door arch to 6.5. The east wing's 8 m walls
 * and 10 m roof are estimated from NAIP shadows and the Nyttend photo.
 * No lidar read.
 *
 * Sources
 * - OSM (ODbL): way/339449429 (building=retail, "City Market").
 * - USGS NAIP orthophoto (public domain): the plan; the nave and aisle roof
 *   strips; the green roofs; the dark flat roof on the east wing's north.
 * - Photos (Wikimedia Commons):
 *   "August 1970 SOUTH FRONT OF MARKET HOUSE - Indianapolis City Market,
 *   222 East Market Street, Indianapolis, Marion County, IN" (Jack E.
 *   Boucher, HABS IND-59, public domain,
 *   https://commons.wikimedia.org/wiki/File:August_1970_SOUTH_FRONT_OF_MARKET_HOUSE_-_Indianapolis_City_Market,_222_East_Market_Street,_Indianapolis,_Marion_County,_IN_HABS_IND,49-IND,14-2.tif
 *   ), the south front: every height above;
 *   "City Market in Indianapolis.jpg" (Nyttend, public domain,
 *   https://commons.wikimedia.org/wiki/File:City_Market_in_Indianapolis.jpg),
 *   the long side: clerestory band, the green roof, the later glass wings.
 * Doubts: the east wing's height and form (no close photo); the north end
 *   and the north annex (unphotographed).
 * Left out: the cupola finials, the "MARKET" plaque lettering, the Tomlinson
 *   Hall arch in the plaza, the west wing (a separate OSM building).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, prism, rect, flatShape, extrudeShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'
import { poly, gable, spire, lit } from './indy-st-john-the-evangelist'

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()

const X0 = -31.5, X1 = 1.0, Y0 = -33.0, Y1 = 21.0
const NX0 = -23.3, NX1 = -7.3, NC = (NX0 + NX1) / 2 // the nave
const AE = 10.3, NE = 14.8, NR = 19.5

// ---------------------------------------------------------------- the market house
prism(stone, null, rect(X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1), 0, 1.2)
prism(brick, null, rect(X0, Y0, X1, Y1), 1.2, AE)
prism(stone, null, rect(X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1), 4.6, 5.0)
prism(stone, null, rect(X0 - 0.2, Y0 - 0.2, X1 + 0.2, Y1), AE - 0.5, AE)
// the aisle roofs, lean-to from the outer walls up to the clerestory
for (const [xo, xi] of [[X0 - 0.4, NX0], [X1 + 0.4, NX1]]) {
  const zi = AE + 1.4
  poly(roof, [[xo, Y0 - 0.4, AE], [xo, Y1, AE], [xi, Y1, zi], [xi, Y0 - 0.4, zi]], [xi - xo > 0 ? -0.2 : 0.2, 0, 1])
}
// the clerestory and nave roof
prism(brick, null, rect(NX0, Y0, NX1, Y1), AE, NE)
prism(stone, null, rect(NX0 - 0.15, Y0 - 0.15, NX1 + 0.15, Y1 + 0.15), NE - 0.4, NE)
gable(brick, roof, NC, (Y0 + Y1) / 2, Y1 - Y0, NX1 - NX0, 90, NE, NR, 0.5)
// clerestory windows: grouped arched lights along both sides
for (const [x, sg] of [[NX0, -1], [NX1, 1]] as [number, number][]) {
  const f: Face = { o: [x, 0, 0], n: [sg, 0] } // s = y * sg
  for (let y = Y0 + 6; y < Y1 - 2; y += 4.5) flatShape(win, f, archShape(y * sg, 2.6, 11.8, 13.4, 6), 0.06)
}
for (const [x, sg] of [[X0, -1], [X1, 1]] as [number, number][]) {
  const f: Face = { o: [x, 0, 0], n: [sg, 0] }
  for (let y = Y0 + 4; y < Y1 - 2; y += 4.5) {
    flatShape(win, f, archShape(y * sg, 2.0, 5.6, 8.2, 6), 0.06)
    flatShape(win, f, rect(y * sg - 1.0, 1.8, y * sg + 1.0, 4.0), 0.06)
  }
}
// the north annex
prism(brick, roof, rect(X0, Y1, X1, 26.0), 0, 8.0)

// ---------------------------------------------------------------- the south front
{
  const f: Face = { o: [NC, Y0, 0], n: [0, -1] } // s = x - NC
  // the nave's tall arched windows, stepping up under the gable
  const xs = [-5.6, -3.4, -1.15, 1.15, 3.4, 5.6]
  xs.forEach((s) => {
    const top = 15.6 + (2.9 - Math.abs(s)) * 0.35
    flatShape(win, f, archShape(s, 1.5, 10.9, top, 6), 0.06)
  })
  // the pediment over the door and its arch
  extrudeShape(stone, f, [[-3.2, 9.6], [3.2, 9.6], [0, 10.9]], 0, 0.35)
  extrudeShape(stone, f, rect(-2.0, 8.1, 2.0, 9.4), 0, 0.25)
  extrudeShape(brick, f, rect(-3.4, 1.2, 3.4, 9.6), 0, 0.35)
  flatShape(door, { o: [NC, Y0 - 0.35, 0], n: [0, -1] }, archShape(0, 3.6, 0.2, 4.7, 8), 0.06)
  // the aisle bays: arched louvred windows, side doors
  for (const s of [-12.6, -10.2, 10.2, 12.6]) flatShape(win, f, archShape(s, 1.6, 1.8, 3.8, 6), 0.06)
  for (const s of [-12.6, -10.2, -5.6, 5.6, 10.2, 12.6]) if (Math.abs(s) > 6) flatShape(win, f, archShape(s, 1.4, 6.0, 7.8, 6), 0.06)
  for (const s of [-5.0, -3.0, 3.0, 5.0]) flatShape(win, f, archShape(s, 1.3, 1.8, 5.6, 6), 0.06)
}
// the towers flanking the nave on the south front (and stubs at the north corners)
for (const x of [NX0, NX1]) {
  const y = Y0 + 1.6, h = 1.9
  box(brick, null, x - h, y - h - 0.3, x + h, y + h, 0, 19.0)
  box(stone, null, x - h - 0.2, y - h - 0.5, x + h + 0.2, y + h + 0.2, NE - 0.4, NE)
  box(stone, stone, x - h - 0.3, y - h - 0.6, x + h + 0.3, y + h + 0.3, 19.0, 19.8)
  spire(roof, x, y - 0.15, (h + 0.5) * Math.SQRT2, 19.8, 22.0, 4, 45)
  for (const f of [{ o: [x, y - h - 0.3, 0], n: [0, -1] }, { o: [x - h, y, 0], n: [-1, 0] }, { o: [x + h, y, 0], n: [1, 0] }] as Face[]) {
    flatShape(win, f, archShape(0, 1.3, 16.0, 18.0, 5), 0.06)
    flatShape(win, f, archShape(0, 0.9, 11.6, 12.8, 5), 0.06)
  }
}

// ---------------------------------------------------------------- the east wing
{
  // north strip with its dark flat roof
  prism(brick, null, rect(X1, 12.5, 44.2, 24.3), 0, 8.0)
  prism(roof, roof, rect(X1, 12.5, 44.2, 24.3), 8.0, 8.3)
  // the south block with the cut corner, a glazed band over brick, a low green roof
  const ring: [number, number][] = [[6.0, 1.2], [18.3, 0.9], [29.4, -11.1], [40.1, -1.3], [40.5, 12.5], [6.0, 12.5]]
  prism(brick, null, ring, 0, 3.0)
  prism(win, null, ring, 3.0, 6.6)
  prism(stone, null, ring, 6.6, 7.6)
  // its roof: a shallow pyramid over the block
  const cx = 24, cy = 4, apex: V3 = [cx, cy, 10.0]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    poly(roof, [[a[0], a[1], 7.6], [b[0], b[1], 7.6], apex], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 2])
  }
  // the link to the market house
  prism(win, roof, rect(X1, 1.2, 6.0, 12.5), 0, 6.0)
}

const brickM = { ...finish('indy-cm-brick', 0xb0634c), floodlight: (p: V3, n: V3) => (p[0] < 1.5 && p[1] < -25 ? lit(p, n) : 0) }
const stoneM = { ...PALETTE.stone, floodlight: (p: V3, n: V3) => (p[0] < 1.5 && p[1] < -25 ? lit(p, n) : 0) }
const built = finishGlb('Indianapolis City Market', [
  { part: brick, material: brickM },
  { part: stone, material: stoneM },
  { part: roof, material: finish('indy-cm-roof', 0x8fb1a2) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 1.7, height: 22.0, replaces: ['way/339449429'] }, 5000)
await writeModel('indy-city-market', built)
