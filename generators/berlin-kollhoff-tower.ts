/**
 * Kollhoff-Tower (Hans Kollhoff, Kollhoff und Timmermann Architekten,
 * 1995-1999), Potsdamer Platz 1, Berlin-Tiergarten, with the lower wings of
 * the same block: original procedural geometry, CC0-1.0.
 * bun generators/berlin-kollhoff-tower.ts
 * Imports helpers from berlin-philharmonie.ts (merge that first).
 *
 * Map frame, BEARING 0: +x east, +y north, z up, metres. z = 0 the pavement
 * at Potsdamer Platz (Mapterhorn: the block is flat to about 1 m). Origin =
 * the area centroid of OSM way/658563176, 13.374847 52.509006.
 *
 * What makes it the Kollhoff-Tower, and how each is drawn
 * - The dark red-brown clinker brick, all over, and the tall slim wedge
 *   with its sharp prow facing Potsdamer Platz (north-east): the brick
 *   volumes of the OSM parts at their storey counts.
 * - The setbacks: the tower (26 storeys) stepping down to 24 and 22 storeys
 *   in strips along the north side, and the wings stepping down to 15, 13,
 *   9, 7 and 6 storeys to the south-west.
 * - The crown: an open frame of brick piers round the tower's roof terrace
 *   (the Panoramapunkt), each pier capped in gilt, and the antenna mast.
 * - The vertical brick piers with the windows between them: drawn as window
 *   panels in every bay, grouped three storeys high, with brick spandrels.
 * - The grey granite base two storeys high, with the shop windows.
 *
 * The brief named a green copper top; no licensed photo shows one. Every
 * photo (2011-2026) shows the brick pier frame with gilded caps, so that is
 * what is drawn.
 *
 * Sources
 * - OSM way/658563176 (outline, building=commercial, 25 levels, height 115
 *   with the mast, brick; wikidata Q1779433) and its parts way/13759930
 *   (26 levels), way/658563167 (24), /168 (22), /173 and /177 (15), /169
 *   and /171 (13), /165 and /166 (9), way/13759931, /170, /172 (7), /164
 *   (6), the inner parts /174, /175 (25), and the arcade piers
 *   way/658563149-163 (2 levels). (c) OpenStreetMap contributors, ODbL.
 * - Published: de/en.wikipedia "Kollhoff-Tower" (103 m, 25 storeys,
 *   clinker facade, viewing platform at the top).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Forum Tower und Kollhoff Tower in Berlin-1752.jpg", Raimond Spekking,
 *     CC BY-SA 4.0 (from Potsdamer Platz, north-east: prow, setbacks,
 *     granite base, crown),
 *     https://commons.wikimedia.org/wiki/File:Forum_Tower_und_Kollhoff_Tower_in_Berlin-1752.jpg
 *   "Kollhoff-Tower Potsdamer Straße Berlin am 18 Januar 2022 A.jpg",
 *     IgorCalzone1, CC BY-SA 4.0 (from the west: the wings stepping up),
 *   "Berlin Kollhoff-Tower dk0916.jpg", DrKssn, CC BY-SA 3.0 (from the
 *     south-west along Potsdamer Straße),
 *   "Hochhäuser am Potsdamer Platz, Berlin, 141209, ako.jpg", Ansgar
 *     Koreng, CC BY 4.0 (the crown's piers and gilt caps),
 *   "Berlin Hi-Flyer Sept14 views10.jpg", A.Savin, CC BY-SA 3.0 (from the
 *     north, high: the whole block),
 *   "Kollhoff-Tower and 1 Alte Potsdamer Straße skyscrapers.jpg",
 *     Gravitatas, CC0 (2026, the crown and mast).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: every plan line, the storey counts.
 * - Published: 103 m to the top of the crown frame.
 * - Estimated: storey height (3.75 m, ground storeys 6 m more: 26 storeys
 *   reach the roof terrace at 96 m), the crown frame (7 m), the mast
 *   (to 115 m, OSM height),
 *   the granite base (8.5 m), the window grid (3.3 m bays, 1.6 m wide, two 1.9 m lights per
 *   panel with a 0.6 m brick band between),
 *   the prow piers.
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { welded, ccw, type XY } from './berlin-kit'
import { polyPrism, edgePanel, mat } from './berlin-philharmonie'

export const BEARING = 0
type Q = { detail: boolean }
const LOW: Q = { detail: false }

const lev = (n: number) => 6 + 3.75 * n

const OUTLINE: XY[] = [[-36.0, 9.9], [-34.2, -3.4], [-31.3, -26.3], [-26.3, -32.8], [-23.2, -36.8], [-18.4, -33.2], [-12.0, -28.3], [-5.6, -23.5], [1.0, -18.6], [7.4, -13.8], [13.9, -8.9], [46.2, 15.0], [49.2, 17.3], [48.0, 19.7], [47.0, 27.4], [3.2, 21.6], [4.0, 15.1], [-11.9, 13.0], [-23.8, 11.5]]

/** The parts: plan and height of the brick volume. */
const PARTS: { id: string; h: number; r: XY[] }[] = [
  { id: 'tower', h: 96, r: [[47.8, 20.9], [49.2, 17.3], [46.2, 15.0], [13.9, -8.9], [10.8, -4.8], [5.8, 1.8], [4.0, 15.1], [20.2, 17.3]] },
  { id: 'n24', h: lev(24), r: [[20.2, 17.3], [20.0, 18.8], [47.6, 22.5], [47.8, 20.9]] },
  { id: 'n22', h: lev(22), r: [[20.0, 18.8], [19.3, 23.7], [47.0, 27.4], [47.6, 22.5]] },
  { id: 'n15', h: lev(15), r: [[8.5, 22.3], [19.3, 23.7], [20.2, 17.3], [9.3, 15.8]] },
  { id: 'n9', h: lev(9), r: [[9.3, 15.8], [4.0, 15.1], [3.2, 21.6], [8.5, 22.3]] },
  { id: 'w15', h: lev(15), r: [[-11.9, 13.0], [4.0, 15.1], [5.8, 1.8], [-10.2, -0.3]] },
  { id: 's13a', h: lev(13), r: [[10.8, -4.8], [13.9, -8.9], [1.0, -18.6], [-2.1, -14.6]] },
  { id: 's13b', h: lev(13), r: [[-2.1, -14.6], [-7.1, -8.0], [5.8, 1.8], [10.8, -4.8]] },
  { id: 'w9', h: lev(9), r: [[-10.2, -0.3], [-34.2, -3.4], [-36.0, 9.9], [-11.9, 13.0]] },
  { id: 'c7', h: lev(7), r: [[-25.4, -2.3], [-10.2, -0.3], [5.8, 1.8], [-7.1, -8.0], [-22.9, -19.9]] },
  { id: 's7a', h: lev(7), r: [[-26.3, -32.8], [-31.3, -26.3], [-22.9, -19.9], [-7.1, -8.0], [-2.1, -14.6]] },
  { id: 's7b', h: lev(7), r: [[-2.1, -14.6], [1.0, -18.6], [-23.2, -36.8], [-26.3, -32.8]] },
  { id: 'sw6', h: lev(6), r: [[-22.9, -19.9], [-31.3, -26.3], [-34.2, -3.4], [-25.4, -2.3]] },
]
const ZB = 8.5, CROWN = 103, MAST = 115

