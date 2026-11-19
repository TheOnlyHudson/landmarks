/**
 * EQT Plaza (1987, Welton Becket & Associates; built as CNG Tower), 625
 * Liberty Avenue, Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-eqt-plaza.ts
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/294832121, -80.0008110 40.4424909. Its walls run at 71.5° /
 * 161.5°; the catalog bearing is 341.5, so model +y points north-north-west
 * (toward Penn Avenue's theatres), +x east-north-east (toward Seventh
 * Street), -x west-south-west (the arch face seen down Liberty Avenue).
 *
 * Identity, in order: the tall rose-brown granite slab in the middle; the
 * lower crown blocks either side of it, each ending in a silver steel truss
 * arch over a glass barrel roof (the arch is what people know the tower
 * by); the central triple strip of tall glass down each broad face; the
 * storey band of tall windows under the arch; the 2 m setback at the 20th
 * floor on the long faces; the 21-storey east wing; the tall round-headed
 * opening at the foot of the east wing.
 *
 * Evidence:
 *  - plan: OSM outline way/294832121 in this frame. The tower stands on x
 *    -42..23, y -20..18 (lidar footprint, which matches the outline's west,
 *    north and south edges within a metre). The outline also runs east to x
 *    42 over the low plaza in front of the east wing (lidar 1-5 m: canopies
 *    and planters), which is not modelled.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, less ~1 m for the street around the base (lidar ground
 *    1.0-1.6 m above the box minimum): central slab x -22..-2, y -20..16.5,
 *    131.5 (its roof within the parapet ~127); crown blocks x -42..-22 and
 *    -2..3, y -18..16, parapet 118.5, glass barrel rising across y to 124.4;
 *    shaft to 74.8 over x -42..23, y -20..18 (the 2 m setback on the long
 *    faces). Published: 131 m (OSM height; 32 storeys, Wikipedia "EQT
 *    Plaza").
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    "EQT Plaza, 2025-11-04.jpg"
 *      https://commons.wikimedia.org/wiki/File:EQT_Plaza,_2025-11-04.jpg
 *      Cbaile19, CC0 — the west arch face in sun: arch rise (~0.2 of the
 *      chord), the top band, the glass strips, the setback, colour.
 *    "EQT Plaza, Liberty Avenue, 2015-04-23.jpg"
 *      https://commons.wikimedia.org/wiki/File:EQT_Plaza,_Liberty_Avenue,_2015-04-23.jpg
 *      Cbaile19, CC0 — the west face top to bottom.
 *    "Pittsburgh Downtown 2019-06-25 EQT Plaza.jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh_Downtown_2019-06-25_EQT_Plaza.jpg
 *      Cbaile19, CC0 — from the east: the east arch beside the slab, the
 *      east wing and the round-headed opening at its foot.
 *    "Two PNC Plaza and EQT Plaza, Pittsburgh, 2019-10-29.jpg"
 *      https://commons.wikimedia.org/wiki/File:Two_PNC_Plaza_and_EQT_Plaza,_Pittsburgh,_2019-10-29.jpg
 *      Cbaile19, CC0 — window pattern and pale granite accents close up.
 *  - colour: rose-brown polished granite with paler granite bands, pulled
 *    to the palette's lightness; reflective light glass (light window
 *    variant); a silver truss; the barrel glass `glass`.
 * Estimated: the truss's depth and the arch rise above the barrel (photo,
 *   against the lidar chord); bay widths and window groups; the top band's
 *   height (photo, ~4 storeys); the base opening's size and position (one
 *   oblique photo; drawn centred on the east wing's east face, 9 m wide).
 *
 * Doubts: the base arch is seen in one photo only, partly behind traffic
 * signals; its exact place along the face is a guess. The south and north
 * faces of the lower floors are only seen obliquely. Night: the windows
 * glow; the red "EQT" sign on the slab is left out (not traced); the arch
 * is not floodlit in any licensed photo found.
 *
 * Left out: the corner spheres at the arch's feet, the round medallions,
 * the columns in the top band's recess, the low plaza canopies, mullions.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant, PALETTE } from './palette'
import { block, onWall, panel, rect, save, type XY } from './chi-aon-center'

const faces = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]

function build() {
  const gran = new Part(), pale = new Part(), win = new Part(), glass = new Part(), steel = new Part(), roof = new Part()

  const BASE = 74.8, PAR = 118.5, TOP = 131.5, BAND = 103.5
  const SX0 = -22, SX1 = -2, SY0 = -20, SY1 = 16.5 // the slab
  const CY0 = -18, CY1 = 16 // the crown blocks

  // ---- masses
  block(gran, roof, rect(-42, -20, 23, 18), 0, BASE, 0.4)
  block(gran, roof, rect(-42, CY0, 3, CY1), BASE, PAR, 0.4)
  block(gran, null, rect(SX0, SY0, SX1, SY1), BASE - 0.5, TOP, 0.4)
  // the slab's roof sunk inside its parapet
  {
    const r = rect(SX0 + 1.2, SY0 + 1.2, SX1 - 1.2, SY1 - 1.2)
    const { walls, cap } = { walls: (p: Part, q: XY[], z0: number, z1: number) => { for (let i = 0; i < q.length; i++) { const a = q[(i + 1) % q.length], b = q[i]; p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) } }, cap: (p: Part, q: XY[], z: number) => p.cap(q.map(([x, y]) => [x, y, z] as V3), true) }
    walls(pale, r, 127, TOP - 0.4)
    cap(roof, r, 127)
    // the coping: a pale ring on the parapet's top
    const o = rect(SX0 + 0.4, SY0 + 0.4, SX1 - 0.4, SY1 - 0.4)
    for (let i = 0; i < 4; i++) {
      const a = o[i], b = o[(i + 1) % 4], c = r[(i + 1) % 4], d = r[i]
      pale.quad([a[0], a[1], TOP], [b[0], b[1], TOP], [c[0], c[1], TOP - 0.4], [d[0], d[1], TOP - 0.4])
    }
  }

  // ---- pale granite string courses: at the setback and under the top band
  const course = (x0: number, y0: number, x1: number, y1: number, z: number, h = 1.2, out = 0.12) => {
    for (const [a, b] of faces(x0, y0, x1, y1)) { const { L } = onWall(a, b); panel(pale, a, b, 0, L, z, z + h, out) }
  }
  course(-42, -20, 23, 18, BASE - 1.6)
  course(-42, CY0, SX0, CY1, BAND - 1.4)
  course(SX1, CY0, 3, CY1, BAND - 1.4)
  course(-42, -20, 23, 18, 0, 6.5, 0.1) // the pale granite base storeys

  // ---- windows
  // bays of punched windows grouped three storeys to a panel, wall between
  const STY = 3.9
  // (a pair of window columns and two storeys to a panel: the photos'
  // punched windows come in pairs between broader granite piers)
  const grid = (a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, bay = 5.4, w = 2.6) => {
    const n = Math.max(1, Math.round((s1 - s0) / bay)), bw = (s1 - s0) / n, ww = Math.min(w, bw - 1.2)
    const rowsN = Math.max(1, Math.round((z1 - z0) / (2 * STY))), rh = (z1 - z0) / rowsN
    for (let i = 0; i < n; i++) for (let r = 0; r < rowsN; r++) {
      const c = s0 + (i + 0.5) * bw
      panel(win, a, b, c - ww / 2, c + ww / 2, z0 + r * rh + 1.3, z0 + (r + 1) * rh - 1.2, 0.05)
    }
  }
  // the central triple glass strip: three tall lights, 1.4 m, 0.9 m apart
  const strips = (a: XY, b: XY, c: number, z0: number, z1: number) => {
    for (const d of [-2.3, 0, 2.3]) panel(win, a, b, c + d - 0.7, c + d + 0.7, z0, z1, 0.06)
    panel(pale, a, b, c - 3.6, c + 3.6, z1, z1 + 1.2, 0.1)
  }
  // a face with strips in its middle: grid either side
  const face = (a: XY, b: XY, z0: number, z1: number, stripTop: number | null, end = 1.2) => {
    const { L } = onWall(a, b), c = L / 2
    if (stripTop === null) { grid(a, b, end, L - end, z0, z1); return }
    strips(a, b, c, z0, stripTop)
    grid(a, b, end, c - 4.2, z0, z1)
    grid(a, b, c + 4.2, L - end, z0, z1)
    if (z1 > stripTop + 2.5) grid(a, b, c - 3.6, c + 3.6, stripTop + 1.6, z1)
  }
  // shaft faces (S, E, N, W of the 65 x 38 m base)
  {
    const [s, e, n, w] = faces(-42, -20, 23, 18)
    // the long faces: strips under the slab, grid elsewhere
    for (const [a, b] of [s, n]) {
      const { L } = onWall(a, b)
      const slabC = a[0] < b[0] ? (SX0 + SX1) / 2 - a[0] : a[0] - (SX0 + SX1) / 2
      strips(a, b, slabC, 7.5, BASE - 3)
      grid(a, b, 1.2, slabC - 4.2, 7.5, BASE - 2.4)
      grid(a, b, slabC + 4.2, L - 1.2, 7.5, BASE - 2.4)
    }
    face(w[0], w[1], 7.5, BASE - 2.4, BASE - 3) // the west face: its strip runs on up the crown block
    face(e[0], e[1], 7.5, BASE - 2.4, null)
    // the east face's tall round-headed opening at the foot, centred
    const { L, P } = onWall(e[0], e[1]), c = L / 2, r = 4.5, zs = 9.5
    const pts: [number, number][] = [[c - r, 0], [c + r, 0]]
    for (let i = 0; i <= 10; i++) { const t = (Math.PI * i) / 10; pts.push([c + r * Math.cos(t), zs + r * Math.sin(t)]) }
    const frame = (p: Part, k: number, out: number) => {
      const ctr = P(c, zs * 0.6, out)
      const q = pts.map(([s, z]) => [c + (s - c) * k, z === 0 ? 0 : zs + (z - zs) * k + (k - 1) * 0] as [number, number])
      for (let i = 0; i < q.length; i++) { const u = q[i], v = q[(i + 1) % q.length]; p.tri(ctr, P(u[0], u[1], out), P(v[0], v[1], out)) }
    }
    frame(pale, 1.18, 0.14)
    frame(win, 1.0, 0.2)
  }
  // crown block faces: west (strip continues), and the y faces
  {
    const [, , n, w] = faces(-42, CY0, SX0, CY1)
    const { L } = onWall(w[0], w[1])
    strips(w[0], w[1], L / 2, BASE, BAND - 1.6)
    grid(w[0], w[1], 1.2, L / 2 - 4.2, BASE + 0.5, BAND - 1.6)
    grid(w[0], w[1], L / 2 + 4.2, L - 1.2, BASE + 0.5, BAND - 1.6)
    const [s] = faces(-42, CY0, SX0, CY1)
    for (const [a, b] of [s, n]) grid(a, b, 1.2, onWall(a, b).L - 1.2, BASE + 0.5, BAND - 1.6)
    // the top band: tall windows, a deeper recessed bay in the middle
    for (const [a, b] of [w, s, n]) {
      const { L: l } = onWall(a, b), k = Math.max(2, Math.round(l / 3.6)), bw = l / k
      for (let i = 0; i < k; i++) {
        const c = (i + 0.5) * bw
        panel(win, a, b, c - 0.8, c + 0.8, BAND + 0.6, PAR - 1.4, 0.05)
      }
    }
    // the east strip's faces between the slab and the wing roof
    const [es, ee, en] = faces(SX1, CY0, 3, CY1)
    face(ee[0], ee[1], BASE + 0.5, BAND - 1.6, BAND - 1.6)
    for (const [a, b] of [es, en]) grid(a, b, 0.6, onWall(a, b).L - 0.6, BASE + 0.5, BAND - 1.6, 3.6, 2.2)
    const { L: el } = onWall(ee[0], ee[1]), k = Math.round(el / 3.6), bw = el / k
    for (let i = 0; i < k; i++) panel(win, ee[0], ee[1], (i + 0.5) * bw - 0.8, (i + 0.5) * bw + 0.8, BAND + 0.6, PAR - 1.4, 0.05)
  }
  // the slab: its long faces carry the strip full height, its end faces above the crown blocks
  {
    const [s, e, n, w] = faces(SX0, SY0, SX1, SY1)
    for (const [a, b] of [s, n]) {
      const { L } = onWall(a, b)
      strips(a, b, L / 2, BASE + 0.5, TOP - 6)
      grid(a, b, 1.2, L / 2 - 4.2, BASE + 0.5, TOP - 3)
      grid(a, b, L / 2 + 4.2, L - 1.2, BASE + 0.5, TOP - 3)
    }
    for (const [a, b] of [e, w]) grid(a, b, 1.5, onWall(a, b).L - 1.5, PAR + 0.8, TOP - 3)
  }

  // ---- the arches: a glass barrel over each crown block, a steel truss arch on its outer face
  const CH = CY1 - CY0, YC = (CY0 + CY1) / 2, RISE = 6.6
  const R = (CH * CH / 4 + RISE * RISE) / (2 * RISE), ZC = PAR + RISE - R // circle centre
  const arcZ = (y: number, r: number) => ZC + Math.sqrt(Math.max(0, r * r - (y - YC) ** 2))
  const N = 14
  const ys = Array.from({ length: N + 1 }, (_, i) => CY0 + (CH * i) / N)
  const barrel = (x0: number, x1: number, outerX: number) => {
    const rIn = R - 1.6
    // glass roof under the truss's inner chord, and its end lunettes
    for (let i = 0; i < N; i++) {
      const y0 = ys[i], y1 = ys[i + 1], z0 = Math.max(PAR, arcZ(y0, rIn)), z1 = Math.max(PAR, arcZ(y1, rIn))
      glass.quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z1], [x0, y1, z1].map((v) => v) as V3)
      for (const [x, sgn] of [[x0, -1], [x1, 1]] as [number, number][]) {
        const A: V3 = [x, y0, PAR], B: V3 = [x, y1, PAR], C: V3 = [x, y1, z1], D: V3 = [x, y0, z0]
        if (sgn > 0) glass.quad(A, B, C, D); else glass.quad(B, A, D, C)
      }
    }
    // the truss: outer and inner chords and a zigzag web, as flat bars
    // facing out from the end face, a metre proud of the glass
    const sgn = outerX > (x0 + x1) / 2 ? 1 : -1, xf = outerX + sgn * 0.25
    const bar2 = (p: [number, number], q: [number, number], w: number) => {
      const dy = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dy, dz) || 1, ny = (-dz / l) * w / 2, nz = (dy / l) * w / 2
      const a: V3 = [xf, p[0] + ny, p[1] + nz], b: V3 = [xf, p[0] - ny, p[1] - nz], c: V3 = [xf, q[0] - ny, q[1] - nz], d: V3 = [xf, q[0] + ny, q[1] + nz]
      steel.quad(a, b, c, d); steel.quad(a, d, c, b)
      // a little depth back toward the glass so it reads from an angle
      const back = (v: V3): V3 => [v[0] - sgn * 1.0, v[1], v[2]]
      steel.quad(a, d, back(d), back(a)); steel.quad(a, back(a), back(d), d)
    }
    const rOut = R, rMid = R - 1.6
    for (let i = 0; i < N; i++) {
      const y0 = ys[i], y1 = ys[i + 1]
      bar2([y0, arcZ(y0, rOut) - 0.45], [y1, arcZ(y1, rOut) - 0.45], 0.9)
      bar2([y0, Math.max(PAR, arcZ(y0, rMid))], [y1, Math.max(PAR, arcZ(y1, rMid))], 0.7)
      const ym = (y0 + y1) / 2
      bar2([y0, Math.max(PAR, arcZ(y0, rMid))], [ym, arcZ(ym, rOut) - 0.45], 0.5)
      bar2([ym, arcZ(ym, rOut) - 0.45], [y1, Math.max(PAR, arcZ(y1, rMid))], 0.5)
    }
  }
  barrel(-42, SX0, -42)
  barrel(SX1, 3, 3)

  return [
    { part: gran, material: finish('eqt-granite', 0xb39488) },
    { part: pale, material: finish('eqt-granite-pale', 0xd9c5b6) },
    { part: win, material: windowVariant(1, 0xa9bfd1) },
    { part: glass, material: { ...PALETTE.glass, color: 0x74889a } }, // the lunettes read dark in every photo
    { part: steel, material: { ...finish('arch-steel', 0xd3d8dd), roughness: 0.5 } },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pit-eqt-plaza', 'EQT Plaza', [40.4424909, -80.000811], 341.5, build(), 5000)
