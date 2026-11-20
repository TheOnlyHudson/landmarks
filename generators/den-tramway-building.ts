/**
 * Denver Tramway Company Building (the Tramway power house, 1901; REI's Denver flagship since
 * 2000), 1416 Platte Street — procedural, CC0-1.0, no textures.
 * bun generators/den-tramway-building.ts
 *
 * What makes it this building: a long red-brick power hall under twin grey standing-seam
 * gabled roofs, its river (south-east) end a broad flat-topped brick gable divided by
 * pilasters into three bays, each bay crowned by a wide segmental arch with an oculus under
 * it and tall round-arched windows below a string course; the long sides in pilaster bays
 * with a tall round-arched window low and a smaller round-arched window high in each bay; a
 * taller flat-roofed brick block at the north-west end with a lower wing on its north-east
 * side; the brick stump of the old chimney on that block's roof.
 *
 * Frame: x along the hall (towards 134.4°, the river end), y across (towards 44.4°, Platte
 * Street side), z up, metres; origin near the centre of OSM way/35468307. z = 0 is
 * 1579.4 m NAVD88, the lowest map terrain (Mapterhorn) under the footprint, by the north-east
 * wall; the ground round the walls is 1.5–4.4 m above that, read from the same terrain
 * (`GROUND`), and the windows and doors start from it.
 *
 * Sources:
 * - OSM (API map call, 2026-11-19): outline way/35468307 (building=retail, height 15.5,
 *   roof hipped [the roofs are gabled and flat]); parts way/588482145 (north-west block,
 *   saltbox, 15.5), 714962164 and 714962166 (the two gabled halls, 15.5, roof 1.5),
 *   714962163 (north-east wing, 8), 714962165 (south-west wing, 6).
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 1 m grid. Measured (NAVD88): hall eaves
 *   1595.0, ridges 1599.6 at y ≈ 7 and −8.7, valley 1596.1; the river gable's flat top
 *   1600.0 between y −6 and 4.5 and 1595.7 at its corners; the north-west block's roof
 *   1599.0–1600.7, its gable parapet 1600.0–1601.0; north-east wing 1592.0; south-west wing
 *   1594.5; the chimney stump, about 5 m square, 1603.6. No tall chimney stands in the 2020
 *   survey or in any licensed photo, so none is drawn.
 * - USGS NAIP: the two halls' grey gabled roofs, the north-west block's white flat roof.
 * - Photos (EVIDENCE):
 *   - Jeffrey Beall, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Denver_Tramway_Powerhouse.JPG
 *     (the river gable and south-west side, from across the river)
 *   - Pdubs.94, CC0: https://commons.wikimedia.org/wiki/File:Confluence_Park_Denver_20230708.jpg
 *     (the river gable and north-east side from Confluence Park)
 *   - Albert Yau, CC BY 2.0: https://commons.wikimedia.org/wiki/File:REI_flagship_store,_Denver,_CO.jpg (interior)
 *   - Richard Masoner, CC BY-SA 2.0: https://www.flickr.com/photos/99247795@N00/9309761067
 *     (the river gable's corner and oculus close up)
 *
 * Measured / published / estimated:
 * - measured: every height above, the plan (OSM, NAIP).
 * - estimated from photos: bay widths (three on the gable, about 7.3 m on the sides), window
 *   sizes and heads, the string course and arch heights, colours.
 * - estimated, no photo: the north-west block's and wings' facades, drawn with the halls'
 *   window rhythm; the north-west end wall.
 *
 * Doubts: the north-west end and the wings aren't in any licensed photo. The brief mentions a
 * tall smokestack; the 2020 lidar shows only a 5 m stump about 3 m above the roof, drawn as
 * such. Lettering ("RECREATIONAL EQUIPMENT, INC") is left off.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face, groundAt, type GroundGrid } from './bridge-kit'
import { finish, PALETTE } from './palette'

const B = 1579.4
const A = (h: number) => h - B // an absolute height (NAVD88) in model z

/** Mapterhorn above z = 0, rows along y from −37.5 every 7.5 m, columns x −75..75. */
const GROUND: GroundGrid = { y0: -37.5, x0: -75, step: 7.5, z: [
  [3.9, 3.8, 4.0, 4.0, 3.9, 3.8, 3.9, 3.9, 3.7, 3.3, 3.3, 2.9, 2.7, 3.1, 3.0, 2.9, 2.8, 2.6, 2.3, 1.8, 1.3],
  [3.8, 3.8, 3.9, 3.7, 3.8, 3.9, 4.1, 3.9, 3.7, 3.5, 3.6, 3.2, 3.3, 3.4, 3.4, 3.3, 2.9, 2.5, 2.5, 2.0, 1.5],
  [3.7, 3.7, 3.7, 3.6, 3.8, 4.0, 4.4, 4.2, 3.8, 3.4, 3.2, 3.2, 3.5, 3.5, 3.5, 3.3, 3.1, 2.8, 2.5, 2.2, 1.5],
  [3.6, 3.6, 3.7, 3.7, 3.8, 4.0, 4.2, 4.0, 3.5, 3.2, 3.1, 3.3, 3.5, 3.5, 3.5, 3.4, 3.2, 2.8, 2.4, 2.0, 1.5],
  [3.6, 3.5, 3.6, 3.6, 3.7, 3.8, 3.8, 3.5, 3.0, 2.5, 2.4, 2.7, 3.0, 3.2, 3.2, 3.1, 2.9, 2.6, 2.2, 1.9, 1.5],
  [3.5, 3.3, 3.4, 3.5, 3.5, 3.5, 3.4, 3.1, 2.5, 1.8, 1.7, 2.0, 2.5, 2.8, 2.9, 2.8, 2.6, 2.4, 2.1, 1.8, 1.5],
  [3.4, 3.2, 3.3, 3.4, 3.4, 3.3, 3.2, 2.8, 2.0, 1.1, 0.9, 1.3, 2.0, 2.5, 2.6, 2.6, 2.4, 2.2, 2.0, 1.7, 1.6],
  [3.4, 3.1, 3.3, 3.3, 3.2, 3.1, 3.0, 2.8, 1.4, 0.0, 0.0, 0.3, 1.9, 2.1, 2.3, 2.4, 2.0, 2.0, 1.8, 1.7, 1.6],
  [3.3, 3.0, 3.3, 3.5, 3.2, 2.9, 2.8, 2.6, 2.4, 2.2, 1.9, 1.7, 1.6, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.7, 1.6],
  [3.2, 3.0, 3.1, 3.2, 3.0, 2.6, 2.5, 2.4, 2.2, 2.0, 1.8, 1.6, 1.4, 1.8, 1.7, 1.7, 1.7, 1.8, 1.7, 1.7, 1.7],
  [3.1, 2.8, 3.0, 2.9, 2.8, 2.6, 2.4, 2.3, 2.0, 1.9, 1.7, 1.6, 1.5, 1.7, 1.7, 1.7, 1.4, 1.1, 1.2, 1.7, 1.7],
] }
const ground = (x: number, y: number) => groundAt(GROUND, x, y)

