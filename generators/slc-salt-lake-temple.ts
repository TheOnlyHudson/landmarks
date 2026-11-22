/**
 * Salt Lake Temple, Salt Lake City (1853–1893, Truman O. Angell) — original
 * procedural geometry, CC0-1.0.
 * bun generators/slc-salt-lake-temple.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the temple ring of OSM relation/15568838
 * (40.7704347, -111.8919123). Its walls run true east-west / north-south,
 * so the bearing is 0. The relation's outline also holds two detached
 * pavilions 50 m north (ways 1577487145/6, the new entry pavilions of the
 * 2019–2026 renovation, "connected underground"): replacing the relation
 * hides them, so they are modelled here as plain blocks (see below). The
 * plazas and the underground annex are not modelled.
 *
 * Identity: six granite towers, three at each end, the east ones a little
 * taller; the central east spire carrying the gold angel Moroni; square
 * towers with octagonal corner piers that rise into pinnacles, two stepped
 * crenellated stages and a four-sided spire; the buttressed, battlemented
 * nave between them with two tiers of round-headed windows and oval
 * windows; stacks of round-headed windows on the towers; recessed bays
 * between the end towers with oak doors and round windows; the arched
 * "Holiness to the Lord" plaque on the east centre tower; light grey
 * quartz monzonite throughout.
 *
 * Numbers:
 * - Plan: OSM relation/15568838 and its parts relation/15568860..65 (towers)
 *   and relation/15569131 (nave). Towers 9 x 9.4 m (corner) and 10 x 10 m
 *   (centre); nave walls at y = ±14.6, end bays recessed to x = ±24.2.
 *   Overall 56 x 36 m, matching the published 186.5 x 118.5 ft.
 * - Published: east central spire 210 ft (64 m) to the base of Moroni;
 *   Moroni statue 12.5 ft (3.8 m); total 222 ft (68 m) (Wikipedia, "Salt
 *   Lake Temple"; churchofjesuschrist.org/temples/details/salt-lake-temple).
 *   East spires "a little higher" than the west ones (Wikipedia).
 * - Measured, USGS lidar USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013,
 *   exterior unchanged since), 0.5 m grid, above local ground (2.3 m over
 *   the box's ground_min): nave parapet 30.7, nave roof 26.8 at the walls to
 *   31.3 at the ridge (drawn 30.4 so it stays behind the parapet, as in photos); east corner towers: shaft 38.2, stages 41.3 / 45.5,
 *   spire ≥ 54 (thin tip undersampled); east centre tower: shaft ~39.5,
 *   stages 44.0 / 48.5 / 51.0, Moroni top 65.3; west corner towers: shaft
 *   36.3, stages 39.6 / 43.7, spire ≥ 52; west centre: shaft 37.6, stages
 *   42.3 / 46.9 / 49.5, spire ≥ 60.3. Stage widths from the same grid.
 * - Estimated from photos (scaled to the lidar heights): window, oculus,
 *   door and plaque positions and sizes; buttress spacing (nine bays a side);
 *   pinnacle heights; Moroni's figure (a bold simplification).
 * - North pavilions: plan from OSM; height (about 6.5 m walls under a low
 *   hipped roof, round-headed windows) estimated from the April 2025 photo
 *   below, the only open photo found that shows them. Walls raised 0.6 m
 *   (west) and 1.8 m (east) for the ground rising there (Mapterhorn).
 * - Terrain: flat to 0.5 m under the temple, but the map grounds the whole
 *   footprint at the north-west pavilion corner, ~1.1 m lower: the temple
 *   above y = 0 is lifted 1.1 m (TEMPLE_BASE). Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - Salt_Lake_Temple,_Utah_-_Sept_2004.jpg, Diliff, CC BY 2.5 (from the
 *   south-east: east front and south side).
 * - Salt_Lake_Temple_UT1.jpg and Salt_Lake_Temple_UT2.jpg, Acroterion,
 *   CC BY-SA 4.0 (east front, near-frontal and from the south-east).
 * - 2019_Salt_Lake_Temple_01..05.jpg, Farragutful, CC BY-SA 4.0 (east front,
 *   plaque).
 * - Salt_Lake_Temple_(1).jpg, Tamanoeconomico, CC BY-SA 4.0 (night: the whole
 *   temple is floodlit).
 * - Salt_Lake_Temple_under_construction_(April_2025).jpg, Lomrjyo,
 *   CC BY-SA 4.0 (from the north-east: north side and the new pavilions).
 * USGS NAIP (construction-era) checked for plan only. No commercial imagery.
 *
 * Doubts: no open photo of the west front or the north side free of
 * scaffolding was used; the west end is drawn as the east end's mirror
 * (minus the plaque and Moroni) at the lidar heights. Nave window tiers
 * are read from one oblique photo. The pavilions' form is approximate.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), gold = new Part()

type XY = [number, number]
const W: XY = [-1, 0], S: XY = [0, -1], N: XY = [0, 1], E: XY = [1, 0]

/** A rectangle ring with chamfered corners (c), long edges split to ≤ seg m. */
function ring(x0: number, x1: number, y0: number, y1: number, z: number, c = 0, seg = 1e9): V3[] {
  const corners: XY[] = c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const out: V3[] = []
  for (let i = 0; i < corners.length; i++) {
    const a = corners[i], b = corners[(i + 1) % corners.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / seg))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n, z])
  }
  return out
}
/** Cap a convex ring (no collinear points) with a fan. */
function capRing(p: Part, r: V3[], up: boolean) {
  p.cap(r, up)
}
/** A chamfered block. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.3, seg = 1e9, top: Part | null = p) {
  p.loft([ring(x0, x1, y0, y1, z0, c, seg), ring(x0, x1, y0, y1, z1, c, seg)])
  if (top) capRing(top, ring(x0, x1, y0, y1, z1, c, seg), true)
}
/** A pyramid over a chamfered rectangle. */
function pyramid(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, tip: number, c = 0) {
  const r = ring(x0, x1, y0, y1, z0, c)
  const t: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, tip]
  for (let i = 0; i < r.length; i++) p.tri(r[i], r[(i + 1) % r.length], t)
}
/** An octagonal pier with a pointed cap: the towers' corner turrets. */
function pier(x: number, y: number, r: number, z0: number, z1: number, capTip: number) {
  const c = r * 0.414
  block(stone, x - r, x + r, y - r, y + r, z0, z1, c, 1e9, null)
  pyramid(trim, x - r, x + r, y - r, y + r, z1, capTip, c)
}
/** A small square pinnacle: shaft and spike. */
function pinnacle(x: number, y: number, h: number, z0: number, z1: number, tip: number) {
  block(stone, x - h, x + h, y - h, y + h, z0, z1, 0, 1e9, null)
  pyramid(trim, x - h - 0.1, x + h + 0.1, y - h - 0.1, y + h + 0.1, z1, tip)
}
/** Battlements along a straight run: merlons on a line, facing out along n. */
function merlons(a: XY, b: XY, z0: number, z1: number, depth: number, every: number, wide: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / every))
  const d: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (let k = 0; k < n; k++) {
    const s = ((k + 0.5) * L) / n, c: XY = [a[0] + d[0] * s, a[1] + d[1] * s]
    const hx = Math.abs(d[0]) * wide / 2 + Math.abs(d[1]) * depth / 2
    const hy = Math.abs(d[1]) * wide / 2 + Math.abs(d[0]) * depth / 2
    block(stone, c[0] - hx, c[0] + hx, c[1] - hy, c[1] + hy, z0, z1, 0, 1e9, trim)
  }
}

