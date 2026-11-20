/**
 * Hennepin Avenue Bridge (Father Louis Hennepin Bridge), Minneapolis (1990;
 * the third suspension bridge on the site, styled after the 1891 one) —
 * procedural, CC0-1.0, no textures.
 * bun generators/msp-hennepin-avenue-bridge.ts
 *
 * A self-anchored suspension bridge carrying Hennepin Avenue over the
 * Mississippi's main channel from downtown to Nicollet Island. One placement
 * for the whole structure: the two towers (three buff concrete posts joined
 * by two semicircular-arched portal beams, green lantern caps), four main
 * cables (one through each outer post, two either side of the centre post,
 * on the median) anchored into the deck ends, the teal plate-girder fascias
 * and the deck's underside, the buff parapets with the green railing, the
 * sidewalks and the round overlooks on corbels round the outer posts, the
 * raised median, the SW approach bents over First Bridge Park and both
 * abutments. Writes a low model (railings as solid bands, no suspenders) and
 * a detail model (suspenders, railings as rails on posts, parapet pilasters,
 * the beams' corbel tables, the median lamp standards), drawn from z16.
 *
 * Frame: x across the bridge (+x downstream, SE), y along it toward Nicollet
 * Island (NE), z up, metres. Placed at bearing 58.5, the line between the
 * two towers' centre posts (lidar), anchor -93.2638476, 44.9853225, midway
 * between them. z = 0 is the river, the map's Mapterhorn terrain over the
 * water (243.88 m; lidar water 243.90 m). Feet on land run down to the map's
 * terrain vertex by vertex (GROUND, Mapterhorn z15, 5 m in this frame); the
 * tower piers' footings carry on, hidden, to z = 0 so the lowest point is the
 * river level the map grounds the model on (nothing of the bridge stands in
 * the water: both towers are on the banks, 3 m up).
 *
 * The map owns the roadways: nothing here is a slab at road level between
 * the curbs (|x| < 16.8 m, less the median). The model owns the sidewalks
 * and overlooks (highway=footway/path), surfaces included.
 *
 * Roadway built to (lidar, tools/bridge_ele.py measure on both carriageways
 * and both sidewalks, MN_CentralMissRiver_4_B22; heights above 243.88 m):
 * 10.87 m at the SW abutment, a 0.45 % grade to 11.13 m at the SW cable
 * anchorage, a sag, 12.0 m at both towers, a 13.27 m crest near mid-span,
 * 10.93 m at the NE end of the OSM bridge ways and 10.48 m where the deck
 * lands on the Nicollet Island bank (y = 139). Sidewalks 0.2 m higher. OSM
 * has no node between y = -137 and the NE end, so the map draws the main span
 * flat about 2.3 m low at the crest; `ele` for 29 nodes (11 new) is proposed
 * in landmarks-scratch/osm-ele/msp-hennepin-avenue-bridge.osc and .md
 * (+0.754 m, GEOID18 to EGM96), not uploaded.
 *
 * Ends. SW: the deck lands on the downtown bank (road 254.75 m against bare
 * earth 254.75 m at the end nodes); the abutment is a stone face along the
 * skewed line where the bank drops 6 m to First Bridge Park, from the ground
 * to 0.3 m under the roadway. NE: OSM's outline and bridge ways stop at
 * y = 126.1, 4 m over the ground, but the lidar shows the deck structure (no
 * ground returns under it) and the cable anchorages running on to y ≈ 139,
 * where the road meets the bare earth. So the model runs to 139: an
 * abutment face under the girders at 126.1 and side walls from there to 139
 * down to the terrain; no top is drawn there, so the map's road shows. The
 * map draws that 13 m of road on its terrain, up to 4.4 m under the true
 * road (doubt below).
 *
 * Replaces: the man_made=bridge outline way/424129526 (OSM has no building,
 * pier or tower parts on this bridge).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/424129526
 *   (bridge:structure=suspension, start_date 1990, Q1605373), its overlook
 *   bulges round the outer posts (to ±28.9 m) and the SW flare; the roadways
 *   23113479/23113477, sidewalks 151368610/117219838/151368641 and the
 *   overlook loops 151368643, 184096044–6.
 * - Lidar (measured; USGS 3DEP MN_CentralMissRiver_4_B22, flown about 2022;
 *   1 m over the bridge, 0.5 m over each tower): posts at x = -21.4, 0.1,
 *   21.6 (west) and -21.6, -0.1, 21.4 (east), 190.3 m apart; post tops
 *   42.6 m, portal beam tops 39.0 m (2 m thick); main cables a parabola
 *   16.35 + 2.625e-3·y² (cable tops minus the radius; 40.1 m at the towers),
 *   the side spans straight down to the deck at y = -137.4 and +137.7; the
 *   railing 1.5 m over the sidewalk; the median 0.8 m high, 3.2 m wide; lamp
 *   standards on the median about every 48 m, about 11 m tall.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 58.5, 5 m).
 * - Published (Wikipedia, "Hennepin Avenue Bridge"): opened 1990, main span
 *   625 ft (190.5 m), styled after the 1891 suspension bridge.
 * Photos (evidence, Wikimedia Commons):
 * - prakope, "HennepinAveBridge.jpg", CC BY-SA 2.0 (whole bridge from
 *   downstream: proportions, cable sag, the deck band):
 *   https://commons.wikimedia.org/wiki/File:HennepinAveBridge.jpg
 * - Michael Hicks, "Hennepin Avenue Bridge 5492.jpg", CC BY 2.0 (the NE
 *   tower from upstream: semicircular portals, lantern caps, the teal fascia
 *   and railing, piers under the deck):
 *   https://commons.wikimedia.org/wiki/File:Hennepin_Avenue_Bridge_5492.jpg
 * - Tony Webster, "Hennepin Avenue Bridge (15809429592).jpg", CC BY 2.0 (the
 *   west tower from below: overlook on its flared corbel and square stone
 *   pier, the beams' corbel tables, posts continuing under the deck):
 *   https://commons.wikimedia.org/wiki/File:Hennepin_Avenue_Bridge_(15809429592).jpg
 * - Tony Webster, "Hennepin Avenue Bridge (15622673567).jpg" and
 *   "(15622672157).jpg", CC BY 2.0 (on the deck: three posts, median, lamp
 *   standards): https://commons.wikimedia.org/wiki/File:Hennepin_Avenue_Bridge_(15622673567).jpg
 * - Innotata, "Underneath the Hennepin Avenue Bridge.jpg", CC BY-SA 3.0
 *   (the SW approach: stone-faced piers under concrete arched caps, steel
 *   girders): https://commons.wikimedia.org/wiki/File:Underneath_the_Hennepin_Avenue_Bridge.jpg
 * - SusanLesch, "Hennepin-Bridge-20080926.jpg", CC BY-SA 3.0 (sidewalk,
 *   parapet and railing, cable bands):
 *   https://commons.wikimedia.org/wiki/File:Hennepin-Bridge-20080926.jpg
 * - Chad Davis, "Hennepin Ave Bridge on a beautiful calm night.jpg", CC BY
 *   2.0, and "Minneapolis (49859966826).jpg" (Flickr/Commons), CC BY-SA 2.0
 *   (night: towers floodlit warm, caps glowing teal, lights strung along the
 *   cables, median standards):
 *   https://commons.wikimedia.org/wiki/File:Hennepin_Ave_Bridge_on_a_beautiful_calm_night.jpg
 *
 * Numbers
 * - Posts 3.8 × 4.0 m at the deck tapering to 3.3 × 3.6 m (lidar extents,
 *   photos), a ledge at the cornice, a buff frustum and a small green
 *   lantern pyramid to 43.0 m (lidar 42.6 m reads the cap's flanks).
 * - Portal arches semicircular, crown 3.1 m under the beam top (photo-scaled
 *   from 5492 and 15809429592); cornice 0.6 m; corbel blocks every 1.3 m
 *   (detail, estimated).
 * - Fascia girder down to 3.0 m under the road, buff coping 0.8 m under to
 *   0.5 m over the sidewalk, green railing to 1.5 m over it (photo-scaled;
 *   railing height lidar). Sidewalks |x| 16.8–21.4 m (lidar, OSM).
 * - Overlooks: 6.2 m radius about x = ±22.7 on a flared corbel and a 5.4 m
 *   square stone pier (OSM loops, photo).
 * - Suspenders 24 panels on the main span (7.9 m) and 5 on each side span,
 *   one rod per band where the real ones are pairs (estimated from photos);
 *   cables drawn 0.9 m (low) and 0.68 m (detail) thick.
 * - SW approach bents at y = -137.4 (the cable anchorage) and -163: four
 *   stone piers each under a concrete cap with segmental arches (positions
 *   estimated; the photo shows the form, not the spacing).
 * - Cable anchor housings 1.6 × 4 × 1.5 m on the deck (estimated).
 * - Colours from daylight photos pulled to the palette: buff concrete
 *   #d8c69c, teal girders and railings #4f8884, pale green cables #7fae9f,
 *   lantern caps #5aa08f.
 * - Night: the towers carry _FLOODLIGHT on the posts and beams above the
 *   deck (fading a little upward) and on the piers below; the caps are
 *   `neon-patina` (they glow teal); `lamp` beads along both outer cables at
 *   every suspender band (every other in the low model) and on the median
 *   standards.
 *
 * Doubts
 * - The NE end: the model runs 13 m past OSM's outline to where the lidar
 *   shows the deck landing; the map draws that road on its terrain, up to
 *   4.4 m under the deck there, until OSM's bridge ways are extended.
 * - Under-deck structure (girder depth, bent positions and pier count, the
 *   stair tower at the SW end, which is left to the map) is estimated.
 * - The posts' recessed face panels and the cap lanterns' ribs are left out.
 * - Lamp standards' exact positions are approximate (lidar returns mixed with
 *   the cables).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { bead, chamferedRect, face, footedLoft, groundAt, piecewise, rod, stations, tube, type GroundGrid } from './bridge-kit'

// ---- Frame and the map's terrain -------------------------------------------
// Mapterhorn z15 (tools/terrain.ts grid, bearing 58.5, 5 m), metres above the
// river (243.88 m): rows run along y from y0, columns across x from x0.
const GROUND: GroundGrid = { y0: -215, x0: -45, step: 5, z: [
  [10.2, 10.3, 10.3, 10.4, 10.6, 10.8, 11.0, 11.1, 10.8, 10.7, 10.8, 10.8, 10.8, 10.8, 10.7, 10.6, 10.8, 10.8, 10.9],
  [9.8, 10.0, 10.2, 10.3, 10.3, 10.6, 10.9, 11.0, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.7, 10.6, 10.8, 10.9, 11.0],
  [9.5, 9.5, 9.7, 10.0, 10.1, 10.3, 10.9, 11.1, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.7, 10.6, 10.8, 11.0, 11.1],
  [9.4, 9.4, 9.5, 9.8, 10.0, 10.3, 11.0, 11.0, 10.8, 10.8, 10.9, 10.9, 10.8, 10.8, 10.7, 10.7, 10.7, 10.9, 11.1],
  [9.3, 9.3, 9.4, 9.6, 9.8, 10.2, 10.7, 11.0, 10.8, 10.9, 10.9, 10.8, 10.8, 10.8, 10.7, 10.6, 10.7, 10.8, 10.9],
  [8.8, 9.1, 9.3, 9.4, 9.3, 7.7, 5.9, 6.8, 8.6, 10.0, 10.7, 10.8, 10.9, 10.8, 10.7, 10.7, 10.7, 10.8, 10.9],
  [8.5, 8.7, 9.0, 9.2, 8.8, 7.1, 5.3, 5.0, 5.2, 5.3, 5.4, 5.9, 7.4, 8.7, 9.9, 10.2, 10.9, 10.9, 11.0],
  [8.4, 8.6, 8.8, 9.1, 8.0, 6.3, 5.0, 5.0, 5.1, 5.1, 5.1, 5.1, 5.1, 5.0, 5.1, 6.1, 8.7, 10.1, 10.8],
  [8.3, 8.5, 8.7, 8.4, 7.0, 5.4, 4.9, 4.9, 5.0, 4.9, 5.0, 5.0, 5.0, 4.9, 4.8, 4.8, 4.8, 4.8, 5.0],
  [8.1, 8.3, 8.4, 7.5, 5.9, 5.0, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.7, 4.7, 4.7, 4.6],
  [7.9, 8.2, 7.7, 6.3, 5.0, 4.9, 4.8, 4.9, 4.9, 4.9, 4.9, 4.9, 4.8, 4.8, 4.8, 4.6, 4.6, 4.6, 4.6],
  [7.9, 7.7, 6.3, 5.2, 4.9, 4.7, 4.7, 4.9, 5.0, 5.0, 5.0, 4.9, 4.9, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5],
  [7.4, 6.2, 5.2, 4.9, 4.9, 4.8, 4.8, 4.8, 5.0, 5.1, 5.0, 4.9, 4.8, 4.7, 4.8, 4.6, 4.5, 4.5, 4.5],
  [6.1, 5.1, 4.9, 4.9, 5.0, 5.1, 5.1, 5.1, 5.0, 5.1, 5.1, 5.0, 5.0, 5.1, 5.0, 4.7, 4.5, 4.4, 4.5],
  [4.9, 4.7, 4.8, 4.8, 4.9, 5.1, 5.1, 5.1, 5.1, 5.2, 5.1, 5.1, 5.1, 5.1, 5.0, 4.8, 4.6, 4.4, 4.4],
  [4.5, 4.5, 4.8, 4.7, 4.8, 4.9, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.8, 4.9, 4.8, 4.6, 4.5, 4.4, 4.4],
  [4.7, 4.7, 4.7, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4],
  [4.4, 4.4, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.4, 4.4, 4.3, 4.3, 4.3, 4.3, 4.3, 4.3, 4.4, 4.3, 4.3],
  [4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.6, 4.5, 4.5, 4.4, 4.4, 4.4, 4.4, 4.3, 4.3, 4.3, 4.2, 4.3, 4.3],
  [4.5, 4.5, 4.6, 4.6, 4.6, 4.5, 4.3, 4.1, 3.8, 3.6, 3.7, 4.0, 4.2, 4.3, 4.3, 4.3, 4.2, 4.2, 4.2],
  [4.5, 4.6, 4.5, 4.3, 4.0, 3.8, 3.6, 3.6, 3.5, 3.5, 3.5, 3.4, 3.4, 3.6, 4.1, 4.3, 4.3, 4.2, 4.1],
  [4.5, 4.4, 4.2, 4.0, 3.8, 3.7, 3.6, 3.5, 3.4, 3.4, 3.4, 3.4, 3.5, 3.4, 3.4, 3.8, 4.3, 4.3, 4.2],
  [4.4, 4.2, 3.5, 3.3, 3.4, 3.5, 3.5, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.3, 3.6, 4.2, 4.3],
  [3.9, 3.2, 2.9, 3.0, 3.1, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.1, 3.2, 3.4, 3.9, 4.3],
  [3.1, 3.0, 3.0, 2.9, 2.9, 3.0, 3.0, 3.0, 3.1, 3.3, 3.0, 3.1, 3.1, 3.1, 3.1, 3.3, 3.6, 4.0, 4.3],
  [0.3, 2.2, 2.6, 2.9, 2.9, 2.9, 3.0, 3.1, 3.1, 3.2, 3.1, 3.1, 3.1, 3.1, 3.2, 3.5, 3.9, 4.2, 4.3],
  [0.1, 0.1, 0.3, 0.7, 0.8, 1.8, 2.4, 2.4, 2.6, 3.2, 2.6, 2.7, 2.9, 3.2, 3.4, 3.7, 4.0, 4.1, 4.3],
  [0.1, 0.1, 0.1, 0.1, 0.3, 0.3, 0.5, 0.6, 1.1, 1.1, 1.1, 0.9, 1.3, 3.2, 3.4, 3.7, 3.9, 4.0, 4.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.2, 0.8, 2.3, 3.1, 3.4],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [1.8, 1.3, 0.8, 0.3, 0.1, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.8, 5.0, 4.4, 3.7, 2.9, 2.1, 1.2, 0.9, 1.0, 1.1, 0.5, 0.3, 0.3, 0.5, 0.1, 0.0, 0.0, 0.0, 0.0],
  [7.9, 7.6, 6.4, 4.9, 3.6, 2.6, 2.3, 2.2, 2.3, 2.5, 1.9, 1.8, 1.7, 2.0, 2.2, 1.9, 1.9, 1.9, 0.9],
  [7.4, 7.6, 6.8, 5.2, 3.6, 2.8, 2.8, 2.8, 2.7, 2.7, 2.7, 2.6, 2.6, 2.6, 2.8, 3.1, 3.2, 3.3, 3.1],
  [5.8, 6.2, 6.2, 5.4, 3.6, 3.0, 2.9, 2.9, 2.9, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 3.1, 3.3, 3.4, 3.4],
  [4.6, 4.6, 4.7, 4.8, 3.6, 3.1, 3.1, 3.0, 3.0, 3.0, 3.0, 3.0, 2.9, 2.8, 2.9, 3.0, 3.2, 3.3, 3.4],
  [4.2, 3.9, 3.7, 3.6, 3.4, 3.3, 3.2, 3.2, 3.1, 3.1, 3.1, 3.1, 3.0, 3.0, 2.9, 3.0, 3.1, 3.1, 3.2],
  [4.2, 3.8, 3.6, 3.5, 3.3, 3.2, 3.1, 3.1, 3.1, 3.0, 3.0, 3.0, 3.0, 2.9, 2.9, 2.9, 2.8, 2.8, 2.9],
  [5.5, 4.5, 3.9, 3.6, 3.4, 3.3, 3.2, 3.2, 3.1, 3.1, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.9, 2.9, 3.0],
  [7.3, 6.3, 5.6, 5.0, 4.3, 4.0, 4.2, 4.2, 4.2, 4.2, 4.2, 4.1, 4.1, 4.0, 4.0, 3.6, 3.6, 3.5, 3.4],
  [7.8, 7.7, 7.3, 6.5, 5.7, 5.5, 5.7, 5.7, 5.7, 5.7, 5.7, 5.7, 5.6, 5.6, 5.4, 5.0, 4.2, 3.5, 2.8],
  [7.7, 7.8, 7.5, 6.9, 6.6, 6.5, 6.6, 6.6, 6.6, 6.5, 6.6, 6.7, 6.8, 6.7, 6.5, 6.4, 5.1, 4.1, 3.6],
  [7.5, 7.6, 7.5, 7.6, 8.0, 8.0, 8.1, 8.1, 8.1, 8.1, 8.1, 8.2, 8.2, 8.1, 8.0, 7.7, 5.8, 4.3, 4.0],
  [7.5, 7.6, 7.5, 8.3, 9.4, 9.6, 9.7, 9.7, 9.7, 9.7, 9.7, 9.7, 9.7, 9.6, 9.5, 8.5, 6.6, 4.3, 4.2],
  [7.5, 7.6, 7.5, 8.7, 10.3, 10.6, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.6, 10.4, 8.8, 6.9, 4.4, 4.4],
  [7.5, 7.6, 7.7, 8.8, 10.2, 10.5, 10.2, 10.3, 10.3, 10.3, 10.3, 10.2, 10.1, 10.4, 10.2, 8.8, 7.0, 4.7, 4.6],
  [7.5, 7.6, 7.8, 8.7, 10.0, 10.2, 10.0, 10.1, 10.1, 10.2, 10.0, 10.1, 10.0, 10.1, 10.0, 8.7, 7.0, 4.9, 4.7],
  [7.4, 7.6, 7.9, 8.6, 9.8, 10.0, 9.8, 9.9, 9.9, 10.0, 9.9, 9.9, 9.8, 9.8, 9.8, 8.6, 6.9, 5.3, 4.9],
  [7.4, 7.5, 7.9, 8.5, 9.6, 9.8, 9.6, 9.7, 9.7, 10.0, 9.7, 9.7, 9.7, 9.7, 9.6, 8.5, 6.8, 5.6, 5.1],
] }
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- The roadway (lidar, metres above the river) ----------------------------
// tools/bridge_ele.py measure on both carriageways (ways 23113479, 23113477
// and their approaches), every 20 m; the two agree within 0.03 m, so this is
// their mean. 254.75 m NAVD88 at the SW abutment, a crest of 257.15 m near
// midspan, 254.8 m at the NE end of the OSM bridge ways, landing on the
// Nicollet Island bank at about y = 139.
const road = piecewise([
  [-212, 10.79], [-192, 10.87], [-176, 10.95], [-161, 11.02], [-146, 11.08], [-136.6, 11.13],
  [-116.6, 11.37], [-96.5, 11.97], [-76.5, 12.50], [-56.4, 12.85], [-36.4, 13.11], [-16.4, 13.23],
  [3.7, 13.27], [23.7, 13.21], [43.7, 13.03], [63.8, 12.73], [83.8, 12.32], [103.8, 11.72],
  [123.9, 11.01], [126.1, 10.93], [146.1, 10.23], [166, 9.54],
])
const walk = (y: number) => road(y) + 0.2 // sidewalks: lidar 0.2 m over the road
const GIRDER = 3.0 // fascia girder bottom under the road (photo-scaled)

// ---- Plan ----------------------------------------------------------------------
const TY = 95.14 // tower centre lines (lidar post centroids; 190.3 m main span)
const PX = 21.5 // outer posts and cables either side of the axis (lidar)
const CX = 1.0 // the two centre cables, either side of the centre post (lidar)
const EDGE = 22 // deck edge (lidar railing and cable planes; OSM outline ±19–22)
const Y_NE = 139 // the deck lands on the Nicollet Island bank (lidar bare earth reaches the road)
const Y_ABUT = 126.1 // NE abutment face: the end of OSM's bridge ways and outline
const ANCHOR_SW = -137.4, ANCHOR_NE = 137.7 // where the cables meet the deck (lidar)
const BENTS = [-137.4, -163] // SW approach bents (the first is the cables' anchor pier)
/** The deck's left edge: the SB sidewalk curves in toward Hennepin Avenue at the SW end (OSM outline). */
const xl = piecewise([[-191, -13.5], [-174.5, -16.6], [-165, -18.4], [-147, -20.4], [-138, -EDGE]])
/** The right edge flares out toward the stair to the park at the SW end (OSM outline). */
const xr = piecewise([[-184, 26.5], [-164, 22.6], [-155, EDGE]])
/** The SW abutment face, skewed like the outline's end (map terrain drops to the park here). */
const yAbut = (x: number) => -187.5 + 0.2 * x
const yStart = (x: number) => yAbut(x)

