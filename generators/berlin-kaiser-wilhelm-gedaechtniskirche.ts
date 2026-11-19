/**
 * Kaiser-Wilhelm-Gedächtniskirche, Breitscheidplatz, Berlin: the ruined
 * west tower of Franz Schwechten's church (1891-1895, bombed 1943) and Egon
 * Eiermann's new church (1959-1963): the octagonal church, the hexagonal
 * bell tower, the foyer and the chapel. Procedural, CC0-1.0, no textures.
 * bun generators/berlin-kaiser-wilhelm-gedaechtniskirche.ts
 *
 * Writes models/berlin-kaiser-wilhelm-gedaechtniskirche.glb (low) and
 * models/berlin-kaiser-wilhelm-gedaechtniskirche.detail.glb (detail).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 8.8 (the
 * ruin's walls and the Eiermann buildings in OSM all run at 8.8 / 98.8
 * degrees): model +y is compass 8.8, so the site's long axis is model x
 * (the new church to the west, the bell tower and chapel to the east).
 * Anchor: the area centroid of the ruin's outline way/15218373, lng
 * 13.335191, lat 52.504780. z = 0 is the street level of the
 * Breitscheidplatz; Eiermann's buildings stand on the 1.5 m plateau
 * (OSM min_height 1.5), drawn here as their plinths.
 *
 * What makes it the Gedächtniskirche, and how each is drawn
 * - The "hollow tooth": the ruined main tower in buff sandstone blackened
 *   by fire, square below and octagonal above, with its clocks, the corner
 *   turrets with small copper pyramids at the chamfers, the dwarf gallery,
 *   the belfry with its tall paired openings and the four gables, and over
 *   them the remains of the copper helm: eight corner ribs broken off at
 *   different heights and the dark green skin between them torn to a ragged
 *   edge (two faces torn open), highest on the west (71 m), lowest on the
 *   east (60 m). The stone is drawn soot-dark grey-brown, the belfry's
 *   large arched openings darker still.
 * - The two smaller west towers: the south-west one with its stone spire
 *   intact, the north-west one broken off; the west gable over the porch;
 *   the lower mass of the old entrance hall with its great round arches.
 * - Eiermann's octagonal church and hexagonal bell tower in his dark grey
 *   concrete honeycomb with small dark-blue glass cells: the grid is real 3D
 *   (broad bars standing proud of the glass), the glass glows blue at night; the dark
 *   fascia band on top; the gilt sphere and cross on the bell tower.
 * - The low foyer (west) and chapel (east) in the same grid.
 *
 * Evidence
 * - OSM (ODbL): way/15218373 (the ruin, height 71, wikidata via the church)
 *   and its parts: way/363536724 (lower mass to 20 m), way/363921743
 *   (square tower 20-32), way/364107735 (octagon 32-56), way/1558343979-82
 *   (belfry gables 56-59), the spire's broken shell way/1558343975-78,
 *   /83-86 (skillion tops 60-71 m), way/364107732 (the west gable, 31.5),
 *   way/364107729 (north gable), the west turrets way/363921737 and
 *   way/363921738 with their tops (way/363921739, way/1558334819-26: the
 *   north-west stump to 38; way/1558143927-32: the south-west spire to 46),
 *   the north stair tower way/363536722 (12 m, cone), the south pavilions
 *   way/363536723, way/367253676, way/367253679, way/367253681; the new
 *   church way/15218371 (height 22, min 1.5), the bell tower way/15218372
 *   (53.5), the foyer way/15218374 (4.5) with way/363567499, way/363567500,
 *   way/70380143, the chapel way/15218375 (5), the canopies way/363924687
 *   and way/1557865157.
 * - Published (de/en.wikipedia "Kaiser-Wilhelm-Gedächtniskirche"): the
 *   ruin of the main tower 71 m (originally 113 m); the new church
 *   octagonal, 35 m across and 20.5 m high, its walls a concrete honeycomb
 *   with 21,292 glass inlays (Gabriel Loire), mainly blue; the bell tower
 *   hexagonal, 12 m across, 53.5 m high, flat roofed, with a pole, gilded
 *   sphere and cross; all on a plateau 100 x 40 m.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "20220812 Kaiser-Wilhelm-Gedächtniskirche.jpg", Flocci Nivis, CC BY 4.0
 *     (from the east along the Tauentzienstrasse: the ruin, the spire of
 *     the south-west turret, the church's grid, colours)
 *     https://commons.wikimedia.org/wiki/File:20220812_Kaiser-Wilhelm-Ged%C3%A4chtniskirche.jpg
 *   "Top view of Kaiser Wilhelm Memorial Church 2014-07-12.jpg" and "Tower
 *     of Kaiser Wilhelm Memorial Church 2014-07-12.jpg", Slaunger,
 *     CC BY-SA 4.0 (the belfry, gables, the broken copper spire's stepped
 *     top, clock, corner pyramids, dwarf gallery)
 *     https://commons.wikimedia.org/wiki/File:Top_view_of_Kaiser_Wilhelm_Memorial_Church_2014-07-12.jpg
 *     https://commons.wikimedia.org/wiki/File:Tower_of_Kaiser_Wilhelm_Memorial_Church_2014-07-12.jpg
 *   "Exterior of Kaiser-Wilhelm-Gedächtniskirche, 2024 (01).jpg", Bahnfrend,
 *     CC BY-SA 4.0 (the ruin's lower arches and the turret spire; the bell
 *     tower in scaffolding)
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_Kaiser-Wilhelm-Ged%C3%A4chtniskirche,_2024_(01).jpg
 *   "Exterior of Kaiser-Wilhelm-Gedächtniskirche, Berlin 01.jpg", John
 *     Samuel, CC BY-SA 4.0 (the church's grid by day, the dark fascia)
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_Kaiser-Wilhelm-Ged%C3%A4chtniskirche,_Berlin_01.jpg
 *   "Kaiser Wilhelm Memorial Church 2015.jpg", Perituss, CC0 (night: the
 *     blue glass walls, the floodlit ruin; the grid's panel rhythm)
 *     https://commons.wikimedia.org/wiki/File:Kaiser_Wilhelm_Memorial_Church_2015.jpg
 *   "Kaiser-Wilhelm-Gedächtniskirche-Bei-Nacht-2026.jpg", Tuxyso,
 *     CC BY-SA 4.0 (night).
 * - Heights from OSM and the published figures; the tower's stages (clock
 *   at 36, dwarf gallery 41-44, belfry openings 45.5-54) from the Slaunger
 *   and Bahnfrend photos against the 56 m octagon top.
 * - Estimated: the grid's panel size (about 2.9 m, five panels to a face
 *   of the church) from the night photo; the lower mass's arches.
 * - Invented/simplified: the stonework's carving; the porch's interior.
 * - Look-only references: none.
 * - Doubts: the chapel and foyer are not in any photo used (drawn from OSM
 *   with the church's grid); the ruin's north side is drawn like the south.
 *
 * Night: the ruin is floodlit (`_FLOODLIGHT`); the church's and tower's
 * glass glows its own blue (`neon-kwg-glass`).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, tf, cylinder } from './dc-white-house'
import { faceOf, fpanel, fblock, type Face } from './london-british-museum'
import { wallsPoly, capPoly, type XY } from './dc-national-cathedral'
import { ellipsoid, tube, TAU } from './nyc-columbus-monument'
import { lathe as rev } from './berlin-fernsehturm'
import { welded } from './berlin-kit'
import { mat } from './berlin-konzerthaus'
import { roundWin } from './berlin-franzoesischer-dom'

export const ID = 'berlin-kaiser-wilhelm-gedaechtniskirche'
export const BEARING = 8.8

type Parts = { stone: Part; dark: Part; copper: Part; gilt: Part; concrete: Part; glass: Part }

/** Regular polygon ring (CCW), n sides, circumradius R, first vertex at angle a0. */
const poly = (c: XY, R: number, n: number, a0: number): XY[] => Array.from({ length: n }, (_, i): XY => [c[0] + R * Math.cos(a0 + (i * TAU) / n), c[1] + R * Math.sin(a0 + (i * TAU) / n)])

