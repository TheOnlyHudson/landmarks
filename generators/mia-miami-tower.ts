/**
 * Miami Tower (CenTrust Tower 1987, later Bank of America Tower), Miami —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-miami-tower.ts
 *
 * I.M. Pei & Partners with Spillis Candela, 1987. A tower whose west and north
 * faces are flat (with a broad chamfer at the north-west corner) and whose
 * south-east side is a quarter cylinder that steps in three times as it
 * rises, standing on the north-west corner of an 11-level parking garage
 * with a roof garden. White aluminium spandrels and blue reflective ribbon
 * glass in alternating bands; at night the whole tower is washed in coloured
 * light (blue, cyan, pink, red, green and gold, changing with the occasion).
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 358:
 * the block's faces run 2° anticlockwise of the compass (OSM edges: west face
 * 3.6°, north face 2.1°, garage edges 1.5-1.8°). Origin = centroid of the OSM
 * tower outline way/300232867.
 *
 * Evidence
 * - OSM way/300232867 (Miami Tower, 47 levels, height 191, wikidata Q806676),
 *   its parts way/1105085932 (74), 1105085931 (115), 1105085930 (173),
 *   1105085928 (180) and 1105085929 (the helipad, 185); garage ways
 *   way/300232868 (11 levels, the wedge between the tower's curve and a
 *   diagonal line) and way/300232869 (10 levels, layer 1, the southern part).
 *   Plan read in this frame: west face x = -22.9, north face y = 24.3, chamfer
 *   (-22.9, 2.9) to (-1.1, 24.3). The four curved faces are concentric:
 *   circles fitted to the part outlines give centres within a metre of
 *   (-18.5, 21.5) and radii 48.4, 43.7, 39.8, 34.7 m.
 * - USGS 3DEP lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown 2019),
 *   1 m grid, read along rays from the curve centre and across the faces.
 *   Street ~1 m above the grid's ground_min; heights below are above the
 *   street: garage north wedge 42, garage south part 36 with roof-garden
 *   trees reaching 43-48; curved tiers 72.5, 114, 171.5; main roof 179;
 *   helipad deck 184-185 (single returns to 189 are railings or birds).
 *   Tier radii measured 50, 45.5, 40.5, 36.5 about the lidar's own centre;
 *   the lidar footprint sits ~2 m east and ~0.7 m north of OSM's. The model
 *   follows the OSM plan (radii 49.5, 44.5, 40, 35.5) and the lidar heights.
 *   The garage's 42/36 split runs along a straight diagonal (lidar), the
 *   south edge of way/300232868.
 * - Published (Wikipedia "Miami Tower"; Emporis/CTBUH figures quoted there):
 *   47 floors, 191 m (625 ft) to the top, completed 1987, architect I.M. Pei
 *   & Partners; the office floors start above a 10-storey garage; the
 *   building is lit in changing colours at night.
 * - Mapterhorn terrain under the block: flat to within 0.6 m.
 * - Photos (daylight unless noted):
 *   · "Bank of America Miami 20100206.jpg", Averette, CC BY 3.0 (from the
 *     south-west: west face, the staircase where each curve meets it, the
 *     garage with its roof garden),
 *     https://commons.wikimedia.org/wiki/File:Bank_of_America_Miami_20100206.jpg
 *   · "Bank of America Tower (Miami) full view.jpg", Averette, CC BY 3.0
 *     (south-west, closer), https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_(Miami)_full_view.jpg
 *   · "Bankofamericatowermiami.jpg", Averette, CC BY 3.0 (from the
 *     south-east: the three curved setbacks face on, roof garden in front),
 *     https://commons.wikimedia.org/wiki/File:Bankofamericatowermiami.jpg
 *   · "Bank of America Tower (Miami).jpg", Daniel Lombraña González, CC BY-SA
 *     2.0 (looking up a flat face: band proportions, white spandrel slightly
 *     narrower than the glass), https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_(Miami).jpg
 *   · "Miami Tower Former CenTrust Tower 1983-1987", Phillip Pessar, CC BY 2.0
 *     (from the west: flat west face, the steps on its south edge),
 *     https://www.flickr.com/photos/25955895@N03/38626689322
 *   · "Miami Tower Downtown Miami", Phillip Pessar, CC BY 2.0 (south-west,
 *     garage colour, glass sky-lobby box on the garage roof),
 *     https://www.flickr.com/photos/25955895@N03/23002112009
 *   · Night: "Miami Tower at night from the southwest, lit up in blue.jpg",
 *     Daniel Christensen, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Miami_Tower_at_night_from_the_southwest,_lit_up_in_blue.jpg ;
 *     "Miami Tower in Downtown Miami", leoncillo sabino, CC BY 2.0 (cyan),
 *     https://www.flickr.com/photos/28426323@N08/9624102335
 *
 * Measured: tier heights, garage heights, helipad height (lidar); plan (OSM).
 * Published: total height and floor count.
 * Estimated: the band rhythm (two floors a band, 4.2 m glass and 3 m white,
 * from the Lombraña photo's 55:45 glass-to-spandrel ratio); the garage's
 * opening bands (two levels a band); the lobby band height; the roof-garden
 * tree clumps (positions from the lidar's 43-48 m returns, shapes invented);
 * the 14 facets per curve (photos show a faceted curve, count not counted).
 *
 * Night: the tower's glass bands are `neon-miami-tower` in the glass's own
 * blue, so the tower glows in its common cyan-blue wash. The garage
 * openings and the lobby glass are a plain dark finish (`garage-openings`):
 * the night photos show the garage dark beside the lit tower.
 *
 * Doubts: the east and north faces are seen only obliquely in the photos; the
 * garage's north and east walls are drawn like its south wall. The tower's
 * ground floor on the west and north (lobby, Metromover link) is drawn as a
 * plain glass band. The lidar and OSM disagree by ~2 m in position; OSM was
 * followed so the model sits on the map's own outlines.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 358
const ANCHOR = { lng: -80.1915687, lat: 25.7722899 }

type XY = [number, number]

const alu = new Part(), glassBands = new Part(), concrete = new Part(), win = new Part(), roof = new Part(), garden = new Part()

// ─── plan ───
const WX = -22.9 // west face
const NY = 24.3 // north face
const CH0: XY = [-22.9, 2.9], CH1: XY = [-1.1, 24.3] // north-west chamfer
const C: XY = [-18.5, 21.5] // centre of the curved faces
const ARC_SEGS = 14

// Tiers, outermost first: radius of the curved face and the top of the tier.
const TIERS = [
  { r: 49.5, top: 72.5 },
  { r: 44.5, top: 114 },
  { r: 40, top: 171.5 },
  { r: 35.5, top: 179 },
]
const GARAGE_N = 42, GARAGE_S = 36
const HELI = { c: [-0.7, 4.5] as XY, r: 7.6, top: 184.5 }

/**
 * The tower plan for a curved face of radius r, shrunk inward by `inset`,
 * counter-clockwise from above, starting where the curve leaves the west face.
 * Each vertex carries the index of the wall it starts.
 */
