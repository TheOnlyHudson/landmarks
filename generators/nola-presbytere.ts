/**
 * The Presbytère, Jackson Square, New Orleans (begun 1791, completed 1813;
 * mansard roof 1847; cupola lost in the 1915 hurricane and restored in
 * 2005) — procedural, CC0-1.0, no textures.
 * bun generators/nola-presbytere.ts
 *
 * Built with the Cabildo's kit (`buildCasa` and friends, exported from
 * nola-cabildo.ts): the two were designed as a pair either side of the
 * cathedral, and share the front, the mansard and the cupola.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 307.9, the bearing at which the
 * OSM outline's walls run square to the axes: model −y is the front on
 * Chartres Street, facing compass 128 over Jackson Square; model −x is Père
 * Antoine Alley and the cathedral, model +x is St. Ann Street. Anchor: the
 * area centroid of the outer way of the OSM multipolygon relation/4610716.
 *
 * Identity: the nine-bay arcaded front (open round arches, round-headed
 * upper windows behind iron balconies, pilasters), the pediment over the
 * three middle bays with its round oculus, the slate mansard with a white
 * dormer over every bay, the restored cupola (white balustrade and drum,
 * slate dome and spike); the warm peach-pink stucco that tells it from the
 * greyer Cabildo.
 *
 * Evidence
 * - OSM relation/4610716 (outer way/480129898, courtyard way/329364438;
 *   36.1 m front, the main block 17.9 m deep, rear wings to 33 m) and its
 *   parts way/1548518181 (the mansard block, 18 m), way/1548822566 and
 *   way/1548822567 (the rear wings, 11 m), way/1548822568 (the rear range,
 *   skillion), way/1548822563/564/565 (the cupola's base, dome and spike).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame. Ground flat (z = 0 at 0.2 m over
 *   the grid's minimum). Front cornice/roof edge 14.6-14.8 one cell in, the
 *   ridge 18.6-18.9 (hipped ends), the cupola 23.7 (sparse), both rear
 *   wings a flat 11.4, the rear range 12-14.3.
 * - Terrain (Mapterhorn): flat within 0.6 m. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "The Presbytere (55151951579).jpg", ajay_suresh, CC BY 4.0: the
 *     front and the St. Ann side from the corner (the colour, the oculus,
 *     the restored cupola, the side's bays)
 *     https://commons.wikimedia.org/wiki/File:The_Presbytere_(55151951579).jpg
 *   - "The Cabildo, St. Louis Cathedral, Presbytere, New Orleans.jpg",
 *     Spatms, CC BY-SA 4.0: the front in sun from the square
 *     https://commons.wikimedia.org/wiki/File:The_Cabildo,_St._Louis_Cathedral,_Presbytere,_New_Orleans.jpg
 *   - "The Cabildo, St. Louis Cathedral, Presbytere, New Orleans from
 *     Moonwalk.jpg", Spatms, CC BY-SA 4.0: the roofs and cupolas from the
 *     levee
 *     https://commons.wikimedia.org/wiki/File:The_Cabildo,_St._Louis_Cathedral,_Presbytere,_New_Orleans_from_Moonwalk.jpg
 *   - "Jackson Square Aerial Photo.jpg", Jordon Dopp, CC BY-SA 4.0: the
 *     front, roof and cupola from above the square
 *     https://commons.wikimedia.org/wiki/File:Jackson_Square_Aerial_Photo.jpg
 *   - "Aerial photograph of Jackson Square, New Orleans, Louisiana.jpg",
 *     Mark Westguard, CC0: the roof plan
 *     https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Jackson_Square,_New_Orleans,_Louisiana.jpg
 *   - The Cabildo's photos (nola-cabildo.ts) for the shared front.
 * - Published: Wikipedia, "The Presbytere": begun 1791 as the Casa Curial,
 *   finished 1813, the mansard added 1847; the cupola, lost in 1915, was
 *   restored in 2005.
 *
 * Measured (lidar): the plan from OSM checked against the grid, the ridge
 * 18.8, the rear wings 11.4, the rear range to 14.3, the cupola ~24.
 * Estimated: the front's storeys and openings, from the Cabildo's face-on
 * photo (the two fronts match bay for bay in the aerial and in ajay_suresh's
 * photo), widened to this front's 36.1 m; the oculus (r 0.7); the side and
 * rear bays (counts estimated from the St. Ann photo; the alley side is not
 * photographed face-on and repeats it).
 * Left out: the lettering on the frieze, lamps, signs.
 *
 * Doubts: the rear wings' flat roofs are drawn flat as the lidar shows them;
 * their facades (two storeys of arched windows) are estimated.
 *
 * Night: the front is floodlit, the windows glow.
 */
import { finish, PALETTE } from './palette'
import { finishModel } from './nyc-570-lexington'
import { newParts, buildCasa, wing, sideBays, spaced, frontLight, LOGGIA, SLATE, IRON, DOOR } from './nola-cabildo'

const P = newParts()
const x0 = -18.1, x1 = 18.0, yF = -16.6, yB = 1.3

buildCasa(P, {
  x0, x1, yF, yB, tympanum: 'oculus',
  endBays: spaced(yF + LOGGIA, yB, 4),
  rearBays: spaced(x0, x1, 9),
  rearWindows: spaced(-6.0, 4.8, 3),
})

// Rear wings round the courtyard (lidar: both flat at 11.4), the rear range
// across its back (12, a low roof to ~14).
const wW = wing(P, x0, yB, -6.0, 16.8, 11.4, 0)
const eW = wing(P, 4.8, yB, x1, 16.5, 11.4, 0)
const rR = wing(P, -6.0, 7.4, 4.8, 16.6, 12.0, 2.2)
sideBays(P, wW.w, spaced(0, 16.8 - yB, 4), { lower: 'window', h: 11.4, balcony: true })
sideBays(P, eW.e, spaced(0, 16.5 - yB, 4), { lower: 'window', h: 11.4, balcony: true })
sideBays(P, wW.n, spaced(0, -6.0 - x0, 3), { lower: 'window', h: 11.4 })
sideBays(P, eW.n, spaced(0, x1 - 4.8, 3), { lower: 'window', h: 11.4 })
sideBays(P, rR.n, spaced(0, 10.8, 2), { lower: 'window', h: 11.4 })

finishModel('The Presbytère', 'nola-presbytere', [
  { part: P.stucco, material: { ...finish('presbytere-stucco', 0xeed3c2), floodlight: frontLight(yF) } },
  { part: P.trim, material: PALETTE.trim },
  { part: P.slate, material: SLATE },
  { part: P.win, material: PALETTE.window },
  { part: P.iron, material: IRON },
  { part: P.door, material: DOOR },
], { bearing: 307.9, osm: 'relation/4610716', height: 26.8 }, 6500)
