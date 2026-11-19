/**
 * St. Patrick's Church, 724 Camp Street, New Orleans (1838-40; Dakin & Dakin,
 * completed by James Gallier) — procedural, CC0-1.0, no textures.
 * bun generators/nola-st-patricks-church.ts
 *
 * This file also exports the small church kit used by the other New Orleans
 * churches of this batch (nola-jesuit-church, nola-st-marys-assumption,
 * nola-st-alphonsus); its own build runs only under `import.meta.main`.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 104.8: model +y runs up the nave
 * from the Camp Street front (model −y, facing compass 284.8°) to the altar
 * end. Anchor: the area centroid of OSM way/1037213985. Everything is drawn
 * about x = 0 in the lidar frame (centred on −90.069655, 29.946562; all
 * coordinates below are in it), then shifted at the end: x by −0.8 to where
 * the lidar ridge and tower centre lie, and both axes to the centroid.
 *
 * Identity, in order: the tall, pale stuccoed Gothic tower over the entrance,
 * in four stages that step back through gabled buttress offsets at the
 * corners; its crenellated parapet between four tall corner pinnacles; the
 * louvred lancets of the second and top stages and the clock between them;
 * the deep pointed portal under a gable; the broad, lower nave behind with a
 * flat parapet across its front, buttressed sides and a grey gabled roof.
 *
 * Evidence
 * - OSM way/1037213985 (building=church, height=52.9 from Microsoft
 *   footprints). In the model frame the nave spans x −12.15..10.3,
 *   y −24.3..13.0; the tower and its buttresses y −35.9..−24.3,
 *   x −7.8..6.8 (OSM sits ~0.4 m east of the lidar).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid, read in the model frame (ground ~0.3 over the grid minimum
 *   all round = z 0). Nave ridge 23.0 at x ≈ −0.8, eaves ~16.3, the flat
 *   front parapet 18.5; tower shaft x ±4.6, y −34.0..−24.5, its roof 49.8,
 *   merlons 51.0-51.4, corner pinnacle tops 53.9; buttress offsets at
 *   ~16, ~26.5, ~35.5 and ~43, the front buttresses reaching y −37.5.
 * - HABS LA-1111 (Library of Congress, public domain): Gallier's plan (nave
 *   bays, buttress positions, the tower's clasping buttresses) and the Camp
 *   Street elevation (stage lines, crenellated parapet, corner pinnacles)
 *   https://commons.wikimedia.org/wiki/File:Historic_American_Buildings_Survey_PLAN_-_ST._PATRICK%27S_R._C._CHURCH_c._1839_-_JAMES_GALLIER,_ARCHITECT,_FROM_COLLECTION_OF_THE_LOUISIANA_STATE_MUSEUM,_JACKSON_SQUARE,_NEW_HABS_LA,36-NEWOR,59-13.tif
 *   https://commons.wikimedia.org/wiki/File:Historic_American_Buildings_Survey_CAMP_STREET_ELEVATION_-_ST._PATRICK%27S_R._C._CHURCH_c._1839_-_JAMES_GALLIER,_ARCHITECT,_IN_COLLECTION_OF_THE_LOUISIANA_STATE_MUSEUM,_JACKSON_HABS_LA,36-NEWOR,59-8.tif
 * - NAIP (USGS, public domain): the grey nave roof, the tower's plan.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "St. Patrick's Church, New Orleans, February 2026.jpg", ajay_suresh,
 *     CC BY 4.0: face-on front — every stage line, opening, the clock
 *     https://commons.wikimedia.org/wiki/File:St._Patrick%27s_Church,_New_Orleans,_February_2026.jpg
 *   - "StPatNOCBDA.jpg", Infrogmation of New Orleans, CC BY 2.5: from the
 *     south-west up Camp Street (the side faces, the buttress steps)
 *     https://commons.wikimedia.org/wiki/File:StPatNOCBDA.jpg
 *   - "Camp Street NOLA St Patricks Church 1963.jpg", Dan Leyrer (HABS),
 *     public domain: the same side, whole height
 *     https://commons.wikimedia.org/wiki/File:Camp_Street_NOLA_St_Patricks_Church_1963.jpg
 *   - "Church of St Patrick New Orleans September 2019.jpg", Bernard
 *     Spragg. NZ, CC0: from the north-east along Camp Street
 *     https://commons.wikimedia.org/wiki/File:Church_of_St_Patrick_New_Orleans_September_2019.jpg
 *   - "St. Patrick's Church, New Orleans.jpg", Yair Haklai, CC BY-SA 4.0:
 *     the top stages from the north
 *     https://commons.wikimedia.org/wiki/File:St._Patrick%27s_Church,_New_Orleans.jpg
 *   - "StCharlesCBDSept2008AcrossLotToStPatricks.jpg", Infrogmation of New
 *     Orleans, CC BY-SA 3.0: the tower from the rear (east) over the nave
 *     https://commons.wikimedia.org/wiki/File:StCharlesCBDSept2008AcrossLotToStPatricks.jpg
 *   - "St. Patrick's Church, New Orleans, night view from street, June
 *     2012.jpg", Francisco Anzola, CC BY 2.0 (night)
 *     https://commons.wikimedia.org/wiki/File:St._Patrick%27s_Church,_New_Orleans,_night_view_from_street,_June_2012.jpg
 * - Published: Wikipedia, "St. Patrick's Church (New Orleans)": 1838-40,
 *   Gothic Revival, Dakin & Dakin then James Gallier; tower about 185 ft
 *   (56 m) to the pinnacle tips in some accounts (the lidar's 53.9 is used).
 *
 * Measured (lidar): every height above, the tower and nave plan. Estimated
 * from the face-on photo against the lidar stage lines: the portal (4.2 m
 * surround to 11.4, gable to 14.7), the lancets (2.5-2.7 m wide; stage 2
 * 16.8-24.0, top 36.2-45.6), the clock (centre 30.3, face r 1.05), the
 * merlon count (6 a face), the pinnacles (1.4 m square). The nave side
 * windows and buttresses follow Gallier's plan (five intermediate buttresses
 * a side); the side walls are hemmed in by neighbours, so their windows'
 * sill and head heights are estimated (no photo shows them face-on).
 * Left out: hood-mould crockets, the tympanum tracery, the fence, the cross
 * on the portal gable is kept as a small bar cross.
 *
 * Doubts: the nave's rear end and long sides are hidden by neighbours in
 * every photo; they are kept plain. The OSM height (52.9) is the tower
 * roof plus parapet, close to the lidar.
 *
 * Round-1 review: the corner buttresses are drawn in the lighter `trim`
 * against the slightly darker stucco body so they read as proud bands in a
 * face-on view (as their lit fronts do in the photos), each tier ends in a
 * gablet and a square pinnacle; the louvred lancets are dark with two bars;
 * the front's raking wall rises to 22.6 at the tower to hide the nave roof.
 *
 * Night: the tower is floodlit on its front and sides (`floodlight`), the
 * louvres stay unlit, the windows glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, archPanel, rectPanel, discPanel, band, wallFrame } from './nyc-city-hall'

// ===========================================================================
// Church kit (shared with the other New Orleans churches)
// ===========================================================================

/** A triangle / quad wound to face along n. */
export function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  if (Math.hypot(g[0], g[1], g[2]) < 1e-9) return
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) { tri(p, a, b, c, n); tri(p, a, c, d, n) }

