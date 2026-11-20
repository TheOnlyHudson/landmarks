/**
 * John Seigenthaler Pedestrian Bridge (Sparkman / Shelby Street Bridge, 1909; Howard M. Jones;
 * a pedestrian bridge since 2003) — procedural, CC0-1.0, no textures.
 * bun generators/nash-seigenthaler-bridge.ts
 *
 * The whole structure inside the OSM man_made=bridge outline way/655292429: the west concrete
 * approach (bent ~15° south of the river spans' axis), the three steel through trusses over the
 * Cumberland, their four concrete piers, the short steel deck truss on the east bank, the east
 * portal pier, the concrete arched approach, and the 2003 green-glass elevator tower at the
 * east landing. The east approach runs on past the outline's end (y 256.5) as far as the
 * walkway's own bridge=yes way does, down to where it lands on the ground at y ~343-345, and
 * ends there at an abutment face; before, it stopped in the air on a bent at the outline's end
 * while the map's path carried on down the ramp. A pedestrian bridge, so the walkway surface is the
 * model's (material `walkway`). Writes a low model and a detail model (Pennsylvania
 * sub-struts, top lateral bracing, floor beams, railings, lamp beads), drawn from z16.
 *
 * What makes it this bridge: three white camelback through trusses in a row, the centre
 * (Pennsylvania) span much taller than the two equal side (Parker) spans; slender concrete
 * piers whose ends show two legs under a cap with a round-headed opening; the overlooks on the
 * river piers; long concrete approaches falling to each bank.
 *
 * Frame: x across, y along the river spans (bearing 47.4°, their axis in the lidar and OSM),
 * z up, metres; origin at the outline's centroid. The river spans' centreline is x = 10
 * (lidar 10–10.5, OSM footway 9.3–9.9). z = 0 is the river: lidar 119.44 m NAVD88,
 * Mapterhorn 119.0 m.
 *
 * Sources:
 * - OSM: outline way/655292429 (man_made=bridge, bridge:structure=truss); the walkway
 *   way/89757744 (highway=pedestrian, Q7493419, NRHP 86003237). No buildings inside.
 * - Lidar, USGS 3DEP TN_DavidsonCo_1_2022 (flown 2022), 1 m grid: the walkway profile
 *   (tools/bridge_ele.py measure 89757744: 23.7 m above the river at the trusses' west end,
 *   24.4–24.8 over the river, 24.2 at the east bank, falling to 16.7 at y 273 and 10.7 at the
 *   outline's west end); the top chords' tops (side spans 33.8 / 34.3, i.e. 9.3–9.8 above the
 *   walkway; centre span 39.3, 14.7 above); span ends at y -68/-21, -13/77, 86/133 (river
 *   piers at -17 and 81.5); deck 15–16 m wide, top lateral system x 4..17; the elevator's top
 *   30.3 m at x 18–20, y 180.
 * - Published: 3,150 ft (960 m) long overall; opened 1909; concrete substructure, steel
 *   superstructure; refurbished 2003 with elevator, ramps and stairs; 15 ft centre lane and two
 *   10 ft boardwalks (Wikipedia "John Seigenthaler Pedestrian Bridge"; HAER TN-38).
 * - Mapterhorn terrain (tools/terrain.ts grid, 10 m, `GROUND`): bents and shore piers stand
 *   on it vertex by vertex; river piers stand at 0.
 * - Photos (Wikimedia Commons): HAER TN-38-1, -2, -3, -8, -17 (George Hornal, 1998, public
 *   domain: the three spans and piers from the south, the portal, the concrete viaduct with
 *   haunched arches); "Shelby Street Pedestrian Bridge" (Michael Rivera, CC BY-SA 4.0; the
 *   piers' legs and round-headed openings, from the north-west); "Shelby street bridge day"
 *   (CC0; the same, with the overlooks); "Shelby Street Bridge 2008" (Kaldari, CC0; from the
 *   Gateway Bridge, south-east); "Nashville from Cumberland River September 2026 005" (King of
 *   Hearts, CC BY-SA 4.0; aerial, the east deck truss, portal pier, elevator and arched
 *   viaduct); "Shelby Street Bridge - panoramio" and "Shelby street bridge night" (rokker,
 *   CC BY 3.0 / CC0; night lighting); "Aerial view of Shelby Street Bridge - 01" (HABS, public
 *   domain).
 * - Estimated: panel counts (7, 13, 7 at ~6.8 m, counted from the HAER photos); member sizes;
 *   the piers' plan (river piers 13.2 m across, 7.2 m along above an 8.6 m base, opening
 *   2.4 m, sill 11.3 m, from photo proportions); the deck truss (6 panels, 3.3 m deep) and the
 *   portal pier at y 173.5; approach bents every ~14.6 m (west) and 13.6 m (east) with
 *   2 m-rise arched soffits; the elevator's 4 m plan.
 *
 * Colours: the steel is painted white-grey (every daylight photo), a light grey a shade under
 * the palette's trim; the concrete a warm light grey; the walkway a light tan grey.
 *
 * Night: the trusses are lit white (night photos), carried as `_FLOODLIGHT` on the steel above
 * the walkway; the piers floodlit (warm in the photos); lamp beads on the detail model.
 *
 * - The east approach past the outline (y 256.5..343): the walkway from the lidar (bridge_ele.py
 *   measure 89757744, every 10 m: 16.7 m above the river at y 274 to 10.2 at y 343, ~9.3 %),
 *   the same arched viaduct on bents (seven bays of ~12.8 m, estimated), as the 1998 HAER
 *   aerial (TN-38-1) and NAIP show an elevated deck on columns there. Its ground: a second
 *   Mapterhorn grid (terrain.ts grid), matched to the first where they overlap.
 * Doubts: the east approach's last 90 m lie outside OSM's man_made=bridge outline, so a map may
 *   also draw its own piers and parapets under that part of the path until the outline is
 *   extended in OSM; the bents' spacing there is estimated. The west approach's structure over the railway and 1st Avenue (a concrete viaduct
 * here; part is steel girder in the HAER photos); bent spacing on both approaches; the
 * overlooks' size (from lidar only); the map's walkway height where OSM has no `ele`.
 */
