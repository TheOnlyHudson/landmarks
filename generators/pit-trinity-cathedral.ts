/**
 * Trinity Episcopal Cathedral (1872, Gordon W. Lloyd), Sixth Avenue,
 * Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-trinity-cathedral.ts
 *
 * This file also exports the small Gothic kit (gabled and lean-to roofs,
 * pinnacles, gablets, roses, round-headed panels, octagonal spires) that
 * pit-first-presbyterian-church.ts and pit-smithfield-united-church.ts build
 * with; merge it first. It builds on the pointed-window helpers exported by
 * pit-cathedral-of-learning.ts and the polygon kit in chi-aon-center.ts.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/118672811, -79.9986907 40.4413057. Its walls run at 26°, so
 * the catalog bearing is 26: model +y (north-north-east) is the Sixth
 * Avenue front with the tower, -y the parish house on Oliver Avenue.
 *
 * Identity, in order: the tall stone spire on the square front tower at the
 * north-west corner of the front, with gabled clock faces on each side and
 * corner pinnacles where the spire starts; the very tall paired belfry
 * lancets on the tower's upper stage, its angle buttresses; the long steep
 * slate nave roof running back from the front gable and its big traceried
 * front window; the lower transept, its west gable holding a rose window;
 * the brown-grey sandstone. Behind, the flat-roofed parish house with its
 * gabled Oliver Avenue front, the low crenellated wing and the stone
 * bellcote on the chancel roof.
 *
 * Evidence:
 *  - plan: OSM outline way/118672811 turned into this frame: nave and front
 *    gable x -3.5..11.5 to y 30, tower x -9.8..-2.2, y 25..32.6, transept
 *    y -4..6 from x -11 to the neighbour at x 18.5, parish house x
 *    -25.5..-1, y -25..-2, low wing x 0..15, y -25..-14. The lidar agrees
 *    with the outline to about a metre.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid. y = 0 is the Oliver Avenue sidewalk, the lowest ground; the
 *    Sixth Avenue front stands about 2 m higher (lidar ground 3 vs 1 m above
 *    the box minimum; the map's terrain shows ~1 m), so the front doors sit
 *    at z 2. Above y = 0: tower top 35, nave ridge 23.5, nave eaves 14,
 *    aisle roofs 9.5-13, transept ridge 21 and eaves 13, chancel ridge 20,
 *    parish house roof 18.4 (its gable 21 at x -8..-9, which puts the
 *    front's centre at x -9), low wing 8, bellcote ~29. (The lidar grid in
 *    work/ is centred 20 m from the anchor; read with the offset applied.) Spire:
 *    highest return 61 m above y = 0; the tip with its cross is put at 65
 *    (estimated: a finial too thin for a 0.5 m grid).
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    "Trinity Cathedral, Pittsburgh, 2020-01-21.jpg"
 *      https://commons.wikimedia.org/wiki/File:Trinity_Cathedral,_Pittsburgh,_2020-01-21.jpg
 *      Cbaile19, CC0 — from the churchyard (north-west): tower, spire,
 *      front gable, west flank, the rose-window transept gable.
 *    "Pittsburgh trinitychurch.jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh_trinitychurch.jpg
 *      PerryPlanet, public domain — the tower from Sixth Avenue.
 *    "Pittsburgh, Pennsylvania (8482586161).jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh,_Pennsylvania_(8482586161).jpg
 *      Doug Kerr, CC BY-SA 2.0 — the tower top: clock gables, pinnacles.
 *    "Roofscape from Oliver Avenue, 2023-11-15.jpg"
 *      https://commons.wikimedia.org/wiki/File:Roofscape_from_Oliver_Avenue,_2023-11-15.jpg
 *      Cbaile19, CC0 — from the south: spire lucarnes, the bellcote.
 *    "Rear of Trinity Cathedral and First Presbyterian Church, Pittsburgh, 2023-11-15.jpg"
 *      https://commons.wikimedia.org/wiki/File:Rear_of_Trinity_Cathedral_and_First_Presbyterian_Church,_Pittsburgh,_2023-11-15.jpg
 *      Cbaile19, CC0 — the Oliver Avenue side: the low crenellated wing.
 *    "Rear of Trinity Cathedral, Pittsburgh, 2023-11-15.jpg"
 *      https://commons.wikimedia.org/wiki/File:Rear_of_Trinity_Cathedral,_Pittsburgh,_2023-11-15.jpg
 *      Cbaile19, CC0 — the parish house front head-on: the stepped
 *      parapet and gable with a small pinnacle at each step, the pale
 *      framed great window over the portal, the flattened pointed upper
 *      windows, the square lower windows; every size on that front is
 *      scaled from it (~75 px/m against the 18.4 m wall).
 *    "Trinity Episcopal Cathedral-Pittsburgh.jpg"
 *      https://commons.wikimedia.org/wiki/File:Trinity_Episcopal_Cathedral-Pittsburgh.jpg
 *      Adam W. Ritchey, CC BY-SA 4.0 — the tower in sun: stone colour.
 *  - colour: brown-grey sandstone (warmer, pinker in sun), pulled to the
 *    palette's lightness; grey slate; red-painted doors.
 * Estimated: every window and door size and height (scaled from the photos
 * against the lidar heights), the clock gables, pinnacles and lucarnes, the
 * aisle and clerestory split of the nave roof (the lidar shows a step the
 * photos barely show), the parish house front west of its gabled centre
 * (cut off in the photo; the same rows continued), the red-brick upper
 * wall over the low wing (drawn in the sandstone).
 *
 * Doubts: the east side is hard against the neighbouring tower and no photo
 * shows it; the chancel and its sacristy are seen only as roofs. Night: no
 * licensed night photo was found; only the windows glow.
 *
 * Left out: crockets, the iron fence and churchyard, the weathervane cross,
 * window glazing bars beyond a mullion or two, string courses.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { bar, faces, greatWindow, pier, pointed } from './pit-cathedral-of-learning'

// ---------------------------------------------------------------------------
// Gothic kit, shared with pit-first-presbyterian-church.ts and
// pit-smithfield-united-church.ts.

/** A planar polygon, fanned, wound to face `out`. */
export function poly(p: Part, pts: V3[], out: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** An axis-aligned box: walls from z0 to z1, and a top unless `top` is null. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(top, rect(x0, y0, x1, y1), z1)
}

