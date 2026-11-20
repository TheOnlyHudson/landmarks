/**
 * 16th Street Bridge (David McCullough Bridge, 1923; Warren & Wetmore,
 * architects; sculpture by Leo Lentelli) — procedural, CC0-1.0, no textures.
 * bun generators/pit-16th-street-bridge.ts
 *
 * The whole bridge as one placement, abutment to abutment, which is what
 * the OSM outline covers: three steel trussed through-arches over the
 * Allegheny (a 134 m centre span between two 71–73 m side spans) on stone
 * river piers; at each end of the arches a stone pier carrying two square
 * sandstone pylons, one at each sidewalk (the walk passes through an
 * arched opening in its foot), crowned by Lentelli's bronze sculpture: a
 * group of winged sea horses holding up an armillary sphere, four in all;
 * the deck girders, sidewalks and railings; the approach viaducts on steel
 * bents over the Strip District (222 m) and the North Side (79 m). All
 * steel is painted gold, as on the Three Sisters.
 *
 * The spheres are its identity, so they are drawn as bold simple forms: a
 * solid inner globe, a wide tilted zodiac band, an equator ring and
 * meridian rings, all a little thicker than the real bronze, on a plinth
 * ringed by four rearing winged horses drawn as tilted blocks with flat
 * wing fins. The low model keeps the globe, the zodiac band and two
 * meridians, and the horses as body and head blocks with their wings.
 *
 * Writes a low model (arches as chords, posts and diagonals, deck fascias
 * and soffit, piers, pylons, sculptures, approach bents) and a detail
 * model (adds the hangers, top lateral bracing, railings, more meridian
 * and latitude rings, the bents' knee braces), drawn from detailZoom 16.
 *
 * Frame: x across (+x north-east, upstream), y along toward the North
 * Side, z up, metres; origin on the deck's centre line at the middle of the
 * centre span, on the water. Bearing 317.878° (the outline's axis; the
 * lidar's railings and arch planes lie parallel to it, 1 m south-west of
 * the outline's centre line, which the anchor follows).
 *
 * Height. z = 0 is the river (216.35 m NAVD88 in lidar; the bare-earth
 * model's water under the bridge reads 216.27). Ground under the
 * piers, bents and abutments is the map's terrain (Mapterhorn, its river at
 * 216.25 m) from a 6 m table in this frame (`GROUND`), so the feet land on
 * the terrain the map draws.
 *
 * Roadway heights built to (`road`; lidar lower quartile on the roadway's
 * OSM way, read every 20 m with tools/bridge_ele.py, November 2026): 9.6 m
 * where 16th Street lands at grade (y = −393), 10.3 at the bridge way's
 * south end (−371), climbing ~4 % to 12.0 at −331 and 12.7 at −291, then
 * 0.7 % to 13.7 at −151, 14.2 at −91, a crest of 14.8 at mid centre span,
 * 14.4 at +64, falling ~3 % to 12.1 at +144, 9.8 at the north end (+219)
 * and 9.1 where Chestnut Street lands (+250). NAVD88 is these plus 216.35.
 * The sidewalks read 0.1-0.2 m above the roadway. `ele` for the map:
 * ~/landmarks-scratch/osm-ele/pit-16th-street-bridge.osc (docs/bridge-heights.md).
 *
 * Placement fix (November 2026). The first build placed every feature
 * 12.5 m too far toward the North Side in this frame: in lidar, read in the
 * catalog's frame, the sphere tops stand at y = −141.8 and +140.3 (the
 * model had −129.5 and +153), OSM's river piers are centred at −67 and
 * +67.5 (model −54.5, +79.5), and the roadway profile matched with the same
 * 12.5 m offset. The catalog anchor is right (it sits on mid centre span),
 * so the geometry moved: piers −67/+67, pylons −142/+140.5, arch ends
 * −139.5/−67/+67/+138, bents, road profile. `GROUND` was sampled in the
 * catalog frame and is unchanged (resampled to check: identical).
 *
 * Ends. The model now runs from y = −371.3, the south end of the bridge
 * way (way/465555707; the outline stops at −362.7), to +220, the outline's
 * and the bridge way's north end (way/28388796). At both ends the deck is
 * still 2.5-3.5 m above the street beside it, and the road goes on as
 * non-bridge 16th Street and Chestnut Street to land 20-25 m further on
 * (−390 and +242 in lidar, on fill the map draws as street); so each end
 * finishes on a 4 m sandstone abutment block down to the map's terrain,
 * its face toward the river. The low model's bent columns are plain square
 * shafts to stay under the 250 KB cap.
 *
 * Sources:
 * - OSM: outline way/663074978 (man_made=bridge, bridge:structure=arch,
 *   layer 1) in relation/4245928 (type=bridge, official_name David
 *   McCullough Bridge, ref:nrhp 79002163, wikidata Q4552241), 18–20 m
 *   wide, flaring to ±11–12 m at the pylons; river piers way/663074979 and
 *   way/663074980 (bridge:support=pier). No building or building:part
 *   inside the outline.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (2019): 1 m grid over the whole
 *   bridge, 0.5 m grids at the crown and both pairs of pylons, 1 m at the
 *   Strip District end. Arch crowns 45.2 m (centre, at y = 0), 33.1 m
 *   (south, y = −103.25) and 32.4 m (north, y = 102.5); the top chords
 *   meet over the river piers at 24.9 m (road + 10.4) and end at the
 *   pylons at road + 9; truss planes at x ±6.6, sidewalks to ±9.3,
 *   railings 1.3 m above them; river piers centred at y = −67 and +67;
 *   pylons at x ±8, about 4.2 m square, centred at y = −142 and +140.5,
 *   stone to road + 14.5, sphere tops at road + 21.4 (35.2 m south, 33.7 m
 *   north).
 * - Published (Wikipedia "David McCullough Bridge"; NRHP 79002163): opened
 *   1923, steel arch spans, bronze sculptures of armillary spheres on winged
 *   horses by Leo Lentelli on granite and sandstone pylons; renamed 2013.
 * - Photos (Wikimedia Commons):
 *   - "16th street bridge, Pittsburgh, PA" (Magpieturtle, 2025, CC BY 4.0):
 *     the whole upstream elevation; arch shapes, truss depth at the crowns
 *     (4.8 m), hanger spacing (16 panels centre, 9 per side span);
 *   - "16th Street Bridge (34133817834)" (Nick Amoscato, CC BY 2.0): the
 *     centre span from the bank;
 *   - "Sixteenth Street Bridge, 2025-09-18" (Cbaile19, CC0) and
 *     "Pittsburgh-2011-08-15-001 (6078648026)" (Perry Quan, CC BY-SA 2.0):
 *     the pylons (shaft, frieze cornice, attic, the arched opening at the
 *     walk), the portal bracing at the arch ends, the approach viaduct's
 *     gold fascia girders on bents with curved knee braces;
 *   - "Sixteenth Street Bridge, 2026-06-18" and "Sculpture by Leo
 *     Lentilli, Sixteenth Street Bridge, 2026-06-18" (Cbaile19, CC0): the
 *     sculpture: four winged horses on waves holding the sphere, a solid
 *     globe inside meridian and latitude bands, the wide zodiac band; and
 *     the verdigris bronze;
 *   - "16th Street Bridge (arch detail), Pittsburgh" (Perry Quan, CC BY-SA
 *     2.0) and "DavidMcCulloughBridge" (Fo2grfr, CC BY-SA 4.0).
 * - Night: no licensed night photo was found; only the sidewalk lamp posts
 *   are drawn as `lamp` points. Nothing is floodlit.
 *
 * Estimated: the bottom chords (a parabola from road − 1 at the span ends
 * to 4.8 m under the crown), the panel layout (Warren with verticals), the
 * river piers' tops (road − 2.2) and plan (OSM's extent), the end piers,
 * the deck girders' depth (1.6–1.8 m), the approach bents' spacing (about
 * 20 m) and columns, the pylons' tiers and the sculpture's proportions
 * (from the photos, scaled to the lidar's stone and sphere tops), the lamp
 * spacing (30 m).
 * Colour: gold from sunlit photos, pulled to #d8c062 as on the Three
 * Sisters; buff sandstone (#a8957c in sun, darker where weathered) pulled
 * to #b8a990; verdigris bronze (#6f9a8a) as #78998a.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, bead, chamferedRect, face, footedLoft, groundAt, merged, parabola, piecewise, rod, stations, tube, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

// Map terrain above its river reading, 6 m apart in this frame.
const GROUND: GroundGrid = {"y0":-372.0,"x0":-18.0,"step":6.0,"z":[[8.4,8.5,8.2,7.9,7.6,7.4,7.2],[7.8,7.9,7.5,7.1,6.7,6.6,7.0],[6.6,6.2,6.3,6.1,6.0,6.0,6.4],[7.1,6.7,6.2,6.2,6.2,5.9,5.6],[7.1,7.3,7.1,6.9,6.7,6.0,5.7],[6.8,7.1,7.1,6.8,6.9,5.9,5.8],[6.6,6.7,6.7,6.6,6.4,6.0,5.7],[6.3,6.2,6.2,6.2,6.2,5.8,5.8],[5.9,5.8,5.7,5.6,5.6,5.6,5.7],[5.5,5.5,5.4,5.5,5.5,5.5,5.6],[5.4,5.4,5.4,5.4,5.4,5.5,5.4],[5.5,5.4,5.4,5.4,5.4,5.3,5.4],[5.6,5.8,6.0,5.8,5.8,5.2,5.3],[5.7,5.8,5.7,5.5,5.6,4.2,5.2],[5.8,5.8,5.6,5.5,5.4,5.2,6.0],[5.8,5.8,5.5,5.6,5.5,5.3,6.1],[5.8,5.8,5.6,5.5,5.5,5.3,5.3],[5.9,5.9,5.8,5.7,5.6,5.4,5.2],[5.9,5.9,5.7,5.5,5.5,5.3,5.1],[5.9,5.9,5.8,5.9,6.1,4.5,5.0],[5.9,5.9,5.7,5.6,5.5,5.4,5.2],[5.9,5.8,5.5,5.6,6.0,5.4,6.6],[5.9,5.8,5.5,5.7,6.0,5.5,5.5],[5.9,5.8,5.5,5.5,5.5,5.5,5.4],[5.8,5.7,5.4,5.5,5.5,5.7,5.4],[5.8,5.6,5.5,5.5,5.5,5.5,5.5],[5.6,5.6,5.6,5.7,5.7,5.7,5.7],[5.4,5.6,5.7,5.8,5.9,5.9,6.0],[5.5,5.7,5.7,5.8,5.8,6.1,6.1],[5.4,5.6,5.7,5.8,5.9,5.9,6.0],[5.6,5.7,5.7,5.8,5.9,5.9,6.1],[5.7,5.6,5.6,5.6,5.6,5.7,6.2],[5.7,5.6,5.5,5.6,5.6,5.9,6.2],[5.8,5.6,5.6,5.6,5.7,5.9,6.4],[5.8,5.7,5.6,5.7,5.8,6.1,6.6],[5.8,5.7,5.6,5.7,5.8,6.0,6.6],[5.7,5.6,5.6,5.6,5.7,6.0,6.5],[5.7,5.6,5.6,5.6,5.8,6.0,6.5],[5.6,5.6,5.7,5.8,5.9,6.0,6.4],[5.6,5.6,5.8,5.9,6.0,6.0,4.9],[5.6,5.6,5.9,6.0,6.1,6.1,4.5],[5.0,5.0,5.2,5.4,5.7,5.9,5.0],[3.2,3.4,3.7,4.1,4.6,5.1,5.6],[2.7,2.9,3.2,3.6,4.0,4.5,5.2],[0.8,1.2,1.3,1.4,1.7,2.0,1.4],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.7,0.6,0.3,0.1,0.1,0.0,0.0],[4.1,4.0,2.7,2.3,2.6,3.1,2.4],[4.3,4.3,4.3,4.3,4.4,4.4,4.3],[5.1,5.0,5.0,4.8,4.7,4.6,4.5],[5.2,5.3,5.3,5.4,5.4,5.5,5.5],[5.6,5.6,5.7,5.6,5.6,5.5,5.6],[5.9,6.0,6.1,6.1,6.1,6.0,5.9],[6.1,6.2,6.3,6.2,6.3,6.2,6.1],[6.2,6.3,6.4,6.4,6.4,6.2,6.1],[6.2,6.3,6.5,6.4,6.4,6.3,6.2],[6.2,6.3,6.5,6.6,6.6,6.3,6.2],[6.1,6.2,6.3,6.4,6.4,6.3,6.2],[6.0,6.1,6.1,6.2,6.3,6.2,6.1],[6.1,6.1,6.3,6.3,6.4,6.4,6.3],[6.2,6.3,6.4,6.5,6.6,6.7,6.6],[6.3,6.3,6.5,6.8,7.1,7.2,7.0],[6.4,6.4,6.9,7.2,7.6,7.8,7.6],[6.8,6.7,8.0,8.5,8.6,8.3,8.2],[8.6,8.8,9.1,9.3,9.1,8.9,8.8],[8.6,8.9,9.1,9.2,9.1,8.9,8.8],[8.8,9.0,9.0,9.1,9.0,9.0,8.8],[8.8,9.1,9.0,9.1,9.0,8.8,8.6],[8.7,9.0,9.0,9.1,9.0,8.7,8.4],[8.6,8.9,8.9,9.0,8.9,8.8,8.4],[8.4,8.7,8.9,9.0,8.9,8.8,8.4],[8.2,8.7,8.8,8.9,8.9,8.7,8.2],[8.2,8.7,8.8,8.9,8.8,8.6,8.2],[8.4,8.8,8.8,8.9,8.8,8.7,8.2],[8.6,8.9,8.8,8.9,8.8,8.7,8.3],[8.8,8.9,8.8,9.0,8.8,8.7,8.4],[9.0,9.1,8.9,9.0,8.9,8.8,8.5],[9.2,9.2,9.0,9.1,9.0,8.9,8.7],[9.1,9.1,9.1,9.1,9.0,8.9,8.8],[14.2,12.8,9.1,9.2,9.1,9.0,8.9],[13.6,12.0,9.3,9.3,9.2,9.1,9.2],[12.3,10.5,9.3,9.3,9.3,9.4,9.5],[10.9,9.8,9.4,9.4,9.4,9.7,9.8],[10.2,9.9,9.5,9.5,9.6,9.9,9.9],[10.0,9.9,9.7,9.7,9.8,10.1,10.0],[9.9,10.1,10.0,10.0,10.1,10.3,10.2]]}
const ground = (x: number, y: number) => (y > -110 && y < 140 ? 0 : Math.max(0, groundAt(GROUND, x, y)))

// Roadway from lidar (metres above the water).
const road = piecewise([
  [-393, 9.6], [-381, 10.0], [-371, 10.3], [-363, 10.65], [-351, 11.17], [-339, 11.62], [-331, 11.98], [-321, 12.3],
  [-311, 12.53], [-291, 12.74], [-271, 12.9], [-251, 13.05], [-231, 13.13], [-211, 13.24], [-191, 13.37], [-171, 13.49],
  [-151, 13.69], [-131, 13.86], [-111, 14.04], [-91, 14.18], [-71, 14.33], [-51, 14.46], [-31, 14.62], [-11, 14.77],
  [2, 14.79], [24, 14.63], [64, 14.37], [84, 14.03], [104, 13.44], [124, 12.84], [144, 12.12], [164, 11.46], [184, 10.84],
  [204, 10.2], [219, 9.76], [239, 9.28], [250, 9.1],
])

const ENDS = -371.3, ENDN = 220
const PIERS = [-67, 67]
const PYLONS = [-142, 140.5]
type Span = { y0: number; y1: number; peak: number; panels: number; end0: number; end1: number }
const SPANS: Span[] = [
  { y0: -139.5, y1: -67, peak: 33.1, panels: 9, end0: 9.2, end1: 10.4 },
  { y0: -67, y1: 67, peak: 45.2, panels: 16, end0: 10.4, end1: 10.4 },
  { y0: 67, y1: 138, peak: 32.4, panels: 9, end0: 10.4, end1: 9.2 },
]
const XT = 6.6                    // truss planes
const WALK_IN = 7.25, WALK_OUT = 9.35, WALK_UP = 0.2
const CROWN_DEPTH = 4.8

/** An upright box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = true) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}
const cbox = (p: Part, cx: number, cy: number, hw: number, z0: number, z1: number, bottom = true) => box(p, cx - hw, cx + hw, cy - hw, cy + hw, z0, z1, bottom)

/** A rectangular band in a plane x = const, along a polyline in y-z, mitred. */
function chord(p: Part, path: V3[], w: number, h: number, skip: 'top' | 'bottom' | '' = '') {
  const X: V3 = [1, 0, 0]
  const rings = path.map((c, i) => {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const U = norm(cross(X, t)), hu = mul(U, h / 2), wx = mul(X, w / 2)
    return { U, q: [sub(sub(c, wx), hu), sub(add(c, wx), hu), add(add(c, wx), hu), add(sub(c, wx), hu)] as V3[] }
  })
  for (let i = 0; i < rings.length - 1; i++) {
    const a = rings[i].q, b = rings[i + 1].q, U = norm(add(rings[i].U, rings[i + 1].U))
    if (skip !== 'top') face(p, a[3], a[2], b[2], b[3], U)
    if (skip !== 'bottom') face(p, a[0], a[1], b[1], b[0], mul(U, -1))
    face(p, a[1], a[2], b[2], b[1], X)
    face(p, a[0], a[3], b[3], b[0], [-1, 0, 0])
  }
}

