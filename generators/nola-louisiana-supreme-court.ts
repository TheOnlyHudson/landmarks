/**
 * Louisiana Supreme Court Building (the New Courts Building), 400 Royal
 * Street, New Orleans (1908-10, Frederick W. Brown) — procedural, CC0-1.0,
 * no textures. bun generators/nola-louisiana-supreme-court.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 307.5, square to the block: model
 * +y faces compass 307.5, the Royal Street front; −y is Chartres Street;
 * +x runs toward St. Louis Street (compass 37.5), −x toward Conti. Anchor:
 * the area centroid of OSM way/208550740 (-90.066041, 29.955702).
 *
 * Identity, in order: the white marble Beaux-Arts block; on Royal, two
 * pilastered end pavilions and the slightly recessed centre with six Ionic
 * columns (two singles and two pairs) over a rusticated two-storey base with
 * big arched windows and three doors up a broad flight of steps; the heavy
 * entablature and modillioned cornice under a balustrade right round the
 * roof, with a carved cartouche over the centre; and on the Chartres side
 * the two semicircular end wings with Ionic pilasters, which are what the
 * building is known for from St. Louis and Conti.
 *
 * Plan (from OSM, simplified): the Royal block (y 15.25..44.7, 53.6 m wide),
 * a 26 m connector (y −4.65..15.25) between two garden courts, the Chartres
 * block (y −36.9..−4.65) and its two wings ending in semicircles (centres
 * x ±34.2, y −20.8, radius 10.6).
 *
 * Evidence
 * - OSM way/208550740 (building=yes, courthouse, height 28, 4 levels).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame; ground 1.3 over the grid's minimum.
 *   Cornice edge 25.1, roof deck ~26.0, balustrade top ~27.5 all round
 *   (27.4-28.6 on the Chartres block), a rooftop penthouse ~31.6 over the
 *   connector. The lidar footprint has the same plan but sits ~2 m toward
 *   St. Louis and ~2.6 m toward Chartres from the OSM outline; the model
 *   follows OSM (the map's frame), heights follow the lidar.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - Photos (all evidence):
 *   - "Louisiana Supreme Court - New Courts building on Royal Street, New
 *     Orleans Feb 2026.jpg", ajay_suresh, CC BY 4.0: the Royal front
 *     face-on (19.9 px/m) — every bay, storey line and column position
 *     https://commons.wikimedia.org/wiki/File:Louisiana_Supreme_Court_-_New_Courts_building_on_Royal_Street,_New_Orleans_Feb_2026.jpg
 *   - "New Courts Building, French Quarter New Orleans November 2024.jpg",
 *     Daniel Hartwig, CC BY 2.0: the centre's columns, base arches
 *     https://commons.wikimedia.org/wiki/File:New_Courts_Building,_French_Quarter_New_Orleans_November_2024.jpg
 *   - "New Courts Building, New Orleans.jpg", Yair Haklai, CC BY-SA 4.0:
 *     a round wing and the flank beside it
 *     https://commons.wikimedia.org/wiki/File:New_Courts_Building,_New_Orleans.jpg
 *   - "New Orleans French Quarter, 13 November 2024 - New Courts Bldg
 *     Curved Entrance.jpg", Daniel Hartwig, CC BY 2.0: the door at the
 *     wing's apex
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_French_Quarter,_13_November_2024_-_New_Courts_Bldg_Curved_Entrance.jpg
 *   - "French Quarter - New Courts Bldg - New Orleans, March 2015.jpg",
 *     pasa47, CC BY 2.0: the St. Louis Street flank of the Royal block
 *     https://commons.wikimedia.org/wiki/File:French_Quarter_-_New_Courts_Bldg_-_New_Orleans,_March_2015.jpg
 *   - "Louisiana Supreme Court in New Orleans 2.JPG", MusikAnimal,
 *     CC BY-SA 4.0: a round wing and the long Chartres-side flank
 *     https://commons.wikimedia.org/wiki/File:Louisiana_Supreme_Court_in_New_Orleans_2.JPG
 *   - "Louisiana Supreme Court in New Orleans 3.JPG", MusikAnimal,
 *     CC BY-SA 4.0: the Royal front's steps and doors close up
 *     https://commons.wikimedia.org/wiki/File:Louisiana_Supreme_Court_in_New_Orleans_3.JPG
 * - Published: Wikipedia, "Louisiana Supreme Court" / NRHP: completed 1910,
 *   white marble and glazed terracotta, restored 2004.
 *
 * Measured (lidar): the heights of cornice, roof, balustrade and penthouse.
 * Estimated from the face-on photo scaled to them: base 0-12.6 (ground
 * windows 3.0-6.0, arched windows to 10.6), balcony course 11.6-12.6, the
 * order 12.6-21.9 (two window storeys), architrave and frieze to 24.3,
 * cornice to 25.6, balustrade to 27.2, the pavilions' and centre's widths,
 * the column positions (r 0.55), the 0.8 m recess of the centre, the steps
 * (1.0 m, four risers). Invented (no face-on photo): the bay rhythm of the
 * Chartres front and of the garden courts' walls, which repeat the flanks'
 * pilastered bays; a door at the Chartres front's centre.
 * Left out: the dentils and modillions, the carving, the lamps, the fence,
 * the statue.
 *
 * Doubts: the lidar/OSM offset above; the courts' inner walls are not
 * photographed and carry plain windows only.
 *
 * Review round 1 changes: columns r 0.76 standing 1.05 m proud of a 2.2 m
 * recess whose wall is a shadow tone, with an entablature block over them;
 * pavilion pilasters 1.25 m wide, 0.75 m proud; cornice 2 m deep and 1.6 m
 * proud; a solid balustrade band; three large arched windows (3.8 m) over
 * the doors; the base rusticated as bold horizontal bands; pale warm white
 * marble. Face-on orthographic views also show the wider Chartres block's
 * wings beside the Royal block, which perspective and trees hide in photos.
 *
 * Night: the marble is floodlit (`floodlight`), the windows and doors glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, capPoly, type XY } from './nyc-570-lexington'
import { band, parapet, block, column } from './nyc-city-hall'
import { faceOf, fpanel, farch, fblock, fprism, fp, qf, steps, type Face } from './nola-gallier-hall'

const shade = new Part(), marble = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

const XC = 0.2                       // the building's axis
const TOP = 25.6, ROOF = 25.95
const BASE = 12.6, CAP = 21.9
const NW = 26.8, CONN = 13.0, SE = 27.05, WX = 34.2, WY = -20.8, WR = 10.6
const YR = 44.7, YRB = 15.25, YCF = -4.65, YCH = -36.88, RECESS = 2.2
const PAV = 10.0                     // half-width of the centre between the pavilions

// The outer ring, counter-clockwise.
const ring: XY[] = []
const P = (x: number, y: number) => ring.push([XC + x, y])
const ARC = 7
P(-SE, YCH); P(SE, YCH); P(SE, WY - WR); P(WX, WY - WR)
const arcStart = ring.length - 1
for (let k = 1; k < ARC; k++) { const a = -Math.PI / 2 + (k / ARC) * Math.PI; P(WX + WR * Math.cos(a), WY + WR * Math.sin(a)) }
P(WX, WY + WR); P(SE, WY + WR); P(SE, YCF); P(CONN, YCF); P(CONN, YRB); P(NW, YRB); P(NW, YR)
P(PAV, YR); P(PAV, YR - RECESS); P(-PAV, YR - RECESS); P(-PAV, YR)
P(-NW, YR); P(-NW, YRB); P(-CONN, YRB); P(-CONN, YCF); P(-SE, YCF); P(-SE, WY + WR); P(-WX, WY + WR)
const arc2Start = ring.length - 1
for (let k = 1; k < ARC; k++) { const a = Math.PI / 2 + (k / ARC) * Math.PI; P(-WX + WR * Math.cos(a), WY + WR * Math.sin(a)) }
P(-WX, WY - WR); P(-SE, WY - WR)
const isArc = (i: number) => (i >= arcStart && i < arcStart + ARC) || (i >= arc2Start && i < arc2Start + ARC)

/** One bay: ground window (or door), arched window, two windows in the order. */
function bay(F: Face, s: number, w: number, o: { door?: boolean; orderW?: number } = {}) {
  if (o.door) {
    pier(trim, F, s - w * 0.5 - 0.35, s + w * 0.5 + 0.35, 0.8, 6.0, 0.12)
    fpanel(door, F, s - w * 0.5, s + w * 0.5, 0.8, 5.6, 0.16)
  } else fpanel(win, F, s - w * 0.4, s + w * 0.4, 3.0, 6.0, 0.06)
  farch(win, F, s, w, 6.9, 10.8, 0.06, 4)
  const ow = o.orderW ?? w
  if (ow <= 0) return
  fpanel(win, F, s - ow / 2, s + ow / 2, 12.95, 16.7, 0.06)
  fpanel(win, F, s - ow / 2, s + ow / 2, 17.6, 21.3, 0.06)
}
/** An Ionic pilaster in the order: shaft, a broad capital block. */
function pilaster(F: Face, s: number, w = 0.95, d = 0.45) {
  pier(trim, F, s - w / 2, s + w / 2, BASE, CAP - 0.5, d)
  pier(trim, F, s - w / 2 - 0.25, s + w / 2 + 0.25, CAP - 0.5, CAP, d + 0.15)
}
/** A face of one of the two inner courts (not photographed): windows only. */
const courtFace = (a: XY, b: XY) => {
  const mx = (a[0] + b[0]) / 2 - XC, my = (a[1] + b[1]) / 2, e = 1e-6
  return (Math.abs(a[1] - YRB) < e && Math.abs(b[1] - YRB) < e) || (Math.abs(a[1] - YCF) < e && Math.abs(b[1] - YCF) < e) ||
    (Math.abs(Math.abs(mx) - CONN) < e) || (Math.abs(Math.abs(mx) - SE) < e && my > WY + WR - e)
}
/** A proud block on a face: front, two sides and the top (its back and bottom hidden). */
function pier(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const n: V3 = [F.n[0], F.n[1], 0], t: V3 = [F.t[0], F.t[1], 0]
  qf(p, fp(F, s0, d, z0), fp(F, s1, d, z0), fp(F, s1, d, z1), fp(F, s0, d, z1), n)
  qf(p, fp(F, s0, 0, z0), fp(F, s0, d, z0), fp(F, s0, d, z1), fp(F, s0, 0, z1), [-t[0], -t[1], 0])
  qf(p, fp(F, s1, 0, z0), fp(F, s1, d, z0), fp(F, s1, d, z1), fp(F, s1, 0, z1), t)
  qf(p, fp(F, s0, 0, z1), fp(F, s1, 0, z1), fp(F, s1, d, z1), fp(F, s0, d, z1), [0, 0, 1])
}

