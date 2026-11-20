/**
 * Denver Millennium Bridge (2002; ENTASIS Group with Ove Arup; cable-stayed pedestrian bridge
 * over the BNSF/UP main lines and the light rail at the foot of the 16th Street Mall)
 * — procedural, CC0-1.0, no textures.
 * bun generators/den-millennium-bridge.ts
 *
 * The whole structure inside the OSM man_made=bridge outline way/531040719: the broad white
 * deck over the tracks, the east stairs down to Chestnut Place / the 16th Street Mall (with
 * the landing that the side stair joins), the west stairs down to Riverfront Park, the two
 * round prow beams that run out past the deck's north-east corners (the western one with the
 * overlook on its root), the leaning white mast with its two fans of stays, the back-stays
 * to the east prow and to three cone anchors at its foot, and the two glass elevator towers. A pedestrian bridge, so the walking surface,
 * stairs included, is the model's (material `walkway`). Both ends are finished where the path
 * lands: each stair runs down to the ground at the node where OSM's steps meet the street
 * (514254014 east, 514254012 west), and the elevators stand on the ground.
 *
 * What makes it this bridge: one tall, slender white spindle mast leaning back away from
 * the span, two fans of stays from its upper half down to the deck's edges, and a wide
 * white deck with a deep rounded fascia and leaning white balustrades; the glass elevator
 * towers with dark caps at each end; the white prow beams poking out at the corners.
 *
 * Frame: x across (towards the north-east), y along the deck (towards the north-west, bearing
 * 315°, the axis of the OSM walkway way/25654365 and of the outline), z up, metres; origin at
 * the outline's centroid. z = 0 is 1579.59 m NAVD88, the lowest map terrain (Mapterhorn)
 * under the deck, by the tracks.
 *
 * Sources:
 * - OSM (API map call, 2026-11-19): outline way/531040719 (man_made=bridge, height 8.0,
 *   min_height 6, bridge:structure=suspension [it is cable-stayed], Q5259745); walkway
 *   way/25654365 (highway=pedestrian, bridge=yes, layer 1); elevator footways way/525487357
 *   and way/525487358; steps way/41751114 (east), way/798954404 (east side stair),
 *   way/708169978 (west); elevator nodes 5112020948 (east) and 13683403263 (west).
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020; the bridge is from 2002), 0.5 m grid
 *   (tools/lidar.py grid, ground_min 1579.34 m) and tools/bridge_ele.py measure on every
 *   bridge way. Measured: the walking surface 1588.76 m at node 5150257451 rising evenly
 *   (1.07 %) to 1589.08 m 30 m west (spread 0.02–0.04 m), so `road` below; the east stairs
 *   from 1586.8 m at the deck-end node down to the landing at 1584.16 m (node 7472237206)
 *   and the street at 1581.77 m; the west stairs from the deck to 1581.15 m; the mast tip at
 *   1641.9 m (62.3 m here, about 60 m above the street at its foot), its axis leaning back
 *   about 10° to the south-east (lidar returns from 17 m up at (-3,-24) to the tip at
 *   (-6.4,-32.2)); the elevator tops at 14–15.3 m above ground_min; the deck about 21 m
 *   wide (x -10.6 to 10.4, with the balustrade 2 m up at the edges); the overlook strut at
 *   8–9 m around (12-14, -24..-33) and the west one at 7.6–8.2 m around (16-17, 33-36).
 *   Base check: tools/terrain.ts check finds the map's lowest ground at 1579.61 m, so the
 *   model's deck meets the lidar walking surface within 0.03 m.
 * - Mapterhorn terrain (tools/terrain.ts grid, 5 m, `GROUND`): stair walls, elevators,
 *   columns and the mast foot run down to it vertex by vertex.
 * - Published: mast 200 ft (61 m) (Commons description of Cher Skoubo's photo, Wikipedia);
 *   opened 2002.
 * - Photos (all EVIDENCE):
 *   - Cher Skoubo, CC BY 2.5: https://commons.wikimedia.org/wiki/File:Denver_millennium_bridge1_e1.jpg
 *     (mast foot), File:Denver_millennium_bridge2.jpg (west stairs, glass elevator),
 *     File:Denver_millennium_bridge3.jpg (from Commons Park, north-west), File:Denver_millennium_bridge4.jpg
 *   - Xnatedawgx, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Denver_Millennium_Bridge.JPG (from the east)
 *   - Xnatedawgx, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Denver_Millennium_Bridge_from_Union_Station_light_rail_platform.jpg
 *     (deck side, from the south-west)
 *   - Tracie from Orange County, CC BY-SA 2.0: https://commons.wikimedia.org/wiki/File:Denver_Millennium_Bridge_and_1900_16th_Street.jpg
 *     (on the deck, looking at the mast)
 *   - Robert Cutts, CC BY-SA 2.0: https://www.flickr.com/photos/21678559@N06/2528849110 (east
 *     end from the north-west: west stairs, elevator, the west prow and its stay),
 *     https://www.flickr.com/photos/21678559@N06/2515835358 (from the south-east, along the tracks:
 *     the mast's foot and its cone anchors)
 *
 * Measured / published / estimated:
 * - measured (lidar): deck walking surface and grade, stair profiles and landing, mast foot,
 *   lean and tip, deck width, elevator heights, prow heights and reach.
 * - published: mast 61 m (agrees with the lidar's 60 m above the street).
 * - estimated from photos: the deck's fascia depth (1.75 m) and rounded section, balustrade
 *   height (1.4 m, leaning out), the mast's spindle radii (0.45–0.85 m), the stay anchor
 *   points (drawn as 2 × 6 stays, about half the real count, thickened), the stays to the
 *   prow tips and the three ground stays, the prows' 0.7 m radius, elevator sizes (3.5 m).
 * - invented: the four slim columns under the deck's corners (the photos don't show the
 *   bearings; the deck must land on something at its ends).
 *
 * Doubts: the back-stay arrangement is read from two photos (Cutts) and the lidar; how many
 * ground stays there are, and where the prows' stays attach on the mast, is estimated. The
 * stair undersides are drawn as solid walls to the ground (the east stair is open steel). OSM's deck-end node 5130784024
 * sits about 4 m down the east stair from the real top step. The outline is tagged
 * bridge:structure=suspension; it is cable-stayed.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face, groundAt, stations, rod, type GroundGrid } from './bridge-kit'
import { smoothTube } from './dal-margaret-hunt-hill-bridge'
import { finish } from './palette'

// ---- Measured levels -------------------------------------------------------------------

const BASE = 1579.59 // NAVD88 at z = 0
/** The walking surface on the deck (lidar, bridge_ele.py): 1588.76 m at y -9.4, 1.07 % up to the west. */
const road = (y: number) => 1588.76 + (y + 9.4) * 0.0107 - BASE

