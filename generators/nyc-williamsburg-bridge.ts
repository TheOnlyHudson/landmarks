/**
 * Williamsburg Bridge (1903; Leffert L. Buck, Henry Hornbostel) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-williamsburg-bridge.ts
 *
 * The whole bridge as one placement, end to end of its OSM outline: both
 * steel towers on their masonry piers, the four main cables and their
 * straight backstays, the suspenders, the two deep stiffening trusses, the
 * deck's underside and outer railings, the side spans' steel bents, both
 * masonry anchorages, the approach viaducts on their columns, and what the
 * model owns on top: the two raised paths, the ramps and shared path that
 * carry them to the street, and the J/M/Z tracks with the Brooklyn
 * approach's elevated track structure. The map draws the four roadways.
 * Writes a low model (towers with plain posts and flat bracing, cables,
 * trusses as solid bands) and a detail model (the towers in full, open
 * trusses, suspenders, floor beams, railings, path posts), which a map
 * draws from detailZoom up.
 *
 * Frame: x across the bridge (+x the north side), y along it toward
 * Manhattan, z up, metres; origin midway between the towers, on the water.
 * Placed at bearing 291.8°, the line from the Brooklyn tower's centroid to
 * the Manhattan one's (487.3 m apart; the published main span is 1,600 ft).
 *
 * Height. z = 0 is the East River as the map's terrain draws it, -1.63 m
 * NAVD88, so every height here is NAVD88 + 1.63 (`L`). Lidar reads the river
 * at about -0.1 m that day; building to the lidar's own water instead would
 * stand the model 1.5 m low on the map. The roadway built to, NAVD88 (USGS
 * 3DEP lidar, the lower quartile of both outer carriageways every 20 m,
 * within 0.2 m of tools/bridge_ele.py on every carriageway):
 * - 44.6 m at midspan, 43.2 at y = ±100, 39.0 at the towers (a 2.9 %
 *   grade between), 4.0–4.2 % down the side spans to 32.7 at the
 *   anchorages' river faces (y = ±422);
 * - Brooklyn approach: 31.1 at the anchorage, a straight 2.7 % to 17.5 at the
 *   outline's end (y = -946), where it lands;
 * - Manhattan approach: 31.2 at the anchorage, 2.9 % to 12.6 at the
 *   outline's end (y = 1096), still 6 m in the air.
 * The map drew the main span 39–43 m; `ele` pins on the roadway nodes
 * (osmChange written alongside this model, not part of the repo) bring it
 * to these. The inner roadways run under the paths, where lidar can't see
 * them; they are taken as level with the outer ones, as at both ends where
 * they show.
 *
 * Standing on the terrain. The towers stand in the river at z = 0. Every
 * other foot (bents, anchorages, approach columns, ramp posts) runs down to
 * the map's own terrain under it, vertex by vertex, from 10 m tables of
 * Mapterhorn heights + 1.63 taken in this frame (`BROOKLYN_GROUND`,
 * `MANHATTAN_GROUND`).
 *
 * Sources:
 * - OSM: the outline way/533212910 (height 41, layer 2), from y = -946.9 to
 *   +1096.5; towers way/1016434034 and way/1016434035 (pylons, 36.6 x 12.2 m);
 *   the anchorages way/279593081 (Brooklyn, y -461..-422) and
 *   way/1016434036 (Manhattan, 421..462); the ramps' lines, footway
 *   way/1034898979 and cycleway way/1167752612.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, 1 m grids every 100 m along the
 *   whole outline and 0.5 m at midspan): the roadway above; the stiffening
 *   trusses at x = ±10.25, their tops 55.4 m at midspan, 50.3 at the towers,
 *   44.5 at the anchorages; the deck's edges at ±18.3; the paths over the
 *   inner roadways at |x| 4.5–9, 49.4 m at midspan and 37.0 at the
 *   anchorages, 4.8 m over the roadway; the tracks at x = ±1.7, level with
 *   the roadway at midspan (44.3) and 4 m over it at the anchorages; the
 *   cables in pairs, 13.75/6.75 m out at the saddles and 1.2 m apart at
 *   x ≈ ±10.25 near midspan, a parabola 47.8 m low at midspan (inside the
 *   trusses) to 103.3 at the towers; the backstays straight to the
 *   anchorages, 61.2 m at y = -340 and 36.6 at -400, splaying to |x| 3.8
 *   and 16; the Brooklyn tracks on their own structure 6–7 m over the
 *   approach (26.4 m at its end), the Manhattan paths merged into one deck
 *   at 35.4 m (y = 600) falling 4 % to 15.5 at the outline's end; the ramps
 *   (north 2.7 % then 4.8 %, south a straight 7.2 %); tower piers 7.5 m.
 * - Published (Wikipedia "Williamsburg Bridge", citing the NYC landmark
 *   report): main span 1,600 ft, towers 335 ft above mean high water; side
 *   spans not suspended but carried by the trusses on intermediate towers
 *   of two four-column piers on masonry footings; stiffening trusses 67 ft
 *   apart and 40 ft deep, continuous anchorage to anchorage; floor beams
 *   5 ft deep every 20 ft; four cables of 18¾ in; suspenders every 20 ft;
 *   the paths above the inner roadways; anchorages 80 ft above the street.
 * - Photos: HAER NY,31-NEYO,165-1 "View from Manhattan with Brooklyn in right
 *   background" (Jet Lowe, public domain; the side spans' bents, the lattice
 *   trusses, the approach viaduct); and the tower photos below.
 *
 * The towers, as the approved tower model, moved to the bridge's heights
 * (all of them + 1.63 for the datum) and with its deck stub taken out:
 * - What makes it the Williamsburg Bridge: an all-steel tower of two
 *   separate lattice shafts, each a four-post tower braced with X panels on
 *   every face, the outer faces leaning in toward the top; one tall slim X
 *   between the shafts above the deck and an arched brace below it; a flared
 *   cap on each shaft carrying two cable saddles, a girder across the top;
 *   each shaft on its own masonry pier. Plain grey paint.
 * - Lidar (Manhattan tower): four cable saddles at |x| 6.75 and 13.75,
 *   104–105.8 m NAVD88, about 13 m long; cross girder top 102.4 m, 35 m
 *   across; bracing planes at |y| 3.5 between the shafts.
 * - Photos (Wikimedia Commons): "Williamsburg Bridge, New York City,
 *   20231001 1053 0976" and "... 1054 0984" (Jakub Hałun, CC BY 4.0);
 *   "Williamsburg Bridge NY2" (Acroterion, CC BY-SA 4.0); "Williamsburg Bridge
 *   east tower" (Beyond My Ken, CC BY-SA 4.0); "Williamsburg Bridge tower
 *   (3933002966)" (Patrick Nielsen Hayden, CC BY 2.0); "East River Park td
 *   (2025-10-25) 115" (Tdorante10, CC BY-SA 4.0) and "View from Domino Park
 *   027" (Kidfly182, CC BY 4.0), for the current paint: plain mid grey with a
 *   faint blue cast, pulled to the palette.
 *
 * Estimated or simplified:
 * - The side spans' bents: three a side, evenly between tower and
 *   anchorage, each two piers of four columns 7 x 4 m; their number and
 *   spacing are from the HAER photo, not a plan. The approach viaducts'
 *   columns every 30 m (four a bent; the low model keeps the outer two).
 * - Truss panels and suspenders every 12.2 m, half the real 20 ft spacing;
 *   the cables drawn 0.9 m thick, twice the real 18¾ in.
 * - The anchorages are plain masonry blocks on OSM's footprints, their roofs
 *   0.4 m under the roadway; no arches or cornices.
 * - The paths through the towers pass the shafts' inner posts.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { archWall, box, beam, loftSolid, norm, rim, add, mul } from './nyc-manhattan-bridge'
import {
  band, face, footedLoft, footedWall, groundAt, merged, movedAlong, parabola, piecewise, rod, stations, strip, truss, tube,
  type GroundGrid,
} from './bridge-kit'

/** The map's river is -1.63 m NAVD88: every lidar height is lifted by that. */
const L = 1.63
const navd = (points: [number, number][]) => piecewise(points.map(([y, z]) => [y, z + L] as [number, number]))

