/**
 * Biltmore Hotel, Coral Gables (1200 Anastasia Avenue; 1926, Schultze &
 * Weaver, its tower modelled on the Giralda in Seville) — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-biltmore-hotel.ts
 *
 * Map frame: model +y points along the bearing (358°), +x to its right;
 * metres; origin at the anchor on the ground. Anchor = area centroid of the
 * OSM multipolygon relation/9351650 (outer ways 468910676 and 1154473967,
 * less its two courtyards), 25.7409124, -80.2780575. The hotel's walls run
 * at 358° / 88°, so the catalog bearing is 358.
 *
 * Identity, in order: the Giralda tower over the middle of the north front
 * (ochre shaft between pale corner piers, a corbelled cornice with domed
 * corner bartizans, the cream belfry, the narrower lantern, the round
 * tempietto with its dark dome); the ten-storey central block and the two
 * wings splayed back from it at 30°, all salmon-ochre under low red-tile
 * hipped roofs; the small arcaded belvedere at the central block's east
 * end; the lower south wings round the courtyard; the long three-storey
 * east range (country-club wing) with its own courtyard.
 *
 * Night: the tower is floodlit warm white (`floodlight` on its stone, ochre
 * and crown); windows glow.
 *
 * Evidence:
 *  - plan: OSM relation/9351650 (building=hotel, 8 levels, wikidata
 *    Q2293021): outer way/468910676 (central block, the two angled wings,
 *    the south wings, the north-east link), outer way/1154473967 (east
 *    range), inner way/672679253 and way/578928611 (courtyards, left open).
 *    Wing axes from the OSM edges: north-west wing at 149° from +x, 12.6 m
 *    wide; north-east wing at 29.7°, 14 m wide. USGS NAIP (public domain)
 *    for the roofs.
 *  - heights: lidar, NOAA Digital Coast EPT 10338 (2021 Florida coastal
 *    topobathy, public domain; the USGS 3DEP clouds listed for Miami have no
 *    points here), 1 m grid, measured over the flat ground round the hotel:
 *    central block eaves ~39.5, hip to ~43.5 (lidar 44–45 at the ridge); the tower's shaft deck 61.6,
 *    bartizans to ~68, belfry ~78, lantern ~86, dome top 93.6, finial 94.9
 *    (published 315 ft / 96 m: Wikipedia, NRHP 72000306); the angled wings
 *    31–33 with their last bays ~25; the east belvedere 46; the south
 *    wings' eaves 24, ridges 27.4; the courtyard ranges 13; the east range
 *    13.5 with its north-west annex 6.
 *  - tower stages, window columns, piers: from the photos, with the
 *    widths from lidar (shaft 16 m square, belfry ~10, lantern ~7.5).
 *  - colour: salmon-ochre walls, cream piers and crown, red tile, a dark
 *    slate dome: the daylight photos below.
 *
 * Photos (Wikimedia Commons):
 *  - Biltmore_Hotel_at_Coral_Gables(js)01.jpg (Jerzy Strzelecki, CC BY 3.0),
 *    the north front head-on
 *  - Coral_Gables_Biltmore_Hotel,_Miami,_Florida,_USA_-_20130909.jpg
 *    (Jacklee, CC BY-SA 4.0), the tower and central block from the north
 *  - Coral_Gables_FL_Biltmore01.jpg (Ebyabe, CC BY-SA 3.0), from the
 *    north-east
 *  - Coral_Gables_-_Miami_BiItmore_Hotel_and_Golf_Course_01.jpg (Aero-Graphic
 *    Corp. postcard, public domain), aerial from the north-east (1930s: the
 *    plan and roofs only)
 * No look-only sources. No commercial imagery.
 *
 * Left out: the north terrace and porte-cochère (ground level, outside
 * the outline), balconies, balustrade urns, the pool and its loggias (a
 * separate building, relation/9351651), relation/9351651's clubhouse.
 *
 * Doubts: the south faces are drawn from lidar and the 1930s aerial only
 * (no licensed modern photo from the golf course side close enough); the
 * central block's roof reads lower on its north side in lidar and is drawn
 * as one symmetric hip; the east range's tiled perimeter roofs follow the
 * postcard and NAIP.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, inset, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { archPanel, cornice, parapet, pinnacle, ring, at } from './mia-freedom-tower'
import { faces, hip, quoins, solid } from './mia-vizcaya'

/** Copy `src` into `dst`, turned by `deg` counter-clockwise about the origin and shifted. */
function place(dst: Part, src: Part, deg: number, dx: number, dy: number) {
  const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180)
  const P = (i: number): V3 => {
    const x = src.pos[i], y = -src.pos[i + 2], z = src.pos[i + 1]
    return [x * c - y * s + dx, x * s + y * c + dy, z]
  }
  for (let i = 0; i < src.pos.length; i += 9) dst.tri(P(i), P(i + 3), P(i + 6))
}

