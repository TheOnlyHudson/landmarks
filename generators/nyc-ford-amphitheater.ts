/**
 * Ford Amphitheatre at Coney Island Boardwalk (2016) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-ford-amphitheater.ts
 *
 * Map frame: x = east, y = north, z up, metres, at bearing 0. Anchor: area
 * centroid of OSM way/518329921 (-73.9882507, 40.5727204). The outline is
 * drawn as OSM has it, the NYS 2024 orthophoto (orthos.its.ny.gov, public)
 * agreeing within about a metre.
 *
 * Only the amphitheatre's canopy: the white tensile membrane over the
 * seating bowl, the four tubular steel arch trusses it hangs from, and the
 * masts round its edge. The restored Childs Restaurant building east of it
 * (and the Ford sign on its roof) is nyc-childs-coney-island; that model
 * draws only the Childs building (its header leaves the amphitheatre to
 * the map), so the two don't overlap. The seats, stage floor and paving are
 * ground and left to the map.
 *
 * Evidence
 * - OSM: way/518329921 (building=civic, roof:shape=dome, levels 1; no
 *   height), 78 × 60 m.
 * - NYS orthophoto 2024: the white membrane over the whole outline, with
 *   four arch lines fanning from feet along the Boardwalk side
 *   (x ≈ 0 … 24, y ≈ -24) to feet along the north edge (x ≈ -18 … 21,
 *   y ≈ 23 … 26); masts with shadows round the south and west edges.
 * - Photos (Wikimedia Commons):
 *   - "Coney Is Beach td (2018-09-03) 34 - Ford Amphitheater.jpg" and
 *     "… 25 …", Tdorante10, CC BY-SA 4.0 (from the pier, south-east: the
 *     membrane's rounded ridges just under the Childs pavilions' crests,
 *     its eaves at about the height of the Childs arches, white truss legs
 *     at the feet, a lower lobe running west)
 *   - "CI Amphitheater W23 2016 March jeh.JPG" and "CI Amphitheater 2016
 *     March jeh.JPG", Jim.henderson, CC0 (the arch trusses during
 *     construction, before the membrane: low wide arches of square
 *     tubular truss)
 *   - "Ford Amphitheater at Coney Island July 2016.jpg", Jessie Essex,
 *     CC BY 2.0 (inside: the membrane between the trusses, its edge
 *     valance)
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) shows the bowl empty (the
 *   membrane is off out of season), so no heights come from it.
 * - Terrain (Mapterhorn): the bowl about 0.5 m over y = 0, the Boardwalk
 *   to the south about 1.9 m.
 *
 * Estimated, from the photos against the Childs building (12.9 m, OSM;
 * crest 14.4 m over the Boardwalk): the ridges at 14.5 m over y = 0, the
 * arch trusses 1.0 m deep, the eaves at 6.5 m with a 1.2 m valance, the
 * membrane sagging about 0.4 m per metre away from a ridge. The arch feet
 * are read from the ortho to a few metres. The scalloped eaves between the
 * masts are drawn straight.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel } from './nyc-570-lexington'

type XY = [number, number]
const membrane = new Part(), truss = new Part()

// OSM way/518329921 about its centroid, counter-clockwise.
const OUTLINE: XY[] = [
  [20.1, 32.6], [15.2, 30.6], [10.3, 33.1], [2.9, 29.1], [-4.4, 28.5], [-12.2, 26.1], [-17.0, 17.9], [-23.2, 14.2], [-31.4, 7.2],
  [-40.4, -2.2], [-41.8, -7.0], [-41.4, -12.8], [-39.1, -17.0], [-35.4, -21.2], [-13.4, -25.3], [-1.8, -25.4], [5.0, -27.5],
  [9.3, -25.7], [14.3, -25.3], [20.2, -22.0], [27.2, -20.7], [31.1, -15.8], [36.5, -12.7], [35.9, -7.1], [35.3, -1.3],
  [34.2, 4.4], [32.8, 10.5], [30.1, 16.4], [27.5, 22.4],
]

// The arch trusses: south foot → north foot (ortho), apex height.
const APEX = 14.5, EAVE = 6.5, VALANCE = 1.2, SAG = 0.4, DEPTH = 1.0
const ARCHES: [XY, XY][] = [
  [[0.3, -24.4], [-17.7, 25.6]],
  [[8.3, -24.4], [-3.7, 24.6]],
  [[16.3, -23.4], [10.3, 23.6]],
  [[24.3, -22.4], [21.3, 22.6]],
]
const archZ = (t: number) => APEX * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.75)

/** Height of the membrane's ridge field at a point (before the eave cap). */
function ridge(p: XY) {
  let h = 0
  for (const [a, b] of ARCHES) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy
    const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2
    const tc = Math.min(1, Math.max(0, t))
    const d = Math.hypot(p[0] - (a[0] + dx * tc), p[1] - (a[1] + dy * tc))
    h = Math.max(h, archZ(t) - DEPTH / 2 - SAG * d)
  }
  return h
}

