/**
 * Mark O. Hatfield United States Courthouse (1997, Kohn Pedersen Fox with
 * BOORA), Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-hatfield-courthouse.ts
 *
 * A limestone tower on the block between SW 2nd and 3rd Avenues and Main and
 * Salmon Streets. The tower fills the north half of the block, under the
 * curved, cantilevered metal roof that sweeps up from the west and sails
 * out past the east face; a tall plain stone pier (a wedge in plan) runs up
 * its west side and carries a stone drum, ringed by a curved metal halo,
 * at its north end. The stone faces carry rows of slot windows; the east
 * bays and the west end are blue glass behind horizontal sun louvres. The
 * south half is the eight-level podium with its thin projecting roof slab,
 * deep glazed bays and the three curved grey fins in front of the west
 * face, the entrance canopy at its foot.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 21 (the downtown
 * street grid, the outline's long edges), so +y runs up the avenues (NNE).
 * Origin: the area centroid of OSM way/152299844. z = 0 is the street.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/152299844 (height 97,
 *   16 levels); parts way/421679963 (the tower), way/421679960 (the west
 *   stone pier, a wedge in plan), way/685060037 (the podium, height 55,
 *   8 levels). Plan from these parts.
 * - Published: 318 ft (97 m) to the top, 16 storeys (Wikipedia, "Mark O.
 *   Hatfield United States Courthouse"; GSA).
 * - Photos (evidence, Wikimedia Commons):
 *   - Steve Morgan, "Mark Hatfield U.S. Courthouse from southwest (2018).jpg",
 *     CC BY-SA 4.0 (the west and south faces: the pier, the louvred glass,
 *     the podium, its roof slab and fins, the entrance canopy):
 *     https://commons.wikimedia.org/wiki/File:Mark_Hatfield_U.S._Courthouse_from_southwest_(2018).jpg
 *   - M.O. Stevens, "Hatfield Federal Courthouse from North - Portland,
 *     Oregon.JPG", CC BY-SA 4.0 (the north face whole: the crown's curve,
 *     the drum, the bays, the slot windows):
 *     https://commons.wikimedia.org/wiki/File:Hatfield_Federal_Courthouse_from_North_-_Portland,_Oregon.JPG
 *   - Steve Morgan, "Upper portion of Hatfield US Courthouse in Portland from
 *     SW in 2017.jpg", CC BY-SA 4.0 (the crown):
 *     https://commons.wikimedia.org/wiki/File:Upper_portion_of_Hatfield_US_Courthouse_in_Portland_from_SW_in_2017.jpg
 *
 * Numbers
 * - Published: the drum's top at 97 m (the building's height); the podium
 *   55 m (OSM).
 * - Estimated from the north photo, scaled to the 59 m north face: the
 *   stone faces stop at 82 m; the crown's apex at 91 m, its west end 87 m,
 *   the east tip 84.5 m about 6 m out past the east face; the drum 10 m
 *   across; the bays (east glass 11 m, the stone centre, a 2 m glass slot
 *   beside the pier). The podium's slab overhang (4 m), the fins and the
 *   glazed bays from the south-west photo.
 * - No lidar used.
 *
 * Night: the glass and the slot windows glow; the stone is not floodlit.
 *
 * Doubts
 * - The east face is not photographed square-on; it is drawn glazed like the
 *   east bays of the north and south faces.
 * - The crown's curve is read from one photo's outline, not measured.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A polygon facing `n`, fanned from its first corner. */
function poly(p: Part, P: V3[], n: V3) {
  let f: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    f = [f[0] + c[0], f[1] + c[1], f[2] + c[2]]
  }
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) >= 0 ? r : [...r].reverse())
function crect(x0: number, y0: number, x1: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const r = ccw(ring), n = r.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0, top = true, bottom = false) =>
  prism(p, crect(x0, y0, x1, y1, c), z0, z1, top, bottom)