const TY = 243.6                 // towers' centre lines, y = ±TY
const TD = 6.1                   // towers' half-depth
const ANCHOR = 422               // anchorages' river faces, y = ±ANCHOR
const BACK_B = -461, BACK_M = 462 // their landward faces
const END_B = -946.5, END_M = 1096.2 // the outline's ends

// ---- Profiles (lidar, NAVD88) ------------------------------------------------

/** The roadway, all four carriageways (see the header). */
const ROAD = navd([
  [-946.5, 17.5], [-940, 17.9], [-900, 19.4], [-860, 20.4], [-820, 21.3], [-780, 22.3], [-740, 23.3], [-700, 24.3],
  [-660, 25.3], [-620, 26.3], [-580, 27.6], [-540, 28.7], [-500, 29.8], [-460, 31.1], [-440, 31.9], [-420, 32.7],
  [-400, 33.6], [-380, 34.4], [-360, 35.2], [-340, 36.0], [-320, 36.6], [-300, 37.2], [-280, 37.9], [-260, 38.5],
  [-240, 39.0], [-220, 39.7], [-200, 40.3], [-180, 40.9], [-160, 41.5], [-140, 42.0], [-120, 42.6], [-100, 43.2],
  [-80, 43.7], [-60, 44.1], [-40, 44.3], [-20, 44.5], [0, 44.6], [20, 44.5], [40, 44.4], [60, 44.1], [80, 43.6],
  [100, 43.2], [120, 42.7], [140, 42.1], [160, 41.6], [180, 41.0], [200, 40.4], [220, 39.7], [240, 39.0], [260, 38.6],
  [280, 37.9], [300, 37.1], [320, 36.5], [340, 36.0], [360, 35.1], [380, 34.3], [400, 33.5], [420, 32.7], [440, 31.9],
  [460, 31.2], [500, 29.9], [540, 28.8], [580, 27.6], [620, 26.4], [660, 25.3], [700, 24.1], [740, 23.0], [780, 21.8],
  [820, 20.7], [860, 19.4], [900, 18.3], [940, 17.1], [980, 16.0], [1020, 14.8], [1060, 13.7], [1096.2, 12.6],
])
/** The stiffening trusses' tops. */
const TRUSS_TOP = navd([
  [-ANCHOR, 44.5], [-400, 45.4], [-360, 47.0], [-320, 48.2], [-280, 49.6], [-260, 50.3], [-220, 51.5], [-180, 52.7],
  [-140, 53.8], [-100, 54.8], [-80, 55.3], [0, 55.4], [80, 55.3], [100, 54.8], [140, 53.8], [180, 52.7], [220, 51.5],
  [260, 50.3], [280, 49.6], [320, 48.2], [360, 47.0], [400, 45.4], [ANCHOR, 44.5],
])
/** The raised paths over the inner roadways. */
const PATH = navd([
  [-448, 37.0], [-420, 37.5], [-400, 38.3], [-380, 39.1], [-360, 39.8], [-340, 40.5], [-320, 41.2], [-300, 41.8],
  [-280, 42.6], [-260, 43.2], [-220, 44.4], [-180, 45.6], [-140, 46.8], [-100, 47.9], [-80, 48.5], [-60, 48.8],
  [-40, 49.1], [0, 49.4], [40, 49.1], [60, 48.8], [80, 48.5], [100, 47.9], [140, 46.7], [180, 45.6], [220, 44.5],
  [260, 43.2], [280, 42.5], [300, 41.9], [340, 40.5], [380, 39.0], [400, 38.2], [420, 37.5], [440, 37.2], [480, 36.9],
  [520, 36.6], [560, 36.2],
])
/** The tracks: on their own structure over the Brooklyn approach, then on the main deck. */
const TRACK = navd([
  [-946.5, 26.4], [-860, 26.6], [-820, 27.1], [-780, 28.2], [-740, 29.3], [-700, 30.5], [-660, 31.7], [-620, 32.9],
  [-580, 34.1], [-540, 35.3], [-500, 36.0], [-480, 36.1], [-440, 36.2], [-400, 36.8], [-360, 37.8], [-320, 38.7],
  [-280, 39.6], [-240, 40.4], [-200, 41.1], [-160, 41.8], [-120, 42.5], [-80, 43.3], [-40, 44.0], [0, 44.3], [40, 44.0],
  [80, 43.3], [120, 42.5], [160, 41.8], [200, 41.1], [240, 40.3], [280, 39.5], [320, 38.6], [360, 37.8], [400, 36.8],
  [440, 35.9], [480, 34.3], [520, 32.7], [560, 31.2],
])
/** Past y = 560 the tracks keep falling under the Manhattan path to the roadway's level. */
const track = (y: number) => (y <= 560 ? TRACK(y) : Math.max(ROAD(y) + 0.3, TRACK(560) - 0.038 * (y - 560)))
/** The Manhattan approach's shared path, both paths merged over the tracks. */
const SPINE_M = navd([
  [590, 35.6], [600, 35.4], [640, 33.9], [680, 32.3], [720, 30.8], [760, 29.2], [800, 27.7], [840, 26.1], [880, 24.5],
  [920, 22.9], [960, 21.4], [1000, 19.8], [1040, 18.2], [1080, 16.3], [1096.2, 15.5],
])

