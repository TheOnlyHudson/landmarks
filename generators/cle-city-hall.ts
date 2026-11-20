/**
 * Cleveland City Hall (601 Lakeside Avenue East, 1916, J. Milton Dyer), the
 * Group Plan's twin of the Cuyahoga County Courthouse, on the lakefront
 * bluff: procedural, CC0-1.0.
 * bun generators/cle-city-hall.ts [out.glb]
 *
 * This file also exports `groupPlanHall`, the shared massing of the two
 * twins; `cle-cuyahoga-county-courthouse.ts` imports it. City Hall itself is
 * only written when this file runs.
 *
 * Map frame: x east, y north, z up, metres, turned to the building's axes:
 * bearing 325.9 (OSM's long walls run 56.2° / 236.2°), so the Lakeside
 * Avenue front faces model south (-y) and the lake model north. Origin at
 * the centroid of OSM way/96235969 (-81.693641, 41.505113). z = 0 is the
 * floor of the dry areaway round the building (193.75 m), the lowest
 * ground the outline touches and where Mapterhorn puts it; the sidewalks
 * of Lakeside, East 6th and the Willard Park deck are 3.0 m higher.
 *
 * Identity, in order: a long grey granite palazzo; a giant Corinthian order
 * of engaged columns over a rusticated base with round-arched windows, on
 * all four sides; the centre pavilion with six free columns in antis
 * (pairs at the ends) in front of a recessed loggia, three arched doors
 * under it on Lakeside, and a tall plain attic over it; the balustrade; and
 * the low green copper roof with its flat top, the attic's own hip above.
 *
 * Evidence:
 *  - plan: OSM way/96235969 (no parts): 100 x 61.6 m, the centre pavilion
 *    27 m wide, projecting 2.4 m (piers) / 3.4 m (landing) on Lakeside and
 *    1.6 m on the lake side.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    1 m grid, above the areaway: main cornice 26.6, balustrade 29.4,
 *    copper roof rising to a flat top at 33.1 about 8 m in from the walls,
 *    centre attic 34.6, its hip 39.4. Lidar walls sit ~1-2 m outside OSM's
 *    (cornice overhang); the model keeps OSM's walls.
 *  - order and base: estimated from Erik Drost's square-on view of the
 *    front and Mike Russell's three-quarter view, scaled to the lidar
 *    cornice: base to 12.4 (9.4 m above the street), columns 12.4-23.4,
 *    entablature to 26.6. Bays ~4.2 m (Cards84664's view of the west end
 *    counts ~14 columns along it). Three doors, ~5 m apart.
 *  - colour: grey granite, a little warm, from the daylight photos; the
 *    oxidised copper roof pale green (Cards84664, Mike Russell 2).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cleveland_City_Hall_in_2012.jpg, Erik Drost, CC BY 2.0 (front, S)
 *  - Cleveland_City_Hall.jpg, Mike Russell (uploader), CC BY-SA 2.0 (front, SE)
 *  - Cleveland_City_Hall_2.jpg, Mike Russell, CC BY-SA 3.0 (lake side, N)
 *  - Cleveland_City_Hall.png, Cards84664, CC BY-SA 4.0 (W end and front, SW)
 *  - City_Hall_Bldg-Fed_Ctr.jpg, Chris Light, CC BY-SA 4.0 (from above, SE)
 *  - HABS OHIO,18-CLEV,35-5 aerial of the north elevation, Tibor Gasparik,
 *    public domain (roof, rear pavilion)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the rear pavilion is drawn with engaged columns (the HABS aerial
 * shows columns there but not whether they stand free); the two small
 * light courts in the roof (lidar, ~10 m square, skylit at ~16 m) are left
 * out; capitals, balusters, window pediments and the lamps are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, cornice, panel, onWall, halfColumn, column, save } from './chi-field-museum'
import { hipRoof } from './chi-board-of-trade'

// ---------------------------------------------------------------------------
// Kit shared with the Cuyahoga County Courthouse.

/** A round-headed panel on wall a→b: jambs s0..s1 from z0 to the springing zs, then a semicircle. */
export function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  const pts: V3[] = [P(s0, z0, out), P(s1, z0, out)]
  for (let k = 0; k <= seg; k++) {
    const t = (k / seg) * Math.PI
    pts.push(P(c + r * Math.cos(t), zs + r * Math.sin(t), out))
  }
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}

