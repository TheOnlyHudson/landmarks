/**
 * Hope Memorial Bridge (Lorain–Carnegie Bridge, 1932; Wilbur J. Watson,
 * engineer; Frank Walker, architect; Henry Hering, sculptor) — procedural,
 * CC0-1.0, no textures. bun generators/cle-hope-memorial-bridge.ts
 *
 * The whole bridge as one placement: the steel deck-truss viaduct over the
 * Flats and the Cuyahoga (an arched lower chord in every span, Warren web
 * with posts up to a straight top chord under the deck, painted sage
 * green), the tall cream concrete piers rising to the deck between the
 * spans, the salmon-pink concrete balustrades and fascias, the parallel-
 * chord approach trusses and abutments, and the landmark: two pairs of art
 * deco Berea sandstone pylons, one pair at each end of the viaduct, each
 * carrying two Guardians of Traffic back to back (eight in all) facing
 * along the road. The pylons are drawn at their measured height with the
 * stepped crown frame, the crenellated long sides and each Guardian as a
 * bold mass standing up to 1.95 m proud of the pylon's end face (rework,
 * Nov 2026, after the earlier figures didn't read): the robe's pleated
 * lower body as a panel down to the plinth, both hands held out under the
 * vehicle (drawn pale, in the pylon's stone, so it reads against the
 * figure), the bare torso and shoulders, the head and winged helmet 1.45 m
 * forward of the face inside a raised niche frame, and the great wings as
 * two layered slabs spread back along both long sides from shoulder height.
 * The figure is a clearly darker stone than the pylon (#8a7154 against
 * #cdb592): in the photos the same Berea sandstone reads that way through
 * its deep relief and weathering, and a flat model needs the value step to
 * show it at all.
 *
 * Frame: x across (+x south-east), y along the bridge toward Carnegie
 * Avenue (bearing 49.15°, the roadway way/55553304's line, 49.2° in OSM),
 * z up, metres; origin at the OSM outline's centroid, on the river. The
 * deck's centre line runs 8.5 m south-east of the centroid (the outline is
 * wider on the north side at the west end), so everything is built about
 * the deck's centre line (`XC`) and shifted.
 *
 * Height. z = 0 is the Cuyahoga: Mapterhorn reads the river at 174.6 m
 * (NAVD88), and the lidar's water surface agrees within 0.1 m. Ground under
 * the piers, pylon towers and abutments is the map's terrain above that,
 * from a 5 m table in this frame (`GROUND`), so their feet land on what the
 * map draws. elevation 0.
 *
 * Roadway heights built to (lidar lower quartile across the lanes on the
 * centre line, every 20 m, `ROAD`; NAVD88 = value + 174.6): 36.5 m at
 * y = -560 (west end of the deck parapets), 39.0 m at the west pylons
 * (y = -387.5; 213.6 m NAVD88), a crest of 43.1 m at y = -120 (217.7 m),
 * 41.4 m at y = 0, 32.4 m at the east pylons (y = +492; 207.0 m), 30.3 m at
 * y = +600. tools/bridge_ele.py measure on the Lorain Avenue ways 1348201410,
 * 55553303, 34570400, 55553306, 55553304, 55555858, 1321787904 gives the
 * same profile (spread 0.01-0.05 m): 213.58 m at the Guardian node
 * 9426944843, 217.74 m at node 9816221359 (crest), 210.51 m at 9816221357,
 * 207.58 m at 9816221356; the deck lands on the ground (above < 0.1 m) at
 * about s = 218 m (y = -453) on the west and s = 1233 m (y = +562) on the
 * east. Re-measured for the rework with the footway (905931206 1022131218)
 * and the north cycleway (388289748 252929341, read 3.5 m south of its OSM
 * line, which lies on the north barrier): both within 0.3 m of the roadway
 * at the same station, crest 217.7 m. None of these ways carries ele; the
 * values to give the map are in ~/landmarks-scratch/osm-ele/
 * cle-hope-memorial-bridge.osc and .md (lidar + 0.52 m, the GEOID18-EGM96
 * gap here).
 * Published: 93 ft (28 m) clearance over the river (Wikipedia); the lower
 * chord at the river spans is drawn about 30 m over the water.
 *
 * Ends (checked for the rework against the lidar and the map's terrain):
 * the deck lands at the west abutment (y = -452; the roadway 0.5 m over
 * the bare earth at y = -455, the terrain table 38.3 m under a 38.3 m road)
 * and at the east abutment (y = +545-549; the road 0.0 m over the bare
 * earth at y = +562, the terrain table within 0.5 m of the abutment's top).
 * Beyond them the road runs on fill to the street intersections at -556
 * and +596, with retaining walls where the ground is 0.3-4 m under the
 * fascia, and West 18th Street (way/11799036) passes obliquely under the
 * fill at y = -512 to -503 (the roadway 5 m over the bare earth there): its
 * short span now has its two abutment faces, parallel to the street, from
 * the terrain up to the fascia.
 *
 * Outline. way/1022131210 (man_made=bridge, layer 1, no wikidata) runs from
 * y = -672 to +673: about 220 m on the west and 110 m on the east beyond
 * where the deck lands, over fill and at-grade road with no piers. The
 * model draws all the elevated structure inside it and the parapets and
 * fascias out to y = -556 and +596 (where the deck widens into the street
 * intersections), with retaining walls on the fill; the at-grade ends have
 * no piers or parapets for the map to lose, so the outline is listed. No
 * building or building:part lies under the model (overlap.ts: ok).
 *
 * Sources:
 * - OSM: outline way/1022131210; the Guardians of Traffic artwork nodes
 *   9426944843 (west) and 9426944844 (east) sit between the pylon pairs.
 * - Lidar, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019), 1 m grids over
 *   the whole deck, 0.5 m at both pylon pairs: pylons centred at
 *   y = -387.5 and +492.3, 4.5 m across, 9-10 m long (with the figures),
 *   tops 227.4 m (13.8 m over the road) west and 220.7-220.8 m (13.4 m)
 *   east; pylon centres 12.4 m and 13.3 m either side of the deck's
 *   centre line (drawn ±12.9); balustrades 11.5-11.7 m either side; deck
 *   edges about ±13.5 m; the north multi-use path behind a barrier.
 * - NAIP (USDA, public domain), 0.5 m strips in this frame: pier positions
 *   from their shadows and ends outside the deck at y = -320, -234, -158,
 *   -68, +10, +78, +146, +216, +278, +332, +388 (and +442 estimated, under
 *   a building's shadow).
 * - Published (Wikipedia "Hope Memorial Bridge"; HAER OH-16): 1932, 4,490 ft
 *   (1,370 m) overall, art deco, eight Guardians of Traffic by Henry Hering
 *   and Frank Walker in Berea sandstone, two pairs of pylons, one at each
 *   end; the unused lower deck; multi-use path 2012 on the north side.
 * - Photos (Wikimedia Commons):
 *   - "Hope Memorial Bridge (35174007910)", "(35392731042)" (Erik Drost,
 *     CC BY 2.0): side elevations from the river: arched lower chords, the
 *     Warren web, the tall piers, span rhythm;
 *   - "Lorain-Carnegie.jpg" and "OBLIQUE VIEW - Lorain-Carnegie Bridge"
 *     (Jet Lowe, HAER, public domain): the west end from below: pylon tower
 *     down to the ground, truss depth, arch springing on the piers;
 *   - "Hope Memorial Bridge, Cleveland, OH" (Bobport10, CC BY-SA 4.0),
 *     "Hope Memorial Bridge (12705200384)", "(15015005779)", "(8036218728)"
 *     (Erik Drost, CC BY 2.0): the pylons from the road: proportions,
 *     stepped crown, figure and vehicle, crenellated side tops, balustrade;
 *   - "Guardians of Traffic.jpg" (Erik Drost, CC BY 2.0): a Guardian close
 *     up (head, winged helmet, the wagon at arms' length, wings);
 *   - "Bridge and amphitheater.jpg" (brx0, CC BY-SA 2.0): an east pylon
 *     from the side, the crenellation, the green truss and pink fascia;
 *   - "Lorain-Carnegie Bridge - Cleveland.jpg" (Upstateherd, CC BY-SA 4.0):
 *     the whole north elevation.
 * - Night: "Innerbelt and Hope Memorial Bridge (31038233640)" (Erik Drost,
 *   CC BY 2.0): street lights along the parapets; the pylons have been
 *   floodlit since 2012 (Wikipedia), so the pylons and figures carry
 *   `_FLOODLIGHT`, the lamps are `lamp` points (sparser than the real ~36 m).
 *
 * Estimated: the arch rise (13% of each span, its crown 10.5 m under the
 * road, from the river photos), the truss depth at the top chord (2.6 m),
 * panel lengths (about 12 m; drawn sparser than the real ~6 m panels to
 * stay in budget), pier plans (4.6 m square columns under each truss line
 * with a cap beam between, from the photos; the real piers are paired
 * shafts), the approach trusses' depth, the abutment positions (y = -452,
 * +545, where lidar shows the deck meeting the ground), the Guardians'
 * proportions (scaled from the photos to the lidar pylon height), lamp
 * spacing. Colours from daylight photos: truss sage green (#7f9a8a ->
 * #86a191), piers cream concrete (#e2dccf), balustrade salmon (#e8a98d ->
 * #e3ad92), pylons Berea sandstone (#b89a76 -> #cdb592), figures a
 * deliberately darker stone (#8a7154), the north path's barrier concrete
 * (it was salmon, and showed as a pink sliver beside the pylons), and the
 * vehicles pale. Guardians' proportions: head top 12.5 m, shoulders 10.6 m,
 * hands 7-8 m over the road, from Erik Drost's "Hope Memorial Bridge
 * (12705200384)" (pylon height 218 px: head top at 88%, shoulders 73%, hands
 * 57%) and "Guardians of Traffic.jpg".
 *
 * Doubts: the pier at +442 is not seen in NAIP or lidar; the pier shafts
 * are simplified to one block per truss line; the lower (unused) deck is
 * not drawn; the south sidewalk side of the east pylons is seen only from
 * the road.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, bead, chamferedRect, face, footedLoft, footedWall, groundAt, parabola, piecewise, stations, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

// Map terrain (Mapterhorn) minus the river's reading (174.6 m), 5 m apart in the anchor's frame
// (x across from -22 to +38, y along from -560 to +600).
const GROUND: GroundGrid = {"y0":-560,"x0":-22,"step":5,"z":[[33,32.9,32.8,36.6,36.4,36.5,36.5,36.4,36.7,36.3,33.9,33.6,33.8],[32.9,32.7,32.8,36.1,36.7,36.6,36.6,36.5,36.8,36.4,34.2,33.5,33.7],[32.7,32.6,32.7,34.9,36.8,36.7,36.8,36.7,37,36.3,34.7,33.6,32.9],[32.6,32.5,32.5,34,37,36.9,36.9,36.8,37.1,36.1,34,32.8,32.7],[32.5,32.4,32.4,33.2,37.2,37,37,36.9,37.3,35.9,33.3,32.7,32.7],[32.4,32.3,32.4,32.6,37.3,37.2,37.2,37.1,37.4,35.9,33.3,32.7,32.8],[32.4,32.2,32.3,32.4,37.4,37.2,37.3,37.2,37.5,35.9,33.6,32.7,32.7],[32.3,32.2,32.3,32.3,37.5,37.4,37.4,37.3,37.6,35.9,33.5,32.6,32.6],[32.2,32.2,32.2,32.2,35.7,37.3,37.5,37.4,37.2,35.4,33.1,32.5,32.5],[32.1,32.2,32.2,32.1,32.3,32.3,33.6,36.6,36.5,33.4,32.3,32.3,32.3],[32.1,32.2,32.1,32.1,32.2,32.5,32.6,32.4,32.3,32.2,32.2,32.1,32.3],[32.1,32,32.1,32.3,32.5,32.8,32.8,32.5,32.1,32,32,32,32.1],[32,31.9,32.1,33.5,36.9,34,32.9,32.7,32.2,32.1,32.1,32,32],[31.9,31.9,32.2,34.3,38.1,37.9,37.6,35.2,33,32.3,32.1,32,32.1],[31.8,31.9,32.5,35,38.2,38,38,37.9,37.5,33.5,32.5,32.2,32],[31.7,31.9,33.1,35.6,38.3,38.1,38,38,38,35.4,33.4,32.3,32.1],[31.7,31.9,33.8,36.4,38.3,38.1,38.1,38,38.3,36.4,34,32.7,32.4],[31.7,32.2,34.6,37.2,38.4,38.2,38.2,38.1,38.4,36.8,34.3,33,33.7],[31.7,32.6,35.1,37.7,38.4,38.2,38.2,38.1,38.4,36.8,34.4,33.6,35.8],[31.7,33,35.4,37.9,38.4,38.2,38.2,38.2,38.5,36.9,34.5,32.9,33.9],[31.6,33.2,35.5,37.9,38.5,38.3,38.3,38.2,38.5,37,34.6,32.5,32.8],[31.4,33,35,36.9,38.4,38.3,38.3,38.2,38.6,37,34.6,32.3,32.6],[31.2,31.9,33.3,34.5,35.9,36.8,37.4,37.8,38.3,36.9,34.5,32.2,32],[31.1,31.2,31.4,32.3,33.4,34.5,35.1,35.8,36.5,35.7,33.7,31.7,31.8],[31.2,31.1,31,31,31.6,32.3,33,33.5,34.1,33.5,32.3,31.5,31.6],[31.1,31.1,31.1,31.1,31.2,31.2,31.2,31.4,31.7,31.5,31.2,31.3,31.3],[31.1,31.1,31,31,31.1,31.1,31.1,31.1,31.1,31,31,31,31],[31,31.1,31.1,31.1,31.2,31.1,31.2,31.2,31.1,31.1,30.9,30.9,30.8],[31,30.9,31,31.2,31.3,31.3,31.2,31.1,31,30.9,30.9,30.8,30.7],[30.9,30.9,30.9,31.3,31.7,31.5,31.5,31.4,31.3,31,30.9,30.9,30.7],[30.9,30.8,30.8,30.9,31.4,31.4,31.4,31.4,31.4,31.2,31.1,31,30.9],[30.9,30.8,30.8,30.8,31.1,31.2,31.3,31.4,31.5,31.2,31.2,31.2,31],[30.6,30.7,30.7,30.6,30.9,31,31.2,31.4,31.5,31.3,31.3,31.2,30.3],[30.3,30.2,30.4,30.3,30.6,30.9,31.2,31.5,31.8,31.3,30.3,28.9,27.3],[28,28.6,28.4,29,29.2,28.9,28.8,28.7,28.9,27.8,27,25.8,23.9],[25.2,26.2,25.5,25.6,25.3,24.9,24,23.7,25,23.7,23,21.3,20.4],[21.4,23.1,22.6,22.1,21.1,20.7,20.3,19.8,19.9,19.8,18.8,17.9,17.5],[18,19.2,19.5,19.2,17.9,17.6,17.2,16.9,16.9,17,16.4,16,16.1],[17.6,17.5,17.4,17.2,17,16.8,16.5,16.2,15.9,15.8,15.9,15.9,15.8],[17.4,17.3,17,17,16.8,16.6,16.4,16.2,15.8,15.7,15.7,15.7,15.6],[16.9,17.1,16.8,16.6,16.5,16.4,16.2,16,15.8,15.7,15.6,15.5,15.4],[15.9,16.6,16.7,16.6,16.5,16.2,16.1,15.8,15.7,15.5,15.5,15.4,15.3],[14.5,15.1,15.9,16.2,16.3,16.2,15.9,15.7,15.5,15.3,15.1,14.9,15],[14.3,14.5,14.7,15,15.3,15.4,15.5,15.5,15.4,15.4,15.3,15.2,14.9],[12.1,13.3,14.4,14.9,15.1,15.2,15.2,15.3,15.3,15.4,15.5,15.6,15.6],[10,10.9,11.9,12.8,13.3,13.5,13.8,14.1,14.5,15.1,15.3,15.4,15.5],[9.4,9.4,9.7,10.4,10.5,11.4,11.1,10.9,11.1,11.8,13,13.2,13.8],[9.2,9.1,9.2,9.7,9,9.4,9.5,9.4,9.2,9.3,9.8,10.1,8.4],[9.2,9.1,9.1,9.2,8.8,8.8,9,8.9,8.9,8.7,8.8,8.5,7.6],[9.2,9.1,9.4,8.8,8.7,8.7,8.7,8.7,8.7,8.5,7.9,7.5,7.5],[9.6,9,9.2,8.8,8.7,8.7,8.7,8.7,8.2,7.5,7.4,7.5,7.5],[9.5,9,8.7,8.8,8.8,8.5,8,7.6,7.5,7.5,7.5,7.5,7.5],[8.8,8.8,8.7,8.7,8.5,8.3,7.8,7.5,7.5,7.5,7.5,7.4,7.4],[8.8,8.5,8.4,7.8,7.5,7.5,7.5,7.5,7.5,7.4,7.4,7.5,7.4],[8,7.7,7.7,7.5,7.5,7.5,7.5,7.5,7.4,7.4,7.4,7.3,7.3],[7.6,7.5,7.5,7.5,7.5,7.5,7.4,7.4,7.4,7.3,7.2,7.3,7.3],[7.5,7.5,7.4,7.4,7.4,7.4,7.4,7.4,7.2,7.2,7.3,7.3,7.7],[7.5,7.4,7.4,7.4,7.4,7.4,7.3,7.1,7.1,7.1,7.3,7.7,7.5],[7.4,7.4,7.4,7.4,7.3,7.2,7.1,7,6.9,7,7.7,7.2,6.9],[7.3,7.4,7.4,7.1,6.9,6.9,6.9,6.8,6.8,7.1,7.2,6.9,6.2],[7.4,7.3,7.1,6.9,6.7,6.8,6.7,6.8,6.8,7,7.3,6,4.4],[7.1,7,6.8,6.6,6.7,6.7,6.7,6.7,6.7,6.6,5.9,3.6,3.5],[7,6.8,6.6,6.4,6.5,6.6,6.6,6.5,6.5,6.3,4.3,3.4,2.8],[6.8,6.6,5.9,6.5,6.8,6.9,6.7,6.4,6.2,5.8,3.9,2.8,2.3],[7,6.5,5.6,6.4,6.6,6.3,5.7,5.7,5.3,4,2.7,2.3,2.3],[7.1,6.1,4.8,4.9,4.9,4.8,4.5,4.4,3.7,2.6,2.4,2.3,2.3],[6.9,5.6,4.3,4,3.9,3.9,3.8,3.1,2.6,2.4,2.3,2.3,2],[6.6,4.9,3.9,3.6,3.5,3.4,3.2,2.5,2.4,2.3,2.2,2.1,2.4],[5.7,4.2,3.4,3.3,3.3,3.1,2.6,2.4,2.3,2.2,2.2,2.4,2.5],[3.8,3.2,3,2.9,2.7,2.6,2.5,2.4,2.2,2.2,2.4,2.5,2],[3,2.8,2.8,2.6,2.4,2.4,2.4,2.2,2.3,2.3,2.5,2.1,1.1],[2.7,2.6,2.5,2.4,2.4,2.3,2.2,2.4,2.3,2.4,2.3,1.5,0.1],[2.6,2.4,2.4,2.3,2.3,2.3,2.4,2.3,2.4,2.3,1.8,0.6,0],[2.3,2.3,2.3,2.2,2.4,2.5,2.3,2.3,2.3,2.1,1.1,0,0],[2.3,2.3,2.2,2.4,2.3,2.6,2.3,2.4,2.3,1.6,0.3,0,0],[2.2,2.2,2.5,2.3,2.2,2.3,2.4,2.5,2.2,1.1,0,0,0],[2.2,2.5,2.3,2.2,2.3,2.4,2.5,2.6,1.9,0.5,0,0,0],[2.4,2.2,2.2,2.2,2.3,2.5,2.5,2.3,1.3,0,0,0,0],[2.1,2.1,2.1,2.2,2.3,2.3,2.3,2.1,0.6,0,0,0,0],[2,2,2.2,2.3,2.3,1.8,1.2,0.2,0,0,0,0,0],[2,2.1,2.2,2.3,1.6,0.5,0,0,0,0,0,0,0],[2,2.2,2.1,1.7,0.5,0,0,0,0,0,0,0,0],[2,1.9,1.2,0.1,0,0,0,0,0,0,0,0,0],[1.3,0.5,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0.6,2.2],[0,0,0,0,0,0,0,0,0,0,1,3.1,2.9],[0,0,0,0,0,0,0,0,0.1,1.5,2.6,4.5,3.9],[0,0,0,0,0,0,0,0.4,2.1,2.4,4.6,5.3,5.3],[0,0,0,0,0,0.1,1,2.3,2.5,3.7,5.2,5.4,5.5],[0,0,0,0.1,0.2,0.9,2.1,2.6,2.5,4.5,5.3,3.9,3.8],[0,0,0,1.9,1.6,1.5,1.9,2.2,2.5,3,3.6,2.4,2.7],[0,0,0.1,3.2,3.6,2.6,1.7,1.7,1.8,2,2.3,2.3,2.7],[0,0.1,1.3,4.3,3.6,2.4,1.6,1.7,1.7,1.9,1.9,2.2,2.6],[0.2,1.8,2.9,3.7,2.2,2,1.8,1.7,1.6,1.7,1.8,2.1,2.6],[2.2,2.1,2.2,3.1,3.5,2.4,1.6,1.7,1.7,1.6,1.7,2,2.7],[2.1,2.2,2.3,3.5,3.8,2.6,1.8,1.6,1.5,1.5,1.6,2,3.4],[2.6,2.3,2.3,2.2,2.3,2.1,1.9,1.8,1.7,1.6,1.8,2,3.4],[2.6,2.1,2.1,2.1,2.2,2.4,2.4,1.9,1.7,1.7,1.8,1.9,2.5],[1.9,2,2,2,2,1.8,1.8,1.8,1.8,1.9,1.9,1.8,2.5],[1.8,1.9,2.1,2.1,2,1.9,1.9,1.8,1.9,2,2,1.9,2.7],[1.8,1.9,2,2.1,2.1,2,1.9,1.8,1.9,2,2,2,2.6],[1.8,1.9,1.9,2.1,2.1,2,1.9,1.8,1.9,2,2,2.1,3.9],[1.8,1.9,2,2.1,2.1,2,1.9,1.9,2,2.1,2.1,2.2,3.5],[2,2,2.1,2.2,2.1,2,1.9,2,2.1,2,2.1,2.2,2.2],[2.1,2.2,2.3,2.2,2.1,2.1,2.2,2.3,2.2,2.1,2.2,2.2,2.3],[2.3,2.3,2.4,2.5,2.5,2.5,2.6,2.6,2.5,2.5,2.3,2.4,2.9],[2.3,2.4,2.4,2.7,2.6,2.7,2.7,2.6,2.5,2.6,2.4,2.5,3.1],[2.3,2.3,2.4,2.6,2.8,2.8,2.7,2.7,2.7,2.8,2.5,2.7,2.8],[2.3,2.3,2.4,2.7,2.8,2.8,2.8,2.8,2.9,2.9,2.7,2.7,2.8],[2.3,2.4,2.5,2.6,2.7,2.8,2.8,2.8,2.8,2.8,2.7,2.7,2.7],[2.3,2.3,2.5,2.7,2.8,3.2,4,3.8,3.5,2.9,2.7,2.6,2.7],[2.3,2.4,2.9,2.8,3,5,6.4,6,5.4,3.8,2.7,2.7,2.7],[2.5,2.5,2.6,2.8,3.1,5.5,7.5,7.3,6.9,4.9,2.8,2.8,2.7],[2.6,2.6,2.7,2.9,2.9,5,6.9,6.9,7.1,5.9,3.2,2.7,2.8],[2.7,2.8,2.9,2.9,2.8,3.4,5.6,6.7,7.8,6.8,3.9,2.7,2.7],[2.8,2.8,3,3,2.9,2.8,4.6,5.2,5.6,5,3.5,2.7,2.7],[2.6,2.7,2.7,2.9,2.9,2.7,3.6,3.8,3.7,2.7,2.6,2.6,2.7],[2.5,2.6,2.7,2.9,2.9,2.8,2.8,2.8,2.8,2.8,2.7,2.7,2.7],[2.5,2.6,3,3.1,3.1,3,2.9,2.9,2.9,2.9,2.9,2.8,2.7],[2.5,2.7,3.1,3.3,3.1,3.1,3,3,2.9,2.8,2.8,2.8,2.7],[2.5,2.7,2.8,2.8,2.7,2.7,2.7,2.7,2.6,2.7,2.7,2.8,2.7],[2.6,2.6,2.7,2.7,2.7,2.6,2.5,2.5,2.5,2.6,2.6,2.6,2.7],[2.6,2.6,2.5,2.5,2.5,2.4,2.4,2.4,2.5,2.4,2.5,2.6,2.8],[2.5,2.3,2.3,2.3,2.3,2.3,2.4,2.8,3.5,3.5,2.8,2.5,2.5],[2.5,2.3,2.3,2.3,2.3,2.3,2.4,3.6,4.9,5.1,5.1,4.4,4.1],[2.5,2.4,2.3,2.3,2.3,2.3,2.5,3.6,4.9,5.1,5.2,5.3,5.2],[4.2,4.5,3.9,4.1,3.1,2.4,2.6,3.3,4,5,5.3,5.4,5.4],[5.7,5.6,5.7,5,2.7,2.4,2.4,2.4,2.5,3,3.4,4.1,4.4],[4.6,5,4.6,4.3,2.6,2.3,2.4,2.4,2.5,2.4,2.5,2.6,2.7],[2.6,2.5,2.6,2.5,2.4,2.3,2.5,2.5,2.5,2.4,2.5,2.6,2.7],[2.6,2.5,2.6,2.5,2.4,2.4,2.4,2.5,2.6,2.5,2.5,2.7,2.7],[2.5,2.5,2.7,3.2,2.5,2.5,2.5,2.5,2.7,2.5,2.4,2.6,2.6],[2.6,2.6,2.6,2.7,2.7,2.7,2.8,2.9,2.9,2.6,2.7,2.8,2.7],[2.8,2.7,2.9,3.5,3.1,3,3.1,3.9,4.3,3.2,3.9,5.1,3.7],[2.7,2.7,3.8,4.5,3.4,2.9,3.1,4.2,5.4,5.3,5.6,4.8,4.6],[3.4,3.5,4.1,4.4,3.8,3.6,3.5,4.2,4.8,5.1,5.7,4.8,4.4],[2.7,2.7,2.7,2.9,3.2,3.2,3.1,3.2,3.4,4.2,5.2,5.1,4.3],[2.8,2.8,2.7,2.8,3,3.1,3,3,3.1,3.8,4.7,4,5],[3.2,2.8,2.8,2.8,2.9,3,2.8,2.9,2.9,3.1,3.8,5.2,8.1],[3.4,2.8,2.8,2.8,2.8,2.8,2.6,2.6,2.6,3.6,4,6.4,9.7],[2.9,2.8,2.6,2.6,2.5,2.5,2.5,2.6,2.6,3.7,3.8,7.3,10.6],[2.6,2.5,2.5,2.5,2.5,2.5,2.6,2.7,2.9,3.2,4.3,7.9,11.3],[2.6,2.7,2.6,2.6,2.7,2.7,2.8,3.1,3.5,3.9,4.3,7.9,11.3],[2.7,2.7,3.2,3.6,4.3,4.3,4.3,5,6.2,6.8,4.2,6.8,10.2],[2.7,2.7,2.9,3.2,3.3,4.8,5.4,5.7,6.2,7,4.8,6.3,9.7],[2.7,2.7,2.9,2.8,3.2,4.4,4.4,5,5.6,5.1,4.2,6.8,10.1],[2.7,2.7,2.9,2.8,2.9,3,3,3.6,4.4,3.7,4.6,7.6,10.7],[2.7,2.7,2.9,2.8,2.9,3.1,3.4,3.5,3.8,4.7,6.1,8.2,11],[2.7,2.6,3,2.9,3.6,3.8,4.2,5,5.9,7.5,9.2,10.8,12.8],[2.7,2.7,2.9,3.3,5.9,5.7,5,6.9,8.8,10.4,12.1,13,13.6],[2.7,2.7,2.9,3.6,5.6,5.7,6.2,8.1,10,10.5,10.9,11.6,12.5],[2.7,2.7,2.9,3,3.1,3.9,5.8,8,10,10.2,10.6,7.2,7.4],[2.7,2.7,3,3.1,3.1,3.7,4,6.1,8.2,7,4.9,3.7,4.1],[2.7,2.7,2.9,3.1,3,3.1,3.1,3.2,3.3,3.2,3.2,3.2,3.2],[2.8,2.8,2.9,3.1,3,3.1,3.1,3.2,3.2,3.2,3.2,3.1,3.2],[2.8,2.8,2.9,3.1,3.2,3.2,3.3,3.3,3.2,3.2,3.1,3.1,3.1],[2.9,2.9,2.9,3,3,3,3.1,3.1,3.1,3.1,3.1,3.2,3.2],[3,3,3,3,3,3,3.1,3.1,3.2,3.2,3.2,3.2,3.2],[3,3,3,3,3.3,3.5,3.6,3.5,3.5,3.5,3.4,3.4,3.3],[3.1,3,3,3.4,3.8,3.7,3.8,3.8,3.8,3.8,3.6,3.5,3.4],[3.1,3,3.1,3.5,3.8,3.9,3.9,3.8,3.8,3.8,3.6,3.5,3.3],[3.2,3,3,3.4,3.8,3.9,3.9,3.9,3.9,3.8,3.6,3.5,3.3],[3.2,3,3,3.3,3.6,3.8,3.9,3.9,3.9,3.7,3.6,3.5,3.4],[3.1,3,3,3.3,3.5,3.7,3.8,3.8,3.8,3.7,3.6,3.5,3.4],[3.1,3.1,3,3.2,3.5,3.6,3.8,3.8,3.8,3.7,3.7,3.6,3.5],[3.2,3.1,3,3.1,3.4,3.6,3.7,3.7,3.7,3.6,3.5,3.5,3.5],[3.2,3.1,3,3.1,3.3,3.5,3.6,3.6,3.6,3.6,3.5,3.5,3.4],[3.2,3.1,3,3,3.2,3.4,3.6,3.6,3.6,3.5,3.4,3.5,3.6],[3.2,3,3,3,3.2,3.3,3.4,3.5,3.5,3.4,3.5,3.5,3.4],[3,3,3,2.9,3.2,3.2,3.2,3.2,3.2,3.4,3.4,3.5,3.2],[2.9,2.9,2.9,2.8,3.1,3.1,3,3,3,3.1,2.9,2.8,2.8],[2.9,2.8,2.8,2.8,2.8,2.9,2.8,2.8,2.7,2.6,2.6,2.6,2.6],[2.8,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.6,2.6,2.7,2.7,2.7],[2.8,2.8,2.8,2.8,2.7,2.6,2.7,2.6,2.6,2.5,2.5,2.5,2.5],[2.7,2.8,2.7,2.7,2.6,2.5,2.6,2.6,2.6,2.6,2.7,2.8,2.9],[2.9,2.9,2.9,2.9,2.8,2.8,2.9,3,3.1,3.1,3.2,3.2,3.3],[3.3,3.3,3.3,3.3,3.3,3.3,3.4,3.5,3.6,3.7,3.7,3.8,3.9],[3.8,3.9,3.9,3.9,3.9,3.9,3.9,4,4.1,4.1,4.2,4.3,4.2],[4.2,4.2,4.3,4.1,4,3.9,4,4,4.1,4.2,4.2,4.2,4.2],[4.2,4.2,4.3,4.2,4.1,4,4.1,4.1,4.2,4.2,4.2,4.2,4.2],[4.3,4.3,4.3,4.4,4.4,4.4,4.4,4.3,4.4,4.5,4.3,4.2,4.3],[4.3,4.3,4.4,4.5,4.7,4.5,4.6,4.6,4.6,4.6,4.4,4.3,4.3],[4.3,4.3,4.4,4.5,4.5,4.4,4.4,4.5,4.4,4.4,4.4,4.3,4.2],[4.3,4.4,4.3,4.4,4.3,4.2,4.2,4.3,4.3,4.3,4.3,4.2,4.2],[4.2,4.3,4.3,4.3,4.2,4.2,4.2,4.2,4.2,4.2,4.3,4.2,4.2],[4.2,4.3,4.3,4.3,4.2,4,4,4.1,4.2,4.2,4.3,4.2,4],[4.1,4.3,4.4,4.3,4.2,4.1,3.8,3.7,3.6,3.4,3.3,3.3,3.3],[4.1,3.9,3.8,3.6,3.4,3.3,3.4,3.4,3.4,3.3,3.3,3.3,3.2],[3.1,3.1,3.1,3.2,3.3,3.3,3.3,3.6,3.8,3.2,3.3,3.3,3.3],[3.1,3.2,3.2,3.2,3.2,3.2,3.3,3.7,3.4,3.5,3.9,3.5,3.5],[3.1,3.1,3.1,3.1,3,3.1,3.6,3.8,4.2,4.1,4.5,4.7,5.4],[2.9,3,3,3.5,4.2,5.6,6,6.5,7.2,7,7,7.3,7.8],[3.6,4,5.3,6.1,7.4,8.5,8.7,9.3,10.2,10.9,10.5,10.3,10.3],[6,7.4,8.7,9.4,10.5,11,10.9,10.9,10.9,11,11.1,11.2,11.3],[7.6,9.4,11,11,10.9,10.9,11,11,11,11,11.2,11.2,11.2],[8.5,10.3,10.6,10.7,10.8,10.9,11,11,11,11,11,11.1,11.1],[9.3,10.6,10.6,10.7,10.9,11,11,11,10.9,10.9,11,11.1,11.1],[10.2,10.6,10.9,10.7,10.8,10.9,10.9,10.9,10.9,10.8,10.8,10.8,10.8],[10.6,10.6,10.6,10.6,10.7,10.8,10.8,10.8,10.8,10.8,10.8,10.9,10.9],[10.3,10.4,10.5,10.6,10.7,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.9],[10.4,10.5,10.6,10.7,10.7,10.8,10.8,10.8,10.9,10.9,10.9,11,11.5],[10.3,10.4,10.5,10.8,11.1,11.8,12.2,12.4,12.5,12.4,13.7,14.9,15.8],[10.5,10.5,10.7,12,12.9,13.6,13.9,14.2,14.4,15.3,16.2,16.6,16.7],[10.7,10.7,11.1,12.5,14.8,14.8,15.3,15.8,16.1,16.6,16.6,16.6,16.7],[11,11.1,11.7,13.2,15.8,16,16.3,16.4,16.5,16.5,16.6,16.7,16.9],[11.6,12.4,13.5,15,15.9,16.1,16.3,16.4,16.6,16.6,16.8,17.1,17.5],[12.5,13.7,15,15.7,15.9,16.2,16.3,16.5,16.6,16.7,17.2,17.7,18.2],[13.5,14.4,15.2,15.8,16.1,16.3,16.5,16.6,16.8,17.1,17.8,18.5,19.3],[14.1,14.7,15.3,15.6,15.8,16.2,16.5,16.8,17.1,17.8,18.9,19.8,21.7],[14.2,14.7,15.1,15.6,16.1,16.5,16.8,17.1,17.4,18.7,20.4,21.6,23.7],[13.9,14.7,15.7,16.4,16.8,17,17.2,17.4,17.7,19.5,22.3,23.4,25.9],[14.1,15.7,16.9,17.3,17.9,18.2,19.8,21.4,23.2,22.1,24.8,26.1,27.9],[15.4,17.3,18.8,19.4,20,21.3,22.9,24.5,26,27.2,28.3,28.8,29.2],[16.4,18.8,21.1,21.9,23.6,26,27.1,27.9,28.8,29.4,29.3,29.5,29.4],[17.6,20.3,22.8,24.5,25.9,27.6,28.6,29.2,29.9,29.8,29.4,29.6,29.6],[18.4,21.5,24.4,26.9,27.5,28.1,29.2,30.3,30.8,30,29.4,29.9,29.7],[19,21.8,24.9,28,29.4,30.8,30.9,31.1,31,29.9,29.4,29.6,29.6],[19.1,22.1,24.9,28,29.8,31.1,31,31,31,30.2,29.4,29.9,29.7],[19.1,22.3,25.4,28,29.5,31,30.9,30.9,30.9,30.7,29.4,29.7,29.6],[19.1,22.5,25.8,28.1,29.2,30.8,30.8,30.8,30.8,30.8,29.4,29.5,29.5],[19.3,22.7,25.8,28.2,29.2,30.7,30.6,30.7,30.6,30.8,29.3,29.5,29.5],[19.5,22.6,25.8,28.2,29.1,30.7,30.5,30.6,30.5,30.7,29.3,29.4,29.4],[19.7,22.8,25.9,28.2,29.4,30.6,30.4,30.5,30.4,30.5,29.3,29.4,29.4],[20.1,22.9,26,28,29.3,30.5,30.3,30.4,30.3,30.3,29.3,29.3,29.5],[21.1,23.4,26.1,28,29,30.4,30.2,30.3,30.2,30.2,29.6,29.4,29.4]]}
// The deck's centre line runs 8.2 m to the south-east of the outline's centroid (the anchor).
const XC = 8.5
const gnd = (u: number, y: number) => Math.max(0, groundAt(GROUND, u + XC, y))

// Roadway on the centre line, lidar lower quartile, metres above the river (NAVD88 − 174.6).
const ROAD: [number, number][] = [[-560.0, 36.5], [-540.0, 37.07], [-520.0, 37.5], [-500.0, 37.87], [-480.0, 38.11], [-460.0, 38.25], [-440.0, 38.33], [-420.0, 38.52], [-400.0, 38.81], [-380.0, 39.12], [-360.0, 39.49], [-340.0, 39.78], [-320.0, 40.11], [-300.0, 40.43], [-280.0, 40.78], [-260.0, 41.13], [-240.0, 41.49], [-220.0, 41.8], [-200.0, 42.12], [-180.0, 42.45], [-160.0, 42.82], [-140.0, 43.04], [-120.0, 43.1], [-100.0, 43.04], [-80.0, 42.82], [-60.0, 42.46], [-40.0, 42.1], [-20.0, 41.75], [0.0, 41.37], [20.0, 41.04], [40.0, 40.65], [60.0, 40.27], [80.0, 39.92], [100.0, 39.54], [120.0, 39.18], [140.0, 38.82], [160.0, 38.43], [180.0, 38.07], [200.0, 37.69], [220.0, 37.32], [240.0, 36.95], [260.0, 36.63], [280.0, 36.26], [300.0, 35.88], [320.0, 35.53], [340.0, 35.16], [360.0, 34.79], [380.0, 34.44], [400.0, 34.04], [420.0, 33.68], [440.0, 33.33], [460.0, 32.95], [480.0, 32.6], [500.0, 32.21], [520.0, 31.84], [540.0, 31.47], [560.0, 31.08], [580.0, 30.7], [600.0, 30.26]]
const road = piecewise(ROAD)

const SUP = [-387.5, -320, -234, -158, -68, 10, 78, 146, 216, 278, 332, 388, 442, 492.3] // pylons at the ends, piers between
const PYLON_HY = 5.0                // pylon towers' half-length along the bridge
const POST_HY = 3.8                 // pier posts' half-length along the bridge
const PARA = 11.6, PARA_T = 0.5, PARA_H = 1.3   // parapet centre line, thickness, height above the road
const EDGE = 13.4                   // deck edge (outer face of the fascia)
const FASCIA = 1.4                  // fascia depth below the road
const TRUSS = 11.5, CHORD_W = 1.0   // truss planes, chord width across
const SOFFIT = 2.6                  // top chord bottom / deck underside below the road
const CROWN = 10.5                  // arch's lower edge at mid span, below the road
const ARCH_H = 1.5                  // depth of the arched lower chord
const PYLON_U = 12.9, PYLON_HX = 2.3, PYLON_TOP = 13.7
const END_W = -556, END_E = 596     // parapets and fascias, end to end (the outline runs on at grade)
const ABUT_W = -452, ABUT_E = 545   // approach abutments (ground meets the road beyond them)

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** The four sides and top of an upright box (bottom optional). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true, bottom = false) {
  if (top) face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** A band in a vertical plane u = const, between two curves, faces as asked; `s` is the side (±1) for "out". */
