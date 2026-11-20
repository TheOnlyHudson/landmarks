/**
 * Pillsbury A-Mill, Minneapolis (1881, LeRoy Buffington), with the Red Tile
 * Elevator and its "Pillsbury's Best Flour" sign — procedural, CC0-1.0, no
 * textures.
 * bun generators/msp-pillsbury-a-mill.ts
 *
 * Scope. The lead asked for the A-Mill (OSM way/41763926) "plus the sign on
 * its roof". OSM and the photos put the sign elsewhere: the sign node
 * (node/12895850115, historic=sign, "Pillsbury's Best Flour") stands on the
 * 58 m brick head house of the Red Tile Elevator (OSM way/114074740, part
 * way/1539758531), which is joined wall to wall to the A-Mill's east side and
 * is part of the same Pillsbury A-Mill complex (both converted to the A-Mill
 * Artist Lofts). The lidar shows the sign's frame on that roof. So this model
 * is the A-Mill and the Red Tile Elevator together: the limestone mill, the
 * grey concrete mill block between them, the low wing along Main Street, the
 * red-tile bins and the brick head house carrying the sign. The white concrete
 * silos east of it (way/38400148, man_made=silo) are a separate building and
 * are left out, as are the other mills of the East Bank row.
 *
 * Frame: map frame x right, y forward, z up, metres, placed at bearing 30:
 * model +y runs along 3rd Avenue SE (north-north-east), +x along Main Street
 * SE (east-south-east), so the A-Mill's long Main Street face looks to -y
 * (the river side). Anchor -93.2529804, 44.9838120, the A-Mill outline's area
 * centroid. z = 0 is Main Street, the lowest ground under the footprint
 * (247.4 m); the ground rises 3.4–4.4 m to 2nd Street on the north side, where
 * the walls run down into the hill and the lowest window row is left off.
 *
 * Identity, from the photos:
 * - a seven-storey grey limestone block of rock-faced ashlar, with tall
 *   narrow windows under segmental heads, round-arched windows in the top
 *   storey and a large round-arched window over the centre of the Main Street
 *   front, a heavy cornice, and a raised roof behind it (lidar);
 * - the steel loading canopy along Main Street;
 * - east of it the grey concrete mill block with a grid of square windows and
 *   the water tank on legs on its roof;
 * - the dark red brick head house with five red-tile bins at its foot, a step
 *   at 48 m and the sign standing diagonally on its roof, facing the river;
 * - the sign: "Pillsbury's" in serif lower case over "BEST FLOUR" in serif
 *   capitals, red neon on a black steel frame braced back to the roof.
 *
 * Famous sign: the lettering is modelled (STYLE.md, "Famous signs"), traced
 * from the photos below: a bracketed slab-serif (Clarendon-like) "Pillsbury's"
 * with ball-less lower case and a raised apostrophe, and spaced serif capitals
 * for "BEST FLOUR".
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the A-Mill way/41763926
 *   (building=industrial, 6 levels) and its part way/1539758527 (7 levels),
 *   the Main Street canopy way/1539758529 (building=roof); the Red Tile
 *   Elevator way/114074740 (building=apartments, height 47, 9 levels) with
 *   parts way/1539758528 (3 levels) and way/1539758531 (height 58, 11 levels),
 *   canopies way/1539758530 and way/1539758534; the sign node/12895850115.
 * - Lidar (measured): USGS 3DEP MN_CentralMissRiver_4_B22 (flown 2022), 1 m,
 *   read in this frame with class 18 kept (city notes). Above Main Street:
 *   A-Mill cornice 31.7 m, raised roof 34.4–35.8 m (2–3 m in from the walls),
 *   its south-west quarter at the cornice; Main Street canopy 5.5 m; grey
 *   concrete block 45.7 m, its south-west corner 32.5 m; water tank top
 *   63.8 m; low wing along Main Street 15.5 m, its canopy 7.5 m; head house
 *   58.5 m, its front 4.4 m stepped down to 48 m, a 62 m penthouse at its
 *   north end; the sign frame's top 68.5–68.6 m along a diagonal from
 *   (78, 14.5) to (92.5, 0.5) in this frame, through the OSM sign node.
 *   Ground: Main Street 247.4 m, 2nd Street 250.8–251.8 m.
 * - Published (Wikipedia, "Pillsbury A-Mill"; National Register / NHL):
 *   completed 1881, designed by LeRoy S. Buffington, limestone, once the
 *   largest flour mill in the world; converted to artist lofts 2015–2016.
 * Photos (evidence, Wikimedia Commons):
 * - McGhiever, "Pillsbury A Mill 2016.jpg", CC BY-SA 4.0 (the Main Street
 *   front and 3rd Avenue side from the south-west corner: windows, cornice,
 *   centre arch, canopy):
 *   https://commons.wikimedia.org/wiki/File:Pillsbury_A_Mill_2016.jpg
 * - Innotata, "Pillsbury A Mill 3.jpg", CC0 (the same corner closer: window
 *   heads, top-storey arches, the head house and sign beyond):
 *   https://commons.wikimedia.org/wiki/File:Pillsbury_A_Mill_3.jpg
 * - Alan Levine, "Pillsbury-Minneapolis-2006.jpg", CC BY 2.0 (from the river
 *   side: A-Mill, concrete block, head house, sign, water tank):
 *   https://commons.wikimedia.org/wiki/File:Pillsbury-Minneapolis-2006.jpg
 * - Tony Webster, "Stone Arch Bridge, Minneapolis (17183544635).jpg", CC BY
 *   2.0 (from the Stone Arch Bridge, south-west: the concrete block's window
 *   grid, the red-tile bins, the head house, the sign face-on, the water tank;
 *   heights photo-scaled against the lidar):
 *   https://commons.wikimedia.org/wiki/File:Stone_Arch_Bridge,_Minneapolis_(17183544635).jpg
 * - Tony Webster, "Pillsbury's Best Flour (2639806262).jpg", CC BY 2.0 (the
 *   sign at dusk: letterforms, neon, frame and back braces):
 *   https://commons.wikimedia.org/wiki/File:Pillsbury%27s_Best_Flour_(2639806262).jpg
 * - Tiggr222, "Pillsbury A Mill through the Stone Arch Bridge.jpg",
 *   CC BY-SA 4.0 (night: the sign lit red, the A-Mill's windows):
 *   https://commons.wikimedia.org/wiki/File:Pillsbury_A_Mill_through_the_Stone_Arch_Bridge.jpg
 *
 * Numbers
 * - Plans: OSM outlines in this frame (A-Mill 52 x 36 m), squared up.
 * - Heights: lidar, above.
 * - Windows: 13 bays on the Main Street front and 9 on 3rd Avenue (photos),
 *   seven rows (the lowest the dock level); 1.3 m wide, 2.5–3.0 m tall,
 *   segmental heads, round heads in the top row (photo-scaled).
 * - Bins: five, 2.2 m radius, from the low wing's roof to 31 m (photo-scaled).
 * - Water tank: 3.3 m radius, 55–61.5 m, conical roof to 63.8 (lidar top).
 * - Sign: 20.4 m long, 10 m high over the roof; "Pillsbury's" 4.2 m high,
 *   "BEST FLOUR" 2.3 m (photo-scaled); back braces 5.5 m deep (photo).
 * - Colours: grey-buff limestone, olive-grey concrete, dark red brick from
 *   the daylight photos, pulled to the palette's lightness; red neon letters,
 *   charcoal steel.
 *
 * Doubts
 * - The east, north and 2nd Street sides of the concrete block and the head
 *   house have no close photo; their windows follow the south faces.
 * - The courtyard between the concrete block and the head house on the north
 *   is drawn as one low block (lidar 9–10 m).
 * - The painted "PILLSBURY" and "A" on the Main Street front and the "EAST BANK
 *   MILLS" signs are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { Pen, strokes } from './lettering'

// The A-Mill's walls are floodlit at night (night photo); tops barely.
const STONE = { ...finish('limestone', 0xd8d1c1), floodlight: (_p: V3, n: V3) => (n[2] > 0.5 ? 0.05 : 0.4) }
const WIN = PALETTE.window
const CONC = finish('concrete', 0x98937c)
const BRICK = finish('red-brick', 0xa3594a)
const STEEL = finish('steel', 0x4a4f57)
const NEON = finish('neon-pillsbury-red', 0xd8382b)
const stone = new Part(), win = new Part(), conc = new Part(), brick = new Part(), steel = new Part(), neon = new Part()

// ---- Helpers -----------------------------------------------------------------
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A convex polygon wound to face n. */
function poly(p: Part, q: V3[], n: V3) {
  const pts = dot(cross(sub(q[1], q[0]), sub(q[2], q[0])), n) >= 0 ? q : [...q].reverse()
  for (let i = 1; i + 1 < pts.length; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
/** A prism over a convex plan (CCW from above) from z0 to z1, walls and top. */
function prism(p: Part, plan: [number, number][], z0: number, z1: number, bottom = false) {
  const n = plan.length
  for (let i = 0; i < n; i++) {
    const a = plan[i], b = plan[(i + 1) % n]
    const nn: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], nn)
  }
  poly(p, plan.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, plan.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A rectangle with its vertical edges chamfered by c, CCW. */
const rect = (x0: number, x1: number, y0: number, y1: number, c = 0.45): [number, number][] =>
  c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.45, bottom = false) =>
  prism(p, rect(x0, x1, y0, y1, c), z0, z1, bottom)
/** A square-section bar from a to b, `r` half-width, for frames and legs. */
function bar(p: Part, a: V3, b: V3, r: number) {
  const d = sub(b, a), l = Math.hypot(...d), t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const s0 = Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1])
  const ls = Math.hypot(...s0), s: V3 = [s0[0] / ls, s0[1] / ls, s0[2] / ls], u = cross(s, t)
  const c = (o: V3, i: number): V3 => {
    const a1 = (i * Math.PI) / 2 + Math.PI / 4
    return [o[0] + (s[0] * Math.cos(a1) + u[0] * Math.sin(a1)) * r * 1.414, o[1] + (s[1] * Math.cos(a1) + u[1] * Math.sin(a1)) * r * 1.414, o[2] + (s[2] * Math.cos(a1) + u[2] * Math.sin(a1)) * r * 1.414]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, mid = (i + 0.5) * Math.PI / 2 + Math.PI / 4
    const n: V3 = [s[0] * Math.cos(mid) + u[0] * Math.sin(mid), s[1] * Math.cos(mid) + u[1] * Math.sin(mid), s[2] * Math.cos(mid) + u[2] * Math.sin(mid)]
    poly(p, [c(a, i), c(a, j), c(b, j), c(b, i)], n)
  }
}
/**
 * A window panel on a wall: the wall runs through `o` along unit `t` (in
 * plan), facing `n`; the window spans u0..u1 along it, z0 up to the head's
 * springing z1, with a flat, segmental or semicircular head.
 */
