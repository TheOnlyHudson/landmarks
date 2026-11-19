/**
 * Belle Meade Plantation mansion, Nashville (1853, William Strickland's
 * circle for William Giles Harding) — original procedural geometry, CC0-1.0.
 * bun generators/nash-belle-meade.ts
 *
 *
 * Map frame: x, y, z up, metres, turned to bearing 45.5, so +y points out
 * of the front (north-east) and +x toward the east side wing. Anchor =
 * area centroid of OSM way/433265447, 36.105650, -86.864646 (the museum
 * node/1962183701 sits on it). y = 0 is the lowest ground under the
 * footprint (the rear, lidar 1.3 m above the box's ground_min); the front
 * lawn is ~0.6 m higher.
 *
 * Identity: the two-storey pale stucco house behind the full-width front
 * veranda of six square limestone columns, its flat entablature and
 * blocking course with the low raised centre and shell acroterion; grey
 * louvred shutters at every window; the low red hipped roof; behind, the
 * lower galleried rear wing and the gabled rear block.
 *
 * Evidence:
 *  - plan: OSM way/433265447 (main block x -12.7..7.8, y -1.1..16.4 with
 *    the veranda inside it; the east side wing; the rear wing to y -21.8).
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid:
 *    main eaves 10.3-10.6, chimneys ~15.8; the lidar also reads a ridge
 *    of 14.3 running front to back, but no photo shows a roof above the
 *    blocking course, so the main roof is drawn as a low hip with a flat
 *    top at 11.0, hidden behind it (lead review); rear wing eaves ~8.5, ridges 10.1-10.4; east wing
 *    ~10.3; its porch roof ~4.9. Measured.
 *  - column, entablature, window and door heights: scaled from
 *    dwhartwig's square front view (Belle Meade Plantation - 14) between
 *    the veranda floor and the lidar cornice (estimated). Six columns,
 *    evenly spaced, end columns at the corners (photo).
 *  - colours from the dwhartwig photos: off-white stucco, grey-tan
 *    limestone, grey shutters, dark red doors, red standing-seam roofs.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Belle Meade Plantation - 14, 12, 13, 28, dwhartwig, CC BY 2.0
 *    (front; front and west corner; west side with the galleries; side of
 *    the main block) https://commons.wikimedia.org/wiki/File:Belle_Meade_Plantation_-_14.jpg
 *  - BelleMeadePlantation.JPG, NatureBoyMD, public domain (front from the
 *    drive) https://commons.wikimedia.org/wiki/File:BelleMeadePlantation.JPG
 *  - USGS NAIP (public domain): plan and roof colour.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; doors are `entrance`; the veranda and front wall
 * carry floodlight (assumed).
 *
 * Left out: capitals' mouldings, the iron balcony railing (a solid slab),
 * gallery balustrades (solid bands), the urns, the lettering in the frieze.
 *
 * Doubts: the east side wing and its porch and the back of the rear block
 * are unphotographed here (lidar and OSM only). The lidar's 4 m hip rise
 * is not visible in the ground-level photos; the roof follows the photos
 * and is kept below the blocking course, so from above it is lower than
 * measured. The galleried connector is simplified to one gallery on its
 * west side.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, save, capPoly, type XY } from './atl-westin-peachtree-plaza'
import { prismV, block, triH, quadH, type Face } from './nash-ryman-auditorium'
import { wf, rect, chamfered, taper, type Side } from './nash-downtown-presbyterian'

const wall = new Part(), lime = new Part(), roof = new Part(), win = new Part(), shut = new Part(), door = new Part()

/** A flat convex shape (s, z outline) on a face, wound to face out. */
function shape(p: Part, f: Face, o: XY[], out = 0.06) {
  const c = o.reduce<XY>((m, q) => [m[0] + q[0] / o.length, m[1] + q[1] / o.length], [0, 0])
  const C = f.P(c[0], c[1], out), hint: V3 = [f.n[0], f.n[1], 0]
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; triH(p, C, f.P(a[0], a[1], out), f.P(b[0], b[1], out), hint) }
}
const R = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A shuttered window: glass, a pale stone lintel and the grey louvred shutters either side. */
function window(f: Face, s: number, w: number, z0: number, z1: number, o: { shutters?: boolean; lintel?: boolean; out?: number } = {}) {
  const out = o.out ?? 0
  if (o.lintel !== false) shape(lime, f, R(s - w / 2 - 0.25, s + w / 2 + 0.25, z1, z1 + 0.32), out + 0.05)
  shape(win, f, R(s - w / 2, s + w / 2, z0, z1), out + 0.06)
  if (o.shutters !== false) for (const k of [-1, 1]) shape(shut, f, R(s + k * (w / 2 + 0.05), s + k * (w / 2 + 0.05 + w * 0.5), z0, z1), out + 0.08)
}
/** A wall face's windows: bays at world coordinates along it, ground floor and upper floor. */
function bays(dir: Side, c: number, lo: number, hi: number, us: number[], g: [number, number], u: [number, number], w = 1.05) {
  const { f, s } = wf(dir, c, lo, hi)
  for (const x of us) { window(f, s(x), w, g[0], g[1]); window(f, s(x), w, u[0], u[1]) }
}

