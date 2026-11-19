/**
 * Carnegie Library of Pittsburgh, Main (Oakland), and Carnegie Music Hall
 * (Longfellow, Alden & Harlow, 1895; Music Hall front of the 1907
 * extension), Forbes Avenue and Schenley Plaza, Oakland, Pittsburgh —
 * original procedural geometry, CC0-1.0.
 * bun generators/pit-carnegie-library-music-hall.ts
 *
 * The west half of the Carnegie Institute complex; the museums are
 * pit-carnegie-institute, drawn in the same shared frame, whose generator
 * exports the helpers used here (merge it first, and with it
 * pit-soldiers-and-sailors.ts and pit-allegheny-county-courthouse.ts).
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. The shared frame is centred at
 * -79.9499408 40.4431990 and turned to 343.2° (the Forbes Avenue front): +y
 * north-north-west (Forbes Avenue), -x west (Schenley Plaza and the
 * library entrance). This placement's anchor is the area centroid of the
 * OSM outlines it replaces, ways 31899524 and 154257484: (-69.96, -6.0) in
 * the shared frame, -79.9507109 40.4429642; the model is shifted by that.
 *
 * Identity, in order: the Music Hall's Forbes Avenue portico, columns in
 * antis over three arched doors, with bronze statue groups on its corner
 * piers; the Music Hall's long hipped auditorium roof behind its foyer;
 * the library's ranges of round-arched windows over a rusticated base
 * round a light court, under hipped grey roofs; the curved reading-room
 * bay at the south; the triple-arched library entrance on Schenley Plaza;
 * pale weathered sandstone.
 *
 * Evidence:
 *  - plan: OSM way/154257484 (Carnegie Music Hall) and way/31899524
 *    (Carnegie Library main, with its curved south bay), turned into the
 *    frame; the ranges and court inside from the lidar.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, above the ground on Forbes Avenue and Schenley Plaza (272.1 m
 *    NAVD88): Music Hall portico block 25.5, its porch 20; foyer eaves 25,
 *    ridge 29.5; auditorium eaves ~17.5, ridge 27 along its length;
 *    library ranges eaves 19-21, ridges 24-25; the tall east stack range
 *    28; the light court's low roofs 8-11 and its cross block 20; the
 *    curved south bay ~20.
 *  - published: library and music hall opened 1895 (Wikipedia, "Carnegie
 *    Library of Pittsburgh"; "Carnegie Music Hall").
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Carnegie Institute, Oakland, 2023-01-11, Music Hall 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Institute,_Oakland,_2023-01-11,_Music_Hall_01.jpg
 *      Cbaile19, CC0 — the Music Hall portico head-on.
 *    "Carnegie Library, entrance, Oakland, Pittsburgh, 2021-11-09, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Library,_entrance,_Oakland,_Pittsburgh,_2021-11-09,_01.jpg
 *      Cbaile19, CC0 — the library's triple-arched entrance.
 *    "Carnegie Library of Pittsburgh - back.JPG"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Library_of_Pittsburgh_-_back.JPG
 *      Piotrus, CC BY-SA 3.0 — the library's south side and curved bay.
 *    "Carnegie Institute of Pittsburgh.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Institute_of_Pittsburgh.jpg
 *      Kevin Albright, CC BY-SA 3.0 — the library's arcaded side.
 *    "Carnegie Museum of Natural History as seen from Cathedral of Learning.jpg"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Museum_of_Natural_History_as_seen_from_Cathedral_of_Learning.jpg
 *      Dllu, CC BY-SA 4.0 — from above: the hipped roofs, the Music Hall
 *      portico and the library ranges.
 *    "Carnegie Music Hall Pittsburgh.JPG"
 *      https://commons.wikimedia.org/wiki/File:Carnegie_Music_Hall_Pittsburgh.JPG
 *      HoboJones, CC BY-SA 3.0 — the Music Hall from Forbes Avenue.
 *    USGS NAIP orthophoto (public domain): roofs and court.
 *  - colour: weathered grey-buff sandstone; grey-tan roofs; bronze statues;
 *    the portico's recessed loggia wall in a shaded tone of the stone.
 * Estimated: window rhythm and sizes, the portico's columns (four in antis)
 * and doors, the ranges' hips, the court's inner blocks, the entrance
 * arches (from the photos against the lidar heights).
 * Doubts: the court and the east stack range are read from lidar only; the
 * library's east side faces the museums and is mostly hidden.
 *
 * Left out: carving, inscriptions, lamps, railings, statue figures (bold
 * bronze masses).
 *
 * Night: the Music Hall portico and library entrance are floodlit (stone
 * `floodlight`); windows glow.
 */
