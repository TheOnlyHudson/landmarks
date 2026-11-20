/**
 * Gordie Howe International Bridge, Detroit–Windsor (2018–2026; AECOM,
 * architect Erik Behrens; Bridging North America) — procedural, CC0-1.0.
 * bun generators/det-gordie-howe-bridge.ts
 *
 * The cable-stayed unit as one placement, as completed (structurally complete
 * early 2026, opened 27 July 2026; the photos used run from June 2025, deck
 * closed and towers finished, to July 2026): the two A-shaped concrete
 * towers, one on each bank, their legs straddling the deck and joining into
 * a single shaft that carries the stays; the stays in two inclined planes
 * from the shaft to the deck edges; the deck's edge girders, parapets and
 * underside; the back-span piers; and the curved approach viaducts on both
 * sides, deck and piers, to where the deck lands at the ends of the OSM
 * bridge outline. Writes a low model (towers, deck, piers, the stay fans as
 * faint veils with every third stay drawn) and a detail model (all 216
 * stays), which a map draws from detailZoom up.
 *
 * Frame: x across the bridge (+x toward the south-west, downstream), y along
 * it toward Windsor, z up, metres; origin midway between the two pylons' OSM
 * centroids, on the river. Placed at bearing 132.16°, the line from the US
 * pylon's OSM centroid to the Canadian one's (847.7 m apart; published main
 * span 853 m). The map owns the roadway: the edge girders and parapets stand
 * beside it, the underside hangs below it, nothing here is a slab at road
 * level.
 *
 * Height. z = 0 is the river: Mapterhorn's water reading here, 174.76 m.
 * The 2017 lidar (USGS_LPC_MI_WayneCo_2017_LAS_2018) predates the bridge, so
 * nothing below is lidar:
 * - roadway (estimated): 49 m at midspan (published 46 m clearance at the
 *   highest point plus a 3 m deck), a parabola to 42 m at the towers (photo-
 *   scaled from Woodrich's broadside, the deck at the near tower 73 px of a
 *   383 px / 220 m tower), then straight at the parabola's 3.3 % end grade
 *   down both back spans to 31.6 m at the Detroit end (y = -740) and 30.5 m
 *   at the Windsor end (y = +772); then along each curved approach (s from
 *   the back span's end) the 3.3 % grade eased over 150 m into a straight
 *   grade down to where the deck lands: on the US side 4.7 %, reaching 0.5 m
 *   over the map's ground (5.3 m) at the outline's end, 575 m on; on the
 *   Canadian side capped at 5 % (reaching the ground would take 7.2 %), so
 *   the deck lands 437 m on at 9.8 m on an abutment about 8 m over the
 *   map's ground. These are the roadway heights the model is built to; OSM
 *   carries no `ele` or `height` on the deck, so the map's deck may sit off
 *   them until someone tags it (docs/bridge-heights.md; needs a survey flown
 *   after the bridge opened in July 2026, and the newest 3DEP survey here is
 *   from 2017).
 * - towers: 220 m (published), standing on the banks (Mapterhorn 2-3.5 m
 *   above the water at the feet).
 * - ground under the towers and piers: Mapterhorn (tools/terrain.ts grid,
 *   bearing 132), 10 m tables above the water (US_GROUND, CA_GROUND).
 *
 * Published (Wikipedia "Gordie Howe International Bridge"; WDBA "By the
 * Numbers", gordiehoweinternationalbridge.com/project/statistics/, archived
 * 2025-08-15): cable-stayed, main span 853 m, total length 2.5 km, two
 * A-shaped towers 220 m "designed to resemble hockey sticks when swung for a
 * slapshot", 216 stays, clearance 46 m, width 37.5 m, six lanes and a
 * multi-use path, no piers in the water; "white to dark grey in colour";
 * architectural LED lighting ("Shimmer", Douglas Coupland).
 *
 * OSM: the bridge outline way/1272925228 (man_made=bridge, construction=
 * bridge, Q5266001) runs the whole 2.5 km, the curved approaches included
 * (y = -1175…+1144 in this frame); its straight part ends at y = -735 and
 * +772, where the roadway (way/168055476, way/1545225837, way/1152542218)
 * starts to curve. The approaches follow the motorway's centre line (moved
 * 1.5 m and 5 m across onto the deck's centre), to the end of the bridge
 * ways at the outline's ends: the US end at (-335, -1157), the Canadian at
 * (213, 1124). Mapterhorn ground under them in two 20 m tables.
 * The pylons are mapped as way/1323474509 (US) and way/1323474508 (Canada),
 * building=service, bridge:support=pylon, height 220, 63 x 10 m each.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - "Gordie Howe International Bridge - July 2026", WMrapids, CC0: the US
 *   tower from the air, three-quarter: the A, the legs meeting about 61 % up
 *   (133 m), the single shaft above (about 10 m across at the top), the
 *   back-span piers, the pale deck.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_-_July_2026.jpg
 * - "Aerial Tour of Gordie Howe Bridge - 54603187901", DHS, public domain:
 *   the Canadian tower from the air over the river (from the north-west):
 *   the two stay planes from the shaft to the deck edges, the back span.
 *   https://commons.wikimedia.org/wiki/File:Aerial_Tour_of_Gordie_Howe_Bridge_-_54603187901.jpg
 * - "Gordie Howe International Bridge from Black Oak Park, Windsor, Ontario,
 *   2025-06-07 02" and "04", Chris Woodrich, CC BY-SA 4.0: broadside from the
 *   Windsor bank downstream (south-west); tower and deck heights, stay
 *   anchorage zone on the shaft (about 140–215 m), the shaft's depth along
 *   the bridge (about 10 m at the top).
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_from_Black_Oak_Park,_Windsor,_Ontario,_2025-06-07_02.jpg
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_from_Black_Oak_Park,_Windsor,_Ontario,_2025-06-07_04.jpg
 * - "Gordie Howe International Bridge 2026-04-21 1052", TheWxResearcher,
 *   CC0: from the Detroit bank, the main span's sag and both towers.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_2026-04-21_1052.jpg
 * - "Gordie Howe International Bridge during clear morning 2025-09-30" and
 *   "2026-06-10 1013", TheWxResearcher, CC0: the US tower from below on the
 *   A's axis: straight legs, the notch where they meet, the outer edges
 *   flaring into the shaft (the "hockey stick"), the deck's pale underside.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_during_clear_morning_2025-09-30.jpg
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_2026-06-10_1013.jpg
 * - "Gordie Howe Bridge 2025d", Antony-22, CC BY-SA 4.0: broadside from
 *   Belanger Park, River Rouge (south-west): the back stays reach almost as
 *   far as the main-span ones.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_Bridge_2025d.jpg
 * - Night: "Gordie Howe International Bridge at night 2026-05-16",
 *   TheWxResearcher, CC0: towers floodlit warm white, stays lit, a lit line
 *   along the deck edge.
 *   https://commons.wikimedia.org/wiki/File:Gordie_Howe_International_Bridge_at_night_2026-05-16.jpg
 *
 * Estimated (from the photos, scaled by the published 220 m and 37.5 m):
 * - legs: feet 32 m either side of the axis (the OSM pylon is 63 m long; the
 *   legs must clear the 37.5 m deck), 9 m across and 12 m along the bridge at
 *   the foot, 6.5 x 9 m where they meet at 133 m; a 2.5 m plinth under each;
 * - shaft: 17.4 m across where the legs join, flaring in to 12 m at 158 m
 *   and 10 m at the 220 m top, 9.5 to 8 m along the bridge;
 * - stays: 27 per plane per side per tower (216 / 8), anchored on the shaft
 *   from 147 to 214 m, on the deck edges from 28 m off the tower to 12 m
 *   short of midspan and of the back spans' ends, evenly spaced (the real
 *   spacing is not measured). Drawn 0.6 m thick in the detail model, about
 *   three times the real ones;
 * - deck: edge girders 2.8 m deep, parapets 1.1 m, underside 1.6 m below
 *   the road; the back spans' piers four spans each (79 m Detroit side,
 *   87 m Windsor side), two 4.5 m columns under a cap beam, at y = -503,
 *   -582, -661, -740 and +511, +598, +685, +772. The real pier stations
 *   were not measured (the 2022 NAIP shows construction). The approaches'
 *   piers, the same two columns under a cap, every 60 m along the road,
 *   their caps shallower where the deck comes down near the ground;
 *   the approach deck as the back spans' (edge girders, parapets,
 *   underside), 37.5 m wide.
 *
 * Doubts:
 * - replaces lists the two pylons and the man_made=bridge outline, which the
 *   model now draws end to end. The outline is still tagged
 *   construction=bridge although the bridge opened in July 2026.
 * - The roadway heights are estimated, not measured; the map's deck may sit
 *   a few metres off the parapets until the deck is tagged. The approaches'
 *   profiles are the least certain: the Canadian approach would need 7.2 %
 *   to come down to the map's (pre-construction) ground, so either the
 *   estimated back-span heights are high or the deck lands on fill above
 *   that ground; the model takes the second, a 5 % grade and an abutment.
 * - The approaches' pier stations and the abutments' form are estimated;
 *   no open photo shows either approach end clearly.
 * - The towers' grey gradient ("white to dark grey") is drawn as one pale
 *   grey; the legs' slight curvature is drawn as straight legs plus the
 *   flare into the shaft.
 * - Back-span pier count and spacing are estimated.
 *
 * Night: the towers are floodlit (_FLOODLIGHT on the concrete, faces looking
 * up dimmer); the stays carry it too; `lamp` beads along both parapets stand
 * for the lit deck edge.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, face, footedLoft, groundAt, rod, stations, bead, type GroundGrid } from './bridge-kit'
import { box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements -------------------------------------------------------------

const T = 423.9                     // towers at y = ±T
const US_END = -740, CA_END = 772   // the straight back spans' ends
const HALF = 18.75                  // half the deck's width
const CREST = 49, AT_TOWER = 42, K = (CREST - AT_TOWER) / (T * T)
const GRADE = 2 * K * T
/** The roadway above the river (estimated, see header). */
const road = (y: number): number => Math.abs(y) <= T ? CREST - K * y * y : AT_TOWER - GRADE * (Math.abs(y) - T)

