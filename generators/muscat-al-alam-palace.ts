/**
 * Al Alam Palace, Muscat (1972; Shapoorji Pallonji): procedural, CC0-1.0.
 * bun generators/muscat-al-alam-palace.ts
 *
 * Uses the shared kit exported by muscat-sultan-qaboos-grand-mosque.ts.
 *
 * Frame: turned to bearing 13.7, so model x runs along the palace's long
 * axis (OSM edges at 103.7 degrees) and the ceremonial front faces model -y
 * (193.7, south-south-west), down the forecourt (Wikipedia: the palace
 * stands at the north end of the plaza). Anchor: the centroid of OSM
 * way/66645876, the palace building, 58.5947265, 23.6159692. way/66647557
 * (historic=castle) is the compound wall and is not a building.
 *
 * Plan (OSM way/66645876, measured in the turned frame): the central
 * pavilion over x -22.3..18.5 (its 40 m rectangle runs back to y 27.3), the
 * front at y -16; the west wing x -76..-22 with its south edge stepping
 * back to the west; the east wing x 18.5..75. The pavilion's axis, x 0.4,
 * lies between the two semicircular planters OSM draws either side of the
 * gate (x -7 and 12.4) and the 40 m rectangle's centre (-1.8).
 *
 * Pavilion (all photo-scaled from c11, frontal, with the planters' 19.4 m
 * as the scale, and c50 for the sides; lead review round 1 scaled it up to
 * about twice the wings' height, as c11 shows): a 46 m square slab roof,
 * 4.6 m deep (lower band, brown dentil band with white dentils, upper band,
 * a gold top edge) with its underside at 21 m; on four flared columns a
 * side at 10.5 m centres (31.5 m square), 1.8 m shafts swelling from
 * 11.5 m into trumpet capitals 10 m across that nearly touch under the
 * slab; the bays between them tall pointed arches (crown 19.6 m) with
 * dark lattice windows and a white balcony ledge. Front columns: cobalt-turquoise at the corners, gold in the
 * middle pair at +-4.6 m (c11); the sides and back: turquoise corners, white
 * middles (c50, c15). Between them the white body, its bays tall round-
 * headed recesses with screened windows and a balcony ledge; the front
 * middle bay a pointed portal with a lattice, a gold door and a bowl
 * balcony (c11, c41). A 3 m podium (c50). The flagpole, about 15 m above
 * the roof (c11).
 * Wings (c50, c15, c22): two storeys, cornice slab at 9.8-11.5 m above a 3 m
 * podium, a colonnade of smaller flared columns on the forecourt side
 * (white, turquoise at the ends), round-headed windows; a dark brown block
 * either side of the pavilion (c11, c50).
 *
 * Colour (sampled; pulled to the palette's lightness): turquoise #4fb3c8
 * (c11 #1d8da0, #1499b2; c50 #4194a0), gold #d9ab3e (c11 #c89a23, #bf8c1f),
 * white #f2e9d8 (c50 sunlit #f2dfc2), brown #6b4f3e (c11 #534339, c50
 * #4e392a: the side blocks, the dentil band and the portal lattice), podium
 * #dcc0a0 (c11 #dbb889), windows the palette's slate (dark mosaic grids).
 * Night: the palace is floodlit (c82, c39): white, turquoise and gold carry
 * _FLOODLIGHT, windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons, Category:Qasr Al Alam Royal Palace):
 * - c11 "Al Alam Palace I. Sultan's Ceremonial Residence", Andrew Moore, CC BY-SA 2.0 (frontal)
 * - c50 "Palacio de Al Alam, Mascate, Omán, 2024-08-14, DD 36", Diego Delso, CC BY-SA 4.0 (front and east side, east wing, podium)
 * - c15 "Alam Palace Muscat.JPG", Shoestring (Wikitravel shared), public domain (east side)
 * - c22 "Dunst Oman scan0118", Bernhard Dunst, CC BY-SA 4.0 (oblique)
 * - c41 "Oman-Muscat-16-Sultans-Palace-3", Ian Sewell, CC BY 2.5 (gold columns, portal)
 * - c82 "Al Alam Palace- Muscat", M.Mutta, CC BY-SA 3.0 (night)
 * Facts: https://en.wikipedia.org/wiki/Al_Alam_Palace
 * Look-only: none.
 *
 * Doubts: no published dimensions: every size is scaled from photos; the
 * back (harbour) side and the far ends of the wings are not photographed
 * and drawn like the sides; the wings' plan is simplified to three convex
 * prisms; the podium height varies with the ground in reality.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  box, boxFaces, bays, lathe, panel, plane, prism, quad, setShift, wallBand, TAU,
  type Plane, type P2,
} from './muscat-sultan-qaboos-grand-mosque'

type Mats = { white: Part; blue: Part; gold: Part; brown: Part; pink: Part; win: Part }
const CX = 0.4, CY = 4.0 // pavilion centre
const PB = 3 // podium top

/** A flared (trumpet) column from z0 to z1, shaft radius r, capital radius R from zf. */
function column(p: Part, D: boolean, x: number, y: number, z0: number, zf: number, z1: number, r: number, R: number) {
  const n = D ? 20 : 8, k = D ? 9 : 4
  const prof: P2[] = [[r * 1.15, z0], [r, z0 + 0.7], [r, zf]]
  for (let i = 1; i <= k; i++) {
    const t = i / k
    prof.push([r + (R - r) * Math.pow(t, 2.6), zf + (z1 - zf) * t])
  }
  prof.push([R, z1 + 0.25], [0, z1 + 0.25])
  lathe(p, x, y, prof, n, { smooth: true })
}

