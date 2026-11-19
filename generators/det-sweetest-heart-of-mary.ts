/**
 * Sweetest Heart of Mary Church (4440 Russell Street at Canfield, Detroit,
 * 1893, Spier & Rohns): procedural, CC0-1.0.
 * bun generators/det-sweetest-heart-of-mary.ts
 *
 * Map frame: x, y, z up, metres, turned to the church's walls: +y runs
 * along bearing 64.5 (east-north-east, from the front on Russell Street to
 * the apse), +x along 154.5 (towards Canfield Street). The anchor is the
 * centroid of the OSM outline way/330298873 (42.3582724, -83.0477721); the
 * catalog bearing is 64.5. The front is the -y face.
 *
 * Identity, in order: the twin west towers in red brick on a rough grey
 * limestone base, each with a belfry of tall paired lancets, a crown of four
 * steep gables with white pinnacles at the corners and a tall dark slate
 * octagonal spire; the steep central gable between them over the big
 * traceried window and the three stone portals; the steep pale slate roof
 * with a gablet over every bay of the sides, white-capped buttresses
 * between; the transepts with their great traceried windows and gabled
 * porches.
 *
 * Evidence:
 *  - plan: OSM way/330298873 (Q7655678): front 27.4 m wide, towers about
 *    8.8 m square (y -32.1..-23.4), nave and aisles under one roof 22.4 m
 *    wide, transepts to x = ±17.1 (y 2.3..15.2), chancel and polygonal apse
 *    to y = 32.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; it sits about 1 m towards +x of OSM. Heights above the
 *    street (which falls about 1 m from the front to the back): spire tips
 *    64.3 and 63.9 (north and south tower), the tower shafts 7-8 m across
 *    above 30 m; nave, transept and chancel ridges 26.5, eaves about 15;
 *    the gablets rise to about 20.
 *  - photos: the towers' stages (stone base to 11.5, single traceried
 *    window, triple lancets, the paired belfry lancets, gable crown at 36),
 *    the portals, the central gable and its window, the gablets and
 *    buttresses, the transept window and porch. Colours: red brick
 *    (`shm-brick`), grey limestone and white trim (`shm-stone`), dark slate
 *    spires (`shm-slate`), the nave roof in pale grey slate (palette roof,
 *    as in the 2013 photos and NAIP; the 2008 photo shows it darker).
 *  Estimated: the stage heights and window sizes, from the front photo
 *  scaled to the 27.4 m front; the crosses (2 m) over the lidar tips.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Sweetest_Heart_of_Mary_Catholic_Church_(Detroit,_MI)_-_exterior.jpg,
 *    Nheyob, CC BY-SA 3.0 (the front, from the west-south-west)
 *  - Sweetest_Heart_of_Mary_Catholic_Church_(Detroit,_MI)_-_exterior,_side_portal.jpg,
 *    Nheyob, CC BY-SA 3.0 (a transept end and its porch)
 *  - SweetestHeartOfMaryRCC.jpg, Andrew Jameson, CC BY-SA 3.0 (front and
 *    south side from Russell and Canfield)
 *  - Sweetest_Heart_of_Mary_Catholic_Church,_Detroit,_Michigan_01.jpg,
 *    Stephanie A. Terry, CC BY-SA 4.0 (the side bays: rose-headed windows,
 *    gablets, buttress caps)
 * USGS NAIP orthophoto (public domain) for the roof. No commercial imagery.
 *
 * Doubts: no open photo of the north side or the apse; both are drawn from
 * the plan and lidar with the south side's bays. The low south sacristy is a
 * plain box; the north one is a separate OSM building (way/875609358) and is
 * left to the map. The spires' small dormers are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, arc, lathe } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A pointed (equilateral) arch: jambs from z0 to the springing zs. */
