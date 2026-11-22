/**
 * Brent Spence Bridge (I-71/I-75, 1963) — procedural, CC0-1.0, no textures.
 * bun generators/cin-brent-spence-bridge.ts
 *
 * The whole bridge inside its OSM outline, Cincinnati to Covington, as one
 * placement: the grey-green double-deck cantilever truss (anchor arms, the
 * cantilever humps over the two river piers, the parallel-chord middle),
 * its two concrete river piers and the two end piers. The trusses are drawn
 * open: chords as beams, posts and diagonals as flat bars.
 *
 * No road surfaces, on either deck. The upper (Kentucky-bound) roadway runs
 * through the truss at about two thirds of its height and the lower
 * (Ohio-bound) one near its bottom chord; the map draws both roadways. The
 * model draws only what is beside and under them: each deck's concrete
 * edge beam and parapet just inside the truss planes (the two pale lines
 * that read through the truss in every photo), the floor beams' underside
 * under the lower deck, and nothing between the decks, so the map's upper
 * roadway is the lower deck's ceiling.
 *
 * Frame: x across (+x to the downstream, west side), y along the bridge
 * toward Covington, z up, metres. Bearing 182.33°, the outline's long
 * edges. The anchor (-84.52258, 39.09065) is midway along the outline,
 * mid-river; the outline runs from y = −265 (Cincinnati) to +264.
 *
 * Height. z = 0 is the Ohio River, 138.94 m NAVD88 in the lidar (the map's
 * Mapterhorn reads the Ohio water there, and the Kentucky water 4.7 m
 * higher; the Kentucky river pier starts at 4.7). Roadway heights built to:
 * - upper deck (`UPPER`; lidar, tools/bridge_ele.py on the I-71/75
 *   south-bound ways from way/1303606102 on, OH_StatewideP3_6_B21, lower
 *   quartile, spread 0.02–0.09 m): 30.0 m at the Cincinnati end (y = −265),
 *   31.0 at −205, 32.3 at −133 (the Ohio pier), 33.2 at −53, a crest of
 *   33.4 m from y = −13 to +27, 33.25 at +47, the last reading (the Ohio
 *   survey stops there). Past it, estimated: mirrored about the crest, to
 *   30.0 m at the Covington end;
 * - lower deck (`LOWER`): estimated 7.1 m under the upper, the difference
 *   the lidar reads where the two decks emerge one over the other on the
 *   Cincinnati approach (166.2 against 173.3 m). Lidar can't see it on the
 *   bridge itself.
 * OSM has no `height` or `ele` on either deck.
 *
 * Sources:
 * - OSM: outline way/871768960 (man_made=bridge, bridge:levels=2,
 *   bridge:structure=truss, wikidata Q14628990), 16.8 m wide; I-71/75 ways
 *   way/159588794, 159588796, 159588797, 1303606102, 16247690.
 * - Lidar, USGS 3DEP OH_StatewideP3_6_B21 (flown 2021), 1 m grid over
 *   y = −270…+90: the truss's top chord 12.7 m over the upper deck (46.1 m
 *   above the river) from y = −70 to +74; rising to 58.6 m over the Ohio
 *   pier at y ≈ −127; 52 at −106, 49.2 at −94, 47 at −82 on the main-span
 *   side; 54.6 at −136, 50.5 at −148, 48 at −160, 45.5 at −172, 43–44 from
 *   −232 to −184 and 38 at −256 on the anchor arm, down to the deck at the
 *   end; the deck from x ≈ −7 to +11.
 * - Published (Wikipedia "Brent Spence Bridge"): total length 1,736 ft
 *   (529 m; the outline is 529 m), main span 830.5 ft (253.1 m): river piers
 *   at y = ±126.5, symmetric about the crest; double-deck cantilever truss,
 *   Kentucky-bound on top, Ohio-bound below; opened 1963.
 * - Photos (Wikimedia Commons):
 *   - "Brent Spence Bridge 2025a.jpg" (Antony-22, CC BY-SA 4.0): from the
 *     Kentucky bank under the bridge: the cantilever hump over the river
 *     pier, the parallel-chord middle, the two deck edges through the
 *     truss, the plain concrete piers;
 *   - "Brent Spence Bridge 2018.jpg" (Antony-22, CC BY-SA 4.0): from the
 *     Ohio bank: the Ohio pier, the hump's sloping top chords, Warren web
 *     with verticals, the grey-green paint;
 *   - "Brent Spence Bridge Covington Kentucky.JPG" (Dwight Burdette, CC BY
 *     3.0): from Covington, high: the whole profile, two humps, the end
 *     spans;
 *   - "Brent Spence Bridge P4280232.jpg" (Chris Light, CC BY-SA 4.0): side
 *     view: the hump's straight sloping chords and flat top over the pier.
 *
 * Estimated: the lower deck (above); the bottom chord 8.5 m under the
 *   upper deck (the photos put the upper deck about 60 % down the truss);
 *   the panel length (11.5 m; 22 on the main span, 12 on each anchor arm);
 *   member sizes; the truss planes at x = 1.0 ± 8.6; the Kentucky half
 *   (mirrored); the piers' plan (19 × 7 m river piers, 18 × 4 m end piers)
 *   and caps.
 * Doubts: the Kentucky half and the lower deck have no lidar.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, face, footedLoft, groundAt, piecewise, stations, strip, type GroundGrid } from './bridge-kit'

// ---- Evidence ----------------------------------------------------------------------------
const Y0 = -265, Y1 = 264.5        // the outline's ends
const PIER = 126.5                 // river piers at ±PIER
const XC = 1.0, TX = 8.6           // truss planes at XC ± TX

// Upper roadway (lidar to +47, then mirrored about the crest at y ≈ +7).
const UPPER_OH: [number, number][] = [[-285, 29.79], [-265, 29.95], [-245, 30.29], [-225, 30.70], [-205, 31.03], [-176, 31.54],
  [-153, 31.91], [-133, 32.28], [-93, 32.84], [-53, 33.21], [-33, 33.33], [-13, 33.40], [7, 33.41]]
const UPPER = piecewise([...UPPER_OH, ...UPPER_OH.slice(0, -1).reverse().map(([y, z]) => [14 - y, z] as [number, number])])
const upper = (y: number) => UPPER(y)
const lower = (y: number) => upper(y) - 7.1
const botChord = (y: number) => upper(y) - 8.5

// Top chord (m above the river) along y, lidar on the Ohio half, mirrored about y = 0 (the piers' midpoint).
const TOP_HALF: [number, number][] = [[-265, 31.5], [-256, 38], [-244, 42.5], [-232, 43.0], [-196, 44.0], [-184, 44.4], [-172, 45.5],
  [-160, 48], [-148, 50.5], [-136, 55], [-126.5, 58.6], [-118, 55], [-106, 52], [-94, 49.2], [-82, 47], [-70, 46.1], [0, 46.1]]
const TOP = piecewise([...TOP_HALF, ...TOP_HALF.slice(0, -1).reverse().map(([y, z]) => [-y, z] as [number, number])])

const GROUND: GroundGrid = {"y0":-288.0,"x0":-30.0,"step":6.0,"z":[[11.9,11.9,11.9,12.0,12.1,12.2,12.3,12.2,12.1,12.2,12.2],[11.9,11.9,11.9,11.9,12.1,12.2,12.3,12.2,12.1,12.2,12.2],[11.9,11.9,11.9,11.8,12.1,12.1,12.1,12.1,12.1,12.2,12.3],[11.9,11.9,11.9,11.8,12.1,12.1,12.2,12.1,12.1,12.1,12.4],[11.8,11.9,11.9,11.9,12.1,12.2,12.2,12.2,12.1,12.1,12.3],[11.8,11.9,11.8,11.9,12.0,12.1,12.1,12.2,12.1,12.1,12.2],[11.8,12.0,11.9,11.9,11.9,12.0,12.1,12.1,12.1,12.1,12.1],[11.6,11.7,11.7,11.6,11.8,11.9,11.9,12.0,12.4,12.0,12.0],[9.1,9.6,9.9,9.0,9.3,9.6,10.0,11.1,10.8,10.1,10.1],[4.7,5.1,5.3,4.7,5.2,5.4,5.6,6.8,6.2,5.4,5.3],[0.1,0.2,0.4,0.1,0.4,0.4,0.7,1.7,1.7,0.9,0.2],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[3.2,3.2,1.1,1.2,1.3,0.7,0.2,0.2,0.2,0.0,0.0],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[5.6,5.1,4.8,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7],[6.9,6.3,5.9,5.6,5.1,4.7,4.7,4.7,4.7,4.7,4.7],[8.1,7.6,7.1,6.7,6.3,6.0,6.0,6.1,6.3,6.7,6.7],[9.3,9.0,8.7,8.5,8.1,8.0,7.8,7.8,7.8,7.8,7.6],[9.9,9.7,9.6,9.4,9.3,9.2,8.9,8.7,8.5,8.4,8.1],[11.5,11.3,11.2,10.8,10.6,10.5,10.3,10.0,9.9,9.6,9.3],[13.6,13.3,13.2,12.9,12.5,12.5,12.2,11.7,11.5,11.4,11.1],[15.5,15.2,15.1,14.8,14.5,14.4,14.0,13.6,13.4,13.2,13.0],[17.0,16.9,16.7,16.6,16.3,16.2,15.9,15.7,15.4,15.2,14.9],[15.8,15.9,16.2,16.2,16.3,16.6,16.7,16.7,16.7,16.7,16.6],[13.4,13.6,13.7,13.8,14.0,14.4,14.6,14.8,14.8,15.1,15.2],[10.8,11.0,11.2,11.3,11.6,12.1,12.2,12.3,12.3,12.6,12.7],[9.8,9.7,9.8,10.0,10.1,10.4,10.3,10.2,10.2,10.3,10.5],[9.7,9.6,9.7,9.9,9.8,9.7,9.5,9.4,9.2,9.4,9.8],[10.1,9.8,9.7,9.7,9.6,9.5,9.4,9.3,9.2,9.8,9.6],[10.1,10.0,9.6,9.5,9.5,9.4,9.4,9.4,9.2,9.4,9.6],[10.1,10.0,9.6,9.6,9.5,9.5,9.4,9.4,9.3,9.2,9.1],[9.9,10.0,9.7,9.6,9.5,9.5,9.4,9.4,9.3,9.2,9.1],[9.9,9.9,9.8,9.7,9.6,9.5,9.4,9.4,9.4,9.2,9.1]]}
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- Parts ---------------------------------------------------------------------------------
const steel = new Part()     // truss: chords, web, bracing
const edges = new Part()     // the decks' concrete edge beams and parapets
const under = new Part()     // floor system under the lower deck
const concrete = new Part()  // piers

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A rectangular beam from a to b, w wide and d deep, its four long faces. */
function beam(p: Part, a: V3, b: V3, w: number, d: number, up: V3 = [0, 0, 1]) {
  const t = nrm(sub(b, a))
  let u = crs(t, up)
  if (Math.hypot(...u) < 1e-3) u = crs(t, [1, 0, 0])
  u = nrm(u)
  const v = nrm(crs(u, t))
  const U = scl(u, w / 2), V = scl(v, d / 2)
  const c = (q: V3, su: number, sv: number) => add(add(q, scl(U, su)), scl(V, sv))
  for (const [su, sv, n] of [[1, 0, u], [-1, 0, scl(u, -1)], [0, 1, v], [0, -1, scl(v, -1)]] as [number, number, V3][]) {
    const [s1, s2] = su ? [[su, -1], [su, 1]] : [[-1, sv], [1, sv]]
    face(p, c(a, s1[0], s1[1]), c(b, s1[0], s1[1]), c(b, s2[0], s2[1]), c(a, s2[0], s2[1]), n)
  }
}

