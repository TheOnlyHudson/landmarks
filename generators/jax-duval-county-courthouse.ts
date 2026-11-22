/**
 * Duval County Courthouse (2012), Jacksonville — original procedural
 * geometry, CC0-1.0.
 * bun generators/jax-duval-county-courthouse.ts
 *
 * The neoclassical courthouse on West Adams Street, in pale cast stone: a
 * long eight-storey slab of tall grouped windows over a two-storey podium.
 * At its centre a great glazed hall rises above the slab under a low gable,
 * its glass pediment fronted by a colonnade of tall columns. In front, on
 * the centre line, a pedimented portico of six columns marks the entrance;
 * quarter-round colonnaded drums round the podium's two front corners.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14
 * (the downtown grid). Origin = centroid of way/170066678. The model is
 * symmetric about x = 0 as the building is.
 *
 * Evidence
 * - OSM way/170066678 ("Duval County Courthouse", building=yes): the
 *   outline, used as the podium's plan (49 vertices).
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid,
 *   read every 6 m in this frame, heights above the street (grid minimum
 *   + 1): podium 11.5; slab 39 (x -96..98, y -18..18) and the block behind
 *   the hall (x -38..44, y 18..46.5); the hall's gable x -27..27, eave ~45.5,
 *   ridge 54 (along y, on x = 0); the portico's gable eave ~18, ridge ~23
 *   (x -13..12.5, y -54..-35).
 * - Published (Wikipedia "Duval County Courthouse"): opened June 2012,
 *   neoclassical, about 800,000 sq ft.
 * - Photos (Commons):
 *   · "Duval County Courthouse 1.jpg", PicoOrdinalo, CC BY-SA 4.0, the
 *     front from the south-east (portico, hall, drum, slab),
 *     https://commons.wikimedia.org/wiki/File:Duval_County_Courthouse_1.jpg
 *   · "DuvalCountyCourthouse.JPG", Excel23, CC BY-SA 3.0, the front from
 *     the south-west (drum colonnade, the hall's glass pediment, portico),
 *     https://commons.wikimedia.org/wiki/File:DuvalCountyCourthouse.JPG
 *   · "Duval County Courthouse 2.jpg", PicoOrdinalo, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Duval_County_Courthouse_2.jpg
 *
 * Measured: plan (OSM), heights (lidar). Estimated from the photos: window
 * groups (two storeys a panel, 6.5 m bays), column sizes and counts (eight
 * before the hall, six on the portico, seven on each drum), the hall's
 * glazing, entablature depths.
 * Night: windows `window`; the hall's glass gable `glass`, dark.
 * Left out: the slab's recessed loggias and balconies, the cornice
 * ornament, the rooftop plant.
 * Doubts: the north side is not photographed; the drums' colonnades are
 * drawn on the outline's arcs.
 */