/** A straight square-section member from a to b. */
function beam(p: Part, a: V3, b: V3, w: number, h: number, up: V3 = [0, 0, 1]) {
  const t = norm(sub(b, a))
  let S = cross(t, up); if (Math.hypot(...S) < 1e-3) S = cross(t, [1, 0, 0]); S = norm(S)
  const U = cross(S, t), s = mul(S, w / 2), u = mul(U, h / 2)
  const q = (c: V3): V3[] => [sub(sub(c, s), u), sub(add(c, s), u), add(add(c, s), u), add(sub(c, s), u)]
  const A = q(a), B = q(b)
  const ns: V3[] = [mul(U, -1), S, U, mul(S, -1)]
  for (let i = 0; i < 4; i++) face(p, A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i], ns[i])
  face(p, A[0], A[1], A[2], A[3], mul(t, -1))
  face(p, B[0], B[1], B[2], B[3], t)
}

/** A smooth sphere. */
function globe(p: Part, c: V3, r: number, nLat: number, nLon: number) {
  const pt = (i: number, j: number): [V3, V3] => {
    const th = (Math.PI * i) / nLat, ph = (2 * Math.PI * j) / nLon
    const n: V3 = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]
    return [add(c, mul(n, r)), n]
  }
  for (let i = 0; i < nLat; i++) for (let j = 0; j < nLon; j++) {
    const [a, na] = pt(i, j), [b, nb] = pt(i + 1, j), [d, nd] = pt(i, j + 1), [e, ne] = pt(i + 1, j + 1)
    if (i > 0) p.tri(a, b, d, undefined, undefined, undefined, [na, nb, nd])
    if (i < nLat - 1) p.tri(d, b, e, undefined, undefined, undefined, [nd, nb, ne])
  }
}