/** A round-headed panel on a wall facing n, centred at c (on the wall). */
function arch(p: Part, c: XY, n: XY, w: number, z0: number, z1: number, d = 0.06, seg = 8) {
  const t: XY = [-n[1], n[0]]
  const spring = z1 - w / 2
  const pts: [number, number][] = [[-w / 2, z0], [w / 2, z0], [w / 2, spring]]
  for (let k = 1; k < seg; k++) { const a = (k * Math.PI) / seg; pts.push([(w / 2) * Math.cos(a), spring + (w / 2) * Math.sin(a)]) }
  pts.push([-w / 2, spring])
  const v = pts.map(([s, z]): V3 => [c[0] + t[0] * s + n[0] * d, c[1] + t[1] * s + n[1] * d, z])
  for (let i = 1; i < v.length - 1; i++) p.tri(v[0], v[i], v[i + 1])
}
/** A round-headed window with a pale stone surround behind it. */
function framedArch(c: XY, n: XY, w: number, z0: number, z1: number, frame = false, seg = 8) {
  if (frame) arch(trim, c, n, w + 0.5, z0 - 0.25, z1 + 0.25, 0.04, seg)
  arch(win, c, n, w, z0, z1, 0.09, seg)
}
function disc(p: Part, c: XY, n: XY, r: number, z: number, d = 0.08, seg = 8) {
  const t: XY = [-n[1], n[0]]
  const rr = Array.from({ length: seg }, (_, i): V3 => {
    const a = (i / seg) * Math.PI * 2
    return [c[0] + t[0] * r * Math.cos(a) + n[0] * d, c[1] + t[1] * r * Math.cos(a) + n[1] * d, z + r * Math.sin(a)]
  })
  const m: V3 = [c[0] + n[0] * d, c[1] + n[1] * d, z]
  for (let i = 0; i < seg; i++) p.tri(m, rr[i], rr[(i + 1) % seg])
}
function oculus(c: XY, n: XY, r: number, z: number, frame = false) {
  if (frame) disc(trim, c, n, r + 0.28, z, 0.04)
  disc(win, c, n, r, z, 0.09)
}

