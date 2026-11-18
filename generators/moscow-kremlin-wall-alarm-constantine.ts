/**
 * Kremlin Wall, Alarm Tower to Constantine and Helen Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-alarm-constantine.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Red Square side, above Vasilyevsky Spusk between the
 * Alarm Tower and the Constantine and Helen Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470042 (building=wall, fetched
 * 2026-11-18 with the API's map call), simplified to 0.3 m, in the frame
 * of bearing 0 about its centroid (the anchor). Built with wall() in
 * moscow-kremlin-towers-kit.ts: the outline is extruded from the map's own
 * terrain (Mapterhorn at z12, the only zoom it has for Moscow, read every
 * 10 m) up to the wall walk, set 12 m over the terrain smoothed
 * along the wall (a 48 m window, so the walk runs level-ish where the DEM
 * bumps), with swallowtail merlons along the outer face: 1.25 m wide,
 * 2.3 m high, 0.68 m thick, one every 2.0 m (published: 2-2.5 m high,
 * 0.65-0.7 m thick, about 1045 of them on 2235 m of wall; Wikipedia,
 * "Moscow Kremlin Wall"). The merlons stop at the towers, which are their
 * own models (relation/1360645, relation/1360661).
 *
 * Heights: OSM tags the walk at 12 m (relation/2470042 and its building:parts, whose skillion parts carry the merlons from 12 to 14.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Kremlin wall - Red Square.jpg", Юрий Д.К., CC BY 4.0 (from Red Square)
 * - "Moscow - 2025 - Tsarskaya Tower and the Kremlin Wall.jpg", Юрий Д.К., CC BY 4.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 * - "Konstantino-Eleninskaya Tower - view from Vasilyevsky descent - Moscow" (2025), Юрий Д.К., CC BY 4.0
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[13.9, -31.41], [0.11, 5.35], [-7.54, 30.6], [-13.21, 28.81], [9.78, -33.19]]]
const TOWERS: XY[][] = [[[15.87, -47.55], [9.41, -33.04], [23.6, -26.88], [30.07, -41.39]], [[-13.91, 38.38], [-16.55, 37.53], [-13.57, 28.24], [-13.08, 28.41], [-4.2, 31.19], [-7.19, 40.48]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -67.0, "x0": -73.0, "step": 10.0, "z": [[18.2, 17.2, 16.1, 14.9, 13.9, 13.2, 12.6, 11.8, 10.5, 8.9, 6.8, 4.7, 3.0, 1.4, 0.0], [19.5, 18.6, 17.6, 16.4, 15.3, 14.6, 14.1, 13.4, 12.0, 10.0, 7.7, 5.4, 3.6, 1.9, 0.5], [20.9, 20.0, 19.0, 18.0, 16.8, 15.9, 15.3, 14.6, 13.4, 11.2, 8.6, 6.1, 4.0, 2.3, 0.9], [22.2, 21.5, 20.7, 19.6, 18.3, 17.2, 16.3, 15.5, 14.1, 12.1, 9.3, 6.5, 4.2, 2.6, 1.4], [23.3, 23.1, 22.3, 21.1, 19.6, 18.3, 17.2, 16.1, 14.6, 12.3, 9.6, 6.8, 4.5, 2.8, 1.8], [24.2, 24.3, 23.7, 22.5, 20.7, 19.1, 17.8, 16.5, 14.8, 12.3, 9.6, 6.8, 4.5, 3.1, 2.1], [24.9, 25.1, 24.8, 23.7, 21.8, 19.9, 18.5, 16.9, 14.9, 12.3, 9.4, 6.7, 4.5, 3.1, 2.2], [25.0, 25.4, 25.5, 24.3, 22.4, 20.6, 18.9, 17.3, 15.1, 12.2, 9.1, 6.3, 4.5, 3.2, 2.5], [25.4, 25.8, 25.6, 24.6, 22.9, 21.1, 19.4, 17.6, 15.2, 12.3, 9.1, 6.4, 4.5, 3.5, 2.7], [25.5, 25.8, 25.6, 24.8, 23.3, 21.5, 19.7, 17.8, 15.6, 12.8, 9.6, 6.9, 5.0, 3.6, 3.1], [26.1, 26.0, 25.6, 24.8, 23.3, 21.7, 20.1, 18.1, 15.6, 12.8, 10.1, 7.3, 5.5, 4.5, 3.6], [27.2, 26.2, 25.3, 24.4, 23.1, 21.7, 20.1, 18.1, 15.6, 12.8, 10.2, 8.3, 6.4, 5.5, 4.5], [28.2, 26.7, 25.4, 24.1, 22.7, 21.3, 19.7, 17.7, 15.3, 12.9, 10.6, 8.8, 7.3, 6.4, 5.9], [29.2, 27.3, 25.5, 24.0, 22.4, 20.8, 19.1, 16.9, 15.0, 13.0, 11.2, 9.7, 8.7, 7.8, 7.3], [30.2, 27.9, 25.7, 23.8, 22.0, 20.2, 18.3, 16.3, 14.3, 12.8, 11.4, 10.7, 10.1, 9.5, 9.3]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 12, ground: GROUND, towers: TOWERS, inside: [-265.9, -58.3] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-alarm-constantine', "Kremlin Wall, Alarm Tower to Constantine and Helen Tower", build(), 6500)
