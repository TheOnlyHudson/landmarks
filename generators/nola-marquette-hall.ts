/**
 * Marquette Hall, Loyola University New Orleans (1910-11, rear part 1916-18;
 * Tudor-Gothic) — procedural, CC0-1.0, no textures.
 * bun generators/nola-marquette-hall.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 26.3: the front faces model −y
 * (compass 206.3°), across the horseshoe lawn to St. Charles Avenue; Holy
 * Name of Jesus Church stands to its west. Anchor: the area centroid of OSM
 * relation/4577139; the geometry below is drawn about a point 10.76 m west,
 * 1.02 m south of it in this frame (the axis lies at x 9.8 there), then shifted.
 *
 * Identity, in order: the long, symmetrical dark-red brick front with pale
 * cast-stone trim; the central bay between two tall crenellated turrets with
 * a stack of pale stone oriel windows, a stepped parapet and a cross; the
 * crenellated parapets, higher over the main wings with corner piers, lower
 * over the end sections with their own turrets; the window columns of paired
 * round-arched lights in pale stone surrounds, three storeys over a raised
 * basement; the terrace with its arcade and the double stair to the
 * entrance.
 *
 * Evidence
 * - OSM relation/4577139 (building=yes, height=25, levels 4; outer ways
 *   327443113, 327443096, 327443112, 327443078). Footprint x −19.9..40.3,
 *   y −13.5..14.4 in the drawing frame; its front line (y −10.4) is the terrace
 *   edge, the lidar puts the wall at y −8.7.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in this frame; ground 0.7 over the grid minimum = z 0.
 *   Wings parapet 17.8, their corner piers 19.5; end sections 14.1, end
 *   turrets 16.2; central bay x 4.5..14.3 at 20.9; its turrets 26.3 (three
 *   pairs: front, middle, rear); terrace 3.1; rear wall y 12.5; a low strip
 *   behind at about 6.5.
 * - NAIP (USGS, public domain): the flat grey roofs and turret plan.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Loyola University New Orleans (55142686987).jpg", ajay_suresh,
 *     CC BY 4.0: the front face-on (every bay, storey and turret)
 *     https://commons.wikimedia.org/wiki/File:Loyola_University_New_Orleans_(55142686987).jpg
 *   - "New Orleans (LA, USA) Loyola University.jpg", Arnoldius,
 *     CC BY-SA 4.0: the front from the lawn, the church beside it
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_(LA,_USA)_Loyola_University.jpg
 *   - "Loyola University.JPG", Paolo Zampella, CC BY-SA 3.0: the front
 *     https://commons.wikimedia.org/wiki/File:Loyola_University.JPG
 *   - "Loyola-New Orleans.jpg", Pierre5018, CC BY-SA 4.0: the front from the
 *     south-west, the west end
 *     https://commons.wikimedia.org/wiki/File:Loyola-New_Orleans.jpg
 *   - "Loyola - New Orleans - Marquette Hall, 2013.jpg", Ed Bierman,
 *     CC BY 2.0: the central bay, oriel and entrance close up
 *     https://commons.wikimedia.org/wiki/File:Loyola_-_New_Orleans_-_Marquette_Hall,_2013.jpg
 * - Published: Loyola University history: Marquette Hall, the university's
 *   first permanent building, 1910-11 (wings completed later).
 *
 * Measured (lidar): every height, the wall lines, the turrets. Estimated
 * from the face-on photo against the lidar parapet: the storey lines
 * (windows 3.9-7.6, 8.9-12.2, 13.4-15.6), the bay count (four a wing, two
 * an end section), the window widths, the oriel, the stairs and terrace
 * arcade. The sides and rear (no clear photo) get a plain rhythm of panels.
 * Left out: the Sacred Heart statue on its pedestal in front of the
 * entrance and the two statues by the door (too fine), the balustrade
 * tracery.
 *
 * Night: windows glow; the front is floodlit faintly (`floodlight`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, archPanel } from './nyc-city-hall'
import { rect, wall, rectRing, barCross, type Side } from './nola-st-patricks-church'
import { LOYOLA_BRICK, LOYOLA_STONE, crenels, pointed } from './nola-holy-name-of-jesus'

const arch = (p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05) => {
  const [a, b, s] = wall(side, c); archPanel(p, a, b, s(t), w, z0, zTop, d, 6)
}

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()

  const AX = 9.8, HW = 30.1                       // axis, half width
  const X0 = AX - HW, X1 = AX + HW                // −20.3 .. 39.9
  const FY = -8.7, RY = 12.5                      // front and rear walls
  const WING = 17.0, END = 13.3, CEN = 20.9, TUR = 26.3, TER = 3.1
  const CX0 = 4.6, CX1 = 14.3                     // central bay (turrets included)
  const EW = 9.4                                  // end section width
  const mx = (x: number) => 2 * AX - x            // mirror across the axis

  // ---------------- Masses ----------------
  // wings (higher) and end sections (lower), flat roofs
  for (const s of [-1, 1]) {
    const wa = s < 0 ? X0 + EW : CX1, wb = s < 0 ? CX0 : X1 - EW
    prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(wa, FY, wb, RY), z0: 0, z1: WING, facade: null, bevel: 0.15 })
    const ea = s < 0 ? X0 : X1 - EW, eb = s < 0 ? X0 + EW : X1
    prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(ea, FY, eb, RY), z0: 0, z1: END, facade: null, bevel: 0.15 })
    // crenellations along the front and the end faces
    crenels(brick, [wa + 0.6, FY + 0.15], [wb - 0.6, FY + 0.15], WING - 0.05, 0.8, 1.0, 1.0, 0.35)
    crenels(brick, [ea + 0.6, FY + 0.15], [eb - 0.6, FY + 0.15], END - 0.05, 0.8, 1.0, 1.0, 0.35)
    const xe = s < 0 ? X0 + 0.15 : X1 - 0.15
    crenels(brick, [xe, FY + 1.0], [xe, RY - 1.0], END - 0.05, 0.8, 1.0, 1.0, 0.35)
    // stone string course under the parapets
    block(stone, wa, FY - 0.15, wb, FY + 0.2, WING - 1.4, WING - 1.05)
    block(stone, ea, FY - 0.15, eb, FY + 0.2, END - 1.3, END - 0.95)
    // corner piers: the wing's outer corner, the end section's outer corner
    const pw = 1.6
    const pierW = s < 0 ? X0 + EW : X1 - EW
    prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(pierW - pw / 2, FY - 0.4, pierW + pw / 2, FY + 1.4), z0: 0, z1: 19.5, facade: null, bevel: 0.1 })
    crenels(brick, [pierW - pw / 2 + 0.3, FY - 0.25], [pierW + pw / 2 - 0.3, FY - 0.25], 19.45, 0.7, 0.5, 0.4, 0.3)
    const cx = s < 0 ? X0 + 0.9 : X1 - 0.9
    prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(cx - 1.0, FY - 0.3, cx + 1.0, FY + 1.7), z0: 0, z1: 16.2, facade: null, bevel: 0.1 })
    crenels(brick, [cx - 0.7, FY - 0.15], [cx + 0.7, FY - 0.15], 16.15, 0.7, 0.5, 0.4, 0.3)
  }
  // the low strip behind (OSM), and the rear crenels left plain
  prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(7.0, RY - 0.1, 40.3, 14.4), z0: 0, z1: 6.5, facade: null, bevel: 0.1 })

  // ---------------- Front windows ----------------
  // a column of paired round-arched lights in a pale stone surround, per bay
  const column = (x: number, top: number) => {
    rect(stone, 'front', FY, x, 2.7, 3.6, top, 0.05)
    const rows: [number, number][] = [[3.9, 7.6], [8.9, 12.2]]
    if (top > 15) rows.push([13.4, 15.6])
    for (const [z0, z1] of rows) {
      for (const d of [-0.6, 0.6]) arch(win, 'front', FY, x + d, 1.0, z0, z1, 0.1)
    }
  }
  const wingBays = (a: number, b: number, n: number, top: number) => { for (let k = 0; k < n; k++) column(a + ((b - a) * (k + 0.5)) / n, top) }
  wingBays(X0 + EW + 0.9, CX0 - 0.2, 4, 15.8)
  wingBays(CX1 + 0.2, X1 - EW - 0.9, 4, 15.8)
  wingBays(X0 + 1.9, X0 + EW - 0.8, 2, 12.4)
  wingBays(X1 - EW + 0.8, X1 - 1.9, 2, 12.4)
  // single narrow windows up the piers
  for (const x of [X0 + EW, X1 - EW]) for (const [z0, z1] of [[4.5, 6.8], [9.5, 11.6], [13.7, 15.4]]) rect(win, 'front', FY - 0.4, x, 0.7, z0, z1, 0.06)

  // sides and rear: a plain rhythm of panels, three storeys
  const plain = (side: Side, c: number, s0: number, s1: number, n: number, top: number) => {
    for (let k = 0; k < n; k++) {
      const t = s0 + ((s1 - s0) * (k + 0.5)) / n
      for (const [z0, z1] of [[3.9, 7.4], [8.9, 12.0], [13.4, 15.4]] as [number, number][]) if (z1 < top - 1) rect(win, side, c, t, 1.8, z0, z1, 0.05)
    }
  }
  plain('west', X0, FY + 1.5, RY - 1, 5, END)
  plain('east', X1, FY + 1.5, RY - 1, 5, END)
  plain('rear', RY, X0 + 1, X0 + EW - 1, 2, END)
  plain('rear', RY, X0 + EW + 1, CX0 - 1, 4, WING)
  plain('rear', RY, CX1 + 1, X1 - EW - 1, 4, WING)

  // ---------------- Central bay and turrets ----------------
  prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(CX0, FY, CX1, RY), z0: 0, z1: CEN, facade: null, bevel: 0.15 })
  for (const y of [FY - 0.5, 1.6, RY - 2.2]) {
    for (const [a, b] of [[CX0, CX0 + 2.4], [CX1 - 2.4, CX1]]) {
      prism({ wall: brick, win: null, roof, coping: stone, ring: rectRing(a, y, b, y + 2.4), z0: 0, z1: TUR - 0.9, facade: null, bevel: 0.1 })
      block(stone, a - 0.15, y - 0.15, b + 0.15, y + 2.55, TUR - 1.9, TUR - 1.5)
      // crenellated crown: four corner merlons and the mid ones
      for (const [mx0, my0] of [[a, y], [b - 0.7, y], [a, y + 1.7], [b - 0.7, y + 1.7]]) block(brick, mx0, my0, mx0 + 0.7, my0 + 0.7, TUR - 0.9, TUR)
      block(stone, a, y, b, y + 0.12, TUR - 1.0, TUR - 0.9)
    }
  }
  // turret windows (front faces)
  for (const x of [CX0 + 1.2, CX1 - 1.2]) for (const [z0, z1] of [[4.5, 6.6], [9.3, 11.4], [13.7, 15.4], [18.0, 19.8]]) rect(win, 'front', FY - 0.5, x, 0.7, z0, z1, 0.06)
  // stone band and the stepped central parapet with its cross
  block(stone, CX0 + 2.4, FY - 0.25, CX1 - 2.4, FY + 0.3, CEN - 1.0, CEN - 0.6)
  for (const [x0, x1, z] of [[CX0 + 2.4, CX1 - 2.4, CEN + 0.7], [AX - 1.6, AX + 1.6, CEN + 1.8]] as [number, number, number][]) block(stone, x0, FY - 0.2, x1, FY + 0.6, CEN - 0.2, z)
  barCross(stone, AX, FY + 0.2, CEN + 1.8, 2.6, 1.5, 0.3)
  // the oriel stack: pale stone bay windows over the entrance, projecting 0.9 m
  const OX0 = CX0 + 2.6, OX1 = CX1 - 2.6
  prism({ wall: stone, win: null, roof: stone, ring: rectRing(OX0, FY - 0.9, OX1, FY), z0: 7.3, z1: 19.6, facade: null, bevel: 0.08 })
  block(stone, OX0 - 0.3, FY - 1.3, OX1 + 0.3, FY, 6.7, 7.4)
  for (const [z0, z1] of [[8.0, 11.6], [12.6, 15.6], [16.6, 18.9]] as [number, number][]) {
    for (let k = 0; k < 4; k++) rect(win, 'front', FY - 0.9, OX0 + 0.55 + k * ((OX1 - OX0 - 1.1) / 3), 0.85, z0, z1, 0.05)
  }
  // the entrance porch: stone, pointed-arch door at terrace level
  prism({ wall: stone, win: null, roof: stone, ring: rectRing(CX0 + 1.8, FY - 1.6, CX1 - 1.8, FY), z0: TER, z1: 7.0, facade: null, bevel: 0.08 })
  pointed(door, 'front', FY - 1.6, AX, 2.0, TER + 0.1, 6.3, 0.06)

  // ---------------- Terrace, arcade, stairs ----------------
  prism({ wall: brick, win: null, roof: stone, ring: rectRing(X0, -11.7, X1, FY + 0.2), z0: 0, z1: TER, facade: null, bevel: 0.1 })
  block(stone, X0, -11.8, X1, -11.4, TER, TER + 0.9)
  for (let x = X0 + 2; x < X1 - 1; x += 3.3) {
    if (Math.abs(x - AX) < 4.5) continue
    arch(door, 'front', -11.7, x, 1.9, 0, 2.5, 0.05)
  }
  // the double stair: two flights rising toward the axis, a landing between
  for (const s of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const z = (TER * (i + 1)) / 5, xi = AX + s * (4.6 - i * 0.55)
      block(stone, Math.min(xi, AX + s * 4.8), -13.5, Math.max(xi, AX + s * 4.8), -11.7, 0, z)
    }
  }
  block(stone, AX - 2.0, -13.5, AX + 2.0, -11.7, 0, TER)

  // ---------------- Finish ----------------
  // Built about an earlier anchor; shift to the true area centroid of relation/4577139.
  const SH: XY = [-10.76, -1.02]
  for (const p of [brick, stone, roof, win, door]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += SH[0]; p.pos[i + 2] -= SH[1] }
  const lit = (p: V3, n: V3): number => (n[1] < -0.5 && p[1] - SH[1] < FY + 0.5 ? 0.5 : 0)
  finishModel('Marquette Hall', 'nola-marquette-hall', [
    { part: brick, material: { ...LOYOLA_BRICK, floodlight: lit } },
    { part: stone, material: { ...LOYOLA_STONE, floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('marquette-door', 0x4f4440) },
  ], { bearing: 26.3, osm: 'relation/4577139', height: TUR }, 6500)
}

if (import.meta.main) build()
