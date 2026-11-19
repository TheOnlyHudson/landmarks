/**
 * Borovitskaya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-borovitskaya-tower.ts
 *
 * The Kremlin's working gate tower on its south-west side, over
 * Borovitskaya Square, built 1490 and stepped up into its pyramid of tiers
 * in 1666-1680, crowned with a ruby star since 1937. Its identifying
 * features, each in the photos below:
 * - the broad gate block, its passage running through it under a deep arch
 *   on the square's side;
 * - three square tiers stepping in one over another, each under a white
 *   cornice, then an open octagon;
 * - the green tent with a crown of small gables at its foot and a ring of
 *   dormers, a small octagonal lookout, the spire and the ruby star.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -30.1 so the tiers' faces run along the axes; the gate passage runs
 * along x, the square is on -x. Anchor at the centroid of OSM
 * relation/1360630; the tiers' axis is 1.35 m to -y of it.
 *
 * Heights. Published: 54.05 m with the star (Wikipedia, "Borovitskaya
 * Tower"; OSM height=54); the star spans 3.2 m. OSM building:parts (API
 * map call, 2026-11-18): gate block 0-15.5 m (13.6 x 19.4 m, the passage
 * part from 7 m), cornice to 16.5 m, first tier 15.5-21 m (9.3 x 10.7 m),
 * 21-21.5 m cornice, second tier 21-25 m (7.0 x 8.4 m), third tier 25-30 m
 * (6.0 x 7.5 m), octagon 30-35.5 m (5.7 m), its gables 35-38 m, tent 35-52
 * m (4.9 m). The lookout (44.6-47.2 m) and the spire (to 50.6 m) are set
 * from the photos; the star is drawn 3.5 m across, a tenth over real.
 *
 * Estimated from the photos: the gate arch (6 m wide, 8.5 m high), the
 * windows, the dormers and the foot's gables.
 *
 * Photos (Wikimedia Commons):
 * - "Moscow - 6-2026 - Borovitskaya Tower, Borovitskaya Street.jpg", Юрий Д.К., CC BY 4.0 (from the west)
 * - "Borovitskaya tower from Sofia embankment 2025-9.jpg", Юрий Д.К., CC BY 4.0 (from the south)
 * - "Borovitskaya Tower - 2026.jpg", Юрий Д.К., CC BY 4.0 (the top)
 * - "\"Borovitskaya Tower\".jpg", Lesless, CC BY-SA 4.0 (from inside, the north-east)
 * - "Borovitskaya Tower-3.jpg", Presidential Press and Information Office, CC BY 4.0
 * - "Moscow Kremlin - Borovitskaya Tower, Armoury building.jpg", Sergey Norin, CC BY 2.0 (from inside)
 */
import { Kit, rect, ngon, save, type XY } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([-0.05, -1.35], { tent: 'bright' })
  // The gate block (in the tiers' frame: OSM's x -7.2..6.4, y -9.1..10.3).
  const base = rect(13.6, 19.4, 0, [-0.35, 1.35 + 0.6])
  k.prism('brick', base, 0, 15.5, false)
  k.corners(base, 0.5, 15.5, 0.6)
  k.band('white', base, 15.1, 15.5, 0.15)
  k.prism('brick', rect(13.9, 19.7, 0, [-0.35, 1.95]), 15.5, 16.3)
  k.openings(base, 9.0, 11.2, { per: 2, w: 0.9, head: 'round', faces: [0, 2], frame: 0.15 })
  // The passage, through the block along x under the tiers, a deep arch each side (photos from both sides show it centred under the tiers).
  const gy = 0.6
  k.panel([-7.15 - 0.03, gy], [0, -1], 0, 8.5, 6.0, 'round', 'white', 0.06)
  k.panel([-7.15 - 0.03, gy], [0, -1], 0, 7.8, 4.8, 'round', 'dark', 0.1)
  k.panel([6.45 + 0.03, gy], [0, 1], 0, 7.4, 4.6, 'round', 'dark', 0.1)
  // Three tiers stepping in.
  const tiers: [number, number, number, number][] = [[9.3, 10.7, 16.3, 21.0], [7.0, 8.4, 21.0, 25.0], [6.0, 7.5, 25.0, 30.0]]
  tiers.forEach(([w, d, z0, z1], i) => {
    const p = rect(w, d)
    k.prism('brick', p, z0, z1, true)
    k.corners(p, z0 + 0.3, z1, 0.4)
    k.openings(p, z0 + 1.2, z1 - 1.2, { per: i === 0 ? 2 : 1, w: 0.75, head: 'round', frame: 0.15 })
    k.band('white', p, z1 - 0.4, z1, 0.22)
  })
  // The octagon, open in arches, and the gables round the tent's foot.
  const oc = ngon(8, 2.85)
  k.prism('brick', oc, 30.0, 35.4, false)
  k.corners(oc, 30.2, 35.4, 0.3)
  k.openings(oc, 31.0, 34.2, { per: 1, w: 1.1, head: 'round', frame: 0.15 })
  k.band('white', oc, 35.05, 35.4, 0.15)
  const tb = ngon(8, 2.75), tt = ngon(8, 1.15)
  k.dormers(tb, 35.4, 44.8, { t: 0.0, per: 1, w: 1.5, h: 0.45, top: tt })
  k.loft('green', [{ plan: tb, z: 35.4 }, { plan: tt, z: 44.8 }])
  k.dormers(tb, 35.4, 44.8, { t: 0.42, per: 1, w: 0.7, h: 1.3, top: tt, faces: [0, 2, 4, 6] })
  // The lookout, spire and star.
  const lk = ngon(8, 1.05)
  k.prism('brick', lk, 44.6, 47.2, false)
  k.openings(lk, 45.2, 46.6, { per: 1, w: 0.4, head: 'round' })
  k.band('white', lk, 46.9, 47.2, 0.12)
  k.tent('green', ngon(8, 1.15), 47.2, 50.6)
  const c: XY = [0, 0]
  k.star(c, 50.6 + 1.75 * 1.75, 3.5)
  return k
}

if (import.meta.main) await save('moscow-kremlin-borovitskaya-tower', 'Borovitskaya Tower', build(), 5000)
