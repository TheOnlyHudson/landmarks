/**
 * Miami-Dade County Courthouse (73 West Flagler Street; 1925–1928,
 * A. Ten Eyck Brown with August Geiger) — original procedural geometry,
 * CC0-1.0.
 * bun generators/mia-dade-county-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/294683600,
 * 25.7745868, -80.1951364. Its walls run at 359.0° / 89.0°, so the catalog
 * bearing is 359.0 and the model is square to its own frame.
 *
 * Identity, in order: the pale limestone tower rising from a broad
 * podium, capped by a stepped (ziggurat) pyramid roof; the notched corners
 * of the top stage; the second stage ringed with engaged giant columns
 * under a balustrade; the loggia of giant fluted columns across nearly the
 * whole Flagler (north) front of the podium.
 *
 * Night: the tower and the second stage are washed in coloured light
 * (purple, red, blue, by occasion) in Pessar's and others' night photos;
 * the model floodlights the limestone above the podium (`floodlight`),
 * which the map lights warm white. The podium is unlit; the loggia's doors
 * are `entrance`.
 *
 * Evidence:
 *  - plan: OSM outline way/294683600 (podium, 50.2 × 53.4 m), part
 *    way/1105389930 (podium, 20 m), way/1105389931 (second stage, a square
 *    with notched corners, 32 m), way/467888602 (tower, 24 m square,
 *    pyramidal roof, 103.8 m). USGS NAIP for the plan and roofs.
 *  - heights: USGS lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 0.5 m grid, above the street (ground_min + 3.3 m; ground_min is
 *    in a pit): podium roof 14.6 and parapet 15.5; second stage roof 27.9
 *    and balustrade 29.2; the tower's corners step in at ~68.5; top stage
 *    cornice ~81; the pyramid's steps at 86.8, 89.6, 92.4, 95.4, 98.4 m,
 *    each about 2 m in from the last (a 58° slope, at the grid's 2 m
 *    sampling); top 102.4 (finial). OSM gives 103.8;
 *    published 28 storeys (Wikipedia).
 *  - tower centre and width from lidar (x -1, y 2; 24 m), matching OSM.
 *  - facade: from the photos below, scaled by the tower width: six window
 *    columns a tower face, two-storey panels; paired windows in the top
 *    stage; frieze bands at ~37 m and ~65 m; engaged columns on the second
 *    stage; sixteen columns in the north loggia, 0–11 m, across nearly the
 *    whole front between short end pavilions.
 *  - colour: pale grey-white limestone (a light finish); the ziggurat in a
 *    slightly darker stone tone, weathered as in the photos; flat roofs grey.
 *
 * Photos (Wikimedia Commons):
 *  - Dade_County_Courthouse_(Miami,_Florida).jpg (Tamanoeconomico, CC BY-SA 4.0)
 *  - Dade_County_Courthouse_(1).jpg (Tamanoeconomico, CC BY-SA 4.0)
 *  - Southwest_side_of_the_Dade_County_Courthouse_in_March_2011.jpg
 *    (Daniel Christensen, CC BY-SA 3.0)
 *  - Miami-Dade_County_Courthouse_EDSC06169.jpg (Bart Mariner, CC BY-SA 4.0)
 *  - Miami-Dade_County_Courthouse_-_Miami_-_Daniel_Di_Palma_Photography_14.jpg
 *    (Daniel Di Palma, CC BY-SA 4.0)
 *  - The_Miami_Dade_County_Flagler_Courthouse.jpg (Rob Olivera, CC BY 2.0),
 *    night
 * No look-only sources. No commercial imagery.
 *
 * Left out: the balusters (solid parapets), the rosettes of the friezes,
 * the capitals' carving, the entrance steps and the pierced screen wall
 * along the street, the flagpoles.
 *
 * Doubts: no licensed photo of the south face; it is drawn like the east.
 * Whether the west front also has ground-floor columns is unclear
 * (Di Palma's photo suggests a shallow colonnade); it is drawn with
 * windows. The ziggurat's terraces are read from the lidar (7 of them at
 * 2.35 m, against ~3 m at the grid's 2 m sampling); street photos see little
 * of them. The top stage's pilasters are simplified from the photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { notched, rectBays } from './chi-board-of-trade'
import { cornice, parapet, ring } from './mia-freedom-tower'

/** A shallow box standing on the wall a→b: s0..s1 along it, z0..z1, `d` proud, with its top. */
function pier(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number) {
  const { P } = onWall(a, b)
  const A0 = P(s0, z0, 0), B0 = P(s1, z0, 0), A1 = P(s0, z0, d), B1 = P(s1, z0, d)
  const up = (v: V3): V3 => [v[0], v[1], z1]
  p.quad(A1, B1, up(B1), up(A1)) // front
  p.quad(A0, A1, up(A1), up(A0)) // side at s0
  p.quad(B1, B0, up(B0), up(B1)) // side at s1
  p.quad(up(A1), up(B1), up(B0), up(A0)) // top
}

