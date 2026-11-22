/**
 * Shrine of Remembrance, Kings Domain, Melbourne: procedural, CC0-1.0.
 * bun generators/melbourne-shrine-of-remembrance.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 340
 * (the outline's axes run 160/340 and 70/250). Origin at the area centroid
 * of OSM way/24590190 (144.9734473, -37.8305317), which is the building's
 * centre: the outline is symmetric about both axes.
 *
 * Hudson and Wardrop's memorial of 1928-34 in Tynong granite: a square
 * sanctuary on a raised podium, Greek Doric porticos of eight fluted
 * columns on the north and south fronts with sculpted pediments, corner
 * pylons, a stepped attic and a stepped pyramid roof after the Mausoleum
 * of Halicarnassus, crowned by a bronze tripod after the Choragic Monument
 * of Lysicrates; four sculpture groups (Peace, Justice, Patriotism,
 * Sacrifice) at the corners of the east and west fronts; wide flights of
 * steps to the porticos.
 *
 * Published (Wikipedia "Shrine of Remembrance"): square plan, stepped
 * pyramid roof, porticos north and south of eight fluted Doric columns
 * with pediment sculpture in high relief, four corner groups on the east
 * and west fronts, Tynong granite, built on a hollow artificial hill with
 * wide flights of steps rising in stages to the podium.
 *
 * OSM (turned frame): the outline is the building above the podium: the
 * core x +-12.5 (east/west faces), corner pylons x +-13.7 for |y| 9.3-14.3,
 * porticos x +-10.7 for |y| 14.3-18.7. No parts, no heights. The podium,
 * its terraces and stairs are not mapped.
 *
 * Measured on photos, scaled by the outline. s4 (the north front from the
 * forecourt, distant, frontal; 0.039 m/px from the 21.4 m portico) is
 * trusted for heights; s2 (the south front from the stair foot) for the
 * plan widths only, since its close, low camera shortens the upper stages;
 * s3 (telephoto from the east) confirms the stages. Stylobate 5.0 above
 * the terrace below the steps (s2: 5.7 m of steps; s4: 4.3 m upper
 * flight above the mound; the map's terrain has the mound itself, 4.4 m).
 * Above the stylobate: columns 6.0 (diameter 1.25), entablature to 8.4,
 * pediment apex 11.6; pylons and the core's walls 10.5 with a cornice at
 * 7.2 (s1, s3); the attic's first stage x +-8.6 to 15.0, second x +-6.4
 * to 16.9 with its frieze; pyramid from +-6.6 at 17.1 to a +-1.3 top at
 * 22.4 (45 degrees, 16 courses in s2); bronze tripod to 24.4.
 * Estimated: the attic's depth (square, from the stepped silhouette in s1
 * and s3), the podium's extent (x +-21, to the stair foot at |y| 28.7, from
 * s2-s4), the sculpture groups' size and pose (s1, s3, s5: about 5 m on a
 * pedestal against the pylons), the pediment figures (s2).
 * Left out: the lower flights and forecourt below the mound (the map's
 * ground), the Eternal Flame, cenotaph and flagpoles, inscriptions.
 *
 * Colours (sample.ts): granite sunlit #d8d2c5 (s3), #bcae96 / #bcb1a1
 * (s1), stained #b2a181; warm honey-grey overall (#cdbd9e sunlit, lead's
 * review) -> 0xd2c2a3; sculpture paler 0xe6ded0; the pyramid's courses
 * #494d50 / #59616b with brown and green patina (s1, s3, s4), copper-brown
 * in sun -> 0x7a6c5e; tripod, doors and the shadowed pronaos dark bronze.
 *
 * Night: the Shrine is floodlit from all sides (s8, night photo): the
 * granite carries _FLOODLIGHT, strongest on the walls and portico.
 *
 * LODs: the low model has every form as real geometry: fluted-free round
 * columns with capitals, the entablature and pediments, the stepped attic
 * and the pyramid (smooth faces; its courses are too fine at that range), the stairs as real steps, the four
 * sculpture groups and the pediment figures as bold masses. The detail
 * model adds 16-course pyramid steps, column flutes (16 sides), bases of
 * the tripod, triglyphs, the groups' figures and lions shaped, the
 * pediment's figures, the urns on the stair cheeks and the podium coping.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - s1 "Shrine of Remembrance, Melbourne 2017-10-28 01.jpg", Crisco 1492, CC BY-SA 4.0 (a portico and a side front, with a corner group)
 * - s2 "Shrine of Remembrance, Melbourne 2017-10-28 02.jpg", Crisco 1492, CC BY-SA 4.0 (south front, frontal)
 * - s3 "Shrine of Remembrance, Melbourne.jpg", Bernard Gagnon, CC BY-SA 4.0 (from the east)
 * - s4 "Shrine of Remembrance 1.jpg", Donaldytong, CC BY-SA 3.0 (north front from the forecourt)
 * - s8 "Melbourne Shrine of Remembrance night.jpg", Scott Sandars, CC BY-SA 2.0 (night)
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { box, face, lathe, loftRings, prism, tube, type Layer, type XY } from './sydney-tower-eye'
import { onWall, saveLods, wallBox, wallBoxDefaults } from './melbourne-royal-exhibition-building'

const ZP = 5.0 // stylobate / podium top above the terrace
type Set = { stone: Part; sculpt: Part; bronze: Part; door: Part }
const mk = (): Set => ({ stone: new Part(), sculpt: new Part(), bronze: new Part(), door: new Part() })
const low = mk(), det = mk()

/** A box between corners (x0,y0,z0)-(x1,y1,z1). */
const bx = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o: { top?: boolean; bottom?: boolean } = { top: true }) =>
  box(p, [(x0 + x1) / 2, (y0 + y1) / 2], (x1 - x0) / 2, (y1 - y0) / 2, z0, z1, 0, o)

