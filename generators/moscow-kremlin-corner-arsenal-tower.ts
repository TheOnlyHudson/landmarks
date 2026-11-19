/**
 * Corner Arsenal Tower (Uglovaya Arsenalnaya), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-corner-arsenal-tower.ts
 *
 * The broad sixteen-sided tower at the Kremlin's north corner, where the
 * Red Square wall meets the Alexander Garden wall, built by Pietro Antonio
 * Solari in 1492 over a spring, given its tent in 1680. Its identifying
 * features, each in the photos below:
 * - the massive sixteen-sided brick shaft on a battered plinth, with a
 *   corbel and swallowtail merlons at the top;
 * - a round upper tier inside the merlons with a white cornice, and a
 *   narrower drum under the tent;
 * - the tall eight-sided green tent with two rows of red gabled dormers;
 * - a tall, slim octagonal lookout with long windows, a small green tent
 *   and a gilt vane.
 *
 * Frame: the kit's (x east, y north, z up, metres), bearing -0.2. Anchor at
 * the centroid of OSM relation/1360653.
 *
 * Heights. Published: 60.2 m (Wikipedia, "Corner Arsenal Tower"; OSM
 * height=60). OSM building:parts (API map call, 2026-11-18): plinth to 2 m
 * (16.8 m across), shaft 2-24 m (15 m), corbels 24-26 m (15.6 m) and
 * 26-28.5 m (16.2 m), upper tier 28.5-33 m (11.8 m), cornice to 33.7 m,
 * tent 33-53 m (8.8 m across flats), its dormers at 36.7-45 m and
 * 50.2-51 m, the lookout's tent 33.7-57 m. The tent's top (49.2 m), the
 * lookout (49.2-54.6 m) and the top tent (54.6-58.8 m) are set from the
 * photos between those heights; the vane reaches 60.2 m. The drum under the
 * tent (32.8-36.2 m, 10.4 m across) is from the photos; the tent's foot is
 * 9.6 m across flats, a little over OSM's 8.8 m, to meet the drum.
 *
 * Estimated from the photos: the plinth's batter (from 8.4 m radius at the
 * ground to 7.5 m at 8 m), the dormers (eight in the lower row, eight in
 * the upper), the windows and slits.
 *
 * Photos (Wikimedia Commons, Юрий Д.К., CC BY 4.0):
 * - "Moscow - 2025 - Corner Arsenal Tower, details.jpg" (the tent, from the north-east)
 * - "Moscow - 2025 - The Corner Arsenal Tower, Alexander Garden.jpg" (from the west)
 * - "Moscow - 2025 - Corner Arsenal Tower from the Alexander Garden.jpg" (from the south-west)
 * - "Moscow - 2025 - Corner Arsenal Tower, view from Manezhnaya Square.jpg" (from the north-west)
 * - "Moscow - 8-2025 - Corner Arsenal Tower from Red Square1.jpg" (from the east)
 */
import { Kit, circle, ngon, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  const C: [number, number] = [0, 0]
  const s16 = (r: number) => circle(r, C, 16)
  // Battered plinth, shaft, the corbel stepping out under the merlons.
  k.shaft('brick', [[s16(8.4), 0], [s16(7.5), 8], [s16(7.5), 24], [s16(8.1), 24.9], [s16(8.1), 28.6]])
  k.band('white', s16(7.5), 7.9, 8.2, 0.08)
  k.band('white', s16(8.1), 27.2, 27.45, 0.06)
  k.openings(s16(8.1), 25.3, 27.0, { per: 2, w: 0.75, head: 'round' })
  k.openings(s16(7.5), 13.0, 14.8, { per: 1, w: 0.6, head: 'round', faces: [1, 3, 5, 7, 9, 11, 13, 15] })
  k.openings(s16(7.5), 19.0, 20.6, { per: 1, w: 0.5, head: 'round', faces: [0, 4, 8, 12] })
  k.merlonRing(C, 8.05, 28.6, 26, { w: 0.95, h: 1.6, t: 0.45 })
  // Upper tier inside the merlons, and a narrower drum under the tent.
  k.prism('brick', s16(6.4), 28.6, 32.6, false)
  k.openings(s16(6.4), 30.2, 31.8, { per: 1, w: 0.55, head: 'round', faces: [0, 2, 4, 6, 8, 10, 12, 14] })
  k.band('white', s16(6.4), 32.25, 32.6, 0.2)
  k.skirt('brick', s16(6.6), 32.6, 32.9, 1.5)
  k.prism('brick', s16(5.2), 32.8, 36.2, false)
  k.openings(s16(5.2), 34.0, 35.4, { per: 1, w: 0.5, head: 'round', faces: [1, 5, 9, 13] })
  k.band('white', s16(5.2), 35.85, 36.2, 0.2)
  // The tent with its two rows of dormers, the lookout, the top tent and vane.
  const tb = ngon(8, 4.9), tt = ngon(8, 1.55)
  k.loft('green', [{ plan: tb, z: 36.2 }, { plan: tt, z: 49.2 }])
  k.dormers(tb, 36.2, 49.2, { t: 0.16, per: 1, w: 1.1, h: 1.9, top: tt })
  k.dormers(tb, 36.2, 49.2, { t: 0.5, per: 1, w: 0.9, h: 1.5, top: tt })
  const lk = ngon(8, 1.45)
  k.prism('brick', lk, 49.0, 54.6, false)
  k.corners(lk, 49.2, 54.6, 0.2)
  k.openings(lk, 50.3, 53.4, { per: 1, w: 0.42, head: 'round' })
  k.band('white', lk, 54.25, 54.6, 0.15)
  k.tent('green', ngon(8, 1.65), 54.6, 58.8)
  k.vane(C, 58.6, 1.6)
  return k
}

if (import.meta.main) await save('moscow-kremlin-corner-arsenal-tower', 'Corner Arsenal Tower', build(), 5000)
