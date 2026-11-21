/**
 * Government House (Hökumət Evi), Azadliq Square, Baku: procedural, CC0-1.0.
 *   bun generators/baku-government-house.ts   (writes the low and the detail model)
 *
 * The Stalin-era seat of government (L. Rudnev, I. Tkachenko, V. Munts,
 * 1936-1952), a U open to the square and the sea. Identity, in order: the
 * four towers at the corners, the two at the arms' ends the tallest, each
 * stacked with tiers of tall round-arched loggias on columns and crowned
 * with an arcaded frieze, a spiky crenellation and corner pinnacles (and a
 * small green tent roof); the long ten-storey body between, its two-storey
 * arcaded loggia over a rusticated base, rows of windows above, a row of
 * small oculi under the cornice and the same spiky crenellation; the
 * sandy-beige stone.
 *
 * Map frame: x along the main body (compass 66.4, east-north-east), y to
 * the rear (north-north-west), z up, metres; placed at bearing 336.4. The
 * arms and their towers run towards -y, to the square. Origin: the area
 * centroid of OSM way/152809510, at 49.85264, 40.373843.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): way/152809510, building=government,
 *   amenity=townhall, levels 10: a U 104 m across and 67 m deep, the four
 *   corner towers as jogs in the outline (the arms' end towers 21 x 20 m,
 *   the rear ones 19 x 18.5 m), the body 15 m deep.
 * - Published: ru Wikipedia "Дом правительства (Баку)": ten floors; built
 *   1936-1952 to L. V. Rudnev, I. V. Tkachenko and V. O. Munts; three tiers
 *   of arches added to the facades for national character; colonnades
 *   after the Shirvanshahs' palace.
 * - Photos (Wikimedia Commons, evidence):
 *   p1 Aykhan Zayedzadeh, CC BY-SA 4.0, "Hökumət Evi (2026).jpg": the rear
 *      (north-north-west) front from a tower: the body, its loggia and base,
 *      the rear towers, the end towers behind with their green tent roofs
 *      https://commons.wikimedia.org/wiki/File:H%C3%B6kum%C9%99t_Evi_(2026).jpg
 *   p2 Marco Monelli, CC BY-SA 3.0, "Governement house - panoramio.jpg":
 *      from the boulevard: the towers' loggia tiers and crowns
 *      https://commons.wikimedia.org/wiki/File:Governement_house_-_panoramio.jpg
 *   p3 Nemoralis, CC BY-SA 4.0, "Hilton Hotel and Government House,
 *      Baku.jpg": from the south-west along the boulevard
 *      https://commons.wikimedia.org/wiki/File:Hilton_Hotel_and_Government_House,_Baku.jpg
 *   p4 Stomatoloq Fərid Zeynalov, CC BY-SA 3.0, "Azadlıq meydanı -
 *      panoramio.jpg": from the square: an end tower against the body,
 *      the ground arcade, colours in sun
 *      https://commons.wikimedia.org/wiki/File:Azadl%C4%B1q_meydan%C4%B1_-_panoramio.jpg
 *   p5 ALDOR46, CC0, "Дом правительства Азербайджана в Баку, 1971.jpg":
 *      into the U from the square: the two end towers and the body between
 *      https://commons.wikimedia.org/wiki/File:%D0%94%D0%BE%D0%BC_%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0_%D0%90%D0%B7%D0%B5%D1%80%D0%B1%D0%B0%D0%B9%D0%B4%D0%B6%D0%B0%D0%BD%D0%B0_%D0%B2_%D0%91%D0%B0%D0%BA%D1%83,_1971.jpg
 * - Look-only: none.
 *
 * Numbers
 * - Plan: measured from OSM (rotated to the frame above).
 * - Heights estimated: ten floors give the body about 32 m to the top of
 *   its crenellation; p1 and p4 put the rear towers' crowns 1.27 times and
 *   the end towers' 1.36 times as high (40.5 and 43.5), pinnacles 3 m more.
 *   The base 8.5 (two storeys), the loggia 8.5 to 16.5, five window rows to
 *   27.2, the oculi row and cornice to 30.3 (p1).
 * - The end towers' tiers (p2, p4): a ground arcade of three arches to 9,
 *   a band of windows, two loggia tiers of a wide central arch between two
 *   narrow ones (17.5-27 and 28.5-38), the arcaded frieze and crown.
 * - Colours: the stone #e3d6c7 (p4, sun), #ccb394 and #bead96 (p1, haze):
 *   drawn #d9c6a2; the tent roofs' green #265e62 (p1): drawn #3f7a74.
 *
 * Doubts
 * - No height is published; all heights are from photo proportions.
 * - The loggia arcades are drawn on the rear front, the court front and as
 *   a ground arcade on the arms' outer fronts, as the photos show them;
 *   the court's own faces are only seen at a distance (p5).
 * - Terrain: Mapterhorn here is z12 only and shows the building itself as
 *   a hill about 9 m high over its west half; the square and the
 *   boulevard round it are flat in every photo, so the model is kept flat
 *   (docs/evidence.md, "Terrain that is wrong for the site"). The ground
 *   arcades' sills stand 0.8 m up, so the map's filled terrain leaves them
 *   clear; `terrain.ts check --zoom 12` then prints ok.
 * - The crenellation's spikes and the paired round columns of the loggias
 *   are in the detail model; the low one has a plain crown band and piers.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { flat, lathe, type XY } from './sf-de-young'
import { wallLoop, polyPath, writeModel, type Hole } from './baku-maiden-tower'

type Rect = [number, number, number, number] // x0, y0, x1, y1
type Face = { A: XY; u: XY; n: XY; L: number }
const faceOf = (A: XY, B: XY): Face => {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  return { A, u, n: [u[1], -u[0]], L }
}
const on = (f: Face, s: number, w: number, z: number): V3 => [f.A[0] + f.u[0] * s + f.n[0] * w, f.A[1] + f.u[1] * s + f.n[1] * w, z]
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { p.tri(a, b, c, undefined, undefined, undefined, [n, n, n]); p.tri(a, c, d, undefined, undefined, undefined, [n, n, n]) }

/** A semicircular arch's curve from (a1, zs) over the crown to (a0, zs). */
const roundArch = (a0: number, a1: number, zs: number, seg: number): XY[] => {
  const c = (a0 + a1) / 2, r = (a1 - a0) / 2
  return Array.from({ length: seg + 1 }, (_, i) => { const t = (Math.PI * i) / seg; return [c + r * Math.cos(t), zs + r * Math.sin(t)] as XY })
}

