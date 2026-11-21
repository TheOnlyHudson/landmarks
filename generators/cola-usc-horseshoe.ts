/**
 * The Horseshoe, University of South Carolina, Columbia — procedural,
 * CC0-1.0, no textures.
 * bun generators/cola-usc-horseshoe.ts
 *
 * One model of the historic college buildings that line the Horseshoe, the
 * old South Carolina College quadrangle (1805–1855), plus the Maxcy
 * Monument (Robert Mills, 1827) in the middle of the lawn. McKissick Museum
 * at the head and South Caroliniana Library at the foot are separate models
 * (cola-mckissick-museum, cola-south-caroliniana-library).
 *
 * Also exports the small kit the other Columbia campus models use (stucco or
 * brick blocks with cornice, roof and window bays; porches; cupolas), so this
 * generator must be merged before cola-mckissick-museum and
 * cola-south-caroliniana-library.
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area-weighted
 * centroid of the ten covered outlines (lng -81.028644, lat 33.998350),
 * 13 m north-west of the monument node/4993320679. Every outline's walls run
 * 70° / 340° from north, so the model is placed at bearing 340 and built
 * square: model +x runs up the Horseshoe toward McKissick (true bearing 70),
 * the north row (Harper-Elliott, McCutchen, DeSaussure) stands at y ≈ +36..62
 * facing south across the lawn, the south row (Lieber, Legare-Pinckney, the
 * President's House, Rutledge) at y ≈ -58..-90 facing north.
 *
 * Covers and replaces: Harper College way/329014196, Elliott College
 * way/329014181, McCutchen House way/276663413, DeSaussure College
 * way/329014178, Lieber College way/261452600, Pinckney College
 * way/384128965, Legare College way/371253645, President's House
 * way/371253646, its outbuilding way/371253647 (the old kitchen/slave
 * quarters, memorial node/11196249087), Rutledge College way/329014215. The
 * monument is a node, not a building.
 *
 * Ground: the site falls about 5 m from the east (Rutledge, DeSaussure) to
 * the west (Harper, Pinckney) end. The map puts y = 0 on the lowest ground
 * under the footprint (Harper's west end), so every building's walls run
 * down to z = 0 and its heights stand on its own ground, `g`, read from the
 * map's terrain (bun tools/terrain.ts grid, Mapterhorn z15) at the
 * building's centre, minus that lowest point (92.8 m): Harper 0.55, Elliott
 * 1.5, McCutchen 2.8, DeSaussure 5.1, Lieber 0.7, Pinckney 1.0, Legare 1.8,
 * President's House 3.4, outbuilding 3.6, Rutledge 5.25, monument 2.8.
 * Elevation 0.
 *
 * Evidence
 * - OSM (measured): the ten outlines above, read in the model frame; the
 *   plan below is theirs to 0.1 m, simplified to rectangles. OSM heights
 *   (Harper 11, Pinckney 11, Elliott 14, Legare 16, Lieber 15, DeSaussure 16,
 *   Rutledge 17, President's 17, McCutchen 13) were checked against lidar.
 * - USGS 3DEP lidar, SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid over
 *   the whole Horseshoe, read in the model frame against the lidar ground
 *   beside each building (measured): Harper flat 11.3; Pinckney flat 11.3;
 *   Elliott and Legare wings 12.0–12.3 and their central pavilions 15.2–15.3
 *   (the two are twins, mirrored across the lawn); Lieber eaves 11.0, gable
 *   ridge 14.2; McCutchen hip ridge ~14.6; DeSaussure wings ~11.5 with a low
 *   hip to ~13.5, pavilion 15.5–16.7, a cupola top 21.5; Rutledge wings ~12.9,
 *   pavilion 15.6–17.4, a cupola top 21.3; President's House eaves ~12,
 *   hip ridge ~16; its rear wing ~4–5; the outbuilding 7.7–8.1. Many returns
 *   over the lawn and the rear courts are trees (up to 30 m) and were
 *   ignored.
 * - USGS NAIP orthophoto (public domain): the plan, the dark grey slate
 *   roofs of every building, the hipped roofs of DeSaussure, Rutledge,
 *   McCutchen and the President's House, the flat roofs of Harper-Elliott and
 *   Legare-Pinckney, Lieber's gable.
 * - Photos (Wikimedia Commons):
 *   "Rutledge College, Horseshoe, University of South Carolina, Sumter
 *   Street, Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:Rutledge_College,_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC.jpg
 *   — the lawn (north) front: buff stucco, three-storey wings of white-framed
 *   windows, the four-storey centre pavilion with a low pediment and a small
 *   pedimented door porch on two columns, the cupola behind the pediment.
 *   "DeSaussure College - wide.jpg" (ProfReader, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:DeSaussure_College_-_wide.jpg
 *   — the lawn (south) front: the centre pavilion with its pediment, a row of
 *   round-headed windows on the second floor, a stair to the door, slate hip
 *   roofs with chimneys, a pediment over each wing's middle, the white
 *   cupola.
 *   "Harper College, Horseshoe, University of South Carolina, Sumter
 *   Street, Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:Harper_College,_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC.jpg
 *   — three storeys under a plain parapet, dark shutters on the ground floor.
 *   "Legare College, Horseshoe, University of South Carolina, Sumter Street,
 *   Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:Legare_College,_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC.jpg
 *   — the flat-topped four-storey centre between three-storey wings.
 *   "President’s House, Horseshoe, University of South Carolina, Sumter
 *   Street, Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:President%E2%80%99s_House,_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC.jpg
 *   — buff stucco, three storeys, a white porch with a balcony over it.
 *   "Maxcy Monument, Horseshoe, University of South Carolina, Sumter Street,
 *   Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:Maxcy_Monument,_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC_-_53398535390.jpg
 *   — a grey granite base with a stepped top, a buff marble die and cornice,
 *   a tapering shaft and a black lamp globe on top.
 *   Colours from these, pulled to the palette: warm buff stucco, white trim,
 *   dark grey slate.
 * - Published (Wikipedia "University of South Carolina Horseshoe"; NRHP
 *   "Old Campus District", 1970): Rutledge 1805, DeSaussure 1809, Elliott
 *   1837, Harper 1848, Legare 1848, Pinckney 1837, Lieber 1837, McCutchen
 *   1813, President's House 1854; the Maxcy Monument by Robert Mills, 1827.
 * - Estimated: storey and window heights (from the photos, scaled to the
 *   lidar eaves); bay pitch 3.0 m (Rutledge's west wing: ten bays in 25 m);
 *   the monument's size (6.5 m tall, base 2.6 m) from its photo, scaled
 *   from the base's courses; the cupolas' form (both from behind trees);
 *   the rear (court) fronts, McCutchen House, Lieber College and the
 *   outbuilding, none of them photographed: plain stucco with the same
 *   window bays.
 * - Simplified: shutters, chimneys, the low perimeter walls and the lamp
 *   posts are left out; door porches are drawn only where photographed.
 *
 * Night: windows glow; the doors are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, cylinder, gable, grow, hip, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { lathe, saveModel } from './dc-nga-west'

export { rect, grow, type Rect, type Side } from './dc-white-house'

// ===========================================================================
// The kit, shared by the Columbia campus models.

/** The five parts a plain campus building is drawn with. */
export type Kit = { wall: Part; trim: Part; roof: Part; win: Part; door: Part }
export const newKit = (): Kit => ({ wall: new Part(), trim: new Part(), roof: new Part(), win: new Part(), door: new Part() })

