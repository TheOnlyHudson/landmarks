/**
 * Lullwater Bridge, Prospect Park, Brooklyn (cast iron, 1890) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-lullwater-bridge.ts
 *
 * Frame: x across the bridge, y along it toward its south-south-east end
 * (bearing 159.5°), z up, metres; y = 0 at midspan, z = 0 at the
 * Lullwater's surface. Anchor: the centroid of OSM's man_made=bridge
 * outline way/1420960683 (-73.965878, 40.660617), 21.6 m × 5.74 m, which
 * the model draws whole (iron span, granite abutment ends, railings and
 * the footway's paving), so `replaces` lists it. Steps and paths beyond
 * the outline are the map's.
 *
 * Evidence
 * - OSM way/1420960683 (bridge:structure=arch, layer 1) and footway
 *   way/59664786 (ODbL).
 * - Published (Prospect Park Alliance; Wikipedia "Prospect Park"): cast-iron
 *   arch footbridge of 1890 over the Lullwater beside the Boathouse.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Dave Smith, "Lullwater Bridge in Prospect Park from Lullwater.jpg",
 *     CC BY-SA (version on the file page),
 *     https://commons.wikimedia.org/wiki/File:Lullwater_Bridge_in_Prospect_Park_from_Lullwater.jpg
 *     (side-on from the water, north: arch, spandrels, railing, granite ends);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 72.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_72.jpg
 *     (on the approach: granite end parapets and steps);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 73.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_73.jpg
 *     (on the deck: hump, iron curb, fish-scale railing, scrolled top rail).
 *
 * Estimated from the side-on photo, scaled by the outline's length (no
 * lidar: the USGS crop and the terrain tool timed out on the loaded
 * machine): iron span 17 m between abutment faces, springing 0.4 m over
 * the water, soffit at the crown 2.0 m, rib 0.45 m; walkway 2.2 m at the
 * ends rising to 3.0 m at midspan; railing 1.0 m (iron curb 0.3 m,
 * fish-scale panel, copper-brown top rail); granite end parapets 2.3 m
 * long, ending at the rail's height (1.0 m over the walkway).
 *
 * Doubts: the banks' real height at the abutments (taken as the water
 * level; the granite runs down to z = 0); the span from one photo; the
 * spandrel ornament is drawn as darker openwork panels near the
 * springings and a boss at the crown.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { quadF, box, triN } from './nyc-prospect-park-boathouse'

const iron = new Part(), open = new Part(), granite = new Part(), walk = new Part(), rail = new Part()

const HALF = 10.8, SPAN = 8.5, W = 2.87
const RISE = 1.6, SPR = 0.4
const R = (SPAN * SPAN + RISE * RISE) / (2 * RISE)
const arch = (y: number) => SPR + Math.sqrt(R * R - y * y) - (R - RISE)
const deck = (y: number) => 3.0 - 0.8 * (y / HALF) ** 2
const ys = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)

/** A strip on the plane x = xs between lo(y) and hi(y), facing ±x. */
function strip(p: Part, x: number, yy: number[], lo: (y: number) => number, hi: (y: number) => number, nx: number) {
  for (let i = 0; i < yy.length - 1; i++) {
    const a = yy[i], b = yy[i + 1]
    quadF(p, [x, a, lo(a)], [x, b, lo(b)], [x, b, hi(b)], [x, a, hi(a)], [nx, 0, 0])
  }
}
/** A horizontal strip between x0 and x1 at z(y). */
function flat(p: Part, x0: number, x1: number, yy: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i < yy.length - 1; i++) {
    const a = yy[i], b = yy[i + 1]
    quadF(p, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], [0, 0, up ? 1 : -1])
  }
}

const span = ys(-SPAN, SPAN, 20)
const FASCIA = 0.35

