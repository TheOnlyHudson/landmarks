/**
 * Golden Gate Bridge (1937; Joseph Strauss, Charles Ellis, Leon Moisseiff;
 * art-deco styling by Irving Morrow) — procedural, CC0-1.0.
 * bun generators/sf-golden-gate-bridge.ts
 *
 * The whole bridge as one placement, abutment to abutment: both towers, the
 * two main cables, the suspenders, the stiffening trusses, the floor beams
 * and lateral bracing, the sidewalk railings and the four concrete pylons;
 * at the San Francisco end the steel arch over Fort Point, the cables'
 * run down to the south anchorage, the anchorage and the approach viaduct
 * (a deck truss on steel trestle towers) to the toll plaza; at the Marin
 * end the north anchorage and the approach viaduct toward Vista Point.
 * Writes a low model (towers with plain-edged legs, cables, the trusses as
 * solid bands) and a detail model (the approved towers in full, the trusses
 * as lattice, suspenders, railings, floor beams), which a map draws from
 * detailZoom up.
 *
 * Frame: x across the bridge, y along it toward Marin, z up, metres; origin
 * midway between the towers, on the water. Placed at bearing 354.69°, the
 * line from the south tower's centroid to the north one's. Positions are in
 * the map's own placement frame (Parchment's modelToLngLat: 111,320 m a
 * degree east at the equator, 110,574 north), so OSM and lidar features land
 * where the map draws them. Off the towers' line the deck curves: east into
 * the toll plaza, west toward Vista Point. `s` is distance along the deck's
 * centre line (the midline of the two carriageways in OSM), equal to y on
 * the straight. The map owns the roadway's surface: the trusses hang below
 * it and the anchorages' tops stay 0.4 m under it. The sidewalks are the
 * model's, as the map leaves a modelled bridge's walkways to its model: a
 * kerb above the roadway out to the railings, swinging round each tower's
 * legs as OSM's ways do (within 0.7 m of lidar along the west sidewalk).
 *
 * Height. z = NAVD88 + 1.38 m everywhere. Mapterhorn, the terrain the map
 * draws, reads the strait at -1.38 m under the south tower (-0.63 m under
 * the north one), so y = 0 is the south pier's foot, and every foot on land
 * is built 1.38 m over Mapterhorn's height under it (SOUTH_GROUND,
 * NORTH_GROUND, read from Mapterhorn's z15 tiles in this frame, 4 m apart).
 * The map reads that steady offset off the feet (`tools/terrain.ts check`:
 * follows, offset 1.41) and stands the model on its terrain with z - 1.41 at
 * NAVD88, which is the datum the map's road decks are pinned to. The
 * towers' design heights were measured above the lidar's water (0.5 m
 * NAVD88), so the towers and cables are lifted 1.88 m into this datum,
 * their piers stretched down to the strait.
 *
 * The roadway is lidar (USGS 3DEP CA_SanFrancisco_1_B23, 2023): both
 * carriageways measured every 20 m with `tools/bridge_ele.py measure`
 * (southbound ways 255330055, 1321812310, 1557712987, 1560010152,
 * 1560010147, 537838948, 1560010118; northbound 26968360, 595194543,
 * 1560010146, 1560010151, 1557712986, 717919507), readings with a spread
 * over 1 m dropped, and each carriageway fitted with knots every 40 m along
 * s (ROAD_WEST, ROAD_EAST, NAVD88). The trusses on each side follow their
 * own carriageway. Built to, NAVD88: 81.7 m at the crest, 75.0 at the
 * towers, 66.6 at the pylons S1 and N1, 63.0 at pylon S2 and 56.3 where the
 * deck lands at the toll plaza; on the Marin side a sag of 65.9 over the
 * north anchorage, 66.9 at pylon N2 and 74.4 where it lands toward Vista
 * Point. Checked against 564 more readings taken between the fitted ones
 * (`--every 9`), the roadway as the map places the model is within 0.20 m
 * of the lidar everywhere, median 0.03 m.
 *
 * The span's sources:
 * - OSM: the outline relation/21407754 (way/370672707), 29 m wide; Pylon S1,
 *   way/1560010162 and way/1560010163; Pylon N1, way/1495249486 and
 *   way/1560010150.
 * - Lidar (as above, 0.5 m grids across the deck at midspan, y = -320,
 *   -560, ±810, ±960 and over both pylons, and the point cloud along both
 *   ends): the cables 27.5 m apart, 85.1 m above the water at midspan
 *   (centre) and 194.8 m at y = -560, a parabola to 226.7 m at the saddles
 *   (the published sag is 470 ft, 143 m); on the side spans 137.9 m at
 *   y = ±810 and 75.8 m at ±960, entering the pylons' housings at about
 *   72 m; the suicide-deterrent net (2023), 6.7 m under the sidewalks, which
 *   is left out. Pylons S1 and N1 stand at |y| 977.8–987.3, symmetrical, and
 *   their legs |x| 11.2–17.4: OSM's S1 is 5.7 m north of where the lidar
 *   has it, so the pylons, the side spans' ends and the cables' housings
 *   follow the lidar. Tops 76.0 m (S1) and 74.2 m (N1), NAVD88.
 * - Published (Wikipedia "Golden Gate Bridge"; goldengate.org): main span
 *   4,200 ft, side spans 1,125 ft; cables 36 3/8 in; stiffening trusses
 *   25 ft deep, 90 ft apart; suspenders in pairs every 50 ft.
 * - Estimated: the truss panels (25 ft, Warren with verticals), the floor
 *   beams' depth, the railing's height (1.3 m), the pylon legs' plain
 *   concrete form (their art-deco relief is left out). The cables are drawn
 *   1.3 m thick and the suspenders 0.44 m, a little over the real ones.
 *
 * The ends' sources:
 * - OSM: Fort Point Arch way/1560010166 and San Fransisco [sic] Approach
 *   way/1560010161 (man_made=bridge), South Anchorage way/1560010167, Pylon
 *   S2 way/1560010164 and way/1560010165; North Anchor way/1560010149, Pylon
 *   N2 way/1560010159 and way/1560010160, Marin Approach relation/21407755.
 *   The anchorages' plans are OSM's, the north one's symmetrised about the
 *   axis.
 * - Lidar, the point cloud (side and plan views of every return under the
 *   deck), NAVD88:
 *   - Fort Point arch: between the pylons' faces (y -987.3 to -1087.5), its
 *     intrados rising from the ground at the pylons to 44.7 m at the crown,
 *     its extrados from 34.5 to 49.6 m, the bracing between them a lattice;
 *     spandrel posts about every 7.5 m to the deck truss, whose bottom chord
 *     is 8.4 m under the roadway.
 *   - The cables leave S1's south face at about 64 m and run straight down
 *     through the arch's crown and through S2, into the south anchorage's
 *     roof at y -1110.
 *   - Pylon S2 at y -1097.7 to -1087.5, top 72.7 m with a stepped cap;
 *     pylon N2 at y 1077.5 to 1086.5, top 74.9 m.
 *   - The south anchorage's roof at 27.5 m. On it two trestle towers
 *     (s -1189 to -1180, -1142.5 to -1134), legs 18 m apart across; two low
 *     bents on the hill at s -1256 and -1239.5; the deck truss, 10 m deep,
 *     ends on the hill at s -1272, and a shallow girder carries the deck the
 *     rest of the way to the abutment.
 *   - Marin: the anchorage block is solid from N1 to N2 under the roadway;
 *     the approach truss, 10 m deep, stands on four trestle towers (s 1137.5
 *     to 1153.75, 1206 to 1222.5, 1272.5 to 1287.5, 1338 to 1354), legs 23 m
 *     apart across, and lands at s 1400.
 * - Photos: HAER CA-31 (Jet Lowe, 1984, public domain, Library of Congress,
 *   via Wikimedia Commons): CA-31-13 "Detail view of approach span deck arch
 *   at south abutment" (the arch, S1, S2 and the anchorage); CA-31-36 (the
 *   arch's springing beside S1); CA-31-37, -38 and -39 (the south approach's
 *   trestle towers, deck truss and the anchorage roof); CA-31-6 "General
 *   view, looking south, showing concrete anchorage at the north abutment"
 *   (the Marin anchorage block and approach towers). "Aerial view of the San
 *   Francisco side of the Golden Gate Bridge" and "South end of the Golden
 *   Gate Bridge, above Fort Point" (Carol M. Highsmith, Library of Congress,
 *   public domain). "Zan 1429 - The Marin Approach to the Golden Gate
 *   Bridge" (Zan, public domain; the Marin towers and anchorage).
 * - Estimated: the trestle towers' bracing (an X in each face of each
 *   panel, panels about 10 m), the legs' sections and concrete footings, the
 *   truss panels on the arch and the approaches (the main span's), the arch
 *   ribs' chord depth (1.4 m), the girder from s -1272 to the toll plaza
 *   abutment, and the anchorages as plain concrete (their pilasters and
 *   parapet panels are left out). The trusses on the arch and the approaches
 *   stand at the main span's 27.5 m spacing; lidar puts the approach deck
 *   edges about 1 m wider.
 *
 * The towers' sources, unchanged:
 *
 * What makes it the Golden Gate: International Orange; two tall stepped
 * legs, cruciform in plan, whose faces carry broad vertical recesses; four
 * deep portal struts above the deck, the openings between them with stepped
 * art-deco corners, shrinking upward; the legs stepping in toward the top;
 * two X-braced panels under the deck; a pale concrete pier.
 *
 * Sources:
 * - OSM: both towers are mapped as outline + building:parts with heights,
 *   at the scale of the legs' 3.5 ft cells. South: way/1330586852 "San
 *   Francisco Tower" and 26 parts; north: way/1330832666 "Marin Tower" and
 *   22 parts. The two agree to 0.1 m once turned into the bridge frame, and
 *   every plan dimension here is theirs: the pier (42.8 x 20.2 m, rounded
 *   ends, 13 m), the leg plinths (13–21 m), the legs' cruciform sections
 *   and where they step (74, 123, 162, 195 m), the struts (24–26, 50–52,
 *   111–121, 151–161, 185–193, 215–223 m, 3.8 m deep).
 * - Lidar (USGS 3DEP, CA_SanFrancisco_1_B23, flown 2023, 0.5 m grid; water
 *   at 0.5 m NAVD88, which is y = 0 here), identical at both towers: leg
 *   tops 224.6 m, top strut 223.3 m, saddle housings 229.5 m, deck 74.9 m;
 *   legs centred 13.7 m either side of the axis, stepping in at 162 and 195
 *   m as OSM has them.
 * - Published: towers 746 ft (227 m) above the water and 500 ft above the
 *   roadway; main span 4,200 ft (1,280 m; the two outline centroids are
 *   1,275 m apart); main cables 36 3/8 in (0.92 m); colour International
 *   Orange (Wikipedia "Golden Gate Bridge"; goldengate.org).
 * - Photos (Wikimedia Commons): "Golden Gate Bridge, north tower detail"
 *   and "Golden Gate Bridge, North view" (Radomianin, CC BY-SA 4.0); "Golden
 *   Gate bridge pillar" (Calibas, CC BY-SA 4.0; the struts' corbelled
 *   corners from the deck); "Sausalito (CA, USA), Golden Gate Bridge Vista
 *   Point -- 2022 -- 3070" (Dietmar Rabich, CC BY-SA 4.0; the portal face);
 *   "GoldenGateBridge BakerBeach MC" (Christian Mehlführer, CC BY 3.0) and
 *   "Golden Gate Bridge as seen from Marshall's Beach, March 2018" (Frank
 *   Schulenburg, CC BY-SA 4.0; the south tower, X panels and pier); "Golden
 *   Gate Bridge, top of South Tower, 1984" (Jet Lowe, HAER, public domain;
 *   the saddles); "Golden Gate Bridge tower views 01/12" (Ɱ, CC BY-SA 4.0);
 *   "Aerial view of Golden Gate Bridge from the south" (Daniel L. Lu, CC
 *   BY-SA 4.0).
 * - Estimated from photos: the stepped corner brackets of the openings
 *   (three 1.3 m steps, 3.0, 1.9 and 0.9 m wide), the recessed panel on each strut face, the
 *   X members' width (2 m), a strut under the deck (66–69 m, the truss's
 *   seat; OSM has the deck itself there), the saddle housing's curve, and
 *   the top strut's fluting (seven ribs).
 * - Colour: International Orange from sunlit daylight photos (#c45140 to
 *   #d26053); the recessed faces a shade darker, so the fluting reads in
 *   the map's flat lighting; the pier's concrete pale grey.
 *
 * Night: the towers are floodlit (since 1987), warm on every face from the
 * deck and pier up to the saddles, so the orange near the towers carries a
 * `floodlight` wash (STYLE.md, "Night"); the cables, span and approaches
 * stay dark.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { band, face as faceN, footedLoft, merged, movedAlong, parabola, piecewise, ribbon, rod, stations, strip, truss, tube } from './bridge-kit'
import { finish, type Swatch } from './palette'

// ---- Shared helpers (also used by the Bay Bridge towers) -------------------

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** Picks the part a face is drawn in, from its outward normal. */
export type Skin = (n: V3) => Part

/** One quad, CCW seen from outside, in the part its normal picks. */
function face(skin: Skin, a: V3, b: V3, c: V3, d: V3) {
  skin(norm(cross(sub(b, a), sub(c, a)))).quad(a, b, c, d)
}

