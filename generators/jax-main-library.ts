/**
 * Jacksonville Public Library, Main Library (Robert A. M. Stern Architects,
 * 2005) — original procedural geometry, CC0-1.0.
 * bun generators/jax-main-library.ts
 *
 * Stern's classical library on Laura Street fills most of its block in pale
 * limestone: a five-storey body with tall grouped windows under a cornice
 * and an attic storey. The corner pavilion rises above the rest under a
 * shallow metal barrel vault with clerestory glazing in its arched ends; on
 * its two street faces, screens of grey cast-metal columns stand two
 * storeys tall before the reading-room windows, under a grey entablature.
 * The great reading room along the north side is roofed by a long barrel
 * vault. A courtyard opens in the south front.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14
 * (the downtown grid). Origin = centroid of way/326826327, an L round the
 * Museum of Contemporary Art (way/326826328) in the block's north-west
 * corner, which is not part of the model.
 *
 * Evidence
 * - OSM way/326826327 ("Jacksonville Public Library Main Branch").
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid
 *   read every 4 m in this frame, heights above the street (~1.5 above the
 *   grid minimum): body 26; the corner pavilion (x -70..-39.5,
 *   y -29.5..2.5) 31 at its cornice, 34.5 on its vault; the north vault
 *   (x -38..52, y 3.5..36) rising from 26.5 at its sides to 31.5 on y = 19;
 *   the courtyard (x -5.5..14.5, y -29..-1) ~9 with a 14 m wall on the
 *   street.
 * - Published (Wikipedia "Jacksonville Public Library"): Main Library
 *   opened November 2005, Robert A. M. Stern Architects, about 300,000 sq ft.
 * - Photos (Commons):
 *   · "Main Library 1 (Jacksonville, Florida).jpg", PicoOrdinalo,
 *     CC BY-SA 4.0, the corner pavilion: column screens, vault, owl,
 *     https://commons.wikimedia.org/wiki/File:Main_Library_1_(Jacksonville,_Florida).jpg
 *   · "Jacksonville Public Library Main (Southeast corner).JPG", Michael
 *     Rivera, CC BY-SA 4.0, the pavilion's vaulted end and its screen,
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_Public_Library_Main_(Southeast_corner).JPG
 *   · "Jacksonville Public Library Main top.JPG", Michael Rivera,
 *     CC BY-SA 4.0, the vault's glazed arched end over the attic,
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_Public_Library_Main_top.JPG
 *   · "Main Library 2 (Jacksonville, Florida).jpg", PicoOrdinalo,
 *     CC BY-SA 4.0, the entrance arcade,
 *     https://commons.wikimedia.org/wiki/File:Main_Library_2_(Jacksonville,_Florida).jpg
 *
 * Measured: plan (OSM), heights (lidar). Estimated from the photos: the
 * column screens (eight columns a face, 8..21 m), the window groups, the
 * cornice and attic, the vaults' clerestory bands.
 * Night: windows `window`; the vaults' clerestories `glass`, dark.
 * Left out: the bronze owl on its pedestal, the lettering, lamps.
 * Doubts: which way the pavilion's vault runs is read from one photo
 * (its arched end faces south); the north and east fronts are not
 * photographed and are drawn like the south.
 */