const UNDER = 1.6                // the deck's underside below the roadway (floor beams, 5 ft)
const APPROACH_UNDER = 2.2       // the approach viaducts' girders
const RAIL = 1.1                 // railing and parapet height
const EDGE = 18.3                // the main deck's edges
const TX = 10.25                 // truss centre lines
const SOFFIT = (y: number) => ROAD(y) - UNDER

// ---- Ground (Mapterhorn + 1.63, rows along y, columns x = -30..30) -----------

const BROOKLYN_GROUND: GroundGrid = { y0: -960, x0: -30, step: 10, z: [
  [16, 15.8, 18.6, 18.5, 18.4, 18.4, 15.3], [16.1, 15.3, 19, 19, 18.9, 18.9, 14.9], [16, 14.9, 19.4, 19.2, 19.3, 19.3, 14.6],
  [15, 14.6, 15.4, 14.4, 15.1, 15.5, 14.3], [14.9, 14.5, 14.4, 14.3, 14.3, 14.3, 14.3], [15.1, 14.7, 14.7, 14.5, 14.5, 14.6, 14.6],
  [15.1, 14.9, 14.8, 14.6, 14.9, 15.1, 14.8], [15.1, 15.2, 15.1, 14.9, 15, 15, 14.9], [15.7, 15.4, 15.3, 15.2, 15.1, 15.1, 15.1],
  [16.9, 15.5, 15.4, 15.4, 15.4, 15.3, 15.3], [16.9, 15.8, 15.6, 15.5, 15.5, 15.6, 15.6], [16.8, 16, 15.8, 16.1, 15.9, 16.2, 15.8],
  [16.8, 16.1, 15.9, 15.9, 16, 16, 15.9], [16.7, 16.4, 16.3, 16.3, 16.2, 16.3, 16.1], [16.8, 16.5, 16.4, 16.4, 16.4, 16.5, 16.4],
  [16.8, 16.6, 16.5, 16.4, 16.5, 16.7, 16.6], [16.9, 16.6, 16.6, 16.6, 16.8, 16.9, 16.8], [16.6, 16.7, 16.8, 16.8, 16.9, 17, 16.9],
  [16.6, 16.7, 16.7, 16.6, 16.8, 16.9, 17], [16.6, 16.7, 16.8, 16.9, 16.9, 17.1, 16.9], [16.6, 16.9, 16.9, 16.9, 17, 17, 16.8],
  [16.7, 16.9, 16.9, 16.9, 17, 16.9, 16.7], [16.7, 16.8, 16.9, 17, 16.9, 16.9, 16.6], [16.7, 16.7, 16.8, 16.9, 16.8, 16.6, 16.5],
  [16.4, 16.6, 16.8, 16.8, 16.8, 16.6, 16.4], [16.7, 16.6, 16.6, 16.6, 16.6, 16.5, 16.3], [16.5, 16.5, 16.5, 16.5, 16.4, 16.4, 16.3],
  [15.9, 16.6, 16.6, 16.5, 16.4, 16.3, 16.2], [16.1, 16.5, 16.5, 16.4, 16.3, 16.2, 16.1], [16.3, 16.5, 16.4, 16.4, 16.3, 16.2, 15.9],
  [15.9, 16.4, 16.3, 16.3, 16.2, 16.1, 15.8], [14.9, 15.6, 15.5, 15.7, 15.8, 15.8, 15.6], [14.6, 14.8, 14.9, 15.1, 15.4, 15.5, 15.5],
  [14.3, 14.7, 15, 15.1, 15.3, 15.5, 15.3], [12.1, 14.8, 15, 15.3, 15.6, 15.2, 15], [11.5, 14.5, 14.9, 15.1, 15, 15, 14.9],
  [12.4, 14.5, 14.6, 14.7, 14.8, 14.8, 14.7], [14.1, 14.4, 14.5, 14.5, 14.5, 14.6, 14.4], [13.6, 13.8, 14.1, 14.3, 14.4, 14.2, 14.2],
  [13.1, 13.6, 13.8, 14.1, 14.2, 14.1, 14], [13.2, 13.5, 13.8, 14.2, 14, 14, 13.8], [13, 13.2, 13.4, 13.5, 13.6, 13.8, 13.5],
  [12.6, 12.7, 12.7, 13, 13.2, 13.3, 13.2], [12.4, 12.6, 12.7, 12.9, 12.9, 13, 13.1], [12.4, 12.5, 12.6, 12.9, 12.8, 12.9, 12.7],
  [12, 12.1, 12.2, 12.4, 12.4, 12.4, 12.4], [11.9, 12, 12, 11.9, 11.9, 12, 12], [11.3, 11.5, 11.4, 11.4, 11.5, 11.6, 11.5],
  [10.7, 10.8, 10.9, 10.9, 11.1, 11.1, 11.1], [10.1, 10.2, 10.4, 10.5, 10.6, 10.8, 10.6], [9.9, 10, 10.1, 10.2, 10.3, 10.5, 10.2],
  [9.8, 9.9, 9.9, 9.9, 9.9, 10, 9.8], [9.7, 9.9, 9.8, 9.7, 9.6, 9.5, 9.4], [9.5, 9.9, 9.7, 9.5, 9.3, 9.1, 9],
  [8.4, 9.7, 9.5, 9.2, 9, 8.7, 8.5], [8.2, 8.8, 8.8, 8.6, 8.3, 8.2, 8.1], [7.8, 7.9, 8.1, 7.9, 7.8, 7.8, 7.8],
  [7.4, 7.5, 7.5, 7.6, 7.5, 7.4, 7.4], [7.3, 7.3, 7.3, 7.5, 7.4, 7.2, 7.1], [6, 4.4, 4.8, 5.2, 4.7, 5.1, 6.6],
  [5.1, 4.2, 4.4, 3.9, 4.1, 4.6, 6], [4.6, 4.1, 3.9, 3.9, 4, 4.4, 5.6], [4.3, 4.3, 4.1, 4, 4.1, 4.3, 5.1],
  [4, 4.2, 4.1, 4, 4.1, 4.1, 4.5], [3.6, 4.2, 3.8, 3.9, 3.9, 3.9, 3.4], [1.4, 2.7, 2.1, 3.6, 2.5, 3.7, 3.7],
  [0, 0, 0, 0, 0, 0, 0.1], [0, 0, 0, 0, 0, 0, 0],
] }
const MANHATTAN_GROUND: GroundGrid = { y0: 280, x0: -30, step: 10, z: [
  [4.1, 4.1, 1.8, 1.3, 1.8, 3.7, 3.6], [4.1, 4, 4.1, 4.2, 4.3, 4.3, 4.3], [4.2, 4.5, 4.4, 4.4, 4.2, 4.1, 4.5],
  [4.4, 4.7, 4.9, 4.6, 4.6, 4.3, 4.4], [4.7, 4.3, 4.4, 4.4, 4.4, 4.3, 4.3], [4.4, 4.2, 4.3, 4.4, 4.4, 4.2, 4.3],
  [4.3, 4.2, 4.2, 4.3, 4.4, 4.2, 4.3], [4.4, 4.1, 4.1, 4.1, 4.1, 4.1, 4.3], [4.2, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1],
  [3.9, 3.9, 4.1, 4.1, 4.1, 4.1, 4.1], [3.7, 3.8, 4, 4.1, 4, 4, 4], [3.9, 3.9, 4, 4, 4, 4, 4.1],
  [3.7, 3.8, 4, 3.9, 3.9, 3.9, 4], [3.7, 3.6, 3.8, 3.8, 3.9, 3.9, 4], [3.6, 3.7, 3.8, 3.7, 3.9, 3.9, 3.8],
  [4, 3.9, 3.9, 3.8, 3.9, 3.9, 3.7], [3.7, 4, 4, 3.9, 4, 4.1, 3.7], [3.8, 4, 4.1, 4, 4.1, 3.9, 3.7],
  [3.9, 4.1, 4.1, 4.1, 4.1, 4, 3.6], [4, 4, 4.1, 4, 3.9, 3.9, 3.5], [4.1, 3.9, 3.8, 3.8, 3.6, 3.5, 3.6],
  [4.1, 3.9, 4.1, 4.1, 3.8, 3.6, 3.6], [4.2, 4, 4.2, 4.3, 4.1, 3.6, 3.6], [4.3, 4.1, 4.3, 4.4, 4.2, 3.6, 3.7],
  [4.3, 4.2, 4.4, 4.6, 4.2, 3.8, 3.8], [4.4, 4.3, 4.4, 4.5, 4.3, 3.8, 3.8], [4.4, 4.3, 4.3, 4.4, 4, 3.8, 3.9],
  [4.4, 4.2, 4.1, 3.9, 3.9, 3.8, 3.9], [4.6, 4.4, 4.2, 4, 3.9, 3.8, 3.9], [4.6, 4.6, 4.5, 4.4, 4.1, 3.9, 3.9],
  [4.7, 4.7, 4.6, 4.5, 4.3, 4, 4], [4.8, 4.6, 4.5, 4.5, 4.3, 4.1, 4], [4.9, 4.8, 4.7, 4.5, 4.4, 4.1, 4.1],
  [4.9, 4.9, 4.8, 4.6, 4.4, 4.2, 4.2], [5, 4.9, 4.7, 4.6, 4.5, 4.2, 4.3], [5, 4.6, 4.6, 4.6, 4.4, 4.2, 4.4],
  [5, 4.8, 4.8, 4.6, 4.5, 4.4, 4.4], [5.1, 4.9, 4.8, 4.7, 4.6, 4.5, 4.5], [5.1, 5, 4.9, 4.8, 4.8, 4.6, 4.5],
  [5.2, 5, 4.9, 4.8, 4.8, 4.6, 4.6], [5.2, 5.1, 5, 4.9, 4.8, 4.8, 4.7], [5.3, 5.1, 5.1, 5, 4.9, 4.8, 4.8],
  [5.4, 5.2, 5.2, 5.1, 5, 4.9, 4.9], [5.5, 5.3, 5.2, 5.1, 5, 5, 5], [5.6, 5.4, 5.3, 5.3, 5.2, 5.1, 5.1],
  [5.7, 5.5, 5.4, 5.3, 5.2, 5.2, 5.2], [5.8, 5.7, 5.5, 5.4, 5.4, 5.2, 5.3], [5.9, 5.7, 5.6, 5.5, 5.4, 5.3, 5.3],
  [6, 5.8, 5.8, 5.6, 5.5, 5.4, 5.4], [6.1, 5.8, 5.7, 5.6, 5.4, 5.4, 5.5], [6.1, 6, 5.9, 5.8, 5.8, 5.6, 5.6],
  [6.2, 6, 6, 5.9, 5.8, 5.7, 5.7], [6.3, 6.5, 6.2, 5.9, 5.8, 5.7, 5.8], [6.4, 6.4, 6.3, 6.2, 6, 5.8, 5.8],
  [6.5, 6.3, 6.2, 6.2, 6.1, 5.9, 5.9], [6.6, 6.4, 6.3, 6.2, 6.1, 5.9, 6], [6.7, 6.5, 6.5, 6.4, 6.3, 6, 6],
  [6.9, 6.8, 6.6, 6.5, 6.3, 6, 6.1], [6.9, 6.8, 6.6, 6.6, 6.4, 6.1, 6.3], [7, 6.5, 6.5, 6.5, 6.6, 6.2, 6.3],
  [7, 6.8, 6.8, 6.8, 6.8, 6.4, 6.3], [7.1, 6.9, 7, 7, 6.9, 6.5, 6.5], [7.2, 7, 7, 6.9, 6.9, 6.5, 6.6],
  [7.2, 7, 6.9, 6.9, 6.8, 6.6, 6.7], [7.3, 7.1, 7, 7, 6.9, 6.6, 6.8], [7.3, 7.1, 7.1, 6.9, 6.9, 6.7, 6.9],
  [7.3, 7.2, 7.1, 7.1, 7, 6.7, 6.9], [7.4, 7.2, 7.1, 7.1, 7.1, 6.9, 7], [7.6, 7.2, 7.1, 7.1, 7.1, 7, 7.2],
  [7.7, 7.5, 7.3, 7.3, 7.2, 7.1, 7.3], [7.8, 7.5, 7.5, 7.5, 7.4, 7.2, 7.4], [7.9, 7.7, 7.6, 7.5, 7.5, 7.4, 7.5],
  [8, 7.9, 7.8, 7.7, 7.6, 7.4, 7.5], [8.1, 8.1, 8, 7.9, 7.7, 7.5, 7.5], [8.2, 8.3, 8.2, 8.1, 7.9, 7.6, 7.8],
  [8.3, 8.1, 8.1, 8, 8, 7.7, 7.9], [8.4, 8.2, 8.3, 8.4, 8.1, 7.8, 7.8], [8.4, 8.1, 8.2, 8.2, 8.1, 7.8, 7.9],
  [8.2, 8.1, 8.1, 8, 7.9, 7.8, 7.8], [7.9, 7.9, 7.8, 7.8, 7.7, 7.6, 7.8], [7.5, 7.4, 7.4, 7.5, 7.5, 7.5, 7.7],
  [7.4, 7.3, 7.3, 7.4, 7.4, 7.5, 7.5], [7.6, 7.8, 8, 8.2, 8.3, 7.7, 7.9], [7.8, 7.8, 7.9, 8, 8.1, 7.9, 8],
] }
/** The map's ground under (x, y), metres in this frame; the river between the tables. */
const ground = (x: number, y: number) =>
  y <= -290 ? groundAt(BROOKLYN_GROUND, x, y) : y >= 280 ? groundAt(MANHATTAN_GROUND, x, y) : 0

