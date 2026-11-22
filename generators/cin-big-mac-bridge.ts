/**
 * Daniel Carter Beard Bridge ("Big Mac Bridge", I-471; 1976–77) —
 * procedural, CC0-1.0, no textures.
 * bun generators/cin-big-mac-bridge.ts
 *
 * The whole bridge inside its OSM outline, from the Ohio bank to Newport,
 * as one placement: the twin yellow tied arches over the channel (each two
 * box ribs joined by chevron bracing over its carriageway), their tie
 * girders, the plate-girder approach to Newport, and the concrete piers.
 * No road surfaces: the ties and fascia girders stand at the carriageways'
 * edges, the underside hangs below them, and the tops stay open for the
 * map's I-471 roadways. Writes the low model and a detail model with the
 * hangers and railings, drawn from detailZoom 16.
 *
 * Frame: x across (+x to the downstream, south-west side), y along the
 * bridge toward Newport, z up, metres. Bearing 123.2°, the outline's long
 * edges. The anchor (-84.49395, 39.10015) is midway along the outline,
 * mid-river; the outline runs from y = −270 (Ohio bank) to +264 (Newport).
 *
 * Height. z = 0 is the Ohio River, 138.94 m NAVD88 in the lidar (the map's
 * Mapterhorn reads the same). Roadway heights built to (`ROAD` below;
 * lidar, tools/bridge_ele.py on both I-471 carriageways, way/123175500…
 * 123175502 and 969447880/1, 28718528, OH_StatewideP3_6_B21, lower quartile,
 * spread 0.01–0.08 m; the two carriageways agree within 0.1 m): 27.2 m at
 * the Ohio bank (y = −266), a crest of 27.9 m at the arch's crown (−145),
 * 27.3 m at the arch's Newport end (−45), 25.6 m at y = +55, 23.3 m at the
 * Kentucky bank (+135), 19.85 m at the Newport end (+265). OSM has no
 * `height` or `ele`; these are the values to tag if the map's decks miss.
 *
 * Sources:
 * - OSM: outline relation/11893726 (man_made=bridge, layer 2, wikidata
 *   Q5216770), two rings, way/734667336 (north-bound, x −19…−1) and
 *   way/871761601 (south-bound, x +0.7…+19.7, widening for the ramp at the
 *   Newport end); motorway ways as above.
 * - Lidar, USGS 3DEP OH_StatewideP3_6_B21 (flown 2021), 1 m grid over the
 *   arch: ribs at x = −18.6, −1.4 (north-bound arch) and +2.6, +20.2
 *   (south-bound), 1.5–2 m wide; rib tops 72.0 m above the river at the
 *   crown (y = −150), 63.0 at −100, 43.2 at −60, 33 at −45, meeting the
 *   deck at y ≈ −37.5 and (by symmetry, and the 38.6 m reading at −250)
 *   −262.5: a parabola over 225 m, 44.5 m above the deck. Bracing over each
 *   carriageway near the crown.
 * - NAIP (USGS, public domain), a strip along the axis: the arch's two
 *   braced rib pairs from y = −270 to −40, pier noses at y = −37.5 and +45,
 *   pier caps in the gap between the decks at +45, +127 and the abutment
 *   at +262, the Kentucky bank at +122.
 * - Published (Wikipedia "Daniel Carter Beard Bridge"): total length
 *   639.93 m, main span 230.92 m, width 15.27 m a span, twin bowstring arch
 *   spans opened 1976, painted yellow.
 * - Photos (Wikimedia Commons):
 *   - "Daniel Carter Beard Bridge 2022a.jpg" (Antony-22, CC BY-SA 4.0):
 *     from the river downstream: the arch over the channel from the Ohio
 *     bank, the hangers, the approach girders on two river piers and a bank
 *     pier toward Newport;
 *   - "Daniel Carter Beard Bridge 2017.jpg" (Antony-22, CC BY-SA 4.0): from
 *     the Newport levee: the arch's profile, pale yellow, the deck's pale
 *     fascia;
 *   - "Daniel Carter Beard Bridge - from Newport levee.jpg" (ChipMahaney,
 *     CC BY 2.0): the twin arches close up: box ribs, chevron bracing
 *     between the ribs of each arch, the hangers, the wall piers with caps.
 *
 * Estimated: the rib depth (4.0 m) and width (2.0 m), the bracing pattern
 *   (a strut at every hanger, chevrons between, only where the
 *   ribs clear the deck by 9 m), the tie girders (1.2 m over, 2.6 m under
 *   the roadway), the hanger spacing (10.2 m, 21 a rib, from the photos),
 *   the approach girders' depth (2.8 m), the pier at +197 on the Newport
 *   bank (the NAIP is unclear there), every pier's shape and size.
 * Doubts: the Ohio arch pier is on the bank, where the map's terrain is
 *   steep; the arch's Ohio springing is placed by symmetry.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, face, footedLoft, groundAt, merged, parabola, piecewise, rod, stations, type GroundGrid } from './bridge-kit'

// ---- Evidence ----------------------------------------------------------------------------
const Y_OH = -270, Y_KY = 264
const ARCH: [number, number] = [-262.5, -37.5]  // springings, where the ribs meet the deck
const CROWN = 72.0                               // rib top at y = −150 (lidar)
const DECKS = [{ xc: -10.0, hw: 8.6 }, { xc: 11.4, hw: 8.8 }] // north-bound, south-bound: ribs at xc ± hw
const PIERS = [45, 127, 197]                     // approach piers toward Newport

/** Roadway (m above the river) along y, both carriageways (lidar). */
const ROAD = piecewise([
  [-318, 26.61], [-266, 27.15], [-246, 27.34], [-226, 27.53], [-145, 27.93], [-125, 27.9], [-105, 27.84], [-85, 27.72],
  [-65, 27.54], [-45, 27.3], [-25, 27.08], [-5, 26.81], [15, 26.48], [35, 26.1], [55, 25.64], [75, 25.1], [95, 24.51],
  [115, 23.92], [135, 23.33], [160, 22.56], [180, 22.0], [200, 21.47], [221, 20.98], [244, 20.41], [265, 19.85],
])
const road = (y: number) => ROAD(y)