/** Mapterhorn above BASE, rows along y from -50 (south-east) every 5 m, columns x -25..25. */
const GROUND: GroundGrid = { y0: -50, x0: -25, step: 5, z: [
  [1.8, 1.7, 1.8, 1.8, 1.8, 1.8, 1.7, 1.7, 1.8, 1.9, 1.4],
  [1.8, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 1.9, 2.1, 1.5],
  [1.8, 1.8, 1.8, 1.9, 2.0, 2.4, 2.2, 2.0, 2.0, 2.1, 2.1],
  [1.8, 1.8, 1.8, 1.8, 2.1, 2.5, 2.4, 2.2, 2.2, 2.0, 2.1],
  [1.8, 1.8, 1.8, 1.9, 2.3, 2.4, 2.3, 2.3, 2.2, 2.1, 2.0],
  [1.8, 1.7, 1.8, 2.0, 2.3, 2.4, 2.4, 2.3, 2.2, 2.2, 2.0],
  [1.8, 1.7, 1.7, 1.5, 1.9, 2.0, 2.0, 1.7, 1.9, 2.2, 2.1],
  [1.8, 1.8, 1.7, 1.7, 1.6, 1.6, 1.7, 1.6, 1.7, 2.2, 2.1],
  [0.2, 0.8, 1.5, 1.1, 1.1, 1.2, 1.3, 1.5, 1.5, 1.8, 2.1],
  [0.2, 0.0, 0.2, 0.3, 0.6, 0.7, 0.9, 1.1, 1.5, 1.5, 1.5],
  [0.3, 0.2, 0.2, 0.1, 0.2, 0.4, 0.4, 0.5, 0.8, 1.4, 1.5],
  [0.2, 0.3, 0.3, 0.2, 0.2, 0.2, 0.1, 0.0, 0.1, 0.2, 0.4],
  [0.0, 0.0, 0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.0],
  [0.3, 0.2, 0.0, 0.1, 0.2, 0.3, 0.2, 0.2, 0.2, 0.2, 0.1],
  [0.8, 0.7, 0.5, 0.4, 0.4, 0.4, 0.4, 0.0, 0.0, 0.0, 0.1],
  [1.0, 1.1, 1.0, 1.1, 1.1, 1.0, 1.0, 0.3, 0.0, 0.0, 0.0],
  [1.1, 1.3, 1.3, 1.2, 1.2, 1.2, 1.2, 1.2, 1.1, 0.5, 0.1],
  [1.1, 1.3, 1.2, 1.2, 1.1, 1.2, 1.2, 1.1, 1.1, 0.9, 0.4],
  [1.1, 1.2, 1.1, 1.0, 1.1, 1.3, 1.3, 1.0, 0.9, 0.9, 0.6],
  [1.0, 1.1, 1.0, 0.9, 1.2, 1.6, 1.6, 1.0, 0.8, 0.8, 0.5],
  [0.9, 1.0, 0.9, 0.9, 1.2, 1.4, 1.5, 0.9, 0.8, 0.7, 0.4],
] }
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// Plan (lidar + outline)
const XL = -10.6, XR = 10.4            // deck edges
const YE = -21.5, YW = 23.5            // deck ends (east, west)
const DEPTH = 1.75                     // fascia depth below the walking surface
const MAST_FOOT: V3 = [-2.2, -22.0, ground(-2.2, -22.0) - 0.3]
const MAST_TIP: V3 = [-6.4, -32.2, 1641.9 - BASE]
const EAST_PROW: V3 = [13.0, -33.5, 8.3]
const WEST_PROW: V3 = [17.2, 36.5, 7.8]

