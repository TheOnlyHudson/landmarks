/**
 * Holy Ghost Catholic Church, Denver (1924–1943, Jacques Benedict) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-holy-ghost-church.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 45: +x runs
 * along the nave towards the altar (south-east, towards 1999 Broadway), -x
 * is the west front on 19th Street, +y the north-east side. Origin on the
 * ground at the anchor, the area centroid of OSM way/304684780
 * (-104.9879692, 39.7481003).
 *
 * Identity, in order:
 *  1. the square buff campanile at the front's south corner: plain shaft,
 *     a belfry of three round arches a face, a cornice and a low dome with
 *     a cross.                                                  (hgcc)
 *  2. a basilica: tall nave with a row of small round-arched clerestory
 *     windows, low aisles, transepts, all under dark grey-green roofs;
 *     cream-buff brick and stone.                         (shank, hgcc)
 *  3. the gabled west front with a tall round-arched window over a
 *     round-arched portal.                                       (hgcc)
 *  4. sitting right under the folded glass wall of 1999 Broadway.  (shank)
 *
 * Plan, OSM against lidar: the west front, the campanile and the north
 * and south sides match OSM way/304684780 within a metre in the lidar.
 * The east end does not: OSM stops the nave at 12.2 m with a narrow
 * sanctuary to 17.45, but the 2020 lidar has the full-width nave to 18.5,
 * transepts 8–17 and an apse out to about 23 (the "4 m south-east" the
 * 1999 Broadway builder saw). The model follows the lidar there; anchor
 * and replaces follow OSM. No new building lies under the extension (1999
 * Broadway's outline is 3+ m further on). NAIP (USGS) was too dark in the
 * tower's shadow to read the plan, so it was not used.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py at bearing 45. ground_min 1588.96 m; the
 * ground is flat at 3.0–3.4 above it (Mapterhorn: 0.7 m across); y = 0
 * here is ground_min + 2.9. Measured above y = 0: nave ridge 18.1, nave
 * eaves about 15; aisle roofs 7.5–8.5 falling to about 5 at the north
 * side; transept ridge 15.1; apse about 9–12; campanile cornice 25–26,
 * dome top 26.4–29 (29 taken as the top of the dome, the cross over it to
 * 31). No published heights found.
 *
 * Estimated from the photos: the belfry arches 1.3 m wide, 19.5–23.5;
 * the front window 3.6 m wide, 8–14.5, the portal 3 m wide to 6.5; the
 * clerestory windows 1 m wide at 3 m centres, 11.5–13.8; aisle windows.
 * Left out: the rose-coloured stone trim, the portal's columns, lamps,
 * the small north porch's detail, the cross on the front gable.
 *
 * Photos (Wikimedia Commons, evidence):
 *  hgcc   "HGCC&1999Broadway.jpg", Xnatedawgx, CC BY-SA 3.0 (front and
 *         campanile from the west, on 19th Street)
 *  shank  "1999 Broadway in Denver Colorado.jpg", David Shankbone, CC BY 3.0
 *         (the church's north-east side and transept under the tower)
 * Look-only (not relied on for shape or colour): Flickr photos by
 * dixie_law (CC BY-NC-ND 2.0), CarShowShooter (CC BY-NC-SA 2.0), Thomas
 * Hawk (CC BY-NC 2.0), Conlawprof (CC BY-NC-SA 2.0), as listed by
 * tools/photos.py openverse; not opened.
 * No commercial imagery.
 *
 * Doubts: only two licensed photos, both from the west and north; the
 * south side, the transept ends and the apse are drawn from the lidar
 * alone, plain. The campanile's dome profile is from one street photo.
 *
 * Night: the windows glow (window); the campanile is floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, gableRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { split } from './atl-flatiron-building'

const brick = new Part(), roof = new Part(), win = new Part(), trim = new Part()

/** A lean-to roof over a rectangle, high along y = yh, low along y = yl. */
function leanTo(x0: number, x1: number, yh: number, yl: number, zh: number, zl: number) {
  const a: V3 = [x0, yh, zh], b: V3 = [x1, yh, zh], c: V3 = [x1, yl, zl], d: V3 = [x0, yl, zl]
  if (yl > yh) roof.quad(a, b, c, d)
  else roof.quad(b, a, d, c)
  // close the ends between the aisle wall's top and the roof
  const w0 = (x: number, y: number, z: number): V3 => [x, y, z]
  const lo = Math.min(zh, zl)
  for (const [x, sgn] of [[x0, -1], [x1, 1]] as const) {
    const t = [w0(x, yh, lo), w0(x, yl, lo), w0(x, yh, zh)]
    const n = (yl - yh) * sgn
    if (n > 0) brick.tri(t[0], t[1], t[2])
    else brick.tri(t[1], t[0], t[2])
  }
}