function vband(p: Part, u0: number, u1: number, ys: number[], top: (y: number) => number, bot: (y: number) => number, f: { out?: boolean; in?: boolean; top?: boolean; bottom?: boolean }) {
  const s = Math.sign(u0 + u1) || 1
  const uo = s > 0 ? Math.max(u0, u1) : Math.min(u0, u1), ui = s > 0 ? Math.min(u0, u1) : Math.max(u0, u1)
  for (let i = 0; i < ys.length - 1; i++) {
    const ya = ys[i], yb = ys[i + 1], ta = top(ya), tb = top(yb), ba = bot(ya), bb = bot(yb)
    if (f.out) face(p, [uo, ya, ba], [uo, yb, bb], [uo, yb, tb], [uo, ya, ta], [s, 0, 0])
    if (f.in) face(p, [ui, ya, ba], [ui, yb, bb], [ui, yb, tb], [ui, ya, ta], [-s, 0, 0])
    if (f.top) face(p, [ui, ya, ta], [uo, ya, ta], [uo, yb, tb], [ui, yb, tb], norm([0, -(tb - ta), yb - ya]))
    if (f.bottom) face(p, [ui, ya, ba], [uo, ya, ba], [uo, yb, bb], [ui, yb, bb], norm([0, bb - ba, -(yb - ya)]))
  }
}

