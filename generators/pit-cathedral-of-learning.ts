/**
 * Cathedral of Learning (University of Pittsburgh, 1926-1937, Charles Z.
 * Klauder), Oakland, Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-cathedral-of-learning.ts
 *
 * This file also exports the Gothic facade helpers (pointed panels,
 * tracery, piers) that pit-heinz-chapel.ts imports; the Cathedral model is
 * only written when this file runs itself.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/30678664, -79.9531918 40.4443096. The walls run at 46.6° /
 * 136.6°, so the catalog bearing is 46.6: model +y points north-east
 * (toward Heinz Chapel and the Cathedral lawn), +x south-east, -y
 * south-west (Forbes Avenue side), -x north-west (Bigelow Boulevard).
 *
 * Identity, in order: the tall square limestone shaft, 26.4 m a side,
 * striped by continuous vertical piers with window strips between them,
 * rising to 125 m; the narrower crown, stepped in on all sides, with a
 * traceried great window on each face, a lower central bay on the NE and SW
 * faces and corner turrets rising above the parapet; the four arms of the
 * cross plan stepping down from the shaft (the 97 m SW block, the 62 m NW
 * and SE wings, the 47 m NE entrance block), each topped by a great pointed
 * window; the 20 m base around them; the pointed NE porch on the lawn and
 * the Forbes Avenue entrance. At night the crown above the shaft is
 * floodlit (gold for occasions, warm white otherwise); it carries
 * `floodlight`, upward faces less, and the windows glow.
 *
 * Evidence:
 *  - plan: OSM outline way/30678664 and its parts way/841117936..946
 *    (tower core, 116.4 m stage parts, NE/SW crown bays, the arms and the
 *    15.5 m base part), turned into this frame; rectilinear simplification
 *    of the base outline within ~1 m.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m and 0.5 m grids, above the lowest ground (276.4 m NAVD88, the SW
 *    and SE sides; the NE lawn and NW side are 3.6 m higher): crown
 *    parapet 150.5-153 with corner turrets to ~153.5; NE/SW crown bays
 *    147; shaft top 125 (corner piers stop lower, 87-116: drawn as two
 *    setbacks, 1.3 m at 100 and 2.6 m at 112); SW block 97.5;
 *    NW/SE wings 62.5; NE entrance block 47.5 (porch ~21); SW lower block
 *    40; base 16-24 (modelled 20.5 main, 17 north bar, 14.5 bar ends, 19
 *    south legs). OSM's tagged heights (163/139.7/116.4/89.3/54.3/34.9/31)
 *    run ~8 m under the lidar for every part below the top, so the lidar
 *    is used throughout.
 *  - published: 535 ft (163 m), 42 storeys (Wikipedia, "Cathedral of
 *    Learning"; CTBUH). The lidar's stone ends near 154 m; the remaining
 *    height is the rooftop mast, drawn as a thin metal pole to 163 m.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Cathedral of Learning, northeast face, 2022-09-14, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning,_northeast_face,_2022-09-14,_01.jpg
 *      Cbaile19, CC0 — the NE face head-on: wings, entrance block, porch,
 *      bay rhythm and crown.
 *    "Cathedral of Learning from across Schenley Plaza, Oakland, Pittsburgh, 2021-11-09, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning_from_across_Schenley_Plaza,_Oakland,_Pittsburgh,_2021-11-09,_01.jpg
 *      Cbaile19, CC0 — the SE wing head-on, the 97 m SW block side-on,
 *      the stage heights.
 *    "Cathedral of Learning from Lytton Avenue, 2023-05-20.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning_from_Lytton_Avenue,_2023-05-20.jpg
 *      Cbaile19, CC0 — the NW face head-on: great windows at each stage.
 *    "Cathedral of Learning from Phipps Conservatory grounds, 2022-08-26, 01b.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning_from_Phipps_Conservatory_grounds,_2022-08-26,_01b.jpg
 *      Cbaile19, CC0 — far view from the east.
 *    "Cathedral of Learning from Forbes Avenue, Oakland, Pittsburgh, 2021-11-09.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning_from_Forbes_Avenue,_Oakland,_Pittsburgh,_2021-11-09.jpg
 *      Cbaile19, CC0 — the SW blocks from below; colour.
 *    "Cathedral of Learning blue sky cloud.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning_blue_sky_cloud.jpg
 *      Tony Webster, CC BY-SA 2.0 — the crown, warm buff stone.
 *    "Cathedral of Learning at night, 2022-11-05, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Cathedral_of_Learning_at_night,_2022-11-05,_01.jpg
 *      Cbaile19, CC0 — the floodlit crown above the shaft.
 *  - colour: Indiana limestone, cleaned 2007, pale grey-buff in the
 *    daylight photos; a grey-buff finish at the palette's lightness.
 *    Windows the palette window; tracery trim; the flat roofs a warm
 *    grey-taupe finish from the USGS NAIP orthophoto (public domain).
 * Estimated: bay widths and counts (from the head-on photos scaled to the
 * lidar widths), window heads and spandrel heights, the porch's size, the
 * base's facades (mostly hidden by trees in every photo), the Forbes
 * entrance (one oblique photo).
 *
 * Left out: the pinnacle clusters along every pier (drawn as one cap per
 * pier), carving, the small slit windows in the corner piers, mullions,
 * the flag pole, the antennas other than the main mast.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Gothic helpers, shared with pit-heinz-chapel.ts.

/**
 * A flat pointed-arch panel on wall a→b: jambs s0..s1 from z0 up to the
 * springing zs, then an equilateral pointed head (radius = width × `k`,
 * apex at the centre). Set `out` from the wall.
 */
