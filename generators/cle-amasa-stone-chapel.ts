/**
 * Amasa Stone Chapel (Henry Vaughan, 1911), Case Western Reserve
 * University, Cleveland — original procedural geometry, CC0-1.0.
 * bun generators/cle-amasa-stone-chapel.ts
 *
 * Map frame of the model: x, y, z up, metres. Anchor = area centroid of
 * the OSM outline way/108445644, -81.60906127 41.50494291. Bearing 314:
 * model +y points north-west along the nave to the west front (the
 * entrance front facing the campus green), +x is the north-east side.
 * y = 0 is the lawn at the west front (lidar 1.3 above the box minimum);
 * the ground falls about 1 m toward the east end. Elevation 0.
 *
 * Identity, in order: the tall square tower beside the west gable, with
 * its paired louvred belfry lancets, stepped corner buttresses, parapet
 * and four tall corner pinnacles with smaller ones between; the west
 * gable with its great traceried window; the long slate nave roof with
 * three-light clerestory windows between buttresses over low flat-roofed
 * aisles; the east gable's great window; the gabled wing at the east end.
 *
 * Evidence:
 *  - plan: USGS 3DEP lidar (below), which this follows: nave x ±6.6,
 *    y -24.5..21; aisles to x ±8.8; tower x -13..-6.3, y 14.1..20.8;
 *    north-east wing x 8.8..13, y -18.5..-11.5; side porch x 8.8..12,
 *    y 4.2..9.4. The OSM outline (way/108445644, building=university)
 *    has the same parts, 1-2 m off toward the north-west at the front.
 *  - heights, measured: lidar OH_Statewide_Phase1_1_2019 (2019 flight),
 *    0.5 m grid, read with tools/lidar_frame.py at bearing 314, above
 *    y = 0: nave eaves 14.2, ridge 21.1; aisle roofs ~5 with parapets to
 *    ~6.5; tower roof and parapet 30-31.3; corner pinnacles 37.6 (lidar
 *    38.9 - 1.3); east wing 11-14; side porch ~7.
 *  - estimated from the photos scaled to the lidar: the tower's string
 *    courses (14.6, 19.6), the belfry lancets 20.4-28, the west door and
 *    the window over it, the middle-stage lancet; the great windows
 *    (6.0 m wide, sill 8.1 west / 7.3 east, apex ~17.6); six bays of
 *    clerestory windows 7.6-13; the aisle windows; the buttresses.
 *  - photos (all EVIDENCE):
 *    https://commons.wikimedia.org/wiki/File:Amasa_Stone_Chapel,_Case_Western_Reserve_University,_Cleveland,_OH_(28593892137).jpg
 *      Warren LeMay, CC0 — the west front and tower.
 *    https://commons.wikimedia.org/wiki/File:Amasa_Stone_Chapel_Case_Western_Reserve_University_Circle.jpg
 *      Usaf 1832, CC BY-SA 4.0 — the west front, pinnacles.
 *    https://commons.wikimedia.org/wiki/File:AmasaStone.jpg
 *      Spencer, CC BY-SA 2.5 — tower stages, belfry, door and window tracery.
 *    https://commons.wikimedia.org/wiki/File:Amasa_Stone_Chapel_from_Wade_Park.jpg
 *      Westmoon26, CC BY-SA 4.0 — the tower over the trees from the north.
 *    https://www.flickr.com/photos/59081381@N03/52979077502
 *      Warren LeMay, CC BY-SA 2.0 — the east gable, its window, the east wing.
 *    https://www.flickr.com/photos/59081381@N03/52979077647
 *      Warren LeMay, CC BY-SA 2.0 — the side bays: clerestory, buttresses, aisle windows.
 *    USGS NAIP orthophoto (public domain): the plan and the slate roof.
 *  - published: Henry Vaughan, architect; dedicated 1911 (Wikipedia
 *    "Amasa Stone Chapel").
 *  - colour: grey-buff Indiana limestone; grey slate roof; oak doors.
 *
 * Left out: the pierced parapet (solid), crockets, the flying-buttress
 *  arches (sloped buttress tops), the copper gutters, cusps and foils in
 *  the tracery (bold mullions and a Y fork only). Doubts: the south-west
 *  side is mostly hidden by trees in the photos and repeats the north-east
 *  bays; the porch's details are guessed from the aerial and lidar. The
 *  night look was not checked: only the windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'
import { pointed } from './cle-garfield-memorial'

type Box = [number, number, number, number]

function box(p: Part, r: Box, z0: number, z1: number, top: Part | null = p) {
  wallsSplit(p, rect(...r), z0, z1, 5)
  if (top) cap(top, rect(...r), z1)
}

/** Bold tracery bars in a pointed window: n lights, mullions to the springing, a Y fork in the head. */
function tracery(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, n: number, k = 0.6) {
  const w = s1 - s0, bw = 0.17
  for (let i = 1; i < n; i++) {
    const s = s0 + i * w / n
    panel(p, a, b, s - bw / 2, s + bw / 2, z0, zs, 0.06)
  }
  panel(p, a, b, s0, s1, zs - 0.09, zs + 0.09, 0.06) // the transom at the springing
  // the fork: two bars from the springing at the quarter points up to the apex
  const R = w * k, c = (s0 + s1) / 2, apex = zs + Math.sqrt(R * R - (c - (s1 - R)) ** 2)
  const { P, n: nn } = onWall(a, b)
  for (const sq of [s0 + w / 4, s1 - w / 4]) {
    const top = apex - 0.35
    const d = Math.sign(c - sq)
    poly(p, [P(sq - bw / 2, zs, 0.06), P(sq + bw / 2, zs, 0.06), P(c + d * bw / 2, top, 0.06), P(c - d * bw / 2, top, 0.06)], [nn[0], nn[1], 0])
  }
}