// ─── Walls and facades, edge by edge ───
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  const F = faceOf(a, b)
  const recessed = Math.abs(a[1] - (YR - RECESS)) < 1e-6 && Math.abs(b[1] - (YR - RECESS)) < 1e-6
  fpanel(recessed ? shade : marble, F, 0, F.L, 0, TOP, 0)   // the wall behind the columns is in shadow
  if (F.L < 3) continue
  if (isArc(i)) {
    pilaster(F, 0, 0.8)
    bay(F, F.L / 2, 1.9, { door: i === arcStart + (ARC - 1) / 2 || i === arc2Start + (ARC - 1) / 2 })
    continue
  }
  const royal = Math.abs(a[1] - YR) < 1e-6 && Math.abs(b[1] - YR) < 1e-6 && Math.abs(a[0] - b[0]) > 15
  if (royal) {
    // a pavilion: three bays between four pilasters, a broad corner pier
    const outer = a[0] > XC                  // right-hand (east) pavilion runs from x = NW toward the centre
    const xs = [24.0, 19.8, 15.8, 11.4], wins = [21.9, 17.8, 13.6]
    const sOf = (x: number) => (outer ? NW - x : x - PAV) // s from the face's start
    for (const x of xs) pilaster(F, sOf(x), 1.25, 0.75)
    pier(trim, F, outer ? 0 : F.L - 1.6, outer ? 1.6 : F.L, BASE, CAP - 0.5, 0.75)
    for (const x of wins) { bay(F, sOf(x), 2.5); farch(trim, F, sOf(x), 3.1, 6.7, 11.1, 0.04, 4) }
    continue
  }
  if (Math.abs(a[1] - (YR - RECESS)) < 1e-6 && Math.abs(b[1] - (YR - RECESS)) < 1e-6) continue // the recessed centre: drawn below
  if (courtFace(a, b)) {
    const n = Math.max(1, Math.round(F.L / 4.2)), p = F.L / n
    for (let k = 0; k < n; k++) { const s = (k + 0.5) * p; fpanel(win, F, s - p * 0.22, s + p * 0.22, 3.0, 10.4, 0.06); fpanel(win, F, s - p * 0.22, s + p * 0.22, 12.95, 21.3, 0.06) }
    continue
  }
  const n = Math.max(1, Math.round(F.L / 4.2)), p = F.L / n
  for (let k = 0; k <= n; k++) pilaster(F, Math.min(F.L - 0.5, Math.max(0.5, k * p)), 0.9)
  for (let k = 0; k < n; k++) bay(F, (k + 0.5) * p, p * 0.5, { door: Math.abs(a[1] - YCH) < 1e-6 && Math.abs(b[1] - YCH) < 1e-6 && k === Math.floor(n / 2) })
}

