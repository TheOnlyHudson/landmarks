/**
 * Grand Kremlin Palace, Moscow: procedural, CC0-1.0, no textures.
 * bun generators/moscow-grand-kremlin-palace.ts
 *
 * Konstantin Thon's palace of 1838-1849 on Borovitsky Hill, with the older
 * buildings it wraps: the Terem Palace (1635-36) with the eleven gilded
 * domes of the Upper Saviour Cathedral and the Terem churches, the Palace
 * of Facets (1487-91) and the Red Porch on Cathedral Square, the Church of
 * the Nativity of the Virgin on the Seni and the Church of the Deposition
 * of the Robe. OSM maps all of them as building:parts inside one outline,
 * relation/225033, so they are one model here: replacing the outline hides
 * everything inside it.
 *
 * Also the kit for the other Kremlin palace models (moscow-armoury,
 * moscow-amusement-palace, moscow-state-kremlin-palace import `slab`,
 * `hipRing`, `bayWall`, `lathe` and friends from here). The model is only
 * written when this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. The river front
 * faces model south. Placed at bearing -13.9 degrees, the direction of the
 * outline's long river wall (compass 76.1). Anchor: area centroid of
 * relation/225033 (37.6157147, 55.7502284). The model is built flat on its
 * courtyard level; the hill falls to the river and the map drapes the model
 * on its terrain (Mapterhorn has no z15 here: tools/terrain.ts grid at z12
 * reads about 10 m of fall across the footprint, north to south).
 *
 * Evidence
 * - OSM (API map call and Overpass, 2026-11-18): the outline relation/225033
 *   and its 250-odd building:parts. Plan and heights per part:
 *   river range 3049143 (22.5 m, skillion roofs to 27), the arcaded podium
 *   strip 16506641 (7 m) on the south, west and east, the belvedere
 *   3049142 (22.5-27), its drum and dome 16506589-91, 255905186-236 (to
 *   36.35 m) and flagpole 255905233 (47 m); west wing 3049127 (15.5, roofs
 *   to 18); St George's Hall wing 3049141 (26, hipped); Vladimir Hall
 *   3049138/16461411/412 (26-34); north range 3049124 (23); Terem upper
 *   storeys 3049133 (31) and Teremok 3049129 (41.5, hipped 5); the tented
 *   tower 3049136 (41.5, pyramid 7.5); Upper Saviour Cathedral 7679714
 *   (23) with its eleven onion domes 16461315-324/379 (29 m; three large,
 *   eight small); Palace of Facets 7679578 (21, hipped to 25); Church of the
 *   Nativity 3049131 (27, pyramid) with its onion 16461364 (34.9 m) and
 *   relation/7688145; Deposition church 7688146 (17); the gallery to the
 *   north-west 3427805 (10-23, roof to 28); the north-west wing 3049134 (14).
 * - Published: 125 m long, 47 m high to the flagpole (en.wikipedia, "Grand
 *   Kremlin Palace"); "appears three storeys but is two; the upper floor has
 *   two rows of windows"; the Terem churches under one roof crowned by 11
 *   gilded domes (ru.wikipedia, "Домовые церкви Теремного дворца"); the
 *   Nativity church has one dome (ru.wikipedia).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Diego Delso, "Gran Palacio del Kremlin, Moscú, Rusia, 2016-10-03, DD
 *     28-29 HDR.jpg", CC BY-SA 4.0: the river front straight on, floodlit.
 *     https://commons.wikimedia.org/wiki/File:Gran_Palacio_del_Kremlin,_Mosc%C3%BA,_Rusia,_2016-10-03,_DD_28-29_HDR.jpg
 *   - Юрий Д.К., "Moscow - Grand Kremlin Palace - close-up.jpg", CC BY 4.0:
 *     the river front from the south-west in sun.
 *     https://commons.wikimedia.org/wiki/File:Moscow_-_Grand_Kremlin_Palace_-_close-up.jpg
 *   - Юрий Д.К., "Moscow. Grand Kremlin Palace from the Bolshoy Kamenny
 *     Bridge.jpg", CC BY 4.0: from the west-south-west.
 *     https://commons.wikimedia.org/wiki/File:Moscow._Grand_Kremlin_Palace_from_the_Bolshoy_Kamenny_Bridge.jpg
 *   - Jorge Láscar, "The Grand Kremlin Palace (19969552331).jpg", CC BY 2.0:
 *     from the south-west across the river.
 *     https://commons.wikimedia.org/wiki/File:The_Grand_Kremlin_Palace_(19969552331).jpg
 *   - W. Bulach, "00 4700 Moscow, Kremlin - Grand Kremlin Palace, Ivan the
 *     Great Bell Tower.jpg", CC BY-SA 4.0: from the south-east.
 *     https://commons.wikimedia.org/wiki/File:00_4700_Moscow,_Kremlin_-_Grand_Kremlin_Palace,_Ivan_the_Great_Bell_Tower.jpg
 *   - FritzDaCat, "The Grand Kremlin Palace in 2015.JPG", CC BY-SA 4.0: the
 *     river front from its east end, the podium arcade.
 *     https://commons.wikimedia.org/wiki/File:The_Grand_Kremlin_Palace_in_2015.JPG
 *   - Don-vip, "2019-07-26-Moscow-3118-Palace of Facets.jpg", CC BY-SA 4.0:
 *     the Palace of Facets, the Red Porch and the Terem domes from Ivan
 *     the Great. https://commons.wikimedia.org/wiki/File:2019-07-26-Moscow-3118-Palace_of_Facets.jpg
 *   - Sergey Norin, "Moscow Kremlin - Grand Palace, Red Porch, Palace of
 *     Facets (16600386546).jpg", CC BY 2.0.
 *     https://commons.wikimedia.org/wiki/File:Moscow_Kremlin_-_Grand_Palace,_Red_Porch,_Palace_of_Facets_(16600386546).jpg
 *   - Jorge Láscar, "Terem Palace's golden domes (19967431005).jpg", CC BY
 *     2.0; Ludvig14, "Domed roof over the Terem Palace churches, Moscow
 *     Kremlin.jpg", CC BY-SA 3.0; michael clarke, "Moscow Kremlin Terem
 *     Palace Church 02 (4104764543).jpg" and "Moscow Kremlin Terem Palace 05
 *     (4104746809).jpg", CC BY-SA 2.0: the domes, drums and the red north
 *     range. Andrew Bossi, "Upper Saviour's Cathedral and Terem
 *     Churches.jpg", CC BY-SA 2.0. Fedor Chelnokov, "Terem Palace as seen
 *     from Mokhovaya str.jpg", public domain: the Teremok's roof.
 *   - ITAR-TASS, "Kremlin birds eye view-1.jpg" and "-3.jpg", CC BY 4.0:
 *     the plan, roofs and courtyards from above.
 *
 * Measured from Delso's straight-on photo, scaled to OSM's 109.9 m river
 * wall (18.7 px/m): 23 bays (9 + 5 under the belvedere + 9) at 4.5-4.8 m;
 * the arcade storey to 7 m (OSM's podium), lower windows 7.6-11.3 m under
 * triangular pediments to 12.9, upper windows 14.4-18.2 under kokoshnik
 * pediments to 19.7, main cornice 20.6-21.6, attic to 23.6 (OSM 22.5; the
 * photo reads 24), roof ridge 27.6 (OSM 27), belvedere attic 30.2 with its
 * balustrade, a 2.6 m drum with the clocks, a green dome 16 m across rising
 * 6 m to about 39 m, the gilt crown to about 44 m and the flagpole to 47 m
 * (published). The dome is drawn a little taller than Delso's photo reads,
 * as the photos from the south-west show it prominent over the roofs.
 *
 * Roof green: the sunlit painted metal sampled from Don-vip's and
 * Юрий Д.К.'s photos (#5f9389-#6fa699 in sun), pulled light: #76b9a6.
 *
 * Estimated or simplified:
 * - The podium is drawn as OSM maps it, 4.6 m proud of the upper wall on
 *   the river side; Fritz's photo shows it projecting, but by perhaps 2-3 m.
 * - Paired window lights are drawn as one round-headed light with a
 *   mullion; plaster ornament, the double-headed eagles in the kokoshniks,
 *   the roof cresting, dormers and chimneys are left out.
 * - The north and courtyard walls, the west wing and the Terem's courtyard
 *   faces have no licensed close photos; they are drawn plain with rows of
 *   windows at the river front's pitch. The north range is drawn red with
 *   white trim, as michael clarke's photo shows it.
 * - The Terem domes stand on drums 3.6 m (large) and 2.8 m (small) tall,
 *   from Láscar's photo; OSM's 29 m is used for the onion tops.
 * - The Deposition church's single gold dome has no OSM part: placed over
 *   its main cube from the Don-vip photo, height estimated.
 * - The Palace of Facets' diamond rustication is plain white; its eaves are
 *   drawn at 19.5 m (Don-vip's photo, against OSM's 21).
 * - The Red Porch is a white stair mass rising west to 7.5 m with its gate.
 * - The gallery to the north-west (3427805) is drawn as a bridge block from
 *   10 to 23 m; the street passes under it.
 * - The Teremok's checkered roof is drawn in the Terem's brick red.
 *
 * Materials (six): palace yellow, white trim (pilasters, cornices, window
 * surrounds, the white churches and the Palace of Facets), window, the
 * green roofs, gold (domes, crown, clocks), Terem brick red (the north
 * range, the Teremok, the dome drums). At night the river front and the
 * belvedere are floodlit (Delso) and the windows glow.
 *
 * Doubts: the courtyard roofs between St George's Hall and the Terem are a
 * tangle in OSM and drawn as a few hipped blocks. The terrain under the
 * river front is z12, coarser than the hill, so the arcade may read taller
 * or shorter on the map than it is.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, insetRing, area, unit, finishModel, circle } from './nyc-570-lexington'
import { band, parapet, spread } from './nyc-city-hall'

export type XY = [number, number]

// ===========================================================================
// Kit
// ===========================================================================

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)

/** Outward-facing walls of a ring between two heights. */
export function walls(p: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** A solid: walls, a top cap and optionally a bottom cap. */
export function slab(p: Part, ring: XY[], z0: number, z1: number, top: Part | null = p, bottom: Part | null = null) {
  walls(p, ring, z0, z1)
  if (top) capPoly(top, ccw(ring), z1)
  if (bottom) capPoly(bottom, ccw(ring), z0, false)
}

/**
 * A hipped roof on any ring: the eave ring (grown by `over`) lofted up and
 * in to the ring inset by `inset`, and capped. An inset just under the
 * narrowest half-width gives a ridge; the union of overlapping rectangles
 * gives L and T roofs with proper valleys.
 */
export function hipRing(p: Part, ring: XY[], z0: number, rise: number, inset: number, over = 0.4) {
  const r = ccw(ring)
  const eave = insetRing(r, -over), top = insetRing(r, inset)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([eave[i][0], eave[i][1], z0], [eave[j][0], eave[j][1], z0], [top[j][0], top[j][1], z0 + rise], [top[i][0], top[i][1], z0 + rise])
  }
  capPoly(p, top, z0 + rise)
  capPoly(p, eave, z0, false)
}