// ── Nave ─────────────────────────────────────────────────────────────────
const NX = 24.2, NY = 14.6, WALL = 28.6, PARA = 30.7
block(stone, -NX, NX, -NY, NY, 0, WALL, 0, 1e9, null)
// String course under the parapet, and the parapet with its merlons.
block(trim, -NX - 0.2, NX + 0.2, -NY - 0.2, NY + 0.2, WALL - 0.7, WALL, 0, 1e9, null)
for (const s of [-1, 1]) {
  block(stone, -18.5, 18.5, s * NY - 0.35, s * NY + 0.35, WALL, PARA - 1.0, 0, 1e9, trim)
  merlons([-18.2, s * NY], [18.2, s * NY], PARA - 1.0, PARA, 0.7, 2.6, 1.3)
}
// Low gabled roof behind the parapet (lidar: 26.8 at the walls, 31.3 ridge).
{
  const e = WALL - 0.6, r = 30.4, x0 = -NX + 0.5, x1 = NX - 0.5, y = NY - 0.4
  roof.quad([x0, -y, e], [x1, -y, e], [x1, 0, r], [x0, 0, r])
  roof.quad([x1, y, e], [x0, y, e], [x0, 0, r], [x1, 0, r])
  roof.cap([[-NX + 0.4, -y, WALL], [NX - 0.4, -y, WALL], [NX - 0.4, y, WALL], [-NX + 0.4, y, WALL]], true)
}
// Buttresses, nine bays a side, with two tiers of round-headed windows and
// oval windows in each bay.
const BAYS = 9, BX0 = -18.5, BX1 = 18.5, BW = (BX1 - BX0) / BAYS
for (const s of [-1, 1]) {
  const n: XY = s < 0 ? S : N
  for (let k = 1; k < BAYS; k++) {
    const x = BX0 + k * BW, y0 = s < 0 ? -NY - 0.9 : NY, y1 = s < 0 ? -NY : NY + 0.9
    block(stone, x - 0.65, x + 0.65, y0, y1, 0, PARA + 0.6, 0.2, 1e9, null)
    pyramid(trim, x - 0.65, x + 0.65, y0, y1, PARA + 0.6, PARA + 2.8, 0.2)
  }
  for (let k = 0; k < BAYS; k++) {
    const x = BX0 + (k + 0.5) * BW, c: XY = [x, s * NY]
    framedArch(c, n, 1.7, 4.0, 10.6)
    oculus(c, n, 0.75, 12.6)
    framedArch(c, n, 1.7, 15.0, 21.6)
    oculus(c, n, 0.75, 24.0)
  }
}

