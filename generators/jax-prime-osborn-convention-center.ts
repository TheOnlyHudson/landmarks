/**
 * Prime F. Osborn III Convention Center: the Jacksonville Union Terminal
 * (Kenneth M. Murchison, 1919), with the convention halls added behind it
 * in 1986 — original procedural geometry, CC0-1.0.
 * bun generators/jax-prime-osborn-convention-center.ts
 *
 * The Beaux-Arts head house faces east on Lee Street: a colonnade of
 * fourteen Doric columns in pale limestone carries a plain entablature
 * (lettered JACKSONVILLE TERMINAL); behind and above it the waiting room's
 * attic shows three great lunette windows, each under a low segmental
 * gable, with a hipped roof behind. Lower two-storey wings flank it north
 * and south. Behind (west) lie the former concourse and the convention
 * halls, drawn as plain masses because OSM maps them as the same building.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14
 * (the downtown grid). Origin = centroid of way/346115493.
 *
 * Evidence
 * - OSM way/346115493 ("Prime F. Osborn III Convention Center",
 *   building=yes): one outline for the terminal and the halls.
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid
 *   read every 6 m in this frame, heights above the ground (grid minimum
 *   + 2): head house attic x 57..79, y 4..56, roof ridge 26 on x ~70;
 *   colonnade and front ~15 (x 80..88.4); wings 13.5; the concourse 18.5
 *   (y 22..36); exhibit halls 14 (x -99..40, y -55..22); lower annexes 8.
 * - Published (Wikipedia "Prime F. Osborn III Convention Center"; NRHP
 *   "Jacksonville Terminal Complex"): Jacksonville Union Terminal, opened
 *   1919, architect Kenneth MacKenzie Murchison; convention centre from
 *   1986; fourteen Doric columns on the main facade.
 * - Photos (Commons):
 *   · "Jacksonville Terminal Complex, FL, US (10).jpg", bubba73,
 *     CC BY-SA 3.0, the east front straight on (colonnade, attic,
 *     lunettes, gables, the south wing),
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_Terminal_Complex,_FL,_US_(10).jpg
 *   · "Jacksonville Terminal Complex, FL, US.jpg", bubba73, CC BY-SA 3.0,
 *     the front at an angle,
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_Terminal_Complex,_FL,_US.jpg
 *   · "Prime F. Osborn III Convention Center 1.jpg", PicoOrdinalo,
 *     CC BY-SA 4.0 (the sign; its emblem shows the three lunettes),
 *     https://commons.wikimedia.org/wiki/File:Prime_F._Osborn_III_Convention_Center_1.jpg
 *
 * Measured: plan (OSM), heights (lidar). Published: dates, architect,
 * column count. Estimated from the photo: column height (12.6 m) and
 * diameter (2.0 m), the wall recessed 6 m behind them, the entablature (2.6 m), the attic (to 20.5 m), the
 * gables (to 24.3 m), the lunettes (radius 4.2 m), the tall windows
 * between the columns.
 * Night: windows `window`; the stone is floodlit on the east front
 * (`_FLOODLIGHT`, the colonnade and attic face).
 * Left out: the lettering, the fountain (ground), the halls' details.
 * Doubts: the halls' plan heights are from lidar only and kept plain; the
 * wings' fronts are drawn from the one straight-on photo.
 */
