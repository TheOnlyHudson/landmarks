/**
 * Old U.S. Mint, 400 Esplanade Avenue, New Orleans (1835-38, William
 * Strickland) — procedural, CC0-1.0, no textures.
 * bun generators/nola-old-us-mint.ts
 *
 * Identity: the long three-storey Greek Revival block in red-painted
 * stucco scored as ashlar, with grey granite belt course, plinth and
 * pilaster strips; the central pavilion with its tetrastyle Ionic portico
 * between square antae (pale grey-white, on the raised ground storey with
 * a balcony) under a wide low pediment; the end wings whose pedimented
 * gables face the side streets, with cast-iron galleries; the rear central
 * wing with its own pediment; white-framed sash windows in even bays.
 *
 * Frame: bearing 38.7 (OSM's walls run 38.7 / 128.6); +y the Esplanade
 * front (compass 38.7), +x downriver toward N. Peters. Anchor: the area
 * centroid of OSM way/345253057.
 *
 * Evidence
 * - OSM way/345253057 (outline: the E-shaped plan, the 89 m front, the
 *   central projection and portico, three rear wings; building:levels 3).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (2021-22), 0.5 m grid in the model
 *   frame, heights above the street (2.2 abs): eaves 13.4-14.0, the front
 *   block's ridge 15.4 (pitch ~0.25), the end wings' ridges 17.3 running
 *   along the front (so their gables face the side streets), the central
 *   wing's ridge 17.7 running front to back to the pediment, the portico's
 *   flat top 13.2-13.7. Ground flat (±0.4).
 * - Photos (Wikimedia Commons):
 *   - "New Orleans Jazz Museum - Old Mint building from Esplanade Avenue,
 *     February 2026.jpg", ajay_suresh, CC BY 4.0: the front face on; the
 *     portico (4 columns, 2 antae, evenly spaced), the attic and low
 *     pediment over the central pavilion (pitch ~0.15), the colours
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Jazz_Museum_-_Old_Mint_building_from_Esplanade_Avenue,_February_2026.jpg
 *   - "EsplanadeNPetersOldMint.jpg", Infrogmation, CC BY 2.5: the
 *     N. Peters end, its pedimented gable and iron gallery
 *     https://commons.wikimedia.org/wiki/File:EsplanadeNPetersOldMint.jpg
 *   - "New Orleans 2007 - Old Mint on Esplanade.jpg", Infrogmation of New
 *     Orleans, CC BY-SA 4.0: the front at an angle, the granite strips
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_2007_-_Old_Mint_on_Esplanade.jpg
 *   - "New Orleans 2007 - Old Mint, Upriver side.jpg", Infrogmation of New
 *     Orleans, CC BY-SA 4.0: the upriver (Barracks / Decatur) side and the
 *     rear wings' gables
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_2007_-_Old_Mint,_Upriver_side.jpg
 *   - "New Orleans Jazz Museum at Old U.S. Mint.jpg", DNMaurer, CC BY-SA
 *     4.0: the portico from the side
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Jazz_Museum_at_Old_U.S._Mint.jpg
 * - Published: Wikipedia, "New Orleans Mint": built 1835, designed by
 *   William Strickland, minting 1838-61 and 1879-1909; now a museum
 *   (Louisiana State Museum, New Orleans Jazz Museum).
 *
 * Measured (lidar): the heights above, the plan. Estimated from the photos:
 * the belt course (4.3), the central pavilion's attic (to 15.3, so the
 * pediment's rake matches the photo and the lidar apex), the portico
 * columns (r 0.6, full height from 4.55 to 12.55, under a 1.2 m entablature) and antae, the window sizes and
 * bays (~3.4 m), the galleries (second storey, 2 m deep). Colours from the
 * daylight photos: walls red #b8705e, granite grey, slate roofs.
 * Roofs: the lidar ridges are real but low (pitch ~0.25-0.29); they start behind
 * a 0.6 m blocking course over the cornice, so face on only the cornice line
 * and the central pediment show, as in the photo.
 * Left out: the fence, the rear yard's outbuildings, roof hatches.
 *
 * Doubts: the rear faces' window counts are estimated; the galleries are
 * drawn on both side gables (photographed on the N. Peters end, seen on the
 * upriver end in the 2007 photo); the front block's roof between the
 * wings is a plain gable (its ends are hidden by the wings).
 *
 * Night: the windows glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { ionic, faceOf, fblock, fpanel, qf, tf, type Face } from './nola-gallier-hall'
import { box } from './atl-flatiron-building'

type Parts = { red: Part; trim: Part; granite: Part; roof: Part; win: Part; iron: Part }

const EAVE = 13.6 // lidar: eaves 13.4-14.0 above the street
const BELT = 4.3 // the granite string course over the ground storey (photos)
const BLOCK = 0.6 // a plain blocking course over the main cornice, hiding the low roofs from the street

/** Windows on a face: per bay a small ground-storey window and two tall sashes above, white-framed. */
function windows(P: Parts, F: Face, s0: number, s1: number, bays: number, skip: (k: number) => boolean = () => false) {
  const pitch = (s1 - s0) / bays
  for (let k = 0; k < bays; k++) {
    if (skip(k)) continue
    const c = s0 + (k + 0.5) * pitch
    for (const [z0, z1, w] of [[1.4, 3.2, 1.0], [5.5, 8.4, 1.25], [9.9, 12.2, 1.25]] as [number, number, number][]) {
      fpanel(P.trim, F, c - w / 2 - 0.18, c + w / 2 + 0.18, z0 - 0.18, z1 + 0.22, 0.03)
      fpanel(P.win, F, c - w / 2, c + w / 2, z0, z1, 0.06)
    }
  }
}