import { Part, type V3 } from './mesh'
import { face, groundAt, piecewise, stations, merged, bead, type GroundGrid } from './bridge-kit'
import { writeBoth } from './dal-margaret-hunt-hill-bridge'
import { finish } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ---- Plan: the walkway's centreline, from the outline's west end to its east end -------------

const XC = 10                       // the river spans' centreline (lidar 10–10.5, OSM footway 9.3–9.9)
// The outline ends at y 256.5, but the walkway (bridge=yes, way/89757744) runs on over the
// east approach to land at y ~345 (lidar: 0.6 m over the bare earth at y 343), so the model does.
const Y_OUT = 256.5, Y_END = 343
const PLAN: [number, number][] = [[-41.8, -267.9], [-30.5, -225.0], [-28.9, -219.2], [XC, -70], [XC, Y_END]]
const U: number[] = [0]
for (let i = 1; i < PLAN.length; i++) U.push(U[i - 1] + Math.hypot(PLAN[i][0] - PLAN[i - 1][0], PLAN[i][1] - PLAN[i - 1][1]))
const UK = U[3], UEND = U[4]
const uOfY = (y: number) => UK + (y + 70)

/** Position and unit tangent of the centreline at u (tangents averaged at the bends). */
function at(u: number): { p: [number, number]; t: [number, number] } {
  u = Math.min(Math.max(u, 0), UEND)
  let i = 1
  while (i < U.length - 1 && U[i] < u) i++
  const [a, b] = [PLAN[i - 1], PLAN[i]], L = U[i] - U[i - 1], f = (u - U[i - 1]) / L
  const t: [number, number] = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const near = (k: number) => Math.abs(u - U[k]) < 1e-6 && k > 0 && k < U.length - 1
  for (const k of [i - 1, i]) if (near(k)) {
    const [p0, p1, p2] = [PLAN[k - 1], PLAN[k], PLAN[k + 1]]
    const l0 = U[k] - U[k - 1], l1 = U[k + 1] - U[k]
    const m: [number, number] = [(p1[0] - p0[0]) / l0 + (p2[0] - p1[0]) / l1, (p1[1] - p0[1]) / l0 + (p2[1] - p1[1]) / l1]
    const l = Math.hypot(...m)
    return { p: p1, t: [m[0] / l, m[1] / l] }
  }
  return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], t }
}

/**
 * The walkway, metres above the river (lidar, TN_DavidsonCo_1_2022, along OSM way/89757744
 * with tools/bridge_ele.py; the river reads 119.44 m NAVD88), by distance from the bend at
 * the river spans' west end (u - UK; negative to the west).
 */
const ROAD_TABLE: [number, number][] = [
  [-205, 10.7], [-200, 11.3], [-190, 12.6], [-180, 13.8], [-170, 15.1], [-160, 16.3], [-154, 17.1], [-150, 17.2],
  [-140, 17.7], [-130, 18.2], [-120, 18.7], [-110, 19.2], [-100, 19.7], [-90, 20.2], [-80, 20.7], [-70, 21.2],
  [-60, 21.7], [-50, 22.0], [-40, 22.3], [-30, 22.6], [-20, 23.0], [-10, 23.3], [0, 23.7], [14, 23.9], [24, 24.0],
  [44, 24.2], [64, 24.35], [84, 24.5], [104, 24.55], [124, 24.6], [144, 24.65], [164, 24.6], [184, 24.45],
  [204, 24.15], [214, 23.7], [224, 23.2], [234, 22.75], [244, 22.3], [254, 21.8], [264, 21.3], [274, 20.8],
  [284, 20.3], [294, 19.8], [304, 19.3], [314, 18.8], [324, 18.3], [334, 17.65], [344, 16.7],
  // the east approach past the outline, down to the landing (bridge_ele.py, every 10 m)
  [354.6, 15.6], [363.6, 14.8], [373.6, 13.85], [383.6, 12.9], [393.6, 12.0], [403.6, 11.1],
  [413.6, 10.15], [420.6, 9.55],
]
const roadK = piecewise(ROAD_TABLE)
const road = (u: number) => roadK(u - UK)
const roadY = (y: number) => road(uOfY(y))

