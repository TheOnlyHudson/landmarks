/**
 * North Carolina Executive Mansion, Raleigh (1883–91; Samuel Sloan and
 * Gustavus Adolphus Bauer; Queen Anne): procedural, CC0-1.0.
 * bun generators/ral-executive-mansion.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3 (the OSM
 * walls run at 3°/93°). Origin: the area centroid of OSM way/47776615
 * (-78.635557, 35.783124). The front faces south, up the brick drive (e03).
 * y = 0 is the lowest ground under the footprint: Mapterhorn (z13) falls
 * about 2 m from the west side to the east; elevation 0.
 *
 * OSM: way/47776615 "North Carolina Executive Mansion" (no height): a main
 * block about 27 × 33 m (x -13.5..13.8, y -17.2..15.5) with a front
 * projection (x -8.8..6.8 to y -22.8: the entrance pavilion and its
 * porch), a rear wing (x -11.9..5.2 to y 24), a west bay (to x -19.5,
 * y -6..6) and an east porch (to x 21.3, y -7.4..1.2).
 *
 * No lidar covers Wake County; heights are photo-scaled (estimated) from
 * e03, the south front frontal, whose 400 px width is OSM's 27.3 m
 * (≈14 px/m): eaves 10.5 m (two tall storeys over a raised basement);
 * the main roof's steep slate slopes to a deck at 15.5 m; the centre gable
 * 16.8 m and the flanking gables 16 m; chimneys about 18.5 m (they stand
 * further back in e03, so read a little lower). The roofs keep the
 * photo's height: the main roof is a steep slope (≈50°) to a flat deck,
 * not a hip to a point, which would rise far over the gables.
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-executive-mansion/photos):
 *  e01 "North-Carolina-Executive-Mansion-20080321.jpeg", Mark Turner,
 *      public domain: from the south-west: the steep gables, the
 *      verandahs, tall chimneys, red brick with pale trim, grey slate.
 *  e02 "North Carolina Executive Mansion, Raleigh, NC (28221584638).jpg",
 *      Warren LeMay, CC0: from the gate on Blount Street.
 *  e03 "North Carolina Executive Mansion, Raleigh, NC (28221585738).jpg",
 *      Warren LeMay, CC0: the south front, frontal: centre gable over the
 *      porch and balcony, flanking gables, two storeys of tall windows.
 *  e04 "Halloween 2025, NC Executive Mansion.jpg", Willthacheerleader18,
 *      CC0: the south front and the east porch.
 * Aerial: USGS NAIP (public domain), too shaded by trees to read the roofs.
 *
 * Colours: red brick pulled to the palette's lightness; slate a grey-blue
 * roof; trim and porches pale cream.
 * Estimated: every height; the gables' widths; the window rhythm (≈3 m).
 * Invented: the rear (north) wing's gable and the north windows (no
 * licensed photo of the north side found).
 * Left out: the dormers on the side slopes, ornamental gable woodwork,
 * porch spindles and railings, the fence and grounds (out of scope).
 * Doubts: no lidar, no Mapillary (no token); the roof's real shape is a
 * cluster of steep hips and gables that NAIP's tree shade hides.
 * Night: windows glow; the door is `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel, triO, quadO } from './nash-tennessee-state-capitol'

const EAVE = 10.5, DECK = 15.5

/**
 * A gabled roof over a rectangle, the ridge along y (or x), with an
 * overhang `o`; the gable triangles are wall.
 */
function gableRoof(roof: Part, wall: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, alongY: boolean, o = 0.4) {
  if (alongY) {
    const xm = (x0 + x1) / 2, h = (x1 - x0) / 2, s = (zr - ze) / h
    const zo = ze - o * s
    for (const sx of [-1, 1]) {
      const xe = sx > 0 ? x1 + o : x0 - o
      quadO(roof, [xe, y0 - o, zo], [xe, y1 + o, zo], [xm, y1 + o, zr], [xm, y0 - o, zr], [sx * (zr - ze), 0, h])
    }
    for (const [y, sy] of [[y0, -1], [y1, 1]] as [number, number][]) triO(wall, [x0, y, ze], [x1, y, ze], [xm, y, zr - 0.02], [0, sy, 0])
  } else {
    const ym = (y0 + y1) / 2, h = (y1 - y0) / 2, s = (zr - ze) / h
    const zo = ze - o * s
    for (const sy of [-1, 1]) {
      const ye = sy > 0 ? y1 + o : y0 - o
      quadO(roof, [x0 - o, ye, zo], [x1 + o, ye, zo], [x1 + o, ym, zr], [x0 - o, ym, zr], [0, sy * (zr - ze), h])
    }
    for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][]) triO(wall, [x, y0, ze], [x, y1, ze], [x, ym, zr - 0.02], [sx, 0, 0])
  }
}