// ── Towers ───────────────────────────────────────────────────────────────
type Tower = {
  x: number; y: number; hx: number; hy: number; shaft: number
  stages: [number, number][] // [half-width, top]
  tip: number; end: XY
}
const towers: Tower[] = []
for (const [sx, k] of [[1, 1], [-1, 36.3 / 38.2]] as [number, number][]) {
  const east = sx > 0
  const end: XY = east ? E : W
  // Corner towers.
  for (const sy of [-1, 1])
    towers.push({
      x: sx * 22.9, y: sy * 13.5, hx: 4.5, hy: 4.7, shaft: east ? 38.2 : 36.3,
      stages: east ? [[3.5, 41.3], [2.4, 45.5]] : [[3.5, 39.6], [2.4, 43.7]],
      tip: east ? 55.6 : 53.2, end,
    })
  // Centre towers.
  towers.push({
    x: sx * 23.0, y: 0, hx: 5.0, hy: 5.0, shaft: east ? 39.5 : 37.6,
    stages: east ? [[4.0, 44.0], [3.0, 48.5], [2.3, 51.0]] : [[4.0, 42.3], [3.0, 46.9], [2.3, 49.5]],
    tip: east ? 64.0 : 60.3, end,
  })
  void k
}
for (const t of towers) {
  const { x, y, hx, hy, shaft } = t
  const x0 = x - hx, x1 = x + hx, y0 = y - hy, y1 = y + hy
  block(stone, x0, x1, y0, y1, 0, shaft, 0.25, 1e9, null)
  // Cornice band and merlons at the shaft top.
  block(trim, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, shaft - 1.2, shaft + 0.9, 0.3, 1e9, stone)
  // Octagonal corner piers rising into pinnacles.
  const pr = 0.75
  for (const [px, py] of [[x0 + 0.3, y0 + 0.3], [x1 - 0.3, y0 + 0.3], [x1 - 0.3, y1 - 0.3], [x0 + 0.3, y1 - 0.3]])
    pier(px, py, pr, 0, shaft + 3.0, shaft + 6.4)
  // Stepped stages, each with a cornice and corner pinnacles.
  let z = shaft
  for (const [h, top] of t.stages) {
    block(stone, x - h, x + h, y - h, y + h, z, top - 0.6, 0, 1e9, null)
    block(trim, x - h - 0.2, x + h + 0.2, y - h - 0.2, y + h + 0.2, top - 0.6, top, 0, 1e9, stone)
    if (z === shaft)
      for (const [px, py] of [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]])
        pinnacle(px, py, 0.35, top - 1.0, top + 1.2, top + 3.2)
    z = top
  }
  // Four-sided spire, ball and finial.
  const sh = t.stages[t.stages.length - 1][0] - 0.3
  pyramid(stone, x - sh, x + sh, y - sh, y + sh, z, t.tip, 0.25)
  // Ball on the tip: an octagonal bipyramid.
  {
    const cz = t.tip + 0.45, r = 0.55, eq = ring(x - r, x + r, y - r, y + r, cz, r * 0.29)
    for (let i = 0; i < eq.length; i++) {
      const a = eq[i], b = eq[(i + 1) % eq.length]
      trim.tri(a, b, [x, y, cz + r]); trim.tri(b, a, [x, y, cz - r])
    }
  }
  if (t.tip < 64) pyramid(trim, x - 0.18, x + 0.18, y - 0.18, y + 0.18, t.tip + 0.9, t.tip + 2.0)
}

// ── Faces: windows, plaque, bays and doors ───────────────────────────────
for (const sx of [1, -1]) {
  const east = sx > 0, n: XY = east ? E : W, f = east ? 1 : 36.3 / 38.2
  // Corner towers: five round-headed windows on the end face and the side face.
  for (const sy of [-1, 1]) {
    const tx = sx * 22.9, ty = sy * 13.5
    const heads = [5.2, 11.2, 17.3, 23.4, 29.6].map((h) => h * f)
    for (const h of heads) {
      framedArch([tx + sx * 4.5, ty], n, 1.9, h - 4.2 * f, h)
      framedArch([tx, ty + sy * 4.7], sy < 0 ? S : N, 1.9, h - 4.2 * f, h)
    }
  }
  // Centre tower: low window, tall window, plaque.
  const cx = sx * 28.0
  framedArch([cx, 0], n, 2.0, 1.2 * f, 6.6 * f)
  framedArch([cx, 0], n, 2.4, 10.8 * f, 22.4 * f, true)
  if (east) {
    // The arched inscription plaque: pale stone, standing proud.
    arch(win, [cx, 0], n, 2.9, 24.6, 32.6, 0.05)
    arch(trim, [cx, 0], n, 2.4, 24.9, 32.3, 0.12)
  } else framedArch([cx, 0], n, 2.0, 25.0 * f, 31.0 * f)
  // Recessed bays between the towers: door, oculus, window, oculus.
  for (const sy of [-1, 1]) {
    const c: XY = [sx * NX, sy * 6.9]
    arch(trim, c, n, 2.8, 0.01, 5.4, 0.04)
    arch(door, c, n, 2.2, 0.01, 4.9, 0.09)
    oculus(c, n, 0.8, 8.8, true)
    framedArch(c, n, 1.6, 11.6, 16.6, true)
    oculus(c, n, 0.8, 20.6, true)
    // Bay parapet with merlons between the towers.
    merlons([sx * (NX - 0.35), sy * 5.0], [sx * (NX - 0.35), sy * 8.8], WALL, PARA, 0.7, 1.7, 0.95)
  }
}

