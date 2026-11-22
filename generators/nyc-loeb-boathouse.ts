/**
 * Loeb Boathouse, Central Park, on the north-east shore of the Lake (1954,
 * Aymar Embury II's office for the Parks Department, replacing Vaux's
 * Victorian boathouse; now The Central Park Boathouse restaurant and boat
 * rental) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-loeb-boathouse.ts
 *
 * This file exports `hipRoof` and `face`, used by the other buildings of
 * this group (nyc-swedish-cottage, nyc-delacorte-theater); its own build
 * runs only under `import.meta.main`.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 347.1° (the outline's long edges run at 167.1° and 77.1°), so model
 * +y is NNW along the shore and −x (WSW) faces the Lake. Anchor: the
 * point the model was built about (-73.968725, 40.775323), ~5 m ESE of the
 * centroid of OSM relation/3698871 (multipolygon, building=yes,
 * amenity=restaurant, "Loeb Boathouse", height=7.3), which this model
 * replaces; no other building ways lie within 70 m.
 *
 * Plan (OSM, model frame): the lakeside edge at x −19.0 (y −29.2..12.2) and
 * −17.8 (y 12.2..31.2); the north block to x 14.2 between y 18.1 and 31.2;
 * the east wing to x 19.4 (y 6.7..18.1); the main hall's east wall at x
 * 4.7..6.6 (y −26.5..2.3); an open court x −10.6..−3.6, y 2.4..11.2 (the
 * relation's inner ring). USGS NAIP (public domain) shows the lakeside
 * strip as a white flat roof ~11 m deep (x −19.4..−8.5) and green hipped
 * roofs over the main hall, the north block and the east wing.
 *
 * Heights. y = 0 is the lowest ground under the footprint, the Lake's edge
 * (Mapterhorn: the floor area stands ~1.5 m above it, falling to 0 at the
 * lakeside wall).
 * - Published: OSM height=7.3 above the floor's ground, so the main ridge at
 *   ~8.8–9.3 above y = 0.
 * - Estimated from the photos, scaled on the colonnade's 3.4 m columns and
 *   the 3.8 m bay: terrace floor +1.3, entablature 4.7..5.6, hipped roofs
 *   (~28°) with eaves at 5.2–5.6 and ridges 7.6–9.6 (the main hall drawn a little over OSM to match the photos), the dormer and the
 *   chimney. No lidar was read.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-loeb-boathouse/photos):
 * - Ajay Suresh, "Central Park - Loeb Boathouse (48377219127).jpg", CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_-_Loeb_Boathouse_(48377219127).jpg
 *   (from the Lake, WSW: the whole lakeside front, colonnade, awnings, the
 *   green roofs, the brick gable, the dormer and the chimney)
 * - Daniel Schwen, "NYC The Lake boathouse.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:NYC_The_Lake_boathouse.jpg
 *   (from the Lake, further south-west)
 * - Jim.henderson, "CP Boathouse NW jeh.JPG", public domain,
 *   https://commons.wikimedia.org/wiki/File:CP_Boathouse_NW_jeh.JPG
 *   (from the NW along the lakeside: columns, glass walls, awnings, the
 *   flat white entablature, the terrace edge over the water)
 * - Jim.henderson, "Loeb Boathouse snowing jeh.jpg", CC0,
 *   https://commons.wikimedia.org/wiki/File:Loeb_Boathouse_snowing_jeh.jpg
 *   (the landward side: red brick with buff piers, big windows, green
 *   standing-seam hipped roof)
 *
 * Colours from the photos: pale verdigris-green standing-seam roofs, white
 * columns and entablature, red-and-white striped awnings (drawn as one
 * muted red), red brick with buff dressings, grey stone terrace edge.
 *
 * Doubts: the north and east sides are seen only in the snow photo, and the
 * east wing's roof form comes from NAIP; the flagpole and the boat dock are
 * left out. The awnings' stripes are one colour. Where the brick gable
 * stands relative to the north block is estimated from one photo.
 */
import { Part, type V3, sub, cross } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { box, ngon, opening, board, type P2 } from './nyc-cp-dairy'

