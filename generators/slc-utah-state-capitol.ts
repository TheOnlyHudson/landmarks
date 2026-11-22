/**
 * Utah State Capitol (1916, Richard K. A. Kletting), Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-utah-state-capitol.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run within
 * 0.2 degrees of east-west). The origin is the area centroid of OSM
 * way/32920861 (-111.88823, 40.77742 rounded to -111.88822, 40.77742). The
 * building is symmetric about x = X0 = 0.2 (OSM's ends at -59.6 and +59.9,
 * end porticos at -62.1 and +62.6); the dome's axis is at (X0, -2.3) (OSM
 * dome part and lidar peak agree). y = 0 is the ground along the south front
 * (lidar), the lowest ground under the footprint: the ground on the east,
 * west and north sides is 1.2 m higher, and the grand stair falls from the
 * portico floor (5.8) to the lawn 15 m south of it.
 *
 * Form: a long light-grey granite block on a rusticated ground storey; a
 * colonnade of Corinthian columns across the whole south front (a deeper
 * loggia of eight under the pediment of the central portico, nine in front
 * of each wing), three storeys of windows between them, an entablature
 * ("STATE OF UTAH" frieze, not lettered) and a balustrade; pedimented
 * porticos of eight engaged columns on the east and west ends; a plainer
 * north side with pilasters and a short north wing; low glass skylight roofs
 * over the wings; a raised attic behind the south pediment. Over the centre
 * the drum: a podium, a peristyle of 24 free columns before a windowed wall,
 * an entablature and balustrade, a windowed attic; then the tall ribbed
 * light grey-green dome with light ribs and a columned lantern with its cap and finial.
 *
 * Revision 2 (after review): the colonnades did not read, being the same
 * pale grey as the wall behind them. The wall of the column storey (behind
 * the south colonnade, the portico loggia, the end porticos' engaged
 * columns and the north pilasters) is now a darker grey (`usc-granite-shade`),
 * as it reads in shadow in every photo, and the columns are bolder (octagonal,
 * radius 0.76-0.8, was hexagonal 0.68-0.72; the hidden base flare dropped).
 * The three windows per bay are grouped as two panels (the lowest storey,
 * and the upper two together) to pay for the columns. The dome is a touch
 * lighter and its sixteen ribs are drawn in the lighter shade grey so they
 * show, as in the south and east photos (dome #8d9a95, was #7f8c88). Massing
 * unchanged.
 *
 * Sources
 * - OSM (ODbL): way/32920861 (outline, "Utah State Capitol Building",
 *   height 87 "to top of dome", Q2627661) and its parts way/1320424742 (main
 *   block, 25 m), way/1434177173 (central block, 35 m), way/299082900 (drum,
 *   50 m), way/1434177172 (dome, 77 m, roof:colour #6C7571),
 *   way/1435006798 (lantern, 78 m), way/1435006799 (lantern cap, 87 m),
 *   way/1434520921/22 (inner wing skylights, gabled 33 m), way/1434520923/24
 *   (outer wing roofs, gabled 31 m), way/1434520925 (north wing),
 *   way/1435006806/08 (west and east end porticos), way/1435006807 (south
 *   portico). The plan is OSM's, made symmetric (differences under 0.5 m).
 * - USGS 3DEP lidar USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013, after
 *   the 2004-08 restoration), 1 m grid. Heights above the south ground:
 *   balustrade top 24.4, roof deck 21.4-21.8, south pediment apex 26.7,
 *   end pediment apexes 26.5, central attic 29.7, inner skylight ridges 28.4
 *   (eaves 23.3), outer roof ridges 26.2, north wing ridge 25.6; drum
 *   entablature 45.2 at r 13-15 with its balustrade 46.7 at r 12-13; drum
 *   attic 51.7 at r 10.5-12; dome surface 59.5 at r 9, 63 at r 7, 65 at r 5,
 *   68 at r 3; lantern 72-74; highest return 75.8 (the cap; the thin finial
 *   is missed). The south stair falls from 6.0 at y -33 to 0.9 at y -48.
 *   Ground: 0 along the south front, 1.2 on the other sides.
 * - USGS NAIP (public domain): the glass skylight roofs over the wings, the
 *   pale roof deck, the plan of the drum.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   Kiranedara, "Front view of State Capitol Building.jpg", CC BY-SA 4.0
 *     (south front, frontal: the colonnade, column and window rhythm, the
 *     storey lines, the drum and dome);
 *   Alede2010, "SouthWest View Utah State Capitol.jpg", CC BY-SA 4.0
 *     (from the south-west: wing depth, the drum and dome profile);
 *   Mangoman88, "Utah State Capitol east end - 20101014.jpg", CC BY-SA 3.0
 *     (east end portico, three doors at the ground storey, the dome's ribs);
 *   Alede2010, "West view of Utah State Capitol.jpg", CC BY-SA 4.0 (west
 *     end portico; the dome's grey-green);
 *   Mangoman88, "Utah State Capitol Complex - 23 November 2012.JPG", CC0
 *     (north-east corner: pilasters, rusticated ground storey).
 * - Published: completed 1916, architect Richard K. A. Kletting; Utah
 *   granite; 52 Corinthian columns; height 285 ft (Wikipedia, "Utah State
 *   Capitol"). The published 285 ft (87 m) is not used: lidar puts the cap
 *   at 72 m above the south grade, so the finial is drawn to 77.5 m.
 * Estimated from the photos (scaled to lidar and OSM): the storey lines
 *   (ground storey to 5.8, column tops 18.6, cornice 21.6), column spacing
 *   (4.4 m on the south front, 4.2 m on the ends), column size, window sizes,
 *   the 24 drum columns, the drum's radii, the dome's 16 ribs, the lantern.
 * Left out: flagpoles, lamp standards, the terrace balustrades round the
 *   south lawn, sculpture in the pediments, capitals' leaves, balusters
 *   (the balustrade is drawn solid), the east and west end stairs.
 * Doubts: the north side is seen only obliquely (p_complex) and in NAIP; its
 *   pilasters and windows follow the east end's rhythm. The wings' roofs are
 *   from NAIP and lidar only. The finial height is estimated.
 * Night: the whole building is floodlit, the drum and dome brightest
 *   (`floodlight`); windows are `window`, the doors share it.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, ccw, capRing, flatShape, extrudeShape, archShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

const X0 = 0.2 // the symmetry axis
const DY = -2.3 // the dome's axis, y
const GS = 5.8 // ground storey top (portico floor)
const COL = 18.6 // column tops
const CORN = 21.6 // cornice top
const DECK = 22.2
const PAR = 24.4 // balustrade top
const YS = -27.6, YN = 21.8, XE = 59.85, XP = 62.35 // south face, north face, end walls, end porticos
const YP = -32.6 // south portico front
const NW = 18.7, YNW = 35.3 // north wing half-width and north face
const PY0 = -18.5, PY1 = 13.5 // end porticos' extent in y (centre -2.5)
const PC = (PY0 + PY1) / 2

/** A planar polygon, wound to face along `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
  const q = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? pts.slice().reverse() : pts
  for (let i = 1; i < q.length - 1; i++) part.tri(q[0], q[i], q[i + 1])
}
/** A closed box. */
function box(part: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, top: Part | null = part, bottom = false) {
  const r = rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
  prism(part, top, r, z0, z1)
  if (bottom) capRing(part, r, z0, false)
}
/**
 * A gable block over a rectangle: walls from z0 to the eaves, then a
 * pitched roof. `alongY` puts the ridge along y (gable ends face south and
 * north); otherwise along x.
 */
