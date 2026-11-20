/**
 * B&O Railroad Bridge 464 (Scherzer rolling-lift bascule, "the
 * Jackknife"; left permanently raised) — procedural, CC0-1.0, no textures.
 * bun generators/cle-bo-bridge-464.ts
 *
 * The single-leaf Scherzer rolling-lift railroad bascule near the mouth of
 * the Cuyahoga, abandoned and left raised, drawn in that pose as lidar and
 * every photo show it: a tapered through truss, deepest at the heel, its
 * deck chord standing at about 53° and its top chord at 45°, meeting at the
 * tip in a short end member that now lies level; posts square to the deck
 * chord with one diagonal per panel; overhead struts; the curved rolling
 * segments under the heel, on the east bank's track girder; the top chord
 * carried on back past the heel to the counterweight, hung low behind with
 * its frame down to the track. Weathered dark steel, unlit.
 *
 * Frame: x across, y along the bearing (99.44°, the OSM outline's axis,
 * +y toward the east bank where the heel is), z up, metres; origin at the
 * outline's centroid, on the river (174.5 m NAVD88 on Mapterhorn; lidar's
 * lowest return 174.85 m). elevation 0.
 *
 * Ends and heights (rework, Nov 2026). The leaf is raised for good, so it
 * carries no track and the map draws no deck here (the track way is in
 * `replaces`); no ele tags are needed (see ~/landmarks-scratch/osm-ele/
 * cle-bo-bridge-464.md). The leaf ends where it rests: the heel's rolling
 * segments on the east bank's heel pier and track girder, now footed on
 * the map's terrain (`GROUND`, Mapterhorn, 2.5 m table in this frame, 1-2.8 m
 * over the river) from the bulkhead in the water at y = 0 to y = 38, past the OSM track's
 * end at y = 28, its top 3.6 m over the river. Closed, the 74 m leaf would
 * reach the west bank at y = -64, where the track way 98646602 ends on land;
 * that rest pier lies outside the outline and is not drawn.
 *
 * Sources:
 * - OSM: outline way/1320181493 (man_made=bridge, bridge=movable, "B&O
 *   #464", 70 m x 7 m, the leaf's closed footprint); the abandoned track
 *   way/98646602 (bridge=movable, layer 1, wikidata Q122226954) runs across
 *   it, and is listed in `replaces` so the map doesn't draw a closed deck
 *   across the river under the raised leaf.
 * - Lidar, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019), 0.5 m grid: the
 *   upper envelope of the leaf rises along z + y = 42 m (45°) from the heel
 *   (y = 34, z = 7) to y = -22, z = 64; a level plateau at 64-65 m from
 *   y = -22 to -34 (the tip's end member); a second line through (-14, 37)
 *   and (-34, 64) (the deck chord, 53°), which meets the bank at about
 *   (10, 5); the truss planes at x = ±3.1; members either side of the heel
 *   at x = ±4.5, z 14-16; the rolling pit 2 m below the bank. The deck
 *   chord's length, 74 m, agrees with the outline's 70 m.
 * - NAIP (public domain): the bank and the leaf's plan.
 * - Photos (Wikimedia Commons): "Cleveland September - 29 (21094972974)"
 *   and "Cleveland November - 27 (22876906854)" (k_e_lewis, CC BY 2.0): the
 *   leaf from the river: taper, panel layout, the heel frame and the
 *   counterweight; "Flats East Bank (20396076934)" and "Downtown Cleveland -
 *   The Flats (46548161485)" (Erik Drost, CC BY 2.0): the leaf from the
 *   east bank's side and at night (unlit).
 *
 * Estimated: the panel count (6, from the photos), member sizes (drawn bold:
 * chords 1.1 x 1.2 m), the rolling segment's radius (8 m) and centre, the
 * counterweight's size and place (a block 9 x 7.5 m under the top chord's
 * back end, from the photos), the track girder and bank pier. The heel's
 * machinery and the operator's house are left out.
 * Colour: the leaf's dark rusted paint (#3f3833 in the photos), drawn at
 * the charcoal limit as #564c45; concrete #bdb7ad.
 *
 * Doubts: which bank the heel is on was read from lidar (the leaf rises
 * from the east bank toward the west); the photos are consistent with it
 * but none is a clean side elevation. Chris Light's "Jackknife" photos on
 * Commons show other raised bridges in the Flats (#463 and others), not
 * this one, and were not used.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { chamferedRect, face, footedLoft, groundAt, type GroundGrid } from './bridge-kit'

// Map terrain (Mapterhorn) minus the river's 174.5 m, 2.5 m apart in this frame (x across -10..10, y along -5..45).
const GROUND: GroundGrid = {"y0":-5,"x0":-10,"step":2.5,"z":[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0.1],[0,0.1,0,0,0,0,0.1,0.3,0.8],[1,0.9,0.4,0.2,0.2,0.4,0.6,1,1.6],[1.9,1.8,0.9,0.9,1.3,1.1,1.2,1.5,1.8],[2.4,2.3,1.2,1.2,2.3,1.7,2.1,2.4,2.3],[2.7,2.5,1.5,1.3,2.4,1.7,2.3,2.5,2.4],[2.7,2.5,1.6,1.1,2.3,1.7,2.5,2.6,2.4],[2.7,2.5,1.8,1.4,2.4,1.9,2.7,2.6,2.4],[2.8,2.6,1.8,1.4,2.5,1.6,2.5,2.6,2.4],[2.8,2.7,1.9,1.5,2.6,1.8,2.5,2.6,2.4],[2.8,2.7,2.3,2,2.7,2.3,2.7,2.6,2.4],[2.8,2.7,2.5,2.5,2.9,2.6,2.6,2.5,2.4],[2.8,2.7,2.5,2.5,2.8,2.7,2.6,2.5,2.4],[2.8,2.7,2.7,2.7,2.9,2.7,2.6,2.5,2.4],[2.8,2.7,2.7,2.7,2.9,2.7,2.7,2.5,2.4],[2.8,2.8,2.8,2.8,2.9,2.7,2.6,2.5,2.4],[2.7,2.7,2.8,2.8,2.7,2.6,2.5,2.4,2.4],[2.6,2.7,2.8,2.8,2.7,2.6,2.5,2.4,2.4],[2.6,2.7,2.8,2.8,2.7,2.6,2.5,2.4,2.4],[2.6,2.7,2.8,2.8,2.7,2.5,2.5,2.4,2.4]]}
const gnd = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))
import { finish } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

// The leaf, raised, as lidar shows it (y along the bearing, z above the river). The leaf is a tapered
// truss, deepest at the heel: in the closed position its deck (lower) chord was level and its top chord
// sloped down to the tip. Raised, the deck chord stands at 53°, the top chord at 45°.
const DH: [number, number] = [10.0, 5.0]       // deck chord at the heel (on the rolling segment)
const DT: [number, number] = [-34.0, 64.0]     // deck chord at the tip
const TT: [number, number] = [-22.0, 64.0]     // top chord at the tip (the tip's end member lies level)
const TE: [number, number] = [34.0, 8.0]       // top chord's back end, over the counterweight
const XT = 3.1                                  // truss planes
const PANELS = 6
const dlen = Math.hypot(DT[0] - DH[0], DT[1] - DH[1])
const dd: [number, number] = [(DT[0] - DH[0]) / dlen, (DT[1] - DH[1]) / dlen]
const dn: [number, number] = [-dd[1] * -1, -dd[0]].map((v) => v) as [number, number]
/** The deck chord at t (0 heel .. 1 tip), and the top chord met by a line square to the deck chord from there. */
const D = (t: number): [number, number] => [DH[0] + (DT[0] - DH[0]) * t, DH[1] + (DT[1] - DH[1]) * t]
const nrm: [number, number] = [-dd[1] < 0 ? dd[1] : -dd[1], Math.abs(dd[0])]
const topOver = (t: number): [number, number] => {
  const [y, z] = D(t), n: [number, number] = [Math.abs(dd[1]), Math.abs(dd[0])]
  const k = (TE[0] + TE[1] - y - z) / (n[0] + n[1])
  return [y + n[0] * k, z + n[1] * k]
}
const V = (p: [number, number], x: number): V3 => [x, p[0], p[1]]
void dn; void nrm