/**
 * A gabled roof over the box x0..x1, y0..y1: eaves at `eave`, ridge at
 * `ridge` along `along`, slopes in `roof` running `over` past the walls, the
 * gable triangles in `wall` (only the ends listed in `ends`, [low, high]).
 */
export function gable(roof: Part, wall: Part, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, along: 'x' | 'y', ends: [boolean, boolean] = [true, true], over = 0.35) {
  if (along === 'y') {
    const xc = (x0 + x1) / 2, k = (ridge - eave) / (xc - x0), ze = eave - over * k
    poly(roof, [[x0 - over, y0, ze], [x0 - over, y1, ze], [xc, y1, ridge], [xc, y0, ridge]], [-1, 0, 1])
    poly(roof, [[x1 + over, y0, ze], [x1 + over, y1, ze], [xc, y1, ridge], [xc, y0, ridge]], [1, 0, 1])
    poly(roof, [[x0 - over, y0, ze], [x0 - over, y1, ze], [x0, y1, eave], [x0, y0, eave]], [0, 0, -1])
    poly(roof, [[x1 + over, y0, ze], [x1 + over, y1, ze], [x1, y1, eave], [x1, y0, eave]], [0, 0, -1])
    if (ends[0]) poly(wall, [[x0, y0, eave], [x1, y0, eave], [xc, y0, ridge]], [0, -1, 0])
    if (ends[1]) poly(wall, [[x0, y1, eave], [x1, y1, eave], [xc, y1, ridge]], [0, 1, 0])
  } else {
    const yc = (y0 + y1) / 2, k = (ridge - eave) / (yc - y0), ze = eave - over * k
    poly(roof, [[x0, y0 - over, ze], [x1, y0 - over, ze], [x1, yc, ridge], [x0, yc, ridge]], [0, -1, 1])
    poly(roof, [[x0, y1 + over, ze], [x1, y1 + over, ze], [x1, yc, ridge], [x0, yc, ridge]], [0, 1, 1])
    poly(roof, [[x0, y0 - over, ze], [x1, y0 - over, ze], [x1, y0, eave], [x0, y0, eave]], [0, 0, -1])
    poly(roof, [[x0, y1 + over, ze], [x1, y1 + over, ze], [x1, y1, eave], [x0, y1, eave]], [0, 0, -1])
    if (ends[0]) poly(wall, [[x0, y0, eave], [x0, y1, eave], [x0, yc, ridge]], [-1, 0, 0])
    if (ends[1]) poly(wall, [[x1, y0, eave], [x1, y1, eave], [x1, yc, ridge]], [1, 0, 0])
  }
}