/** A round-headed opening (flat panel plus half-disc) on a face. */
function arch(p: Part, f: Face, s: number, w: number, z0: number, zs: number, n = 6, d = 0.06) {
  fpanel(p, f, s - w / 2, s + w / 2, z0, zs, d)
  const c: V3 = [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, zs]
  const P = (a: number): V3 => [c[0] + f.u[0] * (w / 2) * Math.cos(a), c[1] + f.u[1] * (w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)]
  for (let i = 0; i < n; i++) tf(p, c, P((i * Math.PI) / n), P(((i + 1) * Math.PI) / n), [f.n[0], f.n[1], 0])
}

/**
 * Eiermann's grid wall on one face (a to b, outward to the right): the
 * glass set back, and the concrete frame of big panels (`pitch`) standing
 * proud as real bars, with a finer cross-grid in the detail model.
 */
/** A grid bar proud of a face: its front and the two long sides only (the ends are hidden in the crossing bars). */
function bar(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, vertical: boolean) {
  const pt = (s: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z]
  qf(p, pt(s0, z0, d1), pt(s1, z0, d1), pt(s1, z1, d1), pt(s0, z1, d1), [f.n[0], f.n[1], 0])
  if (vertical) {
    qf(p, pt(s0, z0, d0), pt(s0, z0, d1), pt(s0, z1, d1), pt(s0, z1, d0), [-f.u[0], -f.u[1], 0])
    qf(p, pt(s1, z0, d0), pt(s1, z0, d1), pt(s1, z1, d1), pt(s1, z1, d0), [f.u[0], f.u[1], 0])
  } else {
    qf(p, pt(s0, z1, d0), pt(s1, z1, d0), pt(s1, z1, d1), pt(s0, z1, d1), [0, 0, 1])
    qf(p, pt(s0, z0, d0), pt(s1, z0, d0), pt(s1, z0, d1), pt(s0, z0, d1), [0, 0, -1])
  }
}

