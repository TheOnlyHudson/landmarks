/**
 * Pennzoil Place (1975, Philip Johnson and John Burgee), Houston.
 * Original procedural geometry, CC0-1.0.
 * bun generators/hou-pennzoil-place.ts
 *
 * Frame: built turned to the downtown grid, BEARING 34.6: +y runs north-east
 * along the block, +x south-east, z up, metres. Origin = centroid of the OSM
 * outline way/580965929 (-95.3656214, 29.7601211).
 *
 * What it is: two identical 36-storey towers of dark bronze glass, each a
 * trapezoid in plan (one corner cut off at 45 degrees), set 180 degrees to
 * each other on one square block so they stand 10 ft apart across a slot.
 * Each tower's roof is one plane sloping at 45 degrees, highest at the slot
 * and lowest at the street, so together the two read as a split block with
 * a pitched top. In the two triangles left between the towers' cut corners,
 * glass-roofed atria slope at about 45 degrees from the street up to the slot.
 *
 * Evidence
 * - OSM: outline way/580965929; parts way/260511513 and way/260511516 (the
 *   towers, 121 m skillion) and way/260511512 (the two atria and the slot,
 *   tagged 50 m gabled). OSM's tower heights are low against lidar and
 *   published figures.
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 0.5 m grid sampled in
 *   this frame (SCRATCH/work/hou-pennzoil-place/lidar.json). y = 0 is the
 *   lowest ground under the block, 0.3 m above the grid's ground_min.
 *   Measured: block x -38..38, y -38.5..38.5; south tower's cut face runs
 *   x = 2.5 - y (so it meets the east face at y = -35.5 and the slot at
 *   x = 4); roof 123.5 at the street face rising to 159.7 at the slot (45
 *   degrees); the slot about 1.5-2 m wide in the lidar (drawn 3 m, the
 *   published 10 ft); atrium glass rising from about 1.5 m at the street to
 *   about 37 m at the slot, sloping across x.
 * - Published (Wikipedia, CTBUH): 523 ft (159 m), 36 floors, 1975, bronze
 *   glass, towers 10 ft apart, 45-degree roofs and atria.
 * - Commons daylight photos (EVIDENCE):
 *   "Pennzoil Place in Houston.JPG" (Agsftw, CC BY-SA 3.0) — the slot and
 *     both sloped tops from the north-west;
 *   "Pennzoil Place in Houston - Dec 2013.JPG" (Agsftw, CC BY-SA 3.0) — the
 *     slot from the north;
 *   "Pennzoil Place, Houston, Texas LCCN2011630051.tif" (Carol M. Highsmith,
 *     public domain) — from a tower to the south-east: both roofs, the slot
 *     and an atrium;
 *   "PennzoilPlace.jpg" and "Pennzoil Place 1.jpg" (Rick Kimpel, CC BY-SA
 *     2.0) — atrium glass meeting the towers;
 *   "Building6 houston.jpg" (Anders Lagerås, CC BY-SA 3.0) — the slot above
 *     the atrium.
 *
 * Round 2 (lead review): the curtain wall is a window-prefixed bronze
 * ('window-bronze') so it lights at night; the sloped roofs are bronze glass
 * a shade lighter ('glass-bronze', dark at night); pale-bronze floor lines
 * every three floors join the vertical mullion lines; the atria carry a thin
 * pale glazing frame round their sloped roofs (photos: Rick Kimpel's).
 *
 * Estimated: the colours (the photos' near-black bronze glass pulled up to a
 * bronze charcoal, the sloped roofs a little lighter, as they read in the
 * Highsmith photo); the bronze mullion lines, drawn one every 9.5 m rather
 * than at the real 1.5 m; the frame band along the roof edges.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 34.6
const facade = new Part(), roof = new Part(), trim = new Part(), atrium = new Part(), frame = new Part()

const EAVE = 123.5, PEAK = 159.7, Y_OUT = -38.5, Y_SLOT = -1.5
const roofZ = (y: number) => EAVE + (PEAK - EAVE) * (y - Y_OUT) / (Y_SLOT - Y_OUT)
// The south tower, counter-clockwise from above; the north tower is it turned 180 degrees.
const SOUTH: XY[] = [[-38, -38.5], [38, -38.5], [38, -35.5], [4, -1.5], [-38, -1.5]]

const area = (p: XY[]) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2

/** A vertical wall over a→b (outward = right of a→b) from z0 up to a sloped top za→zb. */
function wall(part: Part, a: XY, b: XY, z0: number, za: number, zb: number, off = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L * off, ny = -(b[0] - a[0]) / L * off
  part.quad([a[0] + nx, a[1] + ny, z0], [b[0] + nx, b[1] + ny, z0], [b[0] + nx, b[1] + ny, zb], [a[0] + nx, a[1] + ny, za])
}

