/**
 * Kremlin Wall, Tsar's Tower to Alarm Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-wall-tsars-alarm.ts
 *
 * The stretch of the Kremlin's red-brick wall on the Red Square side between the
 * Tsar's Tower and the Alarm Tower, built 1485-1495 by Italian masters.
 *
 * The wall is the OSM outline of relation/2470034 (building=wall, fetched
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
 * own models (relation/1360661, relation/1360663).
 *
 * Heights: OSM tags the walk at 12 m (relation/2470034 and its building:parts, whose skillion parts carry the merlons from 12 to 14.5 m); published wall heights run from 5 to 19 m, taller where the ground falls away 
 * (Wikipedia, "Moscow Kremlin Wall").
 *
 * Left out: the loophole slits in the merlons, the wall walk's inner
 * arcades and stairs, the necropolis and everything in front of the wall.
 *
 * Photos (Wikimedia Commons):
 * - "Kremlin wall - Red Square.jpg", Юрий Д.К., CC BY 4.0 (from Red Square)
 * - "Moscow - 2025 - Tsarskaya Tower and the Kremlin Wall.jpg", Юрий Д.К., CC BY 4.0
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0 (the merlons' shape)
 * - "Nabatnaya Tower1.jpg", Юрий Д.К., CC BY 4.0
 */
import { Kit, wall, save, type Ground, type XY } from './moscow-kremlin-towers-kit'

const RINGS: XY[][] = [[[-6.4, 21.09], [-10.17, 19.69], [6.26, -20.87], [10.18, -19.63]]]
const TOWERS: XY[][] = [[[6.12, -20.47], [3.48, -21.32], [6.46, -30.61], [6.95, -30.44], [15.83, -27.66], [12.84, -18.37]], [[-6.4, 21.09], [-7.34, 20.74], [-7.82, 20.57], [-9.22, 20.05], [-10.17, 19.69], [-11.84, 24.16], [-10.9, 24.5], [-9.49, 25.02], [-9.02, 25.2], [-8.08, 25.55]]]
/** Mapterhorn z12 under the wall (heights relative to the lowest in the table), rows along y from y0, columns along x from x0, 10 m apart. */
const GROUND: Ground = {"y0": -59.0, "x0": -61.0, "step": 10.0, "z": [[18.5, 19.0, 19.4, 19.4, 17.8, 15.9, 14.1, 12.5, 10.9, 8.6, 5.7, 2.6, 0.0], [19.0, 19.4, 19.9, 19.5, 18.2, 16.4, 14.6, 13.0, 11.1, 8.6, 5.6, 2.5, 0.0], [19.4, 19.5, 20.0, 19.6, 18.6, 16.9, 15.0, 13.3, 11.4, 9.0, 6.0, 2.9, 0.4], [20.5, 19.8, 20.0, 19.6, 18.7, 17.0, 15.4, 13.7, 11.6, 9.1, 6.3, 3.4, 0.9], [22.1, 20.6, 20.0, 19.3, 18.4, 16.9, 15.5, 13.8, 11.7, 9.1, 6.3, 3.7, 1.6], [23.7, 21.6, 20.4, 19.2, 18.0, 16.6, 15.2, 13.5, 11.4, 9.0, 6.4, 4.2, 2.4], [25.0, 22.5, 20.8, 19.2, 17.8, 16.2, 14.7, 12.9, 10.8, 8.7, 6.6, 4.7, 3.2], [26.2, 23.4, 21.3, 19.3, 17.6, 15.8, 14.1, 12.2, 10.1, 8.2, 6.6, 5.2, 4.3], [26.9, 24.1, 21.6, 19.3, 17.2, 15.3, 13.3, 11.4, 9.4, 7.6, 6.3, 5.4, 5.2], [27.2, 24.4, 21.8, 19.3, 17.0, 14.9, 12.7, 10.6, 8.8, 7.2, 6.2, 5.7, 6.0], [27.0, 24.3, 22.0, 19.2, 16.8, 14.5, 12.2, 10.1, 8.2, 6.9, 6.2, 6.2, 6.9], [26.1, 23.7, 21.4, 18.7, 16.3, 14.0, 11.6, 9.4, 7.6, 6.5, 6.0, 6.4, 7.5], [25.0, 22.7, 20.4, 17.7, 15.3, 12.9, 10.7, 8.7, 7.1, 6.2, 6.2, 6.8, 8.0]]}

export function build() {
  const k = new Kit([0, 0])
  wall(k, { rings: RINGS, height: 12, ground: GROUND, towers: TOWERS, inside: [-245.8, -117.2] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-wall-tsars-alarm', "Kremlin Wall, Tsar's Tower to Alarm Tower", build(), 6500)
