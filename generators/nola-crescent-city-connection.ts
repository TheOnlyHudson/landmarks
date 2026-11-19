/**
 * Crescent City Connection (Greater New Orleans Bridge; 1958 and 1988,
 * Modjeski & Masters), US 90 Business over the Mississippi between the CBD
 * and Algiers — procedural, CC0-1.0.
 * bun generators/nola-crescent-city-connection.ts
 *
 * Both cantilever through-truss spans as one placement, end post to end
 * post: four trusses (top chord, bottom chord along the roadway, posts,
 * alternating diagonals, inclined end posts), the deck's underside, the two
 * river piers of each span and the end piers, and the four strings of
 * lights along the top chords. Low model: chords as solid bands, the web as
 * flat plates (double-sided steel), every post, 32 lights a string. Detail
 * (detailZoom 16): four-sided members, mid-depth struts in the deep panels
 * near the towers, top lateral struts and X bracing, sway frames at the
 * tower posts, floor beams, the floor's edge girder under each bottom
 * chord, 64 lights a string.
 *
 * Frame: x across (+x south, toward the upstream 1958 span), y along toward
 * Algiers (east), z up, metres; origin midway between the river towers and
 * between the two spans, on the river. Bearing 89.5 (both spans' truss
 * planes run straight along it within 0.5 m over 900 m in the lidar).
 * Anchor -90.0566262, 29.9382912. The map draws the roadways; nothing here
 * is a slab at road level (bottom chords stand beside the lanes, the
 * underside hangs 1.0-1.6 m below).
 *
 * Height. z = 0 is the river as the map's terrain draws it (Mapterhorn /
 * 3DEP DEM water 0.85 m NAVD88); every lidar height here is NAVD88 - 0.85.
 * Lidar has no water returns; the DEM and lidar agree on both banks
 * (CBD wharf 5.0-5.3 m, Algiers batture 0.6-1.0 m).
 *
 * Roadway heights the model is built to (lidar, tools/bridge_ele.py measure
 * --every 20, LA_2021GNO_1_C22, readings with spread <= 0.22 m; model z, NAVD88
 * - 0.85), re-measured in November 2026 for the OSM `ele` pins:
 * - 1958 span, way/24012355 (to the West Bank): 43.6 (y -541), 46.5 (-461),
 *   48.3 (-414), 51.5 (-294), 53.1 (-183), crest 53.8 (-103), 53.6 (57), 52.9
 *   (177), 51.7 (280), 49.5 (375), 47.5 (435), 45.9 (480). ROAD_S.
 * - 1988 span, way/59657208 (to the CBD, beside the north truss): 46.8
 *   (-505), 50.6 (-400), 53.4 (-280), 54.5 (-197), crest 55.45 (3), 54.4
 *   (183), 52.0 (344), 49.1 (442). ROAD_N.
 * - 1988 span, HOV way/317191746 (beside the south truss), 0.3-0.4 m higher
 *   (crossfall): 48.0 (-480), 50.9 (-400), 53.6 (-280), 55.8 (-56), 55.5
 *   (84), 53.6 (276), 50.3 (416). ROAD_HOV.
 * Each truss's bottom chord follows its own carriageway; the floor between
 * them follows the lower. (Until November 2026 the 1988 trusses followed the
 * two ways' average, 0.15-0.3 m over the mainline, and the 1958 table missed
 * the curve near the Algiers end by 0.4 m.) In NAVD88 add 0.85. None of these
 * ways carried `ele`; the pins for OSM, with their checks, are in
 * ~/landmarks-scratch/osm-ele/nola-crescent-city-connection.md (.osc beside
 * it), uploaded separately.
 *
 * Ends. CBD (west): the trusses end on their H end piers at y -495.5 (lidar),
 * the cap's outer face flush with the end posts and the floor: the abutment
 * face. The approach girders beyond are a separate OSM bridge (outlines
 * way/1173588190 and way/1173738080, not listed in replaces) and the map's.
 * Algiers (east): the trusses end at y 415.5 (lidar; nothing above the roadway
 * past them), but the outline runs on to y 437-439, so the approach girder
 * span is drawn on to a bent whose cap face is at y 441 (APPROACH_END): plate
 * girders under each roadway's edge, the floor's underside and a parapet (one
 * fascia band in the low model). From there the map's approach viaducts
 * (way/23988761, way/24007764, the HOV way/12706095) carry on.
 *
 * Sources:
 * - OSM: outline relation/15864489 (man_made=bridge, two outer ways
 *   1173535709/1173535710), the four river piers way/1173535705-08
 *   (man_made=pier, bridge:support), roadway ways above. The outline sits
 *   about 20 m east of the structure: it runs y -478..+440 in this frame
 *   where the lidar and NAIP trusses run -496..+416. The piers' outlines
 *   are within 3 m of the lidar.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid, 490 m half-size over both spans. Measured: tower posts 480 m
 *   apart (y = ±240); top chord at every panel point (TOP_N, TOP_S: peaks
 *   110.5 / 109.0 m at the towers, the suspended span flat at 78.9 / 78.4
 *   m between y ±105, anchor arms falling to 66.3 / 65.5 m at the west end
 *   and 69.0 / 68.3 m at the east end); panel points from the top lateral
 *   bracing: 15.0 m in the main span (32 panels), 14.4 m in the west anchor
 *   arm (17), 15.1 m in the east arm (11); inclined end posts 10 m long in
 *   plan; truss planes 32.0 m apart on the 1988 span, 20.8 m on the 1958
 *   span, the spans' centre lines 122 m apart; river-pier footings 7.6 m
 *   above the water; the 1988 pier shafts' tops 46.8 m, just outside the
 *   truss planes; the roadway (above).
 * - Published (Wikipedia "Crescent City Connection"): main span 1,575 ft
 *   (480 m, matches), clearance 170 ft (52 m; the bottom chords here are at
 *   51-53 m over the channel), cantilever truss, Modjeski & Masters, 1958
 *   and 1988 spans; decorative lights along the top profile lines of both
 *   bridges, 64 per string, 256 in all (so one string per truss).
 * - USGS NAIP orthophoto (public domain): plan, truss ends, the two spans.
 * - Photos (Wikimedia Commons / Flickr, all evidence):
 *   - "Crescent City Connection 2.jpg", Nutriawood, CC BY-SA 4.0 (from the
 *     river between the spans: the twin-shaft river piers, one span's with a
 *     mid-height strut, the cap beams, the underside).
 *     https://commons.wikimedia.org/wiki/File:Crescent_City_Connection_2.jpg
 *   - "New Orleans Crescent City Connection bridge 2008.jpg", KimonBerlin,
 *     CC BY-SA 2.0 (the anchor arm and tower peak, Warren web with posts).
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Crescent_City_Connection_bridge_2008.jpg
 *   - "Crescent City Connection Bridge, New Orleans, October 2023.jpg",
 *     Gildardo, CC BY 2.0 (broadside from the north: the whole profile).
 *     https://commons.wikimedia.org/wiki/File:Crescent_City_Connection_Bridge,_New_Orleans,_October_2023.jpg
 *   - "Crescent City Connection-2.jpg" and "Crescent City Connection-New
 *     Orleans.jpg", Yair Haklai, CC BY-SA 4.0 (from the French Quarter,
 *     north-east: the east arm, the H-shaped end pier).
 *     https://commons.wikimedia.org/wiki/File:Crescent_City_Connection-2.jpg
 *     https://commons.wikimedia.org/wiki/File:Crescent_City_Connection-New_Orleans.jpg
 *   - "Crescent City Connection (closeup).JPG", Vegasjon, CC BY-SA 4.0
 *     (the web, the bottom chord and the floor's edge girder below it).
 *     https://commons.wikimedia.org/wiki/File:Crescent_City_Connection_(closeup).JPG
 *   - "Crescent City Connection skyline.JPG", Vegasjon, CC BY-SA 3.0 (from
 *     the CBD, west-north-west: the pointed peaks, both spans).
 *     https://commons.wikimedia.org/wiki/File:Crescent_City_Connection_skyline.JPG
 *   - Night: "USCGC Razorbill, at night, in New Orleans during Mardi Gras,
 *     2011.jpg", Stephen Lehmann (US Coast Guard), public domain; "New
 *     Orleans", aforero, CC BY 2.0 (flickr.com/photos/88824995@N00/451760343).
 *     https://commons.wikimedia.org/wiki/File:USCGC_Razorbill,_at_night,_in_New_Orleans_during_Mardi_Gras,_2011.jpg
 * - Look-only (not used for shape or colour): Flickr "Crescent City
 *   Connection at Night" (rush_39402, CC BY-NC-SA 2.0).
 *
 * Estimated: chord sections (low 2.6 x 4.0 m top, bottom chord 4.8 m deep
 * from 3.6 m under to 1.2 m over the roadway, drawn heavier than the real
 * ones so the silhouette survives at phone size; detail 1.3 x 1.8 m top,
 * bottom chord 2.6 m under to 0.9 m over the roadway), web
 * members (plates 1.6 m wide in the low model, 0.9 x 0.8 m in the detail),
 * the tower post 2.0 x 3.2 m; river-pier shafts 6.5 x 9 m with a cap beam
 * from 44.8 m to the chord; footings 50.5 x 16 m (1988) and 30 x 14 m
 * (1958) from the OSM pier outlines; the strut at 25.5-29 m drawn on the
 * 1988 span's river piers; end piers (two 3.8 x 4.4 m shafts, a cap and a
 * strut, H as in the photos; the low model leaves the strut out and stands
 * the shafts as plain boxes, to stay in its 250 KB) on the map's ground (4.4
 * m west, 0.2 m east, Mapterhorn), and the Algiers approach bent drawn like
 * them; the approach girders 1.0 x 2.4 m, the parapet 0.5 x 1.05 m.
 * Diagonals alternate counted from each tower so the two
 * cantilevers mirror; the real web has more secondary members.
 * Colour: the steel reads medium blue-grey against the sky in every photo:
 * #7f8a96 (review round 1; the earlier pale #b9bfc5 vanished on the map),
 * the deck's underside a step darker (#66707b), pale concrete piers.
 *
 * Night: `lamp` beads along every top chord (Wikipedia: 4 strings of 64),
 * and the trusses carry a `_FLOODLIGHT` wash (0.45 on side faces, 0.2 on
 * faces looking up): the night photo shows the members lit warm.
 *
 * Doubts:
 * - Which span is which: the 1988 span is taken to be the downstream (north)
 *   one, the wider (32 m truss spacing) carrying the HOV lanes in OSM; the
 *   mid-height strut on its river piers rests on reading the photos'
 *   viewpoints and may belong to the other span.
 * - replaces lists the outline relation, which the model now covers end to
 *   end: the outline is shifted ~20 m east of the lidar trusses, so the
 *   model's west end posts run 10-18 m past its west edge (over approach
 *   outlines way/1173588190 / way/1173738080, not listed, where the map may
 *   also draw a pier), and the east end's approach span and bent are placed
 *   by the outline, not by evidence: the real first approach pier isn't seen
 *   in the lidar (the deck hides it) or in any photo closely enough.
 * - The OSM `ele` pins are not uploaded yet; until they are, the map guesses
 *   the decks (see Roadway heights).
 * - The suspended span's hinges and the secondary web members are left out.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { along, band, bead, footedLoft, piecewise, stations, strip } from './bridge-kit'
import { finish, type Swatch } from './palette'

// ---- Frame -------------------------------------------------------------------
// x across the bridges (+x toward the south, upstream span), y along them
// toward Algiers (east, bearing 89.5), z up; metres. Origin midway between
// the two river towers and between the two spans, on the river (DEM water,
// 0.85 m NAVD88). Lidar heights are NAVD88 - 0.85.

const TOWER = 240 // tower posts at y = ±240 (lidar peaks 480 m apart; published main span 1,575 ft)

/** Top-chord panel points along y: 17 panels west, 32 in the main span, 11 east. */
const NODES: number[] = [
  ...Array.from({ length: 17 }, (_, i) => -485 + (i * 245) / 17),
  ...Array.from({ length: 33 }, (_, i) => -240 + 15 * i),
  ...Array.from({ length: 11 }, (_, i) => 240 + (166 / 11) * (i + 1)),
]
const TOP_END: [number, number] = [-485, 406] // top chord ends
const BOT_END: [number, number] = [-495.5, 415.5] // inclined end posts land here

