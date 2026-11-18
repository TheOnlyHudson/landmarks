/**
 * Nikolskaya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-nikolskaya-tower.ts
 *
 * The gate tower at the north end of Red Square, built by Pietro Antonio
 * Solari in 1491, rebuilt in Gothic Revival dress by Luigi Rusca in 1806
 * and again after the French blew up its top in 1812, crowned with a ruby
 * star since 1935. Its identifying features, each in the photos below:
 * - the gate front on Red Square: red brick framed in white Gothic
 *   pilasters and pointed arches round the gate and the icon, under a white
 *   frieze;
 * - the square tier above it with white lancet frames and four tall white
 *   corner pinnacles;
 * - two tall octagons, red with white lancet tracery and white friezes;
 * - the slim green octagonal tent and the ruby star.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing 44.6
 * so the faces run along the axes; Red Square is +y. Anchor at the
 * centroid of OSM relation/1359372.
 *
 * Heights. Published: 70.4 m with the star (Wikipedia, "Nikolskaya
 * Tower"; OSM height=70.4); the star spans 3.75 m. OSM building:parts (API
 * map call, 2026-11-18): the shaft 0-24 m with its roof (14.6 x 15.8 m),
 * the gate front 0-18 m (13.3 x 11.4 m) under skillion roofs to 19.5 m,
 * corner pinnacles 0-17.5 m and 19-30 m, the square tier 19.5-28 m
 * (12.7 m), the octagons 23-42 m (9 m) and 37-55 m (7.3 m), the tent
 * 50-70 m (5.7 m), the star 69-73.5 m. OSM's tiers are boxes round the
 * tower's envelope; the photos from Red Square show a much slimmer top, so
 * the stages above the shaft follow the photos, scaled to the published
 * height: the gate front to 21 m, the shaft to 24.5 m, the square tier
 * 24.5-32.4 m (9 m), the octagons 32.4-40.6 m and 40.6-48.2 m (6.9 m and
 * 6.1 m across flats), the tent 48.2-67 m; the
 * star is drawn 4.1 m across, a tenth over real.
 *
 * Estimated from the photos: the lancets (two a face on the octagons), the
 * gate (3.8 m wide, 7 m high), the pinnacles' sizes.
 *
 * Photos (Wikimedia Commons):
 * - "Nikolskaya Tower.jpg", Andrey, CC BY 2.0 (from Red Square, north-east)
 * - "Nikolskaya Tower - Moscow, 2025 1.jpg" and "... 2.jpg", Юрий Д.К., CC BY 4.0 (the tent and star)
 * - "Nikolskaya Tower 2025.jpg", Юрий Д.К., CC BY 4.0 (the lower octagon's tracery)
 * - "Nikolskaya Tower 2025-3.jpg", Юрий Д.К., CC BY 4.0 (the gate front, from the east)
 */
import { Kit, rect, ngon, save, type XY } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  // The shaft behind, up to the square tier.
  const sh = rect(14.6, 15.8, 0, [0, -5.2])
  k.prism('brick', sh, 0, 24.5, true)
  k.band('white', sh, 23.6, 24.5, 0.12)
  k.openings(sh, 13.0, 15.0, { per: 3, w: 0.7, head: 'pointed', faces: [0, 1, 3], frame: 0.12 })
  k.openings(sh, 18.5, 20.5, { per: 3, w: 0.6, head: 'round', faces: [0, 1, 3] })
  // The gate front on Red Square (+y).
  const gf = rect(13.3, 11.4, 0, [0, 8.4])
  k.prism('brick', gf, 0, 21.0, false)
  k.band('white', gf, 19.9, 21.0, 0.12)
  k.skirt('green', rect(13.6, 11.7, 0, [0, 8.4]), 21.0, 21.8, 1.0)
  k.corners(gf, 0, 19.9, 0.7)
  k.openings(gf, 0, 7.0, { per: 1, w: 3.8, head: 'round', faces: [2], frame: 0.35 })
  k.openings(gf, 8.4, 16.6, { per: 1, w: 6.4, head: 'pointed', faces: [2], m: 'white', proud: 0.04 })
  k.openings(gf, 8.9, 15.8, { per: 1, w: 5.6, head: 'pointed', faces: [2], m: 'brick', proud: 0.07 })
  k.openings(gf, 10.0, 12.8, { per: 1, w: 1.6, head: 'flat', faces: [2], m: 'white', proud: 0.1 })
  k.openings(gf, 3.0, 12.0, { per: 2, w: 1.1, head: 'pointed', faces: [1, 3], m: 'white', proud: 0.04 })
  for (const [x, y] of [[-6.9, 2.7], [6.9, 2.7], [-6.9, 14.1], [6.9, 14.1]] as XY[]) k.pinnacle([x, y], 19.9, 21.2, 23.6, 0.45, { spire: 'white', ball: true })
  // The square tier with its lancets and tall corner pinnacles.
  const c: XY = [-0.15, -2.75]
  const sq = rect(9.0, 9.0, 0, c)
  k.prism('brick', sq, 24.5, 32.4, true)
  k.openings(sq, 25.4, 30.6, { per: 2, w: 1.0, head: 'pointed', frame: 0.16 })
  k.band('white', sq, 31.6, 32.4, 0.2)
  for (const [x, y] of [[-4.75, -7.4], [4.45, -7.4], [4.45, 1.9], [-4.75, 1.9]] as XY[]) k.pinnacle([x, y], 24.5, 32.6, 36.4, 0.55, { spire: 'white', ball: true })
  // Two octagons with white tracery.
  const o1 = ngon(8, 3.45, c), o2 = ngon(8, 3.05, c)
  k.prism('brick', o1, 32.4, 40.6, false)
  k.corners(o1, 32.6, 40.6, 0.3)
  k.openings(o1, 33.2, 37.0, { per: 1, w: 1.2, head: 'pointed', frame: 0.16 })
  k.band('white', o1, 37.6, 38.4, 0.12)
  k.openings(o1, 38.6, 40.0, { per: 2, w: 0.45, head: 'pointed', m: 'white' })
  k.band('white', o1, 40.2, 40.6, 0.22)
  k.prism('brick', o2, 40.6, 48.2, false)
  k.corners(o2, 40.8, 48.2, 0.28)
  k.openings(o2, 41.4, 46.6, { per: 1, w: 1.1, head: 'pointed', frame: 0.16 })
  k.band('white', o2, 47.2, 48.2, 0.2)
  // The tent and the star.
  k.tent('green', ngon(8, 2.85, c), 48.2, 67.0)
  k.star(c, 67.0 + 2.05 * 1.75, 4.1)
  return k
}

if (import.meta.main) await save('moscow-kremlin-nikolskaya-tower', 'Nikolskaya Tower', build(), 6500)