/** A circle of radius R about c in the plane spanned by u and v. */
const circle = (c: V3, u: V3, v: V3, R: number, n: number): V3[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = (2 * Math.PI * i) / n; return add(c, add(mul(u, R * Math.cos(a)), mul(v, R * Math.sin(a)))) })

/** A wide band on a sphere: the ring of radius R about c in plane (u, v), hw either side of it along their normal. */
function sphereBand(p: Part, c: V3, u: V3, v: V3, R: number, hw: number, t: number, n: number) {
  const ax = norm(cross(u, v))
  for (const [rad, sgn] of [[R, 1], [R - t, -1]] as [number, number][]) {
    const lo = circle(add(c, mul(ax, -hw)), u, v, rad, n), hi = circle(add(c, mul(ax, hw)), u, v, rad, n)
    for (let i = 0; i < n; i++) {
      const mid = mul(add(sub(lo[i], c), sub(lo[i + 1], c)), 0.5)
      const nr = mul(norm(sub(mid, mul(ax, -hw))), sgn)
      face(p, lo[i], lo[i + 1], hi[i + 1], hi[i], nr)
    }
  }
  for (const s of [-1, 1]) {
    const o = circle(add(c, mul(ax, s * hw)), u, v, R, n), i0 = circle(add(c, mul(ax, s * hw)), u, v, R - t, n)
    for (let i = 0; i < n; i++) face(p, o[i], o[i + 1], i0[i + 1], i0[i], mul(ax, s))
  }
}

