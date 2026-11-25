/**
 * Basilica of Our Lady of Perpetual Help, Sunset Park, Brooklyn (Franz
 * Joseph Berlenbach, 1909–1928) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-perpetual-help-basilica.ts
 *
 * Map frame: x = east, y = north, z up, metres, built in the church's own
 * frame and placed at bearing 308.2: model +y is the nave axis pointing
 * to the twin-towered front on Fifth Avenue (north-west). Anchor: area
 * centroid of OSM way/1096878089 (-74.0152547, 40.6394219).
 *
 * Evidence
 * - OSM: way/1096878089 (building=church, basilica=minor, height 32.6,
 *   wikidata Q4867364). The rectory way/1096878090 adjoins at the back
 *   and is not drawn.
 * - USGS 3DEP lidar NY_NewYorkCity (2017), 1 m grid, read in this frame
 *   (lidar_frame.py, bearing -51.8). y = 0 is the lowest ground (behind,
 *   on the south-west side); Fifth Avenue's sidewalk is S = 2.7 m up.
 *   Measured above y = 0: tower crowns 36.3; gable cross 39; nave ridge
 *   35.1 (drawn 34.6, so the towers stand clear of the gable as in every
 *   photo), clerestory eaves 28.3 (x ±9); aisle roofs 16.1 (x ±9…13.3);
 *   transept ridge 32.4 at y -9, eaves 28; side apses 16; the chancel's
 *   lower blocks 12.4 and 17.8, its centre block 25.4; porch roof 13.3.
 * - Published (Wikipedia "Basilica of Our Lady of Perpetual Help
 *   (Brooklyn)"): Romanesque Revival, granite, F. J. Berlenbach; begun 1909,
 *   dedicated 1928; minor basilica 1969.
 * - Photos (Wikimedia Commons):
 *   - "OLPH front shady jeh.JPG", Jim.henderson, CC0 (the front square on;
 *     scaled on the lidar tower height)
 *   - "OLPH west sun jeh.jpg", "OLPH north sun jeh.jpg", Jim.henderson,
 *     CC0 (both front corners: towers, porch, terrace and stairs)
 *   - "OLPH South jeh.JPG", Jim.henderson, CC0 (the transept gable, its
 *     rose window and pinnacles, the apse, red tile roofs)
 *
 * From the photos: pale grey granite with lighter trim; two square towers
 * (7.2 m) with paired round-arched windows, an arcaded belfry band and an
 * open crown of corner piers; between them a gable with a corbel-arcade
 * band, a great round-arched window with tracery (6.1 m wide), and a
 * three-arched porch with small gables on a terrace whose front holds the
 * lower church's three doors, with stairs at each end; red tile roofs.
 * Estimated: the terrace (5 m over the sidewalk, from the photo; lidar
 * reads it lower), the porch depth (4.5 m), window sizes and counts on
 * the sides, the transept rose windows, the chancel's blocks.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY } from './nyc-570-lexington'

const granite = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

const S = 2.7
const TW = 7.2, TY0 = 30, FRONT = 37
const NAVE_X = 9, AISLE_X = 13.3, NAVE_EAVE = 28.3, NAVE_RIDGE = 34.6, AISLE_TOP = 16.1
const TOWER_SHAFT = S + 29.7, TOWER_TOP = 36.3

type At = (s: number, z: number, d?: number) => V3
function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at: At = (s, z, d = 0) => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at }
}
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
function arched(p: Part, at: At, c: number, w: number, z0: number, spring: number, d: number, seg = 10) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    p.tri(at(c, spring, d), at(c + r * Math.cos(a0), spring + r * Math.sin(a0), d), at(c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}
function disc(p: Part, at: At, c: number, z: number, r: number, d: number, n = 14) {
  for (let k = 0; k < n; k++) {
    const a0 = (2 * Math.PI * k) / n, a1 = (2 * Math.PI * (k + 1)) / n
    p.tri(at(c, z, d), at(c + r * Math.cos(a0), z + r * Math.sin(a0), d), at(c + r * Math.cos(a1), z + r * Math.sin(a1), d))
  }
}
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, top: Part | null = p, bevel = 0) {
  prism({ wall: p, win: null, roof: top, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, facade: null, bevel })
}
/** A gabled roof over x0..x1 (ridge along y, or along x when alongX). */
function gableRoof(x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, alongX = false, ends = true) {
  if (!alongX) {
    const xm = (x0 + x1) / 2
    roof.quad([x1, y0, eave], [x1, y1, eave], [xm, y1, ridge], [xm, y0, ridge])
    roof.quad([x0, y1, eave], [x0, y0, eave], [xm, y0, ridge], [xm, y1, ridge])
    if (ends) { granite.tri([x0, y0, eave], [x1, y0, eave], [xm, y0, ridge]); granite.tri([x1, y1, eave], [x0, y1, eave], [xm, y1, ridge]) }
  } else {
    const ym = (y0 + y1) / 2
    roof.quad([x0, y0, eave], [x1, y0, eave], [x1, ym, ridge], [x0, ym, ridge])
    roof.quad([x1, y1, eave], [x0, y1, eave], [x0, ym, ridge], [x1, ym, ridge])
    if (ends) { granite.tri([x1, y0, eave], [x1, y1, eave], [x1, ym, ridge]); granite.tri([x0, y1, eave], [x0, y0, eave], [x0, ym, ridge]) }
  }
}

