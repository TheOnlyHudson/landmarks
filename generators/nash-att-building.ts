/**
 * AT&T Building ("Batman Building"; 333 Commerce Street), Nashville
 * (1994, Earl Swensson Associates) — original procedural geometry, CC0-1.0.
 * bun generators/nash-att-building.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/130910785
 * (36.1621131, -86.7770979). Bearing 17.4°: the tower's long axis, fitted to
 * the lidar footprint above 90 m (107.4°, i.e. 17.4° + 90), so the broad
 * faces look 17.4° and 197.4° (Commerce Street side and Broadway side) and
 * the spires stand at the east-north-east and west-south-west ends.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the two "Batman ear" spires: a block on each end of the crown slab, three
 *   chamfered stages stepping in, and a mast to 188 m;
 * - the pale crown slab spanning the full width between them, pierced over
 *   the glass by a wide, flat arch that shows the sky (with the globe sign
 *   drawn as a flat disc over the arch's crown);
 * - on both broad faces, a glass prow: a 24 m curtain-wall front with seven
 *   pale fins, its sides angled back, roofed by one steep glass slope that
 *   rises from 116.5 m at the face to the slab at 141 m ("the mask");
 * - the stepped rose-granite shoulders on each side, three tiers stepping
 *   down toward the prow (121.6, 109.2, 96.6 m), windows grouped as broad
 *   panels three storeys tall per ~4 m bay, granite piers and spandrels
 *   between (the real punched windows are single-storey);
 * - the slab's ends running down the full height of the end faces as a pale
 *   pier with a glazed slot; the red granite base and podium with its glass
 *   winter-garden gable and two glass pyramids on the south.
 *
 * Evidence
 * - OSM: outline way/130910785 (height 188 m, 33 levels, wikidata
 *   Q298562); tower part way/465454851; the spire parts way/1307887852 and
 *   way/1307887853 (170 m, which is the spire shafts' base area, not their
 *   tops); the slab part way/1311381715; podium parts way/591973495,
 *   way/591983690, way/1311381711-714, used as drawn for the podium plan.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 1 m grid. Heights
 *   are taken above the lowest ground under the footprint (the east side, on
 *   2nd Ave; ~1.8 m above the box's ground_min, which is in the street
 *   toward the river). Measured: tower top 184 m (mast tips are too thin
 *   for lidar; 188 m is published/OSM), spire bodies ~178 m, slab and upper
 *   band 152-156.5 m, gable slope 116.5 -> 141 m, shoulders 121.6 / 109.2 /
 *   96.6 m, podium deck 19.6 m, south entry block 24.2 m, winter garden ridge
 *   ~31 m. Plan: faces at ±19.5 m, ends at ±31 m, shoulder steps at ±14.5,
 *   ±9.75 and ±4.2 m across, all measured from the lidar footprint, which
 *   sits ~2 m off OSM's outline; the tower is centred on the lidar.
 * - Published: 188 m / 617 ft to the spire tips, 33 storeys, completed 1994
 *   (Wikipedia, "AT&T Building (Nashville)").
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   333 Commerce Street (formerly AT&T Building) - Nashville, TN.jpg, Quintin
 *     Soloviev, CC BY 4.0 (south face, square-on: used to scale the slab,
 *     arch, spire stages and prow widths);
 *   AT&T Building Nashville, TN.jpg, Lchader, CC BY-SA 4.0 (crown, south-east);
 *   Batman Building Bright.jpg and Batman Dark.jpg, Louis Chader, CC BY-SA 4.0;
 *   Att building nashville.jpg, Kaldari, CC0 (south-west, base and podium);
 *   Roof of the Ryman Auditorium and the new AT&T Building ... .tif, Carol M.
 *     Highsmith, public domain (from the south-west);
 *   AT&T Building Nashville from Broadway and 5th.jpg, EvanSheppard, CC0;
 *   AT&T building, Nashville, Tennessee, Aug 17.jpg, An Errant Knight, CC BY-SA 4.0;
 *   AT&T Building- June 2022.jpg, Jschnake, CC BY-SA 4.0;
 *   Nashville from Cumberland River September 2026 005.jpg, King of Hearts,
 *     CC BY-SA 4.0 (the east end, the only clear end-on view);
 *   AT&T Building, Commerce Street and 3rd Avenue ... (54385436310).jpg,
 *     Warren LeMay, CC BY-SA 2.0 (podium deck and winter garden);
 *   Nashville, TN at night27.jpg, dconvertini, CC BY-SA 2.0 (night).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: rose-tan granite, pale
 *   warm grey-beige crown (a step lighter than the granite), arch soffit
 *   in the darker roof grey, blue curtain wall, darker grey-blue sloped glass, red
 *   granite base.
 * - Night: office glazing glows (window); the sloped glass, atrium and
 *   pyramids stay dark (glass); the spires and top of the slab are
 *   floodlit (dconvertini's photo shows them washed in light, in colours that
 *   change with events), the slab below more faintly (_FLOODLIGHT).
 *
 * Estimated: the arch's springing and apex (141.5 / 147 m) and the spire
 * stage heights and widths, scaled from Soloviev's square-on photo (spire
 * stages drawn ~10% wider and the masts several times thicker than real so
 * they read at phone size); the number of fins; the base's 14 m height and
 * lobby glazing; the winter garden's span; the globe's size.
 * Left out: the AT&T lettering, mullions, the crown's window-washing crane,
 * the fine vertical slots in the shoulders' corners.
 * Doubts: the north (Commerce St) face is assumed identical to the south one,
 * as lidar shows the tower symmetric and photos from the north-east show the
 * same prow; the west end has no clear end-on photo and mirrors the east.
 * The globe sign may since have come down with the renaming to 333
 * Commerce; it is kept as in every photo used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// ---------- materials ----------
const granite = new Part()   // rose-tan granite of the stepped shoulders
const crown = new Part()     // pale grey stone/metal of the crown slab, spires, fins
const win = new Part()       // curtain wall and punched windows (glow at night)
const glass = new Part()     // the sloped glass roofs, atrium and pyramids (dark at night)
const roof = new Part()      // terraces and podium deck
const red = new Part()       // red granite base and podium

// ---------- helpers ----------
const at = (p: XY, z: number): V3 => [p[0], p[1], z]

/** A planar convex polygon, wound to face `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const [a, b, c] = pts
  const n = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const p = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}

/** Outward normal of the edge a→b of a counter-clockwise ring. */
const outN = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}

