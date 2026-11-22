/**
 * Sydney Harbour Bridge (1932; J. J. C. Bradfield, Dorman Long & Co.,
 * Ralph Freeman; pylons by Thomas S. Tait) — procedural, CC0-1.0, no
 * textures.
 * bun generators/sydney-harbour-bridge.ts
 *
 * One model for the whole bridge inside its OSM `man_made=bridge` outline
 * (relation/3178788, three rings): the two-hinged steel arch with its real
 * truss, the hangers and the hung deck, the four granite pylons on their
 * sandstone abutments, the five steel deck-truss approach spans on each side
 * on their paired piers, and the masonry approaches past them to the ends of
 * the outline (Argyle Street in the south, the Milsons Point curve in the
 * north). The roadways (Bradfield Highway, Cahill Expressway lanes) are the
 * map's: nothing here draws a road surface. The model owns the railway bed
 * with its two tracks, the cycleway (west) and the footway (east).
 *
 * Frame: x across the bridge (east +), y along it (toward Milsons Point,
 * NNE), z up, metres; origin at mid-span on the water, the midpoint of the
 * two pylon pairs' OSM centroids. Placed at bearing 27.67°, the line between
 * those centroids (OSM ways 382401361 and 156584774, 563.4 m apart).
 *
 * Two levels of detail from one description:
 * - low (≤ 6,500 triangles): the arch with every panel's chords, verticals
 *   and diagonals as solid members, single hangers, top struts; pylons with
 *   their archways; approach trusses as chords and diagonals; deck bands.
 * - detail (≤ 40,000): the same plus paired hangers, top and bottom lateral
 *   X-bracing, sway frames, the approach trusses' verticals and cross
 *   frames, cross girders and stringers, railings with posts, the rails,
 *   lamp posts and the lights along the top chords.
 *
 * Sources:
 * - OSM (© OpenStreetMap contributors, ODbL): relation/3178788 (the outline;
 *   rings way/205149952 main span, way/1101416214 south approach,
 *   way/1218239429 north approach); pylon outlines way/382401361 (south) and
 *   way/156584774 (north), each 60 x 28.2 m, with parts way/1169740767,
 *   way/1169740768 (bases, height 89) and the four upper pylons
 *   way/142518160/161/162/163 (10.3-10.9 m across, 25 m along, min_height 59,
 *   height 89), centred 20.5 m either side of the axis; the north approach's
 *   paired piers (building=transportation) way/156584791, 156584815,
 *   156584782, 156584811, 156584795, 156584800, 156584787, 156584805 and its
 *   abutment way/156584778, which fix the five north spans and their curve
 *   to the west. The deck's layout across (cycleway, two rail tracks,
 *   roadways, Cahill lanes, footway) from the OSM ways on it.
 * - Published (Wikipedia "Sydney Harbour Bridge"; NSW State Heritage
 *   Register "Sydney Harbour Bridge, approaches and viaducts"; Engineers
 *   Australia heritage pages): arch span 503 m; top of the arch 134 m above
 *   mean sea level; two 28-panel arch trusses in vertical planes 30 m apart
 *   centre to centre; truss depth 18 m at the crown (60 ft) and 57 m at the
 *   hinges (188 ft); deck 48.8 m wide (originally a 57 ft roadway, two
 *   tracks either side and two 10 ft footways); clearance 49 m at mid-span;
 *   pylons 89 m above the water, concrete faced with granite, each pierced
 *   by an archway through which the outer track and the footway pass; five
 *   approach spans each side, pairs of parallel-chord six-panel steel
 *   trusses on paired granite-faced piers; 1,149 m overall with the
 *   approaches.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   "Sydney (AU), Harbour Bridge -- 2019 -- 2179" (Dietmar Rabich,
 *   CC BY-SA 4.0; the whole span side-on from the west: chord shapes, panel
 *   rhythm, deck line and pylons, measured below);
 *   "Sydney (AU), Harbour Bridge -- 2019 -- 2975" (Dietmar Rabich,
 *   CC BY-SA 4.0; side-on from the east);
 *   "Sydney (AU), Harbour Bridge -- 2019 -- 2190" (Dietmar Rabich,
 *   CC BY-SA 4.0; the south-east pylon side-on, its side archway and
 *   balcony, the batter and top stage, the approach trusses and piers);
 *   "Sydney (AU), Harbour Bridge -- 2019 -- 2113" (Dietmar Rabich,
 *   CC BY-SA 4.0; the south-east pylon from below: granite grey over the
 *   honey sandstone abutment, the end-face archway);
 *   "Sydney (AU), Harbour Bridge -- 2019 -- 2114" (Dietmar Rabich,
 *   CC BY-SA 4.0; the truss and deck from below, lateral bracing);
 *   "Sydney (AU), Harbour Bridge -- 2019 -- 2881" (Dietmar Rabich,
 *   CC BY-SA 4.0; aerial from the south-east, plan and north curve);
 *   "Sydney Harbour Bridge 01" (Bernard Gagnon, CC BY-SA 3.0; hangers in
 *   pairs, deck girders);
 *   "Sydney Harbour Bridge seen from the observatory" (Ymblanter,
 *   CC BY-SA 4.0; end view from the south-west: pylon pairs, archways,
 *   trusses' spacing, the masonry south approach);
 *   "Sydney Harbour Bridge hinge" (Martinvl, CC BY-SA 4.0; the bearing on
 *   its sandstone abutment, steel colour in flat light);
 *   "The Sydney Harbour Bridge from Milsons Point September 2024" (Servite
 *   et contribuere, CC0; the north-west pylon, end archway, side niche);
 *   "Sydney Harbour Bridge during day" (thinkrorbot, public domain; pylon
 *   pair from the south-east);
 *   "Sydney Harbour Bridge from Circular Quay" (JJ Harrison, CC BY-SA 3.0;
 *   night: floodlit pylons, lit arch, lamps along the top chord and deck);
 *   "Southern approach to Sydney Harbour Bridge from the water, 1929" and
 *   "Southern approach to the Sydney Harbour Bridge, 1931" (Powerhouse
 *   Museum, public domain; the south approach spans and the parapeted
 *   masonry approach);
 *   "Sydney Harbour Bridge Transverse Archways through Pylon Tower" (1931,
 *   Photographic Collection from Australia, CC BY 2.0; the crossing
 *   archways inside a pylon).
 * - Measured from "2019 -- 2179" (scale from the arch span, corrected for
 *   perspective by the pylons' published height): top chord's top 134 m at
 *   the crown, 131.8 at ±44 m, 126 at ±83, 117 at ±123, 103.6 at ±164,
 *   85.6 at ±207, a kink at the second panel point from each end, 75.2 m at
 *   the end posts; bottom chord centre 114 at the crown, 104.5 at ±64, 91 at
 *   ±104, 73.5 at ±144, 52 at ±180, down to the hinge pins at 7.5 m; the
 *   deck's railing about 51 m at the pylons and 58.5 at mid-span.
 * - Estimated: the roadway profile (57.0 m at mid-span, a crest curve over
 *   ±150 m, then a 2.5 % fall, 51.5 m at the pylons, 44.8 at the south
 *   approach's abutment, 38 m at the south end) from the photo above and
 *   the published clearance; the deck's structure 7.5 m deep over the
 *   main span and 1.3 m over the approach trusses (9.5 m deep); the pylons'
 *   batter, stepped Art Deco crown (two set-backs, stepped parapet, flat
 *   cap), the round-headed niche high on each side face, the archways (7.6 m wide on the end faces, 5.6 m on the
 *   side faces, crowns about 10 m above the deck), balcony, bands and caps
 *   from "2190", "2113" and the Milsons Point photo; the south approach
 *   piers evenly spaced (OSM maps none); member sizes (chords 3.0-3.4 m
 *   wide, verticals 2.4 m, diagonals 1.6 m, hangers 0.7 m) drawn a little
 *   heavy so they read.
 * - Colour: the steel reads mid to dark grey (#8f949b lit, #7b7e82 shade on
 *   "hinge", darker against the sky on "2179"); drawn #73777c. Pylon granite
 *   warm honey-grey in sun (#e8c59e and #fadbb6 on "2179", #d2b189 and
 *   #bba286 on "2190", greyer #d4ccc2 at noon on "2113"); drawn #ccb592. Abutments and
 *   approach piers honey sandstone (#b49475-#bba286 on "2113"/"2190",
 *   #91734f in shade), drawn #c2a47e.
 * - Ground: the map's Mapterhorn terrain (z12 only here) every 20 m in this
 *   frame, less its water reading (1.5 m above the table's lowest), in
 *   `GROUND`. Pylons, abutments, piers and the masonry walls stand on it
 *   vertex by vertex. z12 smears buildings into bumps, so the land heights
 *   are rough.
 *
 * Night (JJ Harrison's photo): the pylons and abutments are floodlit warm;
 * the arch steel is washed from below, brightest above the deck; lamps
 * (`lamp`) run along the top chords and both deck edges.
 *
 * Doubts: the deck's heights are estimated (no lidar here and no `ele` on
 * the OSM roads); the south approach's pier spacing and the masonry
 * approaches' walls and the Argyle Street arch are drawn plainly from old
 * photos; the pylons' plan is OSM's (about 11 x 25 m above the deck), which
 * looks slimmer across than some photos suggest; the truss diagonals are
 * one per panel sloping down toward mid-span (Pratt), as they read from a
 * distance, not the real double-plane lacing.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { footedLoft, groundAt, chamferedRect, type GroundGrid } from './bridge-kit'
import { quadOut, hexa } from './nyc-george-washington-bridge'

// ---- Small vector helpers --------------------------------------------------------

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
type P2 = [number, number]

// ---- Ground ------------------------------------------------------------------------

// Mapterhorn z12 under the bridge, metres above the harbour, every 20 m in
// this frame: rows along y from y0, columns across x from x0.
const GROUND: GroundGrid = { y0: -880, x0: -200, step: 20, z: [
  [20.5, 21.8, 23.2, 26.8, 29.2, 32.7, 34.1, 34.5, 33.6, 33.2, 31.5, 29.2, 28, 27.2, 26.5],
  [20.5, 21.1, 21.2, 22, 22.5, 24.7, 27, 29.7, 31.7, 32.6, 30.8, 28.7, 27.3, 26.4, 24.8],
  [19.8, 21, 21.4, 21.5, 21.4, 21.1, 20.7, 22.1, 25.3, 28.5, 27.8, 27.4, 26.2, 25.1, 21.5],
  [16.9, 19.1, 20.3, 21.1, 21, 21, 20.5, 19.9, 19.6, 19.5, 20.1, 20.9, 21.9, 22.5, 16.4],
  [13.4, 14.9, 17.4, 19.5, 20.3, 20.6, 21, 21.4, 24.2, 24.3, 21.2, 18.1, 18.8, 15.6, 13.9],
  [12.1, 12.4, 14, 17.8, 18.9, 20.1, 20.9, 22.2, 26.3, 27.4, 25.6, 23.7, 24.4, 18.8, 12.8],
  [11.5, 11.7, 12.5, 13.9, 17, 18.9, 20.3, 21.4, 26.2, 28.2, 27.4, 26.3, 25.6, 20.4, 12.7],
  [8.3, 11.1, 12.1, 13.7, 16.2, 18.2, 19.7, 21, 25.4, 28.2, 28, 27, 25.4, 21.5, 13.5],
  [5.9, 10, 10.6, 12.8, 15.8, 17.7, 19.4, 20.7, 24.3, 28.1, 27.6, 26.7, 25.7, 22.9, 17.1],
  [3, 8.6, 10, 11.8, 15.1, 17.2, 18.8, 20.6, 24, 27.9, 27.5, 26.4, 25.9, 25.7, 23],
  [0.9, 4.1, 8.8, 10.2, 14.2, 17.1, 18.7, 19.9, 22.8, 26.8, 26.6, 25.8, 25.1, 26.1, 24.8],
  [0.5, 1.3, 6.1, 9.4, 12.6, 16.6, 18.4, 19.2, 22, 25.1, 25.2, 24.8, 24.8, 25.1, 22.3],
  [0.5, 0.5, 3.1, 8.2, 10.7, 15.8, 18.2, 19.1, 21.1, 23.9, 24.2, 24, 23.9, 23.7, 20],
  [0.6, 0.6, 1.7, 6.7, 9.3, 14.6, 18.1, 19, 20.7, 22.9, 23.4, 23.1, 23.2, 22, 13.8],
  [0.9, 0.7, 0.7, 3.7, 7.7, 13.1, 17.7, 18.9, 20, 21.8, 22, 22.3, 21.6, 17.4, 11.7],
  [1.2, 1.1, 0.7, 2.1, 5.9, 10.6, 16.4, 18.6, 19.4, 20.4, 21.1, 21.5, 19.3, 14.8, 11.4],
  [1.5, 1, 0.5, 1.2, 3.7, 5.9, 13.4, 17.7, 18.6, 19.2, 19.9, 19.8, 16.1, 12.4, 9.8],
  [1.2, 0.4, 0.5, 0.7, 1.3, 4.1, 11.7, 17.6, 17.4, 16.5, 16.5, 15.4, 12.8, 8.6, 5.5],
  [1.1, 0.3, 0.2, 0.6, 1.3, 3, 11.8, 17, 17.3, 16.4, 14.8, 11.6, 6.6, 3.8, 3.5],
  [1.1, 0.9, 0.7, 0.9, 1.1, 3, 11.2, 16.2, 17.4, 16.7, 13.7, 8.5, 3.1, 2.5, 2.6],
  [1.3, 1, 1.3, 1.1, 1, 2.2, 12.8, 15.2, 17, 16.6, 12.9, 6.8, 2.7, 1.7, 1],
  [1.5, 1.5, 1.5, 1.4, 0.9, 2.6, 11.2, 14.3, 16.7, 16.7, 12.2, 4.3, 1.8, 1.3, 0.6],
  [1.5, 1.4, 1.1, 0.6, 0.3, 0.8, 8.5, 14.3, 16, 16.4, 12.2, 4.5, 2, 0.6, 0],
  [1, 0.9, 0.4, 0.4, 0.4, 0.5, 4.6, 11.3, 13.6, 16.3, 12.8, 5.6, 1.7, 0.7, 0],
  [1, 0.4, 0.1, 0.5, 0.9, 1, 1.1, 2.5, 11.4, 16.2, 15.7, 10.8, 2.9, 1.1, 0.4],
  [0.4, 0.2, 0.5, 0.7, 1.3, 1.2, 1, 2.4, 13, 16, 15.6, 14.1, 9.6, 3.5, 1],
  [0.2, 0.5, 0, 0, 1.1, 1.4, 1, 5, 13.1, 15.8, 15, 14.3, 11.8, 7.4, 2.1],
  [0.7, 1, 0.4, 0, 0.8, 1.2, 1.2, 5.7, 13.1, 15, 14.4, 13.4, 11, 8, 4.3],
  [0.4, 1, 1, 1.1, 1.3, 1.1, 1.7, 8.4, 12.1, 12.8, 12.2, 11.4, 9.4, 6.7, 3.9],
  [0.2, 0.8, 1, 1.5, 1.5, 1, 3, 8.5, 9.7, 10.3, 9.9, 8.8, 7.2, 4.6, 2.1],
  [0, 0.1, 1.1, 1.3, 1.2, 1, 3.6, 7, 7.7, 8.3, 7.4, 5.9, 4.1, 1.8, 0.7],
  [0, 0, 0.3, 1.3, 1, 1, 2, 3.8, 4.1, 4.9, 4.4, 2.7, 1, 0.4, 0.1],
  [0, 0, 0, 0.4, 0.7, 0.9, 0.7, 0.9, 1, 1.3, 1.3, 0.8, 0.5, 0.1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.5, 0.5, 0.5, 0.5, 0.1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.5, 0.5, 0.5, 0.5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.5, 0.7, 0.7, 0.1, 0.2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.5, 0.9, 1, 1, 0.5],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.5, 0.7, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.5, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.5, 0.9, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.5, 0.5, 0.7, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.5, 0.7, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.6, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.5, 0.4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.1, 0.3, 0.2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.5, 0.5, 1, 0.5],
  [0, 0, 0, 0, 0, 0, 0, 0.7, 1.3, 1.4, 1.6, 1.4, 1, 0.6, 0],
  [0, 0, 0, 0, 0, 1, 2, 2.9, 3.8, 4.2, 3.9, 3.7, 2.3, 0.4, 0],
  [0.1, 0.7, 1.6, 1.6, 1.8, 1.9, 2.4, 3.5, 5.8, 6.3, 5.8, 4.5, 2.1, 0, 0],
  [2, 2, 2.2, 2.4, 2.7, 4.3, 5.9, 7.1, 7.9, 7.8, 6.7, 5.1, 1.5, 0, 0],
  [5.6, 6.1, 6, 6.9, 8.1, 10.2, 11.2, 11.1, 10, 9, 8, 6.1, 2.4, 0, 0],
  [9.1, 10.4, 10.6, 11.3, 11.8, 12.4, 12.9, 12.6, 11.2, 10.3, 9.4, 8.4, 5.3, 0.9, 0],
  [12.8, 14.1, 13.3, 11.1, 9.8, 15, 14.6, 13.6, 12.3, 11.6, 10.8, 9.8, 8.5, 4.1, 0.6],
  [20, 17.8, 16.9, 12.8, 9.6, 14.4, 15.9, 14.5, 13.4, 12.8, 12.1, 10.9, 9.8, 8, 5],
  [21.3, 20.2, 19.5, 18.6, 18, 17.8, 16.8, 15.3, 14.5, 13.9, 12.9, 11.7, 10.1, 9.2, 7.4],
  [22.7, 22.3, 21.2, 20.7, 20, 19.1, 17.7, 16.3, 15.6, 15, 13.9, 12.5, 11.4, 11, 9.7],
  [23, 22.9, 23.1, 22.5, 21.5, 20.2, 18.6, 17.6, 16.7, 16.1, 14.8, 13.5, 13.3, 13.3, 13.2],
  [23.6, 24.5, 24.3, 23.8, 22.9, 21.4, 20, 19.1, 18.3, 17.3, 16.2, 15.2, 15.3, 15.3, 15],
  [24.7, 26.1, 25.5, 24.9, 24.2, 22.8, 21.3, 20.4, 19.5, 18.6, 17.7, 17.4, 17.3, 17.6, 18.6],
  [27.7, 27.7, 27.7, 26.1, 25.4, 24.1, 22.2, 21.7, 20.9, 19.7, 18.9, 19.3, 20, 20.9, 23.3],
  [29, 29.6, 30.1, 28.4, 26.7, 24.9, 23.3, 23.2, 22.3, 21.3, 21.3, 22.4, 23.9, 25.6, 26.6],
  [29.9, 30.4, 30.5, 30.6, 28.9, 26.6, 25.4, 24.9, 24, 24.4, 25.2, 25.9, 26.6, 27.5, 28.5],
  [30.6, 30.6, 30.8, 31, 30, 28.4, 27, 26.7, 26.2, 26.3, 27.2, 27.9, 28.8, 29.1, 30.9],
  [31.2, 31, 31.6, 31.3, 30.8, 29.6, 29.1, 30.2, 28.5, 28, 28.8, 29.6, 30.8, 32.6, 35.3],
  [31.6, 31.9, 31.7, 31.5, 31.5, 30.5, 30.5, 31, 30.5, 30, 30.4, 31.6, 33.6, 36.3, 38.4],
  [31.5, 31.5, 31.6, 31.5, 31.4, 31.1, 31, 31, 31.4, 31.7, 32.1, 32.9, 34.9, 37.4, 39.1],
  [31.9, 31.1, 31, 31, 31, 30.9, 30.9, 31.1, 31.8, 32.6, 33.7, 34.1, 34.7, 35, 36.7],
] }
const ground = (x: number, y: number) => groundAt(GROUND, x, y)

// ---- The roadway profile -------------------------------------------------------------

/** The roadway's height at |s| metres along the bridge from mid-span (estimated; see header). */
function road(s: number): number {
  const a = Math.abs(s), C = 150, G = 0.025, R0 = 57.0
  if (a <= C) return R0 - (G * a * a) / (2 * C)
  return R0 - (G * C) / 2 - G * (a - C)
}

