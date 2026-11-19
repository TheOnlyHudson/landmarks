/**
 * Verrazzano-Narrows Bridge (1964; Othmar Ammann) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-verrazzano-narrows-bridge.ts
 *
 * The whole bridge as one placement, outline end to outline end: both
 * towers, both anchorages, the four main cables, the suspenders, the two
 * stiffening trusses with the lower roadway inside them, the deck's
 * underside, and the double-deck approach girders and their piers from each
 * anchorage to the outline's end. Writes a low model (towers, anchorages,
 * cables, the trusses as solid bands) and a detail model (the trusses as
 * lattice, suspenders, floor beams and bracing), drawn from detailZoom up.
 *
 * Frame: x across the bridge, y along it toward Staten Island, z up, metres;
 * origin midway between the towers' lidar centres, on the water. Placed at
 * bearing 247.1°, the line between them (1,295.8 m; the published main span
 * is 4,260 ft, 1,298 m). The map owns both roadways' surfaces: the trusses
 * stand outside them, the soffit hangs under the lower one, and nothing here
 * is a slab at road level.
 *
 * Height. z = 0 is the water as the map draws it, -1.63 m NAVD88; the lidar
 * reads the Narrows at -0.7 to -0.9 m. So every height is NAVD88 + 1.63
 * (`nav`), and the ground tables are 3DEP bare earth + 1.63. Roadways built
 * to (NAVD88, lidar, every 25 m across the deck):
 * - upper: 79.9 m at midspan, 76.6 at y = ±300, 70.4 at ±500, 65.25 at the
 *   towers, a 4 % grade through the side spans to 51.2 at ±1000, 47.2 at
 *   ±1100 and 41.4 at ±1250 (`UPPER`); the two sides agree within 0.1 m;
 * - lower: 7.3 m under the upper (`LEVELS`). Lidar can't see it under the
 *   upper deck; where it comes out from under it on Staten Island
 *   (y = 1140–1176) it reads 7.2–7.3 m down, matching the published
 *   24 ft (7.3 m) stiffening trusses that contain it.
 * The map drew the upper roadway 2–3 m low; OSM `ele` pins on both levels'
 * carriageways give it these heights (see docs/bridge-heights.md).
 *
 * Standing on the terrain: the towers' piers stand in the water at z = 0;
 * the anchorages and approach piers run down to the ground vertex by
 * vertex, from 4 m tables of 3DEP heights in this frame (`BROOKLYN_GROUND`,
 * `STATEN_GROUND`).
 *
 * Sources:
 * - OSM: outline way/375153091 (layer 2, no height), x ±13.4–15.7 across
 *   the spans, from y = -1234.5 to +1268.4; towers way/1016642060
 *   (Brooklyn) and way/1016642058 (Staten Island), bridge:support=pylon,
 *   height 211, on piers way/1016642059 and way/1016642057 (57.5 x 23 m);
 *   anchorages way/899356446 (Brooklyn, river face y = -1003.5, back
 *   -1092.6) and way/899356447 (Staten Island, 993.4 to 1080), both 48 m
 *   wide. The other man_made=bridge outlines nearby are approach ramps
 *   and the Belt Parkway and Shore Road bridges under the side span, which
 *   the map draws.
 * - Lidar, USGS 3DEP NY_NewYorkCity (2017), 0.5 m grids along the whole
 *   bridge, 124 m wide:
 *   - four cables, two a side at x ≈ ±14.45 and ±17.35; their centres
 *     a parabola 84.55 m (NAVD88) at midspan and 205.7 m at the towers, and
 *     on the side spans 3.01e-4·a² − 0.929·a + 681.2 (a = |y|), entering
 *     the anchorages' faces about 52 m up;
 *   - suspenders every 15.04 m from midspan;
 *   - the trusses' top chords 0.8 m under the upper roadway at |x| 15–17,
 *     their bottom 8.2 m under it;
 *   - towers: top 210.9 m, piers 9.3 m;
 *   - anchorages: a concrete wedge either side of the roadway (|x| 13.6–24),
 *     54.4 m (Brooklyn) and 53.8 m (Staten Island) at the river face,
 *     falling 0.45 and 0.32 m per metre to the ground at the back.
 * - Published (Wikipedia "Verrazzano-Narrows Bridge"; NISEE, Godden
 *   collection; nycroads.com): main span 4,260 ft, side spans 1,215 ft;
 *   towers 693 ft; four cables of 36 in; deck 103 ft wide; stiffening
 *   trusses 24 ft deep, the lower deck inside them (historicbridges.org);
 *   arched struts below the lower deck; approaches on steel girders.
 * - Photos: HAER NY-303-12 "Staten Island anchorage and detail of roadway
 *   deck steelwork", NY-303-17 "Brooklyn anchorage, looking NW", NY-303-21
 *   "Staten Island approach and cable detail" (public domain, Wikimedia
 *   Commons; the wedge anchorages, the Warren truss with verticals, the
 *   strut under the deck, the approach); the tower photos listed below.
 * - The tower is the approved tower model's design: the heights are moved
 *   into this datum and its top set to the lidar's, its deck stub is gone,
 *   and its strut sits just under the trusses.
 *
 * The tower (unchanged from the tower model): two tall, plain, slightly
 * tapering steel legs; a deep solid head with a tall round-headed opening
 * cut up into it; a strut under the double deck; a concrete block in the
 * water under each leg. Lidar: head 46–47 m across, 10 m deep; legs 10.5 m
 * wide, inner faces 14.5 m either side of the centre. Photos (Wikimedia
 * Commons): "Verrazano-Narrows Bridge (10109726386)" (Shannon from
 * Huntsville, CC BY-SA 2.0); "Verrazano-Narrows Bridge 0039" (LawrenceFung,
 * CC BY 2.0); "Verrazzano-Narrows Bridge from the Brooklyn shore, New York
 * City" (Allen Lubitz, CC BY 4.0); "NYC-verrazano-narrows-bridge" (Balou46,
 * CC BY-SA 4.0).
 *
 * Estimated: the arch's spring (a semicircle on the 29 m opening); the
 * strut's depth (9 m); truss panels of half the suspender spacing; the
 * floor beams and bracing; the anchorages' middle under the roadways,
 * which lidar can't see, kept 0.4 m under the lower one; the approach
 * girders' depth (1.8 m) and their piers, columns outside the deck edges
 * every 50–60 m. One suspender per cable per station (each is a group of
 * ropes) at 0.4 m; the cables drawn 1.5 m thick against the real 0.91 m.
 *
 * Colour: the paint reads #aaaead to #b0b2af in hazy daylight, a pale grey
 * with a green cast; the anchorages and piers pale concrete.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { archWall, box, countParts, loftSolid, norm, rim } from './nyc-manhattan-bridge'
import {
  band, face, footedWall, groundAt, merged, movedAlong, piecewise, rod, stations, strip, truss, tube, type GroundGrid,
} from './bridge-kit'

const LIFT = 1.63
const nav = (h: number) => h + LIFT

// ---- Plan and profile ------------------------------------------------------------

const TY = 647.89               // towers at y = ±TY
const FACE = 6.5                // the deck stops this far from a tower's centre line
const ANCHOR = { bk: [-1003.5, -1092.6], si: [993.4, 1080.0] } // river face, back (OSM)
const ENDS = [-1234.5, 1268.4]  // the outline's ends
const LEVELS = 7.3              // upper roadway to lower

const UPPER = piecewise(([
  [0, 79.92], [50, 79.8], [100, 79.52], [150, 79.05], [200, 78.41], [250, 77.56], [300, 76.55], [350, 75.29],
  [400, 73.87], [450, 72.22], [500, 70.42], [550, 68.67], [600, 66.95], [625, 66.09], [TY, 65.25], [675, 64.17],
  [700, 63.13], [750, 61.1], [800, 59.05], [850, 57.06], [900, 55.07], [950, 53.1], [1000, 51.17], [1050, 49.18],
  [1100, 47.19], [1150, 45.3], [1200, 43.4], [1250, 41.4], [1270, 40.8],
] as [number, number][]).map(([a, z]) => [a, nav(z)]))
const upper = (y: number) => UPPER(Math.abs(y))
const lower = (y: number) => upper(y) - LEVELS

const TRUSS_X = 15.9, TRUSS_W = 0.8
const TOP = (y: number) => upper(y) - 0.8   // top chord, under the upper roadway's edge
const BOT = (y: number) => upper(y) - 8.2   // bottom chord, under the lower roadway
const SOFFIT = (y: number) => upper(y) - 8.3

const CABLES = [14.45, 17.35]   // |x|, two a side
const CABLE_R = 0.75
const mainCable = (y: number) => nav(84.55 + 2.885e-4 * y * y)
const sideCable = (a: number) => nav(3.013e-4 * a * a - 0.9287 * a + 681.2)
const cable = (y: number) => (Math.abs(y) <= TY ? mainCable(y) : sideCable(Math.abs(y)))
const HANGER = 15.04            // suspender spacing, from midspan
const PANEL = HANGER / 2

const spans: [number, number][] = [[ANCHOR.bk[0], -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, ANCHOR.si[0]]]
const curve = ([a, b]: [number, number]) => stations(a, b, 40)
const panels = ([a, b]: [number, number]) => stations(a, b, PANEL)

// 3DEP bare-earth heights + 1.63, 4 m apart in this frame: rows along y
// from y0, columns across from x = -28.
const BROOKLYN_GROUND: GroundGrid = { y0: -1240, x0: -28, step: 4, z: [
  [12.0, 12.0, 12.0, 12.1, 12.2, 12.2, 12.2, 12.2, 12.3, 12.2, 12.1, 12.1, 12.0, 12.0, 12.1],
  [12.3, 11.9, 12.2, 12.2, 12.2, 12.3, 12.2, 12.3, 12.3, 12.3, 12.3, 12.2, 12.2, 12.3, 12.2],
  [12.3, 12.3, 12.4, 12.4, 12.5, 12.4, 12.4, 12.4, 12.5, 12.5, 12.4, 12.4, 12.4, 12.4, 12.4],
  [12.4, 12.6, 12.5, 12.5, 12.5, 12.5, 12.5, 12.6, 12.6, 12.7, 12.7, 12.7, 12.6, 12.6, 12.6],
  [12.7, 12.7, 12.6, 12.6, 12.6, 12.6, 12.7, 12.7, 12.7, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8],
  [12.8, 12.9, 12.8, 12.7, 12.8, 12.8, 12.8, 12.9, 12.8, 13.0, 13.1, 13.3, 13.4, 13.3, 13.4],
  [13.0, 13.1, 13.0, 13.0, 13.0, 13.0, 13.0, 12.9, 13.1, 13.4, 13.8, 14.4, 14.5, 14.2, 14.4],
  [13.1, 13.6, 13.5, 13.3, 13.1, 13.1, 13.1, 13.2, 13.5, 14.4, 15.5, 15.9, 16.8, 16.4, 15.8],
  [13.0, 13.1, 13.3, 13.3, 13.2, 13.3, 13.5, 13.8, 14.4, 15.6, 16.6, 17.5, 18.7, 17.8, 17.5],
  [13.2, 13.2, 13.4, 13.2, 13.4, 13.6, 13.9, 14.3, 15.4, 16.6, 17.1, 17.9, 18.6, 18.8, 19.0],
  [13.3, 13.3, 13.5, 13.4, 13.5, 14.1, 14.6, 15.4, 16.6, 17.1, 17.6, 18.1, 18.7, 19.1, 19.2],
  [13.4, 13.4, 13.6, 13.4, 13.8, 14.4, 15.5, 16.6, 17.5, 18.2, 18.3, 18.6, 18.8, 19.0, 18.8],
  [13.6, 13.6, 13.7, 13.7, 14.5, 15.4, 16.4, 17.3, 18.2, 18.4, 18.5, 18.7, 18.9, 18.8, 18.6],
  [13.7, 13.7, 13.9, 14.4, 15.2, 16.0, 17.0, 18.1, 18.3, 18.4, 18.5, 18.6, 18.7, 18.6, 18.5],
  [14.1, 14.0, 14.3, 15.0, 16.0, 16.8, 17.2, 18.0, 18.1, 18.3, 18.4, 18.5, 18.5, 18.5, 18.6],
  [14.1, 14.5, 14.9, 16.1, 16.9, 17.4, 17.8, 18.0, 18.1, 18.3, 18.4, 18.4, 18.4, 18.4, 18.4],
  [14.4, 14.9, 15.8, 16.9, 17.4, 17.6, 17.7, 18.0, 18.1, 18.2, 18.2, 18.2, 18.2, 18.4, 17.7],
  [14.9, 15.7, 16.6, 17.3, 17.7, 17.9, 17.9, 18.2, 18.3, 18.3, 18.3, 18.3, 18.4, 18.2, 16.8],
  [15.4, 16.3, 17.1, 17.7, 17.9, 18.0, 18.1, 18.1, 18.2, 18.2, 18.2, 18.3, 18.2, 17.3, 16.0],
  [16.0, 16.8, 17.5, 17.9, 17.7, 17.8, 17.9, 18.0, 18.0, 17.9, 17.8, 18.0, 17.7, 16.3, 15.7],
  [16.6, 17.1, 17.7, 17.6, 17.7, 17.8, 17.9, 17.9, 17.8, 17.7, 17.4, 17.2, 16.4, 15.8, 15.5],
  [16.7, 17.5, 17.6, 17.4, 17.6, 17.7, 17.7, 17.8, 17.7, 17.2, 16.8, 16.4, 15.9, 15.8, 15.6],
  [17.0, 17.6, 17.4, 17.4, 17.7, 17.6, 17.6, 17.5, 17.6, 17.2, 16.9, 16.4, 16.0, 15.9, 15.7],
  [17.3, 17.2, 17.3, 17.4, 17.8, 17.7, 17.7, 17.6, 17.7, 17.3, 16.8, 16.5, 16.1, 15.9, 15.8],
  [17.2, 17.2, 17.3, 17.3, 17.5, 17.5, 17.4, 17.4, 17.5, 17.2, 16.8, 16.5, 16.3, 16.1, 15.9],
  [17.0, 17.1, 17.3, 17.3, 17.3, 17.3, 17.3, 17.2, 17.0, 16.9, 16.8, 16.6, 16.3, 16.1, 15.9],
  [16.9, 17.3, 17.3, 17.2, 17.2, 17.2, 17.1, 17.1, 17.0, 16.9, 16.8, 16.7, 16.5, 16.2, 16.0],
  [17.0, 17.4, 17.4, 17.0, 17.0, 17.0, 17.1, 17.0, 16.9, 16.8, 16.7, 16.6, 16.4, 16.0, 15.9],
  [17.1, 17.3, 17.0, 16.9, 16.9, 17.1, 17.0, 16.9, 16.8, 16.7, 16.6, 16.6, 16.3, 15.9, 15.8],
  [17.0, 16.9, 16.8, 16.8, 17.0, 16.9, 16.9, 16.8, 16.7, 16.6, 16.5, 16.4, 16.2, 15.9, 15.6],
  [16.9, 16.7, 16.7, 17.0, 17.0, 16.9, 16.8, 16.8, 16.7, 16.6, 16.5, 16.5, 16.3, 16.0, 15.5],
  [16.7, 16.5, 16.7, 16.8, 17.0, 16.9, 16.9, 16.8, 16.8, 16.7, 16.6, 16.6, 16.3, 15.9, 15.5],
  [16.5, 16.5, 16.6, 16.7, 16.9, 16.9, 16.8, 16.7, 16.7, 16.6, 16.4, 16.4, 16.1, 15.8, 15.2],
  [16.4, 16.5, 16.4, 16.7, 17.0, 16.9, 16.8, 16.7, 16.7, 16.6, 16.5, 16.4, 16.0, 15.5, 15.1],
  [16.4, 16.1, 16.2, 16.6, 16.9, 16.9, 16.8, 16.7, 16.6, 16.5, 16.4, 16.3, 16.0, 15.4, 14.8],
  [16.0, 15.9, 16.1, 16.5, 16.8, 16.8, 16.7, 16.6, 16.6, 16.5, 16.4, 16.3, 15.9, 15.4, 14.6],
  [15.7, 15.8, 16.0, 16.5, 16.7, 16.7, 16.6, 16.5, 16.5, 16.4, 16.3, 16.2, 15.9, 15.2, 14.3],
  [15.3, 15.3, 15.9, 16.2, 16.6, 16.5, 16.3, 16.3, 16.2, 16.1, 16.0, 15.8, 15.6, 14.8, 14.2],
  [14.7, 14.8, 15.3, 15.7, 15.9, 15.7, 15.7, 15.5, 15.5, 15.4, 15.3, 15.3, 15.2, 14.5, 13.9],
  [14.3, 14.3, 14.6, 15.3, 15.1, 15.1, 14.9, 14.9, 14.8, 14.7, 14.7, 14.7, 14.7, 14.2, 13.6],
  [13.7, 13.7, 14.3, 14.5, 14.5, 14.3, 14.2, 14.2, 14.1, 14.2, 14.0, 14.0, 14.0, 13.9, 13.4],
  [13.2, 13.3, 13.9, 13.9, 13.7, 13.6, 13.7, 13.6, 13.6, 13.5, 13.4, 13.4, 13.3, 13.4, 13.1],
  [13.1, 13.0, 13.1, 13.1, 13.0, 13.1, 13.0, 13.1, 13.1, 13.1, 13.1, 13.0, 13.0, 13.0, 12.8],
  [12.8, 12.7, 13.0, 12.9, 13.0, 12.9, 12.8, 12.8, 12.7, 12.8, 12.7, 12.6, 12.7, 12.6, 12.6],
  [12.5, 12.6, 12.6, 12.6, 12.6, 12.5, 12.5, 12.5, 12.5, 12.5, 12.4, 12.4, 12.4, 12.4, 12.4],
  [12.2, 12.3, 12.4, 12.4, 12.4, 12.4, 12.3, 12.3, 12.3, 12.2, 12.2, 12.2, 12.2, 12.2, 12.1],
  [11.9, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0],
  [11.6, 11.9, 11.9, 11.9, 11.9, 11.8, 11.8, 11.8, 11.8, 11.8, 11.7, 11.8, 11.7, 11.7, 11.7],
  [11.4, 11.6, 11.8, 11.8, 11.7, 11.7, 11.6, 11.6, 11.6, 11.5, 11.5, 11.5, 11.4, 11.4, 11.4],
  [11.2, 11.4, 11.4, 11.4, 11.4, 11.3, 11.3, 11.3, 11.2, 11.2, 11.2, 11.1, 11.1, 11.1, 11.0],
  [10.9, 11.2, 11.4, 11.4, 11.4, 11.3, 11.3, 11.2, 11.2, 11.2, 11.1, 11.1, 11.0, 11.0, 10.9],
  [10.8, 11.0, 10.9, 11.0, 11.0, 11.0, 10.9, 10.9, 10.9, 10.9, 10.9, 10.9, 10.8, 10.9, 10.7],
  [10.6, 10.7, 10.8, 10.8, 10.8, 10.7, 10.7, 10.7, 10.6, 10.6, 10.6, 10.5, 10.5, 10.5, 10.5],
  [10.4, 10.6, 10.7, 10.7, 10.6, 10.6, 10.6, 10.5, 10.5, 10.4, 10.4, 10.4, 10.3, 10.3, 10.2],
  [10.2, 10.3, 10.4, 10.4, 10.4, 10.4, 10.3, 10.2, 10.2, 10.1, 10.2, 10.1, 10.0, 10.0, 9.9],
  [10.0, 10.3, 10.3, 10.3, 10.2, 10.2, 10.1, 10.1, 10.0, 10.0, 9.9, 9.8, 9.8, 9.7, 9.8],
  [9.8, 9.9, 9.8, 9.8, 9.8, 9.7, 9.7, 9.7, 9.7, 9.6, 9.5, 9.5, 9.5, 9.5, 9.4],
  [9.5, 9.6, 9.7, 9.7, 9.6, 9.6, 9.5, 9.5, 9.4, 9.4, 9.3, 9.3, 9.2, 9.2, 9.2],
  [9.3, 9.5, 9.6, 9.5, 9.5, 9.5, 9.4, 9.4, 9.4, 9.4, 9.3, 9.3, 9.2, 9.2, 9.0],
  [9.2, 9.4, 9.3, 9.3, 9.3, 9.2, 9.2, 9.2, 9.1, 9.1, 9.0, 9.1, 9.0, 9.0, 8.8],
  [8.9, 9.1, 9.2, 9.1, 9.0, 9.0, 9.0, 8.9, 8.9, 8.8, 8.8, 8.8, 8.8, 8.7, 8.6],
  [8.8, 9.0, 8.9, 8.8, 8.8, 8.7, 8.7, 8.7, 8.6, 8.6, 8.6, 8.6, 8.6, 8.5, 8.4],
  [8.3, 8.8, 8.7, 8.5, 8.5, 8.5, 8.5, 8.4, 8.4, 8.4, 8.4, 8.4, 8.3, 8.3, 8.2],
  [8.0, 8.3, 8.3, 8.2, 8.2, 8.3, 8.3, 8.2, 8.2, 8.2, 8.2, 8.2, 8.1, 8.2, 8.0],
] }
const STATEN_GROUND: GroundGrid = { y0: 984, x0: -28, step: 4, z: [
  [23.4, 23.4, 23.3, 23.1, 23.2, 23.5, 23.7, 24.1, 24.3, 24.7, 25.0, 25.8, 27.6, 28.9, 29.5],
  [23.6, 23.6, 23.4, 23.3, 23.3, 23.5, 23.8, 24.1, 24.5, 24.7, 25.1, 26.2, 27.4, 29.1, 29.6],
  [23.8, 23.8, 23.6, 23.6, 23.4, 23.7, 24.1, 24.3, 24.6, 24.8, 25.1, 25.8, 27.8, 29.4, 29.6],
  [24.1, 24.0, 24.0, 23.8, 24.0, 24.3, 24.4, 24.7, 24.9, 25.2, 25.5, 26.2, 27.6, 29.3, 29.7],
  [24.3, 24.3, 24.4, 24.3, 24.6, 24.7, 25.0, 25.3, 25.4, 25.8, 26.0, 26.5, 27.7, 29.2, 29.7],
  [24.6, 24.8, 24.7, 24.9, 25.0, 25.3, 25.5, 25.7, 26.1, 26.3, 26.8, 27.2, 27.4, 29.4, 23.4],
  [23.3, 23.1, 23.2, 23.5, 23.7, 24.1, 24.3, 24.7, 25.0, 25.8, 27.6, 28.9, 29.5, 30.1, 23.5],
  [23.4, 23.3, 23.3, 23.5, 23.8, 24.1, 24.5, 24.7, 25.1, 26.2, 27.4, 29.1, 29.6, 30.0, 23.8],
  [23.6, 23.6, 23.4, 23.7, 24.1, 24.3, 24.6, 24.8, 25.1, 25.8, 27.8, 29.4, 29.6, 30.0, 24.0],
  [24.0, 23.8, 24.0, 24.3, 24.4, 24.7, 24.9, 25.2, 25.5, 26.2, 27.6, 29.3, 29.7, 30.1, 24.2],
  [24.4, 24.3, 24.6, 24.7, 25.0, 25.3, 25.4, 25.8, 26.0, 26.5, 27.7, 29.2, 29.7, 30.2, 24.5],
  [24.7, 24.9, 25.0, 25.3, 25.5, 25.7, 26.1, 26.3, 26.8, 27.2, 27.4, 29.4, 29.5, 29.8, 29.9],
  [26.9, 26.8, 27.1, 27.3, 27.6, 27.9, 28.1, 28.4, 28.7, 29.0, 29.3, 29.5, 29.8, 30.0, 30.0],
  [27.1, 27.3, 27.5, 27.7, 28.0, 28.2, 28.5, 28.8, 29.0, 29.3, 29.5, 29.8, 30.0, 30.2, 30.0],
  [27.5, 27.6, 27.9, 28.1, 28.2, 28.5, 28.8, 28.9, 29.1, 29.3, 29.5, 29.7, 30.0, 30.1, 30.1],
  [27.8, 27.9, 28.1, 28.3, 28.5, 28.7, 28.9, 29.1, 29.2, 29.5, 29.7, 29.9, 30.1, 30.2, 30.2],
  [28.1, 28.2, 28.4, 28.5, 28.7, 28.9, 29.1, 29.3, 29.5, 29.6, 29.8, 30.0, 30.2, 30.4, 30.2],
  [28.5, 28.6, 28.7, 28.9, 29.0, 29.2, 29.4, 29.4, 29.6, 29.7, 29.5, 29.8, 29.9, 30.1, 26.6],
  [27.1, 27.3, 27.6, 27.9, 28.1, 28.4, 28.7, 29.0, 29.3, 29.5, 29.8, 30.0, 30.0, 30.5, 27.1],
  [27.5, 27.7, 28.0, 28.2, 28.5, 28.8, 29.0, 29.3, 29.5, 29.8, 30.0, 30.2, 30.0, 30.2, 27.3],
  [27.9, 28.1, 28.2, 28.5, 28.8, 28.9, 29.1, 29.3, 29.5, 29.7, 30.0, 30.1, 30.1, 30.5, 27.6],
  [28.1, 28.3, 28.5, 28.7, 28.9, 29.1, 29.2, 29.5, 29.7, 29.9, 30.1, 30.2, 30.2, 30.4, 28.0],
  [28.4, 28.5, 28.7, 28.9, 29.1, 29.3, 29.5, 29.6, 29.8, 30.0, 30.2, 30.4, 30.2, 30.4, 28.5],
  [28.7, 28.9, 29.0, 29.2, 29.4, 29.4, 29.6, 29.7, 30.7, 30.7, 30.7, 30.6, 30.7, 30.6, 30.5],
  [30.6, 30.6, 30.7, 30.6, 30.7, 30.7, 30.7, 30.7, 30.7, 30.7, 30.7, 30.7, 30.7, 30.6, 30.6],
  [30.8, 30.8, 30.7, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.5, 30.6, 30.5, 30.5],
  [31.3, 31.2, 31.1, 31.3, 30.9, 31.1, 31.2, 31.0, 31.0, 31.0, 31.0, 30.7, 30.5, 30.7, 30.8],
  [31.8, 31.7, 31.6, 31.8, 31.7, 31.7, 31.6, 31.7, 31.7, 31.6, 31.7, 31.5, 31.5, 31.8, 31.6],
  [31.8, 31.8, 31.8, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 32.0, 32.0, 32.3, 32.2],
  [31.6, 31.7, 31.6, 31.6, 31.8, 31.8, 31.9, 31.9, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0],
  [31.7, 31.7, 31.7, 31.8, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.8, 31.8, 31.8, 31.8],
  [31.7, 31.9, 31.9, 31.9, 31.8, 31.8, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.8],
  [31.7, 31.7, 31.8, 31.7, 31.8, 31.8, 31.9, 31.9, 31.9, 32.0, 32.0, 32.1, 32.1, 32.1, 32.1],
  [31.7, 31.7, 31.7, 31.7, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.9, 31.8, 31.8],
  [31.9, 31.9, 31.9, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 31.8, 31.9, 31.8, 31.8],
  [31.8, 31.8, 31.9, 32.0, 32.1, 32.0, 32.0, 32.1, 32.1, 32.1, 32.1, 32.1, 32.1, 32.0, 32.0],
  [31.8, 31.8, 31.8, 31.9, 32.1, 32.1, 32.2, 32.1, 32.1, 32.2, 32.1, 32.1, 32.3, 32.1, 32.1],
  [31.9, 31.9, 31.8, 31.8, 31.9, 32.0, 32.0, 32.0, 32.1, 32.1, 32.1, 32.1, 32.5, 32.1, 32.0],
  [31.9, 31.8, 31.8, 31.7, 31.8, 31.8, 31.8, 31.9, 31.8, 31.9, 32.1, 32.1, 32.2, 31.8, 31.9],
  [31.9, 31.8, 31.6, 31.7, 31.7, 31.7, 31.7, 31.7, 31.8, 31.8, 31.8, 31.8, 31.7, 31.7, 31.7],
  [32.0, 31.9, 31.8, 31.8, 31.8, 31.8, 31.7, 31.7, 31.7, 31.6, 31.6, 31.6, 31.5, 31.5, 31.5],
  [32.1, 32.0, 31.9, 31.9, 31.9, 31.9, 32.0, 31.9, 31.9, 32.0, 31.9, 31.9, 31.5, 31.4, 31.4],
  [32.2, 32.1, 32.0, 32.1, 32.1, 32.2, 32.2, 32.3, 32.3, 32.4, 32.3, 32.5, 31.6, 31.4, 31.4],
  [32.4, 32.2, 32.2, 32.1, 32.0, 32.0, 31.9, 31.9, 31.9, 31.8, 31.8, 31.8, 31.7, 31.6, 31.5],
  [32.5, 32.4, 32.3, 32.3, 32.3, 32.2, 32.2, 32.1, 32.1, 32.1, 32.0, 32.0, 31.9, 31.7, 31.6],
  [32.7, 32.6, 32.5, 32.4, 32.4, 32.3, 32.3, 32.3, 32.3, 32.2, 32.2, 32.2, 32.0, 31.8, 31.6],
  [33.0, 32.8, 32.7, 32.7, 32.6, 32.6, 32.6, 32.5, 32.5, 32.5, 32.4, 32.4, 32.3, 32.0, 31.8],
  [33.1, 33.1, 33.0, 32.9, 32.9, 32.8, 32.8, 32.7, 32.7, 32.6, 32.6, 32.5, 32.4, 32.2, 31.9],
  [33.4, 33.3, 33.3, 33.2, 33.2, 33.1, 33.0, 33.0, 32.9, 32.9, 32.8, 32.7, 32.6, 32.3, 32.1],
  [33.7, 33.6, 34.0, 33.9, 33.9, 33.8, 33.7, 33.7, 33.4, 33.4, 33.5, 33.2, 32.7, 32.5, 32.2],
  [33.8, 33.8, 34.2, 34.9, 35.0, 34.8, 34.7, 34.5, 34.6, 34.6, 34.3, 34.2, 33.5, 32.9, 32.7],
  [34.1, 34.2, 35.0, 36.1, 35.8, 35.8, 35.7, 35.6, 35.6, 35.4, 35.2, 34.9, 34.2, 33.8, 33.3],
  [34.5, 34.4, 35.7, 36.6, 37.0, 37.0, 36.7, 36.7, 36.4, 36.2, 36.2, 35.9, 34.5, 34.2, 33.5],
  [34.7, 34.8, 36.6, 37.4, 38.0, 37.9, 37.7, 37.4, 37.4, 37.2, 36.9, 36.9, 35.9, 35.3, 34.1],
  [35.1, 35.7, 39.1, 38.9, 38.8, 38.6, 38.4, 38.2, 38.0, 37.9, 37.7, 37.4, 37.4, 37.3, 35.1],
  [35.4, 36.0, 39.0, 38.8, 38.7, 38.5, 38.3, 38.1, 38.0, 37.7, 37.4, 37.3, 37.2, 37.7, 36.0],
  [35.7, 37.7, 39.0, 38.8, 38.7, 38.5, 38.3, 38.0, 37.8, 37.6, 37.4, 37.1, 37.1, 37.3, 35.9],
  [36.0, 38.1, 38.9, 38.8, 38.7, 38.5, 38.2, 38.0, 37.7, 37.5, 37.2, 37.0, 37.0, 36.9, 36.4],
  [36.3, 38.9, 39.0, 38.8, 38.7, 38.4, 38.2, 37.9, 37.7, 37.4, 37.1, 36.9, 36.8, 36.7, 36.3],
  [36.6, 39.2, 38.9, 38.7, 38.6, 38.3, 38.0, 37.8, 37.5, 37.3, 37.0, 36.8, 36.7, 36.6, 36.6],
  [36.9, 38.6, 38.9, 38.6, 38.6, 38.3, 38.1, 37.8, 37.5, 37.2, 36.9, 36.7, 36.5, 36.4, 36.4],
  [37.2, 38.7, 38.8, 38.7, 38.6, 38.3, 38.0, 37.7, 37.4, 37.1, 36.8, 36.6, 36.4, 36.3, 36.3],
  [37.5, 38.8, 38.8, 38.6, 38.6, 38.3, 37.9, 37.7, 37.4, 37.0, 36.8, 36.5, 36.3, 36.1, 36.2],
  [37.8, 38.8, 38.8, 38.6, 38.5, 38.2, 37.8, 37.5, 37.2, 36.9, 36.5, 36.2, 36.2, 36.0, 36.0],
  [38.0, 39.1, 38.8, 38.6, 38.5, 38.2, 38.0, 37.6, 37.3, 37.0, 36.5, 36.2, 36.0, 35.9, 35.9],
  [38.1, 38.6, 38.8, 38.5, 38.5, 38.3, 37.9, 37.5, 37.2, 36.8, 36.5, 36.2, 36.0, 35.8, 35.8],
  [38.4, 38.8, 38.8, 38.6, 38.5, 38.1, 37.8, 37.5, 37.1, 36.9, 36.5, 36.1, 35.9, 35.7, 35.7],
  [38.6, 38.7, 38.8, 38.5, 38.4, 38.2, 37.8, 37.5, 37.1, 36.7, 36.4, 36.0, 35.8, 35.7, 35.5],
  [38.7, 38.8, 38.7, 38.5, 38.4, 38.2, 37.8, 37.4, 37.1, 36.7, 36.4, 36.2, 35.7, 35.6, 35.4],
  [38.7, 38.9, 38.7, 38.5, 38.3, 38.1, 37.8, 37.5, 37.0, 36.8, 36.4, 36.1, 35.7, 35.6, 35.4],
  [38.8, 39.1, 38.7, 38.5, 38.2, 38.0, 37.8, 37.3, 37.1, 36.7, 36.4, 36.6, 35.9, 35.6, 35.4],
  [38.8, 39.0, 38.7, 38.5, 38.2, 37.9, 38.7, 39.9, 39.8, 41.4, 42.2, 42.0, 38.0, 35.6, 35.4],
  [38.7, 39.0, 38.6, 38.4, 38.2, 41.5, 43.0, 42.8, 42.5, 42.4, 42.1, 41.8, 39.6, 35.7, 35.4],
  [38.7, 38.9, 38.7, 38.4, 38.2, 39.7, 43.0, 42.7, 42.5, 42.3, 41.9, 41.7, 41.5, 35.7, 35.5],
] }

// ---- Towers ------------------------------------------------------------------------

/** One tower on its pier, centred on y = 0: the tower model's design. */
function tower(steel: Part, seam: Part, pier: Part) {
  const PIER = nav(9.3), SPRING = nav(156.6), HEAD = nav(210.9)
  const STRUT1 = BOT(TY) - 0.4, STRUT0 = STRUT1 - 9
  const XI = 14.5
  const xo = (z: number) => 25 - (1.5 * (z - PIER)) / (HEAD - PIER)
  const yd = (z: number) => 6 - (1.0 * (z - PIER)) / (HEAD - PIER)
  const CH = 0.9

  for (const s of [-1, 1]) {
    const [a, b] = s > 0 ? [11, 28.7] : [-28.7, -11]
    box(pier, a, b, -11.5, 11.5, 0, PIER - 1.2, { r: 1.2, bottom: false })
    box(pier, a + 0.9, b - 0.9, -10.6, 10.6, PIER - 1.2, PIER, { r: 0.9, top: 0.4, bottom: false })
  }
  for (const s of [-1, 1]) {
    const ring = (z: number) => {
      const a = s * XI, b = s * xo(z)
      return rim(Math.min(a, b), Math.max(a, b), -yd(z), yd(z), CH, z)
    }
    loftSolid(steel, [ring(PIER), ring(STRUT0), ring(SPRING), ring(HEAD)], [false, true])
  }
  const HD = yd(SPRING) - 0.15
  archWall(steel, seam, -XI - 0.2, XI + 0.2, -HD, HD, 0, SPRING, XI, HEAD, 12)
  box(steel, -XI - 0.2, XI + 0.2, -HD, HD, HEAD - 0.01, HEAD, { r: 0, bottom: false })
  box(steel, -XI - 0.2, XI + 0.2, -yd(STRUT0) + 0.4, yd(STRUT0) - 0.4, STRUT0, STRUT1, { r: 0.4, bot: 0.3, top: 0.3, bottom: true })
}

