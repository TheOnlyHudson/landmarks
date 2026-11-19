/**
 * Allegheny County Courthouse (H. H. Richardson, 1884-1888), Grant Street,
 * downtown Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-allegheny-county-courthouse.ts
 *
 * This file also exports the Richardsonian helpers (round-arched panels,
 * conical turrets, pyramids, hipped gables, dormers) that
 * pit-old-allegheny-county-jail.ts imports; the courthouse model is only
 * written when this file runs itself, so merge this one first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/203445067 (outer of multipolygon relation/2730675),
 * -79.9964116 40.4387981. The walls run on the downtown grid at 26.3° /
 * 116.3°, so the catalog bearing is 26.3: model -x is the Grant Street
 * front (west-north-west), +x Ross Street and the Bridge of Sighs, +y Fifth
 * Avenue, -y Forbes Avenue. The Bridge of Sighs belongs to the jail model.
 *
 * Identity, in order: the tall square granite tower on the Grant Street
 * front with its belfry, corner turrets and steep stone pyramid; the
 * hollow square of four ranges under steep red tile hipped roofs round
 * the courtyard; the four corner pavilions with very steep pyramid roofs
 * and big wall dormers; the three round-arched entrances under the tower;
 * the paired round turrets and central gable on Fifth and Forbes with the
 * great carriage arch; the two square stair towers on the courtyard's east
 * side; rows of round-arched windows over a rusticated base; brown granite.
 *
 * Evidence:
 *  - plan: OSM way/203445067 and the courtyard way/203445078, turned into
 *    this frame (outer x -45..45.4, y -31.3..31.3; courtyard x -16.5..19.9,
 *    y -11.1..9.9); the tower part way/452605805 (x -45..-32, y -6..7);
 *    the round turret bumps on Fifth and Forbes at x -10.5 and 11.7.
 *    HABS PA-610 (Library of Congress, 1963, public domain), sheet 1 plot
 *    plan with roof plan, sheets 10 and 13 elevations of Grant Street and
 *    Fifth Avenue: window rows, pavilions, turrets, gable, dormers, tower
 *    stages (the drawings set the proportions; heights come from lidar).
 *    https://commons.wikimedia.org/wiki/Category:Allegheny_County_Courthouse
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, above Grant Street at the west face (~235.5 m NAVD88; the
 *    ground rises ~2 m to the east): main eaves 27; range ridges 41-42 a
 *    third of the way in from the street side, inner roofs ~30; corner
 *    pavilion apexes 45.5; tower shaft 84 at the pyramid's foot, pyramid
 *    apex 97.6 (the OSM part says 76.2, which matches no return; lidar
 *    used); the two round turrets flanking the tower 55; courtyard stair
 *    towers 51 (pyramids to 56.5); Fifth/Forbes turret cones ~35, central
 *    gable ~38.
 *  - published: completed 1888, H. H. Richardson (Wikipedia, "Allegheny
 *    County Courthouse"; National Register / NHL with the jail).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Allegheny County Courthouse, 2025-05-24-1.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_County_Courthouse,_2025-05-24-1.jpg
 *      Cbaile19, CC0 — from the south-west across Grant/Forbes: tower,
 *      Forbes front, red roofs, pavilion dormers, colour.
 *    "Allegheny County Courthouse in 2016.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_County_Courthouse_in_2016.jpg
 *      Dllu, CC BY-SA 4.0 — from the north-west: Fifth front and tower.
 *    "Allegheny County Courthouse, 2025-09-27.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_County_Courthouse,_2025-09-27.jpg
 *      Cbaile19, CC0 — from Ross Street / Fifth, the east end.
 *    "Courtyard, Allegheny County Courthouse, Grant Street, Pittsburgh, PA.jpg"
 *      https://commons.wikimedia.org/wiki/File:Courtyard,_Allegheny_County_Courthouse,_Grant_Street,_Pittsburgh,_PA.jpg
 *      w_lemay, CC BY-SA 2.0 — the courtyard and its two east towers.
 *    "Allegheny County Courthouse skyway over Ross St in Pittsburgh.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_County_Courthouse_skyway_over_Ross_St_in_Pittsburgh.jpg
 *      Dllu, CC BY-SA 4.0 — the Ross Street front and the bridge.
 *    "Downtown Pittsburgh from Duquesne University, 2023-05-04, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Downtown_Pittsburgh_from_Duquesne_University,_2023-05-04,_01.jpg
 *      Cbaile19, CC0 — far view from the south-east: roofs and tower.
 *  - colour: brown-pink granite (soot-darkened in places) pulled to the
 *    palette's lightness; red-orange tile roofs (restored), pulled lighter
 *    and less saturated; the tower pyramid is stone.
 * Estimated: window sizes and the number of bays (from the HABS elevations
 * scaled to the lidar eaves), dormer and chimney sizes, the courtyard
 * fronts (one photo), the Ross Street front (oblique photos only).
 * Invented: nothing beyond simplification.
 *
 * Left out: the courtyard fountain and paving (the map's), carving,
 * balconies, the small dormers along the ranges, chimney pots, the
 * east-side half-turrets on Ross Street (drawn plain).
 *
 * Night: the tower and fronts are floodlit; granite carries `floodlight`
 * (tower strongest), windows glow, the entrance arches are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Richardsonian kit (shared with pit-old-allegheny-county-jail.ts)

/** A planar polygon, fanned, wound to face `out`. */
export function poly(p: Part, pts: V3[], out: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Walls of a ring split into pieces no longer than `step` m, so low faces drape. */
export function wallsSplit(p: Part, r: XY[], z0: number, z1: number, step = 5) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 0; k < n; k++) {
      const u0 = k / n, u1 = (k + 1) / n
      const p0: XY = [a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0], p1: XY = [a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1]
      p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
    }
  }
}