/** The flat top of a ring between `outer` and `inner` (same corners), facing up. */
export function ringTop(p: Part, outer: XY[], inner: XY[], z: number) {
  for (let k = 0; k < outer.length; k++) {
    const l = (k + 1) % outer.length
    p.quad([outer[k][0], outer[k][1], z], [outer[l][0], outer[l][1], z], [inner[l][0], inner[l][1], z], [inner[k][0], inner[k][1], z])
  }
}

/** A parapet wall `t` thick standing on ring r from z0 to z1: outer and inner faces and its top. */
export function parapet(p: Part, r: XY[], z0: number, z1: number, t: number) {
  const i = inset(r, t)
  walls(p, r, z0, z1)
  walls(p, [...i].reverse(), z0, z1)
  ringTop(p, r, i, z1)
}

export type HallSpec = {
  /** Wing block: half-length along x, front (south, negative) and rear faces. */
  W: number; yF: number; yR: number
  /** Centre pavilion: half-width, the front piers' face, the rear face. */
  P: number; pF: number; pR: number
  /** Levels above z = 0: street, top of the rusticated base, column tops, main cornice, balustrade. */
  street: number; baseTop: number; colTop: number; cornTop: number; balTop: number
  /** The doors' sill, and the ground the front steps rise from (the map's sidewalk). */
  doorSill: number; stepsFrom: number
  /** Top of the pavilion's attic. */
  atticTop: number
  bay: number; endPier: number; colR: number
  /** The loggia's three openings: tall arched windows (courthouse) or two tiers of square ones. */
  loggiaArched: boolean
}

export type HallParts = { stone: Part; trim: Part; win: Part; door: Part; roof: Part; copper: Part }

/**
 * The shared Group Plan palazzo: wings with a giant order of engaged
 * columns over an arcaded rusticated base on all four sides, a balustrade,
 * and a centre pavilion with columns in antis before a recessed loggia on
 * the front, engaged columns on the rear, three arched doors, steps, and the
 * attic block (its top left to the caller). Roofs are the caller's too.
 */
