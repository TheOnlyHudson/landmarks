/**
 * St. Hedwig's Cathedral (St.-Hedwigs-Kathedrale), Bebelplatz, Berlin (Georg
 * Wenzeslaus von Knobelsdorff and Jean Laurent Legeay, 1747-1773; rebuilt
 * 1952-1963; interior renewed 2018-2024) — procedural, CC0-1.0, no textures.
 * bun generators/berlin-st-hedwigs.ts
 *
 * Writes models/berlin-st-hedwigs.glb (low) and
 * models/berlin-st-hedwigs.detail.glb (detail). Imports the Berlin kit from
 * berlin-altes-museum.ts (merge that one first).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 146.8: model
 * +y is compass 146.8, so the portico faces model south (compass 326.8,
 * across the Bebelplatz). Anchor: the area centroid of the OSM outline
 * way/58608090, lng 13.394855, lat 52.515753. The axis is x = CX = -0.5; the
 * rotunda is centred on (CX, 0). z = 0 is the Bebelplatz pavement (flat).
 *
 * What makes it St. Hedwig's, and how each is drawn
 * - The Pantheon-like rotunda: a tall drum of pale sandstone ashlar with its
 *   round-headed windows, the cornice, and the broad green copper dome (r
 *   19.4 m, rising 17 m) with its flat ring at the top.
 * - The temple front: six engaged Ionic columns (real round shafts, three
 *   quarters free of the wall) on their bases, the five arched doorways
 *   under the relief panels, the entablature with the dedication frieze
 *   and the pediment with its relief (figures in the detail); the steps up
 *   from the square; the gilt cross on the dome above the pediment.
 * - The smaller domed rotunda (the sacristy chapel) behind.
 *
 * Evidence
 * - OSM (ODbL): way/58608090 (building=cathedral, wikidata Q170123,
 *   building:colour #d9c5a4, roof copper #b7f0e4) with parts way/207890916
 *   (rotunda, height 36, roof:height 17, dome), way/207890917 (the ring at
 *   the top, 36-36.5 m), way/207890918 (portico, height 22, roof:height 6,
 *   gabled) and way/207890915 (the back rotunda, height 25, roof:height 7,
 *   dome).
 * - Published (de.wikipedia "St.-Hedwigs-Kathedrale"): Knobelsdorff's design
 *   after the Pantheon; the six-column portico with the pediment relief and
 *   the five relief panels; the copper dome; the 2018-2024 renovation.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "St. Hedwig's Cathedral (Berlin), 2024 (01).jpg", Bahnfrend, CC BY-SA 4.0
 *   (front after the renovation, colours in sun);
 *   "Berlin-Mitte Bebelplatz St.-Hedwigs-Kathedrale 182.jpg" and "183.jpg",
 *   GFreihalter, CC BY-SA 4.0 (square-on front: heights; pediment and
 *   panels);
 *   "St. Hedwig's Cathedral (Berlin) - Exterior.jpg", Yair Haklai,
 *   CC BY-SA 4.0 (the drum, windows and the back rotunda from the east);
 *   "Hedwig Cathedral Berlin 2015.jpg", Perituss, CC0;
 *   "At Berlin 2024 425.jpg", Mike Peel, CC BY-SA 4.0;
 *   "St. Hedwigs-Kathedrale Berlin in 2022.png", Tanapatjms, CC BY-SA 4.0.
 * - Measured from GFreihalter 182 (the 24.5 m OSM front, 11.8 px/m): steps
 *   1.5 m, columns 10.8 m, entablature top 14.8 m, pediment apex 22 m (OSM
 *   22); drum wall to 20.5 m and the dome, a shallow spherical cap rising 7 m, to
 *   27.5 m, with the closed lantern ring to 30 m (flattened after review to
 *   match the photos, where the dome rises only a little above the
 *   pediment; OSM's 36 m is not used. Earlier: OSM 36; its 17 m roof height gave too squat a drum against the
 *   Haklai photo, where the dome rises about 0.7 of the drum).
 * - Estimated: window sizes on the drum, the back rotunda's details.
 * - Invented/simplified: the reliefs as figure groups; no inscription.
 * - Look-only references: none.
 *
 * Night: the front and drum are floodlit; the windows glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf } from './dc-white-house'
import { lathe, TAU } from './nyc-columbus-monument'
import { place, figure, LOW, HIGH, type Q } from './london-albert-memorial'
import { ionic, lodKit } from './london-british-museum'
import { put, smoothAll } from './berlin-altes-museum'

export const ID = 'berlin-st-hedwigs'
export const BEARING = 146.8

const CX = -0.5
const RR = 19.4 // rotunda radius
const ZW = 20.5 // drum cornice
const ZD = 27.5 // dome top: a shallow cap, as the photos show it (review)
const YF = -27.8 // portico front (outline)
const HWP = 12.6 // half width of the temple front
const ZS = 1.5 // steps
const ZC = ZS + 10.8 // capital tops
const ZE = 14.8 // entablature top
const ZP = 22.0 // pediment apex
const BR: [number, number, number] = [CX, 24.7, 8.6] // back rotunda

function build(hi: boolean) {
  const L = lodKit(hi)
  const Qs: Q = hi ? HIGH : LOW
  const sculpt = (g: Part, make: (q: Part) => void) => (hi ? place(g, [0, 0, 0], 0, 1, make, 70) : smoothAll(g, make))
  const stone = new Part(), trim = new Part(), dome = new Part(), win = new Part(), gold = new Part(), door = new Part()
  const n = hi ? 40 : 20

  // ===== Rotunda ============================================================
  lathe(stone, [[RR, 0], [RR, ZW - 1.4]], n, CX, 0, false)
  lathe(trim, [[RR + 0.25, 0], [RR + 0.25, 1.8], [RR, 1.8]], n, CX, 0, false)
  lathe(trim, [[RR, ZW - 1.4], [RR + 0.3, ZW - 1.4], [RR + 0.3, ZW - 0.6], [RR + 0.8, ZW - 0.6], [RR + 0.8, ZW], [RR - 0.2, ZW]], n, CX, 0, false)
  // The dome: a shallow spherical cap with a ring at its crown.
  const prof: [number, number][] = []
  const nP = hi ? 12 : 6, rTop = 3.4
  const Rs = ((RR + 0.2) ** 2 + (ZD + 0.3 - ZW) ** 2) / (2 * (ZD + 0.3 - ZW)) // sphere radius
  const capZ = (r: number) => ZD + 0.3 - Rs + Math.sqrt(Rs * Rs - r * r)
  for (let k = 0; k <= nP; k++) {
    // A spherical cap through the drum rim and the crown ring.
    const r = RR + 0.2 - ((RR + 0.2 - rTop) * k) / nP
    prof.push([r, capZ(r)])
  }
  lathe(dome, prof, n, CX, 0, false)
  // The small closed lantern ring at the crown.
  lathe(trim, [[rTop, ZD], [rTop, ZD + 0.5], [rTop - 0.9, ZD + 0.5], [rTop - 0.9, ZD + 1.4], [rTop - 0.6, ZD + 1.4], [rTop - 0.6, ZD + 1.7]], hi ? 20 : 10, CX, 0, false)
  lathe(dome, [[rTop - 0.6, ZD + 1.7], [1.2, ZD + 2.3], [0.01, ZD + 2.5]], hi ? 20 : 10, CX, 0, true)
  // Ribs (detail): the copper's standing seams as low bands.
  for (let r = 0; r < (hi ? 24 : 12); r++) {
    const a = (TAU * r) / (hi ? 24 : 12)
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const P = (rr: number, z: number, da: number): V3 => [CX + (rr + 0.06) * Math.cos(a + da / rr), (rr + 0.06) * Math.sin(a + da / rr), z]
      qf(dome, P(r0, z0, -0.12), P(r0, z0, 0.12), P(r1, z1, 0.12), P(r1, z1, -0.12), [Math.cos(a), Math.sin(a), 0.6])
    }
  }
  // Drum windows: round-headed, two rows round the sides and back.
  const nWin = 10
  for (let k = 0; k < nWin; k++) {
    const a = -Math.PI / 2 + ((k + 0.5) / nWin) * TAU
    if (Math.abs(Math.sin(a) + 1) < 0.35) continue // behind the portico
    if (Math.abs(Math.sin(a) - 1) < 0.15) continue // where the back rotunda joins
    const c: V3 = [CX + (RR + 0.05) * Math.cos(a), (RR + 0.05) * Math.sin(a), 0]
    const tg: V3 = [-Math.sin(a), Math.cos(a), 0], nn: V3 = [Math.cos(a), Math.sin(a), 0]
    const P = (u: number, z: number): V3 => [c[0] + tg[0] * u, c[1] + tg[1] * u, z]
    for (const [z0, zs, w] of [[3.0, 7.4, 1.2], [11.0, 16.0, 1.4]] as const) {
      qf(win, P(-w, z0), P(w, z0), P(w, zs), P(-w, zs), nn)
      const seg = hi ? 8 : 4
      for (let j = 0; j < seg; j++) {
        const a0 = (Math.PI * j) / seg, a1 = (Math.PI * (j + 1)) / seg
        tf(win, P(0, zs), P(w * Math.cos(a0), zs + w * Math.sin(a0)), P(w * Math.cos(a1), zs + w * Math.sin(a1)), nn)
      }
    }
  }

  // ===== Back rotunda (sacristy chapel) ======================================
  const [bx, by, br] = BR
  lathe(stone, [[br, 0], [br, 16.5]], hi ? 24 : 12, bx, by, false)
  lathe(trim, [[br, 16.5], [br + 0.5, 16.5], [br + 0.5, 18.0], [br - 0.2, 18.0]], hi ? 24 : 12, bx, by, false)
  const bp: [number, number][] = []
  for (let k = 0; k <= (hi ? 8 : 4); k++) { const t = (k / (hi ? 8 : 4)) * (Math.PI / 2); bp.push([0.01 + (br + 0.3) * Math.cos(t), 18.0 + 7.0 * Math.sin(t)]) }
  lathe(dome, bp, hi ? 24 : 12, bx, by, true)
  for (const a of [0.35, 0.65, 0.5].map((t) => t * Math.PI)) {
    const c: V3 = [bx + (br + 0.05) * Math.cos(a), by + (br + 0.05) * Math.sin(a), 0], nn: V3 = [Math.cos(a), Math.sin(a), 0], tg: V3 = [-Math.sin(a), Math.cos(a), 0]
    const P = (u: number, z: number): V3 => [c[0] + tg[0] * u, c[1] + tg[1] * u, z]
    qf(win, P(-1, 6), P(1, 6), P(1, 11), P(-1, 11), nn)
  }

  // ===== The temple front ====================================================
  const yw = YF + 1.2 // the front wall behind the columns
  const x0 = CX - HWP, x1 = CX + HWP
  // Body of the front, from the wall back into the drum.
  cbox(stone, rect(x0, x1, yw, -14), 0, ZE, { top: false })
  // Steps across the front.
  const st = hi ? 6 : 3
  // The square sits about 0.5 m above the lowest ground under the footprint
  // (Mapterhorn), so the flight starts from a 0.8 m landing block.
  for (let k = 0; k < st; k++) cbox(stone, rect(x0 - 1.5, x1 + 1.5, YF - 3.2 + (3.2 * k) / st, yw), k === 0 ? 0 : 0.8 + ((ZS - 0.8) * k) / st, 0.8 + ((ZS - 0.8) * (k + 1)) / st, { top: true })
  // Six engaged Ionic columns.
  const cols = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((u) => CX + u * 4.5)
  for (const x of cols) ionic(L, trim, trim, x, yw - 0.45, ZS, ZC, 0.62, [1, 0])
  // Five arched doorways and the relief panels over them.
  for (let k = 0; k < 5; k++) {
    const xm = (cols[k] + cols[k + 1]) / 2
    const yy = yw - 0.05
    qf(door, [xm - 1.3, yy, ZS], [xm + 1.3, yy, ZS], [xm + 1.3, yy, ZS + 4.2], [xm - 1.3, yy, ZS + 4.2], [0, -1, 0])
    const seg = hi ? 8 : 4
    for (let j = 0; j < seg; j++) {
      const a0 = (Math.PI * j) / seg, a1 = (Math.PI * (j + 1)) / seg
      tf(win, [xm, yy, ZS + 4.2], [xm + 1.3 * Math.cos(a0), yy, ZS + 4.2 + 1.3 * Math.sin(a0)], [xm + 1.3 * Math.cos(a1), yy, ZS + 4.2 + 1.3 * Math.sin(a1)], [0, -1, 0])
    }
    // Arch surround and the relief panel frame.
    cbox(trim, rect(xm - 1.6, xm + 1.6, yy - 0.2, yy), ZS + 5.6, ZS + 5.9, { bottom: true })
    cbox(trim, rect(xm - 1.5, xm + 1.5, yy - 0.15, yy), ZS + 6.2, ZS + 9.6, { top: true, bottom: true })
    if (hi) put(stone, xm, yy - 0.2, ZS + 6.5, Math.PI, (g) => sculpt(g, (q) => figure(q, Qs, 2.6, { arms: [[[0.13, 0, 0.78], [0.22, 0.1, 0.9], [0.2, 0.12, 1.05]], [[-0.13, 0, 0.78], [-0.2, 0.08, 0.6], [-0.15, 0.15, 0.5]]] })))
  }
  // Entablature with its frieze, the cornice, the pediment.
  cbox(trim, rect(x0 - 0.3, x1 + 0.3, yw - 1.3, yw), ZC, ZE - 0.8, { bottom: true, top: false })
  cbox(trim, rect(x0 - 0.8, x1 + 0.8, yw - 1.9, yw + 0.5), ZE - 0.8, ZE, { b: 0.2, bottom: true, top: false })
  const yp = yw - 1.3
  tf(stone, [x0 + 0.4, yp, ZE], [x1 - 0.4, yp, ZE], [CX, yp, ZP - 0.8], [0, -1, 0])
  for (const s of [-1, 1]) {
    const xe = s < 0 ? x0 - 0.8 : x1 + 0.8
    qf(trim, [xe, yw - 1.9, ZE], [CX, yw - 1.9, ZP], [CX, yw - 1.9, ZP - 0.8], [xe + s * -1.2, yw - 1.9, ZE], [0, -1, 0])
    qf(trim, [xe + s * -1.2, yw - 1.9, ZE], [CX, yw - 1.9, ZP - 0.8], [CX, yp, ZP - 0.8], [xe + s * -1.2, yp, ZE], [0, 0, -1])
    // Pediment roof back to the drum (copper).
    qf(dome, [xe, yw - 1.9, ZE], [CX, yw - 1.9, ZP], [CX, -14, ZP], [xe, -14, ZE], [s * (ZP - ZE), 0, Math.abs(CX - xe)])
  }
  if (hi) for (let k = 0; k < 9; k++) {
    const t = (k - 4) / 4
    const h = Math.max(1.0, 3.6 * (1 - Math.abs(t)) + 0.3)
    put(stone, CX + t * 9.5, yp - 0.25, ZE + 0.05, Math.PI, (g) => sculpt(g, (q) => figure(q, Qs, h, { seated: Math.abs(t) > 0.6, arms: [[[0.13, 0, 0.78], [0.2, 0.12, 0.6], [0.16, 0.22, 0.5]]] })))
  }
  // The gilt cross on the dome above the pediment.
  {
    const a = -Math.PI / 2, rr = 13.6
    const zc = capZ(rr)
    const x = CX + rr * Math.cos(a), y = rr * Math.sin(a)
    cbox(gold, rect(x - 0.18, x + 0.18, y - 0.18, y + 0.18), zc - 0.3, zc + 3.4)
    cbox(gold, rect(x - 1.1, x + 1.1, y - 0.18, y + 0.18), zc + 2.0, zc + 2.4)
  }

  // ===== Materials and night ==================================================
  const lit = (p: V3, n: V3) => (n[2] < 0.6 && p[2] < ZP + 1 ? 0.85 : 0.15)
  return [
    { part: stone, material: { ...finish('hedwig-sandstone', 0xe2d2b4), floodlight: lit } },
    { part: trim, material: { ...finish('hedwig-sandstone-light', 0xebe0c9), floodlight: lit } },
    { part: dome, material: finish('hedwig-copper', 0x8fa57a) },
    { part: win, material: PALETTE.window },
    { part: gold, material: finish('gilt', 0xd8b65a, 0.5) },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a7258 } },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: "St. Hedwig's Cathedral", wikidata: 'Q170123' }
  writeModel("St. Hedwig's Cathedral", ID, build(false), extras, 6500)
  writeModel("St. Hedwig's Cathedral", ID, build(true), extras, 40000, `${ID}.detail`)
}
