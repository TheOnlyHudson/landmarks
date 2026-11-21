/**
 * Holy Cross–Immaculata Church, 30 Guido Street, Mount Adams, Cincinnati
 * (1859–60, built for Archbishop Purcell; Gothic Revival) — original
 * procedural geometry, CC0-1.0.
 * bun generators/cin-holy-cross-immaculata.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 33.9 (the nave's axis): the front gable faces
 * -y (compass 213.9, toward downtown and the river, at the head of the
 * Immaculata steps); the single corner tower stands at the front's +x
 * (south-east) corner. Anchor = centroid of OSM way/42707576,
 * -84.496420, 39.107066.
 *
 * Note: the brief described twin front towers; every photo shows one
 * corner tower, and OSM has one (way/1453476108). The model follows the
 * evidence.
 *
 * Identity (from the photos below):
 *  1. The steep gable front with its big rose window, the tall pointed
 *     main door and the white statue of Mary on the apex.
 *  2. The square corner tower with clasping buttresses, a tall louvred
 *     belfry lancet and an oculus, four small gablets round the base of
 *     a green copper octagonal spire with a cross.
 *  3. A long, high nave under a steep grey roof, tall lancet windows
 *     between buttresses; a lower block round the apse at the back.
 *
 * Plan: OSM way/42707576 (outline) and its building:part ways read in the
 * turned frame: nave way/1453476102 x -9.6..8.3, y -23.1..14.4; tower
 * way/1453476108 (and /1453476105, the same footprint) x 7.2..12.0,
 * y -23.0..-18.6, with the gablets /1453600323, /1453603040, /1453603041,
 * /1453603042; front porch /1453476104; side porch /1453476103; the back:
 * /1466646669, /1466646670, /1466646671 (apse block), /1453476106
 * (sacristy), /1453476101, /1453476107, /1453476962 (low annexes).
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown about 2021), 0.5 m grid read in this frame (the grid was centred
 * 6 m off the anchor; offsets corrected). y = 0 is the lowest ground, at
 * the front (lidar ground_min + 23.0); the back stands about 1.5 m higher.
 * Measured: nave eaves 10.7, ridge 19.6; tower shoulders about 21, the
 * spire's highest return 29.1 (tip drawn to 28.6, cross to 30.2); apse block
 * about 10; sacristy 10.8 ridge; annexes 6–9. Estimated from the photos:
 * the rose window, door, lancets, buttresses, belfry, gablets, statue.
 *
 * Ground: Mapterhorn and lidar agree within about 1 m; the steep drop to
 * the west is outside the footprint. Elevation 0.
 *
 * Night: windows, the rose and the belfry openings glow.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - ImmaculateConceptionChurch.jpg, Greg Hume (Greg5030), CC BY 3.0 (the
 *    front and tower from close by)
 *    https://commons.wikimedia.org/wiki/File:ImmaculateConceptionChurch.jpg
 *  - Holy Cross Immaculata Catholic Church, Mount Adams, Cincinnati, OH
 *    (46415250124).jpg, Warren LeMay, CC0 (the front from the steps)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Immaculata_Catholic_Church,_Mount_Adams,_Cincinnati,_OH_(46415250124).jpg
 *  - ... (47086667982).jpg, Warren LeMay, CC0 (the front and tower from
 *    below the retaining wall)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Immaculata_Catholic_Church,_Mount_Adams,_Cincinnati,_OH_(47086667982).jpg
 *  - Holy Cross Immaculata Church, Mount Adams, Cincinnati, OH
 *    (46414169064).jpg, Warren LeMay, CC0 (the tower from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Immaculata_Church,_Mount_Adams,_Cincinnati,_OH_(46414169064).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the long sides and the back are seen only obliquely; the bay
 * count (seven) and the lancet sizes are estimated. The landing and steps
 * in front of the church are not part of the building and not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, gableRoof, hipRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { lancet } from './cin-old-st-marys'

const circ = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

if (import.meta.main) {
  const wallP = new Part(), trim = new Part(), win = new Part(), roof = new Part(), cu = new Part(), door = new Part()

  // ── nave ──
  const X0 = -9.4, X1 = 8.3, Y0 = -23.1, Y1 = 14.4, EAVE = 10.7, RIDGE = 19.6
  box(wallP, X0, X1, Y0, Y1, 0, EAVE, null, 0)
  box(trim, X0 - 0.15, X1 + 0.15, Y0 - 0.15, Y1 + 0.15, 0, 1.0, null, 0)
  gableRoof(roof, wallP, X0, X1, Y0, Y1, EAVE, RIDGE, 'y', 0.4, 0.35)

  // buttresses and lancets along both sides: seven bays
  const nb = 7, bw = (Y1 - Y0) / nb
  const sides: [XY, XY][] = [[[X0, Y1], [X0, Y0]], [[X1, Y0], [X1, Y1]]]
  for (const [a, b] of sides) {
    const L = Y1 - Y0
    const nx = a[0] < 0 ? -1 : 1, x = a[0]
    for (let k = 1; k < nb; k++) {
      const y = Y0 + k * bw
      box(trim, Math.min(x, x + nx * 0.9), Math.max(x, x + nx * 0.9), y - 0.4, y + 0.4, 0, EAVE - 2.2, trim, 0.25)
      box(trim, Math.min(x, x + nx * 0.55), Math.max(x, x + nx * 0.55), y - 0.4, y + 0.4, EAVE - 2.2, EAVE - 0.6, trim, 0.25)
    }
    for (let k = 0; k < nb; k++) {
      const s = bw * (k + 0.5)
      if (a[0] > 0 && s < 5.4) continue // behind the tower
      void L
      onWall(trim, a, b, lancet(s, 2.0, 2.6, 7.6), 0.04)
      onWall(win, a, b, lancet(s, 1.5, 2.8, 7.6), 0.08)
    }
  }

  // ── the front ──
  {
    const a: XY = [X0, Y0], b: XY = [X1, Y0], W = X1 - X0, sm = W / 2 // s = x - X0
    // corner buttresses with set-offs
    for (const s of [0.5, W - 0.5]) {
      const x = X0 + s
      box(trim, x - 0.55, x + 0.55, Y0 - 1.0, Y0, 0, 6.0, trim, 0.25)
      box(trim, x - 0.45, x + 0.45, Y0 - 0.6, Y0, 6.0, EAVE + 0.4, trim, 0.25)
    }
    // main door: a pointed arch in a pale surround, a tympanum
    onWall(trim, a, b, lancet(sm, 3.6, 0, 3.9), 0.05)
    onWall(door, a, b, rectShape(sm - 1.35, sm + 1.35, 0, 3.6), 0.09)
    onWall(win, a, b, lancet(sm, 2.7, 3.6, 3.9), 0.09)
    // the rose window
    onWall(trim, a, b, circ(sm, 11.2, 2.25), 0.05)
    onWall(win, a, b, circ(sm, 11.2, 1.85), 0.09)
    for (let k = 0; k < 4; k++) {
      const t = (k / 4) * Math.PI, c = Math.cos(t), si = Math.sin(t)
      onWall(trim, a, b, [[sm + c * 1.85 - si * 0.08, 11.2 + si * 1.85 + c * 0.08], [sm - c * 1.85 - si * 0.08, 11.2 - si * 1.85 + c * 0.08], [sm - c * 1.85 + si * 0.08, 11.2 - si * 1.85 - c * 0.08], [sm + c * 1.85 + si * 0.08, 11.2 + si * 1.85 - c * 0.08]], 0.12)
    }
    // lancets either side of the door, a small one in the gable
    for (const s of [sm - 5.2, sm + 5.2]) { onWall(trim, a, b, lancet(s, 1.5, 3.0, 6.6), 0.04); onWall(win, a, b, lancet(s, 1.1, 3.2, 6.6), 0.08) }
    onWall(win, a, b, lancet(sm, 0.8, 15.2, 16.4), 0.08)
    // raking cornice along the gable
    for (const k of [-1, 1]) {
      const sec = (x: number, z: number): V3[] => [[x, Y0 - 0.45, z], [x, Y0 - 0.45, z - 0.55], [x, Y0 + 0.05, z - 0.55], [x, Y0 + 0.05, z]]
      const xm = (X0 + X1) / 2, xe = k < 0 ? X0 - 0.35 : X1 + 0.35
      trim.sweep([sec(xe, EAVE + 0.3), sec(xm, RIDGE + 0.45)])
    }
    // the statue on the apex: pedestal and a white figure
    const xm = (X0 + X1) / 2
    box(trim, xm - 0.5, xm + 0.5, Y0 - 0.3, Y0 + 0.7, RIDGE - 0.2, RIDGE + 0.9, trim, 0.1)
    revolve(trim, [xm, Y0 + 0.2], [[0.45, RIDGE + 0.9], [0.4, RIDGE + 1.8], [0.3, RIDGE + 2.4], [0.22, RIDGE + 2.6], [0.2, RIDGE + 2.9], [0, RIDGE + 3.1]], 8, 0, false, true)
    // the small front porch (way/1453476104) before the door
  }
  {
    const xm = (X0 + X1) / 2
    box(wallP, xm - 2.2, xm + 2.2, -26.3, Y0, 0, 4.4, null, 0)
    gableRoof(roof, wallP, xm - 2.2, xm + 2.2, -26.3, Y0, 4.4, 6.5, 'y', 0.25, 0.2)
    onWall(trim, [xm - 2.2, -26.3], [xm + 2.2, -26.3], lancet(2.2, 2.6, 0, 2.8), 0.05)
    onWall(door, [xm - 2.2, -26.3], [xm + 2.2, -26.3], lancet(2.2, 2.0, 0, 2.8), 0.09)
  }
  // side porch (way/1453476103)
  box(wallP, -11.3, X0, -3.6, 0.3, 0, 3.6, null, 0)
  gableRoof(roof, wallP, -11.3, X0, -3.6, 0.3, 3.6, 5.0, 'x', 0.2, 0.15)
  onWall(door, [-11.3, 0.3], [-11.3, -3.6], archShape(1.95, 1.4, 0.3, 2.3, 6), 0.06)

  // ── tower ──
  {
    const TX0 = 7.2, TX1 = 12.0, TY0 = -23.4, TY1 = -18.6, ZS = 20.0, ZG = 21.6, ZTIP = 28.6
    const cx = (TX0 + TX1) / 2, cy = (TY0 + TY1) / 2, h = (TX1 - TX0) / 2
    box(wallP, TX0, TX1, TY0, TY1, 0, ZS, null, 0)
    // clasping buttresses at the corners, stepping in
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = cx + sx * h, y = cy + sy * h
      box(trim, Math.min(x, x - sx * 1.1), Math.max(x, x - sx * 1.1) , Math.min(y, y + sy * 0.6), Math.max(y, y + sy * 0.6), 0, 9.0, trim, 0.25)
      box(trim, Math.min(x, x + sx * 0.6), Math.max(x, x + sx * 0.6), Math.min(y, y - sy * 1.1), Math.max(y, y - sy * 1.1), 0, 9.0, trim, 0.25)
      box(trim, Math.min(x, x + sx * 0.35), Math.max(x, x + sx * 0.35), Math.min(y, y + sy * 0.35), Math.max(y, y + sy * 0.35), 9.0, ZS - 3.0, trim, 0.2)
    }
    const fs: [XY, XY][] = [[[TX0, TY0], [TX1, TY0]], [[TX1, TY0], [TX1, TY1]], [[TX1, TY1], [TX0, TY1]], [[TX0, TY1], [TX0, TY0]]]
    for (const [a, b] of fs) {
      // the belfry lancet (louvred) and an oculus; a small lancet lower down
      onWall(trim, a, b, lancet(h, 1.8, 14.6, 17.6), 0.04)
      onWall(win, a, b, lancet(h, 1.3, 14.8, 17.6), 0.08)
      onWall(trim, a, b, circ(h, 11.8, 0.8, 12), 0.04)
      onWall(win, a, b, circ(h, 11.8, 0.55, 12), 0.08)
    }
    // the tall pointed door in the tower's front, at the top of a few steps
    onWall(trim, [TX0, TY0], [TX1, TY0], lancet(h, 2.4, 0, 3.6), 0.05)
    onWall(door, [TX0, TY0], [TX1, TY0], lancet(h, 1.8, 0.4, 3.6), 0.09)
    box(trim, TX0 + 0.8, TX1 - 0.8, TY0 - 1.4, TY0, 0, 0.4, trim, 0.05)
    // the belfry string course and the four gablets round the spire's foot
    box(trim, TX0 - 0.2, TX1 + 0.2, TY0 - 0.2, TY1 + 0.2, ZS - 0.5, ZS, null, 0.1)
    gableRoof(cu, wallP, TX0 + 1.2, TX1 - 1.2, TY0, TY1, ZS, ZG, 'y', 0.1, 0.05)
    gableRoof(cu, wallP, TX0, TX1, TY0 + 1.2, TY1 - 1.2, ZS, ZG, 'x', 0.1, 0.05)
    // octagonal copper spire, ball and cross
    revolve(cu, [cx, cy], [[1.75, ZS + 0.3], [1.55, ZG + 0.4], [0.1, ZTIP]], 8, Math.PI / 8, true, false)
    revolve(trim, [cx, cy], [[0, ZTIP - 0.1], [0.22, ZTIP], [0.22, ZTIP + 0.25], [0, ZTIP + 0.35]], 6, 0, true, false)
    box(trim, cx - 0.09, cx + 0.09, cy - 0.09, cy + 0.09, ZTIP + 0.3, ZTIP + 1.6, trim, 0)
    box(trim, cx - 0.45, cx + 0.45, cy - 0.09, cy + 0.09, ZTIP + 1.0, ZTIP + 1.2, trim, 0)
  }

  // ── the back: apse block, sacristy and annexes ──
  box(wallP, -9.5, 8.3, 14.3, 20.3, 0, 9.4, null, 0)
  hipRoof(roof, -9.5, 8.3, 14.3, 20.3, 9.4, 10.6, 0.25)
  for (const s of [3, 8.9, 14.8]) onWall(win, [8.3, 20.3], [-9.5, 20.3], lancet(s, 1.2, 3.0, 6.4), 0.06)
  box(wallP, 1.9, 13.1, 14.4, 22.6, 0, 8.4, null, 0)
  gableRoof(roof, wallP, 1.9, 13.1, 14.4, 22.6, 8.4, 10.8, 'x', 0.25, 0.2)
  for (const s of [2.2, 5.6]) onWall(win, [13.1, 14.4], [13.1, 22.6], rectShape(s - 0.5, s + 0.5, 3.2, 5.6), 0.06)
  box(wallP, -9.6, -4.2, 20.0, 25.5, 0, 8.6, roof, 0.2)
  box(wallP, 2.0, 7.5, 20.1, 22.6, 0, 4.2, roof, 0.15)
  box(wallP, 13.0, 14.3, 15.1, 21.9, 0, 5.5, roof, 0.1)

  await save('cin-holy-cross-immaculata', 'Holy Cross–Immaculata Church', [
    { part: wallP, material: finish('hci-stone', 0xd3cab9) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: cu, material: PALETTE.copper },
    { part: door, material: finish('hci-door', 0x6a5644) },
  ], { height: 30.2, anchor: [39.107066, -84.49642], bearing: 33.9 })
}
