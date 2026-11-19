/**
 * Old Ursuline Convent (1745-52) and St. Mary's Church (1845), 1100-1116
 * Chartres Street, New Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-old-ursuline-convent.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 128.3, square to Chartres Street:
 * model −y faces compass 308.3, toward Chartres (the garden front of the
 * convent and the church's gable front); model +x runs along Chartres toward
 * Ursulines Avenue (compass 218.3). Anchor: the area centroid of OSM
 * way/345252754 (-90.060391, 29.960773).
 *
 * What is drawn: OSM maps the convent and St. Mary's Church as one outline
 * (way/345252754, the L: the church x −22.7..−7.8, y −26..5.1, its gable on
 * Chartres; the convent x −20.9..34.1, y −2.0..13.7 behind the garden); the
 * porter's lodge on Chartres is its own way (way/345253248, the one OSM
 * names "Old Ursuline Convent Museum"). Both are replaced. Also drawn,
 * though OSM has no building for them: the stuccoed garden walls along
 * Chartres and Ursulines with their gate piers (every street photo shows
 * them as part of the place). Left out: the separate two-storey building
 * toward Ursulines (way/345253352), the garden, the iron bell frame.
 *
 * Identity, in order: the long, pale two-storey convent with its steep slate
 * hipped roof, gabled dormers and two brick chimneys; the three-bay central
 * pavilion with its pediment and oculus and the arched porch carrying a
 * balustraded balcony; grey shutters at every window; St. Mary's gable front
 * on Chartres (corner pilasters, entablature, pediment, rose window, door);
 * the church's pilastered side with round-headed windows; the low hipped
 * porter's lodge and the garden walls.
 *
 * Evidence
 * - OSM way/345252754 (outline of convent + church; its height=23.9 from
 *   Microsoft footprints is wrong), way/345253248 (lodge, height 9.1, also
 *   too high).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid, read in the model frame; ground 0.7 over the grid's minimum
 *   all round (z = 0). Convent: roof edge ~9.0 at the front wall, ridge 15.3
 *   at y ≈ 5-6 running to x ≈ 31 (a steep hip to the Ursulines end at
 *   x = 34.1), the west end hipped behind the church; chimney returns at
 *   x ≈ 20 and 28 (16.2-16.4). Church: eaves 11.4, ridge 15.5 on its centre
 *   line. Porch 4.6, lodge eaves ~3.6 and ridge ~5.3. Garden walls ~2.2-2.4
 *   with gaps at the gates (x 37.5-40.5 vehicle gate, 41.4-42.4 wicket).
 * - Terrain (Mapterhorn): flat within 1 m. elevation 0.
 * - NAIP (USGS, public domain): the L plan, the garden, the lodge.
 * - Photos (all evidence):
 *   - "Old Ursuline Convent 01.jpg", Turbine682, CC BY-SA 4.0: from the
 *     Chartres/Ursulines corner — convent front, church side, lodge, walls
 *     https://commons.wikimedia.org/wiki/File:Old_Ursuline_Convent_01.jpg
 *   - "UrsulinesFQExtChartresSideFascadeMainDiagonal.JPG", Infrogmation of
 *     New Orleans, CC BY 3.0: the garden front, pavilion, porch, dormers
 *     https://commons.wikimedia.org/wiki/File:UrsulinesFQExtChartresSideFascadeMainDiagonal.JPG
 *   - "UConvent2003Mbtrama.jpg", mbtr (Flickr), CC BY 2.0: the pavilion
 *     face-on — bay widths, storey heights, the window and dormer sizes
 *     https://commons.wikimedia.org/wiki/File:UConvent2003Mbtrama.jpg
 *   - "Old Ursuline Convent, New Orleans, LA.jpg", TexasExplorer98,
 *     CC BY 2.0: the whole group from across Chartres/Ursulines
 *     https://commons.wikimedia.org/wiki/File:Old_Ursuline_Convent,_New_Orleans,_LA.jpg
 *   - "Chartres14Jan2008UrsulineConvent.jpg", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: the Ursulines end, the steep hip, chimneys, the gates
 *     https://commons.wikimedia.org/wiki/File:Chartres14Jan2008UrsulineConvent.jpg
 *   - "Old Ursuline Convent 02.jpg", Turbine682, CC BY-SA 4.0: the corner
 *     gate piers and walls
 *     https://commons.wikimedia.org/wiki/File:Old_Ursuline_Convent_02.jpg
 *   - "St. Mary's Catholic Church, New Orleans.JPG", Brendan J. O'Reilly,
 *     CC BY-SA 3.0: the church's gable front (pilasters, entablature, rose
 *     window, door)
 *     https://commons.wikimedia.org/wiki/File:St._Mary%27s_Catholic_Church,_New_Orleans.JPG
 * - Published: Wikipedia, "Old Ursuline Convent": completed 1752-53, the
 *   oldest building in the Mississippi Valley; St. Mary's Church added 1845.
 *
 * Measured (lidar): every plan dimension (from OSM, checked on the grid),
 * the roof edge, ridge and hip ends, the church's eaves and ridge, the
 * lodge, the walls and gate gaps. Estimated from the face-on photo (47 px/m
 * on the 2.95 m bays): the bay rhythm (4 bays west of the pavilion, the
 * 12.6 m three-bay pavilion, 6 bays east), storey band 4.0, windows
 * 0.9-3.2 and 5.15-7.75, cornice 9.0, pediment apex 13.2, dormers on the
 * 2nd and 4th west bays and the 1st, 3rd and 5th east bays. Church front
 * from O'Reilly's photo: pilasters, the entablature 10.3-11.4, rose window
 * ~1.9 m radius at 7.6, door 2 m. Church side windows from Turbine682's
 * photo (five bays, ~1.6 m wide, 2.6-6.8).
 * Invented (no photo): the rear (courtyard) side is given the front's
 * window rhythm and no dormers; the Ursulines end has three bays.
 *
 * Doubts: the assignment mentions a bell tower for St. Mary's; no photo or
 * lidar return shows one. What stands above the roofs at the church's rear
 * is the raised gable wall where the church meets the convent roof, drawn
 * as that. The convent's two chimney positions rest on lidar spikes.
 *
 * Night: windows glow (`window`); the walls stay unlit.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { block, archPanel, rectPanel, discPanel, band, parapet, hipRoof } from './nyc-city-hall'
import { archWall, wbox, wpoly, pilaster, quadN, triN, walls, type Face } from './nola-cabildo'

const stucco = new Part(), trim = new Part(), slate = new Part(), win = new Part(), shut = new Part(), brick = new Part()

// ─── Plan (model frame, from OSM / lidar) ───
const CX0 = -20.9, CX1 = 34.12, CY0 = -1.95, CY1 = 13.7 // convent block
const KX0 = -22.73, KX1 = -7.76, KY0 = -25.97, KY1 = 5.06 // church
const EAVE = 9.0, RIDGE = 15.3
const K_EAVE = 11.4, K_RIDGE = 15.6
const PAV0 = 4.2, PAV1 = 16.8, PAVC = 10.5, PAV_D = 0.25 // pavilion

/** A face along +x at y (outside toward −y): s = x − x0. */
const frontFace = (x0: number, x1: number, y: number): Face => ({ a: [x0, y], b: [x1, y] })

