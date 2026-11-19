/**
 * Cheekwood mansion, Nashville (1929–32, Bryant Fleming for Leslie and
 * Mabel Cheek; now Cheekwood Estate & Gardens) — original procedural
 * geometry, CC0-1.0.
 * bun generators/nash-cheekwood.ts
 *
 *
 * Map frame: x, y, z up, metres, turned to bearing 19.8, so +y runs along
 * the house to the north-north-east and +x points out of the garden front
 * (east-south-east). Anchor = area centroid of OSM way/681333474 (the
 * mansion and its attached wings; unnamed in OSM, identified by NAIP, the
 * lidar and the photos), 36.089225, -86.876683. y = 0 is the lowest ground
 * under the footprint (the north end, lidar 9.8 m above the box's
 * ground_min); the entrance forecourt on the west is 4.5 m higher, the
 * garden lawn on the east ~0.5.
 *
 * Identity: the long three-storey block of grey-tan rubble limestone with
 * pale dressings and a low red-brown tiled hipped roof; the pedimented
 * centre pavilion with four pilasters on both fronts; the projecting
 * pedimented north-west pavilion with the great arched stair window over
 * the forecourt; the garden terrace with its arch; the lower north wing
 * and the long arcaded south wing.
 *
 * Evidence:
 *  - plan: OSM way/681333474, simplified to rectangles: main block
 *    x -9.5..9.1, y -25..14.7; south-east block; north wing; north-west
 *    pavilion (OSM's diagonal forecourt corner squared off); the one-storey
 *    garden room and north link; the south wing.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid:
 *    main eaves 14.7, ridge 19.5; south-east block the same eaves; north
 *    wing eaves 13.5, ridge 16.5; north-west pediment 18.1; south wing
 *    ~8.3; link and garden room ~5.3. Measured. Many trees overhang the
 *    building; the edges were read where the roof profile is clean.
 *  - storeys, windows, pilasters, the terrace (4.4 m) and the pediments:
 *    estimated from the photos against the lidar eaves.
 *  - colours from the photos: grey-tan rubble limestone, cream dressings,
 *    red-brown tile.
 *
 * Photos (EVIDENCE): WTN PeepHoles 083, 086, 087 (Wikipedia Takes
 * Nashville, public domain; garden front, north-west pavilion, entrance
 * front) https://commons.wikimedia.org/wiki/File:WTN_PeepHoles_083.JPG ;
 * Cheekwood Mansion.jpg, Vandore, CC BY-SA 4.0; Cheekwood Mansion Front,
 * owenwbrown, CC BY 2.0
 * https://www.flickr.com/photos/42673922@N03/4399097433 . USGS NAIP
 * (public domain): plan, roof colour.
 * No look-only sources used. No commercial imagery.
 *
 * Night: windows glow; doors are `entrance`; the fronts carry a soft
 * floodlight (assumed).
 *
 * Left out: quoins, window pediments, the cartouches' carving, balcony
 * ironwork, balustrades (one solid band over the terrace arch), the
 * forecourt walls and urns, the terrace stairs.
 *
 * Doubts: OSM's west-front projection (y -0.8..10.5) disagrees with the
 * photos, which put the entrance pavilion on the garden pavilion's axis;
 * the model follows the photos. The south-east block, the north side and
 * the wings' back faces are not well photographed; their windows are an
 * even rhythm. Chimney positions are approximate.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, save, capPoly, type XY } from './atl-westin-peachtree-plaza'
import { prismV, block, triH, type Face } from './nash-ryman-auditorium'
import { wf, rect, taper, type Side } from './nash-downtown-presbyterian'

const rubble = new Part(), dress = new Part(), tile = new Part(), win = new Part(), door = new Part()

/** A flat convex shape (s, z outline) on a face, wound to face out. */
function shape(p: Part, f: Face, o: XY[], out = 0.06) {
  const c = o.reduce<XY>((m, q) => [m[0] + q[0] / o.length, m[1] + q[1] / o.length], [0, 0])
  const C = f.P(c[0], c[1], out), hint: V3 = [f.n[0], f.n[1], 0]
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; triH(p, C, f.P(a[0], a[1], out), f.P(b[0], b[1], out), hint) }
}
const R = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

