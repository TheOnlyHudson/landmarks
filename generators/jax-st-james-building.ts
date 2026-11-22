/**
 * St. James Building (Henry John Klutho, 1912), Jacksonville City Hall since
 * 1997 — original procedural geometry, CC0-1.0.
 * bun generators/jax-st-james-building.ts
 *
 * Klutho's Prairie School department store on Hemming Park: a four-storey
 * block of cream brick and terracotta filling its block. A tall glazed
 * ground storey between square stone piers; above it three storeys of
 * paired windows between brick piers, with pale panelled spandrels; a frieze
 * of grilles under a deep, flat, overhanging cornice. At the centre of the
 * Duval Street front (south) the entrance pavilion rises a storey higher:
 * an arched fanlight over the "ST. JAMES" panel, carried up to a very deep
 * cornice on great scrolled brackets, with a low gable on top. Inside, a
 * glazed atrium; its skylight rises above the roof.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14
 * (the downtown grid). Origin = centroid of way/326826326. Outline
 * x -47.1..47.2, y -32.3..32.4; the entrance canopy is the outline's small
 * bump on the south side, x -5.9..5.4.
 *
 * Evidence
 * - OSM way/326826326 ("Jacksonville City Hall", building=yes): outline.
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid in
 *   this frame, heights above the street (grid minimum + 1.8): main roof
 *   and cornice 19.5; the south pavilion 26 (x -6..6 on the south front);
 *   the atrium skylight ~24 (x -16..9, y -8..27).
 * - Published (Wikipedia "St. James Building"; NRHP): built 1911-12,
 *   Henry John Klutho, Prairie School; four storeys; renovated as City
 *   Hall 1997.
 * - Photos (Commons):
 *   · "Jacksonville City Hall (South face).JPG", Michael Rivera,
 *     CC BY-SA 4.0, the south front and pavilion straight on,
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_City_Hall_(South_face).JPG
 *   · "St. James Building 2 (Jacksonville, Florida).jpg", PicoOrdinalo,
 *     CC BY-SA 4.0, the south-east corner: bays, spandrels, cornice,
 *     https://commons.wikimedia.org/wiki/File:St._James_Building_2_(Jacksonville,_Florida).jpg
 *   · "St. James Building 1 (Jacksonville, Florida).jpg", PicoOrdinalo,
 *     CC BY-SA 4.0, the pavilion's fanlight, panel, brackets and gable,
 *     https://commons.wikimedia.org/wiki/File:St._James_Building_1_(Jacksonville,_Florida).jpg
 *
 * Measured: plan (OSM), heights (lidar). Published: dates, architect,
 * storeys. Estimated from the photos: storey heights (ground 6.8 m, upper
 * 3.1 m), bay spacing (~6.3 m, 15 bays on the long fronts, 10 on the
 * short), cornice projection 1.6 m, the pavilion's cornice 2.4 m deep, the
 * fanlight's radius, the skylight's form (lidar shape only).
 *
 * Night: windows and storefronts `window`; the skylight is `glass`, dark.
 * Left out: the urns on the parapet, the scrolled brackets (the deep
 * cornice stands for them), terracotta ornament, the lettering.
 * Doubts: the north and west fronts are not photographed and are drawn
 * like the east one; the skylight is shaped from lidar only.
 */
