/**
 * The Gowanus "Batcave" (Central Power Station of the Brooklyn Rapid
 * Transit Company, now Powerhouse Arts), 322 3rd Avenue, Gowanus:
 * procedural, CC0-1.0.
 * bun generators/nyc-gowanus-batcave.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 32° (the
 * OSM outline's short sides), so x runs along the building's length at
 * 122°. The origin is the centroid of OSM way/241852634 (wikidata
 * Q48743787 "Gowanus Batcave", height=27.2), on the ground.
 *
 * Identity. OSM's named features near the brief's point (2nd Ave and 7th
 * St) hold no power station; the Batcave is the building tagged with its
 * Wikidata and Wikipedia ids, at 3rd Street and the canal (Powerhouse Arts
 * gives its address as 322 3rd Avenue).
 *
 * Form drawn: the restored building as it stands since 2023, from the May
 * 2026 photos (Epicgenius, below): the 1904 red brick block with its
 * round-arched windows and cornice, and Herzog & de Meuron's new, taller
 * brick block at the canal end (Powerhouse Arts; Wikipedia
 * "Gowanus Batcave").
 *
 * Numbers:
 *   plan 51 x 33 m with a 6 m bay on the east end: OSM.
 *   old walls 23.5 m: measured, lidar (USGS NY_NewYorkCity, 2017, when the
 *     building was a roofless shell: wall tops 28–29 m over ground at
 *     5 m above the box's lowest return); the east bay 22 m.
 *   the new block at the west (canal) end, x < -10: 31 m with a plain
 *     crown set back to 34 m, two tiers of tall round-headed windows:
 *     estimated from "Gowanus batcave new addition (74959)" and "Gowanus
 *     Brooklyn May 2026 01" and "04" (its top about a third over the old
 *     cornice; it post-dates the lidar, and OSM's 27.2 m predates it).
 *     Which end it is: "May 2026 01" looks south with the blue CubeSmart
 *     (east of the Batcave) on its left and the tall block on its right.
 *   arched windows: ten bays on the long sides, six on the ends; a row of
 *     small ground-floor windows tall round-headed windows over two
 *     storeys and an attic row under the cornice: estimated from "Gowanus Brooklyn May 2026 06" and "04".
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Gowanus Brooklyn May 2026 01", "02", "04", "06", Epicgenius,
 *     CC BY-SA 4.0 (restored, from the canal, 3rd Street and the corner)
 *   "Gowanus Batcave (93857)", Rhododendrites, CC BY-SA 4.0
 *   "Gowanus batcave new addition (74959)", Rhododendrites, CC BY-SA 4.0
 *     (under construction, the end wall's two tiers of arches)
 * Look-only: none.
 *
 * Night: the windows glow (it is an arts centre in use).
 *
 * Doubts: the new storeys' exact plan and heights; the lidar's shell is
 * offset ~5 m from the OSM outline, which is followed; the canal-side
 * wall's windows are as on the others.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'

const X0 = -28.1, X1 = 22.6, Y0 = -16.5, Y1 = 16.4, WALL = 23.5
const brick = new Part(), add = new Part(), win = new Part(), roof = new Part()
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

prism({ wall: brick, win: null, roof, ring: rect(X0, Y0, X1, Y1), z0: 0, z1: WALL, facade: null, bevel: 0.4 })
prism({ wall: brick, win: null, roof, ring: rect(X1 - 0.5, -14.3, 28.7, 14.8), z0: 0, z1: 22, facade: null, bevel: 0.3 })
// A water table: a plinth band 0.2 m proud round the foot of the walls,
// its ring split every 2 m so the model's foot is sampled all along it.
const dense = (r: XY[], step = 2): XY[] => r.flatMap((a, i) => {
  const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
  return Array.from({ length: n }, (_, k) => [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n] as XY)
})
prism({ wall: brick, win: null, roof: null, ring: dense(rect(X0 - 0.2, Y0 - 0.2, X1 + 0.2, Y1 + 0.2)), z0: 0, z1: 1.3, facade: null, bevel: 0.1 })
prism({ wall: brick, win: null, roof: null, ring: dense(rect(X1, -14.5, 28.9, 15.0)), z0: 0, z1: 1.3, facade: null, bevel: 0.1 })
// The cornice: a projecting band under the parapet.
prism({ wall: brick, win: null, roof: null, ring: rect(X0 - 0.45, Y0 - 0.45, X1 + 0.45, Y1 + 0.45), z0: WALL - 3.2, z1: WALL - 2.2, facade: null, bevel: 0.25 })

/** A window panel 0.05 m proud of wall a→b (outside to the right), centred s, w wide, z0..z1, round head optional. */
function panel(a: XY, b: XY, s: number, w: number, z0: number, z1: number, round: boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * 0.05, a[1] + u[1] * t + n[1] * 0.05, z]
  const r = w / 2, zs = round ? z1 - r : z1
  win.quad(P(s - r, z0), P(s + r, z0), P(s + r, zs), P(s - r, zs))
  if (!round) return
  for (let k = 0; k < 8; k++) {
    const t0 = Math.PI - (k / 8) * Math.PI, t1 = Math.PI - ((k + 1) / 8) * Math.PI
    win.tri(P(s, zs), P(s + r * Math.cos(t1), zs + r * Math.sin(t1)), P(s + r * Math.cos(t0), zs + r * Math.sin(t0)))
  }
}
function bays(a: XY, b: XY, n: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = 2.2, p = (L - 2 * m) / n
  for (let k = 0; k < n; k++) {
    const s = m + p * (k + 0.5)
    panel(a, b, s, 1.9, 1.6, 4.4, false)            // ground-floor windows
    panel(a, b, s, 2.4, 6.0, 15.0, true)            // tall round-headed windows
    panel(a, b, s, 2.0, 16.6, 18.8, false)          // the attic row under the cornice
  }
}
/** The new block's two tiers of tall arched windows. */
function tiers(a: XY, b: XY, n: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = 1.8, p = (L - 2 * m) / n
  for (let k = 0; k < n; k++) {
    const s = m + p * (k + 0.5)
    panel(a, b, s, 2.2, 5.5, 15.5, true)
    panel(a, b, s, 2.2, 17.5, 27.0, true)
  }
}
// The 1904 block (east two thirds): its long sides and the east bay.
const XW = -10
bays([XW, Y0], [X1, Y0], 7)
bays([X1, Y1], [XW, Y1], 7)
bays([28.7, -14.3], [28.7, 14.8], 5)

// The new brick block at the west (canal) end, taller, with its own two
// tiers of tall arches, and a plain stepped crown set back on top.
const NEW = 31
prism({ wall: add, win: null, roof, ring: dense(rect(X0 - 0.2, Y0 - 0.2, XW, Y1 + 0.2)), z0: 0, z1: NEW, facade: null, bevel: 0.35 })
tiers([X0 - 0.2, Y0 - 0.2], [XW, Y0 - 0.2], 4)
tiers([XW, Y1 + 0.2], [X0 - 0.2, Y1 + 0.2], 4)
tiers([X0 - 0.2, Y1 + 0.2], [X0 - 0.2, Y0 - 0.2], 7)
prism({ wall: add, win: null, roof, ring: rect(X0 + 2.5, Y0 + 2.5, XW - 3, Y1 - 2.5), z0: NEW - 0.3, z1: NEW + 3, facade: null, bevel: 0.3 })

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: brick, material: finish('batcave-brick', 0xa4604c) },
  { part: add, material: finish('batcave-new-brick', 0x985646) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
finishModel('Gowanus Batcave', 'nyc-gowanus-batcave', parts, { bearing: 32, elevation: 0, height: 34, osm: 'way/241852634' })
