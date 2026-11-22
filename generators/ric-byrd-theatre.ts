/**
 * Byrd Theatre, Carytown, Richmond — procedural, CC0-1.0, no textures.
 * bun generators/ric-byrd-theatre.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/327377540 (lng -77.4778530, lat 37.5524285). The
 * side walls run at 24°, so the model is placed at bearing 24 and built
 * square: model "south" is the West Cary Street front (world SSW).
 *
 * What it is: Fred Bishop's movie palace of 1928, a plain dark red-brown
 * brick box behind a street front of the same brick dressed with cream
 * terracotta: a long garlanded frieze high up with a crest over the centre,
 * a tall latticed window between columns on a balcony bracket, two arched
 * niches, small arched windows over the marquee, a white canopy across the
 * front and the marquee, with "BYRD" standing on its top.
 *
 * Famous sign: the BYRD letters are the landmark's identity, so they are
 * lettered (STYLE.md, "Famous signs"): wide serif capitals traced from
 * "Byrd Theatre Exterior RVA August 2023.jpg" and "Byrd Theater in
 * Richmond, VA (Carytown)", built with lettering.ts, pink neon at night.
 *
 * Covers and replaces: way/327377540 (the only OSM building; no parts).
 *
 * Evidence
 * - OSM (measured): outline x -12.9..13.0, y -22.6..21.9 in this frame; the
 *   front wall at y -19.3, the outline's splayed front to y -22.6 being the
 *   canopy and marquee.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 0.5 m
 *   grid read every 2 m (measured; z = lidar - 0.3, the rear alley being the
 *   lowest ground; Cary Street at 0.5): roof 15.3, front parapet to 16.0;
 *   canopy 4.6 (4.1 m over the street).
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Byrd Theatre Exterior RVA August 2023.jpg" (Sean Dudley, public
 *   domain), the front from the south-east: the frieze, niches, latticed
 *   bay, marquee and BYRD letters;
 *   "Byrd Theatre.JPG" (Morgan Riley, CC BY 3.0), the front close from the
 *   east: the terracotta details, canopy, the doors;
 *   "Byrd Theater in Richmond, VA (Carytown) (10076067164).jpg" (Eli
 *   Christman, CC BY 2.0), from the west: the plain brick side and its
 *   height over the neighbours.
 * - USGS NAIP (public domain): the dark flat roof.
 * - Estimated from the photos, scaled to the 25.9 m front: frieze 11.4–12.5
 *   with a crest to 13.6 over the latticed bay; the bay 2.6 m wide, 6.6–11.3;
 *   niches 1.6 m wide, 8.2–11.4; marquee x -10.5..2.5, 3 m tall, 4 m deep;
 *   BYRD 1.3 m tall. Side and rear walls are plain (only the west side is
 *   photographed; the east side is mirrored, doubt).
 * - Simplified: garlands, eagles, cartouches and the balcony bracket are
 *   flat terracotta panels; marquee text is left off.
 * - Night: BYRD glows pink; the marquee and canopy are lit; the terracotta
 *   front is floodlit.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect, block, type Side } from './dc-white-house'
import { saveModel, type Mat } from './dc-nga-west'
import { Pen, strokes } from './lettering'

const brick = new Part(), terra = new Part(), roof = new Part(), win = new Part(), sign = new Part(), neon = new Part()

const X0 = -12.9, X1 = 13.0, YF = -19.3, YR = 21.9
const ST = 0.5 // Cary Street
const ROOF = 15.3, PARAPET = 16.0

// ---- the brick box: a taller front parapet, a plain body behind
cbox(brick, rect(X0, X1, YF + 1.2, YR), 0, ROOF, { b: 0.15, top: roof })
cbox(brick, rect(X0, X1, YF, YF + 1.2), 0, PARAPET, { b: 0.2 })
// coping on the front parapet
block(terra, 's', YF, X0 + 0.1, X1 - 0.1, PARAPET - 0.35, PARAPET - 0.1, 0.12)

const F = (a0: number, a1: number, z0: number, z1: number, p: Part, d = 0.05) => panel(p, 's', YF, a0, a1, z0, z1, d)

// ---- the frieze: a terracotta band standing slightly proud, crest over the bay
const BAY = 2.6 // latticed bay centre
block(terra, 's', YF, X0 + 0.6, X1 - 0.6, 11.4, 12.5, 0.25)
block(terra, 's', YF, BAY - 2.6, BAY + 2.6, 12.5, 13.6, 0.3)
// garland drops under the band: short pendants
for (const x of [-10.3, -6.2, -1.6, 7.0, 10.6]) block(terra, 's', YF, x - 0.25, x + 0.25, 10.2, 11.4, 0.12, true, false)

// ---- the latticed bay: columns, window, balcony bracket
block(terra, 's', YF, BAY - 2.0, BAY - 1.3, 6.6, 11.4, 0.35)
block(terra, 's', YF, BAY + 1.3, BAY + 2.0, 6.6, 11.4, 0.35)
F(BAY - 1.3, BAY + 1.3, 6.9, 11.2, win)
block(terra, 's', YF, BAY - 2.2, BAY + 2.2, 6.0, 6.6, 0.6)
block(terra, 's', YF, BAY - 0.8, BAY + 0.8, 5.3, 6.0, 0.4)
// three small windows under it, over the canopy
F(BAY - 1.9, BAY + 1.9, ST + 5.0, ST + 6.3, terra, 0.03)
for (const d of [-1.2, 0, 1.2]) F(BAY + d - 0.4, BAY + d + 0.4, ST + 5.1, ST + 6.1, win, 0.06)

/** An arched niche: a terracotta frame, a window with a round head. */
function niche(c: number, w: number, z0: number, z1: number) {
  block(terra, 's', YF, c - w / 2 - 0.35, c + w / 2 + 0.35, z0 - 0.4, z1 + 0.3, 0.12)
  const zs = z1 - w / 2
  F(c - w / 2, c + w / 2, z0, zs, win, 0.16)
  const n = 8, y = YF - 0.16
  for (let k = 0; k < n; k++) {
    const a0 = (Math.PI * k) / n, a1 = (Math.PI * (k + 1)) / n
    win.tri([c, y, zs], [c + (w / 2) * Math.cos(a0), y, zs + (w / 2) * Math.sin(a0)], [c + (w / 2) * Math.cos(a1), y, zs + (w / 2) * Math.sin(a1)])
  }
}
niche(-9.4, 1.6, 8.2, 11.0)
niche(11.0, 1.4, 7.4, 10.4)
niche(-2.7, 1.3, ST + 4.9, ST + 6.9)
niche(7.6, 1.3, ST + 4.9, ST + 6.9)

