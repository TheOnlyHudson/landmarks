/**
 * Cathedral of St. John the Evangelist (1007 Superior Avenue East; 1852,
 * rebuilt and enlarged 1946-48 by Franz Warner), Cleveland, with the
 * diocesan Cathedral Square block that shares its OSM outline: procedural,
 * CC0-1.0.
 * bun generators/cle-st-john-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 327.2: the
 * nave runs along +x (true 57.2°, east-north-east down Superior Avenue),
 * the west front on East 9th Street faces -x, Superior is on the -y side.
 * Origin at the centroid of OSM way/294598602 (-81.687982, 41.503010).
 * z = 0 is the lowest ground under the outline, at its east end; the
 * ground under the west front is 1.5 m higher (lidar and Mapterhorn agree),
 * so the church's features stand on z = 1.5 (G below).
 *
 * Identity, in order: the tall square sandstone tower on Superior with
 * stepped corner buttresses, paired louvred belfry lancets, a pinnacled
 * parapet and the steep green copper spire; the steep dark slate nave roof;
 * the west front's gable between two pinnacled turrets, its great pointed
 * arch over a triple lancet window, and the three-arched porch with its
 * parapet; the small chapel on Superior with its green pyramid roof;
 * buttressed nave walls with tall lancets.
 *
 * Evidence:
 *  - plan: OSM way/294598602 (one outline, no parts, no heights): the nave
 *    20 m wide and 66 m long to the sanctuary, the tower 9.5 m square
 *    against its south wall 35-44 m from the front, the sanctuary and
 *    sacristies, then the Cathedral Square block east of it, 44 x 23 m.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    1 m grid, above the ground at the front: nave eaves ~14.6, ridge 23.4;
 *    front gable 26, its turrets 24.5; tower parapet 38, corner pinnacles
 *    41.3, spire 56.4 (the cross's tip escapes a 1 m grid; it is drawn to
 *    58). Sanctuary block 20.8; transept ridges ~18.5; the chapel's
 *    pyramid ~14.8. Cathedral Square: ~19 m walls, a central block to 25 m.
 *  - the porch (lidar ~8 m, 2 m deep), the turrets' and tower's details,
 *    window rhythm: from Jfvoll's square-on west front, Nheyob's and
 *    Warren LeMay's views along Superior.
 *  - colour: buff-to-tan sandstone, mottled (all photos), lighter dressed
 *    stone at the arches; grey slate; green copper spire and chapel roof.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Saint_John_the_Evangelist_Cathedral_(Cleveland,_Ohio)_-_exterior.jpg, Nheyob, CC BY-SA 4.0 (SW, along Superior)
 *  - Cathedral_of_St._John_the_Evangelist_-_Cleveland,_OH_Exterior.jpg, Jfvoll, CC BY-SA 4.0 (west front)
 *  - The_Cathedral_of_St._John_the_Evangelist,_Cleveland,_OH_(28812510167).jpg, Warren LeMay, CC0 (SW)
 *  - The_Cathedral_of_St._John_the_Evangelist,_Cleveland,_OH_(28812497667).jpg, Warren LeMay, CC0 (tower)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north side and the east end are hemmed in by neighbours and
 * not in any photo used; the sacristies and Cathedral Square are plain
 * massing from the lidar. The chapel stands just outside the OSM outline
 * (OSM doesn't map it); it is drawn because it is part of the church.
 * Statues, tracery cusps, the rose of the Cathedral Square gable and
 * lettering are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, panel, relief, onWall, lathe, save } from './chi-field-museum'

/** A profile in the (y, z) plane, counter-clockwise, extruded from x0 to x1; `side(i)` picks the part for edge i. */
function extrudeX(prof: [number, number][], x0: number, x1: number, side: (i: number) => Part, ends: Part | null) {
  const n = prof.length
  for (let i = 0; i < n; i++) {
    const [ya, za] = prof[i], [yb, zb] = prof[(i + 1) % n]
    side(i).quad([x0, ya, za], [x0, yb, zb], [x1, yb, zb], [x1, ya, za])
  }
  if (!ends) return
  for (let i = 1; i < n - 1; i++) {
    ends.tri([x1, prof[0][0], prof[0][1]], [x1, prof[i][0], prof[i][1]], [x1, prof[i + 1][0], prof[i + 1][1]])
    ends.tri([x0, prof[0][0], prof[0][1]], [x0, prof[i + 1][0], prof[i + 1][1]], [x0, prof[i][0], prof[i][1]])
  }
}
/** The same along y, profile in the (x, z) plane counter-clockwise as seen from -y. */
function extrudeY(prof: [number, number][], y0: number, y1: number, side: (i: number) => Part, ends: Part | null) {
  const n = prof.length
  for (let i = 0; i < n; i++) {
    const [xa, za] = prof[i], [xb, zb] = prof[(i + 1) % n]
    side(i).quad([xa, y1, za], [xb, y1, zb], [xb, y0, zb], [xa, y0, za])
  }
  if (!ends) return
  for (let i = 1; i < n - 1; i++) {
    ends.tri([prof[0][0], y0, prof[0][1]], [prof[i][0], y0, prof[i][1]], [prof[i + 1][0], y0, prof[i + 1][1]])
    ends.tri([prof[0][0], y1, prof[0][1]], [prof[i + 1][0], y1, prof[i + 1][1]], [prof[i][0], y1, prof[i][1]])
  }
}
/** A pointed (equilateral) lancet on wall a→b: jambs s0..s1 from z0 to the springing zs. */
function lancet(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 4) {
  const { P } = onWall(a, b)
  const w = s1 - s0
  const pts: V3[] = [P(s0, z0, out), P(s1, z0, out)]
  for (let k = 0; k <= seg; k++) { const t = (k / seg) * (Math.PI / 3); pts.push(P(s0 + w * Math.cos(t), zs + w * Math.sin(t), out)) }
  for (let k = 1; k <= seg; k++) { const t = (2 * Math.PI) / 3 + (k / seg) * (Math.PI / 3); pts.push(P(s1 + w * Math.cos(t), zs + w * Math.sin(t), out)) }
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
/** A square pyramid (pinnacle) on centre (x, y), half-size h, from z0 to z1. */
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number) {
  const r: V3[] = [[x - h, y - h, z0], [x + h, y - h, z0], [x + h, y + h, z0], [x - h, y + h, z0]]
  for (let i = 0; i < 4; i++) p.tri(r[i], r[(i + 1) % 4], [x, y, z1])
}

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), copper = new Part(), win = new Part(), door = new Part()
  const G = 1.5 // ground at the west front, above z = 0
  const XF = -66, XE = 0, C = 0.3, HW = 9.9 // nave: front, east end, axis, half-width
  const EAVE = G + 14.6, RIDGE = G + 23.4
  const yS = C - HW, yN = C + HW

  // Nave: walls and a steep slate roof, with a stone gable at the east end.
  extrudeX([[yS, 0], [yN, 0], [yN, EAVE], [C, RIDGE], [yS, EAVE]], XF + 1.5, XE, (i) => (i === 2 || i === 3 ? slate : stone), stone)
  // Buttresses and lancets along both sides.
  const south: [XY, XY] = [[XF, yS], [XE, yS]], north: [XY, XY] = [[XE, yN], [XF, yN]]
  for (let k = 0; k <= 8; k++) {
    const x = XF + 3 + k * 7.6
    const free = (side: 'n' | 's') => side === 's' ? !(x > -33.5 && x < -12.5) : true
    if (free('s')) relief(stone, south[0], south[1], x - XF - 0.55, x - XF + 0.55, 0, EAVE - 2.5, 0.9)
    relief(stone, north[0], north[1], XE - x - 0.55, XE - x + 0.55, 0, EAVE - 2.5, 0.9)
    if (k < 8) {
      const xc = x + 3.8
      if (!(xc > -34 && xc < -12)) lancet(win, south[0], south[1], xc - XF - 1.1, xc - XF + 1.1, G + 4.5, G + 10.2)
      lancet(win, north[0], north[1], XE - xc - 1.1, XE - xc + 1.1, xc > -26 ? G + 8.5 : G + 4.5, G + 10.2)
    }
  }

  // West front: the gable wall, standing a little proud of the roof.
  const FT = 1.5, GAB = G + 26.0
  extrudeX([[yS - 0.4, 0], [yN + 0.4, 0], [yN + 0.4, EAVE + 0.6], [C, GAB], [yS - 0.4, EAVE + 0.6]], XF, XF + FT, (i) => (i === 2 || i === 3 ? trim : stone), stone)
  const front: [XY, XY] = [[XF, yN + 0.4], [XF, yS - 0.4]], fs = (y: number) => yN + 0.4 - y
  // The great pointed arch, its triple lancet, and the carved panel over it.
  lancet(trim, front[0], front[1], fs(C + 5.0), fs(C - 5.0), G + 8.8, G + 13.5, 0.04, 6)
  lancet(stone, front[0], front[1], fs(C + 4.2), fs(C - 4.2), G + 8.8, G + 13.5, 0.07, 6)
  for (const dy of [-2.3, 0, 2.3]) lancet(win, front[0], front[1], fs(C + dy + 0.95), fs(C + dy - 0.95), G + 9.6, dy === 0 ? G + 15.0 : G + 14.6, 0.1)
  // Turrets: square buttresses flanking the gable, with pinnacles.
  for (const ty of [C - 6.4, C + 6.4]) {
    block(stone, stone, rect(XF - 1.2, ty - 1.2, XF + 1.4, ty + 1.2), 0, G + 19.0, 0.15)
    block(trim, trim, rect(XF - 1.0, ty - 1.0, XF + 1.2, ty + 1.0), G + 19.0, G + 20.5, 0.1)
    pinnacle(trim, XF + 0.1, ty, 1.0, G + 20.5, G + 25.0)
  }
  // Corner buttresses of the front.
  for (const ty of [yS - 0.4, yN + 0.4]) block(stone, stone, rect(XF - 0.8, ty - 0.9, XF + 1.0, ty + 0.9), 0, EAVE - 1.5, 0.15)
  // Cross on the gable.
  block(trim, trim, rect(XF + 0.4, C - 0.2, XF + 0.9, C + 0.2), GAB - 0.3, GAB + 2.0, 0.05)
  block(trim, trim, rect(XF + 0.4, C - 0.75, XF + 0.9, C + 0.75), GAB + 1.0, GAB + 1.45, 0.05)
  // The porch: three pointed arches with oak doors under a parapet, and the steps.
  {
    const x0 = XF - 2.4
    block(stone, trim, rect(x0, C - 5.6, XF, C + 5.6), 0, G + 8.8, 0.15)
    const pf: [XY, XY] = [[x0, C + 5.6], [x0, C - 5.6]]
    for (const dy of [-3.5, 0, 3.5]) {
      lancet(trim, pf[0], pf[1], 5.6 - dy - 1.5, 5.6 - dy + 1.5, G + 0.4, G + 4.6, 0.04)
      lancet(door, pf[0], pf[1], 5.6 - dy - 1.1, 5.6 - dy + 1.1, G + 0.4, G + 4.4, 0.08)
    }
    block(stone, stone, rect(x0 - 2.4, C - 6.5, x0, C + 6.5), 0, G + 0.2, 0.05)
    block(stone, stone, rect(x0 - 1.2, C - 6.2, x0, C + 6.2), G + 0.2, G + 0.4, 0.05)
  }

  // The tower on Superior.
  const TX = -26.6, TY = -12.7, TH = 4.75, TOP = G + 38.0
  block(stone, null, rect(TX - TH, TY - TH, TX + TH, TY + TH), 0, TOP, 0.2)
  cap(slate, rect(TX - TH + 0.2, TY - TH + 0.2, TX + TH - 0.2, TY + TH - 0.2), TOP)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = TX + sx * (TH - 0.2), cy = TY + sy * (TH - 0.2)
    block(stone, stone, rect(cx - 1.0, cy - 1.0, cx + 1.0, cy + 1.0), 0, G + 18, 0.15)
    block(stone, stone, rect(cx - 0.8, cy - 0.8, cx + 0.8, cy + 0.8), G + 18, TOP + 1.3, 0.15)
    pinnacle(trim, cx, cy, 0.8, TOP + 1.3, G + 41.3 + 1.0)
  }
  // Parapet band and the paired louvred belfry lancets on each face.
  const tr = rect(TX - TH, TY - TH, TX + TH, TY + TH)
  walls(trim, inset(tr, -0.15), TOP - 1.2, TOP)
  for (let i = 0; i < 4; i++) {
    const a = tr[i], b = tr[(i + 1) % 4], L = 2 * TH
    for (const d of [-1.25, 1.25]) lancet(win, a, b, L / 2 + d - 0.9, L / 2 + d + 0.9, G + 25.5, G + 33.0, 0.05)
    lancet(win, a, b, L / 2 - 0.6, L / 2 + 0.6, G + 15.0, G + 17.5, 0.05)
  }
  // Spire: octagonal, green copper, from inside the parapet to the cross.
  lathe(copper, TX, TY, [[2.9, TOP - 0.3], [2.75, TOP + 1.0], [0.2, G + 55.6], [0.0, G + 56.4]], 8, Math.PI / 8)
  block(trim, trim, rect(TX - 0.12, TY - 0.12, TX + 0.12, TY + 0.12), G + 56.0, G + 58.0, 0.03)
  block(trim, trim, rect(TX - 0.12, TY - 0.6, TX + 0.12, TY + 0.6), G + 57.0, G + 57.3, 0.03)

  // South transept between the tower and the sanctuary: gabled to Superior.
  extrudeY([[-21.8, 0], [-14.2, 0], [-14.2, G + 14.5], [-18.0, G + 18.6], [-21.8, G + 14.5]], -16.8, -8.5, (i) => (i === 2 || i === 3 ? slate : stone), stone)
  lancet(win, [-21.8, -16.8], [-14.2, -16.8], 2.6, 5.0, G + 5.0, G + 11.5)
  // Low sacristy between the transept and the sanctuary.
  block(stone, slate, rect(-14.2, -11.2, -2.7, -8.5), 0, G + 7.0, 0.2)

  // The chapel on Superior, west of the tower, with its green pyramid.
  block(stone, null, rect(-56.5, -17.0, -47.5, yS + 0.2), 0, G + 7.0, 0.2)
  lathe(copper, -52, (-17.0 + yS) / 2, [[6.3, G + 6.8], [0.0, G + 14.8]], 4, Math.PI / 4)
  lancet(win, [-56.5, -17.0], [-47.5, -17.0], 3.6, 5.4, G + 2.0, G + 4.8)

  // Sanctuary and the north sacristies.
  block(stone, slate, rect(XE, -14.2, 15.3, 1.2), 0, G + 20.8, 0.3)
  block(stone, slate, rect(-25.4, yN, 15.3, 20.2), 0, G + 6.5, 0.3)
  // North transept, the south one's twin (lidar ridge ~18.5).
  extrudeY([[-25.4, 0], [-17.0, 0], [-17.0, G + 14.5], [-21.2, G + 18.6], [-25.4, G + 14.5]], yN - 0.5, 20.2, (i) => (i === 2 || i === 3 ? slate : stone), stone)
  for (const x of [3.5, 11.5]) lancet(win, [XE, -14.2], [15.3, -14.2], x - 1.1, x + 1.1, G + 6.0, G + 13.5)

  // Cathedral Square: walls to ~19 m with a slate hip, a link to the
  // sanctuary, the central block to 25 m.
  const E0 = 0.3 // its ground
  block(stone, slate, rect(15.3, -8.5, 27.3, 1.2), 0, E0 + 12.0, 0.3)
  const cs: XY[] = [[27.2, -17.8], [56.6, -18.0], [68.1, -17.9], [67.9, 5.3], [24.1, 5.1], [24.1, 1.3], [27.3, 1.3]]
  walls(stone, cs, 0, E0 + 18.4)
  walls(trim, cs, E0 + 18.4, E0 + 19.0, inset(cs, 0.4))
  cap(slate, inset(cs, 0.4), E0 + 19.0)
  block(stone, null, rect(40, -16.5, 54, -1.0), E0 + 19.0, E0 + 23.0, 0.2)
  extrudeX([[-16.5, E0 + 23.0], [-1.0, E0 + 23.0], [-8.75, E0 + 25.6]], 40, 54, () => slate, stone)
  for (const [a, b] of [[[27.2, -17.8], [68.1, -17.9]], [[67.9, 5.3], [24.1, 5.1]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 2.5; s + 2.0 < L - 1.5; s += 4.4) {
      panel(win, a, b, s, s + 2.0, E0 + 3.0, E0 + 9.0, 0.05)
      panel(win, a, b, s, s + 2.0, E0 + 10.5, E0 + 16.5, 0.05)
    }
  }

  return [
    { part: stone, material: finish('cle-cathedral-sandstone', 0xd6b994) },
    { part: trim, material: finish('cle-cathedral-dressings', 0xece0c8) },
    { part: slate, material: finish('cle-cathedral-slate', 0x80878f) },
    { part: copper, material: finish('cle-cathedral-copper', 0x7fac95) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('cle-cathedral-oak', 0x8d6b48) },
  ]
}

if (import.meta.main) await save('cle-st-john-cathedral', 'Cathedral of St. John the Evangelist', [41.50301, -81.687982], 327.2, build())