/** A pyramid on a ring to an apex. */
export function pyramid(p: Part, ring: XY[], z0: number, apex: V3) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.tri([a[0], a[1], z0], [b[0], b[1], z0], apex)
  }
}

/**
 * A smooth surface of revolution about (cx, cy): `prof` is [radius, z] from
 * the bottom up; a radius of 0 closes it to a point. Normals from the
 * profile's slope, so it shades round.
 */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n = 10, phase = 0) {
  const ang = (i: number) => phase + (i * 2 * Math.PI) / n
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    // the slope normal in the (r, z) plane
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    const nr = dz / l, nz = -dr / l
    for (let i = 0; i < n; i++) {
      const a0 = ang(i), a1 = ang(i + 1)
      const P = (r: number, z: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const N = (a: number): V3 => unit([nr * Math.cos(a), nr * Math.sin(a), nz])
      const A = P(r0, z0, a0), B = P(r0, z0, a1), C = P(r1, z1, a1), D = P(r1, z1, a0)
      if (r0 > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      if (r1 > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
  }
}

/** An onion dome of radius r from z0 (its widest point a third of the way up) to a point at z0 + h. */
export function onion(p: Part, cx: number, cy: number, z0: number, r: number, h: number, n = 10) {
  const prof: [number, number][] = [
    [r * 0.72, z0], [r * 0.97, z0 + h * 0.12], [r, z0 + h * 0.28], [r * 0.88, z0 + h * 0.48],
    [r * 0.52, z0 + h * 0.7], [r * 0.16, z0 + h * 0.86], [0, z0 + h],
  ]
  lathe(p, cx, cy, prof, n)
}

/** A plain drum (cylinder) with a top cap. */
export function drum(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 8, top = true) {
  const ring = circle(cx, cy, r, n, Math.PI / n)
  slab(p, ring, z0, z1, top ? p : null)
}

/** Points on a wall a -> b (counter-clockwise ring order, so it faces out), d metres proud. */
export function frame(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  return { L, at: (s: number, z: number, d = 0.03): V3 => [a[0] + ux * s + uy * d, a[1] + uy * s - ux * d, z] }
}

/** A flat rectangle on a wall. */
export function panel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, d = 0.03) {
  const f = frame(a, b)
  p.quad(f.at(s - w / 2, z0, d), f.at(s + w / 2, z0, d), f.at(s + w / 2, z1, d), f.at(s - w / 2, z1, d))
}

/** A round-headed panel: a rectangle under a true semicircle, its top at zTop. */
export function roundPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.03, segs = 6) {
  const f = frame(a, b), r = w / 2, spring = zTop - r
  if (spring > z0) p.quad(f.at(s - r, z0, d), f.at(s + r, z0, d), f.at(s + r, spring, d), f.at(s - r, spring, d))
  for (let i = 0; i < segs; i++) {
    const t0 = (i / segs) * Math.PI, t1 = ((i + 1) / segs) * Math.PI
    p.tri(f.at(s, spring, d), f.at(s + r * Math.cos(t0), spring + r * Math.sin(t0), d), f.at(s + r * Math.cos(t1), spring + r * Math.sin(t1), d))
  }
}

/** A triangular pediment panel, base z0 to apex z1. */
export function triPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, d = 0.03) {
  const f = frame(a, b)
  p.tri(f.at(s - w / 2, z0, d), f.at(s + w / 2, z0, d), f.at(s, z1, d))
}