// ─── The Royal centre: the base brought forward under the recess, doors, columns, cartouche ───
{
  const x0 = XC - PAV, x1 = XC + PAV, y = YR - RECESS
  block(marble, x0, y, x1, YR, 0, BASE)
  const F = faceOf([x1, YR], [x0, YR])     // facing +y; s runs from x1 toward x0
  const sOf = (x: number) => x1 - (XC + x)
  pier(marble, F, 0, F.L, 0, 1.0, 0.28); pier(marble, F, 0, F.L, 2.3, 2.7, 0.2); pier(marble, F, 0, F.L, 6.1, 6.6, 0.2)
  pier(trim, F, -0.5, F.L + 0.5, BASE - 1.0, BASE, 0.5)
  for (const x of [-6.3, 0, 6.3]) {
    pier(trim, F, sOf(x) - 1.55, sOf(x) + 1.55, 1.0, 5.9, 0.3)                 // the door surround
    fpanel(door, F, sOf(x) - 1.15, sOf(x) + 1.15, 1.0, 5.5, 0.33)
    farch(trim, F, sOf(x), 4.5, 6.2, 11.4, 0.04, 8)                            // the big arched windows
    farch(win, F, sOf(x), 3.8, 6.45, 11.05, 0.07, 8)
  }
  const C = faceOf([x1, y], [x0, y])
  for (const x of [-6.3, 0, 6.3]) {
    const s = x1 - (XC + x)
    fpanel(win, C, s - 1.65, s + 1.65, 12.95, 16.2, 0.06)
    fpanel(win, C, s - 1.65, s + 1.65, 17.0, 20.9, 0.06)
  }
  for (const x of [-9.1, -4.3, -2.6, 2.2, 3.9, 8.8].map((v) => v + 0.15)) {
    column(trim, XC + x, y + 1.05, 0.76, BASE, CAP - 0.75, { n: 12, base: 0.5, cap: 0.2, taper: 0.9 })
    block(trim, XC + x - 1.15, y + 0.05, XC + x + 1.15, y + 2.05, CAP - 0.75, CAP - 0.05) // the Ionic capital, volutes across the face
  }
  // the entablature carried on the columns
  block(trim, x0 + 0.3, y, x1 - 0.3, y + 2.15, CAP - 0.05, CAP + 0.75)
  // the carved cartouche over the centre
  const R = faceOf([x1, y + 0.3], [x0, y + 0.3]), sc = PAV
  const pts: XY[] = [[sc - 2.6, TOP], [sc + 2.6, TOP]]
  for (let k = 1; k < 8; k++) { const t = (k / 8) * Math.PI; pts.push([sc + 2.6 * Math.cos(t), TOP + 2.7 * Math.sin(t)]) }
  fprism(trim, R, pts, -0.6, 0.35, true)
  // the steps across the front
  steps(marble, faceOf([XC + 24.5, YR], [XC - 24.5, YR]), 0, 49, 0, 1.0, 0, 2.2, 4)
}