/** A polygon star-shaped about its centroid (or `centre`) in the x–z plane, extruded y0..y1. */
export function slabY(p: Part, poly: [number, number][], y0: number, y1: number, centre?: [number, number]) {
  const c = centre ?? [poly.reduce((s, q) => s + q[0], 0) / poly.length, poly.reduce((s, q) => s + q[1], 0) / poly.length]
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) continue
    tri(p, [c[0], y0, c[1]], [a[0], y0, a[1]], [b[0], y0, b[1]], [0, -1, 0])
    tri(p, [c[0], y1, c[1]], [a[0], y1, a[1]], [b[0], y1, b[1]], [0, 1, 0])
    let nx = b[1] - a[1], nz = -(b[0] - a[0])
    const mx = (a[0] + b[0]) / 2 - c[0], mz = (a[1] + b[1]) / 2 - c[1]
    if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz }
    const l = Math.hypot(nx, nz) || 1
    quad(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [nx / l, 0, nz / l])
  }
}
/** Same in the y–z plane (poly as [y, z]), extruded x0..x1. */
export function slabX(p: Part, poly: [number, number][], x0: number, x1: number, centre?: [number, number]) {
  const c = centre ?? [poly.reduce((s, q) => s + q[0], 0) / poly.length, poly.reduce((s, q) => s + q[1], 0) / poly.length]
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) continue
    tri(p, [x0, c[0], c[1]], [x0, a[0], a[1]], [x0, b[0], b[1]], [-1, 0, 0])
    tri(p, [x1, c[0], c[1]], [x1, a[0], a[1]], [x1, b[0], b[1]], [1, 0, 0])
    let ny = b[1] - a[1], nz = -(b[0] - a[0])
    const my = (a[0] + b[0]) / 2 - c[0], mz = (a[1] + b[1]) / 2 - c[1]
    if (ny * my + nz * mz < 0) { ny = -ny; nz = -nz }
    const l = Math.hypot(ny, nz) || 1
    quad(p, [x0, a[0], a[1]], [x0, b[0], b[1]], [x1, b[0], b[1]], [x1, a[0], a[1]], [0, ny / l, nz / l])
  }
}