/** A projecting belt around ring r, z0..z1, `d` proud, with top and underside. */
function belt(p: Part, r: XY[], z0: number, z1: number, d: number) {
  const o = inset(r, -d)
  walls(p, o, z0, z1)
  ring(p, o, r, z1)
  for (let k = 0; k < r.length; k++) {
    const l = (k + 1) % r.length
    p.quad([r[k][0], r[k][1], z0], [r[l][0], r[l][1], z0], [o[l][0], o[l][1], z0], [o[k][0], o[k][1], z0])
  }
}

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), crown = new Part()

  // --- Podium: 0–14.6 m, with the loggia cut into the north front below
  // the entablature.
  const P = rect(-25.1, -26.7, 25.1, 26.7)
  const LX = 20.5, LY = 23.2
  const LOW: XY[] = [[-25.1, -26.7], [25.1, -26.7], [25.1, 26.7], [LX, 26.7], [LX, LY], [-LX, LY], [-LX, 26.7], [-25.1, 26.7]]
  walls(stone, LOW, 0, 11)
  walls(stone, P, 11, 13.8)
  cap(stone, rect(-LX, LY, LX, 26.7), 11, false) // the loggia's ceiling
  cornice(trim, P, 13.8, 14.2, 14.6, 0.4)
  cap(roof, P, 14.6)
  parapet(trim, P, 14.6, 15.5, 0.35)
  belt(trim, LOW, 0, 1.2, 0.15)
  rectBays(win, LOW, [[1.8, 6.8], [7.8, 10.2]], { bay: 1.8, gap: 2.6, end: 1.4, skip: [3, 4, 5] })
  rectBays(win, P, [[11.5, 13.1]], { bay: 1.8, gap: 2.6, end: 1.4, skip: [2] })
  // The loggia: sixteen fluted columns across nearly the whole north
  // front, between short end pavilions (Bart Mariner's and Tamanoeconomico's
  // photos); doors and tall windows on the wall behind.
  for (let k = 0; k < 16; k++) {
    const x = -19.5 + k * 2.6
    lathe(trim, x, 25.75, [[0.85, 0], [0.85, 0.7], [0.58, 0.8], [0.55, 9.9], [0.85, 10.4], [0.85, 11]], 8, Math.PI / 8)
  }
  {
    const a: XY = [LX, LY], b: XY = [-LX, LY] // the recessed wall, facing north
    for (const c of [13.4, 20.5, 27.6]) {
      panel(door, a, b, c - 1.4, c + 1.4, 0.4, 4.8, 0.05)
      panel(win, a, b, c - 1.4, c + 1.4, 5.6, 9.6, 0.05)
    }
    for (const c of [2.6, 6.9, 34.1, 38.4]) panel(win, a, b, c - 0.9, c + 0.9, 2.0, 9.6, 0.05)
  }

  // --- Second stage: the OSM part, a square with notched corners, ringed
  // with engaged giant columns under a cornice and balustrade.
  const S2: XY[] = ([[-17.0, 22.4], [15.8, 22.7], [15.8, 18.7], [20.6, 18.7], [21.1, -14.7], [16.5, -14.7], [16.5, -19.0], [-16.2, -19.4], [-16.3, -14.6], [-21.3, -14.7], [-21.7, 18.2], [-16.9, 18.2]] as XY[]).reverse()
  walls(stone, S2, 14.6, 26.6)
  cornice(trim, S2, 26.6, 27.2, 27.9, 0.4)
  cap(roof, S2, 27.9)
  parapet(trim, S2, 27.9, 29.2, 0.3)
  for (let i = 0; i < S2.length; i++) {
    const a = S2[i], b = S2[(i + 1) % S2.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 20) {
      // A corner pavilion's face: one tall window pair.
      if (L > 3.5) for (const [z0, z1] of [[16.2, 19.8], [21.0, 25.4]]) panel(win, a, b, L / 2 - 0.8, L / 2 + 0.8, z0, z1, 0.05)
      continue
    }
    const n = Math.round((L - 3) / 3.6), sp = (L - 3) / n
    for (let k = 0; k <= n; k++) {
      const s = 1.5 + k * sp
      pier(trim, a, b, s - 0.45, s + 0.45, 15.2, 26.6, 0.5)
      if (k < n) for (const [z0, z1] of [[16.2, 19.8], [21.0, 25.4]]) panel(win, a, b, s + 0.95, s + sp - 0.95, z0, z1, 0.05)
    }
  }

  // --- Tower: 24 m square to 68.5 m, then the top stage with notched
  // corners, cornice, attic and the stepped pyramid.
  const TX = -0.5, TY = 1.9, H = 12
  const SH = rect(TX - H, TY - H, TX + H, TY + H)
  walls(stone, SH, 27.9, 68.5)
  belt(trim, SH, 36.4, 37.2, 0.2)
  belt(trim, SH, 64.6, 65.8, 0.25)
  cap(roof, SH, 68.5)
  for (let i = 0; i < 4; i++) {
    const a = SH[i], b = SH[(i + 1) % 4]
    for (let k = 0; k < 6; k++) {
      const c = 3.0 + k * 3.6
      panel(win, a, b, c - 0.7, c + 0.7, 30.0, 35.4, 0.05)
      for (let r = 0; r < 4; r++) panel(win, a, b, c - 0.7, c + 0.7, 38.6 + 6.5 * r, 43.4 + 6.5 * r, 0.05)
      panel(win, a, b, c - 0.7, c + 0.7, 66.6, 68.0, 0.05)
    }
  }
  const U = notched(TX - H, TY - H, TX + H, TY + H, 2.0)
  walls(stone, U, 68.5, 80.2)
  cornice(trim, U, 80.2, 80.9, 81.6, 0.5)
  {
    // Paired windows in three groups a face, two tiers.
    const q = rect(TX - H, TY - H, TX + H, TY + H)
    for (let i = 0; i < 4; i++) {
      const a = q[i], b = q[(i + 1) % 4]
      for (const c of [6.2, 12, 17.8]) for (const [z0, z1] of [[69.6, 74.0], [75.0, 79.2]]) panel(win, a, b, c - 1.4, c + 1.4, z0, z1, 0.05)
      // Bold engaged pilasters framing the three window groups: the top
      // stage's loggia-like order under the cornice.
      for (const c of [3.1, 9.1, 14.9, 20.9]) pier(trim, a, b, c - 0.5, c + 0.5, 68.8, 80.2, 0.45)
    }
  }
  const A = notched(TX - 11.2, TY - 11.2, TX + 11.2, TY + 11.2, 1.6)
  block(stone, roof, A, 81.6, 83.6, 0.25)
  {
    const q = rect(TX - 11.2, TY - 11.2, TX + 11.2, TY + 11.2)
    for (let i = 0; i < 4; i++) for (const c of [5.6, 11.2, 16.8]) panel(win, q[i], q[(i + 1) % 4], c - 0.6, c + 0.6, 82.0, 83.1, 0.05)
  }
  // The crown: a stepped stone ziggurat, seven bold terraces each with a
  // vertical riser, in the 58° envelope the lidar shows (about 2.35 m up
  // for every 1.45 m in), ending in the small top block at 102.4 m.
  {
    const zb = 83.6, rise = 2.35, run = 1.45, base = 10.6, n = 7
    let z0 = zb
    for (let k = 0; k < n; k++) {
      const h = base - k * run
      block(crown, crown, rect(TX - h, TY - h, TX + h, TY + h), z0, z0 + rise, 0.3)
      z0 += rise
    }
    block(crown, crown, rect(TX - 0.9, TY - 0.9, TX + 0.9, TY + 0.9), z0, 102.4, 0.2)
  }

  // Floodlight: the limestone above the podium.
  const floodlit = (p: V3, n: V3) => (p[2] < 14.9 ? 0 : n[2] > 0.7 ? 0.3 : 0.6 + 0.4 * Math.min(1, (p[2] - 15) / 70))
  return [
    { part: stone, material: { ...finish('dcc-limestone', 0xe9e6de), floodlight: floodlit } },
    { part: trim, material: { ...finish('dcc-trim', 0xf7f4ec), floodlight: floodlit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    // The crown's stone, a shade darker than the walls (weathered, and the
    // terraces' shadow lines in the photos).
    { part: crown, material: { ...finish('dcc-crown', 0xd8d3c7), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.5) } },
  ]
}

if (import.meta.main) await save('mia-dade-county-courthouse', 'Miami-Dade County Courthouse', [25.7745868, -80.1951364], 359.0, build(), 6500)
