/**
 * Kremlin Wall, Taynitskaya Tower to First Unnamed Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-taynitskaya-first-unnamed.ts
 *
 * The stretch of the Kremlin's red-brick wall on the river side between the
 * Taynitskaya Tower and the First Unnamed Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470038 (building=wall, fetched
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
 * own models (relation/3229147, relation/1360642).
 *
 * Heights: OSM tags the walk at 9 m (relation/2470038 and its building:parts, whose skillion parts carry the merlons from 9 to 11.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Moscow - 2025 - General view of the Kremlin embankment1.jpg", Юрий Д.К., CC BY 4.0 (from the south, across the river)
 * - "Moscow Kremlin Towers of south wall.jpg", Dmitry Ivanov., CC BY-SA 4.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[26.83, 4.4], [25.8, 8.25], [-27.6, -3.11], [-26.16, -8.22], [27.22, 2.91]]]
const TOWERS: XY[][] = [[[-43.29, -20.1], [-23.72, -14.62], [-28.18, 1.12], [-47.75, -4.34]], [[27.65, 0.67], [38.71, 3.56], [35.57, 15.41], [24.51, 12.52]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -63.0, "x0": -67.0, "step": 10.0, "z": [[3.6, 3.3, 3.0, 2.8, 2.3, 1.6, 0.7, 0.2, 0.2, 0.2, 0.0, 0.0, 0.0, 0.0], [5.1, 4.7, 4.4, 4.2, 3.7, 2.8, 2.0, 1.6, 1.4, 1.4, 1.0, 0.9, 0.9, 1.0], [6.5, 6.1, 5.8, 5.6, 5.1, 4.2, 3.8, 3.5, 3.0, 3.0, 2.6, 2.5, 2.5, 2.6], [7.9, 7.5, 7.3, 7.0, 6.5, 5.8, 5.3, 5.3, 4.9, 4.8, 4.4, 4.2, 4.3, 4.3], [9.4, 9.2, 8.9, 8.4, 8.0, 7.5, 7.1, 7.1, 6.7, 6.7, 6.2, 5.8, 6.0, 6.1], [11.1, 10.9, 10.4, 9.8, 9.4, 8.9, 8.5, 8.6, 8.6, 8.5, 7.8, 7.5, 7.5, 7.5], [13.2, 12.7, 12.1, 11.3, 10.8, 10.3, 10.0, 10.4, 10.4, 10.0, 9.6, 9.1, 9.0, 9.0], [15.1, 14.6, 14.0, 13.0, 12.2, 11.8, 11.8, 11.8, 12.3, 12.3, 11.9, 11.5, 11.3, 11.3], [17.7, 16.7, 15.8, 14.9, 14.1, 13.7, 13.7, 13.7, 14.2, 14.2, 14.2, 13.8, 13.7, 13.7], [20.2, 19.1, 18.0, 16.9, 16.3, 15.6, 15.6, 16.0, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5], [23.0, 21.7, 20.3, 19.2, 18.7, 18.3, 18.3, 18.4, 18.8, 19.2, 18.9, 18.8, 18.8, 18.6], [26.0, 24.4, 23.0, 21.9, 21.5, 21.1, 21.1, 21.5, 21.6, 21.7, 21.3, 20.9, 20.6, 20.4], [28.5, 26.9, 25.6, 24.6, 24.0, 23.9, 24.2, 24.4, 24.4, 24.1, 23.6, 22.9, 22.3, 22.0], [30.9, 29.2, 28.0, 27.2, 26.7, 26.7, 26.9, 27.2, 27.2, 26.5, 25.7, 24.8, 24.2, 23.8]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 9, ground: GROUND, towers: TOWERS, inside: [-41.2, 171.8] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-taynitskaya-first-unnamed', "Kremlin Wall, Taynitskaya Tower to First Unnamed Tower", build(), 6500)
