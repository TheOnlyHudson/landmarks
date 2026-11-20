/**
 * Daniels & Fisher Tower, Denver (1910–1911, Frederick J. Sterner, after
 * St Mark's Campanile; the store it fronted was pulled down in 1971) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-daniels-and-fisher-tower.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 45: +y is the
 * tower's north-east face (the old store side), +x its south-east face
 * (Arapahoe Street), -y the south-west face, -x the north-west face (16th
 * Street Mall). Origin on the ground at the anchor, the area centroid of OSM
 * way/36729544 (-104.9956877, 39.7481017).
 *
 * Identity, in order:
 *  1. the tall plain square shaft of buff brick, three columns of windows
 *     bunched in the middle of each face and wide blank corners; an arched
 *     top row under the cornice.                         (gass, levine)
 *  2. the open loggia stage: three tall round arches per face between
 *     pale columns, over a balustrade.                (gass, zirkel, shank)
 *  3. the set-back clock stage with a big round clock on every face, and a
 *     balcony cornice under it.                        (gass, zirkel)
 *  4. the steep pyramidal cap with a small dormer, a balustraded platform
 *     and an open cupola with a gilded dome.            (gass, zirkel)
 *  5. the cream terracotta base with a big arched opening; the red-brick
 *     scar of the demolished store on the north-east face.   (levine, mcleod)
 *
 * Plan: OSM way/36729544 is a square 14.2 × 14.4 m; drawn as a 14.2 m
 * square about the anchor. Stage widths from the lidar and the gass photo
 * (an elevation from far down Arapahoe Street, scaled by the 14.2 m shaft).
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, read
 * with tools/lidar_frame.py at bearing 45. ground_min 1589.08 m; the ground
 * round the tower is 0.7–1.2 m above it (flat; Mapterhorn agrees within
 * 0.9 m), y = 0 here is 0.9 m above ground_min. Measured above y = 0:
 * shaft and loggia top 65.6 (outer ring, half-width 7.2), balcony rail 67.7,
 * clock stage cornice 75.7–77.5 (half 5.5–6), pyramid foot ~79 at half 4.5,
 * cupola platform 92.8 (half 2.5–3), cupola cornice 97.7, dome top 99.4,
 * flagpole tip 107.8 (left out). Published: 325 ft / 99 m, 20 floors
 * (Wikipedia "Daniels & Fisher Tower"); clock faces 16 ft / 4.9 m across
 * (same). The lidar tower sits about 1 m east of the OSM square; the model
 * follows OSM.
 *
 * Estimated from the gass photo, scaled to the lidar (6.4 px/m between the
 * dome top and the base's top band at OSM's 9.5–10 m part): base top 10;
 * shaft cornice 54.6–56.2; balustrade 56.2–57.5; arches 2.2 m wide at
 * 2.6 m centres, 57.6 to 64.8; window columns 1.4 m wide at 2.6 m centres,
 * floors 3.75 m, arched row 48–50.6; clock centre 73.2; pyramid half 4.4
 * at its foot to 1.9 at the platform; the cupola's eight columns. The
 * base's arch, about 5 m wide, 9 m high. The scar's top (about 25 m) by
 * counting window rows in the levine photo.
 * Left out: the bell, the flagpole, the frieze and attic windows, the lamp
 * brackets, the balcony over the door, the cartouches.
 *
 * Photos (Wikimedia Commons, evidence):
 *  gass     "Daniels & Fisher Tower from Arapahoe St.jpg", Alan G Gass,
 *           CC BY-SA 4.0 (south-west face, far, nearly an elevation)
 *  levine   "Daniels and Fisher Tower.jpg", Djlevine, CC BY-SA 3.0 (from
 *           the east: south-east face and the scarred north-east face)
 *  shank    "Daniels & Fisher tower in Denver Colorado.JPG", David
 *           Shankbone, CC BY 3.0 (from high up, two faces)
 *  zirkel   "Daniels & Fisher Tower detail.jpg", Kenneth C. Zirkel,
 *           CC BY-SA 4.0 (loggia, clock stage and cupola)
 *  makbeta  "Daniels & Fisher Tower.jpg", Makbeta, CC BY-SA 3.0 (16th St
 *           Mall, from the north-west)
 *  conduqtor "Daniels & Fisher Tower, Denver, CO, 29 September, 2006.JPG",
 *           TheConduqtor, CC BY-SA 3.0
 *  mcleod   "Daniels and Fisher Tower (55242051522).jpg", Scott McLeod,
 *           CC BY 4.0 (the entrance arch)
 *  sableman "Downtown Denver Clocktower (4931686046).jpg", Paul Sableman,
 *           CC BY 2.0 (night)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north-west face's base arch is assumed like the south-east
 * and south-west ones (no clear photo of that face's foot). The scar's
 * outline is simplified to a rectangle with a cut corner.
 *
 * Night (sableman): the whole tower is floodlit warm; the loggia, the
 * clocks and the doors glow (window); the shaft's windows are dark in the
 * photo, so they are a separate unlit finish of the window colour; the
 * cupola is lit in colours (left as floodlit gold).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { split } from './atl-flatiron-building'

// `win` glows at night (the loggia, the clocks, the doors); `shaftWin` is the
// shaft's office windows, dark in the night photo.
const brick = new Part(), cream = new Part(), scar = new Part(), win = new Part(), gold = new Part(), shaftWin = new Part()

const sq = (h: number): XY[] => ccw([[-h, -h], [h, -h], [h, h], [-h, h]])
/** The four faces of a square of half-size h: [a, b] with the outside to the right. */
const faces = (h: number): [XY, XY][] => {
  const r = sq(h)
  return r.map((a, i) => [a, r[(i + 1) % 4]] as [XY, XY])
}
// faces(h)[0] is the south-west face (-y), 1 the south-east (+x),
// 2 the north-east (+y, the scar), 3 the north-west (-x).