function gable(wall: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, z0: number, ze: number, za: number, alongY: boolean) {
  if (ze > z0) box(wall, x0, y0, z0, x1, y1, ze, null)
  if (alongY) {
    const xm = (x0 + x1) / 2
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) poly(wall, [[x0, y, ze], [x1, y, ze], [xm, y, za]], [0, s, 0])
    poly(roof, [[x0, y0, ze], [x0, y1, ze], [xm, y1, za], [xm, y0, za]], [-1, 0, 1])
    poly(roof, [[x1, y0, ze], [x1, y1, ze], [xm, y1, za], [xm, y0, za]], [1, 0, 1])
  } else {
    const ym = (y0 + y1) / 2
    for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) poly(wall, [[x, y0, ze], [x, y1, ze], [x, ym, za]], [s, 0, 0])
    poly(roof, [[x0, y0, ze], [x1, y0, ze], [x1, ym, za], [x0, ym, za]], [0, -1, 1])
    poly(roof, [[x0, y1, ze], [x1, y1, ze], [x1, ym, za], [x0, ym, za]], [0, 1, 1])
  }
}
/** Mirror an east-half outline (x relative to X0, south-east to north, ending on the axis) into a full ring. */
function mirrorRing(east: XY[]): XY[] {
  const e = east.filter(([x]) => Math.abs(x) > 1e-9)
  const full = [...e, ...e.slice().reverse().map(([x, y]) => [-x, y] as XY)]
  return ccw(full.map(([x, y]) => [x + X0, y] as XY))
}