/**
 * Window groups on wall a→b: columns `pitch` apart (`w` wide), two storeys
 * to a panel with a spandrel between pairs, from z0 up to z1.
 */
function groups(win: Part, a: XY, b: XY, pitch: number, w: number, z0: number, z1: number, storey: number, end = 2, out = 0.05) {
  const { L } = onWall(a, b)
  const n = Math.max(1, Math.floor((L - 2 * end) / pitch) + 1), s0 = (L - (n - 1) * pitch) / 2
  for (let k = 0; k < n; k++) {
    const c = s0 + k * pitch
    for (let z = z0; z + storey * 2 - 1.7 <= z1 + 0.01; z += storey * 2) panel(win, a, b, c - w / 2, c + w / 2, z, z + storey * 2 - 1.7, out)
  }
}

type Parts = { ochre: Part; cream: Part; win: Part; tile: Part }

/** A rectangular block with grouped windows on all four faces and a hipped tile roof. */
function blockAt(p: Parts, x0: number, y0: number, x1: number, y1: number, h: number, rise: number, opt: { skip?: number[]; storey?: number; oh?: number; arches?: boolean; pitch?: number } = {}) {
  solid(p.ochre, x0, y0, x1, y1, 0, h, null)
  hip(p.tile, x0, y0, x1, y1, h, h + rise, opt.oh ?? 0.8)
  // A cream band under the eaves.
  faces(x0, y0, x1, y1).forEach(([a, b], i) => {
    panel(p.cream, a, b, 0, onWall(a, b).L, h - 1.0, h, 0.06)
    if (opt.skip?.includes(i)) return
    groups(p.win, a, b, opt.pitch ?? 4.0, 1.7, 4.2, h - 1.6, opt.storey ?? 3.0)
    if (opt.arches === false) return
    // Ground-floor arches.
    const { L } = onWall(a, b)
    const n = Math.max(1, Math.floor((L - 4) / 3.6) + 1), s0 = (L - (n - 1) * 3.6) / 2
    for (let k = 0; k < n; k++) archPanel(p.win, a, b, s0 + k * 3.6 - 0.8, s0 + k * 3.6 + 0.8, 0.6, 2.6, 0.05, 6)
  })
}

/** A wing along +x from x = 0 to L, width W, centred on y = 0; the last `endL` metres lower (endH). */
function wing(L: number, W: number, H: number, endL: number, endH: number): Parts {
  const p: Parts = { ochre: new Part(), cream: new Part(), win: new Part(), tile: new Part() }
  blockAt(p, 0, -W / 2, L - endL, W / 2, H, 2.8, { skip: [3] })
  blockAt(p, L - endL, -W / 2, L, W / 2, endH, 2.4, { skip: [3] })
  return p
}

