/**
 * Downtown Aquarium, Denver (opened 1999 as Colorado's Ocean Journey; Landry's since 2003)
 * — procedural, CC0-1.0, no textures.
 * bun generators/den-downtown-aquarium.ts
 *
 * What makes it this building: the curved glass rotunda on the north and east, its wide
 * overhanging grey roof brim following an S-curved "wave" plan, with a grey ribbed clerestory
 * band under the brim and a blue wave-striped balcony over the entrance; behind it a tall
 * windowless terracotta-brick exhibit block with a narrower, taller brick band next to the
 * rotunda; two glass boxes with grey metal bases rising from the block's corners, each under
 * a glazed roof sloping down into the block (the one to the west-south-west the tallest
 * part); the blue "AQUARIUM" signs.
 *
 * Frame: x across (towards 150.5°), y along (towards 60.5°, the long walls in OSM), z up,
 * metres; origin at the centroid of OSM way/296804941. z = 0 is 1581.1 m NAVD88, the lowest
 * map terrain (Mapterhorn) under the footprint, at the south-east annex; the street around
 * the building is at 1582.55 m (z 1.45), so every lidar height below is street + 1.45.
 *
 * Sources:
 * - OSM (API map call, 2026-11-19): outline way/296804941 (building=commercial, height 11,
 *   Q3023370) and the parts inside it: way/633370973 (a second whole-building part),
 *   548930969 (north-west glass box), 548931046 (south-west glass box), 548931511, 548931044,
 *   548931045, 548931398 (the rotunda's south lobe), 548931200, 548931047 (the gabled
 *   annex), the small roof parts 5489315xx/5489319xx/5489320xx/5489322xx/5489323xx/5489324xx.
 *   OSM's heights (7–12 m) are too low against the lidar. The 4D theater way/635678170 is a
 *   separate building about 15 m north of the rotunda and is not part of this model.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 1 m grid (tools/lidar.py grid). Measured,
 *   above the street (1582.55 m): rotunda roof 15.0–15.2 (parapet 15.4); exhibit block roof
 *   16.8 with a perimeter parapet at 18.6; the brick band next to the rotunda 18.5–18.7; the
 *   north-west glass box's roof sloping from 21.3 at its outer wall to 17 inside; the
 *   south-west glass box's roof sloping from 18.7 to 23.8 at its outer wall (the highest
 *   point); the middle monitor's roof sloping from 17.8 to 22.0 towards the south-south-east;
 *   the annex's ridge 6.2 and eaves about 2.5.
 * - USGS NAIP (tools/usgs.py naip): plan, dark rotunda roof, white block roof, the two
 *   striped glazed roofs.
 * - Mapterhorn terrain (tools/terrain.ts grid, 5 m).
 * - Photos (EVIDENCE):
 *   - Ginkgo100, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Denver-DTA.jpg
 *     (from Water Street, north-west: rotunda, brick band, north-west glass box)
 *   - Stilfehler, CC BY-SA 1.0: https://commons.wikimedia.org/wiki/File:Downtown_Aquarium_Denver.JPG
 *     (rotunda from the north: brim, clerestory, sign, balcony)
 *   - Xnatedawgx, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:DowntownAquariumDenver.JPG
 *     (the block's west corner: brick, dolphins and sign, south-west glass box)
 *   - Bogdan Migulski, CC BY 2.0: https://www.flickr.com/photos/20172348@N00/2356201499
 *     (the west-south-west side, as Ocean Journey)
 *
 * Measured / published / estimated:
 * - measured (lidar, NAIP, OSM): every roof height and slope, the plan.
 * - estimated from photos: the brim's 2.5 m overhang and 1 m depth, the clerestory band
 *   (3 m), glass to 12.6 m, the balcony (2.5 m deep, fascia at 6.2–7.4 m), the glass boxes'
 *   grey bases (to about 40 % of their height), sign sizes and places, colours.
 * - invented: the annex's walls (no photo shows it), drawn as plain brick under a grey roof.
 *
 * Doubts: no licensed photo shows the east or south-south-east sides of the rotunda, so its
 * glass is carried all round the curve; the lower canopy seen at the far west of Ginkgo100's
 * photo is left out. OSM part 548931200 (height 7) has no lidar return above 1.5 m; nothing
 * is drawn there.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face } from './bridge-kit'
import { finish, PALETTE } from './palette'

const ST = 1.45 // the street, above z = 0
const L = (h: number) => ST + h // a lidar height above the street, in model z

type P2 = [number, number]

// ---- Helpers ---------------------------------------------------------------------------

const area = (P: P2[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2

/** Ear-clipping triangulation of a simple polygon; draws it flat at z, facing up or down. */
function cap(p: Part, P0: P2[], z: number, up = true) {
  const P = area(P0) < 0 ? [...P0].reverse() : [...P0]
  const idx = P.map((_, i) => i)
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (q: P2, a: P2, b: P2, c: P2) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = P[i0], b = P[i1], c = P[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(P[j], a, b, c))) continue
      tri3(p, a, b, c, z, up)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) tri3(p, P[idx[0]], P[idx[1]], P[idx[2]], z, up)
}
function tri3(p: Part, a: P2, b: P2, c: P2, z: number, up: boolean) {
  if (up) p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
  else p.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
}