/** Top of the top chord at each node, lidar (median of the highest returns), per span. */
const TOP_N = [66.3, 67.3, 68.3, 69.3, 70.3, 71.2, 72.2, 73.2, 74.4, 76.0, 78.1, 80.9, 84.0, 88.1, 92.7, 98.3, 103.8, 110.5,
  104.2, 98.8, 93.5, 89.0, 85.4, 83.1, 80.8, 79.9, 79.1, 79.0, 79.1, 79.1, 79.0, 79.0, 78.9, 78.9, 78.9, 78.9, 78.9, 78.8,
  78.8, 78.8, 78.9, 79.6, 80.4, 82.7, 85.0, 88.3, 92.9, 98.2, 103.7, 110.5, 103.6, 97.1, 90.9, 85.4, 81.1, 77.9, 75.5, 72.8,
  71.0, 70.1, 69.0]
const TOP_S = [65.5, 66.4, 67.5, 68.5, 69.5, 70.5, 71.6, 72.6, 73.8, 75.4, 77.5, 80.4, 83.4, 87.5, 92.2, 97.2, 103.1, 109.0,
  103.8, 98.0, 93.0, 88.6, 85.0, 82.7, 80.5, 79.5, 78.8, 78.7, 78.6, 78.6, 78.6, 78.5, 78.5, 78.5, 78.4, 78.4, 78.4, 78.4,
  78.3, 78.3, 78.4, 79.1, 79.9, 82.1, 84.5, 87.8, 92.3, 97.4, 103.0, 109.0, 103.2, 96.4, 90.4, 85.2, 80.8, 77.4, 74.2, 72.2,
  70.5, 69.4, 68.3]

