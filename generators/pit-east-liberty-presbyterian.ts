/**
 * East Liberty Presbyterian Church ("Cathedral of Hope"; Ralph Adams
 * Cram, 1932-1935), Penn and Highland Avenues, East Liberty, Pittsburgh —
 * original procedural geometry, CC0-1.0.
 * bun generators/pit-east-liberty-presbyterian.ts
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/34309874, -79.925489 40.460996. The church's walls run at
 * 21° / 111°, so the catalog bearing is 21: model +y (north-north-east) is
 * the entrance front with the great window and its two turrets, -y the
 * chancel, the crossing tower over the middle; the parish buildings round
 * the cloister court lie to the east (+x).
 *
 * Identity, in order: the massive square crossing tower, 91 m to the
 * cross, with clasping and mid-face buttresses, two tall paired lancet
 * openings on each face of the belfry stage and the tapering crown of
 * pinnacle tiers round an octagonal core and a spire with a green copper
 * finial; the entrance front with the great traceried window under a
 * pointed arch between two octagonal turrets and an arcaded parapet; the
 * long nave with buttresses and low parapeted roofs; the transept ends;
 * the lower Gothic parish ranges with steep slate roofs round the
 * cloister; pale grey-buff limestone. At night the tower is floodlit
 * ("ELPC Tower Illuminated.jpg", DrEAMoore, CC BY-SA 4.0): `floodlight`
 * on the tower's stone, strongest high up.
 *
 * Pinnacles: every pinnacle drawn is one the photos show (the tower's
 * corner, mid-face and crown tiers, the front turrets, the nave and
 * transept buttresses); none is added beyond them.
 *
 * Evidence:
 *  - plan: OSM way/34309874 (one outline round the church and the parish
 *    buildings; the cloister court x 1..10, y 2..22 and the south-east
 *    court are open in the lidar) turned into this frame; the parts from
 *    the lidar: nave x -24.5..-10.5, y 2..36; chancel to y -29; transepts
 *    x -38..1, y -13.7..2.3; tower 16 m square (18 m over the buttresses)
 *    centred (-17.5, -5.7).
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_1_2019 (flight 2019),
 *    1 m grid, above the lowest ground by the west transept (275 m
 *    NAVD88; the site rises 2 m to the front): nave and transept walls 27,
 *    ridges 29.5; aisles 12.7; tower top 59, crown pinnacles 65-71, solid
 *    crown to 79, highest return 88.8; parish ranges 13-15 at the eaves,
 *    ridges 17-20; south-west chapel 7-9.
 *  - published: 300 ft (91 m) to the top of the cross (Wikipedia, "East
 *    Liberty Presbyterian Church"); the model's finial ends at 89.5 and
 *    the thin cross is left out.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "East Liberty Presbyterian Church, Pittsburgh, 2015-03-11.jpg"
 *      https://commons.wikimedia.org/wiki/File:East_Liberty_Presbyterian_Church,_Pittsburgh,_2015-03-11.jpg
 *      Cbaile19, CC0 — the whole west side, front and tower.
 *    "East Liberty Presbyterian Church, 2025-05-20.jpg"
 *      https://commons.wikimedia.org/wiki/File:East_Liberty_Presbyterian_Church,_2025-05-20.jpg
 *      Cbaile19, CC0 — front turrets, great window, tower crown.
 *    "East Liberty Presbyterian Church, 2026-07-15-3.jpg"
 *      https://commons.wikimedia.org/wiki/File:East_Liberty_Presbyterian_Church,_2026-07-15-3.jpg
 *      Cbaile19, CC0 — the east side with the parish ranges and the front.
 *    "East Liberty Presbyterian Church, 2025-04-04.jpg"
 *      https://commons.wikimedia.org/wiki/File:East_Liberty_Presbyterian_Church,_2025-04-04.jpg
 *      Cbaile19, CC0 — the tower and crown from afar, low nave roofs.
 *    "Aerial view of East Liberty Presbyterian Church, Pittsburgh, Pa (61391).jpg"
 *      https://commons.wikimedia.org/wiki/File:Aerial_view_of_East_Liberty_Presbyterian_Church,_Pittsburgh,_Pa_(61391).jpg
 *      Mullen Brothers postcard, public domain — the plan from above.
 *  - colour: pale grey-buff limestone; grey slate and lead roofs pulled to
 *    the palette's lightness; green copper finial.
 * Estimated (from the photos scaled to the lidar heights): the belfry
 * openings (39.5-54), the crown's tiers, the great window (8 m wide,
 * apex 27), the portal, the turrets (to 38, spirelets to 45), windows of
 * the nave and the parish ranges, the parish ranges' roof shapes.
 *
 * Left out: crockets, statues, the arcading of the parapets (solid
 * bands), the flying parts of the buttresses, the cross, the separate
 * building north-west of the west transept (not in the outline).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, panel, rect, save, spire, walls, type XY } from './chi-aon-center'
import { poly } from './pit-allegheny-county-courthouse'
import { bar, faces, greatWindow, headH, pier, pointed } from './pit-heinz-chapel'

/** A square pinnacle: shaft w wide from z0 to z1, then a pyramid to `tip`. */
function pinnacle(p: Part, cx: number, cy: number, w: number, z0: number, z1: number, tip: number) {
  const r = rect(cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2)
  walls(p, r, z0, z1)
  spire(p, r, z1, [cx, cy, tip])
}

