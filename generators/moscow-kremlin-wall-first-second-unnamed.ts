/**
 * Kremlin Wall, First Unnamed Tower to Second Unnamed Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-first-second-unnamed.ts
 *
 * The stretch of the Kremlin's red-brick wall on the river side between the
 * First Unnamed Tower and the Second Unnamed Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470041 (building=wall, fetched
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
 * own models (relation/1360642, relation/3229567).
 *
 * Heights: OSM tags the walk at 9 m (relation/2470041 and its building:parts, whose skillion parts carry the merlons from 9 to 11.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
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

const RINGS: XY[][] = [[[38.63, 3.8], [8.49, -2.47], [-5.43, -4.69], [-38.21, -6.48], [-39.64, -1.08], [-6.0, 0.79], [7.68, 2.95], [37.87, 9.4]]]
const TOWERS: XY[][] = [[[-48.09, -12.99], [-37.03, -10.1], [-40.17, 1.75], [-51.23, -1.14]], [[38.55, 1.4], [48.57, 2.74], [47.36, 11.69], [37.34, 10.35]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -71.0, "x0": -79.0, "step": 10.0, "z": [[1.8, 1.5, 1.5, 1.4, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.6, 0.5, 0.2, 0.0, 0.0, 0.0], [3.7, 3.2, 2.9, 2.8, 2.4, 2.4, 2.4, 2.8, 2.5, 2.4, 1.7, 1.1, 0.7, 0.2, 0.0, 0.0], [5.3, 5.1, 4.8, 4.6, 4.3, 4.3, 4.3, 4.3, 4.3, 3.9, 3.1, 2.2, 1.3, 0.7, 0.4, 0.4], [7.1, 6.9, 6.6, 6.5, 6.1, 5.7, 6.1, 6.1, 5.8, 5.3, 4.5, 3.6, 2.6, 2.0, 1.5, 1.3], [8.6, 8.6, 8.5, 8.3, 7.6, 7.5, 7.6, 7.6, 7.5, 7.1, 6.3, 5.3, 4.4, 3.7, 3.3, 2.9], [10.2, 10.4, 10.3, 9.9, 9.3, 9.0, 9.0, 9.0, 9.0, 8.6, 8.0, 7.2, 6.5, 5.8, 5.1, 4.6], [11.8, 12.0, 12.2, 11.9, 11.5, 11.1, 11.1, 11.1, 10.8, 10.3, 9.9, 9.1, 8.4, 7.7, 7.0, 6.4], [13.6, 13.8, 14.1, 14.1, 13.8, 13.4, 13.4, 13.4, 13.2, 12.6, 11.8, 11.0, 10.0, 9.2, 8.5, 7.8], [15.6, 15.9, 16.2, 16.2, 16.2, 16.0, 16.0, 16.0, 15.8, 14.9, 13.8, 12.7, 11.4, 10.4, 9.7, 9.1], [17.9, 18.2, 18.6, 18.7, 18.6, 18.6, 18.6, 18.4, 17.9, 17.1, 15.6, 14.2, 12.6, 11.4, 10.7, 10.2], [20.7, 20.9, 21.2, 21.3, 20.9, 20.7, 20.5, 20.2, 19.6, 18.8, 17.1, 15.6, 14.0, 12.6, 11.8, 11.3], [23.7, 23.9, 23.9, 23.6, 23.2, 22.6, 22.1, 22.0, 21.1, 20.2, 18.6, 17.1, 15.7, 14.3, 13.3, 12.6], [26.6, 26.7, 26.5, 26.0, 25.3, 24.4, 24.0, 23.5, 22.6, 21.7, 20.4, 19.0, 17.6, 16.3, 15.1, 14.1], [29.1, 29.4, 29.1, 28.2, 27.3, 26.4, 25.8, 25.4, 24.6, 23.6, 22.3, 21.0, 19.6, 18.5, 17.3, 15.9], [31.4, 31.5, 31.1, 30.4, 29.5, 28.6, 27.7, 27.3, 26.8, 26.0, 24.7, 23.6, 22.3, 20.9, 19.6, 18.2], [33.0, 33.0, 32.7, 31.8, 30.9, 30.0, 29.6, 29.6, 28.7, 28.2, 27.0, 25.6, 24.2, 22.8, 21.4, 20.0]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 9, ground: GROUND, towers: TOWERS, inside: [-116.9, 158.1] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-first-second-unnamed', "Kremlin Wall, First Unnamed Tower to Second Unnamed Tower", build(), 6500)
