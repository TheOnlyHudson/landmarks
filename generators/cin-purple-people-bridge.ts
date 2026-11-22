/**
 * Purple People Bridge (Louisville & Nashville Railroad Bridge, 1868–72;
 * rebuilt 1896–97; pedestrian since 2003) — procedural, CC0-1.0, no textures.
 * bun generators/cin-purple-people-bridge.ts
 *
 * The whole bridge inside its OSM outline, Pete Rose Way (Cincinnati) to
 * Third Street (Newport), as one placement: the sandstone river piers with
 * their upstream cutwaters, the purple through trusses (the tall curved
 * channel span, three Parker river spans and the Newport land span), the
 * low trusses of the Ohio shore span, the curved Ohio approach on its piers,
 * and the walkway deck, which is the model's (the bridge carries no road).
 * The trusses are drawn open, chords as beams and posts and diagonals as
 * flat bars, chunky enough to read at 200 px; there is no detail model.
 *
 * Frame: x across (+x to the downstream, south-west side), y along the
 * bridge toward Newport, z up, metres. Bearing 143.0°: the straight part of
 * the outline and the lidar trusses (the outline's two long edges run at
 * 143.2° and the lidar's at about 142.6°). The anchor is the outline's
 * centre as given by the lead (-84.49812, 39.09848), mid-river.
 *
 * Height. z = 0 is the Ohio River, 138.94 m NAVD88 in the lidar; the map's
 * Mapterhorn terrain reads the Ohio water at 138.94 and the Kentucky water
 * 1.8 m higher (a different survey; the river piers on that side start at
 * 1.8). Walkway heights built to (`WALK` below; lidar, tools/bridge_ele.py
 * on way/23282146, OH_StatewideP3_6_B21, lower quartile, spread
 * 0.03–0.14 m where read): 15.0 m at the Pete Rose Way end (y = −307),
 * 20.1 m at y = −202, 22.7 m at the Ohio river pier (−136), a crest of
 * 25.05 m at midspan of the channel span (y = −5), 22.0 m at y = +156, the
 * last lidar reading (the Ohio survey stops at the state line). Beyond that,
 * estimated: the measured 2.1 % grade carried on to 17.9 m at the Newport
 * end (y = +344). OSM has no `height` or `ele`; the map's walkway is
 * left out under the model in any case (it is the model's surface).
 *
 * Sources:
 * - OSM: outline way/734667335 (man_made=bridge, layer 1, NRHP 01000364,
 *   wikidata Q1983625), straight from y = −110 to +344, x ≈ −7.7…+8.9
 *   (16.6 m wide), curving west to x ≈ −31 at the Pete Rose Way end; the
 *   walkway way/23282146 (highway=pedestrian) along it. No pier or truss
 *   parts are mapped.
 * - Lidar, USGS 3DEP OH_StatewideP3_6_B21 (flown 2021), 1 m grid over the
 *   channel span (y = −128…+82): river piers at y = −86 and +69 (cutwaters
 *   reaching 7–8 m above the river at x ≈ −13); channel-span top chord 46.8 m
 *   above the river (21.8 m over the walkway) from y = −29 to +7, falling
 *   to 37.4 at y = −77 and +59 and to the end posts; the next Parker span's
 *   end panel 6.7 m over the walkway at y = +75; no truss over the walkway
 *   from y = −128 to −86, only a low (2–3 m) truss at its edges.
 * - NAIP (USGS, public domain, 2.0 px/m strip along the axis): the river
 *   piers and their cutwaters; on the Kentucky imagery piers at y = 69 (as
 *   the lidar), 140, 212.5 and 286.5; on the Ohio imagery a pier 50 m
 *   short of the lidar's −86 (its mosaic is offset about 28 m), so −136;
 *   the curved approach and the Ohio shore spans as a deck with trusses at
 *   its edges.
 * - Published (Wikipedia "Purple People Bridge"; NRHP 01000364): length
 *   2,670 ft (810 m) including approaches; subdivided Pratt; the 1896–97
 *   rebuild made the main deck a Pennsylvania truss and added four Parker
 *   trusses; piers of Adams County stone; painted purple, pedestrian 2003.
 * - Photos (Wikimedia Commons):
 *   - "Newport Southbank Bridge 2017.jpg" (Antony-22, CC BY-SA 4.0): from
 *     the Newport levee, upstream side: the Newport land span, the river
 *     spans' curved top chords, the tall battered stone piers;
 *   - "The Newport Southbank Bridge 01.jpg" (Paul Barnes, CC BY-SA 4.0):
 *     from the Kentucky bank, downstream side: the land span over Riverboat
 *     Row on its end pier, the channel span's tall curved truss beyond;
 *   - "Newport Southbank Bridge (Purple People Bridge) P4280199.JPG" (Chris
 *     Light, CC BY-SA 4.0): the trusses close up: lavender paint, the
 *     walkway deck between the truss planes, lattice posts, the catwalk;
 *   - "Newport Southbank Bridge (Purple People Bridge) -Cincinnati.jpg"
 *     (Chris Light, CC BY-SA 4.0): panorama of the spans in order.
 * Estimated: the Parker spans' top chords (9 m at the end panel points, from
 *   the lidar's 6.7 m half a panel in, rising to 15 m; 13 m on the land
 *   span), the truss planes at x = 0.8 ± 8 (from the lidar deck and top
 *   chord), member sizes, the panel counts (16 on the channel span, 8 on
 *   the Parker spans, 6 on the land span), the piers' plan (20 m across
 *   plus a 3.5 m cutwater, 9 m along the bridge at the foot, 7.4 m at the
 *   top) and batter, the curved approach's piers and girders (no open photo
 *   shows them closely), and the walkway's height past the lidar.
 * Doubts: the Ohio shore piers come from an offset image; the river piers'
 * cutwaters are drawn only upstream; the top-chord catwalk and the old
 * bridge-climb stairs are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, face, footedLoft, groundAt, piecewise, stations, strip, type GroundGrid } from './bridge-kit'

// ---- Evidence ----------------------------------------------------------------------------
const XC = 0.8                    // the trusses' centre line
const TX = 8.0                    // truss planes at XC ± TX
const Y_OH = -307.5, Y_KY = 344.4 // the outline's ends

/** Walkway (m above the river) along y on the straight; lidar to +156, then the measured grade. */
const WALK = piecewise([
  [-307.5, 15.03], [-280, 16.35], [-261, 17.16], [-248, 17.7], [-237.5, 18.22], [-218, 19.18], [-202, 20.12],
  [-194, 20.59], [-175, 21.56], [-160, 22.35], [-141, 22.7], [-127, 23.0], [-99, 23.7], [-64, 24.27], [-44.5, 24.65],
  [-24.5, 25.0], [-4.5, 25.05], [15.5, 24.81], [35.5, 24.44], [55.5, 24.05], [75.5, 23.64], [95.5, 23.22],
  [115.5, 22.79], [135.5, 22.43], [155.5, 21.99], [344.4, 17.9],
])
const walk = (y: number) => WALK(y)

