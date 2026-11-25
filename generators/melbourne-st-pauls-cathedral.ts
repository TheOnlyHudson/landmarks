/**
 * St Paul's Cathedral, Flinders Street, Melbourne: procedural, CC0-1.0.
 * bun generators/melbourne-st-pauls-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 340
 * (the outline's long edges run 160/340 with the city grid). Origin at the
 * area centroid of OSM way/13127644 (144.9676144, -37.8167969). The church
 * is symmetric about x = -0.4 (the axis), drawn about it and shifted.
 *
 * William Butterfield's Gothic Transitional cathedral, 1880-91 (completed
 * by Joseph Reed), with John Barr's three spires of 1926-33 in Sydney
 * sandstone. The cathedral lies north-south on the grid: its liturgical
 * west front, with the two towers and spires, faces south onto Flinders
 * Street (-y); the crossing tower carries the 95 m Moorhouse Spire; the
 * chancel is at the north (+y).
 *
 * Published (Wikipedia "St Paul's Cathedral, Melbourne"): central spire
 * "312 ft (95m)", 1932; Latin cross plan with long nave, aisles, short
 * transepts, crossing tower and a pair of towers at the main entrance;
 * Barrabool Hills sandstone and Waurn Ponds limestone ("a warm
 * colouring"), banded with dark bluestone; the spires of Sydney sandstone,
 * darker than the older work.
 *
 * OSM (turned frame): outline way/13127644 (height 40 m, gabled): front
 * towers x 4.7..14.1 either side, y -39.6..-30.2 (spire parts
 * way/273247587, 273247589, tagged 60 m); nave and aisles x +-11.3 to the
 * crossing; crossing tower x +-6.8, y 13.1..25.8 (way/273247588, 96 m);
 * transepts to x +-15.6; chancel and its aisles x +-10.9 to y 34.2; the
 * sanctuary x +-7.2 to 42.6.
 *
 * Heights, measured on p10 (the south front head-on, level camera, verticals
 * parallel): 0.0285 m/px at the front from the towers' 28.1 m span. The
 * camera stands 44.5 m off, which the published 95 m for the crossing
 * spire's cross fixes (focal 1560 px). That reading gives the towers'
 * lower stage 21.4, belfry 26 and west spires 49 (cross 51); OSM tags the
 * west spire parts 60 m, and the lead's review (p8 aerial, p1) has the
 * towers rising clearly above the nave gable. Built between the two: lower
 * stage to 23.5, belfry stage to 29, corner pinnacles to 34.6, west spires
 * to 56 (cross 58). Nave gable apex 26.8 (the ridge), the gallery
 * 21.6-24.8; the west window 5.8 m wide from 10.0 to 19.0 with its
 * flanking lancets (p10), the portal and window recessed 2.4 m.
 * Crossing tower (p10 at its distance, 0.064 m/px; p9 for the stages),
 * all of Barr's sandstone above the roofs (p8, p9): lower stage to 44, belfry stage to 61, corner pinnacles to
 * 73, spire to 93 and its cross to 95.
 * Estimated: aisle eaves 11 and clerestory eaves 19.5 (p9, p12), bay
 * counts (eight in the nave from p9/p12), buttress sizes, the transepts'
 * and chancel's windows (p9), the spire lucarnes' size.
 * Left out: the Chapter House and offices to the north-east (separate OSM
 * buildings), crockets as more than a few studs, the forecourt steps, the
 * diaper patterns' every square.
 *
 * Colours (sample.ts): walls in sun/shade #a8a292 / #928d82 (p1), the
 * limestone bands paler; bluestone bands #4d5157 (p1) -> walls 0xb7af9c,
 * bands 0x5d6066; spires and tower tops sunlit #b07e5c, shade #8c674b (p6)
 * -> sandstone 0xc08a66; slate roofs (p9, p12) -> 0x7c8087.
 *
 * Night: the spires and towers are floodlit (p11); the stone carries
 * _FLOODLIGHT, the windows glow.
 *
 * LODs: the low model has the spires, lucarnes and pinnacles, the towers'
 * stages with real belfry openings, the west portal and west window as real
 * pointed recesses, buttresses, the bluestone bands, flush window panels on
 * the aisles and clerestory. The detail model adds every window as a real
 * pointed recess with tracery bars, the west gallery's blind arcade, the
 * diaper squares, the pinnacles round the spires' feet and crockets.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - p1 "AUS Melbourne, Central Business District, St Paul's Cathedral 001.jpg", -wuppertaler, CC BY 4.0 (west front, close)
 * - p5 "Melbourne St Paul's from Swanston S.jpg", Orderinchaos, CC BY-SA 3.0 (from the south-west)
 * - p6 "St Paul's Cathedral, Melbourne 3.jpg", Rob Deutscher, CC BY 2.0 (the three spires)
 * - p7 "St Paul's Cathedral and Melbourne CBD from Federation Square.jpg", Bhullargraphic, CC BY-SA 4.0 (from the south-east)
 * - p8 "Melbourne (AU), View from Eureka Tower, Northbank -- 2019 -- 1461.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial)
 * - p9 "St Paul's Cathedral, Melbourne, AU.jpg", Dennis Stenbjerg, CC BY-SA 2.0 (crossing tower from the east)
 * - p10 "St Paul's Cathedral, Melbourne 2017-10-30.jpg", Crisco 1492, CC BY-SA 4.0 (south front, frontal)
 * - p11 "St Paul's Cathedral, Melbourne, at night.jpg", Steven Penton, CC BY 2.0 (night)
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arch, box, face, lathe, loftRings, prism, tube, type Layer, type XY } from './sydney-tower-eye'
import { flatSkin, onWall, saveLods, shift, skin2, wallBox, wallBoxDefaults, type Hole } from './melbourne-royal-exhibition-building'

const AXIS = -0.4
type Set = { lime: Part; blue: Part; sand: Part; slate: Part; win: Part; door: Part }
const mk = (): Set => ({ lime: new Part(), blue: new Part(), sand: new Part(), slate: new Part(), win: new Part(), door: new Part() })
const low = mk(), det = mk()
const D = 0.35
let DET = false

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A pointed (equilateral) opening; small ones in the low model keep a two-segment head. */
const pa = (s0: number, s1: number, zb: number, zs: number, seg?: number) => arch(s0, s1, zb, zs, true, seg ?? (DET ? 6 : 2))