/** The belt course, the plinth and the cornice along a face (s0..s1). */
function bands(P: Parts, F: Face, s0: number, s1: number, eave = EAVE) {
  fblock(P.granite, F, s0, s1, 0, 0.7, 0.12)
  fblock(P.granite, F, s0, s1, BELT - 0.2, BELT + 0.2, 0.16)
  fblock(P.trim, F, s0 - 0.25, s1 + 0.25, eave - 0.75, eave, 0.32)
  if (eave === EAVE) fblock(P.red, F, s0, s1, eave - 0.05, eave + BLOCK, 0.0, -0.45)
}

/** A gable roof over an axis-aligned rectangle, ridge along x (`alongX`) or y; overhang o. Optional pediments at either end. */
function gable(P: Parts, x0: number, y0: number, x1: number, y1: number, ridge: number, alongX: boolean, ped: [boolean, boolean], o = 0.35, e = EAVE) {
  if (alongX) {
    const ym = (y0 + y1) / 2
    // the slopes start behind the blocking course (inset 0.5, at its top), so from the street only the cornice line shows
    const i = 0.5, eb = e + BLOCK
    qf(P.roof, [x0, y0 + i, eb], [x1, y0 + i, eb], [x1, ym, ridge], [x0, ym, ridge], [0, -1, 1])
    qf(P.roof, [x1, y1 - i, eb], [x0, y1 - i, eb], [x0, ym, ridge], [x1, ym, ridge], [0, 1, 1])
    void o
    for (const [x, k, on] of [[x0, -1, ped[0]], [x1, 1, ped[1]]] as [number, number, boolean][]) {
      tf(P.red, [x, y0, e], [x, y1, e], [x, ym, ridge - 0.35], [k, 0, 0])
      if (!on) continue
      const F = k < 0 ? faceOf([x, y1], [x, y0]) : faceOf([x, y0], [x, y1])
      raking(P, F, Math.abs(y1 - y0), e, ridge)
    }
  } else {
    const xm = (x0 + x1) / 2
    qf(P.roof, [x0 - o, y1 + o, e - 0.1], [x0 - o, y0 - o, e - 0.1], [xm, y0 - o, ridge], [xm, y1 + o, ridge], [-1, 0, 1])
    qf(P.roof, [x1 + o, y0 - o, e - 0.1], [x1 + o, y1 + o, e - 0.1], [xm, y1 + o, ridge], [xm, y0 - o, ridge], [1, 0, 1])
    for (const [y, k, on] of [[y0, -1, ped[0]], [y1, 1, ped[1]]] as [number, number, boolean][]) {
      tf(P.red, [x0, y, e], [x1, y, e], [xm, y, ridge - 0.35], [0, k, 0])
      if (!on) continue
      const F = k < 0 ? faceOf([x0, y], [x1, y]) : faceOf([x1, y], [x0, y])
      raking(P, F, x1 - x0, e, ridge)
    }
  }
}