// ---- Materials -------------------------------------------------------------------
// The towers are floodlit warm at night, deck to cap (night photos); their
// green caps glow teal, so they are `neon`; lights are strung along the outer
// cables and on the median poles.
const towerLit = (p: V3, n: V3) => {
  if (Math.abs(Math.abs(p[1]) - TY) > 8 || p[2] < walk(TY) - 6) return 0
  const up = n[2] > 0.7 ? 0.3 : 1
  return up * (p[2] >= walk(TY) ? 1 - 0.25 * Math.min(1, (p[2] - walk(TY)) / 30) : 0.6)
}
const CONCRETE: MaterialSpec = { ...finish('buff-concrete', 0xd8c69c), floodlight: towerLit }
const WALKMAT: MaterialSpec = finish('concrete-walk', 0xcfcbc2)
const CABLE: MaterialSpec = { ...finish('cable-green', 0x7fae9f), doubleSided: true }
const GIRDERMAT: MaterialSpec = finish('girder-teal', 0x4f8884)
const CAPS: MaterialSpec = finish('neon-patina', 0x5aa08f)
const LAMP: MaterialSpec = finish('lamp', 0x4a5650)

type Set = { stone: Part; walk: Part; cable: Part; girder: Part; caps: Part; lamp: Part }
const newSet = (): Set => ({ stone: new Part(), walk: new Part(), cable: new Part(), girder: new Part(), caps: new Part(), lamp: new Part() })

