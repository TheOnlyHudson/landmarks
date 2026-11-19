/**
 * Kremlin Wall, Commandant's Tower to Armoury Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-commandants-armoury.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Alexander Garden side between the
 * Commandant's Tower and the Armoury Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470043 (building=wall, fetched
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
 * own models (relation/1360655, relation/1360631).
 *
 * Heights: OSM tags the walk at 14 m (relation/2470043 and its building:parts, whose skillion parts carry the merlons from 14 to 16.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Moscow. Commandant's Tower.jpg", Юрий Д.К., CC BY 4.0
 * - "Kremlin Oruzheynaya Tower.jpg", Stan Shebs, CC BY-SA 3.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[-7.68, -26.64], [-22.7, -63.66], [-28.05, -62.19], [22.83, 64.08], [27.95, 62.02]]]
const TOWERS: XY[][] = [[[25.28, 73.93], [23.46, 74.65], [19.68, 65.34], [21.49, 64.61], [22.83, 64.08], [23.32, 63.88], [23.77, 63.7], [24.22, 63.51], [26.55, 62.58], [27.01, 62.4], [27.95, 62.02], [28.12, 62.44], [31.52, 70.91], [31.7, 71.35], [30.95, 71.65], [30.02, 72.02], [28.16, 72.76], [27.69, 72.94], [27.1, 73.19], [26.77, 73.32]], [[-32.96, -71.48], [-32.1, -71.71], [-31.58, -71.85], [-31.13, -71.97], [-30.7, -72.1], [-25.43, -73.53], [-25.11, -72.36], [-22.7, -63.66], [-23.69, -63.38], [-24.17, -63.25], [-26.6, -62.59], [-27.09, -62.45], [-28.05, -62.19], [-32.4, -61.01], [-33.33, -64.34], [-35.14, -70.88]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -96.0, "x0": -104.0, "step": 10.0, "z": [[0.0, 0.5, 0.9, 1.2, 1.8, 2.7, 3.1, 4.1, 4.6, 5.4, 6.1, 7.0, 7.9, 8.5, 9.0, 9.3, 9.5, 9.8, 10.3, 10.8, 10.9], [0.0, 0.5, 0.8, 0.9, 1.4, 2.2, 2.7, 3.6, 4.2, 5.1, 6.0, 7.0, 7.9, 8.5, 9.1, 9.6, 10.1, 10.8, 11.5, 12.1, 12.7], [0.1, 0.5, 0.8, 0.9, 1.3, 1.7, 2.2, 3.1, 4.2, 5.1, 6.0, 7.0, 7.9, 8.6, 9.3, 10.0, 10.7, 11.4, 12.1, 13.1, 14.0], [0.6, 0.8, 0.8, 0.8, 0.8, 1.3, 1.7, 2.7, 4.0, 5.1, 6.0, 7.0, 8.0, 8.8, 9.5, 10.2, 11.0, 11.6, 12.7, 14.0, 15.0], [1.0, 1.1, 0.8, 0.8, 0.8, 0.8, 1.3, 2.2, 3.6, 5.0, 6.0, 7.3, 8.4, 9.1, 9.8, 10.5, 11.1, 12.2, 13.6, 15.0, 16.5], [1.5, 1.6, 1.3, 1.2, 0.8, 0.8, 1.3, 2.2, 3.2, 4.5, 5.9, 7.3, 8.4, 9.3, 10.2, 11.0, 11.6, 12.7, 14.2, 16.1, 18.4], [2.0, 2.2, 2.1, 1.6, 1.2, 1.3, 1.8, 2.3, 3.2, 4.5, 5.9, 7.3, 8.7, 9.8, 10.7, 11.6, 12.5, 13.6, 15.2, 17.5, 19.8], [2.4, 2.7, 2.7, 2.5, 2.1, 2.2, 2.2, 2.7, 3.2, 4.5, 5.9, 7.6, 9.1, 10.3, 11.2, 12.1, 13.2, 14.7, 16.6, 18.9, 21.7], [2.5, 2.9, 3.2, 3.2, 3.1, 3.1, 3.1, 3.2, 3.6, 4.9, 6.3, 8.0, 9.6, 10.9, 12.1, 13.0, 14.1, 15.6, 17.6, 20.4, 23.2], [2.9, 3.3, 3.6, 3.6, 3.6, 3.6, 3.7, 4.0, 4.5, 5.4, 6.8, 8.5, 10.3, 11.6, 12.6, 13.7, 15.0, 16.6, 19.0, 21.8, 24.6], [3.3, 3.7, 3.8, 3.8, 3.8, 4.1, 4.1, 4.6, 5.1, 5.9, 7.5, 9.3, 11.0, 12.3, 13.4, 14.4, 15.7, 17.6, 20.1, 23.2, 26.0], [3.8, 4.0, 3.8, 3.8, 3.8, 4.0, 4.6, 5.1, 5.5, 6.7, 8.4, 10.3, 11.8, 13.2, 14.4, 15.3, 16.6, 18.6, 21.3, 24.3, 27.0], [4.2, 4.1, 3.7, 3.5, 3.5, 3.9, 4.8, 5.3, 6.0, 7.3, 9.3, 11.2, 12.7, 14.1, 15.3, 16.2, 17.5, 19.5, 22.1, 24.9, 27.7], [4.3, 4.1, 3.5, 3.0, 3.1, 3.6, 4.6, 5.5, 6.4, 7.8, 9.9, 11.9, 13.6, 14.9, 16.0, 17.0, 18.3, 20.2, 22.6, 25.4, 27.9], [4.1, 3.9, 3.3, 2.8, 2.9, 3.4, 4.3, 5.5, 6.6, 8.2, 10.2, 12.3, 14.2, 15.5, 16.5, 17.5, 18.8, 20.6, 22.8, 25.3, 27.4], [3.7, 3.5, 3.1, 2.6, 2.7, 3.4, 4.3, 5.2, 6.5, 8.2, 10.2, 12.4, 14.3, 15.7, 16.7, 17.7, 18.9, 20.6, 22.5, 24.7, 26.5], [3.5, 3.2, 2.9, 2.3, 2.4, 3.2, 4.2, 5.1, 6.0, 7.6, 9.9, 11.8, 13.7, 15.3, 16.4, 17.4, 18.4, 19.8, 21.6, 23.4, 25.3], [3.7, 3.2, 2.7, 2.3, 2.4, 2.9, 3.8, 4.6, 5.5, 6.9, 8.9, 10.7, 12.5, 14.1, 15.3, 16.2, 17.1, 18.2, 19.7, 21.5, 23.4], [4.2, 3.7, 3.0, 2.3, 2.4, 2.9, 3.7, 4.3, 5.1, 6.4, 7.7, 9.0, 10.6, 12.2, 13.4, 14.3, 15.3, 16.3, 17.8, 19.6, 21.5], [4.9, 4.2, 3.5, 2.7, 2.4, 2.8, 3.3, 4.2, 4.7, 5.5, 6.4, 7.3, 8.5, 10.2, 11.5, 12.5, 13.4, 14.5, 15.9, 17.4, 19.2], [5.8, 4.9, 4.0, 3.2, 2.8, 2.8, 3.3, 3.8, 4.2, 4.7, 5.5, 6.1, 7.1, 8.5, 9.7, 10.8, 12.0, 13.1, 14.5, 16.0, 17.9]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 14, ground: GROUND, towers: TOWERS, inside: [288.0, 108.4] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-commandants-armoury', "Kremlin Wall, Commandant's Tower to Armoury Tower", build(), 6500)
