/**
 * PNC Park, Pittsburgh (MLB, Pittsburgh Pirates; 2001, HOK Sport with
 * L.D. Astorino) — procedural, CC0-1.0, no textures.
 * bun generators/pit-pnc-park.ts
 *
 * Map frame: x east, y north, z up, metres (bearing 0). The anchor is the
 * area centroid of the outline (building=stadium relation/2947501, outer
 * way/24722803 less the inner ring way/222405398): -80.005932, 40.447005.
 * Home plate is at the north-west corner of the field, the foul lines run
 * south (first base, to right field on the river) and east (third base,
 * to left field); the stands are lofted round C = (10, -10), near the
 * mound.
 *
 * z = 0 is the field. The lidar puts the streets round the park 2 m above
 * it (General Robinson Street, Federal Street) and the outfield concourse
 * on the river 3.3 m above it; the map's terrain already has the dip (field
 * 4.8 m, streets 6.3-7.4 m), so `elevation` is 0.
 *
 * What makes it read as itself, from the photos: the two-deck grandstand
 * of navy-blue seats wrapped round home plate from the right-field corner
 * on the river to the left-field corner, its blue steel frame showing,
 * under a thin flat grey roof; the buff limestone base buildings with
 * their arches, and the two round limestone rotundas with their ramps at
 * the grandstand's ends; seven tall dark lattice light towers with their
 * lamp banks; the open outfield onto the Allegheny and downtown, the low
 * left-field bleachers and the big scoreboard on its frame behind them, the
 * 21 ft Clemente wall in right field, and the limestone arcade along the
 * riverwalk.
 *
 * Evidence
 * - OSM: outline relation/2947501 (outer way/24722803 with leisure=stadium,
 *   name, Q1151177; inner way/222405398 under part of the field). Buildings
 *   under the model: way/552940773 (the grandstand, building=grandstand),
 *   way/552940779, way/552940815, way/552940817, way/552940819,
 *   way/552940801, way/552914302, way/552914303 (grandstand pieces),
 *   way/552940780, way/552940781, way/552940782, way/552940783,
 *   way/552940787, way/552940792, way/552940796, way/552940799,
 *   way/552940803, way/552918560, way/554734076, way/554734926,
 *   way/554742423 (concourse blocks, rotundas and stands inside or across
 *   the outline).
 * - Measured, lidar: USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid,
 *   read along rays from C every 5° (table GS): the lower bowl rising to
 *   4.7 m above the field, the upper deck's front at 16.2 m rising to
 *   about 28 m at its back, the roof at 36.6 m (+-0.1), 11-14 m deep; the
 *   concourse blocks behind at 13 m; the left-field bleachers to 9 m; the
 *   right-field seats over the Clemente wall to 10-11 m; seven light towers,
 *   tops at 62.5 m (five round the grandstand) and 55 m (two in left
 *   field); the scoreboard frame to 35 m at (123, 3); the rotundas at
 *   (-103, 48) and (104, 48), drums 16 m in radius to 20 m, cores to 29 m.
 * - Measured, USGS NAIP orthophoto (0.38 m): plan, the grey roofs, the
 *   rotundas' spoked roofs, the navy seats.
 * - Published (Wikipedia, "PNC Park"): opened 2001; HOK Sport; two decks,
 *   the upper deck's highest seat 88 ft above the field; the Clemente wall
 *   21 ft high in right field; the limestone facade and blue steel.
 * - Photos (Wikimedia Commons):
 *   Y2kcrazyjoker4, "PNC Park with Roberto Clemente Bridge May 2018"
 *     (CC BY-SA 4.0, from the south-east, the grandstand and towers)
 *     https://commons.wikimedia.org/wiki/File:PNC_Park_with_Roberto_Clemente_Bridge_May_2018.jpg
 *   Y2kcrazyjoker4, "PNC-Park-exterior-in-evening-May-2020" (CC BY-SA 4.0,
 *     from the north: limestone base, rotunda, blue steel, roof)
 *     https://commons.wikimedia.org/wiki/File:PNC-Park-exterior-in-evening-May-2020.jpg
 *   Y2kcrazyjoker4, "Pnc-park-allegheny-river-view" (CC BY 3.0, the
 *     scoreboard on its frame, light towers)
 *     https://commons.wikimedia.org/wiki/File:Pnc-park-allegheny-river-view.jpg
 *   Smallbones, "PNC Park Pittsburgh" (CC0, from the river: the arcade,
 *     the grandstand, the towers)
 *     https://commons.wikimedia.org/wiki/File:PNC_Park_Pittsburgh.JPG
 *   Justin417, "PNC Park Pittsburgh PA" (CC BY-SA 4.0, from across the
 *     river)
 *     https://commons.wikimedia.org/wiki/File:PNC_Park_Pittsburgh_PA.JPG
 *   Barry Wise, "PNC Park (14089233288)" (CC BY-SA 2.0, from the North
 *     Shore riverwalk opposite)
 *     https://commons.wikimedia.org/wiki/File:PNC_Park_(14089233288).jpg
 * Estimated: everything under the roof (the upper deck's back), the
 * light towers' legs and lamp banks (lidar gives their places and tops),
 * the scoreboard's face (photo), the arcade's arches (photo; the real
 * arcade runs down to the riverwalk, below the outline), the rotundas'
 * ramp bands.
 * Left out: the field, the "PNC PARK" letters, flags, statues, the bullpens.
 * Doubts: the light towers' legs are drawn to the ground where the real
 * ones stand on the concourse blocks; no photo shows the east rotunda
 * close up (it mirrors the west).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, box, cylinder, loftSections, rayHit, type XY, type SectionPt } from './dc-nationals-park'
import { beam, save } from './phl-lincoln-financial-field'

const seats = new Part(), steel = new Part(), lime = new Part(), roof = new Part(), conc = new Part(), win = new Part()
const C: XY = [10, -10]
const H: XY = [-40, 44] // home plate (NAIP)
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const at = (a: number, r: number, z: number): V3 => { const d = dirOf(a); return [C[0] + d[0] * r, C[1] + d[1] * r, z] }

// OSM outline (outer way/24722803), relative to C.
const OUTLINE: XY[] = ([[-72.9, -129.6], [-75.8, -127.4], [-78.2, -129.8], [-83.2, -125.3], [-86.6, -122.3], [-83.2, -119.0], [-81.1, -120.7], [-79.5, -118.7], [-77.6, -115.7], [-76.2, -111.7], [-75.4, -107.6], [-75.1, -104.8], [-77.3, -105.4], [-77.7, -100.0], [-78.6, -96.2], [-80.2, -92.5], [-82.2, -89.0], [-86.2, -84.7], [-90.9, -81.8], [-96.8, -79.8], [-103.0, -54.7], [-104.6, -48.2], [-108.9, -30.5], [-105.5, -29.4], [-108.2, -16.9], [-101.6, -15.3], [-105.1, -4.0], [-111.2, -5.7], [-115.2, 10.5], [-117.0, 17.5], [-123.2, 42.9], [-119.3, 43.7], [-119.3, 48.4], [-118.9, 50.7], [-117.9, 53.5], [-116.4, 56.2], [-114.8, 58.4], [-112.4, 60.6], [-109.9, 62.3], [-111.8, 65.7], [-83.2, 72.5], [-76.5, 74.1], [-60.3, 78.0], [-61.0, 81.2], [-48.0, 84.6], [-47.1, 81.2], [-4.7, 91.2], [-5.5, 95.0], [8.2, 98.1], [8.9, 94.7], [29.8, 99.6], [36.7, 101.3], [83.6, 112.3], [85.9, 102.8], [86.3, 100.9], [93.5, 70.5], [94.3, 67.4], [94.4, 65.3], [92.9, 63.5], [95.3, 62.1], [100.0, 64.8], [108.9, 66.1], [114.2, 64.2], [120.1, 58.3], [122.6, 52.7], [122.0, 44.1], [124.6, 43.9], [125.5, 45.8], [127.0, 46.1], [129.0, 46.5], [135.8, 48.0], [138.0, 48.5], [145.0, 50.0], [148.7, 34.5], [159.6, -11.8], [153.1, -13.5], [153.3, -14.5], [151.0, -14.9], [155.2, -32.2], [136.6, -36.6], [123.9, -39.9], [117.3, -42.6], [112.6, -45.8], [109.6, -49.2], [107.4, -52.5], [105.7, -55.4], [103.6, -60.6], [101.1, -65.3], [98.4, -70.3], [94.7, -74.9], [90.0, -80.1], [89.1, -80.9], [88.8, -81.2], [88.3, -81.7], [85.5, -84.3], [79.8, -88.4], [74.9, -91.7], [69.3, -94.3], [63.5, -96.7], [56.1, -98.5], [0.7, -112.2], [-27.7, -118.8], [-53.6, -125.0]] as XY[]).map(([x, y]) => [x - C[0], y - C[1]] as XY)
const RO = (a: number) => rayHit(OUTLINE, [0, 0], dirOf(a))

/**
 * The grandstand from the lidar, every 5° (angles past 360 wrap): [angle,
 * field wall, upper deck front, roof front, roof back]. Radii from C, the
 * wall smoothed over three samples.
 */
