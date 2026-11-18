/**
 * Humboldt Forum in the rebuilt Berlin Palace (Berliner Schloss), Schlossplatz,
 * Berlin (Franco Stella, 2013-2020; Baroque fronts after Andreas Schlüter and
 * Eosander von Göthe, dome after Friedrich August Stüler) — procedural,
 * CC0-1.0, no textures. bun generators/berlin-humboldt-forum.ts
 *
 * Writes models/berlin-humboldt-forum.glb (low) and
 * models/berlin-humboldt-forum.detail.glb (detail). Imports the Berlin kit
 * from berlin-altes-museum.ts (merge that one first).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 323.6: model
 * +y is compass 323.6, so the long Lustgarten front faces model north, the
 * Schlossplatz front model south, the domed Eosander portal model west
 * (compass 233.6, towards the Schlossbrücke and Unter den Linden) and Stella's
 * modern front model east (the Spree). Anchor: the area centroid of the OSM
 * multipolygon relation/3007958 (outer way/226258268 less the Schlüterhof
 * and the Stellahof), lng 13.401504, lat 52.517159 (OSM's tourism node
 * node/8413352835 is 18 m from it). z = 0 is the Schlossplatz pavement (the
 * site is flat).
 *
 * What makes it the Humboldt Forum, and how each is drawn
 * - The three rebuilt Baroque fronts (north, south, west): ochre render with
 *   pale sandstone dressings, four window storeys (smaller ground and top
 *   rows, the two tall main rows with alternating pediments in the detail),
 *   the main cornice and the roof balustrade.
 * - The portals: the two Schlüter portals on the Schlossplatz (I and II)
 *   and the two on the Lustgarten (IV and V) as proud risalits with four
 *   giant columns, a central arched gate and a raised attic with statues;
 *   the Eosander portal on the west as a triumphal arch with paired giant
 *   columns, the tall arched window over the gate and the gilt royal arms.
 * - The dome over the Eosander portal: the chamfered square drum with two
 *   window rows and its balustrade with the eight prophets, the ribbed
 *   brownish copper dome with its blue band, the lantern with its gilt cap
 *   and the gilt cross at 70 m.
 * - Franco Stella's modern east front on the Spree: a flat, pale stone grid
 *   of deep tall openings, as plain as the real one; the same grid in the
 *   Stellahof passage.
 * - The Schlüterhof (open courtyard) and the Stellahof (open passage) as
 *   real openings in the roof; the glass-roofed foyer between as a raised
 *   flat roof light.
 *
 * Evidence
 * - OSM (ODbL): relation/3007958 "Berliner Schloss" (building=civic,
 *   building:part=yes, height 32 estimated, building:colour #cfb598,
 *   roof:colour #727682, wikidata Q170119) with outer way/226258268 and
 *   inners way/226258270 (Schlüterhof) and way/226258269 (Stellahof); parts
 *   way/1488666794 (the drum, height 48), way/618992347 (dome, height 64,
 *   roof:colour #7a6063), way/1540306413 (lantern, height 70, gold),
 *   way/1488666795 (roof part, #746150), way/1488666796 (foyer roof,
 *   #a6c6c5), way/1488666797 (west wing), way/1488666798 (east wing).
 * - Published (de.wikipedia "Berliner Schloss", "Humboldt Forum"): 70 m to
 *   the top of the dome's cross, 35 m to the roof; the roof terrace at 30 m;
 *   the Schlüterhof 50 x 80 m, the Stellahof (passage) 17 x 77 m, the
 *   Eosanderhof foyer 35 x 35 m; the eight 3 m sandstone prophets on the
 *   dome's balustrade (2024).
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Humboldt Forum, west facade, Berlin.jpg", Gerda Arendt, CC0 (Eosander
 *   portal, drum and dome: all heights);
 *   "Humboldt Forum, north facade.jpg", Gerda Arendt, CC BY-SA 4.0;
 *   "Berliner-Schloss-Humboldtforum-msu-2023-0I9A8637-8637.jpg", Matthias
 *   Süßen, CC BY-SA 4.0 (north-west corner, render colour);
 *   "Humboldt Forum, 2024 (01).jpg" and "(06).jpg", Bahnfrend, CC BY-SA 4.0
 *   (the Schlossplatz front and its portals);
 *   "Humboldt Forum on the Spree 2019.jpg", DanielMichaelPerry, CC0 and
 *   "Exterior of Humboldt Forum-(Berlin)-2026-03-msu-8595.jpg", Matthias
 *   Süßen, CC BY-SA 4.0 (Stella's east front);
 *   "Humboldt Forum and Berlin Cathedral June 2023 01.jpg", ArildV,
 *   CC BY-SA 4.0; "2021-07-19 Humboldt Forum Berlin 01.jpg", Geoprofi Lars,
 *   CC BY-SA 4.0 (dome close up);
 *   "Humboldt Forum from Marx-Engels-Forum at night 2021-01-17 08.jpg",
 *   Leonhard Lenz, CC0 (night).
 * - Measured from the west photo (scaled to the published 70 m): the cornice
 *   27.5 m, balustrade 29.5 m, drum balustrade 47 m (OSM 48), dome top
 *   59.5 m, lantern cap 66 m, cross 70 m; window rows at 1.5-4.5, 7-11.8,
 *   14-18.6 and 21-24 m.
 * - Estimated: portal attic heights (31.5 m) and column sizes, window bay
 *   4.8 m, Stella's grid 3.2 m.
 * - Invented/simplified: the courtyard (Schlüterhof) facades are drawn with
 *   the same windows as the outer fronts but without portals; statues as
 *   bold standing figures; the royal arms as a gilt cartouche.
 * - Look-only references: none.
 * - Doubts: OSM marks its heights as estimated; the north portals' exact
 *   column count is not checked against a photo square-on.
 *
 * Colour (review): the dome is dark slate grey-green copper over its blue
 * band (the dark window material) with the gilt lantern; the Baroque render
 * is a warmer yellow; the windows are a darker slate, so Stella's front
 * reads as a pale stone grid with deep dark openings (1.25 m in a 3.2 m
 * pitch).
 *
 * Night: the Baroque fronts and the dome are floodlit; windows glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf } from './dc-white-house'
import { capPoly, wallsPoly, ccw, type XY } from './dc-national-cathedral'
import { lathe, TAU } from './nyc-columbus-monument'
import { place, figure, LOW, HIGH, type Q } from './london-albert-memorial'
import { lodKit, faceOf, fpanel, fblock, type Face } from './london-british-museum'
import { put, corinthian, smoothAll } from './berlin-altes-museum'

export const ID = 'berlin-humboldt-forum'
export const BEARING = 323.6

// The outline, simplified to its main faces (OSM way/226258268 in the model frame).
const X0 = -77.4, X1 = 100.2, YS = -57.1, YN = 55.6, YNW = 59.7, XNW = -38.8
const OUT: XY[] = [[X0, YS], [X1, YS], [X1, YN], [XNW, YN], [XNW, YNW], [X0, YNW]]
const SCHLUETERHOF: XY[] = [[25.0, -42.8], [77.3, -42.8], [77.3, 40.6], [25.4, 40.6]]
const STELLAHOF: XY[] = [[-6.0, -39.0], [10.5, -39.0], [10.5, 38.3], [-6.0, 38.3]]
const XS = 84.5 // where Stella's east wing begins
const DC: XY = [-67.8, 0.0] // the dome's centre

const ZE = 27.5 // main cornice
const ZBAL = 29.5 // balustrade top
const ZR = 28.6 // roof deck
const BAY = 4.8
const ROWS: Array<[number, number, number]> = [[1.5, 4.5, 1.5], [7.0, 11.8, 1.8], [14.0, 18.6, 1.8], [21.0, 24.0, 1.6]] // z0, z1, width

/** Keyhole ring: holes bridged into the outer ring for earcut. */
function keyhole(outer: XY[], holes: XY[][]): XY[] {
  let ring = ccw(outer).slice()
  for (const h0 of holes) {
    const h = ccw(h0).slice().reverse()
    let best = [0, 0], bd = Infinity
    for (let i = 0; i < ring.length; i++) for (let j = 0; j < h.length; j++) {
      const d = Math.hypot(ring[i][0] - h[j][0], ring[i][1] - h[j][1])
      if (d < bd) { bd = d; best = [i, j] }
    }
    const [i, j] = best
    ring = [...ring.slice(0, i + 1), ...h.slice(j), ...h.slice(0, j), h[j], ring[i], ...ring.slice(i + 1)]
  }
  return ring
}

