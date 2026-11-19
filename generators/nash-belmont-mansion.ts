/**
 * Belmont Mansion, Belmont University, Nashville (1849–53, for Adelicia
 * Acklen) — original procedural geometry, CC0-1.0.
 * bun generators/nash-belmont-mansion.ts
 *
 *
 * Map frame: x, y, z up, metres, turned to bearing 186.8, so +y points out
 * of the south front and +x toward the west wing. Anchor = area centroid
 * of OSM way/543948934 "Belmont Mansion" (wikidata Q4884396), 36.135603,
 * -86.794765. (The brief's -86.7942 36.1330 is ~280 m off; OSM's named
 * outline was used.) y = 0 is the lowest ground under the footprint (the
 * east side, lidar 2.8 m above the box's ground_min); the south front
 * lawn is 1.6 m higher.
 *
 * Identity: the two-storey salmon-pink stuccoed main block with white
 * trim and a deep bracketed cornice under a flat roof; on the south front
 * the two giant Corinthian columns in antis before the recessed centre,
 * flanked by the two one-storey porches of paired Corinthian columns with
 * balustraded balconies on top; the square belvedere with its arched
 * windows on the roof; dark green shutters; the lower flat-roofed wings
 * and rear blocks behind.
 *
 * Evidence:
 *  - plan: OSM way/543948934 (the whole house), split into the main block
 *    (x -9.7..10.5, y 1..18.3, the porches to 20.7), the east and west
 *    wings, the two rear blocks and the link between them.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid:
 *    main block roof 12.7, belvedere ~17.6, wings 8.8, rear blocks 8.3,
 *    link 9.1. Measured (the lidar outline sits ~1.3 m east of OSM's).
 *  - column, porch, window and cornice heights: scaled from the HABS
 *    south-front views against the lidar roof (estimated). The belvedere
 *    is drawn square, 4.4 m, from the lidar and EVula's photo.
 *  - colours: EVula's 2000s colour photo (salmon stucco, white trim and
 *    columns, dark green shutters; HABS 1930s-70s show it all white). The
 *    flat roofs from NAIP (pale).
 *
 * Photos (Wikimedia Commons, all EVIDENCE): WTN EVula 097.jpg, EVula,
 * CC BY 3.0 (south-east, colour)
 * https://commons.wikimedia.org/wiki/File:WTN_EVula_097.jpg ; HABS TN-56
 * (public domain): south front from south-east (2-14), south elevation
 * (Lester Jones 1940), left wing (W. Jeeter Eason 1936); Belmont Mansion
 * restored.jpeg, Irishjames2909, public domain. USGS NAIP (public domain).
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the door is `entrance`; the south front, its
 * columns and the belvedere carry floodlight (assumed).
 *
 * Left out: the cast-iron side porches and galleries, the statues and
 * urns, the gazebos, capital carving (a flared block), the cornice
 * brackets, balustrade balusters (solid rails), chimneys.
 *
 * Doubts: the wings' and rear blocks' windows are an even rhythm from
 * the 1936 HABS wing view only; the rear court and the north faces are
 * unphotographed here. Not the Belmont Bell Tower (way/543948928).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, save, type XY } from './atl-westin-peachtree-plaza'
import { block, triH, type Face } from './nash-ryman-auditorium'
import { wf, rect, lathe, type Side } from './nash-downtown-presbyterian'

const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), shut = new Part(), door = new Part()

/** A flat convex shape (s, z outline) on a face, wound to face out. */
function shape(p: Part, f: Face, o: XY[], out = 0.06) {
  const c = o.reduce<XY>((m, q) => [m[0] + q[0] / o.length, m[1] + q[1] / o.length], [0, 0])
  const C = f.P(c[0], c[1], out), hint: V3 = [f.n[0], f.n[1], 0]
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; triH(p, C, f.P(a[0], a[1], out), f.P(b[0], b[1], out), hint) }
}
const R = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** A window with a white architrave and cornice head, and dark green shutters. */
function window(f: Face, s: number, z0: number, z1: number, w = 1.2, shutters = true) {
  shape(trim, f, R(s - w / 2 - 0.2, s + w / 2 + 0.2, z0 - 0.15, z1 + 0.15), 0.04)
  shape(trim, f, R(s - w / 2 - 0.35, s + w / 2 + 0.35, z1 + 0.15, z1 + 0.42), 0.1)
  shape(win, f, R(s - w / 2, s + w / 2, z0, z1), 0.08)
  if (shutters) for (const k of [-1, 1]) shape(shut, f, R(s + k * (w / 2 + 0.22), s + k * (w / 2 + 0.22 + w * 0.5), z0, z1), 0.1)
}
function bays(dir: Side, c: number, lo: number, hi: number, us: number[], rows: [number, number][], w = 1.2) {
  const { f, s } = wf(dir, c, lo, hi)
  for (const u of us) for (const [z0, z1] of rows) window(f, s(u), z0, z1, w)
}
/** A fluted Corinthian column, drawn as a smooth shaft on a square base under a flared, squared capital. */
function column(x: number, y: number, r: number, z0: number, z1: number) {
  block(trim, x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25, z0, z0 + r * 0.8)
  lathe(trim, x, y, [[r, z0 + r * 0.8], [r * 0.88, z1 - r * 2.2], [r * 1.05, z1 - r * 1.1], [r * 1.4, z1 - r * 0.25]], 12, false)
  block(trim, x - r * 1.45, x + r * 1.45, y - r * 1.45, y + r * 1.45, z1 - r * 0.25, z1)
}
/** A balustrade drawn as a solid low wall with a coping, along x or y. */
function rail(x0: number, y0: number, x1: number, y1: number, z: number, h = 0.95) {
  block(trim, Math.min(x0, x1) - 0.08, Math.max(x0, x1) + 0.08, Math.min(y0, y1) - 0.08, Math.max(y0, y1) + 0.08, z, z + h - 0.12)
  block(trim, Math.min(x0, x1) - 0.14, Math.max(x0, x1) + 0.14, Math.min(y0, y1) - 0.14, Math.max(y0, y1) + 0.14, z + h - 0.12, z + h)
}