/** Mapterhorn (the map's terrain) in this frame, metres above its own river reading (119.0 m). */
const GROUND: GroundGrid = { y0: -280, x0: -70, step: 10, z: [
  [10, 9.9, 9.9, 10.1, 10, 10.3, 9.6, 9.4, 9, 8.7, 9.3, 9.3],
  [9.9, 9.5, 9.7, 9.9, 9.9, 9.5, 8.5, 8.2, 7.9, 8.1, 8.6, 8.9],
  [9.3, 8.9, 8.9, 9.4, 8.9, 7.9, 7.3, 7, 6.8, 7.4, 8, 8.5],
  [8.8, 8.4, 8.6, 9, 8.9, 8, 7.2, 6.5, 6.6, 6.9, 7.3, 7.9],
  [8.3, 8, 7.9, 8.6, 8.6, 8, 7.6, 7.1, 7.2, 7.4, 7.9, 7.6],
  [8.4, 8.3, 8.1, 8.1, 8.2, 7.8, 7.7, 7.7, 7.8, 7.6, 7.6, 7.5],
  [8.4, 8.2, 8.1, 7.8, 7.7, 7.4, 7.3, 7.3, 7.5, 7.6, 7.7, 7.7],
  [8.2, 8, 7.8, 7.5, 7.5, 7.5, 7.4, 7.5, 7.7, 7.8, 7.7, 7.7],
  [8, 7.9, 7.8, 7.8, 7.7, 7.6, 7.5, 7.6, 7.8, 7.6, 7.6, 7.6],
  [8.1, 8.1, 8.1, 8, 7.7, 7.6, 7.5, 7.6, 7.5, 7.5, 7.5, 7.5],
  [8.3, 8.1, 8, 7.9, 7.7, 7.6, 7.5, 7.5, 7.4, 7.1, 7.1, 7.3],
  [8.4, 8.1, 8, 7.9, 7.7, 7.5, 7.6, 7.3, 7.3, 7.4, 7.5, 7.6],
  [8.5, 8.1, 7.9, 7.9, 7.8, 7.7, 7.8, 7.7, 7.6, 7.7, 7.8, 8],
  [8.7, 8.4, 8.3, 8.2, 8.2, 8, 8.1, 8, 8, 8.1, 8.2, 8.2],
  [8.6, 8.5, 8.4, 8.4, 8.4, 8.3, 8.4, 8.3, 8.2, 8.2, 8.3, 8.2],
  [8.5, 8.4, 8.4, 8.3, 8.3, 8.3, 8.3, 8.3, 8.2, 8.1, 8.3, 8.4],
  [8.3, 8.3, 8.3, 8.3, 8.3, 8.4, 8.3, 8.3, 8.2, 8.1, 8.4, 8.7],
  [8.3, 8.3, 8.3, 8.3, 8.4, 8.2, 8.1, 8.2, 8.4, 8.3, 8.5, 8.7],
  [8.3, 8.2, 8.1, 8.1, 8.1, 8, 8, 8.3, 8.3, 8.4, 8.6, 8.8],
  [8.1, 8.2, 8.2, 8.2, 8.1, 7.9, 7.9, 8.1, 8.2, 8.5, 8.6, 9],
  [8.4, 8.3, 8.2, 8, 7.9, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.7],
  [7.8, 8, 8.1, 7.8, 7.8, 7.8, 8.3, 8.1, 8.3, 8.3, 8.3, 8.3],
  [7.9, 6.4, 6.4, 5.9, 5.8, 6, 7.7, 5.6, 5.7, 6, 7.2, 7.7],
  [2.9, 2.6, 2.9, 2.5, 2.5, 2.4, 2, 1.1, 0.9, 2.2, 3, 3.3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1, 0, 0, 0, 0],
  [5.2, 4.8, 3.4, 4.2, 5.1, 4.6, 4.1, 3.8, 3.2, 3.1, 3, 2.7],
  [7.4, 7.5, 8.1, 8.7, 8.5, 8.4, 8.4, 8.4, 8.2, 7.7, 6.9, 6.1],
  [7.8, 7.9, 8.7, 9.1, 8.9, 9, 8.5, 8.4, 8.3, 8.4, 8.4, 8.4],
  [8.2, 8.3, 8.6, 9, 9, 8.9, 8.5, 8.3, 8.4, 8.7, 9, 8.9],
  [8.4, 8.4, 8.3, 8.3, 8.3, 8.4, 8.4, 8.3, 8.3, 8.7, 9.1, 7.9],
  [8.5, 8.7, 8.7, 8.6, 8.4, 8.4, 8.4, 8.3, 8.4, 8.6, 9.5, 7.8],
  [8.7, 8.8, 8.8, 8.6, 8.5, 8.2, 8.2, 8.4, 8.5, 8.5, 9.4, 8.5],
  [8.7, 8.8, 8.7, 8.6, 8.7, 8.8, 8.5, 8.3, 8.5, 8.4, 8.5, 10.2],
  [8.6, 9, 9.1, 8.9, 8.7, 8.6, 8.5, 8.4, 8.5, 8.5, 8.3, 8.3],
  [8.6, 8.5, 8.6, 8.6, 8.6, 8.8, 8.6, 8.5, 8.5, 8.6, 8.6, 8.3],
  [8.2, 8.4, 8.6, 8.7, 8.7, 8.6, 8.4, 8.3, 8.6, 8.6, 8.6, 8.5],
  [8.3, 8.5, 8.6, 8.6, 8.6, 8.5, 8.4, 8.2, 8.6, 8.5, 8.5, 8.6],
  [8.3, 8.5, 8.6, 8.6, 8.5, 8.3, 8.1, 8.2, 8.5, 8.4, 8.4, 8.4],
  [8.4, 8.4, 8.4, 8.4, 8.3, 8.3, 8.2, 8.2, 8.5, 8.4, 8.4, 8.3],
  [8.2, 8.3, 8.4, 8.4, 8.4, 8.4, 8.3, 8.5, 8.5, 8.5, 8.5, 8.4],
  [8.3, 8.3, 8.4, 8.6, 8.7, 8.7, 8.7, 8.8, 8.8, 8.6, 8.6, 8.5],
  // y 290..370 over the east approach: terrain.ts grid -86.7701434 36.1635779 60 10, set to this
  // grid's datum where the two overlap (+0.27 m)
  [8.7, 8.6, 8.5, 8.5, 8.5, 8.7, 8.7, 8.7, 8.6, 8.5, 8.4, 8.5],
  [8.7, 8.7, 8.8, 8.8, 8.9, 8.9, 8.8, 8.8, 8.7, 8.7, 8.6, 8.6],
  [8.9, 9.0, 9.1, 9.2, 9.3, 9.2, 9.0, 8.9, 8.8, 8.7, 8.7, 8.8],
  [9.3, 9.1, 9.2, 9.3, 9.4, 9.4, 9.2, 9.1, 9.0, 8.9, 8.9, 8.9],
  [9.0, 9.0, 9.2, 9.4, 9.6, 9.5, 9.3, 9.2, 9.1, 9.1, 9.1, 8.9],
  [9.0, 9.2, 9.4, 9.6, 9.7, 9.6, 9.3, 9.3, 9.2, 9.2, 9.1, 8.9],
  [9.1, 9.2, 9.4, 9.6, 9.8, 9.7, 9.4, 9.4, 9.4, 9.2, 9.1, 8.9],
  [9.1, 9.3, 9.5, 9.7, 9.9, 9.7, 9.4, 9.4, 9.2, 9.0, 8.9, 8.7],
  [9.1, 9.2, 9.4, 9.7, 9.9, 9.8, 9.4, 9.2, 9.0, 8.8, 8.7, 8.6],
]}
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- Small geometry helpers ------------------------------------------------------------------

