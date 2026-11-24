/**
 * Torii in the pond, Japanese Hill-and-Pond Garden, Brooklyn Botanic Garden —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-bbg-torii.ts
 *
 * Map frame: x = model east (along the gate's beams), y = model north (the
 * way through the gate), z up, metres. Placed at bearing 88°: the gate faces
 * the shrine on the hill across the pond, 42 m away at bearing 268° (OSM
 * node/4684083721, a shinto place of worship). Anchor: the OSM
 * node of the gate, node/4684082950 (man_made=ceremonial_gate,
 * ceremonial_gate=torii, colour red, height 5, inscription 大明神).
 * y = 0 is the pond's water surface at the gate's feet.
 *
 * Identifying features (from the photos): the vermilion gate standing in
 * the water; the kasagi, a long top lintel with strongly upturned ends and a
 * weathered grey top, over a straight red beam (shimaki); the nuki tie beam
 * running through the two pillars and out past them; each pillar braced in
 * the plane of the gate by two short posts with capped tops and two red
 * rails, the lower one at the water.
 *
 * Evidence
 * - OSM node/4684082950 (height 5 m), the pond way/108151511, the shrine
 *   node/4684083721.
 * - Published: the Japanese Hill-and-Pond Garden, Takeo Shiota, 1914–15
 *   (Brooklyn Botanic Garden; Wikipedia "Brooklyn Botanic Garden").
 * - Photos (Wikimedia Commons), credits in
 *   ~/landmarks-scratch/bkn/work/nyc-bbg-torii/photos/credits.txt: face on
 *   from the west lawn (Caroline Léna Becker, CC BY 3.0, "Japanese
 *   Hill-and-Pond Garden, Brooklyn 02.JPG"), oblique across the pond
 *   (Vallue, CC BY-SA 4.0, "Detall de l'arc torii a Jardi japonès dels
 *   Brooklyn Botànic Garden.jpg"; Andre Carrotflower, CC BY-SA 4.0,
 *   "Brooklyn Botanic Garden - 20200911 - 16 - Pond and torii at Japanese
 *   Hill-and-Pond Garden.jpg"), the rails close up (Rhododendrites,
 *   CC BY-SA 4.0, "Great blue heron on torii (70282)…(70296).jpg").
 *
 * Measured: the total height (OSM, 5 m). Estimated from the face-on photo,
 * scaled to that height: pillar spacing 3.15 m, pillars 0.5 m, kasagi
 * 6.4 m long, its ends rising 0.55 m, the straight shimaki under it
 * 4.25–4.6 m, the nuki
 * 3.5–3.95 m and 5.3 m long, the bracing posts 1.1 m off each pillar and
 * 1.85 m tall, rails at the water and at 1.3 m.
 *
 * Doubts: only the face-on photo gives proportions; the depth of the
 * members is estimated. The small shrine on the hill is left out: at 1–2 m
 * it does not read at map scale.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel } from './nyc-570-lexington'
import { block } from './nyc-city-hall'
import { oq } from './nyc-bbg-palm-house'

const red = new Part(), top = new Part()
const PX = 1.575 // pillar centres at ±PX

// pillars: slightly tapered octagons, water to the shimaki
for (const s of [-1, 1]) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => { const a = (i + 0.5) * Math.PI / 4; return [s * PX + r * Math.cos(a), r * Math.sin(a), z] as V3 })
  red.loft([ring(0.3, 0), ring(0.25, 4.3)])
  // bracing posts (with grey caps) and the two rails, in the plane of the gate
  for (const d of [-1.1, 1.1]) {
    block(red, s * PX + d - 0.13, -0.13, s * PX + d + 0.13, 0.13, 0, 1.75)
    block(top, s * PX + d - 0.16, -0.16, s * PX + d + 0.16, 0.16, 1.75, 1.9)
  }
  block(red, s * PX - 1.25, -0.11, s * PX + 1.25, 0.11, 0, 0.25)
  block(red, s * PX - 1.25, -0.11, s * PX + 1.25, 0.11, 1.28, 1.52)
}
// nuki through the pillars, the central strut, the straight shimaki under the kasagi
block(red, -2.8, -0.24, 2.8, 0.24, 4.25, 4.62)
block(red, -2.65, -0.16, 2.65, 0.16, 3.5, 3.95)
block(red, -0.17, -0.12, 0.17, 0.12, 3.95, 4.27)

// kasagi: a curved lintel with upturned ends, red below and a grey top
{
  const N = 12, L = 3.2, D = 0.32
  const zb = (x: number) => 4.6 + 0.55 * Math.pow(Math.abs(x) / L, 2.4)
  const xs = Array.from({ length: N + 1 }, (_, i) => -L + (2 * L * i) / N)
  const H = 0.24, T = 0.13 // red body over the cap line, grey cap
  const zr = (x: number) => zb(x)
  for (let i = 0; i < N; i++) {
    const x0 = xs[i], x1 = xs[i + 1], a0 = zb(x0), a1 = zb(x1)
    for (const y of [-D, D]) {
      const n: V3 = [0, Math.sign(y), 0]
      oq(red, [x0, y, zr(x0)], [x1, y, zr(x1)], [x1, y, a1 + H], [x0, y, a0 + H], n)
      oq(top, [x0, y * 1.15, a0 + H], [x1, y * 1.15, a1 + H], [x1, y * 1.15, a1 + H + T], [x0, y * 1.15, a0 + H + T], n)
    }
    const up: V3 = [-(a1 - a0), 0, x1 - x0]
    oq(top, [x0, -D * 1.15, a0 + H + T], [x1, -D * 1.15, a1 + H + T], [x1, D * 1.15, a1 + H + T], [x0, D * 1.15, a0 + H + T], up)
    oq(red, [x0, -D, zr(x0)], [x1, -D, zr(x1)], [x1, D, zr(x1)], [x0, D, zr(x0)], [-(zr(x1) - zr(x0)) * -1, 0, -(x1 - x0)])
    // the cap's underside where it overhangs the body
    for (const y of [-1, 1]) oq(top, [x0, y * D, a0 + H], [x1, y * D, a1 + H], [x1, y * D * 1.15, a1 + H], [x0, y * D * 1.15, a0 + H], [0, 0, -1])
  }
  // end faces, cut plumb
  for (const x of [-L, L]) {
    const z = zb(x), n: V3 = [Math.sign(x), 0, 0]
    oq(red, [x, -D, zr(x)], [x, D, zr(x)], [x, D, z + H], [x, -D, z + H], n)
    oq(top, [x, -D * 1.15, z + H], [x, D * 1.15, z + H], [x, D * 1.15, z + H + T], [x, -D * 1.15, z + H + T], n)
  }
}

finishModel('Torii, Japanese Hill-and-Pond Garden', 'nyc-bbg-torii', [
  { part: red, material: finish('bbg-torii-vermilion', 0xd4503f) },
  { part: top, material: finish('bbg-torii-cap', 0x77736b) },
], { bearing: 88, osm: 'node/4684082950', height: 5.4 })
