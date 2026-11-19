/**
 * Wayne County Building, 600 Randolph Street, Detroit (1897-1902; John and
 * Arthur Scott; sculpture by J. Massey Rhind and Edward Wagner):
 * procedural, CC0-1.0, no textures.
 * bun generators/det-wayne-county-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Placed at bearing 59.8 (the OSM outline's short axis, from its
 * edges: 59.6-60.2 / 149.2-150.0), so the model's -y is the main front on
 * Randolph Street / Cadillac Square, facing 239.8 (SW), and +x runs along
 * the long axis toward 149.8 (SSE). Anchor: area centroid of OSM
 * way/656595907 (-83.042709, 42.332101).
 *
 * Identity, in order: the copper-red ribbed dome with its green spire on a
 * four-stage square tower (plain stage, arcaded colonnade, a narrower stage
 * ringed by a balustrade with four bronze figures at its corners, an arched
 * lantern); the two bronze quadrigas (Victory and Progress) flanking the
 * tower's base on the roof; the hexastyle two-storey Corinthian portico with
 * its pediment over a granite base and a grand front stair; the four corner
 * pavilions rising a storey higher with corner pinnacles; the white
 * rusticated granite base under buff Berea sandstone.
 *
 * Evidence
 * - OSM: building way/656595907 (outline, relation/10529306 role outline),
 *   parts way/69000347 (main, 30 m), way/107616151 (tower, 75 m, 11.3 m
 *   square), way/107616147 + way/656597961 (portico and its roof, 28 m),
 *   way/656591909-656591914 (end and back strips, 24 m), way/656591915
 *   (glazed gabled court roof, 30-33 m).
 * - Lidar: USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m
 *   grid. Street ground 1.8 m over the grid minimum and flat round the
 *   block. Over that ground: front 3rd-storey cornice/balustrade 23-25 m,
 *   the 4th-storey attic set back ~2.5 m, its roof 29 m; pavilions 29.5-31 m,
 *   pinnacles to ~33.7; glazed court roof ridge 34.6 m; quadriga tops
 *   ~36.5 m at x = -9 / +12, y = -20..-23; tower dome top ~69 m; front
 *   landing 4.2 m, stair down to y ~ -44.
 * - Published: Wikipedia "Wayne County Building": 5 floors, rusticated
 *   basement, buff Berea sandstone facade, copper dome and spire, tower
 *   247 ft (75.3 m) since the 1960s dome rebuild; Rhind's quadrigas
 *   Victory and Progress and four tower figures (Law, Commerce,
 *   Agriculture, Mechanics). NRHP 75000972.
 * - USGS NAIP aerial: pale membrane roofs, the big glazed gabled court roof.
 * - Photos (Wikimedia Commons, all evidence), in
 *   SCRATCH/work/det-wayne-county-building/photos:
 *   - "Detroit December 2019 02 (Wayne County Building).jpg", Michael Barera,
 *     CC BY-SA 4.0, front from the SW
 *     https://commons.wikimedia.org/wiki/File:Detroit_December_2019_02_(Wayne_County_Building).jpg
 *   - "Wayne County Courthouse — Detroit, Michigan.jpg", Christopher L. Riley,
 *     CC BY-SA 4.0, front and SE end from the S (colours, sunlit)
 *     https://commons.wikimedia.org/wiki/File:Wayne_County_Courthouse_%E2%80%94_Detroit,_Michigan.jpg
 *   - "Wayne County Building from the northwest, 2017.jpg", bryan...,
 *     CC BY-SA 2.0, NW end and front
 *     https://commons.wikimedia.org/wiki/File:Wayne_County_Building_from_the_northwest,_2017.jpg
 *   - "Wayne County Building, Randolph Street, Detroit, MI.jpg", w_lemay,
 *     CC BY-SA 2.0, near face-on front: the tower stages, the portico's
 *     column spacing, the pavilion storeys (proportions read from it)
 *     https://commons.wikimedia.org/wiki/File:Wayne_County_Building,_Randolph_Street,_Detroit,_MI.jpg
 *   - "Wayne County Building at night, Renaissance Center in background,
 *     2015.jpg", Joshuay04, CC BY-SA 4.0: floodlit stone at night
 *     https://commons.wikimedia.org/wiki/File:Wayne_County_Building_at_night,_Renaissance_Center_in_background,_2015.jpg
 *
 * Phone size: the portico's loggia is drawn as one dark panel behind the
 * columns, and the pediment carries thick raking cornices, so both read in
 * flat light; the quadrigas are drawn 1.5x (see quadriga()).
 *
 * Numbers. Measured (lidar/OSM): footprint, pavilion and portico plan, tower
 * plan, cornice 23.0, balustrade 25.3, attic 28.8, pavilions 31.2, glass
 * ridge 34.4, quadriga pedestals and tops, landing 4.2, stair run. Published:
 * tower 75.3 m. Estimated from the w_lemay photo, scaled between the attic
 * (28.8) and the spire tip (75.3): tower plain stage to 37.3, colonnade
 * 38.8-46.9, entablature to 49.0, balustrade stage to 56.0, lantern
 * 56.8-63.2, dome 64.0-69.2 (5.9 m across), spire to 75.3; granite base to
 * 10.3; window sizes and storey lines; column spacing (pairs at the ends,
 * two singles in the middle). Invented: the back (NE) facade, which no photo
 * shows, is drawn like the front without the portico; the quadriga and
 * figure poses are simplified (four horses abreast heading outward).
 * Left out (file budget, 250 KB): the attic windows on the ends and back, the
 * urns along the balustrades, the pediment relief, the
 * cartouches, balconies and window pediments.
 *
 * Colours from the sunlit Riley photo, pulled to the palette's lightness:
 * sandstone #ac9c80 -> #e3d3b3, granite #b4ad9f -> #ebe8e0, dome copper-red
 * #b19376 / orange in close crops -> #c98c6e, bronze patina #748b84 /
 * spire #91baad -> #82aa9a. Flat roofs and the pediment's roof share the
 * granite material (pale in NAIP). The glazed court roof is glass tinted
 * toward the NAIP's grey (#93a9b8). Night: the stone is floodlit (night photo), windows glow, the
 * glazed court roof stays dark.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect, capPoly, insetRing, type XY } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, face, lathe } from './nyc-columbus-monument'

const granite = new Part(), sand = new Part(), win = new Part(), glass = new Part(), dome = new Part(), bronze = new Part()

function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.2, roof: Part | null = p) {
  if (bevel <= 0.06) {
    // Small or ground-hugging pieces: four walls and a top, no bevel.
    const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
    face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], c)
    face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], c)
    face(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], c)
    face(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], c)
    if (roof) face(roof, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], c)
    return
  }
  prism({ wall: p, win: null, roof, ring: chamferRect(x0, y0, x1, y1, 0), z0, z1, facade: null, bevel })
}
/** A box split into pieces no longer than `step`, so the map's ground drape doesn't bury it. */
function splitBox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, step = 4.5) {
  const nx = Math.max(1, Math.ceil((x1 - x0) / step)), ny = Math.max(1, Math.ceil((y1 - y0) / step))
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++)
    box(p, x0 + ((x1 - x0) * i) / nx, y0 + ((y1 - y0) * j) / ny, x0 + ((x1 - x0) * (i + 1)) / nx, y0 + ((y1 - y0) * (j + 1)) / ny, z0, z1, 0.05)
}

