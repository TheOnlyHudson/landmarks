/**
 * Oak Bridge (Bank Rock Bridge), Central Park, over Bank Rock Bay (Calvert
 * Vaux and Jacob Wrey Mould, 1860; rebuilt 2009 to the original design) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-oak-bridge.ts
 *
 * Frame (mesh.ts map frame): y along the bridge toward its north-west end
 * (bearing 327.3°: the placement's bearing), x across it (bearing 57.3°),
 * z up, metres; z = 0 is the Lake's water. Anchor: the centroid of OSM
 * way/580520662 (man_made=bridge, bridge:structure=humpback, "Oak Bridge"),
 * which the model draws across and so replaces. The walkway's planking is
 * the model's (a footbridge); the paths beyond the outline are the map's.
 *
 * Evidence
 * - OSM (ODbL): outline way/580520662, 19.9 m long and 4.4 m wide;
 *   footway way/302774807 (bridge=yes, surface=wood).
 * - Map terrain (Mapterhorn z15, bearing 327.3): water at 0 from y −5 to
 *   +4; the banks 0.5–0.9 m up at |y| 8, 1.0–2.2 m at |y| 11.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-oak-bridge/photos):
 *   Jay Dobkin, "Bank Rock Bridge in Central Park 05.jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Bank_Rock_Bridge_in_Central_Park_05.jpg
 *     (side-on across the bay: the dark timber railing on its posts, the
 *     fascia, the iron brackets curving down to two piers into a wide
 *     middle arch and two short side arches, the stone abutments; every
 *     proportion below);
 *   Jay Dobkin, "Bank Rock Bridge in Central Park 03.jpg" and "04.jpg",
 *     CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Bank_Rock_Bridge_in_Central_Park_03.jpg
 *     (the same side from further off);
 *   TheCatalyst31, "Oak Bridge through trees, Central Park.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Oak_Bridge_through_trees,_Central_Park.jpg
 *     (from the south: the same railing and arches).
 * - Published (Central Park Conservancy; NYC Parks): the 1860 bridge was
 *   rebuilt in 2009 to its original design; timber deck and railing on an
 *   iron frame.
 * - Estimated from the side-on photo scaled to the 1.1 m railing: walkway
 *   2.1 m over the water at the ends and 2.35 m at midspan (a slight hump);
 *   fascia 0.35 m; piers 4.5 m either side of the middle; the middle arch
 *   springing 0.9 m up and rising to the fascia; the abutments' faces at
 *   |y| 8.5. Not measured with lidar.
 *
 * Simplified: the railing's carved panels are one dark openwork band
 * between brown rails; the bracket tracery is a solid rib.
 *
 * Doubts: the photos are all from the bay's south-west side; the far side
 * is drawn alike. The rib's real depth and the piers' footing are hidden
 * by foliage in every photo.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { bevelBox, box, qn, steps } from './nyc-greyshot-arch'

const wood = new Part(), dark = new Part(), iron = new Part(), stone = new Part(), deckP = new Part()
const HALF = 10.0, HW = 1.8, PIER = 4.5, AB = 8.5, RAIL = 1.1, FASCIA = 0.35, SPR = 0.9
const deck = (y: number) => 2.1 + 0.25 * (1 - (y / HALF) ** 2)
/** The underside of the iron ribs: a middle arch pier to pier, side arches pier to abutment. */
const seg = (y: number, a: number, b: number) => {
  const h = (b - a) / 2, m = (a + b) / 2, crown = deck(m) - FASCIA - 0.05, rise = crown - SPR
  const R = (h * h + rise * rise) / (2 * rise)
  return crown - R + Math.sqrt(Math.max(0, R * R - (y - m) ** 2))
}
const under = (y: number) => {
  const u = Math.abs(y)
  if (u <= PIER) return seg(y, -PIER, PIER)
  return seg(u, PIER, AB)
}
const ys = [...steps(-AB, -PIER, 6), ...steps(-PIER, PIER, 14).slice(1), ...steps(PIER, AB, 6).slice(1)]
const all = steps(-HALF, HALF, 20)

/** A strip on the plane x = s·xo between lo(y) and hi(y), facing ±x. */
function side(p: Part, s: number, xo: number, ys: number[], lo: (y: number) => number, hi: (y: number) => number, out = 1) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const a = ys[i], b = ys[i + 1]
    qn(p, [s * xo, a, lo(a)], [s * xo, b, lo(b)], [s * xo, b, hi(b)], [s * xo, a, hi(a)], [s * out, 0, 0])
  }
}
/** A horizontal strip between x offsets o0..o1 at z(y), facing up or down. */
function flat(p: Part, s: number, o0: number, o1: number, ys: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const a = ys[i], b = ys[i + 1]
    qn(p, [s * o0, a, z(a)], [s * o0, b, z(b)], [s * o1, b, z(b)], [s * o1, a, z(a)], [0, 0, up ? 1 : -1])
  }
}