// Plan (OSM parts, in the frame)
const HX0 = -19.2, HX1 = 67.7, Y0 = -16.6, Y1 = 15.1, YC = -0.75 // the halls
const WX0 = -62.5                                                  // the north-west block
const EAVE = A(1595.0), RIDGE = A(1599.6), VALLEY = A(1596.1)
const GT = A(1600.0), GC = A(1595.7)                               // river gable top and corners

type P2 = [number, number]

/** A wall plane: origin o (at u = 0), unit tangent t along the wall, outward normal n (horizontal). */
type Wall = { o: P2; t: P2; n: P2 }
const at = (w: Wall, u: number, z: number, off = 0): V3 => [w.o[0] + w.t[0] * u + w.n[0] * off, w.o[1] + w.t[1] * u + w.n[1] * off, z]
const N3 = (w: Wall): V3 => [w.n[0], w.n[1], 0]

/** A flat shape on a wall from (u, z) points (convex, in order), set `off` proud. */
function shape(p: Part, w: Wall, pts: P2[], off: number) {
  const P = pts.map(([u, z]) => at(w, u, z, off))
  for (let i = 1; i < P.length - 1; i++) face(p, P[0], P[i], P[i + 1], P[i + 1], N3(w))
}
/** A round-headed opening: width wd, sill z0, springing at z0 + h - wd/2. */
function arched(p: Part, w: Wall, u: number, z0: number, wd: number, h: number, off = 0.06, seg = 8) {
  const r = wd / 2, zs = z0 + h - r
  const pts: P2[] = [[u - r, z0], [u + r, z0]]
  for (let k = 0; k <= seg; k++) { const a = (Math.PI * k) / seg; pts.push([u + r * Math.cos(a), zs + r * Math.sin(a)]) }
  shape(p, w, pts, off)
}
function disc(p: Part, w: Wall, u: number, z: number, r: number, off = 0.06, seg = 14) {
  const pts: P2[] = []
  for (let k = 0; k < seg; k++) { const a = (2 * Math.PI * k) / seg; pts.push([u + r * Math.cos(a), z + r * Math.sin(a)]) }
  shape(p, w, pts, off)
}
/** A projecting strip (pilaster or string course) on a wall: u0..u1 × z0..z1, `d` proud; front and sides. */
function strip(p: Part, w: Wall, u0: number, u1: number, z0: number, z1: number, d: number, top = true) {
  face(p, at(w, u0, z0, d), at(w, u1, z0, d), at(w, u1, z1, d), at(w, u0, z1, d), N3(w))
  const tv: V3 = [w.t[0], w.t[1], 0], tn: V3 = [-w.t[0], -w.t[1], 0]
  face(p, at(w, u1, z0, 0), at(w, u1, z0, d), at(w, u1, z1, d), at(w, u1, z1, 0), tv)
  face(p, at(w, u0, z0, 0), at(w, u0, z0, d), at(w, u0, z1, d), at(w, u0, z1, 0), tn)
  if (top) face(p, at(w, u0, z1, 0), at(w, u1, z1, 0), at(w, u1, z1, d), at(w, u0, z1, d), [0, 0, 1])
}
/** A segmental arch band on a wall, from u0 to u1 springing at zs, rising `rise`, `wd` wide, `d` proud. */
function archBand(p: Part, w: Wall, u0: number, u1: number, zs: number, rise: number, wd: number, d: number, seg = 10) {
  const c = (u0 + u1) / 2, half = (u1 - u0) / 2, R = (half * half + rise * rise) / (2 * rise), zc = zs + rise - R
  const a0 = Math.asin(half / R)
  const pt = (k: number, r: number): P2 => { const a = -a0 + (2 * a0 * k) / seg; return [c + r * Math.sin(a), zc + r * Math.cos(a)] }
  for (let k = 0; k < seg; k++) {
    const A1 = pt(k, R), B1 = pt(k + 1, R), A2 = pt(k, R + wd), B2 = pt(k + 1, R + wd)
    face(p, at(w, A1[0], A1[1], d), at(w, B1[0], B1[1], d), at(w, B2[0], B2[1], d), at(w, A2[0], A2[1], d), N3(w))
    face(p, at(w, A2[0], A2[1], 0), at(w, B2[0], B2[1], 0), at(w, B2[0], B2[1], d), at(w, A2[0], A2[1], d), [0, 0, 1])
  }
}