/** The pavilion's deep slab roof: soffit, lower band, brown dentil band (white dentils in detail), upper band, gold top edge. */
function slab(M: Mats, D: boolean, x0: number, x1: number, y0: number, y1: number, zb: number) {
  const z1 = zb + 1.3, z2 = z1 + 1.2, z3 = z2 + 1.5, H = z3 + 0.6
  box(M.white, null, x0 + 0.6, x1 - 0.6, y0 + 0.6, y1 - 0.6, zb, z1, 0, M.white)
  box(M.brown, null, x0 + 0.3, x1 - 0.3, y0 + 0.3, y1 - 0.3, z1, z2)
  box(M.white, null, x0, x1, y0, y1, z2, z3, 0, M.white)
  box(M.gold, M.white, x0, x1, y0, y1, z3, H)
  if (D) for (const [pl, L] of boxFaces(x0 + 0.3, x1 - 0.3, y0 + 0.3, y1 - 0.3)) {
    const n = Math.floor(L / 1.2)
    for (let i = 0; i < n; i++) {
      const s = (L - (n - 1) * 1.2) / 2 + i * 1.2
      const a = at3(pl, s - 0.25, 0), b = at3(pl, s + 0.25, 0.32)
      box(M.white, null, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z1 + 0.15, z2 - 0.1, 0, M.white)
    }
  }
  return H
}
const at3 = (pl: Plane, s: number, d: number): P2 => [pl.o[0] + pl.t[0] * s + pl.n[0] * d, pl.o[1] + pl.t[1] * s + pl.n[1] * d]

