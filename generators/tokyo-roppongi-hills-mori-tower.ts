/**
 * Roppongi Hills Mori Tower (六本木ヒルズ森タワー), Roppongi, Minato, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-roppongi-hills-mori-tower.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the kits in tokyo-metropolitan-government-building.ts and
 * tokyo-azabudai-hills-mori-jp-tower.ts.
 *
 * Completed 2003 (Kohn Pedersen Fox, Mori Building); 54 floors; roof 238 m
 * (OSM height 238; Wikipedia "Roppongi Hills": 238 m). The Mori Art Museum
 * and Tokyo City View fill the top floors; the open-air Sky Deck and the
 * helipad are on the roof.
 *
 * Plan (OSM way/153924771, the only OSM building for the tower; the podium
 * blocks around it are separate buildings and stay the map's, except
 * way/219676967, an unnamed building=yes 70% inside the tower's south-west
 * lobe, which is replaced too): a rounded
 * plan about 106 x 115 m. Drawn from the OSM outline itself, turned to
 * bearing 17, where it reads as four broad pale lobes on the diagonals
 * (NE, SE, SW, NW), overlapping in small steps at the north and south, and
 * two rounded glass bays bulging out between them on the east and west.
 *
 * From photos:
 * - the glass bays are wedges: wider at the top (about 50 m round the
 *   bulge) than at the foot (about 30 m), because the lobes' edges lean
 *   back as they rise; a pale edge line marks each overlap (Tokyo Tower
 *   views by 稲妻ノ歯鯨 and the "Day" view; Dick Thomas Johnson's from
 *   Shibuya Scramble Square);
 * - each glass bay's top edge sags in a crescent, about 6 m, under the
 *   Sky Deck's rail (same photos);
 * - the lobes are pale warm-grey stone and metal with horizontal window
 *   bands; their top ~13 m is solid, carrying the Mori logos (稲妻ノ歯鯨's
 *   west side, Rs1421's);
 * - on the roof: the helipad deck (raised a little over the pale Sky Deck
 *   rim so it reads at phone size) and two window-cleaning gondola cranes at
 *   the north and south ends, which give the top its spiky outline.
 * Colours (daylight, sampled): the lobes read neutral silver-grey, #b0b2b4
 * in sun (west side) to #787878-#878a88 under haze (from Tokyo Tower), and
 * their glass #828d9a; drawn as silver-grey piers and spandrels #cbced0
 * round grouped glass panels #a2aeb8 (`window`), one panel per outline
 * segment and three floors; the bays' glass a light sky-grey #9fb2c1
 * (`window-2`); edge lines, the Sky Deck's rim and bay floor lines pale.
 * Estimated: the wedge widths (from the photos' proportions), the crescent,
 * the crane and helipad sizes.
 *
 * Frame: built turned to bearing 17 (the bays' axis is model east-west).
 * Origin at 139.7292794, 35.6604557, the outline's centroid; y = 0 is the
 * ground (the map's terrain is flat to 0.5 m under the footprint).
 *
 * Photos (Wikimedia Commons):
 * - "Roppongi Hills from Tokyo Tower.jpg", 稲妻ノ歯鯨, CC BY-SA 4.0
 * - "Roppongi Hills from Tokyo Tower Day.jpg", CC BY-SA 3.0
 * - "Roppongi Hills Mori Tower from Tokyo Tower Day cropped.jpg", CC BY-SA 3.0
 * - "Roppongi Hills Mori Tower west side.jpg", 稲妻ノ歯鯨, CC BY-SA 4.0
 * - "Roppongi-Mori-Tower-01.jpg", Rs1421, CC BY-SA 3.0
 * - "Shibuya Scramble Square Roppongi Hills Mori Tower (49994897872).jpg"
 *   and "(49994142373).jpg", Dick Thomas Johnson, CC BY 2.0
 * - "Roppongi Hills and Tokyo Tower with dark stormy background.jpg", Syced, CC0
 * - "Tokyo Tower and Roppongi Hills Mori Tower seen from Hamamatsucho.jpg", Syced, CC0
 * No lidar (Japan). No look-only sources.
 * Doubts: the OSM outline is drawn as it is (not symmetrised), and as one
 * outline at every height, while the real lobes' edges also step back in
 * plan as the bays widen; the north and west sides are seen only obliquely.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { earcut, member, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'
import { quadN, centroid } from './tokyo-azabudai-hills-mori-jp-tower'

const HT = 238
const FL = HT / 54
const ROW = 3 * FL // a window row: three floors
const CROWN = 17 * ROW // the lobes' solid top band starts here (~225 m)

// OSM way/153924771 in the bearing-17 frame, clockwise as OSM gives it.
const OSM: XY[] = [[42.2, 14.5], [46.1, 12.6], [50.3, 7.3], [52.8, 0.5], [53.1, -6.8], [51.5, -13.3], [47.5, -18.4], [44.5, -21.3], [42.1, -23.7], [38.9, -26.1], [31.5, -35.2], [24.9, -42.6], [17.2, -48.7], [9.5, -53.6], [5.7, -57.4], [2.8, -53.5], [-0.8, -54.7], [-5.6, -55.7], [-11.5, -53.7], [-14.2, -54.8], [-20.9, -50.3], [-27.7, -44.7], [-33.5, -37.3], [-37.9, -29.6], [-41.0, -19.6], [-42.2, -15.6], [-46.6, -11.9], [-50.0, -7.6], [-52.8, 0.9], [-53.1, 9.9], [-49.3, 16.9], [-45.7, 19.8], [-38.7, 23.5], [-37.6, 24.1], [-33.2, 33.8], [-25.1, 42.9], [-17.3, 51.1], [-9.6, 54.9], [-2.2, 57.7], [-2.9, 53.6], [3.3, 54.6], [8.2, 54.3], [13.6, 51.6], [12.9, 54.0], [19.9, 50.8], [26.9, 44.6], [33.9, 37.5], [35.6, 34.3], [40.0, 23.4]]

type RP = { p: XY; s: number; nl: XY; nr: XY }
const nrm = (a: XY, b: XY): XY => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l] }
const u2 = (a: XY): XY => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }

/** The outline counter-clockwise, long sides split to `maxSeg`, with arc lengths and normals (creased where it turns > 35°). */
function buildRing(maxSeg: number): { pts: RP[]; total: number } {
  const ccw = [...OSM].reverse()
  const dense: { p: XY; orig: boolean }[] = []
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / maxSeg))
    for (let k = 0; k < n; k++) dense.push({ p: [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n], orig: k === 0 })
  }
  const N = dense.length
  let s = 0
  const pts: RP[] = []
  for (let i = 0; i < N; i++) {
    const a = dense[(i + N - 1) % N].p, p = dense[i].p, b = dense[(i + 1) % N].p
    const nl = nrm(a, p), nr = nrm(p, b)
    const turn = Math.acos(Math.max(-1, Math.min(1, nl[0] * nr[0] + nl[1] * nr[1])))
    const crease = dense[i].orig && turn > (35 * Math.PI) / 180
    const avg = u2([nl[0] + nr[0], nl[1] + nr[1]])
    if (i > 0) s += Math.hypot(p[0] - dense[i - 1].p[0], p[1] - dense[i - 1].p[1])
    pts.push({ p, s, nl: crease ? nl : avg, nr: crease ? nr : avg })
  }
  const total = s + Math.hypot(dense[0].p[0] - dense[N - 1].p[0], dense[0].p[1] - dense[N - 1].p[1])
  return { pts, total }
}