// ---- street storey: terracotta surround, doors, the canopy and marquee
// terracotta piers framing the entrance and the shop windows
for (const [a, b] of [[-11.6, -10.9], [-6.1, -5.4], [-3.9, -3.2], [10.6, 11.0], [12.2, 12.6]]) F(a, b, ST, ST + 4.0, terra, 0.08)
F(-3.2, 10.6, ST + 0.2, ST + 3.3, win, 0.06) // the lobby doors
F(-10.8, -6.2, ST + 0.6, ST + 3.3, win, 0.06) // shop window
F(11.0, 12.2, ST + 0.6, ST + 3.3, win, 0.06)
// canopy across the front: a slab with a white fascia
cbox(sign, rect(X0 + 0.3, X1 - 0.3, YF - 3.0, YF), ST + 4.1, ST + 4.9, { b: 0.1, bottom: true })
// the marquee: a deeper white box over the left of the entrance, splayed ends
const MX0 = -10.5, MX1 = 2.5, MY = YF - 4.0, MZ0 = ST + 3.8, MZ1 = ST + 6.9
cbox(sign, rect(MX0, MX1, MY, YF), MZ0, MZ1, { b: 0.12, bottom: true })
// marquee boards: a slate band of letter board, each face
panel(roof, 's', MY, MX0 + 0.5, MX1 - 0.5, MZ0 + 0.7, MZ1 - 0.6, 0.03)