/** A hipped roof over a rectangle, ridge along x at height zr, the ridge's ends k0/k1 in from the ends. With a soffit. */
function hipX(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, zr: number, k0: number, k1: number) {
  const yr = (y0 + y1) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const R0: V3 = [x0 + k0, yr, zr], R1: V3 = [x1 - k1, yr, zr]
  quadN(p, A, B, R1, R0, [0, -1, 1]); quadN(p, C, D, R0, R1, [0, 1, 1])
  triN(p, B, C, R1, [1, 0, 0.5]); triN(p, D, A, R0, [-1, 0, 0.5])
  quadN(p, A, B, C, D, [0, 0, -1])
}

/** A window with its pale frame and a pair of open grey shutters. */
function shuttered(F: Face, s: number, z0: number, z1: number, w = 0.95) {
  rectPanel(trim, F.a, F.b, s, w + 0.24, z0 - 0.12, z1 + 0.12, 0.04)
  rectPanel(win, F.a, F.b, s, w, z0, z1, 0.07)
  for (const k of [-1, 1]) rectPanel(shut, F.a, F.b, s + k * (w / 2 + 0.36), 0.44, z0, z1, 0.07)
}

/** Roof height of the convent's front slope at y. */
const roofFront = (y: number) => 8.85 + (y - (CY0 - 0.35)) * ((RIDGE - 8.85) / ((CY1 - CY0 + 0.7) / 2))
const roofRear = (y: number) => 8.85 + ((CY1 + 0.35) - y) * ((RIDGE - 8.85) / ((CY1 - CY0 + 0.7) / 2))

