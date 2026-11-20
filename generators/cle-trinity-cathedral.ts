/**
 * Trinity Cathedral (Episcopal; Charles F. Schweinfurth, consecrated 1907),
 * Euclid Avenue at East 22nd Street, Cleveland. Procedural, CC0-1.0.
 * bun generators/cle-trinity-cathedral.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, turned to bearing 350: +y runs up the
 * nave to the west front on Euclid Avenue (which faces true 350), -x is
 * the East 22nd Street side. Origin at the area centroid of OSM
 * way/915614805 (-81.6741543, 41.5013188). z = 0 is the ground at the
 * Euclid front, the lowest under the outline; it rises ~1.5 m to the choir
 * end (lidar and Mapterhorn agree). Elevation 0.
 *
 * Identity, in order: the square crossing tower with three tall lancets a
 * face, its battlemented parapet, four big octagonal corner pinnacles and
 * the smaller ones between; the steep pale-green copper roofs of the nave,
 * transepts and choir; the front gable with its great traceried window
 * between two pinnacled octagonal turrets, over the three-arched narthex
 * with its pierced parapet; the transept gables and their windows; the
 * nave's buttresses with pinnacles and flyers; the low south-west block.
 *
 * Evidence:
 *  - plan: OSM way/915614805 (building=yes, unnamed; the cathedral's
 *    outline, with node/357414737 "Trinity Cathedral", Q7842605, inside
 *    it). The cross is read from the lidar: nave x +-7.2, aisles to +-9.5,
 *    transepts y -7..7 from x -18 to 18.8, the choir to y -24.5, the
 *    south-east block x 7.2..18.8 and the south-west block x -18..-7.2.
 *    The narthex (y 28.5..31.5) is in the lidar and the photos but outside
 *    the OSM outline; it is drawn.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    0.5 m grid, read with tools/lidar_frame.py at bearing 350, above the
 *    ground at the front: nave and transept eaves ~15.8, ridges 22.4;
 *    aisles ~9.8 with buttress pinnacles to ~14; narthex ~9.3; tower roof
 *    32.7, parapet ~35, corner pinnacles ~40 (tower centre at x -0.6,
 *    11.6 m square); gable turrets ~22-24; south-east block 15.0, south-west
 *    block ~10.5.
 *  - published: Charles F. Schweinfurth architect, built 1901-07 of Indiana
 *    limestone (Wikipedia "Trinity Cathedral (Cleveland)").
 *  - estimated from the photos scaled to the lidar: the windows (front
 *    window 6 m wide, 8.5-19; transept windows 5.5 m), the belfry lancets
 *    (1.5 m, 24-31), the narthex arches, buttress spacing (4 m).
 *  - colour: buff-grey limestone, pale green copper roofs, oak doors.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - https://commons.wikimedia.org/wiki/File:Trinity_Cathedral_Church.jpg
 *    Kimshay2016, CC BY-SA 4.0 (elevated, from the north-west)
 *  - https://commons.wikimedia.org/wiki/File:Trinity_Cathedral_in_Cleveland,_front,_closeup.jpg
 *    Nyttend, public domain (from the north-west)
 *  - https://commons.wikimedia.org/wiki/File:Trinity_Cathedral_in_Cleveland,_front,_distant.jpg
 *    Nyttend, public domain
 *  - https://commons.wikimedia.org/wiki/File:Trinity_Cathedral_in_Cleveland,_rear_and_side.jpg
 *    Nyttend, public domain (from the south-west, along E. 22nd)
 *  - https://commons.wikimedia.org/wiki/File:Trinity_Cathedral_in_Cleveland,_base_view,_rear_angle.jpg
 *    Nyttend, public domain
 *  - HABS OHIO,18-CLEV,15-1 (north front) and 15-2 (south-west corner),
 *    Martin Linsey 1965, public domain, via Commons.
 *  - USGS NAIP orthophoto (public domain).
 * No look-only sources. No commercial imagery.
 *
 * Left out: tracery beyond a few bold mullions, crockets, the pierced
 * parapets (solid), statues. The dark sandstone chapel south of the
 * cathedral is a separate building and is not drawn.
 * Doubts: the east side is hemmed in by the parish buildings and is not
 * in any photo used; the south-east block is plain massing from the
 * lidar. The night look is windows only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, panel, onWall, lathe, save } from './chi-field-museum'
import { band, poly, wallsSplit } from './pit-allegheny-county-courthouse'

/** A pointed (equilateral) lancet on wall a→b: jambs s0..s1 from z0 to the springing zs. */
function lancet(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 4) {
  const { P, n } = onWall(a, b)
  const w = s1 - s0
  const pts: V3[] = [P(s0, z0, out), P(s1, z0, out)]
  for (let k = 0; k <= seg; k++) { const t = (k / seg) * (Math.PI / 3); pts.push(P(s0 + w * Math.cos(t), zs + w * Math.sin(t), out)) }
  for (let k = 1; k <= seg; k++) { const t = (2 * Math.PI) / 3 + (k / seg) * (Math.PI / 3); pts.push(P(s1 + w * Math.cos(t), zs + w * Math.sin(t), out)) }
  poly(p, pts, [n[0], n[1], 0])
  return zs + w * Math.sin(Math.PI / 3)
}

