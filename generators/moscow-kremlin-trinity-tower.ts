/**
 * Trinity Tower (Troitskaya), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-trinity-tower.ts
 *
 * The tallest Kremlin tower, the gate over the Trinity Bridge from the
 * Kutafya Tower, built by Aloisio da Milano in 1495-1499 and given its
 * Gothic tiers and tent in 1685, crowned with a ruby star since 1937. Its
 * identifying features, each in the photos below:
 * - the massive square brick shaft, a small clock dial over each gate;
 * - the white Gothic crown on the shaft: a pierced parapet, four tall
 *   white corner pinnacles and small ones between;
 * - two square tiers, the upper with white ogee gables, then two octagons
 *   open in arches (the upper a lookout);
 * - the tall green tent with small dormers at its foot, and the ruby star;
 * - the gate block towards the bridge (-x), as high as the wall.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing 16.1
 * so the faces run along the axes; the bridge and Kutafya are -x. Anchor
 * at the centroid of OSM relation/1360627; the shaft's axis is 4.5 m to +x
 * of it.
 *
 * Heights. Published: 80 m with the star (Wikipedia, "Troitskaya Tower";
 * OSM height=80); the star spans 3.5 m. OSM building:parts (API map call,
 * 2026-11-18): shaft 0-33.5 m (20.2 x 19.5 m), gate block 0-23 m (11.1 x
 * 16.2 m) under skillion roofs to 25.5 m, corner pinnacles 33.5-42 m and
 * small ones 33.5-39 m, tiers 33.5-38.5 m (12 m) and 38.5-42.5 m (11 m),
 * octagons 41-48 m (10.3 m) and 48-55.5 m (9.5 m), tent 55.5-80 m (8.5 m)
 * with gabled dormers at 56.8-58 m, the star 79-84 m. The tent's apex is
 * set at 75 m so that the star, drawn 3.85 m across (a tenth over real),
 * tops out at the published 80 m.
 *
 * Estimated from the photos: the windows, the two clock dials (2.4 m across, one over each gate),
 * the gate (4.6 m wide, 8 m high), the parapet's openings, the gables.
 *
 * Photos (Wikimedia Commons):
 * - "Russia-Moscow-Kremlin-Trinity Tower-1.jpg" and "-2.jpg", Alex Zelenko, CC BY-SA 4.0 (from inside, east; from the bridge, west)
 * - "Troitskaya Tower-2.jpg", Presidential Press and Information Office, CC BY 4.0 (from inside, east)
 * - "Troitskaya (Trinity) Tower, Moscow Kremlin.jpg", longmandancer, CC BY-SA 2.0 (from inside, east)
 * - "The Trinity (Troitskaya) Tower of Moscow Kremlin (March 2009) - panoramio.jpg", Shamil Valeev, CC BY-SA 3.0 (from the west)
 * - "Kremlin Kutafya and Troitskaya Towers.jpg", Stan Shebs, CC BY-SA 3.0 (from the west)
 */
