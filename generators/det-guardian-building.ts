/**
 * Guardian Building (500 Griswold Street, Detroit, 1929, Wirt C. Rowland of
 * Smith, Hinchman & Grylls), the "Cathedral of Finance" — original
 * procedural geometry, CC0-1.0.
 * bun generators/det-guardian-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/330839648,
 * 42.3295592,-83.0460941. Its walls run at 329.6° / 59.6° (the downtown
 * Woodward grid), so the catalog bearing is 329.6 and the building is
 * square to this frame: +y runs up Griswold towards Congress Street, the
 * west face (-x) is the Griswold front.
 *
 * Identity, in order: the orange "Guardian brick" slab, long and narrow on
 * Griswold; the taller north tower over Congress with its stepped piers and
 * the Pewabic-tile crown tier (orange, gold and blue) under a flagpole; the
 * lower south tower with its own tiled top; the tan limestone base with the
 * great arched Griswold entrance and the tall arched banking-hall windows;
 * the brick piers rising past the parapets in white-tipped points. At night
 * the brick is floodlit orange and the crowns glow (neon, in their colour).
 *
 * Evidence:
 *  - plan: OSM outline way/330839648 (24.6 × 82.3 m) and its part
 *    way/1071710128 (the slab and both towers, 120.95 m). Lidar confirms
 *    the plan: the slab is 19.6 m wide (x -9.8..9.8) between 26.5 m stone
 *    side wings, the two towers take the full 24.6 m width.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid, read
 *    in this frame (street ~0): slab roof 121 m (part tag 120.95, agrees);
 *    side wings 26.5 m; north tower y 18.5..41.2 parapet 137.4 m with its
 *    corners stepped down to ~121–127 m; a first crown step ~18 × 20 m to
 *    ~141 m (lidar returns at 139–145 m), buttressed at its corners; the
 *    Pewabic drum (drawn 16 × 17 m with cut corners, a little fuller than the
 *    lidar's ~13.5 × 15 m so it reads at phone size) to
 *    148.3 m, a small penthouse to ~151 m (published roof 151 m), the mast
 *    and antenna returns to ~176 m (published 177 m to the tips); south
 *    tower y -41.1..-29.5: 117 m outer, 122 m inner, top tier 130–132 m.
 *  - published: 36 storeys + crown, 151 m roof / 177 m tip (Wikipedia,
 *    CTBUH); built 1928–29.
 *  - photos: proportions of the base (stone to about 27 m, the 8 m wide
 *    entrance arch, five arched hall windows on Griswold, the tall arched
 *    window over the Congress door), bay counts and the crown pattern.
 *  - colour: the brick reads orange-salmon (#c8805a in sun, #a8603f in
 *    shade) in WMrapids' and JJonahJackalope's photos; pulled to the
 *    palette's lightness as `guardian-brick`. The base limestone is tan
 *    (`guardian-stone`). The crown tiers' Pewabic tile reads a slightly
 *    deeper orange than the brick (review: not gold) and is the
 *    `neon-guardian-crown` finish, so it glows orange after dark as in
 *    Crisco 1492's 2025 night view.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Guardian_Building_2025.jpg, WMrapids, CC0 (from the south-west, the
 *    long Griswold face and both towers)
 *  - Guardian_Building,_Detroit_2.jpg, JJonahJackalope, CC BY-SA 4.0
 *    (Griswold base, entrance arch, banking-hall windows)
 *  - Guardian_Building_Detroit_MI.jpg, Andrew Jameson, CC BY-SA 3.0 (from
 *    the north-east, Congress end and the east face)
 *  - Guardian_Building,_Griswold_Street,_Detroit,_MI_-_53026483822.jpg,
 *    w_lemay (Warren LeMay), CC BY-SA 2.0 (Congress end, arched window)
 *  - Pinnacles_of_Guardian_Building,_One_Woodward_Avenue,_and_Hudson's_
 *    Detroit,_Detroit,_Michigan,_2025-08-01.jpg, Chris Woodrich (Crisco
 *    1492), CC BY-SA 4.0 (the crown tier close up)
 *  - Detroit_Financial_District_by_night_from_Windsor,_Ontario,
 *    _2025-06-28.jpg, Crisco 1492, CC BY-SA 4.0 (night look)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east face is mostly hidden by the low buildings beside it;
 * it is drawn like the west face without the hall windows. The crown
 * tier's chamfered plan is read from the close-up and the lidar; its real
 * corners carry small turrets that are left as chamfers. The flagpole is
 * drawn as a slim mast to the 176 m lidar return.
 *
 * Left out: the sculpted figures and tile bands of the base, the granite
 * plinth (folded into the stone), mullions, the antenna frame.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, panel, rect, rows, save, walls, type XY } from './chi-aon-center'
import { notched } from './chi-board-of-trade'

/** A round-headed panel on wall a→b: jambs s0..s1 from z0 to the spring line zs, semicircular head. */
function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 10) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, zs), P(s0, zs))
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
  }
}

