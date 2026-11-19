/**
 * Kremlin Wall, Saviour Tower to Tsar's Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-saviour-tsars.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Red Square side between the
 * Saviour Tower and the Tsar's Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470039 (building=wall, fetched
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
 * own models (relation/1360656, relation/1360663).
 *
 * Heights: OSM tags the walk at 12 m (relation/2470039 and its building:parts, whose skillion parts carry the merlons from 12 to 14.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
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

const RINGS: XY[][] = [[[5.63, -8.53], [-2.59, 10.98], [-5.29, 8.06], [1.87, -9.92]]]
const TOWERS: XY[][] = [[[-3.26, 10.24], [-3.33, 10.16], [-3.58, 9.88], [-4.61, 8.78], [-5.29, 8.06], [-5.54, 7.78], [-5.29, 7.55], [-6.55, 6.19], [-7.95, 7.46], [-7.68, 7.76], [-8.93, 8.9], [-9.35, 9.29], [-9.08, 9.56], [-12.82, 12.98], [-16.34, 16.2], [-16.69, 15.81], [-18.18, 17.18], [-18.42, 16.92], [-19.83, 18.21], [-18.58, 19.56], [-18.28, 19.29], [-18.03, 19.56], [-17.68, 19.93], [-16.33, 21.39], [-15.99, 21.77], [-15.35, 22.46], [-14.53, 23.34], [-13.26, 24.71], [-11.96, 26.12], [-10.7, 27.48], [-9.51, 28.76], [-9.85, 29.06], [-8.61, 30.41], [-7.22, 29.12], [-7.5, 28.82], [-6.59, 27.98], [-5.69, 28.95], [-5.36, 28.64], [-5.1, 28.91], [-4.57, 29.48], [-4.31, 29.75], [-3.79, 30.33], [-3.53, 30.6], [-3.0, 31.17], [-2.74, 31.46], [-2.22, 32.02], [-1.95, 32.31], [-1.43, 32.87], [-1.17, 33.15], [-1.48, 33.42], [-0.23, 34.77], [1.18, 33.49], [0.92, 33.21], [1.2, 32.96], [1.76, 32.45], [2.04, 32.2], [2.6, 31.68], [2.88, 31.42], [3.44, 30.91], [3.63, 30.74], [3.72, 30.66], [4.28, 30.15], [4.56, 29.89], [5.12, 29.38], [5.4, 29.12], [5.96, 28.61], [6.24, 28.36], [6.5, 28.64], [7.9, 27.34], [6.65, 25.99], [6.33, 26.28], [6.08, 26.01], [5.57, 25.46], [5.32, 25.19], [4.81, 24.65], [4.55, 24.37], [4.05, 23.83], [3.8, 23.55], [3.3, 23.01], [3.04, 22.73], [2.54, 22.19], [2.28, 21.91], [2.63, 21.59], [2.2, 21.13], [1.61, 20.49], [2.99, 19.22], [3.23, 19.48], [4.64, 18.19], [3.4, 16.84], [3.11, 17.1], [-1.21, 12.45], [-2.59, 10.98]], [[7.31, -12.99], [6.37, -13.34], [5.89, -13.51], [4.49, -14.03], [3.54, -14.39], [1.87, -9.92], [2.81, -9.58], [4.22, -9.06], [4.69, -8.88], [5.63, -8.53]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -50.0, "x0": -50.0, "step": 10.0, "z": [[17.6, 15.9, 14.8, 13.9, 13.0, 11.8, 10.4, 8.8, 6.8, 4.4, 1.6], [19.2, 16.9, 15.4, 14.0, 12.7, 11.3, 9.9, 8.4, 6.4, 4.0, 1.7], [20.7, 18.0, 16.0, 14.2, 12.7, 11.1, 9.5, 7.8, 5.6, 3.7, 1.7], [21.7, 18.9, 16.6, 14.4, 12.5, 10.7, 8.9, 7.0, 5.0, 2.9, 1.4], [22.3, 19.5, 16.9, 14.4, 12.2, 10.2, 8.2, 6.1, 4.2, 2.4, 1.0], [22.4, 19.7, 17.1, 14.6, 12.1, 9.9, 7.7, 5.5, 3.6, 1.9, 0.9], [21.9, 19.4, 17.0, 14.3, 11.8, 9.5, 7.2, 4.9, 3.0, 1.5, 0.7], [20.8, 18.6, 16.3, 13.6, 11.1, 8.8, 6.5, 4.2, 2.3, 1.1, 0.5], [19.4, 17.4, 15.1, 12.5, 10.0, 7.7, 5.4, 3.4, 1.7, 0.7, 0.6], [17.3, 15.6, 13.5, 10.9, 8.4, 6.2, 4.2, 2.5, 1.0, 0.3, 0.4], [14.8, 13.2, 11.4, 9.0, 6.6, 4.7, 3.1, 1.7, 0.6, 0.0, 0.1]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 12, ground: GROUND, towers: TOWERS, inside: [-232.1, -151.3] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-saviour-tsars', "Kremlin Wall, Saviour Tower to Tsar's Tower", build(), 6500)
