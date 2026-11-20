/**
 * First Baptist Church of Raleigh, 99 N. Salisbury Street (1859, Gothic
 * Revival, stuccoed brick), with its attached education buildings:
 * procedural, CC0-1.0.
 * bun generators/ral-first-baptist-church.ts [out.glb]
 *
 * Identity: OSM relation/16629305 (building=yes;church, addr 99 North
 * Salisbury Street, wikidata Q5452427). The lead's relation/14728532 is
 * the OTHER First Baptist Church at 109 S. Wilmington Street (it carries
 * the same wikidata tag by mistake); it is not used.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.4 (every
 * OSM edge runs at 2.4° / 92.4°). Origin: the area centroid of the whole
 * relation (-78.640578, 35.7808597). The relation is one multipolygon of
 * three outers (way/1028706361 the church, way/47759882 the education
 * buildings west and south-west of it, way/674997778 a small block west of
 * those), so the model draws all three: the church in full, the education
 * buildings as plain three-storey masses with a mansard band (ice-storm
 * aerial photo i1, NAIP).
 *
 * Ground: Mapterhorn z13 (z14–15 missing over Raleigh) varies ~1 m over
 * the 86 m footprint; treated as flat, y = 0 at the lowest. Elevation 0.
 *
 * Plan (OSM way/1028706361 in the model frame, NAIP for the parts):
 *  - transept (the main auditorium, gabled N–S): x 6.0 … 21.4, y 9.4 … 34.1;
 *  - nave arm west of it (gabled E–W): x -2.3 … 6.0, y 14.1 … 29.5, axis 21.8;
 *    NAIP's green cross roof gives both arms ~15.5 m wide;
 *  - low flat-roofed annexes in the nave arm's corners (NAIP), and the
 *    notched strip x -5.3 … -2.3 joining the education wing (OSM);
 *  - tower 6.6 m square, x 20.5 … 27.1, centred on the axis, standing on
 *    the raised entrance terrace that OSM's east bump x 23.4 … 30.1,
 *    y 14.25 … 29.6 outlines (photos p1, p2: terrace with railing and
 *    stairs across the Salisbury Street front).
 *
 * Heights (no lidar over Wake County; no published figures found):
 * photo-scaled (estimated) against the 6.6 m tower (OSM bump depth) in i1
 * (drone, little convergence) and p2 (frontal from the east), which agree
 * within ~2 m: terrace 2.2; door 2.2 … 6.6; round window centre 11.2;
 * belfry string course 14.6; belfry openings 15.6 … 20.6; buttresses and
 * gablet bases 21.3, gablet apexes 24.5, corner pinnacles to 25.2; spire
 * base 21.3 (3.7 m across the flats, i1), tip 36.4, finial to 38.1.
 * Walls 10.0, ridges 15.3 (~37°; i1 puts the ridge at the belfry base).
 * Education buildings 3 storeys, walls 11.0, mansard to 13.0 (i1).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/ral/work/ral-first-baptist-church):
 *  p1 "First Baptist Church - N Salisbury St, Raleigh.JPG", Farragutful,
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:First_Baptist_Church_-_N_Salisbury_St,_Raleigh.JPG
 *     — the east front from the south-east: tower, terrace, south transept's east window.
 *  p2 "Raleigh - First Baptist Church.jpg", P. Hughes, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Raleigh_-_First_Baptist_Church.jpg
 *     — the east front, frontal.
 *  p3 "First Baptist Church (White) - Raleigh (14364548998).jpg", Gerry
 *     Dincher, CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:First_Baptist_Church_(White)_-_Raleigh_(14364548998).jpg
 *     — from the south-east: green roof, south flank.
 *  p4 "First Baptist Church at Downtown Raleigh NC - panoramio.jpg",
 *     Chanilim714, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:First_Baptist_Church_at_Downtown_Raleigh_NC_-_panoramio.jpg
 *     — from the north-east: tower, north flank, green roof.
 *  p5 "First Baptist Church (N. Salisbury St.) Raleigh, North Carolina - panoramio.jpg",
 *     Chanilim714, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:First_Baptist_Church_(N._Salisbury_St.)_Raleigh,_North_Carolina_-_panoramio.jpg
 *     — from the south-east across the Capitol grounds.
 *  p6 "Capitol Area Historic District-First Baptist Church2.jpg", 2BKNIGHT,
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Capitol_Area_Historic_District-First_Baptist_Church2.jpg
 *     — from the east, distant: spire proportions.
 *  i1 "First Baptist Church of Raleigh, January 2026 Ice Storm.jpg", Mzedp,
 *     CC0, https://commons.wikimedia.org/wiki/File:First_Baptist_Church_of_Raleigh,_January_2026_Ice_Storm.jpg
 *     — drone from the south-west: the cross roof, south transept gable,
 *     tower with clock face, the education buildings.
 *  d1 "Dei-light - panoramio.jpg", Scott Thompson, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dei-light_-_panoramio.jpg
 *     — night, the north transept gable and the brick annex's stained glass.
 * Aerial: USGS NAIP (public domain): cross plan, green roofs, tower at the
 * east, terrace, education wings with green mansard bands.
 *
 * Left out: the blind arcading beside the belfry openings, the triangular
 * panel under the belfry, the spire's orange slate diamonds, lucarne louvres,
 * the terrace railing and stairs, the modern stained glass in the NW annex
 * (drawn as a window panel), tracery beyond the mullions, the education
 * buildings' window detail and glass entrance bays.
 * Doubts: the west side of the church (the nave arm's west gable and the
 * annexes) is unphotographed: drawn plain. Transept/nave split and annex
 * heights from NAIP only. Window positions on the transept ends from d1
 * and i1 (one big three-light window, two narrow lancets), mirrored.
 * Education buildings: one height for all; their real roofs vary.
 * Colours: stucco 0xe6d8c2 (warm cream, p2 in sun); roof copper (pale
 * green standing seam, p3, p4); spire slate 0x5d6a63 (grey-green, p1, p2).
 * Night: windows lit (d1); no floodlighting evidence.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, ccw, triangulate, capRing, prism, rect, flatShape, extrudeShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, panel, grow } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'

// ============================================================ shared helpers (also used by ral-edenton-street-umc)

/** A pointed (two-centred) arch outline: jambs from z0 to zs, arcs of radius k·w meeting at the apex. */
export function pointedShape(sc: number, w: number, z0: number, zs: number, k = 0.8, segs = 5): XY[] {
  const h = w / 2, R = k * w
  const out: XY[] = [[sc - h, z0], [sc + h, z0]]
  // right flank: centre at (sc + h - R, zs)
  const cR = sc + h - R, aTop = Math.acos((sc - cR) / R)
  for (let i = 0; i <= segs; i++) {
    const a = (aTop * i) / segs
    out.push([cR + R * Math.cos(a), zs + R * Math.sin(a)])
  }
  const cL = sc - h + R
  for (let i = segs - 1; i >= 0; i--) {
    const a = Math.PI - (aTop * i) / segs
    out.push([cL + R * Math.cos(a), zs + R * Math.sin(a)])
  }
  return out
}
export const apexOf = (w: number, zs: number, k = 0.8) => { const R = k * w; return zs + Math.sqrt(R * R - (R - w / 2) * (R - w / 2)) }
/** A pointed window panel, with `lights` lights divided by bars of `bar` in `trim` (flush, stopped under the arch). */
export function lancet(win: Part, trim: Part | null, f: Face, s: number, w: number, z0: number, zs: number, lights = 1, d = 0.06, k = 0.8) {
  flatShape(win, f, pointedShape(s, w, z0, zs, k), d)
  if (!trim || lights < 2) return
  for (let i = 1; i < lights; i++) {
    const x = s - w / 2 + (w * i) / lights
    flatShape(trim, f, [[x - 0.09, z0], [x + 0.09, z0], [x + 0.09, zs + 0.2], [x - 0.09, zs + 0.2]], d + 0.02)
  }
}
/** A band between ring a at za and ring b at zb (same vertex count), facing outward/up. */
export function loft(p: Part, a: XY[], za: number, b: XY[], zb: number) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length
    const e: XY = [a[j][0] - a[i][0], a[j][1] - a[i][1]]
    const L = Math.hypot(e[0], e[1]) || 1
    const out: V3 = [e[1] / L, -e[0] / L, 0.6]
    quadO(p, [a[i][0], a[i][1], za], [a[j][0], a[j][1], za], [b[j][0], b[j][1], zb], [b[i][0], b[i][1], zb], out)
  }
}
/** Faces of a closed ccw ring, one per edge, with origin at the edge start (s runs along the edge). */
export function edgeFaces(r: XY[]): { f: Face; L: number }[] {
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    return { f: { o: [a[0], a[1], 0], n }, L }
  })
}
/** Plain wing windows: bays of grouped panels along every long edge. */
export function wingWindows(win: Part, r: XY[], bands: [number, number][], bay = 3.6, w = 2.2, minL = 6) {
  for (const { f, L } of edgeFaces(r)) {
    if (L < minL) continue
    const n = Math.floor((L - 1.4) / bay)
    if (n < 1) continue
    const s0 = (L - n * bay) / 2 + bay / 2
    for (let k = 0; k < n; k++) for (const [z0, z1] of bands) panel(win, f, s0 + k * bay, w, z0, z1)
  }
}
/** A square pinnacle: shaft side `a` from z0 to z1, pyramid to z2. */
export function pinnacle(p: Part, x: number, y: number, a: number, z0: number, z1: number, z2: number) {
  box(p, x - a / 2, y - a / 2, x + a / 2, y + a / 2, z0, z1, null)
  lathe(p, x, y, [[(a / 2) * Math.SQRT2 * 1.15, z1], [0, z2]], 4, 45, 405)
}