const steel = new Part(), concrete = new Part(), salmon = new Part(), stone = new Part(), figure = new Part(), lamps = new Part()
const SIDES = [-1, 1]
/** y stations every `step`, with the road profile's breaks. */
const ysBetween = (a: number, b: number, step: number) => stations(a, b, step)

// ---- Parapets, walkways, fascias, soffit ---------------------------------------------------------
{
  const ys = ysBetween(END_W, END_E, 38)
  for (const s of SIDES) {
    // Parapet (balustrade read as a solid band) on each deck edge.
    vband(salmon, s * (PARA - PARA_T / 2), s * (PARA + PARA_T / 2), ys, (y) => road(y) + PARA_H, (y) => road(y), { in: true, top: true })
    // The ledge outside the parapet and the fascia with its cornice, down to the soffit of the overhang.
    vband(salmon, s * (PARA + PARA_T / 2), s * EDGE, ys, (y) => road(y) + 0.05, (y) => road(y) - FASCIA, { out: true, top: true, bottom: true })
  }
  // North multi-use path (2012) behind its barrier; south sidewalk on its curb.
  vband(concrete, -11.2, -6.9, ys, (y) => road(y) + 0.15, (y) => road(y) - 0.2, { top: true })
  vband(concrete, -6.9, -6.5, ys, (y) => road(y) + 1.0, (y) => road(y) - 0.2, { in: true, top: true }) // concrete barrier, as the road photos show
  vband(concrete, 9.0, 11.2, ys, (y) => road(y) + 0.2, (y) => road(y) - 0.2, { top: true, in: true })
  // Underside of the upper deck between the trusses, from abutment to abutment.
  const yd = ysBetween(ABUT_W, ABUT_E, 33)
  vband(steel, -TRUSS, TRUSS, yd, (y) => road(y) - SOFFIT + 0.1, (y) => road(y) - SOFFIT, { bottom: true })
}