/** A straight member from a to b: w wide, t deep along `side`; four sides, open ends. */
function bar(p: Part, a: V3, b: V3, w: number, t: number, side: V3 = [0, 0, 1]) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, side[0] * d[0] + side[1] * d[1] + side[2] * d[2])))
  const W = cross(S, d)
  const c = (o: V3, u: number, v: number) => add(o, add(mul(W, (u * w) / 2), mul(S, (v * t) / 2)))
  for (const [u0, v0, u1, v1, n] of [[1, -1, 1, 1, W], [1, 1, -1, 1, S], [-1, 1, -1, -1, mul(W, -1)], [-1, -1, 1, -1, mul(S, -1)]] as [number, number, number, number, V3][])
    face(p, c(a, u0, v0), c(b, u0, v0), c(b, u1, v1), c(a, u1, v1), n)
}

/** A flat polygon (convex or star-shaped from its first point), wound to face n. */
function fan(p: Part, P: V3[], n: V3) {
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1], g = cross(sub(b, a), sub(c, a))
    if (Math.hypot(...g) < 1e-6) continue
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
  }
}

/** An axis-aligned box (model frame), all six faces unless told otherwise. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false, top = true) {
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  if (top) face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
}

/**
 * A section swept along the centreline: `prof(u)` gives [dx, z] points (dx across, +x to the
 * right of +u; z absolute), walked down the left side, along the bottom and up the right side,
 * so each face's outward normal lies to the right of the walk.
 */
