/**
 * Carrie Blast Furnaces 6 and 7 (1907; National Historic Landmark),
 * Rankin, on the Monongahela above Pittsburgh — original procedural
 * geometry, CC0-1.0.
 * bun generators/pit-carrie-furnaces.ts
 *
 * Imports `drum` and `ring` from pit-hamerschlag-hall.ts (merge that first).
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. OSM maps no building here, so the
 * anchor is the midpoint between the two furnaces as the lidar shows them,
 * -79.890151 40.413221. The furnace line runs at 135.7°, so the catalog
 * bearing is 45.7: model +x (south-east) runs from furnace A (x -40) past
 * the stoves to furnace B (x 44.5); -y (south-west) is the ore yard with
 * its long concrete wall and the red ore bridge; +y the cast house side.
 *
 * Identity, in order: the two blast furnaces, dark steel shells inside
 * their frames with the uptakes and bleeders rising to 54 m, the inclined
 * skip bridges up to their tops and the downcomers sloping out to the dust
 * catchers; between them the two rows of four tall domed hot-blast stoves
 * and the slender stove chimney; the hot-blast mains; the massive concrete
 * ore-yard wall along the south-west side with the red ore bridge at its
 * south-east end; rust and weathered steel.
 *
 * Evidence:
 *  - plan and heights, measured: USGS 3DEP lidar PA_WesternPA_1_2019
 *    (flight 2019), 0.5 m grid, above the lowest ground by the ore wall
 *    (223.8 m NAVD88; the site is level to 2 m): furnace tops (bleeders)
 *    53.8 at (-40, 0.5) and (44.5, 1.5); south stove row y -5, four
 *    cylinders 6.2 m across at x -6.8..12.7, domes to 42.5; north row
 *    y 5, four cylinders 7 m across at x -13.2..9.3, domes to 37.9; the
 *    chimney at (-14, -4.5), 4 m across, 51; the hot-blast mains at 33-34;
 *    the skip bridges falling from 36 to 16 toward the south-west; the
 *    ore-yard wall x -68..46, y -28..-17, 9.4 with a rail edge to 12.6;
 *    the ore bridge frame x 46..56, y -26..-12, 27.6-36; the cast house
 *    north-east of furnace B (ridge 25.3) and the gas washer cylinder at
 *    (-7.5, 21), 43; the stoves and furnaces also show in USGS NAIP.
 *  - published: Carrie Furnaces 6 and 7, built 1907, blown out 1978-1982,
 *    National Historic Landmark 2006 (Wikipedia, "Carrie Blast Furnaces";
 *    NPS NHL listing).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Backside view of Carrie Blast Furnaces.jpg"
 *      https://commons.wikimedia.org/wiki/File:Backside_view_of_Carrie_Blast_Furnaces.jpg
 *      DASH713, CC BY-SA 4.0 — the two furnaces, stoves and chimney over the wall.
 *    "Carrie Blast Furnaces National Historic Landmark - Swissvale - Pennsylvania - USA - 18 (47828483741).jpg"
 *      https://commons.wikimedia.org/wiki/File:Carrie_Blast_Furnaces_National_Historic_Landmark_-_Swissvale_-_Pennsylvania_-_USA_-_18_(47828483741).jpg
 *      Adam Jones, CC BY-SA 2.0 — the ore bridge, wall and stoves.
 *    "Carrie Blast Furnaces National Historic Landmark - Swissvale - Pennsylvania - USA - 19 (33951272298).jpg"
 *      https://commons.wikimedia.org/wiki/File:Carrie_Blast_Furnaces_National_Historic_Landmark_-_Swissvale_-_Pennsylvania_-_USA_-_19_(33951272298).jpg
 *      Adam Jones, CC BY-SA 2.0 — stoves and furnace from the ore yard.
 *    "Carrie Blast Furnace.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carrie_Blast_Furnace.jpg
 *      Jmblough, CC BY-SA 4.0 — furnace, stoves, ore bridge.
 *    "Blast furnace, Carrie Furnaces, Rankin PA (8907655873).jpg"
 *      https://commons.wikimedia.org/wiki/File:Blast_furnace,_Carrie_Furnaces,_Rankin_PA_(8907655873).jpg
 *      Roy Luck, CC BY 2.0 — the skip bridge up to a furnace top.
 *  - colour: rusted steel and weathered grey stove shells pulled to the
 *    palette's lightness; the concrete wall; the ore bridge's red paint.
 * Estimated: the furnace shells' profile (hearth, bosh, stack, from the
 * photos; the shells are hidden in the frames in the lidar), the uptakes,
 * the downcomers and dust catchers (the lidar shows only low sloping roofs
 * on the outer sides, so the dust catchers are kept low), the frames, the
 * ore bridge's girders beyond the lidar box (cut at y -34). Doubts: the
 * low buildings north-east of the stoves are drawn as plain gabled sheds
 * cut at y 30; the blowing engine house further north-east is left out.
 * No OSM building covers the site, so `replaces` is empty.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { poly, wallsSplit } from './pit-allegheny-county-courthouse'
import { drum, ring } from './pit-hamerschlag-hall'

/** A round tube from a to b, radius r, `seg` sides, open ends capped. */
function tube(p: Part, a: V3, b: V3, r: number, seg = 8) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (x: V3, y: V3): V3 => [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  let v = cr(u, ref); const lv = Math.hypot(...v); v = [v[0] / lv, v[1] / lv, v[2] / lv]
  const w = cr(u, v)
  const at = (c: V3, t: number): V3 => [c[0] + r * (Math.cos(t) * v[0] + Math.sin(t) * w[0]), c[1] + r * (Math.cos(t) * v[1] + Math.sin(t) * w[1]), c[2] + r * (Math.cos(t) * v[2] + Math.sin(t) * w[2])]
  const nrm = (t: number): V3 => [Math.cos(t) * v[0] + Math.sin(t) * w[0], Math.cos(t) * v[1] + Math.sin(t) * w[1], Math.cos(t) * v[2] + Math.sin(t) * w[2]]
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(at(a, t0), at(a, t1), at(b, t1), undefined, undefined, undefined, [nrm(t0), nrm(t1), nrm(t1)])
    p.tri(at(a, t0), at(b, t1), at(b, t0), undefined, undefined, undefined, [nrm(t0), nrm(t1), nrm(t0)])
    poly(p, [a, at(a, t1), at(a, t0)], [-u[0], -u[1], -u[2]])
    poly(p, [b, at(b, t0), at(b, t1)], u)
  }
}

