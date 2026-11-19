/**
 * Upper Pontalba Building, St. Peter Street on Jackson Square, New Orleans
 * (1849-51, James Gallier Sr. and Henry Howard for the Baroness de Pontalba)
 * — procedural, CC0-1.0, no textures.
 * bun generators/nola-upper-pontalba.ts
 *
 * Also the kit for its mirror across the square, the Lower Pontalba
 * (nola-lower-pontalba.ts imports `buildPontalba` from here). The Upper
 * Pontalba itself is only written when this file is run directly. The kit
 * builds on the Cabildo's (`wbox`, `wpoly`, `walls` and friends from
 * nola-cabildo.ts).
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 37.2, the bearing at which the OSM
 * outline's walls run square to the axes: model +y is the front, facing
 * compass 37 over St. Peter Street to Jackson Square; model +x runs along St.
 * Peter toward the river and Decatur Street (compass 127), model −x is
 * Chartres Street. Anchor: the area centroid of the outer way of the OSM
 * multipolygon relation/4610711.
 *
 * Identity, in order: the long red-brick block of row houses, three storeys
 * and an attic of small grilled windows under a pale cornice; the two
 * continuous cast-iron galleries on the second and third floors, carried on
 * slender posts at the kerb and wrapping round both ends with rounded
 * corners (drawn as bold dark iron bands on posts, the filigree and the "AP"
 * monograms left out); the three pedimented pavilions (centre and ends) with
 * their octagonal oculi; the shopfronts between pale granite piers; the
 * grey slate roofs with party walls and chimneys, the end pavilions' roofs
 * running back along the side streets, and the saw-tooth of hipped roofs on
 * the rear service wings seen from above.
 *
 * Evidence
 * - OSM relation/4610711 (outer way/329364410: 114 m along St. Peter, 48 m
 *   deep to the rear lot line; nine light-well courtyards as inner ways).
 *   No building:part ways inside it.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame. Ground flat (z = 0 at 0.3 m over the
 *   grid's minimum). Front wall at y 21.8, the galleries' decks out to 24.4
 *   (upper deck 8.6, lower 4.2 where it runs on alone at the back), the
 *   front eaves 15.6, the front range's ridge 18.1 at y ~14 falling to 15.5
 *   at its rear wall (~y 6); the pediments' apexes 18.2-18.3 over x ≈ ±48.5
 *   and 0.5; the end pavilions' ridges (18.2) running back along the side
 *   streets to y ≈ −7; chimneys 18.6-18.9 on the front slope; the rear wings
 *   11-15 in a saw-tooth between light wells; behind them flat-roofed blocks
 *   of 9-10 (Chartres end), 16.3 (middle), 11.2 and ~10.5 (river end).
 * - Terrain (Mapterhorn): flat within 0.5 m. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Upper Pontalba Building, New Orleans.jpg", Spatms, CC BY-SA 4.0:
 *     the corner on Decatur with the end pavilion's pediment and oculus,
 *     both galleries wrapping the corner, the attic grilles, the brick
 *     https://commons.wikimedia.org/wiki/File:Upper_Pontalba_Building,_New_Orleans.jpg
 *   - "Pontalba Buildings (55151718941).jpg", ajay_suresh, CC BY 4.0: the
 *     long front under the galleries, the centre pavilion's pediment, the
 *     shopfronts and granite piers, the posts
 *     https://commons.wikimedia.org/wiki/File:Pontalba_Buildings_(55151718941).jpg
 *   - "Pontalba Buildings.jpg", Yair Haklai, CC BY-SA 4.0: St. Peter Street
 *     from the Cabildo's arcade, the galleries in perspective
 *     https://commons.wikimedia.org/wiki/File:Pontalba_Buildings.jpg
 *   - "Aerial photograph of Jackson Square, New Orleans, Louisiana.jpg",
 *     Mark Westguard, CC0: both buildings' roofs (party walls, chimneys, the
 *     rear wings' hips and light wells)
 *     https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Jackson_Square,_New_Orleans,_Louisiana.jpg
 *   - "New Orleans August 2022 - Lower Pontalba from Jackson Square.jpg",
 *     Tom Hilton, CC BY 2.0: the twin's identical front, storey heights
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_August_2022_-_Lower_Pontalba_from_Jackson_Square.jpg
 * - Published: Wikipedia, "Pontalba Buildings": built 1849-51, each block of
 *   sixteen row houses with shops below, the cast-iron galleries with the
 *   AP monogram, red brick.
 *
 * Measured (lidar): the plan, the front wall and gallery depth (2.6 m), the
 * eaves 15.3 (cornice top; the roof 15.6 one cell in), the ridges 18.2, the
 * pediments, the gallery decks (4.3 and 8.6), the rear wings and blocks.
 * Estimated from the photos: the storey lines (shops to 4.3, second storey
 * to 8.6, third to 12.9, attic band to 15.3), the bay rhythm (39 bays across
 * the front: 5 per pavilion, 12 in each run between), window sizes (1.25 m
 * wide, 3.2-3.3 m tall), the attic grilles (1.0 × 0.6 m), the posts (every
 * other bay), the oculi, the railings (1 m), the party walls and chimneys
 * (every 8.75 m, from the aerial). Behind the hipped wings the rear is a
 * row of narrow brick service wings, one per house, with low hipped slate
 * roofs and a chimney, courtyards between (Westguard aerial), at the lidar's
 * heights per stretch; where the lidar shows one level flat roof over a
 * whole stretch it is one brick block with a roof-grey top.
 * Left out: the iron filigree and monograms, signs, awnings, lamps, plants.
 *
 * Doubts: the 16.3 m flat-roofed block behind the middle (x −31.6..16) is
 * inside the relation's outer way and is not a separate OSM building (the
 * nearest separate buildings start ~12 m further back). The lidar shows one
 * level roof at 16.3 over the whole stretch, and the Westguard aerial shows
 * flat grey roofs with skylights behind the middle houses; it is kept, in
 * brick with a roof-grey top. The 11.2 m stretch (x 16..31) is flat too. The ground-floor posts
 * are a pale sage green in some photos; they are drawn in the railings'
 * dark iron so the galleries read as one.
 *
 * Night: the windows and the shops' transoms glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { block, hipRoof, rectPanel } from './nyc-city-hall'
import { type Face, triN, quadN, wbox, wpoly, walls, IRON, DOOR } from './nola-cabildo'

// ===========================================================================
// Kit (shared with nola-lower-pontalba.ts)
// ===========================================================================

export type PParts = { brick: Part; trim: Part; roof: Part; win: Part; iron: Part; door: Part }
export const newPParts = (): PParts => ({ brick: new Part(), trim: new Part(), roof: new Part(), win: new Part(), iron: new Part(), door: new Part() })

// Storey lines (photos, scaled to the lidar's decks and eaves).
export const DECK1 = 4.3, DECK2 = 8.6, ST3 = 12.9, EAVE = 15.3, RIDGE = 18.2
const XW = 56.5          // half-length to the end walls
const XP = 42.0          // the end pavilions' inner edge
const XC = 7.0           // the centre pavilion's half-width
const RANGE_D = 16       // the front range's depth (front wall to rear wall)
const RIDGE_BACK = 8     // the ridge behind the front wall

/** Bays on a face across s0..s1: shopfronts, two storeys of windows with pale lintels, the attic grilles. */
function bays(P: PParts, F: Face, s0: number, s1: number, n: number) {
  const pitch = (s1 - s0) / n
  const panel = (p: Part, s: number, w: number, z0: number, z1: number, d: number) => rectPanel(p, F.a, F.b, s, w, z0, z1, d)
  for (let k = 0; k < n; k++) {
    const s = s0 + pitch * (k + 0.5)
    // shop: a dark door/shopfront between granite piers, a lit transom over it
    panel(P.door, s, pitch - 0.84, 0.15, 3.45, 0.04)
    panel(P.win, s, pitch - 0.84, 3.55, 4.0, 0.04)
    // second and third storeys: tall windows, a pale lintel over each
    // second and third storeys: tall windows (most of the storey) in pale stone surrounds, a lintel cap over each
    for (const [z0, z1] of [[4.4, 8.0], [8.7, 12.35]]) {
      panel(P.trim, s, 1.9, z0, z1 + 0.1, 0.03)
      panel(P.win, s, 1.4, z0 + 0.05, z1 - 0.1, 0.05)
      panel(P.trim, s, 2.15, z1 + 0.05, z1 + 0.42, 0.06)
    }
    // attic: a small iron grille in a pale frame
    panel(P.trim, s, 1.2, 13.2, 14.05, 0.04)
    panel(P.iron, s, 0.96, 13.32, 13.93, 0.06)
  }
  // granite piers at the bay lines
  for (let k = 0; k <= n; k++) {
    const s = s0 + pitch * k
    wbox(P.trim, F, s - 0.42, s + 0.42, 0, 0.14, 0, DECK1 - 0.35)
  }
}