import { Part, writeGlb, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 14
const ANCHOR = { lng: -81.6578813, lat: 30.3289937 }

const stone = new Part(), metal = new Part(), win = new Part(), glass = new Part(), roof = new Part()

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
/** A barrel vault over x0..x1 × y0..y1 springing at z0, rising h; axis along x or y. */
function vault(x0: number, x1: number, y0: number, y1: number, z0: number, h: number, alongX: boolean, n = 10) {
  const a0 = alongX ? y0 : x0, a1 = alongX ? y1 : x1, c = (a0 + a1) / 2, half = (a1 - a0) / 2
  const prof = Array.from({ length: n + 1 }, (_, i) => { const t = Math.PI - (Math.PI * i) / n; return [c + half * Math.cos(t), z0 + h * Math.sin(t)] })
  const P = (s: number, z: number, along: number): V3 => (alongX ? [along, s, z] : [s, along, z])
  const b0 = alongX ? x0 : y0, b1 = alongX ? x1 : y1
  for (let i = 0; i < n; i++) {
    const [s0, z0a] = prof[i], [s1, z1a] = prof[i + 1]
    const nm = [(z1a - z0a), -(s1 - s0)] // outward in the profile plane (points up/out)
    const want: V3 = alongX ? [0, -nm[0], -nm[1]] : [-nm[0], 0, -nm[1]]
    const w2: V3 = [want[0], want[1], Math.abs(want[2]) + 0.01]
    quadF(roof, P(s0, z0a, b0), P(s1, z1a, b0), P(s1, z1a, b1), P(s0, z0a, b1), w2)
  }
  // the arched ends: glazed lunettes in a stone rim
  for (const [b, sgn] of [[b0, -1], [b1, 1]] as [number, number][]) {
    const out: V3 = alongX ? [sgn, 0, 0] : [0, sgn, 0]
    for (let i = 0; i < n; i++) {
      const [s0, za] = prof[i], [s1, zb] = prof[i + 1]
      triF(glass, P(c, z0, b), P(s0, za, b), P(s1, zb, b), out)
    }
  }
}

// ─── massing ───
const BODY = 26, PAV = 31
const L = 1.0 // cornice lip
function block(x0: number, x1: number, y0: number, y1: number, z1: number) {
  box(stone, x0, x1, y0, y1, 0, z1 - 1.0, 0, null)
  box(stone, x0 - L, x1 + L, y0 - L, y1 + L, z1 - 1.0, z1, 0.35, roof, true)
}
block(-39.5, -5.5, -30.7, 3.4, BODY)
block(14.5, 59.2, -30.7, 7.1, BODY)
block(-39.1, 51.8, 3.4, 36.1, BODY)
box(stone, -5.5, 14.5, -30.7, -27.5, 0, 14, 0.3, roof) // the courtyard's street wall
box(stone, -5.5, 14.5, -27.5, 3.4, 0, 8, 0, roof) // the courtyard's low ranges (the court itself)
// the corner pavilion, its vault and the north reading room's vault
block(-70, -39.5, -29.5, 2.5, PAV)
vault(-68.5, -41, -29.5, 2.5, PAV, 3.6, false)
vault(-37.5, 50.5, 4.8, 34.8, BODY, 5.4, true)

// ─── facades ───
const G1 = [1.0, 5.6], G2 = [7.0, 17.0], G3 = [18.6, 23.4] // ground, piano nobile, attic
function front(f: Face, c: number, u0: number, u1: number, bay: number, top = BODY) {
  const n = Math.max(1, Math.round((u1 - u0) / bay)), b = (u1 - u0) / n
  for (let i = 0; i < n; i++) {
    const m = u0 + b * (i + 0.5), w = b * 0.5
    rectOn(win, f, c, m - w / 2, m + w / 2, G1[0], G1[1])
    rectOn(win, f, c, m - w / 2, m + w / 2, G2[0], G2[1])
    rectOn(win, f, c, m - w / 2, m + w / 2, G3[0], top === PAV ? 27.6 : G3[1])
  }
}
front('S', -30.7, -38.5, -6.5, 6.4); front('S', -30.7, 15.5, 58.2, 6.4)
front('E', 59.2, -29.7, 6.1, 6.4); front('E', 51.8, 8.1, 35.1, 6.8)
front('N', 36.1, -38.1, 50.8, 6.4)
front('W', -39.1, 5.6, 35.1, 6.4)
for (const u of [-1.5, 8.5]) rectOn(win, 'S', -30.7, u - 2, u + 2, 1.0, 5.6) // courtyard gates
// the corner pavilion: column screens on its south and west faces
const SZ = [8.0, 21.0] // the screens' columns, from photo proportions
function screen(f: Face, c: number, u0: number, u1: number) {
  const n = 8, o = FN[f]
  rectOn(win, f, c, u0 + 0.6, u1 - 0.6, SZ[0], SZ[1] + 0.4)
  for (let i = 0; i < n; i++) {
    const u = u0 + 1.2 + ((u1 - u0 - 2.4) * i) / (n - 1)
    const p = onWall(f, c, u, 0, 1.0)
    column(metal, p[0], p[1], 0.42, SZ[0] - 0.6, SZ[1] + 0.6)
  }
  // the grey entablature carried on them
  const a = onWall(f, c, u0, 0, 0), b = onWall(f, c, u1, 0, 1.9)
  box(metal, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), SZ[1] + 0.6, SZ[1] + 1.6, 0, metal, true)
  void o
  rectOn(win, f, c, u0 + 1.5, u1 - 1.5, G1[0], G1[1])
  rectOn(win, f, c, u0 + 2.5, u1 - 2.5, SZ[1] + 2.4, 27.6)
}
screen('S', -29.5, -63.5, -46)
screen('W', -70, -23.0, -4.0)
for (const [f, c, us] of [['S', -29.5, [-67.6, -42]], ['W', -70, [-27.0, 0.0]]] as [Face, number, number[]][])
  for (const u of us) { rectOn(win, f, c, u - 1.0, u + 1.0, G1[0], G1[1]); rectOn(win, f, c, u - 1.0, u + 1.0, SZ[0], SZ[1]); rectOn(win, f, c, u - 1.0, u + 1.0, SZ[1] + 2.4, 27.6) }

const parts = [
  { part: stone, material: finish('library-limestone', 0xebdfc8) },
  { part: metal, material: finish('library-grey-metal', 0x8c9298) },
  { part: win, material: { ...PALETTE.window, color: 0x617786 } },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Jacksonville Main Library', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: PAV + 3.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/326826327'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-main-library.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