/** A rectangular ring of four faces (a frustum) from half-size (hx0,hy0) at z0 to (hx1,hy1) at z1. */
function frustum(p: Part, hx0: number, hy0: number, z0: number, hx1: number, hy1: number, z1: number, top = false) {
  const r = (hx: number, hy: number, z: number): V3[] => [[-hx, -hy, z], [hx, -hy, z], [hx, hy, z], [-hx, hy, z]]
  loftRings(p, [r(hx0, hy0, z0), r(hx1, hy1, z1)], { top })
}

/**
 * A figure for the sculpture: a lofted body over an elliptical section
 * (sizes along its facing direction `dir`), shoulders, a head. Seated or
 * standing, it is a bold mass that reads at map scale.
 */
function figure(p: Part, c: XY, z: number, h: number, dir: number, d: boolean, o: { w?: number; seated?: boolean } = {}) {
  const w = o.w ?? h * 0.3, n = d ? 8 : 6
  const ux = Math.cos(dir), uy = Math.sin(dir)
  const ring = (a: number, b: number, zz: number, off = 0): V3[] => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2
    const s = Math.cos(t) * a + off, q = Math.sin(t) * b
    return [c[0] + ux * s - uy * q, c[1] + uy * s + ux * q, zz]
  })
  // drapery / legs widening to the base, waist, chest, shoulders
  const prof: [number, number, number, number][] = o.seated
    ? [[w * 0.75, w * 0.7, 0, w * 0.25], [w * 0.7, w * 0.62, 0.32, w * 0.2], [w * 0.4, w * 0.5, 0.42, 0], [w * 0.36, w * 0.48, 0.66, 0], [w * 0.3, w * 0.52, 0.78, 0]]
    : [[w * 0.5, w * 0.55, 0, 0], [w * 0.4, w * 0.45, 0.45, 0], [w * 0.32, w * 0.42, 0.62, 0], [w * 0.34, w * 0.5, 0.76, 0], [w * 0.28, w * 0.5, 0.8, 0]]
  const rings = prof.map(([a, b, f, off]) => ring(a, b, z + h * f, off))
  loftRings(p, rings, { top: true })
  // neck and head
  lathe(p, c, [[w * 0.12, z + h * 0.8], [w * 0.13, z + h * 0.84], [w * 0.2, z + h * 0.88], [w * 0.2, z + h * 0.95], [w * 0.1, z + h * 0.99], [0.0001, z + h]], d ? 8 : 5, { crease: 60 })
  if (d) {
    // arms: two tubes from the shoulders down the sides
    for (const sg of [-1, 1]) {
      const sh: V3 = [c[0] - uy * sg * w * 0.48, c[1] + ux * sg * w * 0.48, z + h * 0.77]
      const el: V3 = [sh[0] + ux * w * 0.15, sh[1] + uy * w * 0.15, z + h * 0.58]
      const hd: V3 = [el[0] + ux * w * 0.3, el[1] + uy * w * 0.3, z + h * (o.seated ? 0.45 : 0.42)]
      tube(p, [sh, el, hd], w * 0.09, 5, true)
    }
  }
}

