/**
 * Maymont Mansion (the Dooley mansion), Maymont, Richmond, Virginia (1893,
 * Edgerton Rogers; Richardsonian Romanesque in rock-faced sandstone) —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-maymont-mansion.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0 (OSM way/236149884's walls run at 0° and 87.4°,
 * close to north). The entrance front faces west.
 * Anchor = the centroid of way/236149884, -77.478269, 37.534435. The
 * generator is written in the lidar grid's frame (centred at -77.47828,
 * 37.53445) and shifted by the anchor's offset (1.0, -1.7) at the end.
 *
 * Identity (from the photos below):
 *  1. Two round corner towers on the west front under slate cones: the north
 *     one narrower with a steep cone, the south one wider with a lower cone.
 *  2. A steep central stone gable between them, steep slate hip roofs,
 *     dormers and tall stone chimneys.
 *  3. The one-storey wrap-around veranda on a rock-faced base, curving round
 *     the foot of both towers, on red granite columns under a dark roof.
 *  4. Buff-brown rock-faced sandstone throughout.
 *
 * Plan: OSM way/236149884, which takes in the veranda: its west edge
 * (x -9.6) and the two curves round the towers are the veranda's; the
 * house walls stand back at x -6.5 (from the lidar's veranda roof, x -10 to
 * -7). Towers: north r 2.6 at (-4.6, 5.6), south r 3.0 at (-5.0, -9.3),
 * concentric with the veranda's curves (estimated).
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid; the returns on the roof are sparse (many empty cells), so
 * these are read from a few points, above the ground (~1.2 in the grid):
 * veranda roof ~5.8, eaves ~10, main ridge ~16.3, the north cone ~16.4 at
 * its highest return (the finial is missed). Estimated from the photos:
 * the towers' wall heights (12.6), cones to 19.0 and 17.4, the gable,
 * chimneys, dormers, windows, the veranda base (1.3) and columns.
 *
 * Ground: lidar and Mapterhorn within ~0.6 m over the house; elevation 0.
 *
 * Night: the house is floodlit for events; windows glow.
 *
 * Photos (EVIDENCE):
 *  - Maymont Mansion.JPG, Morgan Riley, CC BY 3.0 (from the south-west)
 *    https://commons.wikimedia.org/wiki/File:Maymont_Mansion.JPG
 *  - Dooley Mansion - Maymont.JPG, Fopseh, CC BY-SA 3.0 (the west front)
 *    https://commons.wikimedia.org/wiki/File:Dooley_Mansion_-_Maymont.JPG
 *  - Dooley Mansion Front (3579565929).jpg, Chuck Redden, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Dooley_Mansion_Front_(3579565929).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east (service) side and the north side are not in any photo
 * used; they are plain walls with windows. The lidar is sparse here, so the
 * roof heights are approximate (±1 m). The porte-cochère and low wing that
 * the lidar shows south and east of the OSM outline are left out (not in
 * OSM's outline).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, gableRoof, hipRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, ccw, prism, save } from './atl-flatiron-building'

const stone = new Part(), slate = new Part(), win = new Part(), col = new Part(), base = new Part(), door = new Part()
const OX = 1.0, OY = -1.7
type F = [XY, XY]
const EAVE = 10.0

// ── Veranda: rock-faced base, red columns, low dark roof ──
const VER: XY[] = ccw([[-0.6, 8.0], [-2.5, 9.9], [-4.9, 10.4], [-7.3, 9.5], [-9.6, 5.0], [-9.6, -9.5], [-8.7, -12.1], [-6.8, -13.5], [-3.2, -13.5], [-0.6, -11.4]])
prism(base, VER, 0, 1.3, base, 0.1)
// columns along the outer edge, a bay about 2.6 m
{
  const outer: XY[] = [[-0.6, 8.0], [-2.5, 9.9], [-4.9, 10.4], [-7.3, 9.5], [-9.6, 5.0], [-9.6, -9.5], [-8.7, -12.1], [-6.8, -13.5], [-3.2, -13.5], [-0.6, -11.4]]
  let carry = 0
  for (let i = 0; i < outer.length - 1; i++) {
    const a = outer[i], b = outer[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    for (let s = carry; s < L; s += 2.6) {
      const p: XY = [a[0] + t[0] * s - n[0] * 0.55, a[1] + t[1] * s - n[1] * 0.55]
      // keep the columns on the veranda's own side of the ring
      const q: XY = [a[0] + t[0] * s + n[0] * 0.55, a[1] + t[1] * s + n[1] * 0.55]
      const c = Math.hypot(p[0] + 4, p[1]) < Math.hypot(q[0] + 4, q[1]) ? p : q
      revolve(col, c, [[0.24, 1.3], [0.22, 4.7], [0.3, 4.9]], 8, 0)
    }
    carry = (carry + 2.6 - (L % 2.6)) % 2.6
  }
  // the roof: a thin slab with a shallow slope up to the house
  prism(slate, VER.map(([x, y]) => [x + (x < -5 ? -0.3 : 0), y + (y > 7 ? 0.3 : y < -11 ? -0.3 : 0)] as XY), 4.9, 5.6, slate, 0.3, true)
  // entrance steps in the middle of the west front
  box(base, -11.4, -9.6, -3.6, -0.6, 0, 1.2, base, 0.05)
}

// ── The house ──
const A = { x0: -6.5, x1: 7.7, y0: -11.0, y1: 6.5 }
const B = { x0: 7.7, x1: 13.6, y0: -7.6, y1: 6.5 }
box(stone, A.x0, A.x1, A.y0, A.y1, 0, EAVE, null, 0)
box(stone, B.x0, B.x1, B.y0, B.y1, 0, EAVE - 1.0, null, 0)
box(base, A.x0 - 0.1, A.x1 + 0.1, A.y0 - 0.1, A.y1 + 0.1, 0, 1.3, null, 0)
box(base, B.x0 - 0.1, B.x1 + 0.1, B.y0 - 0.1, B.y1 + 0.1, 0, 1.3, null, 0)
hipRoof(slate, A.x0, A.x1, A.y0, A.y1, EAVE, 16.3, 0.5)
hipRoof(slate, B.x0, B.x1, B.y0, B.y1, EAVE - 1.0, 14.2, 0.5)
// the steep west gable over the middle of the front
gableRoof(slate, stone, -7.0, 1.5, -5.0, 2.4, EAVE, 15.6, 'x', 0.5, 0.3)
box(stone, -7.0, -6.5, -5.0, 2.4, 0, EAVE, null, 0)
// chimneys
for (const [x, y] of [[-1.5, 6.9], [4.5, -11.4], [10.5, 3.0]] as XY[]) box(stone, x - 0.7, x + 0.7, y - 0.6, y + 0.6, 8, 16.6, stone, 0.1)
// dormers on the main roof: south and north
for (const [x, y, dy] of [[2.5, -9.2, -1], [3.0, 4.6, 1]] as const) {
  box(stone, x - 1.0, x + 1.0, y - 1.0, y + 1.0, EAVE - 0.5, 12.6, null, 0)
  gableRoof(slate, stone, x - 1.0, x + 1.0, y - 1.0, y + 1.0, 12.6, 13.8, 'y', 0.2, 0.15)
  const f: F = dy < 0 ? [[x - 1.0, y - 1.0], [x + 1.0, y - 1.0]] : [[x + 1.0, y + 1.0], [x - 1.0, y + 1.0]]
  onWall(win, f[0], f[1], rectShape(0.55, 1.45, 10.4, 12.2), 0.06)
}

// ── Towers ──
function tower(c: XY, r: number, wall: number, cone: number) {
  revolve(base, c, [[r + 0.1, 0], [r + 0.1, 1.3]], 14, 0, false, false)
  revolve(stone, c, [[r, 1.3], [r, wall]], 14, 0, false, false)
  revolve(stone, c, [[r, wall], [r + 0.3, wall + 0.1], [r + 0.3, wall + 0.45]], 14, 0, false, false)
  revolve(slate, c, [[r + 0.35, wall + 0.45], [r * 0.92, wall + 1.0], [0.12, cone], [0, cone + 0.9]], 14, 0)
  // windows round the upper storeys, facing the front and sides
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + Math.PI / 14
    if (Math.cos(a) > 0.35) continue // the back, against the house
    const p0: XY = [c[0] + r * Math.cos(a - Math.PI / 14), c[1] + r * Math.sin(a - Math.PI / 14)]
    const p1: XY = [c[0] + r * Math.cos(a + Math.PI / 14), c[1] + r * Math.sin(a + Math.PI / 14)]
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    if (i % 2 === 0) {
      onWall(win, p0, p1, rectShape(L * 0.2, L * 0.8, 6.3, 8.4), 0.05)
      onWall(win, p0, p1, rectShape(L * 0.2, L * 0.8, 9.6, 11.4), 0.05)
    }
  }
}
tower([-4.6, 5.6], 2.6, 12.6, 19.0)
tower([-5.0, -9.3], 3.0, 12.6, 17.4)

// ── Windows on the house walls ──
const wins = (f: F, ss: number[], rows: [number, number][], w = 1.1) => {
  for (const s of ss) for (const [z0, z1] of rows) onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.06)
}
const W1: [number, number] = [2.0, 4.4], W2: [number, number] = [5.8, 8.2]
// west front gable bay (outside to the -x side): two windows a storey, one in the gable
{
  const f: F = [[-7.0, 2.4], [-7.0, -5.0]]
  wins(f, [2.4, 5.0], [W1, W2])
  onWall(win, f[0], f[1], rectShape(2.9, 4.5, 10.6, 12.6), 0.06)
  onWall(door, f[0], f[1], archShape(3.7, 1.8, 1.3, 3.6, 8), 0.08)
}
// south and north faces of the main block, the east block
wins([[A.x0, A.y0], [A.x1, A.y0]], [6.6, 9.2, 12.0], [W1, W2])
wins([[A.x1, A.y1], [A.x0, A.y1]], [1.8, 5.0, 8.0], [W1, W2])
wins([[B.x1, B.y0], [B.x1, B.y1]], [2.4, 5.4, 8.6, 11.6], [W1, W2])
wins([[B.x0, B.y0], [B.x1, B.y0]], [1.8, 4.2], [W1, W2])
wins([[B.x1, B.y1], [B.x0, B.y1]], [2.0, 4.0], [W1, W2])

// shift from the lidar frame to the anchor (glTF z = -north)
for (const p of [stone, slate, win, col, base, door]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= OX; p.pos[i + 2] += OY }

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.6)
await save('ric-maymont-mansion', 'Maymont Mansion', [
  { part: stone, material: { ...finish('maymont-sandstone', 0xcdb995), floodlight: lit } },
  { part: base, material: { ...finish('maymont-sandstone-base', 0xbba783), floodlight: lit } },
  { part: slate, material: finish('maymont-slate', 0x7f8a90) },
  { part: win, material: PALETTE.window },
  { part: col, material: finish('maymont-red-granite', 0xb37a66) },
  { part: door, material: finish('maymont-door', 0x6b4f3c) },
], { height: 19.9, anchor: [37.534435, -77.478269], bearing: 0 })
