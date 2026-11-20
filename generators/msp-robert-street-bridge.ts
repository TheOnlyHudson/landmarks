/**
 * Robert Street Bridge, Saint Paul (1924–26; Toltz, King & Day; NRHP 1989)
 * — procedural, CC0-1.0, no textures.
 * bun generators/msp-robert-street-bridge.ts
 *
 * A reinforced-concrete multiple-arch bridge carrying Robert Street (MN 3)
 * over the Mississippi from downtown (Kellogg Boulevard) to the West Side.
 * One placement for the whole structure, abutment to abutment and on over
 * the south fill to the end of OSM's outline: the rainbow arch over the
 * navigation channel (two ribs rising 10 m over the deck, hangers above and
 * posts below), its two big piers with pylons and lamps, three open-spandrel
 * rib-arch spans across the rest of the river, barrel-arch spans over the
 * north bank (Shepard Road, the Union Pacific tracks) and over Harriet Island,
 * the deck edge with its cornice, the balustrades, the sidewalks (the
 * model's own walkways), the lamp standards and the south fill's retaining
 * walls. Low model: balustrades as solid bands, outer ribs only, lamp heads
 * only. Detail model (z16): balusters on a plinth with a rail, pedestals and
 * lamp posts, inner ribs, floor beams under the rainbow, the sidewalk
 * brackets.
 *
 * Frame: x across (+x to the WSW, the downstream side), y along the bridge
 * toward the West Side (SSE), z up, metres. Bearing 145.58, the line of the
 * roadway's straight part (OSM way 768704676); anchor -93.0868566, 44.9433182,
 * on the deck centre line midway along the outline. The centre line bends
 * 5 m west over the last 70 m of fill (OSM). z = 0 is the river, the map's
 * Mapterhorn water (212.13 m); feet on land run down to the map's terrain
 * vertex by vertex (GROUND, Mapterhorn z15, 5 m in this frame); river piers
 * stand at z = 0.
 *
 * The map owns the roadway between the curbs (±8.6 m); nothing here is a
 * slab at road level there.
 *
 * Roadway built to (lidar, tools/bridge_ele.py measure on the roadway ways,
 * MN_CentralMissRiver_5_B22; heights above 212.13 m): 17.92 m at the north
 * end, rising at 0.5 % to a crest of 18.52 m over the rainbow arch, then
 * down at 3.1 % from the rainbow's south pier across the river and Harriet
 * Island: 16.23 m at y = 6.7, 12.66 m at 121, 10.76 m at 182, 8.72 m at the
 * outline's south end. Sidewalks 0.12 m higher. `ele` for 13 nodes (9 new)
 * is proposed in landmarks-scratch/osm-ele/msp-robert-street-bridge.osc and
 * .md (+0.80 m, GEOID18 to EGM96), not uploaded.
 *
 * Ends. North: the deck lands at Kellogg Boulevard; the abutment face stands
 * where the map's terrain drops 15 m to Shepard Road (y = -245.5), the deck
 * edges and balustrades run on to the outline's end on the ground. South:
 * the arches end at an abutment at y = 185, where the lidar's bare earth
 * meets the road (the fill); the OSM outline runs on 64 m over the fill, so
 * the model draws its retaining walls from the map's terrain to the
 * sidewalk and the balustrades to 2.5 m short of the outline's end, where the
 * map's terrain rises over the walk; on the fill the sidewalk stays 0.45 m
 * over the map's terrain (tools/terrain.ts check: ok).
 *
 * Note on the lead's brief: it put the rainbow arch "over the railway on the
 * north bank". The lidar and every photo put it over the river's navigation
 * channel, beside the Union Pacific lift bridge; the railway passes under
 * the barrel span just north of the rainbow's north pier.
 *
 * Replaces: the man_made=bridge outline way/413717632 (OSM maps no piers or
 * buildings under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/413717632 (497 m,
 *   Q7350122), the roadway ways 768704676, 768704672, 18214633 and the
 *   sidewalks 194176852/194176853; the UP Albert Lea Subdivision crossing
 *   under it at y ≈ -175.
 * - Lidar (measured; USGS 3DEP MN_CentralMissRiver_5_B22, flown about 2022,
 *   1 m grid): the roadway; the deck ±12.5 m with curbs at ±8.6; the
 *   balustrade 1.3 m over the walk; the rainbow's ribs at ±9.7 m, 2–2.5 m
 *   wide, their tops 10.2 m over the road at y = -119 and crossing the deck
 *   24 m either side; its pier pylons 2.3 m over the road at y = -159.4 and
 *   -78.9 (80.5 m apart, the published 264 ft); lamp standards 4.2 m over the
 *   walk about every 19.5 m; the river at 212.35–212.40 m (high water).
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 145.58, 5 m).
 * - Published (Wikipedia, "Robert Street Bridge", citing Minnesota's Historic
 *   Bridges, MHS 1996): reinforced-concrete multiple-arch; 1,534.4 ft long,
 *   78.5 ft wide; rainbow arch with 62 ft headroom; barrel-arch and rib-arch
 *   flanking spans; piers placed around the railways, the river and Second
 *   Street.
 * Photos (evidence, Wikimedia Commons, McGhiever unless noted):
 * - "Robert Street Bridge.jpg", CC BY-SA 3.0 (the rainbow from the north bank:
 *   rib depth, hangers, deck brackets, the north pier and pylon):
 *   https://commons.wikimedia.org/wiki/File:Robert_Street_Bridge.jpg
 * - "Robert Street Bridge from south.jpg", CC BY-SA 4.0 (the rib-arch river
 *   spans and piers, the rainbow beyond):
 *   https://commons.wikimedia.org/wiki/File:Robert_Street_Bridge_from_south.jpg
 * - "Robert Street Bridge from N.jpg", CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Robert_Street_Bridge_from_N.jpg
 * - "Robert St & Vertical-lift Rail Bridges.jpg", CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Robert_St_%26_Vertical-lift_Rail_Bridges.jpg
 * - "Robert Street Bridge underside.jpg" and "... pier detail.jpg", CC BY-SA
 *   4.0 (ribs and cross beams under the deck; the pier's pilasters and
 *   medallion):
 *   https://commons.wikimedia.org/wiki/File:Robert_Street_Bridge_underside.jpg
 * - Michael Hicks, "Robert Street Bridge 01.jpg" and "02.jpg", CC BY 2.0
 *   (from the north, above the railway):
 *   https://commons.wikimedia.org/wiki/File:Robert_Street_Bridge_01.jpg
 * - Gabriel Vanslette, "Robert Street Bridge - St Paul, MN - panoramio
 *   (1).jpg" and "(2).jpg", CC BY 3.0 (the barrel spans over Harriet Island):
 *   https://commons.wikimedia.org/wiki/File:Robert_Street_Bridge_-_St_Paul,_MN_-_panoramio_(1).jpg
 *
 * Numbers
 * - Rainbow ribs: circular, top radius 41.2 m (fitted to the lidar crown and
 *   deck crossings), 2.6 m deep, 2 m wide, springing 3–9 m over the map's
 *   water at the pier faces (photo); 13 hangers/posts a side (photo: seven a
 *   side above the deck).
 * - Rainbow piers 10 m along the bridge, 27 m across, pylons to 2.4 m over the
 *   road with a lamp; river piers 8 m, land piers 4–4.5 m (photo-scaled).
 * - Pier positions other than the rainbow's are estimated from the lamp
 *   rhythm (lamps 10 m inside each 39 m river span) and the photos; spans
 *   31–36 m. Rib arches spring 2 m over the map's water, ribs 2.3–2.6 m deep,
 *   spandrel posts every 4.2 m; barrel arches spring 1 m over the ground.
 * - Deck slab and beams 1.6 m; cornice 0.5 m; balustrade 1.15 m (lidar 1.3
 *   with the lamp pedestals); balusters every 0.75 m and pedestals every 4.5 m
 *   (detail, estimated).
 * - Colours: buff concrete from the daylight photos, #d9c4a0, a shade
 *   #c5ad87 for undersides; lamps dark bronze.
 * - Night: the lamp heads (`lamp`). No evidence of floodlighting was found.
 *
 * Doubts
 * - Pier count and positions outside the rainbow span, and which flanking
 *   spans are barrels and which ribs, are estimated; the north spans over
 *   the railway are skewed in reality, square here.
 * - The rainbow piers' pylons are drawn as plain blocks without the
 *   medallions and fluting; the fender cribs in the river are left out.
 * - The map's water (212.13 m) is a little under the flight's (212.35 m).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { bead, chamferedRect, face, footedLoft, groundAt, piecewise, rod, stations, type GroundGrid } from './bridge-kit'

// ---- The map's terrain, metres above the river (Mapterhorn z15, 212.13 m) --
const GROUND: GroundGrid = { y0: -265, x0: -30, step: 5, z: [
  [18.1, 18.1, 18.1, 18.1, 18.0, 17.8, 17.8, 17.8, 17.7, 18.0, 18.3, 18.7, 18.9],
  [18.1, 18.1, 18.2, 18.1, 18.0, 17.8, 17.8, 17.8, 17.8, 18.1, 18.3, 18.7, 18.9],
  [18.2, 18.3, 18.2, 18.1, 18.0, 17.8, 17.9, 17.9, 17.8, 18.1, 18.3, 18.3, 17.4],
  [18.2, 18.3, 18.2, 18.1, 18.1, 17.8, 17.9, 17.9, 17.5, 11.8, 6.4, 4.1, 3.3],
  [17.6, 16.6, 13.7, 10.6, 8.4, 9.3, 6.3, 4.1, 3.2, 3.1, 3.1, 3.1, 3.2],
  [3.5, 3.5, 3.3, 3.3, 3.3, 3.2, 3.3, 3.2, 3.2, 3.2, 3.2, 3.3, 3.3],
  [3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3],
  [3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.3, 3.3, 3.3, 3.3],
  [3.3, 3.4, 3.4, 3.4, 3.4, 3.5, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4],
  [3.3, 3.4, 3.3, 3.4, 3.5, 4.9, 4.3, 3.8, 3.5, 3.4, 3.4, 3.4, 3.4],
  [7.1, 7.1, 6.8, 6.7, 6.6, 6.6, 6.2, 5.9, 5.8, 5.2, 4.4, 5.4, 5.7],
  [7.5, 7.4, 7.4, 7.4, 7.3, 7.2, 7.2, 7.3, 7.3, 7.2, 7.1, 7.0, 7.0],
  [7.5, 7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 7.3, 7.2],
  [7.4, 7.4, 7.4, 7.4, 7.4, 7.3, 7.3, 7.3, 7.3, 7.3, 7.3, 7.2, 7.2],
  [7.4, 7.4, 7.4, 7.1, 6.9, 5.7, 5.4, 5.4, 5.6, 2.9, 2.2, 2.4, 2.3],
  [2.3, 2.8, 3.3, 3.4, 1.9, 1.8, 2.0, 2.0, 1.9, 1.7, 1.7, 1.7, 1.7],
  [1.8, 1.8, 1.7, 1.7, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.7, 1.7],
  [1.6, 1.6, 1.6, 1.6, 1.5, 1.5, 1.6, 1.6, 1.5, 1.6, 1.6, 1.6, 1.6],
  [1.7, 1.6, 1.6, 1.6, 1.5, 1.5, 1.4, 1.4, 1.6, 1.6, 1.6, 1.7, 1.8],
  [0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.2, 0.3, 0.4, 1.3, 1.6, 1.6, 1.4],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.1, 0.1, 0.1, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.2, 0.3, 0.3, 0.4],
  [2.0, 2.1, 2.1, 2.1, 2.0, 1.8, 1.6, 1.8, 2.1, 2.2, 2.4, 2.5, 2.5],
  [4.3, 4.3, 4.4, 4.4, 3.9, 3.3, 3.3, 3.2, 3.7, 4.4, 4.5, 4.6, 4.6],
  [5.2, 4.7, 4.7, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.8, 4.7, 4.8, 5.3],
  [5.8, 5.5, 5.0, 4.8, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 5.0, 5.6, 5.8],
  [5.5, 5.8, 5.7, 5.3, 5.0, 5.0, 5.0, 5.0, 5.0, 5.3, 5.7, 5.8, 6.0],
  [4.3, 5.5, 5.9, 5.8, 5.8, 5.9, 5.8, 5.8, 5.7, 5.7, 5.7, 6.1, 6.4],
  [3.2, 4.4, 5.6, 5.8, 5.9, 5.9, 5.9, 5.9, 5.8, 5.6, 5.6, 6.4, 6.9],
  [2.5, 3.5, 4.9, 5.7, 5.8, 5.8, 5.8, 5.8, 5.7, 5.4, 5.3, 6.4, 7.0],
  [2.3, 2.8, 4.2, 5.5, 5.7, 5.6, 5.5, 5.3, 5.2, 5.1, 4.9, 5.8, 6.4],
  [2.4, 2.3, 3.2, 4.3, 4.2, 4.3, 4.5, 4.6, 4.6, 4.5, 4.4, 4.9, 5.2],
  [2.6, 2.4, 2.2, 3.2, 3.4, 3.4, 3.6, 3.8, 4.0, 4.0, 3.9, 4.2, 4.4],
  [2.8, 2.6, 2.4, 2.8, 3.1, 3.2, 3.4, 3.6, 3.8, 3.7, 3.6, 3.7, 4.1],
  [2.9, 2.7, 2.6, 2.7, 3.0, 3.1, 3.2, 3.3, 3.5, 3.6, 3.6, 3.6, 3.9],
  [3.0, 2.8, 2.7, 2.7, 3.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.5, 3.5, 3.7],
  [3.0, 2.9, 2.7, 2.9, 3.1, 3.1, 3.1, 3.2, 3.3, 3.3, 3.3, 3.4, 3.6],
  [3.1, 3.0, 2.9, 2.9, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 2.9, 3.4, 3.5],
  [3.2, 3.1, 3.0, 3.1, 3.3, 3.3, 3.3, 3.3, 3.3, 3.1, 2.5, 3.3, 3.4],
  [3.3, 3.2, 3.1, 3.2, 3.4, 3.4, 3.4, 3.3, 3.3, 2.9, 1.8, 3.0, 3.3],
  [3.3, 3.3, 3.0, 3.2, 3.3, 3.3, 3.3, 3.3, 3.3, 2.5, 1.7, 3.0, 3.2],
  [3.4, 3.4, 3.0, 3.2, 3.3, 3.3, 3.3, 3.3, 3.3, 2.2, 1.6, 3.0, 3.2],
  [3.5, 3.5, 3.1, 3.2, 3.2, 3.3, 3.3, 3.3, 3.3, 2.2, 1.5, 2.8, 3.1],
  [3.5, 3.6, 3.2, 3.1, 3.2, 3.3, 3.3, 3.3, 3.3, 2.2, 1.5, 2.8, 3.2],
  [3.6, 3.6, 3.1, 3.1, 3.3, 3.3, 3.3, 3.3, 3.2, 2.2, 1.4, 2.6, 3.2],
  [3.6, 3.7, 3.1, 3.2, 3.4, 3.3, 3.3, 3.3, 3.2, 2.1, 1.3, 2.4, 3.2],
  [3.6, 3.7, 3.1, 3.2, 3.3, 3.3, 3.3, 3.3, 3.3, 2.3, 1.3, 2.4, 3.2],
  [3.7, 3.7, 3.1, 3.1, 3.1, 3.1, 3.2, 3.3, 3.3, 2.4, 1.3, 2.3, 3.3],
  [3.7, 3.7, 3.2, 2.9, 2.9, 3.0, 3.1, 3.2, 3.3, 2.7, 1.3, 2.2, 3.4],
  [3.8, 3.7, 3.2, 2.9, 2.9, 3.1, 3.1, 3.2, 3.3, 3.1, 1.4, 2.0, 3.3],
  [3.8, 3.8, 3.3, 2.9, 3.1, 3.2, 3.4, 3.5, 4.4, 3.7, 1.6, 1.7, 3.1],
  [3.8, 3.7, 3.3, 2.9, 3.1, 3.4, 4.6, 6.1, 8.4, 4.6, 1.8, 1.4, 2.6],
  [3.8, 3.8, 3.3, 3.2, 6.9, 8.6, 9.8, 10.2, 10.4, 4.1, 1.9, 1.4, 2.4],
  [3.8, 3.8, 3.4, 3.0, 10.3, 10.4, 10.5, 10.4, 10.4, 4.1, 2.5, 2.3, 2.9],
  [3.9, 3.9, 3.6, 3.1, 9.8, 10.2, 10.3, 10.2, 10.3, 4.9, 3.8, 3.3, 3.3],
  [3.9, 3.9, 3.7, 3.0, 9.3, 10.1, 10.2, 10.1, 10.1, 9.1, 6.9, 4.4, 3.7],
  [3.9, 4.0, 3.8, 3.1, 8.8, 10.0, 10.0, 9.9, 10.0, 9.2, 7.6, 6.6, 6.8],
  [4.0, 4.0, 3.9, 3.2, 8.4, 9.8, 9.9, 9.8, 9.8, 9.3, 7.6, 7.6, 7.6],
  [3.8, 3.8, 3.8, 3.3, 7.7, 9.6, 9.7, 9.7, 9.6, 9.3, 7.6, 7.6, 7.6],
  [3.9, 3.8, 3.8, 3.5, 8.0, 9.5, 9.5, 9.5, 9.5, 9.2, 7.5, 7.5, 7.4],
  [4.0, 3.9, 4.0, 3.8, 7.3, 9.3, 9.4, 9.4, 9.3, 9.1, 7.5, 7.4, 7.7],
  [4.1, 4.1, 4.1, 4.0, 6.8, 9.2, 9.2, 9.2, 9.1, 9.1, 7.7, 7.6, 7.9],
  [4.2, 4.1, 4.2, 4.0, 6.4, 9.0, 9.1, 9.1, 8.9, 9.0, 7.9, 7.6, 7.8],
  [4.3, 4.2, 4.3, 4.2, 5.7, 8.9, 8.9, 8.9, 8.8, 8.9, 8.0, 7.6, 7.8],
  [4.7, 4.4, 4.3, 4.3, 5.0, 8.8, 8.8, 8.8, 8.7, 8.8, 8.1, 7.7, 7.6],
  [4.8, 4.8, 4.6, 4.8, 6.4, 8.6, 8.6, 8.7, 8.6, 8.6, 8.1, 7.7, 7.7],
  [6.7, 7.1, 7.2, 7.3, 8.2, 8.4, 8.5, 8.5, 8.5, 8.3, 8.0, 7.7, 7.5],
  [7.8, 7.8, 7.9, 8.0, 8.1, 8.3, 8.3, 8.3, 8.2, 8.1, 7.8, 7.6, 7.4],
  [7.8, 7.9, 7.9, 8.0, 8.1, 8.1, 8.2, 8.2, 8.1, 7.9, 7.8, 7.6, 7.5],
] }
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- The roadway (lidar, tools/bridge_ele.py, metres above 212.13 m) --------
const road = piecewise([
  [-318, 18.06], [-306.1, 17.85], [-286, 17.73], [-279.9, 17.76], [-259.8, 17.85], [-248.9, 17.92], [-228.8, 18.02], [-208.7, 18.12], [-194.2, 18.19], [-174.1, 18.3], [-154, 18.38], [-133.9, 18.49], [-113.8, 18.52], [-93.7, 18.45], [-73.6, 18.33], [-53.5, 18.03], [-33.4, 17.48], [-13.3, 16.85], [6.7, 16.23], [26.8, 15.58], [46.9, 14.99], [67, 14.36], [87.1, 13.73], [107.2, 13.11], [121.3, 12.66], [141.4, 12.04], [161.5, 11.41], [167, 11.24], [181.8, 10.76], [201.9, 10.15], [221.9, 9.51], [242, 8.92], [248.8, 8.72], [257.1, 8.45], [264.6, 8.26],
])
const walk = (y: number) => road(y) + 0.12
/** The deck's centre line: straight to y = 182, then bending 5 m east to the south end (OSM road). */
const cx = piecewise([[-260, 0.1], [-194.2, 0.5], [121.3, 0], [181.8, 0.3], [248.8, 5.0], [260, 5.8]])