/** A planar convex face from points, wound outward (away from `inside`). */
export function face(p: Part, pts: V3[], inside: V3) {
  const n0 = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const c = pts.reduce((a, q) => [a[0] + q[0] / pts.length, a[1] + q[1] / pts.length, a[2] + q[2] / pts.length] as V3, [0, 0, 0] as V3)
  const d = sub(c, inside)
  const s = n0[0] * d[0] + n0[1] * d[1] + n0[2] * d[2] < 0 ? -1 : 1
  const l = Math.hypot(...n0) || 1
  const n: V3 = [(s * n0[0]) / l, (s * n0[1]) / l, (s * n0[2]) / l]
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/**
 * A hipped roof over the rectangle x0..x1 × y0..y1: eaves at `eave` on the
 * wall line, ridge at `ridge` along the longer side (a pyramid on a square),
 * overhang `oh`, drawn as a slab `t` thick with a flat soffit.
 * `ridgeAxis` forces the ridge direction.
 */
export function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, oh = 0.5, t = 0.25, ridgeAxis?: 'x' | 'y') {
  const along = ridgeAxis ?? (x1 - x0 >= y1 - y0 ? 'x' : 'y')
  const half = along === 'x' ? (y1 - y0) / 2 : (x1 - x0) / 2
  const k = (ridge - eave) / half
  const X0 = x0 - oh, X1 = x1 + oh, Y0 = y0 - oh, Y1 = y1 + oh, ze = eave - oh * k
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const r = (along === 'x' ? Math.max(0, (x1 - x0) / 2 - half) : Math.max(0, (y1 - y0) / 2 - half))
  const R0: V3 = along === 'x' ? [cx - r, cy, ridge + t] : [cx, cy - r, ridge + t]
  const R1: V3 = along === 'x' ? [cx + r, cy, ridge + t] : [cx, cy + r, ridge + t]
  const a: V3 = [X0, Y0, ze + t], b: V3 = [X1, Y0, ze + t], c: V3 = [X1, Y1, ze + t], d: V3 = [X0, Y1, ze + t]
  const ins: V3 = [cx, cy, eave - 2]
  if (along === 'x') {
    face(p, [a, b, R1, R0], ins); face(p, [c, d, R0, R1], ins)
    face(p, [b, c, R1], ins); face(p, [d, a, R0], ins)
  } else {
    face(p, [b, c, R1, R0], ins); face(p, [d, a, R0, R1], ins)
    face(p, [c, d, R1], ins); face(p, [a, b, R0], ins)
  }
  // Fascia and soffit.
  const lo = (q: V3): V3 => [q[0], q[1], ze]
  const ring = [a, b, c, d]
  for (let i = 0; i < 4; i++) { const u = ring[i], v = ring[(i + 1) % 4]; face(p, [lo(u), lo(v), v, u], [cx, cy, ze]) }
  face(p, ring.map(lo), [cx, cy, ze + 1])
}

/** A gabled roof slab along x (ridge along x) over x0..x1 × y0..y1, with gable walls in `wall`. */
export function gableX(roof: Part, wall: Part | null, x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, oh = 0.5, ohEnd = 0.4, t = 0.25, ends: [boolean, boolean] = [true, true]) {
  const yc = (y0 + y1) / 2, k = (ridge - eave) / ((y1 - y0) / 2)
  const X0 = x0 - ohEnd, X1 = x1 + ohEnd
  for (const s of [-1, 1]) {
    const ye = s < 0 ? y0 - oh : y1 + oh, ze = eave - oh * k
    board(roof, [[ye, ze], [yc, ridge], [yc, ridge + t], [ye, ze + t]].map(([v, z]): P2 => [v, z]), (v, z) => [(X0 + X1) / 2, v, z], [1, 0, 0], X1 - X0)
  }
  if (wall) {
    const tri: P2[] = [[y0, eave], [y1, eave], [yc, ridge - 0.02]]
    if (ends[0]) board(wall, tri, (v, z) => [x0 + 0.15, v, z], [1, 0, 0], 0.3)
    if (ends[1]) board(wall, tri, (v, z) => [x1 - 0.15, v, z], [1, 0, 0], 0.3)
  }
}

// ===========================================================================
// Loeb Boathouse
// ===========================================================================