/** A wall face on line a->b (outline; mass inset by D) with openings: real recesses in the detail model or when `real`. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number, holes: Hole[], o: { real?: boolean; ends?: boolean } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ai = onWall(a, b, 0, -D, 0), bi = onWall(a, b, L, -D, 0)
  ;(DET || o.real ? skin2 : flatSkin)(p, [ai[0], ai[1]], [bi[0], bi[1]], z0, z1, D, holes, { ends: o.ends ?? false })
}

/** Bluestone bands along a wall line: the plinth and string courses at the given heights. */
function bands(s: Set, a: XY, b: XY, zs: number[], o: { plinth?: number } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (o.plinth) wallBox(s.blue, a, b, -0.15, L + 0.15, -0.05, 0.2, 0, o.plinth, { top: true })
  for (const z of zs) wallBox(s.blue, a, b, 0, L, -0.05, 0.12, z, z + 0.45, { top: true, bottom: true })
}

/** A pitched roof with its ridge along x or y. */
function pitched(p: Part, x0: number, x1: number, y0: number, y1: number, zE: number, zR: number, along: 'x' | 'y', ov = 0.4) {
  if (along === 'y') {
    const xc = (x0 + x1) / 2, h = (zR - zE) * ov / ((x1 - x0) / 2)
    face(p, [[x0 - ov, y1, zE - h], [x0 - ov, y0, zE - h], [xc, y0, zR], [xc, y1, zR]], [-(zR - zE), 0, (x1 - x0) / 2])
    face(p, [[x1 + ov, y0, zE - h], [x1 + ov, y1, zE - h], [xc, y1, zR], [xc, y0, zR]], [(zR - zE), 0, (x1 - x0) / 2])
  } else {
    const yc = (y0 + y1) / 2, h = (zR - zE) * ov / ((y1 - y0) / 2)
    face(p, [[x0, y0 - ov, zE - h], [x1, y0 - ov, zE - h], [x1, yc, zR], [x0, yc, zR]], [0, -(zR - zE), (y1 - y0) / 2])
    face(p, [[x1, y1 + ov, zE - h], [x0, y1 + ov, zE - h], [x0, yc, zR], [x1, yc, zR]], [0, (zR - zE), (y1 - y0) / 2])
  }
}

/** A gable wall triangle on line a->b from z0 to apex zA, `t` thick (outward), with a coping. */
function gableWall(p: Part, cope: Part, a: XY, b: XY, z0: number, zA: number, t: number, holes: Hole[] = []) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  const P = (s: number, d: number, z: number) => onWall(a, b, s, d, z)
  face(p, [P(0, t, z0), P(L, t, z0), P(L / 2, t, zA)], n)
  for (const h of holes) if (h.glass) face(h.glass, h.pts.map(([s, z]) => P(s, t + 0.04, z)), n)
  const sl = (zA - z0) / (L / 2)
  face(cope, [P(-0.2, -0.3, z0), P(-0.2, t + 0.25, z0), P(L / 2, t + 0.25, zA + 0.35), P(L / 2, -0.3, zA + 0.35)], [-u[0] * sl, -u[1] * sl, 1])
  face(cope, [P(L + 0.2, t + 0.25, z0), P(L + 0.2, -0.3, z0), P(L / 2, -0.3, zA + 0.35), P(L / 2, t + 0.25, zA + 0.35)], [u[0] * sl, u[1] * sl, 1])
  face(cope, [P(-0.2, t + 0.25, z0), P(L / 2, t + 0.25, zA + 0.35), P(L + 0.2, t + 0.25, z0)], n)
}

