/**
 * Lucas Oil Stadium, Indianapolis (NFL, Indianapolis Colts, opened 2008,
 * HKS) — procedural, CC0-1.0, no textures.  bun generators/indy-lucas-oil-stadium.ts
 *
 * Map frame: turned to bearing 26°, the outline's long axis (OSM way/27258709
 * has its edges at 26° and 116°). +y points NNE, to the north end and its
 * window wall toward downtown; +x points ESE (116°), to Capitol Avenue and
 * the Andrew Jacobs post office. Anchor: the outline's area centroid. The plan is drawn symmetric
 * (OSM's quadrants agree within about 1 m).
 *
 * z = 0 is the street round the stadium (lidar: the street is level within
 * about 0.3 m all round). The field is below the street, but the roof is
 * drawn closed, so nothing inside shows and `elevation` stays 0, as for
 * Ford Field.
 *
 * Identity (from the photos below):
 *  1. The gabled end walls: a broad red-brick gable with pale limestone
 *     coping, stepped shoulders, and a huge window under a flat segmental
 *     arch in the middle.                                    (huge, car)
 *  2. The long grey roof: a raised two-slope central panel (the retractable
 *     part) over the field, with lower sloping side roofs crossed by
 *     dark steel trusses.                                   (NAIP, lidar)
 *  3. The brick podium with limestone bands, tall glazed bays and brick
 *     corner towers.                                         (june2012)
 *
 * Heights, all measured from the USGS lidar (USGS_LPC_IN_Central_MarionCo_
 * 2016_LAS_2018, flown 2016, 1 m), above the street:
 *   - central roof panel (x ±48, y ±92): eave ≈ 72, ridge 82.5 (OSM 82 ✓);
 *   - the end sections of that roof (y ±92 to ±125): about 4 m lower,
 *     eave 68, ridge 78.6 (OSM 80);
 *   - side roofs (x ±48 to ±102): slope from 57.5 inside to 46.6 at the
 *     outer wall (OSM's skillion 68 is too high);
 *   - trusses over the side roofs at y = 0, ±44, ±89: about 8–9 m above
 *     the roof they cross;
 *   - gable end walls (y ±125 to ±129): peak ≈ 80;
 *   - corner blocks at the ends ≈ 44–46; the brick podium ≈ 35;
 *   - the four brick towers on the long sides (x ±103, y ±58–73) ≈ 50.
 *
 * Evidence
 * - OSM (ODbL): outline way/27258709 (building=stadium), leisure area
 *   way/989245934, and its 34 building:parts way/1457664447… (see the
 *   catalog's `replaces`) for the part layout.
 * - USGS NAIP orthophoto: plan, the grey roof, five truss lines per side,
 *   "LUCAS OIL STADIUM" painted on the central roof (not drawn).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Lucas Oil Stadium is Huge.jpg", Paul Sableman (CC BY 2.0)
 *     https://commons.wikimedia.org/wiki/File:Lucas_Oil_Stadium_is_Huge.jpg
 *     — the gable end, its arched window, coping and stepped shoulders,
 *     the long side with its truss.
 *   - "Lucas Oil Stadium - June 2012 02.jpg", Jun Wang (CC BY-SA 2.0)
 *     https://commons.wikimedia.org/wiki/File:Lucas_Oil_Stadium_-_June_2012_02.jpg
 *     — a corner: brick tower with limestone bands, glazed bays, the red
 *     metal wall and the steel truss above.
 *   - "Lucas Oil Stadium from Car.jpg", F1reant (CC BY-SA 4.0)
 *     https://commons.wikimedia.org/wiki/File:Lucas_Oil_Stadium_from_Car.jpg
 *     — a gable end face on.
 * Estimated: the window (about 50 m wide, sill 20 m, springing 62 m, a
 * segmental head rising 8 m) and the shoulder heights, scaled from the
 * "Huge" photo against the lidar peak; window bays on the podium (9 m bays,
 * three rows). Both gables are drawn with the same window: the photos show
 * at least one end this way, and the north end's operable window wall is
 * published; which photo shows which end is not certain.
 * Not drawn: lettering, banners, the field and seats, the small rooftop
 * structures OSM maps on the central panel.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, triangulate, type XY } from './dc-nationals-park'

// One quadrant (x ≥ 0, y ≥ 0) of the outline, from OSM, averaged over the four quadrants.
const Q: XY[] = [
  [0, 129], [61, 129], [61, 122], [85, 122], [85, 119.5], [88.8, 119.5], [88.8, 115.5], [91.6, 115.5], [91.6, 94.5],
  [102.6, 94.5], [102.6, 72.8], [106.3, 72.8], [106.3, 58.6], [103.6, 58.6], [103.6, 39.2], [108, 39.2], [108, 4.2],
  [104.2, 4.2], [104.2, 0],
]
function mirrorRing(q: XY[]): XY[] {
  // q runs from the +y axis clockwise to the +x axis; build the whole ring counter-clockwise.
  const ne = q.slice(1, -1)
  const se = [...ne].reverse().map(([x, y]) => [x, -y] as XY)
  const sw = ne.map(([x, y]) => [-x, -y] as XY)
  const nw = [...ne].reverse().map(([x, y]) => [-x, y] as XY)
  return [...ne, q[q.length - 1], ...se, [0, -q[0][1]] as XY, ...sw, [-q[q.length - 1][0], 0] as XY, ...nw, q[0]].reverse()
}
const OUTLINE = mirrorRing(Q)

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), steel = new Part(), lid = new Part()

/** A box whose top slopes linearly in x (zt0 at x0, zt1 at x1); four walls and the top. */
function slopedBlock(x0: number, x1: number, y0: number, y1: number, zb: number, zt0: number, zt1: number, side: Part, top: Part) {
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  quad(side, [P(x0, y0, zb), P(x1, y0, zb), P(x1, y0, zt1), P(x0, y0, zt0)], [0, -1, 0])
  quad(side, [P(x0, y1, zb), P(x1, y1, zb), P(x1, y1, zt1), P(x0, y1, zt0)], [0, 1, 0])
  quad(side, [P(x0, y0, zb), P(x0, y1, zb), P(x0, y1, zt0), P(x0, y0, zt0)], [-1, 0, 0])
  quad(side, [P(x1, y0, zb), P(x1, y1, zb), P(x1, y1, zt1), P(x1, y0, zt1)], [1, 0, 0])
  quad(top, [P(x0, y0, zt0), P(x1, y0, zt1), P(x1, y1, zt1), P(x0, y1, zt0)], [0, 0, 1])
}