// ============================================================ dimensions
const YC = 21.8 // the church axis (tower centre)
const EAVE = 10.0, RIDGE = 15.3
const LIFT = 0.12 // roofs sit just above the gable walls' slopes (no z-fighting)
const TX0 = 6.0, TX1 = 21.4, TY0 = 9.4, TY1 = 34.1 // transept
const NX0 = -2.3, NHW = 7.7 // nave arm x from NX0 to TX0, half width
const TW0 = 20.5, TW1 = 27.1, TH = 3.3 // tower x range, half width
const TER = 2.2 // terrace top
const BEL0 = 14.6, BEL1 = 21.3, SPIRE = 36.4

// the education buildings (OSM way/47759882, the 0.85 m notch at x -42.9 dropped) and way/674997778
const WING: XY[] = [[-2.35, 13.18], [-21.04, 13.17], [-21.03, 6.36], [-17.85, 6.36], [-17.85, -19.48], [-16.44, -19.47], [-16.44, -27.95], [-19.36, -27.96], [-19.36, -26.65], [-22.69, -26.64], [-22.69, -29.80], [-47.86, -29.80], [-47.86, -21.27], [-45.84, -21.26], [-45.84, -0.85], [-27.06, -0.85], [-27.07, 7.15], [-32.53, 7.14], [-32.53, 10.07], [-46.42, 10.07], [-46.43, 34.22], [-14.02, 34.23], [-14.02, 16.02], [-2.35, 16.02]]
const SMALL: XY[] = [[-47.31, 19.95], [-47.32, 15.60], [-55.81, 15.60], [-55.82, 19.95]]
const WALL = 11.0, MANS = 13.0

