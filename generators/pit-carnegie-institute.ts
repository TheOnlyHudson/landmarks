/**
 * Carnegie Institute: Carnegie Museums of Natural History and Art
 * (Longfellow, Alden & Harlow, 1895; Alden & Harlow extension 1907; Scaife
 * Gallery, Edward Larrabee Barnes, 1974), Forbes Avenue, Oakland,
 * Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-carnegie-institute.ts
 *
 * The complex is split into two placements: this one, the museums (the
 * 1907 Forbes Avenue front and its skylit halls, Natural History behind,
 * the Museum of Art and the Scaife Gallery), and
 * pit-carnegie-library-music-hall, the 1895 library and Music Hall at the
 * west end. Both are drawn in one shared frame, and this file exports the
 * frame and the helpers that pit-carnegie-library-music-hall.ts imports, so
 * merge this one first. It imports `column`/`shiftParts` from
 * pit-soldiers-and-sailors.ts and `poly`/`band`/`wallsSplit`/`arch` from
 * pit-allegheny-county-courthouse.ts.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. The shared frame is centred at
 * -79.9499408 40.4431990 and turned to 343.2°, the line of the Forbes
 * Avenue front: +y north-north-west (Forbes Avenue), -y toward the
 * Junction Hollow ravine, -x the library and Schenley Plaza, +x the
 * parking side. Each placement's anchor is the area centroid of the OSM
 * outlines it replaces; this one's, ways 154257481 and 31899525, is
 * (19.8, 8.6) in the shared frame, -79.9497464 40.4433252, and the model is
 * shifted by that much.
 *
 * Identity, in order: the long Beaux-Arts sandstone front on Forbes
 * Avenue, its central entrance portico of columns in antis under an attic
 * with bronze statue groups; the tall hipped skylit roof of the Hall of
 * Architecture rising out of the middle, the lower skylit halls around it;
 * the rows of round-arched windows over square ones; the low flat grey
 * granite Scaife Gallery to the east with its sculpture court; pale
 * weathered sandstone.
 *
 * Evidence:
 *  - plan: OSM way/154257481 (Natural History, with the Forbes front and
 *    the 2007 dinosaur halls inside it; no separate outline) and
 *    way/31899525 (Museum of Art, the Scaife Gallery and the court notch),
 *    turned into the frame. The halls inside from the lidar.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, above the ground on Forbes Avenue and Schenley Plaza (272.1 m
 *    NAVD88; the parking side is ~2 m lower, the ravine beyond much
 *    lower): Forbes front eaves 25, its roof to 29; entrance portico 20-23
 *    with the main block's attic 25-26 behind and the statue groups to
 *    27; Hall of Architecture walls ~31.5, hipped skylit roof to 41;
 *    the halls between 22-26; the rear ranges 19-25; Scaife Gallery 16-18.
 *  - published: Carnegie Institute 1895, extended 1907 (Wikipedia,
 *    "Carnegie Museums of Pittsburgh"; "Carnegie Museum of Art": Scaife
 *    Gallery 1974).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Carnegie Institute, Oakland, Pittsburgh, 2026-06-17.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Institute,_Oakland,_Pittsburgh,_2026-06-17.jpg
 *      Cbaile19, CC0 — the Forbes front and the museum portico.
 *    "Carnegie Institute, Oakland, 2023-01-11, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Institute,_Oakland,_2023-01-11,_01.jpg
 *      Cbaile19, CC0 — the Forbes front from the east.
 *    "Carnegie Museum of Natural History as seen from Cathedral of Learning.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Museum_of_Natural_History_as_seen_from_Cathedral_of_Learning.jpg
 *      Dllu, CC BY-SA 4.0 — the whole complex from above: roofs, halls,
 *      skylights, Scaife Gallery.
 *    "Carnegie Institute of Pittsburgh (2).jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Institute_of_Pittsburgh_(2).jpg
 *      Kevin Albright, CC BY-SA 3.0 — the arcaded Forbes front.
 *    "2008-05-25 Pittsburgh 130 Oakland, Carnegie Museum of Art - Museumof Natural History (2672256124).jpg"
 *      https://commons.wikimedia.org/wiki/File:2008-05-25_Pittsburgh_130_Oakland,_Carnegie_Museum_of_Art_-_Museumof_Natural_History_(2672256124).jpg
 *      Allie_Caulfield, CC BY 2.0 — the museum portico head-on.
 *    "Carnegie Music Hall Pittsburgh.JPG", "Carnegie Music Hall Pittsburgh 2.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Music_Hall_Pittsburgh.JPG
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Music_Hall_Pittsburgh_2.jpg
 *      HoboJones, CC BY-SA 3.0 — the Forbes front from the west.
 *    USGS NAIP orthophoto (public domain): roofs, skylights, the court.
 *  - colour: weathered grey-buff sandstone; grey roofs with glass
 *    skylight bands; the Scaife Gallery's grey granite; bronze statues.
 * Estimated: window rows and bay rhythm (from the photos against the
 * lidar heights), the portico's columns (four in antis), the halls' plan
 * divisions inside the outline, the skylight bands, the Scaife Gallery's
 * facades (flat granite with a glazed band; seen only from the air).
 * Doubts: the inner halls' edges are read from lidar steps, not drawings;
 * the south (ravine) side is drawn plain. The sawtooth along the Art
 * outline's Forbes edge is drawn as the outline gives it.
 *
 * Left out: carving, the inscriptions, lamps, the dinosaur statue on the
 * lawn, railings, the statue groups' figures (drawn as bold bronze masses).
 *
 * Night: the Forbes front is floodlit (stone `floodlight` on the front),
 * windows glow; skylights stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'
import { column, shiftParts } from './pit-soldiers-and-sailors'

// ---------------------------------------------------------------------------
// Shared with pit-carnegie-library-music-hall.ts

export type CParts = { stone: Part; roof: Part; glass: Part; win: Part; bronze: Part; extra: Part }
export const newParts = (): CParts => ({ stone: new Part(), roof: new Part(), glass: new Part(), win: new Part(), bronze: new Part(), extra: new Part() })

/** A flat-topped block over any ring: walls split for the terrain, roof cap. */
export function slab(P: CParts, r: XY[], z0: number, z1: number, top: Part | null = P.roof) {
  wallsSplit(P.stone, r, z0, z1, 6)
  if (top) cap(top, r, z1)
}