// ---- Main trusses: an arched lower chord in every span, posts and diagonals up to a straight top chord ----
type Span = { a: number; b: number; rise: number }
const spans: Span[] = []
for (let i = 0; i < SUP.length - 1; i++) {
  const a = SUP[i] + (i === 0 ? PYLON_HY : POST_HY), b = SUP[i + 1] - (i === SUP.length - 2 ? PYLON_HY : POST_HY)
  spans.push({ a, b, rise: 0.13 * (SUP[i + 1] - SUP[i]) })
}
const archLow = (sp: Span) => {
  const m = (sp.a + sp.b) / 2
  return parabola([sp.a, road(sp.a) - CROWN - sp.rise], [m, road(m) - CROWN], [sp.b, road(sp.b) - CROWN - sp.rise])
}
for (const sp of spans) {
  const low = archLow(sp)
  const n = Math.max(6, Math.round((sp.b - sp.a) / 12))
  const pts = stations(sp.a, sp.b, (sp.b - sp.a) / n)
  for (const s of SIDES) {
    const u0 = s * (TRUSS - CHORD_W / 2), u1 = s * (TRUSS + CHORD_W / 2), uc = s * TRUSS
    // Top chord under the fascia, and the arched lower chord.
    // The steel is double-sided, so one face per side of a chord reads from both sides.
    vband(steel, u0, u1, pts, (y) => road(y) - FASCIA, (y) => road(y) - SOFFIT, { out: true })
    vband(steel, u0, u1, pts, (y) => low(y) + ARCH_H, low, { out: true, bottom: true })
    // Posts at the panel points and one diagonal per panel, alternating (Warren with verticals).
    pts.forEach((y, i) => {
      const zb = low(y) + ARCH_H, zt = road(y) - SOFFIT
      if (i > 0 && i < pts.length - 1) strip(steel, [uc, y, zb], [uc, y, zt], 0.6, [1, 0, 0])
      if (i < pts.length - 1) {
        const y2 = pts[i + 1], mid = (sp.a + sp.b) / 2
        // Diagonals lean down toward the piers, as the photos show.
        const [ya, yb] = (y + y2) / 2 < mid ? [y, y2] : [y2, y]
        strip(steel, [uc, ya, low(ya) + ARCH_H], [uc, yb, road(yb) - SOFFIT], 0.55, [1, 0, 0])
      }
    })
  }
}

