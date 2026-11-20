/**
 * Detroit–Superior Bridge (Veterans Memorial Bridge, 1918; King Bridge
 * Company) — procedural, CC0-1.0, no textures.
 * bun generators/cle-detroit-superior-bridge.ts
 *
 * The whole bridge inside its OSM outline as one placement: the steel
 * two-hinged arch truss over the Cuyahoga (two arch planes, the upper
 * roadway passing through them at about two thirds of the arch's height,
 * the streetcar deck slung lower inside), and the long run of reinforced
 * concrete arches either side: five on the west, seven on the east (twelve
 * in all, as published), each a deep barrel rib springing from the ground
 * with spandrel columns up to the lower (streetcar) deck, whose arcade of
 * round-headed openings runs the length of both faces under the upper
 * deck's parapet; tall transverse piers between the arches, and the two
 * main river piers carrying the steel arch.
 *
 * Frame: x across (+x south-east), y along the bridge toward Superior
 * Avenue (bearing 47.87°, the outline's axis; the roadways lie on it within
 * 0.5 m), z up, metres; origin at the outline's centroid, on the river. The
 * deck and the arch are centred 1.2 m south-east of the centroid (`XC`):
 * the lidar's arch planes are at x = -7 and +9.5.
 *
 * Height. z = 0 is the Cuyahoga (174.54 m NAVD88: the lidar's bare-earth
 * reading over the water in bridge_ele.py, and Mapterhorn's within 0.1 m).
 * Ground under the piers, ribs and walls is the map's terrain above that
 * (`GROUND`, 5 m table in this frame). elevation 0.
 *
 * Roadway heights built to (tools/bridge_ele.py measure 34570287 1040005259
 * 49684106 1255451483 96236993 --every 20, lidar lower quartile, spread
 * 0.01-0.07 m except two readings under the arch's bracing; NAVD88 = value +
 * 174.54): 29.4 m at y = -404, where the roadway meets the bare earth (node
 * 698115210, 203.95 m; above 0.04 m) and the map's terrain (29.3-29.6 m);
 * 29.9 m at the outline's west end (y = -388; 204.43 m at node 9576070142,
 * 3.9 m over the bare earth), a straight 2.6% grade to y = -177 (209.86 m),
 * a crest curve through 37.5 m at y = -77 (212.01 m) to y = +49 (209.13 m),
 * a straight 3.2% grade down to 26.3 m at node 11670720652 (y = +310) and
 * 23.6 m at node 631519679 (y = +393, 198.18 m), where the deck lands on the
 * ground at the outline's east end. The north sidewalk way 1309335172 runs
 * 0.05 m over the roadway. None of the ways carries ele; the values to give
 * the map are in ~/landmarks-scratch/osm-ele/cle-detroit-superior-bridge.osc
 * and .md (lidar + 0.52 m, the GEOID18-EGM96 gap here).
 *
 * Ends (rework, Nov 2026). West: OSM's outline and bridge ways stop at
 * y = -388, 3.9 m in the air; the deck runs on 16 m to land at y = -404 on
 * the bank above West 25th Street (way 34570287, not a bridge in OSM). The
 * model's deck, parapets, fascia and the solid west abutment now run to
 * y = -404: the abutment's side walls under the deck edges down to the map's
 * terrain, and an abutment face across the deck at the landing, 0.3 m under
 * the roadway (HAER OH-6 "View looking east of north elevation" shows the
 * solid abutment beyond the westmost arch). East: the deck lands at the
 * outline's end (y = +393, 0.02 m over the bare earth), where the last arch
 * springs from the ground; unchanged.
 *
 * Sources:
 * - OSM: outline way/1026898331 (man_made=bridge, bridge:structure=
 *   humpback, wikidata Q2493242), y = -388 to +393, about 30 m wide. The
 *   older Superior Avenue Viaduct ruin (way/1022165528) is not taken. No
 *   building or building:part lies under the model (overlap.ts: ok).
 * - Lidar, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019), 1 m grids over the
 *   whole outline: the arch's top 59.6 m over the river at y = -74 to -76
 *   (published 196 ft = 59.7 m), its top chords meeting the deck at
 *   y = -150 and +8, arch planes 16.5 m apart; deck edges -13 to +15
 *   (the 1969 widening cantilevered outside the arch).
 * - NAIP (USDA, public domain): the arch's plan, the bracing, the deck's
 *   edges.
 * - Published (Wikipedia "Detroit–Superior Bridge"; HAER OH-6): 1914-18,
 *   3,112 ft, 12 concrete arches and one 591 ft (180 m) steel span, 96 ft
 *   (29 m) clearance, 196 ft (60 m) to the arch's top, upper roadway and a
 *   lower streetcar deck, renamed Veterans Memorial Bridge 1989.
 * - Photos (Wikimedia Commons):
 *   - "Cleveland August 2015 24 (Detroit–Superior Bridge)" (Michael Barera,
 *     CC BY-SA 4.0): the steel arch and the main west pier from the river,
 *     the arch's depth, the lower deck hung inside, the arcade;
 *   - "Detroit-Superior Bridge (24086002344)" (Erik Drost, CC BY 2.0): the
 *     concrete arches face on: barrel ribs, spandrel columns, the arcade's
 *     round-headed openings, piers;
 *   - "Detroit Superior Bridge.jpg" and "Detroit Superior Bridge from Rapid"
 *     (Chris Light, CC BY-SA 4.0), "Detroit-Superior Bridge (24418672380)",
 *     "(19785372223)" (Erik Drost, CC BY 2.0): the arch from below and from
 *     the ends; "Detroit-Superior panorama" (Andrew Bardwell, CC BY-SA 2.0):
 *     the east approach's arches;
 *   - HAER OH-6 photos "General view of bridge looking northeast" and "View
 *     looking east of north elevation" (public domain): the whole north
 *     elevation.
 * - Night: "Detroit-Superior Bridge.jpg" (LeeG7144, CC BY-SA 3.0): the
 *   concrete arches floodlit white, the steel arch lit in colour. The
 *   concrete and the steel carry `_FLOODLIGHT`; street lights are `lamp`
 *   points every 46 m (estimated spacing).
 *
 * Estimated: the concrete arch piers' positions (lidar and NAIP can't see
 * them under the deck; twelve arches spaced evenly, five of about 30 m on
 * the west, where the ground is high, seven of about 48 m on the east, the
 * last landing at the east end), their shapes (semi-elliptic, springing
 * from the ground, crowns 9 m under the road), the lower deck's level (7.4 m
 * under the road), the arcade's bay width (about 3.6 m), the steel arch's
 * depth (1.5 m chords, 7.5 m deep at the crown), its 16 panels, its
 * springing (21.5 m over the river on the main piers), the main piers' size.
 * Colours from daylight photos: concrete pale cream (#e8e3d8), arch steel
 * silver-grey (#b4bec5), the arcade's shaded openings (#767c80).
 *
 * Doubts: the pier positions on the approaches; the west abutment's 16 m
 * beyond the outline is drawn over the map's own (non-bridge) Detroit Avenue
 * way 34570287, which the map lays on its terrain, up to 2 m under the true
 * roadway (ele tags don't reach a non-bridge way); the cantilevered walkways
 * are drawn as the deck edge only.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { bead, chamferedRect, face, footedLoft, footedWall, groundAt, parabola, piecewise, stations, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

// Map terrain (Mapterhorn) minus the river's reading (174.54 m NAVD88), 5 m apart in the anchor's
// frame (x across from -20 to +25, y along from -425 to +400).
const GROUND: GroundGrid = {"y0":-425,"x0":-20,"step":5,"z":[[28.9,29,29,29.1,29.1,29.2,29.3,29.2,28.9,28.7],[29,29,29.1,29.1,29.1,29.2,29.4,29.3,28.9,28.7],[29.1,29,29.1,29.1,29.1,29.2,29.4,29.5,29,28.8],[29.2,29.1,29.2,29.2,29.3,29.3,29.5,29.6,29.2,28.8],[29.2,29.2,29.3,29.3,29.3,29.3,29.6,29.5,28.2,27.4],[27.2,28.6,29.1,28.9,28.6,28.2,28.2,28.1,26.5,25.2],[26.6,27.5,28.1,28,27.6,27.1,26.7,26.4,25.2,23.5],[26.4,26.9,27.3,26.9,26.5,26.1,25.7,25.2,24.3,22.3],[26.2,26.6,26.2,25.7,25.3,24.9,24.5,24.1,23.3,21.1],[26.1,26.3,25.7,24.9,24.2,23.4,22.7,22.2,22,20.3],[26.2,26.2,25.3,24.3,23.5,22.7,22,21.4,20.1,19.3],[26.2,26.1,25.2,24.1,23,22,20.9,19.8,19,18.3],[26.1,26.1,25,23.8,22.6,21.4,20.2,19.1,18.6,17.9],[26.1,26,25,23.7,22.5,21.2,19.9,18.8,18.4,17.4],[26,26.1,24.9,23.5,22.1,20.8,19.5,18.3,18,17.2],[25.7,25.3,24.2,22.9,21.6,20.3,19,17.6,17.5,16.8],[25.4,25.1,24.1,22.7,21.4,20,18.6,17.2,17.1,16.3],[25.2,25.1,24.3,22.8,21.3,19.8,18.3,16.9,16.5,16],[25.1,25.1,24.3,22.4,20.6,18.9,17.3,16,15.7,15.1],[25.1,25.1,24.8,22.9,20.9,18.9,16.8,15.3,15,14],[23.7,23,24.4,22.6,20.5,18.4,16.2,14.7,14.3,13.2],[20.4,20.3,22.8,21.7,19.4,17.2,15.1,14,13.7,12.5],[20,20,20.6,19.5,18.1,16.5,14.7,13.5,13.2,11.8],[19.7,19.6,20.3,19.1,17.5,15.8,14.3,13.2,12.6,11.1],[19.3,19.3,19.1,17.8,16.5,15.3,14,12.8,12,10.5],[19,19,19.1,17.6,16.3,15,13.7,12.3,11.6,10.3],[18.7,18.7,18.6,17.4,16.1,14.8,13.4,11.9,11.3,10.2],[18.4,18.4,18.1,16.8,15.5,14.2,12.8,11.3,10.6,9.6],[18,18.1,17.7,16.3,15,13.6,12.3,10.7,10,8.8],[17.7,17.7,17.4,16,14.4,12.8,11.3,10.1,9.1,8.3],[17.3,17.2,16.6,15.4,13.5,11.6,10,9,8.5,8.2],[16.9,16.8,14.5,12.9,11.5,10.2,8.9,8.4,8.3,8.2],[16.6,16.2,14,12.4,11.1,9.7,8.6,8.5,8.4,8.2],[16.4,15.6,13.3,10.5,9.7,9,8.6,8.6,8.4,8.2],[13.9,11.9,9.2,8.9,8.9,8.8,8.7,8.6,8.5,8.3],[12.2,8.9,8.9,9,8.9,8.9,8.8,8.7,8.6,8.6],[9.8,9.3,9.8,9.5,9.3,9.2,9,8.9,8.9,8.9],[13,11.6,10.1,9.6,9.5,9.4,9.2,9.1,9.1,9.4],[13.1,10.1,9.6,9.6,9.4,9.3,9.1,9.3,9.7,9.6],[10,9.8,9.7,9.7,9.5,9.4,9.3,9.7,9.9,9.5],[10.1,10.1,10.5,10.1,9.9,9.7,9.5,9.9,9.8,9.1],[10.2,10.3,10.5,10.4,10.2,10.1,9.9,9.7,9.2,7.5],[10.4,10.5,10.6,10.6,10.4,10.3,10.1,8.8,7.3,6.3],[10.8,10.7,10.7,10.7,10.4,10.2,9.6,7.6,6.2,4.8],[11,10.8,10.8,10.5,9.9,9.3,8.3,6.8,5.5,2.9],[11,10.8,10.8,10.5,9.6,8.7,7.7,6.2,4.4,0.8],[10.8,10.8,10.7,10.3,9.3,8.3,7,5.3,2.3,0],[10.7,10.7,10.7,10.1,9,7.9,6.5,4.6,1.3,0],[10.6,10.6,10.6,10,8.8,7.6,6.1,3.8,0.2,0],[10.5,10.5,10.5,9.7,8.4,7.1,5.7,2.5,0,0],[10.4,10.4,10.3,8.8,7.2,5.7,4.1,0.2,0,0],[10.3,10.3,9.7,7.5,5,2.8,0.7,0,0,0],[10.1,9.1,7.5,5.4,3.5,1.1,0,0,0,0],[9.7,7.6,5.5,4.2,1.9,0.1,0,0,0,0],[9.2,6.7,4.5,2,0.4,0,0,0,0,0],[7.7,4.9,2.2,0.2,0,0,0,0,0,0],[5,2.1,0.1,0,0,0,0,0,0,0],[3.8,0.3,0,0,0,0,0,0,0,0],[3.4,0.3,0,0,0,0,0,0,0,0],[2.8,0.2,0,0,0,0,0,0,0,0],[1.5,0,0,0,0,0,0,0,0,0],[0.6,0,0,0,0,0,0,0,0,0],[0.1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0.3],[0,0,0,0,0,0,0,0,0,1.2],[0,0,0,0,0,0,0,0,0.5,1.4],[0,0,0,0,0,0,0,0,1.2,1.4],[0,0,0,0,0,0,0,0.1,1.3,1.3],[0,0,0,0,0,0,0,0.8,1.2,1.3],[0,0,0,0,0,0,0,1.2,1.2,1.3],[0,0,0,0,0,0,0.4,1.2,1.2,1.4],[0,0,0,0,0,0,1.1,1.2,1.3,1.4],[0,0,0,0,0,0.2,1.3,1.3,1.4,1.5],[0,0,0,0,0,0.8,1.2,1.4,1.5,1.6],[0,0,0,0,0,1,1.3,1.6,1.7,1.8],[0,0,0,0,0.1,1.3,1.5,1.7,1.8,1.9],[0,0,0,0,0.5,1.7,2.1,1.9,1.9,2],[0,0,0,0,1.4,3,3.4,2.3,2,2.1],[0,0,0,0.3,1.7,3.1,3.2,3,2.3,2.2],[0,0,0,0.9,1.9,3,3,2.7,2.5,2.3],[0,0,0.7,1.9,2.4,2.8,3,2.5,2.3,2],[0,0,1.8,1.7,2.1,2.5,3,2.6,2.1,1.9],[0,0.3,1.7,1.6,1.8,2.2,3.5,2.3,2.2,1.8],[0,1.4,1.8,1.8,1.8,1.9,1.6,1.5,1.7,2],[0,1.8,1.9,1.8,1.7,1.7,1.6,1.5,1.5,1.6],[0.2,1.9,1.8,1.7,1.7,1.6,1.6,1.5,1.4,1.6],[1,1.9,1.9,1.8,1.8,1.7,1.6,1.6,1.6,1.6],[1.8,1.9,1.9,1.8,1.8,1.7,1.6,1.6,1.6,1.4],[1.9,2,1.8,1.8,1.8,1.8,1.7,1.6,1.6,1.5],[2,2.3,1.9,1.9,1.9,1.9,1.8,1.7,1.6,1.5],[2,2.1,2.1,2,2,1.9,1.8,1.9,1.6,1.6],[1.8,1.8,2.4,2.5,2.2,2.2,2.3,1.8,1.5,1.6],[2,2.1,2.4,2.4,2.4,2.3,2.3,1.8,1.6,1.6],[2.1,2.2,2.2,2.2,2.1,2.2,2.1,1.7,1.6,1.6],[2.1,2.2,2.4,2.1,2.1,2,2,1.7,1.7,1.6],[2.2,2.1,2.1,2.1,2.1,2,1.8,1.8,1.7,1.7],[2.2,2.1,2.1,2.1,2,1.8,1.8,1.8,1.8,1.8],[2.2,2.3,2.2,2.1,2,2,1.9,1.9,1.8,1.9],[2.3,2.3,2.1,2.1,2,2,2,2,1.9,2.2],[2.1,2.1,2.1,2.1,2.2,2.2,2.2,2.1,2.1,2.3],[2.2,2.1,2.3,2.4,2.4,2.3,2.3,2.3,2.3,2.7],[2.2,2.2,2.5,2.6,2.5,2.5,2.6,2.4,2.5,2.8],[2.2,2.3,2.4,2.5,2.6,2.6,2.6,2.4,2.6,2.9],[2.3,2.3,2.4,2.5,2.6,2.7,2.6,2.6,2.8,2.9],[2.3,2.3,2.5,2.6,2.6,2.7,2.7,2.8,2.8,2.9],[2.3,2.4,2.5,2.6,2.7,2.7,2.7,2.7,2.8,2.9],[2.4,2.4,2.6,2.7,2.7,2.7,2.7,2.7,2.7,2.7],[2.5,2.5,2.7,2.8,2.9,3,2.9,2.8,2.7,2.7],[2.5,2.6,2.8,3,3.1,3.3,3.4,3.3,3,2.8],[2.5,2.6,2.8,3,3.2,3.5,3.6,3.7,3.4,3.3],[2.6,2.7,3.4,3.7,3.8,3.8,3.7,3.6,3.3,3.3],[2.8,2.8,2.9,3.2,3.5,3.6,3.5,3.5,3.4,3.4],[2.9,2.9,3.1,3.2,3.2,3.3,3.4,3.5,3.6,3.5],[3,3.1,3.2,3.2,3.2,3.3,3.3,3.5,3.6,3.6],[3.2,3.2,3.8,3.7,3.5,3.3,3.3,3.4,3.5,3.5],[3.2,3.2,3.3,3.3,3.3,3.4,3.3,3.4,3.5,3.5],[3.3,3.2,3.3,3.4,3.5,3.6,3.5,3.4,3.5,3.5],[3.4,3.4,3.7,3.7,3.8,3.8,3.6,3.5,3.6,3.6],[3.6,3.7,4.3,4.2,4.2,4.1,4,3.5,3.4,3.7],[3.8,4.3,4.6,4.5,4.4,4.3,4.6,3.8,3.3,3.8],[4,4.2,4.2,4.3,4.2,4.2,4.3,3.9,3.8,4],[4.2,4.1,4.1,4.1,4.1,4.1,4,4,4.2,4.1],[4.4,4.4,4.3,4.3,4.3,4.2,4.2,4.2,4.3,4.3],[4.7,4.6,4.6,4.5,4.5,4.4,4.4,4.4,4.5,4.6],[4.8,4.8,4.9,4.8,4.7,4.6,4.6,4.7,4.7,4.8],[5,5,5,4.9,4.9,4.9,4.9,4.9,4.9,4.9],[5.3,5.2,5.1,5.1,5.1,5.1,5.1,5.1,5.1,5.1],[5.6,5.5,5.5,5.5,5.6,5.6,5.6,5.5,5.5,5.6],[5.7,6,5.8,5.9,6,6.2,6.3,6.4,6.5,6.6],[5.6,5.8,5.9,6.1,6.2,6.4,6.6,6.5,6.6,6.6],[5.6,5.8,6,6.1,6.3,6.4,6.5,6.6,6.6,6.7],[6.2,6,6.1,6.2,6.3,6.4,6.6,6.6,6.7,6.7],[7,6.7,6.7,6.7,6.7,6.8,6.8,6.8,6.8,6.8],[7.7,7.5,7.8,7.6,7.5,7.5,7.4,7,6.9,6.9],[8,7.9,15.6,16.1,14.6,11.6,8.7,7.2,7.2,7.2],[8.1,7.9,13.3,13.8,11.5,10.1,8.7,7.7,7.4,7.3],[8.1,8.2,8.3,8.2,8.1,8,8,7.9,7.9,7.9],[8,7.9,7.9,7.9,8,8,8,8,7.9,7.9],[7.9,7.9,8.1,8.2,8.2,8.2,8.3,8.3,8.2,8],[8.5,8.5,8.5,8.5,8.6,8.6,8.6,8.6,8.6,8.6],[7.9,8.4,8.6,8.6,8.7,8.7,8.8,8.8,8.8,8.7],[8.2,8.5,8.7,8.7,8.7,8.7,8.8,8.8,8.8,8.7],[8.6,8.7,8.8,8.7,8.7,8.7,8.7,8.7,8.6,8.5],[8.9,8.8,8.8,8.7,8.7,8.6,8.5,8.5,8.5,8.5],[8.8,8.7,8.7,8.7,8.7,8.6,8.6,8.5,8.5,8.5],[8.8,8.7,8.7,8.7,8.8,8.8,8.7,8.7,8.8,8.8],[9,8.9,8.9,8.9,8.9,8.9,8.9,8.9,8.9,8.9],[9.1,9.1,9,9,9,9.1,9.2,9.2,8.9,8.9],[9.5,9.4,9,9,9,8.9,8.9,8.9,8.9,9],[9.9,9.5,8.9,8.9,8.9,8.8,8.8,8.8,8.9,9],[11.6,11,10.3,9.5,9.1,8.9,8.8,8.8,8.9,9],[14.4,14.2,14.1,13.1,12,11,9.9,9,9.1,9.5],[15.6,16,15.5,14.3,13.2,12.3,11.6,10.7,12,13.4],[15.9,16.8,17.1,16.5,15.8,15.2,14.5,14.4,13.7,14.9],[16.6,17.3,18.9,19.4,18.8,18.1,17.5,16.7,15.9,16.4],[16.8,17.5,20.1,21.7,21.7,21.1,20.6,18.4,17.1,17.2],[17.5,19.2,23.3,23.5,23.6,23.4,23.2,23,20.7,17.7],[21.8,21.5,23.4,23.4,23.4,23.4,23.2,23.4,23.5,18.1]]}
const XC = 1.2 // the deck's and the arch's centre line, east of the outline's centroid
const gnd = (u: number, y: number) => Math.max(0, groundAt(GROUND, u + XC, y))

// Upper roadway on the centre line (bridge_ele.py measure, lidar lower quartile; NAVD88 − 174.54).
const road = piecewise([
  [-420, 29.1], [-404, 29.41], [-388, 29.89], [-368, 30.4], [-317, 31.8], [-267, 33.1], [-217, 34.3], [-167, 35.6], [-117, 37.05], [-92, 37.43],
  [-67, 37.47], [-42, 37.24], [-17, 36.67], [14, 35.71], [64, 34.11], [114, 32.54], [164, 30.94], [214, 29.39], [264, 27.79],
  [310, 26.33], [360, 24.74], [393, 23.64], [400, 23.4],
])

const END_W = -404, END_E = 393                 // where the deck lands: lidar roadway meets bare earth (west), the outline's end (east)
const MAIN = [-164, 16]                       // the river span's piers
const PIERS_W = [-344, -308, -272, -236, -200] // concrete-arch piers, west
const PIERS_E = [70, 124, 178, 232, 286, 340] // and east
const EDGE = 14.3                             // upper deck edge (the 1969 widening cantilevers out to here)
const WALL = 12.4                             // the arcade wall's face (the original deck edge)
const LOWER = 7.4                             // lower (streetcar) deck floor, below the road
const PH = 3.2, MPH = 6.0                     // pier half-lengths along the bridge: arch piers, main piers
const AX = 8.3                                // steel arch planes either side of the centre line
const CROWN = 59.6                            // the arch's top at mid span (lidar 59.6; published 196 ft)
const YA = MAIN[0] + MPH, YB = MAIN[1] - MPH, YM = (MAIN[0] + MAIN[1]) / 2
const SIDES = [-1, 1]
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

const conc = new Part(), shade = new Part(), steel = new Part(), lamps = new Part()

/** A one-sided band in the plane u = const (double-sided material) between two curves. */
function wallBand(p: Part, u: number, ys: number[], top: (y: number) => number, bot: (y: number) => number) {
  const s = Math.sign(u) || 1
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    face(p, [u, a, bot(a)], [u, b, bot(b)], [u, b, top(b)], [u, a, top(a)], [s, 0, 0])
  }
}
/** A horizontal strip from u0 to u1 following z(y), facing up or down. */
function flat(p: Part, u0: number, u1: number, ys: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    face(p, [u0, a, z(a)], [u1, a, z(a)], [u1, b, z(b)], [u0, b, z(b)], norm([0, up ? -(z(b) - z(a)) : z(b) - z(a), up ? b - a : -(b - a)]))
  }
}

