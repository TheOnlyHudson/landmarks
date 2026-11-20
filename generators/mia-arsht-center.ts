/**
 * Adrienne Arsht Center for the Performing Arts: Ziff Ballet Opera House
 * (2006, César Pelli) and the Carnival Tower (1929, the Sears, Roebuck
 * store's Art Deco tower, kept in the plaza), 1300 Biscayne Boulevard,
 * Miami — original procedural geometry, CC0-1.0.
 * bun generators/mia-arsht-center.ts [out.glb]
 *
 * Also exports the shared Arsht materials and a sloped-roof prism, which
 * mia-knight-concert-hall imports so the two halls match: merge this one
 * first. The model is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/314061996,
 * 25.7876411, -80.1899402. Bearing 0 (the outline is faceted; its main
 * walls run within 2° of the compass axes).
 *
 * Identity: a grey stone hall of angular, folded planes: vertical walls
 * to about 21 m, then sloped wedge facets that fold in along strong
 * diagonal lines (drawn as dark joint lines, as are the ledges), rising to
 * the tilted sign block at the high point with the "Adrienne Arsht Center"
 * name (a plain `neon` panel; white letters glow at night); blank stone
 * walls with one window band low down; the tall glass prism lobby leaning
 * out at the south-east corner; a glazed lobby along the plaza; and the
 * cream Art Deco Carnival Tower in the plaza's south-east corner. After
 * review the Ziff has its own warm mid-grey stone (it reads clearly
 * greyer than the Knight hall, which keeps the shared pale `arsht-stone`). The outline way runs
 * round the tower (the bump at its south-east), so the tower is part of
 * this model.
 *
 * Sources:
 *  - OSM: outline way/314061996 (48 m, wikidata Q2825308). No parts.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 1 m grid, above the street (ground_min + 0.9 m): fly tower
 *    45.8 (measured); auditorium roof sloping from 44 at the fly tower to
 *    30 at the south front (measured); west terraces 18.6 / 26 / 31–36
 *    (measured); north wing 18.6–19.4, its middle bay 12.8 (measured);
 *    lobby along the plaza 13–14, arcade 6.5 (measured); Carnival Tower
 *    36.5–37.3 at its lantern, ~13 m square (measured).
 *  - Published: Ziff Ballet Opera House 2,400 seats, opened 2006; the
 *    Sears tower 1929, Art Deco, listed (Wikipedia, City of Miami).
 *  - Estimated from the photos: the tower's stages (shaft to 28 m, two
 *    setbacks), ribbon window bands (one per tier), lobby glazing, the glass
 *    prism (an octagon 9 m across, 22 m), the sign panel.
 *  - Colours: pale warm stone (it reads grey in shade), green-blue glass,
 *    the tower's cream render.
 *
 * Photos (Wikimedia Commons, daylight):
 *  - Adrienne_Arsht_Center_for_Performing_Arts_20100203.jpg, Averette,
 *    CC BY 3.0 — aerial from the north: both halls, the tower, tiers;
 *  - Adrienne_Arsht_Center,_March_31,_2023.jpg, D. Benjamin Miller, CC0 —
 *    the Ziff from the south-west: fly tower, sign, folded roof planes,
 *    the green glass prism, the Carnival Tower;
 *  - The_Arsht_Center_Looking_North.JPG and The_Arsht_Center_From_Highway.JPG,
 *    Jorfer, public domain — the south and west fronts;
 *  - Miami_FL_Arsht_Center01.jpg / 02.jpg, Ebyabe, CC BY-SA 3.0 — the west
 *    front's tiers from the street;
 *  - Downtown_Miami_from_north_20100129.jpg, Averette, CC BY 3.0 — aerial
 *    context.
 * No commercial imagery or 3D tiles. No look-only sources.
 *
 * Doubts: the facets are a simplified fold pattern (eight-sided rings
 * whose face middles fold in), not traced plane by plane; the sign block
 * stands 12 m over the facets, from the photo and lidar's 45.8 m; the north (service) side is only seen from above. The
 * tower's crown is simplified to two setbacks.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, walls, capRing, face, build, box, panels, earcut, outward } from './mia-panorama-tower'

/** The Arsht Center's shared finishes (Ziff and Knight halls). */
export const ARSHT = {
  stone: finish('arsht-stone', 0xe7e3da),
  glass: windowVariant(2, 0x93bfc2),
  window: PALETTE.window,
  /** the tinted ribbon windows of the tiers, lighter than plain window */
  band: { ...PALETTE.window, color: 0x7f9aa6 },
  roof: finish('arsht-roof', 0xc9cdcf),
}