function tower(sign: 1 | -1) {
  const pts = SOUTH.map(([x, y]) => [sign * x, sign * y] as XY)
  const z = (p: XY) => roofZ(sign * p[1])
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    wall(facade, a, b, 0, z(a), z(b))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const za = z(a), zb = z(b)
    {
      const nx = (b[1] - a[1]) / L * 0.06, ny = -(b[0] - a[0]) / L * 0.06
      // a bronze frame band under the roof edge
      trim.quad([a[0] + nx, a[1] + ny, za - 1.4], [b[0] + nx, b[1] + ny, zb - 1.4], [b[0] + nx, b[1] + ny, zb], [a[0] + nx, a[1] + ny, za])
      // pale-bronze floor lines every three floors (36 floors over the 123.5 m eave: ~10.3 m)
      for (let zl = 10.3; ; zl += 10.3) {
        const t0 = 0, t1 = 1, top0 = za - 2.0, top1 = zb - 2.0
        if (zl > Math.max(top0, top1)) break
        // clip the line to the wall's sloped top
        if (zl > Math.min(top0, top1)) {
          const tc = (zl - top0) / (top1 - top0)
          const q0: XY = top0 > top1 ? [a[0] + nx, a[1] + ny] : [a[0] + (b[0] - a[0]) * tc + nx, a[1] + (b[1] - a[1]) * tc + ny]
          const q1: XY = top0 > top1 ? [a[0] + (b[0] - a[0]) * tc + nx, a[1] + (b[1] - a[1]) * tc + ny] : [b[0] + nx, b[1] + ny]
          trim.quad([q0[0], q0[1], zl - 0.25], [q1[0], q1[1], zl - 0.25], [q1[0], q1[1], zl + 0.25], [q0[0], q0[1], zl + 0.25])
        } else trim.quad([a[0] + nx, a[1] + ny, zl - 0.25], [b[0] + nx, b[1] + ny, zl - 0.25], [b[0] + nx, b[1] + ny, zl + 0.25], [a[0] + nx, a[1] + ny, zl + 0.25])
        void t0; void t1
      }
      // vertical mullion lines, about 9.5 m apart, and at both corners
      const n = Math.max(1, Math.round(L / 9.5))
      for (let k = 0; k <= n; k++) {
        const t = k / n, w = 0.35 / L
        const t0 = Math.max(0, t - w), t1 = Math.min(1, t + w)
        const p0: XY = [a[0] + (b[0] - a[0]) * t0 + nx, a[1] + (b[1] - a[1]) * t0 + ny]
        const p1: XY = [a[0] + (b[0] - a[0]) * t1 + nx, a[1] + (b[1] - a[1]) * t1 + ny]
        const top0 = za + (zb - za) * t0 - 1.4, top1 = za + (zb - za) * t1 - 1.4
        trim.quad([p0[0], p0[1], 3], [p1[0], p1[1], 3], [p1[0], p1[1], top1], [p0[0], p0[1], top0])
      }
    }
  }
  // the sloped roof: one plane
  const p = area(pts) > 0 ? pts : [...pts].reverse()
  for (let i = 1; i < p.length - 1; i++) roof.tri([p[0][0], p[0][1], z(p[0])], [p[i][0], p[i][1], z(p[i])], [p[i + 1][0], p[i + 1][1], z(p[i + 1])])
}
tower(1)
tower(-1)

// ---------- the atria ----------
// West atrium: between the street (x = -38), the south tower's slot face and
// the north tower's cut face, rising toward the slot; the east one is it turned.
function atriumRoof(sign: 1 | -1) {
  const pts: XY[] = ([[-38, -1.5], [0, -1.5], [0, 1.5], [-4, 1.5], [-38, 35.5]] as XY[]).map(([x, y]) => [sign * x, sign * y])
  const z = (p: XY) => 1.5 + 0.95 * (sign * p[0] + 38)
  const p = area(pts) > 0 ? pts : [...pts].reverse()
  for (let i = 1; i < p.length - 1; i++) atrium.tri([p[0][0], p[0][1], z(p[0])], [p[i][0], p[i][1], z(p[i])], [p[i + 1][0], p[i + 1][1], z(p[i + 1])])
  // a thin pale glazing frame round the wedge's sloped roof
  const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length
  for (let i = 0; i < p.length; i++) {
    const A = p[i], B = p[(i + 1) % p.length]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L < 1) continue
    let ix = -(B[1] - A[1]) / L, iy = (B[0] - A[0]) / L
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2
    if (ix * (cx - mx) + iy * (cy - my) < 0) { ix = -ix; iy = -iy }
    const w = 0.9, at = (q: XY): V3 => [q[0], q[1], z(q) + 0.08]
    const A2: XY = [A[0] + ix * w, A[1] + iy * w], B2: XY = [B[0] + ix * w, B[1] + iy * w]
    const v = [at(A), at(B), at(B2), at(A2)]
    const nz = (v[1][0] - v[0][0]) * (v[2][1] - v[0][1]) - (v[1][1] - v[0][1]) * (v[2][0] - v[0][0])
    if (nz > 0) frame.quad(v[0], v[1], v[2], v[3]); else frame.quad(v[0], v[3], v[2], v[1])
  }
  // the low glass wall along the street
  const a: XY = [sign * -38, sign * 35.5], b: XY = [sign * -38, sign * -1.5]
  wall(atrium, a, b, 0, 1.5, 1.5)
}
atriumRoof(1)
atriumRoof(-1)

const parts = [
  { part: facade, material: { name: 'window-bronze', color: 0x635c55, roughness: 0.35 } },
  { part: roof, material: { name: 'glass-bronze', color: 0x756d65, roughness: 0.3 } },
  { part: trim, material: finish('pennzoil-bronze', 0xa39684) },
  { part: atrium, material: PALETTE.glass },
  { part: frame, material: PALETTE.trim },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pennzoil Place', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [29.7601211, -95.3656214], height: PEAK,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/580965929', 'way/260511512', 'way/260511513', 'way/260511516'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-pennzoil-place.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