function build() {
  const stucco = new Part(), roof = new Part(), slate = new Part(), win = new Part(), door = new Part(), flat = new Part()

  // ============================================================ the church body
  // nave arm (E–W) and the transept (N–S), gabled, walls to y = 0
  prismX(stucco, NX0, TX0 + 1, [[YC - NHW, 0], [YC + NHW, 0], [YC + NHW, EAVE], [YC, RIDGE], [YC - NHW, EAVE]])
  roofX(roof, NX0 - 0.4, TX0 + 2, YC, NHW, EAVE + LIFT, RIDGE + LIFT, 0.4, 0.25)
  const TC = (TX0 + TX1) / 2, THW = (TX1 - TX0) / 2
  prismY(stucco, TY0, TY1, [[TX0, 0], [TX1, 0], [TX1, EAVE], [TC, RIDGE], [TX0, EAVE]])
  roofY(roof, TY0 - 0.4, TY1 + 0.4, TC, THW, EAVE + LIFT, RIDGE + LIFT, 0.4, 0.25)
  // short east arm between the transept and the tower, carrying the nave ridge
  roofX(roof, TX1 - 1, TW0 + 0.6, YC, 3.6, RIDGE + LIFT - 3.6 * (RIDGE - EAVE) / THW, RIDGE + LIFT, 0, 0.25)

  // corner piers of the transept, capped just above the eaves (i1, p1)
  for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX0, TY1], [TX1, TY1]] as XY[]) {
    box(stucco, x - 0.5, y - 0.5, x + 0.5, y + 0.5, 0, EAVE + 1.0, null)
    lathe(stucco, x, y, [[0.85, EAVE + 1.0], [0, EAVE + 2.0]], 4, 45, 405)
  }

  // the annexes in the nave arm's corners, and the strip joining the wing
  box(stucco, NX0, TY0, TX0, YC - NHW, 0, 5.0, flat) // SW annex
  box(stucco, -5.3, YC + NHW, TX0, TY1, 0, 9.0, flat) // NW annex (brick with stained glass, d1)
  box(stucco, -5.3, 27.96, NX0, YC + NHW, 0, 9.0, flat)
  box(stucco, -4.51, 19.09, NX0, 25.33, 0, 6.0, flat)
  box(stucco, -2.35, 13.18, NX0 + 0.05, 16.02, 0, 6.0, flat)

  // ============================================================ windows
  // transept ends (south y = TY0, north y = TY1): a big three-light window, two narrow lancets
  for (const sg of [-1, 1]) {
    const f: Face = sg < 0 ? { o: [TC, TY0, 0], n: [0, -1] } : { o: [TC, TY1, 0], n: [0, 1] }
    lancet(win, stucco, f, 0, 4.0, 3.0, 8.4, 3)
    for (const s of [-4.7, 4.7]) lancet(win, null, f, s, 1.3, 3.2, 8.0)
    // a small round window in the gable
    flatShape(win, f, arc(0, 12.6, 0.9, 0, 360, 12).slice(0, -1), 0.06)
  }
  // transept east walls, either side of the tower: one tall three-light window each (p1, p4)
  for (const y of [13.9, 29.7]) lancet(win, stucco, { o: [TX1, y, 0], n: [1, 0] }, 0, 2.9, 3.0, 8.0, 3)
  // transept west walls above the annexes, and the nave arm's flanks
  for (const y of [13.9, 29.7]) lancet(win, null, { o: [TX0, y, 0], n: [-1, 0] }, 0, 1.6, 5.8, 8.0)
  lancet(win, null, { o: [2.0, YC - NHW, 0], n: [0, -1] }, 0, 1.8, 5.6, 8.4, 2)
  lancet(win, stucco, { o: [-1.0, TY1, 0], n: [0, 1] }, 0, 3.4, 1.0, 7.2, 3) // NW annex's stained glass (d1)
  // nave arm's west gable: a round window
  flatShape(win, { o: [NX0, YC, 0], n: [-1, 0] }, arc(0, 12.0, 1.2, 0, 360, 14).slice(0, -1), 0.06)
  for (const s of [-4, 4]) lancet(win, null, { o: [NX0, YC, 0], n: [-1, 0] }, s, 1.3, 6.4, 8.4)

  // ============================================================ the entrance terrace
  box(stucco, TX1, 14.25, 30.1, 29.6, 0, TER)
  for (const y of [14.25, 29.6]) box(stucco, 29.4, y - 0.35, 30.4, y + 0.35, 0, TER + 1.4, null)

  // ============================================================ the tower
  const ty0 = YC - TH, ty1 = YC + TH, tcx = (TW0 + TW1) / 2
  box(stucco, TW0, ty0, TW1, ty1, 0, BEL1)
  // string course under the belfry
  box(stucco, TW0 - 0.25, ty0 - 0.25, TW1 + 0.25, ty1 + 0.25, BEL0 - 0.5, BEL0, null)
  // angle buttresses at the corners, stepping in once, ending in pinnacles
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = sx < 0 ? TW0 : TW1, cy = sy < 0 ? ty0 : ty1
    box(stucco, cx - 0.65, cy - 0.65, cx + 0.65, cy + 0.65, 0, BEL0 - 0.5, null)
    box(stucco, cx - 0.5, cy - 0.5, cx + 0.5, cy + 0.5, BEL0 - 0.5, BEL1 + 0.3, null)
    pinnacle(stucco, cx, cy, 0.9, BEL1 + 0.3, BEL1 + 1.6, BEL1 + 3.9)
  }
  const faces: Face[] = [
    { o: [TW1, YC, 0], n: [1, 0] },
    { o: [tcx, ty0, 0], n: [0, -1] },
    { o: [tcx, ty1, 0], n: [0, 1] },
    { o: [TW0, YC, 0], n: [-1, 0] },
  ]
  faces.forEach((f, i) => {
    // belfry: a tall louvred lancet
    lancet(slate, null, f, 0, 1.5, BEL0 + 1.0, BEL1 - 1.8, 1, 0.06, 0.75)
    // round window (east: rose; north and south: the clock faces)
    if (i < 3) flatShape(i === 0 ? win : stucco, f, arc(0, 11.2, 1.1, 0, 360, 14).slice(0, -1), 0.06)
    if (i > 0) flatShape(slate, f, arc(0, 11.2, 0.85, 0, 360, 14).slice(0, -1), 0.1)
    // a gablet on each face, its back running into the spire
    extrudeShape(stucco, f, [[-2.3, BEL1], [2.3, BEL1], [0, BEL1 + 3.2]], -1.6, 0.05)
    // the pinnacle on the gablet's apex
    const ax = f.o[0] + f.n[0] * -0.3, ay = f.o[1] + f.n[1] * -0.3
    pinnacle(stucco, ax, ay, 0.5, BEL1 + 2.4, BEL1 + 3.4, BEL1 + 4.6)
  })
  // the door on the east face, at the terrace, in a raised surround
  {
    const f = faces[0]
    extrudeShape(stucco, f, pointedShape(0, 3.0, TER, TER + 3.4, 0.8), 0, 0.25)
    const fp: Face = { o: [TW1 + 0.25, YC, 0], n: [1, 0] }
    flatShape(door, fp, pointedShape(0, 2.2, TER, TER + 3.0, 0.8), 0.05)
    lancet(win, null, f, 0, 1.0, 7.6, 9.2)
  }
  // tall lancets up the north and south faces of the shaft
  for (const f of [faces[1], faces[2]]) lancet(win, null, f, 0, 1.0, 4.2, 7.6)

  // the octagonal slate spire with four small lucarnes and the finial
  {
    const ap = 1.85, R = ap / Math.cos(Math.PI / 8)
    lathe(slate, tcx, YC, [[R, BEL1], [0.18, SPIRE]], 8, 22.5, 382.5)
    for (const f of faces) {
      // lucarne: a small gabled dormer on the cardinal faces (p1, p2)
      const z = 27.6, d = ap * (1 - (z - BEL1) / (SPIRE - BEL1)) // spire apothem there
      const g: Face = { o: [tcx + f.n[0] * (d + 0.15), YC + f.n[1] * (d + 0.15), 0], n: f.n }
      extrudeShape(stucco, g, [[-0.45, z], [0.45, z], [0.45, z + 1.2], [0, z + 1.7], [-0.45, z + 1.2]], -0.9, 0)
      flatShape(slate, g, pointedShape(0, 0.45, z + 0.15, z + 1.0, 0.75, 3), 0.04)
    }
    lathe(stucco, tcx, YC, [[0.3, SPIRE - 0.3], [0.42, SPIRE + 0.2], [0.32, SPIRE + 0.7], [0.36, SPIRE + 1.1], [0.0, SPIRE + 1.7]], 8)
  }

  // ============================================================ the education buildings
  for (const r of [ccw(WING), ccw(SMALL)]) {
    const h = r.length === 4 ? 4.5 : WALL
    prism(stucco, null, r, 0, h)
    if (r.length === 4) { capRing(flat, r, h); continue }
    // green mansard band, flat roof inside it
    const inner = grow(r, -1.1)
    loft(roof, r, WALL, inner, MANS)
    capRing(flat, inner, MANS)
    wingWindows(win, r, [[1.1, 3.4], [4.6, 9.8]])
  }

  return finishGlb('First Baptist Church of Raleigh', [
    { part: stucco, material: finish('fbc-stucco', 0xe6d8c2) },
    { part: roof, material: PALETTE.copper },
    { part: slate, material: finish('fbc-slate', 0x5d6a63) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('fbc-door', 0x5e5149) },
    { part: flat, material: PALETTE.roof },
  ], { bearing: 2.4, height: SPIRE + 1.7, replaces: ['relation/16629305'] }, 6500)
}

if (import.meta.main) await writeModel('ral-first-baptist-church', build())