const GROUND: GroundGrid = {"y0":-288.0,"x0":-36.0,"step":6.0,"z":[[9.7,9.7,9.7,9.6,9.5,9.4,9.2,9.2,9.0,8.9,8.8,8.7,8.4],[9.5,9.4,8.4,8.4,8.8,9.1,9.4,9.5,8.7,8.2,7.4,8.1,8.4],[8.8,6.8,4.9,5.0,6.6,7.7,6.9,6.3,5.9,5.3,4.6,5.9,7.8],[6.8,4.5,2.7,3.8,4.7,4.8,5.5,5.7,4.5,3.8,2.1,3.2,5.0],[4.2,1.6,0.8,0.7,0.7,0.9,0.7,0.7,0.4,1.0,0.2,0.7,2.1],[1.2,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.3],[0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.0,0.1,0.3,0.8,1.0,1.4],[1.2,0.6,0.4,0.7,1.7,4.0,5.2,2.3,2.7,2.5,2.2,2.5,3.2],[3.1,2.5,2.3,2.8,5.0,6.8,7.6,7.7,7.3,6.3,5.5,5.8,6.1],[4.8,4.6,4.7,5.6,6.5,7.2,7.6,7.7,7.9,7.9,7.3,7.9,8.5],[6.9,6.6,6.8,7.2,7.6,7.9,8.1,8.2,8.6,9.0,9.1,9.4,9.9],[10.4,10.0,10.6,9.9,9.7,10.2,10.2,9.9,9.9,10.3,10.2,10.2,10.3],[10.5,10.5,10.7,11.0,11.0,10.9,10.7,10.6,10.7,10.6,10.5,10.5,10.6],[10.3,10.5,10.8,11.1,11.2,11.2,10.9,10.8,10.8,10.8,10.8,10.9,11.0],[10.7,10.8,11.0,11.2,11.3,11.3,11.2,11.2,11.1,11.1,11.0,11.1,11.1],[11.0,11.0,11.0,11.1,11.3,11.3,11.2,11.3,11.3,11.4,11.5,11.7,11.9],[11.1,11.1,11.2,11.3,11.5,11.7,11.8,12.0,12.3,12.6,12.8,12.9,13.3],[11.3,11.3,12.1,12.6,12.9,13.2,13.5,13.8,14.1,14.3,14.6,15.0,15.6],[11.5,11.5,13.0,14.4,14.8,15.2,15.5,15.9,16.1,16.5,16.8,17.1,17.1],[11.6,11.5,13.4,16.1,16.6,16.8,17.0,17.0,16.7,16.3,15.9,15.5,15.0],[11.7,11.6,14.1,16.1,15.8,15.4,15.0,14.7,14.3,13.9,13.5,13.0,12.5],[11.6,11.6,12.7,13.7,13.4,13.0,12.5,12.2,11.9,11.5,11.1,10.8,10.6],[11.7,11.6,11.2,11.1,10.9,10.6,10.3,10.2,10.2,10.2,10.2,10.1,10.1],[10.2,10.1,10.0,10.0,10.0,10.0,10.0,10.1,10.1,10.1,10.1,10.2,10.2],[9.9,9.9,9.9,9.9,10.0,10.1,10.1,10.2,10.2,10.2,10.2,10.2,10.2],[9.9,9.9,9.9,10.0,10.1,10.1,10.0,10.1,10.1,10.1,10.1,10.1,10.1],[9.9,9.9,9.9,9.9,9.9,10.0,9.9,10.0,10.1,10.2,10.4,10.4,10.4],[9.9,9.9,10.0,10.1,10.4,10.7,10.8,11.2,11.7,12.2,12.6,12.9,12.3],[10.1,10.6,11.5,12.2,12.7,13.1,13.5,14.1,14.9,15.3,15.7,15.8,14.7],[10.3,12.0,14.0,15.2,16.2,16.6,16.4,17.3,18.1,18.5,18.7,18.3,16.8],[10.7,13.4,16.1,18.2,18.9,19.2,20.1,19.6,19.8,20.1,20.1,20.0,18.0],[10.8,13.7,16.7,18.5,18.8,19.1,20.0,19.4,19.7,20.0,20.0,19.9,18.3],[10.9,13.7,16.7,18.3,18.7,18.9,19.9,19.3,19.6,19.9,19.9,19.8,18.4],[11.0,13.8,16.8,18.2,18.5,18.8,19.8,19.2,19.5,19.7,19.8,19.7,18.3],[11.2,13.9,17.0,18.1,18.4,18.7,19.7,19.1,19.4,19.6,19.6,19.5,18.3]]}
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- Parts ---------------------------------------------------------------------------------
const yellow = new Part()   // arch ribs and bracing
const girder = new Part()   // ties, fascia girders, parapets
const under = new Part()    // deck soffits
const concrete = new Part() // piers
const hangers = new Part(), rails = new Part() // detail only

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A rectangular beam from a to b, w wide (sideways) and d deep (in the plane holding `up`), long faces only. */
function beam(p: Part, a: V3, b: V3, w: number, d: number, up: V3 = [0, 0, 1]) {
  const t = nrm(sub(b, a))
  let u = crs(t, up)
  if (Math.hypot(...u) < 1e-3) u = crs(t, [1, 0, 0])
  u = nrm(u)
  const v = nrm(crs(u, t))
  const U = scl(u, w / 2), V = scl(v, d / 2)
  const c = (q: V3, su: number, sv: number) => add(add(q, scl(U, su)), scl(V, sv))
  for (const [su, sv, n] of [[1, 0, u], [-1, 0, scl(u, -1)], [0, 1, v], [0, -1, scl(v, -1)]] as [number, number, V3][]) {
    const [s1, s2] = su ? [[su, -1], [su, 1]] : [[-1, sv], [1, sv]]
    face(p, c(a, s1[0], s1[1]), c(b, s1[0], s1[1]), c(b, s2[0], s2[1]), c(a, s2[0], s2[1]), n)
  }
}