function sweep(p: Part, us: number[], prof: (u: number) => [number, number][]) {
  const pts = us.map((u) => {
    const { p: c, t } = at(u), N: [number, number] = [t[1], -t[0]]
    return { N, P: prof(u).map(([dx, z]) => [c[0] + N[0] * dx, c[1] + N[1] * dx, z] as V3), pr: prof(u) }
  })
  for (let k = 0; k < us.length - 1; k++) {
    const A = pts[k], B = pts[k + 1]
    for (let i = 0; i < A.P.length - 1; i++) {
      const [xa, za] = A.pr[i], [xb, zb] = A.pr[i + 1]
      const N = A.N
      const n = norm([N[0] * (zb - za), N[1] * (zb - za), -(xb - xa)])
      if (Math.hypot(xb - xa, zb - za) < 1e-4 && Math.hypot(B.pr[i + 1][0] - B.pr[i][0], B.pr[i + 1][1] - B.pr[i][1]) < 1e-4) continue
      face(p, A.P[i], B.P[i], B.P[i + 1], A.P[i + 1], n)
    }
  }
}

/** Stations from a to b at most `step` apart, plus any breakpoints inside. */
function us(a: number, b: number, step: number, breaks: number[] = []): number[] {
  const s = new Set([...stations(a, b, step), ...breaks.filter((x) => x > a && x < b)])
  return [...s].sort((p, q) => p - q)
}

/**
 * A concrete pier at y = yc. Its upstream and downstream ends (facing +-x, the faces seen from
 * beside the bridge) show two legs under a cap, spaced along the bridge, with a round-headed
 * opening between them that runs through the pier across the bridge: from `sill` up, or from
 * the ground. Solid below the sill. Built in a local frame (f along the bridge, d across) and
 * mapped to the model's; the end faces are cut in vertical strips so the foot follows the ground.
 */
