/**
 * Salt Lake Tabernacle (1864-67, Henry Grow and Truman O. Angell),
 * Temple Square, Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-salt-lake-tabernacle.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the long axis runs
 * east-west). The origin is the area centroid of OSM way/33162308
 * (-111.8931214, 40.7704320). y = 0 is the lowest ground under the
 * outline, at the west end; Mapterhorn rises about 2.7 m to the east end,
 * so the east piers sink into the slope and the east doors start higher.
 *
 * Form: the long "turtle-shell" roof, a stadium-shaped dome with an
 * elliptical cross-section over a plan of two straight sides and two
 * semi-elliptical ends; a deep cream eave band under it; 44 sandstone piers
 * all round, with the recessed cream wall between them holding the doors
 * and grilled windows.
 *
 * OSM: way/33162308, height 24.5, roof:colour silver (roof:height 25
 * looks wrong: it would make the walls zero high). The outline is 78.4 x
 * 47.6 m: straight sides 35 m long, ends of 21.7 m (along x) by 23.8 m.
 * Published: 250 x 150 ft (76 x 46 m), 80 ft (24.4 m) high, 44 sandstone
 * piers (Wikipedia, "Salt Lake Tabernacle"; NRHP/HAER UT-18-SALCI-2).
 * Estimated from photos (p1 from the south-east, p2 from above to the
 * west): piers 6.6 m with their caps, the eave band 6.6-10.2 m, the roof's
 * rise 15.3 m to 25.5 m above the west-end ground (24.4 m published,
 * above the average ground, which is ~1.3 m above y = 0); the wall set
 * 1.2 m behind the pier faces; a door in every other bay (p1 shows doors
 * and grilled windows alternating on the south side; the north side is
 * unphotographed here and mirrored).
 * Left out: the standing-seam ribs (too fine at map scale), the low
 * service annex at the west end (not mapped in OSM), lamps and railings.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:2019_Salt_Lake_Tabernacle.jpg
 *     Farragutful, CC BY-SA 4.0 (from the south-east, ground level)
 *  p2 https://commons.wikimedia.org/wiki/File:S.L._Tabernacle_on_Temple_Square.jpg
 *     Leon7, CC BY-SA 3.0 (from above, to the west)
 * Lidar: not used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const shell = new Part(), band = new Part(), sand = new Part(), door = new Part(), win = new Part()

// ------------------------------------------------------------- the plan ---
const L = 17.5     // half the straight sides
const A = 21.7     // the ends' reach beyond the straights, along x
const B = 23.8     // half the width
const NP = 44      // piers (published)

/** A point on the stadium ring with end radii a (x) and b (y), at perimeter fraction u. */
function ringPoint(u: number, a: number, b: number): [number, number] {
  // Arc lengths on the base ring decide where the fractions fall.
  const endLen = Math.PI * Math.sqrt((A * A + B * B) / 2)
  const total = 2 * (2 * L) + 2 * endLen
  let s = (((u % 1) + 1) % 1) * total
  // Start at the middle of the east end, go counter-clockwise.
  const half = endLen / 2
  if (s < half) { const t = (s / endLen) * Math.PI; return [L + a * Math.cos(t), b * Math.sin(t)] }
  s -= half
  if (s < 2 * L) return [L - s, b]
  s -= 2 * L
  if (s < endLen) { const t = Math.PI / 2 + (s / endLen) * Math.PI; return [-L + a * Math.cos(t), b * Math.sin(t)] }
  s -= endLen
  if (s < 2 * L) return [-L + s, -b]
  s -= 2 * L
  const t = -Math.PI / 2 + (s / endLen) * Math.PI
  return [L + a * Math.cos(t), b * Math.sin(t)]
}
/** The outward horizontal normal of the base ring at fraction u. */
function ringNormal(u: number): [number, number] {
  const p = ringPoint(u - 0.001, A, B), q = ringPoint(u + 0.001, A, B)
  const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy)
  return [dy / l, -dx / l]
}
const ring = (n: number, off: number, z: number, u0 = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const [x, y] = ringPoint(u0 + i / n, A + off, B + off)
    return [x, y, z] as V3
  })
