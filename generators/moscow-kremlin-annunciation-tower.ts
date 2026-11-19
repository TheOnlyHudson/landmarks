/**
 * Annunciation Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-annunciation-tower.ts
 *
 * The Annunciation Tower (Blagoveshchenskaya), on the river wall east of
 * the Vodovzvodnaya Tower, built 1487-1488 and given its tent in the 1730s: a
 * brick shaft under a corbel and swallowtail merlons, an upper tier with
 * three arched windows a face, a truncated green tent with dormers, a
 * lookout with two arches a face, a small green tent and a gilt vane.
 *
 * Heights. Published: 30.7 m, 32.45 m with the vane (Wikipedia, "Kremlin
 * towers"; OSM height=30.7). OSM building:parts (API map call, 2026-11-18):
 * shaft 0-10 m (10.7 x 9.1 m), corbel 10-10.5 m, parapet to 11.5 m, upper
 * tier 10.5-15 m (8.4 x 6.7 m), hips 15-21 m, lookout and top tent 15-30 m.
 * The lookout's size (about half the tier's width) and height, the windows
 * and the dormers are read off the photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -31.9 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/3229300; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "0007Ga. Blagoveshchenskaya Tower of Moscow Kremlin.jpg", Александровы АГ, CC BY-SA 4.0 (from the south)
 * - "Moscow Kremlin Towers of south wall.jpg", Dmitry Ivanov., CC BY-SA 4.0 (from the south)
 * - "Moscow - 2025 - General view of the Kremlin embankment1.jpg", Юрий Д.К., CC BY 4.0 (from the south)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  tentTower(k, {
    shaft: rect(10.7, 9.1), shaftTop: 10,
    slits: [{ z0: 4.5, z1: 6.0, per: 2, w: 0.55 }],
    corbel: { h: 0.9, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(8.4, 6.7), z0: 11, z1: 15, windows: { z0: 12.4, z1: 14.3, per: 3, w: 0.8 } },
    tent: { plan: rect(8.4, 6.7), z0: 15, z1: 21.4, top: rect(4.4, 3.6), eave: 0.35, dormers: [{ t: 0.3, per: 2, w: 0.8, h: 0.95 }] },
    lookout: { plan: rect(4.4, 3.6), z1: 25.2, arches: { per: 2, w: 0.75, z0: 22.4, z1: 24.4 } },
    cap: { plan: rect(4.4, 3.6), z0: 25.2, z1: 30.2 },
    top: { vane: 2.0 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-annunciation-tower', "Annunciation Tower", build(), 5000)
