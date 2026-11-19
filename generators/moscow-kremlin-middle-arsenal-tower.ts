/**
 * Middle Arsenal Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-middle-arsenal-tower.ts
 *
 * The Middle Arsenal Tower (Srednyaya Arsenalnaya), on the Alexander Garden
 * wall behind the Grotto, built 1495 and given its tent in 1680: a brick
 * shaft under a corbel and swallowtail merlons, an upper tier with an arched
 * window a face in a pale frame, a dark green truncated tent with dormers, a
 * small lookout, a green tent and a gilt vane. The Grotto and the
 * Alexander Garden in front are not part of it.
 *
 * Heights. Published: 38.9 m (Wikipedia, "Kremlin towers"; OSM's
 * height=28.9 is a typo, its own parts reach 41.5 m and 44 m with the
 * vane). OSM building:parts (API map call, 2026-11-18): shaft 0-17 m (8.9 x
 * 10.1 m) with two buttresses on the wall side to 15 m, corbel 17-18.5 m,
 * parapet to 20 m, upper tier 20-24 m (6.9 x 8.2 m), hips 24-31 m, top tent
 * 31-41.5 m (3.9 x 5.3 m). The lookout (31-34.5 m) and the top tent to
 * 38 m are read off the photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * 20.3 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1360654; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Middle Arsenal Tower 1.jpg" and "Middle Arsenal Tower 2.jpg", Osazemen, CC BY-SA 4.0 (from the Alexander Garden, west)
 * - "Russia-Moscow-Kremlin-Middle Arsenal Tower-1.jpg" and "-2.jpg", Alex Zelenko, CC BY-SA 4.0 (west)
 * - "Russia-Moscow-Kremlin-Middle Arsenal Tower-3.jpg", public domain (night)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  tentTower(k, {
    shaft: rect(8.9, 10.1), shaftTop: 17,
    slits: [{ z0: 10, z1: 11.6, per: 1, w: 0.55 }],
    corbel: { h: 1.3, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(6.9, 8.2), z0: 18.3, z1: 24, windows: { z0: 20.4, z1: 22.8, per: 1, w: 1.2, frame: 0.3 } },
    tent: { plan: rect(6.9, 8.2), z0: 24, z1: 31, top: rect(3.6, 4.6), eave: 0.35, dormers: [{ t: 0.3, per: 1, w: 0.9, h: 1.1 }] },
    lookout: { plan: rect(3.6, 4.6), z1: 34.4, arches: { per: 1, w: 0.8, z0: 32.0, z1: 33.7 } },
    cap: { plan: rect(3.6, 4.6), z0: 34.4, z1: 38.0 },
    top: { vane: 1.0 },
  })
  // Buttresses where the wall meets the tower, on the inner (+x) side.
  k.prism('brick', rect(2.5, 3.0, 0, [3.15, -6.6]), 0, 15)
  k.prism('brick', rect(2.5, 2.9, 0, [3.15, 6.55]), 0, 15)
  return k
}

if (import.meta.main) await save('moscow-kremlin-middle-arsenal-tower', "Middle Arsenal Tower", build(), 5000)