// ---- Upper deck: parapets, fascia, soffit -------------------------------------------------------
{
  const ys = stations(END_W, END_E, 26)
  for (const s of SIDES) {
    wallBand(conc, s * EDGE, ys, (y) => road(y) + 1.1, (y) => road(y) - 1.3)      // parapet and fascia, one face
    flat(conc, s * (EDGE - 0.35), s * EDGE, ys, (y) => road(y) + 1.1, true)         // parapet coping
  }
  flat(conc, -EDGE, EDGE, ys, (y) => road(y) - 1.3, false)                          // underside of the upper deck
}

// ---- Concrete arch spans: ribs, spandrel columns, the arcade of the lower deck ---------------------
const archSpans: [number, number][] = []
const westP = [...PIERS_W, MAIN[0]], eastP = [MAIN[1], ...PIERS_E, END_E]
for (let i = 0; i < westP.length - 1; i++) archSpans.push([westP[i] + (i === 0 ? PH : PH), westP[i + 1] - (i === westP.length - 2 ? MPH : PH)])
for (let i = 0; i < eastP.length - 1; i++) archSpans.push([eastP[i] + (i === 0 ? MPH : PH), eastP[i + 1] - (i === eastP.length - 2 ? 0 : PH)])

for (const [a, b] of archSpans) {
  const L = b - a, m = (a + b) / 2
  const crown = road(m) - LOWER - 1.6                         // arch intrados at the crown
  for (const s of SIDES) {
    const uo = s * WALL
    const za = Math.max(gnd(uo, a), 0), zb = Math.max(gnd(uo, b), 0)
    const intra = (y: number) => {
      const t = (2 * (y - a)) / L - 1, zs = t < 0 ? za : zb
      return crown - (crown - zs) * (1 - Math.sqrt(Math.max(0, 1 - t * t)))
    }
    const ys = stations(a, b, L / 10)
    // Rib: its face and its soffit (the barrel's underside, 3 m wide).
    if (crown - Math.max(za, zb) > 4) {
      wallBand(conc, uo, ys, (y) => intra(y) + 2.6 + 1.6 * Math.abs((2 * (y - a)) / L - 1) ** 2, intra)
      flat(conc, s * (WALL - 3.0), uo, ys, intra, false)
    } else {
      // Too little room for an arch: a wall from the ground.
      footedWall(conc, [uo, a], [uo, b], gnd, (_x, y) => road(y) - LOWER, [s, 0, 0], 5)
    }
    // Spandrel columns from the rib up to the lower deck, under every second bay of the arcade.
    const bays = Math.max(4, Math.round(L / 3.6)), bw = L / bays
    for (let k = 1; k < bays; k++) {
      const y = a + k * bw
      const z0 = intra(y) + 2.4, z1 = road(y) - LOWER
      if (z1 - z0 > 1.2 && crown - Math.max(za, zb) > 4) face(conc, [uo, y - 0.6, z0], [uo, y + 0.6, z0], [uo, y + 0.6, z1], [uo, y - 0.6, z1], [s, 0, 0])
    }
    // The arcade wall of the lower deck, with a round-headed opening in every bay.
    wallBand(conc, uo, [a, m, b], (y) => road(y) - 1.3, (y) => road(y) - LOWER - 0.6)
    for (let k = 0; k < bays; k++) {
      const yc = a + (k + 0.5) * bw, hw = Math.min(1.8, bw * 0.36), z0 = road(yc) - LOWER + 0.4, zs = road(yc) - 2.3 - hw
      const u = uo + s * 0.05, n: V3 = [s, 0, 0]
      face(shade, [u, yc - hw, z0], [u, yc + hw, z0], [u, yc + hw, zs], [u, yc - hw, zs], n)
      const head: V3[] = [0, 1, 2, 3].map((j) => { const t = Math.PI - (Math.PI * j) / 3; return [u, yc + hw * Math.cos(t), zs + hw * Math.sin(t)] as V3 })
      for (let j = 0; j < 3; j++) {
        const c: V3 = [u, yc, zs]
        const g = [head[j], head[j + 1]]
        if (s > 0) shade.tri(c, g[1], g[0]); else shade.tri(c, g[0], g[1])
      }
    }
  }
  // Floor of the lower deck between the arcade walls (seen from below).
  flat(conc, -WALL, WALL, [a, m, b], (y) => road(y) - LOWER - 0.6, false)
}
// The solid west abutment, from the first arch pier to where the deck lands on the ground at y = -404
// (16 m past the outline's end): its side walls under the deck edges down to the terrain, and the
// abutment's end face across the deck, its top 0.3 m under the roadway.
const above = (top: (x: number, y: number) => number) => (x: number, y: number) => Math.max(top(x, y), gnd(x, y) + 0.05)
for (const s of SIDES) footedWall(conc, [s * EDGE, END_W], [s * EDGE, PIERS_W[0] - PH], gnd, above((_x, y) => road(y) - 1.3), [s, 0, 0], 4)
footedWall(conc, [-EDGE, END_W], [EDGE, END_W], gnd, above((_x, y) => road(y) - 0.3), [0, -1, 0], 4)
for (const s of SIDES) face(conc, [s * (EDGE - 0.35), END_W, road(END_W) - 0.3], [s * EDGE, END_W, road(END_W) - 0.3], [s * EDGE, END_W, road(END_W) + 1.1], [s * (EDGE - 0.35), END_W, road(END_W) + 1.1], [0, -1, 0])