function windowAt(o: [number, number], t: [number, number], n: [number, number], u0: number, u1: number, z0: number, z1: number, head: 'flat' | 'seg' | 'round' = 'flat') {
  const off = 0.05
  const P = (u: number, z: number): V3 => [o[0] + t[0] * u + n[0] * off, o[1] + t[1] * u + n[1] * off, z]
  const N: V3 = [n[0], n[1], 0]
  poly(win, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], N)
  if (head === 'flat') return
  const hw = (u1 - u0) / 2, c = (u0 + u1) / 2
  const rise = head === 'round' ? hw : hw * 0.35, k = head === 'round' ? 6 : 3
  const R = (hw * hw + rise * rise) / (2 * rise), zc = z1 + rise - R
  const pts: V3[] = []
  for (let i = 0; i <= k; i++) {
    const u = -hw + (2 * hw * i) / k
    pts.push(P(c + u, zc + Math.sqrt(Math.max(0, R * R - u * u))))
  }
  for (let i = 0; i < k; i++) poly(win, [P(c, z1), pts[i], pts[i + 1]], N)
}

// ---- The A-Mill ----------------------------------------------------------------
// OSM: x −26.0 … 26.1, y −18.0 … 17.9 in this frame (squared).
const AX0 = -26, AX1 = 26.1, AY0 = -18, AY1 = 17.9
const CORNICE = 31.7
box(stone, AX0, AX1, AY0, AY1, 0, CORNICE - 0.9, 0.5)
// the cornice, a heavy band standing 0.4 m proud
box(stone, AX0 - 0.4, AX1 + 0.4, AY0 - 0.4, AY1 + 0.4, CORNICE - 0.9, CORNICE, 0.6, true)
// the raised roof behind the cornice (lidar)
box(stone, -8, 23, -15, 15, CORNICE, 35.2, 0.5)
box(stone, -23, -8, 2, 15, CORNICE, 34.4, 0.5)
// Main Street loading canopy (way/1539758529), steel on brackets
box(steel, AX0, AX1, -20.8, AY0, 5.1, 5.5, 0, true)
// windows: seven rows (the lowest the dock level), segmental heads, round in the top row
const ROWS: [number, number][] = [[1.3, 3.4], [6.2, 8.9], [10.6, 13.3], [14.8, 17.4], [18.9, 21.4], [22.8, 25.1], [26.4, 28.6]]
function millFace(o: [number, number], t: [number, number], n: [number, number], len: number, bays: number, lowest: number, centreArch: boolean, ground = (_u: number) => 0) {
  const pitch = len / bays
  for (let b = 0; b < bays; b++) {
    const uc = pitch * (b + 0.5)
    const centre = centreArch && b === Math.floor(bays / 2)
    for (let r = lowest; r < ROWS.length; r++) {
      const [z0, z1] = ROWS[r]
      if (centre && r >= 5) continue
      if (z0 < ground(uc) + 0.6) continue
      // paired lights in the top row, as the photos show
      if (r === ROWS.length - 1 && !centre) {
        windowAt(o, t, n, uc - 1.25, uc - 0.15, z0, z1 - 0.3, 'round')
        windowAt(o, t, n, uc + 0.15, uc + 1.25, z0, z1 - 0.3, 'round')
      } else windowAt(o, t, n, uc - 0.65, uc + 0.65, z0, z1, 'seg')
    }
    // the big round-arched window over the centre of the Main Street front
    if (centre) windowAt(o, t, n, uc - 1.7, uc + 1.7, ROWS[5][0], 27.2, 'round')
  }
}
millFace([AX0, AY0], [1, 0], [0, -1], AX1 - AX0, 13, 0, true) // Main Street front
millFace([AX1, AY1], [-1, 0], [0, 1], AX1 - AX0, 13, 1, false) // 2nd Street side, on the hill
// 3rd Avenue side: the street climbs 4.4 m from Main Street to 2nd Street (lidar)
millFace([AX0, AY1], [0, -1], [-1, 0], AY1 - AY0, 9, 0, false, (u) => 4.4 * (1 - u / (AY1 - AY0)))

