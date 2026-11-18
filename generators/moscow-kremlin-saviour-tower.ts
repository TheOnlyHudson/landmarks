/**
 * Saviour Tower (Spasskaya), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-saviour-tower.ts
 *
 * The Kremlin's main gate tower on Red Square, built by Pietro Antonio
 * Solari in 1491, raised by Christopher Galloway in 1624-1625 with the
 * Gothic tiers, the clock and the tent, crowned with a ruby star since
 * 1937. Its identifying features, each in the photos below:
 * - the square brick shaft with three rows of small windows, under a white
 *   cornice;
 * - the white Gothic crown on the shaft: an arcade of pointed arches with a
 *   tall ogee gable in the middle of each face, big corner pinnacles and
 *   small ones between;
 * - the clock tier with the Kremlin chimes' four dials (6.12 m across,
 *   black with gilt rims and hands), a pinnacle at each corner;
 * - a red stage, the octagonal belfry open in white arches, the green tent
 *   and the ruby star;
 * - the barbican on the Red Square side, as high as the wall, with the gate
 *   and the icon over it and swallowtail merlons round its top.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing 42.6
 * so the faces run along the axes; Red Square (and the barbican) is +y.
 * Anchor at the centroid of OSM relation/1360656; the tower's axis is
 * 3.1 m to -y of it.
 *
 * Heights. Published: 71 m with the star (Wikipedia, "Spasskaya Tower";
 * OSM height=71); dials 6.12 m across (Wikipedia, "Kremlin Clock"); the
 * star spans 3.75 m. OSM building:parts (API map call, 2026-11-18): shaft
 * 0-28.5 m, the white platform 28.5-30 m (16.6 x 15 m), the Gothic stage
 * 28.5-35 m (8.8 m square) with corner pinnacles to 36.2 m and small ones
 * to 35 m, the clock tier 35-41 m (8 m) with pinnacles to 44 m, the
 * octagon 41-50 m (7.9 m), the tent 50-67 m (5.5 m), the star 65-71 m;
 * the barbican 0-14 m (11.1 x 9.4 m) with merlons to 16.5 m (OSM's small
 * pyramid roof on it, 14-17 m, is hidden by the merlons in every photo and
 * is left out). OSM's shaft outline (18 x 16.6 m) takes in the
 * wall's ends; the shaft is drawn the platform's size. The split above
 * 35 m follows the photos rather than OSM's boxes: clock tier 35-43 m
 * (dial centres at 39.2 m), red stage 43-47.5 m, belfry 47.5-53 m, tent
 * 53-67 m; the star is drawn 4.1 m across, a tenth over real.
 *
 * Estimated from the photos: every window, the arcade (three pointed
 * openings a face), the ogee gables (drawn as tall white pediments), the
 * pinnacles' sizes, the gate (4.2 m wide, 7.5 m high).
 *
 * Photos (Wikimedia Commons):
 * - "Moscow - 2025 - Spasskaya Tower.jpg", Юрий Д.К., CC BY 4.0 (from Red Square, north-east)
 * - "Spasskaya Tower - Red Square - Moscow4.jpg", Юрий Д.К., CC BY 4.0 (from the north)
 * - "The Spasskaya Tower, Moscow, Russia.jpg", Vyacheslav Argenberg, CC BY 4.0 (from the north, the barbican)
 * - "Spasskaya Tower.jpg", Sergey Rodovnichenko, CC BY-SA 2.0 (night)
 * - "Spasskaya Tower Kreml.jpg", Artur Random, CC BY-SA 4.0 (dusk, from Red Square)
 */
import { Kit, rect, ngon, grow, save, type XY } from './moscow-kremlin-towers-kit'