/** A vertical wall quad from the plan segment a→b, z 0 up to top(t), split ≤ 6 m, facing n. */
function slab(p: Part, a: P2, b: P2, top: (s: number) => number, n: P2) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(len / 6))
  for (let i = 0; i < k; i++) {
    const s0 = i / k, s1 = (i + 1) / k
    const A0: P2 = [a[0] + (b[0] - a[0]) * s0, a[1] + (b[1] - a[1]) * s0], B0: P2 = [a[0] + (b[0] - a[0]) * s1, a[1] + (b[1] - a[1]) * s1]
    face(p, [A0[0], A0[1], 0], [B0[0], B0[1], 0], [B0[0], B0[1], top(s1)], [A0[0], A0[1], top(s0)], [n[0], n[1], 0])
  }
}

/** The bays of a long side: pilasters, string course, a tall arched window low and a smaller one high. */
function bays(brick: Part, shade: Part, win: Part, trim: Part, w: Wall, len: number, n: number, zTop: number, gnd: (u: number) => number, hi = true) {
  const bw = len / n
  for (let i = 0; i <= n; i++) strip(brick, w, i * bw - 0.45, i * bw + 0.45, 0, zTop - 0.3, 0.35)
  for (let i = 0; i < n; i++) shape(shade, w, [[i * bw + 0.45, 0], [(i + 1) * bw - 0.45, 0], [(i + 1) * bw - 0.45, zTop - 1.1], [i * bw + 0.45, zTop - 1.1]], 0.02)
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) * bw, g = gnd(u)
    arched(win, w, u, g + 1.2, 2.4, 6.2)
    if (hi) arched(win, w, u, g + 9.2, 2.0, 2.8)
    strip(trim, w, u - 1.4, u + 1.4, g + 0.95, g + 1.2, 0.12)
  }
  // string course between the two rows of windows
  const g0 = Math.max(gnd(0), gnd(len))
  strip(brick, w, 0, len, g0 + 8.2, g0 + 8.7, 0.25)
}