/** Window rows above the building's own ground for a three-storey block over a raised basement. */
export const ROWS3: [number, number][] = [[1.5, 3.3], [5.0, 6.8], [8.4, 10.1]]
/** The same with a fourth storey. */
export const ROWS4: [number, number][] = [...ROWS3, [11.6, 13.2]]

export const faceAt = (r: Rect, s: Side) => (s === 'n' ? r.y1 : s === 's' ? r.y0 : s === 'e' ? r.x1 : r.x0)
export const faceSpan = (r: Rect, s: Side): [number, number] => (s === 'n' || s === 's' ? [r.x0, r.x1] : [r.y0, r.y1])

/**
 * Windows evenly spaced in bays along a stretch of wall: `pitch` sets the
 * bay count, each window `w` wide, one per row. With `frame`, a pale
 * surround sits on the wall and the glass on it.
 */
export function windowBays(win: Part, side: Side, at: number, a0: number, a1: number, rows: [number, number][], g: number,
  pitch = 3.0, w = 1.1, frame?: Part, skip: (c: number) => boolean = () => false) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let i = 0; i < n; i++) {
    const c = a0 + step * (i + 0.5)
    if (skip(c)) continue
    for (const [z0, z1] of rows) {
      if (frame) panel(frame, side, at, c - w / 2 - 0.18, c + w / 2 + 0.18, g + z0 - 0.15, g + z1 + 0.22, 0.03)
      panel(win, side, at, c - w / 2, c + w / 2, g + z0, g + z1, frame ? 0.06 : 0.04)
    }
  }
}

