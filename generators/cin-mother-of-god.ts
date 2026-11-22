/**
 * Mother of God Church (Mutter Gottes Kirche), 119 West Sixth Street,
 * Covington, Kentucky (1870–71, Walter and Stewart; Italian Renaissance)
 * — original procedural geometry, CC0-1.0.
 * bun generators/cin-mother-of-god.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest
 * ground. Bearing 348.3: +y points to the front on Sixth Street, the nave
 * runs back along -y. Anchor = centroid of OSM way/80308915 (the church
 * outline; the brief's way/365982686 is not a building there),
 * -84.512582, 39.083931. The axis runs at x = 0.5.
 *
 * Identity (from the photos below):
 *  1. Twin square red-brick towers with pale stone bands, oculi and
 *     louvred belfry arches, a clock on every face at the top of the brick,
 *     then tall pale-green copper lanterns: a colonnaded drum, a smaller
 *     arcaded lantern, a little dome and a cross.
 *  2. Between them a pale stone front: three arches on columns opening
 *     into a loggia, an entablature and a pediment, a brick attic with a
 *     cartouche and cross.
 *  3. A dark drum and a green copper dome over the crossing, with a tall
 *     dark lantern.
 *  4. A long red-brick nave of tall round-headed windows under a grey
 *     roof; shallow transepts.
 *
 * Plan: OSM way/80308915 read in this frame: nave x -11.8..12.5, y
 * -25.6..27.0; towers 7.5 m square at x -13.25..-5.75 and 6.75..14.25, y
 * 21.1..28.8; transept x -15.4..16.0, y -20.2..-6.1; a one-storey
 * sacristy at the south-west corner (part 1459417962) and a small
 * one-storey block on the east side (way/1459417963).
 *
 * Heights: USGS 3DEP lidar KY_FullState (KyFromAbove statewide lidar,
 * flown 2019–2022; the service gives no tile year), 1 m grid read in this
 * frame; y = 0 is Sixth Street (ground_min + 1.0). Measured: nave eaves
 * 15, ridge 23; transept ridge 19.5; attic top 21; tower brick 39.5,
 * the copper lantern's drum to about 47–50, lantern to 53.5, top return
 * 58.2 (the cross is thinner than the grid; drawn to 59); crossing drum
 * about 25.5, dome crown 32, lantern to about 40, its cap 46.3. Estimated
 * from Hume's and LeMay's photos: all openings, the portico, the bands,
 * the clocks, the copper stages' radii.
 *
 * Ground: lidar and Mapterhorn show the site within about 1 m; elevation 0.
 *
 * Night: windows, oculi and the clock faces glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - MotherOfGod.jpg, Greg Hume (Greg5030), CC BY 3.0 (the front)
 *    https://commons.wikimedia.org/wiki/File:MotherOfGod.jpg
 *  - Mother of God Catholic Church, Mutter Gottes, Covington, KY.jpg,
 *    Warren LeMay, CC0 (front and west side from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Mother_of_God_Catholic_Church,_Mutter_Gottes,_Covington,_KY.jpg
 *  - Mother of God Church (Covington, Kentucky) - railroad tracks behind
 *    the church.jpg, Nheyob, CC BY-SA 4.0 (the rear gable, dome and towers
 *    from the south)
 *    https://commons.wikimedia.org/wiki/File:Mother_of_God_Church_(Covington,_Kentucky)_-_railroad_tracks_behind_the_church.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east side is only seen in part; it mirrors the west. The
 * copper lanterns' radii and stage heights rest on the lidar's 1 m cells
 * and the photos, which disagree a little (the photos are steeply
 * foreshortened). Volutes, statues and the relief are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { faces, type Face } from './cin-city-hall'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), cu = new Part(), dome = new Part()

const CX = 0.5
const len = (f: Face) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
const S = (f: Face, p: XY) => ((p[0] - f[0][0]) * (f[1][0] - f[0][0]) + (p[1] - f[0][1]) * (f[1][1] - f[0][1])) / len(f)
const sOn = (f: Face, c: number) => (f[0][1] === f[1][1] ? S(f, [c, f[0][1]]) : S(f, [f[0][0], c]))
function proud(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number, top: Part | null = p) {
  const L = len(f), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, o: number): XY => [f[0][0] + t[0] * s + n[0] * o, f[0][1] + t[1] * s + n[1] * o]
  const a = P(s0, -0.05), b = P(s1, d)
  box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, top, 0.1)
}
const circle = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
/** A round-headed window in a pale stone surround with a sill. */
function arched(f: Face, s: number, w: number, z0: number, z1: number) {
  onWall(trim, f[0], f[1], archShape(s, w + 0.6, z0 - 0.3, z1 - w / 2, 10), 0.04)
  onWall(win, f[0], f[1], archShape(s, w, z0, z1 - w / 2, 10), 0.08)
}
function oculus(f: Face, s: number, z: number, r: number) {
  onWall(trim, f[0], f[1], circle(s, z, r + 0.35, 16), 0.04)
  onWall(win, f[0], f[1], circle(s, z, r, 16), 0.08)
}
/** A ring of trim round a rectangle at z, h tall, d proud. */
function band(x0: number, x1: number, y0: number, y1: number, z: number, h: number, d: number) {
  box(trim, x0 - d, x1 + d, y0 - d, y1 + d, z, z + h, null, Math.min(0.12, h / 3))
}