/** A pediment's raking cornices (bold pale bands) and its horizontal cornice, on face F of length L. */
function raking(P: Parts, F: Face, L: number, e: number, ridge: number) {
  const h = ridge - e, t = 0.55, d = 0.38
  const slope = Math.atan2(h, L / 2), dz = t / Math.cos(slope)
  for (const side of [0, 1]) {
    const a: XY = side ? [L, e - 0.05] : [0, e - 0.05], b: XY = [L / 2, ridge - 0.05]
    const poly: XY[] = side ? [[L + 0.3, e - 0.1], [L + 0.3, e - 0.1 + dz], [L / 2, ridge + dz * 0.6], [L / 2, ridge - 0.25]] : [[-0.3, e - 0.1], [L / 2, ridge - 0.25], [L / 2, ridge + dz * 0.6], [-0.3, e - 0.1 + dz]]
    void a; void b
    // a thin slab following the roof edge
    const [p0, p1, p2, p3] = poly
    qf(P.trim, [...pt(F, p0[0], d), p0[1]] as V3, [...pt(F, p1[0], d), p1[1]] as V3, [...pt(F, p2[0], d), p2[1]] as V3, [...pt(F, p3[0], d), p3[1]] as V3, [F.n[0], F.n[1], 0])
    qf(P.trim, [...pt(F, p1[0], d), p1[1]] as V3, [...pt(F, p1[0], -0.05), p1[1]] as V3, [...pt(F, p2[0], -0.05), p2[1]] as V3, [...pt(F, p2[0], d), p2[1]] as V3, [0, 0, 1])
  }
  fblock(P.trim, F, -0.3, L + 0.3, e - 0.75, e, 0.38)
}
const pt = (F: Face, s: number, d: number): XY => [F.o[0] + F.t[0] * s + F.n[0] * d, F.o[1] + F.t[1] * s + F.n[1] * d]

/** A cast-iron gallery on a face: a floor at the belt, slim posts, a railing band and a thin roof. */
function gallery(P: Parts, F: Face, s0: number, s1: number, depth = 2.0) {
  const z0 = BELT + 0.2, z1 = 9.2
  const ring = (z: number): V3[] => [[...pt(F, s0, 0.05), z] as V3, [...pt(F, s1, 0.05), z] as V3, [...pt(F, s1, depth), z] as V3, [...pt(F, s0, depth), z] as V3]
  const slab = (za: number, zb: number) => {
    const a = ring(za), b = ring(zb)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; qf(P.iron, a[i], a[j], b[j], b[i], [0, 0, 0.0001]) }
    qf(P.iron, b[0], b[1], b[2], b[3], [0, 0, 1]); qf(P.iron, a[0], a[3], a[2], a[1], [0, 0, -1])
  }
  slab(z0 - 0.25, z0); slab(z1, z1 + 0.18)
  const n = Math.max(2, Math.round((s1 - s0) / 3) + 1)
  for (let k = 0; k < n; k++) {
    const s = s0 + 0.15 + ((s1 - s0 - 0.3) * k) / (n - 1)
    fblock(P.iron, F, s - 0.09, s + 0.09, z0, z1, depth, depth - 0.18)
  }
  fblock(P.iron, F, s0, s1, z0, z0 + 1.0, depth, depth - 0.06) // the railing as a dark band
}