/** A lean-to roof over x0..x1, y0..y1 falling from `hi` on side `side` to `lo`; end triangles in `wall`. */
export function lean(roof: Part, wall: Part, x0: number, y0: number, x1: number, y1: number, lo: number, hi: number, side: 'x0' | 'x1' | 'y0' | 'y1') {
  const z = (x: number, y: number) => {
    const t = side === 'x0' ? (x1 - x) / (x1 - x0) : side === 'x1' ? (x - x0) / (x1 - x0) : side === 'y0' ? (y1 - y) / (y1 - y0) : (y - y0) / (y1 - y0)
    return lo + (hi - lo) * t
  }
  const q: V3[] = [[x0, y0, z(x0, y0)], [x1, y0, z(x1, y0)], [x1, y1, z(x1, y1)], [x0, y1, z(x0, y1)]]
  const n: V3 = side === 'x0' ? [1, 0, 2] : side === 'x1' ? [-1, 0, 2] : side === 'y0' ? [0, 1, 2] : [0, -1, 2]
  poly(roof, q, n)
  // the sloping end walls
  const base = Math.min(lo, hi)
  if (side === 'x0' || side === 'x1') {
    poly(wall, [[x0, y0, base], [x1, y0, base], [x1, y0, z(x1, y0)], [x0, y0, z(x0, y0)]], [0, -1, 0])
    poly(wall, [[x0, y1, base], [x1, y1, base], [x1, y1, z(x1, y1)], [x0, y1, z(x0, y1)]], [0, 1, 0])
  } else {
    poly(wall, [[x0, y0, base], [x0, y1, base], [x0, y1, z(x0, y1)], [x0, y0, z(x0, y0)]], [-1, 0, 0])
    poly(wall, [[x1, y0, base], [x1, y1, base], [x1, y1, z(x1, y1)], [x1, y0, z(x1, y0)]], [1, 0, 0])
  }
}

/** A square pinnacle: a shaft w wide from z0 to z1, then a pyramid to `tip`. */
export function pinnacle(p: Part, cx: number, cy: number, w: number, z0: number, z1: number, tip: number) {
  const r = rect(cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2)
  walls(p, r, z0, z1)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    p.tri([a[0], a[1], z1], [b[0], b[1], z1], [cx, cy, tip])
  }
}

/** A ring of n points of circumradius r about (cx, cy) at height z, the first at angle a0. */
export const ring = (cx: number, cy: number, r: number, z: number, n = 8, a0 = Math.PI / 8): V3[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (i * 2 * Math.PI) / n), cy + r * Math.sin(a0 + (i * 2 * Math.PI) / n), z] as V3)

/** A polygonal spire from a ring at z0 to a point. */
export function spireTo(p: Part, base: V3[], tip: V3) {
  for (let i = 0; i < base.length; i++) p.tri(base[i], base[(i + 1) % base.length], tip)
}

/**
 * A gablet on wall a→b: a triangular gable centred at s, `w` wide, from z0
 * to the apex z1, standing `d` deep behind the wall line (its slopes run
 * back into the mass behind). Face in `face`, slopes in `slope`.
 */
export function gablet(face: Part, slope: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, d: number, out = 0) {
  const { P } = onWall(a, b)
  const L = P(s - w / 2, z0, out), R = P(s + w / 2, z0, out), T = P(s, z1, out)
  const Lb = P(s - w / 2, z0, out - d), Rb = P(s + w / 2, z0, out - d), Tb = P(s, z1, out - d)
  const { n } = onWall(a, b)
  poly(face, [L, R, T], [n[0], n[1], 0])
  const { u } = onWall(a, b)
  poly(slope, [L, T, Tb, Lb], [-u[0], -u[1], 1])
  poly(slope, [R, T, Tb, Rb], [u[0], u[1], 1])
}

