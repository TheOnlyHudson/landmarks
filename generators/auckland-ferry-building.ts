/**
 * Ferry Building (Whare Waka Kōpiko), Quay Street, Auckland: procedural, CC0-1.0.
 * bun generators/auckland-ferry-building.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 17.9: the long
 * sides of OSM's outline way/23904427 run at 107.9 degrees, so model +x runs
 * along Quay Street (east-south-east) and model +y faces the harbour (north-
 * north-east). Origin: the outline's area centroid (174.766884, -36.842996);
 * the outline is a 63.0 x 14.1 m rectangle in this frame (x ±31.5, y ±7.05).
 * y = 0 is the Quay Street pavement; the site is reclaimed and level
 * (Mapterhorn z12 varies 0.5 m across it).
 *
 * Built 1909-12 to Alexander Wiseman's design, Edwardian Baroque: a
 * rusticated sandstone ground storey with round arches, a giant order of
 * paired sandstone pilasters and columns through two storeys of red brick,
 * a deep modillion cornice, a brick top storey with two pavilions on each
 * long side crowned by big semicircular arched hoods over lunettes, a
 * glazed attic strip under a low hipped roof, and the clock tower on the
 * Quay Street side: brick shaft, sandstone clock stage with arched hoods
 * over the four dials, a belfry with paired columns at the corners and a
 * louvred opening on each face, a consoled cornice and a tall sandstone
 * pyramid cap with a railed top and flagpole.
 *
 * OSM: outline way/23904427 (5 levels, stone, mansard roof #d5956d); the
 * tower way/1037508949 (7 levels, pyramidal roof 9 m), 8.2 x 7.7 m on the
 * Quay Street face, its centre 0.35 m east of the outline's centre (drawn
 * centred). Both are replaced. Neighbours not drawn: the wharf canopies and
 * terminal sheds north of it, Luxe Real Estate way/863430740.
 *
 * Photo-scaled (p2, frontal from the harbour, scaled by OSM's 63 m length,
 * 18.1 px/m in a 2x crop; p11, the east end nearly frontal, by its 14.1 m):
 * - ground storey 0-5.8 m; giant order 5.8-14.0 (first floor windows
 *   6.6-9.6, second 10.6-13.2); entablature 14.0-15.0 and cornice to 15.6;
 *   top storey 15.6-18.6; the pavilions' arched hoods span nearly the
 *   pavilion (outer radius 4.6 m from the cornice) and rise to 20.2;
 *   upper cornice to 19.2; glazed attic strip 19.2-20.3; eaves 20.3 with a
 *   0.9 m overhang; ridge 22.0.
 * - long sides: corner bay 4 m, one bay, a 9.3 m pavilion (p2 centres at
 *   13.2 m from each end), seven bays of 4.06 m in the centre.
 * - east and west ends: two pairs of giant columns, a pedimented window
 *   under an oculus between them, a lunette above the cornice (p11, p6).
 * - tower (p2 at 12.3 px/m): brick shaft 7.2 m square to 23.0, clock stage
 *   7.4 m to 26.6 (dials 2.2 m across, centred at 24.5), cornice to 27.2,
 *   belfry 5.2 m core with paired corner columns to 31.6, cornice to 32.3,
 *   plinth to 33.2, cap to 37.6 (p2 reads 37.8), railing and flagpole to
 *   about 42.5 (p2, p7, p10).
 * Estimated: arch sizes in the ground storey (2.8 m wide, crowns 4.8 m),
 *   column and pilaster widths, the end facades' ground storey (drawn with
 *   three arched openings), the roof pitch (low, from p1 and p11).
 * Left out: the harbour side's first-floor dining deck and canopies (later
 *   additions), the "FERRY BUILDING" lettering, urns, the weathervane, the
 *   wharf canopies outside the outline.
 *
 * Colours (daylight photos p1, p7, p11, p2; pulled to the palette's
 * lightness): the painted sandstone is an ochre yellow -> 0xdcb46e; brick
 * red-brown -> 0xa65a46; roof a darker red-brown -> 0x8f5446 (OSM #d5956d is
 * lighter than every photo); dials white with dark numerals -> trim.
 *
 * Night (p6, June 2025): the sandstone and the tower are floodlit warm
 * (`_FLOODLIGHT` on the sandstone, weaker on the brick); windows glow.
 *
 * Detail model (models/auckland-ferry-building.detail.glb): modillions under
 * both cornices, keystones and window surrounds, rounder columns with
 * capitals, the attic strip's mullions, clock hands and the tower railing.
 *
 * Photos (Wikimedia Commons):
 * - p1 "Ferry Building, Auckland, 2007.jpg", Leslie Veen, CC BY-SA 2.0 (Quay St, from the south-east)
 * - p2 "Auckland Ferry Building PA01.jpg", Paora, CC0 (harbour side, frontal)
 * - p6 "Auckland Ferry Building at night June 2025.jpg", Paora, CC0 (night, east end)
 * - p7 "Ferry Building - Auckland, NZ - DSC08252.jpg", Daderot, CC0 (tower close-up)
 * - p10 "The Ferry Building. (10523195983).jpg", Bernard Spragg. NZ, CC0 (from the harbour, north-east)
 * - p11 "Ferry Building 2 (31958582922).jpg", Tony Hisgett, CC BY 2.0 (east end)
 * - p12 "Ferry Building (31958593712).jpg", Tony Hisgett, CC BY 2.0
 * Look-only: none.
 * Doubts: the west end was only seen obliquely (drawn as the east end); the
 * bay rhythm of the Quay Street side beyond the pavilions is from p1 at a
 * slant.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import { face, lathe, prism, box, skin, bar, arch, saveLods, type XY, type Layer } from './auckland-sky-tower'

const TAU = Math.PI * 2
const HX = 31.5, HY = 7.05
const BASE = 5.8, GIANT = 14.0, ENT = 15.0, CORN = 15.6, TOP = 18.6, CORN2 = 19.2, EAVE = 20.3, RIDGE = 22.0

type Set = { brick: Part; sand: Part; win: Part; roof: Part; white: Part }
const mk = (): Set => ({ brick: new Part(), sand: new Part(), win: new Part(), roof: new Part(), white: new Part() })
const low = mk(), det = mk()

/** Long-side layout along s (0..63): bay centres and pavilion spans. */
const L = 2 * HX
const PAV = [[8.0, 17.3], [45.7, 55.0]] as [number, number][]
const centreBays = Array.from({ length: 7 }, (_, k) => 17.3 + 4.06 * (k + 0.5))
const BAYS = [2.0, 6.0, ...centreBays, L - 6.0, L - 2.0]