/** A kokoshnik (pointed, keel-topped) panel: two arcs meeting at the apex. */
export function keelPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, d = 0.03, segs = 3) {
  const f = frame(a, b), h = z1 - z0
  const side = (sg: number) => Array.from({ length: segs + 1 }, (_, i) => {
    const t = i / segs // 0 at the base corner, 1 at the apex
    const x = (w / 2) * Math.cos((t * Math.PI) / 2) ** 1.2
    const z = h * (Math.sin((t * Math.PI) / 2) * 0.82 + t * t * 0.18)
    return [s + sg * x, z0 + z] as XY
  })
  const L = side(-1), R = side(1)
  for (let i = 0; i < segs; i++) {
    p.tri(f.at(s, z0, d), f.at(R[i][0], R[i][1], d), f.at(R[i + 1][0], R[i + 1][1], d))
    p.tri(f.at(s, z0, d), f.at(L[i + 1][0], L[i + 1][1], d), f.at(L[i][0], L[i][1], d))
  }
}

/** The outline of a kokoshnik arch as a band `t` wide (for the belvedere's arches). */
export function keelOutline(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, t: number, d = 0.03, segs = 5) {
  const f = frame(a, b)
  const curve = (ww: number, zz0: number, zz1: number) => {
    const h = zz1 - zz0, pts: XY[] = []
    for (let i = 0; i <= 2 * segs; i++) {
      const u = i / (2 * segs), sg = u < 0.5 ? -1 : 1, tt = u < 0.5 ? u * 2 : (1 - u) * 2
      const x = (ww / 2) * Math.cos((tt * Math.PI) / 2) ** 1.2
      pts.push([s + sg * x, zz0 + h * (Math.sin((tt * Math.PI) / 2) * 0.82 + tt * tt * 0.18)])
    }
    return pts
  }
  const o = curve(w, z0, z1), i = curve(w - 2 * t, z0, z1 - t)
  for (let k = 0; k < o.length - 1; k++) {
    p.quad(f.at(o[k][0], o[k][1], d), f.at(i[k][0], i[k][1], d), f.at(i[k + 1][0], i[k + 1][1], d), f.at(o[k + 1][0], o[k + 1][1], d))
  }
}