// ---- Anchorages ----------------------------------------------------------------------

const AX_IN = 13.6, AX_OUT = 24.1

/**
 * An anchorage: a concrete wedge either side of the roadways, from its river
 * face (`y0`) back to `y1`, its top `top(a)` falling to the ground at the
 * back, and between the wedges a block kept under the lower roadway.
 */
function anchorage(p: Part, y0: number, y1: number, ground: GroundGrid, top: (a: number) => number) {
  const g = (x: number, y: number) => groundAt(ground, x, y)
  const sy = Math.sign(y0)
  const t = (_: number, y: number) => Math.max(top(Math.abs(y)), g(0, y) + 0.5)
  const mid = (_: number, y: number) => Math.min(t(0, y), lower(y) - 0.4)
  const ys = stations(y0, y1, 4)
  const lid = (x0: number, x1: number, h: (x: number, y: number) => number) => {
    for (let i = 0; i + 1 < ys.length; i++) {
      const ya = ys[i], yb = ys[i + 1], ta = h(0, ya), tb = h(0, yb)
      face(p, [x0, ya, ta], [x1, ya, ta], [x1, yb, tb], [x0, yb, tb], norm([0, -(tb - ta) / (yb - ya), 1]))
    }
  }
  for (const s of [-1, 1]) {
    const xi = s * AX_IN, xo = s * AX_OUT
    footedWall(p, [xi, y0], [xo, y0], g, t, [0, -sy, 0])
    footedWall(p, [xi, y1], [xo, y1], g, t, [0, sy, 0])
    footedWall(p, [xo, y0], [xo, y1], g, t, [s, 0, 0])
    footedWall(p, [xi, y0], [xi, y1], mid, t, [-s, 0, 0])
    lid(Math.min(xi, xo), Math.max(xi, xo), t)
  }
  footedWall(p, [-AX_IN, y0], [AX_IN, y0], g, mid, [0, -sy, 0])
  footedWall(p, [-AX_IN, y1], [AX_IN, y1], g, mid, [0, sy, 0])
  lid(-AX_IN, AX_IN, mid)
}

