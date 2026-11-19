/**
 * Stone Arch Bridge, Minneapolis (1883, Charles C. Smith for James J. Hill's
 * St. Paul, Minneapolis and Manitoba Railway) — procedural, CC0-1.0, no
 * textures.
 * bun generators/msp-stone-arch-bridge.ts
 *
 * A granite and limestone railroad viaduct across the Mississippi just below
 * Saint Anthony Falls, a pedestrian and bicycle bridge since 1994. It runs
 * straight from the east bank (Main Street SE) for most of its length, then
 * curves south-west onto the west bank at Mill Ruins Park. Of its 23 stone
 * arches, two were replaced in 1963–65 by a steel deck truss over the Upper
 * St. Anthony Falls Lock, leaving 21 semicircular stone arches.
 *
 * Note on the lead's brief: it put the truss "near the east (Upper Lock)
 * end". The lock and the truss are at the WEST end, by the Mill City Museum:
 * the lidar shows the lock chamber passing under the bridge there, and every
 * photo (from downriver, from the lock, from the west bank) has the truss
 * next to the lock walls on the downtown side. The model follows the evidence.
 *
 * Frame: map frame x right, y forward, z up, metres, placed at bearing 77,
 * so model +y runs along the straight part of the bridge toward the east
 * bank (ENE) and +x is the downstream side (SSE). Anchor -93.2548760,
 * 44.9806545, the area centroid of the man_made=bridge outline.
 * z = 0 is the Mississippi under the bridge, the map's own terrain over the
 * water (Mapterhorn z15: 228.38 m, flat over the river). Feet on land run down
 * to the map's terrain vertex by vertex (GROUND, Mapterhorn z15 every 5 m in
 * this frame, metres above 228.38 m), per docs/reference.md, Bridges.
 *
 * Bridges rules: one placement for the whole structure. The bridge carries
 * a trail (highway=footway/cycleway), which the model owns as a walkway, so
 * it draws the walking surface, the stone parapet, the red railing and the
 * lamp posts. Walking surface built to (above the river, 228.38 m): 17.67 m
 * (246.05 m) for the first 52 m from the west end, easing to 17.3 m
 * (245.70 m) by 78 m, then level across the truss and the river to the east
 * end (lidar, tools/bridge_ele.py measure on the trail, way/23115958; spread
 * 0.01–0.03 m). OSM `ele` for those nodes is proposed in
 * landmarks-scratch/osm-ele/msp-stone-arch-bridge.osc (+0.75 m, GEOID18 to
 * EGM96), not uploaded.
 *
 * Ends: both land on the banks. At the west end the trail node 246706920
 * reads 246.07 m against 246.05 m bare earth, and the map's terrain there is
 * at the walk (17.7 m), so the solid west abutment runs from its face 8 m
 * in to the outline's end on the ground. At the east end the trail lands on
 * the bank under Main Street SE (bare earth 245.5 m a metre past the last
 * bridge node); the map's coarser terrain only reaches the walk 6.5 m past
 * the outline, so the east abutment runs on that far and ends on the
 * ground (terrain 17.1 m under its end face).
 *
 * Replaces: the man_made=bridge outline way/746175003 (the whole bridge,
 * drawn end to end), the overlapping man_made=bridge way/1572286114 over the
 * truss span, and the pier areas (bridge:support=pier) the model draws:
 * ways 1572286118, 1572286120–1572286124, 1572286129, 1572286130,
 * 1572286133–1572286137.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/746175003
 *   (bridge=viaduct, bridge:structure=arch, material=limestone), 8.0–8.6 m
 *   between its long edges; the truss span way/1572286114 (57 m, between the
 *   piers at the lock); the pier areas east of the truss with their centres
 *   and thicknesses along the bridge (4.0–5.5 m); the east abutment
 *   way/1572286137. The piers of the curved west part are not mapped.
 * - Lidar (measured): USGS 3DEP MN_CentralMissRiver_4_B22 (flown 2022), 1 m
 *   grids over the east arches, the west curve and the east end. Walking
 *   surface 245.7 m (17.3 above the map's water) the whole way, 246.1 m at
 *   the west end; stone parapet tops about 0.45 m and the railing about
 *   1.5 m over the walk; lamp heads 4.7–4.8 m over the walk, one about every
 *   13.5 m alternating sides (downstream at mid-span, upstream over the
 *   piers); water below the falls 229.2–229.8 m. The lock chamber passes
 *   under the truss. The banks under the west end stand 12–14 m above the
 *   water, 3–5 m under the deck.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 77, 5 m).
 * - Published (Wikipedia, "Stone Arch Bridge (Minneapolis)"; HAER MN-6;
 *   National Register): 2,100 ft (640 m) long, 28 ft (8.5 m) wide, 23 arches
 *   originally, two replaced by a steel truss for the lock (1963–65),
 *   granite and limestone, a curve of about 6 degrees at the west end.
 * Photos (evidence, Wikimedia Commons):
 * - August Schwerdfeger, "Stone Arch Bridge as viewed from downriver
 *   2019-08-08.jpg", CC BY 4.0 (the whole length from downstream, south-east:
 *   arch rhythm, crown and springing heights, the truss at the west end):
 *   https://commons.wikimedia.org/wiki/File:Stone_Arch_Bridge_as_viewed_from_downriver_2019-08-08.jpg
 * - Michael Barera, "Minneapolis April 2025 33 (Stone Arch Bridge and
 *   Mississippi River).jpg", CC BY-SA 4.0 (from the east bank, upstream:
 *   east arches, the truss beside the lock):
 *   https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_33_(Stone_Arch_Bridge_and_Mississippi_River).jpg
 * - Michael Barera, "Minneapolis April 2025 42 (Stone Arch Bridge and
 *   Mississippi River).jpg", CC BY-SA 4.0 (from the west bank, downstream:
 *   the truss, its piers, the arches either side):
 *   https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_42_(Stone_Arch_Bridge_and_Mississippi_River).jpg
 * - Mmullie (WMF), "Minneapolis Stone Arch Bridge.jpg", CC BY-SA
 *   4.0 (panorama from the west bank: the curve arches, the truss):
 *   https://commons.wikimedia.org/wiki/File:Minneapolis_Stone_Arch_Bridge.jpg
 * - Tony Webster, "Stone Arch Bridge, Minneapolis (17183544635).jpg", CC BY
 *   2.0 (three arches side-on: semicircles, wall above the crown, the red
 *   railing as a band, stone colour):
 *   https://commons.wikimedia.org/wiki/File:Stone_Arch_Bridge,_Minneapolis_(17183544635).jpg
 * - Thomson200, "Stone Arch Bridge (Minneapolis) Sept 2019.jpg", CC0 (on the
 *   deck: coping stones, red railing, red lamp posts with bell lanterns):
 *   https://commons.wikimedia.org/wiki/File:Stone_Arch_Bridge_(Minneapolis)_Sept_2019.jpg
 * - SidewalkMD, "Stone Arch Bridge with low water level.jpg",
 *   CC BY-SA 4.0 (under the bridge: square pier ends, lamp posts):
 *   https://commons.wikimedia.org/wiki/File:Stone_Arch_Bridge_with_low_water_level.jpg
 * - Mulad (Commons, public domain), "Stone Arch Bridge and lock.jpg" (from upstream,
 *   north-west: the curve, the truss over the lock, the east arches):
 *   https://commons.wikimedia.org/wiki/File:Stone_Arch_Bridge_and_lock.jpg
 *
 * Numbers
 * - Arches: semicircles between the piers, crowns (intrados) level at 14.4 m
 *   over the water, 2.9 m under the walk (estimated from the side-on photos:
 *   the wall above the crown is about a quarter of the radius). Spans follow
 *   from the OSM pier centres and thicknesses on the straight part (19–29 m).
 * - West curve: nine arches (21 stone arches less the twelve east of the
 *   truss; Wikipedia numbers the replaced arches 13 and 14) spaced evenly
 *   between the truss's west pier and an 8 m west abutment, 19.8 m spans on
 *   4 m piers, so the panorama's big arches next to the truss and the lock
 *   photo's low openings where the west bank rises both come out; the
 *   westernmost openings are partly in the bank.
 * - Truss: a deck truss 5.8 m deep (photo-scaled against the 17.3 m deck),
 *   ten panels with posts and alternating diagonals, rust red.
 * - Parapet 0.6 m wide, its top 0.45 m over the walk; railing a solid band
 *   0.85 m tall on it (the low model draws the railing as the red band it
 *   reads as from a distance); lamp posts 4.8 m with a bell lantern.
 * - Night: the lamps, and the arch soffits and jambs washed by the indirect
 *   lighting added in 2005 (Wikipedia; night photo by Tiggr222, "Pillsbury A
 *   Mill through the Stone Arch Bridge.jpg", CC BY-SA 4.0), as _FLOODLIGHT on
 *   a soffit material of the same stone; the outer walls stay dark.
 * - Colours: warm buff limestone and granite from the daylight photos, pulled
 *   to the palette's lightness; railing, lamp posts and truss oxide red.
 *
 * Doubts
 * - The piers of the west curve and their spans are estimated (not mapped
 *   in OSM; lidar can't see under the deck). Their count follows the
 *   published 21 arches.
 * - The truss is 56 m between the pier faces here against a published
 *   200 ft (61 m) Warren truss: the OSM pier positions win.
 * - No pier cutwaters or footings; the arch rings are flush with the walls.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { bead, groundAt, rod, stations, truss, type GroundGrid } from './bridge-kit'

const LON0 = -93.254876, LAT0 = 44.9806545, BEARING = 77
const KX = Math.cos((LAT0 * Math.PI) / 180) * (Math.PI / 180) * 6378137, KY = (Math.PI / 180) * 6378137
const BR = (BEARING * Math.PI) / 180
/** lon/lat → model plan (x right, y forward). */
const toModel = ([lon, lat]: [number, number]): [number, number] => {
  const e = (lon - LON0) * KX, n = (lat - LAT0) * KY
  return [e * Math.cos(BR) - n * Math.sin(BR), e * Math.sin(BR) + n * Math.cos(BR)]
}