/** A hipped roof over a rectangle [x0,y0,x1,y1] from eave z0 to ridge z1, with skylight bands along its slopes. */
export function hippedSkylit(P: CParts, r: [number, number, number, number], z0: number, z1: number, inset: number, sky = true) {
  const [x0, y0, x1, y1] = r
  const lo: V3[] = rect(x0, y0, x1, y1).map(([x, y]) => [x, y, z0] as V3)
  const hi: V3[] = rect(x0 + inset, y0 + inset, x1 - inset, y1 - inset).map(([x, y]) => [x, y, z1] as V3)
  const nrm: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    poly(P.roof, [lo[k], lo[j], hi[j], hi[k]], [nrm[k][0], nrm[k][1], 1])
    if (sky) {
      // a glass band up the middle of each slope
      const f = (t: number, s: number): V3 => {
        const a: V3 = [lo[k][0] + (lo[j][0] - lo[k][0]) * s, lo[k][1] + (lo[j][1] - lo[k][1]) * s, z0]
        const b: V3 = [hi[k][0] + (hi[j][0] - hi[k][0]) * s, hi[k][1] + (hi[j][1] - hi[k][1]) * s, z1]
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t + 0.08]
      }
      poly(P.glass, [f(0.2, 0.25), f(0.2, 0.75), f(0.85, 0.75), f(0.85, 0.25)], [nrm[k][0], nrm[k][1], 1])
    }
  }
  cap(P.roof, rect(x0 + inset, y0 + inset, x1 - inset, y1 - inset), z1)
}