const GS: [number, number, number, number, number][] = [
  [200, 60, 79, 99, 111.5], [205, 57, 75.5, 95, 108.5], [210, 54.5, 73, 92.5, 104], [215, 52, 71, 89.5, 101.5],
  [220, 49.5, 69.5, 87.5, 99.5], [225, 47.5, 66.5, 86, 98], [230, 46, 65.5, 83, 94.5], [235, 45, 63.5, 81, 93],
  [240, 44, 62.5, 80, 91.5], [245, 43, 61.5, 79.5, 91.5], [250, 41.5, 62, 80, 91.5], [255, 40.5, 62.5, 81, 92.5],
  [260, 41, 63.5, 82, 94.5], [265, 42, 65.5, 84.5, 96.5], [270, 43.5, 67.5, 86.5, 98.5], [275, 46, 70, 88.5, 101],
  [280, 48, 72.5, 90.5, 102], [285, 50, 74, 92, 104], [290, 50.5, 75, 93, 105], [295, 50, 75.5, 93, 105],
  [300, 48.5, 75.5, 94, 104.5], [305, 47, 75, 93, 104], [310, 46.5, 73.5, 92, 103.5], [315, 45.5, 72.5, 91, 102.5],
  [320, 44, 70.5, 89, 101], [325, 42.5, 67.5, 85.5, 97.5], [330, 41, 65, 83.5, 95], [335, 40.5, 64, 82, 93],
  [340, 41, 63, 81, 92], [345, 43, 62.5, 80, 91.5], [350, 45, 63, 80.5, 91.5], [355, 45.5, 63.5, 81.5, 92.5],
  [360, 46.5, 64.5, 82.5, 94.5], [365, 47.5, 66.5, 84.5, 97], [370, 49, 68.5, 87.5, 100], [375, 51, 71.5, 91.5, 104],
  [380, 54, 76, 96, 108], [385, 57.5, 80, 99, 110], [390, 61, 82, 99.5, 110], [395, 63, 83.5, 99.5, 110.5],
  [400, 64.5, 84, 100, 112], [405, 66, 85, 101, 113],
]
// The outfield wall, every 15° from the left-field corner round to the
// right-field corner (lidar, NAIP).
const OF: [number, number][] = [[405, 66], [420, 82.5], [435, 87.5], [450, 89], [465, 86.5], [480, 82], [495, 78], [510, 76], [525, 76.5], [540, 77], [555, 68], [560, 60]]
const lerpTab = (tab: [number, number][], a: number) => {
  for (let i = 0; i < tab.length - 1; i++) if (a >= tab[i][0] && a <= tab[i + 1][0]) {
    const t = (a - tab[i][0]) / (tab[i + 1][0] - tab[i][0]); return tab[i][1] + (tab[i + 1][1] - tab[i][1]) * t
  }
  return tab[tab.length - 1][1]
}
const STREET = 2, RIVERSIDE = 3.3

