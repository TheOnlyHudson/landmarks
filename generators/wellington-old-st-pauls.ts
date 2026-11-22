/**
 * Old St Paul's, Mulgrave Street, Thorndon, Wellington: procedural, CC0-1.0.
 * bun generators/wellington-old-st-pauls.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 2.7
 * (the outline's long edges run 2-3 degrees clockwise of east-west). Origin
 * at the area centroid of OSM way/47116383 (174.7803725, -41.2762601); the
 * plan below is written about (174.7804, -41.2763) and shifted by (+2.3,
 * -4.4) on output. y = 0 is the churchyard.
 *
 * Frederick Thatcher's timber Gothic Revival parish church, consecrated
 * 1866, enlarged with aisles and transepts to 1876; board-and-batten walls
 * painted white, steep slate roofs. The liturgical west front faces
 * Mulgrave Street (OSM's street lies 20 m west of the front): from north to
 * south, the north aisle's small gable with its round window and door, the
 * tower with its gabled porch and broach spire, the nave's steep gable with
 * the two-light window and rose over the polygonal baptistery (its roof of
 * red-brown corrugated iron), and the south aisle's small gable. The north
 * aisle carries three cross gables (o4); the south aisle a plain roof
 * (o6); transepts with twin tall lancets; the chancel ends in a polygonal
 * apse with five lancets (o7, interior); a low vestry block to the north-east.
 *
 * OSM: way/47116383 (no height, no parts). The front's widths come from it:
 * south aisle gable y -4.2..1.1, baptistery bay to x -21 at y 2.2..5.2,
 * tower front x -21.1 at y 6.4..11.1, north aisle gable y 11..13.9 at
 * x -19.2. The east half (x -5..16) is read from it loosely: transepts
 * reaching y -10.4 and 18, the apse's polygon at x 11..15, the vestry.
 *
 * Photo-scaled (o5, the west front near head-on; 72 px/m from the south
 * gable's 5.3 m OSM width): small gables' eaves 3.9, apex 8.1; nave eaves
 * 6.0, ridge 11.0 (a 60 degree gable over a 5.7 m nave); west window
 * 2.1 x 3.3 m from 4.1 m; baptistery eaves 2.6, roof 3.8, doors 1.4 x 2.4.
 * Tower (o5, o9): square 4.7 m, lower stage to 6.8 m, a hipped ledge to
 * 7.6, an octagonal belfry r 1.75 with lancet louvres to 10.2, a flared
 * octagonal spire to 17.5 and the cross to 18.6 (o9 scaled by the belfry's
 * 3.6 m width; estimated, no published height).
 * Estimated: the east half's walls and ridges (by analogy with the nave,
 * o4), the transept and apse windows, the vestry, the aisle bays (four),
 * the buttresses (the tower's boxed corners in o9; light timber buttresses
 * between the north aisle's cross gables in o4).
 * Left out: the copper ridge flashings, gutters and downpipes, the lych
 * gate, the ironwork crosses on the small gables (kept on the spire).
 *
 * Lead review round 1 (against o5): walls raised (nave eaves 7.2, aisles
 * 4.6, transepts 5.0 on a 6 m span, chancel 6.7), every roof a 60 degree pitch on a
 * narrower span with 0.15 m overhangs; the tower's lower stage to 8.0 m, a
 * taller white belfry (8.8-11.6) and a spire cut to 11.5-16.0 m with the
 * cross to 17.1 (the lead asked for a spire near the belfry's height; o9
 * shows the real one somewhat taller, so 16 m is a compromise); the
 * baptistery's iron roof grey (o5).
 * Round 2: transepts lowered to 3.2 m eaves on a 4.2 m span (ridge 6.8, below
 * the front gables' apexes) so the west gables stand clear; spire back to
 * 11.5-18.5 m (2.5x the belfry, as o9 shows), cross to 19.6.
 * Colours: white paint (o5 overcast #cfcfce; white, not grey) -> 0xf1eee6;
 * slate (o5 #838280 roof, #8c90a1 spire) -> 0x80848d; corrugated iron
 * (o5 grey; o3 #7d6360 in shade) -> 0x8a8d92; doors (o3 #4e362d) -> 0x6b4f40.
 *
 * Night: the windows glow (`window`); the church is lit from below only
 * weakly, so the walls carry a light floodlight wash at the west front.
 *
 * LODs: the low model has every mass, the spire and belfry, the pointed
 * windows as panels with a raised surround, the west window's tracery,
 * doors and porch. The detail model adds the vertical battens of the
 * board-and-batten walls, hood moulds, the belfry louvre slats, the
 * buttresses' offsets, rounder spire flare and the spire cross.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - o3 "Old St Paul's church, Wellington, 2016-01-25-7.jpg", Szilas, public domain
 * - o4 "Old St Paul's 2 (31400107880).jpg", Tony Hisgett, CC BY 2.0
 * - o5 "Old St Paul's 3 (31772383835).jpg", Tony Hisgett, CC BY 2.0
 * - o6 "Old St Paul's church, Wellington, 2011-02-06.jpg (5943136295).jpg", Bruce Tuten, CC BY 2.0
 * - o7 "Old St. Paul's, Wellington 6249.jpg", Bruce Tuten, CC BY 2.0 (interior: apse, aisles)
 * - o9 "Old St Paul's 1 (31656344101).jpg", Tony Hisgett, CC BY 2.0
 * No look-only references. No photo shows the east end from outside; it is
 * the least certain part.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, tube, face, box, prism, loftRings, arch, saveLods, type XY, type Layer } from './sydney-tower-eye'
import { polyTris } from './berlin-oberbaum-bridge'

type Set = { white: Part; slate: Part; win: Part; brown: Part; iron: Part }
const mk = (): Set => ({ white: new Part(), slate: new Part(), win: new Part(), brown: new Part(), iron: new Part() })

/** A wall frame: a->b along the wall, outside on the right; W(s, z, d) with d outward. */
function frame(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const W = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, u, n, W, N: [n[0], n[1], 0] as V3 }
}