export function pointed(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.04, k = 1, seg = 4) {
  const { P } = onWall(a, b)
  const w = s1 - s0, r = w * k, c = (s0 + s1) / 2
  const pts: [number, number][] = [[s0, z0], [s1, z0], [s1, zs]]
  // right arc: centred at (s1 - r, zs), from angle 0 up to the apex
  const t1 = Math.acos((c - (s1 - r)) / r)
  for (let i = 1; i <= seg; i++) { const t = (t1 * i) / seg; pts.push([s1 - r + r * Math.cos(t), zs + r * Math.sin(t)]) }
  for (let i = seg - 1; i >= 0; i--) { const t = Math.PI - (t1 * i) / seg; pts.push([s0 + r + r * Math.cos(t), zs + r * Math.sin(t)]) }
  const ctr = P(c, (z0 + zs) / 2, out)
  for (let i = 0; i < pts.length; i++) {
    const q = pts[i], n = pts[(i + 1) % pts.length]
    p.tri(ctr, P(q[0], q[1], out), P(n[0], n[1], out))
  }
  return zs + Math.sqrt(r * r - (c - (s1 - r)) ** 2) // apex height
}

/** Head height of a pointed arch of width w (radius w × k). */
export const headH = (w: number, k = 1) => Math.sqrt((w * k) ** 2 - (w * k - w / 2) ** 2)

/** A flat bar on wall a→b between two (s, z) points, `wd` wide, `out` proud. */
export function bar(p: Part, a: XY, b: XY, p0: [number, number], p1: [number, number], wd = 0.2, out = 0.08) {
  const { P } = onWall(a, b)
  const ds = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(ds, dz) || 1
  const ns = (-dz / L) * wd / 2, nz = (ds / L) * wd / 2
  // counter-clockwise seen from outside (s runs to the viewer's right)
  p.quad(P(p0[0] + ns, p0[1] + nz, out), P(p0[0] - ns, p0[1] - nz, out), P(p1[0] - ns, p1[1] - nz, out), P(p1[0] + ns, p1[1] + nz, out))
}

/**
 * A traceried great window: `lights` lights divided by mullions up to the
 * springing, a transom there, and a Y fork in the head. Glass in `win`,
 * bars in `tr`. Optional transoms lower down (z values).
 */