// ---- The plan: one path from the south end to the north end ----------------------------

/**
 * A station on the bridge's centre line: plan point, the unit vector across
 * (east-ish) scaled for a mitred joint, and s, the signed distance from
 * mid-span along the line.
 */
type Station = { p: P2; e: P2; s: number }

/** Stations along a polyline of [x, y] points (south to north), every `step` metres or less. */
function pathStations(pts: P2[], s0: number, step: number): Station[] {
  const out: Station[] = []
  let s = s0
  const dirs = pts.slice(1).map((b, i) => {
    const a = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return { u: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] as P2, l }
  })
  const across = (u: P2): P2 => [u[1], -u[0]]
  for (let k = 0; k < dirs.length; k++) {
    const { u, l } = dirs[k], a = pts[k]
    const n = Math.max(1, Math.ceil(l / step))
    for (let i = k === 0 ? 0 : 1; i <= n; i++) {
      const t = i / n
      let e = across(u)
      if (i === n && k < dirs.length - 1) {
        // A mitred joint: the bisector, lengthened so the width holds.
        const e2 = across(dirs[k + 1].u), m: P2 = [e[0] + e2[0], e[1] + e2[1]]
        const ml = Math.hypot(...m), c = (m[0] * e[0] + m[1] * e[1]) / ml
        e = [m[0] / ml / c, m[1] / ml / c]
      }
      out.push({ p: [a[0] + (pts[k + 1][0] - a[0]) * t, a[1] + (pts[k + 1][1] - a[1]) * t], e, s: s + l * t })
    }
    s += l
  }
  return out
}
const at = (st: Station, c: number, z: number): V3 => [st.p[0] + st.e[0] * c, st.p[1] + st.e[1] * c, z]