/** A prism whose top follows z = top(x, y): walls from z0, top cap. */
export function slopedPrism(wall: Part, top: Part, r: XY[], z0: number, zf: (x: number, y: number) => number) {
  const n = r.length
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n], o = outward(a, b), nv: V3 = [o[0], o[1], 0]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / 5))
    for (let s = 0; s < k; s++) {
      const p: XY = [a[0] + ((b[0] - a[0]) * s) / k, a[1] + ((b[1] - a[1]) * s) / k]
      const q: XY = [a[0] + ((b[0] - a[0]) * (s + 1)) / k, a[1] + ((b[1] - a[1]) * (s + 1)) / k]
      face(wall, [[p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], zf(...q)], [p[0], p[1], zf(...p)]], nv)
    }
  }
  // top: normal from the plane through three points
  for (const [i, j, k] of earcut(r)) {
    const A: V3 = [r[i][0], r[i][1], zf(...r[i])], B: V3 = [r[j][0], r[j][1], zf(...r[j])], C: V3 = [r[k][0], r[k][1], zf(...r[k])]
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
    const c: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...c); const nn: V3 = [c[0] / l, c[1] / l, Math.abs(c[2] / l)]
    face(top, [A, B, C], nn)
  }
}

/** A flat-topped tier: stone walls with one ribbon-window band below its top. */
export function tier(stone: Part, win: Part, roof: Part, r: XY[], z0: number, z1: number, band = true) {
  const c = ccw(r)
  walls(c, [[z0, z1, stone]])
  capRing(roof, c, z1)
  if (band && z1 - z0 > 5) panels(win, c, z1 - 3.8, z1 - 1.2, { bay: 9, pier: 2.6, rowH: 2.6, spandrel: 0, minEdge: 6 })
}

