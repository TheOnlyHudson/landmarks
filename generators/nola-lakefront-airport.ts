/**
 * New Orleans Lakefront Airport terminal (Weiss, Dreyfous & Seiferth, 1934;
 * restored 2013) — procedural, CC0-1.0, no textures.
 * bun generators/nola-lakefront-airport.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 337, so model -y is the landside
 * front, facing compass 157 down the entrance drive; model +y faces the
 * apron and the runways.
 * Anchor: the area centroid of OSM way/326462163 (building=yes, 2 levels,
 * "New Orleans Lakefront Airport"). The building's own axis is x = 3.45.
 *
 * Identity: a long, symmetrical cream-stucco Art Deco terminal: a
 * three-part plan, the taller centre block flanked by two long two-storey
 * wings that angle forward toward the landside forecourt; the centre's
 * projecting pavilion with its winged aviator relief, the low entrance bay
 * with "TERMINAL" over a round aluminium canopy, broad fluted piers and
 * carved Deco panels over tall multi-pane windows, stepped corner piers;
 * the octagonal glazed control cab on its square shaft rising from the
 * back of the centre block; lower one-storey strips along the wings' backs.
 *
 * Evidence
 * - OSM way/326462163: the plan: the centre block 32 m wide, 20 m deep, its
 *   front pavilion 16 m wide projecting 2.4 m, the control tower's base
 *   projecting at the back; each wing 23.6 m along its front, turned 17
 *   degrees forward, 17.4 m deep, the low strip behind it to 24.7 m, and a
 *   rear annex on the west wing.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame. Ground 1.0-1.3 above the grid
 *   minimum, flat. Above it: the wings 10.7 (parapets 11.4); the centre
 *   block 12.8, its front pavilion and corner piers 13.2-14.4; the entrance
 *   bay 5-7; the wings' rear strips 5.9; the west annex 6-7.4; the tower
 *   shaft about 17.4-18.7, the cab's roof 23.0-23.7.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - NAIP (USGS, public domain): the plan and the pale flat roofs.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Lakefront Airport NOLA Front.JPG", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: the landside front face on (the whole: bay counts, the
 *     tower cab, heights)
 *     https://commons.wikimedia.org/wiki/File:Lakefront_Airport_NOLA_Front.JPG
 *   - "Lakefront Airport NOLA Front Distance.JPG", Infrogmation of New
 *     Orleans, CC BY-SA 3.0: the front from further off
 *     https://commons.wikimedia.org/wiki/File:Lakefront_Airport_NOLA_Front_Distance.JPG
 *   - "New Orleans Lakefront Airport Terminal Building Front from parking
 *     lot, August 2016.jpg", Infrogmation of New Orleans, CC BY-SA 4.0: the
 *     centre block and both wings from the south-west after the restoration
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Lakefront_Airport_Terminal_Building_Front_from_parking_lot,_August_2016.jpg
 *   - "New Orleans Lakefront Airport - Main Terminal Building, November
 *     2019 - 01.jpg", Jeff Hitchcock, CC BY 2.0: the centre block close
 *     (the entrance bay, canopy and lettering, the aviator relief, the
 *     piers and panels)
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Lakefront_Airport_-_Main_Terminal_Building,_November_2019_-_01.jpg
 *   - "Lakefront Airport NOLA West Wing.JPG", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: a wing close (two storeys of tall windows, the panels
 *     over them, the fluted pier bases, side doors with round canopies)
 *     https://commons.wikimedia.org/wiki/File:Lakefront_Airport_NOLA_West_Wing.JPG
 * - Published: Wikipedia "Lakefront Airport": opened 1934 as Shushan
 *   Airport, Art Deco terminal by Weiss, Dreyfous and Seiferth, restored and
 *   reopened 2013.
 *
 * Measured (lidar/OSM): plan, every height above. Estimated from the photos
 * scaled to those: ten window bays along each wing's front (windows 1.2 m wide, 1.5-4.4
 * and 5.9-8.9), the centre's three bays each side of the pavilion
 * (windows 1.9 m wide, 1.6-4.8 and 6.2-9.6), the panels over the windows,
 * the pavilion's wide window and relief, the entrance bay (7.2 m wide,
 * 6.2 m tall) and canopy, the cab (octagon 3.1 m across the flats, glazing
 * 18.2-21.6) and mast. The airside faces are not photographed: they repeat
 * the front's bays.
 * Left out: the rooftop railing, the lettering, the fluting, the side
 * stairs and ramps, the window muntins.
 *
 * Night: the windows and the cab glow; the entrance glows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save, circle, ccw, type XY } from './atl-flatiron-building'
import { faceOf, fblock, fpanel, fprism, type Face } from './nola-gallier-hall'

if (import.meta.main) {
  const stucco = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), alu = new Part()

  const XA = 3.45 // the building's axis
  const LOW = 5.9, WING = 10.7, WPAR = 11.3, CTR = 12.8, CPAR = 13.4, PAV = 14.0

  // ── the outline at the low strips' height (every wall reaches at least that) ──
  const outline: XY[] = [[45.4, -14.9], [23.3, -8.1], [19.1, -8.1], [19.2, -11.0], [11.8, -11.2], [11.8, -13.6], [-4.4, -13.5], [-4.3, -11.2], [-12.7, -11.1], [-12.9, -8.2], [-16.4, -8.2], [-38.9, -15.2], [-43.8, 1.6], [-42.3, 2.1], [-44.1, 9.1], [-30.9, 13.0], [-31.4, 15.2], [-21.3, 17.8], [-18.7, 8.8], [-13.0, 8.7], [-12.9, 12.1], [-0.7, 12.2], [-0.8, 15.7], [6.6, 15.9], [6.8, 12.3], [18.8, 12.6], [19.0, 9.0], [26.9, 8.9], [50.5, 1.7]]
  prism(stucco, ccw(outline), 0, LOW, roof, 0.0)
  prism(trim, ccw(outline).map((p) => p), LOW, LOW + 0.45, roof, 0.1)

  // ── the wings: two-storey blocks turned forward ──
  type Wing = { a: XY; u: XY; v: XY; L: number }
  const mk = (a: XY, b: XY, sg: number): Wing => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    return { a, u, v: sg < 0 ? [u[1], -u[0]] : [-u[1], u[0]], L }
  }
  const wings = [mk([-16.4, -8.2], [-38.9, -15.2], -1), mk([23.3, -8.1], [45.4, -14.9], 1)]
  const WD = 17.4 // depth of the two-storey part
  const at = (W: Wing, s: number, t: number): XY => [W.a[0] + W.u[0] * s + W.v[0] * t, W.a[1] + W.u[1] * s + W.v[1] * t]
  for (const W of wings) {
    const ring: XY[] = ccw([at(W, -3.5, 0), at(W, W.L, 0), at(W, W.L, WD), at(W, -3.5, WD)])
    prism(stucco, ring, 0, WING, null, 0.0)
    prism(trim, ring, WING, WPAR, roof, 0.12)
    // the front and the outer end and the back: window bays
    const front = W.u[0] < 0 ? faceOf(at(W, W.L, 0), at(W, 0, 0)) : faceOf(at(W, 0, 0), at(W, W.L, 0))
    const endF = W.u[0] < 0 ? faceOf(at(W, W.L, WD), at(W, W.L, 0)) : faceOf(at(W, W.L, 0), at(W, W.L, WD))
    wingBays(front, 10, W.u[0] < 0)
    wingBays(endF, 4, false)
    // the back above the low strip
    const back = W.u[0] < 0 ? faceOf(at(W, 0, WD), at(W, W.L, WD)) : faceOf(at(W, W.L, WD), at(W, 0, WD))
    upperBays(back, 7)
  }

  function wingBays(F: Face, n: number, flip: boolean) {
    const m0 = 1.6, step = (F.L - 2 * m0) / n
    // a corner pier at each end
    fblock(trim, F, 0, 1.3, 0, WPAR, 0.25)
    fblock(trim, F, F.L - 1.3, F.L, 0, WPAR, 0.25)
    for (let k = 0; k < n; k++) {
      const s = m0 + step * (k + 0.5)
      // a broad pier between bays (proud stucco), the window pair, the carved panel over it
      if (k > 0) fblock(stucco, F, s - step / 2 - 0.3, s - step / 2 + 0.3, 0.6, WING - 0.3, 0.16)
      fpanel(win, F, s - 0.6, s + 0.6, 1.5, 4.4, 0.06)
      fpanel(win, F, s - 0.6, s + 0.6, 5.9, 8.9, 0.06)
      fblock(trim, F, s - 0.55, s + 0.55, 9.15, 10.45, 0.1)
      fblock(trim, F, s - 0.75, s + 0.75, 1.3, 1.5, 0.12)
    }
    // a plinth course
    fblock(trim, F, 0, F.L, 0, 0.6, 0.1)
    void flip
  }
  function upperBays(F: Face, n: number) {
    const m0 = 1.6, step = (F.L - 2 * m0) / n
    for (let k = 0; k < n; k++) {
      const s = m0 + step * (k + 0.5)
      fpanel(win, F, s - 0.8, s + 0.8, LOW + 1.1, 8.9, 0.06)
    }
  }
  // the low strips' windows: one storey along the backs
  {
    const lowFaces: [XY, XY][] = [[[-30.9, 13.0], [-44.1, 9.1]], [[50.5, 1.7], [26.9, 8.9]]]
    for (const [a, b] of lowFaces) {
      const F = faceOf(a, b)
      const n = Math.floor(F.L / 3.4)
      for (let k = 0; k < n; k++) { const s = 1.7 + (F.L - 3.4) * (k + 0.5) / n; fpanel(win, F, s - 0.75, s + 0.75, 1.4, 4.4, 0.06) }
    }
  }

  // ── the centre block ──
  const CX0 = -12.9, CX1 = 19.8, CY0 = -11.15, CY1 = 12.4
  box(stucco, CX0, CX1, CY0, CY1, 0, CTR, null, 0.0)
  box(trim, CX0 - 0.1, CX1 + 0.1, CY0 - 0.1, CY1 + 0.1, CTR, CPAR, roof, 0.12)
  // stepped corner piers, rising past the parapet
  for (const [x, y] of [[CX0, CY0], [CX1, CY0], [CX0, CY1], [CX1, CY1]] as XY[]) {
    const sx = x < XA ? 1 : -1, sy = y < 0 ? 1 : -1
    box(trim, Math.min(x - sx * 0.3, x + sx * 1.6), Math.max(x - sx * 0.3, x + sx * 1.6), Math.min(y - sy * 0.3, y + sy * 1.6), Math.max(y - sy * 0.3, y + sy * 1.6), 0, PAV - 0.3, roof, 0.12)
    box(trim, Math.min(x - sx * 0.1, x + sx * 1.0), Math.max(x - sx * 0.1, x + sx * 1.0), Math.min(y - sy * 0.1, y + sy * 1.0), Math.max(y - sy * 0.1, y + sy * 1.0), PAV - 0.3, PAV + 0.4, roof, 0.1)
  }
  // the front: three bays each side of the pavilion
  const cf = faceOf([CX0, CY0], [CX1, CY0]) // s = x - CX0
  const PH = 8.1 // half the pavilion
  for (const sg of [-1, 1]) {
    for (let k = 0; k < 3; k++) {
      const x = XA + sg * (PH + 1.45 + k * 2.2)
      const s = x - CX0
      fpanel(win, cf, s - 0.8, s + 0.8, 1.6, 4.8, 0.06)
      fpanel(win, cf, s - 0.8, s + 0.8, 6.2, 9.6, 0.06)
      fblock(trim, cf, s - 0.7, s + 0.7, 10.2, 11.9, 0.1)
      if (k < 2) fblock(stucco, cf, s + sg * 1.1 - 0.25, s + sg * 1.1 + 0.25, 0.6, CTR - 0.3, 0.16)
    }
  }
  fblock(trim, cf, 0, cf.L, 0, 0.6, 0.1)
  // the sides and back of the centre block: two storeys of windows
  const cBack = faceOf([CX1, CY1], [CX0, CY1])
  for (let k = 0; k < 9; k++) {
    const s = 2.6 + ((cBack.L - 5.2) * (k + 0.5)) / 9
    if (Math.abs(s - (CX1 - XA)) < 4.5) continue // the tower stands here
    fpanel(win, cBack, s - 0.9, s + 0.9, 1.6, 4.8, 0.06)
    fpanel(win, cBack, s - 0.9, s + 0.9, 6.2, 9.6, 0.06)
  }

  // the front pavilion: taller, with piers, a wide window and the aviator relief
  const PY0 = -13.55
  box(stucco, XA - PH, XA + PH, PY0, CY0 + 0.1, 0, PAV - 0.4, null, 0.0)
  box(trim, XA - PH - 0.1, XA + PH + 0.1, PY0 - 0.1, CY0 + 0.1, PAV - 0.4, PAV, roof, 0.1)
  const pf = faceOf([XA - PH, PY0], [XA + PH, PY0])
  for (const s of [0.7, 4.6, 2 * PH - 4.6, 2 * PH - 0.7]) fblock(trim, pf, s - 0.7, s + 0.7, 0, PAV - 0.2, 0.25)
  for (const s of [2.65, 2 * PH - 2.65]) {
    fpanel(win, pf, s - 0.9, s + 0.9, 7.0, 10.0, 0.06)
    fblock(trim, pf, s - 0.8, s + 0.8, 10.5, 12.2, 0.1)
  }
  fpanel(win, pf, PH - 2.2, PH + 2.2, 7.4, 9.6, 0.06) // the wide window over the entrance
  // the winged aviator over it: a standing figure with spread wings, in bold relief
  fprism(trim, pf, [[PH - 0.35, 10.0], [PH + 0.35, 10.0], [PH + 0.4, 11.4], [PH + 2.6, 12.9], [PH + 2.4, 13.3], [PH + 0.45, 12.5], [PH + 0.3, 13.4], [PH - 0.3, 13.4], [PH - 0.45, 12.5], [PH - 2.4, 13.3], [PH - 2.6, 12.9], [PH - 0.4, 11.4]], -0.05, 0.3)
  fblock(trim, pf, PH - 2.8, PH + 2.8, 9.7, 10.0, 0.3) // its stepped bracket

  // the entrance bay: one storey, stepped top, "TERMINAL" band, round canopy, doors
  const EH = 3.6, EY = PY0 - 2.1
  box(stucco, XA - EH, XA + EH, EY, PY0 + 0.1, 0, 5.6, null, 0.0)
  box(trim, XA - EH - 0.1, XA + EH + 0.1, EY - 0.1, PY0 + 0.1, 5.6, 6.2, roof, 0.1)
  box(trim, XA - 1.8, XA + 1.8, EY - 0.05, EY + 0.6, 6.2, 6.8, roof, 0.08)
  const ef = faceOf([XA - EH, EY], [XA + EH, EY])
  fblock(trim, ef, 0, 1.0, 0, 6.2, 0.2)
  fblock(trim, ef, 2 * EH - 1.0, 2 * EH, 0, 6.2, 0.2)
  fpanel(door, ef, EH - 1.3, EH + 1.3, 0.5, 3.4, 0.06)
  fpanel(win, ef, EH - 1.3, EH + 1.3, 3.5, 4.1, 0.06)
  fblock(alu, ef, EH - 2.0, EH + 2.0, 4.65, 5.25, 0.12) // the lettering band, drawn plain
  // the half-round canopy
  {
    const n = 8, r = 1.9, z0 = 4.15, z1 = 4.45
    const ring: XY[] = [[XA + r, EY], ...Array.from({ length: n - 1 }, (_, i) => { const t = -Math.PI * (i + 1) / n; return [XA + r * Math.cos(t), EY + r * Math.sin(t) * 0.75] as XY }), [XA - r, EY]]
    prism(alu, ccw(ring), z0, z1, alu, 0.05, true)
  }
  // the steps up to the doors
  box(trim, XA - 2.6, XA + 2.6, EY - 1.4, EY, 0, 0.25, trim, 0.0)
  box(trim, XA - 2.6, XA + 2.6, EY - 0.7, EY, 0.25, 0.5, trim, 0.0)

  // ── the control tower at the back of the centre block ──
  const TX = XA, TY = 13.2, TS = 2.6
  box(stucco, TX - TS, TX + TS, TY - TS, TY + TS, 0, 18.0, null, 0.0)
  box(trim, TX - TS - 0.15, TX + TS + 0.15, TY - TS - 0.15, TY + TS + 0.15, 17.6, 18.2, null, 0.08, true)
  const cab = circle([TX, TY], 3.0, 8, Math.PI / 8)
  prism(trim, cab, 18.2, 18.9, null, 0.0, true) // the cab's sill wall
  prism(win, circle([TX, TY], 2.85, 8, Math.PI / 8), 18.9, 21.6, null, 0.0)
  prism(alu, circle([TX, TY], 3.25, 8, Math.PI / 8), 21.6, 22.0, alu, 0.08, true) // the roof's overhang
  prism(alu, circle([TX, TY], 1.6, 8, Math.PI / 8), 22.0, 22.6, alu, 0.1)
  box(alu, TX - 0.12, TX + 0.12, TY - 0.12, TY + 0.12, 22.6, 23.7, alu, 0.0)
  // the tower's windows facing the apron
  {
    const F = faceOf([TX + TS, TY + TS], [TX - TS, TY + TS])
    fpanel(win, F, TS - 0.8, TS + 0.8, 1.6, 4.8, 0.06)
    fpanel(win, F, TS - 0.8, TS + 0.8, 6.2, 9.6, 0.06)
    fpanel(win, F, TS - 0.8, TS + 0.8, 13.6, 16.8, 0.06)
    for (const G of [faceOf([TX - TS, TY + TS], [TX - TS, TY - TS]), faceOf([TX + TS, TY - TS], [TX + TS, TY + TS]), faceOf([TX - TS, TY - TS], [TX + TS, TY - TS])]) fpanel(win, G, TS - 0.7, TS + 0.7, 14.0, 16.8, 0.06)
  }

  const front = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : n[1] < -0.3 && p[0] > CX0 - 1 && p[0] < CX1 + 1 ? 0.85 : 0)
  await save('nola-lakefront-airport', 'New Orleans Lakefront Airport', [
    { part: stucco, material: { ...finish('lakefront-stucco', 0xe4d3a6), floodlight: front } },
    { part: trim, material: { ...finish('lakefront-trim', 0xefe3c1), floodlight: front } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x6f7c86 } },
    { part: alu, material: finish('lakefront-aluminium', 0xc8ccd0) },
  ], { bearing: 337, osm: 'way/326462163', height: 23.7 }, 6500)
}