// ---- Truss ------------------------------------------------------------------------------------
// Panel points: 12 on each anchor arm, 22 on the main span.
const PTS = [...stations(Y0, -PIER, (Y0 * -1 - PIER) / 12), ...stations(-PIER, PIER, (2 * PIER) / 22).slice(1), ...stations(PIER, Y1, (Y1 - PIER) / 12).slice(1)]
const N = PTS.length - 1
const topAt = (i: number) => (i === 0 || i === N ? botChord(PTS[i]) + 1.2 : TOP(PTS[i]))

for (const s of [-1, 1]) {
  const x = XC + s * TX
  const T = (i: number): V3 => [x, PTS[i], topAt(i)]
  const B = (i: number): V3 => [x, PTS[i], botChord(PTS[i])]
  for (let i = 0; i < N; i++) {
    beam(steel, B(i), B(i + 1), 0.9, 1.3)
    beam(steel, T(i), T(i + 1), 0.9, 1.1)
    // Warren diagonals, alternating; a post at every panel point.
    const [a, b] = i % 2 === 0 ? [B(i), T(i + 1)] : [T(i), B(i + 1)]
    strip(steel, a, b, 0.7, [1, 0, 0])
  }
  for (let i = 1; i < N; i++) strip(steel, B(i), T(i), i % 2 === 0 ? 0.75 : 0.5, [1, 0, 0])
  // End posts.
  for (const i of [0, N]) strip(steel, B(i), T(i), 0.8, [1, 0, 0])
}
// Top lateral struts and X bracing.
for (let i = 1; i < N; i++) {
  const y = PTS[i], z = topAt(i)
  beam(steel, [XC - TX, y, z], [XC + TX, y, z], 0.5, 0.6)
  if (i < N - 1) {
    const y2 = PTS[i + 1], z2 = topAt(i + 1)
    strip(steel, [XC - TX, y, z + 0.2], [XC + TX, y2, z2 + 0.2], 0.35, [0, 0, 1])
    strip(steel, [XC + TX, y, z + 0.2], [XC - TX, y2, z2 + 0.2], 0.35, [0, 0, 1])
  }
}
// Sway portals over the piers: a plate between the planes at the hump's top.
for (const yp of [-PIER, PIER]) beam(steel, [XC - TX, yp, TOP(yp) - 2.5], [XC + TX, yp, TOP(yp) - 2.5], 0.6, 3.5)