// ---------------------------------------------------------------------------
// The outfield, from the left-field corner (405°) round to the right-field
// corner (560°): the wall (the Clemente wall in right field, 21 ft), the
// left-field bleachers, the right-field seats, the concourse out to the
// outline, its limestone face.
{
  const angles: number[] = []
  for (let a = 405; a <= 560; a += 5) angles.push(a)
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const rw = lerpTab(OF, a), ro = Math.max(RO(a % 360), rw + 12)
    const left = a < 465, right = a > 520
    const hw = right ? 6.4 : 3
    const rs = left ? Math.min(rw + 24, ro - 4) : right ? Math.min(rw + 14, ro - 3) : rw + 3
    const zs = left ? 9 : right ? 10.5 : RIVERSIDE
    const zo = left ? 11 : RIVERSIDE
    return [
      { r: rw, z: 0, part: conc },
      { r: rw, z: hw, part: left || right ? seats : conc },
      { r: rs, z: zs, part: conc },
      { r: rs + 1.5, z: zo, part: conc },
      { r: ro, z: zo, part: lime },
      { r: ro, z: 0, part: null },
    ]
  }), lime)
  // The riverwalk arcade: round-headed openings in the limestone face.
  for (let k = 0; k < angles.length - 1; k++) {
    const a0 = angles[k], a1 = angles[k + 1]
    if (a0 < 480) continue
    const p0 = at(a0 % 360, RO(a0 % 360), 0), p1 = at(a1 % 360, RO(a1 % 360), 0)
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), ux = (p1[0] - p0[0]) / L, uy = (p1[1] - p0[1]) / L
    const out: V3 = [uy, -ux, 0]
    const n = Math.floor(L / 4.2)
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) * (L / n), cx = p0[0] + ux * t + out[0] * 0.06, cy = p0[1] + uy * t + out[1] * 0.06
      const w = 1.2, zs = 1.6
      const P = (s: number, z: number): V3 => [cx + ux * s, cy + uy * s, z]
      quad(steel, [P(-w, 0.3), P(w, 0.3), P(w, zs), P(-w, zs)], out)
      for (let j = 0; j < 6; j++) {
        const q0 = (Math.PI * j) / 6, q1 = (Math.PI * (j + 1)) / 6
        quad(steel, [P(-w * Math.cos(q0) * 1, zs + w * Math.sin(q0) * 0.9), P(-w * Math.cos(q1), zs + w * Math.sin(q1) * 0.9), P(0, zs), P(0, zs)], out)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// The grandstand, 200°-405°: the lower bowl, the press and suite face, the
// upper deck, its back under the roof, the blue steel frame down to the
// limestone base buildings, the base out to the outline.
{
  const angles = GS.map((g) => g[0])
  loftSections(C, angles, GS.map(([a, rw, rJ, , rR1]): SectionPt[] => {
    const ro = Math.min(Math.max(RO(a % 360), rR1 + 6), rR1 + 32)
    return [
      { r: rw, z: 0, part: conc },
      { r: rw, z: 1.2, part: seats },
      { r: rJ, z: 4.7, part: steel },
      { r: rJ, z: 16.2, part: seats },
      { r: rR1 - 1, z: 28.5, part: steel },
      { r: rR1 - 1, z: 34.6, part: steel },
      { r: rR1 + 1, z: 34.6, part: steel },
      { r: rR1 + 1, z: 13, part: roof },
      { r: ro, z: 13, part: lime },
      { r: ro, z: 0, part: null },
    ]
  }), lime)
  // The roof: a flat slab, grey on top, a dark steel fascia and underside.
  loftSections(C, angles, GS.map(([, , , rR0, rR1]): SectionPt[] => [
    { r: rR0, z: 34.6, part: steel },
    { r: rR0, z: 36.6, part: roof },
    { r: rR1 + 1.6, z: 36.6, part: steel },
    { r: rR1 + 1.6, z: 35.2, part: steel },
    { r: rR0, z: 34.6, part: null },
  ]), steel)
  // Glass on the suite face, on the steel frame behind, and in the
  // limestone base: one panel per 5° bay.
  for (let k = 0; k < GS.length - 1; k++) {
    const A = GS[k], B = GS[k + 1]
    const band = (ra: number, rb: number, z0: number, z1: number, out: number) => {
      const p = [at(A[0], ra + out, z0), at(B[0], rb + out, z0), at(B[0], rb + out, z1), at(A[0], ra + out, z1)]
      const m = (i: number, j: number, t: number): V3 => [p[i][0] + (p[j][0] - p[i][0]) * t, p[i][1] + (p[j][1] - p[i][1]) * t, p[i][2] + (p[j][2] - p[i][2]) * t]
      const mid = dirOf((A[0] + B[0]) / 2)
      quad(win, [m(0, 1, 0.1), m(0, 1, 0.9), m(3, 2, 0.9), m(3, 2, 0.1)], [Math.sign(out) * mid[0], Math.sign(out) * mid[1], 0])
    }
    band(A[2], B[2], 7.5, 13.5, -0.06)
    band(A[4] + 1, B[4] + 1, 17, 31, 0.06)
    const ra = Math.min(Math.max(RO(A[0] % 360), A[4] + 6), A[4] + 32), rb = Math.min(Math.max(RO(B[0] % 360), B[4] + 6), B[4] + 32)
    if (Math.abs(ra - rb) < 5) band(ra, rb, 4, 10, 0.06)
  }
}

// Limestone stair towers rising from the base at the back of the
// grandstand, as the photos from the north and the river show them.
for (const a of [215, 300, 345, 390]) {
  const g = GS.find((q) => q[0] === a)!
  const d = dirOf(a), r = g[4] + 7
  box(lime, at(a, r, 15), [[d[1], -d[0], 0], [d[0], d[1], 0], [0, 0, 1]], [6, 5, 15])
  box(roof, at(a, r, 30.4), [[d[1], -d[0], 0], [d[0], d[1], 0], [0, 0, 1]], [6.3, 5.3, 0.4])
}

// ---------------------------------------------------------------------------
// The rotundas at the grandstand's ends: limestone drums with the ramps'
// dark bands, a core rising to 29 m under a spoked steel roof.
for (const c of [[-103, 48], [104, 48]] as XY[]) {
  cylinder(lime, c, 16, 0, 20, 16, conc)
  for (const z of [5, 10, 15]) cylinder(steel, c, 16.06, z - 1.6, z, 16)
  cylinder(lime, c, 12.5, 20, 28, 16)
  cylinder(win, c, 12.56, 22, 26.5, 16)
  cylinder(roof, c, 13.5, 28, 29, 16, roof)
  for (let i = 0; i < 4; i++) {
    const t = (i * Math.PI) / 4
    beam(steel, [c[0] - Math.cos(t) * 13, c[1] - Math.sin(t) * 13, 29.3], [c[0] + Math.cos(t) * 13, c[1] + Math.sin(t) * 13, 29.3], 0.8, 0.6)
  }
}

// ---------------------------------------------------------------------------
// The light towers: dark lattice masts (four legs, braced), a lamp bank on
// top facing the infield. Lidar places and tops.
function lightTower(c: XY, top: number, w = 7.5) {
  const tgt: XY = [H[0] + 45, H[1] - 45]
  const f = [tgt[0] - c[0], tgt[1] - c[1]], n = Math.hypot(f[0], f[1]), fx = f[0] / n, fy = f[1] / n
  const t: V3 = [fy, -fx, 0], nrm: V3 = [fx, fy, 0]
  const legs: XY[] = [[-1.6, -1.6], [1.6, -1.6], [1.6, 1.6], [-1.6, 1.6]]
  for (const [a, b] of legs) beam(steel, [c[0] + t[0] * a + fx * b, c[1] + t[1] * a + fy * b, 0], [c[0] + t[0] * a + fx * b, c[1] + t[1] * a + fy * b, top - 10], 0.9, 0.9)
  for (let z = 8; z < top - 11; z += 9) for (const s of [-1.4, 1.4]) {
    beam(steel, [c[0] - t[0] * 1.4 + fx * s, c[1] - t[1] * 1.4 + fy * s, z], [c[0] + t[0] * 1.4 + fx * s, c[1] + t[1] * 1.4 + fy * s, z], 0.45, 0.45)
    beam(steel, [c[0] + t[0] * s - fx * 1.4, c[1] + t[1] * s - fy * 1.4, z], [c[0] + t[0] * s + fx * 1.4, c[1] + t[1] * s + fy * 1.4, z], 0.45, 0.45)
  }
  box(steel, [c[0], c[1], top - 5.5], [t, nrm, [0, 0, 1]], [w / 2, 1.2, 5.5], true)
  box(win, [c[0] + fx * 1.23, c[1] + fy * 1.23, top - 5.5], [t, nrm, [0, 0, 1]], [w / 2 - 0.6, 0.05, 4.8]) // lamps: glow at night
}
lightTower([-76, -36], 62.5)
lightTower([-61, -72], 62.5)
lightTower([-26, -115], 62.5)
lightTower([-21, 76], 62.5)
lightTower([18, 85], 62.5)
lightTower([118, 25], 55)
lightTower([129, -20], 55)

// The scoreboard on its steel frame behind the left-field bleachers, facing
// home plate.
{
  const c: XY = [123, 3]
  const f = [H[0] - c[0], H[1] - c[1]], n = Math.hypot(f[0], f[1])
  const nrm: V3 = [f[0] / n, f[1] / n, 0], t: V3 = [nrm[1], -nrm[0], 0]
  box(steel, [c[0], c[1], 26], [t, nrm, [0, 0, 1]], [14, 1.2, 8.5], true)
  box(win, [c[0] + nrm[0] * 1.26, c[1] + nrm[1] * 1.26, 26], [t, nrm, [0, 0, 1]], [12.8, 0.05, 7.3])
  for (const s of [-1, 1]) {
    beam(steel, [c[0] + t[0] * s * 10, c[1] + t[1] * s * 10, 0], [c[0] + t[0] * s * 10, c[1] + t[1] * s * 10, 17.5], 1.2, 1.2)
    beam(steel, [c[0] + t[0] * s * 10 - nrm[0] * 6, c[1] + t[1] * s * 10 - nrm[1] * 6, 0.6], [c[0] + t[0] * s * 10, c[1] + t[1] * s * 10, 17.5], 0.9, 0.9)
  }
}

if (import.meta.main) {
  await save('pit-pnc-park', 'PNC Park', [
    { part: seats, material: finish('pnc-navy', 0x4a5b7f) },
    { part: steel, material: finish('pnc-steel', 0x3f4b60) },
    { part: lime, material: finish('pnc-limestone', 0xe3d4ab) },
    { part: roof, material: finish('pnc-roof', 0xc8cdd1) },
    { part: conc, material: finish('pnc-concrete', 0xd7d5ce) },
    { part: win, material: PALETTE.window },
  ], { bearing: 0, osm: 'relation/2947501', height: 62.5, elevation: 0 }, 6500)
}