/** Brick piers rising past a parapet, `n` along wall a→b, each with a pale stepped tip. */
function piers(brick: Part, tip: Part, a: XY, b: XY, n: number, z: number, h: number, w = 1.3, d = 0.9, end = 0.6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  for (let k = 0; k < n; k++) {
    const s = end + w / 2 + (k * (L - 2 * end - w)) / Math.max(1, n - 1)
    const at = (ds: number, dn: number): XY => [a[0] + u[0] * (s + ds) + nn[0] * dn, a[1] + u[1] * (s + ds) + nn[1] * dn]
    const r: XY[] = [at(-w / 2, 0.05), at(w / 2, 0.05), at(w / 2, -d), at(-w / 2, -d)]
    // ring must be counter-clockwise from above
    const area = r.reduce((acc, p, i) => { const q = r[(i + 1) % 4]; return acc + p[0] * q[1] - q[0] * p[1] }, 0)
    const ring = area > 0 ? r : [...r].reverse()
    walls(brick, ring, z - 2, z + h)
    block(tip, tip, inset(ring, 0.15), z + h, z + h + 1.4, 0.3)
  }
}

/** Window bays on one wall a→b only (outward to its right). */
function face(p: Part, a: XY, b: XY, rws: [number, number][], o: { bay?: number; gap?: number; end?: number } = {}) {
  const bay = o.bay ?? 2.4, gap = o.gap ?? 1.0, end = o.end ?? 1.0
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), use = L - 2 * end
  const k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of rws) panel(p, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1, 0.05)
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), crown = new Part(), door = new Part()

  const X0 = -12.3, X1 = 12.3, Y0 = -41.1, Y1 = 41.2
  const SX = 9.8 // half-width of the slab
  const NS = 18.5, SS = -29.5 // where the north and south towers begin
  const BASE = 26.5, SLAB = 121, NTOP = 137.4, STOP = 117
  const STONE = 27 // the limestone base, all round

  // ---- the stone base: the full footprint up to the side wings' roofs
  // stone on Griswold and both ends; the east wing between the towers is
  // brick down to the street (Andrew Jameson's view from the north-east)
  const foot = rect(X0, Y0, X1, Y1)
  const fi = inset(foot, 0.4)
  const seg = (p: Part, a: XY, b: XY, z0: number, z1: number) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  for (const [p, a, b] of [[stone, [X0, Y0], [X1, Y0]], [stone, [X1, Y0], [X1, SS]], [brick, [X1, SS], [X1, NS]], [stone, [X1, NS], [X1, Y1]], [stone, [X1, Y1], [X0, Y1]], [stone, [X0, Y1], [X0, Y0]]] as [Part, XY, XY][]) seg(p, a, b, 0, BASE - 0.5)
  walls(stone, foot, BASE - 0.5, BASE, fi)
  // wing roofs either side of the slab
  cap(roof, inset(rect(X0, SS, -SX, NS), 0.2), BASE)
  cap(roof, inset(rect(SX, SS, X1, NS), 0.2), BASE)

  // ---- the slab
  const slab = rect(-SX, SS, SX, NS)
  walls(brick, slab, BASE, SLAB - 0.5)
  walls(brick, slab, SLAB - 0.5, SLAB, inset(slab, 0.4))
  cap(roof, inset(slab, 0.4), SLAB)
  // piers rising past the slab's parapet on both long faces
  piers(brick, stone, [-SX, NS], [-SX, SS], 8, SLAB, 2.6)
  piers(brick, stone, [SX, SS], [SX, NS], 8, SLAB, 2.6)

  // ---- the north tower: full width, stone to 27 m, brick above, corners
  // stepping in over the slab roof
  const nt = rect(X0, NS, X1, Y1)
  walls(stone, nt, BASE, STONE)
  walls(brick, nt, STONE, SLAB)
  const ntTop = notched(X0, NS, X1, Y1, 3.0)
  cap(roof, nt, SLAB) // the corner ledges
  walls(brick, ntTop, SLAB, NTOP - 0.5)
  walls(brick, ntTop, NTOP - 0.5, NTOP, inset(ntTop, 0.4))
  cap(roof, inset(ntTop, 0.4), NTOP)
  // corner piers in the notches, stepping: two short stages
  for (const [cx, cy] of [[X0 + 1.4, NS + 1.4], [X1 - 1.4, NS + 1.4], [X1 - 1.4, Y1 - 1.4], [X0 + 1.4, Y1 - 1.4]] as XY[]) {
    block(brick, roof, rect(cx - 1.3, cy - 1.3, cx + 1.3, cy + 1.3), SLAB, 127, 0.3)
    block(stone, stone, rect(cx - 0.6, cy - 0.6, cx + 0.6, cy + 0.6), 127, 128.6, 0.25)
  }
  // piers past the tower parapet
  piers(brick, stone, [X0, Y1 - 3], [X0, NS + 3], 4, NTOP, 2.4)
  piers(brick, stone, [X1, NS + 3], [X1, Y1 - 3], 4, NTOP, 2.4)
  piers(brick, stone, [X1 - 3, Y1], [X0 + 3, Y1], 5, NTOP, 2.4)
  piers(brick, stone, [X0 + 3, NS], [X1 - 3, NS], 5, NTOP, 2.4)

  // the crown: three bold steps rising to the mast, each with buttress
  // piers at its corners standing past it (Woodrich's close-up, lidar
  // 137 / ~142 / 148 m), the Pewabic tier the top step
  const CX = 0.3, CY = 28.5
  const step = (hw: number, hd: number, z0: number, z1: number, wall: Part, cut: number) => {
    const r = chamfer(rect(CX - hw, CY - hd, CX + hw, CY + hd), cut)
    walls(wall, r, z0, z1 - 0.4)
    walls(wall, r, z1 - 0.4, z1, inset(r, 0.3))
    cap(roof, inset(r, 0.3), z1)
    return r
  }
  const buttress = (hw: number, hd: number, z0: number, z1: number, w = 1.8) => {
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = CX + sx * (hw - w / 2 + 0.3), y = CY + sy * (hd - w / 2 + 0.3)
      block(brick, roof, rect(x - w / 2, y - w / 2, x + w / 2, y + w / 2), z0 - 1, z1, 0.3)
      block(stone, stone, rect(x - w / 2 + 0.3, y - w / 2 + 0.3, x + w / 2 - 0.3, y + w / 2 - 0.3), z1, z1 + 1.2, 0.2)
    }
  }
  step(10.2, 10.6, NTOP, 141.2, brick, 1.2)
  buttress(10.2, 10.6, NTOP, 144.6, 2.0)
  // the Pewabic drum: near-octagonal, most of the tower's width
  const ct = step(8.0, 8.4, 141.2, 149.4, crown, 3.2)
  // the tier's dark blue tile lozenges: one band of pointed openings a face
  for (let i = 0; i < ct.length; i++) {
    const a = ct[i], b = ct[(i + 1) % ct.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const k = Math.max(1, Math.round(L / 3.6))
    for (let q = 0; q < k; q++) {
      const s = (q + 0.5) * (L / k)
      archPanel(win, a, b, s - 0.8, s + 0.8, 143.4, 146.6, 0.05, 4)
    }
  }
  block(roof, roof, rect(CX - 3, CY - 3.5, CX + 3, CY + 3.5), 149.4, 151.2, 0.3)
  block(stone, stone, rect(CX - 0.35, CY - 0.35, CX + 0.35, CY + 0.35), 151.2, 176, 0.1)

  // ---- the south tower
  const st = rect(X0, Y0, X1, SS)
  walls(stone, st, BASE, STONE)
  walls(brick, st, STONE, STOP - 0.5)
  walls(brick, st, STOP - 0.5, STOP, inset(st, 0.4))
  cap(roof, inset(st, 0.4), STOP)
  piers(brick, stone, [X1, Y0 + 1.5], [X1, SS - 1.5], 3, STOP, 2.2)
  piers(brick, stone, [X0, SS - 1.5], [X0, Y0 + 1.5], 3, STOP, 2.2)
  piers(brick, stone, [X0 + 1.5, Y0], [X1 - 1.5, Y0], 5, STOP, 2.2)
  const s2 = rect(-8.2, Y0 + 0.6, 8.2, SS + 1.2)
  walls(brick, s2, STOP, 122 - 0.4)
  walls(brick, s2, 121.6, 122, inset(s2, 0.3))
  cap(roof, inset(s2, 0.3), 122)
  // the lower tower's turret: a chamfered, near-octagonal top
  const s3 = chamfer(rect(-5.8, Y0 + 1.4, 6.8, SS + 1.8), 3.4)
  walls(crown, s3, 122, 130.4)
  walls(brick, s3, 130.4, 131.6, inset(s3, 0.3))
  cap(roof, inset(s3, 0.3), 131.6)
  for (let i = 0; i < s3.length; i++) {
    const a = s3[i], b = s3[(i + 1) % s3.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const k = Math.max(1, Math.round(L / 3.4))
    for (let q = 0; q < k; q++) archPanel(win, a, b, (q + 0.5) * (L / k) - 0.6, (q + 0.5) * (L / k) + 0.6, 124.5, 127.4, 0.05, 4)
  }

  // ---- windows: one panel per bay over three storeys (~3.5 m a floor)
  const up = (z0: number, z1: number) => rows(z0, z1, Math.max(1, Math.round((z1 - z0) / 10.5)), 1.5)
  // slab long faces (the stone wings cover their foot)
  face(win, [-SX, NS], [-SX, SS], up(BASE + 1.5, SLAB - 2.5), { bay: 1.1, gap: 2.0, end: 1.4 })
  face(win, [SX, SS], [SX, NS], up(BASE + 1.5, SLAB - 2.5), { bay: 1.1, gap: 2.0, end: 1.4 })
  // north tower: shaft, then the stepped top stage
  for (const [a, b] of [[[X0, Y1], [X0, NS]], [[X1, NS], [X1, Y1]], [[X1, Y1], [X0, Y1]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round((L - 2.4) / 3.1), w = 1.1, pitch = (L - 2.4) / k
    for (let q = 0; q < k; q++) {
      const s = 1.2 + (q + 0.5) * pitch
      for (const [z0, z1] of up(STONE + 1, NTOP - 3)) {
        if (z1 > SLAB - 1 && (s < 3.6 || s > L - 3.6)) continue
        panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)
      }
    }
  }
  // south tower
  for (const [a, b] of [[[X1, Y0], [X1, SS]], [[X0, SS], [X0, Y0]], [[X0, Y0], [X1, Y0]]] as [XY, XY][])
    face(win, a, b, up(STONE + 1, STOP - 2.5), { bay: 1.1, gap: 2.0, end: 1.4 })
  // wing faces under the slab: small punched windows in the stone
  face(win, [X0, NS], [X0, SS], [[19.5, 24.5]], { bay: 1.5, gap: 2.6, end: 1.5 })
  face(win, [X1, SS], [X1, NS], up(4, BASE - 1), { bay: 1.1, gap: 2.0, end: 1.4 })

  // ---- the base on Griswold (west face, wall a→b runs south)
  const gw: [XY, XY] = [[X0, Y1], [X0, Y0]]
  // the great entrance arch under the north tower, ~8 m wide
  archPanel(stone, gw[0], gw[1], 6.1, 17.1, 0, 12.2, 0.12, 12) // pale stone surround
  archPanel(win, gw[0], gw[1], 7.1, 16.1, 3.6, 12.2, 0.2, 12)
  panel(door, gw[0], gw[1], 8.1, 15.1, 0, 3.6, 0.22)
  // the banking-hall windows: five tall round-headed lights
  for (let k = 0; k < 5; k++) {
    const c = 25 + k * 8.4
    archPanel(win, gw[0], gw[1], c - 2.3, c + 2.3, 5.5, 15.5, 0.05, 10)
  }
  // punched windows in the stone above the hall
  for (let k = 0; k < 9; k++) {
    const c = 22 + k * 4.9
    panel(win, gw[0], gw[1], c - 0.8, c + 0.8, 19.5, 24.5, 0.05)
  }
  // south (Larned) end
  face(win, [X0, Y0], [X1, Y0], [[5, 12], [15, 24.5]], { bay: 1.6, gap: 2.4, end: 2 })
  // the Congress end (north face, wall a→b runs west): arched window over the door
  const cn: [XY, XY] = [[X1, Y1], [X0, Y1]]
  archPanel(win, cn[0], cn[1], 10.3, 14.3, 6.5, 18.5, 0.05, 10)
  panel(door, cn[0], cn[1], 10.8, 13.8, 0, 3.4, 0.05)
  for (const s of [3.5, 7, 17.6, 21.1]) for (const [z0, z1] of [[5, 9], [11, 16], [18.5, 24.5]]) panel(win, cn[0], cn[1], s - 0.7, s + 0.7, z0, z1, 0.05)
  // east face of the base
  face(win, [X1, Y0], [X1, SS], [[5, 12], [15, 24.5]], { bay: 1.5, gap: 2.4, end: 2 })
  face(win, [X1, NS], [X1, Y1], [[5, 12], [15, 24.5]], { bay: 1.5, gap: 2.4, end: 2 })

  // Night: the brick is floodlit orange from the setbacks, strongest high up.
  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 1) * Math.min(1, Math.max(0, (p[2] - 40) / 60)) * 0.9
  return [
    { part: brick, material: { ...finish('guardian-brick', 0xd88d63), floodlight: flood } },
    { part: stone, material: { ...finish('guardian-stone', 0xe3d3ab), floodlight: (p: V3, n: V3) => (p[2] > 100 && n[2] < 0.7 ? 0.8 : 0) } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: finish('neon-guardian-crown', 0xd5814f) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-guardian-building', 'Guardian Building', [42.3295592, -83.0460941], 329.6, build(), 5000)
