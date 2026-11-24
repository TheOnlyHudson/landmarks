/**
 * St. Ann's Warehouse in the Tobacco Warehouse, 45 Water Street, DUMBO
 * (Brooklyn Bridge Park): procedural, CC0-1.0.
 * bun generators/nyc-st-anns-warehouse.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 1.5° (the OSM
 * outline's long sides). The origin is the area centroid of OSM
 * way/373709849 (St. Ann's Warehouse, amenity=theatre, height=8). The site
 * is level (Mapterhorn 0.3 m across), so elevation 0.
 *
 * The building. The Tobacco Warehouse, an 1860s brick warehouse of which
 * only the two-storey outer walls survived as a roofless ruin, pierced by
 * round-arched openings. In 2015 Marvel Architects split it into two
 * interior rectangles and an exterior triangle: the rectangles hold the
 * St. Ann's Warehouse theatre (300–700 seats, ~18,000 sq ft enclosed), a
 * steel frame inside the old walls carrying a band of glass brick about
 * seven feet tall above them, cantilevered out over the wall tops; the
 * triangle, at the west end under the Brooklyn Bridge, stays an open-air
 * brick shell, the Max Family Garden (MVVA, 2016, ~8,000 sq ft).
 * (marveldesigns.com; archpaper.com "Refurbin' Renewal", Nov 2015;
 * gbaproducts.com; mvvainc.com "Max Family Garden"; Wikipedia.)
 *
 * Numbers:
 *   theatre plan 30.7 x 58.2 m: OSM way/373709849 (lidar agrees).
 *   the triangle: measured, lidar. OSM has no building for it; the lidar
 *     shows its walls: the north wall carried on west to x = -38, a short
 *     west wall there, and the long diagonal wall facing the bridge back to
 *     the theatre's south-west corner. It is drawn but not in `replaces`.
 *   walls 7.7 m: measured, lidar (USGS NY_NewYorkCity; wall tops 10.0 m,
 *     ground 2.3 m inside and 2.6 m on Water Street). That flight shows the
 *     whole warehouse still roofless, so it predates the 2015 theatre.
 *   glass-brick band 2.1 m ("about seven feet", published, archpaper.com),
 *     out 0.2 m over the wall face; roof 10.0 m: band plus a 0.2 m roof edge.
 *   openings: estimated from the photos. Theatre: wide ground-floor arches
 *     3.0 m (most of half the 4.8 m bay) springing at 2.7 m, filled with
 *     dark steel doors; upper round-headed windows 2.0 m wide, 4.6–6.8 m.
 *     Garden shell: open lower arches 2.8 m wide springing at 2.8 m, sills kept at 0.9 m because the map's terrain rises 0.7 m across the garden and
 *     upper arches 1.9 m wide, 4.6–6.6 m, as in "Tobacco Warehouse MB jeh".
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "St. Ann's Warehouse in Brooklyn", Wgreaves, CC BY-SA 4.0 (the theatre
 *     from Water Street and Dock Street, south-east: the glass band, doors)
 *   "St. Ann's Warehouse" (Chrissy Fiorentini), CC BY-SA 4.0 (the shell's
 *     arches and the bridge)
 *   "Tobacco Warehouse MB jeh", Jim.henderson, CC0 (the north wall)
 * Look-only: none. Dropped: "Tobacco Warehouse" on Commons (uploaded by
 *   R.scholz, CC BY-SA 3.0, but no author is given and it isn't marked
 *   own work), so it is not used; the shell's two tiers of arches rest on
 *   "Tobacco Warehouse MB jeh" and the lidar.
 *
 * Night: the glass-brick band is `window-2` and glows (lit from inside
 * during performances); the upper windows are `window`.
 *
 * Doubts: the split between the theatre's two rectangles inside the old
 * walls is not visible outside and is not drawn; the opening rhythm of the
 * north and east walls is estimated from the south and the garden photos;
 * the small iron star anchors on the walls are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, quadN, capPoly, unit, type XY } from './nyc-570-lexington'

const WALL = 7.7, BAND = 2.1, ROOF = WALL + BAND + 0.2, T = 0.6
// The theatre rectangle (the OSM outline) and the garden's walls, in the turned frame.
const TX0 = -15.4, TX1 = 15.35, TY0 = -29.1, TY1 = 29.1
const GARDEN: XY[] = [[TX0, TY1], [-38, TY1], [-38, 20], [TX0 - 0.3, -27.5]]

const brick = new Part(), band = new Part(), roof = new Part(), win = new Part(), door = new Part()

type Opening = { c: number; w: number; zb: number; zs: number }

/**
 * A straight wall of thickness T from a to b (its outside to the right of
 * travel), z 0..z1, with arched openings cut right through it. `fill`
 * puts a flush panel in each opening instead (a filled arch: a door or a
 * window), set 0.15 m into the outer face; null leaves it open.
 */
