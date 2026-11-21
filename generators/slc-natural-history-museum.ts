/**
 * Natural History Museum of Utah, Rio Tinto Center (Ennead Architects with
 * GSBS, 2011), Research Park, Salt Lake City — procedural, CC0-1.0, no
 * textures.
 *   bun generators/slc-natural-history-museum.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 334: the
 * model's +y runs up the building's long axis (NNW, along the contour of
 * the foothill), +x runs uphill (ENE). The anchor is the area centroid of
 * the outline (way/154223785, Q3915972).
 *
 * A long building laid along the foothill in three bars that step up the
 * slope, its upper storeys wrapped in copper panels over a board-formed
 * concrete base (the terraces "reference the shorelines of Lake
 * Bonneville"):
 *   - A, the downhill bar (x -38…-12): concrete base to 7 m, copper above,
 *     its roof rising from 17 m at the south to 19 m at the north (lidar
 *     23.3–25.2 against the west ground at 5.8 m), its west face leaning
 *     out 1.5 m as the copper band does in every photo;
 *   - B, the middle bar (x -12…7): copper to 20 m (lidar 25.3–26);
 *   - C, the uphill bar (x 7…27): the highest, to 28 m between y -35 and
 *     30 (lidar 32.6–34.3), 24 m north of that (29–30), 22 m south of it;
 *     its uphill side is buried 14–20 m in the hill, as the real one is;
 *   - the south end (y < -55) stays low, 12 m (lidar 16.5–19);
 *   - on the uphill side a roof plaza and the round planter court
 *     (OSM outline), 25.5 m (lidar 31.3);
 *   - the big glass "canyon" window in the copper of the west front, and
 *     the glazed lobby and entrance under it (Chris Light's photos).
 *
 * Elevation 0: z = 0 is the lowest ground under the footprint, the west
 * foot (lidar ground 5.8 above the box's minimum; the hill rises 20 m
 * across the building to the east, Mapterhorn likewise).
 *
 * Evidence
 * - OSM: way/154223785 outline; way/1302611808 (a small separate
 *   building uphill, not covered).
 * - Lidar: USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013, after the
 *   2011 opening), 1 m: every roof level and the ground along both sides.
 * - Photos (Wikimedia Commons):
 *   Chris Light, "Rio Tinto Building 4944.jpg" and "Main Entrance 4952
 *     panorama.jpg" (CC BY-SA 4.0; the west front, copper over concrete,
 *     the canyon window, the entrance);
 *   gillfoto, "NHM Rio Tinto Center 4134.jpg" and "4135.jpg" (CC BY-SA
 *     4.0; the copper band's folded planes, the concrete terraces).
 * Estimated: the base storey's height (7 m, photos); the copper's lean;
 *   the window's extent. The copper's horizontal banding, the folds and
 *   the cantilevered prow at the south-west are simplified to planes.
 * Doubts: the uphill (east) side is not photographed here.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, triangulate, type XY } from './dc-nationals-park'

const copper = new Part(), concrete = new Part(), roof = new Part(), glass = new Part(), door = new Part()

// The outline (way/154223785) in this frame.
const OUTLINE: XY[] = [[26.7, 8.3], [25.7, 72.3], [7.9, 72.0], [8.0, 66.9], [-10.6, 67.8], [-10.4, 51.9], [-28.8, 51.4], [-28.9, -4.8], [-29.5, -14.4], [-37.6, -17.3], [-30.3, -41.3], [-17.2, -75.9], [-3.0, -71.5], [-6.1, -59.1], [10.7, -54.3], [13.1, -59.2], [26.9, -55.2], [24.2, -33.2], [24.3, -26.5], [22.6, -20.6], [25.9, -19.9], [28.5, -22.8], [32.8, -24.9], [38.8, -24.6], [44.2, -20.7], [44.9, -15.9], [43.8, -11.1], [40.6, -6.8], [34.3, -4.8], [29.8, -6.4], [26.8, -9.6], [25.9, -7.0]]

/** Clip a polygon to the half-plane where f(p) >= 0 (f linear). */
function clip(poly: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}
const band = (poly: XY[], x0: number, x1: number, y0 = -1e3, y1 = 1e3) =>
  clip(clip(clip(clip(poly, (p) => p[0] - x0), (p) => x1 - p[0]), (p) => p[1] - y0), (p) => y1 - p[1])
