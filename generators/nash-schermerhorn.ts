/**
 * Schermerhorn Symphony Center (2006, David M. Schwarz Architectural
 * Services) — original procedural geometry, CC0-1.0.
 * bun generators/nash-schermerhorn.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332 (the
 * downtown grid): +x runs toward 3rd Avenue (compass 62°), +y up the
 * avenues (compass 332°). Anchor = centroid of the outer ring of OSM
 * relation/1762150, 36.159723, -86.775567. y = 0 is the lowest ground
 * under the footprint (127.6 m, at the south-west corner).
 *
 * Identity, in order: the pale limestone temple front, a hexastyle portico
 * with its sculpted pediment on a podium of wide steps, between taller
 * flanking pavilions; the concert hall rising behind it under a long
 * low hipped roof of grey-green metal with tall clerestory windows; the
 * courtyard garden on the 4th Avenue side, framed by a long open
 * colonnade between two end pavilions with big round-headed windows.
 *
 * Evidence:
 *  - plan: OSM relation/1762150 (outer way/130905900, the courtyard as the
 *    inner way/130905895). The colonnade's columns from Michael Rivera's
 *    north-west and south-west face views (14 bays along 38 m).
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight), 1 m
 *    grid, read in the model frame. Over the 127.6 m base: hall eaves 20.7
 *    and ridge 24.9 (a hipped roof over x -4..20, y -32..45), the masses
 *    either side 14.0 (south) and 17.5 (north), the front block behind the
 *    portico 17.5, the portico cornice and flanking wings 12.3 with the
 *    pediment's apex 15.6, the courtyard end pavilions 11.2, their arms 9.0
 *    and 7.9, the colonnade roof 6.8. Measured. The portico: entablature
 *    top 13.8 and pediment apex 16.9, just under the 17.5 pavilion
 *    parapets (lidar 14-15.6 over the portico, read at 8 m spacing; set
 *    against the pavilions by Hackney's frontal photo, where the columns
 *    rise from the top step nearly to the pavilions' upper windows).
 *  - the portico's six columns (1.6 m across, 10.4 m tall, 4 m apart across its 23.2 m width), the narrow pavilions (7.6 m), podium (~2 m) and steps from Ryan
 *    Kaldari's and Mike Hackney's frontal views; column spacing 3.8 m from
 *    the 20 m portico width (estimated).
 *  - colours: buff Indiana limestone, a grey-green metal roof (NAIP).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Schermerhorn.jpg, Ryan Kaldari, CC0 (portico at night)
 *    https://commons.wikimedia.org/wiki/File:Schermerhorn.jpg
 *  - Schermerhorn Symphony Center.jpg, Mike Hackney, public domain (portico
 *    and the hall roof behind) https://commons.wikimedia.org/wiki/File:Schermerhorn_Symphony_Center.jpg
 *  - Schermerhorn Symphony Center (Northwest corner).JPG, (Northwest
 *    face).JPG, (Southwest corner).JPG, (Southwest face).JPG, Michael
 *    Rivera, CC BY-SA 4.0 (the colonnade, end pavilions and hall)
 *    https://commons.wikimedia.org/wiki/File:Schermerhorn_Symphony_Center_(Northwest_corner).JPG
 *    https://commons.wikimedia.org/wiki/File:Schermerhorn_Symphony_Center_(Southwest_face).JPG
 *  - Schermerhorn Symphony Center fountain.JPG, Michael Rivera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Schermerhorn_Symphony_Center_fountain.JPG
 *  - Nashville, TN at night58.jpg, dconvertini, CC BY-SA 2.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Nashville,_TN_at_night58.jpg
 *  - USGS NAIP (public domain): roof colour.
 * No look-only sources. No commercial imagery.
 *
 * Night: the limestone of the portico, the front and the colonnade is
 * floodlit; windows glow; the portico doors are `entrance`.
 *
 * Left out: the pediment sculpture, balustrades, the angel and fountain in
 * the courtyard (sculpture and paving), lamp standards, banners.
 *
 * Doubts: the south front follows the photo (narrow pavilion towers to
 * 17.5 m in the portico's plane). The 2022 lidar instead reads ~12.1 m
 * across the front plane outside the portico, with a 2 m-deep attic band
 * at 17.2 m spanning the whole front 6 m behind it; seen low from the
 * street the two may read as one tall pavilion. The attic band is kept.
 * The assignment places the portico on 4th Avenue; OSM and lidar
 * put the temple front on the south end (toward Demonbreun Street) and the
 * courtyard colonnade on the 4th Avenue side, which is what is drawn. The
 * east (3rd Avenue) and north faces are drawn from lidar only, with a
 * generic window rhythm; no photo of them was found. No rooftop lantern
 * shows in the lidar or photos, so none is drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save, circle, smoothWall, capPoly, type XY } from './atl-westin-peachtree-plaza'
import { face, opening, shape, rectOn, band, quadH, prismV, block, type Face } from './nash-ryman-auditorium'

function build() {
  const lime = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const col = (cx: number, cy: number, z0: number, z1: number, r = 0.65) => {
    block(trim, cx - r - 0.15, cx + r + 0.15, cy - r - 0.15, cy + r + 0.15, z0, z0 + 0.5)
    smoothWall(lime, circle([cx, cy], r, 10), z0 + 0.5, z1 - 0.6)
    block(trim, cx - r - 0.2, cx + r + 0.2, cy - r - 0.2, cy + r + 0.2, z1 - 0.6, z1)
  }
  /** Rows of window panels on a face, between s0 and s1, `n` per row. */
  const rows = (f: Face, s0: number, s1: number, n: number, w: number, levels: [number, number][], head: 'flat' | 'round' = 'flat') => {
    const p = (s1 - s0) / n
    for (let i = 0; i < n; i++) for (const [z0, z1] of levels) shape(win, f, opening(s0 + p * (i + 0.5), w, z0, z1, head, 8), 0.06)
  }

  // ── Core masses ──
  prism(lime, [[-23.9, -32], [38.9, -32], [38.9, 22], [-23.9, 22]], 0, 14.0, roof, 0.4)
  prism(lime, [[-23.9, 22], [38.9, 22], [38.9, 41.8], [-23.9, 41.8]], 0, 17.5, roof, 0.4)
  prism(lime, [[-23.0, -36.4], [38.8, -36.4], [38.8, -31.5], [-23.0, -31.5]], 0, 17.5, roof, 0.4)
  // Cornices.
  for (const [r, z] of [[[[-23.9, -32], [38.9, -32], [38.9, 22], [-23.9, 22]], 14.0], [[[-23.0, -36.4], [38.8, -36.4], [38.8, 41.8], [-23.0, 41.8]], 17.5]] as [XY[], number][]) {
    for (let i = 0; i < 4; i++) band(trim, face(r[i], r[(i + 1) % 4]), 0, Math.hypot(r[(i + 1) % 4][0] - r[i][0], r[(i + 1) % 4][1] - r[i][1]), z - 1.3, z - 0.6, 0.35)
  }
  // ── The hall: walls to 20.7, clerestory windows, a long low hipped roof ──
  {
    const X0 = -4, X1 = 20, Y0 = -32, Y1 = 45.2, EA = 20.7, RG = 24.9
    prism(lime, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 0, EA, roof, 0.05)
    const ov = 0.6, hw = (X1 - X0) / 2 + ov, xm = (X0 + X1) / 2, rise = RG - EA
    const ya = Y0 - ov + hw, yb = Y1 + ov - hw
    const c = [[X0 - ov, Y0 - ov], [X1 + ov, Y0 - ov], [X1 + ov, Y1 + ov], [X0 - ov, Y1 + ov]] as XY[]
    const A: V3 = [xm, ya, EA + rise], B: V3 = [xm, yb, EA + rise]
    const v = (p: XY): V3 => [p[0], p[1], EA]
    quadH(roof, v(c[1]), v(c[2]), B, A, [1, 0, 1])
    quadH(roof, v(c[3]), v(c[0]), A, B, [-1, 0, 1])
    roof.tri(v(c[0]), v(c[1]), A)
    roof.tri(v(c[2]), v(c[3]), B)
    // Eave fascia.
    for (let i = 0; i < 4; i++) band(trim, face(c[i], c[(i + 1) % 4]), 0, i % 2 ? Y1 - Y0 + 2 * ov : X1 - X0 + 2 * ov, EA - 0.5, EA, 0.01)
    // Tall clerestory windows on the long sides, round-headed.
    for (const f of [face([X1, Y0], [X1, Y1]), face([X0, Y1], [X0, Y0])]) rows(f, 4, f.L - 4, 14, 1.8, [[15.0, 18.6]], 'round')
  }

  // ── The temple front ──
  // Proportions from Hackney's frontal photo (s02): two narrow single-bay
  // pavilion towers, each about a fifth of the front, flank a wide
  // hexastyle portico filling the three fifths between them; its pediment
  // spans nearly that width, apex just under the pavilion cornice. The
  // portico's width is OSM's projecting front (x -4.1..18.8, 23 m); the
  // rest of OSM's 62 m front is lower side wings set back behind the
  // pavilions, as seen at the photo's edges.
  {
    const PX0 = -3.6, PX1 = 19.6, BY = -36.4, POD = 1.8, ENT = 12.2, COR = 12.3, PC = 13.8, APEX = 16.9
    const PW = 7.6, PF = -42.9, WF = -40.6
    // Set-back side wings to the cornice line.
    for (const [x0, x1] of [[-23.0, PX0 - PW], [PX1 + PW, 38.8]]) {
      prism(lime, [[x0, WF], [x1, WF], [x1, BY], [x0, BY]], 0, COR, roof, 0.3)
      const f = face([x0, WF], [x1, WF])
      rows(f, 0.8, f.L - 0.8, 3, 1.6, [[2.0, 5.2], [6.4, 10.0]])
      band(trim, f, 0, f.L, COR - 1.2, COR - 0.5, 0.35)
    }
    // The pavilion towers: one window column, three tiers, corner pilasters.
    for (const [x0, x1] of [[PX0 - PW, PX0], [PX1, PX1 + PW]]) {
      prism(lime, [[x0, PF], [x1, PF], [x1, BY], [x0, BY]], 0, 17.5, roof, 0.3)
      const f = face([x0, PF], [x1, PF])
      for (const s2 of [0.1, f.L - 1.3]) band(lime, f, s2, s2 + 1.2, 1.0, 15.6, 0.3)
      rows(f, 2.0, f.L - 2.0, 1, 1.9, [[2.4, 5.6], [7.0, 10.4], [12.0, 14.6]])
      band(trim, f, 0, f.L, 15.6, 16.4, 0.4)
      for (const [fx, sg] of [[x0, -1], [x1, 1]] as [number, number][]) {
        const fs = sg < 0 ? face([fx, BY], [fx, PF]) : face([fx, PF], [fx, BY])
        band(trim, fs, 0, fs.L, 15.6, 16.4, 0.4)
      }
    }
    // Front block's windows above the side wings.
    {
      const f = face([-23.0, -36.4], [38.8, -36.4])
      rows(f, 1.5, 10.0, 2, 1.5, [[13.4, 16.0]])
      rows(f, f.L - 10.0, f.L - 1.5, 2, 1.5, [[13.4, 16.0]])
    }
    // Podium with steps across the portico.
    box(lime, PX0, PX1, -42.6, BY, 0, POD, trim, 0.05)
    for (let k = 0; k < 4; k++) block(trim, PX0 + 0.4, PX1 - 0.4, -44.9 + k * 0.6, -42.6, 0, (k + 1) * (POD / 4))
    // Back wall of the portico with its doors.
    {
      const f = face([PX0, -38.8], [PX1, -38.8])
      prism(lime, [[PX0, -38.8], [PX1, -38.8], [PX1, BY], [PX0, BY]], POD, PC, roof, 0.05)
      for (let i = 0; i < 5; i++) {
        const s2 = 1.6 + 2.0 + i * 4.0
        rectOn(door, f, s2 - 1.0, s2 + 1.0, POD, POD + 3.6, 0.06)
        rectOn(win, f, s2 - 1.0, s2 + 1.0, POD + 4.4, POD + 8.6, 0.06)
      }
    }
    // Six columns, 1.6 m across, from the top step to the entablature.
    for (let i = 0; i < 6; i++) col(PX0 + 1.6 + i * 4.0, -41.6, POD, ENT, 0.8)
    // Entablature and the wide pediment.
    box(trim, PX0, PX1, -42.6, -38.8, ENT, PC, trim, 0.2)
    const XM = (PX0 + PX1) / 2
    prismV(lime, [[PX0 - 0.3, PC], [PX1 + 0.3, PC], [XM, APEX]], [1, 0], [0, 0], -42.7, BY)
    for (const sg of [-1, 1]) {
      const xa = sg < 0 ? PX0 - 0.5 : PX1 + 0.5
      const a: V3 = [xa, -42.95, PC - 0.15], b2a: V3 = [XM, -42.95, APEX + 0.35], a2: V3 = [xa, -38.2, PC - 0.15], b2: V3 = [XM, -38.2, APEX + 0.35]
      quadH(roof, a, b2a, b2, a2, [sg * 0.4, 0, 1])
      quadH(trim, [xa, -42.95, PC - 0.6], [XM, -42.95, APEX - 0.1], b2a, a, [0, -1, 0])
    }
  }

  // ── The courtyard wing on 4th Avenue ──
  {
    // End pavilions, each with a big round-headed window on its street face.
    for (const [y0, y1] of [[21.8, 30.5], [-25.1, -16.3]]) {
      prism(lime, [[-45.1, y0], [-36.6, y0], [-36.6, y1], [-45.1, y1]], 0, 11.2, roof, 0.3)
      const f = face([-45.1, y1], [-45.1, y0])
      shape(trim, f, opening(f.L / 2, 5.6, 1.6, 6.4, 'round', 10), 0.04)
      shape(win, f, opening(f.L / 2, 4.6, 2.0, 6.4, 'round', 10), 0.08)
      band(trim, f, 0, f.L, 9.6, 10.2, 0.3)
      const fy = y0 > 0 ? face([-36.6, y1], [-45.1, y1]) : face([-45.1, y0], [-36.6, y0])
      shape(win, fy, opening(fy.L / 2, 3.4, 2.0, 6.0, 'round', 8), 0.06)
    }
    // Arms back to the hall, with windows on the courtyard.
    prism(lime, [[-36.6, 22.5], [-23.9, 22.5], [-23.9, 30], [-36.6, 30]], 0, 9.0, roof, 0.3)
    prism(lime, [[-36.6, -24.9], [-23.9, -24.9], [-23.9, -17.2], [-36.6, -17.2]], 0, 7.9, roof, 0.3)
    rows(face([-23.9, 22.5], [-36.6, 22.5]), 1, 11.7, 4, 1.6, [[1.6, 6.4]], 'round')
    rows(face([-36.6, -17.2], [-23.9, -17.2]), 1, 11.7, 4, 1.6, [[1.6, 5.8]], 'round')
    // The colonnade: two rows of columns under a flat entablature roof.
    const Y0 = -16.3, Y1 = 21.8, n = 14
    for (let i = 0; i <= n; i++) {
      const y = Y0 + 1.2 + ((Y1 - Y0 - 2.4) * i) / n
      col(-44.2, y, 0, 5.8, 0.45)
      col(-40.2, y, 0, 5.8, 0.45)
    }
    box(trim, -45.1, -39.4, Y0, Y1, 5.8, 6.8, roof, 0.2)
    // The courtyard side of the hall's lower mass: windows.
    rows(face([-23.9, 22], [-23.9, -32]), 2, 52, 12, 1.6, [[2.0, 5.6], [7.0, 11.4]], 'round')
  }

  // ── East (3rd Avenue) and north faces: windows in two tiers ──
  rows(face([38.9, -32], [38.9, 22]), 2, 52, 13, 1.6, [[2.0, 5.6], [7.0, 11.4]])
  rows(face([38.9, 22], [38.9, 41.8]), 1, 18.8, 5, 1.6, [[2.0, 5.6], [7.0, 11.4], [12.6, 15.4]])
  rows(face([38.9, 41.8], [-23.9, 41.8]), 1, 18, 5, 1.6, [[2.0, 5.6], [7.0, 11.4], [12.6, 15.4]])
  rows(face([38.9, 41.8], [-23.9, 41.8]), 44.8, 61.8, 5, 1.6, [[2.0, 5.6], [7.0, 11.4], [12.6, 15.4]])
  rows(face([20, 45.2], [-4, 45.2]), 2, 22, 5, 1.8, [[3.0, 8.0], [10.0, 15.0]])

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] < -35 ? 0.85 : p[0] < -36 ? 0.6 : 0)
  return [
    { part: lime, material: { ...finish('schermerhorn-limestone', 0xe8dcc6), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('schermerhorn-roof', 0x8f9c99) },
    { part: door, material: PALETTE.entrance },
  ]
}

await save('nash-schermerhorn', 'Schermerhorn Symphony Center', build(), { height: 24.9, anchor: [36.159723, -86.775567], bearing: 332 })