// ---- Plan (y along the bridge toward the West Side, x across, +x west-south-west) --
const Y_N = -248.9 // north end: the outline, where the deck lands at Kellogg Boulevard
const Y_NABUT = -245.5 // north abutment face (map terrain drops 15 m to Shepard Road here)
const Y_S = 246.5 // south end, 2.5 m inside the outline (the map's terrain rises over the walk at the very end)
const Y_SABUT = 185 // south abutment: the deck lands on the fill (bare earth meets the road)
const CURB = 8.6, BAL = 11.2, EDGE = 12.0 // curbs, balustrade inner face, deck edge (lidar)
type Pier = { y: number; t: number; w: number; pylon?: boolean }
// pier centres: the rainbow's from the lidar (its pylons, 80.5 m apart = the published 264 ft);
// the rest from the lamp rhythm and the photos (estimated)
const PIERS: Pier[] = [
  { y: -222.4, t: 4, w: 12.4 }, { y: -196.4, t: 4, w: 12.4 },
  { y: -159.4, t: 10, w: 13.6, pylon: true }, { y: -78.9, t: 10, w: 13.6, pylon: true },
  { y: -39.9, t: 8, w: 12.8 }, { y: -0.9, t: 8, w: 12.8 }, { y: 38.1, t: 8, w: 12.8 },
  { y: 77.1, t: 4.5, w: 12.4 }, { y: 116.1, t: 4.5, w: 12.4 }, { y: 146.6, t: 4.5, w: 12.4 },
]
type Span = { a: number; b: number; kind: 'barrel' | 'rib' | 'rainbow'; spring: number }
const SPANS: Span[] = []
{
  const ends = [{ y: Y_NABUT, t: 0 }, ...PIERS, { y: Y_SABUT, t: 0 }]
  for (let i = 0; i + 1 < ends.length; i++) {
    const a = ends[i].y + ends[i].t / 2, b = ends[i + 1].y - ends[i + 1].t / 2, m = (a + b) / 2
    const kind = Math.abs(m + 119.15) < 5 ? 'rainbow' : m > -80 && m < 40 ? 'rib' : 'barrel'
    SPANS.push({ a, b, kind, spring: kind === 'rib' ? 2 : 0 })
  }
}

