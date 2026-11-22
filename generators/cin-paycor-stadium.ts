/**
 * Paycor Stadium, Cincinnati (NFL, Cincinnati Bengals; opened 2000 as Paul
 * Brown Stadium, NBBJ) — procedural, CC0-1.0, no textures.
 * bun generators/cin-paycor-stadium.ts
 *
 * Map frame: x across the field (+x the south-west sideline, towards the
 * river), y along it (+y the south-east end), z up, metres. Placed at
 * bearing 142°, the long axis of the field in the USGS NAIP orthophoto and
 * of the field ring (inner way/32947028). Anchor -84.51607, 39.09535; the
 * field ring's centre is at (-8, -7) in this frame, and the stands are
 * lofted round it, angle θ clockwise from +y.
 *
 * z = 0 is the field. The lidar puts the plazas round the stadium 6-10 m
 * above it and the map's terrain carries the same dish (`terrain.ts`), so
 * `elevation` is 0. The field is the map's.
 *
 * What makes it read as itself, from the photos: two tall sideline stands,
 * each under a white crescent canopy that rises to its middle, held by big
 * white ribs raking up from the back of the stand to the canopy's front
 * edge; low, open ends and corners, the river (south-east) end with the
 * scoreboard over a low end building; the base in white precast and grey
 * metal panels with dark glass; black seats.
 *
 * Evidence
 * - OSM: building=stadium relation/280132 (outer way/41574344, inner
 *   way/32947028 the field; height 21 tagged, which is the base building,
 *   not the canopies). No building:part inside. leisure=stadium way/210540615, Wikidata Q1632294.
 * - Measured, lidar: USGS 3DEP OH_StatewideP3_6_B21 (flown about 2021),
 *   1 m grid, rays from the field centre every 10°:
 *   - sidelines: lower bowl to 8 m 28 m out from the field wall, a suite
 *     step to 14-16 m, the upper deck at 29-33 m 40-48 m out, the canopy
 *     from 52 m to 72 m out, its top 59 m at the middle of each side and
 *     49-51 m at its ends (θ = 40°, 140°, 220°, 320°), the outer building
 *     roof 33 m to about 86 m out;
 *   - north-west end: lower bowl to 8 m, an upper tier to 26-31 m, the end
 *     building 16 m; the open corners only 11 m;
 *   - south-east end: one bowl to 17 m; the scoreboard's top 40 m, 30 m
 *     wide; the end building behind it 19-20 m.
 * - Measured, USGS NAIP orthophoto: plan, the white canopies, the dark
 *   seats, the end building's white roof.
 * - Published (Wikipedia, "Paycor Stadium"): opened 2000; capacity 65,515;
 *   architect NBBJ.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Antony-22, "Paul Brown Stadium 2022a" (CC BY-SA 4.0; from Kentucky, the
 *   two canopies end on)
 *     https://commons.wikimedia.org/wiki/File:Paul_Brown_Stadium_2022a.jpg
 *   Antony-22, "Paycor Stadium 2025" (CC BY-SA 4.0; the south-west side
 *   across the river: ribs, canopy, white precast, grey panels, glass)
 *     https://commons.wikimedia.org/wiki/File:Paycor_Stadium_2025.jpg
 *   EEJCC, "Paul Brown Stadium Cincinnati" (CC BY-SA 4.0; the north-east
 *   side from the east: both canopies, the grey panel block, glass)
 *     https://commons.wikimedia.org/wiki/File:Paul_Brown_Stadium_Cincinnati.jpg
 *   Ktr101, "Three stadiums" (CC BY-SA 4.0; aerial from the north-west)
 *     https://commons.wikimedia.org/wiki/File:Three_stadiums.jpg
 * - Estimated: the upper deck's seats under the canopy (rake continued to
 *   48 m); the suite glass bands; the rib count (one every 4°) and size;
 *   the scoreboard's bottom (28 m).
 * - Not drawn: lettering, the north-west scoreboard, the stair towers,
 *   railings, the canopies' fabric seams.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, loftSections, prism, type SectionPt, type XY } from './dc-nationals-park'
import { at } from './cin-nippert-stadium'

const C: XY = [-8, -7]
const seats = new Part(), white = new Part(), stone = new Part(), glass = new Part(), roof = new Part(), dark = new Part()
const S = (r: number, z: number, part: Part | null): SectionPt => ({ r, z, part })
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]

// Field wall radius by angle (lidar).
const WALL: number[][] = [
  [0, 55], [10, 62], [20, 64], [30, 60], [40, 56], [50, 50], [60, 47], [70, 44], [80, 42], [90, 40], [100, 42],
  [110, 44], [120, 47], [130, 51], [140, 56], [150, 62], [160, 66], [170, 64], [180, 58], [190, 64], [200, 66],
  [210, 62], [220, 55], [230, 50], [240, 47], [250, 44], [260, 43], [270, 41], [280, 43], [290, 45], [300, 47],
  [310, 51], [320, 57], [330, 62], [340, 66], [350, 63], [360, 55],
]
/** Which kind of stand: 1 sideline, 0 corner, -1 north-west end, 2 south-east end, blended. */
const KIND: number[][] = [
  [0, 2], [22, 2], [34, 1], [146, 1], [156, 0], [166, -1], [194, -1], [204, 0], [214, 1], [326, 1], [338, 2], [360, 2],
]
// Section by kind: [lower top dr, lower top z, step h, upper top dr, upper top z, back dr, outer z, outer dr]
const KINDS: Record<string, number[]> = {
  '1': [28, 8, 6, 70, 48, 72, 33, 86],
  '0': [38, 11, 0.3, 40, 11.5, 42, 11, 44],
  '-1': [28, 8, 6, 52, 28, 54, 16, 76],
  '2': [52, 16.5, 0.3, 54, 17, 56, 17, 60],
}
function params(a: number) {
  const k = at(KIND, a, 1), lo = Math.floor(k), hi = Math.ceil(k), f = k - lo
  const A = KINDS[String(lo)], B = KINDS[String(hi)]
  return A.map((v, i) => v + (B[i] - v) * f)
}
const ANG: number[] = []
for (let a = 0; a <= 360; a += 5) ANG.push(a)
loftSections(C, ANG, ANG.map((a) => {
  const w = at(WALL, a, 1)
  const [ra, za, hs, ru, zu, rb, zo, ro] = params(a)
  return [
    S(w, 0, stone), S(w, 1.2, seats), S(w + ra, za, stone), S(w + ra + 1, za, glass), S(w + ra + 1, za + hs, stone),
    S(w + ra + 3, za + hs + 1, seats), S(w + ru, zu, roof), S(w + rb, zu, roof), S(w + rb, zo, roof),
    S(w + ro, zo, a % 180 > 30 && a % 180 < 150 ? roof : stone), S(w + ro, 0, null),
  ]
}), stone)
// The outer walls of the sideline blocks: grey metal panels with a glass band.
for (const [a0, a1] of [[36, 144], [216, 324]]) {
  const ang: number[] = []
  for (let a = a0; a <= a1 + 1e-9; a += 6) ang.push(a)
  loftSections(C, ang, ang.map((a) => {
    const w = at(WALL, a, 1), ro = w + 86.3
    return [S(ro, 32.6, roof), S(ro, 29, glass), S(ro, 24, roof), S(ro, 12, glass), S(ro, 6, null)]
  }), null)
}

