/**
 * Akasaka Palace, the State Guest House (迎賓館赤坂離宮; Katayama Tōkuma,
 * 1909), Moto-Akasaka, Tokyo — procedural, CC0-1.0.
 * bun generators/tokyo-akasaka-palace.ts
 *
 * Writes models/tokyo-akasaka-palace.glb (low) and
 * models/tokyo-akasaka-palace.detail.glb (detail: round columns with bases
 * and capitals, window pediments, the balustrades' balusters, chimney caps,
 * the roofline sculpture in full: the two armoured warriors on the central
 * pavilion, the globes with their gilt phoenixes, the roof cresting).
 *
 * Map frame: x east, y north, z up, metres, turned to the palace's axis:
 * OSM relation/6109212 has its sides at 6° / 96°, so the catalog bearing is
 * 6. Origin: the outline's centroid (139.7287949, 35.6802469). The palace
 * is symmetric about x = -3.5 in this frame (the middle of the entrance
 * pavilion, the two courts and the two wings); it is drawn about that axis
 * and shifted. The entrance front faces north (+y) onto the forecourt; the
 * garden front faces south.
 *
 * Identity, in order: the long neo-baroque granite palace in a U, its two
 * wings reaching forward round the forecourt in concave quadrant curves;
 * the green copper roofs behind the balustrade with tall black chimneys;
 * the entrance pavilion with its pediment, paired columns over the
 * porte-cochère's piers and the roofline sculpture — two armoured warriors
 * at its corners and the cresting, two green globes with gilt phoenixes on
 * the front — and the pedimented pavilions at the wing ends; on the garden
 * front, the deep two-storey loggia of paired columns over an arcade
 * between pedimented pavilions.
 *
 * Evidence:
 *  - OSM relation/6109212 (迎賓館, 2 levels): its outer ring and five holes
 *    (the two central light courts, 18.8 × 22.5 m, the east court and two
 *    small corner courts). Read in this frame about the axis u = x + 3.5:
 *    wings |u| 42.1-58.4 from y 7.3 to 46.5, their end pavilions |u|
 *    45-56.2 to 47; the quadrant curves R 12.5 from the wings' inner sides
 *    (y 35) to the front at y 22.5; the entrance pavilion |u| < 10 to y
 *    25.5; the body |u| < 40.7 (47 south of y -17) to the garden front at
 *    y -34.4, its pavilions to -35.5 / -35.7; the stair turrets at the wings'
 *    outer corners (|u| 58.4, y 7.7, r 3.6); the courts |u| 5.4-24.0, y
 *    -11.5..11.0. OSM's west and east sides differ slightly (by up to 3 m);
 *    drawn symmetric. The east service block (u 40.7..59.5, y -26..7.3,
 *    with its court) is drawn as a plain block, as OSM has it.
 *  - published (ja/en.wikipedia 迎賓館): completed 1909, neo-baroque, granite
 *    facing, two storeys over a basement, copper roofs; the roofline
 *    sculpture of armoured warriors and the gilt phoenix-and-globe groups.
 *  - heights (estimates, scaled from Yasu's level view of the entrance
 *    front, the entrance pavilion 20 m wide = 21.5 px/m): ground storey to
 *    6.0, string course 6.0-6.6, main storey to 12.6, cornice 12.6-13.6,
 *    balustrade to 14.6; copper roof 14.2-15.8 (a low mansard, barely seen over the balustrade from the ground); entrance pavilion attic to
 *    16.6, its pediment 14.9-17.6, cresting to 18.1, the warriors to 21.4;
 *    globes 15.6-19.0; wing-end pavilions' roofs to 19.0, the garden pavilions' to 18.4-18.6;
 *    chimneys to 19.7.
 *  - colours (daylight photos, pulled to the palette): granite #d9d8d1
 *    (#cfcfc9-#e2e0d8), its plinth #c3c0b7; copper roofs and sculpture
 *    #79a893 (#5fa58a-#88b9a3); gilt #d5b25c; chimneys and ironwork
 *    charcoal #4a4f57; windows slate.
 *  - night: floodlit for state events; the windows lit.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - State Guest House Akasaka Palace main entrance.jpg, Yasu, CC BY-SA 3.0 (entrance pavilion, level)
 *  - 2019 Akasaka Palace 01.jpg, 02.jpg, 03.jpg, Kakidai, CC BY-SA 4.0 (the forecourt front; the garden front)
 *  - Akasaka Palace 1.jpg, 3.jpg, 4.jpg, 5.jpg, 6.jpg, Kakidai, CC BY-SA 4.0 (entrance; garden front; south-east)
 *  - Public open the Akasaka palace 01.JPG, Mr.Asylum, CC BY-SA 4.0 (loggia, oblique)
 *  - Akasaka Palace south 2010.jpg, Wiiii, CC BY-SA 3.0 (garden front)
 * No commercial imagery. No look-only references.
 *
 * Left out: the forecourt's railings, gates and lamp standards, the
 * fountain, the ramps; the window grilles; the carved trophies and
 * cartouches on the walls.
 * Doubts: the east block and the far sides are seen only obliquely; the
 * roof's mansard profile and its height behind the balustrade are
 * estimated from oblique views; the warriors are simplified figures.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { bar, lathe, ball, rbox, placed, save, type Mat } from './tokyo-meiji-jingu'
import { capPoly, clipY, clean, inset, prism as ringPrism, type XY } from './tokyo-metropolitan-government-building'

type Sz = { detail: boolean }
const AX = -3.5

/** The main outline about the axis (counter-clockwise), from the right half mirrored. */
function outline(): XY[] {
  const right: XY[] = [[0, -34.4], [35.5, -34.4], [35.5, -35.5], [47, -35.5], [47, -17], [40.7, -17], [40.7, 7.3], [58.4, 7.3], [58.4, 46.5], [42.1, 46.5]]
  const C: XY = [29.6, 35.0], R = 12.5
  for (let i = 0; i <= 6; i++) { const a = -(i / 6) * Math.PI / 2; right.push([C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)]) }
  right.push([0, 22.5])
  const left = right.slice(1, -1).reverse().map(([u, y]) => [-u, y] as XY)
  return clean([...right.slice(0, -1), [0, 22.5], ...left], 0.01)
}
const swap = (r: XY[]): XY[] => r.map(([x, y]) => [y, x])
const clipX = (r: XY[], x0: number, x1: number): XY[] => swap(clipY(swap(r), x0, x1))

