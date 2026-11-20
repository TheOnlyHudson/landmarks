/**
 * North Carolina Museum of History, Raleigh (1994; Barnes, Gromatzky,
 * Kosarek with Ehrenkrantz Group): procedural, CC0-1.0.
 * bun generators/ral-nc-museum-of-history.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2 (the OSM
 * walls run at 2°/92°). Origin: the area centroid of the OSM building
 * way/47776573 (-78.638536, 35.781752). y = 0 is the lowest ground under
 * the footprint; Mapterhorn (z13) slopes about 3 m across it. Elevation 0.
 *
 * OSM:
 *  - way/47776573 (building, source WakeGIS, wikipedia "North Carolina
 *    Museum of History"): in this frame a 49 × 68 m south part (x
 *    -26.6..22.8, y -48..20.5) with a 4 m bump on the west (y -31..-13,
 *    the entrance block), and a 33 × 38 m north part (x -9.5..23.6, y
 *    20.5..58.5);
 *  - way/674703397 (building, untagged): a 5 × 35 m strip at x -29..-24,
 *    y 24..59: the outer row of the open granite grid in front of the
 *    north part (NAIP shows the grid's shadowed squares there);
 *  - way/197533234 "North Carolina Museum of History" (Q7054557, tourism=
 *    museum, no building tag): the museum's site, plaza included; not a
 *    building, so not in `replaces`. The two 5 m squares north of it
 *    (way/679974402, way/679974825) are outside the model.
 * USGS NAIP (public domain, 0.15 m/px; it sits ~9 m east of OSM here, as
 * at the neighbouring museums): a flat roof over the east block, a long
 * glazed ridge skylight (x -18..-11, the whole south part's length), the
 * open grid along the whole west front and deeper in front of the north
 * part. The brief's "glass-pyramid skylights" are not in NAIP or any
 * photo: the skylight is this ridge, drawn as a low glass gable.
 *
 * No lidar covers Wake County, so heights are estimated, from h03 (the
 * east front, cars for scale: ≈25 px/m at the middle of the wall):
 *  - the solid walls 22.5 m; the open frames and the grid to 26 m (h01,
 *    h03, h05: the wall behind the grid reaches nearly its top; a first
 *    pass at 20 m left too much sky through the grid);
 *  - the grid: piers 2.6 m square at ≈7.5 m (a first pass at 5.5 m drew
 *    twice the piers h04 shows), beams 2 m deep at 15–17,
 *    19.5–21.5 and 24–26 m (h04, h05);
 *  - the entrance block solid from 8 m to 26 m over a recessed glass
 *    entrance between corner piers (h05, h07).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-nc-museum-of-history/photos):
 *  h01 "North-Carolina-Museum-of-History-20080321.jpeg", Jmturner, public
 *      domain: from the south-west: the grid front, the south face with its
 *      open frame over a glazed slot, lower windows, pink granite bands.
 *  h02 "Exterior of the North Carolina Museum of History.jpg", DiscoA340,
 *      CC BY-SA 4.0: from Wilmington and Edenton: the blank north and
 *      east walls, the frames on the roof.
 *  h03 "North Carolina Museum of History - Raleigh, NC - DSC05859.JPG",
 *      Daderot, public domain: the east front: the frame over a glazed
 *      slot, ground-floor windows at its south end, the banding.
 *  h04 "4 Museum of History, Raleigh, North Carolina, 2010.jpg", XeresNelro,
 *      CC BY-SA 4.0: the grid close up, pink blocks where piers and beams
 *      cross, the inscription block over the entrance.
 *  h05 "North Carolina Museum of History.JPG", Abbylabar, CC BY-SA 3.0:
 *      the west front along the plaza, the entrance under the inscription.
 *  h07 "Panorama at the Entrance of the North Carolina Museum of
 *      History.jpg", DiscoA340, CC BY-SA 4.0: the entrance and its steps.
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: a pale grey granite and a pink-red granite (the bands and the
 * crossing blocks), pulled to the palette's lightness.
 * Estimated: every height; the pier spacing. Invented: the inner pier rows
 * of the north grid (NAIP shows only shadows there). Left out: the
 * granite's thin pink banding (drawn only as the crossing blocks and two
 * courses), lettering, steps, statues, lamps, roof plant.
 * Doubts: no lidar, no Mapillary (no token); the grid's depth in front of
 * the north part (OSM's wall line at x -9.5 against a grid that photos show
 * close to its wall); the frames' exact places on the roof.
 * Night: windows and the entrance glass glow; the granite is unlit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel, triO } from './nash-tennessee-state-capitol'

const WALL = 22.5, TOP = 26
const BEAMS: [number, number][] = [[15, 17], [19.5, 21.5], [24, 26]]

function build() {
  const gran = new Part(), pink = new Part(), win = new Part(), glass = new Part(), roof = new Part(), ent = new Part()

  // ------------------------------------------------------------ the solid blocks
  const SOUTH = rect(-24, -48, 22.8, 20.5), NORTH = rect(-9.5, 20.5, 23.6, 58.5)
  prism(gran, null, SOUTH, 0, WALL)
  capRing(roof, SOUTH, WALL, true)
  prism(gran, null, NORTH, 0, WALL)
  capRing(roof, NORTH, WALL, true)
  // a coping band and two pink courses round both blocks
  for (const r of [SOUTH, NORTH]) {
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], f: Face = { o: [a[0], a[1], 0], n }
      panel(pink, f, L / 2, L + 0.02, 4.8, 5.4, 0.04)
      panel(pink, f, L / 2, L + 0.02, 10.2, 10.8, 0.04)
    }
  }
  // the glazed ridge skylight over the south part
  {
    const x0 = -18, x1 = -11, y0 = -46, y1 = 19, zr = WALL + 1.6, xm = (x0 + x1) / 2
    triO(glass, [x0, y0, WALL], [x0, y1, WALL], [xm, y1, zr], [-1.6, 0, 3.5])
    triO(glass, [x0, y0, WALL], [xm, y1, zr], [xm, y0, zr], [-1.6, 0, 3.5])
    triO(glass, [x1, y1, WALL], [x1, y0, WALL], [xm, y0, zr], [1.6, 0, 3.5])
    triO(glass, [x1, y1, WALL], [xm, y0, zr], [xm, y1, zr], [1.6, 0, 3.5])
    triO(glass, [x0, y0, WALL], [xm, y0, zr], [x1, y0, WALL], [0, -1, 0])
    triO(glass, [x1, y1, WALL], [xm, y1, zr], [x0, y1, WALL], [0, 1, 0])
  }

  // ------------------------------------------------------------ the open granite grid
  const pier = (x: number, y: number) => {
    box(gran, x - 1.3, y - 1.3, x + 1.3, y + 1.3, 0, TOP, gran, 0.12)
    for (const [z0, z1] of BEAMS) box(pink, x - 1.36, y - 1.36, x + 1.36, y + 1.36, z0, z1, pink)
  }
  const beamY = (x0: number, x1: number, y0: number, y1: number) => {
    for (const [z0, z1] of BEAMS) box(gran, x0, y0, x1, y1, z0, z1, gran)
  }
  // the west front: one bay deep (x -29..-24), south of and north of the entrance
  const runs: [number, number, number][] = [[-48, -31, 2], [-13, 20.5, 4], [20.5, 58.5, 5]]
  for (const [ya, yb, n] of runs) {
    for (let k = 0; k <= n; k++) {
      const y = ya + 1.3 + ((yb - ya - 2.6) * k) / n
      pier(-28, y)
      // cross beams back to the wall (to the north part's wall at -9.5)
      const xw = ya >= 20.5 ? -9.5 : -24
      beamY(-26.7, xw, y - 1.1, y + 1.1)
      if (ya >= 20.5 && k > 0 && k < n) pier(-18.5, y) // the inner row in front of the north part
    }
    beamY(-29.2, -26.8, ya, yb) // the beams along the front
    if (ya >= 20.5) beamY(-19.5, -17.5, ya, yb)
  }
  // glazed ground floor behind the grid
  {
    const f: Face = { o: [-24, 0, 0], n: [-1, 0] }
    for (const [ya, yb] of [[-48, -31], [-13, 20.5]]) panel(win, f, -(ya + yb) / 2, yb - ya - 2, 0.6, 4.4, 0.05)
    const fn: Face = { o: [-9.5, 0, 0], n: [-1, 0] }
    panel(win, fn, -39.5, 34, 0.6, 4.4, 0.05)
    panel(win, fn, -39.5, 34, 6.2, 9.8, 0.05)
  }

  // ------------------------------------------------------------ the entrance block (h05, h07)
  box(gran, -30.5, -31, -24, -13, 8, TOP, gran, 0.15)
  for (const y of [-30, -14]) box(gran, -30.5, y - 1, -28.5, y + 1, 0, 8, null, 0.12)
  for (const y of [-25.5, -18.5]) box(gran, -30.3, y - 0.9, -28.5, y + 0.9, 0, 8, null, 0.12)
  // the recess: a canopy soffit at 8 m, glass doors at the back
  panel(ent, { o: [-24, 0, 0], n: [-1, 0] }, 22, 16, 0.3, 7.6, 0.05)
  for (const z of [12, 18]) box(pink, -30.56, -31, -30.5, -13, z, z + 0.7, pink)

  // ------------------------------------------------------------ open frames on the roof, over glazed slots
  const frame = (cx: number, cy: number, along: 'x' | 'y', face: Face, s: number) => {
    const h = 3.2
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = cx + dx * h, y = cy + dy * h
      box(gran, x - 0.8, y - 0.8, x + 0.8, y + 0.8, WALL, TOP - 2, null, 0.1)
    }
    // the top ring of beams
    box(gran, cx - h - 0.8, cy - h - 0.8, cx + h + 0.8, cy - h + 0.8, TOP - 2, TOP, gran)
    box(gran, cx - h - 0.8, cy + h - 0.8, cx + h + 0.8, cy + h + 0.8, TOP - 2, TOP, gran)
    box(gran, cx - h - 0.8, cy - h + 0.8, cx - h + 0.8, cy + h - 0.8, TOP - 2, TOP, gran)
    box(gran, cx + h - 0.8, cy - h + 0.8, cx + h + 0.8, cy + h - 0.8, TOP - 2, TOP, gran)
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(pink, cx + dx * h - 0.85, cy + dy * h - 0.85, cx + dx * h + 0.85, cy + dy * h + 0.85, TOP - 2, TOP, pink)
    void along
    // the tall glazed slot under it
    panel(win, face, s, 3.6, 5.6, WALL - 0.8, 0.05)
  }
  frame(5, -44, 'x', { o: [0, -48, 0], n: [0, -1] }, -5) // south face (h01)
  frame(18.8, -12, 'y', { o: [22.8, 0, 0], n: [1, 0] }, -12) // east face, south third (h03)
  frame(19.6, 40, 'y', { o: [23.6, 0, 0], n: [1, 0] }, 40) // over the Edenton Street corner (h02)

  // ------------------------------------------------------------ windows
  {
    // south face: two rows in the bays east and west of the slot (h01)
    const f: Face = { o: [0, -48, 0], n: [0, -1] }
    for (const s of [-19, -13.5, -8, 8, 13.5, 19]) {
      panel(win, f, -s, 4, 0.8, 4.2, 0.05)
      panel(win, f, -s, 4, 6.0, 9.2, 0.05)
    }
    // east face: the south end's lower windows (h03)
    const e: Face = { o: [22.8, 0, 0], n: [1, 0] }
    for (const s of [-44, -38.5, -33, -27.5, -22]) {
      panel(win, e, s, 4, 0.8, 4.2, 0.05)
      panel(win, e, s, 4, 6.0, 9.2, 0.05)
    }
  }

  return finishGlb('North Carolina Museum of History', [
    { part: gran, material: finish('ncmh-granite', 0xddd8d4) },
    { part: pink, material: finish('ncmh-pink-granite', 0xbf9a92) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
    { part: ent, material: PALETTE.entrance },
  ], { bearing: 2, height: TOP, replaces: ['way/47776573', 'way/674703397'] }, 6500)
}

if (import.meta.main) await writeModel('ral-nc-museum-of-history', build())