// Pavilion dimensions (lead review round 1: scaled up against the wings to
// c11's proportions, about twice their height): columns at 10.5 m centres,
// 31.5 m square; capitals 10 m across nearly touching under the slab; the
// slab 46 m square and 4.6 m deep, its underside at 21 m.
const U = [-15.75, -5.25, 5.25, 15.75], ZS = 21, CAP = 5.0
function pavilion(M: Mats, D: boolean) {
  const seg = D ? 8 : 4
  box(M.pink, M.pink, -22.3, 18.5, -16.5, 27.3, 0, PB)
  // body, its three tall pointed bays a side
  const b = 14.2
  box(null, M.white, CX - b, CX + b, CY - b, CY + b, PB, ZS)
  boxFaces(CX - b, CX + b, CY - b, CY + b).forEach(([pl, L], f) => {
    const ops = [-10.5, 0, 10.5].map((u) => {
      const c = L / 2 + u
      if (f === 0 && u === 0) return { c, hw: 2.6, zb: PB + 0.3, crown: 19.4, depth: 1.3, back: M.brown, door: { part: M.gold, h: 4.6 } }
      return { c, hw: 3.0, zb: PB + 1.4, crown: 19.6, depth: 1.0, back: M.win }
    })
    wallBand(M.white, M.white, pl, 0, L, PB, ZS, ops, seg)
    // white balcony ledges across the window bays (c11, c50)
    for (const o of ops) {
      if (o.back !== M.win) continue
      const a = at3(pl, o.c - o.hw - 0.3, 0), c = at3(pl, o.c + o.hw + 0.3, 0.8)
      box(M.white, M.white, Math.min(a[0], c[0]), Math.max(a[0], c[0]), Math.min(a[1], c[1]), Math.max(a[1], c[1]), 11.0, 12.1, 0, M.white)
      if (D) {
        const a2 = at3(pl, o.c - o.hw, 0), c2 = at3(pl, o.c + o.hw, 0.55)
        box(M.white, M.white, Math.min(a2[0], c2[0]), Math.max(a2[0], c2[0]), Math.min(a2[1], c2[1]), Math.max(a2[1], c2[1]), 6.4, 7.2, 0, M.white)
      }
    }
    if (f === 0) {
      const p = at3(pl, L / 2, 0.2)
      lathe(M.white, p[0], p[1], [[0, 10.8], [1.0, 11.0], [1.7, 11.9], [1.9, 12.8], [1.75, 12.9]], D ? 12 : 6, { smooth: true })
    }
  })
  // columns: front blue-gold-gold-blue, the other sides blue at the corners and white between
  const at = (u: number, v: number): P2 => [CX + u, CY + v]
  for (const u of U) for (const v of [U[0], U[3]]) {
    const corner = Math.abs(u) > 10
    const [x, y] = at(u, v)
    column(corner ? M.blue : v < 0 ? M.gold : M.white, D, x, y, PB, 11.5, ZS, 0.9, CAP)
  }
  for (const v of [U[1], U[2]]) for (const u of [U[0], U[3]]) {
    const [x, y] = at(u, v)
    column(M.white, D, x, y, PB, 11.5, ZS, 0.9, CAP)
  }
  const H = slab(M, D, CX - 23, CX + 23, CY - 23, CY + 23, ZS + 0.25)
  lathe(M.white, CX, CY, [[1.1, H], [1.1, H + 1.2], [0.65, H + 1.6], [0.34, H + 1.8], [0.15, H + 16], [0, H + 16.2]], D ? 8 : 4, {})
}

/** A wing: podium, two-storey walls with windows, a forecourt colonnade and a cornice slab. */
function wing(M: Mats, D: boolean, ring: P2[], front: [P2, P2], top = 9.8) {
  prism(M.pink, M.pink, ring, 0, PB)
  prism(M.white, M.white, ring, PB, top)
  // cornice band
  const [A, B] = front
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), t: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: P2 = [t[1], -t[0]]
  const pl = plane(A, t, n)
  // windows on the forecourt face, two storeys, recessed in the detail
  const nb = Math.round(L / 7)
  if (D) {
    wallBand(M.white, M.white, pl, 0, L, PB, 6.4, bays(0, L, nb, (c) => ({ c, hw: 1.0, zb: PB + 0.7, crown: 6.0, round: true, depth: 0.5, back: M.win })), 6)
    wallBand(M.white, M.white, pl, 0, L, 6.4, top, bays(0, L, nb, (c) => ({ c, hw: 1.0, zb: 7.0, crown: 9.2, round: true, depth: 0.5, back: M.win })), 6)
  } else for (const o of bays(0, L, nb, (c) => ({ c, hw: 1, zb: 0, crown: 0, depth: 0 }))) {
    panel(M.win, pl, o.c, PB + 0.7, 2.0, 5.8, 'round', 3, 0.08)
  }
  // colonnade 2.2 m in front, under a slab
  const cols = Math.round(L / 7) + 1
  for (let i = 0; i < cols; i++) {
    const s = 1.2 + ((L - 2.4) * i) / (cols - 1)
    const x = A[0] + t[0] * s + n[0] * 2.2, y = A[1] + t[1] * s + n[1] * 2.2
    column(i === 0 || i === cols - 1 ? M.blue : M.white, D, x, y, PB, top - 3.0, top + 0.02, 0.5, 1.9)
  }
  const q = (s: number, d: number, z: number): V3 => [A[0] + t[0] * s + n[0] * d, A[1] + t[1] * s + n[1] * d, z]
  const nn: V3 = [n[0], n[1], 0]
  // slab: front, top, soffit, ends, its brown dentil band
  quad(M.white, q(-0.5, 4.4, top + 0.6), q(L + 0.5, 4.4, top + 0.6), q(L + 0.5, 4.4, top + 1.7), q(-0.5, 4.4, top + 1.7), nn)
  quad(M.brown, q(-0.4, 4.25, top), q(L + 0.4, 4.25, top), q(L + 0.4, 4.25, top + 0.6), q(-0.4, 4.25, top + 0.6), nn)
  quad(M.white, q(-0.5, 0, top + 1.7), q(-0.5, 4.4, top + 1.7), q(L + 0.5, 4.4, top + 1.7), q(L + 0.5, 0, top + 1.7), [0, 0, 1])
  quad(M.white, q(-0.4, 0, top), q(L + 0.4, 0, top), q(L + 0.4, 4.25, top), q(-0.4, 4.25, top), [0, 0, -1])
  quad(M.white, q(-0.5, 4.4, top + 0.6), q(-0.5, 4.4, top + 1.7), q(L + 0.5, 4.4, top + 1.7), q(L + 0.5, 4.4, top + 0.6), nn)
  for (const [s, k] of [[-0.5, -1], [L + 0.5, 1]] as [number, number][]) quad(M.white, q(s, 0, top), q(s, 4.4, top), q(s, 4.4, top + 1.7), q(s, 0, top + 1.7), [t[0] * k, t[1] * k, 0])
  quad(M.white, q(-0.4, 4.25, top), q(L + 0.4, 4.25, top), q(L + 0.4, 4.4, top + 0.6), q(-0.4, 4.4, top + 0.6), [0, 0, -1])
}

