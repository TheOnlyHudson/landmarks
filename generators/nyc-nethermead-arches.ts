/**
 * Nethermead Arches, Prospect Park, Brooklyn (Calvert Vaux and Frederick
 * Law Olmsted, 1870) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-nethermead-arches.ts
 *
 * Frame (mesh.ts map frame): y across the bridge (bearing 150.9°, the
 * placement's bearing, square to Center Drive), x along it (bearing
 * 240.9°), z up, metres. z = 0 is the lowest ground in the valley under
 * the bridge. Anchor: the centroid of OSM way/701666676 (man_made=bridge,
 * bridge:structure=arch, "Nethermead Arches", 34.6 m along the drive by
 * 17.6 m across), -73.969022 40.662357, which the model draws across in
 * full and so replaces.
 *
 * The bridge carries Center Drive (way/43222456) and a bridle path
 * (way/701666675) over three arches: a footpath (way/43222392), the
 * Ambergill stream, and a bridle path (way/706748256). No road surface is
 * drawn: the infill between the faces stops at 5.7 m, 0.3 m under the
 * drive's 6.0 m (map terrain, Mapterhorn z15, `bun tools/terrain.ts grid`
 * bearing 60.9: the drive's ground at both ends 5.9–6.0 m above the valley
 * floor); the cornice's top is at 6.0 m and the pierced balustrade stands
 * on it to 7.0 m.
 *
 * Evidence
 * - OSM (ODbL): the ways above.
 * - Published (NYC Parks; Prospect Park Alliance; Wikipedia "Prospect
 *   Park"): 1870, three arches carrying Center Drive over a footpath, the
 *   Ambergill and a bridle path; granite, sandstone and brick (the barrels
 *   brick).
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-nethermead-arches/photos), EVIDENCE:
 *   Robert N. Dennis collection stereograph "Nethermead Arches" (NYPL),
 *     public domain,
 *     https://commons.wikimedia.org/wiki/File:Nethermead_Arches,_from_Robert_N._Dennis_collection_of_stereoscopic_views.jpg
 *     (a whole face: three segmental arches, the piers' polygonal
 *     buttresses with conical caps, the string course, cornice and pierced
 *     balustrade; used for the proportions);
 *   Epicgenius, "Prospect Park Brooklyn Mar 2019 50.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_50.jpg
 *     (a face today from the footpath: the pale stone, the trefoil
 *     piercings of the balustrade);
 *   Epicgenius, "Prospect Park Brooklyn Mar 2019 51.jpg" and "… 61.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_51.jpg
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_61.jpg
 *     (on the deck: the balustrade and its end pedestals);
 *   Sgreene24, "Couple under snowy arch.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Couple_under_snowy_arch.jpg
 *     (inside an arch: the red brick soffit, the stone ring and jambs).
 * - Estimated from the stereograph, scaled to the 7.0 m balustrade top:
 *   spans 8.6 m, piers 2.0 m (arch centres 10.6 m apart); the arches
 *   spring at 2.3 m, crowns 4.3 m (circular segments); rings 0.6 m; the
 *   pier buttresses half-octagons 1.5 m across projecting 0.75 m, to 4.4 m
 *   with conical caps to 5.4 m; cornice 5.6–6.0 m; balustrade 1.0 m.
 *
 * Simplified: the trefoils are hexagonal dark piercings in a light rail;
 * the masonry's coursing and the cornice's mouldings are plain.
 *
 * Doubts: no lidar; the arch heights rest on the stereograph's
 * proportions and the terrain's deck height; the two faces are drawn alike
 * (the stereograph shows one; today's photos agree on the other). Which
 * arch takes the footpath and which the bridle path follows OSM.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, bevelBox, box, profile, qn } from './nyc-greyshot-arch'
import { barrel, hull, ring, type Pr } from './nyc-balcony-bridge'
import { tn } from './nyc-endale-arch'

const HY = 8.8, T = 0.7, L = 17.3, SPAN = 8.6, C = 10.6, SPR = 2.3, RISE = 2.0, TOP = 6.0, FILL = 5.7, CORN = 5.6, BAL = 1.0
const centres = [-C, 0, C]
const arch = (c: number): Pr => profile('segment', SPAN / 2, RISE, SPR, 12).map((p): [number, number] => [p[0] + c, p[1]])

function build() {
  const stone = new Part(), trim = new Part(), dark = new Part(), brick = new Part(), fill = new Part()
  const a = SPAN / 2
  const solid: [number, number][] = [[-L, -C - a], [-C + a, -a], [a, C - a], [C + a, L]]
  for (const s of [-1, 1]) {
    const y = s * HY, yi = s * (HY - T), nf: V3 = [0, s, 0]
    // the face: solid between the openings, and over each opening
    for (const [x0, x1] of solid) qn(stone, [x0, y, 0], [x1, y, 0], [x1, y, TOP], [x0, y, TOP], nf)
    for (const c of centres) {
      const pr = arch(c)
      for (let i = 0; i + 1 < pr.length; i++) {
        const [u, zu] = pr[i], [v, zv] = pr[i + 1]
        qn(stone, [u, y, zu], [v, y, zv], [v, y, TOP], [u, y, TOP], nf)
      }
      ring(trim, y, s, pr, 0.6, 0.08)
    }
    // string course over the crowns, cornice under the balustrade
    band(trim, s, HY, 0.1, [-L, L], () => 4.95, () => 5.15)
    band(trim, s, HY, 0.25, [-L, L], () => CORN, () => TOP)
    // the piers' buttresses: half-octagons with a cap band and a conical cap
    for (const px of [-C / 2, C / 2]) {
      const poly = (h: number, d: number, z: number): V3[] =>
        [[-h, 0], [-h, d * 0.4], [-h * 0.6, d], [h * 0.6, d], [h, d * 0.4], [h, 0]].map(([u, w]): V3 => [px + u, y + s * w, z])
      hull(trim, [poly(0.85, 0.85, 0), poly(0.85, 0.85, 0.6), poly(0.75, 0.75, 0.6), poly(0.75, 0.75, 4.25)])
      hull(trim, [poly(0.85, 0.85, 4.25), poly(0.85, 0.85, 4.45)])
      hull(trim, [poly(0.7, 0.7, 4.45), poly(0.35, 0.35, 5.0), poly(0.05, 0.05, 5.45)])
    }
    // the wall top over its thickness and its inner face above the infill
    qn(trim, [-L, y, TOP], [L, y, TOP], [L, yi, TOP], [-L, yi, TOP], [0, 0, 1])
    qn(stone, [-L, yi, FILL], [L, yi, FILL], [L, yi, TOP], [-L, yi, TOP], [0, -s, 0])
    // the balustrade: plinth, a light panel pierced with dark trefoils, coping, end pedestals
    const yb = s * (HY - 0.3), th = 0.13
    box(trim, -L + 0.45, L - 0.45, yb - th - 0.05, yb + th + 0.05, TOP, TOP + 0.15)
    box(trim, -L + 0.45, L - 0.45, yb - th, yb + th, TOP + 0.15, TOP + BAL - 0.15)
    box(trim, -L + 0.45, L - 0.45, yb - th - 0.07, yb + th + 0.07, TOP + BAL - 0.15, TOP + BAL)
    const n = Math.round((2 * L - 0.9) / 0.85)
    for (let j = 0; j < n; j++) {
      const xc = -L + 0.45 + ((2 * L - 0.9) * (j + 0.5)) / n, zc = TOP + BAL / 2, r = 0.2
      for (const side of [-1, 1]) {
        const yy = yb + side * (th + 0.01)
        const pts = Array.from({ length: 6 }, (_, q): V3 => [xc + r * Math.cos((q * Math.PI) / 3), yy, zc + r * Math.sin((q * Math.PI) / 3)])
        for (let q = 1; q < 5; q++) tn(dark, pts[0], pts[q], pts[q + 1], [0, side, 0])
      }
    }
    for (const sx of [-1, 1]) {
      bevelBox(trim, sx * (L - 0.4), yb, 0.4, 0.3, TOP, TOP + BAL + 0.15, 0.05)
      bevelBox(trim, sx * (L - 0.4), yb, 0.46, 0.36, TOP + BAL + 0.15, TOP + BAL + 0.3, 0.05)
    }
  }
  // the ends of the abutments, into the banks
  for (const sx of [-1, 1]) qn(stone, [sx * L, -HY, 0], [sx * L, HY, 0], [sx * L, HY, TOP], [sx * L, -HY, TOP], [sx, 0, 0])
  // the barrels through: brick soffits, stone jamb walls
  for (const c of centres) {
    barrel(brick, arch(c), -HY, HY)
    barrel(stone, [[c - a, 0], [c - a, SPR]], -HY, HY)
    barrel(stone, [[c + a, SPR], [c + a, 0]], -HY, HY)
  }
  // the infill under the drive, asphalt grey
  qn(fill, [-L, -(HY - T), FILL], [L, -(HY - T), FILL], [L, HY - T, FILL], [-L, HY - T, FILL], [0, 0, 1])

  finishModel('Nethermead Arches', 'nyc-nethermead-arches', [
    { part: stone, material: { name: 'stone', color: 0xbcb6a6, roughness: 0.9 } },
    { part: trim, material: { name: 'sandstone', color: 0xcdc6b2, roughness: 0.9 } },
    { part: dark, material: { name: 'openwork', color: 0x8a8372, roughness: 0.9 } },
    { part: brick, material: { name: 'brick', color: 0xa86a5a, roughness: 0.9 } },
    { part: fill, material: { name: 'asphalt', color: 0x8e8e8c, roughness: 0.95 } },
  ], { bearing: 150.9, osm: 'way/701666676', height: TOP + BAL + 0.3 }, 5000)
}

if (import.meta.main) build()
