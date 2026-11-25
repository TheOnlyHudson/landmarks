/**
 * Agecroft Hall, Richmond — procedural, CC0-1.0, no textures.
 * bun generators/ric-agecroft-hall.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/566134107 (lng -77.5050485, lat 37.5530423). Its
 * walls run at 9.5° and 99.5°, so the model is placed at bearing 99 and
 * built square: model +y points ESE, model +x SSW (toward the James River
 * lawn), model -x NNE (the entrance drive and courtyard).
 *
 * What it is: a late-15th-century Lancashire manor house, taken down in
 * 1925 and rebuilt here in 1926–28 for T. C. Williams Jr. (architect Henry
 * Grant Morse): two storeys of black-and-white half-timbering, cream panels
 * between dark oak posts, rails and chevron braces, under steep brown-grey
 * stone-slate roofs with many gables, tall red-brick chimney stacks, and
 * long bands of leaded windows; the wings wrap a courtyard open to the
 * north-north-east.
 *
 * Covers and replaces: way/566134107 (the one outline).
 *
 * Evidence
 * - OSM (measured): the outline, split here into its wings in the
 *   bearing-99 frame: the river block x 5..16.2, y -8..21.3; the east block
 *   x -4.3..6.7, y 8.4..22.1; the north wing x -18.6..-3.4, y -1.8..8.4; the
 *   link x -2.9..5, y -14.3..-1.9; the west wing x -18.4..0.1,
 *   y -22.6..-14.3; the west bay x -16.9..-9.5, y -28.7..-22.6.
 * - Lidar: not used (a two-storey house; heights from photos).
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Agecroft Hall.jpg" (phoebe reid, CC BY 2.0), the entrance side: the
 *   gabled wings, close studding and chevrons in the gables, the porch;
 *   "Agecroft Hall - front - 20130507 141847.jpg" (Fopseh, CC BY-SA 3.0),
 *   from the drive: the row of gables, the brick chimneys; "Agecroft Hall -
 *   rear - 20130507 132139.jpg" (Fopseh, CC BY-SA 3.0), the river front:
 *   three gables, window bands, the terrace balustrade, the big stack.
 * - Colours from the photos: cream plaster, near-black oak (drawn a warm
 *   charcoal at the palette's limit), brown-grey stone slates, red brick.
 * - Estimated: eaves 6.6 m (two storeys of about 3.2 m, scaled to a door);
 *   roof pitch about 48°; the post spacing (1.5 m, coarser than the real
 *   close studding so it reads at map distance); window positions, from the
 *   photos side by side; chimney positions.
 * - Simplified: no jetties, finials, bargeboards or leading; the terrace
 *   and balustrade (garden) are left to the map.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, gable, panel, qf, type Side, type Rect } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const plaster = new Part(), timber = new Part(), roof = new Part(), win = new Part(), brick = new Part()

const EAVE = 6.6, FLOOR = 3.3, PITCH = Math.tan((48 * Math.PI) / 180)

/** Half-timbering on one wall: sill, floor and wall-plate rails, posts. */
function timbered(side: Side, at: number, a0: number, a1: number, windows: number[]) {
  const d = 0.04, T = 0.24
  panel(timber, side, at, a0, a1, 0, 0.5, d)
  panel(timber, side, at, a0, a1, FLOOR - 0.15, FLOOR + 0.2, d)
  panel(timber, side, at, a0, a1, EAVE - 0.3, EAVE, d)
  const n = Math.max(1, Math.round((a1 - a0) / 1.5))
  for (let k = 0; k <= n; k++) {
    const a = a0 + ((a1 - a0) * k) / n
    panel(timber, side, at, Math.max(a0, a - T / 2), Math.min(a1, a + T / 2), 0.5, EAVE - 0.3, d)
  }
  // window bands: one on each floor at each listed centre
  for (const c of windows) {
    panel(win, side, at, c - 1.3, c + 1.3, 1.2, 2.6, 0.07)
    panel(win, side, at, c - 1.3, c + 1.3, FLOOR + 0.9, FLOOR + 2.4, 0.07)
  }
}

/** A gable end's triangle of timbering: a king post and chevron braces. */
function gableTimber(side: Side, at: number, a0: number, a1: number, rise: number) {
  const n: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const off = 0.05 * (side === 'n' || side === 'e' ? 1 : -1)
  const P = (a: number, z: number): V3 => (side === 'n' || side === 's' ? [a, at + off, z] : [at + off, a, z])
  const m = (a0 + a1) / 2, h = (a1 - a0) / 2, T = 0.24
  qf(timber, P(m - T / 2, EAVE), P(m + T / 2, EAVE), P(m + T / 2, EAVE + rise - 0.6), P(m - T / 2, EAVE + rise - 0.6), n)
  // two chevrons (inverted V braces) on each side of the post
  for (const s of [-1, 1]) {
    for (const f of [0.35, 0.75]) {
      const x0 = m + s * h * f, x1 = m + s * h * (f - 0.3)
      const z0 = EAVE + 0.1, z1 = EAVE + rise * (1 - (f - 0.3)) * 0.72
      qf(timber, P(x0 - T / 2, z0), P(x0 + T / 2, z0), P(x1 + T / 2, z1), P(x1 - T / 2, z1), n)
    }
  }
  qf(win, P(m - 1.0, EAVE + 0.6), P(m + 1.0, EAVE + 0.6), P(m + 1.0, EAVE + 1.7), P(m - 1.0, EAVE + 1.7), [n[0] * 1, n[1] * 1, 0])
}

