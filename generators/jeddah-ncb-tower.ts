/**
 * National Commercial Bank tower (now Saudi National Bank), Jeddah — original
 * procedural geometry, CC0-1.0.
 * bun generators/jeddah-ncb-tower.ts
 *
 * Frame: north-up map frame (BEARING 0). Origin = centroid of the OSM
 * triangle way/174859870 (unnamed in OSM; it is the triangular tower beside
 * the "National Commercial Bank" node/4335383893 on King Abdulaziz Road,
 * Al-Balad, with the bank's cylindrical car park, way/194980939, to its
 * south-west).
 *
 * Evidence
 * - OSM way/174859870: a triangle with sides of 63–68 m (corners at local
 *   (-29.8, 19.1), (37.8, 17.1), (0.3, -36.4) from the bank node), with a
 *   narrow wedge cut into its west face near the ground (an entrance or
 *   mapping detail; not drawn).
 * - Published (Wikipedia "National Commercial Bank (Jeddah)"; SOM, Gordon
 *   Bunshaft, 1983): a triangular tower of about 126 m and 27 storeys, clad
 *   in solid travertine, its offices turned in to a central light well and
 *   lit through three seven-storey sky courts cut into the faces, two on one
 *   face and one on another.
 * - Commons photos, EVIDENCE:
 *   "National Commercial Bank, Jeddah.jpg" (Tahir mq, CC BY-SA 4.0) — one
 *     face square on: the middle sky court with its dark glazed back wall,
 *     the row of slot windows under the parapet, the corner slot, colour;
 *     https://commons.wikimedia.org/wiki/File:National_Commercial_Bank,_Jeddah.jpg
 *   "National commercial bank at night.JPG" (Ammar shaker, public domain) —
 *     the floodlit stone, the lit court and the lit corner slot;
 *     https://commons.wikimedia.org/wiki/File:National_commercial_bank_at_night.JPG
 *
 * Estimated: height 126 m (published, rounded); the courts 29 m wide and
 * 31–33 m (7 storeys) tall, 14 m deep, their glazed back walls dark; the middle
 * court 44–77 m on the north face (photo: from 0.34 to 0.62 of the height,
 * left of centre); the lower and upper courts 12–43 m and 76–107 m
 * on the south-east face, which no licensed photo shows — the published
 * arrangement is followed; the slot row at 118–121 m, just under the roof; 2 m chamfered corners
 * carrying full-height window slots. Travertine sampled at #aa917a in shade
 * in the evening photo, drawn as a pale travertine beige (#dac7a9).
 *
 * Doubts: only one daylight photo, of one face. Which face carries which
 * court is from the published description, not seen; the third face is
 * drawn plain. The OSM wedge on the west face is left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { oq, ot, projector, triCount, type P2 } from './riyadh-kingdom-centre'

const BEARING = 0
const NODE = { lng: 39.1821198, lat: 21.4880816 }
// OSM outer triangle corners (local metres from the bank node); centroid → origin
const TRI0: P2[] = [[-29.8, 19.1], [0.3, -36.4], [37.8, 17.1]] // CCW
const C: P2 = [(TRI0[0][0] + TRI0[1][0] + TRI0[2][0]) / 3, (TRI0[0][1] + TRI0[1][1] + TRI0[2][1]) / 3]
const TRI: P2[] = TRI0.map(([x, y]) => [x - C[0], y - C[1]])
const kx = 111320 * Math.cos((NODE.lat * Math.PI) / 180)
const ANCHOR = { lng: NODE.lng + C[0] / kx, lat: NODE.lat + C[1] / 110574 }
void projector

const H = 126, CH = 2.0, D = 14
const stone = new Part(), glass = new Part(), roof = new Part()
const flood = (p: V3, n: V3) => (Math.abs(n[2]) < 0.5 ? Math.max(0.2, 0.9 - p[2] / 200) : 0)

// The hexagon: each triangle edge shortened by the chamfer at both ends.
type Face = { a: P2; b: P2; n: V3; t: P2; L: number }
const faces: Face[] = []
for (let i = 0; i < 3; i++) {
  const p = TRI[i], q = TRI[(i + 1) % 3], L0 = Math.hypot(q[0] - p[0], q[1] - p[1])
  const t: P2 = [(q[0] - p[0]) / L0, (q[1] - p[1]) / L0]
  const a: P2 = [p[0] + t[0] * CH * 1.7, p[1] + t[1] * CH * 1.7], b: P2 = [q[0] - t[0] * CH * 1.7, q[1] - t[1] * CH * 1.7]
  faces.push({ a, b, t, n: [t[1], -t[0], 0], L: L0 - 2 * CH * 1.7 })
}
// which face is which: the one whose outward normal points most north, and most south-east
const north = faces.reduce((m, f) => (f.n[1] > m.n[1] ? f : m))
const southEast = faces.reduce((m, f) => (f.n[0] - f.n[1] > m.n[0] - m.n[1] ? f : m))
const COURTS = new Map<Face, [number, number, number][]>([
  [north, [[44, 77, -0.12]]], // [z0, z1, offset of the court centre along the face, as a fraction]
  [southEast, [[12, 43, 0], [76, 107, 0]]],
])
const CW = 29

const at = (f: Face, u: number, z: number, d = 0): V3 => [f.a[0] + f.t[0] * u - f.n[0] * d, f.a[1] + f.t[1] * u - f.n[1] * d, z]
/** A rectangle on face f (u0..u1, z0..z1), split into ≤ 5 m strips at the base so it drapes. */
function rect(p: Part, f: Face, u0: number, u1: number, z0: number, z1: number, d = 0, n: V3 = f.n) {
  const zs = z0 < 6 ? [z0, Math.min(z1, 6), z1].filter((z, i, s) => i === 0 || z > s[i - 1]) : [z0, z1]
  const nU = Math.max(1, Math.ceil((u1 - u0) / 5))
  const us = z0 < 6 ? Array.from({ length: nU + 1 }, (_, k) => u0 + ((u1 - u0) * k) / nU) : [u0, u1]
  for (let j = 0; j + 1 < zs.length; j++) {
    const uu = zs[j] < 6 ? us : [u0, u1]
    for (let i = 0; i + 1 < uu.length; i++) oq(p, at(f, uu[i], zs[j], d), at(f, uu[i + 1], zs[j], d), at(f, uu[i + 1], zs[j + 1], d), at(f, uu[i], zs[j + 1], d), n)
  }
}