// ---------------------------------------------------------------------------
// Nave, aisles, transept, side apses, chancel.
// ---------------------------------------------------------------------------
box(granite, -NAVE_X, -21, 0, NAVE_X, FRONT - 0.3, NAVE_EAVE, null, 0.2)
gableRoof(-NAVE_X - 0.4, -21, NAVE_X + 0.4, FRONT - 0.3, NAVE_EAVE, NAVE_RIDGE, false, false)
granite.tri([-NAVE_X, -21, NAVE_EAVE], [NAVE_X, -21, NAVE_EAVE], [0, -21, NAVE_RIDGE]) // the chancel's gable end
for (const sg of [-1, 1]) {
  const xo = sg * AISLE_X, xi = sg * NAVE_X
  box(granite, Math.min(xo, xi), 0.8, 0, Math.max(xo, xi), TY0, AISLE_TOP, null, 0.2)
  // Lean-to aisle roof, up to the clerestory wall.
  const lo = sg * (AISLE_X + 0.3)
  if (sg > 0) roof.quad([lo, 0.8, AISLE_TOP], [lo, TY0, AISLE_TOP], [xi, TY0, AISLE_TOP + 2.4], [xi, 0.8, AISLE_TOP + 2.4])
  else roof.quad([lo, TY0, AISLE_TOP], [lo, 0.8, AISLE_TOP], [xi, 0.8, AISLE_TOP + 2.4], [xi, TY0, AISLE_TOP + 2.4])
  // Side apse on each transept end: a half-round to the aisle height.
  const ax = sg * 22.6, ay = -9.3, R = 3.9, N = 8
  for (let k = 0; k < N; k++) {
    const a0 = -Math.PI / 2 + (Math.PI * k) / N, a1 = -Math.PI / 2 + (Math.PI * (k + 1)) / N
    const p0: XY = [ax + sg * R * Math.cos(a0), ay + R * Math.sin(a0) * sg], p1: XY = [ax + sg * R * Math.cos(a1), ay + R * Math.sin(a1) * sg]
    granite.quad([p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], AISLE_TOP], [p0[0], p0[1], AISLE_TOP])
    roof.tri([p0[0], p0[1], AISLE_TOP], [p1[0], p1[1], AISLE_TOP], [ax, ay, AISLE_TOP + 2.8])
  }
  // Chancel side blocks (sacristies and chapels).
  box(granite, sg > 0 ? 9 : -21, -29.1, 0, sg > 0 ? 21 : -9, -18, 17.8, roof, 0.3)
}
// Transept: walls to the eaves, a gable roof across, gable ends with rose windows.
box(granite, -21, -15.2, 0, 20.6, -3, 28, null, 0.3)
gableRoof(-21.4, -15.6, 21.0, -2.6, 28, 32.4, true, true)
// The chancel's low end and its centre block.
box(granite, -9, -29.1, 0, 9, -21, 12.4, roof, 0.3)
box(granite, -4.5, -28, 12.3, 4.5, -22, 25.4, null, 0.2)
gableRoof(-4.8, -28.2, 4.8, -21.8, 25.4, 27.6)

