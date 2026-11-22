/**
 * Queen Victoria Building, George Street, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-queen-victoria-building.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 357.5
 * (the block's long axis, from OSM's outline way/40717424). Origin at the
 * outline's centroid (151.2066875, -33.8717629); y = 0 at street level.
 *
 * Romanesque Revival (Federation Romanesque) market hall by George McRae,
 * 1893-1898, in Sydney sandstone: a long block between George Street (east)
 * and York Street (west), Market Street (north) and Druitt Street (south),
 * with taller pavilions at both ends, a great copper dome on a windowed
 * drum at the centre, smaller copper domes on towers along the roof, and a
 * glazed barrel roof over the galleria.
 *
 * Published (Wikipedia "Queen Victoria Building"): 190 m long, 30 m wide;
 * central dome 19 m across, 60 m from the ground to the top of its cupola;
 * domes sheathed in copper; arched skylights run north and south from the
 * central dome; the parapet cupolas are fibreglass painted as copper.
 *
 * OSM (in the turned frame): the outline is a 29.8 x 186.2 m rectangle
 * (x +-14.9, y -93.85..92.35; 187 m against the published 190, 30 m
 * wide). Parts: end pavilions way/568422314 (south, y -93.9..-71.35) and
 * way/568422315 (north, 72.5..92.35), 5 levels against the block's 4; the
 * central dome way/568422349 (21.9 m across with its drum, 9 levels) and
 * its cupola way/568422351 (11 levels); 18 small domes, 6.5 m across:
 * four on the north pavilion (x +-10.8, y 79 and 88), two on the south
 * (y -79; q5 confirms only two there), and pairs across the block at
 * y +-9.5 (6 levels), +-39 and +-49 (5 levels).
 *
 * Heights from photos (storeys counted and scaled on the south and north
 * pavilions, q2 and q5, against the 30 m width and a 5.6 m ground storey):
 * - ground storey 0-5.6 (shopfronts under the awning at 4.6 m), first
 *   floor arcades 6.4-12, second floor 13.2-16.9, frieze and cornice to
 *   18.2, roof 19.2, balustrade top 20.5;
 * - pavilions: an attic storey to 25, parapet 26.3, round corner turrets
 *   to 26.8 with domed caps;
 * - small domes: on tower blocks rising to 22.8 (5-level towers), 24.5
 *   (6-level) and 27.3 (on the pavilions), drum, dome 3.1 m in radius,
 *   finial;
 * - central dome: the drum rises from the roof to 31 m with 16 arched
 *   windows (the aerials q1/q3 show it standing a full storey clear of the
 *   towers); the dome, 10 m in radius, rises 13.2 m (a little stilted; q4
 *   reads 17 m from the street); lantern and cupola to the published 60 m.
 * Estimated: bay widths (4-5 m, from the window rhythm in q2/q7), the
 *   barrel skylight (10 m wide, a segmental vault rising 3 m above the
 *   roof, from q1/q3), the awning's depth (3 m).
 * Left out: balustrade balusters, carved friezes and capitals, the statuary
 *   group over the George Street entrance, the stained-glass cartwheel
 *   window's tracery (drawn as a round window), the side glass roofs.
 *
 * Colours (sample2.ts on daylight photos): sandstone sunlit #bfa282-#a68264,
 * shaded #7c593e (q2, q7) -> 0xc8956a, warm and orange; copper domes
 * #b1c099-#d7e6c2 in sun, #687f73 in shade (q3, q7) -> patina 0x98b896;
 * the awning and cornices a paler stone; the skylights glass.
 *
 * Night: the sandstone is floodlit (warm wash on the facades, strongest on
 * the domes' drums); windows and shopfronts are `window`.
 *
 * LODs: the low model draws one arch per bay on the first and second
 * floors; the detail model draws the real paired and tripled lights with
 * their piers, ribs on every dome, the open lantern arcade, and the round
 * turrets beside the towers.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - q1 "Sydney (AU), View from Sydney Tower, Queen Victoria Building -- 2019 -- 3153.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial from the north-east)
 * - q2 "Sydney (AU), Queen Victoria Building -- 2019 -- 3580.jpg", Dietmar Rabich, CC BY-SA 4.0 (north end from George St)
 * - q3 "Sydney (AU), View from Sydney Tower, Queen Victoria Building -- 2019 -- 3127.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial)
 * - q4 "Sydney Queen Victoria Building seen from the northeast.jpg", Ymblanter, CC BY-SA 4.0
 * - q5 "Southern end of the Queen Victoria Building, Sydney, July 2005.jpg", Skyring, CC BY-SA 3.0
 * - q7 "Queen Victoria Building on George Street, Sydney.jpg", MDRX, CC BY-SA 4.0
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arch, box, lathe, prism, saveLods, skin, tube, face, type Layer, type XY } from './sydney-tower-eye'

const HX = 14.9, YS = -93.85, YN = 92.35, PS = -71.35, PN = 72.5
const D = 0.5 // facade skin depth: the reveal of every opening
const ROOF = 19.2, PARA = 20.5, PROOF = 25, PPARA = 26.3

type Set = { stone: Part; trim: Part; win: Part; patina: Part; roof: Part; glass: Part }
const mk = (): Set => ({ stone: new Part(), trim: new Part(), win: new Part(), patina: new Part(), roof: new Part(), glass: new Part() })
const low = mk(), det = mk()

const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const circ = (sc: number, zc: number, r: number, n = 10): XY[] => Array.from({ length: n }, (_, i) => [sc + r * Math.cos((i / n) * Math.PI * 2), zc + r * Math.sin((i / n) * Math.PI * 2)] as XY)

// Bays along the long facades (y). Towers are 6.4 m wide at their centres.
type Bay = { s0: number; s1: number; tower?: boolean; door?: boolean }
function longBays(d = true): Bay[] {
  const out: Bay[] = []
  const run = (a: number, b: number, n: number) => { for (let i = 0; i < n; i++) out.push({ s0: a + ((b - a) * i) / n, s1: a + ((b - a) * (i + 1)) / n }) }
  const tower = (c: number) => out.push({ s0: c - 3.2, s1: c + 3.2, tower: true })
  // the low model draws half as many, wider bays
  const k = d ? 1 : 0.5
  run(PS, -52.2, 4 * k); tower(-49); if (d) run(-45.8, -42.2, 1); tower(-39); run(-35.8, -12.7, Math.round(5 * k)); tower(-9.5)
  out.push({ s0: -6.3, s1: 6.3, door: true })
  tower(9.5); run(12.7, 35.8, Math.round(5 * k)); tower(39); if (d) run(42.2, 45.8, 1); tower(49); run(52.2, PN, 4 * k)
  return out
}

/** Openings for one bay of the main block, in wall coordinates (s, z). */
function bayHoles(b: Bay, d: boolean): XY[][] {
  const h: XY[][] = [], w = b.s1 - b.s0, c = (b.s0 + b.s1) / 2
  const seg = d ? 8 : 6
  // Ground floor: shopfront, or the central entrance arch.
  if (b.door) h.push(arch(c - 2.2, c + 2.2, 0, 3.3, false, seg))
  else h.push(rect(b.s0 + 0.7, b.s1 - 0.7, 0.3, 4.4))
  if (w < 4) {
    // narrow bay between paired towers: one slit light per floor
    h.push(arch(c - 0.7, c + 0.7, 7.0, 10.8, false, d ? 6 : 4))
    h.push(arch(c - 0.6, c + 0.6, 13.6, 15.9, false, d ? 6 : 4))
    return h
  }
  if (b.door && !d) { h.push(arch(c - 4, c + 4, 6.6, 8.0, false, 4), rect(c - 4.5, c + 4.5, 13.4, 16.4)); return h }
  if (b.door) {
    // the entrance bay: a big arch over three lights, then a triple
    for (const k of [-1, 0, 1]) h.push(arch(c + k * 2.9 - 1.1, c + k * 2.9 + 1.1, 6.6, 10.6, false, seg))
    for (const k of [-1, 0, 1]) h.push(arch(c + k * 2.9 - 0.9, c + k * 2.9 + 0.9, 13.4, 15.7, false, seg))
    return h
  }
  if (!d) {
    // low: one round arch per bay on the first floor; the ground and second
    // floors are drawn as one recessed band per run of bays (see runBands)
    // (the ground floor sits under the awning: left plain in the low model)
    h.pop()
    const aw = Math.min(w - 1.5, 4.6)
    h.push(arch(c - aw / 2, c + aw / 2, 6.6, 12.0 - aw / 2, false, 4))
    return h
  }
  // detail: paired round-headed lights on the first floor, a triple above
  const lw = Math.min((w - 1.5) / 2, 1.8)
  for (const k of [-1, 1]) h.push(arch(c + k * (lw / 2 + 0.2) - lw / 2, c + k * (lw / 2 + 0.2) + lw / 2, 6.6, 11.8 - lw / 2, false, seg))
  const tw = Math.min((w - 1.6) / 3, 1.2)
  for (const k of [-1, 0, 1]) h.push(arch(c + k * (tw + 0.25) - tw / 2, c + k * (tw + 0.25) + tw / 2, 13.4, 16.6 - tw / 2, false, 6))
  return h
}