// Main span between the pylons' outer faces.
const PY = 281.6                 // pylon centres, |y| (OSM)
const PYH = 15.6                 // pylon half-length along the bridge at its foot
const PY_OUT = PY + PYH          // 297.2, where the approach spans start
const PY_IN = PY - PYH           // 266.0
const PX = 20.5                  // pylon centres, |x| (OSM)

// North approach: the pylon face, the four OSM pier pairs, the abutment.
const NORTH_PIERS: P2[] = [[0, PY_OUT], [-4.3, 346.5], [-15.0, 399.5], [-32.7, 451.5], [-56.0, 500.5], [-80.0, 539.0]]
const NORTH_ABUT: P2 = [-85.5, 547.0]
const NORTH_END: P2[] = [[-80.0, 539.0], [-106.0, 577.0], [-134.0, 609.0]]
// South approach: five even spans (OSM maps no piers), then the masonry approach.
const SOUTH_SPAN = (568.5 - PY_OUT) / 5
const SOUTH_PIERS: P2[] = Array.from({ length: 6 }, (_, i) => [0, -568.5 + i * SOUTH_SPAN] as P2)
const SOUTH_END: P2[] = [[0, -835.0], [0, -580.0]]

const len2 = (pts: P2[]) => pts.slice(1).reduce((t, b, i) => t + Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]), 0)
const S_NORTH_ABUT = PY_OUT + len2(NORTH_PIERS)

// ---- Members ----------------------------------------------------------------------

/** Four smooth-shaded sides through two matching corner loops, with each corner's normal pointing out along its diagonal. */
function tubeQuads(p: Part, sa: V3[], sb: V3[], na: V3[], nb: V3[]) {
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    p.tri(sa[k], sa[j], sb[j], undefined, undefined, undefined, [na[k], na[j], nb[j]])
    p.tri(sa[k], sb[j], sb[k], undefined, undefined, undefined, [na[k], nb[j], nb[k]])
  }
}
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]]

/**
 * A straight member from a to b, w wide along `across` and t deep square to
 * it: four smooth-shaded sides (it reads as a slightly rounded bar and its
 * corners share vertices), open at the ends, which butt into joints.
 */
function member(p: Part, a: V3, b: V3, w: number, t: number, across: V3 = [1, 0, 0], caps = false, tri = false) {
  const d = nrm(sub(b, a))
  const A = nrm(sub(across, mul(d, dot(across, d))))
  const B = crs(d, A)
  if (tri) {
    // A three-sided bar for the low model's thinnest members.
    const ang = [90, 210, 330].map((g) => (g * Math.PI) / 180)
    const ns = ang.map((g) => nrm(add(mul(A, Math.cos(g)), mul(B, Math.sin(g)))))
    const sec = (o: V3) => ang.map((g) => add(o, add(mul(A, (Math.cos(g) * w) / 1.5), mul(B, (Math.sin(g) * t) / 1.5))))
    const sa = sec(a), sb = sec(b)
    for (let k = 0; k < 3; k++) {
      const j = (k + 1) % 3
      p.tri(sa[k], sa[j], sb[j], undefined, undefined, undefined, [ns[k], ns[j], ns[j]])
      p.tri(sa[k], sb[j], sb[k], undefined, undefined, undefined, [ns[k], ns[j], ns[k]])
    }
    return
  }
  const ns = CORNERS.map(([u, v]) => nrm(add(mul(A, u), mul(B, v))))
  const sec = (o: V3) => CORNERS.map(([u, v]) => add(o, add(mul(A, (u * w) / 2), mul(B, (v * t) / 2))))
  const sa = sec(a), sb = sec(b)
  tubeQuads(p, sa, sb, ns, ns)
  if (caps) { const mid = mul(add(a, b), 0.5); quadOut(p, sa, mid); quadOut(p, sb, mid) }
}

