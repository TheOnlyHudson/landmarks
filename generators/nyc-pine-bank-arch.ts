/**
 * Pine Bank Arch, Central Park, over the bridle path near Columbus Circle
 * (Calvert Vaux and Jacob Wrey Mould, 1861; restored 1984) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-pine-bank-arch.ts
 *
 * Frame (mesh.ts map frame): x along the bridge (bearing 43.3°), y across
 * it (the placement's bearing, 313.3°, along the bridle path below), z up,
 * metres; z = 0 is the bridle path under the span. Anchor: the middle of OSM
 * way/44225587 (footway, bridge=yes, surface=wood, "Pinebank Arch"). OSM
 * maps no man_made=bridge outline or building here, so `replaces` is empty;
 * the walkway's planking is the model's (a footbridge), the paths beyond
 * its ends are the map's.
 *
 * Evidence
 * - OSM (ODbL): the footway on the bridge way/44225587, 24.6 m end to end;
 *   the bridle path under it way/128580942.
 * - HAER NY-196 (Library of Congress, public domain): "Central Park Bridges,
 *   Pinebank Arch", overall view to the north during the 1980s
 *   rehabilitation (the iron ribs, the stone abutments, the railing):
 *   https://commons.wikimedia.org/wiki/File:OVERALL_VIEW_TO_NORTH_OF_BRIDGE_SHOWING_STRUCTURE_-_Central_Park_Bridges,_Pinebank_Arch,_Near_Columus_Circle_entrance,_Central_Park,_New_York,_New_York_County,_NY_HAER_NY,31-NEYO,153B-2.tif
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-pine-bank-arch/photos):
 *   Tony Hisgett, "Bridge Central Park (6213965027).jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Bridge_Central_Park_(6213965027).jpg
 *     (side-on from the bridle path: the flat iron arch, the fascia with
 *     its interlace and rosettes, the railing, the end posts and the stone
 *     abutment);
 *   Pablo Costa Tirado, "Pine Bank Arch Bridge, from 1861 - panoramio.jpg",
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Pine_Bank_Arch_Bridge,_from_1861_-_panoramio.jpg
 *     (along the deck: cream-painted railings, finial posts, plank deck).
 * - Estimated from the side-on photo scaled to the OSM length: span between
 *   the abutment faces 19 m; a very flat iron arch; fascia about 0.9 m; a
 *   railing 1.15 m on a walkway 3.6 m wide; finial posts at the ends and
 *   over the abutments. Deck and soffit heights: see DECK/CROWN below.
 *
 * Simplified: the railing's tracery is a cream band with a row of dark
 * openings; the fascia's interlace and rosettes are left out; the arch rib
 * is a proud cream band along the soffit. The abutments are drawn as low
 * dark stone blocks under the arch's ends (the banks bury the rest).
 *
 * Doubts: Hisgett's photo is identified as Pine Bank by its setting (the
 * bridle path, the rock outcrop) and its match with HAER's railing; the
 * deck's camber is a parabola.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { bevelBox, box, qn, steps } from './nyc-greyshot-arch'

const paint = new Part(), dark = new Part(), stone = new Part(), wood = new Part()
const HALF = 12.0, SPAN = 9.5, HW = 1.8 // half length, half span, half walkway width
export const DECK_END = 3.9, DECK_MID = 4.4, SPRING = 2.4, CROWN = 3.45
const deck = (x: number) => DECK_END + (DECK_MID - DECK_END) * (1 - (x / HALF) ** 2)
const R = (SPAN * SPAN + (CROWN - SPRING) ** 2) / (2 * (CROWN - SPRING))
const arch = (x: number) => CROWN - R + Math.sqrt(R * R - x * x)
const RAIL = 1.15, FASCIA = 0.9

/** A strip on the face y = s·yo between lo(x) and hi(x), facing ±y. */
function face(p: Part, s: number, yo: number, xs: number[], lo: (x: number) => number, hi: (x: number) => number, out = 1) {
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(p, [a, s * yo, lo(a)], [b, s * yo, lo(b)], [b, s * yo, hi(b)], [a, s * yo, hi(a)], [0, s * out, 0])
  }
}
/** A horizontal strip between y offsets o0..o1 at z(x), up or down. */
function flat(p: Part, s: number, o0: number, o1: number, xs: number[], z: (x: number) => number, up: boolean) {
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(p, [a, s * o0, z(a)], [b, s * o0, z(b)], [b, s * o1, z(b)], [a, s * o1, z(a)], [0, 0, up ? 1 : -1])
  }
}

