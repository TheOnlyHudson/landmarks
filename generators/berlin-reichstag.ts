/**
 * Reichstagsgebäude, Platz der Republik, Berlin (Paul Wallot, 1884-1894;
 * rebuilt by Foster + Partners 1995-1999 with the glass dome): original
 * procedural geometry, CC0-1.0.
 * bun generators/berlin-reichstag.ts → models/berlin-reichstag.glb (low, 6500
 * budget, 250 KB) and models/berlin-reichstag.detail.glb (detail, detailZoom 17).
 *
 * Levels of detail. The detail model draws the engaged Corinthian columns
 * round with their capitals, the window sills, hoods and surrounds, the
 * base-storey windows, the finials, the courtyard windows and the dome's 24
 * ribs and 5 rings. The low model keeps every mass, tower, window opening,
 * the portico and the dome, and draws the columns as pale pilaster strips,
 * the dome with 12 ribs and 2 rings, to stay under 250 KB.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the OSM outline is
 * square to true north). Origin = the middle of the OSM outline
 * relation/2201742 (x -52.0..51.9, y -74.9..62.0 about its search centre),
 * which is also, within half a metre, the centre of the dome
 * (way/120824761). z = 0 the ground, 33.65 m NHN (Berlin LoD2); the site is
 * flat (Platz der Republik 33.61, the east side 33.69).
 *
 * What makes it the Reichstag, and how each is drawn
 * - Foster's glass dome on the roof, centred on the building: a translucent
 *   glass shell (40 m across, to 47.5 m) with its steel ribs and rings, and
 *   inside it the mirrored cone rising from the plenary chamber and the two
 *   spiral ramps. The cone and ramps are a `window` material, so the dome
 *   glows from inside at night while the glass itself stays dark.
 * - The four square corner towers, rising a stage and a half over the roof
 *   (a plain lower stage, the upper stage with three arched windows a face,
 *   a heavy cornice and parapet to 41.4 m).
 * - The west portico: six Corinthian columns on the podium over the broad
 *   stair, the entablature with "DEM DEUTSCHEN VOLKE" (a pale inscription
 *   band; no letters at map size), the pediment to 35 m and the two
 *   pinnacled turrets on the risalit corners behind it, the glazed entrance
 *   between the columns.
 * - The Neo-Renaissance sandstone walls: a rusticated base storey, then the
 *   colossal order of engaged Corinthian columns framing two window rows
 *   (round-headed below, pedimented rectangles above), the entablature,
 *   cornice and balustrade with its finials; the corner pavilions' big
 *   arched windows; the east front's three-arched entrance with its raised
 *   attic; the low pediments over the north and south centres.
 *
 * Sources
 * - OSM relation/2201742 (Reichstagsgebäude, building=government, height 48,
 *   two inner courtyards) and relation/8990774 (its building:part, height
 *   25); the corner towers way/120824755, 756, 765, 767 (25-41 m, 14.4 m
 *   square) with their caps way/120824753, 757, 764, 768 (41-42 m); the
 *   dome way/120824761 (25-48 m, 37.5 m across). (c) OpenStreetMap
 *   contributors, ODbL.
 * - Berlin LoD2 3D building model (Geoportal Berlin / gdi.berlin.de, tile
 *   LoD2_389_5819, Datenlizenz Deutschland Zero 2.0): ground 33.61-33.69 m
 *   NHN, main roof 61.74 m NHN (28.1 m above the ground: the balustrade
 *   line), the portico pediment from 28.5 to 35.0 m. LoD2 leaves out the
 *   towers and the dome.
 * - Wikipedia (de) "Reichstagsgebäude": 137 x 104 m; the inscription "Dem
 *   deutschen Volke" on the west portico's architrave, 60 cm letters
 *   (1916); roof terrace at 24 m; Wikipedia (en) "Reichstag dome": 40 m
 *   across, 23.5 m high, the mirrored cone and two spiral ramps.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Berlin Reichstag BW 2.jpg", Berthold Werner, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin_Reichstag_BW_2.jpg
 *     (west front, level, from far: every height on the west front, scaled
 *     at 7.0 px/m from the 137 m width);
 *   "Reichstagsgebäude von Westen.jpg", Jörg Braukmann, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Reichstagsgeb%C3%A4ude_von_Westen.jpg
 *   "Bundestag Berlin Deutschland Reichstagsgebäude - 04.jpg", Norbert Nagel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Bundestag_Berlin_Deutschland_Reichstagsgeb%C3%A4ude_-_04.jpg
 *     (west front: bay counts, the pavilion fronts);
 *   "Berlin, Reichstagsgebäude -- 2019 -- 6314.jpg", Dietmar Rabich, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Reichstagsgeb%C3%A4ude_--_2019_--_6314.jpg
 *     (the portico straight on: six columns, the glazed entrance, the
 *     turrets, the stair);
 *   "Reichstag Ostseite-2.jpg", Arnoldius, CC BY-SA 2.0 de,
 *     https://commons.wikimedia.org/wiki/File:Reichstag_Ostseite-2.jpg
 *     (east front: the three arches, the raised attic);
 *   "Berlin Reichstag vom Kollhoff-Tower (S01 0846).jpg", Michael.F.H.Barth, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin_Reichstag_vom_Kollhoff-Tower_(S01_0846).jpg
 *     (from above, south: the dome's profile, the roof, the south centre);
 *   "Reichstag tower - Berlin.jpg", MrPanyGoff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Reichstag_tower_-_Berlin.jpg
 *     (a corner tower's stages);
 *   "Reichstag 2015 01.jpg", Perituss, CC0,
 *     https://commons.wikimedia.org/wiki/File:Reichstag_2015_01.jpg
 *   "Regierungsviertel, Berlin-Mitte, 170325, ako.jpg", Ansgar Koreng, CC BY-SA 3.0 de,
 *     https://commons.wikimedia.org/wiki/File:Regierungsviertel,_Berlin-Mitte,_170325,_ako.jpg
 *     (night, from the north-east: floodlit stone, lit windows, the dome
 *     glowing).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - OSM: the plan (main walls x +-43.1, y +-64.45; corner pavilions 18 m
 *   square about (+-35.65, +-56.75) with 12.3 m projecting bays; the west
 *   risalit and portico; the east projection; the courtyards), the tower
 *   top 41, the dome footprint.
 * - LoD2: balustrade line 28.1, pediment 28.5-35.0.
 * - Published: dome 40 m across, 23.5 m high (top 47.5 on a 24 m roof).
 * - Estimated from BW 2 (scaled): base storey 5.6, columns to 21.6,
 *   capitals to 23.1, cornice 26.0, balustrade to 27.7; tower stages 26-31.8
 *   and 31.8-39.6, cornice to 40.5, parapet 41.4; portico columns 4.7-22.8;
 *   the turrets to 43; the east attic to 33.5 (from Ostseite-2); the
 *   windows (arched 5.9-14.6 and 2.9 m wide, upper 16.4-20.3); the dome
 *   from the roof at 26.5 to 47.7, upright at the foot (Kollhoff view).
 * - Invented: the courtyard elevations (generic windows; no photo), the
 *   ramps' pitch, the cone's size, the low pediments' pitch on the north
 *   and south centres.
 *
 * Doubts
 * - The north and south fronts are drawn alike from the south view only.
 * - The tower caps OSM tags as low domes (41-42 m) read flat in the photos;
 *   drawn flat.
 * - The stair in front of the portico runs west past the OSM outline, as it
 *   does on the ground. Its foot is the lowest ground in the map's terrain
 *   (Mapterhorn reads the rest of the site 1.0-1.4 m higher), so the map
 *   sinks the east, north and south bases by up to 1.4 m; the base storey
 *   is 5.6 m, so the main floors are unaffected. `terrain.ts check` passes.
 * - The column heights and the window sizes are read from two level photos
 *   taken from far off; a metre either way is possible.
 * - The relief bays of the portico are drawn in the roof grey, as the
 *   photos read them in shadow.
 */