function wall(a: XY, b: XY, z1: number, openings: Opening[], fill: (o: Opening) => Part | null) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  /** A solid block s0..s1, z0..z2, both faces, top, bottom optional, and the ends when asked. */
  const block = (s0: number, s1: number, z0: number, z2: number, ends = false, under = false) => {
    if (s1 - s0 < 1e-6 || z2 - z0 < 1e-6) return
    brick.quad(P(s0, z0, 0), P(s1, z0, 0), P(s1, z2, 0), P(s0, z2, 0))
    brick.quad(P(s1, z0, -T), P(s0, z0, -T), P(s0, z2, -T), P(s1, z2, -T))
    if (under) brick.quad(P(s0, z0, -T), P(s1, z0, -T), P(s1, z0, 0), P(s0, z0, 0))
    if (ends) {
      brick.quad(P(s0, z0, -T), P(s0, z0, 0), P(s0, z2, 0), P(s0, z2, -T))
      brick.quad(P(s1, z0, 0), P(s1, z0, -T), P(s1, z2, -T), P(s1, z2, 0))
    }
  }
  const sorted = [...openings].sort((p, q) => p.c - q.c)
  // Columns: piers between openings run full height; each opening column is
  // solid below, open, an arched head, and solid above.
  const cols = new Map<number, Opening[]>()
  for (const o of sorted) { const k = Math.round(o.c * 100); cols.set(k, [...(cols.get(k) ?? []), o].sort((p, q) => p.zb - q.zb)) }
  let s = 0
  const SEG = 6
  for (const [, stack] of [...cols.entries()].sort((p, q) => p[0] - q[0])) {
    const w = Math.max(...stack.map((o) => o.w)), c = stack[0].c, s0 = c - w / 2, s1 = c + w / 2
    block(s, s0, 0, z1)
    let z = 0
    for (const o of stack) {
      const r = o.w / 2, o0 = c - r, o1 = c + r
      // narrower openings in a wider column: fill the sides
      block(s0, o0, z, o.zs + r); block(o1, s1, z, o.zs + r)
      block(o0, o1, z, o.zb)
      const f = fill(o)
      if (f) {
        // filled: wall face set back 0.15 m as the panel, plain rectangle + semicircle
        const d = -0.15
        f.quad(P(o0, o.zb, d), P(o1, o.zb, d), P(o1, o.zs, d), P(o0, o.zs, d))
        for (let k = 0; k < SEG; k++) {
          const t0 = Math.PI - (k / SEG) * Math.PI, t1 = Math.PI - ((k + 1) / SEG) * Math.PI
          f.tri(P(c, o.zs, d), P(c + r * Math.cos(t1), o.zs + r * Math.sin(t1), d), P(c + r * Math.cos(t0), o.zs + r * Math.sin(t0), d))
        }
        // the back of a filled opening is the inside; give it a brick back face
        brick.quad(P(o1, o.zb, -T), P(o0, o.zb, -T), P(o0, o.zs + r, -T), P(o1, o.zs + r, -T))
      }
      // reveals: jambs and the intrados, from the outer face back to the panel or through
      const back = f ? -0.15 : -T
      brick.quad(P(o0, o.zb, 0), P(o0, o.zb, back), P(o0, o.zs, back), P(o0, o.zs, 0))
      brick.quad(P(o1, o.zb, back), P(o1, o.zb, 0), P(o1, o.zs, 0), P(o1, o.zs, back))
      brick.quad(P(o0, o.zb, back), P(o0, o.zb, 0), P(o1, o.zb, 0), P(o1, o.zb, back))
      // arched head: spandrels on both faces (a semicircle cut out of a square) and the soffit
      for (let k = 0; k < SEG; k++) {
        const t0 = Math.PI - (k / SEG) * Math.PI, t1 = Math.PI - ((k + 1) / SEG) * Math.PI
        const A0: [number, number] = [c + r * Math.cos(t0), o.zs + r * Math.sin(t0)], A1: [number, number] = [c + r * Math.cos(t1), o.zs + r * Math.sin(t1)]
        const sq = (t: number): [number, number] => {
          const dx = Math.cos(t), dz = Math.sin(t), m = Math.max(Math.abs(dx), Math.abs(dz))
          return [c + (r * dx) / m, o.zs + (r * dz) / m]
        }
        const B0 = sq(t0), B1 = sq(t1)
        brick.quad(P(A0[0], A0[1], 0), P(A1[0], A1[1], 0), P(B1[0], B1[1], 0), P(B0[0], B0[1], 0))
        if (!f) brick.quad(P(A1[0], A1[1], -T), P(A0[0], A0[1], -T), P(B0[0], B0[1], -T), P(B1[0], B1[1], -T))
        const nn0 = unit([-Math.cos(t0) * u[0], -Math.cos(t0) * u[1], -Math.sin(t0)]), nn1 = unit([-Math.cos(t1) * u[0], -Math.cos(t1) * u[1], -Math.sin(t1)])
        if (!f) quadN(brick, P(A0[0], A0[1], back), P(A0[0], A0[1], 0), P(A1[0], A1[1], 0), P(A1[0], A1[1], back), [nn0, nn0, nn1, nn1])
      }
      z = o.zs + r
    }
    block(s0, s1, z, z1)
    s = s1
  }
  block(s, L, 0, z1)
  // the wall top
  brick.quad(P(0, z1, 0), P(L, z1, 0), P(L, z1, -T), P(0, z1, -T))
}