for (const s of [-1, 1]) {
  // the iron rib: from the arches up to the fascia, both faces and its underside
  const r0 = HW - 0.05, r1 = HW + 0.2
  side(iron, s, r1, ys, under, (y) => deck(y) - FASCIA)
  side(iron, s, r0, ys, under, (y) => deck(y) - FASCIA, -1)
  flat(iron, s, r0, r1, ys, under, false)
  // the fascia along the whole length, and the walkway's edge
  side(wood, s, HW + 0.25, all, (y) => deck(y) - FASCIA, deck)
  flat(wood, s, HW - 0.1, HW + 0.25, all, (y) => deck(y) - FASCIA, false)
  flat(wood, s, HW + 0.1, HW + 0.25, all, deck, true)
  // the railing: brown rails top and bottom, one dark openwork band between
  for (const [o, out] of [[HW + 0.12, 1], [HW - 0.04, -1]] as [number, number][]) {
    side(wood, s, o, all, deck, (y) => deck(y) + 0.18, out)
    side(dark, s, o, all, (y) => deck(y) + 0.18, (y) => deck(y) + RAIL - 0.16, out)
    side(wood, s, o, all, (y) => deck(y) + RAIL - 0.16, (y) => deck(y) + RAIL, out)
  }
  flat(wood, s, HW - 0.08, HW + 0.16, all, (y) => deck(y) + RAIL, true)
  for (const yy of [-HALF, HALF]) qn(wood, [s * (HW - 0.04), yy, deck(yy)], [s * (HW + 0.12), yy, deck(yy)], [s * (HW + 0.12), yy, deck(yy) + RAIL], [s * (HW - 0.04), yy, deck(yy) + RAIL], [0, Math.sign(yy), 0])
  // posts
  for (const y of steps(-HALF + 0.15, HALF - 0.15, 8)) {
    const z = deck(y), x = s * (HW + 0.04)
    bevelBox(wood, x, y, 0.15, 0.15, z, z + RAIL + 0.12, 0.03)
    bevelBox(wood, x, y, 0.19, 0.19, z + RAIL + 0.12, z + RAIL + 0.22, 0.04)
  }
  // the piers: an iron column under each rib on a stone footing
  for (const y of [-PIER, PIER]) {
    box(stone, s * HW - 0.45, s * HW + 0.45, y - 0.45, y + 0.45, 0, 0.5)
    box(iron, s * (HW + 0.075) - 0.2, s * (HW + 0.075) + 0.2, y - 0.32, y + 0.32, 0.5, SPR + 0.05)
  }
}
// the walkway planking and the deck's underside between the ribs
for (let i = 0; i + 1 < all.length; i++) {
  const a = all[i], b = all[i + 1]
  qn(deckP, [-HW, a, deck(a)], [HW, a, deck(a)], [HW, b, deck(b)], [-HW, b, deck(b)], [0, 0, 1])
  qn(iron, [-HW, a, deck(a) - 0.3], [HW, a, deck(a) - 0.3], [HW, b, deck(b) - 0.3], [-HW, b, deck(b) - 0.3], [0, 0, -1])
}
// the abutments: rough stone from the water to under the fascia, to the ends
for (const sy of [-1, 1]) {
  const y0 = sy < 0 ? -HALF : AB, y1 = sy < 0 ? -AB : HALF
  box(stone, -(HW + 0.4), HW + 0.4, y0, y1, 0, deck(HALF) - FASCIA)
}

finishModel('Oak Bridge', 'nyc-oak-bridge', [
  { part: wood, material: { name: 'timber', color: 0x7f6853, roughness: 0.85 } },
  { part: dark, material: { name: 'openwork', color: 0x55483c, roughness: 0.9 } },
  { part: iron, material: { name: 'iron', color: 0x6b635b, roughness: 0.7 } },
  { part: stone, material: { name: 'stone', color: 0xa39a8c, roughness: 0.9 } },
  { part: deckP, material: { name: 'walkway', color: 0x9a8670, roughness: 0.9 } },
], { bearing: 327.3, osm: 'way/580520662', height: deck(0) + RAIL + 0.22 }, 5000)