function pier(p: Part, yc: number, HD: number, HF: number, r: number, sill: number | null, spring: number, top: number, segs = 10) {
  const M = (f: number, d: number, z: number): V3 => [XC + d, yc + f, z]
  const Nm = (nf: number, nd: number, nz: number): V3 => [nd, nf, nz]
  const fs = [...new Set([...stations(-HF, -r, 4.2), ...stations(-r, r, (2 * r) / segs), ...stations(r, HF, 4.2)])].sort((a, b) => a - b)
  const g = (f: number, d: number) => ground(XC + d, yc + f)
  const arch = (f: number) => spring + Math.sqrt(Math.max(0, r * r - f * f))
  const F = (q: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => face(q, a, b, c, d, n)
  for (const [d, s] of [[-HD, -1], [HD, 1]] as [number, number][]) {
    for (let i = 0; i < fs.length - 1; i++) {
      const fa = fs[i], fb = fs[i + 1], m = (fa + fb) / 2, inside = m > -r && m < r
      const spans: [(f: number) => number, (f: number) => number][] = inside
        ? [...(sill !== null ? [[(f: number) => g(f, d), () => sill] as [(f: number) => number, (f: number) => number]] : []), [arch, () => top]]
        : [[(f: number) => g(f, d), () => top]]
      for (const [lo, hi] of spans) F(p, M(fa, d, lo(fa)), M(fb, d, lo(fb)), M(fb, d, hi(fb)), M(fa, d, hi(fa)), Nm(0, s, 0))
    }
  }
  for (const s of [-1, 1]) {
    const f = s * HF
    F(p, M(f, -HD, g(f, -HD)), M(f, HD, g(f, HD)), M(f, HD, top), M(f, -HD, top), Nm(s, 0, 0))
    const fj = s * r, lo = (d: number) => (sill !== null ? sill : g(fj, d))
    F(p, M(fj, -HD, lo(-HD)), M(fj, HD, lo(HD)), M(fj, HD, spring), M(fj, -HD, spring), Nm(-s, 0, 0))
  }
  F(p, M(-HF, -HD, top), M(HF, -HD, top), M(HF, HD, top), M(-HF, HD, top), [0, 0, 1])
  for (let i = 0; i < fs.length - 1; i++) {
    const fa = fs[i], fb = fs[i + 1], m = (fa + fb) / 2
    if (!(m > -r && m < r)) continue
    const n = norm(Nm(-m, 0, -(arch(m) - spring)))
    F(p, M(fa, -HD, arch(fa)), M(fb, -HD, arch(fb)), M(fb, HD, arch(fb)), M(fa, HD, arch(fa)), n)
    if (sill !== null) F(p, M(fa, -HD, sill), M(fb, -HD, sill), M(fb, HD, sill), M(fa, HD, sill), [0, 0, 1])
  }
}

// ---- The structure -------------------------------------------------------------------------

const TX = 6.1        // truss planes, either side of the centreline (lidar: top lateral system x 4..17)
const HW_DECK = 8.0   // deck edge on the steel spans (lidar deck 15–16 m wide)
const HW_PAR = 7.7    // inside face of the approach parapets

/** The river trusses: bearing ends (y), panels, and top-chord tops above the walkway at the inner panel points. */
const SIDE = [7.9, 8.8, 9.6, 9.6, 8.8, 7.9]
const SPANS: { y0: number; y1: number; h: number[] }[] = [
  { y0: -68, y1: -21, h: SIDE },
  { y0: -13, y1: 77, h: [9.2, 11.3, 13.0, 13.8, 14.5, 14.8, 14.8, 14.5, 13.8, 13.0, 11.3, 9.2] },
  { y0: 86, y1: 133, h: SIDE },
]
/** Piers on the straight: y, kind. */
const P0 = -69.5, P1 = -17, P2 = 81.5, P3 = 135.5, P4 = 173.5
const DECK_TRUSS: [number, number] = [137, 172]

function build(detail: boolean) {
  const steel = new Part(), concrete = new Part(), walk = new Part(), glass = new Part(), lamps = new Part()
  const k = detail ? 1 : 1.35   // the low model draws the steel a little bolder

  // Trusses.
  for (const sp of SPANS) {
    const n = sp.h.length + 1, ys = stations(sp.y0, sp.y1, (sp.y1 - sp.y0) / n)
    const centre = sp.h.length > 8
    const side = (s: number) => {
      const x = XC + s * TX
      const B = ys.map((y) => [x, y, roadY(y) - 0.55] as V3)
      const T = ys.map((y, i) => (i === 0 || i === n ? B[i] : ([x, y, roadY(y) + sp.h[i - 1] - 0.4] as V3)))
      return { B, T }
    }
    const L = side(-1), R = side(1)
    for (const { B, T } of [L, R]) {
      for (let i = 0; i < n; i++) {
        bar(steel, B[i], B[i + 1], 0.55 * k, 0.8 * k)
        bar(steel, T[i], T[i + 1], 0.65 * k, 0.65 * k)
      }
      for (let i = 1; i < n; i++) bar(steel, B[i], T[i], 0.45 * k, 0.4 * k, [0, 1, 0])
      for (let i = 1; i < n - 1; i++) {
        const mid = (n - 1) / 2
        const pairs: [V3, V3][] = i < mid ? [[T[i], B[i + 1]]] : i > mid ? [[T[i + 1], B[i]]] : [[T[i], B[i + 1]], [T[i + 1], B[i]]]
        for (const [a, b] of pairs) {
          bar(steel, a, b, 0.42 * k, 0.32 * k, [0, 0, 1])
          // Pennsylvania sub-struts on the big span: half-height verticals and sub-diagonals.
          if (centre && detail && i !== mid) {
            const m: V3 = mul(add(a, b), 0.5)
            const ym = m[1], bot: V3 = [m[0], ym, roadY(ym) - 0.55]
            bar(steel, bot, m, 0.3 * k, 0.28 * k, [0, 1, 0])
            const far = i < mid ? T[i + 1] : T[i]
            if (detail) bar(steel, m, far, 0.3, 0.26, [0, 0, 1])
          }
        }
      }
    }
    // Top struts at every inner panel point, the portals over the end posts.
    for (let i = 1; i < n; i++) bar(steel, L.T[i], R.T[i], 0.4 * k, 0.6 * k, [0, 1, 0])
    for (const [i0, i1] of [[0, 1], [n, n - 1]]) {
      const f = 0.72, a = add(L.B[i0], mul(sub(L.T[i1], L.B[i0]), f)), b = add(R.B[i0], mul(sub(R.T[i1], R.B[i0]), f))
      bar(steel, a, b, 0.35 * k, 1.5, sub(L.T[i1], L.B[i0]))
    }
    if (detail) for (let i = 1; i < n - 1; i++) {
      // top lateral bracing and the floor beams
      bar(steel, L.T[i], R.T[i + 1], 0.22, 0.22, [0, 0, 1])
      bar(steel, R.T[i], L.T[i + 1], 0.22, 0.22, [0, 0, 1])
    }
    if (detail) for (let i = 0; i <= n; i++) bar(steel, [XC - TX, ys[i], roadY(ys[i]) - 1.0], [XC + TX, ys[i], roadY(ys[i]) - 1.0], 0.35, 1.1, [0, 1, 0])
  }

  // The deck truss east of the river (a Warren with verticals under the walkway).
  {
    const [y0, y1] = DECK_TRUSS, ys = stations(y0, y1, (y1 - y0) / 6)
    for (const s of [-1, 1]) {
      const x = XC + s * TX
      const T = ys.map((y) => [x, y, roadY(y) - 0.7] as V3), B = ys.map((y) => [x, y, roadY(y) - 4.0] as V3)
      for (let i = 0; i < 6; i++) {
        bar(steel, T[i], T[i + 1], 0.5 * k, 0.6 * k); bar(steel, B[i], B[i + 1], 0.5 * k, 0.6 * k)
        bar(steel, i % 2 ? T[i] : B[i], i % 2 ? B[i + 1] : T[i + 1], 0.4 * k, 0.3 * k, [0, 0, 1])
      }
      for (let i = 0; i <= 6; i++) bar(steel, B[i], T[i], 0.4 * k, 0.35 * k, [0, 1, 0])
    }
  }

  // Deck: the steel floor on the river spans and the deck truss, the walkway on top.
  const uS0 = uOfY(P0 - 3.6), uS1 = uOfY(P4 - 2.4)
  const steelProf = (u: number): [number, number][] => {
    const r = road(u)
    return [[-HW_DECK, r], [-HW_DECK, r - 0.45], [-TX - 0.3, r - 0.45], [-TX - 0.3, r - 1.6], [TX + 0.3, r - 1.6], [TX + 0.3, r - 0.45], [HW_DECK, r - 0.45], [HW_DECK, r]]
  }
  sweep(steel, us(uS0, uS1, 8, SPANS.flatMap((s) => [uOfY(s.y0), uOfY(s.y1)])), steelProf)
  for (const u of [uS0, uS1]) {
    const pr = steelProf(u), { p: c, t } = at(u), N: [number, number] = [t[1], -t[0]]
    const P = pr.map(([dx, z]) => [c[0] + N[0] * dx, c[1] + N[1] * dx, z] as V3), dir = u === uS0 ? -1 : 1
    fan(steel, P, [t[0] * dir, t[1] * dir, 0])
  }

  // The concrete approaches: parapets, fascias, and arched soffits between bents.
  const westBents = stations(0, uOfY(P0), uOfY(P0) / 14)
  const uOut = uOfY(Y_OUT)
  const eastBents = [...stations(uOfY(P4), uOut, (uOut - uOfY(P4)) / 6), ...stations(uOut, UEND, 13.8).slice(1)]
  const archSoffit = (u: number, bents: number[]) => {
    let i = 1
    while (i < bents.length - 1 && bents[i] < u) i++
    const a = bents[i - 1], b = bents[i], t = Math.min(1, Math.max(0, (u - a) / (b - a)))
    return road(u) - 3.2 + 2.0 * Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2))
  }
  const concProf = (bents: number[]) => (u: number): [number, number][] => {
    const r = road(u), { p: c, t } = at(u), N: [number, number] = [t[1], -t[0]]
    const soffAt = (dx: number) => Math.min(r - 0.3, Math.max(archSoffit(u, bents), ground(c[0] + N[0] * dx, c[1] + N[1] * dx)))
    return [[-HW_PAR, r], [-HW_PAR, r + 1.05], [-HW_DECK, r + 1.05], [-HW_DECK, soffAt(-HW_DECK)], [0, soffAt(0)], [HW_DECK, soffAt(HW_DECK)], [HW_DECK, r + 1.05], [HW_PAR, r + 1.05], [HW_PAR, r]]
  }
  const bentsW = westBents, bentsE = eastBents
  sweep(concrete, us(0, uS0, detail ? 2.5 : 4.9, [U[1], U[2], ...bentsW]), concProf(bentsW))
  // the low model takes each east bay in two (bent, crown, bent) to stay under 250 KB
  const halves = [...new Set([uS1, ...bentsE.flatMap((u, i) => (i ? [(bentsE[i - 1] + u) / 2, u] : [u]))])].sort((p, q) => p - q)
  sweep(concrete, detail ? us(uS1, UEND, 2.3, bentsE) : halves, concProf(bentsE))
  for (const [u, dir, bents] of [[0, -1, bentsW], [UEND, 1, bentsE], [uS0, 1, bentsW], [uS1, -1, bentsE]] as [number, number, number[]][]) {
    const pr = concProf(bents)(u), { p: c, t } = at(u), N: [number, number] = [t[1], -t[0]]
    const P = pr.map(([dx, z]) => [c[0] + N[0] * dx, c[1] + N[1] * dx, z] as V3), n: V3 = [t[0] * dir, t[1] * dir, 0]
    face(concrete, P[2], P[3], P[5], P[6], n)   // the end face of the deck girder
  }
  // Bent columns.
  for (const u of [...westBents.slice(0, -1), ...eastBents.slice(1)]) {
    const { p: c, t } = at(u), N: [number, number] = [t[1], -t[0]]
    for (const s of [-1, 1]) {
      const x = c[0] + N[0] * s * 5, y = c[1] + N[1] * s * 5
      const zt = road(u) - 3.2, zg = ground(x, y) - 0.3
      if (zt - zg > 0.8) bar(concrete, [x, y, zg], [x, y, zt], 1.3, 1.3, [t[0], t[1], 0])
    }
  }

  // Walkway surface over the whole bridge.
  sweep(walk, us(0, UEND, 6, [U[1], U[2], U[3], uS0, uS1]), (u) => {
    const w = u > uS0 && u < uS1 ? HW_DECK : HW_PAR
    return [[w, road(u)], [-w, road(u)]] as [number, number][]
  })

  // Piers.
  for (const yc of [P1, P2]) {
    const top = roadY(yc) - 1.6
    pier(concrete, yc, 6.6, 3.6, 1.2, 11.3, top - 2.9, top, detail ? 12 : 6)
    block(concrete, XC - 6.95, XC + 6.95, yc - 4.65, yc + 4.65, 0, 11.3)            // the river base, a ledge wider
    block(concrete, XC - 7.0, XC + 7.0, yc - 4.6, yc + 4.6, top - 0.9, top, true)       // cap
    // the overlooks either side, on the pier
    for (const s of [-1, 1]) {
      const [x0, x1] = s < 0 ? [XC - 10.5, XC - HW_DECK] : [XC + HW_DECK, XC + 10.5], r = roadY(yc)
      block(steel, x0, x1, yc - 4.5, yc + 4.5, r - 0.45, r, true, false)
      face(walk, [x0, yc - 4.5, r], [x1, yc - 4.5, r], [x1, yc + 4.5, r], [x0, yc + 4.5, r], [0, 0, 1])
    }
  }
  for (const yc of [P0, P3]) {
    const top = roadY(yc) - 1.6
    pier(concrete, yc, 6.6, 3.6, 1.4, null, top - 2.9, top, detail ? 12 : 6)
    block(concrete, XC - 7.0, XC + 7.0, yc - 3.9, yc + 3.9, top - 0.9, top, true)
  }
  {
    const top = roadY(P4) - 4.0
    pier(concrete, P4, 6.6, 2.4, 1.0, null, top - 2.2, top, detail ? 12 : 6)
    block(concrete, XC - 7.0, XC + 7.0, P4 - 2.7, P4 + 2.7, top - 0.8, roadY(P4) - 0.3, true)
  }

  // The elevator tower at the east landing (2003), green glass with a concrete cap, and its landing.
  {
    const x0 = XC + 8.3, x1 = XC + 12.3, y0 = 179, y1 = 183, zg = Math.min(ground(x0, y0), ground(x1, y1)) - 0.3
    block(glass, x0, x1, y0, y1, zg, 29.3, false, false)
    block(concrete, x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, 29.3, 30.3)
  }

  if (detail) {
    // Railings along the steel spans' edges; lamp beads on the parapets every 12 m.
    const ur = us(uS0, uS1, 3)
    for (const s of [-1, 1]) {
      const pts = ur.map((u) => { const { p: c, t } = at(u); return [c[0] + t[1] * s * (HW_DECK - 0.1), c[1] - t[0] * s * (HW_DECK - 0.1), road(u)] as V3 })
      for (let i = 0; i < pts.length - 1; i++) bar(steel, add(pts[i], [0, 0, 1.1]), add(pts[i + 1], [0, 0, 1.1]), 0.12, 0.12)
      for (const q of pts) bar(steel, q, add(q, [0, 0, 1.1]), 0.1, 0.1, [1, 0, 0])
      for (const u of stations(0, UEND, 12)) {
        const { p: c, t } = at(u)
        bead(lamps, [c[0] + t[1] * s * (HW_DECK - 0.2), c[1] - t[0] * s * (HW_DECK - 0.2), road(u) + 1.3], 0.25)
      }
    }
  }
  return { steel, concrete, walk, glass, lamps }
}

