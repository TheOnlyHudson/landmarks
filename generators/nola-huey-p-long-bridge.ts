/**
 * Huey P. Long Bridge (1935, Modjeski & Masters; widened 2008-2013), the
 * New Orleans Public Belt Railroad and US 90 over the Mississippi between
 * Elmwood and Bridge City, Jefferson Parish — procedural, CC0-1.0.
 * bun generators/nola-huey-p-long-bridge.ts
 *
 * The river crossing only, bearing to bearing (y -376..+351, 727 m): the
 * 1935 simple truss span by the East Bank (162 m) and the cantilever (two
 * 162 m anchor arms, the 240 m main span with its 132 m suspended span), on
 * five piers. Four truss planes: the 1935 trusses at x = ±5 either side of
 * the two tracks, the 2013 outer trusses at x = ±20.5; the US 90 roadways
 * run between them and are the map's. The rail deck is the model's: ballast
 * between the inner trusses and the two tracks as broad tie bands (rails in
 * the detail). Low model: chords as solid bands, web as flat plates
 * (double-sided steel), a strut across all four top chords at every panel
 * point. Detail (detailZoom 16): four-sided members, top X bracing, sway
 * frames over the roadways, floor beams, rails.
 *
 * Frame: x across (+x toward bearing 225.5, the south-west side), y along
 * toward the West Bank (bearing 135.47, PCA of the lidar returns over 40 m),
 * z up; metres. Anchor -90.1682056, 29.9435025 (on the river, in the main
 * span). z = 0 is the river as the map's terrain draws it (Mapterhorn water
 * 1.06 m NAVD88); every lidar height here is NAVD88 - 1.06. elevation 0.
 *
 * Roadway heights the model is built to (lidar, low decile of the returns
 * between the inner and outer trusses; model z, add 1.06 for NAVD88): 42.6
 * (y -370, East Bank bearing), 43.5 (-300), 44.8 (-200), 46.1 (-100), 47.1
 * (-30), 47.5 (50-100, crest), 47.2 (140), 46.8 (190), 45.9 (250), 45.3
 * (300), 44.5 (350, West Bank bearing). Both carriageways read the same
 * within 0.1 m. The rail deck reads 0.9 m lower. tools/bridge_ele.py on
 * way/187810589 gives clean readings only off the truss (spread 23-42 m on
 * the truss nodes: the top bracing), and no node carries `ele`, so the map
 * guesses the decks; tagging the two bearing ends and the crest with these
 * values would make its roadways meet the bottom chords. Not done here.
 *
 * Sources:
 * - OSM: outline way/1173539225 (man_made=bridge) runs 2.4 km, over the
 *   East Bank approach viaduct and the West Bank ramps, which this model
 *   doesn't draw, so `replaces` leaves it out (docs/reference.md, Bridges)
 *   and lists the four river piers mapped as bridge:support:
 *   way/1173539226 (pier A, mapped 13 m off the lidar position),
 *   1173539228 (C, 11 m off), 1173539229 (D), 1173539230 (E). Pier F (West
 *   Bank) is not mapped; way/1173539227 is an approach pier, not drawn.
 *   Rail ways 12661925/107495937, road ways 187810589/187810590.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid, 400 m half-size. Measured: the bearing; the four truss planes
 *   (±5.0, ±20.5); the top chord at every panel point (S1_TOP, MAIN_TOP:
 *   Parker hump 67.4 m at the East Bank span's middle, peaks 79.5 / 79.6 m
 *   over piers D and E, hinges 68.6 m, suspended span 74.4 m); the truss
 *   ends and pier positions from where the chords meet the deck (A -375,
 *   C -213, D -50, E 190.5, F 352: spans 162, 163, 240.5, 161.5 m); the
 *   roadway and rail deck (above).
 * - Published (Wikipedia, "Huey P. Long Bridge (Jefferson Parish)"): main
 *   span 790 ft (240.8 m; lidar 240.5), three spans of 530 ft (161.5 m;
 *   lidar 162-163), river crossing ~2,400 ft; clearance 152.9 ft (46.6 m;
 *   the floor's underside here is 45-46 m over the channel); two tracks
 *   between the trusses, three 11 ft lanes each side since 2013.
 * - HAER LA-17 sheets 206-207, "Pier and Truss Widening" (public domain):
 *   the cross section (outer trusses beside the old ones, X bracing between
 *   them, 18'6" clearance), the pier with its pointed-arch panel, the 2013
 *   steel struts out to the wide cap under the outer trusses.
 *   https://commons.wikimedia.org/wiki/File:Pear_and_Truss_Widening_of_Huey_P._Long_Bridge_(Jefferson_Parish).png
 * - Terrain: Mapterhorn under the site: water (0) under piers A-E, 1.3-2 m
 *   on the West Bank batture under F (ground 1.6 used).
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Panorama of the Huey P. Long Bridge, Jefferson Parish,
 *     Louisiana-2013.jpg", ---=XEON=---, CC BY 3.0 (broadside from the
 *     north-east: the whole profile, span order).
 *     https://commons.wikimedia.org/wiki/File:Panorama_of_the_Huey_P._Long_Bridge,_Jefferson_Parish,_Louisiana-2013.jpg
 *   - "Voyage under the Huey P. Long Bridge ... - cut.jpg", ---=XEON=---,
 *     CC BY 3.0 (from the river, north-east: web pattern, panel count
 *     (~11.6 m panels, diagonals crossing two panels), pale paint).
 *     https://commons.wikimedia.org/wiki/File:Voyage_under_the_Huey_P._Long_Bridge,_Jefferson_Parish,_Louisiana_-_cut.jpg
 *   - "Huey P. Long Bridge, Jefferson Parish, LA - City Of Bridges.jpg",
 *     ---=XEON=---, CC BY 3.0 (under the deck: the pier block, its arch
 *     panel, cornice, shaft, the 2013 struts and cap painted like the
 *     trusses, the floor's dark underside).
 *     https://commons.wikimedia.org/wiki/File:Huey_P._Long_Bridge,_Jefferson_Parish,_LA_-_City_Of_Bridges.jpg
 *   - "Huey P. Long Bridge, Jefferson Parish, LA, US90, Mississippi
 *     River.jpg", formulanone, CC BY-SA 2.0 (aerial from the east).
 *     https://commons.wikimedia.org/wiki/File:Huey_P._Long_Bridge,_Jefferson_Parish,_LA,_US90,_Mississippi_River.jpg
 *   - "USS New Orleans under Huey P. Long Bridge ...jpg", US Navy, public
 *     domain (2007, before the widening: the piers and the 1935 trusses).
 *     https://commons.wikimedia.org/wiki/File:USS_New_Orleans_under_Huey_P._Long_Bridge,_Jefferson_Parish,_Louisiana.jpg
 *   - "Modes of Transport - Huey P Long Bridge Levee ... Feb 2021.jpg",
 *     David Brossard, CC BY-SA 2.0 (the truss end and the approach).
 *     https://commons.wikimedia.org/wiki/File:Modes_of_Transport_-_Huey_P_Long_Bridge_Levee,_Jefferson_Parish,_Louisiana,_Feb_2021.jpg
 * - Look-only: none.
 *
 * Estimated: chord sections (low: top 1.9 x 3.0 m, bottom chord 3.7 m deep
 * from 2.6 under to 1.1 over the roadway, heavier than the real ones so they
 * survive at phone size; detail 1.2 x 1.7 m and 2.9 m), web plates 1.0-1.15
 * m (low), posts 2.2 x 2.6 m over piers D and E; panel lengths (11.57 m in
 * the simple span, 11.57 in the anchor arms, 13.5 in the cantilever arms,
 * 12.0 in the suspended span) from the photo's panel count and the lidar
 * spans; the diagonal pattern (two panels per diagonal, restarted at the
 * peaks and hinges) simplified from the photos. Pier: footing 29 x 18 m to
 * 4 m, block 27 x 16 m to 23 m, cornice, shaft 17 x 11 m, steel cap 44 x 6
 * m 2.6-6.4 m under the roadway, from the HAER section and the XEON photo;
 * the end piers A and F drawn like the river piers.
 * Colour: the paint reads pale silver-grey in every photo; drawn #97a1ab, a
 * step darker and bluer than the photos so it reads on a pale map (review
 * of the Crescent City Connection). Pale concrete piers, the arch panels a
 * shade darker; ballast grey, ties dark brown.
 *
 * Night: no open night photo of this bridge (Commons has only the Baton
 * Rouge Huey P. Long Bridge at night), so no lamps or floodlight: plain.
 *
 * Doubts:
 * - replaces: the outline is left out because the model covers only 727 m
 *   of its 2.4 km; the map will draw its own piers and parapets along the
 *   outline, including across the river crossing, where they may show
 *   inside or under the trusses. A separate outline for the river crossing
 *   (or splitting way/1173539225 in OSM) would let it be listed.
 * - The real web is denser (more secondary members, perforated plates);
 *   the bracing between old and new trusses has three levels, only the top
 *   one and a sway strut are drawn. The fender bands on the footings are
 *   left out.
 * - The end piers A (East Bank batture) and F (West Bank) are not seen
 *   closely in any photo; drawn like the river piers.
 * - The roadway has no `ele` in OSM (above).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { band, footedLoft, piecewise, stations, strip } from './bridge-kit'
import { finish, type Swatch } from './palette'

// ---- Frame -------------------------------------------------------------------
// x across (+x toward bearing 225.5, the upstream/south-west side), y along the
// bridge toward the West Bank (bearing 135.47), z up; metres. Origin on the
// river near the middle of the main span. z = 0 is the river as the map's
// terrain draws it (Mapterhorn water, 1.06 m NAVD88): lidar heights here are
// NAVD88 - 1.06.

/** Truss planes: the 1935 trusses either side of the tracks, the 2013 outer trusses. */
const INNER = 5.0, OUTER = 20.5
const TRUSSES = [-OUTER, -INNER, INNER, OUTER]