import { Part, writeGlb, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 14
const ANCHOR = { lng: -81.663375, lat: 30.3300552 }

const stone = new Part(), trim = new Part(), win = new Part(), glass = new Part(), roof = new Part()

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
// ─── the podium: the whole outline ───
const OUTLINE: XY[] = [[-82.5, -28.4], [-87.5, -28.2], [-87.6, -18.3], [-105.0, -18.8], [-105.0, 45.7], [-66.8, 45.7], [-66.8, 35.0], [-37.6, 35.0], [-37.6, 46.5], [44.0, 46.5], [44.0, 33.7], [67.9, 33.7], [67.9, 43.8], [104.9, 43.8], [104.9, -19.8], [87.6, -19.8], [87.6, -30.0], [82.7, -30.1], [81.3, -37.2], [79.1, -41.3], [74.8, -45.4], [70.3, -48.3], [65.7, -49.7], [65.9, -52.1], [56.4, -52.3], [56.5, -50.2], [38.2, -50.0], [38.2, -51.7], [29.0, -51.7], [29.2, -35.5], [-29.2, -35.1], [-29.1, -51.3], [-38.2, -51.4], [-38.2, -49.4], [-56.3, -49.5], [-56.4, -51.3], [-65.5, -51.0], [-65.3, -48.7], [-68.7, -48.0], [-71.9, -46.1], [-76.1, -43.2], [-79.4, -39.1], [-82.3, -33.5]]
const POD = 11.5, SLAB = 39, HALL_EAVE = 45.5, HALL_RIDGE = 54
// the portico's bump is left out of the podium (the portico stands free before it), and the
// drums' walls are pulled 2.5 m in behind their colonnades
const pull = (v: XY): XY => {
  for (const s of [-1, 1]) {
    const c: XY = [s * 64.5, -31], dx = v[0] - c[0], dy = v[1] - c[1], r = Math.hypot(dx, dy)
    if (dy < -2 && s * dx > 2 && r > 15 && r < 24) return [c[0] + (dx * (r - 2.5)) / r, c[1] + (dy * (r - 2.5)) / r]
  }
  return v
}
const ring = prism(stone, OUTLINE.map(pull), 0, POD)
// a cornice band round the podium's top
for (let i = 0; i < ring.length; i++) bays(trim, ring[i], ring[(i + 1) % ring.length], POD - 1.2, POD - 0.4, 400, 1)
// podium windows: tall two-storey panels in bays, except where the portico stands
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  bays(win, a, b, 1.0, POD - 2.2, 4.6, 0.6)
}

// ─── the slab and the block behind the hall ───
function block(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  box(stone, x0, x1, y0, y1, z0, z1 - 1.2, 0, null)
  box(trim, x0 - 0.6, x1 + 0.6, y0 - 0.6, y1 + 0.6, z1 - 1.2, z1, 0.3, roof, true)
}
block(-95.7, 98.3, -17.7, 18.3, POD, SLAB)
block(-37.6, 44, 18.3, 46.5, POD, SLAB)
// grouped windows: two storeys a panel, 6.5 m bays, wall between as piers and spandrels
const GROUPS = [[POD + 1.0, POD + 8.6], [POD + 10.0, POD + 17.6], [POD + 19.0, SLAB - 2.6]]
const slabEdges: [XY, XY][] = [
  [[-95.7, -17.7], [-28, -17.7]], [[28, -17.7], [98.3, -17.7]],
  [[98.3, -17.7], [98.3, 18.3]], [[-95.7, 18.3], [-95.7, -17.7]],
  [[98.3, 18.3], [44, 18.3]], [[-37.6, 18.3], [-95.7, 18.3]],
  [[44, 18.3], [44, 46.5]], [[44, 46.5], [-37.6, 46.5]], [[-37.6, 46.5], [-37.6, 18.3]],
]
for (const [a, b] of slabEdges) for (const [z0, z1] of GROUPS) bays(win, a, b, z0, z1, 6.5, 0.6)