// ---- Helpers ---------------------------------------------------------------------------

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** A flat convex polygon facing n. */
function poly(p: Part, P: V3[], n: V3) {
  for (let i = 1; i < P.length - 1; i++) face(p, P[0], P[i], P[i + 1], P[i + 1], n)
}

/** A vertical wall along (x0,y0)-(x1,y1) from the ground up to top(t), split into ≤ 4 m pieces, facing n. */
function footedWall(p: Part, x0: number, y0: number, x1: number, y1: number, top: (t: number) => number, n: V3, sink = 0.3) {
  const ts = stations(0, 1, 4 / Math.max(0.1, Math.hypot(x1 - x0, y1 - y0)))
  for (let i = 0; i < ts.length - 1; i++) {
    const [ta, tb] = [ts[i], ts[i + 1]]
    const xa = x0 + (x1 - x0) * ta, ya = y0 + (y1 - y0) * ta, xb = x0 + (x1 - x0) * tb, yb = y0 + (y1 - y0) * tb
    face(p, [xa, ya, Math.max(0, ground(xa, ya) - sink)], [xb, yb, Math.max(0, ground(xb, yb) - sink)], [xb, yb, top(tb)], [xa, ya, top(ta)], n)
  }
}

/** A box from the ground to `top`, side faces only plus the top. */
function footedBox(p: Part, x0: number, x1: number, y0: number, y1: number, top: number, cap?: Part) {
  footedWall(p, x0, y0, x1, y0, () => top, [0, -1, 0])
  footedWall(p, x1, y0, x1, y1, () => top, [1, 0, 0])
  footedWall(p, x1, y1, x0, y1, () => top, [0, 1, 0])
  footedWall(p, x0, y1, x0, y0, () => top, [-1, 0, 0])
  if (cap) poly(cap, [[x0, y0, top], [x1, y0, top], [x1, y1, top], [x0, y1, top]], [0, 0, 1])
}

