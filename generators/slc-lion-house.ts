/**
 * Lion House (1856, Truman O. Angell), 63 East South Temple, Salt Lake City:
 * Brigham Young's family house, west of the Beehive House. Procedural,
 * CC0-1.0. bun generators/slc-lion-house.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/33167751 (-111.8889947, 40.7697834). y = 0 is the
 * lowest ground under the outline (Mapterhorn: the walk along the west side,
 * which the terrain shows about 1 m below the South Temple front); the
 * front ground stands about 1.0 m higher (terrain grid), so the front door,
 * the stone bay and the sills start at G = 1.0.
 *
 * Form, from the photos: a long two-and-a-half-storey stuccoed house, its
 * steep gable end to South Temple, on a red sandstone basement. On the
 * front, east of centre, the projecting grey stone bay with tan sandstone
 * pilasters, a bay window and the recumbent lion on its parapet; the door
 * with its green awning east of it; green shutters on every front window.
 * Along both long sides a row of steep wall dormers ("20 gables for 20
 * small bedrooms", Wikipedia): ten a side, counted from p1 (west side). Grey slate roof, white bargeboards and eaves, two tall
 * pale chimneys breaking the front slopes (p1, p2). At the back a lower
 * wing fills the outline's north-east corner.
 *
 * Numbers: plan from OSM (outline 15 x 38.7 m; front wall at the outline).
 * Heights estimated from the photos (no published figures): sandstone base
 * 0.9 m above the front ground, eaves G + 6.0 (they cross the upper
 * floor's front windows, p1), ridge G + 13.2 (front gable about 44 degrees,
 * p1, p2, against the window heights), dormers 2.0 m wide with their eaves
 * at G + 8.0 and apex at G + 9.8, chimneys 2.5 m above the ridge. The
 * stone bay 3.4 m wide, projecting 1.2 m, parapet top G + 4.6 (p1, p2).
 * Left out: the iron fence, window muntins, the awning's scallops, the
 * gutters and downpipes.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Lion_House_-_Salt_Lake_City,_Utah_-_10_May_2020.jpg
 *     Beneathtimp, CC0 (south front and west side from the south-west)
 *  p2 https://commons.wikimedia.org/wiki/File:Lion_House_Brigham_Young.jpg and
 *  p3 https://commons.wikimedia.org/wiki/File:Lion_House_SLC.JPG
 *     Bobjgalindo, CC BY-SA 4.0 (the south front from the south; which file
 *     is which of the two is not certain, both 4:3 frames by this author)
 * Lidar: not used.
 * Doubts: the east side and the north end are seen in no modern photo
 * (the east side mirrors the west's dormers; the north end is plain); the
 * back wing's form is a guess from the outline. The dormer count is ten a
 * side from the published twenty gables; p1 shows about that many on the
 * west.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, gable, panel, poly, prism, rect, type Face } from './slc-beehive-house'

const stucco = new Part(), white = new Part(), roof = new Part(), win = new Part(), green = new Part(), sand = new Part()
const G = 1.0
const X0 = -7.6, X1 = 7.2, Y0 = -18.7, Y1 = 16.0
const ZE = G + 6.0, ZR = G + 13.2

function sash(face: Face, plane: number, u: number, z0: number, z1: number, w = 1.0, shutters = true) {
  panel(white, face, plane, u, w + 0.32, z0 - 0.15, z1 + 0.25, 'flat', 0.03)
  panel(win, face, plane, u, w, z0, z1, 'flat', 0.06)
  if (shutters) for (const s of [-1, 1]) panel(green, face, plane, u + s * (w / 2 + 0.33), 0.5, z0, z1, 'flat', 0.06)
}

// ------------------------------------------------------------ main block ---
prism(stucco, rect(X0, Y0, X1, Y1), 0, ZE, false)
// red sandstone basement, standing just proud of the stucco
prism(sand, rect(X0 - 0.08, Y0 - 0.08, X1 + 0.08, Y1 + 0.08), 0, G + 0.9, true)
// white eaves band along the long sides
box(white, X0 - 0.25, Y0 - 0.3, X0 + 0.3, Y1 + 0.3, ZE - 0.35, ZE, true)
box(white, X1 - 0.3, Y0 - 0.3, X1 + 0.25, Y1 + 0.3, ZE - 0.35, ZE, true)
gable(roof, stucco, X0, Y0, X1, Y1, ZE, ZR, 'y', 0.5)
// white bargeboards on both gable ends
{
  const xc = (X0 + X1) / 2, hw = (X1 - X0) / 2 + 0.5, dz = ((ZR - ZE) * 0.5) / ((X1 - X0) / 2)
  for (const [y, s] of [[Y0 - 0.55, -1], [Y1 + 0.55, 1]] as [number, number][]) for (const k of [-1, 1]) {
    const a: V3 = [xc + k * hw, y, ZE - dz], b: V3 = [xc, y, ZR + 0.05]
    poly(white, [a, b, [b[0], b[1], b[2] - 0.45], [a[0], a[1], a[2] - 0.45]], [0, s, 0])
    poly(white, [a, b, [b[0], b[1], b[2] - 0.45], [a[0], a[1], a[2] - 0.45]], [0, -s, 0])
  }
}
// the dormers: ten a side, steep gables rising off the wall
const pitch = (ZR - ZE) / ((X1 - X0) / 2)
for (let k = 0; k < 10; k++) {
  const y = -13.3 + k * 3.25, hw = 1.0, ze = G + 8.0, zr = G + 9.8
  const depth = (zr - ZE) / pitch + 0.3
  for (const side of [-1, 1]) {
    const xw = side < 0 ? X0 : X1, xin = xw - side * depth
    const [a, b] = side < 0 ? [xw, xin] : [xin, xw]
    prism(stucco, rect(a, y - hw, b, y + hw), ZE - 0.3, ze, false)
    gable(roof, null, a, y - hw, b, y + hw, ze, zr, 'x', 0.25)
    // the outer gable face, and its white bargeboard
    poly(stucco, [[xw, y - hw, ze], [xw, y + hw, ze], [xw, y, zr]], [side, 0, 0])
    const xo = xw + side * 0.27
    for (const s of [-1, 1]) {
      const p: V3 = [xo, y + s * (hw + 0.25), ze - 0.21], q: V3 = [xo, y, zr + 0.03]
      poly(white, [p, q, [q[0], q[1], q[2] - 0.3], [p[0], p[1], p[2] - 0.3]], [side, 0, 0])
    }
    const f: Face = side < 0 ? 'W' : 'E'
    sash(f, xw, y, G + 6.3, G + 7.6, 0.8, false)
    sash(f, xw, y, G + 1.7, G + 3.5, 0.95, false)
  }
}
// chimneys breaking the front slopes (p1, p2)
for (const [x, y] of [[-2.4, -15.0], [2.6, -11.4]]) {
  box(stucco, x - 0.65, y - 0.5, x + 0.65, y + 0.5, ZE + 1, ZR + 2.5)
  box(white, x - 0.78, y - 0.63, x + 0.78, y + 0.63, ZR + 2.5, ZR + 2.8, true)
}

// ------------------------------------------------------------ the front ---
// the stone bay with the lion
{
  const cx = 0.5, hw = 1.7, yb = Y0 - 1.2
  prism(sand, rect(cx - hw, yb, cx + hw, Y0), 0, G + 0.9, true)
  prism(stucco, rect(cx - hw, yb, cx + hw, Y0), G + 0.9, G + 3.9, false)
  // tan sandstone pilasters at the corners, the cornice and the parapet
  for (const s of [-1, 1]) box(sand, cx + s * hw - 0.35, yb - 0.08, cx + s * hw + 0.35, yb + 0.6, G + 0.9, G + 3.9)
  box(sand, cx - hw - 0.25, yb - 0.25, cx + hw + 0.25, Y0, G + 3.9, G + 4.15, true)
  box(white, cx - hw - 0.05, yb - 0.05, cx + hw + 0.05, Y0, G + 4.15, G + 4.6, true)
  panel(win, 'S', yb, cx, 1.9, G + 1.6, G + 3.5, 'flat', 0.06)
  panel(white, 'S', yb, cx, 2.3, G + 1.45, G + 3.65, 'flat', 0.03)
  for (const f of ['E', 'W'] as Face[]) panel(win, f, f === 'E' ? cx + hw : cx - hw, yb + 0.6, 0.5, G + 1.6, G + 3.5, 'flat', 0.06)
  // the lion, lying on the parapet facing south
  box(sand, cx - 0.75, yb + 0.2, cx + 0.55, yb + 0.85, G + 4.6, G + 5.1)
  box(sand, cx - 0.95, yb + 0.15, cx - 0.4, yb + 0.85, G + 4.6, G + 5.45)
}
// door with its green awning and steps, east of the bay
{
  const x = 3.9
  panel(white, 'S', Y0, x, 1.6, G + 0.85, G + 3.25, 'flat', 0.03)
  panel(sand, 'S', Y0, x, 1.1, G + 0.9, G + 3.0, 'flat', 0.06)
  poly(green, [[x - 0.95, Y0, G + 3.6], [x + 0.95, Y0, G + 3.6], [x + 0.95, Y0 - 1.3, G + 3.0], [x - 0.95, Y0 - 1.3, G + 3.0]], [0, -1, 1])
  for (const s of [-1, 1]) poly(green, [[x + s * 0.95, Y0, G + 3.6], [x + s * 0.95, Y0 - 1.3, G + 3.0], [x + s * 0.95, Y0 - 1.3, G + 2.7], [x + s * 0.95, Y0, G + 2.7]], [s, 0, 0])
  poly(green, [[x - 0.95, Y0 - 1.3, G + 3.0], [x + 0.95, Y0 - 1.3, G + 3.0], [x + 0.95, Y0 - 1.3, G + 2.7], [x - 0.95, Y0 - 1.3, G + 2.7]], [0, -1, 0])
  for (let k = 0; k < 3; k++) box(sand, x - 0.8, Y0 - 1.6 + k * 0.4, x + 0.8, Y0, 0, G + 0.3 * (k + 1) - 0.1)
}
sash('S', Y0, -4.6, G + 1.6, G + 3.4)
sash('S', Y0, 5.9, G + 1.6, G + 3.4)
sash('S', Y0, -4.3, G + 5.7, G + 7.2)
sash('S', Y0, 4.9, G + 5.7, G + 7.2)
sash('S', Y0, 0.5, G + 5.4, G + 6.5, 1.4, false)
sash('S', Y0, -1.3, G + 9.0, G + 10.1, 0.7)
sash('S', Y0, 1.5, G + 9.0, G + 10.1, 0.7)
// north end: two windows a floor
for (const x of [-3.5, 3.5]) { sash('N', Y1, x, G + 1.7, G + 3.5, 0.95, false); sash('N', Y1, x, G + 5.7, G + 7.2, 0.95, false) }

// ------------------------------------------------------ back wing (NE) ---
{
  const a = -2.2, b = X1, y0 = Y1, y1 = 20.0, ze = G + 4.2
  prism(stucco, rect(a, y0, b, y1), 0, ze, false)
  prism(sand, rect(a - 0.08, y0, b + 0.08, y1 + 0.08), 0, G + 0.6, true)
  gable(roof, stucco, a, y0 - 0.5, b, y1, ze, ze + 2.6, 'x', 0.3)
  for (const x of [0.2, 4.6]) sash('N', y1, x, G + 1.5, G + 3.2, 0.9, false)
}

// ---------------------------------------------------------------- output ---
// Colours from p1-p3: grey-beige stucco, white trim, grey slate, dark green
// shutters and awning, red-tan sandstone (base, bay pilasters, lion, door).
const parts = [
  { part: stucco, material: finish('lion-stucco', 0xd3cfc0) },
  { part: white, material: PALETTE.trim },
  { part: roof, material: finish('lion-slate', 0x80868c) },
  { part: win, material: PALETTE.window },
  { part: green, material: finish('lion-shutter', 0x4f6a55) },
  { part: sand, material: finish('lion-sandstone', 0xb99d82) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Lion House', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ZR + 2.8,
})
await Bun.write(new URL('../models/slc-lion-house.glb', import.meta.url), glb)
console.log(`slc-lion-house.glb: ${triangles} triangles, ${glb.length} bytes`)