const ground = (x: number) => Math.max(0, 0.2 + (x + 39) * 0.034)

// --------------------------------------------------------- wall and band ---
// The ring has a vertex at every pier, so each bay of wall is one flat face.
const N = NP * 2
const WALL = -1.2, PIER_FACE = -0.1, Z_PIER = 5.4, Z_CAP = 6.0, Z_EAVE = 10.0, BAND = 0.35
band.loft([ring(NP, WALL, 0), ring(NP, WALL, Z_CAP)])
// The eave band overhangs the piers slightly; its soffit faces down.
{
  const lo = ring(N, BAND, Z_CAP), hi = ring(N, BAND, Z_EAVE), inner = ring(N, WALL, Z_CAP)
  for (let k = 0; k < 4; k++) {
    // split the band into four lifts so its long faces stay short
    const z0 = Z_CAP + ((Z_EAVE - Z_CAP) * k) / 4, z1 = Z_CAP + ((Z_EAVE - Z_CAP) * (k + 1)) / 4
    band.loft([lo.map(([x, y]) => [x, y, z0] as V3), hi.map(([x, y]) => [x, y, z1] as V3)])
  }
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    band.quad(lo[i], inner[i], inner[j], lo[j])
  }
  // A thin lip at the top of the band, where the gutter runs.
  band.loft([ring(N, BAND + 0.25, Z_EAVE - 0.35), ring(N, BAND + 0.25, Z_EAVE)])
  const lip0 = ring(N, BAND, Z_EAVE - 0.35), lip1 = ring(N, BAND + 0.25, Z_EAVE - 0.35)
  for (let i = 0; i < N; i++) { const j = (i + 1) % N; band.quad(lip0[i], lip0[j], lip1[j], lip1[i]) }
}

// ------------------------------------------------------------- the piers ---
for (let i = 0; i < NP; i++) {
  const u = i / NP
  const [nx, ny] = ringNormal(u)
  const tx = -ny, ty = nx
  const [bx, by] = ringPoint(u, A + WALL + 0.05, B + WALL + 0.05)
  const box = (p: Part, w: number, d0: number, d1: number, z0: number, z1: number, top = true) => {
    const c = (s: number, d: number, z: number): V3 => [bx + tx * s + nx * d, by + ty * s + ny * d, z]
    const h = w / 2
    p.quad(c(-h, d1, z0), c(h, d1, z0), c(h, d1, z1), c(-h, d1, z1))       // face
    p.quad(c(h, d0, z0), c(h, d1, z0), c(h, d1, z1), c(h, d0, z1))         // sides
    p.quad(c(-h, d1, z0), c(-h, d0, z0), c(-h, d0, z1), c(-h, d1, z1))
    if (top) p.quad(c(-h, d0, z1), c(-h, d1, z1), c(h, d1, z1), c(h, d0, z1))
  }
  const depth = PIER_FACE - WALL - 0.05
  // Bevelled shaft: a narrow face plus chamfers.
  box(sand, 2.3, 0, depth, 0, Z_PIER, false)
  {
    const c = (s: number, d: number, z: number): V3 => [bx + tx * s + nx * d, by + ty * s + ny * d, z]
    // chamfer the outer corners
    for (const sg of [-1, 1]) {
      const a = c(sg * 1.15, depth, 0), b = c(sg * 0.85, depth + 0.3, 0), a1 = c(sg * 1.15, depth, Z_PIER), b1 = c(sg * 0.85, depth + 0.3, Z_PIER)
      if (sg < 0) sand.quad(a, b, b1, a1); else sand.quad(b, a, a1, b1)
    }
    sand.quad(c(-0.85, depth + 0.3, 0), c(0.85, depth + 0.3, 0), c(0.85, depth + 0.3, Z_PIER), c(-0.85, depth + 0.3, Z_PIER))
  }
  // The capital: a pale stone block under the band.
  box(band, 2.6, 0, depth + 0.45, Z_PIER, Z_CAP)

  // Between this pier and the next: a door (every other bay) or a window.
  const p0 = ringPoint(u, A + WALL, B + WALL), p1 = ringPoint((i + 1) / NP, A + WALL, B + WALL)
  const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2
  const fx = p1[0] - p0[0], fy = p1[1] - p0[1], fl = Math.hypot(fx, fy)
  const ux = fx / fl, uy = fy / fl, ox = uy * 0.05, oy = -ux * 0.05
  const g = ground(mx)
  const pan = (p: Part, w: number, z0: number, z1: number) => {
    const h = w / 2
    p.quad([mx - ux * h + ox, my - uy * h + oy, z0], [mx + ux * h + ox, my + uy * h + oy, z0],
      [mx + ux * h + ox, my + uy * h + oy, z1], [mx - ux * h + ox, my - uy * h + oy, z1])
  }
  if (i % 2 === 0) {
    pan(door, 2.3, g, g + 3.1)
    pan(win, 2.3, g + 3.5, Z_PIER - 0.5)
  } else {
    pan(win, 2.4, g + 1.4, Z_PIER - 0.6)
  }
}