/** A flat shape [s, z] on a wall, `d` proud. */
function flush(p: Part, a: XY, b: XY, shape: XY[], d: number) {
  const f = frame(a, b)
  for (const [q, r, t] of polyTris(shape)) face(p, [f.W(q[0], q[1], d), f.W(r[0], r[1], d), f.W(t[0], t[1], d)], f.N)
}

/** A raised ring (surround) between an outer and inner shape, `d` proud, with its outer edge returned to the wall. */
function ring(p: Part, a: XY, b: XY, outer: XY[], inner: XY[], d: number) {
  const f = frame(a, b)
  for (const [q, r, t] of polyTris(outer, [inner])) face(p, [f.W(q[0], q[1], d), f.W(r[0], r[1], d), f.W(t[0], t[1], d)], f.N)
  const cs = outer.reduce((s, q) => s + q[0], 0) / outer.length, cz = outer.reduce((s, q) => s + q[1], 0) / outer.length
  for (let i = 0; i < outer.length; i++) {
    const q = outer[i], r = outer[(i + 1) % outer.length]
    let ns = r[1] - q[1], nz = -(r[0] - q[0])
    if (ns * ((q[0] + r[0]) / 2 - cs) + nz * ((q[1] + r[1]) / 2 - cz) < 0) { ns = -ns; nz = -nz }
    face(p, [f.W(q[0], q[1], 0), f.W(r[0], r[1], 0), f.W(r[0], r[1], d), f.W(q[0], q[1], d)], [f.u[0] * ns, f.u[1] * ns, nz])
  }
}

/** A pointed (or round) window: glass panel flush, a white surround, optional mullions. */
function lancet(s: Set, a: XY, b: XY, sc: number, w: number, z0: number, h: number, o: { pointed?: boolean; lights?: number; rose?: boolean; det: boolean }) {
  const pointed = o.pointed ?? true
  const spring = z0 + h - (pointed ? w * Math.sqrt(3) / 2 : w / 2)
  const inner = arch(sc - w / 2, sc + w / 2, z0, spring, pointed, o.det ? 10 : 6)
  const bw = 0.16
  const outer = arch(sc - w / 2 - bw, sc + w / 2 + bw, z0 - bw, spring, pointed, o.det ? 10 : 6)
  flush(s.win, a, b, inner, 0.03)
  ring(s.white, a, b, outer, inner, o.det ? 0.14 : 0.1)
  const lights = o.lights ?? 1
  if (lights > 1) {
    // mullions up to the springing, then the rose in the head
    for (let i = 1; i < lights; i++) {
      const x = sc - w / 2 + (w * i) / lights
      flush(s.white, a, b, [[x - 0.08, z0], [x + 0.08, z0], [x + 0.08, spring + (o.rose ? 0.1 : w * 0.3)], [x - 0.08, spring + (o.rose ? 0.1 : w * 0.3)]], 0.08)
    }
    if (o.rose) {
      // a round rose in the head over the two lights
      const rc: XY = [sc, spring + w * 0.48], rr = w * 0.26
      const circ = (r: number) => Array.from({ length: o.det ? 16 : 10 }, (_, i) => { const t = (i / (o.det ? 16 : 10)) * Math.PI * 2; return [rc[0] + r * Math.cos(t), rc[1] + r * Math.sin(t)] as XY })
      ring(s.white, a, b, circ(rr + 0.12), circ(rr), 0.08)
      // a transom under the rose
      flush(s.white, a, b, [[sc - w / 2, spring + 0.05], [sc + w / 2, spring + 0.05], [sc + w / 2, spring + 0.2], [sc - w / 2, spring + 0.2]], 0.08)
    }
  }
}