/** A tapering square pinnacle: shaft half-width h from z0 to z1, then a spire to tip. */
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number, tip: number) {
  const r = rect(x - h, y - h, x + h, y + h)
  walls(p, r, z0, z1)
  const t: V3 = [x, y, tip]
  for (let i = 0; i < 4; i++) {
    const p0 = r[i], p1 = r[(i + 1) % 4]
    poly(p, [[p0[0], p0[1], z1], [p1[0], p1[1], z1], t], [(p0[0] + p1[0]) / 2 - x, (p0[1] + p1[1]) / 2 - y, 0.3])
  }
}

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part()

  // Heights above the front lawn (lidar 1.3 above the box minimum).
  const NX = 6.6, YR = -24.5, YF = 21.0 // the nave walls, rear and front gables
  const EAVE = 14.2, RIDGE = 21.1
  const AX = 8.8, AISLE = 5.0 // the aisles
  const TW: Box = [-13.0, 14.1, -6.3, 20.8], TOP = 30.0 // the tower

  // ------------------------------------------------------------ nave
  wallsSplit(stone, rect(-NX, YR, NX, YF), 0, EAVE, 5)
  band(stone, rect(-NX, YR, NX, YF), grow([-NX, YR, NX, YF], 0.25), EAVE - 0.5, EAVE, 0.25)
  // the gables, standing a little proud of the roof
  for (const [y, out] of [[YF, 1], [YR, -1]] as [number, number][]) {
    const f: V3[] = [[-NX, y, EAVE], [NX, y, EAVE], [NX, y, EAVE + 0.5], [0, y, RIDGE + 0.4], [-NX, y, EAVE + 0.5]]
    const bk = f.map(([x, , z]) => [x, y - out * 0.6, z] as V3)
    poly(stone, f, [0, out, 0]); poly(stone, bk, [0, -out, 0])
    for (const [i, j] of [[2, 3], [3, 4]]) poly(stone, [f[i], f[j], bk[j], bk[i]], [f[i][0] + f[j][0], 0, 1])
    // a small vent lancet high in the gable, and the cross
    const a: XY = out > 0 ? [NX, y] : [-NX, y], b: XY = out > 0 ? [-NX, y] : [NX, y]
    pointed(win, a, b, NX - 0.35, NX + 0.35, 18.3, 19.0, 0.04, 0.6, 4)
    walls(trim, rect(-0.12, y - out * 0.3 - 0.12, 0.12, y - out * 0.3 + 0.12), RIDGE + 0.3, RIDGE + 1.6)
    walls(trim, rect(-0.5, y - out * 0.3 - 0.12, 0.5, y - out * 0.3 + 0.12), RIDGE + 0.95, RIDGE + 1.2)
    // the great window: six lights under a pointed head
    pointed(trim, a, b, NX - 3.3, NX + 3.3, out > 0 ? 7.8 : 7.0, 13.3, 0.03, 0.8)
    pointed(win, a, b, NX - 3.0, NX + 3.0, out > 0 ? 8.1 : 7.3, 13.3, 0.045, 0.8)
    tracery(trim, a, b, NX - 3.0, NX + 3.0, out > 0 ? 8.1 : 7.3, 13.3, out > 0 ? 6 : 5, 0.8)
    panel(trim, a, b, NX - 3.5, NX + 3.5, out > 0 ? 7.5 : 6.7, out > 0 ? 7.8 : 7.0, 0.08) // the sill course
    if (out > 0) for (const s of [NX - 2.0, NX + 2.0]) pointed(win, a, b, s - 0.3, s + 0.3, 2.8, 4.4, 0.04, 0.6, 3)
  }
  // the slate roof
  {
    const o = 0.4, s = (RIDGE - EAVE) / NX, ez = EAVE - o * s, y0 = YR + 0.6, y1 = YF - 0.6
    poly(slate, [[-NX - o, y0, ez], [-NX - o, y1, ez], [0, y1, RIDGE], [0, y0, RIDGE]], [-s, 0, 1])
    poly(slate, [[NX + o, y0, ez], [0, y0, RIDGE], [0, y1, RIDGE], [NX + o, y1, ez]], [s, 0, 1])
    poly(slate, [[-NX - o, y0, ez], [NX + o, y0, ez], [NX + o, y1, ez], [-NX - o, y1, ez]], [0, 0, -1])
  }

  // ------------------------------------------------------------ aisles and bays
  const B0 = YR + 0.8, B1 = TW[1] - 0.6, NB = 6, PITCH = (B1 - B0) / NB
  for (const sx of [-1, 1]) {
    const y1 = sx < 0 ? TW[1] : YF - 0.6
    const r: Box = sx < 0 ? [-AX, YR + 0.6, -NX, y1] : [NX, YR + 0.6, AX, y1]
    box(stone, r, 0, AISLE, slate)
    band(stone, rect(...r), grow(r, 0.15), AISLE, AISLE + 0.9, 0.1) // the parapet, drawn solid
    const a: XY = sx > 0 ? [AX, r[1]] : [-AX, r[3]], b: XY = sx > 0 ? [AX, r[3]] : [-AX, r[1]]
    const clA: XY = sx > 0 ? [NX, YR] : [-NX, YF], clB: XY = sx > 0 ? [NX, YF] : [-NX, YR]
    for (let i = 0; i < NB; i++) {
      const yc = B0 + (i + 0.5) * PITCH
      // the clerestory: three lights between the buttresses
      const s = sx > 0 ? yc - YR : YF - yc
      pointed(win, clA, clB, s - 1.5, s + 1.5, 7.6, 11.2, 0.045, 0.8)
      tracery(trim, clA, clB, s - 1.5, s + 1.5, 7.6, 11.2, 3, 0.8)
      // the aisle's paired lights
      const sa = sx > 0 ? yc - r[1] : r[3] - yc
      if (sa > 1.2 && sa < Math.hypot(b[0] - a[0], b[1] - a[1]) - 1.2) {
        panel(win, a, b, sa - 1.0, sa - 0.1, 1.3, 3.3, 0.04)
        panel(win, a, b, sa + 0.1, sa + 1.0, 1.3, 3.3, 0.04)
      }
    }
    // buttresses between the bays, rising past the aisle roof to a gablet on the nave wall
    for (let i = 0; i <= NB; i++) {
      const y = B0 + i * PITCH, x0 = sx > 0 ? NX : -AX - 0.9, x1 = sx > 0 ? AX + 0.9 : -NX
      const br: Box = [x0, y - 0.45, x1, y + 0.45]
      if (sx < 0 && y > TW[1] - 0.5) continue
      walls(stone, rect(...br), 0, AISLE + 0.6)
      // the buttress's sloped top falling outward from the nave wall
      const xi = sx > 0 ? NX : -NX, xo = sx > 0 ? AX + 0.9 : -AX - 0.9, zi = 12.5, zo = AISLE + 0.6
      const ya = y - 0.45, yb = y + 0.45
      poly(stone, [[xo, ya, zo], [xo, yb, zo], [xi, yb, zi], [xi, ya, zi]], [sx * (zi - zo), 0, Math.abs(xo - xi)])
      poly(stone, [[xi, ya, AISLE], [xo, ya, AISLE], [xo, ya, zo], [xi, ya, zi]], [0, -1, 0])
      poly(stone, [[xi, yb, AISLE], [xo, yb, AISLE], [xo, yb, zo], [xi, yb, zi]], [0, 1, 0])
      poly(stone, [[xo, ya, AISLE], [xo, yb, AISLE], [xo, yb, zo], [xo, ya, zo]], [sx, 0, 0])
    }
  }
  // the front buttress and pinnacle at the north-east corner of the front
  box(stone, [NX - 0.3, YF - 0.6, NX + 1.0, YF + 0.8], 0, 15.2)
  pinnacle(stone, NX + 0.35, YF + 0.1, 0.45, 15.2, 16.4, 19.2)

  // ------------------------------------------------------------ north-east wing at the back
  {
    const r: Box = [AX, -18.5, 13.0, -11.5], cy = (r[1] + r[3]) / 2, e = 10.0, rz = 14.0
    box(stone, r, 0, e, null)
    for (const [x, out] of [[r[2], 1]] as [number, number][]) poly(stone, [[x, r[1], e], [x, r[3], e], [x, cy, rz]], [out, 0, 0])
    poly(slate, [[r[0], r[1] - 0.3, e - 0.2], [r[2] + 0.3, r[1] - 0.3, e - 0.2], [r[2] + 0.3, cy, rz], [r[0], cy, rz]], [0, -1, 1])
    poly(slate, [[r[0], r[3] + 0.3, e - 0.2], [r[0], cy, rz], [r[2] + 0.3, cy, rz], [r[2] + 0.3, r[3] + 0.3, e - 0.2]], [0, 1, 1])
    const a: XY = [r[2], r[1]], b: XY = [r[2], r[3]]
    pointed(win, a, b, 2.2, 4.8, 4.0, 7.6, 0.04, 0.8)
    tracery(trim, a, b, 2.2, 4.8, 4.0, 7.6, 2, 0.8)
  }

  // the side porch on the north-east aisle
  {
    const r: Box = [AX, 4.2, 12.0, 9.4]
    box(stone, r, 0, 6.2, slate)
    band(stone, rect(...r), grow(r, 0.15), 6.2, 7.0, 0.1)
    const a: XY = [r[2], r[1]], b: XY = [r[2], r[3]], m = (r[3] - r[1]) / 2
    pointed(trim, a, b, m - 1.3, m + 1.3, 0, 3.4, 0.03, 0.8)
    pointed(door, a, b, m - 0.9, m + 0.9, 0, 3.2, 0.05, 0.8)
  }

  // ------------------------------------------------------------ the tower
  {
    const [x0, y0, x1, y1] = TW, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    wallsSplit(stone, rect(...TW), 0, TOP, 5)
    for (const z of [14.6, 19.6]) band(stone, rect(...TW), grow(TW, 0.18), z, z + 0.35, 0.15)
    // the corner buttresses, stepping in at the string courses
    for (const [px, py] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
      const dx = px === x0 ? -1 : 1, dy = py === y0 ? -1 : 1
      for (const [d, za, zb] of [[0.9, 0, 14.6], [0.6, 14.6, 19.6], [0.35, 19.6, TOP]]) {
        // one strip on each face, meeting at the corner
        box(stone, [Math.min(px, px + dx * d), Math.min(py - dy * 1.25, py), Math.max(px, px + dx * d), Math.max(py - dy * 1.25, py)], za, zb)
        box(stone, [Math.min(px - dx * 1.25, px), Math.min(py, py + dy * d), Math.max(px - dx * 1.25, px), Math.max(py, py + dy * d)], za, zb)
      }
      pinnacle(stone, px - dx * 0.35, py - dy * 0.35, 0.7, TOP, 34.6, 37.6)
    }
    // the parapet, with its crenels as a trim band, and the middle pinnacles
    band(stone, rect(...TW), grow(TW, 0.3), TOP - 0.6, TOP, 0.3)
    {
      const o = rect(...TW), i = rect(x0 + 0.4, y0 + 0.4, x1 - 0.4, y1 - 0.4), zt = TOP + 1.3
      walls(stone, o, TOP, zt); walls(stone, [...i].reverse(), TOP, zt)
      for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; stone.quad([o[k][0], o[k][1], zt], [o[l][0], o[l][1], zt], [i[l][0], i[l][1], zt], [i[k][0], i[k][1], zt]) }
      cap(slate, i, TOP - 0.2)
    }
    for (const [px, py] of [[cx, y0 + 0.2], [cx, y1 - 0.2], [x0 + 0.2, cy], [x1 - 0.2, cy]]) pinnacle(stone, px, py, 0.3, TOP + 1.3, 32.3, 34.0)
    // openings, face by face (S, E, N, W of the box = SW side, nave side, front, back)
    const faces: [XY, XY][] = [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
    faces.forEach(([a, b], f) => {
      const { L } = onWall(a, b), m = L / 2
      // the belfry: two tall lancets with louvres, over blind tracery
      if (f !== 1 || true) for (const s of [m - 1.15, m + 1.15]) {
        pointed(win, a, b, s - 0.7, s + 0.7, 20.4, 27.0, 0.05, 0.8)
        panel(trim, a, b, s - 0.08, s + 0.08, 20.4, 27.0, 0.07)
        panel(trim, a, b, s - 0.7, s + 0.7, 22.4, 22.6, 0.07)
      }
      if (f === 1) return // the nave side: the nave roof meets it below the belfry
      pointed(win, a, b, m - 0.45, m + 0.45, 16.0, 17.6, 0.05, 0.6, 4) // the middle stage's lancet
      if (f === 2) {
        // the west door, its pointed arch, and the traceried window above
        pointed(trim, a, b, m - 1.6, m + 1.6, 0.6, 4.6, 0.03, 0.8)
        pointed(door, a, b, m - 1.1, m + 1.1, 0.8, 4.4, 0.05, 0.8)
        pointed(trim, a, b, m - 1.7, m + 1.7, 6.6, 10.4, 0.03, 0.8)
        pointed(win, a, b, m - 1.25, m + 1.25, 7.0, 10.4, 0.045, 0.8)
        tracery(trim, a, b, m - 1.25, m + 1.25, 7.0, 10.4, 3, 0.8)
        box(stone, [m + x0 - 2.0, y1, m + x0 + 2.0, y1 + 1.6], 0, 0.4) // the steps
        box(stone, [m + x0 - 2.0, y1, m + x0 + 2.0, y1 + 0.8], 0.4, 0.8)
      } else {
        pointed(win, a, b, m - 0.8, m + 0.8, 7.5, 10.4, 0.045, 0.6)
      }
    })
  }

  return [
    { part: stone, material: finish('cle-asc-limestone', 0xe1dbcd) },
    { part: trim, material: PALETTE.trim },
    { part: slate, material: finish('cle-asc-slate', 0x7a7f86) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('cle-asc-oak', 0x8a5a3c) },
  ]
}

if (import.meta.main) await save('cle-amasa-stone-chapel', 'Amasa Stone Chapel', [41.50494291, -81.60906127], 314, build() as any, 5000)