/** A gabled dormer on the convent's front (sign −1) or rear (+1) slope at x. */
function dormer(x: number, side: -1 | 1 = -1) {
  const yf = side < 0 ? CY0 + 1.3 : CY1 - 1.3, ybk = side < 0 ? CY0 + 5.2 : CY1 - 5.2
  const zr = side < 0 ? roofFront(yf) : roofRear(yf)
  const h = 1.0, zc = 11.8, za = 12.85
  block(slate, x - h, Math.min(yf, ybk), x + h, Math.max(yf, ybk), zr - 0.3, zc)
  const F: Face = side < 0 ? { a: [x - h, yf], b: [x + h, yf] } : { a: [x + h, yf], b: [x - h, yf] }
  rectPanel(trim, F.a, F.b, h, 2 * h, zr - 0.3, zc, 0.03)
  wpoly(trim, F, [[-0.12, zc - 0.05], [2 * h + 0.12, zc - 0.05], [h, za]], -0.05, 0.12)
  archPanel(win, F.a, F.b, h, 1.2, zr + 0.1, zc - 0.1, 0.06, 6)
  const yo = yf + side * -0.3, yb = ybk + side * 0.3
  quadN(slate, [x - h - 0.2, yo, zc - 0.12], [x, yo, za + 0.1], [x, yb, za + 0.1], [x - h - 0.2, yb, zc - 0.12], [-1, 0, 1.2])
  quadN(slate, [x + h + 0.2, yo, zc - 0.12], [x, yo, za + 0.1], [x, yb, za + 0.1], [x + h + 0.2, yb, zc - 0.12], [1, 0, 1.2])
}

function chimney(p: Part, x: number, y: number, z0: number, z1: number, hx = 0.55, hy = 0.4) {
  block(p, x - hx, y - hy, x + hx, y + hy, z0, z1)
  block(trim, x - hx - 0.1, y - hy - 0.1, x + hx + 0.1, y + hy + 0.1, z1, z1 + 0.22)
}

// ═════════════════════════════ The convent ═════════════════════════════
walls(stucco, CX0, CY0, CX1, CY1, 0, EAVE)
const convRing: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, CY1], [CX0, CY1]]
band(trim, convRing, EAVE - 0.3, EAVE, 0.3)     // the cornice
band(stucco, convRing, 3.85, 4.15, 0.1)          // the storey band
band(stucco, convRing, 0, 0.45, 0.08)            // the plinth
hipX(slate, CX0 - 0.35, CY0 - 0.35, CX1 + 0.35, CY1 + 0.35, 8.85, RIDGE, 6.8, 2.6)

// Front: 4 bays west of the pavilion, 6 east.
const front = frontFace(CX0, CX1, CY0)
const sOf = (x: number) => x - CX0
const westBays = Array.from({ length: 4 }, (_, i) => KX1 + ((PAV0 - KX1) * (i + 0.5)) / 4)
const eastBays = Array.from({ length: 6 }, (_, i) => PAV1 + ((CX1 - PAV1) * (i + 0.5)) / 6)
for (const x of [...westBays, ...eastBays]) {
  shuttered(front, sOf(x), 0.9, 3.2)
  shuttered(front, sOf(x), 5.15, 7.75)
}
for (const i of [1, 3]) dormer(westBays[i])
for (const i of [0, 2, 4]) dormer(eastBays[i])
chimney(brick, 20.0, 5.6, 12, 16.9)
chimney(brick, 28.0, 5.6, 12, 16.9)

