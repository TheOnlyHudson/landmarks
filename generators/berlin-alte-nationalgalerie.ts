/**
 * Alte Nationalgalerie, Museum Island, Berlin (Friedrich August Stüler,
 * built 1866-1876 by Johann Heinrich Strack) — procedural, CC0-1.0, no
 * textures. bun generators/berlin-alte-nationalgalerie.ts
 *
 * Writes models/berlin-alte-nationalgalerie.glb (low) and
 * models/berlin-alte-nationalgalerie.detail.glb (detail). Imports the Berlin
 * sculpture kit from berlin-altes-museum.ts (merge that one first).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 321.4: model
 * +y is compass 321.4, the temple's axis from the stair (model south,
 * compass 141.4, facing the Bodestraße garden) to the apse. Anchor: the area
 * centroid of the OSM outline way/313670733, lng 13.398250, lat 52.520865.
 * The temple's axis is x = CX = 0.7. z = 0 is the garden pavement at the
 * foot of the stair (the site is flat).
 *
 * What makes it the Alte Nationalgalerie, and how each is drawn
 * - A Corinthian temple on a high podium: the octastyle portico (8 front
 *   columns, a return column each side), real round shafts with flared
 *   acanthus capitals, the deep pronaos with its dark windows, the
 *   entablature with the inscription frieze, the pediment with its relief
 *   (figures in the detail), the Germania group on the apex and the griffin
 *   acroteria at the eaves.
 * - Engaged Corinthian half-columns all round the upper storey (sides and
 *   apse) with tall windows between, over the rusticated podium storey with
 *   its own row of windows.
 * - The apse at the back: a half-round with the same order and a half-cone
 *   roof.
 * - The double open stair: the central arched block rising to the landing
 *   in front of the portico, the two flights climbing to it sideways from
 *   the outer terraces with their sloping parapets and urns, and on the
 *   landing Calandrelli's equestrian statue of Friedrich Wilhelm IV on its
 *   pedestal with the four seated allegories; the two seated figures at the
 *   foot of the stair.
 * - Colour: the warm salmon Nebra sandstone, the roof's grey-green.
 *
 * Evidence
 * - OSM (ODbL): way/313670733 (building=civic, "Alte Nationalgalerie",
 *   building:colour #e2c6a9) with parts way/230015274 (temple body, height
 *   20, roof:height 5, gabled, roof:colour #b4c9b3), way/230015275 (apse,
 *   height 17), way/230015273 (central stair block, height 5) and the stair
 *   parts way/260815365, 260815366, 260815368, 260815370, 260815372,
 *   260815374 (heights 2.5-5). OSM's heights are too low for the photos and
 *   are not used.
 * - Published (de.wikipedia "Alte Nationalgalerie"): temple front, encircling
 *   half-columns, apse; rusticated socle storey; equestrian statue of
 *   Friedrich Wilhelm IV with the four socle figures Religion, Art, History,
 *   Philosophy (Calandrelli, 1875-1886) on the open stair; Nebra sandstone.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Alte Nationalgalerie facade.jpg", Beko, CC BY-SA 4.0 (square-on front:
 *   all heights, scaled by the 34.2 m OSM front);
 *   "Berlin-Alte Nationalgalerie-12-2016-gje.jpg", Gerd Eichmann,
 *   CC BY-SA 4.0 (stair, arch, flights, seated figures);
 *   "Berlin-Alte Nationalgalerie-10-2016-gje.jpg" (south-west side, podium
 *   and half-columns), "-04-2016-gje.jpg" and "-02-Berliner Dom-2016-gje.jpg"
 *   (apse and the Spree side), Gerd Eichmann, CC BY-SA 4.0;
 *   "Alte-National-Galerie-Berlin-2015.jpg", Tuxyso, CC BY-SA 3.0 (front);
 *   "Alte Nationalgalerie, 2024 (01).jpg", Bahnfrend, CC BY-SA 4.0 (front);
 *   "Alte Nationalgalerie at night (MK).jpg", Mathias Krumbholz, CC BY-SA 3.0
 *   (night: floodlit front, lit pronaos windows).
 * - Measured from the facade photo (20.5 px/m at the temple front): columns
 *   11.7 m, entablature 3.2 m, pediment 4.0 m, the landing (portico floor)
 *   10 m above the garden, so the cornice is at 24.9 m and the apex 28.9 m;
 *   column axis spacing 4.3 m, the apex group 3 m.
 * - Estimated: portico depth (two bays), window sizes, the flights' landing
 *   heights (2.5 m at the outer terraces, from OSM's lower parts), the
 *   statue sizes.
 * - Invented/simplified: sculpture as bold figure and horse forms; the
 *   pediment relief as a row of figures; the Spree side's colonnade (a
 *   separate structure) is not part of this model.
 * - Look-only references: none.
 * - Doubts: the north-east (Spree) side is seen only from across the river.
 *
 * Colour (review): a warmer brown-red Nebra sandstone and a muted dark
 * grey-green copper roof.
 *
 * Night: the front, stair and portico are floodlit; the pronaos and side
 * windows glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf } from './dc-white-house'
import { TAU, lathe, tube } from './nyc-columbus-monument'
import { place, figure, LOW, HIGH, type Q } from './london-albert-memorial'
import { lodKit } from './london-british-museum'
import { put, rider, eagle, corinthian, smoothAll } from './berlin-altes-museum'

export const ID = 'berlin-alte-nationalgalerie'
export const BEARING = 321.4

const CX = 0.7
const HW = 17.1 // half width of the temple
const YF = -28.3 // portico front (the outline's front)
const YP = -19.6 // pronaos back wall
const YA = 36.6 // apse chord
const RA = 13.3 // apse radius
const ZL = 10.0 // landing / portico floor / podium top
const ZC = ZL + 11.7 // capital tops
const ZE = ZC + 3.2 // cornice top
const ZT = ZE + 4.0 // ridge / pediment apex
const SP = 4.3 // column spacing

function build(hi: boolean) {
  const L = lodKit(hi)
  const Qs: Q = hi ? HIGH : LOW
  const sculpt = (g: Part, make: (q: Part) => void) => (hi ? place(g, [0, 0, 0], 0, 1, make, 70) : smoothAll(g, make))
  const stone = new Part(), light = new Part(), roof = new Part(), win = new Part(), bronze = new Part(), door = new Part()
  const seg = hi ? 16 : 10

  // ===== Podium storey (rusticated), body and apse walls ====================
  const x0 = CX - HW, x1 = CX + HW
  // Body walls from the ground to the cornice line, behind the portico.
  cbox(stone, rect(x0, x1, YP, YA), 0, ZC, { top: false })
  // Portico podium under the columns, to the landing.
  cbox(stone, rect(x0, x1, YF, YP), 0, ZL, { top: stone })
  // Apse: half drum.
  const apse = (r: number, z0: number, z1: number, p: Part) => {
    for (let k = 0; k < seg; k++) {
      const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
      const P = (a: number, z: number): V3 => [CX + r * Math.cos(a), YA + r * Math.sin(a), z]
      const n = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
      p.tri(P(a0, z0), P(a1, z0), P(a1, z1), undefined, undefined, undefined, [n(a0), n(a1), n(a1)])
      p.tri(P(a0, z0), P(a1, z1), P(a0, z1), undefined, undefined, undefined, [n(a0), n(a1), n(a0)])
    }
  }
  apse(RA, 0, ZC, stone)
  // Podium cornice band all round (sides, back and apse).
  cbox(light, rect(x0 - 0.35, x1 + 0.35, YP, YA), ZL - 0.7, ZL, { top: false, bottom: true })
  apse(RA + 0.35, ZL - 0.7, ZL, light)
  // Rusticated base course.
  cbox(light, rect(x0 - 0.2, x1 + 0.2, YF - 0.2, YA), 0, 1.2, { top: false })
  apse(RA + 0.2, 0, 1.2, light)

  // ===== Windows ===========================================================
  // Sides: a tall window per bay in the upper storey, one per bay below.
  const ys: number[] = []
  for (let y = YP + SP / 2; y < YA - 1; y += SP) ys.push(y)
  for (const s of [-1, 1]) {
    const x = CX + s * HW + s * 0.05
    for (const y of ys) {
      qf(win, [x, y - 1.0, ZL + 2.0], [x, y + 1.0, ZL + 2.0], [x, y + 1.0, ZL + 8.4], [x, y - 1.0, ZL + 8.4], [s, 0, 0])
      qf(win, [x, y - 0.9, 3.0], [x, y + 0.9, 3.0], [x, y + 0.9, 7.6], [x, y - 0.9, 7.6], [s, 0, 0])
      if (hi) cbox(light, rect(Math.min(x, x + s * 0.3), Math.max(x, x + s * 0.3), y - 1.3, y + 1.3), ZL + 8.4, ZL + 8.9, { bottom: true })
    }
  }
  // Apse windows between its half-columns.
  const nA = 6
  for (let k = 0; k < nA; k++) {
    const a = (Math.PI * (k + 0.5)) / nA, r = RA + 0.05
    const c: V3 = [CX + r * Math.cos(a), YA + r * Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
    const P = (u: number, z: number): V3 => [c[0] + t[0] * u, c[1] + t[1] * u, z]
    qf(win, P(-1, ZL + 2), P(1, ZL + 2), P(1, ZL + 8.4), P(-1, ZL + 8.4), [Math.cos(a), Math.sin(a), 0])
    qf(win, P(-0.9, 3), P(0.9, 3), P(0.9, 7.6), P(-0.9, 7.6), [Math.cos(a), Math.sin(a), 0])
  }
  // Pronaos back wall: seven tall dark windows (the lit galleries at night).
  for (let k = 0; k < 7; k++) {
    const x = CX + (k - 3) * SP
    qf(door, [x - 1.6, YP - 0.05, ZL + 2.6], [x + 1.6, YP - 0.05, ZL + 2.6], [x + 1.6, YP - 0.05, ZL + 7.6], [x - 1.6, YP - 0.05, ZL + 7.6], [0, -1, 0])
    if (hi) qf(light, [x - 1.8, YP - 0.04, ZL + 0.8], [x + 1.8, YP - 0.04, ZL + 0.8], [x + 1.8, YP - 0.04, ZL + 2.0], [x - 1.8, YP - 0.04, ZL + 2.0], [0, -1, 0])
  }
  // Portico ceiling.
  qf(light, [x0, YF + 0.8, ZC], [x1, YF + 0.8, ZC], [x1, YP, ZC], [x0, YP, ZC], [0, 0, -1])

  // ===== The order ==========================================================
  const R = 0.72
  for (let k = 0; k < 8; k++) corinthian(L, light, light, CX + (k - 3.5) * SP, YF + 1.0, ZL, ZC, R)
  for (const s of [-1, 1]) corinthian(L, light, light, CX + s * 3.5 * SP, YF + 1.0 + SP, ZL, ZC, R)
  // Engaged half-columns along the sides and round the apse.
  const RH = 0.62
  for (const s of [-1, 1]) {
    for (let y = YP; y <= YA + 0.01; y += SP) corinthian(L, light, light, CX + s * (HW + 0.15), y, ZL, ZC, RH, false)
  }
  for (let k = 1; k < nA; k++) {
    const a = (Math.PI * k) / nA, r = RA + 0.15
    corinthian(L, light, light, CX + r * Math.cos(a), YA + r * Math.sin(a), ZL, ZC, RH, false)
  }
  // Entablature all round: body and portico, then the apse ring.
  cbox(light, rect(x0 - 0.1, x1 + 0.1, YF, YA), ZC, ZE - 1.0, { top: false, bottom: true })
  cbox(light, rect(x0 - 0.8, x1 + 0.8, YF - 0.8, YA), ZE - 1.0, ZE, { b: 0.3, bottom: true, top: false })
  apse(RA + 0.25, ZC, ZE - 1.0, light)
  apse(RA + 0.8, ZE - 1.0, ZE, light)
  // Apse entablature soffit and top ring.
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    const P = (a: number, r: number, z: number): V3 => [CX + r * Math.cos(a), YA + r * Math.sin(a), z]
    qf(light, P(a0, RA, ZE - 1.0), P(a1, RA, ZE - 1.0), P(a1, RA + 0.8, ZE - 1.0), P(a0, RA + 0.8, ZE - 1.0), [0, 0, -1])
  }

  // ===== Roof and pediment ==================================================
  const xe0 = x0 - 0.8, xe1 = x1 + 0.8
  // Gable roof from the pediment to the apse chord.
  qf(roof, [xe0, YF - 0.6, ZE], [CX, YF - 0.6, ZT], [CX, YA, ZT], [xe0, YA, ZE], [-(ZT - ZE), 0, CX - xe0])
  qf(roof, [xe1, YF - 0.6, ZE], [CX, YF - 0.6, ZT], [CX, YA, ZT], [xe1, YA, ZE], [ZT - ZE, 0, xe1 - CX])
  // Half-cone over the apse.
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    const r = RA + 0.8
    tf(roof, [CX + r * Math.cos(a0), YA + r * Math.sin(a0), ZE], [CX + r * Math.cos(a1), YA + r * Math.sin(a1), ZE], [CX, YA, ZT], [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 1])
  }
  // Fill the triangle between the gable's back and the cone at the chord.
  tf(roof, [xe0, YA, ZE], [CX - RA - 0.8, YA, ZE], [CX, YA, ZT], [0, 1, 0])
  tf(roof, [xe1, YA, ZE], [CX + RA + 0.8, YA, ZE], [CX, YA, ZT], [0, 1, 0])
  // Tympanum, set back, and the raking cornices.
  const yt = YF - 0.1
  tf(stone, [xe0 + 1.2, yt, ZE], [xe1 - 1.2, yt, ZE], [CX, yt, ZT - 0.8], [0, -1, 0])
  for (const s of [-1, 1]) {
    const xe = s < 0 ? xe0 : xe1
    const A: V3 = [xe, YF - 0.7, ZE], B: V3 = [CX, YF - 0.7, ZT]
    qf(light, A, B, [CX, YF - 0.7, ZT - 0.8], [xe - s * 1.3, YF - 0.7, ZE], [0, -1, 0])
    qf(light, [xe - s * 1.3, YF - 0.7, ZE], [CX, YF - 0.7, ZT - 0.8], [CX, yt, ZT - 0.8], [xe - s * 1.3, yt, ZE], [0, 0, -1])
    qf(light, A, B, [CX, YF + 0.3, ZT + 0.05], [xe, YF + 0.3, ZE + 0.05], [s * (ZT - ZE), 0, Math.abs(CX - xe)])
  }
  // Relief figures in the tympanum (detail), the apex group and acroteria.
  if (hi) for (let k = 0; k < 11; k++) {
    const t = (k - 5) / 5
    const h = Math.max(1.0, 3.0 * (1 - Math.abs(t)) + 0.4)
    put(stone, CX + t * 13, yt - 0.25, ZE + 0.05, Math.PI, (g) => sculpt(g, (q) => figure(q, Qs, h, { seated: Math.abs(t) > 0.5, arms: [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.16, 0.2, 0.5]]] })), 1)
  }
  cbox(light, rect(CX - 1.4, CX + 1.4, YF - 0.6, YF + 1.2), ZT - 0.3, ZT + 0.6)
  put(bronze, CX, YF + 0.3, ZT + 0.6, Math.PI, (g) => sculpt(g, (q) => {
    figure(q, Qs, 2.9, { lean: 0.05, crown: true, arms: [[[0.13, 0, 0.78], [0.22, 0.05, 0.95], [0.2, 0.05, 1.12]], [[-0.13, 0, 0.78], [-0.2, 0.1, 0.6], [-0.15, 0.2, 0.5]]] })
    for (const sx of [-1, 1]) put(q, sx * 0.85, -0.1, 0, sx * -0.4, (f) => figure(f, Qs, 2.3, { seated: true, arms: [[[0.13, 0, 0.7], [0.2, 0.15, 0.55], [0.12, 0.3, 0.5]]] }))
  }))
  for (const s of [-1, 1]) {
    const xe = s < 0 ? xe0 + 0.9 : xe1 - 0.9
    cbox(light, rect(xe - 0.7, xe + 0.7, YF - 0.6, YF + 0.8), ZE, ZE + 0.5)
    put(bronze, xe, YF + 0.1, ZE + 0.5, Math.PI, (g) => sculpt(g, (q) => eagle(q, Qs, 1.6, 0.3)))
  }

  // ===== The stair ==========================================================
  const YS = -40.5 // front of the central block and the flights
  const HC = 6.0 // half width of the central block
  const HS = 16.0 // flights' outer end
  const HT = 20.4 // outer terraces
  const ZO = 2.5 // outer terrace height
  // Central arched block up to the landing.
  cbox(stone, rect(CX - HC, CX + HC, YS, YF), 0, ZL, { top: stone })
  // Arch: pale surround, dark doors, a fanlight.
  const ya = YS - 0.06
  qf(light, [CX - 3.0, ya, 0], [CX + 3.0, ya, 0], [CX + 3.0, ya, 5.8], [CX - 3.0, ya, 5.8], [0, -1, 0])
  const archN = hi ? 10 : 6
  for (let k = 0; k < archN; k++) {
    const a0 = (Math.PI * k) / archN, a1 = (Math.PI * (k + 1)) / archN
    tf(light, [CX, ya, 5.8], [CX + 3.0 * Math.cos(a0), ya, 5.8 + 3.0 * Math.sin(a0)], [CX + 3.0 * Math.cos(a1), ya, 5.8 + 3.0 * Math.sin(a1)], [0, -1, 0])
    tf(door, [CX, ya - 0.02, 5.8], [CX + 2.2 * Math.cos(a0), ya - 0.02, 5.8 + 2.2 * Math.sin(a0)], [CX + 2.2 * Math.cos(a1), ya - 0.02, 5.8 + 2.2 * Math.sin(a1)], [0, -1, 0])
  }
  qf(door, [CX - 2.2, ya - 0.02, 0], [CX + 2.2, ya - 0.02, 0], [CX + 2.2, ya - 0.02, 5.8], [CX - 2.2, ya - 0.02, 5.8], [0, -1, 0])
  // Landing cornice and parapet with urns.
  cbox(light, rect(CX - HC - 0.3, CX + HC + 0.3, YS - 0.3, YF), ZL - 0.6, ZL, { top: false, bottom: true })
  // The flights: solid ramps rising inward from the outer terraces to the landing.
  for (const s of [-1, 1]) {
    const xa = CX + s * HC, xb = CX + s * HS
    const n: V3 = [0, -1, 0]
    // Front cheek wall (a trapezoid) and the back.
    qf(stone, [xa, YS, 0], [xb, YS, 0], [xb, YS, ZO], [xa, YS, ZL], n)
    // Stepped top: the flight's steps as a sloping surface.
    const st = hi ? 12 : 4
    for (let k = 0; k < st; k++) {
      const t0 = k / st, t1 = (k + 1) / st
      const xs0 = xb + (xa - xb) * t0, xs1 = xb + (xa - xb) * t1, z = ZO + (ZL - ZO) * t1
      qf(stone, [xs0, YS + 0.5, z], [xs1, YS + 0.5, z], [xs1, YF, z], [xs0, YF, z], [0, 0, 1])
      qf(stone, [xs0, YS + 0.5, ZO + (ZL - ZO) * t0], [xs0, YF, ZO + (ZL - ZO) * t0], [xs0, YF, z], [xs0, YS + 0.5, z], [-s, 0, 0])
    }
    // Outer end wall.
    qf(stone, [xb, YS, 0], [xb, YF, 0], [xb, YF, ZO], [xb, YS, ZO], [s, 0, 0])
    // Sloping parapet along the front edge, with its carved band.
    const pz = 1.1
    const P = (x: number, z: number, y: number): V3 => [x, y, z]
    qf(light, P(xb, ZO, YS - 0.15), P(xa, ZL, YS - 0.15), P(xa, ZL + pz, YS - 0.15), P(xb, ZO + pz, YS - 0.15), n)
    qf(light, P(xb, ZO + pz, YS - 0.15), P(xa, ZL + pz, YS - 0.15), P(xa, ZL + pz, YS + 0.6), P(xb, ZO + pz, YS + 0.6), [0, -s * 0.3, 1])
    qf(light, P(xb, ZO, YS + 0.6), P(xa, ZL, YS + 0.6), P(xa, ZL + pz, YS + 0.6), P(xb, ZO + pz, YS + 0.6), [0, 1, 0])
    // Outer terrace (the flight starts here) with its parapet.
    cbox(stone, rect(Math.min(xb, CX + s * HT), Math.max(xb, CX + s * HT), YS - 6.2, YF), 0, ZO, { top: stone })
    cbox(light, rect(Math.min(xb, CX + s * HT), Math.max(xb, CX + s * HT), YS - 6.2, YS - 5.6), ZO, ZO + 1.0, { b: 0.1 })
    // Urns on posts at the landing and at the terraces.
    for (const [ux, uz, uy] of [[CX + s * (HC + 0.4), ZL + pz, YS + 0.2], [CX + s * (HT - 0.5), ZO + 1.0, YS - 5.9]] as const) {
      lathe(light, [[0.35, uz], [0.25, uz + 0.6], [0.45, uz + 0.9], [0.5, uz + 1.15], [0.3, uz + 1.25]], hi ? 10 : 5, ux, uy, true)
    }
    // Seated figure at the foot of the stair, on its pedestal.
    const px = CX + s * (HC + 1.8), py = YS - 1.8
    cbox(stone, rect(px - 1.1, px + 1.1, py - 1.1, py + 1.1), 0, 2.0, { c: 0.1 })
    cbox(light, rect(px - 1.25, px + 1.25, py - 1.25, py + 1.25), 2.0, 2.3, { b: 0.1 })
    put(bronze, px, py, 2.3, Math.PI, (g) => sculpt(g, (q) => figure(q, Qs, 2.0, { seated: true, girth: 1.3, arms: [[[0.13, 0, 0.7], [0.2, 0.15, 0.55], [0.12, 0.3, 0.5]], [[-0.13, 0, 0.7], [-0.2, 0.1, 0.5], [-0.1, 0.25, 0.45]]] })))
  }
  // Steps down in front of the flights to the garden.
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
    const a = CX + s * (HC + 3.2), b = CX + s * HS
    cbox(stone, rect(Math.min(a, b), Math.max(a, b), YS - 1.8 + k * 0.6, YS), 0, 0.5 + k * 0.5, { top: true })
  }

  // ===== Friedrich Wilhelm IV on the landing ===============================
  const ey = (YS + YF) / 2 - 1.0
  cbox(stone, rect(CX - 2.6, CX + 2.6, ey - 3.2, ey + 3.2), ZL, ZL + 1.6, { c: 0.15 })
  cbox(light, rect(CX - 2.8, CX + 2.8, ey - 3.4, ey + 3.4), ZL + 1.6, ZL + 1.9, { b: 0.12 })
  cbox(stone, rect(CX - 1.4, CX + 1.4, ey - 2.2, ey + 2.2), ZL + 1.9, ZL + 5.0, { c: 0.12 })
  cbox(light, rect(CX - 1.6, CX + 1.6, ey - 2.4, ey + 2.4), ZL + 5.0, ZL + 5.4, { b: 0.12 })
  put(bronze, CX, ey, ZL + 5.4, Math.PI, (g) => sculpt(g, (q) => rider(q, Qs, {
    s: 2.5, rear: 0.0, lift: 0.35, toss: 0.1, h: 3.0, robe: true,
    arms: [[[0.13, 0.02, 0.33], [0.2, 0.15, 0.25], [0.12, 0.3, 0.25]], [[-0.13, 0.02, 0.33], [-0.2, 0.12, 0.2], [-0.1, 0.25, 0.18]]],
  })))
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    put(bronze, CX + sx * 2.0, ey + sy * 2.6, ZL + 1.9, Math.atan2(-sx, sy) + Math.PI, (g) => sculpt(g, (q) => figure(q, Qs, 2.0, { seated: true, girth: 1.3, lean: 0.1, arms: [[[0.13, 0, 0.7], [0.2, 0.15, 0.55], [0.12, 0.3, 0.5]]] })))
  }

  // ===== Materials and night ================================================
  const lit = (p: V3, n: V3) => (p[1] < YP + 1 && n[1] < -0.3 ? 0.9 : p[1] < YP && n[2] < 0.5 ? 0.6 : 0)
  return [
    { part: stone, material: { ...finish('nebra-sandstone', 0xb9886d), floodlight: lit } },
    { part: light, material: { ...finish('nebra-sandstone-light', 0xc89c80), floodlight: lit } },
    { part: roof, material: finish('copper-roof', 0x77857c) },
    { part: win, material: PALETTE.window },
    { part: door, material: windowVariant(2, 0x7a6666) },
    { part: bronze, material: finish('bronze-patina', 0x5b6d65, 0.6) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Alte Nationalgalerie', wikidata: 'Q162111' }
  writeModel('Alte Nationalgalerie', ID, build(false), extras, 6500)
  writeModel('Alte Nationalgalerie', ID, build(true), extras, 40000, `${ID}.detail`)
}