function build() {
  const brick = new Part(), slate = new Part(), trim = new Part(), win = new Part(), door = new Part()

  // ------------------------------------------------------------ brick masses
  const MAIN = rect(-13.5, -17.2, 13.8, 15.5)
  prism(brick, null, MAIN, 0, EAVE)
  box(brick, -4.2, -19.6, 4.2, -17.2, 0, EAVE, null) // the entrance pavilion
  box(brick, -11.9, 15.5, 5.2, 24, 0, EAVE, null) // rear wing
  box(brick, -19.5, -5.9, -13.5, 6, 0, EAVE, null) // west bay
  // the main roof: steep slate slopes (≈50°) to a deck
  {
    const o = 0.5, run = 4.2
    const A = rect(-13.5 - o, -17.2 - o, 13.8 + o, 15.5 + o), B = rect(-13.5 + run, -17.2 + run, 13.8 - run, 15.5 - run)
    const zo = EAVE - o * ((DECK - EAVE) / run)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      const n: V3 = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]][k] as V3
      quadO(slate, [A[k][0], A[k][1], zo], [A[l][0], A[l][1], zo], [B[l][0], B[l][1], DECK], [B[k][0], B[k][1], DECK], [n[0] * (DECK - EAVE), n[1] * (DECK - EAVE), run])
    }
    capRing(slate, B, DECK, true)
    // the soffit under the overhang
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4, M = MAIN
      quadO(trim, [A[k][0], A[k][1], zo], [M[k][0], M[k][1], zo], [M[l][0], M[l][1], zo], [A[l][0], A[l][1], zo], [0, 0, -1])
    }
  }
  // gables: the centre pavilion, two flanking ones on the front, the wings
  gableRoof(slate, brick, -4.2, 4.2, -19.6, -9, EAVE, 16.8, true)
  for (const x of [-9.8, 9.8]) gableRoof(slate, brick, x - 3, x + 3, -17.2, -10, EAVE, 16, true)
  gableRoof(slate, brick, -11.9, 5.2, 13, 24, EAVE, 16.5, true)
  gableRoof(slate, brick, -19.5, -10, -5.9, 6, EAVE, 16, false)
  gableRoof(slate, brick, 9.5, 13.8, -6.5, 0.5, EAVE, 15.8, false)
  // chimneys, tall and banded (e01, e03)
  for (const [x, y] of [[-11.5, -6], [11.8, -12], [-7, 11], [8.5, 10]] as XY[]) {
    box(brick, x - 0.75, y - 0.55, x + 0.75, y + 0.55, EAVE, 18.2, null)
    box(trim, x - 0.9, y - 0.7, x + 0.9, y + 0.7, 18.2, 18.6, trim)
  }

  // ------------------------------------------------------------ porches
  // the front porch round the entrance pavilion, a balcony over it
  const porch = (x0: number, x1: number, y0: number, y1: number) => {
    box(trim, x0, y0, x1, y1, 0, 1.2, trim) // its floor, on the raised basement
    for (const [x, y] of [[x0 + 0.3, y0 + 0.3], [x1 - 0.3, y0 + 0.3], [x0 + 0.3, y1 - 0.3], [x1 - 0.3, y1 - 0.3]] as XY[]) box(trim, x - 0.2, y - 0.2, x + 0.2, y + 0.2, 1.2, 4.2, null)
    box(trim, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, 4.2, 4.6, slate)
  }
  porch(-8.8, 6.8, -22.8, -19.6)
  for (const x of [-4.4, 2.4]) box(trim, x - 0.2, -22.5, x + 0.2, -22.1, 1.2, 4.2, null)
  porch(13.8, 21.3, -7.4, 1.2)
  for (const y of [-3.1]) box(trim, 21, y - 0.2, 21.4, y + 0.2, 1.2, 4.2, null)

  // ------------------------------------------------------------ windows and the door
  const rows: [number, number][] = [[1.9, 4.8], [6.3, 9.2]]
  const wall = (o: XY, n: XY, L: number, every = 3, skip: (s: number) => boolean = () => false) => {
    const f: Face = { o: [o[0], o[1], 0], n }
    const k = Math.max(1, Math.round(L / every)), w = L / k
    for (let i = 0; i < k; i++) {
      const s = w * (i + 0.5)
      if (skip(s)) continue
      for (const [z0, z1] of rows) {
        panel(trim, f, s, 1.5, z0 - 0.2, z1 + 0.25, 0.04)
        panel(win, f, s, 1.1, z0, z1, 0.07)
      }
    }
  }
  wall([-13.5, -17.2], [0, -1], 9.3) // south front, west of the pavilion
  wall([4.2, -17.2], [0, -1], 9.6)
  wall([13.8, -17.2], [1, 0], 10.2)
  wall([13.8, 1.2], [1, 0], 14.3)
  wall([5.2, 24], [0, 1], 17.1)
  wall([-13.5, 15.5], [-1, 0], 9.5)
  wall([-13.5, -5.9], [-1, 0], 11.3)
  wall([-19.5, 6], [-1, 0], 11.9)
  // the pavilion: the door under the porch, a window over it, a pair in the gable
  {
    const f: Face = { o: [0, -19.6, 0], n: [0, -1] }
    panel(trim, f, 0, 2.6, 1.2, 4.3, 0.04)
    panel(door, f, 0, 2.0, 1.2, 3.6, 0.07)
    panel(win, f, 0, 2.0, 3.7, 4.1, 0.07)
    for (const s of [-1.8, 0, 1.8]) panel(win, f, s, 1.0, 6.3, 9.2, 0.07)
    for (const s of [-0.8, 0.8]) panel(win, f, s, 0.9, 11.2, 13.4, 0.07)
    for (const x of [-9.8, 9.8]) {
      const g: Face = { o: [x, -17.2, 0], n: [0, -1] }
      for (const s of [-0.7, 0.7]) panel(win, g, s, 0.8, 11.2, 13.2, 0.07)
    }
  }

  return finishGlb('North Carolina Executive Mansion', [
    { part: brick, material: finish('ncem-brick', 0xc48e78) },
    { part: slate, material: finish('ncem-slate', 0x8d949c) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 3, height: 18.6, replaces: ['way/47776615'] }, 5000)
}

if (import.meta.main) await writeModel('ral-executive-mansion', build())
