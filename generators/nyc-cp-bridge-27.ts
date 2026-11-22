/**
 * Bridge No. 27, Central Park, over the bridle path on the Reservoir's west
 * side (Calvert Vaux and Jacob Wrey Mould, about 1864) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-cp-bridge-27.ts
 *
 * Frame (mesh.ts map frame): x along the bridge (bearing 221.0°, SW), y
 * across it (the placement's bearing, 131.0°, along the bridle path below),
 * z up, metres; z = 0 is the bridle path under the span. Anchor: the middle
 * of OSM way/179679732 (footway, bridge=yes, "Bridge No. 27", wikidata
 * Q86968666), whose main segment is 26.8 m long. OSM maps no
 * man_made=bridge outline or building here, so `replaces` is empty. The
 * walkway is the model's (a footbridge).
 *
 * Evidence
 * - OSM (ODbL): the footway on the bridge way/179679732.
 * - Map terrain (Mapterhorn z15, `bun tools/terrain.ts grid`, bearing 131):
 *   the bridle path 0–0.5 m between x −3 and +6, the banks 2.5–3.2 m up
 *   from 10–12 m out on both sides.
 * - HAER NY-193 (Library of Congress, public domain), "Central Park
 *   Bridges, Bridge No. 27":
 *   "View from bridlepath looking west showing east elevation" (153D-1),
 *     https://commons.wikimedia.org/wiki/File:View_from_bridlepath_looking_west_showing_east_elevation_-_Central_Park_Bridges,_Bridge_No._27,_Central_Park,_Southwest_of_Reservoir,_New_York,_New_York_County,_NY_HAER_NY,31-NEYO,153D-1.tif
 *     (square-on: the flat segmental iron arch springing from low stone
 *     abutments, the scrolled openwork spandrels, the roundels over the
 *     springings, the Gothic-looped railing; every proportion below);
 *   "Three-quarter view from deck level looking southwest" (153D-2),
 *     https://commons.wikimedia.org/wiki/File:Three-quarter_view_from_deck_level_looking_southwest_-_Central_Park_Bridges,_Bridge_No._27,_Central_Park,_Southwest_of_Reservoir,_New_York,_New_York_County,_NY_HAER_NY,31-NEYO,153D-2.tif
 *     (the walkway's width, the tall newel posts with domed finials at the
 *     ends, the scrolled railing ends).
 * - Photo: Jim.henderson, "SW Reservoir Bridge 27 CP jeh.jpg", CC0,
 *   https://commons.wikimedia.org/wiki/File:SW_Reservoir_Bridge_27_CP_jeh.jpg
 *   (today's off-white paint; copy in
 *   landmarks-scratch/nyc-parks-2/work/nyc-cp-bridge-27/photos).
 * - Estimated from 153D-1, scaled by the railing, 60 px against the 820 px span (0.073; 1.1 m on a
 *   15 m span): walkway 4.3 m
 *   above the path at midspan, 3.9 m at the ends; fascia 0.6 m; span 15 m
 *   between the springings, which sit on stone abutments 1.75 m high; the
 *   intrados crown at 3.4 m; rib 0.4 m; walkway 3.8 m wide (153D-2).
 *
 * Simplified: the spandrels' scrollwork is a dark panel with cream
 * roundels; the railing's Gothic loops are a band with a row of dark
 * openings; its scrolled ends are left out; the newels are plain posts with
 * domed caps.
 *
 * Doubts: dimensions are photo-scaled (the railing's height is assumed);
 * the deck's length follows OSM, longer than the photo's railing alone
 * would suggest. HAER's drawings weren't found online; no lidar was read.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { bevelBox, box, profile, qn, steps, urn } from './nyc-greyshot-arch'
import { curveBand, flatStrip, ironRailing, strip } from './nyc-gothic-bridge'

const paint = new Part(), dark = new Part(), stone = new Part(), wood = new Part()
const HALF = 13.4, DECK_MID = 4.3, DECK_END = 3.9, RAIL = 1.1, FASCIA = 0.6
const deck = (x: number) => DECK_END + (DECK_MID - DECK_END) * (1 - (x / HALF) ** 2)
const FB = (x: number) => deck(x) - FASCIA
const A = 7.5, SPRING = 1.75, RISE = 1.65, RIB = 0.4, AB = 9.8
const FY = 2.2, PY = 2.1, HW = 1.9, FF = 2.27

const pr = profile('segment', A, RISE, SPRING, 16)
const Rc = (A * A + RISE * RISE) / (2 * RISE), ZC = SPRING + RISE - Rc
const nrm = pr.map(([x, z]): [number, number] => [x / Rc, (z - ZC) / Rc])
const outer = pr.map(([x, z], i): [number, number] => [x + nrm[i][0] * RIB, z + nrm[i][1] * RIB])
const intr = (x: number) => ZC + Math.sqrt(Rc * Rc - x * x)
const M = steps(-A, A, 16), all = steps(-HALF, HALF, 20)

/** A flat n-gon disc on y = yy facing ny. */
function disc(p: Part, x: number, yy: number, z: number, r: number, ny: number, n = 12) {
  for (let k = 0; k < n; k++) {
    const t0 = (2 * Math.PI * k) / n, t1 = (2 * Math.PI * (k + 1)) / n
    const b: [number, number, number] = [x + r * Math.cos(t0), yy, z + r * Math.sin(t0)], c: [number, number, number] = [x + r * Math.cos(t1), yy, z + r * Math.sin(t1)]
    if (ny > 0) p.tri([x, yy, z], c, b); else p.tri([x, yy, z], b, c)
  }
}