/** The ring with extra points inserted at arc lengths `cuts` (normals interpolated). */
function cutRing(R: { pts: RP[]; total: number }, cuts: number[]): RP[] {
  const T = R.total, cs = cuts.map((c) => ((c % T) + T) % T).sort((a, b) => a - b)
  const out: RP[] = []
  for (let i = 0; i < R.pts.length; i++) {
    const a = R.pts[i], b = R.pts[(i + 1) % R.pts.length], sb = i + 1 < R.pts.length ? b.s : T
    out.push(a)
    for (const c of cs) if (c > a.s + 0.05 && c < sb - 0.05) {
      const t = (c - a.s) / (sb - a.s)
      const n = u2([a.nr[0] + (b.nl[0] - a.nr[0]) * t, a.nr[1] + (b.nl[1] - a.nr[1]) * t])
      out.push({ p: [a.p[0] + (b.p[0] - a.p[0]) * t, a.p[1] + (b.p[1] - a.p[1]) * t], s: c, nl: n, nr: n })
    }
  }
  return out
}
function pointAt(R: { pts: RP[]; total: number }, s0: number): RP {
  const T = R.total, s = ((s0 % T) + T) % T
  for (let i = 0; i < R.pts.length; i++) {
    const a = R.pts[i], b = R.pts[(i + 1) % R.pts.length], sb = i + 1 < R.pts.length ? b.s : T
    if (s >= a.s && s <= sb) {
      const t = (s - a.s) / (sb - a.s || 1)
      const n = u2([a.nr[0] + (b.nl[0] - a.nr[0]) * t, a.nr[1] + (b.nl[1] - a.nr[1]) * t])
      return { p: [a.p[0] + (b.p[0] - a.p[0]) * t, a.p[1] + (b.p[1] - a.p[1]) * t], s, nl: n, nr: n }
    }
  }
  return R.pts[0]
}
const P3 = (q: RP, z: number, n: XY, out = 0): V3 => [q.p[0] + n[0] * out, q.p[1] + n[1] * out, z]
const N3 = (n: XY): V3 => [n[0], n[1], 0]