/** A wing: walls, timbering on the named sides, a gable roof along its long axis. */
function wing(r: Rect, ns: boolean, sides: Partial<Record<Side, number[]>>, gables: Side[]) {
  cbox(plaster, r, 0, EAVE, { top: false })
  const span = ns ? r.x1 - r.x0 : r.y1 - r.y0
  const rise = (span / 2) * PITCH
  // ends at the wall, slates overhanging a little
  gable(roof, plaster, r, EAVE, EAVE + rise, ns)
  const o = 0.35
  gable(roof, plaster, ns ? rect(r.x0 - o, r.x1 + o, r.y0 - o, r.y1 + o) : rect(r.x0 - o, r.x1 + o, r.y0 - o, r.y1 + o), EAVE - o * PITCH, EAVE + rise + 0.05, ns, [false, false])
  // every side is timbered; sides without listed windows get none
  for (const s of ['n', 's', 'e', 'w'] as Side[]) {
    const at = s === 'n' ? r.y1 : s === 's' ? r.y0 : s === 'e' ? r.x1 : r.x0
    const [a0, a1] = s === 'n' || s === 's' ? [r.x0, r.x1] : [r.y0, r.y1]
    timbered(s, at, a0, a1, sides[s] ?? [])
  }
  for (const s of gables) {
    const at = s === 'n' ? r.y1 : s === 's' ? r.y0 : s === 'e' ? r.x1 : r.x0
    const [a0, a1] = s === 'n' || s === 's' ? [r.x0, r.x1] : [r.y0, r.y1]
    gableTimber(s, at, a0, a1, rise)
  }
}

// ---- wings (OSM rectangles)
// the river block: long, ridge along y, gables at both ends
wing(rect(5.02, 16.2, -7.98, 21.26), true, { e: [-3, 4.5, 12, 18], s: [10.6], n: [10.6] }, ['s', 'n'])
// the east block, ridge along x, its gable to the courtyard side (-x)
wing(rect(-4.27, 5.02, 8.38, 22.1), false, { n: [0.4], w: [15.2] }, ['w'])
// north wing into the courtyard, ridge along x, gable to the drive
wing(rect(-18.55, -3.41, -1.82, 8.41), false, { n: [-14, -8], s: [-14, -8] }, ['w'])
// the link behind the courtyard, ridge along y
wing(rect(-2.85, 5.02, -14.33, -1.85), true, { w: [-8] }, [])
// west wing, ridge along x, gable to the drive
wing(rect(-18.4, 0.13, -22.64, -14.29), false, { n: [-12, -5], s: [-6] }, ['w'])
// the west bay (porch and stair), ridge along y, gable to the west
wing(rect(-16.93, -9.54, -28.7, -22.64), true, { s: [], w: [-25.6], e: [-25.6] }, ['s'])
// three cross gables on the river front (rear photo)
for (const c of [-2.5, 7.5, 16.5]) {
  const r = rect(10.0, 16.2, c - 2.7, c + 2.7), rise = 2.7 * PITCH
  gable(roof, plaster, r, EAVE, EAVE + rise, false, [false, true])
  gableTimber('e', 16.2, c - 2.7, c + 2.7, rise)
}
// small fills at the link's corner
cbox(plaster, rect(0.13, 5.02, -16.6, -12.89), 0, EAVE, { top: roof })

// ---- tall brick chimney stacks (photos: a big one on the river front,
// others at the gable ends)
for (const [x, y, h] of [[16.2, 6.5, 13.8], [-18.55, 3.3, 12.6], [-1.0, 22.1, 12.2], [-8.0, -14.3, 12.4]] as [number, number, number][]) {
  cbox(brick, rect(x - 1.0, x + 1.0, y - 0.8, y + 0.8), 0, h, { b: 0.15 })
  cbox(brick, rect(x - 0.8, x - 0.1, y - 0.5, y + 0.5), h, h + 1.2, { b: 0.1 })
  cbox(brick, rect(x + 0.1, x + 0.8, y - 0.5, y + 0.5), h, h + 1.2, { b: 0.1 })
}

if (import.meta.main) {
  await saveModel('ric-agecroft-hall', 'Agecroft Hall', [
    { part: plaster, material: finish('agecroft-plaster', 0xeee2c4) },
    { part: timber, material: finish('agecroft-oak', 0x5a4f47) },
    { part: roof, material: finish('agecroft-stone-slate', 0x9c9286) },
    { part: win, material: PALETTE.window },
    { part: brick, material: finish('agecroft-brick', 0xb67c63) },
  ], { source: 'generators/ric-agecroft-hall.ts', bearing: 99, osm: 'way/566134107', height: 15 }, 5000)
}