function build() {
  const P: Parts = { red: new Part(), trim: new Part(), granite: new Part(), roof: new Part(), win: new Part(), iron: new Part() }
  // plan (OSM way/345253057 in the 38.7° frame; +y the Esplanade front)
  const LX0 = -44.69, LX1 = -32.42, RX0 = 30.3, RX1 = 44.59 // end wings
  const WY0 = -14.12, FY = 11.8 // wings' rear, the front line
  const BY0 = -3.2 // the front block's rear wall
  const CX0 = -15.9, CX1 = 12.8, CY = 14.07, CY0 = -18.85 // central pavilion and rear wing
  const PX0 = -10.17, PX1 = 7.2, PY = 16.52 // portico

  // ---- masses -----------------------------------------------------------
  box(P.red, LX1, RX0, BY0, FY, 0, EAVE, null, 0.3)
  box(P.red, LX0, LX1, WY0, FY, 0, EAVE, null, 0.3)
  box(P.red, RX0, RX1, WY0, FY, 0, EAVE, null, 0.3)
  const CE = 15.3 // the central pavilion rises to an attic under its low pediment (photo; lidar apex 17.7)
  box(P.red, CX0, CX1, CY0, CY, 0, CE, null, 0.3)

  // ---- roofs (lidar ridges: wings 17.3, centre 17.7, front block 15.4) --
  gable(P, LX1 - 0.4, BY0, RX0 + 0.4, FY, 15.4, true, [false, false])
  gable(P, LX0, WY0, LX1, FY, 17.3, true, [true, true])
  gable(P, RX0, WY0, RX1, FY, 17.3, true, [true, true])
  gable(P, CX0, CY0, CX1, CY, 17.7, false, [true, true], 0.35, CE)

  // ---- facades ------------------------------------------------------------
  const front: [XY, XY][] = [[[LX0, FY], [LX1, FY]], [[LX1, FY], [CX0, FY]], [[CX1, FY], [RX0, FY]], [[RX0, FY], [RX1, FY]]]
  for (const [a, b] of front) {
    const F = faceOf(b, a) // outside +y
    bands(P, F, 0, F.L)
    windows(P, F, 0, F.L, Math.max(1, Math.round(F.L / 3.4)))
  }
  // the central pavilion's front around the portico, and its returns
  {
    const F = faceOf([CX1, CY], [CX0, CY])
    bands(P, F, 0, F.L, CE)
    fblock(P.trim, F, -0.2, F.L + 0.2, EAVE - 0.75, EAVE, 0.3) // the main cornice carried across
    windows(P, F, 0, F.L, 8, (k) => k >= 2 && k <= 5)
    for (const [x0, x1] of [[CX0, CX0], [CX1, CX1]]) void x0, void x1
    const Fl = faceOf([CX0, CY], [CX0, FY]), Fr = faceOf([CX1, FY], [CX1, CY])
    for (const G of [Fl, Fr]) bands(P, G, 0, G.L, CE)
    // grey pilaster strips framing the pavilion and the wings' corners (photo)
    for (const s of [0.6, F.L - 0.6]) fblock(P.granite, F, s - 0.6, s + 0.6, 0, EAVE - 0.75, 0.22)
  }
  for (const [a, b] of [[[LX0, FY], [LX1, FY]], [[RX0, FY], [RX1, FY]]] as [XY, XY][]) {
    const F = faceOf(b, a)
    for (const s of [0.6, F.L - 0.6]) fblock(P.granite, F, s - 0.6, s + 0.6, 0, EAVE - 0.75, 0.22)
  }
  // side (gable) ends of the wings, with their iron galleries
  for (const F of [faceOf([LX0, FY], [LX0, WY0]), faceOf([RX1, WY0], [RX1, FY])]) {
    bands(P, F, 0, F.L)
    windows(P, F, 0, F.L, 7)
    // on the side gables only, set back from the Esplanade front (photo: EsplanadeNPetersOldMint)
    if (F.n[0] < 0) gallery(P, F, 7.0, F.L - 1.5); else gallery(P, F, 1.5, F.L - 7.0)
  }
  // the wings' inner faces and the rear
  for (const F of [faceOf([LX1, WY0], [LX1, BY0]), faceOf([RX0, BY0], [RX0, WY0]), faceOf([LX0, WY0], [LX1, WY0]), faceOf([RX0, WY0], [RX1, WY0]),
    faceOf([LX1, BY0], [CX0, BY0]), faceOf([CX1, BY0], [RX0, BY0]), faceOf([CX0, BY0], [CX0, CY0]), faceOf([CX1, CY0], [CX1, BY0]), faceOf([CX0, CY0], [CX1, CY0])]) {
    const central = Math.abs(F.t[0]) < 0.01 ? Math.abs(F.o[0] - CX0) < 0.01 || Math.abs(F.o[0] - CX1) < 0.01 : Math.abs(F.o[1] - CY0) < 0.01
    bands(P, F, 0, F.L, central ? CE : EAVE)
    windows(P, F, 0, F.L, Math.max(1, Math.round(F.L / 3.6)))
  }

  // ---- the Ionic portico on Esplanade ---------------------------------------
  // a red podium (the ground storey) with the entrance, a balcony, four
  // Ionic columns between square antae, a pale entablature and flat roof
  const Fp = faceOf([PX1, PY], [PX0, PY])
  box(P.red, PX0, PX1, CY - 0.1, PY, 0, BELT + 0.2, null, 0.15)
  fblock(P.granite, Fp, -0.1, Fp.L + 0.1, BELT - 0.2, BELT + 0.25, 0.18)
  fblock(P.granite, Fp, -0.1, Fp.L + 0.1, 0, 0.7, 0.12)
  fpanel(P.trim, Fp, Fp.L / 2 - 1.1, Fp.L / 2 + 1.1, 0, 3.3, 0.03)
  fpanel(P.win, Fp, Fp.L / 2 - 0.8, Fp.L / 2 + 0.8, 0, 3.0, 0.06)
  const zc0 = BELT + 0.25, zc1 = EAVE - 1.05, yc = PY - 0.9
  const a0 = PX0 + 0.75, a1 = PX1 - 0.75, cols = [1, 2, 3, 4].map((k) => a0 + ((a1 - a0) * k) / 5) // evenly between the antae (photo)
  for (const x of cols) ionic(P.trim, x, yc, 0.6, zc0, zc1, true, 12)
  for (const x of [PX0 + 0.75, PX1 - 0.75]) box(P.trim, x - 0.7, x + 0.7, CY - 0.1, yc + 0.7, zc0, zc1, P.trim, 0.12) // antae, full height
  box(P.granite, PX0 - 0.1, PX1 + 0.1, CY - 0.1, PY, zc1, zc1 + 0.55, null, 0.05) // architrave
  box(P.trim, PX0 - 0.35, PX1 + 0.35, CY - 0.1, PY + 0.3, zc1 + 0.55, EAVE + 0.15, P.roof, 0.12) // frieze and cornice
  box(P.iron, PX0 + 1.5, PX1 - 1.5, yc - 0.75, yc - 0.65, zc0 + 0.85, zc0 + 1.0, P.iron, 0) // balcony rail, behind the columns
  // the tall windows and door behind the columns
  {
    const Fc = faceOf([PX1, CY], [PX0, CY])
    for (const s of [Fc.L * 0.18, Fc.L * 0.39, Fc.L * 0.61, Fc.L * 0.82]) {
      fpanel(P.trim, Fc, s - 0.85, s + 0.85, 5.2, 8.7, 0.03)
      fpanel(P.win, Fc, s - 0.65, s + 0.65, 5.4, 8.5, 0.06)
      fpanel(P.trim, Fc, s - 0.85, s + 0.85, 9.8, 12.0, 0.03)
      fpanel(P.win, Fc, s - 0.65, s + 0.65, 10.0, 11.8, 0.06)
    }
  }

  finishModel('Old U.S. Mint', 'nola-old-us-mint', [
    { part: P.red, material: finish('mint-red-stucco', 0xb8705e) },
    { part: P.trim, material: PALETTE.trim },
    { part: P.granite, material: finish('mint-granite', 0xb3b1ab) },
    { part: P.roof, material: finish('mint-slate', 0x7b8188) },
    { part: P.win, material: PALETTE.window },
    { part: P.iron, material: finish('iron', 0x4a4f57) },
  ], { bearing: 38.7, osm: 'way/345253057', height: 17.7 }, 6500)
}

if (import.meta.main) build()
