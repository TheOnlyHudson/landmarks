/**
 * Deutscher Dom, Gendarmenmarkt, Berlin (the domed tower by Carl von
 * Gontard and Georg Christian Unger, 1780-1785, with the Neue Kirche of
 * 1701-1708 behind it; rebuilt 1983-1996): procedural, CC0-1.0, no
 * textures. bun generators/berlin-deutscher-dom.ts
 *
 * Writes models/berlin-deutscher-dom.glb (low) and
 * models/berlin-deutscher-dom.detail.glb (detail). Draws the tower with
 * `gontardTower` from berlin-franzoesischer-dom.ts (the two towers are
 * twins) and the Konzerthaus kit: merge berlin-konzerthaus.ts and
 * berlin-franzoesischer-dom.ts first.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 354.66 (the
 * tower's walls in OSM way/43347270): model +y is compass 354.66. Anchor:
 * the area centroid of way/43347270, lng 13.392697, lat 52.512747. The
 * tower's centre is at (-2.05, 0.2); its porticoes face model north, east
 * and south; the church body is to the west. z = 0 is the paving (flat).
 *
 * What makes it the Deutscher Dom, and how each is drawn
 * - The twin of the Französischer Dom's tower (see that generator): three
 *   hexastyle Corinthian porticoes with their pediments and reliefs, the
 *   attic with its statues, the drum ringed by twelve Corinthian columns,
 *   the balustrade, the upper drum with wreathed oculi and urns, the ribbed
 *   copper dome with gilt rosettes, and the gilt figure of Virtue on top,
 *   her left arm stretched out.
 * - The pentagonal church body (the old Neue Kirche, rebuilt in the
 *   1880s style) west of the tower: pale walls with pilasters and tall
 *   round-headed windows, statues on its corners, and its broad dark
 *   slate dome (about 23 m across) with the small balustraded lantern.
 *
 * Evidence
 * - OSM (ODbL): way/43347270 (building=church "Deutscher Dom", wikidata
 *   Q315644, sandstone, roof #8c8d85), its parts way/1552506881 (drum ring,
 *   height 40) and way/1552506882 (dome, height 40), and way/43347597
 *   (building=church "Neue Kirche", roof:shape dome, roof:colour #4d5156,
 *   roof:height 5).
 * - Published (de.wikipedia "Deutscher Dom"): Gontard and Unger 1780-85,
 *   mirror of the Französischer Dom; the tower's dome about 13 m across,
 *   with the gilt figure of Virtue (after Kambly); the church on a
 *   pentagonal plan under a round dome of about 23 m.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Berlin, Deutscher Dom -- 2013 -- 4576.jpg", Dietmar Rabich,
 *     CC BY-SA 4.0 (from the north-east: north and east porticoes, the
 *     church body and its dark dome)
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Deutscher_Dom_--_2013_--_4576.jpg
 *   "Deutscher Dom, Gendarmenmarkt, Berlin-Mitte, 150926, ako.jpg", Ansgar
 *     Koreng, CC BY 3.0 de (the north front square-on at dusk, floodlit)
 *     https://commons.wikimedia.org/wiki/File:Deutscher_Dom,_Gendarmenmarkt,_Berlin-Mitte,_150926,_ako.jpg
 *   "Deutscher Dom (Berlin-Mitte).Blick von Westen.4.09065016.ajb.jpg" and
 *     "...Nordfassade.2.09065016.ajb.jpg", Ajepbah, CC BY-SA 3.0 de (the
 *     dome, rosettes, urns, oculi, the figure of Virtue; the north
 *     pediment relief and statues)
 *     https://commons.wikimedia.org/wiki/File:Deutscher_Dom_(Berlin-Mitte).Blick_von_Westen.4.09065016.ajb.jpg
 *   "Deutscher Dom (Berlin), 2024 (01).jpg", Bahnfrend, CC BY-SA 4.0
 *     (from the south-east)
 *     https://commons.wikimedia.org/wiki/File:Deutscher_Dom_(Berlin),_2024_(01).jpg
 *   "Deutscher Dom East side 9102.jpg", Dosseman, CC BY-SA 4.0.
 * - Heights: as the Französischer Dom (the towers are twins), checked
 *   against the Koreng photo; the church body's cornice at the portico
 *   cornice (14.2 m), its parapet to 15.4, the slate dome to 23.5 and the
 *   lantern to 26.5, from the Rabich photo against the tower's columns.
 * - Plan from OSM; the church outline simplified to its corners.
 * - Invented/simplified: statues as bold figures; reliefs (detail) as rows
 *   of figures; the church's windows evenly spaced on each wall.
 * - Look-only references: none.
 * - Doubts: the church's west and south walls are not in any photo used.
 *
 * Night: floodlit all round; windows glow; both domes stay dark.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect } from './dc-white-house'
import { lodKit, faceOf, fpanel, fblock } from './london-british-museum'
import { LOW, HIGH, type Q } from './london-albert-memorial'
import { lathe as rev } from './berlin-fernsehturm'
import { welded } from './berlin-reichstag'
import { capPoly, wallsPoly, offsetPoly, type XY } from './dc-national-cathedral'
import { statue, mat, setSculptCrease } from './berlin-konzerthaus'
import { gontardTower, roundWin, type TowerParts } from './berlin-franzoesischer-dom'
import { cylinder } from './dc-white-house'
import { TAU } from './nyc-columbus-monument'

export const ID = 'berlin-deutscher-dom'
export const BEARING = 354.66

const C: XY = [-2.05, 0.2]
/** The church body (OSM way/43347597, simplified to its corners). */
const CHURCH: XY[] = [
  [-14.5, -13.5], [-21.6, -13.9], [-26.9, -18.6], [-34.9, -15.6], [-36.6, -8.8], [-42.4, -5.0], [-43.9, -4.4],
  [-43.9, 4.0], [-42.4, 4.3], [-37.0, 8.4], [-35.6, 14.6], [-27.4, 18.2], [-22.0, 13.7], [-14.5, 13.3],
]
const DC: XY = [-29.0, 0] // the church dome's centre