// Faces: s along the wall seen from outside. South s = x, north s = -x, east s = y, west s = -y.
const south = (y: number): Face => ({ o: [0, y, 0], n: [0, -1] })
const north = (y: number): Face => ({ o: [0, y, 0], n: [0, 1] })
const east = (x: number): Face => ({ o: [x, 0, 0], n: [1, 0] })
const west = (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] })

function build() {
  const granite = new Part(), shade = new Part(), trim = new Part(), win = new Part(), dome = new Part(), glass = new Part()
  const W = (f: Face, s: number, w: number, z0: number, z1: number) => flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z1), 0.06)
  /** A bay of the column storey: three windows, and a ground-storey window below. */
  const bay = (f: Face, s: number, g = 0, w = 1.8) => {
    W(f, s, w, 7.0, 9.7); W(f, s, w, 11.0, 16.9)
    W(f, s, w * 0.8, g + 1.4, GS - 1.2)
  }
  /** A door: a dark glazed leaf under a transom, in a pale surround. */
  const door = (f: Face, s: number, z0: number, w = 2.0, h = 3.6) => {
    extrudeShape(trim, f, rect(s - w / 2 - 0.35, z0, s + w / 2 + 0.35, z0 + h + 0.4), 0, 0.12)
    flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z0 + h), 0.15)
  }
  /** A Corinthian column: a slightly tapered shaft and a flared capital. */
  const column = (x: number, y: number, r: number, z0: number, z1: number, segs = 6) => {
    lathe(trim, x, y, [[r, z0], [r * 0.88, z1 - 0.9], [r * 1.3, z1]], segs)
  }
  /** A flat pilaster on a face. */
  const pilaster = (f: Face, s: number, w = 1.2) => extrudeShape(trim, f, rect(s - w / 2, GS, s + w / 2, COL), 0, 0.3)
  /** A pediment's raking cornice: a band under both slopes, on face f centred at s. */
  const rake = (f: Face, s: number, half: number, apex: number) => {
    const k = 0.7 * half / (apex - CORN)
    for (const sg of [-1, 1]) extrudeShape(trim, f, [[s + sg * half, CORN], [s, apex], [s, apex - 0.7], [s + sg * (half - k), CORN]], -0.05, 0.12)
  }
  const mir = (fn: (sx: number) => void) => { fn(1); fn(-1) }
  const X = (s: number) => X0 + s

  // ------------------------------------------------------------ the main block
  // the core outline (no porticos), east half from the south front's centre
  const CORE = mirrorRing([[0, YS], [XE, YS], [XE, YN], [NW, YN], [NW, YNW], [0, YNW]])
  // the column storey: the wings' wall stands 1.3 m behind the colonnade, the portico's 4 m behind its columns
  const MID = mirrorRing([[0, YS - 1.0], [16.9, YS - 1.0], [16.9, YS + 1.3], [XE, YS + 1.3], [XE, YN], [NW, YN], [NW, YNW], [0, YNW]])
  prism(granite, null, CORE, 0, GS)
  const band = mirrorRing([[0, YS - 0.15], [XE + 0.15, YS - 0.15], [XE + 0.15, YN + 0.15], [NW + 0.15, YN + 0.15], [NW + 0.15, YNW + 0.15], [0, YNW + 0.15]])
  prism(trim, trim, band, GS - 0.4, GS) // the ground storey's cornice band
  prism(shade, null, MID, GS, COL) // the wall behind the columns, a shade darker so they read
  // the porticos' ground storeys
  box(granite, X(-16.9), YP, 0, X(16.9), YS, GS, trim)
  mir((sx) => box(granite, X(sx * XE), PY0, 0, X(sx * XP), PY1, GS, trim))
  // the entablature, closed underneath where it overhangs the colonnade
  const ENT = CORE
  prism(granite, null, ENT, COL, CORN - 0.6)
  capRing(granite, CORE, COL, false)
  const cornice = mirrorRing([[0, YS - 0.35], [XE + 0.35, YS - 0.35], [XE + 0.35, YN + 0.35], [NW + 0.35, YN + 0.35], [NW + 0.35, YNW + 0.35], [0, YNW + 0.35]])
  prism(trim, null, cornice, CORN - 0.6, CORN)
  capRing(trim, cornice, CORN - 0.6, false)
  // the balustrade (drawn solid) round the roof deck
  const inner = mirrorRing([[0, YS + 0.7], [XE - 0.7, YS + 0.7], [XE - 0.7, YN - 0.7], [NW - 0.7, YN - 0.7], [NW - 0.7, YNW - 0.7], [0, YNW - 0.7]])
  prism(trim, null, CORE, CORN, PAR)
  prism(trim, null, inner.slice().reverse(), DECK, PAR)
  CORE.forEach((a, i) => { const j = (i + 1) % CORE.length, b = CORE[j], c = inner[j], d = inner[i]; poly(trim, [[a[0], a[1], PAR], [b[0], b[1], PAR], [c[0], c[1], PAR], [d[0], d[1], PAR]], [0, 0, 1]) })
  capRing(granite, inner, DECK)

  // the south portico: entablature over the loggia, its eight columns, the pediment
  box(granite, X(-16.9), YP, COL, X(16.9), YS, CORN - 0.6, null, true)
  box(trim, X(-17.25), YP - 0.35, CORN - 0.6, X(17.25), YS, CORN, null, true)
  gable(granite, trim, X(-17.25), YP - 0.35, X(17.25), -25.5, CORN, CORN, 26.7, true)
  rake(south(YP - 0.4), X0, 17.25, 26.7)
  for (const s of [-15.3, -10.93, -6.56, -2.19, 2.19, 6.56, 10.93, 15.3]) column(X(s), YP + 1.0, 0.8, GS, COL, 8)
  // the end porticos: column storey, entablature, pediment, eight engaged columns
  mir((sx) => {
    const x0 = X(sx * XE), x1 = X(sx * XP)
    box(shade, x0, PY0, GS, x1, PY1, COL, null)
    box(granite, x0, PY0, COL, x1, PY1, CORN - 0.6, null)
    box(trim, x0, PY0 - 0.35, CORN - 0.6, x1 + sx * 0.35, PY1 + 0.35, CORN, null, true)
    const lo = Math.min(X(sx * 57.0), x1 + sx * 0.35), hi = Math.max(X(sx * 57.0), x1 + sx * 0.35)
    gable(granite, trim, lo, PY0 - 0.35, hi, PY1 + 0.35, CORN, CORN, 26.5, false)
    rake(sx > 0 ? east(x1 + sx * 0.4) : west(x1 + sx * 0.4), sx * PC, 16.35, 26.5)
    for (const d of [-14.7, -10.5, -6.3, -2.1, 2.1, 6.3, 10.5, 14.7]) column(X(sx * (XP + 0.35)), PC + d, 0.78, GS, COL, 8)
  })

  // the central attic behind the south pediment
  box(granite, X(-16.2), -19.2, CORN, X(16.2), 13.6, 29.0, null)
  box(trim, X(-16.5), -19.5, 29.0, X(16.5), 13.9, 29.7, granite)

  // the wings' roofs: glass skylights (inner pair) and low glazed roofs (outer pair); the north wing's ridge
  mir((sx) => {
    const a = X(sx * 17.6), b = X(sx * 37.6), c = X(sx * 39.6), d = X(sx * 51.6)
    gable(granite, glass, Math.min(a, b), -19.7, Math.max(a, b), 14.5, DECK, 23.3, 28.4, false)
    gable(granite, glass, Math.min(c, d), -13.8, Math.max(c, d), 8.4, DECK, 23.3, 26.2, false)
  })
  gable(granite, glass, X(-6), 14.5, X(6), YNW - 1.5, DECK, 23.6, 25.6, true)

  // ------------------------------------------------------------ facades
  // the south front: nine columns before each wing, a corner pier, the bays between
  const wingCols = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => 19.8 + 4.4 * k)
  mir((sx) => {
    for (const s of wingCols) column(X(sx * s), YS - 0.75, 0.76, GS, COL, 8)
    box(trim, X(sx * 57.5), YS - 0.25, GS, X(sx * XE), YS + 1.3, COL, null) // the corner pier
    const f = south(YS + 1.3)
    for (const s of [17.6, ...wingCols.slice(0, -1).map((c) => c + 2.2)]) bay(f, X(sx * s))
  })
  // the portico's back wall: seven bays, three doors on the portico floor
  {
    const f = south(YS - 1.0)
    for (const s of [-13.1, -8.75, -4.37, 0, 4.37, 8.75, 13.1]) {
      if (Math.abs(s) < 5) door(f, X(s), GS, 2.0, 3.6)
      else W(f, X(s), 1.8, 7.0, 9.7)
      W(f, X(s), 1.8, 11.0, 16.9)
    }
  }
  // the grand stair from the portico floor to the lawn, between cheek walls
  {
    const n = 10, y0 = YP, y1 = -47.5, w = 10.6
    for (let k = 0; k < n; k++) {
      const ya = y0 + ((y1 - y0) * k) / n, yb = y0 + ((y1 - y0) * (k + 1)) / n, z = GS - ((GS - 0.5) * (k + 0.5)) / n
      box(granite, X(-w), yb, 0, X(w), ya, z, granite)
    }
    mir((sx) => {
      const a = X(sx * w), b = X(sx * (w + 1.4)), lo = Math.min(a, b), hi = Math.max(a, b)
      const top = (y: number) => GS + 0.9 - ((GS - 0.5) * (y0 - y)) / (y0 - y1)
      poly(granite, [[lo, y0, top(y0)], [hi, y0, top(y0)], [hi, y1, top(y1)], [lo, y1, top(y1)]], [0, 0, 1])
      for (const [x, s] of [[lo, -1], [hi, 1]] as [number, number][]) poly(granite, [[x, y0, 0], [x, y1, 0], [x, y1, top(y1)], [x, y0, top(y0)]], [s, 0, 0])
      poly(granite, [[lo, y1, 0], [hi, y1, 0], [hi, y1, top(y1)], [lo, y1, top(y1)]], [0, -1, 0])
    })
  }
  // the ground storey's south windows, beside the stair
  mir((sx) => {
    const g = south(YS)
    for (const s of [17.6, ...wingCols.map((c) => c + 2.2)]) if (s < 57) W(g, X(sx * s), 1.4, 1.4, GS - 1.2)
    W(south(YP), X(sx * 14.0), 1.4, 1.4, GS - 1.2)
  })
  // the east and west ends: seven bays in the portico, three doors at the ground storey, side bays with pilasters
  mir((sx) => {
    const f = sx > 0 ? east(X(XP)) : west(X(-XP)), s = (y: number) => sx * y
    for (const d of [-12.6, -8.4, -4.2, 0, 4.2, 8.4, 12.6]) {
      const y = PC + d
      W(f, s(y), 1.8, 7.0, 9.7); W(f, s(y), 1.8, 11.0, 16.9)
      if (Math.abs(d) < 5) door(f, s(y), 1.2, 2.0, 3.2)
      else W(f, s(y), 1.4, 2.4, GS - 1.2)
    }
    const e = sx > 0 ? east(X(XE)) : west(X(-XE))
    for (const y of [-23.0, 17.6]) bay(e, s(y), 1.2)
    for (const y of [-26.4, -19.7, 14.7, 20.6]) pilaster(e, s(y), 1.1)
  })
  // the north side: pilasters and bays on the wings, the north wing's sides and front
  mir((sx) => {
    const f = north(YN)
    for (let k = 0; k < 10; k++) {
      const x = 20.9 + 4.3 * k
      bay(f, -X(sx * x), 1.2)
      pilaster(f, -X(sx * (x + 2.15)), 1.0)
    }
    const sf = sx > 0 ? east(X(NW)) : west(X(-NW))
    for (const y of [24.5, 28.6, 32.7]) bay(sf, sx * y, 1.2)
    const nf = north(YNW)
    for (const x of [2.2, 6.6, 11.0, 15.4]) bay(nf, -X(sx * x), 1.2)
    for (const x of [4.4, 8.8, 13.2, 17.6]) pilaster(nf, -X(sx * x), 1.0)
  })

  // ------------------------------------------------------------ drum, dome, lantern
  const cx = X0, cy = DY
  // the podium on the central attic, the peristyle's floor
  lathe(granite, cx, cy, [[14.6, 29.0], [14.6, 32.2]], 24)
  lathe(trim, cx, cy, [[14.6, 32.2], [14.9, 32.2], [14.9, 32.7], [12.0, 32.7]], 24)
  // the drum wall behind the columns, with a tall window in each bay
  lathe(granite, cx, cy, [[12.0, 32.7], [12.0, 43.0]], 24)
  const DC = 24
  for (let k = 0; k < DC; k++) {
    const a = ((k + 0.5) / DC) * 2 * Math.PI, rc = 13.8
    const x = cx + Math.cos(a) * rc, y = cy + Math.sin(a) * rc
    lathe(trim, x, y, [[0.5, 32.7], [0.42, 43.0]], 6)
    const aw = (k / DC) * 2 * Math.PI
    flatShape(win, { o: [cx + Math.cos(aw) * 11.98, cy + Math.sin(aw) * 11.98, 0], n: [Math.cos(aw), Math.sin(aw)] }, archShape(0, 1.4, 34.2, 40.4, 6), 0.06)
  }
  // the entablature and balustrade over the peristyle
  lathe(trim, cx, cy, [[12.0, 43.0], [14.8, 43.0], [14.8, 45.3], [13.9, 45.6], [13.9, 46.7], [11.7, 46.7]], 24)
  // the attic, with a small square window in each bay, and its cornice
  lathe(granite, cx, cy, [[11.7, 45.3], [11.7, 51.0]], 24)
  for (let k = 0; k < DC; k++) {
    const aw = (k / DC) * 2 * Math.PI
    flatShape(win, { o: [cx + Math.cos(aw) * 11.68, cy + Math.sin(aw) * 11.68, 0], n: [Math.cos(aw), Math.sin(aw)] }, rect(-0.55, 47.6, 0.55, 49.1), 0.06)
  }
  lathe(trim, cx, cy, [[11.7, 51.0], [12.1, 51.0], [12.1, 51.7], [11.0, 51.7], [11.0, 52.8], [10.6, 52.8]], 24)
  // the dome: a raised (taller than hemispherical) shell, lidar profile
  const RA = 10.6, Z0 = 52.8, H = 15.0, RL = 2.9
  const zAt = (r: number) => Z0 + H * Math.sqrt(Math.max(0, 1 - (r / RA) ** 2))
  const prof: [number, number][] = []
  for (const t of [0, 0.03, 0.08, 0.16, 0.27, 0.4, 0.55, 0.7, 0.85, 1]) { const r = RA - (RA - RL) * t; prof.push([r, zAt(r)]) }
  lathe(dome, cx, cy, prof, 24)
  // sixteen ribs, catching the light (the shade grey)
  const nrm = (r: number, z: number): [number, number] => { const a = r / (RA * RA), b = (z - Z0) / (H * H), l = Math.hypot(a, b); return [a / l, b / l] }
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI, ca = Math.cos(a), sa = Math.sin(a)
    const P = (r: number, z: number, t: number, d: number): V3 => { const [nr, nz] = nrm(r, z); return [cx + ca * (r + nr * d) - sa * t, cy + sa * (r + nr * d) + ca * t, z + nz * d] }
    const pts = [prof[0], prof[3], prof[5], prof[7], prof[9]]
    for (let i = 0; i + 1 < pts.length; i++) {
      const [r0, z0] = pts[i], [r1, z1] = pts[i + 1], [nr, nz] = nrm((r0 + r1) / 2, (z0 + z1) / 2)
      const out: V3 = [ca * nr, sa * nr, nz], side: V3 = [-sa, ca, 0]
      const RW = 0.22, RD = 0.22
      poly(shade, [P(r0, z0, -RW, RD), P(r0, z0, RW, RD), P(r1, z1, RW, RD), P(r1, z1, -RW, RD)], out)
      poly(shade, [P(r0, z0, RW, -0.05), P(r1, z1, RW, -0.05), P(r1, z1, RW, RD), P(r0, z0, RW, RD)], side)
      poly(shade, [P(r0, z0, -RW, -0.05), P(r1, z1, -RW, -0.05), P(r1, z1, -RW, RD), P(r0, z0, -RW, RD)], [sa, -ca, 0])
    }
  }
  // the lantern: a ring, eight columns round a windowed core, a cornice, a cap and the finial
  const zl = zAt(RL)
  lathe(trim, cx, cy, [[RL + 0.2, zl - 0.6], [RL + 0.2, zl + 0.5], [2.2, zl + 0.5]], 16)
  lathe(granite, cx, cy, [[2.2, zl + 0.5], [2.2, 71.6]], 16)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI
    lathe(trim, cx + Math.cos(a) * 2.75, cy + Math.sin(a) * 2.75, [[0.28, zl + 0.5], [0.26, 71.6]], 6)
    const aw = (k / 8) * 2 * Math.PI
    flatShape(win, { o: [cx + Math.cos(aw) * 2.18, cy + Math.sin(aw) * 2.18, 0], n: [Math.cos(aw), Math.sin(aw)] }, archShape(0, 0.9, zl + 1.0, 70.4, 6), 0.06)
  }
  lathe(trim, cx, cy, [[2.2, 71.6], [3.2, 71.6], [3.2, 72.3], [2.6, 72.3]], 16)
  lathe(dome, cx, cy, [[2.6, 72.3], [2.2, 73.6], [1.0, 74.5], [0.4, 74.8], [0.7, 75.9], [0.12, 76.8], [0.01, 77.5]], 10)

  // ------------------------------------------------------------ materials and night
  if (process.env.DBG) console.log({ shade: shade.triangles, granite: granite.triangles, trim: trim.triangles, win: win.triangles, dome: dome.triangles, glass: glass.triangles })
  const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.25 : p[2] > 29 ? 1 : 0.7)
  return finishGlb('Utah State Capitol', [
    { part: granite, material: { ...finish('usc-granite', 0xd5d6d1), floodlight: lit } as MaterialSpec as Swatch },
    { part: shade, material: { ...finish('usc-granite-shade', 0xb3b6b1), floodlight: lit } as MaterialSpec as Swatch },
    { part: trim, material: { ...finish('usc-granite-light', 0xf0f0ec), floodlight: lit } as MaterialSpec as Swatch },
    { part: win, material: PALETTE.window },
    { part: dome, material: { ...finish('usc-dome', 0x8d9a95), floodlight: (p: V3) => (p[2] > 52 ? 0.8 : 0) } as MaterialSpec as Swatch },
    { part: glass, material: { ...PALETTE.glass, color: 0xaab4ba } },
  ], {
    bearing: 0, height: 77.5,
    replaces: ['way/32920861', 'way/1320424742', 'way/1434177173', 'way/299082900', 'way/1434177172', 'way/1435006798', 'way/1435006799', 'way/1434520921', 'way/1434520922', 'way/1434520923', 'way/1434520924', 'way/1434520925', 'way/1435006806', 'way/1435006807', 'way/1435006808'],
  }, 6500)
}

if (import.meta.main) await writeModel('slc-utah-state-capitol', build())
