/**
 * Manhattan Bridge (1909; Leon Moisseiff, Gustav Lindenthal; portal and
 * anchorage design by Carrère and Hastings) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-manhattan-bridge.ts
 *
 * The whole bridge as one placement, from the Brooklyn end of its OSM outline
 * to the Manhattan end: both towers, both anchorages with their colonnades
 * and archways, four main cables, the suspenders, the four stiffening
 * trusses, the deck's underside, the walkway and bikeway and the subway
 * track beds, and the approach girders on their piers out to the outline's
 * ends. Writes a low model (towers with plain columns, cables, the trusses
 * as solid bands) and a detail model (the trusses opened into a Warren
 * truss with verticals, its web painted white as on the bridge, suspenders,
 * floor beams, railings, track beds, arched approach piers), which a map
 * draws from detailZoom up.
 *
 * Frame: x across the bridge (+x the bikeway's side), y along it toward
 * Manhattan, z up, metres; origin midway between the towers, on the water.
 * Placed at bearing 337.02°, the line between the towers' centroids.
 *
 * Height. z is NAVD88 + 1.63: the map lays the river under the main span,
 * the footprint's lowest ground, at −1.63 m NAVD88 and stands z = 0 there,
 * so every part lands at its NAVD88 height. Lidar heights below are NAVD88.
 * The map owns the three roadways' surfaces: the trusses rise beside the
 * upper roadways, the underside hangs below the lower one, and nothing here
 * is a slab at road level. Built to the lidar roadway (the map's decks once
 * the prepared `ele` pins are uploaded; within 0.15 m of each pin):
 * - upper roadways, west and east (ways 46179217, 46179210): 50.7 m at
 *   midspan, 48.2 at the towers, 41.5 at the anchorages' river faces, 39.6
 *   at their landward faces, 24.8 and 24.0 at the Brooklyn end, 22.8 at the
 *   Manhattan end;
 * - lower roadway (way 46189305): 44.7 m at midspan, 42.2 at the towers,
 *   35.4 and 33.6 over the anchorages, 21.5 at the Brooklyn end; on the
 *   Manhattan approach, where a deck covers it from y = 662, a straight 3.2 %
 *   grade to 20.8 at y = 912, where lidar sees it again;
 * - the walkway, bikeway and track beds 0.12 m under the lower roadway, as
 *   the lidar has them.
 * `UPPER_WEST`, `UPPER_EAST` and `LOWER` hold the profiles every 20 m.
 *
 * Standing on the terrain. The towers stand in the river at z = 0. The
 * anchorages' walls and the approach piers run down to the map's own
 * terrain (Mapterhorn, sampled in this frame every 10 m:
 * `BROOKLYN_GROUND`, `MANHATTAN_GROUND`) vertex by vertex.
 *
 * Sources:
 * - OSM: the outline relation/17233746 (height=41, the old guess for the
 *   decks), towers way/317352033 and way/1255353996, piers way/1016640944
 *   and way/1255353997, anchorages way/1255353998 and way/1017507380 with
 *   their colonnades (building:parts 1255353999, 1255354000, 1255354001,
 *   1255354002), the approach pier way/1252123716, and the streets under the
 *   approaches, which the approach piers stand clear of.
 * - Lidar, USGS 3DEP NY_NewYorkCity (2017), every return within 32 m of the
 *   axis, taken into this frame: the roadway profiles above; the towers
 *   448.7 m apart (published 1,470 ft; OSM's outlines are 444 m apart, the
 *   Brooklyn one about 3.6 m off); the cables at x ≈ ±6.1 and ±14.6, their
 *   tops a parabola 52.57 + 0.000933·y² over the main span (rms 0.05 m;
 *   99.5 m at the towers), and on the side spans parabolas through 96.8,
 *   59.1 and 44.0 m (Brooklyn) and 95.3, 58.2 and 43.9 m (Manhattan) at 6,
 *   114 and 214 m from the towers; the parapets on the upper roadways'
 *   outer edges 1.3 m up, the inner ones 0.7 m; the lowest bracing in the
 *   towers' outer bays 55.2 m, 7 m over the upper roadways; the colonnades'
 *   tops 44.6 m (45.8 m at their corners), 34.6 m long, x = ±17.4 to ±24;
 *   the suspenders every 5.53 m (18.1 ft), one at midspan (164 suspenders seen over
 *   the main span, rms 0.2 m off a 5.528 m grid), which is the trusses'
 *   panel length.
 * - Published (Wikipedia "Manhattan Bridge"): main span 1,470 ft, side
 *   spans 725 ft, 120 ft wide; four cables of 21¼ in; four stiffening
 *   trusses, the inner pair 40 ft apart and each outer one 28 ft beyond,
 *   each under a cable, 24 ft (or 26 ft) deep, Warren trusses, their tops
 *   carrying the upper roadways;
 *   lower-level floor beams 37 in deep; four subway tracks, two under each
 *   upper roadway; walkway on the south side, bikeway on the north;
 *   anchorages 237 × 182 ft, topped by a 40 ft five-bay colonnade, with
 *   sloping buttresses and a 46 ft arch for Cherry Street (Manhattan) and
 *   Water Street's plaza (Brooklyn). SINY, "Manhattan Bridge
 *   Rehabilitation": the approach spans' bearings sit on masonry piers.
 * - Photos: HAER NY-127-4 "View of Manhattan approach with Midtown in
 *   background" and NY-127-8 "Manhattan tower and anchorage looking
 *   southwest" (Jet Lowe, public domain; the trusses' lattice running on
 *   over the anchorages and approaches, the anchorages' buttresses and
 *   arches); "Adams Street beneath the Manhattan Bridge, Dumbo" (Christian
 *   David, CC BY-SA 4.0; the underside and the anchorage's river face);
 *   "Manhattan Bridge from Washington Street, Dumbo" (Christian David, CC
 *   BY-SA 4.0; the Warren truss, the walkway round the tower); "Street fair
 *   under the Manhattan Bridge overpass" (MusikAnimal, CC BY-SA 4.0) and
 *   "Water-Adams Sts arch Manhattan Bridge" (Jim.henderson, CC0; the
 *   Brooklyn archway); "Down Under the Manhattan Bridge Overpass" (Marc
 *   Jacobs, CC BY-SA 4.0; the lights along the cables at night).
 * - The stiffening trusses: a post at every suspender and one diagonal per
 *   panel, alternating, the diagonals meeting the top chord at even panel
 *   points (HAER NY-127-4; "Murry Bergtraum HS Field td (2021-06-10) 02 -
 *   Manhattan Bridge", Tdorante10, CC BY-SA 4.0; "Manhattan Bridge
 *   Washington St jeh", Jim.henderson, CC0: the white diagonals and posts
 *   between blue-grey chords). Depth 8.1 to 8.5 m out to out, chord centres
 *   about 7.4 m apart: the published 24-26 ft between the lidar's roadway
 *   and parapet on top and the lower level's 37 in floor beams below.
 * - Approach piers: masonry, one under each roadway's pair of trusses, two
 *   shafts joined by an arch over a passage (HAER NY-127-4, the piers by the
 *   Manhattan anchorage); 3.4 m thick, as OSM maps the one at y = 779.5
 *   (way/1252123716, x = -17.5 to 18.4). The rest are placed one to a block,
 *   at least 1 m clear of every street OSM maps under the approaches
 *   (Manhattan: Monroe, Madison, Henry, East Broadway, Division, Mechanics
 *   Alley, Forsyth; Brooklyn: Front, Pearl, York, the BQE, Prospect, Jay,
 *   Sands), the two halves apart where Pearl Street crosses at a slant.
 * - Estimated: the trusses' bottom 1.4 m under the lower roadway, and on
 *   the approaches, where the lower level climbs toward the upper roadways,
 *   held 8.1 m under the top as HAER NY-127-4 shows them, but 4.6 m (15 ft)
 *   clear of the streets under them; the member
 *   sizes (chords 0.7 x 0.9 m, diagonals 0.85 m and posts 0.5 m across,
 *   from the photos); the approach piers' positions within each block, their
 *   arches (4.8 m wide, springing 5.5 m up) and copings; the web's colour,
 *   off-white from the photos; the archways' centres (y = ±464,
 *   from the streets through them); the buttresses' size; the cable lights'
 *   spacing (about 12 m, on the outer cables). The cables are drawn 0.8 m
 *   thick against the real 0.54 m. The deck over the Manhattan approach's
 *   lower roadway, the walkway's high fences and the towers' hoods over the
 *   paths are left out.
 *
 * The towers keep the approved tower model's design and sources:
 *
 * What makes it the Manhattan Bridge: four slender steel columns in one
 * plane, the outer pairs filled with stacked X bracing, the open centre bay
 * topped by a tall semicircular arch, a heavy cornice across the top with
 * four ball finials, columns flaring out onto a granite pier, blue-grey paint.
 *
 * - OSM: piers 42.7 x 20.3 m (man_made=pier). Plan from the tower outline in
 *   the bridge frame: 36.2 x 7.6 m, columns at |x| 4.4–8.1 and 12.5–16.5,
 *   the bays between them set in 0.8 m.
 * - Lidar: cornice top 97.75 m, 36 m across; finial tops 102.85 m over each
 *   column, pier top 5.4–7.2 m.
 * - Published: towers 336 ft (102 m) above mean high water; 135 ft (41 m)
 *   navigational clearance (Wikipedia "Manhattan Bridge"; NYC DOT).
 * - Photos (Wikimedia Commons): "Manhattan Bridge tower, Dumbo, Brooklyn,
 *   New York" (Christian David, CC BY-SA 4.0); "NYC Manhattan Bridge detail"
 *   (Arnoldius, CC BY-SA 3.0); "Manhattan Bridge and One Manhattan Square
 *   from Brooklyn Bridge, 20231005" (Jakub Hałun, CC BY-SA 4.0); "Manhattan
 *   Bridge from the Brooklyn Bridge (6214687229)" (Tony Hisgett, CC BY 2.0);
 *   HAER NY,31-NEYO,164-11 "Manhattan tower looking northwest" (Jet Lowe,
 *   public domain).
 * - Column centre lines from the lidar's finial peaks (|x| 6.1 and 14.55);
 *   column width 3.4 m from the end-on photo.
 * - Estimated from photos: five X panels above the deck and two below, the
 *   arch spring (84.15 m), the lattice frieze (91.15–95.75 m) and the
 *   cornice projecting about 2 m past the outer columns, the column feet's
 *   flare, the finial pedestals and balls.
 * - Colour: the blue-grey paint from sunlit daylight photos (#7f97a6 to
 *   #93a8b4), pulled to the palette's lightness; the bracing a shade deeper
 *   so the X panels read against the columns; the pier's granite buff.
 *
 * The geometry helpers below are shared with the Williamsburg, Queensboro
 * and Hell Gate bridge generators.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import {
  along, band, bead, face, footedLoft, footedWall, groundAt, merged, movedAlong, parabola, piecewise, ribbon, rod, stations, truss, tube,
  type GroundGrid,
} from './bridge-kit'

// ---- Shared helpers ----------------------------------------------------------

export const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** Corners of a plan rectangle with chamfered corners (r = 0: plain), CCW from above. */
export function rim(x0: number, x1: number, y0: number, y1: number, r: number, z: number): V3[] {
  if (r <= 0) return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  return [[x0 + r, y0, z], [x1 - r, y0, z], [x1, y0 + r, z], [x1, y1 - r, z],
    [x1 - r, y1, z], [x0 + r, y1, z], [x0, y1 - r, z], [x0, y0 + r, z]]
}

