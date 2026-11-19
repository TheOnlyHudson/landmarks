/**
 * Basilica of Sainte Anne de Détroit (1000 Ste Anne Street, Detroit; 1886-87,
 * Albert E. French; minor basilica 2020): procedural, CC0-1.0.
 * bun generators/det-ste-anne.ts
 *
 * Map frame: x, y, z up, metres, turned to the church's walls: +y runs along
 * bearing 336.5 (north-north-west, from the apse to the front on Ste Anne
 * Street), +x along 66.5. The anchor is the centroid of the OSM outline
 * way/369284006 (42.3205462, -83.0765876); the catalog bearing is 336.5. The
 * front is the +y face.
 *
 * Identity, in order: the twin front towers in red brick on a grey
 * sandstone base, each with paired lancets, a louvred belfry of paired
 * lancets with corner pinnacles, a pale stone crown band and a very tall dark
 * slate octagonal spire; the steep central gable between them with its big
 * rose window, flanked by small turrets, over three gabled stone portals;
 * the steep dark slate roofs of the nave and of the transepts with their
 * great pointed windows; the lean-to aisle roofs under a clerestory; the
 * polygonal apse with its hipped roof; the small fleche over the crossing.
 *
 * Evidence:
 *  - plan: OSM way/369284006 (Q1810425), read in this frame: front 31 m
 *    wide at y = 41.7; tower block y 34..41.7, x to ±15.4; nave and aisles
 *    x ±10.8; transepts x ±15.4, y -1.3..15.1; choir x -11.7..10.7 to
 *    y -15.8; behind it the attached sacristy and parish wings to y -43.3,
 *    x -11.7..12.5.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m and 1 m
 *    grids in this frame. Heights above the street (ground relief under the
 *    church about 1 m): spire returns to 55.6 (west) and 55.3 (east) beside
 *    the axis, so the tips are put at 57 with 1.8 m crosses; belfry tops
 *    about 36 with returns at 42.6 from the corner pinnacles / spire base;
 *    the towers' shafts 6.5-7 m across, centred x ±12.2, y 37.5; nave,
 *    transept and choir ridges 27.5; clerestory eaves 19.6 at x ±6; aisle
 *    lean-tos 10.5-13 between x ±6 and ±10.8; the crossing fleche 32; the
 *    choir ridge ends near y -10, the apse hip down to 19.8 at y -12; the
 *    cross wing behind the apse ridge 15 (y -18.9), eaves 10-11; rear blocks
 *    14 m (x -11.7..4, y -43..-31), 10 m (x 4..12.5) and 4.5 m (between).
 *  - photos: the stage heights of the towers and the front (stone base to
 *    7.3 m, portals, string courses, rose window centre 15 m with outer
 *    radius 3.6 m, gable cornice 20 m), scaled from the front photos to the
 *    31 m front; the nave's side bays (4) with aisle and clerestory lancets;
 *    the transept window; the apse; the gabled cross wing behind it.
 *  - colours: orange-red brick, grey-buff sandstone base and pale stone
 *    trim, dark slate roofs and spires (from all the photos).
 *  Estimated: stage heights and window sizes (photos), the fleche (lidar
 *  single return and photos), the rear blocks' fronts (lidar only).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Basilica_of_Sainte_Anne_de_Détroit_2025a.jpg, Antony-22, CC BY-SA 4.0
 *    (front, from the north-north-west, axis)
 *  - Basilica_of_Sainte_Anne_de_Détroit_2025b.jpg, Antony-22, CC BY-SA 4.0
 *    (front and east side, from the north-north-east)
 *  - Basilica_of_Sainte_Anne_de_Détroit_2025c.jpg, Antony-22, CC BY-SA 4.0
 *    (the west side, transept, apse and cross wing, from the south-west)
 *  - Sainte_Anne_de_Detroit_Catholic_Church_(Detroit,_MI)_-_exterior.jpg,
 *    Nheyob, CC BY-SA 3.0 (front)
 *  - Sainte_Anne_de_Detroit_Catholic_Church_(Detroit,_MI)_-_exterior,_side.jpg,
 *    Nheyob, CC BY-SA 3.0 (the east side, apse to tower)
 *  - Ste_Anne_de_Detroit.jpg, Andrew Jameson, CC BY-SA 3.0 (front)
 *  - Detroit_st_anne.jpg, Mike Russell, CC BY-SA 3.0 (the west side from the
 *    bridge approach: tower, nave, transept gable, hipped apse)
 *  - St_Anne's_Church.jpg, David Silverman, CC BY 2.0 (west side, apse)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the brief described yellow-buff brick and flying buttresses on
 * the apse; every photo shows orange-red brick, and no flying buttresses,
 * so neither is drawn. Which side the gabled cross wing behind the apse
 * shows its gable on is read from the 2025c photo and the lidar (ridge
 * along x); its east end and the rear parish blocks have no photo and are
 * plain brick boxes from lidar heights. The fleche is from one lidar return
 * and the side photos. The pale stone of the base and trim are one
 * material. Copper ridge and rib flashings are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, arc, lathe } from './sea-tacoma-union-station'

/** A pointed (equilateral) arch outline: jambs from z0 to the springing zs. */
const lancet = (sc: number, w: number, z0: number, zs: number, n = 4): XY[] => [
  [sc - w / 2, z0], [sc + w / 2, z0],
  ...arc(sc - w / 2, zs, w, 0, 60, n),
  ...arc(sc + w / 2, zs, w, 120, 180, n).slice(1),
]
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
// faces: front (+y, s = -x), back (-y, s = x), east (+x, s = y), west (-x, s = -y)
const F = {
  front: (y: number): Face => ({ o: [0, y, 0], n: [0, 1] }),
  back: (y: number): Face => ({ o: [0, y, 0], n: [0, -1] }),
  east: (x: number): Face => ({ o: [x, 0, 0], n: [1, 0] }),
  west: (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] }),
}
/** s on a side face for plan coordinate y. */
const sSide = (side: number, y: number) => (side > 0 ? y : -y)

