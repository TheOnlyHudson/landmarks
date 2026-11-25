/**
 * Virginia State Capitol, Richmond — procedural, CC0-1.0, no textures.
 * bun generators/ric-virginia-state-capitol.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/45088494 (lng -77.4335743, lat 37.5387973). The
 * outline's walls run at 37.0° and 127.0° (Richmond's street grid), so the
 * model is placed at bearing 37 and built square: model "north" is the
 * temple's rear (the HABS "northeast facade"), model "south" its portico
 * (the HABS "southwest facade"), facing down the lawn to Bank Street.
 *
 * What it is: Thomas Jefferson's temple of 1785–88 (after the Maison Carrée
 * at Nîmes, with Charles-Louis Clérisseau), stuccoed brick painted white: a
 * raised basement, two tall storeys behind giant Ionic pilasters, a full
 * entablature and a low pediment at each end under a low gable roof. A
 * hexastyle Ionic portico, three columns deep, faces south over the broad
 * flight of steps added with the wings. The 1904–06 wings (Senate to the
 * east, House of Delegates to the west, by Noland & Baskervill) are lower
 * blocks joined to the temple by recessed hyphens; each has its own
 * tetrastyle Ionic portico and pediment to the south, an attic over the
 * cornice, a low hipped roof and a central skylight. The rotunda's dome is
 * inside the temple and not seen outside. The 2007 underground visitor
 * centre (its glazed entrance down the lawn) is not part of this model.
 *
 * Covers and replaces: way/45088494 (the outline) and its three
 * building:parts way/366226948 (the temple), way/366226949 (west wing and
 * hyphen) and way/366226950 (east wing and hyphen). way/1423807274, the
 * underground visitor centre (location=underground, level=-1), lies under
 * the portico steps and is left to the map.
 *
 * Evidence
 * - OSM (measured): outline and parts. Temple 27.6 × 48.3 m (local x ±13.8,
 *   y -29.2..19.1 from the centroid frame's origin before the shift below);
 *   hyphens x ±(13.5..19.6), y about -8..7.6; wings x ±(19.6..40.0),
 *   y -14.6..14.0 with shallow pavilions on the south, north and outer
 *   faces. height=8.1 on the temple part is wrong (lidar below).
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 1 m grid
 *   read in the bearing-37 frame (measured, above the lawn at +6.4 m over
 *   ground_min; the lawn round the building is flat to ±0.5 m): temple eaves
 *   20.0 m, ridge 25.3 m; hyphen roofs 11.6 m; wing attic edge 13.6–13.8 m,
 *   the wings' hipped roofs to a flat at 16.2 m, a central skylight to
 *   18.0 m (6 × 12 m); portico landing and steps falling from 3.0 m at the
 *   portico to the lawn about 8 m out.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Virginia State Capitol late morning.JPG" (Martin Falbisoner,
 *   CC BY-SA 3.0), frontal from the south: columns, entablature, pediment
 *   and window heights, the wing porticoes;
 *   "MJK50147 Virginia State Capitol.jpg" (Martin Kraft, CC BY-SA 3.0),
 *   the whole south front: wing heights against the temple's cornice;
 *   "Virginia State Capitol-1.jpg" (Smash the Iron Cage, CC BY-SA 4.0), the
 *   portico close: six columns and three deep, five windows in two rows and
 *   the central door;
 *   HABS VA-1254 (https://www.loc.gov/pictures/item/va1498/):
 *   VA-1254-1 "FRONT AERIAL VIEW, LOOKING NORTHEAST" (public domain):
 *   roofs, the hyphens, the wings' attics and skylights, the side pilasters;
 *   HABS VA-1254-21 "NORTHEAST FACADE, EAST PORTION OF MAIN BLOCK" (public
 *   domain), the rear: basement, six pilasters and five bays, two window
 *   rows, the pediment, a door in the basement.
 * - USGS NAIP (public domain): the plan, the temple's pale grey roof, the
 *   wings' dark grey hips round pale skylights, the steps to the south-west.
 * - Measured from the rear HABS photo, scaled to the lidar eaves: basement
 *   3.8 m; pilaster capitals 16.6 m; window rows 5.2–8.5 and 12.1–15.2 m;
 *   basement windows 1.2–2.8 m. From the frontal photos, scaled to the
 *   portico's 27.6 m: stylobate 3.0 m, columns 13 m to 16.0 m, entablature
 *   to 20.0 m, portico windows 3.0–6.1 and 9.0–11.6 m, 1.5 m wide, the door
 *   1.8 m wide; the steps' flight 12.8 m wide between cheek walls.
 * - Estimated: the portico's depth (three column spacings, back wall at
 *   y -15.8, from the close photo); column diameter 1.7 m; the wing order
 *   (base 1.2 m, columns to 9.9 m, entablature to 11.8 m, attic 13.8 m,
 *   pediment apex 14.6 m, level with the attic as in the frontal photo);
 *   wing window rows; the planting terraces either side of the steps (drawn
 *   as low blocks, 1.4 m). The wings' outer (east and west) faces and the
 *   hyphens' north faces are not photographed here: pilasters and windows
 *   are repeated from the faces that are.
 * - Wing south fronts (from the close photo): pilaster, plain bay, pilaster,
 *   four columns, pilaster, plain bay, pilaster; one tall window per bay
 *   behind the columns (2.0–6.6 m, estimated), no windows in the flanks.
 * - Simplified: Ionic capitals are a wide block with the volutes' spread;
 *   no dentils, modillions, balustrades, lamp standards or flagpoles.
 * - Night: the Capitol is floodlit, the south portico and pediment
 *   brightest, so the stucco carries a floodlight wash.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cbox, cylinder, gable, grow, hip, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const stucco = new Part(), roofPale = new Part(), roofDark = new Part(), win = new Part(), door = new Part()

// Local frame: symmetric about x = 0 (the temple's axis); shifted at the end
// so the origin is the outline's centroid.
const SHIFT_X = -0.2, SHIFT_Y = 2.8

// ---- Temple
const TW = 13.8 // half width over the pilasters / portico
const WALL = 13.5 // side wall plane
const YF = -29.2 // portico front (stylobate edge)
const YPW = -15.8 // portico back wall
const YR = 19.1 // rear wall (pilaster face)
const STYLO = 3.0, BASE = 3.8, CAPS = 16.0, PCAP = 16.6, ENT = 20.0, APEX = 25.3
const CR = 0.85 // column radius

// ---- Hyphens and wings
const HX0 = 13.5, HX1 = 19.6, HY0 = -7.8, HY1 = 7.6, HZ = 11.6
const WX0 = 19.6, WX1 = 38.2, WY0 = -13.2, WY1 = 11.6 // wing core
const WC = 28.6 // wing axis (pavilion centre)
const WPS = -14.6, WPN = 14.0 // south / north pavilion faces
const WPH = 6.4 // pavilion half width
const WEND = 40.0 // outer pavilion face
const W_BASE = 1.2, W_CAPS = 9.9, W_ENT = 11.8, W_ATTIC = 13.8, W_FLAT = 16.2, W_SKY = 18.0, W_APEX = 14.6

/** An Ionic column: square plinth, tapering shaft, the volutes' wide cushion and an abacus. */
function ionic(x: number, y: number, z0: number, z1: number, r: number, alongX = true) {
  const pl = r * 1.25
  cbox(stucco, rect(x - pl, x + pl, y - pl, y + pl), z0, z0 + 0.45, { b: 0.1 })
  cylinder(stucco, x, y, r, z0 + 0.45, z1 - r * 0.7, 12, r * 0.86)
  // the volutes: a cushion wider across the face than deep
  const vw = r * 1.45, vd = r * 0.95, h = r * 0.55
  const v = alongX ? rect(x - vw, x + vw, y - vd, y + vd) : rect(x - vd, x + vd, y - vw, y + vw)
  cbox(stucco, v, z1 - r * 0.7, z1 - r * 0.7 + h, { b: 0.12, bottom: true })
  cbox(stucco, rect(x - pl * 1.05, x + pl * 1.05, y - pl * 1.05, y + pl * 1.05), z1 - r * 0.7 + h, z1, { bottom: true })
}

