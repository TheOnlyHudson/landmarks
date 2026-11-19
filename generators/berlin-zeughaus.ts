/**
 * Zeughaus (Arsenal; German Historical Museum), Unter den Linden, Berlin
 * (Johann Arnold Nering, Martin Grünberg, Andreas Schlüter, Jean de Bodt,
 * 1695-1730) — procedural, CC0-1.0, no textures.
 * bun generators/berlin-zeughaus.ts
 *
 * Writes models/berlin-zeughaus.glb (low) and
 * models/berlin-zeughaus.detail.glb (detail). Imports the Berlin kit from
 * berlin-altes-museum.ts (merge that one first).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 353.8: model
 * +y is compass 353.8, so the main front on Unter den Linden faces model
 * south. Anchor: the area centroid of the OSM outline way/15971186, lng
 * 13.396963, lat 52.518102. The block is centred at (CX, CY) = (-0.1,
 * -0.75), 94.6 x 91.7 m. z = 0 is the Unter den Linden pavement (the site
 * is flat). I. M. Pei's exhibition hall behind it is a separate building and
 * is not part of this model.
 *
 * What makes it the Zeughaus, and how each is drawn
 * - The square two-storey Baroque block in pink render with pale sandstone
 *   dressings: round-headed ground-floor windows, tall upper windows with
 *   alternating pediments and hoods, the string course, the triglyph frieze
 *   and cornice, the corner quoins.
 * - The centre risalits on the south, east and west fronts: four columns
 *   (pilasters behind), the pediment with its relief, the arched main door.
 *   The two side portals on each of those fronts, each under a pediment
 *   window.
 * - The roof balustrade lined with trophies: 44 single trophies (a cuirassed
 *   torso under a plumed helmet) on the balustrade piers and 12 big
 *   pyramidal trophy groups (two behind each pediment, one over each side
 *   portal), drawn as bold stacked forms: a drum, banners, a helmet and the
 *   figures of the captives.
 * - The grey roof round the courtyard and Pei's glass roof over the
 *   Schlüterhof.
 *
 * Evidence
 * - OSM (ODbL): way/15971186 (building=civic, "Zeughaus", height 17, levels
 *   2, building:colour #f1dcd0, roof:colour #7a8682, wikidata Q196970) with
 *   way/330840120 (the courtyard, building:part, height 10) and way/330840121
 *   (its glass dome roof, height 17, roof:height 4).
 * - Published (de.wikipedia "Zeughaus Berlin"): centre risalits with
 *   pediments on the east, south and west fronts; 44 single trophies
 *   (torso and helmet) and 12 pyramidal trophy groups on the balustrades,
 *   two behind each pediment and one each over the side portals; the
 *   triglyph frieze with weapons in its metopes; pediment reliefs (south:
 *   Athena with Hephaistos).
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Deutsches Historisches Museum Berlin.jpg", Jensens, public domain (the
 *   whole south front: bays, storeys, risalits, trophies);
 *   "Berlin-Zeughaus-02-2017-gje.jpg", Gerd Eichmann, CC BY-SA 4.0 (south-east
 *   corner, colours in sun);
 *   "Zeughaus (Berlin-Mitte).09095948.ajb.jpg", Ajepbah, CC BY-SA 3.0 de (the
 *   east front from across the Spree canal);
 *   "Zeughaus (Berlin). Deutsches Historisches Museum 2H1A0062WI.jpg", Kora27,
 *   CC BY-SA 4.0 (the south-west corner, trophies in silhouette);
 *   "Deutsches Historisches Museum vom Dom 04.04.JPG", Aazarus, CC BY-SA 2.0
 *   de (from above: the roof and the glass court roof);
 *   "Zeughaus Berlin Dach Skulptur 1.jpg", Manfred Brückels, CC BY-SA 3.0 (a
 *   trophy group close up);
 *   "Berlin - Zeughaus (1).jpg", Fred Romero, CC BY 2.0 (the centre risalit);
 *   "Berlin Zeughaus bei Nacht.jpg", Ansgar Koreng, CC BY 3.0 de (night).
 * - Measured from the Jensens photo (19 window axes along the 94.6 m OSM
 *   front, 13.8 px/m at the centre): string course 7 m, upper windows
 *   8-12.6 m, frieze 13.6-15.6 m, cornice 16.4 m, balustrade 17.8 m (OSM 17),
 *   pediment apex 20 m, trophy groups about 3.5 m, single trophies 1.8 m;
 *   the centre risalit 16.5 m wide.
 * - Estimated: the roof ridge (18.6 m: the aerial shows low roofs, no street photo shows them over the balustrade), the courtyard's glass
 *   roof (10.5 m at its edge, 17 m at the top, OSM), the north front (drawn
 *   without a pediment, as no photo used shows it).
 * - Invented/simplified: the trophies and reliefs as bold generic forms; no
 *   Schlüter masks.
 * - Look-only references: none.
 *
 * Colour (review): Pei's court roof is dark glass close to the roof grey.
 *
 * Night: the fronts are floodlit; the windows glow; the glass roof stays dark.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf } from './dc-white-house'
import { lathe, ellipsoid, tube, slab, TAU } from './nyc-columbus-monument'
import { place, figure, LOW, HIGH, type Q } from './london-albert-memorial'
import { lodKit, faceOf, fpanel, fblock, type Face } from './london-british-museum'
import { put, smoothAll, shaftWithBase } from './berlin-altes-museum'

export const ID = 'berlin-zeughaus'
export const BEARING = 353.8

const CX = -0.1, CY = -0.75, HX = 47.3, HY = 45.85
const HC = 28.0 // half size of the courtyard
const Z1 = 7.0 // string course
const ZF = 13.6 // frieze bottom
const ZE = 16.4 // cornice top
const ZB = 17.8 // balustrade top
const ZT = 18.6 // roof ridge: low, hidden behind the balustrade from the street
const ZP = 20.0 // pediment apex
const NB = 19 // window axes on each front

/** A single trophy: cuirassed torso under a plumed helmet, on a small base; faces +y. */
export function trophy(q: Part, Q: Q, h: number) {
  const n = Q.detail ? 8 : 5
  if (Q.detail) lathe(q, [[0.22 * h, 0], [0.22 * h, 0.1 * h], [0.14 * h, 0.12 * h]], n, 0, 0, false)
  ellipsoid(q, [0, 0, 0.42 * h], [0.2 * h, 0.14 * h, 0.28 * h], n, Q.detail ? 4 : 2)
  ellipsoid(q, [0, 0, 0.78 * h], [0.13 * h, 0.14 * h, 0.12 * h], n, Q.detail ? 4 : 2)
  if (Q.detail) tube(q, [[0, -0.05 * h, 0.86 * h], [0, -0.1 * h, 0.98 * h], [0, -0.2 * h, 1.0 * h]], [0.05 * h, 0.06 * h, 0.03 * h], 4)
  if (Q.detail) for (const s of [-1, 1]) slab(q, [s * 0.18 * h, -0.02 * h, 0.25 * h], [s * 0.5, 0, 0.86], [0, 1, 0], [[0, -0.08 * h], [0.45 * h, -0.06 * h], [0.45 * h, 0.06 * h], [0, 0.08 * h]], 0.03 * h)
}

