/**
 * Christ the Redeemer (Cristo Redentor), Corcovado, Rio de Janeiro:
 * procedural, CC0-1.0.
 * bun generators/rio-christ-the-redeemer.ts
 *
 * Model frame: x along the arms (to the statue's left), y the way the statue
 * faces, z up, metres. The placement's bearing (84) turns the statue to face
 * east-north-east over the city towards Sugarloaf, as the pedestal's outline
 * in OSM shows: its sides run 8 degrees off north-south and east-west
 * (way/105667349, the chapel inside the pedestal), and Sugarloaf lies at
 * bearing 86 from the summit. The origin is OSM's monument node
 * (node/4919986733, Q79961); y = 0 is the summit terrace.
 *
 * Built 1922-1931 (Paul Landowski, Heitor da Silva Costa, Albert Caquot,
 * face by Gheorghe Leonida): reinforced concrete clad in soapstone tiles.
 *
 * Published (Wikipedia, "Christ the Redeemer (statue)"): the statue 30 m,
 * on an 8 m pedestal; the arms 28 m wide; the head 3.75 m.
 * OSM maps no building here: the pedestal's outline is the chapel's room
 * (way/105667349, ~8.6 m square with cut corners), so `replaces` is empty.
 *
 * From photos. "Christ the Redeemer - Cristo Redentor.jpg" (Arne Müseler,
 * CC BY-SA 3.0 de) is a near-frontal telephoto view, scaled from the
 * published 28 m span (horizontal) and 30 m height (vertical): the arms' top
 * at 24.1 m (of 30), the shoulders broad and flat on the same line, the
 * hands at 23.7 m, the sleeves hanging to 20.1 m at
 * the body; the chin at 25.8 m; the cloak's hem at 6.4 m over the pleated
 * lower robe; the body 7.3 m wide at the shoulders, 6.6 m at the waist, 6.0 m
 * at the hem, the robe 5.9 m. The pedestal dark brown granite with cut
 * corners. "Christ the Redeemer 2.jpg" (PLBechly, CC BY-SA 4.0, from below):
 * the robe's broad vertical pleats, the cloak's front fold.
 * Details (drawn bold, as flat-shaded blocks, from the photos): the cloak's
 * vertical front edge on the statue's left, the sash across the chest from
 * its right shoulder to its left hip, the Sacred Heart, the nose and brow,
 * the hair falling behind to the shoulders, the feet below the hem, the
 * thumbs; the sleeves hang deeper toward the body.
 * Estimated: every depth (no side photo is square on: the body 4.2 m deep,
 * the robe 3.8 m, the sleeves 2.6 m, the head 3.3 m), the pleats' number
 * (fourteen), the hands' shape (a flat block), the hair.
 * Left out: the eyes and mouth, the folds' finer drapery, the chapel door, the lightning rods.
 *
 * Terrain: tools/terrain.ts could not check the site (Mapterhorn has no
 * z15 tiles here); the map stands the model on its own coarse summit, and
 * elevation stays 0.
 *
 * Night: the statue is floodlit white (a strong `floodlight` wash); the
 * pedestal is lit more softly.
 *
 * Photos (Wikimedia Commons):
 * - "Christ the Redeemer - Cristo Redentor.jpg", Arne Müseler, CC BY-SA 3.0 de (front, telephoto)
 * - "Christ the Redeemer-(Corcovado) front view2.jpg", Mucio Scorzelli, CC BY-SA 4.0 (from the air, front)
 * - "Christ the Redeemer 2.jpg", PLBechly, CC BY-SA 4.0 (from below)
 * - "Christ the Redeemer 1.jpg" and "3.jpg", PLBechly, CC BY-SA 4.0
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const stone = new Part(), pedestal = new Part()
const PED = 8 // pedestal height; the statue's feet stand on it

/** A rounded-rectangle section in the xy plane at height z (half-width a, half-depth b), n points. */
function section(a: number, b: number, z: number, n = 16, round = 0.55, cy = 0, flutes = 0, depth = 0): V3[] {
  // A superellipse: round = 0.5 is an ellipse, smaller is boxier.
  const e = 2 / (round * 4)
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * TAU, c = Math.cos(t), s = Math.sin(t)
    let r = 1
    if (flutes) r = 1 - depth * (0.5 - 0.5 * Math.cos(flutes * t))
    return [a * r * Math.sign(c) * Math.abs(c) ** e, cy + b * r * Math.sign(s) * Math.abs(s) ** e, z] as V3
  })
}
function loft(p: Part, rings: V3[][], capTop = true, capBottom = false) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
  const fan = (r: V3[], up: boolean) => {
    const c: V3 = [r.reduce((s, q) => s + q[0], 0) / n, r.reduce((s, q) => s + q[1], 0) / n, r.reduce((s, q) => s + q[2], 0) / n]
    for (let i = 0; i < n; i++) up ? p.tri(c, r[i], r[(i + 1) % n]) : p.tri(c, r[(i + 1) % n], r[i])
  }
  if (capTop) fan(rings[rings.length - 1], true)
  if (capBottom) fan(rings[0], false)
}

