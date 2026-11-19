/**
 * Charity Hospital ("Big Charity", 1939, Weiss, Dreyfous & Seiferth), 1532
 * Tulane Avenue, New Orleans. Vacant since 2005 and being redeveloped;
 * construction fencing and scaffolding are not modelled. Procedural,
 * CC0-1.0, no textures.
 * bun generators/nola-charity-hospital.ts [out.glb]
 *
 * What makes it read as itself: a huge pale grey Art Deco mass in an E/H
 * plan, every block a sheer cliff of vertical window strips between
 * continuous piers; a central tower rising to ~20 storeys out of a long
 * ~16-storey cross bar, with lower setbacks on its flanks; two big flanking
 * pavilions on the Tulane Avenue front and a lower central front block
 * between them over a low podium; long back wings; every block top stepped
 * in at the corners (the Art Deco setback crowns); the white zig-zag stack
 * of open stair balconies on the LaSalle Street side.
 *
 * Frame: x along compass 114.75 (the Tulane front runs along x), y along
 * compass 24.75 (model north; the Tulane Avenue front faces -y), z up,
 * metres (glTF +Y up, -Z north). Bearing 24.75: the long front and bar of
 * OSM way/328669535 are square to it. Anchor = area centroid of
 * way/328669535, -90.0781242 29.9551377. z = 0 is the street (lidar
 * ground ~0.6 above ground_min); the site is flat (Mapterhorn relief under
 * 1.5 m). elevation 0.
 *
 * Sources
 * - OSM: way/328669535 (building=hospital, height 84, "Charity Hospital",
 *   one outline over the whole building; no parts).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid, read in this frame with tools/lidar_frame.py, heights above
 *   the street (all measured): tower 81.0 (x -6..12, y -12..21), its peak
 *   83.4, flank setbacks 72.2 (x -9..-6, 12..15); cross bar 58.5 (x -45..45,
 *   y 3..21) with crowns to 60.5; front pavilions 51.5 (x -60..-45, y
 *   -40..15, and x 44..63, y -40..2) with front crowns 55.5; central front block 50.5
 *   (x -9..15, y -40..-9), crown 54.5; front podium 11.5 (y -40..-15);
 *   back wings 51.5 with crowns 55.5 (north-west x -57..-21, y 15..63, drawn to the OSM line at 61;
 *   a block x 44..63, y 2..22, flush with the pavilion on LaSalle; north-east
 *   x 33..55, y 22..58, set 8 m back); the stair stack standing 2-3 m proud of the LaSalle face at
 *   y 7..15, 51.5 (2 m grid, review round 2); light courts at street level between.
 * - Published: 20 storeys, opened 1939 (Wikipedia, "Charity Hospital (New
 *   Orleans)"); OSM 84 m agrees with the lidar peak.
 * - NAIP (USGS, public domain): the plan, courts, flat grey roofs.
 * - Photos (EVIDENCE):
 *   p01 "Charity Hospital - New Orleans (55151710756).jpg", ajay_suresh, CC
 *     BY 4.0, Feb 2026 from the east (GPS): the current state, the massing,
 *     window strips and piers, stepped tops, the white stair stack;
 *     https://commons.wikimedia.org/wiki/File:Charity_Hospital_-_New_Orleans_(55151710756).jpg
 *   p03 "Big Charity at Gravier & LaSalle, New Orleans, October 2021.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0, from the north-east: the
 *     sheer piers, the stair stack, colour;
 *     https://commons.wikimedia.org/wiki/File:Big_Charity_at_Gravier_%26_LaSalle,_New_Orleans,_October_2021.jpg
 *   p04 "Charity Hospital Tulane Avenue New Orleans seen from LaSalle Street
 *     corner", Infrogmation of New Orleans, CC BY-SA 4.0: the front
 *     pavilion's notched crown, the stack beyond;
 *     https://commons.wikimedia.org/wiki/File:Charity_Hospital_Tulane_Avenue_New_Orleans_seen_from_LaSalle_Street_corner.jpg
 *   p05 "BigCharityFromCleveland.JPG", Infrogmation of New Orleans, CC BY-SA
 *     3.0, from the north: tower over the bar and back wings;
 *     https://commons.wikimedia.org/wiki/File:BigCharityFromCleveland.JPG
 *   p02 "Charity Hospital NOLA.jpg", Vegasjon, CC BY-SA 3.0: close-up of the
 *     window strips and a stair stack in a court.
 *     https://commons.wikimedia.org/wiki/File:Charity_Hospital_NOLA.jpg
 * - Look-only: none.
 *
 * Estimated (from p01, p03, p04 scaled to the lidar heights): storeys 3.7
 * m, grouped two to a window panel; bays 3.3 m with 1.25 m panels (38% of
 * the bay, so the wall reads as stone with vertical rows of windows; review
 * round 2); ground floor to 4.5 m; crowns as two tiers over the top 10 m,
 * corners notched 2.75 m then 5.5 m; proud piers (0.8 m wide, 0.45 m out)
 * between the window rows on the tower, the pavilions' Tulane faces and
 * the front block, each carried 1.2 m above the setback it stands on; the
 * stair stack as a white shaft with an open slab every storey, 3.5 m proud
 * and 10 m wide; the Tulane entrance 8 m wide.
 * Stair stack position (review round 2): p01 (from the east, 2026) and p04
 * (from Tulane and LaSalle) both show it on the LaSalle face just north of
 * the east pavilion, not on the pavilion; the 2 m lidar grid shows a 2-3 m
 * projection there at y 7..15. Colours from the 2021-26 daylight photos,
 * pulled to the palette: weathered light grey-buff stucco #d6d3cb, windows
 * the palette slate, stair stack painted white #f6f5f1 (it reads markedly
 * whiter than the stucco in every photo).
 * Night: vacant and dark in reality; windows are `window` by convention
 * (the redevelopment will light them), no floodlight.
 * Left out: the Art Deco relief panels and grilles, the bridge to the
 * Tulane medical buildings, small back additions under 8 m, fencing.
 *
 * Doubts: the west and north faces are seen only from far (p05); the
 * window rhythm there is assumed the same. Only one stair stack is drawn
 * (the one on LaSalle Street, p01/p03/p04; p01 suggests a slight recess
 * between it and the pavilion that the lidar does not show); p02 shows others inside the
 * courts. Crown step sizes are estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, rows, panel, onWall, save } from './chi-aon-center'

const ST = 3.7 // storey
const BAY = 3.3, WIN = 1.25 // windows about 38% of the bay (review round 2)

type Faces = string // which faces get windows: S (-y), E (+x), N (+y), W (-x)

/** A rectangle with each corner notched back `n` along both edges, counter-clockwise. */
function notched(x0: number, y0: number, x1: number, y1: number, n: number): XY[] {
  if (n <= 0) return rect(x0, y0, x1, y1)
  return [[x0 + n, y0], [x1 - n, y0], [x1 - n, y0 + n], [x1, y0 + n], [x1, y1 - n], [x1 - n, y1 - n], [x1 - n, y1], [x0 + n, y1], [x0 + n, y1 - n], [x0, y1 - n], [x0, y0 + n], [x0 + n, y0 + n]]
}

