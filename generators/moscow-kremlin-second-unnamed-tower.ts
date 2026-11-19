/**
 * Second Unnamed Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-second-unnamed-tower.ts
 *
 * A small square tower on the river wall between the First Unnamed and
 * Peter's towers, rebuilt in the 1770s-1780s: a brick shaft under a corbel
 * and swallowtail merlons, a small upper tier, a truncated green tent with a
 * dormer a face, a lookout with two arches a face, a small green tent and a
 * gilt vane.
 *
 * Heights. Published: 30.2 m (Wikipedia; OSM height=30.2). OSM
 * building:parts (API map call, 2026-11-18): shaft 0-11 m (9.4 x 8.4 m),
 * parapet to 13 m, upper tier 11.5-15 m (5.9 m square), hips 15-23 m, the
 * lookout 16-26.5 m (3.7 m square), its roof 26.5-28 m and the top tent to
 * 30.5 m. The tent's dormers, the windows and the merlons are read off the
 * photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -7.6 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/3229567; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Moscow Kremlin, 2nd Unnamed Tower, July 2025 01.jpg", Retired electrician, CC0 (from the south-east)
 * - "Moscow Kremlin, 2nd Unnamed Tower, July 2025 02.jpg", Retired electrician, CC0 (from the south)
 * - "Moscow Kremlin Towers of south wall.jpg", Dmitry Ivanov., CC BY-SA 4.0 (from the south)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  tentTower(k, {
    shaft: rect(9.4, 8.4), shaftTop: 11,
    slits: [{ z0: 5, z1: 6.4, per: 1, w: 0.55 }],
    corbel: { h: 1.0, out: 0.3, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(6.0, 6.0), z0: 12, z1: 15, windows: { z0: 13.0, z1: 14.5, per: 1, w: 0.8 } },
    tent: { plan: rect(6.0, 6.0), z0: 15, z1: 22.8, top: rect(3.4, 3.4), eave: 0.35, dormers: [{ t: 0.3, per: 1, w: 0.9, h: 1.0 }] },
    lookout: { plan: rect(3.4, 3.4), z1: 26.4, arches: { per: 2, w: 0.65, z0: 23.6, z1: 25.6 } },
    cap: { plan: rect(3.4, 3.4), z0: 26.4, z1: 29.4 },
    top: { vane: 1.2 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-second-unnamed-tower', "Second Unnamed Tower", build(), 5000)