/** One pylon with its sculpture, centred at (cx, cy); its base stands on the end pier at zb. */
function pylon(stone: Part, bronze: Part, cx: number, cy: number, r0: number, zb: number, detail: boolean) {
  const H = 2.1, s = Math.sign(cx) || 1
  // Foot below the walk, then two jambs either side of the walk's opening.
  cbox(stone, cx, cy, H, zb, r0 + WALK_UP, false)
  const [ji0, ji1] = [cx - s * H, s > 0 ? WALK_IN - 0.15 : -(WALK_IN - 0.15)]
  const [jo0, jo1] = [s > 0 ? WALK_OUT - 0.25 : -(WALK_OUT - 0.25), cx + s * H]
  box(stone, Math.min(ji0, ji1), Math.max(ji0, ji1), cy - H, cy + H, r0 + WALK_UP, r0 + 3.2, false)
  box(stone, Math.min(jo0, jo1), Math.max(jo0, jo1), cy - H, cy + H, r0 + WALK_UP, r0 + 3.2, false)
  cbox(stone, cx, cy, H, r0 + 3.2, r0 + 9.6)
  cbox(stone, cx, cy, H + 0.35, r0 + 9.6, r0 + 11.0)        // frieze cornice
  cbox(stone, cx, cy, H + 0.5, r0 + 11.0, r0 + 11.4)
  cbox(stone, cx, cy, H - 0.05, r0 + 11.4, r0 + 14.0, false) // attic
  cbox(stone, cx, cy, H + 0.2, r0 + 14.0, r0 + 14.5)
  // Bronze: a wave plinth, four rearing winged horses, the armillary sphere.
  const zp = r0 + 14.5
  cbox(bronze, cx, cy, H + 0.05, zp, zp + 0.5)
  const c: V3 = [cx, cy, r0 + 19.6]
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const d: V3 = [dx, dy, 0], side: V3 = [-dy, dx, 0]
    const hip: V3 = [cx + dx * 0.5, cy + dy * 0.5, zp + 0.7], chest: V3 = [cx + dx * 1.9, cy + dy * 1.9, zp + 2.3]
    beam(bronze, hip, chest, 0.9, 0.9)
    if (detail) {
      beam(bronze, chest, add(chest, [dx * 0.5, dy * 0.5, 0.75]), 0.5, 0.6)                                // head
      beam(bronze, add(chest, [0, 0, -0.3]), add(chest, [dx * 0.6, dy * 0.6, -1.4]), 0.35, 0.35)             // forelegs
    } else beam(bronze, chest, add(chest, [dx * 0.4, dy * 0.4, 0.8]), 0.6, 0.6)
    // Wing: a flat fin rising from the back toward the sphere.
    const w0 = add(hip, mul(d, 0.6)), w1 = add(add(hip, mul(d, 0.2)), [0, 0, 2.6]), w2 = add(add(hip, mul(d, 1.6)), [0, 0, 2.0])
    for (const o of [-0.08, 0.08]) {
      const off = mul(side, o)
      const n = mul(side, Math.sign(o))
      const [a, b, e] = [add(w0, off), add(w1, off), add(w2, off)]
      const g = cross(sub(b, a), sub(e, a))
      if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) bronze.tri(a, b, e, undefined, undefined, undefined, [n, n, n])
      else bronze.tri(a, e, b, undefined, undefined, undefined, [n, n, n])
    }
  }
  const R = 1.8, seg = detail ? 24 : 12, tr = detail ? 0.11 : 0.22
  globe(bronze, c, 1.05, detail ? 8 : 4, detail ? 12 : 6)
  const ex: V3 = [1, 0, 0], ey: V3 = [0, 1, 0], ez: V3 = [0, 0, 1]
  const tilt = (23.4 * Math.PI) / 180
  sphereBand(bronze, c, ex, [0, Math.cos(tilt), Math.sin(tilt)], R, detail ? 0.32 : 0.38, 0.12, seg)   // zodiac band
  if (detail) tube(bronze, circle(c, ex, ey, R - 0.05, seg), tr, 6)                                    // equator
  const meridians = detail ? [0, 30, 60, 90, 120, 150] : [45, 135]
  for (const m of meridians) {
    const a = (m * Math.PI) / 180
    tube(bronze, circle(c, [Math.cos(a), Math.sin(a), 0], ez, R - 0.05, seg), tr, detail ? 6 : 3)
  }
  if (detail) for (const lat of [-50, 50]) {
    const a = (lat * Math.PI) / 180
    tube(bronze, circle(add(c, [0, 0, R * Math.sin(a)]), ex, ey, R * Math.cos(a) - 0.05, 16), tr, 6)
  }
}