/**
 * Roadway along each carriageway (lidar LA_2021GNO_1_C22 via tools/bridge_ele.py
 * measure --every 20, readings with spread <= 0.22 m, NAVD88 - 0.85), re-measured
 * for the OSM `ele` pins (~/landmarks-scratch/osm-ele/nola-crescent-city-connection.md).
 */
const ROAD_S = piecewise([[-541, 43.55], [-461, 46.48], [-414, 48.29], [-354, 50.18], [-294, 51.48], [-223, 52.63],
  [-183, 53.08], [-123, 53.63], [-103, 53.75], [57, 53.58], [97, 53.43], [177, 52.89], [280, 51.7], [375, 49.53],
  [435, 47.46], [480, 45.86]]) // 1958 span, way/24012355
const ROAD_N = piecewise([[-505, 46.84], [-460, 48.48], [-400, 50.63], [-280, 53.37], [-237, 54.03], [-197, 54.45],
  [-137, 54.98], [-77, 55.28], [-37, 55.41], [3, 55.45], [43, 55.34], [103, 55.03], [143, 54.79], [183, 54.42],
  [243, 53.71], [344, 52.04], [442, 49.09], [482, 47.85]]) // 1988 span, way/59657208 (beside the north truss)
const ROAD_HOV = piecewise([[-539, 45.78], [-480, 48.01], [-440, 49.51], [-400, 50.94], [-340, 52.65], [-280, 53.63],
  [-176, 54.99], [-116, 55.48], [-56, 55.79], [24, 55.74], [84, 55.46], [124, 55.2], [164, 54.93], [204, 54.53],
  [276, 53.61], [416, 50.26], [456, 48.81], [476, 48.11]]) // 1988 span, HOV way/317191746 (beside the south truss)