function build() {
  // model frame: +y out of the south front (bearing 186.8), +x toward the west wing
  const C = 0.4, X0 = -9.7, X1 = 10.5, Y0 = 1.0, YF = 18.3, YP = 15.8, FL = 3.0
  const TOP = 11.6, CORN = 12.7
  const G: [number, number] = [3.4, 6.9], U: [number, number] = [8.3, 10.0]
  // ── main block: walls, the recessed centre behind the giant order ──
  prism(wall, rect(X0, Y0, X1, YP), 0, TOP, roof, 0.03)
  prism(wall, rect(X0, YP - 0.1, C - 3.6, YF), 0, TOP, roof, 0.03)
  prism(wall, rect(C + 3.6, YP - 0.1, X1, YF), 0, TOP, roof, 0.03)
  prism(trim, rect(X0 - 0.06, Y0 - 0.06, X1 + 0.06, YF + 0.06), 0, 1.0, trim, 0.04) // base
  prism(trim, rect(X0 - 0.08, Y0 - 0.08, X1 + 0.08, YF + 0.25), 10.3, TOP, trim, 0.03) // frieze, carried across the portico
  prism(trim, rect(X0 - 0.7, Y0 - 0.7, X1 + 0.7, YF + 0.85), TOP, CORN, roof, 0.25) // the heavy bracketed cornice
  // corner pilasters
  for (const x of [X0 + 0.3, X1 - 0.3]) block(trim, x - 0.35, x + 0.35, YF - 0.3, YF + 0.12, 1.0, 10.3)
  // ── the front: podium, giant columns in antis, the two columned porches with balconies ──
  block(trim, C - 8.7, C + 8.7, YF, YF + 2.6, 0, FL)
  for (let i = 0; i < 5; i++) block(trim, C - 3.1, C + 3.1, YF + 2.6 + 0.45 * i, YF + 2.6 + 0.45 * (i + 1), 0, FL - 0.55 * (i + 1) + 0.25)
  for (const sx of [-1, 1]) {
    column(C + sx * 1.55, YF - 0.1, 0.42, FL, 10.3)
    block(trim, C + sx * 3.6 - 0.35, C + sx * 3.6 + 0.35, YF - 0.25, YF + 0.15, FL, 10.3) // antae
    const px = C + sx * 6.1
    for (const d of [-2.05, -1.4, 1.4, 2.05]) column(px + d, YF + 2.15, 0.27, FL, 7.3)
    block(trim, px - 2.55, px + 2.55, YF, YF + 2.6, 7.3, 8.15)
    rail(px - 2.4, YF + 2.45, px + 2.4, YF + 2.45, 8.15)
    rail(px - 2.4, YF + 0.1, px - 2.4, YF + 2.45, 8.15)
    rail(px + 2.4, YF + 0.1, px + 2.4, YF + 2.45, 8.15)
  }
  // iron balcony across the recess at the upper floor
  block(trim, C - 3.0, C + 3.0, YP, YP + 0.9, 7.55, 7.8)
  block(shut, C - 3.0, C + 3.0, YP + 0.82, YP + 0.9, 7.8, 8.6)
  // ── the belvedere on the flat roof ──
  {
    const bx = C, by = 11.0, h = 2.2
    prism(trim, rect(bx - h - 0.3, by - h - 0.3, bx + h + 0.3, by + h + 0.3), CORN, CORN + 0.6, trim, 0.05)
    prism(trim, rect(bx - h, by - h, bx + h, by + h), CORN + 0.6, 16.3, trim, 0.03)
    for (const [dir, c] of [['N', by + h], ['S', by - h], ['E', bx + h], ['W', bx - h]] as [Side, number][]) {
      const lo = dir === 'N' || dir === 'S' ? bx - h : by - h
      const { f } = wf(dir, c, lo, lo + 2 * h)
      for (const k of [-1.05, 0, 1.05]) {
        const arc: XY[] = [[h + k - 0.35, 13.9], [h + k + 0.35, 13.9], [h + k + 0.35, 15.2]]
        for (let i = 1; i < 6; i++) { const t = (Math.PI * i) / 6; arc.push([h + k + 0.35 * Math.cos(t), 15.2 + 0.35 * Math.sin(t)]) }
        arc.push([h + k - 0.35, 15.2])
        shape(win, f, arc, 0.05)
      }
    }
    prism(trim, rect(bx - h - 0.45, by - h - 0.45, bx + h + 0.45, by + h + 0.45), 16.3, 16.9, roof, 0.15)
    prism(trim, rect(bx - h + 0.4, by - h + 0.4, bx + h - 0.4, by + h - 0.4), 16.9, 17.3, trim, 0.08)
    lathe(trim, bx, by, [[0.3, 17.3], [0.24, 17.9], [0.12, 18.2]], 8)
  }
  // ── windows and doors, main block ──
  {
    const { f, s } = wf('N', YP, C - 3.6, C + 3.6)
    shape(trim, f, R(s(C) - 1.1, s(C) + 1.1, FL, 7.2), 0.04)
    shape(door, f, R(s(C) - 0.75, s(C) + 0.75, FL, 6.3), 0.08)
    shape(win, f, R(s(C) - 0.75, s(C) + 0.75, 6.4, 7.0), 0.08)
    for (const k of [-2.5, 2.5]) window(f, s(C + k), G[0], G[1], 1.1, false)
    for (const k of [-2.3, 0, 2.3]) window(f, s(C + k), U[0], U[1], 1.0, false)
  }
  for (const sx of [-1, 1]) {
    const px = C + sx * 6.1
    const { f, s } = wf('N', YF, X0, X1)
    window(f, s(px), G[0], G[1], 1.2)
    window(f, s(px), U[0], U[1], 1.1)
  }
  bays('W', X0, Y0, YF, [14.6], [G, U])
  bays('E', X1, Y0, YF, [14.6], [G, U])
  bays('S', Y0, X0, X1, [-3.0, 3.8], [G, U])

  // ── wings: east and west wings, the north blocks and the link ──
  const WR: [number, number][] = [[1.4, 3.6], [5.0, 7.2]]
  const wings: [XY[], number][] = [
    [rect(-23.2, -6.7, X0, 10.6), 8.8],
    [rect(X1, -3.8, 24.7, 11.0), 8.8],
    [rect(-18.5, -19.2, -5.6, -6.7), 8.3],
    [rect(6.1, -19.3, 18.3, -6.7), 8.3],
    [rect(-5.6, -6.7, 6.1, Y0), 9.1],
  ]
  for (const [r, h] of wings) {
    prism(wall, r, 0, h - 0.5, roof, 0.03)
    const [[x0, y0], , [x1, y1]] = r
    prism(trim, rect(x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35), h - 0.55, h, roof, 0.12)
    prism(trim, rect(x0 - 0.05, y0 - 0.05, x1 + 0.05, y1 + 0.05), 0, 0.8, trim, 0.03)
  }
  bays('N', 10.6, -23.2, X0, [-21.0, -17.6, -14.2, -11.6], WR)
  bays('N', 11.0, X1, 24.7, [12.6, 16.0, 19.4, 22.8], WR)
  bays('W', -23.2, -6.7, 10.6, [-4.2, -0.4, 3.4, 7.2], WR)
  bays('E', 24.7, -3.8, 11.0, [-1.2, 2.4, 5.6, 8.6], WR)
  bays('S', -19.2, -18.5, -5.6, [-15.6, -12.0, -8.6], WR)
  bays('S', -19.3, 6.1, 18.3, [9.0, 12.2, 15.4], WR)
  bays('W', -18.5, -19.2, -6.7, [-16.0, -12.4, -9.0], WR)
  bays('E', 18.3, -19.3, -6.7, [-16.0, -12.4, -9.0], WR)

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > YP - 1 && p[2] < CORN + 0.1 ? 0.9 : p[2] > CORN ? 0.6 : 0)
  return [
    { part: wall, material: { ...finish('belmont-salmon-stucco', 0xd9a98c), floodlight: flood } },
    { part: trim, material: { ...finish('belmont-white-trim', 0xf2eee6), floodlight: flood } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: shut, material: finish('belmont-green-shutters', 0x56705c) },
    { part: door, material: { ...PALETTE.entrance, color: 0x6b5442 } },
  ]
}

if (import.meta.main) {
  await save('nash-belmont-mansion', 'Belmont Mansion', build(), { height: 18.2, anchor: [36.135603, -86.794765], bearing: 186.8 })
}