if (import.meta.main) {
  const lit = (p: V3, n: V3) => (p[2] > roadY(Math.min(Math.max(p[1], -70), 256)) - 0.3 ? (n[2] > 0.7 ? 0.5 : 0.95) : 0.35)
  const STEEL = { ...finish('painted-steel', 0xe2e5e4), floodlight: lit }
  const CONCRETE = { ...finish('bridge-concrete', 0xd6d0c6), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.7) }
  const WALK = finish('walkway', 0xc4bdb1)
  const GLASS = { name: 'glass', color: 0x6f9e8e, roughness: 0.3 }
  const LAMP = { name: 'lamp', color: 0xd9d6cf, roughness: 0.6 }
  const low = build(false), det = build(true)
  await writeBoth('nash-seigenthaler-bridge', 'John Seigenthaler Pedestrian Bridge', [
    { part: low.steel, material: STEEL },
    { part: low.concrete, material: CONCRETE },
    { part: low.walk, material: WALK },
    { part: low.glass, material: GLASS },
  ], [
    { part: det.steel, material: STEEL },
    { part: det.concrete, material: CONCRETE },
    { part: det.walk, material: WALK },
    { part: det.glass, material: GLASS },
    { part: det.lamps, material: LAMP },
  ], {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river',
    bearing: 47.4, elevation: 0,
    walkway: { westEnd: road(0), riverSpans: roadY(30), eastEnd: road(UEND) },
  })
}