/** Pier centres along y (lidar: where the top chords meet the deck and the peaks). */
const PIER = { A: -375, C: -213, D: -50, E: 190.5, F: 352 }

/** Top of the top chord at each panel point, lidar (median of the four trusses). */
const S1_TOP: [number, number][] = [[-363.43, 57.8], [-351.86, 60.8], [-340.29, 63.7], [-328.71, 66.0], [-317.14, 67.4],
  [-305.57, 68.2], [-294.0, 68.4], [-282.43, 68.3], [-270.86, 67.4], [-259.29, 66.3], [-247.71, 63.6], [-236.14, 60.9],
  [-224.57, 58.5]]
const MAIN_TOP: [number, number][] = [
  // anchor arm C-D
  [-205.5, 58.7], [-200.43, 59.8], [-188.86, 62.9], [-177.29, 65.7], [-165.71, 67.8], [-154.14, 68.8], [-142.57, 69.6],
  [-131.0, 70.5], [-119.43, 71.4], [-107.86, 72.3], [-96.29, 73.3], [-84.71, 74.1], [-73.14, 75.3], [-61.57, 77.8],
  [-50.0, 79.5],
  // cantilever arm D-hinge
  [-36.48, 74.6], [-22.95, 71.0], [-9.42, 68.8], [4.1, 68.6],
  // suspended span
  [16.13, 69.6], [28.15, 71.9], [40.18, 73.2], [52.21, 74.1], [64.24, 74.4], [76.26, 74.4], [88.29, 73.7],
  [100.32, 72.9], [112.35, 70.9], [124.37, 68.7], [136.4, 68.6],
  // cantilever arm hinge-E
  [149.93, 69.5], [163.45, 72.3], [176.98, 76.3], [190.5, 79.6],
  // anchor arm E-F
  [202.04, 77.1], [213.57, 74.7], [225.11, 73.8], [236.64, 72.9], [248.18, 72.0], [259.71, 71.1], [271.25, 70.2],
  [282.79, 69.3], [294.32, 68.4], [305.86, 67.4], [317.39, 64.5], [328.93, 61.6], [340.46, 58.8],
]
/** Where the diagonal pattern restarts: the piers' peaks and the hinges. */
const KEYS = [-50.0, 4.1, 136.4, 190.5]