// ---------------------------------------------------------- the pedestal ---
// Dark granite, a square with cut corners, a plinth and a cornice.
{
  const ring = (h: number, z: number): V3[] => {
    const c = h * 0.72
    return [[h, -c], [h, c], [c, h], [-c, h], [-h, c], [-h, -c], [-c, -h], [c, -h]].map(([x, y]) => [x, y, z] as V3)
  }
  loft(pedestal, [ring(4.6, 0), ring(4.6, 0.7), ring(4.3, 0.9), ring(4.2, PED - 0.6), ring(4.4, PED - 0.4), ring(4.4, PED)], true)
}

// -------------------------------------------------------------- the body ---
// Heights measured up from the feet (the pedestal's top).
const Z = (h: number) => PED + h
// The pleated lower robe: fourteen broad pleats, widening a little to the feet.
loft(stone, [0, 1.5, 4.0, 6.0].map((h, k) => section([3.05, 3.0, 2.97, 2.95][k], 1.95, Z(h), 56, 0.45, 0.2, 14, 0.07)), false)
// The cloak's hem: a lip standing proud of the robe.
loft(stone, [section(3.35, 2.35, Z(5.9), 28, 0.42), section(3.35, 2.35, Z(6.6), 28, 0.42)], false)
// The cloaked body, widening to the shoulders.
loft(stone, [
  section(3.0, 2.05, Z(6.5), 28, 0.42),
  section(3.15, 2.1, Z(10.0), 28, 0.42),
  section(3.3, 2.15, Z(14.0), 28, 0.42),
  section(3.5, 2.15, Z(18.0), 28, 0.4),
  section(3.65, 2.1, Z(21.5), 28, 0.4),
  section(3.75, 2.05, Z(24.0), 28, 0.4),
  section(3.2, 1.8, Z(24.45), 28, 0.42),
  section(1.6, 1.4, Z(24.7), 28, 0.48),
], true)
// The neck and the hair falling to the shoulders.
loft(stone, [section(1.25, 1.3, Z(24.6), 16, 0.5, -0.2), section(1.1, 1.25, Z(26.0), 16, 0.5, -0.2)], false)

// -------------------------------------------------------------- the head ---
{
  // An egg: [half-width, half-depth, z] from the chin to the crown.
  const prof: [number, number, number][] = [[0.85, 1.1, 25.7], [1.22, 1.45, 26.6], [1.32, 1.6, 27.9], [1.25, 1.5, 29.0], [0.9, 1.15, 29.7], [0.4, 0.55, 30.0]]
  loft(stone, prof.map(([a, b, h]) => section(a, b, Z(h), 16, 0.5, 0.05)), true, true)
}

// -------------------------------------------------------------- the arms ---
// Each arm lofted along x: a sleeve hanging from the shoulder to the wrist,
// then the forearm and the open hand. Sections are in the yz plane.
function armSection(x: number, top: number, bottom: number, halfDepth: number, n = 12): V3[] {
  const zc = (top + bottom) / 2, hz = (top - bottom) / 2
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * TAU, c = Math.cos(t), s = Math.sin(t)
    const e = 0.75
    return [x, halfDepth * Math.sign(c) * Math.abs(c) ** e, Z(zc) + hz * Math.sign(s) * Math.abs(s) ** e] as V3
  })
}
for (const side of [1, -1]) {
  // [x out from the centre, top, bottom (heights), half depth]
  const S: [number, number, number, number][] = [
    [2.6, 24.4, 19.4, 1.55], [3.9, 24.4, 19.7, 1.5], [6.0, 24.3, 20.6, 1.4], [8.3, 24.2, 21.5, 1.3],
    [9.6, 24.15, 22.0, 1.3], [10.2, 24.1, 22.4, 1.2], [10.5, 24.0, 23.0, 0.7], [11.2, 24.0, 23.3, 0.62], [12.6, 23.95, 23.4, 0.62], [14.0, 23.85, 23.45, 0.45],
  ]
  const rings = S.map(([x, t, b, d]) => armSection(side * x, t, b, d))
  // Wind consistently whichever side: reverse each ring on the left arm.
  loft(stone, side > 0 ? rings : rings.map((r) => [...r].reverse()), true)
}