// ---- Parts ----------------------------------------------------------------------

type Set = { steel: Part; brace: Part; stone: Part; under: Part; walk: Part; track: Part; wire: Part }
const set = (): Set => ({ steel: new Part(), brace: new Part(), stone: new Part(), under: new Part(), walk: new Part(), track: new Part(), wire: new Part() })
const low = set(), detail = set()
const both = (draw: (s: Set, isLow: boolean) => void) => { draw(low, true); draw(detail, false) }

// ---- Towers ------------------------------------------------------------------------
// The tower model, built at y = 0 and moved to each tower's line.

const PIER = 7.5 + L
const ROAD_AT_TOWER = ROAD(TY)
const DECK0 = ROAD_AT_TOWER - UNDER  // underside: the bracing below the deck stops here
const DECK = TRUSS_TOP(TY)            // truss tops: the bracing above starts here
const CAP0 = 98.0 + L, CAP = 101.5 + L, GIRDER = 102.0 + L, SADDLE = 104.6 + L
const XI = 5.0
const xo = (z: number) => (z <= DECK ? 18.3 : 18.3 - (2.8 * (z - DECK)) / (CAP0 - DECK))
const yd = (z: number) => (z <= DECK ? TD : TD - (2.1 * (z - DECK)) / (CAP0 - DECK))
const PW = 1.0