const lancet = (sc: number, w: number, z0: number, zs: number, n = 4): XY[] => [
  [sc - w / 2, z0], [sc + w / 2, z0],
  ...arc(sc - w / 2, zs, w, 0, 60, n),
  ...arc(sc + w / 2, zs, w, 120, 180, n).slice(1),
]
const apex = (w: number, zs: number) => zs + w * Math.sin(Math.PI / 3)
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}
function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
function box(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1); walls(p, r, z0, z1); if (top) cap(top, r, z1)
}
/** A square pinnacle: shaft and a four-sided spike. */
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number, tip: number) {
  box(p, null, x - h, y - h, x + h, y + h, z0, z1)
  const r = rect(x - h - 0.08, y - h - 0.08, x + h + 0.08, y + h + 0.08)
  for (let i = 0; i < 4; i++) { const a = r[i], b = r[(i + 1) % 4]; p.tri([a[0], a[1], z1], [b[0], b[1], z1], [x, y, tip]) }
}
// faces: front (normal -y, s = x), back (+y, s = -x), south (+x, s = y), north (-x, s = -y)
const F = {
  front: (y: number): Face => ({ o: [0, y, 0], n: [0, -1] }),
  back: (y: number): Face => ({ o: [0, y, 0], n: [0, 1] }),
  south: (x: number): Face => ({ o: [x, 0, 0], n: [1, 0] }),
  north: (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] }),
}

const NW = 11.2, EAVE = 15, RIDGE = 26.5 // nave half-width, eave, ridge
const FRONT = -32.1, TBACK = -23.4, TR0 = 2.3, TR1 = 15.2, TX = 17.1, CH1 = 25
const BASE = 11.5 // top of the limestone base on the front

type P = { brick: Part; stone: Part; win: Part; slate: Part; roof: Part; door: Part }

/** A gabled roof over x0..x1 (ridge along y) from y0 to y1, with optional gable walls. */
function roofY(o: P, hw: number, y0: number, y1: number, ends: [boolean, boolean]) {
  const ov = 0.4, sl = (RIDGE - EAVE) / hw
  for (const s of [-1, 1]) qf(o.roof, [s * (hw + ov), y0, EAVE - ov * sl], [s * (hw + ov), y1, EAVE - ov * sl], [0, y1, RIDGE], [0, y0, RIDGE], [s, 0, 1])
  if (ends[0]) tf(o.brick, [-hw, y0, EAVE], [hw, y0, EAVE], [0, y0, RIDGE], [0, -1, 0])
  if (ends[1]) tf(o.brick, [-hw, y1, EAVE], [hw, y1, EAVE], [0, y1, RIDGE], [0, 1, 0])
}

/** Gablets over the bays of a side wall at x = s·NW, between the given buttress positions. */
function sideBays(o: P, s: number, ys: number[], gableTop = 20.6) {
  const xr = NW * (RIDGE - gableTop) / (RIDGE - EAVE) // where the gablet ridge meets the roof
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i] + 0.45, y1 = ys[i + 1] - 0.45, ym = (y0 + y1) / 2, w = y1 - y0
    // the gablet: a brick triangle in the wall plane, its two roofs back to the main roof, stone copings
    tf(o.brick, [s * NW, y0, EAVE], [s * NW, y1, EAVE], [s * NW, ym, gableTop], [s, 0, 0])
    tf(o.roof, [s * NW, y0, EAVE], [s * NW, ym, gableTop], [s * xr, ym, gableTop], [s, -1, 1])
    tf(o.roof, [s * NW, y1, EAVE], [s * NW, ym, gableTop], [s * xr, ym, gableTop], [s, 1, 1])
    const f = s > 0 ? F.south(NW) : F.north(-NW)
    const sy = (y: number) => (s > 0 ? y : -y)
    for (const [a, b] of [[y0 - 0.2, ym], [y1 + 0.2, ym]]) {
      const za = EAVE - 0.2, zb = gableTop + 0.25, d = 0.22
      flatShape(o.stone, f, [[sy(a), za], [sy(a) + (sy(b) > sy(a) ? 0.5 : -0.5), za], [sy(b), zb - 0.55], [sy(b), zb]].map(([u, z]) => [u, z] as XY), 0.06)
      void d
    }
    // the bay's tall window with its rose head, reaching into the gablet
    const ww = Math.min(2.6, w - 1.4)
    flatShape(o.stone, f, lancet(sy(ym), ww + 0.4, 4.6, 14.2), 0.03)
    flatShape(o.win, f, lancet(sy(ym), ww, 4.8, 14.2), 0.06)
  }
  // buttresses with white caps and small gabled pinnacles
  for (const y of ys) {
    box(o.brick, null, s > 0 ? NW : -NW - 0.9, y - 0.45, s > 0 ? NW + 0.9 : -NW, y + 0.45, 0, EAVE - 1.2)
    qf(o.stone, [s * (NW + 0.9), y - 0.5, EAVE - 1.2], [s * (NW + 0.9), y + 0.5, EAVE - 1.2], [s * NW, y + 0.5, EAVE + 0.2], [s * NW, y - 0.5, EAVE + 0.2], [s, 0, 1])
    pinnacle(o.stone, s * (NW + 0.15), y, 0.35, EAVE - 0.6, EAVE + 2.2, EAVE + 4.6)
  }
}

