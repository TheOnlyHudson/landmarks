/**
 * Riftstone Arch, Central Park, under West Drive near West 72nd Street
 * (Calvert Vaux, 1862) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-riftstone-arch.ts
 *
 * Built with the portal kit in nyc-balcony-bridge.ts.
 *
 * Frame (mesh.ts map frame): y along the bridle path through the arch
 * (bearing 30.6°, NNE: the placement's bearing), x across it (bearing
 * 120.6°), z up, metres; z = 0 is the bridle path at the portals. Anchor:
 * the centroid of OSM way/1034625439 (man_made=tunnel, "Riftstone Arch").
 * A tunnel outline is not a building, and OSM maps no building here, so
 * `replaces` is empty.
 *
 * Evidence
 * - OSM (ODbL): the tunnel outline way/1034625439 (21 m long, 6 m wide)
 *   and the bridle path through it way/332080784 (tunnel=yes, layer −1);
 *   the drive over it is West 72nd Street way/1081021589 (at grade).
 * - Map terrain (Mapterhorn z15, bearing 30.6): the bridle path at 0–0.8 m
 *   at y +15…+18 and y −18; the hillside and drive over the tunnel 4.5–5 m
 *   above it from y −15 to +12. The map's terrain has no hole for the
 *   tunnel, so each portal is put where the ground falls to the path: the
 *   north face at y +14.5, the south face at y −17.0. That is 4–6.5 m outside
 *   OSM's outline at each end (see Doubts).
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-riftstone-arch/photos):
 *   Epicgenius, "Central Park Apr 2019 153.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Apr_2019_153.jpg
 *     (the south portal close up: the low wide arch of big rough voussoirs
 *     on boulder jambs, a great boulder standing forward on the west side;
 *     every proportion below);
 *   Epicgenius, "Central Park Apr 2019 149.jpg" and "150.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Apr_2019_149.jpg
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Apr_2019_150.jpg
 *     (the south portal from down the path: boulder outcrops either side).
 * - Estimated from the close photo, scaled to the 4.5 m bridle path: span
 *   6.0 m, a segmental arch springing 1.0 m up on the boulders with its
 *   crown at 3.0 m; voussoirs 0.75 m deep; rock face 1 m over the ring.
 *
 * Simplified: each portal's rockwork is a rough face and four chunky
 * boulders; the individual voussoirs and the planting on top are left
 * out. Each portal carries 3 m of barrel; the middle is the terrain's.
 *
 * Doubts: the north portal is drawn like the south one (no licensed photo
 * of it was found); the portals' positions follow the map terrain, not
 * OSM's shorter outline; the boulders' shapes are generic.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { qn } from './nyc-greyshot-arch'
import { archPr, barrel, hull, openFace, ring } from './nyc-balcony-bridge'

const rock = new Part(), vous = new Part(), boulder = new Part()
const XC = 0.5, A = 3.0, RISE = 2.0, SPRING = 1.0, DEPTH = 3.0
const pr = archPr('segment', A, RISE, SPRING, 12).map(([x, z]): [number, number] => [x + XC, z])
const HWF = 6.0 // half width of the rock face
const top = (x: number) => 4.0 - 1.2 * Math.max(0, (Math.abs(x - XC) - 3.8) / (HWF - 3.8))

/** A rough boulder: a six-sided lump from foot polygon to a smaller top. */
function lump(cx: number, cy: number, rx: number, ry: number, h: number, seed: number) {
  const n = 6, rings: V3[][] = []
  for (const [z, k] of [[0, 1], [h * 0.55, 1.08], [h, 0.62]] as const) {
    rings.push(Array.from({ length: n }, (_, i): V3 => {
      const t = (2 * Math.PI * i) / n + seed, j = 0.85 + 0.3 * Math.abs(Math.sin(seed * 3.1 + i * 1.7))
      return [cx + rx * k * j * Math.cos(t), cy + ry * k * j * Math.sin(t), z + (z > 0 ? 0.25 * Math.sin(seed + i) : 0)]
    }))
  }
  hull(boulder, rings)
}

for (const [s, y] of [[1, 14.5], [-1, -17.0]] as const) {
  const yb = y - s * DEPTH, x0 = XC - HWF, x1 = XC + HWF
  openFace(rock, y, s, pr, x0, x1, top, 4)
  ring(vous, y, s, pr, 0.75, 0.25)
  barrel(rock, pr, y, yb)
  // the portal block behind the face: its top and sides, and its back
  const xs = [x0, XC - 3.8, XC - 1.3, XC + 1.3, XC + 3.8, x1]
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(rock, [a, y, top(a)], [b, y, top(b)], [b, yb, top(b)], [a, yb, top(a)], [0, 0, 1])
  }
  for (const x of [x0, x1]) qn(rock, [x, y, 0], [x, yb, 0], [x, yb, top(x)], [x, y, top(x)], [x - XC, 0, 0])
  openFace(rock, yb, -s, pr, x0, x1, top, 2)
  // the boulders: one great one standing forward on the west side, and
  // smaller ones banked against the face
  lump(XC - 5.2, y + s * 1.4, 1.9, 1.5, 3.4, 0.3 + s)
  lump(XC + 5.0, y + s * 0.9, 1.6, 1.2, 2.6, 1.1 + s)
  lump(XC - 7.4, y + s * 0.2, 1.4, 1.2, 2.0, 2.0 + s)
  lump(XC + 7.2, y + s * 0.1, 1.3, 1.1, 1.7, 2.7 + s)
}

finishModel('Riftstone Arch', 'nyc-riftstone-arch', [
  { part: rock, material: { name: 'schist', color: 0xa8a398, roughness: 0.95 } },
  { part: vous, material: { name: 'voussoirs', color: 0xc4bcaa, roughness: 0.9 } },
  { part: boulder, material: { name: 'boulders', color: 0x918c82, roughness: 0.95 } },
], { bearing: 30.6, height: 4.2 }, 5000)