/**
 * Extrude a profile drawn in the x–z plane between y0 and y1. Faces of the
 * profile's rim pointing up (coping) go to `top`, the rest to `side`; the
 * two flat ends to `face`.
 */
function extrudeXZ(profile: XY[], y0: number, y1: number, side: Part, top: Part, face: Part) {
  const a2 = profile.reduce((s, a, i) => { const b = profile[(i + 1) % profile.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const ring = a2 < 0 ? [...profile].reverse() : profile // counter-clockwise in (x, z)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const out: V3 = [b[1] - a[1], 0, -(b[0] - a[0])]
    const l = Math.hypot(out[0], out[2])
    const part = out[2] / l > 0.3 ? top : side
    quad(part, [[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], out)
  }
  for (const [i, j, k] of triangulate(ring)) {
    const A = ring[i], B = ring[j], C = ring[k]
    quad(face, [[A[0], y1, A[1]], [B[0], y1, B[1]], [C[0], y1, C[1]], [C[0], y1, C[1]]], [0, 1, 0])
    quad(face, [[A[0], y0, A[1]], [B[0], y0, B[1]], [C[0], y0, C[1]], [C[0], y0, C[1]]], [0, -1, 0])
  }
}

// ---------------------------------------------------------------------------
// 1. The brick podium over the whole outline, 35 m, with a limestone cap.
const PODIUM = 33.8
prism(OUTLINE, 0, PODIUM, brick, null)
prism(OUTLINE, PODIUM, 35, stone, roof)
// a limestone base band
prism(OUTLINE.map(([x, y]) => [x * 1.003, y * 1.003] as XY), 0, 3.2, stone, null)

// 2. Side roofs: from 57.5 at x = ±48 down to 46.6 at x = ±102, over y ±92,
// and the narrow strip x ±48..±64 on to the gables.
for (const s of [1, -1]) {
  const xi = 48 * s, xo = 102 * s
  // outer wall under the eave is the red-brown metal of the upper bowl: brick finish
  slopedBlock(Math.min(xi, xo), Math.max(xi, xo), -92, 92, 34, s > 0 ? 57.5 : 46.6, s > 0 ? 46.6 : 57.5, brick, roof)
  const xm = 64 * s, zm = 57.5 - (10.9 * 16) / 54
  for (const t of [1, -1]) {
    const ya = 92 * t, yb = 125 * t
    slopedBlock(Math.min(xi, xm), Math.max(xi, xm), Math.min(ya, yb), Math.max(ya, yb), 34, s > 0 ? 57.5 : zm, s > 0 ? zm : 57.5, brick, roof)
  }
  // trusses: dark steel beams standing on the side roof, sloping with it
  for (const ty of [0, 44, -44, 89, -89]) {
    const w = 1.1, h = 6
    const z = (x: number) => 57.5 - (10.9 * (Math.abs(x) - 48)) / 54
    const x0 = 48 * s, x1 = 101.5 * s
    const P = (x: number, y: number, dz: number): V3 => [x, y, z(x) + dz]
    for (const [yy, ny] of [[ty - w, -1], [ty + w, 1]] as [number, number][]) quad(steel, [P(x0, yy, -0.2), P(x1, yy, -0.2), P(x1, yy, h * 0.75), P(x0, yy, h)], [0, ny, 0])
    quad(steel, [P(x0, ty - w, h), P(x1, ty - w, h * 0.75), P(x1, ty + w, h * 0.75), P(x0, ty + w, h)], [0, 0, 1])
    quad(steel, [P(x1, ty - w, -0.2), P(x1, ty + w, -0.2), P(x1, ty + w, h * 0.75), P(x1, ty - w, h * 0.75)], [s, 0, 0])
  }
}

// 3. The central roof: two slopes. Centre panel (the retractable part) over
// y ±92 at 72 → 82.5, end sections to y ±125 at 68 → 78.6.
function gableRoof(y0: number, y1: number, eave: number, ridge: number) {
  const X = 48
  // walls from the side roof up to the eave
  for (const s of [1, -1]) quad(roof, [[s * X, y0, 50], [s * X, y1, 50], [s * X, y1, eave], [s * X, y0, eave]], [s, 0, 0])
  // the two slopes, with a 0.8 m overhang
  const o = 0.8, dz = ((ridge - eave) / X) * o
  for (const s of [1, -1]) {
    const nrm: V3 = [s * (ridge - eave), 0, X]
    quad(lid, [[s * (X + o), y0, eave - dz], [s * (X + o), y1, eave - dz], [0, y1, ridge], [0, y0, ridge]], nrm)
  }
  // gable triangles at each end (the step between sections)
  for (const [y, ny] of [[y0, -1], [y1, 1]] as [number, number][])
    quad(roof, [[-X, y, eave], [X, y, eave], [0, y, ridge], [0, y, ridge]], [0, ny, 0])
}
gableRoof(-92, 92, 72, 82.5)
gableRoof(92, 125, 68, 78.6)
gableRoof(-125, -92, 68, 78.6)
// fascia under the centre panel's eave
for (const s of [1, -1]) quad(steel, [[s * 48.9, -92, 70.6], [s * 48.9, 92, 70.6], [s * 48.9, 92, 72.2], [s * 48.9, -92, 72.2]], [s, 0, 0])

// 4. Corner blocks at the ends (≈45 m) and the brick towers on the long sides (≈50 m).
for (const s of [1, -1]) for (const t of [1, -1]) {
  const x0 = Math.min(64 * s, 88 * s), x1 = Math.max(64 * s, 88 * s), y0 = Math.min(94 * t, 117 * t), y1 = Math.max(94 * t, 117 * t)
  prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 34, 44.2, brick, null)
  prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 44.2, 45.4, stone, roof)
  const tx0 = Math.min(96 * s, 106.3 * s), tx1 = Math.max(96 * s, 106.3 * s), ty0 = Math.min(58.6 * t, 72.8 * t), ty1 = Math.max(58.6 * t, 72.8 * t)
  prism([[tx0, ty0], [tx1, ty0], [tx1, ty1], [tx0, ty1]], 34, 48.8, brick, null)
  prism([[tx0, ty0], [tx1, ty0], [tx1, ty1], [tx0, ty1]], 48.8, 50, stone, roof)
}

// 5. The gable end walls, y ±125..±129: stepped shoulders (66) at x ±50..±61,
// then the gable from 70 at x ±50 to the 80 m peak, all under limestone coping.
const GABLE: XY[] = [[-61, 30], [61, 30], [61, 65], [50.5, 65], [50.5, 69.6], [0, 80.2], [-50.5, 69.6], [-50.5, 65], [-61, 65]]
for (const t of [1, -1]) {
  const ya = 125 * t, yb = 129 * t
  extrudeXZ(GABLE, Math.min(ya, yb), Math.max(ya, yb), brick, stone, brick)
  // coping lip: a thin limestone band just below the sloped top on the face
  const yf = yb + 0.06 * t, n: V3 = [0, t, 0]
  for (const s of [1, -1]) {
    quad(stone, [[s * 50.5, yf, 68], [0, yf, 78.6], [0, yf, 80.2], [s * 50.5, yf, 69.6]], n)
    quad(stone, [[s * 50.5, yf, 63.4], [s * 61, yf, 63.4], [s * 61, yf, 65], [s * 50.5, yf, 65]], n)
  }
  // the big window: 60 m wide, sill 22, springing 60, a segmental head rising 9 m
  const W = 25, z0 = 20, zs = 62, rise = 8
  const R = (W * W + rise * rise) / (2 * rise), zc = zs + rise - R
  const N = 12
  const head = (i: number): XY => {
    const a0 = Math.asin(W / R), a = -a0 + (2 * a0 * i) / N
    return [R * Math.sin(a), zc + R * Math.cos(a)]
  }
  const yw = yb + 0.08 * t
  // pale limestone surround, then the glass
  const sur = 1.6
  for (let i = 0; i < N; i++) {
    const [xa, za] = head(i), [xb, zb] = head(i + 1)
    const k = (R + sur) / R
    quad(stone, [[xa, yw - 0.02 * t, za], [xb, yw - 0.02 * t, zb], [xb * k, yw - 0.02 * t, zc + (zb - zc) * k], [xa * k, yw - 0.02 * t, zc + (za - zc) * k]], n)
    quad(win, [[xa, yw, zs], [xb, yw, zs], [xb, yw, zb], [xa, yw, za]], n)
  }
  for (const s of [1, -1]) quad(stone, [[s * W, yw - 0.02 * t, z0 - sur], [s * (W + sur), yw - 0.02 * t, z0 - sur], [s * (W + sur), yw - 0.02 * t, zs], [s * W, yw - 0.02 * t, zs]], n)
  quad(stone, [[-W - sur, yw - 0.02 * t, z0 - sur], [W + sur, yw - 0.02 * t, z0 - sur], [W + sur, yw - 0.02 * t, z0], [-W - sur, yw - 0.02 * t, z0]], n)
  // glass in three tall lights split by two limestone-clad piers
  const lights = [[-W, -8.9], [-7.7, 7.7], [8.9, W]]
  for (const [a, b] of lights) quad(win, [[a, yw, z0], [b, yw, z0], [b, yw, zs], [a, yw, zs]], n)
  for (const c of [-8.3, 8.3]) quad(stone, [[c - 0.6, yw - 0.02 * t, z0], [c + 0.6, yw - 0.02 * t, z0], [c + 0.6, yw - 0.02 * t, zs], [c - 0.6, yw - 0.02 * t, zs]], n)
}

// 6. Window bays on the podium: broad glazed panels in brick piers, three rows.
function bays(a: XY, b: XY, bay: number, rows: [number, number][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 7) return
  const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nrm: V3 = [e[1], -e[0], 0]
  const n = Math.max(1, Math.round(L / bay))
  for (let i = 0; i < n; i++) {
    const u0 = (L / n) * i + 1.4, u1 = (L / n) * (i + 1) - 1.4
    const q = (u: number, z: number): V3 => [a[0] + e[0] * u + nrm[0] * 0.06, a[1] + e[1] * u + nrm[1] * 0.06, z]
    for (const [r0, r1] of rows) quad(win, [q(u0, r0), q(u1, r0), q(u1, r1), q(u0, r1)], nrm)
  }
}
{
  const a2 = OUTLINE.reduce((s, p, i) => { const q = OUTLINE[(i + 1) % OUTLINE.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const r = a2 < 0 ? [...OUTLINE].reverse() : OUTLINE
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const gableFace = Math.abs(a[1]) > 128 && Math.abs(b[1]) > 128
    // under the big window: two rows only, kept to either side of the window's sill
    bays(a, b, 11, gableFace ? [[4.5, 19]] : [[4.5, 16], [19.5, 31]])
  }
}
// the corner towers and corner blocks: one tall glazed slot per outer face
for (const s of [1, -1]) for (const t of [1, -1]) {
  const x = 106.36 * s
  quad(win, [[x, 62.6 * t, 36], [x, 68.8 * t, 36], [x, 68.8 * t, 46.5], [x, 62.6 * t, 46.5]], [s, 0, 0])
  const y = 117.06 * t
  for (const c of [70, 82]) quad(win, [[(c - 3.5) * s, y, 36.5], [(c + 3.5) * s, y, 36.5], [(c + 3.5) * s, y, 42.5], [(c - 3.5) * s, y, 42.5]], [0, t, 0])
}
// the red metal wall under the side eaves: a glazed band
for (const s of [1, -1]) {
  const x = 102.06 * s
  for (let k = 0; k < 6; k++) {
    const y0 = -88 + k * 29.3 + 3, y1 = y0 + 23.3
    quad(win, [[x, y0, 38], [x, y1, 38], [x, y1, 43.2], [x, y0, 43.2]], [s, 0, 0])
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: finish('lucas-oil-brick', 0xad705e) },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: lid, material: finish('lucas-oil-roof', 0xb9c0c5) },
  { part: win, material: PALETTE.window },
  { part: steel, material: finish('lucas-oil-steel', 0x66717c) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Lucas Oil Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 26, osm: 'way/27258709', height: 82.5,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/indy-lucas-oil-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
