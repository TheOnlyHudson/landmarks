/**
 * Michigan Central Station (2405 West Vernor Highway, Detroit; 1913, Warren &
 * Wetmore with Reed & Stem; restored by Ford 2018-2024) — original procedural
 * geometry, CC0-1.0.
 * bun generators/det-michigan-central.ts
 *
 * HEADER: see the block at the end of this comment for sources and numbers.
 *
 * Map frame: x along the station front (towards bearing 107°), y towards the
 * front (bearing 17°, Roosevelt Park and Michigan Avenue), z up, metres.
 * Placed at bearing 17. Anchor = centroid of the OSM outline way/805151309,
 * 42.3287417,-83.0777330. In this frame every OSM part is rectilinear; the
 * building is symmetrical about x = +0.5, so it is built about x = 0 and
 * shifted by XC on write.
 *
 * Identity, in order: the tall H-plan office tower (105 x 32 m, 18 storeys)
 * standing behind the low station; its heavy top cornice over a two-storey
 * arcade of round-headed windows; the buff brick shaft with tall window
 * bays; the grey stone waiting-room block in front with its three giant
 * arched windows between paired Corinthian columns, three pediments and the
 * low hipped metal roof; the lower side pavilions with balustrades.
 *
 * Ground: y = 0 is the track level behind the station (lidar ground 177.6 m,
 * Mapterhorn ~177.7 m). The front, Roosevelt Park and both ends stand on the
 * street, 3.8 m higher (lidar and terrain agree), so facade detail on those
 * sides starts at G = 3.8; the walls run on down to y = 0 and sink into the
 * map's ground there. Elevation 0.
 *
 * Evidence:
 *  - OSM: outline way/805151309 (train_station, 18 levels, Warren & Wetmore,
 *    Q1764199); parts way/105771103 (tower, 18 levels, height 70, min_level
 *    2), way/655089833 (waiting room block), way/30259672 (2-level base),
 *    way/655089834 (glass gabled concourse), way/105771106 (west canopy),
 *    way/655089822 (east deck at street level). Footprints follow them.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017, before the
 *    restoration), 1 m grid read in this frame. Tower roof 73.6 m and
 *    parapet 74.7 m above the track datum (70.9 m above the front street;
 *    OSM/published 70 m); rooftop boxes on the wings to 77.7 m. Waiting
 *    room: eaves ~20.5 m, pediment apexes 23.6 m at x = -20, 0, +20, a flat
 *    lantern top 26.9 m over x +-24, y 26..35. Pavilions and back base
 *    14.2 m with balustrades to 15.9 m. Concourse glass gable eaves ~16 m,
 *    ridge ~21.5 m; its floor reads 4 m through the frame. West canopy a
 *    broken grid at 10-14 m. The east deck 4.7 m over ground at ~1 m.
 *    The lidar roof outline of the tower is ~3 m longer than OSM (the 1.3 m
 *    cornice overhang each side) and its wings reach 3-6 m further south
 *    (y -11.5 west, -14.5 east, cornice included) than OSM's -8.4; the
 *    Barera south-east photo also shows deeper end faces. The wings' south
 *    faces are drawn at y = -10.0 (OSM -8.4/-9.0, lidar less the cornice);
 *    everything else follows OSM.
 *  - Terrain (Mapterhorn): 3.7-4.4 m on the front and ends, 0-0.5 m on the
 *    track side, matching the lidar.
 *  - NAIP 2022: the brown hipped waiting-room roof and its pale lantern, the
 *    dark glass concourse gable and the gable running south from it, the
 *    open steel grid of the west canopy, and pale (white membrane) flat
 *    roofs on the tower and the base, drawn in the stone colour. The
 *    concourse glass is darker than the palette's glass (blue-grey in
 *    NAIP), so it is a darker 'glass' finish.
 *  - Floor plan, Railway Age Gazette 1913 (public domain): front 345 ft 4 in
 *    (105.3 m) = tower length; waiting room 233 ft wide.
 *  - Photos (rhythm and proportions scaled from the front ones against the
 *    OSM widths): the front's 8 column pairs, 3 arches 6.4 m wide reaching
 *    13.5 m above the street, 4 small arched windows 2.6 m wide to 7.2 m;
 *    entablature to 16.5 m; pediments 17.7 m wide; pavilions with three
 *    arched windows on the front; tower bays: 18 on the bar, 3 on each wing
 *    face, 6 on each end; arcade of round-headed windows in the top two
 *    storeys under the cornice, a bracketed balcony band below it.
 *
 * Photos (all EVIDENCE):
 *  - Michigan_Central_Station_2026.jpg, WMrapids, CC0 (front from the park,
 *    drone, after the restoration)
 *  - Detroit_December_2025_06_(Michigan_Central_Station).jpg, Michael Barera,
 *    CC BY-SA 4.0 (front from the park axis)
 *  - Detroit_August_2025_23_(Michigan_Central_Station).jpg, Michael Barera,
 *    CC BY-SA 4.0 (east end and south side from the east-south-east)
 *  - MichiganCentral2024.jpg, Coreyfein01, CC BY-SA 4.0 (front from the park)
 *  - Restored_Michigan_Central_Station.jpg, PunkToad, CC BY 2.0 (front from
 *    the north-west, dusk with the restored floodlighting)
 *  - Michigan_Central_Train_Station_Exterior_2010.jpg, Albert duce,
 *    CC BY-SA 3.0 (front and west end from the north-north-west)
 *  - Michigan_Central_2015.jpg, St8fan, CC BY-SA 4.0 (front)
 *  - Flickr 21532839558 and 21533842969, Ken Lund, CC BY-SA 2.0 (back, from
 *    the south under the rail viaduct; 2015, before the restoration)
 *  - Flickr 21097986224, Ken Lund, CC BY-SA 2.0 (front and west wing from
 *    the north-west)
 *  - Michigan_Central_Station_Detroit_floor_plan.jpg, Railway Age Gazette,
 *    public domain
 * No look-only sources. No commercial imagery.
 *
 * Numbers: footprints measured (OSM, checked against lidar); tier heights
 * measured (lidar); facade rhythm and opening sizes estimated from the
 * front photos scaled to OSM widths; tower storey groups estimated (12 shaft
 * storeys between the base roof and the band storey, three to a panel).
 *
 * Doubts: the back (south) base walls are drawn from the 2015 Ken Lund
 * photos, before the concourse was re-roofed; the south gable hall and the
 * low block at its end are read from lidar and NAIP only. The west canopy
 * is an open steel grid in NAIP; drawn as a few beams on posts. The tower's
 * end faces are drawn with six bays from the Barera east-end photo.
 *
 * Left out: carved ornament, cartouches, the columns' fluting and capitals'
 * leaves (capitals are blocks), modillions (the cornice is a bold plain
 * band), balusters (solid balustrades), mullions except the bold glazing
 * bars of the three great arches.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, panel, rect, walls, type XY } from './chi-aon-center'

const XC = 0.5 // shift of the symmetry axis in the placement frame
const G = 3.8 // street level on the front and ends, above the track datum

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), glass = new Part(), trim = new Part()

// ---------------------------------------------------------------------------
// helpers

/** Flat ledge between two rings of equal length at height z (outer ring outside). */
function ledge(p: Part, outer: XY[], inner: XY[], z: number) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    p.quad([outer[i][0], outer[i][1], z], [outer[j][0], outer[j][1], z], [inner[j][0], inner[j][1], z], [inner[i][0], inner[i][1], z])
  }
}

