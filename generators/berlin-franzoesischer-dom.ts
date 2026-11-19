/**
 * Französischer Dom, Gendarmenmarkt, Berlin (the domed tower by Carl von
 * Gontard and Georg Christian Unger, 1780-1785, rebuilt 1978-1987) with the
 * Französische Friedrichstadtkirche behind it (1701-1705, rebuilt 1978-1985):
 * procedural, CC0-1.0, no textures. bun generators/berlin-franzoesischer-dom.ts
 *
 * Writes models/berlin-franzoesischer-dom.glb (low) and
 * models/berlin-franzoesischer-dom.detail.glb (detail). Exports
 * `gontardTower`, the twin tower that berlin-deutscher-dom.ts also draws:
 * merge this one (after berlin-konzerthaus.ts) before the Deutscher Dom.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 354.9 (the
 * tower's walls in OSM way/28248283): model +y is compass 354.9. Anchor: the
 * area centroid of way/28248283, lng 13.392394, lat 52.514398. The tower's
 * centre is at x = -0.3; its porticoes face model north, east and south;
 * the church is to the west. z = 0 is the square's paving (flat).
 *
 * What makes it the Französischer Dom, and how each is drawn
 * - The square tower with three hexastyle Corinthian porticoes (north, east
 *   and south), real round columns with leafy capitals, each portico under
 *   a steep pediment with its relief (relief figures in the detail).
 * - The attic storey over the porticoes with its oculi and statues on the
 *   corners and seated figures on the diagonals.
 * - The round drum: a plain podium, the ring of twelve free-standing
 *   Corinthian columns round the windowed cella, the entablature with the
 *   viewing balustrade at 40 m, the upper drum with its wreathed oculi and
 *   urns.
 * - The ribbed copper dome (dark green) with its gilt rosettes and the small
 *   obelisk finials round its foot, the lantern and the gilt statue on top.
 * - The low French church behind: its walls with tall round-headed windows,
 *   the apses north and south, the pedimented west front and the red tiled
 *   roof.
 *
 * Evidence
 * - OSM (ODbL): way/28248283 (building=church "Französischer Dom", wikidata
 *   Q315694: the tower and its porticoes; colour #d4c4a3, roof #8c8d85),
 *   its parts way/1552540184 (drum ring, height 40) and way/1552540183
 *   (dome, height 40), and way/43346292 (building=church "Französische
 *   Friedrichstadtkirche", wikidata Q1450554, roof:colour #701d13,
 *   roof:shape dome, roof:height 5).
 * - Published (de.wikipedia "Französischer Dom"): Gontard and Unger,
 *   1780-85; the dome burnt in 1944 and was rebuilt 1981-87; the viewing
 *   balustrade at 40 m. Deutscher Dom article: the twin domes are about
 *   13 m across.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Berlin, Französischer Dom -- 2013 -- 4581.jpg", Dietmar Rabich,
 *     CC BY-SA 4.0 (the south portico square-on: every height below)
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Franz%C3%B6sischer_Dom_--_2013_--_4581.jpg
 *   "Französischer Dom Berlin 2021-10-29 01.jpg", Leonhard Lenz, CC0 (the
 *     south and east porticoes, the column rhythm, steps)
 *     https://commons.wikimedia.org/wiki/File:Franz%C3%B6sischer_Dom_Berlin_2021-10-29_01.jpg
 *   "Französischer Dom (Berlin), 2024 (02).jpg", Bahnfrend, CC BY-SA 4.0
 *     (from the south-east with the church's red roof and pediment)
 *     https://commons.wikimedia.org/wiki/File:Franz%C3%B6sischer_Dom_(Berlin),_2024_(02).jpg
 *   "20220811 Französische Friedrichstadtkirche 01.jpg", Flocci Nivis,
 *     CC BY 4.0 (the drum, colonnade, balustrade, oculi and dome close up)
 *     https://commons.wikimedia.org/wiki/File:20220811_Franz%C3%B6sische_Friedrichstadtkirche_01.jpg
 *   "Französische Friedrichstadtkirche - Berlin - Gendarmenmarkt.JPG",
 *     De-okin, CC BY-SA 3.0 (the church's west front: pilasters, pediment,
 *     round-headed windows, the red roof)
 *     https://commons.wikimedia.org/wiki/File:Franz%C3%B6sische_Friedrichstadtkirche_-_Berlin_-_Gendarmenmarkt.JPG
 *   "Französischer Dom (Berlin-Mitte).Kuppelturm.09065017.ajb.jpg", Ajepbah,
 *     CC BY-SA 3.0 de; "Catedral Francesa, Berlín, Alemania, 2016-04-22,
 *     DD 16-18 HDR.jpg", Diego Delso, CC BY-SA 4.0 (night: floodlit).
 * - Measured from the Rabich photo, scaled by the OSM column spacing
 *   (4.7 m) and placed by the published 40 m balustrade (camera about 84 m
 *   from the portico): steps 1.6 m; column tops 11.9; portico cornice 14.2;
 *   pediment apex 19.6; attic top 21.9; drum podium to 25.9; colonnade to
 *   37.3 (twelve columns on an 8.1 m radius); balustrade 39.5-40.8; upper
 *   drum to 48.2 (radius 7.2); dome to 59.3 (base radius 6.3); statue on
 *   top to about 70.5. Plan from OSM.
 * - Estimated: the church's eave (12.5 m) and roof (to 18.5 m) from the
 *   Bahnfrend and De-okin photos against the tower; the cella windows;
 *   the number of dome ribs (16) and rosettes (8).
 * - Invented/simplified: the statues as bold standing and seated figures;
 *   the pediment reliefs (detail) as rows of figures; the dome's finials
 *   as small obelisks.
 * - Look-only references: none.
 * - Doubts: the church's north side and the link between church and tower
 *   (OSM leaves a 13 x 10 m gap there; drawn as the church wall) are not
 *   in any photo used.
 *
 * Night: the tower is floodlit all round (`_FLOODLIGHT`), the windows glow,
 * the dome stays dark under its gilt.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, tf, cylinder } from './dc-white-house'
import { lodKit, faceOf, fpanel, fblock, type Lod, type Face } from './london-british-museum'
import { figure, LOW, HIGH, type Q } from './london-albert-memorial'
import { ellipsoid, tube, TAU } from './nyc-columbus-monument'
import { corinthian } from './berlin-altes-museum'
import { lathe as rev, ribbedDome } from './berlin-fernsehturm'
import { welded } from './berlin-reichstag'
import { gableBlock, bays, statue, sculpt, stair, relief, mat, setSculptCrease } from './berlin-konzerthaus'
import { capPoly, wallsPoly, type XY } from './dc-national-cathedral'

export const ID = 'berlin-franzoesischer-dom'
export const BEARING = 354.9

export type TowerParts = { stone: Part; trim: Part; copper: Part; gilt: Part; win: Part; figures: Part; roof?: Part }
type Side = 'n' | 'e' | 's' | 'w'
const DIR: Record<Side, XY> = { n: [0, 1], e: [1, 0], s: [0, -1], w: [-1, 0] }

/** A flat round window (n-gon) on a face, centred at (s, z), radius r. */
export function roundWin(p: Part, f: Face, s: number, z: number, r: number, n = 10, d = 0.06) {
  const P = (a: number): V3 => [f.o[0] + f.u[0] * (s + r * Math.cos(a)) + f.n[0] * d, f.o[1] + f.u[1] * (s + r * Math.cos(a)) + f.n[1] * d, z + r * Math.sin(a)]
  const c: V3 = [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z]
  for (let i = 0; i < n; i++) tf(p, c, P((i * TAU) / n), P(((i + 1) * TAU) / n), [f.n[0], f.n[1], 0])
}