/** Windows centred at the given positions along a wall. */
function windows(side: Side, at: number, cs: number[], w: number, z0: number, z1: number) {
  for (const c of cs) panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
}

/** Pilasters: blocks proud of a wall, with a small capital band. */
function pilasters(side: Side, at: number, cs: number[], w: number, z0: number, z1: number, d = 0.28) {
  for (const c of cs) {
    block(stucco, side, at, c - w / 2, c + w / 2, z0, z1 - 0.5, d, false, false)
    block(stucco, side, at, c - w / 2 - 0.15, c + w / 2 + 0.15, z1 - 0.5, z1, d + 0.15, true, true)
  }
}

/**
 * A pedimented gable roof over r, ridge along y: slopes overhang the walls by
 * `o`, the tympanum stands in the frieze's plane, and a raking cornice frames
 * it. `ends` says which ends get a pediment (south, north).
 */
function pedimentRoof(roof: Part, r: Rect, z0: number, z1: number, o: number, ends: [boolean, boolean]) {
  const g = grow(r, o)
  const pitch = (z1 - z0) / ((r.x1 - r.x0) / 2)
  const zEave = z0 - o * pitch * 0.0 // eaves stay level with the cornice top
  const xm = (r.x0 + r.x1) / 2
  // roof slopes
  qf(roof, [g.x0, g.y0, zEave], [g.x0, g.y1, zEave], [xm, g.y1, z1 + o * pitch], [xm, g.y0, z1 + o * pitch], [-1, 0, 2])
  qf(roof, [g.x1, g.y0, zEave], [g.x1, g.y1, zEave], [xm, g.y1, z1 + o * pitch], [xm, g.y0, z1 + o * pitch], [1, 0, 2])
  const apex = z1 + o * pitch
  for (const [k, on] of [[0, ends[0]], [1, ends[1]]] as [number, boolean][]) {
    const s = k === 0 ? -1 : 1
    const yw = k === 0 ? r.y0 : r.y1, yo = k === 0 ? g.y0 : g.y1
    const n: V3 = [0, s, 0]
    if (on) {
      // tympanum in the wall plane
      tf(stucco, [r.x0, yw, z0], [r.x1, yw, z0], [xm, yw, z1], n)
      // raking cornice: a fascia under each slope's front edge and its soffit
      const fd = 0.55
      for (const sx of [-1, 1]) {
        const xe = sx < 0 ? g.x0 : g.x1
        qf(stucco, [xe, yo, zEave], [xm, yo, apex], [xm, yo, apex - fd], [xe, yo, zEave - fd], n)
        qf(stucco, [xe, yo, zEave - fd], [xm, yo, apex - fd], [xm, yw, apex - fd], [xe, yw, zEave - fd], [0, 0, -1])
      }
    } else {
      // a hipped-back end: close with a plain gable wall
      tf(stucco, [g.x0, yo, zEave], [g.x1, yo, zEave], [xm, yo, apex], n)
    }
  }
}

