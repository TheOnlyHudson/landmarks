/**
 * Centre Block of the Parliament of Canada, with the Peace Tower and the
 * Library of Parliament, Parliament Hill, Ottawa (Library 1859–76 by Thomas
 * Fuller and Chilion Jones; Centre Block and Peace Tower 1916–27 by John A.
 * Pearson and Jean-Omer Marchand) — original procedural geometry, CC0-1.0.
 * bun generators/ott-parliament-centre-block.ts
 *
 * Drawn in its familiar pre-2019 form: the renovation hoarding, cranes and
 * the welcome-centre dig in front are not modelled.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 329.2: the long front of OSM way/68588665 runs at
 * 59.2° (30.8° north of east), so +x runs along the front (east-north-east),
 * the Peace Tower and the front face model south (compass 149°, toward
 * Wellington Street) and the Library model north (compass 329°, toward the
 * river). Anchor -75.699879, 45.4250798: on the building's axis of symmetry
 * (the Peace Tower's centre line), in the middle of the block front to back.
 *
 * Identity (from the photos below):
 *  1. The Peace Tower on the axis: a square sandstone campanile with corner
 *     buttresses, the porch arch, the Memorial Chamber window, tall paired
 *     lancets and the belfry; the set-back clock stage with a white clock
 *     face on each side, four corner turrets with spirelets, and the steep
 *     green copper pyramidal spire with a flagpole. (Saffron Blaze,
 *     Wladyslaw, DXR, Ymblanter)
 *  2. The long symmetrical Gothic Revival front: three storeys of pointed
 *     and square-headed windows under steep dark roofs with dormers, and
 *     six square pavilions with steep truncated "French" roofs (four on the
 *     front, two on the ends), each a storey taller than the ranges.
 *     (Saffron Blaze, Wladyslaw, DXR SE view)
 *  3. The green copper roofs of the back ranges and the two chamber halls
 *     (Commons west, Senate east) with their clerestories, and the four
 *     slim towers with copper caps at the back corners of the chambers.
 *     (DXR west view, Ymblanter Major's Hill, Óðinn river view)
 *  4. The Library of Parliament behind: a sixteen-sided Gothic rotunda with
 *     a low ring of chapels, flying buttresses to the drum, and a three-
 *     tier dark copper roof: the main cone, the lantern ring and the top
 *     cone with its finial. (Wladyslaw library photo, Óðinn, DXR)
 *
 * Plan: OSM way/68588665 (Centre Block), way/128127767 (Peace Tower),
 * way/128127770 (Library) and their building:parts, in the turned frame.
 * Measured from OSM: the front 144.5 m (pavilion faces x -72.8..72.4, built
 * ±72.4 symmetric); front range face y -25.3; front pavilions 10 m square at
 * x 35.8..46.1 and 62.2..72.3, y -38.9..-28.6; corner blocks' front y -36.9;
 * end pavilions y -13.6..-3.7; side walls x ±70.8 / ±71; back face y 34.4 and
 * 37.0; back towers 5 m square at x ±(42.4..47.3) and ±(59.8..65.1), y
 * 26.0..31.7; chambers x ±(47.7..65.4), y -12.9..26; Peace Tower shaft
 * 13.2 m square centred y -37.05; Library a 16-gon of radius 20 (aisle),
 * 15.5 (drum) and 5.5 (lantern), centre y 56.7; the Library corridor
 * x ±4.2, y 34.3..37.2. Published: the block is 144 m by 75 m, six storeys
 * (Wikipedia, Centre Block).
 *
 * Heights. No lidar covers Ottawa (USGS 3DEP is US-only). Published: the
 * Peace Tower's clock faces are 4.8 m across, the block 144 m long, the
 * tower "92.2 m" (Wikipedia, Peace Tower). Heights here are scaled from the
 * two square-on front photos (Saffron Blaze, Wladyslaw) with the clock faces
 * and the 144 m front as the rulers; the two agree within 3 %:
 *   front ranges: eaves 15.5, roof deck 22; pavilions: eaves 23, roof top 29;
 *   Peace Tower: shaft to 56, clock stage to 65.5 (clock centre 61), spire
 *   tip 84.5, flagpole to 94.5 (these photo heights were reviewed and
 *   accepted over the published 92.2 m).
 * Peace Tower plan: the shaft is drawn 11.2 m square (OSM's 13.2 includes
 * the corner buttresses; at full width it read too stout against the
 * square-on photos), buttresses at the corners, a 7 m clock stage, corner
 * turrets on the shaft's corners rising with spirelets past the clock stage
 * and slim pinnacles at the clock stage's corners, so the top steps in
 * under a 7.7 m spire base.
 * The photos put the spire tip about 84 m over the front terrace and the
 * flagpole's top near 94 m, so the published 92.2 m is taken to include the
 * pole or a lower datum; the photo proportions are kept. OSM's tagged
 * heights for the block (pavilions 35, ranges 29, back towers 42) run 20 to
 * 25 % over the photo-scaled ones and are used only for ratios: back towers
 * 35.5 to the cap tip (checked in the Óðinn river view), chamber roofs 26.
 * The Library is scaled from its own 31 m drum in the DXR west view: aisle
 * 10, drum cornice 19, main roof to the lantern 31.4, lantern gablets 42.8,
 * cone tip 58 (OSM's 58 agrees), iron finial to 66 (estimated).
 *
 * Estimated from the photos: window sizes and rhythm (bays of about 3 m on
 * the ranges, three per pavilion face), the dormers, the chimneys, the
 * stair turrets with copper caps (OSM parts 1318192650-653, 1117689283/284),
 * the Library's buttress ring (a pier with a tall pinnacle at every corner
 * but the corridor's, flying arms from alternate piers, pinnacles where the
 * arms land on the drum), the lantern (to 40.5, sixteen gablets to 45 and a
 * pinnacle at every corner to 48.5), drawn bold so it reads at 200 px.
 *
 * Simplified: the plan is drawn symmetric about the tower's axis (the
 * Senate side's low east wing is drawn as the mirror of the Commons side);
 * the inner ranges are flat roofs at 14 m with the four roofed light
 * courts at 5 m (OSM parts 947988693-703); no ironwork cresting, gargoyles
 * or carving; the front windows are grouped one panel per window per bay,
 * not paired as on the building.
 *
 * Ground: Mapterhorn (tools/terrain.ts grid) is flat on the hilltop round
 * the building, 27.3–28.5 m, falling to the river only beyond the Library;
 * elevation 0. The front terrace and steps at the tower are OSM's 1.5 m.
 * The terrain dips about 4.5 m at the front-east corner, outside the walls
 * (likely the welcome-centre dig); `tools/terrain.ts check` passes.
 *
 * Night: the sandstone is floodlit all round (the Peace Tower most), the
 * clock faces glow white (`entrance`), windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Centre Block - Parliament Hill.jpg, Saffron Blaze, CC BY-SA 3.0 (south,
 *    square on) https://commons.wikimedia.org/wiki/File:Centre_Block_-_Parliament_Hill.jpg
 *  - Ottawa - ON - Parlamentsgebäude (Centre Block).jpg, Wladyslaw, CC BY-SA
 *    3.0 (south) https://commons.wikimedia.org/wiki/File:Ottawa_-_ON_-_Parlamentsgeb%C3%A4ude_(Centre_Block).jpg
 *  - Centre Block, Ottawa, Southeast view 20170422 1.jpg, DXR, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Centre_Block,_Ottawa,_Southeast_view_20170422_1.jpg
 *  - Centre Block and Library of Parliament, Ottawa, West view 20170422 1.jpg,
 *    DXR, CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Centre_Block_and_Library_of_Parliament,_Ottawa,_West_view_20170422_1.jpg
 *  - Ottawa Centre Block and Library of Parliament seen from Major's Hill
 *    Park, Ymblanter, CC BY-SA 4.0 (north-east) https://commons.wikimedia.org/wiki/File:Ottawa_Centre_Block_and_Library_of_Parliament_seen_from_Major%27s_Hill_Park.jpg
 *  - Parliament Hill from the Ottawa River.JPG, Óðinn, CC BY-SA 2.5 ca
 *    (north-west) https://commons.wikimedia.org/wiki/File:Parliament_Hill_from_the_Ottawa_River.JPG
 *  - Ottawa - ON - Library of Parliament.jpg, Wladyslaw, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Ottawa_-_ON_-_Library_of_Parliament.jpg
 *  - Parliament Hill and Ottawa River from the Supreme Court of Canada.jpg,
 *    Jon Kolbert, CC BY-SA 4.0 (west, far) https://commons.wikimedia.org/wiki/File:Parliament_Hill_and_Ottawa_River_from_the_Supreme_Court_of_Canada.jpg
 * Facts: Wikipedia "Centre Block", "Peace Tower", "Library of Parliament".
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the absolute heights (see above); the back (river) side is seen
 * only from across the river and from the north-east, so its window rhythm
 * is estimated; the inner roofs are not visible in any open photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, qf, rect, tf, ngon, ngonPrism, spire, pinnacle, beam, type Rect, type Side } from './dc-national-cathedral'
import { hip, gable, save } from './dc-white-house'

const ID = 'ott-parliament-centre-block'

const stone = new Part(), trim = new Part(), win = new Part(), green = new Part(), dark = new Part(), lit = new Part()

// ---------------------------------------------------------------------------
// Heights (metres over the front terrace; see header)
const EAVE = 15.5, DECK = 22, PAV_EAVE = 23, PAV_TOP = 29

// ---------------------------------------------------------------------------
// Face helpers. A face is a wall plane of a rect: origin, along-unit, normal.
type XY = [number, number]
type Face = { o: XY; u: XY; n: XY; len: number }
function face(r: Rect, side: Side): Face {
  if (side === 's') return { o: [r.x0, r.y0], u: [1, 0], n: [0, -1], len: r.x1 - r.x0 }
  if (side === 'n') return { o: [r.x1, r.y1], u: [-1, 0], n: [0, 1], len: r.x1 - r.x0 }
  if (side === 'e') return { o: [r.x1, r.y0], u: [0, 1], n: [1, 0], len: r.y1 - r.y0 }
  return { o: [r.x0, r.y1], u: [0, -1], n: [-1, 0], len: r.y1 - r.y0 }
}
const fp = (f: Face, s: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z]
const N3 = (f: Face): V3 => [f.n[0], f.n[1], 0]
function fpanel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  qf(p, fp(f, s0, z0, d), fp(f, s1, z0, d), fp(f, s1, z1, d), fp(f, s0, z1, d), N3(f))
}
/** A pointed (equilateral) lancet, flat on the face. */
function flancet(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05, seg = 2) {
  const w = s1 - s0, h = (w * Math.sqrt(3)) / 2, spring = Math.max(z0, z1 - h)
  const pts: XY[] = [[s0, z0], [s1, z0], [s1, spring]]
  for (let k = 1; k <= seg; k++) { const t = (Math.PI / 3) * (k / seg); pts.push([s0 + w * Math.cos(t), spring + w * Math.sin(t)]) }
  for (let k = seg - 1; k >= 1; k--) { const t = (Math.PI / 3) * (k / seg); pts.push([s1 - w * Math.cos(t), spring + w * Math.sin(t)]) }
  pts.push([s0, spring])
  for (let i = 1; i < pts.length - 1; i++) tf(p, fp(f, ...pts[0], d), fp(f, ...pts[i], d), fp(f, ...pts[i + 1], d), N3(f))
}
/** A block standing proud of a face (pier, band, porch). */
function fblock(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number, top = true) {
  const a = fp(f, s0, 0, 0), b = fp(f, s1, 0, d)
  const r = rect(Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]))
  cbox(p, r, z0, z1, { top })
}
/** Window rows across a face, n even bays: each row a lancet or a square-headed panel. */
type Row = { z0: number; z1: number; w: number; kind: 'l' | 'r' }
function bays(f: Face, n: number, rows: Row[], m = 0.6) {
  const L = f.len - 2 * m
  for (let k = 0; k < n; k++) {
    const c = m + (L * (k + 0.5)) / n
    for (const r of rows) {
      if (r.kind === 'l') flancet(win, f, c - r.w / 2, c + r.w / 2, r.z0, r.z1, 0.05, 1)
      else fpanel(win, f, c - r.w / 2, c + r.w / 2, r.z0, r.z1)
    }
  }
}
/** Three storeys of a range: pointed ground floor, a two-storey grouped panel above. */
const RANGE: Row[] = [
  { z0: 1.6, z1: 5.0, w: 1.4, kind: 'l' },
  { z0: 6.6, z1: 9.4, w: 1.3, kind: 'r' },
  { z0: 10.8, z1: 13.2, w: 1.3, kind: 'r' },
]
/** Pavilion faces: one storey more. */
const PAV: Row[] = [
  { z0: 1.6, z1: 5.0, w: 1.4, kind: 'l' },
  { z0: 6.6, z1: 9.4, w: 1.3, kind: 'r' },
  { z0: 10.8, z1: 13.2, w: 1.3, kind: 'r' },
  { z0: 15.4, z1: 19.6, w: 1.3, kind: 'l' },
]

