/**
 * Elsinore Arch (Elsinore Tower), Gilbert Avenue at Elsinore Place, the
 * entrance to Eden Park, Cincinnati (1883; a castle gatehouse after
 * Hamlet's Elsinore, built over a waterworks valve house) — original procedural geometry, CC0-1.0.
 * bun generators/cin-elsinore-arch.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 19.9 (the gate's own axis): the curtain wall runs
 * along y, the road passes through its arch along x. The round tower is
 * at -y (south-west end), the square tower at +y.
 * Anchor = centroid of OSM way/46695911, -84.499659, 39.113028.
 *
 * Identity (from the photos below):
 *  1. The round tower: rock-faced grey stone, a corbelled (machicolated)
 *     band near the top, crenellated parapet, small windows climbing it
 *     and a small round-headed door at its foot.
 *  2. The square tower at the other end, crenellated, with its own corbel
 *     band and paired windows.
 *  3. The crenellated curtain wall between them with the big round-headed
 *     carriage arch, a diamond panel over it and small windows.
 *
 * Plan: OSM way/46695911 (outline) and its building:part ways
 * way/1479907625 (round tower), /1479907626 (square tower), /1479907627
 * (the wall over the arch), /1479907628 and /1479907629 (the piers),
 * checked against lidar: round tower centre (-0.4, -5.0), radius 3.5 at
 * the base and 4.0 at the corbelled crown; square tower 5 m square at
 * y 8.2–13.2; wall about 2.2 m thick.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown about 2021), 0.5 m grid. y = 0 is the lowest ground (south-west of
 * the round tower, lidar ground_min + 1.1); the road through the arch is
 * about 0.7 m higher. Measured: round tower merlons 17.9, its roof 16.8;
 * square tower merlons 13.9, roof 12.9; wall merlons 11.0, wall walk about 9.8. OSM's
 * height tags (10, 8, 6) are too low and are not used. Estimated from the
 * photos: the arch (5 m wide, springing 3.8, crown 6.3), the corbel bands,
 * merlon sizes, windows and the door.
 *
 * Ground: Mapterhorn and lidar within about 1 m over the site; elevation 0.
 *
 * Night: the windows glow; the gate is not floodlit in the daylight
 * photos used (the 2025 dusk photo shows it lit from below, not modelled).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - ElsinoreArch.jpg, Greg Hume (Greg5030), CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:ElsinoreArch.jpg
 *  - Elsinore Tower View 2.JPG and View 5.JPG, Joe D. Good, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Elsinore_Tower_View_2.JPG
 *    https://commons.wikimedia.org/wiki/File:Elsinore_Tower_View_5.JPG
 *  - Romanesque Revival - Cincinnati, OH - Elsinore Arch.jpg,
 *    Bmzuckerman, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Romanesque_Revival_-_Cincinnati,_OH_-_Elsinore_Arch.jpg
 *  - Elsinore Arch PXL 20250702 012504018.jpg, Hayden Schiff, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Elsinore_Arch_PXL_20250702_012504018.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: in the street photos the square tower looks nearly as tall as
 * the round one; lidar (0.5 m, consistent over the whole top) puts it 4 m
 * lower, and the model follows lidar. The window places are read from the photos of the two street
 * fronts and mirrored where one side is hidden.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const TAU = Math.PI * 2

/** Merlons round a circle: n blocks of angular width frac/n, radial depth d, from z0 to z1. */
function merlonsRound(p: Part, c: XY, r: number, n: number, z0: number, z1: number, d = 0.55, frac = 0.55) {
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * TAU, a1 = a0 + (frac / n) * TAU
    const ring: XY[] = [[c[0] + (r - d) * Math.cos(a0), c[1] + (r - d) * Math.sin(a0)], [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)], [c[0] + (r - d) * Math.cos(a1), c[1] + (r - d) * Math.sin(a1)]]
    const ccw = ring // inner a0, outer a0, outer a1, inner a1: counter-clockwise from above
    const A = (q: XY, z: number): V3 => [q[0], q[1], z]
    for (let i = 0; i < 4; i++) {
      const a = ccw[i], b = ccw[(i + 1) % 4]
      p.quad(A(a, z0), A(b, z0), A(b, z1), A(a, z1))
    }
    p.quad(A(ccw[0], z1), A(ccw[1], z1), A(ccw[2], z1), A(ccw[3], z1))
  }
}
/** Merlons along a straight parapet a→b (outside to the right), n of them, each w long. */
function merlonsLine(p: Part, a: XY, b: XY, n: number, w: number, z0: number, z1: number, d = 0.5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  for (let k = 0; k < n; k++) {
    const s = (L / n) * (k + 0.5)
    const P = (u: number, o: number): XY => [a[0] + t[0] * u + nn[0] * o, a[1] + t[1] * u + nn[1] * o]
    const q = [P(s - w / 2, 0), P(s + w / 2, 0), P(s + w / 2, -d), P(s - w / 2, -d)]
    const xs = q.map((v) => v[0]), ys = q.map((v) => v[1])
    box(p, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), z0, z1, p, 0.06)
  }
}