const gold = new Part(), goldDet = new Part(), shade = new Part(), shadeDet = new Part()
const stone = new Part(), bronzeLow = new Part(), bronzeDet = new Part(), lampsLow = new Part(), lampsDet = new Part()
const both = (f: (p: Part) => void, ...ps: Part[]) => ps.forEach(f)

// ---- Deck: sidewalks, fascia girders, soffit, railings ----------------------------
const ys = stations(ENDS, ENDN, 13)
for (const s of [-1, 1]) {
  const [w0, w1] = [s * WALK_IN, s * WALK_OUT]
  both((p) => band(p, w0, w1, ys, (y) => road(y) + WALK_UP, (y) => road(y) + WALK_UP - 0.3, { top: true, ends: true }), gold, goldDet)
  // Fascia girder on the outer edge.
  both((p) => band(p, s * (WALK_OUT - 0.4), w1, ys, (y) => road(y) + WALK_UP, (y) => road(y) - 1.6, { out: true, bottom: true, ends: true }), gold, goldDet)
  band(goldDet, s * (WALK_OUT - 0.2), s * (WALK_OUT - 0.05), ys, (y) => road(y) + 1.45, (y) => road(y) + 1.3)
  for (const y of stations(ENDS, ENDN, 2.5)) rod(goldDet, [s * (WALK_OUT - 0.12), y, road(y) + WALK_UP], [s * (WALK_OUT - 0.12), y, road(y) + 1.35], 0.06, 3)
}
both((p) => band(p, -WALK_OUT + 0.4, WALK_OUT - 0.4, ys, (y) => road(y) - 1.5, (y) => road(y) - 1.6, { bottom: true }), shade, shadeDet)

