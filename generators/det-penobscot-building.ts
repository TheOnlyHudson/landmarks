/**
 * Greater Penobscot Building (645 Griswold Street, Detroit, 1928, Wirt C.
 * Rowland of Smith, Hinchman & Grylls) — original procedural geometry,
 * CC0-1.0.
 * bun generators/det-penobscot-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/69000329 ("Greater
 * Penobscot Building (1928)"), 42.3302700,-83.0475557. Its walls run at
 * 329.2° / 59.2°, so the catalog bearing is 329.2: +y runs towards Fort
 * Street, -x towards the 1905 Penobscot Building and Griswold.
 *
 * Only the 1928 tower is modelled. The 1905 Penobscot Building
 * (way/107628173, 13 storeys of red brick and white terracotta, ~52 m in the
 * lidar) and the 1916 Penobscot Annex (way/69409234, 23 storeys) are joined
 * to it inside but are separate buildings with their own fronts (Andrew
 * Jameson's and Michael Barera's photos); the map keeps drawing them, so
 * `replaces` lists only way/69000329.
 *
 * Identity, in order: the pale Indiana limestone H-plan tower, light courts
 * cut into its east and west faces; the ziggurat crown stepping in six
 * times, with round-headed windows in the top stages; the lattice mast with
 * the red "Penobscot ball" beacon; the tall arcade of the base on Fort
 * Street. At night the ball glows red (`neon-penobscot-red`) and the crown
 * is floodlit.
 *
 * Evidence:
 *  - plan: OSM outline, 44.0 × 41.6 m. Lidar: the H's courts, x beyond
 *    ±9.5 and y -4.3..4.3, drop to ~24 m (the base's roof).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid, read
 *    in this frame, street ~4.5 m above the box's ground_min: H wings
 *    133 m, their outer corners stepping at 110 and 124 m; the N-S strip
 *    x ±8.5 to 144 m; the centre x ±14, y ±11 and the strip x ±6.5 to
 *    153 m; x ±10, y ±12.5 to 160 m; x ±6, y ±11 to 168 m; the top stage
 *    ~8 m square to 172 m (OSM height 172.2, published roof 172 m); the
 *    mast's returns to ~194 m. Lidar centres sit ~1 m west of the OSM
 *    outline; the model is kept symmetric on the outline.
 *  - published: 47 storeys, 172 m roof (Wikipedia, CTBUH; OSM 172.2).
 *  - photos: tier proportions, the round-headed top windows, window pitch,
 *    the base arcade (five tall arches on Fort Street), the ball's size
 *    (~4 m across against the mast).
 *  - colour: grey-buff limestone, #d6cfc2 in WMrapids' photo, pulled to
 *    the palette as `penobscot-limestone`; the ball red.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Penobscot_Building_2025.jpg, WMrapids, CC0 (whole tower and mast)
 *  - Penobscot_Building_Detroit_MI.jpg, Andrew Jameson, CC BY-SA 3.0 (the
 *    1905 building in front of the tower)
 *  - Detroit_December_2015_36_(Penobscot_Building).jpg, Michael Barera,
 *    CC BY-SA 4.0 (base arcade and crown from Fort Street)
 *  - Greater_Penobscot_Building,_Griswold_Street,_Detroit,_MI_-_
 *    53019008302.jpg, w_lemay (Warren LeMay), CC BY-SA 2.0 (crown from afar)
 *  - Penobscot_night.jpg, Emperley3, CC BY-SA 3.0, and
 *    Detroit_Financial_District_by_night_from_Windsor,_Ontario,_2025-06-28.jpg,
 *    Crisco 1492, CC BY-SA 4.0 (night look: red ball, lit crown)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the arcade is drawn on Fort Street only (the side photographed);
 * the Congress Street base is drawn with plain bays. The lattice mast is a
 * solid tapered shaft.
 *
 * Left out: carved ornament and the Native American motifs, mullions, the
 * antennas on the roof.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, lathe, panel, rect, rows, save, walls, type XY } from './chi-aon-center'
import { notched } from './chi-board-of-trade'

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

/** Window columns on every wall of a ring at least `minLen` long; `arch` gives the top group a round head. */
function columns(p: Part, r: XY[], z0: number, z1: number, o: { w?: number; pitch?: number; per?: number; gap?: number; minLen?: number; arch?: boolean; party?: (a: XY, b: XY, z1: number) => boolean } = {}) {
  const w = o.w ?? 1.0, pitch = o.pitch ?? 2.7, per = o.per ?? 11, gap = o.gap ?? 1.6, minLen = o.minLen ?? 3.5
  const groups = rows(z0, z1, Math.max(1, Math.round((z1 - z0) / per)), gap)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const k = Math.max(1, Math.floor((L - 1.2) / pitch)), first = (L - (k - 1) * pitch) / 2
    for (let q = 0; q < k; q++) {
      const s = first + q * pitch
      groups.forEach(([g0, g1], gi) => {
        if (o.party?.(a, b, g1)) return
        if (o.arch && gi === groups.length - 1) archPanel(p, a, b, s - w / 2, s + w / 2, g0, g1 - w / 2, 0.05, 4)
        else panel(p, a, b, s - w / 2, s + w / 2, g0, g1, 0.05)
      })
    }
  }
}

