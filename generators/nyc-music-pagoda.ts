/**
 * Music Pagoda, Concert Grove, Prospect Park, Brooklyn (1887) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-music-pagoda.ts
 *
 * Frame: y along the pavilion's long axis (bearing 76.9°), x across it,
 * z up, metres. Anchor: the centroid of OSM way/241846600
 * (-73.967135, 40.662009), building=roof, height=8.8, which the model
 * replaces. That outline is the roof's eave: an elongated octagon 14.75 m
 * × 9.8 m with 1.7 m chamfers.
 *
 * Evidence
 * - OSM way/241846600 (ODbL), wikidata Q112117173.
 * - Published (Prospect Park Alliance; NYC Parks): a bandstand of 1887 in
 *   the Concert Grove, given its "pagoda" roof; long disused.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Rhododendrites, "Music Pagoda in Prospect Park (81543p).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Music_Pagoda_in_Prospect_Park_(81543p).jpg
 *     (long side in snow: base, posts, railing, the roof's flare and fascia);
 *   Jim.henderson, "Music Pagoda 2022 jeh.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Music_Pagoda_2022_jeh.jpg
 *     (three-quarter: green roof, stair at an end, rubble base);
 *   Pi.1415926535, "Music Pagoda in Prospect Park, September 2025.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Music_Pagoda_in_Prospect_Park,_September_2025.jpg
 *     (the stage: posts and the cream ceiling);
 *   Garry R. Osgood, "Music-Pagoda-near-Binnen-Bridge Prospect Park.jpg", CC BY 2.5,
 *     https://commons.wikimedia.org/wiki/File:Music-Pagoda-near-Binnen-Bridge_Prospect_Park.jpg
 *     (long side in summer, the arched opening in the base).
 *
 * Estimated from the long-side photos, scaled by the eave's 14.75 m:
 * rubble base 1.6 m (the platform), railing 0.9 m, posts to 5.8 m, deep
 * cream fascia 5.8–6.6 m at the eave line, the low roof flaring from the
 * eave (6.6 m) to a short ridge at 8.3 m (OSM's height=8.8 reads high
 * against the photos); the base inset 1.4 m inside the eave line.
 *
 * Doubts: which end carries the stair (both photos show it at an end; it
 * is put at the west-south-west end); the post count; the arched opening
 * in the base is drawn as a dark panel on one long side only.
 */
import { Part, type V3 } from './mesh'
import { finishModel, chamferRect, prism, insetRing, type XY } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'

const stone = new Part(), cream = new Part(), roof = new Part(), dark = new Part(), floor = new Part()

const HX = 4.9, HY = 7.37, CH = 1.69
const EAVE = chamferRect(-HX, -HY, HX, HY, CH)
const BASE = 1.6, POST = 5.8, FASCIA = 6.6, TOP = 8.3

// Rubble stone base and the stage floor.
const base = insetRing(EAVE, 1.4) as XY[]
prism({ wall: stone, win: null, roof: floor, ring: base, z0: 0, z1: BASE, facade: null, bevel: 0.15 })
// The arched opening in the base on the +x long side.
for (let k = 0; k < 1; k++) {
  const x = HX - 1.4 + 0.03, y0 = -0.8, y1 = 0.8
  quadF(dark, [x, y0, 0.1], [x, y1, 0.1], [x, y1, 1.1], [x, y0, 1.1], [1, 0, 0])
  for (let i = 0; i < 8; i++) {
    const a0 = (Math.PI * i) / 8, a1 = (Math.PI * (i + 1)) / 8
    quadF(dark, [x, 0, 1.1], [x, 0.8 * Math.cos(a0), 1.1 + 0.8 * Math.sin(a0)], [x, 0.8 * Math.cos(a1), 1.1 + 0.8 * Math.sin(a1)], [x, 0, 1.1], [1, 0, 0])
  }
}