// plan and heights (see header)
const YF = 41.6, TY0 = 34.4 // front, back of the tower block
const AW = 10.8, CW = 6.2 // aisle wall, clerestory wall half-widths
const AE = 10.5, AL = 13.4 // aisle eave, lean-to top at the clerestory
const EAVE = 19.6, RIDGE = 27.5
const TR0 = -1.3, TR1 = 15.1, TX = 15.4 // transept
const CH = -8.0 // where the choir's straight walls end and the apse begins
const BASE = 7.3 // top of the sandstone base on the front

type P = { brick: Part; stone: Part; win: Part; slate: Part; flat: Part; door: Part }

/** The gabled main roof over x ±CW (ridge along y) from y0 to y1. */
function mainRoof(o: P, y0: number, y1: number) {
  const ov = 0.45, sl = (RIDGE - EAVE) / CW
  for (const s of [-1, 1]) qf(o.slate, [s * (CW + ov), y0, EAVE - ov * sl], [s * (CW + ov), y1, EAVE - ov * sl], [0, y1, RIDGE], [0, y0, RIDGE], [s, 0, 1])
}

/** Aisles and clerestory along y0..y1 on both sides, with bays of windows and buttresses. */
function aisles(o: P, y0: number, y1: number, nb: number) {
  const ov = 0.35, sl = (AL - AE) / (AW - CW)
  for (const s of [-1, 1]) {
    // aisle wall, lean-to roof, clerestory wall
    qf(o.brick, [s * AW, y0, 0], [s * AW, y1, 0], [s * AW, y1, AE], [s * AW, y0, AE], [s, 0, 0])
    qf(o.slate, [s * (AW + ov), y0, AE - ov * sl], [s * (AW + ov), y1, AE - ov * sl], [s * CW, y1, AL], [s * CW, y0, AL], [s * 0.4, 0, 1])
    qf(o.brick, [s * CW, y0, AL - 0.3], [s * CW, y1, AL - 0.3], [s * CW, y1, EAVE], [s * CW, y0, EAVE], [s, 0, 0])
    // a stone cornice line at the aisle eave
    qf(o.stone, [s * (AW + 0.25), y0, AE - 0.6], [s * (AW + 0.25), y1, AE - 0.6], [s * (AW + 0.25), y1, AE - 0.1], [s * (AW + 0.25), y0, AE - 0.1], [s, 0, 0])
    const fa = s > 0 ? F.east(AW) : F.west(-AW), fc = s > 0 ? F.east(CW) : F.west(-CW)
    const pitch = (y1 - y0) / nb
    for (let k = 0; k < nb; k++) {
      const ym = y0 + (k + 0.5) * pitch, c = sSide(s, ym)
      flatShape(o.stone, fa, lancet(c, 2.0, 2.2, 7.4, 4), 0.03)
      flatShape(o.win, fa, lancet(c, 1.6, 2.4, 7.4, 4), 0.06)
      flatShape(o.win, fc, lancet(c, 1.5, 14.2, 17.0, 3), 0.06)
    }
    // buttresses between the bays, stone-capped
    for (let k = 0; k <= nb; k++) {
      const y = y0 + k * pitch
      if (k === 0 || k === nb) continue
      box(o.brick, null, s > 0 ? AW : -AW - 0.7, y - 0.4, s > 0 ? AW + 0.7 : -AW, y + 0.4, 0, AE - 1.6)
      qf(o.stone, [s * (AW + 0.7), y - 0.45, AE - 1.6], [s * (AW + 0.7), y + 0.45, AE - 1.6], [s * AW, y + 0.45, AE - 0.4], [s * AW, y - 0.45, AE - 0.4], [s, 0, 1])
    }
  }
}