// ---- Materials ------------------------------------------------------------------
const CONCRETE: MaterialSpec = finish('buff-concrete', 0xd9c4a0)
const SHADE: MaterialSpec = finish('buff-concrete-shade', 0xc5ad87)
const WALKMAT: MaterialSpec = finish('concrete-walk', 0xcdc8bd)
const LAMP: MaterialSpec = finish('lamp', 0x3f423d)
type Set = { stone: Part; shade: Part; walk: Part; lamp: Part }

const norm2 = (x: number, y: number): [number, number] => { const l = Math.hypot(x, y) || 1; return [x / l, y / l] }
function wall(p: Part, line: [number, number][], top: (x: number, y: number) => number, bot: (x: number, y: number) => number, side: number) {
  for (let i = 0; i + 1 < line.length; i++) {
    const [xa, ya] = line[i], [xb, yb] = line[i + 1]
    const [tx, ty] = norm2(xb - xa, yb - ya), n: V3 = [ty * side, -tx * side, 0]
    const ba = bot(xa, ya), bb = bot(xb, yb), ta = top(xa, ya), tb = top(xb, yb)
    if (Math.max(ta - ba, tb - bb) <= 0.01) continue
    face(p, [xa, ya, ba], [xb, yb, bb], [xb, yb, Math.max(tb, bb)], [xa, ya, Math.max(ta, ba)], n)
  }
}
function sheet(p: Part, a: [number, number][], b: [number, number][], z: (x: number, y: number) => number, up: boolean) {
  for (let i = 0; i + 1 < a.length; i++) {
    const q: V3[] = [[a[i][0], a[i][1], z(...a[i])], [b[i][0], b[i][1], z(...b[i])], [b[i + 1][0], b[i + 1][1], z(...b[i + 1])], [a[i + 1][0], a[i + 1][1], z(...a[i + 1])]]
    face(p, q[0], q[1], q[2], q[3], [0, 0, up ? 1 : -1])
  }
}
function ys(y0: number, y1: number, step: number, breaks: number[] = []) {
  return [...new Set([...stations(y0, y1, step), ...breaks.filter((b) => b > y0 && b < y1)].map((v) => Math.round(v * 1000) / 1000))].sort((a, b) => a - b)
}
/** A line `off` metres from the centre line (+x side for off > 0). */
const line = (off: number, y0: number, y1: number, step: number, br: number[] = []) => ys(y0, y1, step, br).map((y) => [cx(y) + off, y] as [number, number])
/** A box in the bridge frame, x0..x1 across (from the centre line at yc), y0..y1 along, z0..z1. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, chamfer = 0, seg = 50) {
  const c = cx((y0 + y1) / 2)
  footedLoft(p, ground, [
    { plan: chamferedRect(c + x0, c + x1, y0, y1, chamfer), z: z0 },
    { plan: chamferedRect(c + x0, c + x1, y0, y1, chamfer), z: z1 },
  ], seg)
}

// ---- Arch faces: a segmental arch in the plane x = const, between y = a and b --
/** Points of a segmental arc from (a, za) to (b, zb) symmetric about the middle, rising `rise` over the chord. */
function arc(a: number, b: number, zs: number, rise: number, seg: number): [number, number][] {
  const c = b - a, R = (c * c / 4 + rise * rise) / (2 * rise), m = (a + b) / 2, zc = zs + rise - R
  const half = Math.asin(Math.min(1, c / 2 / R))
  return Array.from({ length: seg + 1 }, (_, k) => {
    const t = -half + (2 * half * k) / seg
    return [m + R * Math.sin(t), zc + R * Math.cos(t)] as [number, number]
  })
}
/** A spandrel face at offset x (from the centre line), between an arc and top(y), facing `side`. */
function spandrel(p: Part, x: number, pts: [number, number][], top: (y: number) => number, side: number) {
  for (let k = 0; k + 1 < pts.length; k++) {
    const [y0, z0] = pts[k], [y1, z1] = pts[k + 1]
    const X0 = cx(y0) + x, X1 = cx(y1) + x
    face(p, [X0, y0, z0], [X1, y1, z1], [X1, y1, top(y1)], [X0, y0, top(y0)], [side, 0, 0])
  }
}
/** The underside of an arch (a barrel or a rib) between x0 and x1, facing down toward the arch's centre. */
function soffit(p: Part, x0: number, x1: number, pts: [number, number][]) {
  for (let k = 0; k + 1 < pts.length; k++) {
    const [y0, z0] = pts[k], [y1, z1] = pts[k + 1]
    const t = norm2(y1 - y0, z1 - z0), n: V3 = [0, t[1], -t[0]]
    face(p, [cx(y0) + x0, y0, z0], [cx(y0) + x1, y0, z0], [cx(y1) + x1, y1, z1], [cx(y1) + x0, y1, z1], [0, -n[1] * -1, n[2]])
  }
}
/** A rib: an arched bar of width w at offset xc, its top along `top` points and its bottom along `bot` (same count). */
function rib(s: Set, xc: number, w: number, topPts: [number, number][], botPts: [number, number][], sides = true) {
  for (const sd of [-1, 1]) if (sides) {
    for (let k = 0; k + 1 < topPts.length; k++) {
      const x = xc + sd * w / 2
      const q: V3[] = [[cx(botPts[k][0]) + x, botPts[k][0], botPts[k][1]], [cx(botPts[k + 1][0]) + x, botPts[k + 1][0], botPts[k + 1][1]],
        [cx(topPts[k + 1][0]) + x, topPts[k + 1][0], topPts[k + 1][1]], [cx(topPts[k][0]) + x, topPts[k][0], topPts[k][1]]]
      face(s.stone, q[0], q[1], q[2], q[3], [sd, 0, 0])
    }
  }
  soffit(s.shade, xc - w / 2, xc + w / 2, botPts)
  // the rib's back (top face), facing up
  for (let k = 0; k + 1 < topPts.length; k++) {
    const [y0, z0] = topPts[k], [y1, z1] = topPts[k + 1]
    const t = norm2(y1 - y0, z1 - z0)
    face(s.stone, [cx(y0) + xc - w / 2, y0, z0], [cx(y0) + xc + w / 2, y0, z0], [cx(y1) + xc + w / 2, y1, z1], [cx(y1) + xc - w / 2, y1, z1], [0, -t[1], t[0]])
  }
}