/** A chord swept through points in the plane x = const: w across x, t deep, sections square to the averaged tangent. */
function chord(p: Part, pts: V3[], w: number, t: number) {
  const secs = pts.map((o, i) => {
    const d = nrm(sub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)]))
    const A: V3 = [1, 0, 0], B = crs(d, A)
    return {
      pts: CORNERS.map(([u, v]) => add(o, add(mul(A, (u * w) / 2), mul(B, (v * t) / 2)))),
      ns: CORNERS.map(([u, v]) => nrm(add(mul(A, u), mul(B, v)))),
    }
  })
  for (let i = 0; i < pts.length - 1; i++) tubeQuads(p, secs[i].pts, secs[i + 1].pts, secs[i].ns, secs[i + 1].ns)
  quadOut(p, secs[0].pts, pts[1]); quadOut(p, secs[secs.length - 1].pts, pts[pts.length - 2])
}

/** A light: a smooth octahedron, round enough to read as a point. */
function lampAt(p: Part, c: V3, r: number, tetra = false) {
  if (tetra) {
    const v = ([[0, 0, 1], [0.943, 0, -0.333], [-0.471, 0.816, -0.333], [-0.471, -0.816, -0.333]] as V3[])
    for (const [i, j, l] of [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]) p.tri(add(c, mul(v[i], r)), add(c, mul(v[j], r)), add(c, mul(v[l], r)), undefined, undefined, undefined, [v[i], v[j], v[l]])
    return
  }
  const ax: V3[] = [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0]]
  const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
  for (let i = 0; i < 4; i++) {
    const a = ax[i], b = ax[(i + 1) % 4]
    p.tri(add(c, mul(a, r)), add(c, mul(b, r)), add(c, mul(up, r)), undefined, undefined, undefined, [a, b, up])
    p.tri(add(c, mul(b, r)), add(c, mul(a, r)), add(c, mul(dn, r)), undefined, undefined, undefined, [b, a, dn])
  }
}

/** A box given by its eight corners: a bottom loop and the matching top loop. */
function block(p: Part, lo: V3[], hi: V3[]) { hexa(p, lo, hi) }

// ---- The arch ----------------------------------------------------------------------

const HALF = 252          // hinge pins, |y|
const PANEL = (2 * HALF) / 28
const TX = 15             // truss planes, |x| (30 m centre to centre, published)
const HINGE_Z = 7.5

/** Monotone cubic through [x, y] knots (Fritsch–Carlson), held flat outside. */
function spline(k: P2[]): (x: number) => number {
  const n = k.length, d = k.slice(1).map((b, i) => (b[1] - k[i][1]) / (b[0] - k[i][0]))
  const m = k.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2))
  return (x) => {
    if (x <= k[0][0]) return k[0][1]
    if (x >= k[n - 1][0]) return k[n - 1][1]
    let i = 0
    while (x > k[i + 1][0]) i++
    const h = k[i + 1][0] - k[i][0], t = (x - k[i][0]) / h
    return (2 * t ** 3 - 3 * t ** 2 + 1) * k[i][1] + (t ** 3 - 2 * t ** 2 + t) * h * m[i] + (-2 * t ** 3 + 3 * t ** 2) * k[i + 1][1] + (t ** 3 - t ** 2) * h * m[i + 1]
  }
}

// Top chord's top: a parabola to the kink at the second panel point from each
// end, then straight to the end post (measured; see header).
const TOP_A = (134 - 85.6) / 207 ** 2
const KINK = HALF - 2 * PANEL
const topTop = (y: number) => {
  const a = Math.abs(y)
  if (a <= KINK) return 134 - TOP_A * a * a
  const zk = 134 - TOP_A * KINK * KINK
  return zk + ((75.2 - zk) * (a - KINK)) / (HALF - KINK)
}
const TOP_D = 3.2, BOT_D = 4.4
const zt = (y: number) => topTop(y) - TOP_D / 2
const zbSpline = spline([[0, 114], [64, 104.5], [104, 91], [144, 73.5], [180, 52], [HALF, HINGE_Z]])
const zb = (y: number) => zbSpline(Math.abs(y))

/** Deck soffit and girder heights over the main span. */
const MAIN_DEPTH = 7.5
const soffit = (y: number) => road(y) - MAIN_DEPTH

type Kit = { steel: Part; granite: Part; sand: Part; deck: Part; lamp: Part }
const kit = (): Kit => ({ steel: new Part(), granite: new Part(), sand: new Part(), deck: new Part(), lamp: new Part() })

function arch(k: Kit, d: boolean) {
  const ys = Array.from({ length: 29 }, (_, i) => -HALF + i * PANEL)
  for (const x of [-TX, TX]) {
    // Chords, straight between panel points.
    chord(k.steel, ys.map((y) => [x, y, zt(y)] as V3), 3.0, TOP_D)
    chord(k.steel, ys.map((y) => [x, y, zb(y)] as V3), 3.4, BOT_D)
    // End posts, from the pins to the top chord, and the verticals between.
    for (const y of ys) {
      const end = Math.abs(Math.abs(y) - HALF) < 1
      const z0 = end ? HINGE_Z : zb(y) + BOT_D / 2, z1 = zt(y) - TOP_D / 2
      member(k.steel, [x, y, z0], [x, y, z1], end ? 3.4 : 2.0, end ? 4.0 : 2.8)
    }
    // One diagonal per panel, from the top chord at its outer end down to
    // the bottom chord at its inner end (Pratt).
    for (let i = 0; i < 28; i++) {
      const [ya, yb] = ys[i] < 0 ? [ys[i], ys[i + 1]] : [ys[i + 1], ys[i]]
      const off = Math.sign(yb - ya) * 1.0
      member(k.steel, [x, ya + off, zt(ya) - TOP_D / 2], [x, yb - off, zb(yb) + BOT_D / 2], 1.6, 1.6, [1, 0, 0], false, !d)
    }
    // Hangers where the bottom chord is above the deck: in pairs in the detail.
    for (const y of ys) {
      const top = zb(y) - BOT_D / 2, bot = road(y) - 1.0
      if (top - bot < 2.5) continue
      if (d) for (const dy of [-0.85, 0.85]) member(k.steel, [x, y + dy, top], [x, y + dy, bot], 0.8, 0.8)
      else member(k.steel, [x, y, top], [x, y, bot], 1.3, 1.5, [1, 0, 0], false, true)
    }
  }
  // Bracing between the trusses: struts at every panel point along the top
  // chords, and along the bottom chords where they are clear of the deck.
  const IN = TX - 1.5
  for (const y of ys) {
    member(k.steel, [-IN, y, zt(y) - 0.4], [IN, y, zt(y) - 0.4], 1.2, 1.6, [0, 1, 0])
    if (!d) continue
    if (zb(y) - road(y) > 7) member(k.steel, [-IN, y, zb(y)], [IN, y, zb(y)], 1.3, 1.8, [0, 1, 0])
    else if (zt(y) - road(y) > 14 && Math.abs(y) < HALF - 1) {
      // A portal strut above the traffic where the bottom chord dips below the deck.
      const zp = Math.max(road(y) + 9, zt(y) - 6)
      member(k.steel, [-IN, y, zp], [IN, y, zp], 1.2, 1.6, [0, 1, 0])
    }
  }
  // Lights along the top chords' outer edges.
  const step = d ? PANEL / 2 : 2 * PANEL
  for (const x of [-TX, TX]) for (let y = -HALF + step / 2; y < HALF; y += step)
    lampAt(k.lamp, [x + Math.sign(x) * 1.55, y, topTop(y) + 0.3], d ? 0.6 : 0.8, !d)
  if (!d) return
  for (let i = 0; i < 28; i++) {
    const ya = ys[i], yb = ys[i + 1]
    // Top lateral X in every panel.
    member(k.steel, [-IN, ya, zt(ya) - 0.4], [IN, yb, zt(yb) - 0.4], 0.8, 0.8, [0, 0, 1])
    member(k.steel, [IN, ya, zt(ya) - 0.4], [-IN, yb, zt(yb) - 0.4], 0.8, 0.8, [0, 0, 1])
    // Bottom lateral X where both ends are clear of the deck.
    if (zb(ya) - road(ya) > 7 && zb(yb) - road(yb) > 7) {
      member(k.steel, [-IN, ya, zb(ya)], [IN, yb, zb(yb)], 0.8, 0.8, [0, 0, 1])
      member(k.steel, [IN, ya, zb(ya)], [-IN, yb, zb(yb)], 0.8, 0.8, [0, 0, 1])
    }
  }
  // Sway frames: an X between the chords across the bridge, where both are
  // above the traffic.
  for (const y of ys) {
    if (zb(y) - road(y) > 7) {
      member(k.steel, [-IN, y, zt(y) - 1.6], [IN, y, zb(y) + 1.6], 0.8, 0.9, [0, 1, 0])
      member(k.steel, [IN, y, zt(y) - 1.6], [-IN, y, zb(y) + 1.6], 0.8, 0.9, [0, 1, 0])
    }
  }
  // Bearings: a steel shoe under each pin.
  for (const x of [-TX, TX]) for (const s of [-1, 1]) {
    const y = s * HALF
    block(k.steel, [[x - 2.4, y - 2.4, 6.8], [x + 2.4, y - 2.4, 6.8], [x + 2.4, y + 2.4, 6.8], [x - 2.4, y + 2.4, 6.8]],
      [[x - 1.6, y - 1.6, HINGE_Z + 0.8], [x + 1.6, y - 1.6, HINGE_Z + 0.8], [x + 1.6, y + 1.6, HINGE_Z + 0.8], [x - 1.6, y + 1.6, HINGE_Z + 0.8]])
  }

}