// The pavilion: a shallow projection with quoins, its own cornice and the pediment.
block(stucco, PAV0, CY0 - PAV_D, PAV1, CY0, 0, EAVE)
const pv = frontFace(PAV0, PAV1, CY0 - PAV_D), PW = PAV1 - PAV0, ps = PAVC - PAV0
for (const s of [0.45, PW - 0.45]) pilaster(trim, pv, s, 0.9, 0.14, 0.45, EAVE - 0.3)
wbox(trim, pv, -0.3, PW + 0.3, -0.05, 0.4, EAVE - 0.35, EAVE)
for (const x of [PAVC - 4.0, PAVC + 4.0]) { shuttered(pv, x - PAV0, 0.9, 3.2); shuttered(pv, x - PAV0, 5.15, 7.75) }
// tympanum, raking cornices, the oculus, and the short roof behind
const PA = 13.2
wpoly(stucco, pv, [[0, EAVE], [PW, EAVE], [ps, PA - 0.3]], -0.4, 0.12)
wpoly(trim, pv, [[-0.3, EAVE - 0.05], [0.55, EAVE - 0.05], [ps, PA - 0.35], [ps, PA + 0.2]], -0.05, 0.4)
wpoly(trim, pv, [[PW - 0.55, EAVE - 0.05], [PW + 0.3, EAVE - 0.05], [ps, PA + 0.2], [ps, PA - 0.35]], -0.05, 0.4)
discPanel(trim, pv.a, pv.b, ps, 11.0, 0.68, 0.16, 14)
discPanel(win, pv.a, pv.b, ps, 11.0, 0.48, 0.19, 14)
{
  const yb = 3.6, yo = CY0 - PAV_D - 0.45
  quadN(slate, [PAV0 - 0.35, yo, EAVE - 0.05], [PAVC, yo, PA + 0.25], [PAVC, yb, PA + 0.25], [PAV0 - 0.35, yb, EAVE - 0.05], [-0.6, 0, 1])
  quadN(slate, [PAV1 + 0.35, yo, EAVE - 0.05], [PAVC, yo, PA + 0.25], [PAVC, yb, PA + 0.25], [PAV1 + 0.35, yb, EAVE - 0.05], [0.6, 0, 1])
}
// The arched porch with the balcony on it, and the arched door behind the balustrade.
{
  const x0 = PAVC - 1.95, x1 = PAVC + 1.95, y0 = -5.54, y1 = CY0 - PAV_D, zt = 4.0
  archWall(stucco, frontFace(x0, x1, y0), 0, x1 - x0, 0, zt, 0.5, [{ c: 1.95, w: 2.5, top: 3.55 }])
  archWall(stucco, { a: [x0, y1], b: [x0, y0] }, 0, y1 - y0, 0, zt, 0.45, [{ c: (y1 - y0) / 2, w: 1.7, top: 3.2 }])
  archWall(stucco, { a: [x1, y0], b: [x1, y1] }, 0, y1 - y0, 0, zt, 0.45, [{ c: (y1 - y0) / 2, w: 1.7, top: 3.2 }])
  block(trim, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1, zt, zt + 0.35)
  parapet(trim, [[x0 - 0.05, y0 - 0.05], [x1 + 0.05, y0 - 0.05], [x1 + 0.05, y1], [x0 - 0.05, y1]], zt + 0.35, zt + 1.25, 0.22)
  for (const [x, y] of [[x0 + 0.15, y0 + 0.15], [x1 - 0.15, y0 + 0.15]]) block(trim, x - 0.3, y - 0.3, x + 0.3, y + 0.3, zt + 0.35, zt + 1.45)
  for (const k of [-1, 1]) pilaster(trim, frontFace(x0, x1, y0), 1.95 + k * 1.6, 0.6, 0.1, 0, zt)
  archPanel(shut, pv.a, pv.b, ps, 1.9, 0, 3.3, 0.06, 8)
  archPanel(trim, pv.a, pv.b, ps, 1.75, zt + 0.4, 7.95, 0.04, 8)
  archPanel(win, pv.a, pv.b, ps, 1.45, zt + 0.4, 7.8, 0.07, 8)
}

// Rear (courtyard) and the Ursulines end: the same windows, no dormers.
const rear: Face = { a: [CX1, CY1], b: [CX0, CY1] }
for (let i = 0; i < 18; i++) {
  const s = ((CX1 - CX0) * (i + 0.5)) / 18
  shuttered(rear, s, 0.9, 3.2); shuttered(rear, s, 5.15, 7.75)
}
const endE: Face = { a: [CX1, CY0], b: [CX1, CY1] }
for (let i = 0; i < 3; i++) { const s = ((CY1 - CY0) * (i + 0.5)) / 3; shuttered(endE, s, 0.9, 3.2); shuttered(endE, s, 5.15, 7.75) }