/** A front tower: sandstone base, brick shaft, paired lancets, belfry, pinnacles, crown band, spire. */
function tower(o: P, cx: number, tip: number) {
  const cy = (TY0 + YF) / 2, h0 = 3.75, h = 3.6, hb = 3.25, ZB = 26.8, ZC = 35.2
  const r0 = rect(cx - h0, TY0, cx + h0, YF + 0.15)
  walls(o.stone, r0, 0, BASE)
  walls(o.stone, r0, BASE, BASE + 0.5, rect(cx - h, cy - h, cx + h, cy + h))
  box(o.brick, null, cx - h, cy - h, cx + h, cy + h, BASE + 0.5, ZB)
  // stepped corner buttresses up the shaft
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = cx + sx * (h - 0.45), y = cy + sy * (h - 0.45)
    box(o.brick, null, x - 0.7, y - 0.7, x + 0.7, y + 0.7, BASE + 0.5, ZB - 1.2)
    pinnacle(o.stone, x, y, 0.5, ZB - 1.2, ZB + 1.6, ZB + 4.4)
  }
  // string courses
  for (const z of [17.2, ZB - 0.5]) {
    const r = rect(cx - h - 0.25, cy - h - 0.25, cx + h + 0.25, cy + h + 0.25)
    walls(o.stone, r, z, z + 0.5); cap(o.stone, r, z + 0.5)
  }
  // belfry stage, set in
  box(o.brick, null, cx - hb, cy - hb, cx + hb, cy + hb, ZB, ZC)
  // pale stone crown band (a solid balustrade) at the spire's foot
  const rc = rect(cx - hb - 0.3, cy - hb - 0.3, cx + hb + 0.3, cy + hb + 0.3)
  walls(o.stone, rc, ZC, ZC + 1.6); cap(o.stone, rc, ZC + 1.6)
  const outer = Math.sign(cx)
  const faces: { f: Face; c: number; low: boolean }[] = [
    { f: F.front(cy + h), c: -cx, low: true },
    { f: F.back(cy - h), c: cx, low: false },
    { f: F.east(cx + h), c: cy, low: outer > 0 },
    { f: F.west(cx - h), c: -cy, low: outer < 0 },
  ]
  for (const { f, c, low } of faces) {
    const fb: Face = { o: [f.o[0] === 0 ? 0 : cx + (f.n[0] * hb), f.o[1] === 0 ? 0 : cy + f.n[1] * hb, 0], n: f.n }
    if (low) {
      // a single lancet over the base, then the paired lancets under their hood
      flatShape(o.stone, f, lancet(c, 1.7, 10.4, 15.0), 0.03)
      flatShape(o.win, f, lancet(c, 1.3, 10.6, 15.0), 0.06)
      for (const d of [-0.95, 0.95]) {
        flatShape(o.stone, f, lancet(c + d, 1.35, 19.2, 23.4, 3), 0.03)
        flatShape(o.win, f, lancet(c + d, 1.0, 19.4, 23.4, 3), 0.06)
      }
    }
    // the belfry: two tall louvred lancets (dark slate louvres, unlit at night)
    for (const d of [-1.0, 1.0]) {
      flatShape(o.stone, fb, lancet(c + d, 1.5, 27.8, 32.4, 3), 0.03)
      flatShape(o.slate, fb, lancet(c + d, 1.1, 28.0, 32.4, 3), 0.06)
    }
  }
  // the spire: octagonal, dark slate, with a cross
  const rs = 2.75 // the spire's foot sits inside the crown band (photos)
  lathe(o.slate, cx, cy, [[rs, ZC + 1.6], [0.1, tip]], 8, 22.5, 382.5)
  box(o.stone, o.stone, cx - 0.09, cy - 0.09, cx + 0.09, cy + 0.09, tip - 0.3, tip + 1.8)
  box(o.stone, o.stone, cx - 0.55, cy - 0.09, cx + 0.55, cy + 0.09, tip + 0.95, tip + 1.2)
  // the side portal at the tower's inner side: a gabled stone hood
  const pc = -(cx - Math.sign(cx) * 3.6), pf = F.front(YF + 0.65)
  box(o.stone, null, -pc - 1.7, YF, -pc + 1.7, YF + 0.65, 0, 6.0)
  for (const k of [-1, 1]) qf(o.stone, [-pc - k * 1.85, YF + 0.7, 6.0], [-pc, YF + 0.7, 8.0], [-pc, YF, 8.0], [-pc - k * 1.85, YF, 6.0], [-k, 0.3, 1])
  flatShape(o.stone, pf, [[pc - 1.7, 6.0], [pc + 1.7, 6.0], [pc, 7.9]], 0)
  flatShape(o.door, pf, lancet(pc, 2.0, 0, 3.2), 0.05)
}

