/**
 * Wells Fargo Center (1700 Lincoln Street, 1983, Philip Johnson and John
 * Burgee), Denver, "the cash register building" — original procedural
 * geometry, CC0-1.0.
 * bun generators/den-wells-fargo-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint (the Broadway side, west). Anchor =
 * centroid of the OSM outline way/53085815, -104.9854491, 39.7435666. Its
 * walls run exactly east–west and north–south, so the bearing is 0.
 *
 * Identity, in order:
 *  1. the "cash register" top: seen end-on (from Broadway or Lincoln) the
 *     slab ends in two rounded shoulders, a lower one over the north half
 *     and a taller one over the south half, with a sheer step between them.
 *     Both curves are glazed vaults running the length of the slab, so from
 *     the south (the Capitol) the top reads as one glass barrel.
 *                                     (wf1, wfc, capitol, oct24, top)
 *  2. rose-brown granite with a dense grid of punched windows.  (top, oct24)
 *  3. the step wall between the vaults, a dark grey metal band seen from
 *     the north and north-west, darker than the glass.          (oct24)
 *  4. the low west wing on Broadway: two glazed quarter-vaults on a granite
 *     base, echoing the crown, and the glazed atrium along the north side.
 *                                                                (wf1)
 *
 * Plan: the tower's x extent is OSM's (way/587631334, 65.8 m) widened to the
 * lidar's 66.6 m; its depth is the lidar's 36.6 m, where OSM draws 33 m (the
 * lidar is 1 m-gridded and puts both long faces 1.2–2.4 m outside OSM's;
 * Republic Plaza, a block away, matches OSM to under a metre in the same
 * flight, so the lidar is taken). The step between the vaults sits 0.7 m
 * north of the anchor, where the lidar drops from 213.7 to 202.6 (OSM puts
 * the 213 m part's edge at y = 0). West wing and atrium: OSM ways
 * 587631335, 587631336 and 538188946, the atrium widened to meet the lidar
 * face.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py; ground_min 1597.9 m, and y = 0 is 0.8 m above
 * it (Broadway sidewalk). Lincoln Street, on the east, is 6.3 m higher, the
 * north and south sides slope between. Measured (model metres):
 *  - south vault: eave 192.2 on the south face, rising as a quarter ellipse
 *    (fits the lidar to 0.3 m at every metre) to 212.9 at the step;
 *    published 213 m / 52 floors (OSM, Wikipedia "Wells Fargo Center
 *    (Denver)").
 *  - north vault: eave 184.5 on the north face, rising to 201.7 at the step.
 *  - west wing: south block, wall 8, vault to 18.0; north block, vault from
 *    22.7 at its south edge to 34.1 at the north (both curves fit the
 *    lidar's profile to under 0.5 m).
 *  - atrium: 18.3 to its crown, 11 m above the north sidewalk (OSM: 11).
 *
 * Estimated: the window grouping (the photos show ~22 windows per long
 * face and ~12 per end, on ~3.85 m floors; drawn as broad panels of about
 * three windows by three floors, seven bays a long face and four an end,
 * with granite piers and spandrels between, per STYLE.md); the granite base
 * height of the west wing and its rib spacing; the lobby glazing.
 *
 * Crown glass: dark grey-bronze in oct24 and capitol, darker than the
 * granite; a dark warm grey window variant.
 *
 * Night: offices lit (window); the crown vaults are lit from within at
 * night, so they are a window variant rather than structural glass; the
 * atria are glass and stay dark.
 *
 * Photos (Wikimedia Commons, evidence):
 *  oct24   "Wells Fargo Center, October 2024.jpg", Hurstbergn, CC BY 4.0
 *          (from the north-west, over Trinity Methodist)
 *  wf1     "Wellsfargocenterdenver1.JPG", Onetwo1 at en.wikipedia,
 *          CC BY-SA 3.0 (the west end from Broadway, the west wing's vault)
 *  capitol "Wells Fargo Center from CO State Capitol.jpg", Xnatedawgx,
 *          CC BY-SA 4.0 (the south face)
 *  top     "Top of Wells Fargo Center.JPG", O'Dea, CC BY-SA 4.0 (crown,
 *          from the south)
 *  wfc     "WellsFargoCenter.JPG", (no author given), CC BY-SA 3.0 (from
 *          the north-west)
 * No look-only sources. No commercial imagery.
 *
 * Left out: the skybridge to the west (way/587713320, its own part, not
 * drawn), the crown's mullion grid, the rooftop antenna, entrances.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { panel, rows, save, triangulate, walls, type XY } from './chi-aon-center'

const granite = new Part(), win = new Part(), crown = new Part(), glass = new Part(), trim = new Part(), roof = new Part()

// Tower
const X0 = -29.4, X1 = 37.2, YS = -20.3, YN = 16.3, YC = 0.7
const S_EAVE = 192.2, S_TOP = 212.9, N_EAVE = 184.5, N_TOP = 201.7
const SEG = 10

/** Ground under the walls: the Broadway side is lowest, Lincoln 6.3 m up. */
const ground = (x: number) => Math.max(0, Math.min(6.3, (x - X0) * 6.3 / (X1 - X0)))

