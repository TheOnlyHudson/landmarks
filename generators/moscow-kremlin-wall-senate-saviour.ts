/**
 * Kremlin Wall, Senate Tower to Saviour Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-senate-saviour.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Red Square side, behind the Lenin Mausoleum and the necropolis between the
 * Senate Tower and the Saviour Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470048 (building=wall, fetched
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
 * own models (relation/1360656, relation/1359374).
 *
 * Heights: OSM tags the walk at 12 m (relation/2470048 and its building:parts, whose skillion parts carry the merlons from 12 to 14.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Kremlin wall - Red Square.jpg", Юрий Д.К., CC BY 4.0 (from Red Square)
 * - "Moscow - 2025 - Tsarskaya Tower and the Kremlin Wall.jpg", Юрий Д.К., CC BY 4.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 * - "Senatskaya Tower 2025-8.jpg", Юрий Д.К., CC BY 4.0
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[50.27, -49.2], [51.31, -50.25], [48.63, -53.15], [-51.26, 50.22], [-48.58, 53.11]]]
const TOWERS: XY[][] = [[[63.4, -62.47], [63.33, -62.55], [63.08, -62.83], [62.05, -63.93], [61.37, -64.65], [61.12, -64.93], [61.37, -65.16], [60.11, -66.52], [58.71, -65.25], [58.98, -64.95], [57.73, -63.81], [57.31, -63.42], [57.58, -63.15], [53.84, -59.73], [50.32, -56.51], [49.97, -56.9], [48.48, -55.53], [48.24, -55.79], [46.83, -54.5], [48.08, -53.15], [48.38, -53.42], [48.63, -53.15], [48.98, -52.78], [50.33, -51.32], [50.67, -50.94], [51.31, -50.25], [52.13, -49.37], [53.4, -48.0], [54.7, -46.59], [55.96, -45.23], [57.15, -43.95], [56.81, -43.65], [58.05, -42.3], [59.44, -43.59], [59.16, -43.89], [60.07, -44.73], [60.97, -43.76], [61.3, -44.07], [61.56, -43.8], [62.09, -43.23], [62.35, -42.96], [62.87, -42.38], [63.13, -42.11], [63.66, -41.54], [63.92, -41.25], [64.44, -40.69], [64.71, -40.4], [65.23, -39.84], [65.49, -39.56], [65.18, -39.29], [66.43, -37.94], [67.84, -39.22], [67.58, -39.5], [67.86, -39.75], [68.42, -40.26], [68.7, -40.51], [69.26, -41.03], [69.54, -41.29], [70.1, -41.8], [70.29, -41.97], [70.38, -42.05], [70.94, -42.56], [71.22, -42.82], [71.78, -43.33], [72.06, -43.59], [72.62, -44.1], [72.9, -44.35], [73.16, -44.07], [74.56, -45.37], [73.31, -46.72], [72.99, -46.43], [72.74, -46.7], [72.23, -47.25], [71.98, -47.52], [71.47, -48.06], [71.21, -48.34], [70.71, -48.88], [70.46, -49.16], [69.96, -49.7], [69.7, -49.98], [69.2, -50.52], [68.94, -50.8], [69.29, -51.12], [68.86, -51.58], [68.27, -52.22], [69.65, -53.49], [69.89, -53.23], [71.3, -54.52], [70.06, -55.87], [69.77, -55.61], [65.45, -60.26], [64.07, -61.73]], [[-48.58, 53.11], [-49.22, 52.41], [-49.57, 52.05], [-50.91, 50.59], [-51.26, 50.22], [-52.34, 49.05], [-53.29, 49.93], [-59.53, 55.64], [-58.83, 56.39], [-58.5, 56.75], [-57.12, 58.23], [-56.79, 58.58], [-56.12, 59.31], [-54.94, 60.59], [-53.82, 61.79], [-46.63, 55.2], [-47.73, 54.03]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -87.0, "x0": -93.0, "step": 10.0, "z": [[9.3, 10.8, 12.8, 15.4, 18.3, 21.0, 23.3, 25.0, 25.9, 25.9, 24.3, 21.6, 18.8, 16.3, 14.0, 11.8, 9.9, 8.0, 6.1], [9.4, 10.8, 12.7, 15.4, 18.5, 21.4, 24.0, 25.7, 26.6, 26.5, 24.6, 22.0, 19.2, 16.5, 14.0, 11.6, 9.5, 7.4, 5.2], [9.0, 10.3, 12.2, 14.7, 17.7, 20.8, 23.5, 25.6, 26.3, 25.9, 24.1, 21.8, 19.1, 16.7, 14.0, 11.6, 9.2, 6.9, 4.7], [8.4, 9.4, 11.2, 13.8, 16.7, 19.8, 22.5, 24.5, 24.8, 24.4, 23.0, 20.8, 18.5, 16.2, 13.5, 11.0, 8.7, 6.4, 4.1], [7.9, 8.7, 10.1, 12.4, 15.1, 17.9, 20.5, 22.1, 22.5, 22.5, 21.1, 19.8, 17.6, 15.2, 12.6, 10.1, 7.8, 5.5, 3.3], [8.1, 8.4, 9.6, 11.5, 13.6, 15.9, 18.0, 19.3, 19.7, 19.7, 18.8, 17.8, 16.1, 13.8, 11.2, 8.7, 6.4, 4.3, 2.4], [8.1, 8.4, 9.1, 10.6, 12.3, 13.8, 15.2, 16.5, 16.9, 16.9, 16.4, 15.5, 13.8, 11.9, 9.3, 6.8, 4.7, 3.1, 1.6], [8.5, 8.8, 9.3, 10.1, 11.2, 12.2, 13.1, 13.7, 14.1, 14.1, 13.6, 12.7, 11.3, 9.6, 7.3, 5.2, 3.5, 2.1, 0.9], [9.0, 9.3, 9.7, 10.2, 10.7, 11.0, 11.5, 11.6, 11.7, 11.3, 10.8, 9.9, 8.6, 7.1, 5.3, 3.6, 2.4, 1.3, 0.3], [9.7, 9.9, 10.0, 10.3, 10.5, 10.2, 10.0, 9.7, 9.7, 9.2, 8.4, 7.5, 6.4, 5.1, 3.6, 2.4, 1.4, 0.6, 0.0], [10.2, 10.4, 10.4, 10.5, 10.3, 9.5, 8.8, 8.4, 7.8, 7.3, 6.7, 5.8, 4.6, 3.5, 2.4, 1.6, 0.9, 0.4, 0.0], [10.4, 10.8, 10.9, 10.8, 10.2, 9.2, 8.1, 7.4, 6.5, 5.7, 5.3, 4.4, 3.3, 2.5, 1.7, 1.2, 0.8, 0.5, 0.4], [10.4, 10.9, 11.1, 10.9, 10.1, 8.9, 7.6, 6.4, 5.5, 4.6, 4.1, 3.4, 2.5, 2.0, 1.4, 1.1, 1.0, 0.9, 0.9], [10.4, 10.8, 10.9, 10.7, 9.8, 8.4, 6.8, 5.5, 4.6, 3.6, 3.2, 2.7, 2.2, 1.7, 1.4, 1.3, 1.4, 1.5, 1.5], [10.2, 10.4, 10.4, 10.1, 9.2, 7.6, 5.9, 4.6, 3.6, 2.9, 2.4, 2.1, 2.1, 1.9, 1.8, 1.9, 2.1, 2.4, 2.5], [9.7, 9.8, 9.7, 9.2, 8.1, 6.6, 4.9, 3.6, 2.7, 2.3, 2.0, 1.9, 1.9, 2.1, 2.2, 2.5, 2.9, 3.2, 3.4], [8.9, 8.8, 8.4, 7.7, 6.5, 5.2, 3.9, 2.7, 1.9, 1.5, 1.5, 1.6, 1.7, 2.1, 2.6, 3.1, 3.9, 4.4, 4.5], [8.1, 7.6, 6.8, 5.8, 4.7, 3.5, 2.7, 1.9, 1.5, 1.1, 1.1, 1.5, 2.0, 2.5, 3.3, 4.0, 4.8, 5.5, 6.0], [7.1, 6.3, 5.2, 4.0, 3.1, 2.3, 1.9, 1.5, 1.1, 1.1, 1.1, 1.5, 2.0, 2.9, 3.8, 4.8, 5.7, 6.5, 7.2]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 12, ground: GROUND, towers: TOWERS, inside: [-165.5, -224.0] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-senate-saviour', "Kremlin Wall, Senate Tower to Saviour Tower", build(), 6500)
