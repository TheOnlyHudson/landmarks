/**
 * The Confederate pyramid ("Monument to the Confederate War Dead"),
 * Hollywood Cemetery, Richmond, Virginia (1869, Charles Henry Dimmock; dry-
 * laid rough-cut James River granite, no mortar) — original procedural
 * geometry, CC0-1.0.
 * bun generators/ric-hollywood-cemetery-pyramid.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 5.3 (the sides of OSM way/629189683, a
 * historic=monument area with no building tag, run at 5.3° and 95.3°).
 * Anchor = the centre of that square, -77.455589, 37.540796.
 *
 * Identity: a plain, steep, square granite pyramid of rough, irregular
 * courses, a little ragged at the arrises, with a small capstone; a heavier
 * course of large blocks at the foot.
 *
 * Dimensions: published 90 ft (27.4 m) high on a 45 ft (13.7 m) square base
 * (Hollywood Cemetery; NRHP nomination for Hollywood Cemetery); the base
 * matches OSM way/629189683 (13.7 m sides). The course bands (a slight
 * step every ~3 m) stand for the rough coursing seen in every photo; their
 * spacing is estimated. No lidar used.
 *
 * Ground: Mapterhorn falls ~1.3 m across the base, toward the east; the
 * pyramid's foot runs down to y = 0 on the low side. Elevation 0.
 *
 * Photos (EVIDENCE):
 *  - Hollywood Cemetery Pyramid.jpg, Ben Schumin, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Hollywood_Cemetery_Pyramid.jpg
 *  - 90-foot stone pyramid honoring 18,000 Confederate enlisted men buried
 *    at Hollywood Cemetery, Richmond, Virginia LCCN2011633543.tif, Carol M.
 *    Highsmith, public domain
 *    https://commons.wikimedia.org/wiki/File:90-foot_stone_pyramid_honoring_18,000_Confederate_enlisted_men_buried_at_Hollywood_Cemetery,_Richmond,_Virginia_LCCN2011633543.tif
 *  - Richmond Virginia Hollywood cemetery - the pyramid to "Our Confederate
 *    Dead" - panoramio.jpg, David Broad, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Richmond_Virginia_Hollywood_cemetery_-_the_pyramid_to_%22Our_Confederate_Dead%22_-_panoramio.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the small inscribed tablet on one face is left out (too small to
 * read and its face is not certain from the photos).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-flatiron-building'

const granite = new Part(), base = new Part()
const HB = 6.85, TOP = 27.4
/** Half-width of the pyramid at height z (straight sides). */
const hw = (z: number) => HB * (1 - z / TOP)
/** A square frustum band from z0 (half h0) to z1 (half h1). */
function frustum(p: Part, z0: number, h0: number, z1: number, h1: number, cap = false) {
  const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  p.loft([sq(h0, z0), sq(h1, z1)])
  if (cap) p.cap(sq(h1, z1), true)
}
// heavier foot course of large blocks, standing a little proud
frustum(base, 0, HB + 0.06, 1.6, hw(1.6) + 0.06)
base.loft([[[-hw(1.6) - 0.06, -hw(1.6) - 0.06, 1.6], [hw(1.6) + 0.06, -hw(1.6) - 0.06, 1.6], [hw(1.6) + 0.06, hw(1.6) + 0.06, 1.6], [-hw(1.6) - 0.06, hw(1.6) + 0.06, 1.6]], [[-hw(1.6), -hw(1.6), 1.6], [hw(1.6), -hw(1.6), 1.6], [hw(1.6), hw(1.6), 1.6], [-hw(1.6), hw(1.6), 1.6]]])
// the body in courses: each band starts a hair proud of the one above it
const bands = [1.6, 4.6, 7.6, 10.6, 13.6, 16.6, 19.6, 22.4, 24.9, 26.5]
for (let i = 0; i < bands.length - 1; i++) {
  const z0 = bands[i], z1 = bands[i + 1], d = 0.07
  frustum(granite, z0, hw(z0), z1, hw(z1) + d)
  // the small ledge where the next band steps in
  const a = hw(z1) + d, b = hw(z1)
  granite.loft([[[-a, -a, z1], [a, -a, z1], [a, a, z1], [-a, a, z1]], [[-b, -b, z1], [b, -b, z1], [b, b, z1], [-b, b, z1]]])
}
// capstone
frustum(base, 26.5, hw(26.5) + 0.08, 27.0, hw(27.0) + 0.05)
{
  const h = hw(27.0) + 0.05
  const ring: V3[] = [[-h, -h, 27.0], [h, -h, 27.0], [h, h, 27.0], [-h, h, 27.0]], apex: V3 = [0, 0, TOP]
  for (let i = 0; i < 4; i++) base.tri(ring[i], ring[(i + 1) % 4], apex)
}

await save('ric-hollywood-cemetery-pyramid', 'Confederate Pyramid, Hollywood Cemetery', [
  { part: granite, material: finish('hollywood-granite', 0xdad3c4) },
  { part: base, material: finish('hollywood-granite-dark', 0xc4beb2) },
], { height: TOP, anchor: [37.540796, -77.455589], bearing: 5.3 })