/** A big pyramidal trophy group: drums, banners and armour round a helmeted torso, two captives at its foot; faces +y. */
export function trophyGroup(q: Part, Q: Q, h: number) {
  const n = Q.detail ? 10 : 5
  lathe(q, [[0.5 * h, 0], [0.5 * h, 0.12 * h], [0.32 * h, 0.16 * h]], n, 0, 0, false)
  for (const s of [-1, 1]) {
    if (Q.detail) cylinder(q, s * 0.28 * h, 0.05 * h, 0.13 * h, 0.12 * h, 0.32 * h, n)
    slab(q, [s * 0.05 * h, -0.05 * h, 0.3 * h], [s * 0.55, 0, 0.83], [0, 1, 0], [[0, -0.12 * h], [0.5 * h, -0.2 * h], [0.55 * h, 0.05 * h], [0, 0.12 * h]], 0.04 * h)
    if (Q.detail) put(q, s * 0.38 * h, 0.15 * h, 0.12 * h, s * -0.5, (f) => figure(f, Q, 0.42 * h, { seated: true, lean: 0.2, arms: [[[0.13, 0, 0.7], [0.2, 0.1, 0.5], [0.1, 0.2, 0.42]]] }))
  }
  ellipsoid(q, [0, 0, 0.5 * h], [0.2 * h, 0.15 * h, 0.25 * h], n, Q.detail ? 4 : 2)
  ellipsoid(q, [0, 0, 0.8 * h], [0.14 * h, 0.15 * h, 0.13 * h], n, Q.detail ? 4 : 2)
  tube(q, [[0, -0.05 * h, 0.9 * h], [0, -0.05 * h, 1.0 * h], [0, -0.18 * h, 1.05 * h]], [0.07 * h, 0.07 * h, 0.03 * h], 4)
}