/** A flat panel on a cylinder of radius r about c, centred at angle a, w wide. */
function cylPanel(p: Part, c: XY, r: number, a: number, w: number, z0: number, z1: number) {
  const t: XY = [-Math.sin(a), Math.cos(a)], n: V3 = [Math.cos(a), Math.sin(a), 0]
  const m: XY = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
  qf(p, [m[0] - t[0] * w / 2, m[1] - t[1] * w / 2, z0], [m[0] + t[0] * w / 2, m[1] + t[1] * w / 2, z0], [m[0] + t[0] * w / 2, m[1] + t[1] * w / 2, z1], [m[0] - t[0] * w / 2, m[1] - t[1] * w / 2, z1], n)
}

/** An annulus (flat ring) between radii r0 < r1 at z, facing up or down. */
function annulus(p: Part, c: XY, r0: number, r1: number, z: number, up: boolean, k: number) {
  for (let i = 0; i < k; i++) {
    const a0 = (i * TAU) / k, a1 = ((i + 1) * TAU) / k
    const P = (r: number, a: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
    qf(p, P(r0, a0), P(r1, a0), P(r1, a1), P(r0, a1), [0, 0, up ? 1 : -1])
  }
}

/**
 * Gontard's domed tower (the Französischer and Deutscher Dom are twins):
 * a square core of half-size H about c, hexastyle Corinthian porticoes on
 * `sides`, the attic, the colonnaded drum, the ribbed dome and the gilt
 * figure on top (`topArms` sets her pose, in figure() arm units).
 */
export function gontardTower(P: TowerParts, Q: Q, L: Lod, c: XY, sides: Side[], o: { H?: number; depth?: number; topArms: V3[][]; palm?: boolean }) {
  const H = o.H ?? 12.5, D = o.depth ?? 5.2, hi = L.hi
  const ZS = 1.6, ZC = 11.9, ZEN = 14.2, ZPA = 19.6, ZAT = 21.9
  const { stone, trim, copper, gilt, win, figures } = P
  const at = (s: Side, u: number, w: number): XY => {
    const d = DIR[s], t: XY = [d[1], -d[0]]
    return [c[0] + t[0] * u + d[0] * w, c[1] + t[1] * u + d[1] * w]
  }
  // ===== Core: walls to the attic cornice ===================================
  const core = rect(c[0] - H, c[0] + H, c[1] - H, c[1] + H)
  cbox(stone, core, 0, ZAT - 0.9, { top: false })
  cbox(trim, rect(core.x0 - 0.2, core.x1 + 0.2, core.y0 - 0.2, core.y1 + 0.2), 0, 0.8, { top: false })
  cbox(trim, rect(core.x0 - 0.45, core.x1 + 0.45, core.y0 - 0.45, core.y1 + 0.45), ZAT - 0.9, ZAT, { top: trim, bottom: true, b: 0.2 })
  // ===== Porticoes ==========================================================
  for (const s of sides) {
    const d = DIR[s]
    const face = faceOf(at(s, H, H), at(s, -H, H))
    // Platform and steps.
    const pa = at(s, -H, H), pb = at(s, H, H + D)
    cbox(trim, rect(Math.min(pa[0], pb[0]), Math.max(pa[0], pb[0]), Math.min(pa[1], pb[1]), Math.max(pa[1], pb[1])), 0, ZS, { top: trim })
    const sa = at(s, -6.5, H + D), sb = at(s, 6.5, H + D + 2.2)
    const nSt = hi ? 8 : 2
    for (let k = 0; k < nSt; k++) {
      // In pieces under 5 m, so the map's terrain can lift each with the ground.
      const w0 = H + D + 2.2 * (1 - k / nSt)
      for (const [u0, u1] of [[-6.5, -2.2], [-2.2, 2.2], [2.2, 6.5]]) {
        const q0 = at(s, u0, H + D), q1 = at(s, u1, w0)
        cbox(trim, rect(Math.min(q0[0], q1[0]), Math.max(q0[0], q1[0]), Math.min(q0[1], q1[1]), Math.max(q0[1], q1[1])), (ZS * k) / nSt, (ZS * (k + 1)) / nSt, { top: true })
      }
    }
    void sa; void sb
    // The wall behind the columns: tall windows with hoods, a round-headed
    // door in the middle, small windows above.
    const step = (2 * H) / 5
    for (let k = 0; k < 5; k++) {
      const u = step * (k + 0.5)
      if (k === 2) {
        fpanel(win, face, u - 1.1, u + 1.1, ZS, 6.3)
        roundWin(win, face, u, 6.3, 1.1, hi ? 8 : 4)
        fblock(trim, face, u - 1.5, u + 1.5, 7.6, 8.1, 0, 0.3, true)
      } else {
        fpanel(win, face, u - 0.75, u + 0.75, 3.2, 7.4)
        fblock(trim, face, u - 1.1, u + 1.1, 7.6, 8.0, 0, 0.3, true)
        if (hi) {
          const m = [face.o[0] + face.u[0] * u + face.n[0] * 0.3, face.o[1] + face.u[1] * u + face.n[1] * 0.3]
          tf(trim, [m[0] - face.u[0] * 1.1, m[1] - face.u[1] * 1.1, 8.0], [m[0] + face.u[0] * 1.1, m[1] + face.u[1] * 1.1, 8.0], [m[0], m[1], 8.7], [face.n[0], face.n[1], 0.4])
        }
      }
      fpanel(win, face, u - 0.75, u + 0.75, 9.3, 11.2)
    }
    // Pilasters on the wall behind the end columns.
    for (const u of [0.5, 2 * H - 0.5]) fblock(trim, face, u - 0.5, u + 0.5, ZS, ZC, 0, 0.3)
    // Six Corinthian columns.
    for (let k = 0; k < 6; k++) {
      const u = -H + 0.8 + (k * (2 * H - 1.6)) / 5, p = at(s, u, H + D - 0.75)
      corinthian(L, trim, trim, p[0], p[1], ZS, ZC, 0.62, hi)
    }
    // Entablature (its underside the portico ceiling) and the pediment.
    const ea = at(s, -H, H - 0.5), eb = at(s, H, H + D)
    const er = rect(Math.min(ea[0], eb[0]), Math.max(ea[0], eb[0]), Math.min(ea[1], eb[1]), Math.max(ea[1], eb[1]))
    cbox(trim, er, ZC, ZEN - 0.6, { top: false, bottom: true })
    const along = d[0] !== 0 ? 'x' : 'y'
    const outerHigh = d[0] + d[1] > 0
    gableBlock(stone, P.roof ?? copper, trim, er, ZEN - 0.6, ZEN, ZPA, along, { ends: outerHigh ? [false, true] : [true, false], over: 0.45, walls: false, ct: 0.6 })
    if (hi) relief(trim, Q, 9, H, ZPA - ZEN - 0.6, ZEN + 0.02, Math.atan2(d[1], d[0]) - Math.PI / 2, (u) => at(s, u, H + D + 0.1))
    // Oculi on the attic beside the pediment.
    const fa = faceOf(at(s, H, H), at(s, -H, H))
    for (const u of [2.9, 2 * H - 2.9]) roundWin(win, fa, u, 18.6, 0.75, hi ? 10 : 6)
  }
  // ===== Statues on the attic ===============================================
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = c[0] + sx * (H - 1.0), y = c[1] + sy * (H - 1.0)
    cbox(trim, rect(x - 0.8, x + 0.8, y - 0.8, y + 0.8), ZAT, ZAT + 1.0, { b: 0.1 })
    statue(figures, Q, [x, y, ZAT + 1.0], Math.atan2(sy, sx) - Math.PI / 2, 2.6, 1)
    const xs = c[0] + sx * 9.4, ys = c[1] + sy * 9.4
    cbox(trim, rect(xs - 1.0, xs + 1.0, ys - 1.0, ys + 1.0), ZAT, ZAT + 1.2, { b: 0.1 })
    sculpt(figures, [xs, ys, ZAT + 1.2], Math.atan2(sy, sx) - Math.PI / 2, (q) => figure(q, Q, 2.6, { seated: true, girth: 1.35, lean: 0.1, arms: [[[0.13, 0, 0.7], [0.22, 0.12, 0.58], [0.16, 0.25, 0.5]], [[-0.13, 0, 0.7], [-0.2, 0.1, 0.85], [-0.12, 0.08, 0.98]]] }))
  }
  for (const s of sides) {
    const p = at(s, 0, 10.0)
    cbox(trim, rect(p[0] - 0.8, p[0] + 0.8, p[1] - 0.8, p[1] + 0.8), ZAT, ZAT + 0.8, { b: 0.1 })
    statue(figures, Q, [p[0], p[1], ZAT + 0.8], Math.atan2(DIR[s][1], DIR[s][0]) - Math.PI / 2, 2.6, 2)
  }
  // ===== Drum ===============================================================
  const k = hi ? 32 : 12
  const RC = 8.1, RCELLA = 6.6, ZD0 = 25.9, ZD1 = 37.3, ZB = 39.5
  // Podium, its cornice, and the cella behind the colonnade.
  rev([[9.0, ZAT], [9.0, ZD0 - 0.6], [9.35, ZD0 - 0.6], [9.35, ZD0], [RCELLA, ZD0]], (b) => (b === 0 ? stone : trim), k, 30, c)
  rev([[RCELLA, ZD0], [RCELLA, ZD1]], () => stone, k, 30, c)
  // Windows and niches round the cella, one per bay.
  for (let i = 0; i < 12; i++) {
    const a = ((i + 0.5) * TAU) / 12 + TAU / 24
    cylPanel(win, c, RCELLA + 0.05, a, 1.3, 28.2, 33.0)
    if (hi) {
      // A small pediment over each window.
      const t: XY = [-Math.sin(a), Math.cos(a)], m: XY = [c[0] + (RCELLA + 0.25) * Math.cos(a), c[1] + (RCELLA + 0.25) * Math.sin(a)]
      tf(trim, [m[0] - t[0] * 1.0, m[1] - t[1] * 1.0, 33.4], [m[0] + t[0] * 1.0, m[1] + t[1] * 1.0, 33.4], [m[0], m[1], 34.2], [Math.cos(a), Math.sin(a), 0.3])
      cylPanel(trim, c, RCELLA + 0.24, a, 2.0, 33.1, 33.4)
    }
  }
  // Twelve free-standing Corinthian columns.
  for (let i = 0; i < 12; i++) {
    const a = (i * TAU) / 12 + TAU / 24
    corinthian({ hi, seg: hi ? 12 : 6 }, trim, trim, c[0] + RC * Math.cos(a), c[1] + RC * Math.sin(a), ZD0, ZD1, 0.58, false)
  }
  // Entablature ring (with its ceiling over the colonnade), balustrade.
  rev([[9.1, ZD1], [9.1, ZB - 0.7], [9.55, ZB - 0.3], [9.55, ZB]], () => trim, k, 30, c)
  annulus(trim, c, RCELLA, 9.1, ZD1, false, k)
  annulus(trim, c, 7.25, 9.55, ZB, true, k)
  if (hi) {
    // Balusters and the handrail.
    rev([[9.2, ZB + 1.05], [9.2, ZB + 1.25], [9.0, ZB + 1.25], [9.0, ZB + 1.05], [9.2, ZB + 1.05]], () => trim, k, 30, c)
    for (let i = 0; i < 48; i++) {
      const a = (i * TAU) / 48
      cylinder(trim, c[0] + 9.1 * Math.cos(a), c[1] + 9.1 * Math.sin(a), 0.1, ZB, ZB + 1.05, 4, 0.07)
    }
  } else {
    // Low: the balustrade as a solid band, both sides.
    rev([[9.2, ZB], [9.2, ZB + 1.2], [9.0, ZB + 1.2]], () => trim, k, 30, c)
    rev([[9.0, ZB + 1.2], [9.0, ZB]], () => trim, k, 30, c)
  }
  // Upper drum with its oculi, cornice.
  const ZU = 47.4, ZDOME = 48.2
  rev([[7.25, ZB], [7.25, ZU], [7.75, ZU + 0.25], [7.75, ZDOME], [6.3, ZDOME]], (b) => (b === 0 ? stone : trim), k, 30, c)
  for (let i = 0; i < 8; i++) {
    const a = (i * TAU) / 8 + TAU / 16
    const f: Face = { o: [c[0] + 7.25 * Math.cos(a) + 0.8 * Math.sin(a), c[1] + 7.25 * Math.sin(a) - 0.8 * Math.cos(a)], u: [-Math.sin(a), Math.cos(a)], n: [Math.cos(a), Math.sin(a)], len: 1.6 }
    roundWin(win, f, 0.8, 44.0, 0.65, hi ? 10 : 6, 0.08)
    if (hi) {
      const ring: V3[] = Array.from({ length: 13 }, (_, j): V3 => [c[0] + 7.4 * Math.cos(a) - 1.0 * Math.sin(a) * Math.cos((j * TAU) / 12), c[1] + 7.4 * Math.sin(a) + 1.0 * Math.cos(a) * Math.cos((j * TAU) / 12), 44.0 + 1.0 * Math.sin((j * TAU) / 12)])
      tube(trim, ring, ring.map(() => 0.16), 4)
      // Urn on the walkway.
      const b = a + TAU / 16
      rev([[0.0, ZB], [0.3, ZB], [0.18, ZB + 0.3], [0.42, ZB + 0.8], [0.3, ZB + 1.3], [0.0, ZB + 1.4]], () => trim, 8, 30, [c[0] + 7.75 * Math.cos(b), c[1] + 7.75 * Math.sin(b)])
    }
    // Pilaster strip between oculi.
    cylPanel(trim, c, 7.32, a + TAU / 16, 0.7, ZB, ZU)
  }
  // ===== Dome ===============================================================
  const prof: [number, number][] = [[6.1, ZDOME], [6.2, 50.0], [6.1, 51.8], [5.75, 53.6], [5.1, 55.3], [4.15, 56.8], [2.95, 58.1], [1.6, 59.0], [1.1, 59.3]]
  ribbedDome(copper, copper, prof, hi ? 32 : 16, 16, 0.42, 0.2, c, 0, prof.length - 1)
  // Gilt rosettes between the ribs, high on the dome.
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) * TAU) / 16 * 2
    const r = 4.8, z = 55.8, n: V3 = [Math.cos(a) * 0.7, Math.sin(a) * 0.7, 0.7]
    ellipsoid(gilt, [c[0] + (r + 0.12) * Math.cos(a), c[1] + (r + 0.12) * Math.sin(a), z], [0.55, 0.55, 0.55], hi ? 10 : 6, hi ? 4 : 2, a, -Math.PI / 4)
    void n
  }
  // Small obelisk finials round the dome's foot (detail).
  if (hi) for (let i = 0; i < 16; i++) {
    const a = (i * TAU) / 16
    const x = c[0] + 7.45 * Math.cos(a), y = c[1] + 7.45 * Math.sin(a)
    cbox(copper, rect(x - 0.25, x + 0.25, y - 0.25, y + 0.25), ZDOME, ZDOME + 0.5)
    rev([[0.2, ZDOME + 0.5], [0.08, ZDOME + 1.6], [0.0, ZDOME + 1.6]], () => copper, 4, 10, [x, y], TAU / 8)
  }
  // Lantern drum, the cloud/globe, and the gilt figure.
  rev([[1.15, 59.3], [1.15, 60.4], [1.35, 60.6], [0.0, 60.6]], () => copper, hi ? 16 : 8, 30, c)
  ellipsoid(gilt, [c[0], c[1], 61.0], [0.75, 0.75, 0.5], hi ? 12 : 6, hi ? 5 : 3)
  sculpt(gilt, [c[0], c[1], 61.3], -Math.PI / 2, (q) => {
    figure(q, Q, 6.4, { arms: o.topArms, lean: 0.05, girth: 1.3 })
    if (o.palm) tube(q, [[0.95, 0.35, 5.6], [1.05, 0.4, 7.6], [0.95, 0.45, 8.6]], [0.09, 0.12, 0.05], 4)
  })
  return { ZAT, ZPA }
}

