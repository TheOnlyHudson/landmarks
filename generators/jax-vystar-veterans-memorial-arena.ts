/**
 * VyStar Veterans Memorial Arena, Jacksonville (opened 2003; Ellerbe
 * Becket; Jacksonville Veterans Memorial Arena until 2019) — procedural,
 * CC0-1.0, no textures.  bun generators/jax-vystar-veterans-memorial-arena.ts
 *
 * Map frame: x along the arena (+x the east-south-east front on the plaza
 * by A. Philip Randolph Boulevard), y across it, z up, metres. Placed at
 * bearing 15°, the square grid of the OSM outline's long sides (the west
 * edge runs at 14.5°, the south edge at 104.5°). Anchor: the area centroid
 * of way/326792208, -81.644988, 30.325759.
 *
 * What makes it read as itself: a long red-brick body about 29 m tall with
 * pale stone bands, its main (east) front gently bowed and glazed in tall
 * two-storey windows between brick piers, with fully glazed corner bays at
 * either end of the front and an entrance canopy carrying the lit sign;
 * over it the grey metal drum and the shallow barrel-vaulted roof running
 * the length of the arena, its arched ends overhanging; a lower brick west
 * wing.
 *
 * Evidence
 * - OSM: way/326792208 (building=yes, leisure=stadium, name, Q1579292). No
 *   building:part inside.
 * - Measured, lidar: USGS 3DEP FL_Peninsular_FDEM_Duval_2018 (flown 2018),
 *   1 m grid, 6 m table in this frame; heights above the lowest ground:
 *   - the vault: crown 39.2 m at y = 0, 38.5 at ±14, 37.6 at ±20, 36.7 at
 *     ±26, 35.5 at ±32 (a circle of about 138 m radius), from x = -58 to
 *     x = 48;
 *   - the drum and ring round the vault 31 m; the brick body 28.6-29.5 m;
 *   - the west wing 15 m (x < -57), with a 19-23 m step to the vault;
 *   - the entrance canopy on the east 6.5-10.5 m.
 * - Measured, USGS NAIP orthophoto 2023 (0.4 m): plan; the pale roof; the
 *   brick plaza east of the front.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Excel23, "Vystar Veterans 2023" (CC BY 4.0; the east front at dusk:
 *     brick piers, stone bands, window bays, the glazed corner, the canopy
 *     and the lit sign)
 *     https://commons.wikimedia.org/wiki/File:Vystar_Veterans_2023.jpg
 *   Michael Rivera, "Jacksonville Veterans Memorial Arena front" (CC BY-SA
 *     3.0; the east front by day, the bowed cornice and the drum over it)
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_Veterans_Memorial_Arena_front.JPG
 *   Jack Skellington III, "Jacksonville veterans Arena 6" (CC BY-SA 4.0;
 *     the grey drum and the arched end of the vault over the brick body)
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_veterans_Arena_6.jpg
 * - Estimated: window sizes and bay rhythm (from the east front photos);
 *   the drum's louvre band; the north, south and west walls, which no photo
 *   shows squarely, carry the east front's stone bands and fewer windows.
 * - Not drawn: the sign's lettering (a lit band), lamp posts, the statue
 *   column on the plaza, roof plant.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, quad, type XY } from './dc-nationals-park'

const brick = new Part(), stone = new Part(), metal = new Part(), win = new Part(), door = new Part(), sign = new Part()

// OSM outline in this frame (bearing 15°, about the anchor), lightly simplified.
const OUTLINE: XY[] = [
  [-74.6, 53.9], [-72.4, -57.0], [-47.0, -56.7], [-48.2, -60.1], [62.0, -59.7], [61.9, -43.6], [69.0, -29.0],
  [72.6, -13.9], [73.6, -6.4], [74.8, 44.2], [79.8, 44.1], [80.1, 57.8], [65.6, 58.1], [65.6, 56.0], [23.2, 55.6],
  [9.4, 60.4], [1.7, 61.7], [-6.0, 61.9], [-19.0, 59.8], [-29.4, 56.3], [-50.2, 56.3], [-47.3, 48.9], [-61.0, 48.6],
  [-65.5, 54.0],
]
const H = 29.5, WEST_H = 15, X_WEST = -57

// Brick body to 29.5 m, west wing to 15 m (split at x = -57).
function clipX(poly: XY[], x0: number, keepAbove: boolean): XY[] {
  const out: XY[] = []
  const inside = (p: XY) => (keepAbove ? p[0] >= x0 : p[0] <= x0)
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) {
      const t = (x0 - a[0]) / (b[0] - a[0])
      out.push([x0, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}
const MAIN = clipX(OUTLINE, X_WEST, true), WEST = clipX(OUTLINE, X_WEST, false)
prism(MAIN, 0, H - 1.2, brick, null)
prism(MAIN, H - 1.2, H, stone, metal) // stone cornice, grey roof
prism(WEST, 0, WEST_H - 1.0, brick, null)
prism(WEST, WEST_H - 1.0, WEST_H, stone, metal)

// Stone string courses and window bays on every wall face, by edge.
const area = OUTLINE.reduce((s, a, i) => { const b = OUTLINE[(i + 1) % OUTLINE.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const sgn = area > 0 ? 1 : -1 // outward normal = (dy, -dx) * sgn
function faces(poly: XY[], fn: (a: XY, e: XY, n: V3, L: number) => void) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 3) continue
    const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    fn(a, e, [e[1] * sgn, -e[0] * sgn, 0], L)
  }
}
function panel(p: Part, a: XY, e: XY, n: V3, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const q = (u: number, z: number): V3 => [a[0] + e[0] * u + n[0] * off, a[1] + e[1] * u + n[1] * off, z]
  quad(p, [q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1)], n)
}
const isFront = (a: XY, n: V3) => n[0] > 0.6 && a[0] > 55 // the east front
faces(MAIN, (a, e, n, L) => {
  if (Math.abs(a[0] - X_WEST) < 0.01 && Math.abs(e[0]) < 0.01) { // the wall over the west wing: metal skin
    panel(metal, a, e, n, 0, L, WEST_H, H - 1.2, 0.1)
    panel(win, a, e, n, 1.5, L - 1.5, 24.2, 25.6, 0.14)
    return
  }
  for (const z of [4.6, 12.6, 20.4]) panel(stone, a, e, n, 0, L, z, z + 0.7, 0.08)
  const front = isFront(a, n)
  const bay = front ? 8 : 10
  const nb = Math.max(1, Math.round(L / bay))
  if (front) for (let i = 0; i < nb; i++) {
    const u0 = (L / nb) * i + 1.3, u1 = (L / nb) * (i + 1) - 1.3
    if (u1 - u0 < 2) continue
    panel(win, a, e, n, u0, u1, 13.5, 20.2)
    panel(win, a, e, n, u0, u1, 21.3, 27.6)
    panel(win, a, e, n, u0 + 1.2, u1 - 1.2, 8.6, 11.6)
  }
  // The other sides: brick to 21 m, the grey metal drum skin above it with
  // a louvre band (photo 3).
  if (!front) {
    panel(metal, a, e, n, 0, L, 21.1, H - 1.2, 0.1)
    panel(win, a, e, n, 1.5, L - 1.5, 24.2, 25.6, 0.14)
  }
})
faces(WEST, (a, e, n, L) => {
  if (Math.abs(a[0] - X_WEST) < 0.01 && Math.abs(e[0]) < 0.01) return
  panel(stone, a, e, n, 0, L, 4.6, 5.3, 0.08)
  panel(stone, a, e, n, 0, L, 9.6, 10.3, 0.08)
})

// The glazed corner bays at either end of the front, standing a little
// proud and a storey higher.
for (const [y0, y1] of [[44.2, 57.8], [-43.6, -55.5]] as [number, number][]) {
  const x0 = y0 > 0 ? 74.8 : 61.9, x1 = (y0 > 0 ? 80.1 : 62.0) + 1.2
  const lo = Math.min(y0, y1), hi = Math.max(y0, y1)
  prism([[x0 - 6, lo], [x1, lo], [x1, hi], [x0 - 6, hi]], 0, H + 1.6, stone, metal)
  for (const [f, n] of [[x1, [1, 0, 0]], [lo, [0, -1, 0]], [hi, [0, 1, 0]]] as [number, V3][]) {
    const along = n[0] !== 0
    const a: XY = along ? [x1, lo] : [x0 - 6, f], e: XY = along ? [0, 1] : [1, 0], L = along ? hi - lo : x1 - x0 + 6
    for (const [z0, z1] of [[5.5, 14.2], [15.2, 22.4], [23.4, H + 0.4]]) panel(win, a, e, n, 1.0, L - 1.0, z0, z1)
  }
}

// The entrance: doors along the straight front (lidar: the canopy runs
// y = -6..44), a canopy at 7 m on it carrying the lit sign.
{
  const y0 = -5, y1 = 43
  const xAt = (y: number) => 73.6 + ((74.8 - 73.6) * (y + 6.4)) / (44.2 + 6.4)
  const a: XY = [xAt(y0), y0], b: XY = [xAt(y1), y1]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: V3 = [e[1], -e[0], 0]
  for (let u = 1; u + 7 < L; u += 8) panel(door, a, e, n, u + 0.8, u + 7.2, 0.3, 5.6)
  const c: V3 = [(a[0] + b[0]) / 2 + n[0] * 4, (a[1] + b[1]) / 2 + n[1] * 4, 7.2]
  box(stone, c, [[n[0], n[1], 0], [e[0], e[1], 0], [0, 0, 1]], [4, L / 2, 0.45], true)
  box(sign, [c[0] + n[0] * 4.1, c[1] + n[1] * 4.1 + 2, 8.7], [[n[0], n[1], 0], [e[0], e[1], 0], [0, 0, 1]], [0.15, 19, 1.0])
}

// The grey drum and the barrel vault over the arena bowl.
const VX0 = -58, VX1 = 48, VY = 38, CROWN = 39.2, RV = 138
const vz = (y: number) => CROWN - (RV - Math.sqrt(RV * RV - y * y))
const EAVE = vz(VY)
prism([[VX0 + 1.5, -VY + 1.5], [VX1 - 1.5, -VY + 1.5], [VX1 - 1.5, VY - 1.5], [VX0 + 1.5, VY - 1.5]], H, EAVE - 0.6, metal, null)
{
  // Louvre band round the drum.
  const band = (a: XY, e: XY, n: V3, L: number) => panel(win, a, e, n, 2, L - 2, 31.6, 32.8)
  faces([[VX0 + 1.5, -VY + 1.5], [VX1 - 1.5, -VY + 1.5], [VX1 - 1.5, VY - 1.5], [VX0 + 1.5, VY - 1.5]], band)
  const N = 10, ys: number[] = []
  for (let i = 0; i <= N; i++) ys.push(-VY + (2 * VY * i) / N)
  const T = 0.7 // roof thickness at the edge
  for (let i = 0; i < N; i++) {
    const ya = ys[i], yb = ys[i + 1], za = vz(ya), zb = vz(yb)
    const na: V3 = [0, ya / RV, Math.sqrt(1 - (ya / RV) ** 2)], nb: V3 = [0, yb / RV, Math.sqrt(1 - (yb / RV) ** 2)]
    quad(metal, [[VX0, ya, za], [VX1, ya, za], [VX1, yb, zb], [VX0, yb, zb]], [0, 0, 1], [na, na, nb, nb])
    // The arched ends: a fascia strip, then the end wall down to the drum.
    for (const [x, s] of [[VX0, -1], [VX1, 1]] as [number, number][]) {
      quad(stone, [[x, ya, za - T], [x, yb, zb - T], [x, yb, zb], [x, ya, za]], [s, 0, 0])
      const xi = x - s * 1.5
      quad(metal, [[xi, ya, EAVE - 0.6], [xi, yb, EAVE - 0.6], [xi, yb, zb - T], [xi, ya, za - T]], [s, 0, 0])
    }
    quad(metal, [[VX0, ya, za - T], [VX1, ya, za - T], [VX1, yb, zb - T], [VX0, yb, zb - T]], [0, 0, -1])
  }
  // The long eaves' fascias.
  for (const [y, s] of [[-VY, -1], [VY, 1]] as [number, number][]) {
    quad(stone, [[VX0, y, EAVE - T], [VX1, y, EAVE - T], [VX1, y, EAVE], [VX0, y, EAVE]], [0, s, 0])
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('arena-brick', 0xb46a5a) },
  { part: stone, material: PALETTE.trim },
  { part: metal, material: finish('arena-metal', 0xc4c9cc) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: sign, material: finish('neon-vystar', 0xdfe6ff) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('VyStar Veterans Memorial Arena', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 15, osm: 'way/326792208', height: CROWN,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/jax-vystar-veterans-memorial-arena.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
