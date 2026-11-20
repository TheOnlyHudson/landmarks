/**
 * Huntington Bank Field, Cleveland (NFL, Cleveland Browns; opened 1999 as
 * Cleveland Browns Stadium, HOK Sport; FirstEnergy Stadium 2013-2023) —
 * procedural, CC0-1.0, no textures.  bun generators/cle-huntington-bank-field.ts
 *
 * Map frame: x across the field (+x the south-east sideline, towards the
 * Shoreway and downtown), y along it (+y the north-east end, towards the
 * Great Lakes Science Center), z up, metres. Placed at bearing 56°, the long
 * axis of the field ring (inner way/172658199) and of the bowl in the lidar.
 * Anchor: area centroid of the outline way/41020147, -81.699621, 41.506065.
 * The stands are lofted round C = (5.6, 1.2), the centre of the field ring.
 *
 * z = 0 is the field. The lidar puts the plazas round the stadium (Alfred
 * Lerner Way, the gates, the lake-side terrace) 6.2 m above it, and the
 * lake-side car parks 0.5-1 m above it. The map's Mapterhorn terrain
 * already carries that pit (field 0.9-1.3 m, the plaza ring 7.1-7.4 m above
 * the lowest point), so `elevation` is 0, as for Comerica Park, PNC Park
 * and Acrisure Stadium. No published field level was found; the 6.2 m is
 * the lidar's. The pitch is the map's (STYLE.md, "Don't model the ground").
 *
 * What makes it read as itself, from the photos: the two tall sideline
 * stands, each a three-tier crescent whose upper deck rises to a thin flat
 * canopy with a white lighting gantry along its front, and whose back hangs
 * out over the base building as a grey sloped underside on big white
 * raking struts; the lower ends, two tiers under the scoreboards, with grey
 * end buildings trimmed in Browns orange; the open corners on the city
 * (south-east) side, where the orange seats show from the street; the pale
 * grey panel and teal-glass base building round the outside, about 26 m
 * over the plaza.
 *
 * Evidence
 * - OSM: building=stadium relation/2305349 (outer way/41020147, which also
 *   carries leisure=stadium, name, Q1100756; inner way/172658199, the field).
 *   No building:part or other building is mapped inside the outline.
 * - Measured, lidar: USGS 3DEP OH_Statewide_Phase1_1_2019 (flown 2019), 1 m
 *   grid, read along rays from C every 2-5° (tables LOWER, SE, NW below),
 *   heights above the field (2.0 m above the box's lowest return):
 *   - lower bowl rising to 6.1 m (south-east side), 8.4 m (north-west
 *     side), 8.3 m (ends); the club face to 13.7 / 14.7 / 14.6 m; the
 *     second tier to 20.7 / 18.5 / 22 m;
 *   - sidelines: upper deck front 27 m, 36.6 m at the canopy front; canopy
 *     top 49.7 m, the lighting gantry on its front 53.1 m; canopy 14-16 m
 *     deep; base roof 32.7 m mid-side, 27-29 m towards the ends, about
 *     6 m outside the canopy's back; stair towers to 35-37 m on the
 *     north-west side;
 *   - the north-east end building 29.5 m, its west half 41.2 m; the
 *     south-west end building 37.6 m falling to 34 m at its back;
 *     scoreboards 45.5 m (main boards), 41-43.5 m (side boards);
 *   - the open corners on the south-east side: seats only, to 11-14 m.
 * - Measured, USGS NAIP orthophoto (0.42 m): plan; orange and brown seats;
 *   the canopies' pale roofs; the end buildings' white roofs with orange
 *   edges.
 * - Published (Wikipedia, "Huntington Bank Field"): opened 1999; HOK Sport;
 *   capacity about 67,000. OSM height 52.1 m.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Erik Drost, "Cleveland Browns Stadium 2012" (CC BY 2.0; the south-east
 *     sideline from the Shoreway: base building, rakers, canopy, gantry)
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Browns_Stadium_2012.jpg
 *   Erik Drost, "Cleveland Browns Stadium 16-06-2012 2" (CC BY 2.0; the
 *     south-east gate: lettering band, Y columns, glass, rakers)
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Browns_Stadium_16-06-2012_2.jpg
 *   Cards84664, "Cleveland Browns stadium from Convention Center" (CC BY-SA
 *     4.0; the south-east side and the south-west end building)
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Browns_stadium_from_Convention_Center.png
 *   Michael Barera, "Cleveland August 2015 50 (FirstEnergy Stadium)" and
 *     "... 08" (CC BY-SA 4.0; the south and south-west: end building with
 *     orange trim, corner seats, glass)
 *     https://commons.wikimedia.org/wiki/File:Cleveland_August_2015_50_(FirstEnergy_Stadium).jpg
 *     https://commons.wikimedia.org/wiki/File:Cleveland_August_2015_08_(FirstEnergy_Stadium).jpg
 *   Erik Drost, "Rock and Roll Hall of Fame and Cleveland Browns Stadium"
 *     (CC BY 2.0; the north-east end and its scoreboard from the east)
 *     https://commons.wikimedia.org/wiki/File:Rock_and_Roll_Hall_of_Fame_and_Cleveland_Browns_Stadium.jpg
 *   Erik Drost, "Cleveland National Air Show (51444226105) (Browns
 *     Stadium)" (CC BY 2.0; from the west over the lake: north-west
 *     sideline, south-west end, the open south corner)
 *     https://commons.wikimedia.org/wiki/File:Cleveland_National_Air_Show_(51444226105)_(Browns_Stadium).jpg
 *   Heather McLaughlin, "Cleveland Browns Stadium" (CC BY 2.0; from the
 *     south: south-east sideline, the open east corner, north-east end)
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Browns_Stadium.jpg
 *   Ak169808, "Cleveland Browns Stadium August 2010" (CC BY-SA 3.0) and
 *     Erik Drost, "FirstEnergy Stadium 2014" (CC BY 2.0): the bowl from
 *     inside, the tiers, the end scoreboards, the orange seats.
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Browns_Stadium_August_2010.jpg
 *     https://commons.wikimedia.org/wiki/File:FirstEnergy_Stadium_2014.jpg
 * - Estimated: the raking struts' spacing (about every 8°, from the 2012
 *   photo) and size; the canopy underside 47.8 m; the glass bands on the
 *   base building and end buildings; the scoreboards' bottoms (the lidar
 *   gives only their tops); the seats under the canopy (continued at the
 *   upper deck's measured rake).
 * - Not drawn: the scoreboards' images and lettering, the "Cleveland
 *   Browns" lettering bands, the gantry's lattice (a solid white band), the
 *   lamp heads, flagpoles, the stair and ramp towers at the open corners.
 * - Doubts: the brief named four corner light towers and a press tower on
 *   the west side. Neither is in the lidar or the photos: the lights are on
 *   the canopy gantries, and the press and suite levels are inside the
 *   sideline stands. The north-east end's taller west half (41 m) is drawn
 *   as the lidar has it; no photo shows it squarely.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, loftSections, prism, quad, rayHit, triangulate, type SectionPt, type XY } from './dc-nationals-park'

// OSM in this frame (bearing 56°, about the anchor).
const OUTLINE: XY[] = [[-110.9, -8.3], [-110.9, 6.9], [-110.4, 21.9], [-108.9, 36.6], [-106.3, 52.3], [-103.3, 66.1], [-99.8, 80.5], [-93.5, 94.3], [-84.3, 106.6], [-73.1, 116.6], [-64.6, 122.1], [-55.1, 127.5], [-52.5, 122.3], [-43.7, 126.1], [-15.8, 129.8], [13.9, 130.1], [30.9, 128.5], [45.4, 126.7], [43.5, 113.0], [55.3, 108.9], [59.0, 106.7], [65.1, 103.0], [72.9, 96.3], [87.9, 108.5], [92.8, 102.4], [97.5, 96.1], [101.1, 89.2], [104.0, 82.3], [106.1, 75.1], [108.0, 68.1], [109.7, 60.7], [111.3, 52.7], [112.1, 45.5], [109.6, 45.0], [111.4, 23.4], [112.0, 8.1], [112.3, -6.8], [111.1, -21.9], [109.4, -42.1], [111.7, -42.7], [110.4, -51.6], [104.0, -79.9], [96.8, -94.2], [87.8, -106.1], [75.9, -97.5], [66.4, -106.0], [54.2, -111.9], [44.3, -115.1], [45.5, -126.5], [14.2, -130.1], [-15.2, -130.2], [-45.0, -127.4], [-58.3, -122.4], [-59.3, -125.0], [-72.0, -116.7], [-83.3, -106.9], [-92.5, -95.1], [-99.0, -81.7], [-102.7, -67.3], [-105.9, -53.0], [-108.8, -37.8], [-110.2, -23.0]]
// The field ring, inner way/172658199: its edge is the field wall.
const FIELD: XY[] = [[-24.7, 63.0], [-26.8, 62.0], [-28.7, 60.1], [-29.9, 58.0], [-32.6, 46.2], [-34.7, 35.1], [-36.3, 23.9], [-37.1, 12.1], [-37.1, 1.2], [-36.9, -10.4], [-36.1, -21.4], [-34.7, -32.8], [-29.8, -55.1], [-27.8, -57.7], [-23.8, -59.8], [-11.3, -61.1], [-0.3, -61.6], [11.2, -61.6], [22.6, -60.9], [34.5, -59.5], [37.7, -58.2], [41.0, -55.0], [43.6, -43.6], [45.4, -32.2], [47.0, -20.9], [48.0, -9.9], [48.4, 1.9], [47.9, 13.0], [47.0, 24.3], [45.6, 35.5], [43.7, 46.8], [41.1, 57.7], [39.4, 60.9], [37.0, 63.3], [34.9, 64.1], [34.6, 62.1], [22.1, 63.7], [10.7, 64.1], [-0.5, 63.9], [-12.0, 63.2], [-24.1, 61.6]]

const C: XY = [5.6, 1.2]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const wallR = (a: number) => rayHit(FIELD, C, dirOf(a))
const outlineR = (a: number) => rayHit(OUTLINE, C, dirOf(a))

const panel = new Part(), trim = new Part(), roof = new Part(), seats = new Part(), suites = new Part(), glass = new Part()

/** Linear interpolation in a table of rows keyed by angle (column 0). */
function at(rows: number[][], a: number, col: number) {
  if (a <= rows[0][0]) return rows[0][col]
  for (let i = 0; i < rows.length - 1; i++) if (a <= rows[i + 1][0]) {
    const f = (a - rows[i][0]) / (rows[i + 1][0] - rows[i][0])
    return rows[i][col] + (rows[i + 1][col] - rows[i][col]) * f
  }
  return rows[rows.length - 1][col]
}