// ─── Bands, cornice, balustrade, roof ───

band(trim, ring, BASE - 1.0, BASE, 0.5)         // the balcony course
band(trim, ring, CAP, CAP + 0.7, 0.35)          // architrave
band(trim, ring, 23.6, TOP, 1.6)                // the heavy cornice
parapet(trim, ring, TOP, 27.2, 0.6)             // the balustrade, a solid band
band(marble, ring, 0, 1.0, 0.28)                // rusticated base: plinth and bold horizontal bands
band(marble, ring, 2.3, 2.7, 0.2)
band(marble, ring, 6.1, 6.6, 0.2)
capPoly(roof, ring, ROOF)
// end dies of the balustrade at the pavilions' corners
for (const [x, y] of [[-NW, YR], [NW, YR], [-PAV, YR], [PAV, YR], [-SE, YCH], [SE, YCH]] as XY[]) {
  const xa = XC + x - 0.75 * Math.sign(x), xb = XC + x + 0.05 * Math.sign(x), ya = y - 0.75 * Math.sign(y), yb = y + 0.05 * Math.sign(y)
  block(trim, Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb), TOP, 27.6)
}
// the rooftop penthouse over the connector
block(marble, XC - 2.2, 8.0, XC + 4.8, 14.5, ROOF - 0.1, 31.5)
block(roof, XC - 2.4, 7.8, XC + 5.0, 14.7, 31.5, 31.8)

finishModel('Louisiana Supreme Court Building', 'nola-louisiana-supreme-court', [
  { part: marble, material: { ...finish('court-marble', 0xeee8dc), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.75) } },
  { part: trim, material: { ...finish('court-trim', 0xf8f4ea), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.75) } },
  { part: roof, material: finish('court-roof', 0xb9bcbc) },
  { part: shade, material: { ...finish('court-marble-shade', 0xcfc6b5), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.6) } },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, name: 'entrance', color: 0x6e5242 } },
], { bearing: 307.5, osm: 'way/208550740', height: 31.8 }, 6500)