export function build() {
  const k = new Kit([0, -3.1], { tent: 'bright' })
  const sh = rect(16.0, 14.6)
  // The shaft: three rows of windows, a white cornice.
  k.prism('brick', sh, 0, 28.5, false)
  k.openings(sh, 16.5, 18.0, { per: 4, w: 0.7, head: 'round' })
  k.openings(sh, 21.5, 23.0, { per: 5, w: 0.65, head: 'round' })
  k.openings(sh, 25.4, 26.8, { per: 6, w: 0.6, head: 'round' })
  k.openings(sh, 10.5, 12.2, { per: 2, w: 0.7, head: 'round', faces: [0, 1, 3] })
  k.band('white', sh, 19.6, 19.85, 0.06)
  k.band('white', sh, 28.0, 28.5, 0.2)
  // The gate on the inner (-y) face.
  k.openings(sh, 0, 7.0, { per: 1, w: 4.0, head: 'round', faces: [0], frame: 0.4 })
  // The platform and its Gothic arcade.
  const pl = rect(16.6, 15.0)
  k.prism('white', pl, 28.5, 29.2)
  const ar = grow(pl, -0.5)
  k.prism('brick', ar, 29.2, 33.2, false)
  k.band('white', ar, 32.8, 33.3, 0.12)
  k.openings(ar, 30.0, 32.5, { per: 4, w: 1.5, head: 'pointed', frame: 0.16 })
  k.cap('brick', grow(ar, 0.12), 33.3)
  // Ogee gables, one in the middle of each face, and the pinnacles.
  const faces: [XY, XY][] = [[[0, -7.0], [1, 0]], [[7.8, 0], [0, 1]], [[0, 7.0], [-1, 0]], [[-7.8, 0], [0, -1]]]
  for (const [c, e] of faces) k.pediment(c, e, 33.2, 4.2, 4.6, 'white', 0.25)
  for (const [x, y] of [[-7.8, -7.0], [7.8, -7.0], [7.8, 7.0], [-7.8, 7.0]] as XY[]) k.pinnacle([x, y], 30.0, 34.2, 38.4, 0.75, { spire: 'white', ball: true })
  for (const [x, y] of [[-3.9, -7.0], [3.9, -7.0], [7.8, -3.5], [7.8, 3.5], [3.9, 7.0], [-3.9, 7.0], [-7.8, 3.5], [-7.8, -3.5]] as XY[]) k.pinnacle([x, y], 33.2, 34.4, 36.6, 0.35, { spire: 'white' })
  // The Gothic stage and the clock tier, a dial on each face.
  const ct = rect(8.8, 8.8)
  k.prism('brick', ct, 33.2, 43.0, false)
  k.corners(ct, 33.4, 43.0, 0.45)
  for (const [c, e] of [[[0, -4.4], [1, 0]], [[4.4, 0], [0, 1]], [[0, 4.4], [-1, 0]], [[-4.4, 0], [0, -1]]] as [XY, XY][]) k.dial(c, e, 39.2, 3.06)
  k.band('white', ct, 42.6, 43.0, 0.2)
  for (const [x, y] of [[-4.6, -4.6], [4.6, -4.6], [4.6, 4.6], [-4.6, 4.6]] as XY[]) k.pinnacle([x, y], 35.0, 40.4, 44.6, 0.45, { spire: 'white', ball: true })
  // The red stage over the clocks.
  const rs = rect(8.0, 8.0)
  k.prism('brick', rs, 43.0, 47.5, false)
  k.corners(rs, 43.2, 47.5, 0.4)
  k.openings(rs, 44.2, 46.4, { per: 2, w: 0.7, head: 'pointed', frame: 0.15 })
  k.band('white', rs, 47.1, 47.5, 0.25)
  // The belfry: an octagon open in white arches.
  const bf = ngon(8, 3.4)
  k.prism('white', bf, 47.5, 53.0, false)
  k.openings(bf, 48.2, 51.8, { per: 1, w: 1.6, head: 'round', m: 'dark' })
  k.band('white', bf, 52.6, 53.0, 0.25)
  for (const p of ngon(8, 3.55)) k.pinnacle(p, 52.6, 53.0, 54.8, 0.22, { spire: 'white' })
  // The tent and the star.
  k.tent('green', ngon(8, 2.8), 53.0, 67.0)
  k.dormers(ngon(8, 2.8), 53.0, 67.0, { t: 0.1, per: 1, w: 0.8, h: 0.8, faces: [0, 2, 4, 6] })
  k.star([0, 0], 67.0 + 2.05 * 1.75, 4.1)
  // The barbican on Red Square (+y), as high as the wall, the gate through it.
  const bb = rect(11.1, 9.4, 0, [-0.25, 12.3])
  k.prism('brick', bb, 0, 14.0, true)
  k.band('white', bb, 13.6, 13.9, 0.08)
  k.merlons(bb, 14.0, { w: 0.95, h: 2.0, pitch: 1.65, t: 0.5, skip: ([, y]) => y < 7.6 })
  k.corners(bb, 0, 5.0, 1.1)
  k.openings(bb, 0, 7.5, { per: 1, w: 4.2, head: 'round', faces: [2], frame: 0.5 })
  k.openings(bb, 8.8, 10.8, { per: 1, w: 1.5, head: 'flat', faces: [2], m: 'white' })
  k.openings(bb, 6.0, 7.2, { per: 2, w: 0.5, head: 'round', faces: [1, 3] })
  return k
}

if (import.meta.main) await save('moscow-kremlin-saviour-tower', 'Saviour Tower', build(), 6500)