// ---------------------------------------------------------------------------
// The lower bowl and second tier, all the way round: [θ, club face r, second
// tier back r] from the lidar every 5°. Heights by side (lidar): lower bowl
// top, club face top, second tier top.
const LOWER: number[][] = [
  [0, 87, 103], [5, 87, 103], [10, 88, 104], [15, 89, 106], [20, 90, 108.5], [25, 100, 112], [30, 100, 116],
  [35, 84, 99], [40, 80.5, 96.5], [45, 75.5, 93.5], [50, 72, 89.5], [55, 68.5, 86], [60, 66, 82.5], [65, 63.5, 79.5],
  [70, 62, 77.5], [75, 61.5, 77], [80, 60.5, 75.5], [85, 60, 75], [90, 60, 74.5], [95, 60, 75.5], [100, 60.5, 76],
  [105, 61.5, 76.5], [110, 63, 77.5], [115, 64, 80.5], [120, 66.5, 82.5], [125, 69.5, 86.5], [130, 72.5, 90],
  [135, 76.5, 94], [140, 81.5, 98], [145, 85, 101], [150, 97, 112], [155, 100, 112], [160, 91, 108.5], [165, 89.5, 108],
  [170, 88.5, 106.5], [175, 87, 105], [180, 87.5, 104.5], [185, 87.5, 104.5], [190, 88, 105], [195, 89.5, 107],
  [200, 90.5, 107.5], [205, 91.5, 101.5], [210, 91.5, 100.5], [215, 89.5, 99.5], [220, 86, 97], [225, 83, 93.5],
  [230, 78.5, 89], [235, 74.5, 85], [240, 72, 83], [245, 69.5, 80], [250, 67.5, 77.5], [255, 67, 77], [260, 66, 75.5],
  [265, 65, 75], [270, 65.5, 74.5], [275, 65.5, 74.5], [280, 66, 76], [285, 67, 76.5], [290, 68.5, 78.5], [295, 70, 80],
  [300, 72.5, 82.5], [305, 75, 85], [310, 78.5, 89.5], [315, 83, 94], [320, 86.5, 98], [325, 90.5, 100], [330, 91.5, 101.5],
  [335, 91, 101], [340, 90.5, 100.5], [345, 89, 100], [350, 88, 104.5], [355, 86.5, 104], [360, 87, 103],
]
/** [lower bowl top, club face top, second tier top] by angle. */
function tiers(a: number): [number, number, number] {
  const corner = (a > 21 && a < 34) || (a > 146 && a < 159)
  if (corner) return [11, 12.4, 13.8] // the open corners: seats only
  if (a >= 34 && a <= 146) return [6.1, 13.7, 20.7] // south-east side
  if (a >= 202 && a <= 333) return [8.4, 14.7, 18.5] // north-west side
  return [8.3, 14.6, 22.0] // the ends
}
{
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 2.5) angles.push(a)
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a % 360), r13 = at(LOWER, a, 1), r26 = at(LOWER, a, 2)
    const [zlb, zc, zm] = tiers(a % 360)
    return [
      { r: rw, z: 0, part: roof }, // the field wall
      { r: rw, z: 1.2, part: seats }, // lower bowl
      { r: r13, z: zlb, part: suites }, // club face
      { r: r13, z: zc, part: seats }, // second tier
      { r: r26, z: zm, part: panel }, // its back wall (inside the upper stands or end buildings, open at the corners)
      { r: r26, z: 0, part: null },
    ]
  }), null)
}