const norm2 = (x: number, y: number): [number, number] => { const l = Math.hypot(x, y) || 1; return [x / l, y / l] }

/**
 * A vertical surface along a plan polyline, from bot(x, y) to top(x, y),
 * facing `side` (+1: to the right of the direction of travel).
 */
function wall(p: Part, line: [number, number][], top: (x: number, y: number) => number, bot: (x: number, y: number) => number, side: number) {
  for (let i = 0; i + 1 < line.length; i++) {
    const [xa, ya] = line[i], [xb, yb] = line[i + 1]
    const [tx, ty] = norm2(xb - xa, yb - ya), n: V3 = [ty * side, -tx * side, 0]
    const ba = bot(xa, ya), bb = bot(xb, yb), ta = top(xa, ya), tb = top(xb, yb)
    if (Math.max(ta - ba, tb - bb) <= 0.01) continue
    face(p, [xa, ya, ba], [xb, yb, bb], [xb, yb, Math.max(tb, bb)], [xa, ya, Math.max(ta, ba)], n)
  }
}
/** A horizontal-ish strip between two plan polylines of the same length, at heights z(x, y), facing up or down. */
function sheet(p: Part, a: [number, number][], b: [number, number][], z: (x: number, y: number) => number, up: boolean) {
  for (let i = 0; i + 1 < a.length; i++) {
    const q: V3[] = [[a[i][0], a[i][1], z(...a[i])], [b[i][0], b[i][1], z(...b[i])], [b[i + 1][0], b[i + 1][1], z(...b[i + 1])], [a[i + 1][0], a[i + 1][1], z(...a[i + 1])]]
    face(p, q[0], q[1], q[2], q[3], [0, 0, up ? 1 : -1])
  }
}
/** Stations along the deck between y0 and y1, adding the given breaks. */
function ys(y0: number, y1: number, step: number, breaks: number[] = []) {
  return [...new Set([...stations(y0, y1, step), ...breaks.filter((b) => b > y0 && b < y1)].map((v) => Math.round(v * 1000) / 1000))].sort((a, b) => a - b)
}
/** A line at a fixed offset `off` inside the deck edge on one side (-1 left, +1 right). */
function edgeLine(side: number, off: number, y0: number, y1: number, step: number, breaks: number[] = []): [number, number][] {
  return ys(y0, y1, step, breaks).map((y) => [side < 0 ? xl(y) + off : xr(y) - off, y] as [number, number])
}
/** The y where the edge line on `side` meets the SW abutment face. */
function edgeStart(side: number, off: number): number {
  let y = -190
  for (let k = 0; k < 20; k++) y = yStart(side < 0 ? xl(y) + off : xr(y) - off)
  return y
}

