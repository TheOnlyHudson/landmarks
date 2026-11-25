/**
 * Central National Bank Building, Richmond — procedural, CC0-1.0, no
 * textures.
 * bun generators/ric-central-national-bank.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/264502225 (lng -77.4397879, lat 37.5438789). Its
 * walls run at 37° and 127°, square to the street grid, so the model is
 * placed at bearing 37 and built square: model +y (north) is the Broad
 * Street front, model -x (west) the 3rd Street side.
 *
 * What it is: John Eberson's Art Deco bank tower (1929–30), 23 storeys of
 * buff brick on a grey limestone base. The Broad Street base carries a
 * great round-arched entrance; above it the shaft has solid corner piers
 * with single punched windows and, between them, a recessed band of
 * continuous window strips with dark spandrels. The back (south) of the
 * tower steps down in setbacks to a 16-storey rear block along 3rd Street;
 * the corners step in at the top under a chamfered crown with a dark
 * geometric frieze. A low wing runs east at the back.
 *
 * Covers and replaces: way/264502225 (the outline) and its building:part
 * way/264502224 (the tower, height 85.95 m).
 *
 * Evidence
 * - OSM (measured): outline and tower part, read in the bearing-37 frame:
 *   tower x -10.4..7.5, y 0.7..23.6; rear block y -20..0.7 on the same width;
 *   low east wing x 7.5..18.3, y -20..-11.8.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 1 m grid,
 *   read every 2 m in this frame (measured; model z = lidar - 0.4, the
 *   streets being flat): rear block 51.5 (y -20..-14) and 56.5 (y -14..0);
 *   the tower's setbacks on its south side 57.6, 67.8 (y 7..9.5), 75.4
 *   (y 9.5..12); the top 79.8 over y 12..23.6, crown about 80.6, bulkhead
 *   85.5 (OSM's 85.95); low east wing 12.6. The lidar's tall cells sit about
 *   2 m west of OSM's outline (a registration offset); OSM's plan is kept.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Central National Bank, Richmond, Virginia June04.JPG" (Morgan Riley,
 *   CC BY-SA 3.0), up the 3rd Street side: corner piers with punched
 *   windows, the recessed strip band, the stepped corners and crown;
 *   "Central National Bank Building, Richmond.jpg" (Taber Andrew Bain,
 *   CC BY 2.0), the crown close up: five strips between the piers, the
 *   chamfered top, the dark zig-zag frieze; "Central National Bank.jpg"
 *   (Bdl2001, CC BY 4.0), from Broad and 3rd: the limestone base (about
 *   20 m, cornice at 14 m), the arched entrance, the rear block's 16 storeys.
 * - Colours from the photos: buff-cream brick, pale grey limestone, the
 *   frieze near-black with tan (drawn charcoal), pulled to the palette.
 * - Estimated: the arch (6.5 m wide, springing at 9 m, from the Bdl2001
 *   photo scaled to the 18 m front); the bay count on the rear block and the
 *   east faces (photographed only obliquely); storey groups of three.
 * - Simplified: no punched-window dot grid: the piers' windows are narrow
 *   panels grouped three storeys high; no fire escape, medallions, mast.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect, arc, type Side, type Rect } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const brick = new Part(), lime = new Part(), win = new Part(), roof = new Part(), frieze = new Part()

// ---- Plan (OSM) and heights (lidar)
const X0 = -10.4, X1 = 7.5, YN = 23.6, YT = 0.7, YS = -20
const BASE = 20, CORN = 14

/** A round-headed opening: jambs and a semicircular head, flat on a wall. */
function archPanel(p: Part, side: Side, at: number, c: number, w: number, z0: number, zs: number, d = 0.05) {
  panel(p, side, at, c - w / 2, c + w / 2, z0, zs, d)
  const pts = arc(0, 0, w / 2, 0, 180, 10)
  const sgn = side === 's' || side === 'w' ? -1 : 1
  const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const P = (q: [number, number]): V3 => (side === 's' || side === 'n' ? [c + q[0], at + sgn * d, zs + q[1]] : [at + sgn * d, c + q[0], zs + q[1]])
  for (let k = 0; k < pts.length - 1; k++) {
    const t: V3[] = [P([0, 0]), P(pts[k]), P(pts[k + 1])]
    const f = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], g = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]]
    const cr = [f[1] * g[2] - f[2] * g[1], f[2] * g[0] - f[0] * g[2], f[0] * g[1] - f[1] * g[0]]
    if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] >= 0) p.tri(t[0], t[1], t[2])
    else p.tri(t[0], t[2], t[1])
  }
}

/**
 * One face of the brick shaft between z0 and z1: corner piers with narrow
 * window panels, and a recessed middle band of `n` strips with spandrels
 * every three storeys.
 */
function shaftFace(side: Side, at: number, a0: number, a1: number, z0: number, z1: number, n: number, pier = 3.2) {
  const STORY = 3.4, G = 3 * STORY
  const m0 = a0 + pier, m1 = a1 - pier, bay = (m1 - m0) / n
  for (let z = z0 + 0.6; z + 2 < z1; z += G) {
    const zt = Math.min(z + G - 0.9, z1 - 0.6)
    for (let k = 0; k < n; k++) {
      const c = m0 + (k + 0.5) * bay
      panel(win, side, at, c - bay * 0.28, c + bay * 0.28, z, zt, 0.05)
    }
    for (const c of [a0 + pier / 2, a1 - pier / 2]) panel(win, side, at, c - 0.45, c + 0.45, z + 0.3, zt - 0.3, 0.05)
  }
}