for (const f of faces) {
  const courts = (COURTS.get(f) ?? []).map(([z0, z1, off]) => {
    const uc = f.L / 2 + off * f.L
    return { z0, z1, u0: uc - CW / 2, u1: uc + CW / 2 }
  })
  if (!courts.length) rect(stone, f, 0, f.L, 0, H)
  else {
    const { u0, u1 } = courts[0]
    rect(stone, f, 0, u0, 0, H)
    rect(stone, f, u1, f.L, 0, H)
    // the column between u0..u1, interrupted by the courts
    let z = 0
    for (const c of courts.sort((a, b) => a.z0 - b.z0)) {
      if (c.z0 > z) rect(stone, f, u0, u1, z, c.z0)
      // the recess: jambs, floor, ceiling, glazed back wall
      const tN: V3 = [f.t[0], f.t[1], 0]
      oq(stone, at(f, u0, c.z0), at(f, u0, c.z0, D), at(f, u0, c.z1, D), at(f, u0, c.z1), tN)
      oq(stone, at(f, u1, c.z0, D), at(f, u1, c.z0), at(f, u1, c.z1), at(f, u1, c.z1, D), [-tN[0], -tN[1], 0])
      oq(stone, at(f, u0, c.z0), at(f, u1, c.z0), at(f, u1, c.z0, D), at(f, u0, c.z0, D), [0, 0, 1])
      oq(stone, at(f, u0, c.z1, D), at(f, u1, c.z1, D), at(f, u1, c.z1), at(f, u0, c.z1), [0, 0, -1])
      rect(glass, f, u0, u1, c.z0, c.z1, D)
      // the glazing's spandrels: a few pale floor bands across the back wall (two-storey groups)
      for (let zz = c.z0 + 8.9; zz < c.z1 - 1; zz += 8.9) rect(stone, f, u0, u1, zz - 0.5, zz + 0.5, D - 0.06)
      z = c.z1
    }
    if (z < H) rect(stone, f, u0, u1, z, H)
  }
  // the row of slot windows under the parapet
  const nS = Math.floor((f.L - 6) / 2.6)
  for (let k = 0; k < nS; k++) {
    const u = 3 + (f.L - 6) * (k + 0.5) / nS
    rect(glass, f, u - 0.5, u + 0.5, 118, 121, -0.05)
  }
}
// The chamfered corners: travertine with a full-height window slot.
for (let i = 0; i < 3; i++) {
  const f = faces[(i + 2) % 3], g = faces[i]
  const p = f.b, q = g.a, n = (() => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l, 0] as V3 })()
  const Lc = Math.hypot(q[0] - p[0], q[1] - p[1]), t: P2 = [(q[0] - p[0]) / Lc, (q[1] - p[1]) / Lc]
  const P = (u: number, z: number, off = 0): V3 => [p[0] + t[0] * u + n[0] * off, p[1] + t[1] * u + n[1] * off, z]
  for (const [za, zb] of [[0, 6], [6, H]]) oq(stone, P(0, za), P(Lc, za), P(Lc, zb), P(0, zb), n)
  oq(glass, P(Lc * 0.3, 4, 0.05), P(Lc * 0.7, 4, 0.05), P(Lc * 0.7, H - 6, 0.05), P(Lc * 0.3, H - 6, 0.05), n)
}
// Roof: the hexagon.
{
  const hex: P2[] = []
  for (let i = 0; i < 3; i++) { hex.push(faces[i].a, faces[i].b) }
  for (let i = 1; i < 5; i++) ot(roof, [hex[0][0], hex[0][1], H], [hex[i][0], hex[i][1], H], [hex[i + 1][0], hex[i + 1][1], H], [0, 0, 1])
}

const parts = [
  { part: stone, material: { ...finish('ncb-travertine', 0xdac7a9), floodlight: flood } },
  { part: glass, material: { ...PALETTE.window, color: 0x56636e } },
  { part: roof, material: PALETTE.roof },
]
const triangles = triCount(parts)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('National Commercial Bank', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/174859870'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jeddah-ncb-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; anchor ${ANCHOR.lng.toFixed(7)} ${ANCHOR.lat.toFixed(7)}`)
