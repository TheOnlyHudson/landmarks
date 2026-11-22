/**
 * Naumburg Bandshell, Central Park, at the north end of the Mall facing the
 * Concert Ground (1923, William G. Tachau, gift of Elkan Naumburg; Indiana
 * limestone) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-naumburg-bandshell.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 106.9°, so the shell's open face looks down model −y, which is
 * WNW (286.9°) toward the Concert Ground; the outline's straight front edge
 * runs at 16.9°. Anchor: the centroid of OSM way/265347581 (building=yes,
 * leisure=bandstand, "Naumburg Bandshell", height=12.8), which this model
 * replaces; no other building ways lie within 40 m.
 *
 * Plan (OSM, model frame): a straight front at y −3.6, x ±8.3, with the
 * back a semicircle of radius ~7.7 centred at y −2.8 (fitted to the
 * outline's nodes).
 *
 * Heights. y = 0 is the paved Concert Ground in front (the hill behind
 * rises ~3 m, so the back of the shell sinks into it).
 * - Measured, USGS 3DEP lidar NY_NewYorkCity (2017), 0.5 m grid read in
 *   this frame: the arch's crown +13.9 above the plaza at y ≈ −2; the
 *   shell's back falling to +12.6 at y +2, +10.8 at y +4 and ~+10 at
 *   y +5; the front face at y ≈ −4.4. OSM's height=12.8 is a little low.
 * - Estimated from the photos, scaled on that crown: stage 1.1 m, piers
 *   2.6 m wide with capitals at 6.6..7.0, the niche (radius 5.4, springing
 *   +7.0), the arch ring 1.4 m, the stepped courses of the outer dome, the
 *   coffers (six rows of octagons) and the stage door.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-naumburg-bandshell/photos):
 * - Ajay Suresh, "Central Park - Naumburg Bandshell (48377071721).jpg", CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_-_Naumburg_Bandshell_(48377071721).jpg
 *   (square on from the Concert Ground: arch, piers, coffered niche,
 *   stepped shoulders, stage; the green-roofed steel wings beside it are
 *   temporary staging and are left out)
 * - LR.127, "Naumburg Bandshell in Central Park, New York City - Oct 2024.jpg", CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Naumburg_Bandshell_in_Central_Park,_New_York_City_-_Oct_2024.jpg
 *   (the niche close up: coursed back wall, cornice, coffers, door)
 * - Syed07, "Naumburg Bandshell, New York City.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Naumburg_Bandshell,_New_York_City.jpg
 *   (the coffered half-dome from below: octagons in rows, a plain crown)
 *
 * Colours from the photos: pale grey-buff limestone, the coffers' recesses
 * a shade darker, a dark bronze stage door.
 *
 * Doubts: no licensed photo shows the back; its stepped courses follow the
 * shoulders seen from the front and the lidar's profile.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { board, box, type P2 } from './nyc-cp-dairy'

const stone = new Part(), coffer = new Part(), door = new Part()

const FRONT = -4.4, BACK_F = -2.6 // the arch frame's front and back faces
const NC = -3.3 // the niche's centre plane
const R = 5.4, SPRING = 7.0, STAGE = 1.1
const PIER = 8.0
const OC = -2.8, OR = 7.7 // the outer shell: centre and plan radius
const SEG = 12

const arc = (r: number, zc: number, a0: number, a1: number, n: number): P2[] =>
  Array.from({ length: n + 1 }, (_, i): P2 => { const a = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(a), zc + r * Math.sin(a)] })

// --- Stage: a limestone platform across the front and inside the niche. ---
box(stone, -PIER, FRONT - 0.3, PIER, NC, 0, STAGE)
{ // the niche floor follows the semicircle
  const pts: P2[] = arc(R + 0.1, 0, 0, Math.PI, SEG).map(([x, d]): P2 => [x, NC + d])
  board(stone, pts, (x, y) => [x, y, STAGE / 2], [0, 0, 1], STAGE)
}

// --- The arch frame: piers and the arch ring, with the opening cut out. ---
const RING = 6.8
const frame: P2[] = [[-PIER, 0], [-R, 0], [-R, SPRING], ...arc(R, SPRING, Math.PI, 0, SEG), [R, 0], [PIER, 0], [PIER, SPRING], ...arc(RING, SPRING, 0, Math.PI, SEG), [-PIER, SPRING]]
board(stone, frame, (x, z) => [x, (FRONT + BACK_F) / 2, z], [0, -1, 0], BACK_F - FRONT)
// The archivolt: a moulded band standing proud of the ring, and the keystone.
const band: P2[] = [...arc(RING - 0.05, SPRING, 0, Math.PI, SEG), ...arc(RING - 0.55, SPRING, Math.PI, 0, SEG)]
board(stone, band, (x, z) => [x, FRONT - 0.08, z], [0, -1, 0], 0.16)
// Pilasters on the piers, with capitals and a base.
for (const s of [-1, 1]) {
  const xc = s * (R + 1.3)
  box(stone, xc - 0.9, FRONT - 0.2, xc + 0.9, FRONT + 0.1, STAGE, 6.6)
  box(stone, xc - 1.15, FRONT - 0.4, xc + 1.15, FRONT + 0.1, 6.6, 7.15)
  box(stone, xc - 1.15, FRONT - 0.45, xc + 1.15, FRONT + 0.1, 0, STAGE + 0.25)
}
// Stepped shoulders behind the ring over the piers.
for (const s of [-1, 1]) {
  const steps: [number, number][] = [[7.9, 8.6], [7.4, 9.8], [6.8, 10.9]]
  for (const [x, z] of steps) {
    const x0 = Math.min(s * 6.0, s * x), x1 = Math.max(s * 6.0, s * x)
    box(stone, x0, BACK_F - 0.2, x1, BACK_F + 1.4, SPRING, z)
  }
}

// --- The niche: a coursed half-cylinder to the cornice, then the coffered half-dome. ---
const C: V3 = [0, NC, SPRING]
const P = (r: number, th: number, phi: number, zc = SPRING): V3 => [r * Math.cos(phi) * Math.cos(th), NC + r * Math.cos(phi) * Math.sin(th), zc + r * Math.sin(phi)]
for (let i = 0; i < SEG; i++) {
  const t0 = (i * Math.PI) / SEG, t1 = ((i + 1) * Math.PI) / SEG
  const n0: V3 = [-Math.cos(t0), -Math.sin(t0), 0], n1: V3 = [-Math.cos(t1), -Math.sin(t1), 0]
  const a = P(R, t0, 0, STAGE), b = P(R, t1, 0, STAGE), c = P(R, t1, 0, SPRING), d = P(R, t0, 0, SPRING)
  stone.tri(a, b, c, undefined, undefined, undefined, [n0, n1, n1]); stone.tri(a, c, d, undefined, undefined, undefined, [n0, n1, n0])
}
const ROWS = 7
for (let j = 0; j < ROWS; j++) for (let i = 0; i < SEG; i++) {
  const t0 = (i * Math.PI) / SEG, t1 = ((i + 1) * Math.PI) / SEG, f0 = (j * Math.PI) / 2 / ROWS, f1 = ((j + 1) * Math.PI) / 2 / ROWS
  const q = [P(R, t0, f0), P(R, t1, f0), P(R, t1, f1), P(R, t0, f1)]
  const nrm = q.map((v): V3 => [(C[0] - v[0]) / R, (C[1] - v[1]) / R, (C[2] - v[2]) / R])
  stone.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nrm[0], nrm[1], nrm[2]])
  stone.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nrm[0], nrm[2], nrm[3]])
}
// The cornice at the springing: a half-ring ledge.
board(stone, [...arc(R + 0.02, 0, 0, Math.PI, SEG), ...arc(R - 0.3, 0, Math.PI, 0, SEG)].map(([x, d]): P2 => [x, NC + d]), (x, y) => [x, y, SPRING - 0.12], [0, 0, 1], 0.24)
// Coffers: rows of octagons set flush in the vault, darker than the stone.
for (const [phiDeg, rad] of [[10, 0.62], [25, 0.6], [40, 0.55], [54, 0.5], [67, 0.42], [78, 0.28]] as [number, number][]) {
  const phi = (phiDeg * Math.PI) / 180, arcLen = Math.PI * R * Math.cos(phi)
  const n = Math.max(3, Math.round(arcLen / (rad * 2.25)))
  for (let k = 0; k < n; k++) {
    const th = ((k + 0.5) * Math.PI) / n
    const u: V3 = [Math.cos(phi) * Math.cos(th), Math.cos(phi) * Math.sin(th), Math.sin(phi)]
    const e1: V3 = [-Math.sin(th), Math.cos(th), 0]
    const e2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
    const c: V3 = [C[0] + u[0] * (R - 0.17), C[1] + u[1] * (R - 0.17), C[2] + u[2] * (R - 0.17)]
    const nn: V3 = [-u[0], -u[1], -u[2]]
    const ring = Array.from({ length: 8 }, (_, m): V3 => {
      const a = Math.PI / 8 + (m * Math.PI) / 4
      return [c[0] + rad * (Math.cos(a) * e1[0] + Math.sin(a) * e2[0]), c[1] + rad * (Math.cos(a) * e1[1] + Math.sin(a) * e2[1]), c[2] + rad * (Math.cos(a) * e1[2] + Math.sin(a) * e2[2])]
    })
    for (let m = 1; m < 7; m++) coffer.tri(ring[0], ring[m], ring[m + 1], undefined, undefined, undefined, [nn, nn, nn])
  }
}
// The stage door at the back of the niche, in a stone surround.
box(stone, -0.8, NC + R - 0.25, 0.8, NC + R - 0.02, STAGE, STAGE + 2.75)
box(door, -0.55, NC + R - 0.33, 0.55, NC + R - 0.2, STAGE, STAGE + 2.45)

// --- The outer shell: a half-cylinder rising into three stepped courses and a low dome. ---
const tiers: [number, number, number][] = [[OR, 0, 10.5], [7.1, 10.5, 11.3], [6.4, 11.3, 12.0]]
const Q = (r: number, th: number, z: number): V3 => [r * Math.cos(th), OC + r * Math.sin(th), z]
for (const [r, z0, z1] of tiers) {
  for (let i = 0; i < SEG; i++) {
    const t0 = (i * Math.PI) / SEG, t1 = ((i + 1) * Math.PI) / SEG
    const n0: V3 = [Math.cos(t0), Math.sin(t0), 0], n1: V3 = [Math.cos(t1), Math.sin(t1), 0]
    stone.tri(Q(r, t0, z0), Q(r, t1, z0), Q(r, t1, z1), undefined, undefined, undefined, [n0, n1, n1])
    stone.tri(Q(r, t0, z0), Q(r, t1, z1), Q(r, t0, z1), undefined, undefined, undefined, [n0, n1, n0])
  }
  // the course's top: a half-annulus out to its own radius
  board(stone, [...arc(r, 0, 0, Math.PI, SEG), [-0.01, 0], [0.01, 0]].map(([x, d]): P2 => [x, OC + d]), (x, y) => [x, y, z1 - 0.05], [0, 0, 1], 0.1, false)
}
// The dome's cap: sphere centred (0, OC, 5.0), radius 9, from r 5.66 (z 12.0) to its crown at 14.0.
const SR = 9, SZ = 5.0, AMAX = Math.asin(5.66 / SR)
for (let j = 0; j < 4; j++) for (let i = 0; i < SEG; i++) {
  const a0 = (AMAX * (4 - j)) / 4, a1 = (AMAX * (3 - j)) / 4, t0 = (i * Math.PI) / SEG, t1 = ((i + 1) * Math.PI) / SEG
  const S = (a: number, t: number): V3 => [SR * Math.sin(a) * Math.cos(t), OC + SR * Math.sin(a) * Math.sin(t), SZ + SR * Math.cos(a)]
  const q = [S(a0, t0), S(a0, t1), S(a1, t1), S(a1, t0)]
  const nrm = q.map((v): V3 => [v[0] / SR, (v[1] - OC) / SR, (v[2] - SZ) / SR])
  stone.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nrm[0], nrm[1], nrm[2]])
  if (j < 3) stone.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nrm[0], nrm[2], nrm[3]])
}
// Close the shell's section above the springing, behind the arch frame.
{
  const capR = (x: number) => SZ + Math.sqrt(SR * SR - x * x)
  const prof: P2[] = [[OR, SPRING], [OR, 10.5], [7.1, 10.5], [7.1, 11.3], [6.4, 11.3], [6.4, 12.0]]
  for (let i = 1; i <= 6; i++) { const x = 5.66 * (1 - i / 6); prof.push([x, capR(x)]) }
  const full: P2[] = [...prof, ...prof.slice(0, -1).reverse().map(([x, z]): P2 => [-x, z])]
  board(stone, [...full, ...arc(R, SPRING, Math.PI, 0, SEG)], (x, z) => [x, OC + 0.1, z], [0, -1, 0], 0.2)
}

finishModel('Naumburg Bandshell', 'nyc-naumburg-bandshell', [
  { part: stone, material: { name: 'limestone', color: 0xe2dacb, roughness: 0.85 } },
  { part: coffer, material: { name: 'coffer', color: 0xa89e8d, roughness: 0.9 } },
  { part: door, material: { name: 'bronze-door', color: 0x5b5048, roughness: 0.6 } },
], { bearing: 106.9, osm: 'way/265347581', height: 14.0 }, 5000)