/** A square-section member from a to b, w across, d deep, with end caps. */
function beam(p: Part, a: V3, b: V3, w: number, d: number, side: V3 = [1, 0, 0]) {
  const t = norm(sub(b, a))
  let S = norm(cross(t, cross(side, t)))
  if (Math.hypot(...S) < 1e-3) S = [1, 0, 0]
  const U = norm(cross(t, S)), s = mul(S, w / 2), u = mul(U, d / 2)
  const q = (o: V3): V3[] => [sub(sub(o, s), u), add(sub(o, s), u), add(add(o, s), u), sub(add(o, s), u)]
  const A = q(a), B = q(b), ns: V3[] = [mul(S, -1), U, S, mul(U, -1)]
  for (let i = 0; i < 4; i++) face(p, A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i], ns[i])
  face(p, A[0], A[1], A[2], A[3], mul(t, -1))
  face(p, B[0], B[1], B[2], B[3], t)
}
/** An upright box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}
const steel = new Part(), conc = new Part()
const SIDES = [-1, 1]
const ts = Array.from({ length: PANELS }, (_, i) => i / PANELS)
for (const sd of SIDES) {
  const x = sd * XT
  beam(steel, V(DH, x), V(DT, x), 1.1, 1.2)                     // deck chord
  beam(steel, V(TT, x), V(TE, x), 1.1, 1.2)                     // top chord, on back over the counterweight
  beam(steel, V(DT, x), V(TT, x), 1.0, 1.0)                     // tip end member
  ts.forEach((t, i) => {
    const a = D(t), b = topOver(t)
    beam(steel, V(a, x), V(b, x), i === 0 ? 1.3 : 0.6, i === 0 ? 1.3 : 0.6)  // posts square to the deck
    const t2 = ts[i + 1] ?? 1
    const b2 = i + 1 < PANELS ? topOver(t2) : TT
    beam(steel, V(i % 2 ? a : b, x), V(i % 2 ? b2 : D(t2), x), 0.55, 0.55)    // diagonals
  })
  // The counterweight frame: from the heel back to the top chord's end, and a strut down to the track.
  beam(steel, V(DH, x), V([TE[0] - 2, 4.0], x), 1.0, 1.0)
  beam(steel, V(TE, x), V([TE[0] - 2, 4.0], x), 1.0, 1.0)
  // The rolling segment: a curved plate under the heel, in the truss plane.
  const C: [number, number] = [15.5, 10.5], R = 8.0, n = 6
  const a0 = Math.atan2(DH[1] - C[1], DH[0] - C[0]), a1 = -Math.PI / 2 + 0.55
  const arc = Array.from({ length: n + 1 }, (_, k) => { const a = a0 + ((a1 - a0) * k) / n; return [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)] as [number, number] })
  for (let k = 0; k < n; k++) for (const o of [-0.4, 0.4]) {
    const q = (p: [number, number]): V3 => [x + o, p[0], p[1]]
    const A = q(C), B = q(arc[k]), E = q(arc[k + 1]), g = cross(sub(B, A), sub(E, A))
    if ((g[0] > 0) === (o > 0)) steel.tri(A, B, E); else steel.tri(A, E, B)
  }
}
// Struts between the trusses at the top chord's panel points and the heel; the track deck along the deck chord.
ts.forEach((t, i) => { const b = topOver(t); beam(steel, V(b, -XT), V(b, XT), i === 0 ? 1.0 : 0.5, i === 0 ? 1.0 : 0.6) })
beam(steel, V(TT, -XT), V(TT, XT), 0.6, 0.8)
{
  const off = (p: [number, number], k: number): [number, number] => [p[0] - Math.abs(dd[1]) * k, p[1] - Math.abs(dd[0]) * k]
  const a0 = V(DH, -XT), a1 = V(DH, XT), b0 = V(DT, -XT), b1 = V(DT, XT)
  const c0 = V(off(DH, 0.8), -XT), c1 = V(off(DH, 0.8), XT), e0 = V(off(DT, 0.8), -XT), e1 = V(off(DT, 0.8), XT)
  const up: V3 = [0, Math.abs(dd[1]), Math.abs(dd[0])]
  face(steel, a0, a1, b1, b0, up); face(steel, c0, c1, e1, e0, mul(up, -1))
}
// Counterweight: a concrete block hung under the top chord's back end, between the trusses.
box(conc, -XT + 0.5, XT - 0.5, 26.5, 35.5, 3.0, 10.5)
// The bank: the heel pier and track girder the segments roll on, from the bulkhead at the water's edge
// (y = 0, in the water) back to where the track runs out onto the east bank (y = 38, past the OSM track's end at
// y = 28), its top 3.6 m over the river (clear of the map's drawn bank, which terrain.ts check reads up to 3.6 m), its feet on the map's terrain (1-2.8 m here).
footedLoft(conc, gnd, [
  { plan: chamferedRect(-4.6, 4.6, 0, 38, 0), z: 'ground' },
  { plan: chamferedRect(-4.6, 4.6, 0, 38, 0), z: 3.6 },
], 3)

const STEEL: MaterialSpec = finish('weathered-steel', 0x564c45)
const CONC: MaterialSpec = finish('pier-concrete', 0xbdb7ad)
const parts = [{ part: steel, material: STEEL }, { part: conc, material: CONC }]
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('B&O Railroad Bridge 464', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the river (174.5 m NAVD88)',
  bearing: 99.44, elevation: 0, deckChordDeg: 53, topChordDeg: 45, tipHeight: DT[1],
})
await Bun.write(new URL('../models/cle-bo-bridge-464.glb', import.meta.url), glb)
console.log(`cle-bo-bridge-464.glb: ${tris} triangles, ${glb.length} bytes`)