function towerPlan(r: number, inset = 0): XY[] {
  const wx = WX + inset, ny = NY - inset, R = r - inset
  const aW = -Math.acos((wx - C[0]) / R) // where the circle meets the west face (below the centre)
  const aN = Math.asin((ny - C[1]) / R) // where it meets the north face
  const pts: XY[] = []
  for (let i = 0; i <= ARC_SEGS; i++) {
    const a = aW + ((aN - aW) * i) / ARC_SEGS
    pts.push([C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)])
  }
  // The chamfer, moved inward by inset along its normal, cut by the faces.
  const d = [CH1[0] - CH0[0], CH1[1] - CH0[1]], l = Math.hypot(d[0], d[1])
  const nIn = [d[1] / l, -d[0] / l] // pointing into the building (south-east)
  const p0 = [CH0[0] + nIn[0] * inset, CH0[1] + nIn[1] * inset]
  // the line p0 + t d meets y = ny and x = wx
  const tN = (ny - p0[1]) / d[1], tW = (wx - p0[0]) / d[0]
  pts.push([p0[0] + tN * d[0], ny])
  pts.push([wx, p0[1] + tW * d[1]])
  return pts
}

const at = (p: XY[], z: number): V3[] => p.map(([x, y]) => [x, y, z] as V3)