function corners(s: number, z: number): V3[] {
  const a = s * XI, b = s * xo(z), y = yd(z)
  const [x0, x1] = s > 0 ? [a, b] : [b, a]
  return [[x0, -y, z], [x1, -y, z], [x1, y, z], [x0, y, z]]
}
const inset = (c: V3[], d: number): V3[] => {
  const cx = (c[0][0] + c[1][0]) / 2
  return c.map(([x, y, z]) => [x - Math.sign(x - cx) * d, y - Math.sign(y) * d, z] as V3)
}

/**
 * A member from a to b: a capped beam in the detail model; in the low model
 * a flat strip in the face it braces (normal `n`), for a double-sided material.
 */
function member(p: Part, isLow: boolean, a: V3, b: V3, w: number, t: number, n: V3) {
  if (isLow) strip(p, a, b, w, n)
  else beam(p, a, b, w, t, n)
}

function tower(isLow: boolean) {
  const steel = new Part(), brace = new Part(), stone = new Part()
  const r = isLow ? 0 : 0.6
  for (const s of [-1, 1]) {
    const [x0, x1] = s > 0 ? [XI - 1.2, 19.5] : [-19.5, -XI + 1.2]
    box(stone, x0, x1, -7.3, 7.3, 0, PIER - 0.6, { r, bottom: false })
    box(stone, x0 + 0.4, x1 - 0.4, -6.9, 6.9, PIER - 0.6, PIER, { r: isLow ? 0 : 0.4, top: isLow ? 0 : 0.25, bottom: false })
  }
  const levels = [PIER, PIER + (DECK0 - PIER) / 2, DECK0, DECK, ...[1, 2, 3, 4].map((k) => DECK + (k * (CAP0 - DECK)) / 5), CAP0]
  for (const s of [-1, 1]) {
    // Straight between the deck and the cap, so the low model lofts them through those alone.
    for (let i = 0; i < 4; i++) {
      const rings = (isLow ? [PIER, DECK, CAP0] : levels).map((z) => {
        const c = inset(corners(s, z), PW)[i]
        return rim(c[0] - PW, c[0] + PW, c[1] - PW, c[1] + PW, isLow ? 0 : 0.25, z)
      })
      loftSolid(steel, rings, [false, false])
    }
    for (let k = 0; k < levels.length; k++) {
      const z = levels[k]
      const c = inset(corners(s, z), PW)
      // The low model keeps the struts that frame the deck and the cap.
      if (!isLow || [PIER, DECK0, DECK, CAP0].includes(z))
        for (let i = 0; i < 4; i++) {
          const a = c[i], b = c[(i + 1) % 4]
          member(brace, isLow, [a[0], a[1], z], [b[0], b[1], z], 1.3, 0.7, norm(cross(sub(b, a), [0, 0, 1])))
        }
      if (k === levels.length - 1) continue
      const zt = levels[k + 1], ct = inset(corners(s, zt), PW)
      if (z >= DECK0 && zt <= DECK) continue
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const n = norm(cross(sub(c[j], c[i]), [0, 0, 1]))
        // The low model leaves out the X on the inner face, hidden between the shafts.
        if (isLow && Math.abs(n[0]) > 0.9 && Math.sign(n[0]) !== s) continue
        member(brace, isLow, c[i], ct[j], 1.6, 0.6, n)
        member(brace, isLow, c[j], ct[i], 1.6, 0.6, n)
      }
    }
  }
  for (const y of [-3.5, 3.5]) {
    member(brace, isLow, [-XI, y, DECK + 1], [XI, y, CAP0 - 1], 1.2, 0.6, [0, 1, 0])
    member(brace, isLow, [XI, y, DECK + 1], [-XI, y, CAP0 - 1], 1.2, 0.6, [0, 1, 0])
  }
  archWall(brace, brace, -XI, XI, -3.9, 3.9, 0, DECK0 - 9, XI, DECK0, isLow ? 6 : 10)
  for (const s of [-1, 1]) {
    const c0 = corners(s, CAP0), c1 = corners(s, CAP - 0.6)
    const grow = (c: V3[], d: number, z: number): V3[] => {
      const cx = (c[0][0] + c[1][0]) / 2
      return c.map(([x, y]) => [x + Math.sign(x - cx) * d, y + Math.sign(y) * d, z] as V3)
    }
    loftSolid(steel, [grow(c0, 0, CAP0), grow(c1, 1.0, CAP - 0.6), grow(c1, 1.0, CAP)], [false, true])
    for (const cx of [6.75, 13.75]) {
      const x = s * cx
      box(steel, x - 1.5, x + 1.5, -5.5, 5.5, CAP, SADDLE, { r: isLow ? 0 : 0.4, top: isLow ? 0 : 0.8, bottom: false })
    }
  }
  box(steel, -XI - 0.5, XI + 0.5, -3.7, 3.7, CAP0 - 3.5, GIRDER, { r: isLow ? 0 : 0.3, top: isLow ? 0 : 0.2, bottom: true })
  return { steel, brace, stone }
}