/** A wall over the edge a→b of a counter-clockwise ring. */
function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}

/** Ear clipping for a simple counter-clockwise ring. */
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function cap(part: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    if (up) part.tri(at(r[a], z), at(r[b], z), at(r[c], z))
    else part.tri(at(r[a], z), at(r[c], z), at(r[b], z))
  }
}
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Walls of a whole ring from z0 to z1 (ground-touching walls cut into ≤5 m pieces, for the terrain drape). */
function ringWalls(part: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = z0 <= 0 ? Math.max(1, Math.ceil(L / 5)) : 1
    for (let k = 0; k < n; k++) {
      const p: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const q: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      wall(part, p, q, z0, z1)
    }
  }
}

/**
 * Window panels on the wall a→b (counter-clockwise ring, so the outside is
 * to the right): `bays` across, in storey groups `rows`, standing just proud.
 */
function panels(a: XY, b: XY, rows: [number, number][], bayW = 3.2, pier = 1.0, s0 = 0, s1 = 1, part = win) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) * (s1 - s0)
  if (L < pier + 1.2) return
  const n = outN(a, b), t: XY = [(b[0] - a[0]), (b[1] - a[1])]
  const bays = Math.max(1, Math.round(L / bayW)), bay = L / bays, Lt = Math.hypot(t[0], t[1])
  const u: XY = [t[0] / Lt, t[1] / Lt], start: XY = [a[0] + t[0] * s0, a[1] + t[1] * s0]
  for (const [z0, z1] of rows) for (let k = 0; k < bays; k++) {
    const p: XY = [start[0] + u[0] * (k * bay + pier / 2) + n[0] * 0.05, start[1] + u[1] * (k * bay + pier / 2) + n[1] * 0.05]
    const q: XY = [start[0] + u[0] * ((k + 1) * bay - pier / 2) + n[0] * 0.05, start[1] + u[1] * ((k + 1) * bay - pier / 2) + n[1] * 0.05]
    wall(part, p, q, z0, z1)
  }
}

