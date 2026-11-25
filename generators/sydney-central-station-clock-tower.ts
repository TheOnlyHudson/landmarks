/**
 * Central Station (Sydney Terminal building) and its clock tower, Eddy
 * Avenue, Haymarket, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-central-station-clock-tower.ts
 *
 * Map frame: x along the main range (compass 123.1, OSM's long edges of
 * way/16748116), y towards Eddy Avenue (compass 33.1), z up, metres; the
 * catalog bearing is 33.1. Origin (the anchor) at 151.2067683,
 * -33.8827054, inside the outline about 25 m east of its area centroid
 * (an early centroid computation; the plan is OSM's in this frame). y = 0 is Eddy Avenue's street level, the
 * lowest ground under the footprint; the concourse (and the carriage drive
 * on the colonnade) stands 8.5 m above it on the sandstone viaducts.
 *
 * Federation Free Classical in Sydney sandstone, by Walter Liberty Vernon
 * (1901-1906); the clock tower was added at the north-west corner in
 * 1921. Modelled: the U-shaped terminal building (OSM way/16748116: the
 * Eddy Avenue range 18.4 m deep and 135 m long, the Pitt Street wing on the
 * west and the eastern wing), the clock tower (way/506597798), the Eddy
 * Avenue colonnade / porte-cochère on its street arcade (way/400070125)
 * and the arcaded carriage-drive viaduct that wraps the tower's corner
 * along Pitt Street (way/400071806, mapped as a roof). The Grand Concourse
 * vault (way/808966807) and the platform awnings are separate OSM
 * buildings and are left to the map, as the brief says.
 *
 * Published: tower tip 85.6 m AHD (Wikipedia, Museums of History NSW,
 * Transport for NSW centenary); "75 m" tower (Wikipedia infobox). Clock
 * faces about 4.8 m across (TfNSW, City of Sydney). Opened 4 August 1906;
 * tower in use March 1921 (Fairfax & Roberts builders).
 * OSM: the outline (height=20, 5 levels, roof hipped LightGray), the tower
 * part (height=85 min_height=20, which reads the AHD figure as a height),
 * the colonnade roof, the viaduct roof. Plan dimensions are OSM's.
 *
 * Heights (estimated from photos, scaled by the 4.8 m clock face):
 * - concourse 8.5 above Eddy Avenue (the street arcade's height in h6, h8);
 * - the colonnade: piers 8.5-15.9, entablature to 17.5, parapet 18.3 (h6);
 * - the west section and wings: cornice 28.5, balustrade 30 (h3: 21.4 m
 *   over the concourse, OSM 20 m); the central block and pavilions: one
 *   storey more, cornice 34.5, balustrade 36, pavilion attics 37.5 (h6,
 *   h9: 16.7 m above the colonnade's top);
 * - the tower: 41.5 m above the west balustrade (h9 from afar, 41.7 m;
 *   h6 reads 35 m, h3 from close below more), tip 71.5 above the street,
 *   i.e. 85.6 m AHD with the street at the tower about 14 m AHD; the
 *   stages from h4 and h6 by clock-face units: belfry 49.7-53.8, cornice
 *   53.8-55.1, clock stage to 63.1 with clock centres at 59.5, the curved
 *   transition to the lantern 63.1-64.7, lantern columns to 67.7, dome to
 *   70.9, finial to 71.5. The tower is 9.2 m square (OSM part, and 1.9
 *   clock faces in h1).
 * Estimated: bay spacing (4.66 m on the colonnade, 20 bays), window sizes,
 *   the pavilions' extents (h6 projected onto the plan), the street
 *   arcade's arches (every second bay), the wings' window rhythm.
 * Left out: carving, the coat of arms groups (kept as plain blocks on the
 *   two pediments), balusters (solid parapets in the low model), the
 *   modern canopies on the carriage drive, the flagpole.
 *
 * Colours (sampled from h3, h6, h9, by eye): sunlit sandstone #cfb298 -
 * #ebbd8c, the honey-gold of Sydney yellowblock -> 0xd6b48e; the weathered
 * rock-faced arcades darker (#a08269 in h3) -> 0xb69676; the dome dark
 * bronze-brown (#725341, h3) -> 0x7f6352; roofs light grey (OSM, h9) ->
 * roof; clock faces white -> neon-clock-face 0xf4efe4.
 *
 * Night: the tower and the Eddy Avenue front are floodlit warm (h8, h14),
 * the four clock faces glow (h1, h4: lit white with a warm centre), the
 * lantern glows inside, and the office windows are `window`.
 *
 * LODs: the low model has the masses, the colonnade's real piers and
 * openings, the street arcades as real arched recesses, the tower's open
 * belfry and lantern, the clock drums; windows are slate panels grouped by
 * bay over two storeys. The detail model sets every window in a real
 * reveal, adds pilasters, string courses and the parapets' dies.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - h1 "Central Railway clock tower 001a.jpg", Sardaka, CC BY-SA 4.0 (clock stage at dusk)
 * - h3 "Central railway station, Sydney, 2022 (01).jpg", Bahnfrend, CC BY-SA 4.0 (tower over the Pitt St / Eddy Ave corner)
 * - h4 "Central Station clock tower 009.jpg", Sardaka, CC BY-SA 4.0 (clock stage, night)
 * - h5 "Central Station Eddy Avenue 001a.jpg", Sardaka, CC BY-SA 4.0 (colonnade, night)
 * - h6 "Central railway station, Sydney at sunset.jpg", Chris Olszewski, CC BY-SA 4.0 (Eddy Ave front from Belmore Park)
 * - h8 "(1)Central Railway Eddy Avenue 016a.jpg", Sardaka, CC BY 3.0 (Eddy Ave arcade, dusk)
 * - h9 "Central railway station Sydney 2017.jpg", Wpcpey, CC BY-SA 4.0 (from the north-east, above the tracks)
 * - h10 "Central railway station, Sydney, 2018 (01).jpg", Bahnfrend, CC BY-SA 4.0 (Eddy Ave front from the west, concourse level)
 * - h14 "(1)Central Station Sydney-9.jpg", Sardaka, CC BY-SA 4.0 (rounded corner bay, floodlit)
 * - "Aerial view of Central Railway Station, Sydney (NSW) (8123486154).jpg", Photographic Collection from Australia, CC BY 2.0 (plan, c. 1960s)
 * No look-only references.
 *
 * Doubts: the tower's height (published 75 m and 85.6 m AHD disagree with
 * each other and photos read it lower; 71.5 m used); the south ends of the
 * wings and the courtyard faces (no photo; drawn like the outer faces);
 * the street level of Pitt Street (rises southwards; the viaduct is drawn
 * at the full 8.5 m and the terrain hides what is buried).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import { arch, box, face, lathe, loftRings, prism, saveLods, skin, type Layer, type XY } from './sydney-tower-eye'

type Set = { stone: Part; rustic: Part; roof: Part; win: Part; bronze: Part; clock: Part }
const mk = (): Set => ({ stone: new Part(), rustic: new Part(), roof: new Part(), win: new Part(), bronze: new Part(), clock: new Part() })
const low = mk(), det = mk()

const C = 8.0 // concourse / carriage drive above Eddy Avenue
const D = 0.4 // facade skin depth in the detail model

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const circ = (sc: number, zc: number, r: number, n = 10): XY[] => Array.from({ length: n }, (_, i) => [sc + r * Math.cos((i / n) * Math.PI * 2), zc + r * Math.sin((i / n) * Math.PI * 2)] as XY)

/** A rounded-corner rectangle (outer line), counter-clockwise; r per corner [sw, se, ne, nw]. */
function rrect(x0: number, y0: number, x1: number, y1: number, r: [number, number, number, number], seg = 4): XY[] {
  const out: XY[] = []
  const corners: [number, number, number, number, number][] = [
    [x0, y0, r[0], 1, 1], [x1, y0, r[1], -1, 1], [x1, y1, r[2], -1, -1], [x0, y1, r[3], 1, -1],
  ]
  const start = [Math.PI, 1.5 * Math.PI, 0, 0.5 * Math.PI]
  corners.forEach(([x, y, rr, sx, sy], k) => {
    if (rr <= 0) { out.push([x, y]); return }
    const cx = x + sx * rr, cy = y + sy * rr
    for (let i = 0; i <= seg; i++) {
      const t = start[k] + (i / seg) * (Math.PI / 2)
      out.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)])
    }
  })
  return out
}