// ---- Arches ------------------------------------------------------------------------------
for (const sp of SPANS) {
  const ym = (sp.y0 + sp.y1) / 2
  const topC = parabola([sp.y0, road(sp.y0) + sp.end0], [ym, sp.peak], [sp.y1, road(sp.y1) + sp.end1])
  const b0 = sp.y0 + 1.5, b1 = sp.y1 - 1.5
  const botC = parabola([b0, road(b0) - 1.0], [ym, sp.peak - CROWN_DEPTH], [b1, road(b1) - 1.0])
  const pts = stations(b0, b1, (b1 - b0) / sp.panels)
  const curveD = stations(sp.y0, sp.y1, (sp.y1 - sp.y0) / (sp.panels * 2))
  const bcurveD = stations(b0, b1, (b1 - b0) / (sp.panels * 2))
  const curveL = stations(sp.y0, sp.y1, (sp.y1 - sp.y0) / sp.panels), bcurveL = pts
  for (const s of [-1, 1]) {
    const x = s * XT
    chord(goldDet, curveD.map((y) => [x, y, topC(y) - 0.5] as V3), 1.1, 1.0)
    chord(goldDet, bcurveD.map((y) => [x, y, botC(y) + 0.45] as V3), 1.1, 0.9)
    // The far view's chords at panel resolution, a little heavier.
    chord(gold, curveL.map((y) => [x, y, topC(y) - 0.55] as V3), 1.3, 1.1, 'bottom')
    chord(gold, bcurveL.map((y) => [x, y, botC(y) + 0.5] as V3), 1.3, 1.0, 'top')
    // Deck tie girder in the arch plane, inside the span.
    both((p) => band(p, x - 0.45 * s, x + 0.45 * s, stations(sp.y0, sp.y1, 14), (y) => road(y) + 1.0, (y) => road(y) - 1.8), gold, goldDet)
    pts.forEach((y, i) => {
      const zb = botC(y) + 0.9, zt = topC(y) - 1.0
      if (zt - zb > 0.5) both((p) => rod(p, [x, y, zb], [x, y, zt], p === gold ? 0.32 : 0.28, p === gold ? 3 : 4), gold, goldDet)
      if (i < pts.length - 1) {
        const y2 = pts[i + 1], up = i % 2 === 0
        const a: V3 = up ? [x, y, botC(y) + 0.9] : [x, y, topC(y) - 1.0]
        const b: V3 = up ? [x, y2, topC(y2) - 1.0] : [x, y2, botC(y2) + 0.9]
        both((p) => rod(p, a, b, p === gold ? 0.3 : 0.25, p === gold ? 3 : 4), gold, goldDet)
      }
      // Hangers, detail only.
      if (botC(y) > road(y) + 2) rod(goldDet, [x, y, road(y) + 1.0], [x, y, botC(y)], 0.18, 4)
    })
    // End posts.
    for (const [yE, zE] of [[sp.y0, road(sp.y0) + sp.end0], [sp.y1, road(sp.y1) + sp.end1]] as [number, number][])
      both((p) => box(p, x - 0.6, x + 0.6, yE - 0.8, yE + 0.8, road(yE) - 2.2, zE, false), gold, goldDet)
  }
  // Top lateral bracing between the arch planes.
  pts.forEach((y, i) => {
    const z = topC(y) - 0.5
    if (i % 3 === 0) rod(gold, [-XT, y, z], [XT, y, z], 0.3, 3)
    rod(goldDet, [-XT, y, z], [XT, y, z], 0.22, 4)
    if (i < pts.length - 1) {
      const y2 = pts[i + 1], z2 = topC(y2) - 0.5
      rod(goldDet, [-XT, y, z], [XT, y2, z2], 0.16, 4)
      rod(goldDet, [XT, y, z], [-XT, y2, z2], 0.16, 4)
    }
  })
  // Portal struts at the span ends.
  for (const yE of [sp.y0 + 3, sp.y1 - 3]) for (const dz of [5.5, 7.5]) both((p) => box(p, -XT, XT, yE - 0.4, yE + 0.4, road(yE) + dz, road(yE) + dz + 0.8), gold, goldDet)
  // Floor beams, detail.
  for (const y of pts) band(shadeDet, -XT, XT, [y - 0.3, y + 0.3], () => road(y) - 1.5, () => road(y) - 2.3, { bottom: true, in: true, out: true, ends: true })
}