/** A gabled block: walls to `eave`, a copper roof to `ridge`; the ridge runs along y (alongY) or x. Gable walls in `gable`. */
function gabled(wall: Part, roof: Part, gable: Part, r: [number, number, number, number], eave: number, ridge: number, alongY: boolean, ends: [boolean, boolean] = [true, true]) {
  const [x0, y0, x1, y1] = r
  wallsSplit(wall, rect(x0, y0, x1, y1), 0, eave, 5)
  const o = 0.3
  if (alongY) {
    const xm = (x0 + x1) / 2
    poly(roof, [[x1 + o, y0, eave - 0.3], [x1 + o, y1, eave - 0.3], [xm, y1, ridge], [xm, y0, ridge]], [1, 0, 1])
    poly(roof, [[x0 - o, y1, eave - 0.3], [x0 - o, y0, eave - 0.3], [xm, y0, ridge], [xm, y1, ridge]], [-1, 0, 1])
    if (ends[0]) poly(gable, [[x0, y0, eave], [x1, y0, eave], [xm, y0, ridge]], [0, -1, 0])
    if (ends[1]) poly(gable, [[x1, y1, eave], [x0, y1, eave], [xm, y1, ridge]], [0, 1, 0])
  } else {
    const ym = (y0 + y1) / 2
    poly(roof, [[x0, y1 + o, eave - 0.3], [x1, y1 + o, eave - 0.3], [x1, ym, ridge], [x0, ym, ridge]], [0, 1, 1])
    poly(roof, [[x1, y0 - o, eave - 0.3], [x0, y0 - o, eave - 0.3], [x0, ym, ridge], [x1, ym, ridge]], [0, -1, 1])
    if (ends[0]) poly(gable, [[x0, y1, eave], [x0, y0, eave], [x0, ym, ridge]], [-1, 0, 0])
    if (ends[1]) poly(gable, [[x1, y0, eave], [x1, y1, eave], [x1, ym, ridge]], [1, 0, 0])
  }
}

/** An octagonal turret from z0 to z1, radius r, with a spirelet to `tip`. */
function turret(p: Part, cap: Part, x: number, y: number, r: number, z0: number, z1: number, tip: number) {
  lathe(p, x, y, [[r, z0], [r, z1 - 0.5], [r * 1.2, z1 - 0.5], [r * 1.2, z1]], 8, Math.PI / 8)
  lathe(cap, x, y, [[r * 1.0, z1], [0.05, tip]], 8, Math.PI / 8)
}
/** A square pinnacle on (x, y), half-size h: shaft z0..z1, then a pyramid to `tip`. */
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number, tip: number) {
  walls(p, rect(x - h, y - h, x + h, y + h), z0, z1)
  const r = rect(x - h, y - h, x + h, y + h)
  for (let i = 0; i < 4; i++) p.tri([r[i][0], r[i][1], z1], [r[(i + 1) % 4][0], r[(i + 1) % 4][1], z1], [x, y, tip])
}

