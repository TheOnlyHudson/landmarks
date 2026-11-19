/**
 * Kremlin Wall, Annunciation Tower to Taynitskaya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-annunciation-taynitskaya.ts
 *
 * The stretch of the Kremlin's red-brick wall on the river side, below the Kremlin palaces between the
 * Annunciation Tower and the Taynitskaya Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470037 (building=wall, fetched
 * 2026-11-18 with the API's map call), simplified to 0.3 m, in the frame
 * of bearing 0 about its centroid (the anchor). Built with wall() in
 * moscow-kremlin-towers-kit.ts: the outline is extruded from the map's own
 * terrain (Mapterhorn at z12, the only zoom it has for Moscow, read every
 * 10 m) up to the wall walk, set 9 m over the terrain smoothed
 * along the wall (a 48 m window, so the walk runs level-ish where the DEM
 * bumps), with swallowtail merlons along the outer face: 1.25 m wide,
 * 2.3 m high, 0.68 m thick, one every 2.0 m (published: 2-2.5 m high,
 * 0.65-0.7 m thick, about 1045 of them on 2235 m of wall; Wikipedia,
 * "Moscow Kremlin Wall"). The merlons stop at the towers, which are their
 * own models (relation/3229300, relation/3229147).
 *
 * Heights: OSM tags the walk at 9 m (relation/2470037 and its building:parts, whose skillion parts carry the merlons from 9 to 11.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Moscow - 2025 - General view of the Kremlin embankment1.jpg", Юрий Д.К., CC BY 4.0 (from the south, across the river)
 * - "Moscow Kremlin Towers of south wall.jpg", Dmitry Ivanov., CC BY-SA 4.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 * - "Moscow - 2025 - Taynitskaya Tower, Archangel Cathedral, and Ivan the Great Bell Tower.jpg", Юрий Д.К., CC BY 4.0
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[79.64, 22.43], [28.8, 16.19], [-36.01, -15.7], [-35.55, -16.33], [-74.01, -43.63], [-76.61, -39.5], [-38.57, -12.49], [30.37, 21.6], [78.2, 27.47]]]
const TOWERS: XY[][] = [[[-76.49, -39.1], [-86.04, -45.04], [-83.88, -48.48], [-80.9, -53.2], [-71.35, -47.26]], [[81.17, 14.81], [100.74, 20.29], [96.28, 36.03], [76.71, 30.57]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -111.0, "x0": -119.0, "step": 10.0, "z": [[2.6, 1.7, 1.2, 0.9, 0.5, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.3, 0.6, 0.8, 0.8, 0.9, 0.9, 1.0, 1.3, 1.5], [4.2, 3.0, 2.2, 1.4, 0.9, 0.5, 0.3, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5], [5.8, 4.6, 3.4, 2.5, 1.7, 1.2, 0.9, 0.7, 0.6, 0.5, 0.3, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1], [7.2, 6.3, 5.1, 4.2, 3.2, 2.5, 1.9, 1.6, 1.5, 1.3, 0.9, 0.6, 0.3, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [8.6, 7.9, 7.0, 6.0, 5.1, 4.2, 3.6, 3.1, 2.8, 2.4, 1.8, 1.2, 0.7, 0.6, 0.2, 0.2, 0.2, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [10.0, 9.6, 8.8, 7.9, 7.1, 6.2, 5.5, 5.0, 4.4, 3.6, 2.8, 2.1, 1.5, 1.3, 0.9, 0.7, 0.7, 0.7, 0.4, 0.4, 0.4, 0.3, 0.2, 0.1], [11.4, 11.0, 10.5, 9.8, 9.3, 8.4, 7.5, 6.8, 6.0, 5.0, 4.1, 3.3, 2.9, 2.4, 2.0, 1.7, 1.5, 1.3, 1.3, 1.3, 1.3, 1.0, 0.7, 0.4], [12.9, 12.4, 11.9, 11.5, 11.0, 10.3, 9.4, 8.4, 7.4, 6.4, 5.6, 4.9, 4.4, 4.0, 3.6, 3.5, 2.9, 2.4, 2.4, 2.3, 2.3, 2.0, 1.5, 1.0], [14.3, 13.9, 13.4, 13.0, 12.5, 12.0, 11.2, 10.0, 8.8, 7.8, 7.1, 6.7, 6.3, 6.0, 5.8, 5.4, 4.4, 4.0, 3.8, 3.4, 3.3, 3.0, 2.5, 1.7], [15.8, 15.8, 15.3, 14.8, 14.4, 13.9, 12.7, 11.6, 10.4, 9.3, 8.6, 8.3, 8.3, 8.2, 7.7, 7.2, 6.2, 5.8, 5.3, 4.8, 4.7, 4.4, 3.7, 2.8], [17.6, 17.6, 17.2, 16.7, 16.2, 15.4, 14.5, 13.2, 12.1, 11.2, 10.5, 10.1, 10.1, 10.1, 9.5, 8.6, 7.6, 7.2, 6.7, 6.2, 6.1, 5.8, 5.1, 4.4], [19.5, 19.5, 19.0, 18.6, 18.1, 17.3, 16.0, 14.9, 14.0, 13.1, 12.3, 12.0, 12.0, 11.8, 10.9, 10.0, 9.0, 8.6, 8.1, 7.6, 7.5, 7.2, 6.5, 5.8], [21.0, 21.4, 21.4, 20.9, 20.1, 19.2, 17.9, 16.8, 15.9, 15.1, 14.7, 14.2, 13.8, 13.2, 12.3, 11.4, 10.5, 10.0, 9.5, 9.4, 9.1, 8.6, 8.1, 7.7], [22.0, 22.8, 23.2, 23.2, 22.4, 21.5, 20.5, 19.3, 18.2, 17.5, 16.8, 16.1, 15.6, 15.1, 14.1, 12.8, 11.9, 11.4, 11.3, 10.9, 10.5, 10.0, 9.5, 9.1], [22.9, 23.8, 25.1, 25.5, 25.1, 24.2, 23.3, 22.3, 21.3, 20.4, 19.6, 18.7, 17.8, 17.0, 16.0, 14.6, 14.1, 13.6, 13.2, 12.8, 12.0, 11.4, 11.0, 10.5], [23.9, 25.2, 26.9, 27.8, 28.1, 27.7, 27.1, 26.3, 25.2, 24.1, 23.0, 21.8, 20.8, 19.5, 18.3, 17.2, 16.4, 15.6, 15.1, 14.6, 13.8, 13.0, 12.4, 12.1], [24.9, 26.9, 28.8, 30.4, 31.3, 31.6, 31.3, 30.7, 29.8, 28.7, 27.4, 25.9, 24.4, 22.9, 21.3, 20.0, 19.1, 18.2, 17.4, 16.6, 15.7, 14.8, 14.1, 13.9], [26.2, 28.5, 30.9, 33.1, 34.4, 35.3, 35.6, 35.3, 34.8, 33.8, 32.2, 30.5, 28.7, 27.0, 25.1, 23.5, 22.2, 21.0, 19.8, 18.8, 17.7, 16.8, 16.1, 15.8], [27.6, 30.2, 33.0, 35.6, 37.3, 38.6, 39.5, 39.8, 39.5, 38.6, 37.1, 35.5, 33.5, 31.5, 29.6, 27.4, 25.5, 23.9, 22.4, 21.2, 19.9, 19.1, 18.5, 18.2], [29.0, 31.8, 34.8, 37.6, 39.8, 41.5, 42.8, 43.7, 43.7, 43.0, 41.9, 40.4, 38.4, 36.3, 33.9, 31.4, 28.8, 26.9, 25.3, 23.9, 22.5, 21.7, 21.2, 21.0], [30.4, 33.2, 36.5, 39.3, 41.7, 43.8, 45.5, 46.7, 46.9, 46.6, 45.9, 44.7, 43.0, 40.9, 38.1, 35.1, 32.1, 29.8, 27.9, 26.4, 25.2, 24.4, 23.9, 23.9], [31.8, 34.6, 37.7, 40.4, 42.9, 45.2, 47.2, 48.5, 48.9, 48.7, 48.4, 47.7, 46.4, 44.4, 41.5, 38.3, 35.0, 32.2, 30.3, 28.8, 27.7, 26.9, 26.6, 26.8], [33.1, 35.9, 38.5, 40.9, 43.6, 46.0, 47.9, 49.0, 49.4, 49.5, 49.4, 49.0, 48.2, 46.3, 43.6, 40.3, 37.2, 34.4, 32.5, 31.0, 29.9, 29.3, 29.1, 29.2], [33.9, 36.7, 38.9, 41.2, 43.8, 46.2, 47.9, 48.6, 49.0, 49.2, 49.3, 49.1, 48.4, 47.0, 44.8, 41.6, 38.8, 36.2, 34.2, 32.7, 31.7, 31.1, 30.9, 31.2]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 9, ground: GROUND, towers: TOWERS, inside: [83.3, 206.7] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-annunciation-taynitskaya', "Kremlin Wall, Annunciation Tower to Taynitskaya Tower", build(), 6500)
