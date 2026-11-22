/**
 * Robert Mills House (Ainsley Hall House), 1616 Blanding Street, Columbia,
 * South Carolina: the 1823 Classical Revival town house by Robert Mills,
 * red brick over a whitewashed arcaded basement, under a low hipped slate
 * roof with a pale cornice. Its two porticoes are its identity: on the
 * street (north) a tetrastyle Ionic portico two storeys tall with a
 * pediment, over an arcaded base and a central stair; on the garden
 * (south) a full-width two-storey veranda: a basement arcade, then a
 * colonnade with arches between the columns, under a balustraded deck.
 *
 * Frame: turned to the house, bearing 339° (+y to the street front,
 * towards 339°; +x towards 69°). Origin at the OSM outline's centroid.
 *
 * Sources
 * - OSM way/149963658 (building=detached, building:levels=3, hipped): the
 *   outline: the house 16.8 × 15.6 m, the street portico 9.7 m wide and
 *   3.1 m deep, the garden veranda 15.2 m wide and 2.3–2.7 m deep.
 * - Map terrain: the site is level to within 0.3 m.
 * - Photos (EVIDENCE):
 *   - Dr. Blazer, "Robert Mills House (Rear).jpg", CC BY-SA 4.0: the garden
 *     front, square on: six basement arches, eight columns, the stair, two
 *     chimneys, the triple windows.
 *     https://commons.wikimedia.org/wiki/File:Robert_Mills_House_(Rear).jpg
 *   - Akhenaton06, "Robert Mills House.jpg", CC BY-SA 3.0: the street front
 *     from the north-west: the Ionic portico and pediment, the arched side
 *     windows, the west side's bays.
 *     https://commons.wikimedia.org/wiki/File:Robert_Mills_House.jpg
 *   - w_lemay, "Robert Mills House (Ainsley Hall House), Blanding Street,
 *     Columbia, SC.jpg", CC BY-SA 2.0 (checked, not shaping).
 *     https://commons.wikimedia.org/wiki/File:Robert_Mills_House_(Ainsley_Hall_House),_Blanding_Street,_Columbia,_SC.jpg
 *
 * Numbers
 * - Measured: plan (OSM).
 * - Estimated from the photos, scaled from the 16.8 m width: basement 3.0 m,
 *   main floor to 7.8 m, eaves 11.6 m, cornice 12.2 m, ridge about 14.6 m (a low hip behind
 *   deep eaves), chimneys 16.6 m; the street portico's columns 0.8 m across, 8 m tall,
 *   pediment apex 14.8 m; the veranda's columns 0.5 m across; the stairs'
 *   run (they stand outside the OSM outline, as in the photos).
 * - No lidar: published and photo-scaled heights were enough for a house
 *   this size (city notes: lidar only when needed).
 * - Doubts: the east side is not photographed (mirrors the west).
 *
 * Night: windows glow; the doors and fanlights are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, cylinder, gable, grow, hip, panel, qf, rect, tf, type Side } from './dc-white-house'
import { earcut, saveModel, type XY } from './dc-nga-west'
import { archWindow } from './cola-usc-horseshoe'

const BRICK = finish('mills-house-brick', 0xb2604f)
const SLATE = finish('mills-house-slate', 0x8c9396)

/** A plate drawn in the x–z plane between y0 and y1 (both faces and every rim edge). */
function plateXZ(p: Part, poly: XY[], y0: number, y1: number) {
  for (const [a, b, c] of earcut(poly)) {
    tf(p, [poly[a][0], y0, poly[a][1]], [poly[b][0], y0, poly[b][1]], [poly[c][0], y0, poly[c][1]], [0, -1, 0])
    tf(p, [poly[a][0], y1, poly[a][1]], [poly[b][0], y1, poly[b][1]], [poly[c][0], y1, poly[c][1]], [0, 1, 0])
  }
  let area = 0
  for (let i = 0; i < poly.length; i++) { const u = poly[i], v = poly[(i + 1) % poly.length]; area += u[0] * v[1] - v[0] * u[1] }
  const sg = area > 0 ? 1 : -1
  for (let i = 0; i < poly.length; i++) {
    const u = poly[i], v = poly[(i + 1) % poly.length]
    qf(p, [u[0], y0, u[1]], [v[0], y0, v[1]], [v[0], y1, v[1]], [u[0], y1, u[1]], [sg * (v[1] - u[1]), 0, -sg * (v[0] - u[0])])
  }
}