both((s, isLow) => {
  const t = tower(isLow)
  for (const y of [-TY, TY]) {
    s.steel = merged(s.steel, movedAlong(t.steel, y))
    s.brace = merged(s.brace, movedAlong(t.brace, y))
    s.stone = merged(s.stone, movedAlong(t.stone, y))
  }
})

// ---- Cables -------------------------------------------------------------------------

const CABLE_R = 0.45
const T = SADDLE - 0.5           // cable centre over the saddles
const C0 = 47.8 + L              // its low point at midspan
const mainZ = (y: number) => C0 + ((T - C0) * (y / TY) ** 2)
const backZ = parabola([TY, T], [340, 61.2 + L], [ANCHOR, 27.6 + L])
const cableZ = (y: number) => (Math.abs(y) <= TY ? mainZ(y) : backZ(Math.abs(y)))
/** Each cable's offset across: a pair a side, 7 m apart at the saddles, 1.2 m at midspan, splaying apart down the backstays. */
const cableX = (side: number, outer: boolean) => (y: number) => {
  const u = Math.abs(y)
  if (u <= TY) {
    const d = 0.6 + 2.9 * (u / TY) ** 2
    return side * (TX + (outer ? d : -d))
  }
  const t = (u - TY) / (ANCHOR - TY)
  return side * (outer ? 13.75 + 3.75 * t : 6.75 - 3.75 * t)
}
const CABLES = [-1, 1].flatMap((side) => [cableX(side, true), cableX(side, false)])

both((s, isLow) => {
  const main = stations(-TY, TY, isLow ? 40 : 8)
  const back = stations(TY, ANCHOR, isLow ? 60 : 15)
  const ys = [...back.map((y) => -y).reverse().slice(0, -1), ...main, ...back.slice(1)]
  for (const x of CABLES) {
    const path: V3[] = [[x(-ANCHOR), -ANCHOR - 3, backZ(ANCHOR) - 1.5], ...ys.map((y) => [x(y), y, cableZ(y)] as V3), [x(ANCHOR), ANCHOR + 3, backZ(ANCHOR) - 1.5]]
    tube(s.steel, path, CABLE_R, isLow ? 4 : 8)
  }
})

// Suspenders: every 12.2 m on the main span, cable to floor beams. Detail only.
const BAY = 12.2
for (const y of stations(-TY + TD + 3, TY - TD - 3, BAY))
  for (const x of CABLES) {
    const z0 = SOFFIT(y) + 0.5, z1 = cableZ(y) - CABLE_R * 0.5
    if (z1 - z0 > 1) rod(detail.wire, [x(y), y, z0], [x(y), y, z1], 0.18)
  }

// ---- Trusses, underside, railings ----------------------------------------------------

/** Stations along the deck between the anchorages, with a break at each tower. */
const deckYs = (step: number) => [
  ...stations(-ANCHOR, -TY, step), ...stations(-TY, TY, step).slice(1), ...stations(TY, ANCHOR, step).slice(1),
]
both((s, isLow) => {
  const ys = deckYs(isLow ? 40 : 20)
  for (const side of [-1, 1]) {
    if (isLow) band(s.brace, side * (TX - 0.35), side * (TX + 0.35), ys, TRUSS_TOP, SOFFIT, { out: true, in: true, top: true, ends: true })
    else truss(s.steel, s.brace, side * TX, deckYs(BAY), TRUSS_TOP, SOFFIT, { curve: ys, chordW: 0.7, topD: 0.8, botD: 0.9, member: 0.45 })
    // Outer railings: a fascia from the underside up to railing height.
    band(s.steel, side * (EDGE - 0.3), side * EDGE, ys, (y) => ROAD(y) + RAIL, SOFFIT, { out: true, in: !isLow, top: true, ends: true })
    band(s.under, 0, side * EDGE, ys, SOFFIT, SOFFIT, { bottom: true })
  }
  if (!isLow)
    for (const y of deckYs(BAY)) {
      const z = SOFFIT(y)
      band(s.under, -EDGE, EDGE, [y - 0.35, y + 0.35], () => z, () => z - 1.2, { bottom: true, ends: true })
    }
})

// ---- Side-span bents ------------------------------------------------------------------

const BENTS = [1, 2, 3].map((k) => TY + TD + (k * (ANCHOR - TY - TD)) / 4)
const columnPlan = (x: number, y: number, hx: number, hy: number): [number, number][] =>
  [[x - hx, y - hy], [x + hx, y - hy], [x + hx, y + hy], [x - hx, y + hy]]
/** A column from the map's ground up to `top`, its foot following the terrain. */
const column = (p: Part, x: number, y: number, hx: number, hy: number, top: number) =>
  footedLoft(p, ground, [{ plan: columnPlan(x, y, hx, hy), z: 'ground' }, { plan: columnPlan(x, y, hx, hy), z: top }], 10, false)

both((s, isLow) => {
  for (const y of BENTS.flatMap((b) => [-b, b])) {
    const top = SOFFIT(y)
    for (const side of [-1, 1]) {
      const x0 = side * 7.5, x1 = side * 14.5
      // A masonry footing, then four columns braced in pairs.
      const g = ground(side * 11, y)
      footedLoft(s.stone, ground, [{ plan: columnPlan(side * 11, y, 4.5, 3), z: 'ground' }, { plan: columnPlan(side * 11, y, 4.5, 3), z: g + 2.5 }], 10)
      for (const x of [x0, x1]) for (const dy of [-2, 2]) column(s.steel, x, y + dy, 0.6, 0.6, top)
      band(s.steel, Math.min(x0, x1) - 0.6, Math.max(x0, x1) + 0.6, [y - 2.6, y + 2.6], () => top, () => top - 1.4, { out: true, in: true, bottom: true, ends: true })
      if (!isLow)
        for (const dy of [-2, 2]) {
          const n: V3 = [0, Math.sign(dy), 0], h = (top - g - 2.5) / 3
          for (let k = 0; k < 3; k++) {
            const za = g + 2.5 + k * h, zb = za + h
            strip(s.brace, [x0, y + dy, za], [x1, y + dy, zb], 0.5, n)
            strip(s.brace, [x1, y + dy, za], [x0, y + dy, zb], 0.5, n)
          }
        }
    }
  }
})