type Bay = { w: number; open: number; zs: number }
/**
 * An arcade slab on face f from s0, `t` thick behind the face line, z0..top,
 * with one round-arched opening per bay (bays of their own widths). Piers,
 * spandrels, soffits and sills are built directly; the back face is only
 * drawn when `back`.
 */
function arcade(wall: Part, f: Face, s0: number, bays: Bay[], z0: number, top: number, t: number, seg: number, back = false, base = z0) {
  const N: V3 = [f.n[0], f.n[1], 0], B: V3 = [-f.n[0], -f.n[1], 0]
  const P = (s: number, w: number, z: number) => on(f, s, w, z)
  let e0 = s0
  for (const b of bays) {
    const e1 = e0 + b.w, c = (e0 + e1) / 2, a0 = c - b.open / 2, a1 = c + b.open / 2
    const arch = roundArch(a0, a1, b.zs, seg)
    for (const [w, n] of (back ? [[0, N], [-t, B]] : [[0, N]]) as Array<[number, V3]>) {
      quad(wall, P(e0, w, base), P(a0, w, base), P(a0, w, b.zs), P(e0, w, b.zs), n)
      quad(wall, P(a1, w, base), P(e1, w, base), P(e1, w, b.zs), P(a1, w, b.zs), n)
      if (z0 > base + 0.01) quad(wall, P(a0, w, base), P(a1, w, base), P(a1, w, z0), P(a0, w, z0), n)
      const m = arch.length - 1, topAt = (k: number) => e1 + ((e0 - e1) * k) / m
      wall.tri(P(e1, w, b.zs), P(e1, w, top), P(a1, w, b.zs), undefined, undefined, undefined, [n, n, n])
      wall.tri(P(e0, w, b.zs), P(a0, w, b.zs), P(e0, w, top), undefined, undefined, undefined, [n, n, n])
      for (let k = 0; k < m; k++) quad(wall, P(arch[k][0], w, arch[k][1]), P(arch[k + 1][0], w, arch[k + 1][1]), P(topAt(k + 1), w, top), P(topAt(k), w, top), n)
    }
    const loop: XY[] = [[a1, z0], ...arch, [a0, z0]]
    for (let k = 0; k < loop.length - 1; k++) {
      const [sa, za] = loop[k], [sb, zb] = loop[k + 1]
      const ds = sb - sa, dz = zb - za, l = Math.hypot(ds, dz) || 1
      const n: V3 = [f.u[0] * (-dz / l), f.u[1] * (-dz / l), ds / l]
      quad(wall, P(sa, 0, za), P(sb, 0, zb), P(sb, -t, zb), P(sa, -t, za), n)
    }
    quad(wall, P(a0, 0, z0), P(a1, 0, z0), P(a1, -t, z0), P(a0, -t, z0), [0, 0, 1])
    e0 = e1
  }
}

