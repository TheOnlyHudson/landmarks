/**
 * Abravanel Hall (Maurice Abravanel Hall, 1979, FFKR Architects), Salt Lake
 * City: procedural, CC0-1.0.
 * bun generators/slc-abravanel-hall.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the middle of
 * OSM way/152356335's bounding box (-111.894907, 40.768614). y = 0 is the
 * lowest ground under the footprint, on the south (lidar ground_min, which
 * agrees with the map's terrain to 0.3 m); the north plaza on South Temple
 * is 5 m higher.
 *
 * Form (lidar, OSM, photos): the auditorium is a tall, sheer box of buff
 * brick, 25.6 m high, whose north end is cut on a 45-degree diagonal into a
 * sharp prow at the north-east corner (on West Temple). The diagonal face
 * looks north-west over the plaza at South Temple and carries the hall's
 * name; the east face on West Temple, from the prow southward, is one huge
 * window wall (the lobby), framed in brick, with a band of grey metal panels
 * above it. Lower brick blocks wrap it: a 14.8 m lobby
 * block in the north-west corner, a 9.7 m strip down the west and across
 * the south, and a 9.8 m triangular wing on the east (ticket office), its
 * long side on a diagonal too, with a narrow open passage between it and
 * the auditorium.
 *
 * Sources
 * - USGS 3DEP lidar USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013): every
 *   height and the plan of each block (1 m grid, read with lidar_frame.py).
 * - OSM (ODbL): way/152356335 (outline, Abravanel Hall, Q4669441) and its
 *   parts way/1526304741-1526304745.
 * - Mapterhorn terrain: the north plaza 5 m over the south side.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Ntsimp, "Abravanel Hall.jpeg", public domain,
 *     https://commons.wikimedia.org/wiki/File:Abravanel_Hall.jpeg
 *     (the east window wall from West Temple: its extent, the metal band,
 *     the plain brick beside it);
 *   Ricardo630, "Slc abravanel hall.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Slc_abravanel_hall.jpg
 *     (the prow: glass on the east face, the lettered brick diagonal);
 *   Another Believer, "Salt Lake City Maurice Abravanel Hall.jpg",
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Salt_Lake_City_Maurice_Abravanel_Hall.jpg
 *     (the north side and the ticket-office wing, brick colour).
 * Estimated from the photos: the window wall's extent (35 m south from
 *   the prow, from the plaza to 19 m), the metal band (19.6-22.4 m), the
 *   east wing's windows and doors.
 * Left out: the lettering, the sculpture and fountain, the planters.
 * Doubts: the camera directions are read from the prow and the streets, not
 *   recorded; the lettered diagonal and the glass east face could only be
 *   this way round given the lidar plan. The south and west faces are in no photo used: plain brick with
 *   a few doors. The lead's note of a gold-trimmed glass front: the photos
 *   show dark glass with the gold lobby showing through; it glows warm at
 *   night as `window`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, flatShape, extrudeShape, finishGlb, writeModel } from './sea-tacoma-union-station'

const H = 25.6, PL = 5.0 // auditorium roof; the north plaza level

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part()

  // ------------------------------------------------------------ massing (CCW rings)
  const aud: XY[] = [[-40, -40], [-7.5, -40], [-7.5, 54.9], [-40, 22]]
  prism(brick, trim, aud, 0, H)
  prism(brick, trim, rect(-57, 7, -40, 25), 0, H) // the stage house's west bulge
  prism(brick, trim, [[-59.9, 25], [-35, 25], [-59.9, 50]], 0, 14.8) // north-west lobby block
  prism(brick, trim, rect(-57, -50, -40, 7), 0, 9.7) // west strip
  prism(brick, trim, rect(-57, -54.2, -7.5, -40), 0, 9.7) // south strip
  const wing: XY[] = [[1.5, -54.2], [58.0, -54.2], [1.5, 2.3]]
  prism(brick, trim, wing, 0, 9.8)

  // copings
  const lip = (r: XY[], z: number) => {
    const c = r.reduce((a, p) => [a[0] + p[0] / r.length, a[1] + p[1] / r.length], [0, 0])
    const big = r.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy); return [x + (dx / l) * 0.35, y + (dy / l) * 0.35] as XY })
    prism(trim, trim, big, z - 0.5, z + 0.15)
  }
  lip(aud, H)
  lip([[-59.9, 25], [-35, 25], [-59.9, 50]], 14.8)
  lip(wing, 9.8)

  // ------------------------------------------------------------ the east window wall (on West Temple), up to the prow
  {
    const f: Face = { o: [-7.5, 0, 0], n: [1, 0] } // s = y
    const g0 = 18.5, g1 = 53.8
    extrudeShape(trim, f, rect(g0 - 0.4, PL - 0.2, g1 + 0.4, 19.3), 0, 0.06)
    flatShape(win, f, rect(g0, PL, g1, 18.9), 0.1)
    // bold mullions every 3.5 m and a transom
    for (let s = g0 + 3.5; s < g1 - 0.5; s += 3.5) flatShape(trim, f, rect(s - 0.09, PL, s + 0.09, 18.9), 0.13)
    flatShape(trim, f, rect(g0, 11.9, g1, 12.1), 0.13)
    // the band of grey metal panels over it
    flatShape(roof, f, rect(g0 - 0.4, 19.6, g1 + 0.4, 22.4), 0.06)
  }

  // ------------------------------------------------------------ the east wing (ticket office)
  {
    const f: Face = { o: [29.75, -25.95, 0], n: [Math.SQRT1_2, Math.SQRT1_2] }
    // its diagonal face: a run of tall windows and the glazed entrance
    for (const s of [-24, -16, -8, 8, 16, 24]) flatShape(win, f, rect(s - 1.6, 4.4, s + 1.6, 8.2), 0.06)
    flatShape(win, f, rect(-3.5, 1.4, 3.5, 6.0), 0.06)
    extrudeShape(trim, f, rect(-4.2, 6.0, 4.2, 6.6), 0, 1.2)
    const fn: Face = { o: [1.5, -26, 0], n: [-1, 0] } // facing the passage
    for (const s of [-18, -6, 6, 18]) flatShape(win, fn, rect(s - 1.4, 4.4, s + 1.4, 8.0), 0.06)
  }
  // a few doors on the south and west
  for (const s of [-30, -18]) flatShape(roof, { o: [0, -54.2, 0], n: [0, -1] }, rect(s - 1.5, 0.3, s + 1.5, 3.2), 0.06)
  for (const s of [10, 30]) flatShape(roof, { o: [-57, 0, 0], n: [-1, 0] }, rect(s - 1.5, 1.0, s + 1.5, 3.8), 0.06)

  return finishGlb('Abravanel Hall', [
    { part: brick, material: finish('slc-abravanel-brick', 0xd6c8b2) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ], { bearing: 0, height: H + 0.15, replaces: ['way/152356335'] }, 5000)
}

if (import.meta.main) await writeModel('slc-abravanel-hall', build())