export function greatWindow(win: Part, tr: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, lights = 3, transoms: number[] = [], wd = 0.2) {
  const apex = pointed(win, a, b, s0, s1, z0, zs, 0.04)
  const w = s1 - s0, c = (s0 + s1) / 2, h = apex - zs
  for (let i = 1; i < lights; i++) bar(tr, a, b, [s0 + (w * i) / lights, z0], [s0 + (w * i) / lights, zs], wd)
  for (const z of [zs, ...transoms]) bar(tr, a, b, [s0 + 0.05, z], [s1 - 0.05, z], wd)
  // the fork: a stem from the springing, branching to the arch
  const fork = zs + h * 0.35
  bar(tr, a, b, [c, zs], [c, fork], wd)
  bar(tr, a, b, [c, fork], [c - w * 0.27, zs + h * 0.62], wd)
  bar(tr, a, b, [c, fork], [c + w * 0.27, zs + h * 0.62], wd)
  return apex
}

/**
 * A pier on wall a→b: a box centred s, `w` wide, `d` proud, from z0 to z1,
 * capped by a small pyramid `cap` high (0 for a flat top).
 */
export function pier(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, d: number, capH = 0) {
  const { P } = onWall(a, b)
  const l = s - w / 2, r = s + w / 2
  const A = P(l, z0, 0), B = P(r, z0, 0), C = P(r, z0, d), D = P(l, z0, d)
  const A1 = P(l, z1, 0), B1 = P(r, z1, 0), C1 = P(r, z1, d), D1 = P(l, z1, d)
  p.quad(D, C, C1, D1) // front
  p.quad(A, D, D1, A1) // left side
  p.quad(C, B, B1, C1) // right side
  if (capH > 0) {
    const t = P(s, z1 + capH, d / 2)
    p.tri(D1, C1, t); p.tri(A1, D1, t); p.tri(C1, B1, t); p.tri(B1, A1, t)
  } else p.quad(D1, C1, B1, A1)
}

/** Storey groups from z0 to z1 in n panels with `gap` of spandrel between. */
export const groups = (z0: number, z1: number, n: number, gap = 0.9): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + (i * (z1 - z0)) / n + (i ? gap / 2 : 0), z0 + ((i + 1) * (z1 - z0)) / n - gap / 2] as [number, number])

/**
 * A column of window panels on wall a→b from s0 to s1: grouped storeys from
 * z0, the top panel ending in a pointed head whose apex is at `top`.
 * `story` is the panel height target (two to three storeys).
 */
export function lancetColumn(win: Part, a: XY, b: XY, s0: number, s1: number, z0: number, top: number, story = 10.5, gap = 1.0) {
  const w = s1 - s0, hh = headH(w)
  const zs = top - hh
  if (zs - z0 < 2) return
  const n = Math.max(1, Math.round((zs - z0) / story))
  const g = groups(z0, zs, n, gap)
  g.forEach(([lo, hi], i) => {
    if (i === g.length - 1) pointed(win, a, b, s0, s1, lo, hi + gap / 2, 0.04)
    else panel(win, a, b, s0, s1, lo, hi, 0.04)
  })
}

/** Walls split into pieces no longer than `step`, so low faces drape on the terrain. */
export function wallsSplit(p: Part, r: XY[], z0: number, z1: number, step = 5) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step))
    for (let k = 0; k < n; k++) {
      const u0 = k / n, u1 = (k + 1) / n
      const p0: XY = [a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0]
      const p1: XY = [a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1]
      p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
    }
  }
}

/** The four walls of an axis-aligned box as [a, b] pairs, counter-clockwise: S, E, N, W. */
export const faces = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]