// ---- The deck ------------------------------------------------------------------------

// Across the deck, from the OSM ways on it: cycleway (west), railway bed with
// two tracks either side of the west truss, roadways (the map's), footway (east).
const EDGE = 24.4
const CYCLE: P2 = [-24.0, -20.6]
const RAIL: P2 = [-20.6, -9.0]
const TRACKS = [-17.6, -11.8]
const FOOT: P2 = [20.6, 24.0]

type DeckOpts = { depth: (s: number) => number; fascia: (s: number) => boolean; soffitHalf: (s: number) => number }

/**
 * The deck along a run of stations: the soffit (its underside only), the edge
 * girders with their railings, and the walking and railway surfaces; never
 * the roadways.
 */
function deck(k: Kit, d: boolean, sts: Station[], o: DeckOpts) {
  /** A slab's visible faces: its top, and in the detail its two long sides. */
  const slab = (p: Part, A: Station, B: Station, c0: number, c1: number, za: number, zb: number, ta: number, tb: number, sides: boolean) => {
    quadOut(p, [at(A, c0, ta), at(A, c1, ta), at(B, c1, tb), at(B, c0, tb)], [A.p[0], A.p[1], ta - 10])
    if (sides) for (const c of [c0, c1])
      quadOut(p, [at(A, c, za), at(B, c, zb), at(B, c, tb), at(A, c, ta)], at(A, (c0 + c1) / 2, (za + ta) / 2))
  }
  for (let i = 0; i < sts.length - 1; i++) {
    const A = sts[i], B = sts[i + 1]
    const ra = road(A.s), rb = road(B.s)
    const sm = (A.s + B.s) / 2
    // Soffit, facing down.
    const h = o.soffitHalf(sm), za = ra - o.depth(A.s), zb2 = rb - o.depth(B.s)
    quadOut(k.steel, [at(A, -h, za), at(B, -h, zb2), at(B, h, zb2), at(A, h, za)], [A.p[0], A.p[1], za + 5])
    // Edge girders: a band from the soffit up to the railing's top (the low
    // model's railing is the band itself), outer face, top and inner face.
    if (o.fascia(sm)) for (const sg of [-1, 1]) {
      const c0 = sg * (EDGE - 0.6), c1 = sg * EDGE
      const top = d ? 0.25 : 2.0
      const ta = ra + top, tb = rb + top
      quadOut(k.steel, [at(A, c1, za), at(B, c1, zb2), at(B, c1, tb), at(A, c1, ta)], at(A, 0, ta))
      quadOut(k.steel, [at(A, c0, ta), at(A, c1, ta), at(B, c1, tb), at(B, c0, tb)], [A.p[0], A.p[1], ta - 10])
      if (d) quadOut(k.steel, [at(A, c0, ra - 1.0), at(B, c0, rb - 1.0), at(B, c0, tb), at(A, c0, ta)], at(A, sg * 40, ta))
      if (d) {
        // Railing: a top rail and a mid rail on posts.
        for (const zr of [2.1, 1.2]) member(k.steel, at(A, sg * (EDGE - 0.3), ra + zr), at(B, sg * (EDGE - 0.3), rb + zr), 0.14, 0.12, [0, 0, 1])
        const L = Math.hypot(B.p[0] - A.p[0], B.p[1] - A.p[1]), n = Math.max(1, Math.round(L / 9))
        for (let j = 0; j < n; j++) {
          const t = j / n, S: Station = { p: [A.p[0] + (B.p[0] - A.p[0]) * t, A.p[1] + (B.p[1] - A.p[1]) * t], e: A.e, s: A.s + (B.s - A.s) * t }
          const r = road(S.s)
          member(k.steel, at(S, sg * (EDGE - 0.3), r + 0.25), at(S, sg * (EDGE - 0.3), r + 2.16), 0.14, 0.14)
        }
      }
    }
    // Walking and railway surfaces, set on the deck.
    for (const [c0, c1, dz] of [[CYCLE[0], CYCLE[1], 0.15], [RAIL[0], RAIL[1], 0.3], [FOOT[0], FOOT[1], 0.15]] as [number, number, number][])
      slab(k.deck, A, B, c0, c1, ra - 0.4, rb - 0.4, ra + dz, rb + dz, d)
    if (d) {
      // Two rails per track; a fence between the cycleway and the railway.
      for (const c of TRACKS) for (const dc of [-0.72, 0.72])
        member(k.steel, at(A, c + dc, ra + 0.42), at(B, c + dc, rb + 0.42), 0.1, 0.18)
      member(k.steel, at(A, CYCLE[1], ra + 1.4), at(B, CYCLE[1], rb + 1.4), 0.1, 0.1, [0, 0, 1])
    }
  }
}

/** Lamp standards along both edges of a run, every `step` metres. */
function lamps(k: Kit, d: boolean, sts: Station[], step: number) {
  let next = sts[0].s + step / 2
  for (let i = 0; i < sts.length - 1; i++) {
    const A = sts[i], B = sts[i + 1]
    while (next < B.s) {
      const t = (next - A.s) / (B.s - A.s)
      const S: Station = { p: [A.p[0] + (B.p[0] - A.p[0]) * t, A.p[1] + (B.p[1] - A.p[1]) * t], e: A.e, s: next }
      const r = road(next)
      for (const sg of [-1, 1]) {
        if (d) member(k.steel, at(S, sg * (EDGE - 0.4), r + 1.3), at(S, sg * (EDGE - 0.4), r + 7.5), 0.25, 0.25)
        lampAt(k.lamp, at(S, sg * (EDGE - 1.0), r + 7.6), d ? 0.6 : 0.8, !d)
      }
      next += step
    }
  }
}

// ---- Main span deck ------------------------------------------------------------------

function mainDeck(k: Kit, d: boolean) {
  const ys: number[] = []
  for (let y = -HALF; y < HALF - 0.1; y += d ? PANEL : 2 * PANEL) ys.push(y)
  ys.push(-PY_OUT, PY_OUT)
  ys.push(PY_OUT)
  for (const yy of [-PY_IN, PY_IN, -HALF, HALF]) if (!ys.some((v) => Math.abs(v - yy) < 0.5)) ys.push(yy)
  ys.sort((a, b) => a - b)
  const sts: Station[] = ys.map((y) => ({ p: [0, y], e: [1, 0], s: y }))
  const outside = (s: number) => Math.abs(s) > PY_IN
  deck(k, d, sts, {
    depth: () => MAIN_DEPTH,
    fascia: (s) => !outside(s),
    soffitHalf: (s) => (outside(s) ? PX - 6.3 : EDGE),
  })
  lamps(k, d, sts.filter((s) => !outside(s.s) || Math.abs(s.s) < PY_IN + 0.1), d ? 24 : 72)
  // Girders: one under each truss line and, in the detail, two more and a cross girder at every panel point.
  const lines = d ? [-TX, -6, 6, TX] : []
  for (const x of lines) for (let i = 0; i < ys.length - 1; i++) {
    const ya = ys[i], yb = ys[i + 1]
    member(k.steel, [x, ya, soffit(ya) + 2.2], [x, yb, soffit(yb) + 2.2], 1.0, 4.0)
  }
  if (d) for (let i = 0; i <= 28; i++) {
    const y = -HALF + i * PANEL
    const zs = soffit(y)
    block(k.steel, [[-EDGE + 0.6, y - 0.6, zs], [EDGE - 0.6, y - 0.6, zs], [EDGE - 0.6, y + 0.6, zs], [-EDGE + 0.6, y + 0.6, zs]],
      [[-EDGE + 0.6, y - 0.6, road(y) - 1.0], [EDGE - 0.6, y - 0.6, road(y) - 1.0], [EDGE - 0.6, y + 0.6, road(y) - 1.0], [-EDGE + 0.6, y + 0.6, road(y) - 1.0]])
  }
  // Between the pylons the deck rests on a steel bent standing on the abutment.
  for (const s of [-1, 1]) {
    const y = s * PY
    for (const x of [-9, 9]) member(k.steel, [x, y, 10.8], [x, y, soffit(y)], 2.0, 2.0, [1, 0, 0], true)
    member(k.steel, [-9, y, soffit(y) - 1], [9, y, soffit(y) - 1], 1.4, 1.6, [0, 1, 0])
    if (d) {
      member(k.steel, [-9, y, 12], [9, y, soffit(y) - 2], 1.0, 1.0, [0, 1, 0])
      member(k.steel, [9, y, 12], [-9, y, soffit(y) - 2], 1.0, 1.0, [0, 1, 0])
    }
  }
}

