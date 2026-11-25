/**
 * Sydney Town Hall, George Street, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-town-hall.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 5.1
 * (OSM's outline way/104948253 runs at 95.1, so the frame's x lies along
 * it). Origin at the outline's area centroid (151.2061677, -33.8732087);
 * y = 0 at street level on George Street.
 *
 * Victorian Second Empire in Sydney "yellowblock" sandstone, by J. H.
 * Willson (1868-1880) with the Centennial Hall behind (1884-1889). The
 * George Street (east) front has the two-storey vestibule porch, with its
 * pediment, under the clock tower (1873, clock 1884), and mansard pavilions
 * at its corners; the great hall behind has a slate roof with dormers.
 *
 * Published: the clock tower rises 55 m above George Street (City of
 * Sydney; NSW State Heritage Register item 5051902). Wikipedia "Sydney
 * Town Hall": mansard roofs after the Hôtel de Ville; slate on pitched
 * roofs, membrane on flat ones; the vestibule's oval glass dome (roofed
 * over since 1992, so not drawn).
 *
 * OSM (turned frame): outline x -47.8..49.3, y -27.9..28.2; the porch
 * projects from x 41.5 to 49.2 between y -10.5 and 7.1; the tower's parts
 * way/1577336301 (0-33 m, 8.7 x 9.4), way/1577336299 (33-40 m, 6.3 m
 * square) and way/1577336300 (the lantern dome, 40-55 m), centred at
 * (37, -1.4). The model's blocks: the front range x 11.4..41.5 with
 * corner pavilions (NE and SE), the great hall x -25.5..11.4, and the
 * western range x -47.5..-25.5, simplified from the outline's steps.
 *
 * Heights from photos: h4 (the tower from the tram stop, telephoto) scaled
 * by the 9.4 m tower width and hung from the published 55 m: clock stage
 * 33-40 (OSM's part), clock centres 37, pedimented top 41.5; lantern
 * rotunda 42.4-48 on eight columns (3.4 m across, 0.41 of the clock
 * stage's width in h4), its bell dome to 53.6, finial 55; the clock stage
 * 7 m wide (h2 reads it a fifth narrower than the belfry; OSM's 6.3 m part). The
 * belfry stage of paired arches 26-33 and the arched stage 20-26 from h2.
 * The front range's cornice 17.5 and balustrade 18.8, the porch's two
 * orders (0-8, 9.3-15.8) and pediment to 21, the pavilions' attic to 21 and
 * mansards to 27 (h2, h3, scaled by the tower). The great hall's walls 20
 * and its mansard roof to 26.5 with dormers, the western range 16 (h1,
 * the aerial, against the front range).
 * Estimated: bay widths, the hall's and western range's heights (no
 * photo shows them square on), dormer sizes.
 * Left out: carving, urns (except the detail model's corner ones), chimneys, the stair to the
 * porch, the roofed-over vestibule dome.
 *
 * Colours (sample2.ts and by eye on daylight photos): sandstone sunlit
 * #c8b4a2 (h1), warmer in h4 -> 0xcfae8c; slate dark grey 0x5d6168 on
 * every roof and on the lantern's dome (lead review against h1/h2/h7);
 * the pavilions' iron cresting charcoal 0x4a4f57, drawn as real posts and
 * rails round the mansards' flat tops.
 *
 * Night: the whole building is floodlit warm gold (h7, h3 at night), the
 * tower brightest; the clock faces glow (`neon-clock-face`); windows are
 * `window`.
 *
 * LODs: the low model has every window as a real arched recess, the porch's
 * real columns, the tower's stages with arched openings, the lantern's open
 * colonnade; the detail model adds more columns (paired), balustrade
 * openings, dormers, the clock stage's pediments and the corner urns.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - h1 "Sydney (AU), View from Sydney Tower, Town Hall -- 2019 -- 3161.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial from the north-east)
 * - h2 "Sydney Town Hall.jpg", JustARandomEditor123, CC BY-SA 4.0 (George St front)
 * - h3 "Sydney Town Hall MG 3712 (27151685103).jpg", Tibor Kovacs, CC BY 2.0 (night, from the north-east)
 * - h4 "Sydney Town Hall clock tower, 2022 (01).jpg", Bahnfrend, CC BY-SA 4.0 (tower)
 * - h7 "Sydney Town Hall dusk 001a.jpg", Sardaka, CC BY-SA 4.0 (dusk)
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arch, box, face, lathe, loftRings, prism, saveLods, skin, type Layer, type XY } from './sydney-tower-eye'

const D = 0.45
type Set = { stone: Part; slate: Part; win: Part; bronze: Part; door: Part; clock: Part }
const mk = (): Set => ({ stone: new Part(), slate: new Part(), win: new Part(), bronze: new Part(), door: new Part(), clock: new Part() })
const low = mk(), det = mk()

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const circ = (sc: number, zc: number, r: number, n = 10): XY[] => Array.from({ length: n }, (_, i) => [sc + r * Math.cos((i / n) * Math.PI * 2), zc + r * Math.sin((i / n) * Math.PI * 2)] as XY)

type Side = 'e' | 'n' | 'w' | 's'
type Holes = Partial<Record<Side, (L: number) => XY[][]>>
/** A walled block: a mass inset by D and facade skins with openings (s from each side's start corner). */
function block(s: Set, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, holes: Holes = {}, skip: Side[] = [], top = true) {
  prism(s.stone, [[x0 + D, y0 + D], [x1 - D, y0 + D], [x1 - D, y1 - D], [x0 + D, y1 - D]], z0, z1, { top })
  const sides: [Side, XY, XY, boolean][] = [
    ['e', [x1 - D, y0], [x1 - D, y1], true], ['n', [x1 - D, y1 - D], [x0 + D, y1 - D], false],
    ['w', [x0 + D, y1], [x0 + D, y0], true], ['s', [x0 + D, y0 + D], [x1 - D, y0 + D], false],
  ]
  for (const [k, a, b, long] of sides) {
    if (skip.includes(k)) continue
    skin(s.stone, s.win, a, b, z0, z1, D, holes[k]?.(Math.hypot(b[0] - a[0], b[1] - a[1])) ?? [], { top: true, ends: long })
  }
}
/** Arched windows on `n` bays of a wall L long, between z0 and the springing zs. */
const bays = (L: number, n: number, w: number, z0: number, zs: number, seg = 6, skipMid = false): XY[][] =>
  Array.from({ length: n }, (_, i) => (L * (i + 0.5)) / n).filter((_, i) => !(skipMid && i === (n - 1) / 2)).map((c) => arch(c - w / 2, c + w / 2, z0, zs, false, seg))