/**
 * The Algiers end. The trusses end on their end piers at y 415.5 (lidar), but
 * the bridge's outline (relation/15864489, which `replaces` lists, so the map
 * draws no piers or parapets inside it) runs on to y 437-439. The approach
 * girder span is drawn to a bent whose cap's outer face is at y 441, the
 * abutment face the map's own approach viaduct (outside the outline) meets.
 */
const APPROACH_END = 441

/** Map ground under the end piers (Mapterhorn, metres above the river). */
const ground = (_x: number, y: number) => (y < 0 ? 4.4 : 0.2)

type Road = (y: number) => number
/** `roads` is the carriageway beside each truss (xs order); `road`, the lower, sets the floor under both. */
type Span = { name: string; xs: [number, number]; top: number[]; roads: [Road, Road]; road: Road; footing: [number, number, number]; strut: boolean }
const lower = (a: Road, b: Road): Road => (y) => Math.min(a(y), b(y))
const SPANS: Span[] = [
  // 1988 span, downstream (north): trusses 32 m apart, 4 lanes + 2 HOV lanes.
  { name: '1988', xs: [-77.2, -45.2], top: TOP_N, roads: [ROAD_N, ROAD_HOV], road: lower(ROAD_N, ROAD_HOV), footing: [-86.5, -36.0, 8], strut: true },
  // 1958 span, upstream (south): trusses 20.8 m apart.
  { name: '1958', xs: [50.8, 71.6], top: TOP_S, roads: [ROAD_S, ROAD_S], road: ROAD_S, footing: [46.3, 76.3, 7], strut: false },
]

