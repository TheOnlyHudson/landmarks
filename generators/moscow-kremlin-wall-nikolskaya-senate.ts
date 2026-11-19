/**
 * Kremlin Wall, Nikolskaya Tower to Senate Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-nikolskaya-senate.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Red Square side between the
 * Nikolskaya Tower and the Senate Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470050 (building=wall, fetched
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
 * own models (relation/1359374, relation/1359372).
 *
 * Heights: OSM tags the walk at 12 m (relation/2470050 and its building:parts, whose skillion parts carry the merlons from 12 to 14.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Kremlin wall - Red Square.jpg", Юрий Д.К., CC BY 4.0 (from Red Square)
 * - "Moscow - 2025 - Tsarskaya Tower and the Kremlin Wall.jpg", Юрий Д.К., CC BY 4.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[38.47, -31.93], [54.62, -46.91], [51.91, -49.83], [-55.56, 47.59], [-52.75, 50.41]]]
const TOWERS: XY[][] = [[[62.16, -53.11], [61.52, -53.81], [61.17, -54.17], [59.83, -55.63], [59.48, -56.0], [58.4, -57.17], [57.45, -56.29], [51.21, -50.58], [51.91, -49.83], [52.24, -49.47], [53.62, -47.99], [53.95, -47.64], [54.62, -46.91], [55.8, -45.63], [56.92, -44.43], [64.11, -51.02], [63.01, -52.19]], [[-41.95, 62.62], [-39.36, 65.22], [-39.15, 65.02], [-37.71, 66.46], [-38.51, 67.26], [-39.48, 68.21], [-40.05, 68.78], [-40.26, 68.57], [-42.6, 70.89], [-44.95, 73.19], [-44.74, 73.4], [-44.87, 73.52], [-47.15, 75.76], [-48.61, 74.3], [-48.34, 74.06], [-54.68, 67.7], [-55.54, 68.54], [-56.81, 67.28], [-56.59, 67.06], [-63.35, 60.29], [-64.05, 59.59], [-64.41, 59.22], [-65.82, 57.81], [-66.17, 57.45], [-66.75, 56.88], [-62.47, 52.67], [-61.59, 51.8], [-56.43, 46.72], [-55.56, 47.59], [-55.22, 47.93], [-53.79, 49.36], [-53.44, 49.71], [-52.75, 50.41], [-46.26, 56.9], [-46.03, 56.68], [-44.77, 57.94], [-45.7, 58.87]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -95.0, "x0": -95.0, "step": 10.0, "z": [[8.0, 8.0, 8.5, 9.0, 9.7, 10.0, 9.8, 9.4, 9.1, 8.9, 8.7, 8.9, 9.2, 9.2, 9.3, 9.4, 8.7, 8.1, 7.6, 7.1], [8.9, 8.7, 8.7, 9.0, 9.3, 9.5, 9.4, 9.0, 8.8, 8.9, 9.0, 9.2, 9.6, 9.7, 9.7, 9.4, 8.5, 7.3, 6.7, 5.8], [9.8, 9.3, 9.2, 9.0, 9.0, 8.9, 8.8, 8.5, 8.4, 8.7, 8.9, 9.2, 9.7, 10.0, 9.9, 9.4, 8.3, 6.9, 5.8, 4.8], [10.6, 10.1, 9.5, 9.0, 8.9, 8.5, 8.4, 8.1, 8.2, 8.4, 8.7, 9.2, 9.6, 9.9, 9.8, 9.2, 7.8, 6.3, 4.9, 3.9], [10.9, 10.4, 9.5, 8.9, 8.5, 8.0, 7.8, 7.8, 7.8, 8.2, 8.6, 9.1, 9.4, 9.4, 9.3, 8.6, 7.2, 5.4, 3.9, 3.0], [10.8, 10.3, 9.4, 8.6, 8.0, 7.5, 7.1, 6.9, 7.2, 7.7, 8.2, 8.6, 8.8, 8.8, 8.6, 7.6, 6.2, 4.4, 3.0, 2.0], [10.3, 9.9, 8.9, 8.5, 7.6, 7.1, 6.6, 6.5, 6.8, 7.2, 7.7, 7.9, 7.9, 7.7, 7.1, 6.2, 4.8, 3.4, 2.1, 1.1], [9.5, 9.4, 8.5, 8.0, 7.1, 6.6, 6.1, 6.0, 6.3, 6.7, 7.2, 7.3, 6.8, 6.2, 5.3, 4.3, 2.9, 2.0, 1.1, 0.6], [8.9, 8.5, 8.0, 7.1, 6.6, 5.7, 5.2, 5.0, 5.3, 6.1, 6.5, 6.3, 5.7, 4.7, 3.4, 2.5, 1.5, 1.1, 0.6, 0.1], [8.0, 7.6, 7.5, 6.6, 6.1, 5.2, 4.7, 4.6, 4.8, 5.3, 5.6, 5.2, 4.3, 3.3, 2.0, 1.1, 0.6, 0.1, 0.1, 0.0], [7.2, 7.0, 6.7, 6.1, 5.6, 4.8, 4.2, 3.8, 3.7, 4.2, 4.5, 4.0, 3.2, 2.0, 1.0, 0.2, 0.1, 0.0, 0.0, 0.0], [6.2, 6.2, 6.1, 5.6, 5.2, 4.3, 3.5, 2.9, 2.7, 3.1, 3.3, 2.9, 2.0, 1.1, 0.5, 0.0, 0.0, 0.0, 0.0, 0.3], [5.6, 5.6, 5.6, 5.2, 4.7, 3.8, 2.7, 2.0, 1.8, 2.1, 2.3, 2.0, 1.3, 0.5, 0.1, 0.0, 0.0, 0.3, 0.7, 1.1], [5.2, 5.2, 5.2, 4.7, 4.0, 3.1, 2.0, 1.1, 0.9, 1.1, 1.4, 1.3, 1.0, 0.4, 0.0, 0.0, 0.3, 0.8, 1.3, 2.0], [5.0, 5.0, 5.0, 4.3, 3.6, 2.5, 1.5, 0.5, 0.2, 0.5, 0.8, 1.0, 0.8, 0.4, 0.3, 0.3, 0.8, 1.5, 2.3, 3.2], [5.0, 5.0, 5.0, 4.3, 3.6, 2.3, 1.3, 0.5, 0.3, 0.5, 1.0, 1.3, 1.1, 0.8, 0.8, 0.8, 1.5, 2.5, 3.4, 4.5], [5.2, 5.2, 5.2, 4.8, 3.8, 2.7, 1.7, 1.1, 0.9, 1.2, 1.7, 1.9, 1.6, 1.2, 1.3, 1.6, 2.5, 3.6, 4.8, 6.0], [5.7, 5.7, 5.7, 5.2, 4.5, 3.6, 2.7, 2.1, 2.0, 2.3, 2.7, 2.7, 2.2, 1.7, 2.0, 2.5, 3.4, 5.0, 6.4, 7.6], [6.2, 6.3, 6.3, 6.0, 5.4, 4.6, 3.7, 3.2, 3.2, 3.6, 3.7, 3.5, 2.9, 2.4, 2.8, 3.4, 4.5, 6.3, 7.8, 9.2], [6.7, 7.3, 7.4, 7.3, 6.5, 5.9, 5.1, 4.5, 4.3, 4.5, 4.4, 3.9, 3.5, 3.3, 3.4, 4.4, 5.8, 7.3, 9.2, 10.6]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 12, ground: GROUND, towers: TOWERS, inside: [-54.7, -330.2] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-nikolskaya-senate', "Kremlin Wall, Nikolskaya Tower to Senate Tower", build(), 6500)