import { Part, type V3 } from './mesh'
import { lathe, smooth, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox, panel, archPanel, proud, pediment, faceAt, type Face } from './london-buckingham-palace'
import { massing, facade, type XY } from './nyc-570-lexington'

export const BEARING = 0

let stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part(), glow = new Part()
/** Detail model (true) or the low model (false). */
let D = true

const ZB = 5.6 // top of the rusticated base
const ZK = 21.6, ZC = 23.1, ZR = 26.0, ZBal = 27.7 // capitals, entablature, roof line, balustrade

// ===== Small face kit =======================================================
/** Faces, counter-clockwise ring order (outward on the right of a→b). */
const west = (x: number, y0: number, y1: number): Face => ({ a: [x, y1], b: [x, y0] })
const east = (x: number, y0: number, y1: number): Face => ({ a: [x, y0], b: [x, y1] })
const north = (y: number, x0: number, x1: number): Face => ({ a: [x1, y], b: [x0, y] })
const south = (y: number, x0: number, x1: number): Face => ({ a: [x0, y], b: [x1, y] })
const flen = (f: Face) => Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])

/** An engaged half-column on a face at s, smooth-shaded, z0..z1. */
function halfColumn(p: Part, f: Face, s: number, z0: number, z1: number, r: number, n = 4) {
  const L = flen(f), ux = (f.b[0] - f.a[0]) / L, uy = (f.b[1] - f.a[1]) / L
  const out: V3 = [uy, -ux, 0]
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI * i / n, t1 = Math.PI * (i + 1) / n
    const P = (t: number, z: number) => faceAt(f, s - r * Math.cos(t), z, r * Math.sin(t))
    const N = (t: number): V3 => [-Math.cos(t) * ux + Math.sin(t) * out[0], -Math.cos(t) * uy + Math.sin(t) * out[1], 0]
    const a = P(t0, z0), b = P(t1, z0), c = P(t1, z1), d = P(t0, z1)
    p.tri(a, b, c, undefined, undefined, undefined, [N(t0), N(t1), N(t1)])
    p.tri(a, c, d, undefined, undefined, undefined, [N(t0), N(t1), N(t0)])
  }
}
/** An engaged column with its capital (detail), or a pale pilaster strip (low). */
function col(f: Face, s: number, z0: number, r: number, zc = ZC) {
  if (!D) return panel(trim, f, s - r * 0.9, s + r * 0.9, z0, zc, r * 0.5)
  halfColumn(stone, f, s, z0, ZK, r)
  proud(trim, f, s - r - 0.25, s + r + 0.25, ZK, zc, 0, r + 0.25, { top: false })
}
/** The kit's pediment, closed at the back (the gable end over the roof). */
function ped(f: Face, s0: number, s1: number, z0: number, h: number, d0: number, d1: number) {
  pediment(stone, roof, f, s0, s1, z0, h, d0, d1)
  stone.tri(faceAt(f, s1, z0, d0), faceAt(f, s0, z0, d0), faceAt(f, (s0 + s1) / 2, z0 + h, d0))
}
/** A small triangular hood on a face (window pediment). */
function hood(p: Part, f: Face, s: number, w: number, z: number, h: number, d: number) {
  const A = faceAt(f, s - w / 2, z, d), B = faceAt(f, s + w / 2, z, d), C = faceAt(f, s, z + h, d)
  p.tri(A, B, C)
  p.quad(faceAt(f, s - w / 2, z - 0.3, d), faceAt(f, s + w / 2, z - 0.3, d), B, A)
}
/** The rusticated base storey and its top band, with a small window per bay. */
function base(f: Face, s0: number, s1: number, bays: number[] = []) {
  proud(stone, f, s0, s1, 0, ZB - 0.3, 0, 0.3, { top: !D })
  if (D) proud(trim, f, s0 - 0.1, s1 + 0.1, ZB - 0.3, ZB + 0.1, 0, 0.5)
  if (D) for (const s of bays) panel(win, f, s - 0.75, s + 0.75, 1.3, 3.6, 0.36)
}
/** Entablature, cornice and (optionally) the balustrade along a run. */
function crown(f: Face, s0: number, s1: number, bal = true, z0 = ZC, z1 = ZR) {
  if (D) proud(trim, f, s0, s1, z0, z1 - 1.1, 0, 0.55, { top: false, bottom: true })
  proud(trim, f, s0 - 0.2, s1 + 0.2, z1 - 1.1, z1, 0, 1.15, { bottom: true })
  // The balustrade, as one band on the cornice.
  if (bal) proud(trim, f, s0, s1, z1, ZBal, -0.4, 0.15)
}
/**
 * A run of the colossal order: n bays between n + 1 engaged columns, each
 * bay a round-headed window over the base and a pedimented window above.
 */