// ---- Approaches ----------------------------------------------------------------------

/** The upper deck's edges past each anchorage face, [y, left x, right x] (lidar). */
const EDGES = {
  bk: [[-1003.5, -15.2, 14.4], [-1100, -15.5, 14.6], [-1150, -16, 15.2], [-1180, -17.2, 16.6], [-1204, -17.4, 17.4], [ENDS[0], -17.5, 20]],
  si: [[993.4, -15.1, 14.5], [1080, -15, 14.6], [1130, -13.7, 13.2], [1230, -13.6, 13.4], [ENDS[1], -11, 18.5]],
}
const PIERS = { bk: [-1060, -1116, -1172, -1226], si: [1050, 1110, 1230] }
const LOWER_END = { bk: ENDS[0], si: 1180 } // the Staten Island lower roadways come down to the ground past here

function approach(steel: Part, under: Part, concrete: Part, side: 'bk' | 'si', ground: GroundGrid) {
  const g = (x: number, y: number) => groundAt(ground, x, y)
  const edges = EDGES[side] as [number, number, number][]
  const edge = (s: number) => piecewise(edges.map(([y, l, r]) => [y, s < 0 ? l : r] as [number, number]).sort((a, b) => a[0] - b[0]))
  const [y0] = ANCHOR[side], y1 = ENDS[side === 'bk' ? 0 : 1]
  const ys = stations(y0, y1, 8)
  const lowEnd = LOWER_END[side]
  const lowYs = ys.filter((y) => Math.abs(y) <= Math.abs(lowEnd) + 0.01)
  const anchorTop = side === 'bk' ? BROOKLYN_TOP : STATEN_TOP
  const footing = (x: number, y: number) => {
    const inAnchor = Math.abs(y) <= Math.abs(ANCHOR[side][1]) && Math.abs(x) >= AX_IN
    return inAnchor ? Math.max(g(x, y), anchorTop(Math.abs(y))) : g(x, y)
  }
  for (const s of [-1, 1]) {
    const e = edge(s)
    // Girders along each deck's edge: a band whose outer face is the fascia.
    const girder = (list: number[], top: (y: number) => number, depth: number) => {
      for (let i = 0; i + 1 < list.length; i++) {
        const ya = list[i], yb = list[i + 1], xa = e(ya), xb = e(yb)
        const quad = (za: number, zb: number, zc: number, zd: number, xoff: number, n: V3) =>
          face(steel, [xa + xoff, ya, za], [xb + xoff, yb, zb], [xb + xoff, yb, zc], [xa + xoff, ya, zd], n)
        const [ta, tb] = [top(ya), top(yb)], [ba, bb] = [ta - depth, tb - depth]
        quad(ba, bb, tb, ta, 0, [s, 0, 0])
        quad(ba, bb, tb, ta, -s * 0.5, [-s, 0, 0])
      }
    }
    girder(ys, (y) => upper(y) - 0.6, 1.8)
    girder(lowYs, (y) => lower(y) - 0.4, 1.8)
  }
  // Soffits under each deck, facing down.
  const width = (y: number) => [edge(-1)(y), edge(1)(y)]
  for (const [list, z] of [[ys, (y: number) => upper(y) - 2.4], [lowYs, (y: number) => lower(y) - 2.2]] as const)
    for (let i = 0; i + 1 < list.length; i++) {
      const ya = list[i], yb = list[i + 1], [la, ra] = width(ya), [lb, rb] = width(yb)
      face(under, [la, ya, z(ya)], [ra, ya, z(ya)], [rb, yb, z(yb)], [lb, yb, z(yb)], [0, 0, -1])
    }
  // Piers: a column outside each edge up to the upper deck, a cap beam under the lower.
  for (const y of PIERS[side]) {
    const xs = [-1, 1].map((s) => edge(s)(y) + s * 0.9)
    for (const x of xs) box(concrete, x - 0.8, x + 0.8, y - 0.8, y + 0.8, footing(x, y) - 0.3, upper(y) - 2.4, { r: 0.2, bottom: false })
    const capTop = lower(y) - 2.2
    if (Math.abs(y) <= Math.abs(lowEnd) && capTop - 1.4 > footing(0, y) + 1)
      box(concrete, xs[0] - 0.8, xs[1] + 0.8, y - 0.9, y + 0.9, capTop - 1.4, capTop, { r: 0.2 })
  }
}

