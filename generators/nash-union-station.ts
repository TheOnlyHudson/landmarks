/**
 * Union Station, Nashville (1898–1900, Richard Montfort for the Louisville
 * & Nashville Railroad; now the Union Station Hotel) — original procedural
 * geometry, CC0-1.0. The train shed (demolished 2001) is not modelled; the
 * head house is.
 * bun generators/nash-union-station.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * points out of the Broadway front (north-north-west) and +x runs toward
 * the east parking lot (the hotel entrance side). Anchor = area centroid of
 * OSM way/130905896, 36.157208, -86.784758. The façade axis (both towers,
 * the porte-cochère) is x = -2.4. y = 0 is the lowest ground under the
 * footprint: the track-level moat round the building (lidar ground_min +
 * 0.7 m). Broadway and the east parking lot are 7.3 m higher (STREET).
 *
 * Identity, in order: the tall square clock tower centred on the Broadway
 * front, with round corner piers, a belfry of three tall round-arched
 * openings, the clock stage, a corbelled attic, a steep slate pyramid with
 * corner turrets and Mercury on top; the grey rough-faced limestone block
 * of four storeys over a track-level basement; the steep slate roofs with
 * pyramidal corner pavilions, big gable walls on the long sides and small
 * gables flanking the tower; the rear ventilation tower with its open
 * arched top and central stack; the low arcaded porte-cochère on Broadway;
 * street-floor arcades of big round arches, paired windows above, a row of
 * paired round-headed windows under the cornice.
 *
 * Evidence:
 *  - plan: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight), 0.5 m grid,
 *    read in the model frame: head house x -26.3..21.5, y -17.4..27.5
 *    (48 x 45 m); clock tower ~8 m square on the front; rear tower 8 m
 *    square on the rear wall; porte-cochère x -12.2..6.3 (drawn ±9.3 about
 *    the axis), y 27.5..39; east canopy x ~26..34, y -16..12; rear covered
 *    concourse y -25..-17.4. OSM way/130905896 includes the canopy and the
 *    concourse, so both are drawn. OSM's head-house outline is ~2 m
 *    narrower (x -27.9..17.9); the lidar edges are used (the building has
 *    not changed since 1900; NAIP is too leaning to settle it).
 *  - heights (lidar, above y = 0): eave cornice 26.6; flat roof deck
 *    32.8; central ridge 36.3; corner pavilion peaks and side gables ~37.5;
 *    clock tower corner turrets ~59.5–60.4, pyramid apex 64.9, Mercury to
 *    67.7 (lidar max); rear tower walls 47.0, corner piers 49.6, stack 54.7;
 *    porte-cochère top 14.8–15.5; canopy and concourse roofs 12.2–13.7.
 *    Measured.
 *  - façade bays, storey bands, gable and tower stages: from LeMay's
 *    square-on view of the front (54384519813), scaled by the lidar width
 *    (18.5 px/m at the wall) and fitted to the lidar eave and apex
 *    heights; side bays (seven at 5.97 m) from Rivera's east-face view.
 *    Estimated.
 *  - colours: grey limestone (sampled #bab6a1 in sun, pulled light), paler
 *    dressings, dark blue-grey slate (#2f3a40, pulled light), bronze
 *    Mercury.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Nashville Union Station, Broadway and 10th Avenue, Nashville, TN
 *    (54384519813) and the rest of the same set, Warren LeMay, CC BY-SA
 *    2.0 (front square on; tower; porte-cochère; several corners)
 *    https://commons.wikimedia.org/wiki/File:Nashville_Union_Station,_Broadway_and_10th_Avenue,_Nashville,_TN_(54384519813).jpg
 *  - Union Station Hotel (North face), (Northeast corner), (East face),
 *    (from Holiday Inn Express), Michael Rivera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Union_Station_Hotel_(Northeast_corner).JPG
 *    https://commons.wikimedia.org/wiki/File:Union_Station_Hotel_(East_face).JPG
 *  - Union Station & Grand Hyatt.jpg, Benjamin899, CC BY-SA 4.0 (the
 *    track side and the rear tower)
 *    https://commons.wikimedia.org/wiki/File:Union_Station_%26_Grand_Hyatt.jpg
 *  - HABS TENN,19-NASH,19-1, -2, -3 (north side and west front; west
 *    front; west front and south side), public domain
 *    https://commons.wikimedia.org/wiki/File:West_front_-_Union_Station,_1001_Broadway,_Nashville,_Davidson_County,_TN_HABS_TENN,19-NASH,19-2.tif
 *  - Union Station - Clock Tower at Night.jpg, Blake Wylie, CC BY-SA 3.0
 *    (night) https://commons.wikimedia.org/wiki/File:Union_Station_-_Clock_Tower_at_Night.jpg
 *  - USGS NAIP (public domain): plan check only.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the porte-cochère and hotel doors are `entrance`;
 * the clock tower is floodlit (as in the night photo), the Broadway front
 * and the porte-cochère less so; the belfry openings stay dark.
 *
 * Left out: rustication, carving, colonnettes in the belfry, the "UNION
 * STATION" lettering on the porte-cochère, balustrades and railings
 * (drawn as solid caps), the moat's balustrade, flag poles, the iron
 * brackets of the canopies, the clock hands beyond a simple bar.
 *
 * Doubts: the rear (track) face is seen only from far off and obliquely
 * and is drawn like the front with the rear tower; the gable walls are
 * simplified to one window scheme; Mercury is a plain figure; the stage
 * heights of the clock tower are photo-fitted between lidar eave and apex.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, box, save, type XY } from './atl-westin-peachtree-plaza'
import { opening, shape, rectOn, band, prismV, quadH, triH, block, type Face } from './nash-ryman-auditorium'
import { wf, rect, taper, shaft, lathe, type Side } from './nash-downtown-presbyterian'

// ── Plan and heights (model frame, bearing 332; z above y = 0 = lidar ground_min + 0.7) ──
const C = -2.4 // the façade axis: the tower, the porte-cochère and the rear tower
const X0 = -26.3, X1 = 21.5, Y0 = -17.4, Y1 = 27.5, YC = (Y0 + Y1) / 2
const STREET = 7.3 // Broadway and the east parking lot; the moat and the tracks are at 0
const EAVE = 26.6, DECK = 32.8
const FRONT_BAYS = [-20.6, -15.8, -10.9, -6.0, 6.0, 10.9, 15.8, 20.6] // offsets from C
const SIDE_BAYS = [-3, -2, -1, 0, 1, 2, 3].map((k) => YC + k * 5.97)

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part(), metal = new Part()

  /** A round-headed window with a pale voussoir ring. */
  const arch = (f: Face, s: number, w: number, z0: number, zs: number, ring = 0.35, seg = 8, glass: Part = win) => {
    shape(trim, f, opening(s, w + 2 * ring, z0 - 0.15, zs, 'round', seg), 0.04)
    shape(glass, f, opening(s, w, z0, zs, 'round', seg), 0.08)
  }
  const flat = (f: Face, s0: number, s1: number, z0: number, z1: number, sur = 0.18) => {
    rectOn(trim, f, s0 - sur, s1 + sur, z0 - sur, z1 + sur, 0.04)
    rectOn(win, f, s0, s1, z0, z1, 0.08)
  }

  // ── The head house ──
  prism(stone, rect(X0 - 0.2, Y0 - 0.2, X1 + 0.2, Y1 + 0.2), 0, STREET, stone, 0.05)
  prism(stone, rect(X0, Y0, X1, Y1), STREET, EAVE - 1.0, stone, 0.01)
  block(trim, X0 - 0.45, X1 + 0.45, Y0 - 0.45, Y1 + 0.45, EAVE - 1.0, EAVE)
  // the hipped slate roof to a flat deck
  const eaveRing = rect(X0 - 0.45, Y0 - 0.45, X1 + 0.45, Y1 + 0.45)
  taper(slate, eaveRing, rect(X0 + 5.5, Y0 + 5.5, X1 - 5.5, Y1 - 5.5), EAVE, DECK)
  // the central ridge over the lobby, from tower to tower
  prismV(slate, [[C - 3.6, DECK - 0.1], [C + 3.6, DECK - 0.1], [C, 36.3]], [1, 0], [0, 0], Y0 + 8, Y1 - 7.8)

  const faces: Record<Side, { f: Face; s: (u: number) => number }> = {
    N: wf('N', Y1, X0, X1), S: wf('S', Y0, X0, X1), E: wf('E', X1, Y0, Y1), W: wf('W', X0, Y0, Y1),
  }
  // string courses: the water table at the street, over the arcade, over the second floor, the corbel band
  for (const d of ['N', 'S', 'E', 'W'] as Side[]) {
    const { f } = faces[d]
    band(trim, f, 0, f.L, STREET - 0.35, STREET, 0.12)
    band(trim, f, 0, f.L, 15.0, 15.4, 0.12)
    band(trim, f, 0, f.L, 20.6, 20.9, 0.1)
    band(trim, f, 0, f.L, 24.9, 25.6, 0.22)
  }

  // windows, bay by bay
  const PC = 9.3 // half-width of the porte-cochère
  for (const d of ['N', 'S', 'E', 'W'] as Side[]) {
    const { f, s } = faces[d]
    const bays = d === 'N' || d === 'S' ? FRONT_BAYS.map((o) => C + o) : SIDE_BAYS
    for (const u of bays) {
      const sc = s(u)
      const coveredN = d === 'N' && Math.abs(u - C) < PC + 2.5
      const towerS = d === 'S' && Math.abs(u - C) < 4.5
      // the lower storey (in the moat and on the track side)
      if (!coveredN) rectOn(win, f, sc - 0.9, sc + 0.9, 1.4, 5.0, 0.08)
      // the street-floor arcade
      if (!coveredN && !(d === 'E' && Math.abs(u - (YC - 6.5)) < 1)) arch(f, sc, d === 'N' || d === 'S' ? 3.6 : 3.8, STREET + 0.4, 12.1, 0.45, 8)
      // second floor: paired tall windows
      if (!towerS) for (const k of [-0.75, 0.75]) flat(f, sc + k - 0.55, sc + k + 0.55, 15.9, 20.0, 0.12)
      // third floor: paired round-headed windows
      if (!(towerS || (d === 'N' && Math.abs(u - C) < 4.5))) {
        rectOn(trim, f, sc - 1.45, sc + 1.45, 21.8, 24.65, 0.04)
        for (const k of [-0.7, 0.7]) shape(win, f, opening(sc + k, 1.0, 22.0, 23.9, 'round', 4), 0.08)
      }
    }
  }
  // the hotel entrance on the east side, under the canopy: a pedimented doorway
  {
    const { f, s } = faces.E
    const sc = s(YC - 6.5)
    rectOn(trim, f, sc - 2.6, sc + 2.6, STREET, 12.0, 0.05)
    rectOn(door, f, sc - 1.9, sc + 1.9, STREET, 10.6, 0.1)
    rectOn(win, f, sc - 1.9, sc + 1.9, 10.8, 11.7, 0.1)
  }

  // ── Gables ──
  /** A gable wall on the plane of a façade, with a short gable roof running back into the slate. */
  const gable = (d: Side, u: number, hw: number, ztop: number, depth: number, turrets: boolean) => {
    const za = EAVE - 1.2, zs = EAVE + 1.4
    const prof: XY[] = [[u - hw, za], [u + hw, za], [u + hw, zs], [u, ztop], [u - hw, zs]]
    const roof: XY[] = [[u - hw - 0.35, zs - 0.2], [u + hw + 0.35, zs - 0.2], [u, ztop - 0.25]]
    if (d === 'N' || d === 'S') {
      const yw = d === 'N' ? Y1 : Y0, o = d === 'N' ? 1 : -1
      prismV(stone, prof, [1, 0], [0, 0], Math.min(yw - o * 0.8, yw + o * 0.2), Math.max(yw - o * 0.8, yw + o * 0.2))
      prismV(slate, roof, [1, 0], [0, 0], Math.min(yw - o * depth, yw - o * 0.75), Math.max(yw - o * depth, yw - o * 0.75), slate)
    } else {
      const xw = d === 'E' ? X1 : X0, o = d === 'E' ? 1 : -1
      // axis +y: u runs along y and w along -x
      prismV(stone, prof, [0, 1], [0, 0], Math.min(-(xw + o * 0.2), -(xw - o * 0.8)), Math.max(-(xw + o * 0.2), -(xw - o * 0.8)))
      prismV(slate, roof, [0, 1], [0, 0], Math.min(-(xw - o * depth), -(xw - o * 0.75)), Math.max(-(xw - o * depth), -(xw - o * 0.75)), slate)
    }
    const { f, s } = d === 'N' ? wf('N', Y1 + 0.2, X0, X1) : d === 'S' ? wf('S', Y0 - 0.2, X0, X1) : d === 'E' ? wf('E', X1 + 0.2, Y0, Y1) : wf('W', X0 - 0.2, Y0, Y1)
    const sc = s(u)
    const n = hw > 4 ? 3 : 3, sp = hw > 4 ? 1.5 : 1.15
    for (let i = 0; i < n; i++) arch(f, sc + (i - 1) * sp, hw > 4 ? 1.1 : 0.8, EAVE + 0.4, EAVE + 2.6, 0.18, 4)
    if (hw > 4) arch(f, sc, 0.9, EAVE + 4.6, EAVE + 6.0, 0.18, 6)
    if (turrets) for (const k of [-1, 1]) {
      const p = f.P(sc + k * (hw + 0.1), 0, -0.25)
      block(stone, p[0] - 0.5, p[0] + 0.5, p[1] - 0.5, p[1] + 0.5, EAVE - 3.5, zs + 3.6)
      taper(trim, rect(p[0] - 0.6, p[1] - 0.6, p[0] + 0.6, p[1] + 0.6), rect(p[0] - 0.05, p[1] - 0.05, p[0] + 0.05, p[1] + 0.05), zs + 3.6, zs + 5.0)
    }
  }
  // the corner pavilions: steep pyramidal roofs, a big gable wall on the long side of each
  for (const d of ['E', 'W'] as Side[]) {
    const xw = d === 'E' ? X1 : X0, o = d === 'E' ? 1 : -1
    for (const fy of [1, -1]) {
      const yw = fy > 0 ? Y1 : Y0, ze = EAVE
      const xo = xw + o * 0.45, xi = xw - o * 16, yo = yw + fy * 0.45, yi = yw - fy * 15
      const A: V3 = [xw - o * 9.5, yw - fy * 7.5, 37.5]
      const c = [[xo, yo], [xi, yo], [xi, yi], [xo, yi]] as XY[]
      for (let i = 0; i < 4; i++) {
        const p = c[i], q = c[(i + 1) % 4]
        const mx = (p[0] + q[0]) / 2 - A[0], my = (p[1] + q[1]) / 2 - A[1]
        triH(slate, [p[0], p[1], ze], [q[0], q[1], ze], A, [mx, my, 4])
      }
      gable(d, fy > 0 ? YC + 14.35 : YC - 14.35, 6.0, 37.4, 2.5, true)
    }
    gable(d, YC + 0.5, 4.0, 36.0, 6.5, false)
  }
  // the small gables on the front and rear, either side of the towers
  for (const d of ['N', 'S'] as Side[]) for (const k of [-1, 1]) gable(d, C + k * 15.8, 2.45, 36.2, 6.5, true)
  // dormers in the front and rear slopes
  for (const d of ['N', 'S'] as Side[]) for (const k of [-1, 1]) {
    const x = C + k * 8.4, y = d === 'N' ? Y1 - 2.2 : Y0 + 2.2
    block(stone, x - 0.8, x + 0.8, y - 0.7, y + 0.7, EAVE, EAVE + 2.2)
    prismV(slate, [[x - 1.0, EAVE + 2.1], [x + 1.0, EAVE + 2.1], [x, EAVE + 3.1]], [1, 0], [0, 0], y - 0.9, y + 0.9)
    const { f } = wf(d, d === 'N' ? y + 0.7 : y - 0.7, x - 0.8, x + 0.8)
    rectOn(win, f, 0.35, 1.25, EAVE + 0.4, EAVE + 1.8, 0.05)
  }
  // chimneys
  for (const [x, y, top] of [[C - 19.3, Y1 - 3.5, 36.6], [C + 19.3, Y1 - 3.5, 36.6], [X1 - 1.6, YC + 7.5, 38.2], [X0 + 1.6, YC + 7.5, 38.2]] as [number, number, number][]) {
    box(stone, x - 0.75, x + 0.75, y - 0.75, y + 0.75, EAVE - 1, top, stone, 0.08)
    block(trim, x - 0.95, x + 0.95, y - 0.95, y + 0.95, top - 0.6, top)
  }

  // ── The clock tower ──
  {
    const h = 4.0, cy = Y1 - h, T0 = EAVE - 1.2
    const B0 = 39.3, B1 = 48.4, K1 = 56.6, A1 = 58.3, R0 = 58.7, APEX = 64.9
    const sq = (k: number) => rect(C - h - k, cy - h - k, C + h + k, cy + h + k)
    prism(stone, sq(0), T0, B0, stone, 0.01)
    block(trim, C - h - 0.25, C + h + 0.25, cy - h - 0.25, cy + h + 0.25, B0, B0 + 0.55)
    prism(stone, sq(-0.1), B0 + 0.55, B1, stone, 0.01)
    block(trim, C - h - 0.2, C + h + 0.2, cy - h - 0.2, cy + h + 0.2, B1, B1 + 0.5)
    prism(stone, sq(-0.1), B1 + 0.5, K1, stone, 0.01)
    block(trim, C - h - 0.3, C + h + 0.3, cy - h - 0.3, cy + h + 0.3, K1, K1 + 0.55)
    prism(stone, sq(-0.15), K1 + 0.55, A1, stone, 0.01)
    block(trim, C - h - 0.35, C + h + 0.35, cy - h - 0.35, cy + h + 0.35, A1, R0)
    taper(slate, sq(0.3), sq(-h + 0.12), R0, APEX)
    // the round corner piers, the full height of the shaft, ending in turrets with conical caps
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x = C + sx * (h - 0.5), y = cy + sy * (h - 0.5)
      shaft(stone, x, y, 0.62, 0.62, T0 + 1, R0 + 0.6, 8)
      lathe(trim, x, y, [[0.72, R0 + 0.6], [0.72, R0 + 1.0], [0.05, R0 + 2.4]], 8)
    }
    // the faces
    for (const [d, c, lo, hi] of [['N', cy + h, C - h, C + h], ['S', cy - h, C - h, C + h], ['E', C + h, cy - h, cy + h], ['W', C - h, cy - h, cy + h]] as [Side, number, number, number][]) {
      const { f } = wf(d, c, lo, hi)
      const m = f.L / 2
      // slit windows in the shaft
      for (const z of [33.0]) rectOn(win, f, m - 0.25, m + 0.25, z, z + 1.6, 0.06)
      // the belfry: three tall round-headed openings
      for (const k of [-1.75, 0, 1.75]) arch(f, m + k, 1.25, B0 + 1.0, B1 - 1.4, 0.18, 8, slate)
      // the clock in its arched frame
      const ring = (r: number, z: number): XY[] => Array.from({ length: 14 }, (_, i) => [m + r * Math.cos((i / 14) * Math.PI * 2), z + r * Math.sin((i / 14) * Math.PI * 2)])
      shape(stone, f, opening(m, 4.4, B1 + 1.0, 53.6, 'round', 10), 0.04)
      shape(trim, f, ring(1.35, 53.4), 0.09)
      rectOn(slate, f, m - 0.08, m + 0.08, 53.4, 54.4, 0.12)
      rectOn(slate, f, m - 0.08, m + 0.7, 53.32, 53.48, 0.12)
      // the attic's row of small openings
      for (const k of [-2.1, -0.7, 0.7, 2.1]) rectOn(win, f, m + k - 0.3, m + k + 0.3, K1 + 0.8, A1 - 0.25, 0.06)
    }
    // Mercury on the apex: a bronze figure on a short post (plain)
    lathe(metal, C, cy, [[0.12, APEX - 0.4], [0.12, APEX + 0.6], [0.35, APEX + 0.7], [0.35, APEX + 0.9]], 8)
    lathe(metal, C, cy, [[0.3, APEX + 0.9], [0.34, APEX + 1.9], [0.22, APEX + 2.4], [0.16, APEX + 2.5]], 6)
    block(metal, C + 0.1, C + 0.32, cy - 0.11, cy + 0.11, APEX + 2.0, APEX + 2.8) // the raised arm
    lathe(metal, C, cy, [[0.17, APEX + 2.45], [0.17, APEX + 2.7], [0.02, APEX + 2.8]], 6)
  }

  // ── The rear tower (a ventilation tower: open arched top, a stack in the middle) ──
  {
    const h = 4.0, cy = Y0 + h, T0 = EAVE - 1.2, W1 = 44.0, W2 = 47.0
    prism(stone, rect(C - h, cy - h, C + h, cy + h), T0, W1, stone, 0.01)
    block(trim, C - h - 0.25, C + h + 0.25, cy - h - 0.25, cy + h + 0.25, W1, W1 + 0.5)
    prism(stone, rect(C - h + 0.1, cy - h + 0.1, C + h - 0.1, cy + h - 0.1), W1 + 0.5, W2, stone, 0.01)
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x = C + sx * (h - 0.7), y = cy + sy * (h - 0.7)
      box(stone, x - 0.7, x + 0.7, y - 0.7, y + 0.7, W2 - 0.5, 49.0, stone, 0.08)
      taper(trim, rect(x - 0.8, y - 0.8, x + 0.8, y + 0.8), rect(x - 0.1, y - 0.1, x + 0.1, y + 0.1), 49.0, 49.9)
    }
    box(stone, C - 1.3, C + 1.3, cy - 1.3, cy + 1.3, W2 - 0.5, 54.0, stone, 0.1)
    block(trim, C - 1.55, C + 1.55, cy - 1.55, cy + 1.55, 54.0, 54.7)
    for (const [d, c, lo, hi] of [['N', cy + h - 0.1, C - h, C + h], ['S', cy - h + 0.1, C - h, C + h], ['E', C + h - 0.1, cy - h, cy + h], ['W', C - h + 0.1, cy - h, cy + h]] as [Side, number, number, number][]) {
      const { f } = wf(d, c, lo, hi)
      const m = f.L / 2
      arch(f, m, 3.6, W1 + 0.6, W2 - 1.9, 0.25, 10, slate) // the open arch at the top
      for (const k of [-1.3, 0, 1.3]) arch(f, m + k, 0.8, 37.5, 41.3, 0.15, 6)
      for (const k of [-0.65, 0.65]) arch(f, m + k, 0.8, 30.0, 32.4, 0.15, 6)
    }
    for (const [d, c, lo, hi] of [['N', cy + 1.3, C - 1.3, C + 1.3], ['S', cy - 1.3, C - 1.3, C + 1.3], ['E', C + 1.3, cy - 1.3, cy + 1.3], ['W', C - 1.3, cy - 1.3, cy + 1.3]] as [Side, number, number, number][]) {
      const { f } = wf(d, c, lo, hi)
      arch(f, 1.3, 1.1, 50.6, 52.6, 0.15, 6, slate)
    }
  }

  // ── The porte-cochère on Broadway, bridging the moat ──
  {
    const x0 = C - PC, x1 = C + PC, y0 = Y1, y1 = 39.0, TOP = 14.6
    prism(stone, rect(x0, y0 - 0.5, x1, y1), 0, TOP - 0.6, stone, 0.01)
    block(trim, x0 - 0.3, x1 + 0.3, y0 - 0.5, y1 + 0.3, TOP - 0.6, TOP)
    block(trim, x0 - 0.05, x1 + 0.05, y0 - 0.5, y1 + 0.05, TOP, TOP + 0.75)
    band(trim, wf('N', y1, x0, x1).f, 0, 2 * PC, STREET - 0.35, STREET, 0.12)
    const N = wf('N', y1, x0, x1)
    // three arches on Broadway: a wide one in the middle
    for (const [k, w, zs] of [[-5.8, 2.9, 9.7], [0, 4.4, 9.5], [5.8, 2.9, 9.7]] as [number, number, number][]) {
      arch(N.f, N.s(C + k), w, STREET, zs, 0.55, 8)
      if (k === 0) rectOn(door, N.f, N.s(C) - 1.8, N.s(C) + 1.8, STREET, 9.4, 0.1)
    }
    band(trim, N.f, 1.6, 2 * PC - 1.6, 12.3, 12.8, 0.1) // the band carrying the lettering
    for (const d of ['E', 'W'] as Side[]) {
      const { f, s } = wf(d, d === 'E' ? x1 : x0, y0, y1)
      for (const y of [y0 + 3.0, y0 + 8.3]) arch(f, s(y), 3.4, STREET, 10.0, 0.5, 8)
      band(trim, f, 0, f.L, STREET - 0.35, STREET, 0.12)
    }
    // round turret piers at the outer corners, with ball caps
    for (const k of [-1, 1]) {
      const x = C + k * (PC - 0.55), y = y1 - 0.55
      shaft(stone, x, y, 0.65, 0.65, 0, TOP + 0.6, 8)
      lathe(trim, x, y, [[0.8, TOP + 0.6], [0.8, TOP + 1.0], [0.55, TOP + 1.4], [0.05, TOP + 2.0]], 8)
    }
  }

  // ── The drop-off canopy on the east side ──
  {
    const xa = X1 + 0.6, xb = 34.0, ya = -16.0, yb = 12.0, ze = 12.2, zr = 13.7
    prismV(slate, [[xa, ze], [xb, ze], [xb, ze + 0.35], [(xa + xb) / 2, zr], [xa, ze + 0.35]], [1, 0], [0, 0], ya, yb, slate)
    for (let y = ya + 1; y <= yb - 0.9; y += 4.66) block(metal, xb - 0.95, xb - 0.6, y - 0.18, y + 0.18, STREET - 0.1, ze)
    prismV(trim, [[-4.6, ze + 0.2], [1.6, ze + 0.2], [-1.5, 15.1]], [0, 1], [0, 0], -(xb + 0.15), -(xb - 1.0))
  }

  // ── The covered concourse along the rear, at street level over the tracks ──
  {
    const xa = -36.0, xb = 33.8, ya = -25.2, yb = Y0, zd = STREET, ze = 12.2, zr = 13.6
    block(trim, xa, xb, ya, yb, zd - 0.6, zd)
    prismV(slate, [[ya - 0.3, ze], [yb, ze], [yb, ze + 0.35], [(ya + yb) / 2, zr], [ya - 0.3, ze + 0.35]], [0, 1], [0, 0], -xb, -xa, slate)
    for (let x = xa + 0.6; x <= xb - 0.5; x += 7.73) block(metal, x - 0.2, x + 0.2, ya + 0.2, ya + 0.6, 0, ze)
    // the stair and lift block down to the platforms
    box(stone, -9.7, -0.2, -30.0, ya, 0, 11.8, slate, 0.2)
  }

  const flood = (p: V3, n: V3) => {
    if (n[2] > 0.6) return 0
    if (Math.abs(p[0] - C) < 5 && p[1] > 18 && p[2] > EAVE - 2) return 0.9 // the clock tower
    if (p[1] > Y1 - 0.1 && n[1] > 0.5) return p[2] < 16 ? 0.7 : 0.45 // the Broadway front and porte-cochère
    if (p[1] > Y1 && Math.abs(p[0] - C) < PC + 1) return 0.6
    return 0
  }
  return [
    { part: stone, material: { ...finish('union-station-limestone', 0xd3cdbc), floodlight: flood } },
    { part: trim, material: { ...finish('union-station-dressings', 0xe8e3d6), floodlight: flood } },
    { part: slate, material: finish('union-station-slate', 0x59626b) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: metal, material: finish('union-station-bronze', 0xa98a58) },
  ]
}

if (import.meta.main) {
  const parts = build()
  await save('nash-union-station', 'Union Station', parts, { height: 67.7, anchor: [36.157208, -86.784758], bearing: 332 }, 6500)
}
