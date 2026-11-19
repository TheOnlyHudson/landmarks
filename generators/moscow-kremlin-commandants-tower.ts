/**
 * Commandant's Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-commandants-tower.ts
 *
 * The Commandant's Tower (Komendantskaya), on the Alexander Garden wall
 * between the Middle Arsenal and the Armoury towers, built 1493-1495 and
 * given its tent in 1676-1686: a tall brick shaft under a corbel and
 * swallowtail merlons, a short upper tier with arched windows, a tall
 * truncated green tent with two dormers a face, a lookout with two arches a
 * face, a green tent and a gilt vane.
 *
 * Heights. Published: 41.25 m (Wikipedia; OSM height=41.25). OSM
 * building:parts (API map call, 2026-11-18): shaft 0-22.5 m (6.9 x 10.0 m;
 * the wall's gabled stub beside it is the wall's), machicolation 22.5-26 m
 * (6.5 x 9.2 m), upper tier 26-30 m (6.0 x 8.7 m), tent 30-41 m. OSM's
 * tiers are boxes; the photos show the upper tier starting just above the
 * merlons (23.7 m) and the tent, lookout and top tent above it, whose
 * heights are read off the photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * 21.9 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1360655; the shaft's axis is offset [0.95, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Moscow. Commandant's Tower.jpg", Юрий Д.К., CC BY 4.0 (from the Alexander Garden, west)
 * - "Komendantskaya Tower, Kremlin, Moscow (2130741).jpg", Willem V, CC0 (from below, west)
 * - "Moscow - 2026 - Сommandant tower at overcast sky backdrop.jpg" and "...backdrop1.jpg", Юрий Д.К., CC BY 4.0 (from the west)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0.95, 0])
  tentTower(k, {
    shaft: rect(6.9, 10.0), shaftTop: 22.5,
    slits: [{ z0: 15, z1: 16.6, per: 1, w: 0.55 }, { z0: 7, z1: 8.6, per: 1, w: 0.55 }],
    corbel: { h: 1.1, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(6.0, 8.7), z0: 23.6, z1: 27.2, windows: { z0: 25.0, z1: 26.6, per: 2, w: 0.7 } },
    tent: { plan: rect(6.0, 8.7), z0: 27.2, z1: 33.8, top: rect(3.5, 4.6), eave: 0.35, dormers: [{ t: 0.3, per: 2, w: 0.8, h: 1.0 }] },
    lookout: { plan: rect(3.5, 4.6), z1: 37.2, arches: { per: 2, w: 0.75, z0: 34.6, z1: 36.5 } },
    cap: { plan: rect(3.5, 4.6), z0: 37.2, z1: 40.2 },
    top: { vane: 1.1 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-commandants-tower', "Commandant's Tower", build(), 5000)
