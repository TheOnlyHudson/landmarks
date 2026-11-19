/**
 * Armoury Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-armoury-tower.ts
 *
 * The Armoury Tower (Oruzheynaya), on the Alexander Garden wall north of
 * the Borovitskaya Tower, built 1493-1495 and given its tent in 1676-1686: a
 * brick shaft under a corbel and swallowtail merlons, a short upper tier, a
 * truncated green tent with two dormers a face, a lookout with two arches a
 * face, a green tent and a gilt vane.
 *
 * Heights. Published: 32.65 m (Wikipedia; OSM height=32.65). OSM
 * building:parts (API map call, 2026-11-18): shaft 0-18.5 m (10.0 x
 * 10.2 m), upper tier 18.5-23.5 m (5.8 m square), hips 23.5-27.8 m, lookout
 * roof 27.8-32.8 m. The lookout's height and the split between it and the
 * top tent are read off the photos, as are the windows and dormers.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * 15.5 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1360631; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Kremlin Oruzheynaya Tower.jpg", Stan Shebs, CC BY-SA 3.0 (from the Alexander Garden, west)
 * - "Oruzheynaya Tower-1.jpg", Presidential Press and Information Office, CC BY 4.0
 * - "Oruzheynaya and Borovitskaya Towers, Kremlin, Moscow.jpg", Ivnas2011, CC BY-SA 3.0 (from the west)
 * - "Moscow 05-2012 Kremlin 03.jpg", A.Savin, CC BY-SA 3.0
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  tentTower(k, {
    shaft: rect(10.0, 10.2), shaftTop: 18.5,
    slits: [{ z0: 12, z1: 13.6, per: 1, w: 0.55 }, { z0: 5, z1: 6.6, per: 1, w: 0.55 }],
    corbel: { h: 1.0, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(5.8, 5.8), z0: 19.5, z1: 22.8, windows: { z0: 20.6, z1: 22.1, per: 1, w: 0.8 } },
    tent: { plan: rect(5.8, 5.8), z0: 22.8, z1: 27.6, top: rect(3.3, 3.3), eave: 0.35, dormers: [{ t: 0.3, per: 2, w: 0.7, h: 0.9 }] },
    lookout: { plan: rect(3.3, 3.3), z1: 30.0, arches: { per: 2, w: 0.6, z0: 28.2, z1: 29.5 } },
    cap: { plan: rect(3.3, 3.3), z0: 30.0, z1: 32.0 },
    top: { vane: 1.1 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-armoury-tower', "Armoury Tower", build(), 5000)