/** Wall planes for panels: front (y = c, facing −y), rear (+y), west (x = c, −x), east (+x). */
export type Side = 'front' | 'rear' | 'west' | 'east'
export const wall = (side: Side, c: number): [XY, XY, (t: number) => number] => {
  switch (side) {
    case 'front': return [[-200, c], [200, c], (x) => x + 200]
    case 'rear': return [[200, c], [-200, c], (x) => 200 - x]
    case 'west': return [[c, 200], [c, -200], (y) => 200 - y]
    case 'east': return [[c, -200], [c, 200], (y) => y + 200]
  }
}
export const arch = (p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05) => {
  const [a, b, s] = wall(side, c); archPanel(p, a, b, s(t), w, z0, zTop, d, 8)
}
export const rect = (p: Part, side: Side, c: number, t: number, w: number, z0: number, z1: number, d = 0.05) => {
  const [a, b, s] = wall(side, c); rectPanel(p, a, b, s(t), w, z0, z1, d)
}
export const disc = (p: Part, side: Side, c: number, t: number, z: number, r: number, d = 0.05, n = 14) => {
  const [a, b, s] = wall(side, c); discPanel(p, a, b, s(t), z, r, d, n)
}

/**
 * The outline of a pointed (two-centred) arch in (s, z): jambs from z0, the
 * point at zTop. `k` is the arc radius over the width (1 = equilateral).
 */