// ---- Piers: tall transverse walls to the deck, with pilasters on the faces ------------------------
for (const [yc, hy] of [...PIERS_W.map((y) => [y, PH]), ...PIERS_E.map((y) => [y, PH]), [MAIN[0], MPH], [MAIN[1], MPH]] as [number, number][]) {
  footedLoft(conc, gnd, [
    { plan: chamferedRect(-WALL - 0.9, WALL + 0.9, yc - hy, yc + hy, 0.6), z: 'ground' },
    { plan: chamferedRect(-WALL - 0.9, WALL + 0.9, yc - hy, yc + hy, 0.6), z: road(yc) - 1.3 },
  ], 7)
}

// ---- The river span: two steel arch trusses, the upper deck hung through them ----------------------
{
  const N = 16, nodes = stations(YA, YB, (YB - YA) / N)
  const top = parabola([YA, road(YA) + 1.5], [YM, CROWN], [YB, road(YB) + 1.5])
  const bot = parabola([YA, 21.5], [YM, CROWN - 7.5], [YB, 21.5])
  for (const s of SIDES) {
    const u = s * AX, n: V3 = [s, 0, 0]
    // Chords: a deep face for each, and its top or underside.
    wallBand(steel, u, nodes, top, (y) => top(y) - 1.6)
    flat(steel, u - 0.6, u + 0.6, nodes, top, true)
    wallBand(steel, u, nodes, (y) => bot(y) + 1.4, bot)
    flat(steel, u - 0.6, u + 0.6, nodes, bot, false)
    nodes.forEach((y, i) => {
      if (i > 0 && i < N) strip(steel, [u, y, bot(y) + 1.2], [u, y, top(y) - 1.4], 0.75, n)
      if (i < N) {
        const y2 = nodes[i + 1], [ya, yb] = y + y2 < 2 * YM ? [y2, y] : [y, y2]
        strip(steel, [u, ya, bot(ya) + 1.2], [u, yb, top(yb) - 1.4], 0.6, n)
      }
      // Hangers from the lower chord down to the deck where the chord is above it.
      if (bot(y) > road(y) + 2) strip(steel, [u, y, road(y) - 1.0], [u, y, bot(y)], 0.4, n)
    })
    // End posts on the main piers.
    for (const y of [YA, YB]) strip(steel, [u, y, 21.5], [u, y, top(y)], 1.4, n)
  }
  // Overhead struts and bracing between the arch planes, where they are above the deck.
  nodes.forEach((y, i) => {
    if (top(y) < road(y) + 9) return
    const z = top(y) - 0.8
    if (i % 2 === 0) strip(steel, [-AX, y, z], [AX, y, z], 0.9, [0, 0, 1])
    if (i < N && top(nodes[i + 1]) > road(nodes[i + 1]) + 9) {
      const y2 = nodes[i + 1], z2 = top(y2) - 0.8
      strip(steel, [-AX, y, z], [AX, y2, z2], 0.5, [0, 0, 1])
    }
  })
  // The lower (streetcar) deck's truss inside the arch, and the upper deck's girders, as faces.
  const ys = stations(YA, YB, (YB - YA) / 8)
  for (const s of SIDES) wallBand(shade, s * (AX - 0.8), ys, (y) => road(y) - 1.3, (y) => road(y) - LOWER - 1.2)
  flat(steel, -AX, AX, ys, (y) => road(y) - LOWER - 1.2, false)
}