/** Offset an axis-aligned rectangle [x0,y0,x1,y1] outward by d. */
export const grow = (r: [number, number, number, number], d: number): XY[] => rect(r[0] - d, r[1] - d, r[2] + d, r[3] + d)

/** A projecting band (string course, cornice, plinth) round a ring, bevelled underneath. */
export function band(p: Part, r: XY[], out: XY[], z0: number, z1: number, bev = 0.35) {
  walls(p, r, z0, z0 + bev, out)
  walls(p, out, z0 + bev, z1)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([out[i][0], out[i][1], z1], [out[j][0], out[j][1], z1], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
  }
}

/**
 * A flat round-arched panel on wall a→b: jambs s0..s1 from z0 to the
 * springing zs, then a true semicircle (radius half the width). Returns the
 * crown height.
 */
export function arch(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  const pts: [number, number][] = [[s0, z0], [s1, z0]]
  for (let i = 0; i <= seg; i++) { const t = (Math.PI * i) / seg; pts.push([c + r * Math.cos(t), zs + r * Math.sin(t)]) }
  const ctr = P(c, (z0 + zs) / 2, out)
  for (let i = 0; i < pts.length; i++) {
    const q = pts[i], n = pts[(i + 1) % pts.length]
    p.tri(ctr, P(q[0], q[1], out), P(n[0], n[1], out))
  }
  return zs + r
}