import { Kit, rect, ngon, grow, save, type XY } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([4.5, 0])
  // The shaft.
  const sh = rect(20.2, 19.5)
  k.prism('brick', sh, 0, 33.5, false)
  k.openings(sh, 13.0, 14.8, { per: 3, w: 0.8, head: 'round' })
  k.openings(sh, 21.0, 22.8, { per: 3, w: 0.8, head: 'round', frame: 0.15 })
  k.openings(sh, 27.6, 29.2, { per: 5, w: 0.65, head: 'round' })
  k.band('white', sh, 25.5, 25.8, 0.06)
  k.band('white', sh, 32.9, 33.5, 0.2)
  k.dial([10.1, 0], [0, 1], 17.5, 1.2)
  k.openings(sh, 0, 8.0, { per: 1, w: 4.6, head: 'round', faces: [1], frame: 0.4 })
  // The white Gothic crown: pierced parapet and pinnacles.
  const pr = grow(sh, -0.3)
  k.prism('brick', pr, 33.5, 36.0, true)
  k.band('white', pr, 35.6, 36.0, 0.12)
  k.openings(pr, 34.0, 35.4, { per: 6, w: 0.9, head: 'pointed', frame: 0.12 })
  for (const [x, y] of [[-9.7, -9.4], [9.7, -9.4], [9.7, 9.4], [-9.7, 9.4]] as XY[]) k.pinnacle([x, y], 33.5, 38.4, 42.8, 0.75, { spire: 'white', ball: true })
  for (const [x, y] of [[-3.3, -9.4], [3.3, -9.4], [9.7, -3.2], [9.7, 3.2], [3.3, 9.4], [-3.3, 9.4], [-9.7, 3.2], [-9.7, -3.2]] as XY[]) k.pinnacle([x, y], 36.0, 37.0, 39.4, 0.35, { spire: 'white' })
  // Two square tiers, white ogee gables on the upper.
  const t1 = rect(12.0, 12.0), t2 = rect(11.0, 11.0)
  k.prism('brick', t1, 36.0, 38.8, false)
  k.band('white', t1, 38.4, 38.8, 0.15)
  k.prism('brick', t2, 38.8, 42.6, false)
  k.corners(t2, 38.8, 42.6, 0.45)
  k.openings(t2, 39.4, 41.6, { per: 2, w: 0.8, head: 'round', frame: 0.15 })
  k.band('white', t2, 42.2, 42.6, 0.2)
  for (const [c, e] of [[[0, -5.5], [1, 0]], [[5.5, 0], [0, 1]], [[0, 5.5], [-1, 0]], [[-5.5, 0], [0, -1]]] as [XY, XY][]) k.pediment(c, e, 41.6, 3.6, 2.6, 'white', 0.2)
  // Two octagons open in arches.
  const o1 = ngon(8, 4.9), o2 = ngon(8, 4.4)
  k.prism('brick', o1, 42.6, 48.2, false)
  k.corners(o1, 42.8, 48.2, 0.35)
  k.openings(o1, 43.6, 46.8, { per: 1, w: 1.3, head: 'round', frame: 0.18 })
  k.band('white', o1, 47.8, 48.2, 0.22)
  k.skirt('green', ngon(8, 5.2), 48.2, 48.9, 0.9)
  k.prism('brick', o2, 48.7, 55.5, false)
  k.corners(o2, 48.9, 55.5, 0.3)
  k.openings(o2, 49.8, 53.8, { per: 1, w: 1.4, head: 'round', frame: 0.15 })
  k.band('white', o2, 55.1, 55.5, 0.22)
  // The tent, its foot gables, and the star.
  const tb = ngon(8, 4.1)
  k.tent('green', tb, 55.5, 75.0)
  k.dormers(tb, 55.5, 75.0, { t: 0.05, per: 1, w: 1.2, h: 0.9 })
  k.star([0, 0], 75.0 + 1.75 * 1.925, 3.85)
  // The gate block towards the bridge (-x): to the wall's height under low roofs.
  const gb = rect(11.1, 16.2, 0, [-15.0, 0])
  k.prism('brick', gb, 0, 23.0, false)
  k.band('white', gb, 22.6, 23.0, 0.12)
  k.skirt('green', grow(gb, 0.25), 23.0, 25.5, 4.0)
  k.corners(gb, 0, 22.6, 0.6)
  k.openings(gb, 0, 7.6, { per: 1, w: 4.4, head: 'round', faces: [3], frame: 0.4 })
  k.openings(gb, 13.0, 14.8, { per: 2, w: 0.7, head: 'round', faces: [0, 2] })
  k.dial([-20.55, 0], [0, -1], 12.5, 1.2)
  return k
}

if (import.meta.main) await save('moscow-kremlin-trinity-tower', 'Trinity Tower', build(), 6500)