const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (2 * Math.PI * k) / n), cy + r * Math.sin(a0 + (2 * Math.PI * k) / n)] as XY)
/** A flat panel on a wall at `o` (wall point), `t` along the wall, `n` outward. */
function panel(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  poly(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1)], [n[0], n[1], 0])
}
/** A wall from a to b, wound counter-clockwise round its block (outward normal to the right). */
function seg(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { a, b, L, t, n: [t[1], -t[0]] as XY, at: (s: number): XY => [a[0] + t[0] * s, a[1] + t[1] * s] }
}
type Wall = ReturnType<typeof seg>
/** A shallow block standing proud of a wall: width w along it, depth d out. */
function slabOn(p: Part, w: Wall, s: number, width: number, z0: number, z1: number, d: number) {
  const P = (u: number, k: number): XY => [w.a[0] + w.t[0] * u + w.n[0] * k, w.a[1] + w.t[1] * u + w.n[1] * k]
  prism(p, [P(s - width / 2, -0.02), P(s + width / 2, -0.02), P(s + width / 2, d), P(s - width / 2, d)], z0, z1, true, true)
}

// ------------------------------------------------------------ the model ---
const stone = new Part()   // limestone
const win = new Part()     // glass bays and slot windows
const metal = new Part()   // the crown, louvres, fins, roof slab
const roof = new Part()    // flat roofs
const door = new Part()    // the entrance

// Plan (OSM parts, this frame)
const TX0 = -18.1, TX1 = 30.0, TY0 = -9.2, TY1 = 30.3   // tower
const PX0 = -29.1, PX1 = 27.6, PY0 = -30.9             // podium (to TY0)
const PIER: XY[] = [[-29.1, 30.1], [-29.2, 17.4], [-25.7, 8.5], [-19.3, -12.6], [-15.2, -9.3], [-18.1, -9.3], [-18.2, 30.2]]
const STONE_TOP = 82, PODIUM = 55
const crownZ = (x: number) => 91 - 0.00694 * (x - 6) ** 2   // the curved roof, apex 91 m
const FLOOR = 5.1                                            // two-storey groups of the window rhythm

// --- the tower: stone body, recessed top storey under the crown
box(stone, TX0, TY0, TX1, TY1, 0, STONE_TOP, 0.4, false)
box(win, TX0 + 1.6, TY0 + 1.6, TX1 - 1.6, TY1 - 1.6, STONE_TOP, 86.0, 0, false)
box(roof, TX0 + 1.6, TY0 + 1.6, TX1 - 1.6, TY1 - 1.6, 86.0, 86.3, 0, true)
poly(roof, [[TX0, TY0, STONE_TOP], [TX1, TY0, STONE_TOP], [TX1, TY1, STONE_TOP], [TX0, TY1, STONE_TOP]], [0, 0, 1])
// --- the west pier, full height, and the drum on its north end
prism(stone, PIER, 0, STONE_TOP + 2, true)
{
  const CX = -23.4, CY = 24.6, R = 5.0
  prism(stone, ngon(CX, CY, R, 16), STONE_TOP + 2, 96.2, true)
  prism(metal, ngon(CX, CY, R + 0.25, 16), 96.2, 97.0, true, true)
  // the curved halo: a thin ring standing off the drum on its east side
  const n = 10, a0 = -Math.PI / 2 - 0.3, a1 = Math.PI / 2 + 0.3
  for (let k = 0; k < n; k++) {
    const a = a0 + ((a1 - a0) * k) / n, b = a0 + ((a1 - a0) * (k + 1)) / n
    const r0 = R + 0.3, r1 = R + 2.6
    const P = (r: number, t: number, z: number): V3 => [CX + r * Math.cos(t), CY + r * Math.sin(t), z]
    for (const z of [93.6, 94.3]) poly(metal, [P(r0, a, z), P(r1, a, z), P(r1, b, z), P(r0, b, z)], [0, 0, z > 94 ? 1 : -1])
    poly(metal, [P(r1, a, 93.6), P(r1, b, 93.6), P(r1, b, 94.3), P(r1, a, 94.3)], [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0])
  }
}