for (const s of [-1, 1]) {
  const xo = s * W
  // Spandrel and fascia, the full iron span, from the arch to the walkway.
  strip(iron, xo, span, arch, deck, s)
  strip(iron, xo - s * 0.3, span, arch, (y) => deck(y) - 0.02, -s)
  // The arch rib, a little proud.
  strip(iron, xo + s * 0.12, span, arch, (y) => arch(y) + 0.45, s)
  flat(iron, Math.min(xo, xo + s * 0.12), Math.max(xo, xo + s * 0.12), span, (y) => arch(y) + 0.45, true)
  flat(iron, Math.min(xo - s * 0.3, xo + s * 0.12), Math.max(xo - s * 0.3, xo + s * 0.12), span, arch, false)
  // The spandrel's scrollwork: darker openwork panels toward each springing.
  for (const sg of [-1, 1]) {
    const yy = ys(sg * (SPAN - 0.6), sg * (SPAN - 4.6), 6)
    strip(open, xo + s * 0.03, yy, (y) => arch(y) + 0.55, (y) => deck(y) - FASCIA - 0.1, s)
  }
  // The boss at the crown.
  const zc = deck(0) - FASCIA - 0.45, rr = 0.4, n: V3 = [s, 0, 0]
  for (let k = 0; k < 12; k++) {
    const a0 = (k * Math.PI) / 6, a1 = ((k + 1) * Math.PI) / 6
    triN(open, [xo + s * 0.06, 0, zc], [xo + s * 0.06, rr * Math.cos(a0), zc + rr * Math.sin(a0)], [xo + s * 0.06, rr * Math.cos(a1), zc + rr * Math.sin(a1)], n)
  }
  // Railing over the span: iron curb, fish-scale panel, copper-brown top rail.
  const xr = xo - s * 0.05
  strip(iron, xr, span, deck, (y) => deck(y) + 0.3, s)
  strip(iron, xr - s * 0.22, span, deck, (y) => deck(y) + 0.3, -s)
  flat(iron, Math.min(xr, xr - s * 0.22), Math.max(xr, xr - s * 0.22), span, (y) => deck(y) + 0.3, true)
  strip(open, xr - s * 0.11, span, (y) => deck(y) + 0.3, (y) => deck(y) + 0.75, s)
  strip(open, xr - s * 0.11, span, (y) => deck(y) + 0.3, (y) => deck(y) + 0.75, -s)
  for (const xx of [xr + s * 0.02, xr - s * 0.12]) {
    strip(rail, xx, span, (y) => deck(y) + 0.9, (y) => deck(y) + 1.0, s)
    strip(rail, xx - s * 0.1, span, (y) => deck(y) + 0.9, (y) => deck(y) + 1.0, -s)
    flat(rail, Math.min(xx, xx - s * 0.1), Math.max(xx, xx - s * 0.1), span, (y) => deck(y) + 1.0, true)
    flat(rail, Math.min(xx, xx - s * 0.1), Math.max(xx, xx - s * 0.1), span, (y) => deck(y) + 0.9, false)
  }
  // Scroll brackets carrying the top rail, about every 1.4 m.
  for (let y = -SPAN + 0.7; y <= SPAN - 0.6; y += 1.4) box(rail, xr - s * 0.06 - 0.05, y - 0.05, xr - s * 0.06 + 0.05, y + 0.05, deck(y) + 0.7, deck(y) + 0.92)
}
// Soffit of the arch across the width.
for (let i = 0; i < span.length - 1; i++) {
  const a = span[i], b = span[i + 1]
  quadF(iron, [-W, a, arch(a)], [W, a, arch(a)], [W, b, arch(b)], [-W, b, arch(b)], [0, 0, -1])
}
// The walkway: paving the full length between the curbs and parapets.
const all = ys(-HALF, HALF, 28)
flat(walk, -W + 0.27, W - 0.27, all, deck, true)

// Granite abutments: walls from the water to the walkway, end parapets and their caps.
for (const sg of [-1, 1]) {
  const y0 = sg * SPAN, y1 = sg * HALF, lo = Math.min(y0, y1), hi = Math.max(y0, y1)
  const yy = ys(lo, hi, 3)
  for (const s of [-1, 1]) {
    strip(granite, s * (W + 0.05), yy, () => 0, (y) => deck(y) + 1.0, s)
    strip(granite, s * (W - 0.5), yy, deck, (y) => deck(y) + 1.0, -s)
    flat(granite, Math.min(s * (W + 0.05), s * (W - 0.5)), Math.max(s * (W + 0.05), s * (W - 0.5)), yy, (y) => deck(y) + 1.0, true)
    // a cap stone and a pier block at the iron's end
    box(granite, s > 0 ? W - 0.6 : -W - 0.15, y0 - 0.45, s > 0 ? W + 0.15 : -W + 0.6, y0 + 0.45, 0, deck(y0) + 1.05)
    box(granite, s > 0 ? W - 0.6 : -W - 0.15, y1 - sg * 0.9 - 0.45, s > 0 ? W + 0.15 : -W + 0.6, y1 - sg * 0.9 + 0.45, 0, deck(y1) + 1.05)
  }
  // face toward the water under the springing
  quadF(granite, [-W - 0.05, y0, 0], [W + 0.05, y0, 0], [W + 0.05, y0, SPR + 0.1], [-W - 0.05, y0, SPR + 0.1], [0, -sg, 0])
  // end faces of the parapets at the outline's ends
  for (const s of [-1, 1]) {
    const xa = s * (W + 0.05), xb = s * (W - 0.5)
    quadF(granite, [xa, y1, 0], [xb, y1, 0], [xb, y1, deck(y1) + 1.1], [xa, y1, deck(y1) + 1.1], [0, sg, 0])
  }
}

finishModel('Lullwater Bridge', 'nyc-lullwater-bridge', [
  { part: iron, material: { name: 'cast-iron-green', color: 0x4a6e5e, roughness: 0.7 } },
  { part: open, material: { name: 'openwork', color: 0x34503f, roughness: 0.8 } },
  { part: granite, material: { name: 'granite', color: 0xa8a59d, roughness: 0.9 } },
  { part: walk, material: { name: 'walkway', color: 0x9b9a96, roughness: 0.9 } },
  { part: rail, material: { name: 'rail', color: 0x9a6a50, roughness: 0.7 } },
], { bearing: 159.5, osm: 'way/1420960683', height: 4.3 })
