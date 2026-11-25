/**
 * OneAmerica Tower, Indianapolis (1982, Skidmore, Owings & Merrill; formerly
 * the American United Life Building): procedural, CC0-1.0.
 * bun generators/indy-oneamerica-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the centroid of
 * the outer ring of OSM relation/4821151 (-86.160647, 39.770645), which
 * covers the whole block: the tower and its low podium round a courtyard
 * (the relation's inner ring). The block is turned 1.7 degrees clockwise
 * from north, so the model is drawn square and placed at bearing 1.7. In
 * that frame the block is x -50.2..51.0, y -50.8..50.0, and the courtyard a
 * hexagon from (0.5,-27.6) to (27.6,26.6).
 *
 * Form: a marble-clad tower whose plan is a 51 m square with its north-west
 * and south-east corners cut off on the diagonal, so it shows broad
 * diagonal fronts (38 m) to the courtyard (north-west) and to Monument
 * Circle (south-east), with narrower 23 m flanks on the four street sides.
 * Punched windows in a regular grid. The north-west front ends in a plain
 * marble band carrying the OneAmerica sign; the roof over the south-east
 * half slopes down to the south-east front as a glass plane between marble
 * wedge parapets on the east and south faces. At its foot two stepped
 * sloped-glass wings run down from the tower's north and west faces to a
 * two- and three-storey podium round the courtyard, with a third sloped
 * glass wedge in the courtyard's north-west corner.
 *
 * Sources
 * - OSM (ODbL): relation/4821151 (outer way/340008407, inner
 *   way/340008406; building=office, height 162, 38 levels).
 * - Published (Wikipedia, "OneAmerica Tower"; Emporis/CTBUH): 533 ft
 *   (162 m), 38 floors, completed 1982, second-tallest in Indiana.
 * - Lidar: USGS 3DEP USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m DSM, heights above the street: tower roof 164 (the published
 *   162 is used); the tower's plan (faces at x 0.5 and 51, y -0.7 and
 *   -50.8, diagonals x-y = 28 and x-y = 75); the roof flat over the
 *   north-west half and sloping from the north-east/south-west corner line
 *   down to about 147 at the south-east front; the sloped wings, 31.5 at
 *   the tower falling in 4 m steps to 7.5-12; podium 7.5 (south-west, east)
 *   and 13 (north-west); the courtyard's north-west glass wedge 13 falling
 *   to 6. The lidar footprint agrees with OSM's outer ring; OSM's chamfer at
 *   the south-east corner is smaller than the tower's real diagonal, and
 *   the lidar diagonal is used.
 * - NAIP 2022 aerial (USGS, public domain): the sloped wings and courtyard.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Downtown Indianapolis drone photo, 2018.jpg" (magnamite9, CC BY 4.0),
 *     from the north-west over the courtyard - the north-west front with
 *     its sign band, the flanks, the stepped glass wings, marble colour;
 *     https://commons.wikimedia.org/wiki/File:Downtown_Indianapolis_drone_photo,_2018.jpg
 *   "OneAmerica Tower from SSM.JPG" (Xnatedawgx, CC BY-SA 3.0), from the
 *     Soldiers' and Sailors' Monument (south-east) - the south-east front's
 *     five broad bays, the sloping glass roof between marble wedges;
 *     https://commons.wikimedia.org/wiki/File:OneAmerica_Tower_from_SSM.JPG
 *   "OneAmerica Tower - April 2018 - Malte Hempel.jpg" (Malte Hempel, CC
 *     BY-SA 2.0), from street level - the chamfered silhouette and grid.
 *     https://commons.wikimedia.org/wiki/File:OneAmerica_Tower_-_April_2018_-_Malte_Hempel.jpg
 * - Look-only: none.
 *
 * Estimated: floor heights (lobby 9 m, then 4 m; panels two floors high),
 * window bay counts per face (from the photos: 7 on the north-west front,
 * 5 broad bays on the south-east front, 5 on each flank), the sign's size
 * (scaled from the drone photo), the stone bands on the glass wings, the
 * podium's window bands. Invented: nothing.
 * Doubts: the south-east diagonal is read from lidar where the street side
 * has no returns (a 72-80 band); the podium's street faces are not
 * photographed closely; the flagpole on the roof is left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const stone = new Part(), win = new Part(), glass = new Part()
const roof = new Part(), signRed = new Part(), signBlue = new Part()

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const outward = (a: XY, b: XY): XY => norm2([b[1] - a[1], -(b[0] - a[0])])
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** A wall over the counter-clockwise edge a→b, facing out; tops may differ. */
function wall(part: Part, a: XY, b: XY, z0: number, za: number, zb = za) {
  part.quad(at(a, z0), at(b, z0), at(b, zb), at(a, za))
}