/** A projecting band round ring r: sloped soffit, face, bevelled top. */
function band(p: Part, r: XY[], z0: number, z1: number, d: number, bevel = 0.3) {
  const o = inset(r, -d)
  const zs = z0 + Math.min(d * 0.7, (z1 - z0) * 0.45)
  walls(p, r, z0, zs, o)
  walls(p, o, zs, z1 - bevel)
  const ob = inset(o, bevel)
  walls(p, o, z1 - bevel, z1, ob)
  ledge(p, ob, r, z1)
}

/** A projecting band along an open polyline a→b only (one wall), with end caps. */
function bandSeg(p: Part, a: XY, b: XY, z0: number, z1: number, d: number, bevel = 0.25) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, o: number, z: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  const zs = z0 + Math.min(d * 0.7, (z1 - z0) * 0.45)
  p.quad(P(L, 0, z0), P(0, 0, z0), P(0, d, zs), P(L, d, zs))
  p.quad(P(0, d, zs), P(L, d, zs), P(L, d, z1 - bevel), P(0, d, z1 - bevel))
  p.quad(P(0, d, z1 - bevel), P(L, d, z1 - bevel), P(L, d - bevel, z1), P(0, d - bevel, z1))
  p.quad(P(0, d - bevel, z1), P(L, d - bevel, z1), P(L, 0, z1), P(0, 0, z1))
  for (const [s, sg] of [[0, -1], [L, 1]] as [number, number][]) {
    const pts: V3[] = [P(s, 0, z0), P(s, d, zs), P(s, d, z1 - bevel), P(s, d - bevel, z1), P(s, 0, z1)]
    for (let k = 1; k < pts.length - 1; k++) sg > 0 ? p.tri(pts[0], pts[k], pts[k + 1]) : p.tri(pts[0], pts[k + 1], pts[k])
  }
}