export type BlockOpts = {
  /** Roof form: flat (capped behind the cornice), hip, or a gable with its ridge north–south or east–west. */
  roof?: 'flat' | 'hip' | 'gable-ns' | 'gable-ew' | 'none'
  /** Ridge height above the block's own ground (hip and gable). */
  ridge?: number
  rows?: [number, number][]
  /** Faces that get window bays (default all four). */
  faces?: Side[]
  /** Faces whose windows get pale frames. */
  frames?: Side[]
  pitch?: number
  /** Window width. */
  ww?: number
  /** Cornice depth (0: none) and projection. */
  cornice?: number
  overhang?: number
  /** Skip window bays whose centre this returns true for. */
  skip?: (side: Side, c: number) => boolean
}

/**
 * A plain rectangular block: walls from z = 0 (so an uphill block sinks into
 * the slope) to its eaves at `g + eave`, a bevelled cornice, a roof, and
 * window bays on the faces asked for.
 */
export function block(k: Kit, r: Rect, g: number, eave: number, o: BlockOpts = {}) {
  const top = g + eave, cd = o.cornice ?? 0.5, ov = o.overhang ?? 0.25
  const roof = o.roof ?? 'flat'
  cbox(k.wall, r, 0, top - cd, { top: cd > 0 || roof === 'none' ? false : k.roof })
  if (cd > 0) cbox(k.trim, grow(r, ov), top - cd, top, { b: Math.min(0.15, cd * 0.4), bottom: true, top: roof === 'flat' ? k.roof : false })
  const rr = grow(r, ov - 0.05)
  if (roof === 'flat' && cd <= 0) k.roof.cap([[r.x0, r.y0, top], [r.x1, r.y0, top], [r.x1, r.y1, top], [r.x0, r.y1, top]], true)
  if (roof === 'hip') {
    const ins = Math.min(rr.x1 - rr.x0, rr.y1 - rr.y0) / 2
    hip(k.roof, rr, top, g + (o.ridge ?? eave + 2), ins, k.roof)
  }
  if (roof === 'gable-ns') gable(k.roof, k.wall, rr, top, g + (o.ridge ?? eave + 2), true)
  if (roof === 'gable-ew') gable(k.roof, k.wall, rr, top, g + (o.ridge ?? eave + 2), false)
  const rows = o.rows ?? ROWS3
  for (const s of o.faces ?? (['n', 's', 'e', 'w'] as Side[])) {
    const [a0, a1] = faceSpan(r, s)
    windowBays(k.win, s, faceAt(r, s), a0 + 0.6, a1 - 0.6, rows, g, o.pitch ?? 3.0, o.ww ?? 1.1,
      o.frames?.includes(s) ? k.trim : undefined, (c) => o.skip?.(s, c) ?? false)
  }
}

/**
 * A pediment on a block's face: a shallow gable roof over `r` (ridge running
 * into the building, so its end is a triangle on the face) with a pale
 * raking cornice.
 */
export function pediment(k: Kit, r: Rect, z0: number, z1: number, ns: boolean) {
  gable(k.roof, k.wall, grow(r, 0.3), z0, z1, ns)
}

