/**
 * Council Hall (old Salt Lake City Hall, 1866; rebuilt on Capitol Hill
 * 1960-63), Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-council-hall.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, built with the front on -x and placed at
 * bearing 90, so the model's -x (the front) faces real north, its +y real
 * east and +x real south. The origin is the centre of OSM way/40790652
 * (-111.887730, 40.775545). y = 0 is the ground at the foot of the terrace.
 *
 * Which way the front faces (revision 2; the first version faced it west):
 * - OSM streets: 300 North (tertiary, yellow centre line) runs 34 m north of
 *   the hall and State Street 33 m west; a car park fills the east side and
 *   apartments (way/566879970) stand 15 m to the south, so no street there.
 * - Chris Light's "Council Hall 4437.jpg" (12:43 on 13 May 2024, taken
 *   "across from the state Capitol") looks at the front over a street with a
 *   yellow centre line, with snowy Wasatch peaks on the left (east): the
 *   camera looks south from 300 North. Tree shadows fall towards the camera
 *   (sun in the south-south-east), so the camera faces the sun.
 * - "Council Hall 4453.jpg" (12:53, same day) looks across the car park at a
 *   four-bay side, the front with its balcony on the right: the camera is in
 *   the east car park (NAIP) looking west, so the front is on the north.
 * - USGS NAIP (public domain): the car park east, the lawn and paths north
 *   and north-west, a paved terrace about 3 m wide round the west, south and
 *   east walls, the pale green hipped roof.
 * So the front, with its door, balcony and dressed stone, faces north to
 * 300 North and the Capitol; the rear (rough ashlar) faces south.
 *
 * Form: a near-square two-storey hall of red sandstone, with a low stone
 * terrace (0.5 m, 3 m deep) before the front only: Alede2010's photo shows its
 * stone edge and the step at the door (revision 3: the terrace round the
 * other sides, seen as paving in NAIP, is left to the map's ground). The north front is dressed stone in seven bays between pilasters:
 * tall white-framed windows below, six-over-six windows above, a double
 * door in the middle under a small balcony on brackets with a French window
 * behind it, a carved band between the storeys; the north, south and east
 * walls are rough ashlar with four bays of white-framed windows. Over all
 * of it a tall white frieze (2 m with the cornice), a bracketed cornice and a white balustrade, a very low
 * green metal hipped roof (rising 1.4 m, barely seen over the balustrade), and on the roof a square white cupola base with
 * a balustrade, an octagonal white belfry with arched louvres and a green
 * dome with a finial.
 *
 * Sources
 * - OSM (ODbL): way/40790652 (outline, "Utah Travel Council", 2 levels,
 *   19.35 m east-west x 19.66 m north-south). Wikidata Q2215312.
 * - HABS UT-74 (Library of Congress, public domain): photo "FRONT AND SIDE
 *   ELEVATIONS - Salt Lake City Hall, 300 North State Street"
 *   (https://commons.wikimedia.org/wiki/File:FRONT_AND_SIDE_ELEVATIONS_(CARDINAL_POINTS_NOT_KNOWN)_-_Salt_Lake_City_Hall,_300_North_State_Street,_Salt_Lake_City,_Salt_Lake_County,_UT_HABS_UTAH,18-SALCI,24-1.tif):
 *   the front's bays and pilasters, the rough-ashlar side with four bays,
 *   the terrace, the cornice brackets, the cupola's stages.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Alede2010, "Salt Lake Council Hall.jpg", CC BY-SA 4.0 (north front,
 *     nearly square on: window sizes, the balcony, colours);
 *   Chris Light, "Council Hall 4437.jpg", CC BY-SA 4.0 (north front from
 *     300 North: storey heights, the cupola and green dome);
 *   Chris Light, "Council Hall 4453.jpg", CC BY-SA 4.0 (east side across
 *     the car park: four bays, the green hipped roof).
 * - Published: built 1864-66 as Salt Lake City Hall and seat of the
 *   territorial legislature; taken down and rebuilt on Capitol Hill in
 *   1960-63; red sandstone (Wikipedia, "Council Hall (Salt Lake City)").
 * Estimated from the photos (scaled to OSM's 19.3 m front): storey lines
 *   (ground storey 0.5-5.2, upper storey to 9.2, frieze to 10.5, cornice
 *   11.1, balustrade 12.0; the frieze and cornice are about 2 m tall in
 *   Alede2010's photo), the roof's rise (10.9 to 12.3), window sizes, the roof's pitch, the cupola base
 *   (7.6 m square to 14.4), belfry (5.0 m across, to 18.2), dome (to 21.0)
 *   and finial (22.3).
 * Left out: the "COUNCIL HALL" sign's lettering (a plain board), lamp posts,
 *   the chimney, the frieze's lattice, the belfry's round panels.
 * Doubts: the south (rear) and west walls are not in any photo used; they
 *   are drawn like the east side. The front's direction rests on the
 *   reasoning above, not on a photo with a recorded camera position. The belfry is drawn octagonal (a square with wide chamfers)
 *   as the lead's note and the photos' corner shading suggest.
 * Revision 3: the hipped roof is a muted grey-green (#a9b5ad), paler than
 *   the dome's copper, so it stays unobtrusive from above as in the photos
 *   (the finial and belfry louvres share it).
 * Night: windows and doors are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, flatShape, extrudeShape, archShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

const HW = 9.83, HD = 9.675 // half-depths of the walls: x (front to back, real north-south) and y (along the front, real east-west)
const T = 0.5 // terrace top
const ST = 5.2 // the string course between the storeys
const FR = 9.2, CO = 10.5, CT = 11.1, BT = 12.0 // frieze, cornice base, cornice top, balustrade top
const CB = 3.8 // the cupola base's half-width

/** A planar polygon, wound to face along `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
  const q = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? pts.slice().reverse() : pts
  for (let i = 1; i < q.length - 1; i++) part.tri(q[0], q[i], q[i + 1])
}
const sq = (h: number) => rect(-h, -h, h, h)

// Faces in the model frame (the front is the model-west face, real north). West s = -y, east s = y, south s = x, north s = -x.
const west: Face = { o: [-HW, 0, 0], n: [-1, 0] }
const east: Face = { o: [HW, 0, 0], n: [1, 0] }
const south: Face = { o: [0, -HD, 0], n: [0, -1] }
const north: Face = { o: [0, HD, 0], n: [0, 1] }

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), green = new Part(), grey = new Part()
  /** A white-framed window. */
  const W = (f: Face, s: number, w: number, z0: number, z1: number, fr = 0.24) => {
    extrudeShape(trim, f, rect(s - w / 2 - fr, z0 - fr, s + w / 2 + fr, z1 + fr), 0, 0.08)
    flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z1), 0.1)
  }

  // ------------------------------------------------------------ terrace and walls
  // the terrace: only before the front (revision 3). Photo Alede2010 shows a raised stone
  // platform with a step at the door on the north; on the east (Chris Light 4453) the lawn
  // and paving run to the wall, so the map's ground is left to draw the other sides.
  {
    const x0 = -HW - 3.0, x1 = -HW, ys = [-HD - 1, -HD + 3.9, -HD + 8.8, HD - 8.8, HD - 3.9, HD + 1]
    for (let j = 0; j + 1 < ys.length; j++) prism(stone, stone, rect(x0, ys[j], x1, ys[j + 1]), 0, T)
  }
  // a step down from the terrace before the front door
  prism(stone, stone, rect(-HW - 4.0, -2.4, -HW - 3.0, 2.4), 0, T * 0.5)
  prism(stone, null, rect(-HW, -HD, HW, HD), 0, FR) // walls from the ground (the terrace is only on the front)
  // the white frieze, the bracketed cornice, the balustrade (drawn solid)
  const box = (h: number, d: number) => rect(-HW - h, -HD - d, HW + h, HD + d)
  prism(trim, null, box(0.05, 0.05), FR, CO)
  prism(trim, trim, box(0.45, 0.45), CO, CT)
  {
    const r0 = box(0.45, 0.45)
    poly(trim, r0.map(([x, y]) => [x, y, CO] as V3), [0, 0, -1])
  }
  const BW = 0.3 // the balustrade's thickness
  prism(trim, null, box(0.3, 0.3), CT, BT)
  prism(trim, null, box(0.3 - BW, 0.3 - BW).reverse(), CT, BT)
  {
    const o = box(0.3, 0.3), i = box(0.3 - BW, 0.3 - BW)
    for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; poly(trim, [[o[k][0], o[k][1], BT], [o[l][0], o[l][1], BT], [i[l][0], i[l][1], BT], [i[k][0], i[k][1], BT]], [0, 0, 1]) }
  }
  // brackets under the cornice, over each pilaster
  const bracket = (f: Face, s: number) => extrudeShape(trim, f, [[s - 0.18, CO - 0.7], [s + 0.18, CO - 0.7], [s + 0.18, CO], [s - 0.18, CO]], 0, 0.35)

  // ------------------------------------------------------------ the front (model west, real north): seven bays between dressed pilasters
  const bays = [-7.35, -4.95, -2.55, 0, 2.55, 4.95, 7.35]
  const piers = [-9.45, -6.15, -3.75, -1.3, 1.3, 3.75, 6.15, 9.45]
  for (const s of piers) {
    extrudeShape(stone, west, rect(s - 0.3, T, s + 0.3, FR), 0, 0.16)
    bracket(west, s)
  }
  extrudeShape(stone, west, rect(-HD, ST - 0.25, HD, ST + 0.45), 0, 0.2) // the carved band between the storeys
  for (const s of bays) {
    if (s === 0) {
      // the double door with its transom, the sign board, the balcony and its French window
      extrudeShape(trim, west, rect(-1.0, T, 1.0, 4.5), 0, 0.08)
      flatShape(win, west, rect(-0.8, T, 0.8, 4.3), 0.1)
      extrudeShape(trim, west, rect(-1.3, 4.55, 1.3, 5.05), 0, 0.3)
      W(west, 0, 1.3, 5.7, 9.0)
      extrudeShape(trim, west, rect(-1.75, 5.25, 1.75, 5.45), 0, 1.1) // balcony floor
      extrudeShape(trim, west, rect(-1.75, 5.45, 1.75, 6.4), 0.95, 1.1) // balcony balustrade, front
      for (const e of [-1, 1]) {
        const y = -e * 1.68 // s = -y on the west face
        poly(trim, [[-HW - 0.2, y - 0.07, 5.45], [-HW - 1.1, y - 0.07, 5.45], [-HW - 1.1, y - 0.07, 6.4], [-HW - 0.2, y - 0.07, 6.4]], [0, -1, 0])
        poly(trim, [[-HW - 0.2, y + 0.07, 5.45], [-HW - 1.1, y + 0.07, 5.45], [-HW - 1.1, y + 0.07, 6.4], [-HW - 0.2, y + 0.07, 6.4]], [0, 1, 0])
      }
      continue
    }
    // tall ground-storey windows over white panels; six-over-six windows above
    extrudeShape(trim, west, rect(s - 0.9, T, s + 0.9, 1.3), 0, 0.08)
    W(west, s, 1.5, 1.45, 4.5)
    W(west, s, 1.25, 6.1, 8.8)
  }
  // ------------------------------------------------------------ the rough-ashlar sides and rear: four bays
  for (const [f, half] of [[south, HW], [north, HW], [east, HD]] as [Face, number][]) {
    for (const s of [-0.36, -0.12, 0.12, 0.36].map((k) => k * half * 2)) {
      W(f, s, 1.15, 1.4, 4.0)
      W(f, s, 1.15, 6.1, 8.6)
    }
    for (const s of [-half + 0.25, half - 0.25]) bracket(f, s)
    for (const s of [-0.24, 0, 0.24].map((k) => k * half * 2)) bracket(f, s)
  }

  // ------------------------------------------------------------ the roof and cupola
  // a low hipped metal roof from inside the balustrade to the cupola base
  {
    const zr0 = CT - 0.2, zr1 = 12.3, ix = HW - 0.1, iy = HD - 0.1
    const o: V3[] = [[-ix, -iy, zr0], [ix, -iy, zr0], [ix, iy, zr0], [-ix, iy, zr0]]
    const i: V3[] = [[-CB, -CB, zr1], [CB, -CB, zr1], [CB, CB, zr1], [-CB, CB, zr1]]
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4, mx = (o[k][0] + o[l][0]) / 2, my = (o[k][1] + o[l][1]) / 2
      poly(grey, [o[k], o[l], i[l], i[k]], [mx, my, 8])
    }
  }
  // the square base: white boards, a small window each side, a cornice and a balustrade
  prism(trim, null, sq(CB), 12.0, 14.0)
  prism(trim, green, sq(CB + 0.3), 14.0, 14.4)
  for (const f of [west, east, south, north].map((f) => ({ o: [f.n[0] * CB, f.n[1] * CB, 0] as V3, n: f.n }))) W(f, 0, 0.8, 12.6, 13.4, 0.1)
  {
    const o = sq(CB + 0.15), i = sq(CB - 0.05)
    prism(trim, null, o, 14.4, 15.1)
    prism(trim, null, i.slice().reverse(), 14.4, 15.1)
    for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; poly(trim, [[o[k][0], o[k][1], 15.1], [o[l][0], o[l][1], 15.1], [i[l][0], i[l][1], 15.1], [i[k][0], i[k][1], 15.1]], [0, 0, 1]) }
  }
  // the octagonal belfry: a square of 5.0 m with 0.9 m chamfers, a pair of arched louvres on each main face
  const R = 2.5, C = 0.9
  const oct: XY[] = [[-R + C, -R], [R - C, -R], [R, -R + C], [R, R - C], [R - C, R], [-R + C, R], [-R, R - C], [-R, -R + C]]
  prism(trim, null, oct, 14.4, 18.0)
  for (const f of [west, east, south, north].map((f) => ({ o: [f.n[0] * R, f.n[1] * R, 0] as V3, n: f.n }))) {
    for (const s of [-0.62, 0.62]) flatShape(grey, f, archShape(s, 0.72, 15.3, 16.9, 6), 0.05)
  }
  const octOut = (d: number): XY[] => [[-R + C, -R - d], [R - C, -R - d], [R + d, -R + C], [R + d, R - C], [R - C, R + d], [-R + C, R + d], [-R - d, R - C], [-R - d, -R + C]]
  prism(trim, trim, octOut(0.3), 18.0, 18.5)
  {
    const o = octOut(0.3)
    poly(trim, o.map(([x, y]) => [x, y, 18.0] as V3), [0, 0, -1])
  }
  // the green dome and the finial
  lathe(green, 0, 0, [[2.45, 18.5], [2.45, 18.8], [2.35, 19.5], [2.05, 20.1], [1.5, 20.6], [0.8, 20.9], [0.01, 21.0]], 16)
  lathe(grey, 0, 0, [[0.14, 21.0], [0.1, 21.6], [0.2, 21.75], [0.08, 21.9], [0.01, 22.3]], 6)

  return finishGlb('Council Hall', [
    { part: stone, material: finish('sch-sandstone', 0xc4876c) },
    { part: trim, material: finish('sch-white', 0xf6f2ea) },
    { part: win, material: PALETTE.window },
    { part: green, material: PALETTE.copper },
    { part: grey, material: finish('sch-roof', 0xa9b5ad) },
  ], { bearing: 90, height: 22.3, replaces: ['way/40790652'] }, 5000)
}

if (import.meta.main) await writeModel('slc-council-hall', build())