/** A flat top over a polygon (holes allowed). */
function lid(p: Part, poly: XY[], z: number, holes: XY[][] = []) {
  for (const [a, b, c] of polyTris(poly, holes)) face(p, [[a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z]], [0, 0, 1])
}

/** A hipped roof over an axis-aligned rectangle, ridge along the longer side. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number) {
  const w = x1 - x0, d = y1 - y0
  const base: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  let top: V3[]
  if (w >= d) {
    const h = d / 2, yc = (y0 + y1) / 2
    top = [[x0 + h, yc, z + rise], [x1 - h, yc, z + rise], [x1 - h, yc, z + rise], [x0 + h, yc, z + rise]]
  } else {
    const h = w / 2, xc = (x0 + x1) / 2
    top = [[xc, y0 + h, z + rise], [xc, y0 + h, z + rise], [xc, y1 - h, z + rise], [xc, y1 - h, z + rise]]
  }
  loftRings(p, [base, top])
}

type WinSpec = { s: number; w: number; z0: number; z1: number; arched?: boolean }
/**
 * A facade on the outer line a→b (outside on the right). Low: flat window
 * panels 3 cm proud of the mass. Detail: a skin D proud of the mass with a
 * real reveal per window; `ext` extends the skin past a convex corner.
 */
function facade(s: Set, d: boolean, a: XY, b: XY, z0: number, z1: number, wins: WinSpec[], ext: [number, number] = [D, D], part?: Part) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const holes = wins.map((w) => (w.arched ? arch(w.s - w.w / 2, w.s + w.w / 2, w.z0, w.z1 - w.w / 2, false, d ? 8 : 4) : rect(w.s - w.w / 2, w.s + w.w / 2, w.z0, w.z1)))
  if (d) {
    const a2: XY = [a[0] - u[0] * ext[0], a[1] - u[1] * ext[0]]
    const b2: XY = [b[0] + u[0] * ext[1], b[1] + u[1] * ext[1]]
    skin(part ?? s.stone, s.win, a2, b2, z0, z1, D, holes.map((h) => h.map(([q, z]) => [q + ext[0], z] as XY)), { ends: true, top: true })
  } else {
    const W = (q: number, z: number): V3 => [a[0] + u[0] * q + n[0] * 0.03, a[1] + u[1] * q + n[1] * 0.03, z]
    for (const h of holes) face(s.win, h.map(([q, z]) => W(q, z)), [n[0], n[1], 0])
  }
}