// Mapterhorn ground above the river (174.76 m), 10 m apart across (x -50…50)
// and 20 m along y. Water between the tables.
const US_GROUND: GroundGrid = { y0: -800, x0: -50, step: 10, z: [
  [4.9, 4.8, 4.7, 4.8, 4.6, 4.5, 4.4, 4.3, 4.1, 4.3, 4.6], [4.0, 4.2, 4.3, 4.4, 4.2, 4.0, 4.0, 3.9, 4.0, 4.0, 3.9], [4.2, 4.4, 4.5, 4.5, 4.3, 4.2, 4.1, 4.1, 4.0, 4.0, 3.9], [3.8, 4.0, 4.3, 4.3, 4.4, 4.4, 4.3, 4.2, 4.1, 4.1, 4.0],
  [3.4, 3.5, 3.7, 4.0, 4.1, 4.3, 4.3, 4.2, 4.1, 4.1, 4.0], [3.4, 3.4, 3.4, 3.6, 4.0, 4.0, 4.0, 4.0, 4.1, 4.1, 4.0], [3.6, 3.7, 3.7, 3.7, 3.7, 3.8, 3.7, 3.6, 3.6, 3.8, 3.7], [3.5, 3.4, 3.4, 3.4, 3.5, 3.6, 3.4, 3.4, 3.4, 3.5, 3.5],
  [4.0, 3.9, 3.8, 3.6, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.4], [4.1, 4.1, 4.2, 4.3, 4.2, 4.3, 4.3, 4.3, 4.3, 4.2, 4.2], [4.2, 4.2, 4.2, 4.3, 4.5, 4.4, 4.2, 4.3, 4.2, 4.1, 4.2], [4.2, 4.3, 4.2, 4.2, 4.1, 3.9, 3.7, 3.7, 3.7, 3.5, 3.6],
  [3.7, 3.6, 3.6, 3.6, 3.6, 3.5, 3.5, 3.5, 3.4, 3.3, 3.4], [3.5, 3.5, 3.5, 3.4, 3.4, 3.4, 3.5, 3.4, 3.4, 3.4, 3.5], [3.3, 3.4, 3.5, 3.5, 3.7, 3.5, 3.5, 3.4, 3.4, 3.5, 3.6], [3.5, 3.5, 3.6, 3.6, 3.7, 3.6, 3.6, 3.6, 3.5, 3.4, 3.2],
  [3.3, 3.5, 3.4, 3.6, 3.6, 3.6, 3.6, 3.4, 3.5, 3.2, 2.9], [3.3, 3.3, 3.2, 3.4, 3.4, 3.4, 3.3, 3.2, 3.1, 2.8, 2.8], [3.3, 3.3, 3.5, 3.3, 3.5, 3.2, 3.0, 2.8, 2.7, 2.4, 2.7], [2.8, 2.7, 2.8, 3.0, 2.9, 2.9, 2.8, 2.6, 2.4, 2.2, 2.4],
  [0.0, 0.0, 0.1, 0.7, 2.1, 2.4, 2.5, 2.2, 2.1, 2.2, 2.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
] }
const CA_GROUND: GroundGrid = { y0: 360, x0: -50, step: 10, z: [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.9, 1.8, 1.3, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [2.2, 2.2, 2.0, 2.2, 2.1, 2.0, 1.8, 0.6, 0.0, 0.0, 0.0], [2.2, 2.2, 2.2, 2.2, 2.3, 2.2, 2.2, 1.9, 1.6, 1.6, 1.5],
  [2.3, 2.3, 2.3, 2.1, 2.3, 2.2, 2.2, 1.7, 1.6, 1.6, 1.6], [2.4, 2.3, 2.3, 2.3, 2.4, 2.4, 2.4, 2.3, 2.3, 2.1, 1.6], [2.9, 2.9, 3.1, 3.0, 2.9, 2.9, 2.8, 2.9, 2.6, 2.5, 1.9], [2.8, 2.9, 2.9, 2.9, 3.1, 3.2, 3.2, 3.0, 2.9, 2.8, 2.7],
  [3.1, 3.2, 3.1, 3.0, 3.2, 3.4, 3.5, 3.2, 2.7, 2.7, 2.7], [3.1, 3.4, 3.4, 3.3, 3.5, 3.3, 3.1, 3.0, 2.9, 2.9, 2.7], [3.4, 3.3, 3.5, 3.6, 3.6, 3.5, 3.4, 3.3, 3.5, 3.1, 2.7], [3.6, 3.6, 3.5, 3.5, 3.5, 3.7, 3.6, 3.6, 3.7, 3.4, 3.4],
  [3.2, 3.3, 3.3, 3.4, 3.5, 3.4, 3.0, 3.0, 3.1, 3.0, 3.1], [1.2, 1.7, 3.0, 3.2, 3.4, 3.4, 3.2, 3.1, 3.0, 3.0, 3.1], [3.6, 3.6, 3.6, 3.6, 2.6, 2.5, 4.6, 5.0, 5.0, 4.7, 4.1], [3.2, 3.2, 3.3, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 3.5, 2.5],
  [3.0, 3.2, 3.2, 3.2, 3.2, 3.2, 3.3, 3.6, 3.7, 3.7, 3.9], [3.2, 3.2, 3.2, 3.2, 3.1, 3.3, 3.3, 3.5, 3.8, 3.9, 4.1], [3.4, 3.4, 3.4, 3.2, 3.3, 3.4, 3.3, 3.5, 3.8, 3.9, 4.0], [3.2, 3.2, 3.3, 3.3, 3.4, 3.4, 3.4, 3.4, 3.6, 3.6, 3.8],
  [3.3, 3.3, 3.2, 3.2, 3.2, 3.3, 3.2, 3.3, 3.4, 3.4, 3.5], [3.2, 3.2, 3.1, 3.2, 3.2, 3.2, 3.3, 3.4, 3.4, 3.4, 3.5], [3.1, 3.2, 3.2, 3.2, 3.3, 3.2, 3.3, 3.3, 3.3, 3.4, 3.7],
] }
// The same, 20 m apart, under the curved approaches.
const US_APPROACH_GROUND: GroundGrid = { y0: -1200, x0: -380, step: 20, z: [
  [4.7, 4.8, 4.6, 4.9, 5.0, 4.8, 5.1, 5.3, 5.5, 5.7, 5.5, 5.8, 5.9, 5.7, 5.4, 5.1, 5.1, 4.9, 4.9, 4.6, 4.6, 4.6, 4.7], [4.6, 4.7, 4.6, 4.8, 4.8, 4.9, 5.0, 5.1, 5.6, 5.7, 5.8, 6.0, 6.0, 5.9, 5.6, 5.1, 5.1, 5.2, 5.0, 5.0, 4.6, 4.6, 4.4],
  [4.5, 4.9, 4.8, 4.9, 5.0, 4.8, 4.5, 4.9, 5.3, 5.7, 5.8, 5.8, 6.0, 5.6, 5.3, 5.1, 5.2, 5.0, 4.8, 4.6, 4.6, 4.6, 5.0], [4.6, 4.8, 4.9, 4.7, 4.8, 4.9, 4.7, 5.1, 5.3, 5.7, 6.0, 5.2, 5.3, 5.1, 5.1, 4.9, 5.0, 4.8, 4.8, 5.2, 5.3, 5.0, 4.9],
  [4.2, 4.3, 4.8, 4.9, 5.0, 4.9, 5.0, 5.0, 5.3, 5.5, 5.1, 4.9, 4.6, 4.8, 4.8, 5.0, 5.1, 5.2, 5.0, 4.9, 4.8, 4.5, 4.5], [4.6, 4.6, 5.0, 5.0, 5.1, 5.0, 5.1, 4.8, 5.0, 4.8, 4.9, 4.7, 5.0, 5.8, 6.1, 6.1, 5.0, 4.7, 4.5, 4.5, 4.7, 4.6, 4.6],
  [4.8, 4.8, 5.0, 5.0, 5.0, 4.9, 4.8, 4.8, 4.8, 5.1, 5.5, 5.5, 5.8, 5.1, 4.5, 4.4, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6], [4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 5.2, 5.0, 5.2, 5.3, 5.6, 5.2, 4.3, 4.4, 4.5, 4.4, 4.5, 4.6, 4.7, 4.7, 4.6, 4.6, 4.6],
  [4.6, 4.6, 4.8, 5.0, 5.1, 5.1, 4.9, 4.8, 4.8, 5.4, 5.5, 5.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.7, 4.6, 4.5], [4.9, 5.0, 5.1, 5.1, 5.2, 5.1, 5.1, 4.9, 4.4, 5.3, 5.5, 5.5, 4.8, 4.8, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.3, 4.3, 4.2],
  [4.5, 4.7, 5.0, 5.1, 5.2, 4.9, 5.0, 5.0, 5.0, 5.2, 5.3, 5.2, 4.9, 4.6, 4.5, 4.5, 4.4, 4.5, 4.3, 4.5, 4.5, 4.5, 4.2], [4.5, 4.5, 5.0, 5.1, 5.2, 4.9, 4.9, 5.0, 4.9, 4.8, 4.9, 4.9, 4.9, 4.4, 4.4, 4.5, 4.6, 4.6, 4.5, 4.8, 4.8, 4.6, 4.3],
  [4.1, 4.4, 4.9, 4.9, 5.0, 4.9, 4.9, 5.0, 4.8, 4.9, 4.9, 4.4, 4.7, 4.7, 4.6, 4.6, 4.7, 4.6, 4.4, 4.5, 4.8, 4.7, 4.5], [3.8, 4.3, 4.5, 4.8, 4.8, 4.7, 4.9, 4.8, 4.6, 4.8, 4.9, 4.5, 4.4, 4.5, 4.5, 4.5, 4.5, 4.3, 4.2, 4.3, 4.4, 4.4, 4.3],
  [4.0, 4.3, 4.4, 4.5, 5.5, 4.7, 5.0, 4.7, 4.7, 4.5, 4.5, 4.9, 4.4, 4.7, 4.6, 4.7, 4.6, 4.3, 4.4, 4.4, 4.2, 4.1, 4.0], [3.6, 4.1, 4.3, 4.3, 4.5, 4.6, 5.0, 4.8, 4.6, 4.6, 4.5, 4.8, 4.4, 4.4, 4.5, 4.6, 4.8, 4.7, 4.5, 4.3, 3.9, 3.9, 4.0],
  [3.9, 4.1, 4.2, 4.4, 4.6, 4.8, 4.9, 4.8, 4.5, 4.5, 4.5, 4.7, 4.8, 4.8, 4.8, 4.8, 5.0, 4.8, 4.5, 4.3, 4.1, 4.2, 4.3], [4.0, 4.0, 4.2, 4.3, 4.7, 4.9, 4.9, 4.8, 4.4, 4.3, 4.6, 4.9, 4.9, 4.8, 4.9, 5.2, 5.1, 4.9, 4.7, 4.4, 4.3, 4.4, 4.4],
  [4.1, 4.0, 4.1, 4.1, 4.6, 4.8, 4.8, 4.7, 4.3, 4.3, 4.7, 4.7, 4.7, 4.9, 5.2, 5.4, 5.0, 4.9, 4.9, 4.8, 4.6, 4.7, 5.2], [4.0, 4.2, 4.1, 4.2, 4.5, 4.7, 4.8, 4.8, 4.4, 4.1, 4.4, 4.6, 4.6, 4.5, 4.8, 5.0, 4.9, 4.8, 4.8, 5.3, 5.2, 5.0, 4.9],
  [3.9, 4.1, 4.2, 4.3, 4.4, 4.6, 4.8, 4.9, 4.6, 4.0, 4.0, 4.3, 4.2, 4.3, 4.3, 4.5, 4.8, 4.9, 4.9, 4.5, 4.4, 4.3, 4.5], [4.0, 4.0, 4.2, 4.5, 4.3, 4.5, 4.8, 4.8, 4.7, 4.2, 3.9, 3.7, 4.1, 4.2, 4.1, 4.0, 4.0, 4.3, 4.4, 4.1, 4.0, 4.0, 4.0],
] }
const CA_APPROACH_GROUND: GroundGrid = { y0: 760, x0: -60, step: 20, z: [
  [3.3, 3.2, 3.3, 3.3, 3.3, 3.5, 3.9, 2.8, 1.9, 1.6, 1.6, 1.6, 1.6, 1.5, 1.3, 1.3, 1.1], [3.3, 3.2, 3.3, 3.3, 3.4, 3.4, 3.8, 1.7, 1.8, 1.6, 1.5, 1.5, 1.3, 1.3, 1.1, 1.2, 1.1],
  [3.1, 3.3, 3.3, 3.3, 3.3, 3.4, 3.2, 2.0, 1.8, 1.6, 1.5, 1.3, 0.7, 1.1, 1.6, 1.1, 1.1], [3.1, 3.3, 3.1, 3.4, 3.3, 3.7, 1.5, 1.7, 1.7, 1.5, 1.4, 1.3, 1.2, 0.6, 1.1, 1.1, 1.1],
  [3.1, 3.2, 3.1, 3.2, 3.4, 3.7, 1.9, 1.8, 1.6, 1.5, 1.4, 1.4, 0.8, 1.2, 1.2, 1.1, 1.1], [3.0, 3.0, 3.1, 3.3, 3.5, 1.9, 1.9, 1.6, 1.5, 1.3, 1.3, 1.3, 0.0, 1.2, 1.2, 1.2, 1.2],
  [2.6, 2.8, 3.1, 3.3, 3.7, 2.0, 1.8, 1.5, 1.3, 1.3, 1.3, 1.3, 1.1, 1.2, 1.2, 1.2, 1.1], [2.4, 2.8, 3.1, 3.3, 2.3, 2.0, 1.8, 1.5, 1.3, 1.1, 1.2, 1.1, 1.2, 1.3, 1.1, 1.1, 1.1],
  [4.4, 2.8, 3.1, 3.0, 2.2, 2.0, 1.8, 1.4, 1.1, 1.0, 1.2, 1.1, 1.2, 1.1, 1.1, 1.1, 1.1], [1.6, 2.0, 2.7, 2.2, 2.0, 1.9, 2.3, 2.3, 1.0, 1.0, 1.1, 1.2, 1.1, 1.1, 1.1, 1.1, 1.1],
  [1.5, 1.8, 1.9, 1.8, 1.8, 2.1, 2.7, 1.9, 1.1, 1.1, 1.1, 1.3, 1.1, 1.3, 1.2, 1.1, 1.1], [1.8, 1.7, 1.6, 1.6, 1.6, 2.7, 2.8, 1.3, 1.2, 1.3, 1.0, 1.1, 1.1, 1.1, 1.2, 1.1, 1.1],
  [1.6, 1.5, 1.5, 1.5, 1.8, 2.8, 2.5, 1.6, 1.4, 1.4, 1.1, 1.0, 1.0, 1.1, 1.1, 1.1, 1.2], [1.5, 1.4, 1.3, 1.3, 2.4, 2.6, 2.9, 2.3, 1.4, 1.4, 1.4, 1.4, 1.2, 1.1, 1.0, 1.1, 1.1],
  [1.3, 1.2, 1.1, 1.1, 1.3, 1.6, 2.4, 2.8, 2.4, 1.7, 1.6, 1.4, 1.4, 1.5, 1.4, 1.3, 1.3], [1.2, 1.0, 1.2, 1.2, 1.0, 1.3, 1.4, 1.4, 1.6, 2.4, 2.8, 2.4, 1.7, 1.5, 1.5, 1.4, 1.4],
  [1.1, 1.5, 1.0, 1.5, 1.5, 1.4, 1.4, 1.1, 1.4, 1.3, 1.4, 1.6, 2.2, 1.5, 1.5, 1.5, 1.5], [1.1, 1.3, 0.7, 1.7, 1.8, 1.6, 1.6, 1.2, 1.6, 1.6, 1.3, 1.5, 1.5, 1.5, 1.8, 1.6, 1.5],
  [1.5, 1.9, 1.9, 1.9, 1.3, 1.6, 1.3, 1.5, 1.6, 1.8, 1.8, 1.8, 1.8, 1.5, 1.7, 1.8, 1.8], [1.9, 1.8, 1.9, 1.7, 1.9, 1.9, 1.5, 1.6, 1.8, 1.9, 1.9, 1.7, 1.6, 1.7, 1.9, 1.9, 1.9],
  [1.9, 1.8, 2.0, 1.9, 1.9, 1.8, 1.6, 2.1, 2.3, 1.8, 2.0, 1.9, 1.6, 2.1, 2.0, 2.0, 1.8], [1.5, 1.8, 1.9, 1.9, 2.0, 1.9, 1.8, 2.2, 2.5, 2.6, 2.1, 2.1, 1.8, 2.0, 2.2, 2.1, 1.8],
] }
/** The map's ground under (x, y), metres above the river. */
const ground = (x: number, y: number): number =>
  y <= -800 ? groundAt(US_APPROACH_GROUND, x, y) : y >= 800 ? groundAt(CA_APPROACH_GROUND, x, y)
    : y <= -360 ? groundAt(US_GROUND, x, y) : y >= 360 ? groundAt(CA_GROUND, x, y) : 0

// ---- Parts ---------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { concrete: Part; deck: Part; under: Part; stays: Part; veil: Part; lamp: Part }
const newKit = (): Kit => ({ concrete: new Part(), deck: new Part(), under: new Part(), stays: new Part(), veil: new Part(), lamp: new Part() })

/** A rectangle centred on (cx, cy), half-sizes hx, hy, with chamfered corners r, at height z; CCW from above. */
function ring(cx: number, cy: number, hx: number, hy: number, z: number, r: number): V3[] {
  return ([[cx - hx + r, cy - hy], [cx + hx - r, cy - hy], [cx + hx, cy - hy + r], [cx + hx, cy + hy - r],
    [cx + hx - r, cy + hy], [cx - hx + r, cy + hy], [cx - hx, cy + hy - r], [cx - hx, cy - hy + r]] as [number, number][])
    .map(([x, y]) => [x, y, z] as V3)
}

// ---- Towers --------------------------------------------------------------------

const TOP = 220, JOIN = 133
const FOOT_X = 32, LEG_HX0 = 4.5, LEG_HY0 = 6, LEG_HX1 = 3.25, LEG_HY1 = 4.5
const SHAFT_HY = (z: number) => 4.75 - (0.75 * (z - JOIN)) / (TOP - JOIN)
/** The shaft's half-width across at height z: the flare where the legs join, then a gentle taper. */
const SHAFT_HX = (z: number) => z < 158 ? 8.7 - (2.7 * (z - (JOIN - 10))) / (158 - (JOIN - 10)) : 6 - (1 * (z - 158)) / (TOP - 158)

function tower(k: Kit, ty: number) {
  const C = one(k.concrete)
  for (const s of [-1, 1]) {
    const fx = s * FOOT_X
    // The plinth under the leg, on the bank.
    const g = Math.min(...[-5, 5].flatMap((dx) => [-7, 7].map((dy) => ground(fx + dx, ty + dy))))
    const plan: [number, number][] = [[fx - 5, ty - 7.5], [fx + 5, ty - 7.5], [fx + 5, ty + 7.5], [fx - 5, ty + 7.5]]
    footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: g + 2.5 }], 3)
    // The leg, straight from the plinth to where it joins its twin.
    const jx = s * LEG_HX1
    loftSolid(C, [ring(fx, ty, LEG_HX0, LEG_HY0, g + 2.4, 0.6), ring(jx, ty, LEG_HX1, LEG_HY1, JOIN + 4, 0.5)], [false, false])
  }
  // The shaft: from just below the join, flaring in, up to the top.
  const zs = [JOIN - 10, JOIN + 5, 158, 185, TOP - 1.2]
  const rings = zs.map((z) => ring(0, ty, SHAFT_HX(z), SHAFT_HY(z), z, 0.6))
  rings.push(ring(0, ty, SHAFT_HX(TOP) - 0.6, SHAFT_HY(TOP) - 0.6, TOP, 0.3))
  loftSolid(C, rings, [true, true])
}