// ---- Street lights on the parapets ---------------------------------------------------------------
for (const y of stations(END_W + 15, END_E - 15, 46)) for (const s of SIDES) bead(lamps, [s * (EDGE - 0.4), y, road(y) + 9.5], 0.6, true)

// ---- Write -----------------------------------------------------------------------------------------
for (const p of [conc, shade, steel, lamps]) for (let i = 0; i < p.pos.length; i += 3) p.pos[i] += XC
const CONC: MaterialSpec = { ...finish('bridge-concrete', 0xe8e3d8), doubleSided: true, floodlight: (_p, n) => (n[2] > 0.7 ? 0.3 : 0.85) }
const SHADE: MaterialSpec = { ...finish('arcade-shade', 0x767c80), doubleSided: true }
const STEEL: MaterialSpec = { ...finish('arch-steel', 0xb4bec5), doubleSided: true, floodlight: () => 0.6 }
const LAMP: MaterialSpec = { name: 'lamp', color: 0xe6e0cf }
const parts = [{ part: conc, material: CONC }, { part: shade, material: SHADE }, { part: steel, material: STEEL }, { part: lamps, material: LAMP }]
console.log(parts.map((q) => `${q.material.name} ${q.part.triangles}`).join(', '))
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('Detroit–Superior Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river (174.54 m NAVD88)',
  bearing: 47.87, elevation: 0, deckCentre: XC, mainPiers: MAIN, roadway: { west: road(END_W), crest: road(-67), east: road(END_E) },
})
if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
await Bun.write(new URL('../models/cle-detroit-superior-bridge.glb', import.meta.url), glb)
console.log(`cle-detroit-superior-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