/** Storey groups between z0 and z1, three storeys (~3.8 m each) a band: GROUP-tall bands counted from the shaft's base, SPANDREL between. */
const BASE = 14, GROUP = 11.4, SPANDREL = 2.4
function rows(z0: number, z1: number): [number, number][] {
  const out: [number, number][] = []
  for (let g = 0; BASE + g * GROUP < z1; g++) {
    const lo = Math.max(BASE + g * GROUP + SPANDREL / 2, z0 + 0.8), hi = Math.min(BASE + (g + 1) * GROUP - SPANDREL / 2, z1 - 1.2)
    if (hi - lo > 2.5) out.push([lo, hi])
  }
  return out
}

/** An octagonal prism (a square of half-width h with chamfered corners) at c, z0→z1, with a top. */
function octo(part: Part, c: XY, hx: number, hy: number, ch: number, z0: number, z1: number, top = true) {
  const r: XY[] = [
    [hx - ch, -hy], [hx, -hy + ch], [hx, hy - ch], [hx - ch, hy],
    [-hx + ch, hy], [-hx, hy - ch], [-hx, -hy + ch], [-hx + ch, -hy],
  ].map(([x, y]) => [c[0] + x, c[1] + y] as XY)
  // ring above is counter-clockwise starting at the south-east
  ringWalls(part, r, z0, z1)
  if (top) cap(part, r, z1)
  return r
}

// ---------- the tower ----------
// Tower-local frame (u along the long axis, toward the east spire; v
// across, toward Commerce Street), centred on the lidar footprint.
const TX = 1.6, TY = 34.5
const T = (u: number, v: number): XY => [TX + u, TY + v]
const Tz = (u: number, v: number, z: number): V3 => [TX + u, TY + v, z]

// Heights in metres above the lowest ground under the footprint
// (lidar minus 1.8 m: see header).
const Z_A = 96.6, Z_B = 109.2, Z_C = 121.6     // the three shoulder steps
const Z_SLOPE_F = 116.5, Z_SLOPE_B = 141.0     // the glass gable: front edge, back (at the slab)
const Z_SLAB = 152.3, Z_BAND = 156.5           // crown slab front face; its upper band
const HOLE = 16, Z_JAMB = 142, Z_APEX = 147    // the arched opening through the slab
const SPIRE_U = 27.25

// Plan: the faces at v = ±19.5, the ends at u = ±31, the corners cut back in
// three steps that are the shoulder tiers.
const V_FACE = 19.5, U_END = 31, SLAB_V = 4.2
const PROW_F = 12                                // half-width of the glass front face
const px = (v: number) => PROW_F + (V_FACE - v) * ((26 - PROW_F) / (V_FACE - SLAB_V)) // the prow's side, at v
const slopeZ = (v: number) => Z_SLOPE_F + (V_FACE - v) * ((Z_SLOPE_B - Z_SLOPE_F) / (V_FACE - SLAB_V))

// Shoulder tiers in the north-east quadrant, counter-clockwise, with the
// edges that face outward listed by index.
const TIER_A: XY[] = [[px(14.5), 14.5], [21.5, 14.5], [21, 16.8], [18, V_FACE], [PROW_F, V_FACE]]
const TIER_B: XY[] = [[px(9.75), 9.75], [27.5, 9.75], [26.8, 12], [24.5, 14.5], [px(14.5), 14.5]]
const TIER_C: XY[] = [[px(SLAB_V), SLAB_V], [U_END, SLAB_V], [U_END, 7.75], [29, 9.75], [px(9.75), 9.75]]

/** The four mirror images of a quadrant ring, each counter-clockwise. */
function quads(r: XY[]): XY[][] {
  return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => {
    const m = r.map(([u, v]) => [u * sx, v * sy] as XY)
    return sx * sy < 0 ? m.reverse() : m
  })
}

/** A shoulder tier: its four mirrored blocks, walls only on the outward edges, windows per `outward`. */
type Spans = [number, number, number][]
function tier(ring: XY[], top: number, outward: (a: XY, b: XY) => Spans | null) {
  for (const r of quads(ring)) {
    const w = r.map(([u, v]) => T(u, v))
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const rs = outward(a, b)
      if (!rs) continue
      wall(granite, w[i], w[(i + 1) % r.length], BASE, top)
      for (const [s0, s1, from] of rs) panels(w[i], w[(i + 1) % r.length], rows(from, top), 4.2, 1.5, s0, s1)
    }
    cap(roof, w, top)
  }
}

