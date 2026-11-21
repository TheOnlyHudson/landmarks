/**
 * Dipway Arch, Central Park, near West 62nd Street (Calvert Vaux, 1860;
 * rebuilt) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-dipway-arch.ts
 *
 * Built with the arch kit in generators/nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): x along Center Drive (bearing 119°), y along
 * the footpath through the arch (bearing 29°: the placement's bearing),
 * z up, metres; z = 0 is the path under the arch. Anchor: the middle of OSM
 * way/385446611 (highway=footway, tunnel=yes, "Dipway Arch"). OSM maps no
 * man_made=bridge outline and no building here, so `replaces` is empty.
 *
 * Evidence
 * - OSM (ODbL): the path through way/385446611 (15.7 m, bearing 209°/29°),
 *   Center Drive way/583505066 (width 10) over it.
 * - Map terrain (Mapterhorn z15, bearing 29): the path at 0 at both
 *   portals, the drive's plateau 4.3–4.4 m above it over y −6…+6.
 *   The roadway is taken at 4.4 m; the infill stops 0.3 m under it.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-dipway-arch/photos):
 *   Jim.henderson, "Outside Dipway Arch jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Outside_Dipway_Arch_jeh.jpg
 *     (a portal square on: every proportion below);
 *   Clyde Charles Brown, "Dipway Arch, Manhattan, New York, US.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Dipway_Arch,_Manhattan,_New_York,_US.jpg
 *     (three-quarter view: the long wing walls whose coping sweeps down);
 *   Jim.henderson, "Dipway east brick arch jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Dipway_east_brick_arch_jeh.jpg
 *     (the red brick lining with its blind arcade).
 * - Estimated from the square-on photo scaled to the 4.4 m roadway: an
 *   opening 4.1 m wide on vertical jambs, a flat segmental arch springing at
 *   2.65 m with its crown at 3.2 m; granite archivolt 0.35 m; projecting
 *   pilasters 0.75 m wide, their outer edges 3.65 m from the centre line;
 *   cornice 0.35 m; granite pedestals with domed caps 1.3 m, and a metal
 *   railing 1.0 m between them (its short curved ends past the end
 *   pedestals are left out). Wing walls: 5.4 m beyond the pilasters, the
 *   coping sweeping down to 1 m at the ends (Brown photo).
 *
 * Simplified: rock-faced ashlar coursing, the carved clover panels at the
 * pilasters' feet and the lining's blind arcade are left out; the railing
 * is two rails and sparse balusters.
 *
 * Review: only 3 m of barrel and infill are drawn behind each portal (the
 * terrain covers the middle); the infill top is a neutral roadbed grey.
 *
 * Doubts: dimensions are photo-scaled from the terrain's road height; both
 * portals are drawn alike (only one is photographed square on).
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { archBlock, band, bevelBox, box, steps, urn } from './nyc-greyshot-arch'

const face = new Part(), bed = new Part(), trim = new Part(), brick = new Part(), metal = new Part()
const ROAD = 4.4, W = 9.4, D = 14, half = D / 2
const A = 2.05, PIL0 = 2.9, PIL1 = 3.65, WING = 4.0
const top = (x: number) => {
  const u = (Math.abs(x) - WING) / (W - WING)
  return u <= 0 ? ROAD : 1.0 + (ROAD - 1.0) * Math.sqrt(Math.max(0, 1 - u * u))
}
const xsWing = steps(WING, W, 8)
const xsTop = [...xsWing, ...xsWing.map((x) => -x)]

archBlock({ D, W, top, fill: ROAD - 0.3, F: WING, t: 0.8, kind: 'segment', a: A, rise: 0.55, spring: 2.65, ring: 0.35, proud: 0.1, xsTop, n: 10, portal: 3 },
  { face, ring: trim, barrel: brick, fill: bed })

for (const s of [-1, 1]) {
  const yb = s * (half - 0.25)
  // cornice over the portal, and the coping following the wing walls down
  band(trim, s, half, 0.18, [-WING, WING], () => ROAD - 0.35, () => ROAD)
  for (const sx of [-1, 1]) {
    const xs = sx < 0 ? xsWing.map((x) => -x).reverse() : xsWing
    band(trim, s, half, 0.12, xs, (x) => top(x) - 0.3, top)
    // the pilasters, with a capital under the cornice
    const x0 = sx < 0 ? -PIL1 : PIL0, x1 = sx < 0 ? -PIL0 : PIL1
    band(trim, s, half, 0.25, [x0, x1], () => 0, () => ROAD - 0.6)
    band(trim, s, half, 0.32, [x0 - 0.1, x1 + 0.1], () => ROAD - 0.6, () => ROAD - 0.35)
    // a granite plinth at the foot of the jambs
    band(trim, s, half, 0.08, sx < 0 ? [-PIL0, -A] : [A, PIL0], () => 0, () => 0.5)
  }
  // the parapet: granite pedestals with domed caps and a metal railing
  const posts = [-3.27, -1.05, 1.05, 3.27]
  for (const x of posts) {
    bevelBox(trim, x, yb, 0.3, 0.3, ROAD, ROAD + 1.05, 0.06)
    bevelBox(trim, x, yb, 0.36, 0.36, ROAD + 1.05, ROAD + 1.15, 0.05)
    urn(trim, x, yb, [[0.3, ROAD + 1.15], [0.28, ROAD + 1.25], [0.2, ROAD + 1.36], [0.06, ROAD + 1.42]], 8)
  }
  const rail = (x0: number, x1: number, z0: number, z1: number) => {
    box(metal, x0, x1, yb - 0.04, yb + 0.04, z1 - 0.07, z1)
    box(metal, x0, x1, yb - 0.04, yb + 0.04, z0 + 0.12, z0 + 0.18)
    const m = Math.max(1, Math.round((x1 - x0) / 0.6))
    for (let j = 1; j < m; j++) {
      const xc = x0 + ((x1 - x0) * j) / m
      box(metal, xc - 0.03, xc + 0.03, yb - 0.03, yb + 0.03, z0, z1 - 0.07)
    }
  }
  for (let k = 0; k + 1 < posts.length; k++) rail(posts[k] + 0.3, posts[k + 1] - 0.3, ROAD, ROAD + 1.0)
}

finishModel('Dipway Arch', 'nyc-dipway-arch', [
  { part: bed, material: { name: 'roadbed', color: 0xa9a7a1, roughness: 0.95 } },
  { part: face, material: { name: 'granite', color: 0xbcbab3, roughness: 0.9 } },
  { part: trim, material: { name: 'stone', color: 0xd0cdc4, roughness: 0.85 } },
  { part: brick, material: { name: 'brick', color: 0xa8634e, roughness: 0.9 } },
  { part: metal, material: { name: 'metal', color: 0x7d6c58, roughness: 0.6 } },
], { bearing: 29, height: ROAD + 1.42 }, 5000)