function build() {
  const ochre = new Part(), cream = new Part(), win = new Part(), tile = new Part(), crown = new Part(), dome = new Part()
  const P: Parts = { ochre, cream, win, tile }

  // --- Central block, x -82..-26, y -20.5..-2.5.
  blockAt(P, -82, -20.5, -26, -2.5, 39.5, 4.0, { storey: 3.2 })
  // The belvedere at its east end: arcaded top storey under a low hip.
  solid(ochre, -28.5, -17, -19.5, -7, 0, 44, null)
  hip(tile, -28.5, -17, -19.5, -7, 44, 46.6, 0.7)
  for (const [a, b] of faces(-28.5, -17, -19.5, -7)) {
    const { L } = onWall(a, b)
    for (const s of [L / 2 - 2.6, L / 2, L / 2 + 2.6]) archPanel(win, a, b, s - 0.85, s + 0.85, 39.8, 42.2, 0.05, 6)
    panel(cream, a, b, 0, L, 43.2, 44, 0.06)
  }

  // --- The two wings, splayed at ~30°.
  const nw = wing(47.7, 12.6, 30.5, 8, 24.5), ne = wing(43.7, 14, 30.5, 7, 24.5)
  for (const k of ['ochre', 'cream', 'win', 'tile'] as const) {
    place(P[k], nw[k], 149.1, -78, -12.6)
    place(P[k], ne[k], 29.7, -30, -14.9)
  }

  // --- South wings and the courtyard ranges.
  blockAt(P, -82, -52, -62, -20.5, 24, 3.4, { skip: [2], arches: false })
  blockAt(P, -42, -52, -22, -20.5, 24, 3.4, { skip: [2], arches: false })
  for (const r of [[-62, -26, -42, -20.5], [-62, -52, -42, -44], [-62, -44, -58, -26], [-46, -44, -42, -26]]) {
    solid(ochre, r[0], r[1], r[2], r[3], 0, 13, tile)
  }
  blockAt(P, -22, -52, -15, -20.5, 8.2, 1.4, { skip: [3], arches: false })

  // --- East range (country-club wing), three storeys round its courtyard,
  // and the low annex north of the link.
  blockAt(P, 9.5, -3.7, 98, 12.3, 13.5, 2.0, { storey: 3.4, arches: false, pitch: 4.6 })
  blockAt(P, 9.5, 12.3, 61.2, 27, 13.5, 2.0, { skip: [0], storey: 3.4, arches: false, pitch: 4.6 })
  blockAt(P, 84.3, 12.3, 98, 49, 13.5, 2.0, { skip: [0], storey: 3.4, arches: false, pitch: 4.6 })
  blockAt(P, 47, 33.9, 84.3, 49, 13.5, 2.0, { skip: [1], storey: 3.4, arches: false, pitch: 4.6 })
  blockAt(P, 47, 27, 61.2, 33.9, 13.5, 2.0, { skip: [0, 2], storey: 3.4, arches: false, pitch: 4.6 })
  blockAt(P, 9.8, 27, 28.4, 49.3, 6.0, 1.6, { skip: [0], storey: 3.0, arches: false, pitch: 4.6 })

  // --- The tower: shaft x -60..-44, y -18.5..-2.5 (front 0.4 m proud).
  const TX = -52, TY = -10.4, H = 8, TOP = 59.6
  const SH = at(rect(-H, -H, H, H), TX, TY)
  walls(cream, SH, 0, TOP)
  for (let i = 0; i < 4; i++) {
    const a = SH[i], b = SH[(i + 1) % 4]
    panel(ochre, a, b, 2.4, 2 * H - 2.4, 0.5, TOP - 0.8, 0.03)
    // Three window columns; the middle one with tall arched pairs.
    for (const c of [4.6, 11.4]) for (let z = 4.5; z + 4.6 < TOP - 1; z += 6.4) panel(win, a, b, c - 0.6, c + 0.6, z, z + 4.6, 0.07)
    for (let z = 4.5; z + 4.6 < TOP - 1; z += 6.4) archPanel(win, a, b, H - 0.9, H + 0.9, z, z + 3.7, 0.07, 6)
    panel(cream, a, b, 2.4, 2 * H - 2.4, 45.6, 46.4, 0.06) // string course under the top stage
  }
  cornice(cream, SH, TOP, 60.8, 61.6, 0.7)
  cap(cream, inset(SH, -0.7), 61.6)
  parapet(cream, inset(SH, -0.6), 61.6, 62.8, 0.3)
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    lathe(cream, TX + sx * H, TY + sy * H, [[0, 57.4], [0.7, 58.4], [1.5, 59.6], [1.5, 64.6], [1.7, 64.8], [1.7, 65.2], [1.2, 66.0], [0.15, 68.0]], 10)
  }

  // Belfry: 10.6 m square with cut corners, a big arch on each face.
  const BH = 5.3
  const BEL = chamfer(at(rect(-BH, -BH, BH, BH), TX, TY), 1.0)
  walls(crown, BEL, 61.6, 72.6)
  cornice(crown, BEL, 72.2, 73.0, 73.4, 0.75)
  cap(crown, inset(BEL, -0.75), 73.4)
  parapet(crown, inset(BEL, -0.65), 73.4, 74.4, 0.3)
  const bq = at(rect(-BH, -BH, BH, BH), TX, TY)
  for (let i = 0; i < 4; i++) {
    const a = bq[i], b = bq[(i + 1) % 4]
    archPanel(win, a, b, BH - 1.5, BH + 1.5, 63.6, 68.8, 0.05, 8)
  }
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) pinnacle(crown, TX + sx * 5.2, TY + sy * 5.2, 74.4, 3.6, 0.5)

  // Lantern: 7.4 m square with cut corners, an arch a face.
  const LH = 3.7
  const LAN = chamfer(at(rect(-LH, -LH, LH, LH), TX, TY), 0.9)
  walls(crown, LAN, 73.4, 82.6)
  cornice(crown, LAN, 82.6, 83.0, 83.3, 0.4)
  cap(crown, inset(LAN, -0.4), 83.3)
  const lq = at(rect(-LH, -LH, LH, LH), TX, TY)
  for (let i = 0; i < 4; i++) archPanel(win, lq[i], lq[(i + 1) % 4], LH - 1.0, LH + 1.0, 75.4, 79.6, 0.05, 8)
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) pinnacle(crown, TX + sx * 3.4, TY + sy * 3.4, 83.3, 1.8, 0.32, 6)

  // Tempietto: a round colonnaded drum, its dark dome and the finial.
  lathe(crown, TX, TY, [[2.7, 83.3], [2.7, 87.4], [3.0, 87.6], [3.0, 88.0], [0, 88.0]], 16)
  for (let k = 0; k < 8; k++) {
    const t = (k / 8) * 2 * Math.PI + Math.PI / 8, d = 2.72
    const c: XY = [TX + d * Math.cos(t), TY + d * Math.sin(t)], u: XY = [-Math.sin(t), Math.cos(t)]
    const A: XY = [c[0] - u[0] * 0.55, c[1] - u[1] * 0.55], B: XY = [c[0] + u[0] * 0.55, c[1] + u[1] * 0.55]
    panel(win, A, B, 0, 1.1, 84.2, 86.8, 0.04)
  }
  const domeProf: XY[] = []
  for (let k = 0; k <= 6; k++) { const t = (k / 6) * (Math.PI / 2); domeProf.push([2.75 * Math.cos(t), 88.0 + 3.0 * Math.sin(t)]) }
  lathe(dome, TX, TY, domeProf, 16)
  lathe(dome, TX, TY, [[0.8, 90.6], [0.8, 92.2], [1.0, 92.4], [0.5, 93.2], [0.12, 93.6], [0.12, 94.4], [0.3, 94.6], [0, 95.0]], 10)

  // Quoin-like cream piers on the central block's corners.
  for (const [a, b] of faces(-82, -20.5, -26, -2.5)) quoins(cream, a, b, 0, 37, 1.2)

  // Floodlight: the tower, strongest on its walls.
  const tower = (p: V3, n: V3) => {
    const inTower = Math.abs(p[0] - TX) < H + 2 && Math.abs(p[1] - TY) < H + 2 && p[2] > 30
    return !inTower ? 0 : n[2] > 0.7 ? 0.3 : 0.6 + 0.4 * Math.min(1, (p[2] - 30) / 50)
  }
  return [
    { part: ochre, material: { ...finish('bh-ochre', 0xebbf92), floodlight: tower } },
    { part: cream, material: { ...finish('bh-cream', 0xf4e5d1), floodlight: tower } },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('bh-tile', 0xb8604a, 0.9) },
    { part: crown, material: { ...finish('bh-crown', 0xf4e5d1), floodlight: () => 0.9 } },
    { part: dome, material: finish('bh-dome', 0x5f6a6e) },
  ]
}

void ring
if (import.meta.main) await save('mia-biltmore-hotel', 'Biltmore Hotel', [25.7409124, -80.2780575], 358, build(), 6500)