/** A box (closed except its bottom) with optional bevelled top edge; returns the top ring. */
function box(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bevel = 0) {
  if (bevel <= 0) { walls(wall, r, z0, z1); if (top) cap(top, r, z1); return r }
  const ins = inset(r, bevel)
  walls(wall, r, z0, z1 - bevel)
  walls(wall, r, z1 - bevel, z1, ins)
  if (top) cap(top, ins, z1)
  return ins
}

/** A solid parapet (balustrade) along a→b, on the wall line, thickness t, inside the wall. */
function parapet(p: Part, a: XY, b: XY, z0: number, z1: number, t = 0.45) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, o: number, z: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  p.quad(P(0, 0.15, z0), P(L, 0.15, z0), P(L, 0.15, z1), P(0, 0.15, z1))
  p.quad(P(L, -t, z0), P(0, -t, z0), P(0, -t, z1), P(L, -t, z1))
  p.quad(P(0, 0.15, z1), P(L, 0.15, z1), P(L, -t, z1), P(0, -t, z1))
  p.quad(P(0, -t, z0), P(0, 0.15, z0), P(0, 0.15, z1), P(0, -t, z1))
  p.quad(P(L, 0.15, z0), P(L, -t, z0), P(L, -t, z1), P(L, 0.15, z1))
}

/** Round-headed panel on wall a→b: jambs s0..s1 from z0, semicircular head. */
function arch(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, top: number, out = 0.05, seg = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2, zs = top - r
  if (zs > z0) p.quad(P(s0, z0), P(s1, z0), P(s1, zs), P(s0, zs))
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
  }
}

/** A raised semicircular archivolt (frame) round an arch on wall a→b. */
function archivolt(p: Part, a: XY, b: XY, c: number, r: number, zs: number, w: number, d: number, seg = 10) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  const at = (t: number, rr: number, o: number) => P(c + rr * Math.cos(t), zs + rr * Math.sin(t), o)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.quad(at(t1, r, d), at(t0, r, d), at(t0, r + w, d), at(t1, r + w, d)) // face
    p.quad(at(t0, r + w, 0), at(t1, r + w, 0), at(t1, r + w, d), at(t0, r + w, d)) // outer edge
    p.quad(at(t1, r, 0), at(t0, r, 0), at(t0, r, d), at(t1, r, d)) // inner edge (soffit)
  }
}

/** Points along wall a→b of ring edges, for bays centred on the face. */
function centres(L: number, n: number, pitch: number) {
  return Array.from({ length: n }, (_, k) => L / 2 + (k - (n - 1) / 2) * pitch)
}

// ---------------------------------------------------------------------------
// plan (symmetric about x = 0)

const TX = 52.5 // tower half length (x -52..53 in OSM)
const WI = 35.5 // inner face of the wings
const YS = -10.0, YN = 23.8 // wing south and north faces (south: lidar, see header)
const BS = -1.0, BN = 15.7 // bar south and north faces
const H: XY[] = [
  [-TX, YS], [-WI, YS], [-WI, BS], [WI, BS], [WI, YS], [TX, YS],
  [TX, YN], [WI, YN], [WI, BN], [-WI, BN], [-WI, YN], [-TX, YN],
]

// tower heights
const T0 = 14.3 // base roof, where the tower's brick starts
const STR = 59.4, BANDW = 60.2, BAL0 = 62.4, BAL1 = 63.4, ARC_TOP = 71.4, CORN = 74.7, ROOF = 73.6