export function groupPlanHall(s: HallSpec): HallParts {
  const stone = new Part(), trim = new Part(), win = new Part(), door = new Part(), roof = new Part(), copper = new Part()
  const { W, yF, yR, P, pF, pR, street, baseTop, colTop, cornTop, balTop, atticTop } = s
  const FR = cornTop - 1.2 // top of the frieze, foot of the cornice

  // Wings: one block, string course over the base, cornice, balustrade.
  const R = rect(-W, yF, W, yR)
  walls(stone, R, 0, FR)
  cornice(trim, R, baseTop - 0.7, baseTop, 0.3)
  cornice(trim, R, FR, cornTop, 0.9)
  ringTop(trim, inset(R, -0.36), inset(R, 0.3), cornTop)
  parapet(stone, inset(R, 0.3), cornTop, balTop - 0.35, 0.5)
  parapet(trim, inset(R, 0.2), balTop - 0.35, balTop, 0.7)

  // Wing bays, on every face.
  const H = colTop - baseTop
  const bayAt = (a: XY, b: XY, sc: number, colsAt: number[]) => {
    const w = Math.min(2.2, s.bay * 0.5)
    archPanel(win, a, b, sc - w / 2, sc + w / 2, street + 1.6, baseTop - 2.2 - w / 2)
    const ww = Math.min(2.0, s.bay * 0.46)
    panel(win, a, b, sc - ww / 2, sc + ww / 2, baseTop + 0.9, baseTop + 0.46 * H, 0.05)
    panel(win, a, b, sc - ww / 2, sc + ww / 2, baseTop + 0.56 * H, colTop - 0.9, 0.05)
    for (const c of colsAt) halfColumn(trim, trim, a, b, c, baseTop, colTop, s.colR, 6)
  }
  const faceBays = (a: XY, b: XY, s0: number, s1: number, edgeCols: [boolean, boolean]) => {
    const n = Math.max(1, Math.round((s1 - s0) / s.bay)), bw = (s1 - s0) / n
    for (let i = 0; i < n; i++) {
      const cols: number[] = []
      if (i > 0 || edgeCols[0]) cols.push(s0 + i * bw)
      if (i === n - 1 && edgeCols[1]) cols.push(s1)
      bayAt(a, b, s0 + (i + 0.5) * bw, cols)
    }
  }
  const L = 2 * W, D = yR - yF
  // Front (a = west end) and rear (a = east end): two wings each.
  const front: [XY, XY] = [[-W, yF], [W, yF]], rear: [XY, XY] = [[W, yR], [-W, yR]]
  for (const [a, b] of [front, rear]) {
    faceBays(a, b, s.endPier, W - P - 0.8, [true, false])
    faceBays(a, b, W + P + 0.8, L - s.endPier, [false, true])
  }
  // Ends.
  faceBays([W, yF], [W, yR], s.endPier, D - s.endPier, [true, true])
  faceBays([-W, yR], [-W, yF], s.endPier, D - s.endPier, [true, true])

  // Centre pavilion.
  const pw = 3.4, LH = P - pw, recess = yF - 0.6
  const PR = rect(-P, pF, P, pR)
  walls(stone, rect(-P, recess, P, pR), 0, FR)
  for (const sx of [-1, 1]) walls(stone, sx < 0 ? rect(-P, pF, -LH, recess) : rect(LH, pF, P, recess), 0, FR)
  block(stone, stone, rect(-LH, pF, LH, recess), 0, baseTop, 0.15)
  walls(stone, PR, colTop, FR)
  cap(stone, rect(-LH, pF, LH, recess), colTop, false) // soffit over the loggia
  cornice(trim, rect(-LH, pF, LH, recess), baseTop - 0.7, baseTop, 0.3)
  cornice(trim, PR, FR, cornTop, 0.9)
  ringTop(trim, inset(PR, -0.36), PR, cornTop)
  // Attic.
  walls(stone, PR, cornTop, atticTop - 0.9)
  cornice(trim, PR, atticTop - 0.9, atticTop, 0.45)

  // Free columns in antis: pairs by the piers, two between.
  const k = LH / 10.1
  for (const x of [-9.25, -7.55, -2.55, 2.55, 7.55, 9.25].map((v) => v * k)) column(trim, trim, x, pF + 0.8, baseTop, colTop, s.colR * 1.1, 10)
  // The loggia's three openings on its back wall.
  const lw: [XY, XY] = [[-LH, recess], [LH, recess]]
  for (const c of [-5.05 * k, 0, 5.05 * k]) {
    const sc = c + LH
    if (s.loggiaArched) {
      archPanel(win, lw[0], lw[1], sc - 1.6, sc + 1.6, baseTop + 1.4, colTop - 2.8)
      panel(win, lw[0], lw[1], sc - 1.0, sc + 1.0, baseTop + 0.2, baseTop + 1.0, 0.05)
    } else {
      panel(win, lw[0], lw[1], sc - 1.1, sc + 1.1, baseTop + 1.0, baseTop + 0.44 * H, 0.05)
      panel(win, lw[0], lw[1], sc - 1.1, sc + 1.1, baseTop + 0.56 * H, colTop - 0.9, 0.05)
    }
  }
  // Small windows in the front piers, two tiers.
  for (const x0 of [-P, LH]) {
    const a: XY = [-P, pF], b: XY = [P, pF], sc = x0 + pw / 2 + P
    panel(win, a, b, sc - 0.6, sc + 0.6, baseTop + 1.2, baseTop + 3.4, 0.05)
    panel(win, a, b, sc - 0.6, sc + 0.6, baseTop + 0.56 * H, baseTop + 0.56 * H + 2.4, 0.05)
  }
  // Rear pavilion: engaged columns on the same rhythm, windows between.
  {
    const a: XY = [P, pR], b: XY = [-P, pR]
    for (const x of [-9.25, -7.55, -2.55, 2.55, 7.55, 9.25].map((v) => v * k)) halfColumn(trim, trim, a, b, P - x, baseTop, colTop, s.colR, 6)
    for (const c of [-5.05 * k, 0, 5.05 * k]) {
      const sc = P - c
      archPanel(win, a, b, sc - 1.3, sc + 1.3, street + 1.0, baseTop - 2.7)
      panel(win, a, b, sc - 1.1, sc + 1.1, baseTop + 1.0, baseTop + 0.44 * H, 0.05)
      panel(win, a, b, sc - 1.1, sc + 1.1, baseTop + 0.56 * H, colTop - 0.9, 0.05)
    }
  }

  // Three arched doors under the loggia, in stone surrounds, and the steps.
  {
    const a: XY = [-P, pF], b: XY = [P, pF]
    for (const c of [-5.05 * k, 0, 5.05 * k]) {
      const sc = c + P
      archPanel(trim, a, b, sc - 2.0, sc + 2.0, s.doorSill, s.doorSill + 4.8, 0.04)
      archPanel(door, a, b, sc - 1.5, sc + 1.5, s.doorSill, s.doorSill + 4.8, 0.08)
    }
    // The steps: a landing under the doors, then four treads down to the sidewalk.
    const sw = LH + 0.5, n = 4, rise = (s.doorSill - s.stepsFrom) / n
    block(stone, stone, rect(-sw, pF - 1.2 - n * 0.9, sw, pF), 0, s.stepsFrom, 0.05)
    for (let i = 0; i < n; i++) {
      const d = 1.2 + (n - 1 - i) * 0.9
      block(stone, stone, rect(-sw + 0.15 * i, pF - d, sw - 0.15 * i, pF), s.stepsFrom + i * rise, s.stepsFrom + (i + 1) * rise, 0.04)
    }
  }

  return { stone, trim, win, door, roof, copper }
}

