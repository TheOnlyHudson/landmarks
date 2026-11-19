/**
 * Cathedral of Learning (1926–1937, Charles Z. Klauder), University of
 * Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-cathedral-of-learning.ts [out.glb]
 *
 * Map frame: x and y in the tower's own grid, z up, metres. The tower is
 * square to a grid turned 47.6° from north: the model's y runs north-east
 * (bearing 47.6°, toward the lawn and the main portal), x south-east. The
 * anchor is the centre of the shaft, on the lowest ground under the
 * footprint (the south-east side, ~3.5 m above the lidar's ground minimum).
 *
 * Form: a four-storey Indiana limestone base filling the block; rising from
 * it a 26 m square shaft with lower projecting blocks on all four sides (a
 * low entrance bay on the north-east, wings on the south-east and
 * north-west, a tall bay on the south-west with a low block before it).
 * Every face is ribbed from its foot to its top by continuous stone piers
 * over dark recessed window slots, with no floor lines; the shaft's
 * corners cant back in four steps toward the top, each step and each
 * block's top carrying thin pinnacles; a battlemented lantern stage with
 * pointed openings and corner turrets crowns it.
 *
 * Measured
 * - Piers, from the north-east face (Cbaile19, 2022-09-14, frontal, the
 *   26 m shaft face ~360 px wide, 13.8 px/m): a ~2 m pier at each corner,
 *   then 15 dark slots ~0.85 m wide, in five groups of three with ~0.4 m
 *   stone between slots, the groups split by four broader raised piers
 *   ~1.3 m wide. The same rhythm (2 m corners, groups of three slots, 1.3 m
 *   piers) is used on every face, as many groups as fit.
 * - Setbacks: lidar (USGS 3DEP PA_WesternPA_2_2019) at the shaft's corners
 *   reads ~78–91 m at the outer corner cell, ~104–113 m one cell in, ~120 m
 *   two cells in, and 129 m (125.5 m over the base ground) across the full
 *   ring, so the corners cant back at 80, 100 and 113 m (chamfers 1, 2, 3
 *   and 4.5 m). The E and S photos show the same taper. Other tiers, lidar
 *   above the lowest ground: base roof 20.5 m (north-east end wings
 *   14.5 m), north-east entrance bay 47.5 m, south-east and north-west
 *   wings 62.5 m, south-west bay 96.5 m with a 39.5 m block before it,
 *   lantern 18 x 26 m. The lantern's returns stop at a flat 153.8 m
 *   (430.1 m NAVD88) with holes across the roof: the cloud is clipped, so
 *   the crown follows the published height.
 * - OSM: outline way/30678664 and parts way/841117936–841117946. The parts
 *   are ~9 m too small (the 163 m part is 17 m square where the lidar shaft
 *   is 26 m) and their heights come from level counts; the base follows
 *   the OSM outline, the tiers the lidar.
 * Published: 535 ft (163 m), 42 storeys (Wikipedia, "Cathedral of
 * Learning"; NRHP 1975). The South Side Slopes photo puts the lantern's top
 * ~32 m over the 125.5 m shoulder, which agrees.
 * Photos (Wikimedia Commons): Cbaile19 (CC0) the north-east face, from the
 * east, the South Side Slopes and at night; Kevin Albright (CC BY-SA 3.0);
 * Michael G. White (CC BY 2.5) from the lawn; ragesoss (CC BY-SA 3.0) from
 * the south-south-west; Silverv623 (CC BY-SA 4.0) from above.
 * Night (Cbaile19, 2022-11-05): the lantern floodlit gold above the
 * shoulder, the shaft dark. The slots are their own unlit material, so the
 * shaft stays dark; the portal glows.
 * Estimated: the crown (parapet 152 m, battlements to 154 m, turrets to
 * 162 m against 163 m published), the pinnacle size (1.3 m base, 4–5 m
 * tall), the slot rhythm on faces other than the north-east, the lantern's
 * pointed openings and the portal, from the photos.
 * Departures: the slots run full height with no spandrels, against the
 * usual "no full-height dark stripes" rule; the continuous ribbing is the
 * building's identity (review, 2026-11).
 * Left out: the flagpole, the tracery, the base's own Gothic windows (drawn
 * as plain dark slots), the Commons Room's vault.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, ccw, capRing, chamfer, coverAt, finishGlb, outward, wallEdge } from './sea-columbia-center'

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** Two triangles wound to face N. */
function quadN(part: Part, a: V3, b: V3, c: V3, d: V3, N: V3) {
  part.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
  part.tri(a, c, d, undefined, undefined, undefined, [N, N, N])
}