/** The galleries' path: pairs of (wall point, outer edge point) from the west side's rear, round the front, to the east side's rear. */
function galleryPath(yW: number, yEnd: number, D: number): { i: XY; o: XY }[] {
  const out: { i: XY; o: XY }[] = []
  const push = (i: XY, o: XY) => {
    const l = out[out.length - 1]
    if (l && Math.hypot(l.o[0] - o[0], l.o[1] - o[1]) < 1e-6) return
    out.push({ i, o })
  }
  const steps = (a: number, b: number, max: number) => { const n = Math.max(1, Math.ceil(Math.abs(b - a) / max)); return Array.from({ length: n + 1 }, (_, k) => a + ((b - a) * k) / n) }
  for (const y of steps(yEnd, yW, 7.2)) push([-XW, y], [-XW - D, y])
  for (let k = 0; k <= 6; k++) { const a = Math.PI - (k / 6) * (Math.PI / 2); push([-XW, yW], [-XW + D * Math.cos(a), yW + D * Math.sin(a)]) }
  for (const x of steps(-XW, XW, 5.85)) push([x, yW], [x, yW + D])
  for (let k = 0; k <= 6; k++) { const a = Math.PI / 2 - (k / 6) * (Math.PI / 2); push([XW, yW], [XW + D * Math.cos(a), yW + D * Math.sin(a)]) }
  for (const y of steps(yW, yEnd, 7.2)) push([XW, y], [XW + D, y])
  return out
}