// ---------------------------------------------------------------------------
// Windows on a wall a->b (counter-clockwise, so the outward normal is to the right).
type Row = { z0: number; z1: number; w: number; arch?: boolean }
function windows(a: XY, b: XY, n: number, rows: Row[], margin = 0.8, only?: (k: number) => boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux, d = 0.05
  const P = (s: number, z: number): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
  const pitch = (L - 2 * margin) / n
  for (let k = 0; k < n; k++) {
    if (only && !only(k)) continue
    const c = margin + pitch * (k + 0.5)
    for (const r of rows) {
      const h = r.w / 2
      const zs = r.arch ? r.z1 - h : r.z1
      win.quad(P(c - h, r.z0), P(c + h, r.z0), P(c + h, zs), P(c - h, zs))
      if (r.arch) for (let i = 0; i < 5; i++) {
        const t0 = Math.PI - (i * Math.PI) / 5, t1 = Math.PI - ((i + 1) * Math.PI) / 5
        win.tri(P(c, zs), P(c + h * Math.cos(t0), zs + h * Math.sin(t0)), P(c + h * Math.cos(t1), zs + h * Math.sin(t1)))
      }
    }
  }
}

// Storey lines (z above the street).
const Z_GRANITE = 10.3, Z_CORNICE0 = 22.4, Z_CORNICE = 23.0, Z_BAL = 25.3, Z_ATTIC = 28.8, Z_PAV = 31.2
const BASEMENT: Row = { z0: 1.0, z1: 2.5, w: 1.2 }
const GROUND: Row = { z0: 5.0, z1: 8.8, w: 1.6, arch: true }
const PIANO: Row = { z0: 12.0, z1: 15.8, w: 1.6 }
const SECOND: Row = { z0: 17.2, z1: 20.6, w: 1.5 }
const ATTIC: Row = { z0: 25.9, z1: 27.9, w: 1.3 }
const PAV_TOP: Row = { z0: 25.0, z1: 28.6, w: 1.5 }
const LOWER = [GROUND, PIANO, SECOND]