/** A closed prism lofted through rings (each CCW from above, i.e. from the far end), capped. */
export function loftSolid(p: Part, rings: V3[][], caps = [true, true]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
  }
  const fan = (ring: V3[], flip: boolean) => {
    const pts = flip ? [...ring].reverse() : ring
    for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
  }
  if (caps[1]) fan(rings[rings.length - 1], false)
  if (caps[0]) fan(rings[0], true)
}

/** An upright box with chamfered vertical edges (r) and optional chamfered top/bottom edges. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  { r = 0.3, top = 0, bot = 0, bottom = true, lid = p }: { r?: number; top?: number; bot?: number; bottom?: boolean; lid?: Part } = {}) {
  const rings: V3[][] = []
  if (bot > 0) rings.push(rim(x0 + bot, x1 - bot, y0 + bot, y1 - bot, Math.max(0.05, r - bot * 0.4), z0))
  rings.push(rim(x0, x1, y0, y1, r, z0 + bot))
  rings.push(rim(x0, x1, y0, y1, r, z1 - top))
  if (top > 0) rings.push(rim(x0 + top, x1 - top, y0 + top, y1 - top, Math.max(0.05, r - top * 0.4), z1))
  loftSolid(p, rings, [bottom, false])
  const last = rings[rings.length - 1]
  for (let i = 1; i < last.length - 1; i++) lid.tri(last[0], last[i], last[i + 1])
}

/** A straight member from a to b with a w x t rectangular section (t measured along `side`). */
export function beam(p: Part, a: V3, b: V3, w: number, t: number, side: V3 = [0, 1, 0]) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, side[0] * d[0] + side[1] * d[1] + side[2] * d[2])))
  const W = cross(S, d)
  const section = (o: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    .map(([u, v]) => add(o, add(mul(W, u * w / 2), mul(S, v * t / 2))))
  loftSolid(p, [section(a), section(b)])
}

/**
 * An X-braced panel in a vertical plane y = yc, between x0..x1 and z0..z1:
 * two broad diagonal plates, clipped to the panel so nothing pokes past it.
 */
export function xPanel(p: Part, x0: number, x1: number, z0: number, z1: number, yc: number, w: number, t: number) {
  // Each diagonal is a parallelogram whose vertical ends sit on the panel's sides.
  const h = (w / 2) * Math.hypot(x1 - x0, z1 - z0) / (x1 - x0) // vertical half-thickness of a plate
  for (const [za, zb] of [[z0, z1], [z1, z0]]) {
    const lo = (z: number) => Math.max(z0, Math.min(z1, z))
    const f: V3[] = [[x0, yc - t / 2, lo(za - h)], [x1, yc - t / 2, lo(zb - h)], [x1, yc - t / 2, lo(zb + h)], [x0, yc - t / 2, lo(za + h)]]
    const b: V3[] = f.map(([x, , z]) => [x, yc + t / 2, z] as V3)
    // Faces: front (-y), back (+y), top and bottom edges.
    p.quad(f[0], f[1], f[2], f[3]); p.quad(b[0], b[3], b[2], b[1])
    p.quad(f[3], f[2], b[2], b[3]); p.quad(f[0], b[0], b[1], f[1])
  }
}