import type { V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow, wallsSplit } from './pit-allegheny-county-courthouse'
import { shiftParts } from './pit-soldiers-and-sailors'
import { SANDSTONE, bays, hipLantern, newParts, portico, slab, statue } from './pit-carnegie-institute'

function build() {
  const P = newParts()
  const MH: XY[] = [[-105.6, 62.9], [-105.1, 42.9], [-101.3, 42.9], [-100.0, 12.5], [-100.1, 5.6], [-63.9, 5.6], [-64.6, 62.4], [-64.4, 64.4], [-72.6, 64.5], [-72.1, 72.0], [-97.9, 70.8], [-97.5, 63.1]]
  const LIB: XY[] = [[-102.3, 5.1], [-101.7, -12.0], [-91.3, -11.7], [-90.2, -23.2], [-93.4, -23.2], [-93.2, -34.5], [-90.4, -34.6], [-89.8, -46.1], [-100.4, -46.5], [-99.8, -63.7], [-83.0, -63.1], [-82.4, -65.6], [-80.8, -67.6], [-78.5, -68.9], [-75.9, -69.3], [-73.5, -68.7], [-71.4, -67.2], [-70.0, -65.1], [-69.5, -62.6], [-51.7, -61.9], [-42.2, -61.3], [-27.6, -61.3], [-30.0, 6.3], [-63.9, 5.6], [-100.1, 5.6]]

  const hall = (r: [number, number, number, number], z0: number, eave: number, ridge: number, lantern = false) => {
    slab(P, rect(...r), z0, eave, null)
    band(P.stone, rect(...r), grow(r, 0.3), eave - 0.6, eave, 0.25)
    hipLantern(P, [r[0] - 0.3, r[1] - 0.3, r[2] + 0.3, r[3] + 0.3], eave, ridge, lantern)
  }

  // ---- Music Hall: walls to the auditorium's eaves, foyer and auditorium roofs
  // the Music Hall's walls; the Forbes portico (the outline's projection to
  // y 72) is drawn separately below
  slab(P, [[-105.6, 62.9], [-105.1, 42.9], [-101.3, 42.9], [-100.0, 12.5], [-100.1, 5.6], [-63.9, 5.6], [-64.6, 62.4], [-64.4, 64.4], [-72.6, 64.5], [-72.6, 63.6], [-97.6, 63.0]], 0, 17.5)
  hall([-100, 42.5, -64.3, 63], 17.5, 25, 29.5)
  hall([-99.5, 6, -64.3, 42.5], 17.5, 17.5, 27)
  // the Forbes portico: a block to 25.5, columns in antis, statues on the piers
  {
    slab(P, [[-97.9, 63], [-72.4, 63.6], [-72.2, 69.4], [-97.9, 68.5]], 0, 25.5, P.stone)
    const a: XY = [-72.2, 69.4], b: XY = [-97.9, 68.5], { L, P: at } = onWall(a, b)
    // columns in antis on a rusticated base storey, three arched doors in the base
    portico(P, a, b, L / 2, 4, 3.5, 7.5, 19.5, 22.5, 2.6, 3.4, P.extra)
    for (const s of [L / 2 - 3.5, L / 2, L / 2 + 3.5]) arch(P.win, a, b, s - 1.2, s + 1.2, 1.2, 5.6, 2.65, 6)
    for (const s of [L / 2 - 3.5, L / 2, L / 2 + 3.5]) arch(P.win, a, b, s - 0.9, s + 0.9, 11, 14.5, 0.12, 6)
    for (const s of [1.9, L - 1.9]) { const c = at(s, 0, 1.3); statue(P, c[0], c[1], 22.5, 3.2, 5.6) }
    // the steps up to the porch
    for (let i = 0; i < 5; i++) {
      const o = 2.6 + 2.0 - i * 0.4, z = 0.64 * (i + 1)
      const q: XY[] = [at(L / 2 - 8, 0, 2.6), at(L / 2 + 8, 0, 2.6), at(L / 2 + 8, 0, o), at(L / 2 - 8, 0, o)].map((p) => [p[0], p[1]] as XY)
      const ccw = (q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0]) > 0 ? q : [...q].reverse()
      walls(P.stone, ccw, 0, z); cap(P.stone, ccw, z)
    }
    // the Music Hall's west side on Schenley Plaza: arched windows
    bays(P, [-105.6, 62.9], [-105.1, 42.9], 1, 19, 4.4, [3, 7.5], [10.5, 16.5], 2.0)
    bays(P, [-101.3, 42.9], [-100.0, 12.5], 1, 29, 4.4, [3, 7], [9.5, 15.5], 2.0)
  }

  // ---- the library: ranges round a light court
  slab(P, LIB, 0, 8.5)
  hall([-101.5, -12, -30, 5.4], 8.5, 21, 25)     // north range
  hall([-93, -48, -66, -12], 8.5, 18.5, 25)       // west range
  hall([-99.8, -63.4, -28, -46.5], 8.5, 21, 25)   // south range
  hall([-44, -46.5, -30, -12], 8.5, 25, 28.5)     // east stack range
  slab(P, rect(-66, -34, -44, -24), 8.5, 20)      // the court's cross block
  // the curved south bay
  {
    const c: XY = [-76.2, -62.8], R = 6.6, n = 10
    const ring: XY[] = Array.from({ length: n + 1 }, (_, i) => { const t = Math.PI + (i / n) * Math.PI; return [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)] as XY })
    slab(P, ring, 8.5, 20)
    for (let i = 1; i < n - 1; i += 2) {
      const a = ring[i], b = ring[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      arch(P.win, a, b, 0.4, L - 0.4, 11, 16.5 - (L - 0.8) / 2, 0.05, 5)
    }
  }
  // windows: arched windows over square ones on the outer walls
  {
    const runs: [XY, XY, number][] = [
      [[-99.8, -63.7], [-83.0, -63.1], 4.2], [[-69.5, -62.6], [-27.6, -61.3], 4.4], [[-100.4, -46.5], [-99.8, -63.7], 4.2],
      [[-89.8, -46.1], [-100.4, -46.5], 4.4], [[-93.4, -23.2], [-93.2, -34.5], 4.2],
    ]
    for (const [a, b, pitch] of runs) { const { L } = onWall(a, b); bays(P, a, b, 0.8, L - 0.8, pitch, [3, 7.5], [10.5, 16.2], 2.0); bays(P, a, b, 0.8, L - 0.8, pitch, [17.4, 19.6], null, 1.4) }
  }
  // the entrance on Schenley Plaza: three arches, "Free to the People"
  {
    const a: XY = [-102.3, 5.1], b: XY = [-101.7, -12.0], { L, P: at } = onWall(a, b)
    const r: XY[] = [at(L / 2 - 7, 0, 0), at(L / 2 + 7, 0, 0), at(L / 2 + 7, 0, 2), at(L / 2 - 7, 0, 2)].map((p) => [p[0], p[1]] as XY)
    const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0 ? r : [...r].reverse()
    slab(P, ccw, 0, 13, P.stone)
    for (const s of [L / 2 - 3.8, L / 2, L / 2 + 3.8]) arch(P.win, a, b, s - 1.5, s + 1.5, 1.4, 6.4, 2.1, 8)
  }

  shiftParts(Object.values(P), 69.96, 6.0)

  const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0.05 : p[1] > 60 || p[0] < -30 ? 0.65 : 0.2)
  return [
    { part: P.stone, material: { ...finish('carnegie-sandstone', SANDSTONE), floodlight: lit } },
    { part: P.roof, material: finish('carnegie-roof', 0xaba69d) },
    { part: P.glass, material: PALETTE.glass },
    { part: P.win, material: PALETTE.window },
    { part: P.bronze, material: finish('bronze', 0x6c6a5e) },
    { part: P.extra, material: finish('loggia-shade', 0x9c9283) },
  ]
}

if (import.meta.main) await save('pit-carnegie-library-music-hall', 'Carnegie Library and Music Hall', [40.4429642, -79.9507109], 343.2, build() as any, 6500)