// ── Nave: x -13.5..18.5, y -9..5, eaves 15, ridge 18.1 ──
const NX0 = -13.5, NX1 = 18.5, NY0 = -9, NY1 = 5, NE = 15
prism(brick, split(ccw([[NX0, NY0], [NX1, NY0], [NX1, NY1], [NX0, NY1]]), 4.8), 0, NE, null, 0)
gableRoof(roof, brick, NX0, NX1, NY0, NY1, NE, 18.1, 'x', 0.4, 0.3)
// ── Aisles: lean-tos against the nave ──
prism(brick, split(ccw([[-12.4, NY1], [2.8, NY1], [2.8, 15.9], [-12.4, 15.9]]), 4.8), 0, 5.0, null, 0)
leanTo(-12.4, 2.8, NY1, 15.9, 8.6, 5.0)
prism(brick, split(ccw([[-8.6, -14.6], [8.5, -14.6], [8.5, NY0], [-8.6, NY0]]), 4.8), 0, 6.4, null, 0)
leanTo(-8.6, 8.5, NY0, -14.6, 8.4, 6.4)
// ── Transepts: x 8..17, y -14.5..12.5, ridge 15.1 ──
prism(brick, split(ccw([[8, -14.5], [17, -14.5], [17, 12.5], [8, 12.5]]), 4.8), 0, 13.0, null, 0)
gableRoof(roof, brick, 8, 17, -14.5, 12.5, 13.0, 15.6, 'y', 0.4, 0.3)
// ── Apse: a half-round at the east end of the nave, conical roof ──
{
  const c: XY = [NX1, -2], r = 5.6, n = 8
  const ring: XY[] = Array.from({ length: n + 1 }, (_, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[i + 1]
    brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 9.5], [a[0], a[1], 9.5])
    roof.tri([a[0] + (a[0] - c[0]) * 0.06, a[1] + (a[1] - c[1]) * 0.06, 9.5], [b[0] + (b[0] - c[0]) * 0.06, b[1] + (b[1] - c[1]) * 0.06, 9.5], [c[0], c[1], 12.4])
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, archShape(L / 2, 1.0, 4.5, 7.5, 6), 0.06)
  }
}

// ── Clerestory and aisle windows ──
for (const [a, b] of [[[NX1, NY1], [NX0, NY1]], [[NX0, NY0], [NX1, NY0]]] as [XY, XY][]) {
  for (let s = 3; s < 29.5; s += 3) onWall(win, a, b, archShape(s, 1.0, 11.4, 13.3, 6), 0.06)
}
for (const [a, b, s0, s1] of [[[2.8, 15.9], [-12.4, 15.9], 2, 14], [[-8.6, -14.6], [8.5, -14.6], 2, 15.5]] as [XY, XY, number, number][]) {
  for (let s = s0; s <= s1; s += 3) onWall(win, a, b, archShape(s, 1.1, 1.6, 3.8, 6), 0.06)
}
// transept ends: a big round-headed window each
for (const [a, b] of [[[8, -14.5], [17, -14.5]], [[17, 12.5], [8, 12.5]]] as [XY, XY][]) {
  onWall(win, a, b, archShape(4.5, 3.0, 4.5, 10.5, 10), 0.06)
}

// ── West front: portal and great window ──
{
  const a: XY = [NX0, NY1], b: XY = [NX0, NY0] // seen from the west, s from north to south
  onWall(trim, a, b, archShape(7, 4.4, 0, 4.8, 12), 0.04)
  onWall(win, a, b, archShape(7, 3.0, 0, 4.9, 12), 0.08)
  onWall(trim, a, b, archShape(7, 4.4, 7.6, 12.6, 12), 0.04)
  onWall(win, a, b, archShape(7, 3.6, 8.0, 12.7, 12), 0.08)
  onWall(trim, a, b, rectShape(1.0, 13.0, 15.0, 15.4), 0.1)
  // the north aisle's front
  onWall(win, [-12.4, 15.9], [-12.4, NY1], archShape(5.4, 1.2, 1.8, 3.6, 6), 0.06)
}

// ── Campanile ──
const TC: XY = [-11.6, -12.4], TH = 3.0
box(brick, TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH, 0, 24.6, null, 0.2)
box(trim, TC[0] - TH - 0.35, TC[0] + TH + 0.35, TC[1] - TH - 0.35, TC[1] + TH + 0.35, 24.6, 25.6, trim, 0.25)
box(trim, TC[0] - TH - 0.15, TC[0] + TH + 0.15, TC[1] - TH - 0.15, TC[1] + TH + 0.15, 18.4, 18.9, trim, 0.1)
{
  const r = ccw([[TC[0] - TH, TC[1] - TH], [TC[0] + TH, TC[1] - TH], [TC[0] + TH, TC[1] + TH], [TC[0] - TH, TC[1] + TH]])
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    for (const d of [-1.5, 0, 1.5]) onWall(win, a, b, archShape(TH + d, 1.05, 19.4, 23.0, 8), 0.06)
    onWall(win, a, b, archShape(TH, 0.7, 10.5, 13.5, 6), 0.06)
  }
  // a door at the foot of the front (west) face
  onWall(win, r[3], r[0], archShape(TH, 1.8, 0, 2.6, 8), 0.06)
}
// drum and dome
revolve(brick, TC, [[2.6, 25.6], [2.6, 26.4], [2.45, 26.4]], 16, 0, false, true)
const dome: [number, number][] = Array.from({ length: 6 }, (_, i) => { const a = (i / 5) * (Math.PI / 2); return [2.45 * Math.cos(a), 26.4 + 2.6 * Math.sin(a)] as [number, number] })
revolve(brick, TC, dome, 16, 0, false, false)
box(trim, TC[0] - 0.12, TC[0] + 0.12, TC[1] - 0.12, TC[1] + 0.12, 28.9, 31.0, trim, 0.04)
box(trim, TC[0] - 0.6, TC[0] + 0.6, TC[1] - 0.12, TC[1] + 0.12, 29.9, 30.2, trim, 0.04)

await save('den-holy-ghost-church', 'Holy Ghost Catholic Church', [
  { part: brick, material: { ...finish('holy-ghost-brick', 0xdcc6a6), floodlight: (p, n) => (Math.hypot(p[0] - TC[0], p[1] - TC[1]) < 4.5 && n[2] < 0.9 ? 0.85 : 0) } },
  { part: roof, material: finish('holy-ghost-roof', 0x7f8b88) },
  { part: win, material: PALETTE.window },
  { part: trim, material: finish('holy-ghost-trim', 0xeee3d0) },
], { height: 31.0, anchor: [39.7481003, -104.9879692], bearing: 45 })