/** A UV sphere (segments around, rings pole to pole). */
export function ball(p: Part, c: V3, r: number, seg = 12, rings = 8) {
  const pt = (i: number, j: number): V3 => {
    const th = (2 * Math.PI * i) / seg, ph = Math.PI * (j / rings - 0.5)
    return [c[0] + r * Math.cos(ph) * Math.cos(th), c[1] + r * Math.cos(ph) * Math.sin(th), c[2] + r * Math.sin(ph)]
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const a = pt(i, j), b = pt(i + 1, j), cc = pt(i + 1, j + 1), d = pt(i, j + 1)
    const n = (q: V3) => norm(sub(q, c))
    if (j > 0) p.tri(a, b, cc, undefined, undefined, undefined, [n(a), n(b), n(cc)])
    if (j < rings - 1) p.tri(a, cc, d, undefined, undefined, undefined, [n(a), n(cc), n(d)])
  }
}

/**
 * A wall slab between x0..x1, y0..y1 from the semicircular arch (centre xc,
 * spring zs, radius r) up to z1: the spandrels over an arched opening, with
 * the intrados drawn through the slab's depth in `soffit`.
 */
export function archWall(p: Part, soffit: Part, x0: number, x1: number, y0: number, y1: number,
  xc: number, zs: number, r: number, z1: number, seg = 12) {
  const arc = (i: number): [number, number] => {
    const th = Math.PI - (Math.PI * i) / seg
    return [xc + r * Math.cos(th), zs + r * Math.sin(th)]
  }
  for (let i = 0; i < seg; i++) {
    const [xa, za] = arc(i), [xb, zb] = arc(i + 1)
    // Front (y0, faces -y) and back (y1, faces +y) faces, strip by strip.
    p.quad([xa, y0, za], [xb, y0, zb], [xb, y0, z1], [xa, y0, z1])
    p.quad([xb, y1, zb], [xa, y1, za], [xa, y1, z1], [xb, y1, z1])
    const na: V3 = [xc - xa, 0, zs - za], nb: V3 = [xc - xb, 0, zs - zb]
    soffit.tri([xa, y0, za], [xa, y1, za], [xb, y1, zb], undefined, undefined, undefined, [norm(na), norm(na), norm(nb)])
    soffit.tri([xa, y0, za], [xb, y1, zb], [xb, y0, zb], undefined, undefined, undefined, [norm(na), norm(nb), norm(nb)])
  }
  // Haunches between the arch's feet and the slab's sides, front and back.
  for (const [y, s] of [[y0, 1], [y1, -1]] as [number, number][]) {
    const q = (a: V3, b: V3, c: V3, d: V3) => s > 0 ? p.quad(a, b, c, d) : p.quad(d, c, b, a)
    q([x0, y, zs], [xc - r, y, zs], [xc - r, y, z1], [x0, y, z1])
    q([xc + r, y, zs], [x1, y, zs], [x1, y, z1], [xc + r, y, z1])
  }
  p.quad([x0, y1, zs], [x0, y0, zs], [x0, y0, z1], [x0, y1, z1])
  p.quad([x1, y0, zs], [x1, y1, zs], [x1, y1, z1], [x1, y0, z1])
  // Flat undersides beside the arch.
  for (const [a, b] of [[x0, xc - r], [xc + r, x1]]) if (b - a > 0.01) p.quad([a, y0, zs], [a, y1, zs], [b, y1, zs], [b, y0, zs])
}

export const countParts = (parts: { part: Part }[]) => parts.reduce((s, p) => s + p.part.triangles, 0)

// ---- The Manhattan Bridge -----------------------------------------------------

const DATUM = 1.63 // the map's river, −1.63 m NAVD88, is z = 0
const H = (navd: number) => navd + DATUM

const TY = 224.35             // tower centre lines, y = ±TY
const FACE = 4.7              // the towers' cornice, half-depth
const AF = 445.1, AB = 503.3  // the anchorages' river and landward faces, |y|
const YB = -908.2, YM = 939.4 // the outline's ends
const IN = 6.1, OUT = 14.6    // truss and cable centre lines, |x|
const WALK0 = 15.0, WALK1 = 18.8 // walkway (x < 0) and bikeway (x > 0), |x|
const BAY = 5.528             // suspender spacing and truss panel (lidar), panel points at y = k·BAY

/** Lidar roadway heights (NAVD88) every 20 m from y = -920. */
const profile = (heights: number[]) => piecewise(heights.map((h, i) => [-920 + 20 * i, H(h)] as [number, number]))
const UPPER_WEST = profile([
  24.41, 25.2, 26.18, 27.15, 28.14, 29.12, 30.11, 31.05, 31.76, 32.39, 33.06, 33.68, 34.28, 34.92, 35.55, 36.17, 36.79, 37.4,
  38.01, 38.64, 39.26, 39.88, 40.47, 41.02, 41.53, 42.13, 42.7, 43.28, 43.86, 44.46, 45.07, 45.72, 46.39, 47.06, 47.71, 48.3,
  48.84, 49.2, 49.54, 49.85, 50.12, 50.35, 50.45, 50.56, 50.64, 50.69, 50.7, 50.66, 50.6, 50.47, 50.32, 50.11, 49.88, 49.69,
  49.4, 49.08, 48.74, 48.23, 47.68, 47, 46.32, 45.66, 45, 44.39, 43.77, 43.18, 42.6, 42.03, 41.46, 40.91, 40.38, 40.03, 39.61,
  39.04, 38.43, 37.78, 37.16, 36.54, 35.92, 35.31, 34.7, 34.09, 33.44, 32.6, 31.66, 30.65, 29.71, 28.74, 27.76, 26.82, 25.8,
  24.77, 23.76, 22.78,
])
const UPPER_EAST = profile([
  23.41, 24.35, 25.26, 26.19, 27.11, 28.02, 28.97, 29.9, 30.82, 31.76, 32.73, 33.58, 34.2, 34.83, 35.44, 36.06, 36.68, 37.3,
  37.94, 38.56, 39.17, 39.82, 40.39, 40.97, 41.52, 42.09, 42.68, 43.26, 43.83, 44.42, 45.04, 45.68, 46.34, 47.02, 47.7, 48.29,
  48.8, 49.18, 49.49, 49.78, 50.06, 50.3, 50.46, 50.62, 50.66, 50.72, 50.73, 50.72, 50.64, 50.52, 50.36, 50.18, 49.96, 49.7,
  49.48, 49.11, 48.75, 48.24, 47.67, 47, 46.32, 45.62, 45, 44.36, 43.76, 43.17, 42.57, 41.99, 41.45, 40.89, 40.4, 40.05, 39.62,
  39.06, 38.46, 37.82, 37.18, 36.56, 35.94, 35.3, 34.69, 34.04, 33.43, 32.78, 32.16, 31.53, 30.52, 29.37, 28.25, 27.15, 26.07,
  24.89, 23.81, 22.77,
])
const LOWER = profile([
  21.2, 21.52, 21.9, 22.46, 23.06, 23.66, 24.32, 24.92, 25.52, 26.17, 26.8, 27.4, 28.05, 28.66, 29.27, 29.9, 30.52, 31.13,
  31.77, 32.38, 33.01, 33.66, 34.3, 34.92, 35.47, 36.07, 36.65, 37.2, 37.78, 38.38, 39, 39.64, 40.3, 40.98, 41.69, 42.26,
  42.76, 43.13, 43.46, 43.76, 44.02, 44.26, 44.43, 44.56, 44.61, 44.67, 44.66, 44.64, 44.58, 44.45, 44.3, 44.09, 43.86, 43.67,
  43.37, 43.07, 42.69, 42.19, 41.62, 40.95, 40.26, 39.61, 38.94, 38.32, 37.72, 37.12, 36.52, 35.97, 35.4, 34.85, 34.22, 33.61,
  32.99, 32.38, 31.76, 31.1, 30.46, 29.88, 29.26, 28.74, 28.17, 27.54, 26.91, 26.28, 25.65, 25.01, 24.38, 23.75, 23.12, 22.49,
  21.86, 21.22, 20.7, 20.4,
])
const upper = (x: number) => (x < 0 ? UPPER_WEST : UPPER_EAST)
const walkAt = (y: number) => LOWER(y) - 0.12