/** An axis-aligned box between two heights. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom?: Part) {
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  face(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  face(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(bottom, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
}

/** A thin leaning balustrade along a polyline of [x, y, z] base points; `out` is the lean direction in plan. */
function balustrade(p: Part, base: V3[], out: [number, number], h = 1.4, lean = 0.3, t = 0.12) {
  for (let i = 0; i < base.length - 1; i++) {
    const a = base[i], b = base[i + 1]
    const top = (q: V3, o: number): V3 => [q[0] + out[0] * (lean + o), q[1] + out[1] * (lean + o), q[2] + h]
    const bot = (q: V3, o: number): V3 => [q[0] + out[0] * o, q[1] + out[1] * o, q[2]]
    const nOut = norm([out[0] * h, out[1] * h, -lean])
    face(p, bot(a, t), bot(b, t), top(b, t), top(a, t), nOut)
    face(p, bot(a, 0), bot(b, 0), top(b, 0), top(a, 0), [-nOut[0], -nOut[1], -nOut[2]])
    face(p, top(a, 0), top(b, 0), top(b, t), top(a, t), [0, 0, 1])
  }
}

/**
 * A straight stair between x0 and x1 following a walking line of [y, z] points (flights and
 * landings), stepped at about 0.3 m risers; white side walls (with a solid balustrade 1 m
 * above the line) run down to the ground.
 */
function stair(walk: Part, side: Part, x0: number, x1: number, line: [number, number][]) {
  for (let i = 0; i < line.length - 1; i++) {
    const [ya, za] = line[i], [yb, zb] = line[i + 1]
    const dir = Math.sign(yb - ya)
    if (Math.abs(zb - za) < 0.05) {
      poly(walk, [[x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]], [0, 0, 1])
      continue
    }
    const n = Math.ceil(Math.abs(zb - za) / 0.3), run = (yb - ya) / n, rise = (zb - za) / n
    for (let k = 0; k < n; k++) {
      // going down from a to b: tread at the upper level, then the riser down
      const y0 = ya + run * k, z0 = za + rise * k, y1 = y0 + run
      const zt = rise < 0 ? z0 : z0 + rise
      poly(walk, [[x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt]], [0, 0, 1])
      const yr = rise < 0 ? y1 : y0, zLo = rise < 0 ? z0 + rise : z0, zHi = rise < 0 ? z0 : z0 + rise
      face(walk, [x0, yr, zLo], [x1, yr, zLo], [x1, yr, zHi], [x0, yr, zHi], [0, rise < 0 ? dir : -dir, 0])
    }
  }
  // side walls and balustrades
  const zAt = (y: number) => {
    for (let i = 0; i < line.length - 1; i++) {
      const [ya, za] = line[i], [yb, zb] = line[i + 1]
      if ((y - ya) * (y - yb) <= 0) return za + ((zb - za) * (y - ya)) / (yb - ya || 1)
    }
    return line[line.length - 1][1]
  }
  for (const [x, n] of [[x0, -1], [x1, 1]] as [number, number][]) {
    for (let i = 0; i < line.length - 1; i++) {
      const [ya] = line[i], [yb] = line[i + 1]
      footedWall(side, x, ya, x, yb, (t) => zAt(ya + (yb - ya) * t) + 1.0, [n, 0, 0])
      const w = 0.25 * -n
      footedWall(side, x + w, yb, x + w, ya, (t) => zAt(yb + (ya - yb) * t) + 1.0, [-n, 0, 0], -0.5)
      face(side, [x, ya, zAt(ya) + 1], [x, yb, zAt(yb) + 1], [x + w, yb, zAt(yb) + 1], [x + w, ya, zAt(ya) + 1], [0, 0, 1])
    }
  }
}

// ---- Build -----------------------------------------------------------------------------