function gridWall(P: Parts, a: XY, b: XY, z0: number, z1: number, pitch: number, hi: boolean, fine = 3) {
  const f = faceOf(a, b)
  // Glass plane, set back 0.25 m from the face of the frame.
  fpanel(P.glass, f, 0, f.len, z0, z1, -0.25)
  const nc = Math.max(1, Math.round(f.len / pitch)), nr = Math.max(1, Math.round((z1 - z0) / pitch))
  const du = f.len / nc, dz = (z1 - z0) / nr, w = 0.75
  for (let i = 0; i <= nc; i++) {
    const s = i * du
    bar(P.concrete, f, Math.max(0, s - w / 2), Math.min(f.len, s + w / 2), z0, z1, -0.25, 0.12, true)
  }
  for (let j = 0; j <= nr; j++) {
    const z = z0 + j * dz
    bar(P.concrete, f, 0, f.len, Math.max(z0, z - w / 2), Math.min(z1, z + w / 2), -0.25, 0.12, false)
  }
  if (hi && fine > 1) {
    // The finer honeycomb: thinner bars, less proud.
    const t = 0.1
    for (let i = 0; i < nc * fine; i++) {
      if (i % fine === 0) continue
      const s = (i * du) / fine
      fblock(P.concrete, f, s - t / 2, s + t / 2, z0, z1, -0.25, -0.05)
    }
    for (let j = 0; j < nr * fine; j++) {
      if (j % fine === 0) continue
      const z = z0 + (j * dz) / fine
      fblock(P.concrete, f, 0, f.len, z - t / 2, z + t / 2, -0.25, -0.05, true)
    }
  }
}

/** A prism of Eiermann's grid over a convex ring: plinth, grid walls, dark fascia and roof. */
function gridPrism(P: Parts, ring: XY[], zTop: number, pitch: number, hi: boolean, o: { plinth?: number; fascia?: number } = {}) {
  const zp = o.plinth ?? 1.5, zf = o.fascia ?? 1.1
  const R = [...ring]
  // Plinth (the plateau's edge under the building), solid concrete.
  wallsPoly(P.concrete, R, 0, zp)
  // A low solid band, the grid, the fascia.
  for (let i = 0; i < R.length; i++) {
    // The ring runs counter-clockwise: faceOf's outward side is to the right.
    gridWall(P, R[i], R[(i + 1) % R.length], zp, zTop - zf, pitch, hi)
  }
  // Corner posts (the frame's edges), proud.
  for (const [x, y] of R) cbox(P.concrete, rect(x - 0.25, x + 0.25, y - 0.25, y + 0.25), zp, zTop - zf, { top: false })
  wallsPoly(P.dark, R, zTop - zf, zTop)
  capPoly(P.dark, R, zTop, true)
}

/**
 * The broken spire: an open octagonal shell from z0, tapering, its top
 * broken off in steps, highest towards -x. `top(a)` gives the break height
 * at angle a.
 */