// ---- Piers: a block under each truss line to the springing, a cap beam between them, and a post up to the deck ----
SUP.slice(1, -1).forEach((yc, k) => {
  const i = k + 1
  const hy = POST_HY
  const left = spans[i - 1], right = spans[i]
  const zs = Math.min(archLow(left)(left.b), archLow(right)(right.a)) - 0.3
  for (const s of SIDES) {
    const u0 = s > 0 ? 9.2 : -13.8, u1 = s > 0 ? 13.8 : -9.2
    footedLoft(concrete, gnd, [
      { plan: chamferedRect(u0, u1, yc - hy, yc + hy, 0), z: 'ground' },
      { plan: chamferedRect(u0, u1, yc - hy, yc + hy, 0), z: road(yc) - FASCIA },
    ], 6)
  }
  box(concrete, -9.2, 9.2, yc - hy + 1, yc + hy - 1, zs - 2.6, zs, false, true)
})

// ---- Approach spans: parallel-chord deck trusses to the abutments ---------------------------------
for (const [a, b, depth] of [[ABUT_W, SUP[0] - PYLON_HY, 4.0], [SUP[SUP.length - 1] + PYLON_HY, ABUT_E, 6.0]] as [number, number, number][]) {
  const n = Math.round((b - a) / 11), pts = stations(a, b, (b - a) / n)
  const low = (y: number) => road(y) - SOFFIT - depth
  for (const s of SIDES) {
    const u0 = s * (TRUSS - CHORD_W / 2), u1 = s * (TRUSS + CHORD_W / 2), uc = s * TRUSS
    vband(steel, u0, u1, pts, (y) => road(y) - FASCIA, (y) => road(y) - SOFFIT, { out: true })
    vband(steel, u0, u1, pts, (y) => low(y) + 1.0, low, { out: true })
    pts.forEach((y, i) => {
      if (i > 0 && i < pts.length - 1) strip(steel, [uc, y, low(y) + 1.0], [uc, y, road(y) - SOFFIT], 0.5, [1, 0, 0])
      if (i < pts.length - 1) {
        const y2 = pts[i + 1], [ya, yb] = i % 2 ? [y, y2] : [y2, y]
        strip(steel, [uc, ya, low(ya) + 1.0], [uc, yb, road(yb) - SOFFIT], 0.5, [1, 0, 0])
      }
    })
  }
}
// Abutment walls, feet on the terrain.
for (const [y0, y1] of [[ABUT_W - 4, ABUT_W], [ABUT_E, ABUT_E + 4]]) {
  const t = Math.min(road(y0), road(y1)) - FASCIA
  footedLoft(concrete, gnd, [
    { plan: chamferedRect(-EDGE, EDGE, y0, y1, 0), z: 'ground' },
    { plan: chamferedRect(-EDGE, EDGE, y0, y1, 0), z: t },
  ], 5, false)
}
// Beyond the abutments the road runs on fill: retaining walls under the fascias where the ground is close below.
for (const [a, b] of [[END_W, ABUT_W - 4], [ABUT_E + 4, END_E]]) {
  for (const y of stations(a, b, 5).slice(0, -1)) {
    const y2 = y + (b - a) / Math.ceil((b - a) / 5)
    for (const s of SIDES) {
      const da = road(y) - FASCIA - gnd(s * EDGE, y), db = road(y2) - FASCIA - gnd(s * EDGE, y2)
      if (da < 0.3 || db < 0.3 || da > 4 || db > 4) continue // at grade, or West 18th Street passes under
      footedWall(concrete, [s * EDGE, y], [s * EDGE, y2], gnd, (_x, yy) => road(yy) - FASCIA, [s, 0, 0], 5)
    }
  }
}
// West 18th Street passes obliquely under the fill at y ≈ -512 to -503 (OSM way/11799036; lidar
// roadway 5 m over the bare earth there): the short span's two abutment faces, parallel to the street,
// from the map's terrain up to the fascia's foot.
{
  const street = (u: number) => -516 + ((u + 23.5) * 18) / 53 // the street's centre line, in this frame
  for (const [off, side] of [[-8, -1], [8, 1]] as [number, number][]) {
    const a: [number, number] = [-EDGE, street(-EDGE) + off], b: [number, number] = [EDGE, street(EDGE) + off]
    footedWall(concrete, a, b, gnd, (u, y) => Math.max(road(y) - FASCIA, gnd(u, y) + 0.05), norm([-(18 / 53) * side, side, 0]), 4)
  }
}