// Posts at the base's corners and along the long sides.
const postRing = insetRing(base, 0.3) as XY[]
const posts: XY[] = []
for (let i = 0; i < postRing.length; i++) {
  const a = postRing[i], b = postRing[(i + 1) % postRing.length]
  posts.push(a)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.round(L / 3.2)
  for (let k = 1; k < n; k++) posts.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
}
for (const [x, y] of posts) {
  box(cream, x - 0.16, y - 0.16, x + 0.16, y + 0.16, BASE, POST)
  box(cream, x - 0.24, y - 0.24, x + 0.24, y + 0.24, POST - 0.3, POST)
}

// Railing round the stage edge, open at the stair (the −y end face).
for (let i = 0; i < postRing.length; i++) {
  const a = postRing[i], b = postRing[(i + 1) % postRing.length]
  if (a[1] < -HY + 2 && b[1] < -HY + 2 && Math.abs(a[1] - b[1]) < 0.01) continue
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const n: V3 = [uy, -ux, 0]
  const P = (s: number, z: number, d = 0): V3 => [a[0] + ux * s + n[0] * d, a[1] + uy * s + n[1] * d, z]
  quadF(cream, P(0, BASE + 0.75, 0.05), P(L, BASE + 0.75, 0.05), P(L, BASE + 0.9, 0.05), P(0, BASE + 0.9, 0.05), n)
  quadF(cream, P(0, BASE + 0.9, 0.05), P(L, BASE + 0.9, 0.05), P(L, BASE + 0.9, -0.1), P(0, BASE + 0.9, -0.1), [0, 0, 1])
  quadF(cream, P(0, BASE + 0.75, -0.1), P(L, BASE + 0.75, -0.1), P(L, BASE + 0.9, -0.1), P(0, BASE + 0.9, -0.1), [-n[0], -n[1], 0])
  quadF(dark, P(0, BASE + 0.1, 0), P(L, BASE + 0.1, 0), P(L, BASE + 0.75, 0), P(0, BASE + 0.75, 0), n)
  quadF(dark, P(0, BASE + 0.1, -0.05), P(L, BASE + 0.1, -0.05), P(L, BASE + 0.75, -0.05), P(0, BASE + 0.75, -0.05), [-n[0], -n[1], 0])
}
// The stair down from the −y end: five wooden treads with cheek walls.
const ey = Math.min(...base.map((p) => p[1]))
for (let k = 0; k < 6; k++) box(cream, -1.2, ey - 0.35 * (k + 1), 1.2, ey - 0.35 * k, 0, BASE - (BASE / 6) * k, false)

// Fascia, the cream soffit, and the flared green roof to a short ridge.
const ring = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
const eave = EAVE as XY[]
cream.loft([ring(eave, POST), ring(eave, FASCIA)])
cream.cap(ring(eave, POST).reverse().reverse(), false)
const r1 = insetRing(eave, 1.2) as XY[], top = [[-1.0, -3.4], [1.0, -3.4], [1.0, 3.4], [-1.0, 3.4]] as XY[]
// Match the top to the octagon's eight corners (pairs share a point) for the loft.
const top8: XY[] = [top[0], top[1], top[1], top[2], top[2], top[3], top[3], top[0]]
roof.loft([ring(eave, FASCIA), ring(r1, 7.05), ring(top8, TOP - 0.2)])
roof.cap(ring(top, TOP - 0.2), true)
box(roof, -0.3, -3.3, 0.3, 3.3, TOP - 0.25, TOP)

finishModel('Music Pagoda', 'nyc-music-pagoda', [
  { part: stone, material: { name: 'rubble-stone', color: 0x8f8a7f, roughness: 0.9 } },
  { part: floor, material: { name: 'stage', color: 0xc8c3b6, roughness: 0.9 } },
  { part: cream, material: { name: 'painted-wood', color: 0xebe2c8, roughness: 0.8 } },
  { part: roof, material: { name: 'roof-green', color: 0x7ea38e, roughness: 0.8 } },
  { part: dark, material: { name: 'openwork', color: 0x5d6158, roughness: 0.9 } },
], { bearing: 76.9, osm: 'way/241846600', height: TOP })