/** A door: a leaf panel in `entrance` under a fanlight, with a pale surround. */
export function door(k: Kit, side: Side, at: number, c: number, g: number, w = 1.5, h = 2.6, z = 0.9) {
  panel(k.trim, side, at, c - w / 2 - 0.3, c + w / 2 + 0.3, g + z - 0.05, g + z + h + 1.0, 0.03)
  panel(k.door, side, at, c - w / 2, c + w / 2, g + z, g + z + h, 0.06)
  panel(k.win, side, at, c - w / 2, c + w / 2, g + z + h + 0.15, g + z + h + 0.8, 0.06)
}

const NRM: Record<Side, [number, number]> = { n: [0, 1], s: [0, -1], e: [1, 0], w: [-1, 0] }

/**
 * A porch on a face: `cols` round columns, an entablature, and a pediment
 * (or a flat balcony deck with `flat`), `d` deep, `w` wide, centred on `c`.
 */
export function porch(k: Kit, side: Side, at: number, c: number, g: number, w: number, d: number, h: number,
  o: { cols?: number; r?: number; flat?: boolean; floor?: number; part?: Part } = {}) {
  const [nx, ny] = NRM[side], ns = side === 'n' || side === 's'
  const P = (a: number, out: number): [number, number] => (ns ? [a, at + ny * out] : [at + nx * out, a])
  const R = (a0: number, a1: number, o0: number, o1: number): Rect => {
    const [x0, y0] = P(a0, o0), [x1, y1] = P(a1, o1)
    return rect(Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1))
  }
  const fl = o.floor ?? 0.9, cr = o.r ?? 0.22, n = o.cols ?? 2, p = o.part ?? k.trim
  cbox(p, R(c - w / 2, c + w / 2, 0, d), 0, g + fl, { b: 0.06 })
  for (let i = 0; i < n; i++) {
    const a = c - w / 2 + cr + 0.15 + ((w - 2 * cr - 0.3) * i) / Math.max(1, n - 1)
    const [x, y] = P(a, d - cr - 0.15)
    cylinder(p, x, y, cr, g + fl, g + fl + h, 10, cr * 0.9)
  }
  const e = R(c - w / 2 - 0.1, c + w / 2 + 0.1, 0, d + 0.1)
  cbox(p, e, g + fl + h, g + fl + h + 0.55, { b: 0.1, bottom: true, top: o.flat ? p : false })
  if (!o.flat) gable(k.roof, p, e, g + fl + h + 0.55, g + fl + h + 0.55 + w * 0.22, ns)
}

/** A small belfry cupola: a square plinth, a round drum, a little dome and a finial. */
export function cupola(k: Kit, x: number, y: number, z: number, top: number, s = 1.4) {
  const h = top - z
  cbox(k.trim, rect(x - s, x + s, y - s, y + s), z, z + h * 0.3, { b: 0.1, top: true })
  cylinder(k.trim, x, y, s * 0.72, z + h * 0.3, z + h * 0.68, 12)
  lathe(k.roof, x, y, [[s * 0.82, z + h * 0.68], [s * 0.82, z + h * 0.72], [s * 0.7, z + h * 0.8], [s * 0.45, z + h * 0.88], [0.12, z + h * 0.94], [0.12, top - 0.1], [0, top]], 12, false)
}

// ===========================================================================
// The Horseshoe.

const STUCCO = finish('usc-stucco', 0xe3cdaa)
const SLATE = finish('usc-slate', 0x8a929a)
const GRANITE = finish('maxcy-granite', 0xb9ae9f)

/** Each building's own ground above the lowest point under the model (map terrain). */
const G = { harper: 0.55, elliott: 1.5, mccutchen: 2.8, desaussure: 5.1, lieber: 0.7, pinckney: 1.0, legare: 1.8, pres: 3.4, outb: 3.6, rutledge: 5.25, maxcy: 2.8 }

