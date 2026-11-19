/**
 * Union Trust Building (originally the Union Arcade; Frederick J.
 * Osterling, 1915-1917), 501 Grant Street, downtown Pittsburgh — original
 * procedural geometry, CC0-1.0.
 * bun generators/pit-union-trust-building.ts
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint (William Penn Place, ~230.8 m NAVD88;
 * the block rises 4.4 m east to Grant Street). Anchor = area centroid of
 * the OSM outline way/121046649, -79.9970221 40.4399334. The block is on
 * the downtown grid, so the catalog bearing is 27.2: +x is Grant Street,
 * -x William Penn Place, +y Oliver Avenue, -y Fifth Avenue.
 *
 * Identity, in order: the steep tiled mansard over the whole block, hipped
 * at the corners, with rows of gabled dormers; the two tall "chapels" (the
 * mechanical penthouses) standing on the roof, steep-gabled with traceried
 * gable fronts facing Oliver and Fifth; the white terracotta Flemish-Gothic
 * crown — a deep arcade of pointed arches under the eaves; strong
 * continuous piers with the windows recessed between them; the two-storey
 * arched base.
 *
 * Evidence:
 *  - plan: OSM way/121046649 (66 x 76 m, small corner chamfers dropped),
 *    turned into this frame.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid sampled at 3 m, above the base: crown/eaves 41.2 at the
 *    wall line; mansard rising to a flat top at 52.2 about 3.5 m in;
 *    chapels x -21..-9 and 9..21, y -8..7, eaves ~61.2, ridges along y at
 *    77.1; north penthouse x -7..7, y 9..19.5 at 59.2; central light well
 *    roof ~49.5. OSM height 72 is about the chapels' eaves plus; lidar used.
 *  - published: 1917, F. J. Osterling; 11 storeys (Wikipedia, "Union
 *    Trust Building (Pittsburgh)").
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Union Trust Building, 2025-12-27.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Trust_Building,_2025-12-27.jpg
 *      Cbaile19, CC0 — from the north-east (Grant/Oliver): roof, crown,
 *      piers, base, one chapel.
 *    "Pittsburgh Downtown 2019-06-08 Union Trust Building (composite).jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh_Downtown_2019-06-08_Union_Trust_Building_(composite).jpg
 *      Cbaile19, CC0 — a long front head-on: bay count and storeys.
 *    "Detail of the Union Trust Building, 2025-10-05-2.jpg"
 *      https://commons.wikimedia.org/wiki/File:Detail_of_the_Union_Trust_Building,_2025-10-05-2.jpg
 *      Cbaile19, CC0 — the two chapels floodlit at night, gable on.
 *    "Mansard Roof, Union Trust Building (14079959758).jpg"
 *      https://commons.wikimedia.org/wiki/File:Mansard_Roof,_Union_Trust_Building_(14079959758).jpg
 *      Barry Wise, CC BY-SA 2.0 — mansard, dormers, crown.
 *    "Union Trust Building in 1978 from an upper floor of Kaufmann's.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Trust_Building_in_1978_from_an_upper_floor_of_Kaufmann%27s.jpg
 *      Steve Morgan, CC BY-SA 3.0 — from above: the roof and chapels.
 *    "Union Trust Building roof.jpg"
 *      https://commons.wikimedia.org/wiki/File:Union_Trust_Building_roof.jpg
 *      XWRN, CC BY-SA 2.0 — the roof from above.
 *  - colour: white terracotta (palette trim/stone, cooled slightly); the
 *    mansard's glazed tile reads warm tan-grey; the windows dark in deep
 *    reveals.
 * Estimated: dormer count and size, pier widths, the base arches, the
 * chapels' tracery (drawn as three lancets and a rose per gable).
 *
 * Left out: the crockets, pinnacles and lace of the crown (drawn as a bold
 * band of pointed arches), the corner turrets of the mansard, the glass
 * dome over the arcade (inside the light well).
 *
 * Night: the chapels and the crown are floodlit (night photo above).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, boxFaces, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'

/** A flat pointed (equilateral) arch panel on wall a→b. */
function pointed(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 4) {
  const { P } = onWall(a, b)
  const w = s1 - s0, c = (s0 + s1) / 2, t1 = Math.acos(0.5)
  const pts: [number, number][] = [[s0, z0], [s1, z0]]
  for (let i = 0; i <= seg; i++) { const t = (t1 * i) / seg; pts.push([s0 + w * Math.cos(t), zs + w * Math.sin(t)]) }
  for (let i = seg - 1; i >= 0; i--) { const t = Math.PI - (t1 * i) / seg; pts.push([s1 + w * Math.cos(t), zs + w * Math.sin(t)]) }
  const ctr = P(c, (z0 + zs) / 2, out)
  for (let i = 0; i < pts.length; i++) { const q = pts[i], n = pts[(i + 1) % pts.length]; if (q[0] === n[0] && q[1] === n[1]) continue; p.tri(ctr, P(q[0], q[1], out), P(n[0], n[1], out)) }
}