// The centre line, midway between the outline's long edges (OSM), west to east.
const CENTRE: [number, number][] = [
  [-93.2587238, 44.9808097], [-93.2585156, 44.9807435], [-93.2583388, 44.980671], [-93.258175, 44.9806075],
  [-93.2580501, 44.9805627], [-93.2578513, 44.980505], [-93.2576953, 44.9804655], [-93.2575411, 44.9804321],
  [-93.2573997, 44.9804045], [-93.257171, 44.9803745], [-93.2569381, 44.9803498], [-93.2568014, 44.9803388],
  [-93.2566221, 44.9803331], [-93.2564185, 44.9803336], [-93.256232, 44.9803428], [-93.2560523, 44.9803579],
  [-93.2553172, 44.9804587], [-93.2541372, 44.9806517], [-93.2527959, 44.9808694], [-93.2514752, 44.9810828],
  [-93.2511614, 44.9811342], [-93.2508711, 44.9811624],
]
// A light smoothing of the curve (the midpoints are a little jagged).
const raw = CENTRE.map(toModel)
// The east end runs on 6.5 m past the outline, to where the map's terrain
// (the bank under Main Street SE) reaches the walk, so the deck lands on it.
{
  const [a, b] = [raw[raw.length - 2], raw[raw.length - 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1])
  raw.push([b[0] + ((b[0] - a[0]) / l) * 6.5, b[1] + ((b[1] - a[1]) / l) * 6.5])
}
const path = raw.map((p, i) => i === 0 || i === raw.length - 1 ? p
  : [(raw[i - 1][0] + 2 * p[0] + raw[i + 1][0]) / 4, (raw[i - 1][1] + 2 * p[1] + raw[i + 1][1]) / 4] as [number, number])