/**
 * A gabled dormer in a roof slope that rises from z0 at the wall plane with
 * gradient g (metres up per metre in): front face set `d` inside the wall.
 */
function dormer(f: Face, s: number, w: number, z0: number, g: number, d: number, h: number, body: Part) {
  const zb = z0 + g * d, zt = zb + h, zr = zt + w * 0.55
  const dt = (zt - z0) / g, dr = (zr - z0) / g
  const nO = N3(f)
  // front: rectangle and gable
  qf(body, fp(f, s - w / 2, zb, -d), fp(f, s + w / 2, zb, -d), fp(f, s + w / 2, zt, -d), fp(f, s - w / 2, zt, -d), nO)
  tf(body, fp(f, s - w / 2, zt, -d), fp(f, s + w / 2, zt, -d), fp(f, s, zr, -d), nO)
  fpanel(win, f, s - w * 0.3, s + w * 0.3, zb + 0.25, zt - 0.1, -d + 0.05)
  // roof planes (no cheeks: the gap shows the main slope behind)
  for (const e of [-1, 1]) {
    // roof plane
    const up: V3 = [f.u[0] * e, f.u[1] * e, 0.9]
    qf(body, fp(f, s + (e * w) / 2, zt, -d), fp(f, s, zr, -d), fp(f, s, zr, -dr), fp(f, s + (e * w) / 2, zt, -dt), up)
  }
}