const area2 = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)

/**
 * A block between z0 and a top that may slope (`top(x, y)`), its walls
 * in `wall` (faces whose outward normal points west, within `leanTo`,
 * lean out by `lean` at the top), its roof in `cap`.
 */
function block(poly: XY[], z0: number, top: (p: XY) => number, wall: Part, cap: Part | null, lean = 0, westWall?: Part) {
  if (poly.length < 3) return
  const P = area2(poly) < 0 ? [...poly].reverse() : poly
  const minX = Math.min(...P.map((p) => p[0]))
  const shift = (p: XY): XY => (lean && p[0] < minX + 1.2 ? [p[0] - lean, p[1]] : p)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    const A = shift(a), B = shift(b)
    const part = westWall && out[0] < -0.5 * Math.hypot(out[0], out[1]) ? westWall : wall
    quad(part, [[a[0], a[1], z0], [b[0], b[1], z0], [B[0], B[1], top(b)], [A[0], A[1], top(a)]], out)
  }
  if (cap) for (const [i, j, k] of triangulate(P)) {
    const T = [P[i], P[j], P[k]].map((p) => { const s = shift(p); return [s[0], s[1], top(p)] as V3 })
    cap.tri(T[0], T[1], T[2])
  }
}
const flat = (h: number) => () => h

// The concrete base under everything, to 7 m.
block(OUTLINE, 0, flat(7), concrete, roof)
// A: the downhill bar, copper above the base, its roof rising to the north.
const A = band(OUTLINE, -40, -12, -56, 60)
block(A, 7, (p) => 17 + (2 * (p[1] + 56)) / 108, copper, roof, 1.5)
// B: the middle bar.
block(band(OUTLINE, -12, 7, -56, 80), 7, flat(20), copper, roof)
// C: the uphill bar, in three heights.
block(band(OUTLINE, 7, 27, -35, 30), 7, flat(28), copper, roof)
block(band(OUTLINE, 7, 27, 30, 80), 7, flat(24), copper, roof)
block(band(OUTLINE, 7, 27, -80, -35), 7, flat(22), copper, roof)
// The south end, low.
block(band(OUTLINE, -40, 7, -80, -56), 7, flat(12), copper, roof)
// The uphill plaza and the round court (OSM), on the hillside.
block(band(OUTLINE, 27, 50, -60, 9), 7, flat(25.5), concrete, roof)

// The canyon window in the west front's copper (y -16…6), and the glazed
// lobby under it, set just proud of the leaning face.
{
  const x0 = -28.95, x1 = -30.45 // foot and head of the leaning face
  const z0 = 8.5, z1 = 16.5, ya = -4.8, yb = 6
  const xa = (z: number) => x0 + ((x1 - x0) * (z - 7)) / (17 + (2 * (yb + 56)) / 108 - 7) - 0.06
  quad(glass, [[xa(z0), ya, z0], [xa(z0), yb, z0], [xa(z1), yb, z1], [xa(z1), ya, z1]], [-1, 0, 0])
  // Lobby glazing and doors in the base.
  quad(glass, [[-28.96, -4.5, 1.2], [-28.96, 40, 1.2], [-28.96, 40, 5.8], [-28.96, -4.5, 5.8]], [-1, 0, 0])
  quad(door, [[-29.0, 2, 0], [-29.0, 9, 0], [-29.0, 9, 3.2], [-29.0, 2, 3.2]], [-1, 0, 0])
}
// Glass bands along the step faces between the bars: B's west face over
// A's roof, C's over B's.
quad(glass, [[-11.96, -50, 17.6], [-11.96, 51.5, 19.6], [-11.96, 51.5, 19.9], [-11.96, -50, 18.6]], [-1, 0, 0])
quad(glass, [[6.94, -34, 21], [6.94, 29.5, 21], [6.94, 29.5, 26.5], [6.94, -34, 26.5]], [-1, 0, 0])

// ---------------------------------------------------------------------------
const parts = [
  { part: copper, material: finish('nhmu-copper', 0xa36f5a) },
  { part: concrete, material: finish('nhmu-concrete', 0xd3cfc7) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: { ...PALETTE.window, color: 0x7f9bb0 } },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Natural History Museum of Utah', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 334, osm: 'way/154223785', height: 28,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/slc-natural-history-museum.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