/** An octagon ring of apothem a about (cx, cy), corners counter-clockwise, flat faces to the axes. */
const oct = (cx: number, cy: number, a: number): XY[] => {
  const R = a / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, i) => [cx + R * Math.cos(((i + 0.5) * Math.PI) / 4 - Math.PI / 2 + Math.PI / 8 - Math.PI / 8), cy + R * Math.sin(((i + 0.5) * Math.PI) / 4 - Math.PI / 2)] as XY)
}

/** A gabled range over rectangle [x0,y0,x1,y1]: walls to `eave`, ridge along the longer side at `ridge`, stone gable ends. */
function range(wall: Part, roof: Part, r: [number, number, number, number], eave: number, ridge: number, over = 0.4) {
  const [x0, y0, x1, y1] = r
  walls(wall, rect(x0, y0, x1, y1), 0, eave)
  const alongX = x1 - x0 >= y1 - y0
  if (alongX) {
    const cy = (y0 + y1) / 2
    poly(roof, [[x0 - over, y0 - over, eave - 0.3], [x1 + over, y0 - over, eave - 0.3], [x1 + over, cy, ridge], [x0 - over, cy, ridge]], [0, -1, 1])
    poly(roof, [[x0 - over, y1 + over, eave - 0.3], [x1 + over, y1 + over, eave - 0.3], [x1 + over, cy, ridge], [x0 - over, cy, ridge]], [0, 1, 1])
    for (const x of [x0, x1]) poly(wall, [[x, y0, eave], [x, y1, eave], [x, cy, ridge - 0.1]], [x === x0 ? -1 : 1, 0, 0])
  } else {
    const cx = (x0 + x1) / 2
    poly(roof, [[x0 - over, y0 - over, eave - 0.3], [x0 - over, y1 + over, eave - 0.3], [cx, y1 + over, ridge], [cx, y0 - over, ridge]], [-1, 0, 1])
    poly(roof, [[x1 + over, y0 - over, eave - 0.3], [x1 + over, y1 + over, eave - 0.3], [cx, y1 + over, ridge], [cx, y0 - over, ridge]], [1, 0, 1])
    for (const y of [y0, y1]) poly(wall, [[x0, y, eave], [x1, y, eave], [cx, y, ridge - 0.1]], [0, y === y0 ? -1 : 1, 0])
  }
}