// ---- BYRD on the marquee's top: wide serif capitals
{
  const p = new Pen()
  const serif = (x0: number, x1: number, y: number) => p.moveTo([x0, y]).lineTo([x1, y])
  // B
  p.moveTo([0, 0]).lineTo([0, 1])
  p.moveTo([0, 1]).lineTo([0.62, 1]).cubicTo([0.98, 1], [0.98, 0.52], [0.62, 0.52]).lineTo([0, 0.52])
  p.moveTo([0.62, 0.52]).cubicTo([1.06, 0.52], [1.06, 0], [0.66, 0]).lineTo([0, 0])
  serif(-0.14, 0, 1); serif(-0.14, 0, 0)
  // Y
  const y0 = 1.3
  p.moveTo([y0, 1]).lineTo([y0 + 0.55, 0.48]).lineTo([y0 + 1.1, 1])
  p.moveTo([y0 + 0.55, 0.48]).lineTo([y0 + 0.55, 0])
  serif(y0 - 0.16, y0 + 0.18, 1); serif(y0 + 0.92, y0 + 1.26, 1); serif(y0 + 0.33, y0 + 0.77, 0)
  // R
  const r0 = 2.75
  p.moveTo([r0, 0]).lineTo([r0, 1])
  p.moveTo([r0, 1]).lineTo([r0 + 0.6, 1]).cubicTo([r0 + 0.98, 1], [r0 + 0.98, 0.5], [r0 + 0.6, 0.5]).lineTo([r0, 0.5])
  p.moveTo([r0 + 0.45, 0.5]).lineTo([r0 + 0.95, 0])
  serif(r0 - 0.14, r0 + 0.14, 0); serif(r0 - 0.14, r0, 1); serif(r0 + 0.82, r0 + 1.1, 0)
  // D
  const d0 = 4.05
  p.moveTo([d0, 0]).lineTo([d0, 1])
  p.moveTo([d0, 1]).lineTo([d0 + 0.45, 1]).cubicTo([d0 + 1.12, 1], [d0 + 1.12, 0], [d0 + 0.45, 0]).lineTo([d0, 0])
  serif(d0 - 0.14, d0, 1); serif(d0 - 0.14, d0, 0)
  const SU = 1.62, SV = 1.3, U0 = MX0 + 0.7, Z0 = MZ1 + 0.05, YL = MY + 0.7
  strokes(neon, p.paths, { width: 0.2, depth: 0.25, back: true, place: (u, v, w) => [U0 + u * SU, YL - w, Z0 + v * SV] as V3 })
}

// ---- sides and rear: plain brick, a few small openings high on the sides
for (const [side, at] of [['w', X0], ['e', X1]] as [Side, number][]) {
  for (const y of [-12, 0, 12]) panel(roof, side, at, y - 0.3, y + 0.3, 13.0, 13.6, 0.04)
}

// Floodlit terracotta and brick on the front; tops unlit.
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0 : p[1] < YF + 0.5 && n[1] < -0.5 ? 0.8 : 0)

/** A finish with night floodlighting; dc-nga-west's Mat type omits the field but saveModel passes it through. */
const lit_ = (m: MaterialSpec): Mat => m

if (import.meta.main) {
  await saveModel('ric-byrd-theatre', 'Byrd Theatre', [
    { part: brick, material: lit_({ ...finish('byrd-brick', 0xa46a5a), floodlight: lit }) },
    { part: terra, material: lit_({ ...finish('byrd-terracotta', 0xf1e4cb), floodlight: lit }) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: sign, material: PALETTE.entrance },
    { part: neon, material: finish('neon-byrd-pink', 0xf0c4cf) },
  ], { source: 'generators/ric-byrd-theatre.ts', bearing: 24, osm: 'way/327377540', height: PARAPET }, 5000)
}
