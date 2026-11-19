/**
 * Lyndon Baines Johnson Library and Museum (1971, Gordon Bunshaft of
 * Skidmore, Owings & Merrill) on its plaza,
 * University of Texas at Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-lbj-library.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 14.8, the library's
 * long axis (OSM way/172662523), so +y runs up the long walls toward the
 * north-north-east. The anchor is the library's centre, -97.7292852,
 * 30.2858948.
 *
 * What the model covers. OSM draws the library as its walls only (36 x 59
 * m). The library stands on a raised travertine plaza that OSM doesn't
 * draw: on the east it meets Sid Richardson Hall (way/172662518, the LBJ
 * School, built with the library to the same design, a 30 x 285 m bar)
 * at the hall's ground floor; on the west, north and south it is a podium
 * wall over the lawns. The model is the library and its plaza and replaces
 * the library's outline. The hall stays the map's own building: drawn
 * with the library it put the monolith at a few pixels in the 80 px view,
 * and it is a building of its own in OSM.
 *
 * Identity (photos):
 *  1. A windowless travertine monolith: the long east and west walls run
 *     past the ends and lean in as they rise (battered), the end walls
 *     recessed between them (Found5dollar 06; Enmanuel).
 *  2. The flared top floor: a deep travertine slab oversailing the walls on
 *     every side, a row of corbels under its edge, and the dark band of
 *     narrow windows between the slab and the walls (Found5dollar 01, 06).
 *  3. The plaza round its foot, a podium wall over the lawns with a dark
 *     band under its coping (Enmanuel; 1971 photo).
 *  4. The entrance: dark glazing at plaza level in the end wall with a
 *     ledge and a window band over it (Found5dollar 06).
 *
 * Heights, z above the lowest ground under the model (Mapterhorn 173.52 m,
 * the lawn at the podium's west foot, from tools/terrain.ts check; round
 * the podium the north lawn is 2-5 m up, the south lawn 0-1 m, and the
 * ground by the hall on the east level with the plaza, so the walls there
 * sink into it). Flat base, per the frame contract: Mapterhorn counts the
 * plaza as ground, and the map fills it out under the model and lets the
 * model draw it. The map's drape lifts the plaza's east edge, next to the
 * hall, a few metres above its west edge (tools/terrain.ts).
 *   Lidar (USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, 1 m, read in this
 *   frame; the buildings are unchanged since 1971): the plaza 180.8 m (7.3),
 *   x -27 to 49, y -56 to 42; the library's roof 207.5 m (34.0: 26.7 above
 *   the plaza), the slab over x -19.5 to 19.6 and y -31 to 31, a rooftop
 *   penthouse to 210.1 m (x -8 to 10, y -28 to 18).
 *   Rechecked (dsm and ground-classified returns along the axes): the
 *   plaza is ground-classified at 180.8 m right up to the walls, the south
 *   lawn 6.8 m below it at y -60, the west lawn 6.2-7.9 m below at x -28 to
 *   -40. So the podium is 6-7 m on the lawn sides and level with the ground
 *   on the east; the library's "ten storeys" count floors under the plaza
 *   that open to the west lawn (34 m from the lawn to the roof).
 *   Estimated from the photos: the walls' top 20.3 m above the plaza; the
 *   batter (2.75 m in over the height, so the slab oversails the walls' top
 *   by 4.2 m on the long sides); the fins running 4.1 m past the recessed
 *   end walls; the window band 2.2 m;
 *   the slab 3.2 m; the corbels (1 m wide, 1.4 m deep, every 3.4 m); the
 *   penthouse's height (kept low: no ground photo shows it); the entrance.
 *
 * Evidence
 * - OSM: way/172662523 (library); way/172662518 (Sid Richardson Hall, not
 *   replaced).
 * - Lidar and Mapterhorn as above; NAIP (USGS): the plaza's paving grid, roofs.
 * - Published (Wikipedia, "Lyndon Baines Johnson Library and Museum"):
 *   1971, Bunshaft/SOM, ten storeys, travertine.
 * - Photos (Wikimedia Commons):
 *   Found5dollar, "LBJ Library March 2024 01.jpg", "... 02.jpg" and
 *     "... 27.jpg", CC BY-SA 4.0 (the monolith from the plaza, corbels and
 *     window band; the end wall and its entrance);
 *   Enmanuel, "Lyndon B. Johnson Presidential Library 2022.jpg", CC BY-SA
 *     4.0 (from the west lawn, the podium wall under the library);
 *   LBJ Library (NARA), "Johnson library.jpg", public domain, 1971 (from
 *     the fountain: the library over the podium).
 * Left out: the lettering, planters and trees, the podium's stairs (no
 *   photo shows them).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, triangulate, type XY } from './dc-nationals-park'

const trav = new Part(), plaza = new Part(), glass = new Part()

const PZ = 7.3 // the plaza (lidar)
const area2 = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)

/**
 * Walls round a plan polygon from z = 0 to `top`, in pieces no longer than
 * 6 m (the map drapes low faces vertex by vertex), and a flat roof.
 * `skip(i)` leaves out edge i (a side another mass covers).
 */
function block(poly: XY[], top: number, side: Part, cap: Part | null, skip = (i: number) => false) {
  const P = area2(poly) < 0 ? [...poly].reverse() : poly
  for (let i = 0; i < P.length; i++) {
    if (skip(i)) continue
    const a = P[i], b = P[(i + 1) % P.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1e-6) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const k = Math.max(1, Math.ceil(L / 6))
    const pt = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    for (let s = 0; s < k; s++) {
      const p0 = pt(s / k), p1 = pt((s + 1) / k)
      quad(side, [[p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], top], [p0[0], p0[1], top]], [n[0], n[1], 0])
    }
  }
  if (cap) for (const [i, j, k] of triangulate(P)) cap.tri([P[i][0], P[i][1], top], [P[j][0], P[j][1], top], [P[k][0], P[k][1], top])
}

