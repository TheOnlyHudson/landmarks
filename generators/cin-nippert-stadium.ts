/**
 * Nippert Stadium, University of Cincinnati (college football; opened 1924,
 * rebuilt 1954 and 1992, renovated 2014-15 with the West Pavilion) —
 * procedural, CC0-1.0, no textures.  bun generators/cin-nippert-stadium.ts
 *
 * Map frame: x across the field (+x the east sideline), y along it (+y the
 * open north end), z up, metres. Placed at bearing 28°, the long axis of the
 * horseshoe (OSM grandstand way/35263590, whose inner edge is the field's
 * two straight sides, x = -41 and x = 35 here). Anchor -84.51623, 39.13112,
 * inside the field, 4 m from the area centroid of leisure=stadium
 * way/35263569.
 *
 * z = 0 is the field. Nippert sits in a ravine: the lidar puts the street
 * and concourse round the bowl 11-12 m above the field on the west and
 * south and 15-16 m on the east, and the map's terrain (Mapterhorn,
 * `bun tools/terrain.ts grid`) already carries that pit (field 0-0.5 m,
 * the rim 10-16 m above it). So `elevation` is 0, as for Huntington Bank
 * Field and Acrisure Stadium; the outer walls run down into the hillside.
 * The field is the map's (STYLE.md, "Don't model the ground").
 *
 * What makes it read as itself, from the photos: the red horseshoe of the
 * lower bowl, sunk in its ravine and open to the north; the 2015 West
 * Pavilion along the west sideline (grey seats under two bands of suites and
 * a tall glass press level, a white roof edge); the white aluminium upper
 * deck (Herschede/Shank Pavilion) along the east side and round the
 * south-east corner; the scoreboard over the low north stand.
 *
 * How it is built: the bowl is swept along the field's edge (the west
 * straight, a half ellipse round the south end, the east straight), each
 * section measured outward from the field wall; the two pavilions are
 * swept along the same path over their own lengths.
 *
 * Evidence
 * - OSM: grandstand way/35263590 (the lower bowl), way/703660989
 *   (Herschede/Shank Pavilion, the east upper deck), way/703775550 (West
 *   Pavilion, building:colour #8F9FB6, 8 levels), way/59341685 (the north
 *   stand), leisure=stadium way/35263569 (Q3342107).
 * - Measured, lidar: USGS 3DEP OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 *   flown about 2021), 1 m grid, read along normals to the field edge every
 *   8 m (heights above the field):
 *   - lower bowl: west to 6.5 m at 17 m out; south end to 12 m at 30 m out
 *     (level with the street); east to 9 m at 20 m out;
 *   - east upper deck: its front 20.5 m out, behind a walkway over the
 *     lower bowl (the lidar's 14.5 m there includes the railings; drawn
 *     at 11 m), rising to 24 m at 38 m out, then the street at 11 m;
 *   - West Pavilion: roof 37.5 m, from 23 m to 40 m out; the grey seats
 *     between the lower bowl and its face rise to 15 m;
 *   - the north stand 4.5-8 m, y 74-82; the scoreboard top 28 m, about 28 m
 *     wide (x 12-40, y 82-88).
 * - USGS NAIP orthophoto: plan, red lower bowl, white east deck, grey
 *   pavilion roof.
 * - Published (Wikipedia, "Nippert Stadium"): opened 1924; 2014-15
 *   renovation added the West Pavilion (press box, suites, club seats);
 *   capacity 40,000.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Ben Levin, "Nippert Stadium, September 2015" (CC BY-SA 4.0; panorama
 *   from the south end: West Pavilion, red bowl, white east deck, north
 *   end and scoreboard)
 *     https://commons.wikimedia.org/wiki/File:Nippert_Stadium,_September_2015.JPG
 *   redlegsfan21, "Nippert Stadium (16155110276)" (CC BY-SA 2.0; from the
 *   west sideline at night: east deck, scoreboard on its frame)
 *     https://commons.wikimedia.org/wiki/File:Nippert_Stadium_(16155110276).jpg
 *   CincyUte, "NippertStadium.JPG" (public domain; before the pavilion)
 *     https://commons.wikimedia.org/wiki/File:NippertStadium.JPG
 * - Estimated: the tier break heights on the pavilion face (suites 15-26 m,
 *   press level 27-35.5 m) from the 2015 panorama scaled to the lidar roof; the
 *   pavilion's seating tiers (red to 12 m, grey to 17.4 m, 30 m out) and its
 *   roof overhanging them to 23 m out;
 *   the scoreboard's bottom (19 m) and legs.
 * - Not drawn: the Lindner Center and the Campus Recreation Center roof that
 *   hang over the north-east and north (separate buildings), the field,
 *   railings, lettering, the lamp banks.
 * - Doubts: the outer faces below the street (west, south, east) are buried
 *   in the hill on the map; their colour is a guess (concrete).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, quad, triangulate, type SectionPt, type XY } from './dc-nationals-park'

// ---------------------------------------------------------------------------
// Sweep kit (shared with the other cin- stadiums).

/** Linear interpolation in a table of rows keyed by column 0. */
export function at(rows: number[][], s: number, col: number) {
  if (s <= rows[0][0]) return rows[0][col]
  for (let i = 0; i < rows.length - 1; i++) if (s <= rows[i + 1][0]) {
    const f = (s - rows[i][0]) / (rows[i + 1][0] - rows[i][0])
    return rows[i][col] + (rows[i + 1][col] - rows[i][col]) * f
  }
  return rows[rows.length - 1][col]
}

