/**
 * Arsenal (Арсенал), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-arsenal.ts
 *
 * Peter the Great's arsenal of 1702-1736, rebuilt after the fires of 1737
 * and 1812: a long trapezoid of two tall storeys round a courtyard, along
 * the Kremlin wall from the Corner Arsenal Tower to the Trinity Tower. Its
 * fronts are long ochre walls with few windows, set in pairs and singles in
 * deep round-headed white surrounds, and two white gateways, one on the
 * south front and one on the east front over Senate Square.
 *
 * Built with the kit in moscow-senate.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, the plan in true
 * orientation. Origin: the area centroid of OSM relation/51497 (outline
 * less its courtyard), 37.6162587, 55.753635.
 *
 * Evidence
 * - OSM (API map call, 2026-11-18): relation/51497 (building=yes, height 24,
 *   building:levels 2, roof:colour green), the outline and courtyard;
 *   building:parts relation/3272133 (the main wings, height 20), the roof
 *   skillions relation/16265192-16265200 (20->24 m), the gate block's roof
 *   relation/16265189-16265190 (20->22.5 m), the courtyard galleries
 *   relation/3272138-3272142 and relation/16265181-16265185 (5, 8 and 20 m),
 *   the dormers way/2421913xx-2421915xx (22.5 m gabled) and chimney and vent
 *   parts (25 m, 1-8 m2). The courtyard block relation/3272132 (building=yes)
 *   with its parts relation/3272134 (10 m, gabled), relation/3272137 (6 m)
 *   and relation/16265186-16265188 (6-9 m) is drawn here too.
 * - Published (ru.wikipedia, "Арсенал Московского Кремля"; OSM description):
 *   built 1702-1736, restored by Matvey Kazakov 1786-1796, blown up in 1812
 *   and rebuilt 1815-1828; two storeys.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Shakko, "Kremlin Arsenal 02 by shakko.jpg", CC BY-SA 4.0: the south
 *     front square-on, the gate, the 2-1-2 window rhythm.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Arsenal_02_by_shakko.jpg
 *   - Shakko, "Kremlin Arsenal (2015) 03 by shakko.jpg", "(2015) 05",
 *     CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:Kremlin_Arsenal_(2015)_05_by_shakko.jpg
 *   - Bahnfrend, "Kremlin Arsenal, 2006 (01).jpg", CC BY-SA 4.0: the east
 *     front's south end by the Kremlin wall, the lower block and its stack.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Arsenal,_2006_(01).jpg
 *   - Gerd Eichmann, "Moskau-Kreml-Arsenal-06-2012-gje.jpg", "-08-",
 *     CC BY 4.0: the gate and the window surrounds close up.
 *     https://commons.wikimedia.org/wiki/File:Moskau-Kreml-Arsenal-06-2012-gje.jpg
 *   - Andrew Bossi, "Troitskaya Tower and Kremlin Arsenal.jpg", CC BY-SA
 *     2.0: the whole east front from the south-east.
 *   - Ministry of Defence of the Russian Federation, "Kremlin Arsenal -
 *     VictoryDayParade2018-01.jpg", CC BY 4.0: from above, the roofs and the
 *     courtyard.
 *
 * Heights. OSM: walls 20 m, roofs to 24 m. Photo-scaled on Shakko's
 * square-on south front (85 m along OSM): cornice top 19.4 m (drawn 20),
 * grey plinth to 1 m, white string course 9.0-9.6 m, ground-floor
 * surrounds 1.7-7.9 m and 3.2 m wide, first-floor surrounds 10.1-16.2 m,
 * glass 1.7 m wide, the white frieze line at 16.6 m. Window rhythm: a pair 3.8 m apart,
 * 4.8 m to a single, 4.8 m to the next pair (13.4 m period), counted on the
 * south front and drawn along the south, east and north fronts.
 *
 * Estimated or simplified:
 * - The west front faces the Kremlin wall a few metres away; no photo
 *   shows it. It gets plain windows on the same rhythm.
 * - The courtyard fronts: plain windows on a 5 m pitch; the courtyard block
 *   is drawn as a hipped block to OSM's heights, its colour assumed ochre.
 * - Left out: the dormers and chimneys OSM maps on the roof, the frieze's
 *   white ornament, the ground floor's rustication lines, the window
 *   lunettes' shells, the cannons along the fronts, the tall stack on the
 *   lower block at the south-west corner.
 * - Window heads use 6 segments per semicircle (STYLE says 8-12) to keep
 *   300-odd windows inside the 250 KB file budget.
 *
 * Materials (five): ochre, white trim, the painted green roof (#76b9a6, the
 * sunlit roofs of the 2018 Ministry of Defence aerial lightened to the
 * palette; shared with the Senate and the palaces), window, and a
 * dark gate passage. Night: the fronts floodlit, as the Kremlin's are.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { KREMLIN, area, archPanel, bays, cornice, cw, edgeOf, edges, hipRoof, inside, panel, pilaster, prism, save, simplify, walls, type Edge, type XY } from './moscow-senate'

const OUTER: XY[] = [[-86.05, -121.28], [-88.82, -128.72], [-81.96, -133.59], [-53.68, -129.3], [-45.39, -128.04], [-37.05, -126.77], [2.18, -120.82], [38.9, -20.35], [42.55, -21.68], [45.47, -13.72], [48.38, -5.75], [44.72, -4.41], [81.4, 95.93], [20.21, 157.63], [17.33, 157.02], [-35.27, 15.47], [-36.06, 13.36], [-36.16, 13.07], [-36.28, 12.74], [-39.81, 3.19], [-39.92, 2.87], [-40.03, 2.57], [-40.88, 0.28], [-81.26, -108.38], [-83.32, -113.92]]
// relation/3272133's courtyard (it runs behind the galleries), wound clockwise.
const COURT: XY[] = cw([[-23.37, -22.15], [-17.83, -6.74], [-16.16, -2.1], [-9.02, 17.78], [-7.16, 22.94], [-2.03, 37.22], [26.69, 117.13], [53.32, 90.16], [30.16, 25.65], [25.04, 11.38], [23.19, 6.23], [16.05, -13.66], [14.38, -18.3], [8.85, -33.71], [7.24, -38.13], [-13.49, -94.87], [-14.97, -98.91], [-27.26, -100.93], [-36.45, -102.44], [-43.74, -103.64], [-53.21, -105.2], [-50.34, -97.22], [-25.14, -27.07]])
// Courtyard galleries: [ring, height].
const GALLERIES: [XY[], number][] = [
  [[[20.05, 13.17], [21.87, 18.25], [25.18, 27.44], [30.16, 25.65], [25.04, 11.38]], 5],
  [[[8.85, -33.71], [6.47, -32.86], [3.86, -31.92], [7.86, -20.78], [9.39, -16.51], [14.38, -18.3]], 5],
  [[[16.05, -13.66], [23.19, 6.23], [18.2, 8.02], [14.43, -2.5], [11.06, -11.87]], 20],
  [[[20.05, 13.17], [25.04, 11.38], [23.19, 6.23], [18.2, 8.02]], 8],
  [[[9.39, -16.51], [11.06, -11.87], [16.05, -13.66], [14.38, -18.3]], 8],
  [[[-16.16, -2.1], [-9.02, 17.78], [-3.8, 15.91], [-6.71, 7.83], [-9.71, -0.51], [-10.96, -3.97]], 20],
  [[[-9.02, 17.78], [-7.16, 22.94], [-1.95, 21.06], [-3.8, 15.91]], 8],
  [[[-10.96, -3.97], [-16.16, -2.1], [-17.83, -6.74], [-12.63, -8.61]], 8],
  [[[-7.16, 22.94], [-2.03, 37.22], [3.19, 35.34], [-0.12, 26.14], [-1.95, 21.06]], 5],
  [[[-23.37, -22.15], [-17.83, -6.74], [-12.63, -8.61], [-14.16, -12.87], [-14.54, -13.93], [-18.17, -24.02]], 5],
]
// The courtyard block (relation/3272134, 10 m gabled) and its low east end (relation/3272137, 6-9 m).
const BLOCK: XY[] = [[18.43, 43.72], [24.99, 41.31], [26.69, 40.69], [34.13, 60.89], [36.68, 59.96], [39.04, 66.36], [36.49, 67.31], [44.83, 89.97], [27.34, 96.41], [19.0, 73.77], [16.75, 74.59], [14.38, 68.15], [16.63, 67.32], [9.2, 47.13], [11.86, 46.15]]
const BLOCK_END: XY[] = [[24.99, 41.31], [21.62, 32.15], [8.49, 36.97], [11.86, 46.15], [18.43, 43.72]]

if (area(OUTER) <= 0) throw new Error('OUTER must run counter-clockwise')
const ochre = new Part(), white = new Part(), roof = new Part(), win = new Part(), gate = new Part()

const H = 20
// ---- walls in bands: plinth, ground storey, string course, first storey, frieze line, frieze, cornice
for (const ring of [OUTER, COURT]) {
  walls(white, ring, 0, 1.0)
  walls(ochre, ring, 1.0, 9.0)
  walls(white, ring, 9.0, 9.6)
  walls(ochre, ring, 9.6, 16.6)
  walls(white, ring, 16.6, 17.0)
  walls(ochre, ring, 17.0, 18.9)
  walls(white, ring, 18.9, H - 0.6)
  cornice(white, ring, H, 0.6, 0.6)
}
hipRoof(roof, simplify(OUTER, 1.5), [simplify(COURT, 1.0)], H + 0.02, 4, 8, 7)

// ---- windows
/** A round-headed window in a white surround: glass below, a white lunette in the arch. */
const arched = (e: Edge, u: number, z0: number, z1: number) => {
  archPanel(white, e, u, 3.2, z0, z1 - 1.6, 0.04, 6)
  panel(win, e, u - 0.85, u + 0.85, z0 + 0.5, z1 - 1.55, 0.07)
}
/** The fronts' rhythm: pairs 3.8 m apart and singles between, 4.8 m on, centred on the run [u0, u1]. */
const rhythm = (u0: number, u1: number) => {
  const L = u1 - u0, k = Math.max(0, Math.floor((L - 5 - 3.8) / 13.4))
  const span = 13.4 * k + 3.8, s = u0 + (L - span) / 2, out: number[] = []
  for (let i = 0; i <= k; i++) {
    out.push(s + 13.4 * i, s + 13.4 * i + 3.8)
    if (i < k) out.push(s + 13.4 * i + 8.6)
  }
  return L > 6 ? out : L > 3 ? [u0 + L / 2] : []
}
const front = (e: Edge, us: number[], surround = true) => {
  for (const u of us) {
    if (surround) { arched(e, u, 1.7, 7.9); arched(e, u, 10.1, 16.2) }
    else { panel(win, e, u - 0.75, u + 0.75, 2.6, 6.2, 0.05); panel(win, e, u - 0.75, u + 0.75, 11.0, 14.4, 0.05) }
  }
}
/** A gateway: white pilasters, the round-arched passage, the arched window over it on a white panel. */
const gateway = (e: Edge, uc: number) => {
  for (const du of [-6.6, -4.6, 4.6, 6.6]) pilaster(white, e, uc + du, 0.8, 0.4, 1.0, H - 0.6, false)
  panel(white, e, uc - 3.4, uc + 3.4, 1.0, 9.6, 0.04)
  archPanel(gate, e, uc, 4.6, 0, 5.6, 0.08, 10)
  archPanel(white, e, uc, 3.0, 10.4, 14.5, 0.05, 8)
  panel(win, e, uc - 0.85, uc + 0.85, 11.0, 14.6, 0.08)
}