/** Corners of a plan rectangle with chamfered corners (r = 0: plain), CCW from above. */
function rim(x0: number, x1: number, y0: number, y1: number, r: number, z: number): V3[] {
  if (r <= 0) return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  return [[x0 + r, y0, z], [x1 - r, y0, z], [x1, y0 + r, z], [x1, y1 - r, z],
    [x1 - r, y1, z], [x0 + r, y1, z], [x0, y1 - r, z], [x0, y0 + r, z]]
}

/** A closed prism lofted through rings (each CCW seen from the far end), capped. */
export function loftSolid(skin: Skin, rings: V3[][], caps = [true, true]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    face(skin, rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
  }
  const fan = (ring: V3[], flip: boolean) => {
    const pts = flip ? [...ring].reverse() : ring
    for (let i = 1; i < pts.length - 1; i++) {
      const nn = norm(cross(sub(pts[i], pts[0]), sub(pts[i + 1], pts[0])))
      skin(nn).tri(pts[0], pts[i], pts[i + 1])
    }
  }
  if (caps[1]) fan(rings[rings.length - 1], false)
  if (caps[0]) fan(rings[0], true)
}

/**
 * An upright box with chamfered vertical edges (r) and an optional
 * chamfered top edge (top). `bottom: false` leaves out the hidden base.
 */
export function box(skin: Skin, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  { r = 0.3, top = 0, bottom = true } = {}) {
  const rings = [rim(x0, x1, y0, y1, r, z0), rim(x0, x1, y0, y1, r, z1 - top)]
  if (top > 0) rings.push(rim(x0 + top, x1 - top, y0 + top, y1 - top, Math.max(0.05, r - top * 0.4), z1))
  loftSolid(skin, rings, [bottom, true])
}

/** An upright prism over a convex plan polygon (CCW from above). */
export function prism(skin: Skin, plan: [number, number][], z0: number, z1: number, bottom = true) {
  loftSolid(skin, [plan.map(([x, y]) => [x, y, z0] as V3), plan.map(([x, y]) => [x, y, z1] as V3)], [bottom, true])
}

/**
 * A straight member from a to b: a w x t rectangle (t measured along
 * `side`), or with `round` an n-gon of diameter w.
 */
export function beam(skin: Skin, a: V3, b: V3, w: number, t: number, side: V3 = [0, 1, 0], round = 0) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, side[0] * d[0] + side[1] * d[1] + side[2] * d[2])))
  const W = cross(S, d)
  const section = (o: V3): V3[] => round
    ? Array.from({ length: round }, (_, i) => {
      const th = (2 * Math.PI * i) / round
      return add(o, add(mul(W, Math.cos(th) * w / 2), mul(S, Math.sin(th) * w / 2)))
    })
    : [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => add(o, add(mul(W, u * w / 2), mul(S, v * t / 2))))
  loftSolid(skin, [section(a), section(b)])
}

/** A skin that draws every face in one part. */
export const one = (p: Part): Skin => () => p

export const countParts = (parts: { part: Part }[]) => parts.reduce((s, p) => s + p.part.triangles, 0)

// ---- The Golden Gate tower --------------------------------------------------

/**
 * One tower, centred on its pier on the water, into the three parts given.
 * `simple` is the far view's: plain-edged legs, no corbelled brackets or
 * fluting, so two towers fit the low model's budget.
 */
function tower(lit: Part, shade: Part, pier: Part, simple = false) {
  /**
   * The legs' faces: a wing's face is recessed when another wing of the
   * same section stands proud of it in that direction. `proudX`/`proudY`
   * say whether this box carries the leg's outermost face that way.
   */
  const legSkin = (proudX: boolean, proudY: boolean): Skin => (n) => {
    if (Math.abs(n[2]) > 0.7) return lit
    if (Math.abs(n[0]) > 0.9) return proudX ? lit : shade
    if (Math.abs(n[1]) > 0.9) return proudY ? lit : shade
    return lit
  }
  const L = one(lit), S = one(shade)

  // Pier: OSM's outline, rounded cutwater ends, 13 m.
  const half: [number, number][] = [[17.5, -10.1], [19.5, -8.3], [20.7, -4.5], [21.2, -2.2], [21.4, 0],
    [21.2, 2.2], [20.7, 4.5], [19.5, 8.3], [17.5, 10.1]]
  const plan = [...half, ...half.map(([x, y]) => [-x, -y] as [number, number])]
  prism(one(pier), plan, 0, 12.4, false)
  prism(one(pier), plan.map(([x, y]) => [x * 0.985, y * 0.97] as [number, number]), 12.4, 13, false)

  // Leg sections, x as distances from the axis (OSM, bridge frame).
  // Each: [z0, z1, [[xin, xout, halfDepth], ...]] from the core outward.
  type Wing = [number, number, number]
  const sections: [number, number, Wing[]][] = [
    [13, 21, [[11.0, 16.4, 7.8], [10.0, 17.5, 4.85], [8.9, 18.6, 2.8]]],   // plinth
    [21, 74, [[12.1, 15.3, 6.9], [11.0, 16.4, 3.7], [10.0, 17.5, 1.85]]],
    [74, 123, [[12.1, 15.3, 5.8], [11.0, 16.4, 3.7], [10.0, 17.5, 1.85]]],
    [123, 162, [[12.1, 15.3, 4.9], [11.0, 16.4, 2.75], [10.0, 17.5, 1.85]]],
    [162, 195, [[12.1, 15.3, 4.9], [11.0, 16.4, 1.85]]],
    [195, 224.6, [[12.1, 15.3, 3.7]]],
  ]
  for (const s of [-1, 1]) {
    for (const [z0, z1, wings] of sections) {
      wings.forEach(([xi, xo, hd], k) => {
        const [a, b] = s > 0 ? [xi, xo] : [-xo, -xi]
        const last = k === wings.length - 1
        box(legSkin(last, k === 0), a, b, -hd, hd, z0, z1, simple
          ? { r: 0, bottom: false }
          : { r: 0.25, top: z1 === 224.6 ? 0.4 : 0.15, bottom: false })
      })
    }
  }
  /** The leg's inner face (toward the axis) at height z. */
  const inner = (z: number) => (z >= 195 ? 12.1 : z >= 162 ? 11.0 : 10.0)

  // Saddle housings: a low curved hood on each leg top, lofted across it.
  for (const s of [-1, 1]) {
    const R = 6, C = 223.0, Y = 3.5, x0 = s > 0 ? 12.5 : -14.9
    // Ring in the (y, z) plane, CCW seen from +x.
    const ring = (x: number): V3[] => [[x, -Y, 224.6], [x, Y, 224.6],
      ...Array.from({ length: 9 }, (_, i) => { const y = Y - (2 * Y * i) / 8; return [x, y, C + Math.sqrt(R * R - y * y)] as V3 })]
    loftSolid(L, [ring(x0), ring(x0 + 2.4)])
  }

  /** A strut between the legs with a recessed panel on each face. */
  function strut(z0: number, z1: number, band = 1.5) {
    const xi = inner(z0) + 0.4
    box(S, -xi, xi, -1.45, 1.45, z0 + band, z1 - band, { r: 0, bottom: false })
    box(L, -xi, xi, -1.9, 1.9, z0, z0 + band, { r: 0.2 })
    box(L, -xi, xi, -1.9, 1.9, z1 - band, z1, { r: 0.2, top: 0.2 })
  }
  /**
   * Stepped art-deco brackets in an opening's corners: two steps against
   * the legs at height z, hanging down (dir -1) or standing up (dir +1).
   */
  function brackets(z: number, dir: number) {
    if (simple) return
    const xi = inner(z + dir * 0.5)
    for (const s of [-1, 1]) for (const [w, k] of [[3.0, 0], [1.9, 1], [0.9, 2]]) {
      const za = dir > 0 ? z + k * 1.3 : z - (k + 1) * 1.3
      const [a, b] = s > 0 ? [xi - w, xi + 0.3] : [-xi - 0.3, -xi + w]
      box(L, a, b, -1.9, 1.9, za, za + 1.3, { r: 0 })
    }
  }

  // Above the deck: four portal struts, the openings' corners stepped.
  const struts: [number, number][] = [[111, 121], [151, 161], [185, 193], [215, 223.3]]
  for (const [z0, z1] of struts) {
    strut(z0, z1)
    brackets(z0, -1)        // top corners of the opening below
  }
  for (const [, z1] of struts.slice(0, 3)) brackets(z1, 1) // bottom corners of the opening above
  // The top strut's face is fluted: broad vertical ribs across its recess.
  if (!simple) for (let i = -3; i <= 3; i++) box(L, i * 2.9 - 0.7, i * 2.9 + 0.7, -1.75, 1.75, 216.5, 221.8, { r: 0 , bottom: false })

  // Under the deck: the truss's seat, then two X-braced panels of about
  // equal height (photos; OSM puts the middle strut at 50–52 m, which
  // would make the upper panel two-thirds the lower's).
  strut(66, 69, 1.0)
  for (const [z0, z1] of [[22, 25], [46.5, 49.5]]) box(L, -10.4, 10.4, -1.9, 1.9, z0, z1, { r: 0.2 })
  for (const [z0, z1] of [[25, 46.5], [49.5, 66]]) {
    for (const s of [-1, 1]) beam(L, [-10.6 * s, 0, z0 - 0.6], [10.6 * s, 0, z1 + 0.6], 2.6, 2.6)
    const zm = (z0 + z1) / 2
    beam(L, [0, 0, zm - 2.4], [0, 0, zm + 2.4], 3.4, 3.0, [0, 1, 0])
  }
}


// ---- The frame, the deck's centre line and the roadway -----------------------

/** Model z of a NAVD88 height: Mapterhorn reads the strait under the south tower 1.38 m under NAVD88's zero. */
const DATUM = 1.38
/** The towers and cables were measured above the lidar's water (0.5 m NAVD88). */
const TOWER_LIFT = DATUM + 0.5

const S = 1275.77               // tower centre to tower centre (OSM)
const TY = S / 2                // towers at y = ±TY
const FACE = 7.5                // the deck stops this far from a tower's centre line
const HOUSING = [977.8, 987.3]  // pylons S1 and N1, along |y| (lidar)

/** The deck's centre line off the straight, [y, x]: east into the toll plaza, west toward Vista Point (OSM). */
const CURVE_SOUTH: [number, number][] = [[-1320, 71.2], [-1300, 58.8], [-1280, 46.6], [-1260, 35.7], [-1240, 26.0],
  [-1220, 17.9], [-1200, 11.4], [-1180, 6.3], [-1160, 2.8], [-1140, 0.75], [-1120, 0], [-1100, 0]]
const CURVE_NORTH: [number, number][] = [[1180, 0], [1200, -0.15], [1220, -0.7], [1240, -2.3], [1260, -5.2],
  [1280, -9.3], [1300, -14.6], [1320, -21.5], [1340, -30.1], [1360, -40.1], [1380, -51.9], [1400, -65.5], [1420, -78.6]]
const curveX = piecewise([[-1340, 83.4], ...CURVE_SOUTH, ...CURVE_NORTH, [1440, -91.7]])

/** The centre line every metre of y, with its length s from y = 0. */
const PATH = (() => {
  const y: number[] = [], x: number[] = [], s: number[] = []
  for (let v = -1340; v <= 1440; v++) {
    y.push(v), x.push(Math.abs(v) < 1100 ? 0 : curveX(v))
    const n = s.length
    s.push(n ? s[n - 1] + Math.hypot(x[n] - x[n - 1], 1) : 0)
  }
  const s0 = s[y.indexOf(0)]
  return { y, x, s: s.map((v) => v - s0) }
})()

/** The centre line's point and unit tangent at station s. */
function pathAt(s: number) {
  const { y, x, s: ss } = PATH
  let i = Math.min(ss.length - 2, Math.max(0, Math.floor(s + 1340 - 2)))
  while (i > 0 && ss[i] > s) i--
  while (i < ss.length - 2 && ss[i + 1] < s) i++
  const t = (s - ss[i]) / (ss[i + 1] - ss[i])
  const dx = x[i + 1] - x[i], dy = y[i + 1] - y[i], l = Math.hypot(dx, dy)
  return { x: x[i] + dx * t, y: y[i] + dy * t, tx: dx / l, ty: dy / l }
}
/** The point o metres right of the centre line (east, facing Marin) at station s, at height z. */
function at(s: number, o: number, z: number): V3 {
  const p = pathAt(s)
  return [p.x + o * p.ty, p.y - o * p.tx, z]
}

/**
 * The roadway, NAVD88, from lidar: each carriageway every 40 m of s from
 * s = -1320 (southbound, the west one; northbound, the east one).
 */