// ───────────────────────────── nave and transepts ─────────────────────────────
const NX0 = -11.8, NX1 = 12.5, NY0 = -25.6, NY1 = 26.0, EAVE = 15.0, RIDGE = 23.0
box(brick, NX0, NX1, NY0, NY1, 0, EAVE, null, 0)
band(NX0, NX1, NY0, NY1 - 4.9, EAVE - 0.8, 0.8, 0.3)
band(NX0, NX1, NY0, NY1 - 4.9, 0, 0.8, 0.12)
gableRoof(roof, brick, NX0, NX1, NY0, NY1, EAVE, RIDGE, 'y', 0.5, 0.3)
const TX0 = -15.4, TX1 = 16.0, TY0 = -20.2, TY1 = -6.1, TRIDGE = 19.5
box(brick, TX0, TX1, TY0, TY1, 0, EAVE, null, 0)
band(TX0, TX1, TY0, TY1, EAVE - 0.8, 0.8, 0.3)
gableRoof(roof, brick, TX0, TX1, TY0, TY1, EAVE, TRIDGE, 'x', 0.4, 0.3)
{
  // nave windows: five bays ahead of the transept, one behind it
  const W: Face = [[NX0, 40], [NX0, -40]], E: Face = [[NX1, -40], [NX1, 40]]
  for (const f of [W, E]) {
    for (const y of [-23.0, -2.5, 2.6, 7.7, 12.8, 17.9]) arched(f, sOn(f, y), 2.2, 3.2, 12.4)
    for (const y of [-20.2, -6.1, -0.05, 5.15, 10.25, 15.35, 20.6]) proud(brick, f, sOn(f, y) - 0.45, sOn(f, y) + 0.45, 0.8, EAVE - 0.8, 0.25)
  }
  // transept ends: a tall arched window, an oculus in the gable
  const tf = faces(TX0, TX1, TY0, TY1)
  for (const f of [tf.E, tf.W]) {
    arched(f, len(f) / 2, 3.0, 3.0, 13.0)
    oculus(f, len(f) / 2, 16.8, 0.8)
  }
  // the rear gable: two windows and an oculus
  const R: Face = [[NX0, NY0], [NX1, NY0]]
  for (const s of [6.0, 18.3]) arched(R, s, 2.2, 3.2, 12.4)
  oculus(R, len(R) / 2, 18.0, 1.0)
  onWall(trim, R[0], R[1], rectShape(0, len(R), EAVE - 0.8, EAVE), 0.3)
}
// the one-storey sacristy and the small side block
box(brick, -16.2, NX0 + 0.1, -26.7, -16.0, 0, 6.0, roof, 0.2)
band(-16.2, NX0 + 0.1, -26.7, -16.0, 5.4, 0.6, 0.15)
box(brick, 12.4, 15.9, -1.3, 1.6, 0, 4.2, roof, 0.2)