/** Openings on a pavilion face `w` wide with `n` bays, to the attic. */
function pavHoles(w: number, n: number, d: boolean, mainEnd: boolean): XY[][] {
  const h: XY[][] = [], bw = w / n, seg = d ? 8 : 4
  if (!d) {
    // low: a shopfront band (ends only), an arch per bay on each floor, the cartwheel window
    if (mainEnd) h.push(rect(0.8, w - 0.8, 0.3, 4.4))
    for (let i = 0; i < n; i++) {
      const c = bw * (i + 0.5), centre = mainEnd && i === (n - 1) / 2, aw = Math.min(bw - 1.6, 3.4)
      if (centre) h.push(circ(c, 9.4, 2.4, 10))
      else h.push(arch(c - aw / 2, c + aw / 2, 6.6, 12 - aw / 2, false, seg))
      h.push(arch(c - aw / 2.4, c + aw / 2.4, 14.6, 18.0 - aw / 2.4, false, seg))
      h.push(arch(c - 1.0, c + 1.0, 20.2, 22.8, false, seg))
    }
    return h
  }
  for (let i = 0; i < n; i++) {
    const c = bw * (i + 0.5)
    const centre = mainEnd && i === (n - 1) / 2
    if (centre) h.push(arch(c - 2.2, c + 2.2, 0, 3.2, false, seg))
    else h.push(rect(c - bw / 2 + 0.7, c + bw / 2 - 0.7, 0.3, 4.4))
    const aw = Math.min(bw - 1.6, 3.4)
    if (centre && mainEnd) h.push(circ(c, 9.4, 2.4, d ? 16 : 12)) // the cartwheel window
    else h.push(arch(c - aw / 2, c + aw / 2, 6.6, 12 - aw / 2, false, seg))
    h.push(circ(c, 14.0, 0.55, d ? 10 : 6)) // the oculi band (q5)
    const bw2 = Math.min(bw - 1.8, 2.4)
    h.push(arch(c - bw2 / 2, c + bw2 / 2, 15.4, 18.0 - bw2 / 2, false, seg))
    // attic: paired tall narrow lights
    for (const k of d ? [-1, 1] : [0]) {
      const lw = d ? 0.9 : 1.9, lc = c + k * 0.7
      h.push(arch(lc - lw / 2, lc + lw / 2, 20.2, 23.8 - lw / 2, false, d ? 6 : 4))
    }
  }
  return h
}