/** Evenly spaced equal bays filling a length. */
const evenBays = (L: number, n: number, openFrac: number, zs: (w: number) => number): Bay[] =>
  Array.from({ length: n }, () => { const w = L / n; return { w, open: w * openFrac, zs: zs(w) } })

function build(detail: boolean) {
  const stone = new Part(), shade = new Part(), win = new Part(), roof = new Part(), green = new Part(), trim = new Part()
  const SEG = detail ? 6 : 3

  // the blocks, each a box of walls with its loggias cut in as real recesses
  const BODY_H = 30.3, CREN = 32.0
  type Block = { r: Rect; h: number; tower?: 'end' | 'rear' }
  const blocks: Block[] = [
    { r: [-33.3, 8.9, 31.8, 23.9], h: BODY_H },
    { r: [-49.0, -18.2, -34.2, 9.46], h: BODY_H },
    { r: [32.6, -19.4, 48.2, 8.9], h: BODY_H },
    { r: [-52.5, 9.46, -33.3, 27.9], h: 38.0, tower: 'rear' },
    { r: [31.8, 8.9, 51.2, 27.6], h: 38.0, tower: 'rear' },
    { r: [-52.6, -38.3, -31.4, -18.2], h: 41.0, tower: 'end' },
    { r: [28.9, -39.3, 51.3, -19.4], h: 41.0, tower: 'end' },
  ]
  // loggias: [block, edge (0 south, 1 east, 2 north, 3 west), z0, z1, bays]
  type Loggia = { b: number; e: number; z0: number; z1: number; bays: (L: number) => Bay[]; s0?: number; s1?: number }
  const loggias: Loggia[] = [
    // the body: the rear front and the court front, a two-storey loggia over the base
    { b: 0, e: 2, z0: 8.5, z1: 16.5, s0: 1.0, s1: 64.1, bays: (L) => evenBays(L, 11, 0.62, (w) => 16.5 - 1.0 - (w * 0.62) / 2) },
    { b: 0, e: 0, z0: 8.5, z1: 16.5, s0: 0.5, s1: 64.6, bays: (L) => evenBays(L, 11, 0.62, (w) => 16.5 - 1.0 - (w * 0.62) / 2) },
    // the arms' outer fronts: a ground arcade
    { b: 1, e: 3, z0: 0.0, z1: 8.0, s0: 0.6, s1: 27.0, bays: (L) => evenBays(L, 5, 0.66, (w) => 8.0 - 0.8 - (w * 0.66) / 2) },
    { b: 2, e: 1, z0: 0.0, z1: 8.0, s0: 0.6, s1: 27.7, bays: (L) => evenBays(L, 5, 0.66, (w) => 8.0 - 0.8 - (w * 0.66) / 2) },
  ]
  const triple = (L: number, z0: number, z1: number): Bay[] => {
    const wc = L * 0.42, ws = (L - wc) / 2
    return [{ w: ws, open: ws * 0.6, zs: z1 - 1.6 - ws * 0.3 }, { w: wc, open: wc * 0.62, zs: z1 - 1.0 - wc * 0.31 }, { w: ws, open: ws * 0.6, zs: z1 - 1.6 - ws * 0.3 }].map((b) => ({ ...b, zs: Math.max(b.zs, z0 + 2.5) }))
  }
  // the end towers: three faces (front, outer, court), a ground arcade and two loggia tiers
  for (const [b, faces] of [[5, [0, 3, 1]], [6, [0, 1, 3]]] as Array<[number, number[]]>) {
    for (const e of faces) {
      loggias.push({ b, e, z0: 0.0, z1: 9.0, s0: 1.4, bays: (L) => triple(L, 0, 9.0) })
      loggias.push({ b, e, z0: 17.5, z1: 27.0, s0: 1.4, bays: (L) => triple(L, 17.5, 27.0) })
      if (detail || e === 0) loggias.push({ b, e, z0: 28.5, z1: 37.5, s0: 1.4, bays: (L) => triple(L, 28.5, 37.5) })
    }
  }
  // the rear towers: rear and outer faces, two loggia tiers
  for (const [b, faces] of [[3, [2, 3]], [4, [2, 1]]] as Array<[number, number[]]>) {
    for (const e of faces) {
      loggias.push({ b, e, z0: 8.5, z1: 16.5, s0: 1.4, bays: (L) => triple(L, 8.5, 16.5) })
      loggias.push({ b, e, z0: 24.5, z1: 34.0, s0: 1.4, bays: (L) => triple(L, 24.5, 34.0) })
    }
  }

  blocks.forEach((blk, bi) => {
    const [x0, y0, x1, y1] = blk.r
    const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    const path = polyPath(ring) // edges 0 south, 1 east, 2 north, 3 west
    const holes: Hole[] = []
    const myL = loggias.filter((l) => l.b === bi)
    for (const l of myL) {
      const a = path[2 * l.e], bb = path[2 * l.e + 1], L = bb.s - a.s
      const s0 = l.s0 ?? 1.4, s1 = l.s1 ?? L - (l.s0 ?? 1.4)
      const sill = l.z0 + (l.z0 === 0 ? 0.8 : 0.3) // ground arcades stand on a plinth clear of the terrain
      holes.push({ s0: a.s + s0, s1: a.s + s1, z0: sill, z1: l.z1, depth: 2.6, part: shade, reveal: stone })
      const f = faceOf(ring[l.e], ring[(l.e + 1) % 4])
      arcade(stone, f, s0, l.bays(s1 - s0), sill, l.z1, 0.7, SEG, false, sill)
      if (detail) {
        // paired round columns before each pier, with capitals and bases
        let e0 = s0
        const bays = l.bays(s1 - s0)
        for (let k = 0; k <= bays.length; k++) {
          const zs = Math.min(bays[Math.max(0, k - 1)].zs, bays[Math.min(bays.length - 1, k)].zs)
          for (const off of k === 0 ? [0.45] : k === bays.length ? [-0.45] : [-0.3, 0.3]) {
            const c = on(f, e0 + off, 0.3, 0)
            lathe(stone, [[0.2, l.z0 + (l.z0 === 0 ? 0.8 : 0.3)], [0.2, zs - 0.4], [0.32, zs - 0.12], [0.32, zs], [0, zs]], 6, [c[0], c[1]], 0, false)
          }
          if (k < bays.length) e0 += bays[k].w
        }
      }
    }
    // windows: the base, five storeys above the loggia, grouped two and three storeys high
    const rows: Array<[number, number]> = blk.tower === 'end'
      ? [[10.2, 13.0], [13.8, 16.6]]
      : blk.tower === 'rear' ? [[1.4, 6.8], [17.4, 23.4], [35.0, 36.8]] : [[1.4, 6.8], [17.2, 21.8], [22.6, 27.2]]
    const winHoles: Hole[] = []
    for (let e = 0; e < 4; e++) {
      const a = path[2 * e], bb = path[2 * e + 1], L = bb.s - a.s
      const f = faceOf(ring[e], ring[(e + 1) % 4])
      const step = blk.tower ? 3.4 : 3.6, w = blk.tower ? 1.4 : 1.6
      const m = Math.floor((L - 2) / step)
      for (const [z0, z1] of rows) {
        // skip the zones a loggia takes, and faces hidden inside the U's joins
        const busy = myL.some((l) => l.e === e && !(z1 <= l.z0 || z0 >= l.z1))
        if (busy) continue
        for (let i = 0; i < m; i++) {
          const s = (L - (m - 1) * step) / 2 + i * step
          const p = on(f, s, 0.5, 0)
          // inside another block? then the face is hidden here
          const inside = blocks.some((o, oi) => oi !== bi && p[0] > o.r[0] && p[0] < o.r[2] && p[1] > o.r[1] && p[1] < o.r[3])
          if (inside) continue
          if (detail) winHoles.push({ s0: a.s + s - w / 2, s1: a.s + s + w / 2, z0, z1, depth: 0.35, part: win })
          else quad(win, on(f, s - w / 2, 0.04, z0), on(f, s + w / 2, 0.04, z0), on(f, s + w / 2, 0.04, z1), on(f, s - w / 2, 0.04, z1), [f.n[0], f.n[1], 0])
        }
      }
    }
    const H = blk.h
    const prof: Array<[number, number]> = [[0, 0], [0, H - 3.2], [0.25, H - 3.2], [0.25, H - 2.9], [0, H - 2.9], [0, H - 0.8], [0.5, H - 0.6], [0.5, H], [-0.45, H], [-0.45, H - 0.5]]
    wallLoop(stone, path, prof, [...holes, ...winHoles])
    flat(roof, [[x0 + 0.45, y0 + 0.45], [x1 - 0.45, y0 + 0.45], [x1 - 0.45, y1 - 0.45], [x0 + 0.45, y1 - 0.45]], H - 0.5)

    // the crenellation: a band of spiky merlons round the top (solid band in the low model)
    const top = blk.tower ? H + 2.5 : CREN
    for (let e = 0; e < 4; e++) {
      const f = faceOf(ring[e], ring[(e + 1) % 4])
      const L = f.L, base = H
      if (!detail) {
        quad(trim, on(f, 0, 0.1, base), on(f, L, 0.1, base), on(f, L, 0.1, base + (top - base) * 0.55), on(f, 0, 0.1, base + (top - base) * 0.55), [f.n[0], f.n[1], 0])
        quad(trim, on(f, 0, 0.1, base + (top - base) * 0.55), on(f, L, 0.1, base + (top - base) * 0.55), on(f, L, -0.3, base + (top - base) * 0.55), on(f, 0, -0.3, base + (top - base) * 0.55), [0, 0, 1])
      } else {
        const n = Math.max(2, Math.round(L / 1.8)), d = L / n
        for (let i = 0; i < n; i++) {
          const c = (i + 0.5) * d, hw = d * 0.28
          // a merlon: a short square post with a pointed top
          const zb = base, zm = base + (top - base) * 0.5
          const A = on(f, c - hw, 0.1, zb), B = on(f, c + hw, 0.1, zb), C = on(f, c + hw, -0.35, zb), D = on(f, c - hw, -0.35, zb)
          const up = (q: V3, z: number): V3 => [q[0], q[1], z]
          quad(trim, A, B, up(B, zm), up(A, zm), [f.n[0], f.n[1], 0])
          quad(trim, B, C, up(C, zm), up(B, zm), [f.u[0], f.u[1], 0])
          quad(trim, D, A, up(A, zm), up(D, zm), [-f.u[0], -f.u[1], 0])
          const tip = on(f, c, -0.12, top)
          for (const [p, q] of [[up(A, zm), up(B, zm)], [up(B, zm), up(C, zm)], [up(C, zm), up(D, zm)], [up(D, zm), up(A, zm)]] as Array<[V3, V3]>) {
            const u: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v: V3 = [tip[0] - p[0], tip[1] - p[1], tip[2] - p[2]]
            const nn: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
            trim.tri(p, q, tip, undefined, undefined, undefined, [nn, nn, nn])
          }
        }
      }
    }
    if (blk.tower) {
      // corner pinnacles, and a small green tent roof on the end towers
      const corners: XY[] = [[x0 + 0.5, y0 + 0.5], [x1 - 0.5, y0 + 0.5], [x1 - 0.5, y1 - 0.5], [x0 + 0.5, y1 - 0.5]]
      const mids: XY[] = detail ? [[(x0 + x1) / 2, y0 + 0.5], [(x0 + x1) / 2, y1 - 0.5], [x0 + 0.5, (y0 + y1) / 2], [x1 - 0.5, (y0 + y1) / 2]] : []
      for (const c of [...corners, ...mids]) {
        lathe(trim, detail ? [[0.55, H], [0.55, H + 2.6], [0.4, H + 2.8], [0.08, H + 5.4], [0, H + 5.6]] : [[0.55, H], [0.55, H + 2.7], [0, H + 5.6]], detail ? 8 : 6, c, 0, false)
      }
      if (blk.tower === 'end') {
        const c: XY = [(x0 + x1) / 2 + (x0 < 0 ? 4 : -4), (y0 + y1) / 2]
        lathe(green, [[3.2, H - 0.5], [3.2, H + 0.3], [0, H + 3.6]], detail ? 8 : 6, c, Math.PI / 8, false)
      }
    }
  })
  // the main entrance porch in the court, on the body's court front
  {
    const f = faceOf([-33.3, 8.9], [31.8, 8.9])
    const s = f.L / 2
    quad(win, on(f, s - 2.2, 0.06, 0.2), on(f, s + 2.2, 0.06, 0.2), on(f, s + 2.2, 0.06, 5.0), on(f, s - 2.2, 0.06, 5.0), [0, -1, 0])
  }
  return { stone, shade, win, roof, green, trim }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.85)
    return [
      { part: p.stone, material: { ...finish('govhouse-stone', 0xd9c6a2), floodlight: lit } },
      { part: p.trim, material: { ...finish('govhouse-crown', 0xe4d4b2), floodlight: () => 0.9 } },
      { part: p.shade, material: { ...finish('govhouse-loggia', 0xa8957a) } },
      { part: p.win, material: PALETTE.window },
      { part: p.roof, material: { ...finish('govhouse-roof', 0xb0a68f) } },
      { part: p.green, material: { ...finish('govhouse-tent', 0x3f7a74, 0.6) } },
    ]
  }
  const meta = { bearing: 336.4, osm: 'way/152809510', height: 46.6 }
  await writeModel('baku-government-house.glb', 'Government House', make(false), meta, 6500, 250 * 1024)
  await writeModel('baku-government-house.detail.glb', 'Government House', make(true), meta, 40000, 1536 * 1024)
}
