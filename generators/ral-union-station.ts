/**
 * Raleigh Union Station (2018; Clearscapes with Duda/Paine; the 1950s
 * Dillon Supply viaduct warehouse rebuilt as the station hall): procedural,
 * CC0-1.0.
 * bun generators/ral-union-station.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the hall's long
 * north wall runs nearly east-west). Origin: the area centroid of OSM
 * way/607928709 (-78.647588, 35.777227). y = 0 is the lowest ground under
 * the drawn building; Mapterhorn (z13) varies about 1 m under it, and
 * falls to the drop-off plaza on the south-east. Elevation 0.
 *
 * OSM: way/607928709 (building=train_station, Q7886096) is one outline:
 * the hall (x -30..57, y -5..26), the west pavilion (x -62..-30), and a
 * long 5 m strip running 75 m south-east beside the drop-off loop. NAIP
 * shows that strip as the planted retaining wall and path along the
 * loop (p1's foreground), not a roof, so it isn't drawn; it stays in
 * `replaces` because it is part of the same way. The GoTriangle bus
 * facility (node/13659913892) is separate and out.
 * USGS NAIP (public domain, 0.28 m/px): a long white roof with a raised
 * monitor down the middle of the hall (the warehouse's), a glazed band at
 * x -41..-30 between the hall and the west pavilion: the clear-glass
 * entrance hall of p1 and p3, drawn as blue glass over the lower level.
 *
 * No lidar covers Wake County. Heights are estimated from p2 and p4 (cars
 * and the 1.1 m railing for scale): a recessed glazed lower level to
 * 3.6 m under a walkway railing, two storeys of glass behind dense white
 * fins (about 1.6 m apart, p1, p4) to 12.5 m, the monitor to 15 m; the
 * clear-glass entrance pavilion to 15 m under a thin white overhanging roof
 * (p1: it stands above the finned hall); the cantilevered glass box two
 * storeys, 8.2–14.6 m, on a 1.4 m dark soffit (p2).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-union-station/p2):
 *  p1 "Raleigh Union Station Grand Opening 02.jpg", NCDOTcommunications,
 *     CC BY 2.0, https://commons.wikimedia.org/wiki/File:Raleigh_Union_Station_Grand_Opening_02.jpg:
 *     the entrance front with its lettering, white fins, the retaining
 *     wall.
 *  p2 "2018.05.02 Union Station Tour 05.jpg", NCDOTcommunications, CC BY
 *     2.0, https://commons.wikimedia.org/wiki/File:2018.05.02_Union_Station_Tour_05.jpg:
 *     the long channel-glass front and the cantilevered glass box.
 *  p3 "2018.05.02 Union Station Tour 01.jpg", NCDOTcommunications, CC BY
 *     2.0, https://commons.wikimedia.org/wiki/File:2018.05.02_Union_Station_Tour_01.jpg:
 *     the lettering and glazing close up.
 *  p4 "Raleigh Union Station 10-17.jpg", Sjones26573, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Raleigh_Union_Station_10-17.jpg:
 *     from across the tracks during construction: the long finned front.
 *  p5 "Raleigh Union Station Grand Opening 06.jpg", NCDOTcommunications,
 *     CC BY 2.0: the hall inside (crane rails, the glazed bridge).
 * Look-only: "Raleigh Union Station (13453309663).jpg" is an architect's
 * rendering, not the built building; not used.
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: pale glass between the fins and in the box (p2, p3), dark glass
 * in the entrance pavilion (p1), white fins, railings and roof edges.
 * Estimated: every height; the glass box's place (p2 shows it at a corner
 * of the long front; drawn over the glazed band at the hall's south-west corner,
 * reaching 3.4 m past the entrance pavilion's south face).
 * Left out: the lettering, the flagpoles, the retaining wall and plaza,
 * the platform canopy (not in OSM's outline).
 * Doubts: no photo square to the north (Martin Street) face or of the west
 * pavilion's track side; the glass box's corner is a judgement.
 * Night: the lower level and the glass box glow; the skylight stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, prism, capRing, ccw, extrudeShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const LOW = 3.6, TOP = 12.5, MON = 15
const HALL: XY[] = [[-30, -1.3], [35.1, -3.5], [35.0, -6.5], [45.9, -10.0], [46.1, -4.3], [56.6, -4.9], [56.1, -2.0], [54.7, 7.4], [52.2, 25.4], [23.0, 26.0], [-6.6, 23.8], [-30, 20.2]]
const ATRIUM: XY[] = [[-41, -12.6], [-30, -12.6], [-30, 20.2], [-41, 17.2]]
const WEST: XY[] = [[-61.5, -7.1], [-48.6, -10.8], [-41.9, -12.8], [-41, -12.8], [-41, 17.2], [-61.2, 11.9]]

const edges = (r: XY[]) => r.map((a, i) => {
  const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { f: { o: [a[0], a[1], 0] as V3, n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] as XY } as Face, L }
})

function build() {
  const pane = new Part(), win = new Part(), steel = new Part(), roof = new Part(), glass = new Part(), blue = new Part()

  // ------------------------------------------------------------ the hall and the west pavilion: channel glass over a glazed lower level (p2, p4)
  for (const [ring, top] of [[ccw(HALL), TOP], [ccw(WEST), TOP - 1.5]] as [XY[], number][]) {
    prism(pane, roof, ring, 0, top)
    capRing(pane, ring, 0, false)
    for (const { f, L } of edges(ring)) {
      if (L < 3) continue
      panel(win, f, L / 2, L - 0.6, 0.2, LOW - 0.2, 0.06) // the glazed lower level
      panel(steel, f, L / 2, L, LOW, LOW + 1.1, 0.22) // the walkway railing
      panel(steel, f, L / 2, L, top - 0.6, top, 0.12) // the roof edge
      // the upper storeys: glass behind dense white fins, about 1.6 m apart, standing 0.5 m proud (p1, p4)
      panel(blue, f, L / 2, L - 0.4, LOW + 1.1, top - 0.6, 0.05)
      const n = Math.max(2, Math.round(L / 1.6))
      for (let k = 1; k < n; k++) {
        const sk = (L * k) / n
        extrudeShape(steel, f, [[sk - 0.22, LOW + 1.1], [sk + 0.22, LOW + 1.1], [sk + 0.22, top - 0.6], [sk - 0.22, top - 0.6]], 0.05, 0.55)
      }
      panel(steel, f, L / 2, L, 8.0, 8.4, 0.3) // the floor line
    }
  }
  // the warehouse's monitor roof down the hall (NAIP)
  {
    const r: XY[] = [[-26, 9], [50, 9], [50, 15], [-26, 15]]
    prism(pane, roof, r, TOP - 0.01, MON)
    for (const { f, L } of edges(r)) if (L > 10) panel(blue, f, L / 2, L - 2, TOP + 0.4, MON - 0.5, 0.05)
  }
  // ------------------------------------------------------------ the glazed band between hall and pavilion: glass roof (NAIP)
  {
    // the tall clear-glass entrance pavilion (p1, p3): taller than the hall, one sheer glass wall
    // under a thin white roof that overhangs it
    const ET = TOP + 2.5
    const r = ccw(ATRIUM)
    prism(win, null, r, 0, ET)
    capRing(glass, r, ET, true)
    capRing(win, r, 0, false)
    box(steel, -42.6, -14.4, -28.8, 21.6, ET, ET + 0.7, steel)
    for (const { f, L } of edges(r)) {
      panel(steel, f, L / 2, L, LOW, LOW + 0.5, 0.1)
      panel(steel, f, L / 2, L, 8.6, 8.9, 0.1)
      const n = Math.round(L / 2.6)
      for (let k = 1; k < n; k++) panel(steel, f, (L * k) / n, 0.18, LOW, ET, 0.08)
    }
  }
  // ------------------------------------------------------------ the cantilevered glass box (p2)
  {
    // two storeys of clear glass on a deep dark soffit, reaching 3.4 m past the entrance pavilion
    const x0 = -38, x1 = -14, y0 = -16, y1 = 2, z0 = 8.2, z1 = 14.6
    box(blue, x0, y0, x1, y1, z0, z1, roof)
    box(win, x0 - 0.25, y0 - 0.25, x1 + 0.25, y1, z0 - 1.4, z0, win) // the dark soffit (p2)
    box(steel, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1, z1, z1 + 0.45, roof)
    // thin mullions and a transom on its faces
    for (const [f, L] of [[{ o: [x0, y0, 0], n: [0, -1] }, x1 - x0], [{ o: [x0, y1, 0], n: [-1, 0] }, y1 - y0], [{ o: [x1, y0, 0], n: [1, 0] }, y1 - y0]] as [Face, number][]) {
      const n = Math.round(L / 2.4)
      for (let k = 1; k < n; k++) panel(steel, f, (L * k) / n, 0.16, z0, z1, 0.05)
      panel(steel, f, L / 2, L, z0 + 3.1, z0 + 3.35, 0.05)
    }
  }

  return finishGlb('Raleigh Union Station', [
    { part: pane, material: finish('rus-channel-glass', 0xdde5e8) },
    { part: win, material: PALETTE.window },
    { part: blue, material: windowVariant(2, 0x8db1c6) },
    { part: steel, material: finish('rus-white-steel', 0xeef0f0) },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 0, height: TOP + 3.2, replaces: ['way/607928709'] })
}

if (import.meta.main) await writeModel('ral-union-station', build())
