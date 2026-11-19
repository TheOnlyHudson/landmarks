/**
 * Nashville Public Library, Main Library, 615 Church Street (2001, Robert
 * A. M. Stern Architects) — original procedural geometry, CC0-1.0.
 * bun generators/nash-public-library.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * points out of the Church Street front (it closes the view up Capitol
 * Boulevard) and +x runs toward 6th Avenue. Anchor = area centroid of OSM
 * relation/1762149 (outer way/130905912, the courtyard way/130905918
 * removed), 36.161945, -86.781736. y = 0 is the lowest ground under the
 * footprint (the south-east corner, lidar ground_min + 0.8); Church
 * Street in front is 8.4 m higher, so the lower storeys show only on the
 * falling sides and on Commerce Street.
 *
 * Identity, in order: the temple front of the central hall on Church
 * Street: broad antae, two Ionic columns in antis before a recessed
 * loggia with three doors, an entablature carried out as a balcony, three
 * tall windows and a low pediment; the hall's long low gable running back
 * over the Grand Reading Room; the lower pale-limestone wings either side
 * with arched openings at the street and slightly proud corner pavilions;
 * the big block with its central courtyard garden on the podium, ringed
 * by an arcade; the attic over the reading rooms.
 *
 * Evidence:
 *  - plan: OSM relation/1762149 (106 x 83 m and the front strip; the
 *    courtyard drawn as a rectangle, its rounded ends left out), checked
 *    against the lidar: hall x -12.3..12.6, front at y 46.6; wings' face
 *    at y 45.4.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 1 m grid in the
 *    model frame, above y = 0: main parapet 27.6 (roof 26.4); corner
 *    pavilions 28.8; attic 30.1; hall eaves 32.1, ridge 36.0; the
 *    balcony 20.6, projecting 1.7 m; the plant block 31.7; the courtyard
 *    garden 14.6 with hedges to 18.7; Church Street 8.4. Measured.
 *  - the temple front from Mx. Granger's photo (hall width 24.9 m from
 *    the lidar: antae 4.3 m, columns 3.2 m off the axis, doors 2.6 m),
 *    heights scaled from the street and the lidar balcony; the wings from
 *    the same photo and Ken Lund's view up Capitol Boulevard; the
 *    courtyard from Antony-22's photo. Estimated.
 *  - colours: warm pale limestone (sampled #c5b9a7 in shade, pulled to the
 *    palette lightness), paler dressings, dark oak doors, grey-blue
 *    spandrel panels and roofs, the courtyard garden muted green.
 *
 * Photos:
 *  - Nashville Public Library main branch.jpg, Mx. Granger, CC0 (the
 *    temple front) https://commons.wikimedia.org/wiki/File:Nashville_Public_Library_main_branch.jpg
 *  - Nashville Public Library, Nashville, Tennessee, Ken Lund, CC BY-SA
 *    2.0 (Openverse/Flickr; the Church Street front from Capitol
 *    Boulevard) https://www.flickr.com/photos/75683070@N00/97057560
 *  - Nashville Public Library 2023c.jpg, Antony-22, CC BY-SA 4.0 (the
 *    courtyard) https://commons.wikimedia.org/wiki/File:Nashville_Public_Library_2023c.jpg
 * Look-only (not relied on): niseag03's Flickr photos (CC BY-ND).
 * No commercial imagery.
 *
 * Night: windows glow; the doors are `entrance`; the temple front is
 * floodlit.
 *
 * Left out: the lettering, the balcony railing (drawn solid), lamps,
 * flagpoles, the decorative frieze on the wings, column flutes and
 * volutes (plain shafts with a capital block), the courtyard's tile roofs
 * and fountain.
 *
 * Doubts: no licensed photo shows the 6th and 7th Avenue sides or the
 * Commerce Street back; they are drawn with an even rhythm of windows
 * over a stone base, matching the wings (estimated). The roof monitors are
 * from the lidar only. The courtyard's arcade and window rhythm are
 * simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, box, capPoly, type XY } from './atl-westin-peachtree-plaza'
import { opening, shape, rectOn, band, prismV, block, type Face } from './nash-ryman-auditorium'
import { wf, rect, shaft, lathe, type Side } from './nash-downtown-presbyterian'

// Model frame, bearing 332: +y out of the Church Street front. z above y = 0 = lidar ground_min + 0.8.
const X0 = -53.4, X1 = 53.2, YS = -48.0, YN = 33.8
const WF = 45.4 // the front wings' face on Church Street
const HX0 = -12.3, HX1 = 12.6, HF = 46.6, AX = (HX0 + HX1) / 2 // the central hall
const CX0 = -19.0, CX1 = 18.6, CY0 = -37.1, CY1 = -0.7 // the courtyard
const TOP = 27.6, CHURCH = 8.4, COURT = 14.6

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part(), garden = new Part()

  // ── Massing (lidar) ──
  const blocks: [number, number, number, number][] = [
    [X0, CY1, X1, YN], [X0, YS, X1, CY0], [X0, CY0, CX0, CY1], [CX1, CY0, X1, CY1], [-44.6, YN - 0.2, 44.3, WF],
  ]
  for (const [a, b, c, d] of blocks) prism(stone, rect(a, b, c, d), 0, TOP, roof, 0.3)
  // corner pavilions on Church Street, a little proud and higher
  for (const [a, c] of [[-44.6, -32.0], [32.0, 44.3]]) prism(stone, rect(a, WF - 1, c, HF), 0, 28.8, roof, 0.3)
  // the courtyard: a garden on the podium at 14.6
  prism(stone, rect(CX0 - 0.1, CY0 - 0.1, CX1 + 0.1, CY1 + 0.1), 0, COURT, garden, 0.05)
  // attic over the reading rooms, and the plant/lantern block in the south-west
  prism(stone, rect(-40, 9, 40, 30.5), TOP - 0.3, 30.1, roof, 0.3)
  prism(stone, rect(-40, -27, -28, -9), TOP - 0.3, 31.7, roof, 0.3)
  // the hall: walls to 32.1, a low gable to 36.0, pediments front and back
  prism(stone, rect(HX0, 9, HX1, HF), 0, 31.2, roof, 0.05)
  block(trim, HX0 - 0.35, HX1 + 0.35, 9 - 0.35, HF + 0.45, 31.2, 32.1)
  {
    const r0 = 32.1, r1 = 36.0
    const prof: XY[] = [[HX0 - 0.35, r0], [HX1 + 0.35, r0], [AX, r1]]
    prismV(roof, [[HX0 - 0.5, r0 - 0.05], [HX1 + 0.5, r0 - 0.05], [AX, r1 + 0.1]], [1, 0], [0, 0], 8.6, HF + 0.2, roof)
    prismV(stone, prof, [1, 0], [0, 0], HF - 0.6, HF + 0.45) // the front pediment
    prismV(stone, prof, [1, 0], [0, 0], 8.6, 9.6)
  }

  // ── Faces: cornice, base, windows ──
  const faces: [Side, number, number, number][] = [
    ['E', X1, YS, YN], ['W', X0, YS, YN], ['S', YS, X0, X1],
  ]
  for (const [d, c, lo, hi] of faces) {
    const { f } = wf(d, c, lo, hi)
    band(trim, f, 0, f.L, TOP - 1.4, TOP - 0.9, 0.3)
    band(trim, f, 0, f.L, 8.0, 8.5, 0.12)
    const n = Math.round(f.L / 6.5), bw = f.L / n
    for (let i = 0; i < n; i++) {
      const sc = bw * (i + 0.5)
      rectOn(win, f, sc - 1.1, sc + 1.1, 14.3, 19.4, 0.06)
      rectOn(win, f, sc - 1.1, sc + 1.1, 21.3, 24.9, 0.06)
      band(trim, f, sc - 1.4, sc + 1.4, 13.9, 14.3, 0.1)
    }
  }
  // the Church Street wings: arched openings at the street, tall windows above, a frieze
  for (const [a, b] of [[-32.0, HX0], [HX1, 32.0]]) {
    const { f, s } = wf('N', WF, a, b)
    band(trim, f, 0, f.L, TOP - 1.4, TOP - 0.9, 0.3)
    band(trim, f, 0, f.L, 19.8, 20.4, 0.12)
    const n = 3, bw = f.L / n
    for (let i = 0; i < n; i++) {
      const sc = bw * (i + 0.5)
      shape(trim, f, opening(sc, 3.0, CHURCH, 11.6, 'round', 8), 0.04)
      shape(win, f, opening(sc, 2.4, CHURCH + 0.1, 11.6, 'round', 8), 0.08)
      rectOn(win, f, sc - 1.4, sc + 1.4, 14.0, 19.2, 0.06)
      rectOn(win, f, sc - 1.1, sc + 1.1, 21.4, 25.0, 0.06)
    }
    void s
  }
  for (const [a, c] of [[-44.6, -32.0], [32.0, 44.3]]) {
    const { f } = wf('N', HF, a, c)
    band(trim, f, 0, f.L, 27.0, 27.6, 0.3)
    band(trim, f, 0, f.L, 19.8, 20.4, 0.12)
    rectOn(win, f, f.L / 2 - 1.3, f.L / 2 + 1.3, 14.0, 19.2, 0.06)
    rectOn(win, f, f.L / 2 - 1.0, f.L / 2 + 1.0, 21.4, 25.0, 0.06)
    shape(trim, f, opening(f.L / 2, 3.0, CHURCH, 11.6, 'round', 8), 0.04)
    shape(door, f, opening(f.L / 2, 2.4, CHURCH + 0.1, 11.6, 'round', 8), 0.08)
  }

  // ── The temple front of the hall ──
  {
    const { f, s } = wf('N', HF, HX0, HX1)
    const m = s(AX), L = f.L
    // antae either side; the loggia recessed between them
    const R0 = 4.3, R1 = L - 4.3
    band(stone, f, 0, R0, 0, 19.6, 0.4)
    band(stone, f, R1, L, 0, 19.6, 0.4)
    rectOn(roof, f, R0, R1, 13.0, 14.6, 0.04) // the dark spandrel panels
    for (const k of [-5.3, 0, 5.3]) {
      rectOn(win, f, m + k - 2.3, m + k + 2.3, 14.8, 19.2, 0.06)
      rectOn(trim, f, m + k - 1.6, m + k + 1.6, CHURCH, 12.7, 0.05)
      rectOn(door, f, m + k - 1.3, m + k + 1.3, CHURCH, 12.3, 0.09)
    }
    // two Ionic columns in antis (plain round shafts with a capital block)
    for (const k of [-3.2, 3.2]) {
      const p = f.P(m + k, 0, 1.1)
      shaft(trim, p[0], p[1], 1.05, 0.95, CHURCH, 18.9, 12)
      lathe(trim, p[0], p[1], [[1.25, CHURCH - 0.1], [1.25, CHURCH + 0.5], [1.05, CHURCH + 0.7]], 12, false)
      block(trim, p[0] - 1.3, p[0] + 1.3, p[1] - 0.8, p[1] + 0.8, 18.9, 19.6)
    }
    // the entablature with the lettered frieze, projecting as a balcony
    block(trim, HX0 - 0.2, HX1 + 0.2, HF, HF + 1.7, 19.6, 20.9)
    block(trim, HX0 + 1.2, HX1 - 1.2, HF + 0.1, HF + 1.5, 20.9, 21.9) // the balcony railing, drawn solid
    // three tall upper windows between pilasters
    for (const k of [-5.6, 0, 5.6]) {
      rectOn(win, f, m + k - 2.1, m + k + 2.1, 21.6, 29.9, 0.06)
      rectOn(trim, f, m + k - 0.1, m + k + 0.1, 21.6, 29.9, 0.1)
      rectOn(trim, f, m + k - 2.1, m + k + 2.1, 25.6, 25.8, 0.1)
    }
    band(trim, f, 0, L, 30.4, 31.2, 0.25)
  }

  // ── The courtyard walls: an arcade on the garden, windows above ──
  for (const [d, c, lo, hi] of [['S', CY1, CX0, CX1], ['N', CY0, CX0, CX1], ['E', CX0, CY0, CY1], ['W', CX1, CY0, CY1]] as [Side, number, number, number][]) {
    const { f } = wf(d, c, lo, hi)
    const n = Math.max(2, Math.round(f.L / 4.6)), bw = f.L / n
    for (let i = 0; i < n; i++) {
      const sc = bw * (i + 0.5)
      shape(roof, f, opening(sc, 2.6, COURT, 16.6, 'round', 6), 0.06)
      rectOn(win, f, sc - 0.8, sc + 0.8, 18.4, 21.0, 0.06)
      rectOn(win, f, sc - 0.8, sc + 0.8, 22.4, 25.0, 0.06)
    }
    band(trim, f, 0, f.L, 17.6, 18.0, 0.1)
  }
  // the little pedimented pavilion on the courtyard's north side
  prismV(trim, [[AX - 4.5, TOP - 0.1], [AX + 4.5, TOP - 0.1], [AX, 29.0]], [1, 0], [0, 0], CY1 - 0.2, CY1 + 7)

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > HF - 0.5 && p[0] > HX0 - 0.5 && p[0] < HX1 + 0.5 ? 0.7 : 0)
  return [
    { part: stone, material: { ...finish('library-limestone', 0xe3d9c8), floodlight: flood } },
    { part: trim, material: { ...finish('library-dressings', 0xf0e9dc), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('library-roof', 0x8e9aa2) },
    { part: door, material: { ...PALETTE.entrance, color: 0x7d5f45 } },
    { part: garden, material: finish('library-garden', 0x9aa88c) },
  ]
}

if (import.meta.main) {
  const { save } = await import('./atl-westin-peachtree-plaza')
  await save('nash-public-library', 'Nashville Public Library', build(), { height: 36.0, anchor: [36.161945, -86.781736], bearing: 332 })
}