// ---- Stays ---------------------------------------------------------------------

const N_STAYS = 27, Z_LOW = 147, Z_HIGH = 214, NEAR = 28

function stays(k: Kit, ty: number, lod: Lod) {
  const st = Math.sign(ty)
  const end = st < 0 ? US_END : CA_END
  for (const s of [-1, 1])
    for (const [dir, far] of [[-st, T - 12], [st, Math.abs(end) - T - 12]] as [number, number][]) {
      const lines: [V3, V3][] = []
      for (let i = 0; i < N_STAYS; i++) {
        const t = i / (N_STAYS - 1)
        const z = Z_LOW + (Z_HIGH - Z_LOW) * t
        const top: V3 = [s * (SHAFT_HX(z) - 2.2), ty + dir * (SHAFT_HY(z) - 0.6), z]
        const y = ty + dir * (NEAR + (far - NEAR) * t)
        lines.push([top, [s * (HALF + 0.2), y, road(y) - 0.4]])
      }
      if (lod === 'detail') for (const [a, b] of lines) rod(k.stays, a, b, 0.3, 4)
      else {
        for (let i = 0; i < N_STAYS; i += 3) rod(k.stays, lines[i][0], lines[i][1], 0.5, 3)
        rod(k.stays, lines[N_STAYS - 1][0], lines[N_STAYS - 1][1], 0.5, 3)
        // The fan between the stays, a faint double-sided veil.
        for (let i = 0; i < N_STAYS - 1; i++) {
          const [t0, d0] = lines[i], [t1, d1] = lines[i + 1]
          k.veil.tri(t0, d0, d1); k.veil.tri(t0, d1, t1)
        }
      }
    }
}

