/**
 * Huddlestone Arch, Central Park, East Drive over the Loch near the Harlem
 * Meer (Calvert Vaux, 1866) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-huddlestone-arch.ts
 *
 * Built with `portal` and `lump` from nyc-glen-span-arch.ts and the portal
 * kit in nyc-balcony-bridge.ts.
 *
 * Frame (mesh.ts map frame): y through the arch, along the Loch and its
 * path (bearing 65°, ENE, toward the Meer: the placement's bearing), x
 * along East Drive (bearing 155°), z up, metres; z = 0 is the Loch beside
 * the path under the arch. Anchor: the centroid of OSM way/1121218991
 * (man_made=bridge, "Huddlestone Arch"), about 16 m along the Loch by 10 m
 * along the drive.
 *
 * Evidence
 * - OSM (ODbL): the bridge outline way/1121218991 (edges at 65° and 155°).
 * - Published (Wikipedia, "List of bridges in Central Park", citing the
 *   Central Park Conservancy): a dry-laid arch of boulders, some of nearly
 *   100 short tons, held by gravity alone; the vault 22 ft (6.7 m) wide and
 *   10 ft (3.0 m) high.
 * - Map terrain (Mapterhorn z15, bearing 65, 2.5 m grid): the Loch's floor
 *   at 0.4–1.0 m along x ≈ 0; East Drive flat at 5.9–6.2 m from y +5 to
 *   −6, falling off past y +7.5 and −10. The portals stand at y +7.2 and
 *   −8.4; the face tops at 5.0–5.5 m and the road fill at 5.4 m, under the
 *   map's drive at 6.0.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-huddlestone-arch/photos):
 *   Epicgenius, "Central Park May 2019 116.jpg" and "117.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_May_2019_116.jpg
 *     https://commons.wikimedia.org/wiki/File:Central_Park_May_2019_117.jpg
 *     (a face square on: the wide low arch of huge rough voussoirs on
 *     boulder jambs, a row of great flat capstones along the top, the
 *     boulder banks either side; every proportion below);
 *   Epicgenius, "Central Park May 2019 114.jpg" and "119.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_May_2019_114.jpg
 *     https://commons.wikimedia.org/wiki/File:Central_Park_May_2019_119.jpg
 *     (the boulders and the dry-laid soffit close up: grey with rust).
 * - Estimated: the path under the arch about 0.5 m over the water; the
 *   crown is put 4.0 m over z = 0, a little over the published 10 ft,
 *   because people under the arch in photo 116 scale its far opening to
 *   about 3.7 m over the path; a segmental arch on 1.8 m boulder jambs; voussoirs 1.2 m deep; the face
 *   1.5 m over the crown, capped by flat boulders 0.6–0.8 m thick; the face
 *   15 m long, its ends in the drive's embankment.
 *
 * Simplified: the boulders of the face are one rough wall with a bold
 * voussoir ring; the capstones and the bank boulders are lumps. Each portal
 * carries 2.5 m of barrel; the middle is under the terrain's drive.
 *
 * Doubts: the crown height (the photos read taller than the published
 * 10 ft, perhaps from the path's level); both faces drawn alike (the photos
 * show the west face; the east face toward the Meer is unphotographed in
 * licensed sources); the faces' lengths.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { archPr, ring } from './nyc-balcony-bridge'
import { lump, portal } from './nyc-glen-span-arch'

const face = new Part(), vous = new Part(), cap = new Part(), rock = new Part(), road = new Part()
const A = 3.35, RISE = 2.2, SPRING = 1.8, HW = 7.5, FILL = 5.4
const pr = archPr('segment', A, RISE, SPRING, 29)
const arc = pr.slice(1, -1) // the intrados without its jambs
// a rough top line: highest over the arch, a little lower at the ends
const top = (x: number) => 5.5 - 0.5 * Math.max(0, (Math.abs(x) - 4) / (HW - 4))

for (const [s, y] of [[1, 7.2], [-1, -8.4]] as const) {
  portal(face, new Part(), road, { y, s, pr, x0: -HW, x1: HW, top, depth: 2.5, parapet: 1.0, fill: FILL, vd: 1.2, vp: 0.35 })
  // the voussoirs: six huge separate boulders round the arch, of uneven
  // depth and standing proud by different amounts, dark joints between
  for (let k = 0; k < 6; k++) {
    const d = [1.25, 1.0, 1.4, 1.15, 1.35, 1.05][k], pp = [0.4, 0.28, 0.45, 0.3, 0.42, 0.32][k]
    ring(vous, y, s, arc.slice(5 * k, 5 * k + 5), d, pp)
  }
  // two great blocks set in the spandrels
  lump(cap, -A - 1.4, y + s * 0.05, 1.3, 0.45, 1.5, 0.9 + s, SPRING + 0.9)
  lump(cap, A + 1.5, y + s * 0.05, 1.2, 0.45, 1.4, 1.9 + s, SPRING + 1.0)
  // the great flat capstones along the top, set in a staggered row
  const caps: [number, number, number, number][] = [[-6.0, 1.7, 0.55, 0.2], [-3.0, 1.9, 0.75, 1.1], [0.2, 2.0, 0.8, 2.3], [3.4, 1.8, 0.7, 3.0], [6.1, 1.6, 0.5, 4.2]]
  for (const [cx, rx, h, seed] of caps) lump(cap, cx, y - s * 0.5, rx, 0.95, h + 0.05, seed + s, top(cx) - 0.05)
  // boulder banks either side of the opening, one great one forward on the west
  lump(rock, -A - 2.0, y + s * 1.2, 1.9, 1.5, 3.4, 0.6 + s)
  lump(rock, A + 2.2, y + s * 1.0, 1.7, 1.3, 2.7, 1.7 + s)
  lump(rock, -A - 4.6, y + s * 0.6, 1.6, 1.3, 2.3, 2.4 + s)
  lump(rock, A + 4.8, y + s * 0.5, 1.5, 1.2, 2.0, 3.1 + s)
}

finishModel('Huddlestone Arch', 'nyc-huddlestone-arch', [
  { part: face, material: { name: 'schist', color: 0x9f9a8e, roughness: 0.95 } },
  { part: vous, material: { name: 'voussoirs', color: 0xbab3a3, roughness: 0.95 } },
  { part: cap, material: { name: 'capstones', color: 0x99978b, roughness: 0.95 } },
  { part: rock, material: { name: 'boulders', color: 0x8e897f, roughness: 0.95 } },
  { part: road, material: { name: 'road-fill', color: 0x8e8e8c, roughness: 0.95 } },
], { bearing: 65, osm: 'way/1121218991', height: 6.4 }, 5000)