// Map terrain (Mapterhorn) above the Ohio's 138.94 m, in a frame at bearing 144.5°, 6 m apart.
const GROUND: GroundGrid = {"y0":-328.0,"x0":-44.0,"step":6.0,"z":[[11.8,11.9,12.1,12.6,12.5,12.0,11.7,11.8,12.3,13.2,13.0,12.8,12.8],[11.6,11.7,11.9,12.3,12.0,11.6,11.4,11.6,11.9,12.6,12.3,12.2,12.4],[11.4,11.5,11.8,12.2,11.7,11.3,11.2,11.4,11.8,11.8,11.7,11.9,12.1],[11.2,11.3,11.6,12.0,11.5,11.1,10.9,11.2,11.7,11.5,11.4,11.6,11.7],[11.0,11.1,11.3,11.5,11.2,10.8,10.7,11.0,11.4,11.1,11.2,11.2,11.4],[10.8,10.9,11.1,11.1,10.9,10.6,10.5,10.7,11.0,11.0,11.2,10.9,11.0],[10.7,10.8,10.9,10.8,10.7,10.4,10.4,10.6,10.8,10.9,11.1,10.8,10.8],[11.3,10.9,10.6,10.5,10.4,10.2,10.2,10.4,10.5,10.7,10.9,10.9,10.8],[11.0,10.8,10.5,10.4,10.2,10.0,10.0,10.2,10.4,10.5,10.6,10.7,10.5],[10.7,10.5,10.3,10.2,10.2,10.0,9.8,10.3,10.6,10.3,10.4,10.5,10.0],[10.4,10.1,10.1,10.0,9.9,9.7,9.6,10.1,10.2,10.0,10.0,10.1,9.9],[10.1,9.9,9.8,9.7,9.6,9.5,9.4,9.5,9.7,9.7,9.7,9.7,9.8],[9.6,9.6,9.6,9.4,9.4,9.3,9.2,9.3,9.4,9.5,9.8,9.8,9.8],[9.2,9.2,9.2,9.2,9.2,9.1,9.1,9.3,9.5,9.4,9.7,9.7,9.6],[9.3,9.3,9.3,9.3,9.3,9.3,9.3,9.3,9.3,9.3,9.4,9.4,9.4],[9.3,9.3,9.3,9.4,9.4,9.2,9.1,9.1,9.1,9.2,9.2,9.3,9.3],[9.3,9.3,9.3,9.7,9.5,9.3,9.1,9.1,9.1,9.0,9.1,9.1,9.2],[9.6,9.7,9.6,9.4,9.3,9.1,9.1,9.1,8.9,8.9,8.9,9.0,9.2],[9.7,9.5,9.2,9.1,9.1,9.1,9.1,9.1,8.9,8.8,8.9,8.9,9.3],[8.9,8.9,9.0,9.1,9.2,9.2,9.1,9.1,8.9,8.8,8.8,8.8,9.1],[9.1,9.1,9.1,9.1,9.1,9.1,9.1,9.0,8.9,8.8,8.7,8.7,8.6],[9.2,9.1,9.1,9.0,9.1,9.1,9.0,8.9,8.9,8.8,8.7,8.6,8.6],[9.3,9.1,9.0,8.9,8.9,9.0,8.9,8.9,8.8,8.7,8.5,8.6,8.6],[9.1,9.0,8.9,8.8,8.8,8.9,8.9,8.9,8.9,8.9,8.0,7.7,8.6],[9.0,8.9,8.8,8.7,8.7,8.8,9.0,9.0,8.9,8.7,8.2,6.3,7.8],[8.9,8.9,8.7,8.8,8.7,8.7,8.7,8.6,8.4,8.4,8.3,5.7,5.7],[8.8,8.9,8.7,8.6,8.2,7.9,7.7,7.5,7.8,7.8,7.2,5.2,4.0],[8.6,8.8,8.7,7.2,6.5,6.5,7.0,7.7,8.3,7.8,6.3,4.2,3.3],[7.6,8.0,8.3,5.8,6.2,6.5,6.1,7.3,7.1,5.4,4.8,3.2,2.8],[3.7,4.2,4.3,4.3,3.7,2.9,2.3,1.2,1.2,0.8,1.1,1.6,1.5],[0.4,0.5,0.9,1.0,0.6,0.4,0.2,0.1,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.1,1.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,1.8,1.8,1.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.8,1.8,1.8,1.8,1.8],[0.0,0.0,0.0,0.0,0.0,0.0,0.2,1.8,1.8,1.8,1.8,1.8,1.8],[0.0,0.0,0.0,0.0,0.0,0.5,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[0.0,0.0,0.0,0.0,1.7,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[0.0,0.0,0.5,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[0.0,1.6,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[2.8,1.9,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[6.6,5.8,3.9,2.2,1.9,1.9,1.8,1.8,1.8,1.8,1.8,1.8,1.8],[9.1,8.0,6.8,6.1,5.8,5.2,4.4,2.7,2.0,2.3,2.9,4.9,5.8],[9.3,9.3,9.3,9.2,8.7,8.2,8.4,8.1,7.6,8.5,8.7,9.2,9.2],[9.7,9.6,9.6,9.6,9.6,9.8,9.8,9.9,9.9,9.8,9.8,9.8,9.7],[10.0,9.9,9.9,9.9,9.9,10.0,10.1,10.1,10.1,10.0,9.9,9.9,9.9],[10.3,10.2,10.2,10.1,10.1,10.2,10.2,10.2,10.1,10.1,10.1,10.0,9.9],[10.4,10.2,10.1,10.0,9.9,10.1,10.0,10.0,10.0,10.0,10.0,9.9,9.9],[11.9,11.1,10.0,9.8,9.6,9.7,9.8,9.8,9.8,9.8,9.9,10.7,11.2],[14.1,12.7,10.9,9.9,9.8,9.8,9.8,9.8,9.7,9.8,11.0,12.6,13.5],[15.8,13.7,11.4,10.0,9.9,9.8,9.8,9.8,9.9,10.1,11.9,14.1,15.6],[15.2,13.5,11.3,10.1,10.1,10.1,10.1,10.1,10.2,11.0,13.5,16.6,17.6],[13.3,12.1,10.5,9.8,9.9,9.9,9.9,10.0,10.2,13.1,16.9,18.1,18.0],[11.0,10.5,9.6,9.5,9.6,9.6,9.7,9.9,10.2,13.4,15.7,16.4,16.7],[9.7,9.6,9.6,9.5,9.6,9.7,9.8,9.8,10.1,12.6,14.2,15.0,15.7]]}
const D = (1.5 * Math.PI) / 180
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x * Math.cos(D) - y * Math.sin(D), x * Math.sin(D) + y * Math.cos(D)))

// ---- Parts ---------------------------------------------------------------------------------
const steel = new Part()   // purple: chords, posts, diagonals, bracing, girders
const under = new Part()   // the deck's underside and floor system
const stone = new Part()   // pier masonry
const cap = new Part()     // pier copings
const deck = new Part()    // walking surface and curbs

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A rectangular beam from a to b, w wide and d deep, its four long faces (no ends). */
function beam(p: Part, a: V3, b: V3, w: number, d: number, up: V3 = [0, 0, 1]) {
  const t = nrm(sub(b, a))
  let u = crs(t, up)
  if (Math.hypot(...u) < 1e-3) u = crs(t, [1, 0, 0])
  u = nrm(u)
  const v = nrm(crs(u, t))
  const U = scl(u, w / 2), V = scl(v, d / 2)
  const c = (q: V3, su: number, sv: number) => add(add(q, scl(U, su)), scl(V, sv))
  for (const [su, sv, n] of [[1, 0, u], [-1, 0, scl(u, -1)], [0, 1, v], [0, -1, scl(v, -1)]] as [number, number, V3][]) {
    const [s1, s2] = su ? [[su, -1], [su, 1]] : [[-1, sv], [1, sv]]
    face(p, c(a, s1[0], s1[1]), c(b, s1[0], s1[1]), c(b, s2[0], s2[1]), c(a, s2[0], s2[1]), n)
  }
}

// ---- Through trusses -------------------------------------------------------------------------
/**
 * A through truss span from pier to pier: `tops[i]` is the top chord's height
 * above the walkway at panel point i (0 and n are the bearings, where the
 * inclined end posts start). Pratt web: diagonals fall toward midspan.
 */
function throughSpan(y0: number, y1: number, tops: number[]) {
  const n = tops.length - 1
  const ys = stations(y0, y1, (y1 - y0) / n)
  const bot = (y: number) => walk(y) - 1.0
  for (const s of [-1, 1]) {
    const x = XC + s * TX
    // Bottom chord: a deep beam, its top a curb 0.5 m over the walkway.
    band(steel, x - 0.35, x + 0.35, stations(y0, y1, 10), (y) => walk(y) + 0.5, (y) => walk(y) - 1.6)
    const top = (i: number): V3 => [x, ys[i], walk(ys[i]) + tops[i]]
    const base = (i: number): V3 => [x, ys[i], bot(ys[i])]
    // Top chord and end posts.
    beam(steel, base(0), top(1), 1.0, 0.9)
    beam(steel, top(n - 1), base(n), 1.0, 0.9)
    for (let i = 1; i < n - 1; i++) beam(steel, top(i), top(i + 1), 1.2, 1.0)
    for (let i = 1; i < n; i++) {
      strip(steel, base(i), top(i), 0.7, [1, 0, 0])
      // Diagonal: from the top on the end side down to the bottom on the midspan side.
      const towardMid = i < n / 2 ? i + 1 : i - 1
      if (i !== n / 2 || n % 2) strip(steel, top(i), base(towardMid), 0.6, [1, 0, 0])
      // A sub-diagonal from mid-height on long panels, as the subdivided panels read.
      if (tops[i] > 17) strip(steel, [x, (ys[i] + ys[towardMid]) / 2, (bot(ys[i]) + walk(ys[i]) + tops[i]) / 2], base(towardMid), 0.35, [1, 0, 0])
    }
    if (n % 2 === 0) {
      // The middle panels cross.
      const m = n / 2
      strip(steel, top(m), base(m - 1), 0.4, [1, 0, 0])
      strip(steel, top(m), base(m + 1), 0.4, [1, 0, 0])
    }
  }
  // Top lateral struts at each panel point, X bracing between them, and the portals.
  for (let i = 1; i < n; i++) {
    const z = walk(ys[i]) + tops[i]
    beam(steel, [XC - TX, ys[i], z], [XC + TX, ys[i], z], 0.5, 0.6)
    if (i < n - 1) {
      const z2 = walk(ys[i + 1]) + tops[i + 1]
      strip(steel, [XC - TX, ys[i], z + 0.2], [XC + TX, ys[i + 1], z2 + 0.2], 0.35, [0, 0, 1])
      strip(steel, [XC + TX, ys[i], z + 0.2], [XC - TX, ys[i + 1], z2 + 0.2], 0.35, [0, 0, 1])
    }
  }
  for (const [i, j] of [[0, 1], [n, n - 1]]) {
    // Portal: a plate across the end posts just under the first strut.
    const t = 0.8, yy = ys[i] + (ys[j] - ys[i]) * t, z = bot(ys[i]) + (walk(ys[j]) + tops[j] - bot(ys[i])) * t
    beam(steel, [XC - TX, yy, z - 0.9], [XC + TX, yy, z - 0.9], 0.4, 1.8)
  }
  floorSystem(y0, y1)
}

/** The walkway deck between the truss planes: walking surface on top, floor beams' underside below. */
function floorSystem(y0: number, y1: number, half = TX - 0.35) {
  const ys = stations(y0, y1, 10)
  band(deck, XC - half, XC + half, ys, walk, (y) => walk(y) - 0.3, { top: true })
  band(under, XC - half, XC + half, ys, (y) => walk(y) - 0.3, (y) => walk(y) - 1.5, { bottom: true, ends: true })
}

/** A low truss at each edge of the deck: chords and posts, 2.6 m over the walkway. */
function ponySpan(y0: number, y1: number) {
  const ys = stations(y0, y1, 6.25)
  for (const s of [-1, 1]) {
    const x = XC + s * TX
    band(steel, x - 0.35, x + 0.35, stations(y0, y1, 10), (y) => walk(y) + 0.5, (y) => walk(y) - 1.6)
    band(steel, x - 0.3, x + 0.3, stations(y0, y1, 10), (y) => walk(y) + 2.6, (y) => walk(y) + 2.0)
    ys.forEach((y, i) => {
      strip(steel, [x, y, walk(y) + 0.5], [x, y, walk(y) + 2.0], 0.4, [1, 0, 0])
      if (i < ys.length - 1) strip(steel, [x, y, walk(y) + 2.0], [x, ys[i + 1], walk(ys[i + 1]) + 0.5], 0.35, [1, 0, 0])
    })
  }
  floorSystem(y0, y1)
}

// ---- Piers ------------------------------------------------------------------------------------
/** Plan ring of a river pier: a cutwater pointing upstream (−x), square downstream, CCW from above. */
function pierRing(cy: number, hw: number, hl: number, tip: number, xc = XC): [number, number][] {
  return [[xc - hw - tip, cy], [xc - hw, cy - hl], [xc + hw, cy - hl], [xc + hw, cy + hl], [xc - hw, cy + hl]]
}
function riverPier(cy: number) {
  const topZ = walk(cy) - 1.6
  footedLoft(stone, ground, [
    { plan: pierRing(cy, 10.6, 4.6, 3.6), z: 'ground' },
    { plan: pierRing(cy, 10.2, 4.3, 3.0), z: 8 },
    { plan: pierRing(cy, 9.6, 3.7, 1.6), z: topZ - 0.7 },
  ], 4, false)
  // Coping.
  footedLoft(cap, ground, [
    { plan: pierRing(cy, 9.9, 4.0, 1.7), z: topZ - 0.7 },
    { plan: pierRing(cy, 9.9, 4.0, 1.7), z: topZ },
  ], 4)
}
/** A plain land pier on the curved approach: a stone shaft under the girders. */
function landPier(x: number, y: number, ang: number, w: number) {
  const topZ = walk(y) - 1.6
  const c = Math.cos(ang), s = Math.sin(ang)
  const ring = ([[-w / 2, -1.6], [w / 2, -1.6], [w / 2, 1.6], [-w / 2, 1.6]] as [number, number][]).map(([u, v]) => [x + u * c + v * s, y - u * s + v * c] as [number, number])
  footedLoft(stone, ground, [{ plan: ring, z: 'ground' }, { plan: ring, z: topZ - 0.5 }], 3, false)
  footedLoft(cap, ground, [{ plan: ring, z: topZ - 0.5 }, { plan: ring, z: topZ }], 3)
}

// ---- The spans -------------------------------------------------------------------------------
const PIERS = [-136, -86, 69, 140, 212.5, 286.5]
for (const y of PIERS) riverPier(y)

// Channel span: lidar top chord (m above the river) through its panel points.
const CHANNEL_TOP = piecewise([[-80, 36], [-77, 37.4], [-69, 40], [-61, 42], [-53, 44], [-45, 45.5], [-37, 46], [-29, 46.5],
  [-17, 46.8], [7, 46.8], [15, 46.3], [23, 46], [35, 43.5], [43, 41.8], [51, 39.7], [59, 37.4], [63, 35.6]])
{
  const y0 = -86, y1 = 69, n = 16
  const ys = stations(y0, y1, (y1 - y0) / n)
  throughSpan(y0, y1, ys.map((y, i) => (i === 0 || i === n ? 0 : CHANNEL_TOP(y) - walk(y))))
}
const parker = [0, 9, 12, 14, 15, 14, 12, 9, 0]
throughSpan(69, 140, parker)
throughSpan(140, 212.5, parker)
throughSpan(212.5, 286.5, parker)
throughSpan(286.5, 340.5, [0, 8.5, 11.5, 13, 11.5, 8.5, 0])
// Newport end: the abutment pier the land span bears on, and the deck on to the outline's end.
landPier(XC, 340.9, 0, 20)
floorSystem(340.5, Y_KY)
for (const s of [-1, 1]) band(steel, XC + s * TX - 0.3, XC + s * TX + 0.3, [340.5, Y_KY], (y) => walk(y) + 1.1, (y) => walk(y) - 1.6)

// Ohio shore span: low trusses at the deck's edges (lidar: nothing tall over the walkway).
ponySpan(-136, -86)

// Curved Ohio approach, from Pete Rose Way to the shore span: the outline's centre line.
const CURVE: [number, number][] = [[-31.0, -307.5], [-31.6, -280], [-31.4, -258], [-28.0, -240], [-20.5, -223], [-12.6, -206],
  [-6.3, -191], [-2.2, -175], [-0.4, -158], [0.5, -145], [XC, -136]]
{
  const pts = CURVE
  const halfW = 6.5
  for (let i = 0; i < pts.length - 1; i++) {
    const [xa, ya] = pts[i], [xb, yb] = pts[i + 1]
    const dx = xb - xa, dy = yb - ya, l = Math.hypot(dx, dy), ux = dy / l, uy = -dx / l // right-hand normal
    const P = (x: number, y: number, o: number, z: number): V3 => [x + ux * o, y + uy * o, z]
    const wa = walk(ya), wb = walk(yb)
    // Walking surface.
    face(deck, P(xa, ya, -halfW, wa), P(xa, ya, halfW, wa), P(xb, yb, halfW, wb), P(xb, yb, -halfW, wb), [0, 0, 1])
    // Underside.
    face(under, P(xa, ya, -halfW, wa - 1.8), P(xb, yb, -halfW, wb - 1.8), P(xb, yb, halfW, wb - 1.8), P(xa, ya, halfW, wa - 1.8), [0, 0, -1])
    // Fascia girders with a parapet rail on top, both edges.
    for (const s of [-1, 1]) {
      const o = s * halfW, n: V3 = [ux * s, uy * s, 0]
      face(steel, P(xa, ya, o, wa - 1.8), P(xb, yb, o, wb - 1.8), P(xb, yb, o, wb + 1.1), P(xa, ya, o, wa + 1.1), n)
      const o2 = o - s * 0.3, n2: V3 = [-n[0], -n[1], 0]
      face(steel, P(xa, ya, o2, wa), P(xb, yb, o2, wb), P(xb, yb, o2, wb + 1.1), P(xa, ya, o2, wa + 1.1), n2)
      face(steel, P(xa, ya, o2, wa + 1.1), P(xb, yb, o2, wb + 1.1), P(xb, yb, o, wb + 1.1), P(xa, ya, o, wa + 1.1), [0, 0, 1])
    }
  }
  // Piers under the curve, every second station, turned with the deck.
  for (const i of [1, 3, 5, 7]) {
    const [x, y] = pts[i], [xn, yn] = pts[i + 1]
    landPier(x, y, Math.atan2(xn - x, yn - y), 2 * halfW + 1)
  }
  // The Ohio shore pier where the curve meets the straight.
  riverPierLand(-175)
}
/** The masonry pier on the Ohio bank, at the curve. */
function riverPierLand(cy: number) {
  const x = -2.2, topZ = walk(cy) - 1.6
  const ring = pierRing(cy, 9.0, 3.8, 0, x).slice(1) as [number, number][]
  footedLoft(stone, ground, [{ plan: ring, z: 'ground' }, { plan: ring, z: topZ - 0.6 }], 3, false)
  footedLoft(cap, ground, [{ plan: ring, z: topZ - 0.6 }, { plan: ring, z: topZ }], 3)
}

// ---- Write --------------------------------------------------------------------------------------
const STEEL = 0x998fd0   // the purple paint, lavender in daylight photos, pulled to the palette's lightness
const list = [
  { part: steel, material: { name: 'purple-steel', color: STEEL, doubleSided: true } },
  { part: under, material: { name: 'purple-steel-shade', color: 0x7a70a8 } },
  { part: stone, material: { name: 'sandstone', color: 0xb3a286 } },
  { part: cap, material: { name: 'stone-coping', color: 0xd2c6ad } },
  { part: deck, material: { name: 'walkway', color: 0xcbc5ba } },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin mid-river on the bridge axis, on the water',
  bearing: 143.0, elevation: 0, piers: PIERS, walkwayHeights: { peteRoseWayEnd: walk(Y_OH), ohioPier: walk(-136), crest: walk(-4.5), lastLidar: walk(155.5), newportEnd: walk(Y_KY) },
}
if (import.meta.main) {
  const tris = list.reduce((n, { part }) => n + part.triangles, 0)
  if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
  const glb = writeGlb('Purple People Bridge', list, extras)
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  const out = new URL('../models/cin-purple-people-bridge.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