// ---- A segmental arch between two faces, as a beam of thickness 2·ht -------
function archBeam(p: Part, xa: number, xb: number, yc: number, ht: number, top: number, spring: number, rise: number, seg: number) {
  const c = xb - xa, R = (c * c / 4 + rise * rise) / (2 * rise), cx = (xa + xb) / 2, cz = spring + rise - R
  const half = Math.asin(Math.min(1, c / 2 / R))
  const pts = Array.from({ length: seg + 1 }, (_, k) => {
    const a = -half + (2 * half * k) / seg
    return [cx + R * Math.sin(a), cz + R * Math.cos(a)] as [number, number]
  })
  for (let k = 0; k < seg; k++) {
    const [x0, z0] = pts[k], [x1, z1] = pts[k + 1]
    for (const s of [-1, 1]) face(p, [x0, yc + s * ht, z0], [x1, yc + s * ht, z1], [x1, yc + s * ht, top], [x0, yc + s * ht, top], [0, s, 0])
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2
    face(p, [x0, yc - ht, z0], [x1, yc - ht, z1], [x1, yc + ht, z1], [x0, yc + ht, z0], [cx - mx, 0, cz - mz])
  }
  face(p, [xa, yc - ht, top], [xb, yc - ht, top], [xb, yc + ht, top], [xa, yc + ht, top], [0, 0, 1])
}