/** A round window with a triangle in it (the small gables' trefoil-in-circle, read as a plain ring + triangle). */
function roundel(s: Set, a: XY, b: XY, sc: number, zc: number, r: number, det: boolean) {
  const n = det ? 16 : 10
  const circ = (rr: number) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [sc + rr * Math.cos(t), zc + rr * Math.sin(t)] as XY })
  flush(s.win, a, b, circ(r), 0.03)
  ring(s.white, a, b, circ(r + 0.2), circ(r), det ? 0.14 : 0.1)
  if (det) {
    const tr: XY[] = [0, 1, 2].map((k) => { const t = -Math.PI / 2 + (k * 2 * Math.PI) / 3; return [sc + r * 0.85 * Math.cos(t), zc + r * 0.85 * Math.sin(t)] })
    const ti: XY[] = tr.map(([x, z]) => [sc + (x - sc) * 0.72, zc + (z - zc) * 0.72])
    ring(s.white, a, b, tr, ti, 0.07)
  }
}

/** A door: leaves in brown, a white frame; pointed head optional. */
function door(s: Set, a: XY, b: XY, sc: number, w: number, z0: number, h: number, pointed = false) {
  const shape = pointed ? arch(sc - w / 2, sc + w / 2, z0, z0 + h - w * Math.sqrt(3) / 2, true, 6) : ([[sc - w / 2, z0], [sc + w / 2, z0], [sc + w / 2, z0 + h], [sc - w / 2, z0 + h]] as XY[])
  flush(s.brown, a, b, shape, 0.04)
  const o = pointed ? arch(sc - w / 2 - 0.15, sc + w / 2 + 0.15, z0, z0 + h - w * Math.sqrt(3) / 2, true, 6) : ([[sc - w / 2 - 0.15, z0], [sc + w / 2 + 0.15, z0], [sc + w / 2 + 0.15, z0 + h + 0.15], [sc - w / 2 - 0.15, z0 + h + 0.15]] as XY[])
  ring(s.white, a, b, o, shape, 0.1)
}

/**
 * A gabled house: axis from p0 along unit u for length L, half-width hw,
 * eaves ze, ridge zr; walls white, roof slate (0.18 thick, overhangs ov at
 * eaves and gables). `gable0`/`gable1` false leaves that end's gable wall out
 * (where it meets a taller mass).
 */
function house(s: Set, p0: XY, u: XY, L: number, hw: number, ze: number, zr: number, o: { ov?: number; gable0?: boolean; gable1?: boolean; roof?: Part; z0?: number; batten?: boolean } = {}) {
  const ov = o.ov ?? 0.15, z0 = o.z0 ?? 0, v: XY = [-u[1], u[0]], roof = o.roof ?? s.slate
  const P = (t: number, w: number, z: number): V3 => [p0[0] + u[0] * t + v[0] * w, p0[1] + u[1] * t + v[1] * w, z]
  // side walls
  face(s.white, [P(0, -hw, z0), P(L, -hw, z0), P(L, -hw, ze), P(0, -hw, ze)], [-v[0], -v[1], 0])
  face(s.white, [P(L, hw, z0), P(0, hw, z0), P(0, hw, ze), P(L, hw, ze)], [v[0], v[1], 0])
  // end walls with their gables
  if (o.gable0 !== false) face(s.white, [P(0, hw, z0), P(0, -hw, z0), P(0, -hw, ze), P(0, 0, zr), P(0, hw, ze)], [-u[0], -u[1], 0])
  if (o.gable1 !== false) face(s.white, [P(L, -hw, z0), P(L, hw, z0), P(L, hw, ze), P(L, 0, zr), P(L, -hw, ze)], [u[0], u[1], 0])
  // roof slabs
  const slope = (zr - ze) / hw, th = 0.18
  const zAt = (w: number) => zr - slope * Math.abs(w)
  const e = hw + ov, ze2 = zAt(e)
  for (const sg of [-1, 1]) {
    const t0 = o.gable0 === false ? 0 : -ov, t1 = o.gable1 === false ? L : L + ov
    const A = P(t0, 0, zr + th), B = P(t1, 0, zr + th), C = P(t1, sg * e, ze2 + th), D = P(t0, sg * e, ze2 + th)
    const nn: V3 = [v[0] * sg * slope, v[1] * sg * slope, 1]
    face(roof, [A, B, C, D], nn)
    const A2 = P(t0, 0, zr), B2 = P(t1, 0, zr), C2 = P(t1, sg * e, ze2), D2 = P(t0, sg * e, ze2)
    face(roof, [A2, B2, C2, D2], [-nn[0], -nn[1], -1])
    face(roof, [D2, C2, C, D], [v[0] * sg, v[1] * sg, 0])
    face(roof, [A2, D2, D, A], [-u[0], -u[1], 0])
    face(roof, [B2, B, C, C2], [u[0], u[1], 0])
  }
  // bargeboards: a white edge under each gable verge
  for (const [t, on] of [[-ov * 0.5, o.gable0 !== false], [L + ov * 0.5, o.gable1 !== false]] as [number, boolean][]) {
    if (!on) continue
    for (const sg of [-1, 1]) {
      const a = P(t, 0, zr - 0.05), b = P(t, sg * e, ze2 - 0.05)
      const a2 = P(t, 0, zr - 0.4), b2 = P(t, sg * e, ze2 - 0.4)
      face(s.white, [a2, b2, b, a], [u[0] * (t < 0 ? -1 : 1), u[1] * (t < 0 ? -1 : 1), 0])
      face(s.white, [a, b, b2, a2], [u[0] * (t < 0 ? 1 : -1), u[1] * (t < 0 ? 1 : -1), 0])
    }
  }
  return P
}

