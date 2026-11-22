/**
 * The Pagoda (2000, HNTB), the timing, scoring and control tower at the
 * start-finish line of the Indianapolis Motor Speedway, Speedway, Indiana:
 * procedural, CC0-1.0.
 * bun generators/indy-ims-pagoda.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the outline's long
 * sides run within a degree of north). The origin is the area centroid of
 * the OSM outline way/286357114 (-86.2382861, 39.7932029). The main straight
 * and pit lane are to the west (the scoring face looks west down the track);
 * Pagoda Plaza and the Yard of Bricks walk are to the east.
 *
 * The form, every height measured from the lidar (above the plaza):
 *   - a two-storey base, 9 m, the west part (pit-side suites, x -10.7..-1)
 *     following the OSM outline; the main base under the tower to 10 m;
 *   - the tower, 25 m east-west (lidar x 17..42 local), with four broad
 *     flat roofs stacked over open viewing terraces, each a plate the full
 *     depth of the tower and shrinking only north-south:
 *       T1 13.0 m, 59.5 m long; T2 20.5 m, 51 m; T3 28.0 m, 45 m;
 *       T4 35.0 m, 38.5 m (lidar plateaus and their edges);
 *   - the enclosed core between them, 23 m north-south (the top canopy's
 *     width), glass on the west and east faces between concrete stair and
 *     lift cores at its north and south ends;
 *   - a mechanical storey to 40.5 m (lidar 40-41 m), the upper box with the
 *     scoreboard on both the west and east faces, and the flat top canopy
 *     at 46.5 m (lidar 46-47 m; published 153 ft, 46.6 m), x 20.5..38.5;
 *   - steel posts at the ends of every terrace, down to the plate below.
 *
 * Sources
 * - OSM (ODbL): way/286357114 (IMS Pagoda, building=yes, 9 levels), on
 *   IMS Pagoda Plaza (way/589350966, leisure=park, not a building); the
 *   Pagoda-Press Center Skybridge (way/588795278) is a footway with
 *   bridge=yes from the Pagoda's north-east door to the Media Center, not a
 *   building, and is left out (thin, and its other end is the map's).
 * - USGS lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016),
 *   0.5 m grid, 60 m half-size: every height and plate edge above.
 * - Published: 153 ft (46.6 m) tall, opened 2000 (Wikipedia, "Indianapolis
 *   Motor Speedway").
 * - Photos (Wikimedia Commons):
 *   "Indianapolis motor speedway pagoda, 2011.jpg" (rbnlsn, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_motor_speedway_pagoda,_2011.jpg),
 *   the west face from the track: the five plates, the glass core, the
 *   scoreboard "1 2 3 4 5 6 7 8 9 10" under the top canopy, the base suites;
 *   "Indianapolis Motor Speedway May 2026 6 (Pagoda).jpg" (Michael Barera,
 *   CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_Motor_Speedway_May_2026_6_(Pagoda).jpg),
 *   the east face from the plaza: concrete cores, teal glass, the steel
 *   posts, the concrete base and its video screens, the scoreboard repeated;
 *   "Indianapolis motor speedway pagoda (51221640568).jpg" (Zach Catanzareti
 *   Photo, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_motor_speedway_pagoda_(51221640568).jpg),
 *   from the main grandstand: proportions against the stands.
 * Estimated: the core's east-west inset under the plates (1.2 m), the
 *   base's north-south length on the east (46 m, from the plaza photo), the
 *   post spacing, the glass widths (19 m of the core's 23 m, from the
 *   photos), the numerals' size.
 * Left out: the rafters under the plates, railings, flags, the skybridge,
 *   the base's video screens (drawn as dark panels), Victory Circle.
 * Night: the glass core is `window`; the scoreboard numerals are `neon`;
 *   the concrete carries a floodlight wash.
 * Doubts: the north and south ends are not photographed head-on; the
 *   plates are drawn as solid slabs.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, wallLit } from './indy-world-war-memorial'
import { Pen, strokes, type Pt } from './lettering'

/**
 * Sans-serif numerals 0-9 as centre-lines, cap height 1, about 0.6 wide.
 * Shared by my IMS models (indy-ims-*).
 */