// ---- Towers ----------------------------------------------------------------------
const POST_TOP = 40.8 // shaft top (lidar post tops 42.6 at the caps)
const CAP_TOP = 43.0
const BEAM_TOP = 39.0 // lidar
const SPRING = 26.95, CROWN = 35.9 // the portal arches: semicircles, crown 3.1 m under the beam top (photo-scaled)
function post(s: Set, x: number, yc: number, detail: boolean) {
  const S = walk(yc)
  const r = (hx: number, hy: number, z: number | 'ground') => ({ plan: chamferedRect(x - hx, x + hx, yc - hy, yc + hy, 0.45), z })
  const outer = Math.abs(x) > 5
  const rings = [
    ...(outer ? [r(1.9, 2.0, S - 0.2)] : [r(2.2, 2.2, 'ground'), r(2.2, 2.2, S - GIRDER - 0.4), r(1.95, 2.05, S - GIRDER)]),
    r(1.9, 2.0, S), r(1.75, 1.9, SPRING), r(1.7, 1.85, BEAM_TOP - 0.6),
    // a ledge where the beam's cornice meets the post
    r(1.95, 2.05, BEAM_TOP - 0.6), r(1.95, 2.05, BEAM_TOP), r(1.65, 1.8, BEAM_TOP), r(1.65, 1.8, POST_TOP),
  ]
  footedLoft(s.stone, ground, rings, 10, false)
  if (!outer) footing(s, chamferedRect(x - 2.2, x + 2.2, yc - 2.2, yc + 2.2, 0.45))
  // the top: a short buff frustum, then a small green lantern pyramid
  // (photos: the green is only the lantern at the very top)
  const ringAt = (h: number, z: number) => chamferedRect(x - h, x + h, yc - h - 0.12, yc + h + 0.12, 0.3 * h).map(([px, py]) => [px, py, z] as V3)
  const r0 = ringAt(1.65, POST_TOP), r1 = ringAt(1.0, POST_TOP + 0.8), r2 = ringAt(0.85, POST_TOP + 0.8)
  const apex: V3 = [x, yc, CAP_TOP]
  for (let i = 0; i < r0.length; i++) {
    const j = (i + 1) % r0.length
    s.stone.quad(r0[i], r0[j], r1[j], r1[i])
    s.stone.quad(r1[i], r1[j], r2[j], r2[i])
    s.caps.tri(r2[i], r2[j], apex)
  }
}
function tower(s: Set, yc: number, detail: boolean) {
  for (const x of [-PX, 0, PX]) post(s, x, yc, detail)
  for (const sd of [-1, 1]) {
    const xa = sd < 0 ? -PX + 1.72 : 1.72, xb = sd < 0 ? -1.72 : PX - 1.72
    archBeam(s.stone, xa, xb, yc, 1.0, BEAM_TOP - 0.6, SPRING, CROWN - SPRING, detail ? 14 : 10)
    // cornice: a band proud of the beam's faces
    const c = { plan: chamferedRect(xa, xb, yc - 1.25, yc + 1.25, 0), z: BEAM_TOP - 0.6 }
    footedLoft(s.stone, ground, [c, { ...c, z: BEAM_TOP }], 20)
    if (detail) {
      // the corbel table under the cornice: small blocks
      for (const x of stations(xa + 0.6, xb - 0.6, 1.3))
        for (const sy of [-1, 1]) {
          const y0 = yc + sy * 1.0, y1 = yc + sy * 1.2
          footedLoft(s.stone, ground, [
            { plan: chamferedRect(x - 0.3, x + 0.3, Math.min(y0, y1), Math.max(y0, y1), 0), z: BEAM_TOP - 1.4 },
            { plan: chamferedRect(x - 0.3, x + 0.3, Math.min(y0, y1), Math.max(y0, y1), 0), z: BEAM_TOP - 0.6 },
          ], 5, true)
        }
    }
  }
  // the overlook balconies round the outer posts: a round platform on a
  // flared corbel and a stone pier to the ground (photo; OSM footway loops)
  for (const sd of [-1, 1]) {
    const cx = sd * 22.7, S = walk(yc), R = 6.2, n = 12
    const ring = (rad: number, z: number | 'ground') => ({ plan: Array.from({ length: n }, (_, i) => {
      const a = (2 * Math.PI * (i + 0.5)) / n
      return [cx + rad * Math.cos(a), yc + rad * Math.sin(a)] as [number, number]
    }), z })
    // a square stone pier (12 points round a square, so it lofts into the round corbel)
    const sq = (h: number, z: number | 'ground') => ({ plan: Array.from({ length: 12 }, (_, i) => {
      const a = (2 * Math.PI * (i + 0.5)) / 12, c = Math.cos(a), sn = Math.sin(a), m = Math.max(Math.abs(c), Math.abs(sn))
      return [cx + (h * c) / m, yc + (h * sn) / m] as [number, number]
    }), z })
    footedLoft(s.stone, ground, [sq(2.7, 'ground'), sq(2.7, S - 6.5), ring(3.6, S - 5.2), ring(4.6, S - 3.2), ring(R, S - 1.4), ring(R, S - 0.05)], 4, false)
    footing(s, sq(2.7, 0).plan)
    // walking surface over the part outside the deck edge, and its railing
    const arc: [number, number][] = []
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI / 2 + (Math.PI * i) / 8
      arc.push([cx + sd * (R - 0.05) * Math.cos(a) + sd * 0, yc + (R - 0.05) * Math.sin(a)])
    }
    const inner: [number, number][] = arc.map(([, y]) => [sd * EDGE, y])
    sheet(s.walk, sd > 0 ? inner : arc, sd > 0 ? arc : inner, () => S - 0.05, true)
    // the balcony's rim: a buff coping and the green railing (a band; rails and posts in the detail)
    wall(s.stone, sd > 0 ? arc : [...arc].reverse(), () => S + 0.45, () => S - 1.4, 1)
    if (!detail) wall(s.girder, sd > 0 ? arc.map(([x, y]) => [x - sd * 0.25, y] as [number, number]) : [...arc].reverse().map(([x, y]) => [x - sd * 0.25, y] as [number, number]), () => S + 1.4, () => S + 0.45, 1)
    else railing(s, sd > 0 ? arc.map(([x, y]) => [x - sd * 0.25, y] as [number, number]) : [...arc].reverse().map(([x, y]) => [x - sd * 0.25, y] as [number, number]), () => S + 0.45, () => S + 1.4)
  }
}

