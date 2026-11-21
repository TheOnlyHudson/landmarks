/**
 * The Indianapolis Artsgarden (1995, Ehrenkrantz & Eckstut), over the
 * intersection of Washington and Illinois Streets, Indianapolis:
 * procedural, CC0-1.0.
 * bun generators/indy-artsgarden.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of the OSM outline way/340404008 (-86.1599876, 39.7671457).
 *
 * What it is: a glass hall raised over the street crossing on a concrete
 * deck, its north and south faces stepped like a telescope, five nested
 * glass vaults rising to the tallest in the middle (NAIP shows the steps as
 * banded arcs running north-south), with glass skywalk arms from its
 * corners to the buildings on the four corners (the diagonal arms of the
 * OSM outline). Translucent glass is its identity (STYLE.md, "Translucent
 * glass"): the glass is see-through, the deck, a balcony level and the
 * piers show through it, and a thin dark frame carries the stepped outline.
 *
 * z = 0 is the street (lidar ground_min + 2.4 m; flat). The glass body
 * starts on the deck at 5.5 m; the corner piers reach the street.
 *
 * Heights: lidar (USGS_LPC_IN_Central_MarionCo_2016_LAS_2018, flown 2016,
 *   0.5 m grid, sparse returns off the glass): steps from the outside in at
 *   10, 19, 23.5, 26.5 and 28.8 m above the street; their half-widths
 *   (19, 16, 13, 9, 5 m about x = 8) from where each height starts; the
 *   full-height body y -12..8; the skywalk arms 10-14 m.
 * Photo-scaled (rhodo, delso, along Illinois Street): the 5 m clearance,
 *   the deck band 5.5-8 m, the stepped face.
 * Estimated: the pier positions, the balcony level, the arms' widths.
 *
 * Sources
 * - OSM (ODbL): way/340404008 (building=yes, layer 1, "The Artsgarden").
 *   Nearby, not drawn over: way/696311782 (building=roof, east of the arms).
 * - USGS NAIP orthophoto (public domain): the plan, the banded steps.
 * - Photos (Wikimedia Commons):
 *   "Indianapolis Artsgarden viewed from Maryland St. (35390).jpg"
 *   (Rhododendrites, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_Artsgarden_viewed_from_Maryland_St._(35390).jpg),
 *   the south face along Illinois Street;
 *   "Indianapolis Artsgarden, Indianápolis, Estados Unidos, 2012-10-22, DD
 *   ..." (Diego Delso, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/Category:Indianapolis_Artsgarden),
 *   the same face in sun: the blue-green (teal) glass, the deck with its lettering;
 *   "Exterior of the Indianapolis Artsgarden - February 2019 - INvets 01.jpg"
 *   (INvets, public domain,
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_the_Indianapolis_Artsgarden_-_February_2019_-_INvets_01.jpg).
 * Doubts: the faces are drawn flat where NAIP shows them bulging a little
 *   in plan; the vaults' crowns are drawn as rounded steps.
 * Left out: the "INDIANAPOLIS ARTSGARDEN" lettering on the deck, mullions.
 * Night: glass stays dark; the skywalks are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, flatShape, arc, prism, rect, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'
import { poly, bar } from './indy-st-john-the-evangelist'

const glass = new Part(), frame = new Part(), stone = new Part(), win = new Part()

const C = 8, Y0 = -12, Y1 = 8, D = 5.5
const W = [19, 16, 13, 9, 5], T = [10, 19, 23.5, 26.5, 28.8]

// the stepped profile (x, z), left base round to right base
function profile(): XY[] {
  const left: XY[] = []
  for (let k = 0; k < W.length; k++) {
    const x = C - W[k], z0 = k === 0 ? D : T[k - 1], r = Math.min(1.8, (T[k] - z0) * 0.6)
    left.push([x, z0])
    // a quarter round at the top of each riser
    left.push(...arc(x + r, T[k] - r, r, 180, 90, 3).slice(1))
  }
  const right = [...left].reverse().map(([x, z]) => [2 * C - x, z] as XY)
  return [...left, ...right]
}
const P = profile()
// roof skin: each profile segment swept north-south
for (let i = 0; i + 1 < P.length; i++) {
  const [x0, z0] = P[i], [x1, z1] = P[i + 1]
  const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2
  poly(glass, [[x0, Y0, z0], [x1, Y0, z1], [x1, Y1, z1], [x0, Y1, z0]], [mx - C, 0, mz - D - 5])
}
// the end faces
const nf: Face = { o: [C, Y1, 0], n: [0, 1] }, sf: Face = { o: [C, Y0, 0], n: [0, -1] }
for (const f of [nf, sf]) {
  flatShape(glass, f, P.map(([x, z]) => [x - C, z] as XY), 0)
  // the frame: the outline and the riser lines
  for (let i = 0; i + 1 < P.length; i++) bar(frame, f, P[i][0] - C, P[i][1], P[i + 1][0] - C, P[i + 1][1], 0.35, 0.05)
  for (let k = 1; k < W.length; k++) for (const sg of [-1, 1]) bar(frame, f, sg * W[k], D, sg * W[k], T[k - 1], 0.25, 0.05)
  bar(frame, f, -W[0], D, W[0], D, 0.5, 0.05)
}
// the step lines running north-south over the roof (the bands NAIP shows)
for (let k = 0; k < W.length; k++) for (const sg of [-1, 1]) {
  const x = C + sg * W[k], z = k === 0 ? T[0] : T[k - 1]
  box(frame, frame, x - 0.2, Y0, x + 0.2, Y1, z - 0.1, z + 0.15)
  const xt = C + sg * (W[k] - 0.6)
  box(frame, frame, xt - 0.2, Y0, xt + 0.2, Y1, T[k] - 0.3, T[k] + 0.05)
}

// the deck, the balcony seen through the glass, the piers
prism(stone, stone, rect(C - W[0] - 0.3, Y0 - 0.6, C + W[0] + 0.3, Y1 + 0.6), D - 2.6, D)
prism(stone, null, rect(C - W[1], Y0 + 2.5, C + W[1], Y1 - 2.5), 13.5, 14.0)
for (const [x, y] of [[C - W[0] + 1, Y0 + 1], [C + W[0] - 1, Y0 + 1], [C - W[0] + 1, Y1 - 1], [C + W[0] - 1, Y1 - 1]]) box(stone, null, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 0, D - 2.6)

// ---------------------------------------------------------------- the skywalk arms
const ARMS: [XY, XY][] = [
  [[21.0, 6.0], [25.5, 13.5]],
  [[-6.0, 6.0], [-9.5, 17.0]],
  [[-6.0, -10.0], [-10.5, -20.0]],
  [[-10.5, -20.0], [-11.5, -35.0]],
  [[21.0, -10.0], [22.5, -24.0]],
]
for (const [a, b] of ARMS) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
  const hw = 2.2, vx = -uy * hw, vy = ux * hw
  const ring: XY[] = [[a[0] + vx, a[1] + vy], [a[0] - vx, a[1] - vy], [b[0] - vx, b[1] - vy], [b[0] + vx, b[1] + vy]]
  prism(stone, null, ring, D - 1.4, D + 0.6)
  prism(win, null, ring, D + 0.6, 10.2)
  prism(stone, stone, ring, 10.2, 11.0)
}

const glassM = { ...finish('glass', 0x6fc2c6, 0.24), opacity: 0.3, doubleSided: true }
const built = finishGlb('The Artsgarden', [
  { part: glass, material: glassM },
  { part: frame, material: finish('indy-ag-frame', 0x5f6f73) },
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
], { bearing: 0, height: T[4], replaces: ['way/340404008'] }, 5000)
await writeModel('indy-artsgarden', built)
