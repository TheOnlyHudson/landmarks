/**
 * Ramble Arch (Ramble Stone Arch, the "rustic arch"), Central Park
 * (Calvert Vaux, 1859–60) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-ramble-arch.ts
 *
 * Built with the portal kit in nyc-balcony-bridge.ts.
 *
 * Frame (mesh.ts map frame): y along the lower path through the arch
 * (bearing 121°, ESE: the placement's bearing), x along the footway over it
 * (bearing 211°), z up, metres; z = 0 is the lower path. Anchor: the middle
 * of OSM way/700608371 (highway=footway, bridge=yes, "Ramble Stone Arch"),
 * the path over the arch. OSM maps no man_made=bridge outline and no
 * building here, so `replaces` is empty. The walkway over the arch is the
 * model's (a footbridge); the paths beyond it are the map's.
 *
 * Evidence
 * - OSM (ODbL): the footway over it way/700608371 (10 m), the path through
 *   it way/426140612.
 * - Map terrain (Mapterhorn z15, bearing 121): the lower path 0.3–0.7 m
 *   along x ≈ 0; the rock on both sides of the gorge 5.0–5.9 m above it at
 *   x ±6. The walkway over the arch is taken at 4.55 m and the parapets at
 *   5.0 m, level with the rock tops.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-ramble-arch/photos):
 *   Jim.henderson, "Ramble Arch east sun jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Ramble_Arch_east_sun_jeh.jpg
 *     (the east face: tall narrow round-headed opening, rough schist
 *     ashlar, a rough-stone top);
 *   Mike Peel, "At New York, USA 2017 394.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:At_New_York,_USA_2017_394.jpg
 *     (a face square on between the boulders: every proportion below);
 *   Allen Lubitz, "Ramble Stone Arch, Central Park, New York City.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Ramble_Stone_Arch,_Central_Park,_New_York_City.jpg
 *     (through the arch: the short barrel, the voussoirs).
 * - Estimated from the square-on photo scaled to the terrain's 5 m rock
 *   tops: the face 7.2 m wide and 5 m to the parapet top; the opening
 *   1.3 m wide on jambs 2.35 m high, a semicircular head, its crown 3.0 m;
 *   voussoirs 0.6 m; a string course at 3.85–4.15 m; the arch 3 m through (the walkway 2 m between parapets 0.5 m
 *   thick), a rough coping of flat stones 0.22 m, some standing 0.1–0.2 m
 *   higher.
 *
 * Not modelled: the boulders that flank the arch (they are the ground's,
 * and the terrain shows the gorge); the stone texture.
 *
 * Doubts: the opening's width (photo-scaled from perspective views, 1.1 to
 * 2 m between them); both faces drawn alike.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, box, qn } from './nyc-greyshot-arch'
import { archPr, barrel, openFace, ring } from './nyc-balcony-bridge'

const face = new Part(), vous = new Part(), cope = new Part(), walk = new Part()
const XC = -0.5, HW = 3.6, HY = 1.5, PT = 0.5, TOP = 5.0, WALK = 4.55
const pr = archPr('ellipse', 0.65, 0.65, 2.35, 10).map(([x, z]): [number, number] => [x + XC, z])
const x0 = XC - HW, x1 = XC + HW

for (const s of [-1, 1]) {
  const y = s * HY, yi = s * (HY - PT)
  openFace(face, y, s, pr, x0, x1, () => TOP, 3)
  ring(vous, y, s, pr, 0.6, 0.1)
  // a projecting string course under the parapet
  band(cope, s, HY, 0.12, [x0, x1], () => 3.85, () => 4.15)
  // the parapet: its top, its inner face down to the walkway
  qn(face, [x0, y, TOP], [x1, y, TOP], [x1, yi, TOP], [x0, yi, TOP], [0, 0, 1])
  qn(face, [x0, yi, WALK], [x1, yi, WALK], [x1, yi, TOP], [x0, yi, TOP], [0, -s, 0])
  for (const x of [x0, x1]) qn(face, [x, y, 0], [x, yi, 0], [x, yi, TOP], [x, y, TOP], [x - XC, 0, 0])
  // the rough coping: a slab of big flat stones overhanging the face a
  // little, a few of them standing higher
  const ya = Math.min(y, yi) - (s < 0 ? 0.08 : 0), yb = Math.max(y, yi) + (s > 0 ? 0.08 : 0)
  box(cope, x0 - 0.06, x1 + 0.06, ya, yb, TOP, TOP + 0.22)
  const hs = s < 0 ? [0, 0.12, 0, 0.18, 0.06, 0, 0.14] : [0.1, 0, 0.16, 0, 0.08, 0.15, 0]
  const w = (x1 - x0) / hs.length
  hs.forEach((h, k) => {
    if (h > 0) box(cope, x0 + k * w + 0.08, x0 + (k + 1) * w - 0.08, ya + 0.04, yb - 0.04, TOP + 0.22, TOP + 0.22 + h)
  })
}
// the barrel through, the fill between the parapets' inner faces under the walkway, the walkway
barrel(face, pr, -HY, HY)
for (const x of [x0, x1]) qn(face, [x, -(HY - PT), 0], [x, HY - PT, 0], [x, HY - PT, WALK], [x, -(HY - PT), WALK], [x - XC, 0, 0])
qn(walk, [x0, -(HY - PT), WALK], [x1, -(HY - PT), WALK], [x1, HY - PT, WALK], [x0, HY - PT, WALK], [0, 0, 1])

finishModel('Ramble Arch', 'nyc-ramble-arch', [
  { part: face, material: { name: 'schist', color: 0xa39e90, roughness: 0.95 } },
  { part: vous, material: { name: 'voussoirs', color: 0xb3ad9d, roughness: 0.9 } },
  { part: cope, material: { name: 'coping', color: 0x978c7b, roughness: 0.95 } },
  { part: walk, material: { name: 'walkway', color: 0x8e8e8c, roughness: 0.95 } },
], { bearing: 121, height: TOP + 0.4 }, 5000)
