/**
 * Christ Church Cathedral (Episcopal), 2919 St. Charles Avenue, New Orleans
 * (1886, Lawrence B. Valk; Gothic Revival) — procedural, CC0-1.0, no textures.
 * bun generators/nola-christ-church-cathedral.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 327.4: model +y runs from St.
 * Charles Avenue (model −y, the entrance front, facing compass 147.4°) up
 * the nave to the apse; model +x runs north-east along the avenue. Built in
 * the lidar frame (centred on −90.08795, 29.93045), then shifted to the
 * area centroid of OSM relation/4596569, which lies at (−3.05, −0.71) in it.
 *
 * Identity, in order: the tall white square tower at the front's north-east
 * corner, with three tall louvred lancets a face in its belfry, an arcaded
 * frieze, a crenellated parapet and four corner pinnacles with red finials;
 * the steep white entrance gable with its big traceried window (three lights
 * and a rose in the head) and the triple-arched porch with pinnacled
 * buttresses below it; the steep dark slate roofs of the cruciform nave,
 * transept and apsed chancel with red ridge cresting; the clerestory row of
 * small lancets over the lean-to aisles; the low white parish buildings
 * around a courtyard to the south-west.
 *
 * NOTE: the lead's brief described "a tall steeply pointed spire". The 1901
 * Detroit Publishing postcard (below) does show a tall slate spire, but every
 * photo from 2008 to 2026 shows the tower ending in its crenellated parapet
 * and four pinnacles. The model follows today's building.
 *
 * Evidence
 * - OSM relation/4596569 (building=yes, height=31.76, no name; outer way
 *   328621651, inner courtyard way 328621647): one multipolygon for the
 *   cathedral and the attached parish buildings round the courtyard. The
 *   place-of-worship node/358384414 "Christ Church Cathedral" stands in it.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in this frame; ground 0.6 over the grid minimum = z 0.
 *   Tower x 14.8..21.3, y −34.2..−27.7, parapet 28.6, pinnacles ~30.9;
 *   nave ridge 19.4 at x 9.4, aisles ~6.5-7.5, clerestory eaves ~11;
 *   transept ridge 19.4 at y −12.25, x −3..22.2; chancel ridge ~14; porch
 *   6.5; west parish range ridge 13.1 / eaves 8.5; north range flat 11.0;
 *   north-west block ~13; north block 8.8 and 4.6; low link 4.6.
 * - NAIP (USGS, public domain): dark slate cross plan, the white tower.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Christ Church Cathedral, St Charles Avenue, Uptown New Orleans March
 *     2025 - 1.jpg" and "- 2.jpg", Infrogmation, CC BY-SA 4.0: the front
 *     face-on (porch, window, gable, tower stages, the parish wing left)
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_St_Charles_Avenue,_Uptown_New_Orleans_March_2025_-_1.jpg
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_St_Charles_Avenue,_Uptown_New_Orleans_March_2025_-_2.jpg
 *   - "... March 2025 - 6.jpg" and "- 8.jpg", Infrogmation, CC BY-SA 4.0:
 *     from the south along the avenue (front and the east side)
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_St_Charles_Avenue,_Uptown_New_Orleans_March_2025_-_6.jpg
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_St_Charles_Avenue,_Uptown_New_Orleans_March_2025_-_8.jpg
 *   - "Christ Church Cathedral, St Charles Avenue Uptown New Orleans 12
 *     March 2026.jpg", Infrogmation, CC BY-SA 4.0: the tower from the east
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_St_Charles_Avenue_Uptown_New_Orleans_12_March_2026.jpg
 *   - "Christ Church Cathedral, New Orleans.jpg", Yair Haklai, CC BY-SA 4.0:
 *     the tower's east face, the transept and clerestory
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral,_New_Orleans.jpg
 *   - "Christ Church New Orleans, Louisiana 2008.jpg", Shubert Ciencia,
 *     CC BY 2.0: the tower, slate roofs, clerestory and transept gable
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_New_Orleans,_Louisiana_2008.jpg
 *   - "Christ Church Cathedral at night NOLA.jpg", Charlie Brenner, CC BY-SA
 *     2.0 (night: the tower floodlit)
 *     https://commons.wikimedia.org/wiki/File:Christ_Church_Cathedral_at_night_NOLA.jpg
 *   - "Christ Church, New Orleans, La (NYPL b12647398-62251).tiff", Detroit
 *     Publishing Co. 1901, public domain: the lost spire (history only)
 *     https://commons.wikimedia.org/wiki/File:Christ_Church,_New_Orleans,_La_(NYPL_b12647398-62251).tiff
 * - Published: Wikipedia, "Christ Church Cathedral (New Orleans)": 1886,
 *   Lawrence B. Valk, Gothic Revival.
 *
 * Measured (lidar): every height and plan dimension above. Estimated from
 * the face-on photos against the lidar tower height: the tower stage lines
 * (7.9, 20.6), belfry lancets (21.0-25.8, 0.85 m wide), frieze 26.3-27.6,
 * the front window (4.5 m wide, 8.3-14.2), the gable (eaves 12.6, apex
 * 20.3), the porch arches, the tower's small lancets and door. The parish
 * buildings are plain masses at lidar heights; their windows are a regular
 * rhythm, not counted from photos except the front arcade wing and the west
 * range's front. Left out: the hood moulds, the porch tracery, gargoyles,
 * the fence.
 *
 * Doubts: the rear (north-west) parish buildings and the chancel are hidden
 * by trees in every photo; their roofs come from lidar only. The courtyard
 * ring's inner faces are plain.
 *
 * Night: the tower and the front are floodlit (`floodlight`), windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, hipRoof } from './nyc-city-hall'
import { quad, tri, slabY, slabX, pointed, rect, disc, buttress, pinnacle, merlons, barCross, rectRing, gableRoof, type Side } from './nola-st-patricks-church'

/** A gable roof with its ridge along x at y = cy (half-width hy), x0..x1. */
function gableRoofX(p: Part, cy: number, hy: number, x0: number, x1: number, ze: number, zr: number, o = 0.3) {
  const ye = hy + o, zo = ze - (o * (zr - ze)) / hy
  for (const s of [-1, 1]) quad(p, [x0, cy + s * ye, zo], [x1, cy + s * ye, zo], [x1, cy, zr], [x0, cy, zr], [0, (s * (zr - ze)) / hy, 1])
}
/** A lean-to roof over x0..x1 (low at xLow side), y0..y1. */
function leanTo(p: Part, xLow: number, xHigh: number, y0: number, y1: number, zLow: number, zHigh: number) {
  const s = Math.sign(xHigh - xLow)
  quad(p, [xLow, y0, zLow], [xHigh, y0, zHigh], [xHigh, y1, zHigh], [xLow, y1, zLow], [-s * (zHigh - zLow) / Math.abs(xHigh - xLow), 0, 1])
  slabY(p, [[xLow, 0], [xHigh, 0], [xHigh, zHigh], [xLow, zLow]].map(([x, z]) => [x, z]) as [number, number][], y0 - 0.01, y0)
}
const flatRoof = (wall: Part, top: Part, x0: number, y0: number, x1: number, y1: number, h: number) =>
  prism({ wall, win: null, roof: top, ring: rectRing(x0, y0, x1, y1), z0: 0, z1: h, facade: null, bevel: 0.2 })