// ---------------------------------------------------------------------------
// Cleveland City Hall

function build() {
  const W = 50, yF = -30.6, yR = 31.0, P = 13.5, pF = -33.0, pR = 32.6
  const spec: HallSpec = {
    W, yF, yR, P, pF, pR,
    street: 3.0, doorSill: 4.0, stepsFrom: 3.0, baseTop: 12.4, colTop: 23.4, cornTop: 26.6, balTop: 29.4, atticTop: 34.6,
    bay: 4.2, endPier: 3.2, colR: 0.7, loggiaArched: false,
  }
  const h = groupPlanHall(spec)

  // The copper roof over the wings: a steep hip behind the balustrade up to
  // a flat top at 33.1, about 8 m in from the walls.
  const R = rect(-W, yF, W, yR)
  const eave = inset(R, 0.8), top = inset(R, 8.0)
  walls(h.copper, eave, 28.6, 33.1, top)
  cap(h.roof, top, 33.1)
  // The attic's own copper hip, ridge along y.
  cap(h.copper, rect(-P - 0.18, pF - 0.18, P + 0.18, pR + 0.18), 34.6)
  hipRoof(h.copper, -P + 0.4, pF + 0.4, P - 0.4, pR - 0.4, 34.6, 39.4)

  return [
    { part: h.stone, material: finish('cle-hall-granite', 0xd7d4cc) },
    { part: h.trim, material: finish('cle-hall-granite-trim', 0xe8e5de) },
    { part: h.win, material: PALETTE.window },
    { part: h.copper, material: finish('cle-hall-copper', 0x8db39f) },
    { part: h.roof, material: PALETTE.roof },
    { part: h.door, material: finish('cle-hall-bronze', 0x6f6c5c) },
  ]
}

if (import.meta.main) await save('cle-city-hall', 'Cleveland City Hall', [41.505113, -81.693641], 325.9, build(), 6500)