// ---------------------------------------------------------------------------
// the tower

walls(brick, H, T0, ARC_TOP)
// cornice: soffit, deep face, bevelled top, then the parapet's inner face and the roof
{
  const o = inset(H, -1.3)
  walls(trim, H, ARC_TOP, 72.3, o)
  walls(trim, o, 72.3, CORN - 0.4)
  const ob = inset(o, 0.4)
  walls(trim, o, CORN - 0.4, CORN, ob)
  const rin = inset(H, 0.5)
  ledge(trim, ob, rin, CORN)
  walls(stone, [...rin].reverse(), ROOF, CORN)
  cap(stone, rin, ROOF) // white membrane (NAIP)
  // rooftop boxes on the wings (lidar, to 77.7 m)
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -45 : 36, x1 = sx < 0 ? -36 : 45
    box(stone, stone, rect(x0, -3, x1, 8), ROOF, 76.6, 0.3)
  }
}
// string courses and the balcony band under the arcade
band(trim, H, STR, BANDW, 0.4)
band(trim, H, BAL0, BAL1, 0.75)
band(trim, H, 16.0, 16.8, 0.3)

// windows, face by face
type Face = { a: XY; b: XY; kind: 'wing' | 'bar' | 'end' | 'ret'; north: boolean }
const faces: Face[] = H.map((a, i) => {
  const b = H[(i + 1) % H.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const vertical = Math.abs(b[0] - a[0]) < 1e-6
  const kind = vertical ? (Math.abs(a[0]) > 50 ? 'end' : 'ret') : L > 50 ? 'bar' : 'wing'
  return { a, b, kind, north: (a[1] + b[1]) / 2 > 7 }
})
const shaft: [number, number][] = [[17.6, 26.6], [27.9, 36.9], [38.2, 47.2], [48.5, 57.9]]
for (const f of faces) {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
  const n = f.kind === 'bar' ? 18 : f.kind === 'wing' ? 3 : f.kind === 'end' ? 6 : 1
  const pitch = f.kind === 'bar' ? 3.9 : f.kind === 'wing' ? 3.9 : f.kind === 'end' ? 4.3 : 0
  const cs = n === 1 ? [L / 2] : centres(L, n, pitch)
  const w = 2.45
  for (const c of cs) {
    for (const [z0, z1] of shaft) {
      // the north returns sit inside the waiting room's roof below ~27 m
      if (f.kind === 'ret' && f.north && z0 < 27) continue
      panel(win, f.a, f.b, c - w / 2, c + w / 2, z0, z1, 0.05)
    }
    // band storey: one square window per bay
    panel(win, f.a, f.b, c - 0.85, c + 0.85, BANDW + 0.45, BAL0 - 0.35, 0.05)
    // the arcade: round-headed windows two storeys tall
    const aw = f.kind === 'ret' ? 2.2 : 2.6
    arch(win, f.a, f.b, c - aw / 2, c + aw / 2, BAL1 + 0.5, ARC_TOP - 0.7, 0.05, 8)
  }
}

// ---------------------------------------------------------------------------
// the base under and behind the tower, pavilions, back halls

const BACK = -33.8
box(stone, stone, rect(-TX, BACK, TX, YN), 0, T0)
// balustrades on the free edges of the back base
parapet(stone, [-TX, BACK], [TX, BACK], T0, 15.9)
parapet(stone, [-TX, YS], [-TX, BACK], T0, 15.9)
parapet(stone, [TX, BACK], [TX, YS], T0, 15.9)
// cornice line of the base round its free walls
bandSeg(stone, [-TX, BACK], [TX, BACK], 13.3, T0, 0.5)
bandSeg(stone, [-TX, YN], [-TX, BACK], 13.3, T0, 0.5)
bandSeg(stone, [TX, BACK], [TX, YN], 13.3, T0, 0.5)

// pavilions either side of the waiting room
const PX0 = 37.9, PY1 = 43.0
for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -TX : PX0, x1 = sx < 0 ? -PX0 : TX
  box(stone, stone, rect(x0, YN - 0.5, x1, PY1), 0, T0)
  const front: [XY, XY] = [[x1, PY1], [x0, PY1]]
  parapet(stone, front[0], front[1], T0, 15.9)
  bandSeg(stone, front[0], front[1], 13.3, T0, 0.5)
  const end: [XY, XY] = sx < 0 ? [[-TX, PY1], [-TX, YN]] : [[TX, YN], [TX, PY1]]
  parapet(stone, end[0], end[1], T0, 15.9)
  bandSeg(stone, end[0], end[1], 13.3, T0, 0.5)
  // three arched windows on the front
  const L = x1 - x0
  for (const c of centres(L, 3, 4.2)) arch(win, front[0], front[1], c - 1.2, c + 1.2, G + 1.6, G + 7.6, 0.05, 8)
}
// arched windows along both ends of the base (Duce 2010, Barera 2025)
for (const sx of [-1, 1]) {
  const a: XY = sx < 0 ? [-TX, PY1] : [TX, BACK], b: XY = sx < 0 ? [-TX, BACK] : [TX, PY1]
  const L = PY1 - BACK
  for (const c of centres(L, 15, 4.9)) arch(win, a, b, c - 1.15, c + 1.15, G + 1.6, G + 7.6, 0.05, 8)
}
// back wall: a row of arched windows over the platform level (Ken Lund 2015)
for (const c of centres(2 * TX, 20, 5.0)) {
  if (Math.abs(c - TX) < 21) continue // the south hall's end stands there
  arch(win, [-TX, BACK], [TX, BACK], c - 1.2, c + 1.2, 5.0, 11.6, 0.05, 8)
}

