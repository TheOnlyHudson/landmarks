/**
 * Heinz Memorial Chapel (University of Pittsburgh, 1933-1938, Charles Z.
 * Klauder), Oakland, Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-heinz-chapel.ts
 *
 * Imports the Gothic helpers (pointed panels, tracery, piers) from
 * pit-cathedral-of-learning.ts, which must be merged first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/30678681, -79.9518656 40.4452667. Its walls run at 46.6°, the
 * same grid as the Cathedral of Learning, so the catalog bearing is 46.6:
 * model -y (south-west) is the entrance front facing the Cathedral, +y the
 * apse, the transepts point north-west (-x) and south-east (+x).
 *
 * Identity, in order: the slender dark openwork flèche over the crossing;
 * the steep dark slate roofs, the transept's ridge standing above the
 * nave's; the tall transept gables with two traceried lancets under a rose;
 * very tall two-light lancets between pinnacled buttresses along the nave
 * and round the half-octagon apse; the entrance front with its pointed
 * portal (red doors), the traceried window over it and the small hipped
 * corner blocks; pale limestone. At night the walls are floodlit from
 * the lawn (HeinzChapelfromAboveatNight.jpg, Lindsey Bieda, CC BY-SA 2.0,
 * https://commons.wikimedia.org/wiki/File:HeinzChapelfromAboveatNight.jpg):
 * `floodlight` on the stone, strongest low down; slate roofs stay dark.
 *
 * Evidence:
 *  - plan: OSM outline way/30678681, turned into this frame: nave 16.4 m
 *    wide (x -7.1..9.3), entrance front at y -21.5, apse to y 21.5, the low
 *    north-west annex (x -15.3..-7.1, y 3.3..11).
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, above the ground around the chapel (279.0 m NAVD88; the
 *    site is level to 0.5 m): nave eaves 22, ridge 30; transept (y
 *    -6.5..5.5, flush with the nave walls) eaves 30, ridge 37.8; front
 *    block roof ~27; corner blocks and annex 8.5-10; the flèche 64.9 at
 *    the highest return, centred over the crossing, ~2 m across at 50 m.
 *  - published: "about 77 m" for the spire (brief; often quoted as 253 ft).
 *    The lidar's highest return is 65 m and the photos lose the needle in
 *    foliage, so the model's tip is at 67 m (lidar plus a thin finial,
 *    estimated). 77 m was not confirmed by any source used here (the
 *    lidar and the photos both support ~67 m); a doubt.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Heinz Chapel, Oakland, Pittsburgh, 2019-09-10 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Heinz_Chapel,_Oakland,_Pittsburgh,_2019-09-10_02.jpg
 *      Cbaile19, CC0 — the entrance front head-on.
 *    "Heinz Chapel, Oakland, Pittsburgh, 2019-09-30, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Heinz_Chapel,_Oakland,_Pittsburgh,_2019-09-30,_01.jpg
 *      Cbaile19, CC0 — the south-east transept gable and the apse side.
 *    "Heinz Chapel, Oakland, Pittsburgh, 2021-11-09, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Heinz_Chapel,_Oakland,_Pittsburgh,_2021-11-09,_01.jpg
 *      Cbaile19, CC0 — far view: transept, flèche, roofs, colour.
 *    "HeinzChapelFront.jpg"
 *      https://commons.wikimedia.org/wiki/File:HeinzChapelFront.jpg
 *      Christopher Lancaster, CC BY-SA 2.0 — the front.
 *    "HeinzChapelBlueSky.jpg"
 *      https://commons.wikimedia.org/wiki/File:HeinzChapelBlueSky.jpg
 *      Extra Zebra, CC BY 2.0 — transept gable and flèche from below.
 *    "Heinz Chapel, U. Pittsburgh - IMG 1257.JPG"
 *      https://commons.wikimedia.org/wiki/File:Heinz_Chapel,_U._Pittsburgh_-_IMG_1257.JPG
 *      Daderot, public domain — the north-west side from the lawn.
 *  - colour: pale warm limestone; dark grey slate pulled to the palette's
 *    lightness; the flèche dark lead-grey (kept dark: it is the defining
 *    dark spire against pale stone); red-painted doors.
 * Estimated: window and portal sizes and the bay count (from the photos
 * scaled to the lidar heights), the rose's size, buttress and pinnacle
 * heights, the north-west side's windows (one oblique photo).
 *
 * Left out: the balustrades along the eaves, the gablets over the windows,
 * crockets, the openwork of the flèche (drawn solid, with its pinnacles),
 * the low link building north of the apse (outside the OSM outline).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { bar, faces, greatWindow, headH, pier, pointed } from './pit-cathedral-of-learning'

/** A planar polygon, fanned, wound to face `out`. */
function poly(p: Part, pts: V3[], out: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

function build() {
  const stone = new Part(), win = new Part(), slate = new Part(), lead = new Part(), tr = new Part(), door = new Part()

  const X0 = -7.1, X1 = 9.3, XC = (X0 + X1) / 2, HW = (X1 - X0) / 2
  const NAVE_E = 22, NAVE_R = 30, TR_E = 30, TR_R = 37.8
  const NY0 = -18, AY = 13 // nave west end, apse centre
  const TY0 = -6.5, TY1 = 5.5, TC = (TY0 + TY1) / 2

  // ---- nave walls (y NY0..AY) and the half-octagon apse beyond AY
  const apse: XY[] = [0, 1, 2, 3, 4].map((k) => {
    const t = -Math.PI / 2 + (k * Math.PI) / 4 // from east, round the north, to west
    return [XC + HW * Math.cos(-t + Math.PI), AY + HW * Math.sin(-t + Math.PI)] as XY
  })
  // apse points run from (X1, AY) round to (X0, AY)
  const apsePts: XY[] = Array.from({ length: 5 }, (_, k) => {
    const t = (k * Math.PI) / 4
    return [XC + HW * Math.cos(t), AY + HW * Math.sin(t)] as XY
  })
  void apse
  const body: XY[] = [[X0, NY0], [X1, NY0], ...apsePts]
  walls(stone, body, 0, NAVE_E)

  // nave roof: gable along y with a steep hip at the west end, cone-like facets over the apse
  const ridge0: V3 = [XC, NY0 + 3, NAVE_R], ridge1: V3 = [XC, AY, NAVE_R]
  poly(slate, [[X0, NY0, NAVE_E], [X0, AY, NAVE_E], ridge1, ridge0], [-1, 0, 1]) // west slope
  poly(slate, [[X1, NY0, NAVE_E], [X1, AY, NAVE_E], ridge1, ridge0], [1, 0, 1]) // east slope
  poly(slate, [[X0, NY0, NAVE_E], [X1, NY0, NAVE_E], ridge0], [0, -1, 1]) // hip
  for (let k = 0; k < 4; k++) {
    const a = apsePts[k], b = apsePts[k + 1]
    poly(slate, [[a[0], a[1], NAVE_E], [b[0], b[1], NAVE_E], ridge1], [(a[0] + b[0]) / 2 - XC, (a[1] + b[1]) / 2 - AY, 3])
  }

  // ---- transept: walls flush with the nave, rising to 30, gables to 37.8
  walls(stone, rect(X0, TY0, X1, TY1), NAVE_E - 1, TR_E)
  const tA: V3 = [X0 - 0.01, TC, TR_R], tB: V3 = [X1 + 0.01, TC, TR_R]
  poly(stone, [[X0, TY0, TR_E], [X0, TY1, TR_E], [X0, TC, TR_R]], [-1, 0, 0])
  poly(stone, [[X1, TY0, TR_E], [X1, TY1, TR_E], [X1, TC, TR_R]], [1, 0, 0])
  poly(slate, [[X0, TY0, TR_E], [X1, TY0, TR_E], tB, tA], [0, -1, 1])
  poly(slate, [[X0, TY1, TR_E], [X1, TY1, TR_E], tB, tA], [0, 1, 1])
  // gable faces: two traceried lancets under a rose, pinnacles at the corners
  for (const [a, b] of [faces(X0, TY0, X1, TY1)[1], faces(X0, TY0, X1, TY1)[3]]) {
    const { L } = onWall(a, b), c = L / 2
    for (const sg of [-1, 1]) greatWindow(win, tr, a, b, c + sg * 1.85 - 1.25, c + sg * 1.85 + 1.25, 5, 20.5 - 0.0, 2, [12.5])
    const { P } = onWall(a, b)
    const ctr = P(c, 26.2, 0.04)
    for (let i = 0; i < 14; i++) {
      const t0 = (i / 14) * 2 * Math.PI, t1 = ((i + 1) / 14) * 2 * Math.PI
      win.tri(ctr, P(c + 1.7 * Math.cos(t0), 26.2 + 1.7 * Math.sin(t0), 0.04), P(c + 1.7 * Math.cos(t1), 26.2 + 1.7 * Math.sin(t1), 0.04))
    }
    // the moulded pointed arch framing the lancets and the rose
    {
      const w = 7.6, zs = 21.0, r = w, t1 = Math.acos(0.5), pts: [number, number][] = []
      for (let i = 0; i <= 5; i++) { const t = (t1 * i) / 5; pts.push([c - w / 2 + r * Math.cos(t), zs + r * Math.sin(t)]) }
      for (let i = 4; i >= 0; i--) { const t = Math.PI - (t1 * i) / 5; pts.push([c + w / 2 + r * Math.cos(t), zs + r * Math.sin(t)]) }
      for (let i = 0; i < pts.length - 1; i++) bar(tr, a, b, pts[i], pts[i + 1], 0.4, 0.09)
      for (const sg of [-1, 1]) bar(tr, a, b, [c + sg * w / 2, 4.6], [c + sg * w / 2, zs], 0.4, 0.09)
    }
    for (const s of [0.55, L - 0.55]) pier(stone, a, b, s, 1.1, 0, 33.5, 0.7, 3.2)
  }

  // ---- nave and apse windows: tall two-light lancets between buttresses
  const sideBays = [-14.6, -10.2, 8.2, 11.2]
  for (const [a, b] of [faces(X0, NY0, X1, AY)[1], faces(X0, NY0, X1, AY)[3]]) {
    const { L } = onWall(a, b), east = a[0] > XC
    for (const y of sideBays) {
      const s = east ? y - NY0 : AY - y
      greatWindow(win, tr, a, b, s - 1.25, s + 1.25, 5.5, 19 - headH(2.5) + 1.4, 2, [12])
    }
    for (const y of [NY0 + 0.5, -12.4, -8, TY0 + 0.2, TY1 - 0.2, 6.7, 9.7, AY - 0.5]) {
      if (y > TY0 && y < TY1) continue
      const s = east ? y - NY0 : AY - y
      pier(stone, a, b, s, 1.0, 0, NAVE_E + 4.5, 1.1, 2.6)
    }
    void L
  }
  for (let k = 0; k < 4; k++) {
    const a = apsePts[k], b = apsePts[k + 1], { L } = onWall(a, b)
    greatWindow(win, tr, a, b, L / 2 - 1.2, L / 2 + 1.2, 5.5, 18.4, 2, [12])
  }
  for (let k = 1; k < 4; k++) {
    // buttresses at the apse's angles, pointing out radially
    const q = apsePts[k], ang = Math.atan2(q[1] - AY, q[0] - XC)
    const d: XY = [Math.cos(ang), Math.sin(ang)], t: XY = [-d[1], d[0]]
    const a: XY = [q[0] - t[0] * 0.5, q[1] - t[1] * 0.5], b: XY = [q[0] + t[0] * 0.5, q[1] + t[1] * 0.5]
    // a tiny face perpendicular to the radius, so `pier` builds outward
    pier(stone, a, b, 0.5, 1.0, 0, NAVE_E + 4.5, 1.1, 2.6)
  }

  // ---- entrance front: frontispiece with hipped roof, corner blocks
  const FY0 = -21.5, FX0 = XC - 4.5, FX1 = XC + 4.5
  walls(stone, rect(FX0, FY0, FX1, NY0 + 0.2), 0, 20)
  cap(stone, rect(FX0, FY0, FX1, NY0 + 0.2), 20)
  const fr: V3 = [XC, FY0 + 2.6, 27]
  poly(slate, [[FX0, FY0, 20], [FX1, FY0, 20], fr], [0, -1, 1])
  poly(slate, [[FX1, FY0, 20], [FX1, NY0 + 0.2, 20], fr], [1, 0, 1])
  poly(slate, [[FX0, NY0 + 0.2, 20], [FX0, FY0, 20], fr], [-1, 0, 1])
  poly(slate, [[FX1, NY0 + 0.2, 20], [FX0, NY0 + 0.2, 20], fr], [0, 1, 1])
  {
    const [a, b] = faces(FX0, FY0, FX1, NY0)[0]
    const c = 4.5
    // the portal: red doors in a deep pointed arch with a pale surround
    pointed(stone, a, b, c - 2.7, c + 2.7, 0, 7.2, 0.06)
    pointed(door, a, b, c - 2.0, c + 2.0, 1.2, 7.0, 0.1)
    bar(tr, a, b, [c, 1.2], [c, 6.0], 0.25, 0.14)
    // the traceried window above
    greatWindow(win, tr, a, b, c - 1.7, c + 1.7, 12.0, 18.2, 2, [15.1])
    for (const s of [0.45, 8.55]) pier(stone, a, b, s, 0.9, 0, 23.5, 0.7, 2.6)
  }
  for (const [x0, x1] of [[X0, FX0], [FX1, X1]]) {
    walls(stone, rect(x0, FY0 + 0.6, x1, NY0 + 0.2), 0, 8.5)
    const t: V3 = [(x0 + x1) / 2, (FY0 + 0.6 + NY0) / 2, 10.8]
    const r = rect(x0, FY0 + 0.6, x1, NY0 + 0.2)
    for (let i = 0; i < 4; i++) { const p0 = r[i], p1 = r[(i + 1) % 4]; poly(slate, [[p0[0], p0[1], 8.5], [p1[0], p1[1], 8.5], t], [(p0[0] + p1[0]) / 2 - t[0], (p0[1] + p1[1]) / 2 - t[1], 1]) }
    const [a, b] = faces(x0, FY0 + 0.6, x1, NY0)[0]
    const { L } = onWall(a, b)
    pointed(win, a, b, L / 2 - 0.4, L / 2 + 0.4, 3.5, 6.2, 0.04)
  }
  // the big pinnacled buttresses at the nave's front corners
  for (const x of [X0, X1]) {
    const r = rect(x - 0.8, NY0 - 0.8, x + 0.8, NY0 + 0.8)
    walls(stone, r, 0, 27)
    const t: V3 = [x, NY0, 31]
    for (let i = 0; i < 4; i++) { const p0 = r[i], p1 = r[(i + 1) % 4]; stone.tri([p0[0], p0[1], 27], [p1[0], p1[1], 27], t) }
  }

  // ---- the north-west annex, low with a hipped roof
  {
    const r = rect(-15.3, 3.3, X0, 11)
    walls(stone, r, 0, 7.5)
    const r0: V3 = [-12.9, 7.15, 10], r1: V3 = [-9.5, 7.15, 10]
    poly(slate, [[-15.3, 3.3, 7.5], [X0, 3.3, 7.5], r1, r0], [0, -1, 1])
    poly(slate, [[-15.3, 11, 7.5], [X0, 11, 7.5], r1, r0], [0, 1, 1])
    poly(slate, [[-15.3, 3.3, 7.5], [-15.3, 11, 7.5], r0], [-1, 0, 1])
    const [a, b] = faces(-15.3, 3.3, X0, 11)[3]
    for (const s of [2.3, 5.4]) pointed(win, a, b, s - 0.7, s + 0.7, 2.0, 5.2, 0.04)
  }

  // ---- the flèche: octagonal belfry stage, pinnacles, needle
  const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [XC + r * Math.cos((i + 0.5) * Math.PI / 4), TC + r * Math.sin((i + 0.5) * Math.PI / 4), z] as V3)
  lead.loft([oct(2.6, TR_R - 3), oct(2.6, 40), oct(2.1, 41), oct(2.1, 50.5), oct(1.5, 51.5), oct(0.08, 67)])
  for (let i = 0; i < 8; i += 2) {
    // corner pinnacles round the belfry and at its top
    const a = ((i + 0.5) * Math.PI) / 4
    for (const [r, z0, z1] of [[2.6, 40, 45], [2.1, 50.5, 54.5]] as [number, number, number][]) {
      const cx = XC + r * Math.cos(a), cy = TC + r * Math.sin(a)
      const ring = rect(cx - 0.3, cy - 0.3, cx + 0.3, cy + 0.3)
      walls(lead, ring, z0, z0 + 1)
      for (let k = 0; k < 4; k++) { const p0 = ring[k], p1 = ring[(k + 1) % 4]; lead.tri([p0[0], p0[1], z0 + 1], [p1[0], p1[1], z0 + 1], [cx, cy, z1]) }
    }
  }
  // belfry openings, dark lancets on the eight faces (flush, unlit)
  {
    const r = oct(2.11, 0)
    for (let i = 0; i < 8; i++) {
      const a: XY = [r[i][0], r[i][1]], b: XY = [r[(i + 1) % 8][0], r[(i + 1) % 8][1]]
      const { L } = onWall(a, b)
      pointed(slate, a, b, L / 2 - 0.4, L / 2 + 0.4, 42.5, 48, 0.03)
    }
  }

  // night: lamps on the lawn wash the walls from below; roofs stay dark
  const walls_lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : Math.max(0.25, 1 - p[2] / 45))
  return [
    { part: stone, material: { ...finish('chapel-limestone', 0xe6ddcb), floodlight: walls_lit } },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('slate', 0x7d8289) },
    { part: lead, material: { ...finish('lead', 0x5b6068), floodlight: (p: V3) => (p[2] < 52 ? 0.35 : 0) } },
    { part: tr, material: { ...PALETTE.trim, floodlight: walls_lit } },
    { part: door, material: finish('entrance', 0xa8564a) },
  ]
}

if (import.meta.main) await save('pit-heinz-chapel', 'Heinz Memorial Chapel', [40.4452667, -79.9518656], 46.6, build() as any, 5000)