function build() {
  const brick = new Part(), white = new Part(), green = new Part(), win = new Part(), awning = new Part(), deck = new Part()
  const F = 1.3 // terrace and floor level above the Lake's edge

  // --- The lakeside dining room: a colonnade of white columns on a stone
  // terrace, glass walls behind, a flat white entablature roof. ---
  const C = { x0: -19.0, x1: -10.4, y0: -29.2, y1: 12.2 }
  box(deck, C.x0 - 0.2, C.y0, C.x1, C.y1, 0, F)
  box(deck, C.x0 - 0.35, C.y0 - 0.15, C.x0 + 0.1, C.y1, F - 0.15, F + 0.05) // the terrace's coping
  const gx = -16.9 // the glass wall
  box(white, gx, C.y0 + 0.4, C.x1, C.y1, F, 4.7)
  const bays = 11, bw = (C.y1 - C.y0) / bays
  for (let i = 0; i < bays; i++) {
    const yc = C.y0 + (i + 0.5) * bw
    opening(win, gx, yc, -1, 0, bw - 0.45, F + 0.1, 4.45, 0, 0.05)
    // A striped awning over each bay: a sloped board from the glass outward.
    const w = bw - 0.7
    board(awning, [[gx - 0.05, 4.55], [gx - 1.25, 3.85], [gx - 1.25, 3.65], [gx - 0.05, 4.35]], (x, z) => [x, yc, z], [0, 1, 0], w)
  }
  // Columns: Tuscan, white, a square base and capital.
  for (let i = 0; i <= bays; i++) {
    const y = C.y0 + 0.35 + (i * (C.y1 - C.y0 - 0.7)) / bays, x = C.x0 + 0.5
    box(white, x - 0.36, y - 0.36, x + 0.36, y + 0.36, F, F + 0.3)
    ngon(white, x, y, 0.27, F + 0.3, 4.5, 10, 0)
    box(white, x - 0.38, y - 0.38, x + 0.38, y + 0.38, 4.5, 4.7)
  }
  // Entablature and flat roof, a cornice lip.
  box(white, C.x0 - 0.05, C.y0 - 0.05, C.x1, C.y1, 4.7, 5.45)
  box(white, C.x0 - 0.3, C.y0 - 0.3, C.x1, C.y1 + 0.3, 5.45, 5.7)

  // --- The main hall behind: brick walls, a green hipped roof with a dormer. ---
  const H = { x0: -10.4, x1: 5.6, y0: -26.5, y1: 2.3, eave: 5.6, ridge: 9.6 }
  box(brick, H.x0, H.y0, H.x1, H.y1, 0, H.eave)
  box(white, H.x0 - 0.1, H.y0 - 0.1, H.x1 + 0.1, H.y1 + 0.1, H.eave - 0.35, H.eave)
  hipRoof(green, H.x0, H.y0, H.x1, H.y1, H.eave, H.ridge, 0.55)
  // The dormer on the lakeside slope, a small hipped cap, louvred face.
  const k = (H.ridge - H.eave) / ((H.x1 - H.x0) / 2)
  const dx = -7.6, dz = H.eave + (dx - H.x0) * k
  box(brick, dx, -10.2, dx + 2.4, -7.8, dz - 1.4, dz + 1.0)
  box(white, dx - 0.05, -10.25, dx + 2.4, -7.75, dz + 0.85, dz + 1.05)
  opening(win, dx, -9.0, -1, 0, 1.5, dz - 0.3, dz + 0.75, 0, 0.04)
  hipRoof(green, dx, -10.2, dx + 2.4, -7.8, dz + 1.05, dz + 2.0, 0.25, 0.15)
  // Brick chimney near the north end.
  box(brick, -2.4, -0.2, -1.2, 1.0, 6.0, 10.2)
  box(white, -2.55, -0.35, -1.05, 1.15, 10.0, 10.3)
  // Landward windows: tall panels between buff piers, as in the snow photo.
  for (let y = H.y0 + 2.4; y < H.y1 - 1.5; y += 3.6) {
    opening(white, H.x1, y, 1, 0, 3.0, F + 0.2, 4.6, 0.25, 0.03)
    opening(win, H.x1, y, 1, 0, 2.5, F + 0.5, 4.3, 0.2, 0.06)
  }
  for (const x of [-6.0, -2.0, 2.0]) {
    opening(white, x, H.y0, 0, -1, 3.0, F + 0.2, 4.6, 0.25, 0.03)
    opening(win, x, H.y0, 0, -1, 2.5, F + 0.5, 4.3, 0.2, 0.06)
  }

  // --- The north part: a glazed lakeside annex, a brick cross gable facing
  // the Lake, and a hipped north block. ---
  const N = { x0: -14.0, x1: 14.2, y0: 20.4, y1: 31.2, eave: 5.2, ridge: 8.8 }
  box(white, -17.8, 12.2, N.x0, 31.2, 0, 4.9)
  box(white, -18.05, 12.0, N.x0, 31.4, 4.9, 5.2)
  for (let y = 13.6; y < 31; y += 3.15) {
    opening(win, -17.8, y, -1, 0, 2.6, F + 0.1, 4.3, 0, 0.05)
    board(awning, [[-17.85, 4.75], [-18.9, 4.15], [-18.9, 3.95], [-17.85, 4.55]], (x, z) => [x, y, z], [0, 1, 0], 2.7)
  }
  box(brick, N.x0, N.y0, N.x1, N.y1, 0, N.eave)
  box(white, N.x0 - 0.1, N.y0 - 0.1, N.x1 + 0.1, N.y1 + 0.1, N.eave - 0.3, N.eave)
  hipRoof(green, N.x0, N.y0, N.x1, N.y1, N.eave, N.ridge, 0.5)
  for (let x = N.x0 + 3; x < N.x1 - 1; x += 4.2) {
    opening(white, x, N.y1, 0, 1, 2.8, F + 0.2, 4.3, 0.25, 0.03)
    opening(win, x, N.y1, 0, 1, 2.3, F + 0.5, 4.0, 0.2, 0.06)
  }
  // The brick cross gable, ridge along x, its gable end to the Lake.
  const G = { x0: N.x0, x1: -1.0, y0: 12.2, y1: 20.4, eave: 5.2, ridge: 8.6 }
  box(brick, G.x0, G.y0, G.x1, G.y1, 0, G.eave)
  gableX(green, brick, G.x0, G.x1, G.y0, G.y1, G.eave, G.ridge, 0.45, 0.35, 0.25, [true, false])
  const gyc = (G.y0 + G.y1) / 2, gk = (G.ridge - G.eave) / ((G.y1 - G.y0) / 2)
  // White raking boards on the gable.
  for (const s of [-1, 1]) {
    const ye = s < 0 ? G.y0 - 0.45 : G.y1 + 0.45
    board(white, [[ye, G.eave - 0.45 * gk], [gyc, G.ridge + 0.05], [gyc, G.ridge - 0.35], [ye, G.eave - 0.45 * gk - 0.4]], (v, z) => [G.x0 - 0.36, v, z], [1, 0, 0], 0.12)
  }
  opening(win, G.x0, gyc, -1, 0, 1.0, 5.9, 7.2, 0.5, 0.05)
  // Flat-roofed brick links: east of the court, and between the hall and the east wing.
  box(brick, -3.6, H.y1, 3.2, G.y0, 0, 4.9)
  box(white, -3.7, H.y1, 3.3, G.y0, 4.9, 5.15)

  // --- The east wing: brick, a green pyramid roof. ---
  const E = { x0: 3.2, x1: 19.4, y0: 3.2, y1: 18.1, eave: 4.6, ridge: 7.6 }
  box(brick, E.x0, E.y0, E.x1, E.y1, 0, E.eave)
  box(white, E.x0 - 0.1, E.y0 - 0.1, E.x1 + 0.1, E.y1 + 0.1, E.eave - 0.3, E.eave)
  hipRoof(green, E.x0, E.y0, E.x1, E.y1, E.eave, E.ridge, 0.5)
  for (let y = E.y0 + 2.5; y < E.y1 - 1; y += 3.4) {
    opening(white, E.x1, y, 1, 0, 2.6, F + 0.2, 3.9, 0.25, 0.03)
    opening(win, E.x1, y, 1, 0, 2.1, F + 0.5, 3.6, 0.2, 0.06)
  }

  finishModel('Loeb Boathouse', 'nyc-loeb-boathouse', [
    { part: brick, material: { name: 'brick', color: 0xa95f4c, roughness: 0.9 } },
    { part: white, material: { name: 'trim', color: 0xf4eee2, roughness: 0.85 } },
    { part: green, material: { name: 'roof-verdigris', color: 0x8fbf9f, roughness: 0.7 } },
    { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: awning, material: { name: 'awning', color: 0xb8716a, roughness: 0.85 } },
    { part: deck, material: { name: 'stone', color: 0xaaa69d, roughness: 0.9 } },
  ], { bearing: 347.1, osm: 'relation/3698871', height: 10.3 }, 5000)
}

if (import.meta.main) build()