// ---- Pylons and abutments --------------------------------------------------------------

/** A plan rectangle about (cx, cy), half-sizes hx, hy, chamfer r, at height z: CCW from above. */
const rect = (cx: number, cy: number, hx: number, hy: number, r: number, z: number): V3[] =>
  chamferedRect(cx - hx, cx + hx, cy - hy, cy + hy, r).map(([x, y]) => [x, y, z] as V3)

/** A solid lofted through rings (CCW from above, matching corners), capped top and bottom. */
function loft(p: Part, rings: V3[][], capBottom = false) {
  const n = rings[0].length
  for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, A = rings[r], B = rings[r + 1]
    p.quad(A[i], A[j], B[j], B[i])
  }
  const top = rings[rings.length - 1]
  for (let i = 1; i < n - 1; i++) p.tri(top[0], top[i], top[i + 1])
  if (capBottom) { const b = rings[0]; for (let i = 1; i < n - 1; i++) p.tri(b[0], b[i + 1], b[i]) }
}

const ARCH_W = 3.8        // end-face archway half-width (7.6 m)
const SIDE_W = 2.8        // side-face archway half-width (5.6 m)

function pylon(k: Kit, d: boolean, cx: number, cy: number) {
  const g = ground
  const floor = road(cy)                   // the archways' floor, at the deck
  const zArch = floor + 10.0               // archway crowns
  const zBand = zArch + 1.6
  // Half-sizes: battered from the plinth to the shoulder.
  const HX0 = 6.4, HY0 = 15.4, HX1 = 5.4, HY1 = 12.9, Z1 = 77.0
  // The plinth's ledge clears the ground under the pylon by 1.5 m at least.
  let gMax = 0
  for (const ax of [-1, 0, 1]) for (const ay of [-1, -0.5, 0, 0.5, 1]) gMax = Math.max(gMax, g(cx + ax * (HX0 + 0.7), cy + ay * (HY0 + 0.7)))
  const Z0 = Math.max(9, gMax + 2.3)
  const hx = (z: number) => HX0 + ((HX1 - HX0) * (z - Z0)) / (Z1 - Z0)
  const hy = (z: number) => HY0 + ((HY1 - HY0) * (z - Z0)) / (Z1 - Z0)
  // Plinth and lower shaft, standing on the ground.
  footedLoft(k.granite, g, [
    { plan: chamferedRect(cx - HX0 - 0.7, cx + HX0 + 0.7, cy - HY0 - 0.7, cy + HY0 + 0.7, 0.4), z: 'ground' },
    { plan: chamferedRect(cx - HX0 - 0.7, cx + HX0 + 0.7, cy - HY0 - 0.7, cy + HY0 + 0.7, 0.4), z: Z0 - 0.8 },
    { plan: chamferedRect(cx - HX0, cx + HX0, cy - HY0, cy + HY0, 0.3), z: Z0 },
    { plan: chamferedRect(cx - hx(floor), cx + hx(floor), cy - hy(floor), cy + hy(floor), 0.3), z: floor },
  ], d ? 3 : 40)
  // The archway storey: four corner piers around the two crossing archways.
  const hxA = hx(floor), hyA = hy(floor), hxB = hx(zBand), hyB = hy(zBand)
  for (const ax of [-1, 1]) for (const ay of [-1, 1]) {
    const loop = (z: number, hxz: number, hyz: number): V3[] => {
      const xa = ax > 0 ? cx + ARCH_W : cx - hxz, xb = ax > 0 ? cx + hxz : cx - ARCH_W
      const ya = ay > 0 ? cy + SIDE_W : cy - hyz, yb = ay > 0 ? cy + hyz : cy - SIDE_W
      return [[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]]
    }
    block(k.granite, loop(floor, hxA, hyA), loop(zBand, hxB, hyB))
  }
  // Arch heads: the masonry over each archway, a real semicircular soffit.
  const seg = d ? 10 : 6
  const head = (alongY: boolean, w: number) => {
    const spring = zArch - w
    const half = alongY ? hy(zBand) : hx(zBand)
    for (let i = 0; i < seg; i++) {
      const ta = Math.PI - (Math.PI * i) / seg, tb = Math.PI - (Math.PI * (i + 1)) / seg
      const pa = [w * Math.cos(ta), spring + w * Math.sin(ta)], pb = [w * Math.cos(tb), spring + w * Math.sin(tb)]
      const F = (a: number, z: number, n: number): V3 => (alongY ? [cx + a, cy + n, z] : [cx + n, cy + a, z])
      const q = (n: number): V3[] => [F(pa[0], pa[1], n), F(pb[0], pb[1], n), F(pb[0], zBand, n), F(pa[0], zBand, n)]
      hexa(k.granite, q(-half), q(half), { skip: [1, 2, 3] })
    }
    // The jambs below the springing are the corner piers; nothing else to draw.
  }
  head(true, ARCH_W)
  head(false, SIDE_W)
  // Band over the archways, then the upper shaft to the shoulder.
  block(k.granite, rect(cx, cy, hx(zBand) + 0.35, hy(zBand) + 0.35, 0.2, zBand), rect(cx, cy, hx(zBand + 1.0) + 0.35, hy(zBand + 1.0) + 0.35, 0.2, zBand + 1.0))
  loft(k.granite, [rect(cx, cy, hx(zBand), hy(zBand), 0.3, zBand), rect(cx, cy, HX1, HY1, 0.3, Z1)])
  // The Art Deco crown, the top 12 m: a ledge, two set-backs, a stepped
  // parapet and a flat cap (photos 2190, 2113).
  const tier = (dx: number, dy: number, z0: number, z1: number, r = 0.3) =>
    block(k.granite, rect(cx, cy, HX1 + dx, HY1 + dy, d ? r : 0, z0), rect(cx, cy, HX1 + dx, HY1 + dy, d ? r : 0, z1))
  tier(0.35, 0.35, Z1 - 0.7, Z1 + 0.2)        // ledge where the shaft stops
  tier(-0.8, -1.6, Z1 + 0.2, 81.6)            // first set-back
  if (d) tier(-0.5, -1.3, 81.6, 82.2, 0.2)    // its string course
  tier(-1.6, -3.2, 82.2, 85.8)                // second set-back
  if (d) tier(-1.3, -2.9, 85.8, 86.5, 0.2)    // parapet ledge
  tier(-1.9, -3.6, 86.5, 87.8, 0.2)           // stepped parapet
  tier(-2.4, -4.4, 87.8, 89.0, 0.2)           // flat cap
  // The round-headed niche high on each side face: a real recess 0.7 m
  // deep, framed by jambs and a head with a semicircular soffit.
  const NW = 1.3, NZ0 = 68.5, NS = 73.6, ND = 0.7
  for (const s2 of d ? [-1, 1] : [Math.sign(cx)]) {
    const xf = (z: number) => cx + s2 * hx(z)
    const F = (a: number, z: number, n: number): V3 => [xf(z) + s2 * n, cy + a, z]
    for (const sa of [-1, 1]) {
      const a0 = sa * NW, a1 = sa * (NW + 0.9)
      hexa(k.granite, [F(a0, NZ0, -0.2), F(a1, NZ0, -0.2), F(a1, NZ0, ND), F(a0, NZ0, ND)],
        [F(a0, NS + NW + 0.8, -0.2), F(a1, NS + NW + 0.8, -0.2), F(a1, NS + NW + 0.8, ND), F(a0, NS + NW + 0.8, ND)], { capA: false })
    }
    if (d) hexa(k.granite, [F(-NW - 0.9, NZ0 - 0.6, -0.2), F(NW + 0.9, NZ0 - 0.6, -0.2), F(NW + 0.9, NZ0 - 0.6, ND + 0.15), F(-NW - 0.9, NZ0 - 0.6, ND + 0.15)],
      [F(-NW - 0.9, NZ0, -0.2), F(NW + 0.9, NZ0, -0.2), F(NW + 0.9, NZ0, ND + 0.15), F(-NW - 0.9, NZ0, ND + 0.15)])
    const seg = d ? 8 : 4, zTop = NS + NW + 0.8
    for (let i = 0; i < seg; i++) {
      const ta = Math.PI - (Math.PI * i) / seg, tb = Math.PI - (Math.PI * (i + 1)) / seg
      const pa = [NW * Math.cos(ta), NS + NW * Math.sin(ta)], pb = [NW * Math.cos(tb), NS + NW * Math.sin(tb)]
      const q = (n: number): V3[] => [F(pa[0], pa[1], n), F(pb[0], pb[1], n), F(pb[0], zTop, n), F(pa[0], zTop, n)]
      hexa(k.granite, q(-0.2), q(ND), { skip: [1, 3] })
    }
  }
  // The balcony under each side archway, on the outer and inner faces.
  for (const s of [-1, 1]) {
    const xf = cx + s * hx(floor - 2)
    const bx0 = s > 0 ? xf - 0.2 : xf - 1.7, bx1 = s > 0 ? xf + 1.7 : xf + 0.2
    block(k.granite, rect((bx0 + bx1) / 2, cy, (bx1 - bx0) / 2, SIDE_W + 0.9, 0.15, floor - 5.0), rect((bx0 + bx1) / 2, cy, (bx1 - bx0) / 2, SIDE_W + 0.9, 0.15, floor + 0.6))
  }
  if (d) {
    // Slit windows high on the side faces and the top stage, as real recesses
    // framed by two jamb ribs (the face behind them reads dark in shade).
    for (const s of [-1, 1]) for (const dy of [-3.5, 3.5]) {
      const xf = cx + s * hx(66)
      for (const dj of [-0.55, 0.55]) block(k.granite, rect(xf + s * 0.15, cy + dy + dj, 0.15, 0.15, 0, 63.5), rect(xf + s * 0.15, cy + dy + dj, 0.15, 0.15, 0, 69.0))
    }
  }
}

