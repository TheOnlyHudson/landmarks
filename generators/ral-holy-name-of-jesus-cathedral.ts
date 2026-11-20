/**
 * Holy Name of Jesus Cathedral, Raleigh (2015–17; O'Brien & Keane):
 * procedural, CC0-1.0.
 * bun generators/ral-holy-name-of-jesus-cathedral.ts [out.glb]
 *
 * HEADER: see the end of this comment block for sources and doubts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 346.1: the
 * OSM nave walls run at 76.1°/256.1°, so model +x is the liturgical east
 * (the apse, ENE) and the west front faces model -x. Origin: the area
 * centroid of OSM way/553750193 (-78.6700782, 35.7774533). The lead's
 * point (-78.669849, 35.777507, Wikipedia's coordinate) lies over the
 * crossing; the brief anchors at the outline's centroid.
 *
 * y = 0 is the lowest ground under the footprint. Mapterhorn (z13; z14–15
 * are missing over Raleigh) falls ~2.3 m from the west plaza to the
 * north-east corner, as photo h06 shows (the apse and north transept stand
 * on a falling lawn with a retaining wall). The west front's plaza is at
 * G = 2.0 m, and every photo-scaled or published height is measured from it;
 * the walls run on down to y = 0. Elevation 0.
 *
 * Plan (OSM way/553750193, WakeGIS-traced, in the model frame): nave
 * x -58.3 … 6, y -13.8 … 12.2 (26 m: a 15.6 m central vessel with 5.2 m
 * aisles, the split from h02 and NAIP); transepts x 5.6 … 30.4 (central
 * vessel 10.2 … 25.8) reaching y 35.0 / -33.8, their gabled central vessel
 * projecting to 37.9 / -36.3; a round apse east to x 45.3. The dome stands
 * over the crossing (x 18, y -0.8; Wikipedia: "the drum of the dome is
 * located directly above the sanctuary platform").
 * NOT in the OSM outline but in every photo and in NAIP: the campanile at the
 * west front's south-east shoulder, and the cast-stone Blessed Sacrament
 * chapel, a half-round apse on the south aisle in front of it (~5 m beyond
 * the OSM south wall). Both are modelled. The Parish Center (way/1490385686)
 * is a separate building 75 m north and is left out.
 *
 * Published (Wikipedia, "Holy Name of Jesus Cathedral (Raleigh, North
 * Carolina)", citing O'Brien & Keane and WRAL): dome with finial and cross
 * 172 ft (52.4 m); bell tower 154 ft (46.9 m) with its cross; the nave's
 * barrel vault apex 77 ft (23.5 m) inside; the west rose window 12 ft
 * (3.66 m); sixteen arched windows and paired Corinthian columns in the drum;
 * paired aisle windows and single clerestory windows, 22 bays; rose wood-mould
 * brick, cast stone on the west front and the chapel, copper roofs.
 * "Twin bell towers and a portico" in the assignment do not match the
 * building: every photo shows one campanile and a flat cast-stone
 * frontispiece with three arched doors. The model follows the photos.
 *
 * Photo-scaled (estimated) from h01, h02, h06, h08, h09, h18 against the
 * 15.6 m central vessel, the 46.9 m tower and the 52.4 m dome cross:
 * aisle eaves 10.5, lean-to top 11.9; clerestory eaves 23.3, ridge 25.4
 * (review fix: the metal roofs are low, ~15°, mostly hidden behind the walls
 * from the street in h01, h19, h20); west gable apex 28.0 (the stone-capped
 * gables stand clear of the lower roof), its stone piers 24.8;
 * stone frontispiece 14.6 (doors 6.0, entablature 7.7–8.5, upper windows
 * 9.7–12.6); rose window centre 19.0. Tower 7.6 m square (h01, h02), brick
 * shaft to 33.4 (9.4 m above the clerestory eaves in h19; 5.4 m above the
 * gable apex in the distant construction photo w, Willthacheerleader18, CC
 * BY-SA 4.0); then from h18, scaled on the shaft width: corbels and a balcony
 * 1.25 × the shaft to 34.8, balustrade to 35.9, the open belfry 5.8 m wide to
 * 40.7 (arched openings 2.4 × 4.1), entablature to 41.7, attic to 42.5, a
 * flattish lead cap 4.9 across to 44.4, cross to ~47.7 (published 46.9).
 * The review asked for the tower top level with the dome's; photos taken
 * close (h01, h20, l2) show that, but only by perspective: the tower stands
 * ~50 m nearer the camera. The far photo w puts the tower's cap ~3 m under
 * the dome shell's top, as the published 154 ft vs 172 ft do, so the model
 * keeps that relation. Dome group (h06, h08):
 * octagonal brick base to 31.1, stone colonnade 31.1–36.5 with entablature
 * and attic to 38.1, the dome (13.6 m across, rising 8.3 m: h08's profile,
 * a little over a hemisphere) to 46.4, a tapering finial to 50.0, the cross
 * to 52.4. Apse: an upper drum (radius 10.3) to the clerestory eaves under a
 * conical roof, and a lower ambulatory (radius 12.6) under a lean-to ring
 * (h06). Chapel radius 5.2, stone to 8.5, its roof to 10.5 (h10, h09).
 * The "137 ft" figure Wikipedia gives for the dome would put the shell's top
 * at 41.8 m; with the published 52.4 m cross that leaves 10.6 m for finial
 * and cross, about twice what h06 and h08 show, so the model follows the
 * photos (shell top 46.4). Doubt noted.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/ral/work/ral-holy-name-of-jesus-cathedral):
 *  h01–h10, h16–h21 "Holy Name of Jesus Cathedral - Raleigh, North Carolina
 *      NN.jpg", Farragutful, CC BY-SA 4.0: h01 from the south-west (front,
 *      tower, chapel, dome, south transept); h02, h03, h21 the west front
 *      frontal; h04 from the north-west (north clerestory, aisle); h05 north
 *      transept from the north-west; h06 from the north-east (north transept
 *      end, two-tier apse, dome); h07 frontispiece detail; h08 the dome;
 *      h09 the tower and chapel; h10 the chapel; h18 the belfry; h19, h20
 *      from the south-west.
 *  l1–l4 "Holy Name of Jesus Cathedral, Raleigh, NC (282214809 28, …1128,
 *      …1378, …1698).jpg", Warren LeMay, CC0: from the south-west.
 *  s1 "Holy Name of Jesus Cathedral.jpg", Dennis Ludlow (Sharkshock),
 *      CC BY-SA 4.0: south side, tower, dome.
 *  n1 "Holy Name of Jesus Church at sunrise.png", MadeYourReadThis,
 *      CC BY-SA 4.0: dusk from the north-west: drum windows and belfry lit.
 * Aerial: USGS NAIP (public domain): the cross plan, aisles, the dome over
 * the crossing, the tower's round cap at the front's south-east shoulder,
 * the chapel's half-round south of it, dark roofs.
 * No lidar covers Wake County (3DEP), and no Mapillary token here.
 *
 * Left out: dentils and modillions, the drum's ribs and the dome's standing
 * seams, the belfry balusters (drawn as a solid parapet), steps, lamps, the
 * statue and urns on the plaza, the walled mechanical yards east of the
 * transepts (open-topped screens in NAIP, not in OSM), the flag finial on
 * the tower. Invented: nothing; doors on the transept ends follow h06.
 * Doubts: the east side of the south transept and the apse's south half are
 * seen only far off (h01, l1–l4) and drawn mirrored from the north; bay
 * counts are simplified (7 nave bays, 3 per transept arm); window sizes are
 * estimated; the aisle widths.
 * Brick 0xbd8a68: the warm brown-tan of h19, h20 and s1 in sun, pulled to
 * the palette's lightness (was an orange-red 0xbb7458).
 * Night: windows (aisles, clerestory, drum, belfry openings, rose windows)
 * are `window`, as n1 shows them lit; no floodlighting is evident.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, flatShape, extrudeShape, capRing, lathe, disc, arc, archShape, ccw, triangulate, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO, panel } from './nash-tennessee-state-capitol'

// ============================================================ shared kit (also used by ral-christ-church, ral-sacred-heart-cathedral)

/** A prism whose (y, z) section is extruded along x from x0 to x1, ends capped. */
export function prismX(p: Part, x0: number, x1: number, sec: XY[], ends = true) {
  const s = ccw(sec) // counter-clockwise in (y, z)
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = s[(i + 1) % s.length]
    const out: V3 = [0, b[1] - a[1], -(b[0] - a[0])]
    quadO(p, [x0, a[0], a[1]], [x0, b[0], b[1]], [x1, b[0], b[1]], [x1, a[0], a[1]], out)
  }
  if (!ends) return
  for (const [i, j, k] of triangulate(s)) {
    triO(p, [x1, s[i][0], s[i][1]], [x1, s[j][0], s[j][1]], [x1, s[k][0], s[k][1]], [1, 0, 0])
    triO(p, [x0, s[i][0], s[i][1]], [x0, s[j][0], s[j][1]], [x0, s[k][0], s[k][1]], [-1, 0, 0])
  }
}
/** A prism whose (x, z) section is extruded along y from y0 to y1, ends capped. */
export function prismY(p: Part, y0: number, y1: number, sec: XY[], ends = true) {
  const s = ccw(sec)
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = s[(i + 1) % s.length]
    const out: V3 = [b[1] - a[1], 0, -(b[0] - a[0])]
    quadO(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], out)
  }
  if (!ends) return
  for (const [i, j, k] of triangulate(s)) {
    triO(p, [s[i][0], y1, s[i][1]], [s[j][0], y1, s[j][1]], [s[k][0], y1, s[k][1]], [0, 1, 0])
    triO(p, [s[i][0], y0, s[i][1]], [s[j][0], y0, s[j][1]], [s[k][0], y0, s[k][1]], [0, -1, 0])
  }
}
/** A gable roof running along x (ridge at y = yc), eaves at ±hw with an overhang `ov`, a slab `t` thick. */
export function roofX(p: Part, x0: number, x1: number, yc: number, hw: number, ze: number, zr: number, ov = 0.4, t = 0.25) {
  const k = (zr - ze) / hw
  prismX(p, x0, x1, [[yc - hw - ov, ze - ov * k], [yc, zr], [yc + hw + ov, ze - ov * k], [yc + hw + ov, ze - ov * k - t], [yc, zr - t], [yc - hw - ov, ze - ov * k - t]])
}
export function roofY(p: Part, y0: number, y1: number, xc: number, hw: number, ze: number, zr: number, ov = 0.4, t = 0.25) {
  const k = (zr - ze) / hw
  prismY(p, y0, y1, [[xc - hw - ov, ze - ov * k], [xc, zr], [xc + hw + ov, ze - ov * k], [xc + hw + ov, ze - ov * k - t], [xc, zr - t], [xc - hw - ov, ze - ov * k - t]])
}
/** An oriented bar from a to b: `hw` half-width horizontally across it, `h0..h1` below/above the line. */
export function beam(p: Part, a: V3, b: V3, hw: number, h0: number, h1: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(d[0], d[1]) || 1
  const s: V3 = [(-d[1] / l) * hw, (d[0] / l) * hw, 0]
  const P = (q: V3, u: number, v: number): V3 => [q[0] + s[0] * u, q[1] + s[1] * u, q[2] + v]
  const ring = (q: V3) => [P(q, -1, h0), P(q, 1, h0), P(q, 1, h1), P(q, -1, h1)]
  const A = ring(a), B = ring(b)
  const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 + (h0 + h1) / 2]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [0, 1, 2].map((k) => (A[i][k] + A[j][k] + B[i][k] + B[j][k]) / 4 - c[k]) as V3
    quadO(p, A[i], A[j], B[j], B[i], m)
  }
  quadO(p, A[0], A[1], A[2], A[3], [-d[0], -d[1], -d[2]])
  quadO(p, B[0], B[1], B[2], B[3], d)
}
/** An arch-headed window or door on a face: w wide, sill z0, crown z1 (semicircular head). */
export function archWin(p: Part, f: Face, s: number, w: number, z0: number, z1: number, d = 0.06, segs = 6) {
  flatShape(p, f, archShape(s, w, z0, z1 - w / 2, segs), d)
}
/** A round window: a disc on a face. */
export function roundWin(p: Part, f: Face, s: number, zc: number, r: number, d = 0.06, segs = 16) {
  flatShape(p, f, arc(s, zc, r, 0, 360, segs).slice(0, -1), d)
}
/** A lathed half (a0..a1 degrees) or full ring of profile, plus faces on facets for openings. */
export function facets(cx: number, cy: number, r: number, a0: number, a1: number, n: number): Face[] {
  const out: Face[] = []
  for (let k = 0; k < n; k++) {
    const a = ((a0 + ((a1 - a0) * (k + 0.5)) / n) * Math.PI) / 180
    out.push({ o: [cx + r * Math.cos(a), cy + r * Math.sin(a), 0], n: [Math.cos(a), Math.sin(a)] })
  }
  return out
}
/** A latin cross standing at (x, y, z): shaft h tall, arm span `arm`, bar thickness t. */
export function cross(p: Part, x: number, y: number, z: number, h: number, arm: number, t: number, alongX = false) {
  box(p, x - t / 2, y - t / 2, x + t / 2, y + t / 2, z, z + h)
  const za = z + h * 0.62
  if (alongX) box(p, x - arm / 2, y - t / 2, x + arm / 2, y + t / 2, za, za + t)
  else box(p, x - t / 2, y - arm / 2, x + t / 2, y + arm / 2, za, za + t)
}

