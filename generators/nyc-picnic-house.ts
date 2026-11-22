/**
 * Picnic House, Prospect Park, Brooklyn (J. Sarsfield Kennedy, 1927) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-picnic-house.ts
 *
 * Frame: x across the house (toward 114.9°), y along it (toward 24.9°), z
 * up, metres. Placed at bearing 24.9°. Anchor: the area centroid of OSM
 * way/241846602 (-73.971572, 40.665560), which the model replaces.
 *
 * Evidence
 * - OSM way/241846602 (ODbL): 20.9 × 25.5 m, with central projections of
 *   0.7 m on the long (±x) faces (y −4.3…3.9) and 0.5 m on the north face
 *   (x −4.3…4.2); height=13.7.
 * - Published (NYC Parks, Prospect Park Alliance): 1927 brick and limestone
 *   events pavilion facing the Long Meadow, red tile roof.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Jim.henderson, "Prospect Pk Picnic House south jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Pk_Picnic_House_south_jeh.jpg
 *     (south front: pedimented pavilion, arched loggia with columns,
 *     balustraded terrace and stairs, entrance under the terrace);
 *   Epicgenius, "Prospect Park Brooklyn Mar 2019 97.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_97.jpg
 *     (the same front square on, twin stairs);
 *   Austurstrond, "Picnic House Summer.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Picnic_House_Summer.jpg
 *     (from the south-west: west face window groups, tall chimney, roof).
 *
 * Estimated from the photos (people ~1.7 m; OSM 13.7 m to the ridge): lower
 * storey to 4.2 m with a limestone belt course to 4.6 m, main storey to
 * 9.6 m with window groups 5.2–8.6 m, limestone band and eaves at 10.0 m,
 * low hipped roof of dark red tile to 11.4 m (lead review: the photos show
 * a low pitch, ridge partly hidden from the ground); pavilion pediments to
 * 11.7 m; OSM's 13.7 m is taken as the chimney zone, not the ridge; terrace
 * 2.7 m deep at the main floor with a 1 m balustrade, stairs 1.8 m wide
 * down to the outer corners; chimney to 17.5 m.
 *
 * Doubts: the north face is drawn with a pediment like the south (OSM shows
 * its projection) but without the terrace and stairs no photo shows; the
 * east face mirrors the west. The terrace and stairs stand outside the OSM
 * outline. The loggia's grilles are drawn as dark openings.
 */
import { Part } from './mesh'
import { finishModel, prism, chamferRect, type XY } from './nyc-570-lexington'
import { box, quadF, triN, wallFrame } from './nyc-prospect-park-boathouse'
import { archWin, rectWin, edgeFrame, hipRoof, parapet, piercings, column, wallBox } from './nyc-litchfield-villa'
import { PALETTE, finish } from './palette'