const BROOKLYN_TOP = (a: number) => nav(Math.min(54.4, 48.4 - 0.453 * (a - 1020)))
const STATEN_TOP = (a: number) => nav(Math.min(53.8, 50.5 - 0.32 * (a - 1020)))

// ---- Build ---------------------------------------------------------------------------

const steelT = new Part(), seamT = new Part(), pierT = new Part()
tower(steelT, seamT, pierT)
const towers = (p: Part) => merged(movedAlong(p, -TY), movedAlong(p, TY))

const steelLow = new Part(), steelDetail = new Part(), web = new Part()
const under = new Part(), underDetail = new Part()
const concrete = new Part(), approachSteel = new Part(), approachUnder = new Part()

for (const span of spans) {
  const ys = curve(span), ps = panels(span)
  for (const s of [-1, 1]) {
    const x0 = s * (TRUSS_X - TRUSS_W / 2), x1 = s * (TRUSS_X + TRUSS_W / 2)
    band(steelLow, x0, x1, ys, TOP, BOT, { out: true, in: true, top: true, bottom: true, ends: true })
    truss(steelDetail, web, s * TRUSS_X, ps, TOP, BOT, { chordW: TRUSS_W, topD: 0.9, botD: 0.9, member: 0.45, curve: ys })
  }
  for (const p of [under, underDetail]) band(p, -TRUSS_X, TRUSS_X, ys, BOT, SOFFIT, { bottom: true })
  // The upper deck's floor, seen from the lower roadway and through the lattice.
  band(underDetail, -TRUSS_X + TRUSS_W / 2, TRUSS_X - TRUSS_W / 2, ys, TOP, (y) => upper(y) - 1.6, { bottom: true })
  // Floor beams under the lower roadway, and bottom lateral bracing.
  for (let i = 0; i < ps.length; i += 2) {
    const y = ps[i]
    band(underDetail, -TRUSS_X, TRUSS_X, [y - 0.3, y + 0.3], () => SOFFIT(y), () => SOFFIT(y) - 0.9, { bottom: true, out: true, in: true, ends: true })
    if (i + 2 < ps.length) {
      const y2 = ps[i + 2]
      for (const [xa, xb] of [[-1, 1], [1, -1]])
        strip(web, [xa * TRUSS_X, y, SOFFIT(y) - 0.5], [xb * TRUSS_X, y2, SOFFIT(y2) - 0.5], 0.45, [0, 0, 1])
    }
  }
  // Suspenders: one from each cable at every station, down to the top chord.
  const first = Math.ceil(span[0] / HANGER), last = Math.floor(span[1] / HANGER)
  for (let k = first; k <= last; k++) {
    const y = k * HANGER
    if (Math.abs(Math.abs(y) - TY) < FACE + 3 || y - span[0] < 3 || span[1] - y < 3) continue
    for (const s of [-1, 1]) for (const cx of CABLES) {
      const z1 = cable(y) - CABLE_R * 0.6, z0 = TOP(y)
      if (z1 - z0 > 1) rod(steelDetail, [s * (cx < TRUSS_X ? TRUSS_X - 0.3 : TRUSS_X + 0.3), y, z0], [s * cx, y, z1], 0.2, 4)
    }
  }
}

