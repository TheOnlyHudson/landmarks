/**
 * Ford Field, Detroit (NFL, Detroit Lions, opened 2002) — procedural,
 * CC0-1.0, no textures.  bun generators/det-ford-field.ts
 *
 * Map frame: turned to bearing 154°, the outline's long edges (OSM
 * way/110555613 has edges at 154° and 64°). +y points SSE toward Adams
 * and the old Hudson's warehouse; +x points WSW, toward Brush Street and
 * Comerica Park. Anchor: the outline's area centroid.
 *
 * Ford Field is enclosed, so the map draws nothing inside it: the model is
 * the closed shell, built from the street (z = 0 is the lowest street,
 * on the east side; the west side is about 2.5 m higher). The sunken
 * field inside isn't drawn, so `elevation` stays 0.
 *
 * Massing, all from the USGS lidar (USGS_LPC_MI_WayneCo_2017_LAS_2018,
 * flown 2017, 1 m), heights above the lowest street:
 *   - the white barrel roof over the field box (OSM roof part
 *     way/559288135, x ±82, y -100 to 95): flat across x, curved along y,
 *     crown 52.4 m at y ≈ 20, eaves 36 m on the north and 45 m where it
 *     meets the warehouse; a 1 m edge beam along its two arched ends;
 *   - the concourse ring round it to the outline, flat at 27–28.6 m,
 *     with the round drum on the outline's curved corner (x 85–113,
 *     y 69–114, the south-west corner on Brush Street), 28.6 m;
 *   - the north annex (way/110555614), 23 m;
 *   - the Hudson's warehouse along the south (way/110555611, 1920s, seven
 *     storeys of brick, built into the stadium), 31 m, with the glass
 *     atrium blocks on its roof, 36.5 and 41 m.
 * Photos show the vault's arched ends as pale silver-grey metal panel walls
 * over the concourse, the concourse in brick and grey precast with glazed
 * bays, and the warehouse in red brick with big punched windows.
 *
 * Evidence
 * - OSM: way/110555613 (building=stadium, height=10, wrong; Q1142586),
 *   roof part way/559288135 (height 30, wrong), way/110555611 (the
 *   warehouse), way/110555614 (north annex).
 * - Measured: lidar 2017 (every height above); USGS NAIP orthophoto (plan,
 *   the two blue Ford ovals on the white roof, about 65 × 28 m each).
 * - Published: opened 2002, architects SHG / Rossetti / Kaplan McLaughlin
 *   Diaz; built into the 1920s Hudson's warehouse (Wikipedia, "Ford Field").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Ford Field Stadium - Downtown Detroit - Michigan.jpg", Tony Webster
 *     (CC BY 2.0): the long side, white roof edge, panel wall, brick wings.
 *   - "Detroit December 2025 04 (Ford Field).jpg", Michael Barera (CC BY-SA
 *     4.0): the round corner and its lettering, brick and glass, at night.
 *   - "Ford-Field-September-10-2006.jpg" (CC BY 2.5): the interior, glass
 *     end walls (look only for the shell).
 *   - "Comerica Park - 2026 (215A6096).jpg", City of Detroit (public
 *     domain): the whole shell from the west, behind Comerica Park.
 * Estimated: window bands and piers (bays of about 8 m on the concourse,
 * two storeys per panel on the warehouse); the metal wall's glass band;
 * logo outlines simplified to plain blue ellipses. Not drawn: lettering
 * ("FORD FIELD" on the roof fascia and the drum), banners, the interior.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, quad, type XY } from './dc-nationals-park'

const OUTLINE: XY[] = [[81.9, -102.1], [81.9, -97.6], [114.0, -60.8], [119.6, -60.8], [119.6, 49.4], [119.6, 69.0], [111.8, 69.3], [112.5, 72.4], [112.9, 76.4], [112.9, 80.4], [112.4, 84.4], [111.6, 88.1], [110.4, 92.1], [108.7, 96.0], [106.5, 99.3], [104.1, 102.5], [101.6, 105.1], [98.6, 108.0], [97.3, 108.9], [95.4, 110.2], [91.9, 112.1], [88.7, 113.4], [85.0, 114.5], [85.0, 106.1], [81.0, 106.1], [81.0, 95.3], [-81.7, 95.2], [-81.6, 85.8], [-123.0, 85.8], [-122.3, 67.6], [-122.3, 61.0], [-122.5, -59.7], [-113.7, -59.5], [-80.8, -98.1], [-80.7, -102.2]]
const WAREHOUSE: XY[] = [[84.9, 125.0], [105.1, 125.0], [105.0, 140.6], [105.0, 146.0], [110.4, 146.1], [110.3, 160.8], [28.5, 160.8], [28.6, 133.7], [16.6, 133.7], [16.4, 160.9], [-18.4, 160.9], [-18.3, 138.7], [-33.1, 138.7], [-33.1, 131.3], [-62.6, 131.3], [-62.8, 161.4], [-96.4, 161.4], [-96.2, 124.9], [-123.2, 124.9], [-123.0, 85.8], [-81.6, 85.8], [-81.7, 95.2], [81.0, 95.3], [81.0, 106.1], [85.0, 106.1], [85.0, 114.5], [84.9, 122.4]]
const NORTH: XY[] = [[119.6, -60.8], [120.0, -95.0], [101.8, -95.0], [101.9, -108.1], [86.1, -107.9], [80.6, -107.8], [80.7, -111.1], [74.6, -111.3], [74.8, -116.5], [62.2, -116.5], [62.0, -111.3], [42.8, -111.2], [39.4, -111.2], [9.0, -110.1], [9.0, -122.0], [-8.1, -122.1], [-8.4, -110.1], [-43.5, -111.4], [-58.7, -111.4], [-58.6, -116.9], [-75.6, -116.9], [-75.8, -111.6], [-82.5, -111.5], [-96.6, -111.5], [-122.6, -111.4], [-122.5, -59.7], [-113.7, -59.5], [-80.8, -98.1], [-80.7, -102.2], [81.9, -102.1], [81.9, -97.6], [114.0, -60.8]]

const white = new Part(), metal = new Part(), brick = new Part(), stone = new Part(), glass = new Part(), blue = new Part()

// ---------------------------------------------------------------------------
// The vault: roof heights along y, from the lidar (x = 0 line).
const PROFILE: [number, number][] = [
  [-100, 34.5], [-95, 36.1], [-85, 39.0], [-75, 41.5], [-65, 43.7], [-55, 45.7], [-45, 47.5], [-35, 48.9], [-25, 50.1],
  [-15, 51.0], [-5, 51.8], [5, 52.2], [15, 52.4], [25, 52.4], [35, 52.0], [45, 51.5], [55, 50.7], [65, 49.6], [75, 48.3],
  [85, 46.7], [95, 45.3],
]
const X0 = -81.5, X1 = 81.5
{
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [ya, za] = PROFILE[i], [yb, zb] = PROFILE[i + 1]
    // smooth normals across the vault
    const nrm = (k: number): V3 => {
      const a = PROFILE[Math.max(0, k - 1)], b = PROFILE[Math.min(PROFILE.length - 1, k + 1)]
      const dy = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dy, dz)
      return [0, -dz / l, dy / l]
    }
    const na = nrm(i), nb = nrm(i + 1)
    quad(white, [[X0, ya, za], [X1, ya, za], [X1, yb, zb], [X0, yb, zb]], [0, 0, 1], [na, na, nb, nb])
  }
  // The arched end walls at x = ±81.5: silver panels over a glazed band, under a 1 m white edge beam.
  for (const [x, s] of [[X1, 1], [X0, -1]] as [number, number][]) {
    const out: V3 = [s, 0, 0]
    for (let i = 0; i < PROFILE.length - 1; i++) {
      const [ya, za] = PROFILE[i], [yb, zb] = PROFILE[i + 1]
      quad(metal, [[x, ya, 32], [x, yb, 32], [x, yb, zb - 1], [x, ya, za - 1]], out)
      quad(white, [[x, ya, za - 1], [x, yb, zb - 1], [x, yb, zb + 0.9], [x, ya, za + 0.9]], out)
      quad(white, [[x, ya, za + 0.9], [x, yb, zb + 0.9], [x - s * 0.8, yb, zb + 0.9], [x - s * 0.8, ya, za + 0.9]], [0, 0, 1])
      quad(glass, [[x + s * 0.05, ya, 28.6], [x + s * 0.05, yb, 28.6], [x + s * 0.05, yb, 32], [x + s * 0.05, ya, 32]], out)
    }
  }
  // The north eave wall, down to the concourse.
  quad(metal, [[X0, -100, 27], [X1, -100, 27], [X1, -100, 34.5], [X0, -100, 34.5]], [0, -1, 0])
  // The south eave meets the warehouse roof; close it.
  quad(metal, [[X0, 95, 30], [X1, 95, 30], [X1, 95, 45.3], [X0, 95, 45.3]], [0, 1, 0])
}

// The two blue Ford ovals on the roof (NAIP): ellipses draped on the vault.
function zAt(y: number) {
  for (let i = 0; i < PROFILE.length - 1; i++) if (y >= PROFILE[i][0] && y <= PROFILE[i + 1][0]) {
    const f = (y - PROFILE[i][0]) / (PROFILE[i + 1][0] - PROFILE[i][0])
    return PROFILE[i][1] + (PROFILE[i + 1][1] - PROFILE[i][1]) * f
  }
  return PROFILE[PROFILE.length - 1][1]
}
for (const [cx, cy] of [[27, -70], [29, 34]]) {
  const n = 20, a = 31, b = 13, rot = (11 * Math.PI) / 180
  const P = (t: number): V3 => {
    const u = a * Math.cos(t), v = b * Math.sin(t)
    const x = cx + u * Math.cos(rot) - v * Math.sin(rot), y = cy + u * Math.sin(rot) + v * Math.cos(rot)
    return [x, y, zAt(y) + 0.15]
  }
  const c: V3 = [cx, cy, zAt(cy) + 0.15]
  for (let i = 0; i < n; i++) blue.tri(c, P((2 * Math.PI * i) / n), P((2 * Math.PI * (i + 1)) / n), undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
}

// ---------------------------------------------------------------------------
// The concourse ring to the outline, 28 m, with the round south-east corner.
prism(OUTLINE, 0, 26.6, brick, null)
prism(OUTLINE, 26.6, 28.3, stone, metal)
// The north annex and the warehouse.
prism(NORTH, 0, 21.8, brick, null)
prism(NORTH, 21.8, 23, stone, metal)
prism(WAREHOUSE, 0, 29.8, brick, null)
prism(WAREHOUSE, 29.8, 31, stone, metal)
// Glass atrium blocks on the warehouse roof.
prism([[-18, 104], [18, 104], [18, 158], [-18, 158]], 31, 36.5, glass, metal)
prism([[32, 104], [80, 104], [80, 130], [32, 130]], 31, 41, glass, metal)

// Window bays on the street faces: broad panels between brick piers.
function bays(a: XY, b: XY, z0: number, z1: number, bay: number, rows: [number, number][] = [[z0, z1]]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 6) return
  const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nrm: V3 = [e[1], -e[0], 0] // the right of the edge: outward on a counter-clockwise ring
  const n = Math.max(1, Math.round(L / bay))
  for (let i = 0; i < n; i++) {
    const u0 = (L / n) * i + 1.1, u1 = (L / n) * (i + 1) - 1.1
    for (const [r0, r1] of rows) {
      const q = (u: number, z: number): V3 => [a[0] + e[0] * u + nrm[0] * 0.06, a[1] + e[1] * u + nrm[1] * 0.06, z]
      quad(glass, [q(u0, r0), q(u1, r0), q(u1, r1), q(u0, r1)], nrm)
    }
  }
}
/** Walk a ring and put bays on every edge long enough, outward whichever way the ring turns. */
function ringBays(ring: XY[], bay: number, rows: [number, number][]) {
  const area = ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const r = area < 0 ? [...ring].reverse() : ring // counter-clockwise: the right of each edge is outside
  for (let i = 0; i < r.length; i++) bays(r[i], r[(i + 1) % r.length], rows[0][0], rows[0][1], bay, rows)
}
// warehouse: seven storeys, panels two storeys high
ringBays(WAREHOUSE, 5.5, [[4.5, 11], [12.5, 19], [20.5, 27]])
// concourse ring and north annex: glazed bays over a brick base
ringBays(OUTLINE.filter((_, i) => i < 7 || i > 24), 9, [[6, 11], [16, 23.5]])
ringBays(NORTH, 9, [[6, 11], [14, 19.5]])

// ---------------------------------------------------------------------------
const parts = [
  { part: white, material: PALETTE.trim },
  { part: metal, material: finish('ford-field-silver', 0xc9d1d6) },
  { part: brick, material: finish('ford-field-brick', 0xb57d6c) },
  { part: stone, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
  { part: blue, material: finish('ford-blue', 0x4a6b9c) },
]
void windowVariant
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Ford Field', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 154, osm: 'way/110555613', height: 53.3,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/det-ford-field.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