/** A hipped mansard: steep lower slopes from the eaves, then a low top. */
function mansard(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, inset: number, z1: number, inset2: number, z2: number) {
  const r = (i: number, z: number): V3[] => [[x0 + i, y0 + i, z], [x1 - i, y0 + i, z], [x1 - i, y1 - i, z], [x0 + i, y1 - i, z]]
  loftRings(p, [r(-0.25, z0), r(inset, z1), r(inset2, z2)], { top: true })
}

/** A column: a round shaft with a square base and capital. */
function column(s: Set, c: XY, r: number, z0: number, z1: number, n: number) {
  box(s.stone, c, r * 1.3, r * 1.3, z0, z0 + 0.5)
  lathe(s.stone, c, [[r, z0 + 0.5], [r * 0.88, z1 - 0.5]], n)
  box(s.stone, c, r * 1.35, r * 1.35, z1 - 0.5, z1)
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const seg = d ? 8 : 5

  // ---- The great hall (Centennial Hall) ----
  const HX0 = -25.5, HX1 = 11.4, HY0 = -26, HY1 = 26
  block(s, HX0, HX1, HY0, HY1, 0, 20, {
    n: (L) => bays(L, 6, 2.6, 8.0, 15.2, seg), s: (L) => bays(L, 6, 2.6, 8.0, 15.2, seg),
  }, ['e', 'w'], false)
  box(s.stone, [(HX0 + HX1) / 2, (HY0 + HY1) / 2], (HX1 - HX0) / 2 + 0.3, (HY1 - HY0) / 2 + 0.3, 19.2, 20.2)
  mansard(s.slate, HX0, HX1, HY0, HY1, 20.2, 2.6, 25.0, 6.5, 26.5)
  // dormers on the steep slopes (h1): small gabled boxes
  const dormers = d ? 6 : 3
  for (let i = 0; i < dormers; i++) for (const sg of [-1, 1]) {
    const x = HX0 + ((HX1 - HX0) * (i + 0.5)) / dormers, y = sg === 1 ? HY1 - 1.6 : HY0 + 1.6
    box(s.slate, [x, y], 1.0, 0.9, 20.2, 23.4)
    loftRings(s.slate, [[[x - 1.1, y - 1, 23.4], [x + 1.1, y - 1, 23.4], [x + 1.1, y + 1, 23.4], [x - 1.1, y + 1, 23.4]], [[x, y - 1, 24.6], [x, y - 1, 24.6], [x, y + 1, 24.6], [x, y + 1, 24.6]]])
    face(s.win, [[x - 0.6, y + sg * 0.93, 20.9], [x + 0.6, y + sg * 0.93, 20.9], [x + 0.6, y + sg * 0.93, 22.9], [x - 0.6, y + sg * 0.93, 22.9]], [0, sg, 0])
  }

  // ---- The western range ----
  block(s, -47.5, HX0 + D, -17, 19.2, 0, 16, {
    w: (L) => [...bays(L, 6, 1.9, 2.8, 6.2, seg), ...bays(L, 6, 1.7, 9.4, 12.6, seg)],
    n: (L) => [...bays(L, 4, 1.9, 2.8, 6.2, seg), ...bays(L, 4, 1.7, 9.4, 12.6, seg)],
    s: (L) => [...bays(L, 4, 1.9, 2.8, 6.2, seg), ...bays(L, 4, 1.7, 9.4, 12.6, seg)],
  }, ['e'])
  box(s.stone, [-36.5 + D / 2, 1.1], 11 + D / 2 + 0.25, 18.1 + 0.25, 15.3, 16.6, 0, { top: true })
  prism(s.slate, [[-46.8, -16.3], [HX0, -16.3], [HX0, 18.5], [-46.8, 18.5]], 16.6, 16.68)

  // ---- The George Street range, with its corner pavilions ----
  const FX0 = HX1 - D, FX1 = 41.5, FY0 = -24, FY1 = 22
  const front = (L: number) => {
    // ground and first floor arched windows, leaving the porch's span (y -10.5..7.1) to the porch
    const out: XY[][] = []
    for (let i = 0; i < 10; i++) {
      const c = (L * (i + 0.5)) / 10, y = FY0 + c
      if (y > -11.5 && y < 8.1) continue
      out.push(arch(c - 1.0, c + 1.0, 2.6, 6.4, false, seg), arch(c - 0.95, c + 0.95, 10.2, 13.8, false, seg))
    }
    // the doors behind the porch
    for (const y of [-6.5, -1.7, 3.1]) out.push(arch(y - FY0 - 1.3, y - FY0 + 1.3, 0, 5.3, false, seg))
    for (const y of [-6.5, -1.7, 3.1]) out.push(arch(y - FY0 - 1.1, y - FY0 + 1.1, 10.4, 13.8, false, seg))
    return out
  }
  const side = (L: number) => [...bays(L, 7, 2.0, 2.6, 6.4, seg), ...bays(L, 7, 1.9, 10.2, 13.8, seg)]
  block(s, FX0, FX1, FY0, FY1, 0, 17.5, { e: front, n: side, s: side }, ['w'])
  // cornice and balustrade
  box(s.stone, [(FX0 + FX1) / 2, (FY0 + FY1) / 2], (FX1 - FX0) / 2 + 0.35, (FY1 - FY0) / 2 + 0.35, 16.9, 17.6)
  box(s.stone, [FX1 - 0.25, (FY0 + FY1) / 2], 0.25, (FY1 - FY0) / 2, 17.6, 18.8)
  for (const y of [FY0 + 0.25, FY1 - 0.25]) box(s.stone, [(FX0 + FX1) / 2, y], (FX1 - FX0) / 2, 0.25, 17.6, 18.8)
  // the range's own low hipped slate roof behind the balustrade
  mansard(s.slate, FX0 + 0.6, FX1 - 0.6, FY0 + 0.6, FY1 - 0.6, 17.5, 3.0, 20.5, 6.0, 21.0)
  // string course between the floors
  box(s.stone, [(FX0 + FX1) / 2, (FY0 + FY1) / 2], (FX1 - FX0) / 2 + 0.2, (FY1 - FY0) / 2 + 0.2, 8.6, 9.2)
  // corner pavilions: an attic storey, a mansard with oculi, cresting
  for (const [py0, py1] of [[FY0 - 0.1, -15], [13, FY1 + 0.2]]) {
    const px0 = 31.6, px1 = FX1 + 0.6
    block(s, px0, px1, py0, py1, 17.5, 21.2, {
      e: (L) => [circ(L / 2, 19.3, 0.75, d ? 10 : 6)],
      ...(py0 < 0 ? { s: (L: number) => [circ(L / 2, 19.3, 0.75, d ? 10 : 6)] } : { n: (L: number) => [circ(L / 2, 19.3, 0.75, d ? 10 : 6)] }),
    }, ['w'])
    box(s.stone, [(px0 + px1) / 2, (py0 + py1) / 2], (px1 - px0) / 2 + 0.3, (py1 - py0) / 2 + 0.3, 20.8, 21.5)
    mansard(s.slate, px0, px1, py0, py1, 21.5, 1.7, 26.3, 2.3, 27.0)
    // iron cresting round the mansard's flat top (h2, h7): posts and a top rail, real and open
    {
      const q0 = px0 + 2.4, q1 = px1 - 2.4, r0 = py0 + 2.4, r1 = py1 - 2.4, step = d ? 0.5 : 1.1
      const ring: [XY, XY][] = [[[q0, r0], [q1, r0]], [[q1, r0], [q1, r1]], [[q1, r1], [q0, r1]], [[q0, r1], [q0, r0]]]
      for (const [a, b] of ring) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step))
        for (let i = 0; i < n; i++) {
          const t = i / n
          box(s.bronze, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], 0.06, 0.06, 27.0, 28.1)
        }
        const c: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        box(s.bronze, c, Math.abs(b[0] - a[0]) / 2 + 0.06, Math.abs(b[1] - a[1]) / 2 + 0.06, 27.95, 28.1)
        if (d) box(s.bronze, c, Math.abs(b[0] - a[0]) / 2 + 0.05, Math.abs(b[1] - a[1]) / 2 + 0.05, 27.4, 27.48)
      }
      if (d) for (const [cx, cy] of [[q0, r0], [q1, r0], [q1, r1], [q0, r1]]) lathe(s.bronze, [cx, cy], [[0.12, 27.0], [0.12, 28.6], [0.02, 29.3]], 6)
    }
    // bull's-eye dormers on the mansard (h2)
    for (const [c, nrm] of [[[px1 - 0.9, (py0 + py1) / 2], [1, 0]], [[(px0 + px1) / 2, py0 < 0 ? py0 + 0.9 : py1 - 0.9], [0, py0 < 0 ? -1 : 1]]] as [XY, XY][]) {
      lathe(s.stone, [c[0] - nrm[0] * 0.3, c[1] - nrm[1] * 0.3], [[0.85, 22.4], [0.85, 24.6]], d ? 10 : 6, { top: true })
      const t: XY = [-nrm[1], nrm[0]]
      face(s.win, Array.from({ length: d ? 10 : 6 }, (_, i) => {
        const a = (i / (d ? 10 : 6)) * Math.PI * 2
        return [c[0] + nrm[0] * 0.6 + t[0] * 0.5 * Math.cos(a), c[1] + nrm[1] * 0.6 + t[1] * 0.5 * Math.cos(a), 23.5 + 0.5 * Math.sin(a)] as V3
      }), [nrm[0], nrm[1], 0])
    }
    if (d) for (const [cx, cy] of [[px1 - 0.4, py0 + 0.4], [px1 - 0.4, py1 - 0.4], [px0 + 0.4, py0 + 0.4], [px0 + 0.4, py1 - 0.4]]) {
      // corner urns on the pavilions
      lathe(s.stone, [cx, cy], [[0.3, 21.5], [0.45, 22.1], [0.25, 22.6], [0.05, 23.0]], 8, { bottom: true })
    }
  }

  // ---- The vestibule porch: two orders of columns, balustrade, pediment ----
  const PX0 = FX1 - D, PX1 = 49.2, PY0 = -10.5, PY1 = 7.1, PC = (PY0 + PY1) / 2
  const cols = d ? [-8.2, -7.2, -3.6, -2.6, 2.6, 3.6, 7.2, 8.2] : [-7.7, -3.1, 3.1, 7.7]
  for (const k of cols) {
    column(s, [PX1 - 0.7, PC + k], d ? 0.42 : 0.55, 0.6, 8.2, d ? 10 : 6)
    column(s, [PX1 - 0.7, PC + k], d ? 0.36 : 0.48, 9.6, 15.7, d ? 10 : 6)
  }
  // return walls (piers) at the porch's ends
  for (const y of [PY0 + 0.8, PY1 - 0.8]) box(s.stone, [(PX0 + PX1) / 2, y], (PX1 - PX0) / 2, 0.8, 0, 17.3)
  // podium step, first-floor slab with balustrade, entablatures
  box(s.stone, [(PX0 + PX1) / 2, PC], (PX1 - PX0) / 2, (PY1 - PY0) / 2, 0, 0.6)
  box(s.stone, [(PX0 + PX1) / 2, PC], (PX1 - PX0) / 2 + 0.2, (PY1 - PY0) / 2, 8.2, 9.3)
  if (d) {
    const holes: XY[][] = []
    for (let x = 0.4; x < PY1 - PY0 - 1.8; x += 0.9) holes.push(rect(x, x + 0.5, 9.55, 10.35))
    skin(s.stone, null, [PX1 - 0.2, PY0 + 0.8], [PX1 - 0.2, PY1 - 0.8], 9.3, 10.6, 0.15, holes, { through: true })
  } else box(s.stone, [PX1 - 0.25, PC], 0.2, (PY1 - PY0) / 2 - 0.8, 9.3, 10.4)
  box(s.stone, [(PX0 + PX1) / 2, PC], (PX1 - PX0) / 2 + 0.25, (PY1 - PY0) / 2 + 0.2, 15.7, 17.3)
  // pediment over the central span, facing George Street
  {
    const x = PX1 + 0.2, w = 6.2
    face(s.stone, [[x, PC - w, 17.3], [x, PC + w, 17.3], [x, PC, 20.9]], [1, 0, 0])
    loftRings(s.stone, [[[PX0, PC - w - 0.3, 17.3], [x + 0.25, PC - w - 0.3, 17.3], [x + 0.25, PC + w + 0.3, 17.3], [PX0, PC + w + 0.3, 17.3]],
      [[PX0, PC, 21.1], [x + 0.25, PC, 21.1], [x + 0.25, PC, 21.1], [PX0, PC, 21.1]]])
  }

  // ---- The clock tower ----
  const TC: XY = [37.0, -1.4]
  const tw = (L: number, w: number, z0: number, zs: number, n: number) => bays(L, n, w, z0, zs, seg)
  block(s, TC[0] - 4.35, TC[0] + 4.35, TC[1] - 4.7, TC[1] + 4.7, 17.5, 26.0, {
    e: (L) => tw(L, 2.2, 19.8, 23.2, 1), n: (L) => tw(L, 2.2, 19.8, 23.2, 1), w: (L) => tw(L, 2.2, 19.8, 23.2, 1), s: (L) => tw(L, 2.2, 19.8, 23.2, 1),
  })
  box(s.stone, TC, 4.75, 5.1, 25.4, 26.3)
  // belfry stage: paired arches, open through (real openings)
  const bel = (L: number) => [arch(L / 2 - 2.5, L / 2 - 0.4, 27.0, 30.6, false, seg), arch(L / 2 + 0.4, L / 2 + 2.5, 27.0, 30.6, false, seg)]
  const BH = 4.0
  for (const [a, b] of [[[TC[0] + BH, TC[1] - BH], [TC[0] + BH, TC[1] + BH]], [[TC[0] + BH, TC[1] + BH], [TC[0] - BH, TC[1] + BH]], [[TC[0] - BH, TC[1] + BH], [TC[0] - BH, TC[1] - BH]], [[TC[0] - BH, TC[1] - BH], [TC[0] + BH, TC[1] - BH]]] as [XY, XY][]) {
    // the belfry walls stand as open screens round a dark core
    const L = 2 * BH
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    skin(s.stone, null, [a[0] - nx * 0.35, a[1] - ny * 0.35], [b[0] - nx * 0.35, b[1] - ny * 0.35], 26.3, 33.0, 0.35, bel(L), { through: true, ends: true })
  }
  box(s.slate, TC, BH - 1.6, BH - 1.6, 26.3, 33.0)
  box(s.stone, TC, BH + 0.35, BH + 0.35, 32.6, 33.4)
  if (d) for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) lathe(s.stone, [TC[0] + dx * (BH + 0.1), TC[1] + dy * (BH + 0.1)], [[0.35, 26.3], [0.5, 27.0], [0.3, 27.6], [0.05, 28.1]], 8, { bottom: true })
  // clock stage
  const CH = 3.5
  block(s, TC[0] - CH, TC[0] + CH, TC[1] - CH, TC[1] + CH, 33.4, 40.0)
  box(s.stone, TC, CH + 0.3, CH + 0.3, 39.6, 40.4)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const c: V3 = [TC[0] + nx * (CH + 0.04), TC[1] + ny * (CH + 0.04), 37.0]
    const t: XY = [-ny, nx]
    const n = d ? 16 : 10
    face(s.clock, Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      return [c[0] + t[0] * 1.15 * Math.cos(a), c[1] + t[1] * 1.15 * Math.cos(a), c[2] + 1.15 * Math.sin(a)] as V3
    }), [nx, ny, 0])
    // segmental pediment over each clock (a low gable)
    const P = (sv: number, z: number, o = 0): V3 => [TC[0] + nx * (CH + 0.3 + o) + t[0] * sv, TC[1] + ny * (CH + 0.3 + o) + t[1] * sv, z]
    face(s.stone, [P(-2.4, 40.4), P(2.4, 40.4), P(0, 41.6)], [nx, ny, 0])
    face(s.stone, [P(-2.4, 40.4, -1.2), P(-2.4, 40.4), P(0, 41.6), P(0, 41.6, -1.2)], [nx * 0.4 - t[0], ny * 0.4 - t[1], 1])
    face(s.stone, [P(2.4, 40.4), P(2.4, 40.4, -1.2), P(0, 41.6, -1.2), P(0, 41.6)], [nx * 0.4 + t[0], ny * 0.4 + t[1], 1])
  }
  // lantern: base drum, open colonnade round a core, bell dome, finial
  lathe(s.stone, TC, [[2.3, 40.4], [2.3, 41.8], [2.45, 41.8], [2.45, 42.4], [2.1, 42.4]], d ? 16 : 10, { crease: 30, top: true })
  const nc = d ? 8 : 6
  for (let i = 0; i < nc; i++) {
    const a = (i / nc) * Math.PI * 2 + Math.PI / nc
    lathe(s.stone, [TC[0] + 1.7 * Math.cos(a), TC[1] + 1.7 * Math.sin(a)], [[0.22, 42.4], [0.2, 48.0]], d ? 8 : 5)
  }
  lathe(s.slate, TC, [[0.9, 42.4], [0.9, 48.0]], d ? 10 : 6)
  lathe(s.stone, TC, [[2.15, 48.0], [2.15, 48.8], [1.95, 48.8]], d ? 16 : 10, { crease: 30, bottom: true })
  const dome: [number, number][] = [[1.95, 48.8]]
  const K = d ? 8 : 5
  for (let i = 1; i <= K; i++) {
    const t = i / K
    // a bell: full at the foot, drawn in to a point
    dome.push([1.95 * Math.cos((t * Math.PI) / 2) ** 0.8, 48.8 + 4.8 * Math.sin((t * Math.PI) / 2)])
  }
  lathe(s.slate, TC, dome, d ? 16 : 10)
  lathe(s.slate, TC, [[0.25, 53.4], [0.25, 54.1], [0.05, 55.0]], 6)
}

// ---- Materials and output --------------------------------------------------------------------------------

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[0] > 30 ? 0.95 : 0.65)
const STONE: MaterialSpec = { ...finish('yellowblock-sandstone', 0xcfae8c), floodlight: lit }
const BRONZE: MaterialSpec = finish('iron-cresting', 0x4a4f57)
const SLATE: MaterialSpec = { ...PALETTE.roof, color: 0x5d6168 }
const DOOR: MaterialSpec = { ...PALETTE.entrance, color: 0x8b6b4a }
const CLOCK: MaterialSpec = finish('neon-clock-face', 0xf4efe4)
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.slate, material: SLATE },
  { part: s.win, material: PALETTE.window },
  { part: s.bronze, material: BRONZE },
  { part: s.door, material: DOOR },
  { part: s.clock, material: CLOCK },
]

if (import.meta.main) {
  await saveLods('sydney-town-hall', 'Sydney Town Hall', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, street level', bearing: 5.1,
  }, 6500)
}