function build() {
  // --- The lower body: outline ring (portico left out), granite then sandstone. ---
  const XP = 26.6, XE = 38.9, XW = 37.6
  const ring: XY[] = [
    [-XE, -27.0], [-XP, -27.0], [-XP, -25.4], [-12.2, -25.4], [-12.2, -26.0], [12.2, -26.0], [12.2, -25.4], [XP, -25.4], [XP, -27.0], [XE, -27.0],
    [XE, -14.7], [XW, -14.7], [XW, 15.0], [XE, 15.0], [XE, 27.5], [XP, 27.5], [XP, 25.8], [12.4, 25.8], [12.4, 28.0],
    [-12.4, 28.0], [-12.4, 25.8], [-XP, 25.8], [-XP, 27.5], [-XE, 27.5], [-XE, 15.0], [-XW, 15.0], [-XW, -14.7], [-XE, -14.7],
  ]
  prism({ wall: granite, win: null, roof: null, ring, z0: 0, z1: Z_GRANITE, facade: null, bevel: 0.3 })
  prism({ wall: sand, win: null, roof: null, ring, z0: Z_GRANITE, z1: Z_CORNICE0, facade: null, bevel: 0.3 })
  // Main cornice (projecting), then the balustrade, read as a solid parapet.
  prism({ wall: sand, win: null, roof: granite, coping: sand, ring: insetRing(ring, -0.45), z0: Z_CORNICE0, z1: Z_CORNICE, facade: null, bevel: 0.3 })
  prism({ wall: sand, win: null, roof: granite, coping: sand, ring: insetRing(ring, 0.1), z0: Z_CORNICE, z1: Z_BAL, facade: null, bevel: 0.15 })

  // --- The set-back attic, the flush central front and back bays, the pavilions. ---
  box(sand, -35.6, -22.9, 35.6, 23.3, Z_BAL - 0.2, Z_ATTIC, 0.3, granite)
  box(sand, -12.4, 22.0, 12.4, 28.0, Z_CORNICE, 29.5, 0.3, granite)
  const pavs: [number, number, number, number][] = [[-XE, -27.0, -XP, -14.7], [XP, -27.0, XE, -14.7], [-XE, 15.0, -XP, 27.5], [XP, 15.0, XE, 27.5]]
  for (const [x0, y0, x1, y1] of pavs) {
    box(sand, x0, y0, x1, y1, Z_CORNICE, Z_PAV - 0.7, 0.2, null)
    box(sand, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, Z_PAV - 0.7, Z_PAV, 0.25, granite)
    // Corner pinnacles: a die and an obelisk.
    for (const [cx, cy] of [[x0 + 0.7, y0 + 0.7], [x1 - 0.7, y0 + 0.7], [x0 + 0.7, y1 - 0.7], [x1 - 0.7, y1 - 0.7]]) {
      box(sand, cx - 0.55, cy - 0.55, cx + 0.55, cy + 0.55, Z_PAV, Z_PAV + 1.1, 0)
      const r = 0.38, z = Z_PAV + 1.1, top: V3 = [cx, cy, Z_PAV + 3.3]
      const sq: V3[] = [[cx - r, cy - r, z], [cx + r, cy - r, z], [cx + r, cy + r, z], [cx - r, cy + r, z]]
      for (let i = 0; i < 4; i++) sand.tri(sq[i], sq[(i + 1) % 4], top)
    }
    // Raised centre of the pavilion's parapet (the cartouche block) on its long faces.
    const mx = (x0 + x1) / 2
    if (y0 < 0) box(sand, mx - 2.0, y0 - 0.2, mx + 2.0, y0 + 0.8, Z_PAV, Z_PAV + 1.3, 0)
    else box(sand, mx - 2.0, y1 - 0.8, mx + 2.0, y1 + 0.2, Z_PAV, Z_PAV + 1.3, 0)
    // Giant pilasters over the granite, at the ends of each outer face and flanking the centre.
    const pil = (cx: number, cy: number, alongX: boolean) => alongX
      ? box(sand, cx - 0.45, cy - 0.3, cx + 0.45, cy + 0.3, Z_GRANITE, Z_CORNICE0, 0, null)
      : box(sand, cx - 0.3, cy - 0.45, cx + 0.3, cy + 0.45, Z_GRANITE, Z_CORNICE0, 0, null)
    const yFace = y0 < 0 ? y0 : y1, xFace = x0 < 0 ? x0 : x1
    for (const s of [x0 + 0.6, mx - 2.3, mx + 2.3, x1 - 0.6]) pil(s, yFace, true)
    // End faces: only the outer corner pilasters (file budget).
    pil(xFace, y0 < 0 ? y0 + 0.6 : y1 - 0.6, false)
  }

  // --- Windows. Front (-y), ends (±x), back (+y). ---
  const pavRows = [GROUND, PIANO, SECOND, PAV_TOP]
  const pavFront = [BASEMENT, ...pavRows]
  for (const s of [-1, 1]) {
    // Pavilion fronts and backs (3 bays), pavilion end faces (3 bays).
    const [fa, fb]: [XY, XY] = s < 0 ? [[-XE, -27.0], [-XP, -27.0]] : [[XP, -27.0], [XE, -27.0]]
    windows(fa, fb, 3, pavFront, 1.2)
    const [ba, bb]: [XY, XY] = s < 0 ? [[-XP, 27.5], [-XE, 27.5]] : [[XE, 27.5], [XP, 27.5]]
    windows(ba, bb, 3, pavRows, 1.2)
    if (s > 0) { windows([XE, -27.0], [XE, -14.7], 3, pavRows, 1.2); windows([XE, 15.0], [XE, 27.5], 3, pavRows, 1.2) }
    else { windows([-XE, -14.7], [-XE, -27.0], 3, pavRows, 1.2); windows([-XE, 27.5], [-XE, 15.0], 3, pavRows, 1.2) }
    // Front walls between pavilion and centre (4 bays), the attic over them.
    const [wa, wb]: [XY, XY] = s < 0 ? [[-XP, -25.4], [-12.2, -25.4]] : [[12.2, -25.4], [XP, -25.4]]
    windows(wa, wb, 4, [BASEMENT, ...LOWER], 0.6)
    windows([wa[0], -22.9], [wb[0], -22.9], 4, [ATTIC], 0.6)
    // Back walls (4 bays) and attic.
    const [va, vb]: [XY, XY] = s < 0 ? [[-12.4, 25.8], [-XP, 25.8]] : [[XP, 25.8], [12.4, 25.8]]
    windows(va, vb, 4, LOWER, 0.6)
    // End walls (8 bays) and attic.
    if (s > 0) { windows([XW, -14.7], [XW, 15.0], 8, LOWER, 0.6) }
    else { windows([-XW, 15.0], [-XW, -14.7], 8, LOWER, 0.6) }
  }
  // Back central projection (7 bays, with its attic storey).
  windows([12.4, 28.0], [-12.4, 28.0], 7, [...LOWER, ATTIC], 0.8)
  // Central front bay behind the portico: three bays of the two sandstone storeys.
  // The loggia behind the columns reads dark in every photo: three tall openings between the
  // column groups, and the outer bays' windows.
  for (const [x0, x1] of [[-8.0, 8.0]]) {
    const y = -26.05
    win.quad([x0, y, Z_GRANITE + 1.3], [x1, y, Z_GRANITE + 1.3], [x1, y, 20.8], [x0, y, 20.8])
  }
  windows([-12.2, -26.0], [12.2, -26.0], 5, [PIANO, SECOND], 0.6, (k) => k === 0 || k === 4)
  windows([-12.2, -26.0], [12.2, -26.0], 5, [BASEMENT], 0.6, (k) => k === 0 || k === 4)

  // --- The portico: granite base with three doors, six Corinthian columns, entablature, pediment. ---
  const PX = 9.9, PY0 = -29.7, PY1 = -26.0
  box(granite, -PX, PY0, PX, PY1 + 0.1, 0, Z_GRANITE, 0.2)
  for (const x of [-3.2, 0, 3.2]) {
    const y = PY0 - 0.05
    win.quad([x - 0.9, y, 4.2], [x + 0.9, y, 4.2], [x + 0.9, y, 7.9], [x - 0.9, y, 7.9])
  }
  // The balustrade along the portico floor.
  box(sand, -PX + 0.2, PY0 + 0.1, PX - 0.2, PY0 + 0.45, Z_GRANITE, Z_GRANITE + 1.0, 0, sand)
  const ZC0 = Z_GRANITE + 1.0, ZC1 = 21.2
  for (const x of [-8.6, -7.1, -2.3, 2.3, 7.1, 8.6]) {
    const y = -28.6
    smooth(sand, (q) => lathe(q, [[0.7, Z_GRANITE], [0.7, ZC0], [0.52, ZC0 + 0.3], [0.46, ZC1 - 1.0], [0.74, ZC1]], 8, x, y), 50)
  }
  // Pilasters on the wall behind the end columns.
  for (const x of [-8.6, 8.6]) box(sand, x - 0.5, PY1 - 0.25, x + 0.5, PY1 + 0.1, ZC0, ZC1, 0, null)
  box(sand, -PX - 0.1, PY0 - 0.1, PX + 0.1, PY1, ZC1, Z_CORNICE0 + 0.1, 0.12, null)
  box(sand, -PX - 0.4, PY0 - 0.4, PX + 0.4, PY1, Z_CORNICE0 + 0.1, Z_CORNICE, 0.2, sand)
  {
    // Pediment: a triangular prism, its raking cornice a little proud.
    const zA = 28.4, y0 = PY0 - 0.3, y1 = -22.9, x = PX + 0.3
    const L: V3 = [-x, y0, Z_CORNICE], R: V3 = [x, y0, Z_CORNICE], T: V3 = [0, y0, zA]
    sand.tri(L, R, T)
    const Lb: V3 = [-x, y1, Z_CORNICE], Rb: V3 = [x, y1, Z_CORNICE], Tb: V3 = [0, y1, zA]
    // Its roof slopes in the pale roof colour, so the gable reads from above.
    face(granite, L, T, Tb, Lb, [0, (y0 + y1) / 2, Z_CORNICE])
    face(granite, T, R, Rb, Tb, [0, (y0 + y1) / 2, Z_CORNICE])
    // Raking cornices: thick bands proud of the tympanum, their soffits in shade, so the
    // pediment reads against the attic behind it.
    for (const sx of [-1, 1]) {
      const a: V3 = [sx * x, y0 - 0.5, Z_CORNICE], b: V3 = [0, y0 - 0.5, zA + 0.15]
      const t = 0.75
      // Band corners: lower edge on the rake line, upper edge t above it (vertically).
      const A0: V3 = [a[0], a[1], a[2]], B0: V3 = [b[0], b[1], b[2]]
      const A1: V3 = [a[0], a[1], a[2] + t], B1: V3 = [b[0], b[1], b[2] + t]
      const A0b: V3 = [a[0], y0 + 0.6, a[2]], B0b: V3 = [b[0], y0 + 0.6, b[2]], A1b: V3 = [a[0], y0 + 0.6, a[2] + t]
      const ctr: V3 = [sx * x / 2, y0 + 0.05, (Z_CORNICE + zA) / 2 + t / 2]
      face(sand, A0, B0, B1, A1, ctr)          // front face
      face(sand, A1, B1, [B1[0], y0 + 0.6, B1[2]], [A1[0], y0 + 0.6, A1[2]], ctr) // top of the band
      face(sand, A0, B0, B0b, A0b, ctr)        // soffit
      face(sand, A0, A1, A1b, A0b, ctr)        // end
    }
  }

  // --- Front landing and the grand stair (lidar: landing 4.2 m, foot ~ y -44.5). ---
  const ZL = 4.2, YL = -33.6, YF = -44.5, SX = 7.0, CX = 8.8, N = 24
  splitBox(granite, -CX, YL, CX, PY0 + 0.05, 0, ZL)
  {
    // Risers and treads only: the cheek walls hide the flight's sides. Split in three across.
    const run = (YL - YF) / N, xs = [-SX, -SX / 3, SX / 3, SX]
    for (let i = 0; i < N; i++) {
      const y = YL - run * i, zl = (ZL * (N - 1 - i)) / N, zh = (ZL * (N - i)) / N
      for (let k = 0; k < 3; k++) {
        granite.quad([xs[k], y, zl], [xs[k + 1], y, zl], [xs[k + 1], y, zh], [xs[k], y, zh])
        if (i < N - 1) granite.quad([xs[k], y - run, zl], [xs[k + 1], y - run, zl], [xs[k + 1], y, zl], [xs[k], y, zl])
      }
    }
  }
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -CX : SX, x1 = s < 0 ? -SX : CX
    splitBox(granite, x0, -40.0, x1, YL, 0, ZL + 0.3)
    splitBox(granite, x0, YF, x1, -40.0, 0, 1.9)
  }

  // --- The glazed gabled court roof and the roof penthouse. ---
  {
    const x0 = -20.4, x1 = 20.4, y0 = -7.3, y1 = 14.0, yr = 3.35, zE = Z_ATTIC, zR = 34.4
    face(glass, [x0, y0, zE], [x1, y0, zE], [x1, yr, zR], [x0, yr, zR], [0, yr, zE])
    face(glass, [x1, y1, zE], [x0, y1, zE], [x0, yr, zR], [x1, yr, zR], [0, yr, zE])
    for (const x of [x0, x1]) {
      const a: V3 = [x, y0, zE], b: V3 = [x, y1, zE], c: V3 = [x, yr, zR]
      if (x > 0) glass.tri(a, c, b); else glass.tri(a, b, c)
    }
    box(granite, 21.0, 4.0, 27.0, 16.0, Z_ATTIC, 32.7, 0.15)
  }

  // --- The tower: centre (0, -12.9), 11.3 m square. ---
  const TY = -12.9, TH = 5.65
  const tb = (h: number, z0: number, z1: number, bevel = 0.2, roof: Part | null = sand) => box(sand, -h, TY - h, h, TY + h, z0, z1, bevel, roof)
  tb(TH, Z_ATTIC - 1, 36.5, 0.25, null)
  tb(TH + 0.35, 36.5, 37.3, 0.2)                     // plain stage cornice
  for (const [a, b] of [[[-TH, TY - TH], [TH, TY - TH]], [[TH, TY - TH], [TH, TY + TH]], [[TH, TY + TH], [-TH, TY + TH]], [[-TH, TY + TH], [-TH, TY - TH]]] as [XY, XY][])
    windows(a, b, 1, [{ z0: 31.6, z1: 33.4, w: 0.8 }], 0)
  tb(TH, 37.3, 38.8, 0.15)                           // colonnade plinth
  tb(4.6, 38.8, 46.9, 0.1, null)                     // colonnade core, arched openings on it
  for (const [a, b] of [[[-4.6, TY - 4.6], [4.6, TY - 4.6]], [[4.6, TY - 4.6], [4.6, TY + 4.6]], [[4.6, TY + 4.6], [-4.6, TY + 4.6]], [[-4.6, TY + 4.6], [-4.6, TY - 4.6]]] as [XY, XY][])
    windows(a, b, 3, [{ z0: 39.4, z1: 46.0, w: 2.3, arch: true }], 0.4)
  {
    // Columns: one at each corner, and two on each face flanking the middle arch, plus
    // one beside each corner (the corner pairs).
    const spots: XY[] = []
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) spots.push([sx * 5.1, sy * 5.1])
    for (const t of [-1.55, 1.55]) spots.push([t, -5.1], [t, 5.1], [-5.1, t], [5.1, t])
    for (const [x, y] of spots) smooth(sand, (q) => lathe(q, [[0.34, 38.8], [0.3, 46.9]], 6, x, TY + y), 50)
  }
  tb(TH, 46.9, 48.2, 0.12, null)                     // entablature
  tb(TH + 0.4, 48.2, 49.0, 0.2)                      // cornice
  // Balustrade round the upper deck, corner piers carrying the four figures.
  for (const s of [-1, 1]) {
    box(sand, -TH + 0.2, TY + s * (TH - 0.2) - 0.18, TH - 0.2, TY + s * (TH - 0.2) + 0.18, 49.0, 50.2, 0)
    box(sand, s * (TH - 0.2) - 0.18, TY - TH + 0.2, s * (TH - 0.2) + 0.18, TY + TH - 0.2, 49.0, 50.2, 0)
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = sx * 5.0, cy = TY + sy * 5.0
    box(sand, cx - 0.5, cy - 0.5, cx + 0.5, cy + 0.5, 49.0, 50.6, 0)
    figure(bronze, [cx, cy, 50.6], 2.8, Math.atan2(sy, sx))
  }
  tb(3.9, 49.0, 56.0, 0.2, null)                     // the figures' stage
  for (const [a, b] of [[[-3.9, TY - 3.9], [3.9, TY - 3.9]], [[3.9, TY - 3.9], [3.9, TY + 3.9]], [[3.9, TY + 3.9], [-3.9, TY + 3.9]], [[-3.9, TY + 3.9], [-3.9, TY - 3.9]]] as [XY, XY][])
    windows(a, b, 1, [{ z0: 52.6, z1: 54.2, w: 0.9 }], 0)
  tb(4.35, 56.0, 56.8, 0.2)
  tb(3.3, 56.8, 63.2, 0.15, null)                    // lantern
  for (const [a, b] of [[[-3.3, TY - 3.3], [3.3, TY - 3.3]], [[3.3, TY - 3.3], [3.3, TY + 3.3]], [[3.3, TY + 3.3], [-3.3, TY + 3.3]], [[-3.3, TY + 3.3], [-3.3, TY - 3.3]]] as [XY, XY][])
    windows(a, b, 1, [{ z0: 58.0, z1: 61.8, w: 1.6, arch: true }], 0)
  tb(3.75, 63.2, 64.0, 0.2)
  // Dome: copper-red, eight green ribs; spire.
  const prof: [number, number][] = [[2.95, 64.0], [2.95, 64.4], [2.88, 65.3], [2.65, 66.4], [2.25, 67.4], [1.65, 68.3], [0.9, 68.95], [0.45, 69.2]]
  smooth(dome, (q) => lathe(q, prof, 14, 0, TY, true), 60)
  for (let k = 0; k < 8; k++) {
    const a = (k * TAU) / 8 + TAU / 32, ca = Math.cos(a), sa = Math.sin(a)
    const secs: V3[][] = prof.slice(1).map(([r, z], i, arr) => {
      const next = arr[Math.min(i + 1, arr.length - 1)], prev = arr[Math.max(i - 1, 0)]
      const dr = next[0] - prev[0], dz = next[1] - prev[1], l = Math.hypot(dr, dz) || 1
      const nr = dz / l, nz = -dr / l                // outward normal in (r, z)
      const w = 0.16, o1 = 0.11
      const at = (off: number, side: number): V3 => [(r + nr * off) * ca - side * sa * w, TY + (r + nr * off) * sa + side * ca * w, z + nz * off]
      return [at(-0.05, -1), at(-0.05, 1), at(o1, 1), at(o1, -1)]
    })
    smooth(bronze, (q) => {
      for (let i = 0; i < secs.length - 1; i++) {
        const A = secs[i], B = secs[i + 1]
        const ctr = [...A, ...B].reduce((m, v) => [m[0] + v[0] / 8, m[1] + v[1] / 8, m[2] + v[2] / 8] as V3, [0, 0, 0] as V3)
        face(q, A[3], A[2], B[2], B[3], ctr)
        face(q, A[0], A[3], B[3], B[0], ctr)
        face(q, A[1], A[2], B[2], B[1], ctr)
      }
    }, 50)
  }
  smooth(bronze, (q) => lathe(q, [[0.5, 69.1], [0.5, 69.9], [0.62, 70.0], [0.4, 70.5], [0.32, 71.3], [0.42, 71.6], [0.3, 71.9], [0.04, 75.3]], 8, 0, TY, false), 50)

  // --- The two quadrigas, Victory and Progress, flanking the tower's front. ---
  for (const s of [-1, 1]) {
    const cx = s * 10.5, cy = -21.5
    box(sand, cx - 2.4, cy - 1.4, cx + 2.4, cy + 1.4, Z_ATTIC - 0.3, 30.3, 0.15)
    quadriga(bronze, [cx, cy, 30.3], s > 0 ? 0 : Math.PI)
  }

  const flood = (_p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.15 : 0.85)
  finishModel('Wayne County Building', 'det-wayne-county-building', [
    { part: granite, material: { name: 'granite', color: 0xebe8e0, roughness: 0.85, floodlight: flood } },
    { part: sand, material: { name: 'sandstone', color: 0xe0d4ba, roughness: 0.85, floodlight: flood } },
    { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: glass, material: { name: 'glass', color: 0x93a9b8, roughness: 0.24 } },
    { part: dome, material: { name: 'copper-dome', color: 0xc98c6e, roughness: 0.6 } },
    { part: bronze, material: { name: 'bronze-patina', color: 0x82aa9a, roughness: 0.6 } },
  ], { bearing: 59.8, osm: 'way/656595907', height: 75.3 }, 6500)
}

