/**
 * Delacorte Theater, Central Park, on the south-west shore of Turtle Pond
 * (1962, Eldon Ehrlich and Charles Brannigan for Joseph Papp's Shakespeare
 * in the Park; renovated 2023–25 with a new wood-slat outer facade and
 * canopy) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-delacorte-theater.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: the
 * centroid of OSM way/278363024 (building=yes, "Delacorte Theater",
 * height=5.1), which this model replaces. The nearby buildings
 * way/278363035, way/278363048 (south, by the stage house) and
 * way/278363046 (toilets, north-west) lie outside the bowl and are left to
 * the map.
 *
 * Plan (OSM, fitted): a fan of seating round a centre at (2, −18), from
 * ~20° to 180° (math angle, from east), outer radius ~34.5; the outline's
 * concave inner edge (radius ~11) wraps the stage, which OSM leaves open.
 *
 * Heights. y = 0 is the path round the outside (lidar ground ~2.6 above
 * the box's lowest point).
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017), 0.5 m grid: the
 *   stage and front aisle ~+1.5, the rake rising ~0.27 m per metre of
 *   radius to the top row, ~+6.3 at radius 28; the back structure ~+3.4.
 * - The 2024 renovation is newer than the flight: the wood-slat wall is
 *   drawn to +7.0, its canopy at +3.1, estimated from the 2026 photo scaled
 *   on people (1.7 m) under the canopy.
 * - Estimated: the stage disc (radius 9.5), eight tiers and five aisles.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-delacorte-theater/photos):
 * - Jellybean222, "Delacorte Theater Exterior 2026.jpg", CC0,
 *   https://commons.wikimedia.org/wiki/File:Delacorte_Theater_Exterior_2026.jpg
 *   (the renovated outer wall: vertical red-brown wood slats, a deep
 *   canopy with the dark lettering band, ticket windows and gates)
 * - SnowFire, "Delacorte Theater stage The Winter's Tale-1 July 31 2026.jpg", CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Delacorte_Theater_stage_The_Winter%27s_Tale-1_July_31_2026.jpg
 *   (the round stage, the green seat banks, the inner side of the new wood walls)
 * - Rhododendrites, "Shakespeare in the Park July 2021.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Shakespeare_in_the_Park_July_2021.jpg
 *   (the bowl from the upper rows: tiers, aisles and rails, the stage)
 * - USGS NAIP (public domain) for the fan's plan and its aisles.
 *
 * Doubts: the lettering on the canopy is left as a plain dark band; the
 * steel lighting towers and the black stage-masking walls (both partly
 * seasonal) are left out, as is the set; the back of the new wall toward
 * the pond ends is estimated.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { board, type P2 } from './nyc-cp-dairy'
import { face } from './nyc-loeb-boathouse'

const seats = new Part(), concrete = new Part(), wood = new Part(), dark = new Part(), win = new Part(), deck = new Part()

const O: P2 = [2, -18]
const A0 = (20 * Math.PI) / 180, A1 = Math.PI
const SEG = 24
const R0 = 11.5, R1 = 29, Z0 = 1.5, Z1 = 6.2, TIERS = 8
const RW = 34.5, ZW = 7.0 // the outer wall
const ang = (i: number) => A0 + ((A1 - A0) * i) / SEG
const P = (r: number, a: number, z: number): V3 => [O[0] + r * Math.cos(a), O[1] + r * Math.sin(a), z]
const IN: V3 = [O[0], O[1], -50] // a point below, for winding tops upward

/** A ring band between radii r0..r1 at heights z0 (inner) and z1 (outer), facing up. */
function band(p: Part, r0: number, r1: number, z0: number, z1: number, a0 = A0, a1 = A1, n = SEG) {
  for (let i = 0; i < n; i++) {
    const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n
    face(p, [P(r0, t0, z0), P(r0, t1, z0), P(r1, t1, z1), P(r1, t0, z1)], IN)
  }
}
/** A vertical wall on radius r from z0 to z1, facing in (toward the stage) or out. */
function wall(p: Part, r: number, z0: number, z1: number, out: boolean, a0 = A0, a1 = A1, n = SEG) {
  for (let i = 0; i < n; i++) {
    const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n, tm = (t0 + t1) / 2
    const ref = out ? P(r - 1, tm, (z0 + z1) / 2) : P(r + 1, tm, (z0 + z1) / 2)
    face(p, [P(r, t0, z0), P(r, t1, z0), P(r, t1, z1), P(r, t0, z1)], ref)
  }
}