// ---------------------------------------------------------------------------
// The sideline upper stands: [θ, canopy front r, canopy back r, base roof z],
// lidar, smoothed over 2° samples. The upper deck's front stands on the
// second tier's back (LOWER), at 27 m.
const SE: number[][] = [
  [38, 114.5, 130, 28], [42, 113, 128, 27], [46, 110.5, 125.5, 27], [50, 107.5, 123, 26.5], [54, 103.5, 119.5, 27.5],
  [58, 101, 116, 27], [62, 98.5, 113.5, 27], [66, 96.5, 111, 32.7], [70, 95.5, 109.5, 32.7], [74, 93.5, 108, 32.7],
  [78, 92.5, 107, 32.7], [82, 92, 106, 32.7], [86, 91, 105.5, 32.7], [90, 91, 105, 32.7], [94, 91.5, 105.5, 32.7],
  [98, 91.5, 106.5, 32.7], [102, 93, 107, 32.7], [106, 93.5, 108, 32.7], [110, 95, 110, 32.7], [114, 96.5, 111.5, 32.7],
  [118, 99, 113.5, 27], [122, 101.5, 117, 27], [126, 104.5, 120, 27], [130, 108, 124, 27], [134, 111, 125.5, 27],
  [138, 113.5, 128.5, 28.5], [142, 116, 131.5, 28.5],
]
const NW: number[][] = [
  [206, 118.5, 132, 27], [210, 117.5, 131, 27.5], [214, 117.5, 131, 27], [218, 114.5, 129.5, 28], [222, 113.5, 128, 27],
  [226, 110.5, 125.5, 28], [230, 107.5, 122.5, 28.5], [234, 103.5, 119.5, 28.2], [238, 101, 116, 28.7], [242, 98, 114, 29.7],
  [246, 96.5, 111, 35.8], [250, 94.5, 109.5, 35.3], [254, 93.5, 108.5, 32.7], [258, 92.5, 107, 32.7], [262, 91.5, 106, 32.7],
  [266, 91.5, 105.5, 32.7], [270, 90.5, 105.5, 32.7], [274, 91.5, 106, 32.7], [278, 91.5, 106.5, 32.7], [282, 93, 107, 32.7],
  [286, 94, 108, 33], [290, 95, 110, 36.6], [294, 96.5, 111.5, 36.8], [298, 99, 114.5, 30], [302, 101.5, 117, 28.7],
  [306, 104.5, 120, 28.2], [310, 108, 123.5, 28.2], [314, 111, 126.5, 27.6], [318, 113.5, 128.5, 27], [322, 116, 131, 28],
  [326, 116.5, 131.5, 28.8], [330, 118, 132, 28], [334, 118, 132, 30],
]
const ZU = 27, ZF = 36.6, CAN_TOP = 49.7, CAN_BOT = 47.8, GANTRY = 53.1