// ============================================================ dimensions
const G = 2.0 // the west plaza above the lowest ground
const YC = -0.8, HW = 7.8 // central vessel axis and half width
const YS = -13.8, YN = 12.2 // aisle outer walls (OSM)
const XF = -58.3 // west front
const TX = 18.0 // transept axis
const TXW = TX - HW, TXE = TX + HW // 10.2, 25.8
const TAW = 5.6, TAE = 30.4 // transept aisle walls
const TN_A = 35.0, TN_C = 37.9, TS_A = -33.8, TS_C = -36.3 // transept ends
const EA = G + 10.5, EAI = G + 11.9 // aisle eaves, lean-to top (~15°)
const EN = G + 23.3, RN = G + 25.4 // clerestory eaves, ridge (~15°, h01, h20)
const GA = G + 27.0 // the stone-capped gable fronts' apex line (photo-scaled), above the roof
const APX = 30.4 // apse springing line

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ============================================================ nave
  // central vessel, running on through the crossing
  prismX(brick, XF, TXE, [[YC - HW, 0], [YC + HW, 0], [YC + HW, EN], [YC - HW, EN]])
  roofX(roof, XF + 0.9, TXW + 0.5, YC, HW, EN, RN)
  // aisles with lean-to roofs (north and south)
  for (const [yo, yi] of [[YS, YC - HW], [YN, YC + HW]]) {
    const dir = Math.sign(yo - yi)
    prismX(brick, XF, TXW, [[yo, 0], [yi, 0], [yi, EAI], [yo, EA]])
    const ov = 0.4, k = (EAI - EA) / Math.abs(yo - yi), r = 0.15
    prismX(roof, XF, TXW, [[yo + dir * ov, EA - ov * k + r], [yi, EAI + r], [yi, EAI - 0.25 + r], [yo + dir * ov, EA - ov * k - 0.25 + r]])
  }

  // ============================================================ transepts
  prismY(brick, TS_C, TN_C, [[TXW, 0], [TXE, 0], [TXE, EN], [TXW, EN]])
  roofY(roof, TS_C + 0.9, TN_C - 0.9, TX, HW, EN, RN)
  for (const [xo, xi] of [[TAW, TXW], [TAE, TXE]]) {
    const dir = Math.sign(xo - xi), ov = 0.4, k = (EAI - EA) / Math.abs(xo - xi)
    for (const [y0, y1] of [[TS_A, YS], [YN, TN_A]]) {
      prismY(brick, y0, y1, [[xo, 0], [xi, 0], [xi, EAI], [xo, EA]])
      prismY(roof, y0, y1, [[xo + dir * ov, EA - ov * k + 0.15], [xi, EAI + 0.15], [xi, EAI - 0.1], [xo + dir * ov, EA - ov * k - 0.1]])
    }
  }
  // east aisle of the transepts runs across the crossing behind the apse
  prismY(brick, YS, YN, [[TXE, 0], [TAE, 0], [TAE, EA], [TXE, EAI]])

  // ============================================================ gabled fronts: west, north, south
  // a gable front on face f (s across, ±HW), its wall plane; builds gable, piers, cornices, rose
  const front = (f: Face, ground: number, rose: number, roseR: number) => {
    const P = (s: number, z: number, d = 0): V3 => {
      const t: XY = [-f.n[1], f.n[0]]
      return [f.o[0] + t[0] * s + f.n[0] * d, f.o[1] + t[1] * s + f.n[1] * d, z]
    }
    // gable: a 1 m slab of brick rising over the roof
    const apex = GA + 1.0, eave = EN + 0.6
    extrudeShape(brick, f, [[-HW, EN - 2], [HW, EN - 2], [HW, eave], [0, apex], [-HW, eave]], -1.0, 0)
    // stone piers at the corners of the central vessel
    for (const sg of [-1, 1]) {
      const s0 = sg * HW, s1 = sg * (HW - 1.8)
      extrudeShape(stone, f, [[Math.min(s0, s1), 0], [Math.max(s0, s1), 0], [Math.max(s0, s1), G + 24.8], [Math.min(s0, s1), G + 24.8]], -0.2, 0.6)
      // the pier's top
      const a = P(Math.min(s0, s1), G + 24.8, -0.2), b = P(Math.max(s0, s1), G + 24.8, -0.2), c = P(Math.max(s0, s1), G + 24.8, 0.6), d = P(Math.min(s0, s1), G + 24.8, 0.6)
      quadO(stone, a, b, c, d, [0, 0, 1])
    }
    // horizontal cornice between the piers and the raking cornice
    extrudeShape(stone, f, [[-HW + 1.8, eave - 0.7], [HW - 1.8, eave - 0.7], [HW - 1.8, eave], [-HW + 1.8, eave]], 0, 0.45)
    {
      const a = P(-HW + 1.8, eave, 0), b = P(HW - 1.8, eave, 0), c = P(HW - 1.8, eave, 0.45), d = P(-HW + 1.8, eave, 0.45)
      quadO(stone, a, b, c, d, [0, 0, 1])
    }
    const zAt = (s: number) => eave + (apex - eave) * (1 - Math.abs(s) / HW)
    for (const sg of [-1, 1]) {
      const sA = sg * (HW - 1.0), sB = 0
      beam(stone, P(sA, zAt(sA), 0.1), P(sB, apex, 0.1), 0.35, -0.75, 0.05)
    }
    // rose window in a stone ring
    roundWin(stone, f, 0, rose, roseR + 0.55, 0.08, 16)
    roundWin(win, f, 0, rose, roseR, 0.14, 16)
    // a stone cross on the apex
    const ap = P(0, apex, -0.5)
    const alongX = Math.abs(f.n[1]) > 0.5
    cross(stone, ap[0], ap[1], apex - 0.2, 2.6, 1.5, 0.34, alongX)
    return P
  }

  // --- west front: the cast-stone frontispiece
  {
    const f: Face = { o: [XF, YC, 0], n: [-1, 0] }
    front(f, G, G + 19.0, 1.83)
    // the stone frontispiece between the piers, standing 0.3 proud
    const W = HW - 1.8
    extrudeShape(stone, f, [[-W, 0], [W, 0], [W, G + 14.6], [-W, G + 14.6]], 0, 0.3)
    const fp: Face = { o: [XF - 0.3, YC, 0], n: [-1, 0] }
    // cornice and the entablature between the tiers
    extrudeShape(stone, fp, [[-W, G + 14.0], [W, G + 14.0], [W, G + 14.6], [-W, G + 14.6]], 0, 0.35)
    extrudeShape(stone, fp, [[-W, G + 7.7], [W, G + 7.7], [W, G + 8.5], [-W, G + 8.5]], 0, 0.3)
    // pilasters between the bays
    for (const s of [-5.1, -1.7, 1.7, 5.1]) extrudeShape(stone, fp, [[s - 0.35, G], [s + 0.35, G], [s + 0.35, G + 14.0], [s - 0.35, G + 14.0]], 0, 0.18)
    // three arched doors, three arched windows above
    for (const s of [-3.4, 0, 3.4]) {
      archWin(stone, fp, s, 3.1, G, G + 6.55, 0.08)
      archWin(door, fp, s, 2.5, G, G + 6.0, 0.14)
      archWin(win, fp, s, 1.3, G + 9.7, G + 12.6, 0.08)
    }
    // aisle fronts: plain brick; one small arched window in the north one (h03)
    for (const s of [-10.4, 10.4]) archWin(win, { o: [XF, YC, 0], n: [-1, 0] }, s, 1.2, G + 3.0, G + 7.0)
  }
  // --- transept ends: brick, stone piers and bands, rose, a row of windows, a door
  for (const sg of [1, -1]) {
    const yE = sg > 0 ? TN_C : TS_C
    const f: Face = { o: [TX, yE, 0], n: [0, sg] }
    // the slab front is drawn by the front() gable; its wall face is the transept's own end
    front({ o: [TX, yE, 0], n: [0, sg] }, G, G + 19.3, 1.8)
    const W = HW - 1.8
    for (const z of [G + 7.6, G + 13.0]) extrudeShape(stone, f, [[-W, z], [W, z], [W, z + 0.5], [-W, z + 0.5]], 0, 0.15)
    for (const s of [-3.0, -1.0, 1.0, 3.0]) archWin(win, f, s, 1.0, G + 9.2, G + 12.2)
    for (const s of [-4.6, 4.6]) archWin(win, f, s, 1.3, G + 2.5, G + 6.6)
    archWin(stone, f, 0, 2.7, G - 0.6, G + 5.2, 0.08)
    archWin(door, f, 0, 2.1, G - 0.6, G + 4.8, 0.14)
  }

  // ============================================================ windows on the sides
  // nave: paired aisle windows and a single clerestory window per bay
  const naveBays = [-47.5, -40.5, -33.5, -26.5, -19.5, -12.5, -5.5, 1.0]
  for (const sg of [1, -1]) {
    const fa: Face = { o: [0, sg > 0 ? YN : YS, 0], n: [0, sg] }
    const fc: Face = { o: [0, YC + sg * HW, 0], n: [0, sg] }
    for (const x of naveBays) {
      const s = -x * sg // s runs along -x on the north face
      if (!(sg < 0 && x < -42)) for (const ds of [-0.95, 0.95]) archWin(win, fa, s + ds, 1.1, G + 2.6, G + 7.6)
      if (!(sg < 0 && x < -43)) archWin(win, fc, s, 1.7, G + 14.4, G + 20.2)
      // brick pilasters between the clerestory bays
      extrudeShape(brick, fc, [[s + 3.5 - 0.45, EAI], [s + 3.5 + 0.45, EAI], [s + 3.5 + 0.45, EN], [s + 3.5 - 0.45, EN]], 0, 0.25)
    }
  }
  // transept arms: three bays each side of each arm
  for (const sg of [1, -1]) {
    const ys = sg > 0 ? [17.5, 24.0, 30.5] : [-17.5, -23.5, -29.5]
    for (const [xo, xc, n] of [[TAW, TXW, -1], [TAE, TXE, 1]] as [number, number, number][]) {
      const fa: Face = { o: [xo, 0, 0], n: [n, 0] }, fc: Face = { o: [xc, 0, 0], n: [n, 0] }
      for (const y of ys) {
        const s = y * n
        for (const ds of [-0.95, 0.95]) archWin(win, fa, s + ds, 1.1, G + 2.6, G + 7.6)
        archWin(win, fc, s, 1.7, G + 14.4, G + 20.2)
      }
    }
  }

  // ============================================================ apse: lower ambulatory and the upper drum
  {
    const RA = 12.6, RU = 10.3, X2 = APX + 2.1
    // ambulatory: straight piece then a half-round
    prismX(brick, APX, X2, [[YC - RA, 0], [YC + RA, 0], [YC + RA, EA], [YC - RA, EA]])
    lathe(brick, X2, YC, [[RA, 0], [RA, EA]], 12, -90, 90)
    lathe(roof, X2, YC, [[RA + 0.4, EA - 0.2], [RU, EAI + 0.2]], 12, -90, 90)
    prismX(roof, APX, X2, [[YC - RA - 0.4, EA - 0.2], [YC - RU, EAI + 0.2], [YC - RU, EAI - 0.05]])
    prismX(roof, APX, X2, [[YC + RU, EAI + 0.2], [YC + RA + 0.4, EA - 0.2], [YC + RU, EAI - 0.05]])
    // upper drum
    prismX(brick, TXE, X2, [[YC - RU, 0], [YC + RU, 0], [YC + RU, EN], [YC - RU, EN]])
    lathe(brick, X2, YC, [[RU, EAI - 0.5], [RU, EN]], 12, -90, 90)
    roofX(roof, TXE - 0.2, X2, YC, RU, EN, RN)
    lathe(roof, X2, YC, [[RU + 0.4, EN - 0.4 * (RN - EN) / RU], [0, RN]], 14, -90, 90)
    // small arched windows round the ambulatory, blind upper drum
    for (const f of facets(X2, YC, RA, -90, 90, 12)) {
      const ff: Face = { o: [f.o[0] - f.n[0] * (RA - RA * Math.cos(Math.PI / 12)), f.o[1] - f.n[1] * (RA - RA * Math.cos(Math.PI / 12)), 0], n: f.n }
      archWin(win, ff, 0, 1.0, G + 1.8, G + 5.0)
    }
    for (const f of facets(X2, YC, RU, -90, 90, 12)) {
      const ff: Face = { o: [f.o[0] - f.n[0] * (RU - RU * Math.cos(Math.PI / 12)), f.o[1] - f.n[1] * (RU - RU * Math.cos(Math.PI / 12)), 0], n: f.n }
      archWin(brick, ff, 0, 1.5, G + 14.6, G + 20.0, 0.12)
    }
  }

  // ============================================================ the dome over the crossing
  {
    const cx = TX, cy = YC
    const oct = (a: number): XY[] => Array.from({ length: 8 }, (_, k) => {
      const t = ((k + 0.5) / 8) * 2 * Math.PI, r = a / Math.cos(Math.PI / 8)
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY
    })
    const B = G + 31.1
    prism(brick, null, oct(8.2), EN - 1, B - 0.7)
    prism(stone, stone, oct(8.6), B - 0.7, B)
    capRing(stone, oct(8.6), B - 0.7, false)
    // the colonnaded drum: a stone wall with sixteen arched windows, paired columns
    lathe(stone, cx, cy, [[6.9, B], [6.9, B + 5.4]], 16)
    const RW = 6.9 * Math.cos(Math.PI / 16)
    for (const f of facets(cx, cy, 6.9, 0, 360, 16)) {
      const ff: Face = { o: [cx + f.n[0] * RW, cy + f.n[1] * RW, 0], n: f.n }
      archWin(win, ff, 0, 1.15, B + 1.0, B + 4.5)
    }
    for (let k = 0; k < 16; k++) {
      for (const da of [-3.2, 3.2]) {
        const a = ((k * 22.5 + da) * Math.PI) / 180
        const x = cx + 7.35 * Math.cos(a), y = cy + 7.35 * Math.sin(a)
        lathe(stone, x, y, [[0.3, B], [0.3, B + 5.4]], 6)
      }
    }
    // entablature, attic, dome, finial
    const D0 = B + 7.0
    const prof: [number, number][] = [[6.9, B + 5.4], [7.8, B + 5.4], [7.8, B + 6.2], [7.15, B + 6.2], [7.15, D0]]
    lathe(stone, cx, cy, prof, 24)
    disc(stone, cx, cy, 7.15, D0 - 0.01, 24, true)
    const dome: [number, number][] = []
    for (let k = 0; k <= 8; k++) {
      const t = (k / 8) * (Math.PI / 2) * 0.93
      dome.push([6.8 * Math.cos(t), D0 + 8.3 * Math.sin(t)])
    }
    const top = D0 + 8.3
    dome.push([0.75, top - 0.05])
    lathe(roof, cx, cy, [[7.15, D0], ...dome], 24)
    lathe(roof, cx, cy, [[0.75, top - 0.05], [0.95, top + 0.5], [0.55, top + 1.0], [0.3, top + 3.0], [0.42, top + 3.25], [0, top + 3.6]], 8)
    cross(roof, cx, cy, top + 3.5, 2.5, 1.4, 0.26, false)
  }

  // ============================================================ the campanile
  // Stack from h18 (scaled on the 7.6 m shaft) and the far construction photo
  // (w): shaft to S, corbel course and balcony slab, a balustrade round the
  // belfry's foot, the open belfry (5.8 m wide, tall arched openings, corner
  // columns), entablature, attic, a flattish lead cap, a tall cross.
  {
    const x0 = -52.0, x1 = -44.4, y0 = -13.6, y1 = -6.0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    const S = G + 33.4
    box(brick, x0, y0, x1, y1, 0, S, null)
    // two small windows up the shaft (h01, h20)
    for (const f of [{ o: [cx, y0, 0], n: [0, -1] }, { o: [x0, cy, 0], n: [-1, 0] }, { o: [cx, y1, 0], n: [0, 1] }, { o: [x1, cy, 0], n: [1, 0] }] as Face[]) {
      archWin(win, f, 0, 0.9, S - 5.8, S - 3.6)
      archWin(win, f, 0, 0.9, S - 15.5, S - 13.6)
    }
    // corbel course, then the balcony slab (1.25 × the shaft, h18)
    box(stone, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, S - 0.9, S + 0.6, null)
    box(stone, x0 - 0.95, y0 - 0.95, x1 + 0.95, y1 + 0.95, S + 0.6, S + 1.4)
    // the balustrade as a parapet ring on the balcony's edge
    {
      const o = 0.85, t = 0.3, z0 = S + 1.4, z1 = S + 2.5
      for (const [a, b, c, d] of [[x0 - o, y0 - o, x1 + o, y0 - o + t], [x0 - o, y1 + o - t, x1 + o, y1 + o], [x0 - o, y0 - o + t, x0 - o + t, y1 + o - t], [x1 + o - t, y0 - o + t, x1 + o, y1 + o - t]]) box(stone, a, b, c, d, z0, z1, stone)
    }
    // the white belfry: a tall arched opening on each face, corner columns
    const bh = 2.9, B0 = S + 1.4, B1 = S + 7.3
    box(stone, cx - bh, cy - bh, cx + bh, cy + bh, B0, B1, null)
    for (const f of [{ o: [cx, cy - bh, 0], n: [0, -1] }, { o: [cx - bh, cy, 0], n: [-1, 0] }, { o: [cx, cy + bh, 0], n: [0, 1] }, { o: [cx + bh, cy, 0], n: [1, 0] }] as Face[]) {
      archWin(win, f, 0, 2.4, S + 2.5, S + 6.6, 0.06, 8)
    }
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) lathe(stone, cx + sx * (bh + 0.05), cy + sy * (bh + 0.05), [[0.42, B0], [0.42, B1]], 8)
    // entablature and cornice, then the attic
    box(stone, cx - bh - 0.6, cy - bh - 0.6, cx + bh + 0.6, cy + bh + 0.6, B1, B1 + 1.0)
    box(stone, cx - 2.6, cy - 2.6, cx + 2.6, cy + 2.6, B1 + 1.0, B1 + 1.8)
    // the lead cap dome (4.8 m across, 1.9 m high: h18) and the cross
    const C0 = B1 + 1.8, CH = 1.9
    const cap: [number, number][] = []
    for (let k = 0; k <= 6; k++) {
      const t = (k / 6) * (Math.PI / 2) * 0.9
      cap.push([2.45 * Math.cos(t), C0 + CH * Math.sin(t)])
    }
    cap.push([0, C0 + CH])
    lathe(roof, cx, cy, cap, 16)
    lathe(roof, cx, cy, [[0.3, C0 + CH - 0.2], [0.3, C0 + CH + 0.4], [0, C0 + CH + 0.5]], 6)
    cross(roof, cx, cy, C0 + CH + 0.4, 3.0, 1.5, 0.24, false)
  }

  // ============================================================ the Blessed Sacrament chapel (cast stone, half-round)
  {
    const cx = -46.2, cy = YS, R = 5.2
    lathe(brick, cx, cy, [[R + 0.15, 0], [R + 0.15, G + 1.4]], 10, 180, 360)
    disc(brick, cx, cy, R + 0.15, G + 1.4, 10, true)
    lathe(stone, cx, cy, [[R, G + 1.4], [R, G + 8.4], [R + 0.45, G + 8.4], [R + 0.45, G + 9.1]], 10, 180, 360)
    for (const f of facets(cx, cy, R, 180, 360, 5)) {
      const k = R * Math.cos(Math.PI / 10)
      const ff: Face = { o: [cx + f.n[0] * k, cy + f.n[1] * k, 0], n: f.n }
      archWin(win, ff, 0, 1.25, G + 2.6, G + 7.4)
    }
    for (let k = 0; k <= 5; k++) {
      const a = ((180 + k * 36) * Math.PI) / 180
      lathe(stone, cx + (R + 0.25) * Math.cos(a), cy + (R + 0.25) * Math.sin(a), [[0.3, G + 1.4], [0.3, G + 8.4]], 6)
    }
    lathe(roof, cx, cy, [[R + 0.55, G + 9.1], [0.0, G + 10.6]], 10, 180, 360)
  }

  // ============================================================ materials
  return finishGlb('Holy Name of Jesus Cathedral', [
    { part: brick, material: finish('hnj-rose-brick', 0xbd8a68) },
    { part: stone, material: finish('hnj-cast-stone', 0xe6dcc8) },
    { part: roof, material: finish('hnj-copper', 0x6c6560) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('hnj-door', 0x5e5149) },
  ], { bearing: 346.1, height: G + 52.4, replaces: ['way/553750193'] }, 6500)
}

if (import.meta.main) await writeModel('ral-holy-name-of-jesus-cathedral', build())