// concourse: glass gable on the base, ridge along x
{
  const x0 = -31.5, x1 = 31.5, y0 = -26.4, y1 = -6.5, ze = 16.0, zr = 21.5, ym = (y0 + y1) / 2
  walls(stone, rect(x0, y0, x1, y1), T0, ze)
  glass.quad([x0, y0, ze], [x1, y0, ze], [x1, ym, zr], [x0, ym, zr])
  glass.quad([x1, y1, ze], [x0, y1, ze], [x0, ym, zr], [x1, ym, zr])
  glass.tri([x1, y0, ze], [x1, y1, ze], [x1, ym, zr])
  glass.tri([x0, y1, ze], [x0, y0, ze], [x0, ym, zr])
}
// south hall: base strips either side, a glass gable hall between, a low end block
{
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -20 : 11.5, x1 = sx < 0 ? -11.5 : 20
    box(stone, stone, rect(x0, -57, x1, BACK + 0.3), 0, T0)
    parapet(stone, sx < 0 ? [-20, BACK] : [20, -57], sx < 0 ? [-20, -57] : [20, BACK], T0, 15.9)
    parapet(stone, [x0, -57], [x1, -57], T0, 15.9)
  }
  const x0 = -11.5, x1 = 11.5, y0 = -50, y1 = BACK + 0.3, ze = 16.0, zr = 21.0
  stone.quad([x0, y0, 7.7], [x1, y0, 7.7], [x1, y0, ze], [x0, y0, ze])
  glass.tri([x0, y0, ze], [x1, y0, ze], [0, y0, zr])
  glass.quad([x0, -20, ze], [x0, y0, ze], [0, y0, zr], [0, -20, zr])
  glass.quad([x1, y0, ze], [x1, -20, ze], [0, -20, zr], [0, y0, zr])
  // the sides of the hall above the strips
  stone.quad([x0, y1, T0], [x0, y0, T0], [x0, y0, ze], [x0, y1, ze])
  stone.quad([x1, y0, T0], [x1, y1, T0], [x1, y1, ze], [x1, y0, ze])
  box(stone, stone, rect(x0, -57, x1, y0), 0, 7.7, 0.3)
}

// west canopy: an open steel grid on posts (NAIP), x -69.3..-52.5
{
  const x0 = -69.3 - XC + 0.5, x1 = -TX, y0 = -33.6, y1 = -8.0, z0 = 10.6, z1 = 11.4, t = 0.35
  const beamsX = [y0 + t, (y0 + y1) / 2, y1 - t], beamsY = [x0 + t, (x0 + x1) / 2, x1 - t]
  for (const y of beamsX) box(roof, roof, rect(x0, y - t, x1, y + t), z0, z1)
  for (const x of beamsY) box(roof, roof, rect(x - t, y0, x + t, y1), z0 + 0.02, z1 - 0.02)
  for (const x of [x0 + t, (x0 + x1) / 2]) for (const y of [y0 + t, (y0 + y1) / 2, y1 - t]) box(roof, null, rect(x - 0.25, y - 0.25, x + 0.25, y + 0.25), 0, z0)
}
// east deck at street level over the low ground (way/655089822)
box(stone, stone, rect(TX - 0.3, -22, 58.6 - XC + 0.5, 42.6), 0, 4.5, 0.25)