// ---------------------------------------------------------------------------
// The twin towers: shafts with paired round-arched windows, the arcaded
// belfry band, and the open crown of piers.
// ---------------------------------------------------------------------------
const TOWERS: [number, number][] = [[-14.0, -14.0 + TW], [14.2 - TW, 14.2]]
for (const [x0, x1] of TOWERS) {
  box(granite, x0, TY0, 0, x1, FRONT, TOWER_SHAFT, null, 0.25)
  capPolyTop(x0, TY0, x1, FRONT, TOWER_SHAFT)
  const ring: XY[] = [[x0, TY0], [x1, TY0], [x1, FRONT], [x0, FRONT]]
  for (let i = 0; i < 4; i++) {
    const { L, at } = along(ring[i], ring[(i + 1) % 4])
    const outer = i === 2 || (i === 1 && x0 > 0) || (i === 3 && x0 < 0) // front and outer sides
    // String courses and the corbelled belfry band.
    rect(trim, at, 0.2, L - 0.2, S + 23.6, S + 24.1, 0.08)
    rect(trim, at, 0.2, L - 0.2, S + 26.9, S + 27.4, 0.08)
    for (let k = 0; k < 3; k++) arched(win, at, L / 2 + (k - 1) * 1.7, 1.0, S + 24.5, S + 25.8, 0.08, 6)
    if (outer || i === 0) {
      for (const z of [S + 9, S + 15, S + 20.5]) {
        if (i === 0) continue
        for (const sg of [-1, 1]) arched(win, at, L / 2 + sg * 0.55, 0.8, z, z + 2.0, 0.08, 6)
        arched(trim, at, L / 2, 2.6, z + 2.0, z + 2.0, 0.04, 8) // hood over the pair
      }
    }
  }
  // Crown: corner and middle piers, open between, with caps.
  const P = 1.5
  for (const [px, py] of [[x0, TY0], [x1 - P, TY0], [x0, FRONT - P], [x1 - P, FRONT - P]] as XY[]) box(granite, px, py, TOWER_SHAFT - 0.1, px + P, py + P, TOWER_TOP - 0.4, trim)
  const xm = (x0 + x1) / 2, ym = (TY0 + FRONT) / 2
  for (const [px, py] of [[xm, TY0 + 0.4], [xm, FRONT - 0.4], [x0 + 0.4, ym], [x1 - 0.4, ym]] as XY[]) box(granite, px - 0.4, py - 0.4, TOWER_SHAFT - 0.1, px + 0.4, py + 0.4, TOWER_TOP - 1.2, trim)
  for (const [px, py] of [[x0, TY0], [x1 - P, TY0], [x0, FRONT - P], [x1 - P, FRONT - P]] as XY[]) box(trim, px - 0.15, py - 0.15, TOWER_TOP - 0.4, px + P + 0.15, py + P + 0.15, TOWER_TOP)
}
/** A flat cap at z (the tower floor under the open crown). */
function capPolyTop(x0: number, y0: number, x1: number, y1: number, z: number) {
  trim.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
}

// ---------------------------------------------------------------------------
// The front between the towers: wall, corbel-arcade band, gable and cross,
// the great window, the porch on its terrace, the lower doors and stairs.
// ---------------------------------------------------------------------------
{
  const xa = TOWERS[0][1], xb = TOWERS[1][0]
  // Front wall from the ground to the gable foot, then the gable.
  granite.quad([xb, FRONT, 0], [xa, FRONT, 0], [xa, FRONT, NAVE_EAVE], [xb, FRONT, NAVE_EAVE]) // faces +y (north-west, out)
  granite.tri([xb, FRONT, NAVE_EAVE], [xa, FRONT, NAVE_EAVE], [0, FRONT, NAVE_RIDGE - 0.3])
  // Gable top: a thin coping slab along each rake.
  for (const [a, b] of [[[xa, NAVE_EAVE], [0, NAVE_RIDGE - 0.3]], [[0, NAVE_RIDGE - 0.3], [xb, NAVE_EAVE]]] as [XY, XY][]) {
    roof.quad([a[0], FRONT - 1.2, a[1] + 0.35], [b[0], FRONT - 1.2, b[1] + 0.35], [b[0], FRONT + 0.15, b[1] + 0.35], [a[0], FRONT + 0.15, a[1] + 0.35])
    trim.quad([a[0], FRONT + 0.15, a[1] + 0.35], [b[0], FRONT + 0.15, b[1] + 0.35], [b[0], FRONT + 0.15, b[1]], [a[0], FRONT + 0.15, a[1]])
  }
  const { at } = along([xb, FRONT], [xa, FRONT]) // s runs east→west, outward +y
  const W = xb - xa, c = W / 2
  // Corbel-arcade band under the gable.
  rect(trim, at, 0.2, W - 0.2, S + 23.6, S + 24.1, 0.06)
  rect(trim, at, 0.2, W - 0.2, NAVE_EAVE - 0.5, NAVE_EAVE, 0.08)
  for (let k = 0; k < 9; k++) arched(win, at, 1.1 + k * (W - 2.2) / 8, 0.65, S + 24.4, S + 25.2, 0.07, 6)
  // The great window: a pale stone arch round a traceried glass.
  arched(trim, at, c, 7.6, S + 12.2, S + 20.0, 0.06)
  arched(win, at, c, 6.1, S + 12.4, S + 20.0, 0.1)
  for (let k = 1; k < 5; k++) rect(trim, at, c - 3.05 + k * 1.22 - 0.09, c - 3.05 + k * 1.22 + 0.09, S + 12.4, S + 20.0, 0.13)
  rect(trim, at, c - 3.05, c + 3.05, S + 19.9, S + 20.1, 0.13)
  disc(trim, at, c, S + 21.4, 0.55, 0.13, 10)
  // The cross on the gable.
  box(trim, -0.25, FRONT - 0.5, NAVE_RIDGE - 0.4, 0.25, FRONT, NAVE_RIDGE + 3.6)
  box(trim, -1.1, FRONT - 0.5, NAVE_RIDGE + 2.0, 1.1, FRONT, NAVE_RIDGE + 2.5)
}

