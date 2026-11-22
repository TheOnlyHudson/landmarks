/**
 * Walker Center (1912, Eames & Young, as the Walker Bank Building), Salt
 * Lake City: procedural, CC0-1.0.
 * bun generators/slc-walker-center.ts   (kit: slc-wells-fargo-center.ts)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/223918433 (-111.890744, 40.765347). y = 0 is the
 * lowest ground under the outline.
 *
 * Form: a 14-storey L-plan office tower of buff brick and cream terra
 * cotta on Main Street, its light court open to the north-east; a two-storey
 * stone base with tall windows and the entrance canopy on Main Street; an
 * ornate two-storey top under a heavy cornice. On the roof, a penthouse
 * carries CENTER in tall lit letters on all four faces, and on that, turned
 * 45°, the stepped steel weather-beacon tower with WALKER stacked down each
 * face and the beacon at its tip. The lettering is the landmark's identity
 * and is drawn as letters (STYLE.md, "Famous signs"): a bold condensed
 * sans, traced from p1 and p3; the letters are lit (neon) at night.
 * Behind, a five-storey wing to the east and a low block filling the court.
 *
 * OSM: way/223918433 outline (16 levels, 67.1 m, Q7962232); parts
 * way/1434182331 (tower, 14 levels, 58 m), way/1434182332 (penthouse, 67.1 m),
 * way/1434182333 (beacon tower, 19.5 m above 67.1, pyramidal, turned 45°),
 * way/1434182334 (east wing, 12 m), way/1434182335 (court block, 5 m).
 * Published: 16 storeys, 67 m to the penthouse roof (Wikipedia, "Walker
 * Center"; NRHP). Heights follow OSM; the 2013 lidar was not needed.
 * Estimated from photos: base 8.5 m, top storeys from 50 m, cornice to
 * 58.5 m (p1, p3); 8 window bays a face, panels grouped two storeys; the
 * penthouse walls to 64.3 m and the CENTER letters 2.3 m tall above them;
 * the beacon tower's three tiers and the WALKER letters 2.1 m tall (p3);
 * the entrance canopy (p2).
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Walker_Bank_Building_(1).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (night, the west and south faces and the lit sign)
 *  p2 https://commons.wikimedia.org/wiki/File:Walker_Bank_Building_(2).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the entrance canopy on Main Street)
 *  p3 https://commons.wikimedia.org/wiki/File:Walker_Center_Salt_Lake_(Unsplash).jpg
 *     Omar Prestwich, CC0 (the east side, the court, the sign by day)
 * NAIP (USGS, public domain) for the plan.
 * Doubts: no daylight photo of the Main Street face, so the front's colour
 * comes from p1 (night, floodlit) and the brick from p3; the beacon's
 * real colours change with the forecast; it is drawn in its usual blue.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'
import { type XY, prism, edges, edgeNormal, bays, boxOn, rows, panel, save } from './slc-wells-fargo-center'

const wall = new Part(), trim = new Part(), win = new Part(), steel = new Part(), neon = new Part(), roof = new Part()

const TOWER: XY[] = [[-10.0, -19.1], [15.7, -19.1], [15.7, -5.4], [3.0, -5.4], [3.0, 6.9], [-10.0, 6.9]]
const WING: XY[] = [[15.7, -19.1], [35.6, -19.1], [35.6, -5.4], [15.7, -5.4]]
const COURT: XY[] = [[3.0, -5.4], [35.6, -5.4], [35.6, 6.9], [3.0, 6.9]]
const PENT: XY[] = [[-7.25, -11.3], [3.8, -11.3], [3.8, 0.3], [-7.25, 0.3]]
const Z_BASE = 8.5, Z_TOPF = 50, Z_CORN = 56.5, Z_ROOF = 58, Z_PENT = 64.3

prism(wall, TOWER, 0, Z_ROOF)
prism(wall, WING, 0, 12)
prism(roof, COURT, 0, 5)
// Base: pale stone, string course over it; cornice; band under the top storeys.
prism(trim, TOWER, 0, Z_BASE, false)
for (const [a, b] of edges(TOWER)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  boxOn(trim, a, b, -0.6, L + 0.6, Z_BASE - 0.2, Z_BASE + 0.6, 0.4)
  boxOn(trim, a, b, -0.8, L + 0.8, Z_TOPF - 0.6, Z_TOPF, 0.3)
  boxOn(trim, a, b, -1.2, L + 1.2, Z_CORN, Z_ROOF + 0.5, 1.0)
}
// Windows: eight bays to a face, two storeys to a panel; tall base windows.
const blockers = [{ ring: WING, h: 12 }, { ring: COURT, h: 5 }]
for (const [a, b] of edges(TOWER)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = L > 20 ? L / 8 : 3.2
  bays(win, a, b, pitch, 0.5, [...rows(Z_BASE + 1, Z_TOPF - 1, 6, 1.6), ...rows(Z_TOPF + 0.6, Z_CORN - 0.4, 1, 1.2)], blockers)
  const n = edgeNormal(a, b)
  if (n[0] < -0.9 || n[1] < -0.9) bays(win, a, b, pitch, 0.66, [[1.2, Z_BASE - 1.2]], blockers, 0.65)
}
for (const [a, b] of edges(WING)) bays(win, a, b, 3.4, 0.5, rows(1, 11.4, 3, 1.4), [{ ring: TOWER, h: 99 }])
// The entrance canopy on Main Street (p2), and its doors.
{
  const a: XY = [-10.0, 6.9], b: XY = [-10.0, -19.1] // north to south: outward is west
  boxOn(trim, a, b, 10, 18, 4.6, 5.6, 3.0)
  panel(win, a, b, 11.5, 16.5, 0.2, 4.4, 0.7)
}

// Penthouse with the CENTER letters standing on its parapet.
prism(wall, PENT, Z_ROOF, Z_PENT)
for (const [a, b] of edges(PENT)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  boxOn(trim, a, b, -0.4, L + 0.4, Z_PENT - 0.8, Z_PENT, 0.4)
  bays(win, a, b, L / 3, 0.45, [[Z_ROOF + 1, Z_PENT - 1.6]])
}

// ------------------------------------------------------------ letters ---
const G: Record<string, (p: Pen) => void> = {
  C: (p) => p.moveTo([0.66, 0.84]).cubicTo([0.52, 1.03], [0.04, 1.04], [0.04, 0.5], 4).cubicTo([0.04, -0.04], [0.52, -0.03], [0.66, 0.16], 4),
  E: (p) => { p.moveTo([0.6, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.6, 0]); p.moveTo([0, 0.52]).lineTo([0.5, 0.52]) },
  N: (p) => p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.62, 0]).lineTo([0.62, 1]),
  T: (p) => { p.moveTo([0, 1]).lineTo([0.66, 1]); p.moveTo([0.33, 1]).lineTo([0.33, 0]) },
  R: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.36, 1]).cubicTo([0.7, 1], [0.7, 0.5], [0.36, 0.5], 4).lineTo([0, 0.5]); p.moveTo([0.3, 0.5]).lineTo([0.64, 0]) },
  W: (p) => p.moveTo([0, 1]).lineTo([0.18, 0]).lineTo([0.4, 0.72]).lineTo([0.62, 0]).lineTo([0.8, 1]),
  A: (p) => { p.moveTo([0, 0]).lineTo([0.34, 1]).lineTo([0.68, 0]); p.moveTo([0.13, 0.36]).lineTo([0.55, 0.36]) },
  L: (p) => p.moveTo([0, 1]).lineTo([0, 0]).lineTo([0.56, 0]),
  K: (p) => { p.moveTo([0, 0]).lineTo([0, 1]); p.moveTo([0.62, 1]).lineTo([0, 0.38]); p.moveTo([0.2, 0.58]).lineTo([0.66, 0]) },
}
const WIDTH: Record<string, number> = { C: 0.7, E: 0.6, N: 0.62, T: 0.66, R: 0.64, W: 0.8, A: 0.68, L: 0.56, K: 0.66 }
function glyph(ch: string) { const p = new Pen(); G[ch](p); return p.paths }

// CENTER: one word per penthouse face, letters 2.6 m tall standing on the parapet.
for (const [a, b] of edges(PENT)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = edgeNormal(a, b)
  const cap = 2.3, gap = 0.12, word = 'CENTER'
  const total = [...word].reduce((s, c) => s + WIDTH[c] + gap, -gap) * cap
  let u0 = (L - total) / 2
  for (const ch of word) {
    const s0 = u0
    const place = (u: number, v: number, w: number): V3 => [
      a[0] + t[0] * (s0 + u * cap) + n[0] * (0.2 + w), a[1] + t[1] * (s0 + u * cap) + n[1] * (0.2 + w), Z_PENT + 0.15 + v * cap]
    strokes(neon, glyph(ch), { width: 0.26, depth: 0.35, place, back: true })
    u0 += (WIDTH[ch] + gap) * cap
  }
}

// The beacon tower: three stepped tiers of steel framing, turned 45°, then
// a short spire and the beacon.
const C: XY = [-1.75, -5.8]
const diamond = (h: number): XY[] => [[C[0], C[1] - h], [C[0] + h, C[1]], [C[0], C[1] + h], [C[0] - h, C[1]]]
const tiers: [number, number, number][] = [[Z_PENT, 72, 3.6], [72, 79, 2.9], [79, 84.4, 2.2]]
for (const [z0, z1, h] of tiers) {
  prism(steel, diamond(h), z0, z1)
  for (const [a, b] of edges(diamond(h))) boxOn(steel, a, b, -0.2, Math.hypot(b[0] - a[0], b[1] - a[1]) + 0.2, z1 - 0.4, z1, 0.3)
}
prism(steel, diamond(0.9), 84.4, 85.6)
prism(neon, diamond(0.6), 85.6, 86.6) // the weather beacon

// WALKER down each tower face, 2.1 m letters.
for (const [a, b] of edges(diamond(3.6))) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = edgeNormal(a, b)
  const cap = 2.1, word = 'WALKER'
  ;[...word].forEach((ch, i) => {
    const zTop = 84.0 - i * (cap + 0.35)
    // the face it sits on: the tier at that height
    const tier = tiers.find(([z0, z1]) => zTop - cap / 2 >= z0 && zTop - cap / 2 < z1) ?? tiers[0]
    const inset = 3.6 - tier[2] // how far that tier's face lies inside the base face
    const w0 = WIDTH[ch] * cap
    const place = (u: number, v: number, w: number): V3 => [
      a[0] + t[0] * (L / 2 - w0 / 2 + u * cap) + n[0] * (w + 0.05 - inset / Math.SQRT2),
      a[1] + t[1] * (L / 2 - w0 / 2 + u * cap) + n[1] * (w + 0.05 - inset / Math.SQRT2),
      zTop - cap + v * cap]
    strokes(neon, glyph(ch), { width: 0.2, depth: 0.3, place })
  })
}

save('slc-walker-center', 'Walker Center', [
  // Buff-grey brick (p3), cream terra cotta and stone trim, slate windows.
  { part: wall, material: finish('walker-brick', 0xc6baa8) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  // The beacon tower's dark painted steel.
  { part: steel, material: finish('walker-steel', 0x4f555d) },
  // The sign's letters: white by day, lit blue at night (p1, p3).
  { part: neon, material: finish('neon-walker-blue', 0xc9dcf2) },
], 86.6)