// --- the crown: a curved metal shell, its section an arc across x, sailing
// out past the east face; struts down to the recessed top storey.
{
  const X0 = TX0 - 0.4, X1 = TX1 + 6.0, Y0 = TY0 - 1.2, Y1 = TY1 + 1.2, T = 0.7, N = 12
  for (let k = 0; k < N; k++) {
    const xa = X0 + ((X1 - X0) * k) / N, xb = X0 + ((X1 - X0) * (k + 1)) / N
    const za = crownZ(xa), zb = crownZ(xb)
    const nz: V3 = [-(zb - za) / (xb - xa), 0, 1]
    poly(metal, [[xa, Y0, za], [xb, Y0, zb], [xb, Y1, zb], [xa, Y1, za]], nz)
    poly(metal, [[xa, Y0, za - T], [xb, Y0, zb - T], [xb, Y1, zb - T], [xa, Y1, za - T]], [-nz[0], 0, -1])
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as Array<[number, number]>)
      poly(metal, [[xa, y, za - T], [xb, y, zb - T], [xb, y, zb], [xa, y, za]], [0, s, 0])
  }
  poly(metal, [[X1, Y0, crownZ(X1) - T], [X1, Y1, crownZ(X1) - T], [X1, Y1, crownZ(X1)], [X1, Y0, crownZ(X1)]], [1, 0, 0])
  poly(metal, [[X0, Y0, crownZ(X0) - T], [X0, Y1, crownZ(X0) - T], [X0, Y1, crownZ(X0)], [X0, Y0, crownZ(X0)]], [-1, 0, 0])
  // a clerestory screen under the shell, set back from the faces
  for (const y of [TY0 + 1.6, TY1 - 1.6]) {
    const s = y < 0 ? -1 : 1
    const P: V3[] = []
    for (let k = 0; k <= 8; k++) { const x = TX0 + 1.6 + ((TX1 - TX0 - 3.2) * k) / 8; P.push([x, y, crownZ(x) - T]) }
    for (let k = 0; k < 8; k++) poly(metal, [[P[k][0], y, 86.3], [P[k + 1][0], y, 86.3], P[k + 1], P[k]], [0, s, 0])
  }
  for (const x of [TX0 + 1.6, TX1 - 1.6]) {
    const s = x < 0 ? -1 : 1
    poly(metal, [[x, TY0 + 1.6, 86.3], [x, TY1 - 1.6, 86.3], [x, TY1 - 1.6, crownZ(x) - T], [x, TY0 + 1.6, crownZ(x) - T]], [s, 0, 0])
  }
}