/** Vertical battens on a wall rectangle (detail only). */
function battens(p: Part, a: XY, b: XY, z0: number, z1: number | ((s: number) => number), step = 0.6) {
  const f = frame(a, b)
  for (let sv = step / 2; sv < f.L - 0.1; sv += step) {
    const zt = typeof z1 === 'number' ? z1 : z1(sv)
    if (zt - z0 < 0.4) continue
    const w = 0.06, d = 0.05
    face(p, [f.W(sv - w, z0, d), f.W(sv + w, z0, d), f.W(sv + w, zt, d), f.W(sv - w, zt, d)], f.N)
    face(p, [f.W(sv - w, z0, 0), f.W(sv - w, z0, d), f.W(sv - w, zt, d), f.W(sv - w, zt, 0)], [-f.u[0], -f.u[1], 0])
    face(p, [f.W(sv + w, z0, d), f.W(sv + w, z0, 0), f.W(sv + w, zt, 0), f.W(sv + w, zt, d)], [f.u[0], f.u[1], 0])
  }
}

// ---- Plan (about 174.7804, -41.2763) --------------------------------------------------------------------------

const E: XY = [1, 0], N: XY = [0, 1], S: XY = [0, -1]
const NAVE_Y = 3.75, NAVE_HW = 2.85, NAVE_X0 = -18.9, NAVE_X1 = -3.5, NAVE_E = 7.2, NAVE_R = 12.1
const SA_Y0 = -4.3, SA_Y1 = 0.9, AISLE_E = 4.6, AISLE_R = 9.1
const NA_Y0 = 6.6, NA_Y1 = 13.9
const TW: [number, number, number, number] = [-21.1, -16.4, 6.4, 11.1] // tower x0, x1, y0, y1
const TR_X0 = -2.6, TR_X1 = 1.6, TR_Y0 = -9.8, TR_Y1 = 17.6 // transepts and crossing
const CH_X0 = 2.5, CH_X1 = 11.5, CH_HW = 2.85