export type Row = {
  /** Window light, bottom to top. */
  z0: number; z1: number
  /** Light width. */
  w: number
  head?: 'round' | 'rect'
  /** White surround border and the pediment over it. */
  frame?: number
  ped?: 'tri' | 'keel' | null; pedH?: number
  /** Segments in a round head (4). */
  segs?: number
  /** A white mullion bar down the middle (paired lights). */
  mullion?: boolean
}

/**
 * A classical bay facade on the wall a -> b: `bays` windows per row,
 * evenly spread between `margin`s, white pilasters at the bay lines from
 * pil[0] to pil[1]. Windows are slate panels in white surrounds; `skip`
 * leaves bays out (doors, gates).
 */
export function bayWall(o: {
  win: Part; trim: Part; a: XY; b: XY; bays: number; margin?: number; rows: Row[]
  pil?: [number, number, number]; skip?: (k: number, row: number) => boolean
}) {
  const f = frame(o.a, o.b), m = o.margin ?? 0.6
  const pitch = (f.L - 2 * m) / o.bays
  const centres = spread(m, f.L - m, o.bays)
  if (o.pil) {
    const [z0, z1, w] = o.pil
    for (let k = 0; k <= o.bays; k++) {
      const s = Math.min(f.L - w / 2, Math.max(w / 2, m + k * pitch))
      panel(o.trim, o.a, o.b, s, w, z0, z1, 0.02)
    }
  }
  o.rows.forEach((r, ri) => {
    centres.forEach((s, k) => {
      if (o.skip?.(k, ri)) return
      const fr = r.frame ?? 0
      if (fr > 0) {
        panel(o.trim, o.a, o.b, s, r.w + 2 * fr, r.z0 - fr, r.z1 + fr, 0.035)
        if (r.ped === 'tri') triPanel(o.trim, o.a, o.b, s, r.w + 2 * fr + 0.4, r.z1 + fr, r.z1 + fr + (r.pedH ?? 1.2), 0.035)
        if (r.ped === 'keel') keelPanel(o.trim, o.a, o.b, s, r.w + 2 * fr + 0.2, r.z1 + fr, r.z1 + fr + (r.pedH ?? 1.3), 0.035, 2)
      }
      if (r.head === 'round') roundPanel(o.win, o.a, o.b, s, r.w, r.z0, r.z1, 0.05, r.segs ?? 4)
      else panel(o.win, o.a, o.b, s, r.w, r.z0, r.z1, 0.05)
      if (r.mullion) panel(o.trim, o.a, o.b, s, 0.22, r.z0, r.head === 'round' ? r.z1 - r.w / 2 : r.z1, 0.06)
    })
  })
}

/** The four walls of a rectangle, counter-clockwise from the south-west corner: [south, east, north, west], each [a, b]. */
export const sides = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]

// ===========================================================================
// The model
// ===========================================================================