const H = 7.1
// ── Base: cream terracotta, 0–10 m, its walls split for the terrain ──
prism(cream, split(sq(H), 4.8), 0, 10.3, null, 0.15)
cornice(cream, sq(H), 9.4, 0.9, 0.25, null)
// ── Shaft of buff brick, to the cornice ──
prism(brick, sq(H), 10.3, 54.6, null, 0)
cornice(cream, sq(H), 54.6, 1.6, 0.5, cream)
// ── Loggia stage: balustrade, three arches per face, columns ──
prism(cream, sq(H - 0.15), 56.2, 57.5, null, 0)
prism(brick, sq(H), 57.5, 65.6, null, 0)
cornice(cream, sq(H), 65.0, 1.3, 0.55, cream)
// the balcony rail, solid, inside the cornice's edge
prism(cream, sq(6.6), 66.4, 67.7, cream, 0.12)

for (const [a, b] of faces(H)) {
  const L = 2 * H, m = L / 2
  for (const c of [-2.6, 0, 2.6]) onWall(win, a, b, archShape(m + c, 2.2, 57.6, 63.7, 10), 0.06)
  // columns standing before the piers
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  for (const c of [-3.9, -1.3, 1.3, 3.9]) {
    const p: XY = [a[0] + t[0] * (m + c) + n[0] * 0.35, a[1] + t[1] * (m + c) + n[1] * 0.35]
    revolve(cream, p, [[0.24, 57.5], [0.2, 63.7]], 8, 0, false, false)
  }
}

// ── Clock stage: pedestal, stage, cornice, attic ──
prism(cream, sq(5.6), 67.7, 69.5, null, 0)
prism(brick, sq(5.25), 69.5, 76.4, null, 0)
cornice(cream, sq(5.25), 76.0, 1.6, 0.7, cream)
prism(brick, sq(5.15), 77.6, 78.8, null, 0.1)
for (const [a, b] of faces(5.25)) {
  const m = 5.25
  onWall(cream, a, b, rectShape(m - 2.85, m + 2.85, 70.4, 75.9), 0.03)
  const ring: [number, number][] = Array.from({ length: 16 }, (_, i) => [m + 2.5 * Math.cos((i / 16) * Math.PI * 2), 73.15 + 2.5 * Math.sin((i / 16) * Math.PI * 2)])
  onWall(win, a, b, ring, 0.07)
}