/** Fan cap over a convex ring, z per vertex. */
function capZ(part: Part, ring: XY[], z: (p: XY) => number) {
  for (let i = 1; i < ring.length - 1; i++) part.tri(at(ring[0], z(ring[0])), at(ring[i], z(ring[i])), at(ring[i + 1], z(ring[i + 1])))
}

/** Cut a small bevel at every convex corner of a counter-clockwise ring. */
function chamfer(ring: XY[], c: number): XY[] {
  const out: XY[] = []
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const p = ring[(i + n - 1) % n], q = ring[i], r = ring[(i + 1) % n]
    const a = norm2([q[0] - p[0], q[1] - p[1]]), b = norm2([r[0] - q[0], r[1] - q[1]])
    const convex = a[0] * b[1] - a[1] * b[0] > 1e-6
    const la = Math.hypot(q[0] - p[0], q[1] - p[1]), lb = Math.hypot(r[0] - q[0], r[1] - q[1])
    const k = Math.min(c, la / 3, lb / 3)
    if (convex) out.push([q[0] - a[0] * k, q[1] - a[1] * k], [q[0] + b[0] * k, q[1] + b[1] * k])
    else out.push(q)
  }
  return out
}

/** A flush panel on the wall a→b between fractions s..e of its length. */
const PROUD = 0.05
function panel(part: Part, a: XY, b: XY, s: number, e: number, z0: number, z1: number, proud = PROUD) {
  const n = outward(a, b)
  const p = lerp2(a, b, s), q = lerp2(a, b, e)
  wall(part, [p[0] + n[0] * proud, p[1] + n[1] * proud], [q[0] + n[0] * proud, q[1] + n[1] * proud], z0, z1)
}

// ---------- the tower ----------
const H = 162, LOW = 146 // roof, and the sloping roof's foot at the south-east front
const RIDGE = 51.7, SE = 75 // in x - y: where the roof starts to slope, and the south-east front
const roofZ = (p: XY) => {
  const d = p[0] - p[1]
  return d <= RIDGE ? H : H - (H - LOW) * (d - RIDGE) / (SE - RIDGE)
}
const T = {
  sw: [0.5, -50.8] as XY, s: [24.2, -50.8] as XY, e: [51, -24] as XY,
  ne: [51, -0.7] as XY, n: [27.6, -0.7] as XY, w: [0.5, -27.6] as XY,
}
const towerRing: XY[] = [T.sw, T.s, T.e, T.ne, T.n, T.w]
const Z0 = 9, FLOOR = 4, GROUP = 2 * FLOOR, SPANDREL = 2.4
const WING_TOP = 31.5

