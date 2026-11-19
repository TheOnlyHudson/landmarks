/**
 * Tootsie's Orchid Lounge, 422 Broadway, Nashville (a 19th-century brick
 * commercial building, the honky-tonk since 1960, painted purple; the
 * rooftop bar and the third storey at the back added since the 2000s) —
 * original procedural geometry, CC0-1.0. Requested by the user as the
 * Lower Broadway honky-tonk.
 * bun generators/nash-tootsies.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * runs from Broadway back toward the alley behind the Ryman; the Broadway
 * front is the -y face. Anchor = area centroid of OSM way/464661786,
 * 36.160911, -86.778299. y = 0 is the lowest ground under the footprint
 * (the Broadway pavement, lidar ground_min + 0.4); the alley at the back
 * is ~2.6 m higher.
 *
 * Identity, in order: the lavender-purple painted two-storey front with a
 * dark-purple bracketed cornice, corner pilasters and four round-arched
 * windows under dark hoods; the storefront with its photo strip, two
 * windows full of red "World Famous Tootsie's" signs, the door and the
 * arched side door; the neon blade sign at the east corner; the rooftop
 * patio over the front block with its railing and umbrellas; the plain
 * purple third storey at the back, its bar opening onto the patio.
 *
 * Evidence:
 *  - plan: OSM way/464661786 (8.2 x 39.5 m), checked against the lidar;
 *    the party walls are shared with Legends Corner (west, way/464661822)
 *    and Second Fiddle (east, way/464661799), neither modelled.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid in
 *    the model frame: the front block's roof (the patio) 9.7, umbrellas to
 *    ~11.2; the rear block from y -7 back, 14.2, plant to 15.7. Measured.
 *  - the front: from Ttotallytexan's square-on photo (46 px/m at the
 *    8.2 m front): windows 1.1 m wide at x -2.87, -0.98, 0.91, 2.83, sills
 *    4.9, heads 7.6; belt course 4.0–4.5; cornice 8.95–9.9; railing to
 *    ~11. The blade sign from LeMay's 2024 photo (~0.4 x 1.5 x 3.5 m).
 *    Estimated.
 *  - colours: wall lavender (sampled #cfafcc–#d2a7d2 in sun, pulled to the
 *    palette lightness), trim dark purple (#492b53, pulled light), the
 *    sign windows red, the blade sign lavender-white.
 *
 * Photos (all EVIDENCE):
 *  - Tootsies 2015.jpg, Ttotallytexan, CC BY-SA 4.0 (front square on)
 *    https://commons.wikimedia.org/wiki/File:Tootsies_2015.jpg
 *  - Tootsies Orchid Lounge - Nashville TN (31278037357).jpg, FaceMePLS,
 *    CC BY 2.0 (the west side, the patio and the rear storey)
 *    https://commons.wikimedia.org/wiki/File:Tootsies_Orchid_Lounge_-_Nashville_TN_(31278037357).jpg
 *  - Tootsies Orchid Lounge Sign, Broadway, Nashville, TN (54384526253),
 *    Warren LeMay, CC BY-SA 2.0 (the blade sign)
 *    https://commons.wikimedia.org/wiki/File:Tootsies_Orchid_Lounge_Sign,_Broadway,_Nashville,_TN_(54384526253).jpg
 *  - Tootsies and Second Fiddle, Broad St., Nashville.JPG, Michael Rivera,
 *    CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Tootsies_and_Second_Fiddle,_Broad_St.,_Nashville.JPG
 *  - Tootsies Orchid Lounge - Nashville.jpg, Kathleen Conklin, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Tootsies_Orchid_Lounge_-_Nashville.jpg
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the storefront signs (`neon-tootsies-red`) and the
 * blade sign (`neon-tootsies-lavender`) glow in their own colours. Their
 * lettering is not drawn: they are plain neon boxes, as the brief asks.
 *
 * Left out: the painted "Tootsie's Orchid Lounge" mural on the west wall
 * (paint, not a lit sign), the photo strip's pictures, the window neon,
 * lamps, the yellow half of the umbrellas (all drawn purple), the patio's
 * furniture.
 *
 * Doubts: the back (alley) face is not photographed and is drawn plain;
 * the rear storey's opening onto the patio is from one oblique photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, box } from './atl-westin-peachtree-plaza'
import { opening, shape, rectOn, band, block } from './nash-ryman-auditorium'
import { wf, rect, lathe } from './nash-downtown-presbyterian'

// Model frame, bearing 332: +y runs back from Broadway toward the Ryman; the front is the -y face.
const X0 = -4.1, X1 = 4.1, YF = -19.7, YM = -7.0, YB = 19.8
const DECK = 9.7, CORNICE = 9.9, REAR = 14.2

function build() {
  const wall = new Part(), trim = new Part(), win = new Part(), roof = new Part(), neon = new Part(), sign = new Part()

  // ── Massing (lidar) ──
  // the two-storey front block, its roof the rooftop patio
  prism(wall, rect(X0, YF, X1, YM + 0.2), 0, DECK, roof, 0.05)
  // the three-storey rear block (the bar's upper floor), back to the alley
  prism(wall, [[X0 - 0.1, YM], [X1, YM], [X1, 14.1], [4.0, YB], [-4.2, YB], [-4.2, 14.1]], 0, REAR, roof, 0.15)
  // rooftop plant on the rear block
  box(roof, -2.5, 0.5, 2.5, 6.5, REAR - 0.1, 15.7, roof, 0.1)

  // ── The Broadway front ──
  const { f, s } = wf('S', YF, X0, X1)
  const L = f.L
  // corner pilasters with their brackets, the bracketed cornice, the belt course
  for (const s0 of [0, L - 0.45]) band(trim, f, s0, s0 + 0.45, 0, CORNICE, 0.18)
  band(trim, f, 0, L, 8.0, 8.2, 0.12)
  band(trim, f, 0, L, 8.95, CORNICE - 0.3, 0.3)
  band(trim, f, -0.1, L + 0.1, CORNICE - 0.3, CORNICE, 0.55)
  for (const x of [-3.9, -1.9, 0, 1.9, 3.9]) band(trim, f, s(x) - 0.12, s(x) + 0.12, 8.3, 8.95, 0.3) // brackets
  band(trim, f, 0, L, 4.0, 4.5, 0.3)
  // four round-arched windows upstairs, each with a dark hood
  for (const x of [-2.87, -0.98, 0.91, 2.83]) {
    shape(trim, f, opening(s(x), 1.6, 4.75, 7.0, 'round', 8), 0.05)
    shape(win, f, opening(s(x), 1.1, 4.95, 7.0, 'round', 8), 0.09)
    rectOn(trim, f, s(x) - 0.75, s(x) + 0.75, 4.75, 4.95, 0.12) // sill
  }
  // the storefront: the photo strip, two sign-filled windows, the door, the arched side door
  rectOn(trim, f, s(-3.5), s(1.6), 2.95, 3.75, 0.06)
  for (const [a, b] of [[-3.4, -1.75], [-0.1, 1.4]]) {
    rectOn(win, f, s(a), s(b), 0.6, 2.8, 0.06)
    rectOn(sign, f, s(a) + 0.15, s(b) - 0.15, 0.9, 2.6, 0.1) // the red "World Famous Tootsie's" signs
  }
  rectOn(win, f, s(-1.6), s(-0.25), 0, 2.8, 0.06)
  shape(trim, f, opening(s(2.8), 1.5, 0, 2.85, 'round', 8), 0.05)
  shape(trim, f, opening(s(2.8), 1.1, 0, 2.85, 'round', 8), 0.08)
  // the rooftop patio's railing over the cornice, drawn as a solid low band
  for (const [a, b, c, d] of [[X0, YF, X1, YF + 0.12], [X0, YF, X0 + 0.12, YM], [X1 - 0.12, YF, X1, YM]]) block(trim, a, c, b, d, CORNICE, 10.95)
  // the patio's umbrellas, purple (half of them are yellow in reality)
  for (const [x, y] of [[-2.2, -17.0], [1.8, -16.2], [-1.6, -12.0], [2.2, -10.4]] as [number, number][]) {
    lathe(trim, x, y, [[0.06, DECK], [0.06, DECK + 2.0], [1.25, DECK + 2.0], [0.05, DECK + 2.6]], 8)
  }
  // the blade sign hung at the east corner of the upper storey: World Famous / Tootsie's
  block(trim, 3.2, 3.5, YF - 1.75, YF - 0.05, 8.0, 8.3) // bracket
  block(neon, 3.15, 3.55, YF - 1.7, YF - 0.25, 4.5, 8.0)

  // ── The rear block's front over the patio: the bar's opening ──
  {
    const g = wf('S', YM, X0, X1)
    rectOn(win, g.f, 1.0, 6.4, DECK + 0.5, DECK + 2.9, 0.06)
    band(trim, g.f, 0, g.f.L, REAR - 0.5, REAR, 0.2)
  }
  // the west side wall above Legends Corner: a window to the patio
  {
    const g = wf('W', X0 - 0.1, YM, YB)
    rectOn(win, g.f, 20.5, 23.0, DECK + 0.6, DECK + 2.4, 0.06)
  }

  return [
    { part: wall, material: finish('tootsies-purple', 0xcbaed6) },
    { part: trim, material: finish('tootsies-dark-purple', 0x7b5a8e) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: neon, material: finish('neon-tootsies-lavender', 0xd9c6f0) },
    { part: sign, material: finish('neon-tootsies-red', 0xb8403e) },
  ]
}

if (import.meta.main) {
  const { save } = await import('./atl-westin-peachtree-plaza')
  await save('nash-tootsies', "Tootsie's Orchid Lounge", build(), { height: 15.7, anchor: [36.160911, -86.778299], bearing: 332 })
}
