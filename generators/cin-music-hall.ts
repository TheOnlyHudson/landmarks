/**
 * Cincinnati Music Hall (1878, Samuel Hannaford, High Victorian Gothic),
 * Over-the-Rhine — original procedural geometry, CC0-1.0.
 * bun generators/cin-music-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = centroid of the OSM outline way/40047145,
 * -84.519207, 39.109394. The outline's walls run at 79° / 169°, so the
 * catalog bearing is 349 and the Elm Street front (facing 79°, onto
 * Washington Park) is the model's +x face.
 *
 * Identity, in order: the symmetrical red-brick Elm Street front; the tall
 * central gable with its big rose window inside a pointed relieving arch
 * and three tall pointed windows under it; the two square towers either
 * side with steep slate spires; the low entrance arcade with its balcony
 * between the towers; the smaller front gables beside the towers; the two
 * end pavilions (north and south halls) with hipped slate roofs and a
 * front gable each; the cream stone bands across the brick; the long
 * lower side wings running back along the side streets.
 *
 * Evidence:
 *  - plan: OSM outline way/40047145 and building relation/3687479 with its
 *    parts (277237909 auditorium, 277237910/911 front gabled bays,
 *    277237912/913 towers, 277479670/671 entrance arcade, 277464262/260
 *    end pavilions, 277464264/266/268/273/275/277 and 277479673 their
 *    front pieces, 277472885/277464271 the north and south wings,
 *    277479669/672 courts between hall and wings, relation/3687380 a
 *    6-level pyramidal-roofed part (multipolygon), 277472886/887 the
 *    south-west corner pieces). Rings are simplified to rectangles in the
 *    model frame, checked against the lidar edges.
 *  - heights: measured, USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio
 *    statewide phase 3, ~2021 flight), 1 m grid read in the model frame;
 *    the ground is flat (0–1.6 m over the site). Front gable apex 46.5
 *    (47 with the chimney finial), its eaves ~29 at y ±17; auditorium ridge
 *    36.7, eaves ~25; tower cornice ~26–27, spire tips 40.3 measured (thin
 *    tips under-read; 41.5 used, which matches the head-on photo's spire to
 *    gable ratio of 0.89); front gabled bays ridge 28.5; links ~23; end
 *    pavilions ridge 29–30.7, eaves ~22–24; side wings ridge 17–18.5, eaves
 *    ~15; courts 18–22; entrance arcade 10–11.
 *  - facade: from the head-on photos (OHPTC 16137233821, Larsonj3),
 *    scaled by the lidar gable apex (0.057 m/px): rose window centre 31 m,
 *    ~8.4 m across; relieving arch springing at 25 m, 16.6 m span, apex
 *    ~36.5 m; three pointed windows 3.2 m wide, 16.5–25 m; the row of
 *    round-headed windows at 11.5–15.5 m; arcade 10.8 m with five
 *    openings; stone bands at the storey lines. Window rhythms on the
 *    wings are grouped from the oblique photos; estimated.
 *  - colour: red brick from the daylight photos (#b04f37 sunlit) pulled to
 *    the palette's lightness; cream sandstone bands and trim (palette
 *    trim); grey slate roofs (#8a8e96 in the photos and NAIP).
 *
 * Photos, all EVIDENCE:
 *  - Cincinnati-Music_Hall_(OHPTC)_-_16137233821.jpg, Ohio Redevelopment
 *    Projects - ODSA, CC BY 2.0 (head-on, east)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati-Music_Hall_(OHPTC)_-_16137233821.jpg
 *  - Cincinnati-Cincinnati_Music_Hall_(OHPTC).jpg, Ohio Redevelopment
 *    Projects - ODSA, CC BY 2.0 (whole front from the park)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati-Cincinnati_Music_Hall_(OHPTC).jpg
 *  - Renovated_Cincinnati_Music_Hall_2.jpg, Larsonj3, CC BY-SA 4.0 (front)
 *    https://commons.wikimedia.org/wiki/File:Renovated_Cincinnati_Music_Hall_2.jpg
 *  - Cincinnati Music Hall (Flickr 15519407273), Ohio Redevelopment
 *    Projects - ODSA, CC BY 2.0 (oblique from the north-east along Elm St)
 *    https://www.flickr.com/photos/63837784@N08/15519407273
 *  - Cincinnati Music Hall (Flickr 9332956255), string_bass_dave, CC BY-SA
 *    2.0 (oblique from the south-east) https://www.flickr.com/photos/16069488@N00/9332956255
 *  - USGS NAIP orthophoto (public domain) for the plan and roofs.
 * No commercial imagery.
 *
 * Doubts: the west (Central Parkway) back and the long side elevations are
 * unphotographed here; their windows are a generic grouped rhythm. The
 * pavilions' dormers, the tower and gable pinnacles, the brick corbelling,
 * the gablets over the pointed windows and the chimneys are left out.
 * OSM's "Music Hall North" (way/280006171) and "Music Hall South"
 * (way/168831283) are small one-storey structures across Elm Street in
 * Washington Park (the park's garage pavilions), not the hall's wings;
 * they are not modelled or replaced.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { walls, triangulate, area, save, type XY } from './chi-aon-center'

type P3 = V3

/** A planar convex-or-simple polygon, wound to face away from `inside`. */
function face(p: Part, pts: P3[], inside: P3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const l = Math.hypot(...n) || 1
  n = [n[0] / l, n[1] / l, n[2] / l]
  const d = (a[0] - inside[0]) * n[0] + (a[1] - inside[1]) * n[1] + (a[2] - inside[2]) * n[2]
  if (d < 0) n = [-n[0], -n[1], -n[2]]
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/** A flat polygon (u, z) on a vertical wall plane: origin o, along unit u, facing n. */
function onPlane(p: Part, o: XY, u: XY, n: XY, poly: XY[], out = 0.05) {
  const N: V3 = [n[0], n[1], 0]
  const P = ([s, z]: XY): V3 => [o[0] + u[0] * s + n[0] * out, o[1] + u[1] * s + n[1] * out, z]
  if (area(poly) < 0) poly = [...poly].reverse()
  for (const [a, b, c] of triangulate(poly)) {
    p.tri(P(poly[a]), P(poly[b]), P(poly[c]), undefined, undefined, undefined, [N, N, N])
  }
}
// The four wall planes of an axis-aligned box, as (origin, along, normal):
// along runs so that a counter-clockwise (s, z) polygon is seen from outside.
const FRONT = (x: number): [XY, XY, XY] => [[x, 0], [0, 1], [1, 0]] // +x face, s = y
const BACK = (x: number): [XY, XY, XY] => [[x, 0], [0, -1], [-1, 0]] // -x face, s = -y
const NORTH = (y: number): [XY, XY, XY] => [[0, y], [-1, 0], [0, 1]] // +y face, s = -x
const SOUTH = (y: number): [XY, XY, XY] => [[0, y], [1, 0], [0, -1]] // -y face, s = x

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A round-headed opening: jambs to zs, a semicircle over. */
function roundHead(s0: number, s1: number, z0: number, zs: number, seg = 6): XY[] {
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2
  const pts: XY[] = [[s0, z0], [s1, z0], [s1, zs]]
  for (let i = 1; i < seg; i++) { const t = (Math.PI * i) / seg; pts.push([c + r * Math.cos(t), zs + r * Math.sin(t)]) }
  pts.push([s0, zs])
  return pts
}
/** A pointed (equilateral) opening. */
function pointed(s0: number, s1: number, z0: number, zs: number, seg = 4): XY[] {
  const w = s1 - s0, pts: XY[] = [[s0, z0], [s1, z0], [s1, zs]]
  // right arc centred on the left jamb, then left arc centred on the right jamb
  const a1 = Math.PI / 3
  for (let i = 1; i <= seg; i++) { const t = (a1 * i) / seg; pts.push([s0 + w * Math.cos(t), zs + w * Math.sin(t)]) }
  for (let i = seg - 1; i >= 1; i--) { const t = (a1 * i) / seg; pts.push([s1 - w * Math.cos(t), zs + w * Math.sin(t)]) }
  pts.push([s0, zs])
  return pts
}
/** Disc or ring in (s, z). */
const ring = (cs: number, cz: number, r: number, n = 16): XY[] =>
  Array.from({ length: n }, (_, i) => [cs + r * Math.cos((2 * Math.PI * i) / n), cz + r * Math.sin((2 * Math.PI * i) / n)] as XY)

/**
 * A rectangular block x0..x1, y0..y1 with walls to `ze` and a pitched roof
 * whose ridge runs along `axis` at `zr`. hip0/hip1 pull the ridge in from
 * each end (0 = a gable wall, half the length = a pyramid).
 */
function house(wall: Part, roof: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, axis: 'x' | 'y', hip0 = 0, hip1 = 0, z0 = 0) {
  walls(wall, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, ze)
  const inside: P3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + ze) / 2]
  // work in (along, across)
  const [a0, a1, c0, c1] = axis === 'x' ? [x0, x1, y0, y1] : [y0, y1, x0, x1]
  const P = (a: number, c: number, z: number): P3 => (axis === 'x' ? [a, c, z] : [c, a, z])
  const cm = (c0 + c1) / 2, r0 = a0 + hip0, r1 = a1 - hip1
  const ridgePt = Math.abs(r1 - r0) < 1e-6
  for (const c of [c0, c1]) {
    if (ridgePt) face(roof, [P(a0, c, ze), P(a1, c, ze), P(r0, cm, zr)], inside)
    else face(roof, [P(a0, c, ze), P(a1, c, ze), P(r1, cm, zr), P(r0, cm, zr)], inside)
  }
  face(hip0 > 0 ? roof : wall, [P(a0, c0, ze), P(a0, c1, ze), P(r0, cm, zr)], inside)
  face(hip1 > 0 ? roof : wall, [P(a1, c0, ze), P(a1, c1, ze), P(r1, cm, zr)], inside)
}
/** A flat-topped box (walls and top). */
function box(wall: Part, top: Part, x0: number, x1: number, y0: number, y1: number, z1: number, z0 = 0) {
  walls(wall, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
  face(top, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [(x0 + x1) / 2, (y0 + y1) / 2, z1 - 1])
  if (z0 > 0) face(top, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [(x0 + x1) / 2, (y0 + y1) / 2, z0 + 1])
}
/** Pale stone bands round a box's faces (flush strips). */
function bands(trim: Part, x0: number, x1: number, y0: number, y1: number, zs: number[], h = 0.45, sides = 'nesw') {
  for (const z of zs) {
    if (sides.includes('e')) onPlane(trim, ...FRONT(x1), rect(y0, y1, z, z + h))
    if (sides.includes('w')) onPlane(trim, ...BACK(x0), rect(-y1, -y0, z, z + h))
    if (sides.includes('n')) onPlane(trim, ...NORTH(y1), rect(-x1, -x0, z, z + h))
    if (sides.includes('s')) onPlane(trim, ...SOUTH(y0), rect(x0, x1, z, z + h))
  }
}
/** Evenly spaced openings of width w across s0..s1, one shape per row. */
function row(p: Part, plane: [XY, XY, XY], s0: number, s1: number, n: number, w: number, shape: (a: number, b: number) => XY[]) {
  const step = (s1 - s0) / n
  for (let i = 0; i < n; i++) { const c = s0 + step * (i + 0.5); onPlane(p, ...plane, shape(c - w / 2, c + w / 2)) }
}

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), slate = new Part()

  // ---- The auditorium: gabled, ridge along x, hipped at the back.
  house(brick, slate, -42, 25, -16.5, 16.5, 25, 36.7, 'x', 6, 0)
  // Courts between the hall and the wings.
  for (const s of [1, -1]) {
    const [y0, y1] = s > 0 ? [16.5, 31.8] : [-31.8, -16.5]
    box(brick, slate, -46, 20, y0, y1, 19.5)
  }
  // ---- The side wings, low gabled ranges back along the side streets.
  house(brick, slate, -46.5, 24, 31.8, 61, 15, 17.5, 'x', 0, 0)
  house(brick, slate, -46.5, 36, -61, -31.8, 15, 18.5, 'x', 0, 0)
  // The south-west corner pieces (277472886/887), flat at 15.
  box(brick, slate, -50, -46.5, -61, -41, 15)
  box(brick, slate, -50, -46.5, 41, 52, 15)

  // ---- The end pavilions (north and south halls): hipped, with a front
  // cross-gable on a projecting centre bay.
  house(brick, slate, 24, 44.5, 37, 61, 23, 30.5, 'y', 8.5, 8.5)
  house(brick, slate, 36, 44.5, -61, -37, 23, 30.5, 'y', 3.5, 3.5)
  for (const s of [1, -1]) {
    const yc = s * 47
    house(brick, slate, 38, 46.5, yc - 6, yc + 6, 23, 30.5, 'x', 4, 0)
  }
  // ---- Links between the pavilions and the front bays.
  for (const s of [1, -1]) {
    const [y0, y1] = s > 0 ? [28, 37] : [-37, -28]
    house(brick, slate, 22, 44, y0, y1, 21, 23.5, 'x', 4.5, 4.5)
  }
  // ---- The smaller front gables beside the towers.
  for (const s of [1, -1]) {
    const [y0, y1] = s > 0 ? [17.5, 28] : [-28, -17.5]
    house(brick, slate, 20, 43.5, y0, y1, 21.5, 28.5, 'x', 5, 0)
  }
  // ---- The head house: the tall central gable, ridge along x.
  const GX = 41.5 // its front wall
  house(brick, slate, 25, GX, -17, 17, 29, 46.5, 'x', 0, 0)
  // The finial on the apex.
  box(trim, trim, GX - 1.2, GX + 0.2, -0.7, 0.7, 47.6, 45.3)
  // ---- The towers: square brick shafts, a corbelled cornice, steep spires.
  for (const s of [1, -1]) {
    const y0 = s > 0 ? 11.5 : -17.5, y1 = y0 + 6
    box(brick, brick, 42.5, 48.5, y0, y1, 25.6)
    box(trim, trim, 42.2, 48.8, y0 - 0.3, y1 + 0.3, 27, 25.6)
    house(trim, slate, 42.2, 48.8, y0 - 0.3, y1 + 0.3, 27, 41.5, 'x', 3.3, 3.3, 27)
    // windows: the front pair high up, a single light below; the same on the outer side
    const fy = (y0 + y1) / 2
    for (const [a, b] of [[fy - 1.9, fy - 0.3], [fy + 0.3, fy + 1.9]] as XY[]) onPlane(win, ...FRONT(48.5), roundHead(a, b, 19.5, 22.6))
    onPlane(win, ...FRONT(48.5), roundHead(fy - 1, fy + 1, 11.6, 15))
    onPlane(win, ...FRONT(48.5), roundHead(fy - 1.2, fy + 1.2, 1.2, 6))
    bands(trim, 42.5, 48.5, y0, y1, [7.6, 10.4, 16.6, 23.8], 0.45, 'e')
  }
  // ---- The entrance arcade between the towers, with its balcony on top.
  box(brick, slate, GX, 46.5, -11.5, 11.5, 11.1)
  onPlane(trim, ...FRONT(46.5), rect(-11.5, 11.5, 10.2, 11.1)) // the balcony's balustrade
  for (let i = 0; i < 5; i++) {
    const c = -9.2 + i * 4.6
    onPlane(win, ...FRONT(46.5), rect(c - 1.6, c + 1.6, 0.9, 5.4))
    onPlane(trim, ...FRONT(46.5), roundHead(c - 1.7, c + 1.7, 6.3, 7.6))
  }
  box(trim, trim, 46.5, 48.6, -10.8, 10.8, 6.1, 5.6) // the canopy
  bands(trim, GX, 46.5, -11.5, 11.5, [9.2], 0.4, 'e')

  // ---- The central gable's front: rose window in its pointed arch, the
  // three tall pointed windows, the row of round-headed windows.
  const F = FRONT(GX)
  {
    // relieving arch: a pale band, two arcs of radius 12 from centres at ±3.7
    const R = 12, C = 3.7, ZS = 25, W = 1.0, seg = 7
    // right half: an arc centred at s = -C from its springing (t = 0) to the apex (s = 0)
    const half = (r: number): XY[] => {
      const tA = Math.acos(C / r)
      return Array.from({ length: seg + 1 }, (_, i) => { const t = (tA * i) / seg; return [-C + r * Math.cos(t), ZS + r * Math.sin(t)] as XY })
    }
    const outer = half(R), inner = half(R - W)
    for (const m of [1, -1]) {
      for (let i = 0; i < seg; i++) {
        const q: XY[] = [outer[i], outer[i + 1], inner[i + 1], inner[i]].map(([a, z]) => [m * a, z] as XY)
        onPlane(trim, ...F, q)
      }
    }
    // the springing jambs down to the stone band at 16
    for (const m of [1, -1]) onPlane(trim, ...F, m > 0 ? rect(8.3 - W, 8.3, 16, ZS) : rect(-8.3, -8.3 + W, 16, ZS))
  }
  // rose window: a dark disc, a pale rim and six bold spokes
  {
    const cz = 31, r = 4.2
    onPlane(win, ...F, ring(0, cz, r, 16), 0.06)
    const rim = ring(0, cz, r + 0.6, 16), inn = ring(0, cz, r, 16)
    for (let i = 0; i < 16; i++) onPlane(trim, ...F, [inn[i], rim[i], rim[(i + 1) % 16], inn[(i + 1) % 16]], 0.08)
    onPlane(trim, ...F, ring(0, cz, 1.1, 8), 0.1)
    for (let k = 0; k < 6; k++) {
      const t = (Math.PI * k) / 6, c = Math.cos(t), s = Math.sin(t), w = 0.22
      onPlane(trim, ...F, [[-r * c + w * s, cz - r * s - w * c], [r * c + w * s, cz + r * s - w * c], [r * c - w * s, cz + r * s + w * c], [-r * c - w * s, cz - r * s + w * c]], 0.1)
    }
  }
  for (const c of [-4.8, 0, 4.8]) onPlane(win, ...F, pointed(c - 1.6, c + 1.6, 16.6, 22.4))
  for (const c of [-6.4, -4.2, 4.2, 6.4]) onPlane(win, ...F, roundHead(c - 0.75, c + 0.75, 11.6, 14.8))
  onPlane(win, ...F, roundHead(-1.1, 1.1, 11.4, 14.6))
  bands(trim, 25, GX, -11.5, 11.5, [16, 24.6], 0.45, 'e')
  bands(trim, 25, GX, -11.5, 11.5, [11], 0.4, 'e')

  // ---- The front gabled bays beside the towers.
  for (const s of [1, -1]) {
    const y0 = s > 0 ? 17.5 : -28, y1 = y0 + 10.5, yc = (y0 + y1) / 2
    const P = FRONT(43.5)
    onPlane(win, ...P, roundHead(yc - 1.2, yc + 1.2, 1.4, 6.2))
    for (const d of [-2.6, 2.6]) onPlane(win, ...P, roundHead(yc + d - 0.8, yc + d + 0.8, 1.6, 5.6))
    row(win, P, y0 + 1, y1 - 1, 3, 1.5, (a, b) => roundHead(a, b, 8.4, 12))
    row(win, P, y0 + 1, y1 - 1, 3, 1.5, (a, b) => roundHead(a, b, 13.6, 17.4))
    onPlane(win, ...P, roundHead(yc - 1.6, yc + 1.6, 22.4, 24.2))
    bands(trim, 20, 43.5, y0, y1, [7.4, 12.9, 18.4, 21.1], 0.4, 'e')
  }
  // ---- The pavilions' fronts and the links.
  for (const s of [1, -1]) {
    const yc = s * 47, P = FRONT(46.5)
    for (const [z0, z1] of [[1.4, 6], [8.2, 12.2], [13.6, 17.8]] as XY[]) row(win, P, yc - 5.4, yc + 5.4, 4, 1.4, (a, b) => roundHead(a, b, z0, z1))
    onPlane(win, ...P, roundHead(yc - 1.8, yc + 1.8, 23.6, 25.2))
    bands(trim, 38, 46.5, yc - 6, yc + 6, [7.3, 12.9, 18.6, 22.3], 0.4, 'e')
    // the pavilion's front either side of the bay
    const Q = FRONT(44.5)
    for (const [a, b] of [[yc - 10, yc - 6.6], [yc + 6.6, yc + 10]] as XY[]) {
      if (Math.abs(a) < 37 || Math.abs(b) > 61) continue
      for (const [z0, z1] of [[1.4, 6], [8.2, 12.2], [13.6, 17.8]] as XY[]) onPlane(win, ...Q, roundHead(a + 0.9, b - 0.9, z0, z1))
    }
    bands(trim, 24, 44.5, s > 0 ? 37 : -61, s > 0 ? 61 : -37, [7.3, 12.9, 18.6, 22.3], 0.4, 'e')
    // links
    const [ly0, ly1] = s > 0 ? [28, 37] : [-37, -28]
    const L = FRONT(44)
    for (const [z0, z1] of [[1.4, 6], [8.2, 12.2], [13.6, 17.8]] as XY[]) row(win, L, ly0 + 0.8, ly1 - 0.8, 3, 1.4, (a, b) => roundHead(a, b, z0, z1))
    bands(trim, 22, 44, ly0, ly1, [7.3, 12.9, 18.6], 0.4, 'e')
  }
  // ---- Side and back elevations: grouped round-headed windows, two storeys.
  const sideRows: XY[] = [[2, 6.2], [8, 12.4]]
  for (const [z0, z1] of sideRows) {
    row(win, NORTH(61), -24, 46.5, 11, 2.2, (a, b) => roundHead(a, b, z0, z1))
    row(win, SOUTH(-61), -46.5, 36, 13, 2.2, (a, b) => roundHead(a, b, z0, z1))
    row(win, BACK(-46.5), -61, -31.8, 4, 2.2, (a, b) => roundHead(a, b, z0, z1))
    row(win, BACK(-46.5), 31.8, 61, 4, 2.2, (a, b) => roundHead(a, b, z0, z1))
    row(win, BACK(-46), -31.8, 31.8, 9, 2.2, (a, b) => roundHead(a, b, z0, z1))
  }
  // pavilion sides
  for (const [z0, z1] of [[1.4, 6], [8.2, 12.2], [13.6, 17.8]] as XY[]) {
    row(win, NORTH(61), -44.5, -24, 5, 1.5, (a, b) => roundHead(a, b, z0, z1))
    row(win, SOUTH(-61), 36, 44.5, 2, 1.5, (a, b) => roundHead(a, b, z0, z1))
  }
  bands(trim, -46.5, 44.5, -61, 61, [7.2, 13.4], 0.45, 'ns')
  bands(trim, -46, 44.5, -31.8, 31.8, [7.2, 13.4], 0.45, 'w')
  // auditorium clerestory over the courts
  for (const y of [16.5, -16.5]) row(win, y > 0 ? NORTH(y) : SOUTH(y), y > 0 ? -20 : -42, y > 0 ? 42 : 20, 9, 2.2, (a, b) => roundHead(a, b, 20.6, 23.4))

  // Night: the Elm Street front is floodlit, strongest low on the face.
  const flood = (p: V3, n: V3) => (n[0] > 0.5 && p[0] > 38 ? Math.max(0.35, 0.95 - p[2] / 80) : 0)
  return [
    { part: brick, material: { ...finish('mh-brick', 0xc0644c), floodlight: flood } },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('mh-slate', 0x8a8e96) },
  ]
}

if (import.meta.main) await save('cin-music-hall', 'Cincinnati Music Hall', [39.109394, -84.519207], 349, build(), 6500)
