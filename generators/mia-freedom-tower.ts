/**
 * Freedom Tower, Miami (600 Biscayne Boulevard; 1925, Schultze & Weaver,
 * built for the Miami News, modelled on the Giralda in Seville) — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-freedom-tower.ts
 *
 * Also exports a few small helpers (arched panels, gables, pinnacles,
 * parapets) that the other mia- models by the same builder import
 * (mia-dade-county-courthouse, mia-bacardi-buildings); the Freedom Tower
 * model is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/290629021,
 * 25.7802910, -80.1897125. Its walls run at 358.7° / 88.7°, so the catalog
 * bearing is 358.7 and the model is square to its own frame.
 *
 * Identity, in order: the ochre shaft framed by pale corner piers, rising
 * from the east (Biscayne) front; the corbelled cornice with round domed
 * bartizans at its four corners; the cream belfry stage ringed with
 * pinnacles; the narrower two-storey upper lantern; the green dome, its
 * small dark cupola and the weathervane. Below: the three-storey ochre
 * front block with its balustrade, pinnacle clusters at the corners and the
 * baroque frontispiece over the door, and behind it the plain rear wings
 * with two tiled gable roofs.
 *
 * Night: the shaft and the east front are floodlit white (`floodlight` on
 * the ochre and cream east of x = 13); the crown (belfry, upper lantern,
 * drum) is lit in colour on most nights (red, blue, sometimes white), drawn
 * as `neon-ft-crown` in its cream day colour so it glows; the dome stays
 * unlit.
 *
 * Evidence:
 *  - plan: OSM outline way/290629021 and parts way/1105391703 (3-storey
 *    lot, 20 m), /1105391704 (4-storey gabled range, 25 m), /1105391705
 *    (tower, 48 m), /1105391706 (58 m), /1105391707 (dome, 75 m),
 *    way/1548934816 (78 m), /1548934817 (onion, 83 m), /1548989032
 *    (5-storey gabled range). USGS NAIP for the roofs: two tiled gables over
 *    the east-west middle range, flat pale roofs elsewhere.
 *  - heights: USGS lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 0.5 m grid, measured above the street (ground_min + 0.9 m):
 *    rear wings' edges 14.0, front block balustrade 14.4, frontispiece crest
 *    16.2, middle range 17.8–19.2 (west, low gable), east gable eaves 21.4
 *    and ridge 23.4, shaft cornice 46.1 with corner bartizans to ~50,
 *    belfry 55.5 (12 m square over its cornice; walls ~10.6 m, from Radomianin's photo), upper lantern ~67 (7 m), dome to ~73, top
 *    return 80.4 (the vane). OSM tags agree within a metre or two.
 *    Published: 17 storeys, 255 ft (78 m) (Wikipedia; NRHP 79000665, NHL).
 *  - footprint: lidar puts the east front ~1.5 m east of OSM's line; the
 *    model follows OSM, with the front and the tower's east face at
 *    x = 27.3 (0.5 m past OSM), the tower 13.6 m square on lidar.
 *  - stage proportions (belfry 8 m, lantern ~9 m, dome ~3.4 m high),
 *    window columns (three per face), the corner piers (~2.2 m), the
 *    front block's storeys and bays, the frontispiece: from the photos
 *    below, scaled by the tower width.
 *  - colour: ochre walls and pale pink-cream piers and ornament from DXR's
 *    and Pessar's daylight photos; the dome's green copper from DXR's and
 *    Radomianin's photos (it reads dark grey in Pessar's 2022 shot, which
 *    may be light); tile roofs terracotta from NAIP.
 *
 * Photos (Wikimedia Commons):
 *  - Freedom_Tower,_Miami,_Southeast_view_20160709_1.jpg (DXR, CC BY-SA 4.0)
 *  - Freedom_Tower_Miami_(top),_NE_view.jpg (Radomianin, public domain)
 *  - Freedom_Tower,_Miami_FL_December_2022.jpg (Phillip Pessar, CC BY 2.0),
 *    the south side with the rear wings and gables
 *  - Miami_Florida_2018-01-16_-_Freedom_Tower.jpg (Infrogmation of New
 *    Orleans, CC BY 2.0), from Biscayne to the north-east
 *  - Miami's_Freedom_Tower._Miami,_Florida._USA_(50658895291).jpg (Rob
 *    Olivera, CC BY 2.0), night, crown lit red
 *  - Freedom_Tower_(Miami,_Fl.).jpg (Federico Pirruccio, CC BY-SA 3.0), night
 *  - Miami_freedom_tower_night.jpg (LonnyPaul, CC BY 3.0), night, lit blue
 * No look-only sources. No commercial imagery.
 *
 * Left out: the coats of arms, the scrollwork, the balusters (drawn as solid
 * parapets), the small turrets of the lantern, mullions, the ship on the
 * vane (a plain plate). The rear wings are peach-tan in reality and drawn
 * in the same ochre (six materials).
 *
 * Doubts: no licensed photo of the west face or of the north side's rear
 * wing; both are drawn plain like the south. The lantern's exact height
 * split between its two storeys is estimated from the photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { disc, rectBays } from './chi-board-of-trade'

// ---------------------------------------------------------------------------
// Helpers shared by this builder's mia- models.

/** A window panel with a semicircular head on the wall a→b: jambs s0..s1, sill z0, springing zs. */
export function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zs, out), P(s0, zs, out))
  const C = P(c, zs, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(C, P(c + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(c + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** A gabled roof over x0..x1, y0..y1 (ridge along x, or along y with `alongY`), eaves ze, ridge zr; gable ends in `wall`. */
export function gable(wall: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, oh = 0.35, alongY = false) {
  if (!alongY) {
    const ym = (y0 + y1) / 2
    roof.quad([x0 - oh, y0 - oh, ze - 0.2], [x1 + oh, y0 - oh, ze - 0.2], [x1 + oh, ym, zr], [x0 - oh, ym, zr])
    roof.quad([x1 + oh, y1 + oh, ze - 0.2], [x0 - oh, y1 + oh, ze - 0.2], [x0 - oh, ym, zr], [x1 + oh, ym, zr])
    wall.tri([x0, y1, ze], [x0, y0, ze], [x0, ym, zr])
    wall.tri([x1, y0, ze], [x1, y1, ze], [x1, ym, zr])
  } else {
    const xm = (x0 + x1) / 2
    roof.quad([x1 + oh, y0 - oh, ze - 0.2], [x1 + oh, y1 + oh, ze - 0.2], [xm, y1 + oh, zr], [xm, y0 - oh, zr])
    roof.quad([x0 - oh, y1 + oh, ze - 0.2], [x0 - oh, y0 - oh, ze - 0.2], [xm, y0 - oh, zr], [xm, y1 + oh, zr])
    wall.tri([x0, y0, ze], [x1, y0, ze], [xm, y0, zr])
    wall.tri([x1, y1, ze], [x0, y1, ze], [xm, y1, zr])
  }
}

/** A cone pinnacle on a short square-ish base: base radius r at z0, tip at z0 + h. */
export function pinnacle(p: Part, x: number, y: number, z0: number, h: number, r = 0.45, seg = 8) {
  lathe(p, x, y, [[r, z0], [r, z0 + h * 0.22], [r * 0.72, z0 + h * 0.3], [0, z0 + h]], seg, Math.PI / seg)
}

/** A solid parapet of thickness t along ring r (counter-clockwise), z0..z1, with its top. */
export function parapet(p: Part, r: XY[], z0: number, z1: number, t = 0.3) {
  const i = inset(r, t)
  walls(p, r, z0, z1)
  walls(p, [...i].reverse(), z0, z1)
  ring(p, r, i, z1)
}

/** The flat strip between ring o and the inset ring i at height z, facing up. */
export function ring(p: Part, o: XY[], i: XY[], z: number) {
  for (let k = 0; k < o.length; k++) {
    const l = (k + 1) % o.length
    p.quad([i[k][0], i[k][1], z], [o[k][0], o[k][1], z], [o[l][0], o[l][1], z], [i[l][0], i[l][1], z])
  }
}

/** A cornice: the wall flares from ring r out by `d` over z0..z1, then stands to z2, with a top over the lip. */
export function cornice(p: Part, r: XY[], z0: number, z1: number, z2: number, d: number) {
  const o = inset(r, -d)
  walls(p, r, z0, z1, o)
  walls(p, o, z1, z2)
  ring(p, o, r, z2)
}

/** Shift a ring. */
export const at = (r: XY[], dx: number, dy: number): XY[] => r.map(([x, y]) => [x + dx, y + dy] as XY)

// ---------------------------------------------------------------------------
// Freedom Tower

function build() {
  const ochre = new Part(), cream = new Part(), win = new Part(), tile = new Part(), crown = new Part(), dome = new Part()

  // --- Rear wings (x -26.9 .. 13.6): three storeys, plain, flat roofs.
  const REAR: XY[] = [[-26.9, -17.5], [-17.2, -17.5], [-17.2, -18.3], [-3.1, -18.3], [-3.1, -17.3], [13.6, -17.3], [13.6, 17.3], [-26.9, 17.3]]
  walls(ochre, REAR, 0, 13.4)
  cornice(cream, REAR, 13.4, 13.7, 14.0, 0.25)
  cap(cream, REAR, 14.0)
  rectBays(win, REAR, [[2.0, 5.2], [6.6, 9.4], [10.4, 12.5]], { bay: 2.4, gap: 2.4, end: 1.6, skip: [5] })

  // Middle range, west: a low tiled gable over a flat-topped storey.
  walls(ochre, rect(-26.9, -7, -4, 9), 14, 17.8)
  gable(ochre, tile, -26.9, -7, -4, 9, 17.8, 19.3, 0.3)
  rectBays(win, rect(-26.9, -7, -4, 9), [[15.0, 17.0]], { bay: 1.6, gap: 3.0, end: 2, skip: [1, 3] })
  // North-west block, one storey higher than the wings.
  block(ochre, cream, rect(-26.9, 9, -14, 17.3), 14, 18.2, 0.3)
  rectBays(win, rect(-26.9, 9, -14, 17.3), [[15.0, 17.2]], { bay: 1.6, gap: 2.6, end: 1.6, skip: [0] })
  // Middle range, east: two more storeys under the high tiled gable.
  walls(ochre, rect(-4, -6.5, 13.6, 7), 14, 21.4)
  gable(ochre, tile, -4, -6.5, 13.6, 7, 21.4, 23.4, 0.35)
  rectBays(win, rect(-4, -6.5, 13.6, 7), [[15.2, 17.6], [18.6, 20.6]], { bay: 1.6, gap: 2.4, end: 1.6, skip: [1, 3] })

  // --- Front block on Biscayne (x 13.6 .. 27.3): three storeys, plinth,
  // corner quoins, cornice and balustrade.
  const FB = rect(13.6, -17.3, 27.3, 18.5)
  walls(cream, inset(FB, -0.12), 0, 1.0)
  ring(cream, inset(FB, -0.12), FB, 1.0)
  walls(ochre, FB, 1.0, 12.6)
  cornice(cream, FB, 12.6, 13.0, 13.3, 0.4)
  cap(cream, FB, 13.3)
  parapet(cream, inset(FB, -0.1), 13.3, 14.4, 0.35)
  for (let i = 0; i < 4; i++) {
    const a = FB[i], b = FB[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(cream, a, b, 0, 1.1, 1.0, 12.6, 0.05)
    panel(cream, a, b, L - 1.1, L, 1.0, 12.6, 0.05)
    // A string course over the main storey.
    panel(cream, a, b, 0, L, 7.3, 7.8, 0.06)
  }
  // Windows: three bays each side of the frontispiece on the east front,
  // three on the short north and south faces.
  const eA: XY = [27.3, -17.3], eB: XY = [27.3, 18.5]
  const fbWindows = (a: XY, b: XY, cs: number[]) => {
    for (const c of cs) {
      panel(win, a, b, c - 0.5, c + 0.5, 1.4, 2.5, 0.07)
      panel(win, a, b, c - 0.85, c + 0.85, 3.4, 6.6, 0.07)
      panel(cream, a, b, c - 1.15, c + 1.15, 6.6, 7.3, 0.06)
      panel(win, a, b, c - 0.75, c + 0.75, 8.7, 10.9, 0.07)
    }
  }
  fbWindows(eA, eB, [3.6, 7.6, 11.6, 24.2, 28.2, 32.2])
  fbWindows([27.3, 18.5], [13.6, 18.5], [3.6, 6.85, 10.1])
  fbWindows([13.6, -17.3], [27.3, -17.3], [3.6, 6.85, 10.1])
  // Pinnacle clusters at the corners of the balustrade.
  for (const [cx, cy, sx, sy] of [[27.3, -17.3, -1, 1], [27.3, 18.5, -1, -1], [13.6, 18.5, 1, -1], [13.6, -17.3, 1, 1]] as number[][]) {
    const x = cx + sx * 0.35, y = cy + sy * 0.35
    pinnacle(cream, x, y, 14.4, 2.6, 0.5)
    pinnacle(cream, x + sx * 1.3, y, 14.4, 1.8, 0.35)
    pinnacle(cream, x, y + sy * 1.3, 14.4, 1.8, 0.35)
  }

  // The frontispiece: a pale baroque bay over the door, rising in a curved
  // crest above the balustrade.
  const FX0 = 27.3, FX1 = 27.95, FW = 4
  block(cream, cream, rect(FX0, -FW, FX1, FW), 0, 14.4, 0.1)
  {
    const crest = (y: number) => 14.4 + 2.2 * Math.cos((Math.PI * y) / (2 * FW))
    const n = 10, pts: [number, number][] = []
    for (let k = 0; k <= n; k++) { const y = FW - (2 * FW * k) / n; pts.push([y, crest(y)]) }
    const C: V3 = [FX1, 0, 14.4]
    for (let k = 0; k < n; k++) {
      const [y0, z0] = pts[k], [y1, z1] = pts[k + 1]
      cream.tri(C, [FX1, y0, z0], [FX1, y1, z1])
      cream.quad([FX1, y0, z0], [FX0, y0, z0], [FX0, y1, z1], [FX1, y1, z1])
    }
    pinnacle(cream, (FX0 + FX1) / 2, 0, 16.5, 1.4, 0.3, 6)
    const a: XY = [FX1, -FW], b: XY = [FX1, FW]
    archPanel(win, a, b, FW - 1.15, FW + 1.15, 0.3, 3.6) // the door
    archPanel(win, a, b, FW - 0.7, FW + 0.7, 8.4, 11.4) // the arched window over it
    disc(win, a, b, FW - 2.3, 9.9, 0.55, 0.07, 10)
    disc(win, a, b, FW + 2.3, 9.9, 0.55, 0.07, 10)
  }

  // --- The tower.
  const TX = 20.45, TY = 0, H = 6.8
  const SH = at(rect(-H, -H, H, H), TX, TY)
  const TOP = 44.6
  walls(cream, SH, 14.0, TOP)
  for (let i = 0; i < 4; i++) {
    const a = SH[i], b = SH[(i + 1) % 4]
    // Ochre infill between the corner piers, three columns of punched
    // windows, grouped two storeys to a pair: a narrow ochre band inside the
    // pair, a deep ochre spandrel between pairs, so the wall reads as wall.
    panel(ochre, a, b, 2.2, 2 * H - 2.2, 14.4, TOP - 0.6, 0.03)
    for (const c of [3.73, 6.8, 9.87]) for (let k = 0; k < 5; k++) {
      const z0 = 15.6 + 5.95 * k
      panel(win, a, b, c - 0.6, c + 0.6, z0, z0 + 1.75, 0.07)
      if (z0 + 4.45 < TOP - 1.0) panel(win, a, b, c - 0.6, c + 0.6, z0 + 2.7, z0 + 4.45, 0.07)
    }
  }
  // Corbelled cornice, deck and balustrade.
  cornice(cream, SH, TOP, 45.6, 46.3, 0.6)
  cap(cream, inset(SH, -0.6), 46.3)
  parapet(cream, inset(SH, -0.5), 46.3, 47.4, 0.3)
  // Round domed bartizans on the four corners.
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    lathe(cream, TX + sx * H, TY + sy * H, [[0, 42.6], [0.6, 43.4], [1.25, 44.6], [1.25, 48.4], [1.45, 48.6], [1.45, 48.9], [1.0, 49.5], [0.12, 51.0]], 12)
  }

  // Belfry stage: 10.6 m square with cut corners and a deep cornice, central round-arched
  // opening and two small arches a face, cornice, balustrade, pinnacles.
  const BH = 5.3
  const BEL = chamfer(at(rect(-BH, -BH, BH, BH), TX, TY), 1.0)
  walls(crown, BEL, 46.3, 54.6)
  cornice(crown, BEL, 54.2, 55.0, 55.4, 0.75)
  cap(crown, inset(BEL, -0.75), 55.4)
  parapet(crown, inset(BEL, -0.65), 55.4, 56.4, 0.3)
  const bq = at(rect(-BH, -BH, BH, BH), TX, TY)
  for (let i = 0; i < 4; i++) {
    const a = bq[i], b = bq[(i + 1) % 4], m = BH
    archPanel(win, a, b, m - 1.2, m + 1.2, 48.0, 51.4)
    archPanel(win, a, b, m - 3.1, m - 2.2, 49.0, 50.9)
    archPanel(win, a, b, m + 2.2, m + 3.1, 49.0, 50.9)
  }
  // Pinnacles: one over each cut corner, two more on each face.
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    pinnacle(crown, TX + sx * 5.25, TY + sy * 5.25, 56.4, 3.8, 0.5)
    pinnacle(crown, TX + sx * 5.6, TY + sy * 2.2, 56.4, 3.0, 0.42)
    pinnacle(crown, TX + sx * 2.2, TY + sy * 5.6, 56.4, 3.0, 0.42)
    // The small domed turrets on the belfry's cut corners.
    lathe(crown, TX + sx * 4.7, TY + sy * 4.7, [[0.85, 46.3], [0.85, 52.8], [0.95, 53.0], [0.6, 53.7], [0.08, 54.5]], 10)
  }

  // Upper lantern: 7 m square with cut corners, one tall arched opening a
  // face with an oculus over it, cornice, balustrade, corner pinnacles.
  const LH = 3.5
  const LAN = chamfer(at(rect(-LH, -LH, LH, LH), TX, TY), 1.0)
  walls(crown, LAN, 55.4, 64.6)
  cornice(crown, LAN, 64.6, 65.0, 65.3, 0.4)
  cap(crown, inset(LAN, -0.4), 65.3)
  parapet(crown, inset(LAN, -0.3), 65.3, 66.2, 0.25)
  const lq = at(rect(-LH, -LH, LH, LH), TX, TY)
  for (let i = 0; i < 4; i++) {
    const a = lq[i], b = lq[(i + 1) % 4]
    archPanel(win, a, b, LH - 0.9, LH + 0.9, 57.4, 61.4)
    disc(win, a, b, LH, 63.3, 0.5, 0.06, 10)
  }
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) pinnacle(crown, TX + sx * 3.3, TY + sy * 3.3, 66.2, 1.5, 0.3, 6)

  // Drum, dome, cupola, vane.
  lathe(crown, TX, TY, [[2.6, 65.3], [2.6, 67.6], [2.85, 67.75], [2.85, 68.1], [0, 68.1]], 16)
  const domeProf: XY[] = []
  for (let k = 0; k <= 6; k++) {
    const t = (k / 6) * (Math.PI / 2)
    domeProf.push([2.65 * Math.cos(t), 68.1 + 3.3 * Math.sin(t)])
  }
  lathe(dome, TX, TY, domeProf, 16)
  lathe(dome, TX, TY, [[0.8, 71.0], [0.8, 73.2], [1.0, 73.35], [1.0, 73.6], [0.55, 74.4], [0.12, 75.4], [0.12, 76.2], [0.32, 76.5], [0.12, 76.8], [0.1, 78.0], [0, 78.1]], 10)
  // The vane: a plain plate turned to the diagonal, so it reads from most sides.
  {
    const c: V3 = [TX, TY, 78.0], d = Math.SQRT1_2
    const P = (s: number, z: number): V3 => [c[0] + s * d, c[1] + s * d, z]
    dome.quad(P(-0.8, 78.0), P(0.8, 78.0), P(0.8, 79.5), P(-0.8, 79.5))
    dome.quad(P(0.8, 78.0), P(-0.8, 78.0), P(-0.8, 79.5), P(0.8, 79.5))
  }

  // Floodlight: the tower shaft and the front block, strongest on walls.
  const floodlit = (p: V3, n: V3) => (p[0] < 13 ? 0 : n[2] > 0.7 ? 0.3 : 0.65 + 0.35 * Math.min(1, p[2] / 46))
  return [
    { part: ochre, material: { ...finish('ft-ochre', 0xe8c98c), floodlight: floodlit } },
    { part: cream, material: { ...finish('ft-cream', 0xf4e3d3), floodlight: floodlit } },
    { part: win, material: PALETTE.window },
    { part: tile, material: PALETTE.terracotta },
    { part: crown, material: finish('neon-ft-crown', 0xf4e3d3) },
    { part: dome, material: PALETTE.patina },
  ]
}

if (import.meta.main) await save('mia-freedom-tower', 'Freedom Tower', [25.780291, -80.1897125], 358.7, build(), 6500)
