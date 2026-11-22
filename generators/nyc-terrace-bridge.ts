/**
 * Terrace Bridge, Prospect Park, Brooklyn (cast-iron arch on brownstone
 * abutments, 1890) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-terrace-bridge.ts
 *
 * Frame: y along the bridge (bearing 86°, east), x across it (+x toward
 * 176°, the south face), z up, metres; z = 0 the Lullwater's surface
 * under the span. Anchor: the centroid of OSM's man_made=bridge outline
 * way/1420960680 (-73.968384, 40.658280), 40.7 m × 18 m, which the model
 * draws whole (iron span, brownstone abutments and wing walls, parapet
 * railing), so `replaces` lists it.
 *
 * The bridge carries Wellhouse Drive (way/180909827, bridge=yes): no road
 * surface is drawn and the top stays open between the parapets; the
 * roadway was estimated at 8.6 m, the top of the iron fascia.
 *
 * Evidence
 * - OSM way/1420960680 (layer 1) and way/180909827 (ODbL).
 * - Published (Prospect Park Alliance; Wikipedia "Prospect Park"): a
 *   cast-iron arch over the Lullwater near the Lake, 1890, on brownstone.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Dave Smith, "Terrace Bridge in Prospect Park from south.jpg", CC BY-SA,
 *     https://commons.wikimedia.org/wiki/File:Terrace_Bridge_in_Prospect_Park_from_south.jpg
 *     (square on to the south face: arch, spandrels, railing, brownstone walls);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 55.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_55.jpg
 *     (under the span: the ribbed iron soffit, springing on the brownstone).
 *   Noel Hefele, "Terrace Bridge in Prospect Park.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Terrace_Bridge_in_Prospect_Park.jpg
 *     (looked at; not used for dimensions).
 *
 * Estimated from the square-on photo at ≈34 px/m (scaled so the span and
 * walls fill the outline; no lidar or terrain grid, both timed out on the
 * loaded machine): span 24 m, springing 2.5 m on brownstone imposts, soffit
 * crown 6.8 m, rib 0.8 m, iron fascia to 8.6 m (the roadway), openwork
 * railing to 9.6 m; brownstone walls from the span to the outline's ends.
 *
 * Doubts: the span and heights rest on one photo's scale; the banks under
 * the wing walls (taken as the water level; the map's terrain hides what
 * is below); the north face is taken as the south face's mirror; the
 * spandrel ornament is drawn as darker openwork panels.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'

const iron = new Part(), open = new Part(), brown = new Part(), coping = new Part(), rail = new Part()

const HALF = 20.3, SPAN = 12, W = 9, SPR = 2.5, CROWN = 6.8, DECK = 8.6
const RISE = CROWN - SPR, R = (SPAN * SPAN + RISE * RISE) / (2 * RISE)
const arch = (y: number) => SPR + Math.sqrt(R * R - y * y) - (R - RISE)
const ys = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
function strip(p: Part, x: number, yy: number[], lo: (y: number) => number, hi: (y: number) => number, nx: number) {
  for (let i = 0; i < yy.length - 1; i++) {
    const a = yy[i], b = yy[i + 1]
    quadF(p, [x, a, lo(a)], [x, b, lo(b)], [x, b, hi(b)], [x, a, hi(a)], [nx, 0, 0])
  }
}
function flat(p: Part, x0: number, x1: number, yy: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i < yy.length - 1; i++) {
    const a = yy[i], b = yy[i + 1]
    quadF(p, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], [0, 0, up ? 1 : -1])
  }
}
const span = ys(-SPAN, SPAN, 24), deck = () => DECK

for (const s of [-1, 1]) {
  const xo = s * W
  // Iron spandrel and fascia from the arch to the roadway, both faces.
  strip(iron, xo, span, arch, deck, s)
  strip(iron, xo - s * 0.4, span, arch, deck, -s)
  flat(iron, Math.min(xo, xo - s * 0.4), Math.max(xo, xo - s * 0.4), span, deck, true)
  // The outer rib, proud of the spandrel, and the fascia's cornice.
  strip(iron, xo + s * 0.15, span, arch, (y) => arch(y) + 0.8, s)
  flat(iron, Math.min(xo, xo + s * 0.15), Math.max(xo, xo + s * 0.15), span, (y) => arch(y) + 0.8, true)
  flat(iron, Math.min(xo - s * 0.4, xo + s * 0.15), Math.max(xo - s * 0.4, xo + s * 0.15), span, arch, false)
  strip(iron, xo + s * 0.15, span, () => DECK - 0.45, deck, s)
  flat(iron, Math.min(xo, xo + s * 0.15), Math.max(xo, xo + s * 0.15), span, () => DECK - 0.45, false)
  // Spandrel panels: darker openwork between the rib and the fascia near each springing.
  for (const sg of [-1, 1]) {
    const yy = ys(sg * (SPAN - 0.8), sg * (SPAN - 6.5), 6)
    strip(open, xo + s * 0.04, yy, (y) => arch(y) + 1.0, () => DECK - 0.6, s)
  }
  // Openwork railing the full length: a dark pierced panel between a base and a top rail.
  const all = ys(-HALF, HALF, 8)
  const xr = xo - s * 0.1
  strip(rail, xr, all, () => DECK, () => DECK + 0.2, s)
  strip(rail, xr - s * 0.25, all, () => DECK, () => DECK + 0.2, -s)
  flat(rail, Math.min(xr, xr - s * 0.25), Math.max(xr, xr - s * 0.25), all, () => DECK + 0.2, true)
  strip(open, xr - s * 0.12, all, () => DECK + 0.2, () => DECK + 0.85, s)
  strip(open, xr - s * 0.12, all, () => DECK + 0.2, () => DECK + 0.85, -s)
  for (const xx of [xr, xr - s * 0.25]) strip(rail, xx, all, () => DECK + 0.85, () => DECK + 1.0, xx === xr ? s : -s)
  flat(rail, Math.min(xr, xr - s * 0.25), Math.max(xr, xr - s * 0.25), all, () => DECK + 1.0, true)
  flat(rail, Math.min(xr, xr - s * 0.25), Math.max(xr, xr - s * 0.25), all, () => DECK + 0.85, false)
  for (let y = -HALF + 0.3; y <= HALF; y += 2.0) box(rail, Math.min(xr, xr - s * 0.25) - 0.05, y - 0.12, Math.max(xr, xr - s * 0.25) + 0.05, y + 0.12, DECK, DECK + 1.1)
}
// The iron soffit across the width (the inner ribs are left out: too thin to read).
for (let i = 0; i < span.length - 1; i++) {
  const a = span[i], b = span[i + 1]
  quadF(iron, [-W, a, arch(a)], [W, a, arch(a)], [W, b, arch(b)], [-W, b, arch(b)], [0, 0, -1])
}

// Brownstone abutments and wing walls: faces along both sides from the span to the ends,
// the abutment faces toward the water, and coping under the railing.
for (const sg of [-1, 1]) {
  const yy = ys(Math.min(sg * SPAN, sg * HALF), Math.max(sg * SPAN, sg * HALF), 2)
  for (const s of [-1, 1]) {
    strip(brown, s * (W + 0.1), yy, () => 0, () => DECK - 0.3, s)
    strip(coping, s * (W + 0.25), yy, () => DECK - 0.3, deck, s)
    flat(coping, Math.min(s * (W + 0.25), s * (W - 0.6)), Math.max(s * (W + 0.25), s * (W - 0.6)), yy, deck, true)
    flat(coping, Math.min(s * (W + 0.1), s * (W + 0.25)), Math.max(s * (W + 0.1), s * (W + 0.25)), yy, () => DECK - 0.3, false)
    // impost block under the springing
    box(coping, s > 0 ? W - 0.4 : -W - 0.3, sg * SPAN - 0.6, s > 0 ? W + 0.3 : -W + 0.4, sg * SPAN + 0.6, SPR - 0.5, SPR)
  }
  quadF(brown, [-W - 0.1, sg * SPAN, 0], [W + 0.1, sg * SPAN, 0], [W + 0.1, sg * SPAN, SPR], [-W - 0.1, sg * SPAN, SPR], [0, -sg, 0])
}

finishModel('Terrace Bridge', 'nyc-terrace-bridge', [
  { part: iron, material: { name: 'cast-iron-verdigris', color: 0x6f8f7e, roughness: 0.75 } },
  { part: open, material: { name: 'openwork', color: 0x465f51, roughness: 0.85 } },
  { part: brown, material: { name: 'brownstone', color: 0xa67b6b, roughness: 0.9 } },
  { part: coping, material: { name: 'brownstone-coping', color: 0xb8988a, roughness: 0.9 } },
  { part: rail, material: { name: 'railing', color: 0x5f7d6d, roughness: 0.75 } },
], { bearing: 86, osm: 'way/1420960680', height: DECK + 1.1 })