// ---- Decks: edge beams with parapets, the floor's underside -----------------------------------------
const ys = stations(Y0, Y1, 11.5)
for (const s of [-1, 1]) {
  const xo = XC + s * (TX - 0.55), xi = XC + s * (TX - 1.05)
  band(edges, Math.min(xo, xi), Math.max(xo, xi), ys, (y) => upper(y) + 0.9, (y) => upper(y) - 1.3, { out: true, in: true, top: true, bottom: true })
  band(edges, Math.min(xo, xi), Math.max(xo, xi), ys, (y) => lower(y) + 0.9, (y) => lower(y) - 1.1, { out: true, in: true, top: true, bottom: true })
}
band(under, XC - TX + 0.5, XC + TX - 0.5, ys, (y) => botChord(y) + 0.3, (y) => botChord(y) - 0.4, { bottom: true, ends: true })

// ---- Piers ------------------------------------------------------------------------------------
const rect = (x0: number, x1: number, y0: number, y1: number): [number, number][] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A plain concrete pier under both truss planes, its shaft stepping in under a cap. */
function pier(y: number, along: number, half: number) {
  const topZ = botChord(y) - 0.7
  footedLoft(concrete, ground, [
    { plan: rect(XC - half, XC + half, y - along / 2, y + along / 2), z: 'ground' },
    { plan: rect(XC - half + 0.6, XC + half - 0.6, y - along / 2 + 0.4, y + along / 2 - 0.4), z: topZ - 2.0 },
  ], 4, false)
  footedLoft(concrete, ground, [
    { plan: rect(XC - half - 0.2, XC + half + 0.2, y - along / 2, y + along / 2), z: topZ - 2.0 },
    { plan: rect(XC - half - 0.2, XC + half + 0.2, y - along / 2, y + along / 2), z: topZ },
  ], 4)
}
pier(-PIER, 7.5, 9.6)
pier(PIER, 7.5, 9.6)
pier(Y0 + 2.5, 4.5, 9.2)
pier(Y1 - 2.5, 4.5, 9.2)

// ---- Write --------------------------------------------------------------------------------------
const list = [
  { part: steel, material: { name: 'truss-green-grey', color: 0x9fada4, doubleSided: true } },
  { part: edges, material: { name: 'deck-edge-concrete', color: 0xd6cdb5 } },
  { part: under, material: { name: 'floor-underside', color: 0x8b958a } },
  { part: concrete, material: { name: 'concrete', color: 0xc8c2b6 } },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin mid-river on the bridge axis, on the water',
  bearing: 182.33, elevation: 0, piers: [-PIER, PIER],
  roadwayHeights: { upper: { cincinnatiEnd: upper(Y0), ohioPier: upper(-PIER), crest: upper(7), kentuckyPier: upper(PIER), covingtonEnd: upper(Y1) }, lower: 'upper - 7.1 (estimated)' },
}
if (import.meta.main) {
  const tris = list.reduce((n, { part }) => n + part.triangles, 0)
  if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
  const glb = writeGlb('Brent Spence Bridge', list, extras)
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  const out = new URL('../models/cin-brent-spence-bridge.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