/** The two central light courts (about the axis). */
const COURTS: [number, number, number, number][] = [[-24.0, -11.5, -5.4, 11.0], [5.4, -11.5, 24.0, 11.0]]

/** A loft between two rings; ring order as given (both the same length). */
function loft2(p: Part, a: XY[], za: number, b: XY[], zb: number) {
  p.loft([a.map(([x, y]) => [x, y, za] as V3), b.map(([x, y]) => [x, y, zb] as V3)])
}
const rectRing = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

function build(S: Sz) {
  const R = { stone: new Part(), plinth: new Part(), roof: new Part(), win: new Part(), gilt: new Part(), dark: new Part() }
  const M = placed(R, 0, AX, 0)
  const ring = outline()
  const ZC0 = 12.6, ZC1 = 13.6, ZB = 14.6, ZR0 = 14.2, ZR1 = 15.8, MW = 4.0

  // ---- Walls, plinth, cornice, balustrade -----------------------------------
  ringPrism(M.plinth, inset(ring, -0.25), 0, 1.0, { top: false, bevel: 0.2 })
  ringPrism(M.stone, ring, 1.0, ZC0, { top: false, bevel: 0.35 })
  // string course between the storeys
  ringPrism(M.stone, inset(ring, -0.2), 6.0, 6.6, { top: false, bevel: 0.2 })
  loft2(M.stone, ring, 6.0, inset(ring, -0.2), 6.0)
  loft2(M.stone, inset(ring, -0.2), 6.6, ring, 6.6)
  // cornice: out 0.6, its underside, then the balustrade on the wall line
  const out = inset(ring, -0.6)
  ringPrism(M.stone, out, ZC0, ZC1, { top: false, bevel: 0.2 })
  loft2(M.stone, ring, ZC0, out, ZC0)
  loft2(M.stone, out, ZC1, ring, ZC1)
  ringPrism(M.stone, ring, ZC1, ZB, { top: false, bevel: 0.2 })
  const rin = inset(ring, 0.45)
  loft2(M.stone, ring, ZB, rin, ZB)
  loft2(M.stone, rin, ZB, rin, ZR0) // parapet's inner face, going down: faces in
  // ---- Courts: walls facing in, roofs sloping into them -----------------
  for (const [x0, y0, x1, y1] of COURTS) {
    const h = rectRing(x0, y0, x1, y1).reverse() // clockwise
    loft2(M.stone, h, 1.0, h, ZR0)
    const hx = rectRing(x0 - MW, y0 - MW, x1 + MW, y1 + MW).reverse()
    loft2(M.roof, h, ZR0, hx, ZR1)
  }
  // ---- The mansard roof and its flat top (pierced by the courts) ----------
  const top = inset(ring, MW)
  loft2(M.roof, rin, ZR0, top, ZR1)
  const cuts = COURTS.map(([x0, y0, x1, y1]) => [x0 - MW, y0 - MW, x1 + MW, y1 + MW])
  const ys = [...new Set([-100, 100, ...cuts.flatMap((c) => [c[1], c[3]])])].sort((a, b) => a - b)
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i], y1 = ys[i + 1], ym = (y0 + y1) / 2
    const band = clipY(top, y0, y1)
    if (band.length < 3) continue
    const holes = cuts.filter((c) => c[1] < ym && c[3] > ym).map((c) => [c[0], c[2]]).sort((a, b) => a[0] - b[0])
    let x = -200
    for (const [h0, h1] of [...holes, [200, 200]]) {
      const piece = clipX(band, x, h0)
      if (piece.length >= 3) capPoly(M.roof, piece, ZR1)
      x = h1
    }
  }

  // ---- East service block (as OSM: u 40.7..59.5, y -26..7.3) --------------
  const east = rectRing(40.7, -26, 59.5, 7.3)
  ringPrism(M.stone, east, 0, 12.6, { top: false, bevel: 0.3 })
  ringPrism(M.stone, inset(east, -0.4), 12.6, 13.4, { top: false, bevel: 0.2 })
  loft2(M.stone, inset(east, -0.4), 13.4, inset(east, 0.0), 13.4)
  loft2(M.roof, east, 13.4, inset(east, 3.0), 16.2)
  capPoly(M.roof, inset(east, 3.0), 16.2)

  // ---- Windows -----------------------------------------------------------
  // Ground storey: round-headed; main storey: tall, square-headed under a
  // small pediment (detail). One panel per real window, ~3.8 m bays.
  const arched = (p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, seg: number, outD = 0.05) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const P = (s: number, z: number): V3 => [a[0] + ux * s + nx * outD, a[1] + uy * s + ny * outD, z]
    p.quad(P(s0, z0), P(s1, z0), P(s1, zs), P(s0, zs))
    const r = (s1 - s0) / 2, c = (s0 + s1) / 2
    for (let i = 0; i < seg; i++) {
      const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
      p.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
    }
  }
  // the loggia's shadowed depth behind the columns (glazed doors, lit at night)
  for (const e of [-1, 1]) M.win.quad(...([[e * 10.4, -34.46, 6.9], [e * 34.9, -34.46, 6.9], [e * 34.9, -34.46, 12.4], [e * 10.4, -34.46, 12.4]] as V3[]).map((p, i, arr) => (e > 0 ? p : arr[[1, 0, 3, 2][i]])) as [V3, V3, V3, V3])
  const loggia = (a: XY, b: XY) => Math.abs(a[1] + 34.4) < 0.01 && Math.abs(b[1] + 34.4) < 0.01 && Math.min(Math.abs(a[0]), Math.abs(b[0])) >= 9.9
  const eastEdges: [XY, XY][] = [[[40.7, -26], [59.5, -26]], [[59.5, -26], [59.5, 7.3]]]
  for (const [a, b] of [...ring.map((p, i) => [p, ring[(i + 1) % ring.length]] as [XY, XY]), ...eastEdges]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3.0) continue
    const lg = loggia(a, b)
    const bay = lg ? 4.2 : 3.8
    const n = Math.max(1, Math.round((L - 1.6) / bay)), bw = (L - 1.6) / n
    for (let k = 0; k < n; k++) {
      const c = 0.8 + bw * (k + 0.5)
      if (lg) {
        // arcade below, tall glazed doors in the loggia above
        arched(M.win, a, b, c - 1.3, c + 1.3, 1.4, 4.0, S.detail ? 10 : 6)
      } else {
        arched(M.win, a, b, c - 0.8, c + 0.8, 1.7, 4.1, S.detail ? 8 : 4)
        const L2 = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L2, uy = (b[1] - a[1]) / L2, nx = uy, ny = -ux
        const P = (s: number, z: number, o = 0.05): V3 => [a[0] + ux * s + nx * o, a[1] + uy * s + ny * o, z]
        M.win.quad(P(c - 0.8, 7.4), P(c + 0.8, 7.4), P(c + 0.8, 10.6), P(c - 0.8, 10.6))
        if (S.detail) {
          // the window's pediment and sill
          const z = 10.9
          M.stone.quad(P(c - 1.15, z, 0.25), P(c + 1.15, z, 0.25), P(c, z + 0.65, 0.25), P(c, z + 0.65, 0.25))
          M.stone.quad(P(c - 1.15, z, 0.0), P(c - 1.15, z, 0.25), P(c, z + 0.65, 0.25), P(c, z + 0.65, 0.0))
          M.stone.quad(P(c + 1.15, z, 0.25), P(c + 1.15, z, 0.0), P(c, z + 0.65, 0.0), P(c, z + 0.65, 0.25))
          M.stone.quad(P(c - 1.15, z, 0.0), P(c + 1.15, z, 0.0), P(c + 1.15, z, 0.25), P(c - 1.15, z, 0.25))
        }
      }
    }
  }

  // ---- Columns -----------------------------------------------------------
  const column = (u: number, y: number, z0: number, z1: number, r: number) => {
    if (S.detail) {
      lathe(M.stone, u, y, [[r * 1.35, z0], [r * 1.35, z0 + 0.35], [r * 1.1, z0 + 0.5], [r, z0 + 0.7], [r * 0.9, z1 - 0.7], [r * 1.05, z1 - 0.55], [r * 1.35, z1 - 0.2], [r * 1.4, z1]], 12)
      rbox(M.stone, u, y, r * 1.45, r * 1.45, z1, z1 + 0.15)
    } else lathe(M.stone, u, y, [[r, z0], [r * 0.9, z1]], 6)
  }
  // Garden front: paired columns along the loggia (y -35.0), both sides.
  for (const e of [-1, 1]) for (let k = 0; k < 6; k++) {
    const c = 12.6 + k * 3.95
    for (const d of [-0.55, 0.55]) column(e * (c + d), -35.0, 6.6, ZC0, 0.4)
  }
  // Garden front, central pavilion: four columns under its pediment.
  for (const u of [-7.0, -2.5, 2.5, 7.0]) column(u, -36.6, 6.6, ZC0, 0.48)
  // Entrance front: four paired columns on the main storey, piers below.
  for (const u of [-6.6, -2.2, 2.2, 6.6]) {
    for (const d of [-0.5, 0.5]) column(u + d, 26.3, 7.2, ZC0, 0.38)
    rbox(M.stone, u, 27.6, 0.85, 1.9, 1.0, 6.6, 0, 'b')
  }
  // porch terrace over the piers, its balustrade, and the steps
  rbox(M.stone, 0, 27.6, 8.0, 2.4, 6.0, 6.6, 0, '')
  rbox(M.stone, 0, 29.85, 7.9, 0.15, 6.6, 7.5, 0, 'b')
  for (let k = 0; k < 5; k++) rbox(M.plinth, 0, 29.9 + (5 - k) * 0.225, 7.4, (5 - k) * 0.225, 0, (k + 1) * 0.2, 0, 'b')

  // ---- Pavilions: attics, pediments, roofs --------------------------------
  // A pavilion block from the wall line to z `za`, with a pediment on face
  // `dir` (+1 north, -1 south) and a hipped copper roof from `za` to `zr`.
  const pavilion = (u0: number, u1: number, y0: number, y1: number, za: number, zr: number, dir: number, ped: { w: number; h: number } | null) => {
    const r = rectRing(u0, y0, u1, y1)
    ringPrism(M.stone, r, 1.0, za, { top: false, bevel: 0.2 })
    const ro = inset(r, -0.5)
    ringPrism(M.stone, ro, za - 0.6, za, { top: false, bevel: 0.15 })
    loft2(M.stone, r, za - 0.6, ro, za - 0.6)
    loft2(M.stone, ro, za, r, za)
    // hipped roof: four planes to a short ridge
    const cx = (u0 + u1) / 2, cy = (y0 + y1) / 2, hx = (u1 - u0) / 2, hy = (y1 - y0) / 2, m = Math.min(hx, hy) * 0.85
    const tr = rectRing(cx - hx + m, cy - hy + m, cx + hx - m, cy + hy - m)
    loft2(M.roof, r, za, tr, zr)
    capPoly(M.roof, tr, zr)
    if (ped) {
      const yf = dir > 0 ? y1 : y0
      const P = (u: number, z: number, d: number): V3 => [cx + u, yf + dir * d, z]
      const zb = za - 0.6
      for (const d of [0.55, 0.0]) {
        const A = P(-ped.w, zb, d), B = P(ped.w, zb, d), T = P(0, zb + ped.h, d)
        if ((d > 0) === (dir > 0)) M.stone.tri(A, T, B); else M.stone.tri(A, B, T)
      }
      const A0 = P(-ped.w, zb, 0), A1 = P(-ped.w, zb, 0.55), B0 = P(ped.w, zb, 0), B1 = P(ped.w, zb, 0.55), T0 = P(0, zb + ped.h, 0), T1 = P(0, zb + ped.h, 0.55)
      const q = (a: V3, b: V3, c: V3, d: V3) => (dir > 0 ? M.stone.quad(d, c, b, a) : M.stone.quad(a, b, c, d))
      q(B0, T0, T1, B1); q(T0, A0, A1, T1)
      // the tympanum's carving, a slightly recessed darker field
      const t = (u: number, z: number): V3 => [cx + u, yf + dir * 0.58, z]
      if (dir > 0) M.plinth.tri(t(-ped.w * 0.75, zb + 0.25), t(0, zb + ped.h * 0.78), t(ped.w * 0.75, zb + 0.25))
      else M.plinth.tri(t(-ped.w * 0.75, zb + 0.25), t(ped.w * 0.75, zb + 0.25), t(0, zb + ped.h * 0.78))
    }
  }
  // Entrance pavilion (|u| < 10, to y 25.5): attic and pediment; a low
  // copper roof with cresting behind.
  pavilion(-10, 10, 14.0, 25.5, 16.6, 18.1, 1, { w: 7.6, h: 2.7 })
  // Garden pavilion and the four end pavilions.
  pavilion(-10, 10, -35.7, -24.0, 16.2, 18.4, -1, { w: 9.0, h: 2.8 })
  for (const e of [-1, 1]) {
    const [a, b] = e < 0 ? [-56.2, -45] : [45, 56.2]
    pavilion(a, b, 37.5, 47.2, 16.0, 19.0, 1, { w: 5.2, h: 2.2 })
    const [c, d] = e < 0 ? [-47, -35.5] : [35.5, 47]
    pavilion(c, d, -35.5, -25.0, 16.0, 18.6, -1, { w: 5.4, h: 2.2 })
  }
  // Entrance pavilion's front: three tall round-headed windows over three doors.
  const N0: XY = [-10, 25.5], N1: XY = [10, 25.5]
  for (const c of [-4.4, 0, 4.4]) {
    arched(M.win, N1, N0, 10 + c - 1.05, 10 + c + 1.05, 7.6, 10.6, S.detail ? 10 : 6)
    arched(M.win, N1, N0, 10 + c - 1.1, 10 + c + 1.1, 1.0, 4.4, S.detail ? 10 : 6)
  }
  // Garden pavilion's front: the same rhythm behind its columns.
  for (const c of [-4.75, 0, 4.75]) {
    arched(M.win, [-10, -35.7], [10, -35.7], 10 + c - 1.05, 10 + c + 1.05, 7.4, 10.6, S.detail ? 10 : 6)
    arched(M.win, [-10, -35.7], [10, -35.7], 10 + c - 1.1, 10 + c + 1.1, 1.4, 4.2, S.detail ? 10 : 6)
  }
  // The entrance front's small projections at |u| 23-29.5 carrying the globes.
  for (const e of [-1, 1]) {
    const [a, b] = e < 0 ? [-29.5, -23] : [23, 29.5]
    rbox(M.stone, (a + b) / 2, 23.1, 3.25, 1.0, 1.0, ZB, 0, 'b')
  }
  // Wing-end porches (porte-cochère canopies on the wing ends).
  for (const e of [-1, 1]) {
    rbox(M.stone, e * 50.6, 48.6, 3.2, 1.4, 3.6, 4.4, 0, '')
    for (const d of [-2.6, 2.6]) rbox(M.stone, e * 50.6 + d, 49.6, 0.25, 0.25, 1.0, 3.6, 0, 'tb')
  }

  // ---- Stair turrets at the wings' outer corners ------------------------
  for (const e of [-1, 1]) {
    lathe(M.stone, e * 58.4, 7.7, [[3.6, 0], [3.6, ZC0], [4.1, ZC0], [4.1, ZC1], [3.6, ZC1], [3.6, ZB]], S.detail ? 20 : 10)
    lathe(M.roof, e * 58.4, 7.7, [[3.6, ZB], [3.2, ZB + 1.2], [2.0, ZB + 2.4], [0.4, ZB + 3.0], [0.01, ZB + 3.1]], S.detail ? 20 : 10)
    for (const z of [3.0, 9.0]) for (const a of [e > 0 ? 0 : Math.PI]) {
      const x = e * 58.4 + Math.cos(a) * 3.65, y = 7.7
      rbox(M.win, x, y, 0.05, 0.6, z - 1.2, z + 1.0, 0, '')
    }
  }

  // ---- Chimneys ------------------------------------------------------------
  const chim: XY[] = [[-18.5, 18.0], [18.5, 18.0], [-18.5, -30.5], [18.5, -30.5], [-50.2, 30.0], [50.2, 30.0], [-50.2, 12.0], [50.2, 12.0], [-36.0, -14.0], [36.0, -14.0]]
  for (const [u, y] of chim) {
    rbox(M.dark, u, y, 0.75, 1.1, ZR0, 19.4, 0, "b")
    rbox(M.dark, u, y, 0.95, 1.3, 19.4, 19.7, 0, '')
  }

  // ---- Roofline sculpture ------------------------------------------------
  // Globes with gilt phoenixes over the front's projections (|u| 26.2).
  for (const e of [-1, 1]) {
    const u = e * 26.2, y = 23.0
    rbox(M.stone, u, y, 1.6, 1.1, ZB, 15.6)
    ball(M.roof, u, y, 17.3, 1.65, S.detail ? 16 : 8)
    rbox(M.gilt, u, y, 0.08, 1.4, 16.9, 17.1, 0, '')
    for (const s of [-1, 1]) {
      const bx = u + s * 1.7
      if (S.detail) {
        // a phoenix: body, raised wing, curling tail
        ball(M.gilt, bx, y + 0.2, 16.2, 0.45, 8, 0.6)
        ball(M.gilt, bx + s * 0.1, y + 0.6, 16.9, 0.22, 6)
        bar(M.gilt, [[bx, y, 16.2], [bx + s * 0.6, y - 0.1, 16.9], [bx + s * 1.2, y - 0.1, 17.8], [bx + s * 1.3, y, 18.3]], 0.14, 0.25, 0.25, true, true)
        bar(M.gilt, [[bx, y - 0.2, 16.0], [bx + s * 0.4, y - 0.8, 15.9], [bx + s * 0.2, y - 1.2, 16.3]], 0.3, 0.12, 0.12, true, true)
      } else {
        rbox(M.gilt, bx, y, 0.35, 0.5, 15.6, 16.6, 0, 'b')
        rbox(M.gilt, bx + s * 0.6, y, 0.6, 0.12, 16.4, 17.9, 0, 'b')
      }
    }
  }
  // The two armoured warriors at the entrance pavilion's corners (u ±8.6),
  // seated figures in armour and helmet, green copper.
  for (const e of [-1, 1]) {
    const u = e * 8.6, y = 24.6, z = 16.6
    const K = 1.45
    rbox(M.stone, u, y, 1.2, 1.0, z, z + 0.4*K)
    if (S.detail) {
      lathe(M.roof, u, y, [[1.0*K, z + 0.4*K], [0.9*K, z + 0.9*K], [0.7*K, z + 1.4*K], [0.62*K, z + 1.6*K], [0.72*K, z + 2.0*K], [0.65*K, z + 2.4*K], [0.3*K, z + 2.55*K], [0.01*K, z + 2.6*K]], 10)
      // helmet (kabuto) with its flaring neck guard and crest
      lathe(M.roof, u, y, [[0.01*K, z + 2.55*K], [0.75*K, z + 2.55*K], [0.6*K, z + 2.7*K], [0.42*K, z + 2.95*K], [0.3*K, z + 3.15*K], [0.01*K, z + 3.25*K]], 10)
      bar(M.roof, [[u - 0.35, y + 0.2, z + 3.1*K], [u, y + 0.25, z + 3.0*K], [u + 0.35, y + 0.2, z + 3.1*K]], 0.08, 0.35, 0.0, true, true)
      // arms and the halberd
      bar(M.roof, [[u + e * 0.7, y, z + 2.2*K], [u + e * 0.95, y + 0.3, z + 1.6*K], [u + e * 0.8, y + 0.6, z + 1.2*K]], 0.28, 0.14, 0.14, true, true)
      bar(M.roof, [[u - e * 0.7, y, z + 2.2*K], [u - e * 0.9, y + 0.2, z + 1.5*K]], 0.28, 0.14, 0.14, true, true)
      bar(M.roof, [[u - e * 0.95, y + 0.25, z + 0.4*K], [u - e * 0.95, y + 0.25, z + 3.9*K]], 0.1, 0.05, 0.05, true, true)
      rbox(M.roof, u - e * 0.95, y + 0.25, 0.04, 0.35, z + 3.4*K, z + 4.0*K)
      // trophies of arms behind
      for (const s of [-1, 1]) bar(M.roof, [[u, y - 0.6, z + 0.5*K], [u + s * 0.9, y - 0.7, z + 2.6*K]], 0.12, 0.06, 0.06, true, true)
    } else {
      lathe(M.roof, u, y, [[1.0*K, z + 0.4*K], [0.75*K, z + 1.6*K], [0.7*K, z + 2.3*K], [0.01*K, z + 3.2*K]], 6)
      rbox(M.roof, u - e * 0.95, y + 0.25, 0.1, 0.1, z + 0.4*K, z + 3.8*K, 0, 'b')
    }
  }
  // Cresting along the entrance pavilion's roof ridge.
  if (S.detail) for (let u = -6.0; u <= 6.01; u += 0.75) rbox(M.roof, u, 19.7, 0.06, 0.06, 18.1, 18.9, 0, 'b')
  rbox(M.roof, 0, 19.7, 6.2, 0.08, 18.75, 18.9, 0, '')
  for (const s of [-1, 1]) lathe(M.roof, s * 6.5, 19.7, [[0.4, 18.1], [0.25, 18.8], [0.3, 19.2], [0.01, 19.6]], 6)

  const lit = (k: number) => (p: V3, n: V3) => (p[2] < 1.0 || n[2] > 0.6 ? 0.25 * k : k)
  const parts: Mat[] = [
    { part: R.stone, material: { ...finish('granite', 0xd9d8d1), floodlight: lit(0.7) } },
    { part: R.plinth, material: finish('granite-plinth', 0xc3c0b7) },
    { part: R.roof, material: finish('copper-green', 0x79a893) },
    { part: R.win, material: PALETTE.window },
    { part: R.gilt, material: { ...finish('gilt', 0xd5b25c), floodlight: lit(1) } },
    { part: R.dark, material: finish('charcoal', 0x4a4f57) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 6, elevation: 0, height: 22.4, osm: 'relation/6109212' }
  await save('Akasaka Palace', build({ detail: false }), 'tokyo-akasaka-palace.glb', 6500, 250_000, extras)
  await save('Akasaka Palace', build({ detail: true }), 'tokyo-akasaka-palace.detail.glb', 40_000, 1536 * 1024, extras)
}