/** The map's terrain (Mapterhorn, NAVD88), 10 m apart in this frame: rows along y from y0, columns across from x = -30. */
const BROOKLYN_GROUND: GroundGrid = { y0: -910, x0: -30, step: 10, z: [
  [21.1, 21.2, 21.6, 21.3, 21.5, 21.3, 20], [21.2, 21.4, 21.7, 21.4, 21.7, 21, 20.4], [21.4, 21.6, 21.9, 21.6, 22, 21.2, 20.5],
  [18.8, 21.8, 22.1, 21.8, 22, 21.6, 20.4], [17.8, 19.8, 19.3, 21.1, 19.1, 20.5, 17.8], [17.5, 17.6, 17.3, 17.1, 16.9, 16.5, 16.2],
  [17.2, 17, 17, 16.9, 16.8, 16.5, 16.4], [16.9, 16.9, 17.3, 17.1, 16.8, 16.5, 16.5], [17.1, 16.9, 16.9, 16.7, 16.6, 16.5, 16.6],
  [17.4, 17.1, 16.9, 16.8, 16.8, 16.7, 16.6], [17.5, 17.3, 17.1, 17, 16.9, 16.7, 16.6], [17.5, 17.2, 17.1, 17, 16.9, 16.7, 16.6],
  [17.5, 17.2, 17.1, 16.9, 16.8, 16.6, 16.5], [17.6, 17.2, 17, 16.8, 16.6, 16.4, 16.3], [17.4, 17, 16.8, 16.7, 16.5, 16.3, 15.9],
  [17, 17, 16.8, 16.6, 16.4, 16.2, 15.8], [16.8, 16.9, 16.7, 16.4, 16.1, 15.9, 15.6], [16.7, 17.1, 16.7, 16.3, 15.9, 15.5, 15.4],
  [16.4, 16.3, 16.1, 15.8, 15.5, 15.2, 15], [15.6, 15.3, 15.1, 15.1, 17.7, 20.6, 14.6], [14.9, 14.8, 14.6, 20, 20.4, 20.6, 16.8],
  [14.4, 15.5, 19.8, 20.1, 20.4, 19.5, 13.7], [18.9, 19.5, 19.9, 20.1, 14.3, 13.2, 13.2], [19, 19.5, 18.9, 12.8, 12.6, 12.6, 12.7],
  [12.5, 14.4, 12.2, 12.1, 12.1, 12, 12], [11.8, 11.8, 11.6, 11.6, 11.5, 11.4, 11.4], [11.3, 11.1, 11.1, 11.1, 11.2, 11.3, 11.4],
  [10.8, 10.7, 10.8, 10.8, 10.9, 11, 10.6], [10.3, 10.4, 10.2, 10.4, 10.4, 10.6, 9.8], [10.3, 10.2, 9.7, 9.7, 9.8, 10.1, 9.4],
  [10.4, 9.5, 9.4, 9.4, 9.2, 8.9, 8], [9.3, 9.1, 8.9, 8.8, 8.6, 8.4, 7.9], [8.8, 8.6, 8.6, 8.5, 8.2, 7.6, 7.2],
  [8.3, 8.3, 8.1, 7.9, 7.8, 7.9, 7.1], [7.9, 7.8, 7.6, 7.1, 6.7, 6.4, 6.5], [6.9, 7, 7.1, 6.6, 6.1, 5.7, 5.8],
  [6.2, 6.2, 6.3, 6.2, 5.9, 5.4, 5.5], [5.6, 5.3, 5.2, 5.2, 5.3, 5.3, 5.3], [4.9, 5, 5.1, 5.1, 5.1, 5.1, 5],
  [4.8, 5, 5, 5, 5, 4.9, 4.9], [4.6, 4.8, 4.9, 4.9, 4.9, 4.9, 4.8], [4.6, 4.8, 4.8, 4.8, 4.8, 4.8, 4.6],
  [4.4, 4.8, 4.8, 4.8, 4.7, 4.6, 4.5], [4.3, 4.7, 4.6, 4.6, 4.6, 4.6, 4.4], [4.2, 4.4, 4.4, 4.4, 4.4, 4.4, 4.2],
  [4.2, 4.3, 4.3, 4.3, 4.3, 4.3, 4.1], [4, 4.4, 4.4, 4.5, 4.4, 4.4, 3.9], [3.9, 4.1, 4.3, 4.3, 4.3, 4.1, 3.6],
] }
const MANHATTAN_GROUND: GroundGrid = { y0: 440, x0: -30, step: 10, z: [
  [2.5, 2.6, 2.9, 3.2, 3.5, 3.4, 3.2], [3.7, 3.4, 3.4, 3.4, 3.6, 3.8, 3.5], [3.7, 3.9, 3.9, 3.9, 4, 4, 3.8],
  [3.8, 4.1, 4.1, 4.1, 4.2, 4.2, 3.9], [4.1, 4.6, 4.5, 4.5, 4.4, 4.4, 4.3], [4.2, 4.8, 4.8, 4.7, 4.7, 4.8, 4.6],
  [4.9, 5.2, 5.2, 5.1, 5.1, 5.1, 5], [5.5, 5.5, 6, 5.9, 5.9, 5.8, 5.5], [5.4, 5.6, 5.6, 5.8, 5.8, 5.8, 5.9],
  [5.6, 5.4, 6.1, 6, 5.8, 5.9, 6.2], [5.5, 5.6, 5.6, 5.7, 5.8, 6.1, 6.5], [5.6, 5.9, 6.5, 6.5, 6.6, 6.8, 6.8],
  [5.9, 7.5, 7.4, 7.3, 7.2, 7.2, 7.1], [7.8, 7.6, 7.6, 7.6, 7.5, 7.4, 7.2], [7.7, 7.8, 8.1, 8.4, 8.7, 9.1, 7.7],
  [7.2, 8.2, 8.7, 9, 9.2, 9.4, 7.2], [6.7, 8.4, 8.9, 9.1, 9.3, 9.5, 8.7], [6.4, 8.7, 8.7, 9, 9.2, 9.6, 9.2],
  [7.5, 9, 8.5, 8.1, 8.8, 9.7, 9.7], [9.5, 9.2, 8.6, 8.3, 8.9, 9.8, 9.7], [9.7, 9.5, 9, 9.2, 9.3, 9.5, 9.6],
  [9.5, 9.6, 9.7, 9.8, 9.8, 9.8, 9.8], [9.6, 9.6, 9.7, 9.9, 10, 10.1, 9.9], [9.6, 9.6, 9.8, 10, 10.2, 10.2, 9.8],
  [9, 9.8, 10.1, 10.4, 10.7, 11, 9.8], [9, 9.9, 10.2, 10.4, 10.6, 10.7, 10.4], [10, 10, 10.4, 10.5, 10.5, 10.6, 10.5],
  [9.7, 10.2, 10.4, 10.6, 10.6, 10.6, 10.8], [9.2, 10.2, 10.5, 10.6, 10.7, 10.7, 10.8], [10, 10.3, 10.4, 10.5, 10.7, 10.8, 10.9],
  [10.2, 10.4, 10.5, 10.6, 10.8, 10.8, 11.1], [10.5, 10.6, 10.7, 10.8, 10.9, 10.9, 11.4], [10.6, 10.7, 10.8, 11, 11.1, 11.2, 10.1],
  [10.7, 11, 11.2, 11.3, 11.4, 11.4, 11.5], [10.8, 11.1, 11.3, 11.4, 11.5, 11.5, 11.8], [10.9, 10.9, 11.1, 11.3, 11.5, 11.6, 12],
  [11, 11.3, 11.5, 11.6, 11.7, 11.8, 11.9], [11.2, 11.3, 11.6, 11.8, 12, 11.9, 11.9], [11.4, 11.6, 11.7, 11.7, 11.7, 11.7, 11.7],
  [11.5, 11.5, 11.6, 11.6, 11.7, 11.5, 11.6], [11.4, 11.3, 11.4, 11.4, 11.5, 11.4, 11.5], [11.3, 11.7, 17.8, 16.7, 14.9, 11.2, 11.4],
  [11.1, 14.2, 26.6, 21.4, 15.2, 11.1, 11.3], [11, 13.7, 26.1, 20.7, 14.3, 11, 11.1], [10.9, 12.4, 25.6, 25.7, 21.8, 11.4, 11.3],
  [11, 15.8, 24.8, 21.6, 24.6, 12, 11.6], [11.1, 17.3, 24.4, 21, 24.7, 12.2, 11.9], [12.9, 17.6, 23.9, 20.8, 24.1, 12.5, 12.2],
  [13.2, 18, 23.4, 20.6, 23.6, 12.7, 12.5], [13.3, 18.5, 22.9, 20.5, 23, 13.1, 12.9], [13.3, 18.2, 22.5, 20.3, 22.6, 13.5, 13.2],
] }
/** The ground under the anchorages and approaches; over the river and the side spans nothing reaches it. */
const ground = (x: number, y: number) =>
  Math.abs(y) < 440 ? -Infinity : H(groundAt(y < 0 ? BROOKLYN_GROUND : MANHATTAN_GROUND, x, y))