// ---- Spans ------------------------------------------------------------------------
const SLAB = 1.6 // deck slab and floor beams under the road (photo-scaled)
const under = (y: number) => road(y) - SLAB
function spans(s: Set, detail: boolean) {
  for (const sp of SPANS) {
    const { a, b } = sp
    if (sp.kind === 'barrel') {
      // a barrel arch with solid spandrel walls on both faces; springs on the ground or the pier
      const zs = Math.max(ground(cx(a), a), ground(cx(b), b)) + 1.0
      const rise = Math.max(2, Math.min(under((a + b) / 2) - 1.2, zs + (b - a) / 2) - zs)
      const pts = arc(a, b, zs, rise, detail ? 12 : 8)
      for (const sd of [-1, 1]) spandrel(s.stone, sd * EDGE, sd > 0 ? pts : [...pts].reverse(), under, sd)
      soffit(s.shade, -EDGE, EDGE, pts)
    } else if (sp.kind === 'rib') {
      // open-spandrel rib arches: outer ribs on the faces (and two inner ones in the detail), posts up to the deck
      const top = arc(a, b, sp.spring + 2.6, under((a + b) / 2) - 0.1 - (sp.spring + 2.6), detail ? 12 : 8)
      const bot = arc(a, b, sp.spring, under((a + b) / 2) - 2.3 - sp.spring, detail ? 12 : 8)
      const ribsX = detail ? [-10.9, -3.6, 3.6, 10.9] : [-10.9, 10.9]
      for (const x of ribsX) rib(s, x, 1.8, top, bot)
      // spandrel posts every ~4 m on each rib
      for (const y of stations(a + 2.5, b - 2.5, 4.2)) {
        const zt = under(y), m = (a + b) / 2, c = b - a
        // the rib's top at y
        const k = top.findIndex(([yy]) => yy >= y), [y0, z0] = top[Math.max(0, k - 1)], [y1, z1] = top[Math.max(1, k)]
        const zr = z0 + (z1 - z0) * (y - y0) / ((y1 - y0) || 1)
        if (zt - zr < 0.6) continue
        for (const x of ribsX) box(s.stone, x - 0.7, x + 0.7, y - 0.5, y + 0.5, zr - 0.2, zt)
        if (!detail) void m, c
      }
      // spandrel cross walls hidden under the deck are left out; the deck's underside
      sheet(s.shade, line(-EDGE, a, b, 8), line(EDGE, a, b, 8), (x, y) => under(y), false)
    } else rainbow(s, sp, detail)
  }
}