/** A recumbent lion facing `dir`: body, haunch, maned head. */
function lion(p: Part, c: XY, z: number, L: number, dir: number, d: boolean) {
  const ux = Math.cos(dir), uy = Math.sin(dir)
  const P = (s: number, q: number, zz: number): V3 => [c[0] + ux * s - uy * q, c[1] + uy * s + ux * q, zz]
  const n = d ? 8 : 6
  const ring = (s: number, a: number, h0: number, h1: number): V3[] => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2
    return P(s, Math.cos(t) * a, z + (h0 + h1) / 2 + Math.sin(t) * (h1 - h0) / 2)
  })
  // body lofted along s: from the haunch to the chest; ring planes are vertical, so build quads by hand
  const secs = [ring(-L * 0.5, L * 0.18, 0, L * 0.34), ring(-L * 0.2, L * 0.2, 0, L * 0.3), ring(L * 0.15, L * 0.2, 0, L * 0.34), ring(L * 0.3, L * 0.22, 0, L * 0.42)]
  for (let k = 0; k < secs.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, A = secs[k][i], B = secs[k][j], C = secs[k + 1][j], D = secs[k + 1][i]
    const m: V3 = [(A[0] + B[0] + C[0] + D[0]) / 4, (A[1] + B[1] + C[1] + D[1]) / 4, (A[2] + B[2] + C[2] + D[2]) / 4]
    const axis = P(-L * 0.5 + (L * 0.8 * (k + 0.5)) / 3, 0, z + L * 0.17)
    face(p, [A, B, C, D], [m[0] - axis[0], m[1] - axis[1], m[2] - axis[2]])
  }
  for (const [sec, sg] of [[secs[0], -1], [secs[secs.length - 1], 1]] as [V3[], number][]) face(p, sec, [ux * sg, uy * sg, 0])
  // maned head
  const hc = P(L * 0.45, 0, 0)
  lathe(p, [hc[0], hc[1]], [[L * 0.17, z + L * 0.22], [L * 0.2, z + L * 0.36], [L * 0.15, z + L * 0.5], [0.0001, z + L * 0.56]], n, { crease: 60 })
  if (d) {
    // forepaws
    for (const sg of [-1, 1]) tube(p, [P(L * 0.3, sg * L * 0.12, z + L * 0.05), P(L * 0.62, sg * L * 0.12, z + L * 0.05)], L * 0.06, 5, true)
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  wallBoxDefaults.back = false
  wallBoxDefaults.lean = !d

  // ---- Podium: a platform to the stylobate round the core; the flights between cheek blocks ----
  const PX = 18, PY = 28.7, SX = 10.5, SY0 = 18.7, CK = 15.5
  bx(s.stone, -PX, PX, -SY0, SY0, 0, ZP)
  for (const sg of [-1, 1]) for (const sx of [-1, 1]) {
    // cheek blocks either side of each flight, carrying a low wall
    bx(s.stone, sx > 0 ? SX : -CK, sx > 0 ? CK : -SX, sg > 0 ? SY0 : -PY, sg > 0 ? PY : -SY0, 0, ZP + 0.7)
    if (d) bx(s.stone, (sx > 0 ? SX : -CK) - 0.12, (sx > 0 ? CK : -SX) + 0.12, sg > 0 ? PY - 1.2 : -PY - 0.12, sg > 0 ? PY + 0.12 : -PY + 1.2, ZP + 0.7, ZP + 0.95, { top: true, bottom: true })
  }
  // the low parapet round the platform's outer edges
  const par = (x0: number, x1: number, y0: number, y1: number) => { bx(s.stone, x0, x1, y0, y1, ZP, ZP + 0.9); if (d) bx(s.stone, x0 - 0.12, x1 + 0.12, y0 - 0.12, y1 + 0.12, ZP + 0.9, ZP + 1.05, { top: true, bottom: true }) }
  par(-PX, -PX + 0.6, -SY0, SY0); par(PX - 0.6, PX, -SY0, SY0)
  for (const sg of [-1, 1]) { const y0 = sg > 0 ? SY0 - 0.6 : -SY0, y1 = sg > 0 ? SY0 : -SY0 + 0.6; par(-PX + 0.6, -CK, y0, y1); par(CK, PX - 0.6, y0, y1) }
  if (d) bx(s.stone, -PX - 0.2, PX + 0.2, -SY0 - 0.2, SY0 + 0.2, 0, 0.6, { top: true })
  // stairs: real steps from the stylobate down to the terrace (25 in the detail model, 9 deeper ones in the low)
  const NS = d ? 25 : 9, rise = ZP / NS, tread = (PY - SY0) / NS
  for (const sg of [-1, 1]) {
    for (let k = 0; k < NS; k++) {
      const y = SY0 + k * tread, zt = ZP - k * rise, zl = zt - rise
      const Y = (v: number) => sg * v
      // riser facing out, then the tread below it
      const riser: V3[] = [[-SX, Y(y), zl], [SX, Y(y), zl], [SX, Y(y), zt], [-SX, Y(y), zt]]
      face(s.stone, sg > 0 ? riser : [riser[1], riser[0], riser[3], riser[2]], [0, sg, 0])
      if (k < NS - 1) {
        const tr: V3[] = [[-SX, Y(y), zl], [SX, Y(y), zl], [SX, Y(y + tread), zl], [-SX, Y(y + tread), zl]]
        face(s.stone, tr, [0, 0, 1])
      }
    }
    // urns on blocks at the stylobate's corners of the flight
    for (const sx of [-1, 1]) {
      const c: XY = [sx * (SX + 0.9), sg * (SY0 + 0.9)]
      box(s.stone, c, 0.9, 0.9, ZP, ZP + 1.6, 0, { top: true })
      lathe(s.stone, c, d ? [[0.45, ZP + 1.6], [0.3, ZP + 1.8], [0.55, ZP + 2.4], [0.62, ZP + 2.6], [0.0001, ZP + 2.6]] : [[0.45, ZP + 1.6], [0.6, ZP + 2.5], [0.0001, ZP + 2.5]], d ? 10 : 6, { crease: 40 })
    }
  }

  // ---- Core: east/west walls, pylons, pronaos walls ----
  const CX = 12.5, CY = 14.3, PYX = 13.7, PY0 = 9.3, PYL = 9.0
  const WT = ZP + 10.5 // the core's walls rise with the pylons
  bx(s.stone, -CX, CX, -CY, CY, ZP, WT)
  // cornice round the core
  for (const sg of [-1, 1]) {
    bx(s.stone, sg > 0 ? CX - 0.2 : -CX - 0.4, sg > 0 ? CX + 0.4 : -CX + 0.2, -PY0, PY0, ZP + 6.9, ZP + 7.5, { top: true, bottom: true })
    bx(s.stone, sg > 0 ? CX - 0.2 : -CX - 0.35, sg > 0 ? CX + 0.35 : -CX + 0.2, -PY0, PY0, WT - 0.4, WT + 0.1, { top: true, bottom: true })
  }
  // pylons: four corner blocks to 10.5 above the stylobate, with a cornice at 7.2
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = sx > 0 ? PYL : -PYX, x1 = sx > 0 ? PYX : -PYL, y0 = sy > 0 ? PY0 : -CY, y1 = sy > 0 ? CY : -PY0
    bx(s.stone, x0, x1, y0, y1, ZP, ZP + 10.5)
    bx(s.stone, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, ZP + 6.9, ZP + 7.5, { top: true, bottom: true })
    bx(s.stone, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, ZP + 10.1, ZP + 10.6, { top: true, bottom: true })
    if (d) bx(s.stone, x0 - 0.12, x1 + 0.12, y0 - 0.12, y1 + 0.12, ZP, ZP + 0.6)
  }
  // the east and west walls: a band of panels (the inscriptions) and a sunk field
  if (d) for (const sx of [-1, 1]) {
    const a: XY = sx > 0 ? [CX, -PY0] : [-CX, PY0], b: XY = sx > 0 ? [CX, PY0] : [-CX, -PY0]
    wallBox(s.stone, a, b, 0.6, 2 * PY0 - 0.6, 0, 0.12, ZP + 4.8, ZP + 6.2, { top: true, bottom: true })
    wallBox(s.stone, a, b, 0, 2 * PY0, 0, 0.3, ZP, ZP + 0.6, { top: true })
  }

  // ---- Porticos: eight Doric columns, entablature, pediment with its sculpture ----
  for (const sg of [-1, 1]) {
    const yF = sg * 18.7, yB = sg * CY, yc = sg * 17.9
    // stylobate step
    bx(s.stone, -10.9, 10.9, Math.min(yB, yF + sg * 0.2), Math.max(yB, yF + sg * 0.2), ZP - 0.25, ZP + 0.15)
    // the pronaos wall with the bronze doors in a deep frame
    const doorY = yB + sg * 0.06
    // the pronaos in deep shadow behind the columns: its whole wall reads dark, every intercolumniation
    face(s.door, sg > 0 ? [[-9.9, doorY, ZP + 0.15], [9.9, doorY, ZP + 0.15], [9.9, doorY, ZP + 6.0], [-9.9, doorY, ZP + 6.0]] : [[9.9, doorY, ZP + 0.15], [-9.9, doorY, ZP + 0.15], [-9.9, doorY, ZP + 6.0], [9.9, doorY, ZP + 6.0]], [0, sg, 0])
    for (const dx of [-1, 1]) bx(s.stone, dx > 0 ? 1.8 : -2.4, dx > 0 ? 2.4 : -1.8, sg > 0 ? yB : yB - 0.4, sg > 0 ? yB + 0.4 : yB, ZP + 0.15, ZP + 5.8)
    bx(s.stone, -2.4, 2.4, sg > 0 ? yB : yB - 0.4, sg > 0 ? yB + 0.4 : yB, ZP + 5.2, ZP + 5.8)
    // antae at the portico's ends
    for (const sx of [-1, 1]) bx(s.stone, sx > 0 ? 9.9 : -10.9, sx > 0 ? 10.9 : -9.9, Math.min(yB, yF + sg * 0.1), Math.max(yB, yF + sg * 0.1) - (sg > 0 ? 0.0 : 0), ZP + 0.15, ZP + 6.0)
    // columns
    const cn = d ? 16 : 8
    for (let k = 0; k < 8; k++) {
      const x = -8.85 + (17.7 * k) / 7
      const c: XY = [x, yc]
      lathe(s.stone, c, [[0.64, ZP + 0.15], [0.6, ZP + 3.0], [0.52, ZP + 5.45]], cn, { crease: 30, phase: Math.PI / cn })
      // capital: echinus and abacus
      lathe(s.stone, c, [[0.52, ZP + 5.45], [0.62, ZP + 5.6], [0.74, ZP + 5.75]], d ? 12 : 6, { crease: 50 })
      box(s.stone, c, 0.78, 0.78, ZP + 5.75, ZP + 6.0, 0, { top: true, bottom: true })
    }
    // entablature: architrave, frieze, cornice
    const y0 = Math.min(yB, yF), y1 = Math.max(yB, yF)
    bx(s.stone, -10.9, 10.9, y0 + (sg > 0 ? 0 : -0.1), y1 + (sg > 0 ? 0.1 : 0), ZP + 6.0, ZP + 7.0, { top: true, bottom: true })
    bx(s.stone, -10.9, 10.9, y0, y1, ZP + 7.0, ZP + 7.8, { top: true })
    bx(s.stone, -11.2, 11.2, y0 - (sg > 0 ? 0 : 0.4), y1 + (sg > 0 ? 0.4 : 0), ZP + 7.8, ZP + 8.4, { top: true, bottom: true })
    if (d) for (let k = 0; k < 15; k++) {
      // triglyphs over the columns and intercolumniations
      const x = -8.85 + (17.7 * k) / 14
      bx(s.stone, x - 0.35, x + 0.35, sg > 0 ? y1 - 0.0 : y0 - 0.1, sg > 0 ? y1 + 0.1 : y0, ZP + 7.0, ZP + 7.8)
    }
    // pediment: triangular prism from the core wall to the front, raking cornices, tympanum recessed
    const zb = ZP + 8.4, za = ZP + 11.6, hw = 11.2
    const yf = sg > 0 ? y1 + 0.4 : y0 - 0.4, yt = sg > 0 ? y1 - 0.5 : y0 + 0.5 // tympanum set 0.9 behind the cornice's face
    face(s.stone, sg > 0 ? [[-hw, yt, zb], [hw, yt, zb], [0, yt, za - 0.5]] : [[hw, yt, zb], [-hw, yt, zb], [0, yt, za - 0.5]], [0, sg, 0])
    for (const sx of [-1, 1]) {
      // raking cornice: a sloped slab along each edge
      const P = (t: number, dz: number, yy: number): V3 => [sx * hw * (1 - t), yy, zb + (za - zb) * t + dz]
      const top: V3[] = [P(0, 0, yf), P(1, 0, yf), P(1, 0, yB), P(0, 0, yB)]
      const nn: V3 = [sx * (za - zb), 0, hw]
      face(s.stone, sx * sg > 0 ? top : [...top].reverse(), nn)
      const fr: V3[] = [P(0, -0.7, yf), P(1, -0.7, yf), P(1, 0, yf), P(0, 0, yf)]
      face(s.stone, sx * sg > 0 ? [...fr].reverse() : fr, [0, sg, 0])
      // soffit of the raking cornice over the tympanum
      const so: V3[] = [P(0, -0.7, yf), P(1, -0.7, yf), P(1, -0.7, yt), P(0, -0.7, yt)]
      face(s.stone, so, [-sx * (za - zb) * 0.3, 0, -1])
    }
    // the pediment's sculpture: a central standing figure with groups to each side, diminishing to the corners
    const ys = yt + sg * 0.45
    const figs: [number, number, boolean][] = d
      ? [[0, 2.6, false], [-1.3, 2.1, true], [1.3, 2.1, true], [-2.6, 1.9, false], [2.6, 1.9, false], [-3.9, 1.6, true], [3.9, 1.6, true], [-5.2, 1.3, true], [5.2, 1.3, true], [-6.5, 1.0, true], [6.5, 1.0, true], [-7.8, 0.7, true], [7.8, 0.7, true]]
      : [[0, 2.6, false], [-2.2, 2.0, true], [2.2, 2.0, true], [-4.6, 1.4, true], [4.6, 1.4, true], [-7, 0.9, true], [7, 0.9, true]]
    // a relief ground behind the figures, then the figures themselves as broad masses filling the tympanum
    face(s.stone, sg > 0 ? [[-9.6, yt + 0.05, zb], [9.6, yt + 0.05, zb], [0, yt + 0.05, za - 0.6]] : [[9.6, yt - 0.05, zb], [-9.6, yt - 0.05, zb], [0, yt - 0.05, za - 0.6]], [0, sg, 0])
    for (const [x, , seated] of figs) figure(s.sculpt, [x, ys], zb, 0.9 * (za - zb - 0.4) * (1 - Math.abs(x) / hw) + 0.15, sg > 0 ? Math.PI / 2 : -Math.PI / 2, d, { w: Math.min(1.3, 0.6 * 0.9 * (za - zb) * (1 - Math.abs(x) / hw) + 0.3), seated })
    // acroteria: a palmette at the apex
    box(s.sculpt, [0, yf - sg * 0.3], 0.5, 0.25, za, za + 1.2, 0, { top: true })
  }

  // ---- The stepped attic, its frieze, the stepped pyramid, the tripod ----
  bx(s.stone, -8.6, 8.6, -10.5, 10.5, WT - 0.5, ZP + 15.0)
  bx(s.stone, -8.85, 8.85, -10.75, 10.75, ZP + 14.6, ZP + 15.0, { top: true, bottom: true })
  bx(s.stone, -6.4, 6.4, -6.4, 6.4, ZP + 15.0, ZP + 16.9)
  // the frieze band and the cornice the pyramid stands on
  bx(s.sculpt, -6.48, 6.48, -6.48, 6.48, ZP + 15.6, ZP + 16.5, { top: false })
  bx(s.stone, -6.75, 6.75, -6.75, 6.75, ZP + 16.75, ZP + 17.1, { top: true, bottom: true })
  const steps = 16, zb = ZP + 17.1, zt = ZP + 22.4, h0 = 6.6, h1 = 1.3
  // the low model draws the pyramid's faces smooth (its 16 courses are too fine to read from afar)
  if (!d) frustum(s.bronze, h0, h0, zb, h1, h1, zt)
  else for (let k = 0; k < steps; k++) {
    const hw = h0 - ((h0 - h1) * k) / steps, hn = h0 - ((h0 - h1) * (k + 1)) / steps
    const z0 = zb + ((zt - zb) * k) / steps, z1 = zb + ((zt - zb) * (k + 1)) / steps
    // riser, then the tread inward to the next course
    frustum(s.bronze, hw, hw, z0, hw, hw, z1)
    const r = (h: number): V3[] => [[-h, -h, z1], [h, -h, z1], [h, h, z1], [-h, h, z1]]
    const o = r(hw), i = r(hn)
    for (let e = 0; e < 4; e++) { const f = (e + 1) % 4; face(s.bronze, [o[e], o[f], i[f], i[e]], [0, 0, 1]) }
  }
  bx(s.bronze, -h1, h1, -h1, h1, zt - 0.01, zt + 0.25)
  // the tripod: a drum on three legs carrying a bowl and flame
  const T = zt + 0.25
  lathe(s.bronze, [0, 0], [[1.1, T], [1.1, T + 0.35], [0.7, T + 0.45]], d ? 12 : 6, { crease: 40 })
  if (d) for (let i = 0; i < 3; i++) { const t = (i / 3) * Math.PI * 2; tube(s.bronze, [[0.85 * Math.cos(t), 0.85 * Math.sin(t), T + 0.45], [0.45 * Math.cos(t), 0.45 * Math.sin(t), T + 1.0]], 0.09, 4) }
  else lathe(s.bronze, [0, 0], [[0.5, T + 0.45], [0.35, T + 1.0]], 6)
  lathe(s.bronze, [0, 0], [[0.3, T + 0.95], [0.75, T + 1.1], [0.8, T + 1.3], [0.4, T + 1.3], [0.18, T + 1.7], [0.0001, T + 1.95]], d ? 12 : 6, { crease: 40 })

  // ---- The four sculpture groups at the corners of the east and west fronts ----
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const c: XY = [sx * 15.7, sy * 11.8]
    const dir = sx > 0 ? 0 : Math.PI // facing east or west
    // pedestal against the pylon, with a projecting base
    box(s.stone, c, 2.0, 2.2, ZP, ZP + 1.4, 0, { top: true })
    box(s.stone, [c[0] - sx * 0.6, c[1]], 1.3, 1.6, ZP + 1.4, ZP + 2.6, 0, { top: true })
    // the main figure, seated high against the pylon, and a lion (or horse) couchant before it
    figure(s.sculpt, [c[0] - sx * 0.6, c[1]], ZP + 2.6, 3.4, dir, d, { w: 1.5, seated: true })
    lion(s.sculpt, [c[0] + sx * 0.6, c[1]], ZP + 1.4, 2.6, dir, d)
    if (d) figure(s.sculpt, [c[0] + sx * 1.2, c[1] + sy * 1.4], ZP + 1.4, 1.5, dir, d, { w: 0.5 })
  }
}
wallBoxDefaults.back = true
wallBoxDefaults.lean = false

const stone: MaterialSpec = { ...finish('shrine-granite', 0xd2c2a3), floodlight: (p, n) => (n[2] > 0.7 ? 0.3 : p[2] < ZP + 0.2 ? 0.6 : 1) }
const sculpt: MaterialSpec = { ...finish('shrine-sculpture', 0xe6ded0), floodlight: () => 0.9 }
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: stone },
  { part: s.sculpt, material: sculpt },
  { part: s.bronze, material: { ...finish('shrine-bronze-roof', 0x7a6c5e), floodlight: (p) => (p[2] < ZP + 22.5 ? 0.85 : 0.3) } },
  { part: s.door, material: finish('shrine-bronze-door', 0x5a4c3c) },
]

if (import.meta.main) {
  await saveLods('melbourne-shrine-of-remembrance', 'Shrine of Remembrance', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid on the terrace below the podium; bearing 340',
    bearing: 340, height: ZP + 24.4,
  }, 5000)
}