/** A range: walls to the eaves and a steep roof up to a flat deck. */
function range(r: Rect, roof: Part, o: { eave?: number; deck?: number; inset?: number; faces?: Partial<Record<Side, number>>; rows?: Row[]; dormers?: Partial<Record<Side, number>> } = {}) {
  const eave = o.eave ?? EAVE, deck = o.deck ?? DECK, inset = o.inset ?? 5
  cbox(stone, r, 0, eave, { top: false })
  cbox(trim, grow(r, 0.25), eave - 0.6, eave, { top: false })
  hip(roof, grow(r, 0.25), eave, deck, inset, green)
  for (const [side, n] of Object.entries(o.faces ?? {}) as [Side, number][]) bays(face(r, side), n, o.rows ?? RANGE)
  const g = (deck - eave) / inset
  for (const [side, n] of Object.entries(o.dormers ?? {}) as [Side, number][]) {
    const f = face(grow(r, 0.25), side)
    for (let k = 0; k < n; k++) dormer(f, f.len * ((k + 0.5) / n), 1.5, eave, g, 1.2, 1.6, roof)
  }
}

/** A pavilion: a storey taller, steep truncated roof, corner turrets, a dormer a face. */
function pavilion(r: Rect, faces: Side[], bayN = 3) {
  cbox(stone, r, 0, PAV_EAVE, { top: false, c: 0.3 })
  cbox(trim, grow(r, 0.3), PAV_EAVE - 0.7, PAV_EAVE, { top: false, bottom: true })
  const R = grow(r, 0.3)
  hip(dark, R, PAV_EAVE, PAV_TOP, 2.9, dark)
  for (const side of faces) bays(face(r, side), bayN, PAV, 0.9)
  const g = (PAV_TOP - PAV_EAVE) / 2.9
  for (const side of ['s', 'e', 'w'] as Side[]) {
    const f = face(R, side)
    dormer(f, f.len / 2, 1.6, PAV_EAVE, g, 0.9, 1.8, dark)
  }
  // corner turrets (bartizans) with spirelets
  for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]] as XY[]) {
    pinnacle(stone, x, y, 0.65, PAV_EAVE - 2.5, PAV_EAVE + 1.6, PAV_EAVE + 4.2, 4)
  }
}