/** A stage: walls from z0 to z1 with a bevelled lip and a roof cap. */
function stage(wall: Part, roof: Part, r: XY[], z0: number, z1: number) {
  walls(wall, r, z0, z1 - 0.4)
  walls(wall, r, z1 - 0.4, z1, inset(r, 0.35))
  cap(roof, inset(r, 0.35), z1)
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), metal = new Part(), ball = new Part(), door = new Part()

  const HX = 22, HY = 20.8 // half the outline
  const CX = 9.5, CY = 4.3 // the light courts: |x| > CX, |y| < CY
  const BASE = 24, WING = 133

  // ---- the base: the whole lot to the courts' floor
  stage(stone, roof, rect(-HX, -HY, HX, HY), 0, BASE)

  // ---- the H: ring counter-clockwise from the south-west corner
  const hRing = (n: number): XY[] => {
    const pts: XY[] = []
    const corner = (x: number, y: number, a: XY, b: XY) => {
      // a: the point before the corner, b: after; notch inward by n
      if (n <= 0) { pts.push([x, y]); return }
      pts.push(a, [a[0] + b[0] - x, a[1] + b[1] - y], b)
    }
    // south-west corner, along the south face, south-east, up the east face with its court, north-east, north, north-west, west court
    corner(-HX, -HY, [-HX, -HY + n], [-HX + n, -HY])
    corner(HX, -HY, [HX - n, -HY], [HX, -HY + n])
    pts.push([HX, -CY], [CX, -CY], [CX, CY], [HX, CY])
    corner(HX, HY, [HX, HY - n], [HX - n, HY])
    corner(-HX, HY, [-HX + n, HY], [-HX, HY - n])
    pts.push([-HX, CY], [-CX, CY], [-CX, -CY], [-HX, -CY])
    return pts
  }
  const h0 = hRing(0), h1 = hRing(2), h2 = hRing(5)
  walls(stone, h0, BASE, 110)
  // the court floors and the corner ledges
  cap(roof, h0, 110)
  walls(stone, h1, 110, 124)
  cap(roof, h1, 124)
  stage(stone, roof, h2, 124, WING)

  // ---- the ziggurat
  const tiers: [XY[], number, number][] = [
    [notched(-8.5, -HY, 8.5, HY, 1.2), WING, 144],
    [rect(-14, -11, 14, 11), WING, 153],
    [notched(-6.5, -19.5, 6.5, 19.5, 1.0), 144, 153],
    [notched(-10, -12.5, 10, 12.5, 1.2), 153, 160],
    [notched(-6, -11, 6, 11, 1.0), 160, 168],
    [rect(-4, -4.5, 4, 4.5), 168, 172.2],
  ]
  for (const [r, z0, z1] of tiers) stage(stone, roof, r, z0, z1)

  // ---- the mast and the ball
  block(roof, roof, rect(-2, -2, 2, 2), 172.2, 174.5, 0.3)
  const mast = (r: number, z: number): XY[] => rect(-r, -r, r, r).map(([x, y]) => [x, y] as XY)
  {
    const rings = [mast(1.4, 0), mast(0.45, 0)]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      metal.quad([rings[0][i][0], rings[0][i][1], 174.5], [rings[0][j][0], rings[0][j][1], 174.5], [rings[1][j][0], rings[1][j][1], 190], [rings[1][i][0], rings[1][i][1], 190])
    }
  }
  const prof: XY[] = Array.from({ length: 9 }, (_, i) => {
    const t = -Math.PI / 2 + (i / 8) * Math.PI
    return [2.0 * Math.cos(t), 192 + 2.0 * Math.sin(t)] as XY
  })
  lathe(ball, 0, 0, prof, 12)
  block(metal, metal, rect(-0.12, -0.12, 0.12, 0.12), 194, 196.5, 0.05)

  // ---- windows
  // H wings: columns in three-storey groups (~3.6 m a floor)
  // the west face is a party wall with the 1905 building up to ~53 m
  const party = (a: XY, b: XY, z1: number) => a[0] < -HX + 0.1 && b[0] < -HX + 0.1 && z1 < 54
  columns(win, h0, BASE + 2, 108, { per: 10.8, gap: 1.5, party })
  columns(win, h1, 111, 122.5, { per: 11.5, gap: 1.5, minLen: 6 })
  columns(win, h2, 125, WING - 1.4, { per: 8, gap: 1.2, minLen: 6, arch: true })
  for (const [r, z0, z1] of tiers.slice(0, 5)) columns(win, r, z0 + 1.2, z1 - 1.3, { per: 10, gap: 1.4, minLen: 5, arch: true })

  // ---- the base: the Fort Street arcade (north face, a→b runs west)
  const fn: [XY, XY] = [[HX, HY], [-HX, HY]]
  for (let k = 0; k < 5; k++) {
    const c = 22 + (k - 2) * 7.2
    archPanel(win, fn[0], fn[1], c - 2.4, c + 2.4, 4.2, 17.5, 0.05, 8)
    panel(door, fn[0], fn[1], c - 1.6, c + 1.6, 0, 4.2, 0.06)
  }
  for (const s of [3, 41]) panel(win, fn[0], fn[1], s - 1.0, s + 1.0, 4, 20, 0.05)
  // the other street faces of the base
  const fs: [XY, XY] = [[-HX, -HY], [HX, -HY]]
  for (let k = 0; k < 9; k++) {
    const c = 4 + k * 4.5
    panel(win, fs[0], fs[1], c - 1.2, c + 1.2, 4.5, 11, 0.05)
    panel(win, fs[0], fs[1], c - 1.2, c + 1.2, 13, 21.5, 0.05)
  }
  panel(door, fs[0], fs[1], 19.5, 24.5, 0, 4, 0.06)
  for (const [a, b] of [[[HX, -HY], [HX, HY]]] as [XY, XY][]) for (let k = 0; k < 8; k++) {
    const c = 4 + k * 4.7
    panel(win, a, b, c - 1.2, c + 1.2, 4.5, 21.5, 0.05)
  }

  // Night: the crown floodlit from its setbacks; the ball glows red.
  const flood = (p: V3, n: V3) => (p[2] < 118 ? 0 : (n[2] > 0.7 ? 0.25 : 0.55 + 0.45 * Math.min(1, (p[2] - 118) / 50)))
  return [
    { part: stone, material: { ...finish('penobscot-limestone', 0xe6dfd2), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('mast-steel', 0x8f9499) },
    { part: ball, material: finish('neon-penobscot-red', 0xd2463a) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-penobscot-building', 'Penobscot Building', [42.33027, -83.0475557], 329.2, build(), 5000)
