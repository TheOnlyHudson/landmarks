/**
 * Williams-Brice Stadium (1934; upper decks 1972 west, 1982 east), University
 * of South Carolina, Columbia SC. Procedural, CC0-1.0, no textures.
 *   bun generators/cola-williams-brice-stadium.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 330: model
 * north (+y) runs up the field's long axis toward 330 degrees (NNW). The
 * anchor (-81.01916, 33.97312) is the middle of the field.
 *
 * An open concrete bowl: aluminium bench seats, a lower bowl all round,
 * tall upper decks east and west each carrying a white light truss on
 * raking struts, the west press box tower behind the west upper deck, a
 * low north end with the video board, a mid-height south end deck, and the
 * four garnet-banded spiral ramp towers at the corners. The field is the
 * map's (not modelled).
 *
 * Sources
 * - OSM way/187031724 (East Stands, also covering both end zones) and
 *   way/187031725 (West Stands): footprint, corner ramp towers, press box
 *   and its west bump. leisure=stadium way/151179820 is not a building.
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid,
 *   read in the model frame. Heights above y = 0 (ground_min + 1.0 m, the
 *   street on the south-west side):
 *     field ~1.2 (at grade: the bowl is not sunken, elevation 0);
 *     west lower bowl top 12 at x -74; concourse 13; upper deck front 22 at
 *       x -86, back 33 at x -106; press box roof 46.7; light truss top 53;
 *     east lower bowl top 11.8 at x 66; upper deck 20 at x 74 to 38 at
 *       x 112; light truss top 53 (lidar shows two runs, y -78..-42 and
 *       38..80; the Eisenthesky aerial shows one continuous truss on seven
 *       struts, which is what is drawn);
 *     north end top 12 at y 90; video board top 34 at y 94-97, x -26..20;
 *     south end lower top 8.7 at y -84, upper tier 23 -> 35 from y -88 to
 *       -108;
 *     corner ramp towers 21-23 m.
 * - NAIP 2021 orthophoto (USGS): plan, garnet ramp roofs, pale seats.
 * - Photos (EVIDENCE):
 *   Ken Lund, "Williams-Brice Stadium, Home of the South Carolina Gamecocks"
 *     (east side from the street: frames, struts, truss, ramp tower),
 *     CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Williams-Brice_Stadium,_Home_of_the_South_Carolina_Gamecocks,_Columbia,_South_Carolina_(5810529551).jpg
 *   Eisenthesky Productions, "Williams Brice Stadium" (aerial from the
 *     east: continuous east truss on seven struts, frames, ramp towers), CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Williams_Brice_Stadium.jpg
 *   Idibri, "Williams-Brice Stadium at University of South Carolina"
 *     (from the field: both upper decks, trusses, north end, video board),
 *     CC BY 2.0, https://commons.wikimedia.org/wiki/File:Williams-Brice_Stadium_at_University_of_South_Carolina_-_Columbia,_SC_(16736100045).jpg
 *   Yardcock (en.wikipedia), "Williams-Brice Stadium outside" (both trusses
 *     from the parking lots), CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Williams-Brice_Stadium_outside.jpg
 * - Published: capacity 77,559 (Wikipedia), used only as context.
 *
 * Estimated: the inner field edge (x -40..37, y -60..58, corner radius 12)
 * and every profile station from the lidar sections above; how the upper
 * decks wrap into the corners (blended); strut spacing (lidar tops at
 * y = +-46, +-74); ramp tower radii (15 m, from the OSM outline) and band
 * spacing (photo). Invented: the press box window band heights; the outer
 * wall pilaster rhythm (photo shows the frames, spacing ~16 m estimated).
 * Elevation 0: the lidar puts the field ~1.2 m above the south-west street,
 * so the bowl is not sunken (evidence.md, Elevation).
 * Doubts: seat colours are simplified to aluminium (the real lower bowl has
 * garnet seat patterns); the south end's back (lidar 26-37 m behind y -110) may be a
 * second video board; drawn as the deck's back wall only. The outer walls
 * are drawn solid where the real concourses are open frames.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, cylinder, mul, prism, quad, unit, type XY } from './dc-nationals-park'

const seats = new Part(), concrete = new Part(), garnet = new Part(), steel = new Part(), glass = new Part(), shade = new Part()

// ---------------------------------------------------------------------------
// The bowl: a loft round a rounded-rectangle field edge. Each column is a
// point on the field edge with its outward normal; each profile station is
// (offset outward, height). Segments between stations take SEG's parts.
type Prof = [number, number][]
// field wall top, lower bowl top, concourse, upper deck front, upper deck back, back rail
const WEST: Prof = [[0, 2.4], [34, 12], [42, 13], [46, 22], [66, 33], [67, 33.6]]
const EAST: Prof = [[0, 2.4], [29, 11.8], [33, 12], [37, 20], [75, 38], [77, 38.6]]
const NORTH: Prof = [[0, 2.4], [32, 12], [34, 12.4], [34.6, 12.6], [35.4, 12.8], [36, 13.4]]
const SOUTH: Prof = [[0, 2.4], [24, 8.7], [26, 9], [28, 23], [48, 35], [50, 35.6]]
const SEG = [seats, concrete, garnet, seats, concrete]

const X0 = -40, X1 = 37, Y0 = -60, Y1 = 58, R = 12
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: Prof, b: Prof, t: number): Prof => a.map(([d, h], i) => [d + (b[i][0] - d) * t, h + (b[i][1] - h) * t])

type Col = { base: XY; n: XY; prof: Prof }
const cols: Col[] = []
// Counter-clockwise from above, starting at the south-east corner; the side
// decks (east, west) persist into the corners, the ends take over late.
const corners: [XY, number, Prof, Prof, boolean][] = [
  [[X1 - R, Y0 + R], -90, SOUTH, EAST, true],
  [[X1 - R, Y1 - R], 0, EAST, NORTH, false],
  [[X0 + R, Y1 - R], 90, NORTH, WEST, true],
  [[X0 + R, Y0 + R], 180, WEST, SOUTH, false],
]
const K = 10
for (const [c, a0, pa, pb, sideIsB] of corners) {
  for (let k = 0; k <= K; k++) {
    const phi = k / K, a = ((a0 + 90 * phi) * Math.PI) / 180
    const n: XY = [Math.cos(a), Math.sin(a)]
    // t: share of pb. A side deck keeps its profile over most of the arc.
    const t = sideIsB ? smooth(clamp((phi - 0.1) / 0.5)) : smooth(clamp((phi - 0.4) / 0.5))
    cols.push({ base: [c[0] + n[0] * R, c[1] + n[1] * R], n, prof: mix(pa, pb, t) })
  }
}
const P = (c: Col, i: number, z?: number): V3 => {
  const [d, h] = c.prof[i]
  return [c.base[0] + c.n[0] * d, c.base[1] + c.n[1] * d, z ?? h]
}
for (let j = 0; j < cols.length; j++) {
  const A = cols[j], B = cols[(j + 1) % cols.length]
  const n: V3 = unit([A.n[0] + B.n[0], A.n[1] + B.n[1], 0])
  if (Math.hypot(A.base[0] - B.base[0], A.base[1] - B.base[1]) < 1e-6 && A.n[0] === B.n[0] && A.n[1] === B.n[1]) continue
  // field wall, facing the field
  quad(garnet, [P(A, 0, 0), P(B, 0, 0), P(B, 0), P(A, 0)], mul(n, -1))
  for (let i = 0; i < SEG.length; i++) {
    const dd = (A.prof[i + 1][0] - A.prof[i][0] + B.prof[i + 1][0] - B.prof[i][0]) / 2
    const dz = (A.prof[i + 1][1] - A.prof[i][1] + B.prof[i + 1][1] - B.prof[i][1]) / 2
    quad(SEG[i], [P(A, i), P(B, i), P(B, i + 1), P(A, i + 1)], [-dz * n[0], -dz * n[1], dd])
  }
  // back wall down to the ground
  const L = SEG.length
  quad(concrete, [P(A, L), P(B, L), P(B, L, 0), P(A, L, 0)], n)
}

// ---------------------------------------------------------------------------
const beam = (p: Part, a: V3, b: V3, w: number, h = w) => {
  const ax = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  let side = unit([-ax[1], ax[0], 0])
  if (Math.hypot(ax[0], ax[1]) < 1e-6) side = [1, 0, 0]
  const up: V3 = [ax[1] * side[2] - ax[2] * side[1], ax[2] * side[0] - ax[0] * side[2], ax[0] * side[1] - ax[1] * side[0]]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  box(p, mul(add(a, b), 0.5), [ax, side, up], [L / 2, w / 2, h / 2], true)
}

// Light trusses: a white box truss on raking struts that rise from the back
// of the upper deck. East: two runs; west: one run over the press box.
function truss(x: number, y0: number, y1: number, backX: number, backZ: number, supports: number[]) {
  beam(steel, [x, y0, 50.8], [x, y1, 50.8], 2.2, 3.2)
  for (const y of supports) {
    for (const s of [-1, 1]) beam(steel, [backX, y + s * 3, backZ], [x, y, 49.5], 1.1)
    // the outer frame column below the strut
    box(steel, [backX + Math.sign(backX) * 0.9, y, backZ / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.9, 1.4, backZ / 2])
  }
}
// East: one continuous run on seven raking struts (Eisenthesky aerial; the
// 2019 lidar caught only the ends of it). West: one run over the press box.
truss(96, -80, 80, X1 + 77.6, 38.6, [-72, -48, -24, 0, 24, 48, 72])
truss(-104, -68, 78, X0 - 67.6, 33.6, [-60, -42, 42, 62])
// Outer concrete frames on the long sides (Lund photo), ~16 m apart, with
// the dark gate level and open concourse bands between them.
const WX = X1 + 77.05, WWX = X0 - 67.05
for (const y of [-46, -30, -14, 2, 18, 34]) box(steel, [X1 + 77.9, y, 19], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.9, 1.2, 19])
for (const y of [-46, -38, 38, 44]) box(steel, [X0 - 67.9, y, 16.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.9, 1.2, 16.5])
for (const [z0, z1] of [[0.4, 4.4], [11, 14], [19, 21.5]]) {
  quad(shade, [[WX, -48, z0], [WX, 46, z0], [WX, 46, z1], [WX, -48, z1]], [1, 0, 0])
  for (const [ya, yb] of [[-48, -32.5], [29.5, 46]])
    quad(shade, [[WWX, yb, z0], [WWX, ya, z0], [WWX, ya, z1], [WWX, yb, z1]], [-1, 0, 0])
}

// West press box tower: x -106..-121, y -32..29 (OSM), roof 46.7 (lidar).
const PRESS: XY[] = [[-106.6, -32], [-106.6, 29], [-118.6, 29], [-120.9, 8.7], [-121, -12], [-117.9, -32]]
prism(PRESS, 0, 46.7, concrete, concrete)
prism([[-121, -6], [-121, 2.4], [-128.6, 2.3], [-128.5, -6]], 0, 46.7, concrete, concrete) // stair and lift core
for (const [z0, z1] of [[35.5, 39.5], [41, 45]]) {
  quad(glass, [[-106.5, -31, z0], [-106.5, 28, z0], [-106.5, 28, z1], [-106.5, -31, z1]], [1, 0, 0])
}
for (const [z0, z1] of [[24, 28], [33, 37], [40.5, 44.5]]) {
  quad(glass, [[-121.06, -11, z0], [-121.06, -7, z0], [-121.06, -7, z1], [-121.06, -11, z1]], [-1, 0, 0])
  quad(glass, [[-118.4, -31.5, z0], [-121.0, -12.5, z0], [-121.0, -12.5, z1], [-118.4, -31.5, z1]], [-1, -0.14, 0])
  quad(glass, [[-121.0, 3, z0], [-118.7, 28.5, z0], [-118.7, 28.5, z1], [-121.0, 3, z1]], [-1, 0.09, 0])
}

// North end video board on two legs, facing the field.
box(shade, [-3, 96, 26.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [23, 1.4, 7.5], true)
quad(glass, [[19, 94.55, 20], [-25, 94.55, 20], [-25, 94.55, 33], [19, 94.55, 33]], [0, -1, 0])
for (const x of [-18, 12]) box(concrete, [x, 96, 9.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1.5, 1.2, 9.5])

// The spiral ramp towers: a grey ramp drum, garnet parapet bands and a
// garnet roof (NAIP, Lund photo). Centres and radii from the OSM outline.
function ramp(c: XY, r: number, top: number) {
  cylinder(shade, c, r - 1.2, 0, top - 1, 16, null)
  for (let z = 3.6; z < top - 2; z += 4.2) cylinder(garnet, c, r, z, z + 1.7, 16, garnet)
  cylinder(garnet, c, r, top - 1.6, top, 16, concrete)
}
ramp([-66, 88], 14.5, 22.5)
ramp([65, 88], 15, 22.5)
ramp([67, -90], 14.5, 21.5)
ramp([-68, -90], 14.5, 21.5)
// small stair towers at the south end (OSM)
for (const x of [-30.5, 23.4]) cylinder(concrete, [x, -120.5], 4.2, 0, 24, 12, garnet)

// ---------------------------------------------------------------------------
const parts = [
  { part: seats, material: finish('wbs-aluminium', 0xc3c8cd) },
  { part: concrete, material: finish('wbs-concrete', 0xe6e3dc) },
  { part: garnet, material: finish('wbs-garnet', 0x8e3440) },
  { part: steel, material: PALETTE.trim },
  { part: glass, material: PALETTE.window },
  { part: shade, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Williams-Brice Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 330, osm: 'way/187031724', height: 53,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cola-williams-brice-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