/** Grouped window panels along wall a→b: `n` evenly spaced, w wide, over the given storey bands. */
function windows(win: Part, a: XY, b: XY, n: number, w: number, bands: [number, number][], end = 1.5) {
  const { L } = onWall(a, b)
  if (L < 2 * end + w) return
  const pitch = (L - 2 * end) / n
  for (let i = 0; i < n; i++) for (const [z0, z1] of bands) panel(win, a, b, end + pitch * (i + 0.5) - w / 2, end + pitch * (i + 0.5) + w / 2, z0, z1, 0.05)
}

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), cu = new Part(), door = new Part()

  const NX0 = -25, NX1 = -11, NC = -18 // nave walls and axis
  const TY0 = -13, TY1 = 2, TC = (TY0 + TY1) / 2 // crossing
  const FRONT = 36, END = -29 // entrance front, chancel end
  const EAVE = 27, RIDGE = 29.5, AISLE = 12.7, GRADE = 2.2 // ground at the front doors

  // ---- nave and chancel: walls, low parapeted roof
  const body = rect(NX0, END, NX1, FRONT)
  walls(stone, body, 0, EAVE + 1.2)
  {
    const inn = rect(NX0 + 0.6, END + 0.6, NX1 - 0.6, FRONT - 0.6)
    walls(stone, [...inn].reverse(), EAVE, EAVE + 1.2)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; stone.quad([body[i][0], body[i][1], EAVE + 1.2], [body[j][0], body[j][1], EAVE + 1.2], [inn[j][0], inn[j][1], EAVE + 1.2], [inn[i][0], inn[i][1], EAVE + 1.2]) }
    poly(slate, [[NX0 + 0.6, END + 0.6, EAVE], [NX0 + 0.6, FRONT - 0.6, EAVE], [NC, FRONT - 0.6, RIDGE], [NC, END + 0.6, RIDGE]], [-1, 0, 3])
    poly(slate, [[NX1 - 0.6, END + 0.6, EAVE], [NX1 - 0.6, FRONT - 0.6, EAVE], [NC, FRONT - 0.6, RIDGE], [NC, END + 0.6, RIDGE]], [1, 0, 3])
  }
  // aisles: lean-to roofs against the nave on both sides
  for (const [xa, xb, sg] of [[NX0 - 3, NX0, -1], [NX1, NX1 + 3, 1]] as [number, number, number][]) {
    for (const [ya, yb] of [[TY1, FRONT - 3], [END + 2, TY0]]) {
      walls(stone, rect(xa, ya, xb, yb), 0, AISLE)
      const xo = sg < 0 ? xa : xb, xi = sg < 0 ? xb : xa
      poly(slate, [[xo - sg * -0.3, ya, AISLE], [xo - sg * -0.3, yb, AISLE], [xi, yb, AISLE + 2.2], [xi, ya, AISLE + 2.2]], [sg, 0, 2])
      const fa: XY = sg < 0 ? [xa, yb] : [xb, ya], fb: XY = sg < 0 ? [xa, ya] : [xb, yb]
      const { L } = onWall(fa, fb), nb = Math.max(1, Math.round(L / 5.5))
      for (let i = 0; i < nb; i++) {
        const s = (L / nb) * (i + 0.5)
        pointed(win, fa, fb, s - 0.8, s + 0.8, 3.4, 9.0, 0.05)
        if (i > 0) pier(stone, fa, fb, (L / nb) * i, 0.9, 0, AISLE + 0.6, 0.8, 1.6)
      }
    }
  }
  // clerestory lancets and buttresses with their pinnacles along the nave and chancel
  for (const [fa, fb] of [faces(NX0, END, NX1, FRONT)[1], faces(NX0, END, NX1, FRONT)[3]] as [XY, XY][]) {
    const east = fa[0] > NC
    const at = (y: number) => (east ? y - END : FRONT - y)
    for (const [ya, yb] of [[TY1, FRONT], [END, TY0]]) {
      const n = Math.round((yb - ya) / 5.6), pitch = (yb - ya) / n
      for (let i = 0; i < n; i++) {
        const yc = ya + pitch * (i + 0.5)
        greatWindow(win, trim, fa, fb, at(yc) - 1.3, at(yc) + 1.3, AISLE + 3.0, 23.6 - headH(2.6) + 1.8, 2, [], 0.18)
        if (i > 0) pier(stone, fa, fb, at(ya + pitch * i), 1.0, AISLE, EAVE + 1.2, 0.9, 0)
        if (i > 0) { const { P } = onWall(fa, fb); const q = P(at(ya + pitch * i), 0, 0.45); pinnacle(stone, q[0], q[1], 0.8, EAVE + 1.2, EAVE + 2.6, EAVE + 5.0) }
      }
    }
  }

  // ---- transepts with their end windows and corner turrets
  {
    const TX0 = -38, TX1 = 1
    for (const [xa, xb] of [[TX0, NX0], [NX1, TX1]]) {
      const r = rect(xa, TY0, xb, TY1)
      walls(stone, r, 0, EAVE + 1.2)
      cap(slate, rect(xa + 0.6, TY0 + 0.6, xb - 0.6, TY1 - 0.6), EAVE + 0.4)
      for (const k of [0, 2]) {
        const [fa, fb] = faces(xa, TY0, xb, TY1)[k], { L } = onWall(fa, fb)
        greatWindow(win, trim, fa, fb, L / 2 - 1.3, L / 2 + 1.3, AISLE + 3.0, 23.6 - headH(2.6) + 1.8, 2, [], 0.18)
      }
    }
    // the parapets round the transept roofs
    for (const [xa, xb] of [[TX0, NX0], [NX1, TX1]]) {
      const o = rect(xa, TY0, xb, TY1), inn = rect(xa + 0.6, TY0 + 0.6, xb - 0.6, TY1 - 0.6)
      walls(stone, [...inn].reverse(), EAVE + 0.4, EAVE + 1.2)
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; stone.quad([o[i][0], o[i][1], EAVE + 1.2], [o[j][0], o[j][1], EAVE + 1.2], [inn[j][0], inn[j][1], EAVE + 1.2], [inn[i][0], inn[i][1], EAVE + 1.2]) }
    }
    // west transept end: great window, turrets at its corners
    const [fa, fb] = faces(TX0, TY0, NX0, TY1)[3], { L } = onWall(fa, fb)
    greatWindow(win, trim, fa, fb, L / 2 - 3.3, L / 2 + 3.3, 8.0, 20.0, 4, [14.0], 0.2)
    pointed(trim, fa, fb, L / 2 - 3.9, L / 2 + 3.9, 7.4, 20.0, 0.03)
    for (const y of [TY0, TY1]) pinnacle(stone, TX0 + 0.6, y, 2.0, 0, EAVE + 5, EAVE + 10)
    const [ea, eb] = faces(NX1, TY0, TX1, TY1)[1], e = onWall(ea, eb)
    greatWindow(win, trim, ea, eb, e.L / 2 - 2.8, e.L / 2 + 2.8, 15.0, 22.0, 3, [], 0.2)
    for (const y of [TY0, TY1]) pinnacle(stone, TX1 - 0.6, y, 2.0, 0, EAVE + 5, EAVE + 10)
  }

  // ---- the entrance front: great window, portal, arcaded parapet, turrets
  {
    const fa: XY = [NX1, FRONT], fb: XY = [NX0, FRONT], { L } = onWall(fa, fb), c = L / 2
    walls(stone, rect(NX0, FRONT - 0.6, NX1, FRONT), EAVE + 1.2, 32.5)
    cap(stone, rect(NX0, FRONT - 0.6, NX1, FRONT), 32.5)
    panel(trim, fa, fb, 1.4, L - 1.4, 29.2, 31.8, 0.06) // the arcaded parapet band
    pointed(trim, fa, fb, c - 4.6, c + 4.6, 8.6, 20.6, 0.03)
    greatWindow(win, trim, fa, fb, c - 4.0, c + 4.0, 9.2, 20.6, 4, [15.0], 0.2)
    pointed(trim, fa, fb, c - 2.6, c + 2.6, GRADE, GRADE + 5.2, 0.06)
    pointed(door, fa, fb, c - 1.9, c + 1.9, GRADE, GRADE + 5.0, 0.12)
    bar(trim, fa, fb, [c, GRADE], [c, GRADE + 4.4], 0.3, 0.16)
    // the octagonal turrets at the front corners, with open spirelets
    for (const x of [NX0, NX1]) {
      const o = oct(x, FRONT - 0.2, 1.9)
      walls(stone, o, 0, 38)
      walls(stone, oct(x, FRONT - 0.2, 1.55), 38, 41)
      cap(stone, oct(x, FRONT - 0.2, 2.05), 38)
      spire(stone, oct(x, FRONT - 0.2, 1.55), 41, [x, FRONT - 0.2, 46])
      for (let k = 0; k < 8; k += 2) {
        const a = o[k], b = o[(k + 1) % 8], { L: l } = onWall(a, b)
        pointed(win, a, b, l / 2 - 0.35, l / 2 + 0.35, 31.5, 35.5, 0.04)
      }
    }
    // the aisle fronts
    for (const [xa, xb] of [[NX0 - 3, NX0], [NX1, NX1 + 3]]) {
      walls(stone, rect(xa, FRONT - 3, xb, FRONT - 0.01), 0, AISLE + 1)
      cap(stone, rect(xa, FRONT - 3, xb, FRONT - 0.01), AISLE + 1)
      const { L: l } = onWall([xb, FRONT - 0.01], [xa, FRONT - 0.01])
      pointed(win, [xb, FRONT - 0.01], [xa, FRONT - 0.01], l / 2 - 0.7, l / 2 + 0.7, GRADE + 2, GRADE + 7, 0.05)
    }
  }
  // the chancel end
  {
    const [fa, fb] = faces(NX0, END, NX1, FRONT)[0], { L } = onWall(fa, fb)
    greatWindow(win, trim, fa, fb, L / 2 - 3.2, L / 2 + 3.2, 14.0, 22.0, 3, [], 0.2)
    for (const s of [0.6, L - 0.6]) pier(stone, fa, fb, s, 1.6, 0, EAVE + 3, 1.0, 3)
  }

  // ---- the crossing tower
  const TOP = 59, H = 6.5 // half-width of the tower body
  const tw = rect(NC - H, TC - H, NC + H, TC + H)
  walls(stone, tw, EAVE - 2, TOP - 3)
  walls(trim, tw, TOP - 3, TOP)
  for (const [fa, fb] of faces(NC - H, TC - H, NC + H, TC + H) as [XY, XY][]) {
    const { L } = onWall(fa, fb)
    // the arcaded band over the roofs, then the two great belfry openings
    panel(trim, fa, fb, 1.6, L - 1.6, 33.0, 35.0, 0.05)
    for (const s of [2.4, 3.8, L - 3.8, L - 2.4]) pointed(win, fa, fb, s - 0.35, s + 0.35, 36.2, 38.6, 0.05)
    for (const s of [L / 2 - 3.05, L / 2 + 3.05]) {
      const w = 2.9
      pointed(trim, fa, fb, s - w / 2 - 0.35, s + w / 2 + 0.35, 39.2, 54.2 - headH(w + 0.7), 0.03)
      pointed(slate, fa, fb, s - w / 2, s + w / 2, 39.5, 54 - headH(w), 0.06)
      bar(trim, fa, fb, [s, 39.5], [s, 54 - headH(w) + 0.8], 0.28, 0.1)
      for (const z of [44.0, 48.6]) bar(trim, fa, fb, [s - w / 2 + 0.05, z], [s + w / 2 - 0.05, z], 0.3, 0.1)
    }
    // the mid-face buttress, up to a pinnacle
    pier(stone, fa, fb, L / 2, 1.2, EAVE + 1, TOP, 0.8, 0)
    const { P } = onWall(fa, fb), q = P(L / 2, 0, 0.3)
    pinnacle(stone, q[0], q[1], 1.3, TOP, TOP + 3.0, TOP + 8.0)
  }
  // clasping corner buttresses, stepping up to the big corner pinnacles
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = NC + sx * (H + 0.05), cy = TC + sy * (H + 0.05)
    walls(stone, rect(cx - 1.45, cy - 1.45, cx + 1.45, cy + 1.45), EAVE - 2, 44)
    walls(stone, rect(cx - 1.2, cy - 1.2, cx + 1.2, cy + 1.2), 44, TOP + 1)
    cap(stone, rect(cx - 1.45, cy - 1.45, cx + 1.45, cy + 1.45), 44)
    pinnacle(stone, cx, cy, 2.2, TOP + 1, TOP + 5, TOP + 12)
  }
  // the crown: platform, octagonal core with its galleries, pinnacle tiers, spire, finial
  cap(slate, rect(NC - H, TC - H, NC + H, TC + H), TOP)
  const core = oct(NC, TC, 4.6), core2 = oct(NC, TC, 3.4), core3 = oct(NC, TC, 2.7)
  walls(stone, core, TOP, 66.5)
  walls(trim, core, 66.5, 67.5)
  for (let k = 0; k < 8; k++) {
    const a = core[k], b = core[(k + 1) % 8], { L } = onWall(a, b)
    pointed(slate, a, b, L / 2 - 0.7, L / 2 + 0.7, 61.0, 65.0, 0.05)
  }
  cap(slate, core, 67.5)
  walls(stone, core2, 67.5, 74.5)
  for (let k = 0; k < 8; k++) {
    const a = core2[k], b = core2[(k + 1) % 8], { L } = onWall(a, b)
    pointed(slate, a, b, L / 2 - 0.45, L / 2 + 0.45, 69.5, 73.0, 0.05)
    pinnacle(stone, core[k][0], core[k][1], 1.0, 67.5, 70.0, 75.0)
    pinnacle(stone, core2[k][0], core2[k][1], 0.75, 74.5, 76.0, 79.5)
  }
  cap(slate, core2, 74.5)
  spire(stone, core3, 74.5, [NC, TC, 86.0])
  {
    const fin = oct(NC, TC, 0.5)
    walls(cu, fin, 85.0, 86.6)
    spire(cu, oct(NC, TC, 0.75), 86.6, [NC, TC, 89.5])
    cap(cu, oct(NC, TC, 0.75), 86.6, false)
  }

  // ---- the parish ranges round the cloister court, and the chapels
  const wb = (r: [number, number, number, number], eave: number, ridge: number, bands: [number, number][], n?: number) => {
    range(stone, door, r, eave, ridge)
    const [x0, y0, x1, y1] = r
    for (const [fa, fb] of faces(x0, y0, x1, y1) as [XY, XY][]) {
      const { L } = onWall(fa, fb)
      windows(win, fa, fb, n ?? Math.max(1, Math.round(L / 3.6)), 1.5, bands)
    }
  }
  // low range east of the nave, flat-roofed behind a parapet
  walls(stone, rect(NX1 + 3, TY1, 1, FRONT - 3), 0, 13.6)
  cap(slate, rect(NX1 + 3, TY1, 1, FRONT - 3), 13.4)
  windows(win, [1, TY1], [1, FRONT - 3], 6, 1.4, [[3.5, 6.5], [8.0, 11.5]])
  wb([1, 22, 27, 36], 13.8, 18.8, [[3.0, 6.0], [7.5, 11.5]])
  wb([10, -19, 34, 22], 15.0, 19.8, [[3.0, 6.0], [7.5, 12.5]])
  wb([19, -33, 34, -19], 15.0, 19.5, [[3.0, 6.0], [7.5, 12.5]])
  {
    // the parish house's square tower
    const r = rect(21.5, -26, 28.5, -19)
    walls(stone, r, 15.0, 22.0)
    cap(stone, r, 22.0)
    for (const [fa, fb] of faces(21.5, -26, 28.5, -19) as [XY, XY][]) {
      const { L } = onWall(fa, fb)
      pointed(win, fa, fb, L / 2 - 0.7, L / 2 + 0.7, 17.0, 20.2, 0.05)
    }
  }
  wb([-9, -34, 6, -13.7], 13.4, 17.4, [[3.0, 6.0], [7.5, 11.5]])
  wb([-33, -25, -27.5, -13.7], 13.0, 16.0, [[3.0, 6.0], [7.5, 11.5]])
  {
    // the low south-west chapel with its rounded end
    const ch: XY[] = [[-44, -33.5], [-33.5, -33.5], [-33.5, -19], [-44, -19]]
    walls(stone, ch, 0, 7.0)
    const apse: XY[] = Array.from({ length: 5 }, (_, k) => {
      const t = Math.PI + (k * Math.PI) / 4
      return [-38.75 + 5.25 * Math.cos(t), -33.5 + 5.25 * Math.sin(t)] as XY
    })
    walls(stone, apse.slice().concat([[-38.75, -33.5]]).slice(0, 5) as XY[], 0, 7.0)
    range(stone, door, [-44, -33.5, -33.5, -19], 7.0, 9.2, 0.3)
    for (let k = 0; k < 4; k++) {
      const a = apse[k], b = apse[k + 1]
      poly(door, [[a[0], a[1], 7.0], [b[0], b[1], 7.0], [-38.75, -33.5, 9.2]], [(a[0] + b[0]) / 2 + 38.75, (a[1] + b[1]) / 2 + 33.5, 2])
      const { L } = onWall(a, b)
      pointed(win, a, b, L / 2 - 0.5, L / 2 + 0.5, 2.0, 5.3, 0.05)
    }
    const [fa, fb] = faces(-44, -33.5, -33.5, -19)[3]
    windows(win, fa, fb, 3, 1.1, [[2.0, 5.3]])
  }

  // night: the tower is floodlit up to the crown; the walls faintly
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.abs(p[0] - NC) < 10 && Math.abs(p[1] - TC) < 10 && p[2] > 30 ? Math.min(1, 0.5 + (p[2] - 30) / 50) : 0.2)
  return [
    { part: stone, material: { ...finish('limestone', 0xddd5c4), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: slate, material: finish('slate', 0x80858b) },
    { part: win, material: PALETTE.window },
    { part: cu, material: PALETTE.patina },
    { part: door, material: finish('tile', 0x8f776a) },
  ]
}

if (import.meta.main) await save('pit-east-liberty-presbyterian', 'East Liberty Presbyterian Church', [40.460996, -79.925489], 21, build() as any, 6500)