// ---- Deck ----------------------------------------------------------------------

/** Deck stations: denser over the main span's curve, the towers and the ends included. */
function deckStations(step: number): number[] {
  return [...stations(US_END, -T, step), ...stations(-T, T, step).slice(1), ...stations(T, CA_END, step).slice(1)]
}

function deck(k: Kit, lod: Lod) {
  const ys = deckStations(lod === 'low' ? 32 : 16)
  for (const s of [-1, 1]) {
    // Edge girder with its pale fascia, and the parapet on it beside the roadway.
    band(k.deck, s * (HALF - 1.0), s * HALF, ys, (y) => road(y) - 0.2, (y) => road(y) - 3.0, { out: true, in: true, bottom: true, ends: true })
    band(k.deck, s * (HALF - 0.5), s * HALF, ys, (y) => road(y) + 1.1, (y) => road(y) - 0.2, { out: true, in: true, top: true, ends: true })
    // The lit deck edge at night: beads on the parapet.
    for (const y of stations(US_END + 10, CA_END - 10, lod === 'low' ? 40 : 20))
      bead(k.lamp, [s * (HALF + 0.15), y, road(y) + 0.3], lod === 'low' ? 0.6 : 0.35, lod === 'low')
  }
  // The floor's underside between the girders, facing down.
  band(k.under, -HALF + 1.0, HALF - 1.0, ys, (y) => road(y) - 1.0, (y) => road(y) - 1.6, { bottom: true })
}

