/**
 * Cop Cot, Central Park, on the rock knoll inside the park near Sixth Avenue
 * and 59th Street (rustic summerhouse; rebuilt 1984 by the Central Park
 * Conservancy after Vaux and Mould's 1860s rustic shelters; the park's
 * largest rustic structure) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-cop-cot.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the plan is
 * round). Anchor: the centroid of OSM way/385442739 (amenity=shelter,
 * building=yes, "Cop Cot", start_date=1984), which this model replaces; no
 * other building ways lie within 40 m.
 *
 * Plan (OSM): a near-circle 10.6 m across (19 nodes). Drawn as a ring of
 * twelve cedar-log posts at r 5.0 m carrying a ring beam, an inner ring of
 * six taller posts at r 2.5 m carrying a raised centre, and open log rafters
 * between them, as the photos from inside show.
 *
 * Heights (y = 0 is the lowest ground under the plan; the knoll is bare
 * rock and the floor follows it):
 * - Estimated from the photos against people standing beside it: outer
 *   ring beam 2.7 m, rail 0.95 m, inner ring 3.3 m, the raised centre's
 *   eave 4.0 m and apex 4.85 m. No published height; lidar not used (the frame is open
 *   and wisteria-covered, so the point cloud would read the vine).
 *
 * Photos:
 * - central park4, "Cop COt" and "Cop Cot", Flickr, CC BY 2.0,
 *   https://www.flickr.com/photos/189150477@N03/50068921363 and
 *   https://www.flickr.com/photos/189150477@N03/50069733337
 *   (from inside: the post rings, the radial rafters, the raised centre,
 *   the log rails with diagonal braces)
 * - central park4, "Cop Cot Central Park", Flickr, CC BY 2.0,
 *   https://www.flickr.com/photos/189150477@N03/50069477906
 *   (from the rock to the side: the wisteria-covered frame, the log rail)
 * Look-only (CC BY-NC-ND, not used for shape, only to confirm it):
 * - gigi_nyc, "Central Park-Cop Cot, 01.04.14", Flickr,
 *   https://www.flickr.com/photos/76807015@N03/11847940575
 *   (the whole summerhouse in snow from outside: low ring roof and raised centre)
 *
 * Doubts: no licensed photo shows the whole structure from outside, so the
 * post count, the entrance gaps (drawn north and south) and the heights are
 * estimates. The wisteria that covers the roof in summer, the benches and
 * the twig lattice are left out; the rafters are drawn thicker and sparser
 * than the real ones so they read at map distance.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { tube } from './nyc-columbus-monument'

const post = new Part(), timber = new Part()

const log = (p: Part, a: V3, b: V3, r: number) => tube(p, [a, b], [r, r], 6)
const at = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

const RO = 5.0, RI = 2.5, EAVE = 2.7, INNER = 3.3, TOP = 4.0, APEX = 4.85
const N = 12

// Outer ring: posts, a ring beam, knee braces, and a log rail with crossed braces.
for (let i = 0; i < N; i++) {
  const a = (i * 2 * Math.PI) / N + Math.PI / N, b = ((i + 1) * 2 * Math.PI) / N + Math.PI / N
  log(post, at(RO, a, 0), at(RO, a, EAVE + 0.15), 0.17)
  log(timber, at(RO + 0.05, a, EAVE), at(RO + 0.05, b, EAVE), 0.14)
  const m = (a + b) / 2
  for (const s of [a, b]) log(timber, at(RO, s, EAVE - 0.75), at(RO, s + (m - s) * 0.45, EAVE), 0.07)
  const gap = Math.abs(Math.sin(m)) > 0.95 // entrances to the north and south
  if (!gap) {
    for (const z of [0.95, 0.45]) log(timber, at(RO, a, z), at(RO, b, z), 0.08)
    log(timber, at(RO, a, 0.45), at(RO, b, 0.95), 0.05)
    log(timber, at(RO, b, 0.45), at(RO, a, 0.95), 0.05)
  }
}
// Inner ring: six taller posts and a ring beam under the raised centre.
for (let i = 0; i < 6; i++) {
  const a = (i * Math.PI) / 3, b = ((i + 1) * Math.PI) / 3
  log(post, at(RI, a, 0), at(RI, a, TOP + 0.1), 0.16)
  log(timber, at(RI, a, INNER), at(RI, b, INNER), 0.13)
  log(timber, at(RI + 0.05, a, TOP), at(RI + 0.05, b, TOP), 0.13)
}
// Rafters from the outer ring up to the inner ring, with two purlin rings.
const R = 24
for (let i = 0; i < R; i++) {
  const a = (i * 2 * Math.PI) / R
  log(timber, at(RO + 0.45, a, EAVE + 0.05), at(RI - 0.1, a, INNER + 0.12), 0.09)
}
for (const t of [0.33, 0.66]) {
  const r = RO + 0.45 + (RI - 0.1 - RO - 0.45) * t, z = EAVE + 0.17 + (INNER - EAVE) * t
  for (let i = 0; i < R; i++) { const a = (i * 2 * Math.PI) / R, b = ((i + 1) * 2 * Math.PI) / R; log(timber, at(r, a, z), at(r, b, z), 0.07) }
}
// The raised centre: twelve rafters to a short king post, one purlin ring.
log(post, [0, 0, TOP + 0.3], [0, 0, APEX + 0.15], 0.15)
for (let i = 0; i < 12; i++) {
  const a = (i * Math.PI) / 6
  log(timber, at(RI + 0.6, a, TOP - 0.05), at(0.15, a, APEX), 0.09)
}
for (let i = 0; i < 12; i++) {
  const a = (i * Math.PI) / 6, b = ((i + 1) * Math.PI) / 6, z = TOP + 0.4
  log(timber, at(RI * 0.62, a, z), at(RI * 0.62, b, z), 0.07)
}

finishModel('Cop Cot', 'nyc-cop-cot', [
  { part: post, material: { name: 'cedar', color: 0x8c7b69, roughness: 0.95 } },
  { part: timber, material: { name: 'cedar-peeled', color: 0xb09878, roughness: 0.9 } },
], { bearing: 0, osm: 'way/385442739', height: 5.0 }, 5000)