/** An axis box (open bottom). */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  quadN(part, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  quadN(part, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  quadN(part, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  quadN(part, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  quadN(part, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/** A four-sided pinnacle standing at (x, y, z). */
function pinnacle(part: Part, x: number, y: number, z: number, s: number, h: number) {
  const b: V3[] = [[x - s, y - s, z], [x + s, y - s, z], [x + s, y + s, z], [x - s, y + s, z]], tip: V3 = [x, y, z + h]
  for (let i = 0; i < 4; i++) part.tri(b[i], b[(i + 1) % 4], tip)
}

/** A convex flat shape on edge (a, b): points are (s along the edge from a, z), fanned from their mean. */
function onFace(part: Part, a: XY, b: XY, pts: XY[], proud = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b)
  const P = ([s, z]: XY): V3 => [a[0] + t[0] * s + n[0] * proud, a[1] + t[1] * s + n[1] * proud, z]
  const c: XY = [pts.reduce((m, p) => m + p[0], 0) / pts.length, pts.reduce((m, p) => m + p[1], 0) / pts.length]
  const N: V3 = [n[0], n[1], 0]
  for (let i = 0; i < pts.length; i++) part.tri(P(c), P(pts[i]), P(pts[(i + 1) % pts.length]), undefined, undefined, undefined, [N, N, N])
}

/** An equilateral pointed arch, centred at s on the face, from sill to apex. */
function lancet(s: number, w: number, sill: number, apex: number): XY[] {
  const r = w, spring = apex - r * Math.sin(Math.PI / 3), pts: XY[] = [[s + w / 2, sill]]
  for (let k = 0; k <= 5; k++) { const th = (k / 5) * (Math.PI / 3); pts.push([s - w / 2 + r * Math.cos(th), spring + r * Math.sin(th)]) }
  for (let k = 4; k >= 0; k--) { const th = (k / 5) * (Math.PI / 3); pts.push([s + w / 2 - r * Math.cos(th), spring + r * Math.sin(th)]) }
  pts.push([s - w / 2, sill])
  return pts
}

// The rib rhythm, measured on the north-east face (see header).
const SLOT = 0.85, GAP = 0.4, PIER = 1.3, CORNER = 2, PROUD = 0.45
const GROUP = 3 * SLOT + 2 * GAP
/** Slot and pier centres, as offsets from a face's centre, for a face W wide. */
function ribs(W: number) {
  const n = Math.max(1, Math.floor((W - 2 * CORNER + PIER) / (GROUP + PIER)))
  const span = n * GROUP + (n - 1) * PIER, slots: number[] = [], piers: number[] = []
  for (let g = 0; g < n; g++) {
    const g0 = -span / 2 + g * (GROUP + PIER)
    for (let k = 0; k < 3; k++) slots.push(g0 + SLOT / 2 + k * (SLOT + GAP))
    if (g < n - 1) piers.push(g0 + GROUP + PIER / 2)
  }
  return { slots, piers }
}

type Arch = { w: number; sill: number; apex: number }
type Block = Prism & {
  W?: [number, number] // un-chamfered face widths along x and along y, for the rib rhythm
  foot?: number // where the slots start over the block's own foot
  head?: number // stone left over the slots at the top; 0 where a tier above carries on
  spires?: boolean // pinnacles on the raised piers' tops
  arches?: Partial<Record<'n' | 's' | 'e' | 'w', Arch>>
}

function build() {
  const stone = new Part(), slot = new Part(), roof = new Part(), door = new Part()

  const BASE: XY[] = [[-32, -53.3], [-19.2, -53.1], [-19.2, -43.4], [18.7, -42.8], [18.5, -52.3], [31.9, -53], [32.8, -11.3], [33.6, 13.4], [33, 24.8], [-34.8, 24.8], [-34.8, 14.2], [-35.5, -12], [-34, -29.3], [-34, -38], [-32, -38.1]]
  const S = 13
  const blk = (r: XY[], z1: number, c: number, extra: Partial<Block> = {}, z0?: number): Block =>
    ({ ring: chamfer(ccw(r), c), z0, z1, wall: stone, roof, kind: 'tower', foot: 2, head: 2.5, spires: true, ...extra })
  const sq = (x0: number, x1: number, y0: number, y1: number) => ({ W: [x1 - x0, y1 - y0] as [number, number] })

  const blocks: Block[] = [
    blk(BASE, 20.5, 0.5, { kind: 'base', spires: false }),
    blk(rect(-51.5, -34.8, 14.2, 24.3), 14.5, 0.5, { kind: 'base', spires: false }),
    blk(rect(33, 48.5, 15.5, 25.3), 14.5, 0.5, { kind: 'base', spires: false }),
    // the four lower blocks round the shaft
    blk(rect(-9, 9, S, 24.8), 47.5, 1, sq(-9, 9, S, 24.8)),
    blk(rect(S, 25.5, -9, 9), 62.5, 1, sq(S, 25.5, -9, 9)),
    blk(rect(-25.5, -S, -9, 9), 62.5, 1, sq(-25.5, -S, -9, 9)),
    blk(rect(-9.5, 9.5, -25.5, -S), 96.5, 1, sq(-9.5, 9.5, -25.5, -S)),
    blk(rect(-9, 9, -34.5, -25.5), 39.5, 1, sq(-9, 9, -34.5, -25.5)),
    // the shaft, its corners canting back in four steps
    blk(rect(-S, S, -S, S), 80, 1, { ...sq(-S, S, -S, S), head: 0, spires: false }),
    blk(rect(-S, S, -S, S), 100, 2, { ...sq(-S, S, -S, S), head: 0, foot: 0, spires: false }, 80),
    blk(rect(-S, S, -S, S), 113, 3, { ...sq(-S, S, -S, S), head: 0, foot: 0, spires: false }, 100),
    blk(rect(-S, S, -S, S), 125.5, 4.5, { ...sq(-S, S, -S, S), foot: 0 }, 113),
    // the lantern, its pointed openings and its battlements
    blk(rect(-9, 9, -S, S), 152, 1.5, {
      ...sq(-9, 9, -S, S), foot: 2, head: 2, spires: false,
      arches: { n: { w: 7, sill: 131, apex: 148 }, s: { w: 7, sill: 131, apex: 148 }, e: { w: 5.5, sill: 134, apex: 148 }, w: { w: 5.5, sill: 134, apex: 148 } },
    }, 125.5),
  ]

  const baseOf = (P: Block, i: number) => {
    const a = P.ring[i], b = P.ring[(i + 1) % P.ring.length], n = outward(a, b)
    let h = Infinity
    for (let k = 1; k < 20; k++) {
      const t = k / 20
      h = Math.min(h, coverAt(blocks, [a[0] + (b[0] - a[0]) * t + n[0] * 0.6, a[1] + (b[1] - a[1]) * t + n[1] * 0.6], P))
    }
    return Math.max(P.z0 ?? 0, h)
  }
  const baseGrid = (part: Part, a: XY, b: XY, z0: number, z1: number) => {
    // the base: one dark slot per 4.2 m bay, two storeys tall, two rows
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor((L - 3) / 4.2)
    for (let k = 0; k < n; k++) {
      const s = (L - n * 4.2) / 2 + k * 4.2 + 1.5
      for (const [lo, hi] of [[3, 9.5], [11, 17.5]]) if (lo >= z0 + 0.5 && hi <= z1 - 1) onFace(part, a, b, [[s, lo], [s + 1.4, lo], [s + 1.4, hi], [s, hi]])
    }
  }

  for (const P of blocks) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.01) continue
      const z0 = baseOf(P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(P.wall, r, i, z0, P.z1)
      if (P.kind === 'base') { baseGrid(slot, a, b, z0, P.z1); continue }
      const n = outward(a, b)
      if (!P.W || (Math.abs(n[0]) > 0.01 && Math.abs(n[1]) > 0.01)) continue // canted corners stay plain stone
      const dir = Math.abs(n[0]) > 0.5 ? (n[0] > 0 ? 'e' : 'w') : n[1] > 0 ? 'n' : 's'
      const W = Math.abs(n[0]) > 0.5 ? P.W[1] : P.W[0]
      const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const arch = P.arches?.[dir]
      const at = (u: number, out: number): XY => [(a[0] + b[0]) / 2 + t[0] * u + n[0] * out, (a[1] + b[1]) / 2 + t[1] * u + n[1] * out]
      const fits = (u: number, w: number) => Math.abs(u) + w / 2 <= L / 2 - 0.4 && (!arch || Math.abs(u) - w / 2 > arch.w / 2 + 0.5)
      const own = P.z0 ?? 0
      const lo = z0 > own + 0.01 ? z0 + 1.2 : own + (P.foot ?? 0), hi = P.z1 - (P.head ?? 0)
      const { slots, piers } = ribs(W)
      if (hi > lo + 1) for (const u of slots) if (fits(u, SLOT)) onFace(slot, a, b, [[L / 2 + u - SLOT / 2, lo], [L / 2 + u + SLOT / 2, lo], [L / 2 + u + SLOT / 2, hi], [L / 2 + u - SLOT / 2, hi]], 0.04)
      for (const u of piers) {
        if (!fits(u, PIER)) continue
        const p0 = at(u - PIER / 2, 0), p1 = at(u + PIER / 2, 0), q0 = at(u - PIER / 2, PROUD), q1 = at(u + PIER / 2, PROUD)
        const N: V3 = [n[0], n[1], 0], T: V3 = [t[0], t[1], 0], zt = P.z1 + (P.head ? 0 : 0)
        quadN(stone, [q0[0], q0[1], z0], [q1[0], q1[1], z0], [q1[0], q1[1], zt], [q0[0], q0[1], zt], N)
        quadN(stone, [p0[0], p0[1], z0], [q0[0], q0[1], z0], [q0[0], q0[1], zt], [p0[0], p0[1], zt], [-T[0], -T[1], 0])
        quadN(stone, [q1[0], q1[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], zt], [q1[0], q1[1], zt], T)
        quadN(stone, [p0[0], p0[1], zt], [p1[0], p1[1], zt], [q1[0], q1[1], zt], [q0[0], q0[1], zt], [0, 0, 1])
        if (P.spires) { const m = at(u, PROUD / 2); pinnacle(stone, m[0], m[1], zt, 0.55, 4.5) }
      }
      if (arch) onFace(slot, a, b, lancet(L / 2, arch.w, arch.sill, arch.apex))
    }
    capRing(P.roof, r, P.z1)
  }

  // Pinnacles where the shaft's corners cant back, and at the lower blocks'
  // outer corners.
  for (const [z, c0] of [[80, 1], [100, 2], [113, 3], [125.5, 4.5]] as [number, number][])
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const d = S - c0 / 2 - 0.4
      pinnacle(stone, sx * d, sy * d, z, 0.65, 5)
    }
  for (const [x0, x1, y0, y1, z] of [[-9, 9, S, 24.8, 47.5], [S, 25.5, -9, 9, 62.5], [-25.5, -S, -9, 9, 62.5], [-9.5, 9.5, -25.5, -S, 96.5], [-9, 9, -34.5, -25.5, 39.5]] as number[][])
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) {
      if (Math.abs(x) < S - 0.1 && Math.abs(y) < S - 0.1) continue
      pinnacle(stone, x - Math.sign(x - (x0 + x1) / 2) * 1.1, y - Math.sign(y - (y0 + y1) / 2) * 1.1, z, 0.7, 5)
    }

  // The crown: battlements round the lantern's parapet, and a turret with a
  // pinnacle at each corner.
  const LX = 9, LY = S, TOP = 152, M = 1.2
  for (const [len, along] of [[2 * LX, 'x'], [2 * LY, 'y']] as [number, 'x' | 'y'][]) {
    const n = Math.floor((len - 6) / (2 * M)), start = -((2 * n - 1) * M) / 2
    for (let k = 0; k < n; k++) {
      const u = start + 2 * k * M
      for (const s of [-1, 1]) {
        if (along === 'x') block(stone, u, u + M, s > 0 ? LY - 0.8 : -LY, s > 0 ? LY : -LY + 0.8, TOP, TOP + 2)
        else block(stone, s > 0 ? LX - 0.8 : -LX, s > 0 ? LX : -LX + 0.8, u, u + M, TOP, TOP + 2)
      }
    }
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = sx > 0 ? LX - 2.8 : -LX, y0 = sy > 0 ? LY - 2.8 : -LY
    block(stone, x0, x0 + 2.8, y0, y0 + 2.8, TOP, 157)
    pinnacle(stone, x0 + 1.4, y0 + 1.4, 157, 1.4, 5)
  }

  // The main portal at the foot of the north-east bay, at the lawn's level
  // (~5 m above the model's base, from the lidar and the map's terrain).
  const pa: XY = [9, 24.8], pb: XY = [-9, 24.8]
  onFace(slot, pa, pb, lancet(9, 6.4, 5, 15), 0.1)
  onFace(door, pa, pb, lancet(9, 4.4, 5, 13.3), 0.16)

  const stoneLit: MaterialSpec = { ...finish('cathedral-limestone', 0xe4dccb), floodlight: (p: V3, n: V3) => (p[2] < 118 ? 0 : (p[2] < 126 ? 0.4 : 1) * (n[2] > 0.7 ? 0.3 : 1)) }
  return finishGlb('pit-cathedral-of-learning', 'Cathedral of Learning', [
    { part: stone, material: stoneLit },
    { part: slot, material: finish('cathedral-slot', 0x6c7178) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ], {
    bearing: 47.6,
    height: 162,
    replaces: ['way/30678664', 'way/841117936', 'way/841117937', 'way/841117938', 'way/841117939', 'way/841117940', 'way/841117941', 'way/841117942', 'way/841117943', 'way/841117944', 'way/841117945', 'way/841117946'],
  }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/pit-cathedral-of-learning.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