const ROAD_WEST = [
  56.48, 57.89, 59.15, 60.35, 61.54, 62.54, 63.43, 64.58, 65.81, 66.97,
  68.14, 69.25, 70.31, 71.34, 72.27, 73.17, 74.03, 74.87, 75.58, 76.24,
  76.92, 77.58, 78.20, 78.79, 79.34, 79.83, 80.25, 80.63, 80.93, 81.19,
  81.38, 81.52, 81.58, 81.62, 81.62, 81.58, 81.47, 81.31, 81.10, 80.81,
  80.45, 80.03, 79.57, 79.06, 78.46, 77.84, 77.16, 76.42, 75.65, 74.88,
  74.06, 73.22, 72.33, 71.39, 70.38, 69.32, 68.19, 67.10, 65.86, 66.07,
  66.79, 67.59, 68.40, 69.23, 70.03, 70.82, 71.65, 72.45, 73.24, 74.40,
]
const ROAD_EAST = [
  56.29, 57.52, 58.74, 59.97, 61.16, 62.31, 63.42, 64.61, 65.82, 66.99,
  68.16, 69.27, 70.34, 71.38, 72.30, 73.19, 74.05, 74.86, 75.60, 76.27,
  76.94, 77.61, 78.23, 78.82, 79.39, 79.86, 80.29, 80.67, 80.99, 81.24,
  81.43, 81.57, 81.65, 81.68, 81.70, 81.64, 81.54, 81.37, 81.15, 80.87,
  80.50, 80.08, 79.62, 79.09, 78.51, 77.87, 77.21, 76.46, 75.67, 74.88,
  74.08, 73.24, 72.35, 71.42, 70.39, 69.32, 68.19, 67.02, 66.09, 66.11,
  66.83, 67.60, 68.41, 69.37, 70.34, 71.16, 72.01, 72.81, 73.65, 74.72,
]
const knotted = (k: number[]) => piecewise(k.map((z, i) => [-1320 + 40 * i, z + DATUM] as [number, number]))
const roadWest = knotted(ROAD_WEST), roadEast = knotted(ROAD_EAST)
const LANES = 4.6               // the carriageways' centre lines, either side of the axis
/** The roadway at station s, o metres across: the nearer carriageway's, blended between them. */
const road = (s: number, o = 0): number => {
  const t = Math.min(1, Math.max(0, (o + LANES) / (2 * LANES)))
  return roadWest(s) * (1 - t) + roadEast(s) * t
}

const CABLE_X = 13.75, CABLE_R = 0.65
const SADDLE = 226.7 + TOWER_LIFT, LOW = 85.1 + TOWER_LIFT
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
const sideCable = parabola([TY, SADDLE], [810, 137.9 + TOWER_LIFT], [960, 75.8 + TOWER_LIFT])
const cable = (y: number) => Math.max(Math.abs(y) <= TY ? mainCable(y) : sideCable(Math.abs(y)), road(y) + 1.5)
/** Where the cables enter the pylons' housings, and leave S1's south face for the south anchorage. */
const CABLE_IN = road(HOUSING[0]) + 3
const CABLE_OUT = 64 + DATUM
const CABLE_ANCHOR: [number, number] = [-1110, 28.4 + DATUM]

const TRUSS_DOWN = 7.6          // the stiffening trusses' depth under the roadway (25 ft)
const ARCH_DOWN = 8.4           // the deck truss over the arch (lidar)
const APPROACH_DOWN = 10        // the approach viaducts' deck trusses (lidar)
const GIRDER_DOWN = 2.5         // the girder from the south truss's end to the toll plaza
const TRUSS_W = 0.8
const PANEL = 7.62              // truss panels, 25 ft; suspenders every second panel (50 ft)
const RAIL_X = 14.3

/** One stretch of deck, between stations, with its structure's depth under the roadway. */
type Deck = { from: number; to: number; down: number; suspended?: boolean }
const DECKS: Deck[] = [
  { from: -1316, to: -1272, down: GIRDER_DOWN },
  { from: -1272, to: -1097.7, down: APPROACH_DOWN },
  { from: -1087.5, to: -HOUSING[1], down: ARCH_DOWN },
  { from: -HOUSING[0], to: -TY - FACE, down: TRUSS_DOWN, suspended: true },
  { from: -TY + FACE, to: TY - FACE, down: TRUSS_DOWN, suspended: true },
  { from: TY + FACE, to: HOUSING[0], down: TRUSS_DOWN, suspended: true },
  { from: 1086.5, to: 1400, down: APPROACH_DOWN },
  { from: 1400, to: 1414, down: GIRDER_DOWN },
]

/**
 * The sidewalks, outside the roadway to the railing, a kerb above it: from
 * the south end to the north anchorage, swinging out round each tower's legs
 * as OSM's ways do ([along from the tower's centre line, |x|]).
 */
const WALK = [9.9, 14.2]
const KERB = 0.2
const WALK_RUNS: [number, number][] = [[-1316, -TY - 10], [-TY + 10, TY - 10], [TY + 10, HOUSING[0]]]
const ROUND_TOWER: [number, number][] = [[-10, 12.05], [-8, 16.8], [-3, 19.4], [3, 19.2], [8, 16.4], [10, 12.05]]
const walkTop = (o: number) => (s: number) => road(s, o) + KERB

// ---- The ground ----------------------------------------------------------------

/**
 * Mapterhorn heights (NAVD88) on rows 4 m apart along y, each row its own
 * x0 so it follows the curving deck: [y, x0, z at x0, x0 + 4, ...].
 */