// ---- The rainbow arch -----------------------------------------------------------
const RB_C = -119.15, RB_TOP = 28.76, RB_R = 41.2, RB_D = 2.6 // crown, rib top radius (lidar), depth (photo)
const RIB_X = 9.7, RIB_W = 2.0 // ribs either side of the roadway (lidar)
const rbTop = (y: number) => RB_TOP - RB_R + Math.sqrt(Math.max(0, RB_R * RB_R - (y - RB_C) ** 2))
const rbBot = (y: number) => RB_TOP - RB_R + Math.sqrt(Math.max(0, (RB_R - RB_D) ** 2 - (y - RB_C) ** 2))
function rainbow(s: Set, sp: Span, detail: boolean) {
  const n = detail ? 28 : 16
  const ysr = stations(sp.a, sp.b, (sp.b - sp.a) / n)
  const top = ysr.map((y) => [y, rbTop(y)] as [number, number]), bot = ysr.map((y) => [y, rbBot(y)] as [number, number])
  for (const sd of [-1, 1]) rib(s, sd * RIB_X, RIB_W, top, bot)
  // hangers above the deck and posts below it, every 5.4 m (photo: seven a side above)
  for (const y of stations(sp.a + 3, sp.b - 3, (sp.b - sp.a - 6) / 13)) {
    const zr = rbTop(y), zb = rbBot(y), zd = road(y)
    for (const sd of [-1, 1]) {
      const x = sd * RIB_X
      if (zb > zd + 1.5) box(s.stone, x - 0.45, x + 0.45, y - 0.4, y + 0.4, under(y), zb + 0.2)
      else if (zr < under(y) - 0.5) box(s.stone, x - 0.7, x + 0.7, y - 0.5, y + 0.5, zr - 0.2, under(y))
    }
  }
  // the deck's underside between the ribs; floor beams (detail)
  sheet(s.shade, line(-EDGE, sp.a, sp.b, 8), line(EDGE, sp.a, sp.b, 8), (x, y) => under(y), false)
  if (detail) for (const y of stations(sp.a + 3, sp.b - 3, (sp.b - sp.a - 6) / 13))
    box(s.shade, -RIB_X, RIB_X, y - 0.35, y + 0.35, under(y) - 1.2, under(y))
}

