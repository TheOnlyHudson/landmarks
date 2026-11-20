/**
 * Great Lakes Science Center, Cleveland (1996, Levin Porter Associates with
 * E. Verner Johnson): procedural, CC0-1.0.
 * bun generators/cle-great-lakes-science-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 0 (the
 * building mixes two grids, the west wing on 56/146 and the long central
 * bar on about 97, so it is drawn straight from north-up coordinates).
 * Origin: the OSM outline's area centroid (-81.6967767, 41.5074788).
 * z = 0 is the North Coast Harbor promenade on the north side, lake + 1.6 m
 * (lidar; Mapterhorn agrees), the lowest ground under the footprint. The
 * south lawn, drive and entrance lie 5.5-7 m higher: the building is set
 * into the bank, so its south walls rise from the map's ground there.
 * elevation 0.
 *
 * Form: white metal-panelled exhibit blocks with grey granite stair and
 * sign walls; a long central bar (24.4 m) carrying a white steel pyramid
 * frame at its west end, an octagonal glass lantern and a full-height
 * glass tower with a sloped glass top on its north side; a sloped glass
 * entrance atrium on the south; the bronze OMNIMAX dome at the east end;
 * and the Vestas wind turbine on the south lawn.
 *
 * Sources
 * - OSM (ODbL): outline way/101458841 (4 levels, Q5599479); inside it
 *   way/615052745 (Dome Theater, indoor room tagged building=yes),
 *   way/1534267042 (dome part, roof:height 26) and way/1535041639 (glass
 *   part, height 27 from the south street): all replaced.
 *   Not replaced: the solar canopies way/615073750 and way/615073751
 *   (building=roof, along the south drive, not modelled), the NW walkway
 *   way/925750730, and the Rock Hall's ways to the north-east.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid, north-up, heights above the promenade:
 *   main roof 18.2; central bar 24.4, its plan the quad
 *   (-38,-13)(44,-20)(44,-3)(-38,11); pyramid frame centre (-31,1), apex
 *   32; octagonal lantern centre (17,-6), r 6, top 29.5; glass tower rises
 *   from the promenade, its top sloping 26 (south) to 32.5 (north); south
 *   atrium glass 16 falling to 11; NW roof terrace 6.3; north block
 *   (-24..-1, 8..27) 17 (a courtyard at 12 inside it is simplified away);
 *   north block (40..53, 7..17) 13.5; dome lobby 18.2; penthouse by the
 *   dome 27.8. Dome: a sphere fitted to the lidar, R 19 m, centre
 *   (56, -15.5) at z 11.5, top 30.5; footprint r about 18 (the OSM dome
 *   ring, r 13.5, is the theatre inside).
 *   Turbine: the nacelle shows as a line (3,-84)-(9,-80) 31-32 m above the
 *   lawn (5.9 above z = 0): tower at (6,-82), hub 31 m above the lawn,
 *   rotor axis on bearing 236 (as flown in 2019).
 * - Published: the turbine is a Vestas V27 (Commons file titles; V27 rotor
 *   27 m, 225 kW, manufacturer data); Wikipedia "Great Lakes Science
 *   Center" (opened 1996, OMNIMAX dome theatre).
 * - USGS NAIP orthophoto (public domain): plan, the glass lantern and
 *   atrium, the brown-grey roofs.
 * - Photos (Wikimedia Commons, evidence):
 *   - "Great Lakes Science Center", Cards84664, CC BY-SA 4.0, 2021-09-19,
 *     https://commons.wikimedia.org/wiki/File:Great_Lakes_Science_Center.png
 *     (elevated, from the south-west: every block, the pyramid frame, the
 *     glass atrium and lanterns, the dome, the turbine)
 *   - "Science Center and Rock Hall from Convention Center", Cards84664,
 *     CC BY-SA 4.0, 2023-03-26,
 *     https://commons.wikimedia.org/wiki/File:Science_Center_and_Rock_Hall_from_Convention_Center.png
 *     (south; the turbine standing in 2023)
 *   - "Science Center Cleveland", Cards84664, CC BY-SA 4.0, 2022-08-26,
 *     https://commons.wikimedia.org/wiki/File:Science_Center_Cleveland.png
 *     (south: the dome's profile, glass roofs, grey walls)
 *   - "Cleveland August 2015 09 (Great Lakes Science Center)", Michael
 *     Barera, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Cleveland_August_2015_09_(Great_Lakes_Science_Center).jpg
 *     (south)
 *   - "Great Lakes Science Center (17130100685)", Erik Drost, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Great_Lakes_Science_Center_(17130100685).jpg
 *     (north-west across the harbour: the glass tower, the north blocks)
 *   - "Front View of the Great Lakes Science Center", Kevin Payravi,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Front_View_of_the_Great_Lakes_Science_Center.jpg
 *     (the sign wall's white panels, the grey granite beside it)
 * Estimated: window sizes and rhythm (from the photos, simplified to one
 *   grid), the granite walls' extents (photos), the turbine's tower taper,
 *   nacelle and blade shapes, the dome's base drum.
 * Left out: the solar canopies, the pergola on the sign wall, the panel
 *   joint lines, the sign and logo, rooftop equipment, the courtyards cut
 *   into the north and west roofs.
 * Doubts: the turbine is drawn as in the 2023 photo and the 2019 lidar;
 *   whether it still stands is not confirmed by any later licensed photo.
 *   The north faces are seen only in one photo from the north-west.
 * Night: windows glow; the glass atrium, lantern and tower stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, capRing, outward, finishGlb, type XY } from './sea-columbia-center'
import { buildBlocks, wallQuad, panels, writeModel, type Block, type Grid } from './cle-200-public-square'
import { lathe } from './chi-field-museum'

const ROOF = 18.2, BAR = 24.4

/** A square-section beam from A to B, w wide. */
function beam(p: Part, A: V3, B: V3, w: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
  const L = Math.hypot(...d), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const u0 = cr(t, ref), ul = Math.hypot(...u0), u: V3 = [u0[0] / ul, u0[1] / ul, u0[2] / ul], v = cr(t, u)
  const h = w / 2
  const ring = (P: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [P[0] + (u[0] * a + v[0] * b) * h, P[1] + (u[1] * a + v[1] * b) * h, P[2] + (u[2] * a + v[2] * b) * h] as V3)
  const r0 = ring(A), r1 = ring(B)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(r0[i], r0[j], r1[j], r1[i]) }
  p.quad(r0[3], r0[2], r0[1], r0[0]); p.quad(r1[0], r1[1], r1[2], r1[3])
}