// ---- Back-span piers -----------------------------------------------------------

const PIERS = [...stations(-T, US_END, (T + US_END) / -4).slice(1), ...stations(T, CA_END, (CA_END - T) / 4).slice(1)]

function piers(k: Kit) {
  for (const y of PIERS) {
    const capTop = road(y) - 3.0, capBot = capTop - 2.2
    box(one(k.concrete), -HALF + 0.5, HALF - 0.5, y - 2.0, y + 2.0, capBot, capTop, { r: 0.4 })
    for (const s of [-1, 1]) {
      const x = s * 11
      const plan: [number, number][] = [[x - 2.25, y - 2.25], [x + 2.25, y - 2.25], [x + 2.25, y + 2.25], [x - 2.25, y + 2.25]]
      footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: capBot + 0.1 }], 2.5, false)
    }
  }
}

// ---- Approaches ------------------------------------------------------------------

// The curved approach viaducts, from the straight back spans' ends to where
// the deck lands at the outline's ends: the centre lines of the motorway
// (OSM way/168055476 on the US side, way/1152542218 on the Canadian), moved
// across to the deck's centre, from the back span's end outward.
const US_PATH: [number, number][] = [[0.0, -740.0], [-0.2, -782.3], [-1.3, -801.9], [-4.0, -820.7], [-7.3, -837.2], [-11.5, -857.1], [-17.0, -876.4], [-23.9, -898.3], [-30.8, -915.9], [-38.9, -934.2], [-48.6, -952.3], [-60.3, -972.8], [-72.1, -992.8], [-84.8, -1009.7], [-96.0, -1022.7], [-106.3, -1033.3], [-120.7, -1047.1], [-137.6, -1062.3], [-159.4, -1079.3], [-171.5, -1088.2], [-183.5, -1096.3], [-194.7, -1103.4], [-208.0, -1111.0], [-222.1, -1118.0], [-241.6, -1126.8], [-260.1, -1134.1], [-281.8, -1141.3], [-299.9, -1147.3], [-317.3, -1152.5], [-334.6, -1157.2]]
const CA_PATH: [number, number][] = [[0.0, 772.1], [-0.5, 794.0], [0.7, 813.3], [2.7, 830.9], [6.6, 850.5], [10.2, 866.8], [16.3, 888.3], [22.8, 907.5], [29.8, 926.2], [37.6, 942.1], [45.7, 957.5], [54.0, 971.1], [63.6, 986.6], [75.3, 1003.7], [86.2, 1017.6], [98.5, 1032.9], [108.9, 1044.7], [122.2, 1058.1], [137.3, 1071.9], [152.2, 1084.0], [167.3, 1095.3], [183.4, 1106.4], [197.9, 1115.6], [213.0, 1124.1]]

