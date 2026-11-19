/**
 * Buhl Building (535 Griswold Street, Detroit, 1925, Wirt C. Rowland of
 * Smith, Hinchman & Grylls) — original procedural geometry, CC0-1.0.
 * bun generators/det-buhl-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/110678746,
 * 42.3294212,-83.0469564. Its walls run at 329.5° / 59.5°, so the catalog
 * bearing is 329.5: -x faces Griswold Street, +y towards Congress Street.
 *
 * Identity, in order: the pale stone cruciform tower on a low podium that
 * fills the lot; three of its four arms end in steep pointed gables with
 * corner pinnacles; the Griswold arm is
 * flat-topped behind a parapet; the crossing rises a storey
 * above the arms; the top storeys carry tall round-headed windows, the shaft
 * paired punched windows.
 *
 * Evidence:
 *  - plan: OSM outline (podium, 58 × 36 m) and its part way/69000326 (the
 *    cross, 111.6 m). The outline's height=12 / levels=3 is the podium
 *    only; the lidar confirms both.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid, read
 *    in this frame (street ~1.8 m above the reference): podium 17 m; arm
 *    eaves 99.6 m; the north, south and east arms' roofs rise across their
 *    width to ridges at ~105.5 m (gabled ends); the west arm flat behind a
 *    parapet at ~101.5 m; the crossing flat at ~110 m.
 *  - published: 26 storeys + attic, ~111 m (Wikipedia; OSM part 111.6).
 *  - photos: gable shape and pinnacles, the two tall arched windows in each
 *    gable, the band of tall arched top windows (~4 storeys), window pitch
 *    (~2.2 m, paired), the podium's height.
 *  - colour: pale grey stone (#d9d6cc in Mikerussell's photos), pulled to
 *    the palette as `buhl-stone`; the arms' pitched roofs read dark grey
 *    where they show edge-on over the eaves (`buhl-roof`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - BuhlBuildingDetroitfromWoodward.jpg, Mikerussell, CC BY-SA 3.0
 *  - Buhl_Building.jpg, Mikerussell, CC BY-SA 3.0
 *  - BuhlBuilding1920.jpg, Detroit Publishing Company, public domain
 *    (from above, the gables and the podium; the date in the name is
 *    wrong, the building is of 1925)
 *  - Buhl_building_(8543641706).jpg, ellenm1, CC BY 2.0 (the base)
 *  - Detroit_Financial_District_by_night_from_Windsor,_Ontario,_2025-06-28.jpg,
 *    Crisco 1492, CC BY-SA 4.0 (night: lit windows only, no floodlighting)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south arm's end is hidden by neighbours in every photo; it is
 * given the north arm's gable, as the lidar ridge suggests. The east arm's
 * ridge in the lidar is lower (~3.5 m over its 18.7 m width) than the
 * others'; it is drawn at the same ridge height. The Griswold (west) end
 * is drawn without a gable: the lidar shows it flat.
 *
 * Left out: the Romanesque carving, the mosaic arch, mullions, antennas.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, panel, rect, rows, save, spire, walls, type XY } from './chi-aon-center'

/** A round-headed panel on wall a→b: jambs s0..s1 from z0 to the spring line zs, semicircular head. */
function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, zs), P(s0, zs))
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
  }
}

/** Windows on wall a→b, one per bay: shaft groups of two storeys, then a band of tall arched lights. */
function facade(p: Part, a: XY, b: XY, z0: number, zTop: number, o: { end?: number; pitch?: number } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), end = o.end ?? 1.2, pitch = o.pitch ?? 2.6, w = 1.3
  const k = Math.max(1, Math.floor((L - 2 * end) / pitch)), first = (L - (k - 1) * pitch) / 2
  const archBase = zTop - 13.5
  for (let q = 0; q < k; q++) {
    const s = first + q * pitch
    for (const [g0, g1] of rows(z0, archBase - 1.2, Math.round((archBase - 1.2 - z0) / 7.4), 2.0)) panel(p, a, b, s - w / 2, s + w / 2, g0, g1, 0.05)
    archPanel(p, a, b, s - w / 2, s + w / 2, archBase, zTop - 1.6 - w / 2, 0.05, 4)
  }
}