// ---- Arches ---------------------------------------------------------------------------------
const RIB_W = 2.0, RIB_D = 4.0
const mid = (ARCH[0] + ARCH[1]) / 2
const ribTop = parabola([ARCH[0], road(ARCH[0])], [mid, CROWN], [ARCH[1], road(ARCH[1])])
const ribC = (y: number) => ribTop(y) - RIB_D / 2 // the rib's centre line, held to the deck at the ends
const HANGERS = stations(ARCH[0], ARCH[1], 225 / 22).slice(1, -1) // 21 a rib
const ribYs = stations(ARCH[0], ARCH[1], 225 / 44)

for (const { xc, hw } of DECKS) {
  for (const s of [-1, 1]) {
    const x = xc + s * hw
    // Rib: a box swept along the parabola, flat-shaded; its ends sink into the tie.
    for (let i = 0; i < ribYs.length - 1; i++) {
      const a: V3 = [x, ribYs[i], Math.max(ribC(ribYs[i]), road(ribYs[i]))]
      const b: V3 = [x, ribYs[i + 1], Math.max(ribC(ribYs[i + 1]), road(ribYs[i + 1]))]
      beam(yellow, a, b, RIB_W, RIB_D, [0, 0, 1])
    }
    // Tie girder along the rib line, from springing to springing.
    band(girder, x - 0.9, x + 0.9, stations(ARCH[0] - 3, ARCH[1] + 3, 15), (y) => road(y) + 1.2, (y) => road(y) - 2.6)
    // Hangers (detail).
    for (const y of HANGERS) rod(hangers, [x, y, road(y) + 1.2], [x, y, ribC(y) - RIB_D / 2 + 0.2], 0.16, 4)
  }
  // Bracing over the carriageway: a strut at every hanger, chevrons between, where the ribs clear the deck by 9 m.
  const ok = (y: number) => ribC(y) - RIB_D / 2 - road(y) > 9
  const struts = HANGERS.filter(ok)
  for (let i = 0; i < struts.length; i++) {
    const y = struts[i], z = ribC(y)
    beam(yellow, [xc - hw, y, z], [xc + hw, y, z], 1.0, 1.4, [0, 0, 1])
    if (i < struts.length - 1) {
      const y2 = struts[i + 1], z2 = ribC(y2), ym = (y + y2) / 2, zm = ribC(ym)
      for (const s of [-1, 1]) {
        beam(yellow, [xc + s * hw, y, z], [xc, ym, zm + 0.3], 0.8, 0.8, [0, 0, 1])
        beam(yellow, [xc, ym, zm + 0.3], [xc + s * hw, y2, z2], 0.8, 0.8, [0, 0, 1])
      }
    }
  }
}