// ---- Towers ---------------------------------------------------------------------

const PIER = H(5.35), COPE = H(6.15), PED = H(7.75) // pier, coping, granite pedestal under the columns
const FLARE = H(29.15)                     // the column feet flare out below this
const DECK0 = H(35.15), DECK = H(41.85)    // portal girder under the lower level, 0.35 m under its roadway
const UPPER_AT_TOWERS = H(48.25)           // the upper roadways through the outer bays
const LAT0 = H(54.6)                       // the lowest bracing over the upper roadways (lidar)
const SPRING = H(84.15)                    // centre arch
const COR0 = H(91.15), FRIEZE = H(95.75), COR1 = H(97.75) // lattice frieze under the cornice, cornice
const CAPTOP = H(100.35), FIN = H(102.85)  // finial pedestals, ball tops
const COLS = [6.1, 14.55] // column centre lines, |x| (lidar: the finials)
const CW = 1.7            // column half-width (x)
const CD = 3.8            // column half-depth (y)
const BY = 3.0            // bracing planes, |y|
const INNER = COLS[0] - CW

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const mainTop = (y: number) => 52.57 + 0.000933 * y * y
const sideTop: Record<number, (y: number) => number> = {
  [-1]: parabola([-230.25, 96.84], [-338.25, 59.06], [-438.25, 44.01]),
  [1]: parabola([233.75, 95.28], [341.75, 58.22], [441.75, 43.92]),
}
/** A main cable's top (lidar), easing onto the saddle over the last 15 m of each side span. */
function cableTop(y: number): number {
  if (Math.abs(y) <= TY) return mainTop(y)
  const s = Math.sign(y), side = sideTop[s]
  return side(y) + (mainTop(TY) - side(s * TY)) * smooth(1 - (Math.abs(y) - TY) / 15)
}
const CABLE_R = 0.4
const cable = (y: number) => H(cableTop(y) - 0.27) // centre: the real cable is 0.54 m thick
const SADDLE = cable(TY)

/** One tower centred on y = 0; `detail` keeps the chamfers and rounder balls. */
function tower(detail: boolean) {
  const steel = new Part(), brace = new Part(), granite = new Part()
  const seg = detail ? 12 : 8
  // The low model drops the chamfers and bevels.
  const R = (r: number) => (detail ? r : 0)

  box(granite, -21.4, 21.4, -10.15, 10.15, 0, PIER, { r: R(0.8), bottom: false })
  box(granite, -20.8, 20.8, -9.55, 9.55, PIER, COPE, { r: R(0.6), top: R(0.3), bottom: false })
  box(granite, -18.9, 18.9, -7.0, 7.0, COPE, PED, { r: R(0.5), top: R(0.35), bottom: false })

  for (const s of [-1, 1]) for (const cx of COLS) {
    const x = s * cx, n = detail ? 5 : 2, r = R(0.35)
    const rings: V3[][] = []
    for (let k = 0; k <= n; k++) {
      const t = k / n, f = (1 - t) * (1 - t)
      rings.push(rim(x - CW - 0.6 * f, x + CW + 0.6 * f, -CD - 3.0 * f, CD + 3.0 * f, r, PED + (FLARE - PED) * t))
    }
    rings.push(rim(x - CW, x + CW, -CD, CD, r, COR0))
    loftSolid(steel, rings, [false, false])
  }

  // Through the tower the lower level rests on a portal girder and each upper
  // roadway on a floor beam in its bay; trains run between the two.
  box(brace, -18.4, 18.4, -4.6, 4.6, DECK0, DECK, { r: R(0.3), bottom: true })
  for (const s of [-1, 1]) {
    const [x0, x1] = s > 0 ? [COLS[0] + CW, COLS[1] - CW] : [-COLS[1] + CW, -COLS[0] - CW]
    box(brace, x0, x1, -4.6, 4.6, UPPER_AT_TOWERS - 1.1, UPPER_AT_TOWERS - 0.35, { r: R(0.2), bottom: true })
  }
  archWall(brace, brace, -INNER, INNER, -BY - 0.4, BY + 0.4, 0, DECK0 - 8.5, INNER, DECK0, detail ? 10 : 6)

  const bx0 = COLS[0] + CW, bx1 = COLS[1] - CW
  const bays = (z0: number, z1: number, n: number) => {
    const h = (z1 - z0) / n
    // Struts on both faces; the low model joins each pair into one block through the tower.
    const planes = detail ? [[-BY - 0.35, -BY + 0.35], [BY - 0.35, BY + 0.35]] : [[-BY - 0.35, BY + 0.35]]
    for (let k = 0; k <= n; k++) for (const s of [-1, 1]) for (const [y0, y1] of planes)
      box(brace, s > 0 ? bx0 : -bx1, s > 0 ? bx1 : -bx0, y0, y1, z0 + k * h - 0.6, z0 + k * h + 0.6, { r: 0, bottom: detail })
    for (let k = 0; k < n; k++) for (const s of [-1, 1]) for (const y of [-BY, BY])
      xPanel(brace, s > 0 ? bx0 : -bx1, s > 0 ? bx1 : -bx0, z0 + k * h + 0.6, z0 + (k + 1) * h - 0.6, y, 1.1, 0.6)
  }
  bays(LAT0, COR0 - 0.6, 5)
  bays(PED + 4, DECK0, 2)

  archWall(brace, brace, -INNER, INNER, -BY - 0.4, BY + 0.4, 0, SPRING, INNER, COR0, seg)
  for (const [y, d] of [[-BY - 0.4, -1], [BY + 0.4, 1]] as [number, number][]) {
    const r0 = INNER, r1 = INNER + 0.9, yo = y + d * 0.3
    const P = (r: number, a: number, yy: number): V3 => [r * Math.cos(a), yy, SPRING + r * Math.sin(a)]
    const q = (a: V3, b: V3, c: V3, e: V3) => d < 0 ? steel.quad(a, b, c, e) : steel.quad(e, c, b, a)
    for (let i = 0; i < seg; i++) {
      const a0 = Math.PI - (Math.PI * i) / seg, a1 = Math.PI - (Math.PI * (i + 1)) / seg
      q(P(r0, a0, yo), P(r0, a1, yo), P(r1, a1, yo), P(r1, a0, yo))
      q(P(r1, a0, y), P(r1, a0, yo), P(r1, a1, yo), P(r1, a1, y))
      q(P(r0, a1, y), P(r0, a1, yo), P(r0, a0, yo), P(r0, a0, y))
    }
  }

  box(brace, -COLS[1] - CW, COLS[1] + CW, -3.7, 3.7, COR0, FRIEZE, { r: R(0.2), bottom: true })
  if (detail) for (const s of [-1, 1]) for (const cx of COLS)
    box(steel, s * cx - CW - 0.25, s * cx + CW + 0.25, -CD - 0.25, CD + 0.25, COR0 - 0.4, FRIEZE, { r: 0.35, bot: 0.3, bottom: true })
  box(steel, -18.2, 18.2, -4.7, 4.7, FRIEZE, COR1, { r: R(0.5), top: R(0.3), bot: R(0.5), bottom: true })

  // Finials, and the saddles the cables ride over the cornice on.
  const BR = 1.25
  for (const s of [-1, 1]) for (const cx of COLS) {
    const x = s * cx
    box(steel, x - 1.6, x + 1.6, -2.6, 2.6, COR1, COR1 + 0.9, { r: R(0.3), top: R(0.25), bottom: false })
    box(steel, x - 0.9, x + 0.9, -1.3, 1.3, COR1 + 0.9, CAPTOP, { r: R(0.25), top: R(0.2), bottom: false })
    box(steel, x - 0.8, x + 0.8, -FACE + 0.3, FACE - 0.3, COR1, SADDLE - CABLE_R + 0.05, { r: R(0.2), bottom: false })
    ball(steel, [x, 0, FIN - BR], BR, detail ? 12 : 6, detail ? 8 : 4)
  }
  return { steel, brace, granite }
}

