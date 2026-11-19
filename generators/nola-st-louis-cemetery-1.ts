/**
 * St. Louis Cemetery No. 1, Basin Street at St. Louis Street, Tremé, New
 * Orleans (1789) — procedural, CC0-1.0, no textures.
 * bun generators/nola-st-louis-cemetery-1.ts
 *
 * The "city of the dead": a walled block of whitewashed above-ground tombs.
 * Drawn abstractly: the perimeter wall with its row of wall vaults ("oven"
 * vaults) along the inside, the family tombs as rows of small gabled blocks
 * along the real aisles, and the four tallest society tombs as their own
 * forms (the round Italian Mutual Benevolent Society tomb with its statue,
 * and three tall square society/family tombs near it).
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * area centroid of OSM way/27936018 (−90.0715043, 29.9594141). Placed at
 * bearing 38.1: model +y faces St. Louis Street (compass 38.1°), +x Basin
 * Street (128.1°), −y Conti Street, −x Tremé Street. In this frame the OSM
 * outline is a rectangle x ±51.8, y −42.4..42.7.
 *
 * Evidence
 * - OSM way/27936018 (landuse=cemetery, barrier=wall, historic=cemetery):
 *   the outline. No building or path is mapped inside it, so `replaces` is
 *   empty (checked with the OSM API map call).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid, read in the model frame. Ground inside is flat (±0.1 m).
 *   Tomb positions, gaps and heights: the tombs below were laid out by a
 *   script (kept with the work notes) that finds the aisles in each section
 *   between the cross aisles (y ≈ −38, −29.5, −11, 1, 16.5, 34.5) from the
 *   lidar occupancy, splits each strip between aisles into one to three rows
 *   about 3.4 m deep, cuts each row into tomb lengths of 2.4-3.3 m, keeps a
 *   tomb only where the lidar shows something 1.2-6.5 m tall over most of
 *   it, takes its height as the 75th percentile there (1.9-4.6 m), and merges
 *   neighbours of like height into one block. Wall vault heights per 4 m
 *   stretch, the same way. The society tombs (measured): Italian tomb centre
 *   (5, −24.5), drum r ≈ 3.3 to ~5 m, upper stage to ~7.5-8.5, statue top
 *   10.0; tomb C x −27.3..−21.7, y −22.3..−14.7, 5.2 m, its centre to 8.7;
 *   tomb A x 2..8, y −37.3..−30.3, 5.9 m, centre to 8.0; tomb D x −2.6..2.4,
 *   y −20.4..−16.6, 5.4 m, peak 6.9.
 * - NAIP (USGS, public domain): the aisles' plan, the Protestant lawn in the
 *   west corner (x < −38, y < 0, no tall tombs), the round white top of the
 *   Italian tomb; each tomb's tone (white / weathered grey / bare brick) is
 *   read from the NAIP colour over its footprint, nudged toward white because
 *   the tops weather darker than the whitewashed fronts the street sees.
 *   White tombs get a pale grey cap (`tomb-cap`): their weathered tops, and
 *   what lets the white rows read against the pale ground at map scale.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Basin Street New Orleans Lake Side April 2017 11/12/14.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the smooth whitewashed wall
 *     along Basin Street with tombs showing above it
 *     https://commons.wikimedia.org/wiki/File:Basin_Street_New_Orleans_Lake_Side_April_2017_11.jpg
 *   - "StLouis1CemFrontGate.jpg", Infrogmation, CC BY 2.5: the Basin Street
 *     gate, white pillars, iron gate with a cross
 *     https://commons.wikimedia.org/wiki/File:StLouis1CemFrontGate.jpg
 *   - "StLouis1CemFrontOvenRow.jpg", Infrogmation, CC BY 2.5: the white wall
 *     vaults inside, ~3 m, three tiers of arched vault fronts
 *     https://commons.wikimedia.org/wiki/File:StLouis1CemFrontOvenRow.jpg
 *   - "St Louis Street, Treme, New Orleans October 2017 05/06/09.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the old red-brick wall on
 *     St. Louis Street with pedimented tombs over it
 *     https://commons.wikimedia.org/wiki/File:St_Louis_Street,_Treme,_New_Orleans_October_2017_06.jpg
 *   - "City of the Dead New Orleans.jpg", Bart Everson, CC BY 2.0: an
 *     elevated view over the tomb rows (white, grey, bare-brick boxes with
 *     pediments and cornices)
 *     https://commons.wikimedia.org/wiki/File:City_of_the_Dead_New_Orleans.jpg
 *   - "New Orleans, LA, St Louis Cemetery One, Feb 2011 - 11.jpg", JasonParis,
 *     CC BY 2.0, and "S Louis Cemetery 1 NOLA 1 Nov 2017 06.jpg", Infrogmation
 *     of New Orleans, CC BY-SA 4.0: the Italian tomb — marble drum with vault
 *     doors and a dentil cornice, two arched niches on its front, a smaller
 *     upper drum and the standing figure with a cross
 *     https://commons.wikimedia.org/wiki/File:New_Orleans,_LA,_St_Louis_Cemetery_One,_Feb_2011_-_11.jpg
 *     https://commons.wikimedia.org/wiki/File:S_Louis_Cemetery_1_NOLA_1_Nov_2017_06.jpg
 *   - "Italian society tomb, old St. Louis cem, by George F. Mugnier.jpg",
 *     public domain: the same tomb's front, whole
 *     https://commons.wikimedia.org/wiki/File:Italian_society_tomb,_old_St._Louis_cem,_by_George_F._Mugnier.jpg
 *   - "StLouisCem1HighBack.jpg", Infrogmation, CC BY 2.5: a tall square tomb
 *     with a stepped top and figure beside the Italian tomb
 *     https://commons.wikimedia.org/wiki/File:StLouisCem1HighBack.jpg
 *   - "St. Louis Cemetery No 1 New Orleans, 27 August 2022 - 01..12.jpg", Tom
 *     Hilton, CC BY 2.0: aisles, tombs (2.5-3.5 m, pediments), the pyramid
 *     https://commons.wikimedia.org/wiki/File:St._Louis_Cemetery_No_1_New_Orleans,_27_August_2022_-_09.jpg
 *   - "Saint Louis Cemetery 1 NOLA 1 November 2017 *.jpg", Infrogmation of
 *     New Orleans, CC BY-SA 4.0: tombs and the brick wall by the lawn
 *     https://commons.wikimedia.org/wiki/File:Saint_Louis_Cemetery_1_NOLA_1_November_2017_40.jpg
 *
 * Measured (lidar): every tomb's place and height, the wall vault heights,
 * the society tombs' plans and heights. Estimated: tomb roofs (low pediments,
 * 0.4-0.75 m rise — many real tombs are flat-topped with a cornice instead),
 * wall vault depth 3.2 m and base height 2.9 m from the photos (the lidar
 * reads 1.9-2.5 over the vault strip, which mixes in the aisle), the Italian
 * tomb's niches and stages from the photos scaled to the lidar, which way it
 * faces (−y, onto the cross aisle, where the lidar shows something projecting),
 * and the other three society tombs' tops (stepped pedestals and figures,
 * from their lidar peaks and the "HighBack" photo). Which sides of the outer
 * wall are brick (St. Louis Street from photos; Tremé Street estimated) and
 * which whitewashed (Basin and Conti from photos).
 * Left out: individual tomb detail (cornices, crosses, iron fences), vault
 * fronts, the gate's office, Nicolas Cage's 3 m pyramid, ledger slabs on the
 * lawn, trees.
 *
 * Doubts: tombs are grouped, so the rows are approximate within about a
 * metre; the lidar blurs neighbours together. The Tremé (−x) side of the wall
 * has no photo. No individual society tomb but the Italian one is identified
 * by name.
 *
 * Night: the cemetery is unlit; nothing glows.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel, circle, type XY } from './nyc-570-lexington'
import { block, figure } from './nyc-city-hall'
import { tri, quad, slabY } from './nola-st-patricks-church'

// Tombs: x0,y0,x1,y1,height,tone(0 white, 1 grey, 2 brick),facing(−1/1 one aisle, 0 both).
const TOMBS = `
  -46.5,20.18,-42.5,25.72,2.0,0 -46.5,25.88,-42.5,33.82,1.9,1 -46.5,35.38,-43.0,38.62,1.9,1 -46.0,4.68,-42.32,10.52,1.9,1 -46.0,10.68,-42.32,15.82,2.4,0 -45.5,-37.22,-42.5,-30.18,1.9,2
  -42.02,4.98,-38.48,8.12,1.9,1 -42.02,8.28,-38.48,10.52,1.9,0 -42.02,13.08,-38.48,15.82,2.2,1 -41.5,17.18,-37.9,25.42,2.0,1 -41.5,25.58,-37.9,33.82,2.6,0 -40.5,35.38,-36.9,38.62,2.1,0
  -38.5,-28.62,-34.0,-22.48,2.3,0 -38.5,-22.32,-34.0,-17.08,2.3,1 -38.5,-16.92,-34.0,-11.98,2.3,0 -38.5,-10.42,-36.15,-2.18,2.3,0 -38.5,-2.02,-36.15,0.02,2.3,1 -38.18,1.98,-34.5,9.92,2.3,0
  -38.18,12.48,-34.5,15.82,2.3,0 -37.6,17.18,-34.0,22.12,2.0,0 -37.6,22.28,-34.0,25.42,3.3,1 -37.6,25.58,-34.0,28.12,3.3,0 -37.6,28.28,-34.0,31.42,1.9,0 -37.5,-37.22,-33.0,-34.08,2.0,0
  -37.5,-33.92,-33.0,-30.18,2.9,2 -36.6,35.38,-33.0,38.62,1.9,0 -35.85,-10.42,-33.5,-4.88,2.3,1 -35.85,-4.72,-33.5,0.02,2.3,0 -33.0,17.18,-29.4,23.62,2.1,1 -33.0,23.78,-29.4,26.92,2.3,0
  -32.5,-25.92,-28.0,-23.08,2.7,1 -32.5,-22.92,-28.0,-17.08,2.1,1 -32.5,-16.92,-28.0,-13.78,1.9,0 -32.5,-13.62,-28.0,-11.98,2.9,0 -32.5,-10.42,-28.0,-2.48,1.9,0 -32.5,-2.32,-28.0,0.02,1.9,0
  -32.5,4.38,-28.65,12.92,2.2,0 -32.5,13.08,-28.65,15.82,1.9,1 -31.5,-37.22,-29.0,-30.18,2.0,0 -31.0,35.38,-28.15,38.62,2.0,1 -29.1,17.18,-25.5,19.72,2.2,0 -29.1,19.88,-25.5,28.12,2.7,0
  -29.1,28.28,-25.5,31.42,2.5,0 -29.1,31.58,-25.5,33.82,1.9,0 -28.35,1.98,-24.5,8.12,2.8,1 -28.35,8.28,-24.5,11.42,2.4,0 -27.85,35.38,-25.0,38.62,1.9,0 -27.5,-28.62,-23.48,-23.38,2.5,0
  -27.5,-13.92,-23.48,-11.98,1.9,0 -27.0,-37.22,-24.0,-32.28,2.5,0 -27.0,-32.12,-24.0,-30.18,1.9,1 -27.0,-10.42,-23.9,-5.18,1.9,0 -24.5,19.58,-20.94,26.92,1.9,0 -24.5,27.08,-20.94,33.82,2.4,1
  -23.6,-10.42,-20.5,-5.78,1.9,0 -23.5,4.68,-19.86,7.82,1.9,1 -23.5,7.98,-19.86,15.82,1.9,0 -23.5,35.38,-20.15,38.62,2.3,0 -23.18,-28.62,-19.32,-23.98,2.9,1 -22.0,-37.22,-18.5,-34.08,1.9,1
  -22.0,-33.92,-18.5,-30.18,1.9,0 -20.64,17.18,-17.22,22.12,1.9,0 -20.64,27.98,-17.22,33.82,2.2,0 -19.85,35.38,-16.65,38.62,2.1,0 -19.56,1.98,-16.08,8.42,2.2,0 -19.56,11.58,-16.08,15.82,2.0,0
  -19.02,-28.62,-15.0,-19.48,2.6,0 -19.02,-19.32,-15.0,-16.18,2.5,1 -19.0,-10.42,-17.0,-7.58,1.9,2 -16.92,17.18,-13.51,25.72,2.4,1 -16.92,25.88,-13.51,28.42,1.9,0 -16.92,31.28,-13.51,33.82,2.2,1
  -16.35,35.38,-13.0,38.62,1.9,0 -15.78,5.28,-12.29,7.52,2.4,0 -15.78,10.38,-12.29,15.82,2.3,1 -14.0,-26.22,-10.61,-20.08,2.0,0 -14.0,-17.22,-10.61,-11.98,4.6,0 -14.0,-7.42,-10.82,-2.18,3.7,1
  -14.0,-2.02,-10.82,0.02,3.2,0 -13.5,-37.22,-10.02,-34.98,1.9,0 -13.5,-34.82,-10.02,-30.18,3.7,1 -13.21,17.18,-9.79,20.32,1.9,0 -13.21,22.88,-9.79,28.72,2.8,0 -13.21,28.88,-9.79,31.72,2.9,1
  -11.99,1.98,-8.51,7.52,2.3,0 -11.99,10.38,-8.51,15.82,1.9,1 -10.52,-10.42,-7.48,-5.48,1.9,0 -10.52,-2.02,-7.48,0.02,3.2,2 -10.5,35.38,-7.9,38.62,1.9,1 -10.31,-23.52,-7.07,-17.98,2.2,0
  -10.31,-15.12,-7.07,-11.98,4.6,1 -9.72,-33.92,-6.4,-30.18,3.4,1 -9.49,17.18,-6.08,25.12,2.0,0 -8.21,7.98,-4.72,15.82,1.9,0 -7.6,35.38,-5.0,38.62,2.2,0 -7.18,-10.42,-4.0,-7.58,1.9,0
  -7.18,-7.42,-4.0,-1.58,2.5,0 -6.77,-28.62,-3.53,-22.18,2.4,0 -6.77,-22.02,-3.53,-17.08,2.3,1 -6.77,-16.92,-3.53,-13.78,4.2,1 -6.1,-37.22,-2.78,-34.68,2.9,0 -6.1,-34.52,-2.78,-30.18,3.5,0
  -5.78,22.58,-2.36,25.72,2.3,0 -5.78,28.28,-2.36,31.42,2.3,0 -5.78,31.58,-2.36,33.82,3.2,0 -4.42,1.98,-0.94,9.92,2.0,0 -3.23,-28.62,0.0,-23.08,2.4,1 -3.0,-10.42,0.15,-4.28,2.5,0
  -3.0,-4.12,0.15,0.02,2.3,1 -3.0,35.38,0.18,38.62,2.3,0 -2.48,-37.22,1.0,-32.28,2.3,1 -2.06,17.18,1.5,22.42,2.2,1 -2.06,24.98,1.5,27.22,2.1,0 -0.64,1.98,3.0,4.82,2.6,0
  -0.64,4.98,3.0,8.12,2.0,0 -0.64,10.98,3.0,13.82,1.9,0 0.3,-14.52,3.54,-11.98,3.0,0 0.45,-10.42,3.45,-7.28,1.9,0 0.45,-7.12,3.45,-4.58,3.2,0 0.45,-4.42,3.45,0.02,2.2,0
  0.48,35.38,3.52,38.62,2.4,0 2.0,17.18,5.52,25.42,2.3,1 2.0,25.58,5.52,28.72,2.9,1 2.0,28.88,5.52,31.12,2.9,0 2.0,31.28,5.52,33.82,1.9,1 3.5,1.98,6.85,9.62,2.1,1
  3.5,9.78,6.85,15.82,2.2,0 3.75,-10.42,6.75,-7.88,1.9,0 3.75,-7.72,6.75,-4.58,3.2,0 3.75,-4.42,6.75,-1.58,2.2,0 3.82,35.38,6.85,38.62,2.4,1 3.84,-14.82,7.08,-11.98,2.7,0
  5.82,17.18,9.18,20.02,2.3,1 5.82,25.28,9.18,31.12,2.2,1 7.05,-10.42,10.05,-7.28,2.7,0 7.05,-7.12,10.05,-3.98,2.1,1 7.05,-3.82,10.05,0.02,2.7,1 7.15,1.98,10.35,5.12,2.3,0
  7.15,5.28,10.35,10.82,2.0,2 7.15,10.98,10.35,13.82,4.6,1 7.15,35.38,10.18,38.62,3.6,1 7.38,-17.52,10.62,-14.38,3.9,0 9.48,17.18,13.0,23.02,2.5,0 9.48,28.88,13.0,31.12,2.3,1
  10.0,-37.22,13.22,-30.18,2.2,1 10.35,-8.02,13.5,-2.78,2.0,0 10.35,-2.62,13.5,0.02,2.7,0 10.48,35.38,13.52,38.62,2.8,0 10.65,1.98,14.0,4.22,2.9,0 10.65,9.48,14.0,11.72,2.0,1
  10.65,11.88,14.0,14.12,4.6,0 10.65,14.28,14.0,15.82,1.9,2 10.92,-28.62,14.16,-23.08,3.1,0 10.92,-22.92,14.16,-20.68,2.4,0 10.92,-20.52,14.16,-17.38,4.5,0 10.92,-17.22,14.16,-14.08,4.3,1
  13.52,-37.22,16.6,-32.28,3.1,0 13.52,-32.12,16.6,-30.18,2.3,0 13.82,35.38,17.0,38.62,2.7,0 14.46,-25.32,17.7,-19.78,2.0,0 14.46,-19.62,17.7,-11.98,2.0,1 14.5,-10.42,17.85,-8.18,2.2,0
  14.5,-5.32,17.85,-2.18,1.9,0 14.5,-2.02,17.85,0.02,2.7,0 14.5,17.18,18.35,22.12,2.1,1 14.5,22.28,18.35,29.62,2.3,0 14.5,29.78,18.35,33.82,3.4,0 15.5,1.98,18.68,7.22,2.9,1
  15.5,10.08,18.68,12.92,2.8,0 15.5,13.08,18.68,15.82,2.1,0 16.9,-37.22,19.98,-32.58,3.1,0 16.9,-32.42,19.98,-30.18,1.9,0 18.0,-26.22,21.23,-21.28,4.6,0 18.0,-21.12,21.23,-11.98,1.9,0
  18.15,-7.12,21.35,-1.58,2.1,1 18.15,-1.42,21.35,0.02,2.0,0 18.65,17.18,22.5,22.42,2.4,1 18.65,22.58,22.5,25.72,2.4,0 18.65,29.18,22.5,33.82,2.6,1 18.98,11.58,22.02,15.82,2.1,0
  20.27,-34.52,23.5,-30.18,2.0,0 21.53,-26.22,24.77,-23.38,1.9,1 21.53,-20.82,24.77,-16.18,2.0,1 21.53,-16.02,24.77,-11.98,1.9,2 21.65,-10.42,25.0,-5.78,2.0,0 22.32,4.98,25.35,7.22,2.9,0
  22.32,10.38,25.35,12.62,2.2,0 23.5,19.88,26.78,26.02,2.5,0 23.5,28.58,26.78,31.72,3.4,1 25.0,-37.22,28.6,-34.08,1.9,0 25.0,-33.92,28.6,-30.18,2.5,0 25.0,35.38,29.02,38.62,2.3,0
  25.07,-28.62,28.31,-23.38,3.2,0 25.07,-23.22,28.31,-20.98,1.9,0 25.07,-18.12,28.31,-14.98,2.3,0 25.5,-10.42,28.85,-1.88,2.2,0 25.5,-1.72,28.85,0.02,1.9,1 25.65,5.28,28.68,7.52,2.7,1
  25.65,7.68,28.68,12.92,2.1,1 27.08,17.18,30.21,21.82,2.3,2 27.08,21.98,30.21,25.12,2.5,0 28.61,-28.62,32.0,-19.78,2.1,0 28.61,-19.62,32.0,-16.48,2.2,0 28.61,-16.32,32.0,-14.08,2.3,1
  28.9,-37.22,32.5,-30.18,2.5,0 28.98,1.98,32.02,7.22,2.4,1 28.98,7.38,32.02,15.82,2.9,0 29.15,-4.72,32.35,0.02,2.0,0 29.32,35.38,33.18,38.62,1.9,0 30.51,25.28,33.64,31.72,1.9,0
  30.51,31.88,33.64,33.82,1.9,1 32.32,1.98,35.5,9.92,2.7,0 32.65,-10.42,36.0,0.02,2.2,0 33.48,35.38,37.5,38.62,1.9,1 33.5,-37.22,37.5,-30.18,1.9,0 33.5,-28.62,37.5,-18.88,2.1,0
  33.94,17.18,37.06,19.42,2.2,1 33.94,30.98,37.06,33.82,2.0,1 37.36,17.18,40.49,22.72,2.3,0 37.36,25.88,40.49,31.42,2.2,0 37.36,31.58,40.49,33.82,2.3,2 38.0,-5.32,41.02,-2.48,2.8,0
  38.0,1.98,42.35,7.52,2.9,1 38.0,7.68,42.35,9.92,2.1,1 38.5,-37.22,42.85,-31.98,2.4,0 39.0,-28.62,43.1,-26.38,2.3,0 39.0,-18.12,43.1,-11.98,2.8,0 40.79,17.18,43.92,22.72,1.9,0
  40.79,22.88,43.92,26.02,1.9,1 40.79,26.18,43.92,31.42,2.5,1 41.0,35.38,45.0,38.62,2.1,1 41.32,-10.42,44.18,-7.28,2.2,0 41.32,-7.12,44.18,-1.88,2.9,1 41.32,-1.72,44.18,0.02,2.9,0
  42.65,1.98,47.0,9.92,2.4,1 42.65,10.08,47.0,15.82,2.6,0 43.15,-37.22,47.5,-34.98,1.9,0 43.15,-34.82,47.5,-31.98,2.5,0 43.4,-28.62,47.5,-23.68,1.9,0 43.4,-23.52,47.5,-20.98,2.7,1
  43.4,-17.82,47.5,-11.98,2.3,1 44.22,23.48,47.5,26.32,2.0,1 44.48,-10.42,47.5,-7.28,2.9,0 44.48,-7.12,47.5,-4.58,2.2,0 44.48,-2.02,47.5,0.02,4.6,0 45.5,35.38,47.5,38.62,2.1,0
`.trim().split(/\s+/).map((s) => s.split(',').map(Number))

// Wall-vault heights per 4 m stretch (lidar 60th percentile), N/S from x −51.8, W/E from y −38.9.
const WALLS: Record<string, number[]> = {
  N: [2.0, 2.3, 2.0, 1.9, 1.5, 1.9, 1.6, 4.2, 2.7, 2.4, 2.4, 2.4, 2.5, 2.9, 2.0, 2.8, 4.9, 4.9, 3.1, 2.7, 2.8, 2.7, 2.6, 2.7, 1.5, 2.5],
  S: [0, 0, 0, 1.9, 1.9, 2.4, 1.9, 3.8, 3.9, 1.6, 1.7, 2.0, 2.2, 1.7, 1.8, 1.7, 2.1, 3.5, 1.5, 1.6, 2.4, 2.4, 2.3, 2.3, 2.3, 2.4],
  W: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2.0, 1.9, 1.9, 2.1, 1.9, 1.2, 2.1, 1.9, 1.9, 2.6, 1.9],
  E: [2.4, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.8, 1.4, 2.0, 1.8, 2.0, 2.2, 2.1, 2.0, 1.7, 2.5],
}

const OX = 51.8, OY0 = -42.4, OY1 = 42.7   // the outline
const DEPTH = 3.2, VAULT = 2.9              // wall vaults

function build() {
  const white = new Part(), grey = new Part(), brick = new Part(), marble = new Part(), iron = new Part(), roofp = new Part()
  const tone = [white, grey, brick]

  /** A box without a bottom. */
  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => block(p, x0, y0, x1, y1, z0, z1)

  /** A tomb: walls to the eaves, a low gabled roof; ridge along y if `alongY`. */
  function tomb(p: Part, x0: number, y0: number, x1: number, y1: number, h: number, alongY: boolean, hid0 = 0, hid1 = 0, r: Part = p) {
    const span = alongY ? x1 - x0 : y1 - y0
    const rise = Math.min(0.75, Math.max(0.4, span * 0.2))
    const e = h - rise
    const A: V3 = [x0, y0, 0], B: V3 = [x1, y0, 0], C: V3 = [x1, y1, 0], D: V3 = [x0, y1, 0]
    const up = (v: V3, z: number): V3 => [v[0], v[1], z]
    // the end faces (−y, +y) are hidden up to hid0 / hid1 where a neighbour in the row abuts
    if (hid0 < e - 0.02) quad(p, up(A, hid0), up(B, hid0), up(B, e), up(A, e), [0, -1, 0])
    if (hid1 < e - 0.02) quad(p, up(C, hid1), up(D, hid1), up(D, e), up(C, e), [0, 1, 0])
    quad(p, B, C, up(C, e), up(B, e), [1, 0, 0]); quad(p, D, A, up(A, e), up(D, e), [-1, 0, 0])
    if (alongY) {
      const xm = (x0 + x1) / 2, k = rise / ((x1 - x0) / 2)
      const r0: V3 = [xm, y0, h], r1: V3 = [xm, y1, h]
      quad(r, up(A, e), r0, r1, up(D, e), [-k, 0, 1]); quad(r, up(B, e), up(C, e), r1, r0, [k, 0, 1])
      tri(p, up(A, e), up(B, e), r0, [0, -1, 0]); tri(p, up(C, e), up(D, e), r1, [0, 1, 0])
    } else {
      const ym = (y0 + y1) / 2, k = rise / ((y1 - y0) / 2)
      const r0: V3 = [x0, ym, h], r1: V3 = [x1, ym, h]
      quad(r, up(A, e), up(B, e), r1, r0, [0, -k, 1]); quad(r, up(C, e), up(D, e), r0, r1, [0, k, 1])
      tri(p, up(D, e), up(A, e), r0, [-1, 0, 0]); tri(p, up(B, e), up(C, e), r1, [1, 0, 0])
    }
  }

  // ---- The family tombs, in rows ----
  // Neighbours in a row abut: close the small gaps and hide the shared end walls.
  const rows = new Map<string, number[][]>()
  for (const t of TOMBS) { const k = `${t[0]},${t[2]}`; if (!rows.has(k)) rows.set(k, []); rows.get(k)!.push(t.slice()) }
  const eave = (t: number[]) => { const alongY = t[3] - t[1] > 6.5, span = alongY ? t[2] - t[0] : t[3] - t[1]; return t[4] - Math.min(0.75, Math.max(0.4, span * 0.2)) }
  for (const row of rows.values()) {
    row.sort((a, b) => a[1] - b[1])
    const hid = row.map(() => [0, 0])
    for (let i = 0; i + 1 < row.length; i++) {
      const a = row[i], b = row[i + 1]
      if (b[1] - a[3] < 0.25) {
        const m = (a[3] + b[1]) / 2; a[3] = m; b[1] = m
        const z = Math.min(eave(a), eave(b)); hid[i][1] = z; hid[i + 1][0] = z
      }
    }
    row.forEach((t, i) => tomb(tone[t[5]], t[0], t[1], t[2], t[3], t[4], t[3] - t[1] > 6.5, hid[i][0], hid[i][1], t[5] === 0 ? roofp : tone[t[5]]))
  }

  // ---- The perimeter: outer wall with the vault row inside ----
  // Each side as 4 m stretches: vault blocks DEPTH deep (whitewashed fronts),
  // a thin plain wall where the lidar shows no vaults (the lawn).
  const ext = (side: string) => (side === 'N' || side === 'W' ? brick : white)
  const stretch = (side: string, a: number, b: number, h: number) => {
    const hv = h <= 0 ? 0 : h < 3.3 ? VAULT : Math.min(5.2, h + 0.3)
    const wallH = 2.6
    // [outer face, inner face] coordinates of the stretch
    if (side === 'N' || side === 'S') {
      const yo = side === 'N' ? OY1 : OY0, s = side === 'N' ? -1 : 1
      const yi = yo + s * (hv ? DEPTH : 0.45)
      const skin = hv && ext(side) !== white ? 0.12 : 0
      const [ya, yb] = s < 0 ? [yi, yo - skin] : [yo + skin, yi]
      box(hv ? white : ext(side), a, ya, b, yb, 0, hv || wallH)
      // the outer face in the street's finish, a coping on the inner edge
      if (hv && ext(side) !== white) box(ext(side), a, s < 0 ? yo - 0.12 : yo, b, s < 0 ? yo : yo + 0.12, 0, hv)
      if (hv) box(marble, a, s < 0 ? yi - 0.15 : yi - 0.2, b, s < 0 ? yi + 0.2 : yi + 0.15, hv, hv + 0.18)
    } else {
      const xo = side === 'E' ? OX : -OX, s = side === 'E' ? -1 : 1
      const xi = xo + s * (hv ? DEPTH : 0.45)
      const skin = hv && ext(side) !== white ? 0.12 : 0
      const [xa, xb] = s < 0 ? [xi, xo - skin] : [xo + skin, xi]
      box(hv ? white : ext(side), xa, a, xb, b, 0, hv || wallH)
      if (hv && ext(side) !== white) box(ext(side), s < 0 ? xo - 0.12 : xo, a, s < 0 ? xo : xo + 0.12, b, 0, hv)
      if (hv) box(marble, s < 0 ? xi - 0.15 : xi - 0.2, a, s < 0 ? xi + 0.2 : xi + 0.15, b, hv, hv + 0.18)
    }
  }
  const sides: [string, number, number][] = [['N', -OX, OX], ['S', -OX, OX], ['W', OY0 + DEPTH, OY1 - DEPTH], ['E', OY0 + DEPTH, OY1 - DEPTH]]
  for (const [side, a0, b0] of sides) {
    const hs = WALLS[side]
    // merge equal stretches
    let i = 0
    while (i < hs.length) {
      const key = (h: number) => (h <= 0 ? 0 : h < 3.3 ? VAULT : Math.round(h * 2) / 2)
      let j = i
      while (j + 1 < hs.length && key(hs[j + 1]) === key(hs[i])) j++
      const a = a0 + i * 4, b = Math.min(b0, a0 + (j + 1) * 4)
      stretch(side, a, b, hs[i] <= 0 ? 0 : key(hs[i]))
      i = j + 1
    }
  }
  // The Basin Street gate (y ≈ 1): two white pillars with caps, an iron gate and cross.
  for (const s of [-1, 1]) {
    box(white, OX - 0.9, 1 + s * 1.6 - 0.45, OX + 0.15, 1 + s * 1.6 + 0.45, 0, 3.4)
    box(marble, OX - 1.0, 1 + s * 1.6 - 0.55, OX + 0.25, 1 + s * 1.6 + 0.55, 3.4, 3.7)
  }
  box(iron, OX - 0.5, 1 - 1.15, OX - 0.4, 1 + 1.15, 0, 2.6)
  box(iron, OX - 0.5, 0.9, OX - 0.4, 1.1, 2.6, 4.6)
  box(iron, OX - 0.5, 0.45, OX - 0.4, 1.55, 3.9, 4.05)

  // ---- The Italian Mutual Benevolent Society tomb (1857) ----
  {
    const cx = 5.0, cy = -24.5, R = 3.3, N = 14
    const ring = (r: number, z: number, n = N): V3[] => circle(cx, cy, r, n, Math.PI / N).map(([x, y]) => [x, y, z] as V3)
    const drum = (p: Part, r0: number, r1: number, z0: number, z1: number, n = N, capTop = true) => {
      const a = ring(r0, z0, n), b = ring(r1, z1, n)
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const na: V3 = [(a[i][0] - cx) / r0, (a[i][1] - cy) / r0, 0], nb: V3 = [(a[j][0] - cx) / r0, (a[j][1] - cy) / r0, 0]
        p.tri(a[i], a[j], b[j], undefined, undefined, undefined, [na, nb, nb])
        p.tri(a[i], b[j], b[i], undefined, undefined, undefined, [na, nb, na])
      }
      if (capTop) p.cap(b, true)
    }
    drum(marble, R, R, 0, 4.5)
    drum(marble, R + 0.25, R + 0.25, 4.5, 5.0)        // dentil cornice
    drum(marble, R - 0.2, R - 0.2, 5.0, 5.5)          // attic band
    drum(marble, 2.1, 2.1, 5.5, 7.1)                  // upper drum
    drum(marble, 2.3, 2.3, 7.1, 7.4)                  // its cornice
    drum(marble, 1.3, 0.8, 7.4, 8.0, 12)              // stepped base of the pedestal
    drum(marble, 0.55, 0.55, 8.0, 8.4, 12)            // pedestal
    figure(marble, cx, cy, 8.4, 1.6, { raise: 0 })    // the standing figure
    block(marble, cx + 0.35, cy - 0.08, cx + 0.47, cy + 0.08, 8.4, 10.0)       // the cross she holds
    block(marble, cx + 0.12, cy - 0.08, cx + 0.72, cy + 0.08, 9.45, 9.6)
    // vault-door bands on the drum (grey), between the niches
    // two arched niches projecting on the front (−y), each with its seated group
    for (const s of [-1, 1]) {
      const nx = cx + s * 1.55, w = 2.0, top = 4.9
      const arch: [number, number][] = [[nx - w / 2, 0], [nx + w / 2, 0]]
      for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; arch.push([nx + (w / 2) * Math.cos(t), top - w / 2 + (w / 2) * Math.sin(t)]) }
      slabY(marble, arch, cy - R - 0.55, cy - R + 1.2)
      // the dark hollow of the niche and the statue group in it
      const inner: [number, number][] = [[nx - 0.6, 1.0], [nx + 0.6, 1.0]]
      for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; inner.push([nx + 0.6 * Math.cos(t), top - 0.9 + 0.6 * Math.sin(t)]) }
      slabY(grey, inner, cy - R - 0.6, cy - R - 0.5)
      block(marble, nx - 0.5, cy - R - 0.75, nx + 0.5, cy - R - 0.35, 1.0, 1.45)
      block(marble, nx - 0.35, cy - R - 0.6, nx + 0.35, cy - R - 0.35, 1.45, 2.7)
    }
    // the centre door between the niches
    block(iron, cx - 0.45, cy - R - 0.04, cx + 0.45, cy - R + 0.2, 0, 2.2)
  }

  // ---- Tomb C: a large square society tomb, its centre raised as an attic with a pediment ----
  {
    const x0 = -27.3, x1 = -21.7, y0 = -22.3, y1 = -14.7
    box(grey, x0, y0, x1, y1, 0, 4.8)
    box(marble, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, 4.8, 5.2)
    box(grey, -25.6, -21.3, -23.0, -15.7, 5.2, 7.3)
    box(marble, -25.8, -21.5, -22.8, -15.5, 7.3, 7.6)
    tomb(grey, -25.7, -21.4, -22.9, -15.6, 8.25, true)
    block(iron, -24.38, -15.6, -24.22, -15.44, 8.0, 8.8)
    block(iron, -24.65, -15.6, -23.95, -15.44, 8.4, 8.52)
  }
  // ---- Tomb A: a tall white tomb with a stepped top and a figure ----
  {
    const x0 = 2.1, x1 = 7.9, y0 = -37.2, y1 = -30.4
    box(white, x0, y0, x1, y1, 0, 5.4)
    box(marble, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, 5.4, 5.9)
    box(marble, 3.6, -35.3, 6.4, -32.3, 5.9, 6.5)
    box(marble, 4.3, -34.6, 5.7, -33.0, 6.5, 6.9)
    figure(marble, 5.0, -33.8, 6.9, 1.2, { raise: 0 })
  }
  // ---- Tomb D: a white pedimented tomb with a cross ----
  {
    const x0 = -2.4, x1 = 2.2, y0 = -20.3, y1 = -16.7
    box(white, x0, y0, x1, y1, 0, 4.6)
    box(marble, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, 4.6, 4.9)
    tomb(white, x0 + 0.05, y0 + 0.05, x1 - 0.05, y1 - 0.05, 5.65, false)
    block(iron, -0.18, -18.58, -0.02, -18.42, 5.5, 6.9)
    block(iron, -0.45, -18.58, 0.25, -18.42, 6.3, 6.42)
  }

  finishModel('St. Louis Cemetery No. 1', 'nola-st-louis-cemetery-1', [
    { part: white, material: finish('whitewash', 0xebe8e0) },
    { part: grey, material: finish('tomb-grey', 0xadaaa1) },
    { part: brick, material: finish('tomb-brick', 0xb98470) },
    { part: marble, material: finish('marble', 0xf6f5f1) },
    { part: iron, material: finish('iron', 0x4a4f57) },
    { part: roofp, material: finish('tomb-cap', 0xc9c6bd) },
  ], { bearing: 38.1, osm: 'way/27936018', height: 10.0 }, 6500)
}

if (import.meta.main) build()