/** A square post or beam between two points, w wide. */
function beam(p: Part, a: V3, b: V3, w: number) { tube(p, a, b, w / Math.SQRT2, 4) }

/** A box between two corners. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(p, rect(x0, y0, x1, y1), z1)
}

/** A domed stove: a cylinder to z1, a hemispherical dome on top. */
function stove(shell: Part, cx: number, cy: number, r: number, z1: number) {
  drum(shell, cx, cy, r, 0, r, z1, 16)
  drum(shell, cx, cy, r + 0.15, z1 - 0.3, r + 0.15, z1 + 0.2, 16)
  ring(shell, cx, cy, r + 0.15, r, z1 - 0.3, false, 16)
  const prof: XY[] = Array.from({ length: 6 }, (_, i) => { const a = (i / 5) * (Math.PI / 2); return [r * Math.cos(a), z1 + 0.2 + r * 0.95 * Math.sin(a)] as XY })
  lathe(shell, cx, cy, prof, 16)
}

/** A gabled shed over [x0,y0,x1,y1] with the ridge along y. */
function shed(wall: Part, roof: Part, r: [number, number, number, number], eave: number, ridge: number) {
  const [x0, y0, x1, y1] = r, cx = (x0 + x1) / 2
  wallsSplit(wall, rect(x0, y0, x1, y1), 0, eave, 6)
  for (const y of [y0, y1]) poly(wall, [[x0, y, eave], [x1, y, eave], [cx, y, ridge]], [0, y === y0 ? -1 : 1, 0])
  poly(roof, [[x0 - 0.4, y0 - 0.3, eave - 0.2], [x0 - 0.4, y1 + 0.3, eave - 0.2], [cx, y1 + 0.3, ridge], [cx, y0 - 0.3, ridge]], [-1, 0, 1])
  poly(roof, [[x1 + 0.4, y0 - 0.3, eave - 0.2], [x1 + 0.4, y1 + 0.3, eave - 0.2], [cx, y1 + 0.3, ridge], [cx, y0 - 0.3, ridge]], [1, 0, 1])
}