// ── Moroni on the east centre spire (published 64 m to his base, 3.8 m) ──
{
  const x = 23.0, y = 0, z0 = 64.0 + 0.9
  // Robe: an octagonal frustum, flared at the hem.
  const robe = [ring(x - 0.55, x + 0.55, y - 0.55, y + 0.55, z0, 0.16), ring(x - 0.36, x + 0.36, y - 0.36, y + 0.36, z0 + 1.9, 0.1), ring(x - 0.3, x + 0.3, y - 0.3, y + 0.3, z0 + 2.4, 0.09)]
  gold.loft(robe)
  capRing(gold, robe[2], true)
  capRing(gold, robe[0], false)
  // Head.
  pyramid(gold, x - 0.22, x + 0.22, y - 0.22, y + 0.22, z0 + 2.4, z0 + 2.9)
  // Trumpet raised to the east.
  const a: V3 = [x + 0.2, y, z0 + 2.5], b: V3 = [x + 1.25, y, z0 + 2.9]
  const r0 = 0.08, r1 = 0.22
  const sec = (p: V3, r: number): V3[] => [[p[0], p[1] - r, p[2] - r], [p[0], p[1] + r, p[2] - r], [p[0], p[1] + r, p[2] + r], [p[0], p[1] - r, p[2] + r]]
  gold.sweep([sec(a, r0), sec(b, r1)])
}

// ── Ground: the map stands the whole footprint (pavilions included) on its
// lowest point, the north-west pavilion corner, about 1.1 m below the
// temple's own ground (Mapterhorn, terrain.ts check). Everything of the
// temple above y = 0 is lifted by that much, so its walls still reach
// y = 0 and its doors and windows sit at its real ground.
const TEMPLE_BASE = 1.1
for (const part of [stone, trim, roof, win, door, gold])
  for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 0.001) part.pos[i] += TEMPLE_BASE

// ── North pavilions (new entry pavilions; plan from OSM) ─────────────────
for (const [x0, x1, y0, y1, lift] of [[-36.6, -18.8, 65.6, 92.6, 0.6], [18.2, 36.6, 65.8, 93.0, 1.8]]) {
  const eave = 6.5 + lift, ridge = 8.8 + lift
  block(stone, x0, x1, y0, y1, 0, eave, 0.25, 4.5, null)
  block(trim, x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, eave - 0.5, eave, 0.25, 4.5, null)
  // Low hipped roof.
  const o = 0.3, xm = (x0 + x1) / 2, ry0 = y0 + (x1 - x0) / 2, ry1 = y1 - (x1 - x0) / 2
  const A: V3 = [x0 - o, y0 - o, eave], B: V3 = [x1 + o, y0 - o, eave], C: V3 = [x1 + o, y1 + o, eave], D: V3 = [x0 - o, y1 + o, eave]
  const R0: V3 = [xm, ry0, ridge], R1: V3 = [xm, ry1, ridge]
  roof.tri(A, B, R0); roof.quad(B, C, R1, R0); roof.tri(C, D, R1); roof.quad(D, A, R0, R1)
  // Round-headed windows.
  for (let k = 0; k < 4; k++) {
    const yy = y0 + ((k + 0.5) * (y1 - y0)) / 4
    framedArch([x0, yy], W, 1.8, 1.2 + lift, 5.0 + lift, false, 6)
    framedArch([x1, yy], E, 1.8, 1.2 + lift, 5.0 + lift, false, 6)
  }
  for (let k = 0; k < 2; k++) {
    const xx = x0 + ((k + 0.5) * (x1 - x0)) / 2
    framedArch([xx, y0], S, 1.8, 1.2 + lift, 5.0 + lift, false, 6)
    framedArch([xx, y1], N, 1.8, 1.2 + lift, 5.0 + lift, false, 6)
  }
}

// ── Materials and output ─────────────────────────────────────────────────
// The whole temple is floodlit at night (night photo): stone and trim walls
// lit, faces turned up barely.
const flood = (p: V3, n: V3) => (p[1] > 40 ? 0 : n[2] > 0.7 ? 0.25 : 0.85)
const parts = [
  { part: stone, material: { ...finish('slc-temple-granite', 0xdcdcd6), floodlight: flood } },
  { part: trim, material: { ...finish('slc-temple-granite-trim', 0xeeede8), floodlight: flood } },
  { part: roof, material: { ...PALETTE.roof, color: 0xa3abb1 } },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0xa47a52 } },
  { part: gold, material: { ...finish('moroni-gold', 0xd9aa45, 0.4), floodlight: () => 0.9 } },
]
for (const p of parts) console.log(p.material.name, p.part.triangles)
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Salt Lake Temple', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [40.7704347, -111.8919123], bearing: 0,
})
if (triangles > 6500 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/slc-salt-lake-temple.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