const low = mk(), det = mk()
for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // Nave: from the west wall to the crossing.
  house(s, [NAVE_X0, NAVE_Y], E, NAVE_X1 - NAVE_X0 + 0.3, NAVE_HW, NAVE_E, NAVE_R, { ov: 0.35 })
  // West window: two lights and a rose, over the baptistery.
  const wa: XY = [NAVE_X0, NAVE_Y + NAVE_HW], wb: XY = [NAVE_X0, NAVE_Y - NAVE_HW] // west face, outside to the west
  lancet(s, wa, wb, NAVE_HW, 2.1, 4.4, 4.0, { lights: 2, rose: true, det: d })

  // Baptistery: a polygonal lean-to bay on the west front, corrugated iron roof.
  {
    const c: XY = [NAVE_X0, NAVE_Y], ry = NAVE_HW - 0.05, rx = 2.1, n = 6
    const pts: XY[] = Array.from({ length: n + 1 }, (_, i) => { const t = Math.PI / 2 + (i / n) * Math.PI; return [c[0] + rx * Math.cos(t) * 1.1, c[1] + ry * Math.sin(t)] as XY })
    pts[0] = [c[0], c[1] + ry]; pts[n] = [c[0], c[1] - ry]
    for (let i = 1; i < n; i++) pts[i] = [Math.max(c[0] - rx, pts[i][0]), pts[i][1]]
    // walls
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[i + 1]
      const f = frame(a, b)
      face(s.white, [f.W(0, 0), f.W(f.L, 0), f.W(f.L, 2.6), f.W(0, 2.6)], f.N)
      if (i >= 1 && i <= 4) for (const k of i === 2 || i === 3 ? [0.3, 0.55] : [0.5]) {
        const sc = f.L * k
        flush(s.win, a, b, arch(sc - 0.17, sc + 0.17, 1.6, 2.15, true, 4), 0.03)
      }
      if (d) battens(s.white, a, b, 0, 1.4, 0.5)
    }
    // a low hipped roof of corrugated iron against the nave wall
    const o = 0.3, ze = 2.45, zt = 3.85
    const out = (q: XY): V3 => { const dx = q[0] - c[0], dy = q[1] - c[1], l = Math.hypot(dx / rx, dy / ry) || 1; return [q[0] + (dx / (l * rx)) * o * 0 + (dx === 0 && dy === 0 ? 0 : (dx / Math.hypot(dx, dy)) * o), q[1] + (dy / Math.hypot(dx, dy)) * o, ze] }
    const top = (q: XY): V3 => [c[0] - 0.02, Math.max(c[1] - ry + 1.0, Math.min(c[1] + ry - 1.0, q[1])), zt]
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[i + 1], A = out(a), B = out(b), TA = top(a), TB = top(b)
      const nn: V3 = [(a[0] + b[0]) / 2 - c[0] - 0.01, ((a[1] + b[1]) / 2 - c[1]) * 0.4, 2]
      if (Math.hypot(TA[1] - TB[1], 0) < 1e-3) { face(s.iron, [A, B, TA], nn); face(s.iron, [A, TA, B], [-nn[0], -nn[1], -nn[2]]) }
      else { face(s.iron, [A, B, TB, TA], nn); face(s.iron, [A, TA, TB, B], [-nn[0], -nn[1], -nn[2]]) }
    }
  }

  // South aisle: own gable roof, ridge east-west; small west gable with roundel and door.
  {
    const hw = (SA_Y1 - SA_Y0) / 2, cy = (SA_Y0 + SA_Y1) / 2, x0 = -19.9
    house(s, [x0, cy], E, TR_X0 - x0, hw, AISLE_E, AISLE_R, { gable1: false })
    const fa: XY = [x0, SA_Y1], fb: XY = [x0, SA_Y0]
    roundel(s, fa, fb, hw, 6.0, 0.55, d)
    door(s, fa, fb, hw, 1.4, 0.15, 2.4)
    // side lancets (o6), four bays
    const sa: XY = [x0, SA_Y0], sb: XY = [TR_X0, SA_Y0]
    for (const sc of [3.6, 6.9, 10.2, 13.0]) lancet(s, sa, sb, sc, 0.55, 1.3, 1.9, { det: d })
    door(s, sa, sb, 8.5, 1.3, 0.15, 2.3)
    if (d) {
      battens(s.white, sa, sb, 0.2, AISLE_E - 0.05)
      battens(s.white, fa, fb, 0.2, (sv) => Math.min(AISLE_R - 0.1, AISLE_E + ((AISLE_R - AISLE_E) / hw) * (hw - Math.abs(sv - hw))) - 0.1)
    }
  }

  // North aisle: lean-to from the nave, with three cross gables to the north; its west porch gable.
  {
    const x0 = TW[1], x1 = TR_X0, ze = AISLE_E
    // the lean-to body
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    face(s.white, [P(x1, NA_Y1, 0), P(x0, NA_Y1, 0), P(x0, NA_Y1, ze), P(x1, NA_Y1, ze)], [0, 1, 0])
    face(s.white, [P(x0, NA_Y1, 0), P(x0, NAVE_Y + NAVE_HW, 0), P(x0, NAVE_Y + NAVE_HW, NAVE_E - 0.4), P(x0, NA_Y1, ze)], [-1, 0, 0])
    const ov = 0.35, th = 0.18
    const yi = NAVE_Y + NAVE_HW, slope = (NAVE_E - 0.4 - ze) / (NA_Y1 - yi)
    const zAt = (y: number) => NAVE_E - 0.4 - slope * (y - yi)
    face(s.slate, [P(x0 - 0.1, yi, zAt(yi) + th), P(x1, yi, zAt(yi) + th), P(x1, NA_Y1 + ov, zAt(NA_Y1 + ov) + th), P(x0 - 0.1, NA_Y1 + ov, zAt(NA_Y1 + ov) + th)], [0, slope, 1])
    face(s.slate, [P(x0 - 0.1, yi, zAt(yi)), P(x0 - 0.1, NA_Y1 + ov, zAt(NA_Y1 + ov)), P(x1, NA_Y1 + ov, zAt(NA_Y1 + ov)), P(x1, yi, zAt(yi))], [0, -slope, -1])
    face(s.slate, [P(x0 - 0.1, NA_Y1 + ov, zAt(NA_Y1 + ov)), P(x1, NA_Y1 + ov, zAt(NA_Y1 + ov)), P(x1, NA_Y1 + ov, zAt(NA_Y1 + ov) + th), P(x0 - 0.1, NA_Y1 + ov, zAt(NA_Y1 + ov) + th)], [0, 1, 0])
    face(s.slate, [P(x0 - 0.1, yi, zAt(yi)), P(x0 - 0.1, yi, zAt(yi) + th), P(x0 - 0.1, NA_Y1 + ov, zAt(NA_Y1 + ov) + th), P(x0 - 0.1, NA_Y1 + ov, zAt(NA_Y1 + ov))], [-1, 0, 0])
    // three cross gables, ridge north-south, gable to the north (o4)
    const bays = [-12.6, -9.0, -5.4]
    for (const cx of bays) {
      const hw = 1.45
      house(s, [cx, NA_Y1 + 0.02], S, NA_Y1 - yi - 1.0, hw, ze, ze + 2.5, { gable1: false, ov: 0.12 })
      lancet(s, [cx + hw, NA_Y1 + 0.02], [cx - hw, NA_Y1 + 0.02], hw, 0.7, 1.4, 2.9, { det: d })
    }
    // light timber buttresses between the bays (o4)
    for (const bx of [-14.4, -10.8, -7.2]) {
      box(s.white, [bx, NA_Y1 + 0.3], 0.22, 0.3, 0, 2.6, 0, { top: false })
      loftRings(s.white, [[[bx - 0.22, NA_Y1, 2.6], [bx + 0.22, NA_Y1, 2.6], [bx + 0.22, NA_Y1 + 0.6, 2.6], [bx - 0.22, NA_Y1 + 0.6, 2.6]], [[bx - 0.22, NA_Y1, 3.3], [bx + 0.22, NA_Y1, 3.3], [bx + 0.22, NA_Y1 + 0.05, 3.3], [bx - 0.22, NA_Y1 + 0.05, 3.3]]])
    }
    // the west porch gable beyond the tower (y 11.1..13.9)
    const hw = (NA_Y1 - TW[3]) / 2, cy = (NA_Y1 + TW[3]) / 2, px = -19.2
    house(s, [px, cy], E, x0 - px + 0.5, hw, AISLE_E - 0.3, AISLE_E + 2.1, { gable1: false, ov: 0.12 })
    const fa: XY = [px, NA_Y1], fb: XY = [px, TW[3]]
    roundel(s, fa, fb, hw, 4.6, 0.45, d)
    door(s, fa, fb, hw, 1.2, 0.15, 2.3)
    if (d) battens(s.white, [x1, NA_Y1], [x0, NA_Y1], 0.2, ze - 0.05)
  }

  // Tower: lower stage with boxed corners, a porch, a hipped ledge, octagonal belfry, broach spire.
  {
    const [x0, x1, y0, y1] = TW, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = (x1 - x0) / 2
    box(s.white, [cx, cy], hw, hw, 0, 8.0)
    // boxed corners (buttress offsets) to 3.2 m with sloped heads
    for (const [sx, sy] of [[-1, -1], [-1, 1], [1, 1], [1, -1]]) {
      const bx = cx + sx * (hw - 0.25), by = cy + sy * (hw - 0.25)
      box(s.white, [bx + sx * 0.12, by + sy * 0.12], 0.4, 0.4, 0, 3.2, 0, { top: false })
      loftRings(s.white, [
        [[bx + sx * 0.12 - 0.4, by + sy * 0.12 - 0.4, 3.2], [bx + sx * 0.12 + 0.4, by + sy * 0.12 - 0.4, 3.2], [bx + sx * 0.12 + 0.4, by + sy * 0.12 + 0.4, 3.2], [bx + sx * 0.12 - 0.4, by + sy * 0.12 + 0.4, 3.2]],
        [[bx - 0.28, by - 0.28, 3.9], [bx + 0.28, by - 0.28, 3.9], [bx + 0.28, by + 0.28, 3.9], [bx - 0.28, by + 0.28, 3.9]],
      ], { top: true })
    }
    // cornice and the hipped ledge
    box(s.white, [cx, cy], hw + 0.25, hw + 0.25, 8.0, 8.3)
    loftRings(s.slate, [
      [[x0 - 0.3, y0 - 0.3, 8.3], [x1 + 0.3, y0 - 0.3, 8.3], [x1 + 0.3, y1 + 0.3, 8.3], [x0 - 0.3, y1 + 0.3, 8.3]],
      [[cx - 1.9, cy - 1.9, 9.0], [cx + 1.9, cy - 1.9, 9.0], [cx + 1.9, cy + 1.9, 9.0], [cx - 1.9, cy + 1.9, 9.0]],
    ])
    // octagonal belfry
    const R8 = 1.75 / Math.cos(Math.PI / 8)
    lathe(s.white, [cx, cy], [[R8, 8.8], [R8, 11.6]], 8, { phase: Math.PI / 8 })
    for (let k = 0; k < 8; k++) {
      const t0 = Math.PI / 8 + (k * Math.PI) / 4, t1 = t0 + Math.PI / 4
      const a: XY = [cx + R8 * Math.cos(t0), cy + R8 * Math.sin(t0)], b: XY = [cx + R8 * Math.cos(t1), cy + R8 * Math.sin(t1)]
      const f = frame(a, b) // outside on the right of a->b round an anticlockwise ring
      const sc = f.L / 2
      if (k % 2 === 1) {
        // lancet louvres on the cardinal faces
        flush(s.brown, a, b, arch(sc - 0.36, sc + 0.36, 9.3, 10.7, true, 6), 0.03)
        ring(s.white, a, b, arch(sc - 0.48, sc + 0.48, 9.2, 10.7, true, 6), arch(sc - 0.36, sc + 0.36, 9.3, 10.7, true, 6), 0.1)
        if (d) for (let z = 9.5; z < 11.0; z += 0.22) flush(s.white, a, b, [[sc - 0.3, z], [sc + 0.3, z], [sc + 0.3, z + 0.06], [sc - 0.3, z + 0.06]], 0.06)
      } else {
        // small trefoil roundels on the diagonals (o5)
        const n = d ? 10 : 6
        const circ = (r: number) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [sc + r * Math.cos(t), 10.4 + r * Math.sin(t)] as XY })
        flush(s.brown, a, b, circ(0.25), 0.03)
        ring(s.white, a, b, circ(0.37), circ(0.25), 0.08)
      }
    }
    // spire: a flared octagon, slate, from the belfry eaves to 17.5 m
    const n8 = 8
    const ringAt = (r: number, z: number): V3[] => Array.from({ length: n8 }, (_, i) => { const t = Math.PI / 8 + (i / n8) * Math.PI * 2; return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] as V3 })
    loftRings(s.slate, d
      ? [ringAt(R8 + 0.5, 11.5), ringAt(R8 + 0.05, 12.1), ringAt(R8 - 0.4, 12.9), ringAt(0.95, 14.8), ringAt(0.5, 16.7), ringAt(0.1, 18.3), ringAt(0.01, 18.5)]
      : [ringAt(R8 + 0.5, 11.5), ringAt(R8 - 0.25, 12.5), ringAt(0.95, 14.8), ringAt(0.01, 18.5)], { bottom: true })
    // finial and cross
    tube(s.brown, [[cx, cy, 18.3], [cx, cy, 19.6]], d ? 0.07 : 0.1, d ? 6 : 4, true)
    if (d) tube(s.brown, [[cx - 0.35, cy, 19.15], [cx + 0.35, cy, 19.15]], 0.06, 6, true)
    else tube(s.brown, [[cx - 0.4, cy, 19.15], [cx + 0.4, cy, 19.15]], 0.09, 4, true)
    // west face: roundel high, the porch below (o5, o9)
    const fa: XY = [x0, y1], fb: XY = [x0, y0]
    const tf = frame(fa, fb)
    if (d) {
      // the pierced frieze panel under the cornice
      ring(s.white, fa, fb, [[0.6, 6.9], [tf.L - 0.6, 6.9], [tf.L - 0.6, 7.45], [0.6, 7.45]], [[0.75, 7.0], [tf.L - 0.75, 7.0], [tf.L - 0.75, 7.35], [0.75, 7.35]], 0.08)
    }
    // the roundel high on the tower's south face, beside the nave gable (o5)
    roundel(s, [x0, y0], [x1, y0], hw, 4.6, 0.4, d)
    // porch: a small gabled hood on the west face with a pointed door
    house(s, [x0 + 0.02, cy], [-1, 0], 1.2, 1.25, 2.9, 4.6, { gable1: true, gable0: false, ov: 0.15 })
    door(s, [x0 - 1.18, y1 - 1.1], [x0 - 1.18, y0 + 1.1], (y1 - y0 - 2.2) / 2, 1.5, 0.05, 2.7, true)
    if (d) {
      battens(s.white, fa, fb, 0.2, 7.95, 0.55)
      battens(s.white, [x1, y1], [x0, y1], 0.2, 7.95, 0.55)
    }
  }

  // Transepts and crossing: ridge north-south at the nave's height; twin lancets in each end.
  {
    const cx = (TR_X0 + TR_X1) / 2, hw = (TR_X1 - TR_X0) / 2
    house(s, [cx, TR_Y0], N, TR_Y1 - TR_Y0, hw, 3.2, 3.2 + hw * 1.73)
    for (const [a, b] of [[[TR_X0, TR_Y1], [TR_X1, TR_Y1]], [[TR_X1, TR_Y0], [TR_X0, TR_Y0]]] as [XY, XY][]) {
      for (const sc of [hw - 0.5, hw + 0.5]) lancet(s, a, b, sc, 0.5, 1.0, 2.4, { det: d })
      roundel(s, a, b, hw, 4.6, 0.3, d)
      if (d) battens(s.white, a, b, 0.2, (sv) => Math.min(3.1 + hw * 1.73, 3.2 + 1.73 * (hw - Math.abs(sv - hw))) - 0.15)
    }
    // the south transept's porch door (plan bump at x -7..-5.6)
    door(s, [TR_X0, TR_Y0 + 3.2], [TR_X0, TR_Y0 + 0.2], 1.5, 1.2, 0.15, 2.2)
  }

  // Chancel with a polygonal apse (o7: five lancets).
  {
    house(s, [CH_X0 - 0.2, NAVE_Y], E, CH_X1 - CH_X0 + 0.2, CH_HW, NAVE_E - 0.5, NAVE_E - 0.5 + CH_HW * 1.73, { gable1: false })
    // apse: half an octagon of walls, a hipped roof
    const c: XY = [CH_X1, NAVE_Y], n = 4, R = CH_HW / Math.cos(Math.PI / 8)
    const pts: XY[] = Array.from({ length: n + 1 }, (_, i) => { const t = -Math.PI / 2 + (i / n) * Math.PI; return [c[0] + CH_HW * 1.0 * Math.cos(t) * (i === 0 || i === n ? 1 : R / CH_HW), c[1] + CH_HW * Math.sin(t) * (i === 0 || i === n ? 1 : R / CH_HW)] as XY })
    pts[0] = [c[0], c[1] - CH_HW]; pts[n] = [c[0], c[1] + CH_HW]
    const ze = NAVE_E - 0.5, zr = NAVE_E - 0.5 + CH_HW * 1.73
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[i + 1], f = frame(a, b)
      face(s.white, [f.W(0, 0), f.W(f.L, 0), f.W(f.L, ze), f.W(0, ze)], f.N)
      lancet(s, a, b, f.L / 2, 0.6, 2.0, 2.8, { det: d })
      if (i === 1 || i === 2) lancet(s, a, b, f.L / 2 + (i === 1 ? -0.9 : 0.9), 0.5, 2.0, 2.5, { det: d })
      const o = 0.35
      const ao: V3 = [c[0] + (a[0] - c[0]) * (1 + o / CH_HW), c[1] + (a[1] - c[1]) * (1 + o / CH_HW), ze - 0.2]
      const bo: V3 = [c[0] + (b[0] - c[0]) * (1 + o / CH_HW), c[1] + (b[1] - c[1]) * (1 + o / CH_HW), ze - 0.2]
      const apex: V3 = [c[0], c[1], zr]
      face(s.slate, [ao, bo, apex], [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 1.2])
      face(s.slate, [ao, apex, bo], [-((a[0] + b[0]) / 2 - c[0]), -((a[1] + b[1]) / 2 - c[1]), -1.2])
    }
  }

  // Vestry to the north-east and the south-east chapel: low gabled blocks.
  house(s, [CH_X0 + 1.4, 11.4], E, 15.1 - CH_X0 - 1.4, 2.4, 3.8, 3.8 + 2.4 * 1.73)
  door(s, [15.1, 14.3], [15.1, 8.5], 2.9, 1.2, 0.15, 2.2)
  house(s, [CH_X0, -3.5], E, 13.9 - CH_X0, 2.4, 3.8, 3.8 + 2.4 * 1.73, { gable0: false })
  lancet(s, [13.9, -0.6], [13.9, -6.4], 2.9, 0.55, 1.3, 1.8, { det: d })

  // Nave clerestory side: the south wall above the aisle roof stays plain; the north is under the lean-to.
  if (d) {
    battens(s.white, [NAVE_X0, NAVE_Y + NAVE_HW], [NAVE_X0, NAVE_Y - NAVE_HW], 2.7, (sv) => Math.min(NAVE_R - 0.15, NAVE_E + ((NAVE_R - NAVE_E) / NAVE_HW) * (NAVE_HW - Math.abs(sv - NAVE_HW))) - 0.15)
  }
}

// ---- Output --------------------------------------------------------------------------------------------

function move(p: Part) {
  // plan coordinates are about (174.7804, -41.2763); the anchor is the centroid at plan (-2.3, 4.4)
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += 2.3; p.pos[i + 2] += 4.4 }
}
for (const s of [low, det]) for (const p of Object.values(s)) move(p)

const frontLit = (p: V3, n: V3) => (n[0] < -0.5 ? 0.5 : 0.15)
const layers = (s: Set): Layer[] => [
  { part: s.white, material: { ...finish('painted-weatherboard', 0xf1eee6), floodlight: frontLit } },
  { part: s.slate, material: finish('slate', 0x80848d) },
  { part: s.win, material: PALETTE.window },
  { part: s.brown, material: finish('door-timber', 0x6b4f40) },
  { part: s.iron, material: finish('corrugated-iron', 0x8a8d92) },
]

if (import.meta.main) {
  await saveLods('wellington-old-st-pauls', "Old St Paul's", layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, churchyard level; turned to bearing 2.7',
    bearing: 2.7, height: 19.6,
  })
}