// ---- Decks: fascia girders and soffits outside the arch, floor under it -----------------------------
for (const { xc, hw } of DECKS) {
  const edge = hw + 0.9
  // Approach girders to Newport and the short end at the Ohio bank: fascias at the outer and inner edges.
  for (const [a, b] of [[Y_OH, ARCH[0] - 3], [ARCH[1] + 3, Y_KY]] as [number, number][]) {
    for (const s of [-1, 1]) band(girder, xc + s * edge - 0.4 * s, xc + s * edge, stations(a, b, 15), (y) => road(y) + 1.0, (y) => road(y) - 2.8)
    band(under, xc - edge, xc + edge, stations(a, b, 15), (y) => road(y) - 2.8, (y) => road(y) - 2.8, { bottom: true })
  }
  // Under the arch: the floor between the ties.
  band(under, xc - hw - 0.9, xc + hw + 0.9, stations(ARCH[0] - 3, ARCH[1] + 3, 15), (y) => road(y) - 2.0, (y) => road(y) - 2.0, { bottom: true })
  // Railings (detail): on the girders' tops.
  for (const s of [-1, 1]) band(rails, xc + s * (hw + 0.9) - 0.15, xc + s * (hw + 0.9) + 0.15, stations(Y_OH, Y_KY, 15), (y) => road(y) + 2.0, (y) => road(y) + 1.0, { out: true, in: true, top: true })
}

// ---- Piers ------------------------------------------------------------------------------------
const rect = (x0: number, x1: number, y0: number, y1: number): [number, number][] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A wall pier under both decks with a cap beam, its foot on the ground. */
function pier(y: number, along: number, topZ: number, x0 = -20.5, x1 = 22.0) {
  footedLoft(concrete, ground, [
    { plan: rect(x0 + 2, x1 - 2, y - along / 2, y + along / 2), z: 'ground' },
    { plan: rect(x0 + 2, x1 - 2, y - along / 2, y + along / 2), z: topZ - 2.2 },
  ], 4, false)
  footedLoft(concrete, ground, [
    { plan: rect(x0, x1, y - along / 2 - 0.4, y + along / 2 + 0.4), z: topZ - 2.2 },
    { plan: rect(x0, x1, y - along / 2 - 0.4, y + along / 2 + 0.4), z: topZ },
  ], 4)
}
// Arch piers: massive, carrying both arches' bearings.
pier(ARCH[0], 9, road(ARCH[0]) - 2.6, -21.5, 23.0)
pier(ARCH[1], 9, road(ARCH[1]) - 2.6, -21.5, 23.0)
for (const y of PIERS) pier(y, 4.5, road(y) - 2.8)

// ---- Write --------------------------------------------------------------------------------------
const YELLOW = 0xecd860  // the arches, from the daylight photos
const mat = {
  yellow: { name: 'arch-yellow', color: YELLOW },
  girder: { name: 'girder-pale-green', color: 0xc3c8ad },
  under: { name: 'deck-underside', color: 0x9ba08c },
  concrete: { name: 'concrete', color: 0xc9c2b5 },
  wire: { name: 'hanger-steel', color: 0xd8d2a6 },
}
const low = [
  { part: yellow, material: mat.yellow },
  { part: girder, material: mat.girder },
  { part: under, material: mat.under },
  { part: concrete, material: mat.concrete },
]
const detail = [
  { part: yellow, material: mat.yellow },
  { part: merged(girder, rails), material: mat.girder },
  { part: under, material: mat.under },
  { part: concrete, material: mat.concrete },
  { part: hangers, material: mat.wire },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin mid-river on the bridge axis, on the water',
  bearing: 123.2, elevation: 0, arch: ARCH, roadwayHeights: { ohioBank: road(-266), crown: road(-145), archNewportEnd: road(-37.5), kentuckyBank: road(135), newportEnd: road(Y_KY) },
}
const count = (l: { part: Part }[]) => l.reduce((n, { part }) => n + part.triangles, 0)
if (import.meta.main) {
  for (const [file, l, maxTris, maxBytes] of [
    ['cin-big-mac-bridge.glb', low, 6500, 250 * 1024],
    ['cin-big-mac-bridge.detail.glb', detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = count(l)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Daniel Carter Beard Bridge', [...l], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
  }
}