// ------------------------------------------------------------- details ---
// Flat-shaded boxes in the model frame, for the cloak's edges, the face and
// the hands: each from a centre, along two axes (u, w), with a depth (v,
// toward the viewer for the front details).
function block(c: V3, u: V3, w: V3, v: V3, hu: number, hw: number, hv: number) {
  const P = (a: number, b: number, d: number): V3 => [
    c[0] + u[0] * a * hu + w[0] * b * hw + v[0] * d * hv,
    c[1] + u[1] * a * hu + w[1] * b * hw + v[1] * d * hv,
    c[2] + u[2] * a * hu + w[2] * b * hw + v[2] * d * hv,
  ]
  const f = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const d of [1, -1]) {
    const q = f.map(([a, b]) => P(a, b, d))
    if (d > 0) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[3], q[2], q[1], q[0])
  }
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = f[i], [a1, b1] = f[(i + 1) % 4]
    stone.quad(P(a0, b0, -1), P(a1, b1, -1), P(a1, b1, 1), P(a0, b0, 1))
  }
}
const unit = (a: V3): V3 => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l] }
/** The body's front surface y at (x, height h), from the body's sections. */
function frontY(x: number, h: number) {
  const S: [number, number, number, number][] = [[6.5, 3.0, 2.05, 0.42], [10, 3.15, 2.1, 0.42], [14, 3.3, 2.15, 0.42], [18, 3.5, 2.15, 0.4], [21.5, 3.65, 2.1, 0.4], [24, 3.75, 2.05, 0.4]]
  let k = 0
  while (k < S.length - 2 && h > S[k + 1][0]) k++
  const t = Math.max(0, Math.min(1, (h - S[k][0]) / (S[k + 1][0] - S[k][0])))
  const a = S[k][1] + (S[k + 1][1] - S[k][1]) * t, b = S[k][2] + (S[k + 1][2] - S[k][2]) * t, rd = S[k][3]
  const e = 2 / (rd * 4)
  return b * Math.max(0, 1 - Math.abs(x / a) ** (2 / e)) ** (e / 2)
}
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], UP: V3 = [0, 0, 1]
// The cloak's open front edge: a vertical fold down the statue's left side
// of the chest (the viewer's right), from the shoulder to the hem.
for (let h = 6.6; h < 23.4; h += 2.8) {
  const h1 = Math.min(23.4, h + 2.8), x = 1.35, y = frontY(x, (h + h1) / 2)
  block([x, y + 0.2, Z((h + h1) / 2)], UP, X, Y, (h1 - h) / 2 + 0.3, 0.6, 0.38)
}
// The sash: the cloak drawn across the chest from the right shoulder down to
// the left hip, as a band standing proud.
{
  const a: [number, number] = [-3.0, 22.6], b: [number, number] = [1.2, 16.4], n = 4
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n
    const x0 = a[0] + (b[0] - a[0]) * t0, h0 = a[1] + (b[1] - a[1]) * t0, x1 = a[0] + (b[0] - a[0]) * t1, h1 = a[1] + (b[1] - a[1]) * t1
    const xm = (x0 + x1) / 2, hm = (h0 + h1) / 2, y = frontY(xm, hm)
    const along = unit([x1 - x0, 0, h1 - h0]), across = unit([-(h1 - h0), 0, x1 - x0])
    block([xm, y + 0.18, Z(hm)], along, across, Y, Math.hypot(x1 - x0, h1 - h0) / 2 + 0.45, 0.7, 0.4)
  }
}
// The Sacred Heart on the chest.
block([-0.35, frontY(-0.35, 21.4) + 0.1, Z(21.4)], UP, X, Y, 0.45, 0.4, 0.2)
// The face: the nose's ridge and the brow, and the hair falling behind to
// the shoulders.
block([0, 1.5, Z(27.6)], UP, X, Y, 0.65, 0.22, 0.25)
block([0, 1.42, Z(28.45)], X, UP, Y, 0.8, 0.14, 0.18)
block([0, -0.95, Z(26.6)], UP, X, Y, 2.0, 1.15, 0.45)
// The feet under the robe's hem, and the thumbs raised on the open hands.
for (const s of [-1, 1]) {
  block([s * 0.85, 2.05, Z(0.3)], X, Y, UP, 0.55, 0.55, 0.3)
  block([s * 12.3, 0.45, Z(24.15)], UP, X, Y, 0.45, 0.22, 0.2)
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the soapstone a warm pale grey; the pedestal
// dark brown granite, kept above charcoal.
const statueLit = (_p: V3, _n: V3) => 1
const pedLit = (_p: V3, n: V3) => (n[2] > 0.9 ? 0.2 : 0.55)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: stone, material: { ...finish('redeemer-soapstone', 0xd9d6cb), floodlight: statueLit } },
  { part: pedestal, material: { ...finish('redeemer-granite', 0x6e645b), floodlight: pedLit } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Christ the Redeemer', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 84, elevation: 0, height: 38,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/rio-christ-the-redeemer.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