/** A path vertex: position, outward (right of travel) mitred normal, arc length. */
export type PathPt = { p: XY; n: XY; s: number }

/** Mitred outward normals (right of travel) and arc length along a polyline. */
export function pathFrame(path: XY[], closed = false): PathPt[] {
  const N = path.length
  const segN = (i: number): XY => {
    const a = path[i], b = path[(i + 1) % N]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  }
  let s = 0
  return path.map((p, i) => {
    if (i > 0) s += Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1])
    const prev = i > 0 ? segN(i - 1) : closed ? segN(N - 1) : null
    const next = i < N - 1 || closed ? segN(i) : null
    let n: XY
    if (prev && next) {
      const m: XY = [prev[0] + next[0], prev[1] + next[1]]
      const ml = Math.hypot(m[0], m[1]) || 1
      const k = 1 / Math.max(0.5, (m[0] / ml) * next[0] + (m[1] / ml) * next[1])
      n = [(m[0] / ml) * k, (m[1] / ml) * k]
    } else n = (prev ?? next)!
    return { p, n, s }
  })
}

/** Resample a polyline every `step` m or less, keeping its corners. */
export function densify(path: XY[], step: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1]
    const k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
  }
  out.push(path[path.length - 1])
  return out
}

const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * Sweep sections along a path. `secs[k]` is the section at path vertex k: a
 * list of (r = offset along the outward normal, z) points, walked so the
 * outside of each edge lies to the left in the (r, z) plane (from the field
 * outward and up, then back down). Each edge takes the `part` of its first
 * point (null: not drawn). Faces are smooth along the path where it bends
 * gently. `cap` closes open ends with the section polygon.
 */