function build() {
  const steel = new Part(), rust = new Part(), dark = new Part(), conc = new Part(), red = new Part()

  // ---- the ore-yard wall along the south-west side, with its rail edge
  wallsSplit(conc, rect(-68, -28, 46, -17), 0, 9.4, 5)
  cap(conc, rect(-68, -28, 46, -17), 9.4)
  box(rust, -68, -17.6, 46, -16.9, 9.4, 11.6)
  // the walkway deck along the stoves' side of the wall (south-east of furnace A to furnace B)
  for (let x = -60; x <= 40; x += 10) beam(rust, [x, -16.9, 0], [x, -16.9, 9.4], 0.6)

  // ---- the hot-blast stoves: two rows of four, and the chimney
  for (const x of [-6.8, -0.3, 6.2, 12.7]) stove(steel, x, -5, 3.1, 39.6)
  for (const x of [-13.2, -5.7, 1.8, 9.3]) stove(steel, x, 5, 3.4, 34.3)
  drum(steel, -14, -4.5, 2.05, 0, 1.9, 51, 12)
  drum(steel, -14, -4.5, 2.2, 49.8, 2.2, 51, 12)
  ring(steel, -14, -4.5, 2.2, 1.6, 51, true, 12)
  ring(dark, -14, -4.5, 1.6, 0, 50.4, true, 12)
  // hot-blast mains and the connections to the stoves
  tube(rust, [-34.5, 1, 33], [-15, 1, 33], 1.0, 8)
  tube(rust, [-15, 10, 33], [17.5, 10, 33], 1.0, 8)
  tube(rust, [17.5, 3, 33], [39.5, 3, 33], 1.0, 8)
  beam(rust, [-15, 1, 33], [-15, 10, 33], 1.4)
  beam(rust, [17.5, 3, 33], [17.5, 10, 33], 1.4)
  for (const x of [-13.2, -5.7, 1.8, 9.3]) tube(rust, [x, 8.3, 10], [x, 10, 32], 0.55, 6)
  for (const x of [-6.8, -0.3, 6.2, 12.7]) tube(rust, [x, -8, 3], [x, -14, 3], 0.7, 6)
  tube(rust, [-14, -14, 3], [16, -14, 3], 0.9, 8)
  // catwalk over the south stoves' domes
  box(rust, -8.5, -5.6, 14.5, -4.4, 43.0, 43.5)

  // ---- the two furnaces
  for (const [fx, fy, out] of [[-40, 0.5, -1], [44.5, 1.5, 1]] as [number, number, number][]) {
    // the shell: hearth, bosh, stack, top cone
    lathe(dark, fx, fy, [[4.2, 0], [4.2, 4.5], [4.4, 5.5], [5.1, 11.5], [4.7, 20], [3.9, 29.5], [2.5, 33], [2.0, 34.5], [0, 34.5]], 16)
    drum(rust, fx, fy, 5.6, 6.2, 5.6, 7.6, 16) // the bustle pipe round the tuyeres
    ring(rust, fx, fy, 5.6, 4.4, 6.2, false, 16)
    ring(rust, fx, fy, 5.6, 4.6, 7.6, true, 16)
    // the cast house floor round the hearth
    box(rust, fx - 7.5, fy - 7.5, fx + 7.5, fy + 7.5, 0, 3.8)
    // the frame: four corner columns, platforms at 31 and 44.5
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) beam(rust, [fx + sx * 6.2, fy + sy * 6.2, 3.8], [fx + sx * 5.2, fy + sy * 5.2, 45], 1.25)
    for (const [z, h] of [[31, 0.9], [44.4, 0.8]]) {
      const o = z < 40 ? 6.6 : 5.6, i = o - 1.6
      const R = rect(fx - o, fy - o, fx + o, fy + o), I = rect(fx - i, fy - i, fx + i, fy + i)
      walls(rust, R, z, z + h)
      walls(rust, [...I].reverse(), z, z + h)
      for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; rust.quad([R[k][0], R[k][1], z + h], [R[j][0], R[j][1], z + h], [I[j][0], I[j][1], z + h], [I[k][0], I[k][1], z + h]); rust.quad([R[k][0], R[k][1], z], [I[k][0], I[k][1], z], [I[j][0], I[j][1], z], [R[j][0], R[j][1], z]) }
    }
    // the uptakes from the top cone, joining over the furnace; two bleeders above
    for (let k = 0; k < 4; k++) {
      const t = Math.PI / 4 + (k * Math.PI) / 2
      tube(steel, [fx + 2.3 * Math.cos(t), fy + 2.3 * Math.sin(t), 33.5], [fx + 1.7 * Math.cos(t), fy + 1.7 * Math.sin(t), 49.5], 0.95, 8)
    }
    box(rust, fx - 2.8, fy - 2.8, fx + 2.8, fy + 2.8, 45.2, 48.5)
    for (const s of [-1, 1]) tube(steel, [fx + s * 1.3, fy + s * 0.6, 48.5], [fx + s * 1.3, fy + s * 0.6, 53.8], 0.6, 8)
    // the downcomer sloping in, toward the stoves, to the dust catcher
    const dx = fx - out * 12.5, dy = fy - 1.5
    tube(steel, [fx - out * 2.0, fy, 48], [dx + out * 1.2, dy, 25.5], 1.3, 10)
    drum(steel, dx, dy, 3.4, 9, 3.4, 21, 12)
    lathe(steel, dx, dy, [[3.4, 21], [1.3, 24.5], [1.3, 25.6], [0, 25.6]], 12)
    lathe(steel, dx, dy, [[0, 4.5], [1.0, 4.5], [3.4, 9]], 12)
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) beam(rust, [dx + sx * 2.7, dy + sy * 2.7, 0], [dx + sx * 2.7, dy + sy * 2.7, 11], 0.7)
    // the stock house shed on the outer side, its roof falling outward
    {
      const xi = fx + out * 6.5, xo = fx + out * 16, ya = fy - 12, yb = fy + 10
      const r = rect(Math.min(xi, xo), ya, Math.max(xi, xo), yb)
      wallsSplit(rust, r, 0, 8, 6)
      for (const y of [ya, yb]) poly(rust, [[xi, y, 8], [xo, y, 8], [xi, y, 16.5]], [0, y === ya ? -1 : 1, 0])
      poly(dark, [[xi, ya - 0.3, 16.5], [xi, yb + 0.3, 16.5], [xo + out * 0.4, yb + 0.3, 7.8], [xo + out * 0.4, ya - 0.3, 7.8]], [out, 0, 1.2])
      poly(rust, [[xi, ya, 8], [xi, yb, 8], [xi, yb, 16.5], [xi, ya, 16.5]], [-out, 0, 0])
    }
    // the skip bridge: an inclined truss from the wall up to the furnace top
    const y0 = fy - 17.5, y1 = fy - 4.5, z0 = 10.5, z1 = 44.0
    const hw = 1.5, d = 1.6
    const A0: V3 = [fx - hw, y0, z0], B0: V3 = [fx + hw, y0, z0], A1: V3 = [fx - hw, y1, z1], B1: V3 = [fx + hw, y1, z1]
    const dn = (q: V3): V3 => [q[0], q[1] + d * 0.93, q[2] - d * 0.36]
    poly(rust, [A0, B0, B1, A1], [0, -0.93, 0.36])
    poly(rust, [dn(A0), dn(A1), dn(B1), dn(B0)], [0, 0.93, -0.36])
    poly(rust, [A0, A1, dn(A1), dn(A0)], [-1, 0, 0])
    poly(rust, [B0, dn(B0), dn(B1), B1], [1, 0, 0])
    beam(rust, [fx, y0 + 4, 0], [fx, y0 + 4, z0 + 9], 1.0)
  }

  // ---- the gas washer cylinder and the sheds north-east of the stoves
  drum(steel, -7.5, 21, 3.0, 0, 3.0, 40.5, 14)
  lathe(steel, -7.5, 21, [[3.0, 40.5], [1.0, 42.5], [1.0, 43.0], [0, 43.0]], 14)
  shed(rust, dark, [-22, 13, -12, 30], 19, 27)
  shed(rust, dark, [1, 14, 10, 30], 18, 26)
  shed(rust, dark, [19, 9, 47, 30], 16, 25.3)

  // ---- the red ore bridge at the south-east end of the wall
  {
    const X0 = 46.5, X1 = 55.5, Y0 = -26, Y1 = -12
    for (const [x, y] of [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]) beam(red, [x, y, 9.4], [x, y, 36], 0.9)
    for (const z of [27.5, 35.4]) {
      beam(red, [X0, Y0, z], [X1, Y0, z], 0.7); beam(red, [X0, Y1, z], [X1, Y1, z], 0.7)
      beam(red, [X0, Y0, z], [X0, Y1, z], 0.7); beam(red, [X1, Y0, z], [X1, Y1, z], 0.7)
    }
    for (const [a, b] of [[[X0, Y0, 9.4], [X0, Y1, 27.5]], [[X1, Y1, 9.4], [X1, Y0, 27.5]], [[X0, Y0, 27.5], [X1, Y0, 35.4]], [[X1, Y1, 27.5], [X0, Y1, 35.4]]] as [V3, V3][]) beam(red, a, b, 0.5)
    // the bridge girders running out over the ore yard (cut at the lidar's edge)
    for (const x of [X0 + 1, X1 - 1]) {
      box(red, x - 0.5, -34, x + 0.5, -4, 33.4, 36.6)
    }
    box(red, X0, -24, X1, -14, 30.5, 33.4)
  }

  return [
    { part: steel, material: finish('weathered-steel', 0x9c968e) },
    { part: rust, material: finish('rust', 0xa57a63) },
    { part: dark, material: finish('dark-steel', 0x7a726b) },
    { part: conc, material: finish('concrete', 0xc1b7a5) },
    { part: red, material: finish('ore-bridge-red', 0xb56b5c) },
  ]
}

if (import.meta.main) await save('pit-carrie-furnaces', 'Carrie Blast Furnaces', [40.413221, -79.890151], 45.7, build() as any, 6500)
