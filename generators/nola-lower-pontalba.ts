/**
 * Lower Pontalba Building, St. Ann Street on Jackson Square, New Orleans
 * (1849-51, James Gallier Sr. and Henry Howard for the Baroness de Pontalba;
 * the 1850 House museum is in it) — procedural, CC0-1.0, no textures.
 * bun generators/nola-lower-pontalba.ts
 *
 * The mirror of the Upper Pontalba across the square, built with its kit
 * (`buildPontalba`, exported from nola-upper-pontalba.ts, which builds on
 * nola-cabildo.ts). Only the placement, the front's depth and the rear
 * blocks differ.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 217.9, the bearing at which the
 * OSM outline's walls run square to the axes: model +y is the front, facing
 * compass 218 over St. Ann Street to Jackson Square; model +x runs along St.
 * Ann toward Chartres Street (compass 308), model −x is Decatur Street and
 * the river. Anchor: the area centroid of the outer way of the OSM
 * multipolygon relation/4610710.
 *
 * Identity: as the Upper Pontalba (see nola-upper-pontalba.ts): the long
 * red-brick row, the two continuous iron galleries on posts wrapping both
 * ends with rounded corners, the three pedimented pavilions with octagonal
 * oculi, the attic grilles under a pale cornice, the shopfronts, the slate
 * roofs with party walls and chimneys, and the rear wings' saw-tooth.
 *
 * Evidence
 * - OSM relation/4610710 (outer way/329364444: 115 m along St. Ann, 52 m
 *   deep; light wells and a rear courtyard as inner ways) and its parts
 *   way/1548825294 (the front range and end pavilions, 17 m, gabled) and
 *   way/1548825295 (the galleries, 9 m).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame. Ground flat (z = 0 at 0.4 m over the
 *   grid's minimum). Front wall at y 23.5, the galleries' decks (8.8) out
 *   to ~25.8; front eaves 15.8-15.9; the front range's ridge 18.5 ~8 m
 *   back; pediments 18.5 at x ≈ −47.5, 0.5 and 48.5; the end pavilions'
 *   ridges back along the side streets to y ≈ −5; chimneys to 19; the rear
 *   wings 11-15 between light wells; behind them blocks of 10.5-17 (read
 *   per block, see `rear` below).
 * - Terrain (Mapterhorn): flat within 0.5 m. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "New Orleans August 2022 - Lower Pontalba from Jackson Square.jpg",
 *     Tom Hilton, CC BY 2.0: the Decatur corner from the square (the end
 *     pavilion's pediment and octagonal oculus, both galleries round the
 *     corner, the attic grilles, the shopfronts and granite piers)
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_August_2022_-_Lower_Pontalba_from_Jackson_Square.jpg
 *   - "Aerial photograph of Jackson Square, New Orleans, Louisiana.jpg",
 *     Mark Westguard, CC0: this building from above at the Decatur end (the
 *     front range's roof with its white-coped party walls and chimneys, the
 *     end pavilion's roof, the rear wings' hips and light wells, the
 *     galleries on posts round the Decatur corner)
 *     https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Jackson_Square,_New_Orleans,_Louisiana.jpg
 *   - The Upper Pontalba's photos (nola-upper-pontalba.ts) for the shared
 *     front.
 * - Published: Wikipedia, "Pontalba Buildings".
 *
 * Measured (lidar): the plan, the front wall, gallery depth (2.3 m), eaves,
 * ridges, pediments, the rear wings and blocks. Estimated: as the Upper
 * Pontalba (storeys, bays, windows, grilles, posts, party walls).
 *
 * Doubts: OSM puts the Decatur end wall ~2 m further in (x −54.2) than the
 * lidar's eaves and galleries (−56.3 and −58.3); the lidar is followed, and
 * the model is symmetric about the centre pavilion. The rear blocks are
 * plain brick at averaged lidar heights; no photo shows their back faces.
 *
 * Night: the windows and the shops' transoms glow (`window`).
 */
import { PALETTE } from './palette'
import { finishModel } from './nyc-570-lexington'
import { IRON, DOOR } from './nola-cabildo'
import { newPParts, buildPontalba, BRICK } from './nola-upper-pontalba'

const P = newPParts()
buildPontalba(P, {
  yW: 23.5, D: 2.3, endDepth: 28.3,
  rear: [
    { x0: -56.3, x1: -42.8, yBack: -25.1, h: 12.0, kind: 'wings' },
    { x0: -42.8, x1: -25.2, yBack: -25.8, h: 10.7, kind: 'flat', yFront: -12.2 },
    { x0: -25.2, x1: 0.8, yBack: -26.5, h: 11.5, kind: 'wings', yFront: -12.0 },
    { x0: 0.8, x1: 18.6, yBack: -27.4, h: 13.0, kind: 'wings' },
    { x0: 18.7, x1: 33.0, yBack: -25.8, h: 8.0, kind: 'wings', yFront: -7.6 },
    { x0: 33.0, x1: 56.4, yBack: -26.0, h: 13.5, kind: 'wings' },
  ],
})
finishModel('Lower Pontalba Building', 'nola-lower-pontalba', [
  { part: P.brick, material: BRICK },
  { part: P.trim, material: PALETTE.trim },
  { part: P.roof, material: PALETTE.roof },
  { part: P.win, material: PALETTE.window },
  { part: P.iron, material: IRON },
  { part: P.door, material: DOOR },
], { bearing: 217.9, osm: 'relation/4610710', height: 18.9 }, 6500)
