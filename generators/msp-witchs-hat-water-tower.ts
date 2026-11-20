/**
 * Witch's Hat Tower (Prospect Park Water Tower, 1913, Frederick W.
 * Cappelen), Tower Hill Park, Minneapolis: procedural, CC0-1.0.
 * bun generators/msp-witchs-hat-water-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin at the centroid of OSM way/175087241 (-93.212673, 44.968665).
 * y = 0 is the hilltop the tower stands on (lidar 295.9 m); the hill falls
 * away north and east of it.
 *
 * Form: a tall, slightly tapering cream stucco shaft; at its top a stepped
 * corbel band carrying an octagonal parapet, an open observation gallery of
 * eight round-headed arches between round piers, a balustrade in each
 * arch; over it a wide, flared eave with a dark underside, and the steep
 * green tiled cone of the "witch's hat" with a thin finial rod.
 *
 * Sources
 * - OSM (ODbL): way/175087241 "Witch's Hat Tower" (man_made=water_tower,
 *   building=yes, height 33.528, start_date 1913, NRHP 97001426), the only
 *   building here.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 0.5 m grid with
 *   class 18 kept (work/_towers/lidar18.py): hilltop 295.9 m; the eave rim
 *   23.5-24 above it, the cone's top 33.0 (OSM's 33.5 m, published 110 ft;
 *   the model's apex 33.3).
 * - Photos (Wikimedia Commons, evidence): Bmzuckerman, "Minneapolis, MN -
 *   Prospect Park Water Tower (1).jpg" and "(3).jpg", CC BY 4.0 (the whole
 *   tower from below the hill; the gallery, corbels and taper close up);
 *   Michael Hicks, "Prospect Park Water Tower.jpg", CC BY 2.0 (the
 *   octagonal parapet, piers and eave from below); McGhiever, "Prospect Park
 *   Water Tower early spring.jpg", CC BY-SA 4.0; Ferahgo the Assassin,
 *   "Prospect Park Water Tower Witch's Hat.jpg", CC BY-SA 4.0; Fibonacci
 *   Blue, "The Witch's Hat (30397595786).jpg", CC BY 2.0; Gephart,
 *   "WitchesHatWT.JPG", public domain.
 * - Published: built 1913 to a design by Frederick W. Cappelen, 110 ft
 *   (Wikipedia, "Prospect Park Water Tower"; NRHP 1997).
 * Measured (lidar): the eave and cone heights, the base on the hilltop.
 * Estimated from the photos, scaled by the brim's diameter (OSM's outline,
 *   13.6 m across, matches the brim's extent in lidar, so it was traced from
 *   above) and the photos' brim-to-shaft ratio of 1.3: the shaft's radius
 *   (5.8 at the foot to 5.0 at the top), the corbel band (18.6-19.9), the
 *   octagonal parapet (19.9-21.1), the arches (1.55 m radius, springing
 *   23.0), the drooping brim (25.25 at the wall to its 6.8 m rim at 24.1-24.4,
 *   the top of lidar's 23.5-24 so the arches show from above),
 *   the cone (3.45 m radius at 26.3 to 33.1, as lidar), the finial rod (to
 *   37.5), the colours (cream stucco, olive-green tile, dark brown soffit).
 * Doubts: eight arches is counted from the face widths in two photos, not
 *   from a drawing; which way the octagon faces is not known (a pier is put
 *   due north); the door at the foot of the shaft is hidden by trees in every
 *   photo and left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, prism, flatShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

const N = 8 // arches round the gallery
const RG = 5.0 // the gallery octagon's circumradius (pier centres)

export function build() {
  const stucco = new Part(), green = new Part(), dark = new Part()

  // ---- the shaft, tapering, and the corbel band stepping out under the gallery
  lathe(stucco, 0, 0, [[5.8, 0], [5.6, 6], [5.3, 12], [5.0, 18.6], [5.2, 18.8], [5.2, 19.2], [5.4, 19.4], [5.4, 19.9], [0, 19.9]], 16)

  // ---- the octagonal parapet (pier at north: angles 90 + k * 45)
  const oct = (r: number): XY[] => Array.from({ length: N }, (_, k) => {
    const a = ((90 + (360 * k) / N) * Math.PI) / 180
    return [r * Math.cos(a), r * Math.sin(a)] as XY
  })
  prism(stucco, stucco, ccw(oct(5.6)), 19.9, 21.1)
  // the gallery's dark inner wall (the core holding the tank)
  lathe(dark, 0, 0, [[3.7, 21.1], [3.7, 25.2], [0, 25.2]], 16)

  // ---- piers, arches and the band over them, face by face
  const P = oct(RG)
  for (let k = 0; k < N; k++) {
    const [x, y] = P[k]
    lathe(stucco, x, y, [[0.5, 21.1], [0.5, 21.4], [0.38, 21.5], [0.38, 22.6], [0.48, 22.75], [0.48, 23.0], [0.38, 23.1], [0.38, 25.2], [0, 25.2]], 10)
    const q = P[(k + 1) % N]
    const mx = (x + q[0]) / 2, my = (y + q[1]) / 2
    const nl = Math.hypot(mx, my), n: XY = [mx / nl, my / nl]
    const half = Math.hypot(q[0] - x, q[1] - y) / 2
    const face = { o: [mx, my, 0] as V3, n }
    // the arch's spandrels: the face's wall over the opening, with the opening cut out (as a band round it)
    const r = half - 0.38, zs = 23.0
    // wall above the arch: a polygon following the semicircle from right to left under the top edge
    const arcPts: XY[] = []
    for (let i = 0; i <= 10; i++) {
      const a = (Math.PI * i) / 10
      arcPts.push([r * Math.cos(a), zs + r * Math.sin(a)])
    }
    const wall: XY[] = [[half, zs], [half, 25.2], [-half, 25.2], [-half, zs], ...arcPts.reverse()]
    // thickness: front and back of the spandrel wall
    for (const d of [0.25, -0.25]) {
      const f = d > 0 ? face : { o: face.o, n: [-n[0], -n[1]] as XY }
      const pts = d > 0 ? wall : wall.map(([s, z]) => [-s, z] as XY)
      flatShape(stucco, f, pts, Math.abs(d))
    }
    // the intrados of the arch
    for (let i = 0; i < 10; i++) {
      const a0 = (Math.PI * i) / 10, a1 = (Math.PI * (i + 1)) / 10
      const t: XY = [-n[1], n[0]]
      const pt = (a: number, d: number): V3 => [mx + t[0] * r * Math.cos(a) + n[0] * d, my + t[1] * r * Math.cos(a) + n[1] * d, zs + r * Math.sin(a)]
      stucco.quad(pt(a0, 0.25), pt(a0, -0.25), pt(a1, -0.25), pt(a1, 0.25))
      stucco.quad(pt(a0, 0.25), pt(a1, 0.25), pt(a1, -0.25), pt(a0, -0.25))
    }
    // the balustrade, drawn solid, set into the opening
    const bx0 = -half + 0.4, bx1 = half - 0.4
    const bal = (d: number, f: typeof face) => flatShape(stucco, f, [[bx0, 21.1], [bx1, 21.1], [bx1, 22.0], [bx0, 22.0]], d)
    bal(0.1, face)
    bal(0.1, { o: face.o, n: [-n[0], -n[1]] })
    stucco.quad([mx - n[1] * bx0 + n[0] * 0.1, my + n[0] * bx0 + n[1] * 0.1, 22.0], [mx - n[1] * bx1 + n[0] * 0.1, my + n[0] * bx1 + n[1] * 0.1, 22.0], [mx - n[1] * bx1 - n[0] * 0.1, my + n[0] * bx1 - n[1] * 0.1, 22.0], [mx - n[1] * bx0 - n[0] * 0.1, my + n[0] * bx0 - n[1] * 0.1, 22.0])
  }
  // the band over the arches
  prism(stucco, null, ccw(oct(5.45)), 24.9, 25.25)

  // ---- the eave: a wide flared overhang, dark underneath, green on top
  lathe(dark, 0, 0, [[0.1, 25.25], [5.4, 25.25], [6.2, 24.85], [6.8, 24.1]], 16)
  lathe(dark, 0, 0, [[6.8, 24.1], [6.85, 24.4]], 16)
  // the hat: the flared eave sweeping up into the steep cone
  lathe(green, 0, 0, [[6.85, 24.4], [6.3, 25.0], [5.4, 25.7], [4.2, 26.1], [3.45, 26.3], [0.1, 33.1], [0, 33.15]], 16)
  // the finial rod
  lathe(dark, 0, 0, [[0.16, 32.7], [0.12, 37.4], [0, 37.5]], 6)

  return finishGlb('msp-witchs-hat-water-tower', [
    { part: stucco, material: PALETTE.stone },
    { part: green, material: finish('witchs-hat-green', 0x67874f) },
    { part: dark, material: finish('witchs-hat-soffit', 0x5c4c40) },
  ], { name: "Witch's Hat Tower" }, 5000)
}

if (import.meta.main) await writeModel('msp-witchs-hat-water-tower', build())
