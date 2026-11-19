/**
 * Siegessäule (Victory Column), Großer Stern, Berlin (Heinrich Strack,
 * 1864-1873; moved here and raised in 1938-39; Victoria by Friedrich Drake):
 * procedural, CC0-1.0, no textures. bun generators/berlin-siegessaeule.ts
 *
 * Writes models/berlin-siegessaeule.glb (low) and
 * models/berlin-siegessaeule.detail.glb (detail, with the full Victoria,
 * fluted drums, cannon barrels with their muzzles and cascabels, laurel
 * festoons and the platform railing).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 353.4 (the
 * granite base's faces in OSM way/56226088): model +y is compass 353.4.
 * Anchor: the area centroid of the monument's outline way/718035022, lng
 * 13.35011, lat 52.51451; the column stands on it. Victoria faces model -x
 * (west, towards Ernst-Reuter-Platz). z = 0 is the ground at the foot of
 * the steps (the island is flat).
 *
 * What makes it the Siegessäule, and how each is drawn
 * - The round flight of steps and the square base of polished red granite
 *   with its cornice and the four bronze relief panels (one on each face).
 * - The round column hall on the base: sixteen real granite columns round
 *   the drum carrying Anton von Werner's glass mosaic, under a granite
 *   entablature and a green copper roof.
 * - The column of four fluted sandstone drums (dark, weathered), the lower
 *   three ringed with the gilded captured cannon barrels standing in the
 *   flutes (twenty each), the top one with gilded laurel festoons; the
 *   astragal rings between the drums.
 * - The eagle capital and the viewing platform at 50.7 m with its gilt
 *   railing, the round pedestal over it.
 * - Victoria ("Goldelse"), gilt, 8.3 m: the eagle helmet, the laurel wreath
 *   raised in her right hand, the staff with the Iron Cross in its wreath
 *   and the ribbons in her left, the great raised wings, and the robe with
 *   its overfold flaring round her feet.
 *
 * Evidence
 * - OSM (ODbL): way/718035022 (building=civic, historic=monument,
 *   "Siegessäule", wikidata Q154987) and its parts: the stepped platform
 *   way/131446869, /868, /864, /870, /862 (0-1.8 m, radii 29.5 to 21.9 m);
 *   the base way/56226088 (1.8-9.2 m, 25.7 m square with notched corners,
 *   #DDB692 is the wrong colour: the base is red granite); the hall podium
 *   way/103812721 (9.2-11.2, radius 8.65), its sixteen columns
 *   (way/103812705-727, 11.2-15.9, on a radius of 8.0 m), the mosaic drum
 *   way/131553982 (radius 3.95), the hall roof way/103889403 (15.9-18); the
 *   column's pedestal and drums (way/131553979 ... way/131632049, radius
 *   2.55); the cannon barrels (way/224133887 ... 224133972); the statue
 *   pedestal way/103812715.
 * - Published (de.wikipedia "Siegessäule (Berlin)", en.wikipedia "Victory
 *   Column"): red granite base 18.8 m square widened by 6.5 m in 1939
 *   and 7.2 m high; the hall's 16 granite columns 4.7 m; four sandstone
 *   drums, the lower three with 60 gilded captured cannon barrels, the top
 *   one (added 1939) with gilded laurel festoons; the viewing platform at
 *   50.66 m; Victoria 8.32 m, 35 t, gilt bronze, facing west since 1939;
 *   total height about 67 m.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Siegessäule Berlin - victory column Berlin - 01.jpg" and "- 02.jpg",
 *     Norbert Nagel, CC BY-SA 3.0 (the column square-on from the west:
 *     drums, cannon bands, capital, platform, Victoria frontal)
 *     https://commons.wikimedia.org/wiki/File:Siegess%C3%A4ule_Berlin_-_victory_column_Berlin_-_01.jpg
 *   "Berlin Victory Column 04.jpg", Flocci Nivis, CC BY 4.0 (the whole
 *     monument from the north-east with steps and base: every height)
 *     https://commons.wikimedia.org/wiki/File:Berlin_Victory_Column_04.jpg
 *   "Victoria statue on the Berlin Victory Column, Berlin.jpg", Christian
 *     David, CC BY-SA 4.0 (Victoria close up: wreath, staff, cross, ribbons,
 *     helmet eagle, wings, robe)
 *     https://commons.wikimedia.org/wiki/File:Victoria_statue_on_the_Berlin_Victory_Column,_Berlin.jpg
 *   "2025-05-28 Stadtansicht Berlin; Siegessäule Großer Stern STP 5757.jpg",
 *     Steffen Prößdorf, CC BY-SA 4.0 (Victoria, the platform railing, the
 *     eagle capital)
 *     https://commons.wikimedia.org/wiki/File:2025-05-28_Stadtansicht_Berlin;_Siegess%C3%A4ule_Gro%C3%9Fer_Stern_STP_5757.jpg
 *   "Victory Column or Siegessäule in Berlin Tiergarten 0965.jpg", Dosseman,
 *     CC BY-SA 4.0; "Berlin Victory Column at afternoon.jpg", Leonhard Lenz,
 *     CC BY-SA 4.0; "Berliner Siegessäule - Berlin Victory Column
 *     photo3.jpg", Sami Mlouhi, CC BY-SA 4.0.
 * - Measured from the Flocci Nivis photo (23.5 px/m, the base's 7.4 m as
 *   scale; checked against the published 50.66 m platform, which it gives
 *   as 50.8): steps 1.8; base top 9.2; hall podium 11.2; hall columns to
 *   16.2, entablature to 18.0; shaft from 21.7 to 48.7 in four equal drums
 *   (diameter 4.9 m at the foot, 4.3 m at the top); platform 50.8;
 *   pedestal to 54.4; Victoria's head 62.4, her wreath 63.6, the staff's
 *   point 66.6. OSM's tagged heights above 20 m run about 4 m high against
 *   the photos and the published platform height and are not used.
 * - Plan from OSM; the base centred on the column (OSM has it 1 m west).
 * - Estimated: the relief panels' height (4.0-6.5 m); the cannon band
 *   length (2 m); the base's low copper roof.
 * - Invented/simplified: Victoria's drapery folds, the eagle capital's
 *   relief (four eagles), the relief panels as flat bronze.
 * - Look-only references: none.
 * - Doubts: none on the massing; the mosaic's colour is an average.
 *
 * Night: the column, base and hall are floodlit (`_FLOODLIGHT`), Victoria
 * glows gold, the hall's mosaic is lit (named as a window).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, cylinder } from './dc-white-house'
import { wallsPoly, capPoly, type XY } from './dc-national-cathedral'
import { ellipsoid, tube, solid, slab, TAU } from './nyc-columbus-monument'
import { ell, place, LOW, HIGH, type Q } from './london-albert-memorial'
import { lathe as rev } from './berlin-fernsehturm'
import { welded } from './berlin-kit'
import { mat } from './berlin-konzerthaus'

export const ID = 'berlin-siegessaeule'
export const BEARING = 353.4

// Heights (see header).
const ZST = 1.8, ZB = 9.2, ZHP = 11.2, ZHC = 16.2, ZHE = 18.0
const ZS0 = 21.7, ZS1 = 48.7, ZPL = 50.8, ZPED = 54.6
const R0 = 2.45, R1 = 2.15 // shaft radius at foot and top
const shaftR = (z: number) => R0 + ((R1 - R0) * (z - ZS0)) / (ZS1 - ZS0)

/**
 * Victoria, facing local +y, feet at the origin, h her height to the top
 * of the helmet.
 */
