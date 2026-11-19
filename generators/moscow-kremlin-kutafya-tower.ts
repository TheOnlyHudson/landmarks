/**
 * Kutafya Tower, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-kutafya-tower.ts
 *
 * The bridgehead barbican in front of the Trinity Tower, at the west end
 * of the Trinity Bridge, built in 1516 and given its openwork crown in
 * 1685; the only one of the Kremlin's outer barbicans left. Its
 * identifying features, each in the photos below:
 * - the low, D-shaped whitewashed body, round towards Manezhnaya Street
 *   and flat towards the bridge;
 * - a band of red corbel arches under the crown;
 * - the openwork crown: red piers between broad white-framed openings,
 *   under a white comb of small merlons;
 * - the gate porch on the street side, with its deep white arch.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing 15.0
 * so the flat (bridge) side faces +x. Anchor at the centroid of OSM
 * relation/3061015, whose outline (23 x 15.5 m, the porch included) is
 * drawn as mapped.
 *
 * Heights. Published: 13.5 m (Wikipedia, "Kutafya Tower"; OSM
 * height=13.5); OSM maps the whole tower as one part (relation/408550,
 * white). From the photos against that height: the white body to 7.6 m,
 * the corbel band 7.6-9.0 m, the crown 9.0-12.9 m (a white balustrade
 * to 9.9 m) with the comb to 13.5 m,
 * the porch to 8.8 m under a green roof, its arch 4.6 m wide and 6.4 m
 * high.
 *
 * Photos (Wikimedia Commons):
 * - "Kremlin Kutafya and Troitskaya Towers.jpg", Stan Shebs, CC BY-SA 3.0 (from the west)
 * - "Moscow - Kutafya Tower, view from Sapozhkovskaya Square.jpg", Юрий Д.К., CC BY 4.0 (from the west)
 * - "Moscow - 6-2026 - Kutafya Tower.jpg", Юрий Д.К., CC BY 4.0 (from the south-west)
 * - "Kutafya Tower-1.jpg", Presidential Press and Information Office, CC BY 4.0 (from the north-west)
 * - "Moscow - Kutafya and Troitskaya towers, view from Sapozhkovskaya Square.jpg", Юрий Д.К., CC BY 4.0
 * - "Troitsky bridge (Kremlin, 2020) by shakko 02.jpg", shakko, CC BY-SA 4.0 (the bridge side, from the east)
 */
import { Kit, grow, save, type Plan } from './moscow-kremlin-towers-kit'

/** OSM relation/3061015 in this frame, without the porch (x < -12.4). */
const BODY: Plan = [[8.52, -7.63], [-0.09, -7.48], [-5.61, -7.38], [-6.59, -7.37], [-8.29, -7.13], [-10.07, -6.38], [-11.49, -5.28], [-12.45, -3.9], [-12.9, -1.9], [-12.95, 0.14], [-12.9, 2.2], [-12.53, 4.23], [-11.44, 5.58], [-9.99, 6.67], [-7.88, 7.52], [-5.6, 7.94], [-0.23, 7.94], [8.61, 7.94]]
const PORCH: Plan = [[-12.6, -3.95], [-14.13, -3.95], [-14.18, 0.14], [-14.22, 4.22], [-12.6, 4.23]]

export function build() {
  const k = new Kit([0, 0])
  // The white body.
  k.prism('white', BODY, 0, 7.6, false)
  k.openings(BODY, 3.4, 4.8, { per: 1, w: 0.7, head: 'round', minEdge: 1.8, faces: [3, 6, 9, 12, 15] })
  // The red corbel band, its arches picked out in white.
  k.flare('brick', BODY, 7.6, 8.5, 9.0, 0.3)
  const rim = grow(BODY, 0.3)
  k.openings(rim, 8.5, 8.95, { pitch: 0.9, w: 0.4, head: 'flat', m: 'white', minEdge: 0.8, proud: 0.02 })
  // The openwork crown: red piers, white-framed openings, the white comb.
  k.prism('brick', rim, 9.0, 12.9, false)
  k.band('white', rim, 9.0, 9.9, 0.05)
  k.openings(rim, 10.1, 12.0, { pitch: 2.0, w: 1.0, head: 'round', frame: 0.42, minEdge: 1.6 })
  k.band('white', rim, 12.6, 12.9, 0.12)
  k.cap('brick', grow(rim, -0.6), 12.4)
  k.merlons(grow(rim, 0.1), 12.9, { w: 0.5, h: 0.6, t: 0.3, pitch: 1.05, m: 'white' })
  // The porch on the street side, and the gates.
  k.prism('white', [[-12.4, -3.95], ...PORCH.slice(1, 4), [-12.4, 4.23]], 0, 8.8, false)
  k.skirt('green', [[-12.2, -4.2], [-14.45, -4.2], [-14.45, 4.45], [-12.2, 4.45]], 8.8, 9.6, 0.9)
  k.panel([-14.22, 0.1], [0, -1], 0, 7.0, 5.4, 'round', 'white', 0.08)
  k.panel([-14.22, 0.1], [0, -1], 0, 6.4, 4.6, 'round', 'dark', 0.12)
  k.panel([8.62, 0.15], [0, 1], 0, 5.8, 4.0, 'round', 'dark', 0.08)
  return k
}

if (import.meta.main) await save('moscow-kremlin-kutafya-tower', 'Kutafya Tower', build(), 5000)