/** A standing draped figure, `h` tall, feet at `c`, facing `yaw` (radians from +x). */
function figure(p: Part, c: V3, h: number, yaw: number) {
  const f: V3 = [Math.cos(yaw), Math.sin(yaw), 0], s: V3 = [-f[1], f[0], 0]
  const at = (a: number, b: number, z: number): V3 => [c[0] + (f[0] * a + s[0] * b) * h, c[1] + (f[1] * a + s[1] * b) * h, c[2] + z * h]
  const ring = (z: number, r: number) => Array.from({ length: 6 }, (_, i): V3 => at(r * Math.cos((i * TAU) / 6), r * 0.85 * Math.sin((i * TAU) / 6), z))
  smooth(p, (q) => {
    solid(q, [ring(0, 0.17), ring(0.45, 0.14), ring(0.72, 0.13), ring(0.8, 0.07)])
    ellipsoid(q, at(0, 0, 0.88), [0.075 * h, 0.075 * h, 0.09 * h], 5, 3)
    tube(q, [at(0, 0.12, 0.74), at(0.15, 0.2, 0.62), at(0.2, 0.14, 0.5)], [0.045 * h, 0.04 * h, 0.035 * h], 4)
  }, 95)
}

/** A quadriga: four horses abreast rearing toward `yaw`, a chariot and a standing Victory behind them. */
function quadriga(p: Part, c: V3, yaw: number) {
  const f: V3 = [Math.cos(yaw), Math.sin(yaw), 0], sd: V3 = [-f[1], f[0], 0]
  // Drawn 1.2x: the lidar puts the groups' tops ~6.3 m over their pedestals (the standard is cut short to stay there), and at map
  // distance the horses need the bulk to read.
  const K = 1.5
  const at = (a: number, b: number, z: number): V3 => [c[0] + (f[0] * a + sd[0] * b) * K, c[1] + (f[1] * a + sd[1] * b) * K, c[2] + z * K]
  smooth(p, (q) => {
    // Chariot: a rounded car behind the team.
    solid(q, [0, 1].map((k) => Array.from({ length: 8 }, (_, i): V3 => {
      const t = (i * TAU) / 8
      return at(-1.0 + 0.55 * Math.cos(t), 0.85 * Math.sin(t), k ? 1.4 : 0.15)
    })))
    // Victory standing in the car, one arm raised with a standard.
    const zf = 1.0
    solid(q, [[0, 0.25], [1.3, 0.24], [2.3, 0.2], [2.7, 0.1]].map(([z, r]) => Array.from({ length: 6 }, (_, i): V3 => at(-1.05 + r * Math.cos((i * TAU) / 6), r * Math.sin((i * TAU) / 6), zf + z))))
    ellipsoid(q, at(-1.05, 0, zf + 2.95), [0.18, 0.18, 0.22], 6, 3)
    tube(q, [at(-1.0, -0.22, zf + 2.45), at(-0.85, -0.35, zf + 3.1), at(-0.75, -0.35, zf + 3.6)], [0.1, 0.09, 0.08], 4)
    tube(q, [at(-0.75, -0.36, zf + 2.3), at(-0.75, -0.36, zf + 4.0)], [0.06, 0.06], 4)          // standard
    ellipsoid(q, at(-1.25, 0.2, zf + 2.4), [0.4, 0.14, 0.7], 6, 3)                               // wing / drapery
    // Four horses abreast, forelegs raised.
    for (const b of [-1.05, -0.35, 0.35, 1.05]) {
      const H = (a: number, z: number, side = 0): V3 => at(a, b + side, z)
      tube(q, [H(-0.35, 1.45), H(0.5, 1.7), H(1.3, 2.05)], [0.27, 0.4, 0.3], 5)
      tube(q, [H(1.2, 2.05), H(1.5, 2.7), H(1.75, 2.95)], [0.24, 0.17, 0.13], 4)              // neck rising
      tube(q, [H(1.7, 3.0), H(2.15, 2.7)], [0.14, 0.09], 4)                          // head, nose down
      tube(q, [H(1.1, 1.8), H(1.45, 1.55), H(1.4, 1.1)], [0.16, 0.13, 0.11], 4)   // forelegs raised, bent (the pair as one)
      tube(q, [H(0.0, 1.5), H(-0.1, 0.8), H(0.0, 0.0)], [0.18, 0.14, 0.12], 4)    // hind legs planted
    }
  }, 95)
}

if (import.meta.main) build()