/**
 * An arcade face across x0..x1 between y0 and y1: openings `w` wide with
 * round heads springing at `spring`, from z0 up to the solid band's top z1.
 * With `skip`, the opening at that index is left solid (behind a stair).
 */
function arcade(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, n: number, w: number, spring: number, skip = -1) {
  const pitch = (x1 - x0) / n, seg = 6
  const poly: XY[] = [[x0, z0]]
  for (let i = 0; i < n; i++) {
    if (i === skip) continue
    const c = x0 + pitch * (i + 0.5), a = c - w / 2, b = c + w / 2
    poly.push([a, z0], [a, spring])
    for (let k = 1; k < seg; k++) { const t = Math.PI - (Math.PI * k) / seg; poly.push([c + (w / 2) * Math.cos(t), spring + (w / 2) * Math.sin(t)]) }
    poly.push([b, spring], [b, z0])
  }
  poly.push([x1, z0], [x1, z1], [x0, z1])
  plateXZ(p, poly, y0, y1)
}

function build() {
  const brick = new Part(), white = new Part(), slate = new Part(), win = new Part(), door = new Part()

  // ---- The house: whitewashed basement, red brick above, pale cornice, low hipped slate roof, two chimneys.
  const H = rect(-8.4, 8.4, -7.7, 7.9)
  cbox(white, H, 0, 3.0, { top: false })
  cbox(brick, H, 3.0, 11.6, { top: false })
  cbox(white, grow(H, 0.1), 7.7, 7.95, {}) // the belt course at the upper floor
  cbox(white, grow(H, 0.8), 11.6, 12.2, { b: 0.2, bottom: true, top: false })
  hip(slate, grow(H, 0.8), 12.2, 14.6, 7.2)
  for (const x of [-3.6, 3.6]) {
    cbox(brick, rect(x - 0.6, x + 0.6, -1.5, -0.3), 13.0, 16.6, { b: 0.1 })
    cbox(brick, rect(x - 0.72, x + 0.72, -1.62, -0.18), 16.3, 16.6, { bottom: true })
  }

  // ---- Windows. Street front (north), beside the portico: an arched window in a brick recess on the
  // main floor, a sash window over it; garden front (south): triple windows either side of the
  // niche door, three windows above; the sides: three bays.
  for (const x of [-6.6, 6.6]) {
    archWindow(win, white, 'n', 7.9, x, 1.2, 4.0, 6.6)
    panel(win, 'n', 7.9, x - 0.6, x + 0.6, 8.6, 10.6, 0.05)
  }
  for (const x of [-2.5, 2.5]) panel(win, 'n', 7.9, x - 0.6, x + 0.6, 8.6, 10.6, 0.05)
  archWindow(door, white, 'n', 7.9, 0, 1.6, 3.4, 6.7) // the front door under its fanlight
  for (const x of [-4.4, 4.4]) {
    panel(white, 's', -7.7, x - 1.55, x + 1.55, 3.8, 7.0, 0.03)
    panel(win, 's', -7.7, x - 1.35, x + 1.35, 3.9, 6.8, 0.06)
  }
  archWindow(door, white, 's', -7.7, 0, 2.2, 3.4, 6.6) // the garden door in its niche
  for (const x of [-4.4, 0, 4.4]) {
    panel(white, 's', -7.7, x - 1.15, x + 1.15, 8.5, 10.9, 0.03)
    panel(win, 's', -7.7, x - 0.95, x + 0.95, 8.6, 10.8, 0.06)
  }
  for (const [side, at] of [['w', -8.4], ['e', 8.4]] as [Side, number][]) {
    for (const y of [-4.6, 0, 4.6]) {
      panel(win, side, at, y - 0.6, y + 0.6, 4.0, 6.6, 0.05)
      panel(win, side, at, y - 0.6, y + 0.6, 8.6, 10.6, 0.05)
      panel(win, side, at, y - 0.5, y + 0.5, 1.0, 2.2, 0.05)
    }
  }

  // ---- The street portico: an arcaded base, four Ionic columns two storeys tall, entablature, pediment.
  const P = rect(-4.8, 4.9, 7.9, 11.0)
  arcade(white, P.x0, P.x1, P.y1 - 0.5, P.y1, 0, 3.0, 3, 1.8, 1.4, 1)
  cbox(white, rect(P.x0, P.x1, P.y0, P.y1 - 0.5), 2.6, 3.0, { bottom: true })
  for (const x of [P.x0, P.x1 - 0.5]) cbox(white, rect(x, x + 0.5, P.y0, P.y1), 0, 2.6, { top: false })
  for (let i = 0; i < 4; i++) {
    const x = P.x0 + 0.6 + (i * (P.x1 - P.x0 - 1.2)) / 3
    cylinder(white, x, P.y1 - 0.6, 0.4, 3.0, 10.6, 12, 0.36)
    cbox(white, rect(x - 0.55, x + 0.55, P.y1 - 1.15, P.y1 - 0.05), 10.6, 11.0, {}) // the volute capital, simply
  }
  cbox(white, rect(P.x0 - 0.2, P.x1 + 0.2, P.y0, P.y1 + 0.2), 11.0, 12.2, { b: 0.15, bottom: true, top: false })
  gable(slate, white, rect(P.x0 - 0.3, P.x1 + 0.3, P.y0 - 1.5, P.y1 + 0.3), 12.2, 14.8, true, [false, true])
  // the stair down to the walk
  for (let s = 0; s < 6; s++) cbox(white, rect(-1.5, 1.5, P.y1, P.y1 + 3.6 - s * 0.6), 0, 0.5 * (s + 1), { top: true })

  // ---- The garden veranda: basement arcade, floor, colonnade with arches between, balustraded deck.
  const V = rect(-7.6, 7.6, -11.0, -7.7)
  arcade(white, V.x0, V.x1, V.y0, V.y0 + 0.6, 0, 3.0, 7, 1.7, 1.5, 3)
  for (const x of [V.x0, V.x1 - 0.5]) cbox(white, rect(x, x + 0.5, V.y0, V.y1), 0, 3.0, { top: false })
  cbox(white, rect(V.x0 - 0.1, V.x1 + 0.1, V.y0 - 0.1, V.y1), 3.0, 3.35, { bottom: true })
  for (let i = 0; i < 8; i++) cylinder(white, V.x0 + 0.4 + (i * (V.x1 - V.x0 - 0.8)) / 7, V.y0 + 0.35, 0.26, 3.35, 7.4, 10)
  arcade(white, V.x0, V.x1, V.y0, V.y0 + 0.6, 6.6, 8.3, 7, 1.7, 7.0)
  cbox(white, rect(V.x0 - 0.15, V.x1 + 0.15, V.y0 - 0.15, V.y1), 8.3, 8.7, { b: 0.1, bottom: true, top: slate })
  // the deck's balustrade: a pale rail on posts, drawn solid
  cbox(white, rect(V.x0, V.x1, V.y0, V.y0 + 0.3), 8.7, 9.7, { b: 0.08 })
  for (const x of [V.x0, V.x1 - 0.3]) cbox(white, rect(x, x + 0.3, V.y0, V.y1), 8.7, 9.7, { b: 0.08 })
  // the floor's railing, low, either side of the stair
  for (const [a, b] of [[V.x0, -1.6], [1.6, V.x1]]) cbox(white, rect(a, b, V.y0, V.y0 + 0.15), 3.35, 4.3)
  for (let s = 0; s < 6; s++) cbox(white, rect(-1.5, 1.5, V.y0 - 3.6 + s * 0.6, V.y0), 0, 0.5 * (s + 1), { top: true })

  return [
    { part: brick, material: BRICK },
    { part: white, material: PALETTE.trim },
    { part: slate, material: SLATE },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await saveModel('cola-robert-mills-house', 'Robert Mills House', build(), { source: 'generators/cola-robert-mills-house.ts' }, 5000)
}