import { Part, writeGlb, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 14
const ANCHOR = { lng: -81.6720918, lat: 30.3277691 }

const stone = new Part(), hall = new Part(), win = new Part(), trim = new Part(), roof = new Part()

// ─── helpers ───
function quadF(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function triF(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
/** An axis-aligned box; `bev` chamfers the top edges; top goes to `top` part (or none). */
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, top: Part | null = roof, bottom = false) {
  const r = (z: number, i = 0): V3[] => [[x0 + i, y0 + i, z], [x1 - i, y0 + i, z], [x1 - i, y1 - i, z], [x0 + i, y1 - i, z]]
  part.loft(bev > 0 ? [r(z0), r(z1 - bev), r(z1, bev)] : [r(z0), r(z1)])
  if (top) top.cap(r(z1, bev), true)
  if (bottom) part.cap(r(z0), false)
}
type Face = 'N' | 'S' | 'E' | 'W'
const FN: Record<Face, V3> = { N: [0, 1, 0], S: [0, -1, 0], E: [1, 0, 0], W: [-1, 0, 0] }
/** A point on a wall: u runs along the wall (x for N/S, y for E/W), z up, `off` outward. */
function onWall(f: Face, c: number, u: number, z: number, off: number): V3 {
  const n = FN[f]
  return f === 'N' || f === 'S' ? [u, c + n[1] * off, z] : [c + n[0] * off, u, z]
}
function rectOn(part: Part, f: Face, c: number, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  quadF(part, onWall(f, c, u0, z0, off), onWall(f, c, u1, z0, off), onWall(f, c, u1, z1, off), onWall(f, c, u0, z1, off), FN[f])
}
/** A convex outline (u, z) on a wall, fanned from its centroid. */
function polyOn(part: Part, f: Face, c: number, pts: [number, number][], off = 0.05) {
  const cu = pts.reduce((s, p) => s + p[0], 0) / pts.length, cz = pts.reduce((s, p) => s + p[1], 0) / pts.length
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    triF(part, onWall(f, c, cu, cz, off), onWall(f, c, a[0], a[1], off), onWall(f, c, b[0], b[1], off), FN[f])
  }
}
/** A round-headed opening: jambs u0..u1 from z0, a true semicircle on top. */
function archPts(u0: number, u1: number, z0: number, zs: number, n = 8): [number, number][] {
  const r = (u1 - u0) / 2, cu = (u0 + u1) / 2
  const p: [number, number][] = [[u0, z0], [u1, z0]]
  for (let i = 0; i <= n; i++) { const t = (Math.PI * i) / n; p.push([cu + r * Math.cos(t), zs + r * Math.sin(t)]) }
  return p
}
/** A hipped roof over a rectangle (eaves at z0), rising h; ridge along the longer side. */
function hipRoof(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const rx = w > d ? (w - d) / 2 : 0, ry = d > w ? (d - w) / 2 : 0
  const A: V3 = [cx - rx, cy - ry, z0 + h], B: V3 = [cx + rx, cy + ry, z0 + h]
  const c00: V3 = [x0, y0, z0], c10: V3 = [x1, y0, z0], c11: V3 = [x1, y1, z0], c01: V3 = [x0, y1, z0]
  const up = (v: V3): V3 => [v[0], v[1], 1]
  if (w >= d) {
    quadF(part, c00, c10, B, A, up([0, -1, 0])); quadF(part, c11, c01, A, B, up([0, 1, 0]))
    triF(part, c10, c11, B, up([1, 0, 0])); triF(part, c01, c00, A, up([-1, 0, 0]))
  } else {
    quadF(part, c10, c11, B, A, up([1, 0, 0])); quadF(part, c01, c00, A, B, up([-1, 0, 0]))
    triF(part, c00, c10, A, up([0, -1, 0])); triF(part, c11, c01, B, up([0, 1, 0]))
  }
  part.cap([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], false)
}
type XY = [number, number]
const area2 = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (p: XY[]) => (area2(p) < 0 ? [...p].reverse() : p)
/** Ear-clipping triangulation of a simple polygon, counter-clockwise from above. */
function capPoly(part: Part, poly: XY[], z: number) {
  const idx = poly.map((_, i) => i)
  const ar = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => ar(a, b, p) > 1e-9 && ar(b, c, p) > 1e-9 && ar(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (ar(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) part.tri([...poly[idx[0]], z] as V3, [...poly[idx[1]], z] as V3, [...poly[idx[2]], z] as V3)
}
/** A prism over a polygon: walls, flat roof. Returns the counter-clockwise ring. */
function prism(wall: Part, poly: XY[], z0: number, z1: number, top: Part = roof) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  capPoly(top, p, z1)
  return p
}
/** Window panels along a polygon edge a→b (counter-clockwise ring), in bays. */
function bays(part: Part, a: XY, b: XY, z0: number, z1: number, bay: number, fill = 0.55) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < bay * 0.8) return
  const n = Math.max(1, Math.round(l / bay)), ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l, nx = uy, ny = -ux
  const w = (l / n) * fill
  for (let i = 0; i < n; i++) {
    const m = (l / n) * (i + 0.5)
    const P = (s: number, z: number): V3 => [a[0] + ux * (m + s) + nx * 0.06, a[1] + uy * (m + s) + ny * 0.06, z]
    quadF(part, P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1), [nx, ny, 0])
  }
}
/** A round column of radius r, 12 sides, with a square cap block. */
function column(part: Part, x: number, y: number, r: number, z0: number, z1: number) {
  const ring = (z: number): V3[] => Array.from({ length: 12 }, (_, i) => { const t = (i / 12) * Math.PI * 2; return [x + r * Math.cos(t), y + r * Math.sin(t), z] as V3 })
  part.loft([ring(z0), ring(z1)])
}
// ─── the convention halls behind: plain masses ───
const OUTLINE: XY[] = [[-98.8, 21.7], [-98.9, 6.4], [-99.1, -55.5], [-94.3, -55.5], [-94.4, -70.6], [-71.8, -70.7], [-71.8, -65.2], [-24.0, -65.5], [-24.1, -71.2], [39.7, -71.5], [39.9, -33.0], [51.5, -33.1], [51.5, 90.5], [41.0, 90.5], [40.9, 71.9], [2.8, 72.0], [2.8, 45.0], [-25.3, 45.1], [-25.3, 35.7], [-74.2, 35.8], [-74.3, 26.2], [-79.7, 26.2], [-79.7, 21.6]]
prism(hall, OUTLINE, 0, 8) // the terminal (x > 51.5) is drawn on its own below
box(hall, -99, 39.7, -55.5, 22.2, 8, 14, 0, roof)
box(hall, -74, 51, 22.2, 35.8, 8, 18.5, 0, roof)
for (const [a, b] of [[[-99, -55.5], [39.7, -55.5]], [[39.7, -55.5], [39.7, -33]]] as [XY, XY][]) bays(win, a, b, 9.0, 12.6, 9, 0.5)

