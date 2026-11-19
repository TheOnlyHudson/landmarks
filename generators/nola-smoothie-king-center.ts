/**
 * Smoothie King Center (former New Orleans Arena; 1999, Arthur Q. Davis /
 * Hellmuth, Obata + Kassabaum), New Orleans. Procedural, CC0-1.0, no
 * textures.
 * bun generators/nola-smoothie-king-center.ts [out.glb]
 *
 * What makes it read as itself: a big elongated octagon (a rectangle with
 * 45-degree corners) of light silver metal panels; a low white hipped roof
 * of eight facets round a flat top; the upper band of the wall standing
 * proud over a dark recessed strip that carries the LED ribbon round the
 * whole building; large glazed windows at the concourse level on the
 * corners and the north-east face, over glazed entrances; the red SMOOTHIE
 * KING sign on the north-east face; the concrete walkway deck to the
 * Superdome along that face.
 *
 * Frame: x along the long axis (compass 129.29, south-east), y across it
 * (model north = compass 39.29, north-east), z up, metres (written as glTF
 * +Y up, -Z north). Bearing 39.29: the long walls of OSM way/328669125
 * (minimum-area rectangle 135.1 x 108.1 m). Anchor = area centroid of
 * way/328669125, -90.0819623 29.9490537. The OSM outline is symmetric about
 * it within 0.5 m and is drawn symmetric. z = 0 is the street, 1.2 m above
 * the lidar ground_min; the site is flat (Mapterhorn 0.0-1.4 m over 160 m;
 * no plaza or deck in it). elevation 0.
 *
 * Sources
 * - OSM: way/328669125 (outline, height 44.1 from Microsoft footprints,
 *   roof:shape pyramidal); way/328774581 (building:part, height 20: the
 *   outline plus a low wing on the west and a canopy on the south-east
 *   face); way/328669101 (building, 1 level: the walkway deck along the
 *   north-east face); way/1199702301 (building:part on the deck: the glass
 *   entrance pavilion).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid, read in this frame with tools/lidar_frame.py (heights above
 *   the street): wall top 31.0 all round on the OSM line; the roof 32.3 at
 *   the eave extrapolated, rising at 0.39-0.40 on every side (an
 *   equal-slope hip) to a flat top 46.3 m, 60 x 34 m; walkway deck 8.6 m;
 *   projecting glazed bays on the north-east face to y 56.5 and 18.0 m
 *   high (x -42..-17 and 13..37); the glass pavilion on the deck 12.6-15.0;
 *   the south-east canopy 12.1 m (x 67.5-74.5, y +-16); the west wing
 *   3.8 m. All measured.
 * - Published: opened 1999, 17,000+ seats (Wikipedia, "Smoothie King
 *   Center"). OSM's 44.1 m agrees with the lidar roof (46.3) roughly.
 * - NAIP (USGS, public domain): plan, the white roof with its flat top and
 *   eight hip facets, the deck and canopies.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   p04 "Smoothie King Center (55151708016).jpg", ajay_suresh, CC BY 4.0,
 *     4 Feb 2026, from the east (GPS): the east corner and north-east
 *     face, the panel colour, the overhanging upper band and its dark
 *     strip, the big windows, the deck, the red sign, and storey heights
 *     scaled from the 31 m wall;
 *     https://commons.wikimedia.org/wiki/File:Smoothie_King_Center_(55151708016).jpg
 *   p05 "New Orleans Arena, exterior view, 10 January 2022.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: from the east, the sign
 *     and the deck;
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Arena,_exterior_view,_10_January_2022.jpg
 *   p01/p02/p03 "Smoothie King Center New Orleans 27 Oct 2020 01/02/03",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the north-west side, the
 *     upper band over the dark strip, the plain lower wall; the north
 *     corner close up;
 *     https://commons.wikimedia.org/wiki/File:Smoothie_King_Center_New_Orleans_27_Oct_2020_01.jpg
 *   p08 "New Orleans from the Air September 2019 - Superdome and Arena",
 *     George Bannister, CC BY 2.0: aerial from the south-south-west, the
 *     white roof, the plain south-west wall, the screens on the west and
 *     south corners, the LED ribbon;
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_from_the_Air_September_2019_-_Superdome_and_Arena.jpg
 *   d104/d91 "DHS Agencies Support Super Bowl LIX Security February 2025 -
 *     104 / 91", DHSgov, public domain: from the north-east by dusk and by
 *     day, the white roof, the ribbon lit in colour at night, the sign;
 *     https://commons.wikimedia.org/wiki/File:DHS_Agencies_Support_Super_Bowl_LIX_Security_February_2025_-_104.jpg
 *   p07 "Mercedes Benz SuperDome and Smoothie King Arena", Steve Aynes,
 *     CC BY 2.0 (c. 2016: the roof was then red; repainted white by 2019).
 * - Look-only: none.
 *
 * Estimated (from p04 scaled to the 31 m wall, p01): lower wall 1.2 m
 * inside the OSM line (the upper band overhangs it); dark strip 20.8-22.8
 * m, 2.4 m in; the two big framed window bays on the north-east face from
 * the deck to 20.2 m (the PELICANS window and its neighbour, each split in
 * three), corner windows 9.4-19.6 m; ground-floor glazing 0.4-7.0 m; the
 * sign a raised red panel 46 m long, 24.6-28.8 m, 0.6 m proud, with a
 * taller block for the crown; the corner screens 24-29.6 m; two faint
 * panel-joint ledges on the band; the deck a 1.5 m slab with a 1 m
 * upstand on round columns (1.4 m) in two rows.
 * Colours from p04 and d91, pulled to the palette: panels silver-grey
 * #d3d7db, roof white #e9e9e6 (white in NAIP, the 2019 aerial and the 2025
 * DHS views, so not the palette roof grey), deck concrete #c9c4ba, sign red
 * #d1404c.
 * Roof (review round 2): the lidar shows no parapet; the wall top is a 1 m
 * gutter ledge at 31.0 m and the hip rises from ~32.6 m just inside it at
 * 0.39-0.5. From the street close up (p04) the 22-degree hip is hidden
 * behind the wall; from farther off (p01, p02) it shows as a low white
 * hip, as the model does (its hip starts at the band top, 31.4 m, and
 * meets the measured 46.3 m flat top).
 * Night: the dark strip is `neon-skc-ribbon` (the real ribbon runs through
 * colours; one blue-violet stands in), the sign `neon-skc-red`, glazing
 * `window`; the corner screens share the ribbon material.
 * Left out: roof logos and lettering, the roof-edge lights, the billboards,
 * the corner stair towers, the rest of the Superdome plaza deck (the map's).
 *
 * Doubts: the south-west and south-east faces are seen only from the air
 * (p08) and from far; their ground floors are drawn plain except the
 * south-east entrance under its canopy. The sign is drawn on the north-east
 * face only (a smaller one on the south-west face in p08 is not certain in
 * 2026). The deck is drawn to its OSM outline only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, inset, walls, cap, onWall, panel, save } from './chi-aon-center'

const HX = 67.5, HY = 54, CX = 23, CY = 23 // half sizes and corner cuts
const WALL_TOP = 31.0 // upper band top, lidar
const ROOF_TOP = 46.3 // flat top, lidar
const SLOPE = 0.395 // hip slope, lidar
const STRIP0 = 20.8, STRIP1 = 22.8 // dark LED strip under the upper band
const LOW_IN = 1.2, STRIP_IN = 2.4 // lower wall and strip behind the OSM line
const DECK = 8.6 // walkway deck top, lidar
const WIN0 = 9.4, WIN1 = 19.6 // concourse windows (deck to just under the strip)
const GF0 = 0.4, GF1 = 7.0 // ground-floor glazing

const O: XY[] = [[-HX + CX, -HY], [HX - CX, -HY], [HX, -HY + CY], [HX, HY - CY], [HX - CX, HY], [-HX + CX, HY], [-HX, HY - CY], [-HX, -HY + CY]]

/** Walls of a ring split into pieces no longer than `seg` (for the map's terrain drape). */
function wallsSeg(p: Part, r: XY[], z0: number, z1: number, seg = 5) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / seg))
    for (let k = 0; k < n; k++) {
      const p0: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const p1: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
    }
  }
}
/** The ring, counter-clockwise from above. */
const ccw = (r: XY[]): XY[] => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) < 0 ? r.slice().reverse() : r)
/** Horizontal ring between an outer and inner ring of the same length. */
function ring(p: Part, outer: XY[], inner: XY[], z: number, up: boolean) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    const a: V3 = [outer[i][0], outer[i][1], z], b: V3 = [outer[j][0], outer[j][1], z]
    const c: V3 = [inner[j][0], inner[j][1], z], d: V3 = [inner[i][0], inner[i][1], z]
    if (up) p.quad(a, b, c, d); else p.quad(a, d, c, b)
  }
}
/** A closed box from a counter-clockwise footprint. */
function prism(side: Part, top: Part | null, r: XY[], z0: number, z1: number, bottom = true) {
  walls(side, r, z0, z1)
  if (top) cap(top, r, z1)
  if (bottom) cap(side, r, z0, false)
}
/** A box on wall a→b: s0..s1 along, z0..z1 up, d0..d1 outward (d from the wall line). */
function wallBox(side: Part, front: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const { P } = onWall(a, b)
  const f = [P(s0, 0, d1), P(s1, 0, d1)], k = [P(s1, 0, d0), P(s0, 0, d0)]
  const xy = (v: V3): XY => [v[0], v[1]]
  front.quad([...xy(f[0]), z0] as V3, [...xy(f[1]), z0] as V3, [...xy(f[1]), z1] as V3, [...xy(f[0]), z1] as V3)
  const r: XY[] = [xy(f[0]), xy(f[1]), xy(k[0]), xy(k[1])]
  // sides, top and bottom (the face against the wall is left out)
  side.quad([...r[1], z0] as V3, [...r[2], z0] as V3, [...r[2], z1] as V3, [...r[1], z1] as V3)
  side.quad([...r[3], z0] as V3, [...r[0], z0] as V3, [...r[0], z1] as V3, [...r[3], z1] as V3)
  cap(side, r, z1)
  cap(side, r, z0, false)
}