/**
 * The pier's footing below the bank, down to the river's level: hidden under
 * the map's terrain, it puts the model's lowest point at y = 0 (the river,
 * the lowest ground under the footprint), so a map that grounds a model by
 * its lowest vertices sets it at the right height.
 */
function footing(s: Set, plan: [number, number][]) {
  const loop = [...plan, plan[0]]
  wall(s.stone, loop, (x, y) => ground(x, y), () => 0, 1)
}

// ---- Railing (detail): a top and a bottom rail on posts --------------------
function railing(s: Set, line: [number, number][], bot: (x: number, y: number) => number, top: (x: number, y: number) => number) {
  for (const side of [-1, 1]) {
    wall(s.girder, line, (x, y) => top(x, y), (x, y) => top(x, y) - 0.14, side)
    wall(s.girder, line, (x, y) => bot(x, y) + 0.2, (x, y) => bot(x, y) + 0.06, side)
  }
  // posts, about every 1.6 m, and a diagonal lattice suggested by X braces every other bay
  for (let i = 0; i + 1 < line.length; i++) {
    const [xa, ya] = line[i], [xb, yb] = line[i + 1]
    const L = Math.hypot(xb - xa, yb - ya), n = Math.max(1, Math.round(L / 1.6))
    for (let k = 0; k < n; k++) {
      const t = k / n, x = xa + (xb - xa) * t, y = ya + (yb - ya) * t
      rod(s.girder, [x, y, bot(x, y)], [x, y, top(x, y)], 0.06, 3)
    }
  }
}