function build() {
  const k = newKit()
  const gran = new Part()
  const pitch = 3.0

  // ---- North row, facing south across the lawn.
  // Harper (west) and Elliott: three storeys under a plain parapet, Elliott's
  // centre a flat-topped fourth storey; a stair tower at the back.
  {
    const g = G.harper
    block(k, rect(-88.3, -61.1, 36.5, 45.0), g, 11.3, { faces: ['s', 'n', 'w'], frames: ['s'] })
    block(k, rect(-82.9, -66.4, 45.0, 48.5), g, 11.3, { faces: ['n'] })
    const e = G.elliott
    block(k, rect(-61.1, -50.2, 36.0, 46.6), e, 12.1, { faces: ['s', 'n'], frames: ['s'] })
    block(k, rect(-50.2, -31.1, 36.0, 49.5), e, 15.3, { rows: ROWS4, faces: ['s', 'n', 'e', 'w'], frames: ['s'], skip: (s, c) => s === 's' && Math.abs(c + 40.65) < 1.5 })
    block(k, rect(-46.5, -40.5, 49.5, 56.8), e, 12.1, { faces: ['n', 'e', 'w'] })
    block(k, rect(-31.1, -19.8, 36.3, 46.4), e, 12.1, { faces: ['s', 'n', 'e'], frames: ['s'] })
    door(k, 's', 36.0, -40.65, e)
  }

  // McCutchen House: a big three-storey house under a slate hip roof.
  {
    const g = G.mccutchen
    block(k, rect(-9.1, 14.8, 35.3, 62.0), g, 10.6, { roof: 'hip', ridge: 14.6, faces: ['s', 'n', 'w', 'e'], frames: ['s'], pitch: 3.4, skip: (s, c) => s === 's' && Math.abs(c - 2.85) < 1.8 })
    block(k, rect(14.8, 17.8, 48.9, 62.1), g, 10.0, { roof: 'flat', faces: ['e'] })
    door(k, 's', 35.3, 2.85, g)
  }

  // DeSaussure: two three-storey wings under low slate hips, each with a
  // pediment over its middle; the four-storey centre pavilion with its own
  // pediment, the round-headed windows of its second floor, a stair to the
  // door, and the cupola.
  {
    const g = G.desaussure
    block(k, rect(35.9, 59.9, 41.8, 50.4), g, 11.5, { roof: 'hip', ridge: 13.6, faces: ['s', 'n', 'w'], frames: ['s'] })
    block(k, rect(41.0, 55.3, 50.4, 52.9), g, 11.5, { faces: ['n'], cornice: 0.5 })
    pediment(k, rect(42.0, 54.3, 41.8, 52.9), g + 11.5, g + 14.3, true)
    block(k, rect(75.4, 99.5, 41.5, 50.0), g, 11.5, { roof: 'hip', ridge: 13.6, faces: ['s', 'n', 'e'], frames: ['s'] })
    block(k, rect(80.0, 94.4, 50.0, 52.7), g, 11.5, { faces: ['n'], cornice: 0.5 })
    pediment(k, rect(81.0, 93.4, 41.5, 52.7), g + 11.5, g + 14.3, true)
    // the centre pavilion: plain bays on floors 1, 3, 4; arched windows on 2
    const pv = rect(59.9, 75.4, 39.4, 56.5)
    block(k, pv, g, 15.4, { roof: 'gable-ns', ridge: 17.6, rows: [ROWS4[0], ROWS4[2], ROWS4[3]], faces: ['s', 'n', 'e', 'w'], frames: ['s'], skip: (s, c) => s === 's' && Math.abs(c - 67.65) < 1.5 })
    const cx = 67.65
    for (const dx of [-6.2, -3.1, 0, 3.1, 6.2]) {
      const w = dx === 0 ? 1.8 : 1.2
      archWindow(k.win, k.trim, 's', 39.4, cx + dx, w, g + 4.9, g + 7.4)
      archWindow(k.win, undefined, 'n', 56.5, cx + dx, w, g + 4.9, g + 7.4)
    }
    door(k, 's', 39.4, cx, g, 1.5, 2.5, 1.4)
    // the stair: three broad treads up to the door
    for (let i = 0; i < 4; i++) cbox(k.trim, rect(cx - 2.2, cx + 2.2, 39.4 - 2.6 + i * 0.65, 39.4), 0, g + 0.35 * (i + 1), { b: 0.04 })
    cupola(k, cx, 48.0, g + 16.6, g + 21.5)
  }

  // ---- South row, facing north across the lawn.
  // Lieber: three storeys under a gable running along the row.
  block(k, rect(-123.8, -103.9, -75.1, -61.1), G.lieber, 11.0, { roof: 'gable-ew', ridge: 14.2, faces: ['n', 's', 'w', 'e'], frames: ['n'], pitch: 3.3 })

  // Pinckney and Legare: the twin of Harper-Elliott.
  {
    const g = G.pinckney
    block(k, rect(-88.3, -60.9, -70.8, -61.2), g, 11.3, { faces: ['n', 's', 'w'], frames: ['n'] })
    block(k, rect(-82.7, -65.7, -73.8, -70.8), g, 11.3, { faces: ['s'] })
    const e = G.legare
    block(k, rect(-60.9, -49.7, -72.2, -61.4), e, 12.0, { faces: ['n', 's'], frames: ['n'] })
    block(k, rect(-49.7, -29.9, -75.1, -61.3), e, 15.2, { rows: ROWS4, faces: ['n', 's', 'e', 'w'], frames: ['n'], skip: (s, c) => s === 'n' && Math.abs(c + 39.8) < 1.5 })
    block(k, rect(-53.2, -49.7, -76.2, -72.2), e, 12.0, { faces: ['s'] })
    block(k, rect(-29.9, -18.9, -72.0, -61.1), e, 12.0, { faces: ['n', 's', 'e'], frames: ['n'] })
    door(k, 'n', -61.3, -39.8, e)
  }

  // The President's House: three storeys under a hip, a shallow bay on the
  // lawn front with a white porch and balcony, a low wing behind.
  {
    const g = G.pres
    block(k, rect(-9.5, 19.0, -76.6, -62.3), g, 12.0, { roof: 'hip', ridge: 16.0, faces: ['s', 'e', 'w'], pitch: 3.4 })
    block(k, rect(-5.8, 15.1, -62.3, -59.6), g, 12.0, { roof: 'flat', faces: ['n'], frames: ['n'], pitch: 3.4, skip: (s, c) => Math.abs(c - 0.2) < 1.2 })
    porch(k, 'n', -59.6, 0.2, g, 4.2, 2.4, 3.4, { cols: 2, flat: true })
    door(k, 'n', -59.6, 0.2, g, 1.4, 2.4, 0.9)
    block(k, rect(1.5, 8.0, -90.0, -76.6), g, 3.4, { roof: 'gable-ns', ridge: 5.2, rows: [[1.0, 2.6]], faces: ['e', 'w', 's'], cornice: 0.3 })
    // the old kitchen and quarters behind
    block(k, rect(18.2, 24.1, -88.0, -78.6), G.outb, 5.6, { roof: 'gable-ns', ridge: 8.0, rows: [[1.0, 2.5], [3.4, 4.8]], faces: ['e', 'w'], cornice: 0.3, pitch: 3.2 })
  }

  // Rutledge: three-storey wings under low hips, the four-storey centre
  // pavilion projecting both ways with a pediment to the lawn and a cupola,
  // and the pedimented door porch.
  {
    const g = G.rutledge
    block(k, rect(35.8, 61.1, -73.3, -62.5), g, 12.4, { roof: 'hip', ridge: 13.4, faces: ['n', 's', 'w'], frames: ['n'], pitch: 2.6 })
    block(k, rect(40.9, 57.2, -76.6, -73.3), g, 12.4, { faces: ['s'], pitch: 2.6 })
    block(k, rect(76.6, 102.7, -73.0, -62.3), g, 12.4, { roof: 'hip', ridge: 13.4, faces: ['n', 's', 'e'], frames: ['n'], pitch: 2.6 })
    block(k, rect(81.4, 95.4, -76.3, -73.0), g, 12.4, { faces: ['s'], pitch: 2.6 })
    const cx = 68.85
    block(k, rect(61.1, 76.6, -80.3, -58.4), g, 15.6, { roof: 'gable-ns', ridge: 17.6, rows: ROWS4, faces: ['n', 's', 'e', 'w'], frames: ['n'], skip: (s, c) => s === 'n' && Math.abs(c - cx) < 1.6 })
    block(k, rect(61.1, 72.9, -83.7, -80.3), g, 12.4, { faces: ['s'] })
    porch(k, 'n', -58.4, cx, g, 3.6, 2.2, 3.3, { cols: 2 })
    door(k, 'n', -58.4, cx, g, 1.5, 2.6, 0.9)
    cupola(k, cx, -70.0, g + 16.8, g + 21.3)
  }

  // ---- The Maxcy Monument: granite base with a stepped top, a marble die
  // and cornice, a tapering shaft, a cap and the lamp globe.
  {
    const x = 4.4, y = -12.2, g = G.maxcy
    cbox(gran, rect(x - 1.3, x + 1.3, y - 1.3, y + 1.3), 0, g + 2.0, { b: 0.08 })
    cbox(gran, rect(x - 1.05, x + 1.05, y - 1.05, y + 1.05), g + 2.0, g + 2.35, { b: 0.08 })
    cbox(k.wall, rect(x - 0.8, x + 0.8, y - 0.8, y + 0.8), g + 2.35, g + 2.55, { b: 0.04 })
    cbox(k.wall, rect(x - 0.65, x + 0.65, y - 0.65, y + 0.65), g + 2.55, g + 3.75)
    cbox(k.wall, rect(x - 0.8, x + 0.8, y - 0.8, y + 0.8), g + 3.75, g + 4.0, { b: 0.08, bottom: true })
    // the shaft, tapering, and its pyramidal cap
    const ring = (h: number, z: number): V3[] => [[x - h, y - h, z], [x + h, y - h, z], [x + h, y + h, z], [x - h, y + h, z]]
    k.wall.loft([ring(0.45, g + 4.0), ring(0.32, g + 5.9)])
    k.wall.loft([ring(0.32, g + 5.9), ring(0.02, g + 6.15)])
    // the lamp: a dark globe on a short stem
    cylinder(k.roof, x, y, 0.05, g + 6.1, g + 6.3, 6)
    lathe(k.roof, x, y, [[0, g + 6.25], [0.2, g + 6.33], [0.28, g + 6.5], [0.2, g + 6.67], [0, g + 6.72]], 10, false)
  }

  return [
    { part: k.wall, material: STUCCO },
    { part: k.trim, material: PALETTE.trim },
    { part: k.roof, material: SLATE },
    { part: k.win, material: PALETTE.window },
    { part: k.door, material: PALETTE.entrance },
    { part: gran, material: GRANITE },
  ]
}