const cum = [0]
for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
const LEN = cum[cum.length - 1]
function at(s: number): [number, number] {
  s = Math.min(Math.max(s, 0), LEN)
  let i = 1
  while (i < path.length - 1 && cum[i] < s) i++
  const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1])
  return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t]
}
/** Unit tangent, averaged over a few metres so the walls bend smoothly. */
function tan(s: number): [number, number] {
  const a = at(Math.max(0, s - 3)), b = at(Math.min(LEN, s + 3))
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
}
/** Right-hand normal (downstream side). */
const nrm = (s: number): [number, number] => { const t = tan(s); return [t[1], -t[0]] }
/** Arc length of the centre-line point nearest a lon/lat. */
function project(ll: [number, number]): number {
  const p = toModel(ll)
  let best = Infinity, bs = 0
  for (let s = 0; s <= LEN; s += 0.25) {
    const q = at(s), d = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (d < best) { best = d; bs = s }
  }
  return bs
}

// ---- The map's terrain, metres above the river (Mapterhorn z15, 5 m) ------
// Rows run along y from y0, columns along x from x0.
const GROUND: GroundGrid = { x0: -100, y0: -290, step: 5, z: [
  [13.2,13.8,17.1,17.7,17,15.9,16.8,16.7,16.6,16.5,16.4,16.3,16.3,16.5,16.6,16.5,16.4,16.2,16.1,16,16,16,16,16.1,16.3,16.4,16.3,16.2,16.1],
  [12.4,12.1,12.5,14.2,14.3,13.9,13.8,16.3,16.3,16.4,16.3,16.2,16.1,16.1,16.4,16.5,16.4,16.2,15.9,15.9,15.9,15.8,15.9,16,16,16.1,16,15.9,15.9],
  [12.3,12.2,12.1,12.1,12.5,12.3,12.2,13.7,15.9,15.9,16.1,16.1,16,15.9,16,16.1,15.8,15.6,15.8,15.8,15.8,15.8,15.9,15.9,15.9,16,16,15.9,16.1],
  [12.4,12.2,12.1,11.9,12,12,12.1,12.4,13.9,15.3,15.8,15.9,15.9,15.8,15.7,15,14.9,15.3,15.6,15.7,16.1,16.2,15.8,15.8,15.9,15.9,15.9,16.1,15.9],
  [12.4,12.3,12.1,12,11.8,11.9,12,11.9,12.8,14.3,14.8,15.6,15.8,15.7,14.1,14,14.5,15,15.6,16,16.3,16.3,16.2,15.8,15.8,15.9,15.9,15.9,16.1],
  [12.5,12.4,12.2,12,11.9,11.8,11.9,11.9,11.9,13.3,14.3,14.4,15.2,13.6,12.9,13.6,14.1,15,16,16.1,16.2,16.2,16.2,16.1,15.8,15.8,15.8,15.9,15.9],
  [12.5,12.4,12.3,12.1,11.9,11.8,11.7,11.8,11.9,11.8,13.9,14,11.9,12,12.1,13.5,13.9,12.8,11.8,15.8,16.1,16.1,16.2,16.2,15.8,15.8,15.8,15.8,15.8],
  [12.5,12.5,12.3,12.2,12,11.8,11.7,11.7,11.8,11.8,11.7,11.6,11.7,10.5,9.7,11.4,11.7,4.2,7.2,10.3,16,16.1,15.9,15.1,15.6,15.7,15.7,15.7,15.8],
  [12.5,12.4,12.4,12.2,12.1,11.9,11.7,11.6,11.6,11.6,11.5,11.6,10.3,4.3,4.7,4.4,2.5,1.6,2.7,7.1,13.2,15,13.5,13.8,14.9,15.7,15.7,15.6,15.7],
  [12.6,12.5,12.4,12.4,12.2,12,11.8,11.7,11.6,11.5,11.5,10.5,5.2,1.4,2.6,2.8,2.4,1.2,1.5,3.3,5.5,9.5,11.5,12.7,13.9,15.1,15.7,15.8,15.6],
  [13.3,12.5,12.4,12.3,12.3,12.1,11.9,11.8,11.6,11.5,10.9,8,4.2,1.3,1.2,2.9,2.6,1,1.3,3.3,6.6,8.7,9.3,12.1,13.6,14,15.2,15.7,15.7],
  [15,12.6,12.5,12.4,12.3,12.3,12,11.8,11.6,11.5,10.8,8.8,5.9,2.9,1,1.3,2.5,1.1,1.3,3.1,3.7,6.8,8.6,9.9,11.7,12.9,14.3,15.4,15.7],
  [17.2,13.7,12.5,12.4,12.4,12.2,12.1,11.9,11.4,11.2,10.9,9.4,7,4.4,2.4,0.9,0.9,0.9,1.2,2.9,3.1,3.7,9,9.5,10,11.5,13.2,14.6,15.6],
  [16.4,17.1,12.8,12.5,12.5,12.4,12.4,12.3,11.6,10.9,10.7,10.1,8.3,6.5,4.2,2.4,0.9,0.8,1.5,2.8,2.7,3.1,4,7.2,8.3,10.1,11.8,13.3,14.6],
  [3.5,17.1,16.5,12.6,12.6,12.5,12.5,12.3,12.2,11.3,10.3,10.2,9.3,8.2,6,3.9,2,0.9,1.1,1.7,2.6,2.9,3.1,3.7,7.1,9.1,10.7,12,13.3],
  [0,7.9,17.1,15.2,12.6,12.5,12.6,12.4,12.3,11.6,10,9.8,9.6,8.6,7.3,5.3,3.3,1.3,0.9,1.2,2.7,2.7,2.9,3.2,4.7,8.5,9.4,10.5,11.7],
  [0,0,12.5,14.2,12.6,12.6,12.5,12.4,12.5,11.7,9.9,9.4,9.2,9,8,6.6,4.7,2.8,0.9,0.9,1.7,2.1,3,3.2,3.1,4,8.2,8.8,9.6],
  [0,0,0.3,16.1,13.2,15.6,12.6,12.5,12.6,11.7,10.1,9.3,8.9,8.7,8.5,7.6,5.8,3.9,2.2,0.9,0.9,2.5,2.9,2.6,1.5,2.9,5.3,6.4,7.7],
  [0,0,0,1.3,16.3,16.4,14.5,12.6,12.6,11.8,10.5,9.6,8.8,8.3,8.1,8,6.7,4.8,3.4,1.7,0.9,1,2.4,1,2.2,2.7,3.2,4.1,6.5],
  [3.9,0,0,0,2.3,16.5,16.7,13.1,12.6,12.4,11.2,10.1,9,8.2,7.8,7.7,7.5,6.1,4.6,3,1.2,0.8,0.9,2.4,2.6,2.6,2.9,2.9,5.7],
  [14.2,1.5,0,0,0,4.4,16.7,14.7,12.8,12.5,11.9,10.8,9.5,8.4,7.6,7.4,7.4,7,5.8,4.1,3.3,1,0.9,1.1,2.3,2.3,2.8,2.6,4.1],
  [7,14.8,0.5,0,0,0,7.7,16.5,13.3,12.6,12.5,11.4,10.3,8.9,7.8,7.2,7.1,7.1,6.7,5.5,3.7,2.5,0.9,0.8,0.9,2.2,2.7,2.4,3.4],
  [0.7,8.5,13.4,0.2,0,0,0,12.1,13.9,12.6,12.5,12.4,11.1,9.6,8.2,7.2,6.8,6.8,6.7,6.6,5.3,3.5,1.8,0.9,0.9,1.5,2.4,2.1,2.7],
  [0,1.7,10.2,12.2,0,0,0,0.2,12.8,12.8,12.6,12.5,12.3,10.6,9,7.6,6.7,6.5,6.5,6.5,6.4,4.9,3.5,1.1,0.9,0.9,1.5,1.7,2],
  [0,0,3,12.2,8,0,0,0,0.6,15.8,12.8,12.6,12.5,12,10.2,8.5,7.1,6.4,6.2,6.2,6.3,6,4.3,3,0.9,0.8,0.9,1.1,1.8],
  [0,0,0,4.4,14.2,3.8,0,0,0,2.9,17.2,16.9,12.7,12.5,11.6,9.9,8.2,6.8,6.1,6,5.7,5.8,5.6,3.7,2.3,0.9,0.9,0.9,1.2],
  [0,0,0,0,6.1,15.8,1.2,0,0,0,5.4,17.2,14.5,12.6,12.5,11.1,9.5,8,6.8,6.1,5.8,5.5,5.4,5.1,3.6,2.1,0.9,0.9,0.9],
  [0,0,0,0,0.2,7.8,14.1,0,0,0,0.1,7.6,17.1,14.9,12.6,12.4,10.6,9.3,7.9,6.7,6.1,5.5,5.3,5.2,4.3,3.4,1.8,0.9,0.9],
  [0,0,0,0,0,0.5,5.1,0,0,0,0,0.1,14.6,17.1,12.9,12.6,12.3,10.4,9,7.2,6.4,5.7,5.2,5,5,3.8,3.2,1.5,0.9],
  [0,0,0,0,0,0,0,0,0,0,0,0,0.8,17.1,16.1,12.7,12.6,10.9,9,7.1,6.1,5.5,5.1,4.8,4.8,4.4,3.5,2.7,1.1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,3.2,16.9,15.6,10.9,9.4,8,6.3,5.3,5,4.9,4.6,4.6,4.6,3.8,3.4,2.4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.1,17.1,12.4,7.9,6.5,5.1,4.2,4.5,4.5,4.4,4.4,4.5,4.3,3.4,3],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9.8,17.1,9.1,5,3.8,3.5,4,4.2,4.3,4.2,4.3,4.2,3.7,3.2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,6.3,3.2,3.5,3.2,3.1,3.4,3.6,4.1,4,4,4,3.8,3.3],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2,3,3.2,3.2,3.1,2.9,3.1,3.7,3.8,3.8,3.8,3.7,3.4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3,3,3.2,3.2,3,2.8,3,3.6,3.6,3.6,3.6,3.4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.9,3.2,3.1,3.1,2.8,2.8,3.4,3.4,3.4,3.3,3.2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.5,3.1,3.1,2.9,2.9,3.2,3.2,3.1,3.1,3.1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.2,3,2.9,2.9,2.7,2.8,3,2.9,2.9],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,2.2,2.4,2.1,2,2.4,2.8,2.7,2.6],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,1.7,1.8,1.8,2.1,2.6,2.6,2.5],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.4,1.1,1.8,1.9,2.3,2.5,2.4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.7,1.8,1.9,1.9,2.3,2.3],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.3,1.8,1.7,1.8,1.8],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1,1.4,1.1,0.9],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.4,0.6,0.1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2,0.9],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0.1,1.2,1.3,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,2.5,2.3,1.8,0.7,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4.3,5.7,7.2,6.2,4.9,2.9,0.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9.1,9.2,9.3,9.2,8.7,7.6,5,2.4,0.8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9.6,9.5,9.5,9.4,9.4,9.4,9,7.7,4.9,1.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9.6,9.5,9.6,9.5,9.4,9.4,9.5,9.5,6.9,1.7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [9.5,9.3,9.3,9.4,9.5,8.9,8.4,8.3,7.1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [8.2,7.5,6.6,6.3,6.5,6.1,4.5,4.4,4.2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3.4,3.1,2.4,2.1,2.3,1.5,1.1,0.8,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0.4,1,1.1,0.7,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0.2,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3.2,3.1,2.6,2.2,1.7,1.3,0.8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [5.5,5.6,5.6,5.6,5.6,5.4,5.3,3.8,0.9,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [5.8,5.7,5.8,5.8,5.8,5.8,5.8,6.4,6.5,4,2.9,0.9,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [5.8,5.9,5.8,5.9,5.9,6.3,6.2,6,6.3,4.9,3.6,2.8,2.2,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [5.9,5.9,5.9,5.9,6.1,6.7,6.6,5.4,4.9,4.2,3.7,3.4,3,1.8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [5.9,5.9,6,5.9,5.9,6.3,5.8,5.3,5,4.6,5.1,6.5,6.3,4.7,2.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [5.9,5.9,6,6.1,6.2,6.3,6,5.7,5.3,5.6,7.5,7.8,7.9,7.4,5.7,2.3,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,5.9,6,6.2,6.4,6.4,6.3,6.2,6,6.3,7.9,8,8.1,8,7.5,5.7,1.4,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,6.1,6.1,6.2,6.5,6.7,6.7,6.8,6.9,6.9,8,8.1,8.2,8.1,8,7.5,4.5,0.6,0,0,0,0,0,0,0,0,0,0,0],
  [6,6.1,6.2,6.3,6.6,6.8,7.2,7.4,7.7,7.7,7.9,8.3,8.2,8,8.1,7.9,7.4,3.2,0.1,0,0,0,0,0,0,0,0,0,0],
  [6,6.1,6.3,6.4,6.7,7,7.4,7.6,7.8,8,8,8.1,8.3,8.1,8.1,8,7.8,5.9,1.3,0,0,0,0,0,0,0,0,0,0],
  [6,6.2,6.4,6.8,7.3,7.2,7.3,7.6,7.9,8,8.2,8.3,8.3,8.2,8.1,8,7.8,7.2,3.4,0,0,0,0,0,0,0,0,0,0],
  [6.2,6.2,6.4,6.8,7.1,7.5,7.6,7.7,7.9,8.3,8.5,8.4,8.6,8.3,8.2,8.1,7.9,7.3,4.9,0.4,0,0,0,0,0,0,0,0,0],
  [6,6.2,6.8,9,7.7,7.2,7.4,7.7,8.2,7.9,8.3,8.7,8.6,8.4,8.3,8.2,7.9,7.2,6,1.1,0,0,0,0,0,0,0,0,0],
  [6.1,6.9,8.2,9.9,8.4,7.1,7.3,7.5,7.8,7.9,8.3,8.6,8.7,8.4,8.2,8.1,7.4,6.3,4.9,2.6,0,0,0,0,0,0,0,0,0],
  [5.9,6.2,6.6,7.5,7,6.9,7.2,7.4,7.6,8,8.3,8.5,8.9,8.5,8.4,8.1,6.9,5.8,4.6,3.2,0.6,0,0,0,0,0,0,0,0],
  [5.9,6.1,6.2,6.4,6.8,6.8,7.1,7.3,7.7,8.2,8.3,8.4,8.8,8.7,8.5,8,7.7,7.4,6.8,5.5,2.7,0,0,0,0,0,0,0,0],
  [3.9,4.6,4.1,4.6,5.5,6,6.6,6.5,7.3,8,7.9,8.3,8.5,9.4,9.4,9.5,9.4,9.1,8.8,7.3,3.4,0,0,0,0,0,0,0,0],
  [0,0.5,1.3,0.9,1.3,2.1,3.5,4.3,4.6,5.4,5.6,5.8,6.6,8.2,9.1,9.5,9.6,9.6,9.2,7,3.2,0,0,0,0,0,0,0,0],
  [0,0,0.1,0.1,0.2,0.3,0.4,1.7,3.1,2.9,3.9,4.5,4.7,4.8,5.7,6.7,7.5,8.1,7.6,5.4,1.9,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0.1,0.5,0.5,0.7,0.9,1,1.5,2.8,3.9,4.4,4.8,4.6,2.8,0.3,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2,1.1,2.1,2.1,0.7,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0.1,0.4,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3.6,2.8,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6.7,5.8,0.2,0.1,1.9,1.6,1,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6.8,6.8,6.4,6.1,5.5,4.8,3,1.3,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4.5,5.3,6.2,6.2,5.8,5.1,3,2,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0.7,1.9,1.8,1.4,2.7,3.1,1.5,0.6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2.4,1.8,1.3,0.9,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6.4,6.7,5.6,4.8,3.1,1.8,1,0.6,0.3,0.1,0.1,0,0,0,0,0,0,0.1,0.1,0,0,0,0,0,0,0,0,0,0],
  [12.5,12.3,11.2,8.7,6.4,5.5,5.4,4.8,4.2,2.9,1.9,1.3,0.7,0.4,0.3,0.3,0.3,0.3,0.4,0.6,0.3,0.1,0,0,0,0,0,0,0],
  [16.9,16.4,15.4,14,12.9,11.3,9.6,8.9,8,6.9,5.7,5.1,4.6,3.4,2.7,2.7,3.4,2.9,2.1,1.8,1.7,0.8,0.5,0.2,0,0,0,0,0],
  [18.2,18.5,18.4,17.9,17.1,16.5,15.5,13.8,12.1,10.7,9.1,8.2,7.5,6.5,5.6,5.8,5.9,6.8,4.9,4.7,4.1,2.8,3.2,2.5,1.4,0.6,0.1,0.1,0],
  [18.1,18,18.1,18,18,18.1,18.2,17.6,16.6,15.7,14.6,12.5,11.2,12.7,13.9,14.1,12.8,12.1,9.9,8.1,6.7,5.5,6.4,5.6,4.7,4,2.2,2.3,2.7],
  [17.8,17.7,17.9,17.9,17.9,18,18.2,18.7,18.5,17.6,17.1,15.9,15.4,15.5,16.4,16.9,16.5,15.5,14.2,13.1,11.5,11.5,11.8,10.2,8.1,7.3,5.7,4.9,5],
  [17.9,17.8,17.6,17.8,18,18.1,18.2,18.6,18.8,18.7,18,17.6,17.4,17.1,17.1,17,17,17.1,17,16.6,15,15.2,16.2,14.8,11.8,10.6,8.3,6.1,5.9],
  [17.8,17.8,17.8,17.9,18,18.1,18.3,18.6,18.8,18.7,18.5,18.3,17.8,17.4,17.2,17.1,17.2,17.1,17,17.2,16.4,16.6,17.3,17.3,16.6,12.9,9.7,7.4,6.4],
  [17.7,17.7,18.1,18.1,18.2,18.2,18.4,18.6,18.8,18.6,18.4,18.1,17.8,17.5,17.4,17.2,17.1,17.1,17.1,17,16.9,17,17.2,17.3,16.8,13.9,10.7,7.6,6.3],
  [17.8,17.8,18.2,18.2,18.2,18.5,18.5,18.5,18.5,18.5,18.3,18.1,17.8,17.5,17.3,17.4,17.2,17.1,16.9,16.7,16.9,17.1,17.2,17.3,17.1,15.4,12,8.5,6.8],
  [18.2,18.1,18.3,18.4,18.4,18.6,18.5,18.3,18.4,18.4,18.1,17.8,17.6,17.6,17.5,17.4,17.3,17.3,17.2,17.1,17.1,16.9,17,17.2,17.2,15.8,12.5,9.4,7.3],
  [18.6,18.4,18.5,18.5,18.5,18.6,18.6,18.5,18.4,18.3,17.9,17.6,17.4,17.3,17.4,17.4,17.3,17.1,17.1,17.2,17.1,16.9,17.2,17.1,17.2,16.6,13.3,10,7.7],
  [19,18.7,18.7,18.5,18.6,18.7,18.7,18.6,18.5,18.2,17.9,17.6,17.4,17.3,17.3,17.3,17.3,17.2,16.6,17.1,17,16.6,17.2,17.1,17.2,16.9,14.6,11.5,8.9],
] }
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- Heights ---------------------------------------------------------------
const HW = 4.25 // half width, outer wall faces
const PAR = 0.6 // parapet thickness
const WALK = 17.3 // walking surface over the river
// lidar (tools/bridge_ele.py): 246.04–246.07 m for the first 52 m, easing to
// 245.70 m by 78 m, then level to the east end
const rise = (s: number) => (s <= 52 ? 0.37 : s >= 78 ? 0 : 0.37 * (78 - s) / 26)
const walk = (s: number) => WALK + rise(s)
const parTop = (s: number) => walk(s) + 0.45
const CROWN = 14.4

// ---- Piers and bays (arc length along the centre line) ---------------------
type Pier = { s: number; t: number }
const sWA = 8 // the west abutment's face, 8 m in from the outline's end
const sTW = project([-93.2560501, 44.9803534]) // the truss's west pier
const T_TW = 5
const east: [number, number, number][] = [ // OSM pier centroids and thickness along the bridge
  [-93.2552899, 44.9804668, 5.5], [-93.2549186, 44.9805276, 5.1], [-93.2544998, 44.9805943, 4.7],
  [-93.2541062, 44.9806567, 4.8], [-93.2537341, 44.9807161, 4.8], [-93.2534228, 44.9807691, 4.9],
  [-93.2530946, 44.9808211, 5.5], [-93.2527618, 44.9808738, 5.3], [-93.2524336, 44.9809289, 4.1],
  [-93.2521073, 44.980981, 4.3], [-93.2517722, 44.9810348, 4.1], [-93.2514499, 44.9810869, 4.0],
]
const sEA = project([-93.2511619, 44.9811341]) // the east abutment's west face
const westPiers: Pier[] = [{ s: sWA, t: 0 }]
{
  const a = sWA, b = sTW - T_TW / 2, n = 9, tp = 4
  // nine equal openings between the abutment face and the truss pier's face
  const span = (b - a - (n - 1) * tp) / n
  for (let k = 1; k < n; k++) westPiers.push({ s: a + k * span + (k - 0.5) * tp, t: tp })
}
const TW: Pier = { s: sTW, t: T_TW }
const eastPiers: Pier[] = east.map(([lo, la, t]) => ({ s: project([lo, la]), t }))
const TE = eastPiers[0]
const EA: Pier = { s: sEA, t: 0 }
const archPiers = [...westPiers, TW]
const archPiers2 = [...eastPiers, EA]
type Bay = { a: number; b: number }
const bays: Bay[] = []
for (const list of [archPiers, archPiers2])
  for (let i = 0; i + 1 < list.length; i++) bays.push({ a: list[i].s + list[i].t / 2, b: list[i + 1].s - list[i + 1].t / 2 })
const trussA = TW.s + TW.t / 2, trussB = TE.s - TE.t / 2

// ---- Materials ---------------------------------------------------------------
// The indirect lighting added in 2005 (Wikipedia) washes the arch soffits and
// jambs warm, while the outer walls stay dark (night photo: "Pillsbury A Mill
// through the Stone Arch Bridge"). The soffits are a second material of the
// same stone so they can carry the floodlight alone.
const STONE = finish('limestone', 0xdcc9a3)
const SOFFIT = { ...finish('limestone-soffit', 0xdcc9a3), floodlight: () => 0.9 }
const PAVE = finish('paving', 0xc9c4ba)
const RUST = { ...finish('oxide-red', 0xa65a48), doubleSided: true }
const LAMP = finish('lamp', 0x9a5444)
const stone = new Part(), soffit = new Part(), pave = new Part(), rust = new Part(), lamp = new Part()

// ---- Helpers ---------------------------------------------------------------
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function faceN(p: Part, q: V3[], n: V3) {
  const g = (i: number, j: number, k: number) => {
    const u: V3 = [q[j][0] - q[i][0], q[j][1] - q[i][1], q[j][2] - q[i][2]]
    const v: V3 = [q[k][0] - q[i][0], q[k][1] - q[i][1], q[k][2] - q[i][2]]
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]] as V3
  }
  const c = g(0, 1, 2)
  const pts = dot(c, n) >= 0 ? q : [...q].reverse()
  for (let i = 1; i + 1 < pts.length; i++) {
    const cc = g(0, i, i + 1).map((v) => v) as V3
    if (Math.hypot(...cc) < 1e-9) continue
    p.tri(pts[0], pts[i], pts[i + 1])
  }
}
/** A point at arc length s, `off` metres to the right of the centre line, at height z. */
const W = (s: number, off: number, z: number): V3 => { const c = at(s), n = nrm(s); return [c[0] + n[0] * off, c[1] + n[1] * off, z] }
const gW = (s: number, off: number) => { const p = W(s, off, 0); return ground(p[0], p[1]) }
const out = (s: number, side: number): V3 => { const n = nrm(s); return [n[0] * side, n[1] * side, 0] }

// ---- Walls: solid stretches and the arch bays ------------------------------
/** A wall column on both faces from `bot` up to the parapet top. */
function column(s0: number, s1: number, b0: (side: number) => number, b1: (side: number) => number) {
  for (const side of [-1, 1]) {
    const o = side * HW
    const n = out((s0 + s1) / 2, side)
    faceN(stone, [W(s0, o, b0(side)), W(s1, o, b1(side)), W(s1, o, parTop(s1)), W(s0, o, parTop(s0))], n)
  }
}
function solid(s0: number, s1: number, step = 4) {
  const ss = stations(s0, s1, step)
  for (let i = 0; i + 1 < ss.length; i++) column(ss[i], ss[i + 1], (sd) => gW(ss[i], sd * HW), (sd) => gW(ss[i + 1], sd * HW))
}
/** The end of a masonry stretch, across the bridge from the ground to the parapet top. */
function endFace(s: number, dir: number, zTop = parTop(s)) {
  const xs = stations(-HW, HW, 3)
  const t = tan(s), n: V3 = [t[0] * dir, t[1] * dir, 0]
  for (let i = 0; i + 1 < xs.length; i++)
    faceN(stone, [W(s, xs[i], gW(s, xs[i])), W(s, xs[i + 1], gW(s, xs[i + 1])), W(s, xs[i + 1], zTop), W(s, xs[i], zTop)], n)
}
/**
 * The truss's piers: wider than the bridge (OSM pier way/1572286118 is 15 m
 * across; the photos show them standing proud of the walls as buttresses),
 * from the ground to the parapet top.
 */
function pierBlock(sc: number, t: number, hw: number) {
  const s0 = sc - t / 2, s1 = sc + t / 2
  const xs = stations(-hw, hw, 3)
  for (const [s, dir] of [[s0, -1], [s1, 1]] as [number, number][]) {
    const tt = tan(s), n: V3 = [tt[0] * dir, tt[1] * dir, 0]
    for (let i = 0; i + 1 < xs.length; i++)
      faceN(stone, [W(s, xs[i], gW(s, xs[i])), W(s, xs[i + 1], gW(s, xs[i + 1])), W(s, xs[i + 1], parTop(s)), W(s, xs[i], parTop(s))], n)
  }
  for (const side of [-1, 1]) {
    const o = side * hw
    faceN(stone, [W(s0, o, gW(s0, o)), W(s1, o, gW(s1, o)), W(s1, o, parTop(s1)), W(s0, o, parTop(s0))], out(sc, side))
    // the cap over the buttress, outside the parapet
    faceN(stone, [W(s0, side * HW, parTop(s0)), W(s1, side * HW, parTop(s1)), W(s1, o, parTop(s1)), W(s0, o, parTop(s0))], [0, 0, 1])
  }
}
const SEG = 12 // segments per semicircle
for (const { a, b } of bays) {
  const r = (b - a) / 2, c = (a + b) / 2, spring = CROWN - r
  const pts = Array.from({ length: SEG + 1 }, (_, k) => {
    const th = Math.PI - (Math.PI * k) / SEG
    return { s: c + r * Math.cos(th), z: spring + r * Math.sin(th) }
  })
  for (let k = 0; k < SEG; k++) {
    const p = pts[k], q = pts[k + 1]
    // spandrel over the opening
    column(p.s, q.s, (sd) => Math.max(p.z, gW(p.s, sd * HW)), (sd) => Math.max(q.z, gW(q.s, sd * HW)))
    // the barrel vault's underside, facing the arch's centre
    const mid = (p.s + q.s) / 2, cz = spring
    const C = at(c), M = W(mid, 0, (p.z + q.z) / 2)
    const toC: V3 = [C[0] - M[0], C[1] - M[1], cz - M[2]]
    const xs = [-HW, 0, HW]
    for (let j = 0; j + 1 < xs.length; j++)
      faceN(soffit, [W(p.s, xs[j], p.z), W(p.s, xs[j + 1], p.z), W(q.s, xs[j + 1], q.z), W(q.s, xs[j], q.z)], toC)
  }
  // jambs below the springing, facing into the opening
  for (const [s, dir] of [[a, 1], [b, -1]] as [number, number][]) {
    const t = tan(s), n: V3 = [t[0] * dir, t[1] * dir, 0]
    const xs = [-HW, 0, HW]
    for (let j = 0; j + 1 < xs.length; j++) {
      const g0 = gW(s, xs[j]), g1 = gW(s, xs[j + 1])
      if (Math.min(g0, g1) >= spring) continue
      faceN(soffit, [W(s, xs[j], g0), W(s, xs[j + 1], g1), W(s, xs[j + 1], Math.max(spring, g1)), W(s, xs[j], Math.max(spring, g0))], n)
    }
  }
}
// pier bodies (between bays) and the solid ends
solid(0, sWA)
for (const p of [...westPiers.slice(1), ...eastPiers.slice(1)]) solid(p.s - p.t / 2, p.s + p.t / 2, 3)
for (const p of [TW, TE]) pierBlock(p.s, p.t, 5.5)
solid(sEA, LEN)
endFace(0, -1)
endFace(LEN, 1)

// ---- Parapets, walk, railing -----------------------------------------------
const deckStations = [...new Set([...stations(0, LEN, 10), trussA, trussB].map((v) => Math.round(v * 1000) / 1000))].sort((p, q) => p - q)
const inTruss = (s0: number, s1: number) => s0 >= trussA - 1e-6 && s1 <= trussB + 1e-6
for (let i = 0; i + 1 < deckStations.length; i++) {
  const s0 = deckStations[i], s1 = deckStations[i + 1]
  const tr = inTruss(s0, s1)
  const wi = tr ? HW - 0.15 : HW - PAR
  // walking surface
  faceN(pave, [W(s0, -wi, walk(s0)), W(s0, wi, walk(s0)), W(s1, wi, walk(s1)), W(s1, -wi, walk(s1))], [0, 0, 1])
  for (const side of [-1, 1]) {
    const n = out((s0 + s1) / 2, side), ni: V3 = [-n[0], -n[1], 0]
    if (!tr) {
      // parapet: inner face and top (the outer face is the wall's)
      faceN(stone, [W(s0, side * wi, walk(s0)), W(s1, side * wi, walk(s1)), W(s1, side * wi, parTop(s1)), W(s0, side * wi, parTop(s0))], ni)
      faceN(stone, [W(s0, side * wi, parTop(s0)), W(s1, side * wi, parTop(s1)), W(s1, side * HW, parTop(s1)), W(s0, side * HW, parTop(s0))], [0, 0, 1])
    } else {
      // the truss deck's slab edge, under the walk
      faceN(rust, [W(s0, side * HW, walk(s0) - 0.7), W(s1, side * HW, walk(s1) - 0.7), W(s1, side * HW, walk(s1)), W(s0, side * HW, walk(s0))], n)
      faceN(rust, [W(s0, side * HW, walk(s0) - 0.7), W(s1, side * HW, walk(s1) - 0.7), W(s1, side * wi, walk(s1)), W(s0, side * wi, walk(s0))], n)
    }
    // the railing: a red band (top rail and pickets read as one from afar)
    const ro = side * (tr ? HW - 0.12 : HW - 0.3), z0 = (s: number) => (tr ? walk(s) + 0.05 : parTop(s) + 0.1)
    const z1 = (s: number) => (tr ? walk(s) + 1.1 : parTop(s) + 1.0)
    const hb = 0.05
    faceN(rust, [W(s0, ro + hb, z0(s0)), W(s1, ro + hb, z0(s1)), W(s1, ro + hb, z1(s1)), W(s0, ro + hb, z1(s0))], n)
    faceN(rust, [W(s0, ro - hb, z0(s0)), W(s1, ro - hb, z0(s1)), W(s1, ro - hb, z1(s1)), W(s0, ro - hb, z1(s0))], ni)
  }
}
// the truss slab's underside
faceN(pave, [W(trussA, -HW, walk(trussA) - 0.7), W(trussB, -HW, walk(trussB) - 0.7), W(trussB, HW, walk(trussB) - 0.7), W(trussA, HW, walk(trussA) - 0.7)], [0, 0, -1])

// ---- The deck truss over the lock -----------------------------------------
{
  const L = trussB - trussA, c = at((trussA + trussB) / 2), t = tan((trussA + trussB) / 2)
  const tp = new Part()
  const ys = stations(-L / 2, L / 2, L / 10)
  const top = () => WALK - 0.7, bot = () => WALK - 0.7 - 5.8
  for (const xc of [-3.5, 3.5]) truss(tp, tp, xc, ys, top, bot, { chordW: 0.55, topD: 0.75, botD: 0.85, member: 0.55 })
  // floor beams under the slab at every panel point, and the end posts' ties
  // place the truss: local (x across, y along) → model
  const n = [t[1], -t[0]]
  for (let i = 0; i < tp.pos.length; i += 3) {
    const x = tp.pos[i], y = -tp.pos[i + 2], z = tp.pos[i + 1]
    const X = c[0] + n[0] * x + t[0] * y, Y = c[1] + n[1] * x + t[1] * y
    tp.pos[i] = X; tp.pos[i + 2] = -Y; tp.pos[i + 1] = z
    const nx = tp.nrm[i], ny = -tp.nrm[i + 2]
    const NX = n[0] * nx + t[0] * ny, NY = n[1] * nx + t[1] * ny
    tp.nrm[i] = NX; tp.nrm[i + 2] = -NY
  }
  for (const k of ['pos', 'nrm', 'uv'] as const) for (const v of tp[k]) rust[k].push(v)
}

// ---- Lamp posts: downstream at mid-span, upstream over the piers ------------
const lampAt: [number, number][] = []
for (const { a, b } of bays) lampAt.push([(a + b) / 2, 1])
for (const p of [...westPiers.slice(1), TW, ...eastPiers]) lampAt.push([p.s, -1])
lampAt.push([(trussA + trussB) / 2, 1], [sWA / 2, 1], [sWA / 2 + 20, -1], [(sEA + LEN) / 2, -1])
for (const [s, side] of lampAt) {
  const tr = s > trussA && s < trussB
  const base = tr ? walk(s) : parTop(s), o = side * (tr ? HW - 0.12 : HW - 0.3)
  const top = walk(s) + 4.8
  rod(rust, W(s, o, base), W(s, o, top), 0.12, 4)
  rod(rust, W(s, o, top), W(s, o - side * 0.8, top), 0.08, 3)
  bead(lamp, W(s, o - side * 0.8, top - 0.45), 0.38)
}

// ---- Write -------------------------------------------------------------------
const parts = [
  { part: stone, material: STONE },
  { part: soffit, material: SOFFIT },
  { part: pave, material: PAVE },
  { part: rust, material: RUST },
  { part: lamp, material: LAMP },
]
const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
const glb = writeGlb('msp-stone-arch-bridge', parts, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the river (the lowest ground)',
})
const outPath = process.argv[2] ?? new URL('../models/msp-stone-arch-bridge.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${tris} triangles, ${glb.length} bytes; length ${LEN.toFixed(1)} m, ${bays.length} arches`)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
console.log('ground at ends', ground(...at(0)).toFixed(1), ground(...at(LEN)).toFixed(1), 'walk', walk(0).toFixed(2), walk(LEN).toFixed(2))
console.log('bays', bays.map((b) => (b.b - b.a).toFixed(1)).join(' '), 'truss', (trussB - trussA).toFixed(1))
