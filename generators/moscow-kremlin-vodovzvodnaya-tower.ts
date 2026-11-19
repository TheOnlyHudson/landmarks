/**
 * Vodovzvodnaya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-vodovzvodnaya-tower.ts
 *
 * The round "water-lifting" tower at the Kremlin's south-west corner, on
 * the river by the Bolshoy Kamenny Bridge: built 1488, blown up by the
 * French in 1812 and rebuilt by Bove in 1817-1819, crowned with a ruby
 * star since 1937. Its identifying features, each in the photos below:
 * - the round brick shaft, its lower half banded with rustication, under a
 *   ring of tall arched machicolations and swallowtail merlons;
 * - a round upper tier with arched windows between white bands;
 * - the broad green tent with a ring of tall gabled dormers;
 * - two octagonal lookouts, one over the other, and the slim green spire;
 * - the ruby star.
 *
 * Frame: the kit's (x east, y north, z up, metres), bearing 30.7 (the
 * round plan makes it immaterial). Anchor at the centroid of OSM
 * relation/1360648.
 *
 * Heights. Published: 61.25 m with the star (Wikipedia, "Vodovzvodnaya
 * Tower"; OSM height=61.25); the star spans 3.0 m (Wikipedia, "Kremlin
 * stars"). OSM building:parts (API map call, 2026-11-18): shaft 0-22.5 m
 * (11 m across, 12 m at the foot), corbel 22.5-23.5 m (11.6 m) and
 * 23.5-24.3 m (12.6 m), merlons 24.3-25.8 m (24 of them), upper tier
 * 24.3-28.8 m (10.2 m), the tent 28.8-57 m (7.8 m across, which is the
 * lookouts' and the spire's envelope). A second, narrower ring (28.4-31.2
 * m), the tent (31.2-41.2 m, 9.9 m across at its eave), the two
 * lookouts (41-45.6 m, 45.6-49.6 m) and the spire (to 56.9 m) are read
 * off the photos against those heights. The star is drawn 3.3 m across,
 * a tenth over real, so it holds at phone size.
 *
 * Estimated from the photos: the dormers (eight, 1.0 m wide, 2.2 m high),
 * the windows, the batter of the foot (6.0 m radius to 5.55 m at 12 m).
 * The rustication bands are drawn as one white band where they stop.
 *
 * Photos (Wikimedia Commons; Юрий Д.К., CC BY 4.0, unless noted):
 * - "Vodovzvodnaya Tower details - 2025 1.jpg" (the tent and lookouts, south)
 * - "Vodovzvodnaya Tower details - 2025 2.jpg" (the upper tier and tent)
 * - "Vodovzvodnaya Tower details - 2025 3.jpg" (the corbels and merlons)
 * - "Vodovzvodnaya Tower details - 2025 7.jpg" and "... 8.jpg" (the shaft
 *   from the river, south)
 * - "Moscow - Vodovzvodnaya Tower2.jpg" (from the south-west, across the river)
 * - "Moscow - 2026 - Vodovzvodnaya Tower.jpg" (from the south-west)
 * - "Vodovzvodnaya Tower 02.jpg", Максим Улитин, CC BY 3.0 (from the south, at dusk)
 */
import { Kit, circle, ngon, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  const C: [number, number] = [0, 0]
  // Shaft with its batter, the corbel ring flaring out under the merlons.
  k.shaft('brick', [[circle(6.0), 0], [circle(5.55), 12], [circle(5.5), 19.2], [circle(6.3), 20.2], [circle(6.3), 23.8]])
  k.band('white', circle(5.55), 11.8, 12.2, 0.08)
  k.band('white', circle(6.3), 22.6, 22.85, 0.06)
  k.openings(circle(6.3), 20.5, 22.4, { per: 2, w: 0.85, head: 'round' })
  k.openings(circle(5.53), 14.5, 16.2, { per: 1, w: 0.55, head: 'round', faces: [0, 3, 6, 9, 12, 15] })
  k.openings(circle(5.76), 6.0, 7.4, { per: 1, w: 0.5, head: 'round', faces: [1, 5, 9, 13] })
  k.merlonRing(C, 6.25, 23.8, 24, { w: 0.95, h: 1.65, t: 0.45 })
  // Upper round tiers: arched windows, then a narrower ring of small ones.
  k.prism('brick', circle(5.1), 23.8, 28.2, false)
  k.band('white', circle(5.1), 27.9, 28.2, 0.15)
  k.openings(circle(5.1), 25.4, 27.4, { per: 1, w: 0.8, head: 'round', faces: [0, 2, 4, 6, 8, 10, 12, 14] })
  k.skirt('brick', circle(5.25), 28.2, 28.5, 0.65)
  k.prism('brick', circle(4.6), 28.4, 31.2, false)
  k.band('white', circle(4.6), 30.85, 31.2, 0.2)
  k.openings(circle(4.6), 29.1, 30.5, { per: 1, w: 0.55, head: 'round', faces: [1, 3, 5, 7, 9, 11, 13, 15] })
  // The tent, truncated under the lookouts, with its tall dormers.
  const tb = circle(4.95), tt = circle(2.15)
  k.loft('green', [{ plan: tb, z: 31.2 }, { plan: tt, z: 41.2 }])
  k.dormers(tb, 31.2, 41.2, { t: 0.3, per: 1, w: 1.0, h: 2.2, top: tt, faces: [0, 2, 4, 6, 8, 10, 12, 14] })
  // Two octagonal lookouts.
  const o1 = ngon(8, 2.0), o2 = ngon(8, 1.6)
  k.prism('brick', o1, 41.0, 45.6, false)
  k.corners(o1, 41.0, 45.6, 0.25)
  k.openings(o1, 42.2, 44.6, { per: 1, w: 0.6, head: 'round', frame: 0.1 })
  k.band('white', o1, 45.3, 45.6, 0.15)
  k.skirt('green', ngon(8, 2.25), 45.6, 46.1, 0.55)
  k.prism('brick', o2, 46.0, 49.6, false)
  k.openings(o2, 46.8, 48.8, { per: 1, w: 0.5, head: 'round', frame: 0.08 })
  k.band('white', o2, 49.3, 49.6, 0.15)
  // The spire, its foot ringed with small gables, and the star.
  const sp = ngon(8, 1.85)
  k.tent('green', sp, 49.6, 56.9)
  k.dormers(sp, 49.6, 56.9, { t: 0.08, per: 1, w: 0.7, h: 0.5, faces: [0, 2, 4, 6] })
  k.star(C, 56.9 + 1.65 * 1.9, 3.3)
  return k
}

if (import.meta.main) await save('moscow-kremlin-vodovzvodnaya-tower', 'Vodovzvodnaya Tower', build(), 5000)
