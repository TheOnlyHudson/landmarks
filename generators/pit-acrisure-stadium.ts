/**
 * Acrisure Stadium (Heinz Field until 2022), Pittsburgh (NFL, Pittsburgh
 * Steelers; 2001, HOK Sport with WTW Architects) — procedural, CC0-1.0, no
 * textures.  bun generators/pit-acrisure-stadium.ts
 *
 * Map frame: x across the field (east sideline +x), y along it towards the
 * closed north end, z up, metres. Placed at bearing 335°, the field's long
 * axis (OSM inner ring way/1455655481, minimum-area rectangle 155°/335°).
 * The anchor is the area centroid of the stadium outline (building=stadium
 * relation/19912629, outer way/559606216 less the field ring):
 * -80.015759, 40.446764. The field's centre is at the origin (lidar).
 *
 * z = 0 is the field. The lidar puts it 2.0-2.3 m below the streets and
 * plazas round the stadium, and the map's terrain (Mapterhorn) already has
 * that dip (field 0.0-0.4 m, the ground outside 2.2-3.4 m above the lowest
 * point), so `elevation` is 0, as for Lincoln Financial Field. The pitch is
 * the map's (STYLE.md, "Don't model the ground").
 *
 * What makes it read as itself, from the photos: the gold-yellow seats of
 * a horseshoe bowl open to the south, towards the Ohio River and the
 * Point; the two long sideline stands, three tiers under flat white roofs
 * held on yellow raking struts, whose south ends stand up as dark steel
 * "wings" either side of the open end; the north end's broad upper deck
 * under a narrow white canopy; the two round ramp rotundas at the open
 * end's corners, each under a white umbrella roof; the grey scoreboard
 * block in the middle of the open end (the video board on its field side,
 * the black "ACRISURE STADIUM" band on its river side); buff precast stair
 * towers and glass on the outside.
 *
 * Evidence
 * - OSM: outline relation/19912629 (outer way/559606216, field ring
 *   way/1455655481); leisure=stadium way/24722790 (name, Q1067148). Three
 *   small buildings reach under the outline at the north and north-west
 *   (way/559606224, way/559606229, way/559606232: gate and service blocks
 *   against the outer wall) and are replaced too.
 * - Measured, lidar: USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid
 *   read in this frame (heights above the field, which is 2.4 m above the
 *   box's lowest return):
 *   - field wall at |x| 56.5, |y| 62-63;
 *   - sidelines: lower bowl to 11.7 m at |x| 76, the suite face to 25 m,
 *     the club ledge 25-30 m at 78-84 m, the roof 50.3 m (+-0.3) from 86 m
 *     out to 111-114 m, its inner edge curving in to 80 m at |y| 80;
 *     the roofs run from y -88 to +96; dark steel frames on their ends
 *     standing to 55 m;
 *   - north end: lower bowl to 11 m at y 93, the upper deck 20.5 m at 96 m
 *     to 35.5 m at 123 m, the canopy at 42 m from 124 to 130 m;
 *   - the corners between: seats up to 25-27 m;
 *   - south end: lower bowl to 8.5 m at y -86, a plaza deck at 8.8 m out to
 *     -117 m; the scoreboard block x -27..28, y -102..-113, 32 m; the
 *     rotundas at (+-75, -103), ramps to 24 m, 35 m across, umbrellas to
 *     34.5 m.
 * - Measured, USGS NAIP orthophoto (0.38 m): plan; white pleated roofs on
 *   both sidelines and the north end's top, octagonal white umbrellas, the
 *   yellow seats wrapping the bowl.
 * - Published (Wikipedia, "Acrisure Stadium"): opened 2001; HOK Sport; the
 *   open south end looking onto the Point; renamed 2022.
 * - Photos (Wikimedia Commons):
 *   Cbaile19, "Acrisure Stadium with Fort Pitt Bridge in foreground,
 *     Pittsburgh, 2024-05-27" (CC0, from the south across the river)
 *     https://commons.wikimedia.org/wiki/File:Acrisure_Stadium_with_Fort_Pitt_Bridge_in_foreground,_Pittsburgh,_2024-05-27.jpg
 *   Cbaile19, "Acrisure Stadium, 2022-11-01, 01" (CC0, from the south)
 *     https://commons.wikimedia.org/wiki/File:Acrisure_Stadium,_2022-11-01,_01.jpg
 *   Cbaile19, "Acrisure Stadium, 2023-03-01" (CC0, from the south-south-west)
 *     https://commons.wikimedia.org/wiki/File:Acrisure_Stadium,_2023-03-01.jpg
 *   Cbaile19, "Acrisure Stadium, North Shore, 2026-10-22" (CC0, river level)
 *     https://commons.wikimedia.org/wiki/File:Acrisure_Stadium,_North_Shore,_2026-10-22.jpg
 *   Cramerwiki, "Acrisure Stadium 2024" (CC0, river level)
 *     https://commons.wikimedia.org/wiki/File:Acrisure_Stadium_2024.jpg
 *   Tom Murphy VII, "Heinz Field (2005)" (public domain, from the
 *     south-west: the west stand's outside, roof and yellow struts)
 *     https://commons.wikimedia.org/wiki/File:Heinz_Field_(2005).jpg
 *   Bernard Gagnon, "Heinz Field01" (CC BY-SA 3.0, from the south-west)
 *     https://commons.wikimedia.org/wiki/File:Heinz_Field01.jpg
 *   Carol M. Highsmith, "Aerial view of Pittsburgh ... Heinz Field"
 *     (public domain, Library of Congress, from the west)
 *     https://commons.wikimedia.org/wiki/File:Aerial_view_of_Pittsburgh,_Pennsylvania,_with_a_focus_on_Heinz_Field,_the_home_statium_of_the_Pittsburgh_Steelers_National_Football_League_team_(highsm.58438).png
 *   Kimon Berlin, "Heinz Field (14128389727)" (CC BY-SA 2.0, from the
 *     south-west, high)
 *     https://commons.wikimedia.org/wiki/File:Heinz_Field_(14128389727).jpg
 *   Cbaile19, "Heinz Field, 2021-07-03" (CC0, river level)
 *     https://commons.wikimedia.org/wiki/File:Heinz_Field,_2021-07-03.jpg
 * Estimated: everything under the roofs (the upper decks' backs at 46.5 m),
 * the outer walls' glass and piers (the outside is photographed only from
 * the south-west), the buff stair towers' places on the sidelines, the
 * steel end frames' members (from their silhouettes in the river photos),
 * the yellow struts' spacing, the video boards' sizes and the umbrella
 * shape (from the photos), the rotundas' ramp levels.
 * Left out: the field, flags, lettering, the Great Hall's signage, the
 * lights on the roof fascias, the Art Rooney statue and the riverside
 * arch (separate, outside the outline).
 * Doubts: OSM's outline is 2-5 m inside the lidar's roof edge on the
 * sidelines; the walls follow OSM and the roofs overhang to the lidar
 * edge. The east sideline's outside is unphotographed and mirrors the
 * west.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, box, cylinder, prism, loftSections, rayHit, type XY, type SectionPt } from './dc-nationals-park'
import { stripLoft, sectionCap, beam, save } from './phl-lincoln-financial-field'

const seats = new Part(), conc = new Part(), buff = new Part(), steel = new Part(), roof = new Part(), win = new Part()
const C: XY = [0, 0]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const X: [V3, V3, V3] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]

// OSM outline (outer way/559606216) in this frame.
const OUTLINE: XY[] = [[65.1, -121.0], [56.9, -112.7], [54.7, -110.6], [54.5, -108.1], [13.3, -114.3], [-13.3, -113.8], [-23.3, -113.8], [-28.9, -106.7], [-54.4, -106.7], [-54.3, -109.7], [-57.1, -112.5], [-66.6, -122.8], [-79.1, -122.3], [-81.8, -122.5], [-92.6, -111.9], [-92.2, -96.1], [-90.2, -94.3], [-91.5, -90.0], [-89.5, -88.1], [-98.9, -89.7], [-99.6, -87.8], [-104.4, -75.7], [-107.5, -61.5], [-110.1, -46.9], [-109.7, -40.8], [-112.5, -18.8], [-112.9, -3.8], [-112.2, 12.5], [-104.3, 51.8], [-99.0, 78.2], [-101.9, 78.8], [-101.8, 80.3], [-101.1, 84.6], [-100.0, 91.3], [-99.1, 94.8], [-97.8, 98.3], [-91.2, 94.3], [-74.4, 84.0], [-66.2, 94.1], [-54.8, 103.2], [-61.3, 118.9], [-62.0, 120.7], [-62.8, 122.6], [-56.7, 124.9], [-50.7, 127.1], [-48.7, 127.8], [-43.1, 128.9], [-27.7, 130.0], [-12.8, 130.2], [3.3, 129.9], [15.3, 129.6], [29.6, 128.8], [44.2, 127.0], [52.0, 125.5], [65.0, 120.6], [62.3, 114.7], [61.5, 113.0], [55.4, 101.0], [63.4, 96.7], [70.9, 90.0], [76.6, 82.6], [78.6, 83.7], [88.4, 88.9], [96.1, 93.1], [97.0, 93.6], [98.8, 89.4], [103.0, 79.8], [106.0, 65.0], [107.9, 52.7], [108.5, 49.2], [109.4, 37.2], [110.8, 22.1], [111.1, 0.5], [109.9, -19.7], [109.7, -23.6], [110.1, -37.5], [109.2, -46.6], [108.1, -51.3], [106.9, -60.6], [106.4, -64.1], [105.8, -67.7], [103.9, -77.9], [102.5, -82.4], [101.4, -85.3], [100.1, -88.1], [97.1, -94.2], [91.3, -91.0], [90.5, -93.0], [92.2, -95.0], [92.1, -110.7], [81.4, -121.6], [79.2, -121.5]]

// ---------------------------------------------------------------------------
// The lower bowl, all the way round: field wall, seats, the suite face's
// foot. Rings in plan, read by angle from the centre.
const se = (A: number, B: number, n: number) => (a: number) => {
  const s = Math.sin((a * Math.PI) / 180), c = Math.cos((a * Math.PI) / 180)
  return (Math.abs(s / A) ** n + Math.abs(c / B) ** n) ** (-1 / n)
}
const RW = se(56.5, 62.5, 5)
const R1_RING: XY[] = [[76, -84], [76, 78], [54, 93], [-54, 93], [-76, 78], [-76, -84], [-52, -88], [52, -88]]
const R1 = (a: number) => rayHit(R1_RING, C, dirOf(a))
{
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 5) angles.push(a)
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const south = Math.cos((a * Math.PI) / 180) < -0.7 // the open end, lower
    const top = south ? 8.5 : 11.5
    return [
      { r: RW(a), z: 0, part: conc },
      { r: RW(a), z: 1.2, part: seats },
      { r: R1(a), z: top, part: conc },
      { r: R1(a) + 2, z: top, part: null },
    ]
  }), null)
}

// The open end's plaza deck between the rotundas, 8.8 m, out to the river
// side of the scoreboard block.
prism([[-60, -86], [60, -86], [60, -117], [-60, -117]], 0, 8.8, conc, conc)

// ---------------------------------------------------------------------------
// The sideline stands (s = 1 east, -1 west), y -88 to +88: the suite face,
// the club ledge, the upper deck raking up under the roof, the outer wall.
const UB = (y: number) => 110.5 - 7 * (y / 85) ** 2 // the outer wall (OSM)
const Y0 = -88, Y1 = 88
const NV = 11
const ys: number[] = []
for (let k = 0; k <= NV; k++) ys.push(Y0 + ((Y1 - Y0) * k) / NV)
const sideSec = (y: number): XY[] => [
  [76, 11.5], [76, 25], [78.5, 25], [UB(y) - 1.5, 46.5], [UB(y) - 1.5, 48], [UB(y), 48], [UB(y), 30], [UB(y), 0],
]
const sideParts = [conc, conc, seats, conc, conc, steel, conc] // the dark band under the roof: the upper deck's back
for (const s of [1, -1]) {
  const rows = ys.map((y) => sideSec(y).map(([u, z]): V3 => [s * u, y, z]))
  stripLoft(rows, sideParts, (i, k) => {
    const a = sideSec(ys[k])[i], b = sideSec(ys[k])[i + 1]
    return [-(b[1] - a[1]) * s, 0, b[0] - a[0]]
  })
  for (const y of [Y0, Y1]) {
    const sec = sideSec(y)
    sectionCap(conc, sec.map(([u, z]): V3 => [s * u, y, z]), sec, [0, Math.sign(y), 0])
  }
  // Glazed suite band on the face, broken at the aisles.
  for (let k = 0; k < NV; k++) {
    const y0 = ys[k] + 1, y1 = ys[k + 1] - 1
    quad(win, [[s * 75.94, y0, 13], [s * 75.94, y1, 13], [s * 75.94, y1, 23.5], [s * 75.94, y0, 23.5]], [-s, 0, 0])
  }
  // The outside: glass between buff piers, in two storeys of panels.
  for (let k = 0; k < NV; k++) {
    const ya = ys[k], yb = ys[k + 1]
    const u = (y: number) => UB(y) + 0.06
    for (const [z0, z1] of [[5, 15], [17.5, 27.5]]) {
      const t0 = 0.12, t1 = 0.88
      const y0 = ya + (yb - ya) * t0, y1 = ya + (yb - ya) * t1
      quad(win, [[s * u(y0), y0, z0], [s * u(y1), y1, z0], [s * u(y1), y1, z1], [s * u(y0), y0, z1]], [s, 0, 0])
    }
  }
  // Buff precast stair towers on the outside, up to the roof.
  for (const yc of [-62, 2, 64]) {
    const u = UB(yc)
    box(buff, [s * (u + 3), yc, 21], X, [3, 6.5, 21])
  }
  // The roof: flat, white on top, dark steel fascia and underside; its
  // inner edge curving in towards the ends (lidar).
  const RY0 = -89, RY1 = 95
  const rys: number[] = []
  for (let k = 0; k <= 14; k++) rys.push(RY0 + ((RY1 - RY0) * k) / 14)
  const uIn = (y: number) => 86 - 6 * (y / 85) ** 2
  const uOut = (y: number) => 113.5 - 9 * (y / 90) ** 2
  const roofSec = (y: number): XY[] => [[uIn(y), 47], [uIn(y), 50.3], [uOut(y), 50.3], [uOut(y), 48.8], [uIn(y), 47]]
  const rrows = rys.map((y) => roofSec(y).map(([u, z]): V3 => [s * u, y, z]))
  stripLoft(rrows, [steel, roof, steel, steel], (i, k) => {
    const a = roofSec(rys[k])[i], b = roofSec(rys[k])[i + 1]
    return [-(b[1] - a[1]) * s, 0, b[0] - a[0]]
  })
  for (const y of [RY0, RY1]) {
    const q = roofSec(y).slice(0, 4)
    sectionCap(steel, q.map(([u, z]): V3 => [s * u, y, z]), q, [0, Math.sign(y), 0])
  }
  // Yellow raking struts under the roof's outer edge, in V pairs (photos).
  for (let y = -72; y <= 80; y += 19) {
    for (const d of [-4.5, 4.5]) beam(seats, [s * (UB(y) + 0.8), y, 30], [s * (uOut(y + d) - 1), y + d, 48.6], 0.9, 0.9)
  }
  // The steel end frames ("wings") over the stands' ends: a mast at the
  // back, a top chord falling to the roof's front, braces, and the yellow
  // rakers under them.
  for (const [y, sg] of [[-89.5, -1], [95.5, 1]] as [number, number][]) {
    const ub = uOut(y) - 0.5, ui = uIn(y)
    const top = sg < 0 ? 56 : 53.5
    // the dark sail of steel and roof underside the end shows from the
    // river, as one panel each side of the frame
    const sail: XY[] = [[ub, 30], [ub, top - 0.5], [ui - 1, 50.5], [ui + 1.5, 46.5], [ub - 9, 37]]
    for (const f of [-1, 1]) {
      const yy = y + f * 0.35
      const P = sail.map(([u, z]): V3 => [s * u, yy, z])
      for (let i = 1; i < P.length - 1; i++) quad(steel, [P[0], P[i], P[i + 1], P[i + 1]], [0, f, 0])
    }
    beam(steel, [s * ub, y, 28], [s * ub, y, top], 1.6, 1.6)
    beam(steel, [s * ub, y, top], [s * (ui - 1), y, 50.8], 1.4, 1.4)
    beam(steel, [s * ub, y, 30], [s * (ui + 2), y, 47.5], 1.2, 1.2)
    beam(steel, [s * ((ub + ui) / 2), y, 40], [s * ((ub + ui) / 2), y, (top + 50.8) / 2 + 0.6], 1.1, 1.1)
    if (sg < 0) beam(seats, [s * (ub - 6), y + 0.6, 26], [s * (ui + 4), y + 0.6, 47], 0.9, 0.9)
  }
}

// ---------------------------------------------------------------------------
// The north end and its corners, lofted round the centre: the club face,
// the upper deck, its canopy, the outer wall (OSM).
{
  const RU_RING: XY[] = [[100, -100], [100, 80], [62, 120], [-62, 120], [-100, 80], [-100, -100]]
  const RO = (a: number) => rayHit(OUTLINE, C, dirOf(a))
  const RU = (a: number) => Math.min(rayHit(RU_RING, C, dirOf(a)), RO(a) - 3)
  const angles = [-46, -42, -38, -34, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 34, 38, 42, 46]
  const H = (a: number) => {
    const t = Math.abs(a)
    if (t <= 26) return { zc: 20.5, zu: 35.5, top: 42, canopy: true } // the north stand
    if (t <= 30) return { zc: 20.5, zu: 33, top: 36, canopy: false }
    return { zc: 18, zu: 26, top: 27.5, canopy: false } // the yellow corners, lower
  }
  loftSections(C, angles.map((a) => (a + 360) % 360 === 0 ? 0 : a), angles.map((a): SectionPt[] => {
    const h = H(a)
    const r1 = R1(a), ru = RU(a), ro = RO(a)
    return [
      { r: r1, z: 11.5, part: conc },
      { r: r1, z: h.zc, part: conc },
      { r: r1 + 1.5, z: h.zc, part: seats },
      { r: ru, z: h.zu, part: h.canopy ? steel : conc },
      { r: ru, z: h.top, part: h.canopy ? roof : conc },
      { r: ro, z: h.top, part: conc },
      { r: ro, z: 0, part: null },
    ]
  }), conc)
  // The outside of the north end: glass in two storeys of panels.
  for (let k = 0; k < angles.length - 1; k++) {
    const a0 = angles[k], a1 = angles[k + 1]
    const p = (a: number, z: number): V3 => { const d = dirOf(a), r = RO(a) + 0.06; return [d[0] * r, d[1] * r, z] }
    const m = (t: number) => a0 + (a1 - a0) * t
    const top = Math.min(H(a0).top, H(a1).top)
    for (const [z0, z1] of [[5, 15], [17.5, top - 4]] as [number, number][]) {
      if (z1 - z0 < 3) continue
      const P = [p(m(0.1), z0), p(m(0.9), z0), p(m(0.9), z1), p(m(0.1), z1)]
      const mid = dirOf((a0 + a1) / 2)
      quad(win, P, [mid[0], mid[1], 0])
    }
  }
  // Glazed club band on the north face.
  for (let k = 0; k < angles.length - 1; k++) {
    const a0 = angles[k], a1 = angles[k + 1]
    if (Math.abs(a0) > 30 || Math.abs(a1) > 30) continue
    const p = (a: number, z: number): V3 => { const d = dirOf(a), r = R1(a) - 0.06; return [d[0] * r, d[1] * r, z] }
    const m = (a: number, b: number, t: number) => a + (b - a) * t
    quad(win, [p(m(a0, a1, 0.04), 12.5), p(m(a0, a1, 0.96), 12.5), p(m(a0, a1, 0.96), 19.5), p(m(a0, a1, 0.04), 19.5)], [0, -1, 0])
  }
}

// The north-west corner's video board on its frame, facing the field.
{
  const c: XY = [-60, 101]
  const f = [-c[0], -c[1]], n = Math.hypot(f[0], f[1])
  const nrm: V3 = [f[0] / n, f[1] / n, 0], t: V3 = [nrm[1], -nrm[0], 0]
  box(steel, [c[0], c[1], 35.5], [t, nrm, [0, 0, 1]], [13, 1.4, 7], true)
  box(win, [c[0] + nrm[0] * 1.46, c[1] + nrm[1] * 1.46, 35.5], [t, nrm, [0, 0, 1]], [12, 0.05, 6])
  for (const sd of [-1, 1]) box(steel, [c[0] + t[0] * sd * 9, c[1] + t[1] * sd * 9, 14.25], [t, nrm, [0, 0, 1]], [1.2, 1.2, 14.25])
}

// ---------------------------------------------------------------------------
// The open end: the scoreboard block, the two ramp rotundas with their
// umbrella roofs, the buff stair towers at the sideline stands' ends.
{
  box(conc, [0.5, -107.5, 16], X, [27.5, 5.5, 16])
  // the video board on the field side, in a dark frame
  box(steel, [0.5, -101.6, 22], X, [21, 0.5, 8.5])
  quad(win, [[-19.5, -101.04, 15], [20.5, -101.04, 15], [20.5, -101.04, 29], [-19.5, -101.04, 29]], [0, 1, 0])
  // the river side: the black "ACRISURE STADIUM" band, glazed floors
  box(steel, [0.5, -113.3, 22.5], X, [22, 0.4, 1.6])
  for (const [z0, z1] of [[10, 19], [26, 30.5]]) quad(win, [[-22, -113.06, z0], [23, -113.06, z0], [23, -113.06, z1], [-22, -113.06, z1]], [0, -1, 0])
  // the lattice stair tower up its middle
  box(steel, [-8, -113.9, 16.5], X, [1.6, 0.9, 16.5])
}
for (const s of [1, -1]) {
  const c: XY = [s * 75, -103.5]
  // the ramps: four open levels, grey parapets over dark gaps
  cylinder(win, c, 15.5, 0, 24, 16)
  for (const z of [5.5, 10.5, 15.5, 20.5]) {
    cylinder(conc, c, 17.5, z - 2, z, 16, conc)
    cylinder(conc, c, 17.4, z - 2.04, z - 2, 16) // underside lip
  }
  cylinder(conc, c, 17.5, 22, 24.5, 16, conc)
  // the core and the umbrella: a white octagonal cone on a mast
  cylinder(steel, c, 1.2, 24.5, 31, 8)
  const R = 14, z0 = 30, z1 = 35.5
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * 2 * Math.PI, b = ((i + 1.5) / 8) * 2 * Math.PI
    const A: V3 = [c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R, z0], B: V3 = [c[0] + Math.cos(b) * R, c[1] + Math.sin(b) * R, z0]
    const T: V3 = [c[0], c[1], z1]
    quad(roof, [A, B, T, T], [0, 0, 1])
    quad(roof, [A, B, [c[0], c[1], z0 + 0.6], [c[0], c[1], z0 + 0.6]], [0, 0, -1])
  }
  // the buff stair tower at the sideline stand's end
  box(buff, [s * 97, -92, 22], X, [7, 4, 22])
}

if (import.meta.main) {
  await save('pit-acrisure-stadium', 'Acrisure Stadium', [
    { part: seats, material: finish('acrisure-gold', 0xe2b84a) },
    { part: conc, material: finish('acrisure-concrete', 0xd6d5d0) },
    { part: buff, material: finish('acrisure-precast', 0xdac9a6) },
    { part: steel, material: finish('acrisure-steel', 0x4a4f57) },
    { part: roof, material: finish('acrisure-roof', 0xeceeed) },
    { part: win, material: PALETTE.window },
  ], { bearing: 335, osm: 'relation/19912629', height: 56, elevation: 0 }, 6500)
}