// ---- Deck ----------------------------------------------------------------------
const towerGap = (y: number) => Math.abs(Math.abs(y) - TY) < 6.2 // the balconies interrupt the parapets
function deck(s: Set, detail: boolean) {
  const brk = [-TY - 6.2, -TY + 6.2, TY - 6.2, TY + 6.2, Y_ABUT, ...BENTS, ANCHOR_SW, ANCHOR_NE]
  const step = detail ? 5 : 16
  for (const side of [-1, 1]) {
    const y0 = edgeStart(side, 0)
    const outer = edgeLine(side, 0, y0, Y_NE, step, brk)
    // fascia girder (teal) under a buff coping band; past the NE abutment
    // face the edge is the abutment's wall, down to the ground
    const run = (line: [number, number][], f: (y: number) => boolean) => {
      const out: [number, number][][] = []
      let cur: [number, number][] = []
      for (let i = 0; i < line.length; i++) {
        if (f(line[i][1])) cur.push(line[i])
        else if (cur.length) { cur.push(line[i]); out.push(cur); cur = [] }
        if (i + 1 < line.length && !f(line[i][1]) && f(line[i + 1][1])) cur = [line[i]]
      }
      if (cur.length > 1) out.push(cur)
      return out
    }
    const o = side > 0 ? (l: [number, number][]) => l : (l: [number, number][]) => [...l].reverse()
    const girderL = outer.map(([x, y]) => [x - side * 0.25, y] as [number, number])
    for (const seg of run(girderL, (y) => y <= Y_ABUT + 1e-6)) {
      wall(s.girder, o(seg), (x, y) => walk(y) - 0.8, (x, y) => road(y) - GIRDER, 1)
      wall(s.girder, o(seg), (x, y) => road(y) - 1.2, (x, y) => road(y) - GIRDER, -1)
      sheet(s.girder, seg, seg.map(([x, y]) => [x - side * 0.6, y] as [number, number]), (x, y) => road(y) - GIRDER, false)
    }
    for (const seg of run(outer, (y) => y >= Y_ABUT - 1e-6))
      wall(s.stone, o(seg), (x, y) => walk(y) + 0.5, (x, y) => ground(x, y), 1)
    // coping and parapet (buff), with the outer face from the coping's underside
    for (const seg of run(outer, (y) => !towerGap(y))) {
      wall(s.stone, o(seg), (x, y) => walk(y) + 0.5, (x, y) => walk(y) - 0.8, 1)
      const inner = seg.map(([x, y]) => [x - side * 0.6, y] as [number, number])
      wall(s.stone, o(inner), (x, y) => walk(y) + 0.5, (x, y) => walk(y), -1)
      sheet(s.stone, side > 0 ? inner : seg, side > 0 ? seg : inner, (x, y) => walk(y) + 0.5, true)
      const rl = seg.map(([x, y]) => [x - side * 0.3, y] as [number, number])
      if (detail) railing(s, o(rl), (x, y) => walk(y) + 0.5, (x, y) => walk(y) + 1.5)
      else for (const sd of [-1, 1]) wall(s.girder, o(rl), (x, y) => walk(y) + 1.5, (x, y) => walk(y) + 0.5, sd)
    }
    if (detail) {
      // parapet pilasters at each suspender (photo)
      for (const y of suspenderYs()) {
        if (towerGap(y) || y < y0 + 1) continue
        const x = side < 0 ? xl(y) + 0.3 : xr(y) - 0.3
        footedLoft(s.stone, ground, [
          { plan: chamferedRect(x - 0.35, x + 0.35, y - 0.35, y + 0.35, 0.08), z: walk(y) + 0.45 },
          { plan: chamferedRect(x - 0.35, x + 0.35, y - 0.35, y + 0.35, 0.08), z: walk(y) + 1.65 },
        ], 2)
      }
    }
    // the sidewalk (the model's own walkway), from the curb to the parapet
    const curb = edgeLine(side, 5.2, edgeStart(side, 5.2), Y_NE, step, brk)
    for (const seg of run(curb, (y) => !towerGap(y))) {
      const par = seg.map(([x, y]) => [x + side * 4.6, y] as [number, number])
      sheet(s.walk, side > 0 ? seg : par, side > 0 ? par : seg, (x, y) => walk(y), true)
      wall(s.walk, side > 0 ? [...seg].reverse() : seg, (x, y) => walk(y), (x, y) => road(y) - 0.05, 1)
    }
    // round the post, the sidewalk runs out onto the balcony: walk surface between the curb and the post
    for (const yc of [-TY, TY]) {
      const cl: [number, number][] = [[side * 16.8, yc - 6.2], [side * 16.8, yc + 6.2]]
      const pl: [number, number][] = [[side * EDGE, yc - 6.2], [side * EDGE, yc + 6.2]]
      sheet(s.walk, side > 0 ? cl : pl, side > 0 ? pl : cl, (x, y) => walk(y), true)
      wall(s.walk, side > 0 ? [...cl].reverse() : cl, (x, y) => walk(y), (x, y) => road(y) - 0.05, 1)
    }
  }
  // the deck's underside between the girders, facing down
  const yy = ys(-192, Y_ABUT, step, [...BENTS])
  const left: [number, number][] = [], right: [number, number][] = []
  for (const y of yy) {
    let a = xl(y) + 0.6, b = xr(y) - 0.6
    // trim to the SW abutment face
    const xa = (y + 187.5) / 0.2
    if (y < yAbut(a)) a = Math.max(a, xa)
    if (y < yAbut(b)) b = Math.min(b, xa)
    if (b <= a) continue
    left.push([a, y]); right.push([b, y])
  }
  sheet(s.girder, right, left, (x, y) => road(y) - 1.2, false)
  // the raised median between the carriageways (lidar 0.8 m, 3.2 m wide)
  const med = ys(-170, 136, step, [-TY - 2.1, -TY + 2.1, TY - 2.1, TY + 2.1])
  const segs: number[][] = [[]]
  for (const y of med) { if (Math.abs(Math.abs(y) - TY) < 2.1) { if (segs[segs.length - 1].length) segs.push([]) } else segs[segs.length - 1].push(y) }
  for (const sg of segs.filter((q) => q.length > 1)) {
    const L = sg.map((y) => [-1.6, y] as [number, number]), R = sg.map((y) => [1.6, y] as [number, number])
    wall(s.stone, L, (x, y) => road(y) + 0.8, (x, y) => road(y) - 0.05, 1)
    wall(s.stone, R, (x, y) => road(y) + 0.8, (x, y) => road(y) - 0.05, -1)
    sheet(s.stone, R, L, (x, y) => road(y) + 0.8, true)
    for (const [y, d] of [[sg[0], -1], [sg[sg.length - 1], 1]] as [number, number][])
      face(s.stone, [-1.6, y, road(y) - 0.05], [1.6, y, road(y) - 0.05], [1.6, y, road(y) + 0.8], [-1.6, y, road(y) + 0.8], [0, d, 0])
  }
}

