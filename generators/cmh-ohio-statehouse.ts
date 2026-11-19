/**
 * Ohio Statehouse (1839-61), Columbus, with the Atrium (1993) and the
 * Senate Building (1901, the former Judiciary Annex): procedural, CC0-1.0.
 * bun generators/cmh-ohio-statehouse.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the building's own
 * axes: placed at bearing 351.1 (OSM's long walls run 351.1/171.1). The
 * origin is the centre of the Statehouse rectangle, which is also the
 * cupola's axis (-82.9990949, 39.9613176). z = 0 is the lowest ground under
 * the whole outline, 232.3 m NAVD88, beside the Senate Building's east
 * front on Third Street; the Statehouse's own terrace is 3.9 m higher.
 *
 * Form: a long, low limestone block in the Greek Doric mode. On the long
 * west front (High Street) a recessed colonnade of eight columns in antis
 * between two wings of six pilastered bays; on the north and south fronts a
 * recessed portico of four columns between wings of four bays; the east
 * colonnade is closed by the Atrium. A plain entablature and cornice run
 * round the whole block. Over the centre a low gabled roof, its pediments
 * facing west and east, and on it the cupola: a plain drum ring, a
 * pilastered stage with two tiers of windows in 24 bays, an entablature
 * and projecting cornice, a flat copper cone (the "Chinese hat" instead of
 * a dome), a small white lantern with a glazed cap and a finial. Low hipped
 * copper roofs over the north and south halves. East of it, the glazed
 * Atrium (with a two-column entrance pavilion at each end) joins the Senate
 * Building: a granite-and-limestone Beaux-Arts block with a rusticated
 * base, a portico of four columns in antis under a pediment on Broad
 * Street, and a raised hipped roof over its chamber.
 *
 * Sources
 * - OSM (measured plan, ODbL): outline way/30172881 (the whole complex);
 *   parts way/849502268 (Statehouse, 56.6 x 92.8 m), way/849502269
 *   (Atrium), way/849502270 (Senate Building, 28.6 x 66.8 m),
 *   way/1454786126 (Senate chamber roof), way/1454785003/1454785004 (north
 *   and south hipped roofs), way/1454785005 (central gable),
 *   way/1454785223 (cupola base), way/1125310283 (cupola),
 *   way/1125310284 (lantern).
 * - Lidar (measured): USGS 3DEP USGS_LPC_OH_Columbus_2019 (public domain),
 *   1 m and 0.5 m surface grids, heights above z = 0: terrace 3.9; main
 *   eave 21.2; north and south hip ridges 23.9; central gable ridge 26.1
 *   (falling to the eaves at y = +-12); cupola cornice 43.0 at radius 12.5;
 *   cone to 44.3 at radius 4.9; lantern rim 45.9, glazed cap to 47.3,
 *   finial 49.8; Atrium roof 18.0-18.4; Senate eave 21.4, its chamber roof
 *   24.6-26.0. Ground: High Street side 2.4, Third Street side 0.
 * - Published: 184 x 304 ft (56 x 93 m, which OSM matches); cupola "70 ft
 *   tall, 64 ft wide" (ohiostatehouse.org; the 64 ft must be the interior,
 *   lidar gives 25 m across the cornice); Columbus limestone; a Greek Doric
 *   recessed colonnade; the low conical cupola roof (Wikipedia, "Ohio
 *   Statehouse"; NRHP/NHL).
 * - Photos (Wikimedia Commons): Riis2602 2022 (west front, frontal; bays and
 *   heights scaled from it), General Ization (from High Street, from State
 *   Street), Ɱ 2020 (the cupola close up: 24 bays, two window tiers,
 *   proportions of the stages), Ɱ (west front; north-west three-quarter),
 *   Niagara66 (from the Rhodes Tower to the north: the copper roofs, the
 *   cupola's cone and lantern, the Atrium and the Senate Building), HABS
 *   OH-2220 (south-west), Ɱ 2021 and w_lemay 2019 (Senate Building),
 *   Ɱ (Atrium entrance), Becker1999 (at night). Credits in the catalog.
 * Estimated: the colonnade recesses' depth (5 m west, 4.5 m north and
 *   south), drawn in a shadow tone (`statehouse-shade`, near the window
 *   slate) because in every daylight photo the recess reads dark behind
 *   pale columns; the column spacing, 4.45 m on the west (8 columns,
 *   counted and scaled in Ɱ's west-front photo) and 4.7 m on the north and
 *   south (4 columns); the attic over the cornice, 1.3 m (lidar reads the
 *   edge at 21.2 and the roof 1 m inside it at 22.2); the pediments set 3 m
 *   behind the attic; the cupola's square
 *   plinth (hidden by the gable in every photo); the Senate's south end (a
 *   pediment over the centre, no columns; one photo, partly behind trees),
 *   its window rhythm and storey heights; the Atrium's glazed slots.
 * Left out: the frieze's small attic windows and the cupola's round vents
 *   (dot rows at map scale), column fluting on the Senate portico, capitals
 *   beyond a plain echinus and abacus, balustrades, the McKinley monument,
 *   flagpoles, lamps.
 * Night: the colonnades' columns are floodlit against their dark recesses
 *   (Becker1999), the cupola is washed and its windows glow; the long
 *   walls stay dim and the wings' windows dark (they are `statehouse-shade`,
 *   not `window`); the Senate Building is floodlit warm (Another Believer
 *   2018).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, capRing, lathe, wallEdge, finishGlb, writeModel } from './sea-tacoma-union-station'

// The Statehouse
const X = 28.3, Y = 46.4 // half-width (east-west) and half-length
const F = 4.1 // colonnade floor
const CAP = 16.0, FRIEZE = 19.7, EAVE = 21.2, ATTIC = 22.5 // capitals, frieze top, cornice top, attic top
const WC = 19.35 // west/east colonnade half-opening
const NC = 9.65 // north/south portico half-opening
const RW = 5.0, RN = 4.5 // recess depths
// The Atrium and the Senate Building
const AX0 = 28.3, AX1 = 45.4, AY = 18.8
const SX0 = 45.4, SX1 = 74.0, SY = 33.4

function build() {
  // `shade` is the colonnades' shadowed recesses and the wings' windows: dark by day, unlit at night.
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part(), shade = new Part()
  const door = win
  /** A flat polygon (3 or 4 corners) wound so that its normal leans towards `want`. */
  const face = (part: Part, pts: V3[], want: V3) => {
    const u = pts[1].map((v, i) => v - pts[0][i]), w = pts[2].map((v, i) => v - pts[0][i])
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
    const q = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0 ? pts : [...pts].reverse()
    if (q.length === 3) part.tri(q[0], q[1], q[2]); else part.quad(q[0], q[1], q[2], q[3])
  }
  const W = (f: Face, s0: number, s1: number, z0: number, z1: number, part = win) =>
    flatShape(part, f, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], 0.06)

  /** A Doric column: a tapering shaft, an echinus and a square abacus. */
  const column = (x: number, y: number, z0: number, z1: number, r = 1.0, segs = 16) => {
    lathe(trim, x, y, [[r, z0], [r * 0.82, z1 - 0.7]], segs)
    lathe(trim, x, y, [[r * 0.82, z1 - 0.7], [r * 1.02, z1 - 0.32]], segs)
    prism(trim, trim, rect(x - r * 1.12, y - r * 1.12, x + r * 1.12, y + r * 1.12), z1 - 0.32, z1)
  }
  /** A pilaster standing on the plan rectangle, proud of its wall. */
  const pilaster = (x0: number, y0: number, x1: number, y1: number, z0 = F, z1 = CAP) => prism(trim, null, rect(x0, y0, x1, y1), z0, z1)

  // ------------------------------------------------------------ podium and walls
  // The podium runs down to z = 0 everywhere (the uphill west side sinks
  // into the terrace); the walls stand on it from the colonnade floor.
  prism(stone, null, chamfer(rect(-X - 0.25, -Y - 0.25, X + 0.25, Y + 0.25), 0.3), 0, F - 0.35)
  prism(trim, null, chamfer(rect(-X - 0.35, -Y - 0.35, X + 0.35, Y + 0.35), 0.3), F - 0.35, F)
  // the walls, the west, north and south colonnades cut back into them
  const plan: XY[] = [
    [-X, -Y], [-NC, -Y], [-NC, -Y + RN], [NC, -Y + RN], [NC, -Y], [X, -Y], [X, Y], [NC, Y], [NC, Y - RN], [-NC, Y - RN], [-NC, Y],
    [-X, Y], [-X, WC], [-X + RW, WC], [-X + RW, -WC], [-X, -WC],
  ]
  // the recesses' back and side walls and their ceilings are in shadow
  const inRecessXY = (x: number, y: number) => (x > -X + 0.1 && x < -X + RW + 0.1 && Math.abs(y) < WC + 0.1) || (Math.abs(x) < NC + 0.1 && Math.abs(y) > Y - RN - 0.1 && Math.abs(y) < Y - 0.1)
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    wallEdge(inRecessXY((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) ? shade : stone, plan, i, F, CAP)
  }
  for (const r of [rect(-X, -WC, -X + RW, WC), rect(-NC, Y - RN, NC, Y), rect(-NC, -Y, NC, -Y + RN)]) {
    capRing(stone, r, F)
    capRing(shade, r, CAP, false)
  }
  // entablature and cornice round the whole block
  prism(stone, null, rect(-X, -Y, X, Y), CAP, FRIEZE)
  prism(trim, null, rect(-X, -Y, X, Y), CAP, CAP + 0.9) // the architrave, a shade lighter
  prism(trim, null, chamfer(rect(-X - 0.6, -Y - 0.6, X + 0.6, Y + 0.6), 0.4), FRIEZE, EAVE)
  capRing(trim, chamfer(rect(-X - 0.6, -Y - 0.6, X + 0.6, Y + 0.6), 0.4), EAVE)
  // a plain attic over the cornice, which hides the low copper roofs from the street
  prism(stone, trim, rect(-X - 0.1, -Y - 0.1, X + 0.1, Y + 0.1), EAVE, ATTIC)

  // ------------------------------------------------------------ the fronts
  const lowWin = [5.4, 8.6] as const, upWin = [12.0, 15.3] as const
  const bayWins = (f: Face, s: number, hw = 0.8, part = shade) => {
    W(f, s - hw, s + hw, lowWin[0], lowWin[1], part)
    W(f, s - hw, s + hw, upWin[0], upWin[1], part)
  }
  // West and east fronts: wings of six bays, the outer one blank.
  const BAY_W = (Y - WC) / 6
  for (const sx of [-1, 1]) {
    const xf = sx * X
    for (const sy of [-1, 1]) {
      for (let k = 0; k <= 6; k++) {
        const y = sy * (Y - k * BAY_W), hw = k === 0 ? 1.3 : k === 6 ? 1.1 : 0.9
        const y0 = k === 0 ? (sy > 0 ? Y - 2.6 : -Y) : y - hw, y1 = k === 0 ? (sy > 0 ? Y : -Y + 2.6) : y + hw
        pilaster(sx < 0 ? xf - 0.35 : xf, y0, sx < 0 ? xf : xf + 0.35, y1)
        if (k >= 1 && k <= 4) bayWins({ o: [xf, sy * (Y - (k + 0.5) * BAY_W), 0], n: [sx, 0] }, 0)
      }
    }
  }
  // North and south fronts: wings of four bays.
  const BAY_N = (X - NC) / 4
  for (const sy of [-1, 1]) {
    const yf = sy * Y
    for (const sx of [-1, 1]) {
      for (let k = 0; k <= 4; k++) {
        const x = sx * (X - k * BAY_N), hw = k === 0 ? 1.3 : k === 4 ? 1.1 : 0.9
        const x0 = k === 0 ? (sx > 0 ? X - 2.6 : -X) : x - hw, x1 = k === 0 ? (sx > 0 ? X : -X + 2.6) : x + hw
        pilaster(x0, sy < 0 ? yf - 0.35 : yf, x1, sy < 0 ? yf : yf + 0.35)
        if (k < 4) bayWins({ o: [sx * (X - (k + 0.5) * BAY_N), yf, 0], n: [0, sy] }, 0, 0.75)
      }
    }
  }
  // The colonnades: columns on the front line, doors and windows on the back wall.
  // eight columns at 4.45 m (Ɱ's west-front photo), four on the north and south
  for (let k = 0; k < 8; k++) column(-X + 1.2, (k - 3.5) * 4.45, F, CAP)
  {
    const f: Face = { o: [-X + RW, 0, 0], n: [-1, 0] }
    W(f, -1.4, 1.4, F, F + 5.6, door)
    W(f, -1.5, 1.5, F + 6.6, F + 7.6) // the transom
    for (const s of [-8.9, 8.9]) bayWins(f, s, 0.75, win)
    for (const s of [-15.6, 15.6]) W(f, s - 0.7, s + 0.7, lowWin[0], lowWin[1])
  }
  for (const sy of [-1, 1]) {
    for (let k = 0; k < 4; k++) column((k - 1.5) * 4.7, sy * (Y - 1.2), F, CAP)
    const f: Face = { o: [0, sy * (Y - RN), 0], n: [0, sy] }
    W(f, -1.3, 1.3, F, F + 5.4, door)
    W(f, -1.3, 1.3, upWin[0], upWin[1])
    for (const s of [-4.7, 4.7]) bayWins(f, s, 0.7, win)
  }
  // Steps up to each colonnade, as broad treads (the real flights have ~10 risers).
  const steps = (x0: number, y0: number, x1: number, y1: number, along: 'x' | 'y', dir: number, top: number, bottom: number) => {
    const n = 4
    for (let k = 0; k < n; k++) {
      const t = (k + 1) / n, z = bottom + (top - bottom) * t
      if (along === 'x') {
        const xo = dir < 0 ? x0 + (x1 - x0) * (k / n) : x1 - (x1 - x0) * (k / n)
        prism(stone, stone, dir < 0 ? rect(xo, y0, x1, y1) : rect(x0, y0, xo, y1), 0, z)
      } else {
        const yo = dir < 0 ? y0 + (y1 - y0) * (k / n) : y1 - (y1 - y0) * (k / n)
        prism(stone, stone, dir < 0 ? rect(x0, yo, x1, y1) : rect(x0, y0, x1, yo), 0, z)
      }
    }
  }
  steps(-X - 4.4, -21.5, -X - 0.3, 21.5, 'x', -1, F, 2.4)
  steps(-11.5, Y + 0.3, 11.5, Y + 4.0, 'y', 1, F, 3.0)
  steps(-11.5, -Y - 4.0, 11.5, -Y - 0.3, 'y', -1, F, 3.0)

  // ------------------------------------------------------------ roofs
  // North and south halves: low hips (lidar: 22.2 just inside the attic,
  // ridge 23.9, about 7 degrees), springing from behind the attic.
  const R = ATTIC - 0.2, RID = 23.9
  for (const sy of [-1, 1]) {
    const yIn = sy * 13.5, yOut = sy * (Y - 0.2), yr = sy * 30.2, xr = 14
    const a: V3 = [-X + 0.2, yIn, R], b: V3 = [X - 0.2, yIn, R], c: V3 = [X - 0.2, yOut, R], d: V3 = [-X + 0.2, yOut, R]
    const p: V3 = [-xr, yr, RID], q: V3 = [xr, yr, RID]
    for (const pts of [[d, c, q, p], [b, a, p, q], [c, b, q], [a, d, p]]) face(roof, pts, [0, 0, 1])
  }
  // The central gable (lidar: 26.0 on the ridge, 22.5 at y = +-14), its low
  // pediments set back 3 m behind the attic so the street sees only their tops.
  const GX = X - 3.0, GY = 13.5, APEX = 26.0
  {
    const nw: V3 = [-GX, GY, R], ne: V3 = [GX, GY, R], se: V3 = [GX, -GY, R], sw: V3 = [-GX, -GY, R]
    const rw: V3 = [-GX, 0, APEX], re: V3 = [GX, 0, APEX]
    face(roof, [ne, nw, rw, re], [0, 0, 1])
    face(roof, [sw, se, re, rw], [0, 0, 1])
    face(stone, [nw, sw, rw], [-1, 0, 0])
    face(stone, [se, ne, re], [1, 0, 0])
    // raking cornices: thin trim bands along the pediments' slopes
    for (const sx of [-1, 1]) {
      const x = sx * (GX + 0.05)
      for (const sy of [-1, 1]) {
        const e: XY = [sy * (GY + 0.4), R - 0.15], t: XY = [0, APEX + 0.3]
        const f: Face = { o: [x, 0, 0], n: [sx, 0] }
        const s = (y: number) => (sx < 0 ? -y : y)
        flatShape(trim, f, [[s(e[0]), e[1]], [s(e[0]), e[1] + 0.6], [s(t[0]), t[1]], [s(t[0]), t[1] - 0.6]], 0.08)
      }
    }
  }

  // ------------------------------------------------------------ the cupola
  const SEG = 48
  prism(stone, trim, chamfer(rect(-12.3, -12.3, 12.3, 12.3), 0.4), R, 26.4)
  const BASE_R = 11.95, WALL_R = 11.6
  lathe(stone, 0, 0, [[BASE_R, 26.3], [BASE_R, 30.5]], SEG)
  lathe(trim, 0, 0, [[BASE_R, 30.5], [BASE_R + 0.15, 30.5], [BASE_R + 0.15, 30.9], [WALL_R, 30.9]], SEG)
  lathe(stone, 0, 0, [[WALL_R, 30.9], [WALL_R, 40.2]], SEG)
  // 24 pilasters and, between them, two tiers of tall windows
  const BAYS = 24
  for (let k = 0; k < BAYS; k++) {
    const a = (k / BAYS) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), t: XY = [-s, c]
    const P = (w: number, r: number): XY => [c * r + t[0] * w, s * r + t[1] * w]
    prism(trim, null, [P(-0.6, WALL_R - 0.1), P(0.6, WALL_R - 0.1), P(0.6, BASE_R), P(-0.6, BASE_R)].reverse(), 30.9, 40.2)
    const am = ((k + 0.5) / BAYS) * 2 * Math.PI
    const f: Face = { o: [Math.cos(am) * WALL_R, Math.sin(am) * WALL_R, 0], n: [Math.cos(am), Math.sin(am)] }
    W(f, -0.5, 0.5, 33.1, 36.3)
    W(f, -0.5, 0.5, 37.0, 39.6)
  }
  // entablature, the projecting cornice, the cone, the lantern and finial
  lathe(trim, 0, 0, [[BASE_R, 40.2], [BASE_R, 42.3], [12.35, 42.45], [12.6, 42.8], [12.6, 43.0], [12.3, 43.05]], SEG)
  lathe(roof, 0, 0, [[12.3, 43.05], [4.9, 44.3]], SEG)
  lathe(trim, 0, 0, [[4.7, 44.25], [4.7, 45.55], [5.1, 45.6], [5.1, 45.9], [4.85, 45.95]], 24)
  lathe(glass, 0, 0, [[4.85, 45.95], [2.6, 46.6], [0.75, 47.2]], 24)
  lathe(trim, 0, 0, [[0.75, 47.2], [0.75, 47.6], [0.55, 47.95], [0.2, 48.15], [0.1, 49.8], [0.01, 49.9]], 10)

  // ------------------------------------------------------------ the Atrium
  {
    // a stone pavilion at each end, two columns in antis, glass slots beside
    prism(stone, null, rect(AX0, -AY, AX1, AY), 0, 1.4)
    for (const sy of [-1, 1]) {
      const yf = sy * AY, yb = sy * (AY - 3.0)
      prism(stone, null, rect(AX0 + 3.6, sy < 0 ? yf : yb, AX0 + 6.0, sy < 0 ? yb : yf), 0, 15.2)
      prism(stone, null, rect(AX1 - 6.0, sy < 0 ? yf : yb, AX1 - 3.6, sy < 0 ? yb : yf), 0, 15.2)
      prism(stone, null, rect(AX0 + 3.6, sy < 0 ? yf : yb, AX1 - 3.6, sy < 0 ? yb : yf), 12.6, 15.2)
      capRing(stone, rect(AX0 + 6.0, sy < 0 ? yf : yb, AX1 - 6.0, sy < 0 ? yb : yf), 12.6, false)
      for (const x of [AX0 + 9.9, AX1 - 9.9]) column(x, yf - sy * 1.0, 3.4, 12.6, 0.75)
      const f: Face = { o: [(AX0 + AX1) / 2, yb, 0], n: [0, sy] }
      W(f, -1.6, 1.6, 3.4, 7.8, door)
      W(f, -1.8, 1.8, 8.6, 12.0)
      for (const x of [AX0 + 1.8, AX1 - 1.8]) W({ o: [x, yf, 0], n: [0, sy] }, -1.75, 1.75, 1.4, 15.2, glass)
    }
    // the glazed hall behind, under a flat roof and a skylight
    prism(glass, null, rect(AX0 + 0.1, -AY + 3.0, AX1 - 0.1, AY - 3.0), 0, 17.6)
    prism(trim, null, rect(AX0, -AY, AX1, AY), 17.6, 18.3)
    capRing(roof, rect(AX0, -AY, AX1, AY), 18.3)
    prism(glass, glass, rect(AX0 + 4, -AY + 4, AX1 - 4, AY - 4), 18.3, 18.8)
  }

  // ------------------------------------------------------------ the Senate Building
  {
    const SB = 6.6, SC = 17.0, SF = 19.6, SE = 21.4, SXC = (SX0 + SX1) / 2
    prism(stone, null, rect(SX0, -SY, SX1, SY), 0, SB)
    prism(trim, null, rect(SX0 - 0.15, -SY - 0.15, SX1 + 0.15, SY + 0.15), SB - 0.5, SB)
    // the north portico: four columns in antis, recessed 3 m
    const PX = 7.4, PR = 3.0
    prism(stone, null, [[SX0, -SY], [SX1, -SY], [SX1, SY], [SXC + PX, SY], [SXC + PX, SY - PR], [SXC - PX, SY - PR], [SXC - PX, SY], [SX0, SY]], SB, SC)
    capRing(stone, rect(SXC - PX, SY - PR, SXC + PX, SY), SB)
    capRing(stone, rect(SXC - PX, SY - PR, SXC + PX, SY), SC, false)
    for (let k = 0; k < 4; k++) column(SXC + (k - 1.5) * 3.7, SY - 0.95, SB, SC, 0.8)
    prism(stone, null, rect(SX0, -SY, SX1, SY), SC, SF)
    prism(trim, null, chamfer(rect(SX0 - 0.45, -SY - 0.45, SX1 + 0.45, SY + 0.45), 0.3), SF, SF + 0.6)
    prism(stone, roof, rect(SX0 - 0.2, -SY - 0.2, SX1 + 0.2, SY + 0.2), SF + 0.6, SE) // the attic, and the copper roof over it
    // pediments over the centre of each end
    for (const sy of [-1, 1]) {
      const y = sy * (SY + 0.25), hw = 10.5, top = SE + 3.6
      const a: V3 = [SXC - hw, y, SF + 0.6], b: V3 = [SXC + hw, y, SF + 0.6], c: V3 = [SXC, y, top]
      const a2: V3 = [SXC - hw, y - sy * 5, SF + 0.6], b2: V3 = [SXC + hw, y - sy * 5, SF + 0.6], c2: V3 = [SXC, y - sy * 5, top]
      face(trim, [a, b, c], [0, sy, 0])
      face(roof, [a2, a, c, c2], [0, 0, 1])
      face(roof, [b, b2, c2, c], [0, 0, 1])
    }
    // the chamber's raised hipped roof
    {
      const x0 = SX0 + 1.5, x1 = SX0 + 13.3, y0 = -17.5, y1 = 17.5, top = 25.8, z = SE
      const A: V3 = [x0, y0, z], B: V3 = [x1, y0, z], C: V3 = [x1, y1, z], D: V3 = [x0, y1, z]
      const p: V3 = [x0 + 4, y0 + 4, top], q: V3 = [x1 - 4, y0 + 4, top], r: V3 = [x1 - 4, y1 - 4, top], s: V3 = [x0 + 4, y1 - 4, top]
      for (const pts of [[A, B, q, p], [B, C, r, q], [C, D, s, r], [D, A, p, s]]) face(roof, pts, [0, 0, 1])
      face(glass, [p, q, r, s], [0, 0, 1])
    }
    // windows: the rusticated base and two tiers of the order, a bay every 4.4 m;
    // pilasters between the bays on the long east front
    const nE = 15, bE = (2 * SY) / nE
    for (let k = 0; k < nE; k++) {
      const y = -SY + (k + 0.5) * bE, f: Face = { o: [SX1, y, 0], n: [1, 0] }
      W(f, -0.8, 0.8, 1.6, 4.6)
      W(f, -0.8, 0.8, 8.0, 11.2)
      W(f, -0.8, 0.8, 12.6, 15.6)
      if (k > 0) pilaster(SX1, y - bE / 2 - 0.6, SX1 + 0.3, y - bE / 2 + 0.6, SB, SC)
    }
    for (const sy of [-1, 1]) {
      // the west front's exposed ends, beside the Atrium
      for (const y of [22.5, 27.0, 31.0]) {
        const f: Face = { o: [SX0, sy * y, 0], n: [-1, 0] }
        W(f, -0.75, 0.75, 1.6 + 1.2, 4.6 + 1.2)
        W(f, -0.75, 0.75, 8.0, 11.2)
        W(f, -0.75, 0.75, 12.6, 15.6)
      }
      // the north and south ends
      const f: Face = { o: [0, sy * SY, 0], n: [0, sy] }
      const sAt = (x: number) => (sy > 0 ? -x : x) // s runs west on the north face, east on the south
      for (const x of [SX0 + 2.6, SX0 + 6.2, SX1 - 6.2, SX1 - 2.6]) {
        W(f, sAt(x) - 0.75, sAt(x) + 0.75, 8.0, 11.2)
        W(f, sAt(x) - 0.75, sAt(x) + 0.75, 12.6, 15.6)
      }
      if (sy > 0) {
        const fb: Face = { o: [SXC, SY - PR, 0], n: [0, 1] }
        for (const s of [-3.7, 0, 3.7]) {
          W({ o: [SXC + s, SY, 0], n: [0, 1] }, -0.9, 0.9, 2.2, 5.6, door)
          W(fb, -s - 0.75, -s + 0.75, 8.0, 15.6)
        }
      } else {
        for (const x of [SXC - 3.6, SXC, SXC + 3.6]) {
          W(f, sAt(x) - 0.75, sAt(x) + 0.75, 8.0, 11.2)
          W(f, sAt(x) - 0.75, sAt(x) + 0.75, 12.6, 15.6)
        }
        W(f, sAt(SXC) - 1.0, sAt(SXC) + 1.0, 1.4, 4.6, door)
      }
    }
  }

  // ------------------------------------------------------------ night
  // The colonnades are lit from inside, the cupola washed, the long walls
  // and the Senate Building more softly; faces looking up catch little.
  const inRecess = (p: V3) => inRecessXY(p[0], p[1]) || (p[0] < -X + RW + 0.1 && p[0] > -X - 0.1 && Math.abs(p[1]) < WC) || (Math.abs(p[0]) < NC && Math.abs(p[1]) > Y - RN - 0.1 && Math.abs(p[1]) < Y + 0.1)
  // The colonnades' columns are floodlit against their dark recesses (Becker1999);
  // the cupola is washed; the long walls and the Senate Building are dimmer.
  const lit = (p: V3, n: V3): number => {
    const up = n[2] > 0.7 ? 0.2 : 1
    if (p[2] > 26.2 && Math.hypot(p[0], p[1]) < 13) return up * 0.6
    if (p[0] > SX0 - 0.1) return up * 0.35
    if (p[2] < CAP + 0.1 && p[2] > F - 0.1 && inRecess(p)) return up
    return up * 0.08
  }
  const limestone = { ...finish('ohio-limestone', 0xe6e0d2), floodlight: lit }
  const limestoneTrim = { ...finish('ohio-limestone-trim', 0xf2ece0), floodlight: lit }
  const copper = finish('statehouse-copper', 0x8aaca2)
  return finishGlb('Ohio Statehouse', [
    { part: stone, material: limestone },
    { part: trim, material: limestoneTrim },
    { part: win, material: PALETTE.window },
    { part: roof, material: copper },
    { part: glass, material: PALETTE.glass },
    { part: shade, material: finish('statehouse-shade', 0x6f7880) },
  ], { bearing: 351.1, height: 49.9, replaces: ['way/30172881'] }, 6500)
}

if (import.meta.main) await writeModel('cmh-ohio-statehouse', build())
