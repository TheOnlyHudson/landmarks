/**
 * Edo-Tokyo Museum (江戸東京博物館), Ryōgoku, Sumida, Tokyo (Kiyonori
 * Kikutake, 1993) — procedural, CC0-1.0.
 * bun generators/tokyo-edo-tokyo-museum.ts
 *
 * Map frame: x along the building (bearing 103.4°), y across it (13.4°,
 * north-north-east), z up, metres; origin on the ground at the centroid of
 * the OSM outline way/76187056 (139.7960762, 35.6964431); catalog bearing
 * 13.4.
 *
 * Identity, in order: a huge pale block raised high on four massive legs
 * over an open plaza, so that the sky shows through under it (the void is
 * real: nothing but the legs between the plaza and the block's coffered
 * underside); the block's long sides leaning outward as they rise, like a
 * storehouse roof upside down; the ends built up of stacked, cantilevered
 * beams and bands (the name band 江戸東京博物館 on each end); the two box
 * "lanterns" standing on the roof at each end, one taller; the long grey
 * pitched roof between them; the broad plaza (the 3rd-floor 江戸東京ひろば)
 * on the low podium of halls the block stands over.
 *
 * Evidence:
 *  - OSM: way/76187056, the block's outline (163 × 67.6 m, notched 5 m in
 *    the middle of each end), height 62.2 m, 7 levels, layer 3; way/181376633,
 *    the podium of halls under the plaza (layer 1, no height), drawn as one
 *    slab at plaza height, its walls plain concrete.
 *  - published (ja.wikipedia 江戸東京博物館): 7 floors above ground and one
 *    below, about 62 m high (the height of Edo Castle's keep), steel frame;
 *    the 3rd floor is the open-air plaza, the permanent galleries on the
 *    5th and 6th floors (in the raised block).
 *  - estimated from photos (each estimate ±2 m): the plaza 4 m above the
 *    street (Daderot's street view, the podium wall against the 62.2 m
 *    total); the block's underside 27 m and its eave 55 m, so the block is
 *    about as tall as the void beneath it (Almbauer's, Kakidai's and
 *    Daderot's views); the legs square concrete towers 16 m along and 10 m
 *    across, standing well inside the block's footprint (centred ±52 m
 *    along, inner faces 22 m apart, outer faces ~9.5 m in from the long
 *    sides), so the block overhangs them all round and the coffered
 *    underside (beams every 8 m both ways) is one big ceiling over the
 *    void; lighter lift shafts on their faces; the stair and lift towers
 *    carried up inside the block show on its long sides as flush panel
 *    bands over the legs; the block 61 m wide at its underside, leaning
 *    out to the outline's 67.6 m by 55 m; the roof ridge 58.8 m; the tall
 *    roof boxes to 62.2 m on the south side at both ends, the low ones to
 *    59.2 m on the north side (Kakidai's two plaza views and Daderot's
 *    view from the far end agree); the stacked end slabs (fascia, two
 *    beam-boxes, the name band, the upper wall), each with a dark soffit.
 *    Review rounds 2 and 3 deepened the block, then moved the legs in and
 *    widened the underside.
 *  - colours (daylight photos): pale grey-white metal panels, the legs and
 *    the underside a darker grey concrete, the roof mid grey, the plaza
 *    and the podium's walls pale paving.
 *  - terrain: the map's terrain is flat here (~2.5 m above its lowest
 *    point); the plaza is the podium, drawn by the model. See the report.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Edo-Tokyo Museum 2012.JPG, Kakidai, CC BY-SA 3.0 (plaza, end and south side)
 *  - Edo-Tokyo Museum 2014.jpg, Kakidai, CC BY-SA 4.0 (plaza, end)
 *  - 2018 Edo-Tokyo Museum 01.jpg, Kakidai, CC BY-SA 4.0 (plaza)
 *  - Edo-Tokyo Museum.jpg, Wiiii, CC BY-SA 3.0 (plaza, end)
 *  - Edo-Tokyo Museum 2019.jpg, Marco Almbauer, CC0 (plaza, end, level)
 *  - Edo-Tokyo Museum - Sumida, Tokyo, Japan - DSC06567.jpg, Daderot, CC0 (the far end, from the street)
 *  - Ryogoku Great Sumo Hall.jpg, Steve Cadman, CC BY-SA 2.0 (from the north-west, above)
 * No commercial imagery. No look-only references.
 *
 * Left out: the red escalator tube that climbs from the plaza into the
 * block, the lettering itself (the name band is plain), the round emblems on
 * the long sides, the roof's glazing, the plaza's planting and stairs.
 * Doubts: the plaza height and the underside height are estimates; the
 * north long side is not photographed (drawn as the south); the podium's
 * far west part is assumed to be plaza too.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, quadOut, triOut, save, type Mat } from './tokyo-sensoji'

type XY = [number, number]
const PODIUM: XY[] = [[70.3, -36.9], [79.1, -33.7], [81.6, -33.7], [81.1, -16.8], [81.0, 16.6], [104.2, 24.1], [96.4, 45.7], [94.1, 52.0], [43.5, 35.3], [-26.4, 35.4], [-26.5, 45.2], [-16.7, 54.1], [-22.4, 59.0], [-29.0, 61.2], [-35.6, 61.2], [-42.4, 58.8], [-48.0, 54.2], [-37.7, 45.5], [-37.9, 35.7], [-81.8, 35.6], [-82.5, 77.2], [-105.6, 77.1], [-129.2, 77.1], [-128.1, 21.8], [-147.5, 21.9], [-147.3, 20.2], [-173.4, 20.1], [-174.0, -27.8], [-124.3, -28.1], [-124.2, -31.8], [-124.1, -35.9], [-149.3, -35.5], [-173.6, -35.2], [-173.7, -43.6], [-173.7, -56.9], [-16.6, -53.0], [-16.7, -51.5], [0.2, -49.9], [31.5, -45.5]]

const PLAZA = 4.0, U = 27, EAVE = 55, RIDGE = 58.8, TOP = 62.2
const HY0 = 30.5, HY1 = 33.8 // half-width at the underside and at the eave
const HX = 76.5 // the block's body; the end beams reach 81.5

/** Ear-clipping triangulation of a simple polygon (either winding); returns index triples. */
function earcut(poly: XY[]): [number, number, number][] {
  const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const idx = poly.map((_, i) => i)
  if (area < 0) idx.reverse()
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(poly[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

function build() {
  const panel = new Part(), concrete = new Part(), paving = new Part(), roof = new Part(), win = new Part()

  // The podium and its plaza. Long walls are cut into ≤ 5 m pieces so they
  // follow the terrain.
  for (const [a, b, c] of earcut(PODIUM)) triOut(paving, [...PODIUM[a], PLAZA], [...PODIUM[b], PLAZA], [...PODIUM[c], PLAZA], [0, 0, 1])
  const n = PODIUM.length
  const ccw = PODIUM.reduce((s, p, i) => { const q = PODIUM[(i + 1) % n]; return s + p[0] * q[1] - q[0] * p[1] }, 0) > 0
  for (let i = 0; i < n; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % n]
    const out: V3 = ccw ? [b[1] - a[1], -(b[0] - a[0]), 0] : [-(b[1] - a[1]), b[0] - a[0], 0]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / 5))
    for (let j = 0; j < k; j++) {
      const p = [a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k], q = [a[0] + (b[0] - a[0]) * (j + 1) / k, a[1] + (b[1] - a[1]) * (j + 1) / k]
      quadOut(paving, [p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], PLAZA], [p[0], p[1], PLAZA], out)
    }
  }
  // A parapet along the plaza's edge, on the long south and north sides.
  for (const [a, b] of [[[-173.6, -56.6], [-16.8, -52.7]], [[-81.8, 35.3], [-37.9, 35.4]]] as XY[][])
    box(paving, Math.min(a[0], b[0]), Math.min(a[1], b[1]) - 0.25, PLAZA, Math.max(a[0], b[0]), Math.max(a[1], b[1]) + 0.25, PLAZA + 1.1, 'b')

  // The four legs: square concrete towers standing well inside the block's
  // footprint, in pairs set in ~30 m from each end, so the block overhangs
  // them on every side and the void under it reads as one wide room.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = sx * 52, y0 = sy * 11, y1 = sy * 21
    box(concrete, cx - 8, Math.min(y0, y1), PLAZA - 0.5, cx + 8, Math.max(y0, y1), U, 'bt')
    // Panelled lift shafts on the legs' faces, a shade lighter, with a slot of glazing.
    box(paving, cx - 5, Math.min(y0, y1) - 0.3, PLAZA, cx + 5, Math.max(y0, y1) + 0.3, U - 1, 'bt')
    box(win, cx - 1.2, Math.min(y0, y1) - 0.35, PLAZA + 1, cx + 1.2, Math.max(y0, y1) + 0.35, U - 3, 'bt')
  }

  // The raised block: a cross-section swept along x, leaning out as it rises.
  const sec = (x: number): V3[] => [[x, -HY0, U], [x, HY0, U], [x, HY1, EAVE], [x, -HY1, EAVE]]
  const A = sec(-HX), B = sec(HX)
  // Underside, long sides.
  quadOut(concrete, A[0], B[0], B[1], A[1], [0, 0, -1])
  quadOut(panel, A[1], B[1], B[2], A[2], [0, 1, -0.4])
  quadOut(panel, A[3], B[3], B[0], A[0], [0, -1, -0.4])
  // Panel joints: three darker lines up each long side, and the slot of
  // windows near the top.
  for (const s of [-1, 1]) for (const t of [0.25, 0.5, 0.75, 0.9]) {
    const z = U + (EAVE - U) * t, y = s * (HY0 + (HY1 - HY0) * t)
    const z2 = z + 0.6, y2 = s * (HY0 + (HY1 - HY0) * (t + 0.6 / (EAVE - U)))
    const part = t === 0.9 ? win : roof
    quadOut(part, [-HX + 2, y + s * 0.03, z], [HX - 2, y + s * 0.03, z], [HX - 2, y2 + s * 0.03, z2], [-HX + 2, y2 + s * 0.03, z2], [0, s, -0.4])
  }
  // The stair and lift towers carried up inside the block show on its long
  // sides as flush, slightly darker panel bands over the legs.
  for (const sx of [-1, 1]) for (const s2 of [-1, 1]) {
    const x0 = sx * 52 - 6, x1 = sx * 52 + 6
    const lo = (x: number): V3 => [x, s2 * (HY0 + 0.05), U], hi = (x: number): V3 => [x, s2 * (HY1 + 0.05), EAVE]
    quadOut(paving, lo(x0), lo(x1), hi(x1), hi(x0), [0, s2, -0.1])
  }
  // The coffered underside: deep beams across and along it.
  for (let x = -72; x <= 72; x += 8) box(concrete, x - 0.6, -HY0 + 0.5, U - 1.8, x + 0.6, HY0 - 0.5, U, 't')
  for (const y of [-24, -16, -8, 0, 8, 16, 24]) box(concrete, -HX + 0.5, y - 0.5, U - 1.4, HX - 0.5, y + 0.5, U, 't')
  // The ends: recessed walls, then the stacked beams standing out to 81.5.
  for (const e of [-1, 1]) {
    const x = e * HX
    const S = sec(x)
    quadOut(panel, S[0], S[1], S[2], S[3], [e, 0, 0])
    const X = e * 81.5
    // The stack of cantilevered beams: a deep fascia across the underside;
    // two beam-boxes either side stepping out; the name band, full width and
    // furthest out; the upper end wall with its window band. Each has a
    // dark soffit under its overhang.
    const slab = (y0: number, y1: number, z0: number, z1: number, reach: number) => {
      const xa = Math.min(x, e * reach), xb = Math.max(x, e * reach)
      box(panel, xa, y0, z0, xb, y1, z1, 'b')
      box(concrete, xa, y0, z0 - 0.05, xb, y1, z0, 't')
    }
    slab(-HY0, HY0, U, U + 5.5, 79.5)
    slab(-33, -17, U + 7, U + 11, 81.5)
    slab(17, 31, U + 9.5, U + 13.5, 80.5)
    slab(-HY1, HY1, U + 16, U + 22.5, 81.5)
    box(roof, Math.min(x, X) - 0.03, -HY1 + 3, U + 17.4, Math.max(x, X) + 0.03, HY1 - 8, U + 21.1, 'b')
    slab(-HY1, HY1, U + 24, EAVE, 78.5)
    box(win, Math.min(x, X - e * 3) - 0.03, -HY1 + 6, EAVE - 4.5, Math.max(x, X - e * 3) + 0.03, HY1 - 6, EAVE - 1.5, 'tb')
  }

  // Roof: a long low pitch between parapets.
  const r = (x: number): V3[] => [[x, -HY1 + 1, EAVE], [x, 0, RIDGE], [x, HY1 - 1, EAVE]]
  const R0 = r(-HX), R1 = r(HX)
  quadOut(roof, R0[0], R1[0], R1[1], R0[1], [0, -1, 2])
  quadOut(roof, R0[1], R1[1], R1[2], R0[2], [0, 1, 2])
  for (const e of [-1, 1]) triOut(roof, r(e * HX)[0], r(e * HX)[1], r(e * HX)[2], [e, 0, 0])
  box(panel, -HX, -HY1, EAVE, HX, -HY1 + 1, EAVE + 1.2, 'b')
  box(panel, -HX, HY1 - 1, EAVE, HX, HY1, EAVE + 1.2, 'b')

  // The roof boxes: tall ones on the south side, low ones on the north,
  // standing out over the ends.
  for (const e of [-1, 1]) {
    // Tall box, south side: stands on legs over the roof and juts out past the end.
    box(panel, e * 62, -33.5, EAVE - 1, e * 81.5, -16, TOP, '')
    box(concrete, e * 62 - 0.03, -33.6, EAVE - 1, e * 81.5 + 0.03, -15.9, EAVE + 0.6, 't')
    box(win, e * 62 - 0.04, -30, EAVE + 1.5, e * 62 + 0.04, -20, EAVE + 3.5, 'tb')
    // Low box, north side.
    box(panel, e * 65, 15, EAVE - 0.5, e * 80.5, 31, 59.2, '')
    box(concrete, e * 65 - 0.03, 14.9, EAVE - 0.5, e * 80.5 + 0.03, 31.1, EAVE + 0.8, 't')
  }

  const parts: Mat[] = [
    { part: panel, material: { ...finish('panel-white', 0xe3e4e0), floodlight: (_: V3, nn: V3) => (nn[2] > 0.6 ? 0.2 : 0.6) } },
    { part: concrete, material: finish('concrete-grey', 0xa9aaa6) },
    { part: paving, material: finish('plaza-paving', 0xdcd8cf) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ]
  return parts
}

if (import.meta.main) {
  await save('tokyo-edo-tokyo-museum', 'Edo-Tokyo Museum', build(), 'tokyo-edo-tokyo-museum.glb', 5000, 250_000, { bearing: 13.4, elevation: 0, height: 62.2, osm: 'way/76187056' })
}
