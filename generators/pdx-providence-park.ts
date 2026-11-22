/**
 * Providence Park, Portland, Oregon (1926 as Multnomah Stadium, A. E.
 * Doyle; rebuilt 2001; east stand expanded 2019, Allied Works) — home of
 * the Timbers and the Thorns. Procedural, CC0-1.0, no textures.
 * bun generators/pdx-providence-park.ts
 *
 * Map frame: y along the pitch (+y at bearing 21°, north-north-east,
 * towards SW Morrison Street), x across it (+x east-south-east, towards
 * SW 18th Avenue), z up, metres. Anchor: area centroid of the OSM stadium
 * outline way/99615044, -122.691757, 45.521597.
 *
 * Sunken bowl: z = 0 is the pitch. The pitch lies 9.6 m below SW 18th
 * Avenue and SW Morrison Street outside (lidar: the turf 0.4 m over the
 * box's lowest return, the streets on the east and north 9.6-10.0 m, the
 * west side, SW 20th, 12.3 m), so the placement takes elevation -9.6.
 * Measured from the lidar's surface returns on the turf and on the
 * streets (not from bare-earth terrain), for want of a published field
 * level; the photos agree, showing the arched wall about 14-15 m tall from
 * the street, where the lidar puts its roof 24.5 m over the pitch.
 *
 * What makes it read as itself: the old horseshoe of grey-green concrete,
 * its street wall a row of tall round-headed arches, roofed over its
 * whole depth down the west side and round the north end; the tall 2019
 * east stand, its white curved roof rising to the east over a glass wall
 * crossed by white struts; the open low south end.
 *
 * Evidence
 * - OSM: the stadium outline way/99615044 (leisure=stadium, no building
 *   tag); the horseshoe grandstand way/99614906; the east grandstand
 *   way/156259872; the Providence Sports Care Center way/156259873
 *   (building=stadium, height 13.91); the pitch way/99615149 (68 × 100 m,
 *   at 21°, left to the map).
 * - Measured, lidar: USGS 3DEP OR_OLCMetro_2019 (flown 2019, the year the
 *   east stand opened; its roof is in the cloud). Over the pitch: the
 *   horseshoe's roof 24.2-25.2 m, flat, from the street wall to the
 *   grandstand's inner line; the east stand's roof 29.5-31.6 m at its
 *   front edge (x 42), 33.4 (x 50), 35.3 (x 55), 36.8 (x 60), 38.0
 *   (x 65), 38.6-38.8 (x 70-75), 37.3 at its back (x 85); its south end
 *   34-36 m at x 65-75 (the stair tower and terraces); the south end's
 *   low terraces 2-6 m, rising to 10 m at the outline; the Sports Care
 *   Center 14.4 m.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Steve Morgan, "Exterior of Providence Park from south in 2024 -
 *     Portland, OR.jpg" (CC BY-SA 4.0; the east stand's south end: the
 *     white roof truss, the concrete stair tower, the glass terraces, the
 *     struts across the glass wall, the Sports Care Center)
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_Providence_Park_from_south_in_2024_-_Portland,_OR.jpg
 *   Kingofthedead, "Portland Timbers 2017-05-14 21.jpg" (CC BY-SA 4.0;
 *     the north gate: the arched grey-green wall)
 *     https://commons.wikimedia.org/wiki/File:Portland_Timbers_2017-05-14_21.jpg
 *   M.O. Stevens, "Providence Park main entrance - Portland, Oregon.JPG"
 *     (CC BY-SA 3.0; the curved arched wall, its height and colour)
 *     https://commons.wikimedia.org/wiki/File:Providence_Park_main_entrance_-_Portland,_Oregon.JPG
 * - Terrain: the map's ground does not show the dig, so the rakes start
 *   at 10.6 m (1 m above the street) instead of at the pitch's edge, and
 *   the south end's low terraces are left out; under the roofs this hides
 *   only rows no map view sees.
 * - Estimated: the arches (6 m wide, 9 m to the crown, every 9 m) from the
 *   photos; the seating rakes (from 10.6 m at the pitch's edge to 18 m at
 *   the back of the horseshoe, to 30 m at the back of the east stand); the
 *   stair tower and terrace block's size and place at the east stand's
 *   south end, from the photo and the lidar's 34-36 m there; the struts'
 *   pattern.
 * - Doubts: the inside (columns, the upper east deck's underside, press
 *   boxes) is simplified to two rakes under the roofs; the east roof is
 *   one curved sheet, its truss shown only as its white colour. Not
 *   drawn: signs, scoreboard, the ivy, light towers.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, triangulate, box, type XY } from './dc-nationals-park'

const HORSESHOE: XY[] = [[-84.1,-75.7],[-45.0,-76.8],[-45.1,-66.2],[-45.3,-6.8],[-45.3,19.5],[-45.4,27.0],[-44.8,31.3],[-43.5,35.6],[-41.9,38.4],[-41.1,39.4],[-39.1,41.9],[-37.1,43.7],[-33.4,45.8],[-28.9,48.0],[-23.1,50.3],[-16.3,52.3],[-12.2,53.0],[-7.6,53.8],[-1.1,54.3],[6.3,54.3],[9.3,53.9],[12.9,53.1],[16.2,52.3],[21.8,50.8],[24.5,50.0],[28.0,48.8],[30.5,47.6],[33.5,46.1],[36.7,44.1],[39.9,41.7],[42.7,38.1],[76.3,58.2],[74.0,61.9],[71.1,65.5],[67.8,69.1],[64.3,72.5],[60.3,76.1],[55.1,79.2],[49.7,82.3],[43.5,84.9],[36.6,87.5],[30.4,89.6],[30.4,93.9],[11.6,93.9],[-30.2,93.8],[-30.1,89.3],[-35.4,87.8],[-41.9,85.3],[-47.1,83.0],[-51.0,81.2],[-55.2,78.6],[-60.0,75.4],[-63.2,72.8],[-64.1,72.1],[-68.3,67.8],[-71.7,64.1],[-74.4,60.5],[-76.6,56.7],[-78.7,52.3],[-81.2,46.8],[-84.9,46.8],[-84.2,-64.9]]
const CARE: XY[] = [[49.2,-83.8],[54.8,-80.2],[61.6,-67.7],[73.0,-67.7],[72.8,-82.6],[72.8,-89.2],[49.4,-90.0]]

const concrete = new Part(), roof = new Part(), seats = new Part(), glass = new Part(), white = new Part()
const ROOF = 24.5, STREET_N = 9.8, STREET_W = 12.3
// The rakes start just above the street: the map's terrain does not show
// the dig, so anything facing up below the street would be buried.
const RAKE0 = 10.6

// ------------------------------------------------------------ horseshoe ---
// Points 1-30 run along the grandstand's inner line (the pitch side); the
// rest are its street wall.
const inner = (i: number) => i >= 1 && i <= 30
{
  // The seating: one rake from the pitch's edge to the back wall.
  const P = HORSESHOE.map((p, i): V3 => [p[0], p[1], inner(i) ? RAKE0 : 18])
  for (const [a, b, c] of triangulate(HORSESHOE)) seats.tri(P[a], P[b], P[c])
  // The roof over the whole depth, 1.2 m thick, closed underneath.
  prism(HORSESHOE, ROOF - 1.2, ROOF, roof, roof)
  for (const [a, b, c] of triangulate(HORSESHOE)) {
    const q = (k: number): V3 => [HORSESHOE[k][0], HORSESHOE[k][1], ROOF - 1.2]
    roof.tri(q(a), q(c), q(b))
  }
  // The street wall, from the pitch level to the roof (the map hides what
  // is below the street), and the stand's two ends.
  const N = HORSESHOE.length
  const ring = HORSESHOE
  const ccw = ring.reduce((s, p, i) => { const q = ring[(i + 1) % N]; return s + p[0] * q[1] - q[0] * p[1] }, 0) > 0
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (inner(i) && inner(j)) continue
    const a = ring[i], b = ring[j], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const s = ccw ? 1 : -1, o: V3 = [(s * (b[1] - a[1])) / L, (-s * (b[0] - a[0])) / L, 0]
    const n = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < n; k++) {
      const p0 = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n], p1 = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      quad(concrete, [[p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], ROOF - 1.2], [p0[0], p0[1], ROOF - 1.2]], o)
    }
  }
  // The arches along the street wall: every 9 m of its length, 6 m wide,
  // round-headed, their crowns 9 m above the street, set on the chord
  // just proud of the curve.
  const path = ring.slice(31).concat([ring[0]]) // (76.3,58.2) round to (-84.1,-75.7)
  const cum = [0]
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const at = (s: number): XY => {
    let i = 1
    while (i < path.length - 1 && cum[i] < s) i++
    const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1])
    return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t]
  }
  const total = cum[cum.length - 1], count = Math.floor((total - 6) / 9)
  for (let k = 0; k < count; k++) {
    const sc = 6 + k * 9 + (total - 12 - (count - 1) * 9) / 2
    const a = at(sc - 3), b = at(sc + 3), m = at(sc)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    let o: XY = [e[1], -e[0]]
    // Outward: away from the pitch's centre.
    if (o[0] * m[0] + o[1] * (m[1] + 8) < 0) o = [-o[0], -o[1]]
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
    const sag = Math.max(0, (m[0] - cx) * o[0] + (m[1] - cy) * o[1]) + 0.08
    const z0 = m[1] > 40 ? STREET_N : STREET_W
    const pt = (u: number, z: number): V3 => [cx + e[0] * u + o[0] * sag, cy + e[1] * u + o[1] * sag, z]
    const n3: V3 = [o[0], o[1], 0]
    quad(glass, [pt(-3, z0), pt(3, z0), pt(3, z0 + 6), pt(-3, z0 + 6)], n3)
    for (let q = 0; q < 8; q++) {
      const t0 = (Math.PI * q) / 8, t1 = (Math.PI * (q + 1)) / 8
      const c = pt(0, z0 + 6), p0 = pt(3 * Math.cos(t0), z0 + 6 + 3 * Math.sin(t0)), p1 = pt(3 * Math.cos(t1), z0 + 6 + 3 * Math.sin(t1))
      quad(glass, [c, p0, p1, c], n3)
    }
  }
}

// ----------------------------------------------------------- east stand ---
// The rake, the curved white roof (lidar heights over the pitch), the glass
// wall with its white struts, and the south end's tower and terraces.
{
  const Y0 = -67.8, Y1 = 37.5, XF = 40.4, XB = 81
  const zRoofE = (x: number) => 31.1 + 7.9 * Math.sin((Math.min(Math.max(x, 42), 86) - 42) / 33 * Math.PI / 2) - (x > 75 ? (x - 75) * 0.12 : 0)
  quad(seats, [[XF, Y0, RAKE0], [XF, Y1, RAKE0], [XB, Y1, 30], [XB, Y0, 30]], [-1, 0, 1])
  // The roof: a curved sheet from x 42 to 84, 1.5 m deep.
  const xs = [42, 47, 52, 57, 62, 67, 72, 77, 81, 84]
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1]
    quad(white, [[a, Y0, zRoofE(a)], [b, Y0, zRoofE(b)], [b, Y1, zRoofE(b)], [a, Y1, zRoofE(a)]], [0, 0, 1])
    quad(white, [[a, Y0, zRoofE(a) - 1.5], [a, Y1, zRoofE(a) - 1.5], [b, Y1, zRoofE(b) - 1.5], [b, Y0, zRoofE(b) - 1.5]], [0, 0, -1])
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][])
      quad(white, [[a, y, zRoofE(a) - 1.5], [b, y, zRoofE(b) - 1.5], [b, y, zRoofE(b)], [a, y, zRoofE(a)]], [0, s, 0])
  }
  quad(white, [[42, Y0, zRoofE(42) - 1.5], [42, Y1, zRoofE(42) - 1.5], [42, Y1, zRoofE(42)], [42, Y0, zRoofE(42)]], [-1, 0, 0])
  quad(white, [[84, Y0, zRoofE(84) - 1.5], [84, Y1, zRoofE(84) - 1.5], [84, Y1, zRoofE(84)], [84, Y0, zRoofE(84)]], [1, 0, 0])
  // The east wall: glass up to the roof, in 5 m pieces, with white struts
  // leaning alternately, as the photo shows them fanning along the wall.
  const top = zRoofE(XB) - 1.5
  for (let y = Y0; y < Y1 - 0.01; y += (Y1 - Y0) / 21) {
    const y1 = y + (Y1 - Y0) / 21
    quad(glass, [[XB, y, 0], [XB, y1, 0], [XB, y1, top], [XB, y, top]], [1, 0, 0])
  }
  for (let k = 0; k < 18; k++) {
    const y = Y0 + 4 + k * ((Y1 - Y0 - 8) / 17), lean = k % 2 ? 2.5 : -2.5
    const x = XB + 0.08
    quad(white, [[x, y - 0.3, STREET_N], [x, y + 0.3, STREET_N], [x, y + 0.3 + lean, top], [x, y - 0.3 + lean, top]], [1, 0, 0])
  }
  // The south end: wall, the concrete stair tower, the glass terraces.
  quad(concrete, [[XF, Y0, 0], [XB, Y0, 0], [XB, Y0, 30], [XF, Y0, RAKE0]], [0, -1, 0])
  box(concrete, [61.5, -70, 16.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [3.5, 3.5, 16.5])
  box(glass, [73, -69.5, 15], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [7.5, 2.5, 15])
  box(concrete, [73, -69.5, 30.2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [7.8, 2.8, 0.3])
  // The north end: the wedge up to the horseshoe's junction.
  quad(seats, [[XF, Y1, RAKE0], [42.7, 38.1, RAKE0], [76.3, 58.2, 18], [XB, Y1, 30]], [0, 1, 1])
  quad(concrete, [[76.3, 58.2, 0], [XB, Y1, 0], [XB, Y1, 30], [76.3, 58.2, 18]], [1, 1, 0])
}

// ------------------------------------------------------------- south end ---
// The south end's low terraces (lidar 2-6 m over the pitch) lie wholly
// below the street, so they are left to the map; the Sports Care Center in
// the south-east corner stands 4.8 m above the street.
prism(CARE, 0, 14.4, concrete, roof)

// --------------------------------------------------------------- output ---
// Colours from the daylight photos: the old concrete a grey-green, pulled
// light; the seats the Timbers' green, pulled light; the roofs grey and,
// on the east stand, white; the arches and glass dark.
const parts = [
  { part: concrete, material: finish('pp-concrete', 0xbdbea7) },
  { part: roof, material: PALETTE.roof },
  { part: seats, material: finish('pp-seats', 0x6f9274) },
  { part: glass, material: PALETTE.window },
  { part: white, material: PALETTE.trim },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Providence Park', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the pitch',
    bearing: 21, osm: 'way/99615044', height: 39,
  })
  const out = new URL('../models/pdx-providence-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
