/**
 * Downtown Presbyterian Church, Nashville (First Presbyterian Church,
 * William Strickland, 1849–51; Egyptian Revival) — original procedural
 * geometry, CC0-1.0.
 * bun generators/nash-downtown-presbyterian.ts
 *
 * Also exports small helpers (wall faces by compass side, tapered prisms,
 * cavetto cornices, chamfered squares, round columns, Egyptian window
 * frames) that nash-christ-church-cathedral.ts, nash-customs-house.ts,
 * nash-davidson-county-courthouse.ts and nash-hermitage-hotel.ts import;
 * the church is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * is the church's long axis pointing at the twin-towered front on Church
 * Street, and +x is the 5th Avenue (east) side. Anchor = area centroid of
 * OSM way/267404662, 36.163040, -86.779808. y = 0 is the lowest ground
 * under the footprint: the rear west corner (lidar ground 2.5 m above the
 * box's ground_min); the Church Street pavement in front is 2.3 m higher.
 *
 * Identity, in order: the two tall brick towers, each a square lower stage
 * under a big cavetto cornice, two short set-back stages, a slightly
 * battered shaft with a louvred belfry opening in a green copper frame on
 * every face, a cornice, and an octagonal top stage under a flared copper
 * crown; between them the recessed porch with two lotus columns in antis
 * under a cream entablature with the winged sun disk and a cavetto
 * cornice, a low brick pediment over it; the inscribed tablets in battered
 * cream frames on the tower fronts; the long brick sides with five tall
 * windows in battered frames under cavetto hoods, between pilasters, on a
 * pale limestone base.
 *
 * Evidence:
 *  - plan: HABS TENN,19-NASH,13 sheet 2 (first-floor plan, 1971): overall
 *    137'9" (42.0 m) long; front 22'2" + 35'11" + 22'2" (24.5 m), the
 *    towers 22'2" (6.76 m) square, the nave 75 ft (22.9 m) wide so the
 *    towers stand 0.8 m proud of the side walls; the porch 4.1 m deep with
 *    its columns 2.6 m behind the tower faces and 4.2 m apart; five
 *    windows a side, centres 5.3, 11.6, 17.9, 24.3, 30.6 m from the rear
 *    wall. Published (measured drawing). OSM way/267404662 is 24.6 x
 *    39.1 m; the lidar footprint runs 42 m from the tower faces, so the
 *    rear wall is drawn 2.1 m past the OSM outline (into the 1950s
 *    addition, way/464659483, which is not modelled).
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid, read
 *    in the model frame. Above y = 0: tower tops 34.9 (crown cap 35.2),
 *    upper shaft ~6 m square; the lip of the lower stage's cornice 15.6
 *    (its top drawn at 16.6, where the photo puts it, the lip sloping);
 *    porch entablature 17.0–17.3; nave ridge 19.2, side eaves 17.3–17.5.
 *    Measured.
 *  - tower stages, tablet and window sizes: from Andrew Jameson's frontal
 *    photo, scaled to the lidar (estimated): stone base 2.9 m above the
 *    street, set-back stages 1.65 and 1.75 m, shaft 7.3 m with a 4.7 m
 *    louvred opening, octagon 4.8 m, crown 1.7 m; tablets 3.5 m wide.
 *  - sides: window frames and pilasters from LeMay's north-east view and
 *    HABS photo "West side, detail of windows" (estimated heights).
 *  - colours: dark brown brick (sampled #5f544d–#827567, pulled light),
 *    cream painted stone portico and frames, grey limestone base (close to
 *    the cream in the photos, drawn in the same trim), green copper crowns,
 *    window frames and pilaster caps; roof pale grey (NAIP).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - FirstPresbyterianChurchNashville.jpg, Andrew Jameson, CC BY-SA 3.0
 *    (front, square on) https://commons.wikimedia.org/wiki/File:FirstPresbyterianChurchNashville.jpg
 *  - Downtown Presbyterian Church, Church Street and 5th Avenue,
 *    Nashville, TN (54385282238), (54385241839), (54385423205),
 *    (54384169627), (54385241414), Warren LeMay, CC BY-SA 2.0 (front,
 *    north-east corner, porch, side window, tower)
 *    https://commons.wikimedia.org/wiki/File:Downtown_Presbyterian_Church,_Church_Street_and_5th_Avenue,_Nashville,_TN_(54385282238).jpg
 *    https://commons.wikimedia.org/wiki/File:Downtown_Presbyterian_Church,_Church_Street_and_5th_Avenue,_Nashville,_TN_(54384169627).jpg
 *  - HABS TENN,19-NASH,13: "North front from northwest", "North front from
 *    northeast", "West side, detail of windows", sheets 1 and 2; public
 *    domain. https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church,_154_Fifth_Avenue,_Nashville,_Davidson_County,_TN_HABS_TENN,19-NASH,13-_(sheet_2_of_2).png
 *  - USGS NAIP (public domain): plan and roof colour.
 * No look-only sources. No commercial imagery.
 *
 * The brief called it "stuccoed, warm tan": every photo shows dark brown
 * brick with cream trim (the upper tower stages read tan in low sun), so
 * the photos win.
 *
 * Night: windows glow; the doors are `entrance`; the tower fronts and the
 * portico carry floodlight (the towers are floodlit from the street).
 *
 * Left out: column fluting, the rings on the column shafts, the panels in
 * the cornice, the reeded frieze, the inscriptions, railings, signs, the
 * basement windows, the 1950s addition behind.
 *
 * Doubts: the rear wall is hidden behind the addition and drawn plain; the
 * west side is seen only obliquely (drawn as the east side); stage heights
 * on the towers are photo-scaled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { at, capPoly, offset, prism, save, type XY } from './atl-westin-peachtree-plaza'
import { face, opening, shape, rectOn, band, prismV, quadH, block, type Face } from './nash-ryman-auditorium'

// ───────────────────────── helpers shared by this builder's nash- models ─────────────────────────

export type Side = 'N' | 'S' | 'E' | 'W'
/** A wall face on the plane y = c (N/S) or x = c (E/W), outward to `dir`; `s(u)` maps a world coordinate along it to the face's s. */
export function wf(dir: Side, c: number, lo: number, hi: number): { f: Face; s: (u: number) => number } {
  if (dir === 'N') return { f: face([hi, c], [lo, c]), s: (u) => hi - u }
  if (dir === 'S') return { f: face([lo, c], [hi, c]), s: (u) => u - lo }
  if (dir === 'E') return { f: face([c, lo], [c, hi]), s: (u) => u - lo }
  return { f: face([c, hi], [c, lo]), s: (u) => hi - u }
}
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A square (or rectangle) with its corners chamfered by c: an octagon when c ≈ 0.29 of the side. */
export function chamfered(cx: number, cy: number, hx: number, hy: number, c: number): XY[] {
  return [[cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c], [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c]]
}
/** Walls lofted from ring a at z0 to ring b at z1 (same count, ccw), capped on top. */
export function taper(p: Part, a: XY[], b: XY[], z0: number, z1: number, top: Part | null = p) {
  p.loft([at(a, z0), at(b, z1)])
  if (top) capPoly(top, b, z1, true)
}
/** A cavetto (Egyptian gorge) cornice round a ccw ring: flares out by `out` from z0 to z1, with a flat top. */
export function cavetto(p: Part, ring: XY[], z0: number, z1: number, out: number, top: Part | null = p) {
  const h = z1 - z0
  const r1 = offset(ring, out * 0.18), r2 = offset(ring, out * 0.6), r3 = offset(ring, out)
  p.loft([at(ring, z0), at(r1, z0 + h * 0.45), at(r2, z0 + h * 0.75), at(r3, z1 - h * 0.12), at(r3, z1)])
  if (top) capPoly(top, r3, z1, true)
}
/** A round shaft (smooth-ish, `n` sides) from z0 to z1, radius r0 → r1. */
export function shaft(p: Part, x: number, y: number, r0: number, r1: number, z0: number, z1: number, n = 12) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * Math.PI * 2), y + r * Math.sin((i / n) * Math.PI * 2), z] as V3)
  p.loft([ring(r0, z0), ring(r1, z1)])
  return ring
}
/** A lathe: radii/heights profile [[r, z], ...] round (x, y), capped on top. */
export function lathe(p: Part, x: number, y: number, prof: [number, number][], n = 12, capTop = true) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * Math.PI * 2), y + r * Math.sin((i / n) * Math.PI * 2), z] as V3)
  p.loft(prof.map(([r, z]) => ring(r, z)))
  if (capTop) { const [r, z] = prof[prof.length - 1]; p.cap(ring(r, z), true) }
}
/**
 * An Egyptian window: a battered cream surround (wider at the foot), the
 * glass (or a louvre) inside, and a cavetto hood standing proud over it.
 */