// ---- Geometry helpers ------------------------------------------------------------

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const ok = dot(cross(sub(b, a), sub(c, a)), n) >= 0
  const [q1, q3] = ok ? [b, d] : [d, b]
  p.tri(a, q1, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, q3, undefined, undefined, undefined, [n, n, n])
}

/**
 * A straight member a→b with a w (across, along `side`) by t section, four
 * flat faces, open ends (they butt into chords).
 */
function member(p: Part, a: V3, b: V3, w: number, t: number, side: V3 = [1, 0, 0], ends = false) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, dot(side, d))))
  const T = cross(d, S)
  const c = (o: V3, u: number, v: number): V3 => add(o, add(mul(S, (u * w) / 2), mul(T, (v * t) / 2)))
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let i = 0; i < 4; i++) {
    const [u0, v0] = corners[i], [u1, v1] = corners[(i + 1) % 4]
    const n = norm(add(mul(S, u0 + u1), mul(T, v0 + v1)))
    quad(p, c(a, u0, v0), c(a, u1, v1), c(b, u1, v1), c(b, u0, v0), n)
  }
  if (ends) {
    quad(p, c(a, -1, -1), c(a, 1, -1), c(a, 1, 1), c(a, -1, 1), mul(d, -1))
    quad(p, c(b, -1, -1), c(b, 1, -1), c(b, 1, 1), c(b, -1, 1), d)
  }
}

