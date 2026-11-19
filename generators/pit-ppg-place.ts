/**
 * One PPG Place, Pittsburgh (Philip Johnson and John Burgee, 1984): the
 * 40-storey glass Gothic tower — original procedural geometry, CC0-1.0.
 * bun generators/pit-ppg-place.ts
 *
 * Also exports the glass-Gothic helpers (pleats, pinnacles, the PPG glass
 * swatches) that generators/pit-ppg-place-plaza.ts uses for the low PPG Place
 * buildings around the plaza; the tower is only written when this file runs
 * itself.
 *
 * Map frame turned to the building: +x is the plaza (east-south-east) face's
 * outward normal, +y the Fourth Avenue (north-north-east) face's, z up,
 * metres. BEARING 26.5: the OSM outline's edges run at 26.4/116.5/206.5/296.2°.
 * Origin = centre of the OSM outline way/202809245 (a 47.0 × 46.3 m square),
 * 40.439993, -80.003772.
 *
 * Identity, in order: the silver-grey mirror-glass square tower; the four tall
 * pinnacled corner towers rising ~23 m over the parapet, each a faceted shaft
 * with a tall glass spire and small spirelets round it; one lower pinnacle
 * cluster in the middle of each face; the full-height triangular glass pleats
 * between them, each ending in a small spire on the parapet (three each side
 * of the middle); the four pointed glass gables of the lobby on the plaza.
 *
 * Evidence
 * - OSM way/202809245: outline, 40 levels, height 166 (roof; see below).
 *   wikidata Q21075757.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 0.5 m grid read in this
 *   frame (SCRATCH/work/pit-ppg-place/lidar.json, roof.png). Lowest ground at
 *   the footprint (west corner) is 1.3 m above the box's ground_min; the plaza
 *   side is ~2.2 m above that. Measured above that base: parapet 171.7 m;
 *   corner spires 195.2 m (all four within 0.7 m), centred ~3 m in from both
 *   faces; the corner clusters span ~7 m along each face with satellite tops
 *   at ~187-189 m; face-middle clusters ~5 m wide, top 184.2 m; roof
 *   mechanical ~175 m. Square 46 m in the lidar, matching OSM.
 * - Published: 635 ft / 193.5 m to the top, 40 floors, 231 spires on the
 *   complex (Wikipedia "PPG Place"; CTBUH). The model keeps the lidar 195.2 m.
 * - Photos (Wikimedia Commons, daylight):
 *   "One PPG Place from Third Avenue.jpg" (Cbaile19, CC0) — the south-south-west
 *     face square on: pleat spires at ±5, ±9.3, ±13.6 m from the middle
 *     (scaled by the 46 m face, 10.5 px/m), corner towers ~7 m wide with a
 *     step at the outer corner, shaft tops ~14 m over
 *     the parapet, middle cluster 4 m wide, its shaft ~7 m over the parapet;
 *   "Top of One PPG Place, 2025-04-23.jpg" (Cbaile19, CC0) — the crown close up;
 *   "Oneppgplace.jpg" (Dllu, CC BY-SA 4.0) — from Mount Washington's west end;
 *   "PPGPlacefromMtWashington.JPG" (TheZachMorrisExperience, CC BY-SA 3.0) —
 *     from the south;
 *   "Pittsburgh-pennsylvania-ppg-place-2007.jpg" (Derek Jensen, public domain)
 *     — high view from the north-east over Market Square;
 *   "PPG Place in Pittsburgh in 2016.jpg" (Dllu, CC BY-SA 4.0) — the plaza
 *     face and the four pointed lobby gables;
 *   "PPG Place, PPG Place and 3rd Avenue, Pittsburgh, PA.jpg" (w_lemay,
 *     CC BY-SA 2.0) — the south-south-west face in sun, the stepped corners;
 *   Flickr "PPG Place, Pittsburgh PA" 8899998941 (Roy Luck, CC BY 2.0) and
 *     10650307783 (cdschock, CC BY 2.0) — the pleats from below.
 *   USGS NAIP for the plan. No commercial imagery.
 *
 * Estimated: pleat depth (2.0 m, a little deep so the folds read) and width (2.6 m); the lobby gables (four,
 * 6.6 m wide, springing at 10 m, apex 16 m, from the 2016 photo); the trim
 * lines every three floors (12.9 m), which stand for the silver mullion grid;
 * the two corner steps (150 and 160 m, 2 and 5 m square, from the w_lemay photo, where the outer corner strips stop short of the parapet in two steps); the light silver glass (#a9bfd1) with the pleats'
 * second faces a tone darker, from the daylight photos.
 * Invented: nothing beyond simplification. Left out: the mullion grid itself,
 * the skywalk to Two PPG Place (in the plaza model's area, not drawn), the
 * flagpoles and roof lights.
 *
 * Night: the office glass is `window` and `window-3`, the spires `window-2` (they are lit
 * after dark), the lobby gables `entrance`.
 *
 * Doubts: the corner towers' own faceting is drawn as an octagonal shaft, not
 * the real bundle of pleats; the north and west faces are seen only at a
 * slant in the photos and are drawn like the south one (the building is
 * symmetric in every photo).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, chamfer, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Glass-Gothic helpers, shared with pit-ppg-place-plaza.ts.

/** PPG Place's silver mirror glass, its lit spires and its mullions. */
export const PPG = {
  glass: { ...PALETTE.window, color: 0xa9bfd1 },
  /** the pleat faces turned away: the same glass a tone darker, so the folds read */
  shade: windowVariant(3, 0x8ea4b7),
  spire: windowVariant(2, 0xcad7e2),
  mullion: finish('ppg-mullion', 0xd3d9df, 0.5),
  roof: { ...PALETTE.roof, color: 0xc6d0d9 },
  lobby: { ...PALETTE.entrance, color: 0x5d6d7a },
}