// storeys above the forecourt (model z): ground, first, second
const ROWS: [number, number][] = [[5.3, 7.6], [8.7, 10.7], [11.9, 13.5]]
const BASE: [number, number] = [1.6, 3.4] // garden-side basement, where the lawn falls away

/** A sash window: pale stone surround, the glass. */
function sash(f: Face, s: number, z0: number, z1: number, w = 1.15) {
  shape(dress, f, R(s - w / 2 - 0.18, s + w / 2 + 0.18, z0 - 0.15, z1 + 0.18), 0.04)
  shape(win, f, R(s - w / 2, s + w / 2, z0, z1), 0.08)
}
function bays(dir: Side, c: number, lo: number, hi: number, us: number[], rows = ROWS, base = false) {
  const { f, s } = wf(dir, c, lo, hi)
  for (const u of us) {
    for (const [z0, z1] of rows) sash(f, s(u), z0, z1)
    if (base) sash(f, s(u), BASE[0], BASE[1])
  }
}
/** A hipped tile roof over a rectangle, eaves at ze, to a ridge (or point) at zr. */
function hip(x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, over = 0.5) {
  const a = rect(x0 - over, y0 - over, x1 + over, y1 + over)
  const w = x1 - x0 + 2 * over, d = y1 - y0 + 2 * over, i = Math.min(w, d) / 2 - 0.05
  const b = rect(x0 - over + i, y0 - over + i, x1 + over - i, y1 + over - i)
  taper(tile, a, b, ze, zr, null)
  capPoly(tile, a, ze, false)
}
/** A walled block with a pale cornice under its eaves. */
function wing(r: XY[], ze: number) {
  prism(rubble, r, 0, ze - 0.5, rubble, 0.04)
  const [[x0, y0], , [x1, y1]] = r
  prism(dress, rect(x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25), ze - 0.55, ze, dress, 0.1)
}
/**
 * A pedimented centre pavilion on a face: four pale pilasters through the
 * storeys, the pediment rising over the eaves with a cartouche.
 */
function pavilion(dir: Side, c: number, u0: number, u1: number, ze: number, peak: number) {
  const { f, s } = wf(dir, c, u0, u1)
  const a = s(u0), b = s(u1), lo = Math.min(a, b), hi = Math.max(a, b), w = hi - lo
  for (let i = 0; i < 4; i++) {
    const k = lo + 0.35 + (i * (w - 0.7)) / 3
    shape(dress, f, R(k - 0.35, k + 0.35, 4.5, ze - 0.55), 0.12)
  }
  const out = dir === 'E' || dir === 'N' ? 1 : -1
  const fn = (o: number) => c + out * o
  const prof: XY[] = [[(u0 + u1) / 2 - w / 2 - 0.3, ze - 0.6], [(u0 + u1) / 2 + w / 2 + 0.3, ze - 0.6], [(u0 + u1) / 2, peak]]
  if (dir === 'E' || dir === 'W') prismV(dress, prof, [0, 1], [0, 0], Math.min(-fn(0.3), -fn(-4)), Math.max(-fn(0.3), -fn(-4)), tile)
  else prismV(dress, prof, [1, 0], [0, 0], Math.min(fn(0.3), fn(-4)), Math.max(fn(0.3), fn(-4)), tile)
  const g = wf(dir, fn(0.32), u0, u1)
  shape(rubble, g.f, [[w / 2 - (w / 2 - 0.9), ze - 0.2], [w / 2 + (w / 2 - 0.9), ze - 0.2], [w / 2, peak - 0.65]], 0.02)
  shape(dress, g.f, R(w / 2 - 0.45, w / 2 + 0.45, ze + 0.3, ze + 1.3), 0.05)
}