// ---- The Red Tile Elevator ------------------------------------------------------
// The grey concrete mill block (L in plan), its lower south-west corner, the
// low courtyard block, the low wing along Main Street.
box(conc, 35, 75.4, -9, 9, 0, 45.7, 0.45)
box(conc, 26.1, 35, 2, 22, 0, 45.7, 0.3)
box(conc, 35, 58.5, 9, 22, 0, 45.7, 0.3)
box(conc, 26.1, 35, -9, 2, 0, 32.5, 0.3)
box(stone, 58.5, 75.4, 9, 17.2, 0, 9.8, 0.3)
box(stone, 26.1, 75.4, -17.7, -9, 0, 15.5, 0.4)
box(stone, 75.4, 97.9, -17.7, -5.8, 0, 15.5, 0.4)
box(steel, 35.6, 97.8, -20.4, -17.7, 7.1, 7.5, 0, true) // canopy way/1539758530
box(steel, 27.2, 47, 22, 24.9, 11.8, 12.2, 0, true) // canopy way/1539758534
// concrete block windows: square lights in a grid (photo: eight rows over the low wing)
for (let r = 0; r < 8; r++) {
  const z0 = 17.2 + r * 3.55, z1 = z0 + 2.0
  for (let c = 0; c < 7; c++) {
    const u = 37 + c * 5.4
    windowAt([0, -9], [1, 0], [0, -1], u, u + 2.4, z0, z1)
    if (z0 > 13) windowAt([0, 22], [1, 0], [0, 1], u - 9, u - 6.6, z0, z1)
  }
  if (z0 > 33) for (let c = 0; c < 3; c++) windowAt([26.1, 0], [0, 1], [-1, 0], -7 + c * 4.6, -4.6 + c * 4.6, z0, z1)
}
// low wing: two rows of small windows along Main Street
for (let c = 0; c < 16; c++) {
  const u = 28 + c * 4.4
  windowAt([0, -17.7], [1, 0], [0, -1], u, u + 1.6, 9.6, 11.2)
  windowAt([0, -17.7], [1, 0], [0, -1], u, u + 1.6, 12.4, 14.0)
}
// the brick head house: the front step to 48 m, the tower to 58.5, the penthouse
box(brick, 75.4, 97.8, -5.8, -1.4, 15.5, 48, 0.3)
box(brick, 75.4, 97.8, -1.4, 20, 0, 58.5, 0.45)
box(brick, 85.1, 94.5, 15, 22, 0, 62, 0.3)
// the five red-tile bins at its foot
for (let k = 0; k < 5; k++) {
  const cx = 75.4 + 2.24 * (2 * k + 1), cy = -8.0, r = 2.05, n = 10
  const ring = (z: number) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n), z] as V3)
  const a = ring(15.5), b = ring(31)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, m = ((i + 0.5) * 2 * Math.PI) / n
    poly(brick, [a[i], a[j], b[j], b[i]], [Math.cos(m), Math.sin(m), 0])
  }
  poly(brick, b, [0, 0, 1])
}
// head house windows: small single lights in two columns, as the photo shows
for (const z of [35, 40, 44.5, 51, 55]) for (const u of [80.5, 91]) {
  const face: [number, number] = z < 48 ? [0, -5.8] : [0, -1.4]
  windowAt(face, [1, 0], [0, -1], u, u + 1.3, z, z + 1.6)
}
// the water tank on legs on the concrete block's roof
{
  const cx = 48, cy = 12, r = 3.3, n = 12
  const ring = (z: number, rr: number) => Array.from({ length: n }, (_, i) => [cx + rr * Math.cos((2 * Math.PI * i) / n), cy + rr * Math.sin((2 * Math.PI * i) / n), z] as V3)
  const a = ring(55, r), b = ring(61.5, r), apex: V3 = [cx, cy, 63.8]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, m = ((i + 0.5) * 2 * Math.PI) / n
    poly(stone, [a[i], a[j], b[j], b[i]], [Math.cos(m), Math.sin(m), 0])
    poly(stone, [b[i], b[j], apex], [Math.cos(m), Math.sin(m), 1])
  }
  poly(stone, a, [0, 0, -1])
  for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) bar(steel, [cx + dx * 3.2, cy + dy * 3.2, 45.7], [cx + dx * 2.2, cy + dy * 2.2, 55], 0.22)
}