if (import.meta.main) {
  const stone = new Part(), win = new Part(), glass = new Part(), roof = new Part(), cream = new Part(), sign = new Part()
  const joint = roof // fold lines share the roof grey

  // OSM outline way/314061996 (this frame); the bump at the south-east holds the tower
  const OUTLINE: XY[] = [[24.6, -16.6], [25.2, -17.9], [26.0, -17.1], [28.9, -19.4], [31.0, -22.6], [31.9, -24.9], [32.3, -28.6], [32.0, -31.1], [31.7, -31.5], [44.3, -33.6], [45.9, -36.4], [47.3, -27.9], [53.1, -21.7], [64.3, -21.8], [64.3, -32.1], [58.0, -38.8], [47.0, -39.1], [47.9, -40.7], [41.7, -54.8], [-20.5, -56.8], [-24.8, -48.3], [-40.1, -49.4], [-56.0, -17.0], [-53.4, 31.3], [-23.5, 50.0], [58.3, 55.0], [59.0, 25.3], [59.0, 23.7], [55.1, 21.4], [50.3, 18.5], [43.7, 13.5], [37.8, 7.6], [32.7, 1.0], [29.9, -3.8], [27.4, -8.7], [25.4, -13.9]]
  // the hall's plinth: the outline without the tower bump
  const PLINTH: XY[] = [[24.6, -16.6], [28.9, -19.4], [31.9, -24.9], [32.0, -31.1], [44.3, -33.6], [45.9, -36.4], [47.9, -40.7], [41.7, -54.8], [-20.5, -56.8], [-24.8, -48.3], [-40.1, -49.4], [-56.0, -17.0], [-53.4, 31.3], [-23.5, 50.0], [58.3, 55.0], [59.0, 23.7], [50.3, 18.5], [43.7, 13.5], [37.8, 7.6], [32.7, 1.0], [27.4, -8.7]]
  // arcade/plinth: stone with the ground-floor glazing
  {
    const p = ccw(PLINTH)
    walls(p, [[0, 6.5, stone]])
    capRing(roof, p, 6.5)
    panels(glass, p, 0.4, 4.6, { bay: 9, pier: 1.4, rowH: 4.2, spandrel: 0.2, minEdge: 8 })
  }
  // north wing (backstage, rehearsal), middle bay lower: blank stone
  tier(stone, win, roof, [[-36, 30], [-4, 30], [-4, 51], [-23.5, 49.9], [-36, 42]], 6.5, 18.8, false)
  tier(stone, win, roof, [[-4, 30], [22, 30], [22, 52.5], [-4, 51]], 6.5, 18.8, false)
  tier(stone, win, roof, [[22, 26], [34, 26], [34, 53.3], [22, 52.5]], 6.5, 12.8, false)
  tier(stone, win, roof, [[34, 26], [58.6, 26], [58.3, 55], [34, 53.3]], 6.5, 19.4, false)

  // the hall: one faceted stone volume. Vertical walls to the first fold
  // (lidar 19.5 at the west edge, 30 at the south front), then sloped
  // planes that lean in by different amounts at the corners and the
  // middles of the faces, so each face breaks into wedge facets along
  // diagonal fold lines, rising to the sign block at the high point.
  const BASE: XY[] = [[-40, -46], [4, -52], [38, -52], [30, -30], [24, -2], [-4, 30], [-50, 32], [-54, -20]]
  const C: XY = [-10, -10]
  const pull = (r: XY[], kc: number, km: number): XY[] => r.map(([x, y], i) => { const k = i % 2 ? km : kc; return [C[0] + (x - C[0]) * k, C[1] + (y - C[1]) * k] as XY })
  const RINGS: [number, XY[]][] = [
    [6.5, BASE], [21, BASE],
    [29, pull(BASE, 0.93, 0.5)],  // corners stay out, face middles fold in: wedge facets
    [33, pull(BASE, 0.45, 0.4)],
  ]
  const tri = (part: Part, A: V3, B: V3, C: V3) => {
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
    const c: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...c); face(part, [A, B, C], [c[0] / l, c[1] / l, c[2] / l])
  }
  // dark joint lines on the folds and ledges (the photo's strong diagonal and horizontal lines)
  const line = (P: V3, Q: V3, R: V3) => {
    const u = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]], v = [R[0] - P[0], R[1] - P[1], R[2] - P[2]]
    const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    let l = Math.hypot(...c); const n = c.map((x) => x / l) as V3
    if (n[0] * (P[0] - CEN[0]) + n[1] * (P[1] - CEN[1]) < 0) n.forEach((_, i) => (n[i] = -n[i]))
    const L = Math.hypot(...u); const t = u.map((x) => x / L)
    const w = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]]
    const off = (p: V3, s: number): V3 => [p[0] + w[0] * s + n[0] * 0.1, p[1] + w[1] * s + n[1] * 0.1, p[2] + w[2] * s + n[2] * 0.1]
    face(joint, [off(P, -0.4), off(Q, -0.4), off(Q, 0.4), off(P, 0.4)], n)
  }
  const CEN: XY = [-10, -10]
  for (let k = 0; k < RINGS.length - 1; k++) {
    const [z0, r0] = RINGS[k], [z1, r1] = RINGS[k + 1]
    for (let i = 0; i < r0.length; i++) {
      const j = (i + 1) % r0.length
      const a: V3 = [r0[i][0], r0[i][1], z0], b: V3 = [r0[j][0], r0[j][1], z0], c: V3 = [r1[j][0], r1[j][1], z1], d: V3 = [r1[i][0], r1[i][1], z1]
      // split along the rising diagonal: that is the fold line
      if (k >= 1 && i % 2 === 0) { tri(stone, a, b, d); tri(stone, b, c, d); if (k < RINGS.length - 1) line(b, d, a) } else { tri(stone, a, b, c); tri(stone, a, c, d); if (k >= 1 && k < RINGS.length - 1) line(a, c, b) }
      // the ledge line where each band of facets starts
      if (k >= 1) line(a, b, d)
    }
  }
  capRing(roof, RINGS[RINGS.length - 1][1], 33)
  // ground-floor glazing band on the hall's lower wall (seen above the plinth)
  panels(win, RINGS[0][1], 7.6, 10.2, { bay: 10, pier: 2.4, rowH: 2.6, spandrel: 0, minEdge: 12 })

  // the sign block: a tilted prism at the high point, its south face leaning back
  {
    const B: XY[] = [[-40, -4], [-6, -4], [-6, 20], [-40, 20]], T: XY[] = [[-38, 2], [-8, 2], [-8, 20], [-38, 20]]
    const z0 = 24, z1 = 45.8
    const R0 = B.map(([x, y]) => [x, y, z0] as V3), R1 = T.map(([x, y]) => [x, y, z1] as V3)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; tri(stone, R0[i], R0[j], R1[j]); tri(stone, R0[i], R1[j], R1[i]) }
    face(roof, R1, [0, 0, 1])
    // the name panel on the leaning south face (white letters glow at night)
    const at = (u: number, t: number): V3 => {
      const x = -40 + 2 * t + u * (34 - 4 * t), y = -4 + 6 * t - 0.08, z = z0 + (z1 - z0) * t
      return [x, y, z]
    }
    const n: V3 = (() => { const c = [0, -(z1 - z0), 6]; const l = Math.hypot(...c); return [0, c[1] / l, c[2] / l] as V3 })()
    face(sign, [at(0.08, 0.55), at(0.92, 0.55), at(0.92, 0.85), at(0.08, 0.85)], n)
  }

  // the lobby along the plaza: glass wall on the curved east front
  {
    const LOB: XY[] = [[22, -4], [26.5, -10], [30.5, -4], [35, 4], [41, 11], [50, 19], [57, 24], [58.6, 26], [22, 26]]
    const r = ccw(LOB)
    walls(r, [[6.5, 14, glass]])
    capRing(roof, r, 14)
  }
  // the tall glass prism lobby at the south-east corner, leaning outward
  {
    const n = 8, c0: XY = [37, -45], c1: XY = [39.5, -47.5], r0 = 5.5, r1 = 7.5, z1 = 24
    const P0 = Array.from({ length: n }, (_, k) => [c0[0] + r0 * Math.cos((k * 2 * Math.PI) / n + Math.PI / 8), c0[1] + r0 * Math.sin((k * 2 * Math.PI) / n + Math.PI / 8), 0] as V3)
    const P1 = Array.from({ length: n }, (_, k) => [c1[0] + r1 * Math.cos((k * 2 * Math.PI) / n + Math.PI / 8), c1[1] + r1 * Math.sin((k * 2 * Math.PI) / n + Math.PI / 8), z1] as V3)
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; tri(glass, P0[i], P0[j], P1[j]); tri(glass, P0[i], P1[j], P1[i]) }
    face(roof, P1, [0, 0, 1])
  }

  // ---------------- Carnival Tower (1929) ----------------
  {
    const cx = 58.3, cy = -30.2
    box(cream, cx, cy, 12.6, 12.6, 0, 27.5)
    box(cream, cx, cy, 13.4, 13.4, 27.5, 28.3) // cornice
    box(cream, cx, cy, 9.6, 9.6, 28.3, 32.8)
    box(cream, cx, cy, 6.4, 6.4, 32.8, 36.8)
    box(cream, cx, cy, 3.4, 3.4, 36.8, 38.2)
    // the tall vertical window strips of the shaft, two per face
    for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (const s of [-2.4, 2.4]) {
      const tx = -ny, ty = nx, d = 6.36
      const p = (u: number, z: number): V3 => [cx + nx * d + tx * u, cy + ny * d + ty * u, z]
      face(win, [p(s - 0.9, 8), p(s + 0.9, 8), p(s + 0.9, 25), p(s - 0.9, 25)], [nx, ny, 0])
    }
    // a lower block joining it to the plinth (the old store's base)
    box(cream, 53.5, -30, 10, 16, 0, 8)
  }

  await build('Adrienne Arsht Center (Ziff Ballet Opera House)', 'mia-arsht-center', [
    { part: stone, material: finish('ziff-stone', 0xbfbcb6) },
    { part: win, material: ARSHT.band },
    { part: glass, material: ARSHT.glass },
    { part: roof, material: PALETTE.roof },
    { part: cream, material: { ...finish('carnival-tower-cream', 0xf2ead8), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.9) } },
    { part: sign, material: finish('neon-arsht-sign', 0xc4c8cb) },
  ], { bearing: 0, elevation: 0, height: 45.8, replaces: ['way/314061996'] }, process.argv[2], 6500)
}