function build(hi: boolean) {
  const L = lodKit(hi)
  const Qs: Q = hi ? HIGH : LOW
  const sculpt = (g: Part, make: (q: Part) => void) => (hi ? place(g, [0, 0, 0], 0, 1, make, 70) : smoothAll(g, make))
  const render = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dome = new Part(), gold = new Part()

  // ===== Massing ===========================================================
  // Baroque walls (render) on the north, south and west, Stella's stone on the east.
  const Rr = ccw(OUT)
  for (let i = 0; i < Rr.length; i++) {
    const a = Rr[i], b = Rr[(i + 1) % Rr.length]
    const east = a[0] === X1 && b[0] === X1
    if (!east) {
      // Baroque: wall to the cornice in render, with corners split at Stella's wing.
      const split = (a[1] === b[1]) && Math.min(a[0], b[0]) < XS && Math.max(a[0], b[0]) > XS
      if (split) {
        const m: XY = [XS, a[1]]
        const [p, q] = a[0] < b[0] ? [a, m] : [m, a]
        const [r, s] = a[0] < b[0] ? [m, b] : [b, m]
        // keep each piece's direction as in the ring
        const piece = (u: XY, v: XY, part: Part) => qf(part, [u[0], u[1], 0], [v[0], v[1], 0], [v[0], v[1], ZE - 1.4], [u[0], u[1], ZE - 1.4], [v[1] - u[1], u[0] - v[0], 0])
        if (a[0] < b[0]) { piece(a, m, render); piece(m, b, trim) } else { piece(a, m, trim); piece(m, b, render) }
        void p; void q; void r; void s
      } else qf(render, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZE - 1.4], [a[0], a[1], ZE - 1.4], [b[1] - a[1], a[0] - b[0], 0])
    } else qf(trim, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZBAL], [a[0], a[1], ZBAL], [1, 0, 0])
  }
  // Base course, entablature and cornice round the Baroque fronts.
  const baro = (f: (a: XY, b: XY) => void) => {
    for (let i = 0; i < Rr.length; i++) {
      const a = Rr[i], b = Rr[(i + 1) % Rr.length]
      if (a[0] === X1 && b[0] === X1) continue
      f(a, b)
    }
  }
  baro((a, b) => {
    const f = faceOf(a, b)
    const len = a[1] === b[1] && Math.max(a[0], b[0]) > XS ? f.len - (Math.max(a[0], b[0]) - XS) : f.len
    const s0 = a[1] === b[1] && a[0] > XS ? a[0] - XS : 0
    fblock(trim, f, s0, s0 + len, 0, 1.0, 0, 0.3, false)
    fblock(trim, f, s0, s0 + len, 5.6, 6.1, 0, 0.25, true)
    fblock(trim, f, s0, s0 + len, ZE - 1.4, ZE - 0.5, 0, 0.35, true)
    fblock(trim, f, s0, s0 + len, ZE - 0.5, ZE, 0, 0.9, true)
    // balustrade
    fblock(trim, f, s0, s0 + len, ZE, ZBAL - 0.3, -0.2, 0.15, false)
    fblock(trim, f, s0, s0 + len, ZBAL - 0.3, ZBAL, -0.4, 0.3, false)
  })
  // Corner quoins of the Baroque fronts.
  for (const [x, y] of [[X0, YS], [X0, YNW], [XS, YS], [XS, YN]] as XY[]) {
    cbox(trim, rect(x - (x === X0 ? 0.3 : 0), x + (x === X0 ? 1.5 : 0.3), y - (y === YS ? 0.3 : 1.5), y + (y === YS ? 1.5 : 0.3)), 1.0, ZE - 1.4, { top: false })
  }

  // ===== Windows on the Baroque fronts =====================================
  const windows = (f: Face, s0: number, s1: number, skip: Array<[number, number]>, rich = true) => {
    const n = Math.max(1, Math.round((s1 - s0) / BAY)), step = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const s = s0 + step * (k + 0.5)
      if (skip.some(([a, b]) => s > a && s < b)) continue
      ROWS.forEach(([z0, z1, w], r) => {
        fpanel(win, f, s - w / 2, s + w / 2, z0, z1)
        if (hi && rich) {
          // Sandstone surrounds: a frame and, on the main rows, pediments alternating with hoods.
          fblock(trim, f, s - w / 2 - 0.3, s + w / 2 + 0.3, z0 - 0.4, z0, 0, 0.15, true)
          if (r === 1 || r === 2) {
            if ((k + r) % 2 === 0) {
              const P = (u: number, z: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * 0.3, f.o[1] + f.u[1] * u + f.n[1] * 0.3, z]
              tf(trim, P(s - w / 2 - 0.5, z1 + 0.2), P(s + w / 2 + 0.5, z1 + 0.2), P(s, z1 + 1.2), [f.n[0], f.n[1], 0])
              fblock(trim, f, s - w / 2 - 0.5, s + w / 2 + 0.5, z1, z1 + 0.2, 0, 0.3, true)
            } else fblock(trim, f, s - w / 2 - 0.45, s + w / 2 + 0.45, z1, z1 + 0.45, 0, 0.3, true)
          } else fblock(trim, f, s - w / 2 - 0.3, s + w / 2 + 0.3, z1, z1 + 0.3, 0, 0.15, true)
        }
      })
    }
  }
  // South front (faces -y), north fronts (+y), west front (-x). Skip the portals.
  const PORT_S = [[-8.5, 12.5], [40.5, 61.5]] // x ranges of the Schlossplatz portals (II, I)
  const fS = faceOf([X0, YS], [XS, YS])
  windows(fS, 2.5, XS - X0 - 1.5, PORT_S.map(([a, b]) => [a - X0, b - X0] as [number, number]))
  const fN = faceOf([XS, YN], [XNW, YN])
  windows(fN, 1.5, XS - XNW - 1.0, PORT_S.map(([a, b]) => [XS - b, XS - a] as [number, number]))
  const fNW = faceOf([XNW, YNW], [X0, YNW])
  windows(fNW, 1.0, XNW - X0 + 0, [])
  const fW = faceOf([X0, YNW], [X0, YS])
  windows(fW, 2.5, YNW - YS - 2.5, [[YNW - 18, YNW + 18]])
  if (hi) {
    // The short return faces at the north-west step.
    windows(faceOf([XNW, YN], [XNW, YNW]), 0.5, YNW - YN - 0.5, [])
  }

  // ===== Stella's east front and passage =====================================
  const grid = (f: Face, s0: number, s1: number, rows: Array<[number, number]>, pitch: number, w: number) => {
    const n = Math.max(1, Math.round((s1 - s0) / pitch)), step = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const s = s0 + step * (k + 0.5)
      for (const [z0, z1] of rows) {
        fpanel(win, f, s - w / 2, s + w / 2, z0, z1, 0.05)
        if (hi) {
          // Deep reveals: the panel sits in a frame of stone fins.
          fblock(trim, f, s - w / 2 - 0.12, s - w / 2, z0, z1, -0.0, 0.5)
          fblock(trim, f, s + w / 2, s + w / 2 + 0.12, z0, z1, -0.0, 0.5)
        }
      }
    }
  }
  const stellaRows: Array<[number, number]> = [[0.6, 6.0], [7.4, 12.6], [14.2, 19.4], [21.0, 26.2]]
  const GP = 3.2, GW = 1.25
  grid(faceOf([X1, YS], [X1, YN]), 1.5, YN - YS - 1.5, stellaRows, GP, GW)
  grid(faceOf([XS, YS], [X1, YS]), 0.5, X1 - XS - 0.5, stellaRows, GP, GW)
  grid(faceOf([X1, YN], [XS, YN]), 0.5, X1 - XS - 0.5, stellaRows, GP, GW)
  // Stella's flat cornice line.
  cbox(trim, rect(XS, X1 + 0.3, YS - 0.3, YN + 0.3), ZBAL - 0.6, ZBAL, { top: false, bottom: true })

  // ===== Courtyards ==========================================================
  const courtWalls = (ring: XY[], baroque: (a: XY, b: XY) => boolean) => {
    const R = ccw(ring)
    for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length]
      const isB = baroque(a, b)
      qf(isB ? render : trim, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZBAL], [a[0], a[1], ZBAL], [a[1] - b[1], b[0] - a[0], 0])
      const f = faceOf(b, a) // reversed: its normal points into the court
      if (!hi) continue
      if (isB) windows(f, 1.5, f.len - 1.5, [], false)
      else grid(f, 1.0, f.len - 1.0, stellaRows, 3.2, 1.9)
    }
  }
  // Schlüterhof: Baroque on three sides, Stella on its east side; the Stellahof is all Stella.
  courtWalls(SCHLUETERHOF, (a, b) => !(a[0] > 77 && b[0] > 77))
  courtWalls(STELLAHOF, () => false)

  // ===== Roof ================================================================
  capPoly(roof, keyhole(OUT, [SCHLUETERHOF, STELLAHOF]), ZR, true)
  // Foyer roof light over the Eosanderhof.
  cbox(roof, rect(-52.6, -21.8, -15.5, 15.1), ZR, ZR + 1.6, { b: 0.6 })
  // Roof terrace pavilion on the east wing (the restaurant).
  cbox(trim, rect(86.0, 98.5, -20, 20), ZBAL, ZBAL + 3.2, { top: roof })

  // ===== Portals =============================================================
  // Schlüter portals: a proud risalit, four giant columns, the gate, a raised attic with statues.
  const portal = (cx: number, front: number, dir: 1 | -1) => {
    const y0 = front, y1 = front + dir * 2.4 // y1 is the proud face
    const yy = (d: number) => front + dir * d
    cbox(render, rect(cx - 10.2, cx + 10.2, Math.min(y0, y1), Math.max(y0, y1)), 0, ZE - 1.4, { top: false })
    cbox(trim, rect(cx - 10.5, cx + 10.5, Math.min(y0, y1 + dir * 0.4), Math.max(y0, y1 + dir * 0.4)), ZE - 1.4, ZE, { bottom: true, top: false })
    // Raised attic over the risalit, with a balustrade and four statues.
    cbox(render, rect(cx - 10.2, cx + 10.2, Math.min(y0 - dir * 2, y1), Math.max(y0 - dir * 2, y1)), ZE, ZE + 3.4, { top: false })
    cbox(trim, rect(cx - 10.5, cx + 10.5, Math.min(y0 - dir * 2.2, y1 + dir * 0.3), Math.max(y0 - dir * 2.2, y1 + dir * 0.3)), ZE + 3.4, ZE + 4.2, { top: roof, bottom: true })
    for (let k = 0; k < 4; k++) {
      const x = cx + (k - 1.5) * 4.6
      corinthian(L, trim, trim, x, yy(2.4 + 0.35), 2.6, ZE - 1.4, 0.75, false)
      cbox(trim, rect(x - 1.1, x + 1.1, Math.min(yy(2.4), yy(3.9)), Math.max(yy(2.4), yy(3.9))), 0, 2.6, { c: 0.1 })
      if (hi || k === 0 || k === 3) put(trim, x, yy(1.6), ZE + 4.2, dir < 0 ? Math.PI : 0, (g) => sculpt(g, (q) => figure(q, Qs, 3.0, { lean: 0.05, arms: [[[0.13, 0, 0.78], [0.22, 0.05, 0.62], [0.2, 0.12, 0.5]], [[-0.13, 0, 0.78], [-0.24, 0.05, 0.9], [-0.22, 0.08, 1.05]]] })))
    }
    // Gate and windows between the columns.
    const f = dir < 0 ? faceOf([cx - 10.2, y1], [cx + 10.2, y1]) : faceOf([cx + 10.2, y1], [cx - 10.2, y1])
    const sc = 10.2
    fpanel(win, f, sc - 1.9, sc + 1.9, 0, 6.2)
    for (let j = 0; j < (hi ? 8 : 4); j++) {
      const a0 = (Math.PI * j) / (hi ? 8 : 4), a1 = (Math.PI * (j + 1)) / (hi ? 8 : 4)
      const P = (u: number, z: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * 0.06, f.o[1] + f.u[1] * u + f.n[1] * 0.06, z]
      tf(win, P(sc, 6.2), P(sc + 1.9 * Math.cos(a0), 6.2 + 1.9 * Math.sin(a0)), P(sc + 1.9 * Math.cos(a1), 6.2 + 1.9 * Math.sin(a1)), [f.n[0], f.n[1], 0])
    }
    for (const s of [sc - 4.6, sc + 4.6]) for (const [z0, z1, w] of ROWS.slice(1)) fpanel(win, f, s - w / 2, s + w / 2, z0, z1)
    fpanel(win, f, sc - 1.6, sc + 1.6, 11.0, 18.6)
  }
  portal(2.2, YS, -1)
  portal(51.0, YS, -1)
  portal(51.0, YN, 1)
  portal(2.2, YN, 1)

  // Eosander portal on the west: the triumphal arch under the dome.
  {
    const xf = X0 - 3.4
    cbox(render, rect(xf, X0, -15.0, 15.0), 0, ZE - 1.4, { top: false })
    cbox(trim, rect(xf - 0.4, X0, -15.3, 15.3), ZE - 1.4, ZE, { bottom: true, top: roof })
    // Paired giant columns either side of the arch.
    for (const y of [-11.5, -8.6, 8.6, 11.5]) {
      corinthian(L, trim, trim, xf - 0.4, y, 2.4, ZE - 1.4, 0.85, false)
      cbox(trim, rect(xf - 1.6, xf, y - 1.25, y + 1.25), 0, 2.4, { c: 0.1 })
    }
    const f = faceOf([xf, 15.0], [xf, -15.0])
    // The great arched window over the gate, and the gate.
    const sc = 15.0
    const arch = (r: number, zs: number, part: Part, d: number) => {
      fpanel(part, f, sc - r, sc + r, zs - (zs > 10 ? 9 : zs), zs, d)
      for (let j = 0; j < (hi ? 10 : 5); j++) {
        const a0 = (Math.PI * j) / (hi ? 10 : 5), a1 = (Math.PI * (j + 1)) / (hi ? 10 : 5)
        const P = (u: number, z: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * d, f.o[1] + f.u[1] * u + f.n[1] * d, z]
        tf(part, P(sc, zs), P(sc + r * Math.cos(a0), zs + r * Math.sin(a0)), P(sc + r * Math.cos(a1), zs + r * Math.sin(a1)), [f.n[0], f.n[1], 0])
      }
    }
    arch(3.6, 17.0, trim, 0.05)
    arch(3.0, 17.0, win, 0.08)
    fpanel(win, f, sc - 2.0, sc + 2.0, 0, 5.8)
    for (const s of [sc - 5.6, sc + 5.6]) { fpanel(win, f, s - 0.9, s + 0.9, 0, 4.2); fpanel(win, f, s - 0.9, s + 0.9, 8, 12) }
    // The gilt royal arms on the attic over the arch.
    const P = (u: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * d, f.o[1] + f.u[1] * u + f.n[1] * d, z]
    const nn: V3 = [f.n[0], f.n[1], 0]
    const cart: [number, number][] = [[-2.2, 0], [-2.6, 1.8], [-1.6, 3.4], [0, 4.2], [1.6, 3.4], [2.6, 1.8], [2.2, 0], [0, -1.2]]
    for (let j = 0; j < cart.length; j++) tf(gold, P(sc, 23.0, 0.25), P(sc + cart[j][0], 22.2 + cart[j][1], 0.25), P(sc + cart[(j + 1) % cart.length][0], 22.2 + cart[(j + 1) % cart.length][1], 0.25), nn)
    // Statues on the portal's cornice ends.
    for (const y of [-12.9, 12.9]) put(trim, xf + 0.6, y, ZE, -Math.PI / 2, (g) => sculpt(g, (q) => figure(q, Qs, 2.8, { arms: [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.16, 0.2, 0.5]]] })))
  }

  // ===== Drum, dome, lantern ===================================================
  const nD = hi ? 32 : 16
  // Chamfered square drum (OSM way/1488666794).
  const drum: XY[] = [[-80.3, 6.0], [-73.5, 13.6], [-62.6, 13.8], [-55.1, 5.7], [-55.2, -5.8], [-62.3, -13.9], [-73.4, -13.6], [-80.4, -5.5]]
  wallsPoly(render, drum, ZR, 44.6)
  const drumOut = drum.map(([x, y]) => [DC[0] + (x - DC[0]) * 1.04, DC[1] + (y - DC[1]) * 1.04] as XY)
  wallsPoly(trim, drumOut, 44.6, 45.6)
  capPoly(trim, drumOut, 44.6, false)
  wallsPoly(trim, drum, 45.6, 47.0)
  capPoly(roof, drum, 47.0, true)
  // Two rows of windows on each face, pilasters at the chamfers.
  const D = ccw(drum)
  for (let i = 0; i < D.length; i++) {
    const f = faceOf(D[i], D[(i + 1) % D.length])
    if (f.len > 9) {
      for (const s of [f.len / 2 - 3.6, f.len / 2, f.len / 2 + 3.6]) {
        fpanel(win, f, s - 0.9, s + 0.9, 32.0, 36.0)
        fpanel(win, f, s - 0.9, s + 0.9, 38.5, 42.6)
      }
    } else fblock(trim, f, 0.5, f.len - 0.5, ZR, 44.6, 0, 0.4)
  }
  // The eight prophets on the drum's balustrade, at its corners.
  for (const [x, y] of D) {
    const dx = x - DC[0], dy = y - DC[1], l = Math.hypot(dx, dy)
    put(trim, DC[0] + (dx / l) * (l - 1.2), DC[1] + (dy / l) * (l - 1.2), 47.0, Math.atan2(-dx, dy), (g) => sculpt(g, (q) => figure(q, Qs, 3.0, { arms: [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.16, 0.2, 0.5]], [[-0.13, 0, 0.78], [-0.18, 0.08, 0.6], [-0.14, 0.15, 0.48]]] })))
  }
  // The dome.
  const RDm = 11.8, zd0 = 47.0, zd1 = 59.5, rL = 2.6
  lathe(trim, [[RDm + 0.2, zd0], [RDm + 0.2, zd0 + 1.1], [RDm, zd0 + 1.1]], nD, DC[0], DC[1], false)
  const prof: [number, number][] = []
  const nP = hi ? 10 : 5
  for (let k = 0; k <= nP; k++) {
    const t = (k / nP) * (Math.PI / 2)
    prof.push([rL + (RDm - rL) * Math.cos(t), zd0 + 1.1 + (zd1 - zd0 - 1.1) * Math.sin(t)])
  }
  lathe(dome, prof, nD, DC[0], DC[1], false)
  // The blue band with its gilt inscription at the foot of the dome (detail).
  lathe(win, [[RDm + 0.02, zd0 + 1.2], [RDm - 0.1, zd0 + 2.3]], nD, DC[0], DC[1], false)
  // Ribs.
  const nRib = hi ? 16 : 8
  for (let r = 0; r < nRib; r++) {
    const a = (TAU * r) / nRib
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const P = (rr: number, z: number, da: number): V3 => [DC[0] + (rr + 0.1) * Math.cos(a + da / rr), DC[1] + (rr + 0.1) * Math.sin(a + da / rr), z]
      qf(dome, P(r0, z0, -0.22), P(r0, z0, 0.22), P(r1, z1, 0.22), P(r1, z1, -0.22), [Math.cos(a), Math.sin(a), 0.6])
    }
  }
  // Lantern: dark body, gilt onion cap, gilt cross.
  lathe(dome, [[rL, zd1], [rL, zd1 + 3.8], [rL + 0.3, zd1 + 4.1]], hi ? 16 : 8, DC[0], DC[1], false)
  lathe(gold, [[rL + 0.3, zd1 + 4.1], [rL - 0.4, zd1 + 5.1], [1.0, zd1 + 6.1], [0.35, zd1 + 6.8], [0.01, zd1 + 7.0]], hi ? 16 : 8, DC[0], DC[1], true)
  cbox(gold, rect(DC[0] - 0.14, DC[0] + 0.14, DC[1] - 0.14, DC[1] + 0.14), zd1 + 6.9, 70.0)
  cbox(gold, rect(DC[0] - 0.14, DC[0] + 0.14, DC[1] - 0.9, DC[1] + 0.9), 68.4, 68.8)

  // ===== Materials and night ==================================================
  const lit = (p: V3, n: V3) => (p[0] < XS && n[2] < 0.6 ? 0.85 : 0)
  return [
    { part: render, material: { ...finish('schloss-ochre-render', 0xe6d4a2), floodlight: lit } },
    { part: trim, material: { ...finish('schloss-sandstone', 0xe9e2d2), floodlight: lit } },
    { part: roof, material: finish('slate-grey-roof', 0x8d929a) },
    { part: win, material: { ...PALETTE.window, color: 0x4b5763 } },
    { part: dome, material: { ...finish('schloss-dome-copper', 0x5e6b67), floodlight: (p: V3) => (p[2] > 47 ? 0.4 : 0) } },
    { part: gold, material: finish('gilt', 0xd8b65a, 0.5) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Humboldt Forum', wikidata: 'Q170119' }
  writeModel('Humboldt Forum', ID, build(false), extras, 6500)
  writeModel('Humboldt Forum', ID, build(true), extras, 40000, `${ID}.detail`)
}