/** Close the end of a lofted ring section with a flat cap. */
function capSection(a: number, pts: XY[], part: Part, sgn: 1 | -1) {
  const d = dirOf(a)
  const side: V3 = [d[1] * sgn, -d[0] * sgn, 0]
  const to3 = (p: XY): V3 => [C[0] + d[0] * p[0], C[1] + d[1] * p[0], p[1]]
  for (const [i, j, k] of triangulate(pts)) quad(part, [to3(pts[i]), to3(pts[j]), to3(pts[k]), to3(pts[k])], side)
}

function sideline(rows: number[][]) {
  const angles = rows.map((r) => r[0])
  const geo = rows.map(([a, rcf, rcb, zout]) => {
    const r26 = at(LOWER, a, 2), zm = tiers(a)[2]
    const k = (ZF - ZU) / (rcf - r26) // the upper deck's rake
    const rTop = rcb - 1.5, zTop = Math.min(CAN_BOT - 0.6, ZU + (rTop - r26) * k)
    const rout = Math.min(rcb + 6, outlineR(a) + 4)
    const rUnder = rcb - 9
    return { a, rcf, rcb, zout, r26, zm, rTop, zTop, rout, rUnder }
  })
  // The upper deck and the base building below its back.
  loftSections(C, angles, geo.map((g) => [
    { r: g.r26, z: g.zm, part: suites }, // the suite face under the deck's front
    { r: g.r26, z: ZU, part: seats }, // upper deck, on under the canopy
    { r: g.rTop, z: g.zTop, part: roof },
    { r: g.rcb - 0.5, z: CAN_BOT - 0.2, part: roof }, // the deck's underside, out over the base
    { r: g.rUnder, z: g.zout, part: roof }, // base building roof
    { r: g.rout, z: g.zout, part: trim }, // its cornice
    { r: g.rout, z: g.zout - 1.4, part: panel }, // its street wall
    { r: g.rout, z: 0, part: null },
  ] as SectionPt[]), panel)
  // The canopy, with the white lighting gantry along its front.
  const canopy = (g: (typeof geo)[number]): XY[] => [
    [g.rcf - 0.4, CAN_BOT], [g.rcf - 0.4, GANTRY], [g.rcf + 0.9, GANTRY], [g.rcf + 0.9, CAN_TOP], [g.rcb, CAN_TOP], [g.rcb, CAN_BOT],
  ]
  const parts = [trim, trim, trim, panel, trim, roof]
  loftSections(C, angles, geo.map((g) => [...canopy(g), canopy(g)[0]].map(([r, z], i) => ({ r, z, part: parts[i] ?? null }))), null)
  capSection(angles[0], canopy(geo[0]), trim, -1)
  capSection(angles[angles.length - 1], canopy(geo[geo.length - 1]), trim, 1)
  // The white raking struts on the deck's underside, about every 8°.
  for (let i = 1; i < geo.length - 1; i += 2) {
    const g = geo[i], d = dirOf(g.a)
    const p = (r: number, z: number): V3 => [C[0] + d[0] * r, C[1] + d[1] * r, z]
    const lo = p(g.rUnder - 0.4, g.zout), hi = p(g.rcb + 0.1, CAN_BOT - 0.2)
    const len = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2])
    const ax: V3 = [(hi[0] - lo[0]) / len, (hi[1] - lo[1]) / len, (hi[2] - lo[2]) / len]
    const t: V3 = [d[1], -d[0], 0]
    const n: V3 = [ax[1] * t[2] - ax[2] * t[1], ax[2] * t[0] - ax[0] * t[2], ax[0] * t[1] - ax[1] * t[0]]
    const out: V3 = n[2] < 0 ? n : [-n[0], -n[1], -n[2]] // away from the deck: out and down
    const c: V3 = [(lo[0] + hi[0]) / 2 + out[0] * 0.5, (lo[1] + hi[1]) / 2 + out[1] * 0.5, (lo[2] + hi[2]) / 2 + out[2] * 0.5]
    box(trim, c, [ax, t, out], [len / 2, 1.3, 0.7])
  }
  // Glass on the base building's street wall: two broad bands per bay,
  // between precast piers.
  for (let i = 0; i < geo.length - 1; i++) {
    const g0 = geo[i], g1 = geo[i + 1]
    const d0 = dirOf(g0.a), d1 = dirOf(g1.a)
    const P0: XY = [C[0] + d0[0] * g0.rout, C[1] + d0[1] * g0.rout], P1: XY = [C[0] + d1[0] * g1.rout, C[1] + d1[1] * g1.rout]
    const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), e: XY = [(P1[0] - P0[0]) / L, (P1[1] - P0[1]) / L]
    const nrm: V3 = [-e[1], e[0], 0]
    const o: V3 = nrm[0] * (P0[0] - C[0]) + nrm[1] * (P0[1] - C[1]) > 0 ? nrm : [e[1], -e[0], 0]
    const top = Math.min(g0.zout, g1.zout) - 2.6
    for (const [z0, z1] of [[8.4, 17.6], [19.2, top]]) {
      const q = (u: number, z: number): V3 => [P0[0] + e[0] * u + o[0] * 0.06, P0[1] + e[1] * u + o[1] * 0.06, z]
      quad(glass, [q(1.0, z0), q(L - 1.0, z0), q(L - 1.0, z1), q(1.0, z1)], o)
    }
  }
}
sideline(SE)
sideline(NW)