function order(f: Face, s0: number, s1: number, n: number, o: { bal?: boolean; finials?: boolean } = {}) {
  const pitch = (s1 - s0) / n
  const mids = Array.from({ length: n }, (_, i) => s0 + pitch * (i + 0.5))
  base(f, s0, s1, mids)
  for (let i = 0; i <= n; i++) {
    const s = s0 + pitch * i
    col(f, s, ZB + 0.1, 0.75)
    if (D && o.finials !== false && o.bal !== false) {
      // Finials over the columns, as the photos show along the roof line.
      const c = faceAt(f, s, ZBal, -0.1)
      lathe(trim, [[0.5, ZBal], [0.02, ZBal + 2.0]], 4, c[0], c[1], false)
    }
  }
  for (const s of mids) {
    archPanel(win, f, s, 2.9, 5.9, 13.15, 0.08, D ? 6 : 4)
    if (D) panel(trim, f, s - 1.5, s + 1.5, 15.9, 16.4, 0.05) // sill
    panel(win, f, s - 1.1, s + 1.1, 16.4, 20.3, 0.06)
    if (D) hood(trim, f, s, 2.9, 20.55, 0.9, 0.12)
  }
  crown(f, s0, s1, o.bal !== false)
}

function build(detail: boolean) {
D = detail
stone = new Part(); trim = new Part(); win = new Part(); roof = new Part(); glass = new Part(); glow = new Part()
// ===== The plan =============================================================
const XW = 43.1, YN = 64.45
const PX = 35.65, PY = 56.75, PH = 9.0, PJ = 6.15, PO = 2.4 // pavilion centre, core half, projection half, projection depth
const CX = 14.1, CY0 = 25.8, CY1 = 41.25 // courtyards

const boxes: [number, number, number, number, number][] = [
  [-XW, -YN, -CX, YN, ZR], [CX, -YN, XW, YN, ZR],
  [-CX, -YN, CX, -CY1, ZR], [-CX, -CY0, CX, CY0, ZR], [-CX, CY1, CX, YN, ZR],
  [-CX, CY0, CX, CY1, 4], [-CX, -CY1, CX, -CY0, 4], // courtyard floors
  [-45.1, -19.35, -XW, 19.35, ZR], // west risalit
  [XW, -14.45, 51.95, 14.45, ZR], // east projection
  [-9.5, YN, 9.5, YN + 1.3, ZR], [-9.5, -YN - 1.3, 9.5, -YN, ZR], // north and south centres
]
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const cx = sx * PX, cy = sy * PY
  boxes.push([cx - PH, cy - PH, cx + PH, cy + PH, ZR])
  // The projecting bays on the two outer faces.
  const ox = sx > 0 ? [cx + PH, cx + PH + PO] : [cx - PH - PO, cx - PH]
  boxes.push([ox[0], cy - PJ, ox[1], cy + PJ, ZR])
  const oy = sy > 0 ? [cy + PH, cy + PH + PO] : [cy - PH - PO, cy - PH]
  boxes.push([cx - PJ, oy[0], cx + PJ, oy[1], ZR])
  // The tower: a plain lower stage and the arcaded upper stage.
  boxes.push([cx - 7.8, cy - 7.8, cx + 7.8, cy + 7.8, 31.8])
  boxes.push([cx - 7.2, cy - 7.2, cx + 7.2, cy + 7.2, 39.6])
}
massing({ wall: stone, win: null, roof, coping: trim, boxes, facade: null, bevel: 0.3 })