// ---- The sign ------------------------------------------------------------------
// On the head house roof (58.5) along the lidar diagonal, facing the river
// (−x −y, toward the Stone Arch Bridge).
const ROOF = 58.5
const S0: [number, number] = [78, 14.5], S1: [number, number] = [92.5, 0.5]
const SL = Math.hypot(S1[0] - S0[0], S1[1] - S0[1])
const AL: [number, number] = [(S1[0] - S0[0]) / SL, (S1[1] - S0[1]) / SL]
const NF: [number, number] = [-AL[1], AL[0]] // toward the viewer? fixed below
const front: [number, number] = NF[0] + NF[1] < 0 ? NF : [-NF[0], -NF[1]]
/** Sign plane: u along (m), v up from the roof (m), w toward the viewer (m). */
const SP = (u: number, v: number, w: number): V3 => [S0[0] + AL[0] * u + front[0] * w, S0[1] + AL[1] * u + front[1] * w, ROOF + v]
// frame: posts, rails, back braces
const SH = 10
const posts = 9
for (let i = 0; i < posts; i++) {
  const u = (SL * i) / (posts - 1)
  bar(steel, SP(u, 0, 0), SP(u, SH, 0), 0.14)
  bar(steel, SP(u, SH, 0), SP(u, 0, -5.5), 0.14) // back brace
  bar(steel, SP(u, 0, -5.5), SP(u, 0, 0), 0.12)
}
for (const v of [0.4, 2.0, 5.3, SH]) bar(steel, SP(0, v, 0), SP(SL, v, 0), 0.13)
for (let i = 0; i + 1 < posts; i++) {
  const u0 = (SL * i) / (posts - 1), u1 = (SL * (i + 1)) / (posts - 1)
  bar(steel, SP(u0, 2.0, 0), SP(u1, 5.3, 0), 0.08) // the face's lattice diagonals
}