function build(hi: boolean) {
  const L = lodKit(hi)
  const Q: Q = hi ? HIGH : LOW
  setSculptCrease(hi ? 70 : 179)
  const copper = new Part(), slate = new Part()
  const P: TowerParts = { stone: new Part(), trim: new Part(), copper, gilt: new Part(), win: new Part(), figures: slate, roof: slate }
  gontardTower(P, Q, L, C, ['n', 'e', 's'], {
    H: 12.45,
    // Virtue: the left arm stretched out and down, the right at her side.
    topArms: [[[0.13, 0, 0.78], [0.16, 0.04, 0.6], [0.14, 0.1, 0.48]], [[-0.13, 0, 0.78], [-0.3, 0.08, 0.7], [-0.46, 0.12, 0.64]]],
  })
  const { stone, trim, win } = P

  // ===== The church body ====================================================
  const ZCE = 14.2, ZPAR = 15.4
  wallsPoly(stone, CHURCH, 0, ZCE - 1.0)
  const grown = offsetPoly(CHURCH, 0.45)
  wallsPoly(trim, grown, ZCE - 1.0, ZCE)
  capPoly(trim, grown, ZCE - 1.0, false)
  wallsPoly(trim, offsetPoly(CHURCH, 0.15), 0, 0.9)
  // Parapet over the cornice and the flat roof inside it.
  wallsPoly(stone, CHURCH, ZCE, ZPAR)
  capPoly(slate, CHURCH, ZPAR - 0.05, true)
  // Pilasters at the corners and tall round-headed windows between.
  for (let i = 0; i < CHURCH.length; i++) {
    const a = CHURCH[i], b = CHURCH[(i + 1) % CHURCH.length]
    const f = faceOf(a, b)
    if (Math.abs(a[0] + 14.5) < 0.1 && Math.abs(b[0] + 14.5) < 0.1) continue // against the tower
    // faceOf's outward side is to the right: the ring runs clockwise from above here.
    const g = f.n[0] * ((a[0] + b[0]) / 2 - DC[0]) + f.n[1] * ((a[1] + b[1]) / 2 - DC[1]) > 0 ? f : faceOf(b, a)
    if (g.len > 2.5) for (const s of [0.45, g.len - 0.45]) fblock(trim, g, s - 0.45, s + 0.45, 0.9, ZCE - 1.0, 0, 0.3)
    const n = Math.floor(g.len / 4.4)
    for (let k = 0; k < n; k++) {
      const s = (g.len * (k + 0.5)) / n
      fpanel(win, g, s - 0.95, s + 0.95, 5.0, 10.4)
      roundWin(win, g, s, 10.4, 0.95, hi ? 8 : 4)
      if (hi) fblock(trim, g, s - 1.3, s + 1.3, 3.7, 4.1, 0, 0.25, true)
    }
  }
  // Statues on the parapet at the main corners.
  if (hi) for (const [x, y] of [[-26.9, -18.6], [-27.4, 18.2], [-43.9, -4.4], [-43.9, 4.0], [-34.9, -15.6], [-35.6, 14.6]] as XY[]) {
    const d = Math.hypot(x - DC[0], y - DC[1]), px = x - ((x - DC[0]) / d) * 1.0, py = y - ((y - DC[1]) / d) * 1.0
    cbox(trim, rect(px - 0.7, px + 0.7, py - 0.7, py + 0.7), ZPAR, ZPAR + 0.8, { b: 0.1 })
    statue(slate, Q, [px, py, ZPAR + 0.8], Math.atan2(y - DC[1], x - DC[0]) - Math.PI / 2, 2.4, 1)
  }
  // The slate dome on its low drum, and the balustraded lantern.
  const k = hi ? 32 : 14
  rev([[12.0, ZPAR - 0.5], [12.0, ZPAR + 0.6], [11.6, ZPAR + 0.6]], () => trim, k, 30, DC)
  rev([[11.6, ZPAR + 0.6], [11.4, 17.6], [10.4, 19.6], [8.6, 21.3], [6.0, 22.6], [3.0, 23.3], [1.9, 23.5]], () => slate, k, 50, DC)
  rev([[1.9, 23.5], [1.9, 24.6], [2.2, 24.6], [2.2, 25.0], [1.2, 25.0], [1.2, 26.0], [0.0, 26.3]], (b) => (b < 3 ? trim : slate), hi ? 16 : 8, 30, DC)
  if (hi) for (let i = 0; i < 16; i++) {
    const a = (i * TAU) / 16
    cylinder(trim, DC[0] + 2.05 * Math.cos(a), DC[1] + 2.05 * Math.sin(a), 0.07, 25.0, 25.8, 4)
  }

  // ===== Materials and night ================================================
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : p[0] > -15 ? 0.95 : 0.6)
  const W = (p: Part, c = 30) => welded(p, c)
  return [
    { part: W(stone), material: { ...mat('dom-render', 0xede6d4), floodlight: lit } },
    { part: W(trim, hi ? 30 : 40), material: { ...mat('dom-sandstone', 0xcabea4), floodlight: lit } },
    { part: W(copper, hi ? 50 : 179), material: mat('dom-copper', 0x445a54, 0.6) },
    { part: W(P.gilt, hi ? 60 : 179), material: { ...mat('dom-gilt', 0xd6a73e, 0.4), floodlight: (p: V3) => (p[2] > 55 ? 0.9 : 0) } },
    { part: W(win), material: mat('window', 0x64798a, 0.35) },
    { part: W(slate, hi ? 50 : 179), material: mat('dom-slate', 0x666d73, 0.7) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Deutscher Dom', wikidata: 'Q315644', bearing: BEARING, osm: 'way/43347270' }
  writeModel('Deutscher Dom', ID, build(false), extras, 6500)
  writeModel('Deutscher Dom', ID, build(true), extras, 40000, `${ID}.detail`)
}