/** An upright box, all six faces but the bottom. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  band(p, x0, x1, [y0, y1], () => z1, () => z0, { out: true, in: true, top: true, bottom, ends: true })
}

// ---- One truss -----------------------------------------------------------------------

type Lod = 'low' | 'detail'

function truss(steel: Part, xc: number, span: Span, lod: Lod) {
  // The truss stands beside its own carriageway.
  const s = { ...span, road: span.roads[span.xs.indexOf(xc)] }
  const top = piecewise(NODES.map((y, i) => [y, s.top[i]] as [number, number]))
  const TD = lod === 'low' ? 4.0 : 1.8 // top chord depth
  const W = lod === 'low' ? 2.6 : 1.3 // chord width across
  const botTop = (y: number) => s.road(y) + (lod === 'low' ? 1.2 : 0.9)
  const botBot = (y: number) => s.road(y) - (lod === 'low' ? 3.6 : 2.6)
  const x0 = xc - W / 2, x1 = xc + W / 2

  // Top chord: straight between panel points.
  band(steel, x0, x1, NODES, top, (y) => top(y) - TD, { out: true, in: true, top: true, bottom: true, ends: true })
  // Bottom chord along the roadway's edge, from end post to end post.
  band(steel, x0, x1, stations(BOT_END[0], BOT_END[1], 60), botTop, botBot, { out: true, in: true, top: true, bottom: true, ends: true })

  // Detail: the floor's edge girder, a second band under the chord with a
  // gap between (photos), tied to it at every panel point.
  if (lod === 'detail') {
    band(steel, x0 + 0.1, x1 - 0.1, stations(BOT_END[0], BOT_END[1], 60), (y) => s.road(y) - 3.6, (y) => s.road(y) - 4.8, { out: true, in: true, top: true, bottom: true, ends: true })
    for (const y of stations(BOT_END[0] + 1, BOT_END[1] - 1, 7.5)) member(steel, [xc, y, s.road(y) - 3.7], [xc, y, s.road(y) - 2.5], 0.6, 0.6)
  }

  // Inclined end posts.
  const m = lod === 'low' ? 1.3 : 1.1
  for (const k of [0, 1]) {
    const yt = TOP_END[k], yb = BOT_END[k]
    member(steel, [xc, yt, top(yt) - TD / 2], [xc, yb, botTop(yb) - 0.5], W, 1.6)
  }

  // Web: a post at every panel point (every second one in the low model)
  // and one diagonal per panel, alternating, counted from the nearest tower
  // so both cantilevers mirror.
  const memberW = lod === 'low' ? 1.6 : 0.9, memberT = lod === 'low' ? 1.1 : 0.8
  const towers = [NODES.indexOf(-TOWER), NODES.indexOf(TOWER)]
  // Low model: each web member a flat plate in the truss plane (the steel is
  // double-sided); detail: a four-sided member.
  const web = (a: V3, b: V3) => lod === 'low' ? strip(steel, a, b, memberW, [1, 0, 0]) : member(steel, a, b, memberW, memberT)
  for (let i = 0; i < NODES.length; i++) {
    const y = NODES[i]
    const jt = y < 0 ? towers[0] : towers[1]
    const k = Math.abs(i - jt)
    if (k === 0) {
      // The tower post: the heaviest vertical, over the river pier.
      member(steel, [xc, y, botBot(y)], [xc, y, top(y) - 0.5], 2.0, 3.2)
    } else {
      web([xc, y, botTop(y) - 0.3], [xc, y, top(y) - TD + 0.2])
    }
    if (i < NODES.length - 1) {
      const y2 = NODES[i + 1]
      // The panel's nearest tower and how many panels lie between them; the
      // diagonal's top is at the tower side in even panels.
      const jp = (y + y2) / 2 < 0 ? towers[0] : towers[1]
      const towerRight = jp > i
      const kp = towerRight ? jp - 1 - i : i - jp
      const topAtRight = (kp % 2 === 0) === towerRight
      const [ya, yb] = topAtRight ? [y, y2] : [y2, y]
      web([xc, ya, botTop(ya) - 0.3], [xc, yb, top(yb) - TD + 0.2])
      // Deep panels near the towers: a sub-strut across the panel at mid-depth (detail).
      if (lod === 'detail' && top(y) - s.road(y) > 30) {
        const zm = (botTop(y) + top(y)) / 2, zm2 = (botTop(y2) + top(y2)) / 2
        member(steel, [xc, y, zm], [xc, y2, zm2], 0.6, 0.6)
      }
    }
  }
}

/** Bracing between a span's two trusses: struts and X's in the top plane, floor beams (detail). */
function bracing(steel: Part, s: Span) {
  const top = piecewise(NODES.map((y, i) => [y, s.top[i]] as [number, number]))
  const [xa, xb] = s.xs
  for (let i = 0; i < NODES.length; i++) {
    const y = NODES[i], z = top(y) - 0.9
    member(steel, [xa, y, z], [xb, y, z], 0.7, 0.9, [0, 1, 0])
    if (i < NODES.length - 1) {
      const y2 = NODES[i + 1], z2 = top(y2) - 0.9
      member(steel, [xa, y, z], [xb, y2, z2], 0.45, 0.45, [0, 0, 1])
      member(steel, [xb, y, z], [xa, y2, z2], 0.45, 0.45, [0, 0, 1])
    }
  }
  // Floor beams under the roadway, one per panel point and midway between.
  for (const y of stations(BOT_END[0] + 3, BOT_END[1] - 3, 7.5)) {
    const z = s.road(y)
    band(steel, xa, xb, [y - 0.35, y + 0.35], () => z - 1.0, () => z - 2.4, { out: false, in: false, top: false, bottom: true, ends: true })
  }
  // Sway frames at the tower posts: a portal strut under the peak and an X below it.
  for (const y of [-TOWER, TOWER]) {
    const zt = top(y) - 3
    member(steel, [xa, y, zt], [xb, y, zt], 1.2, 2.5, [0, 1, 0])
    const zl = s.road(y) + 8
    member(steel, [xa, y, zt], [xb, y, zl], 0.7, 0.7, [0, 1, 0])
    member(steel, [xb, y, zt], [xa, y, zl], 0.7, 0.7, [0, 1, 0])
  }
}