// ─── the great hall: glazed gable over the centre, its colonnade in front ───
{
  const x0 = -27, x1 = 27, y0 = -14, y1 = 46.5
  box(stone, x0, x1, y0, y1, SLAB, HALL_EAVE, 0, null)
  // glazed south face of the hall, from the podium up, and its glass pediment
  quadF(glass, [x0 + 2, y0 - 3.6, POD], [x1 - 2, y0 - 3.6, POD], [x1 - 2, y0 - 3.6, SLAB - 2.6], [x0 + 2, y0 - 3.6, SLAB - 2.6], [0, -1, 0])
  rectOn(glass, 'S', y0, x0 + 1.5, x1 - 1.5, SLAB, HALL_EAVE - 0.8)
  rectOn(glass, 'E', x1, y0 + 2, y1 - 2, SLAB + 0.6, HALL_EAVE - 0.8)
  rectOn(glass, 'W', x0, y0 + 2, y1 - 2, SLAB + 0.6, HALL_EAVE - 0.8)
  // the gable roof, with a pale cornice and raking edges
  box(trim, x0 - 0.8, x1 + 0.8, y0 - 0.8, y1 + 0.8, HALL_EAVE, HALL_EAVE + 1.0, 0, null, true)
  const z = HALL_EAVE + 1.0, rz = HALL_RIDGE
  const SW: V3 = [x0 - 0.8, y0 - 0.8, z], SE: V3 = [x1 + 0.8, y0 - 0.8, z], NE: V3 = [x1 + 0.8, y1 + 0.8, z], NW: V3 = [x0 - 0.8, y1 + 0.8, z]
  const RS: V3 = [0, y0 - 0.8, rz], RN: V3 = [0, y1 + 0.8, rz]
  quadF(roof, SE, NE, RN, RS, [1, 0, 3]); quadF(roof, NW, SW, RS, RN, [-1, 0, 3])
  // the pediment: glass in a pale frame
  triF(glass, [x0 + 1.2, y0 - 0.85, z + 0.3], [x1 - 1.2, y0 - 0.85, z + 0.3], [0, y0 - 0.85, rz - 0.9], [0, -1, 0])
  triF(trim, SW, SE, RS, [0, -1, 0]); triF(trim, NE, NW, RN, [0, 1, 0])
  // the colonnade: eight tall columns before the glass, an entablature on them
  for (let i = 0; i < 8; i++) column(trim, -22.75 + i * 6.5, y0 - 5.5, 1.0, POD, SLAB - 2.4)
  box(trim, x0 + 1, x1 - 1, y0 - 7, y0, SLAB - 2.4, SLAB, 0.2, roof, true)
}

// ─── the entrance portico: six columns under a pediment ───
{
  const x0 = -13.3, x1 = 12.4, y0 = -53.9, y1 = -35, ez = 18, rz = 23, cx = (x0 + x1) / 2
  for (let i = 0; i < 6; i++) column(trim, x0 + 2.2 + (i * (x1 - x0 - 4.4)) / 5, y0 + 1.6, 0.85, 0, ez - 2.2)
  for (let i = 0; i < 2; i++) for (const s of [0, 1]) column(trim, s ? x1 - 2.2 : x0 + 2.2, y0 + 7 + i * 5.5, 0.85, 0, ez - 2.2)
  box(trim, x0, x1, y0, y1, ez - 2.2, ez, 0, null, true)
  box(trim, x0, x1, y0, y1, 0, 0.6, 0, trim) // the portico's steps
  const SW: V3 = [x0, y0, ez], SE: V3 = [x1, y0, ez], NE: V3 = [x1, y1, ez], NW: V3 = [x0, y1, ez], RS: V3 = [cx, y0, rz], RN: V3 = [cx, y1, rz]
  triF(trim, SW, SE, RS, [0, -1, 0]); triF(trim, NE, NW, RN, [0, 1, 0])
  quadF(roof, SE, NE, RN, RS, [1, 0, 2]); quadF(roof, NW, SW, RS, RN, [-1, 0, 2])
  // the tympanum's glazing, as on the hall
  triF(glass, [x0 + 2.5, y0 - 0.05, ez + 0.5], [x1 - 2.5, y0 - 0.05, ez + 0.5], [cx, y0 - 0.05, rz - 1.0], [0, -1, 0])
}

// ─── the corner drums' colonnades ───
for (const s of [-1, 1]) {
  const c: XY = [s * 64.5, -31], R = 19.8
  for (let i = 0; i < 7; i++) {
    const t = (-90 + (i * 90) / 6) * (Math.PI / 180)
    column(trim, c[0] + s * R * Math.cos(t), c[1] + R * Math.sin(t), 0.8, 0, POD - 1.2)
  }
}

const parts = [
  { part: stone, material: finish('courthouse-stone', 0xe9e2d6) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: { ...PALETTE.window, color: 0x5d7488 } },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Duval County Courthouse', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: HALL_RIDGE,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/170066678'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-duval-county-courthouse.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