// ---- Piers ------------------------------------------------------------------------
function piers(s: Set, detail: boolean) {
  for (const p of PIERS) {
    const y0 = p.y - p.t / 2, y1 = p.y + p.t / 2
    box(s.stone, -p.w + 0.6, p.w - 0.6, y0, y1, 'ground', under(p.y), 0.6, 4)
    // pilasters on the faces, rising to the balustrade cap (the rainbow's to the pylons)
    for (const sd of [-1, 1]) {
      const x0 = sd > 0 ? EDGE - 0.6 : -p.w, x1 = sd > 0 ? p.w : -EDGE + 0.6
      const zt = p.pylon ? road(p.y) + 2.4 : walk(p.y) + 1.75
      box(s.stone, x0, x1, y0 + 0.6, y1 - 0.6, 'ground', zt, 0.25, 4)
      if (p.pylon) {
        // the pylon's lamp
        const c = cx(p.y)
        if (detail) rod(s.lamp, [c + sd * (p.w - 1.6), p.y, zt], [c + sd * (p.w - 1.6), p.y, zt + 2.6], 0.1, 4)
        bead(s.lamp, [c + sd * (p.w - 1.6), p.y, zt + 2.9], detail ? 0.35 : 0.45, !detail)
      }
    }
  }
  // abutments: the north face where the bank drops to Shepard Road, the south where the fill begins
  for (const [y, d] of [[Y_NABUT, -1], [Y_SABUT, 1]] as [number, number][])
    wall(s.stone, line(0, 0, 0, 1).map(() => [0, 0]).length ? stations(-EDGE, EDGE, 4).map((x) => [cx(y) + x, y] as [number, number]) : [], (x, yy) => under(yy), (x, yy) => ground(x, yy), d)
}