// ---- River piers, end piers, pylons --------------------------------------------------
for (const yP of PIERS) {
  const t = road(yP) - 2.2
  footedLoft(stone, ground, [
    { plan: chamferedRect(-11.6, 11.6, yP - 3.6, yP + 3.6, 2.6), z: 'ground' },
    { plan: chamferedRect(-11.1, 11.1, yP - 3.1, yP + 3.1, 2.3), z: t - 0.6 },
    { plan: chamferedRect(-11.4, 11.4, yP - 3.4, yP + 3.4, 2.4), z: t - 0.6 },
    { plan: chamferedRect(-11.4, 11.4, yP - 3.4, yP + 3.4, 2.4), z: t },
  ], 3)
}
for (const yP of PYLONS) {
  const r0 = road(yP), zb = r0 - 1.6
  footedLoft(stone, ground, [
    { plan: chamferedRect(-11, 11, yP - 3.6, yP + 3.6, 0.5), z: 'ground' },
    { plan: chamferedRect(-11, 11, yP - 3.6, yP + 3.6, 0.5), z: zb },
  ], 3)
  for (const s of [-1, 1]) { pylon(stone, bronzeLow, s * 8, yP, r0, zb, false); pylon(new Part(), bronzeDet, s * 8, yP, r0, zb, true) }
}