// ---- Pylons: the Guardians of Traffic ------------------------------------------------------------
/**
 * A block standing on a pylon's end face: `du` across (about the pylon's centre line), `dp` proud of
 * the face (outward), z above the road. Only the faces asked for are drawn: the back is always
 * against the pylon or the figure behind it.
 */
function relief(p: Part, cu: number, f: number, s: number, du: [number, number], dp: [number, number], z: [number, number], r0: number,
  want: { sides?: boolean; top?: boolean; bottom?: boolean } = { sides: true, top: true }) {
  const [u0, u1] = [cu + du[0], cu + du[1]], [p0, p1] = [f + s * dp[0], f + s * dp[1]], [z0, z1] = [r0 + z[0], r0 + z[1]]
  face(p, [u0, p1, z0], [u1, p1, z0], [u1, p1, z1], [u0, p1, z1], [0, s, 0])                       // front
  if (want.sides) {
    face(p, [u0, p0, z0], [u0, p1, z0], [u0, p1, z1], [u0, p0, z1], [-1, 0, 0])
    face(p, [u1, p0, z0], [u1, p1, z0], [u1, p1, z1], [u1, p0, z1], [1, 0, 0])
  }
  if (want.top) face(p, [u0, p0, z1], [u1, p0, z1], [u1, p1, z1], [u0, p1, z1], [0, 0, 1])
  if (want.bottom) face(p, [u0, p0, z0], [u1, p0, z0], [u1, p1, z0], [u0, p1, z0], [0, 0, -1])
}