const Lx = steps(-AB, -A, 3), Rx = steps(A, AB, 3)
for (const s of [-1, 1]) {
  // the spandrels' scrollwork: a dark panel from the rib (and, past the
  // springings, the abutments' tops) up to the fascia; then the rib
  strip(dark, s, PY, M, intr, FB)
  for (const xs of [Lx, Rx]) strip(dark, s, PY, xs, () => SPRING, FB)
  curveBand(paint, s, PY, FY, pr, outer)
  for (const sx of [-1, 1]) {
    // a roundel over each springing, and a smaller one in the spandrel
    const yy = s * (PY + 0.04)
    disc(paint, sx * (A + 0.3), yy, 2.65, 0.5, s)
    disc(dark, sx * (A + 0.3), s * (PY + 0.06), 2.65, 0.32, s)
    disc(paint, sx * 5.0, yy, FB(5.0) - 0.42, 0.32, s)
    disc(dark, sx * 5.0, s * (PY + 0.06), FB(5.0) - 0.42, 0.18, s)
    // the iron end frame where the spandrel stops over the abutment
    const xe = sx * AB
    box(paint, Math.min(xe, xe - sx * 0.25), Math.max(xe, xe - sx * 0.25), s < 0 ? -FY : PY, s < 0 ? -PY : FY, SPRING, FB(AB))
  }
  // the fascia, with a moulding at its top
  strip(paint, s, FF, all, FB, deck)
  flatStrip(paint, s, PY, FF, all, FB, false)
  flatStrip(paint, s, HW, FF + 0.07, all, deck, true)
  strip(paint, s, FF + 0.07, all, (x) => deck(x) - 0.18, deck)
  flatStrip(paint, s, FF, FF + 0.07, all, (x) => deck(x) - 0.18, false)
}
// the soffit under the arch, and under the deck over the abutments
for (let i = 0; i + 1 < pr.length; i++) {
  const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
  qn(dark, [x0, -PY, z0], [x1, -PY, z1], [x1, PY, z1], [x0, PY, z0], [-(nrm[i][0] + nrm[i + 1][0]), 0, -(nrm[i][1] + nrm[i + 1][1])])
}
// the walkway and the deck's end faces
flatStrip(wood, 1, -HW, HW, all, deck, true)
for (const sx of [-1, 1]) {
  const x = sx * HALF
  qn(paint, [x, -FF, FB(x)], [x, FF, FB(x)], [x, FF, deck(x)], [x, -FF, deck(x)], [sx, 0, 0])
}
// the stone abutments: low blocks under the springings, then the deck's
// ends resting on stone the banks mostly bury
for (const sx of [-1, 1]) {
  const a0 = sx < 0 ? -AB : A - 0.3, a1 = sx < 0 ? -A + 0.3 : AB
  box(stone, a0, a1, -FF - 0.1, FF + 0.1, 0, SPRING)
  const b0 = sx < 0 ? -HALF : AB, b1 = sx < 0 ? -AB : HALF
  box(stone, b0, b1, -FF + 0.05, FF - 0.05, 0, FB(HALF) - 0.02)
}
// the railing, with tall newels at the four ends
const posts = [...steps(-5, 5, 10).map((k) => k * 2.45)]
ironRailing(paint, dark, { half: HALF - 0.3, hw: HW, deck, height: RAIL, posts, pitch: 0.5, r: 0.26 })
for (const sx of [-1, 1])
  for (const s of [-1, 1]) {
    const x = sx * (HALF - 0.3), y = s * HW, z = deck(x)
    bevelBox(paint, x, y, 0.24, 0.24, z - 0.1, z + 1.45, 0.06)
    urn(paint, x, y, [[0.2, z + 1.45], [0.26, z + 1.6], [0.2, z + 1.8], [0.05, z + 2.0]], 8)
  }

finishModel('Bridge No. 27', 'nyc-cp-bridge-27', [
  { part: paint, material: { name: 'cast-iron-cream', color: 0xe3e0d6, roughness: 0.7 } },
  { part: dark, material: { name: 'openwork', color: 0x8b8a82, roughness: 0.9 } },
  { part: stone, material: { name: 'stone', color: 0x948a7d, roughness: 0.9 } },
  { part: wood, material: { name: 'walkway', color: 0x9a948a, roughness: 0.9 } },
], { bearing: 131.0, height: DECK_MID + 2.0 }, 5000)