function build() {
  const brick = new Part(), trim = new Part(), tile = new Part(), win = new Part()
  const X0 = -10.45, X1 = 10.41, Y0 = -12.85, Y1 = 12.65
  const BELT = 4.2, FLOOR = 4.6, EAVE = 10.0, RIDGE = 11.4

  // Main block, with the shallow central projections on the long faces.
  prism({ wall: brick, win: null, roof: null, ring: chamferRect(X0, Y0, X1, Y1, 0), z0: 0, z1: EAVE, facade: null, bevel: 0.25 })
  for (const [x0, x1] of [[X0 - 0.7, X0 + 0.1], [X1 - 0.1, X1 + 0.75]]) box(brick, x0, -4.3, x1, 3.9, 0, EAVE - 0.05)
  // Limestone base, belt course and the band under the eaves.
  for (const [z0, z1, o] of [[0, 0.6, 0.06], [BELT, FLOOR, 0.1], [EAVE - 0.7, EAVE - 0.25, 0.08]] as [number, number, number][]) {
    prism({ wall: trim, win: null, roof: null, ring: chamferRect(X0 - o, Y0 - o, X1 + o, Y1 + o, 0), z0, z1, facade: null, bevel: 0.2 })
    for (const [x0, x1] of [[X0 - 0.7 - o, X0], [X1, X1 + 0.75 + o]]) box(trim, x0, -4.3 - o, x1, 3.9 + o, z0, z1)
  }
  // Hipped red tile roof with deep eaves.
  hipRoof(tile, null, trim, X0, Y0, X1, Y1, EAVE, RIDGE - EAVE, 0.85, ['hip', 'hip'], 'y')

  // Window groups: long faces (west and east) and the short faces' wings.
  for (const [a, b] of [[[X0, Y1], [X0, Y0]], [[X1, Y0], [X1, Y1]]] as [XY, XY][]) {
    const w = edgeFrame(a, b)
    for (const s of [3.8, 12.75, 21.7]) {
      const d = Math.abs(s - 12.75) < 1 ? 0.75 : 0.05
      rectWin(win, w, s, FLOOR + 0.6, 8.6, 1.9, d)
      for (const k of [-1, 1]) rectWin(trim, w, s + k * 0.63, FLOOR + 0.6, 8.6, 0.07, d + 0.02)
      rectWin(win, w, s, 1.0, 3.6, 1.6, d)
    }
  }
  for (const [a, b] of [[[X0, Y0], [X1, Y0]], [[X1, Y1], [X0, Y1]]] as [XY, XY][]) {
    const w = edgeFrame(a, b)
    for (const s of [3.4, w.L - 3.4]) {
      rectWin(win, w, s, FLOOR + 0.6, 8.6, 1.8)
      for (const k of [-1, 1]) rectWin(trim, w, s + k * 0.6, FLOOR + 0.6, 8.6, 0.07, 0.07)
      if (b[1] > a[1] - 1 && a[1] > 0) rectWin(win, w, s, 1.2, 3.3, 0.6)
    }
  }

  // Pedimented pavilions on the short faces: a red tile gable, a brick
  // tympanum framed in limestone, and the arched loggia between columns.
  for (const sg of [-1, 1]) {
    const yf = sg < 0 ? Y0 - 0.5 : Y1 + 0.5, PX = 4.3
    box(brick, -PX, sg < 0 ? yf : Y1 - 0.1, PX, sg < 0 ? Y0 + 0.1 : yf, 0, EAVE)
    box(trim, -PX - 0.1, sg < 0 ? yf - 0.1 : Y1 - 0.1, PX + 0.1, sg < 0 ? Y0 + 0.1 : yf + 0.1, EAVE - 0.7, EAVE)
    const yIn = sg < 0 ? -4.0 : 4.0
    hipRoof(tile, brick, trim, -PX, Math.min(yf, yIn), PX, Math.max(yf, yIn), EAVE, 1.7, 0.45, sg < 0 ? ['gable', 'hip'] : ['hip', 'gable'], 'y')
    // raking cornice on the pediment
    const yr = yf + sg * 0.47, g = wallFrame([sg < 0 ? -PX - 0.45 : PX + 0.45, yr], [sg < 0 ? 1 : -1, 0])
    const half = PX + 0.45
    quadF(trim, g.at(0, EAVE - 0.3, 0.02), g.at(half, EAVE + 1.7 - 0.3, 0.02), g.at(half, EAVE + 1.7, 0.02), g.at(0, EAVE, 0.02), g.n)
    quadF(trim, g.at(half, EAVE + 1.7 - 0.3, 0.02), g.at(2 * half, EAVE - 0.3, 0.02), g.at(2 * half, EAVE, 0.02), g.at(half, EAVE + 1.7, 0.02), g.n)
    quadF(trim, g.at(0, EAVE - 0.3, 0.02), g.at(2 * half, EAVE - 0.3, 0.02), g.at(2 * half, EAVE, 0.02), g.at(0, EAVE, 0.02), g.n)
    // the loggia: a big round arch on columns, flanked by square openings
    const f = edgeFrame(sg < 0 ? [-PX, yf] : [PX, yf], sg < 0 ? [PX, yf] : [-PX, yf])
    const c = f.L / 2
    archWin(trim, f, c, FLOOR, 9.25, 1.75, 0.06)
    archWin(win, f, c, FLOOR, 9.0, 1.45, 0.1)
    for (const k of [-1, 1]) {
      rectWin(win, f, c + k * 2.85, FLOOR, 7.7, 0.75, 0.06)
      const p = f.at(c + k * 1.55, 0, 0.45)
      column(trim, p[0], p[1], 0.2, FLOOR, 7.75, 8, 0.15)
      wallBox(trim, f, c + k * 2.85 - 1.0, c + k * 2.85 + 1.0, 7.7, 8.0, 0.25)
    }
    if (sg > 0) {
      rectWin(win, f, c, 1.0, 3.4, 1.4)
      continue
    }
    // South: the terrace at the main floor with its balustrade and the
    // entrance below, and the twin stairs down to the corners.
    const TY = yf - 2.7, TX = 3.7
    box(brick, -TX, TY, TX, yf + 0.05, 0, FLOOR)
    box(trim, -TX - 0.1, TY - 0.1, TX + 0.1, yf + 0.05, FLOOR - 0.35, FLOOR)
    const bal: XY[] = [[-TX, TY], [TX, TY], [TX, yf], [-TX, yf]]
    parapet(trim, bal, FLOOR, FLOOR + 1.0, 0.25)
    piercings(win, bal, FLOOR + 0.2, FLOOR + 0.8, 0.7, 0.55, 0.5)
    const tf = edgeFrame([-TX, TY], [TX, TY])
    rectWin(trim, tf, TX, 0, 2.9, 1.45, 0.04)
    rectWin(win, tf, TX, 0, 2.6, 1.15, 0.07)
    for (const k of [-1, 1]) {
      // stair: a stone flight rising from the corner (x ±9.6) to the terrace (x ±3)
      const xa = k * 9.6, xb = k * TX, ya = yf - 1.9, yb = Y0
      const n = 8
      for (let i = 0; i < n; i++) {
        const xs = xa + ((xb - xa) * i) / n, xe = xa + ((xb - xa) * (i + 1)) / n
        box(trim, Math.min(xs, xe) - (k < 0 ? 0 : 0), ya, Math.max(xs, xe), yb, 0, (FLOOR * (i + 1)) / n)
      }
      // its outer balustrade: a sloping band
      const s = wallFrame([xa, ya], [k * -1, 0])
      const L = Math.abs(xb - xa)
      for (const d of [0, 0.25]) {
        const nn: [number, number, number] = d === 0 ? [0, -1, 0] : [0, 1, 0]
        const y = ya + d
        quadF(trim, [xa, y, 0.6], [xb, y, FLOOR], [xb, y, FLOOR + 1.0], [xa, y, 1.6], nn)
      }
      quadF(trim, [xa, ya, 1.6], [xb, ya, FLOOR + 1.0], [xb, ya + 0.25, FLOOR + 1.0], [xa, ya + 0.25, 1.6], [0, 0, 1])
      box(trim, Math.min(xa, xa + k * 0.6), ya - 0.1, Math.max(xa, xa + k * 0.6), ya + 0.5, 0, 1.75)
      void s; void L; void triN
    }
  }

  // Tall brick chimney near the north end of the west side.
  box(brick, -7.6, 8.4, -6.2, 9.8, 9.0, 17.5)
  box(trim, -7.75, 8.25, -6.05, 9.95, 17.2, 17.5)

  finishModel('Picnic House', 'nyc-picnic-house', [
    { part: brick, material: finish('picnic-brick', 0xa9634f) },
    { part: trim, material: PALETTE.trim },
    { part: tile, material: finish('red-tile', 0x85574d) },
    { part: win, material: PALETTE.window },
  ], { bearing: 24.9, osm: 'way/241846602', height: 17.5 })
}

if (import.meta.main) build()