// ===========================================================================
// The temple
{
  // basement and walls of the cella
  const cella = rect(-WALL, WALL, YPW, YR - 0.3)
  cbox(stucco, grow(cella, 0.15), 0, BASE, { b: 0.12, top: false })
  cbox(stucco, cella, BASE, ENT - 0.9, { top: false })
  // portico podium (stylobate), its front edge and a plinth course
  cbox(stucco, rect(-TW, TW, YF, YPW + 0.2), 0, STYLO, { b: 0.15 })

  // entablature right round, over the portico; the portico ceiling is its underside
  const top = rect(-TW, TW, YF, YR)
  cbox(stucco, top, CAPS, ENT - 0.9, { bottom: true, top: false })
  cbox(stucco, grow(top, 0.55), ENT - 0.9, ENT, { b: 0.3, bottom: true, top: false })
  // low gable roof with a pediment at each end
  pedimentRoof(roofPale, rect(-TW, TW, YF, YR), ENT, APEX, 0.55, [true, true])

  // the portico: six columns across, three deep
  const yc0 = YF + 1.15
  const xs = Array.from({ length: 6 }, (_, k) => -TW + 1.15 + (k * (2 * TW - 2.3)) / 5)
  const sp = xs[1] - xs[0]
  for (const x of xs) ionic(x, yc0, STYLO, CAPS, CR)
  for (const sx of [-1, 1]) for (const k of [1, 2]) ionic(sx * (TW - 1.15), yc0 + k * sp, STYLO, CAPS, CR, false)
  // pilasters on the portico's back wall at its corners
  pilasters('s', YPW, [-TW + 0.8, TW - 0.8], 1.4, STYLO, CAPS)

  // portico back wall: five windows in two rows, the central door below
  const mids = xs.slice(0, 5).map((x, k) => (x + xs[k + 1]) / 2)
  windows('s', YPW, mids.filter((_, k) => k !== 2), 1.5, STYLO + 0.15, 6.1)
  windows('s', YPW, mids, 1.5, 9.0, 11.6)
  panel(door, 's', YPW, -0.9, 0.9, STYLO, 5.6, 0.06)
  panel(win, 's', YPW, -0.9, 0.9, 5.7, 6.4, 0.06) // fanlight

  // rear: six pilasters, five bays, two window rows, basement windows and a door
  const rx = Array.from({ length: 6 }, (_, k) => -WALL + 0.6 + (k * (2 * WALL - 1.2)) / 5)
  const rm = rx.slice(0, 5).map((x, k) => (x + rx[k + 1]) / 2)
  pilasters('n', YR - 0.3, rx, 1.2, BASE, PCAP)
  windows('n', YR - 0.3, rm, 1.4, 5.2, 8.5)
  windows('n', YR - 0.3, rm, 1.4, 12.1, 15.2)
  windows('n', YR - 0.15, rm.filter((_, k) => k !== 2), 1.3, 1.2, 2.8)
  panel(door, 'n', YR - 0.15, -0.9, 0.9, 0, 3.0, 0.06)

  // sides: seven bays of pilasters; lower windows only where the hyphen leaves the wall clear
  const sy = Array.from({ length: 8 }, (_, k) => YPW + 0.6 + (k * (YR - 0.9 - YPW - 0.6)) / 7)
  const sm = sy.slice(0, 7).map((y, k) => (y + sy[k + 1]) / 2)
  for (const sx of [-1, 1]) {
    const side: Side = sx < 0 ? 'w' : 'e'
    pilasters(side, sx * WALL, sy, 1.2, BASE, PCAP)
    const clear = sm.filter((y) => y < HY0 - 0.6 || y > HY1 + 0.6)
    windows(side, sx * WALL, clear, 1.4, 5.2, 8.5)
    windows(side, sx * WALL, sm, 1.4, 12.1, 15.2)
    windows(side, sx * (WALL + 0.15), clear, 1.3, 1.2, 2.8)
  }

  // the steps: a broad flight between cheek walls, planting terraces either side
  const N = 8, Y0 = YF - 8.0, HW = 6.4
  for (let k = 0; k < N; k++) {
    const y0 = Y0 + (k * (YF - Y0)) / N
    cbox(roofPale, rect(-HW, HW, y0, YF), 0, ((k + 1) * STYLO) / N, { top: true })
  }
  for (const sx of [-1, 1]) {
    const [a, b] = sx < 0 ? [-HW - 0.8, -HW] : [HW, HW + 0.8]
    // cheek wall in two steps down the flight
    cbox(stucco, rect(a, b, YF - 3.2, YF), 0, STYLO + 0.6, { b: 0.15 })
    cbox(stucco, rect(a, b, Y0, YF - 3.2), 0, 1.6, { b: 0.15 })
    // planting terrace
    const [c, d] = sx < 0 ? [-TW, -HW - 0.8] : [HW + 0.8, TW]
    cbox(stucco, rect(c, d, YF - 4.2, YF), 0, 1.4, { b: 0.15 })
  }
}