// The canopies: a white crescent over each sideline's upper deck, rising
// to 59 m at the middle, on white ribs from the back of the stand.
for (const [a0, a1] of [[38, 142], [218, 322]]) {
  const ang: number[] = []
  for (let a = a0; a <= a1 + 1e-9; a += 4) ang.push(a)
  const zc = (a: number) => 50 + 9 * Math.sin((Math.PI * (a - a0)) / (a1 - a0))
  loftSections(C, ang, ang.map((a) => {
    const w = at(WALL, a, 1), z = zc(a)
    return [S(w + 51, z - 1.2, white), S(w + 51, z + 0.6, white), S(w + 73, z - 3.4, white), S(w + 73, z - 4.6, roof), S(w + 51, z - 1.2, null)]
  }), white)
  for (let a = a0 + 2; a < a1; a += 4) {
    const w = at(WALL, a, 1), z = zc(a), d = dirOf(a)
    const P = (r: number, h: number): V3 => [C[0] + d[0] * r, C[1] + d[1] * r, h]
    const lo = P(w + 84, 31), hi = P(w + 51, z + 2.4)
    const L = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2])
    const ax: V3 = [(hi[0] - lo[0]) / L, (hi[1] - lo[1]) / L, (hi[2] - lo[2]) / L]
    const t: V3 = [d[1], -d[0], 0]
    const up: V3 = [ax[1] * t[2] - ax[2] * t[1], ax[2] * t[0] - ax[0] * t[2], ax[0] * t[1] - ax[1] * t[0]]
    const u: V3 = up[2] < 0 ? [-up[0], -up[1], -up[2]] : up
    box(white, [(lo[0] + hi[0]) / 2 + u[0] * 0.9, (lo[1] + hi[1]) / 2 + u[1] * 0.9, (lo[2] + hi[2]) / 2 + u[2] * 0.9], [ax, t, u], [L / 2, 0.7, 0.9])
  }
}

// The south-east end building and its scoreboard.
prism([[-36, 122], [28, 122], [26, 146], [-34, 148]], 0, 19.5, stone, roof)
{
  const I: [V3, V3, V3] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  box(dark, [-9, 118, 34], I, [15, 1.0, 6], true)
  box(white, [-9, 118.6, 40.3], I, [15.4, 1.4, 0.35])
  for (const x of [-20, 2]) box(white, [x, 119.5, 24], I, [0.8, 0.8, 4.5])
}

const parts = [
  { part: seats, material: finish('bengals-seats', 0x6a6e74) },
  { part: white, material: PALETTE.trim },
  { part: stone, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: finish('scoreboard', 0x4a4f57) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Paycor Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 142, osm: 'relation/280132', height: 62.7,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cin-paycor-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