// ---------------------------------------------------------------------------
// the waiting room block

const FX = 37.9, FY0 = 18.4, FY = 46.1 // half width, back, front
const ENT = 16.5 + G - 0.0 // top of the cornice: 20.3
{
  const r = rect(-FX, FY0, FX, FY)
  walls(stone, r, 0, ENT - 0.7)
  band(trim, r, ENT - 0.7, ENT, 0.9, 0.25)
  // hip roof to a raised lantern; the lantern's sides are clerestory glass
  const eave = inset(r, 0.3)
  const top: XY[] = rect(-24, 26.5, 24, 35.5)
  const ZT = 25.4, ZL = 26.9
  walls(roof, eave, ENT, ZT, top)
  walls(win, top, ZT, ZL - 0.3)
  walls(roof, top, ZL - 0.3, ZL, inset(top, 0.3))
  cap(roof, inset(top, 0.3), ZL)
  // frieze of the entablature along the front
  // (broken over the three great arches, whose heads rise into it)
  for (const [x0, x1] of [[-FX, -23.9], [-16.1, -3.9], [3.9, 16.1], [23.9, FX]]) bandSeg(trim, [x1, FY], [x0, FY], G + 12.0, ENT - 0.7, 0.3, 0.1)
  // plinth along the front
  bandSeg(stone, [FX, FY], [-FX, FY], G - 0.5, G + 0.9, 0.35, 0.15)
}
const front: [XY, XY] = [[FX, FY], [-FX, FY]] // wall a→b runs west, so its outward normal is +y
const sOf = (x: number) => FX - x // position along the front wall a→b for plan x

// three great arches with bold glazing bars, archivolts
const ARCH_W = 6.4, ARCH_TOP = G + 13.5, ARCH_LO = G + 1.0
for (const cx of [-20, 0, 20]) {
  const s = sOf(cx), r = ARCH_W / 2, zs = ARCH_TOP - r
  arch(win, front[0], front[1], s - r, s + r, ARCH_LO, ARCH_TOP, 0.05, 10)
  archivolt(trim, front[0], front[1], s, r, zs, 0.7, 0.4, 10)
  // jambs of the frame
  for (const e of [-1, 1]) {
    const s0 = e < 0 ? s - r - 0.7 : s + r, s1 = e < 0 ? s - r : s + r + 0.7
    const { P } = onWallFront()
    trim.quad(P(s0, ARCH_LO, 0.4), P(s1, ARCH_LO, 0.4), P(s1, zs, 0.4), P(s0, zs, 0.4))
    const se = e < 0 ? s0 : s1
    if (e < 0) trim.quad(P(se, ARCH_LO, 0), P(se, ARCH_LO, 0.4), P(se, zs, 0.4), P(se, zs, 0))
    else trim.quad(P(se, ARCH_LO, 0.4), P(se, ARCH_LO, 0), P(se, zs, 0), P(se, zs, 0.4))
  }
  // glazing bars: two mullions, transoms at a third and two thirds, and at the springing
  for (const m of [-1, 1]) panel(trim, front[0], front[1], s + m * 1.07 - 0.1, s + m * 1.07 + 0.1, ARCH_LO, zs + Math.sqrt(r * r - 1.07 * 1.07) - 0.05, 0.09)
  for (const z of [ARCH_LO + 3.2, ARCH_LO + 6.5, zs]) panel(trim, front[0], front[1], s - r + 0.02, s + r - 0.02, z - 0.1, z + 0.1, 0.09)
}
function onWallFront() {
  const [a, b] = front
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, o = 0): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  return { L, P }
}
// four small arched windows between the column pairs
for (const cx of [-30, -10, 10, 30]) {
  const s = sOf(cx)
  arch(win, front[0], front[1], s - 1.3, s + 1.3, ARCH_LO, G + 7.2, 0.05, 8)
}
// eight column pairs, each on a pedestal under a break in the entablature
const PAIRS: [number, number][] = [[-35.1, 1.75], [-26.3, 1.15], [-14.1, 1.15], [-6.0, 1.15], [6.0, 1.15], [14.1, 1.15], [26.3, 1.15], [35.1, 1.75]]
const COL_R = 0.75, COL_Y = FY + 0.6
for (const [cx, half] of PAIRS) {
  const x0 = cx - half - 0.95, x1 = cx + half + 0.95
  box(stone, stone, rect(x0, FY - 0.2, x1, FY + 1.45), 0, G + 1.0, 0.15) // pedestal
  box(trim, trim, rect(x0, FY - 0.2, x1, FY + 1.6), G + 12.0, G + 15.1, 0.0) // entablature break
  for (const e of [-1, 1]) {
    const x = cx + e * half
    lathe(trim, x, COL_Y, [[COL_R + 0.12, G + 1.0], [COL_R, G + 1.6], [COL_R * 0.9, G + 11.4], [COL_R + 0.22, G + 12.0]], 8)
  }
}
// entrance: canopy over the doors of the centre arch
box(trim, trim, rect(-4.4, FY, 4.4, FY + 2.9), G + 2.6, G + 3.15)
panel(trim, front[0], front[1], sOf(2.6), sOf(-2.6), G, G + 2.6, 0.07)

