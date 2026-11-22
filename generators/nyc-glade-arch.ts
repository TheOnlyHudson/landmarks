/**
 * Glade Arch, Central Park, near East 75th Street (Calvert Vaux and Jacob
 * Wrey Mould, about 1862) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-glade-arch.ts
 *
 * Frame (mesh.ts map frame): x along the top (bearing 86.9°, E), y along
 * the footpath through the arch (the placement's bearing, 356.9°, N), z up,
 * metres. z = 0 is the footpath under the arch. Anchor: midway between the
 * two portal faces on the path's line, 5.4 m south of the middle of OSM
 * way/426324897 (footway, bridge=yes, "Glade Arch", wikidata Q125458569),
 * which runs along the top by the north face. OSM maps no man_made=bridge
 * outline or building here (the path under is way/1330336389, layer −1), so
 * `replaces` is empty. The top is a paved walk under lawns, not a drive.
 *
 * Evidence
 * - OSM (ODbL): way/426324897 on the top (29 m), the paths under it.
 * - USGS lidar NY_NewYorkCity (2017 flight), ground returns, 0.5 m crop
 *   around the arch: the top plateau at 4.3 m above the path, 13–14 m deep
 *   between the portals (the north face 1.6 m north of the OSM way, the
 *   south face 12.4 m south of it); the path at 0.2–0.5 m both sides.
 *   Map terrain (Mapterhorn) agrees: plateau 4.0–4.2 m.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-glade-arch/photos):
 *   Jim.henderson, "Glade Arch north cloudy jeh.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Glade_Arch_north_cloudy_jeh.jpg
 *     (the north face square on: the segmental arch, the diamond-coursed
 *     face of grey-green stone with buff sandstone trim (ring, cornice,
 *     balustrade with panelled pedestals, plinth); every
 *     proportion below, scaled to the lidar's 4.3 m);
 *   Mike Peel, "At New York City 2024 316.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:At_New_York_City_2024_316.jpg
 *     (the south face in sun: buff sandstone, voussoirs, turned balusters,
 *     the red brick barrel).
 * - Estimated from the north photo: span 10.5 m, a segmental arch springing
 *   0.8 m above the path, intrados crown 3.25 m; voussoir ring 0.55 m;
 *   cornice 0.3 m; balustrade 0.95 m with pedestals about every 5 m; face
 *   24 m long, ending where the embankment takes it.
 *
 * Simplified: the face's diamond coursing, the rosettes and the pedestal
 * panels' carving are left out; the balusters are a sandstone panel with a
 * row of dark openings. The barrel is drawn 2.5 m deep behind each portal;
 * the embankment covers the middle.
 *
 * Doubts: the span is photo-scaled; the face's length past the photos'
 * frames is estimated.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { archBlock, band, bevelBox, box } from './nyc-greyshot-arch'

const face = new Part(), sand = new Part(), brick = new Part(), dark = new Part(), fill = new Part()
const TOP = 4.3, W = 12, D = 14, half = D / 2
const A = 5.25, RISE = 2.45, SPRING = 0.8, CORN = 0.3

const { outer } = archBlock({ D, W, top: () => TOP, fill: 4.0, F: W, t: 0.9, kind: 'segment', a: A, rise: RISE, spring: SPRING, ring: 0.55, proud: 0.08, portal: 2.5, n: 16 },
  { face, ring: sand, barrel: brick, fill })
void outer

for (const s of [-1, 1]) {
  // the cornice under the balustrade, and a low plinth course
  band(sand, s, half, 0.2, [-W, W], () => TOP - CORN, () => TOP)
  for (const sx of [-1, 1]) band(sand, s, half, 0.06, sx < 0 ? [-W, -A] : [A, W], () => 0, () => 0.45)
  // the balustrade: plinth, a pierced panel, coping; pedestals between
  const yb = s * (half - 0.15), th = 0.17, Z0 = TOP, Z1 = TOP + 0.95
  const posts = [-W + 0.4, -6.9, -2.3, 2.3, 6.9, W - 0.4]
  for (let k = 0; k + 1 < posts.length; k++) {
    const x0 = posts[k] + 0.42, x1 = posts[k + 1] - 0.42
    box(sand, x0, x1, yb - th - 0.05, yb + th + 0.05, Z0, Z0 + 0.14)
    box(sand, x0, x1, yb - th - 0.06, yb + th + 0.06, Z1 - 0.13, Z1)
    box(sand, x0, x1, yb - th + 0.04, yb + th - 0.04, Z0 + 0.14, Z1 - 0.13)
    const nh = Math.max(1, Math.round((x1 - x0) / 0.32))
    for (let j = 0; j < nh; j++) {
      const xc = x0 + ((x1 - x0) * (j + 0.5)) / nh, zc = (Z0 + Z1) / 2, hw = 0.08, hz = 0.27
      for (const side of [-1, 1]) {
        const yy = yb + side * (th - 0.02)
        const q: V3[] = [[xc - hw, yy, zc - hz], [xc + hw, yy, zc - hz], [xc + hw, yy, zc + hz], [xc - hw, yy, zc + hz]]
        // facing ±y: x × z = −y, so wind for the side
        if (side < 0) dark.quad(q[0], q[1], q[2], q[3]); else dark.quad(q[3], q[2], q[1], q[0])
      }
    }
  }
  for (const x of posts) {
    bevelBox(sand, x, yb, 0.42, 0.3, Z0, Z1 + 0.1, 0.06)
    bevelBox(sand, x, yb, 0.48, 0.36, Z1 + 0.1, Z1 + 0.22, 0.06)
  }
}

finishModel('Glade Arch', 'nyc-glade-arch', [
  { part: face, material: { name: 'stone', color: 0xa7a895, roughness: 0.9 } },
  { part: sand, material: { name: 'sandstone', color: 0xbcab8a, roughness: 0.9 } },
  { part: dark, material: { name: 'openwork', color: 0x8a8372, roughness: 0.9 } },
  { part: brick, material: { name: 'brick', color: 0x9e6253, roughness: 0.9 } },
  { part: fill, material: { name: 'infill', color: 0x8f8d88, roughness: 0.9 } },
], { bearing: 356.9, height: TOP + 1.17 }, 5000)