/** Roadway (lidar, low decile between the trusses, NAVD88 - 1.06); the rail deck reads 0.9 m lower. */
const ROAD = piecewise([[-400, 43.0], [-370, 43.6], [-300, 44.5], [-200, 45.8], [-100, 47.1], [-30, 48.1], [0, 48.2],
  [50, 48.5], [100, 48.5], [140, 48.2], [190, 47.8], [250, 46.9], [300, 46.3], [350, 45.5], [380, 45.0]])
const RAIL = (y: number) => ROAD(y) - 0.9

/** The map's ground under the end piers (Mapterhorn, metres above the river). */
const ground = (_x: number, y: number) => (y > 300 ? 1.6 : 0)

type Lod = 'low' | 'detail'

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

/** A straight member a→b, w across (along `side`) by t, four faces (plus ends if asked). */
function member(p: Part, a: V3, b: V3, w: number, t: number, side: V3 = [1, 0, 0], ends = false) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, dot(side, d))))
  const T = cross(d, S)
  const c = (o: V3, u: number, v: number): V3 => add(o, add(mul(S, (u * w) / 2), mul(T, (v * t) / 2)))
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let i = 0; i < 4; i++) {
    const [u0, v0] = corners[i], [u1, v1] = corners[(i + 1) % 4]
    quad(p, c(a, u0, v0), c(a, u1, v1), c(b, u1, v1), c(b, u0, v0), norm(add(mul(S, u0 + u1), mul(T, v0 + v1))))
  }
  if (ends) {
    quad(p, c(a, -1, -1), c(a, 1, -1), c(a, 1, 1), c(a, -1, 1), mul(d, -1))
    quad(p, c(b, -1, -1), c(b, 1, -1), c(b, 1, 1), c(b, -1, 1), d)
  }
}