/** Openings at a regular pitch along a wall of length L, leaving `end` m solid at each end. */
function bays(L: number, pitch: number, end: number, make: (c: number, k: number) => Opening[]): Opening[] {
  const nb = Math.max(1, Math.round((L - 2 * end) / pitch)), p = (L - 2 * end) / nb
  return Array.from({ length: nb }, (_, k) => make(end + p * (k + 0.5), k)).flat()
}

// ------------------------------------------------------------ the theatre ---
// The old walls with their filled arches: wide ground-floor arches filled
// with dark steel doors and round-headed windows above, in every bay.
const theatreOpenings = (L: number) => bays(L, 4.8, 1.2, (c) => [
  { c, w: 3.0, zb: 0.15, zs: 2.7 },
  { c, w: 2.0, zb: 4.6, zs: 5.8 },
])
const doorsOrWindows = (o: Opening) => (o.zb < 1 ? door : win)
const TH: XY[] = [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]
for (let i = 0; i < 4; i++) {
  const a = TH[i], b = TH[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  wall(a, b, WALL, theatreOpenings(L), doorsOrWindows)
}
// The glass-brick band, cantilevered 0.2 m out over the wall tops, its
// soffit, and the roof with a thin edge.
{
  const O = 0.2, x0 = TX0 - O, x1 = TX1 + O, y0 = TY0 - O, y1 = TY1 + O, z0 = WALL, z1 = WALL + BAND
  const R: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = R[i], b = R[(i + 1) % 4]
    band.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    roof.quad([a[0], a[1], z1], [b[0], b[1], z1], [b[0], b[1], ROOF], [a[0], a[1], ROOF])
  }
  // soffit: the strip from the wall's outer face out to the band
  const I: XY[] = [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    band.quad([I[i][0], I[i][1], z0], [I[j][0], I[j][1], z0], [R[j][0], R[j][1], z0], [R[i][0], R[i][1], z0])
  }
  capPoly(roof, R, ROOF)
}

// ------------------------------------------------------------- the garden ---
// The roofless shell: two tiers of open arches.
const shellOpenings = (L: number) => bays(L, 4.8, 1.4, (c) => [
  { c, w: 2.8, zb: 0.9, zs: 2.8 },
  { c, w: 1.9, zb: 4.6, zs: 5.65 },
])
for (let i = 0; i < GARDEN.length - 1; i++) {
  const a = GARDEN[i], b = GARDEN[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  wall(a, b, WALL, L > 6 ? shellOpenings(L) : [], () => null)
}

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: brick, material: finish('tobacco-brick', 0xa5654f) },
  { part: band, material: windowVariant(2, 0xbcd2c6) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('tobacco-door', 0x4f5458) },
]
finishModel("St. Ann's Warehouse", 'nyc-st-anns-warehouse', parts, {
  bearing: 1.5, elevation: 0, height: ROOF, osm: 'way/373709849',
})