/** A chimney stack. */
function chimney(x: number, y: number, z0: number, z1: number, w = 1.2, dpt = 0.8) {
  cbox(stone, rect(x - w / 2, x + w / 2, y - dpt / 2, y + dpt / 2), z0, z1, { top: true })
}

/** A stair turret with a steep copper cap, rising out of the inner roofs. */
function capTurret(r: Rect, z0: number, z1: number, tip: number) {
  cbox(stone, r, z0, z1, { top: false })
  const R = grow(r, 0.2)
  const inset = Math.min(R.x1 - R.x0, R.y1 - R.y0) / 2 - 0.05
  hip(green, R, z1, tip, inset, green)
}

// ---------------------------------------------------------------------------
// The two halves (mirrored about x = 0)
const mr = (s: number, x0: number, x1: number, y0: number, y1: number): Rect =>
  s > 0 ? rect(x0, x1, y0, y1) : rect(-x1, -x0, y0, y1)
const ms = (s: number, side: Side): Side => (s > 0 ? side : side === 'e' ? 'w' : side === 'w' ? 'e' : side)

for (const s of [1, -1]) {
  const E = ms(s, 'e'), W = ms(s, 'w')
  // Front range, tower to the corner block.
  range(mr(s, 4.4, 46, -25.3, -14.5), dark, { faces: { s: 11 }, dormers: { s: 5 } })
  cbox(stone, mr(s, 35.8, 46, -29, -25.3), 0, EAVE, { top: dark })
  // Corner block: front between the pavilions, the end wall, the end pavilion.
  range(mr(s, 46, 70.8, -36.9, -4), dark, { faces: { s: 5, [E]: 3 }, dormers: { s: 3 } })
  // Front pavilions and the end pavilion.
  pavilion(mr(s, 35.8, 46.1, -38.9, -28.8), ['s', W])
  pavilion(mr(s, 62.2, 72.4, -38.7, -28.6), ['s', E])
  pavilion(mr(s, 62.4, 72.4, -13.6, -3.7), [E, 'n'])
  // Entrance porch between the front pavilions.
  {
    const r = mr(s, 51.6, 56.6, -42.4, -36.9)
    cbox(stone, r, 0, 4.6, { top: false })
    gable(dark, stone, grow(r, 0.2, 0), 4.6, 7.0, true, [true, false])
    flancet(lit, face(r, 's'), 1.2, 3.8, 0, 3.9, 0.05, 3)
  }
  // Chamber hall (Commons west, Senate east): tall walls, clerestory, copper hip.
  {
    const r = mr(s, 47.7, 65.4, -4, 26)
    cbox(stone, r, 0, 18, { top: false })
    cbox(trim, grow(r, 0.25), 17.4, 18, { top: false, bottom: true })
    const f = face(r, E)
    for (let k = 0; k < 5; k++) { const c = 3 + (k + 0.5) * (f.len - 6) / 5; flancet(win, f, c - 1.5, c + 1.5, 11.2, 17.0, 0.05, 3) }
    // clerestory under the copper roof
    const R = grow(r, 0.3)
    cbox(win, grow(r, -2.2), 18, 20, { top: false })
    hip(green, R, 18, 20.2, 2.0, false)
    hip(green, grow(r, -2.2), 20, 26.5, 5.5, green)
  }
  // Low aisle along the end wall, north of the end pavilion, and the back corner.
  {
    const r = mr(s, 65.4, 71, -3.7, 36.9)
    cbox(stone, r, 0, 8, { top: false })
    gable(green, stone, grow(r, 0.2, 0), 8, 10.8, true, [false, true])
    bays(face(r, E), 7, [{ z0: 1.6, z1: 6.4, w: 1.6, kind: 'l' }], 1)
    const rb = mr(s, 47.7, 65.4, 30.7, 36.9)
    cbox(stone, rb, 0, 8, { top: false })
    gable(green, stone, grow(rb, 0, 0.2), 8, 10.8, false, [false, false])
    bays(face(rb, 'n'), 4, [{ z0: 1.6, z1: 6.4, w: 1.6, kind: 'l' }], 1)
    cbox(stone, mr(s, 47.7, 65.4, 26, 30.7), 0, 8, { top: green })
  }
  // Side porte-cochère on the low aisle.
  {
    const r = mr(s, 71, 77.4, 16.8, 21.4)
    cbox(trim, r, 3.6, 4.8, { bottom: true })
    for (const y of [16.8, 20.2]) cbox(stone, mr(s, 76.2, 77.4, y, y + 1.2), 0, 3.6, { top: false })
    fpanel(lit, face(mr(s, 65.4, 71, 16.8, 21.4), E), 1.0, 3.6, 0, 3.4)
  }
  // Back towers at the chambers' back corners.
  for (const [x0, x1] of [[42.4, 47.3], [59.8, 65.1]]) {
    const r = mr(s, x0, x1, 26, 31.7)
    cbox(stone, r, 0, 30.5, { top: false, c: 0.25 })
    cbox(trim, grow(r, 0.25), 30, 30.5, { top: false, bottom: true })
    hip(green, grow(r, 0.25), 30.5, 35.5, 2.6, green)
    for (const side of ['n', 'e', 'w'] as Side[]) {
      const f = face(r, side)
      flancet(win, f, f.len / 2 - 0.7, f.len / 2 + 0.7, 24.5, 28.6, 0.05, 2)
      fpanel(win, f, f.len / 2 - 0.6, f.len / 2 + 0.6, 17.5, 22.5)
    }
  }
  // Back range, Library corridor to the back towers.
  range(mr(s, 0, 47.7, 22.5, 34.4), green, { faces: { n: 11 } })
  range(mr(s, 37.8, 42.4, 31.7, 37.0), green, { faces: { n: 1 }, inset: 2.2, deck: 19 })
  {
    const r = mr(s, 42.4, 47.3, 31.7, 37.0)
    cbox(stone, r, 0, 12, { top: green })
  }
  // Inner ranges and the Hall of Honour (14 m) between the roofed light
  // courts (5 m): OSM parts 947988693-703.
  for (const [x0, x1, h] of [[0, 4.7, 14], [4.7, 11.6, 5], [11.6, 25.4, 14], [25.4, 37.9, 5], [37.9, 47.7, 14]] as [number, number, number][]) {
    cbox(stone, mr(s, x0, x1, -14.5, 22.5), 0, h, { top: h > 10 ? green : dark })
  }
  // Stair turrets with copper caps (OSM parts 1318192650-653, 1117689283/4).
  capTurret(mr(s, 8.3, 13.5, -13.2, -9.7), 14, 23.5, 27.5)
  capTurret(mr(s, 13.0, 16.6, 16.6, 21.9), 14, 23.5, 27.5)
  capTurret(mr(s, 39.8, 44.8, -20.2, -16.5), 20, 24.0, 28.0)
  // Chimneys on the ridges.
  for (const x of [14.5, 19.5]) chimney(s * x, -19.6, 20, 26.2)
  chimney(s * 55.0, -30.5, 20, 25.5)
}