function build(hi: boolean) {
  const L = lodKit(hi)
  const Qs: Q = hi ? HIGH : LOW
  const sculpt = (g: Part, make: (q: Part) => void) => (hi ? place(g, [0, 0, 0], 0, 1, make, 70) : smoothAll(g, make))
  const pink = new Part(), stone = new Part(), roof = new Part(), win = new Part(), glass = new Part()

  const x0 = CX - HX, x1 = CX + HX, y0 = CY - HY, y1 = CY + HY
  // ===== The block ===========================================================
  cbox(pink, rect(x0, x1, y0, y1), 0, ZF, { top: false })
  cbox(stone, rect(x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15), 0, 0.9, { top: false })
  cbox(stone, rect(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2), Z1 - 0.5, Z1, { top: false, bottom: true })
  cbox(stone, rect(x0 - 0.1, x1 + 0.1, y0 - 0.1, y1 + 0.1), ZF, ZE - 0.8, { top: false, bottom: true })
  cbox(stone, rect(x0 - 0.8, x1 + 0.8, y0 - 0.8, y1 + 0.8), ZE - 0.8, ZE, { top: false, bottom: true, b: 0.25 })
  // Balustrade on the cornice: a pierced-looking band (pink panel between sandstone rails).
  cbox(stone, rect(x0 - 0.4, x1 + 0.4, y0 - 0.4, y1 + 0.4), ZE, ZE + 0.35, { top: false })
  cbox(stone, rect(x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3), ZE + 0.35, ZB - 0.3, { top: false })
  cbox(stone, rect(x0 - 0.45, x1 + 0.45, y0 - 0.45, y1 + 0.45), ZB - 0.3, ZB, { top: false })
  // Roof: a ring of hips from the balustrade to the ridge and down to the court.
  const ring = (h: number, z: number): V3[] => [[CX - h, CY - h * (HY / HX), z], [CX + h, CY - h * (HY / HX), z], [CX + h, CY + h * (HY / HX), z], [CX - h, CY + h * (HY / HX), z]]
  const sq = (hx: number, hy: number, z: number): V3[] => [[CX - hx, CY - hy, z], [CX + hx, CY - hy, z], [CX + hx, CY + hy, z], [CX - hx, CY + hy, z]]
  void ring
  roof.loft([sq(HX, HY, ZE), sq((HX + HC) / 2, (HY + HC) / 2, ZT)])
  roof.loft([sq((HX + HC) / 2, (HY + HC) / 2, ZT), sq(HC, HC, ZE)])
  // Courtyard: inner walls from the glass roof up to the eaves, the glass roof.
  const ZG = 10.5
  for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]] as Array<[[number, number], [number, number]]>) {
    const A: V3 = [CX + a[0] * HC, CY + a[1] * HC, ZG], B: V3 = [CX + b[0] * HC, CY + b[1] * HC, ZG]
    qf(pink, A, B, [B[0], B[1], ZE], [A[0], A[1], ZE], [-(a[0] + b[0]), -(a[1] + b[1]), 0])
  }
  // Pei's glass roof: flat round the edge, a low cushion dome in the middle (OSM ±21 m, to 17 m).
  const RG = 21.0
  const gl = (z: number, h: number) => sq(h, h, z)
  glass.cap(gl(ZG, HC), true)
  glass.loft([gl(ZG + 0.02, RG), gl(ZG + 3.2, RG * 0.8), gl(ZG + 5.4, RG * 0.5), gl(ZG + 6.5, RG * 0.12)])
  glass.cap(gl(ZG + 6.5, RG * 0.12), true)
  if (hi) for (let k = -3; k <= 3; k++) {
    const t = (k / 3.5) * RG * 0.95
    cbox(stone, rect(CX + t - 0.08, CX + t + 0.08, CY - RG * 0.9, CY + RG * 0.9), ZG + 0.02, ZG + 0.25 + 3.0 * (1 - Math.abs(k) / 3.5), { top: false })
  }

  // ===== The four fronts ======================================================
  // Faces run counter-clockwise; side 0 south, 1 east, 2 north, 3 west.
  const fronts: Array<{ f: Face; pediment: boolean }> = [
    { f: faceOf([x0, y0], [x1, y0]), pediment: true },
    { f: faceOf([x1, y0], [x1, y1]), pediment: true },
    { f: faceOf([x1, y1], [x0, y1]), pediment: false },
    { f: faceOf([x0, y1], [x0, y0]), pediment: true },
  ]
  for (const { f, pediment } of fronts) {
    const step = (f.len - 2.6) / NB
    const at = (k: number) => 1.3 + step * (k + 0.5)
    const P = (u: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * d, f.o[1] + f.u[1] * u + f.n[1] * d, z]
    const nn: V3 = [f.n[0], f.n[1], 0]
    const mid = (NB - 1) / 2
    const portals = [2, NB - 3]
    // Corner quoins.
    for (const s of [0, f.len - 1.3]) fblock(stone, f, s, s + 1.3, 0.9, ZF, 0, 0.2)
    for (let k = 0; k < NB; k++) {
      const s = at(k)
      const inRisalit = pediment && Math.abs(k - mid) <= 1
      const d = inRisalit ? 0.9 : 0
      // Ground floor: round-headed window (or a door at the portals and the centre).
      const door = (pediment && k === mid) || portals.includes(k)
      const w = door ? 2.4 : 1.7, zs = door ? 4.6 : 4.4, z0 = door ? 0 : 1.6
      fpanel(win, f, s - w / 2, s + w / 2, z0, zs, d + 0.06)
      const seg = hi ? 8 : 4
      for (let j = 0; j < seg; j++) {
        const a0 = (Math.PI * j) / seg, a1 = (Math.PI * (j + 1)) / seg
        tf(win, P(s, zs, d + 0.06), P(s + (w / 2) * Math.cos(a0), zs + (w / 2) * Math.sin(a0), d + 0.06), P(s + (w / 2) * Math.cos(a1), zs + (w / 2) * Math.sin(a1), d + 0.06), nn)
      }
      if (hi) fblock(stone, f, s - 0.35, s + 0.35, zs + w / 2 - 0.2, zs + w / 2 + 0.5, d, d + 0.25, true) // keystone
      // Upper floor: tall window, pediment or hood.
      fpanel(win, f, s - 0.95, s + 0.95, 8.0, 12.6, d + 0.06)
      if (hi) fblock(stone, f, s - 1.25, s + 1.25, 7.6, 8.0, d, d + 0.3, true)
      const ped = portals.includes(k) || (inRisalit && k !== mid) || k % 2 === 0
      if (ped) {
        tf(stone, P(s - 1.3, 12.8, d + 0.3), P(s + 1.3, 12.8, d + 0.3), P(s, 13.5, d + 0.3), nn)
        fblock(stone, f, s - 1.3, s + 1.3, 12.6, 12.8, d, d + 0.3, true)
      } else fblock(stone, f, s - 1.2, s + 1.2, 12.6, 13.0, d, d + 0.3, true)
      // Pilaster strips between the axes (detail).
      if (hi && k > 0) fblock(stone, f, s - step / 2 - 0.3, s - step / 2 + 0.3, Z1, ZF, d, d + 0.15)
      // Triglyphs in the frieze (detail).
      if (hi) fblock(stone, f, s - 0.3, s + 0.3, ZF + 0.3, ZE - 0.9, 0.1, 0.25)
    }
    // Centre risalit: proud block, columns, entablature, pediment.
    if (pediment) {
      const sc = at(mid), hw = 1.5 * step + 1.3
      fblock(pink, f, sc - hw, sc + hw, 0.9, ZF, 0, 0.9)
      fblock(stone, f, sc - hw - 0.2, sc + hw + 0.2, ZF, ZE, 0.9, 1.6, true)
      for (const u of [-1.5, -0.5, 0.5, 1.5]) {
        const [cxp, cyp] = P(sc + u * step, 0, 1.6)
        shaftWithBase(L, stone, stone, cxp, cyp, Z1, ZF - 0.6, 0.48)
        cbox(stone, rect(cxp - 0.65, cxp + 0.65, cyp - 0.65, cyp + 0.65), ZF - 0.6, ZF, { bottom: true })
        cbox(stone, rect(cxp - 0.7, cxp + 0.7, cyp - 0.7, cyp + 0.7), 0.9, Z1, { c: 0.08 })
      }
      // Pediment with its relief (figures in the detail).
      tf(stone, P(sc - hw - 0.2, ZE, 1.6), P(sc + hw + 0.2, ZE, 1.6), P(sc, ZP, 1.6), nn)
      const A = P(sc - hw - 0.5, ZE, 1.7), B = P(sc, ZP + 0.3, 1.7), C = P(sc + hw + 0.5, ZE, 1.7)
      const Ab = P(sc - hw - 0.5, ZE, -4), Bb = P(sc, ZP + 0.3, -4), Cb = P(sc + hw + 0.5, ZE, -4)
      qf(roof, A, B, Bb, Ab, [0, 0, 1]); qf(roof, B, C, Cb, Bb, [0, 0, 1])
      if (hi) for (let j = -2; j <= 2; j++) put(stone, P(sc + j * 2.4, 0, 1.75)[0], P(sc + j * 2.4, 0, 1.75)[1], ZE + 0.05, Math.atan2(-f.n[0], f.n[1]), (g) => sculpt(g, (q) => figure(q, Qs, 2.6 - Math.abs(j) * 0.6, { seated: Math.abs(j) === 2, arms: [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.16, 0.2, 0.5]]] })))
      // Two trophy groups behind the pediment.
      for (const u of [-1.0, 1.0]) {
        const [tx, ty] = P(sc + u * step, 0, -1.0)
        put(stone, tx, ty, ZB, Math.atan2(-f.n[0], f.n[1]), (g) => sculpt(g, (q) => trophyGroup(q, Qs, 4.4)))
      }
    }
    // Trophy groups over the side portals.
    if (pediment) for (const k of portals) {
      const [tx, ty] = P(at(k), 0, -0.2)
      put(stone, tx, ty, ZB, Math.atan2(-f.n[0], f.n[1]), (g) => sculpt(g, (q) => trophyGroup(q, Qs, 4.0)))
    }
    // Single trophies on the other balustrade piers (44 in all: 11 per front).
    const singles: number[] = []
    for (let k = 0; k < NB; k++) {
      if (pediment && (Math.abs(k - mid) <= 1.5 || portals.includes(k))) continue
      singles.push(k)
    }
    const pick = singles.filter((_, i) => i % Math.max(1, Math.round(singles.length / 11)) === 0).slice(0, 11)
    for (const k of pick) {
      const [tx, ty] = P(at(k) - step / 2, 0, -0.1)
      put(stone, tx, ty, ZB, Math.atan2(-f.n[0], f.n[1]), (g) => sculpt(g, (q) => trophy(q, Qs, 2.4)))
    }
  }

  // ===== Materials and night ==================================================
  const lit = (_p: V3, n: V3) => (n[2] < 0.6 ? 0.85 : 0.2)
  return [
    { part: pink, material: { ...finish('zeughaus-pink-render', 0xe8c3b6), floodlight: lit } },
    { part: stone, material: { ...finish('zeughaus-sandstone', 0xdcd3c3), floodlight: lit } },
    { part: roof, material: finish('zeughaus-roof', 0x8f9894) },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...PALETTE.glass, color: 0x7f8b8e } },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Zeughaus', wikidata: 'Q196970' }
  writeModel('Zeughaus', ID, build(false), extras, 6500)
  writeModel('Zeughaus', ID, build(true), extras, 40000, `${ID}.detail`)
}