// Each outward edge of a tier: which share of it gets windows from which
// height (the inner part of a step's face is hidden behind the lower step
// in front of it, up to that step's top).
const same = (a: XY, b: XY, p: XY, q: XY) => Math.abs(Math.abs(a[0]) - Math.abs(p[0])) < 1e-6 && Math.abs(Math.abs(a[1]) - Math.abs(p[1])) < 1e-6 && Math.abs(Math.abs(b[0]) - Math.abs(q[0])) < 1e-6 && Math.abs(Math.abs(b[1]) - Math.abs(q[1])) < 1e-6
function edgesOf(ring: XY[], spec: { i: number; parts: Spans }[]) {
  return (a: XY, b: XY): Spans | null => {
    for (const { i, parts } of spec) {
      const p = ring[i], q = ring[(i + 1) % ring.length]
      if (same(a, b, p, q)) return parts
      if (same(a, b, q, p)) return parts.map(([s0, s1, z]) => [1 - s1, 1 - s0, z] as [number, number, number])
    }
    return null
  }
}
{
  // A: three outward edges, windowed full height.
  tier(TIER_A, Z_A, edgesOf(TIER_A, [1, 2, 3].map((i) => ({ i, parts: [[0, 1, BASE]] as Spans }))))
  // B: the face along v = 14.5 is hidden behind A where A stands in front of it.
  const bLen = 24.5 - px(14.5), bOpen = (24.5 - 21.5) / bLen
  tier(TIER_B, Z_B, edgesOf(TIER_B, [
    { i: 1, parts: [[0, 1, BASE]] }, { i: 2, parts: [[0, 1, BASE]] },
    { i: 3, parts: [[0, bOpen, BASE], [bOpen, 1, Z_A]] },
  ]))
  const cLen = 29 - px(9.75), cOpen = (29 - 27.5) / cLen
  tier(TIER_C, Z_C, edgesOf(TIER_C, [
    { i: 1, parts: [[0, 1, BASE]] }, { i: 2, parts: [[0, 1, BASE]] },
    { i: 3, parts: [[0, cOpen, BASE], [cOpen, 1, Z_B]] },
  ]))
}

// The glass prows on the two broad faces: a trapezoid in plan (the front
// face 24 m wide, the sides angled back to the crown's full width), roofed
// by one steep glass slope rising to the slab. Seven pale fins on the front.
for (const s of [1, -1]) {
  const f0 = Tz(-PROW_F * s, V_FACE * s, BASE), f1 = Tz(PROW_F * s, V_FACE * s, BASE)
  const F0 = Tz(-PROW_F * s, V_FACE * s, Z_SLOPE_F), F1 = Tz(PROW_F * s, V_FACE * s, Z_SLOPE_F)
  const b0 = Tz(-26 * s, SLAB_V * s, BASE), b1 = Tz(26 * s, SLAB_V * s, BASE)
  const B0 = Tz(-26 * s, SLAB_V * s, Z_SLOPE_B), B1 = Tz(26 * s, SLAB_V * s, Z_SLOPE_B)
  poly(win, [f0, f1, F1, F0], [0, s, 0])
  const side = (bb: V3, ff: V3, BB: V3, FF: V3, hint: number) => {
    const d: XY = [ff[0] - bb[0], ff[1] - bb[1]], l = Math.hypot(d[0], d[1])
    poly(glass, [bb, ff, FF, BB], [hint * Math.abs(d[1]) / l, s * Math.abs(d[0]) / l, 0])
  }
  side(b1, f1, B1, F1, s)
  side(b0, f0, B0, F0, -s)
  poly(glass, [F0, F1, B1, B0], [0, s, 1])
  // a pale gutter lip along the slope's foot
  poly(crown, [Tz(-PROW_F * s, (V_FACE + 0.3) * s, Z_SLOPE_F - 0.9), Tz(PROW_F * s, (V_FACE + 0.3) * s, Z_SLOPE_F - 0.9), Tz(PROW_F * s, (V_FACE + 0.3) * s, Z_SLOPE_F + 0.1), Tz(-PROW_F * s, (V_FACE + 0.3) * s, Z_SLOPE_F + 0.1)], [0, s, 0])
  poly(crown, [Tz(-PROW_F * s, (V_FACE + 0.3) * s, Z_SLOPE_F + 0.1), Tz(PROW_F * s, (V_FACE + 0.3) * s, Z_SLOPE_F + 0.1), Tz(PROW_F * s, V_FACE * s, Z_SLOPE_F + 0.1), Tz(-PROW_F * s, V_FACE * s, Z_SLOPE_F + 0.1)], [0, 0, 1])
  // fins
  for (let k = -3; k <= 3; k++) {
    const u = k * 3.25, w = 0.28, d = 0.45, zt = Z_SLOPE_F - 3.2
    const v0 = V_FACE * s, v1 = (V_FACE + d) * s
    poly(crown, [Tz(u - w, v1, BASE), Tz(u + w, v1, BASE), Tz(u + w, v1, zt), Tz(u - w, v1, zt)], [0, s, 0])
    poly(crown, [Tz(u - w, v0, BASE), Tz(u - w, v1, BASE), Tz(u - w, v1, zt), Tz(u - w, v0, zt)], [-1, 0, 0])
    poly(crown, [Tz(u + w, v0, BASE), Tz(u + w, v1, BASE), Tz(u + w, v1, zt), Tz(u + w, v0, zt)], [1, 0, 0])
    poly(crown, [Tz(u - w, v0, zt), Tz(u + w, v0, zt), Tz(u + w, v1, zt), Tz(u - w, v1, zt)], [0, 0, 1])
  }
}

