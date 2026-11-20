/**
 * Four Seasons Hotel & Tower Miami (2003, Gary Handel + Associates), 1435
 * Brickell Avenue — original procedural geometry, CC0-1.0.
 * bun generators/mia-four-seasons.ts [out.glb]
 *
 * Uses the ring kit exported from mia-panorama-tower.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 14 (the
 * Brickell street grid and the tower's long faces). Anchor = area centroid
 * of the OSM outline way/933174532, 25.7587597, -80.1915057.
 *
 * Form: a 64-storey blue-glass slab, 51 m by 35 m, standing at the north-west
 * corner of a long pale podium whose east end is rounded (the pool deck),
 * with a 62 m hotel wing against its west side. A white blade stands out of the
 * south face near its east end the full height and rises past the roof, and a
 * white crown screen crosses the roof; the slab's glass carries white
 * spandrel bands, and its west face has two recessed balcony slots in the
 * residential upper half.
 *
 * Sources:
 *  - OSM: outline way/933174532; parts way/51806483 (tower, 240 m, 64
 *    levels), way/300241285 (57 m, wikidata Q1440000), way/300241286
 * *    (podium, 21 m), way/933174533 (32 m), way/933174535 (21-28 m),
 *    way/933174534 (a 92 m² part inside the podium, from overlap.ts). The
 *    outline is used as drawn for the podium.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 1 m grid read in the turned frame. Measured: tower roof 228-232
 *    m, crown screen 236-239 m, west wing 57-62 m, south-west block 33 m,
 *    middle block 28-29 m, pool-deck podium 20-25 m with plant to 33 m. The
 *    lidar puts the tower about 15 m west of the OSM tower part, and the
 *    whole complex about 6 m west of the OSM outline; the parts are drawn
 *    where lidar puts them relative to each other, shifted 6 m east so the
 *    complex sits on the OSM outline the map hides.
 *  - Published: 240 m, 64 floors (OSM; Wikipedia: 789 ft).
 *  - Estimated from photos: white band every three floors, blade width
 *    (6.5 m) and height above the roof (to 241 m), slot positions (0.29 and
 *    0.71 of the west face, from 130 m up), podium openings.
 *
 * Photos (Wikimedia Commons, daylight):
 *  - Four_Seasons_Miami_complete_20100206.jpg, Averette, CC BY 3.0 — high,
 *    from the south-west past the HSBC building: west and south faces, the
 *    blade at the south face's east end;
 *  - Four_Seasons_Tower_Miami_south.jpg, Averette, CC BY 3.0 — looking up
 *    from Brickell Avenue (read as the west face, despite the file name):
 *    balcony slots, the wing in front, the stone entrance block;
 *  - Four_Seasons_Tower_Miami_east.jpg, Averette, CC BY 3.0 — from the
 *    east over the rounded podium garage: the east face, and the blade
 *    seen edge-on along the south face;
 *  - Four_Seasons_Hotel_Tower_Miami_roof_zoom.jpg, B137, CC BY-SA 4.0 —
 *    the white crown frame;
 *  - Four_Seasons_Hotel_in_Miami_from_Biscayne_Bay.jpg, Miami92, public
 *    domain — from the bay.
 * No commercial imagery or 3D tiles were used. No look-only sources.
 *
 * Doubts: which face the blade and the slots are on is read from the
 * photos' backgrounds (HSBC building, the rounded garage) and is not
 * certain; the OSM/lidar offset above; the crown screen's exact form (lidar
 * shows a ridge across the roof about a third of the way from its south
 * edge, the photo a white frame); the night look is unknown (no licensed
 * night photo), so nothing but the windows glows.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, bevel, walls, capRing, panels, hbands, edgeRect, ringEdges, box, build } from './mia-panorama-tower'

const glass = new Part(), white = new Part(), stone = new Part(), holes = new Part(), roof = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// OSM outline way/933174532 in the turned frame
const OUTLINE: XY[] = [[-80.3, 34.6], [-80.5, 9.2], [-78.3, -11.7], [-77.3, -37.1], [-57.6, -36.2], [-32.7, -37.2], [-1.5, -36.6], [59.0, -37.7], [66.6, -31.7], [72.1, -24.7], [76.7, -16.4], [79.7, -7.6], [80.7, 1.5], [80.0, 8.6], [77.8, 15.9], [74.6, 22.8], [70.6, 28.2], [66.2, 33.1], [59.8, 38.1], [-1.7, 36.4], [-48.1, 35.7]]
const MIDDLE = rect(-55, -1.5, -36.6, 2)        // 28-29 m block (lidar), the 933174535 part
const SW = rect(-77.6, -55, -37, -17)            // 33 m block (lidar; OSM way/933174533)
const WING = rect(-80.2, -60, -17, 34.8)         // hotel wing, 62 m (lidar)
const TOWER = rect(-60, -9, 2, 37)               // the slab (lidar)

const PODIUM = 22, MID = 29, SWH = 33, WINGH = 62, ROOF = 232, CROWN = 239, BLADE = 241

// podium: pale stone, garage bands, pool deck roof
const pod = bevel(ccw(OUTLINE), 0.6)
walls(pod, [[0, PODIUM, stone]])
capRing(roof, pod, PODIUM)
panels(holes, pod, 1, PODIUM - 1.5, { bay: 12, pier: 1.8, rowH: 6.8, spandrel: 2.6, minEdge: 5 })

for (const [r, h] of [[MIDDLE, MID], [SW, SWH]] as [XY[], number][]) {
  const b = bevel(r, 0.5)
  walls(b, [[PODIUM - 0.5, h, stone]])
  capRing(roof, b, h)
}

// hotel wing: glass with white bands, a white parapet
{
  const b = bevel(WING, 0.5)
  walls(b, [[PODIUM - 0.5, WINGH - 1.5, glass], [WINGH - 1.5, WINGH, white]])
  capRing(roof, b, WINGH)
  hbands(white, b, [32, 41, 50], 0.8)
}

// the slab
const T = bevel(TOWER, 0.6)
walls(T, [[PODIUM - 0.5, ROOF - 3, glass], [ROOF - 3, ROOF, white]])
capRing(roof, T, ROOF)
{
  const z: number[] = []
  for (let h = WINGH + 8; h < ROOF - 6; h += 10.8) z.push(h)
  hbands(white, T, [PODIUM + 9, PODIUM + 19, PODIUM + 29, 42, 52, ...z], 0.9, 0.05, 6)
}

// balcony slots in the west face's upper half
for (const e of ringEdges(T)) {
  if (e.L < 30 || e.o[0] > -0.9) continue
  for (const f of [0.29, 0.71]) edgeRect(holes, e, e.L * f - 1.4, e.L * f + 1.4, 130, ROOF - 4, 0.07)
}

// white blade wrapping the south face's east end, past the roof
{
  const b = bevel(rect(-15.5, -8.5, 0.5, 3), 0.4)
  walls(b, [[PODIUM - 0.5, BLADE, white]])
  capRing(white, b, BLADE)
}

// crown: a white screen across the roof and plant behind it
box(white, -36, 12, 46, 2.2, ROOF, CROWN)
box(roof, -40, 25, 22, 12, ROOF, ROOF + 4)

await build('Four Seasons Hotel & Tower Miami', 'mia-four-seasons', [
  { part: glass, material: windowVariant(2, 0x7a9dc2) },
  { part: white, material: PALETTE.trim },
  { part: stone, material: finish('four-seasons-stone', 0xe9dcc8) },
  { part: holes, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { bearing: 14, elevation: 0, height: BLADE, replaces: ['way/933174532', 'way/51806483', 'way/300241285', 'way/300241286', 'way/933174533', 'way/933174535', 'way/933174534'] }, process.argv[2])