// ───────────────────────────────── the front ─────────────────────────────────
const FY = 27.0, ATTIC = 21.0
const TW = 3.75, TC: XY[] = [[CX - 10, 25.0], [CX + 10, 25.0]], TOPB = 39.5
{
  // the attic block between the towers
  box(brick, CX - 6.3, CX + 6.3, 20.5, FY, 0, ATTIC, roof, 0.1)
  const F: Face = [[CX + 6.25, FY], [CX - 6.25, FY]] // s = CX + 6.25 - x
  const m = len(F) / 2
  // the portico: three arches on columns, the loggia behind
  proud(trim, F, 0.1, 12.4, 0, 12.6, 0.35)
  for (const d of [-4.0, 0, 4.0]) {
    onWall(roof, F[0], F[1], archShape(m + d, 3.3, 0.0, 8.3, 10), 0.4)
    onWall(trim, F[0], F[1], circle(m + d, 7.3, 0.75, 12), 0.43)
    onWall(win, F[0], F[1], circle(m + d, 7.3, 0.55, 12), 0.46)
    onWall(brick, F[0], F[1], archShape(m + d, 1.5, 0.3, 3.7, 8), 0.43)
  }
  for (const d of [-6.0, -2.0, 2.0, 6.0]) proud(trim, F, m + d - 0.35, m + d + 0.35, 0, 9.8, 0.75)
  proud(trim, F, -0.1, 12.6, 9.8, 12.6, 0.8)
  // the pediment
  {
    const L = len(F), t: XY = [-1, 0], z0 = 12.6, z1 = 16.6
    const P = (s: number, o: number, z: number): V3 => [F[0][0] + t[0] * s, F[0][1] + o, z]
    const o = 0.85
    trim.tri(P(0, o, z0), P(L, o, z0), P(L / 2, o, z1))
    trim.quad(P(L, o, z0), P(L, 0, z0), P(L / 2, 0, z1), P(L / 2, o, z1))
    trim.quad(P(L / 2, o, z1), P(L / 2, 0, z1), P(0, 0, z0), P(0, o, z0))
  }
  // the attic's cornice and the cartouche with its cross
  proud(trim, F, -0.1, 12.6, ATTIC - 0.7, ATTIC, 0.45)
  onWall(trim, F[0], F[1], archShape(m, 3.0, ATTIC - 0.6, ATTIC + 0.4, 10), 0.2)
  box(trim, CX - 0.12, CX + 0.12, FY - 0.25, FY - 0.0, ATTIC + 1.8, ATTIC + 3.8, trim, 0)
  box(trim, CX - 0.7, CX + 0.7, FY - 0.25, FY - 0.0, ATTIC + 3.0, ATTIC + 3.25, trim, 0)
}

// ───────────────────────────────── the towers ─────────────────────────────────
for (const c of TC) {
  const x0 = c[0] - TW, x1 = c[0] + TW, y0 = 21.1, y1 = 28.85
  box(brick, x0, x1, y0, y1, 0, TOPB, null, 0.15)
  band(x0, x1, y0, y1, 0, 0.9, 0.12)
  band(x0, x1, y0, y1, 9.8, 0.6, 0.2)
  band(x0, x1, y0, y1, 12.0, 0.8, 0.3)
  band(x0, x1, y0, y1, ATTIC - 0.8, 0.9, 0.35)
  band(x0, x1, y0, y1, TOPB - 0.8, 0.8, 0.35)
  const fc = faces(x0, x1, y0, y1)
  const outer = c[0] < CX ? fc.W : fc.E
  for (const f of [fc.N, outer, fc.S, c[0] < CX ? fc.E : fc.W]) {
    const m = len(f) / 2, full = f !== fc.S && f !== (c[0] < CX ? fc.E : fc.W)
    // corner pilasters
    for (const s of [0, len(f) - 0.9]) proud(brick, f, s, s + 0.9, 0.9, TOPB - 0.8, 0.2)
    if (full) {
      arched(f, m, 1.6, 1.8, 7.6)
      arched(f, m, 1.8, 13.4, 19.0)
    }
    {
      oculus(f, m, 24.2, 1.0)
      // the louvred belfry arch
      onWall(trim, f[0], f[1], archShape(m, 2.9, 27.0, 32.5, 10), 0.04)
      onWall(roof, f[0], f[1], archShape(m, 2.3, 27.3, 32.5, 10), 0.08)
      for (let k = 1; k <= 6; k++) onWall(trim, f[0], f[1], rectShape(m - 1.15, m + 1.15, 27.3 + k * 0.85, 27.3 + k * 0.85 + 0.16), 0.1)
      // the clock
      onWall(roof, f[0], f[1], circle(m, 36.6, 1.65, 16), 0.05)
      onWall(trim, f[0], f[1], circle(m, 36.6, 1.35, 16), 0.09)
      onWall(roof, f[0], f[1], rectShape(m - 0.07, m + 0.07, 36.6, 37.6), 0.12)
      onWall(roof, f[0], f[1], rectShape(m, m + 0.75, 36.53, 36.67), 0.12)
    }
  }
  // the copper lantern
  box(cu, x0 + 0.35, x1 - 0.35, y0 + 0.35, y1 - 0.35, TOPB, 41.0, cu, 0.25)
  revolve(cu, c, [[2.05, 41.0], [2.05, 47.2]], 12, 0, false, false)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + Math.PI / 8, p: XY = [c[0] + 2.45 * Math.cos(a), c[1] + 2.45 * Math.sin(a)]
    revolve(cu, p, [[0.24, 41.0], [0.24, 47.2]], 6, 0, false, false)
  }
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const f: Face = [[c[0] + n[0] * 2.08 - t[0] * 1, c[1] + n[1] * 2.08 - t[1] * 1], [c[0] + n[0] * 2.08 + t[0] * 1, c[1] + n[1] * 2.08 + t[1] * 1]]
    onWall(win, f[0], f[1], archShape(1, 0.9, 42.5, 45.6, 6), 0.03)
  }
  revolve(cu, c, [[2.0, 47.2], [2.85, 47.4], [2.85, 48.1], [2.3, 48.3], [1.5, 50.5]], 12, 0, true, false)
  revolve(cu, c, [[1.4, 50.5], [1.4, 54.0], [1.65, 54.2], [1.6, 54.6], [1.2, 56.0], [0.5, 57.0], [0.15, 57.4]], 8, Math.PI / 8, true, false)
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]], r = 1.4 * Math.cos(Math.PI / 8)
    const f: Face = [[c[0] + n[0] * r - t[0] * 0.5, c[1] + n[1] * r - t[1] * 0.5], [c[0] + n[0] * r + t[0] * 0.5, c[1] + n[1] * r + t[1] * 0.5]]
    onWall(roof, f[0], f[1], archShape(0.5, 0.75, 51.0, 53.0, 6), 0.03)
  }
  box(trim, c[0] - 0.09, c[0] + 0.09, c[1] - 0.09, c[1] + 0.09, 57.3, 59.0, trim, 0)
  box(trim, c[0] - 0.55, c[0] + 0.55, c[1] - 0.09, c[1] + 0.09, 58.0, 58.2, trim, 0)
}