// three pediments over the arches, their gables running back into the roof
for (const cx of [-20, 0, 20]) {
  const hw = 8.85, zb = ENT, za = G + 19.8, yf = FY + 0.9, yb = 38.0, ov = 0.6, t = 0.7
  // tympanum
  stone.tri([cx - hw, yf, zb], [cx, yf, za], [cx + hw, yf, zb])
  // sloped roofs with an overhang at the front
  const kz = (za - zb) / hw
  const L: V3 = [cx - hw - ov, yf + ov, zb - ov * kz], R: V3 = [cx + hw + ov, yf + ov, zb - ov * kz], A: V3 = [cx, yf + ov, za + 0.35]
  const Lb: V3 = [cx - hw - ov, yb, zb - ov * kz], Rb: V3 = [cx + hw + ov, yb, zb - ov * kz], Ab: V3 = [cx, yb, za + 0.35]
  roof.quad(Lb, Ab, A, L)
  roof.quad(Ab, Rb, R, A)
  // raking cornice: the fascia under the front edge of each slope, and the soffit
  const dn = (p: V3): V3 => [p[0], p[1], p[2] - t]
  trim.quad(L, A, dn(A), dn(L))
  trim.quad(A, R, dn(R), dn(A))
  const back = (p: V3): V3 => [p[0], yf, p[2]]
  trim.quad(back(dn(A)), back(dn(L)), dn(L), dn(A))
  trim.quad(back(dn(R)), back(dn(A)), dn(A), dn(R))
}

// ---------------------------------------------------------------------------
// write

function shift(p: Part) {
  for (let i = 0; i < p.pos.length; i += 3) p.pos[i] += XC
}
const floodFront = (p: V3, n: V3) => {
  // the restored front is uplit; the tower's crown cornice and arcade too
  if (p[2] > 60) return n[2] > 0.7 ? 0.15 : 0.6
  if (p[1] > FY - 1 && n[1] > 0.3 && p[2] < 24) return 0.9
  if (n[2] > 0.7) return 0.05
  return 0.15
}
const parts = [
  { part: brick, material: { ...finish('mcs-brick', 0xd5c7ab), floodlight: (p: V3, n: V3) => (p[2] > 60 ? 0.45 : 0.08) } },
  { part: stone, material: { ...finish('mcs-stone', 0xc2bdb3), floodlight: floodFront } },
  { part: roof, material: finish('mcs-roof', 0x988b83) },
  { part: win, material: PALETTE.window },
  { part: glass, material: finish('glass', 0x8ea6b4, 0.24) },
  { part: trim, material: { ...finish('mcs-trim', 0xe6e1d6), floodlight: floodFront } },
]
for (const { part } of parts) shift(part)
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb('Michigan Central Station', parts.filter((x) => x.part.triangles > 0), {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 17, osm: 'way/805151309', height: 76.6,
})
if (triangles > 6500 || glb.length > 250_000) throw new Error(`budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/det-michigan-central.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
