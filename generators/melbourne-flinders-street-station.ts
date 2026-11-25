/**
 * Flinders Street Station, Melbourne (1905-1910, J. W. Fawcett and H. P. C.
 * Ashworth; Edwardian Baroque): procedural, CC0-1.0.
 * bun generators/melbourne-flinders-street-station.ts
 *
 * Writes models/melbourne-flinders-street-station.glb (low) and
 * models/melbourne-flinders-street-station.detail.glb (detail, from zoom 16).
 *
 * Map frame: built in a frame turned to the building: x runs along Flinders
 * Street (69.6 degrees, ENE), y towards the street (339.6 degrees, NNW),
 * z up, metres; the catalog bearing is 339.6. Origin = centroid of the OSM
 * outline way/271939456 (144.965828, -37.818164). The outline runs from
 * x = -175 (west end, past Elizabeth Street) to the Swanston Street corner
 * block at x = 88..134, whose north-east corner is cut at 45 degrees into
 * the main entrance facade under the dome.
 *
 * Identity, in order: the big ribbed green copper dome on its drum over the
 * corner entrance; the corner facade with the great semicircular arch, the
 * row of clocks under it, the columned loggia and the pediment with its
 * clock, flanked by corner towers with smaller green domes; the long
 * ochre-and-red Flinders Street range with arched upper windows and taller
 * domed pavilions; the red-and-cream striped clock tower at the Elizabeth
 * Street entrance; the street verandah.
 *
 * Evidence:
 *  - plan: OSM way/271939456 (outline, 20 m, 4 levels); dome way/271939464
 *    (r 8.7 m, 20-30 m); clock tower way/306665754 (10.2 x 6.9 m, 35 m);
 *    taller pavilions way/405462644 and way/405462645 (24 m, 5 levels);
 *    street verandah way/271939466 (building=roof).
 *  - heights: scaled from Gracchus250's 2021 frontal view of the corner
 *    against the OSM dome diameter (17.4 m = 233 px): cornice 17.5 m,
 *    pediment apex 22.8 m, dome drum to 23 m, dome crown 32.8 m, lantern
 *    to 36.4 m; the arch 12 m wide springing at 2.8 m; the loggia
 *    12.7-15.5 m; the corner domes 8.6 m across. The range's parapet at
 *    OSM's 20 m less the balustrade; the pavilions to OSM's 24 m.
 *  - clock tower: body striped red and cream to 27.5 m, clock stage to
 *    36 m (OSM 35 m), open belfry to 41.5 m, dome to 49 m and finial 52 m,
 *    scaled from Dicklyon's view from the Fleet rooftop against its 10.2 m
 *    width (corrected ~0.88 for the downward view): estimated.
 *  - bays: the range's bays (5.6 m) and window shapes from Yu Chu Chin's and
 *    Gracchus250's street views: ground storey shopfronts under the
 *    verandah, paired square-headed first-floor windows, round-headed
 *    second-floor windows, cream pilasters and string courses on red.
 *  - colours: the 2017-18 restoration's ochre and cream with red brick,
 *    sampled from the sunlit 2019-2025 photos and pulled to the palette;
 *    domes weathered green copper; roofs grey.
 *
 * Photos (Wikimedia Commons):
 *  - "Flinders Street Station Melbourne March 2021 with trams.jpg",
 *    Gracchus250, CC BY-SA 4.0 (north-east, frontal)
 *    https://commons.wikimedia.org/wiki/File:Flinders_Street_Station_Melbourne_March_2021_with_trams.jpg
 *  - "Flinders Street Station Main Building, May 2019.jpg", Medelam, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Flinders_Street_Station_Main_Building,_May_2019.jpg
 *  - "Flinders Street Station on 19 July 2025 - 01.jpg", Yu Chu Chin, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Flinders_Street_Station_on_19_July_2025_-_01.jpg
 *  - "Flinders Street railway station from Fleet Rooftop Bar.jpg", Dicklyon,
 *    CC BY-SA 4.0 (from the west, above)
 *    https://commons.wikimedia.org/wiki/File:Flinders_Street_railway_station_from_Fleet_Rooftop_Bar.jpg
 *  - "Melbourne (AU), View from Eureka Tower, Flinders Street Railway Station
 *    -- 2019 -- 1462.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial, roofs)
 *    https://commons.wikimedia.org/wiki/File:Melbourne_(AU),_View_from_Eureka_Tower,_Flinders_Street_Railway_Station_--_2019_--_1462.jpg
 *  - "Melbourne (AU), Flinders Street Railway Station -- 2019 -- 202623.jpg",
 *    Dietmar Rabich, CC BY-SA 4.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Melbourne_(AU),_Flinders_Street_Railway_Station_--_2019_--_202623.jpg
 *  - "Flinders Street Station, Melbourne AUS.jpg", Stefano Vigorelli,
 *    CC BY-SA 4.0 (the arch and the clocks)
 *    https://commons.wikimedia.org/wiki/File:Flinders_Street_Station,_Melbourne_AUS.jpg
 * No lidar; no commercial imagery. Look-only references: none.
 *
 * Night: the facades are floodlit warm (`_FLOODLIGHT` on the ochre and the
 * brick, strongest low on the street faces), the windows and the arch's
 * glazing glow (`window`), the clock faces are `entrance` (lit).
 *
 * Terrain: `terrain.ts check --zoom 12` prints ok (Mapterhorn is z12 only
 * here). The street side is level; the platforms behind are the map's.
 *
 * Doubts: the back (platform) side is drawn plain from the aerial; the west
 * end pavilion's dome is from the aerial only; the number and spacing of
 * the range's bays are regularised; the attic gables over the range are
 * simplified to one per pavilion; the clock tower's upper heights are
 * photo estimates. The platform canopies and concourse roofs are the map's.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap, lathe } from './chi-aon-center'

const ID = 'melbourne-flinders-street-station'
const BEARING = 339.6
const TAU = Math.PI * 2

// ------------------------------------------------------------ facade kit ---
type Frame = { L: number; u: XY; n: XY; P: (s: number, z: number, o?: number) => V3 }
/** A wall from a to b; n is its outward normal (right of a->b for a CCW ring). */
function frame(a: XY, b: XY): Frame {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  return { L, u, n, P: (s, z, o = 0) => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z] }
}
/** A flat panel on the wall. */
const rect = (p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, o = 0.05) =>
  p.quad(f.P(s0, z0, o), f.P(s1, z0, o), f.P(s1, z1, o), f.P(s0, z1, o))
