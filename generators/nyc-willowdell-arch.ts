/**
 * Willowdell Arch, Central Park, under East Drive by the Mall (Calvert Vaux
 * and Jacob Wrey Mould, 1860s) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-willowdell-arch.ts
 *
 * Built with the arch kit in generators/nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): x along East Drive (bearing 30°), y along
 * Wallach Walk through the arch (bearing 300°: the placement's bearing),
 * z up, metres; z = 0 is the walk. Anchor: the middle of the covered walk
 * way/1315426779 where East Drive (way/648888143, bridge=yes) crosses it.
 *
 * Evidence
 * - OSM (ODbL): bridge outline way/385460484 ("Willowdell Arch",
 *   man_made=bridge), a concave outline 14–15 m across (the tunnel) but
 *   33 m along the drive, over its embankment; the covered walk
 *   way/1315426779, 13.8 m.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-willowdell-arch/photos):
 *   Jim.henderson, "Willowdell Arch Central Park jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Willowdell_Arch_Central_Park_jeh.jpg
 *     (the portal nearly square on: every proportion below);
 *   Mike Peel, "At New York, USA 2017 365.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:At_New_York,_USA_2017_365.jpg
 *     (the top: brownstone cornice and coping, the wooden post-and-rail
 *     fence, the carved keystone and impost panels);
 *   Roman Eugeniusz, "Central Park, New York, NY, USA - panoramio (165).jpg",
 *     public domain,
 *     https://commons.wikimedia.org/wiki/File:Central_Park,_New_York,_NY,_USA_-_panoramio_(165).jpg
 *     (from the Balto statue: a taxi on the drive for scale).
 * - Estimated from the photos scaled by the taxi (~4.5 m) and the fence
 *   (~1.05 m): an opening 4.3 m wide on brownstone jambs, a segmental arch
 *   springing at 1.6 m with its crown at 2.7 m, brownstone voussoirs 0.5 m
 *   deep with a carved keystone and carved square panels at the imposts; a
 *   red brick face 10 m long; brownstone cornice 0.4 m with a coping on it,
 *   its top (the roadway) at 3.95 m; lower wing walls sloping down beyond
 *   the face; a weathered wooden fence 1.05 m with posts about 1.9 m apart.
 *
 * `replaces` is empty: OSM's outline runs 33 m along the drive over its
 * embankment, beyond the brick face and wing walls this model draws, so
 * listing it would leave the rest without parapets on the map (see Bridges
 * in docs/reference.md). The lead may prefer to trim the outline in OSM.
 *
 * Review: only 3 m of barrel and infill are drawn behind each portal (the
 * terrain covers the middle); the infill top is a neutral roadbed grey.
 *
 * Doubts: no lidar or published dimensions; the wing walls' length and
 * their sloping tops are estimated from partial views (bushes hide them).
 * The far portal mirrors the photographed one.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { archBlock, band, box, steps } from './nyc-greyshot-arch'

const brick = new Part(), bed = new Part(), brown = new Part(), wood = new Part(), barrel = new Part()
const ROAD = 3.95, D = 14, half = D / 2, A = 2.15, SPRING = 1.6, RISE = 1.1
const FACE = 5.0, W = 9.0
const top = (x: number) => {
  const u = (Math.abs(x) - FACE) / (W - FACE)
  return u <= 0 ? ROAD : ROAD - (ROAD - 1.2) * u
}
const xsTop = [FACE, W, -FACE, -W]

archBlock({ D, W, top, fill: ROAD - 0.3, F: FACE, t: 0.8, kind: 'segment', a: A, rise: RISE, spring: SPRING, ring: 0.5, proud: 0.08, jambs: true, xsTop, n: 12, portal: 3 },
  { face: brick, ring: brown, barrel, fill: bed })

for (const s of [-1, 1]) {
  // brownstone cornice and coping over the brick face, and copings down the wings
  band(brown, s, half, 0.18, [-FACE, FACE], () => ROAD - 0.55, () => ROAD - 0.15)
  band(brown, s, half, 0.1, [-FACE, FACE], () => ROAD - 0.15, () => ROAD)
  for (const sx of [-1, 1]) band(brown, s, half, 0.1, sx < 0 ? [-W, -FACE] : [FACE, W], (x) => top(x) - 0.3, top)
  // carved panels: square blocks at the imposts and the keystone
  const crown = SPRING + RISE
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -(A + 1.05) : A + 0.1, x1 = sx < 0 ? -(A + 0.1) : A + 1.05
    band(brown, s, half, 0.16, [x0, x1], () => SPRING - 0.25, () => SPRING + 0.7)
  }
  band(brown, s, half, 0.16, [-0.38, 0.38], () => crown - 0.05, () => crown + 0.95)
  // the wooden post-and-rail fence on the coping
  const yb = s * (half - 0.25)
  for (const x of steps(-FACE + 0.2, FACE - 0.2, 5)) box(wood, x - 0.11, x + 0.11, yb - 0.11, yb + 0.11, ROAD, ROAD + 1.1)
  for (const z of [0.5, 0.95]) box(wood, -FACE + 0.2, FACE - 0.2, yb - 0.06, yb + 0.06, ROAD + z - 0.08, ROAD + z + 0.08)
}

finishModel('Willowdell Arch', 'nyc-willowdell-arch', [
  { part: bed, material: { name: 'roadbed', color: 0xa9a7a1, roughness: 0.95 } },
  { part: brick, material: { name: 'brick', color: 0xa8776b, roughness: 0.9 } },
  { part: brown, material: { name: 'brownstone', color: 0xb5a28a, roughness: 0.9 } },
  { part: wood, material: { name: 'wood', color: 0x9f927c, roughness: 0.9 } },
  { part: barrel, material: { name: 'lining', color: 0x9a6a5a, roughness: 0.9 } },
], { bearing: 300, height: ROAD + 1.1 }, 5000)