// ──────────────────────────── the crossing dome ────────────────────────────
{
  const D: XY = [CX + 0.3, -13.3]
  revolve(roof, D, [[6.4, 18.0], [6.4, 25.0], [6.9, 25.3], [6.9, 25.9], [6.3, 26.0]], 16, 0, false, false)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]], r = 6.42
    const f: Face = [[D[0] + n[0] * r - t[0] * 0.8, D[1] + n[1] * r - t[1] * 0.8], [D[0] + n[0] * r + t[0] * 0.8, D[1] + n[1] * r + t[1] * 0.8]]
    onWall(trim, f[0], f[1], circle(0.8, 22.4, 0.7, 10), 0.03)
    onWall(win, f[0], f[1], circle(0.8, 22.4, 0.5, 10), 0.07)
  }
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2) * 0.86; prof.push([6.3 * Math.cos(a), 26.0 + 6.0 * Math.sin(a)]) }
  revolve(dome, D, [...prof, [1.9, 32.0]], 16, 0, false, false)
  revolve(roof, D, [[1.8, 31.6], [1.8, 38.6], [2.15, 38.8], [2.15, 39.5], [1.7, 39.6]], 8, Math.PI / 8, true, false)
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]], r = 1.8 * Math.cos(Math.PI / 8)
    const f: Face = [[D[0] + n[0] * r - t[0] * 0.6, D[1] + n[1] * r - t[1] * 0.6], [D[0] + n[0] * r + t[0] * 0.6, D[1] + n[1] * r + t[1] * 0.6]]
    onWall(win, f[0], f[1], archShape(0.6, 0.8, 33.4, 36.6, 6), 0.03)
  }
  revolve(roof, D, [[1.7, 39.6], [1.5, 41.0], [0.9, 42.4], [0.3, 43.0], [0.35, 43.5], [0.0, 43.9]], 8, Math.PI / 8, true, false)
  box(roof, D[0] - 0.09, D[0] + 0.09, D[1] - 0.09, D[1] + 0.09, 43.7, 46.3, roof, 0)
  box(roof, D[0] - 0.6, D[0] + 0.6, D[1] - 0.09, D[1] + 0.09, 45.3, 45.5, roof, 0)
}


await save('cin-mother-of-god', 'Mother of God Church', [
  { part: brick, material: finish('cin-mog-brick', 0xb9624d) },
  { part: trim, material: finish('cin-mog-stone', 0xece4d4) },
  { part: roof, material: finish('cin-mog-slate', 0x6f6f71) },
  { part: win, material: PALETTE.window },
  { part: cu, material: PALETTE.copper },
  { part: dome, material: PALETTE.patina },
], { height: 59.0, anchor: [39.083931, -84.512582], bearing: 348.3 }, 6500)
