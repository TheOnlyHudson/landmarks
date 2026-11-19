/**
 * Tsar's Tower (Tsarskaya), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-tsars-tower.ts
 *
 * The smallest Kremlin tower: a stone pavilion of 1680 standing on the Red
 * Square wall between the Saviour and the Alarm towers, where, by legend,
 * Ivan the Terrible watched the square. Its identifying features, each in
 * the photos below:
 * - four squat, jug-shaped brick pillars, banded white, carrying open arches;
 * - a steep dark green tent with a gilt vane, and four small white corner
 *   spires with gilt flags.
 *
 * Frame: the kit's (x east, y north, z up, metres), bearing -20.5; Red
 * Square is +x. Anchor at the centroid of OSM relation/1360663 (4.0 x 4.8
 * m); the model stands on the ground and takes in the stretch of wall
 * under it, so it meets the wall models on either side.
 *
 * Heights. Published: 16.7 m with the vane (Wikipedia, "Tsarskaya Tower";
 * OSM height=16). OSM maps only the outline. That height can't be squared
 * with the wall it stands on: OSM's wall here is 12 m with merlons to
 * 14.5 m, and every photo shows the pillars starting at the merlons' tops
 * and the pavilion and tent above them as tall again as two merlons. The
 * model follows the photos on the OSM wall: base to 14.2 m, pillars
 * 14.2-17.2 m, the arcade's band to 18.1 m, the tent to 22 m, the vane
 * to 22.9 m. A doubt: either the published figure is taken from the wall
 * walk, or OSM's wall is too tall here.
 *
 * Photos (Wikimedia Commons, all from Red Square, east):
 * - "Tsarskaya Tower - Red Square1.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow - 2025 - Tsarskaya Tower and the Kremlin Wall.jpg", Юрий Д.К., CC BY 4.0
 * - "Tsarskaya Tower-1.jpg", Presidential Press and Information Office, CC BY 4.0
 * - "Tsarskaya Tower (2026).jpg", Юрий Д.К., CC BY 4.0
 * - "Tsarskaya Tower1.jpg", Юрий Д.К., CC BY 4.0
 */
import { Kit, rect, save, type XY } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  const base = rect(4.0, 4.8)
  k.prism('brick', base, 0, 14.2, true)
  k.corners(base, 11.6, 14.2, 0.4)
  k.band('white', base, 13.9, 14.2, 0.1)
  k.openings(base, 12.0, 13.1, { per: 2, w: 0.45, head: 'round', faces: [1] })
  // Four squat, jug-shaped pillars, banded white.
  const P: XY[] = [[-1.45, -1.85], [1.45, -1.85], [1.45, 1.85], [-1.45, 1.85]]
  for (const c of P) {
    const r = (h: number) => rect(h, h, h * 0.3, c)
    k.shaft('brick', [[r(0.8), 14.2], [r(1.15), 14.9], [r(1.15), 15.9], [r(0.75), 16.5], [r(0.75), 17.2]], false)
    k.band('white', r(0.8), 14.2, 14.45, 0.1)
    k.band('white', r(0.75), 16.55, 16.8, 0.12)
  }
  // The arcade's band, open below between the pillars.
  const top = rect(4.0, 4.8)
  k.loft('brick', [{ plan: top, z: 17.2 }, { plan: top, z: 18.1 }], true, true)
  k.band('white', top, 17.85, 18.1, 0.14)
  // The tent, corner spires and vane.
  k.skirt('brick', rect(4.0, 4.8), 18.1, 18.5, 0.3)
  k.tent('green', rect(3.4, 4.2), 18.5, 22.0)
  for (const c of [[-2.05, -2.45], [2.05, -2.45], [2.05, 2.45], [-2.05, 2.45]] as XY[]) {
    k.pinnacle([c[0] * 0.92, c[1] * 0.93], 18.1, 19.0, 20.3, 0.3, { shaft: 'brick', spire: 'white' })
    k.vane([c[0] * 0.92, c[1] * 0.93], 20.2, 0.6)
  }
  k.vane([0, 0], 21.8, 1.1)
  return k
}

if (import.meta.main) await save('moscow-kremlin-tsars-tower', "Tsar's Tower", build(), 5000)