/** A wing slab on a pylon's long side (plane u = uo, proud `t` of it), its outline (y, z) given as a quad. */
function wing(p: Part, uo: number, su: number, t: number, q: [number, number][]) {
  const o = q.map(([y, z]) => [uo + su * t, y, z] as V3), i = q.map(([y, z]) => [uo, y, z] as V3)
  face(p, o[0], o[1], o[2], o[3], [su, 0, 0])
  for (let k = 0; k < 4; k++) {
    const a = o[k], b = o[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
    const e: V3 = [0, b[1] - a[1], b[2] - a[2]], n: V3 = norm([0, e[2], -e[1]])
    // Edge normals point away from the quad's centre.
    const mid: V3 = [0, (a[1] + b[1]) / 2 - q.reduce((m, v) => m + v[0], 0) / 4, (a[2] + b[2]) / 2 - q.reduce((m, v) => m + v[1], 0) / 4]
    face(p, a, b, c, d, n[1] * mid[1] + n[2] * mid[2] >= 0 ? n : [0, -n[1], -n[2]])
  }
}

/**
 * One pylon above the deck at (cu, cy), standing on the road level r0, with a Guardian on each end
 * face. Proportions from Erik Drost's close-ups and the road views, scaled to the lidar pylon (13.7 m
 * over the road, 4.6 m across, 7 m shaft + the figures = 9.9 m long): the robe's pleated lower body
 * as a panel down to the plinth, the vehicle held level across the body on both hands at 7-8.9 m,
 * the bare torso and shoulders, the head with its winged helmet standing forward of the face in the
 * stepped niche of the crown, and the great wings spread back along both long sides. The figure is
 * drawn in a darker stone than the pylon so it reads at a distance, as its deep relief does in the
 * photos.
 */
function pylon(cu: number, cy: number, r0: number) {
  const hx = PYLON_HX, hy = 3.5
  box(stone, cu - hx - 0.3, cu + hx + 0.3, cy - hy - 0.3, cy + hy + 0.3, r0 - 0.2, r0 + 1.0)        // plinth
  box(stone, cu - hx, cu + hx, cy - hy, cy + hy, r0 + 1.0, r0 + 12.4, false)                          // shaft
  // Crown: seen end-on, upright sides with 45° shoulders up to a flat top (the stepped frame behind the head).
  const zA = r0 + 12.4, zB = r0 + 12.9, zT = r0 + PYLON_TOP, ht = 1.35
  const prof: [number, number][] = [[-hx, zA], [hx, zA], [hx, zB], [ht, zT], [-ht, zT], [-hx, zB]]
  for (let i = 1; i < prof.length - 1; i++) {
    const [ua, za] = prof[i], [ub, zb] = prof[i + 1]
    const n = norm([zb - za, 0, -(ub - ua)])
    face(stone, [cu + ua, cy - hy, za], [cu + ub, cy - hy, zb], [cu + ub, cy + hy, zb], [cu + ua, cy + hy, za], n)
  }
  for (const s of SIDES) {
    const yy = cy + s * hy
    const poly = prof.map(([u, z]) => [cu + u, yy, z] as V3)
    for (let i = 1; i < poly.length - 1; i++) {
      const g = cross(sub(poly[i], poly[0]), sub(poly[i + 1], poly[0]))
      if (g[1] * s >= 0) stone.tri(poly[0], poly[i], poly[i + 1]); else stone.tri(poly[0], poly[i + 1], poly[i])
    }
  }
  // Merlons along the long sides' tops (the crenellation the side views show).
  for (const su of SIDES) for (const k of [-1.6, 1.6]) {
    const uo = cu + su * (hx + 0.15), ui = cu + su * (hx - 0.55)
    box(stone, Math.min(ui, uo), Math.max(ui, uo), cy + k - 0.5, cy + k + 0.5, zA - 0.6, zB + 0.35)
  }
  for (const s of SIDES) {
    const f = cy + s * hy
    const R = (du: [number, number], dp: [number, number], z: [number, number], w?: Parameters<typeof relief>[7], p = figure) => relief(p, cu, f, s, du, dp, z, r0, w)
    // The niche: a raised stone frame round the head, under the crown's shoulders.
    R([-hx, -1.45], [0, 0.3], [9.6, 12.9], { sides: true }, stone)
    R([1.45, hx], [0, 0.3], [9.6, 12.9], { sides: true }, stone)
    R([-1.45, 1.45], [0, 0.3], [12.6, 12.9], { bottom: true }, stone)
    // The figure.
    R([-1.3, 1.3], [0, 0.55], [1.0, 7.0], { sides: true })                    // robe, legs
    R([-0.45, 0.45], [0.55, 0.8], [1.0, 7.0], { sides: true })                // its pleated centre panel
    R([-2.15, 2.15], [0.2, 1.95], [7.0, 8.0], { sides: true, top: true, bottom: true }) // both hands under the vehicle
    R([-1.6, 1.6], [0.6, 1.8], [8.0, 9.0], { sides: true, top: true }, stone) // the vehicle (a covered wagon, a truck...), pale against the figure
    R([-1.75, 1.75], [0, 1.0], [8.0, 10.6], { sides: true, top: true })       // torso and shoulders
    R([-0.72, 0.72], [0.15, 1.45], [10.7, 12.5], { sides: true, top: true, bottom: true }) // head, forward of the face
    for (const su of SIDES) R(su < 0 ? [-1.0, -0.72] : [0.72, 1.0], [0.3, 1.0], [11.4, 12.4], { sides: true, top: true }) // helmet's wings
    // The great wings on the long sides: a long lower slab of primaries and a shorter covert slab over it.
    for (const su of SIDES) {
      const uo = cu + su * hx, back = (d: number) => f - s * d
      wing(figure, uo, su, 0.4, [[f, r0 + 6.6], [f, r0 + 12.0], [back(2.8), r0 + 11.2], [back(2.8), r0 + 8.8]])
      wing(figure, uo + su * 0.4, su, 0.3, [[f, r0 + 9.6], [f, r0 + 12.0], [back(1.7), r0 + 11.6], [back(1.7), r0 + 10.6]])
    }
  }
}
for (const [k, yc] of [[0, SUP[0]], [1, SUP[SUP.length - 1]]] as [number, number][]) {
  const r0 = road(yc)
  for (const s of SIDES) {
    // The masonry tower under the pylon, down to the ground.
    footedLoft(stone, gnd, [
      { plan: chamferedRect(s * PYLON_U - 2.8, s * PYLON_U + 2.8, yc - PYLON_HY - 0.3, yc + PYLON_HY + 0.3, 0.3), z: 'ground' },
      { plan: chamferedRect(s * PYLON_U - 2.6, s * PYLON_U + 2.6, yc - PYLON_HY, yc + PYLON_HY, 0.2), z: r0 - 0.2 },
    ], 4.5, false)
    pylon(s * PYLON_U, yc, r0)
  }
  // Abutment pier between the towers, under the deck.
  footedLoft(concrete, gnd, [
    { plan: chamferedRect(-10.4, 10.4, yc - 4, yc + 4, 0), z: 'ground' },
    { plan: chamferedRect(-10.4, 10.4, yc - 4, yc + 4, 0), z: road(yc) - SOFFIT },
  ], 5)
  void k
}

// ---- Lamps: the tall street lights along both parapets --------------------------------------------
for (const y of stations(END_W + 10, END_E - 10, 75)) {
  if (SUP.some((p) => Math.abs(y - p) < 7) && (y < -380 || y > 480)) continue
  for (const s of SIDES) bead(lamps, [s * (PARA - 1.2), y, road(y) + 9.5], 0.6, true)
}

// ---- Write ---------------------------------------------------------------------------------------
// Everything above is built about the deck's centre line; shift it onto the anchor's frame.
for (const p of [steel, concrete, salmon, stone, figure, lamps]) for (let i = 0; i < p.pos.length; i += 3) p.pos[i] += XC

const lit = (p: V3, n: V3) => {
  if (p[2] < road(p[1]) - 0.3) return 0
  return Math.abs(n[1]) > 0.5 ? 0.9 : n[2] > 0.7 ? 0.35 : 0.65
}
const STEEL: MaterialSpec = { ...finish('truss-green', 0x86a191), doubleSided: true }
const CONCRETE: MaterialSpec = finish('pier-concrete', 0xe2dccf)
const SALMON: MaterialSpec = { ...finish('parapet-salmon', 0xe3ad92), doubleSided: true }
const STONE: MaterialSpec = { ...finish('berea-sandstone', 0xcdb592), floodlight: lit }
const FIGURE: MaterialSpec = { ...finish('guardian-sandstone', 0x8a7154), floodlight: () => 0.9 }
const LAMP: MaterialSpec = { name: 'lamp', color: 0xe6e0cf }
const parts = [
  { part: steel, material: STEEL }, { part: concrete, material: CONCRETE }, { part: salmon, material: SALMON },
  { part: stone, material: STONE }, { part: figure, material: FIGURE }, { part: lamps, material: LAMP },
]

const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('Hope Memorial Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river (174.6 m NAVD88)',
  bearing: 49.15, elevation: 0, deckCentre: XC, supports: SUP, roadway: { westPylon: road(SUP[0]), crest: road(-120), eastPylon: road(SUP[SUP.length - 1]) },
})
if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
await Bun.write(new URL('../models/cle-hope-memorial-bridge.glb', import.meta.url), glb)
console.log(`cle-hope-memorial-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