function victoria(q: Part, Q: Q, h: number) {
  const D = Q.detail, n = D ? 18 : 8
  const H = (x: number, y: number, z: number): V3 => [x * h, y * h, z * h]
  const r = (z: number, rx: number, ry: number, dx = 0, dy = 0) => ell(dx * h, dy * h, z * h, rx * h, ry * h, n)
  // The robe from its flaring hem (blown back a little) to the waist, the
  // bodice to the shoulders and neck.
  solid(q, [r(0.0, 0.25, 0.2, 0.02, -0.03), r(0.08, 0.21, 0.16, 0.01, -0.02), r(0.25, 0.15, 0.11), r(0.45, 0.12, 0.085), r(0.55, 0.105, 0.075)])
  solid(q, [r(0.55, 0.105, 0.075), r(0.64, 0.11, 0.075, 0, 0.005), r(0.74, 0.13, 0.08, 0, 0.01), r(0.8, 0.125, 0.07, 0, 0.01), r(0.84, 0.045, 0.045, 0, 0.015)])
  // The overfold (apoptygma) hanging over the hips, wider than the skirt.
  solid(q, [r(0.48, 0.15, 0.115), r(0.6, 0.125, 0.095), r(0.64, 0.11, 0.08)])
  if (D) {
    // Folds: a few long ridges down the skirt and the hem's turned-back edge.
    for (let i = 0; i < 10; i++) {
      const a = (i * TAU) / 10 + 0.2
      tube(q, [H(0.105 * Math.cos(a), 0.08 * Math.sin(a), 0.5), H(0.15 * Math.cos(a), 0.11 * Math.sin(a), 0.25), H(0.24 * Math.cos(a), 0.19 * Math.sin(a) - 0.02, 0.02)], [0.012 * h, 0.018 * h, 0.022 * h], 5)
    }
    const hem: V3[] = Array.from({ length: 25 }, (_, i): V3 => H(0.25 * Math.cos((i * TAU) / 24) + 0.02, 0.2 * Math.sin((i * TAU) / 24) - 0.03, 0.025 + 0.012 * Math.sin((i * TAU * 3) / 24)))
    tube(q, hem, hem.map(() => 0.022 * h), 5)
    // Her left foot stepping out from under the hem.
    ellipsoid(q, H(-0.05, 0.2, 0.015), [0.035 * h, 0.07 * h, 0.025 * h], 8, 3)
    // Belt.
    solid(q, [r(0.62, 0.112, 0.078), r(0.64, 0.112, 0.078)])
  }
  // Head with the helmet and its eagle.
  ellipsoid(q, H(0, 0.02, 0.9), [0.06 * h, 0.066 * h, 0.075 * h], D ? 12 : 6, D ? 6 : 3)
  ellipsoid(q, H(0, 0.012, 0.935), [0.068 * h, 0.074 * h, 0.05 * h], D ? 12 : 6, D ? 4 : 2)
  ellipsoid(q, H(0, 0.03, 0.995), [0.025 * h, 0.03 * h, 0.03 * h], D ? 8 : 4, D ? 4 : 2)
  for (const e of [-1, 1]) slab(q, H(e * 0.015, 0.02, 1.0), [e * 0.9, 0, 0.45], [0, 0.2, 1], [[0, -0.01 * h], [0.09 * h, 0.02 * h], [0.07 * h, 0.05 * h], [0, 0.025 * h]], 0.008 * h)
  if (D) for (const e of [-1, 1]) tube(q, [H(e * 0.05, -0.02, 0.9), H(e * 0.07, -0.05, 0.84), H(e * 0.06, -0.04, 0.8)], [0.03 * h, 0.03 * h, 0.02 * h], 5) // hair
  // Right arm raised with the laurel wreath.
  tube(q, [H(0.13, 0, 0.8), H(0.19, 0.02, 0.93), H(0.215, 0.035, 1.06)], [0.04 * h, 0.033 * h, 0.028 * h], D ? 8 : 4)
  if (D) tube(q, [H(0.11, 0.0, 0.79), H(0.2, 0.0, 0.76), H(0.24, -0.01, 0.7)], [0.03 * h, 0.04 * h, 0.02 * h], 5) // sleeve
  const wm = D ? 20 : 8
  const wr: V3[] = Array.from({ length: wm + 1 }, (_, k): V3 => H(0.22 + 0.06 * Math.cos((k * TAU) / wm), 0.04, 1.135 + 0.065 * Math.sin((k * TAU) / wm)))
  tube(q, wr, wr.map(() => (D ? 0.013 : 0.018) * h), D ? 5 : 3)
  if (D) for (let k = 0; k < 16; k++) {
    const a = (k * TAU) / 16, c = H(0.22 + 0.06 * Math.cos(a), 0.04, 1.135 + 0.065 * Math.sin(a))
    ellipsoid(q, [c[0] + 0.012 * h * Math.cos(a), c[1], c[2] + 0.012 * h * Math.sin(a)], [0.012 * h, 0.006 * h, 0.006 * h], 5, 2, 0, -a)
  }
  // Left arm forward and down to the staff at her side.
  tube(q, [H(-0.13, 0, 0.8), H(-0.19, 0.05, 0.68), H(-0.17, 0.12, 0.64)], [0.04 * h, 0.033 * h, 0.03 * h], D ? 8 : 4)
  // The staff, the wreath with the Iron Cross at its head, the point, the ribbons.
  const sx = -0.17, sy = 0.13
  tube(q, [H(sx, sy, 0.1), H(sx, sy, 1.27)], [0.012 * h, 0.012 * h], D ? 6 : 4)
  const cz = 1.31, cr = 0.045, cm = D ? 16 : 6
  const cw: V3[] = Array.from({ length: cm + 1 }, (_, k): V3 => H(sx + cr * Math.cos((k * TAU) / cm), sy, cz + cr * Math.sin((k * TAU) / cm)))
  tube(q, cw, cw.map(() => 0.011 * h), D ? 5 : 3)
  for (const [dx, dz] of [[1, 0], [0, 1]]) cbox(q, rect(H(sx - (dx ? cr : 0.012), 0, 0)[0], H(sx + (dx ? cr : 0.012), 0, 0)[0], (sy - 0.006) * h, (sy + 0.006) * h), (cz - (dz ? cr : 0.012)) * h, (cz + (dz ? cr : 0.012)) * h, { bottom: true })
  tube(q, [H(sx, sy, cz + cr), H(sx, sy, 1.42), H(sx, sy, 1.44)], [0.018 * h, 0.012 * h, 0.002 * h], 4)
  for (let k = 0; k < (D ? 3 : 1); k++) slab(q, H(sx + 0.01, sy, 1.24 - 0.01 * k), [0.15, -0.25, -1], [1, 0.2, 0], [[0, 0], [0.012 * h, 0], [0.32 * h - 0.04 * k * h, 0.06 * h + 0.03 * k * h], [0.3 * h, 0.07 * h + 0.03 * k * h]], 0.004 * h)
  // The wings: raised and spread behind her shoulders, coverts and primaries.
  for (const e of [-1, 1]) {
    const root = H(e * 0.06, -0.07, 0.77)
    const U: V3 = [e * 0.78, -0.25, 0.58], V: V3 = [e * 0.45, -0.25, -0.85]
    slab(q, root, U, V, [[0, -0.04 * h], [0.38 * h, 0.0], [0.47 * h, 0.08 * h], [0.32 * h, 0.2 * h], [0.04 * h, 0.17 * h]], 0.03 * h)
    const nf = D ? 7 : 3
    for (let k = 0; k < nf; k++) {
      const f = k / (nf - 1), len = (0.36 - 0.12 * f) * h
      const o: V3 = [root[0] + U[0] * (0.32 - 0.22 * f) * h, root[1] + U[1] * (0.32 - 0.22 * f) * h, root[2] + U[2] * (0.32 - 0.22 * f) * h]
      const dir: V3 = [U[0] * (1 - f) + V[0] * f * 1.1, U[1], U[2] * (1 - f) - 0.6 * f]
      slab(q, o, dir, V, [[0, 0], [len, 0.02 * h], [len * 0.95, 0.06 * h], [0.05 * h, 0.07 * h]], 0.016 * h)
    }
  }
}

