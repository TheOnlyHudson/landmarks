/**
 * South Carolina State House (1855-1907; J. R. Niernsee, F. Milburn, C. C. Wilson), Columbia: procedural, CC0-1.0.
 * bun generators/cola-state-house.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 339.7 (the
 * building's walls run 339.7 / 69.7 degrees). Model +y is the north front on
 * Gervais Street, at the head of Main Street (compass 339.7); model +x is
 * compass 69.7, along the long wings. Origin: the area centroid of OSM
 * way/51731354 (-81.0331284, 34.0003125); y = 0 is the ground (the site is
 * flat to within 0.5 m in the lidar).
 *
 * Form: a long granite block, 82 m by 28 m: a rusticated ground storey with
 * arched windows, a piano nobile of tall windows under pediment hoods, a third
 * storey of small windows, a deep cornice and a balustrade with pedestals,
 * a low hipped roof behind it. Across the middle runs a north-south gable
 * that ends in two pedimented Corinthian porticoes of ten columns (north on
 * Gervais Street, south toward Senate Street), each on a podium at the main
 * floor with a grand flight of steps. Over the crossing: a square base with a
 * balustrade, a stone drum with twelve arched windows between engaged
 * columns, a flared copper skirt, the copper dome with eight oculus dormers,
 * and a copper lantern with a cap and ball.
 *
 * Sources
 * - OSM way/51731354 (outline, building=government, 3 levels). In this frame:
 *   main block x -41.1..41.1, y -14.9..13.0; north portico x -15.8..15.6 to
 *   y 26.0; south portico x -15.0..15.1 to y -24.7.
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid, heights
 *   above the site's ground (3.5 m above the box's ground_min): balustrade top
 *   21.5; main cornice 19.6 (portico eaves); hipped wing roof ridge 24.9 on the
 *   long axis; portico gable ridge 25.5 running the full depth at x ±15; the
 *   dome's square base 26.6 at ±9.5; drum cornice / copper skirt 35.9 at
 *   r 8.5; dome 41 at r 5.5 and 42.4 at r 4.5; lantern cornice 50.2 at r 2.5;
 *   lantern cap 51.9 (the flagpole above, to 60, is left out). The dome axis is
 *   on the block's centre line (x 0, y -0.95) once the lidar's 1 m shift to the
 *   east of the OSM outline is taken out.
 * - Published: dome completed 1903-07 by Charles Coker Wilson, granite
 *   building, Corinthian porticoes; often quoted as about 180 ft to the top of
 *   the dome, which must include the flagpole: the lidar gives 52 m (171 ft) to
 *   the lantern's cap. (Wikipedia, "South Carolina State House".)
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Farragutful, "2018 South Carolina State House.jpg" (north front), CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:2018_South_Carolina_State_House.jpg
 *   DXR, "South Carolina State House, Columbia, Southeast view with Strom
 *     Thurmond Statue 20160702 1.jpg" (south front), CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:South_Carolina_State_House,_Columbia,_Southeast_view_with_Strom_Thurmond_Statue_20160702_1.jpg
 *   Jack Boucher, HABS SC,40-COLUM,9-4 "West elevation" (1960), public domain,
 *     https://commons.wikimedia.org/wiki/File:Historic_American_Buildings_Survey,_April,_1960_WEST_ELEVATION._-_South_Carolina_State_House,_Capitol_Square,_Columbia,_Richland_County,_SC_HABS_SC,40-COLUM,9-4.tif
 *   Florencebballer, "SC State House at evening.jpg" (north-east, dusk), public domain,
 *     https://commons.wikimedia.org/wiki/File:SC_State_House_at_evening.jpg
 * Measured: plan (OSM), every height listed above (lidar).
 * Estimated from the photos: the main floor (portico podium) at 6.8 m; the
 *   column height 10.6 m and entablature 2.2 m (scaled from the north photo
 *   against the lidar eaves and apex); ten columns across each portico front
 *   (counted in both front photos) with three (north) and two (south) more
 *   down each side; the drum's height split (windows 27.6-31.2 m, copper
 *   entablature and eave 32.2-35.7 m, the eave r 9.2 and the lantern r 2.8,
 *   both scaled from the south photo against the drum); five window
 *   bays on each wing face and on each end; the window and hood sizes; the
 *   steps' run (13 m) and width.
 * Invented: nothing beyond simplification. Left out: rustication joints,
 *   quoins, capitals' carving, the balusters themselves (a recessed band
 *   between plinth and rail),
 *   chimneys, lamp standards, the grounds and their monuments, the lower wide
 *   approach flights in front of the steps.
 * Colour: the granite is a light cool grey (photos), pulled to the palette's
 *   lightness; the trim a paler grey. The dome, its skirt and the lantern are
 *   dark brown copper in daylight photos (not green), drawn as a muted copper
 *   brown at the palette's lightness.
 * Night: floodlit; the walls and porticoes from below, the drum and dome
 *   brightest (`floodlight`). Windows are `window`, doors `entrance`.
 * Doubts: the end faces and the south face are seen only obliquely; their bay
 *   counts follow the HABS west view and the north face.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, lathe, disc, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { qf, tf, box, gable, bays, faceX, faceY, sOf } from './atl-georgia-state-capitol'

// ---------------------------------------------------------------- dimensions
const X0 = -41.1, X1 = 41.1, Y0 = -14.9, Y1 = 13.0
const YC = (Y0 + Y1) / 2 // the block's (and the dome's) centre line
const FLOOR = 6.8 // the main floor: top of the rusticated storey and the portico podium
const WALL = 18.4, CORN = 19.6 // wall top, top of the entablature / cornice
const BAL0 = 20.0, BAL1 = 21.0, BALT = 21.5 // balustrade: plinth top, rail bottom, rail top
const RIDGE = 24.9 // hipped roof ridge
const PW_N = 15.7, PW_S = 15.05 // portico half-widths
const PN = 26.0, PS = -24.7 // portico fronts
const COLTOP = 17.4, APEX = 25.5

function build() {
  const stone = new Part(), trim = new Part(), copper = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ---- the main block: walls, belt course at the main floor, entablature
  box(stone, null, X0, Y0, X1, Y1, 0, WALL, 0.3)
  box(trim, null, X0 - 0.1, Y0 - 0.1, X1 + 0.1, Y1 + 0.1, 0, 0.8, 0.2) // plinth
  box(trim, null, X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1 + 0.15, FLOOR - 0.5, FLOOR + 0.1, 0.2) // belt course
  box(trim, null, X0 - 0.1, Y0 - 0.1, X1 + 0.1, Y1 + 0.1, WALL - 0.9, WALL, 0.2) // frieze
  box(trim, null, X0 - 0.6, Y0 - 0.6, X1 + 0.6, Y1 + 0.6, WALL, CORN, 0.35) // cornice
  // balustrade: plinth, recessed baluster band, rail, pedestals over the bays
  box(trim, null, X0 - 0.2, Y0 - 0.2, X1 + 0.2, Y1 + 0.2, CORN, BAL0, 0.15)
  box(trim, null, X0 + 0.15, Y0 + 0.15, X1 - 0.15, Y1 - 0.15, BAL0, BAL1, 0)
  box(trim, roof, X0 - 0.25, Y0 - 0.25, X1 + 0.25, Y1 + 0.25, BAL1, BALT, 0.15)
  const pedestal = (x: number, y: number) => box(trim, null, x - 0.45, y - 0.45, x + 0.45, y + 0.45, CORN, BALT + 0.35, 0.1)
  for (const x of [X0 + 0.3, -28.4, -PW_N, PW_N, 28.4, X1 - 0.3]) pedestal(x, Y1 - 0.3)
  for (const x of [X0 + 0.3, -28.4, -PW_S, PW_S, 28.4, X1 - 0.3]) pedestal(x, Y0 + 0.3)
  for (const y of [-7.9, 6.0]) { pedestal(X0 + 0.3, y); pedestal(X1 - 0.3, y) }

  // the low hipped roof behind the balustrade
  {
    const i = 0.3, z0 = BALT, H = (Y1 - Y0) / 2 - i
    const a: V3 = [X0 + i, Y0 + i, z0], b: V3 = [X1 - i, Y0 + i, z0], c: V3 = [X1 - i, Y1 - i, z0], d: V3 = [X0 + i, Y1 - i, z0]
    const r0: V3 = [X0 + i + H, YC, RIDGE], r1: V3 = [X1 - i - H, YC, RIDGE]
    qf(roof, a, b, r1, r0, [0, -1, 2])
    qf(roof, c, d, r0, r1, [0, 1, 2])
    tf(roof, d, a, r0, [-1, 0, 2])
    tf(roof, b, c, r1, [1, 0, 2])
  }

  // ---- facades: per bay an arched ground-floor window, a tall main-floor
  // window under a pediment hood, a small top-storey window
  const hood = (f: Face, sc: number) => extrudeShape(trim, f, [[sc - 1.15, 12.75], [sc + 1.15, 12.75], [sc + 1.15, 13.05], [sc, 13.9], [sc - 1.15, 13.05]], 0, 0.22)
  const facade = (f: Face, a: number, b: number, n: number, skip: number[] = []) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)), s1 = Math.max(sOf(f, a), sOf(f, b))
    const step = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const sc = s0 + step * (k + 0.5)
      if (!skip.includes(k)) flatShape(win, f, archShape(sc, 1.4, 1.6, 4.4, 8), 0.06)
      flatShape(win, f, [[sc - 0.85, 7.6], [sc + 0.85, 7.6], [sc + 0.85, 12.5], [sc - 0.85, 12.5]], 0.06)
      hood(f, sc)
      box(trim, null, ...sillXY(f, sc, 1.15), 7.2, 7.6, 0) // sill / balconette
      flatShape(win, f, [[sc - 0.7, 14.3], [sc + 0.7, 14.3], [sc + 0.7, 16.6], [sc - 0.7, 16.6]], 0.06)
    }
  }
  // a small box sitting out from face f at sc: [x0, y0, x1, y1]
  const sillXY = (f: Face, sc: number, hw: number): [number, number, number, number] => {
    const t: XY = [-f.n[1], f.n[0]]
    const cx = f.o[0] + t[0] * sc, cy = f.o[1] + t[1] * sc
    const ax = cx - t[0] * hw, ay = cy - t[1] * hw, bx = cx + t[0] * hw + f.n[0] * 0.35, by = cy + t[1] * hw + f.n[1] * 0.35
    return [Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by)]
  }
  // long faces of the wings, five bays each
  facade(faceY(Y1, 1), X0 + 0.8, -PW_N - 0.6, 5)
  facade(faceY(Y1, 1), PW_N + 0.6, X1 - 0.8, 5)
  facade(faceY(Y0, -1), X0 + 0.8, -PW_S - 0.6, 5)
  facade(faceY(Y0, -1), PW_S + 0.6, X1 - 0.8, 5)
  // the ends: five bays, an arched door in the middle of the ground storey
  for (const [x, sgn] of [[X0, -1], [X1, 1]] as [number, 1 | -1][]) {
    const f = faceX(x, sgn)
    facade(f, Y0 + 0.8, Y1 - 0.8, 5, [2])
    const sc = sOf(f, YC)
    flatShape(trim, f, archShape(sc, 3.0, 0, 3.9, 10), 0.05)
    flatShape(door, f, archShape(sc, 2.0, 0, 3.6, 10), 0.09)
  }

  // ---- the central gable through the whole depth, pedimented at both ends
  {
    const f = faceY(PN + 0.2, 1)
    gable(trim, roof, f, sOf(f, PW_N + 0.35), sOf(f, -PW_N - 0.35), CORN, APEX, 0, PN + 0.2 - PS, false)
    const g = faceY(PS - 0.2, -1)
    gable(trim, roof, g, sOf(g, -PW_S - 0.35), sOf(g, PW_S + 0.35), CORN, APEX - 0.1, 0, 0.6, false)
    // raking cornice lip and a block on each apex
    box(trim, null, -0.9, PN - 0.6, 0.9, PN + 0.5, APEX - 0.5, APEX + 0.5, 0.1)
    box(trim, null, -0.9, PS - 0.5, 0.9, PS + 0.6, APEX - 0.6, APEX + 0.4, 0.1)
  }

  // ---- porticoes: podium, steps, columns, entablature, back wall openings
  const portico = (pw: number, yIn: number, yOut: number, sides: number) => {
    const dir = Math.sign(yOut - yIn)
    const ya = Math.min(yIn, yOut), yb = Math.max(yIn, yOut)
    // podium and its floor
    box(stone, null, -pw, ya, pw, yb, 0, FLOOR - 0.5, 0.25)
    box(trim, trim, -pw - 0.15, ya, pw + 0.15, yb + (dir > 0 ? 0.15 : 0) - (dir < 0 ? 0.15 : 0), FLOOR - 0.5, FLOOR + 0.1, 0.15)
    // arched openings in the podium's sides
    for (const [x, sgn] of [[-pw, -1], [pw, 1]] as [number, 1 | -1][]) {
      const f = faceX(x, sgn)
      const s0 = Math.min(sOf(f, ya), sOf(f, yb)), s1 = Math.max(sOf(f, ya), sOf(f, yb))
      bays(win, f, s0 + 1.5, s1 - 1.5, 2, 1.5, 1.4, 4.6, true)
    }
    // the entablature over the columns (wall to front)
    const ea = dir > 0 ? Y1 - 0.5 : yOut - 0.2, eb = dir > 0 ? yOut + 0.2 : Y0 + 0.5
    box(trim, null, -pw - 0.2, ea, pw + 0.2, eb, COLTOP, CORN, 0.3)
    // columns: ten across the front, `sides` more down each side
    const yF = yOut - dir * 1.0, xs = pw - 1.0, sp = (2 * xs) / 9
    const col = (x: number, y: number) => {
      box(trim, null, x - 0.8, y - 0.8, x + 0.8, y + 0.8, FLOOR + 0.1, FLOOR + 0.6, 0)
      lathe(trim, x, y, [[0.66, FLOOR + 0.6], [0.56, COLTOP - 1.1]], 8)
      lathe(trim, x, y, [[0.56, COLTOP - 1.1], [0.95, COLTOP]], 8) // the capital, flared
    }
    for (let k = 0; k < 10; k++) col(-xs + sp * k, yF)
    for (let k = 1; k <= sides; k++) for (const x of [-xs, xs]) col(x, yF - dir * sp * k)
    // the back wall (the block's face): main door and windows on both floors
    const f = faceY(dir > 0 ? Y1 : Y0, dir > 0 ? 1 : -1)
    flatShape(door, f, [[-1.3, FLOOR + 0.1], [1.3, FLOOR + 0.1], [1.3, FLOOR + 4.9], [-1.3, FLOOR + 4.9]], 0.06)
    flatShape(win, f, [[-1.1, FLOOR + 5.4], [1.1, FLOOR + 5.4], [1.1, FLOOR + 7.0], [-1.1, FLOOR + 7.0]], 0.06)
    for (const x of [-11.5, -6.6, 6.6, 11.5]) {
      const sc = sOf(f, x)
      flatShape(win, f, [[sc - 0.85, 7.8], [sc + 0.85, 7.8], [sc + 0.85, 12.2], [sc - 0.85, 12.2]], 0.06)
      flatShape(win, f, [[sc - 0.7, 13.4], [sc + 0.7, 13.4], [sc + 0.7, 15.6], [sc - 0.7, 15.6]], 0.06)
    }
    // the steps: ten broad treads down to the ground between sloping cheek walls
    const RUN = 13, N = 10, HW = 8.6, CW = 1.5
    for (let k = 0; k < N; k++) {
      const y0 = yOut + dir * (RUN * k) / N, y1 = yOut + dir * (RUN * (k + 1)) / N
      box(trim, trim, -HW, Math.min(y0, y1), HW, Math.max(y0, y1), 0, (FLOOR + 0.1) * (N - k) / N, 0)
    }
    for (const sx of [-1, 1]) {
      const xa = sx * HW, xb = sx * (HW + CW)
      const P = (x: number, y: number, z: number): V3 => [x, y, z]
      const yE = yOut + dir * RUN
      const prof: [number, number][] = [[yOut, 0], [yE, 0], [yE, 1.1], [yOut + dir * 3, FLOOR + 0.8], [yOut, FLOOR + 0.8]]
      for (const [x, nx] of [[xa, -sx], [xb, sx]]) {
        for (const [i, j, l] of [[0, 1, 2], [0, 2, 3], [0, 3, 4]]) tf(stone, P(x, ...prof[i]), P(x, ...prof[j]), P(x, ...prof[l]), [nx, 0, 0])
      }
      for (let i = 1; i < prof.length; i++) {
        const [ya2, za] = prof[i], [yb2, zb] = prof[(i + 1) % prof.length]
        if (i === prof.length - 1) continue // the face against the podium is hidden
        // the end face looks away from the building, the tops look up
        qf(stone, P(xa, ya2, za), P(xa, yb2, zb), P(xb, yb2, zb), P(xb, ya2, za), i === 1 ? [0, dir, 0] : [0, dir * 0.5, 1])
      }
    }
  }
  portico(PW_N, Y1, PN, 3)
  portico(PW_S, Y0, PS, 2)

  // ---- the dome's square base with its balustrade
  const C: XY = [0, YC]
  box(stone, null, C[0] - 9.3, C[1] - 9.3, C[0] + 9.3, C[1] + 9.3, CORN, 25.0, 0.3)
  box(trim, null, C[0] - 9.6, C[1] - 9.6, C[0] + 9.6, C[1] + 9.6, 25.0, 25.6, 0.3)
  box(trim, null, C[0] - 9.2, C[1] - 9.2, C[0] + 9.2, C[1] + 9.2, 25.6, 26.3, 0)
  box(trim, roof, C[0] - 9.5, C[1] - 9.5, C[0] + 9.5, C[1] + 9.5, 26.3, 26.7, 0.15)

  // ---- the drum: stone cylinder, twelve arched windows between engaged columns
  const RD = 7.2, NW = 12
  lathe(stone, C[0], C[1], [[RD, 26.6], [RD, 32.2]], 24)
  for (let k = 0; k < NW; k++) {
    const a = ((k + 0.5) / NW) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    const f: Face = { o: [C[0] + c * RD * 0.99, C[1] + s * RD * 0.99, 0], n: [c, s] }
    flatShape(win, f, archShape(0, 1.5, 27.6, 30.45, 8), 0.07)
    const b = (k / NW) * 2 * Math.PI
    lathe(trim, C[0] + Math.cos(b) * (RD + 0.2), C[1] + Math.sin(b) * (RD + 0.2), [[0.42, 26.7], [0.38, 31.7], [0.55, 32.2]], 6)
  }
  // the drum's copper entablature and its broad flared eave (r 9.2 in the south photo)
  lathe(copper, C[0], C[1], [[RD, 32.2], [7.75, 32.2], [7.75, 33.2], [9.2, 33.9], [9.2, 34.4], [7.3, 35.7]], 24)
  // the dome: a quarter ellipse to the lantern ring (lidar: 41 at r 5.5, 42.4 at r 4.5)
  const R = 7.3, Z0 = 35.7, H = 8.0, RING = 2.9
  const tEnd = Math.acos(RING / R)
  const prof: [number, number][] = []
  for (let k = 0; k <= 7; k++) { const t = (tEnd * k) / 7; prof.push([R * Math.cos(t), Z0 + H * Math.sin(t)]) }
  lathe(copper, C[0], C[1], prof, 24)
  const zRing = prof[prof.length - 1][1]
  // eight oculus dormers
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * 2 * Math.PI + Math.PI / 2, c = Math.cos(a), s = Math.sin(a)
    const rr = 7.3, w = 0.8, z0 = 37.5, z1 = 39.4, dep = 1.8
    const P = (r: number, t: number, z: number): V3 => [C[0] + c * r - s * t, C[1] + s * r + c * t, z]
    const out: V3 = [c, s, 0]
    qf(copper, P(rr, -w, z0), P(rr, w, z0), P(rr, w, z1), P(rr, -w, z1), out) // front
    qf(copper, P(rr, w, z0), P(rr - dep, w, z0), P(rr - dep, w, z1), P(rr, w, z1), [-s, c, 0])
    qf(copper, P(rr, -w, z0), P(rr - dep, -w, z0), P(rr - dep, -w, z1), P(rr, -w, z1), [s, -c, 0])
    // a little round hood
    tf(copper, P(rr + 0.1, -w - 0.1, z1), P(rr + 0.1, w + 0.1, z1), P(rr + 0.1, 0, z1 + 0.55), out)
    qf(copper, P(rr + 0.1, -w - 0.1, z1), P(rr + 0.1, 0, z1 + 0.55), P(rr - dep, 0, z1 + 0.55), P(rr - dep, -w - 0.1, z1), [s, -c, 1])
    qf(copper, P(rr + 0.1, w + 0.1, z1), P(rr + 0.1, 0, z1 + 0.55), P(rr - dep, 0, z1 + 0.55), P(rr - dep, w + 0.1, z1), [-s, c, 1])
    const f: Face = { o: P(rr, 0, 0), n: [c, s] }
    const ring: XY[] = [], hole: XY[] = []
    for (let i = 0; i < 10; i++) { const u = (i / 10) * 2 * Math.PI; ring.push([0.62 * Math.cos(u), 38.45 + 0.62 * Math.sin(u)]); hole.push([0.42 * Math.cos(u), 38.45 + 0.42 * Math.sin(u)]) }
    flatShape(trim, f, ring, 0.04)
    flatShape(win, f, hole, 0.08)
  }
  // the lantern: a ring, the body with eight arched openings, cornice, cap, ball
  lathe(trim, C[0], C[1], [[RING, zRing - 0.2], [3.3, zRing], [3.3, zRing + 0.5], [2.8, zRing + 0.5]], 16)
  lathe(copper, C[0], C[1], [[2.8, zRing + 0.5], [2.8, 48.9]], 16)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    const f: Face = { o: [C[0] + c * 2.77, C[1] + s * 2.77, 0], n: [c, s] }
    flatShape(win, f, archShape(0, 0.85, 44.6, 47.6, 6), 0.06)
  }
  lathe(copper, C[0], C[1], [[2.8, 48.9], [3.35, 49.0], [3.35, 49.8], [2.8, 49.9], [2.2, 50.8], [1.2, 51.5], [0.45, 51.8]], 16)
  lathe(copper, C[0], C[1], [[0.45, 51.8], [0.3, 52.0], [0.42, 52.3], [0.4, 52.6], [0.01, 52.9]], 8)

  // Floodlit at night: the walls more the higher they are, porticoes and the dome brightest.
  const wallLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.6 + 0.4 * Math.min(1, p[2] / 30))
  const domeLit = (_p: V3, n: V3) => (n[2] > 0.95 ? 0.7 : 1)
  return finishGlb('South Carolina State House', [
    { part: stone, material: { ...finish('cola-granite', 0xe0dfd9), floodlight: wallLit } as Swatch },
    { part: trim, material: { ...finish('cola-granite-trim', 0xf0eee8), floodlight: wallLit } as Swatch },
    { part: copper, material: { ...finish('cola-dome-copper', 0x866a58), floodlight: domeLit } as Swatch },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 339.7, height: 52.9, replaces: ['way/51731354'] }, 6500)
}

if (import.meta.main) await writeModel('cola-state-house', build())