/** A pinnacle: square or octagonal shaft and a spirelet, optional crocket studs. */
function pinnacle(p: Part, c: XY, r: number, z0: number, z1: number, tip: number, n = 4, crockets = 0) {
  const ph = n === 4 ? Math.PI / 4 : Math.PI / 8
  const rr = r / Math.cos(Math.PI / n)
  const ring = (R: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const t = ph + (i / n) * Math.PI * 2; return [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t), z] })
  loftRings(p, [ring(rr, z0), ring(rr, z1)])
  loftRings(p, [ring(rr * 1.18, z1), ring(rr * 1.18, z1 + 0.25)], { bottom: true })
  const apex: V3 = [c[0], c[1], tip]
  loftRings(p, [ring(rr * 1.05, z1 + 0.25), ring(rr, z1 + 0.25).map(() => apex)])
  for (let k = 1; k <= crockets; k++) {
    const f = k / (crockets + 1), z = z1 + 0.25 + (tip - z1 - 0.25) * f, R = rr * 1.05 * (1 - f)
    for (let i = 0; i < n; i++) { const t = ph + (i / n) * Math.PI * 2; box(p, [c[0] + (R + 0.08) * Math.cos(t), c[1] + (R + 0.08) * Math.sin(t)], 0.12, 0.12, z - 0.12, z + 0.12, t) }
  }
}

/** An octagonal spire from `ap` (apothem) at z0 to its apex, with gabled lucarnes on the cardinal faces and a cross. */
function spire(s: Set, d: boolean, c: XY, ap: number, z0: number, apex: number, luc: { z: number; h: number; w: number }[], crossTop: number) {
  const R = ap / Math.cos(Math.PI / 8)
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + (i / 8) * Math.PI * 2; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z] })
  const A: V3 = [c[0], c[1], apex]
  loftRings(s.sand, [ring(R, z0), ring(R * 0.035, apex - 0.6), ring(0.0001, apex).map(() => A)])
  // angle rolls (the crocketed arrises) as thin ribs in the detail model, studs every 2 m
  if (d) for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (i / 8) * Math.PI * 2
    const P = (f: number): V3 => [c[0] + (R * (1 - f) + 0.12) * Math.cos(t), c[1] + (R * (1 - f) + 0.12) * Math.sin(t), z0 + (apex - z0) * f]
    tube(s.sand, [P(0), P(0.97)], 0.1, 3)
    const n = Math.floor((apex - z0) / 2.2)
    for (let k = 1; k < n; k++) { const q = P(k / n); box(s.sand, [q[0], q[1]], 0.13, 0.13, q[2] - 0.15, q[2] + 0.15, t) }
  }
  // lucarnes: a gabled dormer standing out of each cardinal face
  for (const L of luc) for (let i = 0; i < 4; i++) {
    const t = (i / 4) * Math.PI * 2, ux = Math.cos(t), uy = Math.sin(t)
    const rAt = (z: number) => ap * (1 - (z - z0) / (apex - z0))
    const out = rAt(L.z) + 0.25
    const P = (sv: number, dv: number, z: number): V3 => [c[0] + ux * dv - uy * sv, c[1] + uy * dv + ux * sv, z]
    const w = L.w / 2, zE = L.z + L.h * 0.62, zA = L.z + L.h
    // front face with its lancet
    face(s.sand, [P(-w, out, L.z), P(w, out, L.z), P(w, out, zE), P(0, out, zA), P(-w, out, zE)], [ux, uy, 0])
    face(s.win, [P(-w * 0.45, out + 0.04, L.z + 0.3), P(w * 0.45, out + 0.04, L.z + 0.3), P(w * 0.45, out + 0.04, zE - 0.2), P(0, out + 0.04, zE + (zA - zE) * 0.5), P(-w * 0.45, out + 0.04, zE - 0.2)], [ux, uy, 0])
    // cheeks and the little roof back into the spire
    const back = rAt(zA) - 0.6
    for (const sg of [-1, 1]) {
      face(s.sand, sg > 0 ? [P(w, out, L.z), P(w, back - 0.8, L.z), P(w, back - 0.8, zE), P(w, out, zE)] : [P(-w, back - 0.8, L.z), P(-w, out, L.z), P(-w, out, zE), P(-w, back - 0.8, zE)], [-uy * sg, ux * sg, 0])
      face(s.sand, sg > 0 ? [P(0, out, zA), P(w, out, zE), P(w, back, zE), P(0, back, zA)] : [P(-w, out, zE), P(0, out, zA), P(0, back, zA), P(-w, back, zE)], [-uy * sg * (zA - zE), ux * sg * (zA - zE), w])
    }
    if (d) pinnacle(s.sand, [P(0, out, 0)[0], P(0, out, 0)[1]], 0.18, zA, zA + 0.3, zA + 1.1, 4)
  }
  // finial and cross
  tube(s.sand, [[c[0], c[1], apex - 0.2], [c[0], c[1], crossTop]], 0.12, 4)
  const arm = crossTop - 0.9
  tube(s.sand, [[c[0] - 0.55, c[1], arm], [c[0] + 0.55, c[1], arm]], 0.1, 4)
}

