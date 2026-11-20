/**
 * Wade Memorial Chapel (Hubbell & Benes, 1901; interior by Louis Comfort
 * Tiffany), Lake View Cemetery, Cleveland — original procedural geometry,
 * CC0-1.0.
 * bun generators/cle-wade-memorial-chapel.ts
 *
 * Map frame of the model: x, y, z up, metres. Anchor = area centroid of
 * the OSM outline way/341890016, -81.59460285 41.51365165. Bearing 11:
 * the long axis; -y is the portico front (south-south-west, toward the
 * drive), +y the back over the lake. y = 0 is the lake-side ground at the
 * back, where a rock-faced lower storey opens (lidar 0.5 above the box
 * minimum); the front walk and the side lawns are 4.5 m higher (lidar
 * 4.6-5.0), so everything below 4.5 on the front and sides sinks into the
 * hill on the map. Elevation 0.
 *
 * Identity, in order: the white granite Ionic temple: the tetrastyle
 * prostyle portico (four columns in front, one more each side, two in
 * antis at the door) on its two pedestal blocks either side of the walk;
 * the low pediments front and back; the pilastered side walls on their
 * podium; the pale green copper roof with its skylight lantern; the big
 * window in the back wall; the lower storey at the back with its blue
 * doors.
 *
 * Evidence:
 *  - plan: OSM way/341890016 (building=chapel, building:levels 1,
 *    wikidata Q7959092), 10.1 x 20.6 m, turned to bearing 11. The lidar
 *    roof agrees within ~0.8 m.
 *  - heights, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (2019
 *    flight), 0.5 m grid, read with tools/lidar_frame.py at bearing 11:
 *    eaves 11.9 and ridge 13.3 above y = 0 (8.8 above the front walk);
 *    skylight 14.1; the flat terrace on the lower rear storey 4.1-4.6,
 *    reaching ~3.3 m behind the chapel; lake-side ground 0.
 *  - estimated from the head-on front photo scaled to the lidar: podium
 *    1.9, columns 4.0 (with capitals), entablature 1.4, pediment 1.5 above
 *    the front walk; columns at x ±1.85 and ±4.25; the door 1.7 x 3.3; the
 *    walk between the pedestals 2.8 wide; the back window 2.4 x 2.8; the
 *    rear storey's doors and windows.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    https://commons.wikimedia.org/wiki/File:Front_-_Wade_Chapel_-_Lake_View_Cemetery_-_2014-11-26_(17658812625).jpg
 *      Tim Evanson, CC BY-SA 2.0 — the portico head on.
 *    https://commons.wikimedia.org/wiki/File:SW_front_-_Wade_Chapel_-_Lake_View_Cemetery_-_2014-11-26_(17658819215).jpg
 *      Tim Evanson, CC BY-SA 2.0 — portico and west side.
 *    https://commons.wikimedia.org/wiki/File:Wade_Chapel_Cleveland_Ohio.jpg
 *      Christopher Busta-Peck, CC BY-SA 1.0 — portico and west side, copper roof rims.
 *    https://commons.wikimedia.org/wiki/File:Wade_Chapel_rear_-_Lake_View_Cemetery_-_2015-04-04_(21793042383).jpg
 *      Tim Evanson, CC BY-SA 2.0 — the back: window, pilasters, lower storey and doors.
 *    https://commons.wikimedia.org/wiki/File:Wade_Chapel_side_rear_-_Lake_View_Cemetery_-_2015-04-04_(22388760566).jpg
 *      Tim Evanson, CC BY-SA 2.0 — the flat-topped lower storey behind the chapel.
 *    https://commons.wikimedia.org/wiki/File:Wade_Memorial_Chapel,_looking_south_across_the_lake.jpg
 *      HighAtop94, CC0 — the back from across the lake, the lantern.
 *    USGS NAIP orthophoto (public domain): the pale green copper roof.
 *  - published: Hubbell & Benes, architects, 1901; Tiffany interior
 *    (Wikipedia "Wade Memorial Chapel").
 *  - the open porch (rebuilt after review: it read as a solid block with
 *    flat pilasters). The porch is open on three sides between the two
 *    pedestal blocks; its back wall, the cella front, is drawn in a
 *    shaded-granite finish (the photos show it in shadow) from the walk up,
 *    with the bronze door (now in the window material), its pale case and
 *    cornice, and the clerestory over it; the portico ceiling is shaded too.
 *    The podium band no longer runs across the porch, so the door reaches
 *    the walk. Columns (14 sides, base r 0.55, shaft 0.44-0.39), capitals,
 *    antae, pilasters (0.4 proud), the cornice and the raking cornices are a
 *    paler granite trim so they stand out from the walls, as the
 *    sky-lit columns do in the photos.
 *  - colour: Barre granite, pale warm grey; copper roof weathered pale
 *    green (NAIP); the lower storey a buff rock-faced sandstone.
 *
 * Left out: fluting, dentils and the lion-head antefixes on the cornice,
 *  the volutes (a broad capital block), the long rock-faced retaining
 *  wings either side of the lower storey (not mapped as buildings in OSM),
 *  the railings. Doubts: the east side is not photographed (mirrors the
 *  west); the portico's depth and second-row columns are read from
 *  oblique photos. The night look was not checked: only the windows and
 *  the door (window material) glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'

type Box = [number, number, number, number]

function box(p: Part, r: Box, z0: number, z1: number, top = true, bottom = false) {
  wallsSplit(p, rect(...r), z0, z1, 5)
  if (top) cap(p, rect(...r), z1)
  if (bottom) cap(p, rect(...r), z0, false)
}

function build() {
  const granite = new Part(), trim = new Part(), copper = new Part(), win = new Part(), shade = new Part(), rustic = new Part()
  const door = win // the bronze grille doors read dark, as glazing

  const X = 5.05, YF = -10.3, YB = 10.3 // OSM way/341890016 in this frame
  const FG = 4.5 // the front and side ground above y = 0 (the lake-side ground at the back)
  const POD = FG + 1.9, CAPT = FG + 5.9, ENT = FG + 7.3, APEX = FG + 8.8
  const YC = -4.6 // the cella's front wall
  const EO = 0.35 // the cornice overhang

  // ------------------------------------------------------------ cella
  wallsSplit(granite, rect(-X, YC, X, YB), 0, CAPT, 5)
  // the podium band on the sides and back; the front opens to the porch, its floor at the walk
  const podOut = (e: number): XY[] => [[-X - e, YC], [X + e, YC], [X + e, YB + e], [-X - e, YB + e]]
  band(granite, rect(-X, YC, X, YB), podOut(0.12), 0, POD, 0.05)
  band(granite, rect(-X, YC, X, YB), podOut(0.2), POD - 0.35, POD, 0.15) // the podium's cap moulding
  // pilasters: five a side, four on the back wall
  const pil = (a: XY, b: XY, s: number) => {
    const { P } = onWall(a, b), w = 0.4, d = 0.4
    // corners along the wall then out from it run clockwise, so reverse them
    const q = (h: number, e: number): XY[] => [P(s - h, 0, 0), P(s + h, 0, 0), P(s + h, 0, e), P(s - h, 0, e)].map(v => [v[0], v[1]] as XY).reverse()
    walls(trim, q(w, d), POD, CAPT - 0.45)
    walls(trim, q(w + 0.12, d + 0.12), CAPT - 0.45, CAPT)
    cap(trim, q(w + 0.12, d + 0.12), CAPT - 0.45, false)
  }
  const sides: [XY, XY][] = [[[X, YC], [X, YB]], [[-X, YB], [-X, YC]]]
  for (const [a, b] of sides) {
    const { L } = onWall(a, b)
    for (let i = 0; i < 5; i++) pil(a, b, 0.45 + i * (L - 0.9) / 4)
  }
  {
    const a: XY = [X, YB], b: XY = [-X, YB]
    for (const s of [0.45, X - 1.6, X + 1.6, 2 * X - 0.45]) pil(a, b, s)
    panel(win, a, b, X - 1.2, X + 1.2, POD + 0.6, POD + 3.4, 0.05) // the Tiffany window
    panel(granite, a, b, X - 1.4, X + 1.4, POD + 0.4, POD + 0.6, 0.08)
  }

  // ------------------------------------------------------------ portico
  // two pedestal blocks either side of the central walk
  for (const [x0, x1] of [[-X, -1.4], [1.4, X]]) {
    box(granite, [x0, YF, x1, YC], 0, POD - 0.3)
    band(granite, rect(x0, YF, x1, YC), grow([x0, YF, x1, YC], 0.12), POD - 0.35, POD - 0.05, 0.15)
  }
  // the cella front: doors, the door case and the clerestory over it
  {
    const a: XY = [-X, YC], b: XY = [X, YC], m = X
    // the porch's back wall, in shadow behind the columns
    panel(shade, a, b, 0, 2 * X, FG, CAPT, 0.03)
    panel(trim, a, b, m - 1.15, m + 1.15, FG + 0.3, FG + 4.0, 0.05) // the door case
    panel(door, a, b, m - 0.85, m + 0.85, FG + 0.3, FG + 3.6, 0.08)
    panel(trim, a, b, m - 1.3, m + 1.3, FG + 3.6, FG + 4.05, 0.12) // the door's cornice
    panel(win, a, b, m - 1.6, m + 1.6, FG + 4.4, FG + 5.5, 0.06) // the clerestory over the door
    box(granite, [-1.4, YC - 0.3, 1.4, YC], FG, FG + 0.3) // the door step
  }
  // the Ionic columns: four in front, one each side in the second row, two in antis
  const col = (x: number, y: number, z0: number) => {
    const h = CAPT - 0.45 - z0
    lathe(trim, x, y, [[0.55, z0], [0.55, z0 + 0.22], [0.44, z0 + 0.32], [0.39, z0 + h]], 14)
    // the capital: an abacus with its volutes, drawn as a broad block
    walls(trim, rect(x - 0.66, y - 0.38, x + 0.66, y + 0.38), CAPT - 0.45, CAPT - 0.05)
    cap(trim, rect(x - 0.66, y - 0.38, x + 0.66, y + 0.38), CAPT - 0.45, false)
    walls(trim, rect(x - 0.52, y - 0.52, x + 0.52, y + 0.52), CAPT - 0.05, CAPT)
  }
  const yr1 = YF + 0.55, yr2 = (YF + YC) / 2 + 0.3
  for (const x of [-4.25, -1.85, 1.85, 4.25]) col(x, yr1, POD)
  for (const x of [-4.25, 4.25]) col(x, yr2, POD)
  for (const x of [-1.85, 1.85]) col(x, YC - 0.55, FG + 0.3)
  // antae at the cella's front corners
  for (const x of [-X + 0.45, X - 0.45]) walls(trim, rect(x - 0.45, YC - 0.3, x + 0.45, YC), FG, CAPT)

  // ------------------------------------------------------------ entablature, pediments, roof
  wallsSplit(granite, rect(-X, YF, X, YB), CAPT, ENT - 0.5, 5)
  cap(shade, rect(-X, YF, X, YC), CAPT, false) // the portico ceiling, in shadow
  band(trim, rect(-X, YF, X, YB), grow([-X, YF, X, YB], EO), ENT - 0.5, ENT, 0.35)
  {
    const ex = X + EO, ez = ENT
    for (const [y, out] of [[YF - EO, -1], [YB + EO, 1]] as [number, number][]) {
      // the tympanum, set back, and the raking cornice, standing proud
      const yt = y - out * EO
      poly(granite, [[-X, yt, ez], [X, yt, ez], [0, yt, APEX - 0.45]], [0, out, 0])
      const t = 0.5
      for (const sgn of [-1, 1]) {
        const p0: V3 = [sgn * ex, y, ez], p1: V3 = [0, y, APEX], p2: V3 = [0, y, APEX - t], p3: V3 = [sgn * (ex - 0.6), y, ez]
        poly(trim, [p0, p1, p2, p3], [0, out, 0])
        poly(trim, [[p0[0], yt, p0[2]], [p0[0], y, p0[2]], [p1[0], y, p1[2]], [p1[0], yt, p1[2]]], [sgn * (APEX - ez), 0, ex])
        poly(trim, [[p3[0], yt, p3[2]], [p3[0], y, p3[2]], [p2[0], y, p2[2]], [p2[0], yt, p2[2]]], [-sgn, 0, -1])
      }
    }
    // the copper roof, between the pediments
    for (const sgn of [-1, 1]) {
      const y0 = YF - EO * 0.5, y1 = YB + EO * 0.5
      poly(copper, [[sgn * ex, y0, ez], [sgn * ex, y1, ez], [0, y1, APEX - 0.02], [0, y0, APEX - 0.02]], [sgn * (APEX - ez), 0, ex])
    }
    // the skylight lantern at the back of the roof
    const lz = APEX - 0.6
    box(copper, [-1.2, 6.9, 1.2, 8.7], lz, APEX + 0.45)
    walls(copper, rect(-1.35, 6.75, 1.35, 8.85), APEX + 0.35, APEX + 0.55)
    cap(copper, rect(-1.35, 6.75, 1.35, 8.85), APEX + 0.55)
  }

  // ------------------------------------------------------------ the lower storey at the back
  // Rock-faced sandstone, opening on the lake-side ground; its flat top is
  // the terrace behind the chapel.
  {
    const r: Box = [-X, YB, X, YB + 3.3]
    box(rustic, r, 0, FG - 0.3, false)
    band(rustic, rect(...r), grow(r, 0.15), FG - 0.4, FG + 0.1, 0.1)
    cap(granite, rect(...r), FG + 0.1)
    const a: XY = [X, r[3]], b: XY = [-X, r[3]], m = X
    panel(door, a, b, m - 1.05, m + 1.05, 0, 2.9, 0.06)
    panel(granite, a, b, m - 1.25, m + 1.25, 2.9, 3.3, 0.06)
    for (const s of [m - 3.3, m + 3.3]) panel(win, a, b, s - 0.65, s + 0.65, 1.4, 2.6, 0.05)
  }

  return [
    { part: granite, material: finish('cle-wade-granite', 0xdcdad3) },
    { part: copper, material: finish('cle-wade-copper', 0x9cc2ae) },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('cle-wade-granite-trim', 0xeceae4) },
    { part: shade, material: finish('cle-wade-porch-shade', 0x9a9892) },
    { part: rustic, material: finish('cle-wade-sandstone', 0xcdbf9f) },
  ]
}

if (import.meta.main) await save('cle-wade-memorial-chapel', 'Wade Memorial Chapel', [41.51365165, -81.59460285], 11, build() as any, 5000)