/** A prism whose top is a plane z(x, y): walls (split low for the terrain) and the sloped cap. */
function slopedPrism(wall: Part, top: Part, r: XY[], z0: (i: number) => number, z: (p: XY) => number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], za = z(a), zb = z(b), lo = z0(i)
    const m = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5))
    for (let k = 0; k < m; k++) {
      const t0 = k / m, t1 = (k + 1) / m
      const P = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const p0 = P(t0), p1 = P(t1), h0 = za + (zb - za) * t0, h1 = za + (zb - za) * t1
      wall.quad([p0[0], p0[1], lo], [p1[0], p1[1], lo], [p1[0], p1[1], h1], [p0[0], p0[1], h0])
    }
  }
  for (let i = 1; i < r.length - 1; i++) {
    const A = r[0], B = r[i], C = r[i + 1]
    top.tri([A[0], A[1], z(A)], [B[0], B[1], z(B)], [C[0], C[1], z(C)])
  }
}

function build() {
  const panel = new Part(), granite = new Part(), win = new Part(), glass = new Part(), roof = new Part(), dome = new Part()

  const grid: Grid = { bay: 3.2, pier: 3.8, group: 6.1, spandrel: 2.6, from: 0, edge: 1.6, head: 1.2, foot: 0.4 }
  const blocks: Block[] = []
  const add = (ring: XY[], z1: number, kind: string, g: Grid | null = grid, wall = panel) =>
    blocks.push({ ring: ccw(ring), z0: 0, z1, wall, roof, kind, grid: g })

  // West wing (56/146 grid), the main roof.
  add([[-70, 11], [-60, -5], [-49, -21], [-36, -12], [-30, -13], [-21, -27], [-7, -18], [-4, -22], [6, -14], [6, 6], [-24, 8], [-24, 16], [-26, 15], [-41, 30]], ROOF, 'west', null)
  // NW roof terrace, one storey above the promenade.
  add([[-41, 30], [-26, 15], [-24, 16], [-19, 22], [-12, 27.5], [-14, 31], [-19, 42], [-24, 43], [-28, 42], [-34, 38], [-35, 34]], 6.3, 'terrace', null)
  // North block between the terrace and the glass tower.
  add([[-24, 8], [-1, 6.5], [-1, 11], [-8, 21], [-12, 27.5], [-19, 22], [-24, 16]], 17, 'north')
  // The long central bar.
  add([[-38, -13], [44, -20], [44, -3], [28, 3.5], [10, 6], [-38, 11]], BAR, 'bar', null)
  // Dome lobby and the low north block before it.
  add([[28, 3.5], [30, 0], [44, -3], [62, -2], [60, 3], [57, 7], [40, 8.5], [33, 4.5]], ROOF, 'lobby')
  add([[40, 8.5], [52, 7], [53, 12], [50, 16], [45, 17], [41, 14]], 13.5, 'north-east')
  // Grey granite walls: the stair tower at the bar's west end and the NASA wall beside the sign wall.
  blocks.push({ ring: ccw([[-41, -14.5], [-33, -15.5], [-33, -8], [-41, -7]]), z0: 0, z1: BAR + 1.4, wall: granite, roof, kind: 'stair', grid: null })
  blocks.push({ ring: ccw([[-11, -18.5], [1, -19.5], [1, -13], [-11, -12]]), z0: 0, z1: BAR + 0.6, wall: granite, roof, kind: 'nasa', grid: null })
  blocks.push({ ring: ccw([[-62, -9], [-57, -9.5], [-57, -3], [-62, -2.5]]), z0: 0, z1: ROOF + 1.2, wall: granite, roof, kind: 'stair-w', grid: null })
  // The glass box over the atrium, on the bar's south face.
  blocks.push({ ring: ccw([[15, -21.5], [24, -22], [24, -16], [15, -15.5]]), z0: 0, z1: 21.5, wall: glass, roof: glass, kind: 'box', grid: null })
  buildBlocks(blocks, win)

  // Windows. The panelled walls are mostly blank: a row of square windows
  // under the bar's roof, punched windows on the north sides (the drost
  // photo), and the big grid east of the atrium (cards2).
  const top: Grid = { bay: 2.4, pier: 3.0, group: BAR - ROOF, spandrel: 0, from: ROOF, edge: 2.0, head: 1.4, foot: 1.6 }
  const north: Grid = { bay: 2.6, pier: 4.2, group: 6.1, spandrel: 2.6, from: 0, edge: 2.0, head: 1.2, foot: 0.4 }
  const edges = (k: string) => { const B = blocks.find((b) => b.kind === k)!; return B.ring.map((a, i) => [a, B.ring[(i + 1) % B.ring.length]] as [XY, XY]) }
  for (const [a, b] of edges('bar')) panels(win, a, b, ROOF, BAR, top)
  for (const [a, b] of edges('west')) if (outward(a, b)[1] > 0.3) panels(win, a, b, 0, ROOF, north)
  {
    // east of the atrium on the bar's south face: three rows of five
    const a: XY = [-38, -13], b: XY = [44, -20], L = Math.hypot(b[0] - a[0], b[1] - a[1]), at = (s: number): XY => [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L]
    panels(win, at(L - 19), at(L - 2), 7, ROOF, { bay: 2.6, pier: 1.0, group: 3.8, spandrel: 0.8, from: 7, edge: 0.6, head: 0.6, foot: 0 })
  }

  // Glass tower on the north: full height, top sloping up to the north.
  {
    const r: XY[] = ccw([[10, 6], [28, 3.5], [29, 9], [24, 15], [17, 16], [11, 12]])
    const n: XY = [0.1376, 0.9905]
    const z = (p: XY) => Math.min(32.5, 26 + (6.5 * ((p[0] - 10) * n[0] + (p[1] - 6) * n[1])) / 10.85)
    const south = r.findIndex((p) => p[0] === 10 && p[1] === 6)
    slopedPrism(glass, glass, r, (i) => (i === south ? BAR : 0), z)
    // white floor bands round the glass
    for (const zb of [6.5, 12.5, 18.5]) {
      for (let i = 0; i < r.length; i++) {
        if (i === south) continue
        const a = r[i], b = r[(i + 1) % r.length], o = outward(a, b)
        const A: XY = [a[0] + o[0] * 0.08, a[1] + o[1] * 0.08], B: XY = [b[0] + o[0] * 0.08, b[1] + o[1] * 0.08]
        panel.quad([A[0], A[1], zb], [B[0], B[1], zb], [B[0], B[1], zb + 0.9], [A[0], A[1], zb + 0.9])
      }
    }
  }

  // South entrance atrium: glass walls from the lawn, a glass roof falling to the south.
  {
    const r: XY[] = ccw([[3, -16.3], [22, -17.5], [23, -25], [17, -28], [9, -27.5], [4, -24]])
    const z = (p: XY) => 16 - (5 * (-17 - p[1])) / 11
    slopedPrism(glass, glass, r, () => 0, z)
  }

  // Octagonal glass lantern on the bar.
  {
    const c: XY = [17, -6], R = 6
    const oct: XY[] = Array.from({ length: 8 }, (_, i) => [c[0] + R * Math.cos(((i + 0.5) * Math.PI) / 4), c[1] + R * Math.sin(((i + 0.5) * Math.PI) / 4)] as XY)
    for (let i = 0; i < 8; i++) {
      const a = oct[i], b = oct[(i + 1) % 8]
      glass.quad([a[0], a[1], BAR], [b[0], b[1], BAR], [b[0], b[1], 27], [a[0], a[1], 27])
      glass.tri([a[0], a[1], 27], [b[0], b[1], 27], [c[0], c[1], 29.8])
      beam(panel, [a[0], a[1], 27], [c[0], c[1], 29.8], 0.35)
    }
  }

  // The white steel pyramid frame at the bar's west end, over a low glass pyramid.
  {
    const c: XY = [-28, 1.5], h = 6.2, b = (97 * Math.PI) / 180
    const ax: XY = [Math.sin(b), Math.cos(b)], ay: XY = [-ax[1], ax[0]]
    const corner = (i: number, k = h): XY => {
      const sx = i === 0 || i === 3 ? -1 : 1, sy = i < 2 ? -1 : 1
      return [c[0] + (ax[0] * sx + ay[0] * sy) * k, c[1] + (ax[1] * sx + ay[1] * sy) * k]
    }
    const base = [0, 1, 2, 3].map((i) => corner(i))
    const sq = ccw(base)
    for (let i = 0; i < 4; i++) {
      const a = sq[i], d = sq[(i + 1) % 4]
      glass.tri([a[0], a[1], BAR + 0.6], [d[0], d[1], BAR + 0.6], [c[0], c[1], BAR + 3.2])
      panel.quad([a[0], a[1], BAR], [d[0], d[1], BAR], [d[0], d[1], BAR + 0.6], [a[0], a[1], BAR + 0.6])
      beam(panel, [a[0], a[1], BAR + 0.6], [d[0], d[1], BAR + 0.6], 0.5)
      beam(panel, [a[0], a[1], BAR + 0.6], [c[0], c[1], 32], 0.5)
    }
  }

  // The OMNIMAX dome: a sphere R 19 centred 11.5 up, on a short drum.
  {
    const R = 19, zc = 11.5, prof: XY[] = []
    prof.push([R * Math.cos((-16 * Math.PI) / 180) - 0.4, 0])
    for (let k = 0; k <= 10; k++) {
      const a = ((-16 + (106 * k) / 10) * Math.PI) / 180
      prof.push([Math.max(0, R * Math.cos(Math.min(a, Math.PI / 2))), zc + R * Math.sin(Math.min(a, Math.PI / 2))])
    }
    // the drum below the sphere (white), the sphere itself (bronze)
    lathe(panel, 56, -15.5, [prof[0], [prof[0][0], prof[1][1]]], 20)
    lathe(dome, 56, -15.5, prof.slice(1), 20)
  }

  // The wind turbine on the south lawn (Vestas V27).
  {
    const T: XY = [6, -82], g = 5.9, hub = g + 31
    lathe(panel, T[0], T[1], [[1.25, 0], [0.75, hub - 1.0]], 10)
    const b = (236 * Math.PI) / 180, a: XY = [Math.sin(b), Math.cos(b)], p: XY = [-a[1], a[0]]
    const at = (s: number, q: number, z: number): V3 => [T[0] + a[0] * s + p[0] * q, T[1] + a[1] * s + p[1] * q, z]
    beam(panel, at(-2.2, 0, hub), at(3.0, 0, hub), 2.0) // nacelle
    beam(panel, at(3.0, 0, hub), at(4.2, 0, hub), 1.3) // hub
    for (const deg of [90, 210, 330]) {
      const t = (deg * Math.PI) / 180, root = 0.6, tip = 13.5
      const dir = (r: number, w: number): V3 => at(4.0, Math.cos(t) * r - Math.sin(t) * w, hub + Math.sin(t) * r + Math.cos(t) * w)
      // a flat tapered blade, both sides
      const A = dir(root, -0.55), B = dir(root, 0.55), C = dir(tip, 0.18), D = dir(tip, -0.18)
      panel.quad(A, B, C, D); panel.quad(A, D, C, B)
    }
  }

  return finishGlb('cle-great-lakes-science-center', 'Great Lakes Science Center', [
    { part: panel, material: finish('glsc-panel', 0xe6e8e6) },
    { part: granite, material: finish('glsc-granite', 0xb9b6b0) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
    { part: dome, material: finish('glsc-dome', 0xa3927a) },
  ], { bearing: 0, height: 37.4 + 13.5, replaces: ['way/101458841', 'way/615052745', 'way/1534267042', 'way/1535041639'] })
}

if (import.meta.main) await writeModel('cle-great-lakes-science-center', build())