/** A round-headed panel: jambs from z0 to zs, a semicircle of width w over them. */
function archPanel(p: Part, f: Frame, c: number, w: number, z0: number, zs: number, o = 0.05, seg = 8) {
  const r = w / 2
  if (zs > z0) rect(p, f, c - r, c + r, z0, zs, o)
  for (let i = 0; i < seg; i++) {
    const a0 = Math.PI - (i / seg) * Math.PI, a1 = Math.PI - ((i + 1) / seg) * Math.PI
    p.tri(f.P(c, zs, o), f.P(c + r * Math.cos(a1), zs + r * Math.sin(a1), o), f.P(c + r * Math.cos(a0), zs + r * Math.sin(a0), o))
  }
}
/** A box standing out from the wall between offsets o0 and o1. */
function boxOut(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, top = true) {
  const P = f.P
  p.quad(P(s0, z0, o1), P(s1, z0, o1), P(s1, z1, o1), P(s0, z1, o1))
  p.quad(P(s0, z0, o0), P(s0, z0, o1), P(s0, z1, o1), P(s0, z1, o0))
  p.quad(P(s1, z0, o1), P(s1, z0, o0), P(s1, z1, o0), P(s1, z1, o1))
  if (top) p.quad(P(s0, z1, o1), P(s1, z1, o1), P(s1, z1, o0), P(s0, z1, o0))
  if (z0 > 0.01) p.quad(P(s0, z0, o0), P(s1, z0, o0), P(s1, z0, o1), P(s0, z0, o1))
}
/**
 * A 3D arch ring (archivolt) and its jambs: a band between radii ri and ro
 * about (c, zs), standing out from o0 to o1, with jambs down to z0.
 */
function archFrame(p: Part, f: Frame, c: number, ri: number, ro: number, z0: number, zs: number, o0: number, o1: number, seg = 8) {
  const P = f.P
  if (zs > z0) { boxOut(p, f, c - ro, c - ri, z0, zs, o0, o1, false); boxOut(p, f, c + ri, c + ro, z0, zs, o0, o1, false) }
  for (let i = 0; i < seg; i++) {
    const a0 = Math.PI - (i / seg) * Math.PI, a1 = Math.PI - ((i + 1) / seg) * Math.PI
    const I0 = (o: number) => P(c + ri * Math.cos(a0), zs + ri * Math.sin(a0), o), I1 = (o: number) => P(c + ri * Math.cos(a1), zs + ri * Math.sin(a1), o)
    const O0 = (o: number) => P(c + ro * Math.cos(a0), zs + ro * Math.sin(a0), o), O1 = (o: number) => P(c + ro * Math.cos(a1), zs + ro * Math.sin(a1), o)
    p.quad(I0(o1), I1(o1), O1(o1), O0(o1)) // front
    p.quad(I0(o0), I1(o0), I1(o1), I0(o1)) // intrados
    p.quad(O0(o1), O1(o1), O1(o0), O0(o0)) // extrados
  }
}
/**
 * A wall face from s0..s1, z0..z1 at offset o with a round-headed opening
 * (centre c, radius r, springing zs, sill zb) cut through it, and the
 * opening's reveal back to offset ob: a real hole with depth.
 */