export const rotXY = ([x, y]: XY, deg: number): XY => {
  const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180)
  return [x * c - y * s, x * s + y * c]
}
const v3 = ([x, y]: XY, z: number): V3 => [x, y, z]

/** Pyramid from a counter-clockwise ring at z up to a tip. */
export function pyramid(p: Part, r: XY[], z: number, tip: V3) {
  for (let i = 0; i < r.length; i++) p.tri(v3(r[i], z), v3(r[(i + 1) % r.length], z), tip)
}

/** A prism over a counter-clockwise ring from z0 to z1, top capped (optionally in another part). */
export function prism(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  walls(p, r, z0, z1)
  if (top) cap(top, r, z1)
  if (bottom) cap(p, r, z0, false)
}

/** An octagonal (chamfered square) ring, half-width h, about (cx, cy). */
export const octagon = (cx: number, cy: number, h: number, ch = h * 0.42): XY[] =>
  chamfer([[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], ch)

/**
 * A pinnacle: an octagonal shaft of half-width h from z0 to z1 and a spire
 * on it to zTip. Shaft in `body`, spire in `spire`.
 */
export function pinnacle(body: Part, spire: Part, cx: number, cy: number, h: number, z0: number, z1: number, zTip: number) {
  const r = octagon(cx, cy, h)
  walls(body, r, z0, z1)
  pyramid(spire, r, z1, [cx, cy, zTip])
}

/**
 * A pleat on a wall: the triangle that stands out of the wall a→b (counter-
 * clockwise ring, so outside is to the right) at s metres along it, `w` half
 * wide and `d` deep. Returns its three plan points in ring order.
 */
export function pleatPts(a: XY, b: XY, s: number, w: number, d: number): XY[] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (t: number, o: number): XY => [a[0] + u[0] * t + n[0] * o, a[1] + u[1] * t + n[1] * o]
  return [P(s - w, 0), P(s, d), P(s + w, 0)]
}

/**
 * A pleat spire above an eave: a diamond (the pleat's triangle plus a point
 * `back` behind the wall) carried `rise` up as a shaft and finished with a
 * pyramid to `tip` over the eave.
 */
export function pleatSpire(body: Part, spire: Part, a: XY, b: XY, s: number, w: number, d: number, z0: number, rise: number, tip: number, back = 0.7) {
  const [p0, p1, p2] = pleatPts(a, b, s, w, d)
  const [, pb] = pleatPts(a, b, s, w, -back)
  const r: XY[] = [p0, p1, p2, pb].reverse() // pleatPts runs along a→b; the diamond needs counter-clockwise
  const ccw = area(r) > 0 ? r : [...r].reverse()
  walls(body, ccw, z0, z0 + rise)
  const c: XY = [(p1[0] + pb[0]) / 2, (p1[1] + pb[1]) / 2]
  pyramid(spire, ccw, z0 + rise, [c[0], c[1], z0 + tip])
}
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Flat trim lines at the given heights on a wall a→b between s0 and s1, 0.04 m proud. */
export function trimLine(p: Part, a: XY, b: XY, s0: number, s1: number, z: number, t = 0.28, out = 0.04) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, zz: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, zz]
  p.quad(P(s0, z - t / 2), P(s1, z - t / 2), P(s1, z + t / 2), P(s0, z + t / 2))
}

