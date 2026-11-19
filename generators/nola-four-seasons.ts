/**
 * Four Seasons Hotel New Orleans (former International Trade Mart / World
 * Trade Center, 2 Canal Street; 1967, Edward Durell Stone; converted
 * 2019-2021) — original procedural geometry, CC0-1.0.
 * bun generators/nola-four-seasons.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/114423781,
 * 29.9489560, -90.0635324. The arms run north-south and east-west (OSM edge
 * bearings within ~1° of the axes), so the catalog bearing is 0.
 *
 * Identity, in order: the cross plan, four tapered arms meeting in rounded
 * re-entrant corners (the "V" every street view shows); pale stone faces
 * with close vertical window slots; the white hat-brim cap overhanging all
 * round with the dark band of close fins under it; the round 12-sided drum
 * (the old revolving bar, now Vue Orleans) rising over the crossing with
 * its glazed band, and the small top drum; the deck at the second floor
 * standing out round the base over the recessed lobby.
 *
 * Evidence:
 *  - plan: OSM outline way/114423781, made symmetric: arms end 33.6 m out,
 *    16.6 m wide at the end, tapering to ~22 m at the root; re-entrant
 *    corners rounded (radius ~4.5 m) as the outline and the photos show
 *    (measured from the OSM nodes, ±0.5 m between arms).
 *  - heights: USGS 3DEP lidar LA_2021GNO_1_C22 (flown 2021-22), read with
 *    tools/lidar_frame.py; street ≈ 0.5 m above ground_min, taken as
 *    y = 0. Brim eave 109.2 m, brim top 114.3 m, drum roof 122.5 m (r ≈
 *    18.7 m, matching the OSM part way/328824753), top drum 126.9 m
 *    (r ≈ 9.5 m), mast to ~130 m (left out); base deck 7.0 m reaching
 *    ~3 m past the shaft; south-west motor-court roof 6.6 m (OSM
 *    way/1173588235) (all measured). Published 407 ft = 124 m to the top,
 *    33 floors (Wikipedia).
 *  - brim: overhang 3.4 m (lidar edge vs OSM wall); the flared soffit and
 *    the dark fin band (top ~2 floors) from ajay_suresh's 2026 photo and
 *    Infrogmation's 2025/2026 photos (estimated proportions).
 *  - slots: one per 2.3 m bay, 0.9 m wide (~40%, the photos' ratio); 7 on
 *    an arm end, 9-10 on an arm side (counted on ajay_suresh 2026, ±1),
 *    grouped three floors to a panel with a stone spandrel (STYLE: no
 *    full-height dark stripes).
 *  - colours: pale neutral grey stone (all photos, pulled to palette
 *    lightness); slots dark blue-grey glass (`window`, lit: a hotel); fin
 *    band and lobby glazing darker (`window-2`).
 *
 * Photos (EVIDENCE):
 *  - Four Seasons Hotel and Private Residences New Orleans (55151701096).jpg,
 *    ajay_suresh, CC BY 4.0 (from Canal Street, north-west)
 *    https://commons.wikimedia.org/wiki/File:Four_Seasons_Hotel_and_Private_Residences_New_Orleans_(55151701096).jpg
 *  - Head of Canal Street, New Orleans, 30 January 2025 - ITM.jpg,
 *    Infrogmation, CC BY-SA 4.0 (the base)
 *    https://commons.wikimedia.org/wiki/File:Head_of_Canal_Street,_New_Orleans,_30_January_2025_-_ITM.jpg
 *  - Head of Canal Street, New Orleans May 2026 - ITC building and Riverwalk
 *    entrance.jpg, Infrogmation, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Head_of_Canal_Street,_New_Orleans_May_2026_-_ITC_building_and_Riverwalk_entrance.jpg
 *  - 2 Canal Street - World Trade Center of New Orleans (27863263046).jpg,
 *    Tony Webster, CC BY-SA 2.0 (2016, before the conversion; form only)
 *    https://commons.wikimedia.org/wiki/File:2_Canal_Street_-_World_Trade_Center_of_New_Orleans_(27863263046).jpg
 *  - Mississippi river view New Orleans July 2023.jpg, Daquella manera, CC0
 *    (from the river)
 *    https://commons.wikimedia.org/wiki/File:Mississippi_river_view_New_Orleans_July_2023.jpg
 * Look-only: none used. No commercial imagery.
 *
 * Ground: the levee and floodwall are east of the site; the ground under
 * the tower is flat (lidar). elevation 0.
 *
 * Doubts: the river (east) and south faces are only seen from afar; drawn
 * like the Canal Street faces (the building is symmetric). The 20 m block
 * against the east arm (Vue Orleans / Riverwalk entrance, not part of the
 * OSM outline) and a 4.8 m canopy north of the north arm are left to the
 * map. The white louvre panels in some lower slots are left out.
 *
 * Left out: the mast, the brim's fascia detail, the deck railing.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, walls, cap, inset, circle, onWall, panel, area, turn, save } from './chi-aon-center'

const R = 33.6, A = 8.3 // arm end distance, half-width at the end
const TAPER = 0.168 // widening per metre toward the centre
const FIL = 4.5 // re-entrant fillet
const DECK0 = 6.4, DECK = 7.0, SHAFT1 = 105.0, SOFF = 107.4, EAVE = 109.2, CAPZ = 114.3
const DRUM = 122.5, TOPD = 126.9, OV = 3.4

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

function crossPlan(): XY[] {
  const t = (A + TAPER * R) / (1 + TAPER), C: XY = [t, t]
  const P1: XY = [R, A], P2: XY = [A, R]
  const toward = (p: XY, d: number): XY => { const l = Math.hypot(p[0] - C[0], p[1] - C[1]); return [C[0] + (p[0] - C[0]) * d / l, C[1] + (p[1] - C[1]) * d / l] }
  const a = toward(P1, FIL), b = toward(P2, FIL), fil: XY[] = []
  for (let i = 0; i <= 4; i++) {
    const u = i / 4, w0 = (1 - u) ** 2, w1 = 2 * u * (1 - u), w2 = u * u
    fil.push([a[0] * w0 + C[0] * w1 + b[0] * w2, a[1] * w0 + C[1] * w1 + b[1] * w2])
  }
  const quad: XY[] = [[R, -A], [R, A], ...fil]
  return [0, 90, 180, 270].flatMap(d => turn(quad, d))
}

function build() {
  const stone = new Part(), win = new Part(), dark = new Part(), roof = new Part(), white = new Part()
  const plan = ccw(crossPlan())

  // ---- Lobby: recessed dark glazing under the deck.
  walls(dark, inset(plan, 1.5), 0, DECK0)
  // Deck slab standing ~3 m out.
  const deck = inset(plan, -3.0)
  walls(white, deck, DECK0, DECK)
  cap(white, deck, DECK0, false)
  cap(stone, deck, DECK)
  // a few columns under the deck at the arm ends
  for (const d of [0, 90, 180, 270]) for (const y of [-6, 0, 6]) {
    const c = turn([[R + 2.3, y]], d)[0]
    walls(white, circle(c[0], c[1], 0.35, 6), 0, DECK0)
  }

  // ---- Shaft.
  walls(stone, plan, DECK, SHAFT1)
  const groups: [number, number][] = []
  const g0 = DECK + 1.6, g1 = 96.2, n = 10, gh = (g1 - g0) / n
  for (let i = 0; i < n; i++) groups.push([g0 + i * gh + 0.4, g0 + (i + 1) * gh - 0.4])
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const k = Math.max(1, Math.round((L - 1.2) / 2.3)), bay = (L - 1.2) / k
    for (let q = 0; q < k; q++) {
      const c = 0.6 + (q + 0.5) * bay
      for (const [z0, z1] of groups) panel(win, a, b, c - 0.45, c + 0.45, z0, z1, 0.05)
    }
    // the dark fin band under the brim
    const kf = Math.max(1, Math.round(L / 1.5)), fb = L / kf
    for (let q = 0; q < kf; q++) panel(dark, a, b, q * fb + 0.28, (q + 1) * fb - 0.28, 97.4, SHAFT1 - 0.3, 0.05)
  }

  // ---- Brim: flared soffit, fascia, sloping top to the cap.
  const prof: [number, number][] = [[0, SHAFT1], [1.4, 105.9], [2.6, 106.7], [OV, SOFF]]
  for (let i = 0; i < prof.length - 1; i++) walls(white, inset(plan, -prof[i][0]), prof[i][1], prof[i + 1][1], inset(plan, -prof[i + 1][0]))
  const edge = inset(plan, -OV)
  walls(white, edge, SOFF, EAVE)
  const inner = inset(plan, -0.4)
  walls(white, edge, EAVE, CAPZ, inner)
  cap(roof, inner, CAPZ)

  // ---- Drum (r 18.7) with its glazed band, and the top drum.
  const drum = circle(0, 0, 18.7, 12, Math.PI / 12)
  walls(stone, drum, CAPZ - 0.3, DRUM - 1.4)
  const rim = circle(0, 0, 19.3, 12, Math.PI / 12)
  cap(white, rim, DRUM - 1.4, false)
  walls(white, rim, DRUM - 1.4, DRUM)
  cap(roof, rim, DRUM)
  for (let i = 0; i < 12; i++) {
    const a = drum[i], b = drum[(i + 1) % 12], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(win, a, b, 0.5, L / 2 - 0.25, CAPZ + 1.3, DRUM - 2.0, 0.05)
    panel(win, a, b, L / 2 + 0.25, L - 0.5, CAPZ + 1.3, DRUM - 2.0, 0.05)
  }
  const top = circle(0, 0, 9.5, 12, Math.PI / 12)
  walls(white, top, DRUM, TOPD - 0.4)
  const ti = inset(top, 0.4)
  walls(white, top, TOPD - 0.4, TOPD, ti)
  cap(roof, ti, TOPD)

  // ---- South-west motor-court roof (OSM way/1173588235), on posts.
  const mc = ccw([[-7.42, -32.21], [-15.25, -33.68], [-23.19, -26.7], [-31.58, -18.92], [-31.45, -17.68], [-30.62, -9.83], [-16.9, -11.67], [-13.88, -13.5], [-11.12, -16.36]])
  walls(white, mc, 5.9, 6.6)
  cap(white, mc, 5.9, false)
  cap(roof, mc, 6.6)
  for (const [x, y] of [[-14, -30.5], [-22, -25], [-28.5, -19], [-28.5, -12.5]] as XY[]) walls(white, circle(x, y, 0.3, 6), 0, 5.9)

  return [
    { part: stone, material: finish('fs-stone', 0xe4e2dd) },
    { part: win, material: PALETTE.window },
    { part: dark, material: windowVariant(2, 0x4f5f6e) },
    { part: roof, material: PALETTE.roof },
    { part: white, material: finish('fs-white', 0xf3f2ee) },
  ]
}

if (import.meta.main) await save('nola-four-seasons', 'Four Seasons Hotel New Orleans', [29.948956, -90.0635324], 0, build(), 6500)