type RowGrid = { y0: number; step: number; rows: number[][] }
function rowGround(g: RowGrid, x: number, y: number): number {
  const f = Math.min(Math.max((y - g.y0) / g.step, 0), g.rows.length - 1.0001)
  const r = Math.floor(f), t = f - r
  const across = (row: number[]) => {
    const n = row.length - 2, c = Math.min(Math.max((x - row[1]) / g.step, 0), n - 1.0001)
    const i = Math.floor(c), u = c - i
    return row[2 + i] * (1 - u) + row[3 + i] * u
  }
  return across(g.rows[r]) * (1 - t) + across(g.rows[r + 1]) * t
}
const SOUTH_GROUND: RowGrid = { y0: -1336, step: 4, rows: [
  [-1336, 40, 57.7, 58.3, 59.0, 58.5, 56.2, 56.1, 55.8, 55.5, 55.4, 55.4, 55.4, 55.4, 55.4, 55.3, 55.2, 55.1, 55.1],
  [-1332, 40, 57.6, 58.1, 58.5, 58.9, 56.6, 56.2, 55.6, 55.6, 55.6, 55.5, 55.5, 55.5, 55.4, 55.3, 55.2, 55.1, 55.1],
  [-1328, 40, 57.6, 57.9, 58.3, 58.5, 56.7, 56.0, 55.7, 55.7, 55.6, 55.6, 55.6, 55.5, 55.4, 55.3, 55.3, 55.3, 55.3],
  [-1324, 40, 57.5, 57.9, 58.1, 57.5, 56.5, 56.0, 55.9, 55.8, 55.8, 55.7, 55.7, 55.6, 55.5, 55.4, 55.4, 55.4, 55.5],
  [-1320, 40, 57.2, 57.7, 58.0, 56.9, 56.3, 56.0, 56.0, 55.9, 55.9, 55.8, 55.7, 55.6, 55.6, 55.5, 55.6, 55.8, 56.1],
  [-1316, 36, 56.4, 56.9, 57.1, 57.1, 56.8, 56.3, 56.1, 56.1, 56.0, 56.0, 55.9, 55.8, 55.7, 55.7, 55.8, 56.0, 56.1],
  [-1312, 36, 55.8, 56.2, 56.2, 56.9, 56.7, 56.4, 56.3, 56.1, 56.1, 56.1, 55.9, 55.8, 55.9, 55.9, 56.1, 56.4, 56.4],
  [-1308, 32, 55.1, 55.3, 55.3, 54.7, 55.7, 56.4, 56.5, 56.4, 56.3, 56.2, 56.1, 56.0, 56.0, 56.0, 56.2, 56.6, 56.8],
  [-1304, 28, 52.7, 53.3, 53.7, 53.8, 53.7, 54.5, 55.3, 56.0, 56.3, 56.4, 56.3, 56.1, 56.2, 56.2, 56.2, 56.4, 56.8],
  [-1300, 28, 52.2, 52.0, 51.8, 51.8, 52.5, 53.3, 54.0, 54.7, 55.3, 55.9, 56.2, 56.3, 56.4, 56.3, 56.1, 56.3, 56.6],
  [-1296, 24, 51.7, 51.7, 51.7, 51.5, 51.3, 51.5, 52.1, 52.7, 53.3, 53.9, 54.5, 55.0, 55.8, 56.2, 56.2, 56.0, 55.9],
  [-1292, 20, 51.3, 51.6, 51.6, 51.5, 51.1, 51.0, 51.0, 51.1, 51.4, 51.9, 52.6, 53.1, 53.4, 53.5, 54.8, 55.7, 55.8],
  [-1288, 20, 50.4, 50.8, 50.9, 50.5, 50.2, 50.5, 50.7, 50.8, 50.8, 50.9, 51.2, 51.7, 51.8, 52.1, 53.1, 54.1, 54.9],
  [-1284, 16, 48.7, 49.1, 49.3, 49.3, 49.1, 49.3, 49.5, 49.9, 50.2, 50.4, 50.5, 50.5, 50.6, 50.8, 51.3, 51.8, 52.4],
  [-1280, 16, 47.6, 47.7, 47.8, 47.9, 48.1, 48.4, 48.8, 49.1, 49.3, 49.6, 49.7, 49.9, 50.3, 50.4, 50.5, 50.7, 51.0],
  [-1276, 12, 46.4, 46.8, 46.8, 46.8, 47.0, 47.3, 47.6, 47.9, 48.3, 48.6, 48.9, 49.1, 49.2, 49.5, 50.0, 50.2, 50.2],
  [-1272, 12, 45.7, 46.0, 46.0, 46.0, 46.1, 46.5, 46.7, 47.0, 47.4, 47.7, 48.1, 48.5, 48.8, 49.0, 49.2, 49.6, 50.0],
  [-1268, 8, 44.6, 45.1, 45.3, 45.3, 45.4, 45.5, 45.7, 46.0, 46.2, 46.5, 46.8, 47.2, 47.6, 48.0, 48.4, 48.9, 49.3],
  [-1264, 4, 42.9, 44.0, 44.3, 44.5, 44.5, 44.7, 44.9, 45.0, 45.2, 45.4, 45.7, 46.0, 46.3, 46.7, 47.1, 47.7, 48.5],
  [-1260, 4, 42.7, 43.3, 43.7, 43.8, 43.7, 43.9, 44.1, 44.3, 44.5, 44.7, 44.9, 45.2, 45.4, 45.8, 46.5, 47.5, 47.9],
  [-1256, 0, 42.3, 42.6, 42.8, 43.1, 42.7, 42.7, 42.9, 43.2, 43.5, 43.7, 43.9, 44.1, 44.4, 44.7, 45.1, 45.7, 46.6],
  [-1252, 0, 41.7, 42.2, 42.5, 42.2, 41.5, 41.7, 42.0, 42.2, 42.5, 42.7, 43.0, 43.3, 43.5, 43.9, 44.3, 44.9, 45.9],
  [-1248, -4, 41.1, 41.5, 41.9, 42.2, 40.9, 40.3, 40.6, 40.9, 41.2, 41.5, 41.8, 42.0, 42.2, 42.5, 43.1, 43.5, 44.0],
  [-1244, -4, 40.7, 41.5, 41.9, 41.6, 39.8, 39.7, 39.8, 40.1, 40.3, 40.6, 40.8, 41.1, 41.3, 41.6, 42.1, 42.6, 42.9],
  [-1240, -4, 40.0, 41.3, 41.6, 40.2, 39.1, 39.3, 39.5, 39.7, 39.8, 40.0, 40.2, 40.4, 40.6, 40.9, 41.2, 41.5, 41.6],
  [-1236, -8, 34.0, 38.1, 41.0, 40.7, 38.6, 38.3, 38.7, 39.0, 39.3, 39.5, 39.7, 39.8, 40.1, 40.2, 40.2, 40.2, 40.3],
  [-1232, -8, 31.6, 35.3, 38.5, 39.0, 36.9, 37.0, 37.5, 38.1, 38.5, 39.0, 39.3, 39.6, 39.7, 39.8, 39.7, 39.5, 39.2],
  [-1228, -12, 27.3, 30.8, 33.5, 35.2, 36.0, 35.5, 35.8, 36.3, 36.8, 37.3, 37.8, 38.5, 39.1, 39.3, 39.2, 39.0, 38.8],
  [-1224, -12, 26.0, 28.6, 30.7, 32.2, 33.0, 33.3, 34.0, 34.7, 35.2, 35.8, 36.3, 36.9, 37.5, 37.7, 37.7, 37.6, 37.4],
  [-1220, -12, 22.9, 25.5, 27.1, 28.9, 29.7, 30.4, 31.5, 32.5, 33.5, 34.1, 34.7, 35.2, 35.5, 35.7, 35.7, 35.6, 35.6],
  [-1216, -16, 16.3, 20.3, 21.7, 23.5, 25.6, 27.4, 28.5, 29.5, 30.6, 31.5, 32.3, 33.1, 33.6, 33.8, 33.9, 34.0, 34.0],
  [-1212, -16, 14.1, 17.1, 19.8, 22.7, 25.7, 26.9, 27.5, 28.3, 29.1, 30.0, 31.0, 31.9, 32.4, 32.5, 32.7, 32.9, 33.0],
  [-1208, -20, 11.1, 13.6, 16.5, 19.7, 22.7, 26.2, 26.9, 27.3, 27.8, 28.3, 29.0, 29.8, 30.6, 31.2, 31.4, 31.7, 32.1],
  [-1204, -20, 10.3, 12.7, 16.1, 19.1, 22.1, 25.4, 26.7, 27.2, 27.6, 28.1, 28.5, 29.0, 29.5, 29.9, 30.4, 31.1, 31.7],
  [-1200, -20, 8.3, 11.2, 15.4, 18.9, 22.2, 24.6, 25.5, 26.2, 27.0, 27.4, 27.9, 28.3, 28.7, 29.4, 30.1, 30.6, 31.0],
  [-1196, -20, 7.6, 11.7, 15.6, 19.3, 22.0, 24.1, 24.9, 25.5, 26.2, 26.8, 27.5, 27.9, 28.4, 29.0, 29.5, 29.9, 30.2],
  [-1192, -24, 5.8, 7.9, 11.9, 15.6, 18.5, 20.9, 23.1, 24.8, 25.6, 26.2, 26.8, 27.4, 27.8, 28.2, 28.6, 29.0, 29.4],
  [-1188, -24, 5.9, 8.2, 11.8, 14.8, 17.2, 19.5, 21.8, 24.0, 25.6, 26.3, 26.9, 27.5, 27.7, 28.0, 28.3, 28.6, 29.0],
  [-1184, -24, 6.0, 8.0, 11.2, 13.7, 15.9, 18.2, 20.4, 22.6, 24.9, 26.4, 27.0, 27.5, 27.7, 27.9, 28.1, 28.4, 28.7],
  [-1180, -24, 5.9, 7.6, 10.0, 12.3, 14.5, 16.8, 19.0, 21.3, 23.5, 25.7, 27.1, 27.6, 27.7, 27.8, 27.9, 28.1, 28.2],
  [-1176, -28, 5.3, 5.8, 7.1, 9.2, 11.4, 13.6, 15.7, 17.9, 20.1, 22.3, 24.4, 26.7, 27.5, 26.9, 26.7, 27.0, 27.4],
  [-1172, -28, 5.2, 5.8, 7.0, 9.1, 11.3, 13.5, 15.6, 17.7, 19.9, 22.0, 24.2, 26.4, 26.2, 25.1, 25.6, 26.1, 26.6],
  [-1168, -28, 5.2, 5.7, 6.9, 9.0, 11.2, 13.4, 15.5, 17.7, 19.9, 22.0, 24.1, 26.0, 24.5, 23.9, 24.7, 25.3, 25.9],
  [-1164, -28, 5.1, 5.6, 6.8, 8.9, 11.1, 13.2, 15.3, 17.3, 19.4, 21.3, 22.6, 23.5, 22.8, 22.8, 24.0, 24.7, 25.2],
  [-1160, -28, 5.0, 5.6, 6.4, 8.4, 10.4, 12.5, 14.5, 16.5, 18.0, 18.9, 19.8, 20.7, 21.1, 21.9, 23.4, 24.3, 24.8],
  [-1156, -28, 5.0, 5.5, 6.0, 7.6, 9.7, 11.7, 13.3, 14.3, 15.2, 16.1, 17.1, 18.2, 19.2, 20.6, 22.8, 23.8, 24.4],
  [-1152, -32, 4.7, 5.0, 5.5, 6.1, 6.9, 8.6, 9.8, 10.8, 12.0, 13.2, 14.4, 15.6, 16.9, 17.7, 18.8, 21.4, 23.4],
  [-1148, -32, 4.6, 4.9, 5.3, 5.8, 6.3, 7.5, 8.8, 10.0, 11.2, 12.5, 13.8, 15.0, 16.3, 17.0, 17.7, 20.1, 22.6],
  [-1144, -32, 4.6, 4.9, 5.3, 5.8, 6.3, 7.5, 8.7, 9.9, 11.1, 12.3, 13.5, 14.7, 15.9, 16.5, 17.0, 19.1, 21.7],
  [-1140, -32, 4.4, 4.8, 5.2, 5.8, 6.3, 7.4, 8.6, 9.8, 10.9, 12.1, 13.2, 14.3, 15.5, 16.1, 16.6, 18.7, 21.2],
  [-1136, -32, 3.9, 4.8, 5.1, 5.7, 6.3, 7.3, 8.4, 9.5, 10.6, 11.7, 12.8, 13.9, 15.0, 15.6, 16.3, 18.6, 21.8],
  [-1132, -32, 3.2, 4.7, 5.1, 5.6, 6.2, 7.2, 8.2, 9.3, 10.3, 11.4, 12.4, 13.5, 14.5, 15.2, 16.0, 18.5, 21.5],
  [-1128, -32, 2.6, 4.7, 5.1, 5.5, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0, 12.1, 13.1, 14.1, 14.7, 15.8, 18.8, 22.1],
  [-1124, -32, 2.2, 4.6, 5.0, 5.5, 6.1, 7.0, 8.0, 8.9, 9.8, 10.8, 11.8, 12.7, 13.7, 14.2, 15.6, 19.0, 22.4],
  [-1120, -32, 1.9, 4.4, 4.9, 5.4, 6.1, 6.9, 7.8, 8.7, 9.6, 10.5, 11.3, 12.2, 13.1, 13.6, 15.3, 18.8, 21.5],
  [-1116, -32, 1.7, 3.8, 4.9, 5.3, 6.0, 6.8, 7.7, 8.5, 9.3, 10.1, 10.9, 11.7, 12.5, 13.0, 15.2, 18.5, 20.5],
  [-1112, -32, 1.6, 3.2, 4.8, 5.2, 6.0, 6.7, 7.5, 8.2, 9.0, 9.7, 10.5, 11.2, 12.0, 12.6, 15.0, 18.4, 20.3],
  [-1108, -32, 1.6, 2.7, 4.7, 5.2, 5.9, 6.6, 7.3, 8.0, 8.7, 9.4, 10.0, 10.7, 11.4, 11.9, 14.8, 18.6, 20.3],
  [-1104, -32, 1.5, 2.4, 4.5, 5.1, 5.8, 6.5, 7.2, 7.8, 8.4, 9.0, 9.6, 10.2, 10.8, 11.2, 14.3, 18.6, 20.3],
  [-1100, -32, 1.4, 2.1, 4.1, 5.0, 5.7, 6.4, 6.9, 7.5, 8.1, 8.7, 9.2, 9.8, 10.4, 10.6, 12.8, 18.5, 20.1],
  [-1096, -32, 1.3, 2.0, 3.6, 5.0, 5.5, 6.0, 6.6, 7.2, 7.7, 8.3, 8.9, 9.4, 10.0, 10.3, 11.0, 17.5, 19.9],
  [-1092, -32, 1.3, 1.9, 3.1, 4.9, 5.2, 5.7, 6.3, 6.9, 7.4, 8.0, 8.4, 8.9, 9.3, 9.5, 10.5, 17.1, 19.8],
  [-1088, -32, 1.2, 1.8, 2.8, 4.7, 5.0, 5.4, 5.9, 6.4, 6.9, 7.2, 7.6, 8.0, 8.3, 8.8, 10.4, 17.1, 19.7],
  [-1084, -32, 1.1, 1.7, 2.5, 4.2, 4.6, 4.6, 5.1, 5.5, 5.9, 6.3, 6.7, 7.1, 7.5, 8.1, 10.0, 15.6, 19.4],
  [-1080, -32, 1.1, 1.7, 2.2, 2.7, 3.2, 3.6, 4.1, 4.6, 5.0, 5.5, 6.0, 6.4, 6.9, 7.5, 9.2, 14.8, 18.7],
  [-1076, -32, 1.0, 1.6, 2.0, 2.5, 3.0, 3.4, 3.8, 4.2, 4.6, 5.0, 5.4, 5.8, 6.2, 6.8, 7.8, 12.7, 16.6],
  [-1072, -32, 0.8, 1.4, 1.9, 2.5, 3.0, 3.4, 3.7, 4.0, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6.3, 8.2, 10.7],
  [-1068, -32, 0.7, 1.2, 1.9, 2.4, 3.0, 3.4, 3.6, 3.9, 4.2, 4.4, 4.7, 5.0, 5.2, 5.4, 5.8, 5.9, 6.0],
  [-1064, -32, 0.6, 1.2, 1.8, 2.5, 3.0, 3.5, 3.7, 4.0, 4.2, 4.5, 4.7, 5.0, 5.2, 5.5, 5.8, 5.9, 5.8],
  [-1060, -32, 0.7, 1.2, 1.8, 2.3, 2.9, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.9, 5.2, 5.6, 5.8, 5.8, 5.9],
  [-1056, -32, 0.5, 1.0, 1.6, 2.1, 2.7, 3.2, 3.4, 3.7, 3.9, 4.2, 4.5, 4.8, 5.1, 5.5, 5.7, 5.7, 5.8],
  [-1052, -32, 0.4, 0.9, 1.5, 2.1, 2.7, 3.1, 3.3, 3.6, 3.9, 4.2, 4.4, 4.7, 5.0, 5.3, 5.5, 5.5, 5.7],
  [-1048, -32, 0.4, 0.9, 1.4, 2.0, 2.6, 3.1, 3.4, 3.6, 3.8, 4.1, 4.4, 4.6, 4.9, 5.1, 5.3, 5.3, 5.5],
  [-1044, -32, 0.3, 0.8, 1.3, 1.9, 2.6, 3.1, 3.3, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 4.9, 5.0, 5.1, 5.2],
  [-1040, -32, 0.2, 0.7, 1.2, 1.8, 2.4, 3.0, 3.2, 3.5, 3.8, 4.0, 4.3, 4.5, 4.8, 4.8, 4.8, 5.0, 5.1],
  [-1036, -32, 0.2, 0.5, 1.1, 1.7, 2.2, 2.7, 2.9, 3.2, 3.6, 3.8, 4.2, 4.5, 4.8, 4.8, 4.8, 4.8, 4.9],
  [-1032, -32, 0.1, 0.5, 1.0, 1.5, 1.9, 2.4, 2.7, 3.1, 3.4, 3.8, 4.1, 4.5, 4.8, 4.9, 4.8, 4.7, 4.7],
  [-1028, -32, 0.1, 0.4, 0.9, 1.3, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 4.9, 4.8, 4.8, 4.7],
  [-1024, -32, 0.1, 0.3, 0.6, 1.0, 1.3, 1.6, 2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 4.9, 4.9, 4.8, 4.6],
  [-1020, -32, 0.1, 0.3, 0.5, 0.8, 1.1, 1.5, 1.9, 2.4, 2.8, 3.3, 3.8, 4.2, 4.7, 5.0, 4.9, 4.8, 4.7],
  [-1016, -32, 0.1, 0.2, 0.4, 0.6, 1.0, 1.5, 2.1, 2.6, 3.1, 3.5, 4.0, 4.5, 4.9, 5.1, 5.0, 4.9, 4.8],
  [-1012, -32, 0.0, 0.2, 0.3, 0.6, 0.9, 1.4, 2.0, 2.6, 3.2, 3.7, 4.2, 4.6, 5.1, 5.3, 5.2, 5.1, 5.0],
  [-1008, -32, -0.0, 0.2, 0.3, 0.5, 0.9, 1.5, 2.1, 2.6, 3.2, 3.7, 4.3, 4.8, 5.3, 5.4, 5.4, 5.2, 5.1],
  [-1004, -32, -0.1, 0.1, 0.3, 0.4, 1.0, 1.5, 2.1, 2.6, 3.2, 3.7, 4.2, 4.8, 5.3, 5.4, 5.4, 5.4, 5.3],
  [-1000, -32, -0.2, 0.0, 0.1, 0.5, 1.1, 1.6, 2.1, 2.6, 3.1, 3.6, 4.1, 4.7, 5.2, 5.3, 5.4, 5.4, 5.4],
  [-996, -32, -0.8, -0.0, 0.1, 0.4, 1.0, 1.6, 2.1, 2.6, 3.2, 3.7, 4.2, 4.7, 5.2, 5.4, 5.4, 5.4, 5.3],
  [-992, -32, -1.3, -0.1, 0.1, 0.5, 1.1, 1.6, 2.1, 2.6, 3.1, 3.6, 4.1, 4.7, 5.3, 5.5, 5.5, 5.4, 5.3],
  [-988, -32, -1.6, -0.3, 0.1, 0.4, 0.8, 1.3, 1.8, 2.4, 2.9, 3.4, 3.9, 4.5, 5.2, 5.7, 5.6, 5.4, 5.4],
  [-984, -32, -1.6, -1.1, 0.0, 0.2, 0.5, 1.0, 1.5, 2.0, 2.6, 3.1, 3.8, 4.5, 5.2, 5.6, 5.5, 5.3, 5.3],
  [-980, -32, -1.6, -1.6, -0.3, 0.1, 0.3, 0.7, 1.2, 1.7, 2.4, 3.1, 3.8, 4.6, 5.1, 5.2, 5.1, 5.0, 5.0],
  [-976, -32, -1.6, -1.6, -1.3, 0.0, 0.1, 0.4, 1.0, 1.6, 2.3, 2.9, 3.5, 4.0, 4.9, 4.8, 4.8, 4.7, 4.7],
  [-972, -32, -1.6, -1.6, -1.6, -1.1, 0.1, 0.1, 0.3, 0.8, 1.2, 1.6, 1.8, 2.4, 3.3, 3.3, 2.5, 1.8, 1.2],
  [-968, -32, -1.6, -1.6, -1.6, -1.6, -1.4, -0.6, -0.8, -0.7, -0.5, -0.3, -0.2, -0.0, -0.0, -0.2, -0.4, -0.6, -0.7],
  [-964, -32, -1.6, -1.6, -1.6, -1.6, -1.6, -1.5, -1.4, -1.4, -1.3, -1.2, -1.1, -1.1, -1.0, -0.9, -0.8, -0.8, -0.7],
  [-960, -32, -1.6, -1.6, -1.6, -1.6, -1.6, -1.5, -1.4, -1.4, -1.3, -1.2, -1.1, -1.1, -1.0, -0.9, -0.8, -0.8, -0.6],
  [-956, -32, -1.6, -1.6, -1.6, -1.6, -1.6, -1.5, -1.4, -1.3, -1.3, -1.2, -1.1, -1.1, -1.0, -0.9, -0.8, -0.7, -0.6],
] }
const NORTH_GROUND: RowGrid = { y0: 956, step: 4, rows: [
  [956, -32, 69.8, 67.5, 64.2, 60.4, 56.8, 54.9, 54.6, 53.1, 51.1, 49.0, 46.7, 44.6, 42.5, 38.8, 34.2, 29.4, 25.1],
  [960, -32, 69.4, 66.9, 63.5, 60.0, 57.2, 54.9, 54.6, 53.1, 50.8, 48.3, 45.6, 43.1, 40.9, 37.7, 32.2, 27.6, 23.3],
  [964, -32, 69.2, 66.9, 63.8, 60.3, 56.6, 54.8, 54.6, 52.9, 50.2, 47.3, 44.4, 41.3, 38.8, 36.6, 30.3, 26.4, 22.0],
  [968, -32, 69.0, 66.8, 62.7, 58.9, 55.3, 54.8, 54.6, 52.6, 48.8, 45.2, 41.8, 38.6, 35.9, 33.5, 28.5, 24.9, 21.5],
  [972, -32, 68.8, 66.9, 60.8, 56.5, 55.1, 53.9, 53.3, 51.6, 47.9, 43.1, 38.7, 35.4, 32.9, 29.8, 27.3, 24.5, 22.5],
  [976, -32, 68.6, 66.1, 59.6, 55.2, 54.9, 53.1, 50.9, 48.8, 46.3, 43.3, 37.8, 33.7, 32.4, 28.5, 27.1, 25.7, 25.0],
  [980, -32, 68.3, 65.4, 59.3, 55.0, 54.9, 53.6, 51.5, 49.0, 46.1, 42.7, 38.4, 33.7, 30.7, 28.1, 27.6, 27.2, 26.6],
  [984, -32, 67.9, 65.3, 58.8, 55.0, 55.1, 54.6, 52.8, 49.7, 46.0, 42.2, 38.4, 34.1, 31.0, 28.1, 27.8, 27.5, 26.8],
  [988, -32, 67.6, 65.0, 58.8, 55.1, 55.1, 55.5, 53.1, 49.4, 45.6, 41.8, 38.0, 34.3, 32.5, 28.6, 27.9, 27.7, 27.4],
  [992, -32, 66.9, 64.6, 59.7, 55.4, 55.1, 55.2, 53.0, 49.4, 45.7, 42.1, 38.5, 34.8, 32.8, 29.4, 28.4, 28.4, 28.6],
  [996, -32, 65.7, 63.5, 59.5, 55.5, 55.2, 55.2, 53.6, 50.2, 46.9, 43.7, 40.4, 36.9, 34.6, 31.3, 30.2, 29.9, 29.1],
  [1000, -32, 64.3, 62.1, 58.8, 55.3, 55.2, 55.3, 57.0, 55.9, 52.7, 49.6, 46.4, 42.7, 37.5, 32.7, 32.0, 30.6, 29.0],
  [1004, -32, 63.1, 60.2, 57.4, 55.1, 55.6, 56.2, 59.1, 61.0, 59.6, 56.5, 53.8, 53.2, 49.4, 36.1, 32.6, 30.9, 28.7],
  [1008, -32, 61.3, 58.5, 55.9, 54.9, 61.2, 63.8, 64.6, 64.7, 64.8, 63.7, 63.6, 64.4, 62.6, 45.4, 33.5, 31.7, 28.6],
  [1012, -32, 59.0, 57.3, 54.6, 54.9, 65.1, 66.1, 65.9, 65.8, 65.8, 65.8, 65.8, 66.1, 66.1, 53.3, 35.9, 33.2, 29.1],
  [1016, -32, 57.5, 55.2, 53.9, 55.2, 65.6, 66.1, 65.9, 65.8, 65.8, 65.8, 65.8, 66.1, 66.1, 56.8, 38.5, 35.2, 30.8],
  [1020, -32, 54.9, 53.8, 53.5, 53.7, 65.6, 66.1, 65.9, 65.8, 65.8, 65.8, 65.8, 66.1, 66.1, 57.5, 39.9, 34.6, 31.1],
  [1024, -32, 54.2, 53.7, 53.0, 52.5, 65.9, 66.1, 65.9, 65.8, 65.8, 65.8, 65.8, 66.1, 66.1, 56.9, 42.4, 36.3, 31.5],
  [1028, -32, 54.2, 53.1, 51.3, 50.2, 65.2, 66.1, 65.9, 65.8, 65.9, 65.8, 65.8, 66.1, 66.2, 55.5, 43.1, 39.7, 32.8],
  [1032, -32, 53.0, 51.1, 49.1, 48.1, 64.2, 66.2, 65.9, 65.9, 65.9, 65.9, 65.8, 66.1, 66.2, 58.1, 42.2, 39.9, 33.0],
  [1036, -32, 50.6, 49.0, 47.4, 47.2, 64.3, 66.2, 66.0, 65.9, 65.9, 65.9, 65.9, 66.2, 66.3, 55.9, 39.8, 37.6, 31.5],
  [1040, -32, 48.9, 47.6, 46.3, 46.5, 64.8, 66.3, 66.1, 66.0, 66.0, 66.0, 65.9, 66.3, 66.3, 59.8, 39.3, 35.7, 31.1],
  [1044, -32, 47.9, 46.4, 45.0, 47.6, 65.8, 66.4, 66.2, 66.0, 66.1, 66.0, 66.0, 66.3, 66.4, 62.7, 39.5, 33.2, 29.5],
  [1048, -32, 46.8, 45.2, 43.8, 50.4, 66.1, 66.4, 66.2, 66.1, 66.1, 66.1, 66.1, 66.4, 66.4, 59.8, 43.0, 31.3, 30.1],
  [1052, -32, 45.4, 43.9, 42.6, 50.7, 65.8, 66.5, 66.3, 66.2, 66.2, 66.2, 66.2, 66.5, 66.5, 58.4, 43.9, 29.8, 30.6],
  [1056, -32, 44.5, 42.9, 41.6, 50.1, 65.4, 66.6, 66.4, 66.2, 66.3, 66.3, 66.3, 66.5, 66.6, 59.5, 44.3, 29.1, 30.3],
  [1060, -32, 43.5, 42.0, 40.9, 49.9, 65.3, 66.7, 66.4, 66.4, 66.4, 66.3, 66.3, 66.6, 66.7, 59.8, 42.9, 28.7, 30.1],
  [1064, -32, 42.3, 40.9, 39.8, 50.3, 66.5, 66.8, 66.5, 66.4, 66.5, 66.4, 66.4, 66.7, 66.7, 63.0, 38.5, 28.3, 29.0],
  [1068, -32, 41.0, 39.9, 39.1, 49.9, 66.4, 66.9, 66.6, 66.5, 66.5, 66.5, 66.5, 66.8, 66.8, 62.0, 41.0, 28.0, 27.8],
  [1072, -32, 39.7, 38.8, 38.3, 50.0, 66.2, 66.9, 66.7, 66.6, 66.6, 66.6, 66.6, 66.8, 66.9, 60.9, 37.1, 26.2, 25.8],
  [1076, -32, 38.5, 37.7, 37.6, 52.7, 66.5, 67.0, 66.8, 66.6, 66.7, 66.7, 66.6, 66.9, 67.0, 61.1, 38.6, 25.9, 25.2],
  [1080, -32, 37.2, 36.6, 37.9, 64.1, 66.9, 67.0, 66.9, 66.7, 66.8, 66.8, 66.8, 67.0, 67.1, 63.2, 35.5, 25.5, 24.6],
  [1084, -32, 36.2, 35.6, 36.1, 65.3, 66.5, 66.7, 66.7, 66.7, 66.8, 66.8, 66.8, 67.1, 63.7, 59.9, 31.6, 25.1, 23.9],
  [1088, -32, 35.4, 34.5, 33.0, 31.4, 32.2, 50.1, 52.3, 46.9, 51.6, 60.3, 60.8, 55.6, 31.3, 28.9, 25.0, 23.6, 22.7],
  [1092, -32, 34.8, 33.6, 32.1, 29.9, 27.7, 29.4, 29.4, 27.6, 29.8, 40.9, 40.5, 33.8, 27.2, 26.4, 24.1, 21.4, 20.2],
  [1096, -32, 34.0, 33.0, 31.4, 29.3, 27.5, 27.6, 27.3, 27.1, 27.0, 27.5, 27.2, 26.6, 26.3, 25.2, 23.3, 21.1, 18.6],
  [1100, -32, 33.2, 32.2, 30.7, 28.6, 27.3, 27.2, 27.1, 27.1, 27.0, 26.8, 25.8, 25.1, 23.9, 22.8, 22.0, 20.2, 18.6],
  [1104, -32, 32.8, 31.3, 29.8, 27.8, 27.2, 27.2, 27.1, 27.0, 26.7, 25.9, 24.5, 23.2, 21.9, 21.0, 20.3, 18.9, 17.3],
  [1108, -32, 32.4, 30.5, 28.9, 27.3, 27.2, 27.1, 26.9, 26.6, 25.7, 24.5, 23.2, 21.8, 20.3, 19.2, 18.2, 16.5, 14.2],
  [1112, -32, 31.4, 29.8, 27.9, 27.1, 27.1, 27.0, 26.5, 25.7, 24.5, 23.3, 22.1, 20.7, 19.2, 17.8, 16.6, 14.2, 11.0],
  [1116, -32, 30.7, 28.8, 27.2, 26.9, 27.0, 26.6, 25.6, 24.6, 23.5, 22.4, 21.3, 19.9, 18.3, 16.7, 15.5, 13.2, 10.0],
  [1120, -32, 30.0, 28.0, 26.7, 26.6, 26.6, 25.7, 24.7, 23.7, 22.6, 21.6, 20.5, 19.2, 17.5, 15.7, 14.7, 12.1, 8.9],
  [1124, -32, 29.0, 27.2, 26.2, 26.4, 25.9, 25.0, 24.0, 22.9, 21.9, 20.9, 19.7, 18.4, 16.6, 14.7, 13.6, 11.3, 8.0],
  [1128, -32, 28.0, 26.4, 25.8, 26.0, 25.3, 24.3, 23.3, 22.3, 21.2, 19.9, 18.6, 17.7, 15.8, 13.8, 12.0, 9.6, 6.6],
  [1132, -32, 27.1, 25.7, 25.4, 25.5, 24.5, 23.5, 22.4, 21.3, 20.4, 19.1, 17.8, 16.8, 15.2, 13.3, 11.1, 8.1, 5.8],
  [1136, -32, 26.2, 25.0, 25.1, 24.8, 23.7, 22.7, 21.1, 20.2, 19.6, 18.5, 16.9, 16.2, 14.9, 13.0, 11.1, 8.4, 5.2],
  [1140, -32, 25.3, 24.5, 24.7, 24.0, 22.9, 21.8, 20.2, 19.4, 18.7, 17.7, 16.3, 15.7, 14.7, 12.8, 10.7, 7.8, 5.2],
  [1144, -32, 24.4, 24.2, 24.2, 23.2, 22.0, 20.5, 18.9, 18.2, 17.6, 16.7, 15.8, 15.2, 14.6, 12.7, 10.2, 7.4, 5.3],
  [1148, -32, 23.8, 23.8, 23.6, 22.3, 20.9, 19.1, 17.6, 17.0, 16.5, 15.7, 15.1, 14.7, 14.4, 12.9, 10.4, 7.6, 5.6],
  [1152, -32, 23.4, 23.4, 22.9, 21.8, 20.1, 18.6, 17.0, 16.2, 15.7, 15.1, 14.6, 14.3, 14.1, 12.7, 10.4, 7.8, 5.4],
  [1156, -32, 23.0, 23.0, 22.6, 21.5, 20.2, 18.7, 17.4, 16.2, 15.7, 14.9, 14.5, 14.1, 14.0, 12.9, 10.7, 8.2, 5.4],
  [1160, -32, 22.6, 22.5, 22.2, 21.3, 20.5, 19.3, 18.0, 16.9, 16.1, 15.3, 14.8, 14.2, 13.7, 12.9, 11.0, 8.9, 5.9],
  [1164, -32, 22.1, 22.0, 21.6, 20.9, 20.3, 19.6, 18.8, 17.8, 16.7, 16.0, 15.5, 14.4, 13.6, 12.6, 10.9, 8.8, 6.2],
  [1168, -32, 21.7, 21.3, 21.0, 20.5, 20.0, 19.5, 19.0, 18.1, 17.1, 16.6, 15.9, 14.8, 13.7, 12.5, 11.0, 8.9, 6.7],
  [1172, -32, 21.4, 21.0, 20.6, 20.1, 19.6, 19.1, 18.7, 18.2, 17.5, 16.9, 16.5, 15.2, 13.9, 12.4, 10.7, 8.7, 6.5],
  [1176, -32, 21.1, 20.7, 20.3, 19.8, 19.3, 18.9, 18.5, 18.1, 17.6, 17.1, 16.8, 15.9, 14.5, 12.5, 10.6, 8.4, 6.5],
  [1180, -32, 21.2, 20.8, 20.5, 19.5, 19.0, 18.5, 18.2, 17.8, 17.5, 17.1, 16.8, 16.2, 14.9, 12.9, 10.8, 8.5, 6.6],
  [1184, -32, 21.4, 21.1, 20.7, 20.0, 19.3, 18.5, 17.9, 17.5, 17.2, 16.9, 16.5, 16.2, 15.4, 13.2, 11.0, 8.8, 6.9],
  [1188, -32, 21.6, 21.4, 20.9, 20.2, 19.1, 18.2, 17.8, 17.4, 16.9, 16.5, 16.2, 16.0, 15.5, 13.8, 11.5, 9.4, 7.3],
  [1192, -32, 21.7, 21.6, 21.2, 20.2, 18.9, 17.8, 17.6, 17.4, 16.9, 16.3, 15.9, 15.7, 15.4, 14.4, 12.3, 10.0, 7.8],
  [1196, -32, 21.8, 21.8, 21.3, 20.2, 18.9, 17.7, 17.6, 17.4, 16.9, 16.3, 15.7, 15.3, 15.0, 14.6, 13.2, 10.8, 8.6],
  [1200, -32, 21.9, 21.9, 21.4, 20.1, 18.7, 17.8, 17.6, 17.2, 16.7, 16.3, 15.6, 15.0, 14.7, 14.4, 13.7, 11.6, 9.6],
  [1204, -32, 21.9, 22.0, 21.6, 20.0, 18.6, 18.0, 17.5, 16.9, 16.5, 16.1, 15.5, 14.8, 14.3, 14.1, 13.9, 12.4, 10.4],
  [1208, -32, 22.1, 22.1, 21.7, 19.9, 18.5, 17.9, 17.4, 16.9, 16.3, 15.8, 15.2, 14.6, 14.0, 13.8, 13.6, 13.0, 11.4],
  [1212, -32, 22.2, 22.1, 21.6, 19.9, 18.6, 18.0, 17.4, 16.7, 16.1, 15.4, 14.8, 14.2, 13.7, 13.6, 13.4, 13.1, 12.3],
  [1216, -32, 22.3, 22.2, 21.7, 20.0, 18.6, 18.0, 17.4, 16.7, 16.0, 15.4, 14.8, 14.1, 13.6, 13.3, 13.1, 12.9, 12.7],
  [1220, -32, 22.3, 22.3, 21.9, 19.9, 18.6, 18.0, 17.3, 16.7, 16.0, 15.4, 14.8, 14.2, 13.6, 13.3, 13.0, 12.7, 12.4],
  [1224, -32, 22.4, 22.4, 22.0, 20.0, 18.7, 18.0, 17.4, 16.8, 16.2, 15.7, 15.2, 14.5, 13.9, 13.5, 13.0, 12.6, 12.3],
  [1228, -32, 22.6, 22.5, 22.3, 20.7, 19.3, 18.5, 17.8, 17.3, 16.7, 16.2, 15.7, 15.0, 14.5, 13.9, 13.1, 12.6, 12.2],
  [1232, -32, 22.7, 22.6, 22.4, 21.8, 20.2, 19.3, 18.5, 17.9, 17.4, 16.9, 16.4, 15.7, 15.0, 14.2, 13.3, 12.6, 12.2],
  [1236, -36, 22.9, 22.9, 22.7, 22.6, 22.2, 20.5, 19.7, 19.4, 19.0, 18.6, 18.1, 17.3, 16.3, 15.5, 14.6, 13.4, 12.8],
  [1240, -36, 23.1, 22.9, 22.8, 22.6, 22.3, 20.5, 20.1, 19.9, 19.8, 19.6, 19.3, 18.7, 17.1, 16.1, 15.3, 14.7, 14.0],
  [1244, -36, 23.3, 23.0, 22.8, 22.7, 22.4, 20.7, 20.2, 20.1, 19.9, 19.7, 19.3, 18.8, 17.4, 16.8, 16.4, 16.4, 15.8],
  [1248, -36, 23.3, 23.1, 22.9, 22.7, 22.4, 20.7, 20.3, 20.2, 20.0, 19.7, 19.3, 18.8, 18.0, 17.7, 17.4, 17.4, 17.3],
  [1252, -36, 23.4, 23.1, 22.9, 22.6, 22.1, 20.9, 20.5, 20.2, 20.0, 19.7, 19.2, 18.8, 18.6, 18.5, 18.0, 18.2, 17.8],
  [1256, -36, 23.5, 23.1, 22.8, 22.4, 21.8, 21.1, 20.7, 20.3, 20.0, 19.7, 19.3, 19.1, 19.2, 19.0, 18.6, 18.7, 18.0],
  [1260, -36, 23.6, 23.1, 22.8, 22.3, 21.7, 21.1, 20.6, 20.3, 20.0, 19.8, 19.5, 19.4, 19.4, 19.3, 19.1, 19.0, 18.4],
  [1264, -40, 24.0, 23.7, 23.0, 22.7, 22.4, 21.6, 21.0, 20.6, 20.3, 20.0, 19.8, 19.7, 19.6, 19.6, 19.7, 19.8, 19.4],
  [1268, -40, 24.1, 23.8, 23.0, 22.8, 22.2, 21.4, 20.9, 20.6, 20.3, 20.1, 19.8, 19.8, 19.8, 19.8, 20.1, 20.4, 19.8],
  [1272, -40, 24.2, 23.9, 23.0, 22.5, 21.9, 21.4, 20.8, 20.7, 20.3, 20.1, 19.9, 19.8, 19.9, 20.0, 20.4, 20.7, 20.5],
  [1276, -40, 24.4, 23.9, 23.0, 22.6, 22.1, 21.5, 21.1, 20.7, 20.4, 20.2, 20.1, 20.0, 20.2, 20.6, 21.2, 21.3, 21.0],
  [1280, -40, 24.4, 24.1, 23.4, 22.8, 22.4, 21.9, 21.4, 21.1, 20.9, 20.7, 20.4, 20.3, 20.8, 21.5, 22.0, 22.2, 21.9],
  [1284, -44, 26.2, 25.2, 24.5, 23.9, 23.2, 22.6, 22.1, 21.6, 21.4, 21.3, 21.2, 21.0, 20.9, 21.6, 22.5, 23.0, 23.0],
  [1288, -44, 27.2, 26.3, 25.5, 24.7, 23.8, 23.0, 22.4, 22.0, 21.9, 21.8, 21.8, 21.9, 21.8, 22.7, 23.7, 24.0, 24.0],
  [1292, -44, 28.4, 27.4, 26.5, 25.7, 24.9, 24.3, 23.8, 23.2, 23.4, 23.4, 23.2, 22.9, 22.9, 24.0, 25.0, 25.3, 25.3],
  [1296, -44, 29.5, 28.6, 27.7, 27.1, 26.7, 26.2, 25.7, 25.2, 25.0, 25.5, 25.5, 24.7, 24.2, 25.5, 26.5, 26.7, 27.1],
  [1300, -48, 31.8, 30.8, 29.8, 29.2, 28.9, 28.5, 28.1, 27.7, 27.2, 26.8, 26.6, 26.4, 25.7, 25.9, 27.1, 27.8, 28.3],
  [1304, -48, 32.9, 31.9, 31.1, 30.7, 30.6, 30.3, 29.8, 29.4, 29.1, 28.7, 28.3, 27.9, 27.7, 27.8, 28.7, 29.5, 30.2],
  [1308, -48, 34.1, 33.1, 32.7, 32.5, 32.3, 32.0, 31.6, 31.2, 30.9, 30.5, 30.2, 29.9, 29.7, 29.7, 30.6, 31.5, 32.5],
  [1312, -52, 35.7, 35.3, 34.7, 34.4, 34.3, 34.0, 33.7, 33.4, 33.0, 32.6, 32.3, 32.0, 31.7, 31.5, 31.8, 32.7, 33.7],
  [1316, -52, 36.3, 36.5, 36.3, 36.0, 35.9, 35.6, 35.2, 34.9, 34.6, 34.3, 34.1, 33.5, 33.2, 33.2, 34.1, 35.0, 36.0],
  [1320, -52, 37.0, 37.4, 37.6, 37.4, 37.2, 36.9, 36.6, 36.4, 36.1, 35.8, 35.5, 35.1, 34.9, 35.7, 36.7, 37.6, 38.7],
  [1324, -56, 37.2, 37.4, 37.7, 38.0, 38.2, 38.3, 38.1, 37.9, 37.7, 37.5, 37.3, 37.2, 37.3, 37.8, 38.6, 39.7, 40.3],
  [1328, -56, 38.1, 38.3, 38.4, 38.4, 38.3, 38.4, 38.7, 38.7, 38.7, 38.6, 38.8, 38.9, 39.4, 40.1, 40.5, 40.8, 41.0],
  [1332, -60, 38.3, 38.9, 39.3, 39.4, 39.2, 38.9, 39.0, 39.2, 39.2, 39.2, 39.2, 39.1, 39.4, 39.9, 40.4, 40.9, 42.0],
  [1336, -60, 39.3, 39.9, 40.3, 40.7, 40.7, 40.3, 39.8, 39.8, 39.9, 40.0, 39.9, 39.6, 39.5, 40.3, 41.7, 43.4, 45.6],
  [1340, -64, 39.9, 40.3, 40.9, 41.6, 42.1, 42.2, 41.8, 41.2, 40.9, 40.9, 41.0, 40.7, 40.4, 40.6, 42.9, 45.2, 47.4],
  [1344, -64, 41.1, 41.4, 42.0, 42.4, 43.0, 43.2, 43.0, 42.9, 42.9, 42.7, 42.3, 41.9, 41.5, 43.1, 46.2, 49.2, 50.8],
  [1348, -68, 42.2, 42.6, 42.8, 43.2, 43.6, 43.9, 43.8, 44.6, 45.4, 45.8, 45.9, 44.7, 43.6, 43.7, 46.2, 49.3, 52.2],
  [1352, -68, 43.8, 44.3, 44.4, 44.6, 44.9, 45.2, 45.5, 46.3, 47.1, 47.9, 48.7, 47.7, 46.1, 46.7, 49.8, 52.6, 55.1],
  [1356, -72, 45.3, 46.1, 46.7, 46.4, 46.3, 46.4, 46.9, 47.6, 48.2, 49.0, 49.8, 50.6, 49.3, 48.6, 50.8, 53.5, 56.2],
  [1360, -72, 47.2, 48.0, 48.5, 48.4, 48.2, 48.5, 49.0, 49.6, 50.2, 50.9, 51.7, 52.4, 51.6, 52.5, 54.7, 57.6, 59.4],
  [1364, -76, 48.4, 48.8, 49.6, 50.3, 50.2, 50.2, 50.7, 51.4, 52.1, 52.5, 53.0, 53.6, 54.3, 54.6, 56.3, 58.6, 61.0],
  [1368, -76, 50.3, 50.8, 51.8, 52.3, 52.1, 52.4, 53.0, 53.6, 54.3, 55.1, 55.7, 56.1, 56.5, 57.6, 59.6, 62.1, 63.3],
  [1372, -80, 51.9, 52.8, 53.4, 54.3, 54.2, 54.2, 54.7, 55.3, 55.8, 56.4, 57.2, 58.1, 58.8, 59.4, 61.4, 63.4, 64.5],
  [1376, -80, 54.6, 55.5, 56.4, 56.6, 56.2, 56.3, 56.8, 57.4, 58.0, 58.7, 59.3, 60.0, 61.0, 62.4, 64.1, 65.4, 66.5],
  [1380, -84, 56.2, 57.5, 58.5, 59.1, 58.6, 58.4, 58.2, 58.4, 58.9, 59.8, 60.7, 61.4, 62.1, 62.9, 64.4, 66.2, 67.5],
  [1384, -88, 58.2, 59.2, 60.5, 61.1, 61.0, 60.7, 60.1, 60.0, 59.9, 60.2, 60.8, 61.7, 63.0, 63.8, 64.8, 66.4, 68.1],
  [1388, -88, 61.1, 62.4, 63.6, 63.2, 63.2, 63.2, 62.5, 61.5, 61.3, 61.5, 61.8, 62.6, 63.5, 64.6, 66.5, 68.0, 69.6],
  [1392, -92, 62.7, 64.2, 66.7, 68.8, 65.8, 65.5, 65.5, 65.5, 64.3, 63.2, 62.6, 62.8, 63.3, 64.5, 66.6, 67.9, 69.5],
  [1396, -96, 63.6, 65.1, 67.2, 69.3, 70.2, 68.7, 67.8, 67.7, 68.0, 67.7, 66.2, 65.0, 64.1, 64.1, 66.0, 68.7, 69.8],
  [1400, -96, 66.5, 68.0, 69.8, 70.7, 71.2, 71.5, 70.2, 70.1, 70.2, 70.5, 69.6, 68.0, 66.6, 65.8, 68.3, 70.5, 71.6],
  [1404, -100, 68.3, 69.8, 70.9, 72.2, 73.0, 72.9, 73.2, 72.6, 72.4, 72.4, 72.7, 72.8, 71.5, 69.0, 68.5, 70.3, 72.3],
  [1408, -104, 70.0, 72.0, 73.6, 73.9, 73.8, 73.9, 73.9, 74.0, 74.0, 74.0, 74.0, 74.1, 74.3, 74.2, 73.3, 71.3, 72.7],
  [1412, -108, 71.4, 72.9, 74.0, 74.1, 73.9, 73.9, 74.1, 74.1, 74.2, 74.2, 74.2, 74.2, 74.3, 74.3, 74.3, 74.3, 74.2],
  [1416, -108, 73.7, 74.0, 74.1, 74.0, 74.1, 74.2, 74.3, 74.4, 74.4, 74.4, 74.4, 74.4, 74.4, 74.4, 74.4, 74.9, 75.6],
  [1420, -112, 74.0, 74.1, 74.1, 74.2, 74.2, 74.3, 74.4, 74.5, 74.5, 74.6, 74.6, 74.6, 74.6, 74.7, 74.7, 74.8, 75.7],
  [1424, -112, 74.2, 74.3, 74.4, 74.4, 74.5, 74.6, 74.6, 74.6, 74.7, 74.7, 74.7, 74.7, 74.9, 75.2, 75.5, 75.7, 76.0],
  [1428, -112, 74.5, 74.5, 74.6, 74.6, 74.7, 74.7, 74.8, 74.8, 74.9, 74.9, 74.9, 74.8, 75.2, 75.5, 76.1, 76.0, 75.9],
  [1432, -112, 74.7, 74.7, 74.8, 74.8, 74.9, 74.9, 74.9, 75.0, 75.0, 75.1, 75.0, 75.2, 75.4, 75.6, 76.1, 76.0, 75.9],
  [1436, -112, 74.9, 74.9, 75.0, 75.0, 75.0, 75.0, 75.1, 75.2, 75.2, 75.1, 75.1, 75.4, 75.6, 75.9, 76.0, 75.9, 76.0],
  [1440, -112, 75.1, 75.1, 75.1, 75.1, 75.1, 75.2, 75.3, 75.3, 75.3, 75.1, 75.2, 75.5, 75.9, 76.0, 75.9, 75.9, 76.0],
  [1444, -112, 75.2, 75.2, 75.2, 75.3, 75.3, 75.4, 75.4, 75.4, 75.3, 75.3, 75.5, 75.7, 76.0, 76.0, 75.9, 76.0, 76.0],
] }
/** The map's ground under (x, y) in this frame: Mapterhorn plus the datum. */
const ground = (x: number, y: number) => (y < 0 ? rowGround(SOUTH_GROUND, x, y) : rowGround(NORTH_GROUND, x, y)) + DATUM