const oe = edges(OUTER)
// South front: one 85 m run from v2 to v6, the gate at v4.
{
  const e = edgeOf(OUTER[2], OUTER[6]), ug = Math.hypot(OUTER[4][0] - OUTER[2][0], OUTER[4][1] - OUTER[2][1])
  gateway(e, ug)
  front(e, [...rhythm(0, ug - 8), ...rhythm(ug + 8, e.L)])
}
// East front: the two long runs and the projecting gate block (v8 to v10, the gate at v9).
front(oe[6], rhythm(0, oe[6].L))
front(oe[11], rhythm(0, oe[11].L))
{
  const e = edgeOf(OUTER[8], OUTER[10])
  gateway(e, e.L / 2)
}
// North front, toward the Nikolskaya Tower.
front(oe[12], rhythm(0, oe[12].L))
// West front, by the Kremlin wall: plain windows.
for (const i of [14, 18, 22]) front(oe[i], rhythm(0, oe[i].L), false)

// Courtyard: plain windows on a 5 m pitch, none behind a gallery.
const inGallery = (p: XY) => GALLERIES.some(([r]) => inside(p, r))
for (const e of edges(COURT)) {
  if (e.L < 4) continue
  for (const u of bays(e.L, 5, 1.2)) {
    const p: XY = [e.a[0] + e.t[0] * u + e.n[0] * 1.0, e.a[1] + e.t[1] * u + e.n[1] * 1.0]
    if (inGallery(p)) continue
    panel(win, e, u - 0.7, u + 0.7, 2.6, 6.2, 0.05)
    panel(win, e, u - 0.7, u + 0.7, 11.0, 14.4, 0.05)
  }
}

// ---- courtyard galleries and the courtyard block
for (const [ring, h] of GALLERIES) {
  prism(ochre, ring, 0, h - 0.5, null)
  prism(white, ring, h - 0.5, h, roof)
}
prism(ochre, BLOCK, 0, 7.0, null)
hipRoof(roof, simplify(BLOCK, 3.0), [], 7.0, 3.0, 4.0)
prism(ochre, BLOCK_END, 0, 6.0, roof)

// ---- write
const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.9)
await save('moscow-arsenal.glb', 'Arsenal', [
  { part: ochre, material: { ...finish('kremlin-ochre', KREMLIN.ochre), floodlight: lit } },
  { part: white, material: { ...PALETTE.trim, color: KREMLIN.white, floodlight: lit } },
  { part: roof, material: finish('kremlin-roof', KREMLIN.roof) },
  { part: win, material: PALETTE.window },
  { part: gate, material: finish('arsenal-gate', 0x5c5048) },
], { bearing: 0, elevation: 0, height: 24 })