/** A hipped roof over [x0,y0,x1,y1] from eave z0 to ridge z1 (hips at 45°), with a glass lantern along the ridge. */
export function hipLantern(P: CParts, r: [number, number, number, number], z0: number, z1: number, lantern = true) {
  const [x0, y0, x1, y1] = r, alongX = x1 - x0 >= y1 - y0
  const h = Math.min(x1 - x0, y1 - y0) / 2
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = alongX ? [x0 + h, cy, z1] : [cx, y0 + h, z1], B: V3 = alongX ? [x1 - h, cy, z1] : [cx, y1 - h, z1]
  const e = (x: number, y: number): V3 => [x, y, z0]
  if (alongX) {
    poly(P.roof, [e(x0, y0), e(x1, y0), B, A], [0, -1, 1]); poly(P.roof, [e(x1, y1), e(x0, y1), A, B], [0, 1, 1])
    poly(P.roof, [e(x1, y0), e(x1, y1), B], [1, 0, 1]); poly(P.roof, [e(x0, y1), e(x0, y0), A], [-1, 0, 1])
  } else {
    poly(P.roof, [e(x1, y0), e(x1, y1), B, A], [1, 0, 1]); poly(P.roof, [e(x0, y1), e(x0, y0), A, B], [-1, 0, 1])
    poly(P.roof, [e(x0, y0), e(x1, y0), A], [0, -1, 1]); poly(P.roof, [e(x1, y1), e(x0, y1), B], [0, 1, 1])
  }
  if (lantern && Math.hypot(B[0] - A[0], B[1] - A[1]) > 4) {
    const w = 1.1, lh = 1.3
    const ux = alongX ? 1 : 0, uy = alongX ? 0 : 1
    const a0: XY = [A[0] + ux * 1.5, A[1] + uy * 1.5], b0: XY = [B[0] - ux * 1.5, B[1] - uy * 1.5]
    const q = alongX ? rect(a0[0], cy - w, b0[0], cy + w) : rect(cx - w, a0[1], cx + w, b0[1])
    walls(P.glass, q, z1 - 0.6, z1 + lh); cap(P.roof, q, z1 + lh)
  }
}

/** Skylight strips on a flat roof at z over a rectangle: n bands along x. */
export function skylights(P: CParts, r: [number, number, number, number], z: number, n: number) {
  const [x0, y0, x1, y1] = r, w = (x1 - x0) / n
  for (let i = 0; i < n; i++) {
    const a = x0 + i * w + w * 0.25, b = x0 + (i + 1) * w - w * 0.25
    const q: XY[] = rect(a, y0 + 1.5, b, y1 - 1.5)
    walls(P.glass, q, z, z + 1.0, q.map(([x, y]) => [x, y] as XY).map(([x, y], k) => [x + (k === 0 || k === 3 ? 0.8 : -0.8) * Math.sign(b - a), y] as XY))
    cap(P.glass, q.map(([x, y], k) => [x + (k === 0 || k === 3 ? 0.8 : -0.8), y] as XY), z + 1.0)
  }
}

/**
 * A Beaux-Arts wall a→b: rectangular windows in the ground storey,
 * round-arched windows above, every `pitch` m, from s0 to s1 along it.
 */
export function bays(P: CParts, a: XY, b: XY, s0: number, s1: number, pitch: number, low: [number, number] | null, high: [number, number] | null, w = 2.0) {
  const n = Math.max(1, Math.round((s1 - s0) / pitch)), p = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const s = s0 + (i + 0.5) * p
    if (low) panel(P.win, a, b, s - w / 2, s + w / 2, low[0], low[1], 0.05)
    if (high) arch(P.win, a, b, s - w / 2, s + w / 2, high[0], high[1] - w / 2, 0.05, 6)
  }
}

/**
 * A portico of columns in antis on wall a→b, centred at s, `n` columns
 * `pitch` apart, from z0 to z1, standing `d` m proud, an entablature and a
 * balustraded attic over them to `top`, square piers either side.
 */
