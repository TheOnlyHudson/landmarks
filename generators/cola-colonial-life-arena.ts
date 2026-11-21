/**
 * Colonial Life Arena (2002, formerly the Carolina Center), University of
 * South Carolina, Columbia SC. 18,000-seat arena. Procedural, CC0-1.0.
 *   bun generators/cola-colonial-life-arena.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 24 (the
 * octagon's flats). +x points to 114 degrees, where the glass entrance
 * rotunda faces Lincoln Street. Anchor: area centroid of way/110351219.
 *
 * Form: a stepped octagon. A brick-and-tan perimeter ring (the OSM
 * outline) at 16.5 m, a tan upper ring at 20.7 m, and the bowl's own
 * octagon rising to a gently curved white roof (28.7 m at the eaves,
 * 32.6 m at the crown). On the east face, the glazed entrance rotunda under
 * a white steel canopy, flanked by two tall brick pylons with tan caps.
 *
 * Sources
 * - OSM way/110351219 (building=stadium, 3 levels, the outline used as the
 *   perimeter ring).
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019), 1 m grid, read in the
 *   model frame. y = 0 is ground_min + 1 m (the west service side). The
 *   site rises ~8 m to the east entrance plaza. Measured above y = 0:
 *   perimeter ring 16.5; upper ring 20.7 (octagon x -68..68, y +-60);
 *   centre roof 28.7 at its edge (octagon x -56..46, y +-44) to 32.6 at the
 *   crown; rotunda top 26.2; pylons 29.5 (x 66..76, y +-17..27).
 * - NAIP orthophoto (USGS): the octagon steps and white roofs.
 * - Photos (EVIDENCE):
 *   Dfscgt21, "University of South Carolina Colonial Life Arena" (east
 *     entrance), CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:University_of_South_Carolina_Colonial_Life_Arena.jpg
 *   Akhenaton06, "ColonialLifeArena.jpg" (east entrance, square on),
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:ColonialLifeArena.jpg
 *   PCN02WPS, "Colonial Life Arena, Feb 2026" (interior, roof trusses:
 *     confirms the shallow curved roof), CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Colonial_Life_Arena,_Feb_2026.jpg
 *
 * Estimated: the wall bands (brick base to 9.5, a glass ribbon 9.5-12,
 * tan above) from the entrance photos, applied all round; the rotunda's
 * radius (25.6 m round a centre at x 62, just enclosing the OSM bulge); canopy depth
 * 4 m and height 17 m (photo, against the ~8 m plaza). Doubts: no licensed
 * photo shows the west, north or south sides; their bands are assumed to
 * match the wings seen beside the entrance.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, type XY } from './dc-nationals-park'

const brick = new Part(), tan = new Part(), glass = new Part(), steel = new Part(), roof = new Part()

const RING: XY[] = [[-39.72, 63.37], [-27.16, 63.28], [21.50, 63.22], [23.22, 61.44], [28.43, 64.28], [33.80, 63.68], [38.21, 59.98], [39.74, 55.06], [41.40, 55.18], [70.69, 24.71], [71.70, 23.69], [72.68, 24.57], [76.11, 20.75], [77.30, 21.78], [82.50, 14.77], [85.45, 7.48], [86.27, -0.49], [85.11, -8.34], [82.02, -15.78], [76.75, -22.50], [75.96, -21.71], [71.96, -25.75], [71.06, -24.94], [69.78, -26.20], [40.29, -55.19], [38.69, -55.04], [36.76, -60.83], [32.50, -64.25], [26.94, -64.74], [21.71, -61.92], [19.91, -63.51], [3.99, -63.40], [-40.40, -63.12], [-74.72, -28.45], [-74.26, 29.47], [-60.92, 42.56]]

// The perimeter ring: brick base, a glass ribbon, tan band.
prism(RING, 0, 9.5, brick, null)
prism(RING, 9.5, 12, glass, null)
prism(RING, 12, 16.5, tan, roof)

const oct = (x0: number, x1: number, y0: number, y1: number, c: number): XY[] => [
  [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c], [x0 + c, y0], [x1 - c, y0],
]
// Upper ring
const UP = oct(-68, 68, -60, 60, 34)
prism(UP, 16.5, 20.7, tan, roof)
// Bowl octagon, tan walls with a slim parapet band, curved roof
const CORE = oct(-56, 46, -44, 44, 22)
prism(CORE, 20.7, 28.2, tan, null)
prism(CORE, 28.2, 28.7, steel, null)
{
  const cx = -5, cy = 0
  const ring = (s: number, z: number): V3[] => CORE.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s, z])
  const levels: [number, number][] = [[1, 28.7], [0.72, 30.7], [0.42, 32], [0.15, 32.55]]
  for (let k = 0; k < levels.length - 1; k++) {
    const a = ring(...levels[k]), b = ring(...levels[k + 1])
    for (let i = 0; i < a.length; i++) {
      const j = (i + 1) % a.length
      quad(roof, [a[i], a[j], b[j], b[i]], [0, 0, 1])
    }
  }
  const top = ring(...levels[levels.length - 1])
  for (let i = 1; i < top.length - 1; i++) roof.tri(top[0], top[i], top[i + 1])
}

// Entrance rotunda: a glazed drum (east half) under a white canopy, a tan
// drum above with a glass strip, round a centre at x 62.
const C: XY = [62, 0]
const arc = (r: number, a0 = -58, a1 = 58, n = 10): XY[] => {
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; pts.push([C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]) }
  return pts
}
prism(arc(25.6, -60, 60, 12).concat([[C[0] - 6, 21], [C[0] - 6, -21]]), 0, 17, glass, null) // just outside the ring bulge, so the glass is the face
prism(arc(28.5, -60, 60, 12).concat([[C[0] - 4, 24], [C[0] - 4, -24]]), 17, 17.9, steel, steel)
prism(arc(22.5).concat([[C[0] - 8, 19], [C[0] - 8, -19]]), 17.9, 18.6, tan, null)
prism(arc(22.5).concat([[C[0] - 8, 19], [C[0] - 8, -19]]), 18.6, 20.4, glass, null)
prism(arc(22.5).concat([[C[0] - 8, 19], [C[0] - 8, -19]]), 20.4, 26.2, tan, roof)
// Canopy columns
for (let i = 0; i <= 5; i++) {
  const a = ((-50 + 20 * i) * Math.PI) / 180, r = 26.5
  const x = C[0] + r * Math.cos(a), y = C[1] + r * Math.sin(a)
  prism([[x - 0.45, y - 0.45], [x + 0.45, y - 0.45], [x + 0.45, y + 0.45], [x - 0.45, y + 0.45]], 0, 17, steel, null)
}
// Brick pylons with tan caps
for (const s of [-1, 1]) {
  const P: XY[] = [[66.5, s * 17.5], [75.5, s * 17.5], [75.5, s * 26.5], [66.5, s * 26.5]]
  prism(P, 0, 26.3, brick, null)
  prism(P.map(([x, y]) => [x + (x > 70 ? 0.3 : -0.3), y + (Math.abs(y) > 20 ? s * 0.3 : -s * 0.3)] as XY), 26.3, 29.5, tan, roof)
}

const parts = [
  { part: brick, material: finish('cla-brick', 0xa9634f) },
  { part: tan, material: finish('cla-tan', 0xe3d3ae) },
  { part: glass, material: PALETTE.window },
  { part: steel, material: PALETTE.trim },
  { part: roof, material: finish('cla-roof', 0xd9dcdd) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Colonial Life Arena', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 24, osm: 'way/110351219', height: 32.6,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cola-colonial-life-arena.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