function build(D: boolean): Mats {
  setShift(0, 0)
  const M: Mats = { white: new Part(), blue: new Part(), gold: new Part(), brown: new Part(), pink: new Part(), win: new Part() }
  pavilion(M, D)
  // brown blocks either side of the pavilion
  for (const [x0, x1] of [[-28, -20.2], [21, 28.5]]) {
    box(M.brown, M.white, x0, x1, -12, 12, PB, 10.6)
    box(M.pink, M.pink, x0, x1, -12, 12, 0, PB)
  }
  // west wing: its forecourt edge from (-76, -4.5) to (-28, -19.8)
  wing(M, D, [[-76, -4.5], [-28, -19.8], [-28, 14.8], [-63.2, 14.5], [-67.7, 10.6], [-75.2, -2]], [[-76, -4.5], [-28, -19.8]])
  // east wing and its end block
  wing(M, D, [[28.5, -21.4], [52, -25.5], [55.8, -18.1], [57.6, -14.7], [58.1, 12.3], [28.5, 12.9]], [[28.5, -21.4], [52, -25.5]])
  box(M.pink, M.pink, 57.6, 74, -14.6, 1.5, 0, PB)
  box(M.white, M.white, 57.6, 74, -14.6, 1.5, PB, 9.0)
  for (const [pl, L] of boxFaces(57.6, 74, -14.6, 1.5)) for (const o of bays(0, L, Math.max(1, Math.round(L / 6)), (c) => ({ c, hw: 0, zb: 0, crown: 0, depth: 0 }))) panel(M.win, pl, o.c, PB + 1.5, 1.6, 6.5, 'round', D ? 6 : 3, 0.06)
  return M
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.9)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.white, material: { ...finish('alam-white', 0xf2e9d8), floodlight: lit } },
    { part: M.blue, material: { ...finish('alam-turquoise', 0x4fb3c8, 0.6), floodlight: () => 0.9 } },
    { part: M.gold, material: { ...finish('alam-gold', 0xd9ab3e, 0.5), floodlight: () => 0.9 } },
    { part: M.brown, material: finish('alam-brown', 0x6b4f3e) },
    { part: M.pink, material: finish('alam-podium', 0xdcc0a0) },
    { part: M.win, material: PALETTE.window },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Al Alam Palace', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 13.7, elevation: 0, height: 42.2,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('muscat-al-alam-palace.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
  await write('muscat-al-alam-palace.glb', materials(build(false)), 5000, 250 * 1024)
}
