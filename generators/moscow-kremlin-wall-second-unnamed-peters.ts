/**
 * Kremlin Wall, Second Unnamed Tower to Peter's Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-second-unnamed-peters.ts
 *
 * The stretch of the Kremlin's red-brick wall on the river side between the
 * Second Unnamed Tower and the Peter's Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470036 (building=wall, fetched
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
 * own models (relation/3229567, relation/1360660).
 *
 * Heights: OSM tags the walk at 9 m (relation/2470036 and its building:parts, whose skillion parts carry the merlons from 9 to 11.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
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

const RINGS: XY[][] = [[[47.71, 1.8], [47.57, 7.17], [20.56, 5.4], [-49.12, -3.33], [-48.41, -8.58], [5.1, -1.26]]]
const TOWERS: XY[][] = [[[-57.57, -13.21], [-47.55, -11.87], [-48.76, -2.92], [-58.78, -4.26]], [[56.68, 7.83], [47.16, 7.58], [47.46, -4.15], [56.98, -3.91]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -81.0, "x0": -89.0, "step": 10.0, "z": [[1.7, 1.4, 0.9, 0.6, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [3.2, 2.7, 1.9, 1.2, 0.6, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.0, 0.1, 0.2, 0.2, 0.1, 0.0], [4.7, 4.1, 3.2, 2.2, 1.4, 0.9, 0.8, 0.8, 0.7, 0.7, 0.7, 0.3, 0.2, 0.4, 0.7, 0.7, 0.5, 0.3], [6.3, 5.6, 4.7, 3.8, 2.9, 2.4, 2.0, 1.9, 1.4, 1.3, 1.2, 0.9, 0.7, 1.0, 1.2, 1.2, 1.2, 1.2], [8.1, 7.4, 6.6, 5.7, 4.9, 4.3, 3.8, 3.3, 2.8, 2.4, 2.3, 1.9, 1.8, 2.0, 2.3, 2.3, 2.2, 2.1], [9.5, 9.0, 8.4, 7.6, 7.1, 6.2, 5.7, 4.8, 4.3, 3.8, 3.7, 3.4, 3.2, 3.5, 3.7, 3.7, 3.5, 3.2], [11.4, 10.9, 10.3, 9.5, 8.9, 8.0, 7.5, 6.6, 6.2, 5.7, 5.3, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1], [14.0, 13.1, 12.2, 11.1, 9.9, 9.4, 8.5, 8.0, 8.0, 7.6, 7.5, 7.5, 7.5, 7.5, 7.5, 7.3, 7.0, 7.0], [16.4, 15.3, 13.9, 12.5, 11.2, 10.4, 9.9, 9.4, 9.4, 9.0, 8.9, 9.2, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3], [18.3, 17.0, 15.3, 13.9, 12.2, 11.3, 10.9, 10.4, 10.4, 10.0, 10.2, 10.6, 11.0, 11.0, 10.8, 10.8, 10.9, 11.2], [19.8, 18.5, 16.8, 15.3, 13.9, 12.7, 12.2, 11.3, 10.9, 10.8, 11.2, 11.6, 11.9, 11.8, 11.8, 11.9, 12.3, 12.8], [21.2, 20.0, 18.5, 17.1, 15.7, 14.4, 13.6, 12.7, 11.8, 11.7, 11.8, 12.2, 12.4, 12.6, 12.7, 12.9, 13.4, 13.9], [22.9, 21.8, 20.4, 19.0, 17.7, 16.6, 15.3, 14.1, 13.1, 12.7, 12.7, 12.8, 12.8, 12.9, 13.2, 13.5, 14.0, 14.5], [25.1, 24.0, 22.7, 21.5, 20.1, 18.9, 17.5, 16.1, 14.9, 14.1, 13.7, 13.4, 13.3, 13.3, 13.4, 13.7, 14.2, 14.6], [27.3, 26.3, 25.0, 23.7, 22.3, 21.0, 19.6, 18.2, 16.8, 15.8, 15.0, 14.5, 14.1, 13.9, 13.8, 13.9, 14.2, 14.6], [29.2, 28.4, 27.0, 25.6, 24.2, 22.8, 21.4, 20.0, 18.6, 17.5, 16.5, 15.9, 15.4, 15.0, 14.6, 14.5, 14.6, 14.9], [30.9, 30.1, 28.9, 27.4, 25.9, 24.5, 23.1, 21.7, 20.3, 19.1, 18.1, 17.4, 16.8, 16.4, 16.0, 15.7, 15.6, 15.4], [32.1, 31.5, 30.4, 28.9, 27.3, 25.9, 24.7, 23.3, 21.9, 20.8, 19.8, 19.0, 18.4, 17.9, 17.6, 17.3, 16.8, 16.2]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 9, ground: GROUND, towers: TOWERS, inside: [-213.0, 143.5] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-second-unnamed-peters', "Kremlin Wall, Second Unnamed Tower to Peter's Tower", build(), 6500)