function brokenSpire(p: Part, c: XY, ap0: number, ap1: number, z0: number, zMax: number, top: (a: number) => number, segs: number) {
  const R = (z: number) => ap0 + ((ap1 - ap0) * (z - z0)) / (zMax - z0)
  const t = 0.5
  // Each segment is a slab of the octagon's surface (sampled as a circle of
  // octagon radius) from z0 to its own break height.
  const oct = (a: number, r: number) => r / Math.cos(((a % (TAU / 8)) + TAU / 8) % (TAU / 8) - TAU / 16)
  const P = (a: number, z: number, dr: number): V3 => { const r = oct(a, R(z) - dr); return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z] }
  const hs: number[] = []
  for (let i = 0; i < segs; i++) hs.push(top(((i + 0.5) * TAU) / segs))
  for (let i = 0; i < segs; i++) {
    const a0 = (i * TAU) / segs + TAU / 16, a1 = ((i + 1) * TAU) / segs + TAU / 16, h = hs[i]
    const am = (a0 + a1) / 2, out: V3 = [Math.cos(am), Math.sin(am), 0.15]
    qf(p, P(a0, z0, 0), P(a1, z0, 0), P(a1, h, 0), P(a0, h, 0), out)
    qf(p, P(a0, z0, t), P(a1, z0, t), P(a1, h, t), P(a0, h, t), [-out[0], -out[1], 0])
    qf(p, P(a0, h, 0), P(a1, h, 0), P(a1, h, t), P(a0, h, t), [0, 0, 1])
    // Step face to the next segment where it is lower.
    const hn = hs[(i + 1) % segs]
    if (Math.abs(hn - h) > 0.05) {
      const lo = Math.min(h, hn), hiz = Math.max(h, hn)
      const nrm: V3 = h > hn ? [-Math.sin(a1), Math.cos(a1), 0] : [Math.sin(a1), -Math.cos(a1), 0]
      qf(p, P(a1, lo, 0), P(a1, lo, t), P(a1, hiz, t), P(a1, hiz, 0), nrm)
    }
  }
}


/** Deterministic jitter in [0, 1). */
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x) }

/**
 * The broken helm over the belfry: an octagon of apothem ap0 at z0 tapering
 * to ap1 at 71 m, its eight corner ribs broken off at different heights and
 * the skin between them ending in a ragged edge, lower than the ribs, with
 * two faces torn open. Highest to the west (-x), lowest to the east.
 */