// ---- Approach bents and abutments ----------------------------------------------------
const bents = [...stations(-162.5, -362.5, 20), ...stations(160.5, 200.5, 20)]
for (const y of bents) {
  const cap = road(y) - 1.6
  both((p) => box(p, -WALK_OUT + 0.4, WALK_OUT - 0.4, y - 0.5, y + 0.5, cap - 0.9, cap), gold, goldDet)
  for (const s of [-1, 1]) {
    const x = s * 6
    // Low: a plain square column (no chamfer) to stay under the 250 KB cap.
    const sq: [number, number][] = [[x - 0.4, y - 0.4], [x + 0.4, y - 0.4], [x + 0.4, y + 0.4], [x - 0.4, y + 0.4]]
    footedLoft(gold, ground, [{ plan: sq, z: 'ground' }, { plan: sq, z: cap - 0.9 }], 1, false)
    footedLoft(goldDet, ground, [{ plan: chamferedRect(x - 0.4, x + 0.4, y - 0.4, y + 0.4, 0.1), z: 'ground' }, { plan: chamferedRect(x - 0.4, x + 0.4, y - 0.4, y + 0.4, 0.1), z: cap - 0.9 }], 3, false)
    rod(goldDet, [x, y, cap - 4], [s * 8.6, y, cap - 0.9], 0.18, 4)
    rod(goldDet, [x, y, cap - 4], [s * 2.5, y, cap - 0.9], 0.18, 4)
  }
}
for (const [y0, y1] of [[ENDS, ENDS + 4], [ENDN - 4, ENDN]]) {
  const t = Math.min(road(y0), road(y1)) - 0.4
  footedLoft(stone, ground, [{ plan: chamferedRect(-9.4, 9.4, y0, y1, 0), z: 'ground' }, { plan: chamferedRect(-9.4, 9.4, y0, y1, 0), z: t }], 3, false)
}

// ---- Lamps on the sidewalks ---------------------------------------------------------------
for (const y of stations(ENDS + 15, ENDN - 15, 30)) {
  if (PYLONS.some((p) => Math.abs(y - p) < 5)) continue
  for (const s of [-1, 1]) {
    const x = s * (WALK_OUT - 0.4), z = road(y) + WALK_UP
    rod(goldDet, [x, y, z], [x, y, z + 7], 0.1, 4)
    bead(lampsDet, [x, y, z + 7.3], 0.35)
    bead(lampsLow, [x, y, z + 7.3], 0.7, true)
  }
}

// ---- Write ------------------------------------------------------------------------------------
const GOLD: MaterialSpec = finish('bridge-gold', 0xd8c062)
const SHADE: MaterialSpec = finish('bridge-gold-shade', 0xb09b4f)
const STONE: MaterialSpec = finish('pylon-sandstone', 0xb8a990)
const BRONZE: MaterialSpec = { ...finish('verdigris-bronze', 0x78998a), doubleSided: true }
const LAMP: MaterialSpec = { name: 'lamp', color: 0xe6e0cf }
const low = [
  { part: gold, material: GOLD }, { part: shade, material: SHADE }, { part: stone, material: STONE },
  { part: bronzeLow, material: BRONZE }, { part: lampsLow, material: LAMP },
]
const detail = [
  { part: goldDet, material: GOLD }, { part: shadeDet, material: SHADE }, { part: stone, material: STONE },
  { part: bronzeDet, material: BRONZE }, { part: lampsDet, material: LAMP },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck centre line at mid centre span, on the water',
  bearing: 317.878, elevation: 0, piers: PIERS, pylons: PYLONS, ends: [ENDS, ENDN],
  roadway: { south: road(ENDS), southPylons: road(PYLONS[0]), crown: road(0), northPylons: road(PYLONS[1]), north: road(ENDN) }, waterNAVD88: 216.35,
}
const count = (l: { part: Part }[]) => l.reduce((n, { part }) => n + part.triangles, 0)
for (const [file, list, maxTris, maxBytes] of [
  ['pit-16th-street-bridge.glb', low, 6500, 250 * 1024],
  ['pit-16th-street-bridge.detail.glb', detail, 40000, 1536 * 1024],
] as const) {
  const tris = count([...list])
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
  const glb = writeGlb('16th Street Bridge', [...list], extras)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
}