// ---------------------------------------------------------------------------
// Cathedral of Learning

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), tr = new Part(), door = new Part(), metal = new Part()

  const TY = 10.25 // the shaft's centre line across y
  const SH = 13.2 // half the shaft
  const SHAFT_TOP = 125, NOTCH_Z = 112, NOTCH = 2.6
  const PD = 0.75 // pier depth
  const box = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = roof, bevel = 0.45) =>
    block(stone, top, rect(x0, y0, x1, y1), z0, z1, bevel)

  // ---- the base (OSM part way/841117946), rectilinear, three roof heights
  const BASE = 20.5
  const body: XY[] = [[-33.5, -28], [-32, -28], [-32, -44.5], [-19, -44.5], [-19, -34.5], [19, -34.5], [19, -44.5], [32, -44.5], [32, -28], [33.5, -28], [33.5, 24], [-33.5, 24]]
  wallsSplit(stone, body, 0, BASE)
  cap(roof, body, BASE)
  // south legs a little lower: a step on top of each leg is not worth it; the
  // north bar: 17 m between the body's lines, 14.5 m at the ends
  const bar17: XY[] = [[-33.5, 24], [33.5, 24], [33.5, 34], [-33.5, 34]]
  wallsSplit(stone, bar17, 0, 17)
  cap(roof, bar17, 17)
  for (const sx of [-1, 1]) {
    const r: XY[] = sx < 0 ? [[-50, 24], [-33.5, 24], [-33.5, 34], [-50, 34]] : [[33.5, 24], [50, 24], [50, 34], [33.5, 34]]
    wallsSplit(stone, r, 0, 14.5)
    cap(roof, r, 14.5)
  }
  // base windows: two rows of grouped pointed panels on the long faces
  const baseBays = (a: XY, b: XY, zLo: number, zTop: number, bayW = 2.2, pitch = 4.6, end = 2.5) => {
    const { L } = onWall(a, b)
    if (L < pitch + 2 * end) return
    const n = Math.floor((L - 2 * end) / pitch), off = (L - n * pitch) / 2
    for (let i = 0; i < n; i++) {
      const s = off + pitch * (i + 0.5)
      panel(win, a, b, s - bayW / 2, s + bayW / 2, zLo, zLo + 4.2, 0.04)
      pointed(win, a, b, s - bayW / 2, s + bayW / 2, zLo + 5.6, zTop - headH(bayW) - 1.6, 0.04)
    }
  }
  // the uphill (NE, NW) sides start 3.6 m higher
  const lo = (a: XY, b: XY) => ((a[1] + b[1]) / 2 > 20 || (a[0] + b[0]) / 2 < -30 ? 5.2 : 1.8)
  for (let i = 0; i < body.length; i++) {
    const a = body[i], b = body[(i + 1) % body.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 8) continue
    if (a[1] === 24 && b[1] === 24) continue // hidden by the north bar
    baseBays(a, b, lo(a, b), BASE)
  }
  baseBays([-33.5, 34], [-50, 34], 5.2, 14.5); baseBays([50, 34], [33.5, 34], 5.2, 14.5)
  baseBays([-50, 34], [-50, 24], 5.2, 14.5); baseBays([50, 24], [50, 34], 5.2, 14.5)
  baseBays([-50, 24], [-33.5, 24], 5.2, 14.5); baseBays([33.5, 24], [50, 24], 5.2, 14.5)
  baseBays([33.5, 34], [8, 34], 5.2, 17); baseBays([-8, 34], [-33.5, 34], 5.2, 17)

  // ---- the arms of the cross
  type Arm = { x0: number; y0: number; x1: number; y1: number; top: number; open: number }
  const arms: Arm[] = [
    { x0: -24.3, y0: 1.8, x1: -SH, y1: 18.7, top: 62.5, open: 3 }, // NW wing
    { x0: SH, y0: 1.8, x1: 24.3, y1: 18.7, top: 62.5, open: 1 }, // SE wing
    { x0: -8.4, y0: TY + SH, x1: 8.4, y1: 34, top: 47.5, open: 0 }, // NE entrance block
    { x0: -8.3, y0: -14.2, x1: 8.3, y1: TY - SH, top: 97.5, open: 2 }, // SW block
    { x0: -8.4, y0: -24.7, x1: 8.4, y1: -14.2, top: 40, open: 2 }, // SW lower block
  ]
  const crownLit = 124
  for (const m of arms) box(m.x0, m.y0, m.x1, m.y1, BASE - 1, m.top)

  /**
   * Bays on a face: a centre great window and narrow lancets, piers between,
   * all from z0 to the top. `layout` is [centre width, pier, narrow, pier, narrow...]
   * out from the centre.
   */
  const facade = (a: XY, b: XY, z0: number, top: number, centreW: number, sides: number[], great = true, gw = 3, pierTop = 1.6, greatLen = 14) => {
    const { L } = onWall(a, b)
    const c = L / 2
    const head = top - 2.2
    if (great) {
      const zs = head - headH(centreW)
      const zGreat = Math.max(z0, zs - greatLen)
      // panels below the great window
      if (zGreat - z0 > 4) lancetColumnFlat(win, a, b, c - centreW / 2, c + centreW / 2, z0, zGreat - 1.0)
      greatWindow(win, tr, a, b, c - centreW / 2, c + centreW / 2, zGreat, zs, gw, zs - zGreat > 9 ? [zGreat + (zs - zGreat) / 2] : [])
    } else if (centreW > 0) lancetColumn(win, a, b, c - centreW / 2, c + centreW / 2, z0, head)
    let s = centreW / 2
    for (let i = 0; i < sides.length; i += 2) {
      const pw = sides[i], nw = sides[i + 1]
      for (const sg of [-1, 1]) pier(stone, a, b, c + sg * (s + pw / 2), pw, z0 - 0.5, top + pierTop, PD, 1.8)
      s += pw
      if (nw === undefined) break
      for (const sg of [-1, 1]) {
        const l = c + sg * s, r = c + sg * (s + nw)
        lancetColumn(win, a, b, Math.min(l, r), Math.max(l, r), z0, head - 1.5)
      }
      s += nw
    }
  }
  /** Grouped flat panels from z0 to z1 (no head). */
  function lancetColumnFlat(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number) {
    const n = Math.max(1, Math.round((z1 - z0) / 10.8))
    for (const [l, h] of groups(z0, z1, n, 1.4)) panel(p, a, b, s0, s1, l, h, 0.04)
  }

  // NW and SE wings: end faces with a great window, side faces with two lancets
  for (const [m, sg] of [[arms[0], -1], [arms[1], 1]] as [Arm, number][]) {
    const [S, E, N, W] = faces(m.x0, m.y0, m.x1, m.y1)
    const end = sg < 0 ? W : E
    facade(end[0], end[1], BASE, m.top, 4.6, [1.3, 1.6, 1.3], true, 3, 1.6, 26)
    for (const f of [S, N]) {
      const { L } = onWall(f[0], f[1])
      for (const u of [0.3, 0.7]) lancetColumn(win, f[0], f[1], u * L - 1.0, u * L + 1.0, BASE, m.top - 3.5)
    }
  }
  // NE entrance block (47.5): great window over the porch, narrow lancets
  {
    const m = arms[2], [, E, N, W] = faces(m.x0, m.y0, m.x1, m.y1)
    facade(N[0], N[1], 22.5, m.top, 4.4, [1.6, 1.4, 1.6], true, 3, 1.6, 18)
    for (const f of [E, W]) lancetColumn(win, f[0], f[1], 3.4, 5.2, 19, m.top - 3.5), lancetColumn(win, f[0], f[1], 6.6, 8.4, 19, m.top - 3.5)
    // the porch: a pointed archway, pinnacled, on the lawn (ground +3.6)
    const G = 3.6
    box(-4.6, 34, 4.6, 36.8, 0, 21, roof, 0.35)
    const pa: XY = [4.6, 36.8], pb: XY = [-4.6, 36.8]
    pointed(door, pa, pb, 2.6, 6.6, G, G + 8.5, 0.05)
    bar(tr, pa, pb, [2.35, G], [2.35, G + 8.5], 0.4, 0.07)
    bar(tr, pa, pb, [6.85, G], [6.85, G + 8.5], 0.4, 0.07)
    pointed(win, pa, pb, 3.2, 6.0, G + 13, G + 15, 0.05)
    for (const s of [0.6, 8.6]) pier(stone, pa, pb, s, 1.2, 0, 23.5, 0.6, 2.5)
  }
  // SW block (97.5) above the lower block, and the lower block (40)
  {
    const m = arms[3], [S, E, , W] = faces(m.x0, m.y0, m.x1, m.y1)
    facade(S[0], S[1], 41, m.top, 4.4, [1.6, 1.4, 1.6])
    for (const f of [E, W]) for (const s of [3.0, 7.0]) lancetColumn(win, f[0], f[1], s - 0.9, s + 0.9, BASE + 1, m.top - 3.5)
    const n = arms[4], [S2, E2, , W2] = faces(n.x0, n.y0, n.x1, n.y1)
    facade(S2[0], S2[1], BASE + 0.5, n.top, 4.8, [1.4, 1.4, 1.6])
    for (const f of [E2, W2]) lancetColumn(win, f[0], f[1], 3.6, 7.0, BASE + 1, n.top - 3.5)
    // the Forbes Avenue entrance in the base below it
    const fa: XY = [-6, -34.5], fb: XY = [6, -34.5]
    box(-6, -36.5, 6, -34.5, 0, 12, roof, 0.3)
    const qa: XY = [-6, -36.5], qb: XY = [6, -36.5]
    pointed(door, qa, qb, 3.9, 8.1, 0, 5.5, 0.05)
    pointed(win, qa, qb, 4.2, 7.8, 7.0, 8.6, 0.05)
    for (const s of [0.6, 11.4]) pier(stone, qa, qb, s, 1.2, 0, 13.5, 0.5, 2.2)
    void fa; void fb
  }

  // ---- the shaft: 26.4 m square to 112, corner-notched to 125
  const sx0 = -SH, sx1 = SH, sy0 = TY - SH, sy1 = TY + SH
  const STEP_Z = 100, STEP = 1.3
  walls(stone, rect(sx0, sy0, sx1, sy1), BASE - 1, STEP_Z)
  const ringN = (n: number): XY[] => [
    [sx0 + n, sy0], [sx1 - n, sy0], [sx1 - n, sy0 + n], [sx1, sy0 + n], [sx1, sy1 - n], [sx1 - n, sy1 - n],
    [sx1 - n, sy1], [sx0 + n, sy1], [sx0 + n, sy1 - n], [sx0, sy1 - n], [sx0, sy0 + n], [sx0 + n, sy0 + n],
  ]
  walls(stone, ringN(STEP), STEP_Z, NOTCH_Z)
  for (const [x, y] of [[sx0, sy0], [sx1, sy0], [sx1, sy1], [sx0, sy1]] as XY[]) {
    const dx = x < 0 ? 1 : -1, dy = y < TY ? 1 : -1
    const ring = rect(Math.min(x, x + dx * STEP), Math.min(y, y + dy * STEP), Math.max(x, x + dx * STEP), Math.max(y, y + dy * STEP))
    cap(roof, ring, STEP_Z)
  }
  // the inner step: a ring of the 1.3 m notch's corner squares between 2.6 and 1.3
  const notched: XY[] = [
    [sx0 + NOTCH, sy0], [sx1 - NOTCH, sy0], [sx1 - NOTCH, sy0 + NOTCH], [sx1, sy0 + NOTCH], [sx1, sy1 - NOTCH], [sx1 - NOTCH, sy1 - NOTCH],
    [sx1 - NOTCH, sy1], [sx0 + NOTCH, sy1], [sx0 + NOTCH, sy1 - NOTCH], [sx0, sy1 - NOTCH], [sx0, sy0 + NOTCH], [sx0 + NOTCH, sy0 + NOTCH],
  ]
  for (const [x, y] of [[sx0, sy0], [sx1, sy0], [sx1, sy1], [sx0, sy1]] as XY[]) {
    // the corner piers' second step: the L between the two notches, roofed,
    // with a pinnacle on its inner square
    const dx = x < 0 ? 1 : -1, dy = y < TY ? 1 : -1
    const sq = (u0: number, v0: number, u1: number, v1: number) => {
      const xa = x + dx * u0, xb = x + dx * u1, ya = y + dy * v0, yb = y + dy * v1
      return rect(Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb))
    }
    cap(roof, sq(STEP, 0, NOTCH, STEP), NOTCH_Z)
    cap(roof, sq(0, STEP, NOTCH, NOTCH), NOTCH_Z)
    const ring = sq(STEP, STEP, NOTCH, NOTCH)
    const cx = x + dx * (STEP + NOTCH) / 2, cy = y + dy * (STEP + NOTCH) / 2
    const t: V3 = [cx, cy, NOTCH_Z + 3.0]
    for (let i = 0; i < 4; i++) { const p0 = ring[i], p1 = ring[(i + 1) % 4]; stone.tri([p0[0], p0[1], NOTCH_Z], [p1[0], p1[1], NOTCH_Z], t) }
  }
  block(stone, roof, notched, NOTCH_Z, SHAFT_TOP, 0.45)

  // shaft facades, from the centre out: three centre lights under a 6 m
  // great window, then narrow bays between piers, the outer bay running down
  // past the arms to the base, and the 2.6 m corner pier
  const shaftFaces = faces(sx0, sy0, sx1, sy1)
  const armTop = [97.5, 62.5, 47.5, 62.5] // S(SW), E(SE), N(NE), W(NW)
  shaftFaces.forEach(([a, b], fi) => {
    const c = SH, at = armTop[fi]
    const gTop = SHAFT_TOP - 2.6, gs = gTop - headH(5.8), g0 = gs - 10
    greatWindow(win, tr, a, b, c - 2.9, c + 2.9, g0, gs, 3, [g0 + 5])
    // one broad recessed strip per bay, grouped three storeys to a panel
    lancetColumnFlat(win, a, b, c - 1.8, c + 1.8, at + 1.5, g0 - 1.4)
    const bays: [number, number, number, number][] = [ // s0, s1 from centre, z0, top
      [3.0, 4.9, at + 1.5, SHAFT_TOP - 5], [6.1, 8.0, at + 1.5, SHAFT_TOP - 6],
      [9.2, 10.4, BASE + 1, 99],
    ]
    for (const [l, r, z0, top] of bays) for (const sg of [-1, 1]) {
      const s0 = c + sg * l, s1 = c + sg * r
      lancetColumn(win, a, b, Math.min(s0, s1), Math.max(s0, s1), z0, top, 10.8, 1.4)
    }
    // bold piers, rising through the arms' tops to pinnacle caps at the
    // shaft top; the two by the centre stop under the great window
    for (const [s, w, z0, z1] of [[2.4, 1.2, at - 1, g0 - 1.2], [5.5, 1.2, at - 1, SHAFT_TOP + 3], [8.6, 1.2, BASE, SHAFT_TOP + 3]] as [number, number, number, number][])
      for (const sg of [-1, 1]) pier(stone, a, b, c + sg * s, w, z0, z1, PD, 2.6)
  })

  // ---- the crown: core 17.3 × 17.2 to 150.5, NE/SW bays to 147, corner turrets
  const cx0 = -8.6, cx1 = 8.7, cy0 = 1.5, cy1 = 18.7, CROWN = 150.5, BAY = 147, TUR = 154
  walls(stone, rect(cx0, cy0, cx1, cy1), SHAFT_TOP - 0.5, CROWN - 0.5)
  walls(stone, rect(cx0, cy0, cx1, cy1), CROWN - 0.5, CROWN, rect(cx0 + 0.4, cy0 + 0.4, cx1 - 0.4, cy1 - 0.4))
  cap(roof, rect(cx0 + 0.4, cy0 + 0.4, cx1 - 0.4, cy1 - 0.4), CROWN - 1.2)
  walls(stone, rect(cx0 + 0.4, cy0 + 0.4, cx1 - 0.4, cy1 - 0.4).reverse(), CROWN - 1.2, CROWN)
  for (const [y0, y1] of [[sy0, cy0], [cy1, sy1]]) box(-4.4, y0, 4.4, y1, SHAFT_TOP - 0.5, BAY)
  // turrets at the core's corners
  const T = 3.0
  for (const [x, y] of [[cx0, cy0], [cx1, cy0], [cx1, cy1], [cx0, cy1]] as XY[]) {
    const r = rect(x - T / 2, y - T / 2, x + T / 2, y + T / 2)
    const r0 = rect(x - 2.0, y - 2.0, x + 2.0, y + 2.0)
    walls(stone, r0, SHAFT_TOP - 0.5, 136)
    walls(stone, r0, 136, 137.2, r)
    walls(stone, r, 137.2, TUR)
    const t: V3 = [x, y, TUR + 3.0]
    for (let i = 0; i < 4; i++) { const p0 = r[i], p1 = r[(i + 1) % 4]; stone.tri([p0[0], p0[1], TUR], [p1[0], p1[1], TUR], t) }
  }
  // great windows: on the bays (NE, SW) and on the core's NW and SE faces
  for (const [y0, y1, front] of [[sy0, cy0, 0], [cy1, sy1, 2]] as [number, number, number][]) {
    const [a, b] = faces(-4.4, y0, 4.4, y1)[front]
    const zs = BAY - 2.6 - headH(4.6)
    greatWindow(win, tr, a, b, 2.1, 6.7, SHAFT_TOP + 1.5, zs, 3, [SHAFT_TOP + 1.5 + (zs - SHAFT_TOP - 1.5) / 2])
    // the band of small arches on the core above the bay
    const [ca, cb] = faces(cx0, cy0, cx1, cy1)[front]
    for (const s of [6.65, 8.65, 10.65]) pointed(win, ca, cb, s - 0.7, s + 0.7, BAY + 0.6, CROWN - 2.2, 0.04)
  }
  for (const fi of [1, 3]) {
    const [a, b] = faces(cx0, cy0, cx1, cy1)[fi]
    const { L } = onWall(a, b), c = L / 2
    const gTop = 141.5, zs = gTop - headH(6.0)
    greatWindow(win, tr, a, b, c - 3.0, c + 3.0, SHAFT_TOP + 1.5, zs, 3, [SHAFT_TOP + 1.5 + (zs - SHAFT_TOP - 1.5) / 2])
    for (const s of [-1.5, 0, 1.5]) pointed(win, a, b, c + s - 0.55, c + s + 0.55, 145.6, CROWN - 2.6, 0.04)
    for (const sg of [-1, 1]) {
      lancetColumn(win, a, b, c + sg * 4.9 - 0.55, c + sg * 4.9 + 0.55, SHAFT_TOP + 1.5, 144)
      pier(stone, a, b, c + sg * 3.55, 0.9, SHAFT_TOP, CROWN + 0.8, 0.55, 1.6)
    }
  }
  // a lancet on each side face of the NE and SW bays
  for (const [y0, y1] of [[sy0, cy0], [cy1, sy1]]) {
    const [, E, , W] = faces(-4.4, y0, 4.4, y1)
    for (const f of [E, W]) { const { L } = onWall(f[0], f[1]); lancetColumn(win, f[0], f[1], L / 2 - 0.7, L / 2 + 0.7, SHAFT_TOP + 1.5, BAY - 3) }
  }
  // piers flanking the bays
  for (const fi of [0, 2]) {
    const [a, b] = faces(-4.4, fi === 0 ? sy0 : cy1, 4.4, fi === 0 ? cy0 : sy1)[fi]
    for (const s of [0.5, 8.3]) pier(stone, a, b, s, 1.0, SHAFT_TOP, BAY + 1.2, 0.55, 1.6)
  }

  // ---- the mast, to the published 163 m
  const ring = (r: number, z: number): V3[] => Array.from({ length: 6 }, (_, i) => [r * Math.cos(i * Math.PI / 3), TY + r * Math.sin(i * Math.PI / 3), z] as V3)
  metal.loft([ring(0.45, CROWN - 1.2), ring(0.25, 163)])
  metal.cap(ring(0.25, 163), true)

  const lit = (p: V3, n: V3) => (p[2] < crownLit ? 0 : (n[2] > 0.7 ? 0.4 : 0.95) * Math.min(1, (p[2] - crownLit) / 4))
  return [
    { part: stone, material: { ...finish('limestone', 0xddd5c3), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('roof', 0xa69d93) },
    { part: tr, material: { ...PALETTE.trim, floodlight: lit } },
    { part: door, material: PALETTE.entrance },
    { part: metal, material: PALETTE.metal },
  ]
}

if (import.meta.main) await save('pit-cathedral-of-learning', 'Cathedral of Learning', [40.4443096, -79.9531918], 46.6, build() as any, 6500)