// Faces: [a, b, bays, lowest panel z, top of windows (relative to the wall top)]
type Face = { a: XY; b: XY; bays: number; zLo: number; pier: number; topGap: number }
const faces: Face[] = [
  { a: T.sw, b: T.s, bays: 5, zLo: Z0, pier: 1.8, topGap: 4 },      // south flank
  { a: T.s, b: T.e, bays: 5, zLo: Z0, pier: 1.4, topGap: 2.5 },     // south-east front, broad bays
  { a: T.e, b: T.ne, bays: 5, zLo: Z0, pier: 1.8, topGap: 4 },      // east flank
  { a: T.ne, b: T.n, bays: 5, zLo: WING_TOP, pier: 1.8, topGap: 4 },// north flank, above the glass wing
  { a: T.n, b: T.w, bays: 9, zLo: Z0, pier: 1.7, topGap: 14 },      // north-west front, sign band above
  { a: T.w, b: T.sw, bays: 5, zLo: WING_TOP, pier: 1.8, topGap: 4 },// west flank, above the glass wing
]
{
  const ring = chamfer(towerRing, 0.5)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    wall(stone, a, b, 0, roofZ(a) + 1, roofZ(b) + 1) // parapet 1 m over the roof
  }
  // flat roof over the north-west half, glass slope over the south-east half
  capZ(roof, [T.sw, T.ne, T.n, T.w], () => H)
  capZ(glass, [T.sw, T.s, T.e, T.ne], roofZ)
  // parapet tops (a thin ring cap so the wall reads solid from above)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n = outward(a, b)
    const ai: XY = [a[0] - n[0] * 0.6, a[1] - n[1] * 0.6], bi: XY = [b[0] - n[0] * 0.6, b[1] - n[1] * 0.6]
    stone.quad(at(a, roofZ(a) + 1), at(b, roofZ(b) + 1), at(bi, roofZ(b) + 1), at(ai, roofZ(a) + 1))
    // inner face of the parapet, down to the roof
    stone.quad(at(bi, roofZ(b)), at(ai, roofZ(a)), at(ai, roofZ(a) + 1), at(bi, roofZ(b) + 1))
  }
}
for (const f of faces) {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
  const bay = L / f.bays, pr = f.pier / L, edge = 1.2 / L
  for (let k = 0; k < f.bays; k++) {
    let s = k * bay / L + pr / 2, e = (k + 1) * bay / L - pr / 2
    if (k === 0) s = Math.max(s, edge)
    if (k === f.bays - 1) e = Math.min(e, 1 - edge)
    const top = Math.min(roofZ(lerp2(f.a, f.b, s)), roofZ(lerp2(f.a, f.b, e))) - f.topGap
    for (let g = 0; Z0 + g * GROUP < top; g++) {
      const lo = Z0 + g * GROUP + SPANDREL / 2, hi = Z0 + (g + 1) * GROUP - SPANDREL / 2
      if (lo < f.zLo + 0.5 || hi > top) continue
      panel(win, f.a, f.b, s, e, lo, hi)
    }
  }
  // lobby glazing on the street fronts
  if (f.zLo === Z0) {
    const n = Math.max(3, Math.round(L / 6))
    for (let k = 0; k < n; k++) panel(win, f.a, f.b, (k + 0.18) / n, (k + 0.82) / n, 0.4, 6.8)
  }
}

// ---------- the sign on the north-west front's top band ----------
{
  const a = T.n, b = T.w, n = outward(a, b)
  const t = norm2([b[0] - a[0], b[1] - a[1]])
  const c = lerp2(a, b, 0.5)
  const P = (u: number, d: number): XY => [c[0] + t[0] * u + n[0] * d, c[1] + t[1] * u + n[1] * d]
  // three red stripes of the logo, a little slanted (the flag), 11 m wide
  for (let i = 0; i < 3; i++) {
    const z = 153.4 + i * 2.2, sl = 1.1
    const q = [P(-5.5, 0.35), P(5.5, 0.35)]
    signRed.quad(at(q[0], z - sl), at(q[1], z), at(q[1], z + 1.5), at(q[0], z + 1.5 - sl))
    // the stripe's top and ends, so it reads at a slant
    const qb = [P(-5.5, 0.05), P(5.5, 0.05)]
    signRed.quad(at(q[0], z + 1.5 - sl), at(q[1], z + 1.5), at(qb[1], z + 1.5), at(qb[0], z + 1.5 - sl))
  }
  // the name, a navy bar 20 m wide under the logo
  const r0 = P(-11, 0.3), r1 = P(11, 0.3), b0 = P(-11, 0.05), b1 = P(11, 0.05)
  signBlue.quad(at(r0, 149.2), at(r1, 149.2), at(r1, 151.8), at(r0, 151.8))
  signBlue.quad(at(r0, 151.8), at(r1, 151.8), at(b1, 151.8), at(b0, 151.8))
}