export function build() {
  const steel = new Part(), shade = new Part(), walk = new Part(), glass = new Part(), frame = new Part()

  // Deck: a swept section with a deep rounded fascia on each long edge.
  const prof: [number, number, 'top' | 'steel' | 'shade'][] = [
    [XR, 0, 'top'], [XL, 0, 'steel'], [XL - 0.45, -0.45, 'steel'], [XL - 0.35, -1.2, 'shade'], [XL + 0.8, -DEPTH, 'shade'],
    [XR - 0.8, -DEPTH, 'shade'], [XR + 0.35, -1.2, 'shade'], [XR + 0.45, -0.45, 'steel'],
  ]
  const ys = stations(YE, YW, 4.5)
  for (let k = 0; k < ys.length - 1; k++) {
    const [ya, yb] = [ys[k], ys[k + 1]]
    for (let i = 0; i < prof.length; i++) {
      const [x0, z0, m] = prof[i], [x1, z1] = prof[(i + 1) % prof.length]
      const n = norm([z1 - z0, 0, -(x1 - x0)])
      const part = m === 'top' ? walk : m === 'steel' ? steel : shade
      face(part, [x0, ya, road(ya) + z0], [x0, yb, road(yb) + z0], [x1, yb, road(yb) + z1], [x1, ya, road(ya) + z1], n)
    }
  }
  for (const [y, s] of [[YE, -1], [YW, 1]] as [number, number][])
    poly(shade, prof.map(([x, z]) => [x, y, road(y) + z] as V3), [0, s, 0])
  // balustrades along the long edges
  balustrade(steel, ys.map((y) => [XR, y, road(y)] as V3), [1, 0])
  balustrade(steel, ys.map((y) => [XL, y, road(y)] as V3).reverse(), [-1, 0])
  // ... and across the ends beside the stairs
  balustrade(steel, [[XL, YW, road(YW)], [-1.5, YW, road(YW)]], [0, 1], 1.2, 0.1)
  balustrade(steel, [[3.9, YW, road(YW)], [XR, YW, road(YW)]], [0, 1], 1.2, 0.1)
  balustrade(steel, [[-2.2, YE, road(YE)], [XL, YE, road(YE)]], [0, -1], 1.2, 0.1)

  // Corner columns (invented: the bearings aren't seen) — slim white posts to the ground.
  for (const [x, y] of [[-8.5, -19.5], [8.5, -18.5], [-8.5, 21.5], [8.5, 21.5]] as [number, number][]) {
    const zt = road(y) - DEPTH + 0.1
    const path: V3[] = [[x, y, Math.max(0, ground(x, y) - 0.3)], [x, y, zt]]
    smoothTube(shade, path, 0.45, 8)
  }

  // The prows: round white beams that run out past the deck's north-east corners at both
  // ends (lidar 8-9 m at (12-13, -24..-33) and 7.6-8.2 m at (16-17, 33-36); Cutts's photo
  // from the north-west shows the western one with the overlook on its root).
  for (const [a, b] of [[[9.6, -19.5, road(-19.5) - 0.9], EAST_PROW], [[9.6, 24.5, road(24.5) - 0.9], WEST_PROW]] as [V3, V3][]) {
    const path: V3[] = [a, lerp3(a, b, 0.5), lerp3(a, b, 0.93), b]
    smoothTube(steel, path, (i) => [0.7, 0.7, 0.6, 0.12][i], 10)
  }
  // The overlook at the west end's north-east corner, at deck level.
  const zo = road(YW)
  box(shade, 3.9, XR, YW, 28.5, zo - 1.2, zo - 0.02)
  poly(walk, [[3.9, YW, zo], [XR, YW, zo], [XR, 28.5, zo], [3.9, 28.5, zo]], [0, 0, 1])
  balustrade(steel, [[XR, YW, zo], [XR, 28.5, zo], [3.9, 28.5, zo]], [0.7, 0.7], 1.2, 0.15)

  // East stairs: from the deck end down to a landing (lidar 4.6 m) and on to the street.
  const zE = road(YE)
  stair(walk, steel, -2.2, 4.1, [[YE, zE], [-29.0, 4.6], [-32.5, 4.6], [-41.9, ground(1, -41.9)]])
  // West stairs: from the deck down to Riverfront Park.
  const zW = road(YW)
  stair(walk, steel, -1.5, 3.9, [[YW, zW], [33.5, 5.7], [35.5, 5.7], [45.1, ground(1.2, 45.1)]])
  // West elevator platform at deck level.
  box(shade, -17.4, XL, 22.6, 27.6, zW - 1.2, zW - 0.02)
  poly(walk, [[-17.4, 22.6, zW], [XL, 22.6, zW], [XL, 27.6, zW], [-17.4, 27.6, zW]], [0, 0, 1])
  balustrade(steel, [[-17.4, 22.6, zW], [-17.4, 27.6, zW], [XL, 27.6, zW]], [-0.7, 0.7], 1.2, 0.1)

  // Glass elevator towers with dark frames and caps (lidar tops 14.0–15.3 m over ground_min).
  for (const [x0, y0, top] of [[-8.6, -25.6, 14.6], [-15.6, 23.9, 15.0]] as [number, number, number][]) {
    const x1 = x0 + 3.5, y1 = y0 + 3.5
    footedBox(glass, x0 + 0.15, x1 - 0.15, y0 + 0.15, y1 - 0.15, top - 1.4)
    box(frame, x0, x1, y0, y1, top - 1.4, top)
    for (const [cx, cy] of [[x0, y0], [x1 - 0.35, y0], [x0, y1 - 0.35], [x1 - 0.35, y1 - 0.35]])
      footedBox(frame, cx, cx + 0.35, cy, cy + 0.35, top - 1.4)
    // a band at deck level, where the walkway meets the cab
    box(frame, x0 - 0.05, x1 + 0.05, y0 - 0.05, y1 + 0.05, road(y0) - 0.9, road(y0) + 0.1)
  }

  // The mast: a white spindle from the ground beside the east stairs, leaning back.
  const mastAt = (t: number) => lerp3(MAST_FOOT, MAST_TIP, t)
  const mts = [0, 0.03, 0.1, 0.2, 0.32, 0.45, 0.58, 0.7, 0.8, 0.88, 0.94, 0.98, 1]
  const mr = (t: number) => (t < 0.1 ? 1.2 - 4 * t : t < 0.45 ? 0.8 + (0.3 * (t - 0.1)) / 0.35 : 1.1 * Math.cos(((t - 0.45) / 0.55) * Math.PI / 2) + 0.05)
  smoothTube(steel, mts.map(mastAt), (i) => mr(mts[i]), 12)

  // Stays: two fans from the mast's upper half to the deck edges (half the real count).
  const anchorsY = [-14, -7, 0, 7, 14, 21]
  anchorsY.forEach((y, i) => {
    const top = mastAt(0.5 + 0.08 * (i))
    for (const x of [XL + 0.3, XR - 0.3]) rod(steel, top, [x, y, road(y) + 0.2], 0.16, 4)
  })
  // the longest stay to the west prow's tip, and the back-stay to the east prow's tip
  rod(steel, mastAt(0.96), WEST_PROW, 0.16, 4)
  rod(steel, mastAt(0.97), EAST_PROW, 0.2, 4)
  // Ground stays at the mast's foot, each on a white cone anchor (Cutts's photo from the south-east).
  ;[[-7.2, -28.6, 0.62], [-5.6, -29.3, 0.72], [-4.0, -30.0, 0.82]].forEach(([x, y, t]) => {
    const g = ground(x, y)
    smoothTube(steel, [[x, y, g - 0.2], [x, y, g + 0.9], [x, y, g + 1.6]], (i) => [0.4, 0.3, 0.06][i], 8)
    rod(steel, [x, y, g + 1.4], mastAt(t), 0.13, 4)
  })

  return { steel, shade, walk, glass, frame }
}

// Anchor at the outline's centroid: the frame above is centred 0.11 m east-north-east... of it.
const CX = 0.11, CY = -0.56
function recentre(p: Part) {
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= CX; p.pos[i + 2] += CY }
}

if (import.meta.main) {
  const m = build()
  for (const p of Object.values(m)) recentre(p)
  const mastLit = (p: V3) => (p[2] > 10 ? 0.85 : 0.4)
  const STEEL = { ...finish('painted-steel', 0xe8e8e4), floodlight: mastLit }
  const SHADE = finish('painted-steel-shade', 0xd2d5d6)
  const WALK = finish('walkway', 0xc3c1bb)
  const GLASS = finish('window', 0x86a7bd)
  const FRAME = finish('elevator-frame', 0x4a4f57)
  const parts = [
    { part: m.steel, material: STEEL }, { part: m.shade, material: SHADE }, { part: m.walk, material: WALK },
    { part: m.glass, material: GLASS }, { part: m.frame, material: FRAME },
  ]
  const glb = writeGlb('Denver Millennium Bridge', parts)
  await Bun.write(new URL('../models/den-millennium-bridge.glb', import.meta.url), glb)
  console.log(`den-millennium-bridge.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