// ---- Abutments and approach bents ----------------------------------------------
function supports(s: Set, detail: boolean) {
  // SW abutment: a stone face along the skewed line where the bank drops to
  // the park, from the ground up to just under the roadway
  const line: [number, number][] = stations(xl(-190.5), xr(-182.5), 3).map((x) => [x, yAbut(x)])
  wall(s.stone, line, (x, y) => road(y) - 0.3, (x, y) => ground(x, y), -1)
  // NE abutment face, under the girders where OSM's bridge ways end
  wall(s.stone, stations(-EDGE, EDGE, 3).map((x) => [x, Y_ABUT] as [number, number]), (x, y) => road(y) - GIRDER, (x, y) => ground(x, y), -1)
  // bents: stone piers carrying a concrete cap with segmental arches between
  for (const yb of BENTS) {
    const a = xl(yb) + 1.6, b = xr(yb) - 1.6, n = 4, w = 1.3
    const xs = Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1))
    const top = road(yb) - GIRDER, spring = top - 3.2, ht = yb === BENTS[0] ? 1.8 : 1.3
    for (const x of xs) footedLoft(s.stone, ground, [
      { plan: chamferedRect(x - w, x + w, yb - ht, yb + ht, 0.3), z: 'ground' },
      { plan: chamferedRect(x - w, x + w, yb - ht, yb + ht, 0.3), z: top },
    ], 3)
    for (let i = 0; i + 1 < n; i++) archBeam(s.stone, xs[i] + w, xs[i + 1] - w, yb, ht, top, spring, 1.6, detail ? 10 : 6)
  }
}

// ---- Cables, suspenders, lights --------------------------------------------------
const SAG = 16.35, K = 2.625e-3 // main span: z = SAG + K·y² (lidar; cable tops minus the radius)
const SADDLE = SAG + K * TY * TY
const cableZ = (y: number) => {
  const a = Math.abs(y)
  if (a <= TY) return SAG + K * y * y
  const end = y < 0 ? ANCHOR_SW : ANCHOR_NE, ze = road(end) + 0.8
  return SADDLE + (ze - SADDLE) * (a - TY) / (Math.abs(end) - TY)
}
function suspenderYs(): number[] {
  const main = stations(-TY, TY, (2 * TY) / 24).slice(1, -1)
  const sw = stations(ANCHOR_SW, -TY, (TY + ANCHOR_SW) / -5).slice(1, -1)
  const ne = stations(TY, ANCHOR_NE, (ANCHOR_NE - TY) / 5).slice(1, -1)
  return [...sw, ...main, ...ne]
}
function cables(s: Set, detail: boolean) {
  const r = detail ? 0.34 : 0.45
  for (const x of [-PX, -CX, CX, PX]) {
    const path: V3[] = [[x, ANCHOR_SW, cableZ(ANCHOR_SW)], [x, -TY, SADDLE], ...stations(-TY, TY, detail ? 6 : 19).slice(1, -1).map((y) => [x, y, cableZ(y)] as V3), [x, TY, SADDLE], [x, ANCHOR_NE, cableZ(ANCHOR_NE)]]
    tube(s.cable, path, r, detail ? 8 : 5)
    // the anchor housings where the cables enter the deck (estimated)
    for (const ya of [ANCHOR_SW, ANCHOR_NE]) {
      const d = Math.sign(ya), y0 = ya - d * 0.5, y1 = ya + d * 3.5
      const z0 = Math.abs(x) > 5 ? walk(ya) : road(ya) + 0.8
      footedLoft(s.stone, ground, [
        { plan: chamferedRect(x - 0.8, x + 0.8, Math.min(y0, y1), Math.max(y0, y1), 0.2), z: z0 - 0.1 },
        { plan: chamferedRect(x - 0.8, x + 0.8, Math.min(y0, y1), Math.max(y0, y1), 0.2), z: z0 + 1.4 },
      ], 4)
    }
  }
  const sy = suspenderYs()
  if (detail) for (const x of [-PX, -CX, CX, PX]) for (const y of sy) {
    const z1 = cableZ(y) - 0.25, z0 = Math.abs(x) > 5 ? walk(y) + 0.5 : road(y) + 0.8
    if (z1 - z0 > 0.6) rod(s.cable, [x, y, z0], [x, y, z1], 0.17, 4)
  }
  // cable lights along the outer cables (night photos), at every suspender band; every other in the low model
  for (const x of [-PX, PX]) sy.forEach((y, i) => {
    if (!detail && i % 2) return
    bead(s.lamp, [x, y, cableZ(y) + 0.45], detail ? 0.32 : 0.42, !detail)
  })
  // the median's lamp standards, a head either side (lidar, every ~48 m)
  for (const y of [-120, -72, -24, 24, 72, 118]) {
    const zt = road(y) + 11
    if (detail) {
      rod(s.lamp, [0, y, road(y) + 0.8], [0, y, zt], 0.14, 4)
      rod(s.lamp, [-2.6, y, zt], [2.6, y, zt], 0.08, 3)
    }
    for (const x of [-2.6, 2.6]) bead(s.lamp, [x, y, zt - 0.3], detail ? 0.35 : 0.45, !detail)
  }
}

function build(detail: boolean): Set {
  const s = newSet()
  tower(s, -TY, detail)
  tower(s, TY, detail)
  deck(s, detail)
  supports(s, detail)
  cables(s, detail)
  return s
}

if (import.meta.main) {
  const parts = (s: Set) => [
    { part: s.stone, material: CONCRETE },
    { part: s.walk, material: WALKMAT },
    { part: s.cable, material: CABLE },
    { part: s.girder, material: GIRDERMAT },
    { part: s.caps, material: CAPS },
    { part: s.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the river',
    bearing: 58.5, elevation: 0, towers: [-TY, TY],
    roadway: { swAbutment: road(-190), atTowers: [road(-TY), road(TY)], crest: road(3.7), neBridgeEnd: road(Y_ABUT), neLanding: road(Y_NE) },
  }
  for (const [file, detail, maxTris, maxBytes] of [
    ['msp-hennepin-avenue-bridge.glb', false, 6500, 250 * 1024],
    ['msp-hennepin-avenue-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const list = parts(build(detail))
    const tris = list.reduce((n, p) => n + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Hennepin Avenue Bridge', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  }
  console.log('road', extras.roadway, 'saddle', SADDLE.toFixed(2), 'ground at towers', ground(0, -TY).toFixed(1), ground(0, TY).toFixed(1))
}