function build() {
  const tc = new Part(), win = new Part(), tile = new Part(), crown = new Part(), roofP = new Part()
  const X0 = -33.1, X1 = 33.1, Y0 = -37.8, Y1 = 37.7
  const R: [number, number, number, number] = [X0, Y0, X1, Y1]
  const EAVE = 41.2, TOPZ = 52.2, MD = 4.5, RB = 37.5 // RB: the mansard's foot behind the crown
  const ground = (x: number) => 4.4 * (x - X0) / (X1 - X0)

  // ---- the block, a plinth and a belt over the two-storey base
  wallsSplit(tc, rect(...R), 0, RB, 6)
  band(tc, rect(...R), grow(R, 0.3), 0, 1.2 + 0, 0.01)
  band(tc, rect(...R), grow(R, 0.35), 9.6, 10.4)

  // ---- the crown: a deep projecting arcade band, pointed arches under it
  band(crown, rect(...R), grow(R, 1.2), EAVE - 4.2, EAVE - 3.4, 0.8)
  { // the openwork parapet of the crown: a thin screen standing on the band, in front of the mansard
    const o = grow(R, 1.0), i = grow(R, 0.7)
    walls(crown, o, EAVE - 3.4, EAVE); walls(crown, [...i].reverse(), EAVE - 3.4, EAVE)
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; crown.quad([o[k][0], o[k][1], EAVE], [o[j][0], o[j][1], EAVE], [i[j][0], i[j][1], EAVE], [i[k][0], i[k][1], EAVE]) }
  }

  // ---- the mansard: steep slopes to a flat top, hipped at the corners
  {
    const e = grow(R, 0).map(([x, y]) => [x, y, RB] as V3)
    const t = grow(R, -MD).map(([x, y]) => [x, y, TOPZ] as V3)
    const nn: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; poly(tile, [e[i], e[j], t[j], t[i]], [nn[i][0], nn[i][1], 0.5]) }
    cap(roofP, grow(R, -MD), TOPZ)
  }

  // ---- facades: piers between recessed bays, windows grouped in threes
  const faces = boxFaces(R)
  for (const [a, b] of faces) {
    const { L, u, P } = onWall(a, b)
    const n = Math.round(L / 4.75), pitch = L / n
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) * pitch
      const g = ground(a[0] + u[0] * s)
      // the arched base: shop windows under segmental-looking round heads
      arch(win, a, b, s - 1.6, s + 1.6, g + 0.9, Math.max(g + 2.5, 7.6), 0.05, 6)
      for (const [z0, z1] of [[11.4, 17.8], [19.6, 26.0], [27.8, 32.6]]) panel(win, a, b, s - 1.15, s + 1.15, z0, z1)
      pointed(win, a, b, s - 1.15, s + 1.15, 34.0, 35.2, 0.05)
      // the pointed hoods of the crown arcade, in front of the band
      pointed(win, a, b, s - pitch / 2 + 0.7, s + pitch / 2 - 0.7, EAVE - 3.3, EAVE - 3.3, 1.05, 3)
      // dormers on the mansard, every other bay
      if (i % 2 === 1 && s > 5 && s < L - 5) {
        const zb = EAVE + 1.2, back = MD + 0.9
        const k = 0.9 + (zb - RB) / (TOPZ - RB) * MD // 0.9 - k is the slope's offset at zb
        const f = (ss: number, z: number, o: number) => P(ss, z, 0.9 - k - o)
        const w = 1.4
        const F0 = f(s - w, zb, 0), F1 = f(s + w, zb, 0), F2 = f(s + w, zb + 2.6, 0), F3 = f(s - w, zb + 2.6, 0), Fa = f(s, zb + 4.4, 0)
        const B0 = f(s - w, zb, back - k), B1 = f(s + w, zb, back - k)
        const B2 = f(s + w, zb + 2.6, back - k), B3 = f(s - w, zb + 2.6, back - k), Ba = f(s, zb + 4.4, back - k)
        const out: V3 = [onWall(a, b).n[0], onWall(a, b).n[1], 0]
        poly(crown, [F0, F1, F2, Fa, F3], out)
        poly(crown, [F1, B1, B2, F2], [u[0], u[1], 0])
        poly(crown, [B0, F0, F3, B3], [-u[0], -u[1], 0])
        poly(tile, [F3, Fa, Ba, B3], [-u[0], -u[1], 1])
        poly(tile, [Fa, F2, B2, Ba], [u[0], u[1], 1])
        pointed(win, a, b, s - 0.6, s + 0.6, zb + 0.4, zb + 2.2, 0.9 - k + 0.05, 3)
      }
    }
    // piers: continuous from the belt to the crown
    for (let i = 0; i <= n; i++) {
      const s = i * pitch, w = i === 0 || i === n ? 2.2 : 1.1
      const s0 = Math.max(0, s - w / 2), s1 = Math.min(L, s + w / 2), d = 0.45
      const A = P(s0, 10.4, d), B = P(s1, 10.4, d), A1 = P(s0, EAVE - 4.2, d), B1 = P(s1, EAVE - 4.2, d)
      tc.quad(A, B, B1, A1)
      if (s0 > 0) tc.quad(P(s0, 10.4, 0), A, A1, P(s0, EAVE - 4.2, 0))
      if (s1 < L) tc.quad(B, P(s1, 10.4, 0), P(s1, EAVE - 4.2, 0), B1)
      tc.quad(A, P(s0, 10.4, 0), P(s1, 10.4, 0), B)
    }
  }

  // ---- the two chapels on the roof, gables to Oliver (+y) and Fifth (-y)
  for (const cx of [-15, 15]) {
    const x0 = cx - 6, x1 = cx + 6, y0 = -8, y1 = 7, ze = 61.2, zr = 77.1
    walls(tc, rect(x0, y0, x1, y1), TOPZ, ze)
    band(crown, rect(x0, y0, x1, y1), grow([x0, y0, x1, y1], 0.4), ze - 1.2, ze, 0.4)
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      poly(tc, [[x0, y, ze], [x1, y, ze], [cx, y, zr - 0.6]], [0, s, 0])
      const a: XY = s < 0 ? [x0, y] : [x1, y], b: XY = s < 0 ? [x1, y] : [x0, y]
      // three lancets and a rose: the traceried gable front
      for (const k of [-3, 0, 3]) pointed(win, a, b, 6 + k - 1.0, 6 + k + 1.0, 53.5, k === 0 ? 61.5 : 59.5, 0.05)
      const ctr: [number, number] = [6, 66.5], P = onWall(a, b).P
      for (let i = 0; i < 12; i++) { const t0 = (i / 12) * 2 * Math.PI, t1 = ((i + 1) / 12) * 2 * Math.PI; win.tri(P(ctr[0], ctr[1], 0.05), P(ctr[0] + 1.6 * Math.cos(t0), ctr[1] + 1.6 * Math.sin(t0), 0.05), P(ctr[0] + 1.6 * Math.cos(t1), ctr[1] + 1.6 * Math.sin(t1), 0.05)) }
      // corner pinnacles flanking the gable
      for (const px of [x0, x1]) {
        const r = rect(px - 0.6, y - 0.6, px + 0.6, y + 0.6)
        walls(crown, r, ze - 1.2, ze + 4)
        for (let i = 0; i < 4; i++) { const p0 = r[i], p1 = r[(i + 1) % 4]; poly(crown, [[p0[0], p0[1], ze + 4], [p1[0], p1[1], ze + 4], [px, y, ze + 8]], [(p0[0] + p1[0]) / 2 - px, (p0[1] + p1[1]) / 2 - y, 0.5]) }
      }
    }
    const o = 0.5
    poly(tile, [[x0 - o, y0 - o, ze - 1.2], [x0 - o, y1 + o, ze - 1.2], [cx, y1 + o, zr], [cx, y0 - o, zr]], [-1, 0, 0.4])
    poly(tile, [[x1 + o, y1 + o, ze - 1.2], [x1 + o, y0 - o, ze - 1.2], [cx, y0 - o, zr], [cx, y1 + o, zr]], [1, 0, 0.4])
    // a dormer on each long roof slope
    for (const side of [-1, 1]) {
      const xd = cx + side * 3.4, zb = 64.5
      const r: [number, number, number, number] = [Math.min(xd, xd + side * 1.6), -1.8, Math.max(xd, xd + side * 1.6), 0.8]
      walls(crown, rect(...r), zb, zb + 2.6)
      pointed(win, side < 0 ? [r[0], r[3]] : [r[2], r[1]], side < 0 ? [r[0], r[1]] : [r[2], r[3]], 0.7, 1.9, zb + 0.4, zb + 1.8, 0.05, 3)
      cap(crown, rect(...r), zb + 2.6)
    }
  }
  // the north penthouse between them
  walls(tc, rect(-7, 9, 7, 19.5), TOPZ, 59.2); cap(roofP, rect(-7, 9, 7, 19.5), 59.2)

  const lit = (p: V3, n: V3) => (p[2] > 52 ? (n[2] > 0.7 ? 0.3 : 0.9) : p[2] > 36 ? 0.5 : 0.1)
  return [
    { part: tc, material: { ...finish('white-terracotta', 0xebe7df), floodlight: lit } },
    { part: crown, material: { ...PALETTE.trim, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: tile, material: { ...finish('mansard-tile', 0xd2cbbf), floodlight: (p: V3) => (p[2] > 60 ? 0.6 : 0) } },
    { part: roofP, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pit-union-trust-building', 'Union Trust Building', [40.4399334, -79.9970221], 27.2, build() as any, 5000)