// ===========================================================================
// Hyphens and wings (mirrored east and west)
for (const sx of [-1, 1]) {
  const X = (a: number, b: number) => (sx > 0 ? [a, b] : [-b, -a]) as [number, number]
  const R = (a: number, b: number, y0: number, y1: number) => { const [x0, x1] = X(a, b); return rect(x0, x1, y0, y1) }
  const side: Side = sx < 0 ? 'w' : 'e'

  // hyphen: a plain block with a parapet and a dark flat roof
  const hy = R(HX0 - 0.3, HX1 + 0.3, HY0, HY1)
  cbox(stucco, hy, 0, HZ - 0.8, { top: false })
  cbox(stucco, grow(hy, 0.25, 0.25), HZ - 0.8, HZ, { b: 0.2, bottom: true, top: roofDark })
  const hm = sx * ((HX0 + HX1) / 2)
  for (const s of ['s', 'n'] as Side[]) {
    const at = s === 's' ? HY0 : HY1
    windows(s, at, [hm - 1.4, hm + 1.4], 1.2, 2.0, 4.4)
    windows(s, at, [hm - 1.4, hm + 1.4], 1.2, 6.0, 8.6)
  }

  // wing core, with pavilions S, N and outer
  const core = R(WX0, WX1, WY0, WY1)
  const pS = R(WC - WPH, WC + WPH, WPS + 0.8, WY0 + 0.1)
  const pN = R(WC - WPH, WC + WPH, WY1 - 0.1, WPN)
  const pE = R(WX1 - 0.1, WEND, -7.6, 5.5)
  cbox(stucco, grow(core, 0.15), 0, W_BASE, { b: 0.1, top: false })
  cbox(stucco, core, W_BASE, W_ENT, { top: false })
  for (const p of [pN, pE]) {
    cbox(stucco, grow(p, 0.15), 0, W_BASE, { b: 0.1, top: false })
    cbox(stucco, p, W_BASE, W_ENT, { top: false })
  }
  // the south portico: stylobate, four columns before the wall, pilasters at its ends
  cbox(stucco, R(WC - WPH, WC + WPH, WPS, WY0 + 0.1), 0, W_BASE, { b: 0.12 })
  const wcx = [-1.5, -0.5, 0.5, 1.5].map((k) => sx * WC + k * 3.7)
  for (const x of wcx) ionic(x, WPS + 0.75, W_BASE, W_CAPS, 0.5)
  // entablature: round the core and pavilions, over the portico
  const entBand = (r: Rect) => {
    cbox(stucco, r, W_CAPS, W_ENT - 0.6, { bottom: true, top: false })
    cbox(stucco, grow(r, 0.4), W_ENT - 0.6, W_ENT, { b: 0.25, bottom: true, top: false })
  }
  entBand(core); entBand(pN); entBand(pE)
  entBand(R(WC - WPH, WC + WPH, WPS, WY0))
  // attic over the cornice, set back a little, then the hipped roof and skylight
  const attic = grow(core, -0.3)
  cbox(stucco, attic, W_ENT, W_ATTIC, { b: 0.2, top: false })
  hip(roofDark, attic, W_ATTIC, W_FLAT, 4.2, roofDark)
  const sky = R(WC - 3.0, WC + 3.0, -6.0, 6.0)
  cbox(roofPale, sky, W_FLAT - 0.2, W_SKY, { b: 0.4 })
  // pavilion attics round the outer pavilion
  cbox(stucco, grow(pE, -0.3), W_ENT, W_ATTIC - 0.4, { b: 0.2, top: roofDark })
  // pediments over the south portico and the north pavilion, roofs running back into the hip
  pedimentRoof(roofDark, R(WC - WPH, WC + WPH, WPS, WY0 + 3.0), W_ENT, W_APEX, 0.4, [true, false])
  pedimentRoof(roofDark, R(WC - WPH, WC + WPH, WY1 - 3.0, WPN), W_ENT, W_APEX, 0.4, [false, true])

  // pilasters and windows: two storeys of windows between pilasters on every face
  const lowZ: [number, number] = [2.4, 5.2], upZ: [number, number] = [6.5, 8.9]
  const bay = (s: Side, at: number, cs: number[], ws: number[]) => {
    pilasters(s, at, cs, 0.9, W_BASE, W_CAPS, 0.22)
    windows(s, at, ws, 1.3, ...lowZ)
    windows(s, at, ws, 1.3, ...upZ)
  }
  // south: one tall window per bay behind the columns (p1 close-up), plain
  // wall in the flanks with a pilaster at the portico end and at the corner
  const swx = wcx.slice(0, 3).map((x, k) => (x + wcx[k + 1]) / 2)
  windows('s', WY0, swx, 1.6, 2.0, 6.6)
  pilasters('s', WY0, [sx * (WC - WPH - 0.6), sx * (WC + WPH + 0.6), sx * (WX0 + 0.6), sx * (WX1 - 0.6)], 0.9, W_BASE, W_CAPS, 0.22)
  // north pavilion: four pilasters, three bays
  const npx = [-1.5, -0.5, 0.5, 1.5].map((k) => sx * WC + k * 3.9)
  bay('n', WPN, npx, npx.slice(0, 3).map((x, k) => (x + npx[k + 1]) / 2))
  // outer pavilion: four pilasters, three bays
  const epy = [-7.0, -2.8, 1.4, 4.9]
  bay(side, sx * WEND, epy, epy.slice(0, 3).map((y, k) => (y + epy[k + 1]) / 2))
  // outer face beyond the pavilion
  windows(side, sx * WX1, [-10.4, 8.6], 1.3, ...lowZ)
  windows(side, sx * WX1, [-10.4, 8.6], 1.3, ...upZ)
  // north face flanks
  const flank = (a: number, b: number) => [sx * ((a + b) / 2)]
  windows('n', WY1, flank(WX0 + 0.4, WC - WPH), 1.3, ...lowZ)
  windows('n', WY1, flank(WX0 + 0.4, WC - WPH), 1.3, ...upZ)
  windows('n', WY1, flank(WC + WPH, WX1), 1.3, ...lowZ)
  windows('n', WY1, flank(WC + WPH, WX1), 1.3, ...upZ)
}

// ---- shift into the centroid frame (Part stores glTF x, z, -y)
for (const p of [stucco, roofPale, roofDark, win, door]) {
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += SHIFT_X; p.pos[i + 2] -= SHIFT_Y }
}

// Floodlit stucco: the south fronts brightest, the rest softer; tops faint.
// (Positions here are in the shifted map frame; south faces have n.y < 0.)
const lit = (_p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.15
  return n[1] < -0.5 ? 0.95 : 0.6
}
const STUCCO = { ...finish('va-capitol-stucco', 0xf3efe6), floodlight: lit }

if (import.meta.main) {
  await saveModel('ric-virginia-state-capitol', 'Virginia State Capitol', [
    { part: stucco, material: STUCCO },
    { part: roofPale, material: finish('va-capitol-roof', 0xc9cbc7) },
    { part: roofDark, material: finish('va-capitol-roof-dark', 0x8d949a) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { source: 'generators/ric-virginia-state-capitol.ts', bearing: 37, osm: 'way/45088494', height: APEX }, 6500)
}