// ═════════════════════════════ St. Mary's Church ═════════════════════════════
walls(stucco, KX0, KY0, KX1, KY1, 0, K_EAVE)
const KW = KX1 - KX0, kc = (KX0 + KX1) / 2
const kRing: XY[] = [[KX0, KY0], [KX1, KY0], [KX1, KY1], [KX0, KY1]]
band(trim, kRing, K_EAVE - 1.1, K_EAVE, 0.32)     // entablature
band(stucco, kRing, 0, 0.5, 0.1)
// the roof: two slopes, overhanging the front gable
{
  const o = 0.4, yf = KY0 - 0.55, yb = KY1
  const L0: V3 = [KX0 - o, yf, K_EAVE - 0.2], R0: V3 = [kc, yf, K_RIDGE], L1: V3 = [KX0 - o, yb, K_EAVE - 0.2], R1: V3 = [kc, yb, K_RIDGE]
  const E0: V3 = [KX1 + o, yf, K_EAVE - 0.2], E1: V3 = [KX1 + o, yb, K_EAVE - 0.2]
  quadN(slate, L0, R0, R1, L1, [-1, 0, 1.8]); quadN(slate, R0, E0, E1, R1, [1, 0, 1.8])
  quadN(slate, L0, E0, E1, L1, [0, 0, -1])
}
// gable front on Chartres
const kf = frontFace(KX0, KX1, KY0)
wpoly(stucco, kf, [[0, K_EAVE], [KW, K_EAVE], [KW / 2, K_RIDGE - 0.1]], -0.4, 0.0)
wpoly(trim, kf, [[-0.4, K_EAVE - 0.05], [0.6, K_EAVE - 0.05], [KW / 2, K_RIDGE - 0.55], [KW / 2, K_RIDGE + 0.05]], -0.05, 0.45)
wpoly(trim, kf, [[KW - 0.6, K_EAVE - 0.05], [KW + 0.4, K_EAVE - 0.05], [KW / 2, K_RIDGE + 0.05], [KW / 2, K_RIDGE - 0.55]], -0.05, 0.45)
for (const s of [0.55, KW / 2 - 3.0, KW / 2 + 3.0, KW - 0.55]) pilaster(trim, kf, s, 1.05, 0.3, 0.5, K_EAVE - 1.1)
discPanel(trim, kf.a, kf.b, KW / 2, 7.4, 1.75, 0.06, 16)
discPanel(win, kf.a, kf.b, KW / 2, 7.4, 1.3, 0.09, 16)
rectPanel(trim, kf.a, kf.b, KW / 2, 0.2, 6.1, 8.7, 0.11); rectPanel(trim, kf.a, kf.b, KW / 2, 2.6, 7.3, 7.5, 0.11)
rectPanel(trim, kf.a, kf.b, KW / 2, 3.0, 0, 4.4, 0.05)
rectPanel(shut, kf.a, kf.b, KW / 2, 2.1, 0, 3.7, 0.08)
wbox(trim, kf, KW / 2 - 1.8, KW / 2 + 1.8, -0.05, 0.4, 4.4, 4.9)
// the cross on the apex
block(trim, kc - 0.13, KY0 - 0.3, kc + 0.13, KY0 + 0.0, K_RIDGE - 0.1, K_RIDGE + 1.6)
block(trim, kc - 0.55, KY0 - 0.3, kc + 0.55, KY0 + 0.0, K_RIDGE + 0.85, K_RIDGE + 1.1)
// the east side, toward the garden: pilasters between five bays of round-headed windows
{
  const F: Face = { a: [KX1, KY0], b: [KX1, KY1] }, L = CY0 - KY0
  for (let k = 0; k <= 5; k++) pilaster(trim, F, 0.5 + ((L - 1.0) * k) / 5, 0.75, 0.22, 0.5, K_EAVE - 1.1)
  for (let k = 0; k < 5; k++) {
    const s = 0.5 + ((L - 1.0) * (k + 0.5)) / 5
    archPanel(trim, F.a, F.b, s, 1.95, 2.45, 7.05, 0.04, 8)
    archPanel(win, F.a, F.b, s, 1.6, 2.6, 6.85, 0.07, 8)
  }
}
// the west side over the neighbouring roofs: the pilasters only
{
  const F: Face = { a: [KX0, KY1], b: [KX0, KY0] }, L = KY1 - KY0
  for (let k = 0; k <= 5; k++) pilaster(trim, F, L - 0.5 - ((CY0 - KY0 - 1.0) * k) / 5, 0.75, 0.22, 0.5, K_EAVE - 1.1)
}
// the raised rear gable wall where the church meets the convent roof
{
  const F: Face = { a: [KX1, KY1], b: [KX0, KY1] }
  wpoly(stucco, F, [[-0.05, K_EAVE], [KW + 0.05, K_EAVE], [KW / 2, K_RIDGE + 0.45]], -0.45, 0.0)
  wpoly(stucco, F, [[-0.15, K_EAVE + 0.2], [0.35, K_EAVE + 0.2], [KW / 2, K_RIDGE + 0.2], [KW / 2, K_RIDGE + 0.5]], -0.55, 0.08)
  wpoly(stucco, F, [[KW - 0.35, K_EAVE + 0.2], [KW + 0.15, K_EAVE + 0.2], [KW / 2, K_RIDGE + 0.5], [KW / 2, K_RIDGE + 0.2]], -0.55, 0.08)
}
// the low link between church and convent
block(stucco, KX1, -5.24, -5.79, CY0, 0, 4.2)
block(slate, KX1 - 0.1, -5.5, -5.6, CY0, 4.2, 4.5)