export function portico(P: CParts, a: XY, b: XY, s: number, n: number, pitch: number, z0: number, z1: number, top: number, d: number, pierW = 3, loggia: Part = P.win) {
  const { P: at } = onWall(a, b)
  const half = (n - 1) * pitch / 2 + pitch / 2 + pierW
  const q = (ss: number, z: number, o: number) => at(ss, z, o)
  // the dark loggia behind the columns
  loggia.quad(q(s - half + pierW, z0 + 0.8, 0.05), q(s + half - pierW, z0 + 0.8, 0.05), q(s + half - pierW, z1 - 0.5, 0.05), q(s - half + pierW, z1 - 0.5, 0.05))
  for (let i = 0; i < n; i++) {
    const c = q(s - (n - 1) * pitch / 2 + i * pitch, 0, d * 0.5)
    column(P.stone, P.stone, c[0], c[1], 0.65, z0, z1, { base: 0.6, cap: 0.6, seg: 10 })
  }
  // piers, entablature, attic
  for (const sg of [-1, 1]) {
    const c0 = s + sg * (half - pierW / 2)
    const r: XY[] = [q(c0 - pierW / 2, 0, 0), q(c0 + pierW / 2, 0, 0), q(c0 + pierW / 2, 0, d), q(c0 - pierW / 2, 0, d)].map((p) => [p[0], p[1]] as XY)
    const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0 ? r : [...r].reverse()
    wallsSplit(P.stone, ccw, 0, top, 6); cap(P.stone, ccw, top)
  }
  const e: XY[] = [q(s - half, 0, 0), q(s + half, 0, 0), q(s + half, 0, d + 0.4), q(s - half, 0, d + 0.4)].map((p) => [p[0], p[1]] as XY)
  const eccw = (e[1][0] - e[0][0]) * (e[2][1] - e[0][1]) - (e[1][1] - e[0][1]) * (e[2][0] - e[0][0]) > 0 ? e : [...e].reverse()
  walls(P.stone, eccw, z1, top); cap(P.stone, eccw, top)
  cap(P.stone, eccw, z1, false)
  // the floor of the porch and its steps
  const f: XY[] = [q(s - half, 0, 0), q(s + half, 0, 0), q(s + half, 0, d), q(s - half, 0, d)].map((p) => [p[0], p[1]] as XY)
  const fccw = (f[1][0] - f[0][0]) * (f[2][1] - f[0][1]) - (f[1][1] - f[0][1]) * (f[2][0] - f[0][0]) > 0 ? f : [...f].reverse()
  wallsSplit(P.stone, fccw, 0, z0, 6); cap(P.stone, fccw, z0)
}

/** A bronze statue group: a pedestal and a bold mass, at (x, y) from z. */
export function statue(P: CParts, x: number, y: number, z: number, w = 2.4, h = 3.2) {
  walls(P.stone, rect(x - w / 2, y - w / 2, x + w / 2, y + w / 2), z, z + 0.8)
  const r = rect(x - w * 0.3, y - w * 0.3, x + w * 0.3, y + w * 0.3)
  walls(P.bronze, r, z + 0.8, z + h * 0.75)
  const t: V3 = [x, y, z + h]
  for (let i = 0; i < 4; i++) { const p = r[i], q = r[(i + 1) % 4]; poly(P.bronze, [[p[0], p[1], z + h * 0.75], [q[0], q[1], z + h * 0.75], t], [p[0] + q[0] - 2 * x, p[1] + q[1] - 2 * y, 0.6]) }
}

export const SANDSTONE = 0xbfb39f

// ---------------------------------------------------------------------------
// The museums

