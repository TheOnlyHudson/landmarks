/**
 * Senate Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-senate-tower.ts
 *
 * The Senate Tower (Senatskaya), on the Red Square wall behind the Lenin
 * Mausoleum, built 1491 and given its tent in 1680: a brick shaft under a
 * corbel and swallowtail merlons, a short upper tier with arched windows, a
 * tall truncated green tent with two dormers a face, a lookout with two
 * arches a face, a green tent and a gilt vane.
 *
 * Heights. Published: 34.3 m (Wikipedia; OSM height=34). OSM
 * building:parts (API map call, 2026-11-18): shaft 0-16 m (9.8 x 8.4 m),
 * tiers 16-20 m (6.1 x 5.3 m), 20-23 m and 23-30 m (3 m square), and a
 * vane 30-34 m. OSM's tiers are boxes; the photos show a tent from about
 * 20 m to 27 m, the lookout to 30.4 m and the top tent to 33 m.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * 42.5 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1359374; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Senatskaya Tower 2025-8.jpg", Юрий Д.К., CC BY 4.0
 * - "Senatskaya Tower in 2026 2.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow - 2026 - Senatskaya Tower, viewed from Vasilyevsky Descent.jpg", Юрий Д.К., CC BY 4.0
 * - "Senatskaya Tower and Kremlin Senate in 2026.jpg", Юрий Д.К., CC BY 4.0 (all from Red Square, east)
 * - "Russia-2007-Moscow-Kremlin Senate at night.jpg", Godot13, CC BY-SA 4.0 (night)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  tentTower(k, {
    shaft: rect(9.8, 8.4), shaftTop: 16,
    slits: [{ z0: 9, z1: 10.6, per: 1, w: 0.55 }],
    corbel: { h: 1.0, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(6.1, 5.3), z0: 17, z1: 20.4, windows: { z0: 18.2, z1: 19.8, per: 1, w: 0.9 } },
    tent: { plan: rect(6.1, 5.3), z0: 20.4, z1: 27.0, top: rect(3.0, 2.9), eave: 0.35, dormers: [{ t: 0.3, per: 2, w: 0.7, h: 0.9 }] },
    lookout: { plan: rect(3.0, 2.9), z1: 30.4, arches: { per: 2, w: 0.55, z0: 27.8, z1: 29.6 } },
    cap: { plan: rect(3.0, 2.9), z0: 30.4, z1: 33.2 },
    top: { vane: 1.2 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-senate-tower', "Senate Tower", build(), 5000)