/** An upright box; the bottom only if asked. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  band(p, x0, x1, [y0, y1], () => z1, () => z0, { out: true, in: true, top: true, bottom, ends: true })
}

// ---- Trusses -----------------------------------------------------------------------

type Segment = { top: [number, number][]; ends: [number, number] }
const SEGMENTS: Segment[] = [
  { top: S1_TOP, ends: [PIER.A - 1, PIER.C - 1.2] }, // the 1935 simple span by the East Bank
  { top: MAIN_TOP, ends: [PIER.C + 0.8, PIER.F - 1] }, // the cantilever: two anchor arms, the main span
]

function truss(steel: Part, xc: number, seg: Segment, lod: Lod) {
  const low = lod === 'low'
  const top = piecewise(seg.top)
  const TD = low ? 3.0 : 1.7 // top chord depth
  const W = low ? 1.9 : 1.2 // chord width across
  const botTop = (y: number) => ROAD(y) + (low ? 1.1 : 0.9)
  const botBot = (y: number) => ROAD(y) - (low ? 2.6 : 2.0)
  // Keep every chord clear of the roadways: the outer ones' inner face at
  // |x| = OUTER - W/2, the inner ones' outer face at INNER + W/2.
  const x0 = xc - W / 2, x1 = xc + W / 2
  const ys = seg.top.map(([y]) => y)

  band(steel, x0, x1, ys, top, (y) => top(y) - TD)
  band(steel, x0, x1, stations(seg.ends[0], seg.ends[1], 40), botTop, botBot)

  // Inclined end posts from the first and last panel points to the bearings.
  const ep = (yt: number, yb: number) => member(steel, [xc, yt, top(yt) - TD / 2], [xc, yb, botTop(yb) - 0.4], W, low ? 1.6 : 1.2)
  ep(ys[0], seg.ends[0])
  ep(ys[ys.length - 1], seg.ends[1])

  const web = (a: V3, b: V3, w: number) => low ? strip(steel, a, b, w, [1, 0, 0]) : member(steel, a, b, w * 0.75, 0.7)
  const lo = (y: number): V3 => [xc, y, botTop(y) - 0.2]
  const hi = (y: number): V3 => [xc, y, top(y) - TD + 0.2]
  // Posts at every panel point; the heavy ones over the piers.
  for (const y of ys) {
    if (KEYS.includes(y) && (y === PIER.D || y === PIER.E)) member(steel, [xc, y, botBot(y)], [xc, y, top(y) - 0.4], 2.2, 2.6)
    else web(lo(y), hi(y), low ? 1.0 : 0.8)
  }
  // Diagonals: two panels long, zig-zagging, restarted at each pier and hinge,
  // so every peak gets a V from it (photos: the big diagonals each cross two
  // panels, with a post at every panel point between).
  const breaks = [0, ...ys.map((y, i) => (KEYS.includes(y) ? i : -1)).filter((i) => i > 0 && i < ys.length - 1), ys.length - 1]
  for (let b = 0; b < breaks.length - 1; b++) {
    const i0 = breaks[b], i1 = breaks[b + 1]
    const fromStart = KEYS.includes(ys[i0]) // a peak at the start: diagonals leave its top
    const fromEnd = KEYS.includes(ys[i1])
    const n = i1 - i0
    const pairs: [number, number][] = []
    for (let k = 0; k + 2 <= n; k += 2) pairs.push([i0 + k, i0 + k + 2])
    if (n % 2) pairs.push([i1 - 1, i1])
    pairs.forEach(([a, c], j) => {
      // Alternate which end of the diagonal is at the top; peaks (piers) always top.
      let topAtA = j % 2 === 0
      if (fromEnd && !fromStart) topAtA = (pairs.length - 1 - j) % 2 === 1
      const [ya, yc] = [ys[a], ys[c]]
      web(topAtA ? hi(ya) : lo(ya), topAtA ? lo(yc) : hi(yc), low ? 1.15 : 0.9)
    })
  }
}

/** Struts across all four top chords at the panel points (low: every one; detail adds X bracing). */
function topBracing(steel: Part, seg: Segment, lod: Lod) {
  const top = piecewise(seg.top)
  const ys = seg.top.map(([y]) => y)
  for (let i = 0; i < ys.length; i++) {
    const y = ys[i], z = top(y) - 0.7
    member(steel, [-OUTER, y, z], [OUTER, y, z], lod === 'low' ? 0.9 : 0.6, lod === 'low' ? 1.0 : 0.7, [0, 1, 0])
    if (lod === 'detail' && i < ys.length - 1) {
      const y2 = ys[i + 1], z2 = top(y2) - 0.7
      for (const [xa, xb] of [[-OUTER, -INNER], [-INNER, INNER], [INNER, OUTER]]) {
        member(steel, [xa, y, z], [xb, y2, z2], 0.4, 0.4, [0, 0, 1])
        member(steel, [xb, y, z], [xa, y2, z2], 0.4, 0.4, [0, 0, 1])
      }
    }
  }
  if (lod === 'detail') {
    // Sway frames over the road decks at every second panel point: a strut
    // 18.5 ft (5.6 m) over the road (HAER widening drawing) and an X above it.
    for (let i = 0; i < ys.length; i += 2) {
      const y = ys[i], zt = top(y) - 1.2, zl = ROAD(y) + 6.2
      if (zt - zl < 4) continue
      for (const [xa, xb] of [[-OUTER, -INNER], [INNER, OUTER]]) {
        member(steel, [xa, y, zl], [xb, y, zl], 0.5, 0.6, [0, 1, 0])
        member(steel, [xa, y, zt], [xb, y, zl], 0.4, 0.4, [0, 1, 0])
        member(steel, [xb, y, zt], [xa, y, zl], 0.4, 0.4, [0, 1, 0])
      }
    }
  }
}

