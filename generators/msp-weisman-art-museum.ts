/**
 * Weisman Art Museum, University of Minnesota (Frank Gehry, 1993; Gehry
 * expansion 2011): procedural, CC0-1.0.
 * bun generators/msp-weisman-art-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * north-south and east-west). Origin at the area centroid of OSM
 * way/35091113 (-93.237055, 44.973095). y = 0 is the river-road ground at
 * the foot of the west front (lidar 242.6 m), the lowest ground the
 * footprint touches; the east side stands on the campus plaza about 7.4 m
 * higher, so the brick walls there sink into the bluff.
 *
 * Form: a plain orange-red brick box on the bluff above the Mississippi,
 * with its west face (to the river and the Washington Avenue Bridge) a
 * cascade of brushed stainless-steel volumes: a tall stack of leaning boxes
 * in the middle (the highest point), a box tower and a cantilevered box at
 * the south-west corner, two drums and a tall curved wall to the north, the
 * radial steel "fan" arch over the north terrace, and a grey concrete base
 * with the museum garage's entrance under the north half. Each steel volume
 * is a bold bevelled box, leaning box or drum; the creases and the folded
 * panels between them are left out.
 *
 * Sources
 * - OSM (ODbL): way/35091113 "Weisman Art Museum" (building=yes), the only
 *   building the model covers. way/293095993 (amenity=parking, "Weisman Art
 *   Museum Garage") lies under the museum and the north terrace; it is not a
 *   building and is not listed. way/287798023 (building=roof, the
 *   Washington Avenue Bridge's walkway roof) starts 13 m north of the
 *   outline and is not touched. The Cube (way/46702671) and Bruininks Hall
 *   are separate.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 1 m grid, heights
 *   above the west ground: the brick roofs 21.4 (east) and 23.6-24.2 (west
 *   half), rooftop boxes 25-27.5; the steel stack 31.5-33.5; the
 *   south-west tower 24.6, its base block 19.6; the middle steel 26.5-27.5;
 *   the drums 20.5 and 24.6; the north curved wall 28; the north terrace
 *   13.6 (over the garage); the east ground 7.4.
 * - USGS NAIP (public domain): plan, grey roofs, the steel glinting on the
 *   west edge.
 * - Photos (Wikimedia Commons, evidence):
 *   "Weisman Art Museum.jpg", public domain (from the Washington Avenue
 *   Bridge, north-west: the whole west front, the garage base, the fan);
 *   McGhiever, "Weisman Art Museum 2015.jpg", CC BY-SA 4.0 (same view);
 *   dwhartwig, "Weisman Art Museum - building exterior - 14.jpg", "- 04.jpg",
 *   "- 20.jpg", "- 29.jpg", CC BY 2.0 (north-west; the south-west corner with
 *   the brick south wall and the cantilevered steel box; the fan and drums
 *   from the north terrace; the entrance);
 *   Bmzuckerman, "Frank Gehry - Minneapolis, MN - Weisman Art Museum (K).jpg"
 *   and "(D).jpg", CC BY 4.0 (from the west and north-west).
 * - Published: Frank Gehry, opened 1993, expanded 2011 (Wikipedia, "Weisman
 *   Art Museum").
 * Measured (lidar): every height above and the extent of the steel zone
 *   (x -41 to -21).
 * Estimated from the photos: how the steel zone divides into volumes, each
 *   volume's lean and taper, the concrete base (to 6.5 m), the garage
 *   doorway, the fan arch (radius 7 m, five spokes), the windows (a few
 *   tall dark slots, not placed one by one).
 * Doubts: the steel collage is a simplification: Gehry's folded panels and
 *   creases are drawn as about a dozen clean volumes; the north terrace
 *   (13.6 m, over the garage) is drawn as a plain block where OSM's outline
 *   reaches over it; the east and south brick walls have no windows in the
 *   photos and are kept plain.
 * Night: the steel west front is floodlit (`floodlight`); windows are
 *   `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, ccw, prism, rect, arc, chamfer, flatShape, lathe, finishGlb, writeModel, triangulate } from './sea-tacoma-union-station'

// OSM way/35091113 east of the steel zone (x > -28.3), metres about its centroid
const BODY: XY[] = [
  [-28.3, -16.7], [-18.8, -17.6], [-18.2, -15.6], [-14.1, -15.9], [-14.1, -20.7], [-7.9, -20.6], [-8.2, -15.9], [17.3, -15.4],
  [12.0, -19.0], [18.0, -26.3], [18.9, -27.4], [26.8, -21.5], [28.8, -25.3], [36.6, -20.9], [33.4, -14.7], [38.1, -17.5],
  [43.8, -9.4], [33.2, -2.1], [37.0, -2.1], [37.1, 8.2], [26.7, 8.1], [27.0, 15.8], [25.8, 15.9], [26.0, 17.8], [17.2, 18.2],
  [18.1, 24.3], [10.8, 25.7], [4.8, 25.8], [4.8, 26.6], [-6.8, 24.9], [-6.6, 23.3], [-6.2, 18.0], [-8.7, 18.0], [-8.6, 15.7],
  [-28.3, 15.7],
]

/** A box with a different ring at the top: tapers and leans. Rings convex, same corner order. */
function tblock(wall: Part, top: Part | null, bot: XY[], up: XY[], z0: number, z1: number, under = false) {
  const b = ccw(bot), t = ccw(up)
  const B: V3[] = b.map(([x, y]) => [x, y, z0]), T: V3[] = t.map(([x, y]) => [x, y, z1])
  wall.loft([B, T])
  if (top) top.cap(T, true)
  if (under) wall.cap(B, false)
}
const shift = (r: XY[], dx: number, dy: number): XY[] => r.map(([x, y]) => [x + dx, y + dy])