// ---- Span, anchorages and approaches ---------------------------------------------

const towersAt = (p: Part) => merged(movedAlong(p, -TY), movedAlong(p, TY))
const runs = (cuts: number[]) => cuts.slice(0, -1).map((a, i) => [a, cuts[i + 1]] as [number, number])
/** Deck structure, outline end to outline end, broken at the towers. */
const DECK_RUNS = runs([YB, -TY - FACE, -TY + FACE, TY - FACE, TY + FACE, YM]).filter((_, i) => i % 2 === 0)
/** Suspended spans, anchorage face to anchorage face. */
const SPANS: [number, number][] = [[-AF, -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, AF]]
/** The underside, where the deck stands clear of the ground. */
const SOFFIT_RUNS: [number, number][] = [[-866, -AB], ...SPANS, [AB, 840]]
const WALK_RUNS: [number, number][] = [[-866, -TY - 7], [-TY + 7, TY - 7], [TY + 7, 891]]
const TRACK_RUNS: [number, number][] = [[-AB, AB]]

const trussTop = (x: number) => (y: number) => upper(x)(y) + (Math.abs(x) > 10 ? 1.3 : 0.7)
const TRUSS_D = 8.1    // out to out: 24 ft between chord centres
const CLEARANCE = 4.6  // over the streets under the approaches (15 ft)
/**
 * The trusses' bottom: under the lower level's floor beams, a full truss's
 * depth down where the lower level climbs toward the upper roadways but no
 * lower than the street clearance, or on the ground where an approach comes
 * down to it.
 */
const trussBot = (x: number) => (y: number) => {
  const top = trussTop(x)(y), g = ground(x, y)
  return Math.max(Math.min(LOWER(y) - 1.4, Math.max(top - TRUSS_D, g + CLEARANCE)), Math.min(g, top - 0.5))
}
const TRUSSES = [-OUT, -IN, IN, OUT]

