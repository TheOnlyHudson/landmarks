/**
 * Center Street Swing Bridge (1901; King Bridge Company) — procedural,
 * CC0-1.0, no textures. bun generators/cle-center-street-bridge.ts
 *
 * Cleveland's last working swing bridge: a bobtail (unequal-arm) through
 * truss, painted red, turning on a round pivot pier on the west bank; a
 * long arm over the channel to the east bank under the Detroit–Superior
 * Bridge and a short arm on the west; a camelback top chord rising from
 * the ends to a tall two-panel tower over the pivot, crowned by a railed
 * platform; posts with crossed diagonals in every panel, overhead struts,
 * portal bracing at the inclined end posts; the operator's house on the
 * north truss over the pivot; sidewalk railings outside the trusses. Drawn
 * closed, as it sits for road traffic.
 *
 * Frame: x across, y along the bearing (284.8°, the roadway way/55553308
 * from its east to its west node, +y toward the west bank), z up, metres;
 * origin at the roadway way's midpoint, on the river (174.5 m NAVD88,
 * Mapterhorn and lidar agree). elevation 0.
 *
 * Roadway heights built to (rework, Nov 2026; tools/bridge_ele.py measure
 * 55553308 --every 5, lidar lower quartile, minus the river's 174.5 m):
 * 5.4 m over the pivot (179.85-179.94 m NAVD88; the earlier 4.9 m was
 * low), the arms drooping to 4.8 m at the west end of the span (y = +34)
 * and 5.0 m at y = -26; east of that the Detroit-Superior deck hides the
 * road from the lidar, and 4.6 m at the east end is extrapolated (it agrees
 * with the bare earth climbing to 177.9 m on the east approach, way
 * 1047446851, 15 m beyond the end). The west approach lands at 4.4 m at the
 * way's west node 698227981 (178.91 m, on the bare earth). The bottom
 * chords, sidewalk fascias and deck underside follow this profile. Most
 * centre-line readings have a wide spread (overhead bracing within 1.5 m);
 * the clean ones are 179.85 m at y = +14 and 179.83 m at y = +4. The way
 * carries no ele; the values to give the map are in
 * ~/landmarks-scratch/osm-ele/cle-center-street-bridge.osc and .md. No road
 * surface or sidewalk surface is drawn: the map draws the roadway and the
 * sidewalk footway way/1309021863.
 *
 * Ends (rework). The bridge way runs from y = -44 (east end of the span, on
 * the east rest pier at the bank's edge) to y = +44 (where the road lands on
 * the west bank). The east rest pier is now a concrete abutment across the
 * deck from y = -48 to -43, its top 0.95 m under the roadway, its feet on the
 * map's terrain (`GROUND`, Mapterhorn, 2.5 m table in this frame); the west
 * rest pier runs on as the approach's abutment to y = +44 with the
 * sidewalk fascias and railings on it, so nothing stops in the air.
 *
 * Placement: OSM maps no man_made=bridge outline and no building here, so
 * `replaces` is empty; the roadway way/55553308 (bridge=movable, swing,
 * wikidata Q122226796) is left to the map.
 *
 * Sources:
 * - Lidar, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019), 0.5 m grid: truss
 *   planes at x = ±4.75; the top chord 10.8 m above the river at the east
 *   end post, 13-14 m along the long arm, 19.2 m over y = 3.5-12.5 (the
 *   tower), 12 m at the west end post; the span from y = -44 (east rest pier
 *   at the bank) to +35.5; the operator's house at x = -8 to -5, 11-12 m;
 *   the west bank about 1.5-2.5 m above the water.
 * - Published: Wikipedia "Center Street Bridge (Cleveland)"; HAER OH-10:
 *   swing bridge of 1901, rebuilt on the old substructure; one of the
 *   movable bridges of the Flats; opens toward oncoming ships.
 * - Photos (Wikimedia Commons): "Center Street Bridge.jpg", "Bridge in the
 *   Cleveland Flats (9234075538)", "Cleveland Bridges in the Flats" (Erik
 *   Drost, CC BY 2.0): the end portals, the tower, the lattice web, the
 *   operator's house; "Center Street Bridge swung open - Cleveland, Ohio
 *   (2013)" (Ralf Peter Reimann, CC BY-SA 2.0) and "Cuyahoga River Center
 *   Street swing bridge" (Cards84664, CC BY-SA 4.0): side elevations, the
 *   unequal arms and the pivot drum; "Center Street Swing Bridge in
 *   Cleveland, Ohio." (tygerdsebat, CC BY-SA 2.0): from above; HAER
 *   OH-10 "OBLIQUE VIEW" (Jet Lowe, public domain); "Flats - 7
 *   (13967146264)" (k_e_lewis, CC BY 2.0): at night, lit only by street
 *   lamps, so nothing is floodlit.
 *
 * Estimated: the panel layout (10 panels on the long arm, 2 in the tower,
 * 4 on the short arm, from the photos), member sizes, the pivot drum's
 * radius (6.2 m), the rest piers' and abutments' plans, the house's size and windows, the
 * platform railing on the tower.
 * Colour: red paint (#b8432f in sun) pulled to #b5503d; concrete #c9c3b8.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { chamferedRect, face, footedLoft, groundAt, piecewise, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

// Frame: y along the bearing (284.8°, toward the west bank), x across, z above the river (174.5 m NAVD88).
// Map terrain (Mapterhorn) minus 174.5 m, 2.5 m apart in this frame (x across from -10 to +10, y along from -52 to +48).
const GROUND: GroundGrid = {"y0":-52,"x0":-10,"step":2.5,"z":[[1.5,1.6,1.7,2.1,2.4,2.4,2,1.7,1.4],[1.4,1.5,1.3,1.2,1.5,1.5,1.2,1,0.8],[1.2,1.1,0.8,0.6,0.6,0.6,0.4,0.3,0.2],[0.6,0.4,0.2,0.1,0.1,0.1,0,0,0],[0.1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0.1,0.1,0.2,0.3,0.3,0.4,0.3,0.3,0.4],[0.8,1,1.1,1.3,1.3,1.3,1.2,1.3,1.3],[1.3,1.3,1.4,1.4,1.4,1.4,1.3,1.3,1.4],[1.4,1.3,1.4,1.4,1.4,1.4,1.4,1.3,1.5],[1.5,1.3,1.4,1.4,1.4,1.4,1.4,1.4,1.6],[1.6,1.4,1.4,1.4,1.4,1.4,1.4,1.6,1.8],[1.8,1.6,1.6,1.5,1.5,1.6,1.6,1.8,1.9],[2,1.8,1.8,1.8,1.8,1.8,1.8,2,2.1],[2.1,2,2,2,2,2,2.1,2.1,2.2],[2.1,2.1,2.2,2.2,2.2,2.2,2.2,2.3,2.3],[2.2,2.3,2.3,2.3,2.3,2.4,2.4,2.4,2.4],[2.4,2.4,2.4,2.4,2.5,2.5,2.5,2.5,2.5],[2.5,2.5,2.5,2.5,2.6,2.6,2.6,2.6,2.6],[2.7,2.7,2.7,2.8,2.9,2.9,2.9,2.7,2.7],[2.8,2.7,3.1,3.4,3.5,3.5,3.1,2.8,2.8],[3.5,3.2,3.7,4.2,4.2,4.2,3.8,3.3,3.5],[4.5,4.3,4.5,4.5,4.5,4.5,4.4,4.4,4.4],[4.7,4.6,4.5,4.4,4.4,4.4,4.4,4.4,4.3],[4.7,4.6,4.5,4.4,4.4,4.4,4.4,4.4,4.4],[4.7,4.6,4.5,4.4,4.5,4.5,4.5,4.5,4.5]]}
const gnd = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))
const PIVOT_Y = 8.0
// Roadway on the centre line, lidar (tools/bridge_ele.py measure 55553308 --every 5, lower quartile,
// minus the river's 174.5 m): the arms droop from 5.4 m over the pivot to 4.8 m at the west end and
// about 4.6 m at the east end (under the Detroit–Superior deck, extrapolated), then the west approach
// lands at 4.4 m.
const road = piecewise([[-44, 4.6], [-26, 5.02], [-16, 5.31], [-6, 5.4], [9, 5.42], [14, 5.35], [24, 5.08], [34, 4.76], [44, 4.41]])
const ROAD = road(PIVOT_Y)                // deck level over the pivot
const YL = 44.0                         // where the west approach lands (the road way's west node)
const PIVOT = PIVOT_Y                  // the pivot pier's centre, on the west bank
const YE = -44.0, YW = 35.5           // the swing span's ends: east (over the channel, long arm) and west (short arm)
const XT = 4.75                       // truss planes
const WALK = 6.7                      // sidewalk railings
// Camelback top chord from lidar, highest over the pivot.
const TOP = piecewise([[YE + 4, 10.8], [-30, 11.8], [-20, 13.0], [-8, 14.3], [0, 16.0], [3.5, 19.2], [12.5, 19.2], [16, 17.0], [20, 15.0], [28, 13.0], [YW - 3.5, 12.0]])
const TOP_E = YE + 4, TOP_W = YW - 3.5

/** A square-section member from a to b. */
function beam(p: Part, a: V3, b: V3, w: number, d: number) {
  const t = norm(sub(b, a))
  let S = cross(t, [0, 0, 1]); if (Math.hypot(...S) < 1e-3) S = [1, 0, 0]
  S = norm(S); const U = norm(cross(S, t)), s = mul(S, w / 2), u = mul(U, d / 2)
  const q = (o: V3): V3[] => [sub(sub(o, s), u), add(sub(o, s), u), add(add(o, s), u), sub(add(o, s), u)]
  const A = q(a), B = q(b), ns: V3[] = [mul(S, -1), U, S, mul(U, -1)]
  for (let i = 0; i < 4; i++) face(p, A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i], ns[i])
  face(p, A[0], A[1], A[2], A[3], mul(t, -1)); face(p, B[0], B[1], B[2], B[3], t)
}
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