type Station = { c: [number, number]; n: [number, number]; s: number }
/** Stations along a path at most `step` apart, each with its centre, its normal toward the model's +x side, and s. */
function pathStations(path: [number, number][], step: number): Station[] {
  const cum = [0]
  for (let i = 0; i + 1 < path.length; i++) cum.push(cum[i] + Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]))
  const out: Station[] = stations(0, cum[cum.length - 1], step).map((s) => {
    let i = 0
    while (i + 2 < cum.length && cum[i + 1] < s) i++
    const t = (s - cum[i]) / (cum[i + 1] - cum[i]), [a, b] = [path[i], path[i + 1]]
    return { c: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], n: [0, 0], s }
  })
  for (let i = 0; i < out.length; i++) {
    const a = out[Math.max(0, i - 1)].c, b = out[Math.min(out.length - 1, i + 1)].c
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
    const n: [number, number] = [t[1], -t[0]]
    out[i].n = n[0] >= 0 ? n : [-n[0], -n[1]]
  }
  // Keep the normals continuous where the path turns past 90° from the axis.
  for (let i = 1; i < out.length; i++) if (out[i].n[0] * out[i - 1].n[0] + out[i].n[1] * out[i - 1].n[1] < 0) out[i].n = [-out[i].n[0], -out[i].n[1]]
  return out
}
const pathLength = (path: [number, number][]) => path.slice(1).reduce((l, b, i) => l + Math.hypot(b[0] - path[i][0], b[1] - path[i][1]), 0)