// ─── the terminal ───
const FRONT = 80.0, COL_X = 86.0, COL_H = 12.6, ENT = 15.2, ATTIC = 20.5
const fl = (p: V3, n: V3) => (n[0] > 0.5 && p[0] > 55 ? 0.9 : p[0] > 80 && n[2] < 0.5 ? 0.6 : 0)
// flanking wings, two storeys, with a cornice
for (const [y0, y1] of [[-30.4, -2.7], [62.2, 88.5]]) {
  box(stone, 51.5, 85.4, y0, y1, 0, 12.6, 0, null)
  box(trim, 51.0, 85.9, y0 - 0.5, y1 + 0.5, 12.6, 13.6, 0.3, roof, true)
  for (let y = y0 + 2.5; y < y1 - 1.5; y += 4.6) {
    rectOn(win, 'E', 85.4, y - 0.9, y + 0.9, 1.2, 5.0)
    rectOn(win, 'E', 85.4, y - 0.9, y + 0.9, 6.8, 10.8)
  }
}
// the head house behind the colonnade
box(stone, 56, FRONT, -2.7, 62.2, 0, ENT, 0, null)
// tall dark windows between the columns, on the wall recessed 6 m behind them; the end bays stone
for (let i = 1; i < 12; i++) {
  const y = 0.6 + (i + 0.5) * 4.58
  rectOn(win, 'E', FRONT, y - 1.5, y + 1.5, 0.8, COL_H - 0.6)
}
// the colonnade: fourteen columns on a low stylobate, the entablature over them
box(trim, FRONT, 88.4, -2.7, 62.2, 0, 0.6, 0, trim)
for (let i = 0; i < 14; i++) column(trim, COL_X, 0.6 + i * 4.58, 1.0, 0.6, COL_H)
box(trim, FRONT - 0.2, 88.4, -2.7, 62.2, COL_H, ENT, 0.25, roof, true)
// the attic: three lunettes under segmental gables, a hipped roof behind
const AX = 79.9
box(stone, 57, AX, 4.2, 56, ENT, ATTIC, 0, null)
hipRoof(roof, 56.6, AX + 0.3, 3.8, 56.4, ATTIC, 5.6)
for (const yc of [12.85, 30.1, 47.35]) {
  // segmental gable on the attic's face, with a slab behind it so it reads solid from any side
  const hw = 8.6, n = 10, base = ATTIC, top = ATTIC + 3.8
  const crest: [number, number][] = [[yc + hw, base]]
  for (let i = 0; i <= n; i++) { const u = yc + hw - (2 * hw * i) / n, t = (u - yc) / hw; crest.push([u, base + (top - base) * (1 - t * t)]) }
  polyOn(stone, 'E', AX, crest, 0)
  polyOn(stone, 'W', AX - 1.2, crest, 0)
  for (let i = 1; i < crest.length - 1; i++) {
    const a = crest[i], b = crest[i + 1]
    quadF(trim, [AX - 1.2, a[0], a[1]], [AX + 0.25, a[0], a[1]], [AX + 0.25, b[0], b[1]], [AX - 1.2, b[0], b[1]], [0, 0, 1]) // the gable's top, facing up
  }
  // the raking cornice: a pale band along the gable's edge
  for (let i = 1; i < crest.length - 1; i++) {
    const a = crest[i], b = crest[i + 1]
    quadF(trim, [AX + 0.25, a[0], a[1] - 0.6], [AX + 0.25, b[0], b[1] - 0.6], [AX + 0.25, b[0], b[1]], [AX + 0.25, a[0], a[1]], [1, 0, 0])
  }
  // the lunette: a true semicircle, springing below the attic's top and rising into the gable
  polyOn(win, 'E', AX, archPts(yc - 4.2, yc + 4.2, ATTIC - 2.0, ATTIC - 2.0, 10), 0.08)
}
// the attic's cornice line between and beside the gables
rectOn(trim, 'E', AX, 4.2, 56, ATTIC - 0.6, ATTIC - 0.1, 0.04)

const parts = [
  { part: stone, material: { ...finish('terminal-limestone', 0xe7decb), floodlight: fl } },
  { part: trim, material: { ...PALETTE.trim, floodlight: fl } },
  { part: hall, material: finish('osborn-halls', 0xd9d4ca) },
  { part: win, material: { ...PALETTE.window, color: 0x5f7484 } },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Prime F. Osborn III Convention Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: ATTIC + 5.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/346115493'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-prime-osborn-convention-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