// --- The seating: eight tiers of green seats with grey concrete risers. ---
const dr = (R1 - R0) / TIERS, dz = (Z1 - Z0) / TIERS
const profile: P2[] = [[R0, 0]]
for (let k = 0; k < TIERS; k++) {
  const r0 = R0 + k * dr, r1 = r0 + dr, z = Z0 + k * dz
  wall(concrete, r0, k === 0 ? 0 : z - dz, z, false)
  band(k === 3 ? concrete : seats, r0, r1, z, z) // a cross aisle at the fourth tier
  profile.push([r0, z], [r1, z])
}
// Radial aisles: grey strips laid over the tiers.
for (const f of [0.2, 0.4, 0.6, 0.8]) {
  const a = A0 + (A1 - A0) * f, da = 0.6 / ((R0 + R1) / 2)
  for (let k = 0; k < TIERS; k++) {
    const r0 = R0 + k * dr, z = Z0 + k * dz + 0.04
    band(concrete, r0, r0 + dr, z, z, a - da, a + da, 1)
  }
}
// End walls of the bowl, stepped to the tiers.
profile.push([R1, ZW], [RW, ZW], [RW, 0])
for (const a of [A0, A1]) board(wood, profile, (r, z) => P(r, a, z), [-Math.sin(a), Math.cos(a), 0], 0.3)

// --- The outer ring: a roof rising to the wood-slat wall, a canopy, a dark lettering band. ---
band(concrete, R1, RW, Z1, ZW)
wall(wood, RW, 3.1, ZW, true)
wall(dark, RW + 0.03, 3.45, 4.15, true) // the lettering band
for (let i = 0; i < SEG; i++) { // under the canopy: wood with lit ticket windows and gates
  const t0 = ang(i), t1 = ang(i + 1)
  if (i % 3 === 1) {
    wall(win, RW, 0.2, 2.9, true, t0, t1, 1)
    wall(wood, RW - 0.05, 2.9, 3.1, true, t0, t1, 1)
  } else wall(wood, RW, 0, 3.1, true, t0, t1, 1)
}
const RC = RW + 2.2
band(wood, RW, RC, 3.15, 3.15)
for (let i = 0; i < SEG; i++) { // canopy soffit, facing down
  const t0 = ang(i), t1 = ang(i + 1)
  face(wood, [P(RW, t0, 2.95), P(RW, t1, 2.95), P(RC, t1, 2.95), P(RC, t0, 2.95)], P(RW + 1, (t0 + t1) / 2, 5))
}
wall(dark, RC, 2.95, 3.15, true)

// --- The round stage. ---
const disc: P2[] = Array.from({ length: 24 }, (_, i): P2 => [O[0] + 9.5 * Math.cos((i * Math.PI) / 12), O[1] + 9.5 * Math.sin((i * Math.PI) / 12)])
board(deck, disc, (x, y) => [x, y, Z0 / 2], [0, 0, 1], Z0)

finishModel('Delacorte Theater', 'nyc-delacorte-theater', [
  { part: seats, material: { name: 'seats', color: 0x5f7a62, roughness: 0.8 } },
  { part: concrete, material: { name: 'concrete', color: 0xb7b4ad, roughness: 0.9 } },
  { part: wood, material: { name: 'wood-slat', color: 0xb0705a, roughness: 0.85 } },
  { part: dark, material: { name: 'sign-band', color: 0x4a4f57, roughness: 0.7 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: deck, material: { name: 'stage', color: 0xcdcac2, roughness: 0.85 } },
], { bearing: 0, osm: 'way/278363024', height: ZW }, 5000)
