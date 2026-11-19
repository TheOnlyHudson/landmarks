/**
 * Kremlin Wall, Armoury Tower to Borovitskaya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-armoury-borovitskaya.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Alexander Garden side between the
 * Armoury Tower and the Borovitskaya Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/1360629 (building=wall, fetched
 * 2026-11-18 with the API's map call), simplified to 0.3 m, in the frame
 * of bearing 0 about its centroid (the anchor). Built with wall() in
 * moscow-kremlin-towers-kit.ts: the outline is extruded from the map's own
 * terrain (Mapterhorn at z12, the only zoom it has for Moscow, read every
 * 10 m) up to the wall walk, set 14 m over the terrain smoothed
 * along the wall (a 48 m window, so the walk runs level-ish where the DEM
 * bumps), with swallowtail merlons along the outer face: 1.25 m wide,
 * 2.3 m high, 0.68 m thick, one every 2.0 m (published: 2-2.5 m high,
 * 0.65-0.7 m thick, about 1045 of them on 2235 m of wall; Wikipedia,
 * "Moscow Kremlin Wall"). The merlons stop at the towers, which are their
 * own models (relation/1360631, relation/1360630).
 *
 * Heights: OSM maps this short run in parts at 12.5 m and 15.5 m
 * (relation/3346443, 3346440) with merlon parts to 17.5 m; drawn at 14 m.
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Moscow Kremlin - Borovitskaya Tower, Armoury building.jpg", Sergey Norin, CC BY 2.0
 * - "Oruzheynaya and Borovitskaya Towers, Kremlin, Moscow.jpg", Ivnas2011, CC BY-SA 3.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[-11.52, -24.45], [-16.09, -27.27], [-16.78, -26.99], [-15.14, -22.18], [-8.55, -17.85], [-3.23, 14.0], [4.3, 11.95], [4.62, 13.12], [10.2, 19.13], [11.61, 17.42], [10.94, 11.06], [13.86, 7.83], [1.8, -3.95], [-2.44, -7.39], [-3.2, -11.86], [-4.17, -11.71], [-5.64, -20.71]]]
const TOWERS: XY[][] = [[[-3.23, 14.0], [-2.37, 13.77], [-1.85, 13.63], [-1.4, 13.51], [-0.97, 13.38], [4.3, 11.95], [4.62, 13.12], [7.03, 21.82], [6.04, 22.1], [5.56, 22.23], [3.13, 22.89], [2.64, 23.03], [1.68, 23.29], [-2.67, 24.47], [-3.6, 21.14], [-5.41, 14.6]], [[-10.53, -25.14], [-9.33, -27.19], [-8.12, -29.25], [-3.5, -36.98], [-1.54, -40.26], [-1.97, -40.51], [-2.47, -40.8], [-2.96, -41.08], [-3.5, -41.41], [-3.77, -41.56], [-4.26, -41.85], [-5.07, -42.32], [-11.88, -46.27], [-11.73, -46.54], [-12.92, -47.22], [-13.66, -45.95], [-13.37, -45.78], [-18.59, -37.2], [-18.86, -37.35], [-20.17, -35.15], [-19.38, -32.99], [-19.08, -33.1], [-18.19, -30.74], [-17.31, -28.41], [-16.78, -26.99], [-16.09, -27.27], [-14.27, -26.15], [-11.52, -24.45], [-10.91, -24.07], [-10.6, -24.63], [-10.77, -24.72]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -63.0, "x0": -67.0, "step": 10.0, "z": [[1.6, 2.5, 3.2, 3.9, 4.8, 5.7, 6.3, 6.4, 6.8, 7.6, 8.4, 8.5, 7.9, 6.9], [1.4, 2.3, 2.8, 3.5, 4.4, 5.4, 6.1, 6.3, 6.8, 7.8, 8.5, 8.6, 8.2, 7.4], [0.9, 1.7, 2.3, 2.8, 3.6, 4.6, 5.4, 5.7, 6.3, 7.2, 7.9, 8.3, 8.3, 7.9], [0.5, 1.0, 1.8, 2.3, 3.2, 4.1, 4.7, 5.1, 5.6, 6.3, 7.3, 8.0, 8.4, 8.3], [0.4, 0.9, 1.4, 1.8, 2.7, 3.6, 4.2, 4.7, 5.2, 5.9, 6.8, 7.6, 8.1, 8.5], [0.0, 0.5, 0.9, 1.4, 2.2, 2.8, 3.6, 4.2, 5.0, 5.7, 6.4, 7.3, 8.1, 8.5], [0.0, 0.4, 0.4, 0.9, 1.8, 2.3, 3.1, 3.7, 4.5, 5.4, 6.4, 7.3, 8.1, 8.5], [0.0, 0.4, 0.4, 0.9, 1.4, 1.8, 2.7, 3.6, 4.5, 5.4, 6.4, 7.3, 8.1, 8.6], [0.4, 0.4, 0.4, 0.5, 0.9, 1.4, 2.2, 3.4, 4.5, 5.4, 6.4, 7.3, 8.2, 9.0], [0.8, 0.4, 0.4, 0.4, 0.5, 0.9, 1.7, 3.0, 4.3, 5.4, 6.5, 7.7, 8.5, 9.1], [1.3, 0.8, 0.8, 0.5, 0.4, 0.8, 1.6, 2.6, 3.9, 5.2, 6.6, 7.8, 8.7, 9.5], [1.8, 1.6, 1.3, 0.8, 0.8, 1.2, 1.7, 2.6, 3.8, 5.2, 6.6, 7.9, 9.1, 10.0], [2.3, 2.2, 2.1, 1.6, 1.6, 1.7, 2.1, 2.7, 3.8, 5.2, 6.7, 8.3, 9.5, 10.5], [2.5, 2.7, 2.7, 2.5, 2.5, 2.5, 2.7, 3.0, 4.1, 5.5, 7.1, 8.8, 10.1, 11.2]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 14, ground: GROUND, towers: TOWERS, inside: [317.7, 193.9] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-armoury-borovitskaya', "Kremlin Wall, Armoury Tower to Borovitskaya Tower", build(), 6500)