// Main cables, anchorage to anchorage over the saddles, a few metres into each face.
const cablePath = (x: number, step: number): V3[] => {
  const a0 = ANCHOR.bk[0] - 3, a1 = ANCHOR.si[0] + 3
  const ys = [...new Set([...stations(a0, -TY, step), ...stations(-TY, TY, step), ...stations(TY, a1, step)])]
  return ys.map((y) => [x, y, cable(y)] as V3)
}
for (const s of [-1, 1]) for (const cx of CABLES) {
  tube(steelLow, cablePath(s * cx, 60), CABLE_R, 5)
  tube(steelDetail, cablePath(s * cx, 12), CABLE_R, 8)
}

anchorage(concrete, ANCHOR.bk[0], ANCHOR.bk[1], BROOKLYN_GROUND, BROOKLYN_TOP)
anchorage(concrete, ANCHOR.si[0], ANCHOR.si[1], STATEN_GROUND, STATEN_TOP)
approach(approachSteel, approachUnder, concrete, 'bk', BROOKLYN_GROUND)
approach(approachSteel, approachUnder, concrete, 'si', STATEN_GROUND)

const STEEL: Swatch = finish('verrazzano-grey-green', 0xb6bdb8)
const SEAM: Swatch = finish('verrazzano-grey-green-shade', 0x9aa39f)
const CONCRETE: Swatch = finish('pier-concrete', 0xcbc3b4)
const low = [
  { part: merged(towers(steelT), steelLow, approachSteel), material: STEEL },
  { part: merged(towers(seamT), under, approachUnder), material: SEAM },
  { part: merged(towers(pierT), concrete), material: CONCRETE },
]
const detail = [
  { part: merged(towers(steelT), steelDetail, web, approachSteel), material: { ...STEEL, doubleSided: true } },
  { part: merged(towers(seamT), underDetail, approachUnder), material: SEAM },
  { part: merged(towers(pierT), concrete), material: CONCRETE },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
  bearing: 247.1, elevation: 0, towers: [-TY, TY], anchorageFaces: [ANCHOR.bk[0], ANCHOR.si[0]], ends: ENDS,
  datum: 'z = NAVD88 + 1.63', upperMidspan: upper(0), upperAtTowers: upper(TY), upperEnds: ENDS.map(upper), levels: LEVELS,
}
for (const [file, list, maxTris, maxBytes] of [
  ['nyc-verrazzano-narrows-bridge.glb', low, 6500, 250 * 1024],
  ['nyc-verrazzano-narrows-bridge.detail.glb', detail, 40000, 1536 * 1024],
] as const) {
  const tris = countParts([...list])
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
  const glb = writeGlb('Verrazzano-Narrows Bridge', [...list], extras)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
}