export function pointedShape(s: number, w: number, z0: number, zTop: number, k = 1, segs = 5): [number, number][] {
  const r = w * k, h = Math.sqrt(r * r - (r - w / 2) ** 2), spring = zTop - h
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  const a0 = 0, a1 = Math.atan2(h, -(w / 2 - r)) // right arc, centred at s + w/2 − r
  const cR = s + w / 2 - r
  for (let i = 0; i <= segs; i++) { const t = a0 + (a1 - a0) * (i / segs); pts.push([cR + r * Math.cos(t), spring + r * Math.sin(t)]) }
  const cL = s - w / 2 + r
  for (let i = segs - 1; i >= 0; i--) { const t = a0 + (a1 - a0) * (i / segs); pts.push([cL - r * Math.cos(t), spring + r * Math.sin(t)]) }
  return pts
}
/** A flat pointed-arch panel on a wall, d proud. */
export function pointed(p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05, k = 1) {
  const [a, b, s] = wall(side, c)
  const f = wallFrame(a, b, d), pts = pointedShape(s(t), w, z0, zTop, k)
  const cz = Math.max(z0, zTop - w * 1.2)
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(s(t), cz), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A buttress tier: a block with a gabled cap whose ridge runs along `axis` (the way it projects). */
export function buttress(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', cap: number, capPart: Part = p) {
  block(p, x0, y0, x1, y1, z0, z1)
  if (cap <= 0) return
  p = capPart
  if (axis === 'y') slabY(p, [[x0, z1], [x1, z1], [(x0 + x1) / 2, z1 + cap]], y0, y1)
  else slabX(p, [[y0, z1], [y1, z1], [(y0 + y1) / 2, z1 + cap]], x0, x1)
}

/** A square pinnacle: shaft x0..x1, y0..y1 from z0 to z1, then a pyramid to zTip. */
export function pinnacle(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, zTip: number, lip = 0.12) {
  block(p, x0, y0, x1, y1, z0, z1)
  const r: V3[] = [[x0 - lip, y0 - lip, z1], [x1 + lip, y0 - lip, z1], [x1 + lip, y1 + lip, z1], [x0 - lip, y1 + lip, z1]]
  const r2: V3[] = r.map(([x, y]) => [x, y, z1 + 0.25])
  p.loft([r, r2]); p.cap(r, false)
  const apex: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, zTip]
  for (let i = 0; i < 4; i++) p.tri(r2[i], r2[(i + 1) % 4], apex)
}

/** Merlons along a straight run a→b at height z0..z1: `count` teeth of width w, thickness t. */
export function merlons(p: Part, a: XY, b: XY, z0: number, z1: number, count: number, w: number, t: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  for (let k = 0; k < count; k++) {
    const s = count === 1 ? L / 2 : w / 2 + (k * (L - w)) / (count - 1)
    const cx = a[0] + ux * s, cy = a[1] + uy * s
    const hx = Math.abs(ux) * w / 2 + Math.abs(uy) * t / 2, hy = Math.abs(uy) * w / 2 + Math.abs(ux) * t / 2
    block(p, cx - hx, cy - hy, cx + hx, cy + hy, z0, z1)
  }
}

/** A small bar cross standing at (x, y, z0) in the x–z plane. */
export function barCross(p: Part, x: number, y: number, z0: number, h: number, w: number, t: number) {
  block(p, x - t / 2, y - t / 2, x + t / 2, y + t / 2, z0, z0 + h)
  block(p, x - w / 2, y - t / 2, x + w / 2, y + t / 2, z0 + h * 0.62, z0 + h * 0.62 + t)
}

export const rectRing = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A gable roof over x ±hx, y0..y1, eaves ze to ridge zr, overhanging o; ridge along y. */
export function gableRoof(p: Part, cx: number, hx: number, y0: number, y1: number, ze: number, zr: number, o = 0.3) {
  const xe = hx + o, zo = ze - o * (zr - ze) / hx
  for (const s of [-1, 1]) quad(p, [cx + s * xe, y0, zo], [cx, y0, zr], [cx, y1, zr], [cx + s * xe, y1, zo], [s * (zr - ze) / hx, 0, 1])
}

// ===========================================================================
// St. Patrick's
// ===========================================================================

