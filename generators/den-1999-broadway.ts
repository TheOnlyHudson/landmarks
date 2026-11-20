/**
 * 1999 Broadway (1985, Curtis W. Fentress / C.W. Fentress and Associates),
 * Denver — original procedural geometry, CC0-1.0.
 * bun generators/den-1999-broadway.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/52867977,
 * -104.9877924, 39.7477786. Bearing 0: the east face runs north–south and
 * the south-west face at 135°, as in OSM.
 *
 * Identity, in order:
 *  1. the wedge plan, and the folded dark-blue glass wall that steps around
 *     the back of Holy Ghost Church in eight vertical facets.  (shank, hgcc)
 *  2. the outer faces (south-west, east, the short ends) banded in tan
 *     spandrels and dark ribbon windows.               (fromrp, olp, migl)
 *  3. the teal glass slab that runs through the tower on its long axis: it
 *     shows as a full-height glass strip on the south-east corner and rises
 *     above the flat roof.                                 (migl, doodah)
 *  4. the open colonnade under the south-west face, giant columns carrying
 *     the tower over a recessed lobby.                     (hgcc, fromrp)
 *
 * Plan: the OSM outline way/52867977, used as drawn; its sawtooth on the
 * north-west is the folded glass wall (the lidar shows the same concave
 * curve). The slab is OSM's part way/528111541 (35 × 13.7 m, at 158°).
 * Note for the church's builder: in the same lidar the church
 * (way/304684780) stands about 4 m south-east of its OSM outline, while
 * this tower's outline matches the lidar.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read with
 * tools/lidar_frame.py; ground_min 1591.75 m, the site is flat (0.2–0.7 m).
 * Measured above y = 0 (0.4 m over ground_min): main roof 162.3, the glass
 * slab 166.2 (published 166 m / 43 floors: OSM, Wikipedia "1999 Broadway");
 * rooftop plant to ~169 (left out).
 *
 * Estimated: the colonnade's height (11 m, about three floors, from hgcc
 * against the church's tower) and depth (3 m), column spacing (~8 m); the
 * band rhythm: fromrp shows one dark ribbon and a broader pale spandrel per
 * floor (3.77 m floors); drawn as one broad dark band per three floors with
 * a tan spandrel between, so it stays horizontal without pinstriping at
 * phone size.
 *
 * Colour: the spandrels read tan-pink (olp, hgcc), a finish at the palette's
 * lightness; the ribbons the palette window; the folded wall dark blue
 * glass, pulled light but kept the darkest surface; the slab a teal glass
 * (window-2, from migl).
 *
 * Night: the office ribbons and the slab glow (window*). The folded wall
 * stays dark, its own unlit finish: at night it reads as black glass with
 * scattered lit floors, outlined by green lights on its folds and edges
 * ("1999Broadwayatnight.jpg", Xnatedawgx, CC BY-SA 3.0). The green edge
 * lights are left out.
 *
 * Photos (Wikimedia Commons, evidence):
 *  shank  "1999 Broadway in Denver Colorado.jpg", David Shankbone, CC BY 3.0
 *         (the folded glass wall over Holy Ghost Church, from the north-west)
 *  fromrp "1999 Broadway viewed from Republic Plaza.jpg", Tomasz Stasiuk,
 *         CC BY-SA 2.5 (south-west face and colonnade, from above)
 *  migl   "Denver IMG 20180416 160735.jpg", Alexander Migl, CC BY-SA 4.0
 *         (from Lincoln & 18th, south-east: the teal corner strip)
 *  hgcc   "HGCC&1999Broadway.jpg", Xnatedawgx, CC BY-SA 3.0 (the colonnade
 *         and the church, from the west)
 *  olp    "1999Broadway&One Lincoln Park.jpg", Xnatedawgx, CC BY-SA 3.0
 *  doodah "1999 Broadway (Denver, CO).jpg", Doodah67, public domain
 * No look-only sources. No commercial imagery.
 *
 * Left out: mullions, the "1999" lettering on a column, rooftop plant, the
 * low entrance canopies.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, panel, rows, save, walls, type XY } from './chi-aon-center'

const tan = new Part(), win = new Part(), blue = new Part(), teal = new Part(), roof = new Part()

const H = 162.3, SLAB = 166.2, COL = 11.0, FL = 3.77

// OSM outline, counter-clockwise from the north-west corner.
const outline: XY[] = [
  [-28.98, 19.16], [-36.80, 11.18], [4.21, -30.20], [11.82, -29.32], [17.82, -24.21], [18.28, 34.17],
  [6.52, 34.26], [8.49, 26.58], [6.83, 26.82], [5.58, 18.22], [4.45, 18.38], [-0.09, 11.43], [-1.05, 12.05],
  [-8.16, 8.27], [-8.60, 9.34], [-17.75, 8.49], [-17.46, 9.76], [-24.73, 12.70], [-24.57, 14.23],
]
const SW = 1 // index of the south-west face's start
const SAW0 = 6 // the folded glass runs from vertex 6 round to vertex 0

const isSaw = (i: number) => i >= SAW0
const isTealCorner = (i: number) => i === 2 || i === 3

// Under the colonnade the south-west wall stands back 3 m.
const RECESS = 3.0
const off = (p: XY, d: number): XY => {
  const a = outline[SW], b = outline[SW + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n: XY = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L] // inward (left of a counter-clockwise edge)
  return [p[0] + n[0] * d, p[1] + n[1] * d]
}
const lower = outline.map((p, i) => (i === SW || i === SW + 1 ? off(p, RECESS) : p))

const quad = (p: Part, a: XY, b: XY, z0: number, z1: number) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])

for (let i = 0; i < outline.length; i++) {
  const j = (i + 1) % outline.length
  const part = isSaw(i) ? blue : isTealCorner(i) ? teal : tan
  // the lower storey follows the recessed ring
  quad(i === SW ? win : part, lower[i], lower[j], 0, COL)
  quad(part, outline[i], outline[j], COL, H)
}
// Soffit over the colonnade, facing down.
{
  const a = outline[SW], b = outline[SW + 1], c = lower[SW + 1], d = lower[SW]
  tan.quad([a[0], a[1], COL], [d[0], d[1], COL], [c[0], c[1], COL], [b[0], b[1], COL])
  // columns: square, on the face line, ~8 m apart
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 8)
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1], u[0]]
  for (let q = 0; q <= k; q++) {
    const s = 0.9 + (L - 1.8) * q / k
    const c0: XY = [a[0] + u[0] * s + n[0] * 0.9, a[1] + u[1] * s + n[1] * 0.9]
    const r = 0.75
    const sq: XY[] = [[-r, -r], [r, -r], [r, r], [-r, r]].map(([x, y]) => [c0[0] + u[0] * x + n[0] * y, c0[1] + u[1] * x + n[1] * y] as XY)
    walls(tan, sq, 0, COL)
  }
}
// Roof: flat, inside a bevelled parapet lip.
cap(roof, outline, H)

// The slab: the corner strip is drawn in the outline's walls above; here it
// rises 3.9 m over the roof.
const slab: XY[] = [[-8.72, 3.42], [4.21, -29.15], [16.97, -24.16], [4.04, 8.42]]
// counter-clockwise check: reverse if needed
const sArea = slab.reduce((s, a, i) => { const b = slab[(i + 1) % 4]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const sring = sArea < 0 ? [...slab].reverse() : slab
walls(teal, sring, H - 0.2, SLAB)
cap(teal, sring, SLAB)

// Bands on the tan faces: three-floor groups, one ribbon across each face.
const groups = rows(COL + 0.6, H - 2.5, Math.round((H - 3.1 - COL) / (3 * FL)), 6.2)
for (let i = 0; i < outline.length; i++) {
  if (isSaw(i) || isTealCorner(i)) continue
  const a = outline[i], b = outline[(i + 1) % outline.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // one continuous ribbon per group across the face: the bands are the look
  const k = 1, pitch = L - 1.6
  for (let q = 0; q < k; q++) {
    const s0 = 0.8, s1 = 0.8 + pitch
    for (const [z0, z1] of groups) panel(win, a, b, s0, s1, z0, z1, 0.05)
    if (i !== SW) panel(win, a, b, s0, s1, 0.5, COL - 1.6, 0.05) // lobby glazing
  }
}
// The folded glass: a pale floor line every eight floors so the facets read
// as glass and not as a dark slab.
const trimLines: number[] = []
for (let z = COL + 8 * FL; z < H - 4; z += 8 * FL) trimLines.push(z)
for (let i = SAW0; i < outline.length; i++) {
  const a = outline[i], b = outline[(i + 1) % outline.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) continue
  for (const z of trimLines) panel(tan, a, b, 0, L, z, z + 0.7, 0.05)
}

await save('den-1999-broadway', '1999 Broadway', [39.7477786, -104.9877924], 0, [
  { part: tan, material: finish('b1999-spandrel', 0xd8c3ae) },
  { part: win, material: PALETTE.window },
  { part: blue, material: finish('b1999-folded-glass', 0x58728e) },
  { part: teal, material: windowVariant(2, 0x62918f) },
  { part: roof, material: PALETTE.roof },
])
