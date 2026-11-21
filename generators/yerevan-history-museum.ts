/**
 * History Museum of Armenia and National Gallery, Republic Square, Yerevan:
 * procedural, CC0-1.0.
 *   bun generators/yerevan-history-museum.ts   (writes the low and the detail model)
 *
 * The square's other big building (Mark Grigorian and others to Tamanian's
 * plan, 1950s), in pale cream-yellow tuff. Identity, in order: the long
 * symmetrical front on the fountain pool, its ground storey one long
 * arcade of round arches on paired columns before a deep loggia, the tall
 * central portal arch between two oculi under a low carved pediment; the
 * blind-arcaded upper storey and heavy cornice; the square tower block
 * rising behind the centre in two tiers (a wide lower tier, an upper tier
 * with chamfered corners, two rows of windows and a low hipped roof); the
 * lower end pavilions set back at both ends; the pale warm tuff.
 *
 * Frame: x along the front (compass 132.2, south-east), y into the building
 * (compass 42.2, north-east), z up, metres; placed at bearing 42.2. The
 * front faces -y, to the square. Origin: the area centroid of the three
 * OSM ways below, 44.5141304, 40.1787795.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): relation/2983284 (the National Gallery,
 *   building=government, 8 levels; its outer way 31623413 is also
 *   relation/16666122, building:part, 4 levels): the front wing 72 m long
 *   and 21.6 m deep, the side and back wings round a court; way/1556397989
 *   (8 levels: the tower block in the court, 38 m square); way/1556397988
 *   (3 levels: the north-west end wing). The museum's node is
 *   node/1436858079.
 * - Photos (Wikimedia Commons, evidence):
 *   m1 Vyacheslav Argenberg, CC BY 4.0, "Yerevan, History Museum of
 *      Armenia at night, Armenia.jpg"
 *      https://commons.wikimedia.org/wiki/File:Yerevan,_History_Museum_of_Armenia_at_night,_Armenia.jpg
 *   m2 EvgenyGenkin, CC BY-SA 4.0, "Armenia Museum of Art and
 *      History.jpg": the front square-on in sun across the pool
 *      https://commons.wikimedia.org/wiki/File:Armenia_Museum_of_Art_and_History.jpg
 *   m3 Mayer Hovann, CC BY-SA 4.0, "History Museum of Armenia in
 *      Yerevan.jpg": the front close (colour-graded: used for form only)
 *      https://commons.wikimedia.org/wiki/File:History_Museum_of_Armenia_in_Yerevan.jpg
 *   m6 Diego Delso, CC BY-SA 4.0, "Plaza de la República, Ereván,
 *      Armenia, 2016-10-02, DD 113-114 HDR.jpg": the front square-on at
 *      night, the set-back end pavilions
 *      https://commons.wikimedia.org/wiki/File:Plaza_de_la_Rep%C3%BAblica,_Erev%C3%A1n,_Armenia,_2016-10-02,_DD_113-114_HDR.jpg
 *   m7 GeoO, CC BY-SA 4.0, "National Gallery of Armenia -
 *      Հայաստանի ազգային պատկերասրահ.jpg": from across the square, far: the
 *      tower's two tiers over the front
 *      https://commons.wikimedia.org/wiki/File:National_Gallery_of_Armenia_-_%D5%80%D5%A1%D5%B5%D5%A1%D5%BD%D5%BF%D5%A1%D5%B6%D5%AB_%D5%A1%D5%A6%D5%A3%D5%A1%D5%B5%D5%AB%D5%B6_%D5%BA%D5%A1%D5%BF%D5%AF%D5%A5%D6%80%D5%A1%D5%BD%D6%80%D5%A1%D5%B0.jpg
 *   Also the Government House photos g4 (Vyacheslav Argenberg, CC BY 4.0)
 *   for the museum's south-east end seen from above.
 * - Look-only: none.
 *
 * Numbers
 * - Plan: OSM, measured; the tower's tiers are narrower than the OSM block
 *   (m7: the lower tier 0.38 and the upper 0.27 of the 72 m front, so 28
 *   and 20 m).
 * - Heights estimated: m6 (square-on) gives 0.07 m/px from the 72 m front:
 *   the cornice 16.0, the parapet 17.2 (hiding the flat roofs), the
 *   pediment's apex 19.6; the arcade's arches 3.2 m wide on 4.8 m bays,
 *   springing 8.0, crowns 9.6 (m2: about 60% of the height to the
 *   cornice); the portal 7.4 m wide, its crown 14.5 rising into the
 *   pediment zone, a 4 m vestibule behind; the end pavilions 11 m. The
 *   tower (m2, m7): the lower tier 24 m wide to 21.5, the upper 18 m wide
 *   to 35, its cornice to 36 and the hipped roof to 38.5.
 * - Colours: the tuff in sun #ede1d1 and #f0e9db (m2), #e1d2be in light
 *   shade: drawn #e8d4b8, a warm cream; the loggia's shade #b59f86; the
 *   flat roofs a warm grey-beige #b3a28c so they do not read as grey slabs.
 *
 * Doubts
 * - No height is published; all are from photo proportions.
 * - The assignment called the tuff yellow-orange; daylight photos (m2)
 *   show a pale cream-yellow, and m3's orange is colour grading.
 * - The court sides, the back and the north-west wing are not photographed:
 *   they get plain window panels, flat roofs and OSM's outlines.
 * - Terrain: Mapterhorn z12 shows the building as a 10-13 m bump; the
 *   square is flat in the photos, so the model is flat.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import {
  type XY, projector, toCCW, ringArea, clipRing, rectRing, walls, capRing, prismRing, hipRoof, band, faceOf, onFace,
  archOutline, facePanel, screen, column, blockOnFace, ringPanels, save, wallLight, fquad, ftri, parapet, boss, lathe, insidePoly,
} from './yerevan-government-house'

const ANCHOR: XY = [44.5141304, 40.1787795]
const BEARING = 42.2
const P = projector(ANCHOR[0], ANCHOR[1], BEARING)
const OSM: Record<string, Array<[number, number]>> = {
  'relation/2983284': [[44.514086, 40.1792621], [44.5144271, 40.1790123], [44.5145762, 40.178908], [44.5145925, 40.1788966], [44.5149127, 40.1786726], [44.5147676, 40.1785515], [44.514739, 40.1785715], [44.5146128, 40.178466], [44.5144906, 40.1783641], [44.5144479, 40.178394], [44.514314, 40.1782823], [44.5141985, 40.1783631], [44.5141527, 40.1783249], [44.5141244, 40.1783012], [44.513833, 40.1785049], [44.513497, 40.1787401], [44.5135274, 40.1787654], [44.5135652, 40.1787985], [44.513665, 40.1788861], [44.513712, 40.178853], [44.5138362, 40.1787656], [44.5141678, 40.1785322], [44.5142828, 40.1784513], [44.5145851, 40.1787059], [44.5144679, 40.1787886], [44.5141376, 40.1790217], [44.5140113, 40.1791108], [44.5139536, 40.1791515]],
  'way/1556397989': [[44.5141376, 40.1790217], [44.5138362, 40.1787656], [44.5141678, 40.1785322], [44.5144679, 40.1787886]],
  'way/1556397988': [[44.513665, 40.1788861], [44.5135652, 40.1787985], [44.5134393, 40.1788865], [44.513535, 40.1789624], [44.5136077, 40.1790204], [44.513567, 40.1790488], [44.5136622, 40.1791328], [44.51377, 40.1792279], [44.5138169, 40.1791956], [44.5139731, 40.1793276], [44.514086, 40.1792621], [44.5139536, 40.1791515], [44.5140113, 40.1791108], [44.513712, 40.178853]],
}
const ring = (id: string) => toCCW(OSM[id].map(([a, b]) => P(a, b)))

// the front (see the header)
const FX0 = -37.0, FX1 = 35.1, FY = -39.5, FY1 = -17.9
const Z = { cornice: 16.0, top: 17.2, arcTop: 10.4, spring: 8.0, blind0: 11.2, blind1: 13.6, portalTop: 15.4, pedApex: 19.6, portalSpring: 10.8, tier1: 21.5, tier2: 35.0, tier2c: 36.0, roofTop: 38.5, ends: 11.0 }
const PW = 3.7 // the portal's half width
const LOGGIA = 3.0
const CX = (FX0 + FX1) / 2 // the front's centre line

/** An arch-shaped band (s, z): between radii r0 and r1 round centre c, springing zs, with short legs. */
function archivolt(c: number, r0: number, r1: number, zs: number, seg: number): XY[] {
  const out: XY[] = [[c + r1, zs - 0.4]]
  for (let i = 0; i <= seg; i++) { const t = (Math.PI * i) / seg; out.push([c + r1 * Math.cos(t), zs + r1 * Math.sin(t)]) }
  out.push([c - r1, zs - 0.4], [c - r0, zs - 0.4])
  for (let i = seg; i >= 0; i--) { const t = (Math.PI * i) / seg; out.push([c + r0 * Math.cos(t), zs + r0 * Math.sin(t)]) }
  out.push([c + r0, zs - 0.4])
  return out
}