const tri = (p: Part, a: V3, b: V3, c: V3, n: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
/** A quad with its true normal, turned to face the side `hint` points to. */
function faceTo(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = norm(cross(sub(c, a), sub(d, b)))
  face(p, a, b, c, d, n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? mul(n, -1) : n)
}

/** Panel points k·BAY inside a run, and the run's ends. */
function panelPoints([a, b]: [number, number]): { ys: number[]; flip: boolean } {
  const k0 = Math.ceil(a / BAY + 0.2), k1 = Math.floor(b / BAY - 0.2)
  const ys = [a, ...Array.from({ length: k1 - k0 + 1 }, (_, i) => (k0 + i) * BAY), b]
  // Diagonals keep one pattern along the whole bridge: k even is where they meet the top chord.
  return { ys, flip: ((k0 % 2) + 2) % 2 === 0 }
}

/** A stiffening truss in the plane x = xc: Warren with verticals, a post at every suspender. */
function stiffening(chords: Part, web: Part, xc: number, run: [number, number]) {
  const { ys, flip } = panelPoints(run)
  truss(chords, web, xc, ys, trussTop(xc), trussBot(xc), {
    chordW: 0.7, topD: 0.9, botD: 0.9, member: 0.85, post: 0.5, flip, minWeb: 1.5, curve: stations(run[0], run[1], 20),
  })
}

const AW = 24.4                  // anchorage half-width (OSM)
const ARCH_Y = 464, ARCH_R = 7   // the archway through each anchorage, under Water and Cherry Streets
const COLONNADE = [AF + 1.7, AF + 36.3] // the colonnades along each anchorage's sides, |y| (lidar)

/** An anchorage: masonry walls footed on the terrain, its top under the lower level, an archway through it, buttresses on its river face. */
function anchorage(s: number, stone: Part, vault: Part, step: number) {
  const top = (_x: number, y: number) => LOWER(y) - 0.55
  const yf = s * AF, yb = s * AB, yc = s * ARCH_Y
  footedWall(stone, [-AW, yf], [AW, yf], ground, top, [0, -s, 0], step)
  footedWall(stone, [-AW, yb], [AW, yb], ground, top, [0, s, 0], step)

  const zs = ground(0, yc) + ARCH_R // the arch springs 7 m up: a 14 m (46 ft) archway
  const arc = (i: number, n: number): [number, number, number] => {
    const th = (Math.PI * i) / n
    return [yc - s * ARCH_R * Math.cos(th), zs + ARCH_R * Math.sin(th), th]
  }
  const near = yc - s * ARCH_R, far = yc + s * ARCH_R
  for (const sx of [-1, 1]) {
    const x = sx * AW
    footedWall(stone, [x, yf], [x, near], ground, top, [sx, 0, 0], step)
    footedWall(stone, [x, far], [x, yb], ground, top, [sx, 0, 0], step)
    for (let i = 0; i < 8; i++) {
      const [ya, za] = arc(i, 8), [yb2, zb] = arc(i + 1, 8)
      face(stone, [x, ya, za], [x, yb2, zb], [x, yb2, top(x, yb2)], [x, ya, top(x, ya)], [sx, 0, 0])
    }
  }
  footedWall(stone, [-AW, near], [AW, near], ground, () => zs, [0, s, 0], step)
  footedWall(stone, [-AW, far], [AW, far], ground, () => zs, [0, -s, 0], step)
  for (let i = 0; i < 8; i++) {
    const [ya, za, ta] = arc(i, 8), [yb2, zb, tb] = arc(i + 1, 8), th = (ta + tb) / 2
    face(vault, [-AW, ya, za], [AW, ya, za], [AW, yb2, zb], [-AW, yb2, zb], [0, s * Math.cos(th), -Math.sin(th)])
  }

  const ys = stations(yf, yb, 3 * step)
  for (let i = 0; i < ys.length - 1; i++)
    face(stone, [-AW, ys[i], top(0, ys[i])], [AW, ys[i], top(0, ys[i])], [AW, ys[i + 1], top(0, ys[i + 1])], [-AW, ys[i + 1], top(0, ys[i + 1])], [0, 0, 1])

  // A cornice round the river face and the sides.
  const c0 = (y: number) => top(0, y) - 1.6, c1 = (y: number) => top(0, y) - 0.3
  band(stone, -AW - 0.5, AW + 0.5, [yf - s * 0.5, yf].sort((a, b) => a - b), () => c1(yf), () => c0(yf))
  for (const sx of [-1, 1]) band(stone, sx * AW, sx * (AW + 0.5), [...ys].sort((a, b) => a - b), c1, c0, { out: true, top: true, bottom: true })

  // Four battered buttresses on the river face, 5 m deep at the foot.
  const zt = top(0, yf) - 8, yo = yf - s * 5
  for (const bx of [-19.5, -8, 8, 19.5]) {
    const x0 = bx - 2, x1 = bx + 2
    faceTo(stone, [x0, yo, ground(x0, yo)], [x1, yo, ground(x1, yo)], [x1, yf, zt], [x0, yf, zt], [0, -s, 1])
    for (const [x, n] of [[x0, -1], [x1, 1]] as [number, number][])
      tri(stone, [x, yf, ground(x, yf)], [x, yo, ground(x, yo)], [x, yf, zt], [n, 0, 0])
  }
}

/** The colonnades on the anchorages: a roof on piers over each side's rest area, the walkway and bikeway passing under. */
function colonnade(stone: Part, detail: boolean) {
  const ROOF0 = H(43.0), ROOF1 = H(44.6), ATTIC = H(45.8), r = detail ? 0.2 : 0
  for (const s of [-1, 1]) for (const sx of [-1, 1]) {
    const [y0, y1] = COLONNADE.map((v) => s * v).sort((a, b) => a - b)
    const [x0, x1] = [sx * 17.4, sx * AW].sort((a, b) => a - b)
    box(stone, x0, x1, y0, y1, ROOF0, ROOF1, { r, top: r, bottom: true })
    for (const y of [y0 + 0.9, y1 - 0.9]) for (const x of [x0 + 0.9, x1 - 0.9])
      box(stone, x - 0.9, x + 0.9, y - 0.9, y + 0.9, ROOF1, ATTIC, { r, bottom: false })
    const piers = (xa: number, xb: number, n: number) => {
      for (let k = 0; k < n; k++) {
        const y = y0 + 0.8 + ((y1 - y0 - 1.6) * k) / (n - 1)
        box(stone, xa, xb, y - 0.8, y + 0.8, walkAt(y) - 0.45, ROOF0, { r, bottom: false })
      }
    }
    piers(sx > 0 ? AW - 1.2 : -AW, sx > 0 ? AW : -AW + 1.2, detail ? 6 : 2)
    piers(sx > 0 ? 19.0 : -20.2, sx > 0 ? 20.2 : -19.0, 2)
  }
}

/**
 * Approach piers, one under each roadway's pair of trusses: masonry with an
 * arched passage between the trusses, set where the streets under the
 * approaches are not. `y` is per side (x < 0, x > 0) where a street crosses
 * at a slant; `out` is the pier's outer face, |x|.
 */
const APPROACH_PIERS: { y: [number, number]; out: number }[] = [
  { y: [-790, -790], out: 16 }, { y: [-735, -735], out: 16 }, { y: [-672, -672], out: 16 },
  { y: [-605, -625], out: 16 }, { y: [-560, -557], out: 16 },
  { y: [537, 537], out: 17 }, { y: [620, 620], out: 17 }, { y: [697, 697], out: 17 },
  { y: [779.5, 779.5], out: 17.8 }, { y: [850, 850], out: 16 },
]
const PIER_D = 1.7, PIER_IN = IN - 1.7, SHAFT = 3.4, PIER_R = (OUT - IN - SHAFT) / 2 - 0.15

function approachPiers(stone: Part, vault: Part, detail: boolean) {
  for (const { y: ys, out } of APPROACH_PIERS) for (const [i, s] of [[0, -1], [1, 1]] as [number, number][]) {
    const y = ys[i], y0 = y - PIER_D, y1 = y + PIER_D, top = Math.min(trussBot(s * IN)(y), trussBot(s * OUT)(y))
    const span = (a: number, b: number) => [s * a, s * b].sort((p, q) => p - q) as [number, number]
    const rect = ([xa, xb]: [number, number], d = 0): [number, number][] =>
      [[xa - d, y0 - d], [xb + d, y0 - d], [xb + d, y1 + d], [xa - d, y1 + d]]
    const loft = (xs: [number, number], z: number, d = 0) =>
      footedLoft(stone, ground, [{ plan: rect(xs, d), z: 'ground' }, { plan: rect(xs, d), z }], detail ? 2.5 : 40)
    const xc = s * (PIER_IN + SHAFT + PIER_R)
    const zs = Math.max(ground(xc, y0), ground(xc, y1)) + 5.5
    if (!detail || top - zs < PIER_R + 1.5) { loft(span(PIER_IN, out), top); continue }
    // Two shafts with a plinth course, the arch between them, and a coping under the bottom chords.
    for (const xs of [span(PIER_IN, PIER_IN + SHAFT), span(PIER_IN + 2 * PIER_R + SHAFT, out)]) {
      loft(xs, Math.min(zs - 2.5, top), 0.25)
      loft(xs, top - 0.6)
    }
    const [xa, xb] = [xc - PIER_R, xc + PIER_R]
    archWall(stone, vault, xa, xb, y0, y1, xc, zs, PIER_R, top - 0.6, 8)
    box(stone, ...span(PIER_IN - 0.3, out + 0.3), y0 - 0.3, y1 + 0.3, top - 0.6, top, { r: 0, bottom: true })
  }
}

/**
 * The bikeway past the walkway runs' end at the Manhattan side, coming down
 * faster than the roadway and bending out to its ramp, to the outline's end:
 * OSM's way 46179218 in this frame and lidar (NAVD88), [x, y, z].
 */
const BIKE_TAIL: V3[] = [[16.9, WALK_RUNS[2][1], walkAt(WALK_RUNS[2][1])], [16.9, 918, H(19.6)], [19.4, 929, H(19.3)], [20.4, YM, H(18.9)]]

/** The walkway (x < 0) and bikeway, the balconies round the towers' outer columns, and in detail their railings. */
function paths(deck: Part, rail: Part | null, step = 20) {
  const railTop = (y: number) => walkAt(y) + 1.2
  const walk = (ys: number[], x0: number, x1: number, ends: boolean) => {
    band(deck, x0, x1, ys, walkAt, (y) => walkAt(y) - 0.5, { out: true, top: true, bottom: !!rail, ends })
    if (rail) band(rail, x1, x1 + Math.sign(x1) * 0.15, ys, railTop, walkAt, { out: true, in: true, top: true, ends })
  }
  for (const sx of [-1, 1]) {
    for (const run of WALK_RUNS) walk(rail ? stations(run[0], run[1], step) : lowStations(run), sx * WALK0, sx * WALK1, false)
    for (const t of [-TY, TY]) walk(stations(t - 7, t + 7, 7), sx * 16.4, sx * 20.6, true)
  }
  ribbon(deck, BIKE_TAIL, WALK1 - WALK0, 0.5)
}

/** Stations for the low model: 40 m over the suspended spans, 80 m on the straight grades of the approaches. */
function lowStations([a, b]: [number, number]): number[] {
  const cuts = [a, ...[-AB, -AF, AF, AB].filter((c) => c > a && c < b), b]
  const out = new Set<number>()
  for (let i = 0; i < cuts.length - 1; i++)
    for (const y of stations(cuts[i], cuts[i + 1], Math.abs(cuts[i]) >= AB || Math.abs(cuts[i + 1]) >= AB ? 80 : 40)) out.add(y)
  return [...out].sort((p, q) => p - q)
}

function lowModel() {
  const t = tower(false)
  const steel = towersAt(t.steel), brace = towersAt(t.brace), granite = towersAt(t.granite)
  const soffit = new Part(), deck = new Part(), lamps = new Part()

  for (const run of DECK_RUNS) {
    const ys = lowStations(run)
    for (const x of TRUSSES)
      band(steel, x - 0.3, x + 0.3, ys, trussTop(x), trussBot(x), { out: true, in: true, top: Math.abs(x) > 10, ends: true })
  }
  for (const run of SOFFIT_RUNS) band(soffit, -OUT, OUT, lowStations(run), (y) => LOWER(y) - 1.0, (y) => LOWER(y) - 1.0, { bottom: true })
  paths(deck, null)
  for (const x of TRUSSES) tube(steel, cablePath(x, 50), CABLE_R, 4)
  for (const p of necklace()) if (p.k % 3 === 1) bead(lamps, p.at, 2.6, true)
  for (const s of [-1, 1]) anchorage(s, granite, soffit, 12)
  colonnade(granite, false)
  approachPiers(granite, soffit, false)
  return { steel, brace, granite, soffit, deck, lamps }
}

function detailModel() {
  const t = tower(true)
  const steel = towersAt(t.steel), brace = towersAt(t.brace), granite = towersAt(t.granite)
  const soffit = new Part(), deck = new Part(), lamps = new Part(), wires = new Part(), web = new Part()

  for (const run of DECK_RUNS) for (const x of TRUSSES) stiffening(steel, web, x, run)
  for (const run of SOFFIT_RUNS) {
    band(soffit, -OUT, OUT, stations(run[0], run[1], 20), (y) => LOWER(y) - 1.0, (y) => LOWER(y) - 1.0, { bottom: true })
    for (const y of stations(run[0], run[1], 2 * BAY).slice(1, -1)) {
      const z = LOWER(y) - 1.0
      band(soffit, -OUT, OUT, [y - 0.3, y + 0.3], () => z, () => z - 0.5, { bottom: true, ends: true })
    }
  }
  // The subway's track beds under each upper roadway, through the towers' outer bays too.
  for (const [a, b] of TRACK_RUNS) for (const sx of [-1, 1])
    band(deck, sx * (IN + 0.3), sx * (OUT - 0.3), stations(a, b, 20), walkAt, walkAt, { top: true })
  paths(deck, brace)
  for (const x of TRUSSES) tube(steel, cablePath(x, 8), CABLE_R, 6)

  // Suspenders, from each cable down to its truss's top chord.
  for (const [a, b] of SPANS) for (const y of stations(a, b, BAY)) {
    if (Math.abs(Math.abs(y) - TY) < FACE + 3 || Math.abs(Math.abs(y) - AF) < 3) continue
    for (const x of TRUSSES) {
      const z0 = trussTop(x)(y) - 0.2, z1 = cable(y) - CABLE_R * 0.5
      if (z1 - z0 > 0.8) rod(wires, [x, y, z0], [x, y, z1], 0.14)
    }
  }
  for (const p of necklace()) bead(lamps, p.at, 0.7)
  for (const s of [-1, 1]) anchorage(s, granite, soffit, 4)
  colonnade(granite, true)
  approachPiers(granite, soffit, true)
  return { steel, brace, web, granite, soffit, deck, lamps, wires }
}

/** A cable from inside one anchorage to inside the other, over both saddles. */
function cablePath(x: number, step: number): V3[] {
  const anchor = (s: number): V3 => [x, s * (AF + 10), upper(x)(s * (AF + 10)) - 1.5]
  return [anchor(-1), ...stations(-AF, AF, step).map((y) => [x, y, cable(y)] as V3), anchor(1)]
}

/** Lights strung along the two outer cables, about 12 m apart, each on top of its cable; `k` counts along each span. */
function necklace() {
  const out: { at: V3; k: number }[] = []
  for (const x of [-OUT, OUT]) for (const [a, b] of SPANS) {
    const path = stations(a + 2, b - 2, 4).map((y) => [x, y, cable(y) + CABLE_R] as V3)
    along(path, Math.round((b - a) / 12)).forEach((at, k) => out.push({ at, k }))
  }
  return out
}

if (import.meta.main) {
  const STEEL: Swatch = finish('bridge-blue-grey', 0x8ea3b0)
  const BRACE: Swatch = finish('bridge-blue-grey-shade', 0x768c9b)
  const WEB: Swatch = finish('bridge-truss-white', 0xe2e0d8)
  const GRANITE: Swatch = finish('granite', 0xd6c8b2)
  const SOFFIT: Swatch = finish('soffit', 0x5f6b72)
  const DECK_SURFACE: Swatch = finish('deck', 0x7f8489)
  const LAMP = { name: 'lamp', color: 0x8ea3b0 }

  const low = lowModel(), detail = detailModel()
  const lists = {
    'nyc-manhattan-bridge.glb': [
      { part: low.steel, material: STEEL }, { part: low.brace, material: BRACE }, { part: low.granite, material: GRANITE },
      { part: low.soffit, material: SOFFIT }, { part: low.deck, material: DECK_SURFACE }, { part: low.lamps, material: LAMP },
    ],
    'nyc-manhattan-bridge.detail.glb': [
      { part: detail.steel, material: STEEL }, { part: detail.brace, material: { ...BRACE, doubleSided: true } },
      { part: detail.web, material: { ...WEB, doubleSided: true } },
      { part: detail.granite, material: GRANITE }, { part: detail.soffit, material: SOFFIT },
      { part: detail.deck, material: DECK_SURFACE }, { part: detail.lamps, material: LAMP },
      // Last: a map draws wires by their coverage, blended over what is already drawn.
      { part: detail.wires, material: { name: 'wire-steel', color: 0x8ea3b0 } },
    ],
  }
  const limits: Record<string, [number, number]> = {
    'nyc-manhattan-bridge.glb': [6500, 250 * 1024],
    'nyc-manhattan-bridge.detail.glb': [40000, 1536 * 1024],
  }
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    height: FIN, bearing: 337.02, elevation: 0, towers: [-TY, TY], anchorageFaces: [-AF, AF],
    roadwayMidspan: { upperWest: UPPER_WEST(0), upperEast: UPPER_EAST(0), lower: LOWER(0) },
    roadwayAtTowers: { upper: UPPER_WEST(TY), lower: LOWER(TY) },
  }
  for (const [file, list] of Object.entries(lists)) {
    const [maxTris, maxBytes] = limits[file]
    const tris = countParts(list)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Manhattan Bridge', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
