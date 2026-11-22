/**
 * St. Francis de Sales Church, Madison Road and Woodburn Avenue, East
 * Walnut Hills, Cincinnati (1880-89, Gothic Revival) — original
 * procedural geometry, CC0-1.0.
 * bun generators/cin-st-francis-de-sales.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 4.6, the church's own axis: the front faces
 * Madison Road at -y (south), the apse is at +y.
 * Anchor = centroid of OSM way/69701756, -84.476383, 39.130010.
 *
 * Identity (from the photos below):
 *  1. The tall single tower on the south-west corner of the front:
 *     grey rock-faced limestone with buff sandstone angle buttresses, a
 *     tall belfry lancet, gabled clock faces on all four sides with
 *     corner pinnacles, and a tall green copper octagonal spire.
 *  2. The front gable beside it: a deep pointed portal under a gablet,
 *     a big rose window and a steep gable with a cross; a short square
 *     corner tower with a green pyramid roof on the other side.
 *  3. A long steep slate roof over tall traceried lancets between buff
 *     buttresses, a cross gable mid-way and a polygonal apse.
 *
 * Plan: OSM way/69701756 read in this frame: nave x -16.1..6.2,
 * y -23.2..17.3; tower x -17.8..-10, y -31.7..-23.2; front gable
 * x -10..-1.3 to y -31.7; corner tower x -1.3..6, y -30.2..-23.2; apse
 * to y 23.4; a low porch on the west side (x -18.7..-16.1, y 1.3..12.5);
 * the outline also takes in the attached parish building to the east
 * (x 6.2..29.7, y 11.4..28.8), drawn as a plain block.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown 2021), 0.5 m grid sampled at 2 m in this frame; y = 0 is the
 * west street (lidar ground_min + 0.8). Measured: nave eaves about 14.8,
 * ridge 29.8, the cross gable's ridge the same; corner tower about 23.5,
 * its pyramid 26.8; tower masonry and clock gables 43-46, pinnacles
 * about 47; spire top 72 (max return, cross included); parish building
 * 11-13. Estimated from the photos: the tower's stages, openings, the
 * rose window, buttresses, the spire's base width, the apse roof.
 *
 * Ground: the lidar and Mapterhorn are within about 2 m; elevation 0.
 *
 * Night: the windows and rose glow; the clock faces are lit (window-2).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - StFrancisDeSales.jpg, Greg Hume, CC BY 3.0 (the front and tower
 *    from the south-west)
 *    https://commons.wikimedia.org/wiki/File:StFrancisDeSales.jpg
 *  - St. Francis De Sales Catholic Church, East Walnut Hills, Cincinnati,
 *    OH (47126904252).jpg, Warren LeMay, CC0 (front and east side)
 *    https://commons.wikimedia.org/wiki/File:St._Francis_De_Sales_Catholic_Church,_East_Walnut_Hills,_Cincinnati,_OH_(47126904252).jpg
 *  - St. Francis De Sales Church, East Walnut Hills, Cincinnati, OH
 *    (40412904473).jpg, Warren LeMay, CC0 (the apse from the north)
 *    https://commons.wikimedia.org/wiki/File:St._Francis_De_Sales_Church,_East_Walnut_Hills,_Cincinnati,_OH_(40412904473).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the west side is not photographed close; it mirrors the east.
 * Roof dormers are left out. The parish building is plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, cornice, gableRoof, hipRoof, onWall, rectShape, revolve, save, wall, type XY } from './atl-tech-tower'
import type { Face } from './cin-city-hall'
import { lancet } from './cin-old-st-marys'

const circ = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

if (import.meta.main) {
  const rock = new Part(), dress = new Part(), win = new Part(), slate = new Part(), cu = new Part(), clock = new Part()

  const L = (f: Face) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  function slab(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
    const l = L(f), t: XY = [(f[1][0] - f[0][0]) / l, (f[1][1] - f[0][1]) / l], nn: XY = [t[1], -t[0]]
    const P = (s: number, o: number): XY => [f[0][0] + t[0] * s + nn[0] * o, f[0][1] + t[1] * s + nn[1] * o]
    const a = P(s0, -0.05), b = P(s1, d)
    box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, p, 0.1)
  }
  /** A traceried lancet: buff surround, slate panel, a mullion. */
  function lanc(f: Face, s: number, w: number, z0: number, zs: number, mull = true) {
    onWall(dress, f[0], f[1], lancet(s, w + 0.6, z0 - 0.3, zs), 0.05)
    onWall(win, f[0], f[1], lancet(s, w, z0, zs), 0.09)
    if (mull) onWall(dress, f[0], f[1], rectShape(s - 0.08, s + 0.08, z0, zs + w * 0.55), 0.12)
  }

  const NX0 = -16.1, NX1 = 6.2, NY0 = -23.2, NY1 = 17.3, EAVE = 14.8, RIDGE = 29.8
  const FY = -31.7

  // ── nave, front gable bay and cross gable ──
  box(rock, NX0, NX1, NY0, NY1, 0, EAVE, null, 0)
  gableRoof(slate, rock, NX0, NX1, NY0 + 0.5, NY1, EAVE, RIDGE, 'y', 0.4, 0.2)
  box(rock, -10, -1.3, FY, NY0 + 0.6, 0, EAVE, null, 0)
  gableRoof(slate, rock, -10, -1.3, FY, NY0 + 1, EAVE + 6.5, RIDGE, 'y', 0.2, 0.2)
  // the front bay's walls between the eaves and its own gable
  box(rock, -10, -1.3, FY, NY0 + 1, EAVE, EAVE + 6.5, null, 0)
  gableRoof(slate, rock, NX0, NX1, 2, 10, EAVE, RIDGE, 'x', 0.3, 0.2)
  // low porch on the west side
  box(rock, -18.7, NX0 + 0.1, 1.3, 12.5, 0, 6.5, null, 0)
  gableRoof(slate, rock, -18.7, NX0 + 0.1, 1.3, 12.5, 6.5, 8.0, 'y', 0.2, 0.2)

  // ── apse ──
  {
    const ap: XY[] = [[0.7, NY1 - 0.3], [-0.2, 20.6], [-3.1, 23.4], [-7.1, 23.4], [-10.5, 20.9], [-11.8, NY1 - 0.3]]
    wall(rock, ap, 0, EAVE)
    const apex: V3 = [-5.5, 18.0, 25.0]
    for (let i = 0; i < ap.length - 1; i++) slate.tri([ap[i][0], ap[i][1], EAVE], [ap[i + 1][0], ap[i + 1][1], EAVE], apex)
    for (let i = 0; i < ap.length - 1; i++) {
      const f: Face = [ap[i], ap[i + 1]]
      if (L(f) > 3) lanc(f, L(f) / 2, 1.4, 5.0, 11.0)
    }
  }

  // ── sides: bays of tall lancets between buff buttresses ──
  {
    const fE: Face = [[NX1, NY0], [NX1, NY1]], fW: Face = [[NX0, NY1], [NX0, NY0]]
    for (const [f, skip] of [[fE, [25.2, 33.2]], [fW, [6.8, 14.8]]] as [Face, number[]][]) {
      const n = 7, w = L(f) / n
      for (let k = 0; k <= n; k++) slab(dress, f, k * w - 0.45, k * w + 0.45, 0, EAVE - 1.5, 0.6)
      for (let k = 0; k < n; k++) {
        const s = w * (k + 0.5)
        if (s > skip[0] && s < skip[1]) continue
        lanc(f, s, 1.7, 6.5, 11.6)
        onWall(win, f[0], f[1], lancet(s, 0.9, 2.2, 4.0), 0.06)
      }
    }
    // cross gable ends: a big traceried lancet in each
    const gE: Face = [[NX1, 2], [NX1, 10]], gW: Face = [[NX0, 10], [NX0, 2]]
    for (const f of [gE, gW]) { lanc(f, 4, 3.0, 7.0, 17.5); onWall(dress, f[0], f[1], rectShape(2.9, 5.1, 13.0, 13.2), 0.13) }
  }

  // ── front gable bay ──
  {
    const f: Face = [[-10, FY], [-1.3, FY]], m = 4.35
    for (const s of [0, 8.7]) slab(dress, f, s - 0.6, s + 0.6, 0, EAVE + 5, 0.7)
    // deep portal: buff pointed arch, oak doors, a gablet over it
    onWall(dress, f[0], f[1], lancet(m, 4.6, 1.2, 4.6), 0.08)
    onWall(win, f[0], f[1], lancet(m, 3.2, 4.6, 4.8), 0.13)
    onWall(clock, f[0], f[1], rectShape(m - 1.6, m + 1.6, 1.2, 4.6), 0.12)
    onWall(dress, f[0], f[1], [[m - 2.8, 8.6], [m + 2.8, 8.6], [m, 12.0]], 0.08)
    // rose window
    onWall(dress, f[0], f[1], circ(m, 15.5, 3.0, 20), 0.06)
    onWall(win, f[0], f[1], circ(m, 15.5, 2.4, 20), 0.1)
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI
      onWall(dress, f[0], f[1], [[m + 2.4 * Math.cos(a) - 0.1 * Math.sin(a), 15.5 + 2.4 * Math.sin(a) + 0.1 * Math.cos(a)], [m - 2.4 * Math.cos(a) - 0.1 * Math.sin(a), 15.5 - 2.4 * Math.sin(a) + 0.1 * Math.cos(a)], [m - 2.4 * Math.cos(a) + 0.1 * Math.sin(a), 15.5 - 2.4 * Math.sin(a) - 0.1 * Math.cos(a)], [m + 2.4 * Math.cos(a) + 0.1 * Math.sin(a), 15.5 + 2.4 * Math.sin(a) - 0.1 * Math.cos(a)]], 0.13)
    }
    onWall(win, f[0], f[1], lancet(m, 1.0, 22.5, 24.5), 0.06)
    // gable cross
    box(dress, -5.75, -5.55, FY - 0.1, FY + 0.1, RIDGE, RIDGE + 2.0, dress, 0)
    box(dress, -6.3, -5.0, FY - 0.1, FY + 0.1, RIDGE + 1.1, RIDGE + 1.4, dress, 0)
  }

  // ── short corner tower (south-east) with a copper pyramid ──
  {
    const x0 = -1.3, x1 = 6.2, y0 = -30.2, y1 = NY0 + 0.5, top = 23.5
    box(rock, x0, x1, y0, y1, 0, top, null, 0)
    cornice(dress, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], top - 0.8, 0.8, 0.4, null)
    hipRoof(cu, x0 - 0.4, x1 + 0.4, y0 - 0.4, y1 + 0.4, top, 26.8, 0)
    const fS: Face = [[x0, y0], [x1, y0]], fE: Face = [[x1, y0], [x1, y1]]
    for (const f of [fS, fE]) {
      for (const s of [0.45, L(f) - 0.45]) slab(dress, f, s - 0.45, s + 0.45, 0, top - 0.8, 0.5)
      for (const d of [-0.9, 0.9]) onWall(win, f[0], f[1], lancet(L(f) / 2 + d, 0.8, 19.0, 21.3), 0.06)
      lanc(f, L(f) / 2, 1.3, 8.5, 13.5, false)
    }
    onWall(dress, fS[0], fS[1], lancet(3.75, 2.6, 1.2, 3.8), 0.08)
    onWall(clock, fS[0], fS[1], rectShape(2.85, 4.65, 1.2, 3.8), 0.12)
  }

  // ── the great tower (south-west) ──
  {
    const x0 = -17.8, x1 = -10, y0 = FY, y1 = -23.4, TOP = 40.5
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, C: XY = [cx, cy]
    box(rock, x0, x1, y0, y1, 0, TOP, null, 0)
    const tf: Face[] = [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
    for (const f of tf) {
      const l = L(f), m = l / 2
      // angle buttresses stepping in at the stages
      for (const s of [0.9, l - 0.9]) {
        slab(dress, f, s - 0.35, s + 0.35, 0, 18, 0.6)
        slab(dress, f, s - 0.32, s + 0.32, 18, 30, 0.45)
        slab(dress, f, s - 0.3, s + 0.3, 30, TOP, 0.3)
      }
      // string courses
      for (const z of [18, 30]) slab(dress, f, 1.1, l - 1.1, z - 0.35, z, 0.25)
      // lower lancet, a blind arcade, the tall belfry lancet
      lanc(f, m, 1.3, 9.5, 14.5)
      for (const d of [-1.4, 0, 1.4]) onWall(win, f[0], f[1], lancet(m + d, 0.7, 24.0, 26.4), 0.06)
      lanc(f, m, 2.2, 31.0, 37.4)
      // the clock gable on each face
      onWall(dress, f[0], f[1], circ(m, TOP + 1.8, 1.45, 16), 0.06)
      onWall(clock, f[0], f[1], circ(m, TOP + 1.8, 1.15, 16), 0.1)
    }
    // the clock gables, crossed over the tower top
    gableRoof(slate, rock, cx - 3.0, cx + 3.0, y0, y1, TOP, TOP + 5.6, 'y', 0.15, 0.15)
    gableRoof(slate, rock, x0, x1, cy - 3.0, cy + 3.0, TOP, TOP + 5.6, 'x', 0.15, 0.15)
    // corner pinnacles
    for (const px of [x0 + 0.5, x1 - 0.5]) for (const py of [y0 + 0.5, y1 - 0.5]) {
      revolve(dress, [px, py], [[0.6, TOP - 1], [0.6, TOP + 2.2], [0, 47.2]], 6, 0, true, false)
    }
    // octagonal copper spire, cross
    revolve(cu, C, [[2.8, TOP + 1.5], [2.8, TOP + 3.0], [0, 70.0]], 8, Math.PI / 8, true, false)
    box(dress, cx - 0.15, cx + 0.15, cy - 0.15, cy + 0.15, 69.5, 72.4, dress, 0)
    box(dress, cx - 0.8, cx + 0.8, cy - 0.15, cy + 0.15, 71.0, 71.35, dress, 0)
    // tower door
    const f = tf[0]
    onWall(dress, f[0], f[1], lancet(3.9, 2.4, 1.2, 3.6), 0.08)
    onWall(clock, f[0], f[1], rectShape(3.05, 4.75, 1.2, 3.6), 0.12)
  }

  // ── attached parish building (east) ──
  box(rock, NX1 - 0.2, 29.7, 11.4, 26.4, 0, 11.3, null, 0)
  hipRoof(slate, NX1 - 0.4, 29.9, 11.2, 26.6, 11.3, 13.7, 0.3)
  {
    const fS: Face = [[NX1, 11.4], [29.7, 11.4]], fE: Face = [[29.7, 11.4], [29.7, 26.4]], fN: Face = [[29.7, 26.4], [NX1 - 0.2, 26.4]]
    for (const f of [fS, fE, fN]) {
      const n = Math.round(L(f) / 3.6), w = L(f) / n
      for (let k = 0; k < n; k++) for (const z of [1.5, 5.2, 8.6]) onWall(win, f[0], f[1], rectShape(w * (k + 0.5) - 0.6, w * (k + 0.5) + 0.6, z, z + 2.0), 0.06)
    }
  }

  await save('cin-st-francis-de-sales', 'St. Francis de Sales Church', [
    { part: rock, material: finish('sfds-limestone', 0xb3ad9f) },
    { part: dress, material: finish('sfds-sandstone', 0xd9cba6) },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('sfds-slate', 0x878d94) },
    { part: cu, material: PALETTE.copper },
    { part: clock, material: windowVariant(2, 0x5b4a3a) },
  ], { height: 72.4, anchor: [39.13001, -84.476383], bearing: 4.6 }, 6500)
}