/** A tower: limestone base, brick shaft with corner buttresses, belfry, gable crown, pinnacles, spire. */
function tower(o: P, cx: number, tip: number, outer: number) {
  const cy = (FRONT + TBACK) / 2, h0 = 4.4, h = 4.1, CROWN = 36
  box(o.stone, null, cx - h0, cy - h0, cx + h0, cy + h0, 0, BASE)
  walls(o.stone, rect(cx - h0, cy - h0, cx + h0, cy + h0), BASE, BASE + 0.6, rect(cx - h, cy - h, cx + h, cy + h))
  box(o.brick, null, cx - h, cy - h, cx + h, cy + h, BASE + 0.6, CROWN)
  // corner buttresses, stepped
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = cx + sx * (h - 0.55), y = cy + sy * (h - 0.55)
    box(o.brick, null, x - 0.9, y - 0.9, x + 0.9, y + 0.9, BASE + 0.6, 33.5)
    box(o.stone, o.stone, x - 0.95, y - 0.95, x + 0.95, y + 0.95, 33.5, 34.1)
  }
  // string courses
  for (const z of [19.6, 24.5]) {
    const r = rect(cx - h - 0.3, cy - h - 0.3, cx + h + 0.3, cy + h + 0.3)
    walls(o.stone, r, z, z + 0.45); cap(o.stone, r, z + 0.45)
  }
  const faces: { f: Face; c: number; low: boolean }[] = [
    { f: F.front(cy - h), c: cx, low: true },
    { f: F.back(cy + h), c: -cx, low: false },
    { f: F.south(cx + h), c: cy, low: outer > 0 },
    { f: F.north(cx - h), c: -cy, low: outer < 0 },
  ]
  for (const { f, c, low } of faces) {
    if (low) {
      // a traceried window over the base, then triple lancets
      flatShape(o.stone, f, lancet(c, 2.2, 13.0, 16.4), 0.03)
      flatShape(o.win, f, lancet(c, 1.8, 13.2, 16.4), 0.06)
      for (const d of [-1.1, 0, 1.1]) flatShape(o.win, f, lancet(c + d, 0.7, 20.6, d === 0 ? 23.4 : 23.0, 3), 0.06)
    }
    // the belfry: two tall lancets in a stone-edged recess
    flatShape(o.stone, f, lancet(c, 4.4, 25.4, 33.4), 0.02)
    for (const d of [-1.0, 1.0]) flatShape(o.win, f, lancet(c + d, 1.4, 25.8, 33.0, 3), 0.06)
    // the crown gable on this face, its small triangular opening
    const g: XY[] = [[c - h, CROWN], [c + h, CROWN], [c, CROWN + 7.5]]
    flatShape(o.brick, f, g, 0.0)
    flatShape(o.win, f, [[c - 0.9, CROWN + 2.2], [c + 0.9, CROWN + 2.2], [c, CROWN + 3.6]], 0.05)
    // stone copings along the rakes
    for (const s of [-1, 1]) flatShape(o.stone, f, [[c + s * (h + 0.15), CROWN - 0.1], [c + s * (h - 0.6), CROWN - 0.1], [c, CROWN + 7.0], [c, CROWN + 7.9]], 0.08)
  }
  // the gables' roofs back to the spire (slate)
  const G = CROWN + 7.5, rs = 3.5
  for (const [nx, ny] of [[0, -1], [0, 1], [1, 0], [-1, 0]]) {
    const tx = -ny, ty = nx // along the face
    const P = (t: number, d: number, z: number): V3 => [cx + nx * d + tx * t, cy + ny * d + ty * t, z]
    for (const s of [-1, 1]) qf(o.slate, P(s * h, h, CROWN), P(s * h, rs * 0.4, CROWN), P(0, rs * 0.4, G), P(0, h, G), [nx + s * tx, ny + s * ty, 1])
  }
  // corner pinnacles, white
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) pinnacle(o.stone, cx + sx * (h - 0.4), cy + sy * (h - 0.4), 0.55, 34.1, 41.5, 47.5)
  // the spire
  lathe(o.slate, cx, cy, [[rs, CROWN], [0.12, tip - 1.8]], 8, 22.5, 382.5)
  lathe(o.stone, cx, cy, [[rs * 0.58 + 0.08, 47.6], [rs * 0.54 + 0.08, 48.4]], 8, 22.5, 382.5)
  lathe(o.stone, cx, cy, [[rs * 0.33 + 0.06, 54.6], [rs * 0.30 + 0.06, 55.3]], 8, 22.5, 382.5)
  box(o.stone, o.stone, cx - 0.08, cy - 0.08, cx + 0.08, cy + 0.08, tip - 1.9, tip)
  box(o.stone, o.stone, cx - 0.5, cy - 0.08, cx + 0.5, cy + 0.08, tip - 0.75, tip - 0.5)
  // the side portal on the front, under a stone gable
  const pf = F.front(cy - h0)
  flatShape(o.stone, pf, [[cx - 1.7, 0], [cx + 1.7, 0], [cx + 1.7, 5.4], [cx, 8.6], [cx - 1.7, 5.4]], 0.25)
  flatShape(o.door, pf, lancet(cx, 1.8, 0, 3.1), 0.3)
}