// ---- Anchorages ------------------------------------------------------------------------

function anchorage(p: Part, roof: Part, y0: number, y1: number, x0: number, x1: number) {
  const top = (_x: number, y: number) => ROAD(y) - 0.4
  const dir = Math.sign(y1 - y0)
  footedWall(p, [x0, y0], [x1, y0], ground, top, [0, -dir, 0], 6)
  footedWall(p, [x0, y1], [x1, y1], ground, top, [0, dir, 0], 6)
  footedWall(p, [x0, y0], [x0, y1], ground, top, [-1, 0, 0], 6)
  footedWall(p, [x1, y0], [x1, y1], ground, top, [1, 0, 0], 6)
  band(roof, x0, x1, stations(Math.min(y0, y1), Math.max(y0, y1), 10), (y) => top(0, y), (y) => top(0, y), { top: true })
}
both((s) => {
  anchorage(s.stone, s.stone, -ANCHOR, BACK_B, -21.2, 24.6)
  anchorage(s.stone, s.stone, ANCHOR, BACK_M, -24.5, 24.0)
})

// ---- Approach viaducts -------------------------------------------------------------------

const APPROACH_B = { from: END_B, to: BACK_B, xs: -18.8, xn: 18.8 }
const APPROACH_M = { from: BACK_M, to: END_M, xs: -21.8, xn: 18.8 }
const girderBot = (y: number) => ROAD(y) - APPROACH_UNDER

both((s, isLow) => {
  for (const { from, to, xs, xn } of [APPROACH_B, APPROACH_M]) {
    const ys = stations(from, to, isLow ? 40 : 20)
    for (const x of [xs, xn]) {
      const side = Math.sign(x)
      band(s.steel, x - side * 0.4, x, ys, (y) => ROAD(y) + RAIL, girderBot, { out: true, in: !isLow, top: true, ends: true })
    }
    band(s.under, xs, xn, ys, girderBot, girderBot, { bottom: true })
    // Bents every 30 m, four columns each; the low model keeps every other bent's outer two.
    const span = Math.abs(to - from), n = Math.round(span / 30)
    for (let k = 1; k <= n; k++) {
      const y = from + ((to - from) * (k - 0.5)) / n
      const top = girderBot(y), w = xn - xs
      if (isLow && k % 2) continue
      const xsCols = isLow ? [xs + 1.5, xn - 1.5] : [xs + 1.5, xs + w / 3, xs + (2 * w) / 3, xn - 1.5]
      for (const x of xsCols) column(s.steel, x, y, 0.7, 0.5, top)
      if (!isLow) band(s.under, xs, xn, [y - 0.5, y + 0.5], () => top, () => top - 1.0, { bottom: true, ends: true })
    }
  }
  // Over the anchorages, parapets on the deck's edges.
  for (const [a, b] of [[BACK_B, -ANCHOR], [ANCHOR, BACK_M]])
    for (const side of [-1, 1])
      band(s.steel, side * (EDGE - 0.3), side * EDGE, stations(a, b, 20), (y) => ROAD(y) + RAIL, (y) => ROAD(y) - 0.4, { out: true, in: !isLow, top: true, ends: true })
})

// ---- Paths, ramps and tracks ---------------------------------------------------------------

type P3 = [number, number, number]
/** A polyline with no segment longer than `step`. */
function resample(pts: P3[], step: number): P3[] {
  const out: P3[] = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n, a[2] + ((b[2] - a[2]) * k) / n])
  }
  return out
}
/** Left and right edges of a ribbon `half` wide along a plan polyline, mitred at the joints. */
function edges(pts: P3[], half: number): { l: V3[]; r: V3[]; across: V3[] } {
  const across = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const d = norm([b[0] - a[0], b[1] - a[1], 0])
    return [d[1], -d[0], 0] as V3
  })
  return {
    l: pts.map((p, i) => add(p, mul(across[i], -half))),
    r: pts.map((p, i) => add(p, mul(across[i], half))),
    across,
  }
}
/**
 * A deck along a polyline: its walking or riding surface in `surface`, sides
 * from `drop` metres below up to `rise` above it (a girder and parapet) in
 * `side`, and its underside in `under`.
 */
function ribbon(surface: Part, side: Part, under: Part | null, pts: P3[], half: number, drop: number, rise = 0) {
  const { l, r, across } = edges(pts, half)
  const dz = (p: V3, z: number): V3 => [p[0], p[1], p[2] + z]
  for (let i = 0; i < pts.length - 1; i++) {
    face(surface, l[i], r[i], r[i + 1], l[i + 1], [0, 0, 1])
    const out = across[i], inn = mul(across[i], -1)
    face(side, dz(r[i], -drop), dz(r[i + 1], -drop), dz(r[i + 1], rise), dz(r[i], rise), out)
    face(side, dz(l[i], -drop), dz(l[i + 1], -drop), dz(l[i + 1], rise), dz(l[i], rise), inn)
    if (under) face(under, dz(l[i], -drop), dz(r[i], -drop), dz(r[i + 1], -drop), dz(l[i + 1], -drop), [0, 0, -1])
  }
}
/** Railings on both edges of a ribbon, as double-sided strips. */
function railings(p: Part, pts: P3[], half: number) {
  const { l, r, across } = edges(pts, half)
  for (let i = 0; i < pts.length - 1; i++)
    for (const [e, s] of [[l, -1], [r, 1]] as [V3[], number][])
      face(p, e[i], e[i + 1], [e[i + 1][0], e[i + 1][1], e[i + 1][2] + RAIL], [e[i][0], e[i][1], e[i][2] + RAIL], mul(across[i], s))
}
const post = (p: Part, x: number, y: number, z0: number, z1: number, w = 0.35) =>
  loftSolid(p, [z0, z1].map((z) => rim(x - w, x + w, y - w, y + w, 0, z)), [false, false])

const along = (y0: number, y1: number, step: number, x: (y: number) => number, z: (y: number) => number): P3[] =>
  stations(y0, y1, step).map((y) => [x(y), y, z(y)])