// ---- Deck edges, sidewalks, balustrades, lamps ------------------------------------
const LAMPS = [-244.9, -224.4, -206.4, -187.4, -149.4, -88.9, -69.4, -49.4, -30.0, -9.4, 9.1, 29.1, 48.1, 68.1, 86.1, 108.1, 131.1, 154.1, 166.1, 186.1, 203.1, 222.6, 241.1]
function deck(s: Set, detail: boolean) {
  const step = detail ? 6 : 12
  const br = PIERS.flatMap((p) => [p.y - p.t / 2, p.y + p.t / 2]).concat([Y_NABUT, Y_SABUT])
  for (const sd of [-1, 1]) {
    const o = (l: [number, number][]) => (sd > 0 ? l : [...l].reverse())
    // fascia (deck edge) from under the slab to the sidewalk; past the south abutment, the fill's retaining wall to the ground
    const edge = line(sd * EDGE, Y_N, Y_S, step, br)
    const onBridge = edge.filter(([, y]) => y <= Y_SABUT + 1e-6), onFill = edge.filter(([, y]) => y >= Y_SABUT - 1e-6)
    const onLand = onBridge.filter(([, y]) => y <= Y_NABUT + 1e-6)
    wall(s.stone, o(onBridge.filter(([, y]) => y >= Y_NABUT - 1e-6)), (x, y) => walk(y), (x, y) => under(y), 1)
    wall(s.stone, o(onFill), (x, y) => walk(y), (x, y) => ground(x, y), 1)
    wall(s.stone, o(onLand), (x, y) => walk(y), (x, y) => ground(x, y), 1)
    // a cornice band proud of the fascia
    const corn = line(sd * (EDGE + 0.3), Y_N, Y_S, step, br)
    wall(s.stone, o(corn), (x, y) => walk(y) - 0.05, (x, y) => walk(y) - 0.55, 1)
    sheet(s.shade, sd > 0 ? edge : corn, sd > 0 ? corn : edge, (x, y) => walk(y) - 0.55, false)
    sheet(s.stone, sd > 0 ? edge : corn, sd > 0 ? corn : edge, (x, y) => walk(y) - 0.05, true)
    // balustrade: a solid band in the low model; in the detail a plinth, a rail and balusters
    const bi = line(sd * BAL, Y_N, Y_S, step, br), bo = line(sd * EDGE, Y_N, Y_S, step, br)
    if (!detail) {
      wall(s.stone, o(bi), (x, y) => walk(y) + 1.15, (x, y) => walk(y), -1)
      wall(s.stone, o(bo), (x, y) => walk(y) + 1.15, (x, y) => walk(y) - 0.05, 1)
      sheet(s.stone, sd > 0 ? bi : bo, sd > 0 ? bo : bi, (x, y) => walk(y) + 1.15, true)
    } else {
      for (const [z0, z1] of [[0, 0.3], [0.95, 1.15]]) {
        wall(s.stone, o(bi), (x, y) => walk(y) + z1, (x, y) => walk(y) + z0, -1)
        wall(s.stone, o(bo), (x, y) => walk(y) + z1, (x, y) => (z0 === 0 ? walk(y) - 0.05 : walk(y) + z0), 1)
        sheet(s.stone, sd > 0 ? bi : bo, sd > 0 ? bo : bi, (x, y) => walk(y) + z1, true)
        if (z0 > 0) sheet(s.shade, sd > 0 ? bo : bi, sd > 0 ? bi : bo, (x, y) => walk(y) + z0, false)
      }
      for (const y of stations(Y_N + 0.5, Y_S - 0.5, 0.75)) {
        const x = cx(y) + sd * (BAL + EDGE) / 2
        rod(s.stone, [x, y, walk(y) + 0.3], [x, y, walk(y) + 0.95], 0.13, 4)
      }
      for (const y of stations(Y_N, Y_S, 4.5)) {
        const x = sd * (BAL + EDGE) / 2
        box(s.stone, x - 0.45, x + 0.45, y - 0.3, y + 0.3, walk(y) - 0.05, walk(y) + 1.3, 0.08)
        // brackets under the cantilevered sidewalk (photo), on the bridge only
        if (y > Y_NABUT && y < Y_SABUT) box(s.shade, sd > 0 ? EDGE - 1.2 : -EDGE, sd > 0 ? EDGE : -EDGE + 1.2, y - 0.4, y + 0.4, under(y) - 0.9, walk(y) - 0.55)
      }
    }
    // sidewalk (the model's walkway) and its curb
    const cl = line(sd * CURB, Y_N, Y_S, step, br), wl = line(sd * BAL, Y_N, Y_S, step, br)
    // on the fill the walk never dips under the map's terrain
    const wz = (x: number, y: number) => Math.max(walk(y), y > Y_SABUT ? ground(x, y) + 0.45 : 0)
    sheet(s.walk, sd > 0 ? cl : wl, sd > 0 ? wl : cl, wz, true)
    wall(s.walk, sd > 0 ? [...cl].reverse() : cl, wz, (x, y) => road(y) - 0.05, 1)
    // lamp standards on the balustrade (lidar)
    for (const y of LAMPS) {
      const x = cx(y) + sd * (BAL + EDGE) / 2, z = walk(y) + 1.15
      if (detail) {
        box(s.stone, sd * (BAL + EDGE) / 2 - 0.4, sd * (BAL + EDGE) / 2 + 0.4, y - 0.4, y + 0.4, walk(y) - 0.05, z + 0.3, 0.1)
        rod(s.lamp, [x, y, z + 0.3], [x, y, walk(y) + 3.9], 0.09, 4)
      }
      bead(s.lamp, [x, y, walk(y) + 4.15], detail ? 0.3 : 0.4, !detail)
    }
  }
}