/** Inward offset of a polygon's vertices by d (per-vertex mitre, capped). */
function offset(P0: P2[], d: number): P2[] {
  const s = area(P0) > 0 ? 1 : -1 // CCW: inward normal is the left of each edge
  return P0.map((p, i) => {
    const a = P0[(i + P0.length - 1) % P0.length], b = P0[(i + 1) % P0.length]
    const n1 = nrm([-(p[1] - a[1]) * s, (p[0] - a[0]) * s]), n2 = nrm([-(b[1] - p[1]) * s, (b[0] - p[0]) * s])
    const m = nrm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = Math.min(2, 1 / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1]))
    return [p[0] + m[0] * d * k, p[1] + m[1] * d * k] as P2
  })
}
const nrm = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A vertical quad on the segment a–b from z0 to z1, facing away from `inside` (a point). */
function wall(p: Part, a: P2, b: P2, z0: number, z1: number, out: P2) {
  const n: V3 = [out[0], out[1], 0]
  face(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
}
/** Outward normal of edge a→b of a polygon with signed area sign s. */
const outN = (a: P2, b: P2, s: number): P2 => nrm([(b[1] - a[1]) * s, -(b[0] - a[0]) * s])

/** A box, x0..x1 × y0..y1 × z0..z1, with an optional top sloping linearly: top(x, y). */
function box(walls: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, zt: (x: number, y: number) => number, sides = [true, true, true, true]) {
  const c: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ns: P2[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  for (let i = 0; i < 4; i++) {
    if (!sides[i]) continue
    const a = c[i], b = c[(i + 1) % 4]
    face(walls, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt(...b)], [a[0], a[1], zt(...a)], [ns[i][0], ns[i][1], 0])
  }
  if (top) {
    const [A, B, C, D] = c.map(([x, y]) => [x, y, zt(x, y)] as V3)
    face(top, A, B, C, D, [0, 0, 1])
  }
}

/** A flat panel on a face, from a point list in (u, z) along a wall a→b, pushed out by `off`. */
function panel(p: Part, a: P2, b: P2, u0: number, u1: number, z0: number, z1: number, off: number) {
  const L0 = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L0, (b[1] - a[1]) / L0]
  const at = (u: number): P2 => [a[0] + t[0] * u, a[1] + t[1] * u]
  // outward normal: the caller passes a→b with the outside on the right
  const n: P2 = [t[1], -t[0]]
  const A = at(u0), B = at(u1)
  const o = (q: P2): P2 => [q[0] + n[0] * off, q[1] + n[1] * off]
  wall(p, o(A), o(B), z0, z1, n)
}

/** Pale mullion and transom lines on a glass face a→b (outside on `n`), set 0.06 m proud. */
function grid(p: Part, a: P2, b: P2, z0: number, z1: number, n: P2, rows: number[], cols: number, w = 0.22) {
  const o = (q: P2, u = 0.06): P2 => [q[0] + n[0] * u, q[1] + n[1] * u]
  for (const z of rows) if (z > z0 && z < z1) wall(p, o(a), o(b), z - w / 2, z + w / 2, n)
  const Lab = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / Lab, (b[1] - a[1]) / Lab]
  for (let k = 0; k <= cols; k++) {
    const c: P2 = [a[0] + (b[0] - a[0]) * (k / cols), a[1] + (b[1] - a[1]) * (k / cols)]
    wall(p, o([c[0] - t[0] * w / 2, c[1] - t[1] * w / 2], 0.08), o([c[0] + t[0] * w / 2, c[1] + t[1] * w / 2], 0.08), z0, z1, n)
  }
}