// ===== Courtyard elevations (generic) ======================================
{
  const fc = { bay: 3.6, ratio: 0.45, floor: 4.2, group: 2, spandrel: 1.2, sill: 2.0, head: 2.5, minLength: 4 }
  for (const sy of [-1, 1]) {
    const y0 = sy > 0 ? CY0 : -CY1, y1 = sy > 0 ? CY1 : -CY0
    // Walls facing into the court: counter-clockwise round the court seen from inside.
    const ring: XY[] = [[-CX, y0], [-CX, y1], [CX, y1], [CX, y0]]
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      const tmp = new Part()
      if (D) facade(tmp, win, a, b, 4, ZR, fc)
    }
  }
}

// ===== Main fronts ==========================================================
// West: five bays each side between the pavilions and the risalit.
order(west(-XW, 19.35, PY - PH), 0, PY - PH - 19.35, 5)
order(west(-XW, -(PY - PH), -19.35), 0, PY - PH - 19.35, 5)
// East: six bays each side of the projection.
order(east(XW, 14.45, PY - PH), 0, PY - PH - 14.45, 6)
order(east(XW, -(PY - PH), -14.45), 0, PY - PH - 14.45, 6)
// North and south: three bays each side of the centre.
for (const [f0, f1] of [
  [north(YN, 9.5, PX - PH), north(YN, -(PX - PH), -9.5)],
  [south(-YN, 9.5, PX - PH), south(-YN, -(PX - PH), -9.5)],
]) {
  order(f0, 0, PX - PH - 9.5, 3)
  order(f1, 0, PX - PH - 9.5, 3)
}
// North and south centres: three bays, the middle one a tall arched entrance
// under a triple window, a low pediment over the cornice.
for (const f of [north(YN + 1.3, -9.5, 9.5), south(-YN - 1.3, -9.5, 9.5)]) {
  const L = 19
  base(f, 0, L, [2.5, L - 2.5])
  for (const s of [0, L / 3, (2 * L) / 3, L]) {
    col(f, s === 0 ? 0.8 : s === L ? L - 0.8 : s, ZB + 0.1, 0.8)
  }
  archPanel(trim, f, L / 2, 4.4, 0.1, 6.0, 0.35, 8)
  archPanel(win, f, L / 2, 3.6, 0.1, 6.0, 0.4, 8)
  for (const s of [L / 6, (5 * L) / 6]) archPanel(win, f, s, 2.9, 5.9, 13.15, 0.08, D ? 6 : 4)
  for (const k of [-1, 0, 1]) panel(win, f, L / 2 + k * 1.55 - 0.65, L / 2 + k * 1.55 + 0.65, 13.2, 19.6, 0.06)
  for (const s of [L / 6, (5 * L) / 6]) { panel(win, f, s - 1.1, s + 1.1, 16.4, 20.3, 0.06); if (D) hood(trim, f, s, 2.9, 20.55, 0.9, 0.12) }
  crown(f, 0, L, false)
  ped(f, 0.5, L - 0.5, ZR, 4.0, -4.0, 0.4)
}