function archedWall(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, c: number, r: number, zs: number, zb: number, o: number, ob: number, seg = 10) {
  const P = f.P
  rect(p, f, s0, c - r, z0, z1, o)
  rect(p, f, c + r, s1, z0, z1, o)
  if (zb > z0) rect(p, f, c - r, c + r, z0, zb, o)
  for (let i = 0; i < seg; i++) {
    const a0 = Math.PI - (i / seg) * Math.PI, a1 = Math.PI - ((i + 1) / seg) * Math.PI
    const x0 = c + r * Math.cos(a0), x1 = c + r * Math.cos(a1)
    p.quad(P(x0, zs + r * Math.sin(a0), o), P(x1, zs + r * Math.sin(a1), o), P(x1, z1, o), P(x0, z1, o))
    // reveal (faces into the opening)
    p.quad(P(x1, zs + r * Math.sin(a1), o), P(x0, zs + r * Math.sin(a0), o), P(x0, zs + r * Math.sin(a0), ob), P(x1, zs + r * Math.sin(a1), ob))
  }
  // jamb reveals and sill
  p.quad(P(c - r, zb, o), P(c - r, zb, ob), P(c - r, zs, ob), P(c - r, zs, o))
  p.quad(P(c + r, zb, ob), P(c + r, zb, o), P(c + r, zs, o), P(c + r, zs, ob))
  if (zb > z0) p.quad(P(c - r, zb, ob), P(c - r, zb, o), P(c + r, zb, o), P(c + r, zb, ob))
}
/** A disc on the wall (clock face), facing out. */
function disc(p: Part, f: Frame, c: number, zc: number, r: number, o: number, seg = 12) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * TAU, a1 = ((i + 1) / seg) * TAU
    p.tri(f.P(c, zc, o), f.P(c + r * Math.cos(a0), zc + r * Math.sin(a0), o), f.P(c + r * Math.cos(a1), zc + r * Math.sin(a1), o))
  }
}
/** A horizontal box from a ring at z0..z1 (ring CCW). */
function slab(p: Part, top: Part, r: XY[], z0: number, z1: number) {
  walls(p, r, z0, z1)
  cap(top, r, z1)
}
/** Offset a CCW ring outward by d. */
function grow(r: XY[], d: number): XY[] {
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + r.length) % r.length], c), n2 = nrm(c, r[(i + 1) % r.length])
    const k = Math.max(1 + n1[0] * n2[0] + n1[1] * n2[1], 0.4)
    return [c[0] + ((n1[0] + n2[0]) / k) * d, c[1] + ((n1[1] + n2[1]) / k) * d] as XY
  })
}
const rectRing = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ------------------------------------------------------------- the plan ---
const FRONT = 8.6, BACK = -2.4 // the range's street and platform faces
const RANGE_X0 = -175, RANGE_X1 = 90
const RANGE_CORNICE = 17, RANGE_TOP = 18.6
// the corner block, with its 45-degree entrance face from (117.2, 8.1) to (134.2, -13.3)
const CORNER: XY[] = [[88, -22.5], [134.1, -22.5], [134.2, -13.3], [117.2, FRONT], [88, FRONT]]
const CORNER_CORNICE = 18.5, CORNER_TOP = 20.6
const DOME_C: XY = [119.7, -7.3], DOME_R = 9.2
const PAVILIONS: [number, number][] = [[13.7, 43.6], [-88.3, -47.8], [-175, -160]]
const PAV_CORNICE = 21.6, PAV_TOP = 23.6
const TOWER = { x0: -77.4, x1: -67.2, y0: 1.1, y1: 8.0 }