const all = steps(-HALF, HALF, 24), span = steps(-SPAN, SPAN, 20)
const lo = (x: number) => (Math.abs(x) < SPAN ? arch(x) : deck(x) - FASCIA)
for (const s of [-1, 1]) {
  // the fascia: cream iron from the arch rib (over the span) to the deck
  face(paint, s, HW + 0.2, span, arch, deck)
  // the arch rib: a bolder cream band along the soffit, proud of the fascia
  face(paint, s, HW + 0.3, span, arch, (x) => arch(x) + 0.32)
  flat(paint, s, HW + 0.2, HW + 0.3, span, (x) => arch(x) + 0.32, true)
  flat(paint, s, HW + 0.2, HW + 0.3, span, arch, false)
  // the fascia carried on over the abutments to the ends
  for (const sx of [-1, 1]) {
    const xs = sx < 0 ? steps(-HALF, -SPAN, 3) : steps(SPAN, HALF, 3)
    face(paint, s, HW + 0.2, xs, (x) => deck(x) - FASCIA, deck)
    flat(paint, s, 0, HW + 0.2, xs, (x) => deck(x) - FASCIA, false)
  }
  face(paint, s, HW + 0.28, all, (x) => deck(x) - 0.14, deck) // a moulding at its top
  flat(paint, s, HW + 0.2, HW + 0.28, all, deck, true)
  flat(paint, s, HW + 0.2, HW + 0.28, all, (x) => deck(x) - 0.14, false)
  // the railing: cream rails top and bottom, a dark openwork panel between
  for (const [o, out] of [[HW + 0.12, 1], [HW - 0.06, -1]] as [number, number][]) {
    face(paint, s, o, all, deck, (x) => deck(x) + 0.16, out)
    face(paint, s, o, all, (x) => deck(x) + 0.16, (x) => deck(x) + RAIL - 0.14, out)
    // the pierced pattern: a row of dark openings
    const pitch = 0.5
    for (let x = -HALF + 0.6; x <= HALF - 0.5; x += pitch) {
      if ([SPAN, HALF - 0.3].some((q) => Math.abs(Math.abs(x) - q) < 0.4)) continue
      const zc = deck(x) + RAIL / 2 + 0.01, r = 0.2, yy = s * (o + out * 0.012)
      const pts = Array.from({ length: 6 }, (_, k): V3 => [x + r * Math.cos((k * Math.PI) / 3), yy, zc + r * Math.sin((k * Math.PI) / 3)])
      for (let k = 1; k < 5; k++) {
        const g = (pts[k][0] - pts[0][0]) * (pts[k + 1][2] - pts[0][2]) - (pts[k][2] - pts[0][2]) * (pts[k + 1][0] - pts[0][0])
        if ((g > 0 ? -1 : 1) === s * out) dark.tri(pts[0], pts[k], pts[k + 1]); else dark.tri(pts[0], pts[k + 1], pts[k])
      }
    }
    face(paint, s, o, all, (x) => deck(x) + RAIL - 0.14, (x) => deck(x) + RAIL, out)
  }
  flat(paint, s, HW - 0.1, HW + 0.16, all, (x) => deck(x) + RAIL, true)
  // posts: tall finial posts at the ends and over the abutments
  for (const x of [-HALF + 0.3, -SPAN, SPAN, HALF - 0.3]) {
    const y = s * (HW + 0.03), z = deck(x)
    bevelBox(paint, x, y, 0.22, 0.22, z - 0.2, z + RAIL + 0.25, 0.04)
    bevelBox(paint, x, y, 0.27, 0.27, z + RAIL + 0.25, z + RAIL + 0.38, 0.04)
    const tip: V3 = [x, y, z + RAIL + 1.0], b = z + RAIL + 0.38, r = 0.2
    const c: V3[] = [[x - r, y - r, b], [x + r, y - r, b], [x + r, y + r, b], [x - r, y + r, b]]
    for (let k = 0; k < 4; k++) paint.tri(c[k], c[(k + 1) % 4], tip)
  }
}
// the arch's underside across the width, and the walkway planking
for (let i = 0; i + 1 < span.length; i++) {
  const a = span[i], b = span[i + 1], w = HW + 0.2
  qn(paint, [a, -w, arch(a)], [b, -w, arch(b)], [b, w, arch(b)], [a, w, arch(a)], [0, 0, -1])
}
for (let i = 0; i + 1 < all.length; i++) {
  const a = all[i], b = all[i + 1]
  qn(wood, [a, -HW, deck(a)], [b, -HW, deck(b)], [b, HW, deck(b)], [a, HW, deck(a)], [0, 0, 1])
}
// the abutments: low dark stone blocks under the arch's ends, up to the fascia
for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -(SPAN + 1.6) : SPAN, x1 = sx < 0 ? -SPAN : SPAN + 1.6
  box(stone, x0, x1, -(HW + 0.35), HW + 0.35, 0, deck(SPAN) - FASCIA)
}
void lo

finishModel('Pine Bank Arch', 'nyc-pine-bank-arch', [
  { part: paint, material: { name: 'cast-iron-cream', color: 0xe4dbc4, roughness: 0.7 } },
  { part: dark, material: { name: 'openwork', color: 0xa39d88, roughness: 0.9 } },
  { part: stone, material: { name: 'stone', color: 0x857c70, roughness: 0.9 } },
  { part: wood, material: { name: 'walkway', color: 0x9a8670, roughness: 0.9 } },
], { bearing: 313.3, height: DECK_MID + RAIL + 1.0 }, 5000)