if (import.meta.main) {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  // ── the curtain wall with the carriage arch ──
  const X0 = -0.2, X1 = 2.0, YA = -2.0, YB = 8.5, ZW = 9.8, ZM = 11.0
  const O0 = 1.3, O1 = 6.3, ZS = 3.8, R = (O1 - O0) / 2, YC = (O0 + O1) / 2
  box(stone, X0, X1, YA, O0, 0, ZW, null, 0)
  box(stone, X0, X1, O1, YB, 0, ZW, null, 0)
  {
    // the part over the opening: both faces with the arch cut out, the intrados, the top
    const seg = 10
    const arc = Array.from({ length: seg + 1 }, (_, i) => { const a = Math.PI - (i / seg) * Math.PI; return [YC + R * Math.cos(a), ZS + R * Math.sin(a)] as [number, number] })
    const face = (x: number, out: boolean) => {
      const P = (y: number, z: number): V3 => [x, y, z]
      const half = seg / 2
      const tri = (a: V3, b: V3, c: V3) => (out ? stone.tri(a, b, c) : stone.tri(a, c, b))
      const TL = P(O0, ZW), TR = P(O1, ZW)
      for (let i = 0; i < half; i++) tri(TL, P(arc[i][0], arc[i][1]), P(arc[i + 1][0], arc[i + 1][1]))
      for (let i = half; i < seg; i++) tri(TR, P(arc[i][0], arc[i][1]), P(arc[i + 1][0], arc[i + 1][1]))
      tri(TL, P(arc[half][0], arc[half][1]), TR)
    }
    face(X1, true)
    face(X0, false)
    for (let i = 0; i < seg; i++) {
      const [y0, z0] = arc[i], [y1, z1] = arc[i + 1]
      stone.quad([X0, y1, z1], [X1, y1, z1], [X1, y0, z0], [X0, y0, z0])
    }
    // jambs of the opening below the springing are the pier faces (already there)
    stone.quad([X1, O0, ZW], [X1, O1, ZW], [X0, O1, ZW], [X0, O0, ZW])
  }
  // arch voussoirs (pale ring) on both faces and the diamond panel, small windows
  for (const [a, b] of [[[X1, YA], [X1, YB]], [[X0, YB], [X0, YA]]] as [XY, XY][]) {
    const L = YB - YA, sC = a[1] < b[1] ? YC - YA : YB - YC
    const ring: [number, number][] = []
    for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; ring.push([sC + (R + 0.55) * Math.cos(t), ZS + (R + 0.55) * Math.sin(t)]) }
    for (let i = 10; i >= 0; i--) { const t = Math.PI * i / 10; ring.push([sC + R * Math.cos(t), ZS + R * Math.sin(t)]) }
    // draw the ring as quads
    for (let i = 0; i < 10; i++) onWall(trim, a, b, [ring[i], ring[i + 1], ring[20 - i - 1], ring[20 - i]], 0.05)
    // diamond panel over the arch
    onWall(trim, a, b, [[sC, 7.3], [sC + 0.9, 8.2], [sC, 9.1], [sC - 0.9, 8.2]], 0.05)
    onWall(win, a, b, [[sC, 7.6], [sC + 0.6, 8.2], [sC, 8.8], [sC - 0.6, 8.2]], 0.08)
    // small square windows on the piers and a medallion
    for (const s of [sC - 4.6, sC + 4.6]) if (s > 0.5 && s < L - 0.5) onWall(win, a, b, rectShape(s - 0.35, s + 0.35, 6.4, 7.6), 0.06)
    onWall(trim, a, b, Array.from({ length: 10 }, (_, i) => [sC + 3.6 + 0.45 * Math.cos(i / 10 * TAU), 3.6 + 0.45 * Math.sin(i / 10 * TAU)] as [number, number]).filter(() => true), 0.05)
    // a corbel string under the merlons
    onWall(trim, a, b, rectShape(0.1, L - 0.1, ZW - 0.55, ZW - 0.1), 0.12)
  }
  merlonsLine(stone, [X1, YA], [X1, YB], 6, 0.9, ZW, ZM, 0.45)
  merlonsLine(stone, [X0, YB], [X0, YA], 6, 0.9, ZW, ZM, 0.45)

  // ── round tower ──
  const C: XY = [-0.4, -5.0], RB = 3.5, RC = 4.0, ZC0 = 14.2, ZR = 16.8, ZT = 17.9
  revolve(trim, C, [[RB + 0.2, 0], [RB + 0.2, 0.9], [RB, 1.1]], 16, 0, true, false)
  revolve(stone, C, [[RB, 1.1], [RB, ZC0]], 16, 0, false, false)
  revolve(trim, C, [[RB, ZC0], [RB + 0.15, ZC0 + 0.2], [RC - 0.05, ZC0 + 1.1], [RC, ZC0 + 1.3]], 16, 0, true, false)
  revolve(stone, C, [[RC, ZC0 + 1.3], [RC, ZR]], 16, 0, false, false)
  revolve(roof, C, [[RC, ZR], [RC - 0.6, ZR], [0, ZR]], 16, 0, true, false)
  merlonsRound(stone, C, RC, 10, ZR, ZT, 0.6, 0.55)
  // corbel teeth just under the band read as a darker line: a thin window-coloured ring of slots
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * TAU, P = (r: number, t: number, z: number): V3 => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), z]
    const t0 = a + 0.08, t1 = a + 0.3
    win.quad(P(RC + 0.02, t0, ZC0 + 1.35), P(RC + 0.02, t1, ZC0 + 1.35), P(RC + 0.02, t1, ZC0 + 1.95), P(RC + 0.02, t0, ZC0 + 1.95))
  }
  // windows: a stack on the outer (south-west) side and on the road sides; paired lights near the top
  const cyl = (p: Part, r: number, a: number, w: number, z0: number, z1: number) => {
    const h = w / 2 / r, P = (t: number, z: number): V3 => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), z]
    p.quad(P(a - h, z0), P(a + h, z0), P(a + h, z1), P(a - h, z1))
  }
  for (const a of [Math.PI, Math.PI * 1.25, Math.PI * 1.55, Math.PI * 0.2, Math.PI * 1.85]) {
    for (const z of [4.6, 8.4]) cyl(win, RB + 0.05, a, 0.5, z, z + 1.2)
    for (const d of [-0.11, 0.11]) cyl(win, RB + 0.05, a + d, 0.45, 11.6, 13.2)
  }
  // the small round-headed door at its foot, facing the road (+x side)
  {
    const a = -0.35, h = 0.65 / RB, P = (t: number, z: number): V3 => [C[0] + (RB + 0.06) * Math.cos(t), C[1] + (RB + 0.06) * Math.sin(t), z]
    door.quad(P(a - h, 0.7), P(a + h, 0.7), P(a + h, 2.6), P(a - h, 2.6))
    for (let i = 0; i < 6; i++) { const u0 = Math.PI * i / 6, u1 = Math.PI * (i + 1) / 6; door.tri(P(a, 2.6), P(a + h * Math.cos(u0), 2.6 + 0.65 * Math.sin(u0)), P(a + h * Math.cos(u1), 2.6 + 0.65 * Math.sin(u1))) }
  }

  // ── square tower ──
  const SX0 = -2.5, SX1 = 2.5, SY0 = 8.2, SY1 = 13.2, ZSB = 11.0, ZSR = 12.9, ZST = 13.9
  box(trim, SX0 - 0.15, SX1 + 0.15, SY0 - 0.15, SY1 + 0.15, 0, 0.9, null, 0)
  box(stone, SX0, SX1, SY0, SY1, 0, ZSB, null, 0)
  box(trim, SX0 - 0.3, SX1 + 0.3, SY0 - 0.3, SY1 + 0.3, ZSB, ZSB + 0.5, null, 0.1)
  box(stone, SX0 - 0.3, SX1 + 0.3, SY0 - 0.3, SY1 + 0.3, ZSB + 0.5, ZSR, roof, 0)
  const sq: [XY, XY][] = [[[SX0 - 0.3, SY0 - 0.3], [SX1 + 0.3, SY0 - 0.3]], [[SX1 + 0.3, SY0 - 0.3], [SX1 + 0.3, SY1 + 0.3]], [[SX1 + 0.3, SY1 + 0.3], [SX0 - 0.3, SY1 + 0.3]], [[SX0 - 0.3, SY1 + 0.3], [SX0 - 0.3, SY0 - 0.3]]]
  for (const [a, b] of sq) merlonsLine(stone, a, b, 3, 0.95, ZSR, ZST, 0.45)
  const sf: [XY, XY][] = [[[SX0, SY0], [SX1, SY0]], [[SX1, SY0], [SX1, SY1]], [[SX1, SY1], [SX0, SY1]], [[SX0, SY1], [SX0, SY0]]]
  for (const [a, b] of sf) {
    for (const d of [-0.45, 0.45]) onWall(win, a, b, rectShape(2.5 + d - 0.25, 2.5 + d + 0.25, 9.4, 10.8), 0.06)
    onWall(win, a, b, rectShape(2.2, 2.8, 5.6, 6.8), 0.06)
  }
  // a door in the square tower's road side
  onWall(door, [SX1, SY0], [SX1, SY1], archShape(2.5, 1.1, 0.7, 2.4, 6), 0.06)

  await save('cin-elsinore-arch', 'Elsinore Arch', [
    { part: stone, material: finish('elsinore-stone', 0xd9d2c3) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('elsinore-door', 0x5a4a3e) },
  ], { height: ZT, anchor: [39.113028, -84.499659], bearing: 19.9 })
}