export function build() {
  const steel = new Part(), brick = new Part(), roof = new Part(), win = new Part(), conc = new Part()

  // ---- the brick body, roofs in two heights
  prism(brick, null, chamfer(ccw(BODY), 0.4), 0, 21.4)
  {
    // roof cap of the concave outline
    const r = ccw(chamfer(ccw(BODY), 0.4))
    for (const [a, b, c] of triangulate(r)) roof.tri([r[a][0], r[a][1], 21.4], [r[b][0], r[b][1], 21.4], [r[c][0], r[c][1], 21.4])
  }
  prism(brick, roof, chamfer(rect(-28.3, -15.6, -12, 15.7), 0.4), 21.4, 23.8)
  prism(brick, roof, chamfer(rect(-6.6, 15.5, 17, 24.5), 0.4), 21.4, 24.2)
  // rooftop boxes and lanterns (lidar 25-27.5), grey
  for (const [x0, y0, x1, y1, z] of [[-10, -13, -4, -7, 25.4], [8, -13, 14, -7, 25.3], [6, 0, 10, 8, 26.4], [31, -15, 36, -9, 27.2], [-9, 5, -1, 11, 24.4]] as number[][])
    prism(roof, roof, chamfer(rect(x0, y0, x1, y1), 0.3), 21.4, z)

  // ---- the north terrace over the garage: concrete, a steel fascia on its west and north faces
  prism(conc, conc, chamfer(rect(-29.4, 15.7, -6.6, 21.6), 0.3), 0, 13.6)
  // the west block's north wall above the terrace is steel-clad
  flatShape(steel, { o: [-20, 15.7, 0], n: [0, 1] }, rect(-8.2, 13.6, 8.2, 23.8), 0.1)
  // the steel fascia over the garage: a wide plate leaning out over the drive
  // (it runs on along the terrace's edge to y 29, past the outline, as lidar shows the terrace)
  tblock(steel, steel, chamfer(rect(-30.2, 13.5, -29.2, 29), 0.2), chamfer(rect(-32.2, 13.5, -31.2, 29.6), 0.2), 6.8, 13.9, true)
  flatShape(steel, { o: [-18, 21.65, 0], n: [0, 1] }, rect(-11.2, 7.4, 11.2, 13.6), 0.08)
  flatShape(win, { o: [-29.45, 18.6, 0], n: [-1, 0] }, rect(-2.4, 0, 1.6, 4.6), 0.05) // the garage doorway
  // the museum entrance off the terrace: a glass front under a steel hood
  flatShape(win, { o: [-20, 15.7, 0], n: [0, 1] }, rect(-4, 13.6, 4, 17.6), 0.25)
  tblock(steel, steel, rect(-25, 15.2, -15, 17.6), rect(-25.5, 15.2, -14.5, 19.2), 17.6, 18.6, true)

  // ---- the concrete base of the west front's north half
  prism(conc, null, chamfer(rect(-38.5, 2, -28.3, 15.7), 0.3), 0, 6.5)

  // ---- the steel collage (west front), south to north
  const S = (x0: number, y0: number, x1: number, y1: number, c = 0.5) => chamfer(rect(x0, y0, x1, y1), c)
  // south-west corner: base block, box tower with a sloped top, the box cantilevered over the brick south wall
  // its west face rounds out like a drum toward the river
  prism(steel, steel, [[-31, -21.2], [-31, -14], ...arc(-33.5, -17.6, 7.4, 150, 220, 5)], 0, 19.6)
  tblock(steel, steel, S(-38.5, -18, -30, -11), S(-38.8, -18.6, -30.3, -11.4), 0, 24.6)
  tblock(steel, steel, S(-30, -21.8, -17, -16.2), S(-30, -22.6, -16.4, -16.2), 12, 19, true)
  // middle tier
  // its west face bulges out as a curved wall (the big drum-like front seen from the bridge)
  const bulge: XY[] = [[-27, -14.2], [-27, -5.8], ...arc(-30.5, -10, 8.6, 150, 210, 6)]
  prism(steel, steel, bulge, 0, 27.2)
  tblock(steel, steel, S(-32, -12.5, -26, -7), shift(S(-32, -12.5, -26, -7), -0.8, 0), 22, 28.4)
  // the tall stack: a box to 31.5 and a leaning box rising to the highest point
  prism(steel, steel, S(-38, -6, -30.5, 6.5), 0, 31.4)
  tblock(steel, steel, S(-36.4, -3, -31.6, 3), shift(S(-36, -2.6, -32, 2.6), -1.2, 0.6), 24, 33.6)
  // leaning, down-tapering slabs hung on the front (the wedges over the base)
  tblock(steel, steel, S(-40.6, -9, -37.4, -3.4, 0.3), S(-41.4, -10.4, -37.4, -2, 0.3), 6, 23)
  tblock(steel, steel, S(-40.2, 1.2, -37.8, 6, 0.3), S(-41.2, -0.2, -37.8, 7.4, 0.3), 8.5, 21)
  // the drums to the north, and the tall curved wall behind them
  lathe(steel, -34.4, 10.2, [[3.9, 6.5], [3.9, 20.6], [0, 20.6]], 14)
  lathe(steel, -30.6, 12.6, [[3.4, 6.5], [3.6, 24.8], [0, 24.8]], 14)
  lathe(steel, -24.5, 12.4, [[5.6, 13.6], [5.6, 28.2], [0, 28.2]], 14, 90, 270)
  prism(steel, steel, S(-24.5, 6.8, -20, 18), 13.6, 28.2)
  // the radial steel fan over the north terrace (in the y-z plane)
  {
    const cx = -27, cy = 18.6, zc = 13.6, R0 = 6.2, R1 = 7.2, w = 0.45
    const ring = (r: number, a: number, dx: number): V3 => [cx + dx, cy + r * Math.cos(a), zc + r * Math.sin(a)]
    const n = 10, a0 = 0, a1 = Math.PI * 0.95
    const sec = (a: number): V3[] => [ring(R0, a, -w), ring(R1, a, -w), ring(R1, a, w), ring(R0, a, w)]
    steel.sweep(Array.from({ length: n + 1 }, (_, k) => sec(a0 + ((a1 - a0) * k) / n)))
    for (const a of [0.3, 0.75, 1.2, 1.65, 2.1]) {
      const s = (r: number): V3[] => [ring(r, a - 0.05, -0.3), ring(r, a + 0.05, -0.3), ring(r, a + 0.05, 0.3), ring(r, a - 0.05, 0.3)]
      steel.sweep([s(0.6), s(R0)])
    }
  }

  // ---- windows on the steel: tall dark slots
  const W = (f: Face, s: number, z0: number, z1: number, w = 1.6) => flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z1), 0.06)
  const west = (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] })
  W(west(-38), -1.5, 19, 24, 2.2)
  W(west(-38), 3.5, 12, 17.5, 1.4)
  W(west(-37.5), 10, 18, 22.5, 1.4)
  W(west(-37.5), -11, 16, 21, 1.4)
  W(west(-38.5), 14.5, 13, 19, 1.4)
  W({ o: [-34.4, 6.3, 0], n: [0, -1] }, 0, 9, 13, 2.6)
  W({ o: [-34.4, 10.2 + 3.95, 0], n: [0, 1] }, 0, 12, 16, 2.4)
  W(west(-40.55), -17.6, 10, 15, 1.4)
  W({ o: [-34, -21.25, 0], n: [0, -1] }, 0, 9, 15, 1.4)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[0] < -26 && n[0] < 0.3 ? 0.7 : 0)
  return finishGlb('msp-weisman-art-museum', [
    { part: steel, material: { ...finish('weisman-steel', 0xcdd4da, 0.2), floodlight: lit } as Swatch },
    { part: brick, material: finish('weisman-brick', 0xc27159) },
    { part: conc, material: finish('weisman-concrete', 0xc9c5bd) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ], { name: 'Weisman Art Museum' }, 5000)
}

if (import.meta.main) await writeModel('msp-weisman-art-museum', build())
