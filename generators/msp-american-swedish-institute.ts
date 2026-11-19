/**
 * American Swedish Institute: the Turnblad Mansion (1904-1908, Christopher A.
 * Boehme and Victor Cordella), Minneapolis: procedural, CC0-1.0.
 * bun generators/msp-american-swedish-institute.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * north-south and east-west). Origin at the area centroid of OSM
 * way/1501419748, "Turnblad Mansion" (-93.265859, 44.955202). y = 0 is the
 * lawn round the house (lidar about 265.2 m); the areaway south of the house
 * is lower but outside the footprint.
 *
 * Form: a grey-tan limestone Chateauesque house facing east on Park Avenue,
 * under a steep hipped slate roof with a copper ridge crest. The front: two
 * steep-gabled pavilions with coped gables and finials, between them a
 * round-arched entrance porch with a balustraded top and a gabled dormer
 * above; beside the porch the round tower with a corbelled bartizan, a
 * corbelled crenellated top and a tall slate cone with a copper finial.
 * Grouped stone-mullioned windows on three storeys; a round full-height bay
 * and a gabled pavilion on the north side with a one-storey terrace room; a
 * gabled pavilion on the south; a lower hipped service wing to the west; the
 * octagonal glass conservatory with a copper dome at the south-west corner;
 * four tall chimneys.
 *
 * Sources
 * - OSM (ODbL): way/1501419748 ("Turnblad Mansion", historic, 1908). The
 *   2012 Nelson Cultural Center (way/125841022) and the Carriage House
 *   (way/125841039) are separate buildings in OSM and are not modelled.
 *   relation/20510543 (named in the brief) was not fetched; the mansion's
 *   own outline is the way above.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 0.5 m grid,
 *   heights above 265.2 m: roof eaves 10.6-12.6, ridge 16.5-18.4 near
 *   x -0.3; the tower at (14.2, -4.6), its cone returning to 21.1 (the slim
 *   top is missed); porch top 5.8 on the east and on the north; round
 *   north-west bay to 13-14; chimneys 16-16.5; west wing 13-14.5; the
 *   conservatory at the south-west 3-5 (outside OSM's outline).
 * - USGS NAIP (public domain): plan and roof.
 * - Photos (Wikimedia Commons, evidence):
 *   Jerry, "American Swedish Institute-2007-03-18.jpg", CC BY-SA 2.0 (the
 *   east front, frontal: pavilions, porch, dormer, tower, bartizan,
 *   windows); McGhiever, "American Swedish Institute.jpg", CC BY-SA 4.0
 *   (from the south-east: the south side, chimney, conservatory, tower);
 *   McGhiever, "American Swedish Institute 2015.jpg", CC BY-SA 4.0 (from the
 *   south-west across the Nelson Center: the south side and west wing);
 *   Corykellum, "Swedish institute.jpg", CC BY-SA 3.0 (front at night).
 * - Published: built 1904-1908 for Swan Turnblad, architects Christopher A.
 *   Boehme and Victor Cordella, Indiana limestone; NRHP 1971 (Wikipedia,
 *   "American Swedish Institute").
 * Measured (lidar): eaves, ridge, porch, bay and chimney heights, the
 *   tower's place.
 * Estimated from the photos (scaled to the lidar eave): the tower above its
 *   lidar return (crenellated top 17.7, cone to 27.3, finial 29.3, from the
 *   frontal photo's ratio to the gable apex), its 2.3 m radius, the gable
 *   apexes (17.8-18.6), every window group (sizes and storey heights), the
 *   porch arch and steps, the conservatory's octagon (radius 3.4, dome to
 *   9.6).
 * Left out: carved ornament, crosses as anything but a block, the porch's
 *   lettering, railings, the north side's minor bays.
 * Doubts: the north and west sides have no licensed photo and are drawn from
 *   lidar and OSM with plausible windows; the conservatory's footprint is
 *   from lidar only; the spire's tip height is photo-scaled.
 * Night: the limestone is floodlit, the east front most (`floodlight`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, archShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

const EAVE = 12.0, RIDGE = 18.2 // main roof (lidar)
const MX0 = -12.7, MX1 = 12.1, MY0 = -12.7, MY1 = 12.2 // the main block
const TOWER: XY = [14.2, -4.6], TR = 2.3 // the round tower beside the entrance (lidar)

export function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), copper = new Part(), win = new Part(), glass = new Part()
  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = slate, c = 0.25) =>
    prism(p, top, c > 0 ? chamfer(rect(x0, y0, x1, y1), c) : rect(x0, y0, x1, y1), z0, z1)
  const F = (o: V3, n: XY): Face => ({ o, n })
  /** A grouped window: a stone surround, the glass, and mullions dividing it into `lights`. */
  const group = (f: Face, s: number, w: number, z0: number, z1: number, lights: number, arched = false) => {
    extrudeShape(trim, f, arched ? archShape(s, w + 0.5, z0 - 0.3, z1 - w / 2, 8) : rect(s - w / 2 - 0.25, z0 - 0.3, s + w / 2 + 0.25, z1 + 0.25), 0, 0.06)
    flatShape(win, f, arched ? archShape(s, w, z0, z1 - w / 2, 8) : rect(s - w / 2, z0, s + w / 2, z1), 0.1)
    for (let i = 1; i < lights; i++) {
      const m = s - w / 2 + (w * i) / lights
      flatShape(trim, f, rect(m - 0.09, z0, m + 0.09, arched ? z1 - w / 2 : z1), 0.13)
    }
    if (z1 - z0 > 2.2 && !arched) flatShape(trim, f, rect(s - w / 2, z1 - 0.75, s + w / 2, z1 - 0.6), 0.13) // transom bar
  }
  /** A steep cross gable on a wall: wall up to the eave, triangular gable with a coping, roof back to the main roof. */
  const crossGable = (axis: 'x' | 'y', face: number, c: number, half: number, depth: number, apex: number, out: number) => {
    // face: the wall coordinate, out: +1/-1 direction it faces; c: centre along the wall
    const back = face - out * depth
    const P = (u: number, v: number, z: number): V3 => (axis === 'x' ? [u, v, z] : [v, u, z]) // u across the face's normal axis
    if (axis === 'x') box(stone, Math.min(back, face), c - half, Math.max(back, face), c + half, 0, EAVE, null, 0.2)
    else box(stone, c - half, Math.min(back, face), c + half, Math.max(back, face), 0, EAVE, null, 0.2)
    // gable triangle (stone), on the face
    const f = axis === 'x' ? F([face, c, 0], [out, 0]) : F([c, face, 0], [0, out])
    extrudeShape(stone, f, [[-half, EAVE], [half, EAVE], [0, apex]], -0.01, 0.0, false)
    // coping and stepped kneelers (trim), finial
    extrudeShape(trim, f, [[-half - 0.35, EAVE - 0.3], [-half + 0.6, EAVE - 0.3], [0, apex - 0.55], [half - 0.6, EAVE - 0.3], [half + 0.35, EAVE - 0.3], [0, apex + 0.3]], 0, 0.35)
    const tip = axis === 'x' ? ([face, c] as XY) : ([c, face] as XY)
    box(trim, tip[0] - 0.2, tip[1] - 0.2, tip[0] + 0.2, tip[1] + 0.2, apex, apex + 1.6, trim, 0)
    // roof: two slopes from the eave to the ridge, running back
    for (const sg of [-1, 1]) {
      const a = P(face, c + sg * half, EAVE), b = P(back - out * 2, c + sg * half, EAVE), d = P(back - out * 2, c, apex), e = P(face, c, apex)
      const v1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v2 = [e[0] - a[0], e[1] - a[1], e[2] - a[2]]
      const nz = v1[0] * v2[1] - v1[1] * v2[0]
      if (nz > 0) slate.quad(a, b, d, e)
      else slate.quad(a, e, d, b)
    }
  }

  // ---- the main block: limestone walls, a steep hipped slate roof
  box(stone, MX0, MY0, MX1, MY1, 0, EAVE, null, 0.2)
  box(trim, MX0 - 0.3, MY0 - 0.3, MX1 + 0.3, MY1 + 0.3, EAVE - 0.5, EAVE, null, 0.1)
  const ry0 = -4.5, ry1 = 4.0, rx = -0.3
  const E00: V3 = [MX0, MY0, EAVE], E10: V3 = [MX1, MY0, EAVE], E11: V3 = [MX1, MY1, EAVE], E01: V3 = [MX0, MY1, EAVE]
  const R0: V3 = [rx, ry0, RIDGE], R1: V3 = [rx, ry1, RIDGE]
  slate.quad(E10, E11, R1, R0) // east
  slate.quad(E01, E00, R0, R1) // west
  slate.tri(E00, E10, R0) // south
  slate.tri(E11, E01, R1) // north
  // copper ridge crest
  box(copper, rx - 0.15, ry0, rx + 0.15, ry1, RIDGE, RIDGE + 0.5, copper, 0)

  // ---- the east front on Park Avenue: two gabled pavilions, the porch, the tower
  crossGable('x', MX1 + 0.6, 7.9, 4.3, 7, 18.6, 1) // north pavilion
  crossGable('x', MX1 + 0.6, -8.6, 3.6, 7, 18.0, 1) // south pavilion
  const EF = (x: number) => F([x, 0, 0], [1, 0])
  // seen from the east, s runs north: s = y
  for (const [y, w, n] of [[7.9, 4.6, 4], [-8.6, 3.6, 3]] as [number, number, number][]) {
    group(EF(MX1 + 0.6), y, w, 1.6, 4.6, n)
    group(EF(MX1 + 0.6), y, w, 5.8, 8.8, n)
    group(EF(MX1 + 0.6), y, w * 0.6, 12.6, 14.8, n - 1)
  }
  // the centre between the pavilions: a dormer over the porch
  group(EF(MX1), 0.3, 2.6, 5.8, 8.8, 3)
  box(stone, MX1 - 3.5, -1.4, MX1 + 0.1, 2.0, EAVE - 1, EAVE + 2.3, null, 0.1)
  crossGable('x', MX1 + 0.1, 0.3, 1.7, 3.6, EAVE + 4.6, 1)
  group(EF(MX1 + 0.1), 0.3, 1.6, EAVE + 0.4, EAVE + 2.6, 2, true)
  // the porch: a round arch between columns, balustraded top
  box(stone, MX1, -2.4, 17.3, 2.9, 0, 5.0, trim, 0.15)
  box(trim, MX1, -2.6, 17.6, 3.1, 5.0, 5.9, trim, 0.1)
  const PF = EF(17.3)
  extrudeShape(trim, PF, archShape(0.25, 3.8, 0.9, 2.6, 10), 0, 0.08)
  flatShape(win, PF, archShape(0.25, 3.0, 0.9, 2.6, 10), 0.12)
  for (const s of [-2.3, 2.8]) lathe(trim, 17.5, s, [[0.38, 0.9], [0.32, 3.4], [0.45, 3.7]], 8)
  for (const [y0, z] of [[17.3, 0.9], [18.3, 0.6], [19.3, 0.3]] as [number, number][]) box(stone, y0, -2.2, y0 + 1.0, 2.7, 0, z, stone, 0) // steps
  // the tower: round, corbelled crenellated top, steep slate cone, copper finial
  lathe(stone, TOWER[0], TOWER[1], [[TR, 0], [TR, 14.8], [TR + 0.45, 15.4], [TR + 0.45, 17.0]], 14)
  for (let k = 0; k < 10; k++) {
    const a = (k * 36 * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
    box(stone, TOWER[0] + c * (TR + 0.2) - 0.35, TOWER[1] + s * (TR + 0.2) - 0.35, TOWER[0] + c * (TR + 0.2) + 0.35, TOWER[1] + s * (TR + 0.2) + 0.35, 17.0, 17.7, stone, 0)
  }
  lathe(slate, TOWER[0], TOWER[1], [[TR + 0.1, 16.8], [TR - 0.4, 18.6], [1.1, 23.0], [0.4, 26.4], [0, 27.3]], 14)
  lathe(copper, TOWER[0], TOWER[1], [[0.25, 27.0], [0.32, 27.7], [0.12, 28.3], [0.22, 28.7], [0, 29.3]], 8)
  // the corbelled bartizan on the tower's south side
  lathe(stone, TOWER[0] + 0.5, TOWER[1] - TR - 0.45, [[0.15, 10.4], [0.95, 11.6], [0.95, 13.4], [1.15, 13.7], [1.15, 14.4]], 10)
  for (const [z0, z1] of [[2.0, 4.6], [6.0, 8.8], [10.0, 12.0], [13.2, 15.2]] as [number, number][]) {
    const f = F([TOWER[0] + TR, TOWER[1], 0], [1, 0])
    group(f, 0, 1.1, z0, z1, 1, z0 > 9)
  }

  // ---- the north side: a full-height round bay, a gabled pavilion, a one-storey terrace room
  lathe(stone, -5.0, 11.8, [[3.0, 0], [3.0, EAVE - 0.5], [3.2, EAVE]], 12, -10, 190)
  lathe(slate, -5.0, 11.8, [[3.3, EAVE], [0, EAVE + 3.4]], 12, -10, 190)
  for (const a of [40, 90, 140]) {
    const r = (a * Math.PI) / 180
    const f = F([-5.0 + 3.0 * Math.cos(r), 11.8 + 3.0 * Math.sin(r), 0], [Math.cos(r), Math.sin(r)])
    group(f, 0, 1.3, 1.6, 4.6, 1)
    group(f, 0, 1.3, 5.8, 8.8, 1)
  }
  crossGable('y', MY1 + 0.5, 8.6, 3.4, 6, 18.0, 1)
  const NF = (y: number) => F([0, y, 0], [0, 1])
  for (const [z0, z1, w] of [[1.6, 4.6, 3.6], [5.8, 8.8, 3.6], [12.6, 14.8, 2.0]] as [number, number, number][]) group(NF(MY1 + 0.5), -8.6, w, z0, z1, 3)
  box(stone, -1.8, MY1, 5.8, 16.9, 0, 5.2, trim, 0.15)
  box(trim, -2.0, MY1, 6.0, 17.1, 5.2, 5.9, trim, 0.1)
  for (const s of [-3.9, -0.1]) group(NF(16.9), s, 2.2, 1.0, 4.0, 2, true)
  group(NF(MY1), 1.0, 2.6, 7.0, 10.2, 3)

  // ---- the south side: a gabled pavilion, windows; the west service wing
  crossGable('y', MY0 - 0.5, 5.8, 3.6, 6, 17.8, -1)
  const SF = (y: number) => F([0, y, 0], [0, -1])
  // seen from the south, s runs east: s = x
  for (const [z0, z1] of [[1.6, 4.6], [5.8, 8.8]] as [number, number][]) {
    group(SF(MY0 - 0.5), 5.8, 3.6, z0, z1, 3)
    group(SF(MY0), -4.5, 2.4, z0, z1, 2)
  }
  group(SF(MY0 - 0.5), 5.8, 2.0, 12.6, 14.8, 2)
  box(stone, -20.5, -1.6, MX0, 5.0, 0, 10.0, null, 0.2)
  const W0: V3 = [-20.5, -1.6, 10], W1: V3 = [MX0, -1.6, 10], W2: V3 = [MX0, 5.0, 10], W3: V3 = [-20.5, 5.0, 10]
  slate.quad(W0, W1, [MX0, 1.7, 13.4], [-17.2, 1.7, 13.4])
  slate.quad(W2, W3, [-17.2, 1.7, 13.4], [MX0, 1.7, 13.4])
  slate.tri(W3, W0, [-17.2, 1.7, 13.4])
  for (const s of [-18.5, -15]) { group(SF(-1.6), s, 1.4, 1.6, 4.0, 1); group(SF(-1.6), s, 1.4, 5.4, 7.8, 1) }
  // west wall windows of the main block
  const WF = F([MX0, 0, 0], [-1, 0])
  for (const s of [5, -8]) { group(WF, s, 2.4, 5.8, 8.8, 2); group(WF, s, 2.4, 1.6, 4.6, 2) }

  // ---- the conservatory at the south-west corner: octagonal glass room, copper dome
  const CC: XY = [-16.4, -8.4]
  lathe(stone, CC[0], CC[1], [[3.4, 0], [3.4, 2.4]], 8, 22.5, 382.5)
  lathe(trim, CC[0], CC[1], [[3.5, 2.4], [3.5, 2.7]], 8, 22.5, 382.5)
  lathe(glass, CC[0], CC[1], [[3.2, 2.7], [3.2, 6.0]], 8, 22.5, 382.5)
  lathe(copper, CC[0], CC[1], [[3.5, 6.0], [3.5, 6.4], [2.9, 7.4], [1.6, 8.3], [0.5, 8.7], [0.6, 9.2], [0, 9.6]], 8, 22.5, 382.5)

  // ---- chimneys: tall limestone stacks with caps
  for (const [x, y, top] of [[-11.2, 6.2, 19.6], [6.2, 8.4, 19.4], [9.2, -12.0, 19.8], [-6.5, -12.3, 18.6]] as [number, number, number][]) {
    box(stone, x - 0.8, y - 0.6, x + 0.8, y + 0.6, EAVE - 2, top, trim, 0.1)
    box(trim, x - 0.95, y - 0.75, x + 0.95, y + 0.75, top - 0.6, top - 0.2, trim, 0.05)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : n[0] > 0.5 ? 0.85 : 0.5)
  return finishGlb('msp-american-swedish-institute', [
    { part: stone, material: { ...finish('asi-limestone', 0xd6ccbb), floodlight: lit } },
    { part: trim, material: { ...finish('asi-trim', 0xe8e0d0), floodlight: lit } },
    { part: slate, material: finish('asi-slate', 0x7d858d) },
    { part: copper, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ], { name: 'American Swedish Institute' }, 6500)
}

if (import.meta.main) await writeModel('msp-american-swedish-institute', build())
