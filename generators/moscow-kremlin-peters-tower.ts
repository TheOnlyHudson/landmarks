/**
 * Peter's Tower (Petrovskaya), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-peters-tower.ts
 *
 * A small square tower on the river wall between the Second Unnamed and the
 * Beklemishevskaya towers, rebuilt in 1771-1783 and again after 1812: a
 * brick shaft to the wall walk under a corbelled parapet of loopholes,
 * a square upper tier with a small pediment on each face under a
 * green skirt roof, a second, smaller tier with one window a side, and a
 * green tiled tent with a gilt vane.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing -1.5
 * so the faces run along the axes; the river (outer) face is -y. Anchor at
 * the centroid of OSM relation/1360660.
 *
 * Heights. Published: 27.15 m to the vane (Wikipedia, "Petrovskaya Tower";
 * OSM height=27.15). OSM building:parts (fetched 2026-11-18 with the API's
 * map call) give the tiers: shaft 0-11 m (8.8 x 10.9 m), corbel 11-12 m,
 * parapet 12-13.3 m (9.6 x 11.8 m), first upper tier 12-16.5 m (6.5 m
 * square), skirt roof 16.5-18 m, second tier 16.5-19.5 m (5.9 m), skirt
 * 19.5-21 m, tent to 27.15 m. The tent is as tall as it is wide in the
 * photos, so its apex is set at 26.9 m with the vane above it to 28.3 m,
 * a little over the published height, which seems to be to the tent's top.
 *
 * Estimated from the photos: the pediments' size, the windows (one round-
 * headed window a face in the second tier, a small one in the first, loopholes in the shaft), the parapet's loopholes. The parapet has no
 * merlons: photos from the river and from inside both show a plain one.
 *
 * Photos (Wikimedia Commons):
 * - "Petrovskaya Tower of Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0
 *   (from inside, the north-east)
 * - "Moscow - 2025 - Petrovskaya Tower, view from the Sofiyskaya Embankment.jpg",
 *   Юрий Д.К., CC BY 4.0 (from the south, across the river)
 * - "Moscow - 2026-2 - Petrovskaya Tower, view from below.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow - 2025 - Petrovskaya Tower.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow Kremlin, Petrovskaya Tower, Nov 2025 06.jpg", Retired electrician, CC0
 */
import { Kit, rect, grow, save } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, 0], { tent: 'bright' })
  const shaft = rect(8.8, 10.9)
  k.prism('brick', shaft, 0, 11, false)
  // Loopholes and a blind niche down the river face, slits on the sides.
  k.openings(shaft, 3.5, 5.2, { per: 1, w: 0.7, head: 'round', faces: [0, 2] })
  k.openings(shaft, 7.2, 8.6, { per: 2, w: 0.5, head: 'round', faces: [0, 2] })
  k.openings(shaft, 7.2, 8.6, { per: 2, w: 0.5, head: 'round', faces: [1, 3] })
  k.band('white', shaft, 10.6, 10.85, 0.08)
  // Corbelled parapet, merlons round it.
  k.flare('brick', shaft, 11, 11.6, 12, 0.42)
  const par = grow(shaft, 0.42)
  k.openings(par, 11.65, 11.95, { pitch: 0.9, w: 0.42, head: 'flat', minEdge: 2 })
  // A solid parapet with small square loopholes, no merlons (photos from both sides).
  k.prism('brick', par, 12, 13.3)
  k.band('white', par, 13.15, 13.3, 0.06)
  k.openings(par, 12.4, 12.9, { pitch: 1.6, w: 0.45, head: 'flat', minEdge: 2 })
  // First upper tier: pediment over a small window on each face.
  const t1 = rect(6.5, 6.5)
  k.prism('brick', t1, 12, 16.5, false)
  k.corners(t1, 12, 16.5, 0.45)
  k.openings(t1, 13.4, 14.6, { per: 1, w: 0.75, head: 'round', frame: 0.15 })
  for (const [i, e] of [[0, [1, 0]], [1, [0, 1]], [2, [-1, 0]], [3, [0, -1]]] as const) {
    const n: [number, number] = [e[1], -e[0]]
    const c: [number, number] = [n[0] * 3.25, n[1] * 3.25]
    void i
    k.pediment(c, e as [number, number], 14.95, 2.6, 0.9)
  }
  k.band('white', t1, 16.15, 16.5, 0.18)
  k.skirt('green', grow(t1, 0.35), 16.5, 17.7, 0.75)
  // Second tier: one window a face.
  const t2 = rect(5.6, 5.6)
  k.prism('brick', t2, 17.5, 20.6, false)
  k.corners(t2, 17.5, 20.6, 0.4)
  k.openings(t2, 18.1, 19.8, { per: 1, w: 0.95, head: 'flat', frame: 0.18 })
  k.band('white', t2, 20.3, 20.6, 0.2)
  k.skirt('green', grow(t2, 0.35), 20.6, 21.0, 0.3)
  // The tent, and its vane.
  k.tent('green', grow(t2, -0.05), 21.0, 26.9)
  k.vane([0, 0], 26.7, 1.6)
  return k
}

if (import.meta.main) await save('moscow-kremlin-peters-tower', "Peter's Tower", build(), 5000)
