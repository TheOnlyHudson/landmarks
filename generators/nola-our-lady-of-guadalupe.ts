/**
 * Our Lady of Guadalupe Church (the Old Mortuary Chapel, 1826-27), 411 North
 * Rampart Street, New Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-our-lady-of-guadalupe.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 306.8, square to the outline:
 * model −y is the front on North Rampart Street (facing compass 126.8);
 * model −x is the Conti Street side. Anchor: the area centroid of OSM
 * way/367725733 (-90.070714, 29.958482).
 *
 * Identity, in order: the pale stuccoed front with an open porch of three
 * round arches (and one at each side) under a plain entablature; the
 * curvilinear (scrolled) parapet gable stepping up to the square clock
 * tower over the front; the tower's cornice and its tall, slender slate
 * spire with a cross; the gabled nave with round-headed windows; the
 * transverse rear block with its scrolled gable ends and oculus.
 *
 * Evidence
 * - OSM way/367725733 (place_of_worship; height 19.4 from Microsoft
 *   footprints is the tower, not the roof). Model frame: the nave and porch
 *   x −6.7..6.6, y −18.9..1.8; the transverse rear block x −9.6..8.35,
 *   y 1.8..13.0; a lower rear wing x −4.5..8.35, y 13..17.5.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid in the model frame; ground 0.2 over the grid minimum. Nave
 *   eaves ~8.6, ridge 12.2 on the centre line; the rear block's ridge ~11.4
 *   running across (x); the rear wing ~7.0; the tower's top returns 16.9 at
 *   the front, the spire's tip not caught (max 21). The lidar sits ~1 m
 *   toward −x from OSM; the model follows OSM.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - Photos (all evidence):
 *   - "OLGuadalupeChurchNOLA1964RampartFascade.jpg", Dan Leyrer (HABS),
 *     public domain: the front face-on (58 px/m on the 13.3 m front) —
 *     arches (springing 4.7, tops 6.0, 2.6 wide), entablature 7.9-8.4,
 *     parapet 9.8 at the corners rising to 10.9, oculus at 9.6, tower 4.7 m
 *     wide to its cornice at 16.6, the spire to ~23.5 and the cross to 25
 *     https://commons.wikimedia.org/wiki/File:OLGuadalupeChurchNOLA1964RampartFascade.jpg
 *   - "OLGuadalupeChurchNOLA1964Corner.jpg", Dan Leyrer (HABS), public
 *     domain: the Conti side — five round-headed windows, the side arch,
 *     the scrolled gable of the rear block
 *     https://commons.wikimedia.org/wiki/File:OLGuadalupeChurchNOLA1964Corner.jpg
 *   - "RampartOurLadyGuadalupeOct07.jpg", Infrogmation of New Orleans,
 *     CC BY 3.0: the colours today (pale buff stucco, dark grey slate spire
 *     and roof), the clock faces
 *     https://commons.wikimedia.org/wiki/File:RampartOurLadyGuadalupeOct07.jpg
 *   - "Our Lady of Guadalupe Chapel, New Orleans, September 2021 - 03.jpg"
 *     and "... - 01.jpg", Infrogmation of New Orleans, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Our_Lady_of_Guadalupe_Chapel,_New_Orleans,_September_2021_-_03.jpg
 *     https://commons.wikimedia.org/wiki/File:Our_Lady_of_Guadalupe_Chapel,_New_Orleans,_September_2021_-_01.jpg
 *   - "Corner of Rampart and Conti, New Orleans, Louisiana.jpg", Ken Lund,
 *     CC BY-SA 2.0: the front at night, floodlit, green doors
 *     https://commons.wikimedia.org/wiki/File:Corner_of_Rampart_and_Conti,_New_Orleans,_Louisiana.jpg
 * - Published: Wikipedia, "Our Lady of Guadalupe Church (New Orleans)":
 *   built 1826-27 as the Mortuary Chapel, the oldest surviving church
 *   building in New Orleans.
 *
 * Measured (lidar): the plan, eaves and ridges, the rear wing. Estimated
 * from the face-on HABS photo: every front height listed above; the side
 * windows (1.5 wide, 3.0-7.0) from the corner photo. Invented: the east
 * (rectory) side repeats the Conti side's windows where it is not hidden;
 * the rear wing is a plain flat-roofed block.
 * Left out: the iron fence, the statues, the grotto, the lamps.
 *
 * Review round 1 changes: the porch's back wall, ceiling and inner sides are
 * a shadow colour with the doors set on the back wall 3.9 m in; the nave
 * roof hips back 3.4 m from the porch (invented, behind the parapet) and the
 * scrolled parapet rises to 11.3 at the tower, so the nave roof is hidden
 * face-on; the tower cornice raised to 16.8 (lidar 16.9) and the spire to
 * 24.6; each tower face has a louvred opening (dark, three slats) under a
 * white clock face with a dark rim and hands. Face-on, only the ridge of
 * the rear block (lidar 11.4, 20 m behind the front) still shows in an
 * orthographic view; from the street perspective hides it.
 *
 * Night: the front is floodlit (Ken Lund's photo), the windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { block, band, hipRoof } from './nyc-city-hall'
import { faceOf, fpanel, farch, fblock, fprism, rect } from './nola-gallier-hall'
import { archWall, quadN, triN, walls } from './nola-cabildo'

const stucco = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part(), shade = new Part()

const X0 = -6.7, X1 = 6.6, XC = (X0 + X1) / 2, YF = -18.9, YP = -15.0, YN = 1.8
const EAVE = 8.4, RIDGE = 12.2
const W = X1 - X0

// ─── The porch block: open arcade of three arches in front, one at each side ───
archWall(stucco, { a: [X0, YF], b: [X1, YF] }, 0, W, 0, EAVE - 0.5, 0.7,
  [-4.3, 0, 4.3].map((x) => ({ c: x + W / 2, w: 2.6, top: 6.0 })))
archWall(stucco, { a: [X0, YP], b: [X0, YF] }, 0, YP - YF, 0, EAVE - 0.5, 0.6, [{ c: (YP - YF) / 2, w: 2.3, top: 5.8 }])
archWall(stucco, { a: [X1, YF], b: [X1, YP] }, 0, YP - YF, 0, EAVE - 0.5, 0.6, [{ c: (YP - YF) / 2, w: 2.3, top: 5.8 }])
block(stucco, X0, YF, X1, YP, EAVE - 0.5, EAVE)
{ // the porch's shadowed ceiling and inner side walls
  const c0: V3 = [X0 + 0.6, YF + 0.7, EAVE - 0.52], c1: V3 = [X1 - 0.6, YF + 0.7, EAVE - 0.52], c2: V3 = [X1 - 0.6, YP, EAVE - 0.52], c3: V3 = [X0 + 0.6, YP, EAVE - 0.52]
  quadN(shade, c0, c1, c2, c3, [0, 0, -1])
  quadN(shade, [X0 + 0.62, YF + 0.7, 0], [X0 + 0.62, YP, 0], [X0 + 0.62, YP, EAVE - 0.52], [X0 + 0.62, YF + 0.7, EAVE - 0.52], [1, 0, 0])
  quadN(shade, [X1 - 0.62, YF + 0.7, 0], [X1 - 0.62, YP, 0], [X1 - 0.62, YP, EAVE - 0.52], [X1 - 0.62, YF + 0.7, EAVE - 0.52], [-1, 0, 0])
}
// impost bands and pier bases on the front
{
  const F = faceOf([X0, YF], [X1, YF])
  for (const x of [-6.45, -2.15, 2.15, 6.45]) {
    const s = x + W / 2
    fblock(trim, F, s - 0.75, s + 0.75, 4.55, 4.85, 0.12)
    fblock(stucco, F, s - 0.7, s + 0.7, 0, 0.5, 0.08)
  }
  // the doors at the back of the porch, seen through the arches
  const B = faceOf([X0, YP], [X1, YP])
  for (const x of [-4.3, 0, 4.3]) {
    farch(shade, B, x + W / 2, 3.4, 0, 6.6, 0.03, 8)            // the porch's shadowed back wall
    fpanel(door, B, x + W / 2 - 0.75, x + W / 2 + 0.75, 0, 3.3, 0.06)
    farch(win, B, x + W / 2, 1.5, 3.4, 4.3, 0.06, 8)
  }
}
// entablature right round the porch and nave
const navering: XY[] = rect(X0, YF, X1, YN)
band(trim, navering, EAVE - 0.5, EAVE, 0.28)
band(stucco, navering, 0, 0.45, 0.06)

// ─── The scrolled parapet over the front, the oculus ───
{
  const F = faceOf([X0, YF], [X1, YF]), c = W / 2, tw = 2.35
  const half: [number, number][] = [[0, EAVE], [0, 10.1], [1.4, 10.1], [1.4, 9.8], [2.6, 9.8]]
  const curve: [number, number][] = []
  for (let k = 1; k <= 5; k++) { const t = k / 5; curve.push([2.6 + (c - tw - 2.6) * t, 9.8 + 1.5 * t * t]) }
  const left = [...half, ...curve]
  const right = left.map(([s, z]) => [W - s, z] as [number, number]).reverse()
  fprism(stucco, F, [...left, [c - tw, 11.3], [c + tw, 11.3], ...right], -0.6, 0.05, true)
  // its coping: a thin trim line along the top
  const top = [...left.slice(1), [c - tw, 11.3]] as [number, number][]
  for (let i = 0; i < top.length - 1; i++) {
    const [s0, z0] = top[i], [s1, z1] = top[i + 1]
    if (Math.abs(s1 - s0) < 1e-6) continue
    const mirror = (s: number) => W - s
    fprism(trim, F, [[s0, z0 - 0.02], [s1, z1 - 0.02], [s1, z1 + 0.16], [s0, z0 + 0.16]], -0.65, 0.12, false)
    fprism(trim, F, [[mirror(s1), z1 - 0.02], [mirror(s0), z0 - 0.02], [mirror(s0), z0 + 0.16], [mirror(s1), z1 + 0.16]], -0.65, 0.12, false)
  }
  const disc = (p: Part, r: number, d: number) => {
    const pts: [number, number][] = []
    for (let k = 0; k < 14; k++) { const a = (k / 14) * 2 * Math.PI; pts.push([c + r * Math.cos(a), 9.55 + r * Math.sin(a)]) }
    fprism(p, F, pts, 0.0, d, false)
  }
  disc(trim, 0.68, 0.08); disc(win, 0.5, 0.11)
}

// ─── The nave: walls, gable roof, round-headed windows ───
walls(stucco, X0, YP, X1, YN, 0, EAVE)
{
  const o = 0.35
  const L0: V3 = [X0 - o, YP, EAVE - 0.15], R0: V3 = [XC, YP + 3.4, RIDGE], E0: V3 = [X1 + o, YP, EAVE - 0.15]
  const L1: V3 = [X0 - o, YN + 0.5, EAVE - 0.15], R1: V3 = [XC, YN + 0.5, RIDGE], E1: V3 = [X1 + o, YN + 0.5, EAVE - 0.15]
  quadN(slate, L0, R0, R1, L1, [-1, 0, 1.4]); quadN(slate, R0, E0, E1, R1, [1, 0, 1.4])
  quadN(slate, L0, E0, E1, L1, [0, 0, -1])
  triN(slate, L0, E0, R0, [0, -1, 1.4]) // a short hip at the front, behind the parapet
  // the nave's front gable, behind the parapet
}
for (const [a, b] of [[[X0, YN], [X0, YP]], [[X1, YP], [X1, YN]]] as [XY, XY][]) {
  const F = faceOf(a, b)
  for (let k = 0; k < 5; k++) {
    const s = 1.6 + k * 3.35
    farch(trim, F, s, 1.8, 2.85, 7.15, 0.04, 8)
    farch(win, F, s, 1.5, 3.0, 7.0, 0.07, 8)
  }
}

// ─── The transverse rear block with scrolled gable ends ───
{
  const x0 = -9.57, x1 = 8.35, y0 = YN, y1 = 13.0, e = 8.6, r = 11.4, yc = (y0 + y1) / 2, L = y1 - y0
  walls(stucco, x0, y0, x1, y1, 0, e)
  band(trim, rect(x0, y0, x1, y1), e - 0.45, e, 0.25)
  const o = 0.3
  quadN(slate, [x0 + 0.3, y0 - o, e - 0.15], [x1 - 0.3, y0 - o, e - 0.15], [x1 - 0.3, yc, r], [x0 + 0.3, yc, r], [0, -1, 1.6])
  quadN(slate, [x0 + 0.3, y1 + o, e - 0.15], [x1 - 0.3, y1 + o, e - 0.15], [x1 - 0.3, yc, r], [x0 + 0.3, yc, r], [0, 1, 1.6])
  quadN(slate, [x0 + 0.3, y0 - o, e - 0.15], [x1 - 0.3, y0 - o, e - 0.15], [x1 - 0.3, y1 + o, e - 0.15], [x0 + 0.3, y1 + o, e - 0.15], [0, 0, -1])
  const prof: [number, number][] = [[0, e], [L, e], [L, 9.25]]
  const sc: [number, number][] = [[1.2, 9.5], [2.4, 10.1], [3.4, 10.8], [4.25, 11.5], [L / 2 - 0.8, 11.9]]
  for (const [s, z] of sc.map(([s, z]) => [L - s, z] as [number, number])) prof.push([s, z])
  prof.push([L / 2 + 0.8, 12.35], [L / 2 - 0.8, 12.35])
  for (const [s, z] of [...sc].reverse()) prof.push([s, z])
  prof.push([0, 9.25])
  for (const F of [faceOf([x0, y1], [x0, y0]), faceOf([x1, y0], [x1, y1])]) {
    fprism(stucco, F, prof, -0.5, 0.02, true)
    const disc: [number, number][] = []
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * Math.PI; disc.push([L / 2 + 0.55 * Math.cos(a), 10.6 + 0.55 * Math.sin(a)]) }
    fprism(win, F, disc, 0, 0.06, false)
    for (const s of [2.4, L - 2.4]) { farch(trim, F, s, 1.7, 2.85, 6.9, 0.04, 8); farch(win, F, s, 1.4, 3.0, 6.75, 0.07, 8) }
  }
  // rear windows
  const R = faceOf([x1, y1], [x0, y1])
  for (const s of [3.0, 7.0]) { farch(trim, R, s, 1.7, 2.85, 6.9, 0.04, 8); farch(win, R, s, 1.4, 3.0, 6.75, 0.07, 8) }
}
// the lower rear wing
block(stucco, -4.53, 13.0, 8.35, 17.5, 0, 6.6)
block(trim, -4.73, 12.9, 8.55, 17.7, 6.6, 7.0)
block(slate, -4.4, 13.1, 8.2, 17.4, 7.0, 7.05)

// ─── The tower and spire over the front ───
{
  const h = 2.35, y0 = YF + 0.25, y1 = YF + 0.25 + 2 * h, z0 = EAVE, zc = 16.8
  walls(stucco, XC - h, y0, XC + h, y1, z0, zc)
  block(stucco, XC - h - 0.1, y0 - 0.1, XC + h + 0.1, y1 + 0.1, 11.1, 11.4)
  band(trim, rect(XC - h, y0, XC + h, y1), zc - 0.45, zc, 0.35)
  block(trim, XC - h - 0.1, y0 - 0.1, XC + h + 0.1, y1 + 0.1, zc, zc + 0.35)
  // clocks and the louvred openings under them, on all four faces
  for (const F of [faceOf([XC - h, y0], [XC + h, y0]), faceOf([XC + h, y0], [XC + h, y1]), faceOf([XC + h, y1], [XC - h, y1]), faceOf([XC - h, y1], [XC - h, y0])]) {
    // the louvred opening: a dark panel with bold slats
    fpanel(trim, F, h - 0.72, h + 0.72, 11.9, 13.85, 0.04)
    fpanel(shade, F, h - 0.55, h + 0.55, 12.0, 13.7, 0.07)
    for (const z of [12.45, 12.95, 13.45]) fpanel(trim, F, h - 0.55, h + 0.55, z - 0.07, z + 0.07, 0.09)
    const pts: [number, number][] = []
    for (let k = 0; k < 14; k++) { const a = (k / 14) * 2 * Math.PI; pts.push([h + 0.7 * Math.cos(a), 14.95 + 0.7 * Math.sin(a)]) }
    fprism(shade, F, pts, 0, 0.08, false)
    fprism(trim, F, pts.map(([u, v]) => [h + (u - h) * 0.82, 14.95 + (v - 14.95) * 0.82] as [number, number]), 0, 0.11, false)
    fpanel(shade, F, h - 0.05, h + 0.05, 14.95, 15.4, 0.13); fpanel(shade, F, h, h + 0.38, 14.9, 15.0, 0.13)
  }
  // the spire: a slender eight-sided slate cone on a short square base
  const zs = zc + 0.35, zt = 24.6, rb = 1.3, yc = (y0 + y1) / 2
  block(slate, XC - rb, yc - rb, XC + rb, yc + rb, zs, zs + 0.5)
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => { const a = (i + 0.5) * Math.PI / 4; return [XC + r * Math.cos(a), yc + r * Math.sin(a), z] })
  const base = ring(rb, zs + 0.5)
  for (let i = 0; i < 8; i++) triN(slate, base[i], base[(i + 1) % 8], [XC, yc, zt], [Math.cos((i + 1) * Math.PI / 4), Math.sin((i + 1) * Math.PI / 4), 0.3])
  // the cross
  block(trim, XC - 0.09, yc - 0.09, XC + 0.09, yc + 0.09, zt - 0.2, zt + 1.6)
  block(trim, XC - 0.45, yc - 0.09, XC + 0.45, yc + 0.09, zt + 0.9, zt + 1.08)
}
void hipRoof

const frontLight = (p: V3, n: V3) => (p[1] < YF + 1.0 && n[1] < -0.3 ? 1 : p[1] < YP + 1 ? 0.6 : 0.15) * (n[2] > 0.7 ? 0.35 : 1)
finishModel('Our Lady of Guadalupe Church', 'nola-our-lady-of-guadalupe', [
  { part: stucco, material: { ...finish('guadalupe-stucco', 0xe6dcc6), floodlight: frontLight } },
  { part: trim, material: { ...PALETTE.trim, floodlight: frontLight } },
  { part: slate, material: finish('guadalupe-slate', 0x6f7377) },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0x3f554a } },
  { part: shade, material: finish('porch-shadow', 0x3b3f42) },
], { bearing: 306.8, osm: 'way/367725733', height: 25.1 }, 5000)