function build() {
  const P = newParts()

  // OSM outlines in the shared frame
  const NH: XY[] = [[-64.6, 62.4], [-63.9, 5.6], [-30.0, 6.3], [-27.6, -61.3], [-42.2, -61.3], [-41.6, -70.9], [-54.2, -71.1], [-53.5, -88.0], [-34.0, -87.8], [-32, -97], [-27, -99.3], [-19.4, -100.9], [-13.6, -100.9], [-8, -97.8], [-3, -95], [-3.9, -87.1], [13.1, -86.3], [12.9, -68.5], [0.4, -69.1], [0.4, -60.0], [29.0, -58.3], [28.0, -41.3], [18.4, -41.7], [18.1, -34.4], [20.5, -34.5], [20.5, -24.5], [19.6, -7.1], [25.5, -5.1], [24.9, 9.9], [16.8, 10.5], [16.4, 17.8], [16.9, 17.8], [16.6, 47.2], [17.2, 47.4], [15.9, 67.4], [7.9, 67.1], [8.2, 74.6], [-17.3, 73.7], [-17.0, 65.8], [-24.9, 65.5], [-25.0, 63.3]]
  const ART: XY[] = [[15.9, 67.4], [17.2, 47.4], [53.4, 49.1], [54.6, 11.0], [24.9, 9.9], [25.5, -5.1], [68.0, -4.9], [123.8, -2.5], [122.2, 38.0], [121.2, 70.5], [82.6, 69.5], [65.1, 69.0], [65.4, 59.5], [61.1, 59.2], [60.9, 69.0], [51.4, 65.9], [51.2, 68.7], [42.0, 65.4], [41.7, 68.3], [32.4, 64.9], [32.4, 67.7], [22.9, 64.6], [22.9, 67.3]]

  // ---- Natural History: the whole outline to the rear ranges' eaves, then
  // the hipped, skylit ranges and halls over it (lidar, aerial photo)
  slab(P, NH, 0, 20)
  {
    const r: [number, number, number, number] = [-64.2, 46, 16.3, 63.2] // the Forbes range
    slab(P, rect(...r), 20, 25, null)
    band(P.stone, rect(...r), grow(r, 0.5), 24.2, 25, 0.3)
    hipLantern(P, grow(r, 0.4).length ? [r[0] - 0.4, r[1] - 0.4, r[2] + 0.4, r[3] + 0.4] : r, 25, 29.5)
  }
  {
    const r: [number, number, number, number] = [-60, 10, -24, 46] // Hall of Architecture
    slab(P, rect(...r), 20, 31.5, null)
    band(P.stone, rect(...r), grow(r, 0.4), 30.8, 31.5, 0.3)
    hippedSkylit(P, [r[0] - 0.4, r[1] - 0.4, r[2] + 0.4, r[3] + 0.4], 31.5, 40, 13, false)
    const top = rect(-46.5, 23.5, -37.5, 32.5)
    walls(P.glass, top, 39.6, 41.2); cap(P.roof, top, 41.2)
  }
  const hall = (r: [number, number, number, number], eave: number, ridge: number) => {
    slab(P, rect(...r), 20, eave, null)
    band(P.stone, rect(...r), grow(r, 0.3), eave - 0.6, eave, 0.25)
    hipLantern(P, [r[0] - 0.3, r[1] - 0.3, r[2] + 0.3, r[3] + 0.3], eave, ridge)
  }
  hall([-18, 8, 12, 46], 22.5, 26.5) // Hall of Sculpture and the halls by the portico
  hall([-27, -58, 18, 6], 21, 25) // the long middle range
  hall([-64, -6, -30, 6], 21, 24.5) // the cross range behind the library
  hall([-53.5, -88, 13, -61], 20.5, 25) // the south block (dinosaur halls)

  // ---- the Forbes front: museum portico, bays either side
  {
    const a: XY = [15.9, 67.4], b: XY = [-64.6, 62.4]
    // the portico block projects (outline x -17.3..8.2 to y 74.6)
    const pa: XY = [8.2, 74.6], pb: XY = [-17.3, 73.7], { L: pl } = onWall(pa, pb)
    slab(P, [[-17.3, 73.7], [-17.0, 65.8], [8.0, 66.9], [8.2, 74.6]], 0, 25.5, P.stone)
    portico(P, pa, pb, pl / 2, 4, 3.6, 1.4, 17, 21, 3.2, 3.4)
    for (const s of [2.2, pl - 2.2]) { const c = onWall(pa, pb).P(s, 0, 1.6); statue(P, c[0], c[1], 21, 2.8, 4.4) }
    // three bronze doors in the portico
    for (const s of [pl / 2 - 3.6, pl / 2, pl / 2 + 3.6]) arch(P.win, pa, pb, s - 1.1, s + 1.1, 1.4, 4.6, 0.12, 6)
    // the long front: square windows below, arched windows above
    const w: [XY, XY] = [[-25.0, 63.3], [-64.6, 62.4]], { L } = onWall(...w)
    bays(P, w[0], w[1], 1, L - 9, 4.4, [3.0, 7.5], [11, 18.5], 2.2)
    bays(P, [15.9, 67.4], [7.9, 67.1], 0.5, 7.5, 4, [3.0, 7.5], [11, 18.5], 2.0)
    // the end pavilion by the Music Hall: statues on its corners
    for (const s of [L - 1.5, L - 7.5]) { const c = onWall(...w).P(s, 0, -1.5); statue(P, c[0], c[1], 25, 2.4, 3.6) }
  }
  // ---- side and rear windows: one storey of arched windows on the ranges
  {
    const sides: [XY, XY][] = [[[-63.9, 5.6], [-64.6, 62.4]].reverse() as [XY, XY], [[13.1, -86.3], [12.9, -68.5]], [[-53.5, -88.0], [-34.0, -87.8]], [[29.0, -58.3], [28.0, -41.3]], [[0.4, -60.0], [29.0, -58.3]]]
    for (const [a, b] of sides) { const { L } = onWall(a, b); bays(P, a, b, 2, L - 2, 4.6, [3, 7], [10.5, 16.5], 1.9) }
  }

  // ---- Museum of Art: the sandstone wing on Forbes round the sculpture
  // court, then the Scaife Gallery's flat granite box
  {
    const W: XY[] = [[15.9, 67.4], [17.2, 47.4], [53.4, 49.1], [54.6, 11.0], [24.9, 9.9], [25.5, -5.1], [61.0, -5.0], [61.1, 59.2], [60.9, 69.0], [51.4, 65.9], [51.2, 68.7], [42.0, 65.4], [41.7, 68.3], [32.4, 64.9], [32.4, 67.7], [22.9, 64.6], [22.9, 67.3]]
    slab(P, W, 0, 17)
    band(P.stone, W, inset(W, -0.3), 16.3, 17, 0.2)
    for (let i = 0; i < W.length; i++) {
      const a = W[i], b = W[(i + 1) % W.length], { L } = onWall(a, b)
      if (L < 5) continue
      bays(P, a, b, 0.8, L - 0.8, 4.4, [2.8, 6.5], [9, 14.8], 1.9)
    }
    const S: XY[] = [[61.0, -5.0], [68.0, -4.9], [123.8, -2.5], [122.2, 38.0], [121.2, 70.5], [82.6, 69.5], [65.1, 69.0], [65.4, 59.5], [61.1, 59.2]]
    wallsSplit(P.extra, S, 0, 17, 6)
    cap(P.roof, S, 17)
    band(P.extra, S, inset(S, -0.3), 16.4, 17, 0.2)
    const runs: [XY, XY][] = [[[68.0, -4.9], [123.8, -2.5]], [[121.2, 70.5], [82.6, 69.5]]]
    for (const [a, b] of runs) { const { L } = onWall(a, b); panel(P.win, a, b, 2, L - 2, 2.5, 5.5, 0.05) }
    // the solar arrays on the Scaife roof (NAIP)
    for (let i = 0; i < 6; i++) { const y = 8 + i * 9; P.glass.quad([72, y, 17.4], [116, y + 1.1, 17.4], [116, y + 4.1, 17.9], [72, y + 3, 17.9]) }
  }

  // move to this placement's anchor: the outlines' centroid
  shiftParts(Object.values(P), -19.8, -8.6)

  const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0.05 : p[1] > 50 && p[2] < 30 ? 0.7 : 0.15)
  return [
    { part: P.stone, material: { ...finish('carnegie-sandstone', SANDSTONE), floodlight: lit } },
    { part: P.roof, material: finish('carnegie-roof', 0xaba69d) },
    { part: P.glass, material: PALETTE.glass },
    { part: P.win, material: PALETTE.window },
    { part: P.bronze, material: finish('bronze', 0x6c6a5e) },
    { part: P.extra, material: finish('scaife-granite', 0xc2bdb3) },
  ]
}

if (import.meta.main) await save('pit-carnegie-institute', 'Carnegie Institute (Museums of Art and Natural History)', [40.4433252, -79.9497464], 343.2, build() as any, 6500)