/** Ear-clipping triangulation of a simple polygon, counter-clockwise from above. */
function capPoly(part: Part, poly: XY[], z: number, up = true) {
  const idx = poly.map((_, i) => i)
  const area = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => area(a, b, p) > 1e-9 && area(b, c, p) > 1e-9 && area(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (area(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      tri(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) tri(poly[idx[0]], poly[idx[1]], poly[idx[2]])
  function tri(a: XY, b: XY, c: XY) {
    if (up) part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else part.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}

/** A prism over a convex or concave plan with a bevelled top lip; walls listed in `skip` are left out. */
function prism(wall: Part, top: Part, plan: (inset: number) => XY[], z0: number, z1: number, bev = 0.45, skip: (i: number) => boolean = () => false) {
  const r0 = at(plan(0), z0), r1 = at(plan(0), z1 - bev), r2 = at(plan(bev), z1)
  const n = r0.length
  for (let i = 0; i < n; i++) {
    if (skip(i)) continue
    const j = (i + 1) % n
    wall.quad(r0[i], r0[j], r1[j], r1[i])
    wall.quad(r1[i], r1[j], r2[j], r2[i])
  }
  capPoly(top, plan(bev), z1)
}

/**
 * Bands of panel on every wall of a ring (a flat facet each), between z0 and
 * z1, set `out` metres proud, stopping `margin` short of each wall's ends
 * where `margin` is given.
 */
function bandsOnRing(part: Part, ring: XY[], spans: [number, number][], out = 0.06, endTrim: (i: number) => [number, number] = () => [0, 0], skip: (i: number) => boolean = () => false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    if (skip(i)) continue
    const a = ring[i], b = ring[(i + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    if (l < 0.5) continue
    const ux = dx / l, uy = dy / l, nx = uy, ny = -ux // outward for a counter-clockwise ring
    const [t0, t1] = endTrim(i)
    if (l - t0 - t1 < 1) continue
    const pa: XY = [a[0] + ux * t0 + nx * out, a[1] + uy * t0 + ny * out]
    const pb: XY = [b[0] - ux * t1 + nx * out, b[1] - uy * t1 + ny * out]
    for (const [z0, z1] of spans) part.quad([pa[0], pa[1], z0], [pb[0], pb[1], z0], [pb[0], pb[1], z1], [pa[0], pa[1], z1])
  }
}

// ─── tower ───
// Office bands: two floors to a band, 3.7 m of glass and 3.5 m of white.
const PERIOD = 7.2, GLASS = 3.7
function towerBands(z0: number, z1: number): [number, number][] {
  const out: [number, number][] = []
  for (let z = 7.5; z < z1; z += PERIOD) {
    const a = Math.max(z, z0 + 0.15), b = Math.min(z + GLASS, z1 - 0.7)
    if (b - a > 1.5) out.push([a, b])
  }
  return out
}

{
  let z0 = 0
  TIERS.forEach((t, k) => {
    prism(alu, roof, (inset) => towerPlan(t.r, inset), z0, t.top)
    const ring = towerPlan(t.r)
    const n = ring.length // ARC_SEGS + 3 points: arc facets 0..13, north face 14, chamfer 15, west face 16
    // Below the garage roof the curved faces are inside the garage.
    const lowSpans = towerBands(z0, t.top)
    const isArc = (i: number) => i < ARC_SEGS
    const spans = (i: number) => (isArc(i) ? lowSpans.filter(([a]) => a > GARAGE_N + 0.5) : lowSpans)
    for (let i = 0; i < n; i++) {
      bandsOnRing(glassBands, ring, spans(i), 0.06, () => [0, 0], (j) => j !== i)
    }
    // The lobby: a glass band at the foot of the west, chamfer and north faces.
    if (k === 0) bandsOnRing(win, ring, [[0.4, 5.6]], 0.06, () => [0.8, 0.8], (i) => isArc(i))
    z0 = t.top
  })
}

// The helipad on its plinth.
{
  const ring = (r: number): XY[] => Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    return [HELI.c[0] + r * Math.cos(a), HELI.c[1] + r * Math.sin(a)] as XY
  })
  prism(alu, roof, (inset) => ring(HELI.r - inset), TIERS[3].top - 0.2, HELI.top, 0.35)
}

// ─── garage ───
// North wedge (way/300232868): from the tower's outer curve to a diagonal.
const DIAG0: XY = [-22.0, -36.5], DIAG1: XY = [53.9, -1.0]
const GX0 = -22.0, GX1 = 54.0, GY0 = -51.0
{
  const r4 = towerPlan(TIERS[0].r) // arc points 0..ARC_SEGS run from the west face round to the north face
  const arc = r4.slice(0, ARC_SEGS + 1)
  // Counter-clockwise: diagonal west end, diagonal east end, north-east corner, then back round the curve.
  const wedge = (inset: number): XY[] => {
    const e = inset
    const pts: XY[] = [
      [DIAG0[0] + e, DIAG0[1] + e * 1.1],
      [DIAG1[0] - e, DIAG1[1] + e],
      [GX1 - e, NY - e],
    ]
    // the curve, from the north face back to the west face, pushed in by 0.4 m so its walls hide in the tower
    for (let i = arc.length - 1; i >= 0; i--) {
      const [x, y] = arc[i], dx = x - C[0], dy = y - C[1], l = Math.hypot(dx, dy)
      pts.push([x - (dx / l) * 0.4, y - (dy / l) * 0.4])
    }
    pts[3] = [pts[3][0], NY - e]
    pts[pts.length - 1] = [GX0 + e, pts[pts.length - 1][1]]
    return pts
  }
  // walls: 0 diagonal (only above the south part), 1 east, 2 north, 3.. the curve (hidden), last the west.
  const P = wedge(0), n = P.length
  const skipCurve = (i: number) => i >= 3 && i < n - 1
  // the diagonal face only shows above the south part's roof
  const lowWalls = (i: number) => i === 0 || skipCurve(i)
  prism(concrete, roof, wedge, 0, GARAGE_N, 0.45, (i) => skipCurve(i) || i === 0)
  {
    const a = P[0], b = P[1]
    concrete.quad([a[0], a[1], GARAGE_S], [b[0], b[1], GARAGE_S], [b[0], b[1], GARAGE_N - 0.45], [a[0], a[1], GARAGE_N - 0.45])
    const t = wedge(0.45)
    concrete.quad([a[0], a[1], GARAGE_N - 0.45], [b[0], b[1], GARAGE_N - 0.45], [t[1][0], t[1][1], GARAGE_N], [t[0][0], t[0][1], GARAGE_N])
  }
  // Openings: two levels to a band on the street walls; the glass sky lobby along the diagonal.
  const gSpans: [number, number][] = [[3.6, 6.8], [10.4, 13.6], [17.2, 20.4], [24, 27.2], [30.8, 34]]
  bandsOnRing(win, P, [...gSpans, [37.4, 40.6]], 0.06, () => [0.9, 0.9], lowWalls)
  bandsOnRing(win, P, [[37.0, 40.8]], 0.06, () => [3, 0.9], (i) => i !== 0)
}
// South part (way/300232869), with the roof garden.
{
  const south = (e: number): XY[] => [[GX0 + e, GY0 + e], [GX1 - e, GY0 + e], [DIAG1[0] - e, DIAG1[1] - e * 1.1], [DIAG0[0] + e, DIAG0[1] - e * 0.9]]
  prism(concrete, roof, south, 0, GARAGE_S, 0.45, (i) => i === 2)
  const gSpans: [number, number][] = [[3.6, 6.8], [10.4, 13.6], [17.2, 20.4], [24, 27.2], [30.8, 34]]
  bandsOnRing(win, south(0), gSpans, 0.06, () => [0.9, 0.9], (i) => i === 2)
  // Tree clumps: soft octagonal domes where the lidar sees 43-48 m returns.
  const clumps: [number, number, number, number][] = [
    [-14, -44, 5.5, 9], [-3, -46, 5, 10], [8, -44.5, 5.5, 9.5], [19, -46, 5, 8.5],
    [-15, -40.5, 4, 7], [1, -40, 4.5, 8], [13, -39, 4, 7], [28, -44, 4.5, 7.5], [36, -46.5, 4, 6],
  ]
  for (const [cx, cy, r, h] of clumps) {
    const ringAt = (rr: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.3
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z] as V3
    })
    const z = GARAGE_S
    const rings = [ringAt(r * 0.55, z), ringAt(r, z + h * 0.45), ringAt(r * 0.8, z + h * 0.8)]
    garden.loft(rings)
    const top: V3 = [cx, cy, z + h]
    const last = rings[2]
    for (let i = 0; i < 8; i++) garden.tri(last[i], last[(i + 1) % 8], top)
  }
}

const parts = [
  { part: alu, material: finish('miami-tower-aluminium', 0xeceef0) },
  { part: glassBands, material: finish('neon-miami-tower', 0x76a0cc, 0.35) },
  { part: concrete, material: finish('garage-concrete', 0xc9c6bf) },
  { part: win, material: finish('garage-openings', 0x6c7782, 0.4) },
  { part: roof, material: PALETTE.roof },
  { part: garden, material: finish('roof-garden', 0x7f9a6c) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Miami Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: HELI.top,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/300232867', 'way/300232868', 'way/300232869', 'way/1105085928', 'way/1105085929', 'way/1105085930', 'way/1105085931', 'way/1105085932'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/mia-miami-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