function build() {
  // model frame: +y north-north-east along the house, +x east-south-east to the garden (bearing 19.8)
  const E = 14.7, RIDGE = 19.5
  // ── main block, with the shallow centre projections on both fronts ──
  wing(rect(-9.5, -25.0, 9.1, 14.7), E)
  wing(rect(9.1, -6.7, 10.3, 3.4), E) // garden pavilion
  wing(rect(-9.7, -6.7, -9.5, 3.4), E) // entrance pavilion, on the garden pavilion's axis
  {
    // hipped roof: ridge along the block at its middle
    const a = rect(-10.0, -25.5, 9.6, 15.2)
    taper(tile, a, rect(-0.25, -25.5 + 9.8, 0.05, 15.2 - 9.8), E, RIDGE, null)
    capPoly(tile, a, E, false)
  }
  pavilion('E', 10.3, -6.7, 3.4, E, E + 2.9)
  pavilion('W', -9.7, -6.7, 3.4, E, E + 2.9)
  // ── south-east block, full height, reaching toward the garden ──
  wing(rect(9.1, -24.6, 15.2, -14.7), E)
  hip(9.1, -24.6, 15.2, -14.7, E, 16.6)
  // ── north wing (lower), the north-west gabled pavilion, the garden room ──
  wing(rect(-6.0, 14.7, 7.0, 28.4), 13.5)
  hip(-6.0, 14.7, 7.0, 28.4, 13.5, 16.5)
  wing(rect(-14.6, 14.8, -6.0, 25.5), 14.0)
  {
    const prof: XY[] = [[14.4, 13.4], [25.9, 13.4], [20.15, 18.1]]
    prismV(dress, prof, [0, 1], [0, 0], 5.0, 14.9, tile) // pediment facing the forecourt (west)
    prismV(rubble, [[15.2, 13.3], [25.1, 13.3], [20.15, 17.5]], [0, 1], [0, 0], 4.9, 14.95)
    const { f, s } = wf('W', -14.6, 14.8, 25.5)
    // the great arched stair window over the iron balcony, flanked by narrow lights
    const c = s(20.15)
    shape(dress, f, [[c - 2.4, 4.6], [c + 2.4, 4.6], [c + 2.4, 5.0], [c - 2.4, 5.0]], 0.3)
    const arc: XY[] = [[c - 0.95, 5.4], [c + 0.95, 5.4], [c + 0.95, 9.0]]
    for (let i = 1; i < 8; i++) { const t = (Math.PI * i) / 8; arc.push([c + 0.95 * Math.cos(t), 9.0 + 0.95 * Math.sin(t)]) }
    arc.push([c - 0.95, 9.0])
    shape(dress, f, arc.map(([a, b]) => [c + (a - c) * 1.25, 5.25 + (b - 5.4) * 1.07] as XY), 0.04)
    shape(win, f, arc, 0.08)
    for (const k of [-1.75, 1.75]) shape(win, f, R(c + k - 0.4, c + k + 0.4, 5.4, 8.4), 0.08)
    for (const k of [-1.8, 1.8]) sash(f, c + k, 11.3, 12.9)
  }
  block(rubble, 7.0, 10.0, 14.7, 28.4, 0, 4.8)
  block(dress, 6.9, 10.2, 14.6, 28.6, 4.8, 5.3)
  // ── south wing: the long low arcaded wing off the south end ──
  wing(rect(-3.7, -36.5, 3.4, -25.0), 8.3)
  hip(-3.7, -36.5, 3.4, -25.0, 8.3, 10.2, 0.35)
  {
    const { f, s } = wf('W', -3.7, -36.5, -25.0)
    for (const y of [-34.6, -31.6, -28.6]) {
      const c = s(y), arc: XY[] = [[c - 0.9, 4.5], [c + 0.9, 4.5], [c + 0.9, 6.0]]
      for (let i = 1; i < 6; i++) { const t = (Math.PI * i) / 6; arc.push([c + 0.9 * Math.cos(t), 6.0 + 0.9 * Math.sin(t)]) }
      arc.push([c - 0.9, 6.0])
      shape(win, f, arc, 0.06)
    }
  }
  // the north link
  block(rubble, 3.2, 7.5, 28.4, 41.0, 0, 5.4)
  block(dress, 3.1, 7.6, 28.3, 41.1, 5.4, 5.8)

  // ── windows ──
  // entrance (west) front
  bays('W', -9.5, -25.0, 14.7, [-21.4, -17.6, -13.8, -10.0, 5.6, 8.7, 11.8])
  bays('W', -9.7, -6.7, 3.4, [-4.9, -1.65, 1.6], [ROWS[1], ROWS[2]])
  {
    // the entrance: round-headed door in a pale frontispiece
    const { f, s } = wf('W', -9.7, -6.7, 3.4)
    const c = s(-1.65)
    shape(dress, f, R(c - 1.6, c + 1.6, 4.5, 8.0), 0.1)
    shape(door, f, R(c - 0.75, c + 0.75, 4.5, 7.0), 0.14)
    const fan: XY[] = [[c - 0.75, 7.0], [c + 0.75, 7.0]]
    for (let i = 1; i < 6; i++) { const t = (Math.PI * i) / 6; fan.push([c + 0.75 * Math.cos(t), 7.0 + 0.75 * Math.sin(t)]) }
    shape(win, f, fan, 0.14)
    for (let i = 0; i < 4; i++) block(dress, -9.7 - 0.6 * (i + 1), -9.7 - 0.6 * i, -3.65, 0.35, 0, 4.5 - 0.4 * i)
  }
  // garden (east) front, the centre pavilion, the south-east block
  bays('E', 9.1, -14.7, 14.7, [-12.3, -9.3, 5.6, 8.7, 11.8], ROWS)
  bays('E', 10.3, -6.7, 3.4, [-4.9, -1.65, 1.6], [ROWS[1], ROWS[2]])
  {
    // the garden terrace along the east front: rubble retaining wall, balustrade over the centre arch
    block(rubble, 10.3, 13.6, -14.7, 14.7, 0, 4.4)
    block(dress, 10.25, 13.75, -14.7, 14.7, 4.4, 4.65)
    block(dress, 13.45, 13.75, -5.0, 1.7, 4.65, 5.5)
    const { f, s } = wf('E', 13.6, -14.7, 14.7)
    const c = s(-1.65), arc: XY[] = [[c - 2.4, 0], [c + 2.4, 0], [c + 2.4, 1.6]]
    for (let i = 1; i < 8; i++) { const t = (Math.PI * i) / 8; arc.push([c + 2.4 * Math.cos(t), 1.6 + 2.4 * Math.sin(t)]) }
    arc.push([c - 2.4, 1.6])
    shape(tile, f, arc, 0.04) // the arch's shadowed opening, in the dark roof colour so it stays unlit
    // garden door in the pavilion, on the terrace
    const g = wf('E', 10.3, -6.7, 3.4)
    shape(dress, g.f, R(g.s(-1.65) - 1.3, g.s(-1.65) + 1.3, 4.65, 8.0), 0.1)
    shape(door, g.f, R(g.s(-1.65) - 0.7, g.s(-1.65) + 0.7, 4.65, 7.4), 0.14)
  }
  bays('E', 15.2, -24.6, -14.7, [-22.2, -19.65, -17.1], ROWS, true)
  bays('N', -14.7, 9.1, 15.2, [12.15])
  // ends and the north wing
  bays('S', -25.0, -9.5, 9.1, [-6.5, -3.4, 3.2, 6.3])
  bays('E', 7.0, 14.7, 28.4, [], ROWS)
  bays('N', 28.4, -6.0, 7.0, [-3.6, -0.5, 2.6], [[5.3, 7.4], [8.6, 10.4], [11.4, 12.7]], true)
  bays('E', 10.0, 14.7, 28.4, [16.8, 19.6, 22.4, 25.2], [[1.6, 3.9]])
  bays('S', 14.8, -14.6, -9.5, [-12.05])
  bays('N', 25.5, -14.6, -6.0, [-11.6, -8.6])
  // chimneys
  for (const [x, y] of [[-3.0, -18.0], [-3.0, 9.0], [3.0, -18.0], [3.0, 9.0], [0.5, 24.0]] as XY[]) {
    prism(rubble, rect(x - 0.7, y - 0.45, x + 0.7, y + 0.45), 15.0, 21.0, rubble, 0.04)
    prism(dress, rect(x - 0.8, y - 0.55, x + 0.8, y + 0.55), 21.0, 21.35, dress, 0.06)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : Math.abs(p[0]) > 8.5 && p[2] < 15 ? 0.6 : 0)
  return [
    { part: rubble, material: { ...finish('cheekwood-limestone', 0xb7ad9c), floodlight: flood } },
    { part: dress, material: { ...finish('cheekwood-dressings', 0xddd4c2), floodlight: flood } },
    { part: tile, material: finish('cheekwood-tile', 0x9c5c50) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x6e5a48 } },
  ]
}

if (import.meta.main) {
  await save('nash-cheekwood', 'Cheekwood', build(), { height: 21.35, anchor: [36.089225, -86.876683], bearing: 19.8 })
}