/** A box between two plan corners, with a bevel round its top edge. */
function slab(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, bottom = true) {
  const ring = (d: number, z: number): V3[] => [[x0 + d, y0 + d, z], [x1 - d, y0 + d, z], [x1 - d, y1 - d, z], [x0 + d, y1 - d, z]]
  part.loft(bev > 0 ? [ring(0, z0), ring(0, z1 - bev), ring(bev, z1)] : [ring(0, z0), ring(0, z1)])
  part.cap(ring(bev, z1), true)
  if (bottom) part.cap(ring(0, z0), false)
}

// ---------------------------------------------------------------------------
// The plaza: x -27 to 49, y -56 to 42 (lidar), its east side against the
// hall; a low parapet, and the band of windows under its coping that the
// photos show on the lawn sides.
const PLAZA: XY[] = [[-27, -56], [49.1, -56], [49.1, 42], [-27, 42]]
block(PLAZA, PZ, trav, plaza, (i) => i === 1)
// The band under the coping on the west and south (lawn) sides.
for (const [a, b, n] of [[[-27.06, 41.4], [-27.06, -55.4], [-1, 0]], [[-26.4, -56.06], [49.1, -56.06], [0, -1]]] as [XY, XY, XY][])
  quad(glass, [[a[0], a[1], PZ - 3], [b[0], b[1], PZ - 3], [b[0], b[1], PZ - 1.2], [a[0], a[1], PZ - 1.2]], [n[0], n[1], 0])
slab(trav, -27, 49.1, -56, -55.4, PZ, PZ + 1, 0, false) // the parapet
slab(trav, -27, 49.1, 41.4, 42, PZ, PZ + 1, 0, false)
slab(trav, -27, -26.4, -55.4, 41.4, PZ, PZ + 1, 0, false)

// ---------------------------------------------------------------------------
// The library. Walls to W, the window band to B, the slab to the roof
// (lidar 26.7 above the plaza).
const TOP = PZ + 26.7, B = TOP - 3.2, W = PZ + 20.3
// The two long walls, battered fins: 18.15 out at the foot (OSM) and 15.4
// at the top, 4.75 m thick at the foot, running 4.1 m past the recessed end
// walls, their ends leaning in 0.6 m as they rise.
const XI = 13.4, YE = 25.5 // the inner faces; the recessed end walls
for (const s of [-1, 1]) {
  const xo0 = s * 18.15, xo1 = s * 15.4, xi = s * XI, y0 = 29.6, y1 = 29.0
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  quad(trav, [P(xo0, -y0, PZ), P(xo0, y0, PZ), P(xo1, y1, W), P(xo1, -y1, W)], [s, 0, 0.15]) // the outer face
  quad(trav, [P(xo1, -y1, W), P(xo1, y1, W), P(xi, y1, W), P(xi, -y1, W)], [0, 0, 1])
  for (const e of [-1, 1]) {
    quad(trav, [P(xi, e * y0, PZ), P(xo0, e * y0, PZ), P(xo1, e * y1, W), P(xi, e * y1, W)], [0, e, 0.02]) // the fin's end
    quad(trav, [P(xi, e * YE, PZ), P(xi, e * y0, PZ), P(xi, e * y1, W), P(xi, e * YE, W)], [-s, 0, 0]) // its inner face in the recess
  }
}
slab(trav, -XI, XI, -YE, YE, PZ, W, 0, false) // the recessed end walls
slab(glass, -15.4, 15.4, -27, 27, W, B, 0, false) // the dark band of narrow windows, all round
slab(trav, -19.6, 19.6, -31, 31, B, TOP, 0.4) // the oversailing top floor (lidar)
slab(plaza, -7, 9, -26, 16, TOP, TOP + 1.5, 0.3, false) // rooftop penthouse
// The corbels: deep ribs from the band out to the slab's edge, and the
// shadowed gaps between them (dark, set 0.6 m back), which are what the
// band reads as from above, where the slab hides the windows themselves.
slab(glass, -19, 19, -30.4, 30.4, B - 1.4, B, 0, true)
for (const s of [-1, 1]) {
  for (let y = -27.2; y <= 27.21; y += 3.4) slab(trav, s > 0 ? 15.4 : -19.4, s > 0 ? 19.4 : -15.4, y - 0.5, y + 0.5, B - 1.4, B, 0, true)
  for (let x = -13.6; x <= 13.61; x += 3.4) slab(trav, x - 0.5, x + 0.5, s > 0 ? 27 : -30.8, s > 0 ? 30.8 : -27, B - 1.4, B, 0, true)
}
// The entrance in each end wall: dark glazing at plaza level, a ledge, a
// band of windows over it.
for (const s of [-1, 1]) {
  const y = s * (YE + 0.06)
  quad(glass, [[-12.5, y, PZ], [12.5, y, PZ], [12.5, y, PZ + 4], [-12.5, y, PZ + 4]], [0, s, 0])
  slab(trav, -XI, XI, s > 0 ? YE : -YE - 1.1, s > 0 ? YE + 1.1 : -YE, PZ + 4, PZ + 4.6, 0, true)
  quad(glass, [[-11.5, y, PZ + 5.2], [11.5, y, PZ + 5.2], [11.5, y, PZ + 6.6], [-11.5, y, PZ + 6.6]], [0, s, 0])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: trav, material: finish('lbj-travertine', 0xebe0cc) },
  { part: plaza, material: finish('lbj-plaza', 0xd2c9bb) },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Lyndon Baines Johnson Library and Museum', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 14.8, osm: 'way/172662523', height: TOP + 1.5,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/atx-lbj-library.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