// ===== Corner pavilions and towers ==========================================
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const cx = sx * PX, cy = sy * PY
  const xo = cx + sx * (PH + PO), yo = cy + sy * (PH + PO)
  // The two projecting bays: paired engaged columns, the aedicule window
  // over the base and the big arched window above.
  const fx = sx > 0 ? east(xo, cy - PJ, cy + PJ) : west(xo, cy - PJ, cy + PJ)
  const fy = sy > 0 ? north(yo, cx - PJ, cx + PJ) : south(yo, cx - PJ, cx + PJ)
  for (const f of [fx, fy]) {
    const L = 2 * PJ, m = L / 2
    base(f, 0, L, [m])
    for (const s of [0.9, 2.6, L - 2.6, L - 0.9]) {
      col(f, s, ZB + 0.1, 0.75)
    }
    if (D) archPanel(trim, f, m, 4.2, 14.0, 18.6, 0.04, 8)
    archPanel(win, f, m, 3.6, 14.3, 18.6, 0.08, D ? 8 : 6)
    if (D) panel(trim, f, m - 1.8, m + 1.8, ZB + 0.6, 12.0, 0.08)
    panel(win, f, m - 1.2, m + 1.2, ZB + 1.0, 11.0, 0.12)
    if (D) hood(trim, f, m, 4.0, 12.3, 1.2, 0.12)
    crown(f, 0, L, false)
  }
  // The plain core faces either side of each projection: base band and crown.
  const coreFaces: [Face, number, number][] = []
  {
    const x0 = cx - PH, x1 = cx + PH, y0 = cy - PH, y1 = cy + PH
    const xf = sx > 0 ? x1 : x0, yf = sy > 0 ? y1 : y0
    const fX = sx > 0 ? east(xf, y0, y1) : west(xf, y0, y1)
    const fY = sy > 0 ? north(yf, x0, x1) : south(yf, x0, x1)
    // s ranges along each 18 m face that are outside the projection.
    const L = 2 * PH, a = PH - PJ
    coreFaces.push([fX, 0, a], [fX, L - a, L], [fY, 0, a], [fY, L - a, L])
  }
  for (const [f, s0, s1] of coreFaces) base(f, s0, s1)
  // Tower: lower stage cornice band, statues' pedestals on the corners,
  // the upper stage with its arcade of three arched windows a face, the
  // heavy cornice and the parapet.
  cbox(trim, cx - 8.1, cy - 8.1, cx + 8.1, cy + 8.1, 31.3, 31.8, D ? 0.2 : 0)
  for (const [ax, ay] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + ax * 8.4, py = cy + ay * 8.4
    box(stone, px - 1.0, py - 1.0, px + 1.0, py + 1.0, ZR, 28.2)
    lathe(trim, [[0.6, 28.2], [0.45, 30.4], [0.02, 31.4]], 4, px, py, false) // statue, abstracted
  }
  const up = [
    east(cx + 7.2, cy - 7.2, cy + 7.2), north(cy + 7.2, cx - 7.2, cx + 7.2),
    west(cx - 7.2, cy - 7.2, cy + 7.2), south(cy - 7.2, cx - 7.2, cx + 7.2),
  ]
  for (const f of up) {
    for (const s of [3.6, 7.2, 10.8]) {
      archPanel(win, f, s, 2.0, 33.4, 37.0, 0.06, 4)
    }
  }
  cbox(trim, cx - 7.7, cy - 7.7, cx + 7.7, cy + 7.7, 39.0, 40.5, D ? 0.3 : 0)
  box(stone, cx - 7.3, cy - 7.3, cx + 7.3, cy + 7.3, 40.5, 41.4) // parapet, read solid
}