type Lod = { detail: boolean; maxSeg: number; rowFloors: number }
const LOW: Lod = { detail: false, maxSeg: 7, rowFloors: 3 }
const DETAIL: Lod = { detail: true, maxSeg: 3.5, rowFloors: 2 }

function build(L: Lod): Layer[] {
  const stone = new Part(), win = new Part(), bayGlass = new Part(), trim = new Part(), roof = new Part(), metal = new Part()
  const R = buildRing(L.maxSeg), T = R.total
  // the bays' centres: the outline's easternmost and westernmost bulges
  const near = (x: number, y: number) => R.pts.reduce((b, q) => (Math.hypot(q.p[0] - x, q.p[1] - y) < Math.hypot(b.p[0] - x, b.p[1] - y) ? q : b)).s
  const bays = [near(53, -3), near(-53, 5)]
  const hw = (z: number) => 15 + (11 * z) / HT // the wedge's half-width along the outline
  const dist = (s: number, c: number) => { const d = Math.abs(s - c) % T; return Math.min(d, T - d) }
  const inBay = (s: number, z: number) => bays.some((c) => dist(s, c) < hw(z))
  const dip = (s: number) => { for (const c of bays) { const d = dist(s, c), h = hw(HT); if (d < h) return 6 * (1 - (d / h) ** 2) } return 0 }
  const cutsAt = (z: number) => bays.flatMap((c) => [c - hw(z), c + hw(z)])

  // walls, band by band (a window row each), split where the bays' wedges cross
  const levels: number[] = []
  for (let z = 0; z < CROWN - 0.1; z += ROW) levels.push(z)
  levels.push(CROWN, HT)
  for (let k = 0; k < levels.length - 1; k++) {
    const z0 = levels[k], z1 = levels[k + 1], zm = (z0 + z1) / 2, last = k === levels.length - 2
    const pts = cutRing(R, cutsAt(zm))
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], sm = a.s + (((b.s - a.s + T) % T) / 2)
      const bay = inBay(sm, zm)
      const za = last ? HT - dip(a.s) : z1, zb = last ? HT - dip(b.s) : z1
      quadN(bay ? bayGlass : stone, P3(a, z0, a.nr), P3(b, z0, b.nl), P3(b, zb, b.nl), P3(a, za, a.nr), N3(a.nr), N3(b.nl), N3(b.nl), N3(a.nr))
      if (bay || last) continue
      // the lobes' windows: one glass panel per outline segment and row of three floors (two in the
      // detail), thin pale piers and spandrels between, stopped short of the lobes' edges
      const rowH = L.rowFloors * FL
      const len = Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1])
      if (len < 2) continue
      const edge = (q: RP) => bays.some((c) => Math.abs(dist(q.s, c) - hw(zm)) < 1.5)
      const pier = 0.35 / len
      const ta = edge(a) ? 1.5 / Math.max(1.5, len) : pier, tb = edge(b) ? 1 - 1.5 / Math.max(1.5, len) : 1 - pier
      if (tb - ta < 0.2) continue
      const at = (t: number): XY => [a.p[0] + (b.p[0] - a.p[0]) * t, a.p[1] + (b.p[1] - a.p[1]) * t]
      const nn = nrm(a.p, b.p)
      for (let zz = z0; zz < z1 - 0.1; zz += rowH) {
        const w0 = zz + (k === 0 && zz === z0 ? 0.6 : 0.8), w1 = Math.min(z1, zz + rowH) - 0.25
        const A = at(ta), B = at(tb)
        quadN(win, [A[0] + nn[0] * 0.07, A[1] + nn[1] * 0.07, w0], [B[0] + nn[0] * 0.07, B[1] + nn[1] * 0.07, w0], [B[0] + nn[0] * 0.07, B[1] + nn[1] * 0.07, w1], [A[0] + nn[0] * 0.07, A[1] + nn[1] * 0.07, w1], N3(nn), N3(nn), N3(nn), N3(nn))
      }
    }
    // the bays' floor lines, pale, every row
    if (!last && k > 0) for (const c of bays) {
      const h = hw(z0), n = Math.ceil((2 * h) / (L.maxSeg * 0.8))
      for (let j = 0; j < n; j++) {
        const A = pointAt(R, c - h + (2 * h * j) / n), B = pointAt(R, c - h + (2 * h * (j + 1)) / n)
        quadN(trim, P3(A, z0 - 0.3, A.nr, 0.08), P3(B, z0 - 0.3, B.nl, 0.08), P3(B, z0 + 0.3, B.nl, 0.08), P3(A, z0 + 0.3, A.nr, 0.08), N3(A.nr), N3(B.nl), N3(B.nl), N3(A.nr))
      }
    }
  }
  // the overlap lines: pale strips along the wedges' leaning edges, foot to crown
  const eh = L.detail ? 0.6 : 0.9
  for (const c of bays) for (const side of [-1, 1]) {
    const zs = [0, 40, 80, 120, 160, 200, HT - 0.3]
    for (let k = 0; k < zs.length - 1; k++) {
      const s0 = c + side * hw(zs[k]), s1 = c + side * hw(zs[k + 1])
      const a0 = pointAt(R, s0 - eh), b0 = pointAt(R, s0 + eh), a1 = pointAt(R, s1 - eh), b1 = pointAt(R, s1 + eh)
      const out = L.detail ? 0.5 : 0.14
      quadN(trim, P3(a0, zs[k], a0.nr, out), P3(b0, zs[k], b0.nr, out), P3(b1, zs[k + 1], b1.nr, out), P3(a1, zs[k + 1], a1.nr, out), N3(a0.nr), N3(b0.nr), N3(b1.nr), N3(a1.nr))
      if (L.detail) {
        // the lobe's edge as a real step: its side face
        const e = side > 0 ? b0 : a0, e1 = side > 0 ? b1 : a1
        const sn: XY = side > 0 ? [-(e.nr[1]), e.nr[0]] : [e.nr[1], -e.nr[0]]
        quadN(trim, P3(e, zs[k], e.nr, 0), P3(e, zs[k], e.nr, out), P3(e1, zs[k + 1], e1.nr, out), P3(e1, zs[k + 1], e1.nr, 0), N3(sn), N3(sn), N3(sn), N3(sn))
      }
    }
  }
  // the roof: the parapet's inner face falls to the Sky Deck, 7 m below the lobes' top
  {
    const pts = cutRing(R, cutsAt(HT))
    const c = centroid(pts.map((q) => q.p)), k = 0.9, zIn = HT - 8
    const inner = pts.map((q) => [c[0] + (q.p[0] - c[0]) * k, c[1] + (q.p[1] - c[1]) * k] as XY)
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length
      const a: V3 = [pts[i].p[0], pts[i].p[1], HT - dip(pts[i].s)], b: V3 = [pts[j].p[0], pts[j].p[1], HT - dip(pts[j].s)]
      trim.quad(a, b, [inner[j][0], inner[j][1], zIn], [inner[i][0], inner[i][1], zIn])
    }
    for (const [a, b, cc] of earcut(inner)) roof.tri([inner[a][0], inner[a][1], zIn], [inner[b][0], inner[b][1], zIn], [inner[cc][0], inner[cc][1], zIn])
    // the deck's glass rail along the bays' crescents shows as a pale line: the rim's top edge
    // the helipad: a raised deck in the middle
    const hp: XY[] = [[-20, -20], [20, -20], [20, 20], [-20, 20]]
    const z0 = zIn, z1 = HT + 0.8
    for (let i = 0; i < 4; i++) { const a = hp[i], b = hp[(i + 1) % 4]; roof.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - 1], [a[0], a[1], z1 - 1]); trim.quad([a[0], a[1], z1 - 1], [b[0], b[1], z1 - 1], [b[0], b[1], z1], [a[0], a[1], z1]) }
    for (const [a, b, cc] of earcut(hp)) trim.tri([hp[a][0], hp[a][1], z1], [hp[b][0], hp[b][1], z1], [hp[cc][0], hp[cc][1], z1])
    // its H, in the deck's grey (bold enough for a phone)
    for (const [x0, y0, x1, y1] of [[-7, -9, -4, 9], [4, -9, 7, 9], [-4, -1.5, 4, 1.5]]) roof.quad([x0, y0, z1 + 0.05], [x1, y0, z1 + 0.05], [x1, y1, z1 + 0.05], [x0, y1, z1 + 0.05])
    // the gondola cranes at the north and south ends: a mast, a boom and its stays
    for (const sy of [-1, 1]) {
      const by = sy * 36, top = HT + 13, r = L.detail ? 0.55 : 1.0
      const base: V3[] = [[-5, by - 3 * sy, zIn], [5, by - 3 * sy, zIn], [-5, by + 3 * sy, zIn], [5, by + 3 * sy, zIn]]
      const apex: V3 = [0, by, top]
      for (const q of base) member(metal, q, apex, r, 4)
      member(metal, [-9, by + 4 * sy, top - 1], [9, by + 4 * sy, top - 1], r, 4)
      member(metal, [0, by - 6 * sy, top - 2], [0, by + 10 * sy, top + 1], r, 4)
      if (L.detail) for (const x of [-9, 9]) member(metal, apex, [x, by + 4 * sy, top - 1], 0.25, 4)
      // its machine house
      const hx = 4, hy = 3, z1h = zIn + 4
      const h: XY[] = [[-hx, by - hy], [hx, by - hy], [hx, by + hy], [-hx, by + hy]]
      for (let i = 0; i < 4; i++) { const a = h[i], b = h[(i + 1) % 4]; metal.quad([a[0], a[1], zIn], [b[0], b[1], zIn], [b[0], b[1], z1h], [a[0], a[1], z1h]) }
      metal.quad([h[0][0], h[0][1], z1h], [h[1][0], h[1][1], z1h], [h[2][0], h[2][1], z1h], [h[3][0], h[3][1], z1h])
    }
  }
  return [
    { part: stone, material: finish('mori-stone', 0xcbced0) },
    { part: win, material: { ...PALETTE.window, color: 0xa2aeb8 } },
    { part: bayGlass, material: windowVariant(2, 0x9fb2c1) },
    { part: trim, material: finish('mori-trim', 0xf0eee8) },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('mori-crane', 0x8d949b) },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 17, elevation: 0, height: HT }
  await writeModel('tokyo-roppongi-hills-mori-tower', 'tokyo-roppongi-hills-mori-tower.glb', 'Roppongi Hills Mori Tower', build(LOW), meta, 6500, 256_000)
  await writeModel('tokyo-roppongi-hills-mori-tower', 'tokyo-roppongi-hills-mori-tower.detail.glb', 'Roppongi Hills Mori Tower', build(DETAIL), meta, 40_000, 1536 * 1024)
}