// The raised paths over the inner roadways, anchorage to anchorage, merging in Manhattan.
const PX = 6.75, PATH_HALF = 2.2, M_MERGE = 592, MERGED_X = piecewise([[M_MERGE, -1.75], [END_M, -2.9]])
const mainPath = (side: number): P3[] => [
  ...along(-448, 540, 20, () => side * PX, PATH),
  [MERGED_X(M_MERGE) + side * 1.5, M_MERGE, SPINE_M(M_MERGE)],
]
const mergedPath: P3[] = along(M_MERGE, END_M, 20, MERGED_X, SPINE_M)
// The Brooklyn ramps, from OSM's lines and the lidar's grades.
const RAMP_N: P3[] = [[24.6, END_B, 17.3 + L], [24.5, -774, 21.9 + L], [24.5, -633.6, 28.5 + L], [21.1, -467.7, 36.6 + L], [PX, -453.7, 36.9 + L], [PX, -448, 37.0 + L]]
const RAMP_S: P3[] = [[-20.0, -726.6, 18.5 + L], [-19.9, -632.8, 25.2 + L], [-18.1, -467.2, 36.6 + L], [-PX, -452, 36.9 + L], [-PX, -448, 37.0 + L]]
// The tracks, centred 2 m north over the Brooklyn approach, on the axis between the anchorages.
const TRACK_X = piecewise([[END_B, 2.0], [-480, 2.0], [-440, 0], [560, 0], [700, -2.0], [END_M, -2.9]])
const trackLine = (step: number): P3[] => along(END_B, END_M, step, TRACK_X, track)
const TRACK_HALF = 3.4

both((s, isLow) => {
  const step = isLow ? 60 : 20
  const under = isLow ? null : s.under
  for (const side of [-1, 1]) {
    const pts = resample(mainPath(side), step)
    ribbon(s.walk, s.steel, under, pts, PATH_HALF, 0.6)
    if (!isLow) railings(s.steel, pts, PATH_HALF)
  }
  const merged = resample(mergedPath, step)
  ribbon(s.walk, s.steel, under, merged, 3.0, 1.6, 0)
  if (!isLow) railings(s.steel, merged, 3.0)
  for (const ramp of [RAMP_N, RAMP_S]) {
    const pts = resample(ramp, step)
    ribbon(s.walk, s.steel, under, pts, 1.9, 1.2)
    if (!isLow) railings(s.steel, pts, 1.9)
  }
  // Tracks: over the Brooklyn approach a girder either side up to the parapet;
  // between the anchorages and down the Manhattan approach a skirt to the roadway.
  const tb = resample(trackLine(step).filter(([, y]) => y <= -470), step)
  ribbon(s.track, s.steel, under, tb, TRACK_HALF + 0.9, 1.8, 1.5)
  const tm = resample(trackLine(step).filter(([, y]) => y >= -480), step)
  const { l, r, across } = edges(tm, TRACK_HALF)
  for (let i = 0; i < tm.length - 1; i++) {
    face(s.track, l[i], r[i], r[i + 1], l[i + 1], [0, 0, 1])
    const base = (p: V3): V3 => [p[0], p[1], Math.min(p[2] - 0.3, ROAD(p[1]) - 0.2)]
    face(s.steel, base(r[i]), base(r[i + 1]), r[i + 1], r[i], across[i])
    face(s.steel, base(l[i]), base(l[i + 1]), l[i + 1], l[i], mul(across[i], -1))
  }
})

// Posts: the Brooklyn track structure and the Manhattan path on the approach decks,
// the paths' frames over the inner roadways, and the ramps' legs to the street.
both((s, isLow) => {
  const step = isLow ? 60 : 20
  for (const y of stations(END_B + 10, BACK_B - 10, step))
    for (const d of [-1, 1]) post(s.steel, TRACK_X(y) + d * (TRACK_HALF + 0.5), y, ROAD(y) - 0.2, track(y) - 1.8)
  for (const y of stations(M_MERGE + 10, END_M - 5, step))
    for (const d of [-1, 1]) post(s.steel, MERGED_X(y) + d * 2.6, y, track(y), SPINE_M(y) - 1.6)
  for (const [ramp, y0, y1] of [[RAMP_N, END_B + 8, -640], [RAMP_S, -720, -560]] as [P3[], number, number][]) {
    const pts = resample(ramp, 2)
    for (const y of stations(y0, y1, step)) {
      const p = pts.reduce((a, b) => (Math.abs(b[1] - y) < Math.abs(a[1] - y) ? b : a))
      column(s.steel, p[0], p[1], 0.4, 0.4, p[2] - 1.2)
    }
  }
  if (!isLow)
    for (const y of stations(-440, 535, BAY))
      for (const side of [-1, 1]) for (const x of [PX - PATH_HALF + 0.3, PX + PATH_HALF - 0.3])
        post(s.steel, side * x, y, ROAD(y) - 0.2, PATH(y) - 0.6, 0.2)
})

// ---- Write -------------------------------------------------------------------------------

const STEEL = finish('bridge-grey', 0x9aa2aa)
const BRACE = finish('bridge-grey-shade', 0x838c95)
const GRANITE = finish('granite', 0xcdc6b9)
const WALK = finish('walkway', 0xa9a39a)
const TRACKBED = finish('trackbed', 0x6f6a64)
const lists = (s: Set, isLow: boolean) => [
  { part: s.steel, material: { ...STEEL, doubleSided: !isLow } },
  { part: merged(s.brace, s.under), material: { ...BRACE, doubleSided: true } },
  { part: s.stone, material: GRANITE },
  { part: s.walk, material: WALK },
  { part: s.track, material: TRACKBED },
  // Last: a map draws wires by their coverage, over what is already drawn.
  ...(s.wire.triangles ? [{ part: s.wire, material: { name: 'wire-steel', color: 0x9aa2aa } }] : []),
]

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
  bearing: 291.8, elevation: 0, towers: [-TY, TY], anchorageFaces: [-ANCHOR, ANCHOR], datum: 'NAVD88 + 1.63',
  roadwayMidspan: ROAD(0), roadwayAtTowers: ROAD_AT_TOWER, roadwayAtAnchorages: [ROAD(-ANCHOR), ROAD(ANCHOR)],
  roadwayEnds: [ROAD(END_B), ROAD(END_M)], pathMidspan: PATH(0), trackMidspan: TRACK(0),
}
const count = (list: { part: Part }[]) => list.reduce((n, { part }) => n + part.triangles, 0)
for (const [file, list, maxTris, maxBytes] of [
  ['nyc-williamsburg-bridge.glb', lists(low, true), 6500, 250 * 1024],
  ['nyc-williamsburg-bridge.detail.glb', lists(detail, false), 40000, 1536 * 1024],
] as const) {
  const tris = count(list)
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
  const glb = writeGlb('Williamsburg Bridge', [...list], extras)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