/**
 * An approach's roadway against s from the back span's end (estimated): the
 * back span's grade, eased over 150 m into the straight grade that brings
 * the deck down to 0.5 m over the map's ground where it lands, or 5 %,
 * whichever is gentler.
 */
const MAX_GRADE = 0.05
function approachRoad(path: [number, number][], z0: number) {
  const L = pathLength(path), end = path[path.length - 1]
  const zEnd = ground(end[0], end[1]) + 0.5, T = 150, g0 = GRADE
  // No steeper than 5 %: where that leaves the deck above the ground at the
  // end (the Canadian side), it lands on an abutment.
  const g = Math.min(MAX_GRADE, (z0 - zEnd - (g0 * T) / 2) / (T / 2 + L - T))
  return { L, g, at: (s: number) => s <= T ? z0 - g0 * s - ((g - g0) * s * s) / (2 * T) : z0 - (g0 + g) * T / 2 - g * (s - T) }
}
const US_ROAD = approachRoad(US_PATH, road(US_END)), CA_ROAD = approachRoad(CA_PATH, road(CA_END))

/** A band swept along stations between lateral offsets o0 and o1, from bot(s) to top(s). */
function sweep(p: Part, st: Station[], o0: number, o1: number, top: (s: number) => number, bot: (s: number) => number,
  faces: { out?: boolean; in?: boolean; top?: boolean; bottom?: boolean; end?: boolean }) {
  const at = (q: Station, o: number, z: number): V3 => [q.c[0] + q.n[0] * o, q.c[1] + q.n[1] * o, z]
  const outO = Math.abs(o1) >= Math.abs(o0) ? o1 : o0, inO = outO === o1 ? o0 : o1, sg = Math.sign(outO - inO)
  for (let i = 0; i + 1 < st.length; i++) {
    const [a, b] = [st[i], st[i + 1]]
    const n: V3 = [(a.n[0] + b.n[0]) / 2, (a.n[1] + b.n[1]) / 2, 0]
    for (const [o, on, k] of [[outO, faces.out, sg], [inO, faces.in, -sg]] as [number, boolean | undefined, number][])
      if (on) face(p, at(a, o, bot(a.s)), at(b, o, bot(b.s)), at(b, o, top(b.s)), at(a, o, top(a.s)), [n[0] * k, n[1] * k, 0])
    if (faces.top) face(p, at(a, o0, top(a.s)), at(a, o1, top(a.s)), at(b, o1, top(b.s)), at(b, o0, top(b.s)), [0, 0, 1])
    if (faces.bottom) face(p, at(a, o0, bot(a.s)), at(a, o1, bot(a.s)), at(b, o1, bot(b.s)), at(b, o0, bot(b.s)), [0, 0, -1])
  }
  if (faces.end) {
    const q = st[st.length - 1], p2 = st[st.length - 2]
    const t: V3 = [q.c[0] - p2.c[0], q.c[1] - p2.c[1], 0]
    face(p, at(q, o0, bot(q.s)), at(q, o1, bot(q.s)), at(q, o1, top(q.s)), at(q, o0, top(q.s)), t)
  }
}