function build() {
  // ── Main block (model frame: +y out of the front, bearing 45.5) ──
  const X0 = -12.7, X1 = 7.8, Y0 = -1.1, WY = 12.6, YF = 16.4, CX = (X0 + X1) / 2
  const FL = 1.5, COL = 9.2, CORN = 10.2, CTOP = 10.55, RIDGE = 11.0
  const G: [number, number] = [1.7, 4.6], U: [number, number] = [6.3, 8.4]
  prism(wall, rect(X0, Y0, X1, WY), 0, CORN, wall, 0.05)
  prism(lime, rect(X0 - 0.05, Y0 - 0.05, X1 + 0.05, WY + 0.05), 0, 0.9, lime, 0.05) // water table
  // veranda floor, steps, the six square columns
  prism(lime, rect(X0, WY, X1, YF + 0.1), 0, FL, lime, 0.06)
  for (let i = 0; i < 3; i++) block(lime, CX - 1.9, CX + 1.9, YF + 0.1, YF + 0.1 + 0.55 * (i + 1), 0, FL - 0.42 * (i + 1) + 0.05)
  const cols = Array.from({ length: 6 }, (_, i) => X0 + 0.45 + (i * (X1 - X0 - 0.9)) / 5)
  for (const x of cols) {
    block(lime, x - 0.5, x + 0.5, YF - 0.95, YF + 0.05, FL, FL + 0.35)
    prism(lime, chamfered(x, YF - 0.45, 0.4, 0.4, 0.06), FL + 0.35, COL - 0.45, lime, 0.02)
    block(lime, x - 0.52, x + 0.52, YF - 0.97, YF + 0.07, COL - 0.45, COL)
  }
  // the return columns at the veranda's ends, against the house
  for (const x of [cols[0], cols[5]]) prism(lime, chamfered(x, WY + 0.5, 0.35, 0.35, 0.05), FL, COL, lime, 0.02)
  // the portico's entablature and cornice (the house walls end in a plain eave), the front blocking course
  prism(lime, rect(X0 - 0.12, WY - 0.3, X1 + 0.12, YF + 0.12), COL, CORN, lime, 0.04)
  prism(lime, rect(X0 - 0.5, WY - 0.3, X1 + 0.5, YF + 0.5), CORN, CTOP, lime, 0.12)
  block(lime, X0 - 0.3, X1 + 0.3, YF - 0.4, YF + 0.3, CTOP, 11.05)
  prismV(lime, [[CX - 4.6, CTOP], [CX + 4.6, CTOP], [CX + 4.6, 11.05], [CX, 11.75], [CX - 4.6, 11.05]], [1, 0], [0, 0], YF - 0.35, YF + 0.25)
  // the shell acroterion, as a half disc, and the corner acroteria
  const shell: XY[] = Array.from({ length: 9 }, (_, i) => [CX + 0.85 * Math.cos((Math.PI * i) / 8), 11.6 + 0.85 * Math.sin((Math.PI * i) / 8)])
  prismV(lime, [[CX + 1.0, 11.55], ...shell.slice(1, 8), [CX - 1.0, 11.55]], [1, 0], [0, 0], YF - 0.3, YF + 0.1)
  for (const x of [X0 + 0.5, X1 - 0.5]) prismV(lime, [[x - 0.5, 11.0], [x + 0.5, 11.0], [x, 11.6]], [1, 0], [0, 0], YF - 0.3, YF + 0.1)
  // low red hipped roof, kept below the blocking course so the front reads flat (photos); a flat top
  {
    const a = rect(X0 - 0.45, Y0 - 0.45, X1 + 0.45, YF - 0.45)
    const b = rect(CX - 2.5, Y0 + 3.0, CX + 2.5, YF - 3.5)
    taper(roof, a, b, CORN, RIDGE, roof)
    capPoly(roof, a, CORN, false)
  }
  // chimneys at the back of the block
  for (const x of [-6.2, 3.4]) {
    prism(wall, rect(x - 0.8, Y0 + 0.2, x + 0.8, Y0 + 1.1), 9.0, 15.5, wall, 0.04)
    prism(lime, rect(x - 0.92, Y0 + 0.08, x + 0.92, Y0 + 1.22), 15.5, 15.8, lime, 0.06)
  }

  // ── Windows and doors on the main block ──
  {
    const { f, s } = wf('N', WY, X0, X1)
    for (const d of [-6.1, -3.3, 3.3, 6.1]) { window(f, s(CX + d), 1.15, G[0], G[1]); window(f, s(CX + d), 1.05, U[0], U[1]) }
    // centre: the front door with its transom, the balcony door above
    shape(lime, f, R(s(CX) - 1.35, s(CX) + 1.35, FL, 5.6), 0.04)
    shape(door, f, R(s(CX) - 0.85, s(CX) + 0.85, FL, 4.6), 0.08)
    shape(win, f, R(s(CX) - 0.85, s(CX) + 0.85, 4.75, 5.3), 0.08)
    shape(door, f, R(s(CX) - 0.7, s(CX) + 0.7, 6.3, 8.2), 0.08)
    shape(win, f, R(s(CX) - 0.7, s(CX) + 0.7, 8.25, 8.6), 0.08)
    block(lime, CX - 1.4, CX + 1.4, WY, WY + 0.9, 6.0, 6.25)
    block(lime, CX - 1.4, CX + 1.4, WY + 0.75, WY + 0.9, 6.25, 7.1)
  }
  bays('W', X0, Y0, WY, [3.0, 8.4], G, U)
  bays('E', X1, Y0, WY, [2.6], G, U)
  bays('S', Y0, X0, X1, [-10.6], G, U)

  // ── East side wing and its porch ──
  prism(wall, rect(X1 - 0.2, 5.8, 13.8, 10.6), 0, 8.6, wall, 0.05)
  prism(lime, rect(X1 - 0.3, 5.7, 13.9, 10.7), 8.2, 8.8, lime, 0.08)
  prismV(wall, [[5.5, 8.8], [10.9, 8.8], [8.2, 10.1]], [0, 1], [0, 0], -14.1, -X1, roof)
  bays('E', 13.8, 5.8, 10.6, [8.2], [1.2, 3.9], [5.4, 7.4])
  {
    const PY0 = 10.6, PY1 = 13.2, PX1 = 15.2, PT = 4.6
    for (const [x, y] of [[9.0, PY1 - 0.2], [12.1, PY1 - 0.2], [PX1 - 0.2, PY1 - 0.2], [PX1 - 0.2, PY0 + 0.2]] as XY[]) block(wall, x - 0.15, x + 0.15, y - 0.15, y + 0.15, 0.4, PT)
    block(lime, X1, PX1, PY0 - 0.2, PY1, 0, 0.5)
    block(lime, X1, PX1 + 0.1, PY0 - 0.2, PY1 + 0.1, PT, PT + 0.35)
    block(wall, X1, PX1, PY1 - 0.1, PY1 + 0.05, PT + 0.35, PT + 1.25) // balcony rail as a solid band
    block(wall, PX1 - 0.15, PX1, PY0, PY1, PT + 0.35, PT + 1.25)
  }

  // ── Rear wing: the galleried connector, a small block by the house, the gabled rear block ──
  const RE = 8.5
  prism(wall, rect(-1.2, -13.3, 8.4, Y0 + 0.1), 0, RE, wall, 0.05)
  prismV(wall, [[-1.5, RE], [8.7, RE], [3.6, 10.1]], [1, 0], [0, 0], -13.3, Y0, roof)
  prism(wall, rect(-6.5, -5.0, -1.2, Y0 + 0.1), 0, 9.0, roof, 0.05)
  prism(wall, rect(-3.7, -21.8, 9.5, -13.3), 0, RE, wall, 0.05)
  prismV(wall, [[-22.1, RE], [-13.0, RE], [-17.55, 10.4]], [0, 1], [0, 0], -9.8, 4.0, roof)
  // two-storey gallery on the west side of the connector
  {
    const GX0 = -3.7, GX1 = -1.2, GY0 = -13.0, GY1 = -5.0
    for (let i = 0; i <= 3; i++) block(wall, GX0 + 0.05, GX0 + 0.3, GY0 + i * ((GY1 - GY0) / 3) - 0.12, GY0 + i * ((GY1 - GY0) / 3) + 0.12, 0.6, 8.2)
    block(lime, GX0, GX1, GY0, GY1, 0, 0.6)
    block(wall, GX0, GX1, GY0, GY1, 4.1, 4.4)
    for (const z of [0.6, 4.4]) block(wall, GX0, GX0 + 0.12, GY0, GY1, z + 0.1, z + 0.95)
    quadH(roof, [GX0 - 0.3, GY0 - 0.2, 8.2], [GX0 - 0.3, GY1 + 0.2, 8.2], [GX1, GY1 + 0.2, 8.9], [GX1, GY0 - 0.2, 8.9], [-0.3, 0, 1])
    triH(roof, [GX0 - 0.3, GY0 - 0.2, 8.2], [GX1, GY0 - 0.2, 8.9], [GX1, GY0 - 0.2, 8.2], [0, -1, 0])
    triH(roof, [GX0 - 0.3, GY1 + 0.2, 8.2], [GX1, GY1 + 0.2, 8.9], [GX1, GY1 + 0.2, 8.2], [0, 1, 0])
    quadH(roof, [GX0 - 0.3, GY0 - 0.2, 8.2], [GX0 - 0.3, GY1 + 0.2, 8.2], [GX1, GY1 + 0.2, 8.2], [GX1, GY0 - 0.2, 8.2], [0, 0, -1])
  }
  bays('W', -1.2, -13.3, Y0, [-11.2, -8.6, -6.2], [1.0, 3.5], [5.0, 7.2])
  bays('E', 8.4, -13.3, Y0, [-10.6, -6.8, -3.2], [1.0, 3.5], [5.0, 7.2])
  bays('W', -3.7, -21.8, -13.3, [-17.0], [1.0, 3.5], [5.0, 7.2])
  bays('E', 9.5, -21.8, -13.3, [-17.6], [1.0, 3.5], [5.0, 7.2])
  bays('S', -21.8, -3.7, 9.5, [-0.4, 2.9, 6.2], [1.0, 3.5], [5.0, 7.2])
  bays('W', -6.5, -5.0, Y0, [-3.0], [1.0, 3.5], [5.0, 7.2])
  for (const [x, y] of [[2.0, -1.6], [5.4, -13.8], [0.4, -21.0]] as XY[]) {
    prism(wall, rect(x - 0.6, y - 0.4, x + 0.6, y + 0.4), 7.0, 11.6, wall, 0.04)
    prism(lime, rect(x - 0.7, y - 0.5, x + 0.7, y + 0.5), 11.6, 11.85, lime, 0.05)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > WY - 0.5 ? 0.8 : 0)
  return [
    { part: wall, material: { ...finish('bellemeade-stucco', 0xe9e3da), floodlight: flood } },
    { part: lime, material: { ...finish('bellemeade-limestone', 0xc9c1b1), floodlight: flood } },
    { part: roof, material: finish('bellemeade-red-roof', 0xa9524b) },
    { part: win, material: PALETTE.window },
    { part: shut, material: finish('bellemeade-shutters', 0x86837d) },
    { part: door, material: { ...PALETTE.entrance, color: 0x6b3a33 } },
  ]
}

if (import.meta.main) {
  await save('nash-belle-meade', 'Belle Meade Plantation', build(), { height: 15.8, anchor: [36.10565, -86.864646], bearing: 45.5 })
}