/** A tower's corner buttresses (clasping) from z0 to z1 with set-offs. */
function cornerButtresses(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, w = 1.4, sets = 2) {
  for (const [cx, cy, sx, sy] of [[x0, y0, -1, -1], [x1, y0, 1, -1], [x1, y1, 1, 1], [x0, y1, -1, 1]] as [number, number, number, number][]) {
    for (let k = 0; k < sets; k++) {
      const za = z0 + ((z1 - z0) * k) / sets, zb = z0 + ((z1 - z0) * (k + 1)) / sets, pr = 0.5 * (1 - k / sets) + 0.15
      const xa = sx > 0 ? cx - w + pr : cx - pr, xb = sx > 0 ? cx + pr : cx + w - pr
      const ya = sy > 0 ? cy - w + pr : cy - pr, yb = sy > 0 ? cy + pr : cy + w - pr
      box(p, [(xa + xb) / 2, (ya + yb) / 2], (xb - xa) / 2, (yb - ya) / 2, za, zb, 0, { top: true })
    }
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  DET = d
  wallBoxDefaults.back = false
  wallBoxDefaults.lean = !d

  const NX = 4.7, AX = 11.3, TX = 15.6, CHX = 10.9, SX = 7.2
  const YF = -39.6, YT = -30.2, YC0 = 13.1, YC1 = 25.8, YX0 = 12.4, YX1 = 25.6, YCH = 34.2, YE = 42.6
  const AE = 11, CE = 19.5, RIDGE = 26.8
  const bayYs = (y0: number, y1: number, n: number) => Array.from({ length: n }, (_, k) => [y0 + ((y1 - y0) * k) / n, y0 + ((y1 - y0) * (k + 1)) / n] as XY)

  // ---- Nave and chancel: aisles with buttresses and windows, clerestory, roofs ----
  for (const [y0, y1, nb, ax] of [[YT, YX0, 8, AX], [YX1, YCH, 2, CHX]] as [number, number, number, number][]) {
    prism(s.lime, [[-ax + D, y0], [ax - D, y0], [ax - D, y1], [-ax + D, y1]], 0, AE, { top: true })
    prism(s.lime, [[-NX + D, y0], [NX - D, y0], [NX - D, y1], [-NX + D, y1]], AE, CE, { top: false })
    for (const sg of [-1, 1]) {
      const a: XY = sg > 0 ? [ax, y0] : [-ax, y1], b: XY = sg > 0 ? [ax, y1] : [-ax, y0]
      const L = y1 - y0, w = L / nb
      wall(s.lime, a, b, 0, AE, Array.from({ length: nb }, (_, k) => ({ pts: pa(w * (k + 0.5) - 1.1, w * (k + 0.5) + 1.1, 3.4, 7.4), glass: s.win })))
      bands(s, a, b, d ? [3.0, 5.6, 8.2] : [5.6], { plinth: 1.0 })
      wallBox(s.lime, a, b, -0.1, L + 0.1, -0.05, 0.45, AE - 0.4, AE, { top: true, bottom: true })
      // buttresses between the bays, stepped once, with a weathered cap
      for (let k = 0; k <= nb; k++) {
        const sc = k * w
        wallBox(s.lime, a, b, sc - 0.45, sc + 0.45, 0, 1.3, 0, AE - 3.2, { top: true })
        wallBox(s.lime, a, b, sc - 0.4, sc + 0.4, 0, 0.75, AE - 3.2, AE + 0.6, { top: true })
        if (d) wallBox(s.blue, a, b, sc - 0.47, sc + 0.47, 1.0, 1.35, 5.6, 6.05, { top: true, bottom: true })
      }
      // lean-to aisle roof
      const xo = sg * (ax + 0.3), xi = sg * NX
      const q: V3[] = [[xo, y0, AE - 0.1], [xo, y1, AE], [xi, y1, AE + 2.6], [xi, y0, AE + 2.6]]
      face(s.slate, sg > 0 ? [q[0], q[3], q[2], q[1]] : q, [sg * 2.7, 0, ax - NX])
      // clerestory: paired lancets per bay
      const c: XY = sg > 0 ? [NX, y0] : [-NX, y1], e: XY = sg > 0 ? [NX, y1] : [-NX, y0]
      const holes: Hole[] = []
      for (let k = 0; k < nb; k++) for (const j of [-0.65, 0.65]) holes.push({ pts: pa(w * (k + 0.5) + j - 0.42, w * (k + 0.5) + j + 0.42, 15.0, 17.6), glass: s.win })
      wall(s.lime, c, e, AE, CE, holes)
      bands(s, c, e, d ? [14.2, 18.4] : [14.2])
      wallBox(s.lime, c, e, -0.1, L + 0.1, -0.05, 0.4, CE - 0.4, CE, { top: true, bottom: true })
    }
    pitched(s.slate, -NX, NX, y0 === YT ? YF + 0.2 : y0, y0 === YT ? YC0 + 0.3 : y1, CE, RIDGE, 'y')
  }
  // sanctuary to the north end: walls to the clerestory eaves, the east gable with its great window
  prism(s.lime, [[-SX + D, YCH], [SX - D, YCH], [SX - D, YE - D], [-SX + D, YE - D]], 0, CE, { top: true })
  for (const sg of [-1, 1]) {
    const a: XY = sg > 0 ? [SX, YCH] : [-SX, YE], b: XY = sg > 0 ? [SX, YE] : [-SX, YCH]
    wall(s.lime, a, b, 0, CE, [{ pts: pa(2.4, 6.0, 4.5, 13.0, d ? 6 : 3), glass: s.win }], { ends: true })
    bands(s, a, b, d ? [3.0, 5.6, 8.2, 14.2] : [5.6, 14.2], { plinth: 1.0 })
    wallBox(s.lime, a, b, -0.1, YE - YCH + 0.1, -0.05, 0.4, CE - 0.4, CE, { top: true, bottom: true })
  }
  {
    const a: XY = [SX, YE], b: XY = [-SX, YE]
    wall(s.lime, a, b, 0, CE, [{ pts: pa(3.4, 11.0, 5.0, 14.0, d ? 8 : 4), glass: s.win }], { real: true, ends: true })
    bands(s, a, b, d ? [3.0, 14.8] : [], { plinth: 1.0 })
    gableWall(s.lime, s.lime, onWall(a, b, 0, -0.6, 0).slice(0, 2) as XY, onWall(a, b, 2 * SX, -0.6, 0).slice(0, 2) as XY, CE, RIDGE, 0.6, [{ pts: pa(SX - 1.0, SX + 1.0, CE + 1.5, CE + 3.0, d ? 6 : 2), glass: s.win }])
    for (const sx of [-1, 1]) pinnacle(s.lime, [sx * (SX - 0.3), YE - 0.3], 0.55, 0, CE + 1.5, CE + 4.2, 4, d ? 3 : 0)
  }
  pitched(s.slate, -SX, SX, YCH, YE, CE, RIDGE, 'y')

  // ---- Transepts: gabled ends with a great window and a rose, corner pinnacles ----
  for (const sg of [-1, 1]) {
    const x0 = sg > 0 ? AX : -TX, x1 = sg > 0 ? TX : -AX
    prism(s.lime, [[x0 + D, YX0 + D], [x1 - D, YX0 + D], [x1 - D, YX1 - D], [x0 + D, YX1 - D]], 0, CE, { top: true })
    const a: XY = sg > 0 ? [TX, YX0] : [-TX, YX1], b: XY = sg > 0 ? [TX, YX1] : [-TX, YX0], L = YX1 - YX0
    wall(s.lime, a, b, 0, CE, [{ pts: pa(L / 2 - 3.0, L / 2 + 3.0, 5.0, 13.4, d ? 8 : 4), glass: s.win }, { pts: rect(L / 2 - 1.0, L / 2 + 1.0, 1.0, 3.6), glass: s.door }], { real: true, ends: true })
    bands(s, a, b, d ? [3.0, 4.6, 14.8, 17.2] : [4.6, 14.8], { plinth: 1.0 })
    gableWall(s.lime, s.lime, onWall(a, b, 0, -0.6, 0).slice(0, 2) as XY, onWall(a, b, L, -0.6, 0).slice(0, 2) as XY, CE, RIDGE, 0.6, [{ pts: Array.from({ length: d ? 12 : 8 }, (_, i) => { const t = (i / (d ? 12 : 8)) * Math.PI * 2; return [L / 2 + 1.3 * Math.cos(t), CE + 2.6 + 1.3 * Math.sin(t)] as XY }), glass: s.win }])
    for (const yy of [YX0, YX1]) for (const side of [0]) {
      void side
      // returns of the transept walls (east and west faces beyond the aisles)
      const p: XY = yy === YX0 ? [x0, YX0] : [x1, YX1], q: XY = yy === YX0 ? [x1, YX0] : [x0, YX1]
      wall(s.lime, p, q, AE, CE, [{ pts: pa(1.2, 3.0, 13.0, 16.4, d ? 6 : 2), glass: s.win }], { ends: true })
      wall(s.lime, p, q, 0, AE, [])
      bands(s, p, q, [14.2], { plinth: 1.0 })
    }
    for (const yy of [YX0 + 0.5, YX1 - 0.5]) pinnacle(s.lime, [sg * (TX - 0.5), yy], 0.6, 0, CE + 1.2, CE + 4.6, d ? 8 : 4, d ? 3 : 0)
    pitched(s.slate, sg > 0 ? 6.8 : -TX, sg > 0 ? TX : -6.8, YX0, YX1, CE, RIDGE, 'x')
  }

  // ---- Crossing tower and the Moorhouse Spire ----
  {
    const cx0 = -6.8, cx1 = 6.8, cy0 = YC0, cy1 = YC1, cyc = (YC0 + YC1) / 2
    prism(s.sand, [[cx0 + D, cy0 + D], [cx1 - D, cy0 + D], [cx1 - D, cy1 - D], [cx0 + D, cy1 - D]], CE, 44, { top: false })
    const faces: [XY, XY][] = [[[cx0, cy0], [cx1, cy0]], [[cx1, cy0], [cx1, cy1]], [[cx1, cy1], [cx0, cy1]], [[cx0, cy1], [cx0, cy0]]]
    for (const [a, b] of faces) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      // lower stage (Barr's sandstone, like everything above the roofs): one tall lancet flanked by blind ones
      wall(s.sand, a, b, CE, 44, [{ pts: pa(L / 2 - 0.9, L / 2 + 0.9, 31.5, 38.5, d ? 6 : 3), glass: s.win }, ...(d ? [-2.6, 2.6].map((j) => ({ pts: pa(L / 2 + j - 0.7, L / 2 + j + 0.7, 32.5, 38.0, 6), glass: null })) : [])], { ends: true })
      wallBox(s.sand, a, b, -0.2, L + 0.2, -0.05, 0.45, 30.6, 31.1, { top: true, bottom: true })
      if (d) wallBox(s.sand, a, b, -0.2, L + 0.2, -0.05, 0.45, 40.6, 41.0, { top: true, bottom: true })
      // belfry stage (sandstone): three tall open lancets
      wall(s.sand, a, b, 44, 61, [-2.9, 0, 2.9].map((j) => ({ pts: pa(L / 2 + j - 0.95, L / 2 + j + 0.95, 46.5, 56.5, d ? 6 : 3), glass: s.win })), { real: true, ends: true })
      wallBox(s.sand, a, b, -0.2, L + 0.2, -0.05, 0.5, 44, 44.6, { top: true, bottom: true })
      wallBox(s.sand, a, b, -0.3, L + 0.3, -0.05, 0.6, 60.4, 61.2, { top: true, bottom: true })
      // parapet (openwork in the detail model)
      if (d) skin2(s.sand, onWall(a, b, 0, 0.1, 0).slice(0, 2) as XY, onWall(a, b, L, 0.1, 0).slice(0, 2) as XY, 61.2, 62.6, 0.2, Array.from({ length: 6 }, (_, k) => ({ pts: pa(1.6 + k * (L - 3.2) / 6 + 0.25, 1.6 + (k + 1) * (L - 3.2) / 6 - 0.25, 61.4, 61.9, 4) })), { through: true })
      else wallBox(s.sand, a, b, 0, L, 0.1, 0.5, 61.2, 62.4, { top: true })
    }
    prism(s.sand, [[cx0 + D, cy0 + D], [cx1 - D, cy0 + D], [cx1 - D, cy1 - D], [cx0 + D, cy1 - D]], 44, 61, { top: true })
    cornerButtresses(s.sand, cx0, cx1, cy0, cy1, 44, 61, 1.5, 2)
    // corner turrets: octagonal pinnacles to 73, and lesser ones at the mid-faces
    for (const [px, py] of [[cx0, cy0], [cx1, cy0], [cx1, cy1], [cx0, cy1]] as XY[]) pinnacle(s.sand, [px, py], 0.95, 61.2, 66.5, 73, 8, d ? 5 : 0)
    if (d) for (const [px, py] of [[0, cy0], [cx1, cyc], [0, cy1], [cx0, cyc]] as XY[]) pinnacle(s.sand, [px, py], 0.4, 61.2, 63.5, 67.5, 4, 2)
    spire(s, d, [0, cyc], 4.3, 61.4, 93, [{ z: 61.6, h: 7.5, w: 2.4 }, ...(d ? [{ z: 73.5, h: 4.2, w: 1.3 }] : [])], 95)
  }

  // ---- The south front: twin towers with spires, the gable between them ----
  for (const sg of [-1, 1]) {
    const x0 = sg > 0 ? NX : -14.1, x1 = sg > 0 ? 14.1 : -NX, y0 = YF, y1 = YT
    const xm = (x0 + x1) / 2, W = x1 - x0
    prism(s.lime, [[x0 + D, y0 + D], [x1 - D, y0 + D], [x1 - D, y1], [x0 + D, y1]], 0, 23.5, { top: false })
    const faces: [XY, XY, boolean][] = [[[x0, y0], [x1, y0], true], [sg > 0 ? [x1, y0] : [x0, y1], sg > 0 ? [x1, y1] : [x0, y0], false]]
    for (const [a, b, front] of faces) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const holes: Hole[] = [{ pts: pa(L / 2 - 1.3, L / 2 + 1.3, 5.4, 9.8, d ? 6 : 3), glass: s.win }, ...[-0.8, 0.8].map((j) => ({ pts: pa(L / 2 + j - 0.45, L / 2 + j + 0.45, 15.0, 17.2), glass: s.win }))]
      if (front && sg > 0) holes.push({ pts: Array.from({ length: d ? 12 : 8 }, (_, i) => { const t = (i / (d ? 12 : 8)) * Math.PI * 2; return [L / 2 + 1.1 * Math.cos(t), 20.6 + 1.1 * Math.sin(t)] as XY }), glass: s.win })
      wall(s.lime, a, b, 0, 23.5, holes, { ends: true })
      bands(s, a, b, d ? [3.0, 5.0, 11.4, 13.4, 18.4, 22.9] : [5.0, 13.4, 22.9], { plinth: 1.0 })
    }
    cornerButtresses(s.lime, x0, x1, y0, y1, 0, 23.5, 1.7, 3)
    // the belfry stage in sandstone with three lancets per face, an openwork parapet
    prism(s.sand, [[x0 + D, y0 + D], [x1 - D, y0 + D], [x1 - D, y1 - D], [x0 + D, y1 - D]], 23.5, 29, { top: true })
    for (const [a, b] of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      wall(s.sand, a, b, 23.5, 29, [-1.6, 0, 1.6].map((j) => ({ pts: pa(L / 2 + j - 0.55, L / 2 + j + 0.55, 24.4, 27.2, d ? 6 : 2), glass: s.win })), { ends: true, real: true })
      wallBox(s.sand, a, b, -0.3, L + 0.3, -0.05, 0.5, 23.3, 23.8, { top: true, bottom: true })
      if (d) skin2(s.sand, onWall(a, b, 0, 0.15, 0).slice(0, 2) as XY, onWall(a, b, L, 0.15, 0).slice(0, 2) as XY, 29, 30.0, 0.18, Array.from({ length: 4 }, (_, k) => ({ pts: pa(1.4 + k * (L - 2.8) / 4 + 0.2, 1.4 + (k + 1) * (L - 2.8) / 4 - 0.2, 29.15, 29.5, 4) })), { through: true })
      else wallBox(s.sand, a, b, 0, L, 0.15, 0.5, 29, 29.9, { top: true })
    }
    // corner pinnacles to 31.4 and the spire to 49 (cross 51)
    for (const [px, py] of [[x0 + 0.5, y0 + 0.5], [x1 - 0.5, y0 + 0.5], [x1 - 0.5, y1 - 0.5], [x0 + 0.5, y1 - 0.5]] as XY[]) pinnacle(s.sand, [px, py], 0.65, 23.5, 30.6, 34.6, 8, d ? 3 : 0)
    spire(s, d, [xm, (y0 + y1) / 2], 2.9, 29.2, 56, [{ z: 29.4, h: 5.4, w: 1.7 }], 58)
    void W
  }
  // the gable front of the nave between the towers: portal, west window, gallery, gable
  {
    const a: XY = [-NX, YF + 0.2], b: XY = [NX, YF + 0.2], L = 2 * NX
    const WD = 2.4 // the front's recess depth: portal and west window
    prism(s.lime, [[-NX, YF + 0.2 + WD], [NX, YF + 0.2 + WD], [NX, YT], [-NX, YT]], 0, CE, { top: false })
    const holes: Hole[] = [
      { pts: pa(L / 2 - 1.6, L / 2 + 1.6, 0.6, 5.0, d ? 8 : 4), glass: null },
      { pts: pa(L / 2 - 2.9, L / 2 + 2.9, 10.0, 14.0, d ? 10 : 6), glass: null },
      ...[-1, 1].map((sx) => ({ pts: pa(L / 2 + sx * 3.75 - 0.55, L / 2 + sx * 3.75 + 0.55, 10.3, 16.2, d ? 6 : 2), glass: s.win })),
    ]
    const ai = onWall(a, b, 0, -WD, 0), bi = onWall(a, b, L, -WD, 0)
    const A: XY = [ai[0], ai[1]], B: XY = [bi[0], bi[1]]
    skin2(s.lime, A, B, 0, 21.6, WD, holes, { ends: true })
    // backs of the recesses: the doors, and the window with its tracery
    face(s.door, [onWall(A, B, L / 2 - 1.6, 0.05, 0.6), onWall(A, B, L / 2 + 1.6, 0.05, 0.6), onWall(A, B, L / 2 + 1.6, 0.05, 5.0), onWall(A, B, L / 2 - 1.6, 0.05, 5.0)], [0, -1, 0])
    const wpts = pa(L / 2 - 2.9, L / 2 + 2.9, 10.0, 14.0, d ? 10 : 6)
    const ctr: XY = [L / 2, 14]
    for (let i = 0; i < wpts.length; i++) {
      const q = wpts[i], r = wpts[(i + 1) % wpts.length]
      face(s.win, [onWall(A, B, ctr[0], 0.05, ctr[1]), onWall(A, B, q[0], 0.05, q[1]), onWall(A, B, r[0], 0.05, r[1])], [0, -1, 0])
    }
    for (const j of d ? [-1.45, 0, 1.45] : [-1.45, 1.45]) wallBox(s.lime, A, B, L / 2 + j - 0.1, L / 2 + j + 0.1, 0.05, 0.25, 10.0, 15.2, { top: true })
    const rose: V3[] = Array.from({ length: (d ? 12 : 8) + 1 }, (_, i) => { const t = (i / (d ? 12 : 8)) * Math.PI * 2; return onWall(A, B, L / 2 + 1.25 * Math.cos(t), 0.2, 16.8 + 1.25 * Math.sin(t)) })
    tube(s.lime, rose, 0.14, 4)
    bands(s, a, b, d ? [3.0, 5.6, 8.0, 9.6] : [5.6, 9.6], { plinth: 1.0 })
    // the gallery of blind pointed arches under the gable
    const gal: Hole[] = Array.from({ length: d ? 7 : 5 }, (_, k, arr = d ? 7 : 5) => ({ pts: pa(0.5 + (k * (L - 1)) / arr + 0.12, 0.5 + ((k + 1) * (L - 1)) / arr - 0.12, 21.9, 23.2, d ? 6 : 2), glass: null }))
    skin2(s.lime, onWall(a, b, 0, -0.4, 0).slice(0, 2) as XY, onWall(a, b, L, -0.4, 0).slice(0, 2) as XY, 21.6, 24.8, 0.4, gal, { ends: true })
    gableWall(s.lime, s.lime, onWall(a, b, 0, -0.6, 0).slice(0, 2) as XY, onWall(a, b, L, -0.6, 0).slice(0, 2) as XY, 24.8, RIDGE, 0.6)
    // the cross on the gable
    tube(s.lime, [onWall(a, b, L / 2, 0, RIDGE + 0.3), onWall(a, b, L / 2, 0, RIDGE + 2.0)], 0.15, 4)
    tube(s.lime, [onWall(a, b, L / 2 - 0.6, 0, RIDGE + 1.4), onWall(a, b, L / 2 + 0.6, 0, RIDGE + 1.4)], 0.13, 4)
    // the diaper (chequer) panel in the detail model: ochre squares just proud of the cream field
    if (d) for (let r = 0; r < 6; r++) for (let k = 0; k < 9; k++) {
      if ((r + k) % 2) continue
      const s0 = 0.3 + k * 1.0, z = 15.9 + r * 0.95
      if (s0 + 0.95 > L - 0.3) continue
      if (Math.abs(s0 + 0.47 - L / 2) < 2.7 && z < 16.6) continue
      wallBox(s.sand, a, b, s0, s0 + 0.95, -0.03, 0.04, z, z + 0.95, { top: false })
    }
  }
}
wallBoxDefaults.back = true
wallBoxDefaults.lean = false

const lime: MaterialSpec = { ...finish('stpauls-limestone', 0xb7af9c), floodlight: (p, n) => (n[2] > 0.7 ? 0.2 : p[2] > 14 ? 0.9 : 0.5) }
const sand: MaterialSpec = { ...finish('stpauls-sandstone', 0xc08a66), floodlight: (p, n) => (n[2] > 0.8 ? 0.3 : 1) }
const layers = (s: Set): Layer[] => {
  for (const p of Object.values(s)) shift(p, AXIS, 0)
  return [
    { part: s.lime, material: lime },
    { part: s.blue, material: finish('stpauls-bluestone', 0x5d6066) },
    { part: s.sand, material: sand },
    { part: s.slate, material: finish('stpauls-slate', 0x7b7a7c) },
    { part: s.win, material: PALETTE.window },
    { part: s.door, material: finish('stpauls-door', 0x5b4636) },
  ]
}

if (import.meta.main) {
  await saveLods('melbourne-st-pauls-cathedral', "St Paul's Cathedral", layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid on the ground; bearing 340',
    bearing: 340, height: 95,
  }, 5000)
}