// ===========================================================================
// The Französischer Dom and its church
// ===========================================================================

const C: XY = [-0.3, 0]

/** The church's outline (OSM way/43346292, simplified). */
const CHURCH: XY[] = [
  [-21.7, 12.5], [-23.3, 16.0], [-26.6, 19.0], [-28.6, 20.3], [-30.0, 21.0], [-35.7, 21.0], [-37.6, 20.2], [-39.9, 18.5], [-42.6, 15.4], [-44.0, 12.5],
  [-46.5, 12.5], [-46.5, 7.6], [-47.3, 7.6], [-47.3, 2.4], [-51.2, 2.4], [-51.2, -2.4], [-47.3, -2.4], [-47.3, -7.6], [-46.5, -7.5], [-46.5, -12.5],
  [-44.0, -12.5], [-42.6, -15.4], [-39.9, -18.5], [-37.6, -20.2], [-35.7, -21.0], [-30.0, -21.0], [-28.6, -20.3], [-26.6, -19.0], [-23.3, -16.0], [-21.7, -12.5],
]

function build(hi: boolean) {
  const L = lodKit(hi)
  const Q: Q = hi ? HIGH : LOW
  setSculptCrease(hi ? 70 : 179)
  const copper = new Part()
  const P: TowerParts = { stone: new Part(), trim: new Part(), copper, gilt: new Part(), win: new Part(), figures: copper }
  const tile = new Part()
  gontardTower(P, Q, L, C, ['n', 'e', 's'], {
    // Right arm raised high with the palm, left forward.
    topArms: [[[0.13, 0, 0.78], [0.2, 0.05, 0.96], [0.15, 0.06, 1.12]], [[-0.13, 0, 0.78], [-0.22, 0.12, 0.66], [-0.2, 0.28, 0.62]]],
    palm: true,
  })
  const { stone, trim, win } = P

  // ===== The link from the tower to the church (OSM: the tower's west stubs).
  for (const s of [-1, 1]) {
    const r = rect(-21.7, -12.8, s > 0 ? 6.6 : -12.5, s > 0 ? 12.5 : -6.6)
    cbox(stone, r, 0, 12.0, { top: false })
    cbox(trim, rect(r.x0, r.x1, r.y0 - 0.3, r.y1 + 0.3), 12.0, 12.8, { top: tile, b: 0.15, bottom: true })
  }
  cbox(stone, rect(-21.7, -12.8, -6.6, 6.6), 0, 12.0, { top: false })
  cbox(trim, rect(-21.7, -12.8, -6.6, 6.6), 12.0, 12.8, { top: tile })

  // ===== The French church ==================================================
  const ZCE = 12.5
  wallsPoly(stone, CHURCH, 0, ZCE - 1.0)
  // Cornice band.
  const grown = CHURCH.map(([x, y]): XY => [x + (x < -33 ? -0.4 : 0.4) * (Math.abs(y) < 12.4 ? 1 : 0.6) * (x > -22 ? 0 : 1), y + Math.sign(y) * 0.4])
  wallsPoly(trim, grown, ZCE - 1.0, ZCE)
  capPoly(trim, grown, ZCE - 1.0, false)
  wallsPoly(trim, CHURCH.map(([x, y]): XY => [x + (x < -40 ? -0.15 : 0), y + Math.sign(y) * 0.15]), 0, 0.9)
  // Tall round-headed windows round the walls (two storeys on the west).
  for (let i = 0; i < CHURCH.length; i++) {
    const a = CHURCH[i], b = CHURCH[(i + 1) % CHURCH.length]
    const f = faceOf(b, a)
    if (f.n[0] * (a[0] + b[0]) / 2 > 0 && Math.abs((a[0] + b[0]) / 2) < 22) continue // the tower side
    const n = Math.floor(f.len / 4.2)
    for (let k = 0; k < n; k++) {
      const s = (f.len * (k + 0.5)) / n
      fpanel(win, f, s - 0.9, s + 0.9, 4.0, 9.0)
      roundWin(win, f, s, 9.0, 0.9, hi ? 8 : 4)
    }
  }
  // Roof: a hipped red-tile roof over the hall, half-cones over the apses.
  const ZR = 18.5
  tile.loft([[[-46.9, -12.9, ZCE], [-21.7, -12.9, ZCE], [-21.7, 12.9, ZCE], [-46.9, 12.9, ZCE]], [[-38.5, -4.0, ZR], [-27.0, -4.0, ZR], [-27.0, 4.0, ZR], [-38.5, 4.0, ZR]]])
  tile.cap([[-38.5, -4.0, ZR], [-27.0, -4.0, ZR], [-27.0, 4.0, ZR], [-38.5, 4.0, ZR]], true)
  for (const s of [-1, 1]) {
    const cx = -32.85, cy = s * 12.5, n = hi ? 12 : 6
    const rim: V3[] = Array.from({ length: n + 1 }, (_, i): V3 => {
      const a = (i / n) * Math.PI
      return [cx - 11.2 * Math.cos(a), cy + s * 8.9 * Math.sin(a), ZCE]
    })
    for (let i = 0; i < n; i++) tf(tile, rim[i], rim[i + 1], [cx, cy - s * 0.3, ZR - 2.2], [0, s, 1])
  }
  // The pedimented fronts of the north and south apses (their straight middle).
  for (const sy of [-1, 1]) {
    const y = sy * 21.0
    cbox(trim, rect(-36.2, -29.5, Math.min(y, y + sy * 0.6), Math.max(y, y + sy * 0.6)), ZCE - 1.0, ZCE, { top: false, bottom: true })
    gableBlock(stone, tile, trim, rect(-36.2, -29.5, Math.min(y - sy * 4.0, y + sy * 0.6), Math.max(y - sy * 4.0, y + sy * 0.6)), ZCE, ZCE + 0.01, ZCE + 2.6, 'y', { ends: sy > 0 ? [false, true] : [true, false], over: 0.3, walls: false, ct: 0.01 })
  }
  // The pedimented west front: a pilastered frontispiece and its gable.
  const fw = faceOf([-51.2, 2.4], [-51.2, -2.4])
  cbox(stone, rect(-52.0, -51.2, -6.5, 6.5), 0, ZCE - 1.0, { top: false })
  cbox(trim, rect(-52.4, -51.2, -6.9, 6.9), ZCE - 1.0, ZCE, { top: trim, bottom: true })
  gableBlock(stone, tile, trim, rect(-52.4, -46.5, -6.9, 6.9), ZCE, ZCE + 0.01, ZCE + 3.6, 'x', { ends: [true, false], over: 0.3, walls: false, ct: 0.01 })
  for (const y of [-6.0, -2.2, 2.2, 6.0]) fblock(trim, faceOf([-52.0, 6.5], [-52.0, -6.5]), 6.5 - y - 0.45, 6.5 - y + 0.45, 0.9, ZCE - 1.0, 0, 0.3)
  bays(win, null, faceOf([-52.0, 6.5], [-52.0, -6.5]), 0.4, 12.6, 3, [[2.0, 5.5, 1.4], [6.4, 10.4, 1.6]])
  void fw
  if (hi) for (const y of [-5.6, 0, 5.6]) statue(P.figures, Q, [-51.6, y, ZCE + (y === 0 ? 3.6 : 0.2)], Math.PI / 2, 2.2, 1)

  // ===== Materials and night ================================================
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : p[0] > -13 ? 0.95 : 0.55)
  const W = (p: Part, c = 30) => welded(p, c)
  return [
    { part: W(P.stone), material: { ...mat('dom-render', 0xebe0c6), floodlight: lit } },
    { part: W(trim, hi ? 30 : 40), material: { ...mat('dom-sandstone', 0xcbbda2), floodlight: lit } },
    { part: W(P.copper, hi ? 50 : 179), material: mat('dom-copper', 0x445a54, 0.6) },
    { part: W(P.gilt, hi ? 60 : 179), material: { ...mat('dom-gilt', 0xd6a73e, 0.4), floodlight: (p: V3) => (p[2] > 55 ? 0.9 : 0) } },
    { part: W(win), material: mat('window', 0x64798a, 0.35) },
    // The church roof's red tile, and the stone figures (weathered grey).
    { part: W(tile), material: mat('terracotta', 0xa95f4b, 0.9) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}


if (import.meta.main) {
  const extras = { landmark: 'Französischer Dom', wikidata: 'Q315694', bearing: BEARING, osm: 'way/28248283' }
  writeModel('Französischer Dom', ID, build(false), extras, 6500)
  writeModel('Französischer Dom', ID, build(true), extras, 40000, `${ID}.detail`)
}