// ---------------------------------------------------------------------------
// One PPG Place

const ID = 'pit-ppg-place'
const ANCHOR: [number, number] = [40.439993, -80.003772]
const BEARING = 26.5

function build() {
  const glass = new Part(), shade = new Part(), spire = new Part(), trim = new Part(), roof = new Part(), lobby = new Part()

  const H = 23.0 // half the square, to the flat wall between pleats
  const PARAPET = 171.7, STEP0 = 150, STEP = 160 // corner steps: the outer corner stops here
  const PLEATS = [13.6, 9.3, 5.0] // pleat centres either side of the middle (photo)
  const PW = 1.3, PD = 2.0 // pleat half-width and depth
  const MID = { w: 2.2, top: 1.1, d: 1.6 } // middle prism: base half-width, front half-width, depth
  const NOTCH0 = 2.0, NOTCH = 5.0 // the corner squares cut out above STEP0 and STEP
  const PLAZA_FACE = 3, GABLE_TOP = 16 // face 3 is +x; its pleats start over the lobby gables
  const GROUND_PLAZA = 2.2 // ground on the plaza side above the base

  /** The +y face's plan points from the corner (H,H) going -x; `pleats` false leaves the wall flat. */
  const facePts = (pleats: boolean, notch: number): XY[] => {
    const pts: XY[] = notch ? [[H, H - notch], [H - notch, H - notch], [H - notch, H]] : [[H, H]]
    if (!pleats) return pts
    for (const s of PLEATS) pts.push([s + PW, H], [s, H + PD], [s - PW, H])
    pts.push([MID.w, H], [MID.top, H + MID.d], [-MID.top, H + MID.d], [-MID.w, H])
    for (const s of [...PLEATS].reverse()) pts.push([-s + PW, H], [-s, H + PD], [-s - PW, H])
    return pts
  }
  // Face k is the +y face turned k × 90° counter-clockwise: 0 +y, 1 -x, 2 -y, 3 +x.
  const ring = (notch: number, flatFace = -1): XY[] =>
    [0, 1, 2, 3].flatMap(k => facePts(k !== flatFace, notch).map(p => rotXY(p, k * 90)))

  // --- Body: three sections (lobby, shaft, top storeys with the corners cut). ---
  const lowRing = ring(0, PLAZA_FACE), midRing = ring(0), stepRing = ring(NOTCH0), topRing = ring(NOTCH)
  // pleat noses, so each fold's second face (nose back to the wall) can take the darker tone
  const key = (p: XY) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`
  const noses = new Set([0, 1, 2, 3].flatMap(k => PLEATS.flatMap(s => [[s, H + PD], [-s, H + PD]] as XY[]).map(p => key(rotXY(p, k * 90)))))
  const body = (r: XY[], z0: number, z1: number) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      ;(noses.has(key(a)) ? shade : glass).quad(v3(a, z0), v3(b, z0), v3(b, z1), v3(a, z1))
    }
  }
  body(lowRing, 0, GABLE_TOP)
  body(midRing, GABLE_TOP, STEP0)
  body(stepRing, STEP0, STEP)
  body(topRing, STEP, PARAPET)
  // undersides of the plaza face's pleats over the gables
  for (const s of [...PLEATS, ...PLEATS.map(v => -v)]) {
    const [a, b, c] = [[s + PW, H], [s, H + PD], [s - PW, H]].map(p => rotXY(p as XY, 270))
    glass.tri(v3(a, GABLE_TOP), v3(c, GABLE_TOP), v3(b, GABLE_TOP))
  }
  {
    const m = [[MID.w, H], [MID.top, H + MID.d], [-MID.top, H + MID.d], [-MID.w, H]].map(p => rotXY(p as XY, 270))
    glass.quad(v3(m[0], GABLE_TOP), v3(m[3], GABLE_TOP), v3(m[2], GABLE_TOP), v3(m[1], GABLE_TOP))
  }
  cap(roof, topRing, PARAPET)
  // ledges where the corners step back
  for (let k = 0; k < 4; k++) for (const [n, z] of [[NOTCH0, STEP0], [NOTCH, STEP]]) {
    const sq: XY[] = [[H - n, H - n], [H, H - n], [H, H], [H - n, H]].map(p => rotXY(p as XY, k * 90))
    cap(roof, sq, z)
  }
  // roof plant
  prism(roof, chamfer([[-7, -7], [7, -7], [7, 7], [-7, 7]], 0.5), PARAPET - 0.2, 174.8)

  // --- Corner towers: octagonal shaft from the step, tall spire, four spirelets. ---
  const CT = 3.7, CC = H - 4.9 // shaft half-width, centre offset (1.2 m in from both faces)
  for (let k = 0; k < 4; k++) {
    const [cx, cy] = rotXY([CC, CC], k * 90)
    const r = octagon(cx, cy, CT, 1.0)
    walls(glass, r, STEP0 - 0.5, 184.5)
    cap(roof, r, 184.5)
    pinnacle(glass, spire, cx, cy, 3.0, 184.4, 187.5, 195.2)
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pinnacle(glass, spire, cx + dx * 2.45, cy + dy * 2.45, 0.95, 184.4, 186.5, 190.2)
  }

  // --- Middle clusters and pleat spires on every face. ---
  for (let k = 0; k < 4; k++) {
    const R = (p: XY) => rotXY(p, k * 90)
    const mid: XY[] = ([[MID.w, H], [MID.top, H + MID.d], [-MID.top, H + MID.d], [-MID.w, H], [-MID.w, H - 1.6], [MID.w, H - 1.6]] as XY[]).map(R)
    const ccw = area(mid) > 0 ? mid : [...mid].reverse()
    walls(glass, ccw, PARAPET - 0.2, 178.5)
    pyramid(spire, ccw, 178.5, [...R([0, H - 0.2]), 184.2] as V3)
    for (const sx of [-1, 1]) pinnacle(glass, spire, ...R([sx * 1.75, H - 0.3]), 0.7, 178.3, 179.3, 181.2)
    // the face's wall line, as a→b running counter-clockwise (from +x end to -x end before turning)
    const a = R([H, H]), b = R([-H, H])
    for (const s of PLEATS.flatMap(v => [H - v, H + v])) pleatSpire(glass, spire, a, b, s, PW, PD, PARAPET - 0.2, 2.2, 6.0)
  }

  // --- Pale mullions down the pleat noses (no horizontal lines: none read at map distance). ---
  {
    for (let k = 0; k < 4; k++) {
      const a = rotXY([H, H], k * 90), b = rotXY([-H, H], k * 90)
      // a pale mullion down each pleat's nose and the middle prism's front corners
      const nose = (p0: XY, p1: XY, p2: XY, z0: number) => {
        const l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
        for (const [q0, q1, s0, s1] of [[p0, p1, l1 - 0.22, l1], [p1, p2, 0, 0.22]] as [XY, XY, number, number][]) {
          const L = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]), u: XY = [(q1[0] - q0[0]) / L, (q1[1] - q0[1]) / L], n: XY = [u[1], -u[0]]
          const P = (s: number, z: number): V3 => [q0[0] + u[0] * s + n[0] * 0.04, q0[1] + u[1] * s + n[1] * 0.04, z]
          trim.quad(P(s0, z0), P(s1, z0), P(s1, PARAPET), P(s0, PARAPET))
        }
        void l2
      }
      for (const v of PLEATS.flatMap(q => [H - q, H + q])) {
        const [p0, p1, p2] = pleatPts(a, b, v, PW, PD)
        nose(p0, p1, p2, k === PLAZA_FACE ? GABLE_TOP : 0)
      }
    }
  }

  // --- Lobby gables on the plaza face: four pointed glass bays in silver frames. ---
  {
    const a = rotXY([H, H], 270), b = rotXY([-H, H], 270)
    const L = 2 * H, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number, out: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
    const z0 = GROUND_PLAZA, spring = 10, apex = GABLE_TOP - 0.4
    for (const c of [-10.5, -3.5, 3.5, 10.5]) {
      const s = H + c, w = 3.3
      // frame: a slightly larger pentagon in trim, then the glass inside it
      for (const [part, ww, sp, ap, out] of [[trim, w, spring, apex, 0.04], [lobby, w - 0.45, spring + 0.2, apex - 0.7, 0.08]] as [Part, number, number, number, number][]) {
        const pts: V3[] = [P(s - ww, z0, out), P(s + ww, z0, out), P(s + ww, sp, out), P(s, ap, out), P(s - ww, sp, out)]
        for (let i = 1; i < 4; i++) part.tri(pts[0], pts[i], pts[i + 1])
      }
    }
  }

  return [
    { part: glass, material: PPG.glass },
    { part: shade, material: PPG.shade },
    { part: spire, material: PPG.spire },
    { part: trim, material: PPG.mullion },
    { part: roof, material: PPG.roof },
    { part: lobby, material: PPG.lobby },
  ]
}

if (import.meta.main) await save(ID, 'One PPG Place', ANCHOR, BEARING, build(), 6500)