function build() {
  const stone = new Part(), trim = new Part(), cu = new Part(), roof = new Part(), win = new Part(), oak = new Part()
  const EAVE = 15.8, RIDGE = 22.4
  const NX = 7.2, AX = 9.5 // nave and aisle half-widths

  // ------------------------------------------------------------ nave, aisles, front
  const YF = 28.5, YX = 7.0 // front wall, crossing edge
  gabled(stone, cu, stone, [-NX, YX, NX, YF], EAVE, RIDGE, true, [false, true])
  for (const s of [-1, 1]) {
    const r = s < 0 ? rect(-AX, YX, -NX, YF) : rect(NX, YX, AX, YF)
    wallsSplit(stone, r, 0, 9.2, 5)
    band(trim, r, inset(r, -0.2), 9.2, 9.8, 0.15)
    cap(roof, inset(r, -0.2), 9.8)
  }
  band(trim, rect(-NX, YX, NX, YF), inset(rect(-NX, YX, NX, YF), -0.25), EAVE - 0.6, EAVE, 0.2)
  // buttresses with pinnacles and flyers, clerestory and aisle windows
  for (let y = YX + 2.0; y < YF - 1.0; y += 4.0) {
    for (const s of [-1, 1]) {
      const xo = s * (AX + 1.0), xi = s * AX
      const bx0 = Math.min(xo, xi), bx1 = Math.max(xo, xi)
      block(stone, trim, rect(bx0, y - 0.55, bx1, y + 0.55), 0, 11.6, 0.15)
      pinnacle(trim, (bx0 + bx1) / 2, y, 0.4, 11.6, 12.4, 14.2)
      // the flyer: a sloping slab from the pier to the clerestory wall
      const xa = s * (AX + 0.5), xb = s * NX
      const q: V3[] = [[xa, y - 0.3, 11.4], [xb, y - 0.3, 14.6], [xb, y + 0.3, 14.6], [xa, y + 0.3, 11.4]]
      poly(stone, [q[0], q[1], q[2], q[3]], [s, 0, 1])
      poly(stone, [[xa, y - 0.3, 10.6], [xb, y - 0.3, 13.8], q[1], q[0]], [0, -1, 0])
      poly(stone, [q[3], q[2], [xb, y + 0.3, 13.8], [xa, y + 0.3, 10.6]], [0, 1, 0])
    }
    if (y + 2.0 < YF - 0.5) {
      const yc = y + 2.0
      for (const s of [-1, 1]) {
        const cw: [XY, XY] = s < 0 ? [[-NX, YF], [-NX, YX]] : [[NX, YX], [NX, YF]]
        const sc = s < 0 ? YF - yc : yc - YX
        lancet(win, cw[0], cw[1], sc - 0.75, sc + 0.75, 10.4, 13.2, 0.05)
        const aw: [XY, XY] = s < 0 ? [[-AX, YF], [-AX, YX]] : [[AX, YX], [AX, YF]]
        lancet(win, aw[0], aw[1], sc - 0.8, sc + 0.8, 3.0, 6.6, 0.05)
      }
    }
  }
  // the front gable wall, its great window and the turrets
  {
    const a: XY = [NX, YF], b: XY = [-NX, YF]
    panel(trim, a, b, 0, 2 * NX, EAVE - 0.6, EAVE, 0.1)
    lancet(trim, a, b, NX - 3.4, NX + 3.4, 9.6, 14.6, 0.04, 6)
    lancet(win, a, b, NX - 2.9, NX + 2.9, 10.0, 14.6, 0.09, 6)
    for (const d of [-1.45, 0, 1.45]) panel(trim, a, b, NX + d - 0.1, NX + d + 0.1, 10.0, 14.6 + 2.9 * Math.sin(Math.PI / 3) - Math.abs(d) * 0.9, 0.12)
    panel(trim, a, b, NX - 2.9, NX + 2.9, 14.0, 14.2, 0.12)
    // the gable's coping and cross
    for (const s of [-1, 1]) {
      const xa = s * NX, xb = 0
      poly(trim, [[xa, YF + 0.35, EAVE], [xb, YF + 0.35, RIDGE + 0.2], [xb, YF - 0.3, RIDGE + 0.2], [xa, YF - 0.3, EAVE]], [s * 0.6, 0, 1])
    }
    block(trim, trim, rect(-0.15, YF - 0.2, 0.15, YF + 0.2), RIDGE, RIDGE + 1.9, 0)
    block(trim, trim, rect(-0.6, YF - 0.2, 0.6, YF + 0.2), RIDGE + 1.0, RIDGE + 1.3, 0)
    for (const s of [-1, 1]) turret(stone, trim, s * (NX + 0.4), YF - 0.4, 1.25, 0, 20.0, 23.6)
  }
  // the narthex: three arched doorways under a parapet
  {
    const r = rect(-AX - 0.6, YF, AX + 0.6, YF + 3.0)
    wallsSplit(stone, r, 0, 8.6, 5)
    band(trim, r, inset(r, -0.15), 8.6, 9.4, 0.1)
    cap(roof, inset(r, 0.2), 9.0)
    walls(trim, inset(r, 0.2).reverse(), 9.0, 9.4)
    const a: XY = [AX + 0.6, YF + 3.0], b: XY = [-AX - 0.6, YF + 3.0], m = AX + 0.6
    for (const [d, w, h] of [[0, 1.7, 3.6], [-6.3, 1.2, 3.0], [6.3, 1.2, 3.0]] as [number, number, number][]) {
      lancet(trim, a, b, m + d - w - 0.5, m + d + w + 0.5, 0.6, h, 0.06, 5)
      lancet(oak, a, b, m + d - w, m + d + w, 0.6, h, 0.12, 5)
    }
    for (const d of [-3.2, 3.2]) for (const k of [-0.6, 0.6]) lancet(win, a, b, m + d + k - 0.4, m + d + k + 0.4, 2.5, 5.6, 0.06, 3)
    for (const x of [-AX - 0.6, -3.6, 3.6, AX + 0.6]) pinnacle(stone, x, YF + 3.0, 0.5, 0, 9.6, 11.0)
    block(stone, stone, rect(-5.5, YF + 3.0, 5.5, YF + 5.5), 0, 0.8, 0)
  }

  // ------------------------------------------------------------ transepts and choir
  const TX0 = -18.0, TX1 = 18.8, TY = 7.0
  gabled(stone, cu, stone, [TX0, -TY, TX1, TY], EAVE, RIDGE, false)
  band(trim, rect(TX0, -TY, TX1, TY), inset(rect(TX0, -TY, TX1, TY), -0.25), EAVE - 0.6, EAVE, 0.2)
  for (const [x, s] of [[TX0, -1], [TX1, 1]] as [number, number][]) {
    const a: XY = s < 0 ? [x, TY] : [x, -TY], b: XY = s < 0 ? [x, -TY] : [x, TY]
    lancet(trim, a, b, TY - 3.2, TY + 3.2, 6.0, 12.2, 0.04, 6)
    lancet(win, a, b, TY - 2.7, TY + 2.7, 6.4, 12.2, 0.09, 6)
    for (const d of [-1.35, 0, 1.35]) panel(trim, a, b, TY + d - 0.1, TY + d + 0.1, 6.4, 12.2 + 2.7 * 0.866 - Math.abs(d) * 0.9, 0.12)
    for (const yy of [-TY - 0.3, TY + 0.3]) turret(stone, trim, x + s * 0.3, yy, 1.0, 0, 19.0, 23.2)
    for (const sg of [-1, 1]) poly(trim, [[x + s * 0.35, sg * TY, EAVE], [x + s * 0.35, 0, RIDGE + 0.2], [x - s * 0.3, 0, RIDGE + 0.2], [x - s * 0.3, sg * TY, EAVE]], [0, sg * 0.6, 1])
  }
  // transept side windows
  for (const [x0, x1] of [[TX0 + 1.5, -AX - 1.0], [AX + 1.0, TX1 - 1.5]]) {
    const L = x1 - x0
    for (const f of [0.3, 0.7]) {
      const xc = x0 + L * f
      lancet(win, [TX1, TY], [TX0, TY], TX1 - xc - 0.8, TX1 - xc + 0.8, 7.5, 12.0, 0.05)
    }
  }
  // the choir
  const YC = -24.0
  gabled(stone, cu, stone, [-NX, YC, NX, -TY], EAVE, RIDGE - 0.4, true, [true, false])
  band(trim, rect(-NX, YC, NX, -TY), inset(rect(-NX, YC, NX, -TY), -0.25), EAVE - 0.6, EAVE, 0.2)
  {
    const a: XY = [-NX, YC], b: XY = [NX, YC]
    lancet(trim, a, b, NX - 3.0, NX + 3.0, 7.0, 12.4, 0.04, 6)
    lancet(win, a, b, NX - 2.5, NX + 2.5, 7.4, 12.4, 0.09, 6)
    for (const s of [-1, 1]) turret(stone, trim, s * (NX + 0.3), YC - 0.3, 1.0, 0, 19.5, 23.6)
  }
  // south-east block (flat, to 15) and south-west block (to 10.5) beside the choir
  {
    const se = rect(NX, -17.5, TX1, -TY)
    wallsSplit(stone, se, 0, 14.4, 5)
    band(trim, se, inset(se, -0.2), 14.4, 15.0, 0.15)
    cap(roof, inset(se, -0.2), 15.0)
    for (const xc of [10.5, 14.5]) lancet(win, [NX, -17.5], [TX1, -17.5], xc - NX - 0.9, xc - NX + 0.9, 5.0, 10.5, 0.05)
    const sw = rect(TX0, -20.6, -NX, -TY)
    wallsSplit(stone, sw, 0, 9.8, 5)
    band(trim, sw, inset(sw, -0.2), 9.8, 10.5, 0.15)
    cap(roof, inset(sw, -0.2), 10.5)
    for (const [x, y] of [[TX0, -20.6], [TX0, -TY - 0.6], [-NX - 0.6, -20.6]] as XY[]) pinnacle(stone, x, y, 0.6, 0, 11.6, 13.6)
    for (const yc of [-17.0, -11.5]) lancet(win, [TX0, -TY], [TX0, -20.6], -TY - yc - 0.9, -TY - yc + 0.9, 3.0, 7.4, 0.05)
    lancet(win, [TX0, -20.6], [-NX, -20.6], 4.5, 6.3, 3.0, 7.4, 0.05)
    for (const x of [0.2, 4.0]) lancet(win, [-NX, YC], [NX, YC], NX + (x < 1 ? -5 : 5) - 0.6, NX + (x < 1 ? -5 : 5) + 0.6, 3.0, 6.5, 0.05)
  }

  // ------------------------------------------------------------ the tower
  const CX = -0.6, H = 5.8, TOP = 32.7
  const tr = rect(CX - H, -H, CX + H, H)
  wallsSplit(stone, tr, 14.0, TOP, 6)
  band(trim, tr, inset(tr, -0.2), 22.6, 23.2, 0.15)
  band(trim, tr, inset(tr, -0.35), TOP, TOP + 0.6, 0.2)
  const pr = inset(tr, -0.2)
  walls(stone, pr, TOP + 0.6, TOP + 2.2)
  walls(stone, inset(pr, 0.45).reverse(), TOP + 0.6, TOP + 2.2)
  for (let i = 0; i < 4; i++) {
    const a = pr[i], b = pr[(i + 1) % 4], c = inset(pr, 0.45)
    poly(trim, [[a[0], a[1], TOP + 2.2], [b[0], b[1], TOP + 2.2], [c[(i + 1) % 4][0], c[(i + 1) % 4][1], TOP + 2.2], [c[i][0], c[i][1], TOP + 2.2]], [0, 0, 1])
  }
  cap(roof, inset(tr, 0.2), TOP + 0.6)
  for (let i = 0; i < 4; i++) {
    const a = tr[i], b = tr[(i + 1) % 4]
    for (const d of [-2.6, 0, 2.6]) {
      lancet(trim, a, b, H + d - 0.95, H + d + 0.95, 23.6, 29.0, 0.04, 4)
      lancet(win, a, b, H + d - 0.7, H + d + 0.7, 24.0, 29.0, 0.08, 4)
    }
    // small pinnacles along the parapet
    const { P } = onWall(a, b)
    for (const s of [H - 2.9, H, H + 2.9]) {
      const q = P(s, 0, 0.0)
      pinnacle(trim, q[0], q[1], 0.28, TOP + 2.2, TOP + 3.4, TOP + 5.0)
    }
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) turret(stone, trim, CX + sx * (H - 0.3), sy * (H - 0.3), 1.15, 14.0, TOP + 3.8, 40.2)

  return [
    { part: stone, material: finish('cle-trinity-limestone', 0xd8cdb7) },
    { part: trim, material: finish('cle-trinity-dressings', 0xe9e0cd) },
    { part: cu, material: finish('cle-trinity-copper', 0x8aac9c) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: oak, material: finish('cle-trinity-oak', 0x86603f) },
  ]
}

if (import.meta.main) await save('cle-trinity-cathedral', 'Trinity Cathedral', [41.5013188, -81.6741543], 350, build(), 6500)
