/**
 * Center for Brooklyn History (former Long Island Historical Society),
 * 128 Pierrepont Street at Clinton Street, Brooklyn Heights (George B.
 * Post, 1878–81) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-center-for-brooklyn-history.ts
 *
 * Model frame: x along Pierrepont Street (east), y away from the block
 * (north, towards Pierrepont), z up, metres; placed at bearing 20 (the
 * Brooklyn Heights street grid). Anchor: area centroid of the OSM outline
 * way/241833034 (-73.992412, 40.694791).
 *
 * Evidence
 * - OSM: way/241833034 "Center for Brooklyn History" (old name Brooklyn
 *   Historical Society), height 27.7, architect George B. Post, 1881,
 *   wikidata Q4974851. In the model frame a 23 × 26.6 m rectangle
 *   (x -11.5…11.5, y -13.4…13.2) with a 0.9 m jog at the south-west
 *   corner, which is left out.
 * - Lidar: USGS NY_NewYorkCity (2017), 0.5 m grid read in the model frame
 *   (lidar_frame.py, bearing 20). Streets on the north (Pierrepont) and
 *   east (Clinton) at the base; a party wall to the 17 m neighbour on the
 *   west; an open strip to the south. Measured: main cornice 20.0 m;
 *   a hipped roof rising to about 27 m; the north-west tower's spire
 *   about 31 m; roof ventilators about 28 m.
 * - Published (Wikipedia "Center for Brooklyn History"; NRHP / NYC LPC
 *   Brooklyn Heights Historic District): Queen Anne / Renaissance revival,
 *   red pressed brick and red terracotta, carved terracotta busts
 *   (Shakespeare, Beethoven, Columbus and others), the entrance flanked by
 *   granite columns; LONG ISLAND HISTORICAL SOCIETY inscribed in the
 *   frieze.
 * - Photos (Wikimedia Commons):
 *   - "Brooklyn Historical Society.jpg", Beyond My Ken, CC BY-SA 4.0 (from the north-east)
 *   - "Brooklyn Historical Society from west.jpg", Beyond My Ken, CC BY-SA 4.0 (the Pierrepont front)
 *   - "Brooklyn Historical Society NY1.jpg", Acroterion, CC BY-SA 4.0 (capitals, detail)
 *
 * Read from the photos: an all-red block (brick and terracotta the same
 * red), three storeys: a ground storey of round-arched doors and windows,
 * a belt course, a tall piano nobile of round-arched windows with carved
 * spandrels, an inscribed frieze, an attic of paired square windows, a
 * deep bracketed cornice. On Pierrepont, three bays and a slightly
 * projecting entrance bay at the west end, its big arched door between
 * grey granite pilasters with cream capitals; that bay rises past the
 * cornice into a gabled clock tower with a steep slate pyramid roof.
 * Small slate ventilators stand along the roof edge. Clinton Street has
 * seven bays of the same arches.
 *
 * Estimated from the photos, scaled on the lidar cornice: storey heights,
 * arch widths and spacing, the tower's gable (25 m) and spire (31 m).
 * Doubts: the south face is not photographed and repeats the Clinton
 * bays; the west face is a party wall; the hipped roof's shape is read
 * from the lidar only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, capPoly, type XY } from './nyc-570-lexington'

const brick = new Part(), terra = new Part(), granite = new Part(), win = new Part(), door = new Part(), slate = new Part()

const X0 = -11.5, X1 = 11.5, Y0 = -13.4, Y1 = 13.2
const BELT0 = 7.4, BELT1 = 8.4, FRIEZE0 = 15.8, FRIEZE1 = 16.6, CORNICE0 = 19.2, CORNICE = 20.0, OVER = 0.9, RIDGE = 27
const TW = 6.0 // the entrance/tower bay's width at the west end of the front
const GABLE = 25, SPIRE = 31

function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at }
}
type At = (s: number, z: number, d?: number) => V3
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
function box(p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, bottom = false) {
  rect(p, at, s0, s1, z0, z1, d1)
  p.quad(at(s0, z0, d0), at(s0, z0, d1), at(s0, z1, d1), at(s0, z1, d0))
  p.quad(at(s1, z0, d1), at(s1, z0, d0), at(s1, z1, d0), at(s1, z1, d1))
  p.quad(at(s0, z1, d1), at(s1, z1, d1), at(s1, z1, d0), at(s0, z1, d0))
  if (bottom) p.quad(at(s0, z0, d0), at(s1, z0, d0), at(s1, z0, d1), at(s0, z0, d1))
}
/** Round-headed panel: rectangle to `spring`, true semicircle above. */
function arched(p: Part, at: At, c: number, w: number, z0: number, spring: number, d: number) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    p.tri(at(c, spring, d), at(c + r * Math.cos(a0), spring + r * Math.sin(a0), d), at(c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}

/** One bay of the standard elevation, centred at c, width w. */
function bay(at: At, c: number, w: number, groundDoor: boolean, d = 0) {
  // Ground storey: arched door (or window) in a terracotta surround.
  arched(terra, at, c, w * 0.62, 0.6, 4.6, d + 0.05)
  if (groundDoor) {
    arched(win, at, c, w * 0.46, 3.6, 4.6, d + 0.1) // fanlight
    rect(door, at, c - w * 0.23, c + w * 0.23, 0.6, 3.5, d + 0.1)
  } else arched(win, at, c, w * 0.46, 1.4, 4.6, d + 0.1)
  // Piano nobile: tall round-headed window in a moulded surround.
  arched(terra, at, c, w * 0.66, 9.0, 14.0 - w * 0.25, d + 0.05)
  arched(win, at, c, w * 0.5, 9.4, 14.0 - w * 0.25, d + 0.1)
  rect(terra, at, c - 0.08, c + 0.08, 9.4, 14.0 - w * 0.25, d + 0.13) // mullion
  // Attic: a pair of square windows.
  for (const o of [-0.22, 0.22]) rect(win, at, c + o * w - w * 0.15, c + o * w + w * 0.15, 17.0, 18.9, d + 0.06)
}

const RING: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
RING.forEach((a, i) => {
  const b = RING[(i + 1) % 4]
  const { L, at } = along(a, b)
  rect(brick, at, 0, L, 0, CORNICE, 0)
  box(granite, at, -0.15, L, 0, 1.1, 0, 0.15) // granite water table, tall enough for the 1 m rise to the south-west
  box(terra, at, -0.2, L, BELT0, BELT1, 0, 0.2)
  rect(terra, at, 0.3, L - 0.3, FRIEZE0, FRIEZE1, 0.04)
  box(terra, at, -0.25, L, FRIEZE1, FRIEZE1 + 0.25, 0, 0.25)
  box(terra, at, -OVER, L, CORNICE0, CORNICE, 0, OVER, true)

  if (i === 0 || i === 1) {
    // South (unphotographed, after Clinton) and Clinton Street: even bays.
    const n = i === 1 ? 7 : 6, w = L / n
    for (let k = 0; k < n; k++) bay(at, (k + 0.5) * w, w, i === 1 && (k === 1 || k === 5))
  } else if (i === 2) {
    // Pierrepont front: three bays, then the entrance bay at the west end.
    const w = (L - TW) / 3
    for (let k = 0; k < 3; k++) bay(at, (k + 0.5) * w, w, true)
    const c = L - TW / 2, P = 0.4
    // The entrance bay stands 0.4 m proud and rises into the tower.
    box(brick, at, L - TW, L, 0, GABLE, 0, P)
    box(terra, at, L - TW - 0.2, L, BELT0, BELT1, P, P + 0.2)
    box(terra, at, L - TW - 0.3, L, CORNICE0, CORNICE, P, P + OVER, true)
    box(terra, at, L - TW - 0.2, L, GABLE - 0.7, GABLE, P, P + 0.5, true)
    // Big arched door between granite pilasters with cream-capped heads.
    arched(terra, at, c, 4.4, 0.6, 5.4, P + 0.05)
    arched(win, at, c, 2.8, 4.6, 5.4, P + 0.1)
    rect(door, at, c - 1.4, c + 1.4, 0.6, 4.5, P + 0.1)
    for (const s of [L - TW + 0.55, L - 0.55]) {
      box(granite, at, s - 0.35, s + 0.35, 0.6, 7.0, P, P + 0.6)
      box(terra, at, s - 0.5, s + 0.5, 7.0, 7.6, P, P + 0.75)
    }
    // Balcony over the door, the tall window, the attic window.
    box(terra, at, L - TW + 0.4, L - 0.4, BELT1, 9.2, P, P + 0.6)
    arched(terra, at, c, 3.4, 9.2, 14.8, P + 0.05)
    arched(win, at, c, 2.8, 9.5, 14.8, P + 0.1)
    rect(terra, at, c - 0.08, c + 0.08, 9.5, 14.8, P + 0.13)
    rect(win, at, c - 1.2, c + 1.2, 17.0, 18.9, P + 0.06)
    // The tower stage: a window and the clock face.
    rect(win, at, c - 1.0, c + 1.0, 20.6, 22.0, P + 0.06)
    for (let k = 0; k < 12; k++) {
      const a0 = (Math.PI * 2 * k) / 12, a1 = (Math.PI * 2 * (k + 1)) / 12
      granite.tri(at(c, 23.4, P + 0.08), at(c + 0.9 * Math.cos(a0), 23.4 + 0.9 * Math.sin(a0), P + 0.08), at(c + 0.9 * Math.cos(a1), 23.4 + 0.9 * Math.sin(a1), P + 0.08))
    }
  }
})

// The tower above the roof: three more brick sides, then the slate spire.
const TX0 = X0, TX1 = X0 + TW, TY0 = Y1 - 6, TY1 = Y1 + 0.4
const TOWER: XY[] = [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]
TOWER.forEach((a, i) => {
  if (i === 2) return // the front is the entrance bay, drawn above
  const { L, at } = along(a, TOWER[(i + 1) % 4])
  rect(brick, at, 0, L, CORNICE - 2, GABLE, 0)
  box(terra, at, -0.5, L, GABLE - 0.7, GABLE, 0, 0.5, true)
})
{
  const e = 0.6, z = GABLE, apex: V3 = [(TX0 + TX1) / 2, (TY0 + TY1) / 2, SPIRE]
  const R: V3[] = [[TX0 - e, TY0 - e, z], [TX1 + e, TY0 - e, z], [TX1 + e, TY1 + e, z], [TX0 - e, TY1 + e, z]]
  for (let k = 0; k < 4; k++) slate.tri(R[k], R[(k + 1) % 4], apex)
  slate.quad(R[0], R[3], R[2], R[1]) // the eave's underside
}

// Hipped roof from the cornice to a short ridge along y (lidar 27 m).
{
  const e = 0.5, z = CORNICE, a = X0 + e, b = X1 - e, c = Y0 + e, d = Y1 - e
  const half = (b - a) / 2, r0: V3 = [0, c + half, RIDGE], r1: V3 = [0, d - half, RIDGE]
  slate.tri([a, c, z], [b, c, z], r0)
  slate.quad([b, c, z], [b, d, z], r1, r0)
  slate.tri([b, d, z], [a, d, z], r1)
  slate.quad([a, d, z], [a, c, z], r0, r1)
  capPoly(terra, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], CORNICE - 0.02) // the cornice's top band
}

// Two slate ventilators along the front of the roof.
for (const x of [-1, 5]) {
  const y = 9, z0 = 22, z1 = 25, h = 0.9
  const R: XY[] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  R.forEach((p, k) => { const q = R[(k + 1) % 4]; slate.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1]) })
  for (let k = 0; k < 4; k++) { const p = R[k], q = R[(k + 1) % 4]; slate.tri([p[0], p[1], z1], [q[0], q[1], z1], [x, y, z1 + 1.8]) }
}

finishModel('Center for Brooklyn History', 'nyc-center-for-brooklyn-history', [
  { part: brick, material: finish('cbh-red-brick', 0xc77860) },
  { part: terra, material: finish('cbh-terracotta', 0xb86a52) },
  { part: granite, material: finish('cbh-granite', 0xa7a7a2) },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0x7d5e48 } },
  { part: slate, material: finish('cbh-slate', 0x6f7680) },
], { bearing: 20, osm: 'way/241833034', height: SPIRE })