/** A round (rose or oculus) window on wall a→b centred at (s, z): glass in `win`, `spokes` bars in `tr`. */
export function rose(win: Part, tr: Part | null, a: XY, b: XY, s: number, z: number, r: number, spokes = 0, seg = 14) {
  const { P } = onWall(a, b)
  const c = P(s, z, 0.04)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    win.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), 0.04), P(s + r * Math.cos(t1), z + r * Math.sin(t1), 0.04))
  }
  if (tr) for (let i = 0; i < spokes / 2; i++) {
    const t = (i * Math.PI * 2) / spokes + Math.PI / 2
    bar(tr, a, b, [s - r * 0.95 * Math.cos(t), z - r * 0.95 * Math.sin(t)], [s + r * 0.95 * Math.cos(t), z + r * 0.95 * Math.sin(t)], 0.16, 0.08)
  }
}

/** A round-headed panel on wall a→b: jambs s0..s1 from z0 to zs, then a true semicircle. */
export function arched(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.04, seg = 8) {
  const { P } = onWall(a, b)
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2
  const pts: [number, number][] = [[s0, z0], [s1, z0]]
  for (let i = 0; i <= seg; i++) { const t = (Math.PI * i) / seg; pts.push([c + r * Math.cos(t), zs + r * Math.sin(t)]) }
  const ctr = P(c, (z0 + zs) / 2, out)
  for (let i = 0; i < pts.length; i++) {
    const q = pts[i], n = pts[(i + 1) % pts.length]
    p.tri(ctr, P(q[0], q[1], out), P(n[0], n[1], out))
  }
}

/** A block standing on wall a→b: s0..s1 along it, from o0 to o1 out from it (negative = inside), z0..z1. */
export function wallBlock(p: Part, a: XY, b: XY, s0: number, s1: number, o0: number, o1: number, z0: number, z1: number) {
  const { P } = onWall(a, b)
  let r: XY[] = [P(s0, 0, o1), P(s1, 0, o1), P(s1, 0, o0), P(s0, 0, o0)].map((v) => [v[0], v[1]] as XY)
  if (area(r) < 0) r = r.reverse()
  walls(p, r, z0, z1)
  cap(p, r, z1)
}

/** Crenellations along wall a→b at height z: merlons `m` wide every `pitch`, `h` high, `d` thick. */
export function crenels(p: Part, a: XY, b: XY, z: number, m = 1.0, pitch = 2.0, h = 0.9, d = 0.5) {
  const { L } = onWall(a, b)
  const n = Math.max(1, Math.round(L / pitch))
  for (let i = 0; i < n; i++) {
    const s = (L * (i + 0.5)) / n
    wallBlock(p, a, b, s - m / 2, s + m / 2, -d, 0.05, z, z + h)
  }
}

// ---------------------------------------------------------------------------
// Trinity Cathedral