// ---------- the podium round the courtyard ----------
/** A box over a convex counter-clockwise ring, walls on the listed edges (all by default). */
function block(ring: XY[], h: number, skip: (a: XY, b: XY) => boolean = () => false, rows: [number, number][] = []) {
  const r = chamfer(ring, 0.4)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skip(a, b)) continue
    wall(stone, a, b, 0, h)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const n = Math.round(L / 4.5)
    for (const [lo, hi] of rows) for (let k = 0; k < n; k++) panel(win, a, b, (k + 0.15) / n, (k + 0.85) / n, lo, hi)
  }
  capZ(roof, r, () => h)
}
const onX = (x: number) => (a: XY, b: XY) => Math.abs(a[0] - x) < 0.5 && Math.abs(b[0] - x) < 0.5
const onY = (y: number) => (a: XY, b: XY) => Math.abs(a[1] - y) < 0.5 && Math.abs(b[1] - y) < 0.5
const ROWS13: [number, number][] = [[1, 5.4], [7.2, 11.4]], ROWS75: [number, number][] = [[1, 5.8]]
const XW = -50.2, XE = 51, YS = -50.8, YN = 50, YC = 26.6, XC = -26.6
// north wing: west part three storeys (13 m), east part two (7.5 m)
block([[-6, YC], [XE, YC], [XE, YN], [-6, YN]], 7.5, onX(-6), ROWS75)
block([[XW, YC], [-6, YC], [-6, YN], [XW, YN]], 13, () => false, ROWS13)
block([[XW, 4], [XC, 4], [XC, YC], [XW, YC]], 13, onY(YC), ROWS13)
// west wing, two storeys, south of y = 4
block([[XW, YS], [XC, YS], [XC, 4], [XW, 4]], 7.5, onY(4), ROWS75)

/**
 * A wedge whose glass top falls from `hi` along edge a→b (against a wall)
 * to `lo` along the far edge c→d; a, b, c, d counter-clockwise.
 * Stone bands cross the glass where the real wings step.
 */
function wedge(a: XY, b: XY, c: XY, d: XY, hi: number, lo: number, steps: number) {
  // side walls and the low front
  wall(stone, b, c, 0, hi, lo)
  wall(stone, c, d, 0, lo)
  wall(stone, d, a, 0, lo, hi)
  for (const [p, q] of [[c, d]] as [XY, XY][]) {
    const n = Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 4.5)
    for (let k = 0; k < n; k++) panel(win, p, q, (k + 0.15) / n, (k + 0.85) / n, 1, Math.min(5.8, lo - 1.2))
  }
  glass.quad(at(a, hi), at(b, hi), at(c, lo), at(d, lo))
  // the stone bands: across the slope at each step, 0.9 m wide, just above the glass
  for (let k = 1; k < steps; k++) {
    const t0 = k / steps - 0.016, t1 = k / steps + 0.016
    const z = (t: number) => hi + (lo - hi) * t + 0.08
    const p0 = lerp2(a, d, t0), p1 = lerp2(a, d, t1), q0 = lerp2(b, c, t0), q1 = lerp2(b, c, t1)
    stone.quad(at(p0, z(t0)), at(q0, z(t0)), at(q1, z(t1)), at(p1, z(t1)))
  }
}
// north-east wing: against the tower's north face, falling north to the podium
wedge(T.n, T.ne, [XE, YC], [27.6, YC], WING_TOP, 8.5, 6)
// south-west wing: against the tower's west face, falling west
wedge(T.sw, T.w, [XC, -27.0], [XC, YS], WING_TOP, 8.5, 6)
// courtyard's north-west corner: glass wedge falling from 13 to 6 toward the courtyard
{
  const A: XY = [XC, -0.2], B: XY = [0.3, YC], C: XY = [XC, YC]
  wall(stone, A, B, 0, 6)
  glass.tri(at(A, 6), at(B, 6), at(C, 13))
}

// ---------- write ----------
// Pale warm-grey marble (drone photo), pulled to the palette's lightness;
// the glass slopes a darker grey-blue glass (both photos); the sign's red and navy.
const towerLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] > 140 ? 0.7 : 0.25)
const marble = { ...finish('indy-oa-marble', 0xe7e2d9), floodlight: towerLit }
const parts = [
  { part: stone, material: marble },
  { part: win, material: PALETTE.window },
  { part: glass, material: finish('glass', 0x8a9fb1, 0.24) },
  { part: roof, material: PALETTE.roof },
  { part: signRed, material: finish('neon-oneamerica-red', 0xd23a3f, 0.5) },
  { part: signBlue, material: finish('neon-oneamerica-navy', 0x35508f, 0.5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('OneAmerica Tower', parts, {
  license: 'CC0-1.0', bearing: 1.7, elevation: 0, height: H + 1,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['relation/4821151'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/indy-oneamerica-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