// ---- Plan ------------------------------------------------------------------------------

/** The rotunda's roof outline (OSM way/296804941's curved side), closed along the block. */
const ROT: P2[] = [
  [-38.7, 15.3], [-36.5, 15.3], [-36.0, 22.1], [-34.5, 28.2], [-30.8, 35.6], [-28.6, 37.8], [-26.3, 40.1],
  [-23.0, 42.0], [-21.6, 42.8], [-15.9, 43.3], [-10.3, 41.3], [-9.1, 40.7], [-4.8, 38.5], [-3.4, 38.0],
  [-0.4, 36.9], [2.8, 36.8], [7.6, 37.5], [13.8, 38.3], [20.2, 38.4], [27.2, 36.6], [30.0, 35.1],
  [33.9, 33.0], [38.0, 28.1], [40.0, 22.9], [40.5, 19.4], [38.1, 9.8], [37.4, 8.1], [37.3, 5.9], [37.5, 3.7],
  [38.3, -0.8], [38.5, -3.7], [38.1, -6.6], [37.3, -9.4], [35.9, -12.0], [34.1, -14.3], [31.9, -16.2],
  [29.3, -17.7], [26.6, -18.7], [23.7, -19.2], [21.0, -19.1], [21.0, 15.3],
]
const OPEN = ROT.length - 2 // edges from index 1 to OPEN-1... are the exposed curve (0→1 and the last two are inside)

const ROOF_R = L(15.1), BRIM = 1.4, OVER = 2.5, GLASS_TOP = L(11.2)