function build(detail: boolean): Set {
  const s: Set = { stone: new Part(), shade: new Part(), walk: new Part(), lamp: new Part() }
  spans(s, detail)
  piers(s, detail)
  deck(s, detail)
  return s
}

if (import.meta.main) {
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck centre line midway along the bridge, at the river',
    bearing: 145.58, elevation: 0,
    roadway: { north: road(Y_N), crest: road(-114), atRainbowPiers: [road(-159.4), road(-78.9)], southAbutment: road(Y_SABUT), south: road(Y_S) },
  }
  for (const [file, detail, maxTris, maxBytes] of [
    ['msp-robert-street-bridge.glb', false, 6500, 250 * 1024],
    ['msp-robert-street-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const s = build(detail)
    const list = [
      { part: s.stone, material: CONCRETE }, { part: s.shade, material: SHADE },
      { part: s.walk, material: WALKMAT }, { part: s.lamp, material: LAMP },
    ]
    const tris = list.reduce((n, p) => n + p.part.triangles, 0)
    const glb = writeGlb('Robert Street Bridge', list, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
    if (tris > maxTris || glb.length > maxBytes) throw new Error(`${file} over budget`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
  console.log(SPANS.map((s) => `${s.kind} ${s.a.toFixed(1)}..${s.b.toFixed(1)}`).join('; '))
}
