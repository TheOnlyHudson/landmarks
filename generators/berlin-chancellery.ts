/**
 * Federal Chancellery (Bundeskanzleramt), Berlin (Axel Schultes and
 * Charlotte Frank, 1997-2001): original procedural geometry, CC0-1.0.
 * bun generators/berlin-chancellery.ts
 * Imports the facade kit from berlin-reichstag.ts (merge that first) and
 * exports `earcut` and `prism` (used by berlin-haus-der-kulturen.ts).
 *
 * Map frame, BEARING 0 (the wings run due east-west in OSM): +y north,
 * +x east, z up, metres. Origin = the area centroid of OSM way/157390075
 * (13.368749, 52.520084); the generator works in the frame of the OSM
 * fetch (centred on 13.36913, 52.52019) and shifts by (25.80, 11.77).
 * z = 0 is the lowest ground under the footprint (Mapterhorn: 0.8 m above
 * the Spree, by the south wing's west end); the Ehrenhof on the east is
 * about 3 m higher, so the east ends sink into it.
 *
 * What makes it the Chancellery, and how each is drawn
 * - The white "Leitungsgebaeude" cube (36 m): its east and west fronts
 *   framed by the side walls and the thin white roof plate (2.2 m, 9 m
 *   deep), its two front corners cut away in big quarter circles (8 m)
 *   that the sky shows through; under it the dark glass front behind the
 *   tall free-standing stone slabs (twelve a front, wide and narrow), a dark floor band at
 *   17.3 m.
 * - Its north and south faces: plain white walls with the huge segmental
 *   arch of glass (40.6 m chord, 10.9 m rise) over the wings' roofs and the
 *   glazed strip under its centre; mullion bands in the detail model.
 * - The two long administrative wings (18 m) north and south, with their
 *   two-storey square "winter garden" windows, the light courts by the
 *   cube, the open court of honour between them on the east, and the south
 *   wing's west end at the Spree: an open loggia whose end wall has the
 *   great circular opening.
 *
 * Sources
 * - OSM way/157390075 (outline, wikidata Q317027), the cube way/157390074
 *   (36 m, 9 levels), the wings way/435048342 and way/435048343 (18 m,
 *   5 levels). (c) OpenStreetMap contributors, ODbL.
 * - Mapterhorn terrain (bun tools/terrain.ts grid): 0.8-4.1 m above the
 *   river under the buildings.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Bundeskanzleramt - Berlin - Deutschland - Germany - 04.jpg", Norbert
 *     Nagel, CC BY-SA 3.0 (the east front frontal: canopy, quarter-circle
 *     openings, piers and drums; scaled by the 54.8 m width),
 *     https://commons.wikimedia.org/wiki/File:Bundeskanzleramt_-_Berlin_-_Deutschland_-_Germany_-_04.jpg
 *   "Bundeskanzleramt - Berlin - Deutschland - Germany - 07.jpg", Norbert
 *     Nagel, CC BY-SA 3.0 (the north face frontal: the arch window,
 *     13.3 px/m),
 *     https://commons.wikimedia.org/wiki/File:Bundeskanzleramt_-_Berlin_-_Deutschland_-_Germany_-_07.jpg
 *   "Bundeskanzleramt - Berlin - Deutschland - Germany - 05.jpg", "- 06",
 *     "- 03", Norbert Nagel, CC BY-SA 3.0 (the wings and the cube from the
 *     north and south across the meadow);
 *   "Bundeskanzleramt 2015.jpg", Perituss, CC0 (east front);
 *   "Cancillería Federal, Berlín, Alemania, 2016-04-21, DD 37-39 HDR.JPG",
 *     Diego Delso, CC BY-SA 4.0 (east front at dusk, night lighting),
 *     https://commons.wikimedia.org/wiki/File:Canciller%C3%ADa_Federal,_Berl%C3%ADn,_Alemania,_2016-04-21,_DD_37-39_HDR.JPG
 *   "Bundeskanzleramt (Berlin)0508.JPG", MaryG90, CC BY-SA 3.0, and
 *     "Berlin German Chancellery building Bundeskanzleramt
 *     (15249115614).jpg", Reinhard Link, CC BY-SA 2.0 (the west end on the
 *     Spree: the loggia and its circular opening),
 *     https://commons.wikimedia.org/wiki/File:Berlin_German_Chancellery_building_Bundeskanzleramt_(15249115614).jpg
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: every plan line, the heights 36 and 18.
 * - Estimated from Nagel "- 04": side walls 3.3 m, canopy underside 30.0 m,
 *   the quarter circles 5 m; pier and drum positions; the dark band
 *   17.3-19.5 m.
 * - Estimated from Nagel "- 07": the arch's springing 22.5 m and apex
 *   33.4 m, the glazed strip 14.5 m wide.
 * - Estimated: the wing windows (5.2 x 5 m squares, two rows, 8 m pitch),
 *   the loggia (12 m deep, circle 13 m across at 9.5 m).
 * - Left out: the bridge over the Spree beyond the loggia (the triangle at
 *   the outline's west tip), which would put the model's base on the
 *   river; the roof gardens' planting.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, face, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { LOW, HIGH, type Q } from './london-albert-memorial'
import { welded, ringLoft, ccw, faceOf, fpanel, flen, type XY } from './berlin-kit'

export const BEARING = 0
const SHIFT: XY = [25.8, 11.77]

/** Triangulate a simple polygon (ear clipping); returns index triples. */
export function earcut(r: XY[]): [number, number, number][] {
  const pts = ccw(r), idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) >= 0 && cr(b, c, p) >= 0 && cr(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = pts[i0], b = pts[i1], c = pts[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(pts[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out.map(([a, b, c]) => [r.indexOf(pts[a]), r.indexOf(pts[b]), r.indexOf(pts[c])])
}

/** A prism over a simple polygon: walls into `wall`, top (and optional bottom) into `top`. */
export function prism(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bottom?: Part) {
  const c = ccw(r)
  ringLoft(wall, c, z0, z1)
  for (const [a, b, d] of earcut(c)) {
    if (top) top.tri([c[a][0], c[a][1], z1], [c[b][0], c[b][1], z1], [c[d][0], c[d][1], z1])
    if (bottom) bottom.tri([c[a][0], c[a][1], z0], [c[d][0], c[d][1], z0], [c[b][0], c[b][1], z0])
  }
}

// The plan (OSM fetch frame, before the shift).
const CUBE = { x0: -27.8, x1: 27.7, y0: -30.2, y1: 24.6 }
const NORTH_WING: XY[] = [[27.6, 24.6], [-27.9, 24.5], [-100.3, 24.4], [-76.0, 47.4], [-27.5, 47.5], [-27.5, 31.6], [-17.9, 31.6], [-18.0, 47.4], [18.0, 47.4], [18.0, 31.6], [27.8, 31.6], [27.8, 46.7], [104.9, 46.8], [104.9, 31.6], [102.2, 31.6], [102.2, 24.6]]
const LOGGIA_X = -175.0, END_X = -187.4
const SOUTH_WING: XY[] = [[LOGGIA_X, -53.9], [-28.3, -53.5], [-28.3, -37.7], [-16.9, -37.7], [-16.9, -54.0], [18.1, -53.9], [18.1, -38.7], [27.4, -38.7], [27.4, -54.1], [105.3, -54.0], [105.3, -37.0], [103.4, -37.0], [103.4, -30.2], [27.7, -30.2], [-27.8, -30.2], [LOGGIA_X, -30.3]]

export function build(Q: Q) {
  const conc = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part()
  const D = Q.detail
  const H = 36.0, WH = 18.0

  // ===== The wings ===========================================================
  for (const ring of [NORTH_WING, SOUTH_WING]) {
    prism(conc, roof, ring, 0, WH)
    // Parapet line (trim) and the winter-garden windows on every long face.
    const c = ccw(ring)
    for (let i = 0; i < c.length; i++) {
      const f = faceOf(c[i], c[(i + 1) % c.length]), L = flen(f)
      fpanel(trim, f, 0, L, WH - 0.6, WH, 0.05)
      if (L < 12) continue
      // Tall glazed winter-garden bays between broad plain walls, every ~18 m.
      const n = Math.max(1, Math.round((L - 6) / 18)), pitch = L / n
      for (let k = 0; k < n; k++) {
        const s = (k + 0.5) * pitch
        fpanel(win, f, s - 4.4, s + 4.4, 2.5, 16.6, 0.06)
        if (D) for (const z of [7.2, 11.9]) fpanel(trim, f, s - 4.4, s + 4.4, z - 0.12, z + 0.12, 0.09)
        if (D) for (const ds of [-9, 9]) if (s + ds > 4 && s + ds < L - 4) for (const [z0, z1] of [[4.2, 6.0], [8.0, 9.8], [11.8, 13.6]]) fpanel(win, f, s + ds - 0.7, s + ds + 0.7, z0, z1, 0.05)
      }
    }
  }
  // The loggia at the south wing's west end: roof on columns, the end wall with its circular opening.
  {
    const y0 = -53.9, y1 = -30.3, ym = (y0 + y1) / 2, R = 6.5, zc = 9.5, T = 1.4
    box(conc, END_X, y0, LOGGIA_X, y1, WH - 1.4, WH, true)
    conc.quad([END_X, y0, WH - 1.4], [END_X, y1, WH - 1.4], [LOGGIA_X, y1, WH - 1.4], [LOGGIA_X, y0, WH - 1.4])
    for (const y of [y0 + 0.6, y1 - 0.6]) for (const x of [-183.0, -179.0]) lathe(conc, [[0.45, 0], [0.45, WH - 1.4]], D ? 12 : 6, x, y, false)
    // End wall: a slab with a round hole, drawn as a ring of quads out to the slab's edge.
    const m = D ? 32 : 16
    const edge = (a: number): [number, number] => {
      // The slab's outline point in direction a from the circle's centre.
      const cy = Math.cos(a), cz = Math.sin(a)
      const ty = cy > 0 ? (y1 - ym) / cy : cy < 0 ? (y0 - ym) / cy : Infinity
      const tz = cz > 0 ? (WH - 1.4 - zc) / cz : cz < 0 ? (0 - zc) / cz : Infinity
      const t = Math.min(ty, tz)
      return [ym + cy * t, zc + cz * t]
    }
    for (let i = 0; i < m; i++) {
      const a0 = i * TAU / m, a1 = (i + 1) * TAU / m
      const p = (a: number, x: number, r: number | null): V3 => {
        if (r === null) { const [y, z] = edge(a); return [x, y, z] }
        return [x, ym + r * Math.cos(a), zc + r * Math.sin(a)]
      }
      for (const [x, out] of [[END_X, -1], [END_X + T, 1]] as [number, number][]) {
        face(conc, p(a0, x, R), p(a1, x, R), p(a1, x, null), p(a0, x, null), [x - out, ym, zc])
      }
      face(conc, p(a0, END_X, R), p(a0, END_X + T, R), p(a1, END_X + T, R), p(a1, END_X, R), [END_X + T / 2, ym + 2 * R * Math.cos((a0 + a1) / 2), zc + 2 * R * Math.sin((a0 + a1) / 2)])
    }
    for (const y of [y0, y1]) face(conc, [END_X, y, 0], [END_X + T, y, 0], [END_X + T, y, WH - 1.4], [END_X, y, WH - 1.4], [END_X + T / 2, ym, 8])
  }

  // ===== The cube ===========================================================
  const { x0, x1, y0, y1 } = CUBE, yc = (y0 + y1) / 2, hy = (y1 - y0) / 2
  const SW = 3.3, XG = 5.0 // side walls' thickness, glass set back from the front
  // North and south walls with the segmental arch window, above the wings.
  {
    const chord = 40.6, zs = 22.5, za = 33.4, rise = za - zs, R = (chord * chord / 4 + rise * rise) / (2 * rise), zO = za - R
    const m = D ? 24 : 12
    const arcZ = (x: number) => zO + Math.sqrt(Math.max(0, R * R - x * x))
    const strip = 7.2
    for (const s of [-1, 1]) {
      const y = s > 0 ? y1 : y0, out = s
      const P = (x: number, z: number, d = 0): V3 => [x, y + out * d, z]
      const ins: V3 = [0, yc, 20]
      // Wall above the arch, in vertical slices, and beside it down to the wing roof.
      const xs = Array.from({ length: m + 1 }, (_, k) => -chord / 2 + chord * k / m)
      for (let k = 0; k < m; k++) face(conc, P(xs[k], arcZ(xs[k])), P(xs[k + 1], arcZ(xs[k + 1])), P(xs[k + 1], H), P(xs[k], H), ins)
      for (const e of [-1, 1]) {
        face(conc, P(e * chord / 2, WH), P(e * (x1 - x0) / 2, WH), P(e * (x1 - x0) / 2, H), P(e * chord / 2, H), ins)
        face(conc, P(e * strip, WH), P(e * chord / 2, WH), P(e * chord / 2, zs), P(e * strip, zs), ins)
      }
      // Glass, recessed, with its reveal.
      const dg = -0.8
      for (let k = 0; k < m; k++) face(win, P(xs[k], zs, dg), P(xs[k + 1], zs, dg), P(xs[k + 1], arcZ(xs[k + 1]), dg), P(xs[k], arcZ(xs[k]), dg), ins)
      face(win, P(-strip, WH, dg), P(strip, WH, dg), P(strip, zs, dg), P(-strip, zs, dg), ins)
      for (let k = 0; k < m; k++) face(trim, P(xs[k], arcZ(xs[k]), 0), P(xs[k + 1], arcZ(xs[k + 1]), 0), P(xs[k + 1], arcZ(xs[k + 1]), dg), P(xs[k], arcZ(xs[k]), dg), [0, y, 0])
      for (const e of [-1, 1]) face(trim, P(e * strip, WH, 0), P(e * strip, zs, 0), P(e * strip, zs, dg), P(e * strip, WH, dg), [0, y, 20])
      face(trim, P(-chord / 2, zs, 0), P(-strip, zs, 0), P(-strip, zs, dg), P(-chord / 2, zs, dg), [0, y, 40])
      face(trim, P(strip, zs, 0), P(chord / 2, zs, 0), P(chord / 2, zs, dg), P(strip, zs, dg), [0, y, 40])
      // Mullion bands across the arch (detail).
      if (D) for (const z of [24.6, 26.8, 29.0, 31.2]) {
        const w = Math.sqrt(Math.max(0, R * R - (z - zO) * (z - zO)))
        face(trim, P(-w, z - 0.12, dg + 0.05), P(w, z - 0.12, dg + 0.05), P(w, z + 0.12, dg + 0.05), P(-w, z + 0.12, dg + 0.05), ins)
      }
    }
  }
  // East and west fronts: the frame of the side walls, the thin white roof
  // plate with its quarter-circle cut-outs at both front corners, the tall
  // free-standing stone slabs and the dark glass behind them.
  const PD = 9.0, RQ = 8.0, ZP0 = 33.8 // plate depth, cut-out radius, plate underside
  for (const e of [-1, 1]) {
    const xf = e > 0 ? x1 : x0, xg = xf - e * 7.0
    const ins: V3 = [0, yc, 18]
    const yi0 = y0 + SW, yi1 = y1 - SW
    // Side walls' front ends and inner faces (the frame).
    for (const s of [-1, 1]) {
      const yo = s > 0 ? y1 : y0, yi = yo - s * SW
      face(conc, [xf, yo, 0], [xf, yi, 0], [xf, yi, H], [xf, yo, H], ins)
      face(conc, [xf, yi, 0], [xg, yi, 0], [xg, yi, H], [xf, yi, H], [xf, yo, 18])
    }
    // The dark glass front, with a darker band of the floor at 17.3-19.5.
    face(win, [xg, yi0, 0], [xg, yi1, 0], [xg, yi1, ZP0], [xg, yi0, ZP0], ins)
    box(trim, Math.min(xg, xg + e * 0.4), yi0, Math.max(xg, xg + e * 0.4), yi1, 17.3, 17.8, false)
    // The thin roof plate: a prism over its plan, the front corners cut by quarter circles.
    {
      const n = D ? 10 : 6, plan: XY[] = []
      const xb = xf - e * PD
      plan.push([xb, yi0])
      for (let k = 0; k <= n; k++) { const a = Math.PI / 2 * k / n; plan.push([xf - e * RQ * Math.cos(a), yi0 + RQ * Math.sin(a)]) }
      for (let k = n; k >= 0; k--) { const a = Math.PI / 2 * k / n; plan.push([xf - e * RQ * Math.cos(a), yi1 - RQ * Math.sin(a)]) }
      plan.push([xb, yi1])
      prism(trim, trim, plan, ZP0, H, trim)
    }
    // Tall free-standing slabs in front of the glass.
    for (const [u, w] of [[3.6, 0.7], [7.2, 1.6], [11.6, 0.7], [14.2, 0.7], [17.8, 1.6], [21.6, 0.7]]) for (const s of [-1, 1]) {
      const y = yc + s * u, dx = 5.6
      cbox(conc, Math.min(xg, xg + e * dx), y - w, Math.max(xg, xg + e * dx), y + w, 0, ZP0 - 0.3, D ? 0.3 : 0)
    }
  }
  // The side walls along their length (north and south, full height) and the roof between the plates.
  for (const s of [-1, 1]) {
    const yo = s > 0 ? y1 : y0, yi = yo - s * SW
    face(conc, [x0, yi, WH], [x1, yi, WH], [x1, yi, H], [x0, yi, H], [0, yo, 30])
    roof.quad(...([[x0, Math.min(yo, yi), H], [x1, Math.min(yo, yi), H], [x1, Math.max(yo, yi), H], [x0, Math.max(yo, yi), H]] as [V3, V3, V3, V3]))
  }
  roof.quad([x0 + PD, y0 + SW, H - 0.05], [x1 - PD, y0 + SW, H - 0.05], [x1 - PD, y1 - SW, H - 0.05], [x0 + PD, y1 - SW, H - 0.05])
  // Shift into the anchor's frame.
  for (const p of [conc, trim, win, roof, glass]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= -SHIFT[0]; p.pos[i + 2] -= SHIFT[1] }
  return { conc, trim, win, roof, glass }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  const parts = [
    { part: welded(b.conc), material: mat('chancellery-concrete', 0xe6e0d5) },
    { part: welded(b.trim), material: mat('trim', 0xf5f2ec) },
    { part: welded(b.win), material: mat('window', 0x587080, 0.35) },
    { part: welded(b.roof), material: mat('roof', 0x9da6ad) },
  ]
  writeModel('Federal Chancellery', 'berlin-chancellery', parts, { bearing: BEARING, osm: 'way/157390075', height: 36 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

if (import.meta.main) {
  // One model: the fine version fits the low budget.
  write(HIGH, 'berlin-chancellery', 5000)
}