function build(hi: boolean) {
  const Q: Q = hi ? HIGH : LOW
  const granite = new Part(), sand = new Part(), gilt = new Part(), steps = new Part(), patina = new Part(), mosaic = new Part()
  const bronze = sand // the reliefs and the hall's capitals: dark like the shaft
  const k = hi ? 48 : 20
  // ===== Steps (round) ======================================================
  rev([[23.4, 0], [23.4, 0.72], [22.9, 0.72], [22.9, 1.08], [22.4, 1.08], [22.4, 1.44], [21.9, 1.44], [21.9, ZST], [0, ZST]], () => steps, hi ? 64 : 40, 20)
  // ===== The granite base ===================================================
  const B = 12.75, N = 1.5, NW = 3.3
  const ring: XY[] = [
    [-B + NW, -B - 0], [B - NW, -B], [B - NW, -B + N], [B - N, -B + N], [B - N, -B + NW], [B, -B + NW],
    [B, B - NW], [B - N, B - NW], [B - N, B - N], [B - NW, B - N], [B - NW, B], [-B + NW, B],
    [-B + NW, B - N], [-B + N, B - N], [-B + N, B - NW], [-B, B - NW], [-B, -B + NW], [-B + N, -B + NW], [-B + N, -B + N], [-B + NW, -B + N],
  ]
  wallsPoly(granite, ring, ZST, ZB - 0.8)
  const grown = ring.map(([x, y]): XY => [x + Math.sign(x) * 0.45, y + Math.sign(y) * 0.45])
  wallsPoly(granite, grown, ZB - 0.8, ZB)
  capPoly(granite, grown, ZB - 0.8, false)
  capPoly(steps, grown, ZB, true)
  // Relief panels (bronze) on each face, the door on the south.
  for (let s = 0; s < 4; s++) {
    const a = (s * TAU) / 4, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const P = (u: number, z: number, d: number): V3 => [n[0] * (B + d) + t[0] * u, n[1] * (B + d) + t[1] * u, z]
    qf(bronze, P(-6.0, 4.0, 0.06), P(6.0, 4.0, 0.06), P(6.0, 6.5, 0.06), P(-6.0, 6.5, 0.06), [n[0], n[1], 0])
    if (hi) {
      // The relief's raised figures, a frieze of low bumps.
      for (let i = 0; i < 18; i++) {
        const u = -5.6 + (i * 11.2) / 17
        ellipsoid(bronze, P(u, 5.1 + 0.25 * Math.sin(i * 1.7), 0.12), [0.25, 0.25, 0.85], 6, 3, a)
      }
      cbox(granite, rect(Math.min(P(-6.3, 0, 0)[0], P(6.3, 0, 0.25)[0]), Math.max(P(-6.3, 0, 0)[0], P(6.3, 0, 0.25)[0]), Math.min(P(-6.3, 0, 0)[1], P(6.3, 0, 0.25)[1]), Math.max(P(-6.3, 0, 0)[1], P(6.3, 0, 0.25)[1])), 6.6, 6.9, { bottom: true })
    }
    if (s === 3) qf(mosaic, P(-1.2, ZST, 0.07), P(1.2, ZST, 0.07), P(1.2, ZST + 2.6, 0.07), P(-1.2, ZST + 2.6, 0.07), [n[0], n[1], 0])
  }
  // ===== The column hall ====================================================
  rev([[8.2, ZB], [8.2, ZHP], [4.0, ZHP]], () => granite, k, 20)
  rev([[4.0, ZHP], [4.0, ZHP + 0.8]], () => granite, k, 20)
  rev([[4.0, ZHP + 0.8], [4.0, ZHC]], () => mosaic, k, 20)
  for (let i = 0; i < 16; i++) {
    const a = (i * TAU) / 16 + TAU / 32, x = 7.25 * Math.cos(a), y = 7.25 * Math.sin(a)
    if (hi) {
      cbox(granite, rect(x - 0.55, x + 0.55, y - 0.55, y + 0.55), ZHP, ZHP + 0.3)
      rev([[0.52, ZHP + 0.3], [0.45, ZHP + 0.55], [0.4, ZHP + 0.55]], () => granite, 12, 40, [x, y])
      cylinder(granite, x, y, 0.4, ZHP + 0.55, ZHC - 0.6, 12, 0.36)
      rev([[0.36, ZHC - 0.6], [0.5, ZHC - 0.25], [0.6, ZHC - 0.25], [0.6, ZHC]], () => bronze, 12, 40, [x, y])
    } else {
      cylinder(granite, x, y, 0.42, ZHP, ZHC - 0.4, 6, 0.38)
      cbox(granite, rect(x - 0.55, x + 0.55, y - 0.55, y + 0.55), ZHC - 0.4, ZHC)
    }
  }
  // Entablature, ceiling and the copper roof up to the column's pedestal.
  rev([[7.75, ZHC], [7.75, ZHE - 0.5], [8.05, ZHE - 0.2], [8.05, ZHE]], () => granite, k, 30)
  rev([[4.0, ZHC], [7.75, ZHC]], () => granite, k, 20) // ceiling, seen from below
  rev([[8.05, ZHE], [3.6, ZHE + 0.9]], () => patina, k, 20)
  // ===== The column =========================================================
  rev([[3.6, ZHE + 0.9], [3.6, 20.4], [3.1, 20.6], [3.1, 21.0], [2.85, 21.3], [2.65, ZS0]], () => sand, k, 35)
  const drums = [ZS0, 28.45, 35.2, 41.95, ZS1]
  if (hi) {
    // Fluted drums: 24 flutes as an alternating star section.
    const F = 24, segs = F * 2
    for (let d = 0; d < 4; d++) {
      const za = drums[d] + (d ? 0.18 : 0), zb = drums[d + 1] - 0.18
      const rings = [za, zb].map((z) => Array.from({ length: segs }, (_, i): V3 => {
        const a = (i * TAU) / segs, rr = shaftR(z) - (i % 2 ? 0.1 : 0)
        return [rr * Math.cos(a), rr * Math.sin(a), z]
      }))
      sand.loft(rings)
    }
  } else rev([[R0, ZS0], [R1, ZS1]], () => sand, 12, 40)
  // Astragal rings at the joints.
  for (const z of drums.slice(1, 4)) rev([[shaftR(z) + 0.02, z - 0.2], [shaftR(z) + 0.2, z - 0.1], [shaftR(z) + 0.2, z + 0.1], [shaftR(z) + 0.02, z + 0.2]], () => sand, hi ? 32 : 12, 60)
  // The gilded cannon barrels in the lower three drums, laurel festoons in the top one.
  for (let d = 0; d < 4; d++) {
    const z0 = drums[d] + 0.35, z1 = z0 + 2.0
    const nb = 20
    for (let i = 0; i < nb; i++) {
      const a = (i * TAU) / nb + (hi ? TAU / 48 : 0)
      const rr = shaftR(z0) + 0.05
      const at = (z: number, o = 0): V3 => [(rr + o) * Math.cos(a), (rr + o) * Math.sin(a), z]
      if (d < 3) {
        // Barrel: muzzle up, the breech and the cascabel knob at the bottom.
        if (hi) {
          rev([[0.0, z0], [0.07, z0], [0.1, z0 + 0.12], [0.2, z0 + 0.22], [0.22, z0 + 0.55], [0.17, z0 + 1.7], [0.2, z0 + 1.85], [0.2, z0 + 1.98], [0.0, z0 + 1.98]], () => gilt, 8, 40, [at(0, 0.12)[0], at(0, 0.12)[1]])
          tube(gilt, [at(z0 + 0.6, -0.05), at(z0 + 0.6, 0.12)], [0.06, 0.06], 4)
        } else tube(gilt, [at(z0, 0.12), at(z0 + 0.3, 0.14), at(z1, 0.12)], [0.12, 0.2, 0.15], 4)
      } else {
        // Festoon: a swag hanging between two drops, gilt.
        const b = a + TAU / nb, m = (a + b) / 2, rf = shaftR(z0) + 0.12
        if (hi) {
          const sw: V3[] = Array.from({ length: 7 }, (_, j): V3 => { const t = j / 6, aa = a + (b - a) * t; return [rf * Math.cos(aa), rf * Math.sin(aa), z0 + 1.6 - 0.8 * Math.sin(Math.PI * t)] })
          tube(gilt, sw, sw.map((_, j) => 0.08 + 0.06 * Math.sin((Math.PI * j) / 6)), 5)
          tube(gilt, [[rf * Math.cos(a), rf * Math.sin(a), z0 + 1.7], [rf * Math.cos(a), rf * Math.sin(a), z0 + 0.6]], [0.08, 0.05], 4)
        } else tube(gilt, [[rf * Math.cos(a), rf * Math.sin(a), z0 + 1.6], [rf * Math.cos(m), rf * Math.sin(m), z0 + 0.9], [rf * Math.cos(b), rf * Math.sin(b), z0 + 1.6]], [0.1, 0.14, 0.1], 3)
      }
    }
  }
  // ===== Capital, platform, pedestal ========================================
  rev([[R1, ZS1], [2.45, ZS1 + 0.3], [2.75, ZS1 + 0.8], [2.95, ZPL - 0.9], [3.05, ZPL - 0.4], [3.35, ZPL - 0.25], [3.35, ZPL]], () => sand, hi ? 32 : 12, 35)
  if (hi) for (let i = 0; i < 4; i++) {
    // The eagles of the capital, wings spread round it.
    const a = (i * TAU) / 4 + TAU / 8
    const c: V3 = [2.85 * Math.cos(a), 2.85 * Math.sin(a), ZS1 + 1.1]
    ellipsoid(sand, c, [0.35, 0.3, 0.55], 8, 4, a)
    for (const e of [-1, 1]) slab(sand, [c[0], c[1], c[2] + 0.2], [-Math.sin(a) * e, Math.cos(a) * e, 0.4], [0, 0, 1], [[0, -0.4], [1.2, -0.1], [1.3, 0.35], [0.1, 0.4]], 0.15)
  }
  // The platform's gilt railing.
  if (hi) {
    for (let i = 0; i < 24; i++) {
      const a = (i * TAU) / 24
      cylinder(gilt, 3.25 * Math.cos(a), 3.25 * Math.sin(a), 0.05, ZPL, ZPL + 1.25, 4)
    }
    rev([[3.28, ZPL + 0.2], [3.28, ZPL + 0.95], [3.22, ZPL + 0.95], [3.22, ZPL + 0.2], [3.28, ZPL + 0.2]], () => gilt, 32, 10)
    rev([[3.3, ZPL + 1.15], [3.3, ZPL + 1.27], [3.2, ZPL + 1.27], [3.2, ZPL + 1.15], [3.3, ZPL + 1.15]], () => gilt, 32, 10)
  } else {
    rev([[3.3, ZPL], [3.3, ZPL + 1.2], [3.2, ZPL + 1.2]], () => gilt, 12, 10)
    rev([[3.2, ZPL + 1.2], [3.2, ZPL]], () => gilt, 12, 10)
  }
  rev([[1.75, ZPL], [1.75, ZPED - 0.5], [1.95, ZPED - 0.3], [1.95, ZPED - 0.1], [1.5, ZPED], [0, ZPED + 0.15]], () => sand, hi ? 24 : 10, 35)
  // ===== Victoria ===========================================================
  place(gilt, [0, 0, ZPED], Math.PI / 2, 1, (q) => victoria(q, Q, 8.3), hi ? 60 : 179)

  const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.2 : 0.9)
  const W = (p: Part, c = 35) => welded(p, c)
  return [
    { part: W(granite), material: { ...mat('red-granite', 0x7a4840, 0.5), floodlight: lit } },
    { part: W(sand, hi ? 35 : 50), material: { ...mat('obernkirchen-sandstone', 0x7a7364), floodlight: lit } },
    { part: W(gilt, hi ? 60 : 179), material: { ...mat('gilt', 0xd8aa3e, 0.35), floodlight: () => 1 } },
    { part: W(steps), material: mat('stone', 0xb9b3a6) },
    { part: W(patina), material: mat('patina', 0x7fa398) },
    { part: W(mosaic), material: mat('window', 0x8a6b4c, 0.4) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Siegessäule', wikidata: 'Q154987', bearing: BEARING, osm: 'way/718035022' }
  writeModel('Siegessäule', ID, build(false), extras, 6500)
  writeModel('Siegessäule', ID, build(true), extras, 40000, `${ID}.detail`)
}