// --- tower faces. A glass bay: a window panel with metal louvres every
// two storeys standing proud of it. Stone bays: slot-window bands.
function glassBay(w: Wall, s0: number, s1: number, z0: number, z1: number) {
  const mid = (s0 + s1) / 2, wd = s1 - s0
  panel(win, w.at(mid), w.t, w.n, wd, z0, z1, 0.06)
  for (let z = z0 + FLOOR; z < z1 - 1; z += FLOOR) slabOn(metal, w, mid, wd + 0.6, z - 0.25, z + 0.1, 1.1)
}
function slotBay(w: Wall, s0: number, s1: number, z0: number, z1: number, cols: number) {
  const step = (s1 - s0) / cols
  for (let z = z0 + 2.4; z < z1 - 1.6; z += FLOOR)
    for (let c = 0; c < cols; c++) panel(win, w.at(s0 + step * (c + 0.5)), w.t, w.n, step - 1.6, z, z + 1.3, 0.06)
}
{
  // north face (x from east to west)
  const N = seg([TX1, TY1], [TX0, TY1])
  glassBay(N, 0, 11, 1, STONE_TOP - 0.5)
  slotBay(N, 12.5, 46, 4, STONE_TOP - 1, 4)
  glassBay(N, 46, N.L, 1, STONE_TOP - 0.5)
  slabOn(stone, N, 11.75, 1.5, 0, STONE_TOP, 0.5)        // the pier beside the east glass
  // south face above the podium (west to east)
  const S = seg([TX0, TY0], [TX1, TY0])
  glassBay(S, 0, 13, PODIUM + 1, STONE_TOP - 0.5)
  slotBay(S, 14, 36.5, PODIUM + 1, STONE_TOP - 1, 3)
  glassBay(S, 37.5, S.L, PODIUM + 1, STONE_TOP - 0.5)
  // east face: glass between stone end piers
  const E = seg([TX1, TY0], [TX1, TY1])
  glassBay(E, 2, E.L - 2, PODIUM + 1, STONE_TOP - 0.5)
  glassBay(E, 2, E.L - 2, 1, PODIUM - 0.5)
  // west face of the tower beside the pier's sloped south end (glass)
  const Wt = seg([TX0, TY1 - 21.0], [TX0, TY0])
  glassBay(Wt, 0, Wt.L, PODIUM + 1, STONE_TOP - 0.5)
}

// --- the podium: stone, deep glazed bays, the thin roof slab, west fins
box(stone, PX0, PY0, PX1, TY0 + 0.3, 0, PODIUM, 0.4, false)
poly(roof, [[PX0, PY0, PODIUM], [PX1, PY0, PODIUM], [PX1, TY0, PODIUM], [PX0, TY0, PODIUM]], [0, 0, 1])
box(metal, PX0 - 3.2, PY0 - 4.0, PX1 + 2.0, TY0 + 0.5, PODIUM + 0.6, PODIUM + 1.4, 0, true, true)
{
  const S = seg([PX0, PY0], [PX1, PY0])
  for (const [s0, s1] of [[14.5, 21.5], [33.5, 40.5]]) {
    panel(win, S.at((s0 + s1) / 2), S.t, S.n, s1 - s0, 8, PODIUM - 2, 0.06)
    for (let z = 8 + FLOOR; z < PODIUM - 3; z += FLOOR) slabOn(metal, S, (s0 + s1) / 2, s1 - s0, z - 0.2, z + 0.1, 0.9)
  }
  slotBay(S, 44, S.L - 2, 8, PODIUM - 2, 2)
  slotBay(S, 2, 12.5, 8, PODIUM - 2, 1)
  // the entrance at the south-west corner: a canopy on piers, doors behind
  panel(door, S.at(7.5), S.t, S.n, 11, 0, 4.2, 0.06)
  box(metal, PX0 - 3.0, PY0 - 3.5, PX0 + 15, PY0 + 0.1, 7.4, 8.0, 0, true, true)
  const Wp = seg([PX0, TY0], [PX0, PY0])
  // three glass slots behind three curved grey fins
  for (const s of [6.0, 10.0, 14.0]) {
    panel(win, Wp.at(s), Wp.t, Wp.n, 2.4, 12, PODIUM - 4, 0.06)
    slabOn(metal, Wp, s - 1.5, 0.9, 10, PODIUM - 1, 2.6)
  }
  panel(door, Wp.at(17.5), Wp.t, Wp.n, 6, 0, 4.2, 0.06)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: stone, material: finish('hatfield-limestone', 0xe4ddcf) },
  { part: win, material: { name: 'window', color: 0x5e7c99, roughness: 0.35 } },
  { part: metal, material: finish('hatfield-metal', 0xa7adb3) },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Mark O. Hatfield United States Courthouse', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 21, elevation: 0, height: 97.0,
})
await Bun.write(new URL('../models/pdx-hatfield-courthouse.glb', import.meta.url), glb)
console.log(`pdx-hatfield-courthouse.glb: ${triangles} triangles, ${glb.length} bytes`)