export function egyptWindow(frame: Part, glass: Part, f: Face, s: number, w: number, z0: number, z1: number, o: { border?: number; batter?: number; hood?: Part | null; hoodH?: number } = {}) {
  const b = o.border ?? 0.35, k = o.batter ?? 0.12
  shape(frame, f, [[s - w / 2 - b - k, z0 - b * 0.6], [s + w / 2 + b + k, z0 - b * 0.6], [s + w / 2 + b, z1], [s - w / 2 - b, z1]], 0.05)
  shape(glass, f, [[s - w / 2 - k * 0.6, z0], [s + w / 2 + k * 0.6, z0], [s + w / 2, z1 - 0.05], [s - w / 2, z1 - 0.05]], 0.1)
  if (o.hood !== null) {
    const hh = o.hoodH ?? 0.6, hp = o.hood ?? frame
    band(hp, f, s - w / 2 - b - 0.12, s + w / 2 + b + 0.12, z1, z1 + hh * 0.45, 0.12)
    band(hp, f, s - w / 2 - b - 0.3, s + w / 2 + b + 0.3, z1 + hh * 0.45, z1 + hh, 0.3)
  }
}

// ───────────────────────── the church ─────────────────────────

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), cu = new Part(), door = new Part()

  // Plan (HABS sheet 2, placed on the lidar footprint).
  const YF = 20.2, YR = -21.8, TW = 6.76, XO = 12.23, XN = 11.45
  const YT = YF - TW // back of the towers
  const XI = XO - TW // inner face of the towers (porch side), 5.47
  const YC = YF - 2.6, YB = YF - 4.1 // columns, porch back wall
  // Heights above y = 0.
  const ST = 2.3 // the Church Street pavement
  const BASE = ST + 2.9, PORCH = ST + 2.3, SB = 3.4 // tower base; porch floor; side base
  const T1 = 16.6, T2 = 18.25, T3 = 20.0, T3b = 20.6, T4 = 27.9, T4b = 28.4, T5 = 33.2, T6 = 34.9, CAP = 35.2
  const EAVE = 17.3, RIDGE = 19.2, ENT0 = 13.8, ENT1 = 17.0

  // ── Nave ──
  prism(trim, rect(-XN - 0.08, YR - 0.08, XN + 0.08, YT), 0, SB, trim, 0.05)
  prism(brick, rect(-XN, YR, XN, YT), SB, EAVE - 1.0, brick, 0.01)
  cavetto(brick, rect(-XN, YR, XN, YT), EAVE - 1.0, EAVE, 0.35, null)
  // Roof: two low slopes from the cornice to the ridge, gables front and rear.
  {
    const xe = XN + 0.35, y0 = YR - 0.2, y1 = YT
    for (const s of [-1, 1]) {
      quadH(roof, [s * xe, y0, EAVE], [s * xe, y1, EAVE], [0, y1, RIDGE], [0, y0, RIDGE], [0, 0, 1])
    }
    capPoly(roof, [[-xe, y0], [xe, y0], [xe, y1], [-xe, y1]], EAVE - 0.01, true)
    // rear gable end
    prismV(brick, [[-xe, EAVE], [xe, EAVE], [0, RIDGE]], [1, 0], [0, 0], YR - 0.2, YR + 0.4)
  }
  // Pilasters and windows on both sides: five bays.
  const bays = [5.3, 11.6, 17.9, 24.3, 30.6].map((d) => YR + d)
  const piers = [YR + 0.5, ...bays.slice(0, -1).map((y, i) => (y + bays[i + 1]) / 2), YT - 0.9]
  for (const dir of ['E', 'W'] as const) {
    const X = dir === 'E' ? XN : -XN
    const { f, s } = wf(dir, X, YR, YT)
    for (const y of piers) band(brick, f, s(y) - 0.45, s(y) + 0.45, SB, EAVE - 1.1, 0.14)
    for (const y of bays) egyptWindow(trim, win, f, s(y), 1.75, SB + 0.6, SB + 9.2, { border: 0.38, batter: 0.15 })
    band(trim, f, 0, f.L, SB - 0.15, SB, 0.12)
  }

  // ── Towers ──
  for (const sx of [-1, 1]) {
    const cx = sx * (XO - TW / 2), cy = YF - TW / 2, h = TW / 2
    // lower stage: limestone base, brick, corner pilasters, cavetto cornice
    prism(trim, rect(cx - h - 0.06, cy - h - 0.06, cx + h + 0.06, cy + h + 0.06), 0, BASE, trim, 0.05)
    prism(brick, rect(cx - h, cy - h, cx + h, cy + h), BASE, T1 - 1.1, brick, 0.01)
    cavetto(brick, rect(cx - h, cy - h, cx + h, cy + h), T1 - 1.1, T1, 0.65)
    block(cu, cx - h - 0.65, cx + h + 0.65, cy - h - 0.65, cy + h + 0.65, T1 - 0.15, T1 + 0.02) // pale lip on the cornice
    // pilasters at the corners of the front and the outer side, with copper capitals
    const front = wf('N', YF, cx - h, cx + h), outer = wf(sx > 0 ? 'E' : 'W', cx + sx * h, cy - h, cy + h)
    for (const { f } of [front, outer]) {
      for (const s0 of [0, f.L - 0.9]) {
        band(brick, f, s0, s0 + 0.9, BASE, T1 - 2.2, 0.14)
        band(cu, f, s0 - 0.08, s0 + 0.98, T1 - 2.2, T1 - 1.6, 0.3)
      }
    }
    // the inscribed tablet on the front, in a battered cream frame with a cavetto hood
    egyptWindow(trim, trim, front.f, front.f.L / 2, 1.8, BASE + 0.9, BASE + 7.8, { border: 0.55, batter: 0.2 })
    rectOn(trim, front.f, front.f.L / 2 - 0.85, front.f.L / 2 + 0.85, BASE + 0.9, BASE + 7.7, 0.14)
    // the outer side: a tall window in the same frame
    egyptWindow(trim, win, outer.f, outer.f.L / 2, 1.5, BASE + 0.9, BASE + 7.8, { border: 0.4, batter: 0.15 })

    // two short set-back stages, then ledges
    const r2 = rect(cx - h + 0.15, cy - h + 0.15, cx + h - 0.15, cy + h - 0.15)
    prism(brick, r2, T1, T2, brick, 0.05)
    const r3 = rect(cx - h + 0.3, cy - h + 0.3, cx + h - 0.3, cy + h - 0.3)
    prism(brick, r3, T2, T3, brick, 0.05)
    cavetto(brick, r3, T3, T3 + 0.3, 0.12)
    prism(brick, rect(cx - h + 0.35, cy - h + 0.35, cx + h - 0.35, cy + h - 0.35), T3 + 0.3, T3b, brick, 0.03)
    // the battered shaft (6.0 m to 5.7 m)
    const a4 = rect(cx - 3.0, cy - 3.0, cx + 3.0, cy + 3.0), b4 = rect(cx - 2.85, cy - 2.85, cx + 2.85, cy + 2.85)
    taper(brick, a4, b4, T3b, T4 - 0.5, null)
    cavetto(brick, b4, T4 - 0.5, T4, 0.3)
    prism(brick, rect(cx - 2.9, cy - 2.9, cx + 2.9, cy + 2.9), T4, T4b, brick, 0.05)
    // belfry openings on all four faces: green copper frame, louvre, cavetto hood
    for (const [dir, c, lo, hi] of [['N', cy + 2.92, cx - 3, cx + 3], ['S', cy - 2.92, cx - 3, cx + 3], ['E', cx + 2.92, cy - 3, cy + 3], ['W', cx - 2.92, cy - 3, cy + 3]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      egyptWindow(cu, roof, f, f.L / 2, 1.3, T3b + 0.9, T3b + 5.6, { border: 0.3, batter: 0.06, hoodH: 0.6 })
    }
    // octagonal top stage, louvres on the four main faces, flared copper crown and low cap
    const oc = chamfered(cx, cy, 2.5, 2.5, 0.75)
    taper(brick, oc, chamfered(cx, cy, 2.42, 2.42, 0.72), T4b, T5, null)
    for (const [dir, c, lo, hi] of [['N', cy + 2.48, cx - 1, cx + 1], ['S', cy - 2.48, cx - 1, cx + 1], ['E', cx + 2.48, cy - 1, cy + 1], ['W', cx - 2.48, cy - 1, cy + 1]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      rectOn(trim, f, f.L / 2 - 0.65, f.L / 2 + 0.65, T4b + 0.75, T4b + 3.75, 0.04)
      rectOn(roof, f, f.L / 2 - 0.5, f.L / 2 + 0.5, T4b + 0.9, T4b + 3.6, 0.08)
    }
    cavetto(cu, chamfered(cx, cy, 2.42, 2.42, 0.72), T5, T6, 0.55, null)
    const ocTop = chamfered(cx, cy, 2.97, 2.97, 0.95)
    capPoly(cu, ocTop, T6, true)
    taper(cu, chamfered(cx, cy, 2.6, 2.6, 0.8), chamfered(cx, cy, 1.0, 1.0, 0.3), T6, CAP + 0.3)
  }

  // ── Porch ──
  // porch floor and the steps down to the street (steps run 1.2 m past the tower faces)
  block(trim, -XI, XI, YB, YF - 0.6, 0, PORCH)
  for (let i = 0; i < 5; i++) block(trim, -XI + 0.4, XI - 0.4, YF - 0.6 + i * 0.36, YF - 0.6 + (i + 1) * 0.36, 0, PORCH - (i + 1) * ((PORCH - ST) / 5.5))
  // back wall of the porch
  prism(brick, rect(-XI, YT, XI, YB), BASE - 0.6, ENT1, brick, 0.01)
  {
    const { f, s } = wf('N', YB, -XI, XI)
    // central double door with transom, side doors, upper windows
    egyptWindow(trim, door, f, s(0), 2.2, PORCH + 0.1, PORCH + 4.6, { border: 0.35, batter: 0.1 })
    rectOn(win, f, s(0) - 1.0, s(0) + 1.0, PORCH + 3.6, PORCH + 4.5, 0.12)
    for (const x of [-3.75, 3.75]) {
      egyptWindow(trim, door, f, s(x), 1.3, PORCH + 0.1, PORCH + 3.5, { border: 0.3, batter: 0.08 })
      rectOn(win, f, s(x) - 0.6, s(x) + 0.6, PORCH + 2.7, PORCH + 3.4, 0.12)
      rectOn(trim, f, s(x) - 0.7, s(x) + 0.7, PORCH + 5.6, PORCH + 7.2, 0.05)
      rectOn(win, f, s(x) - 0.55, s(x) + 0.55, PORCH + 5.75, PORCH + 7.05, 0.09)
    }
  }
  // two lotus columns in antis: plain shafts (cream), bell capitals, abaci
  for (const x of [-2.1, 2.1]) {
    lathe(trim, x, YC, [[0.72, PORCH], [0.72, PORCH + 0.4], [0.6, PORCH + 0.5], [0.56, ENT0 - 1.5], [0.6, ENT0 - 1.3], [0.95, ENT0 - 0.35], [0.95, ENT0 - 0.3]], 12, false)
    block(trim, x - 0.62, x + 0.62, YC - 0.62, YC + 0.62, ENT0 - 0.3, ENT0)
  }
  // entablature: architrave, frieze with the winged disk, cavetto cornice
  const EF = YF - 0.55
  prism(trim, rect(-XI, YB, XI, EF), ENT0, ENT0 + 2.2, trim, 0.01)
  cavetto(trim, rect(-XI, YB, XI, EF), ENT0 + 2.2, ENT1, 0.5, null)
  {
    const { f, s } = wf('N', EF, -XI, XI)
    band(trim, f, 0.15, f.L - 0.15, ENT0, ENT0 + 0.7, 0.08) // architrave
    // the winged sun disk: wings as tapering bands, the disk standing proud, copper-dark to read
    const c = s(0), zc = ENT0 + 1.45
    for (const sg of [-1, 1]) {
      shape(cu, f, sg > 0
        ? [[c + 0.35, zc - 0.15], [c + 1.6, zc - 0.05], [c + 1.6, zc + 0.3], [c + 0.35, zc + 0.35]]
        : [[c - 1.6, zc - 0.05], [c - 0.35, zc - 0.15], [c - 0.35, zc + 0.35], [c - 1.6, zc + 0.3]], 0.08)
    }
    shape(cu, f, Array.from({ length: 12 }, (_, i) => [c + 0.42 * Math.cos((i / 12) * Math.PI * 2), zc + 0.1 + 0.42 * Math.sin((i / 12) * Math.PI * 2)] as XY), 0.14)
    // triglyph-like groups either side
    for (const sg of [-1, 1]) for (const d of [2.6, 3.9]) for (const k of [-0.2, 0, 0.2]) rectOn(cu, f, c + sg * d + k - 0.05, c + sg * d + k + 0.05, ENT0 + 1.0, ENT0 + 1.9, 0.04)
  }
  // low brick pediment over the porch with a cream raking coping
  prismV(brick, [[-XI, ENT1], [XI, ENT1], [0, RIDGE]], [1, 0], [0, 0], YT, YF - 0.6)
  for (const s of [-1, 1]) {
    const a: V3 = [s * (XI + 0.05), YF - 0.45, ENT1 + 0.05], b: V3 = [0, YF - 0.45, RIDGE + 0.25]
    const a2: V3 = [s * (XI + 0.05), YF - 1.2, ENT1 + 0.05], b2: V3 = [0, YF - 1.2, RIDGE + 0.25]
    quadH(trim, a, b, b2, a2, [0, 0, 1])
    quadH(roof, [s * XI, YF - 1.2, ENT1 + 0.02], [0, YF - 1.2, RIDGE + 0.02], [0, YT, RIDGE + 0.02], [s * XI, YT, ENT1 + 0.02], [0, 0, 1])
    quadH(trim, [a[0], a[1], a[2] - 0.3], [b[0], b[1], b[2] - 0.3], b, a, [0, 1, 0])
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > YT - 0.5 && n[1] > 0.5 ? 0.85 : p[1] > YT - 0.5 && Math.abs(n[0]) > 0.7 ? 0.5 : 0)
  return [
    { part: brick, material: { ...finish('dpc-brick', 0x8d7a6b), floodlight: lit } },
    { part: trim, material: { ...finish('dpc-cream', 0xe2d8c2), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: cu, material: PALETTE.copper },
    { part: door, material: { ...PALETTE.entrance, color: 0xa98a64 } },
  ]
}

if (import.meta.main) {
  await save('nash-downtown-presbyterian', 'Downtown Presbyterian Church', build(), { height: 35.5, anchor: [36.16304, -86.779808], bearing: 332 })
}