// ---------------------------------------------------------------------------
// The membrane: rings from the edge in to the middle, as a fan about the
// centroid (the outline is star-shaped from it).
// ---------------------------------------------------------------------------
const N = 96, RINGS = 10
const edge: XY[] = []
{
  const segs = OUTLINE.map((a, i) => [a, OUTLINE[(i + 1) % OUTLINE.length]] as [XY, XY])
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]))
  const total = lens.reduce((s, l) => s + l, 0)
  // One sample per outline corner, the rest spread by length.
  for (let i = 0; i < segs.length; i++) {
    const n = Math.max(1, Math.round((lens[i] / total) * N))
    for (let k = 0; k < n; k++) {
      const t = k / n, [a, b] = segs[i]
      edge.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
}
const M = edge.length
const height = (p: XY, dEdge: number) => Math.min(Math.max(ridge(p), EAVE), EAVE + 1.0 * dEdge)
const grid: V3[][] = []
for (let r = 0; r <= RINGS; r++) {
  const f = 1 - r / RINGS // 1 at the edge, 0 at the middle
  const ring: V3[] = []
  for (const e of edge) {
    const p: XY = [e[0] * f, e[1] * f]
    const R = Math.hypot(e[0], e[1])
    ring.push([p[0], p[1], height(p, R * (1 - f))])
  }
  grid.push(ring)
}
// Upper surface, counter-clockwise from above (the outline runs counter-clockwise).
for (let r = 0; r < RINGS; r++) {
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const a = grid[r][i], b = grid[r][j], c = grid[r + 1][j], d = grid[r + 1][i]
    if (r === RINGS - 1) membrane.tri(a, b, c)
    else membrane.quad(a, b, c, d)
  }
}
// The valance round the edge, facing out.
for (let i = 0; i < M; i++) {
  const j = (i + 1) % M
  const a = grid[0][i], b = grid[0][j]
  membrane.quad([a[0], a[1], a[2] - VALANCE], [b[0], b[1], b[2] - VALANCE], b, a)
}

// ---------------------------------------------------------------------------
// The arch trusses: square tubes 1 m deep, riding the ridges and coming
// down to the ground at their feet.
// ---------------------------------------------------------------------------
for (const [a, b] of ARCHES) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const ux = dx / L, uy = dy / L, nx = -uy * 0.5, ny = ux * 0.5
  const S = 18, sections: V3[][] = []
  for (let k = 0; k <= S; k++) {
    const t = k / S, x = a[0] + dx * t, y = a[1] + dy * t, z = Math.max(DEPTH / 2, archZ(t))
    const lo = k === 0 || k === S ? 0 : z - DEPTH / 2, hi = z + DEPTH / 2
    sections.push([[x + nx, y + ny, lo], [x - nx, y - ny, lo], [x - nx, y - ny, hi], [x + nx, y + ny, hi]])
  }
  truss.sweep(sections)
}

// ---------------------------------------------------------------------------
// Masts round the edge, holding the eave.
// ---------------------------------------------------------------------------
function mast(x: number, y: number, top: number) {
  const h = 0.2
  const c: V3[] = [[x - h, y - h, 0], [x + h, y - h, 0], [x + h, y + h, 0], [x - h, y + h, 0]]
  const t: V3[] = c.map(([px, py]) => [px, py, top])
  for (let i = 0; i < 4; i++) truss.quad(c[i], c[(i + 1) % 4], t[(i + 1) % 4], t[i])
  truss.quad(t[0], t[1], t[2], t[3])
}
for (let i = 0; i < M; i += 6) {
  const [x, y, z] = grid[0][i], R = Math.hypot(x, y), k = (R - 0.5) / R
  mast(x * k, y * k, z + 0.8)
}

finishModel('Ford Amphitheatre at Coney Island Boardwalk', 'nyc-ford-amphitheater', [
  { part: membrane, material: { ...finish('amph-membrane', 0xf2f0ea), doubleSided: true } },
  { part: truss, material: finish('amph-truss', 0xdadddc) },
], { bearing: 0, osm: 'way/518329921', height: APEX + DEPTH / 2 })