/**
 * A quarter-ellipse profile (y, z) from the eave (vertical tangent) to the
 * crown line at yc (horizontal tangent), with outward normals.
 */
function quarter(yEave: number, yc: number, zEave: number, zTop: number, seg = SEG) {
  const a = Math.abs(yc - yEave), b = zTop - zEave, s = Math.sign(yEave - yc)
  return Array.from({ length: seg + 1 }, (_, i) => {
    const t = (i / seg) * Math.PI / 2
    const y = yc + s * a * Math.cos(t), z = zEave + b * Math.sin(t)
    const ny = s * Math.cos(t) / a, nz = Math.sin(t) / b, l = Math.hypot(ny, nz)
    return { y, z, n: [ny / l, nz / l] as XY }
  })
}
/** Sweep a profile along x from x0 to x1 as a smooth vault. */
function vault(p: Part, prof: { y: number; z: number; n: XY }[], x0: number, x1: number) {
  for (let i = 0; i < prof.length - 1; i++) {
    const A = prof[i], B = prof[i + 1]
    const nA: V3 = [0, A.n[0], A.n[1]], nB: V3 = [0, B.n[0], B.n[1]]
    p.tri([x0, A.y, A.z], [x1, A.y, A.z], [x1, B.y, B.z], undefined, undefined, undefined, [nA, nA, nB])
    p.tri([x0, A.y, A.z], [x1, B.y, B.z], [x0, B.y, B.z], undefined, undefined, undefined, [nA, nB, nB])
  }
}
/** A flat wall in the plane x = const from a (y, z) polygon, facing +x (east) or -x. */
function endWall(p: Part, x: number, poly: XY[], east: boolean) {
  const area = poly.reduce((s, a, i) => { const b = poly[(i + 1) % poly.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const ring = area < 0 ? [...poly].reverse() : poly
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [x, ring[a][0], ring[a][1]], B: V3 = [x, ring[b][0], ring[b][1]], C: V3 = [x, ring[c][0], ring[c][1]]
    // (y, z) counter-clockwise faces +x
    if (east) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

const south = quarter(YS, YC, S_EAVE, S_TOP), north = quarter(YN, YC, N_EAVE, N_TOP)

// Long walls and the step between the vaults.
{
  const q = (a: XY, b: XY, z0: number, z1: number, p = granite) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  q([X0, YS], [X1, YS], 0, S_EAVE) // south face
  q([X1, YN], [X0, YN], 0, N_EAVE) // north face
  q([X1, YC], [X0, YC], N_TOP, S_TOP, roof) // the step, facing north
}
vault(crown, south, X1, X0)
vault(crown, north, X0, X1)
// End walls: the cash-register profile.
const profile: XY[] = [[YS, 0], [YN, 0], ...north.map(p => [p.y, p.z] as XY), ...[...south].reverse().map(p => [p.y, p.z] as XY)]
endWall(granite, X1, profile, true)
endWall(granite, X0, profile, false)

// Facade: one panel per window pair, three-floor groups, lobby at the
// local ground.
const FL = 3.85
function face(a: XY, b: XY, top: (s: number) => number, pairs: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = L / pairs, w = pitch - 2.6
  for (let q = 0; q < pairs; q++) {
    const s0 = q * pitch + 1.3, s1 = s0 + w
    const x = a[0] + (b[0] - a[0]) * ((s0 + s1) / 2) / L
    const g = ground(x), lim = Math.min(top(s0), top(s1)) - 1.6
    panel(win, a, b, s0, s1, g + 0.5, g + 7.5, 0.05) // lobby
    const z0 = g + 2 * FL
    for (const [r0, r1] of rows(z0, z0 + 17 * 3 * FL, 17, 3.0)) if (r1 <= lim) panel(win, a, b, s0, s1, r0, r1, 0.05)
  }
}
const flat = (z: number) => () => z
face([X0, YS], [X1, YS], flat(S_EAVE), 7)
face([X1, YN], [X0, YN], flat(N_EAVE), 7)
// End walls: windows stop under the curved roofline.
const roofAt = (y: number) => {
  const prof = y < YC ? south : north
  for (let i = 0; i < prof.length - 1; i++) {
    const A = prof[i], B = prof[i + 1]
    if ((y - A.y) * (y - B.y) <= 0) return A.z + (B.z - A.z) * (y - A.y) / ((B.y - A.y) || 1)
  }
  return y < YC ? S_EAVE : N_EAVE
}
face([X1, YS], [X1, YN], s => roofAt(YS + s), 4)
face([X0, YN], [X0, YS], s => roofAt(YN - s), 4)

// Crown mullions: three pale lines along each vault, so the glass reads as
// a glazed barrel and not a grey cap.
for (const prof of [south, north]) for (const k of [3, 6, 8]) {
  const A = prof[k], B = prof[k + 1], m = 0.08
  const d = (B.y - A.y), e = (B.z - A.z), l = Math.hypot(d, e), u = 0.35 / l
  const P = (x: number, f: number): V3 => [x, A.y + d * f + A.n[0] * m, A.z + e * f + A.n[1] * m]
  const xs = prof === south ? [X1, X0] : [X0, X1]
  trim.quad(P(xs[0], 0), P(xs[1], 0), P(xs[1], u), P(xs[0], u))
}

// West wing: a granite base under two glazed quarter-vaults (OSM parts
// 587631336, south, and 587631335, north).
const WX0 = -42.8, WX1 = X0
{
  const base = 8, sY0 = -14.4, sY1 = YC, nY1 = 13.8
  // south block: wall to 8, vault rising north to 18
  const sv = quarter(sY0, sY1, base, 18.0, 8)
  // granite base all round the wing
  const q = (a: XY, b: XY, z0: number, z1: number, p: Part) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  q([WX0, sY0], [WX1, sY0], 0, base, granite)
  q([WX1, nY1], [WX0, nY1], 0, base, granite)
  vault(glass, sv, WX1, WX0)
  // north block: high on its north side (34.1), curving down to 22.7 at its
  // south edge, where it stands over the south block.
  const a = nY1 - sY1, b = 34.1 - 22.7
  const nprof = Array.from({ length: 9 }, (_, i) => {
    const t = (i / 8) * Math.PI / 2 // 0 at the south edge (low), 90° at the north (top)
    const y = nY1 - a * Math.cos(t), z = 22.7 + b * Math.sin(t)
    const ny = -Math.cos(t) / a, nz = Math.sin(t) / b, l = Math.hypot(ny, nz)
    return { y, z, n: [ny / l, nz / l] as XY }
  })
  vault(glass, nprof, WX1, WX0)
  q([WX1, sY1], [WX0, sY1], 18.0, 22.7, glass) // riser between the blocks, facing south
  q([WX1, nY1], [WX0, nY1], base, 34.1, glass) // north wall (against the garage)
  // west end: granite base, glazed above it up to the two vaults' profile
  q([WX0, nY1], [WX0, sY0], 0, base, granite)
  endWall(glass, WX0, [[sY0, base], [nY1, base], ...[...nprof].reverse().map(p => [p.y, p.z] as XY), ...[...sv].reverse().slice(0, -1).map(p => [p.y, p.z] as XY)], false)
  // ribs over the vaults, pale, every ~4.5 m
  for (let x = WX0 + 1.2; x < WX1 - 0.5; x += 4.5) {
    for (const prof of [sv, nprof]) for (let i = 0; i < prof.length - 1; i++) {
      const A = prof[i], B = prof[i + 1], o = 0.12
      const P = (p: typeof A, dx: number): V3 => [x + dx, p.y + p.n[0] * o, p.z + p.n[1] * o]
      trim.quad(P(A, -0.25), P(A, 0.25), P(B, 0.25), P(B, -0.25))
    }
  }
}

// North atrium along the tower (OSM 538188946): glass walls and a barrel
// roof, crown 18.3, 11 m over the north sidewalk.
{
  const ax0 = -4.4, ax1 = 38.8, ay0 = YN, ay1 = 21.5, r = (ay1 - ay0) / 2, yc = (ay0 + ay1) / 2, zs = 18.3 - r
  const q = (a: XY, b: XY, z0: number, z1: number, p: Part) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  q([ax1, ay1], [ax0, ay1], 0, zs, glass)
  const prof = Array.from({ length: 9 }, (_, i) => {
    const t = Math.PI * i / 8 // from the north side over to the south
    return { y: yc + r * Math.cos(t), z: zs + r * Math.sin(t), n: [Math.cos(t), Math.sin(t)] as XY }
  })
  vault(glass, prof, ax0, ax1)
  const end = [[ay0, 0], [ay1, 0], ...prof.map(p => [p.y, p.z] as XY)] as XY[]
  endWall(glass, ax1, end, true)
  endWall(glass, ax0, end, false)
  for (let x = ax0 + 2.5; x < ax1 - 1; x += 4.8) {
    for (let i = 0; i < prof.length - 1; i++) {
      const A = prof[i], B = prof[i + 1], o = 0.1
      const P = (p: typeof A, dx: number): V3 => [x + dx, p.y + p.n[0] * o, p.z + p.n[1] * o]
      trim.quad(P(A, -0.2), P(A, 0.2), P(B, 0.2), P(B, -0.2))
    }
  }
}

await save('den-wells-fargo-center', 'Wells Fargo Center', [39.7435666, -104.9854491], 0, [
  { part: granite, material: finish('wf-granite', 0xc9a08f) },
  { part: win, material: PALETTE.window },
  { part: crown, material: windowVariant(2, 0x6f6a64) },
  { part: glass, material: PALETTE.glass },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('wf-step-panel', 0x575b61) },
])