function build() {
  const C: XY = [-3.05, -0.71]
  const stucco = new Part(), trim = new Part(), slate = new Part(), win = new Part(), dark = new Part(), red = new Part()

  // ---------------- Dimensions (lidar, above ground) ----------------
  const NX0 = 5.0, NX1 = 13.8, NC = 9.4, NH = 4.4            // nave
  const FRONT = -32.0, TR0 = -17.0, TR1 = -7.5, TRC = -12.25 // front wall, transept
  const CLER = 11.0, RIDGE = 19.4, AISLE = 6.5, AISLE_IN = 8.5
  const TX0 = 14.8, TX1 = 21.3, TY0 = -34.2, TY1 = -27.7      // tower
  const S1 = 7.9, S2 = 20.6, FR0 = 26.3, FR1 = 27.6, MER = 28.6, PIN = 30.4

  // ---------------- Nave, aisles ----------------
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(NX0, FRONT, NX1, TR1), z0: 0, z1: CLER, facade: null, bevel: 0.1 })
  gableRoof(slate, NC, NH, FRONT + 0.3, TR1, CLER, RIDGE, 0.35)
  block(red, NC - 0.1, FRONT + 0.4, NC + 0.1, TR1, RIDGE - 0.1, RIDGE + 0.35)
  // aisles: west x 1..5 (behind the parish range), east x 13.8..17.8 behind the tower
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(1.0, FRONT + 0.2, NX0, TR0), z0: 0, z1: AISLE, facade: null, bevel: 0.1 })
  leanTo(slate, 0.7, NX0, FRONT + 0.2, TR0, AISLE - 0.15, AISLE_IN)
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(NX1, TY1, 17.8, TR0), z0: 0, z1: AISLE, facade: null, bevel: 0.1 })
  leanTo(slate, 18.1, NX1, TY1, TR0, AISLE - 0.15, AISLE_IN)
  // clerestory: a row of small lancets each side, above the aisle roofs
  for (let y = FRONT + 1.6; y < TR0 - 0.6; y += 1.45) {
    pointed(win, 'west', NX0, y, 0.7, 8.9, 10.5, 0.05)
    pointed(win, 'east', NX1, y, 0.7, 8.9, 10.5, 0.05)
  }
  block(trim, NX0 - 0.25, FRONT + 0.3, NX0, TR1, CLER - 0.4, CLER)
  block(trim, NX1, FRONT + 0.3, NX1 + 0.25, TR1, CLER - 0.4, CLER)
  // east aisle windows and buttresses (between the tower and the transept)
  for (const y of [-24.6, -20.3]) {
    pointed(trim, 'east', 17.8, y, 1.75, 1.9, 5.5, 0.04)
    pointed(win, 'east', 17.8, y, 1.4, 2.1, 5.2, 0.08)
  }
  for (const y of [-26.9, -22.4, -18.2]) buttress(trim, 17.8, y - 0.35, 18.5, y + 0.35, 0, 5.6, 'x', 0.8)

  // ---------------- Front gable, window, porch ----------------
  slabY(stucco, [[4.4, 0], [14.4, 0], [14.4, 12.6], [NC, 20.3], [4.4, 12.6]], FRONT - 0.45, FRONT + 0.3, [NC, 8])
  // coping on the rakes and kneelers
  for (const s of [-1, 1]) {
    const xe = NC + s * 5.0
    slabY(trim, [[xe + s * 0.3, 12.1], [xe + s * 0.3, 12.65], [NC, 20.75], [NC, 20.2]], FRONT - 0.6, FRONT + 0.3, [NC + s * 2.6, 16.4])
    block(trim, Math.min(xe, xe + s * 0.45), FRONT - 0.6, Math.max(xe, xe + s * 0.45), FRONT + 0.3, 11.6, 12.4)
  }
  barCross(red, NC, FRONT - 0.45, 20.6, 1.6, 1.0, 0.24)
  // the great window: surround, glass, two mullions, the rose in the head
  pointed(trim, 'front', FRONT - 0.45, NC, 5.3, 7.9, 14.8, 0.05)
  pointed(win, 'front', FRONT - 0.45, NC, 4.5, 8.3, 14.2, 0.1)
  for (const dx of [-0.75, 0.75]) rect(trim, 'front', FRONT - 0.45, NC + dx, 0.18, 8.3, 11.9, 0.14)
  disc(trim, 'front', FRONT - 0.45, NC, 12.6, 1.05, 0.13, 14)
  disc(win, 'front', FRONT - 0.45, NC, 12.6, 0.8, 0.16, 14)
  block(trim, NC - 2.3, FRONT - 0.7, NC + 2.3, FRONT - 0.45, 7.7, 7.95)
  pointed(win, 'front', FRONT - 0.45, NC, 0.9, 16.3, 17.9, 0.08)
  // aisle fronts either side (west one visible beside the porch)
  // the porch: three pointed arches, pinnacled buttresses, a gable over the middle
  const PY0 = -35.3, PY1 = FRONT - 0.45
  prism({ wall: stucco, win: null, roof: trim, ring: rectRing(3.2, PY0, 14.7, PY1), z0: 0, z1: 7.0, facade: null, bevel: 0.12 })
  const arches: [number, number, number][] = [[5.55, 2.4, 5.7], [8.95, 3.0, 6.5], [12.35, 2.4, 5.7]]
  for (const [x, w, top] of arches) {
    pointed(trim, 'front', PY0, x, w + 0.6, 0.6, top + 0.5, 0.04)
    pointed(dark, 'front', PY0, x, w, 0.6, top, 0.08)
  }
  for (const [x, h] of [[3.55, 8.6], [7.2, 9.6], [10.7, 9.6], [14.35, 8.6]] as [number, number][]) {
    buttress(trim, x - 0.38, PY0 - 0.55, x + 0.38, PY0 + 0.2, 0, h - 1.8, 'y', 0, slate)
    pinnacle(trim, x - 0.3, PY0 - 0.47, x + 0.3, PY0 + 0.12, h - 1.8, h - 0.4, h + 1.0, 0.08)
  }
  slabY(trim, [[7.5, 6.9], [10.4, 6.9], [8.95, 9.0]], PY0 - 0.3, PY0 + 0.2)
  block(trim, 4.0, PY0 - 1.6, 13.9, PY0, 0, 0.55)
  block(trim, 4.4, PY0 - 1.0, 13.5, PY0, 0.55, 0.95)

  // ---------------- Transept ----------------
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(-3.0, TR0, 22.2, TR1), z0: 0, z1: 12.0, facade: null, bevel: 0.1 })
  gableRoofX(slate, TRC, (TR1 - TR0) / 2, -2.8, 22.0, 12.0, RIDGE, 0.35)
  block(red, -2.6, TRC - 0.1, 21.8, TRC + 0.1, RIDGE - 0.1, RIDGE + 0.35)
  for (const x of [-3.0, 22.2]) {
    const s = x > 0 ? 1 : -1
    slabX(stucco, [[TR0, 11.9], [TR1, 11.9], [TRC, 19.9]], s > 0 ? x - 0.3 : x, s > 0 ? x : x + 0.3)
    // copings, a pinnacle at the apex
    slabX(trim, [[TR0 - 0.3, 11.7], [TRC, 20.15], [TR1 + 0.3, 11.7], [TR1 + 0.3, 12.2], [TRC, 20.6], [TR0 - 0.3, 12.2]], s > 0 ? x - 0.1 : x - 0.25, s > 0 ? x + 0.25 : x + 0.1, [TRC, 16])
    pinnacle(trim, x - 0.35, TRC - 0.35, x + 0.35, TRC + 0.35, 20.0, 20.9, 21.8, 0.06)
    for (const y of [TR0, TR1]) buttress(trim, s > 0 ? x : x - 0.8, y - 0.4, s > 0 ? x + 0.8 : x, y + 0.4, 0, 9.5, 'x', 1.0)
    for (const y of [TR0, TR1]) pinnacle(trim, x - 0.3, y - 0.3, x + 0.3, y + 0.3, 10.4, 12.4, 13.6, 0.08)
  }
  pointed(trim, 'east', 22.2, TRC, 3.0, 5.8, 16.1, 0.04)
  pointed(win, 'east', 22.2, TRC, 2.5, 6.2, 15.6, 0.08)
  rect(trim, 'east', 22.2, TRC, 0.18, 6.2, 13.6, 0.12)
  // the transept's east porch with its gabled door
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(22.2, -13.8, 24.0, -8.6), z0: 0, z1: 4.2, facade: null, bevel: 0.08 })
  gableRoof(slate, 23.1, 1.0, -14.0, -8.4, 4.2, 4.2, 0)
  gableRoofX(slate, -11.2, 2.6, 22.2, 24.1, 4.2, 6.4, 0.2)
  slabX(stucco, [[-13.8, 4.1], [-8.6, 4.1], [-11.2, 6.3]], 23.8, 24.0)
  pointed(trim, 'east', 24.0, -11.2, 2.2, 0.4, 3.9, 0.04)
  pointed(dark, 'east', 24.0, -11.2, 1.6, 0.4, 3.5, 0.08)

  // ---------------- Chancel and apse, vestry ----------------
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(NX0, TR1, NX1, 3.5), z0: 0, z1: 10.0, facade: null, bevel: 0.1 })
  gableRoof(slate, NC, NH, TR1, 3.5, 10.0, 14.0, 0.3)
  {
    const r = NH, n = 4, ring: XY[] = []
    for (let k = 0; k <= n; k++) { const a = (k / n) * Math.PI; ring.push([NC + r * Math.cos(a), 3.5 + r * Math.sin(a)]) }
    const apex: V3 = [NC, 3.5, 14.0]
    for (let k = 0; k < n; k++) {
      const a = ring[k], b = ring[k + 1], m = [(a[0] + b[0]) / 2 - NC, (a[1] + b[1]) / 2 - 3.5]
      const nn: V3 = [m[0], m[1], 0]
      quad(stucco, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 10], [a[0], a[1], 10], nn)
      tri(slate, [a[0] + m[0] * 0.07, a[1] + m[1] * 0.07, 9.8], [b[0] + m[0] * 0.07, b[1] + m[1] * 0.07, 9.8], apex, [m[0], m[1], 3])
      const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = [m[0] / r * 0.06, m[1] / r * 0.06]
      const w = 0.6
      quad(win, [c[0] - u[0] * w + o[0], c[1] - u[1] * w + o[1], 3.5], [c[0] + u[0] * w + o[0], c[1] + u[1] * w + o[1], 3.5], [c[0] + u[0] * w + o[0], c[1] + u[1] * w + o[1], 8.0], [c[0] - u[0] * w + o[0], c[1] - u[1] * w + o[1], 8.0], nn)
    }
  }
  flatRoof(stucco, slate, NX1, TR1, 21.7, 2.9, 6.5)

  // ---------------- The tower ----------------
  prism({ wall: stucco, win: null, roof: slate, ring: rectRing(TX0, TY0, TX1, TY1), z0: 0, z1: FR1, facade: null, bevel: 0.12 })
  const ring = rectRing(TX0, TY0, TX1, TY1)
  const bandR = (z0: number, z1: number, d: number) => prism({ wall: trim, win: null, roof: null, ring: rectRing(TX0 - d, TY0 - d, TX1 + d, TY1 + d), z0, z1, facade: null, bevel: 0.1 })
  bandR(S1 - 0.2, S1 + 0.2, 0.15)
  bandR(S2 - 0.25, S2 + 0.25, 0.3)
  bandR(FR0, FR1, 0.25)
  // the crenellated parapet: a wall and four merlons a face
  prism({ wall: trim, win: null, roof: trim, ring: rectRing(TX0 - 0.25, TY0 - 0.25, TX1 + 0.25, TY1 + 0.25), z0: FR1 - 0.05, z1: FR1 + 0.35, facade: null, bevel: 0.05 })
  const t = 0.4, mw = 0.75
  merlons(trim, [TX0 + 1.3, TY0 - 0.05], [TX1 - 1.3, TY0 - 0.05], FR1 + 0.3, MER, 3, mw, t)
  merlons(trim, [TX0 + 1.3, TY1 + 0.05], [TX1 - 1.3, TY1 + 0.05], FR1 + 0.3, MER, 3, mw, t)
  merlons(trim, [TX0 - 0.05, TY0 + 1.3], [TX0 - 0.05, TY1 - 1.3], FR1 + 0.3, MER, 3, mw, t)
  merlons(trim, [TX1 + 0.05, TY0 + 1.3], [TX1 + 0.05, TY1 - 1.3], FR1 + 0.3, MER, 3, mw, t)
  // the frieze's small arches: a dark row of tiny pointed panels just under the parapet
  // corner buttresses (clasping, stepped at the first stage line) and pinnacles
  for (const [cx, cy] of ring) {
    const sx = cx < (TX0 + TX1) / 2 ? -1 : 1, sy = cy < (TY0 + TY1) / 2 ? -1 : 1
    for (const [z0, z1, d] of [[0, S1, 0.55], [S1, S2 - 0.25, 0.35]] as [number, number, number][]) {
      const xa = cx + sx * d, ya = cy + sy * d
      block(trim, Math.min(cx - sx * 0.9, xa), Math.min(cy - sy * 0.9, ya), Math.max(cx - sx * 0.9, xa), Math.max(cy - sy * 0.9, ya), z0, z1)
    }
    // the pinnacle stands on the corner from the frieze up
    const w = 0.95, px = cx + sx * 0.1, py = cy + sy * 0.1
    pinnacle(trim, px - w / 2, py - w / 2, px + w / 2, py + w / 2, FR0 - 0.4, MER + 0.4, PIN, 0.1)
    block(red, px - 0.17, py - 0.17, px + 0.17, py + 0.17, PIN - 0.25, PIN + 0.5)
  }
  // openings per face: [side, wall coordinate, centre along, lower openings?]
  const TCX = (TX0 + TX1) / 2, TCY = (TY0 + TY1) / 2
  const faces: [Side, number, number][] = [['front', TY0, TCX], ['east', TX1, TCY], ['west', TX0, TCY], ['rear', TY1, TCX]]
  for (const [side, c, m] of faces) {
    // belfry: three tall louvred lancets
    for (const k of [-1, 0, 1]) {
      pointed(trim, side, c, m + k * 1.6, 1.25, 20.8, 26.2, 0.04)
      pointed(dark, side, c, m + k * 1.6, 0.85, 20.95, 25.95, 0.08)
    }
    // tall middle lancet with two shorter flanking ones
    if (side !== 'rear' || true) {
      pointed(win, side, c, m, 0.75, 12.0, 18.6, 0.06)
      for (const k of [-1, 1]) pointed(win, side, c, m + k * 1.5, 0.75, 13.6, 16.6, 0.06)
    }
    if (side === 'front' || side === 'east') {
      for (const k of [-1, 0, 1]) pointed(win, side, c, m + k * 1.25, 0.7, 8.6, 10.6, 0.06)
    }
  }
  // the St. Charles face: a single lancet low; the east face: the gabled door
  pointed(win, 'front', TY0, TCX, 0.9, 3.4, 5.9, 0.06)
  pointed(trim, 'east', TX1, TCY, 2.4, 0.5, 4.3, 0.05)
  pointed(dark, 'east', TX1, TCY, 1.5, 0.5, 3.6, 0.1)
  slabX(trim, [[TCY - 1.5, 3.6], [TCY + 1.5, 3.6], [TCY, 5.9]], TX1, TX1 + 0.35)
  block(trim, TX1, TCY - 1.6, TX1 + 1.2, TCY + 1.6, 0, 0.5)

  // ---------------- Parish buildings round the courtyard ----------------
  const fac = { bay: 3.2, ratio: 0.42, floor: 3.4, group: 1, spandrel: 1.2, sill: 1.2, head: 1.2, ground: 1.0, minLength: 4 }
  // west range (hipped, two storeys)
  prism({ wall: stucco, win, roof: null, ring: rectRing(-29.6, -31.3, -19.3, 5.7), z0: 0, z1: 8.5, facade: fac, bevel: 0.15 })
  hipRoof(slate, -29.9, -31.6, -19.0, 6.0, 8.3, 4.8)
  // south arcade wing along the avenue, with its pointed windows and buttresses
  prism({ wall: stucco, win: null, roof: trim, ring: rectRing(-19.3, -28.3, 1.0, -24.2), z0: 0, z1: 5.4, facade: null, bevel: 0.12 })
  for (let k = 0; k < 6; k++) {
    const x = -17.2 + k * 3.1
    for (const dx of [-0.6, 0.6]) {
      pointed(trim, 'front', -28.3, x + dx, 1.0, 1.3, 4.3, 0.04)
      pointed(win, 'front', -28.3, x + dx, 0.75, 1.45, 4.1, 0.08)
    }
    buttress(trim, x + 1.25, -28.85, x + 1.85, -28.3, 0, 5.0, 'y', 0.6)
  }
  prism({ wall: stucco, win: null, roof: trim, ring: rectRing(-1.6, -31.8, 1.0, -24.0), z0: 0, z1: 6.4, facade: null, bevel: 0.12 })
  pinnacle(trim, -1.9, -32.1, -1.1, -31.3, 6.4, 7.6, 9.0, 0.06)
  pointed(win, 'front', -31.8, -0.3, 1.0, 1.6, 4.8, 0.06)
  // east range between courtyard and church (gabled)
  prism({ wall: stucco, win, roof: null, ring: rectRing(-12.2, -24.2, 1.0, -5.4), z0: 0, z1: 7.0, facade: fac, bevel: 0.12 })
  gableRoof(slate, -5.6, 6.6, -24.2, -5.4, 7.0, 11.5, 0.25)
  // north range (flat, three storeys), the north-west block, the links
  prism({ wall: stucco, win, roof: stucco, ring: rectRing(-19.3, -5.4, -3.0, 3.0), z0: 0, z1: 11.0, facade: fac, bevel: 0.2 })
  prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(-3.0, -7.5, 1.0, 3.0), z0: 0, z1: 4.6, facade: null, bevel: 0.15 })
  prism({ wall: stucco, win, roof: stucco, ring: rectRing(-30.1, 5.7, -12.6, 12.1), z0: 0, z1: 9.0, facade: fac, bevel: 0.15 })
  prism({ wall: stucco, win, roof: null, ring: rectRing(-32.1, 12.1, -14.8, 22.9), z0: 0, z1: 10.6, facade: fac, bevel: 0.15 })
  hipRoof(slate, -32.4, 11.8, -14.5, 23.2, 10.4, 2.8)
  prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(-11.1, 3.0, 3.8, 18.3), z0: 0, z1: 4.6, facade: null, bevel: 0.15 })
  prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(-11.1, 18.3, 3.8, 33.4), z0: 0, z1: 4.6, facade: null, bevel: 0.15 })
  prism({ wall: stucco, win, roof: stucco, ring: rectRing(3.8, 18.2, 23.2, 33.3), z0: 0, z1: 8.8, facade: fac, bevel: 0.15 })

  // ---------------- Finish ----------------
  const parts = [stucco, trim, slate, win, dark, red]
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= C[0]; p.pos[i + 2] += C[1] }
  // floodlit: the tower all round, the front gable and porch; the rest faintly
  const TXc = TCX - C[0], TYc = TCY - C[1]
  const lit = (p: V3, n: V3): number => {
    const up = n[2] > 0.7 ? 0.3 : 1
    if (Math.abs(p[0] - TXc) < 4.5 && Math.abs(p[1] - TYc) < 4.5) return up
    if (p[1] < FRONT + 0.5 - C[1] && p[0] > 2 - C[0] && p[0] < 15 - C[0]) return 0.8 * up
    return 0
  }
  finishModel('Christ Church Cathedral', 'nola-christ-church-cathedral', [
    { part: stucco, material: { ...finish('ccc-stucco', 0xece8e0), floodlight: lit } },
    { part: trim, material: { ...finish('ccc-trim', 0xf8f6f1), floodlight: lit } },
    { part: slate, material: finish('ccc-slate', 0x707a84) },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('ccc-louvre', 0x50565e) },
    { part: red, material: finish('ccc-finial', 0xa95a48) },
  ], { bearing: 327.4, osm: 'relation/4596569', height: PIN + 0.5 }, 6500)
}

if (import.meta.main) build()