export function sweep(fr: PathPt[], secs: SectionPt[][], cap: Part | null, closed = false) {
  const K = fr.length, nE = secs[0].length - 1
  const P = (k: number, i: number): V3 => {
    const f = fr[k % K], s = secs[k % K][i]
    return [f.p[0] + f.n[0] * s.r, f.p[1] + f.n[1] * s.r, s.z]
  }
  const want = (k: number, i: number): V3 => {
    const a = secs[k % K][i], b = secs[k % K][i + 1], n = fr[k % K].n
    const dr = b.r - a.r, dz = b.z - a.z
    return [-dz * n[0], -dz * n[1], dr]
  }
  const M = closed ? K : K - 1
  const faceN: V3[][] = []
  for (let i = 0; i < nE; i++) {
    faceN.push([])
    for (let k = 0; k < M; k++) {
      const q = [P(k, i), P(k + 1, i), P(k + 1, i + 1), P(k, i + 1)]
      const c1 = (u: V3, v: V3): V3 => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
      const d = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
      let n = c1(d(q[1], q[0]), d(q[3], q[0]))
      if (Math.hypot(...n) < 1e-9) n = c1(d(q[2], q[1]), d(q[3], q[1]))
      const w = want(k, i), w2 = want(k + 1, i), ws: V3 = [w[0] + w2[0], w[1] + w2[1], w[2] + w2[2]]
      if (Math.hypot(...n) < 1e-9) n = ws
      n = unit3(n)
      if (dot3(n, ws) < 0) n = [-n[0], -n[1], -n[2]]
      faceN[i].push(n)
    }
  }
  const vN = (i: number, k: number, own: number) => {
    const f = faceN[i][own]
    const o = k === own ? (own > 0 ? own - 1 : closed ? M - 1 : -1) : (k < M ? k : closed ? 0 : -1)
    const other = o >= 0 ? faceN[i][o] : undefined
    if (!other || dot3(f, other) < 0.94) return f
    return unit3([f[0] + other[0], f[1] + other[1], f[2] + other[2]])
  }
  for (let i = 0; i < nE; i++) for (let k = 0; k < M; k++) {
    const part = secs[k % K][i].part
    if (!part) continue
    const q = [P(k, i), P(k + 1, i), P(k + 1, i + 1), P(k, i + 1)]
    const n0 = vN(i, k, k), n1 = vN(i, k + 1, k)
    quad(part, q, faceN[i][k], [n0, n1, n1, n0])
  }
  if (cap && !closed) for (const [k, sgn] of [[0, -1], [K - 1, 1]] as const) {
    const f = fr[k], t: V3 = [-f.n[1] * sgn, f.n[0] * sgn, 0] // along the path, outward at this end
    const pts: XY[] = secs[k].map((s) => [s.r, s.z])
    const ring = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-6)
    if (Math.hypot(ring[0][0] - ring[ring.length - 1][0], ring[0][1] - ring[ring.length - 1][1]) < 1e-6) ring.pop()
    const to3 = (p: XY): V3 => [f.p[0] + f.n[0] * p[0], f.p[1] + f.n[1] * p[0], p[1]]
    for (const [a, b, c] of triangulate(ring)) quad(cap, [to3(ring[a]), to3(ring[b]), to3(ring[c]), to3(ring[c])], t)
  }
}

/** Section points from [r, z, part] triples. */
export const sec = (pts: [number, number, Part | null][]): SectionPt[] => pts.map(([r, z, part]) => ({ r, z, part }))

// ---------------------------------------------------------------------------
const seats = new Part(), press = new Part(), stone = new Part(), glass = new Part(), roof = new Part(), bleach = new Part()

// The field edge: west straight (north to south), half ellipse round the
// south end, east straight (south to north). Outward is to the right.
const XW = -41, XE = 35, YS = -22, YN_W = 66, YN_E = 66
const CX = (XW + XE) / 2, A = (XE - XW) / 2, B = 36
const raw: XY[] = [[XW, YN_W], [XW, YS]]
for (let k = 1; k < 14; k++) {
  const t = Math.PI + (Math.PI * k) / 14
  raw.push([CX + A * Math.cos(t), YS + B * Math.sin(t)])
}
raw.push([XE, YS], [XE, YN_E])
const PATH = pathFrame(densify(raw, 9))
const S_SW = YN_W - YS // where the curve starts
const S_SE = PATH.find((f) => f.p[0] === XE && f.p[1] === YS)!.s // where it ends