export function build() {
  const brick = new Part(), shade = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ---- The halls: walls, twin gabled roofs
  slab(brick, [HX0, Y0], [HX1, Y0], () => EAVE, [0, -1])
  slab(brick, [HX1, Y1], [HX0, Y1], () => EAVE, [0, 1])
  const ov = 0.4
  const hallRoof = (ya: number, yr: number, yb: number, za: number, zb: number) => {
    face(roof, [HX0, ya, za], [HX1 + 0.1, ya, za], [HX1 + 0.1, yr, RIDGE], [HX0, yr, RIDGE], [0, (yr - ya) > 0 ? -(RIDGE - za) : RIDGE - za, Math.abs(yr - ya)])
    face(roof, [HX0, yr, RIDGE], [HX1 + 0.1, yr, RIDGE], [HX1 + 0.1, yb, zb], [HX0, yb, zb], [0, (yb - yr) > 0 ? RIDGE - zb : -(RIDGE - zb), Math.abs(yb - yr)])
  }
  hallRoof(Y0 - ov, -8.7, -0.9, EAVE - 0.2, VALLEY)
  hallRoof(-0.9, 7.0, Y1 + ov, VALLEY, EAVE - 0.2)

  // ---- The river gable (x = HX1), facing +x: three bays
  const gw: Wall = { o: [HX1, Y0], t: [0, 1], n: [1, 0] }
  const W = Y1 - Y0
  const gtop: P2[] = [[0, GC], [W * 0.335, GT], [W * 0.665, GT], [W, GC]]
  shape(brick, gw, [[0, 0], [W, 0], [W, GC], [W * 0.665, GT], [W * 0.335, GT], [0, GC]], 0)
  // coping along the gable top
  for (let i = 0; i < 3; i++) {
    const [a, b] = [gtop[i], gtop[i + 1]]
    face(brick, at(gw, a[0], a[1], -0.3), at(gw, b[0], b[1], -0.3), at(gw, b[0], b[1] + 0.35, 0.25), at(gw, a[0], a[1] + 0.35, 0.25), [0.5, 0, 1])
    face(brick, at(gw, a[0], a[1] - 0.2, 0.25), at(gw, b[0], b[1] - 0.2, 0.25), at(gw, b[0], b[1] + 0.35, 0.25), at(gw, a[0], a[1] + 0.35, 0.25), [1, 0, 0])
  }
  const gg = (u: number) => ground(HX1, Y0 + u)
  const bw = W / 3, zStr = 1.6 + 8.6
  for (const u of [0, bw, 2 * bw, W]) {
    const zt = u === 0 || u === W ? GC - 0.4 : GC + (GT - GC) * 0.55
    strip(brick, gw, u - 0.6, u + 0.6, 0, zt, 0.45)
  }
  for (let i = 0; i < 3; i++) {
    const u0 = i * bw + 0.6, u1 = (i + 1) * bw - 0.6, uc = (u0 + u1) / 2
    const zs = zStr + 1.4, rise = i === 1 ? 4.6 : 3.4
    archBand(brick, gw, u0, u1, zs, rise, 0.9, 0.35)
    // the recessed bay field under its arch, in the shaded brick
    {
      const c = uc, half = (u1 - u0) / 2, R = (half * half + rise * rise) / (2 * rise), zc = zs + rise - R, a0 = Math.asin(half / R)
      const pts: P2[] = [[u0, 0], [u1, 0]]
      for (let k = 0; k <= 10; k++) { const a = a0 - (2 * a0 * k) / 10; pts.push([c + R * Math.sin(a), zc + R * Math.cos(a)]) }
      shape(shade, gw, pts, 0.02)
    }
    disc(win, gw, uc, zs + rise - 2.3, i === 1 ? 1.35 : 1.15)
    disc(brick, gw, uc, zs + rise - 2.3, i === 1 ? 1.7 : 1.5, 0.04)
    const g = gg(uc)
    for (const du of [-2.6, 0, 2.6]) {
      if (i === 1 && du === 0) {
        arched(door, gw, uc, g, 2.2, 4.2)
        arched(win, gw, uc, g + 4.6, 2.2, 3.4)
      } else arched(win, gw, uc + du, g + 1.2, 1.9, 6.6)
    }
  }

  // ---- Long sides of the halls (12 bays)
  const sw: Wall = { o: [HX1, Y0], t: [-1, 0], n: [0, -1] }
  const ne: Wall = { o: [HX0, Y1], t: [1, 0], n: [0, 1] }
  const hl = HX1 - HX0
  bays(brick, shade, win, trim, sw, hl, 12, EAVE, (u) => ground(HX1 - u, Y0))
  bays(brick, shade, win, trim, ne, hl, 12, EAVE, (u) => ground(HX0 + u, Y1))
  // eave cornice
  strip(brick, sw, -0.3, hl + 0.3, EAVE - 0.6, EAVE, 0.5)
  strip(brick, ne, -0.3, hl + 0.3, EAVE - 0.6, EAVE, 0.5)

  // ---- The north-west block: flat (barely pitched) roof, parapet
  const bTop = (y: number) => (y < -2 ? A(1600.0) + ((A(1600.7) - A(1600.0)) * (y + 16.6)) / 14.6 : A(1600.7) + ((A(1599.0) - A(1600.7)) * (y + 2)) / 16.9)
  const PAR = A(1601.0)
  slab(brick, [WX0, Y0], [HX0, Y0], () => PAR, [0, -1])
  slab(brick, [WX0, 14.9], [WX0, Y0], () => PAR, [-1, 0])
  slab(brick, [HX0, 14.9], [WX0, 14.9], () => PAR, [0, 1])
  slab(brick, [HX0, Y0], [HX0, 14.9], () => PAR, [1, 0])
  face(trim, [WX0 + 0.5, Y0 + 0.5, bTop(Y0)], [HX0 - 0.5, Y0 + 0.5, bTop(Y0)], [HX0 - 0.5, -2, bTop(-2)], [WX0 + 0.5, -2, bTop(-2)], [0, -0.05, 1])
  face(trim, [WX0 + 0.5, -2, bTop(-2)], [HX0 - 0.5, -2, bTop(-2)], [HX0 - 0.5, 14.4, bTop(14.4)], [WX0 + 0.5, 14.4, bTop(14.4)], [0, 0.1, 1])
  const inner: P2[] = [[WX0 + 0.5, Y0 + 0.5], [HX0 - 0.5, Y0 + 0.5], [HX0 - 0.5, 14.4], [WX0 + 0.5, 14.4]]
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4]
    const nIn: P2 = [-(b[1] - a[1]), b[0] - a[0]], l = Math.hypot(...nIn)
    face(brick, [a[0], a[1], bTop(a[1]) - 0.1], [b[0], b[1], bTop(b[1]) - 0.1], [b[0], b[1], PAR], [a[0], a[1], PAR], [nIn[0] / l, nIn[1] / l, 0])
  }
  const outer: P2[] = [[WX0, Y0], [HX0, Y0], [HX0, 14.9], [WX0, 14.9]]
  for (let i = 0; i < 4; i++) {
    const a = outer[i], b = outer[(i + 1) % 4], c = inner[(i + 1) % 4], d = inner[i]
    face(trim, [a[0], a[1], PAR], [b[0], b[1], PAR], [c[0], c[1], PAR], [d[0], d[1], PAR], [0, 0, 1])
  }
  const bl = HX0 - WX0
  bays(brick, shade, win, trim, { o: [HX0, Y0], t: [-1, 0], n: [0, -1] }, bl, 6, PAR, (u) => ground(HX0 - u, Y0))
  bays(brick, shade, win, trim, { o: [WX0, Y0], t: [0, 1], n: [-1, 0] }, 31.5, 4, PAR, (u) => ground(WX0, Y0 + u))
  // the chimney stump
  const cs = (x0: number, x1: number, y0: number, y1: number, z1: number) => {
    slab(brick, [x0, y0], [x1, y0], () => z1, [0, -1]); slab(brick, [x1, y0], [x1, y1], () => z1, [1, 0])
    slab(brick, [x1, y1], [x0, y1], () => z1, [0, 1]); slab(brick, [x0, y1], [x0, y0], () => z1, [-1, 0])
    face(trim, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  }
  cs(-30.5, -25.5, -6, -1, A(1603.6))

  // ---- Wings: north-east (8 m class, lidar 1592.0) and south-west (1594.5)
  const wing = (x0: number, x1: number, y0: number, y1: number, z1: number, out: 'ne' | 'sw') => {
    slab(brick, [x0, y0], [x1, y0], () => z1, [0, -1]); slab(brick, [x1, y0], [x1, y1], () => z1, [1, 0])
    slab(brick, [x1, y1], [x0, y1], () => z1, [0, 1]); slab(brick, [x0, y1], [x0, y0], () => z1, [-1, 0])
    face(trim, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
    const w: Wall = out === 'ne' ? { o: [x0, y1], t: [1, 0], n: [0, 1] } : { o: [x1, y0], t: [-1, 0], n: [0, -1] }
    const len = x1 - x0, n = Math.max(1, Math.round(len / 7.2))
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) * (len / n), g = ground(out === 'ne' ? x0 + u : x1 - u, out === 'ne' ? y1 : y0)
      arched(win, w, u, g + 1.2, 2.2, Math.min(5.5, z1 - g - 2.2))
    }
  }
  wing(WX0, HX0, 14.9, 22.8, A(1592.0), 'ne')
  wing(17.9, 30.2, -28.3, Y0, A(1594.5), 'sw')

  return { brick, shade, trim, roof, win, door }
}

if (import.meta.main) {
  const m = build()
  const parts = [
    { part: m.brick, material: finish('red-brick', 0xbf6e55) },
    { part: m.shade, material: finish('red-brick-shade', 0xa85f4a) },
    { part: m.trim, material: PALETTE.trim },
    { part: m.roof, material: { ...PALETTE.roof, color: 0x9aa2a8 } },
    { part: m.win, material: PALETTE.window },
    { part: m.door, material: finish('entrance', 0x8a6a4e) },
  ]
  const glb = writeGlb('Denver Tramway Company Building', parts)
  await Bun.write(new URL('../models/den-tramway-building.glb', import.meta.url), glb)
  console.log(`den-tramway-building.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