/** One gallery: the deck with its pale fascia, the dark iron railing band along its edge. */
function gallery(P: PParts, path: { i: XY; o: XY }[], D: number, zt: number) {
  const t = 0.35, rail = 1.0, inset = 0.1
  const lerp = (a: XY, b: XY, f: number): XY => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
  for (let k = 0; k < path.length - 1; k++) {
    const a = path[k], b = path[k + 1]
    const v3 = (p: XY, z: number): V3 => [p[0], p[1], z]
    quadN(P.trim, v3(a.i, zt), v3(b.i, zt), v3(b.o, zt), v3(a.o, zt), [0, 0, 1])
    quadN(P.trim, v3(a.i, zt - t), v3(b.i, zt - t), v3(b.o, zt - t), v3(a.o, zt - t), [0, 0, -1])
    const m: V3 = [(a.o[0] + b.o[0] - a.i[0] - b.i[0]) / 2, (a.o[1] + b.o[1] - a.i[1] - b.i[1]) / 2, 0]
    quadN(P.trim, v3(a.o, zt - t), v3(b.o, zt - t), v3(b.o, zt), v3(a.o, zt), m)
    // the railing: a solid dark band just inside the edge, seen from both sides
    const ra = lerp(a.i, a.o, 1 - inset / D), rb = lerp(b.i, b.o, 1 - inset / D)
    quadN(P.iron, v3(ra, zt), v3(rb, zt), v3(rb, zt + rail), v3(ra, zt + rail), m)
    quadN(P.iron, v3(ra, zt), v3(rb, zt), v3(rb, zt + rail), v3(ra, zt + rail), [-m[0], -m[1], 0])
  }
  // end caps at the rear ends of the side runs
  for (const e of [path[0], path[path.length - 1]]) {
    const n: V3 = [0, e === path[0] ? -1 : -1, 0]
    quadN(P.trim, [e.i[0], e.i[1], zt - t], [e.o[0], e.o[1], zt - t], [e.o[0], e.o[1], zt], [e.i[0], e.i[1], zt], n)
  }
}