export function build() {
  const brick = new Part(), metal = new Part(), roof = new Part(), glass = new Part(), sign = new Part(), blue = new Part()

  // ---- Rotunda
  const core = offset(ROT, OVER)
  const s = area(ROT) > 0 ? 1 : -1
  cap(roof, ROT, ROOF_R)
  for (let i = 1; i < OPEN; i++) {
    const a = ROT[i], b = ROT[i + 1], ca = core[i], cb = core[i + 1]
    const n = outN(a, b, s), nc = outN(ca, cb, s)
    // brim fascia and its soffit
    wall(metal, a, b, ROOF_R - BRIM, ROOF_R, n)
    face(roof, [a[0], a[1], ROOF_R - BRIM], [b[0], b[1], ROOF_R - BRIM], [cb[0], cb[1], ROOF_R - BRIM], [ca[0], ca[1], ROOF_R - BRIM], [0, 0, -1])
    // the glass wall and the ribbed clerestory band above it
    wall(glass, ca, cb, 0, GLASS_TOP, nc)
    grid(metal, ca, cb, 0, GLASS_TOP, nc, [L(3.6), L(7.4)], 1)
    wall(metal, ca, cb, GLASS_TOP, ROOF_R - BRIM, nc)
  }
  // radiating brackets under the brim, every other vertex
  for (let i = 2; i < OPEN; i += 2) {
    const a = ROT[i], c = core[i], z = ROOF_R - BRIM
    const d = nrm([a[0] - c[0], a[1] - c[1]]), q: P2 = [-d[1] * 0.2, d[0] * 0.2]
    const tip: V3 = [a[0] - d[0] * 0.3, a[1] - d[1] * 0.3, z]
    for (const sg of [1, -1]) {
      const A: V3 = [c[0] + q[0] * sg, c[1] + q[1] * sg, z - 1.6], B: V3 = [c[0] + q[0] * sg, c[1] + q[1] * sg, z]
      const T: V3 = [tip[0] + q[0] * sg, tip[1] + q[1] * sg, z]
      if (sg > 0) metal.tri(A, T, B); else metal.tri(A, B, T)
    }
    face(metal, [c[0] + q[0], c[1] + q[1], z - 1.6], [tip[0] + q[0], tip[1] + q[1], z], [tip[0] - q[0], tip[1] - q[1], z], [c[0] - q[0], c[1] - q[1], z - 1.6], [d[0], d[1], -0.6])
  }
  // the balcony over the entrance, round the north-west curve (Stilfehler's photo)
  const bal = offset(ROT, OVER - 2.4), zb0 = L(4.8), zb1 = L(6.0)
  for (let i = 1; i < 8; i++) {
    const a = bal[i], b = bal[i + 1], ca = core[i], cb = core[i + 1]
    wall(blue, a, b, zb0, zb1, outN(a, b, s))
    face(metal, [a[0], a[1], zb1], [b[0], b[1], zb1], [cb[0], cb[1], zb1], [ca[0], ca[1], zb1], [0, 0, 1])
    face(metal, [a[0], a[1], zb0], [b[0], b[1], zb0], [cb[0], cb[1], zb0], [ca[0], ca[1], zb0], [0, 0, -1])
  }
  for (const i of [1, 8]) {
    const a = bal[i], c = core[i]
    const t = nrm([ROT[i + (i === 1 ? 1 : -1)][0] - ROT[i][0], ROT[i + (i === 1 ? 1 : -1)][1] - ROT[i][1]])
    face(blue, [a[0], a[1], zb0], [c[0], c[1], zb0], [c[0], c[1], zb1], [a[0], a[1], zb1], [-t[0], -t[1], 0])
  }

  // ---- The exhibit block (parapet 18.6, roof 16.8) and the brick band by the rotunda
  const BX0 = -38.2, BX1 = 21.0, BY0 = -36.5, BY1 = 17.5, PAR = L(18.6), RF = L(16.8)
  box(brick, null, BX0, BX1, BY0, BY1, 0, () => PAR)
  // parapet ring top and inner faces, roof inside
  const t = 0.8
  const outer: P2[] = [[BX0, BY0], [BX1, BY0], [BX1, BY1], [BX0, BY1]]
  const inner: P2[] = [[BX0 + t, BY0 + t], [BX1 - t, BY0 + t], [BX1 - t, BY1 - t], [BX0 + t, BY1 - t]]
  for (let i = 0; i < 4; i++) {
    const a = outer[i], b = outer[(i + 1) % 4], c = inner[(i + 1) % 4], d = inner[i]
    face(brick, [a[0], a[1], PAR], [b[0], b[1], PAR], [c[0], c[1], PAR], [d[0], d[1], PAR], [0, 0, 1])
    const n = nrm([(d[0] + c[0]) / 2 - (a[0] + b[0]) / 2, (d[1] + c[1]) / 2 - (a[1] + b[1]) / 2])
    wall(brick, d, c, RF, PAR, n)
  }
  cap(metal, inner, RF)

  // ---- North-west glass box (548930969): roof from 21.3 at its outer wall down to 17 inside
  const nwTop = (x: number) => L(21.3 + ((17.0 - 21.3) * (x + 43.2)) / 16.6)
  const NWB = L(9.0)
  box(metal, null, -43.2, -26.6, -17.4, 8.6, 0, (x) => Math.min(NWB, nwTop(x)), [true, false, true, true])
  box(glass, roof, -43.2, -26.6, -17.4, 8.6, NWB, (x) => nwTop(x), [true, false, true, true])
  box(metal, null, -43.35, -43.2, -17.55, 8.75, NWB - 0.4, () => NWB + 0.2, [true, false, true, true])
  grid(metal, [-43.2, 8.6], [-43.2, -17.4], NWB, nwTop(-43.2), [-1, 0], [L(12.5), L(16), L(19.5)], 6)

  // ---- South-west glass box (548931046): roof from 18.7 inside up to 23.8 at its outer wall
  const swTop = (_x: number, y: number) => L(18.7 + ((23.8 - 18.7) * (-17 - y)) / 23.5)
  const SWB = L(9.5)
  box(metal, null, -8.7, 13.8, -40.5, -17, 0, () => SWB, [true, true, false, true])
  box(glass, roof, -8.7, 13.8, -40.5, -17, SWB, swTop, [true, true, false, true])
  box(metal, null, -8.85, 13.95, -40.65, -17, SWB - 0.4, () => SWB + 0.2, [true, true, false, true])
  grid(metal, [-8.7, -40.5], [13.8, -40.5], SWB, swTop(0, -40.5), [0, -1], [L(13), L(16.5), L(20)], 5)

  // ---- The middle monitor: roof rising towards the south-south-east, its tall face glazed
  const mTop = (x: number) => L(17.8 + ((22.0 - 17.8) * (x + 8)) / 23.5)
  box(metal, roof, -8, 15.5, -12, 11, RF, mTop, [true, false, true, true])
  box(glass, null, -8, 15.5, -12, 11, RF, mTop, [false, true, false, false])

  // ---- The gabled annex (548931047): ridge along y at x 38.5
  const AX0 = 30.8, AX1 = 44.6, AY0 = -34.3, AY1 = -22.5, EAV = L(2.5), RID = L(6.2), RX = 38.5
  box(brick, null, AX0, AX1, AY0, AY1, 0, () => EAV)
  for (const [y, sg] of [[AY0, -1], [AY1, 1]] as [number, number][]) {
    const A: V3 = [AX0, y, EAV], B: V3 = [AX1, y, EAV], C: V3 = [RX, y, RID]
    if (sg < 0) brick.tri(A, B, C); else brick.tri(A, C, B)
  }
  face(roof, [AX0 - 0.4, AY0 - 0.3, EAV - 0.15], [RX, AY0 - 0.3, RID], [RX, AY1 + 0.3, RID], [AX0 - 0.4, AY1 + 0.3, EAV - 0.15], [-(RID - EAV), 0, RX - AX0])
  face(roof, [RX, AY0 - 0.3, RID], [AX1 + 0.4, AY0 - 0.3, EAV - 0.15], [AX1 + 0.4, AY1 + 0.3, EAV - 0.15], [RX, AY1 + 0.3, RID], [RID - EAV, 0, AX1 - RX])

  // ---- Signs (the blue "AQUARIUM" boards), flush on their faces
  // on the rotunda's north-west curve, hung in front of the clerestory (Stilfehler, Ginkgo100)
  {
    const a = core[3], b = core[4]
    const n = outN(a, b, s), c: P2 = [(a[0] + b[0]) / 2 + n[0] * 3.0, (a[1] + b[1]) / 2 + n[1] * 3.0]
    const tg = nrm([b[0] - a[0], b[1] - a[1]])
    const A: P2 = [c[0] - tg[0] * 6, c[1] - tg[1] * 6], B: P2 = [c[0] + tg[0] * 6, c[1] + tg[1] * 6]
    wall(sign, A, B, L(10.6), L(14.8), n)
    wall(sign, B, A, L(10.6), L(14.8), [-n[0], -n[1]])
    face(sign, [A[0], A[1], L(14.8)], [B[0], B[1], L(14.8)], [B[0] - n[0] * 0.4, B[1] - n[1] * 0.4, L(14.8)], [A[0] - n[0] * 0.4, A[1] - n[1] * 0.4, L(14.8)], [0, 0, 1])
  }
  // on the north-west glass box (Ginkgo100) and on the block's west-south-west wall (Xnatedawgx)
  panel(sign, [-43.2, 8.6], [-43.2, -17.4], 7, 19, L(12.5), L(16.5), 0.12)
  panel(sign, [BX0, BY0], [-8.7, BY0], 8, 21, L(6.8), L(11.3), 0.12)
  // the dolphins over it: five pale leaping shapes (metal, flush)
  for (let k = 0; k < 5; k++) {
    const u = 9.5 + k * 2.3, z = L(12.4 + (k % 2) * 0.9 + k * 0.35)
    const at = (du: number, dz: number): V3 => [BX0 + u + du, BY0 - 0.1, z + dz]
    face(metal, at(0, 0), at(2.2, 0.9), at(1.8, 1.6), at(-0.4, 0.7), [0, -1, 0])
  }

  return { brick, metal, roof, glass, sign, blue }
}

if (import.meta.main) {
  const m = build()
  const BRICK = finish('terracotta-brick', 0xc48668)
  const METAL = finish('grey-metal', 0xc9ccce)
  const ROOF = { ...PALETTE.roof, color: 0x858d94 }
  const GLASS = { ...PALETTE.window, color: 0x6e88a3 }
  const SIGN = finish('neon-aquarium-blue', 0x3f8fd2)
  const BLUE = finish('wave-blue', 0x4a74b5)
  const parts = [
    { part: m.brick, material: BRICK }, { part: m.metal, material: METAL }, { part: m.roof, material: ROOF },
    { part: m.glass, material: GLASS }, { part: m.sign, material: SIGN }, { part: m.blue, material: BLUE },
  ]
  const glb = writeGlb('Downtown Aquarium', parts)
  await Bun.write(new URL('../models/den-downtown-aquarium.glb', import.meta.url), glb)
  console.log(`den-downtown-aquarium.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