// Letterforms (cap or ascender height 1, baseline 0), traced from the photos.
type Glyph = { w: number; draw: (p: Pen) => void }
const G: Record<string, Glyph> = {
  P: { w: 0.62, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.34, 1]).quadTo([0.58, 1], [0.58, 0.76]).quadTo([0.58, 0.5], [0.34, 0.5]).lineTo([0, 0.5]); p.moveTo([-0.12, 0]).lineTo([0.16, 0]) } },
  i: { w: 0.26, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 0.55]).lineTo([-0.09, 0.55]); p.moveTo([-0.1, 0]).lineTo([0.1, 0]); p.moveTo([0, 0.7]).lineTo([0, 0.82]) } },
  l: { w: 0.26, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([-0.09, 1]); p.moveTo([-0.1, 0]).lineTo([0.1, 0]) } },
  s: { w: 0.4, draw: (p) => { p.moveTo([0.33, 0.46]).cubicTo([0.27, 0.58], [0.0, 0.58], [0.02, 0.42], 5).cubicTo([0.04, 0.27], [0.33, 0.31], [0.33, 0.15], 5).cubicTo([0.33, -0.03], [0.04, -0.02], [0.0, 0.1], 5) } },
  b: { w: 0.52, draw: (p) => { p.moveTo([-0.09, 1]).lineTo([0, 1]).lineTo([0, 0]); p.circle([0.22, 0.28], 0.22, 0.28, 10) } },
  u: { w: 0.52, draw: (p) => { p.moveTo([-0.08, 0.55]).lineTo([0, 0.55]).lineTo([0, 0.16]).quadTo([0, 0], [0.18, 0], 3).quadTo([0.36, 0], [0.36, 0.16], 3); p.moveTo([0.28, 0.55]).lineTo([0.36, 0.55]).lineTo([0.36, 0]).lineTo([0.45, 0]) } },
  r: { w: 0.38, draw: (p) => { p.moveTo([-0.09, 0.55]).lineTo([0, 0.55]).lineTo([0, 0]); p.moveTo([-0.1, 0]).lineTo([0.12, 0]); p.moveTo([0, 0.38]).quadTo([0.06, 0.56], [0.27, 0.53], 4) } },
  y: { w: 0.5, draw: (p) => { p.moveTo([-0.08, 0.55]).lineTo([0.08, 0.55]); p.moveTo([0, 0.55]).lineTo([0.2, 0.06]); p.moveTo([0.3, 0.55]).lineTo([0.46, 0.55]); p.moveTo([0.39, 0.55]).lineTo([0.12, -0.24]).quadTo([0.08, -0.33], [-0.04, -0.3], 3) } },
  "'": { w: 0.2, draw: (p) => { p.moveTo([0.06, 1.02]).quadTo([0.08, 0.86], [-0.02, 0.8], 3) } },
  B: { w: 0.62, draw: (p) => { p.moveTo([-0.1, 1]).lineTo([0.3, 1]).quadTo([0.48, 1], [0.48, 0.77], 4).quadTo([0.48, 0.54], [0.3, 0.54], 4).lineTo([0, 0.54]); p.moveTo([0.3, 0.54]).quadTo([0.53, 0.54], [0.53, 0.27], 4).quadTo([0.53, 0], [0.3, 0], 4).lineTo([-0.1, 0]); p.moveTo([0, 0]).lineTo([0, 1]) } },
  E: { w: 0.56, draw: (p) => { p.moveTo([0.46, 0.84]).lineTo([0.46, 1]).lineTo([-0.1, 1]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.1, 0]).lineTo([0.48, 0]).lineTo([0.48, 0.16]); p.moveTo([0, 0.52]).lineTo([0.32, 0.52]) } },
  S: { w: 0.56, draw: (p) => { p.moveTo([0.46, 0.84]).cubicTo([0.36, 1.04], [0.0, 1.03], [0.02, 0.75], 5).cubicTo([0.04, 0.5], [0.49, 0.53], [0.49, 0.25], 5).cubicTo([0.49, -0.03], [0.08, -0.04], [0.0, 0.16], 5) } },
  T: { w: 0.64, draw: (p) => { p.moveTo([0, 0.84]).lineTo([0, 1]).lineTo([0.6, 1]).lineTo([0.6, 0.84]); p.moveTo([0.3, 1]).lineTo([0.3, 0]); p.moveTo([0.17, 0]).lineTo([0.43, 0]) } },
  F: { w: 0.54, draw: (p) => { p.moveTo([0.46, 0.84]).lineTo([0.46, 1]).lineTo([-0.1, 1]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.1, 0]).lineTo([0.14, 0]); p.moveTo([0, 0.52]).lineTo([0.32, 0.52]) } },
  L: { w: 0.54, draw: (p) => { p.moveTo([-0.1, 1]).lineTo([0.14, 1]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.1, 0]).lineTo([0.46, 0]).lineTo([0.46, 0.17]) } },
  O: { w: 0.66, draw: (p) => { p.circle([0.3, 0.5], 0.3, 0.5, 14) } },
  U: { w: 0.74, draw: (p) => { p.moveTo([-0.1, 1]).lineTo([0.11, 1]); p.moveTo([0.49, 1]).lineTo([0.7, 1]); p.moveTo([0, 1]).lineTo([0, 0.3]).quadTo([0, 0], [0.3, 0], 4).quadTo([0.6, 0], [0.6, 0.3], 4).lineTo([0.6, 1]) } },
  R: { w: 0.64, draw: (p) => { p.moveTo([-0.1, 1]).lineTo([0.3, 1]).quadTo([0.5, 1], [0.5, 0.76], 4).quadTo([0.5, 0.52], [0.3, 0.52], 4).lineTo([0, 0.52]); p.moveTo([0, 1]).lineTo([0, 0]); p.moveTo([-0.1, 0]).lineTo([0.12, 0]); p.moveTo([0.24, 0.52]).lineTo([0.52, 0]).lineTo([0.62, 0]) } },
  ' ': { w: 0.35, draw: () => {} },
}
/** Lay out a word; returns the pen and its width in letter units. */
function word(text: string, gap: number) {
  const pen = new Pen()
  let x = 0
  for (const ch of text) {
    const g = G[ch]
    const sub = new Pen()
    g.draw(sub)
    pen.add(sub, x + 0.1)
    x += g.w + gap
  }
  return { pen, width: x - gap }
}
{
  // "Pillsbury's": 4.2 m ascender height, 17 m long, over the top of the frame's face
  const top = word("Pillsbury's", 0.06)
  const k1 = 17 / top.width, h1 = 4.2, base1 = 6.25
  strokes(neon, top.pen.paths, { width: 0.16, depth: 0.4, back: true, place: (u, v, w) => SP(1.6 + u * (k1 * 1), base1 + v * h1 / 1, 0.15 + w) })
  // "BEST FLOUR": 2.3 m capitals, spaced, under it
  const bot = word('BEST FLOUR', 0.14)
  const k2 = 16 / bot.width, h2 = 2.3
  strokes(neon, bot.pen.paths, { width: 0.18, depth: 0.4, back: true, place: (u, v, w) => SP(2.4 + u * k2, 2.6 + v * h2, 0.15 + w) })
}

// ---- Write -----------------------------------------------------------------------
const parts = [
  { part: stone, material: STONE },
  { part: win, material: WIN },
  { part: conc, material: CONC },
  { part: brick, material: BRICK },
  { part: steel, material: STEEL },
  { part: neon, material: NEON },
]
const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
const glb = writeGlb('msp-pillsbury-a-mill', parts, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
const outPath = process.argv[2] ?? new URL('../models/msp-pillsbury-a-mill.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${tris} triangles, ${glb.length} bytes`)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
