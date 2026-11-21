/**
 * Capitol Center (Truist Tower; formerly BB&T), Columbia, SC (1987, GMK
 * Associates) — original procedural geometry, CC0-1.0.
 * bun generators/cola-capitol-center.ts
 *
 * Map frame: x east, y north, z up, metres; built in a frame turned to the
 * downtown grid, bearing 70 (+y toward 70°, along Gervais Street; +x
 * toward 160°, along Main Street). Anchor = centroid of OSM way/329094442
 * ("Capitol Center", building=office, 26 levels), 34.001240, -81.034822.
 *
 * Identity: the tallest building in South Carolina, a plain slab of pale
 * silver aluminium wrapped in continuous dark ribbon windows, the bands
 * running unbroken round its softened corners; a solid pale band at the
 * top that carries the bank's sign; a low podium with a sloped glass skirt
 * round the foot.
 *
 * Evidence:
 *  - plan: OSM way/329094442 is the tower and its podium together. The
 *    2019 lidar separates them: the tower is x -17.7..16.8, y -31.8..32.2
 *    (34.5 × 64 m); podium strips about 11.6 m high run along the north-
 *    west side (x -24.2..-17.7, y -24.1..22.8) and the south-east side
 *    (x 16.8..22.1), with a 10 m vestibule on the Main Street end
 *    (x -4.4..4.5) and a low one on the Gervais side (OSM's bump at
 *    x 22..25, y -12..-1.3).
 *  - heights: published roof 106.4 m, 26 floors (Wikipedia, citing
 *    Emporis/CTBUH). USGS 3DEP SC_SavannahPeeDee_5_2019 (2019 flight),
 *    1 m grid: roof 106.2 m, parapet 106.6–106.8 m, a rooftop mechanical
 *    block about 109 m (x -9..3, y 4..15), masts and equipment to 118 m
 *    (left out). Podium 11.6 m, the Main Street vestibule 10 m.
 *  - ribbon bands: one dark band and one pale spandrel per floor in the
 *    photos (about 3.9 m floors); drawn as one band per two floors, so the
 *    stripes read at phone size without shimmering (STYLE.md).
 *  - top band: about one and a half floors of solid aluminium above the
 *    last ribbon (Dr. Blazer's and Kirchel's photos).
 *  - sloped glass skirt: Dr. Blazer's photo; its slope is estimated (the
 *    lidar shows the podium flat at 11.6 m about 3 m in from the edge).
 *  - colour: pale silver aluminium, slightly cool (all photos); ribbons the
 *    palette window.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Capitol Center in Columbia, SC.jpg, Dr. Blazer, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Capitol_Center_in_Columbia,_SC.jpg
 *  - Capitol Center (Columbia, SC).jpg, Thomas Kirchel, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Capitol_Center_(Columbia,_SC).jpg
 *  - Columbia, SC Skyline.jpg, Thomas Kirchel, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Columbia,_SC_Skyline.jpg
 * Plan check: USGS NAIP orthophoto (public domain). No look-only sources.
 * No commercial imagery.
 *
 * Doubts: which faces carry the sloped skirt and how far it slopes; the
 * sign (TRUIST, lit at night) and the rooftop masts are left out; the
 * lobby glazing under the podium is guessed.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, cornice, ledge, offset, prism, save, wall, type XY } from './atl-flatiron-building'
import { rectOn } from './cola-palmetto-building'

const alu = new Part(), win = new Part(), rib = new Part(), glass = new Part(), roof = new Part(), trim = new Part()

const TX0 = -17.7, TX1 = 16.8, TY0 = -31.8, TY1 = 32.2
const C = 1.2 // corner chamfer
const tower: XY[] = [
  [TX0 + C, TY0], [TX1 - C, TY0], [TX1, TY0 + C], [TX1, TY1 - C],
  [TX1 - C, TY1], [TX0 + C, TY1], [TX0, TY1 - C], [TX0, TY0 + C],
]
const ROOF = 106.2, PARAPET = 106.8, BAND_TOP = 101.4, BAND0 = 12.6, POD = 11.6

// ── Tower ──
prism(alu, tower, 0, PARAPET, null, 0.3)
// Parapet: the roof sits 0.6 m below the coping.
const inner = offset(tower, -0.6)
wall(alu, [...inner].reverse(), ROOF, PARAPET)
ledge(alu, offset(tower, -0.3), inner, PARAPET)
prism(roof, inner, ROOF - 0.01, ROOF, roof, 0)
// Ribbons: continuous dark bands, wrapping the corners, one per two floors.
// Two 3.9 m floors to a band; the last band ends about 5 m under the
// coping, leaving the solid top band seen in the photos.
const nBands = 12, pitch = 7.75
const skin = offset(tower, 0.06)
for (let k = 0; k < nBands; k++) {
  const z0 = BAND0 + k * pitch
  wall(rib, skin, z0 + 0.4, z0 + 0.4 + 3.6)
}
// Lobby glazing on the two ends, which the podium leaves open.
for (const [a, b] of [[tower[0], tower[1]], [tower[4], tower[5]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  rectOn(win, a, b, 1.2, L - 1.2, 0.6, 5.6)
}
// Rooftop mechanical block.
box(roof, -9, 3, 4, 15, ROOF, 109.2, roof, 0.3)

// ── Podium ──
// A strip along a long face: a low wall, a sloped glass skirt, a flat roof
// back to the tower. `sx` is the outer edge, `ix` the tower face.
function skirt(sx: number, ix: number, y0: number, y1: number) {
  const dir = Math.sign(sx - ix), kx = sx - dir * 2.4 // where the slope meets the flat roof
  const lo = 4.2
  const ring: XY[] = dir < 0 ? [[sx, y0], [ix, y0], [ix, y1], [sx, y1]] : [[ix, y0], [sx, y0], [sx, y1], [ix, y1]]
  prism(alu, ring, 0, lo, null, 0)
  // ends of the sloped part and the flat part
  const ends = (y: number, front: boolean) => {
    const pts: [number, number][] = [[sx, lo], [kx, POD], [ix, POD], [ix, lo]]
    const P = pts.map(([x, z]) => [x, y, z] as [number, number, number])
    const flip = (dir < 0) === front
    if (flip) { alu.quad(P[3], P[2], P[1], P[0]) } else { alu.quad(P[0], P[1], P[2], P[3]) }
  }
  ends(y0, true)
  ends(y1, false)
  // the slope, facing out and up
  const g0: [number, number, number] = [sx, y0, lo], g1: [number, number, number] = [sx, y1, lo]
  const h0: [number, number, number] = [kx, y0, POD], h1: [number, number, number] = [kx, y1, POD]
  if (dir < 0) glass.quad(g1, g0, h0, h1)
  else glass.quad(g0, g1, h1, h0)
  // the flat roof
  const f0: [number, number, number] = [ix, y0, POD], f1: [number, number, number] = [ix, y1, POD]
  if (dir < 0) roof.quad(h0, f0, f1, h1)
  else roof.quad(f0, h0, h1, f1)
  // a coping line along the top of the low wall
  const cr: XY[] = dir < 0 ? [[sx, y0], [sx + 0.5, y0], [sx + 0.5, y1], [sx, y1]] : [[sx - 0.5, y0], [sx, y0], [sx, y1], [sx - 0.5, y1]]
  prism(trim, cr, lo - 0.5, lo + 0.1, trim, 0)
  // shopfront glazing in the low wall
  const a: XY = dir < 0 ? [sx, y1] : [sx, y0], b: XY = dir < 0 ? [sx, y0] : [sx, y1]
  rectOn(win, a, b, 1.5, Math.abs(y1 - y0) - 1.5, 0.6, lo - 0.9)
}
skirt(-24.2, TX0, -24.1, 22.8)
skirt(22.1, TX1, -31.0, 31.4)
// Vestibules: Main Street end (10 m) and the Gervais side entrance.
box(alu, -4.4, 4.5, TY1 - 0.5, 34.5, 0, 10, roof, 0.3)
rectOn(win, [4.5, 34.5], [-4.4, 34.5], 1.0, 7.9, 0.6, 8.2)
box(alu, 22.1, 24.9, -12.0, -1.3, 0, 5.2, roof, 0.3)
rectOn(win, [24.9, -12.0], [24.9, -1.3], 1.0, 9.7, 0.4, 4.0)
cornice(trim, [[-4.4, TY1 - 0.5], [4.5, TY1 - 0.5], [4.5, 34.5], [-4.4, 34.5]], 9.6, 0.4, 0.2, null)

await save('cola-capitol-center', 'Capitol Center', [
  { part: alu, material: finish('capitol-center-aluminium', 0xe3e6e6) },
  { part: win, material: PALETTE.window },
  { part: rib, material: windowVariant(2, 0x4f5a69) },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
], { height: 109.2, anchor: [34.00124, -81.034822], bearing: 70 })