function approach(k: Kit, lod: Lod, path: [number, number][], rd: { L: number; at: (s: number) => number }) {
  const st = pathStations(path, lod === 'low' ? 45 : 12)
  const r = rd.at
  for (const s of [-1, 1]) {
    sweep(k.deck, st, s * (HALF - 1.0), s * HALF, (q) => r(q) - 0.2, (q) => r(q) - 3.0, { out: true, in: true, bottom: true, end: true })
    sweep(k.deck, st, s * (HALF - 0.5), s * HALF, (q) => r(q) + 1.1, (q) => r(q) - 0.2, { out: true, in: true, top: true, end: true })
    for (const q of pathStations(path, lod === 'low' ? 80 : 20).slice(1, -1))
      bead(k.lamp, [q.c[0] + q.n[0] * s * (HALF + 0.15), q.c[1] + q.n[1] * s * (HALF + 0.15), r(q.s) + 0.3], lod === 'low' ? 0.6 : 0.35, lod === 'low')
  }
  sweep(k.under, st, -HALF + 1.0, HALF - 1.0, (q) => r(q) - 1.0, (q) => r(q) - 1.6, { bottom: true })
  // Piers about every 60 m, as the back spans' (two columns under a cap
  // beam), square to the road; the cap shallower, then none, where the deck comes down to the ground.
  const C = one(k.concrete)
  for (const q of pathStations(path, 60).slice(1, -1)) {
    const g = ground(q.c[0], q.c[1])
    const capTop = r(q.s) - 3.0, capBot = Math.max(capTop - 2.2, g + 1.2)
    if (capTop - capBot < 0.8) continue
    const t: [number, number] = [-q.n[1], q.n[0]]
    const P = (o: number, u: number): [number, number] => [q.c[0] + q.n[0] * o + t[0] * u, q.c[1] + q.n[1] * o + t[1] * u]
    const rect = (o0: number, o1: number, h: number) => [P(o0, -h), P(o1, -h), P(o1, h), P(o0, h)]
    const ccw = (pl: [number, number][]) => {
      const a = pl.reduce((acc, p, i) => acc + p[0] * pl[(i + 1) % pl.length][1] - pl[(i + 1) % pl.length][0] * p[1], 0)
      return a < 0 ? [...pl].reverse() : pl
    }
    const cap = ccw(rect(-HALF + 0.5, HALF - 0.5, 2.0))
    footedLoft(k.concrete, ground, [{ plan: cap, z: capBot }, { plan: cap, z: capTop }], 40)
    // Its underside, facing down.
    C([0, 0, -1]).tri([...cap[0], capBot] as V3, [...cap[2], capBot] as V3, [...cap[1], capBot] as V3)
    C([0, 0, -1]).tri([...cap[0], capBot] as V3, [...cap[3], capBot] as V3, [...cap[2], capBot] as V3)
    for (const s of [-1, 1]) {
      const col = ccw(rect(s * 11 - 2.25, s * 11 + 2.25, 2.25))
      footedLoft(k.concrete, ground, [{ plan: col, z: 'ground' }, { plan: col, z: capBot + 0.1 }], 2.5, false)
    }
  }
  // The abutment where the deck lands: a wall across the deck's end from the
  // ground to 0.4 m under the roadway.
  const e = st[st.length - 1], zt = r(e.s) - 0.4
  const t: [number, number] = [-e.n[1], e.n[0]]
  const sgn = Math.sign((e.c[0] - st[st.length - 2].c[0]) * t[0] + (e.c[1] - st[st.length - 2].c[1]) * t[1])
  const W = (o: number, u: number): [number, number] => [e.c[0] + e.n[0] * o + t[0] * u * sgn, e.c[1] + e.n[1] * o + t[1] * u * sgn]
  let wall: [number, number][] = [W(-HALF - 0.5, -0.5), W(HALF + 0.5, -0.5), W(HALF + 0.5, 3), W(-HALF - 0.5, 3)]
  const area = wall.reduce((acc, p, i) => acc + p[0] * wall[(i + 1) % 4][1] - wall[(i + 1) % 4][0] * p[1], 0)
  if (area < 0) wall = wall.reverse()
  if (zt > Math.max(...wall.map(([x, y]) => ground(x, y))) + 0.2) footedLoft(k.concrete, ground, [{ plan: wall, z: 'ground' }, { plan: wall, z: zt }], 4)
}

// ---- Build -----------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  for (const ty of [-T, T]) { tower(k, ty); stays(k, ty, lod) }
  deck(k, lod)
  piers(k)
  approach(k, lod, US_PATH, US_ROAD)
  approach(k, lod, CA_PATH, CA_ROAD)
  return k
}

if (import.meta.main) {
  // Floodlit from below: every side face lit, faces looking up barely.
  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 1)
  // Colours from the 2025–2026 daylight photos: the towers' pale grey
  // concrete, the deck's white fascias and parapets, its grey steel
  // underside, the white stays.
  const CONCRETE = { ...finish('tower-concrete', 0xa9adb1), floodlight: flood }
  const DECK = finish('deck-white', 0xd3d5d5)
  const UNDER = finish('deck-underside', 0x8f959a)
  const STAY = { ...finish('stay-white', 0xf3f3ef), floodlight: () => 0.7 }
  const VEIL = { ...finish('stay-fan', 0xf3f3ef), opacity: 0.3, doubleSided: true }
  const LAMP = { name: 'lamp', color: 0xd6d6d0 }
  const low = build('low'), detail = build('detail')
  const lowList = [
    { part: low.concrete, material: CONCRETE }, { part: low.deck, material: DECK }, { part: low.under, material: UNDER },
    { part: low.stays, material: STAY }, { part: low.veil, material: VEIL }, { part: low.lamp, material: LAMP },
  ]
  const detailList = [
    { part: detail.concrete, material: CONCRETE }, { part: detail.deck, material: DECK }, { part: detail.under, material: UNDER },
    { part: detail.stays, material: STAY }, { part: detail.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the pylons, on the river',
    bearing: 132.16, elevation: 0, towers: [-T, T], backSpanEnds: [US_END, CA_END],
    ends: [US_PATH[US_PATH.length - 1], CA_PATH[CA_PATH.length - 1]],
    roadwayMidspan: road(0), roadwayAtTowers: road(T), roadwayBackSpanEnds: [road(US_END), road(CA_END)],
    roadwayEnds: [US_ROAD.at(US_ROAD.L), CA_ROAD.at(CA_ROAD.L)], approachGrades: [US_ROAD.g, CA_ROAD.g],
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['det-gordie-howe-bridge.glb', lowList, 5000, 250 * 1024],
    ['det-gordie-howe-bridge.detail.glb', detailList, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Gordie Howe International Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
