/**
 * First Unnamed Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-first-unnamed-tower.ts
 *
 * A square tower on the river wall east of the Taynitskaya Tower, rebuilt
 * in the 1770s-1780s: a brick shaft to the wall walk under a corbel and a
 * row of swallowtail merlons, a square upper tier with two arched windows a
 * face, a tall truncated green tent with two dormers a face, a lookout with
 * two arches a face, a small green tent and a gilt vane.
 *
 * Heights. Published: 34.15 m (Wikipedia, "Kremlin towers"; OSM
 * height=34.15). OSM building:parts (API map call, 2026-11-18): shaft
 * 0-10.5 m (11.2 x 12.0 m), corbel and parapet to 12 m, upper tier 11-16 m
 * (8.6 x 9.5 m), tent and lookout above to 34.5 m. The split between the
 * truncated tent (16-25.5 m, the hip parts' top), the lookout (to 29.5 m)
 * and the top tent is read off the photos, as are every window, the
 * dormers and the merlons (1.1 m wide, 2 m high).
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -14.8 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1360642; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Moscow Kremlin, 1st Unnamed Tower, July 2025 02.jpg", Retired electrician, CC0 (from the south-east, across the river)
 * - "Moscow - 2025 - General view of the Kremlin embankment1.jpg", Юрий Д.К., CC BY 4.0 (from the south)
 * - "Moscow Kremlin Towers of south wall.jpg", Dmitry Ivanov., CC BY-SA 4.0 (from the south)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  tentTower(k, {
    shaft: rect(11.2, 12.0), shaftTop: 10.5,
    slits: [{ z0: 4.5, z1: 6.0, per: 2, w: 0.55 }],
    corbel: { h: 1.2, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.6, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(8.6, 9.5), z0: 11.7, z1: 16, windows: { z0: 13.0, z1: 15.0, per: 2, w: 0.9 } },
    tent: { plan: rect(8.6, 9.5), z0: 16, z1: 25.5, top: rect(3.6, 4.2), eave: 0.35, dormers: [{ t: 0.3, per: 2, w: 0.85, h: 1.0 }] },
    lookout: { plan: rect(3.6, 4.2), z1: 29.4, arches: { per: 2, w: 0.75, z0: 26.4, z1: 28.6 } },
    cap: { plan: rect(3.6, 4.2), z0: 29.4, z1: 33.3 },
    top: { vane: 1.3 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-first-unnamed-tower', "First Unnamed Tower", build(), 5000)