/** The deck's underside between the bottom chords, facing down. */
function underside(p: Part, s: Span) {
  const [xa, xb] = s.xs
  band(p, xa + 0.6, xb - 0.6, stations(BOT_END[0], BOT_END[1], 60), (y) => s.road(y) - 1.0, (y) => s.road(y) - 1.6, { bottom: true, ends: true })
}

// ---- Piers ---------------------------------------------------------------------------------

function riverPier(c: Part, s: Span, y: number) {
  const [fx0, fx1, fy] = s.footing
  // Footing just above the water (lidar 7.6 m; OSM bridge:support outline).
  box(c, fx0, fx1, y - fy, y + fy, 0, 7.6)
  const capTop = s.road(y) - 2.6
  for (const xc of s.xs) {
    // Shaft: 6.5 m across, 9 m along, to 47 m (lidar shaft tops 46.8 m).
    box(c, xc - 3.25, xc + 3.25, y - 4.5, y + 4.5, 7.6, 46.6)
  }
  // Cap beam under the tower posts.
  box(c, s.xs[0] - 3.6, s.xs[1] + 3.6, y - 4.9, y + 4.9, 44.8, capTop, true)
  if (s.strut) box(c, s.xs[0] + 3.2, s.xs[1] - 3.2, y - 3.5, y + 3.5, 25.5, 29.0, true)
}

function endPier(c: Part, s: Span, y: number, lod: Lod) {
  const capTop = s.road(y) - 2.6
  for (const xc of s.xs) {
    // Low model: plain shafts from the map's ground (flat under both ends); detail: footed on it.
    if (lod === 'low') { box(c, xc - 1.9, xc + 1.9, y - 2.2, y + 2.2, ground(xc, y), capTop - 2.4); continue }
    const plan: [number, number][] = [[xc - 1.9, y - 2.2], [xc + 1.9, y - 2.2], [xc + 1.9, y + 2.2], [xc - 1.9, y + 2.2]]
    footedLoft(c, ground, [{ plan, z: 'ground' }, { plan, z: capTop - 2.4 }], 2.5, false)
  }
  box(c, s.xs[0] - 2.4, s.xs[1] + 2.4, y - 2.6, y + 2.6, capTop - 2.6, capTop, true)
  if (lod === 'low') return // the strut between the shafts reads only close up
  const zm = (ground(0, y) + capTop) / 2
  box(c, s.xs[0] + 1.9, s.xs[1] - 1.9, y - 1.6, y + 1.6, zm - 1.4, zm + 1.4, true)
}

// ---- The Algiers approach span ---------------------------------------------------------

/**
 * From the trusses' end piers to the outline's end: two plate girders under
 * each roadway's edge (the photos' approach spans are deck girders; lidar
 * shows nothing above the roadway past the end posts), the floor's underside,
 * a concrete parapet on each edge (the map leaves its own out inside the
 * outline), and a bent like the end piers whose cap ends flush with the
 * girders: the abutment face.
 */