function build() {
  const stone = new Part(), win = new Part(), slate = new Part(), tr = new Part(), door = new Part()

  // ---- the tower: x -9.8..-2.2, y 25..32.6
  const TX0 = -9.8, TX1 = -2.2, TY0 = 25, TY1 = 32.6, TCX = (TX0 + TX1) / 2, TCY = (TY0 + TY1) / 2, TOP = 35
  box(stone, TX0, TY0, TX1, TY1, 0, TOP)
  const tf = faces(TX0, TY0, TX1, TY1) // S, E, N, W
  const TW = TX1 - TX0
  for (const k of [1, 2, 3]) {
    const [a, b] = tf[k], c = TW / 2
    // the very tall paired belfry lancets, under a hood
    pointed(stone, a, b, c - 2.35, c + 2.35, 22.2, 29.8, 0.05)
    for (const sg of [-1, 1]) pointed(win, a, b, c + sg * 1.1 - 0.75, c + sg * 1.1 + 0.75, 22.8, 30.6, 0.1)
    // the middle stage: a pair of shorter lancets
    for (const sg of [-1, 1]) pointed(win, a, b, c + sg * 1.05 - 0.6, c + sg * 1.05 + 0.6, 12.6, 18.4, 0.04)
    // the set-off between the stages
    bar(tr, a, b, [0.2, 21.4], [TW - 0.2, 21.4], 0.35, 0.12)
  }
  {
    // front (north) face: the tower portal with red doors; west face: a lancet
    const [a, b] = tf[2], c = TW / 2
    pointed(tr, a, b, c - 1.9, c + 1.9, 2, 6.6, 0.06)
    pointed(door, a, b, c - 1.4, c + 1.4, 2, 6.4, 0.12)
    const [wa, wb] = tf[3]
    pointed(win, wa, wb, c - 0.8, c + 0.8, 4.0, 7.8, 0.04)
  }
  // angle buttresses, two at each corner, stepping in at 12 and 21
  for (const [a, b] of tf) {
    for (const s of [0.55, TW - 0.55]) {
      pier(stone, a, b, s, 1.1, 0, 12, 1.2, 0.8)
      pier(stone, a, b, s, 1.0, 12, 21, 0.85, 0.7)
      pier(stone, a, b, s, 0.9, 21, 32.5, 0.5, 0.8)
    }
  }
  // parapet band, the clock gables on all four faces, corner pinnacles
  walls(stone, rect(TX0 - 0.3, TY0 - 0.3, TX1 + 0.3, TY1 + 0.3), TOP - 1.2, TOP)
  cap(slate, rect(TX0 - 0.3, TY0 - 0.3, TX1 + 0.3, TY1 + 0.3), TOP)
  for (const [a0, b0] of faces(TX0 - 0.3, TY0 - 0.3, TX1 + 0.3, TY1 + 0.3)) {
    const { L } = onWall(a0, b0)
    gablet(stone, slate, a0, b0, L / 2, 4.6, TOP, TOP + 5.2, 2.6, 0.02)
    rose(tr, null, a0, b0, L / 2, TOP + 1.9, 0.95, 0, 12) // the clock dial
  }
  for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]) pinnacle(stone, x, y, 1.35, 30, TOP + 1.6, TOP + 6.8)
  // the spire: octagonal, from inside the parapet to the cross
  const SP0 = ring(TCX, TCY, 3.35, TOP, 8)
  const SP1 = ring(TCX, TCY, 3.0, TOP + 2.5, 8)
  stone.loft([SP0, SP1])
  spireTo(stone, SP1, [TCX, TCY, 65])
  // the lucarnes: a tier of small gabled lights on the cardinal faces
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2, rr = 3.0 - (44.5 - TOP - 2.5) * (3.0 / (65 - TOP - 2.5))
    const dx = Math.cos(ang), dy = Math.sin(ang), cx = TCX + dx * rr, cy = TCY + dy * rr
    const a: XY = [cx + dy * 0.7, cy - dx * 0.7], b: XY = [cx - dy * 0.7, cy + dx * 0.7]
    // a face perpendicular to the radius: build a small gabled box
    const { P } = onWall(a, b)
    const q = (s: number, z: number, o: number) => P(s, z, o)
    poly(stone, [q(0, 42, 0.6), q(1.4, 42, 0.6), q(1.4, 45, 0.6), q(0.7, 46.6, 0.6), q(0, 45, 0.6)], [dx, dy, 0])
    poly(stone, [q(0, 42, 0.6), q(0, 45, 0.6), q(0, 45, -1.2), q(0, 42, -1.2)], [-dy, dx, 0])
    poly(stone, [q(1.4, 42, 0.6), q(1.4, 45, 0.6), q(1.4, 45, -1.2), q(1.4, 42, -1.2)], [dy, -dx, 0])
    poly(slate, [q(0, 45, 0.6), q(0.7, 46.6, 0.6), q(0.7, 46.6, -1.2), q(0, 45, -1.2)], [-dy, dx, 1])
    poly(slate, [q(1.4, 45, 0.6), q(0.7, 46.6, 0.6), q(0.7, 46.6, -1.2), q(1.4, 45, -1.2)], [dy, -dx, 1])
    pointed(slate, a, b, 0.4, 1.0, 42.6, 44.6, 0.62)
  }

  // ---- nave x -3.5..11.5, y 3..30; aisles under a lower slope each side
  const NX0 = -3.5, NX1 = 11.5, NY0 = 3, NY1 = 30, NE = 14, NR = 23.5
  walls(stone, rect(NX0, NY0, NX1, NY1), 0, NE)
  gable(slate, stone, NX0, -4, NX1, NY1, NE, NR, 'y', [true, true])
  // west aisle (behind the tower) and east aisle, lean-to
  box(stone, -6.5, 6, NX0, 25, 0, 9.5, null)
  lean(slate, stone, -6.5, 6, NX0, 25, 9.5, 13, 'x1')
  box(stone, NX1, 6, 15, NY1, 0, 9.5, null)
  lean(slate, stone, NX1, 6, 15, NY1, 9.5, 13, 'x0')
  // nave front gable: the big traceried window, the portal under it
  {
    const [a, b] = faces(NX0, NY0, NX1, NY1)[2] // north face, runs from x 11.5 to -3.5
    // s measured from x 11.5 westward; the window centred on the nave (x 4)
    const c = NX1 - 4
    greatWindow(win, tr, a, b, c - 2.4, c + 2.4, 9.0, 15.4, 3, [12.4])
    pointed(tr, a, b, c - 1.9, c + 1.9, 2, 6.6, 0.06)
    pointed(door, a, b, c - 1.4, c + 1.4, 2, 6.4, 0.12)
    rose(win, null, a, b, c, 19.6, 0.9, 0, 10)
    // gable-end buttresses
    pier(stone, a, b, 0.6, 1.1, 0, 15, 1.0, 1.4)
    pinnacle(stone, NX1 + 0.1, NY1 + 0.45, 1.0, 13, 16.2, 19.2)
    // the east aisle front: one lancet
    const [ea, eb] = faces(NX1, 6, 15, NY1)[2]
    pointed(win, ea, eb, 1.15, 2.35, 3.5, 7.0, 0.04)
  }
  // aisle lancets in pairs, small clerestory lights above
  for (const [[a, b], s0, s1] of [[faces(-6.5, 6, NX0, 25)[3], 1.5, 18], [faces(NX1, 6, 15, NY1)[1], 1.5, 23]] as [[XY, XY], number, number][]) {
    for (let s = s0; s <= s1; s += 4.1) {
      pier(stone, a, b, s - 0.4, 0.7, 0, 8.5, 0.55, 0.9)
      for (const ds of [1.0, 2.5]) pointed(win, a, b, s + ds - 0.5, s + ds + 0.5, 3.0, 6.6, 0.04)
    }
  }
  // the little octagonal turret at the nave/transept angle (west)
  {
    const t = ring(NX0 - 0.6, 6.6, 0.75, 9.5, 8)
    stone.loft([t, ring(NX0 - 0.6, 6.6, 0.75, 16.5, 8)])
    spireTo(stone, ring(NX0 - 0.6, 6.6, 0.75, 16.5, 8), [NX0 - 0.6, 6.6, 19.5])
  }

  // ---- transept y -4..6, x -11..18.5: ridge 21 across, west gable with the rose
  const TRX0 = -11, TRX1 = 18.5, TRY0 = -4, TRY1 = 6, TRE = 13, TRR = 21
  walls(stone, rect(TRX0, TRY0, TRX1, TRY1), 0, TRE)
  gable(slate, stone, TRX0, TRY0, NX0, TRY1, TRE, TRR, 'x', [true, false])
  gable(slate, stone, NX1, TRY0, TRX1, TRY1, TRE, TRR, 'x', [false, true])
  {
    const [a, b] = faces(TRX0, TRY0, TRX1, TRY1)[3] // west face, from y 6 to -4
    const c = 5
    rose(win, tr, a, b, c, 14.6, 2.3, 8, 16)
    for (const sg of [-1, 1]) pointed(win, a, b, c + sg * 1.4 - 0.6, c + sg * 1.4 + 0.6, 4.2, 9.6, 0.04)
    for (const s of [0.5, 9.5]) pier(stone, a, b, s, 1.0, 0, 13.5, 0.9, 1.4)
    // its north face, west of the aisle: one lancet
    const [na, nb] = faces(TRX0, TRY0, -6.5, TRY1)[2]
    pointed(win, na, nb, 1.4, 2.6, 3.5, 8.5, 0.04)
  }
  // small west porch, gabled
  box(stone, -15, 4.6, TRX0, 9.6, 0, 6)
  gable(slate, stone, -15, 4.6, TRX0, 9.6, 6, 8.6, 'x', [true, false], 0.25)
  {
    const [a, b] = faces(-15, 4.6, TRX0, 9.6)[3]
    pointed(door, a, b, 1.6, 3.4, 0.6, 3.6, 0.06)
  }

  // ---- chancel y -14..-4 (ridge 20), its sacristy east, the bellcote
  walls(stone, rect(-1, -14, 10, TRY0), 0, 14)
  gable(slate, stone, -1, -14, 10, TRY0, 14, 20, 'y', [true, false])
  box(stone, 10, -13, 15, TRY0, 0, 13.2, slate)
  {
    // the bellcote, astride the transept's south slope over the chancel
    const bx0 = 2.6, bx1 = 6.0, by0 = -5.2, by1 = -3.9
    box(stone, bx0, by0, bx1, by1, 15, 24.6, null)
    gable(slate, stone, bx0, by0, bx1, by1, 24.6, 27.4, 'x', [true, true], 0.15)
    pinnacle(stone, (bx0 + bx1) / 2, (by0 + by1) / 2, 0.45, 27.2, 27.6, 29)
    for (const [a, b] of [faces(bx0, by0, bx1, by1)[0], faces(bx0, by0, bx1, by1)[2]]) {
      for (const s of [1.0, 2.4]) pointed(slate, a, b, s - 0.5, s + 0.5, 21.0, 23.3, 0.04)
    }
  }

  // ---- the parish house (x -25.5..-1, y -25..-2): flat roof 18.4, the
  // Oliver Avenue front read off its head-on photo (Rear of Trinity
  // Cathedral, 2023-11-15) at ~75 px/m against the lidar wall height: a
  // stepped parapet rising in three steps to a steep central gable with a
  // small pinnacle at each step, the tall pointed window over the pointed
  // portal, flattened pointed windows above, square windows below. Its
  // centre is at x -9 (lidar: the gable's 21 m peak at x -8..-9).
  const PX0 = -25.5, PX1 = -1, PY0 = -25, PY1 = -2, PH = 18.4
  walls(stone, rect(PX0, PY0, PX1, PY1), 0, PH)
  walls(stone, rect(PX0, PY0, PX1, PY1), PH, PH + 0.6, rect(PX0, PY0, PX1, PY1))
  cap(slate, rect(PX0 + 0.4, PY0 + 0.4, PX1 - 0.4, PY1 - 0.4), PH + 0.2)
  {
    const [a, b] = faces(PX0, PY0, PX1, PY1)[0] // Oliver Avenue front, s from x -25.5 east
    const c = -9 - PX0
    // the stepped parapet: 19.3 out to 5.9 m from the centre, 20.5 to 3.5,
    // then the gable from 2.4 to its apex at 23
    for (const sg of [-1, 1]) {
      const sp = (u: number, v: number): [number, number] => sg < 0 ? [c - v, c - u] : [c + u, c + v]
      wallBlock(stone, a, b, ...sp(3.5, 5.9), -0.7, 0, PH, 19.3)
      wallBlock(stone, a, b, ...sp(2.4, 3.5), -0.7, 0, PH, 20.5)
      for (const u of [3.5, 5.9]) {
        const { P } = onWall(a, b)
        const q = P(c + sg * u, 0, 0.0)
        pinnacle(stone, q[0], q[1] + 0.15, 0.5, PH - 2, u > 5 ? 19.8 : 21.0, u > 5 ? 21.3 : 22.4)
      }
    }
    wallBlock(stone, a, b, c - 2.4, c + 2.4, -0.7, 0, PH, 20.5)
    gablet(stone, slate, a, b, c, 4.8, 20.5, 23.0, 0.7, 0)
    // the great window: three lights under a pointed head, in a pale surround,
    // over the pointed portal
    pointed(tr, a, b, c - 2.5, c + 2.5, 0, 12.1, 0.04)
    pointed(win, a, b, c - 1.6, c + 1.6, 6.8, 11.0, 0.08)
    for (const ds of [-0.53, 0.53]) bar(tr, a, b, [c + ds, 6.8], [c + ds, 12.3], 0.16, 0.12)
    bar(tr, a, b, [c - 1.55, 10.6], [c + 1.55, 10.6], 0.16, 0.12)
    pointed(win, a, b, c - 1.0, c + 1.0, 0, 3.2, 0.08)
    for (const sg of [-1, 1]) {
      // upper floor: a broad flattened pointed window in a pale hood
      flatPointed(tr, a, b, c + sg * 4.7 - 1.5, c + sg * 4.7 + 1.5, 10.2, 12.6, 1.2, 0.04)
      flatPointed(win, a, b, c + sg * 4.7 - 1.25, c + sg * 4.7 + 1.25, 10.4, 12.6, 1.0, 0.07)
      // the top row: one small pointed window each side, one over the centre
      pointed(win, a, b, c + sg * 4.7 - 0.6, c + sg * 4.7 + 0.6, 15.8, 17.0, 0.04)
      // square windows of the floor below and the ground floor
      for (const u of [3.2, 5.5]) panel3(win, a, b, c + sg * u - 0.45, c + sg * u + 0.45, 4.9, 6.7)
      panel3(win, a, b, c + sg * 4.2 - 0.95, c + sg * 4.2 + 0.95, 1.4, 2.7)
    }
    pointed(win, a, b, c - 0.6, c + 0.6, 15.8, 17.0, 0.04)
    // the plainer west part of the front: the same rows, two bays
    for (const s of [c - 8.3, c - 11.6, c - 14.6]) {
      flatPointed(win, a, b, s - 1.1, s + 1.1, 10.4, 12.6, 0.9, 0.04)
      panel3(win, a, b, s - 0.45, s + 0.45, 4.9, 6.7)
      panel3(win, a, b, s - 0.45, s + 0.45, 1.4, 2.7)
    }
  }
  // its west wall faces First Presbyterian's wing (party wall): plain
  // its side windows into the churchyard (north wall west of the transept)
  {
    const [a, b] = faces(PX0, PY0, -11, PY1)[2]
    for (let s = 2; s < 13; s += 3.2) {
      arched(win, a, b, s - 0.6, s + 0.6, 10.6, 13.6, 0.04)
      panel3(win, a, b, s - 0.55, s + 0.55, 5.2, 7.8)
    }
  }
  // ---- the low crenellated wing on Oliver Avenue (x 0..15, y -25..-13)
  walls(stone, rect(PX1, PY0, 15, -13), 0, 8)
  cap(slate, rect(PX1, PY0, 15, -13), 7.6)
  walls(stone, rect(PX1, PY0, 15, -13), 7.6, 8)
  {
    const [a, b] = faces(PX1, PY0, 15, -13)[0]
    crenels(stone, a, b, 8, 1.3, 2.6, 0.8, 0.6)
    for (const s of [3, 7.2, 11.4]) {
      arched(tr, a, b, s - 1.25, s + 1.25, 3.6, 5.4, 0.04)
      arched(win, a, b, s - 1.0, s + 1.0, 3.8, 5.4, 0.07)
    }
    panel3(door, a, b, 13.8, 14.8, 0, 2.3)
  }

  return [
    { part: stone, material: finish('trinity-sandstone', 0xbfafa3) },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('slate', 0x7d8289) },
    { part: tr, material: PALETTE.trim },
    { part: door, material: finish('door-red', 0xa8564a) },
  ]
}

