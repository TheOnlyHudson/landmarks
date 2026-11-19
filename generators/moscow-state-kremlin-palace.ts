/**
 * State Kremlin Palace (Palace of Congresses), Moscow Kremlin: procedural,
 * CC0-1.0, no textures.
 * bun generators/moscow-state-kremlin-palace.ts
 *
 * Mikhail Posokhin's modernist congress hall of 1960-61: a 120 x 70 m box
 * ringed by slender white marble pylons with tall glass between them, a
 * white marble attic band, a recessed glazed top storey (the banquet hall)
 * and, over the entrance canopy at the north end, the gilt double-headed
 * eagle. Kit from moscow-grand-kremlin-palace.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 13.3, the direction of the outline's long walls (compass
 * 12.8-13.3). Anchor: area centroid of the OSM outline relation/3031379
 * (37.6155126, 55.7514233). The hall is sunk about 15 m into the hill; the
 * model is what stands above the street. Built flat; the map drapes it on
 * its terrain (Mapterhorn z12).
 *
 * Evidence
 * - OSM relation/3031379 (outline 72 x 123 m with the entrance projection
 *   at the north end) and its parts: the glass body 3031380 (20 m), the
 *   marble pylons (about 130 ways of 1-2 m2, 20 m, 2 m deep at a 3 m
 *   pitch), the solid south end 7681230 (20 m), the marble attic 3023289
 *   (20-23 m), the recessed top storey 3023337 (23-29 m), the rooftop boxes
 *   (29-32 m), the entrance canopy 3023285 ("козырёк над входом", 4.5-5 m)
 *   over the glass vestibule 3023318 (4.5 m).
 * - Published: 1959-1961, architects M. V. Posokhin and others; 120 x 70 m;
 *   sunk 15 m into the ground (ru.wikipedia, "Государственный Кремлёвский
 *   дворец").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Superchilum, "State Kremlin Palace Moscow.JPG", CC BY-SA 3.0: the
 *     entrance front with the canopy and the eagle.
 *     https://commons.wikimedia.org/wiki/File:State_Kremlin_Palace_Moscow.JPG
 *   - Sergey Norin, "Moscow, State Kremlin Palace in 2015.jpg", CC BY 2.0: a
 *     corner, the pylons and the attic.
 *     https://commons.wikimedia.org/wiki/File:Moscow,_State_Kremlin_Palace_in_2015.jpg
 *   - Юрий Д.К., "Moscow - Troitskaya Tower, State Kremlin Palace, view
 *     from Sapozhkovskaya Square.jpg", CC BY 4.0: the long west side over
 *     the wall, the glazed top storey.
 *     https://commons.wikimedia.org/wiki/File:Moscow_-_Troitskaya_Tower,_State_Kremlin_Palace,_view_from_Sapozhkovskaya_Square.jpg
 *   - Alex Zelenko, "Russia-Moscow-State Kremlin Palace-2.jpg", CC BY-SA
 *     4.0: the eagle on the attic and its zigzag frieze.
 *     https://commons.wikimedia.org/wiki/File:Russia-Moscow-State_Kremlin_Palace-2.jpg
 *   - Юрий Д.К., "Moscow - State Kremlin Palace, the Church of Praise of the
 *     Blessed Virgin Mary in the Amusement Palace.jpg", CC BY 4.0.
 *     https://commons.wikimedia.org/wiki/File:Moscow_-_State_Kremlin_Palace,_the_Church_of_Praise_of_the_Blessed_Virgin_Mary_in_the_Amusement_Palace.jpg
 *
 * Heights and plan are OSM's. The top storey's mullion pitch (about 3 m,
 * matching the pylons) and its white roof edge are from the Troitskaya
 * photo; the eagle's size (about 5 m across) from Zelenko's and
 * Superchilum's photos.
 *
 * Estimated or simplified: the pylons are drawn at OSM's pitch on the long
 * sides and the north end, and at the same pitch on the south end, which
 * no photo shows; the attic's zigzag frieze is a plain white band with a
 * row of flush grey triangles; the eagle is a flat gilt silhouette; the
 * rooftop boxes are plain.
 *
 * Materials (five): marble white, window (the curtain glass, which glows
 * at night as the lobbies do), a lighter window-2 for the top storey's
 * glass, which reads sky-pale in the Troitskaya photo, the flat roof grey
 * (also the frieze's shadowed triangles), gold for the eagle.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel } from './nyc-570-lexington'
import { spread } from './nyc-city-hall'
import { slab, walls, panel, frame, rect, ccw, type XY } from './moscow-grand-kremlin-palace'

const marble = new Part(), glass = new Part(), sky = new Part(), roof = new Part(), gold = new Part()

// ------------------------------------------------------------ plan (OSM, model frame)
const X0 = -35.6, X1 = 36.2, Y0 = -62.2, Y1 = 59.6 // pylon faces
const GX0 = -33.9, GX1 = 34.4, GY0 = -57.3, GY1 = 57.6 // the glass body
const H = 20, ATTIC = 23, TOP = 29

// The glass body: window walls to the attic, a solid marble south end.
walls(glass, rect(GX0, GY0 + 0.1, GX1, GY1), 0, H)
slab(marble, rect(GX0, Y0 + 1.2, GX1, GY0 + 0.1), 0, H, null)

// The pylons: slender marble fins 1.1 m wide (Superchilum; OSM maps 0.8) and 1.7 m deep at a 3 m pitch.
function pylonsAlong(a: XY, b: XY, n: number, deep: XY) {
  const f = frame(a, b)
  for (const s of spread(0, f.L, n)) {
    const c: V3 = f.at(s, 0, 0)
    const ux = (b[0] - a[0]) / f.L, uy = (b[1] - a[1]) / f.L
    const p = (du: number, dd: number): XY => [c[0] + ux * du + deep[0] * dd, c[1] + uy * du + deep[1] * dd]
    slab(marble, ccw([p(-0.55, 0), p(0.55, 0), p(0.55, 1.7), p(-0.55, 1.7)]), 0, H, null)
  }
}
pylonsAlong([GX1 + 0.1, Y0 + 1.5], [GX1 + 0.1, Y1 - 1.5], 40, [1, 0]) // east
pylonsAlong([GX0 - 0.1, Y0 + 1.5], [GX0 - 0.1, Y1 - 1.5], 40, [-1, 0]) // west
pylonsAlong([X0 + 2.6, GY1 + 0.1], [X1 - 2.6, GY1 + 0.1], 22, [0, 1]) // north
pylonsAlong([X0 + 2.6, Y0 + 1.6], [X1 - 2.6, Y0 + 1.6], 22, [0, -1]) // south, on the solid end

// The marble attic band (20-23 m) over everything, its zigzag frieze as a
// row of flush grey triangles low on each face (Zelenko).
const atticRing = rect(X0, Y0, X1, Y1)
slab(marble, atticRing, H, ATTIC, roof, marble)
for (const [a, b] of [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
  const f = frame(a, b), n = Math.round(f.L / 2.4)
  for (const s of spread(0.3, f.L - 0.3, n)) {
    roof.tri(f.at(s - 0.9, H + 0.35, 0.03), f.at(s + 0.9, H + 0.35, 0.03), f.at(s, H + 1.25, 0.03))
  }
}

// The recessed top storey (23-29 m): a glazed band behind white mullions
// at the pylon pitch, a white roof edge.
const top: XY[] = [[-29.3, -61.0], [31.0, -60.2], [29.7, 55.1], [-30.4, 54.4]]
walls(sky, top, ATTIC, TOP - 0.8)
slab(marble, top, TOP - 0.8, TOP, roof)
for (let i = 0; i < 4; i++) {
  const a = top[i], b = top[(i + 1) % 4], f = frame(a, b), n = Math.round(f.L / 3.0)
  for (const s of spread(0, f.L, n + 1)) panel(marble, a, b, Math.min(f.L - 0.2, Math.max(0.2, s)), 0.4, ATTIC, TOP - 0.8, 0.04)
}
// Rooftop boxes (29-32 m).
for (const [x0, y0, x1, y1] of [[-15.9, -48.9, -8.6, -46.9], [9.8, -48.7, 17.1, -46.6], [-9.0, -6.8, -4.0, -4.7], [4.1, -6.6, 9.2, -4.6], [-9.2, 9.5, -4.1, 11.5], [4.0, 9.6, 9.0, 11.6], [-9.4, 25.6, -4.3, 27.6], [3.8, 25.7, 8.9, 27.7]]) {
  slab(marble, rect(x0, y0, x1, y1), TOP, 32, roof)
}
for (const x of [-12.6, -3.6, 4.9, 14.4]) for (const y0 of [-42.1, -34.4]) slab(marble, rect(x - 0.95, y0, x + 0.95, y0 + 6.8), TOP, 32, roof)

// ------------------------------------------------------------ the entrance
// The canopy at 4.5-5 m over the glass vestibule (OSM 3023285, 3023318).
slab(marble, rect(-8.3, GY1, 12.8, 68.0), 4.5, 5.0, marble, marble)
walls(glass, rect(-5.0, GY1, 9.2, 65.8), 0, 4.5)
// The gilt double-headed eagle on the attic over the entrance, both faces.
function eagle(cx: number, y: number, z0: number) {
  const s = 1.0
  const shape: [number, number][][] = [
    [[-0.6, 0.0], [0.6, 0.0], [0.9, 2.6], [-0.9, 2.6]], // body and shield
    [[-0.9, 1.2], [-2.6, 2.0], [-2.9, 4.2], [-1.0, 2.8]], // wing
    [[0.9, 1.2], [1.0, 2.8], [2.9, 4.2], [2.6, 2.0]],
    [[-0.9, 2.6], [-0.2, 2.6], [-0.7, 3.8], [-1.3, 3.5]], // necks and heads
    [[0.2, 2.6], [0.9, 2.6], [1.3, 3.5], [0.7, 3.8]],
    [[-0.5, 3.9], [0.5, 3.9], [0.35, 4.7], [-0.35, 4.7]], // crown
  ]
  for (const poly of shape) {
    const P = (p: [number, number], d: number): V3 => [cx + p[0] * s, y + d, z0 + p[1] * s]
    // counter-clockwise in (x, z) faces -y; draw the front (+y, north) reversed, and the back
    const sa = poly.reduce((acc, p, i) => { const q = poly[(i + 1) % poly.length]; return acc + p[0] * q[1] - q[0] * p[1] }, 0)
    const cc = sa > 0 ? poly : [...poly].reverse()
    gold.quad(P(cc[0], 0.35), P(cc[3], 0.35), P(cc[2], 0.35), P(cc[1], 0.35))
    gold.quad(P(cc[0], 0.05), P(cc[1], 0.05), P(cc[2], 0.05), P(cc[3], 0.05))
  }
}
eagle(2.2, Y1, H + 0.6)

// ------------------------------------------------------------ write
const lit = (_p: V3, n: V3): number => (n[2] > 0.7 ? 0.1 : 0.7)
const parts: { part: Part; material: MaterialSpec }[] = [
  { part: marble, material: { ...finish('skp-marble', 0xedeae3), floodlight: lit } },
  { part: glass, material: PALETTE.window },
  { part: sky, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: { ...finish('gkp-gold', 0xd9b552), floodlight: () => 1 } },
]
finishModel('State Kremlin Palace', 'moscow-state-kremlin-palace', parts, { bearing: 13.3, osm: 'relation/3031379', height: 32 }, 5000)