/** A sandstone abutment block under each pylon pair and the arch's bearings. */
function abutment(k: Kit, d: boolean, s: number) {
  // In front of the pylons, the seat for the bearings; under and between
  // them, a higher block the deck's steel bent stands on.
  for (const [ya, yb, top] of [[HALF - 9, PY_IN, 7.0], [PY_IN, PY_OUT, 11.0]]) {
    const y0 = s * ya, y1 = s * yb
    footedLoft(k.sand, ground, [
      { plan: chamferedRect(-28, 28, Math.min(y0, y1), Math.max(y0, y1), 0.5), z: 'ground' },
      { plan: chamferedRect(-28, 28, Math.min(y0, y1), Math.max(y0, y1), 0.5), z: top },
    ], d ? 3 : 30)
  }
}

// ---- Approach spans --------------------------------------------------------------------

const TRUSS_D = 9.5         // approach truss depth, chord centres
const APP_DEPTH = 1.3       // the approach deck's soffit below the road

/** One deck-truss span from A to B (south to north), its s at A and B. */
function approachSpan(k: Kit, d: boolean, A: P2, B: P2, sA: number, sB: number, lit = true) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], e: P2 = [u[1], -u[0]]
  const P = (l: number, c: number, z: number): V3 => [A[0] + u[0] * l + e[0] * c, A[1] + u[1] * l + e[1] * c, z]
  const r = (l: number) => road(sA + ((sB - sA) * l) / L)
  const top = (l: number) => r(l) - APP_DEPTH - 0.6, bot = (l: number) => top(l) - TRUSS_D
  const ls = Array.from({ length: 7 }, (_, j) => 0.4 + (j * (L - 0.8)) / 6)
  const across: V3 = [e[0], e[1], 0]
  for (const c of [-TX, TX]) {
    member(k.steel, P(ls[0], c, top(ls[0])), P(ls[6], c, top(ls[6])), 1.4, 1.2, across, d)
    member(k.steel, P(ls[0], c, bot(ls[0])), P(ls[6], c, bot(ls[6])), 1.4, 1.4, across, d)
    for (let j = 0; j < 6; j++) {
      const [la, lb] = [ls[j], ls[j + 1]]
      // Warren: diagonals alternate up and down.
      const [p0, p1] = j % 2 === 0 ? [P(la, c, bot(la) + 0.7), P(lb, c, top(lb) - 0.6)] : [P(la, c, top(la) - 0.6), P(lb, c, bot(lb) + 0.7)]
      member(k.steel, p0, p1, 1.0, 1.0, across, false, !d)
    }
    for (let j = 0; j <= 6; j++) if (d)
      member(k.steel, P(ls[j], c, bot(ls[j]) + 0.7), P(ls[j], c, top(ls[j]) - 0.6), 0.9, 0.9, across)
  }
  if (d) for (let j = 0; j <= 6; j++) {
    const l = ls[j]
    // Cross frames between the two trusses.
    member(k.steel, P(l, -TX + 0.7, bot(l)), P(l, TX - 0.7, bot(l)), 0.7, 0.9, [u[0], u[1], 0])
    member(k.steel, P(l, -TX + 0.7, bot(l) + 0.5), P(l, TX - 0.7, top(l) - 0.5), 0.6, 0.6, [u[0], u[1], 0])
    member(k.steel, P(l, TX - 0.7, bot(l) + 0.5), P(l, -TX + 0.7, top(l) - 0.5), 0.6, 0.6, [u[0], u[1], 0])
  }
  void lit
  return { bottomAt: (l: number) => bot(l) - 0.7, P }
}

/** A pier pair at a joint between spans: square granite-faced shafts with caps. */
function pierPair(k: Kit, d: boolean, c: P2, e: P2, top: number) {
  const u: P2 = [-e[1], e[0]]
  for (const sg of [-1, 1]) {
    const q: P2 = [c[0] + e[0] * sg * TX, c[1] + e[1] * sg * TX]
    const plan = (h: number): [number, number][] => chamferedRect(-h, h, -h, h, d ? 0.3 : 0).map(([a, b]) =>
      [q[0] + e[0] * a + u[0] * b, q[1] + e[1] * a + u[1] * b] as [number, number])
    footedLoft(k.sand, ground, [
      { plan: plan(3.4), z: 'ground' },
      { plan: plan(2.9), z: top - 1.4 },
      { plan: plan(3.4), z: top - 1.4 },
      { plan: plan(3.4), z: top },
    ], d ? 3 : 40)
  }
}

function approaches(k: Kit, d: boolean) {
  // North: five spans along the OSM piers, curving west.
  let s = PY_OUT
  const northSpans: { A: P2; B: P2; sA: number; sB: number }[] = []
  for (let i = 0; i < NORTH_PIERS.length - 1; i++) {
    const A = NORTH_PIERS[i], B = NORTH_PIERS[i + 1], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    northSpans.push({ A, B, sA: s, sB: s + L })
    s += L
  }
  const southSpans: { A: P2; B: P2; sA: number; sB: number }[] = []
  for (let i = 0; i < SOUTH_PIERS.length - 1; i++)
    southSpans.push({ A: SOUTH_PIERS[i], B: SOUTH_PIERS[i + 1], sA: SOUTH_PIERS[i][1], sB: SOUTH_PIERS[i + 1][1] })
  for (const sp of [...northSpans, ...southSpans]) approachSpan(k, d, sp.A, sp.B, sp.sA, sp.sB)
  // Pier pairs at the four interior joints of each side, square to the bisector.
  const joints = (spans: typeof northSpans) => spans.slice(0, -1).map((a, i) => {
    const b = spans[i + 1]
    const ua: P2 = [a.B[0] - a.A[0], a.B[1] - a.A[1]], ub: P2 = [b.B[0] - b.A[0], b.B[1] - b.A[1]]
    const la = Math.hypot(...ua), lb = Math.hypot(...ub)
    const m: P2 = [ua[0] / la + ub[0] / lb, ua[1] / la + ub[1] / lb], ml = Math.hypot(...m)
    return { c: a.B, e: [m[1] / ml, -m[0] / ml] as P2, s: a.sB }
  })
  for (const j of [...joints(northSpans), ...joints(southSpans)])
    pierPair(k, d, j.c, j.e, road(j.s) - APP_DEPTH - 0.6 - TRUSS_D - 0.7)
  // The deck over the approach spans.
  const north = pathStations(NORTH_PIERS, PY_OUT, d ? 28 : 60)
  const south = pathStations(SOUTH_PIERS, -568.5, d ? 28 : 60)
  for (const run of [north, south]) {
    deck(k, d, run, { depth: () => APP_DEPTH, fascia: () => true, soffitHalf: () => EDGE })
    if (d) lamps(k, d, run, 36)
  }
  // Abutments at the far ends of the steel spans.
  const lastN = northSpans[northSpans.length - 1]
  const uN: P2 = [(lastN.B[0] - lastN.A[0]), (lastN.B[1] - lastN.A[1])]
  const lN = Math.hypot(...uN)
  abutBlock(k, d, NORTH_ABUT, [uN[0] / lN, uN[1] / lN], 14, 25, road(S_NORTH_ABUT) - APP_DEPTH - 0.3)
  abutBlock(k, d, [0, -574.25], [0, 1], 5.75, 25, road(574.25) - APP_DEPTH - 0.3)
}