// Lower bowl: [s, r of its top, z of its top] (lidar).
const BOWL: number[][] = [
  [0, 17, 6.5], [S_SW, 17, 6.5], [S_SW + 18, 20, 8], [S_SW + 32, 30, 11], [S_SE - 40, 30, 11],
  [S_SE - 24, 22, 9.5], [S_SE - 10, 20, 9], [999, 20, 9],
]
sweep(PATH, PATH.map(({ s }) => {
  const r = at(BOWL, s, 1), z = at(BOWL, s, 2)
  // a pale cross aisle a little over half way up, where the bowl is deep
  const ra = r * 0.56, za = 1.2 + (z - 1.2) * 0.5
  return sec([[0, 0, stone], [0, 1.2, seats], [ra, za, stone], [ra + 1.6, za, seats], [r, z, stone], [r + 2, z, roof], [r + 2, 0, null]])
}), stone)

// The north stand (way/59341685), facing the field, and the scoreboard.
{
  const x0 = -24, x1 = 24, y0 = 73.5, y1 = 83
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  quad(stone, [P(x0, y0, 0), P(x1, y0, 0), P(x1, y0, 1.2), P(x0, y0, 1.2)], [0, -1, 0])
  quad(seats, [P(x0, y0, 1.2), P(x1, y0, 1.2), P(x1, y1, 7.5), P(x0, y1, 7.5)], [0, -0.7, 1])
  quad(stone, [P(x0, y1, 0), P(x0, y1, 7.5), P(x1, y1, 7.5), P(x1, y1, 0)], [0, 1, 0])
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
    quad(stone, [P(x, y0, 0), P(x, y1, 0), P(x, y1, 7.5), P(x, y0, 1.2)], [s, 0, 0])
  }
  const I: [V3, V3, V3] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  box(roof, [26, 86, 23.7], I, [14, 1.2, 4.3], true) // the board
  box(roof, [26, 86, 28.4], I, [14.3, 1.4, 0.4]) // its cap
  for (const x of [15, 37]) box(roof, [x, 86.5, 9.7], I, [0.8, 0.8, 9.7]) // its legs
}

// East upper deck (Herschede/Shank Pavilion): white aluminium seats on a
// concrete front wall, from the south-east corner to the north end.
{
  const fr = PATH.filter((f) => f.s >= S_SE - 30)
  sweep(fr, fr.map(({ s }) => {
    const r0 = at(BOWL, s, 1) + 0.5
    const z0 = at(BOWL, s, 2)
    return sec([[r0, 0, stone], [r0, z0 + 1.2, stone], [r0 + 1, z0 + 1.2, bleach], [38, 24, roof], [39.5, 24, roof], [39.5, 0, null]])
  }), roof)
}

// West Pavilion: red then dark grey seating tiers stepping down to the
// lower bowl, two bands of suites, the glass press level, its roof
// reaching forward over the seats (the lidar's 37.5 m from 23 m out).
{
  const fr = PATH.filter((f) => f.s >= 8 && f.s <= S_SW + 22)
  sweep(fr, fr.map(() => sec([
    [18, 0, stone], [18, 7, seats], [24, 12, stone], [24.8, 12, roof], [30, 17.4, stone], [29, 18, glass], [29, 22, stone],
    [29, 22.7, glass], [29, 26.4, stone], [29.6, 27, press], [29.6, 35.6, stone], [23, 36.2, stone], [23, 37.5, roof],
    [40, 37.5, roof], [40, 0, null],
  ])), roof)
}

// ---------------------------------------------------------------------------
const parts = [
  { part: seats, material: finish('bearcats-red', 0xc0605a) },
  { part: press, material: windowVariant(2, 0xa9bfd1) },
  { part: stone, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: bleach, material: finish('bleacher-silver', 0xd5d9dc) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Nippert Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 28, osm: 'way/35263590', height: 37.5,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cin-nippert-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