// ---------------------------------------------------------------------------
// The end buildings behind the end stands (lidar heights above the field),
// grey panels with an orange band at the roof edge, and their scoreboards.
function endBlock(poly: XY[], h: number, band = true) {
  prism(poly, 0, h - (band ? 1.6 : 1.0), panel, null)
  prism(poly, h - (band ? 1.6 : 1.0), h, band ? seats : trim, roof)
}
const NE_A: XY[] = [[-46, 103.5], [-4, 103.5], [-4, 123], [-46, 123]]
const NE_B: XY[] = [[-4, 103.5], [52, 103.5], [52, 123.5], [-4, 123.5]]
const NE_C: XY[] = [[52, 101], [61, 101], [61, 121], [52, 121]]
endBlock(NE_A, 41.2)
endBlock(NE_B, 29.5)
endBlock(NE_C, 19.5, false)
// South-west: the roof falls from 37.6 m at the stands to 34 m at the back.
{
  const x0 = -44, x1 = 56, yf = -103, yb = -125, zf = 37.6, zb = 34
  prism([[x0, yb], [x1, yb], [x1, yf], [x0, yf]], 0, zb - 1.6, panel, null)
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  const bandF = zf - 1.6, bandB = zb - 1.6
  quad(seats, [P(x0, yf, bandF), P(x1, yf, bandF), P(x1, yf, zf), P(x0, yf, zf)], [0, 1, 0])
  quad(panel, [P(x0, yf, bandB), P(x1, yf, bandB), P(x1, yf, bandF), P(x0, yf, bandF)], [0, 1, 0])
  quad(seats, [P(x0, yb, bandB), P(x1, yb, bandB), P(x1, yb, zb), P(x0, yb, zb)], [0, -1, 0])
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
    quad(seats, [P(x, yb, bandB), P(x, yf, bandF), P(x, yf, zf), P(x, yb, zb)], [s, 0, 0])
  }
  quad(roof, [P(x0, yb, zb), P(x1, yb, zb), P(x1, yf, zf), P(x0, yf, zf)], [0, 0.16, 1])
}