function approach(steel: Part, shade: Part, concrete: Part, s: Span, lod: Lod) {
  const y0 = BOT_END[1], y1 = APPROACH_END
  const ys = stations(y0, y1, 30)
  s.xs.forEach((xc, i) => {
    // Low model: the girder and parapet as one fascia on the roadway's edge.
    if (lod === 'low') return band(steel, xc - 0.5, xc + 0.5, ys, (y) => s.roads[i](y) + 1.05, (y) => s.roads[i](y) - 3.4, { out: true, in: true, top: true, bottom: true, ends: true })
    const road = s.roads[i], inward = i === 0 ? 1 : -1
    const xg = xc + inward * 1.2
    band(steel, xg - 0.5, xg + 0.5, ys, (y) => road(y) - 1.0, (y) => road(y) - 3.4, { out: true, in: true, top: false, bottom: true, ends: true })
    band(concrete, xc - 0.25, xc + 0.25, ys, (y) => road(y) + 1.05, (y) => road(y) - 0.9, { out: true, in: true, top: true, bottom: false, ends: true })
  })
  band(shade, s.xs[0] + 0.6, s.xs[1] - 0.6, ys, (y) => s.road(y) - 1.0, (y) => s.road(y) - 1.6, { bottom: true, ends: true })
  endPier(concrete, s, y1 - 2.6, lod)
}

// ---- Lights --------------------------------------------------------------------------------

/** 64 lights along each truss's top profile, end post to end post (Wikipedia: 4 strings of 64). */
function lights(p: Part, xc: number, span: Span, count: number, r: number, tetra: boolean) {
  const s = { ...span, road: span.roads[span.xs.indexOf(xc)] }
  const top = piecewise(NODES.map((y, i) => [y, s.top[i]] as [number, number]))
  const path: V3[] = [
    [xc, BOT_END[0] + 2, s.road(BOT_END[0]) + 4],
    ...NODES.map((y) => [xc, y, top(y) + 0.5] as V3),
    [xc, BOT_END[1] - 2, s.road(BOT_END[1]) + 4],
  ]
  for (const q of along(path, count)) bead(p, q, r, tetra)
}

// ---- Build ---------------------------------------------------------------------------------

if (import.meta.main) {
  const build = (lod: Lod) => {
    const steel = new Part(), shade = new Part(), concrete = new Part(), lamp = new Part()
    for (const s of SPANS) {
      for (const xc of s.xs) {
        truss(steel, xc, s, lod)
        lights(lamp, xc, s, lod === 'low' ? 32 : 64, lod === 'low' ? 1.3 : 0.9, lod === 'low')
      }
      if (lod === 'detail') bracing(steel, s)
      underside(shade, s)
      riverPier(concrete, s, -TOWER)
      riverPier(concrete, s, TOWER)
      endPier(concrete, s, BOT_END[0] + 2.6, lod)
      endPier(concrete, s, BOT_END[1] - 2.6, lod)
      approach(steel, shade, concrete, s, lod)
    }
    return { steel, shade, concrete, lamp }
  }

  // Night: the strings of lamps on the top chords, and the trusses washed in
  // their warm light (night photo): side faces lit, faces looking up less.
  const trussLit = (p: V3, n: V3) => (p[2] < 40 ? 0 : Math.abs(n[2]) > 0.7 ? 0.2 : 0.45)
  const STEEL = { ...finish('ccc-steel', 0x7f8a96), floodlight: trussLit, doubleSided: true }
  const SHADE: Swatch = finish('ccc-steel-shade', 0x66707b)
  const CONCRETE: Swatch = finish('concrete', 0xd8d4ca)
  const LAMP: Swatch = finish('lamp', 0x7f8a96)

  const low = build('low'), detail = build('detail')
  const sets = [
    ['nola-crescent-city-connection.glb', [
      { part: low.steel, material: STEEL },
      { part: low.shade, material: SHADE },
      { part: low.concrete, material: CONCRETE },
      { part: low.lamp, material: LAMP },
    ], 6500, 250 * 1024],
    ['nola-crescent-city-connection.detail.glb', [
      { part: detail.steel, material: STEEL },
      { part: detail.shade, material: SHADE },
      { part: detail.concrete, material: CONCRETE },
      { part: detail.lamp, material: LAMP },
    ], 40000, 1536 * 1024],
  ] as const
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the river towers and the two spans, on the river',
    bearing: 89.5, elevation: 0, towers: [-TOWER, TOWER], ends: BOT_END,
  }
  for (const [file, list, maxTris, maxBytes] of sets) {
    const tris = list.reduce((a, l) => a + l.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Crescent City Connection', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