// ---------------------------------------------------------------------------
// Peace Tower
const TY = -37.05, TH = 5.6
{
  const r = rect(-TH, TH, TY - TH, TY + TH)
  // link to the front range
  cbox(stone, rect(-4.4, 4.4, -31.4, -25.3), 0, EAVE, { top: dark })
  // the front terrace and steps round the tower base (OSM 1.5 m)
  cbox(trim, rect(-18.7, 18.7, -46.9, -33.1), 0, 1.5, { top: true })
  cbox(trim, rect(-8.6, 8.6, -48.6, -46.9), 0, 0.75, { top: true })
  // shaft with corner buttresses
  cbox(stone, r, 0, 56, { top: true, b: 0.4 })
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * (TH - 0.6), cy = TY + sy * (TH - 0.6)
    cbox(stone, rect(cx - 1.05, cx + 1.05, cy - 1.05, cy + 1.05), 0, 55.4, { b: 0.3 })
  }
  // string courses
  for (const [z0, z1] of [[21.4, 22.2], [42.8, 43.6]]) cbox(trim, grow(r, 0.15), z0, z1, { bottom: true, b: 0.12 })
  for (const side of ['s', 'e', 'w', 'n'] as Side[]) {
    const f = face(r, side), c = f.len / 2
    if (side === 's') {
      // the porch arch and its gabled hood, the Memorial Chamber window
      flancet(lit, f, c - 2.6, c + 2.6, 1.5, 9.6, 0.05, 3)
      tf(trim, fp(f, c - 3.4, 9.2, 0.1), fp(f, c + 3.4, 9.2, 0.1), fp(f, c, 12.8, 0.1), N3(f))
      flancet(win, f, c - 1.6, c + 1.6, 13.4, 20.5, 0.05, 3)
    } else if (side !== 'n') {
      flancet(lit, f, c - 2.0, c + 2.0, 1.5, 8.4, 0.05, 3)
      flancet(win, f, c - 1.3, c + 1.3, 13.4, 20.5, 0.05, 3)
    }
    // two tall lancets, two short, then the belfry's four
    for (const e of [-1, 1]) {
      flancet(win, f, c + e * 1.35 - 0.7, c + e * 1.35 + 0.7, 24.5, 36.5, 0.05, 2)
      flancet(win, f, c + e * 1.35 - 0.7, c + e * 1.35 + 0.7, 37.6, 42.2, 0.05, 2)
    }
    // the belfry's tall paired openings
    for (const e of [-1, 1]) flancet(win, f, c + e * 1.35 - 0.8, c + e * 1.35 + 0.8, 44.6, 54.4, 0.05, 2)
  }
  // gargoyle gallery and the clock stage
  cbox(trim, grow(r, 0.3), 55.4, 56.6, { bottom: true, b: 0.2 })
  const cs = rect(-3.5, 3.5, TY - 3.5, TY + 3.5)
  cbox(stone, cs, 56.6, 65.5, { c: 0.35, top: false })
  cbox(trim, grow(cs, 0.35), 65.0, 65.8, { bottom: true, b: 0.15 })
  for (const side of ['s', 'e', 'w', 'n'] as Side[]) {
    const f = face(cs, side), c = f.len / 2, n = N3(f), CZ = 61.0, R = 2.4
    const pts = ngon(0, 0, R, 12, 0)
    for (let k = 0; k < 12; k++) {
      const a = pts[k], b = pts[(k + 1) % 12]
      tf(lit, fp(f, c, CZ, 0.06), fp(f, c + a[0], CZ + a[1], 0.06), fp(f, c + b[0], CZ + b[1], 0.06), n)
    }
    // hands (at ten to eleven, as in the Saffron Blaze photo)
    const hand = (ang: number, L: number, w: number) => {
      const ux = Math.sin(ang), uz = Math.cos(ang), px = -uz * w, pz = ux * w
      qf(dark, fp(f, c - px, CZ - pz, 0.1), fp(f, c + px, CZ + pz, 0.1), fp(f, c + px + ux * L, CZ + pz + uz * L, 0.1), fp(f, c - px + ux * L, CZ - pz + uz * L, 0.1), n)
    }
    hand(-0.4, 1.9, 0.14)
    hand(-1.05, 1.3, 0.18)
  }
  // corner turrets on the shaft's corners, rising past the clock stage with
  // tall spirelets, and slim pinnacles at the clock stage's own corners,
  // stepping in under the spire
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    pinnacle(stone, sx * 4.75, TY + sy * 4.75, 0.8, 56.6, 64.0, 71.0, 8)
    pinnacle(trim, sx * 3.5, TY + sy * 3.5, 0.35, 65.8, 67.0, 70.0, 4)
  }
  // the copper spire, its lucarnes and the flagpole
  const base = [[-3.85, TY - 3.85, 65.8], [3.85, TY - 3.85, 65.8], [3.85, TY + 3.85, 65.8], [-3.85, TY + 3.85, 65.8]] as V3[]
  spire(green, base, [0, TY, 84.5])
  const g = (84.5 - 65.8) / 3.85
  for (const side of ['s', 'e', 'w', 'n'] as Side[]) {
    const f = face(rect(-3.85, 3.85, TY - 3.85, TY + 3.85), side)
    dormer(f, f.len / 2, 1.2, 65.8, g, 0.5, 1.8, green)
  }
  ngonPrism(trim, 0, TY, 0.3, 6, 84.0, 94.5, { top: true })
}