// ===========================================================================
// Rear block along 3rd Street, stepping 51.5 / 56.5
cbox(brick, rect(X0, X1, YS, -14), 0, 51.5, { b: 0.3, top: roof })
cbox(brick, rect(X0, X1, -14, YT + 0.01), 0, 56.5, { b: 0.3, top: roof })
for (const [side, at] of [['w', X0], ['e', X1]] as [Side, number][]) {
  // rear block's sides: six bays of window strips over a plain base
  for (let k = 0; k < 6; k++) {
    const c = YS + 1.5 + (k + 0.5) * ((YT - YS - 3) / 6)
    for (let z = 15.6; z + 2 < 51; z += 10.2) panel(win, side, at, c - 1.0, c + 1.0, z, Math.min(z + 9.3, 50.6), 0.05)
  }
}
for (let k = 0; k < 5; k++) {
  const c = X0 + 1.6 + (k + 0.5) * ((X1 - X0 - 3.2) / 5)
  for (let z = 15.6; z + 2 < 51; z += 10.2) panel(win, 's', YS, c - 1.0, c + 1.0, z, Math.min(z + 9.3, 50.6), 0.05)
}
// low east wing at the back
cbox(brick, rect(X1, 18.3, YS, -11.8), 0, 12.6, { b: 0.3, top: roof })
for (const c of [-17.5, -14.2]) panel(win, 'e', 18.3, c - 1.1, c + 1.1, 3, 11, 0.05)

// ===========================================================================
// The tower: limestone base, then brick shaft with setbacks on the south.
const T: Rect = rect(X0, X1, YT, YN)
cbox(lime, T, 0, CORN, { top: false })
cbox(lime, grow(T, 0.35), CORN, CORN + 0.6, { b: 0.25, bottom: true, top: false })
cbox(lime, T, CORN + 0.6, BASE, { top: false })
cbox(lime, grow(T, 0.2), BASE - 0.5, BASE, { b: 0.15, bottom: true, top: false })
// Broad Street front: the great arch and two small arched doors; a window
// band in the upper base
const AX = (X0 + X1) / 2
archPanel(win, 'n', YN, AX + 2.6, 6.5, 0, 9.0)
archPanel(win, 'n', YN, X0 + 2.4, 1.8, 0, 3.2)
archPanel(win, 'n', YN, X1 - 1.2, 1.8, 0, 3.2)
for (let k = 0; k < 8; k++) {
  const c = X0 + 1.2 + (k + 0.5) * ((X1 - X0 - 2.4) / 8)
  panel(win, 'n', YN, c - 0.6, c + 0.6, 15.3, 18.6, 0.05)
}
// 3rd Street side of the base: tall windows
for (const c of [4.5, 9.5, 14.5, 19.5]) {
  panel(win, 'w', X0, c - 1.2, c + 1.2, 2.5, 12.5, 0.05)
  panel(win, 'w', X0, c - 0.7, c + 0.7, 15.3, 18.6, 0.05)
}

// shaft tiers (south setbacks)
const tiers: [number, number][] = [[YT, 57.6], [7, 67.8], [9.5, 75.4], [12, 77.4]]
for (const [y0, z1] of tiers) {
  cbox(brick, rect(X0, X1, y0, YN), BASE, z1, { b: 0.3, top: roof })
  shaftFace('s', y0, X0, X1, Math.max(BASE, y0 === YT ? 56.5 : 0), z1, 5)
}
shaftFace('n', YN, X0, X1, BASE, 77.4, 5)
for (const [y0, , z0, z1] of [[YT, 0, 56.5, 57.6], [7, 0, 57.6, 67.8], [9.5, 0, 67.8, 75.4], [12, 0, 75.4, 77.4]] as number[][]) {
  shaftFace('w', X0, y0, YN, z0, z1, 6)
  shaftFace('e', X1, y0, YN, z0, z1, 6)
}
// the tower's sides below the rear block's roof, on the east (above the
// neighbour at 12.6) and the west above the base
shaftFace('e', X1, YT, YN, BASE, 56.5, 6)
shaftFace('w', X0, YT, YN, BASE, 56.5, 6)

// ---- the crown: corners step in, a chamfered top with a dark frieze
const CR = rect(X0 + 1.6, X1 - 1.6, 13.0, YN - 0.3)
cbox(brick, CR, 77.4, 78.0, { c: 1.6, top: false })
cbox(frieze, grow(CR, 0.05), 78.0, 79.6, { c: 1.6, top: false })
cbox(brick, CR, 79.6, 80.6, { c: 1.6, b: 0.25, top: roof })
// corner piers' stepped heads: small blocks at the four corners of the top
for (const [x0, x1] of [[X0, X0 + 1.6], [X1 - 1.6, X1]]) {
  for (const [y0, y1] of [[12, 13.6], [YN - 1.6, YN]]) cbox(brick, rect(x0, x1, y0, y1), 77.4, 78.6, { b: 0.3 })
}
// rooftop bulkhead
cbox(brick, rect(AX - 2.2, AX + 2.2, 16, 20), 80.6, 85.5, { b: 0.3, top: roof })

if (import.meta.main) {
  await saveModel('ric-central-national-bank', 'Central National Bank Building', [
    { part: brick, material: finish('cnb-buff-brick', 0xe6dcc2) },
    { part: lime, material: finish('cnb-limestone', 0xe4e1d9) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: frieze, material: finish('cnb-frieze', 0x5e5852) },
  ], { source: 'generators/ric-central-national-bank.ts', bearing: 37, osm: 'way/264502225', height: 85.5 }, 5000)
}