/**
 * A brick wall skin with its windows: real reveals in the detail model; in
 * the low model the windows are flush slate panels on the face (STYLE.md:
 * within 0.06 m of the wall), which keeps the low GLB in its byte budget.
 */
function wall(d: boolean, p: Part, glass: Part, a: XY, b: XY, z0: number, z1: number, depth: number, holes: XY[][], o: { top?: boolean } = {}) {
  if (d) return skin(p, glass, a, b, z0, z1, depth, holes, o)
  skin(p, null, a, b, z0, z1, depth, [], o)
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], nn: XY = [u[1], -u[0]]
  const W = (sv: number, z: number): V3 => [a[0] + u[0] * sv + nn[0] * (depth + 0.03), a[1] + u[1] * sv + nn[1] * (depth + 0.03), z]
  for (const h of holes) for (const [q, r, t] of polyTris(h)) face(glass, [W(q[0], q[1]), W(r[0], r[1]), W(t[0], t[1])], [nn[0], nn[1], 0])
}

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const seg = d ? 10 : 4
  // core volume behind the skins
  box(s.brick, [0, 0], HX, HY, 0, EAVE - 0.05, 0, { top: false })

  const walls: [XY, XY, 'long' | 'end', number][] = [
    [[-HX, -HY], [HX, -HY], 'long', -1], // Quay Street (south-south-west)
    [[HX, HY], [-HX, HY], 'long', 1], // harbour
    [[HX, -HY], [HX, HY], 'end', 1], // east end
    [[-HX, HY], [-HX, -HY], 'end', -1], // west end
  ]
  for (const [a, b, kind] of walls) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], nn: XY = [u[1], -u[0]]
    const W = (sv: number, z: number, dd: number): V3 => [a[0] + u[0] * sv + nn[0] * dd, a[1] + u[1] * sv + nn[1] * dd, z]
    const at = (sv: number, dd: number): XY => [a[0] + u[0] * sv + nn[0] * dd, a[1] + u[1] * sv + nn[1] * dd]
    const rotA = Math.atan2(u[1], u[0])

    if (kind === 'long') {
      // -- ground storey: rusticated sandstone with round arches; a wide arch at each pavilion and at the centre
      const arches: XY[][] = []
      for (const c of BAYS) {
        const w = Math.abs(c - L / 2) < 0.1 ? 4.6 : 2.8
        const zs = Math.abs(c - L / 2) < 0.1 ? 3.0 : 3.4
        arches.push(arch(c - w / 2, c + w / 2, 0.0, zs, seg))
      }
      for (const [p0, p1] of PAV) { const c = (p0 + p1) / 2; arches.push(arch(c - 2.0, c + 2.0, 0, 3.0, seg)) }
      skin(s.sand, s.win, a, b, 0, BASE, 0.55, arches, { top: true })
      // the windows sit deep in the arches (a recessed shopfront): push the glass back
      // (skin puts glass on the wall plane at 0.03, 0.55 behind the face: real reveals)
      // plinth string course
      bar(s.sand, W(-0.3, BASE + 0.15, 0.75), W(len + 0.3, BASE + 0.15, 0.75), 0.3, 0.3)

      // -- giant order: brick with two floors of windows per bay
      const wins: XY[][] = []
      for (const c of BAYS) wins.push(rect(c - 0.8, c + 0.8, 6.6, 9.6), rect(c - 0.8, c + 0.8, 10.6, 13.2))
      for (const [p0, p1] of PAV) {
        const c = (p0 + p1) / 2
        for (const dx of [-2.1, 2.1]) wins.push(rect(c + dx - 0.8, c + dx + 0.8, 6.6, 9.6), rect(c + dx - 0.8, c + dx + 0.8, 10.6, 13.2))
      }
      wall(d, s.brick, s.win, a, b, BASE, GIANT, 0.3, wins, { top: false })
      // sandstone window heads and sills (bold, flush blocks)
      for (const h of wins) {
        const s0 = h[0][0], s1 = h[1][0], z0 = h[0][1], z1 = h[2][1]
        box(s.sand, at((s0 + s1) / 2, 0.42), (s1 - s0) / 2 + 0.25, 0.12, z1, z1 + 0.45, rotA)
        if (d) box(s.sand, at((s0 + s1) / 2, 0.42), (s1 - s0) / 2 + 0.15, 0.12, z0 - 0.25, z0, rotA)
      }
      // paired pilasters at the bay boundaries; engaged columns framing the pavilions
      const bounds = [4.0, 8.0, ...Array.from({ length: 8 }, (_, k) => 17.3 + 4.06 * k), L - 8.0, L - 4.0].filter((v) => !PAV.some(([p0, p1]) => Math.abs(v - p0) < 0.1 || Math.abs(v - p1) < 0.1))
      // (paired in the detail model; one pilaster as wide as the pair in the low one)
      for (const v of [0.45, ...bounds, L - 0.45]) for (const o of v < 1 || v > L - 1 || !d ? [0] : [-0.45, 0.45])
        box(s.sand, at(v + o, 0.48), v < 1 || v > L - 1 ? 0.27 : d ? 0.36 : 0.8, 0.2, BASE, GIANT, rotA)
      for (const [p0, p1] of PAV) for (const v of [p0 + 0.45, p0 + 1.35, p1 - 1.35, p1 - 0.45]) {
        const c = at(v, 0.35), ang = Math.atan2(nn[1], nn[0])
        lathe(s.sand, c, [[0.42, BASE], [0.42, GIANT - 0.6], [0.55, GIANT - 0.3], [0.55, GIANT]], d ? 14 : 5, { arc: [ang - Math.PI / 2, ang + Math.PI / 2], top: true })
      }

      // -- top storey with the pavilions' arched hoods
      const tops: XY[][] = []
      for (const c of BAYS) tops.push(rect(c - 0.7, c + 0.7, 16.2, 18.1))
      for (const [p0, p1] of PAV) {
        const c = (p0 + p1) / 2
        tops.push(arch(c - 2.0, c + 2.0, 15.9, 16.2, seg * 2)) // the lunette under the hood
      }
      wall(d, s.brick, s.win, a, b, CORN, TOP, 0.3, tops, { top: false })
      for (const [p0, p1] of PAV) {
        const c = (p0 + p1) / 2
        // tympanum (brick) with a glazed lunette, under a sandstone hood ring standing proud
        const R0 = 3.8, R1 = 4.6, zc = 15.6
        const ring = (r: number, z: number, t: number): V3 => W(c + r * Math.cos(t), zc + r * Math.sin(t), z)
        const m = d ? 20 : 6
        for (let i = 0; i < m; i++) {
          const t0 = (Math.PI * i) / m, t1 = (Math.PI * (i + 1)) / m
          // hood: front face, outer and inner rims
          face(s.sand, [W(c + R0 * Math.cos(t0), zc + R0 * Math.sin(t0), 0.75), W(c + R1 * Math.cos(t0), zc + R1 * Math.sin(t0), 0.75), W(c + R1 * Math.cos(t1), zc + R1 * Math.sin(t1), 0.75), W(c + R0 * Math.cos(t1), zc + R0 * Math.sin(t1), 0.75)], [nn[0], nn[1], 0])
          const tm = (t0 + t1) / 2, out: V3 = [u[0] * Math.cos(tm), u[1] * Math.cos(tm), Math.sin(tm)]
          face(s.sand, [W(c + R1 * Math.cos(t0), zc + R1 * Math.sin(t0), 0.75), W(c + R1 * Math.cos(t0), zc + R1 * Math.sin(t0), 0), W(c + R1 * Math.cos(t1), zc + R1 * Math.sin(t1), 0), W(c + R1 * Math.cos(t1), zc + R1 * Math.sin(t1), 0.75)], out)
          face(s.sand, [W(c + R0 * Math.cos(t0), zc + R0 * Math.sin(t0), 0), W(c + R0 * Math.cos(t0), zc + R0 * Math.sin(t0), 0.75), W(c + R0 * Math.cos(t1), zc + R0 * Math.sin(t1), 0.75), W(c + R0 * Math.cos(t1), zc + R0 * Math.sin(t1), 0)], out.map((x) => -x) as V3)
          // tympanum: brick between the lunette (r 1.9) and the hood (r 2.9), above the storey line
          const r2 = 2.6
          face(s.brick, [ring(r2, 0.32, t0), ring(R0, 0.32, t0), ring(R0, 0.32, t1), ring(r2, 0.32, t1)].map((p) => [p[0], p[1], p[2]] as V3), [nn[0], nn[1], 0])
        }
        // the hood's springing blocks and the pavilion's top-storey piers
        for (const dx of [-1, 1]) box(s.sand, at(c + dx * (R0 + R1) / 2, 0.4), (R1 - R0) / 2 + 0.15, 0.38, CORN, zc + 0.2, rotA)
        if (d) box(s.sand, at(c, 0.8), 0.35, 0.12, zc + R0 - 0.3, zc + R1 + 0.1, rotA) // keystone
      }
      // detail: modillions under the main cornice
      if (d) for (let v = 0.6; v < len - 0.3; v += 1.0) box(s.sand, at(v, 0.75), 0.14, 0.3, ENT + 0.05, ENT + 0.3, rotA, { bottom: true })
    } else {
      // -- the ends: three arches below, two pairs of giant columns, pedimented window and oculus, lunette above
      skin(s.sand, s.win, a, b, 0, BASE, 0.55, [arch(1.0, 3.6, 0, 3.4, seg), arch(5.3, 8.8, 0, 3.0, seg), arch(len - 3.6, len - 1.0, 0, 3.4, seg)], { top: true })
      bar(s.sand, W(-0.3, BASE + 0.15, 0.75), W(len + 0.3, BASE + 0.15, 0.75), 0.3, 0.3)
      const c = len / 2
      const oc: XY[] = []
      for (let i = 0; i < 16; i++) { const t = (i / 16) * TAU; oc.push([c + 0.95 * Math.cos(t), 11.6 + 0.95 * Math.sin(t)]) }
      const wins: XY[][] = [rect(c - 0.9, c + 0.9, 6.6, 9.4), oc, rect(1.0, 2.2, 6.6, 9.4), rect(1.0, 2.2, 10.6, 13.0), rect(len - 2.2, len - 1.0, 6.6, 9.4), rect(len - 2.2, len - 1.0, 10.6, 13.0)]
      wall(d, s.brick, s.win, a, b, BASE, GIANT, 0.3, wins, { top: false })
      // pediment over the centre window and the oculus surround
      box(s.sand, at(c, 0.45), 1.35, 0.15, 9.4, 9.8, rotA)
      face(s.sand, [W(c - 1.35, 9.8, 0.6), W(c + 1.35, 9.8, 0.6), W(c, 10.45, 0.6)], [nn[0], nn[1], 0])
      const ang = Math.atan2(nn[1], nn[0])
      for (const v of [3.05, 4.15, len - 4.15, len - 3.05]) {
        lathe(s.sand, at(v, 0.62), [[0.5, BASE], [0.5, GIANT - 0.6], [0.62, GIANT - 0.3], [0.62, GIANT]], d ? 16 : 6, { arc: [ang - Math.PI * 0.75, ang + Math.PI * 0.75], top: true })
      }
      for (const v of [0.45, len - 0.45]) box(s.sand, at(v, 0.48), 0.45, 0.2, BASE, GIANT, rotA)
      // top storey: lunette between two windows
      const lun = arch(c - 1.8, c + 1.8, 16.0, 16.0, seg * 2)
      wall(d, s.brick, s.win, a, b, CORN, TOP, 0.3, [lun, rect(1.0, 2.2, 16.2, 18.1), rect(len - 2.2, len - 1.0, 16.2, 18.1)], { top: false })
      for (let i = 0; i < seg * 2; i++) {
        const t0 = (Math.PI * i) / (seg * 2), t1 = (Math.PI * (i + 1)) / (seg * 2)
        face(s.sand, [W(c + 1.8 * Math.cos(t0), 16 + 1.8 * Math.sin(t0), 0.42), W(c + 2.3 * Math.cos(t0), 16 + 2.3 * Math.sin(t0), 0.42), W(c + 2.3 * Math.cos(t1), 16 + 2.3 * Math.sin(t1), 0.42), W(c + 1.8 * Math.cos(t1), 16 + 1.8 * Math.sin(t1), 0.42)], [nn[0], nn[1], 0])
      }
      if (d) for (let v = 0.6; v < len - 0.3; v += 1.0) box(s.sand, at(v, 0.75), 0.14, 0.3, ENT + 0.05, ENT + 0.3, rotA, { bottom: true })
    }
  }

  // -- entablature, cornices, attic strip and the roof
  box(s.sand, [0, 0], HX + 0.45, HY + 0.45, GIANT, ENT, 0, { bottom: true })
  box(s.sand, [0, 0], HX + 0.95, HY + 0.95, ENT, CORN, 0, { bottom: true })
  box(s.sand, [0, 0], HX + 0.7, HY + 0.7, TOP, CORN2, 0, { bottom: true })
  box(s.win, [0, 0], HX - 0.3, HY - 0.3, CORN2, EAVE, 0, { top: false })
  // attic piers (sandstone) between the glazing panels
  {
    const step = d ? 1.6 : 10.5
    for (let x = -HX + 0.3; x <= HX - 0.3 + 1e-6; x += (2 * HX - 0.6) / Math.round((2 * HX - 0.6) / step)) for (const y of [-1, 1]) box(s.sand, [x, y * (HY - 0.3)], 0.22, 0.12, CORN2, EAVE, 0)
    for (let y = -HY + 0.3; y <= HY - 0.3 + 1e-6; y += (2 * HY - 0.6) / Math.round((2 * HY - 0.6) / step)) for (const x of [-1, 1]) box(s.sand, [x * (HX - 0.3), y], 0.12, 0.22, CORN2, EAVE, 0)
  }
  {
    // hipped roof with overhanging eaves
    const ox = HX + 0.9, oy = HY + 0.9, rx = ox - oy, ez = EAVE, rz = RIDGE
    const e: V3[] = [[-ox, -oy, ez], [ox, -oy, ez], [ox, oy, ez], [-ox, oy, ez]]
    const r0: V3 = [-rx, 0, rz], r1: V3 = [rx, 0, rz]
    face(s.roof, [e[0], e[1], r1, r0], [0, -(rz - ez), oy])
    face(s.roof, [e[2], e[3], r0, r1], [0, rz - ez, oy])
    face(s.roof, [e[1], e[2], r1], [rz - ez, 0, oy])
    face(s.roof, [e[3], e[0], r0], [-(rz - ez), 0, oy])
    face(s.roof, [e[3], e[2], e[1], e[0]], [0, 0, -1]) // soffit
    // fascia
    for (const [p, q] of [[e[0], e[1]], [e[1], e[2]], [e[2], e[3]], [e[3], e[0]]] as [V3, V3][]) {
      const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy)
      face(s.roof, [[p[0], p[1], ez - 0.3], [q[0], q[1], ez - 0.3], [q[0], q[1], ez], [p[0], p[1], ez]], [dy / l, -dx / l, 0])
    }
    face(s.roof, [[-ox, -oy, ez - 0.3], [-ox, oy, ez - 0.3], [ox, oy, ez - 0.3], [ox, -oy, ez - 0.3]], [0, 0, -1])
  }

  // -- the clock tower (on the Quay Street side, its front flush with the facade)
  const TY = -HY + 3.6, TH = 3.6 // centre y and half width of the brick shaft
  box(s.brick, [0, TY], TH, 3.6, GIANT, 23.0, 0)
  // clock stage
  box(s.sand, [0, TY], TH + 0.12, TH + 0.12, 23.0, 26.6, 0)
  box(s.sand, [0, TY], TH + 0.45, TH + 0.45, 26.6, 27.2, 0, { bottom: true })
  const faces: [XY, number][] = [[[0, -1], 0], [[1, 0], 0], [[0, 1], 0], [[-1, 0], 0]]
  for (const [n] of faces) {
    const ext = TH + 0.12
    const c: V3 = [n[0] * (ext + 0.04), TY + n[1] * (ext + 0.04), 24.5]
    const t: XY = [-n[1], n[0]]
    const D = (r: number, a: number, dz = 0): V3 => [c[0] + t[0] * r * Math.cos(a) + n[0] * dz, c[1] + t[1] * r * Math.cos(a) + n[1] * dz, c[2] + r * Math.sin(a)]
    const m = d ? 24 : 12
    for (let i = 0; i < m; i++) {
      const a0 = (i / m) * TAU, a1 = ((i + 1) / m) * TAU
      face(s.white, [c, D(1.1, a0), D(1.1, a1)], [n[0], n[1], 0])
      face(s.sand, [D(1.1, a0), D(1.3, a0, 0.15), D(1.3, a1, 0.15), D(1.1, a1)], [n[0], n[1], 0]) // dial ring
    }
    // the arched hood over each dial (a half ring standing proud)
    for (let i = 0; i < m / 2; i++) {
      const a0 = (Math.PI * i) / (m / 2), a1 = (Math.PI * (i + 1)) / (m / 2)
      const H = (r: number, a: number, dz: number): V3 => [c[0] + t[0] * r * Math.cos(a) + n[0] * dz, c[1] + t[1] * r * Math.cos(a) + n[1] * dz, 24.8 + r * Math.sin(a)]
      face(s.sand, [H(1.5, a0, 0.5), H(1.95, a0, 0.5), H(1.95, a1, 0.5), H(1.5, a1, 0.5)], [n[0], n[1], 0])
      const am = (a0 + a1) / 2
      face(s.sand, [H(1.95, a0, 0.5), H(1.95, a0, 0), H(1.95, a1, 0), H(1.95, a1, 0.5)], [t[0] * Math.cos(am), t[1] * Math.cos(am), Math.sin(am)])
    }
    if (d) {
      // hands at ten past ten
      bar(s.brick, [c[0] + n[0] * 0.05, c[1] + n[1] * 0.05, c[2]], D(0.75, Math.PI * 0.8, 0.05), 0.09, 0.05, [n[0], n[1], 0])
      bar(s.brick, [c[0] + n[0] * 0.05, c[1] + n[1] * 0.05, c[2]], D(1.0, Math.PI * 0.22, 0.05), 0.07, 0.05, [n[0], n[1], 0])
    }
  }
  // belfry: a core with a louvred opening on each face, paired columns near each corner
  const BH = 2.6
  box(s.sand, [0, TY], BH, BH, 27.2, 31.6, 0)
  for (const [n] of faces) {
    const t: XY = [-n[1], n[0]]
    const P = (sv: number, dd: number): XY => [t[0] * sv + n[0] * (BH + dd), TY + t[1] * sv + n[1] * (BH + dd)]
    // louvres: a dark recessed panel framed by a sandstone surround
    const rot = Math.atan2(t[1], t[0])
    box(s.roof, P(0, 0.02), 0.65, 0.04, 28.2, 30.6, rot)
    box(s.sand, P(0, 0.12), 0.95, 0.1, 27.9, 28.2, rot)
    box(s.sand, P(0, 0.12), 0.95, 0.1, 30.6, 31.0, rot)
    for (const sv of [-0.8, 0.8]) box(s.sand, P(sv, 0.12), 0.15, 0.1, 28.2, 30.6, rot)
    for (const sv of [-2.2, 2.2]) {
      const cc = P(sv, 0.55)
      lathe(s.sand, cc, [[0.28, 27.2], [0.28, 31.0], [0.4, 31.3], [0.4, 31.6]], d ? 12 : 5, { top: true })
    }
  }
  box(s.sand, [0, TY], BH + 1.1, BH + 1.1, 31.6, 32.3, 0, { bottom: true })
  box(s.sand, [0, TY], BH + 0.5, BH + 0.5, 32.3, 33.2, 0)
  if (d) for (const [n] of faces) for (const sv of [-2.8, 2.8]) {
    const t: XY = [-n[1], n[0]]
    box(s.sand, [t[0] * sv + n[0] * (BH + 0.65), TY + t[1] * sv + n[1] * (BH + 0.65)], 0.25, 0.25, 32.3, 33.0, 0) // consoles
  }
  // cap: a steep sandstone pyramid, slightly concave, with a flat top
  {
    const sq = (h: number, z: number): V3[] => [[-h, TY - h, z], [h, TY - h, z], [h, TY + h, z], [-h, TY + h, z]]
    const rings = [sq(2.9, 33.2), sq(1.95, 35.0), sq(0.85, 37.6)]
    for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, A = rings[k], B = rings[k + 1]
      const mx = (A[i][0] + A[j][0]) / 2, my = (A[i][1] + A[j][1]) / 2 - TY
      const run = Math.abs(A[i][0]) - Math.abs(B[i][0]), rise = B[0][2] - A[0][2]
      const l = Math.hypot(mx, my) || 1
      face(s.sand, [A[i], A[j], B[j], B[i]], [(mx / l) * rise, (my / l) * rise, run])
    }
    box(s.sand, [0, TY], 1.0, 1.0, 37.6, 37.95, 0, { bottom: true })
    // railing and flagpole
    if (d) {
      for (let i = 0; i < 4; i++) {
        const q = sq(0.9, 38.8)
        bar(s.roof, q[i], q[(i + 1) % 4], 0.06, 0.06)
        for (let k = 0; k <= 4; k++) {
          const p: V3 = [q[i][0] + (q[(i + 1) % 4][0] - q[i][0]) * k / 4, q[i][1] + (q[(i + 1) % 4][1] - q[i][1]) * k / 4, 37.95]
          bar(s.roof, p, [p[0], p[1], 38.8], 0.05, 0.05)
        }
      }
    }
    lathe(s.white, [0, TY], [[0.12, 37.95], [0.07, 42.5], [0, 42.5]], d ? 8 : 5)
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

const lit = (k: number) => (p: V3, n: V3) => (n[2] > 0.6 ? 0.25 * k : k * (p[2] > 22 ? 0.95 : 0.8))
const SAND: MaterialSpec = { ...finish('ochre-sandstone', 0xdcb46e), floodlight: lit(1) }
const BRICK: MaterialSpec = { ...finish('red-brick', 0xa65a46), floodlight: lit(0.45) }
const WIN: MaterialSpec = PALETTE.window
const ROOF: MaterialSpec = finish('red-roof', 0x8f5446)
const WHITE: MaterialSpec = { ...PALETTE.trim, color: 0xf6f1e6 }
const layers = (s: Set): Layer[] => [
  { part: s.sand, material: SAND },
  { part: s.brick, material: BRICK },
  { part: s.win, material: WIN },
  { part: s.roof, material: ROOF },
  { part: s.white, material: WHITE },
]

if (import.meta.main) {
  await saveLods('auckland-ferry-building', 'Ferry Building', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; turned to bearing 17.9; origin at the outline centroid on Quay Street',
    bearing: 17.9, height: 42.5,
  }, 6500)
}