// ---------------------------------------------------------------------------
// Library of Parliament
const LY = 56.7
{
  const N = 16, rot = Math.PI / N
  const ring = (r: number, z: number) => ngon(0, LY, r, N, z, rot)
  // corridor from the back range
  cbox(stone, rect(-4.2, 4.2, 34.3, 38.2), 0, 10, { top: green })
  // the aisle of chapels, its lean-to roof
  stone.loft([ring(20, 0), ring(20, 10.0)])
  trim.loft([ring(20.3, 9.5), ring(20.3, 10.1)])
  dark.loft([ring(20.3, 10.1), ring(15.5, 13.2)])
  // the drum, big traceried windows in each face
  stone.loft([ring(15.5, 12.5), ring(15.5, 19.0)])
  trim.loft([ring(15.8, 18.5), ring(15.8, 19.3)])
  const pts = ring(15.5, 0), pts20 = ring(20, 0)
  for (let k = 0; k < N; k++) {
    const a = pts[k], b = pts[(k + 1) % N]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const f: Face = { o: [a[0], a[1]], u, n: [u[1], -u[0]], len: L }
    flancet(win, f, L / 2 - 1.1, L / 2 + 1.1, 13.7, 18.3, 0.05, 1)
    const a2 = pts20[k], b2 = pts20[(k + 1) % N]
    const L2 = Math.hypot(b2[0] - a2[0], b2[1] - a2[1])
    const u2: XY = [(b2[0] - a2[0]) / L2, (b2[1] - a2[1]) / L2]
    const f2: Face = { o: [a2[0], a2[1]], u: u2, n: [u2[1], -u2[0]], len: L2 }
    // chapel windows (the corridor side has none)
    const mx = (a2[0] + b2[0]) / 2, my = (a2[1] + b2[1]) / 2
    if (!(my < LY - 15 && Math.abs(mx) < 6)) {
      flancet(win, f2, L2 / 2 - 1.3, L2 / 2 + 1.3, 2.2, 7.8, 0.05, 1)
    }
  }
  // flying buttresses at alternate corners: outer pier with a pinnacle, arm to the drum
  const corners20 = ring(20, 0)
  for (let k = 0; k < N; k++) {
    const c = corners20[k]
    const dx = c[0], dy = c[1] - LY, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
    if (uy < -0.9) continue // the corridor
    const px = c[0] + ux * 0.5, py = c[1] + uy * 0.5
    // every pier carries a tall thin pinnacle; the flying arms spring from alternate ones
    pinnacle(stone, px, py, 1.1, 0, 15.0, 25.5, 4)
    if (k % 2 === 0) beam(stone, [px - ux * 0.7, py - uy * 0.7, 12.5], [ux * 15.6, LY + uy * 15.6, 17.5], 0.8, 1.1)
  }
  // pinnacles round the drum's cornice where the arms land
  const d16 = ring(15.6, 0)
  for (let k = 0; k < N; k += 2) pinnacle(trim, d16[k][0], d16[k][1], 0.45, 18.5, 20.0, 26.0, 4)
  // main cone, the lantern ring of gablets and pinnacles, top cone, finial
  dark.loft([ring(16.2, 19.3), ring(7.4, 31.4)])
  stone.loft([ring(6.6, 31.0), ring(6.6, 40.5)])
  const lp = ring(6.6, 0)
  for (let k = 0; k < N; k++) {
    const a = lp[k], b = lp[(k + 1) % N]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const f: Face = { o: [a[0], a[1]], u, n: [u[1], -u[0]], len: L }
    tf(trim, fp(f, 0, 40.5, 0.05), fp(f, L, 40.5, 0.05), fp(f, L / 2, 45.0, 0.05), N3(f))
    flancet(win, f, L / 2 - 0.6, L / 2 + 0.6, 32.6, 40.2, 0.06, 1)
  }
  for (let k = 0; k < N; k++) { const c = lp[k]; pinnacle(trim, c[0], c[1], 0.38, 39.5, 41.5, 48.5, 4) }
  dark.loft([ring(7.0, 40.5), ring(7.0, 41.1)])
  spire(dark, ring(7.0, 41.1), [0, LY, 58.0])
  ngonPrism(dark, 0, LY, 0.35, 6, 57.0, 66.0, { top: true })
}

// ---------------------------------------------------------------------------
const flood = (p: V3, n: V3) => {
  if (n[2] > 0.6) return 0.2
  if (Math.abs(p[0]) < 8 && p[1] < -28) return 1
  return 0.8
}
await save(ID, 'Centre Block, Parliament of Canada', [
  { part: stone, material: { ...finish('nepean-sandstone', 0xdccab0), floodlight: flood } },
  { part: trim, material: { ...finish('ohio-sandstone', 0xece1cd), floodlight: flood } },
  { part: win, material: PALETTE.window },
  { part: green, material: finish('copper-patina', 0x7fa48f) },
  { part: dark, material: finish('dark-copper', 0x6f6661) },
  { part: lit, material: PALETTE.entrance },
], { height: 94.5, anchor: [45.4250798, -75.699879], bearing: 329.2 }, 6500)