function build() {
  const metal = new Part(), roof = new Part(), win = new Part(), concrete = new Part(), ribbon = new Part(), red = new Part()

  const L = inset(O, LOW_IN), S = inset(O, STRIP_IN)

  // ---- Lower wall, the strip, the overhanging upper band.
  wallsSeg(metal, L, 0, 5)
  walls(metal, L, 5, STRIP0)
  ring(metal, L, S, STRIP0, true)
  walls(ribbon, S, STRIP0, STRIP1)
  ring(metal, O, S, STRIP1, false) // soffit under the band
  const bev = inset(O, 0.4)
  walls(metal, O, STRIP1, WALL_TOP)
  walls(metal, O, WALL_TOP, WALL_TOP + 0.4, bev)
  // faint horizontal panel joints on the band: thin ledges 0.12 m proud
  const J = inset(O, -0.12)
  for (const z of [25.5, 28.3]) {
    walls(metal, J, z, z + 0.22)
    ring(metal, J, O, z + 0.22, true)
    ring(metal, J, O, z, false)
  }

  // ---- Roof: equal-slope hip from the band to the flat top.
  const run = (ROOF_TOP - (WALL_TOP + 0.4)) / SLOPE
  const top = inset(bev, run)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    roof.quad([bev[i][0], bev[i][1], WALL_TOP + 0.4], [bev[j][0], bev[j][1], WALL_TOP + 0.4], [top[j][0], top[j][1], ROOF_TOP], [top[i][0], top[i][1], ROOF_TOP])
  }
  cap(roof, top, ROOF_TOP)

  // ---- Faces of the lower wall (L, counter-clockwise from the south-west face):
  // 0 SW long, 1 S chamfer, 2 SE short, 3 E chamfer, 4 NE long, 5 N chamfer, 6 NW short, 7 W chamfer.
  const face = (i: number) => ({ a: L[i], b: L[(i + 1) % 8], ...onWall(L[i], L[(i + 1) % 8]) })

  // Corner entrances: ground-floor glazing behind piers, two big concourse windows above.
  for (const i of [1, 3, 5, 7]) {
    const f = face(i), n = 4, end = 2.2, gap = 1.4, w = (f.L - 2 * end - (n - 1) * gap) / n
    for (let k = 0; k < n; k++) panel(win, f.a, f.b, end + k * (w + gap), end + k * (w + gap) + w, GF0, GF1)
    const half = (f.L - 2 * end - 2.0) / 2
    panel(win, f.a, f.b, end, end + half, WIN0, WIN1)
    panel(win, f.a, f.b, f.L - end - half, f.L - end, WIN0, WIN1)
  }
  // North-east face: glazed concourse under the deck, two projecting window bays.
  {
    const f = face(4), n = 9, end = 2.0, gap = 1.4, w = (f.L - 2 * end - (n - 1) * gap) / n
    for (let k = 0; k < n; k++) panel(win, f.a, f.b, end + k * (w + gap), end + k * (w + gap) + w, GF0, GF1)
    // s runs from x = +43.8 toward -x; bays at x 13..37 and -42..-17 (lidar), to y 56.5.
    const sx = (x: number) => (HX - CX - LOW_IN * Math.tan(Math.PI / 8)) - x
    const d1 = 56.5 - (HY - LOW_IN)
    for (const [x1, x0] of [[37, 13], [-17, -42]]) {
      const s0 = sx(x1), s1 = sx(x0), z0 = DECK, z1 = STRIP0 - 0.6
      wallBox(metal, metal, f.a, f.b, s0, s1, z0, z1, 0, d1)
      // the glass in a 0.6 m frame, split by two mullions (p04: the PELICANS window and its neighbour)
      const fa: XY = [f.P(0, 0, d1)[0], f.P(0, 0, d1)[1]], fb: XY = [f.P(f.L, 0, d1)[0], f.P(f.L, 0, d1)[1]]
      const w = (s1 - s0 - 1.2 - 2 * 0.4) / 3
      for (let k = 0; k < 3; k++) panel(win, fa, fb, s0 + 0.6 + k * (w + 0.4), s0 + 0.6 + k * (w + 0.4) + w, z0 + 0.8, z1 - 0.6, 0.04)
    }
  }
  // South-east face: entrance glazing under the canopy.
  {
    const f = face(2), mid = f.L / 2, n = 4, gap = 1.4, span = 26, w = (span - (n - 1) * gap) / n
    for (let k = 0; k < n; k++) panel(win, f.a, f.b, mid - span / 2 + k * (w + gap), mid - span / 2 + k * (w + gap) + w, GF0, GF1)
  }

  // ---- The sign: a red bar on the north-east band, toward the north-west end (p04, p05).
  {
    const { P } = onWall(O[4], O[5])
    const s0 = 34, s1 = 80, z0 = 24.6, z1 = 28.8, d = 0.6
    const r: XY[] = [P(s0, 0, d), P(s1, 0, d), P(s1, 0, 0), P(s0, 0, 0)].map((v) => [v[0], v[1]] as XY)
    prism(red, red, r, z0, z1)
    // the crown over the first letter, taller
    const c: XY[] = [P(s0, 0, d), P(s0 + 5, 0, d), P(s0 + 5, 0, 0), P(s0, 0, 0)].map((v) => [v[0], v[1]] as XY)
    prism(red, red, c, z1, z1 + 1.6)
  }
  // Video screens on the west and south corners of the band (p08).
  for (const i of [1, 7]) {
    const { L: len } = onWall(O[i], O[(i + 1) % 8])
    panel(ribbon, O[i], O[(i + 1) % 8], 4, len - 4, 24.0, 29.6, 0.25)
  }

  // ---- Walkway deck (OSM way/328669101) on columns, its inner edge on the lower wall.
  {
    const W = HY - LOW_IN, t = LOW_IN * Math.tan(Math.PI / 8)
    const deck = ccw([[67.4 - LOW_IN, 31.3 - t], [44.6 - t, W], [-44.6, W], [-47.3, 56.7], [-39.0, 59.4], [-24.5, 64.2], [-11.1, 65.5], [23.6, 74.5], [30.6, 70.4], [38.0, 65.4], [65.6, 38.7]])
    const T = DECK - 1.5 // a 1.5 m slab (p04)
    prism(concrete, concrete, deck, T, DECK)
    // solid upstand along the open edge, and round columns: a row 2.5 m in from the edge,
    // and a second row halfway to the wall where the deck is wider than 10 m (p04, p05).
    const outer: XY[] = [[-47.3, 56.7], [-39.0, 59.4], [-24.5, 64.2], [-11.1, 65.5], [23.6, 74.5], [30.6, 70.4], [38.0, 65.4], [65.6, 38.7]]
    const col = (c: XY) => {
      const r: XY[] = Array.from({ length: 12 }, (_, i) => [c[0] + 0.7 * Math.cos((i / 12) * 2 * Math.PI), c[1] + 0.7 * Math.sin((i / 12) * 2 * Math.PI)] as XY)
      walls(concrete, r, 0, T)
    }
    for (let k = 0; k < outer.length - 1; k++) {
      const { P, L: len } = onWall(outer[k + 1], outer[k]) // outward = away from the arena
      const xy = (s: number, o: number): XY => { const v = P(s, 0, o); return [v[0], v[1]] }
      prism(concrete, concrete, ccw([xy(0, 0), xy(len, 0), xy(len, -0.35), xy(0, -0.35)]), DECK, DECK + 1.0, false)
      const n = Math.max(1, Math.round(len / 11))
      for (let c = 0; c < n; c++) {
        const s = (c + 0.5) * len / n, e = xy(s, -2.5)
        col(e)
        if (k < 6 && e[1] - W > 10) col([e[0], (e[1] + W) / 2])
      }
    }
    // glass entrance pavilion on the deck (way/1199702301)
    const pav: XY[] = [[19.2, W], [16.6, 57.8], [3.3, 61.7], [-10.4, 58.0], [-13.9, W]]
    walls(win, pav, DECK, 14.5)
    cap(metal, pav, 14.5)
  }

  // ---- South-east entrance canopy (part of way/328774581), a slab on posts.
  {
    const z = 12.1
    prism(metal, metal, ccw([[HX, -16], [70.5, -16], [74.5, 0.3], [69.9, 16.3], [HX, 16.3]]), z - 0.9, z)
    for (const y of [-12, -4, 4, 12]) prism(metal, null, [[71.0, y - 0.45], [71.9, y - 0.45], [71.9, y + 0.45], [71.0, y + 0.45]], 0, z - 0.9, false)
  }

  // ---- West wing (the rest of way/328774581): a low service block, 3.8-5.5 m (lidar), drawn 4.5.
  {
    const wing: XY[] = [[-46.8, -52.2], [-67.6, -30.6], [-67.7, -5.8], [-74.9, -7.8], [-71.3, -21.7], [-85.8, -25.2], [-83.7, -33.4], [-99.8, -38.0], [-91.9, -65.4]]
    const r = ccw(wing)
    wallsSeg(concrete, r, 0, 4.5)
    cap(concrete, r, 4.5)
  }

  return [
    { part: metal, material: finish('skc-panel', 0xd3d7db) },
    { part: roof, material: finish('skc-roof', 0xe9e9e6) },
    { part: win, material: PALETTE.window },
    { part: concrete, material: finish('skc-concrete', 0xc9c4ba) },
    { part: ribbon, material: finish('neon-skc-ribbon', 0x5867b0) },
    { part: red, material: finish('neon-skc-red', 0xd1404c) },
  ]
}

if (import.meta.main) await save('nola-smoothie-king-center', 'Smoothie King Center', [29.9490537, -90.0819623], 39.29, build())
