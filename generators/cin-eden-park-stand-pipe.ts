/**
 * Eden Park Stand Pipe, Eden Park, Cincinnati (1894; a Romanesque
 * Revival water tower round a standpipe) — original
 * procedural geometry, CC0-1.0.
 * bun generators/cin-eden-park-stand-pipe.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0. Anchor = centroid of OSM way/46648946,
 * -84.490279, 39.117325.
 *
 * Identity (from the photos below):
 *  1. A tall round red-brick shaft on a pale rusticated stone base.
 *  2. A taller, slender round stair turret clasped to its south-east
 *     side, rising above the main tower's top.
 *  3. The crown: a corbelled band in pale stone, a red-and-cream
 *     chequered frieze with the top windows, a second chequer band and a
 *     flat parapet; the turret has its own corbelled cap.
 *  4. Pale stone bands round the shaft, small windows climbing it, and
 *     the arched door in the base.
 *
 * Plan: OSM way/46648946 (outline), building:part way/1453472810 (main
 * shaft), way/1453472811 (turret), way/1453472812 and way/1453473665
 * (low infills between them). Lidar puts the turret about 1 m north-east
 * of its OSM ring; the model follows lidar.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown about 2021), 0.5 m grid. y = 0 is the lowest ground at the tower
 * (lidar ground_min + 2.9; the knoll is within 0.7 m round it). Measured:
 * main tower roof 37.4, parapet 38.4; turret top 45.1; main crown
 * diameter about 11.6 m, turret about 4.6 m. OSM's height tags (46 and
 * 52) are above a different datum and are not used. Estimated from the
 * photos: the stone base to 10.5 m, the band and frieze heights, window
 * sizes and places, the door.
 *
 * Ground: Mapterhorn is within about 1 m over the site; elevation 0.
 *
 * Night: the windows glow; the tower is not floodlit in the photos.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Eden Park Stand Pipe, Cincinnati.jpg, EEJCC, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Eden_Park_Stand_Pipe,_Cincinnati.jpg
 *  - Eden Park Stand Pipe, south end.jpg, Joestn, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Eden_Park_Stand_Pipe,_south_end.jpg
 *  - EdenParkStandPipe.jpg, Greg Hume (Greg5030), CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:EdenParkStandPipe.jpg
 *  - EdenParkStandPipe02.JPG, Greg Hume, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:EdenParkStandPipe02.JPG
 * No look-only sources. No commercial imagery.
 *
 * Doubts: which way the door faces is read from the photos' turret side
 * (east-north-east); the window places round the shaft are approximate.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { revolve, save, type XY } from './atl-tech-tower'

const TAU = Math.PI * 2

/** Flat panels on a cylinder (centre c, radius r) between azimuths a0..a1 (radians, CCW from east) and heights. */
function cylPanel(p: Part, c: XY, r: number, a0: number, a1: number, z0: number, z1: number, n = 2) {
  for (let i = 0; i < n; i++) {
    const t0 = a0 + (a1 - a0) * i / n, t1 = a0 + (a1 - a0) * (i + 1) / n
    const A: V3 = [c[0] + r * Math.cos(t0), c[1] + r * Math.sin(t0), z0]
    const B: V3 = [c[0] + r * Math.cos(t1), c[1] + r * Math.sin(t1), z0]
    p.quad(A, B, [B[0], B[1], z1], [A[0], A[1], z1])
  }
}
/** A round-headed window on a cylinder at azimuth a: width w (m), sill z0, springing zs. */
function cylArch(p: Part, c: XY, r: number, a: number, w: number, z0: number, zs: number, seg = 6) {
  const hw = w / 2 / r
  cylPanel(p, c, r, a - hw, a + hw, z0, zs, 1)
  const P = (t: number, z: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
  const centre = P(a, zs)
  for (let i = 0; i < seg; i++) {
    const u0 = Math.PI * i / seg, u1 = Math.PI * (i + 1) / seg
    const q0 = P(a + hw * Math.cos(u0), zs + (w / 2) * Math.sin(u0)), q1 = P(a + hw * Math.cos(u1), zs + (w / 2) * Math.sin(u1))
    p.tri(centre, q0, q1)
  }
}

if (import.meta.main) {
  const brick = new Part(), stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const C: XY = [-0.55, 0.8], RB = 5.9, RS = 5.2, RT = 2.3
  const T: XY = [4.0, -4.6]
  const ZB = 10.5, ZTOP = 37.4, ZPAR = 38.4, ZTT = 45.1
  const N = 16

  // ── main tower ──
  // stone base with a battered water table, then the brick shaft
  revolve(stone, C, [[RB, 0], [RB, ZB - 1.0], [RS + 0.25, ZB]], N, 0, true, false)
  revolve(trim, C, [[RS + 0.25, ZB], [RS + 0.25, ZB + 0.45], [RS, ZB + 0.5]], N, 0, true, false)
  revolve(brick, C, [[RS, ZB + 0.5], [RS, 26.0]], N, 0, false, false)
  // pale stone belt courses on the shaft
  for (const z of [15.6, 20.8]) revolve(trim, C, [[RS, z], [RS + 0.12, z], [RS + 0.12, z + 0.5], [RS, z + 0.5]], N, 0, true, false)
  // the corbelled crown: corbel table stepping out, chequered frieze, cornice and parapet
  const RC = 5.75
  revolve(trim, C, [[RS, 26.0], [RS + 0.2, 26.4], [RC - 0.15, 27.6], [RC, 28.0]], N, 0, true, false)
  revolve(brick, C, [[RC, 28.0], [RC, ZTOP - 0.3]], N, 0, false, false)
  revolve(trim, C, [[RC, ZTOP - 0.3], [RC + 0.12, ZTOP - 0.2], [RC + 0.12, ZPAR], [RC - 0.35, ZPAR]], N, 0, true, false)
  revolve(roof, C, [[RC - 0.35, ZPAR], [RC - 0.35, ZTOP], [0, ZTOP]], N, 0, true, false)

  // chequer bands: cream squares on the brick, two staggered rows
  const cheq = (z0: number, rows: number, h: number, cells: number, r: number, c: XY, amin = 0, amax = TAU) => {
    for (let row = 0; row < rows; row++) for (let k = 0; k < cells; k++) {
      if ((k + row) % 2) continue
      const a0 = amin + (amax - amin) * k / cells, a1 = amin + (amax - amin) * (k + 1) / cells
      cylPanel(trim, c, r + 0.04, a0, a1, z0 + row * h, z0 + (row + 1) * h, 1)
    }
  }
  cheq(28.3, 2, 0.75, 40, RC, C)
  cheq(35.2, 2, 0.75, 40, RC, C)

  // windows: the top frieze (paired square-headed lights on six sides), small windows up the shaft
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * TAU + Math.PI / 6
    for (const d of [-0.1, 0.1]) cylPanel(win, C, RC + 0.06, a + d - 0.075, a + d + 0.075, 30.6, 33.6, 1)
  }
  for (const a of [Math.PI / 2, Math.PI, 1.5 * Math.PI, 0.3]) {
    for (const z of [13.0, 18.0, 23.0]) cylPanel(win, C, RS + 0.06, a - 0.07, a + 0.07, z, z + 1.6, 1)
  }

  // ── stair turret, clasped to the south-east ──
  revolve(stone, T, [[RT + 0.35, 0], [RT + 0.35, ZB - 0.6], [RT, ZB]], 12, 0, true, false)
  revolve(brick, T, [[RT, ZB], [RT, 41.8]], 12, 0, false, false)
  for (const z of [15.6, 20.8, 26.0]) revolve(trim, T, [[RT, z], [RT + 0.1, z], [RT + 0.1, z + 0.45], [RT, z + 0.45]], 12, 0, true, false)
  revolve(trim, T, [[RT, 41.8], [RT + 0.45, 42.6], [RT + 0.45, 43.0]], 12, 0, true, false)
  revolve(brick, T, [[RT + 0.45, 43.0], [RT + 0.45, ZTT - 0.4]], 12, 0, false, false)
  revolve(trim, T, [[RT + 0.45, ZTT - 0.4], [RT + 0.55, ZTT - 0.3], [RT + 0.55, ZTT], [RT + 0.2, ZTT], [RT + 0.2, ZTT - 0.3], [0, ZTT - 0.3]], 12, 0, true, false)
  cheq(39.6, 2, 0.6, 16, RT, T)
  // turret slit windows on its outer faces
  const aOut = Math.atan2(T[1] - C[1], T[0] - C[0])
  for (const d of [-0.9, 0, 0.9]) for (const z of [14, 19, 24, 29, 34]) cylPanel(win, T, RT + 0.05, aOut + d - 0.12, aOut + d + 0.12, z + (d === 0 ? 0 : 1.2), z + 1.4 + (d === 0 ? 0 : 1.2), 1)
  for (const d of [-0.6, 0.6]) cylArch(win, T, RT + 0.5, aOut + d, 0.6, 43.3, 44.1, 4)

  // low stone infills between turret and tower (OSM way/1453472812, /1453473665)
  {
    const ring: XY[] = [[-1.6, -4.9], [2.4, -7.0], [6.0, -5.3], [5.9, -1.0], [4.9, -1.2], [2.0, -3.5]]
    const zt = ZB - 1.0
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zt], [a[0], a[1], zt])
    }
    for (let i = 1; i < ring.length - 1; i++) trim.tri([ring[0][0], ring[0][1], zt], [ring[i][0], ring[i][1], zt], [ring[i + 1][0], ring[i + 1][1], zt])
  }

  // the arched door in the base, east-north-east, in a pale surround
  {
    const a = (90 - 70) * Math.PI / 180
    cylArch(trim, C, RB + 0.05, a, 2.6, 0, 2.6)
    cylArch(door, C, RB + 0.1, a, 1.8, 0, 2.6)
    // a second, smaller window over it
    cylArch(win, C, RB + 0.06, a, 0.9, 5.0, 6.2, 4)
  }

  await save('cin-eden-park-stand-pipe', 'Eden Park Stand Pipe', [
    { part: brick, material: finish('standpipe-brick', 0xb9624c) },
    { part: stone, material: finish('standpipe-stone', 0xe2d6bd) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('standpipe-door', 0x5a4a3e) },
  ], { height: ZTT, anchor: [39.117325, -84.490279], bearing: 0 })
}