// ---- Deck ------------------------------------------------------------------------------

/** The rail deck between the inner trusses: ballast, two tracks; the underside of the whole floor. */
function deck(ballast: Part, track: Part, shade: Part, steel: Part, lod: Lod) {
  const [y0, y1] = [PIER.A - 1, PIER.F - 1]
  const ys = stations(y0, y1, 40)
  const xi = INNER - (lod === 'low' ? 0.95 : 0.6)
  band(ballast, -xi, xi, ys, RAIL, (y) => RAIL(y) - 0.4, { top: true })
  for (const xc of [-2.0, 2.0]) {
    // Ties as one broad band 2.6 m wide, and in the detail the two rails on it.
    band(track, xc - 1.3, xc + 1.3, ys, (y) => RAIL(y) + 0.15, RAIL, { top: true, out: true, in: true })
    if (lod === 'detail')
      for (const xr of [xc - 0.72, xc + 0.72]) band(steel, xr - 0.08, xr + 0.08, ys, (y) => RAIL(y) + 0.32, (y) => RAIL(y) + 0.15, { top: true, out: true, in: true })
  }
  // Underside of the floor system, from outer truss to outer truss, facing down.
  band(shade, -OUTER + 0.6, OUTER - 0.6, ys, (y) => ROAD(y) - 1.0, (y) => ROAD(y) - 2.4, { bottom: true })
  if (lod === 'detail')
    for (const y of stations(y0 + 2, y1 - 2, 6))
      band(shade, -OUTER + 0.6, OUTER - 0.6, [y - 0.3, y + 0.3], () => ROAD(y) - 1.0, () => ROAD(y) - 3.0, { bottom: true, ends: true })
}

// ---- Piers -----------------------------------------------------------------------------

/**
 * A river pier, as "City Of Bridges" (XEON, 2013) shows it from under the
 * deck, with the HAER widening drawing: a fendered footing at the water, a
 * broad concrete block with a shallow pointed-arch panel on each end face, a
 * cornice, a narrower shaft up to the 1935 trusses, and the 2013 steel struts
 * (painted like the trusses) out to a cap beam under the outer trusses.
 */