function build() {
  const o: P = { brick: new Part(), stone: new Part(), win: new Part(), slate: new Part(), roof: new Part(), door: new Part() }

  // ---------------------------------------------------------------- nave, transepts, chancel, apse
  walls(o.brick, [[-NW, TBACK], [-NW, TR0], [NW, TR0], [NW, TBACK]].reverse() as XY[], 0, EAVE)
  roofY(o, NW, FRONT + 0.7, TR0, [false, false])
  roofY(o, NW, TR1, CH1, [false, false])
  // transept: walls, roof with the ridge along x, gable ends
  {
    walls(o.brick, rect(-TX, TR0, TX, TR1), 0, EAVE)
    const hw = (TR1 - TR0) / 2, ym = (TR0 + TR1) / 2, ov = 0.4, sl = (RIDGE - EAVE) / hw
    for (const s of [-1, 1]) qf(o.roof, [-TX - 0.3, ym + s * (hw + ov), EAVE - ov * sl], [TX + 0.3, ym + s * (hw + ov), EAVE - ov * sl], [TX + 0.3, ym, RIDGE], [-TX - 0.3, ym, RIDGE], [0, s, 1])
    for (const s of [-1, 1]) {
      tf(o.brick, [s * TX, TR0, EAVE], [s * TX, TR1, EAVE], [s * TX, ym, RIDGE], [s, 0, 0])
      const f = s > 0 ? F.south(TX) : F.north(-TX), c = s > 0 ? ym : -ym
      // stone copings on the gable
      for (const k of [-1, 1]) flatShape(o.stone, f, [[c + k * (hw + 0.2), EAVE - 0.2], [c + k * (hw - 0.5), EAVE - 0.2], [c, RIDGE - 0.4], [c, RIDGE + 0.4]], 0.08)
      // the great window with its rose, and lancets in the gable
      flatShape(o.stone, f, lancet(c, 6.0, 7.6, 15.4, 6), 0.03)
      flatShape(o.win, f, lancet(c, 5.4, 7.8, 15.4, 6), 0.06)
      flatShape(o.stone, f, arc(c, 16.2, 2.2, 0, 360, 12).slice(0, 12), 0.08)
      flatShape(o.win, f, arc(c, 16.2, 1.8, 0, 360, 12).slice(0, 12), 0.1)
      flatShape(o.stone, f, R(c - 0.09, 7.8, c + 0.09, 14.0), 0.09)
      for (const d of [-1.0, 0, 1.0]) flatShape(o.win, f, lancet(c + d, 0.55, 19.2, d === 0 ? 21.6 : 21.0, 3), 0.06)
      // the gabled porch with its green copper roof (palette roof here) and wooden doors
      const px = s * TX, d = 3.0, pw = 2.4, pe = 4.6, pa = 8.0
      walls(o.brick, rect(s > 0 ? px : px - d, ym - pw, s > 0 ? px + d : px, ym + pw), 0, pe)
      const xo = px + s * d
      tf(o.brick, [xo, ym - pw, pe], [xo, ym + pw, pe], [xo, ym, pa], [s, 0, 0])
      for (const k of [-1, 1]) qf(o.roof, [px, ym + k * (pw + 0.3), pe - 0.3], [xo + s * 0.3, ym + k * (pw + 0.3), pe - 0.3], [xo + s * 0.3, ym, pa], [px, ym, pa], [0, k, 1])
      const pf = s > 0 ? F.south(xo) : F.north(xo)
      flatShape(o.door, pf, lancet(c, 1.9, 0, 3.0), 0.06)
    }
    // windows on the transepts' east and west faces
    for (const s of [-1, 1]) for (const [y, f] of [[TR0, F.front(TR0)], [TR1, F.back(TR1)]] as [number, Face][]) {
      const c = y === TR0 ? s * 14.15 : -s * 14.15
      flatShape(o.win, f, lancet(c, 2.0, 4.6, 12.0), 0.06)
    }
  }
  // chancel walls and the apse
  walls(o.brick, [[-NW, TR1], [-NW, CH1], [NW, CH1], [NW, TR1]].reverse() as XY[], 0, EAVE)
  {
    const ap: XY[] = [[NW, CH1], [8.0, 30.0], [3.0, 32.0], [-3.0, 32.0], [-8.0, 30.0], [-NW, CH1]]
    for (let i = 0; i < ap.length - 1; i++) {
      const a = ap[i], b = ap[i + 1], m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
      const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      qf(o.brick, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE], [a[0], a[1], EAVE], n)
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nl = Math.hypot(n[0], n[1])
      const ox = n[0] / nl * 0.35, oy = n[1] / nl * 0.35
      tf(o.roof, [a[0] + ox, a[1] + oy, EAVE - 0.3], [b[0] + ox, b[1] + oy, EAVE - 0.3], [0, CH1, RIDGE], [n[0], n[1], 1])
      const f: Face = { o: [a[0], a[1], 0], n: [n[0] / nl, n[1] / nl] }
      flatShape(o.win, f, lancet(L / 2, 1.6, 4.8, 11.8), 0.06)
      void m
    }
  }
  // the low sacristy on the south side of the chancel (the north one is a separate OSM building, way/875609358, left to the map)
  box(o.brick, o.roof, NW, 16.0, 13.6, CH1, 0, 6.5)

  // ---------------------------------------------------------------- the sides: bays, gablets, buttresses
  const nave = [0, 1, 2, 3, 4, 5].map(k => TBACK + 0.5 + k * (TR0 - 0.5 - TBACK - 0.5) / 5)
  const chan = [TR1 + 0.5, (TR1 + CH1) / 2, CH1 - 0.3]
  for (const s of [-1, 1]) { sideBays(o, s, nave); sideBays(o, s, chan, 20.0) }

  // ---------------------------------------------------------------- the front: central bay, gable, portal
  {
    const hw = 4.8, f = F.front(FRONT)
    box(o.stone, null, -hw, FRONT, hw, FRONT + 0.8, 0, BASE)
    // the brick gable wall standing proud of the roof, with stone copings and a cross
    const gable: XY[] = [[-hw, BASE], [hw, BASE], [hw, 19.0], [0, 28.0], [-hw, 19.0]]
    flatShape(o.brick, f, gable, 0)
    flatShape(o.brick, F.back(FRONT + 0.8), gable.map(([u, z]) => [-u, z] as XY), 0)
    for (const k of [-1, 1]) {
      qf(o.brick, [k * hw, FRONT, 19.0], [0, FRONT, 28.0], [0, FRONT + 0.8, 28.0], [k * hw, FRONT + 0.8, 19.0], [k, 0, 1])
      flatShape(o.stone, f, [[k * (hw + 0.1), 18.8], [k * (hw - 0.6), 18.8], [0, 27.5], [0, 28.4]], 0.08)
    }
    box(o.stone, o.stone, -0.1, FRONT + 0.3, 0.1, FRONT + 0.5, 28.0, 30.0)
    box(o.stone, o.stone, -0.6, FRONT + 0.3, 0.6, FRONT + 0.5, 29.1, 29.35)
    // the great window: a pointed arch with a rose in its head
    flatShape(o.stone, f, lancet(0, 6.0, 11.9, 16.2, 6), 0.03)
    flatShape(o.win, f, lancet(0, 5.4, 12.1, 16.2, 6), 0.06)
    flatShape(o.stone, f, arc(0, 17.4, 2.25, 0, 360, 12).slice(0, 12), 0.08)
    flatShape(o.win, f, arc(0, 17.4, 1.85, 0, 360, 12).slice(0, 12), 0.1)
    flatShape(o.stone, f, R(-0.09, 12.1, 0.09, 15.2), 0.09)
    // three lancets in the gable
    for (const d of [-1.1, 0, 1.1]) flatShape(o.win, f, lancet(d, 0.7, 22.0, d === 0 ? 24.4 : 23.8, 3), 0.06)
    // a stone band of crosses over the base: a white string course
    const sc = rect(-hw, FRONT - 0.25, hw, FRONT + 0.8)
    walls(o.stone, sc, BASE - 0.6, BASE); cap(o.stone, sc, BASE)
    // the main portal under its gabled stone hood
    const pf = F.front(FRONT - 0.9)
    box(o.stone, null, -2.6, FRONT - 0.9, 2.6, FRONT, 0, 7.0)
    for (const k of [-1, 1]) qf(o.stone, [k * 2.8, FRONT - 1.0, 7.0], [0, FRONT - 1.0, 10.4], [0, FRONT, 10.4], [k * 2.8, FRONT, 7.0], [k, -0.2, 1])
    flatShape(o.stone, pf, [[-2.6, 7.0], [2.6, 7.0], [0, 10.2]], 0.0)
    flatShape(o.door, pf, lancet(0, 3.4, 0, 4.9, 5), 0.06)
  }

  // ---------------------------------------------------------------- the towers (north at -x, south at +x)
  tower(o, -9.2, 66.3, -1)
  tower(o, 9.2, 65.9, 1)

  return [
    { part: o.brick, material: finish('shm-brick', 0xa9564c) },
    { part: o.stone, material: finish('shm-stone', 0xdbd6cb) },
    { part: o.win, material: PALETTE.window },
    { part: o.slate, material: finish('shm-slate', 0x6c7378) },
    { part: o.roof, material: PALETTE.roof },
    { part: o.door, material: finish('shm-door', 0x7a5a3c) },
  ]
}

if (import.meta.main) { const b = build(); console.log(b.map(x => x.material.name + ' ' + x.part.triangles).join(', ')); await save('det-sweetest-heart-of-mary', 'Sweetest Heart of Mary Church', [42.3582724, -83.0477721], 64.5, b, 6500) }