// ---- Structure along the curving deck ---------------------------------------------

const across = (s: number, k = 1): V3 => { const p = pathAt(s); return [p.ty * k, -p.tx * k, 0] }
const alongN = (s: number, k = 1): V3 => { const p = pathAt(s); return [p.tx * k, p.ty * k, 0] }
type Faces = { out?: boolean; in?: boolean; top?: boolean; bottom?: boolean; ends?: boolean }

/**
 * A box along the deck from offset o0 to o1, its top and bottom following
 * `top(s)` and `bot(s)` through the stations; only the faces asked for.
 * "out" is the face at the larger |o|, so one call serves either side.
 */
function deckBand(p: Part, o0: number, o1: number, ss: number[], top: (s: number) => number, bot: (s: number) => number, faces: Faces) {
  ss = [...ss].sort((a, b) => a - b)
  const oOut = Math.abs(o1) >= Math.abs(o0) ? o1 : o0, oIn = oOut === o1 ? o0 : o1
  const k = Math.sign(oOut - oIn) || 1
  for (let i = 0; i < ss.length - 1; i++) {
    const a = ss[i], b = ss[i + 1], n = across((a + b) / 2)
    if (faces.out) faceN(p, at(a, oOut, bot(a)), at(b, oOut, bot(b)), at(b, oOut, top(b)), at(a, oOut, top(a)), [n[0] * k, n[1] * k, 0])
    if (faces.in) faceN(p, at(a, oIn, bot(a)), at(b, oIn, bot(b)), at(b, oIn, top(b)), at(a, oIn, top(a)), [-n[0] * k, -n[1] * k, 0])
    if (faces.top) faceN(p, at(a, o0, top(a)), at(a, o1, top(a)), at(b, o1, top(b)), at(b, o0, top(b)), [0, 0, 1])
    if (faces.bottom) faceN(p, at(a, o0, bot(a)), at(a, o1, bot(a)), at(b, o1, bot(b)), at(b, o0, bot(b)), [0, 0, -1])
  }
  if (faces.ends)
    for (const [s, k2] of [[ss[0], -1], [ss[ss.length - 1], 1]] as [number, number][])
      faceN(p, at(s, o0, bot(s)), at(s, o1, bot(s)), at(s, o1, top(s)), at(s, o0, top(s)), alongN(s, k2))
}