/** Bays of windows: n bays evenly across [s0, s1], each a set of storeys. */
function bays(s0: number, s1: number, n: number, rows: [number, number, number, boolean?][], skip: number[] = []): WinSpec[] {
  const out: WinSpec[] = []
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue
    const c = s0 + ((s1 - s0) * (i + 0.5)) / n
    for (const [w, z0, z1, ar] of rows) out.push({ s: c, w, z0, z1, arched: ar })
  }
  return out
}

/** Rows of windows: low model groups the first and second floors per bay. */
const rowsW = (d: boolean): [number, number, number, boolean?][] => d
  ? [[1.7, C + 1.2, C + 5.6, true], [1.5, 16.9, 19.5], [1.5, 21.3, 23.9]]
  : [[1.7, C + 1.2, C + 5.6, true], [1.6, 16.9, 19.5], [1.6, 21.3, 23.9]]
const rowsC = (d: boolean): [number, number, number, boolean?][] => d
  ? [[1.6, 21.9, 25.5], [1.6, 26.7, 29.5]]
  : [[1.7, 21.9, 25.5], [1.7, 26.7, 29.5]]

/** A parapet (balustrade) along a polyline at z, with dies in the detail model. */
function parapet(s: Set, d: boolean, pts: XY[], z: number, h: number, t = 0.45, part?: Part) {
  const p = part ?? s.stone
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), rot = Math.atan2(b[1] - a[1], b[0] - a[0])
    const c: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (!d) { box(p, c, L / 2 + t / 2, t / 2, z, z + h, rot); continue }
    // a balustrade: plinth, open balusters as a pierced band, rail; dies every ~3.5 m
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const a0: XY = [a[0] + nn[0] * (t / 2), a[1] + nn[1] * (t / 2)], b0: XY = [b[0] + nn[0] * (t / 2), b[1] + nn[1] * (t / 2)]
    const k = Math.max(1, Math.round(L / 3.5)), sp = L / k
    const holes: XY[][] = []
    for (let j = 0; j < k; j++) holes.push(rect(j * sp + 0.4, (j + 1) * sp - 0.4, z + 0.3, z + h - 0.25))
    skin(p, null, [a0[0] - nn[0] * t, a0[1] - nn[1] * t], [b0[0] - nn[0] * t, b0[1] - nn[1] * t], z, z + h, t, holes.map((hh) => hh), { through: false, top: true, ends: true })
    // balusters inside each opening (a few round shafts)
    for (let j = 0; j < k; j++) for (let q = 0; q < 4; q++) {
      const ss = j * sp + 0.4 + ((sp - 0.8) * (q + 0.5)) / 4
      lathe(p, [a[0] + u[0] * ss, a[1] + u[1] * ss], [[0.09, z + 0.3], [0.13, z + 0.55], [0.07, z + h - 0.35], [0.1, z + h - 0.25]], 5)
    }
  }
}

/** Floodlight: walls lit warm, the tower brightest, upward faces barely. */
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] > 40 ? 0.95 : 0.7)

// ---- Plan (OSM, in the turned frame) --------------------------------------------------------------------

const NY0 = -1.8, NY1 = 16.6 // the Eddy Avenue range
const WX0 = -88.8, WX1 = -75.0, WY0 = -66.2 // the Pitt Street wing
const EX0 = 31.7, EX1 = 45.8, EY0 = -50.0 // the eastern wing
const NWX = -83.5 // the range's west end (rounded corner)
const P1 = -43.5, P2 = -32.2, P3 = 11.8, P4 = 24.7 // pavilions: west P1..P2, east P3..P4; central block between
const LX0 = -66.4, LX1 = 26.8, LY = 34.0 // colonnade
const T: XY = [-84.7, -5.5], TH = 4.6 // tower centre, half width