/** A string course: a bevelled band standing out `out` from the wall line a→b. */
function course(p: Part, a: XY, b: XY, z0: number, z1: number, out: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: XY, o: number, z: number): V3 => [s[0] + n[0] * o, s[1] + n[1] * o, z]
  const ch = Math.min(0.25, (z1 - z0) / 3)
  const prof: [number, number][] = [[0, z0], [out - ch, z0], [out, z0 + ch], [out, z1 - ch], [out - ch, z1], [0, z1]]
  for (let k = 0; k < prof.length - 1; k++) {
    const [o0, za] = prof[k], [o1, zb] = prof[k + 1]
    const nn: V3 = [n[0] * (zb - za), n[1] * (zb - za), -(o1 - o0)]
    face(p, [P(a, o0, za), P(b, o0, za), P(b, o1, zb), P(a, o1, zb)], nn)
  }
  // end caps
  for (const [e, s] of [[a, -1], [b, 1]] as [XY, number][]) face(p, prof.map(([o, z]) => P(e, o, z)), [u[0] * s, u[1] * s, 0])
}

/** A small copper dome on its drum, with a finial. */
function smallDome(s: Set, c: XY, z: number, r: number, d: boolean) {
  const n = d ? 12 : 8
  if (d) lathe(s.stone, c, [[r + 0.25, z], [r + 0.25, z + 0.8], [r - 0.05, z + 0.8]], n, { crease: 30, phase: Math.PI / n })
  // (low: the dome sits straight on its tower)
  const prof: [number, number][] = []
  const K = d ? 6 : 3
  for (let i = 0; i <= K; i++) {
    const t = (i / K) * (Math.PI / 2)
    prof.push([r * Math.cos(t), z + 0.8 + 0.3 + r * 1.12 * Math.sin(t)])
  }
  if (d) prof.unshift([r, z + 0.8])
  else prof[0] = [r, z]
  lathe(s.patina, c, prof, n, { phase: Math.PI / n })
  const top = z + 0.8 + 0.3 + r * 1.12
  // finial: a small lantern and spike
  if (d) lathe(s.patina, c, [[0.45, top - 0.1], [0.45, top + 0.6], [0.6, top + 0.75], [0.12, top + 1.0], [0.08, top + 1.9]], 6, { crease: 30 })
  else lathe(s.patina, c, [[0.5, top - 0.1], [0.06, top + 1.9]], 3)
  if (d) for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2 + Math.PI / n
    const rib: V3[] = []
    for (let k = 0; k <= 4; k++) {
      const a = (k / 4) * (Math.PI / 2) * 0.92
      const rr = r * Math.cos(a) + 0.06
      rib.push([c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t), z + 1.1 + r * 1.12 * Math.sin(a) + 0.02])
    }
    tube(s.patina, rib, 0.11, 3)
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // ---- Masses (inset by the skin depth, so the skins' faces lie on the outline) ----
  const WX = HX - D, WS = YS + D, WN = YN - D
  prism(s.stone, [[-WX, PS], [WX, PS], [WX, PN], [-WX, PN]], 0, ROOF, { top: false })
  prism(s.roof, [[-WX, PS], [WX, PS], [WX, PN], [-WX, PN]], ROOF - 0.01, ROOF, { top: true })
  for (const [y0, y1] of [[WS, PS], [PN, WN]]) {
    prism(s.stone, [[-WX, y0], [WX, y0], [WX, y1], [-WX, y1]], 0, PROOF, { top: false })
    prism(s.roof, [[-WX, y0], [WX, y0], [WX, y1], [-WX, y1]], PROOF - 0.01, PROOF)
  }

  // ---- Long facades ----
  const bays = longBays(d)
  for (const side of [1, -1]) {
    // east (side 1) runs north from PS; west runs south from PN
    const a: XY = side === 1 ? [WX, PS] : [-WX, PN]
    const b: XY = side === 1 ? [WX, PN] : [-WX, PS]
    const holes: XY[][] = []
    for (const bay of bays) {
      const s0 = side === 1 ? bay.s0 - PS : PN - bay.s1, s1 = side === 1 ? bay.s1 - PS : PN - bay.s0
      holes.push(...bayHoles({ ...bay, s0, s1 }, d))
    }
    if (!d) {
      // runs of ordinary bays between towers: one shopfront band and one second-floor arcade band each
      let run: number[] = []
      const flush = () => {
        if (!run.length) return
        const s0 = Math.min(...run), s1 = Math.max(...run)
        holes.push(rect(s0 + 0.8, s1 - 0.8, 13.4, 16.4))
        run = []
      }
      for (const bay of bays) {
        const s0 = side === 1 ? bay.s0 - PS : PN - bay.s1, s1 = side === 1 ? bay.s1 - PS : PN - bay.s0
        if (bay.tower || bay.door || bay.s1 - bay.s0 < 4) flush()
        else run.push(s0, s1)
      }
      flush()
    }
    skin(s.stone, s.win, a, b, 0, ROOF, D, holes, { top: false, ends: false })
    // pavilion long faces
    for (const [y0, y1] of [[WS, PS], [PN, WN]]) {
      const pa: XY = side === 1 ? [WX, y0] : [-WX, y1], pb: XY = side === 1 ? [WX, y1] : [-WX, y0]
      const w = y1 - y0
      skin(s.stone, s.win, pa, pb, 0, PROOF, D, pavHoles(w, d ? 4 : 2, d, false), { top: false, ends: false })
    }
  }
  // ---- End facades (north on Market St, south on Druitt St), carried round the corners ----
  skin(s.stone, s.win, [WX, WN], [-WX, WN], 0, PROOF, D, pavHoles(2 * WX, 5, d, true), { top: false, s0: -D, s1: 2 * WX + D })
  skin(s.stone, s.win, [-WX, WS], [WX, WS], 0, PROOF, D, pavHoles(2 * WX, 5, d, true), { top: false, s0: -D, s1: 2 * WX + D })
  // the pavilions' inner faces above the main roof
  for (const [y, dir] of [[PS, 1], [PN, -1]] as [number, number][]) {
    const a: XY = dir === 1 ? [WX, y] : [-WX, y], b: XY = dir === 1 ? [-WX, y] : [WX, y]
    const holes: XY[][] = []
    for (let i = 0; i < (d ? 5 : 0); i++) {
      const c = 2 * WX * (i + 0.5) / 5
      holes.push(arch(c - 0.9, c + 0.9, PARA + 0.2, PROOF - 1.9, false, d ? 6 : 4))
    }
    skin(s.stone, s.win, a, b, ROOF, PROOF, 0.3, holes, { top: false, ends: false })
  }

  // ---- Courses, cornices, parapets ----
  const courses = (y0: number, y1: number, zs: [number, number, number][], sides: boolean[]) => {
    // east, north, west, south edges of a ccw ring starting at (HX, y0)
    const X = HX - D, Y0 = y0 === YS ? YS + D : y0, Y1 = y1 === YN ? YN - D : y1
    const edges: [XY, XY][] = [[[X, Y0], [X, Y1]], [[X, Y1], [-X, Y1]], [[-X, Y1], [-X, Y0]], [[-X, Y0], [X, Y0]]]
    edges.forEach(([a, b], i) => { if (sides[i]) for (const [z0, z1, o] of zs) course(s.trim, a, b, z0, z1, o) })
  }
  // main block: sill course, first floor cornice, main cornice (east/west only)
  courses(PS, PN, [[5.6, 6.3, D + 0.15], [12.3, 13.0, D + 0.15], [17.2, 18.2, D + 0.45]], [true, false, true, false])
  for (const [y0, y1, sides] of [[YS, PS, [true, false, true, true]], [PN, YN, [true, true, true, false]]] as [number, number, boolean[]][]) {
    courses(y0, y1, d ? [[5.6, 6.3, D + 0.15], [12.3, 13.0, D + 0.15], [18.6, 19.5, D + 0.35], [PROOF - 0.6, PROOF + 0.3, D + 0.45]] : [[PROOF - 0.6, PROOF + 0.3, D + 0.45]], sides)
  }
  // balustrade parapets
  const par = (y0: number, y1: number, z0: number, z1: number) =>
    prism(s.trim, [[-HX, y0], [HX, y0], [HX, y1], [-HX, y1]], z0, z1, { holes: [[[-HX + 0.5, y0 + 0.5], [HX - 0.5, y0 + 0.5], [HX - 0.5, y1 - 0.5], [-HX + 0.5, y1 - 0.5]]] })
  if (!d) par(PS, PN, ROOF, PARA)
  par(YS, PS, PROOF, PPARA)
  par(PN, YN, PROOF, PPARA)
  if (d) {
    // pierced balustrades on the main block: real openings through the parapet
    const edge = (a: XY, b: XY) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), holes: XY[][] = []
      const n = Math.floor((L - 1.2) / 1.8)
      for (let i = 0; i < n; i++) { const x = (L - n * 1.8) / 2 + i * 1.8 + 0.3; holes.push(rect(x, x + 1.2, ROOF + 0.4, PARA - 0.35)) }
      skin(s.trim, null, a, b, ROOF, PARA, 0.22, holes, { through: true, top: true })
    }
    const X = HX - 0.22
    edge([X, PS], [X, PN]); edge([-X, PN], [-X, PS])
  }

  // ---- Awning on the street faces: a slab cantilevered at 4.6 m ----
  for (const side of [1, -1]) prism(s.trim, [[side * (HX + 0.02), YS], [side * (HX + 3.0), YS], [side * (HX + 3.0), YN], [side * (HX + 0.02), YN]].map((q) => q as XY), 4.55, 4.85, { bottom: true })
  for (const y of [YS, YN]) {
    const sg = y === YN ? 1 : -1
    prism(s.trim, [[-HX - 3.0, y + sg * 0.02], [HX + 3.0, y + sg * 0.02], [HX + 3.0, y + sg * 3.0], [-HX - 3.0, y + sg * 3.0]], 4.55, 4.85, { bottom: true })
  }

  // ---- Pavilion corner turrets (round, with domed caps) ----
  for (const y of [YS, YN]) for (const x of [-HX, HX]) {
    const c: XY = [x - Math.sign(x) * 0.5, y - Math.sign(y) * 0.5]
    lathe(s.stone, c, d ? [[1.75, 5.6], [1.75, PPARA + 0.5], [1.95, PPARA + 0.5], [1.95, PPARA + 1.0], [1.6, PPARA + 1.0]] : [[1.75, 5.6], [1.75, PPARA + 1.0], [1.6, PPARA + 1.0]], d ? 16 : 8, { crease: 30 })
    lathe(s.patina, c, d ? [[1.6, PPARA + 1.0], [1.45, PPARA + 1.9], [1.0, PPARA + 2.6], [0.4, PPARA + 3.0], [0.1, PPARA + 4.0]] : [[1.6, PPARA + 1.0], [1.2, PPARA + 2.3], [0.1, PPARA + 4.0]], d ? 16 : 8)
  }

  // ---- Tower blocks and small domes ----
  const towers: [number, number, number][] = [] // x, y, block top
  for (const y of [-49, -39, 39, 49]) for (const x of [-10.6, 10.9]) towers.push([x, y, 22.8])
  for (const y of [-9.5, 9.5]) for (const x of [-11.0, 11.0]) towers.push([x, y, 24.5])
  for (const [x, y, top] of towers) {
    box(s.stone, [x, y], 3.2, 3.2, ROOF - 0.5, top)
    if (d) course(s.trim, [x + 3.2, y - 3.2], [x + 3.2, y + 3.2], top - 0.6, top, 0.3)
    if (d) course(s.trim, [x - 3.2, y + 3.2], [x - 3.2, y - 3.2], top - 0.6, top, 0.3)
    if (d) course(s.trim, [x + 3.2, y + 3.2], [x - 3.2, y + 3.2], top - 0.6, top, 0.3)
    if (d) course(s.trim, [x - 3.2, y - 3.2], [x + 3.2, y - 3.2], top - 0.6, top, 0.3)
    smallDome(s, [x, y], top, 3.0, d)
    if (d) {
      // round turrets on the tower's outer corners, as in q7
      const sx = Math.sign(x)
      for (const dy of [-3.2, 3.2]) {
        const c: XY = [x + sx * 3.2, y + dy]
        lathe(s.stone, c, [[0.75, ROOF], [0.75, top + 0.8]], 10, { top: true })
        lathe(s.patina, c, [[0.85, top + 0.8], [0.6, top + 1.6], [0.08, top + 2.5]], 10)
      }
    }
  }
  for (const [x, y] of [[-10.9, 79.2], [-10.9, 88.4], [10.9, 79.2], [10.9, 88.4], [-10.5, -79.2], [10.8, -79.2]] as XY[]) {
    box(s.stone, [x, y], 3.2, 3.2, PROOF - 0.3, 27.3)
    smallDome(s, [x, y], 27.3, 3.1, d)
  }

  // ---- Central dome ----
  const DR = 10.6, DZ0 = ROOF - 0.5, DZ1 = 31
  const F = d ? 16 : 12
  for (let i = 0; i < F; i++) {
    const t0 = (i / F) * Math.PI * 2, t1 = ((i + 1) / F) * Math.PI * 2
    const a: XY = [DR * Math.cos(t0), DR * Math.sin(t0)], b: XY = [DR * Math.cos(t1), DR * Math.sin(t1)]
    const w = Math.hypot(b[0] - a[0], b[1] - a[1])
    skin(s.stone, s.win, a, b, DZ0, DZ1, 0.5, [arch(w / 2 - 1.2, w / 2 + 1.2, 22.4, 28.2, false, d ? 8 : 4)], { top: false })
  }
  // drum back (inside the skin: the faces sit on the 16-gon, so close the top)
  lathe(s.trim, [0, 0], [[DR + 0.45, DZ1], [DR + 0.45, DZ1 + 0.9], [9.9, DZ1 + 0.9]], d ? 24 : 16, { crease: 30 })
  lathe(s.trim, [0, 0], [[DR + 0.55, 20.6], [DR + 0.55, 21.3], [DR + 0.2, 21.3]], d ? 24 : 16, { crease: 30, bottom: false })
  const prof: [number, number][] = [[10.0, DZ1 + 0.9], [10.0, DZ1 + 1.6]]
  const K = d ? 10 : 5
  for (let i = 1; i <= K; i++) {
    const t = (i / K) * (Math.PI / 2) * 0.86
    prof.push([10.0 * Math.cos(t), DZ1 + 1.6 + 11.6 * Math.sin(t)])
  }
  const dTop = prof[prof.length - 1]
  lathe(s.patina, [0, 0], prof, d ? 32 : 16, { top: true })
  if (d) for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2
    const rib: V3[] = prof.slice(1).map(([r, z]) => [(r + 0.12) * Math.cos(t), (r + 0.12) * Math.sin(t), z])
    tube(s.patina, rib, 0.16, 4)
  }
  // Lantern: base ring, open arcade (detail) or solid windowed drum (low), cupola, finial.
  const LZ = dTop[1]
  lathe(s.trim, [0, 0], [[3.2, LZ - 0.3], [3.2, LZ + 1.2], [2.6, LZ + 1.2]], d ? 16 : 10, { crease: 30, top: false })
  if (d) {
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * Math.PI * 2
      lathe(s.trim, [2.3 * Math.cos(t), 2.3 * Math.sin(t)], [[0.35, LZ + 1.2], [0.35, LZ + 6.0]], 8)
    }
    lathe(s.trim, [0, 0], [[1.3, LZ + 1.2], [1.3, LZ + 6.0]], 10) // the inner core seen through the arcade
    lathe(s.trim, [0, 0], [[2.8, LZ + 6.0], [2.8, LZ + 6.9], [2.4, LZ + 6.9]], 16, { crease: 30, bottom: true })
  } else {
    // low: a plain octagonal lantern with a glazed band
    lathe(s.trim, [0, 0], [[2.5, LZ + 1.2], [2.5, LZ + 2.0]], 8)
    lathe(s.win, [0, 0], [[2.45, LZ + 2.0], [2.45, LZ + 5.4]], 8)
    lathe(s.trim, [0, 0], [[2.5, LZ + 5.4], [2.5, LZ + 6.9]], 8)
  }
  const cup: [number, number][] = [[2.4, LZ + 6.9]]
  for (let i = 1; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2) * 0.9; cup.push([2.4 * Math.cos(t), LZ + 6.9 + 3.0 * Math.sin(t)]) }
  lathe(s.patina, [0, 0], cup, d ? 16 : 10, { top: true })
  const cz = cup[cup.length - 1][1]
  lathe(s.patina, [0, 0], [[0.5, cz - 0.1], [0.5, cz + 0.8], [0.7, cz + 1.0], [0.15, cz + 1.4], [0.08, 59.5 - 0.0]], 8, { crease: 30 })

  // ---- Glazed barrel roofs over the galleria, north and south of the dome ----
  const R = 5.67, rise = 3.0, half = 5.0
  const vault = (y0: number, y1: number) => {
    const prof2: XY[] = []
    const a0 = Math.asin(half / R), n = d ? 10 : 6
    for (let i = 0; i <= n; i++) { const t = -a0 + (2 * a0 * i) / n; prof2.push([R * Math.sin(t), 20.2 + rise - R + R * Math.cos(t)]) }
    for (let i = 0; i < n; i++) {
      const [x0, z0] = prof2[i], [x1, z1] = prof2[i + 1]
      face(s.glass, [[x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0]], [(x0 + x1) / 2, 0, (z0 + z1) / 2 - (20.2 + rise - R)])
    }
    // gable ends in glass, low upstand walls in stone
    for (const y of [y0, y1]) face(s.glass, prof2.map(([x, z]) => [x, y, z] as V3), [0, y === y0 ? -1 : 1, 0])
    box(s.stone, [0, (y0 + y1) / 2], half + 0.3, (y1 - y0) / 2, ROOF, 20.2, 0)
    if (d) for (let y = y0 + 4.5; y < y1 - 1; y += 4.5) tube(s.trim, prof2.map(([x, z]) => [x * 1.01, y, z + 0.05] as V3), 0.1, 3)
  }
  vault(10.4, PN - 0.3)
  vault(PS + 0.3, -10.4)
}

// ---- Materials and output --------------------------------------------------------------------------------

const wash = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[2] < 4.4 ? 0.3 : 0.75)
const STONE: MaterialSpec = { ...finish('qvb-sandstone', 0xc8956a), floodlight: wash }
const TRIM: MaterialSpec = { ...finish('qvb-pale-sandstone', 0xdcb48a), floodlight: wash }
const PATINA: MaterialSpec = { ...PALETTE.patina, color: 0x98b896, floodlight: (p, n) => (p[2] > 28 && p[2] < 46 ? 0.55 : 0.2) }
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.trim, material: TRIM },
  { part: s.win, material: PALETTE.window },
  { part: s.patina, material: PATINA },
  { part: s.roof, material: PALETTE.roof },
  { part: s.glass, material: PALETTE.glass },
]

if (import.meta.main) {
  await saveLods('sydney-queen-victoria-building', 'Queen Victoria Building', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, street level', bearing: 357.5,
  }, 6500)
}