/** An open truss at offset o: chords, a post at every panel point and alternating diagonals, as `truss` in the kit. */
function deckTruss(chords: Part, web: Part, o: number, ps: number[], top: (s: number) => number, bot: (s: number) => number,
  { chordW = TRUSS_W, topD = 0.9, botD = 0.9, member = 0.45, curve = ps } = {}) {
  const o0 = o - chordW / 2, o1 = o + chordW / 2, all = { out: true, in: true, top: true, bottom: true }
  deckBand(chords, o0, o1, curve, top, (s) => top(s) - topD, all)
  deckBand(chords, o0, o1, curve, (s) => bot(s) + botD, bot, all)
  for (let i = 0; i < ps.length; i++) {
    const s = ps[i]
    strip(web, at(s, o, bot(s) + botD), at(s, o, top(s) - topD), member, across(s))
    if (i < ps.length - 1) {
      const s2 = ps[i + 1], [sa, sb] = i % 2 ? [s, s2] : [s2, s]
      strip(web, at(sa, o, bot(sa) + botD), at(sb, o, top(sb) - topD), member, across((sa + sb) / 2))
    }
  }
}

/** A square column of side w from the ground (or `foot`) up to z, its foot following the terrain. */
function column(p: Part, c: [number, number], w: number, z: number, foot: (x: number, y: number) => number = ground) {
  const [x, y] = c, h = w / 2
  const plan: [number, number][] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  footedLoft(p, foot, [{ plan, z: 'ground' }, { plan, z }], 10, false)
}