import { Part, writeGlb, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 14
const ANCHOR = { lng: -81.6590559, lat: 30.3300646 }

const brick = new Part(), trim = new Part(), win = new Part(), glass = new Part(), roof = new Part()

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
// ─── massing ───
const X0 = -47.1, X1 = 47.2, Y0 = -32.3, Y1 = 32.4
const GROUND = 6.8, FRIEZE = 17.4, CORN = 18.4, TOP = 19.5
box(trim, X0, X1, Y0, Y1, 0, GROUND + 0.8, 0, null) // stone ground storey and its band
box(brick, X0, X1, Y0, Y1, GROUND + 0.8, CORN, 0, null)
// the deep flat cornice, bevelled, and the roof behind it
box(trim, X0 - 1.6, X1 + 1.6, Y0 - 1.6, Y1 + 1.6, CORN, TOP, 0.4, roof, true)

// the atrium skylight: a glazed hip over the light well
box(trim, -16, 9, -8, 27, TOP, TOP + 1.2, 0, null)
hipRoof(glass, -16, 9, -8, 27, TOP + 1.2, 3.4)

// ─── facades: bays between piers ───
const STOREY = (FRIEZE - 0.6 - (GROUND + 0.8)) / 3
const SPANDRELS = [GROUND + 0.8 + STOREY, GROUND + 0.8 + 2 * STOREY]
/** A 1 m brick pier standing 0.45 m proud of the wall, centred at u. */
function pier(f: Face, c: number, u: number) {
  const P = (du: number, d: number, z: number) => onWall(f, c, u + du, z, d)
  const z0 = GROUND + 0.8, z1 = FRIEZE, out = FN[f]
  const along: V3 = f === 'N' || f === 'S' ? [1, 0, 0] : [0, 1, 0]
  quadF(brick, P(-0.5, 0.45, z0), P(0.5, 0.45, z0), P(0.5, 0.45, z1), P(-0.5, 0.45, z1), out)
  quadF(brick, P(0.5, 0, z0), P(0.5, 0.45, z0), P(0.5, 0.45, z1), P(0.5, 0, z1), along)
  quadF(brick, P(-0.5, 0, z0), P(-0.5, 0.45, z0), P(-0.5, 0.45, z1), P(-0.5, 0, z1), [-along[0], -along[1], 0])
  quadF(brick, P(-0.5, 0, z1), P(0.5, 0, z1), P(0.5, 0.45, z1), P(-0.5, 0.45, z1), [0, 0, 1])
}
type Wall = { f: Face; c: number; u0: number; u1: number; n: number }
const WALLS: Wall[] = [
  { f: 'S', c: Y0, u0: X0, u1: X1, n: 15 },
  { f: 'N', c: Y1, u0: X0, u1: X1, n: 15 },
  { f: 'E', c: X1, u0: Y0, u1: Y1, n: 10 },
  { f: 'W', c: X0, u0: Y0, u1: Y1, n: 10 },
]
const PAV = 6.6 // the south pavilion's half-width
for (const w of WALLS) {
  const corner = 2.2, bay = (w.u1 - w.u0 - 2 * corner) / w.n
  for (let i = 0; i < w.n; i++) {
    const a = w.u0 + corner + i * bay, b = a + bay, m = (a + b) / 2
    const inPav = w.f === 'S' && Math.abs(m) < PAV
    // ground storey: storefront glazing between stone piers
    if (!inPav) rectOn(win, w.f, w.c, a + 0.7, b - 0.7, 0.5, GROUND - 0.3)
    if (inPav) continue
    // a bold brick pier at the bay's start, standing proud of the wall up to the frieze
    if (i > 0) pier(w.f, w.c, a)
    // three storeys of paired windows, the panelled spandrels pale over them
    rectOn(win, w.f, w.c, a + 0.75, b - 0.75, GROUND + 1.3, FRIEZE - 1.0)
    for (const z of SPANDRELS) rectOn(trim, w.f, w.c, a + 0.75, b - 0.75, z - 0.45, z + 0.45, 0.09)
    // the frieze's grille panel
    rectOn(win, w.f, w.c, a + 0.9, b - 0.9, FRIEZE - 0.5, CORN - 0.25)
  }
}

// ─── the south pavilion ───
{
  const y0 = Y0 - 0.8, PT = 24.2
  box(brick, -PAV, PAV, y0, Y0 + 2, GROUND + 0.8, PT, 0, null)
  box(trim, -PAV, PAV, y0, Y0 + 2, 0, GROUND + 0.8, 0, null)
  // deep cornice on brackets, and the low gable over it
  box(trim, -PAV - 2.2, PAV + 2.2, y0 - 2.4, Y0 + 3, PT, PT + 1.1, 0.4, roof, true)
  const gz = PT + 1.1, gh = 1.6, gy0 = y0 - 1.6, gy1 = Y0 + 2.5
  const L: V3 = [-PAV - 1.4, gy0, gz], R: V3 = [PAV + 1.4, gy0, gz], A: V3 = [0, gy0, gz + gh]
  const L2: V3 = [-PAV - 1.4, gy1, gz], R2: V3 = [PAV + 1.4, gy1, gz], A2: V3 = [0, gy1, gz + gh]
  triF(brick, L, R, A, [0, -1, 0]); triF(brick, L2, R2, A2, [0, 1, 0])
  quadF(trim, L, A, A2, L2, [-0.3, 0, 1]); quadF(trim, A, R, R2, A2, [0.3, 0, 1])
  // the brackets: two bold piers carried up under the cornice
  for (const [b0, b1] of [[-PAV, -PAV + 2.0], [PAV - 2.0, PAV]]) box(trim, b0, b1, y0 - 1.4, y0, PT - 3.2, PT, 0, null, true)
  // fanlight, name panel, the three storeys of windows, the entrance
  polyOn(trim, 'S', y0, archPts(-3.6, 3.6, 18.4, 19.4, 10), 0.03)
  polyOn(win, 'S', y0, archPts(-2.6, 2.6, 19.4, 19.4, 10), 0.07)
  rectOn(trim, 'S', y0, -3.4, 3.4, 16.4, 17.8, 0.05)
  rectOn(win, 'S', y0, -3.6, 3.6, GROUND + 1.3, 15.6)
  for (const z of SPANDRELS) rectOn(trim, 'S', y0, -3.6, 3.6, z - 0.45, z + 0.45, 0.09)
  rectOn(win, 'S', y0, -3.0, 3.0, 0.3, 4.4)
  // the entrance canopy
  box(trim, -5.9, 5.4, y0 - 3.0, y0, 4.6, 5.4, 0.15, roof, true)
}

const parts = [
  { part: brick, material: finish('st-james-brick', 0xe3d6bd) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: { ...PALETTE.window, color: 0x5a7880 } },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('St. James Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 26.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/326826326'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-st-james-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