function build(detail: boolean) {
  const tuff = new Part(), shade = new Part(), trim = new Part(), roof = new Part(), win = new Part()
  const SEG = detail ? 10 : 6
  const rel = ring('relation/2983284'), towerR = ring('way/1556397989'), nw = ring('way/1556397988')

  // ── the front wing, built in layers so the loggia and the blind arcade are real recesses ──
  // bays: [x0, x1, kind]: arch = an arcade bay, portal = the central arch, pier = solid
  type Bay = { x0: number; x1: number; kind: 'arch' | 'portal' | 'solid' }
  const bays: Bay[] = []
  const B = 4.8, half = 14.35
  // left: an end pier, four arches; the centre: an arch, the portal, an arch; right mirrored
  bays.push({ x0: FX0, x1: CX - half - 4 * B, kind: 'solid' })
  for (let i = 0; i < 4; i++) bays.push({ x0: CX - half - (4 - i) * B, x1: CX - half - (3 - i) * B, kind: 'arch' })
  bays.push({ x0: CX - half, x1: CX - half + 1.2, kind: 'solid' })
  bays.push({ x0: CX - half + 1.2, x1: CX - half + 1.2 + B, kind: 'arch' })
  bays.push({ x0: CX - half + 1.2 + B, x1: CX - 5.0, kind: 'solid' })
  bays.push({ x0: CX - 5.0, x1: CX + 5.0, kind: 'portal' })
  bays.push({ x0: CX + 5.0, x1: CX + half - 1.2 - B, kind: 'solid' })
  bays.push({ x0: CX + half - 1.2 - B, x1: CX + half - 1.2, kind: 'arch' })
  bays.push({ x0: CX + half - 1.2, x1: CX + half, kind: 'solid' })
  for (let i = 0; i < 4; i++) bays.push({ x0: CX + half + i * B, x1: CX + half + (i + 1) * B, kind: 'arch' })
  bays.push({ x0: CX + half + 4 * B, x1: FX1, kind: 'solid' })
  const LX0 = CX - half - 4 * B, LX1 = CX + half + 4 * B // the loggia's extent
  const PD = 4.0 // the portal's vestibule depth

  // the mass: below the arcade top the front line steps back by the loggia (and the portal's vestibule)
  const lowRing: XY[] = [[FX0, FY], [LX0, FY], [LX0, FY + LOGGIA], [CX - PW, FY + LOGGIA], [CX - PW, FY + PD], [CX + PW, FY + PD], [CX + PW, FY + LOGGIA], [LX1, FY + LOGGIA], [LX1, FY], [FX1, FY], [FX1, FY1], [FX0, FY1]]
  const full = rectRing(FX0, FY, FX1, FY1)
  const blindRing = rectRing(FX0, FY + 0.35, FX1, FY1)
  const frontSkip = (a: XY, b: XY) => Math.abs(a[1] - FY1) < 0.01 && Math.abs(b[1] - FY1) < 0.01 // the court side is drawn by the court wing
  // the loggia's back wall and sides in shade, the rest tuff
  {
    const r = toCCW(lowRing)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const inLog = a[1] > FY + 0.1 && b[1] > FY + 0.1 && a[1] < FY + PD + 0.1 && b[1] < FY + PD + 0.1 && Math.min(a[0], b[0]) >= LX0 - 0.01 && Math.max(a[0], b[0]) <= LX1 + 0.01
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      fquad(inLog ? shade : tuff, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], Z.arcTop], [a[0], a[1], Z.arcTop], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
    }
  }
  // above the arcade the portal's vestibule rises on to its crown; the blind arcade is a 0.35 m recess
  const notched = (fy: number): XY[] => [[FX0, fy], [CX - PW, fy], [CX - PW, FY + PD], [CX + PW, FY + PD], [CX + PW, fy], [FX1, fy], [FX1, FY1], [FX0, FY1]]
  const layer = (r0: XY[], z0: number, z1: number, front: number) => {
    const r = toCCW(r0)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.abs(a[1] - FY1) < 0.01 && Math.abs(b[1] - FY1) < 0.01) continue
      const inNotch = a[1] > FY + 0.5 && b[1] > FY + 0.5 && Math.max(Math.abs(a[0] - CX), Math.abs(b[0] - CX)) < PW + 0.01
      const recessed = front > 0.01 && Math.abs(a[1] - (FY + front)) < 0.01 && Math.abs(b[1] - (FY + front)) < 0.01
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      fquad(inNotch || recessed ? shade : tuff, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
    }
  }
  layer(notched(FY), Z.arcTop, Z.blind0, 0)
  layer(notched(FY + 0.35), Z.blind0, Z.blind1, 0.35)
  layer(notched(FY), Z.blind1, Z.portalTop, 0)
  layer(full, Z.portalTop, Z.cornice, 0)
  fquad(shade, [CX - PW, FY, Z.portalTop], [CX - PW, FY + PD, Z.portalTop], [CX + PW, FY + PD, Z.portalTop], [CX + PW, FY, Z.portalTop], [0, 0, -1])
  // the loggia's floor and ceiling
  fquad(shade, [LX0, FY, 0.6], [LX1, FY, 0.6], [LX1, FY + LOGGIA, 0.6], [LX0, FY + LOGGIA, 0.6], [0, 0, 1])
  fquad(shade, [LX0, FY, Z.arcTop], [LX0, FY + LOGGIA, Z.arcTop], [LX1, FY + LOGGIA, Z.arcTop], [LX1, FY, Z.arcTop], [0, 0, -1])
  // a plinth step under the arcade
  blockOnFace(trim, faceOf([LX0, FY], [LX1, FY]), 0, LX1 - LX0, 0, 0.6, 0.6, -0.1)
  // the arcade screen: one slab along the front with a hole per arch, the portal taller
  const fF = faceOf([FX0, FY], [FX1, FY])
  {
    const holes: XY[][] = []
    for (const b of bays) {
      const c = (b.x0 + b.x1) / 2 - FX0
      if (b.kind === 'arch') holes.push(archOutline(c - 1.6, c + 1.6, 0.6, Z.spring, SEG))
      if (b.kind === 'portal') holes.push(archOutline(c - PW, c + PW, 0.6, Z.portalSpring, SEG + 2))
    }
    // the portal's arch rises over the screen's top: the screen runs to the portal's crown there
    screen(tuff, fF, [[LX0 - FX0, 0.6], [LX1 - FX0, 0.6], [LX1 - FX0, Z.arcTop], [CX + 5 - FX0, Z.arcTop], [CX + 5 - FX0, Z.portalTop], [CX - 5 - FX0, Z.portalTop], [CX - 5 - FX0, Z.arcTop], [LX0 - FX0, Z.arcTop]], holes, 0.8, trim)
    // the loggia's back: glazed doors behind every arch; the portal's glazed screen
    for (const b of bays) {
      const c = (b.x0 + b.x1) / 2
      if (b.kind === 'arch') facePanel(win, faceOf([c - 1.4, FY + LOGGIA], [c + 1.4, FY + LOGGIA]), archOutline(0, 2.8, 0.7, Z.spring - 0.2, SEG), 0.04)
      if (b.kind === 'portal') facePanel(win, faceOf([c - PW, FY + PD], [c + PW, FY + PD]), archOutline(0.1, 2 * PW - 0.1, 0.7, Z.portalSpring, SEG), 0.04)
    }
    // the portal's vestibule walls above the loggia's ceiling, to the arch's crown
    // (the vestibule's walls are the notched layers above)
    // the portal's raised surround and the two oculi
    blockOnFace(trim, fF, CX - 5.7 - FX0, CX - 4.7 - FX0, 0.6, Z.portalTop, 0.25, -0.05)
    blockOnFace(trim, fF, CX + 4.7 - FX0, CX + 5.7 - FX0, 0.6, Z.portalTop, 0.25, -0.05)
    // archivolts: a moulded band round every arch
    for (const b of bays) {
      const c = (b.x0 + b.x1) / 2 - FX0
      if (b.kind === 'arch') facePanel(trim, fF, archivolt(c, 1.6, 2.15, Z.spring, SEG), 0.12)
      if (b.kind === 'portal') facePanel(trim, fF, archivolt(c, PW, PW + 0.9, Z.portalSpring, SEG + 2), 0.2)
    }
    for (const s of [-9.6, 9.6]) {
      const ring12 = (r: number) => Array.from({ length: detail ? 16 : 10 }, (_, i) => { const t = (i * 2 * Math.PI) / (detail ? 16 : 10); return [CX + s - FX0 + r * Math.cos(t), 12.4 + r * Math.sin(t)] as XY })
      facePanel(trim, fF, ring12(1.15), 0.08)
      facePanel(win, fF, ring12(0.8), 0.12)
    }
    // paired columns before the piers between arches (detail), single pilasters (low)
    for (const b of bays) {
      if (b.kind !== 'arch') continue
      for (const xe of [b.x0, b.x1]) {
        const s = xe - FX0
        if (detail) for (const o of [-0.42, 0.42]) { const p = onFace(fF, s + o, 0.32, 0); column(trim, [p[0], p[1]], 0.26, 0.6, Z.spring, 10, 0.35, 0.3) }
        else blockOnFace(trim, fF, s - 0.6, s + 0.6, 0.6, Z.spring, 0.22, -0.05)
      }
    }
  }
  // the blind arcade on the upper storey: thin screens either side of the portal, an arched niche over each outer bay
  {
    for (const [s0, s1] of [[0, CX - 5 - FX0], [CX + 5 - FX0, FX1 - FX0]] as XY[]) {
      const holes: XY[][] = []
      for (const b of bays) {
        const c = (b.x0 + b.x1) / 2 - FX0
        if (b.kind === 'arch' && c > s0 + 1.2 && c < s1 - 1.2 && Math.abs(c + FX0 - CX) > 12) holes.push(archOutline(c - 1.0, c + 1.0, Z.blind0 + 0.5, Z.blind1 - 1.4, SEG))
      }
      screen(tuff, fF, [[s0, Z.blind0], [s1, Z.blind0], [s1, Z.blind1], [s0, Z.blind1]], holes, 0.35, shade)
    }
  }
  // string course and the cornice; the parapet; the central pediment
  blockOnFace(trim, fF, 0, FX1 - FX0, Z.arcTop + 0.1, Z.arcTop + 0.5, 0.25, -0.05)
  band(trim, full, Z.cornice - 0.7, 0.7, 0.6, frontSkip)
  walls(tuff, full, Z.cornice, Z.top, frontSkip)
  parapet(trim, roof, full, Z.cornice - 0.2, Z.top, 0.5)
  {
    // the pediment: a low gable over the centre, carved band on its rake (detail)
    const x0 = CX - half, x1 = CX + half, y0 = FY - 0.15, y1 = FY + 4
    const A: V3 = [x0, y0, Z.top], Bv: V3 = [x1, y0, Z.top], Ap: V3 = [CX, y0, Z.pedApex]
    const A1: V3 = [x0, y1, Z.top], B1: V3 = [x1, y1, Z.top], Ap1: V3 = [CX, y1, Z.pedApex]
    ftri(tuff, A, Bv, Ap, [0, -1, 0])
    const sl = Math.atan2(Z.pedApex - Z.top, half)
    fquad(trim, Ap, Bv, B1, Ap1, [Math.sin(sl), 0, Math.cos(sl)])
    fquad(trim, A, Ap, Ap1, A1, [-Math.sin(sl), 0, Math.cos(sl)])
    ftri(tuff, B1, A1, Ap1, [0, 1, 0])
    // a raised band of carving across the cornice of the centre
    blockOnFace(trim, fF, x0 - FX0, x1 - FX0, Z.cornice - 1.6, Z.cornice - 0.7, 0.2, -0.05)
    if (detail) for (let k = 0; k < 12; k++) boss(trim, fF, x0 - FX0 + 1.2 + (k * (2 * half - 2.4)) / 11, Z.cornice - 1.15, 0.38, 0.3)
  }

  // ── the other wings round the court, the end pavilions ──
  const rest = clipRing(rel, rectRing(FX0, FY - 3, FX1, FY1), true).filter((r) => Math.abs(ringArea(r)) > 30)
  const ends: XY[][] = [], high: XY[][] = []
  for (const r of rest) {
    for (const q of clipRing(r, rectRing(FX1 - 0.01, -60, 80, -13.4))) ends.push(q)
    for (const q of clipRing(r, rectRing(FX1 - 0.01, -60, 80, -13.4), true)) high.push(q)
  }
  ends.push(nw)
  const hidden = [full, ...ends, ...high, towerR]
  for (const r of high) {
    walls(tuff, r, 0, Z.top)
    band(trim, r, Z.cornice - 0.7, 0.7, 0.5)
    parapet(trim, roof, r, Z.cornice - 0.2, Z.top, 0.5)
    ringPanels(win, r, [{ z0: 1.8, z1: 7.2, arch: true }, { z0: 9.6, z1: 14.4, arch: true }], { bay: 4.4, w: 2.0, hidden: hidden.filter((q) => q !== r), seg: detail ? 8 : 3, frame: detail ? trim : undefined })
  }
  for (const r of ends) {
    walls(tuff, r, 0, Z.ends)
    band(trim, r, Z.ends - 0.6, 0.6, 0.45)
    parapet(trim, roof, r, Z.ends - 0.4, Z.ends + 0.6, 0.45)
    ringPanels(win, r, [{ z0: 1.8, z1: 8.4, arch: true }], { bay: 4.2, w: 2.0, hidden: hidden.filter((q) => q !== r), seg: detail ? 8 : 3, frame: detail ? trim : undefined })
  }

  // ── the tower block in the court ──
  {
    capRing(roof, towerR, Z.top - 0.3)
    walls(tuff, towerR, 0, Z.top - 0.3, (a, b) => { const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return insidePoly([m[0], m[1] - 0.5], full) || insidePoly([m[0], m[1] + 0.5], full) })
    const c: XY = [(towerR[0][0] + towerR[2][0]) / 2, (towerR[0][1] + towerR[2][1]) / 2]
    const sq = (h: number, ch = 0): XY[] => ch ? [[c[0] - h + ch, c[1] - h], [c[0] + h - ch, c[1] - h], [c[0] + h, c[1] - h + ch], [c[0] + h, c[1] + h - ch], [c[0] + h - ch, c[1] + h], [c[0] - h + ch, c[1] + h], [c[0] - h, c[1] + h - ch], [c[0] - h, c[1] - h + ch]] : rectRing(c[0] - h, c[1] - h, c[0] + h, c[1] + h)
    const lower = sq(12, 2.2), upper = sq(9, 2.2)
    prismRing(tuff, null, lower, Z.top - 0.3, Z.tier1)
    band(trim, lower, Z.tier1 - 0.5, 0.5, 0.4)
    capRing(roof, lower, Z.tier1)
    ringPanels(win, lower, [{ z0: Z.top + 0.9, z1: Z.tier1 - 1.0, arch: true }], { bay: 2.8, w: 1.1, minLen: 6, seg: detail ? 6 : 3 })
    prismRing(tuff, null, upper, Z.tier1, Z.tier2)
    band(trim, upper, Z.tier2, Z.tier2c - Z.tier2, 0.55)
    hipRoof(roof, sq(9.55, 2.4), Z.tier2c, 5.4, Z.roofTop - Z.tier2c)
    // two rows of windows on the faces, an arched niche on each chamfer
    ringPanels(win, upper, [{ z0: 24.0, z1: 28.4 }, { z0: 29.8, z1: 33.6 }], { bay: 2.6, w: 1.5, minLen: 8, margin: 1.4, seg: 3 })
    for (let i = 0; i < upper.length; i++) {
      const f = faceOf(upper[i], upper[(i + 1) % upper.length])
      if (f.L > 5) continue
      // the chamfer's niche: a real recess in the low and the detail model alike
      const hole = archOutline(f.L / 2 - 0.9, f.L / 2 + 0.9, 23.6, 31.6, SEG)
      screen(tuff, f, rectRing(0.05, 22.8, f.L - 0.05, 33.8), [hole], 0.5, shade)
      facePanel(shade, f, hole, -0.5)
    }
  }
  if (detail) {
    // the arcade's capitals carry a carved impost block, the portal a keystone
    for (const b of bays) if (b.kind === 'arch') for (const xe of [b.x0, b.x1]) blockOnFace(trim, fF, xe - FX0 - 0.95, xe - FX0 + 0.95, Z.spring - 0.1, Z.spring + 0.35, 0.5, -0.05)
    blockOnFace(trim, fF, CX - 0.6 - FX0, CX + 0.6 - FX0, 14.0, 15.4, 0.3, -0.05)
  }
  void lathe
  return { tuff, shade, trim, roof, win }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.tuff, material: { ...finish('yerevan-tuff-cream', 0xefdfc8), floodlight: wallLight(0.9) } },
      { part: p.trim, material: { ...finish('tuff-cream-trim', 0xf7ecdb), floodlight: wallLight(0.95) } },
      { part: p.shade, material: { ...finish('tuff-cream-shade', 0xb9a58e) } },
      { part: p.roof, material: finish('flat-roof-warm', 0xb3a28c) },
      { part: p.win, material: PALETTE.window },
    ]
  }
  const meta = { osm: 'relation/2983284', bearing: BEARING, height: Z.roofTop }
  await save('yerevan-history-museum.glb', 'History Museum of Armenia', make(false), meta, 6500, 250 * 1024)
  await save('yerevan-history-museum.detail.glb', 'History Museum of Armenia', make(true), meta, 40000, 1536 * 1024)
}