function wallsSeg(p: Part, r: XY[], z0: number, z1: number, seg = 5) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / seg))
    for (let k = 0; k < n; k++) {
      const p0: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const p1: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
    }
  }
}

/**
 * A block with an Art Deco stepped crown: the full plan to h - crown, then
 * corner notches of `step` and 2*`step` for the top two tiers. Windows on
 * the listed faces, two storeys to a panel, from z0w to below the crown.
 */
function block(stone: Part, roof: Part, win: Part, x0: number, y0: number, x1: number, y1: number, h: number, o: { faces?: Faces; crown?: number; step?: number; base?: number; z0w?: number } = {}) {
  const crown = o.crown ?? 0, step = o.step ?? 2, base = o.base ?? 0
  const tiers: [XY[], number, number][] = crown > 0
    ? [[rect(x0, y0, x1, y1), base, h - crown], [notched(x0, y0, x1, y1, step), h - crown, h - crown / 2], [notched(x0, y0, x1, y1, 2 * step), h - crown / 2, h]]
    : [[rect(x0, y0, x1, y1), base, h]]
  for (let t = 0; t < tiers.length; t++) {
    const [r, za, zb] = tiers[t]
    const last = t === tiers.length - 1, bv = last ? 0.4 : 0
    if (za < 3) { wallsSeg(stone, r, za, 3); walls(stone, r, 3, zb - bv) } else walls(stone, r, za, zb - bv)
    if (last) {
      const b = inset(r, bv)
      walls(stone, r, zb - bv, zb, b)
      cap(roof, b, zb)
    } else cap(stone, r, zb) // the ledges left where the next tier's corners step in
  }
  // windows
  const faces = o.faces ?? 'SENW'
  const zTop = h - crown - 1.2, zBot = Math.max(base, 0) + (o.z0w ?? 4.5)
  if (zTop - zBot < 3) return
  const n = Math.max(1, Math.round((zTop - zBot) / (2 * ST)))
  const groups = rows(zBot, zTop, n, 1.4)
  const R = rect(x0, y0, x1, y1)
  const map: Record<string, number> = { S: 0, E: 1, N: 2, W: 3 }
  for (const f of faces) {
    const a = R[map[f]], b = R[(map[f] + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.floor((L - 2.0) / BAY)
    if (k < 1) continue
    const s0 = (L - k * BAY) / 2 + (BAY - WIN) / 2
    for (let q = 0; q < k; q++) for (const [za, zb] of groups) panel(win, a, b, s0 + q * BAY, s0 + q * BAY + WIN, za, zb)
  }
}

/** Bay layout along a face: window starts, as `block` places them. */
function layout(L: number) {
  const k = Math.floor((L - 2.0) / BAY)
  return { k, s0: (L - k * BAY) / 2 + (BAY - WIN) / 2 }
}
/**
 * Proud Art Deco piers between the window rows of the listed faces, from z0
 * up through the crown: a pier stops 1.2 m above the tier its line still
 * stands on, so the stepped corners keep their piers as stepped heads.
 */
function piers(stone: Part, x0: number, y0: number, x1: number, y1: number, h: number, crown: number, step: number, faces: Faces, z0: number) {
  const R = rect(x0, y0, x1, y1), map: Record<string, number> = { S: 0, E: 1, N: 2, W: 3 }
  const W = 0.8, D = 0.45
  for (const f of faces) {
    const a = R[map[f]], b = R[(map[f] + 1) % 4]
    const { P, L } = onWall(a, b), { k, s0 } = layout(L)
    for (let q = 0; q < k - 1; q++) {
      const c = s0 + q * BAY + WIN + (BAY - WIN) / 2
      const edge = Math.min(c, L - c) - W / 2
      const top = crown <= 0 ? h + 1.2 : edge >= 2 * step ? h + 1.2 : edge >= step ? h - crown / 2 + 1.2 : h - crown + 1.2
      const r: XY[] = [P(c - W / 2, 0, D), P(c + W / 2, 0, D), P(c + W / 2, 0, 0), P(c - W / 2, 0, 0)].map((v: V3) => [v[0], v[1]] as XY)
      // front and two sides (the back is against the wall), and the top
      for (const i of [0, 1, 3]) {
        const p0 = r[i], p1 = r[(i + 1) % 4]
        stone.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], top], [p0[0], p0[1], top])
      }
      cap(stone, r, top)
    }
  }
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), trim = new Part(), door = new Part()

  // ---- Front podium (Tulane side) and the light courts' low fill.
  block(stone, roof, win, -45, -40, -9, -15, 11.5, { faces: 'S', z0w: 4.5 })
  block(stone, roof, win, 15, -40, 44, -15, 11.5, { faces: 'S', z0w: 4.5 })

  // ---- Front pavilions and central front block.
  const CR = 10, STP = 2.75 // crowns: two tiers over the top 10 m, corners notched 2.75 m then 5.5 m
  block(stone, roof, win, -60, -40, -45, 15, 51.5, { faces: 'SEW', crown: CR, step: STP })
  block(stone, roof, win, 44, -40, 63, 2, 51.5, { faces: 'SEW', crown: CR, step: STP })
  block(stone, roof, win, -9, -40, 15, -9, 50.5, { faces: 'SEW', crown: CR, step: STP })
  piers(stone, -60, -40, -45, 15, 51.5, CR, STP, 'S', 4.5)
  piers(stone, 44, -40, 63, 2, 51.5, CR, STP, 'SE', 4.5)
  piers(stone, -9, -40, 15, -9, 50.5, CR, STP, 'S', 7.5)

  // ---- The cross bar and the central tower.
  block(stone, roof, win, -45, 3, -9, 21, 58.5, { faces: 'SN', crown: 4, step: 1.5 })
  block(stone, roof, win, 15, 3, 44, 21, 58.5, { faces: 'SN', crown: 4, step: 1.5 })
  block(stone, roof, win, -9, -12, 15, 24, 72.2, { faces: 'SNEW', z0w: 52 }) // windows only where it clears the bar and front block
  block(stone, roof, win, -6, -12, 12, 21, 81.0, { faces: 'SNEW', crown: CR, step: STP, base: 72.2 - 0.4, z0w: 1.0 })
  // the tower's proud piers, carried up past each setback
  piers(stone, -9, -12, 15, 24, 72.2, 0, 0, 'S', 50.5)
  piers(stone, -9, -12, 15, 24, 72.2, 0, 0, 'NEW', 58.5)
  piers(stone, -6, -12, 12, 21, 81.0, CR, STP, 'SNEW', 72.2)
  // the peak's small top
  {
    const r = rect(-1.5, -1.5, 4.5, 4.5)
    walls(stone, r, 80.6, 83.4)
    cap(roof, r, 83.4)
  }

  // ---- Back wings.
  block(stone, roof, win, -57, 15, -21, 42, 51.5, { faces: 'NW' })
  block(stone, roof, win, -45, 42, -21, 61, 51.5, { faces: 'NEW', crown: CR, step: STP })
  block(stone, roof, win, 44, 2, 63, 22, 51.5, { faces: 'E' })
  block(stone, roof, win, 33, 22, 55, 58, 51.5, { faces: 'ENW', crown: CR, step: STP })

  // ---- The white stair-balcony stack on the LaSalle (east) face, just north of the
  // east pavilion (p01 and p04 both show it on the block north of the pavilion; lidar
  // shows it standing 2-3 m proud at y 7..15 to 51.5): a white shaft with an open
  // balcony slab every storey, its top box a little above the block.
  {
    const x0 = 63, x1 = 66.5, y0 = 6, y1 = 16
    const core = rect(x0, y0 + 2.5, x1 - 1.8, y1 - 2.5)
    walls(trim, core, 0, 53.0)
    cap(trim, core, 53.0)
    for (let z = 4.5; z < 51; z += ST) {
      const r = rect(x0, y0, x1, y1)
      walls(trim, r, z, z + 0.9)
      cap(trim, r, z + 0.9)
      cap(trim, r, z, false)
    }
  }

  // ---- The Tulane Avenue entrance: a stone surround with doors, in the central block.
  {
    const a: XY = [-9, -40], b: XY = [15, -40]
    const { P } = onWall(a, b)
    const s0 = 8, s1 = 16
    const sur: XY[] = [P(s0 - 1, 0, 0.6), P(s1 + 1, 0, 0.6), P(s1 + 1, 0, 0), P(s0 - 1, 0, 0)].map((v: V3) => [v[0], v[1]] as XY)
    walls(stone, sur, 0, 7.5)
    cap(stone, sur, 7.5)
    panel(door, a, b, s0, s1, 0, 4.2, 0.64)
    panel(win, a, b, s0, s1, 4.6, 6.8, 0.64)
  }

  return [
    { part: stone, material: finish('charity-stucco', 0xd6d3cb) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('charity-white', 0xf6f5f1) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('nola-charity-hospital', 'Charity Hospital', [29.9551377, -90.0781242], 24.75, build(), 6500)
