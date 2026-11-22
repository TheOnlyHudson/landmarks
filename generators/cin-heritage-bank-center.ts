/**
 * Heritage Bank Center, Cincinnati (indoor arena; opened 1975 as Riverfront
 * Coliseum, later The Crown, Firstar Center, U.S. Bank Arena) — procedural,
 * CC0-1.0, no textures.  bun generators/cin-heritage-bank-center.ts
 *
 * Map frame: x across the arena, y along its long axis (+y towards the
 * north-east), z up, metres. Placed at bearing 50°, the long straight sides
 * of the OSM outline (way/25564082, edges at 50.1° and 230.2°). Anchor
 * -84.50453, 39.09788, 7 m west of the outline's area centroid; the plan
 * below is the outline in this frame.
 *
 * z = 0 is the street on the arena's east side (Mehring Way side), the
 * lowest ground the map's terrain shows under the footprint. The lidar puts
 * that street 6 m above the box's lowest return and the plaza deck that
 * wraps the arena (the walkway level, not in OSM as a building and not in
 * the map's terrain) 12.7 m above it. The deck is the map's business, not
 * the model's; the arena's own wall runs down to the street under it.
 *
 * What makes it read as itself, from the photos: a low, plain, round-cornered
 * box; white wall panels between grey piers; a deep blue fascia band under
 * the eaves and a blue-striped glass band at the plaza level; a very low
 * hipped roof in grey, its ridge along the long axis.
 *
 * Evidence
 * - OSM: outline way/25564082 (building=stadium) in building relation
 *   relation/3687875 with parts way/277515382 (the arena, 11 levels,
 *   hipped, white concrete) and way/277515383 (a wedge at the south-west
 *   end, levels 4-5: the landing of the walkway bridge from the plaza).
 *   Wikidata Q2790698.
 * - Measured, lidar: USGS 3DEP OH_StatewideP3_6_B21 (flown about 2021), 1 m:
 *   eaves 31.7 m above the east street, the ridge 35.2 m along x = 0 from
 *   y = -30 to y = 48, the hips falling to the eaves over the last 20-25 m;
 *   the plaza deck 12.7 m.
 * - Measured, USGS NAIP orthophoto: plan, the grey roof with its hip and
 *   ridge lines, the white-and-blue wall showing at the south-east edge.
 * - Published (Wikipedia, "Heritage Bank Center"): opened 1975; capacity
 *   about 17,500.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Ianbolender, "Heritage Bank Center.jpg" (CC BY-SA 4.0; the north-west
 *   side over Fort Washington Way: white panels, grey piers, blue fascia
 *   and base band, the walkway bridge)
 *     https://commons.wikimedia.org/wiki/File:Heritage_Bank_Center.jpg
 *   "Cincinnati-us-bank-arena.jpg" (CC BY 2.0; the same side, earlier
 *   livery)
 *     https://commons.wikimedia.org/wiki/File:Cincinnati-us-bank-arena.jpg
 *   Ianbolender, "Heritage Bank Center (cropped).jpg" (CC BY-SA 4.0)
 *     https://commons.wikimedia.org/wiki/File:Heritage_Bank_Center_(cropped).jpg
 * - Estimated: the pier spacing (about 9 m, counted in the photo); the
 *   band heights (blue base band 12.7-15.4 m, fascia 28.0-31.7 m) from the
 *   photo scaled to the lidar eaves.
 * - Not drawn: the signs and banners, the plaza deck and its bridges.
 * - Doubts: the faces below the plaza deck (concrete, mostly hidden by the
 *   deck and ramps) are drawn plain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, quad, type XY } from './dc-nationals-park'

const CX = 0.3, CY = 9.7, HX = 47.8, HY = 64.7, RAD = 27
const Z_PLAZA = 12.7, Z_BAND = 15.4, Z_FASCIA = 28.0, Z_EAVE = 31.7, Z_RIDGE = 35.2
const RIDGE = 39 // half length of the ridge

/** The rounded rectangle, counter-clockwise from the east side's middle. */
const plan: XY[] = []
{
  const corners: [number, number, number][] = [[1, 1, 0], [-1, 1, 90], [-1, -1, 180], [1, -1, 270]]
  for (const [sx, sy, a0] of corners) {
    const cx = CX + sx * (HX - RAD), cy = CY + sy * (HY - RAD)
    for (let k = 0; k <= 6; k++) {
      const a = ((a0 + (90 * k) / 6) * Math.PI) / 180
      plan.push([cx + RAD * Math.cos(a), cy + RAD * Math.sin(a)])
    }
  }
}

const panel = new Part(), pier = new Part(), blue = new Part(), stone = new Part(), roof = new Part(), glass = new Part()

// Walls: concrete below the plaza, the glass band, white panels, fascia.
prism(plan, 0, Z_PLAZA, stone, null)
prism(plan, Z_PLAZA, Z_BAND, glass, null)
prism(plan, Z_BAND, Z_FASCIA, panel, null)
prism(plan, Z_FASCIA, Z_EAVE, blue, null)
// A blue stripe across the glass band.
{
  const out = plan.map(([x, y]): XY => {
    return [x, y]
  })
  const grow = (p: XY, k: number): XY => {
    // push out along the plan's normal, approximated from the corner centre
    const cx = CX + Math.sign(p[0] - CX) * Math.max(0, Math.min(Math.abs(p[0] - CX), HX - RAD))
    const cy = CY + Math.sign(p[1] - CY) * Math.max(0, Math.min(Math.abs(p[1] - CY), HY - RAD))
    const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1
    return [p[0] + (dx / l) * k, p[1] + (dy / l) * k]
  }
  prism(out.map((p) => grow(p, 0.05)), Z_PLAZA + 1.1, Z_PLAZA + 1.7, blue, null)
  // Grey piers between the panels, about every 9 m round the wall.
  let acc = 0
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: V3 = [e[1], -e[0], 0]
    for (let u = (9 - acc) % 9; u < L; u += 9) {
      const p: XY = [a[0] + e[0] * u, a[1] + e[1] * u]
      box(pier, [p[0] + n[0] * 0.3, p[1] + n[1] * 0.3, (Z_BAND + Z_FASCIA) / 2], [[e[0], e[1], 0], n, [0, 0, 1]], [0.65, 0.35, (Z_FASCIA - Z_BAND) / 2])
    }
    acc = (acc + L) % 9
  }
}

// Low hipped roof: each eave point rises to the nearest point of the ridge.
{
  const top = (p: XY): V3 => [CX, Math.max(CY - RIDGE, Math.min(CY + RIDGE, p[1])), Z_RIDGE]
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const A: V3 = [a[0], a[1], Z_EAVE], B: V3 = [b[0], b[1], Z_EAVE], ta = top(a), tb = top(b)
    quad(roof, [A, B, tb, ta], [0, 0, 1])
  }
  // a thin white lip at the eaves
  prism(plan, Z_EAVE, Z_EAVE + 0.35, panel, null)
}

// The walkway landing wedge at the south-west end (way/277515383).
prism([[-13.8, -54.9], [7.1, -66.8], [13.7, -55.0], [0, -52]], Z_PLAZA - 3.2, Z_PLAZA, stone, stone)

const parts = [
  { part: panel, material: PALETTE.trim },
  { part: pier, material: finish('arena-pier', 0xb9b7b0) },
  { part: blue, material: finish('arena-blue', 0x4f6fb8) },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Heritage Bank Center', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 50, osm: 'way/25564082', height: Z_RIDGE,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cin-heritage-bank-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