/**
 * A flattened pointed head (a Tudor-like four-centred look) on wall a→b:
 * jambs s0..s1 from z0 to zs, then two arcs meeting at an apex `h` above
 * zs, each centred on the far jamb's line below the springing.
 */
export function flatPointed(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, h: number, out = 0.04, seg = 4) {
  const { P } = onWall(a, b)
  const w = s1 - s0, c = (s0 + s1) / 2
  const e = (0.75 * w * w - h * h) / (2 * h), r = Math.hypot(w, e)
  const t0 = Math.atan2(e, -w), t1 = Math.atan2(h + e, -w / 2) // left arc, centred (s1, zs - e)
  const pts: [number, number][] = [[s0, z0], [s1, z0]]
  for (let i = 0; i <= seg; i++) { const t = Math.PI - t0 + ((t0 - t1) * i) / seg; pts.push([c + (c - (s1 + r * Math.cos(Math.PI - t))), zs - e + r * Math.sin(Math.PI - t)]) }
  for (let i = seg - 1; i >= 0; i--) { const t = t0 + ((t1 - t0) * i) / seg; pts.push([s1 + r * Math.cos(t), zs - e + r * Math.sin(t)]) }
  const ctr = P(c, (z0 + zs) / 2, out)
  for (let i = 0; i < pts.length; i++) {
    const q = pts[i], n = pts[(i + 1) % pts.length]
    p.tri(ctr, P(q[0], q[1], out), P(n[0], n[1], out))
  }
}

/** A flat rectangular panel on wall a→b. */
export function panel3(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.04) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, z1, out), P(s0, z1, out))
}

if (import.meta.main) await save('pit-trinity-cathedral', 'Trinity Episcopal Cathedral', [40.4413057, -79.9986907], 26, build() as any, 6500)