export function numeral(d: string): Pen {
  const p = new Pen()
  switch (d) {
    case '0': p.circle([0.3, 0.5], 0.3, 0.5, 12); break
    case '1': p.moveTo([0.12, 0.8]).lineTo([0.32, 1]).lineTo([0.32, 0]); break
    case '2': p.moveTo([0.03, 0.75]).quadTo([0.1, 1], [0.32, 1], 3).quadTo([0.58, 1], [0.58, 0.74], 3).quadTo([0.58, 0.5], [0.03, 0]).lineTo([0.6, 0]); break
    case '3': p.moveTo([0.04, 0.9]).quadTo([0.2, 1], [0.32, 1], 2).quadTo([0.56, 1], [0.56, 0.76], 3).quadTo([0.56, 0.54], [0.26, 0.54], 3)
      .moveTo([0.26, 0.54]).quadTo([0.6, 0.54], [0.6, 0.27], 3).quadTo([0.6, 0], [0.3, 0], 3).quadTo([0.12, 0], [0.02, 0.1], 2); break
    case '4': p.moveTo([0.46, 0]).lineTo([0.46, 1]).lineTo([0.02, 0.3]).lineTo([0.62, 0.3]); break
    case '5': p.moveTo([0.56, 1]).lineTo([0.1, 1]).lineTo([0.06, 0.55]).quadTo([0.2, 0.62], [0.32, 0.62], 2).quadTo([0.6, 0.62], [0.6, 0.31], 3).quadTo([0.6, 0], [0.3, 0], 3).quadTo([0.12, 0], [0.02, 0.1], 2); break
    case '6': p.moveTo([0.54, 0.92]).quadTo([0.42, 1], [0.32, 1], 2).quadTo([0.02, 1], [0.02, 0.4], 4)
      .moveTo([0.31, 0.32]).circle([0.31, 0.31], 0.29, 0.31, 10); break
    case '7': p.moveTo([0.02, 1]).lineTo([0.6, 1]).lineTo([0.22, 0]); break
    case '8': p.circle([0.3, 0.76], 0.24, 0.24, 10).circle([0.3, 0.27], 0.29, 0.27, 10); break
    case '9': p.moveTo([0.29, 0.69]).circle([0.29, 0.69], 0.29, 0.31, 10).moveTo([0.58, 0.6]).quadTo([0.58, 0], [0.28, 0], 4).quadTo([0.14, 0], [0.06, 0.08], 2); break
  }
  return p
}