/** Slender posts at the kerb under both decks, about every other bay along the path. */
function posts(P: PParts, path: { i: XY; o: XY }[], D: number, spacing = 5.8) {
  const pts = path.map((p) => { const f = 1 - 0.22 / D; return [p.i[0] + (p.o[0] - p.i[0]) * f, p.i[1] + (p.o[1] - p.i[1]) * f] as XY })
  const seg = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1]))
  const total = seg.reduce((s, v) => s + v, 0), n = Math.round(total / spacing)
  for (let j = 0; j <= n; j++) {
    let d = (total * j) / n, k = 0
    while (k < seg.length - 1 && d > seg[k]) { d -= seg[k]; k++ }
    const f = seg[k] ? d / seg[k] : 0
    const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f
    const r = 0.11
    block(P.iron, x - r, y - r, x + r, y + r, 0, DECK1 - 0.35)
    block(P.iron, x - r * 0.8, y - r * 0.8, x + r * 0.8, y + r * 0.8, DECK1, DECK2 - 0.35)
  }
}

/** A pediment on face F centred at s, base width w, on the eave line: brick tympanum, pale raking cornice, the octagonal oculus. */
function pediment(P: PParts, F: Face, s: number, w: number, apex: number) {
  const h = apex - EAVE
  wpoly(P.brick, F, [[s - w / 2, EAVE], [s + w / 2, EAVE], [s, apex]], -0.2, 0.2)
  // raking cornices: two pale bars along the slopes, and the horizontal one
  const k = 0.42, slope = h / (w / 2)
  const rake = (sg: number) => {
    const xa = s - sg * (w / 2 + 0.3), xb = s
    wpoly(P.trim, F, [[xa, EAVE - 0.05], [xb, apex - 0.05], [xb, apex + k], [xa, EAVE - 0.05 + k]], 0.0, 0.42)
  }
  rake(1); rake(-1)
  void slope
  // the octagonal oculus: a pale frame, a dark light
  const oct = (r: number): [number, number][] => Array.from({ length: 8 }, (_, i) => [s + r * Math.cos((i + 0.5) * Math.PI / 4), EAVE + h * 0.42 + r * Math.sin((i + 0.5) * Math.PI / 4)])
  wpoly(P.trim, F, oct(0.95), 0.2, 0.26)
  wpoly(P.win, F, oct(0.62), 0.26, 0.3)
}

/** A gable roof on an axis-aligned rectangle, ridge along x (or y), eaves overhanging `o`. */
function gable(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, alongX: boolean, o = 0.3) {
  if (alongX) {
    const ym = (y0 + y1) / 2
    quadN(p, [x0, y0 - o, z0 - 0.1], [x1, y0 - o, z0 - 0.1], [x1, ym, z1], [x0, ym, z1], [0, -1, 2])
    quadN(p, [x0, y1 + o, z0 - 0.1], [x1, y1 + o, z0 - 0.1], [x1, ym, z1], [x0, ym, z1], [0, 1, 2])
  } else {
    const xm = (x0 + x1) / 2
    quadN(p, [x0 - o, y0, z0 - 0.1], [x0 - o, y1, z0 - 0.1], [xm, y1, z1], [xm, y0, z1], [-1, 0, 2])
    quadN(p, [x1 + o, y0, z0 - 0.1], [x1 + o, y1, z0 - 0.1], [xm, y1, z1], [xm, y0, z1], [1, 0, 2])
  }
}

export type PontalbaOpts = {
  /** The front wall (facing +y). */
  yW: number
  /** Gallery depth from the wall to the outer edge. */
  D: number
  /** The end pavilions' depth back along the side streets. */
  endDepth: number
  /**
   * Rear zones behind the hipped service wings, [x0, x1, yBack, height, kind]:
   * 'wings' is a row of narrow brick service wings (one per house) with low
   * hipped slate roofs and a chimney, courtyards between; 'flat' a single
   * flat-roofed brick block, where the lidar shows one. yFront optional.
   */
  rear: { x0: number; x1: number; yBack: number; h: number; kind: 'wings' | 'flat'; yFront?: number }[]
}