function build() {
  // Built in the lidar frame (centred on −90.069655, 29.946562), then moved
  // to the outline's area centroid, which lies at (−0.88, −8.4) in it.
  const XC = -0.8 + 0.88, YC = 8.4
  const stucco = new Part(), trim = new Part(), roof = new Part(), win = new Part(), louvre = new Part(), door = new Part()

  // ---- Dimensions (lidar unless noted) ----
  const NX = 11.2, YN0 = -24.3, YN1 = 13.0      // nave
  const EAVE = 16.3, RIDGE = 23.0, PAR = 18.5     // nave eaves, ridge, front parapet
  const TX = 4.6, TF = -34.0, TB = -24.3          // tower shaft
  const S1 = 16.0, S2 = 26.5, S3 = 35.5, S4 = 43.0 // stage lines (buttress offsets)
  const TOP = 49.8, MER = 51.2, PIN = 53.9

  // ---- Nave ----
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(-NX, YN0, NX, YN1), z0: 0, z1: EAVE, facade: null, bevel: 0.2 })
  gableRoof(roof, 0, NX, YN0 + 0.2, YN1 + 0.3, EAVE, RIDGE, 0.35)
  // gable ends (the front one mostly behind the tower and parapet)
  slabY(stucco, [[-NX, EAVE - 0.05], [NX, EAVE - 0.05], [0, RIDGE - 0.1]], YN1 - 0.4, YN1)
  slabY(stucco, [[-NX, EAVE - 0.05], [NX, EAVE - 0.05], [NX, PAR], [TX, 22.6], [0, RIDGE + 1.0], [-TX, 22.6], [-NX, PAR]], YN0, YN0 + 0.4, [0, EAVE + 1])
  // eaves cornice along the sides
  for (const s of [-1, 1]) block(trim, s < 0 ? -NX - 0.35 : NX - 0.05, YN0, s < 0 ? -NX + 0.05 : NX + 0.35, YN1, EAVE - 0.45, EAVE)
  // The front's flat parapet either side of the tower, with a bold cornice.
  for (const s of [-1, 1]) {
    const xa = Math.min(s * TX, s * NX), xb = Math.max(s * TX, s * NX)
    prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(xa, YN0, xb, YN0 + 1.2), z0: EAVE - 1, z1: PAR, facade: null, bevel: 0.1 })
    block(trim, xa, YN0 - 0.35, xb, YN0 + 0.3, PAR - 0.75, PAR - 0.25)
    block(trim, xa, YN0 - 0.2, xb, YN0 + 0.3, 0, 0.6)
    // front buttresses: one mid-bay, one at the outer corner (and one round the corner)
    buttress(stucco, s * 8.0 - 0.6, YN0 - 1.1, s * 8.0 + 0.6, YN0, 0, 15.6, 'y', 1.2)
    buttress(stucco, s * (NX - 0.65) - 0.6, YN0 - 1.3, s * (NX - 0.65) + 0.6, YN0, 0, 13.6, 'y', 1.1)
    buttress(stucco, s < 0 ? -NX - 1.3 : NX, YN0 + 0.05, s < 0 ? -NX : NX + 1.3, YN0 + 1.25, 0, 13.6, 'x', 1.1)
    // tall blind lancet panels in the two bays (stucco recesses read as trim lines)
    for (const xm of [6.3, 9.6]) pointed(trim, 'front', YN0, s * xm, 1.3, 3.0, 14.2, 0.04, 1)
    for (const xm of [6.3, 9.6]) pointed(stucco, 'front', YN0, s * xm, 0.95, 3.2, 13.8, 0.07, 1)
  }

  // Side walls: five intermediate buttresses (Gallier's plan) and the rear corners.
  const BY = [6.4, 12.5, 18.4, 24.6, 30.3].map((d) => YN0 + d)
  for (const s of [-1, 1]) {
    const xo = s * NX, side: 'west' | 'east' = s < 0 ? 'west' : 'east'
    for (const y of [...BY, YN1 - 0.6]) {
      buttress(stucco, s < 0 ? xo - 1.4 : xo, y - 0.55, s < 0 ? xo : xo + 1.4, y + 0.55, 0, 14.2, 'x', 1.2)
    }
    // the rear corner, round the end
    buttress(stucco, s * (NX - 0.6) - 0.55, YN1, s * (NX - 0.6) + 0.55, YN1 + 1.3, 0, 14.2, 'y', 1.2)
    // lancets in each bay, high (the lower walls are hidden by neighbours)
    const stops = [YN0 + 1.6, ...BY, YN1 - 0.6]
    for (let i = 0; i < stops.length - 1; i++) {
      const y = (stops[i] + stops[i + 1]) / 2
      pointed(win, side, xo, y, 2.0, 4.5, 14.0, 0.05, 1)
      rect(trim, side, xo, y, 0.18, 4.5, 12.6, 0.08)
    }
  }
  // Rear gable: a pointed window under the ridge, a cornice line.
  pointed(win, 'rear', YN1, 0, 3.0, 6.0, 15.0, 0.05)
  rect(trim, 'rear', YN1, 0, 0.18, 6.0, 13.4, 0.08)

  // ---- The tower ----
  prism({ wall: stucco, win: null, roof: roof, ring: rectRing(-TX, TF, TX, TB + 2.0), z0: 0, z1: TOP, facade: null, bevel: 0.12 })
  // string courses at the stage lines, bold cornice under the parapet
  const core = rectRing(-TX, TF, TX, TB + 2.0)
  for (const z of [S1, S2, S3]) band(trim, core, z - 0.15, z + 0.35, 0.2)
  band(trim, core, TOP - 1.1, TOP - 0.4, 0.35)
  // the crenellated parapet: a low wall on the cornice, six merlons a face
  {
    const c = rectRing(-TX - 0.3, TF - 0.3, TX + 0.3, TB + 2.3)
    prism({ wall: stucco, win: null, roof: stucco, ring: c, z0: TOP - 0.4, z1: TOP + 0.5, facade: null, bevel: 0.08 })
    // (the parapet's inner roof sits on top of it — the tower roof is the parapet top)
    const z0 = TOP + 0.45, z1 = MER, t = 0.5, w = 0.9
    merlons(stucco, [-TX + 1.3, TF - 0.05], [TX - 1.3, TF - 0.05], z0, z1, 5, w, t)
    merlons(stucco, [-TX + 1.3, TB + 2.05], [TX - 1.3, TB + 2.05], z0, z1, 5, w, t)
    for (const s of [-1, 1]) merlons(stucco, [s * (TX + 0.05), TF + 1.4], [s * (TX + 0.05), TB + 0.6], z0, z1, 6, w, t)
  }

  // Corner buttresses, stepping back at each stage, each tier ending in a tall
  // gablet on its face and a bold square pinnacle on its ledge; the four tall
  // corner pinnacles rise past the parapet.
  const pin = (x: number, y: number, w: number, z0: number, h: number) =>
    pinnacle(trim, x - w / 2, y - w / 2, x + w / 2, y + w / 2, z0, z0 + h, z0 + h + w * 1.4, 0.14)
  for (const s of [-1, 1]) {
    // front buttresses (projecting toward Camp Street), 1.8 m wide on the corners
    const fx0 = s * 3.7 - 0.9, fx1 = s * 3.7 + 0.9
    const front: [number, number, number][] = [[0, S1, -37.5], [S1, S2, -36.5], [S2, S3, -35.5], [S3, S4, -34.9]]
    for (const [z0, z1, y] of front) buttress(trim, fx0, y, fx1, TF, z0, z1, 'y', 3.0, stucco)
    // pinnacles on the front tiers' ledges (where each tier steps back)
    for (let i = 0; i < 3; i++) pin(s * 3.7, front[i][2] + 0.55, 1.0, front[i][1], 3.2)
    // side buttresses at the front corners (projecting sideways), y −34.0..−32.2
    const side: [number, number, number][] = [[0, S1, 7.6], [S1, S2, 6.7], [S2, S3, 5.8], [S3, S4, 5.3]]
    for (const [z0, z1, x] of side) buttress(trim, s < 0 ? -x : TX, -34.0, s < 0 ? -TX : x, -32.2, z0, z1, 'x', 3.0, stucco)
    for (let i = 0; i < 3; i++) pin(s * (side[i][2] - 0.55), -33.1, 1.0, side[i][1], 3.2)
    // rear-corner side buttresses, standing on the nave front (OSM x ±5.5..7.8)
    const rear: [number, number, number, number, number][] = [[0, S2, 7.8, -26.9, TB], [S2, S3, 6.0, -26.4, TB], [S3, S4, 5.3, -26.0, TB]]
    for (const [z0, z1, x, y0, y1] of rear) buttress(trim, s < 0 ? -x : TX, y0, s < 0 ? -TX : x, y1, z0, z1, 'x', 3.0, stucco)
    for (let i = 0; i < 2; i++) pin(s * (rear[i][2] - 0.55), -25.3, 1.0, rear[i][1], 3.2)
    // the four tall corner pinnacles rising past the parapet
    pinnacle(trim, s * 3.95 - 0.75, TF - 0.3, s * 3.95 + 0.75, TF + 1.2, S4, PIN - 2.0, PIN, 0.15)
    pinnacle(trim, s * 3.95 - 0.75, -26.0, s * 3.95 + 0.75, -24.5, S4, PIN - 2.0, PIN, 0.15)
  }

  // Front face: the portal under its gable, the stage-2 lancet, the clock, the belfry lancet.
  slabY(trim, pointedShape(0, 4.2, 0.6, 11.4), TF - 0.45, TF)
  slabY(stucco, pointedShape(0, 3.4, 0.6, 10.6), TF - 0.5, TF - 0.3)
  pointed(win, 'front', TF - 0.5, 0, 2.6, 0.6, 9.9, 0.05)
  rect(door, 'front', TF - 0.5, 0, 2.5, 0.6, 4.8, 0.08)
  slabY(trim, [[-2.7, 10.2], [2.7, 10.2], [0, 14.7]], TF - 0.25, TF)
  barCross(trim, 0, TF - 0.1, 14.6, 1.2, 0.7, 0.18)
  block(trim, -2.6, -36.4, 2.6, TF, 0, 0.6)  // the steps
  // louvred lancets with a hood mould and a central mullion
  const lancet = (side: Side, c: number, t: number, w: number, z0: number, z1: number) => {
    pointed(trim, side, c, t, w + 0.7, z0 - 0.2, z1 + 0.85, 0.1)
    pointed(louvre, side, c, t, w, z0, z1, 0.16)
    rect(trim, side, c, t, 0.24, z0, z1 - w * 0.8, 0.2)
    rect(trim, side, c, t, w, z0 + (z1 - z0) * 0.45, z0 + (z1 - z0) * 0.45 + 0.24, 0.2)
  }
  lancet('front', TF, 0, 2.5, 16.8, 24.0)
  lancet('front', TF, 0, 2.7, 36.2, 45.6)
  disc(trim, 'front', TF, 0, 30.4, 1.7, 0.1, 16)
  disc(door, 'front', TF, 0, 30.4, 1.25, 0.14, 16)
  disc(trim, 'front', TF, 0, 30.4, 1.05, 0.18, 16)
  rect(door, 'front', TF - 0.18, 0.0, 0.14, 30.35, 31.15, 0.04)
  rect(door, 'front', TF - 0.18, 0.3, 0.6, 30.33, 30.47, 0.04)
  // Side faces: both lancets; rear face: the top lancet over the nave roof.
  for (const [side, c] of [['west', -TX], ['east', TX]] as [Side, number][]) {
    lancet(side, c, -29.3, 2.3, 27.5, 34.0)
    lancet(side, c, -29.3, 2.5, 36.2, 45.6)
  }
  lancet('rear', TB + 2.0, 0, 2.5, 36.2, 45.6)

  // ---- Finish ----
  const parts = [stucco, trim, roof, win, louvre, door]
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += XC; p.pos[i + 2] -= YC }

  // Floodlit: the tower's front and sides; the nave front more faintly.
  const lit = (p: V3, n: V3): number => {
    const up = n[2] > 0.7 ? 0.3 : 1
    if (p[1] < -23.5 + YC) return up * (n[1] < -0.3 ? 1 : 0.8)
    return 0.1 * up
  }
  finishModel("St. Patrick's Church", 'nola-st-patricks-church', [
    { part: stucco, material: { ...finish('stp-stucco', 0xdcd8ce), floodlight: lit } },
    { part: trim, material: { ...finish('stp-trim', 0xf7f4ee), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: louvre, material: finish('stp-louvre', 0x585d64) },
    { part: door, material: finish('stp-door', 0x3e3b3a) },
  ], { bearing: 104.8, osm: 'way/1037213985', height: PIN }, 6500)
}

if (import.meta.main) build()
