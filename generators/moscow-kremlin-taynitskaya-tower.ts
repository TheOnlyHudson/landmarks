/**
 * Taynitskaya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-taynitskaya-tower.ts
 *
 * The Taynitskaya (Secret) Tower, the first tower of the Kremlin, built 1485
 * over a secret well and passage to the river and rebuilt in 1771-1773: a
 * broad brick shaft with the walled-up river gate under a corbel and
 * swallowtail merlons, an upper tier with three arched windows a face, a
 * squat truncated green tent with dormers, a lookout with three arches a
 * face, a tall green tent with dormers and a gilt vane.
 *
 * Heights. Published: 38.4 m (Wikipedia; OSM height=38.4). OSM
 * building:parts (API map call, 2026-11-18): shaft 0-10 m (19.2 x 15.2 m),
 * corbel to 10.5 m and parapet to 11.5 m (20.4 x 16.4 m), upper tier
 * 10.5-16.5 m (14.3 x 11.5 m), the lower hips 16.5-24.4 m, the central tent
 * 16.5-38.5 m. The lookout's height (24.4-29 m) and size, the windows, the
 * gate, the dormers and the merlons are read off the photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -15.6 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/3229147; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Taynitskaya Tower - Moscow Kremlin.jpg", Ed Yourdon, CC BY-SA 2.0 (from the south, across the river)
 * - "Taynitskaya Tower-1.jpg", Presidential Press and Information Office, CC BY 4.0 (from inside, north-west)
 * - "Moscow - 2025 - Taynitskaya Tower, Archangel Cathedral, and Ivan the Great Bell Tower.jpg", Юрий Д.К., CC BY 4.0 (from the south)
 * - "Moscow Taynitskaya tower U69.jpg", Ludvig14, CC BY-SA 3.0 (from the west, along the wall)
 * - "Moscow Taynitskaya tower V32.jpg", Ludvig14, CC BY-SA 3.0 (from the south)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  const shaft = rect(19.2, 15.2)
  tentTower(k, {
    shaft, shaftTop: 10,
    slits: [{ z0: 6.5, z1: 8.0, per: 4, w: 0.55, faces: [0, 2] }, { z0: 6.5, z1: 8.0, per: 3, w: 0.55, faces: [1, 3] }],
    corbel: { h: 1.0, out: 0.4, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.95, h: 1.65, pitch: 1.55, t: 0.5 } },
    tier: { plan: rect(14.3, 11.5), z0: 11, z1: 16.5, windows: { z0: 13.2, z1: 15.4, per: 3, w: 1.0 } },
    tent: { plan: rect(14.3, 11.5), z0: 16.5, z1: 24.4, top: rect(7.0, 5.6), eave: 0.4, dormers: [{ t: 0.35, per: 3, w: 0.95, h: 1.1 }] },
    lookout: { plan: rect(7.0, 5.6), z1: 29, arches: { per: 2, w: 0.85, z0: 25.4, z1: 28.0 } },
    cap: { plan: rect(7.0, 5.6), z0: 29, z1: 37.4, dormers: { t: 0.25, per: 1, w: 0.75, h: 0.9 } },
    top: { vane: 1.6 },
  })
  // The walled-up river gate: a broad arch with a pale surround on the river face (-y).
  k.openings(shaft, 0, 5.2, { per: 1, w: 4.2, head: 'round', faces: [0], frame: 0.35 })
  return k
}

if (import.meta.main) await save('moscow-kremlin-taynitskaya-tower', "Taynitskaya Tower", build(), 5000)
