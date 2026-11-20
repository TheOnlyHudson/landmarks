/**
 * St. John's Cathedral (Cathedral of St. John in the Wilderness), Denver
 * (1909–1911, Tracy & Swartwout; English Gothic Revival, towers left
 * unfinished) — original procedural geometry, CC0-1.0.
 * bun generators/den-st-johns-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin on the ground
 * at the anchor, the area centroid of the OSM multipolygon relation/4744474
 * (-104.9780186, 39.7376488), which outlines the cathedral and its parish
 * buildings as one building. The cathedral is its western strip: the tower
 * front faces north onto East 14th Avenue (y 60.3–69.7), the nave runs
 * south to a polygonal apse (y 5). The rest (cloister walk, parish hall,
 * offices) is drawn as plain masses because the relation replaces it too.
 * Not way/335382141, a separate flat-roofed building to the south-west
 * that carries the cathedral's name in OSM.
 *
 * Identity, in order (photos below):
 *  1. two square towers with flat, arcaded parapets and small square corner
 *     turrets (never given spires), a tall louvered belfry lancet in each,
 *     an arcaded band under it.                              (urban, nyttend)
 *  2. the great window between the towers, five lights under a pointed
 *     moulding, a low gable over it; three small portals below and a
 *     round-arched door in each tower.                                (urban)
 *  3. the long nave behind a parapet, deep stepped buttresses and tall
 *     traceried windows; the roof barely shows.                      (nyttend)
 *  4. the tall polygonal apse with narrow lancets between buttress strips
 *     and a low conical slate roof.                                    (rear)
 *  5. buff limestone throughout.                          (urban, nyttend, rear)
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read with
 * window maxima and medians in this frame. y = 0 is 1613.5 m, the ground
 * along the front and the west side (2.3 m above ground_min, a pit).
 * Measured: tower tops and corner turrets 31.0; centre gable 23–24.8; nave
 * parapets 21.2, ridge 23.1 (a low roof); chancel walls 17.5, ridge 20.5;
 * apse walls about 17, cone to 20.5; parish hall eaves 7.5, ridge 14.5; its
 * north cross wing 14.3; cloister walk 4.7; the south offices 9–12, flat.
 *
 * Estimated from the urban photo (nearly square on, scaled to the
 * 22.8 m front): towers 7.95 m wide, the centre bay 6.9; the great window
 * 4.9 m wide, 6.5 to its apex at 16.8; belfry lancet 2.3 m wide, 21.4–26.5;
 * the arcaded band 19.2–21.1; parapet arcade 28.9–30.1; portals 2.2 m wide
 * to 4.1; tower doors 1.9 m to 3.4. Nave bays 6.55 m (six); windows 3.6 m
 * wide to 18; buttresses 1.4 m deep. Apse: OSM's polygon is smaller than
 * the lidar's; drawn from the lidar, centre (-13.4, 12), radius 6.6.
 * Left out: sculpture, the louvre slats' fine detail, crocketed finials,
 * the steps, the parish buildings' windows (no photo of them).
 *
 * Photos (Wikimedia Commons, evidence):
 *  urban   "\"Urban Cathedral in the English Style\".jpg", MPCLavallee,
 *          CC BY-SA 4.0 (the north front, square on)
 *  nyttend "Cathedral of St. John in the Wilderness.jpg", Nyttend, public
 *          domain (front and west side, from the north-west)
 *  rear    "\"Cathedral From the Rear\".jpg", MPCLavallee, CC BY-SA 4.0
 *          (the apse, from the south-east)
 *  after   "St. John’s after dark.jpg", Rachlelinville, CC BY-SA 4.0 (night:
 *          windows lit from within)
 * No look-only sources were used. No commercial imagery.
 *
 * Doubts: no photo shows the east side of the nave or the parish buildings:
 * they are plain masses at lidar heights. The nyttend photo's street sign
 * reads Washington Street; its layout (front left, side running right)
 * fits a view from the north-west, which is how it is paired.
 *
 * Night: windows glow; the tower front gets a little floodlight.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, gableRoof, onWall, prism, pyramid, rectShape, save, type XY } from './atl-tech-tower'
import { disc, faces, lancet, onFace, roundArch, tracery, tri } from './den-cathedral-basilica'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part(), door = new Part()

// ── The front: two towers and the centre bay ──
const FY0 = 60.3, FY1 = 69.7
const TW: [number, number][] = [[-26.3, -18.35], [-11.45, -3.5]]
const CX0 = -18.35, CX1 = -11.45, CXM = (CX0 + CX1) / 2
const TOP = 29.3

box(stone, CX0, CX1, FY0, FY1, 0, 21.6, null, 0)
gableRoof(roof, stone, CX0, CX1, FY0, FY1, 21.6, 24.0, 'y', 0.1, 0)
{
  const f = faces(CX0, CX1, FY0, FY1).N
  onFace(trim, f, tri(CX0 + 0.2, CX1 - 0.2, 21.6, 24.0), 0.12) // coped gable face
  onFace(stone, f, tri(CX0 + 0.75, CX1 - 0.75, 21.6, 23.45), 0.16)
  box(trim, CXM - 0.35, CXM + 0.35, FY1 - 0.1, FY1 + 0.5, 23.6, 24.9, trim, 0.1)
  // the great window: a pointed moulding, five lights, tracery
  onFace(trim, f, lancet(CXM, 6.3, 5.8, 12.75, 7), 0.03)
  onFace(win, f, lancet(CXM, 4.9, 6.5, 12.55, 7), 0.07)
  for (const d of [-1.47, -0.49, 0.49, 1.47]) onFace(trim, f, rectShape(CXM + d - 0.09, CXM + d + 0.09, 6.5, 13.6), 0.11)
  for (const [s, r] of [[CXM, 0.75], [CXM - 1.0, 0.5], [CXM + 1.0, 0.5]] as [number, number][]) onFace(trim, f, disc(s, s === CXM ? 15.0 : 14.2, r, 10), 0.11)
  onFace(trim, f, rectShape(CXM - 2.45, CXM + 2.45, 13.6, 13.78), 0.11)
  // the band and three portals below
  onFace(trim, f, rectShape(CX0, CX1, 5.2, 6.0), 0.15)
  for (const d of [-2.25, 0, 2.25]) {
    onFace(trim, f, lancet(CXM + d, 2.1, 0, 2.6, 5), 0.03)
    onFace(door, f, lancet(CXM + d, 1.6, 0, 2.6, 5), 0.07)
  }
  onFace(trim, f, rectShape(CX0, CX1, 19.0, 19.4), 0.12)
}
for (const [x0, x1] of TW) {
  const xm = (x0 + x1) / 2, F = faces(x0, x1, FY0, FY1)
  box(stone, x0, x1, FY0, FY1, 0, TOP, stone, 0.2)
  // corner buttresses with two set-offs
  for (const cx of [x0, x1]) for (const cy of [FY0, FY1]) {
    const sx = cx === x0 ? -1 : 1, sy = cy === FY0 ? -1 : 1
    if (sy < 0) continue // the back corners are in the nave
    for (const [d, z1] of [[0.9, 9.5], [0.6, 19.0], [0.35, TOP - 0.3]] as [number, number][]) {
      const xa = cx + sx * d, xb = cx - sx * 1.1, ya = cy + sy * d, yb = cy - sy * 1.1
      box(stone, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), 0, z1, stone, 0.2)
    }
  }
  // the parapet: an arcaded band, corner turrets
  for (const k of ['N', 'E', 'W', 'S'] as const) {
    const f = F[k], lo = k === 'N' || k === 'S' ? x0 : FY0, hi = k === 'N' || k === 'S' ? x1 : FY1
    for (let i = 0; i < 4; i++) {
      const s = lo + 1.9 + (i + 0.5) * ((hi - lo - 3.8) / 4)
      onFace(dark, f, roundArch(s, 0.62, TOP - 0.1, TOP + 0.6, 5), 0.06)
    }
  }
  prism(stone, [[x0 - 0.15, FY0 - 0.15], [x1 + 0.15, FY0 - 0.15], [x1 + 0.15, FY1 + 0.15], [x0 - 0.15, FY1 + 0.15]], TOP, TOP + 1.0, trim, 0.1)
  for (const cx of [x0 + 0.65, x1 - 0.65]) for (const cy of [FY0 + 0.65, FY1 - 0.65]) {
    box(stone, cx - 0.85, cx + 0.85, cy - 0.85, cy + 0.85, TOP, 31.0, trim, 0.12)
    pyramid(trim, [cx, cy], 0.45, 31.0, 31.6, 4)
  }
  // belfry lancets with louvres, on the faces that show; the arcade band below
  for (const k of ['N', x0 < -20 ? 'W' : 'E', 'S'] as const) {
    const f = F[k], m = k === 'N' || k === 'S' ? xm : (FY0 + FY1) / 2
    onFace(trim, f, lancet(m, 3.0, 21.0, 23.9, 6), 0.03)
    onFace(dark, f, lancet(m, 2.3, 21.4, 24.4, 6), 0.07)
    for (let z = 22.0; z < 25.4; z += 0.85) onFace(trim, f, rectShape(m - 1.1, m + 1.1, z, z + 0.22), 0.1)
    onFace(trim, f, rectShape(m - 0.09, m + 0.09, 21.4, 25.6), 0.11)
    if (k !== 'S') {
      onFace(trim, f, rectShape(m - 3.0, m + 3.0, 18.9, 19.3), 0.1)
      for (let i = 0; i < 5; i++) onFace(dark, f, lancet(m - 2.4 + i * 1.2, 0.7, 19.4, 20.4, 3), 0.06)
      onFace(win, f, lancet(m, 1.0, 11.5, 14.0, 4), 0.06)
    }
  }
  // the tower door, round-arched
  onFace(trim, F.N, roundArch(xm, 2.5, 0, 2.2, 8), 0.03)
  onFace(door, F.N, roundArch(xm, 1.9, 0, 2.45, 8), 0.07)
}

// ── The nave: parapets, buttresses, tall windows; a low roof ──
const NX0 = -22.1, NX1 = -5.3, NY0 = 21, NY1 = FY0, PAR = 21.2
box(stone, NX0, NX1, NY0, NY1, 0, PAR, null, 0.15)
gableRoof(roof, null, NX0 + 0.6, NX1 - 0.6, NY0, NY1, PAR - 0.6, 23.1, 'y', 0, 0)
{
  const F = faces(NX0, NX1, NY0, NY1)
  const bay = (NY1 - NY0) / 6
  for (const [k, sx, x] of [['W', -1, NX0], ['E', 1, NX1]] as ['W' | 'E', number, number][]) {
    for (let i = 0; i < 6; i++) {
      const ym = NY0 + (i + 0.5) * bay
      tracery(win, trim, F[k], ym, 3.6, 7.5, 15.0, 3)
      if (!(k === 'E' && i === 0)) for (const d of [-0.7, 0.7]) onFace(win, F[k], lancet(ym + d, 0.9, 2.2, 4.0, 3), 0.06)
    }
    for (let i = 1; i < 6; i++) {
      const y = NY0 + i * bay
      for (const [d, z1] of [[1.4, 9.0], [0.95, 15.5], [0.55, PAR + 0.4]] as [number, number][]) {
        box(stone, Math.min(x, x + sx * d), Math.max(x, x + sx * d), y - 0.6, y + 0.6, 0, z1, stone, 0.3)
      }
    }
    onFace(trim, F[k], rectShape(NY0, NY1, PAR - 0.9, PAR - 0.6), 0.1)
  }
}

// ── The chancel and the apse ──
box(stone, -20.9, NX1, 12.0, NY0, 0, 17.5, null, 0.1)
gableRoof(roof, stone, -20.9, NX1, 12.0, NY0, 17.5, 20.5, 'y', 0.3, 0)
{
  const C: XY = [-13.4, 12.0], R = 6.6, n = 8
  const ring: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = Math.PI + (i / n) * Math.PI
    return [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)] as XY
  })
  prism(stone, [...ring, [C[0] + R, C[1] + 0.5], [C[0] - R, C[1] + 0.5]], 0, 16.8, null, 0)
  const apex: V3 = [C[0], C[1] + 0.3, 20.5]
  for (let i = 0; i < n; i++) {
    const o = (q: XY): V3 => [C[0] + (q[0] - C[0]) * 1.05, C[1] + (q[1] - C[1]) * 1.05, 16.6]
    roof.tri(o(ring[i]), o(ring[i + 1]), apex)
    const a = ring[i], b = ring[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, lancet(L / 2, 1.75, 4.2, 13.4, 4), 0.06)
    onWall(win, a, b, lancet(L / 2, 0.8, 1.2, 3.0, 3), 0.06)
    onWall(trim, a, b, rectShape(0, L, 15.4, 15.8), 0.1)
    // buttress strips at the vertices
    const v = ring[i], dir: XY = [(v[0] - C[0]) / R, (v[1] - C[1]) / R]
    if (i > 0) {
      const p: XY = [v[0] + dir[0] * 0.45, v[1] + dir[1] * 0.45]
      box(stone, p[0] - 0.45, p[0] + 0.45, p[1] - 0.45, p[1] + 0.45, 0, 16.0, stone, 0.2)
    }
  }
}

// ── The parish buildings (plain, at lidar heights) ──
box(stone, -4.6, -1.6, -44.1, 21.0, 0, 4.7, roof, 0.2) // cloister walk
box(stone, NX1, 7.7, 26.7, 28.8, 0, 3.6, roof, 0.1) // link to the hall
box(stone, -1.6, 4.6, 12.0, 26.7, 0, 6.0, roof, 0.2)
box(stone, -1.6, 5.0, -21.0, -6.0, 0, 6.5, roof, 0.2)
box(stone, 5.0, 12.3, -44.0, -31.5, 0, 6.0, roof, 0.2)
box(stone, 5.0, 19.8, -31.5, 13.0, 0, 7.5, null, 0)
gableRoof(roof, stone, 5.0, 19.8, -31.5, 13.0, 7.5, 14.5, 'y', 0.4, 0.2)
box(stone, 4.6, 22.1, 13.0, 26.7, 0, 10.0, null, 0)
gableRoof(roof, stone, 4.6, 22.1, 13.0, 26.7, 10.0, 14.3, 'x', 0.4, 0.2)
box(stone, -10.7, 6.5, -51.6, -44.1, 0, 9.3, roof, 0.3)
box(stone, 6.5, 22.4, -51.6, -43.9, 0, 12.0, roof, 0.3)
box(stone, -14.6, 15.2, -62.0, -51.6, 0, 11.0, roof, 0.3)
box(stone, 7.4, 14.1, -71.0, -62.0, 0, 11.0, roof, 0.3)
{
  // simple window bands on the hall, whose west side faces the lawn
  const F = faces(5.0, 19.8, -31.5, 13.0)
  for (let y = -27.5; y < 11; y += 4.4) onFace(win, F.W, rectShape(y - 1.1, y + 1.1, 2.4, 5.6), 0.06)
  for (let y = -27.5; y < 11; y += 4.4) onFace(win, F.E, rectShape(y - 1.1, y + 1.1, 2.4, 5.6), 0.06)
}

const lit = (p: V3, n: V3) => (p[1] > 59 ? (n[2] > 0.9 ? 0.2 : 0.7) : 0)
await save('den-st-johns-cathedral', "St. John's Cathedral", [
  { part: stone, material: { ...finish('stjohns-limestone', 0xd2c5ac), floodlight: lit } },
  { part: trim, material: { ...finish('stjohns-trim', 0xe4dac6), floodlight: lit } },
  { part: roof, material: finish('stjohns-slate', 0x7e8389) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('stjohns-recess', 0x5d5f63) },
  { part: door, material: finish('stjohns-door', 0x7a5b40) },
], { height: 31.6, anchor: [39.7376488, -104.9780186], bearing: 0 }, 6500)