const red = new Part(), conc = new Part(), house = new Part(), glass = new Part()
const SIDES = [-1, 1]
// Panel points: ten panels on the long (east) arm, the two-panel tower over the pivot, four on the short arm.
const pts = [
  ...Array.from({ length: 10 }, (_, i) => TOP_E + ((3.5 - TOP_E) * i) / 10),
  3.5, PIVOT, 12.5,
  ...Array.from({ length: 4 }, (_, i) => 12.5 + ((TOP_W - 12.5) * (i + 1)) / 4),
]
const zb = (y: number) => road(y) - 0.3
const along = [YE, ...pts, YW].sort((a, b) => a - b)

for (const sd of SIDES) {
  const x = sd * XT, n: V3 = [sd, 0, 0]
  // Bottom chord along the deck, top chord along the camelback, inclined end posts.
  for (let i = 0; i < along.length - 1; i++) beam(red, [x, along[i], zb(along[i])], [x, along[i + 1], zb(along[i + 1])], 0.7, 0.9)
  for (let i = 0; i < pts.length - 1; i++) beam(red, [x, pts[i], TOP(pts[i])], [x, pts[i + 1], TOP(pts[i + 1])], 0.8, 0.8)
  beam(red, [x, YE, zb(YE)], [x, TOP_E, TOP(TOP_E)], 0.8, 0.8)
  beam(red, [x, YW, zb(YW)], [x, TOP_W, TOP(TOP_W)], 0.8, 0.8)
  // Posts and crossed diagonals in every panel (the lattice the photos show).
  pts.forEach((y, i) => {
    if (i > 0 && i < pts.length - 1) strip(red, [x, y, zb(y) + 0.4], [x, y, TOP(y) - 0.4], Math.abs(y - PIVOT) < 5 ? 0.9 : 0.5, n)
    if (i < pts.length - 1) {
      const y2 = pts[i + 1]
      strip(red, [x, y, zb(y) + 0.4], [x, y2, TOP(y2) - 0.4], 0.35, n)
      strip(red, [x, y, TOP(y) - 0.4], [x, y2, zb(y2) + 0.4], 0.35, n)
    }
  })
  // Sidewalk outside the truss: its fascia and railing.
  for (let i = 0; i < along.length - 1; i++) {
    const a = along[i], b = along[i + 1]
    face(red, [sd * WALK, a, road(a) + 1.1], [sd * WALK, b, road(b) + 1.1], [sd * WALK, b, road(b) - 0.9], [sd * WALK, a, road(a) - 0.9], n)
  }
  // On the west approach, from the span's end to where it lands: the concrete fascia and the railing.
  face(conc, [sd * WALK, YW, road(YW) - 0.9], [sd * WALK, YL, road(YL) - 0.9], [sd * WALK, YL, road(YL) + 0.2], [sd * WALK, YW, road(YW) + 0.2], n)
  face(red, [sd * WALK, YW, road(YW) + 1.1], [sd * WALK, YL, road(YL) + 1.1], [sd * WALK, YL, road(YL) + 0.2], [sd * WALK, YW, road(YW) + 0.2], n)
}
// Overhead struts at every second panel point, and portal bracing at the ends.
pts.forEach((y, i) => { if (i % 2 === 0 && TOP(y) > ROAD + 6.5) beam(red, [-XT, y, TOP(y) - 0.3], [XT, y, TOP(y) - 0.3], 0.4, 0.5) })
for (const y of [TOP_E + 0.6, TOP_W - 0.6]) {
  beam(red, [-XT, y, TOP(y) - 0.4], [XT, y, TOP(y) - 0.4], 0.7, 0.9)
  beam(red, [-XT, y, TOP(y) - 2.2], [XT, y, TOP(y) - 2.2], 0.4, 0.5)
}
// The railed platform on top of the tower.
for (const sd of SIDES) beam(red, [sd * XT, 3.5, 20.4], [sd * XT, 12.5, 20.4], 0.15, 0.15)
for (const y of [3.5, 12.5]) beam(red, [-XT, y, 20.4], [XT, y, 20.4], 0.15, 0.15)
// Deck underside (floor beams and stringers read as one plate), from rest pier to rest pier.
for (let i = 0; i < along.length - 1; i++) {
  const a = along[i], b = along[i + 1]
  face(red, [-WALK, a, road(a) - 0.9], [WALK, a, road(a) - 0.9], [WALK, b, road(b) - 0.9], [-WALK, b, road(b) - 0.9], [0, 0, -1])
}
// The operator's house, on the north truss over the pivot.
box(house, -XT - 3.4, -XT - 0.5, PIVOT - 3.2, PIVOT + 3.2, ROAD + 2.6, ROAD + 6.2)
face(house, [-XT - 3.7, PIVOT - 3.5, ROAD + 6.2], [-XT - 0.3, PIVOT - 3.5, ROAD + 6.2], [-XT - 0.3, PIVOT + 3.5, ROAD + 6.2], [-XT - 3.7, PIVOT + 3.5, ROAD + 6.2], [0, 0, 1])
face(glass, [-XT - 3.43, PIVOT - 2.4, ROAD + 4.2], [-XT - 3.43, PIVOT + 2.4, ROAD + 4.2], [-XT - 3.43, PIVOT + 2.4, ROAD + 5.6], [-XT - 3.43, PIVOT - 2.4, ROAD + 5.6], [-1, 0, 0])
for (const s of [-1, 1]) face(glass, [-XT - 3.0, PIVOT + s * 3.23, ROAD + 4.2], [-XT - 0.9, PIVOT + s * 3.23, ROAD + 4.2], [-XT - 0.9, PIVOT + s * 3.23, ROAD + 5.6], [-XT - 3.0, PIVOT + s * 3.23, ROAD + 5.6], [0, s, 0])
beam(red, [-XT - 2.0, PIVOT - 2.5, ROAD - 0.8], [-XT - 2.0, PIVOT - 2.5, ROAD + 2.6], 0.4, 0.4)
beam(red, [-XT - 2.0, PIVOT + 2.5, ROAD - 0.8], [-XT - 2.0, PIVOT + 2.5, ROAD + 2.6], 0.4, 0.4)
// The pivot pier: a round drum on the bank under the turntable, and the rest piers at the ends.
{
  const R = 6.2, N = 16, z1 = ROAD - 1.0
  for (let k = 0; k < N; k++) {
    const a0 = (2 * Math.PI * k) / N, a1 = (2 * Math.PI * (k + 1)) / N
    const p0: V3 = [R * Math.cos(a0), PIVOT + R * Math.sin(a0), 0], p1: V3 = [R * Math.cos(a1), PIVOT + R * Math.sin(a1), 0]
    const am = (a0 + a1) / 2, nn: V3 = [Math.cos(am), Math.sin(am), 0]
    face(conc, p0, p1, [p1[0], p1[1], z1], [p0[0], p0[1], z1], nn)
    conc.tri([0, PIVOT, z1], [p0[0], p0[1], z1], [p1[0], p1[1], z1])
  }
  // The east rest pier and abutment at the bank's edge, its face where the deck ends, and the west
  // rest pier running on as the approach's abutment to where the road lands; feet on the map's terrain.
  for (const [y0, y1] of [[YE - 4.0, YE + 1.0], [YW - 1.0, YL]]) {
    const top = Math.min(road(y0), road(y1)) - 0.95
    footedLoft(conc, gnd, [
      { plan: chamferedRect(-WALK - 0.3, WALK + 0.3, y0, y1, 0), z: 'ground' },
      { plan: chamferedRect(-WALK - 0.3, WALK + 0.3, y0, y1, 0), z: top },
    ], 2.5)
  }
}

const RED: MaterialSpec = { ...finish('bridge-red', 0xb5503d), doubleSided: true }
const CONC: MaterialSpec = finish('pier-concrete', 0xc9c3b8)
const HOUSE: MaterialSpec = finish('operator-house', 0xa9503f)
const WIN: MaterialSpec = { name: 'window', color: 0x64798a, roughness: 0.35 }
const parts = [{ part: red, material: RED }, { part: conc, material: CONC }, { part: house, material: HOUSE }, { part: glass, material: WIN }]
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('Center Street Swing Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the midpoint of the roadway way/55553308, on the river (174.5 m NAVD88)',
  bearing: 284.8, elevation: 0, roadway: ROAD, pivot: PIVOT,
})
await Bun.write(new URL('../models/cle-center-street-bridge.glb', import.meta.url), glb)
console.log(`cle-center-street-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
