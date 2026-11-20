/**
 * Severance Music Center (Severance Hall; Walker and Weeks, 1931), 11001
 * Euclid Avenue, University Circle, Cleveland: procedural, CC0-1.0.
 * bun generators/cle-severance-music-center.ts [out.glb]
 *
 * Frame: x, y, z metres, turned to bearing 16 (+y north-north-east to the
 * back, -y to the portico facing Euclid Avenue and East Boulevard), origin
 * at the OSM outline's area centroid (-81.6094087, 41.5064263). z = 0 is
 * the lowest ground under the footprint, the west and east lawns (lidar
 * 5.8 m over the box's lowest return); the front drive and terrace the
 * portico stands on is 3 m higher (lidar). elevation 0.
 *
 * Form: the Georgian-Neoclassical concert hall in buff sandstone: a
 * 16-sided drum over the auditorium rising in three stepped stages (main
 * wall and cornice, an attic band, two set-back blind stages) to a shallow
 * faceted roof; in front of it the portico, a rusticated ground storey with
 * three doors, a balustrade, six Ionic columns (pairs at the ends, two in
 * the middle) before a deep porch with the great arched window, and the
 * pediment; behind, the flat-roofed foyers and wings to the OSM outline,
 * the stage block with its low hip, and two low service wings.
 *
 * Sources
 * - OSM (ODbL): way/108400841 (building=public, Severance Music Center,
 *   wikidata Q7457831), the only building or part in the outline; replaced.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid read in this frame. Above z = 0: drum apex 28.7;
 *   drum stages about 18 (r 19.5), 24 (r 16.5), 27 (r 13); the drum centre
 *   at (-1, -19); portico pediment 21; foyer and wing roofs 18.7-19.3
 *   (drawn 17 + a 1 m parapet); stage block 24.2-26; low wings 4-5 m.
 * - USGS NAIP (public domain): the 16-sided drum and its faceted pale roof,
 *   the darker stage roof, the plan.
 * - Published: 1931, Walker and Weeks (Wikipedia, "Severance Hall"); the
 *   2000 renovation and Smith wing at the back (David M. Schwarz).
 * - Photos (EVIDENCE):
 *   - "Severance Hall (7811722938).jpg", Erik Drost, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall_(7811722938).jpg
 *     (the front: portico, drum stages, medallions)
 *   - "Severance Hall front, Cleveland, Ohio.jpg", Daderot, public domain,
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall_front,_Cleveland,_Ohio.jpg
 *   - "Severance Hall fall 03 (26885421223).jpg" and "fall 01
 *     (27492015985).jpg", Tim Evanson, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall_fall_03_(26885421223).jpg
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall_fall_01_(27492015985).jpg
 *     (the drum from the west, the side wing)
 *   - "Severance Hall (8330522447).jpg", Erik Drost, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall_(8330522447).jpg
 *     (from the south-east in snow: the long side and portico)
 *   - "Severance Hall (7811718950).jpg", Erik Drost, CC BY 2.0 (pediment),
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall_(7811718950).jpg
 *   - "Severance Hall.jpg", Greg, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Severance_Hall.jpg
 * Portico (rebuilt after review: the columns did not read). Scaled from the
 *   head-on photo "Severance Hall front" (Daderot, s1) and Erik Drost's
 *   7811718950 (s6), 0.032 m/px against the lidar pediment apex (21.6 over
 *   z = 0, terrace 3.0): ground storey cornice 7.1, pedestals and
 *   balustrade to 8.5, free-standing round columns (14 sides, r 0.6) 8.5 to
 *   16.3 at x = +-7.0, +-5.65, +-1.95 about the axis, entablature to 18.4
 *   (lidar eaves 18.1), pediment 21.6. Three doorways 2.0 x 3.4 m at +-3.9.
 *   The porch back wall stands 4.4 m behind the front, in a shaded-sandstone
 *   finish (the photos show the recess in shadow), with the great arched
 *   window (2.9 m wide, crown 14.9) and two tall windows; square antae at
 *   its back corners. Portico width 16.8 m and depth 5 m are lidar.
 * Estimated from the photos: the window sizes and rows, the attic band.
 * Left out: the pediment's sculpture and inscription, capital volutes (a
 *   block), the lamp standards, balusters (solid band), rooftop plant.
 * Doubts: the back (Smith wing) and the north faces are not photographed
 *   here; they are drawn with the same windows as the sides. The stage
 *   roof's hip is a guess at a shallow roof the lidar reads as flat-topped.
 * Night: windows glow; the portico, its shaded porch and the front drum
 *   are floodlit (_FLOODLIGHT, falling off upward). The doorways share the
 *   porch-shade finish (six materials), so they don't glow as `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, cornice, panel, column, gableY, rakingCornice } from './chi-field-museum'
import { archPanel, parapet, ringTop } from './cle-city-hall'
import { wallQuad, writeModel } from './cle-200-public-square'
import { ccw, finishGlb, outward } from './sea-columbia-center'

// Levels above the lowest ground under the footprint (the west and east
// lawns, lidar 5.8 m over the box's lowest return).
const PLAZA = 3.0 // the front terrace and drive the portico stands on
const BODY = 17.0 // flat roofs of the foyers and wings round the hall
const DRUM = [17.0, 23.8, 26.8] // the drum's three stepped stages
const APEX = 28.7 // top of the drum's shallow faceted roof
const AX = -1.0, CY = -19.0 // the drum's centre, on the building's axis
const R_DRUM = [19.6, 16.8, 13.2] // apothems of the 16-sided stages

/** A regular polygon with a flat face toward -y. */
function poly(cx: number, cy: number, apothem: number, n = 16): XY[] {
  const r = apothem / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 - Math.PI / n + (i * 2 * Math.PI) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), shade = new Part(), dome = new Part()

  // ---- the body: foyers, wings and the stage block round the drum (OSM outline, front cut at the drum)
  const MAIN: XY[] = ccw([[-19.2, -14.5], [-25.3, -0.9], [-26.1, 0.8], [-30.1, 10.4], [-28.4, 22.7], [-28.7, 23.4], [-21, 26.9], [-8.8, 32.3], [-8.9, 33.3], [12.4, 32.5], [12.6, 31.4], [19.4, 27.8], [31.0, 21.8], [29.9, 19.3], [29.5, 15], [29.3, 3.1], [24.1, -7.2], [19.4, -16.3]])
  const WEST: XY[] = ccw([[-30.1, 10.4], [-35.5, 8.3], [-36.0, 9.3], [-39.8, 18.0], [-28.4, 22.7]])
  const EAST: XY[] = ccw([[29.3, 3.1], [30.8, 6.0], [32.0, 5.4], [36.7, 14.5], [36.4, 16.1], [29.9, 19.3], [29.5, 15]])
  const LOW = 4.6 // the low service wings (lidar 4-5 m)

  const wallsLow = (p: Part, r: XY[], z0: number, z1: number) => { for (let i = 0; i < r.length; i++) wallQuad(p, r[i], r[(i + 1) % r.length], z0, z1) }
  for (const [r, h] of [[WEST, LOW], [EAST, LOW]] as [XY[], number][]) {
    wallsLow(stone, r, 0, h)
    cap(roof, r, h)
  }
  wallsLow(stone, MAIN, 0, BODY - 1.2)
  cornice(trim, MAIN, BODY - 1.2, BODY, 0.6)
  ringTop(roof, inset(MAIN, -0.24), MAIN, BODY)
  cap(roof, MAIN, BODY - 0.02)
  parapet(stone, MAIN, BODY, BODY + 1.0, 0.4)

  // Windows on the body: tall windows over short ones, a panel a bay.
  for (let i = 0; i < MAIN.length; i++) {
    const a = MAIN[i], b = MAIN[(i + 1) % MAIN.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = outward(a, b)
    // only the faces out to the lawns (not where the low wings or drum stand)
    if (L < 6) continue
    if (n[1] > 0.95 && a[1] > 30) continue // the plain back wall
    if (n[1] < -0.9) continue // the front edge, inside the drum
    const k = Math.floor((L - 2) / 5.2)
    const w = 1.8, gap = (L - k * w) / (k + 1)
    for (let j = 0; j < k; j++) {
      const s0 = gap + j * (w + gap)
      panel(win, a, b, s0, s0 + w, 6.0, 7.6, 0.06)
      archPanel(win, a, b, s0, s0 + w, 9.6, 14.6, 0.06)
    }
  }

  // ---- the stage block and auditorium roof behind the drum
  block(stone, null, rect(-10, -8, 12, 24), BODY, 22.6, 0)
  cornice(trim, rect(-10, -8, 12, 24), 22.0, 22.6, 0.35)
  {
    // a low hipped roof, ridge along the axis
    const x0 = -10, x1 = 12, y0 = -8, y1 = 24, z0 = 22.6, z1 = 24.6, rr = 6
    const cx = (x0 + x1) / 2
    const A: V3 = [cx, y0 + rr, z1], B: V3 = [cx, y1 - rr, z1]
    roof.quad([x1, y0, z0], [x1, y1, z0], B, A)
    roof.quad([x0, y1, z0], [x0, y0, z0], A, B)
    roof.tri([x0, y0, z0], [x1, y0, z0], A)
    roof.tri([x1, y1, z0], [x0, y1, z0], B)
  }

  // ---- the drum: three 16-sided stages, then the shallow faceted roof
  const D0 = poly(AX, CY, R_DRUM[0]), D1 = poly(AX, CY, R_DRUM[1]), D2 = poly(AX, CY, R_DRUM[2])
  wallsLow(stone, D0, 0, DRUM[0] - 1.3)
  cornice(trim, D0, DRUM[0] - 1.3, DRUM[0], 0.7)
  // the attic band over the main cornice, a little set back
  const DA = poly(AX, CY, R_DRUM[0] - 0.6)
  walls(stone, DA, DRUM[0], DRUM[0] + 1.8)
  ringTop(trim, inset(DA, -0.15), DA, DRUM[0] + 1.8)
  ringTop(roof, inset(D0, -0.28), DA, DRUM[0])
  ringTop(dome, DA, D1, DRUM[0] + 1.8)
  // stage 2: the attic, with a band of panels like the real one's recessed windows
  walls(stone, D1, DRUM[0] + 1.8, DRUM[1] - 0.8)
  cornice(trim, D1, DRUM[1] - 0.8, DRUM[1], 0.5)
  ringTop(dome, inset(D1, -0.2), D2, DRUM[1])
  walls(stone, D2, DRUM[1], DRUM[2] - 0.5)
  cornice(trim, D2, DRUM[2] - 0.5, DRUM[2], 0.35)
  {
    const top = inset(D2, -0.14), c: V3 = [AX, CY, APEX]
    for (let i = 0; i < top.length; i++) {
      const a = top[i], b = top[(i + 1) % top.length]
      dome.tri([a[0], a[1], DRUM[2]], [b[0], b[1], DRUM[2]], c)
    }
  }
  // drum windows: on the faces out to the lawns (front half), tall arched
  // windows over the base's square ones; panels on the attic.
  for (let i = 0; i < 16; i++) {
    const a = D0[i], b = D0[(i + 1) % 16], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const out = mid[1] < CY + 6 // front half, clear of the body
    const front = Math.abs(mid[0] - AX) < 7 && mid[1] < CY // behind the portico
    if (out && !front) {
      panel(win, a, b, L / 2 - 1.0, L / 2 + 1.0, PLAZA + 0.8, PLAZA + 3.6, 0.06)
      archPanel(win, a, b, L / 2 - 1.1, L / 2 + 1.1, 8.6, 12.4, 0.06)
      // the medallion over it, as a pale disc
      const m = 15.2
      archPanel(trim, a, b, L / 2 - 0.6, L / 2 + 0.6, m - 0.6, m, 0.08)
    }
    const a1 = D1[i], b1 = D1[(i + 1) % 16], L1 = Math.hypot(b1[0] - a1[0], b1[1] - a1[1])
    // the upper stage's blind panels, as shallow pale recesses
    panel(trim, a1, b1, L1 / 2 - 1.6, L1 / 2 + 1.6, DRUM[0] + 3.0, DRUM[1] - 1.8, 0.04)
  }

  // ---- the portico: a ground storey with three doors, pedestals and a
  // balustrade, six free-standing Ionic columns (pairs at the ends, two in
  // the middle) before a deep shaded porch with the great arched window,
  // the entablature with its frieze and the pediment. Spacing and storeys
  // scaled from the head-on photos (s2, s6) against the lidar pediment.
  {
    const x0 = AX - 8.4, x1 = AX + 8.4, yF = -43.5, yB = CY - R_DRUM[0] + 0.2
    const POD = 7.1, BAL = 8.5, COL1 = 16.3, ENT = 18.4, PED = 21.6
    const xc = (c: number) => AX + c
    const COLS = [-7.0, -5.65, -1.95, 1.95, 5.65, 7.0]
    const cy = yF + 0.95, RC = 0.6
    // ground storey: a solid rusticated base, its front a touch proud
    block(stone, stone, rect(x0, yF, x1, yB), 0, POD, 0)
    cornice(trim, rect(x0, yF, x1, yB), POD - 0.45, POD, 0.3)
    // the three doorways: deep shaded openings in the base
    for (const c of [-3.9, 0, 3.9]) {
      const a: XY = [x0, yF], b: XY = [x1, yF]
      panel(trim, a, b, 8.4 + c - 1.35, 8.4 + c + 1.35, PLAZA, PLAZA + 3.75, 0.05)
      panel(shade, a, b, 8.4 + c - 1.0, 8.4 + c + 1.0, PLAZA, PLAZA + 3.4, 0.08)
    }
    // pedestals under each column pair and the middle columns, balustrade between
    for (const [c0, c1] of [[-8.0, -4.9], [-2.75, -1.15], [1.15, 2.75], [4.9, 8.0]]) {
      block(stone, trim, rect(xc(c0), yF, xc(c1), yF + 1.9), POD, BAL, 0.12)
    }
    block(trim, trim, rect(x0 + 0.4, yF + 0.35, x1 - 0.4, yF + 1.0), POD, BAL - 0.15, 0.1)
    // the porch: shaded back wall well behind the columns, with the great
    // arched window and the tall windows either side, and the soffit
    const wy = yF + 4.4
    block(shade, null, rect(x0 + 0.9, wy, x1 - 0.9, yB), POD, COL1, 0)
    cap(shade, rect(x0, yF + 0.1, x1, wy + 0.5), COL1, false)
    {
      const a: XY = [x0 + 0.9, wy], b: XY = [x1 - 0.9, wy], m = 8.4 - 0.9
      archPanel(trim, a, b, m - 2.0, m + 2.0, BAL, 13.2, 0.04, 10)
      archPanel(win, a, b, m - 1.45, m + 1.45, BAL, 13.4, 0.08, 10)
      for (const c of [-3.3, 3.3]) panel(win, a, b, m + c - 0.7, m + c + 0.7, BAL, 12.1, 0.08)
    }
    // square antae at the back corners, against the drum
    for (const x of [x0, x1 - 1.3]) block(stone, null, rect(x, wy - 0.4, x + 1.3, yB), POD, COL1, 0.1)
    // the free-standing columns: plinth, round shaft, capital block
    for (const c of COLS) column(trim, trim, xc(c), cy, BAL, COL1, RC, 14)
    // entablature: architrave, frieze (the "SEVERANCE HALL" band), cornice
    const ER = rect(x0 + 0.3, yF + 0.15, x1 - 0.3, wy + 0.6)
    block(trim, null, ER, COL1, COL1 + 0.55, 0)
    block(stone, null, rect(x0 + 0.35, yF + 0.2, x1 - 0.35, wy + 0.6), COL1 + 0.55, ENT - 0.55, 0)
    cornice(trim, ER, ENT - 0.55, ENT, 0.5)
    gableY(roof, stone, x0 - 0.1, x1 + 0.1, yF - 0.35, wy + 0.6, ENT, PED)
    rakingCornice(trim, x0 - 0.1, x1 + 0.1, yF - 0.35, -1, ENT, PED, 0.7, 0.4)
    // the steps down from the doors to the drive
    for (let s = 0; s < 3; s++) block(stone, stone, rect(x0 + 1 + s * 0.3, yF - 1.8 + s * 0.6, x1 - 1 - s * 0.3, yF), 0, PLAZA * (s + 1) / 3, 0)
  }

  const flood = (p: V3, n: V3) => (p[1] < -30 && n[2] < 0.6 ? Math.max(0, 1 - p[2] / 24) * 0.8 : 0)
  return finishGlb('cle-severance-music-center', 'Severance Music Center', [
    { part: stone, material: { ...finish('sev-sandstone', 0xe2d4ba), floodlight: flood } },
    { part: trim, material: { ...finish('sev-sandstone-trim', 0xeee3cf), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: dome, material: finish('sev-drum-roof', 0xc8ccce) },
    // the shaded porch and the doorways: sandstone in shadow, as the photos show it
    { part: shade, material: { ...finish('sev-porch-shade', 0x8a7d69), floodlight: flood } },
  ], { bearing: 16, height: APEX, replaces: ['way/108400841'] }, 6500)
}

if (import.meta.main) await writeModel('cle-severance-music-center', build())