// ---------- the crown slab ----------
// A pale slab 8.4 m thick through the whole tower from end to end. Its ends
// show down the full height of the tower's end faces as a pale pier with a
// glazed slot; above the shoulders it is the crown's frame, pierced over the
// glass gable by a broad, flat arch (sky shows through it), and carries the
// two stepped spires at its ends.
{
  const U = U_END, V = SLAB_V
  // lower box, BASE→Z_SLOPE_B: its faces show where the gable doesn't cover them
  for (const s of [1, -1]) {
    poly(crown, [Tz(-U, V * s, BASE), Tz(U, V * s, BASE), Tz(U, V * s, Z_SLOPE_B), Tz(-U, V * s, Z_SLOPE_B)], [0, s, 0])
  }
  // the ends, full height to the slab top, with a slot of window groups
  for (const e of [1, -1]) {
    poly(crown, [Tz(U * e, -V, BASE), Tz(U * e, V, BASE), Tz(U * e, V, Z_SLAB), Tz(U * e, -V, Z_SLAB)], [e, 0, 0])
    for (const [z0, z1] of rows(BASE, Z_C)) {
      poly(win, [Tz((U + 0.05) * e, -1.1, z0), Tz((U + 0.05) * e, 1.1, z0), Tz((U + 0.05) * e, 1.1, z1), Tz((U + 0.05) * e, -1.1, z1)], [e, 0, 0])
    }
  }
  // upper slab Z_SLOPE_B → Z_SLAB, front and back faces with the arch cut out
  const R = (HOLE * HOLE + (Z_APEX - Z_JAMB) ** 2) / (2 * (Z_APEX - Z_JAMB))
  const arc = (u: number) => Z_APEX - (R - Math.sqrt(R * R - u * u))
  const N = 10, us = Array.from({ length: N + 1 }, (_, i) => -HOLE + 2 * HOLE * i / N)
  for (const s of [1, -1]) {
    const v = V * s, h: V3 = [0, s, 0]
    poly(crown, [Tz(-U, v, Z_SLOPE_B), Tz(-HOLE, v, Z_SLOPE_B), Tz(-HOLE, v, Z_SLAB), Tz(-U, v, Z_SLAB)], h)
    poly(crown, [Tz(HOLE, v, Z_SLOPE_B), Tz(U, v, Z_SLOPE_B), Tz(U, v, Z_SLAB), Tz(HOLE, v, Z_SLAB)], h)
    for (let i = 0; i < N; i++) {
      const a = us[i], b = us[i + 1]
      poly(crown, [Tz(a, v, i === 0 ? Z_JAMB : arc(a)), Tz(b, v, i === N - 1 ? Z_JAMB : arc(b)), Tz(b, v, Z_SLAB), Tz(a, v, Z_SLAB)], h)
    }
  }
  // the opening's jambs, soffit and floor
  for (const e of [1, -1]) poly(roof, [Tz(HOLE * e, -V, Z_SLOPE_B), Tz(HOLE * e, V, Z_SLOPE_B), Tz(HOLE * e, V, Z_JAMB), Tz(HOLE * e, -V, Z_JAMB)], [-e, 0, 0])
  for (let i = 0; i < N; i++) {
    const a = us[i], b = us[i + 1], za = i === 0 ? Z_JAMB : arc(a), zb = i === N - 1 ? Z_JAMB : arc(b)
    const mu = (a + b) / 2
    poly(roof, [Tz(a, -V, za), Tz(b, -V, zb), Tz(b, V, zb), Tz(a, V, za)], [mu / R, 0, -1])
  }
  poly(roof, [Tz(-HOLE, -V, Z_SLOPE_B), Tz(HOLE, -V, Z_SLOPE_B), Tz(HOLE, V, Z_SLOPE_B), Tz(-HOLE, V, Z_SLOPE_B)], [0, 0, 1])
  // the slab's top: a ledge, then the recessed upper band between the spires
  const VB = 3.5, UB = SPIRE_U - 3.75
  poly(roof, [Tz(-U, -V, Z_SLAB), Tz(U, -V, Z_SLAB), Tz(U, V, Z_SLAB), Tz(-U, V, Z_SLAB)], [0, 0, 1])
  for (const s of [1, -1]) poly(crown, [Tz(-UB, VB * s, Z_SLAB), Tz(UB, VB * s, Z_SLAB), Tz(UB, VB * s, Z_BAND), Tz(-UB, VB * s, Z_BAND)], [0, s, 0])
  poly(roof, [Tz(-UB, -VB, Z_BAND), Tz(UB, -VB, Z_BAND), Tz(UB, VB, Z_BAND), Tz(-UB, VB, Z_BAND)], [0, 0, 1])
  // the globe sign over the arch's crown: a flat disc on each face
  for (const s of [1, -1]) {
    const c: V3 = [0, (V + 0.35) * s, 148.6], r = 3.2, n = 16
    for (let i = 0; i < n; i++) {
      const a0 = i / n * 2 * Math.PI, a1 = (i + 1) / n * 2 * Math.PI
      poly(glass, [Tz(c[0], c[1], c[2]), Tz(r * Math.cos(a0), c[1], c[2] + r * Math.sin(a0)), Tz(r * Math.cos(a1), c[1], c[2] + r * Math.sin(a1))], [0, s, 0])
    }
  }
}