/** A round-headed window panel (a rectangle under a semicircle) on a face, with an optional pale surround. */
export function archWindow(win: Part, frame: Part | undefined, side: Side, at: number, c: number, w: number, z0: number, z1: number, seg = 8) {
  const [nx, ny] = NRM[side], ns = side === 'n' || side === 's'
  const draw = (p: Part, half: number, lo: number, hi: number, d: number) => {
    const spring = hi - half
    const P = (a: number, z: number): V3 => (ns ? [c + a, at + ny * d, z] : [at + nx * d, c + a, z])
    const n: V3 = [nx, ny, 0]
    qf(p, P(-half, lo), P(half, lo), P(half, spring), P(-half, spring), n)
    for (let i = 0; i < seg; i++) {
      const a0 = (Math.PI * i) / seg, a1 = (Math.PI * (i + 1)) / seg
      tf(p, P(0, spring), P(half * Math.cos(a0), spring + half * Math.sin(a0)), P(half * Math.cos(a1), spring + half * Math.sin(a1)), n)
    }
  }
  if (frame) draw(frame, w / 2 + 0.2, z0 - 0.15, z1 + 0.2, 0.03)
  draw(win, w / 2, z0, z1, frame ? 0.06 : 0.04)
}

if (import.meta.main) {
  await saveModel('cola-usc-horseshoe', 'The Horseshoe, University of South Carolina', build(), { source: 'generators/cola-usc-horseshoe.ts' }, 6500)
}