function build() {
  const yellow = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gold = new Part(), red = new Part()

  // ------------------------------------------------------------ heights
  const POD = 7.0 // the arcaded podium storey
  const EAVE = 23.6 // top of the attic
  const RISE = 4.0 // the main roofs, to 27.6

  // Thon's river and east fronts: the main yellow block.
  const S = -60, Wx = -62, Ex = 47.9, Nr = -34.8
  slab(yellow, rect(Wx, S, Ex, Nr), 0, EAVE, null)
  slab(yellow, rect(22.4, Nr, Ex, 3.9), 0, EAVE, null)
  slab(yellow, rect(-24.8, Nr, -0.6, 6.2), 0, EAVE, null) // St George's Hall wing

  // The podium: south, west and east strips (OSM 16506641), arcaded.
  const PS = -64.6, PW = -68.6, PE = 51.3
  const podium: XY[] = [[PW, PS], [52.9, PS], [52.9, -57.5], [PE, -57.4], [PE, 1.7], [Ex, 1.7], [Ex, S], [Wx, S], [Wx, Nr], [PW, Nr]]
  slab(yellow, podium, 0, POD, roof)
  // podium cornice
  band(trim, ccw(podium), POD - 0.6, POD, 0.3)
  // arcade: round-headed glazed arches in white frames, one per upper bay
  const arcade = (a: XY, b: XY, n: number, m = 1.4) => bayWall({
    win, trim, a, b, bays: n, margin: m,
    rows: [{ z0: 0.8, z1: 5.4, w: 2.6, head: 'round', segs: 3 }],
  })

  // ------------------------------------------------------------ facades
  const upper: Row[] = [
    { z0: 7.6, z1: 11.3, w: 2.0, head: 'round', frame: 0.2, ped: 'tri', pedH: 1.3, mullion: true },
    { z0: 14.4, z1: 18.2, w: 2.0, head: 'round', frame: 0.2, ped: 'keel', pedH: 1.4, mullion: true },
  ]
  const PIL: [number, number, number] = [POD, 20.6, 0.7]
  // River front: 9 bays, the belvedere's 5, 9 bays (Delso).
  const BX0 = -19.5, BX1 = 5.4 // the belvedere
  bayWall({ win, trim, a: [Wx, S], b: [BX0, S], bays: 9, margin: 0.4, rows: upper, pil: PIL })
  bayWall({ win, trim, a: [BX0, S], b: [BX1, S], bays: 5, margin: 0.3, rows: upper, pil: PIL })
  bayWall({ win, trim, a: [BX1, S], b: [Ex, S], bays: 9, margin: 0.4, rows: upper, pil: PIL })
  arcade([PW, PS], [52.9, PS], 25, 2.2)
  // East front onto Cathedral Square side (over the podium), 13 bays.
  const upperPlain = upper.map((r) => ({ ...r, mullion: false }))
  bayWall({ win, trim, a: [Ex, S], b: [Ex, 3.9], bays: 13, margin: 0.6, rows: upperPlain, pil: PIL })
  arcade([PE, -57.4], [PE, 1.7], 12, 1.6)
  // West end of the river block, 5 bays, and its podium.
  bayWall({ win, trim, a: [Wx, Nr], b: [Wx, S], bays: 5, margin: 0.6, rows: upperPlain, pil: PIL })
  arcade([PW, Nr], [PW, PS], 6, 1.2)
  // Courtyard faces: plainer rows.
  const plain: Row[] = [
    { z0: 8.2, z1: 11.6, w: 1.9, head: 'rect' },
    { z0: 14.6, z1: 18.2, w: 1.9, head: 'rect' },
  ]
  bayWall({ win, trim, a: [-0.6, Nr], b: [-0.6, 6.2], bays: 8, rows: plain })
  bayWall({ win, trim, a: [-0.6, 6.2], b: [-24.8, 6.2], bays: 5, rows: plain })
  bayWall({ win, trim, a: [-24.8, 6.2], b: [-24.8, -25], bays: 7, rows: plain })

  // Cornices and string course round the main block (river, east and the hall wing).
  const main: XY[] = [[Wx, S], [Ex, S], [Ex, 3.9], [22.4, 3.9], [22.4, Nr], [-0.6, Nr], [-0.6, 6.2], [-24.8, 6.2], [-24.8, Nr], [Wx, Nr]]
  band(trim, main, 13.0, 13.6, 0.22)
  band(trim, main, 20.6, 21.6, 0.5)
  band(trim, main, EAVE - 0.45, EAVE, 0.32)

  // ------------------------------------------------------------ main roofs
  // The river range, the east range and St George's Hall as one hipped
  // L/T: overlapping rectangles, each with a ridge along its length.
  hipRing(roof, rect(Wx, S, Ex, Nr), EAVE, RISE, 12.3)
  hipRing(roof, rect(22.4, S, Ex, 3.9), EAVE, RISE * 12.75 / 12.6, 12.45)
  hipRing(roof, rect(-24.8, S, -0.6, 6.2), EAVE, RISE * 12.1 / 12.6, 11.8)

  // ------------------------------------------------------------ belvedere
  // The square attic over the middle five bays, kokoshnik arches on its
  // river and courtyard faces, a balustrade, the broad green dome with four
  // gilt clocks, the crown and the flagpole.
  const BY0 = S, BY1 = Nr, BT = 30.2, bcx = (BX0 + BX1) / 2, bcy = (BY0 + BY1) / 2
  slab(yellow, rect(BX0, BY0, BX1, BY1), EAVE - 0.5, BT, roof)
  band(trim, rect(BX0, BY0, BX1, BY1), BT - 0.5, BT, 0.3)
  parapet(trim, ccw(rect(BX0 - 0.3, BY0 - 0.3, BX1 + 0.3, BY1 + 0.3)), BT, BT + 0.8, 0.3)
  for (const [a, b] of [[[BX0, BY0], [BX1, BY0]], [[BX1, BY1], [BX0, BY1]]] as [XY, XY][]) {
    for (const s of spread(0.2, BX1 - BX0 - 0.2, 5)) {
      keelOutline(trim, a, b, s, 4.6, EAVE + 0.2, BT - 0.7, 0.45, 0.04, 4)
      // the eagle in each arch, a white boss
      panel(trim, a, b, s, 1.5, EAVE + 1.0, EAVE + 3.4, 0.03)
    }
  }
  // the dome: round, 18 m across, rising 4.8 m (Delso, Kamenny)
  // A drum 2.6 m tall carries the clocks, the dome rises 6 m above it (Refine:
  // the photos show a prominent dome, not a low cap).
  const DR = 8.2, DZ = BT + 2.6, DH = 6.0
  walls(yellow, circle(bcx, bcy, DR - 0.3, 12, Math.PI / 12), BT, DZ)
  band(trim, ccw(circle(bcx, bcy, DR - 0.3, 12, Math.PI / 12)), DZ - 0.4, DZ, 0.3)
  lathe(roof, bcx, bcy, [[DR, DZ], [DR * 0.98, DZ + DH * 0.3], [DR * 0.85, DZ + DH * 0.62], [DR * 0.55, DZ + DH * 0.88], [2.6, DZ + DH]], 12)
  capPoly(roof, circle(bcx, bcy, 2.6, 12), DZ + DH)
  // four gilt clocks on the drum and the dome's foot, one on each axis
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    const cx = bcx + dx * (DR - 0.4), cy = bcy + dy * (DR - 0.4), hw = 1.6, t = 0.5
    const r: XY[] = dx === 0 ? rect(cx - hw, cy - t, cx + hw, cy + t) : rect(cx - t, cy - hw, cx + t, cy + hw)
    slab(gold, r, BT + 0.6, DZ + 2.4)
    pyramid(gold, r, DZ + 2.4, [cx, cy, DZ + 3.3])
  }
  // the crown: a gilt lantern, crown band, orb and the flagpole to 47 m
  const CZ = DZ + DH - 0.1
  lathe(gold, bcx, bcy, [[2.6, CZ], [2.8, CZ + 0.8], [1.8, CZ + 1.8], [2.1, CZ + 2.6], [0.7, CZ + 4.0], [0.75, CZ + 4.5], [0, CZ + 5.4]], 8)
  lathe(gold, bcx, bcy, [[0.2, CZ + 5.0], [0.12, 47.0], [0, 47.05]], 6)

  // ------------------------------------------------------------ west wing
  // Lower (15.5 m, roofs to 18), round a courtyard; yellow like the front.
  const WW: XY[] = [[-55.3, Nr], [-23.9, Nr], [-24.0, -25], [-38.2, -25], [-38.6, 16.9], [-40.3, 32.0], [-57.4, 33.1], [-57.4, 15.7], [-60.5, 15.7], [-60.5, -18.8], [-55.3, -18.8]]
  slab(yellow, WW, 0, 15.5, null)
  band(trim, WW, 15.0, 15.5, 0.3)
  const wwRows: Row[] = [
    { z0: 2.4, z1: 5.6, w: 2.0, head: 'rect', frame: 0.3 },
    { z0: 8.2, z1: 12.2, w: 2.0, head: 'rect', frame: 0.3, ped: 'tri', pedH: 1.0 },
  ]
  bayWall({ win, trim, a: [-60.5, 15.7], b: [-60.5, -18.8], bays: 8, rows: wwRows, pil: [0.5, 14.6, 0.8] })
  bayWall({ win, trim, a: [-57.4, 33.1], b: [-57.4, 15.7], bays: 4, rows: wwRows, pil: [0.5, 14.6, 0.8] })
  const wwPlain: Row[] = wwRows.map((r) => ({ z0: r.z0, z1: r.z1, w: r.w, head: 'rect' }))
  bayWall({ win, trim, a: [-55.3, -18.8], b: [-55.3, Nr], bays: 3, rows: wwRows })
  bayWall({ win, trim, a: [-24.0, -25], b: [-38.2, -25], bays: 3, rows: wwPlain })
  bayWall({ win, trim, a: [-38.2, -25], b: [-38.6, 16.9], bays: 9, rows: wwPlain })
  hipRing(roof, rect(-60.5, -18.8, -38.4, 33.0), 15.5, 2.5, 10.6)
  hipRing(roof, rect(-55.3, Nr, -24.0, -25.0), 15.5, 2.5, 4.4)

  // ------------------------------------------------------------ inner blocks
  // Between St George's Hall and the Terem (OSM 3049135, 3049137, 16461413,
  // 3049145): hipped blocks at OSM's heights.
  slab(yellow, rect(8.1, Nr, 22.4, -7.6), 0, 16, null)
  hipRing(roof, rect(8.1, Nr, 22.4, -7.6), 16, 4, 6.6)
  bayWall({ win, trim, a: [8.1, -7.6], b: [8.1, -25], bays: 4, rows: plain.slice(0, 2) })
  slab(yellow, rect(8.0, 8.8, 23.3, 29.7), 0, 15, roof)
  slab(yellow, rect(23.3, 3.9, 39.4, 28.9), 0, 23, null)
  hipRing(roof, rect(23.3, 3.9, 39.4, 28.9), 23, 3, 7.5)
  slab(yellow, rect(39.3, 1.7, 50.4, 28.8), 0, 25, null)
  hipRing(roof, rect(39.3, 1.7, 50.4, 28.8), 25, 3.6, 5.2)
  // Vladimir Hall: an octagon under a green dome and a small lantern.
  const vcx = 16.35, vcy = 0.6, vr = 8.4
  const oct = circle(vcx, vcy, vr, 8, Math.PI / 8)
  slab(yellow, oct, 0, 27, null)
  band(trim, oct, 26.5, 27, 0.25)
  lathe(roof, vcx, vcy, [[vr + 0.3, 27], [vr * 0.85, 29.6], [vr * 0.5, 31.4], [1.6, 32.2]], 8, Math.PI / 8)
  capPoly(roof, circle(vcx, vcy, 1.6, 8, Math.PI / 8), 32.2)
  drum(trim, vcx, vcy, 1.4, 32.2, 33.6, 8)
  lathe(roof, vcx, vcy, [[1.6, 33.6], [1.0, 34.3], [0, 34.7]], 8)

  // ------------------------------------------------------------ north range and Terem
  // The north range (3049124), red with white trim (clarke 05), two storeys.
  const NR0 = 31.5, NR1 = 49.8, NX0 = -57.4, NX1 = 20.0
  const north: XY[] = [[NX0, 33.1], [-40.3, 32.0], [-3.7, 30.3], [8.0, 29.7], [NX1, 29.2], [NX1, 44.3], [17.5, 44.5], [17.6, NR1], [-39.4, 51.5], [-55.5, 51.0]]
  slab(red, north, 0, 23, null)
  band(trim, north, 22.5, 23, 0.3)
  band(trim, north, 10.6, 11.1, 0.2)
  const redRows: Row[] = [
    { z0: 4.4, z1: 8.4, w: 1.9, head: 'rect', frame: 0.3, ped: 'tri', pedH: 0.9 },
    { z0: 13.4, z1: 18.6, w: 2.1, head: 'round', frame: 0.35 },
  ]
  bayWall({ win, trim, a: [17.6, NR1], b: [-39.4, 51.5], bays: 12, rows: redRows, pil: [0, 22.5, 0.9] })
  bayWall({ win, trim, a: [-39.4, 51.5], b: [-55.5, 51.0], bays: 3, rows: redRows, pil: [0, 22.5, 0.9] })
  bayWall({ win, trim, a: [-40.3, 32.0], b: [-3.7, 30.3], bays: 8, rows: redRows.map((r) => ({ z0: r.z0, z1: r.z1, w: r.w, head: 'rect' })) })
  hipRing(roof, rect(-56.4, 32.6, 19.0, 50.4), 23, 2.2, 8.0)
  // Terem upper storeys (3049133) and the Teremok (3049129).
  slab(red, rect(-12.3, 33.6, 20.0, 45.4), 23, 31, roof)
  band(trim, rect(-12.3, 33.6, 20.0, 45.4), 30.5, 31, 0.25)
  bayWall({ win, trim, a: [-12.3, 33.6], b: [20.0, 33.6], bays: 7, rows: [{ z0: 25, z1: 28.8, w: 1.7, head: 'rect' }] })
  bayWall({ win, trim, a: [20.0, 45.4], b: [-12.3, 45.4], bays: 7, rows: [{ z0: 25, z1: 28.8, w: 1.7, head: 'rect' }] })
  slab(red, rect(-4.7, 34.4, 12.6, 44.4), 31, 36.4, null)
  bayWall({ win, trim, a: [-4.7, 34.4], b: [12.6, 34.4], bays: 4, rows: [{ z0: 32.2, z1: 35.4, w: 1.4, head: 'round' }] })
  bayWall({ win, trim, a: [12.6, 44.4], b: [-4.7, 44.4], bays: 4, rows: [{ z0: 32.2, z1: 35.4, w: 1.4, head: 'round' }] })
  hipRing(red, rect(-4.7, 34.4, 12.6, 44.4), 36.4, 5.0, 4.9, 0.3)
  // The tented tower beside it (3049136): to 34 m, a green tent to 41.5 m.
  slab(yellow, rect(11.2, 43.8, 17.6, 49.6), 23, 34, null)
  pyramid(roof, rect(10.9, 43.5, 17.9, 49.9), 34, [14.4, 46.7, 41.5])

  // ------------------------------------------------------------ Upper Saviour Cathedral and the Terem domes
  // The block east of the Terem (3049146) at 20 m, the cathedral (7679714)
  // to 23 m, and the eleven domes on drums (Láscar, Ludvig14).
  const east: XY[] = [[20.0, 29.0], [45.5, 28.8], [45.8, 33.0], [53.7, 32.4], [54.4, 43.1], [60.5, 42.9], [60.5, 57.1], [58.2, 59.1], [39.5, 59.7], [38.6, 44.8], [20.0, 45.3]]
  slab(yellow, east, 0, 20, roof)
  band(trim, east, 19.5, 20, 0.25)
  bayWall({ win, trim, a: [58.2, 59.1], b: [39.5, 59.7], bays: 4, rows: redRows })
  const usc = rect(38.6, 30.4, 47.4, 56.6)
  slab(trim, usc, 19.5, 23, null)
  band(red, usc, 21.6, 23, 0.25)
  hipRing(roof, usc, 23, 1.2, 3.6, 0.2)
  bayWall({ win, trim, a: [47.4, 30.4], b: [47.4, 56.6], bays: 6, rows: [{ z0: 20.2, z1: 21.4, w: 1.2, head: 'round' }] })
  const domes: [number, number, boolean][] = [
    [41.7, 36.6, true], [42.2, 43.8, true], [42.7, 50.9, true],
    [39.7, 33.7, false], [43.6, 33.4, false], [39.9, 40.6, false], [44.2, 39.9, false],
    [40.1, 47.5, false], [44.9, 47.2, false], [40.6, 54.0, false], [45.2, 53.8, false],
  ]
  for (const [x, y, big] of domes) {
    const rd = big ? 1.45 : 0.95, ro = big ? 2.1 : 1.4, k = big ? 1.15 : 0.82, n = big ? 8 : 6
    const zd = 23.6 + (big ? 3.6 : 2.8)
    drum(red, x, y, rd, 22.9, zd, n, false)
    lathe(gold, x, y, [[rd * 1.05, zd - 0.05], [ro, zd + 0.95 * k], [ro * 0.82, zd + 1.9 * k], [ro * 0.3, zd + 2.75 * k], [0.1, zd + 3.4 * k], [0, zd + 5.0 * k]], n)
  }

  // ------------------------------------------------------------ Nativity church
  // 3049131 to 27 m under a low green pyramid, one gold onion (16461364).
  const nat = rect(-49.0, 35.3, -38.4, 47.8)
  slab(yellow, nat, 23, 25.6, null)
  band(trim, nat, 25.2, 25.6, 0.2)
  pyramid(roof, ccw(rect(-49.3, 35.0, -38.1, 48.1)), 25.6, [-43.7, 41.5, 27.8])
  drum(trim, -43.7, 41.4, 1.25, 26.0, 30.6, 8)
  onion(gold, -43.7, 41.4, 30.5, 1.6, 4.4, 10)

  // ------------------------------------------------------------ north-west wing and gallery
  const nw: XY[] = [[-38.7, 51.4], [-28.9, 72.0], [-46.9, 80.5], [-60.3, 52.2], [-49.5, 51.4]]
  slab(yellow, nw, 0, 14, null)
  band(trim, nw, 13.6, 14, 0.25)
  hipRing(roof, nw, 14, 2.6, 7.0)
  bayWall({ win, trim, a: [-46.9, 80.5], b: [-60.3, 52.2], bays: 6, rows: wwPlain })
  bayWall({ win, trim, a: [-38.7, 51.4], b: [-28.9, 72.0], bays: 4, rows: wwPlain })
  const gal: XY[] = [[-85.2, 42.4], [-57.4, 33.1], [-55.5, 47.8], [-78.2, 54.8], [-83.6, 45.2]]
  slab(yellow, gal, 10, 23, null, yellow)
  band(trim, gal, 22.5, 23, 0.3)
  bayWall({ win, trim, a: [-85.2, 42.4], b: [-57.4, 33.1], bays: 6, rows: [{ z0: 13.5, z1: 19.5, w: 2.2, head: 'round', segs: 3 }] })
  bayWall({ win, trim, a: [-55.5, 47.8], b: [-78.2, 54.8], bays: 5, rows: [{ z0: 13.5, z1: 19.5, w: 2.2, head: 'round', segs: 3 }] })
  hipRing(roof, gal, 23, 3.0, 6.0, 0)

  // ------------------------------------------------------------ Palace of Facets and the Red Porch
  // White: the faceted east front onto Cathedral Square (Don-vip), a green
  // hipped roof, the Red Porch's stair along its south side with its gate.
  const FX0 = 50.4, FX1 = 85.2, FY0 = 1.7, FY1 = 28.7, FE = 19.5
  slab(trim, rect(FX0, FY0, FX1, FY1), 0, FE, null)
  band(trim, rect(FX0, FY0, FX1, FY1), FE - 0.5, FE, 0.35)
  band(trim, rect(FX0, FY0, FX1, FY1), 4.0, 4.5, 0.25)
  hipRing(roof, rect(FX0, FY0, FX1, FY1), FE, 5.5, 12.8)
  const facetsRows: Row[] = [
    { z0: 1.4, z1: 3.2, w: 1.4, head: 'rect' },
    { z0: 8.0, z1: 12.4, w: 2.4, head: 'rect', frame: 0.45 },
    { z0: 15.6, z1: 17.4, w: 1.2, head: 'rect' },
  ]
  bayWall({ win, trim, a: [FX1, FY0], b: [FX1, FY1], bays: 4, margin: 3.2, rows: facetsRows, skip: (k, r) => r === 2 && (k === 0 || k === 3) })
  bayWall({ win, trim, a: [FX1, FY1], b: [FX0 + 6, FY1], bays: 5, rows: facetsRows.slice(1, 2) })
  bayWall({ win, trim, a: [FX0 + 6, FY0], b: [FX1, FY0], bays: 5, rows: facetsRows.slice(1, 3) })
  // the stair: a white mass from the square (east) up to the landing at 7.5 m
  const st0 = 86.9, st1 = 57.0, sy0 = -4.6, sy1 = FY0, sz = 7.5
  const stairTop = (x: number) => x <= st1 ? sz : Math.max(1.0, sz - ((x - st1) / (st0 - st1)) * (sz - 1.0))
  // side wall (south) and the sloped top in 5 m pieces
  const xsS = [51.2, st1, 62, 67, 72, 77, 82, st0]
  for (let i = 0; i < xsS.length - 1; i++) {
    const x0 = xsS[i], x1 = xsS[i + 1], z0 = stairTop(x0), z1 = stairTop(x1)
    trim.quad([x0, sy0, 0], [x1, sy0, 0], [x1, sy0, z1], [x0, sy0, z0])
    trim.quad([x0, sy0, z0], [x1, sy0, z1], [x1, sy1, z1], [x0, sy1, z0])
  }
  trim.quad([st0, sy0, 0], [st0, sy1, 0], [st0, sy1, stairTop(st0)], [st0, sy0, stairTop(st0)])
  trim.quad([51.2, sy1, 0], [51.2, sy0, 0], [51.2, sy0, sz], [51.2, sy1, sz])
  // the gate at the foot of the stair, with its green gable
  slab(trim, rect(76.6, -8.4, 83.8, -4.6), 0, 6.2, null)
  roundPanel(win, [76.6, -8.4], [83.8, -8.4], 3.6, 3.6, 0, 4.6, 0.04, 6)
  hipRing(roof, rect(76.6, -8.4, 83.8, -4.6), 6.2, 1.6, 1.8, 0.3)

  // ------------------------------------------------------------ Deposition church
  // 7688146: a small white church at 13 m with one gold dome (estimated).
  const dep = rect(60.5, 36.6, 72.4, 54.0)
  slab(trim, dep, 0, 13.0, null)
  hipRing(roof, dep, 13.0, 2.2, 5.6)
  slab(trim, rect(72.4, 40.8, 74.4, 48.4), 0, 10.5, roof)
  drum(trim, 66.6, 45.4, 1.15, 14.6, 18.6, 8)
  onion(gold, 66.6, 45.4, 18.5, 1.45, 3.9, 10)

  return { yellow, trim, win, roof, gold, red }
}