/** A concrete block over a convex plan (CCW from above), from the ground up to z. */
function block(p: Part, plan: [number, number][], z: number, seg: number, foot: (x: number, y: number) => number = ground) {
  footedLoft(p, foot, [{ plan, z: 'ground' }, { plan, z }], seg)
}

/** A plan rectangle across the deck at stations s0..s1 and offsets o0..o1, CCW from above. */
const deckRect = (s0: number, s1: number, o0: number, o1: number): [number, number][] =>
  [at(s0, o0, 0), at(s0, o1, 0), at(s1, o1, 0), at(s1, o0, 0)].map(([x, y]) => [x, y] as [number, number])

/**
 * A trestle tower: four steel legs from their footings up to the deck truss,
 * at stations s0 and s1 and offsets ±half, with a strut and an X in every
 * face of every panel (about 10 m). `foot` is what the legs stand on.
 */
function trestle(steel: Part, conc: Part, s0: number, s1: number, half: number, top: (s: number, o: number) => number,
  foot: (x: number, y: number) => number, isLow: boolean) {
  const legs: [number, number][] = [[s0, -half], [s1, -half], [s1, half], [s0, half]]
  const PED = 1.0, h = 1.2
  const pad = ([x, y]: V3): [number, number][] => [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  // Each leg on a concrete footing a metre over the highest ground under it;
  // the low model has no footings, its legs running down to the ground.
  const base = legs.map(([s, o]) => Math.max(...pad(at(s, o, 0)).map(([x, y]) => foot(x, y))) + PED)
  legs.forEach(([s, o], i) => {
    const c = at(s, o, 0)
    column(steel, [c[0], c[1]], isLow ? 1.1 : 0.9, top(s, o), isLow ? foot : () => base[i])
    if (!isLow) block(conc, pad(c), base[i], 10, foot)
  })
  const member = isLow ? 0.8 : 0.5
  for (let f = 0; f < 4; f++) {
    const [sa, oa] = legs[f], [sb, ob] = legs[(f + 1) % 4]
    const n: V3 = f % 2 === 0 ? (sa === sb ? alongN(sa, -1) : across(sa, -1)) : (sa === sb ? alongN(sa, 1) : across(sa, 1))
    const z0 = Math.max(base[f], base[(f + 1) % 4]) + 0.5
    const z1 = Math.min(top(sa, oa), top(sb, ob)) - 0.4
    const panels = Math.max(1, Math.round((z1 - z0) / 10))
    const levels = Array.from({ length: panels + 1 }, (_, k) => z0 + ((z1 - z0) * k) / panels)
    for (const z of levels.slice(1, -1)) strip(steel, at(sa, oa, z), at(sb, ob, z), member, n)
    for (let k = 0; k < panels; k++) {
      strip(steel, at(sa, oa, levels[k]), at(sb, ob, levels[k + 1]), member, n)
      strip(steel, at(sb, ob, levels[k]), at(sa, oa, levels[k + 1]), member, n)
    }
  }
}

/**
 * Both legs of a pylon between y0 and y1, |x| xi to xo: concrete from the
 * ground to a stepped cap (two steps, as the lidar shows S1 and S2), the low
 * model's with one step and square corners.
 */
function pylon(p: Part, y0: number, y1: number, xi: number, xo: number, top: number, isLow: boolean) {
  for (const k of [-1, 1]) {
    const [a, b] = k < 0 ? [-xo, -xi] : [xi, xo]
    const plan = (i: number): [number, number][] => {
      const [x0, x1, ya, yb] = [a + i, b - i, Math.min(y0, y1) + i, Math.max(y0, y1) - i]
      if (isLow) return [[x0, ya], [x1, ya], [x1, yb], [x0, yb]]
      const r = 0.4
      return [[x0 + r, ya], [x1 - r, ya], [x1, ya + r], [x1, yb - r], [x1 - r, yb], [x0 + r, yb], [x0, yb - r], [x0, ya + r]]
    }
    footedLoft(p, ground, isLow
      ? [{ plan: plan(0), z: 'ground' }, { plan: plan(0), z: top - 1.6 }, { plan: plan(0.6), z: top - 1.6 }, { plan: plan(0.6), z: top }]
      : [{ plan: plan(0), z: 'ground' }, { plan: plan(0), z: top - 2.4 }, { plan: plan(0.45), z: top - 2.4 },
        { plan: plan(0.45), z: top - 1.1 }, { plan: plan(0.9), z: top - 1.1 }, { plan: plan(0.9), z: top }], isLow ? 20 : 3)
  }
}

// ---- Fort Point arch ------------------------------------------------------------------

const ARCH_S2 = -1087.5, ARCH_S1 = -HOUSING[1]
const ARCH_MID = (ARCH_S1 + ARCH_S2) / 2, ARCH_HALF = (ARCH_S1 - ARCH_S2) / 2
const archU = (y: number) => 1 - ((y - ARCH_MID) / ARCH_HALF) ** 2
const intrados = (y: number) => 6 + DATUM + 38.7 * archU(y)
const extrados = (y: number) => 34.5 + DATUM + 15.1 * archU(y)
const RIB = 1.4                 // depth of each of the ribs' two chords

function arch(steel: Part, web: Part, isLow: boolean) {
  const n = isLow ? 8 : 24
  const ys = stations(ARCH_S2, ARCH_S1, (ARCH_S1 - ARCH_S2) / n)
  const panel = stations(ARCH_S2, ARCH_S1, (ARCH_S1 - ARCH_S2) / 12)
  const all = { out: true, in: true, top: true, bottom: true }
  for (const k of [-1, 1]) {
    const x0 = k * (CABLE_X - TRUSS_W / 2), x1 = k * (CABLE_X + TRUSS_W / 2), x = k * CABLE_X
    band(steel, x0, x1, ys, (y) => intrados(y) + RIB, intrados, all)
    band(steel, x0, x1, ys, extrados, (y) => extrados(y) - RIB, all)
    const deckBottom = (y: number) => road(y, x) - ARCH_DOWN
    panel.forEach((y, i) => {
      // Radial posts between the chords, and spandrel posts up to the deck truss.
      if (i > 0 && i < panel.length - 1) {
        strip(steel, [x, y, intrados(y) + RIB], [x, y, extrados(y) - RIB], isLow ? 0.8 : 0.6, [k, 0, 0])
        strip(steel, [x, y, extrados(y)], [x, y, deckBottom(y)], isLow ? 0.8 : 0.6, [k, 0, 0])
      }
      if (!isLow && i < panel.length - 1) {
        const y2 = panel[i + 1]
        strip(web, [x, y, intrados(y) + RIB], [x, y2, extrados(y2) - RIB], 0.4, [k, 0, 0])
        strip(web, [x, y2, intrados(y2) + RIB], [x, y, extrados(y) - RIB], 0.4, [k, 0, 0])
      }
    })
  }
  if (!isLow)
    // Lateral bracing between the ribs, at both chords, every other panel.
    for (let i = 1; i < panel.length - 1; i += 2)
      for (const z of [intrados, extrados]) {
        const y = panel[i], zz = z === intrados ? intrados(y) + RIB / 2 : extrados(y) - RIB / 2
        strip(web, [-CABLE_X, y - 1.5, zz], [CABLE_X, y + 1.5, zz], 0.5, [0, 0, 1])
        strip(web, [-CABLE_X, y + 1.5, zz], [CABLE_X, y - 1.5, zz], 0.5, [0, 0, 1])
      }
}

// ---- Anchorages and approach supports -----------------------------------------------

const SOUTH_ROOF = 27.5 + DATUM
/** The south anchorage's plan (OSM), as two convex pieces: the block under the arch's end, and its wider south half. */
const SOUTH_ANCHORAGE: [number, number][][] = [
  [[-14.4, -1155.3], [16.7, -1155.3], [15.3, -1095.1], [-14.4, -1095.4]],
  [[-21.7, -1195.5], [18.1, -1195.9], [16.7, -1155.3], [-21.7, -1155.2]],
]
/** The north anchorage block, N1 to N2, as stretches of [y0, y1, half-width] (OSM, symmetrised). */
const NORTH_ANCHORAGE: [number, number, number][] = [
  [976.5, 986, 17.0], [986, 1007, 12.6], [1007, 1043, 19.2], [1043, 1076, 22.7], [1076, 1085.5, 23.9],
]
/** Inside the south anchorage's plan, its roof is the ground the towers stand on. */
const onSouthRoof = (_x: number, _y: number) => SOUTH_ROOF

/** The approach viaducts' trestle towers, as [s0, s1], and the half-width between their legs. */
const SOUTH_TOWERS: [number, number][] = [[-1189, -1180], [-1142.5, -1134]]
const SOUTH_BENTS = [-1256, -1239.5]
const NORTH_TOWERS: [number, number][] = [[1137.5, 1153.75], [1206, 1222.5], [1272.5, 1287.5], [1338, 1354]]
const SOUTH_HALF = 9, NORTH_HALF = 11.5
/** Concrete walls across the deck under a truss's or girder's end: [s, the structure's depth there]. */
const END_WALLS: [number, number][] = [[-1316, GIRDER_DOWN], [-1272, APPROACH_DOWN], [1400, APPROACH_DOWN], [1414, GIRDER_DOWN]]

/**
 * A copy of a tower lifted by dz into this frame's datum, its pier's foot
 * set on the strait as Mapterhorn draws it there (`base`).
 */
function lifted(p: Part, dz: number, base: number): Part {
  const out = merged(p)
  // Parts store glTF's frame, where map-frame z is y.
  for (let i = 1; i < out.pos.length; i += 3) out.pos[i] = out.pos[i] > 0.01 ? out.pos[i] + dz : base
  return out
}
/** Mapterhorn's strait under the south and north towers, NAVD88. */
const STRAIT = [-1.38, -0.63]

type Set = { steel: Part; web: Part; under: Part; conc: Part }
const newSet = (): Set => ({ steel: new Part(), web: new Part(), under: new Part(), conc: new Part() })

/** Everything but the towers, into one level of detail's parts. */
function build(set: Set, isLow: boolean) {
  const { steel, web, under, conc } = set
  for (const k of [-1, 1]) {
    const top = walkTop(k * WALK[0])
    for (const [s0, s1] of WALK_RUNS)
      deckBand(conc, k * WALK[0], k * WALK[1], stations(s0, s1, isLow ? 100 : 20), top, (s) => top(s) - 0.5, { top: true, in: !isLow, out: !isLow, ends: !isLow })
    for (const t of [-TY, TY]) {
      const round = isLow ? ROUND_TOWER.filter((_, i) => i % 2 === 0 || i === ROUND_TOWER.length - 1) : ROUND_TOWER
      const line = round.map(([dy, x]) => [k * x, t + dy, top(t + dy)] as V3)
      ribbon(conc, line, WALK[1] - WALK[0], 0.5)
    }
  }
  for (const deck of DECKS) {
    const curve = stations(deck.from, deck.to, isLow ? (deck.suspended ? 50 : 40) : (deck.suspended ? 50 : 6))
    const ps = stations(deck.from, deck.to, PANEL)
    for (const k of [-1, 1]) {
      const o = k * CABLE_X
      const top = (s: number) => road(s, o) - 0.4, bot = (s: number) => road(s, o) - deck.down
      if (isLow || deck.down === GIRDER_DOWN)
        deckBand(isLow ? steel : web, o - k * TRUSS_W / 2, o + k * TRUSS_W / 2, curve, top, bot, { out: true, top: true, bottom: true, ends: true, in: !isLow })
      else
        deckTruss(steel, web, o, ps, top, bot, { curve })
      if (!isLow) {
        // Railing along the sidewalk's outer edge: a top rail on posts.
        const r = k * RAIL_X
        deckBand(steel, r - 0.08, r + 0.08, curve, (s) => road(s, r) + 1.3, (s) => road(s, r) + 1.1, { out: true, in: true, top: true, bottom: true })
        for (const s of stations(deck.from, deck.to, deck.suspended ? 3.81 : 7.62)) rod(steel, at(s, r, road(s, r) - 0.4), at(s, r, road(s, r) + 1.15), 0.07, 3)
      }
    }
    // The deck's underside, facing down, between the trusses.
    deckBand(under, -CABLE_X + TRUSS_W / 2, CABLE_X - TRUSS_W / 2, curve, (s) => road(s) - 0.4, (s) => road(s) - 1.0, { bottom: true })
    if (isLow) continue
    // Floor beams and the bottom lateral bracing, every 50 ft.
    for (let i = 0; i < ps.length; i += 2) {
      const s = ps[i]
      deckBand(under, -CABLE_X, CABLE_X, [s - 0.25, s + 0.25], () => road(s) - 1.0, () => road(s) - 2.6, { bottom: true, ends: true })
      if (i + 2 < ps.length && deck.down !== GIRDER_DOWN) {
        const s2 = ps[i + 2], low = (t: number, o: number) => road(t, o) - deck.down + 0.5
        strip(web, at(s, -CABLE_X, low(s, -CABLE_X)), at(s2, CABLE_X, low(s2, CABLE_X)), 0.5, [0, 0, 1])
        strip(web, at(s, CABLE_X, low(s, CABLE_X)), at(s2, -CABLE_X, low(s2, -CABLE_X)), 0.5, [0, 0, 1])
      }
    }
    // Suspenders, one per 50 ft (each is a pair of ropes).
    if (deck.suspended)
      for (let i = 0; i < ps.length; i += 2) {
        const y = ps[i]
        if (Math.abs(Math.abs(y) - TY) < FACE + 4 || Math.abs(y) > HOUSING[0] - 4) continue
        for (const k of [-1, 1]) {
          const z0 = road(y, k * CABLE_X) - 0.4, z1 = cable(y) - CABLE_R * 0.6
          if (z1 - z0 > 1) rod(steel, [k * CABLE_X, y, z0], [k * CABLE_X, y, z1], 0.22, 4)
        }
      }
  }

  // Main cables: from the south anchorage's roof, up through S2 and the arch
  // to S1, over the saddles, and into N1's housing over the north anchorage.
  for (const k of [-1, 1]) {
    const x = k * CABLE_X
    const path: V3[] = [
      [x, CABLE_ANCHOR[0], CABLE_ANCHOR[1]], [x, -HOUSING[1], CABLE_OUT], [x, -HOUSING[0], CABLE_IN],
      ...DECKS.filter((d) => d.suspended).flatMap(({ from, to }) =>
        stations(from, to, isLow ? 60 : 10).map((y) => [x, y, cable(y)] as V3)),
      [x, HOUSING[0], CABLE_IN], [x, HOUSING[1], CABLE_IN],
    ]
    tube(steel, path, CABLE_R, isLow ? 5 : 10)
  }

  // The four pylons: S1 and N1 where the cables turn down, S2 and N2 at the
  // anchorages' river ends.
  pylon(conc, -HOUSING[0], -HOUSING[1], 11.2, 17.4, 75.95 + DATUM, isLow)
  pylon(conc, HOUSING[0], HOUSING[1], 11.2, 17.4, 74.24 + DATUM, isLow)
  pylon(conc, -1097.7, -1087.5, 10.7, 16.8, 72.7 + DATUM, isLow)
  pylon(conc, 1077.5, 1086.5, 18.6, 23.9, 74.85 + DATUM, isLow)

  arch(steel, web, isLow)

  // The anchorages: the south one's roof under the approach towers, the
  // north one a solid block just under the roadway from N1 to N2.
  for (const plan of SOUTH_ANCHORAGE) block(conc, plan, SOUTH_ROOF, isLow ? 16 : 4)
  for (const [y0, y1, half] of NORTH_ANCHORAGE) {
    const top = Math.min(...stations(y0, y1, 2).flatMap((y) => [road(y, -LANES), road(y, LANES)])) - 0.4
    block(conc, [[-half, y0], [half, y0], [half, y1], [-half, y1]], top, isLow ? 16 : 4)
  }

  // The approach viaducts' trestle towers and bents.
  const truss = (s: number, o: number) => road(s, o) - APPROACH_DOWN
  for (const [s0, s1] of SOUTH_TOWERS) trestle(steel, conc, s0, s1, SOUTH_HALF, truss, onSouthRoof, isLow)
  for (const [s0, s1] of NORTH_TOWERS) trestle(steel, conc, s0, s1, NORTH_HALF, truss, ground, isLow)
  for (const s of SOUTH_BENTS) {
    for (const k of [-1, 1]) {
      const [x, y] = at(s, k * SOUTH_HALF, 0)
      const pad: [number, number][] = [[x - 1.2, y - 1.2], [x + 1.2, y - 1.2], [x + 1.2, y + 1.2], [x - 1.2, y + 1.2]]
      const base = Math.max(...pad.map(([a, b]) => ground(a, b))) + 1.0
      column(steel, [x, y], isLow ? 1.1 : 0.9, truss(s, k * SOUTH_HALF), isLow ? ground : () => base)
      if (!isLow) block(conc, pad, base, 10)
    }
  }
  // Concrete walls under the ends of the trusses and girders.
  for (const [s, down] of END_WALLS)
    block(conc, deckRect(s - 1, s + 1, -CABLE_X - 1, CABLE_X + 1), Math.min(road(s, -CABLE_X), road(s, CABLE_X)) - down, isLow ? 8 : 4)
}

if (import.meta.main) {
  const lit = new Part(), shade = new Part(), pier = new Part()
  const litFar = new Part(), shadeFar = new Part(), pierFar = new Part()
  tower(lit, shade, pier)
  tower(litFar, shadeFar, pierFar, true)
  const towers = (p: Part) => merged(lifted(movedAlong(p, -TY), TOWER_LIFT, STRAIT[0] + DATUM), lifted(movedAlong(p, TY), TOWER_LIFT, STRAIT[1] + DATUM))

  const low = newSet(), detail = newSet()
  build(low, true)
  build(detail, false)

  // The towers' floodlights stand on the piers and the deck: the wash is
  // strongest just above the roadway and fades a little toward the saddles,
  // the legs under the deck somewhat dimmer; faces looking up catch little.
  // Only steel within a tower's footprint is lit.
  const towerLit = (p: V3, n: V3): number => {
    if (Math.abs(Math.abs(p[1]) - TY) > 11) return 0
    const deck = road(TY)
    const height = p[2] >= deck ? 1 - 0.3 * Math.min(1, (p[2] - deck) / (SADDLE - deck)) : 0.6
    return height * (n[2] > 0.7 ? 0.3 : 1)
  }
  const ORANGE = { ...finish('international-orange', 0xc8553f), floodlight: towerLit, doubleSided: true }
  const ORANGE_SHADE = { ...finish('international-orange-shade', 0xa9452f), floodlight: towerLit }
  const CONCRETE: Swatch = finish('concrete', 0xd9d3c7)
  const lowParts = [
    { part: merged(towers(litFar), low.steel, low.web), material: ORANGE },
    { part: merged(towers(shadeFar), low.under), material: ORANGE_SHADE },
    { part: merged(towers(pierFar), low.conc), material: CONCRETE },
  ]
  const detailParts = [
    { part: merged(towers(lit), detail.steel, detail.web), material: ORANGE },
    { part: merged(towers(shade), detail.under), material: ORANGE_SHADE },
    { part: merged(towers(pier), detail.conc), material: CONCRETE },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water; z = NAVD88 + 1.1',
    bearing: 354.69, elevation: 0, towers: [-TY, TY], ends: [DECKS[0].from, DECKS[DECKS.length - 1].to],
    roadwayNavd88: { crest: road(0) - DATUM, towers: road(TY) - DATUM, pylonS1: road(-HOUSING[0]) - DATUM,
      pylonN1: road(HOUSING[0]) - DATUM, southEnd: road(DECKS[0].from) - DATUM, northEnd: road(DECKS[DECKS.length - 1].to) - DATUM },
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['sf-golden-gate-bridge.glb', lowParts, 6500, 250 * 1024],
    ['sf-golden-gate-bridge.detail.glb', detailParts, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Golden Gate Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