/** A heavy voussoir ring round a round arch: a flat semicircular band `w` wide. */
export function voussoirs(p: Part, a: XY, b: XY, s0: number, s1: number, zs: number, w: number, out = 0.08, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
    p.quad(P(c + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(c + (r + w) * Math.cos(t0), zs + (r + w) * Math.sin(t0), out),
      P(c + (r + w) * Math.cos(t1), zs + (r + w) * Math.sin(t1), out), P(c + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** A row of `n` round-arched panels between s0 and s1, `gap` apart. */
export function arcade(p: Part, a: XY, b: XY, s0: number, s1: number, n: number, gap: number, z0: number, zs: number, seg = 6) {
  const w = (s1 - s0 - (n - 1) * gap) / n
  for (let i = 0; i < n; i++) arch(p, a, b, s0 + i * (w + gap), s0 + i * (w + gap) + w, z0, zs, 0.05, seg)
}

/** A round turret: drum from z0 to z1 radius r, a small eave, a cone to `tip`. */
export function turret(wall: Part, roof: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number, seg = 12, eave = 0.3) {
  lathe(wall, cx, cy, [[r, z0], [r, z1]], seg)
  lathe(roof, cx, cy, [[r + eave, z1 - 0.2], [r + eave, z1], [0, tip]], seg)
  const ring: XY[] = Array.from({ length: seg }, (_, i) => [cx + (r + eave) * Math.cos((i / seg) * 2 * Math.PI), cy + (r + eave) * Math.sin((i / seg) * 2 * Math.PI)] as XY)
  cap(roof, ring, z1 - 0.2, false)
}

/** A pyramid over a rectangle from eave z0 to apex height `tip` (with an optional overhang). */
export function pyramid(p: Part, r: [number, number, number, number], z0: number, tip: number, over = 0.4) {
  const g = grow(r, over), c: V3 = [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2, tip]
  for (let i = 0; i < 4; i++) {
    const a = g[i], b = g[(i + 1) % 4]
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], c], [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 1])
  }
  cap(p, g, z0, false)
}

/**
 * A hipped roof over a rectangle: eaves at z0 (with overhang), a ridge at
 * z1 along the longer side, hips at both ends set in by `hip` (half the
 * short side for 45° hips in plan).
 */
export function hipRoof(p: Part, r: [number, number, number, number], z0: number, z1: number, over = 0.4, hipK = 1) {
  const g = grow(r, over), [x0, y0] = g[0], [x1, y1] = g[2]
  const alongX = x1 - x0 >= y1 - y0, h = (alongX ? y1 - y0 : x1 - x0) / 2 * hipK
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = alongX ? [x0 + h, cy, z1] : [cx, y0 + h, z1], B: V3 = alongX ? [x1 - h, cy, z1] : [cx, y1 - h, z1]
  const e = (q: XY): V3 => [q[0], q[1], z0]
  const [s0, s1, s2, s3] = g
  if (alongX) {
    poly(p, [e(s0), e(s1), B, A], [0, -1, 1]); poly(p, [e(s2), e(s3), A, B], [0, 1, 1])
    poly(p, [e(s1), e(s2), B], [1, 0, 1]); poly(p, [e(s3), e(s0), A], [-1, 0, 1])
  } else {
    poly(p, [e(s1), e(s2), B, A], [1, 0, 1]); poly(p, [e(s3), e(s0), A, B], [-1, 0, 1])
    poly(p, [e(s0), e(s1), A], [0, -1, 1]); poly(p, [e(s2), e(s3), B], [0, 1, 1])
  }
  cap(p, g, z0, false)
}

/**
 * A gabled wall dormer rising from the eave of wall a→b: its face flush
 * with the wall, `w` wide centred on s, side walls running `d` back into
 * the roof, cheeks to z1, gable apex at z2; an arched window in the face.
 */
export function dormer(wall: Part, roof: Part, win: Part | null, a: XY, b: XY, s: number, w: number, z0: number, z1: number, z2: number, d = 3.5) {
  const { P } = onWall(a, b)
  const l = s - w / 2, rr = s + w / 2
  const f0 = P(l, z0), f1 = P(rr, z0), f2 = P(rr, z1), f3 = P(l, z1), fa = P(s, z2)
  const b0 = P(l, z0, -d), b1 = P(rr, z0, -d), b2 = P(rr, z1, -d), b3 = P(l, z1, -d), ba = P(s, z2, -d)
  const { n } = onWall(a, b), out: V3 = [n[0], n[1], 0]
  poly(wall, [f0, f1, f2, fa, f3], out)
  const { u } = onWall(a, b)
  poly(wall, [f1, b1, b2, f2], [u[0], u[1], 0])
  poly(wall, [b0, f0, f3, b3], [-u[0], -u[1], 0])
  // the little gable roof, overhanging the face by 0.3
  const o = 0.3, F3 = P(l - o, z1 - o * (z2 - z1) / (w / 2), o), F2 = P(rr + o, z1 - o * (z2 - z1) / (w / 2), o), Fa = P(s, z2 + 0.05, o)
  poly(roof, [F3, Fa, ba, b3], [-u[0], -u[1], 1])
  poly(roof, [Fa, F2, b2, ba], [u[0], u[1], 1])
  if (win) arch(win, a, b, s - w * 0.28, s + w * 0.28, z0 + 0.9, z1 + 0.2 - w * 0.28, 0.05, 6)
}

/** The four walls of a box [x0,y0,x1,y1] as [a, b] pairs facing out: S, E, N, W. */
export const boxFaces = (r: [number, number, number, number]): [XY, XY][] => [
  [[r[0], r[1]], [r[2], r[1]]], [[r[2], r[1]], [r[2], r[3]]], [[r[2], r[3]], [r[0], r[3]]], [[r[0], r[3]], [r[0], r[1]]],
]

// ---------------------------------------------------------------------------
// The courthouse

function build() {
  const granite = new Part(), win = new Part(), tile = new Part(), door = new Part(), dark = new Part()

  // plan (model frame, from OSM)
  const X0 = -45, X1 = 45.4, Y0 = -31.3, Y1 = 31.3
  const CX0 = -16.5, CX1 = 19.9, CY0 = -11.1, CY1 = 9.9 // courtyard
  const EAVE = 27, RIDGE = 41.5, INNER = 29.5
  const outer = rect(X0, Y0, X1, Y1)

  // ---- the four ranges: outer walls, courtyard walls, plinth and cornice
  wallsSplit(granite, outer, 0, EAVE)
  wallsSplit(granite, rect(CX0, CY0, CX1, CY1).reverse(), 0, INNER)
  band(granite, outer, grow([X0, Y0, X1, Y1], 0.35), 0, 2.4, 0.01)
  band(granite, outer, grow([X0, Y0, X1, Y1], 0.25), 11.9, 12.5)
  band(granite, outer, grow([X0, Y0, X1, Y1], 0.5), EAVE - 1.1, EAVE)

  // ---- roofs: outer slope from the eave to a ridge ring, inner slope down
  // to a low ring, then nearly flat to the courtyard eave (lidar)
  {
    const o = 0.5
    const eaveR: V3[] = grow([X0, Y0, X1, Y1], o).map(([x, y]) => [x, y, EAVE] as V3)
    const ridgeR: V3[] = rect(-36.5, -24, 37.5, 24).map(([x, y]) => [x, y, RIDGE] as V3)
    const lowR: V3[] = rect(-28, -17.5, 30.5, 16.5).map(([x, y]) => [x, y, 31] as V3)
    const innR: V3[] = rect(CX0 - 0.3, CY0 - 0.3, CX1 + 0.3, CY1 + 0.3).map(([x, y]) => [x, y, INNER] as V3)
    const norms: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, nn = norms[i]
      poly(tile, [eaveR[i], eaveR[j], ridgeR[j], ridgeR[i]], [nn[0], nn[1], 1])
      poly(tile, [ridgeR[i], ridgeR[j], lowR[j], lowR[i]], [-nn[0], -nn[1], 1])
      poly(tile, [lowR[i], lowR[j], innR[j], innR[i]], [-nn[0] * 0.2, -nn[1] * 0.2, 1])
    }
    // soffit under the outer overhang
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      granite.quad([eaveR[j][0], eaveR[j][1], EAVE], [eaveR[i][0], eaveR[i][1], EAVE], [outer[i][0], outer[i][1], EAVE], [outer[j][0], outer[j][1], EAVE])
    }
  }

  // ---- corner pavilions: very steep pyramids with wall dormers
  const PV = 16
  const pavs: [number, number, number, number][] = [
    [X0, Y1 - PV, X0 + PV, Y1], [X0, Y0, X0 + PV, Y0 + PV], [X1 - PV, Y1 - PV, X1, Y1], [X1 - PV, Y0, X1, Y0 + PV],
  ]
  for (const r of pavs) {
    walls(granite, grow(r, 0.5), EAVE - 1.1, EAVE) // cornice continues round
    pyramid(tile, r, EAVE, 46, 0.5)
  }
  // dormers on each pavilion's two street faces
  const faceS: [XY, XY] = [[X0, Y0], [X1, Y0]], faceE: [XY, XY] = [[X1, Y0], [X1, Y1]]
  const faceN: [XY, XY] = [[X1, Y1], [X0, Y1]], faceW: [XY, XY] = [[X0, Y1], [X0, Y0]]
  const L_x = X1 - X0, L_y = Y1 - Y0
  for (const s of [PV / 2, L_x - PV / 2]) for (const f of [faceS, faceN]) dormer(granite, tile, win, f[0], f[1], s, 5.2, EAVE - 0.5, 34.5, 38.5, 3.2)
  for (const s of [PV / 2, L_y - PV / 2]) for (const f of [faceE, faceW]) dormer(granite, tile, win, f[0], f[1], s, 5.2, EAVE - 0.5, 34.5, 38.5, 3.2)

  // ---- Fifth and Forbes: central gable between two round turrets, carriage arch
  const GX = 0.6, GW = 15.5
  for (const side of [1, -1]) {
    const yW = side > 0 ? Y1 : Y0
    // gable: a cross roof from the wall back to the ridge
    const g0 = GX - GW / 2, g1 = GX + GW / 2, gz = 38, yb = side > 0 ? 18 : -18, yo = yW + side * 0.5
    poly(granite, [[g0, yW, EAVE], [g1, yW, EAVE], [GX, yW, gz - 0.6]], [0, side, 0])
    poly(tile, [[g0 - 0.4, yo, EAVE - 0.3], [GX, yo, gz], [GX, yb, gz], [g0 - 0.4, yb, EAVE - 0.3]], [-1, 0, 1])
    poly(tile, [[GX, yo, gz], [g1 + 0.4, yo, EAVE - 0.3], [g1 + 0.4, yb, EAVE - 0.3], [GX, yb, gz]], [1, 0, 1])
    const fa: XY = side > 0 ? [X1, Y1] : [X0, Y0], fb: XY = side > 0 ? [X0, Y1] : [X1, Y0]
    const sOf = (x: number) => side > 0 ? X1 - x : x - X0
    // gable window and the arcade under it
    arch(win, fa, fb, sOf(GX) - 1.3, sOf(GX) + 1.3, 28.5, 32.2, 0.05, 6)
    // round turrets either side, half in the wall
    for (const tx of [-10.5, 11.7]) turret(granite, tile, tx, yW, 2.9, 0, EAVE + 1.5, 36.5, 12, 0.35)
    // the great carriage arch and its voussoirs
    const c = sOf(GX)
    arch(dark, fa, fb, c - 3.4, c + 3.4, 0, 4.8, 0.06, 10)
    voussoirs(granite, fa, fb, c - 3.4, c + 3.4, 4.8, 1.3, 0.1, 10)
  }

  // ---- facade windows: rusticated base, two floors of square-headed
  // windows, a tall round-arched storey, the arcaded attic
  type Face = { a: XY; b: XY; skip: [number, number][] }
  const TCY = 0.4, TH = 6.6, TX0 = X0, TX1 = TX0 + 2 * TH
  const faces: Face[] = [
    { a: [X0, Y0], b: [X1, Y0], skip: [[GX - X0 - 13.6, GX - X0 + 13.6]] }, // Forbes: turrets + gable
    { a: [X1, Y0], b: [X1, Y1], skip: [[L_y / 2 - 3.5, L_y / 2 + 3.5]] }, // Ross: bridge door
    { a: [X1, Y1], b: [X0, Y1], skip: [[X1 - GX - 13.6, X1 - GX + 13.6]] }, // Fifth
    { a: [X0, Y1], b: [X0, Y0], skip: [[Y1 - TCY - 7.6, Y1 - TCY + 7.6], [Y1 - TCY - 13.4, Y1 - TCY - 7], [Y1 - TCY + 7, Y1 - TCY + 13.4]] }, // Grant: tower and entrances
  ]
  for (const f of faces) {
    const { L } = onWall(f.a, f.b)
    const pitch = 4.2, n = Math.floor((L - 3) / pitch), s0 = (L - n * pitch) / 2
    for (let i = 0; i < n; i++) {
      const s = s0 + (i + 0.5) * pitch
      if (f.skip.some(([a, b]) => s > a - 1.2 && s < b + 1.2)) continue
      panel(win, f.a, f.b, s - 0.6, s + 0.6, 2.9, 4.2) // basement
      panel(win, f.a, f.b, s - 0.85, s + 0.85, 5.6, 11.2) // first and second floors
      arch(win, f.a, f.b, s - 1.05, s + 1.05, 13.6, 18.3) // the tall arched storey
      arcade(win, f.a, f.b, s - 1.6, s + 1.6, 2, 0.5, 21.2, 23.8, 4) // attic arcade
    }
  }
  // Ross Street: the bridge doorway (the bridge itself is the jail's)
  arch(door, faceE[0], faceE[1], L_y / 2 - 1.6, L_y / 2 + 1.6, 7.5, 10.2, 0.06, 8)
  arch(win, faceE[0], faceE[1], L_y / 2 - 1.3, L_y / 2 + 1.3, 1.5, 4.5, 0.06, 8)

  // Grant Street: three round-arched entrances under and beside the tower
  for (const c of [TCY, TCY + 10.2, TCY - 10.2]) {
    const s = Y1 - c, w = c === TCY ? 5.4 : 4.6
    arch(dark, faceW[0], faceW[1], s - w / 2, s + w / 2, 1.2, 5.2, 0.1, 10)
    arch(door, faceW[0], faceW[1], s - 0.9, s + 0.9, 1.2, 3.6, 0.13, 6)
    voussoirs(granite, faceW[0], faceW[1], s - w / 2, s + w / 2, 5.2, 1.1, 0.16, 10)
    arch(win, faceW[0], faceW[1], s - w * 0.35, s + w * 0.35, 9.0, 11.5, 0.12, 6)
    arch(win, faceW[0], faceW[1], s - w * 0.3, s + w * 0.3, 14, 18, 0.12, 6)
  }

  // ---- courtyard fronts (lighter treatment) and the two east stair towers
  const cf: [XY, XY][] = [[[CX1, CY0], [CX0, CY0]], [[CX0, CY0], [CX0, CY1]], [[CX0, CY1], [CX1, CY1]], [[CX1, CY1], [CX1, CY0]]]
  for (const [a, b] of cf) {
    const { L } = onWall(a, b), n = Math.floor(L / 4.4), s0 = (L - n * 4.4) / 2
    for (let i = 0; i < n; i++) {
      const s = s0 + (i + 0.5) * 4.4
      panel(win, a, b, s - 0.8, s + 0.8, 9, 14)
      arch(win, a, b, s - 1, s + 1, 16, 20.5, 0.05, 6)
    }
  }
  for (const ty of [-10, 10]) {
    const r: [number, number, number, number] = [19.6, ty - 3, 25.6, ty + 3]
    wallsSplit(granite, rect(r[0], r[1], r[2], r[3]), 0, 51)
    band(granite, rect(r[0], r[1], r[2], r[3]), grow(r, 0.35), 49.8, 51)
    pyramid(tile, r, 51, 56.5, 0.35)
    for (const [a, b] of boxFaces(r)) {
      arcade(win, a, b, 1.2, 4.8, 2, 0.6, 42, 46.5, 6)
    }
  }

  // ---- the Grant Street tower
  const TC: XY = [TX0 + TH, TCY]
  const tR: [number, number, number, number] = [TX0, TCY - TH, TX1, TCY + TH]
  const TOP = 84
  wallsSplit(granite, rect(...tR), 0, TOP, 6)
  band(granite, rect(...tR), grow(tR, 0.3), 30, 31)
  band(granite, rect(...tR), grow(tR, 0.25), 62.5, 63.4)
  band(granite, rect(...tR), grow(tR, 0.55), TOP - 1.4, TOP)
  // corner buttresses up the lower shaft, sloped caps at the roof line
  for (const [cx, cy] of [[tR[0], tR[1]], [tR[0], tR[3]], [tR[2], tR[1]], [tR[2], tR[3]]] as XY[]) {
    const sx = Math.sign(cx - TC[0]), sy = Math.sign(cy - TC[1])
    const r = rect(cx - 1, cy - 1, cx + 1, cy + 1)
    if (cx === tR[2]) continue // the back corners are inside the range
    wallsSplit(granite, r, 0, 29)
    const c: V3 = [cx - sx * 0.2, cy - sy * 0.2, 32]
    for (let i = 0; i < 4; i++) { const a = r[i], b = r[(i + 1) % 4]; poly(granite, [[a[0], a[1], 29], [b[0], b[1], 29], c], [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 1]) }
  }
  // round turrets flanking the tower up to 55 (lidar)
  for (const sy of [-1, 1]) turret(granite, tile, TC[0] + 0.5, TC[1] + sy * (TH + 1.6), 2.0, 20, 51.5, 55.5, 12, 0.25)
  // belfry, arcade, shaft windows on the four faces
  for (const [a, b] of boxFaces(tR)) {
    const { L } = onWall(a, b)
    arcade(win, a, b, 1.6, L - 1.6, 3, 0.75, 65, 75.5, 8) // three tall belfry openings
    arcade(win, a, b, 1.2, L - 1.2, 6, 0.45, 78.0, 80.4, 4) // the small arcade over them
    for (const z of [35, 45, 55]) for (const s of [L / 2 - 1.6, L / 2 + 1.6]) arch(win, a, b, s - 0.45, s + 0.45, z, z + 2.6, 0.05, 4)
  }
  // corner turrets and the stone pyramid
  for (const [cx, cy] of [[tR[0], tR[1]], [tR[0], tR[3]], [tR[2], tR[1]], [tR[2], tR[3]]] as XY[]) turret(granite, granite, cx, cy, 1.25, 77, TOP + 1.6, 89.5, 10, 0.15)
  pyramid(granite, tR, TOP, 97.6, 0.2)

  // ---- chimneys along the ridges (HABS elevations)
  for (const [x, y] of [[-20, 24], [10, 24], [-20, -24], [10, -24], [-36.5, 14], [-36.5, -14], [37.5, 10], [37.5, -10]] as XY[]) {
    const r = rect(x - 0.8, y - 0.8, x + 0.8, y + 0.8)
    walls(granite, r, 38, 45); cap(granite, r, 45)
  }

  const lit = (p: V3, n: V3) => {
    if (n[2] > 0.6) return 0.1
    const inTower = p[0] < TX1 + 1 && Math.abs(p[1] - TCY) < TH + 2
    return inTower ? 0.75 : p[2] < 30 ? 0.45 : 0.25
  }
  return [
    { part: granite, material: { ...finish('courthouse-granite', 0xb4a090), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('red-tile', 0xc87661) },
    { part: door, material: PALETTE.entrance },
    { part: dark, material: finish('arch-shadow', 0x6f6460) },
  ]
}

if (import.meta.main) await save('pit-allegheny-county-courthouse', 'Allegheny County Courthouse', [40.4387981, -79.9964116], 26.3, build() as any, 6500)
