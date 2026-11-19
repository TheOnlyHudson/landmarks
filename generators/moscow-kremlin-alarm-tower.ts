/**
 * Alarm Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-alarm-tower.ts
 *
 * The Alarm Tower (Nabatnaya), on the Red Square wall between the Tsar's
 * and the Constantine and Helen towers, built 1495 and given its tent in
 * 1676-1686: a brick shaft under a corbel and swallowtail merlons, a short
 * upper tier, a truncated green tent with two dormers a face, a tall lookout
 * with two arches a face where the alarm bell hung, a green tent and a gilt
 * vane.
 *
 * Heights. Published: 38 m (Wikipedia; OSM height=38). OSM building:parts
 * (API map call, 2026-11-18): shaft 0-12 m (9.1 m square), corbel to
 * 12.5 m, parapet to 14 m (9.8 m), upper tier 12-17 m (6.4 m), hips
 * 17-23 m, lookout 16-26.5 m (2.8 m), its roof 26.5-28 m, top tent to
 * 30.5 m. OSM's tower stops 7.5 m short of the published height and its
 * lookout is narrower than the photos show (about 0.55 of the tier): the
 * lookout is drawn 3.6 m wide, to 29.6 m, and the top tent to 35.6 m, with
 * the vane to 38 m, from the photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -17.8 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1360661; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Nabatnaya Tower1.jpg", Юрий Д.К., CC BY 4.0
 * - "Nabatnaya Tower 2025.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow - 2025 - Nabatnaya ('Alarm') Tower.jpg", Юрий Д.К., CC BY 4.0
 * - "Nabatnaya Tower.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow. Nabatnaya Tower.jpg", Юрий Д.К., CC BY 4.0 (all from Red Square and Vasilyevsky Spusk, east)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  tentTower(k, {
    shaft: rect(9.1, 9.0), shaftTop: 12,
    slits: [{ z0: 6, z1: 7.5, per: 1, w: 0.55 }],
    corbel: { h: 0.9, out: 0.35, slots: 0.9 },
    parapet: { h: 2, merlons: { w: 0.9, h: 1.55, pitch: 1.5, t: 0.45 } },
    tier: { plan: rect(6.4, 6.4), z0: 12.9, z1: 17, windows: { z0: 14.6, z1: 16.2, per: 2, w: 0.65 } },
    tent: { plan: rect(6.4, 6.4), z0: 17, z1: 24.2, top: rect(3.6, 3.6), eave: 0.35, dormers: [{ t: 0.28, per: 2, w: 0.75, h: 1.0 }] },
    lookout: { plan: rect(3.6, 3.6), z1: 29.6, arches: { per: 2, w: 0.75, z0: 25.6, z1: 28.6 } },
    cap: { plan: rect(3.6, 3.6), z0: 29.6, z1: 35.6 },
    top: { vane: 2.4 },
  })
  return k
}

if (import.meta.main) await save('moscow-kremlin-alarm-tower', "Alarm Tower", build(), 5000)