// ===========================================================================

if (import.meta.main) {
  const { yellow, trim, win, roof, gold, red } = build()
  // Floodlight: the river front and the belvedere brightest (Delso), the
  // east front and Cathedral Square side well lit, everything else a little.
  const lit = (p: V3, n: V3): number => {
    if (n[2] > 0.7) return p[2] > 29 ? 0.5 : 0.15
    if (p[1] < -33 && n[1] < -0.5) return 1
    if (p[2] > 29) return 0.9
    if (n[0] > 0.5 && p[0] > 45) return 0.8
    return 0.35
  }
  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: yellow, material: { ...finish('gkp-yellow', 0xe8cc8a), floodlight: lit } },
    { part: trim, material: { ...finish('gkp-white', 0xf6f0e4), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('gkp-green-roof', 0x76b9a6) },
    { part: gold, material: { ...finish('gkp-gold', 0xd9b552), floodlight: (p) => (p[2] > 25 ? 0.8 : 0.3) } },
    { part: red, material: { ...finish('gkp-terem-red', 0xbd6b5e), floodlight: (p, n) => (n[2] > 0.7 ? 0.1 : 0.3) } },
  ]
  finishModel('Grand Kremlin Palace', 'moscow-grand-kremlin-palace', parts, { bearing: -13.9, osm: 'relation/225033', height: 47 }, 6500)
}