/** A scoreboard: dark board on a white frame down to the roof below. */
function board(x0: number, x1: number, yFace: number, depth: number, z0: number, z1: number, zBase: number) {
  const s = Math.sign(yFace) // the board faces the field (-s)
  const yc = yFace + (s * depth) / 2
  box(suites, [(x0 + x1) / 2, yc, (z0 + z1) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [(x1 - x0) / 2, depth / 2, (z1 - z0) / 2], true)
  box(seats, [(x0 + x1) / 2, yc, z1 + 0.9], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [(x1 - x0) / 2 + 0.3, depth / 2 + 0.3, 0.9]) // its orange crown band
  box(seats, [(x0 + x1) / 2, yFace + s * (depth + 0.03), (z0 + z1) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [(x1 - x0) / 2 - 0.4, 0.03, (z1 - z0) / 2 - 0.4]) // its orange back
  if (z0 > zBase + 0.5) for (const x of [x0 + 2, (x0 + x1) / 2, x1 - 2]) {
    box(trim, [x, yc, (zBase + z0) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.6, depth / 2 - 0.3, (z0 - zBase) / 2])
  }
}
board(-16, 8, 104.5, 4, 32, 44.5, 29.5) // north-east main board
board(-36, -16, 104.5, 2.5, 36, 42.5, 29.5)
board(20, 44, 104.5, 2.5, 36, 42.5, 29.5)
board(-32, 0, -102.5, 4, 34, 44.6, 37.6) // south-west main board
board(6, 20, -102.5, 2.5, 35, 40, 37.6)

// Glass on the end buildings' street faces and on the field faces above
// the end stands.
function bays(a: XY, b: XY, out: V3, rows: [number, number][], bay = 9, part = glass) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n = Math.max(1, Math.round(L / bay))
  for (let i = 0; i < n; i++) {
    const u0 = (L / n) * i + 1.0, u1 = (L / n) * (i + 1) - 1.0
    for (const [z0, z1] of rows) {
      const q = (u: number, z: number): V3 => [a[0] + e[0] * u + out[0] * 0.06, a[1] + e[1] * u + out[1] * 0.06, z]
      quad(part, [q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1)], out)
    }
  }
}
bays([-46, 123], [52, 123.5], [0, 1, 0], [[8.4, 16.5], [18, 26.5]])
bays([52, 101], [61, 101], [0, -1, 0], [[8.4, 16.5]])
bays([61, 101], [61, 121], [1, 0, 0], [[8.4, 16.5]])
bays([-44, -125], [56, -125], [0, -1, 0], [[8.4, 18], [19.5, 29.5]])
bays([-46, 103.5], [52, 103.5], [0, -1, 0], [[23, 28]], 8, suites) // suites over the north-east stand
bays([-44, -103], [56, -103], [0, 1, 0], [[23.2, 33.5]], 8, suites) // the south-west club glass

// ---------------------------------------------------------------------------
const parts = [
  { part: panel, material: finish('hbf-panel', 0xd8dbda) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: seats, material: finish('browns-orange', 0xcb7a52) },
  { part: suites, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0x8fb2b8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Huntington Bank Field', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 56, osm: 'relation/2305349', height: GANTRY,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cle-huntington-bank-field.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