// ===== West portico =========================================================
{
  const XF = -51.95, XR = -45.1, YP = 15.75, ZP = 4.7, ZPE = 22.8
  // Podium and the broad stair down to the square, with cheek walls.
  cbox(stone, XF, -YP, XR, YP, 0, ZP, 0.2)
  const nS = D ? 8 : 4, run = 7.2 / nS
  for (let k = 0; k < nS; k++) {
    const x0 = XF - run * (nS - k), z1 = ZP * (k + 1) / (nS + 1)
    box(stone, x0, -13.0, XF, 13.0, 0, z1)
  }
  for (const s of [-1, 1]) cbox(stone, XF - run * nS - 0.6, s > 0 ? 13.0 : -15.6, XF + 0.2, s > 0 ? 15.6 : -13.0, 0, 2.6, 0.2)
  // Six Corinthian columns on the podium edge.
  const ys = [-13.2, -8.0, -2.85, 2.85, 8.0, 13.2], xc = XF + 1.6
  for (const y of ys) {
    box(stone, xc - 1.2, y - 1.2, xc + 1.2, y + 1.2, ZP, ZP + 0.8)
    smooth(stone, (q) => lathe(q, [[1.0, ZP + 0.8], [0.82, 20.9]], 8, xc, y, false), 50)
    smooth(trim, (q) => lathe(q, [[0.82, 20.9], [1.25, 22.3]], 8, xc, y, false), 50)
    box(trim, xc - 1.3, y - 1.3, xc + 1.3, y + 1.3, 22.3, ZPE)
  }
  // The back wall: the glazed entrance in the middle three bays, plain
  // wall with the arms reliefs (flush panels) to either side, pilasters.
  const fb = west(XR, -YP, YP), L = 2 * YP
  panel(win, fb, YP - 7.6, YP + 7.6, ZP, 20.0, 0.06)
  for (const s of [YP - 10.4, YP + 10.4]) panel(roof, fb, s - 1.9, s + 1.9, ZP + 0.5, 20.0, 0.04)
  for (const s of [0.9, L - 0.9]) col(fb, s, ZP, 0.8, ZPE)
  // Entablature on the columns, the inscription band, the cornice.
  cbox(trim, XF + 0.3, -YP - 0.2, XR, YP + 0.2, ZPE, ZPE + 0.5, 0.15)
  cbox(stone, XF + 0.3, -YP - 0.1, XR, YP + 0.1, ZPE + 0.5, ZR - 1.0, 0.15)
  // "DEM DEUTSCHEN VOLKE": the pale panel the bronze letters sit on.
  {
    const fi = west(XF + 0.3, -YP, YP)
    panel(trim, fi, YP - 9.0, YP + 9.0, ZPE + 0.75, ZPE + 2.0, 0.08)
    // The letters, read as a dark line at this size: a thin bronze strip.
    panel(roof, fi, YP - 7.8, YP + 7.8, ZPE + 1.2, ZPE + 1.6, 0.11)
  }
  cbox(trim, XF - 0.3, -YP - 0.7, XR + 0.2, YP + 0.7, ZR - 1.0, ZR, 0.2)
  // The pediment, to 35.0 (LoD2), and its raking roof carried back to the risalit.
  ped(west(XR, -YP - 0.6, YP + 0.6), 0, L + 1.2, ZR, 9.0, -6.0, -XF + XR + 0.3)
  // The ceiling of the portico.
  trim.quad([XF + 0.3, YP, ZPE], [XR, YP, ZPE], [XR, -YP, ZPE], [XF + 0.3, -YP, ZPE])
  // The risalit faces either side of the portico, and its crown.
  for (const s of [-1, 1]) {
    const f = west(XR, s > 0 ? YP : -19.35, s > 0 ? 19.35 : -YP)
    base(f, 0, 3.6)
    crown(f, 0, 3.6, false)
  }
  // The two turrets on the risalit corners: a pier, then the pinnacle.
  for (const s of [-1, 1]) {
    const tx = -44.3, ty = s * 17.4
    box(stone, tx - 2.2, ty - 2.2, tx + 2.2, ty + 2.2, ZR, 32.6)
    box(trim, tx - 2.5, ty - 2.5, tx + 2.5, ty + 2.5, 32.6, 33.4)
    box(stone, tx - 1.6, ty - 1.6, tx + 1.6, ty + 1.6, 33.4, 36.6)
    box(trim, tx - 1.85, ty - 1.85, tx + 1.85, ty + 1.85, 36.6, 37.1)
    lathe(stone, [[1.45, 37.1], [1.3, 38.6], [0.8, 40.4], [0.45, 41.6], [0.05, 43.0]], D ? 8 : 6, tx, ty, false)
  }
}