// ---------- the spires ("Batman ears") ----------
// Each stands on the slab's end: a block the slab's full thickness, then
// three chamfered stages stepping in, and a mast.
for (const e of [1, -1]) {
  const c = T(SPIRE_U * e, 0)
  octo(crown, c, 3.75, SLAB_V, 0.6, Z_SLAB, Z_BAND)
  octo(crown, c, 2.7, 2.7, 0.7, Z_BAND, 160.7)
  octo(crown, c, 2.05, 2.05, 0.55, 160.7, 167)
  octo(crown, c, 1.4, 1.4, 0.4, 167, 178.2)
  // the mast, tapering to its tip
  const r = octo(crown, c, 0.55, 0.55, 0.16, 178.2, 186.5, false)
  r.forEach((p, i) => crown.tri(at(p, 186.5), at(r[(i + 1) % r.length], 186.5), [c[0], c[1], 188]))
}

// ---------- the base: red granite, 0 → BASE, under the whole tower plan ----------
{
  const q: XY[] = [[0, -V_FACE], [18, -V_FACE], [21, -16.8], [21.5, -14.5], [24.5, -14.5], [26.8, -12], [27.5, -9.75], [29, -9.75], [U_END, -7.75]]
  const half = [...q, ...q.slice().reverse().map(([u, v]) => [u, -v] as XY)]
  const ring = [...half, ...half.slice().reverse().map(([u, v]) => [-u, v] as XY)]
  // drop repeated points
  const r = ring.filter((p, i) => { const n = ring[(i + 1) % ring.length]; return Math.hypot(p[0] - n[0], p[1] - n[1]) > 1e-6 })
  const w = ccw(r.map(([u, v]) => T(u, v)))
  ringWalls(red, w, 0, BASE)
  // lobby glazing
  for (let i = 0; i < w.length; i++) panels(w[i], w[(i + 1) % w.length], [[1.2, BASE - 3]], 4.5, 1.6)
}