// The terrace: lower-church doors in its front, balustrade on top, stairs
// down at both ends; the porch on it with three arches in front, one on
// each side, and three small gables over them.
{
  const T0 = FRONT, T1 = FRONT + 6.0, TX0 = -10.5, TX1 = 10.5, TOP = S + 5.0
  box(granite, TX0, T0 - 0.2, 0, TX1, T1, TOP, trim, 0.2)
  const { at } = along([TX1, T1], [TX0, T1])
  rect(trim, at, 0.2, TX1 - TX0 - 0.2, TOP - 0.9, TOP - 0.1, 0.06) // balustrade band
  for (const k of [-1, 0, 1]) {
    const cx = (TX1 - TX0) / 2 + k * 6.2
    arched(trim, at, cx, 2.8, S, S + 2.8, 0.05, 8)
    rect(door, at, cx - 1.0, cx + 1.0, S, S + 3.0, 0.1)
  }
  // Stairs: a sloped flight against each end of the terrace, along the front.
  for (const sg of [-1, 1]) {
    const xe = sg > 0 ? TX1 : TX0, xf = xe + sg * 5.5, ya = T0 + 1.0, yb = T1 - 1.0
    const top: V3[] = [[xe, ya, TOP - 0.6], [xe, yb, TOP - 0.6], [xf, yb, S], [xf, ya, S]]
    if (sg > 0) trim.quad(top[0], top[3], top[2], top[1]); else trim.quad(top[0], top[1], top[2], top[3])
    const sideY = (y: number, out: boolean) => {
      const q: V3[] = [[xe, y, 0], [xf, y, 0], [xf, y, S], [xe, y, TOP - 0.6]]
      const facesPlusY = out
      const ccw = (sg > 0) === facesPlusY
      if (ccw) granite.quad(q[1], q[0], q[3], q[2]); else granite.quad(q[0], q[1], q[2], q[3])
    }
    sideY(yb, true); sideY(ya, false)
    const end: V3[] = [[xf, ya, 0], [xf, yb, 0], [xf, yb, S], [xf, ya, S]]
    if (sg > 0) granite.quad(end[0], end[1], end[2], end[3]); else granite.quad(end[1], end[0], end[3], end[2])
  }
  // Porch.
  const PX0 = -7.2, PX1 = 7.2, PY1 = FRONT + 4.5, PB = TOP, PT = 13.3
  box(granite, PX0, FRONT - 0.2, PB - 0.1, PX1, PY1, PT, roof, 0.2)
  const fr = along([PX1, PY1], [PX0, PY1])
  for (const k of [-1, 0, 1]) {
    const cx = (PX1 - PX0) / 2 + k * 4.4
    arched(trim, fr.at, cx, 4.2, PB, PB + 2.6, 0.05, 10)
    arched(door, fr.at, cx, 3.4, PB, PB + 2.6, 0.1, 10)
    // Small gable over each arch.
    fr.at && granite.tri(fr.at(cx - 2.2, PT, 0.02), fr.at(cx + 2.2, PT, 0.02), fr.at(cx, PT + 1.5, 0.02))
    trim.quad(fr.at(cx - 2.3, PT - 0.25, 0.12), fr.at(cx + 2.3, PT - 0.25, 0.12), fr.at(cx + 2.3, PT, 0.12), fr.at(cx - 2.3, PT, 0.12))
  }
  for (const [a, b] of [[[PX0, PY1], [PX0, FRONT]], [[PX1, FRONT], [PX1, PY1]]] as [XY, XY][]) {
    const sd = along(a, b)
    arched(trim, sd.at, sd.L / 2, 3.0, PB, PB + 2.2, 0.05, 8)
    arched(door, sd.at, sd.L / 2, 2.4, PB, PB + 2.2, 0.1, 8)
  }
}

