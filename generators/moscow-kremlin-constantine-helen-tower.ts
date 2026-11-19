/**
 * Constantine and Helen Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-constantine-helen-tower.ts
 *
 * The Constantine and Helen Tower (Konstantino-Eleninskaya), over
 * Vasilyevsky Spusk, built 1490 as a gate tower whose barbican was pulled
 * down in the 18th century: a broad brick shaft with the blind arch of the
 * old gate on its outer face, a deep corbelled machicolation with a pierced
 * parapet, a short upper tier, a truncated green tent with three dormers a
 * face, a lookout with three arches a face under a skirt, a green tent and a
 * gilt vane.
 *
 * Heights. Published: 36.8 m (Wikipedia; OSM height=36.8). OSM
 * building:parts (API map call, 2026-11-18): shaft 0-12.5 m (15.0 x 15.4 m),
 * machicolation 12.5-14.5 m, parapet to 15.5 m, upper tier 14.5-18 m
 * (12.9 x 13.5 m), hips 18-26.5 m, lookout skirt 26.5-27 m and roof
 * 30.5-32 m, tent to 37 m. The lookout's size, the windows, the gate arch
 * and the dormers are read off the photos.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * -24.0 so the tower's faces run along the axes. Anchor at the
 * centroid of OSM relation/1360645; the shaft's axis is offset [0, 0] from it.
 * Built with tentTower() in moscow-kremlin-towers-kit.ts.
 *
 * Photos (Wikimedia Commons, file pages under
 * https://commons.wikimedia.org/wiki/File:<title>):
 * - "Konstantino-Eleninskaya Tower - view from Vasilyevsky descent - Moscow" (five photos, 2025), Юрий Д.К., CC BY 4.0 (from the east and south-east)
 */
import { Kit, rect, tentTower, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0])
  const shaft = rect(15.0, 15.4)
  tentTower(k, {
    shaft, shaftTop: 12.5,
    slits: [{ z0: 7.5, z1: 9.0, per: 2, w: 0.6, faces: [0, 2, 3] }],
    corbel: { h: 2.0, out: 0.45, slots: 0.8 },
    parapet: { h: 1.0, loopholes: true },
    tier: { plan: rect(12.9, 13.5), z0: 15.5, z1: 18, windows: { z0: 16.2, z1: 17.4, per: 4, w: 0.6, head: 'flat' } },
    tent: { plan: rect(12.9, 13.5), z0: 18, z1: 26.5, top: rect(6.0, 6.6), eave: 0.4, dormers: [{ t: 0.3, per: 3, w: 0.9, h: 1.1 }] },
    lookout: { plan: rect(6.0, 6.6), z1: 30.6, arches: { per: 3, w: 0.8, z0: 27.6, z1: 29.8 } },
    cap: { plan: rect(6.0, 6.6), z0: 30.6, z1: 36.4, eave: 0.45 },
    top: { vane: 1.6 },
  })
  // The old gate on the outer (east, +x) face: a tall blind arch in a pale frame, the gate below it.
  k.openings(shaft, 0.6, 9.6, { per: 1, w: 5.0, head: 'round', faces: [1], m: 'brick', frame: 0.4, proud: 0.03 })
  k.openings(shaft, 0, 3.6, { per: 1, w: 3.0, head: 'round', faces: [1] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-constantine-helen-tower', "Constantine and Helen Tower", build(), 5000)