// ===== East front: the three-arched entrance and the raised attic ===========
{
  const f = east(51.95, -14.45, 14.45), L = 28.9
  base(f, 0, L)
  for (const s of [0.9, L / 3 - 0.3, (2 * L) / 3 + 0.3, L - 0.9]) {
    col(f, s, ZB + 0.1, 0.85)
  }
  for (const k of [0, 1, 2]) {
    const s = L / 6 + (k * L) / 3
    archPanel(trim, f, s, 5.6, 0.1, 9.0, 0.4, 8)
    archPanel(win, f, s, 4.6, 0.1, 9.0, 0.46, 8)
    for (const j of [-1, 0, 1]) panel(win, f, s + j * 1.3 - 0.5, s + j * 1.3 + 0.5, 14.5, 20.0, 0.06)
  }
  crown(f, 0, L, false)
  for (const g of [north(14.45, XW, 51.95), south(-14.45, XW, 51.95)]) { base(g, 0, 8.85); crown(g, 0, 8.85, false) }
  // The attic block over the entrance, with its cornice.
  cbox(stone, 44.2, -13.8, 51.4, 13.8, ZR, 32.8, 0.2)
  cbox(trim, 43.9, -14.1, 51.7, 14.1, 32.8, 33.5, 0.2)
}

// ===== The dome =============================================================
{
  // The drum it stands on, over the plenary chamber.
  const nR = 24
  lathe(roof, [[21.0, ZR - 0.5], [21.0, ZR + 0.4], [20.0, ZR + 0.5]], nR, 0, 0, true)
  // The glass shell: near-upright at the foot, a rounded crown, the open
  // ring at the top.
  const prof: [number, number][] = [[20.0, ZR + 0.5], [19.9, 30.5], [19.4, 34.5], [18.1, 38.5], [15.8, 42.2], [12.2, 45.3], [7.2, 47.2], [4.2, 47.7]]
  lathe(glass, prof, nR, 0, 0, false)
  // The cap ring at the top (the vent).
  lathe(trim, [[4.6, 47.5], [4.6, 47.9], [3.6, 47.9]], nR, 0, 0, false)
  // Steel: the ribs and rings, as flat bands on the shell.
  const band = (p: Part, a: V3, b: V3, c: V3, d: V3, both = false) => { p.quad(a, b, c, d); if (both) p.quad(d, c, b, a) }
  const rAt = (z: number) => {
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      if (z <= z1) return r0 + (r1 - r0) * (z - z0) / (z1 - z0)
    }
    return prof[prof.length - 1][0]
  }
  const nRib = D ? 24 : 12, wR = 0.22
  for (let k = 0; k < nRib; k++) {
    const a = k * TAU / nRib, c = Math.cos(a), s = Math.sin(a)
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const o0 = r0 + 0.05, o1 = r1 + 0.05
      band(trim, [o0 * c + wR * s, o0 * s - wR * c, z0], [o0 * c - wR * s, o0 * s + wR * c, z0], [o1 * c - wR * s, o1 * s + wR * c, z1], [o1 * c + wR * s, o1 * s - wR * c, z1])
    }
  }
  for (const z of D ? [30.5, 34.5, 38.5, 42.2, 45.3] : [34.5, 42.2]) {
    const r = rAt(z) + 0.06
    for (let k = 0; k < nR; k++) {
      const a0 = k * TAU / nR, a1 = (k + 1) * TAU / nR
      band(trim, [r * Math.cos(a0), r * Math.sin(a0), z - 0.2], [r * Math.cos(a1), r * Math.sin(a1), z - 0.2], [r * Math.cos(a1), r * Math.sin(a1), z + 0.2], [r * Math.cos(a0), r * Math.sin(a0), z + 0.2])
    }
  }
  // Inside: the mirrored cone, narrow at the chamber ceiling, opening up
  // under the crown; drawn both sides.
  const cone = (r0: number, z0: number, r1: number, z1: number) => {
    const n = 16
    for (let k = 0; k < n; k++) {
      const a0 = k * TAU / n, a1 = (k + 1) * TAU / n
      band(glow, [r0 * Math.cos(a0), r0 * Math.sin(a0), z0], [r0 * Math.cos(a1), r0 * Math.sin(a1), z0], [r1 * Math.cos(a1), r1 * Math.sin(a1), z1], [r1 * Math.cos(a0), r1 * Math.sin(a0), z1])
    }
  }
  cone(2.5, ZR + 0.5, 4.5, 32.5)
  cone(4.5, 32.5, 10.0, 42.0)
  // The two spiral ramps, a turn and a half each, following the shell.
  for (const ph of [0, Math.PI]) {
    const n = D ? 40 : 24, turns = 1.5, w = 2.2
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n
      const z0 = 27.6 + 16.4 * t0, z1 = 27.6 + 16.4 * t1
      const a0 = ph + TAU * turns * t0, a1 = ph + TAU * turns * t1
      const ro0 = rAt(z0) - 0.4, ro1 = rAt(z1) - 0.4
      band(glow, [(ro0 - w) * Math.cos(a0), (ro0 - w) * Math.sin(a0), z0], [ro0 * Math.cos(a0), ro0 * Math.sin(a0), z0], [ro1 * Math.cos(a1), ro1 * Math.sin(a1), z1], [(ro1 - w) * Math.cos(a1), (ro1 - w) * Math.sin(a1), z1])
    }
  }
}

}

if (import.meta.main) {
  // Night: the stone is floodlit warm from the ground, fading up the towers;
  // tops barely lit.
  const lit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.2 : Math.max(0.35, 1 - Math.max(0, p[2] - 20) / 40))
  for (const [detail, file, max] of [[false, 'berlin-reichstag', 6500], [true, 'berlin-reichstag.detail', 40000]] as const) {
  build(detail)
  writeModel('Reichstag building', 'berlin-reichstag', [
    { part: stone, material: { name: 'reichstag-sandstone', color: 0xe2d8c4, roughness: 0.85, floodlight: lit } },
    { part: trim, material: { name: 'trim', color: 0xf2eadb, roughness: 0.85, floodlight: lit } },
    { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
    { part: glass, material: { name: 'glass', color: 0x9cc4d8, roughness: 0.2, opacity: 0.32, doubleSided: true } },
    { part: glow, material: { name: 'window-2', color: 0xb9c3c9, roughness: 0.3 } },
  ], { bearing: BEARING, osm: 'relation/2201742', height: 47.7 }, max, file)
  }
}