/** A pointed gable on the end wall a→b (counter-clockwise), from the eave z0 to the ridge z1, plus the roof running back `depth`. */
function gable(wall: Part, roof: Part, a: XY, b: XY, z0: number, z1: number, depth: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const A: V3 = [a[0], a[1], z0], B: V3 = [b[0], b[1], z0], M: V3 = [m[0], m[1], z1]
  wall.tri(A, B, M)
  // back along the arm (inward = -n)
  const back = (p: V3): V3 => [p[0] - n[0] * depth, p[1] - n[1] * depth, p[2]]
  roof.quad(B, back(B), back(M), M)
  roof.quad(back(A), A, M, back(M))
  // the back gable (inside the crossing, hidden, but closes the solid)
  wall.tri(back(B), back(A), back(M))
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const PODIUM = 17, EAVE = 99.6, RIDGE = 105.5, CROSS = 108.2, CTOP = 110.4
  // the cross (OSM part)
  const NS = { x0: -18.0, x1: 6.5, y0: -18.0, y1: 18.0 }
  const EW = { x0: -29.0, x1: 29.0, y0: -9.4, y1: 9.3 }

  // ---- podium filling the lot
  const lot = rect(-29, -18, 29, 18)
  walls(stone, lot, 0, PODIUM - 0.4)
  walls(stone, lot, PODIUM - 0.4, PODIUM, inset(lot, 0.35))
  cap(roof, inset(lot, 0.35), PODIUM)

  // ---- the cross: one ring, counter-clockwise
  const cross: XY[] = [
    [NS.x0, NS.y0], [NS.x1, NS.y0], [NS.x1, EW.y0], [EW.x1, EW.y0], [EW.x1, EW.y1], [NS.x1, EW.y1],
    [NS.x1, NS.y1], [NS.x0, NS.y1], [NS.x0, EW.y1], [EW.x0, EW.y1], [EW.x0, EW.y0], [NS.x0, EW.y0],
  ]
  walls(stone, cross, PODIUM, EAVE - 0.5)
  walls(stone, cross, EAVE - 0.5, EAVE, inset(cross, 0.35))
  cap(roof, inset(cross, 0.35), EAVE)

  // ---- gabled arm ends: north, south, east
  gable(stone, roof, [NS.x1, NS.y1], [NS.x0, NS.y1], EAVE, RIDGE, NS.y1 - EW.y1)
  gable(stone, roof, [NS.x0, NS.y0], [NS.x1, NS.y0], EAVE, RIDGE, EW.y0 - NS.y0)
  gable(stone, roof, [EW.x1, EW.y0], [EW.x1, EW.y1], EAVE, RIDGE, EW.x1 - NS.x1)
  // pinnacles at the gables' corners and apexes
  const pin = (x: number, y: number, z: number, h: number, r = 0.55) => {
    block(stone, null, rect(x - r, y - r, x + r, y + r), z - 1, z + h * 0.45, 0.1)
    spire(stone, rect(x - r, y - r, x + r, y + r), z + h * 0.45, [x, y, z + h])
  }
  for (const [x, y] of [[NS.x0 + 0.6, NS.y1 - 0.6], [NS.x1 - 0.6, NS.y1 - 0.6], [NS.x0 + 0.6, NS.y0 + 0.6], [NS.x1 - 0.6, NS.y0 + 0.6], [EW.x1 - 0.6, EW.y0 + 0.6], [EW.x1 - 0.6, EW.y1 - 0.6]] as XY[]) pin(x, y, EAVE, 4.2)
  pin((NS.x0 + NS.x1) / 2, NS.y1 - 0.6, RIDGE, 3.2, 0.7)
  pin((NS.x0 + NS.x1) / 2, NS.y0 + 0.6, RIDGE, 3.2, 0.7)
  pin(EW.x1 - 0.6, (EW.y0 + EW.y1) / 2, RIDGE, 3.2, 0.7)
  // the flat Griswold end keeps pinnacles at its corners
  pin(EW.x0 + 0.6, EW.y0 + 0.6, 101.5, 3.4)
  pin(EW.x0 + 0.6, EW.y1 - 0.6, 101.5, 3.4)

  // ---- the Griswold arm: flat, behind a parapet
  {
    const w = rect(EW.x0, EW.y0, NS.x0, EW.y1), wi = inset(w, 0.6)
    const q = (a: XY, b: XY) => stone.quad([a[0], a[1], EAVE], [b[0], b[1], EAVE], [b[0], b[1], 101.5], [a[0], a[1], 101.5])
    q(w[3], w[0]); q(w[0], w[1]); q(w[2], w[3]) // outside
    q(wi[1], wi[0]); q(wi[0], wi[3]); q(wi[3], wi[2]) // inside the parapet
    cap(stone, [w[0], w[1], wi[1], wi[0]], 101.5)
    cap(stone, [w[3], w[0], wi[0], wi[3]], 101.5)
    cap(stone, [w[2], w[3], wi[3], wi[2]], 101.5)
  }

  // ---- the crossing, a storey higher, with a low hipped top
  const cr = rect(NS.x0 + 0.5, EW.y0 + 0.5, NS.x1 - 0.5, EW.y1 - 0.5)
  walls(stone, cr, EAVE, CROSS - 0.4)
  walls(stone, cr, CROSS - 0.4, CROSS, inset(cr, 0.3))
  const ci = inset(cr, 0.3)
  spire(roof, ci, CROSS, [(NS.x0 + NS.x1) / 2, (EW.y0 + EW.y1) / 2, CTOP])
  for (let i = 0; i < 4; i++) {
    const a = cr[i], b = cr[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let k = 0; k < Math.floor(L / 3); k++) panel(win, a, b, 1.5 + k * 3 + 0.4, 1.5 + k * 3 + 1.4, EAVE + 1.5, CROSS - 1.5, 0.05)
  }

  // ---- windows on every face of the cross (wall a→b, outward to the right)
  for (let i = 0; i < cross.length; i++) {
    const a = cross[i], b = cross[(i + 1) % cross.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // faces wholly behind the podium's line still rise above it; all start at the podium roof
    if (L < 4) continue
    // one rhythm on every face: three-storey panels per bay, arched heads in the top storeys
    facade(win, a, b, PODIUM + 1.5, EAVE)
  }

  // ---- the podium's street faces (Griswold arched entrance on the west)
  const gw: [XY, XY] = [[-29, 18], [-29, -18]]
  archPanel(stone, gw[0], gw[1], 14.6, 21.4, 0, 8.6, 0.1, 10)
  archPanel(win, gw[0], gw[1], 15.4, 20.6, 4, 8.6, 0.16, 10)
  panel(door, gw[0], gw[1], 16, 20, 0, 4, 0.17)
  for (const [a, b] of [gw, [[-29, -18], [29, -18]], [[29, -18], [29, 18]], [[29, 18], [-29, 18]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 2.4; s < L - 2; s += 3.2) {
      if (a === gw[0] && s > 12.5 && s < 23.5) continue
      panel(win, a, b, s - 0.7, s + 0.7, 4.5, 8.5, 0.05)
      panel(win, a, b, s - 0.7, s + 0.7, 10, 15.4, 0.05)
    }
  }

  return [
    { part: stone, material: finish('buhl-stone', 0xe7e3d9) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('buhl-roof', 0x7f878e) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-buhl-building', 'Buhl Building', [42.3294212, -83.0469564], 329.5, build(), 5000)