// ------------------------------------------------------------- the roof ---
// rings at heights z = Z_EAVE + H * sin(phi): the ends and the cross-section
// are quarter ellipses, so the crown is a long smooth ridge.
const H = 15.5, P = 2.5, R0 = BAND + 0.15
{
  const steps = 11, rings: V3[][] = [], norms: V3[][] = []
  for (let k = 0; k <= steps; k++) {
    const phi = (k / steps) * (Math.PI / 2) * 0.97
    // a superellipse profile (exponent P): fuller shoulders than an ellipse, as in the photos
    const s = Math.cos(phi) ** (2 / P), zn = Math.sin(phi) ** (2 / P), z = Z_EAVE + H * zn
    const R: V3[] = [], Nn: V3[] = []
    for (let i = 0; i < N; i++) {
      const [x0, y0] = ringPoint(i / N, A + R0, B + R0)
      // the same fraction on a smaller ring: scale the end offset about ±L
      const ex = Math.abs(x0) > L ? x0 - Math.sign(x0) * L : 0
      const x = Math.abs(x0) > L ? Math.sign(x0) * L + ex * s : x0
      const y = y0 * s
      R.push([x, y, z])
      // the ellipsoid's gradient at the scaled point
      const w = s ** (P - 1)
      const g: V3 = [(w * ex) / ((A + R0) * (A + R0)), (w * y0) / ((B + R0) * (B + R0)), zn ** (P - 1) / H]
      const gl = Math.hypot(g[0], g[1], g[2])
      Nn.push([g[0] / gl, g[1] / gl, g[2] / gl])
    }
    rings.push(R); norms.push(Nn)
  }
  for (let k = 0; k < steps; k++) {
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      const na = norms[k][i], nb = norms[k][j], nc = norms[k + 1][j], nd = norms[k + 1][i]
      shell.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
      shell.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
    }
  }
  // close the crown
  const top = rings[steps]
  for (let i = 1; i < N - 1; i++) shell.tri(top[0], top[i], top[i + 1], [0, 0], [0, 0], [0, 0], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  // the dome's underside over the band's top, so the eave isn't open
  const base = rings[0], bandTop = ring(N, BAND + 0.25, Z_EAVE)
  for (let i = 0; i < N; i++) { const j = (i + 1) % N; band.quad(bandTop[i], bandTop[j], base[j], base[i]) }
}

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos: brushed aluminium roof, cream eave band
// and walls, red-brown sandstone piers, dark brown doors.
const parts = [
  { part: shell, material: finish('tabernacle-aluminium', 0xc9ced2, 0.45) },
  { part: band, material: PALETTE.stone },
  { part: sand, material: finish('tabernacle-sandstone', 0xb98e7b) },
  { part: door, material: finish('tabernacle-door', 0x8c6a4f) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Salt Lake Tabernacle', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: Z_EAVE + H,
})
await Bun.write(new URL('../models/slc-salt-lake-tabernacle.glb', import.meta.url), glb)
console.log(`slc-salt-lake-tabernacle.glb: ${triangles} triangles, ${glb.length} bytes`)