function build() {
  const o: P = { brick: new Part(), stone: new Part(), win: new Part(), slate: new Part(), flat: new Part(), door: new Part() }

  // ------------------------------------------------------------- nave, choir and the main roof
  aisles(o, TR1, TY0, 4)
  aisles(o, CH, TR0, 1)
  // the nave and choir roofs run in to the crossing, under the transept roof
  mainRoof(o, (TR0 + TR1) / 2, YF)
  mainRoof(o, CH, (TR0 + TR1) / 2)

  // ------------------------------------------------------------- transepts
  {
    const hw = (TR1 - TR0) / 2, ym = (TR0 + TR1) / 2, ov = 0.45, sl = (RIDGE - EAVE) / hw
    walls(o.brick, rect(-TX, TR0, TX, TR1), 0, EAVE)
    for (const s of [-1, 1]) qf(o.slate, [-TX - 0.4, ym + s * (hw + ov), EAVE - ov * sl], [TX + 0.4, ym + s * (hw + ov), EAVE - ov * sl], [TX + 0.4, ym, RIDGE], [-TX - 0.4, ym, RIDGE], [0, s, 1])
    for (const s of [-1, 1]) {
      tf(o.brick, [s * TX, TR0, EAVE], [s * TX, TR1, EAVE], [s * TX, ym, RIDGE], [s, 0, 0])
      const f = s > 0 ? F.east(TX) : F.west(-TX), c = sSide(s, ym)
      // stone copings along the gable
      for (const k of [-1, 1]) flatShape(o.stone, f, [[c + k * (hw + 0.3), EAVE - 0.3], [c + k * (hw - 0.4), EAVE - 0.3], [c, RIDGE - 0.4], [c, RIDGE + 0.45]], 0.08)
      // the great pointed window, with two mullions, and a lancet in the gable
      flatShape(o.stone, f, lancet(c, 6.4, 7.0, 13.6, 6), 0.03)
      flatShape(o.win, f, lancet(c, 5.8, 7.2, 13.6, 6), 0.06)
      for (const d of [-0.95, 0.95]) flatShape(o.stone, f, [[c + d - 0.09, 7.2], [c + d + 0.09, 7.2], [c + d + 0.09, 17.4], [c + d - 0.09, 17.4]], 0.09)
      flatShape(o.win, f, lancet(c, 0.8, 21.0, 22.8, 3), 0.06)
      // small windows under it
      for (const d of [-2.4, 2.4]) flatShape(o.win, f, lancet(c + d, 1.3, 1.8, 4.6, 3), 0.06)
      // corner buttresses with stone caps and pinnacles
      for (const y of [TR0 + 0.5, TR1 - 0.5]) {
        box(o.brick, null, s > 0 ? TX : -TX - 0.8, y - 0.5, s > 0 ? TX + 0.8 : -TX, y + 0.5, 0, EAVE - 1.5)
        pinnacle(o.stone, s * (TX + 0.2), y, 0.45, EAVE - 1.5, EAVE + 1.2, EAVE + 3.4)
      }
    }
    // tall lancets on the transepts' front and back faces
    for (const s of [-1, 1]) {
      flatShape(o.win, F.front(TR1), lancet(-s * 13.1, 1.8, 4.0, 14.5, 4), 0.06)
      flatShape(o.win, F.back(TR0), lancet(s * 13.1, 1.8, 4.0, 14.5, 4), 0.06)
    }
  }

  // ------------------------------------------------------------- the fleche over the crossing
  {
    const ym = (TR0 + TR1) / 2
    lathe(o.brick, 0, ym, [[1.0, RIDGE - 1.2], [1.0, RIDGE + 2.2]], 8, 22.5, 382.5)
    lathe(o.stone, 0, ym, [[1.2, RIDGE + 2.2], [1.2, RIDGE + 2.6]], 8, 22.5, 382.5)
    lathe(o.slate, 0, ym, [[1.2, RIDGE + 2.6], [0.06, RIDGE + 8.0]], 8, 22.5, 382.5)
  }

  // ------------------------------------------------------------- the apse and its ambulatory
  {
    const inner: XY[] = [[CW, CH], [CW, -10.0], [2.6, -13.2], [-2.6, -13.2], [-CW, -10.0], [-CW, CH]]
    const outer: XY[] = [[AW, CH], [AW, -12.0], [7.0, -15.8], [-7.0, -15.8], [-AW, -12.0], [-AW, CH]]
    const A: V3 = [0, CH, RIDGE]
    const eaveRing: XY[] = [[CW + 0.45, CH], [CW + 0.45, -10.19], [2.79, -13.65], [-2.79, -13.65], [-CW - 0.45, -10.19], [-CW - 0.45, CH]]
    for (let i = 0; i < inner.length - 1; i++) {
      const a = inner[i], b = inner[i + 1]
      // the ring runs clockwise round the apse, so the outward normal is (-dy, dx)
      const no: V3 = [-(b[1] - a[1]), b[0] - a[0], 0]
      qf(o.brick, [a[0], a[1], AL - 0.3], [b[0], b[1], AL - 0.3], [b[0], b[1], EAVE], [a[0], a[1], EAVE], no)
      const nl = Math.hypot(no[0], no[1])
      // the hip roof: eaves on a ring pushed out 0.45 m (same overhang and eave height as the main roof)
      const ez = EAVE - 0.45 * (RIDGE - EAVE) / CW
      tf(o.slate, [...eaveRing[i], ez] as V3, [...eaveRing[i + 1], ez] as V3, A, [no[0], no[1], 1])
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L > 2.5) flatShape(o.win, { o: [a[0], a[1], 0], n: [no[0] / nl, no[1] / nl] }, lancet(-L / 2, 1.5, 14.2, 17.0, 3), 0.06)
      // ambulatory: outer wall and lean-to roof to the clerestory
      const c = outer[i], d = outer[i + 1], m: V3 = [-(d[1] - c[1]), d[0] - c[0], 0]
      qf(o.brick, [c[0], c[1], 0], [d[0], d[1], 0], [d[0], d[1], AE - 1.0], [c[0], c[1], AE - 1.0], m)
      qf(o.slate, [c[0], c[1], AE - 1.0], [d[0], d[1], AE - 1.0], [b[0], b[1], AL], [a[0], a[1], AL], [m[0], m[1], 2])
      const Lo = Math.hypot(d[0] - c[0], d[1] - c[1]), ml = Math.hypot(m[0], m[1])
      if (Lo > 3) flatShape(o.win, { o: [c[0], c[1], 0], n: [m[0] / ml, m[1] / ml] }, lancet(-Lo / 2, 1.5, 2.4, 6.6, 3), 0.06)
    }
  }

  // ------------------------------------------------------------- the cross wing behind the apse
  {
    const x0 = -11.7, x1 = 12.5, y0 = -22.0, y1 = -15.8, ym = (y0 + y1) / 2, e = 10.5, r = 15.2, ov = 0.35, sl = (r - e) / ((y1 - y0) / 2)
    walls(o.brick, rect(x0, y0, x1, y1), 0, e)
    for (const s of [-1, 1]) qf(o.slate, [x0 - 0.3, ym + s * ((y1 - y0) / 2 + ov), e - ov * sl], [x1 + 0.3, ym + s * ((y1 - y0) / 2 + ov), e - ov * sl], [x1 + 0.3, ym, r], [x0 - 0.3, ym, r], [0, s, 1])
    tf(o.brick, [x0, y0, e], [x0, y1, e], [x0, ym, r], [-1, 0, 0])
    tf(o.brick, [x1, y0, e], [x1, y1, e], [x1, ym, r], [1, 0, 0])
    const fw = F.west(x0)
    for (const d of [-1.9, 0, 1.9]) flatShape(o.win, fw, lancet(-ym + d, 1.4, 2.6, 8.0, 3), 0.06)
    flatShape(o.win, fw, lancet(-ym, 0.7, 11.2, 12.6, 3), 0.06)
    for (const k of [-1, 1]) flatShape(o.stone, fw, [[-ym + k * 3.4, e - 0.25], [-ym + k * 2.8, e - 0.25], [-ym, r - 0.3], [-ym, r + 0.35]], 0.08)
    for (const c of [-8, -4]) flatShape(o.win, F.back(y0), [[c - 0.6, 5.6], [c + 0.6, 5.6], [c + 0.6, 8.6], [c - 0.6, 8.6]], 0.06)
  }
  // rear parish blocks (lidar heights; no photo of their backs)
  box(o.brick, o.flat, -11.7, -43.3, 4.0, -31.0, 0, 14.0)
  box(o.brick, o.flat, 4.0, -43.3, 12.5, -22.0, 0, 10.0)
  box(o.brick, o.flat, -11.7, -31.0, 4.0, -22.0, 0, 4.5)
  for (const [x0, y0, x1, y1, z] of [[-11.7, -43.3, 4.0, -31.0, 14.0], [4.0, -43.3, 12.5, -22.0, 10.0]] as number[][]) {
    const r = rect(x0, y0, x1, y1)
    walls(o.stone, r, z - 0.6, z, rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2))
  }
  for (const [f, cs, zs] of [
    [F.back(-43.3), [-9.6, -6.4, -3.2, 0, 1.9 + 4, 9.5], [[2.5, 5.0], [7.5, 10.2]]],
    [F.west(-11.7), [33, 37, 41], [[2.5, 5.0], [7.5, 10.2]]],
    [F.east(12.5), [-41, -37, -33, -29, -25], [[2.5, 5.0], [6.4, 8.6]]],
  ] as [Face, number[], number[][]][]) {
    for (const c of cs) for (const [z0, z1] of zs) flatShape(o.win, f, [[c - 0.65, z0], [c + 0.65, z0], [c + 0.65, z1], [c - 0.65, z1]], 0.06)
  }

  // ------------------------------------------------------------- the front: centre bay, gable, rose, portals
  {
    const hw = 6.5, f = F.front(YF)
    // aisle ends between the frontispiece and the towers, with a stone parapet
    for (const s of [-1, 1]) {
      const xa = s * hw, xb = s * (12.2 - 3.6)
      qf(o.brick, [xa, YF, BASE], [xb, YF, BASE], [xb, YF, AL], [xa, YF, AL], [0, 1, 0])
      box(o.stone, o.stone, Math.min(xa, xb), YF - 0.6, Math.max(xa, xb), YF + 0.1, AL - 0.6, AL + 0.6)
    }
    // the centre bay's clerestory walls and aisle tops between the towers
    for (const s of [-1, 1]) {
      qf(o.brick, [s * CW, TY0, BASE], [s * CW, YF, BASE], [s * CW, YF, EAVE], [s * CW, TY0, EAVE], [s, 0, 0])
      cap(o.slate, rect(s > 0 ? CW : -8.6, TY0, s > 0 ? 8.6 : -CW, YF - 0.6), AL)
    }
    // the sandstone base across the centre
    box(o.stone, null, -12.2 + 3.6, TY0, 12.2 - 3.6, YF, 0, BASE)
    // the frontispiece: brick, standing slightly proud, up to the gable
    const gable: XY[] = [[-hw, BASE], [hw, BASE], [hw, 20.0], [0, RIDGE + 0.1], [-hw, 20.0]]
    flatShape(o.brick, F.front(YF + 0.3), gable, 0)
    for (const k of [-1, 1]) {
      qf(o.brick, [k * hw, YF + 0.3, BASE], [k * hw, YF + 0.3, 20.0], [k * hw, YF - 1.0, 20.0], [k * hw, YF - 1.0, BASE], [k, 0, 0])
      qf(o.brick, [k * hw, YF + 0.3, 20.0], [0, YF + 0.3, RIDGE + 0.1], [0, YF - 1.0, RIDGE + 0.1], [k * hw, YF - 1.0, 20.0], [k, 0, 1])
      flatShape(o.stone, F.front(YF + 0.3), [[k * (hw + 0.15), 19.8], [k * (hw - 0.6), 19.8], [0, RIDGE - 0.4], [0, RIDGE + 0.5]], 0.08)
      // the corner turrets, with stone caps
      pinnacle(o.brick, k * hw, YF + 0.1, 0.6, BASE, 21.6, 21.6)
      lathe(o.stone, k * hw, YF + 0.1, [[0.75, 21.6], [0.75, 22.2], [0.05, 24.0]], 8, 22.5, 382.5)
    }
    // cross on the gable
    box(o.stone, o.stone, -0.1, YF - 0.1, 0.1, YF + 0.1, RIDGE, RIDGE + 1.9)
    box(o.stone, o.stone, -0.55, YF - 0.1, 0.55, YF + 0.1, RIDGE + 1.05, RIDGE + 1.3)
    // string courses and the blind arcade band over the base
    const fp = F.front(YF + 0.3)
    flatShape(o.stone, fp, [[-hw, BASE + 2.6], [hw, BASE + 2.6], [hw, BASE + 3.1], [-hw, BASE + 3.1]], 0.06)
    for (let k = 0; k < 9; k++) flatShape(o.stone, fp, lancet(-hw + 0.75 + k * (2 * hw - 1.5) / 8, 0.95, BASE + 0.5, BASE + 1.9, 3), 0.04)
    flatShape(o.stone, fp, [[-hw, 19.6], [hw, 19.6], [hw, 20.1], [-hw, 20.1]], 0.06)
    // the rose window: a stone ring and a dark disc
    flatShape(o.stone, fp, arc(0, 15.0, 3.6, 0, 360, 16).slice(0, 16), 0.04)
    flatShape(o.win, fp, arc(0, 15.0, 3.0, 0, 360, 16).slice(0, 16), 0.08)
    // three lancets in the gable
    for (const d of [-1.3, 0, 1.3]) flatShape(o.win, fp, lancet(d, 0.75, 21.4, d === 0 ? 23.6 : 22.9, 3), 0.06)
    // the central portal under its gabled hood
    const pf = F.front(YF + 0.9)
    box(o.stone, null, -2.2, YF, 2.2, YF + 0.9, 0, 6.6)
    for (const k of [-1, 1]) qf(o.stone, [k * 2.35, YF + 0.95, 6.6], [0, YF + 0.95, 9.2], [0, YF, 9.2], [k * 2.35, YF, 6.6], [k, 0.3, 1])
    flatShape(o.stone, pf, [[-2.2, 6.6], [2.2, 6.6], [0, 9.1]], 0)
    flatShape(o.door, pf, lancet(0, 2.5, 0, 3.6, 4), 0.05)
    // small lancets in the base between the portals
    for (const d of [-4.0, 4.0]) flatShape(o.win, F.front(YF), lancet(d, 0.9, 2.0, 4.6, 3), 0.06)
  }

  // ------------------------------------------------------------- the towers (west at -x, east at +x)
  tower(o, -12.2, 57.0)
  tower(o, 12.2, 57.0)

  return [
    { part: o.brick, material: finish('ste-anne-brick', 0xb86d52) },
    { part: o.stone, material: finish('ste-anne-stone', 0xcdc2ac) },
    { part: o.win, material: PALETTE.window },
    { part: o.slate, material: finish('ste-anne-slate', 0x6f767c) },
    { part: o.flat, material: PALETTE.roof },
    { part: o.door, material: finish('ste-anne-door', 0x7a5a3c) },
  ]
}

if (import.meta.main) { const b = build(); console.log(b.map(x => x.material.name + ' ' + x.part.triangles).join(', ')); await save('det-ste-anne', 'Basilica of Sainte Anne de Détroit', [42.3205462, -83.0765876], 336.5, b, 5000) }