/** A sandstone block about c, half-length hl along u and half-width hw, from the ground to `top`. */
function abutBlock(k: Kit, d: boolean, c: P2, u: P2, hl: number, hw: number, top: number) {
  const e: P2 = [u[1], -u[0]]
  const plan = (o: number) => chamferedRect(-hw - o, hw + o, -hl - o, hl + o, d ? 0.4 : 0).map(([a, b]) =>
    [c[0] + e[0] * a + u[0] * b, c[1] + e[1] * a + u[1] * b] as [number, number])
  footedLoft(k.sand, ground, [
    { plan: plan(0.6), z: 'ground' },
    { plan: plan(0.6), z: top - 1.6 },
    { plan: plan(0), z: top - 1.0 },
    { plan: plan(0), z: top },
  ], d ? 3 : 60)
}

// ---- Masonry approaches ---------------------------------------------------------------

/**
 * The masonry approach along a run: two parapeted retaining walls standing on
 * the ground, the fill's top just under the roadways, and the model's own
 * surfaces on it. `openings` are [s0, s1] stretches where a street passes
 * through under an arch.
 */
function masonry(k: Kit, d: boolean, sts: Station[], openings: [number, number][] = [], W1 = EDGE) {
  const W0 = W1 - 2.0
  for (let i = 0; i < sts.length - 1; i++) {
    const A = sts[i], B = sts[i + 1]
    const ra = road(A.s), rb = road(B.s)
    const sm = (A.s + B.s) / 2
    const open = openings.find(([a, b]) => sm > a && sm < b)
    for (const sg of [-1, 1]) {
      const c0 = sg * W0, c1 = sg * W1
      const g = (S: Station, c: number) => ground(...(at(S, c, 0).slice(0, 2) as P2))
      let lo = [g(A, c0), g(A, c1), g(B, c1), g(B, c0)]
      if (open) {
        // Over a street: the wall's spandrel above a semicircular arch.
        const [s0, s1] = open, rad = (s1 - s0) / 2, mid = (s0 + s1) / 2
        const gm = Math.min(...[A, B].map((S) => g(S, c1)))
        const spring = gm + 4
        const arcZ = (s: number) => spring + Math.sqrt(Math.max(0, rad * rad - (s - mid) ** 2))
        lo = [arcZ(A.s), arcZ(A.s), arcZ(B.s), arcZ(B.s)]
      }
      hexa(k.sand, [at(A, c0, lo[0]), at(A, c1, lo[1]), at(B, c1, lo[2]), at(B, c0, lo[3])],
        [at(A, c0, ra + 1.2), at(A, c1, ra + 1.2), at(B, c1, rb + 1.2), at(B, c0, rb + 1.2)], { capA: !!open, skip: [0, 2] })
    }
    // The fill's top, 0.4 m under the roadways, from wall to wall (seen from above only).
    quadOut(k.sand, [at(A, -W0, ra - 0.4), at(A, W0, ra - 0.4), at(B, W0, rb - 0.4), at(B, -W0, rb - 0.4)], [A.p[0], A.p[1], ra - 5])
    for (const [c0, c1, dz] of [[CYCLE[0] + 1.6, CYCLE[1], 0.15], [RAIL[0], RAIL[1], 0.3], [FOOT[0], FOOT[1] - 1.6, 0.15]] as [number, number, number][])
      hexa(k.deck, [at(A, c0, ra - 0.4), at(A, c1, ra - 0.4), at(B, c1, rb - 0.4), at(B, c0, rb - 0.4)],
        [at(A, c0, ra + dz), at(A, c1, ra + dz), at(B, c1, rb + dz), at(B, c0, rb + dz)], { capA: false, skip: d ? [0, 2] : [0, 1, 2, 3] })
    if (d) for (const c of TRACKS) for (const dc of [-0.72, 0.72])
      member(k.steel, at(A, c + dc, ra + 0.42), at(B, c + dc, rb + 0.42), 0.1, 0.18)
  }
  // End walls where the run meets the ground.
  const E = sts[0], r = road(E.s)
  const inward = nrm([sts[1].p[0] - E.p[0], sts[1].p[1] - E.p[1], 0])
  const lo = (c: number) => ground(...(at(E, c, 0).slice(0, 2) as P2))
  const q = (c: number, z: number, t: number) => add(at(E, c, z), mul(inward, t))
  block(k.sand, [q(-W1, lo(-W1), 0), q(W1, lo(W1), 0), q(W1, lo(W1), 1.2), q(-W1, lo(-W1), 1.2)],
    [q(-W1, r + 1.2, 0), q(W1, r + 1.2, 0), q(W1, r + 1.2, 1.2), q(-W1, r + 1.2, 1.2)])
}

function masonryRuns(k: Kit, d: boolean) {
  const south = pathStations(SOUTH_END, -835, d ? 20 : 40)
  masonry(k, d, south, [[-822, -808]])
  if (d) lamps(k, d, south, 36)
  const north = pathStations(NORTH_END, S_NORTH_ABUT, d ? 20 : 40).reverse().map((s) => ({ ...s, e: [-s.e[0], -s.e[1]] as P2 }))
  // Reversed so the run starts at the north end, which gets the end wall;
  // its across vector flips with it, which the symmetric walls don't mind.
  masonry(k, d, north, [], 22.0)
  if (d) lamps(k, d, [...north].reverse(), 36)
}

// ---- Build ------------------------------------------------------------------------------

function build(d: boolean): Kit {
  const k = kit()
  arch(k, d)
  mainDeck(k, d)
  for (const s of [-1, 1]) {
    abutment(k, d, s)
    for (const x of [-PX, PX]) pylon(k, d, x, s * PY)
  }
  approaches(k, d)
  masonryRuns(k, d)
  return k
}

// Night: the pylons and abutments are floodlit; the arch is washed from the
// deck, brightest above it; the approach steel only faintly.
const stoneLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.45 : 1.0) * (p[2] < 3 ? 0.5 : 1)
const sandLit = (p: V3, n: V3) => (Math.abs(p[1]) < PY_OUT + 2 ? 0.8 : 0.25) * (n[2] > 0.7 ? 0.6 : 1)
const steelLit = (p: V3, n: V3) => {
  if (Math.abs(p[1]) > HALF + 2) return 0.15
  if (p[2] < soffit(p[1]) - 0.5) return 0.3
  return (n[2] > 0.7 ? 0.55 : 0.9) * (0.75 + (0.25 * Math.min(1, (p[2] - 50) / 80)))
}

const STEEL = { ...finish('bridge-grey', 0x73777c), floodlight: steelLit }
const GRANITE = { ...finish('moruya-granite', 0xccb592), floodlight: stoneLit }
const SAND = { ...finish('sandstone', 0xc2a47e), floodlight: sandLit }
const DECK = finish('deck-grey', 0x8c8a86)
const LAMP = { name: 'lamp', color: 0x6d7075 }

const parts = (k: Kit, d: boolean) => [
  { part: k.steel, material: d ? { ...STEEL, doubleSided: false } : STEEL },
  { part: k.granite, material: GRANITE },
  { part: k.sand, material: SAND },
  { part: k.deck, material: DECK },
  { part: k.lamp, material: LAMP },
]

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at mid-span on the water',
  bearing: 27.67, elevation: 0, hinges: [-HALF, HALF], trussPlanes: [-TX, TX],
  roadwayMidspan: road(0), roadwayAtPylons: road(PY), roadwaySouthAbutment: road(574.25),
  roadwayNorthAbutment: road(S_NORTH_ABUT), roadwaySouthEnd: road(835),
}

if (import.meta.main) {
  for (const [file, d, maxTris, maxBytes] of [
    ['sydney-harbour-bridge.glb', false, 6500, 250 * 1024],
    ['sydney-harbour-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const k = build(d)
    const l = parts(k, d)
    let tris = 0
    for (const { part } of l) tris += part.triangles
    const glb = writeGlb('Sydney Harbour Bridge', l, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
}