const HW = 25.8, HC = 31.5 // cornices: west section & wings, central block

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const seg = d ? 8 : 5

  // ---- Masses: rock-faced base to the concourse, ashlar above ----
  const wing = rrect(WX0, WY0, WX1, NY0, [5, 0, 0, 0])
  const westN = rrect(NWX, NY0, P1, NY1, [0, 0, 0, 4])
  const pavW = rrect(P1, NY0, P2, NY1, [0, 0, 0, 0])
  const centre = rrect(P2, NY0, P3, NY1, [0, 0, 0, 0])
  const pavE = rrect(P3, NY0, P4, NY1, [0, 0, 0, 0])
  const eastN = rrect(P4, NY0, EX1, NY1, [0, 0, 4, 0])
  const eWing = rrect(EX0, EY0, EX1, NY0, [0, 4, 0, 0])
  const lows = [wing, westN, eastN, eWing]
  for (const poly of [...lows, pavW, centre, pavE]) prism(s.rustic, poly, 0, C, { top: false })
  for (const poly of lows) prism(s.stone, poly, C, HW, { top: false })
  for (const poly of [pavW, pavE]) prism(s.stone, poly, C, HC + 3.0, { top: true })
  prism(s.stone, centre, C, HC, { top: false })

  // cornices (projecting bands) and roofs behind the balustrades
  const band = (poly: XY[], z0: number, z1: number, o: number) => {
    // a projecting band: the polygon pushed out by o (axis-aligned plans, so a miter offset)
    const n = poly.length
    const out = poly.map((p, i) => {
      const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
      const e1: XY = [p[0] - a[0], p[1] - a[1]], e2: XY = [b[0] - p[0], b[1] - p[1]]
      const l1 = Math.hypot(...e1) || 1, l2 = Math.hypot(...e2) || 1
      const n1: XY = [e1[1] / l1, -e1[0] / l1], n2: XY = [e2[1] / l2, -e2[0] / l2]
      const m: XY = [n1[0] + n2[0], n1[1] + n2[1]], ml = 1 + n1[0] * n2[0] + n1[1] * n2[1]
      return [p[0] + (m[0] * o) / ml, p[1] + (m[1] * o) / ml] as XY
    })
    prism(s.stone, out, z0, z1, { top: true, bottom: true })
  }
  for (const poly of lows) band(poly, HW - 0.9, HW, 0.6)
  band(centre, HC - 1.0, HC, 0.6)
  for (const poly of [pavW, pavE]) { band(poly, HC - 1.0, HC, 0.7); band(poly, HC + 2.6, HC + 3.0, 0.4) }
  // string courses at the concourse floor and (detail) over the ground storey
  for (const poly of [...lows, pavW, centre, pavE]) band(poly, C - 0.5, C, 0.35)
  if (d) for (const poly of [...lows, pavW, centre, pavE]) band(poly, 16.8, 17.2, 0.25)

  // roofs: low hips behind the balustrades (OSM roof:shape=hipped, LightGray)
  hip(s.roof, WX0 + 1, WY0 + 1, WX1 - 1, NY0 + 1, HW, 3.0)
  hip(s.roof, NWX + 1, NY0 + 1, P1, NY1 - 1, HW, 3.0)
  hip(s.roof, P4, NY0 + 1, EX1 - 1, NY1 - 1, HW, 3.0)
  hip(s.roof, EX0 + 1, EY0 + 1, EX1 - 1, NY0 + 1, HW, 3.0)
  hip(s.roof, P2, NY0 + 1, P3, NY1 - 1, HC, 3.4)
  for (const poly of lows) lid(s.roof, poly, HW - 0.01)
  lid(s.roof, centre, HC - 0.01)

  // balustrades along the outer edges
  const pz = HW, ph = 1.5
  parapet(s, d, [[WX0 + 0.2, WY0 + 5], [WX0 + 0.2, NY0 - 0.2]], pz, ph)
  parapet(s, d, [[WX0 + 5, WY0 + 0.2], [WX1 - 0.2, WY0 + 0.2], [WX1 - 0.2, NY0 - 0.2]], pz, ph)
  parapet(s, d, [[NWX + 0.2, NY0 + 0.2], [NWX + 0.2, NY1 - 4], [NWX + 4, NY1 - 0.2], [P1, NY1 - 0.2]], pz, ph)
  parapet(s, d, [[P2, NY1 - 0.2], [P3, NY1 - 0.2]], HC, ph)
  parapet(s, d, [[P2, NY0 + 0.2], [P3, NY0 + 0.2]], HC, ph)
  parapet(s, d, [[WX1, NY0 + 0.2], [P1, NY0 + 0.2]], pz, ph)
  parapet(s, d, [[P4, NY1 - 0.2], [EX1 - 4, NY1 - 0.2], [EX1 - 0.2, NY1 - 4], [EX1 - 0.2, NY0]], pz, ph)
  parapet(s, d, [[P4, NY0 + 0.2], [EX0, NY0 + 0.2]], pz, ph)
  parapet(s, d, [[EX0 + 0.2, NY0], [EX0 + 0.2, EY0 + 0.2], [EX1 - 4, EY0 + 0.2]], pz, ph)
  parapet(s, d, [[EX1 - 0.2, EY0 + 4], [EX1 - 0.2, NY0]], pz, ph)
  // the pavilions' raised attic panels (h6, h9): a stepped block on each front
  for (const xc of [(P1 + P2) / 2, (P3 + P4) / 2]) {
    box(s.stone, [xc, NY1 - 1.2], 3.2, 1.2, HC + 3.0, HC + 4.1)
    box(s.stone, [xc, NY1 - 1.2], 1.6, 1.0, HC + 4.1, HC + 4.8)
  }

  // ---- Facades and windows ----
  const north = (x1: number, x0: number, z0: number, z1: number, wins: WinSpec[]) => facade(s, d, [x1, NY1], [x0, NY1], z0, z1, wins, [0, 0])
  const south = (x0: number, x1: number, z0: number, z1: number, wins: WinSpec[]) => facade(s, d, [x0, NY0], [x1, NY0], z0, z1, wins, [0, 0])
  const upW = rowsW(d).slice(1)
  // Eddy Avenue front. West section: full height west of the colonnade, above its roof east of it.
  north(LX0, NWX + 4, C, HW - 0.9, bays(0, LX0 - NWX - 4, 3, rowsW(d)))
  north(P1, LX0, 17.2, HW - 0.9, bays(0, P1 - LX0, 5, upW))
  // central block: oculi over the colonnade roof, two rows of tall windows (h9)
  const nC = 9
  const cw = bays(0, P3 - P2, nC, rowsC(d))
  for (let i = 0; i < nC; i++) cw.push({ s: ((P3 - P2) * (i + 0.5)) / nC, w: 1.3, z0: 17.85, z1: 19.15 })
  north(P3, P2, 17.2, HC - 1.0, cw)
  // pavilions: windows in threes, three rows
  const pav = (w: number) => bays(w / 2 - 2.7, w / 2 + 2.7, 3, [[1.1, 17.9, 19.8], ...rowsC(d)])
  north(P2, P1, 17.2, HC + 2.6, pav(P2 - P1))
  north(P4, P3, 17.2, HC + 2.6, pav(P4 - P3))
  // east section: above the colonnade roof, then full height past its end
  north(LX1, P4, 17.2, HW - 0.9, bays(0, LX1 - P4, 1, upW))
  north(EX1 - 4, LX1, C, HW - 0.9, bays(0, EX1 - 4 - LX1, 3, rowsW(d)))
  // the ground storey behind the colonnade: arched openings, lit at night (h6)
  const behind: WinSpec[] = []
  for (let i = 0; i < 20; i++) behind.push({ s: (LX1 - LX0) * (i + 0.5) / 20, w: 3.4, z0: C + 0.2, z1: C + 5.5, arched: true })
  north(LX1, LX0, C, 17.2, behind)
  // the court (concourse) face of the range, above the Grand Concourse vault
  south(WX1, P1, C + 8, HW - 0.9, bays(0, P1 - WX1, 7, upW))
  south(P1, P2, C + 8, HC + 2.6, pav(P2 - P1))
  south(P2, P3, C + 8, HC - 1.0, bays(0, P3 - P2, nC, rowsC(d)))
  south(P3, P4, C + 8, HC + 2.6, pav(P4 - P3))
  south(P4, EX0, C + 8, HW - 0.9, bays(0, EX0 - P4, 1, upW))
  // Pitt Street wing, outer (west) face, south of the tower; inner (court) face; south end
  facade(s, d, [WX0, NY0 - 9.5], [WX0, WY0 + 5], C, HW - 0.9, bays(0, NY0 - 9.5 - WY0 - 5, 11, rowsW(d)), [0, 0])
  facade(s, d, [WX1, WY0], [WX1, NY0], C + 6, HW - 0.9, bays(0, NY0 - WY0, 13, upW), [0, 0])
  facade(s, d, [WX0 + 5, WY0], [WX1, WY0], C, HW - 0.9, bays(0, WX1 - WX0 - 5, 2, rowsW(d)), [0, 0])
  // the west end of the Eddy Avenue range (over the viaduct, beside the tower)
  facade(s, d, [NWX, NY1 - 4], [NWX, NY0 + 0.6], C, HW - 0.9, bays(0, NY1 - 4 - NY0 - 0.6, 2, rowsW(d)), [0, 0])
  // eastern wing: outer (east) face, court face, south end; the range's east end
  facade(s, d, [EX1, EY0 + 4], [EX1, NY0], C, HW - 0.9, bays(0, NY0 - EY0 - 4, 10, rowsW(d)), [0, 0])
  facade(s, d, [EX0, NY0], [EX0, EY0], C + 6, HW - 0.9, bays(0, NY0 - EY0, 10, upW), [0, 0])
  facade(s, d, [EX0, EY0], [EX1 - 4, EY0], C, HW - 0.9, bays(0, EX1 - 4 - EX0, 2, rowsW(d)), [0, 0])
  facade(s, d, [EX1, NY0], [EX1, NY1 - 4], C, HW - 0.9, bays(0, NY1 - 4 - NY0, 3, rowsW(d)), [0, 0])

  // ---- The Eddy Avenue colonnade (porte-cochère) on its street arcade ----
  const nb = 20, bw = (LX1 - LX0) / nb
  const PT = C + 5.6, ET = PT + 1.3 // pier tops, entablature top (h9: the colonnade is 6.9 m to its cornice)
  // the street arcade (h6, h8, h9): a rock-faced wall with thirteen arched openings
  prism(s.rustic, [[LX0, NY1], [LX1, NY1], [LX1, LY - 1.2], [LX0, LY - 1.2]], 0, C, { top: false })
  const na = 13, aw = (LX1 - LX0) / na
  const arcadeHoles: XY[][] = []
  for (let i = 0; i < na; i++) { const c = aw * (i + 0.5); arcadeHoles.push(arch(c - 2.4, c + 2.4, 0, 3.9, false, seg)) }
  skin(s.rustic, s.win, [LX1, LY - 1.2], [LX0, LY - 1.2], 0, C - 0.6, 1.2, arcadeHoles, { top: false })
  face(s.rustic, [[LX1, LY - 1.2, 0], [LX1, NY1, 0], [LX1, NY1, C], [LX1, LY - 1.2, C]], [1, 0, 0])
  box(s.rustic, [(LX0 + LX1) / 2, LY - 0.4], (LX1 - LX0) / 2 + 0.2, 0.6, C - 0.6, C) // the drive's kerb course
  // the carriage drive's floor slab
  lid(s.roof, [[LX0, NY1], [LX1, NY1], [LX1, LY - 1.4], [LX0, LY - 1.4]], C)
  // the colonnade: rock-faced piers with paired pilasters; wide pier groups under the two pediments
  const pedBays = [3, 17]
  for (let i = 0; i <= nb; i++) {
    const x = LX1 - bw * i
    const hw = pedBays.includes(i) ? 1.3 : 0.65
    box(s.rustic, [x, LY - 0.8], hw, 0.8, C, PT)
    if (d) for (const sg of [-1, 1]) box(s.stone, [x + sg * (hw - 0.28), LY + 0.08], 0.22, 0.12, C + 0.6, PT - 0.2)
    box(s.rustic, [x, LY - 0.8], hw + 0.15, 0.95, C, C + 0.6)
    if (i % 2 === 0) box(s.rustic, [x, NY1 + 0.6], 0.5, 0.6, C, PT) // back piers at the drive's inner edge
  }
  // balustrade between the piers (h5)
  if (d) for (let i = 0; i < nb; i++) {
    const x0 = LX1 - bw * i - 0.7, x1 = LX1 - bw * (i + 1) + 0.7
    parapet(s, d, [[x0, LY - 0.5], [x1, LY - 0.5]], C, 1.1, 0.35, s.rustic)
  }
  else parapet(s, d, [[LX1, LY - 0.5], [LX0, LY - 0.5]], C, 1.1, 0.35, s.rustic)
  // entablature, parapet and the lean-to roof up to the building (h9)
  box(s.stone, [(LX0 + LX1) / 2, LY - 0.9], (LX1 - LX0) / 2 + 0.9, 1.15, PT, ET)
  box(s.stone, [(LX0 + LX1) / 2, LY - 0.25], (LX1 - LX0) / 2 + 0.9, 0.3, ET, ET + 0.6)
  const RY = LY - 1.9
  face(s.roof, [[LX0, RY, ET], [LX1, RY, ET], [LX1, NY1, 17.2], [LX0, NY1, 17.2]], [0, 17.2 - ET, RY - NY1])
  face(s.stone, [[LX0, RY, ET - 0.6], [LX0, NY1, ET - 0.6], [LX0, NY1, 17.2], [LX0, RY, ET]], [-1, 0, 0])
  face(s.stone, [[LX1, RY, ET - 0.6], [LX1, RY, ET], [LX1, NY1, 17.2], [LX1, NY1, ET - 0.6]], [1, 0, 0])
  // the colonnade's soffit (seen between the piers)
  for (const [a, b, c] of polyTris([[LX0, NY1], [LX1, NY1], [LX1, RY], [LX0, RY]])) face(s.stone, [[a[0], a[1], ET - 0.6], [b[0], b[1], ET - 0.6], [c[0], c[1], ET - 0.6]], [0, 0, -1])
  // the two segmental pediments with the arms groups (h5, h6)
  for (const i of pedBays) {
    const x = LX1 - bw * i
    const prof: XY[] = []
    for (let k = 0; k <= seg; k++) {
      const t = (k / seg) * Math.PI
      prof.push([x + 3.0 * Math.cos(t), ET + 0.6 + 1.4 * Math.sin(t)])
    }
    const ped: XY[] = [[x - 3.0, ET], [x + 3.0, ET], ...prof]
    const y0 = LY - 1.0, y1 = LY + 0.1
    const W2 = (q: XY, y: number): V3 => [q[0], y, q[1]]
    for (const [a, b, c] of polyTris(ped)) {
      face(s.stone, [W2(a, y1), W2(b, y1), W2(c, y1)], [0, 1, 0])
      face(s.stone, [W2(a, y0), W2(b, y0), W2(c, y0)], [0, -1, 0])
    }
    for (let k = 0; k < ped.length; k++) {
      const a = ped[k], b = ped[(k + 1) % ped.length]
      face(s.stone, [W2(a, y0), W2(b, y0), W2(b, y1), W2(a, y1)], [b[1] - a[1], 0, -(b[0] - a[0])])
    }
    // the sculpture group on it (lion, emu and shield): a bold rounded mass
    lathe(s.stone, [x, LY - 0.45], [[1.5, ET + 1.4], [1.3, ET + 2.4], [0.7, ET + 3.2], [0.01, ET + 3.4]], seg)
  }

  // ---- The carriage-drive viaduct wrapping the tower corner (Pitt Street) ----
  const via: XY[] = [[-88.0, -20.8], [-88.0, -33.2], [-89.7, -59.8], [-96.4, -59.8], [-96.4, -17.8], [-95.9, 15.5], [-94.3, 18.7], [-92.7, 21.1],
    [-90.4, 23.4], [-86.3, 25.6], [-83.9, 26.2], [-81.5, 26.6], [-70.3, 26.6], [-66.4, 25.0], [-66.4, 16.5], [-78.8, 16.7], [-81.2, 17.1],
    [-83.1, 15.8], [-83.7, 13.9], [-83.4, 13.0], [-83.5, -1.1], [-89.4, -1.2], [-89.3, -10.0], [-87.9, -13.0], [-87.9, -17.2]]
  prism(s.rustic, via, 0, C - 0.01, { top: false })
  lid(s.roof, via, C - 0.01)
  // its outer faces: arched recesses (h3) on Pitt Street, round the corner and on Eddy Avenue
  const viaFace = (a: XY, b: XY, n: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const holes: XY[][] = []
    for (let i = 0; i < n; i++) { const c = (L * (i + 0.5)) / n; holes.push(arch(c - 2.2, c + 2.2, 0, 4.4, false, seg)) }
    skin(s.rustic, s.win, a, b, 0, C - 0.6, 0.9, holes, { top: true, ends: true })
  }
  // (the viaduct's ring runs clockwise, so each face is given end to start: outside on the right)
  viaFace([-96.4, -17.8], [-96.4, -59.8], 6)
  viaFace([-95.9, 15.5], [-96.4, -17.8], 5)
  viaFace([-83.9, 26.2], [-92.7, 21.1], 1)
  viaFace([-70.3, 26.6], [-81.5, 26.6], 2)
  parapet(s, d, [[-96.2, -59.6], [-96.2, -17.8], [-95.7, 15.5], [-94.1, 18.6], [-92.5, 21.0], [-90.2, 23.2], [-86.1, 25.4], [-83.8, 26.0], [-81.5, 26.4], [-70.3, 26.4], [-66.6, 24.9]], C, 1.1, 0.4, s.rustic)

  // ---- The clock tower ----
  const TB = 48.1 // top of the plain shaft
  // shaft, rock-faced to the concourse, ashlar above; strong horizontal courses in the detail model
  box(s.rustic, T, TH + 0.15, TH + 0.15, 0, C)
  box(s.stone, T, TH, TH, C, TB)
  const courses = d ? [HW + 1.5, 33, 36.5, 40, 43.0, 46.5] : [HW + 1.5, 43.0]
  for (const z of courses) box(s.stone, T, TH + 0.12, TH + 0.12, z, z + 0.35)
  box(s.stone, T, TH + 0.3, TH + 0.3, TB, TB + 0.6) // sill course under the belfry
  // small windows and the balconies on each face (h3)
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2, cs = Math.round(Math.cos(ang)), sn = Math.round(Math.sin(ang))
    const at = (s0: number, r: number): XY => [T[0] + cs * r - sn * s0, T[1] + sn * r + cs * s0]
    const nrm: V3 = [cs, sn, 0]
    for (const sOff of [-1.6, 1.6]) {
      const c = at(sOff, TH + 0.02)
      if (d || sOff > 0) face(s.win, [[c[0] - sn * 0.35, c[1] + cs * 0.35, 44.3], [c[0] + sn * 0.35, c[1] - cs * 0.35, 44.3], [c[0] + sn * 0.35, c[1] - cs * 0.35, 45.9], [c[0] - sn * 0.35, c[1] + cs * 0.35, 45.9]].map((v) => v as V3), nrm)
      const bc = at(sOff, TH + 0.45)
      box(s.stone, bc, sn ? 0.45 : 0.9, sn ? 0.9 : 0.45, 43.5, 44.3)
    }
    void at
  }
  // belfry: open arcades of three bays on each face, round a dark core
  const BZ0 = TB + 0.6, BZ1 = 52.8
  box(s.stone, T, TH - 1.2, TH - 1.2, BZ0, BZ1)
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2, cs = Math.round(Math.cos(ang)), sn = Math.round(Math.sin(ang))
    // wall line on this face, outside on the right: from (TH, -TH) to (TH, TH) rotated
    const a: XY = [T[0] + cs * (TH - 0.9) + sn * TH, T[1] + sn * (TH - 0.9) - cs * TH]
    const b: XY = [T[0] + cs * (TH - 0.9) - sn * TH, T[1] + sn * (TH - 0.9) + cs * TH]
    const holes = [0, 1, 2].map((i) => rect(1.35 + i * 2.35 + 0.3, 1.35 + i * 2.35 + 2.05, BZ0 + 0.9, BZ1 - 0.6))
    skin(s.stone, null, a, b, BZ0, BZ1, 0.9, holes, { through: true, top: true, ends: false })
    // the openings' back: the core in window slate, which glows (the belfry is lit, h4)
    const ca: XY = [T[0] + cs * (TH - 1.19) + sn * (TH - 1.2), T[1] + sn * (TH - 1.19) - cs * (TH - 1.2)]
    const cb: XY = [T[0] + cs * (TH - 1.19) - sn * (TH - 1.2), T[1] + sn * (TH - 1.19) + cs * (TH - 1.2)]
    face(s.win, [[ca[0], ca[1], BZ0 + 0.9], [cb[0], cb[1], BZ0 + 0.9], [cb[0], cb[1], BZ1 - 0.6], [ca[0], ca[1], BZ1 - 0.6]], [cs, sn, 0])
    // paired columns in each opening's jambs (detail), a low balustrade (h3)
    const W = (s0: number, r: number): XY => [T[0] + cs * r - sn * (s0 - TH), T[1] + sn * r + cs * (s0 - TH)]
    if (d) for (let i = 0; i < 3; i++) for (const q of [0.35, 1.7]) lathe(s.stone, W(1.35 + i * 2.35 + 0.3 + q, TH - 0.45), [[0.17, BZ0 + 0.9], [0.15, BZ1 - 0.6]], 6)
    box(s.stone, W(TH, TH - 0.5), sn ? 0.25 : TH - 0.9, sn ? TH - 0.9 : 0.25, BZ0, BZ0 + 0.9)
  }
  // the big cornice and frieze under the clock stage
  box(s.stone, T, TH + 0.25, TH + 0.25, BZ1, BZ1 + 0.6)
  box(s.stone, T, TH + 0.75, TH + 0.75, BZ1 + 0.6, 54.1)
  // clock stage with corner piers
  const CZ0 = 54.1, CZ1 = 61.4
  box(s.stone, T, TH - 0.1, TH - 0.1, CZ0, CZ1)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(s.stone, [T[0] + sx * (TH - 0.85), T[1] + sy * (TH - 0.85)], 0.95, 0.95, CZ0, CZ1 + 0.3)
  box(s.stone, T, TH + 0.4, TH + 0.4, CZ1 + 0.3, 62.1)
  // clock drums: a stone ring standing proud with the face in it (h1), hands in bronze
  const ZC = 58.5
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2, cs = Math.round(Math.cos(ang)), sn = Math.round(Math.sin(ang))
    // build a disc in the face plane: local (s, z) on the face, out = (cs, sn)
    const ring = (r: number, off: number, n: number): V3[] => Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2
      return [T[0] + cs * off - sn * r * Math.cos(t), T[1] + sn * off + cs * r * Math.cos(t), ZC + r * Math.sin(t)] as V3
    })
    const n = d ? 24 : 12
    const back = ring(2.75, TH - 0.1, n), front = ring(2.75, TH + 0.45, n), inner = ring(2.4, TH + 0.45, n), dial = ring(2.4, TH + 0.35, n)
    // outer cylinder wall of the drum
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const mid: V3 = [(back[i][0] + back[j][0]) / 2 - T[0] - cs * (TH - 0.1), (back[i][1] + back[j][1]) / 2 - T[1] - sn * (TH - 0.1), (back[i][2] + back[j][2]) / 2 - ZC]
      face(s.stone, [back[i], back[j], front[j], front[i]], mid)
      face(s.stone, [front[i], front[j], inner[j], inner[i]], [cs, sn, 0])
      const im: V3 = [-mid[0], -mid[1], -mid[2]]
      face(s.stone, [inner[i], inner[j], dial[j], dial[i]], im)
    }
    face(s.clock, dial, [cs, sn, 0])
    // hands: hour and minute, ten past ten
    const hand = (len: number, wdt: number, deg: number) => {
      const t = (deg * Math.PI) / 180
      const dx = Math.sin(t), dz = Math.cos(t)
      const P = (q: number, w: number): V3 => {
        const ss = q * dx + w * dz, zz = q * dz - w * dx
        return [T[0] + cs * (TH + 0.4) - sn * ss, T[1] + sn * (TH + 0.4) + cs * ss, ZC + zz]
      }
      face(s.bronze, [P(-0.3, -wdt), P(len, -wdt * 0.5), P(len, wdt * 0.5), P(-0.3, wdt)], [cs, sn, 0])
    }
    hand(1.45, 0.16, -60)
    hand(2.1, 0.11, 60)
  }
  // corner urns on pedestals (h1, h3)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c: XY = [T[0] + sx * (TH - 0.6), T[1] + sy * (TH - 0.6)]
    box(s.stone, c, 0.6, 0.6, 62.1, 63.0)
    lathe(s.stone, c, d ? [[0.3, 63.0], [0.5, 63.5], [0.42, 64.0], [0.18, 64.3], [0.22, 64.6], [0.01, 65.0]] : [[0.5, 63.0], [0.45, 64.0], [0.01, 65.0]], d ? 8 : 5)
  }
  // the curved (ogee) shoulders from the clock stage up to the lantern's drum
  const NR = d ? 24 : 16
  const sq = (h: number, z: number): V3[] => Array.from({ length: NR }, (_, i) => {
    const t = (i / NR) * Math.PI * 2 + Math.PI / NR
    const c = Math.cos(t), sn = Math.sin(t), m = Math.max(Math.abs(c), Math.abs(sn))
    return [T[0] + (h * c) / m, T[1] + (h * sn) / m, z] as V3
  })
  const ci = (r: number, z: number): V3[] => Array.from({ length: NR }, (_, i) => {
    const t = (i / NR) * Math.PI * 2 + Math.PI / NR
    return [T[0] + r * Math.cos(t), T[1] + r * Math.sin(t), z] as V3
  })
  const mixR = (a: V3[], b: V3[], t: number, z: number): V3[] => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t, z] as V3)
  const s0 = sq(3.9, 62.1), c0 = ci(3.15, 63.75)
  loftRings(s.stone, [s0, mixR(s0, c0, 0.55, 62.55), mixR(s0, c0, 0.85, 63.1), c0])
  // the lantern: a base ring, eight columns, an open colonnade round a lit core, the entablature
  lathe(s.stone, T, [[3.35, 63.75], [3.35, 64.25], [3.0, 64.25]], NR, { crease: 30 })
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2 + Math.PI / 8
    lathe(s.stone, [T[0] + 2.85 * Math.cos(t), T[1] + 2.85 * Math.sin(t)], [[0.27, 64.25], [0.22, 66.0]], d ? 8 : 5)
  }
  lathe(s.win, T, [[1.9, 64.25], [1.9, 66.0]], d ? 16 : 10)
  lathe(s.stone, T, [[3.1, 66.0], [3.45, 66.4], [3.45, 66.75], [3.15, 66.75]], NR, { crease: 30, bottom: true })
  // the dome, dark bronze (h3), and its finial
  const dome: [number, number][] = []
  const K = d ? 9 : 4
  for (let i = 0; i <= K; i++) {
    const t = (i / K) * (Math.PI / 2)
    dome.push([3.15 * Math.cos(t), 66.75 + 3.15 * Math.sin(t)])
  }
  dome[K] = [0.35, 69.9]
  lathe(s.bronze, T, dome, NR)
  lathe(s.bronze, T, [[0.35, 69.9], [0.3, 70.1], [0.22, 70.3], [0.01, 70.5]], 8)
}

// ---- Materials and output --------------------------------------------------------------------------------

const STONE: MaterialSpec = { ...finish('sydney-sandstone', 0xd6b48e), floodlight: lit }
const RUSTIC: MaterialSpec = { ...finish('rock-faced-sandstone', 0xb69676), floodlight: lit }
const DOME: MaterialSpec = finish('bronze-dome', 0x7f6352)
const CLOCK: MaterialSpec = finish('neon-clock-face', 0xf4efe4)
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.rustic, material: RUSTIC },
  { part: s.roof, material: PALETTE.roof },
  { part: s.win, material: PALETTE.window },
  { part: s.bronze, material: DOME },
  { part: s.clock, material: CLOCK },
]

if (import.meta.main) {
  await saveLods('sydney-central-station-clock-tower', 'Central Station, Sydney', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, Eddy Avenue street level', bearing: 33.1,
  }, 6500)
}