// ═════════════════════════════ Porter's lodge and garden walls ═════════════════════════════
{
  const x0 = 2.4, x1 = 16.5, y0 = -27.5, y1 = -23.0
  walls(stucco, x0, y0, x1, y1, 0, 3.6)
  band(trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 3.3, 3.6, 0.2)
  hipRoof(slate, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, 3.5, 1.85)
  block(slate, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, 3.45, 3.5)
  const F = frontFace(x0, x1, y0)
  for (const s of [2.4, 7.05, 11.7]) { rectPanel(trim, F.a, F.b, s, 1.25, 0.9, 2.75, 0.04); rectPanel(win, F.a, F.b, s, 1.0, 1.0, 2.6, 0.07) }
  const E: Face = { a: [x1, y0], b: [x1, y1] }
  rectPanel(trim, E.a, E.b, 2.25, 1.6, 0, 2.9, 0.04); rectPanel(shut, E.a, E.b, 2.25, 1.2, 0, 2.7, 0.07)
  chimney(stucco, 14.2, -25.25, 3.5, 6.9, 0.35, 0.35)
}
/** A stuccoed garden wall along x at y (−y face to the street), with piers and a coping. */
function wallX(x0: number, x1: number, y: number, h = 2.3) {
  block(stucco, x0, y, x1, y + 0.45, 0, h)
  block(trim, x0 - 0.06, y - 0.08, x1 + 0.06, y + 0.53, h, h + 0.18)
  const n = Math.max(1, Math.round((x1 - x0) / 4.2))
  for (let k = 0; k <= n; k++) {
    const x = x0 + ((x1 - x0) * k) / n
    block(stucco, Math.max(x0, x - 0.35), y - 0.14, Math.min(x1, x + 0.35), y + 0.45, 0, h + 0.2)
  }
}
const WY = -27.5
wallX(KX1, 2.4, WY)
block(stucco, KX1 - 0.4, WY, KX1, KY0, 0, 2.3)
wallX(16.5, 37.4, WY)
for (const [x0, x1, h] of [[37.4, 38.0, 2.85], [40.4, 41.4, 2.85], [42.4, 43.2, 2.85]] as [number, number, number][]) {
  block(stucco, x0, WY - 0.12, x1, WY + 0.55, 0, h); block(trim, x0 - 0.08, WY - 0.2, x1 + 0.08, WY + 0.63, h, h + 0.22)
}
block(shut, 38.0, WY + 0.15, 40.4, WY + 0.3, 0, 2.4)   // the vehicle gate
block(shut, 41.4, WY + 0.15, 42.4, WY + 0.3, 0, 2.4)   // the wicket
wallX(43.2, 45.5, WY, 2.5)
// along Ursulines, up to the neighbouring building
block(stucco, 45.05, WY, 45.5, -17.2, 0, 2.5)
block(trim, 44.97, WY, 45.58, -17.2, 2.5, 2.68)
for (const y of [-23.9, -20.5]) block(stucco, 45.05, y - 0.35, 45.64, y + 0.35, 0, 2.7)

finishModel('Old Ursuline Convent', 'nola-old-ursuline-convent', [
  { part: stucco, material: finish('ursuline-stucco', 0xe2e1d2) },
  { part: trim, material: PALETTE.trim },
  { part: slate, material: finish('ursuline-slate', 0x7a7270) },
  { part: win, material: PALETTE.window },
  { part: shut, material: finish('ursuline-shutter', 0x93a1ad) },
  { part: brick, material: finish('ursuline-brick', 0xb07a5e) },
], { bearing: 128.3, osm: 'way/345252754', height: K_RIDGE + 1.6 }, 6500)