// ---------- the podium ----------
// OSM's building:parts, read in this frame; heights from lidar.
const DECK: XY[] = ccw([[-11.92, 16.09], [-12.8, 3.16], [-13.67, -6.54], [-20.06, -12.74], [-13.49, -19.05], [-34.62, -42.06], [-13.5, -63.68], [-10.32, -60.35], [-3.44, -67.17], [29.6, -33.36], [16.15, -19.4], [22.45, -13.07], [16.49, -6.84], [16.67, 2.94], [16.9, 16.02]])
const ENTRY: XY[] = ccw([[-13.49, -19.05], [-10.7, -19.16], [-8.67, -21.35], [-8.63, -27.85], [-2.84, -33.43], [5.4, -33.45], [11.64, -27.54], [11.65, -21.36], [13.49, -19.53], [16.15, -19.4], [10.19, -12.95], [-7.32, -13.0]])
const PYR_W: XY[] = ccw([[-13.67, -6.54], [-20.06, -12.74], [-13.49, -19.05], [-7.32, -13.0]])
const PYR_E: XY[] = ccw([[10.19, -12.95], [16.15, -19.4], [22.45, -13.07], [16.49, -6.84]])
const Z_DECK = 19.6, Z_ENTRY = 24.2, Z_EAVE = 20.4, Z_RIDGE = 31.0, Z_PYR = 30.6
ringWalls(red, DECK, 0, Z_DECK)
cap(roof, DECK, Z_DECK)
ringWalls(red, ENTRY, Z_DECK, Z_ENTRY)
cap(roof, ENTRY, Z_ENTRY)
for (const p of [PYR_W, PYR_E]) {
  const c: XY = [p.reduce((s, q) => s + q[0], 0) / 4, p.reduce((s, q) => s + q[1], 0) / 4]
  ringWalls(red, p, Z_DECK, Z_ENTRY)
  p.forEach((a, i) => { const b = p[(i + 1) % 4]; glass.tri(at(a, Z_ENTRY), at(b, Z_ENTRY), [c[0], c[1], Z_PYR]) })
}
// the winter garden: a glass gable running from the tower out over the deck
{
  const x0 = -12.4, x1 = 16.6, xr = 2.1, y0 = -13, y1 = TY - V_FACE + 0.5
  poly(glass, [[x0, y0, Z_EAVE], [xr, y0, Z_RIDGE], [xr, y1, Z_RIDGE], [x0, y1, Z_EAVE]], [-1, 0, 1])
  poly(glass, [[xr, y0, Z_RIDGE], [x1, y0, Z_EAVE], [x1, y1, Z_EAVE], [xr, y1, Z_RIDGE]], [1, 0, 1])
  poly(glass, [[x0, y0, Z_EAVE], [x1, y0, Z_EAVE], [xr, y0, Z_RIDGE]], [0, -1, 0])
  for (const [x, n] of [[x0, -1], [x1, 1]] as [number, number][]) poly(red, [[x, y0, Z_DECK], [x, y1, Z_DECK], [x, y1, Z_EAVE], [x, y0, Z_EAVE]], [n, 0, 0])
  poly(red, [[x0, y0, Z_DECK], [x1, y0, Z_DECK], [x1, y0, Z_EAVE], [x0, y0, Z_EAVE]], [0, -1, 0])
}

// ---------- write ----------
// Floodlights: the spires and the top of the slab are washed in light after
// dark (Convertini's night photo); the slab's end piers less so.
const floodlit = (p: V3, n: V3) => (p[2] > 150 ? 1 : p[2] > Z_C ? 0.55 : 0.25) * (n[2] > 0.7 ? 0.3 : 1)
const parts = [
  { part: granite, material: finish('att-granite', 0xdcc4b5) },
  { part: crown, material: { ...finish('att-crown', 0xd8d1c4), floodlight: floodlit } },
  { part: win, material: { ...PALETTE.window, color: 0x5e7b9c } },
  { part: glass, material: { ...PALETTE.glass, color: 0x5f6e8a } },
  { part: roof, material: PALETTE.roof },
  { part: red, material: finish('att-red-granite', 0xb7826f) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('AT&T Building', parts, {
  license: 'CC0-1.0', bearing: 17.4, elevation: 0, height: 188,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/130910785', 'way/465454851', 'way/1307887852', 'way/1307887853', 'way/1311381715', 'way/591973495', 'way/591983690', 'way/1311381711', 'way/1311381712', 'way/1311381713', 'way/1311381714'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/nash-att-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