function pier(conc: Part, steel: Part, recess: Part, y: number, lod: Lod) {
  const g = ground(0, y)
  const rect = (x0: number, x1: number, ya: number, yb: number): [number, number][] => [[x0, ya], [x1, ya], [x1, yb], [x0, yb]]
  const foot = rect(-14.5, 14.5, y - 9, y + 9)
  footedLoft(conc, ground, [{ plan: foot, z: 'ground' }, { plan: foot, z: g + 4 }])
  const z0 = g + 4, zb = g + 23 // the block
  box(conc, -13.5, 13.5, y - 8, y + 8, z0, zb)
  // The pointed-arch panel on both end faces (flush, a darker concrete so the
  // recess reads): 8 m wide, springing 7 m up, equilateral.
  const span = 8, spring = z0 + 7
  const arch = (x: number) => spring + Math.sqrt(Math.max(0, span * span - (Math.abs(x) + span / 2) ** 2))
  const xs = stations(-span / 2, span / 2, lod === 'low' ? 2 : 1)
  for (const [yy, s] of [[y - 8.04, -1], [y + 8.04, 1]] as [number, number][])
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i], xb = xs[i + 1]
      quad(recess, [xa, yy, z0 + 0.6], [xb, yy, z0 + 0.6], [xb, yy, arch(xb)], [xa, yy, arch(xa)], [0, s, 0])
    }
  box(conc, -14.2, 14.2, y - 8.7, y + 8.7, zb, zb + 1.5, true) // cornice
  const capBot = ROAD(y) - 6.4, capTop = ROAD(y) - 2.6
  box(conc, -8.5, 8.5, y - 5.5, y + 5.5, zb + 1.5, capBot)
  // 2013 struts: from the shaft's foot out to the cap's ends.
  for (const s of [-1, 1]) member(steel, [s * 8.0, y, zb + 2.4], [s * (OUTER - 0.5), y, capBot + 0.3], 1.8, 2.4, [0, 1, 0], true)
  box(steel, -OUTER - 1.6, OUTER + 1.6, y - 3, y + 3, capBot, capTop, true)
}

// ---- Build -----------------------------------------------------------------------------

function build(lod: Lod) {
  const steel = new Part(), shade = new Part(), conc = new Part(), recess = new Part(), ballast = new Part(), track = new Part()
  for (const seg of SEGMENTS) {
    for (const xc of TRUSSES) truss(steel, xc, seg, lod)
    topBracing(steel, seg, lod)
  }
  deck(ballast, track, shade, steel, lod)
  for (const y of Object.values(PIER)) pier(conc, steel, recess, y, lod)
  return { steel, shade, conc, recess, ballast, track }
}

if (import.meta.main) {
  // Paint: the trusses read pale silver-grey in every daylight photo; pulled a
  // step darker and bluer (#97a1ab) so they read against a pale map, as the
  // Crescent City Connection review asked.
  const STEEL = { ...finish('hpl-steel', 0x97a1ab), doubleSided: true }
  const SHADE: Swatch = finish('hpl-steel-shade', 0x6c7682)
  const CONCRETE: Swatch = finish('concrete', 0xd6d1c6)
  const RECESS: Swatch = finish('concrete-recess', 0xa9a397)
  const BALLAST: Swatch = finish('hpl-ballast', 0x8d877d)
  const TRACK: Swatch = finish('hpl-track', 0x5f5650)

  const sets = [
    ['nola-huey-p-long-bridge.glb', build('low'), 6500, 250 * 1024],
    ['nola-huey-p-long-bridge.detail.glb', build('detail'), 40000, 1536 * 1024],
  ] as const
  for (const [file, m, maxTris, maxBytes] of sets) {
    const list = [
      { part: m.steel, material: STEEL },
      { part: m.shade, material: SHADE },
      { part: m.conc, material: CONCRETE },
      { part: m.recess, material: RECESS },
      { part: m.ballast, material: BALLAST },
      { part: m.track, material: TRACK },
    ]
    const tris = list.reduce((a, l) => a + l.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Huey P. Long Bridge', list, {
      license: 'CC0-1.0',
      frame: 'Y up, -Z along the bridge toward the West Bank (bearing 135.47), metres; origin on the river in the main span',
      bearing: 135.47, elevation: 0, piers: PIER,
    })
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