if (import.meta.main) {
  const concrete = new Part(), steel = new Part(), glass = new Part(), board = new Part(), neon = new Part()

  const YC = -4.8 // the tower's north-south centre (local y 128.2)
  const X0 = -1.3, X1 = 23.7 // the plates' west and east edges
  const CX0 = 0.0, CX1 = 22.4 // the core's west and east faces
  const CH = 11.5 // the core's half-length north-south
  const PLATE = 1.1 // plate thickness
  const tiers: [number, number][] = [ // [roof top, half-length]
    [13.0, 29.75], [20.5, 25.5], [28.0, 22.5], [35.0, 19.25],
  ]

  // A flat panel on a face of the core (x = const), y0..y1, z0..z1.
  const panelX = (part: Part, x: number, out: 1 | -1, y0: number, y1: number, z0: number, z1: number) => {
    const xo = x + out * 0.06
    if (out > 0) part.quad([xo, y0, z0], [xo, y1, z0], [xo, y1, z1], [xo, y0, z1])
    else part.quad([xo, y1, z0], [xo, y0, z0], [xo, y0, z1], [xo, y1, z1])
  }

  // ------------------------------------------------------------ the base
  box(concrete, concrete, -10.7, -24.5, -1.0, 15.5, 0, 9, 0.4) // pit-side suites
  box(concrete, concrete, -5.8, -33.3, -1.0, 24.2, 0, 9, 0.4)
  box(concrete, concrete, -1.0, YC - 23, X1 - 1.0, YC + 23, 0, 10.2, 0.4)
  // the suites' glass on the west (pit) face, and the doors and screens on the east
  panelX(glass, -10.7, -1, -22.5, 13.5, 4.6, 8.0)
  panelX(glass, -5.8, -1, -31.3, -25.5, 4.6, 8.0)
  panelX(glass, -5.8, -1, 16.5, 22.2, 4.6, 8.0)
  panelX(glass, -10.7, -1, -22.5, 13.5, 0.6, 3.4)
  panelX(board, X1 - 1.0, 1, YC - 19, YC - 3.5, 4.4, 9.4)
  panelX(board, X1 - 1.0, 1, YC + 3.5, YC + 19, 4.4, 9.4)
  panelX(glass, X1 - 1.0, 1, YC - 3.5, YC + 3.5, 4.4, 9.4)
  panelX(glass, X1 - 1.0, 1, YC - 2.5, YC + 2.5, 0, 3.4)

  // ------------------------------------------------------------ the tiers
  let below = 10.2
  for (const [top, half] of tiers) {
    // the enclosed core from the plate below to this one
    box(concrete, null, CX0, YC - CH, CX1, YC + CH, below, top - PLATE)
    // glass on the west and east faces, a pale floor line across the middle
    const zA = below + 0.4, zB = top - PLATE - 0.3, zm = (zA + zB) / 2
    for (const [x, o] of [[CX0, -1], [CX1, 1]] as [number, 1 | -1][]) {
      panelX(glass, x, o, YC - 9.6, YC + 9.6, zA, zm - 0.2)
      panelX(glass, x, o, YC - 9.6, YC + 9.6, zm + 0.2, zB)
    }
    // the plate, its edge bevelled
    box(steel, steel, X0, YC - half, X1, YC + half, top - PLATE, top, 0.35)
    // posts at the terrace ends, three along each end
    const z0 = below === 10.2 ? 0 : below
    for (const sy of [-1, 1]) for (const x of [X0 + 0.8, (X0 + X1) / 2, X1 - 0.8]) {
      const y = YC + sy * (half - 1.4)
      box(steel, null, x - 0.3, y - 0.3, x + 0.3, y + 0.3, z0, top - PLATE)
    }
    below = top
  }

  // ------------------------------------------------------------ the crown
  // mechanical storey with louvres (drawn as concrete with a dark band)
  box(concrete, steel, CX0, YC - 11.5, CX1, YC + 10, 35.0, 40.5, 0.3)
  for (const [x, o] of [[CX0, -1], [CX1, 1]] as [number, 1 | -1][]) panelX(glass, x, o, YC - 5, YC + 5, 35.6, 39.8)
  // upper box carrying the scoreboard
  box(concrete, null, 2.7, YC - 10.5, 20.2, YC + 10.5, 40.5, 45.3)
  // the top canopy
  box(steel, steel, 2.2, YC - 11.9, 20.7, YC + 11.9, 45.3, 46.5, 0.35)
  for (const sy of [-1, 1]) for (const x of [2.8, 20.1]) {
    const y = YC + sy * 11.2
    box(steel, null, x - 0.25, y - 0.25, x + 0.25, y + 0.25, 40.5, 45.3)
  }

  // the scoreboard, west and east: a dark band with the numerals 1-10
  for (const [x, o] of [[2.7, -1], [20.2, 1]] as [number, 1 | -1][]) {
    const xf = x + o * 0.5
    box(board, board, Math.min(x, xf), YC - 11.2, Math.max(x, xf), YC + 11.2, 41.0, 44.9)
    const face = xf + o * 0.02
    const pen = new Pen()
    for (let k = 1; k <= 10; k++) {
      const s = String(k), w = s.length * 0.68
      const u0 = (-9.7 + (k - 1) * 2.155) / 1.9 - w * 0.5 // each cell's left edge, letter units
      for (let c = 0; c < s.length; c++) pen.add(numeral(s[c]), u0 + c * 0.68)
    }
    // reader faces the board: west face reads with u to the south, east face to the north
    const place = (u: number, v: number, w: number): V3 => [face + o * w, YC + o * u * 1.9, 41.5 + v * 2.2]
    strokes(neon, pen.paths as Pt[][], { width: 0.17, depth: 0.08, place })
  }

  const concreteM = { ...finish('indy-pagoda-concrete', 0xd8d5cd), floodlight: wallLit }
  const built = finishGlb('The Pagoda, Indianapolis Motor Speedway', [
    { part: concrete, material: concreteM },
    { part: steel, material: finish('indy-pagoda-steel', 0x8d969d) },
    { part: glass, material: { name: 'window', color: 0x5d9893, roughness: 0.35 } },
    { part: board, material: finish('indy-pagoda-board', 0x4a4f57) },
    { part: neon, material: finish('neon-pagoda-numerals', 0xf4f1e6) },
  ], { bearing: 0, height: 46.5, replaces: ['way/286357114'] }, 5000)
  await writeModel('indy-ims-pagoda', built)
}