// ---------------------------------------------------------------------------
// Side windows: tall round-arched aisle windows, paired clerestory lights;
// the transept ends' rose windows and corner pinnacles.
// ---------------------------------------------------------------------------
for (const sg of [-1, 1]) {
  const aisle = sg > 0 ? along([AISLE_X, 0.8], [AISLE_X, TY0]) : along([-AISLE_X, TY0], [-AISLE_X, 0.8])
  const clere = sg > 0 ? along([NAVE_X, 0.8], [NAVE_X, TY0]) : along([-NAVE_X, TY0], [-NAVE_X, 0.8])
  for (let k = 0; k < 6; k++) {
    const s = 2.4 + k * 4.85
    arched(trim, aisle.at, s, 2.3, 5.0, 11.4, 0.05, 8)
    arched(win, aisle.at, s, 1.7, 5.2, 11.4, 0.09, 8)
    for (const d of [-0.6, 0.6]) arched(win, clere.at, s + d, 0.9, 20.5, 24.4, 0.08, 6)
  }
  // Transept end: rose window in a pale ring, tall paired windows below.
  const tx = sg > 0 ? 20.6 : -21
  const te = sg > 0 ? along([tx, -15.2], [tx, -3]) : along([tx, -3], [tx, -15.2])
  const cm = te.L / 2
  disc(trim, te.at, cm, 22.0, 3.6, 0.06, 16)
  disc(win, te.at, cm, 22.0, 3.0, 0.1, 16)
  for (let k = 0; k < 4; k++) {
    const a = (Math.PI * k) / 4
    const dx = Math.cos(a) * 3.0, dz = Math.sin(a) * 3.0
    trim.quad(te.at(cm - dx - 0.1 * Math.sin(a), 22 - dz + 0.1 * Math.cos(a), 0.13), te.at(cm - dx + 0.1 * Math.sin(a), 22 - dz - 0.1 * Math.cos(a), 0.13),
      te.at(cm + dx + 0.1 * Math.sin(a), 22 + dz - 0.1 * Math.cos(a), 0.13), te.at(cm + dx - 0.1 * Math.sin(a), 22 + dz + 0.1 * Math.cos(a), 0.13))
  }
  for (const d of [-2.4, 2.4]) arched(win, te.at, cm + d, 1.4, 17.0, 20.0 - 0.7, 0.08, 6)
  // Corner pinnacles on the transept gable.
  for (const y of [-15.2, -3]) {
    const cx = tx + (sg > 0 ? -0.6 : 0.6)
    box(granite, cx - 0.6, y - 0.6, 27.5, cx + 0.6, y + 0.6, 30.2, null)
    const base: XY[] = [[cx - 0.6, y - 0.6], [cx + 0.6, y - 0.6], [cx + 0.6, y + 0.6], [cx - 0.6, y + 0.6]]
    for (let i = 0; i < 4; i++) { const a = base[i], b = base[(i + 1) % 4]; trim.tri([a[0], a[1], 30.2], [b[0], b[1], 30.2], [cx, y, 32.2]) }
  }
}

finishModel('Basilica of Our Lady of Perpetual Help', 'nyc-perpetual-help-basilica', [
  { part: granite, material: finish('olph-granite', 0xcdcac3) },
  { part: trim, material: finish('olph-trim', 0xe9e4d9) },
  { part: roof, material: finish('olph-roof-tile', 0xb26a55) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('olph-door', 0x6f5c4c) },
], { bearing: 308.2, osm: 'way/1096878089', height: NAVE_RIDGE + 3.6 })