const inPoly = (p: XY, r: XY[]) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}
/** The height of whatever stands at p (0 outside the block). */
const heightAt = (p: XY, skip: string) => {
  let h = 0
  for (const q of PARTS) if (q.id !== skip && inPoly(p, q.r)) h = Math.max(h, q.h)
  if (h === 0 && inPoly(p, OUTLINE)) h = ZB
  return h
}

export function build(_Q: Q) {
  const brick = new Part(), gran = new Part(), win = new Part(), roof = new Part(), gold = new Part(), mast = new Part()

  // ===== Granite base ========================================================
  polyPrism(gran, roof, OUTLINE, 0, ZB)
  // Shop windows and the first-floor windows in the granite.
  const ob = ccw(OUTLINE)
  for (let i = 0; i < ob.length; i++) {
    const a = ob[i], b = ob[(i + 1) % ob.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.floor(L / 5.4)
    for (let k = 0; k < n; k++) {
      const s0 = (L - n * 5.4) / 2 + k * 5.4
      edgePanel(win, a, b, s0 + 0.7, s0 + 4.7, 0.4, 4.4)
      edgePanel(win, a, b, s0 + 1.6, s0 + 3.8, 5.4, 7.6)
    }
  }

  // ===== Brick volumes ======================================================
  for (const part of PARTS) {
    const r = ccw(part.r)
    polyPrism(brick, roof, r, ZB, part.h)
    // A brick parapet lip on the roof edge.
    // Windows: one dark panel per 3.3 m bay and pair of storeys, with a thin brick band
    // across it between its two lights, so the face reads as the photos' dense grid of
    // square windows (STYLE: storeys grouped, brick spandrels between the groups).
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 2.6) continue
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
      const n = Math.max(1, Math.floor(L / 3.3)), pitch = L / n
      for (let k = 0; k < n; k++) {
        const s = (k + 0.5) * pitch
        const out: XY = [a[0] + ux * s + uy * 1.0, a[1] + uy * s - ux * 1.0]
        const z0 = Math.max(ZB, heightAt(out, part.id))
        for (let zg = ZB + 1.0; zg + 3.75 + 1.9 < part.h - 1.2; zg += 2 * 3.75) {
          if (zg < z0 + 0.5) continue
          const zt = zg + 3.75 + 1.9, zm = zg + 1.9
          edgePanel(win, a, b, s - 0.8, s + 0.8, zg, zt)
          // The thin brick band between the two lights, standing just proud of the panel.
          const P = (u: number, z: number): V3 => [a[0] + ux * u + nx * 0.1, a[1] + uy * u + ny * 0.1, z]
          brick.quad(P(s - 0.8, zm), P(s + 0.8, zm), P(s + 0.8, zm + 0.6), P(s - 0.8, zm + 0.6))
        }
      }
    }
  }

  // ===== The prow: stepped re-entrant corners at the sharp north-east tip =====
  // The tip is cut back to a narrow flat face, with two 1.2 m setbacks either side
  // of it running the full height (photo from Potsdamer Platz).
  {
    const tip: XY = [49.2, 17.3], A: XY = [46.2, 15.0], Bp: XY = [47.8, 20.9]
    const u1 = [A[0] - tip[0], A[1] - tip[1]], l1 = Math.hypot(u1[0], u1[1]), u2 = [Bp[0] - tip[0], Bp[1] - tip[1]], l2 = Math.hypot(u2[0], u2[1])
    const P = (s1: number, s2: number): XY => [tip[0] + u1[0] / l1 * s1 + u2[0] / l2 * s2, tip[1] + u1[1] / l1 * s1 + u2[1] / l2 * s2]
    // Two slim stepped piers standing proud of each face beside the prow: the "fins" of the setbacks.
    for (const [s1, s2] of [[2.2, 0], [0, 2.2]]) {
      const c = P(s1, s2)
      const w = 0.6
      polyPrism(brick, roof, [[c[0] - w, c[1] - w], [c[0] + w, c[1] - w], [c[0] + w, c[1] + w], [c[0] - w, c[1] + w]], ZB, 96 + 1.5)
    }
    // The prow face itself rises past the roof as the crown's leading pier.
    const c = P(0.6, 0.6)
    polyPrism(brick, gold, [[c[0] - 0.9, c[1] - 0.9], [c[0] + 0.9, c[1] - 0.9], [c[0] + 0.9, c[1] + 0.9], [c[0] - 0.9, c[1] + 0.9]], 90, CROWN + 0.8)
  }

  // ===== The crown: a frame of brick piers with gilt caps, and the mast =====
  const T = ccw(PARTS[0].r)
  const ring: XY[] = []
  for (let i = 0; i < T.length; i++) {
    const a = T[i], b = T[(i + 1) % T.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(L / 4.3))
    for (let k = 0; k < n; k++) ring.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  const c: XY = [T.reduce((s, p) => s + p[0], 0) / T.length, T.reduce((s, p) => s + p[1], 0) / T.length]
  for (const [x, y] of ring) {
    // Pull each pier 0.4 m in from the edge so it stands on the roof.
    const dx = c[0] - x, dy = c[1] - y, l = Math.hypot(dx, dy), px = x + dx / l * 0.5, py = y + dy / l * 0.5, w = 0.45
    polyPrism(brick, brick, [[px - w, py - w], [px + w, py - w], [px + w, py + w], [px - w, py + w]], 96, CROWN - 0.7)
    polyPrism(gold, gold, [[px - 0.35, py - 0.35], [px + 0.35, py - 0.35], [px + 0.35, py + 0.35], [px - 0.35, py + 0.35]], CROWN - 0.7, CROWN)
  }
  // The beam tying the piers at mid-height, as an inset band round the frame.
  {
    const o = T.map(([x, y]): XY => { const dx = c[0] - x, dy = c[1] - y, l = Math.hypot(dx, dy); return [x + dx / l * 0.1, y + dy / l * 0.1] })
    const i2 = T.map(([x, y]): XY => { const dx = c[0] - x, dy = c[1] - y, l = Math.hypot(dx, dy); return [x + dx / l * 0.9, y + dy / l * 0.9] })
    for (let i = 0; i < o.length; i++) {
      const j = (i + 1) % o.length
      for (const [z0, z1] of [[99.0, 99.8]]) {
        brick.quad([o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1])
        brick.quad([i2[j][0], i2[j][1], z0], [i2[i][0], i2[i][1], z0], [i2[i][0], i2[i][1], z1], [i2[j][0], i2[j][1], z1])
        brick.quad([o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [i2[j][0], i2[j][1], z1], [i2[i][0], i2[i][1], z1])
        brick.quad([o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0], [i2[i][0], i2[i][1], z0], [i2[j][0], i2[j][1], z0])
      }
    }
  }
  // The glazed panorama pavilion on the terrace, and the mast on it.
  polyPrism(brick, roof, [[18, 4], [26, 10], [24, 13], [16, 9]], 96, 100)
  edgePanel(win, [18, 4], [26, 10], 0.5, 9.5, 96.6, 99.4)
  {
    const mx = 21, my = 8.5
    polyPrism(mast, mast, [[mx - 0.35, my - 0.35], [mx + 0.35, my - 0.35], [mx + 0.35, my + 0.35], [mx - 0.35, my + 0.35]], 100, 108)
    polyPrism(mast, mast, [[mx - 0.15, my - 0.15], [mx + 0.15, my - 0.15], [mx + 0.15, my + 0.15], [mx - 0.15, my + 0.15]], 108, MAST)
  }
  return { brick, gran, win, roof, gold, mast }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  writeModel('Kollhoff-Tower', 'berlin-kollhoff-tower', [
    { part: welded(b.brick), material: mat('kollhoff-brick', 0x7a4a3c) },
    { part: welded(b.gran), material: mat('kollhoff-granite', 0xb9b6ad) },
    { part: welded(b.win), material: mat('window', 0x64798a, 0.35) },
    { part: welded(b.roof), material: mat('roof', 0x9da6ad) },
    { part: welded(b.gold), material: mat('neon-kollhoff-gilt', 0xd8b25a, 0.5) },
    { part: welded(b.mast), material: mat('metal', 0x99816b, 0.6) },
  ], { bearing: BEARING, osm: 'way/658563176', height: MAST }, maxTris, file)
}

if (import.meta.main) {
  write(LOW, 'berlin-kollhoff-tower', 6500)
}
