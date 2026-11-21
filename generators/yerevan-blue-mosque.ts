/**
 * Blue Mosque (Gök Jami, Կապույտ մզկիթ), Mashtots Avenue, Yerevan:
 * procedural, CC0-1.0.
 *   bun generators/yerevan-blue-mosque.ts   (writes the low and the detail model)
 *
 * The 18th-century Friday mosque of Husayn Ali Khan (1765-1766), restored
 * 1996-1999. Identity, in order: the turquoise tiled dome, pointed and
 * bulbous, on a drum over the brick prayer hall, with yellow cartouches;
 * the single minaret at the south-east corner, a brick shaft with blue
 * tile lozenges, a corbelled balcony under a dark canopy and a turquoise
 * tiled top; the tiled portal (pishtaq) facing the court with its pointed
 * arch; the low brick ranges of cells round the large garden court, each
 * cell a pointed-arch iwan; two smaller plain brick domes beside the main
 * one; red metal roofs; brick.
 *
 * Frame: x east, y north (bearing 359.6), z up, metres. Origin: the area
 * centroid of the four OSM ways below, 44.5055868, 40.1781766.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): way/235841246 (the south range with the
 *   prayer hall, named Blue Mosque), way/235841247 (the west range),
 *   way/33045820 (building=mosque, 2 levels: the east and north ranges),
 *   way/1327469819 (man_made=tower, tower:type=minaret: the minaret's base,
 *   6.5 x 5.4 m, at the south-east corner).
 * - Published: the mosque's own plaque (photographed by 23artashes, CC
 *   BY-SA 4.0, "Blue Mosque, Yerevan in 2019 14.jpg"): built 1765 by order
 *   of Hussein Ali Khan; a central prayer hall of 442 m², the main dome 20
 *   m high and the minaret 24 m; a library and 26 small rooms; rebuilt
 *   1996-1999.
 * - Photos (Wikimedia Commons, evidence):
 *   b1 Petar Milošević, CC BY-SA 4.0, "Minaret of Blue Mosque, Yerevan,
 *      Armenia (2026).jpg": the minaret's top, balcony and patterns
 *      https://commons.wikimedia.org/wiki/File:Minaret_of_Blue_Mosque,_Yerevan,_Armenia_(2026).jpg
 *   b3 Petar Milošević, CC BY-SA 4.0, "Dome of Blue Mosque, Yerevan,
 *      Armenia.jpg": the dome's tiles close
 *      https://commons.wikimedia.org/wiki/File:Dome_of_Blue_Mosque,_Yerevan,_Armenia.jpg
 *   b9 23artashes, CC BY-SA 4.0, "Blue Mosque, Yerevan in 2019 04.jpg":
 *      the dome over the street range's red roof
 *      https://commons.wikimedia.org/wiki/File:Blue_Mosque,_Yerevan_in_2019_04.jpg
 *   c3 RG72, CC BY-SA 4.0, "Korto de la Blua moskeo en Erevano 01.jpg":
 *      the court's iwans through an arch
 *      https://commons.wikimedia.org/wiki/File:Korto_de_la_Blua_moskeo_en_Erevano_01.jpg
 *   c6 Yerevantsi, CC BY-SA 4.0, "Yerevan Blue mosque 2023 dome and
 *      minaret.jpg": from the south, high: the prayer hall, the dome, the
 *      side domes, the street portal and the minaret
 *      https://commons.wikimedia.org/wiki/File:Yerevan_Blue_mosque_2023_dome_and_minaret.jpg
 *   c7 RG72, CC BY-SA 4.0, "Blua moskeo en Erevano 35.jpg": a range of
 *      iwans in the court
 *      https://commons.wikimedia.org/wiki/File:Blua_moskeo_en_Erevano_35.jpg
 *   c9 Valen1988, CC BY-SA 4.0, "Blue Mosque, Yerevan.jpg": from the court
 *      along its axis: the tiled pishtaq under the dome
 *      https://commons.wikimedia.org/wiki/File:Blue_Mosque,_Yerevan.jpg
 * - Look-only: none. ("Blue Mosque Courtyard Dusk" on Commons is
 *   Istanbul's and was not used.)
 *
 * Numbers
 * - Plan: OSM, measured. The prayer hall 16 x 15 m on the court's axis
 *   (c9; the plaque's 442 m² includes its side halls).
 * - Heights: the dome's top 20 m and the minaret 24 m are published. From
 *   c6 (0.04 m/px at the hall): the hall's walls 10.5 m, the drum to 13.0
 *   (a blue tile band from 12), the dome 14.4 m across at its widest just
 *   above its base and rising 10.6 m to a point at 23.6, the finial to 25.7
 *   (c6: dome and drum together about as tall again as the hall); the side
 *   halls' eaves 7.9 and their shallow domes to 11.3; the minaret's shaft
 *   3.6 m across, its balcony at 18.2 m (b1: the brick shaft runs on inside the railing to
 *   a dark canopy at 20 m), the tiled top 2.4 m across, 20.6-22.9. The
 *   court ranges 6-7 m (c3, c7), their iwans 2.6 m wide on 3.6 m bays,
 *   2 m deep.
 * - Colours: the brick #9e7962 sunlit, #946c54 lower (c6): drawn #a77a63;
 *   the red roofs #ae433f (c6): drawn #a84a42; the dome's turquoise
 *   #4e93c6 to #73abae (c6, c9, b3): drawn #4fadc2; the blue tile #2d71ad
 *   (b3): drawn #3d79b0; the yellow cartouches and finials gold #d0a640.
 *
 * Doubts
 * - The ranges' outer walls on the streets are plain brick (b6, c6); the
 *   court sides of the north and east ranges are only seen far off (c5).
 * - The mosaics are drawn as plain tile colours; the dome's cartouches are
 *   raised gold medallions in the detail model only.
 * - The dome's top is drawn at 23.6 m, above the plaque's 20 m: fitted to
 *   c6's proportions on lead review (the plaque's figure may be measured
 *   from the hall's roof or exclude the point).
 * - Terrain: Mapterhorn z12 is near flat here (1-2 m over the site).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import {
  type XY, rectRing, walls, capRing, hipRoof, faceOf, onFace, archOutline, facePanel, screen,
  blockOnFace, save, wallLight, fquad, lathe, TAU, blockXY, column,
} from './yerevan-government-house'

const BEARING = 359.6
// plan, measured from OSM in the frame above
const SOUTH = { x0: -35.7, x1: 30.6, y0: -42.5, y1: -27.4 }
const WEST = { x0: -35.6, x1: -25.3, y0: -27.4, y1: 44.8 }
const EAST = { x0: 20.6, x1: 31.4, y0: -28.1, y1: 44.4 }
const NORTH = { x0: -25.3, x1: 31.9, y0: 44.4, y1: 53.6 }
const COURT = { x0: -25.3, x1: 20.6, y0: -27.4, y1: 44.4 }
const AXIS = (COURT.x0 + COURT.x1) / 2 // the court's axis, the prayer hall's centre line
const HALL = { x0: AXIS - 8, x1: AXIS + 8, y0: SOUTH.y0, y1: SOUTH.y1 }
const MIN: XY = [33.8, -40.0]
const Z = { range: 6.0, north: 7.0, south: 7.9, hall: 10.5, drum: 13.0, domeTop: 23.6, side: 11.3, minBase: 7.5, balcony: 18.2, minTop: 22.6 }

function build(detail: boolean) {
  const brick = new Part(), roof = new Part(), turq = new Part(), tile = new Part(), win = new Part(), gold = new Part()
  const SEG = detail ? 10 : 6, NR = detail ? 32 : 16

  // ── the court ranges: cells behind pointed-arch iwans on the court side ──
  type R = { x0: number; x1: number; y0: number; y1: number }
  const range = (r: R, h: number, court: 'n' | 's' | 'e' | 'w', from: number, to: number) => {
    const D = 2.0, ZA = 4.6
    // the court face line and the inset line
    const inset: R = { ...r }
    if (court === 'e') inset.x1 = r.x1 - D
    if (court === 'w') inset.x0 = r.x0 + D
    if (court === 'n') inset.y1 = r.y1 - D
    if (court === 's') inset.y0 = r.y0 + D
    // below the arcade's top the court face is set back between `from` and `to` along it
    const along = court === 'e' || court === 'w' ? 'y' : 'x'
    const lo = Math.max(from, along === 'y' ? r.y0 : r.x0), hi = Math.min(to, along === 'y' ? r.y1 : r.x1)
    const ring: XY[] = []
    // build the low ring by walking the rectangle and notching the court side
    const P = (a: number, w: number): XY => {
      if (court === 'e') return [r.x1 - w, a]
      if (court === 'w') return [r.x0 + w, a]
      if (court === 'n') return [a, r.y1 - w]
      return [a, r.y0 + w]
    }
    const A0 = along === 'y' ? r.y0 : r.x0, A1 = along === 'y' ? r.y1 : r.x1
    const courtPath: XY[] = [P(A0, 0), P(lo, 0), P(lo, D), P(hi, D), P(hi, 0), P(A1, 0)]
    // the other three corners
    const far: XY[] = court === 'e' ? [[r.x0, r.y1], [r.x0, r.y0]] : court === 'w' ? [[r.x1, r.y1], [r.x1, r.y0]] : court === 'n' ? [[r.x1, r.y0], [r.x0, r.y0]] : [[r.x1, r.y1], [r.x0, r.y1]]
    ring.push(...courtPath, ...far)
    walls(brick, ring, 0, ZA)
    walls(brick, rectRing(r.x0, r.y0, r.x1, r.y1), ZA, h)
    // ceiling and floor of the iwans
    const q = [P(lo, 0), P(hi, 0), P(hi, D), P(lo, D)].map(([x, y]) => [x, y, ZA] as V3)
    fquad(brick, q[0], q[1], q[2], q[3], [0, 0, -1])
    // the screen: a pointed arch per bay
    const fa = court === 'e' || court === 's' ? faceOf(P(lo, 0), P(hi, 0)) : faceOf(P(hi, 0), P(lo, 0))
    const n = Math.round((hi - lo) / 3.6), bay = (hi - lo) / n
    const holes: XY[][] = []
    for (let i = 0; i < n; i++) holes.push(archOutline(i * bay + (bay - 2.6) / 2, i * bay + (bay + 2.6) / 2, 0.45, 2.9, SEG, 0.7))
    screen(brick, fa, rectRing(0, 0, fa.L, ZA), holes, 0.55, brick)
    // a blue tile frame round each arch (the court iwans have tile borders), doors and windows at the back
    const fb = court === 'e' || court === 's' ? faceOf(P(lo, D), P(hi, D)) : faceOf(P(hi, D), P(lo, D))
    for (let i = 0; i < n; i++) {
      const c = i * bay + bay / 2
      facePanel(tile, fa, pointedBand(c, 1.3, 1.6, 2.9, SEG), 0.06)
      facePanel(win, fb, rectRing(c - 0.6, 0.45, c + 0.6, 2.6), 0.04)
    }
    // the roof: low red hipped metal
    hipRoof(roof, rectRing(r.x0 - 0.3, r.y0 - 0.3, r.x1 + 0.3, r.y1 + 0.3), h, Math.min(r.x1 - r.x0, r.y1 - r.y0) / 2 - 0.4, 1.4)
  }
  range(WEST, Z.range, 'e', COURT.y0, COURT.y1)
  range(EAST, Z.range, 'w', COURT.y0, COURT.y1)
  range(NORTH, Z.north, 's', COURT.x0, COURT.x1)

  // ── the south range: side halls, the prayer hall ──
  const S = SOUTH
  // west and east parts of the range (outside the prayer hall)
  for (const [x0, x1] of [[S.x0, HALL.x0], [HALL.x1, S.x1]] as Array<[number, number]>) {
    walls(brick, rectRing(x0, S.y0, x1, S.y1), 0, Z.south)
    hipRoof(roof, rectRing(x0 - 0.3, S.y0 - 0.3, x1 + 0.3, S.y1 + 0.3), Z.south, (S.y1 - S.y0) / 2 - 0.4, 1.3)
    // pointed windows on the street and court faces
    for (const [fy, out] of [[S.y0, -1], [S.y1, 1]] as Array<[number, number]>) {
      const f = out < 0 ? faceOf([x0, fy], [x1, fy]) : faceOf([x1, fy], [x0, fy])
      const n = Math.floor((x1 - x0 - 2) / 4.4)
      for (let i = 0; i < n; i++) {
        const s = (f.L - (n - 1) * 4.4) / 2 + i * 4.4
        facePanel(win, f, archOutline(s - 0.8, s + 0.8, 2.6, 5.0, SEG, 0.7), 0.05)
      }
    }
  }
  // the side halls' shallow brick domes either side of the hall
  for (const cx of [HALL.x0 - 5.4, HALL.x1 + 5.4]) {
    const c: XY = [cx, (S.y0 + S.y1) / 2]
    lathe(brick, [[4.9, Z.south + 0.5], [4.9, 8.9], [4.5, 9.8], [3.6, 10.6], [2.2, 11.1], [0, 11.3]], NR, c)
  }

  // the prayer hall: brick walls with the tiled pishtaq on the court side
  const H = HALL, PD = 2.4, PW = 3.1 // the pishtaq's arch recess depth and half width
  {
    const mid = (H.x0 + H.x1) / 2
    // walls, notched on the north face for the arch recess up to its crown
    const ring: XY[] = [[H.x0, H.y0], [H.x1, H.y0], [H.x1, H.y1], [mid + PW, H.y1], [mid + PW, H.y1 - PD], [mid - PW, H.y1 - PD], [mid - PW, H.y1], [H.x0, H.y1]]
    walls(brick, ring, 0, 8.6)
    walls(brick, rectRing(H.x0, H.y0, H.x1, H.y1), 8.6, Z.hall)
    fquad(tile, [mid - PW, H.y1, 8.6], [mid + PW, H.y1, 8.6], [mid + PW, H.y1 - PD, 8.6], [mid - PW, H.y1 - PD, 8.6], [0, 0, -1])
    capRing(roof, rectRing(H.x0, H.y0, H.x1, H.y1), Z.hall)
    // a red roof rim like the photos' eaves
    for (const [a, b] of [[[H.x0, H.y0], [H.x1, H.y0]], [[H.x1, H.y0], [H.x1, H.y1]], [[H.x0, H.y1], [H.x0, H.y0]]] as Array<[XY, XY]>) {
      const f = faceOf(a, b)
      blockOnFace(roof, f, -0.3, f.L + 0.3, Z.hall - 0.2, Z.hall + 0.35, 0.35, -0.6)
    }
    // the pishtaq: a tiled slab standing proud of the north face, rising above the roof, with a pointed arch
    const fp = faceOf([H.x1 + 0.0, H.y1 + 1.0], [H.x0 - 0.0, H.y1 + 1.0])
    screen(turq, fp, rectRing(0.4, 0, fp.L - 0.4, 11.9), [archOutline(fp.L / 2 - PW, fp.L / 2 + PW, 0.4, 5.6, SEG + 2, 0.72)], 1.0, tile)
    blockOnFace(tile, fp, 0.2, fp.L - 0.2, 11.9, 12.3, 0.15, -1.15)
    // a blue border down the slab's edges
    blockOnFace(tile, fp, 0.4, 1.0, 0, 11.9, 0.08, -0.1)
    blockOnFace(tile, fp, fp.L - 1.0, fp.L - 0.4, 0, 11.9, 0.08, -0.1)
    // a turquoise-and-gold band round the arch and a panel above (mosaic fields)
    facePanel(gold, fp, pointedBand(fp.L / 2, PW, PW + 0.5, 5.6, SEG + 2), 0.06)
    facePanel(tile, fp, rectRing(fp.L / 2 - 4.6, 9.6, fp.L / 2 + 4.6, 11.3), 0.06)
    // inside the arch: the glazed doors and the window over them
    const fr = faceOf([mid + PW, H.y1 - PD], [mid - PW, H.y1 - PD])
    facePanel(win, fr, archOutline(0.35, fr.L - 0.35, 0.4, 5.4, SEG, 0.72), 0.04)
    // street side: three pointed windows (c6)
    const fs = faceOf([H.x0, H.y0], [H.x1, H.y0])
    for (const s of [-4.2, 0, 4.2]) facePanel(win, fs, archOutline(fs.L / 2 + s - 1.0, fs.L / 2 + s + 1.0, 4.6, 7.2, SEG, 0.7), 0.05)
    for (const fx of [faceOf([H.x0, H.y1], [H.x0, H.y0]), faceOf([H.x1, H.y0], [H.x1, H.y1])]) facePanel(win, fx, archOutline(fx.L / 2 - 0.9, fx.L / 2 + 0.9, 8.3, 10.0, SEG, 0.7), 0.05)

    // the drum and the dome
    const c: XY = [mid, (H.y0 + H.y1) / 2]
    lathe(brick, [[7.2, Z.hall - 0.01], [7.2, 12.0]], NR, c)
    lathe(tile, [[7.2, 12.0], [7.2, Z.drum], [6.8, Z.drum]], NR, c)
    const prof: XY[] = [[6.8, Z.drum], [7.1, 13.7], [7.2, 14.6], [7.05, 15.8], [6.6, 17.1], [5.85, 18.4], [4.85, 19.7], [3.65, 20.9], [2.35, 21.95], [1.05, 22.9], [0, Z.domeTop]]
    lathe(tile, [[6.8, Z.drum], [7.1, 13.7], [7.16, 14.2], [7.2, 14.6], [7.15, 15.05]] as XY[], NR, c)
    lathe(turq, [[7.15, 15.05], ...prof.slice(3)] as XY[], NR, c)
    // the finial: a gold spike with balls
    lathe(gold, [[0.25, Z.domeTop - 0.15], [0.34, 23.8], [0.14, 24.05], [0.32, 24.4], [0.1, 24.7], [0.22, 24.95], [0.0, 25.7]], detail ? 10 : 6, c)
    // bold at every zoom: a gold zigzag on a blue band at the dome's foot and eight big gold cartouches
    for (let k = 0; k < 20; k++) {
      const t = (k * TAU) / 20
      zig(gold, c, t, TAU / 20, 13.75, 14.95, prof)
    }
    for (let k = 0; k < 8; k++) {
      const t = (k * TAU) / 8 + TAU / 16
      medallion(gold, c, t, 17.1, 3.2, prof)
      if (detail) medallion(tile, c, t + TAU / 16, 20.4, 1.1, prof)
    }
    if (detail) for (let k = 0; k < 32; k++) medallion(tile, c, (k * TAU) / 32, 15.35, 0.42, prof)
  }

  // ── the street portal beside the minaret (tiled, pointed arch) ──
  {
    const f = faceOf([23.4, S.y0 - 0.9], [29.6, S.y0 - 0.9])
    // a tiled block standing 0.9 out of the wall, its arch recess cut through it
    screen(turq, f, rectRing(0, 0, f.L, 8.4), [archOutline(f.L / 2 - 1.6, f.L / 2 + 1.6, 0.3, 4.8, SEG, 0.72)], 0.9, tile)
    blockOnFace(tile, f, -0.1, f.L + 0.1, 8.4, 8.8, 0.1, -1.0)
    facePanel(win, faceOf([24.9, S.y0], [28.1, S.y0]), archOutline(0.05, 3.15, 0.3, 4.8, SEG, 0.72), 0.04)
    facePanel(gold, f, pointedBand(f.L / 2, 1.6, 2.0, 4.8, SEG), 0.05)
  }

  // ── the minaret ──
  {
    blockXY(brick, MIN, 3.25, 2.7, 0, Z.minBase)
    blockXY(tile, MIN, 3.4, 2.85, Z.minBase - 0.4, Z.minBase)
    const n = detail ? 24 : 12
    // the shaft, with blue tile bands (lozenge friezes) round it
    lathe(brick, [[1.85, Z.minBase], [1.78, 10.4]], n, MIN)
    lathe(tile, [[1.78, 10.4], [1.77, 11.2]], n, MIN)
    lathe(brick, [[1.77, 11.2], [1.72, 14.0]], n, MIN)
    lathe(tile, [[1.72, 14.0], [1.71, 14.8]], n, MIN)
    lathe(brick, [[1.71, 14.8], [1.67, 16.6]], n, MIN)
    // the corbelled (muqarnas) balcony base in tile, flaring out
    lathe(tile, [[1.67, 16.6], [1.67, 16.9], [2.1, 17.5], [2.6, 18.0], [2.6, Z.balcony]], n, MIN)
    capRing(tile, Array.from({ length: n }, (_, i) => [MIN[0] + 2.6 * Math.cos((i * TAU) / n), MIN[1] + 2.6 * Math.sin((i * TAU) / n)] as XY), Z.balcony)
    // inside the balcony the brick shaft runs on to the canopy
    lathe(brick, [[1.5, Z.balcony], [1.5, 20.2]], n, MIN)
    // the railing: a low ring (low), posts and a rail (detail)
    if (!detail) lathe(brick, [[2.55, Z.balcony], [2.55, Z.balcony + 1.0], [2.4, Z.balcony + 1.0]], n, MIN)
    else {
      for (let k = 0; k < 16; k++) { const t = (k * TAU) / 16; column(brick, [MIN[0] + 2.45 * Math.cos(t), MIN[1] + 2.45 * Math.sin(t)], 0.06, Z.balcony, 20.0, 4) }
      lathe(brick, [[2.55, Z.balcony + 0.9], [2.55, Z.balcony + 1.05], [2.35, Z.balcony + 1.05], [2.35, Z.balcony + 0.9]], n, MIN)
    }
    // the dark canopy, then the turquoise tiled drum, its small dome and the finial
    lathe(tile, [[2.8, 19.95], [2.8, 20.15], [1.2, 20.7]], n, MIN)
    lathe(turq, [[1.2, 20.6], [1.2, Z.minTop]], n, MIN)
    lathe(tile, [[1.32, Z.minTop - 0.05], [1.32, Z.minTop + 0.25]], n, MIN)
    lathe(turq, [[1.3, Z.minTop + 0.25], [1.25, 22.95], [0.95, 23.45], [0.45, 23.8], [0, 23.95]], n, MIN)
    lathe(gold, [[0.12, 23.9], [0.2, 24.15], [0.08, 24.35], [0.16, 24.55], [0, 25.1]], detail ? 8 : 5, MIN)
    if (detail) {
      // the shaft's lozenge net: small blue diamonds
      for (let row = 0; row < 6; row++) for (let k = 0; k < 10; k++) {
        const z = 8.4 + row * 1.45 + (row > 1 ? 0.8 : 0) + (row > 3 ? 0.8 : 0), t = ((k + (row % 2) * 0.5) * TAU) / 10
        if (z > 16.4) continue
        diamond(tile, MIN, 1.8 - (z - 7.5) * 0.015, t, z, 0.42)
      }
    }
  }
  return { brick, roof, turq, tile, win, gold }
}

/** A pointed-arch band between half-widths r0 and r1 round centre s, springing zs. */
function pointedBand(s: number, r0: number, r1: number, zs: number, seg: number): XY[] {
  const o = archOutline(s - r1, s + r1, zs - 0.3, zs, seg, 0.72), i = archOutline(s - r0, s + r0, zs - 0.3, zs, seg, 0.72)
  // outer from the right foot over the crown to the left foot, then the inner back
  const outer = o.slice(2), inner = i.slice(2).reverse()
  return [[s + r1, zs - 0.3], ...outer, [s - r1, zs - 0.3], [s - r0, zs - 0.3], ...inner, [s + r0, zs - 0.3]]
}
/** The dome's radius at height z from its profile. */
function rAt(prof: XY[], z: number) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
    if (z >= z0 && z <= z1) return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0 || 1)
  }
  return 0
}
/** A raised lens on the dome's surface at angle t and height z, `s` across. */
function medallion(p: Part, c: XY, t: number, z: number, s: number, prof: XY[]) {
  const n = 8, pts: V3[] = [], tip = (() => { const r = rAt(prof, z) + 0.18; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z] as V3 })()
  for (let i = 0; i < n; i++) {
    const a = (i * TAU) / n, dz = Math.sin(a) * s * 0.6, zz = z + dz, rr = rAt(prof, zz) + 0.03
    const dt = (Math.cos(a) * s * 0.5) / Math.max(rr, 0.5)
    pts.push([c[0] + rr * Math.cos(t + dt), c[1] + rr * Math.sin(t + dt), zz])
  }
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [tip[0] - a[0], tip[1] - a[1], tip[2] - a[2]]
    let nn: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const out: V3 = [Math.cos(t), Math.sin(t), 0]
    if (nn[0] * out[0] + nn[1] * out[1] < 0 && nn[2] * 0 === 0) nn = [-nn[0], -nn[1], -nn[2]]
    p.tri(a, b, tip, undefined, undefined, undefined, [nn, nn, nn])
  }
}
/** A gold triangle (point up) lying on the dome between z0 and z1, centred at angle t, `w` radians wide. */
function zig(p: Part, c: XY, t: number, w: number, z0: number, z1: number, prof: XY[]) {
  const P = (tt: number, z: number): V3 => { const r = rAt(prof, z) + 0.06; return [c[0] + r * Math.cos(tt), c[1] + r * Math.sin(tt), z] }
  const a = P(t - w * 0.45, z0), b = P(t + w * 0.45, z0), tip = P(t, z1)
  const out: V3 = [Math.cos(t), Math.sin(t), 0.25]
  p.tri(a, b, tip, undefined, undefined, undefined, [out, out, out])
}
/** A small flat diamond tile on a cylinder of radius r. */
function diamond(p: Part, c: XY, r: number, t: number, z: number, s: number) {
  const out: V3 = [Math.cos(t), Math.sin(t), 0], dt = (s * 0.5) / r, rr = r + 0.04
  const P = (tt: number, zz: number): V3 => [c[0] + rr * Math.cos(tt), c[1] + rr * Math.sin(tt), zz]
  fquad(p, P(t, z - s * 0.6), P(t + dt, z), P(t, z + s * 0.6), P(t - dt, z), out)
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (q: V3, n: V3) => (n[2] > 0.7 ? 0.2 : q[2] > 10 ? 0.85 : 0.45)
    return [
      { part: p.brick, material: { ...finish('yerevan-brick', 0xa77a63), floodlight: lit } },
      { part: p.roof, material: { ...finish('roof-red-metal', 0xa84a42) } },
      { part: p.turq, material: { ...finish('tile-turquoise', 0x4fadc2), floodlight: lit } },
      { part: p.tile, material: { ...finish('tile-blue', 0x3d79b0), floodlight: lit } },
      { part: p.win, material: PALETTE.window },
      { part: p.gold, material: { ...finish('gold', 0xd0a640, 0.5), floodlight: lit } },
    ]
  }
  const meta = { osm: 'way/235841246', bearing: BEARING, height: 25.7 }
  await save('yerevan-blue-mosque.glb', 'Blue Mosque', make(false), meta, 6500, 250 * 1024)
  await save('yerevan-blue-mosque.detail.glb', 'Blue Mosque', make(true), meta, 40000, 1536 * 1024)
}