function brokenHelm(p: Part, c: XY, ap0: number, ap1: number, z0: number, hi: boolean) {
  const ZT = 71.0
  const R = (z: number) => (ap0 + ((ap1 - ap0) * (z - z0)) / (ZT - z0)) / Math.cos(TAU / 16)
  const corner = (k: number) => TAU / 16 + (k * TAU) / 8
  const P = (a: number, z: number, dr = 0): V3 => [c[0] + (R(z) - dr) * Math.cos(a), c[1] + (R(z) - dr) * Math.sin(a), z]
  const level = (a: number) => 64.0 + 6.5 * Math.cos(a - Math.PI) // west high
  // Corner ribs.
  const ribH: number[] = []
  for (let k = 0; k < 8; k++) {
    const a = corner(k), h = Math.min(ZT, level(a) + 0.5 + 2.0 * rnd(k))
    ribH.push(h)
    tube(p, [P(a, z0, 0.15), P(a, (z0 + h) / 2, 0.15), P(a, h, 0.15)], [0.32, 0.28, 0.22], hi ? 6 : 4)
  }
  // Skin panels: ragged tops; two faces torn open down to a low edge.
  const n = hi ? 6 : 3, t = 0.35
  for (let k = 0; k < 8; k++) {
    const a0 = corner(k), a1 = corner(k + 1), torn = k === 0 || k === 6
    const tops: number[] = []
    for (let j = 0; j <= n; j++) {
      const f = j / n, edge = j === 0 ? ribH[k] : j === n ? ribH[(k + 1) % 8] : 0
      const base = level(a0 + (a1 - a0) * f) - (torn ? 4.5 : 0.8)
      tops.push(edge ? Math.min(edge - 0.4, base + 1.5) : base - 2.2 * rnd(k * 10 + j) + (j % 2 ? 1.0 : 0))
    }
    for (let j = 0; j < n; j++) {
      const aa = a0 + ((a1 - a0) * j) / n, ab = a0 + ((a1 - a0) * (j + 1)) / n, am = (aa + ab) / 2
      const out: V3 = [Math.cos(am), Math.sin(am), 0.12], inn: V3 = [-out[0], -out[1], 0]
      // Outer skin, inner skin, and the torn edge between them.
      qf(p, P(aa, z0), P(ab, z0), P(ab, tops[j + 1]), P(aa, tops[j]), out)
      qf(p, P(aa, z0, t), P(ab, z0, t), P(ab, tops[j + 1], t), P(aa, tops[j], t), inn)
      qf(p, P(aa, tops[j]), P(ab, tops[j + 1]), P(ab, tops[j + 1], t), P(aa, tops[j], t), [0, 0, 1])
    }
    // Horizontal seams (standing bands) on the skin, detail only.
    if (hi) for (const z of [60.5, 64.5]) {
      const zz = Math.min(z, Math.min(...tops) - 0.3)
      if (zz < z0 + 1) continue
      qf(p, P(a0, zz, -0.08), P(a1, zz, -0.08), P(a1, zz + 0.25, -0.08), P(a0, zz + 0.25, -0.08), [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
    }
  }
}

function build(hi: boolean) {
  const P: Parts = { stone: new Part(), dark: new Part(), copper: new Part(), gilt: new Part(), concrete: new Part(), glass: new Part() }
  const { stone, dark, copper, gilt } = P
  // ===== The ruin ===========================================================
  const TC: XY = [1.1, 0.45] // the main tower's centre
  // Lower mass (the old entrance hall) to 20 m, buff sandstone with its
  // cornice; great round arches on the north and south (now glazed) and
  // the west portal.
  const LM = rect(-8.6, 8.7, -10.9, 11.2)
  cbox(stone, LM, 0, 19.2, { top: false })
  cbox(dark, rect(LM.x0 - 0.3, LM.x1 + 0.3, LM.y0 - 0.3, LM.y1 + 0.3), 19.2, 20.0, { top: stone, bottom: true })
  for (const [a, b] of [[[LM.x0, LM.y0], [LM.x1, LM.y0]], [[LM.x1, LM.y1], [LM.x0, LM.y1]]] as [XY, XY][]) {
    const f = faceOf(a, b)
    arch(dark, f, f.len * 0.3, 5.2, 1.0, 9.5, hi ? 10 : 6)
    arch(dark, f, f.len * 0.72, 4.2, 1.0, 8.0, hi ? 10 : 6)
    for (const s of [f.len * 0.3, f.len * 0.72]) roundWin(dark, f, s, 15.0, 1.1, hi ? 10 : 6)
  }
  const fe = faceOf([LM.x1, LM.y0], [LM.x1, LM.y1])
  for (const s of [5.0, 11.0, 17.0]) arch(dark, fe, s, 3.2, 2.0, 12.0, hi ? 10 : 6)
  // West front: the porch with its portal under the great gable (to 31.5).
  const WF = rect(-9.3, -6.5, -7.1, 8.0)
  cbox(stone, WF, 0, 24.5, { top: false })
  const fw = faceOf([WF.x0, WF.y1], [WF.x0, WF.y0])
  arch(dark, fw, fw.len / 2, 5.0, 0.0, 6.5, hi ? 10 : 6)
  roundWin(dark, fw, fw.len / 2, 16.5, 3.2, hi ? 16 : 8)
  for (const s of [2.8, fw.len - 2.8]) arch(dark, fw, s, 1.4, 9.0, 12.0, 4)
  tf(stone, [WF.x0, WF.y0, 24.5], [WF.x0, WF.y1, 24.5], [WF.x0, (WF.y0 + WF.y1) / 2, 31.5], [-1, 0, 0])
  qf(copper, [WF.x0 - 0.2, WF.y0 - 0.2, 24.5], [WF.x1, WF.y0 - 0.2, 24.5], [WF.x1, (WF.y0 + WF.y1) / 2, 31.6], [WF.x0 - 0.2, (WF.y0 + WF.y1) / 2, 31.6], [0, -1, 1])
  qf(copper, [WF.x0 - 0.2, WF.y1 + 0.2, 24.5], [WF.x1, WF.y1 + 0.2, 24.5], [WF.x1, (WF.y0 + WF.y1) / 2, 31.6], [WF.x0 - 0.2, (WF.y0 + WF.y1) / 2, 31.6], [0, 1, 1])
  // North gable (way/364107729) and the north stair tower with its cone.
  cbox(stone, rect(-3.8, 6.5, 11.2, 14.0), 19.0, 24.0, { top: false })
  tf(stone, [-3.8, 14.0, 24.0], [6.5, 14.0, 24.0], [1.35, 14.0, 29.7], [0, 1, 0])
  qf(copper, [-3.8, 11.2, 24.0], [-3.8, 14.2, 24.0], [1.35, 14.2, 29.8], [1.35, 11.2, 29.8], [-1, 0, 1])
  qf(copper, [6.5, 11.2, 24.0], [6.5, 14.2, 24.0], [1.35, 14.2, 29.8], [1.35, 11.2, 29.8], [1, 0, 1])
  rev([[4.6, 0], [4.6, 11.0], [4.9, 11.0], [0, 14.5]], (b) => (b < 1 ? stone : copper), hi ? 20 : 10, 30, [1.2, 13.8])
  // The south pavilion (glazed, low).
  rev([[4.1, 0], [4.1, 4.0], [0, 4.4]], (b) => (b < 1 ? P.glass : dark), hi ? 16 : 8, 30, [0.7, -14.0])
  // The two west turrets: square to 31, octagonal belfry stage, the south
  // one under its stone spire (to 46), the north one broken off at 38.
  for (const [r, spire] of [[rect(-9.3, -4.0, -12.5, -7.1), true], [rect(-9.1, -3.8, 8.0, 13.3), false]] as [ReturnType<typeof rect>, boolean][]) {
    const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2
    cbox(stone, r, 0, 31.0, { top: false })
    cbox(dark, rect(r.x0 - 0.2, r.x1 + 0.2, r.y0 - 0.2, r.y1 + 0.2), 30.5, 31.2, { top: dark, bottom: true })
    const oct = poly([cx, cy], 2.6, 8, TAU / 16)
    wallsPoly(dark, oct, 31.2, spire ? 37.0 : 37.6)
    for (let i = 0; i < 8; i += 2) {
      const f = faceOf(oct[i], oct[(i + 1) % 8])
      arch(stone, f, f.len / 2, 0.9, 32.5, 35.6, 4, 0.05)
    }
    if (spire) {
      rev([[2.6, 37.0], [2.75, 37.4], [0.0, 47.5]], () => dark, 8, 10, [cx, cy], TAU / 16)
      tube(gilt, [[cx, cy, 47.5], [cx, cy, 49.3]], [0.08, 0.06], 4)
      cbox(gilt, rect(cx - 0.45, cx + 0.45, cy - 0.06, cy + 0.06), 48.5, 48.7)
      // Little gables round the spire's foot.
      for (let i = 0; i < 8; i += 2) {
        const a = TAU / 16 + ((i + 0.5) * TAU) / 8, rr = 2.45
        const m: XY = [cx + rr * Math.cos(a), cy + rr * Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
        tf(dark, [m[0] - t[0], m[1] - t[1], 37.0], [m[0] + t[0], m[1] + t[1], 37.0], [m[0], m[1], 39.2], [Math.cos(a), Math.sin(a), 0.2])
      }
    } else capPoly(dark, oct, 37.6, true)
  }
  // Main tower: the square stage 20-32.
  const SQ = rect(-6.5, 8.7, -7.1, 8.0)
  cbox(stone, SQ, 19.0, 32.0, { top: false })
  cbox(dark, rect(SQ.x0 - 0.25, SQ.x1 + 0.25, SQ.y0 - 0.25, SQ.y1 + 0.25), 31.4, 32.2, { top: stone, bottom: true })
  for (const [a, b] of [[[SQ.x0, SQ.y0], [SQ.x1, SQ.y0]], [[SQ.x1, SQ.y0], [SQ.x1, SQ.y1]], [[SQ.x1, SQ.y1], [SQ.x0, SQ.y1]], [[SQ.x0, SQ.y1], [SQ.x0, SQ.y0]]] as [XY, XY][]) {
    const f = faceOf(a, b)
    // A row of small arched windows (the arcade band) and two tall lights.
    for (let i = 0; i < 6; i++) arch(dark, f, 2.0 + (i * (f.len - 4.0)) / 5, 0.8, 27.6, 29.8, 4)
    for (const s of [f.len * 0.35, f.len * 0.65]) arch(dark, f, s, 1.3, 21.5, 25.0, 4)
  }
  // Octagonal stage 32-56.
  const ap = 7.6
  const O8 = poly(TC, ap / Math.cos(TAU / 16), 8, TAU / 16) // flat faces towards +-x, +-y
  wallsPoly(stone, O8, 32.0, 45.0)
  wallsPoly(stone, O8, 45.0, 56.0)
  const octGrown = poly(TC, (ap + 0.35) / Math.cos(TAU / 16), 8, TAU / 16)
  wallsPoly(dark, octGrown, 40.4, 41.0); capPoly(dark, octGrown, 40.4, false)
  wallsPoly(dark, octGrown, 44.5, 45.3); capPoly(dark, octGrown, 44.5, false); capPoly(stone, octGrown, 45.3, true)
  for (let i = 0; i < 8; i++) {
    const f = faceOf(O8[i], O8[(i + 1) % 8])
    const main = i % 2 === 0
    // Dwarf gallery: a row of small arches.
    for (let k = 0; k < 4; k++) arch(dark, f, 0.9 + (k * (f.len - 1.8)) / 3, 0.75, 41.3, 43.6, 4, 0.06)
    // Belfry openings: two tall lights on the main faces, one on the diagonals.
    if (main) for (const s of [f.len * 0.3, f.len * 0.7]) {
      arch(dark, f, s, 1.7, 46.2, 52.2, hi ? 8 : 4, 0.05)
      if (hi) for (const ds of [-0.3, 0.3]) fblock(stone, f, s + ds - 0.1, s + ds + 0.1, 46.4, 52.2, 0.0, 0.2)
      if (hi) roundWin(dark, f, f.len / 2, 54.0, 0.9, 8, 0.05)
    } else arch(dark, f, f.len / 2, 1.5, 46.4, 51.8, hi ? 8 : 4, 0.05)
    // Clock faces on the main faces (gilt ring and dial).
    if (main) {
      const cz = 36.0, rc = 2.0, m = hi ? 24 : 10
      const ring: V3[] = Array.from({ length: m + 1 }, (_, k): V3 => [f.o[0] + f.u[0] * (f.len / 2 + rc * Math.cos((k * TAU) / m)) + f.n[0] * 0.15, f.o[1] + f.u[1] * (f.len / 2 + rc * Math.cos((k * TAU) / m)) + f.n[1] * 0.15, cz + rc * Math.sin((k * TAU) / m)])
      tube(gilt, ring, ring.map(() => 0.2), hi ? 5 : 3)
      roundWin(dark, f, f.len / 2, cz, rc - 0.15, hi ? 16 : 8, 0.08)
      if (hi) {
        tube(gilt, [[ring[0][0] - f.u[0] * rc + f.n[0] * 0.05, ring[0][1] - f.u[1] * rc + f.n[1] * 0.05, cz], [ring[0][0] - f.u[0] * rc + f.n[0] * 0.05 + f.u[0] * 0.9, ring[0][1] - f.u[1] * rc + f.n[1] * 0.05 + f.u[1] * 0.9, cz + 0.8]], [0.07, 0.05], 3)
        tube(gilt, [[ring[0][0] - f.u[0] * rc + f.n[0] * 0.05, ring[0][1] - f.u[1] * rc + f.n[1] * 0.05, cz], [ring[0][0] - f.u[0] * rc + f.n[0] * 0.05 - f.u[0] * 0.2, ring[0][1] - f.u[1] * rc + f.n[1] * 0.05 - f.u[1] * 0.2, cz + 1.4]], [0.07, 0.04], 3)
      }
    }
    // The belfry gables over the main faces.
    if (main) {
      const g0: V3 = [f.o[0] + f.n[0] * 0.05, f.o[1] + f.n[1] * 0.05, 56.0], g1: V3 = [f.o[0] + f.u[0] * f.len + f.n[0] * 0.05, f.o[1] + f.u[1] * f.len + f.n[1] * 0.05, 56.0]
      const gm: V3 = [(g0[0] + g1[0]) / 2, (g0[1] + g1[1]) / 2, 60.2]
      tf(dark, g0, g1, gm, [f.n[0], f.n[1], 0])
      roundWin(stone, f, f.len / 2, 57.6, 1.0, hi ? 8 : 5, 0.1)
    }
  }
  // Corner turrets at the chamfers, with small copper pyramids (brownish in reality).
  for (let i = 1; i < 8; i += 2) {
    const a = TAU / 16 + (i * TAU) / 8 + TAU / 16, rr = ap / Math.cos(TAU / 16) - 1.0
    const x = TC[0] + rr * Math.cos(a), y = TC[1] + rr * Math.sin(a)
    cbox(stone, rect(x - 1.4, x + 1.4, y - 1.4, y + 1.4), 32.0, 37.8, { top: false })
    rev([[2.0, 37.8], [0.0, 41.6]], () => copper, 4, 10, [x, y], TAU / 8)
  }
  // The broken copper helm: eight corner ribs standing to ragged heights
  // (71 m to the west, 60 to the east) and the copper skin between them torn
  // off irregularly, both faces drawn so it reads open and hollow.
  brokenHelm(copper, TC, ap - 1.1, ap - 2.4, 56.6, hi)
  // The spire's foot behind the gables: a sloped copper apron from the octagon's top.
  rev([[ap / Math.cos(TAU / 16) + 0.1, 56.0], [(ap - 1.1) / Math.cos(TAU / 16), 57.2]], () => copper, 8, 10, TC, TAU / 16)

  // ===== Eiermann's buildings ===============================================
  // The octagonal church (35 m across, 20.5 m over the 1.5 m plateau).
  const CO: XY = [-40.55, 7.95]
  gridPrism(P, poly(CO, 17.5 / Math.cos(TAU / 16), 8, TAU / 16), 22.0, 2.45, hi)
  // The hexagonal bell tower (12 m across, 53.5 m) with the sphere and cross.
  const CT: XY = [24.15, -2.85]
  gridPrism(P, poly(CT, 6.15, 6, Math.PI / 2), 53.5, 2.45, hi, { fascia: 1.6 })
  tube(gilt, [[CT[0], CT[1], 53.5], [CT[0], CT[1], 57.5]], [0.12, 0.1], 4)
  ellipsoid(gilt, [CT[0], CT[1], 56.4], [0.75, 0.75, 0.75], hi ? 12 : 6, hi ? 6 : 3)
  cbox(gilt, rect(CT[0] - 0.12, CT[0] + 0.12, CT[1] - 0.12, CT[1] + 0.12), 57.2, 60.2, { bottom: true })
  cbox(gilt, rect(CT[0] - 0.9, CT[0] + 0.9, CT[1] - 0.12, CT[1] + 0.12), 58.8, 59.1, { bottom: true })
  // Foyer (west) and chapel (east): low, in the same grid.
  gridPrism(P, [[-81.0, 4.75], [-63.4, 4.75], [-63.4, 16.25], [-81.0, 16.25]], 4.5, 2.9, hi, { fascia: 0.6 })
  gridPrism(P, [[29.2, 10.3], [46.1, 10.3], [46.1, 21.7], [29.2, 21.7]], 5.0, 2.9, hi, { fascia: 0.6 })
  // The link from foyer to church, and the canopies.
  cbox(P.concrete, rect(-63.4, -58.1, 9.9, 11.6), 0, 3.0)
  for (const r of [rect(-23.0, -14.0, 4.1, 10.9), rect(15.3, 29.2, 14.2, 17.3)]) {
    const z = r.x0 < 0 ? 4.6 : 2.6
    cbox(P.dark, r, z, z + 0.4, { bottom: true })
    for (const [x, y] of [[r.x0 + 0.4, r.y0 + 0.4], [r.x1 - 0.4, r.y0 + 0.4], [r.x0 + 0.4, r.y1 - 0.4], [r.x1 - 0.4, r.y1 - 0.4]]) cylinder(P.concrete, x, y, 0.15, 0, z, 6)
  }

  // ===== Materials and night ================================================
  const ruinLit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : p[0] > -10 && p[0] < 10 ? 0.9 : 0)
  const W = (p: Part, c = 30) => welded(p, c)
  return [
    { part: W(stone), material: { ...mat('ruin-sandstone', 0x7a6e60), floodlight: ruinLit } },
    { part: W(dark), material: { ...mat('ruin-blackened', 0x46423e), floodlight: ruinLit } },
    { part: W(copper), material: mat('patina', 0x4b6d60, 0.7) },
    { part: W(gilt, 60), material: { ...mat('gilt', 0xd6a83e, 0.4), floodlight: (p: V3) => (p[2] > 30 ? 0.9 : 0) } },
    { part: W(P.concrete), material: mat('eiermann-concrete', 0x5f6264) },
    { part: W(P.glass), material: mat('neon-kwg-glass', 0x34406c, 0.3) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Kaiser-Wilhelm-Gedächtniskirche', wikidata: 'Q153951', bearing: BEARING, osm: 'way/15218373' }
  writeModel('Kaiser-Wilhelm-Gedächtniskirche', ID, build(false), extras, 6500)
  writeModel('Kaiser-Wilhelm-Gedächtniskirche', ID, build(true), extras, 40000, `${ID}.detail`)
}
