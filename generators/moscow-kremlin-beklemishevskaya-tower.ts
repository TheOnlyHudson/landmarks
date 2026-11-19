/**
 * Beklemishevskaya Tower (Moskvoretskaya), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-beklemishevskaya-tower.ts
 *
 * The slim round tower at the Kremlin's south-east corner, where the Red
 * Square wall meets the river wall, built by Marco Friazin in 1487-1488 and
 * given its octagon and tent in 1680. Its identifying features, each in
 * the photos below:
 * - the tall round brick shaft on a battered foot, with a ring of tall
 *   arched machicolation slits under a flared corbel and a merlon parapet;
 * - a short octagon on the parapet, then a narrower octagon;
 * - a slim octagonal green tent with a ring of gabled dormers, a small
 *   octagonal lookout on it, the spire and a gilt vane.
 *
 * Frame: the kit's (x east, y north, z up, metres), bearing -29.0. Anchor at
 * the centroid of OSM relation/1360651.
 *
 * Heights. Published: 46.2 m (Wikipedia, "Beklemishevskaya Tower"; OSM
 * height=46.2). OSM building:parts (API map call, 2026-11-18): the foot
 * 0-13 m (10 m across at the ground, 8 m at the top), shaft 0-21 m (8 m),
 * corbels 21-22 m (8.4 m), 22-23 m (8.8 m), 23-24.3 m (9.2 m), parapet
 * 24.3-25.2 m, first octagon 24.3-26.8 m (7 m), second octagon 27-29 m
 * (4.8 m) under a skirt to 30.5 m, lookout rings 36-37.8 m (2.8 m) and the
 * top tent 40-46 m. The tent (30.2-37 m), the lookout (37-40.4 m) and the
 * spire (40.4-45 m) are set between those heights from the photos.
 *
 * Estimated from the photos: the foot's batter, the slits (16, 0.5 m wide,
 * 16.5-20.5 m), the dormers (eight), the windows.
 *
 * Photos (Wikimedia Commons):
 * - "MosKremlin 05-2012 Beklemishev Tower.jpg", A.Savin, CC BY-SA 3.0 (from the south-east)
 * - "Moscow Beklemishevskaya Tower V23.JPG", Ludvig14, CC BY-SA 3.0 (from the south, across the river)
 * - "Beklemishevskaya Tower 2025.jpg", Юрий Д.К., CC BY 4.0 (from the south)
 * - "Kremlin Walls, Beklemishevskaya Tower of Moscow Kremlin, Moscow, Russia.jpg",
 *   Vyacheslav Argenberg, CC BY 4.0 (from the east, Vasilyevsky Spusk)
 * - "Beklemishevskaya Tower of Moscow Kremlin (the superstructure).jpg",
 *   Dmitry Ivanov., CC BY-SA 4.0 (the top, from the south-east)
 */
import { Kit, circle, ngon, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  const C: [number, number] = [0, 0]
  // Battered foot, round shaft, a corbel flaring out to the parapet.
  k.shaft('brick', [[circle(5.0), 0], [circle(4.05), 12.5], [circle(4.0), 13.5], [circle(4.0), 21.0], [circle(4.6), 23.6], [circle(4.6), 24.4]])
  k.band('white', circle(4.05), 12.6, 12.9, 0.08)
  k.band('white', circle(4.6), 23.6, 23.8, 0.05)
  k.openings(circle(4.0), 16.5, 20.6, { per: 1, w: 0.55, head: 'round', proud: 0.06 })
  k.openings(circle(4.5), 6.5, 7.8, { per: 1, w: 0.45, head: 'round', faces: [2, 6, 10, 14] })
  k.merlonRing(C, 4.55, 24.4, 18, { w: 0.85, h: 1.3, t: 0.4 })
  // First and second octagons.
  const o1 = ngon(8, 3.4), o2 = ngon(8, 2.4)
  k.prism('brick', o1, 24.4, 27.0, false)
  k.openings(o1, 25.2, 26.4, { per: 1, w: 0.55, head: 'round', frame: 0.1 })
  k.band('white', o1, 26.7, 27.0, 0.15)
  k.skirt('green', ngon(8, 3.6), 27.0, 27.6, 1.0)
  k.prism('brick', o2, 27.4, 29.8, false)
  k.corners(o2, 27.6, 29.8, 0.25)
  k.openings(o2, 28.0, 29.3, { per: 1, w: 0.5, head: 'flat' })
  k.band('white', o2, 29.5, 29.8, 0.15)
  // The tent, its dormers, the lookout, the spire and the vane.
  const tb = ngon(8, 2.35), tt = ngon(8, 1.1)
  k.loft('green', [{ plan: tb, z: 29.8 }, { plan: tt, z: 37.0 }])
  k.dormers(tb, 29.8, 37.0, { t: 0.22, per: 1, w: 0.65, h: 1.4, top: tt })
  const lk = ngon(8, 1.05)
  k.prism('brick', lk, 36.9, 40.4, false)
  k.openings(lk, 37.6, 39.4, { per: 1, w: 0.4, head: 'round' })
  k.band('white', lk, 38.0, 38.2, 0.12)
  k.band('white', lk, 40.1, 40.4, 0.15)
  k.tent('green', ngon(8, 1.2), 40.4, 45.2)
  k.vane(C, 45.0, 1.6)
  return k
}

if (import.meta.main) await save('moscow-kremlin-beklemishevskaya-tower', 'Beklemishevskaya Tower', build(), 5000)