function build(detail: boolean) {
  const ochre = new Part(), brick = new Part(), copper = new Part(), roof = new Part(), win = new Part(), clock = new Part()
  const SEG = detail ? 12 : 6, SDS = detail ? 16 : 8

  // ======================================================== the long range
  // body: ochre plinth storey, red brick above, ochre cornice and parapet
  const range = rectRing(RANGE_X0, BACK, RANGE_X1, FRONT)
  // ochre dominant, with red brick bands between the storeys (2017-18 restoration)
  walls(ochre, range, 0, 9.6)
  walls(brick, range, 9.6, 11.2)
  walls(ochre, range, 11.2, 14.8)
  walls(brick, range, 14.8, RANGE_CORNICE - 0.8)
  walls(ochre, range, RANGE_CORNICE - 0.8, RANGE_CORNICE)
  // cornice projecting 0.5 m, then the balustraded parapet set back
  slab(ochre, ochre, grow(range, 0.5), RANGE_CORNICE, RANGE_CORNICE + 0.6)
  walls(ochre, range, RANGE_CORNICE + 0.6, RANGE_TOP)
  cap(roof, range, RANGE_TOP - 0.6)
  {
    // parapet's inner face, the roof sunk behind it
    const inner = grow(range, -0.5).reverse()
    walls(ochre, inner, RANGE_TOP - 0.6, RANGE_TOP)
    // a ridge of grey roof along the range (pitched slate behind the parapet)
    const rr = rectRing(RANGE_X0 + 1, BACK + 1.2, RANGE_X1 - 1, FRONT - 1.2)
    walls(roof, rr, RANGE_TOP - 0.6, RANGE_TOP + 0.6)
    cap(roof, rr, RANGE_TOP + 0.6)
  }
  // the street face: bays of pilasters, string courses and windows
  const front = frame([RANGE_X1, FRONT], [RANGE_X0, FRONT]) // faces +y (the street)
  const back = frame([RANGE_X0, BACK], [RANGE_X1, BACK]) // faces -y (platforms)
  const west = frame([RANGE_X0, FRONT], [RANGE_X0, BACK])
  const BAY = 5.6
  const inPav = (x: number) => PAVILIONS.some(([a, b]) => x > a - 0.5 && x < b + 0.5) || (x > TOWER.x0 - 0.5 && x < TOWER.x1 + 0.5)
  for (const f of [front, back]) {
    const n = Math.round(f.L / BAY), bay = f.L / n
    const street = f === front
    // string courses (cream) over the brick: first floor sill and the arcade's springing
    for (const [z0, z1] of [[4.6, 5.3], [10.2, 10.8]] as const) boxOut(ochre, f, 0, f.L, z0, z1, 0, 0.18)
    for (let i = 0; i < n; i++) {
      const s0 = i * bay, c = s0 + bay / 2
      const x = f.P(c, 0)[0]
      // pilasters between bays
      if (i > 0 && (street || detail)) boxOut(ochre, f, s0 - 0.45, s0 + 0.45, 4.6, RANGE_CORNICE - 0.8, 0, 0.3)
      if (inPav(x)) continue
      if (street || detail) {
        // ground storey: round-headed shopfront openings
        if (detail) archPanel(win, f, c, bay - 1.8, 0.3, 2.9, 0.05, SEG)
        else rect(win, f, c - bay / 2 + 0.9, c + bay / 2 - 0.9, 0.3, 3.6)
        // first floor: a pair of square-headed windows
        rect(win, f, c - 1.75, c - 0.35, 6.0, 9.3)
        rect(win, f, c + 0.35, c + 1.75, 6.0, 9.3)
        // second floor: a round-headed window under a 3D cream arch
        archPanel(win, f, c, 2.4, 11.6, 14.3, 0.05, SEG)
        if (detail) archFrame(ochre, f, c, 1.25, 1.7, 11.0, 14.3, 0, 0.25, SEG)
      } else {
        rect(win, f, c - 1.6, c + 1.6, 6.0, 9.3)
        rect(win, f, c - 1.2, c + 1.2, 11.6, 14.6)
      }
    }
  }
  // west end face
  archPanel(win, west, west.L / 2, 3.2, 6.0, 13.5, 0.05, SEG)

  // ---- taller pavilions on the range, each with two small green domes
  const smallDome = (cx: number, cy: number, z: number, r: number) => {
    // a short square attic, a drum, the ribbed dome and a finial
    lathe(ochre, cx, cy, [[r * 0.98, z], [r * 0.98, z + 1.4], [r * 1.08, z + 1.5], [r * 1.08, z + 1.9]], SDS)
    const k = detail ? 8 : 4, prof: XY[] = []
    for (let i = 0; i <= k; i++) {
      const t = (i / k) * (Math.PI / 2)
      prof.push([r * Math.cos(t) * (1 - 0.12 * Math.sin(t)), z + 1.9 + r * 1.1 * Math.sin(t)])
    }
    prof.push([0, prof[prof.length - 1][1]])
    lathe(copper, cx, cy, prof, SDS)
    lathe(copper, cx, cy, [[0.35, z + 1.9 + r * 1.1 - 0.1], [0.3, z + 1.9 + r * 1.1 + 1.8], [0, z + 1.9 + r * 1.1 + 2.2]], 6)
  }
  for (const [x0, x1] of PAVILIONS) {
    const r = rectRing(x0, BACK - 0.3, x1, FRONT + 0.3)
    walls(ochre, r, 0, 9.6)
    walls(brick, r, 9.6, 11.2)
    walls(ochre, r, 11.2, 15.2)
    walls(brick, r, 15.2, 16.4)
    walls(ochre, r, 16.4, PAV_CORNICE - 0.9)
    walls(ochre, r, PAV_CORNICE - 0.9, PAV_TOP)
    slab(ochre, ochre, grow(r, 0.5), PAV_CORNICE, PAV_CORNICE + 0.6)
    cap(roof, r, PAV_TOP)
    const f = frame([x1, FRONT + 0.3], [x0, FRONT + 0.3])
    // cream quoin pilasters at the ends and a centre bay
    boxOut(ochre, f, 0, 1.4, 4.6, PAV_CORNICE - 0.9, 0, 0.35)
    boxOut(ochre, f, f.L - 1.4, f.L, 4.6, PAV_CORNICE - 0.9, 0, 0.35)
    const n = Math.max(1, Math.round((f.L - 2.8) / BAY)), bay = (f.L - 2.8) / n
    for (let i = 0; i < n; i++) {
      const c = 1.4 + bay * (i + 0.5)
      archPanel(win, f, c, bay - 1.8, 0.3, 2.9, 0.05, SEG)
      rect(win, f, c - 1.4, c + 1.4, 6.0, 9.3)
      archPanel(win, f, c, 2.4, 11.6, 14.6, 0.05, SEG)
      archPanel(win, f, c, 1.6, 16.6, 18.8, 0.05, SEG)
      if (i > 0) boxOut(ochre, f, 1.4 + bay * i - 0.45, 1.4 + bay * i + 0.45, 4.6, PAV_CORNICE - 0.9, 0, 0.3)
      if (detail) archFrame(ochre, f, c, 1.25, 1.75, 11.0, 14.6, 0, 0.25, SEG)
    }
    for (const fs of [frame([x0, FRONT + 0.3], [x0, BACK - 0.3]), frame([x1, BACK - 0.3], [x1, FRONT + 0.3])])
      archPanel(win, fs, fs.L / 2, 2.4, 11.6, 14.6, 0.05, SEG)
    // a semicircular attic gable over the centre
    const gc = f.L / 2
    archFrame(ochre, f, gc, 0, 3.0, PAV_TOP, PAV_TOP, -0.6, 0.15, SEG)
    archPanel(win, f, gc, 2.0, PAV_TOP, PAV_TOP, 0.2, SEG)
    // small domes at the pavilion's ends (one, centred, on the narrow west end)
    if (x1 - x0 < 20) smallDome((x0 + x1) / 2, 3.1, PAV_TOP, 3.4)
    else { smallDome(x0 + 3.6, 3.1, PAV_TOP, 3.0); smallDome(x1 - 3.6, 3.1, PAV_TOP, 3.0) }
  }

  // ================================================ the Elizabeth St clock tower
  {
    const { x0, x1, y0, y1 } = TOWER
    const r = rectRing(x0, y0 - 1.5, x1, y1 + 0.6)
    // striped body: red and cream bands, about a metre each
    let z = 4.6
    walls(ochre, r, 0, z)
    let k = 0
    while (z < 27.5 - 0.01) {
      const z1 = Math.min(27.5, z + (k % 2 ? 0.75 : 1.0))
      walls(k % 2 ? ochre : brick, r, z, z1)
      z = z1; k++
    }
    // clock stage: cream, slightly proud, a clock on each face
    const st = grow(r, 0.35)
    for (let zz = 27.5, kk = 0; zz < 36 - 0.01; kk++) {
      const z1 = Math.min(36, zz + (kk % 2 ? 0.75 : 1.0))
      walls(kk % 2 ? ochre : brick, st, zz, z1)
      zz = z1
    }
    slab(ochre, ochre, grow(r, 0.8), 36, 36.7)
    const faces = [0, 1, 2, 3].map((i) => frame(st[i], st[(i + 1) % 4]))
    for (const f of faces) {
      const cr = Math.min(2.2, f.L * 0.28)
      disc(ochre, f, f.L / 2, 31.6, cr + 0.55, 0.06, detail ? 20 : 12)
      disc(clock, f, f.L / 2, 31.6, cr, 0.12, detail ? 20 : 12)
    }
    // the belfry: open round-headed arches on every face, with real depth
    const bel = grow(r, -0.6)
    const bf = [0, 1, 2, 3].map((i) => frame(bel[i], bel[(i + 1) % 4]))
    for (const f of bf) {
      const w = Math.min(3.2, f.L * 0.45)
      archedWall(ochre, f, 0, f.L, 36.7, 41.5, f.L / 2, w / 2, 39.4 - w / 2 + 0.1, 37.4, 0, -0.9, SEG)
    }
    // the core behind the openings (dark: the bell chamber)
    walls(win, grow(r, -1.5), 36.7, 41.5)
    slab(ochre, ochre, grow(r, -0.2), 41.5, 42.2)
    // corner urns
    for (const [cx, cy] of grow(r, -0.7)) lathe(ochre, cx, cy, [[0.45, 42.2], [0.55, 42.9], [0.3, 43.6], [0, 43.8]], 6)
    // the dome and its finial
    const cx = (x0 + x1) / 2, cy = (y0 - 1.5 + y1 + 0.6) / 2, R = 3.6
    lathe(ochre, cx, cy, [[R, 42.2], [R, 43.2]], SDS)
    const prof: XY[] = []
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * (Math.PI / 2); prof.push([R * Math.cos(t), 43.2 + 5.2 * Math.sin(t)]) }
    prof.push([0, 48.4])
    // the tower's cupola reads dark slate in the photos, not green
    lathe(roof, cx, cy, prof, SDS)
    lathe(roof, cx, cy, [[0.5, 48.3], [0.5, 49.6], [0.25, 51.6], [0, 52]], 6)
  }

  // ======================================================= the corner block
  slab(ochre, ochre, CORNER, 0, 4.6)
  walls(ochre, CORNER, 4.6, CORNER_TOP)
  slab(ochre, ochre, grow(CORNER, 0.55), CORNER_CORNICE, CORNER_CORNICE + 0.7)
  cap(roof, CORNER, CORNER_TOP)
  // red brick panels between cream piers on the Flinders and Swanston faces
  const fFl = frame([117.2, FRONT], [88, FRONT]), fSw = frame([134.1, -22.5], [134.2, -13.3]), fBk = frame([88, -22.5], [134.1, -22.5])
  for (const f of [fFl, fSw]) {
    const n = Math.max(1, Math.round(f.L / 6.5)), bay = f.L / n
    for (let i = 0; i < n; i++) {
      const c = bay * (i + 0.5)
      rect(brick, f, c - bay / 2 + 1.1, c + bay / 2 - 1.1, 9.4, 10.6, 0.03)
      rect(brick, f, c - bay / 2 + 1.1, c + bay / 2 - 1.1, 15.0, CORNER_CORNICE - 0.8, 0.03)
      archPanel(win, f, c, 2.6, 6.0, 8.6, 0.06, SEG)
      archPanel(win, f, c, 2.6, 11.2, 14.4, 0.06, SEG)
      archPanel(win, f, c, 3.2, 0.3, 3.0, 0.06, SEG)
      if (detail) archFrame(ochre, f, c, 1.35, 1.9, 10.6, 14.4, 0, 0.3, SEG)
    }
  }
  for (const f of [fBk, frame([88, FRONT], [88, -22.5])]) {
    const n = Math.max(1, Math.round(f.L / 6)), bay = f.L / n
    for (let i = 0; i < n; i++) archPanel(win, f, bay * (i + 0.5), 2.2, 11.2, 14.0, 0.05, SEG)
  }

  // ---- the entrance facade on the 45-degree face
  const E = frame([134.2, -13.3], [117.2, FRONT])
  const L = E.L, mid = L / 2
  const AR = 7.4, AS = 3.2 // the great arch: 14.8 m across, springing at 3.2 m
  // the frontispiece stands 1.2 m proud of the corner block, with the arch cut through it
  const fo = 3.0
  {
    const s0 = 3.7, s1 = L - 3.7
    archedWall(ochre, E, s0, s1, 0, CORNER_CORNICE, mid, AR, AS, 0, fo, 0.1, detail ? 20 : 12)
    // the recess's back wall: dark glazing behind the arch
    rect(win, E, mid - AR, mid + AR, AS + 2.1, AS + AR, 0.12)
    // frontispiece sides and top
    boxOut(ochre, E, s0 - 0.01, s0, 0, CORNER_CORNICE, 0, fo)
    boxOut(ochre, E, s1, s1 + 0.01, 0, CORNER_CORNICE, 0, fo)
    ochre.quad(E.P(s0, CORNER_CORNICE, fo), E.P(s1, CORNER_CORNICE, fo), E.P(s1, CORNER_CORNICE, 0), E.P(s0, CORNER_CORNICE, 0))
    // the arch's voussoir ring, bold and proud
    archFrame(ochre, E, mid, AR, AR + 0.9, AS, AS, fo, fo + 0.45, detail ? 20 : 12)
    // the glazed lunette set back in the arch, the clocks under it, the doorway below
    archPanel(win, E, mid, 2 * AR, AS + 2.1, AS + 0.01, 0.15, detail ? 20 : 12)
    rect(roof, E, mid - AR, mid + AR, AS, AS + 2.1, 0.15)
    const nClocks = detail ? 9 : 7
    for (let i = 0; i < nClocks; i++) disc(clock, E, mid - AR + (2 * AR * (i + 0.5)) / nClocks, AS + 1.15, 0.5, 0.22, detail ? 12 : 8)
    rect(win, E, mid - AR, mid + AR, 0, AS, 0.15)
    // the loggia above the arch: columns in front of dark glazing, a balcony slab
    const lz0 = 13.4, lz1 = 16.4
    rect(win, E, mid - 6, mid + 6, lz0, lz1, fo + 0.02)
    boxOut(ochre, E, mid - 6.6, mid + 6.6, lz0 - 0.7, lz0, fo, fo + 0.5)
    for (let i = 0; i <= 5; i++) {
      const c = mid - 6 + (12 * i) / 5
      if (detail) lathe(ochre, E.P(c, 0, fo + 0.4)[0], E.P(c, 0, fo + 0.4)[1], [[0.32, lz0], [0.28, lz1 - 0.3], [0.42, lz1 - 0.1], [0.42, lz1]], 8)
      else boxOut(ochre, E, c - 0.3, c + 0.3, lz0, lz1, fo, fo + 0.6)
    }
    boxOut(ochre, E, mid - 6.6, mid + 6.6, lz1, lz1 + 0.6, fo, fo + 0.5)
    // paired pilasters either side of the arch
    for (const c of [s0 + 0.55, s1 - 0.55]) boxOut(ochre, E, c - 0.5, c + 0.5, 0, CORNER_CORNICE, fo, fo + 0.4)
    // cornice over the frontispiece
    boxOut(ochre, E, s0 - 0.4, s1 + 0.4, CORNER_CORNICE, CORNER_CORNICE + 0.8, 0, fo + 0.7)
    // the pediment with its clock
    const pz = CORNER_CORNICE + 0.8, apex = 24.0
    const A = E.P(s0 - 0.2, pz, fo + 0.4), B = E.P(s1 + 0.2, pz, fo + 0.4), C = E.P(mid, apex, fo + 0.4)
    const A0 = E.P(s0 - 0.2, pz, -3), B0 = E.P(s1 + 0.2, pz, -3), C0 = E.P(mid, apex, -3)
    ochre.tri(A, B, C)
    ochre.quad(A, C, C0, A0)
    ochre.quad(C, B, B0, C0)
    disc(clock, E, mid, pz + 2.0, 1.25, fo + 0.45, detail ? 20 : 12)
    // the corner towers either side: arched windows, red panels, small domes
    for (const [t0, t1] of [[0, s0], [s1, L]] as const) {
      const c = (t0 + t1) / 2
      rect(brick, E, t0 + 0.9, t1 - 0.9, 9.4, 10.6, 0.03)
      rect(brick, E, t0 + 0.9, t1 - 0.9, 15.0, CORNER_CORNICE - 0.8, 0.03)
      archPanel(win, E, c, 2.4, 0.3, 3.2, 0.06, SEG)
      archPanel(win, E, c, 2.2, 6.2, 8.8, 0.06, SEG)
      archPanel(win, E, c, 2.2, 11.4, 14.4, 0.06, SEG)
      archFrame(ochre, E, c, 1.2, 1.7, 10.8, 14.4, 0, 0.3, SEG)
      // attic with balustrade over the tower, and the dome
      const P0 = E.P(c, 0, -3.0)
      slab(ochre, ochre, rectRing(P0[0] - 3.4, P0[1] - 3.4, P0[0] + 3.4, P0[1] + 3.4), CORNER_TOP, CORNER_TOP + 1.2)
      smallDome(P0[0], P0[1], CORNER_TOP + 1.2, 3.6)
    }
  }

  // ---- the main dome: drum with round windows, ribbed copper dome, lantern
  {
    const [cx, cy] = DOME_C, R = DOME_R
    // a tall drum carrying the dome clear of the pediment (apex 24 m)
    const D0 = 25.8, RISE = 10.2
    lathe(ochre, cx, cy, [[R + 0.3, CORNER_TOP - 0.5], [R + 0.3, 24.4], [R + 0.9, 24.6], [R + 0.9, 25.4], [R, 25.5], [R, D0]], SEG * 2)
    // round windows in the drum (oculi), facing out on eight sides
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.2
      const d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-d[1], d[0]]
      const f: Frame = { L: 2, u: t, n: d, P: (s, z, o = 0) => [cx + d[0] * (R + 0.3 + o) + t[0] * s, cy + d[1] * (R + 0.3 + o) + t[1] * s, z] }
      disc(win, f, 0, 22.6, 0.9, 0.04, detail ? 10 : 6)
    }
    // the dome: a little taller than a hemisphere, crown at 36 m
    const k = detail ? 14 : 8, prof: XY[] = []
    for (let i = 0; i <= k; i++) { const t = (i / k) * (Math.PI / 2); prof.push([R * Math.cos(t), D0 + RISE * Math.sin(t)]) }
    lathe(copper, cx, cy, prof, detail ? 32 : 20)
    // ribs: bold raised bands down the dome, lighter than the copper as in the photos
    const nr = detail ? 16 : 12
    for (let i = 0; i < nr; i++) {
      const a = (i / nr) * TAU, d: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
      for (let j = 0; j < prof.length - 2; j++) {
        const [r0, z0] = prof[j], [r1, z1] = prof[j + 1], w = 0.3, h = 0.3
        const p0: V3 = [cx + d[0] * (r0 + h), cy + d[1] * (r0 + h), z0], p1: V3 = [cx + d[0] * (r1 + h), cy + d[1] * (r1 + h), z1]
        roof.quad([p0[0] - t[0] * w, p0[1] - t[1] * w, z0], [p0[0] + t[0] * w, p0[1] + t[1] * w, z0], [p1[0] + t[0] * w, p1[1] + t[1] * w, z1], [p1[0] - t[0] * w, p1[1] - t[1] * w, z1])
      }
    }
    // dormer eyebrow windows on four sides, near the dome's foot
    for (let i = 0; i < 4; i++) {
      const a = ROT45 + (i / 4) * TAU, d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-d[1], d[0]]
      const f: Frame = { L: 2, u: t, n: d, P: (s, z, o = 0) => [cx + d[0] * (R - 0.6 + o) + t[0] * s, cy + d[1] * (R - 0.6 + o) + t[1] * s, z] }
      archFrame(ochre, f, 0, 0.75, 1.25, D0 + 0.6, D0 + 1.7, 0, 1.2, SEG)
      archPanel(win, f, 0, 1.5, D0 + 0.6, D0 + 1.7, 1.15, SEG)
    }
    // lantern, its cap, the flagpole
    const LZ = D0 + RISE - 0.5
    lathe(ochre, cx, cy, [[2.0, LZ], [2.0, LZ + 0.7], [1.7, LZ + 0.8], [1.7, LZ + 3.0], [2.0, LZ + 3.1], [2.0, LZ + 3.5]], SEG + 2)
    lathe(copper, cx, cy, [[2.0, LZ + 3.5], [1.3, LZ + 4.2], [0.5, LZ + 4.6], [0.3, LZ + 6.0], [0, LZ + 6.4]], SEG + 2)
    lathe(roof, cx, cy, [[0.12, LZ + 6.4], [0.1, LZ + 11.5], [0, LZ + 11.6]], 4)
  }

  // ============================================== the street verandah
  {
    const z = 4.4, ring = rectRing(-97.4, FRONT, 120.5, FRONT + 4.2)
    slab(roof, roof, ring, z, z + 0.45)
    cap(roof, ring, z, false)
    // posts at the kerb
    for (let x = -95; x <= 118; x += detail ? 6 : 12) boxOut(roof, frame([x + 0.15, FRONT + 3.9], [x - 0.15, FRONT + 3.9]), 0, 0.3, 0, z, 0, 0.3)
  }

  return [
    { part: ochre, material: { ...finish('fss-ochre', 0xebcfa2), floodlight: lit } },
    { part: brick, material: { ...finish('fss-brick', 0xb3634f), floodlight: lit } },
    { part: copper, material: finish('fss-copper', 0x7f8f7f) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: clock, material: { ...PALETTE.entrance, color: 0xfaf5e8 } },
  ]
}
const ROT45 = Math.atan2(0.62, 0.78) // the entrance face's outward direction
/** Floodlit facades: strong on the street walls, fading upward, little on tops. */
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 1 - 0.4 * Math.min(1, p[2] / 40))

async function write(file: string, parts: ReturnType<typeof build>, maxTri: number, maxBytes: number) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${used.length} materials`)
  const glb = writeGlb('Flinders Street Station', used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', bearing: BEARING, height: 52 })
  if (triangles > maxTri || glb.length > maxBytes) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  await Bun.write(file, glb)
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  const dir = new URL('../models/', import.meta.url).pathname
  await write(`${dir}${ID}.glb`, build(false), 6500, 250_000)
  await write(`${dir}${ID}.detail.glb`, build(true), 40_000, 1_536_000)
}