export function buildPontalba(P: PParts, o: PontalbaOpts) {
  const { yW, D, endDepth } = o
  const yR = yW - RANGE_D, yE = yW - endDepth, yRidge = yW - RIDGE_BACK

  // Massing: the front range between the end pavilions, the pavilions running back.
  walls(P.brick, -XP, yR, XP, yW, 0, EAVE)
  walls(P.brick, -XW, yE, -XP, yW, 0, EAVE)
  walls(P.brick, XP, yE, XW, yW, 0, EAVE)
  // Roofs: the front range's gable (ridge along the front, run into the
  // pavilions' roofs), the centre pavilion's cross gable, the end pavilions'
  // gables along the side streets.
  {
    const o = 0.3
    quadN(P.roof, [-XW + 7.25, yW + o, EAVE - 0.1], [XW - 7.25, yW + o, EAVE - 0.1], [XW - 7.25, yRidge, RIDGE], [-XW + 7.25, yRidge, RIDGE], [0, 1, 2])
    quadN(P.roof, [-XW + 7.25, yR - o, EAVE - 0.1], [XW - 7.25, yR - o, EAVE - 0.1], [XW - 7.25, yRidge, RIDGE], [-XW + 7.25, yRidge, RIDGE], [0, -1, 2])
  }
  gable(P.roof, -XC, yRidge, XC, yW, EAVE, RIDGE + 0.1, false)
  gable(P.roof, -XW, yE, -XP, yW, EAVE, RIDGE, false)
  gable(P.roof, XP, yE, XW, yW, EAVE, RIDGE, false)
  // The pavilions' rear gable walls.
  for (const s of [-1, 1]) {
    const F: Face = { a: [s < 0 ? -XP : XW, yE], b: [s < 0 ? -XW : XP, yE] }
    wpoly(P.brick, F, [[0, EAVE], [XW - XP, EAVE], [(XW - XP) / 2, RIDGE]], -0.15, 0.05)
  }

  // Front: pediments on the three pavilions; the cornice; the bays.
  const front: Face = { a: [XW, yW], b: [-XW, yW] }   // s = XW − x
  for (const xc of [-(XW + XP) / 2, 0, (XW + XP) / 2]) pediment(P, front, XW - xc, xc === 0 ? 2 * XC : XW - XP, RIDGE + 0.1)
  const ring: XY[] = [[-XW, yE], [-XP, yE], [-XP, yR], [XP, yR], [XP, yE], [XW, yE], [XW, yW], [-XW, yW]]
  void ring
  // cornice and frieze along the front and the side streets
  wbox(P.trim, front, -0.35, 2 * XW + 0.35, 0, 0.35, EAVE - 0.55, EAVE)
  wbox(P.brick, front, -0.2, 2 * XW + 0.2, 0, 0.12, ST3, EAVE - 0.55)
  const east: Face = { a: [XW, yE], b: [XW, yW] }     // s = y − yE
  const west: Face = { a: [-XW, yW], b: [-XW, yE] }   // s = yW − y
  for (const F of [east, west]) {
    wbox(P.trim, F, 0, endDepth + 0.35, 0, 0.35, EAVE - 0.55, EAVE)
    wbox(P.brick, F, 0, endDepth + 0.2, 0, 0.12, ST3, EAVE - 0.55)
    bays(P, F, 0.3, endDepth - 0.3, 10)
  }
  // 39 bays: five per pavilion, twelve in each run between.
  bays(P, front, 0, XW - XP, 5)
  bays(P, front, XW - XP, XW - XC, 12)
  bays(P, front, XW - XC, XW + XC, 5)
  bays(P, front, XW + XC, XW + XP, 12)
  bays(P, front, XW + XP, 2 * XW, 5)
  // String courses at the decks' lines (the brick shows a band where the galleries meet the wall).
  // Galleries round the front and both ends.
  const path = galleryPath(yW, yE + 0.5, D)
  gallery(P, path, D, DECK1)
  gallery(P, path, D, DECK2)
  posts(P, path, D)

  // Party walls through the front range's roof, chimneys on them (aerial, lidar).
  for (const x of [-33.25, -24.5, -15.75, -XC, XC, 15.75, 24.5, 33.25]) {
    const F: Face = { a: [x, 0], b: [x, 1] }        // s = y, out = +x
    wpoly(P.brick, F, [[yW + 0.05, EAVE - 0.2], [yW + 0.05, EAVE + 0.25], [yRidge, RIDGE + 0.4], [yR - 0.05, EAVE + 0.25], [yR - 0.05, EAVE - 0.2]], -0.25, 0.25)
    for (const [yc, top] of [[yW - 3.3, 18.9], [yRidge - 3.5, 18.7]]) {
      block(P.brick, x - 0.5, yc - 1.1, x + 0.5, yc + 1.1, EAVE, top)
      block(P.trim, x - 0.6, yc - 1.2, x + 0.6, yc + 1.2, top, top + 0.2)
    }
  }
  for (const x of [-XW + 2.5, XW - 2.5]) {
    for (const yc of [yW - 7, yW - 18]) {
      block(P.brick, x - 1.1, yc - 0.5, x + 1.1, yc + 0.5, EAVE, 18.4)
      block(P.trim, x - 1.2, yc - 0.6, x + 1.2, yc + 0.6, 18.4, 18.6)
    }
  }

  // Rear service wings: a hipped wing behind each house, light wells between.
  const ells: [number, number][] = []
  const cuts = [-XP, -33.25, -24.5, -15.75, -XC, 0, XC, 15.75, 24.5, 33.25, XP]
  for (let k = 0; k < cuts.length - 1; k++) ells.push([cuts[k] + (k === 0 ? 0 : 1.3), cuts[k + 1] - (k === cuts.length - 2 ? 0 : 1.3)])
  const yEllB = yW - 28.5
  for (const [x0, x1] of ells) {
    walls(P.brick, x0, yEllB, x1, yR, 0, 12.0)
    hipRoof(P.roof, x0 - 0.15, yEllB - 0.15, x1 + 0.15, yR, 12.0, 2.4)
  }
  // Flat-roofed rear blocks behind (lidar), plain brick.
  for (const z of o.rear) {
    const y1 = z.yFront ?? yEllB
    if (z.kind === 'flat') {
      walls(P.brick, z.x0, z.yBack, z.x1, y1, 0, z.h)
      block(P.roof, z.x0, z.yBack, z.x1, y1, z.h - 0.05, z.h + 0.25)
      continue
    }
    // narrow wings about 4.4 m wide at the house pitch, courtyards between
    const n = Math.max(1, Math.round((z.x1 - z.x0) / 8.75)), pitch = (z.x1 - z.x0) / n
    for (let k = 0; k < n; k++) {
      const c = z.x0 + pitch * (k + 0.5), w = 2.2
      walls(P.brick, c - w, z.yBack, c + w, y1, 0, z.h)
      hipRoof(P.roof, c - w - 0.15, z.yBack - 0.15, c + w + 0.15, y1, z.h, 1.5)
      block(P.brick, c - 0.5, y1 - 2.2, c + 0.5, y1 - 1.2, z.h, z.h + 2.6)
      block(P.trim, c - 0.6, y1 - 2.3, c + 0.6, y1 - 1.1, z.h + 2.6, z.h + 2.8)
    }
  }
}

export const BRICK = finish('pontalba-brick', 0xb06452)

// ===========================================================================
// The Upper Pontalba
// ===========================================================================

function build() {
  const P = newPParts()
  buildPontalba(P, {
    yW: 21.8, D: 2.6, endDepth: 28.6,
    rear: [
      { x0: -56.5, x1: -32.4, yBack: -24.9, h: 8.6, kind: 'wings' },
      { x0: -31.6, x1: 16.0, yBack: -24.5, h: 16.3, kind: 'flat' },
      { x0: 16.0, x1: 30.9, yBack: -24.4, h: 11.2, kind: 'flat' },
      { x0: 30.9, x1: 54.9, yBack: -25.2, h: 9.5, kind: 'wings' },
    ],
  })
  finishModel('Upper Pontalba Building', 'nola-upper-pontalba', [
    { part: P.brick, material: BRICK },
    { part: P.trim, material: PALETTE.trim },
    { part: P.roof, material: PALETTE.roof },
    { part: P.win, material: PALETTE.window },
    { part: P.iron, material: IRON },
    { part: P.door, material: DOOR },
  ], { bearing: 37.2, osm: 'relation/4610711', height: 18.9 }, 6500)
}

if (import.meta.main) build()