// ── Pyramid cap with a dormer on each face ──
const P0 = 78.8, P1 = 90.4, R0 = 4.4, R1 = 1.9
{
  const lo = sq(R0), hi = sq(R1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    brick.quad([lo[i][0], lo[i][1], P0], [lo[j][0], lo[j][1], P0], [hi[j][0], hi[j][1], P1], [hi[i][0], hi[i][1], P1])
  }
  // the dormers: flush panels on the slope, 0.9 m wide, 84.6–86.4
  const slope = (P1 - P0) / (R0 - R1)
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 // 0: -y face
    const dir: XY = [Math.sin(ang), -Math.cos(ang)], tan: XY = [Math.cos(ang), Math.sin(ang)]
    const nl = Math.hypot(1, 1 / slope), off = 0.06
    const pt = (s: number, z: number): V3 => {
      const r = R0 - (z - P0) / slope
      return [dir[0] * (r + off / nl) + tan[0] * s, dir[1] * (r + off / nl) + tan[1] * s, z + off / (nl * slope)]
    }
    win.quad(pt(-0.45, 84.6), pt(0.45, 84.6), pt(0.45, 86.4), pt(-0.45, 86.4))
  }
}
// ── Platform, balustrade, cupola, gilded dome ──
box(cream, -2.5, 2.5, -2.5, 2.5, 90.4, 91.3, null, 0.15)
prism(cream, sq(2.5), 91.3, 92.8, null, 0.1)
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + Math.PI / 8
  revolve(cream, [1.5 * Math.cos(a), 1.5 * Math.sin(a)], [[0.2, 92.8], [0.17, 97.0]], 6, 0, false, false)
}
revolve(cream, [0, 0], [[1.85, 97.0], [1.85, 97.7], [1.7, 97.7]], 16, 0, true, true)
const dome: [number, number][] = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 5) * (Math.PI / 2)
  return [1.7 * Math.cos(a), 97.7 + 1.7 * Math.sin(a)] as [number, number]
})
revolve(gold, [0, 0], dome, 16, 0, false, false)
revolve(gold, [0, 0], [[0.12, 99.3], [0.12, 100.2], [0.25, 100.4], [0, 100.7]], 8, 0, false, true)

// ── Base: entrance arches (SE, SW, NW), the shaft's windows ──
const fz = faces(H)
for (const k of [0, 1, 3]) {
  const [a, b] = fz[k]
  onWall(cream, a, b, archShape(H, 6.0, 0.6, 6.4, 12), 0.03)
  onWall(win, a, b, archShape(H, 4.8, 1.0, 6.4, 12), 0.07)
}
// shaft: three window columns bunched in the middle, floors of 3.75 m,
// drawn two floors to a panel; the top row arched
const ROW0 = 11.9, FL = 3.75, WH = 2.0
for (let k = 0; k < 4; k++) {
  const [a, b] = fz[k]
  for (const c of [-2.6, 0, 2.6]) {
    for (let g = 0; g < 5; g++) {
      const z0 = ROW0 + g * 2 * FL, z1 = z0 + FL + WH
      onWall(shaftWin, a, b, rectShape(H + c - 0.7, H + c + 0.7, z0, z1), 0.06)
    }
    onWall(shaftWin, a, b, archShape(H + c, 1.4, 48.0, 49.9, 8), 0.06)
  }
}
// the scar of the demolished store on the north-east face: red brick to
// about 25 m, its upper south-east corner cut, from the ground
{
  const [a, b] = fz[2]
  onWall(scar, a, b, [[0.05, 0], [2 * H - 0.05, 0], [2 * H - 0.05, 25.2], [2.8, 25.2], [0.05, 22.4]], 0.03)
}

await save('den-daniels-and-fisher-tower', 'Daniels & Fisher Tower', [
  { part: brick, material: { ...finish('df-brick', 0xd8bf98), floodlight: (_p, n) => (n[2] < 0.5 ? 0.85 : 0.3) } },
  { part: cream, material: { ...finish('df-terracotta', 0xefe4cd), floodlight: (_p, n) => (n[2] < 0.5 ? 0.9 : 0.3) } },
  { part: scar, material: { ...finish('df-red-brick', 0xb88068), floodlight: () => 0.7 } },
  { part: win, material: PALETTE.window },
  { part: shaftWin, material: finish('df-shaft-windows', 0x64798a, 0.35) },
  { part: gold, material: { ...finish('df-gold', 0xe2bd62, 0.45), floodlight: () => 1 } },
], { height: 100.7, anchor: [39.7481017, -104.9956877], bearing: 45 })
