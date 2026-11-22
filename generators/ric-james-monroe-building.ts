/**
 * James Monroe Building (101 North 14th Street, 1981), Richmond, Virginia —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-james-monroe-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM site outline way/113038399,
 * 37.536603,-77.42989. The site's long sides run at 35.9° / 215.9°, so the
 * catalog bearing is 36 and the plan below is square to this frame (+y =
 * 36°, north-east up 14th Street; +x = 126°).
 *
 * Identity, in order: the plain square slab, tallest in the city, flat-
 * topped with a small dark penthouse; on each face a dark window field
 * running nearly the full height in three bays, framed by tan stone piers;
 * the stone corners (scooped in plan, see below); the shaft lifted over a
 * tall colonnaded base storey; the low dark-glass block beside it and the
 * long parking deck the whole complex sits on.
 *
 * Rework after review (2026-11): the notched octagonal penthouse that
 * followed the scooped plan is replaced by a small square dark box on a flat
 * roof (jmb2: about two thirds of the face wide, one storey); the faces are
 * now a dark recessed field (jmb-dark) with darker window panels grouped
 * three storeys per panel in three bays, between tan stone piers; the stone
 * is warmer tan; the base colonnade has six columns a face. Corners checked
 * against OSM: way/365155749 has a concave ~8.5 m quarter-round scoop at
 * every corner (not square, not a 45° chamfer), and jmb1 shows the curved
 * shading and the dip in the roofline at the corner, so the scoops stay.
 *
 * Evidence:
 *  - plan: OSM. Site outline way/113038399 (building=yes, no height), the
 *    parking deck under the whole site; tower part way/365155749
 *    (building:part, height 137, 25 levels), a 43.6 m square with each corner
 *    scooped by a ~8.5 m concave quarter circle. Coordinates below are the
 *    OSM nodes turned into this frame.
 *  - heights, measured: USGS lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown
 *    about 2014), 1 m grid. y = 0 is the lowest ground under the site, on its
 *    south-east (Shockoe) side. Parking deck roof 19.5 m; the low block next
 *    to the tower 35 m; tower roof 133.5 m; penthouse 138.5 m, a dark band set ~4 m in from the faces (masts to
 *    ~142 m, left out). Published: 449 ft / 136.9 m, 29 floors (Wikipedia,
 *    List of tallest buildings in Richmond). The uphill north-west side of
 *    the site stands ~14 m above y = 0, so the deck shows only its top
 *    levels there; its walls sink into the hill.
 *  - the lidar tower sits ~5 m south-west of the OSM part; OSM is kept.
 *  - facade: from the photos. Glass band ~23 m of each ~27 m face, three
 *    bays; concrete end piers; the glass from the top of the base (~37 m)
 *    to ~3 m under the roof; base recessed behind columns. Floor groups of
 *    three storeys (estimated, ~4 m storeys).
 *  - colours: tan stone/concrete (jmb1 pale beige, jmb2 warm tan), pulled
 *    to the palette's lightness; the glass reads near-black bronze-grey in
 *    both photos: window panels darkened to #56626f over a charcoal
 *    (#4c5159) recessed field, the darkest the palette rules allow.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - James_Monroe_Building;_Richmond,_Virginia_from_Interstate_90.JPG,
 *    Daniel Christensen, CC BY-SA 3.0 (from I-95, south-east).
 *    https://commons.wikimedia.org/wiki/File:James_Monroe_Building;_Richmond,_Virginia_from_Interstate_90.JPG
 *  - James_Monroe_Building_VA.JPG, Alex Ford, CC BY 2.0 (from the east,
 *    Shockoe Bottom). https://commons.wikimedia.org/wiki/File:James_Monroe_Building_VA.JPG
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north-west faces are not photographed (taken as the same as
 * the others: the tower is square and symmetric). The low block's facade and
 * the deck's bay rhythm are estimated from the two photos. Rooftop masts and
 * the courtyard trees are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap, parapetRoof, panel, rect, inset, save, block } from './chi-aon-center'

const SITE: XY[] = [[-32.0, 79.6], [-32.0, 62.2], [-31.9, -0.1], [-31.9, -13.9], [-31.9, -17.1], [-31.8, -30.7], [-31.8, -46.2], [-31.8, -57.9], [-31.8, -65.9], [-31.8, -80.0], [-11.7, -79.9], [32.1, -79.5], [31.8, 80.1]]
const TOWER_OSM: XY[] = [[18.5, -21.0], [-7.9, -20.9], [-7.8, -23.4], [-9.1, -26.0], [-11.2, -28.4], [-13.7, -29.4], [-16.1, -29.7], [-15.7, -57.3], [-12.9, -57.9], [-10.4, -59.3], [-8.7, -61.2], [-8.1, -63.4], [-8.1, -65.7], [18.7, -66.0], [19.5, -63.4], [21.2, -61.3], [22.4, -59.8], [24.5, -58.3], [27.5, -57.6], [27.5, -30.5], [24.6, -29.8], [22.1, -28.4], [20.0, -25.5], [19.1, -23.3]]

// The tower drawn regular: a square of half-side S about its centre, each
// corner scooped by a concave quarter circle of radius R (OSM: 43.6 m, ~8.5 m).
const CX = 5.7, CY = -43.5, S = 21.9, R = 8.4
function tower(off = 0): XY[] {
  const s = S - off, r = R + off, out: XY[] = []
  // Counter-clockwise from the south-east corner. At each virtual corner the
  // scoop runs from the incoming face to the outgoing one, on a circle about
  // that corner, so it bites into the square.
  const corners: [number, number, XY, XY][] = [
    [1, -1, [1, 0], [0, 1]], [1, 1, [0, 1], [-1, 0]], [-1, 1, [-1, 0], [0, -1]], [-1, -1, [0, -1], [1, 0]],
  ]
  for (const [sx, sy, din, dout] of corners) {
    const vx = CX + sx * s, vy = CY + sy * s
    const start = Math.atan2(-din[1], -din[0]), end = Math.atan2(dout[1], dout[0])
    let d = end - start
    while (d > Math.PI) d -= 2 * Math.PI
    while (d < -Math.PI) d += 2 * Math.PI
    for (let i = 0; i <= 5; i++) {
      const t = start + (d * i) / 5
      out.push([vx + r * Math.cos(t), vy + r * Math.sin(t)])
    }
  }
  return out
}

function build() {
  const conc = new Part(), win = new Part(), roof = new Part(), dark = new Part()

  // --- Parking deck over the whole site, 19.5 m.
  const DECK = 19.5
  const site = SITE
  walls(conc, site, 0, DECK - 1.1)
  // parapet: open top edge band
  walls(conc, site, DECK - 1.1, DECK)
  cap(roof, site, DECK - 0.05)
  // Open levels as dark bands in bays, on the long sides and the south end;
  // the north-west long side is mostly buried uphill, so only its top levels.
  const levels = [[2.2, 3.6], [5.4, 6.8], [8.6, 10.0], [11.8, 13.2], [15.0, 16.4]] as [number, number][]
  const sides: [XY, XY, number][] = [
    [[32.1, -79.5], [31.8, 80.1], 0], // south-east side, downhill
    [[-31.8, -80.0], [32.1, -79.5], 0], // south-west end
    [[31.8, 80.1], [-32.0, 79.6], 9], // north-east end, ground ~9 m
    [[-32.0, 79.6], [-31.8, -80.0], 14], // north-west side, uphill
  ]
  for (const [a, b, g] of sides) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.round(L / 8.5), w = L / n
    for (let i = 0; i < n; i++) for (const [z0, z1] of levels) if (z0 > g) panel(dark, a, b, i * w + 0.6, (i + 1) * w - 0.6, z0, z1, 0.05)
  }

  // --- The low dark-glass block beside the tower, 35 m.
  const LOW = 35
  const low = rect(-17, -20.4, 32.0, 17.0)
  walls(conc, low, DECK, LOW - 2.0)
  walls(conc, low, LOW - 2.0, LOW)
  parapetRoof(conc, roof, inset(low, 0), LOW, 0.6, 0.8)
  for (let i = 0; i < 4; i++) {
    const a = low[i], b = low[(i + 1) % 4]
    if (i === 3) continue // against the tower side: hidden
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 6.5), w = L / n
    for (let k = 0; k < n; k++) panel(win, a, b, k * w + 0.7, (k + 1) * w - 0.7, DECK + 1.2, LOW - 2.6, 0.05)
  }

  // --- Tower.
  const TOP = 133.5, PENT = 138.5, BASE = 37
  const outer = tower(0), base = tower(1.6)
  // recessed base with columns under the shaft
  walls(dark, base, 0, BASE)
  // soffit under the shaft
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    conc.quad([outer[i][0], outer[i][1], BASE], [base[i][0], base[i][1], BASE], [base[j][0], base[j][1], BASE], [outer[j][0], outer[j][1], BASE])
  }
  const top = block(conc, null, outer, BASE, TOP, 0.4)
  parapetRoof(conc, roof, top, TOP, 0.7, 1.2)
  // Penthouse: a small plain dark box on the flat roof, square to the
  // faces (jmb2: about two thirds of the face wide, one storey high).
  const PH = 14.5
  block(dark, roof, rect(CX - PH, CY - PH, CX + PH, CY + PH), TOP - 0.9, PENT, 0.3)

  // Faces: four flat faces between the corners. On each, a dark recessed
  // window bay field nearly the full height, split into three bays by thin
  // fins; window panels group three storeys; tan stone end piers either side.
  const FACE = 2 * (S - R) // flat length, ~27 m
  const GLASS = 23.0, MUL = 0.8
  const bayW = (GLASS - 2 * MUL) / 3
  const GTOP = TOP - 3.2
  const groups: [number, number][] = []
  for (let z = BASE + 0.8; z + 11 < GTOP; z += 12) groups.push([z + 0.3, z + 11.7])
  groups[groups.length - 1][1] = GTOP - 0.3
  const faces: [XY, XY][] = [
    [[CX - S + R, CY - S], [CX + S - R, CY - S]],
    [[CX + S, CY - S + R], [CX + S, CY + S - R]],
    [[CX + S - R, CY + S], [CX - S + R, CY + S]],
    [[CX - S, CY + S - R], [CX - S, CY - S + R]],
  ]
  for (const [a, b] of faces) {
    const s0 = (FACE - GLASS) / 2
    panel(dark, a, b, s0, s0 + GLASS, BASE + 0.8, GTOP, 0.03)
    for (let k = 0; k < 3; k++) {
      const x0 = s0 + k * (bayW + MUL) + (k === 0 ? 0.35 : 0), x1 = s0 + k * (bayW + MUL) + bayW - (k === 2 ? 0.35 : 0)
      for (const [z0, z1] of groups) panel(win, a, b, x0, x1, z0, z1, 0.055)
    }
    // the colonnade of the base: six columns across each face (photos)
    const L = FACE
    for (const s of Array.from({ length: 6 }, (_, i) => s0 + 0.7 + i * (GLASS - 1.4) / 5)) {
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
      const c: XY = [a[0] + ux * s - nx * 0.75, a[1] + uy * s - ny * 0.75]
      const col: XY[] = [[c[0] - 0.7, c[1] - 0.7], [c[0] + 0.7, c[1] - 0.7], [c[0] + 0.7, c[1] + 0.7], [c[0] - 0.7, c[1] + 0.7]]
      walls(conc, col, 0, BASE)
    }
  }
  // Lobby glazing on the recessed base (above the deck level).
  const inner = base
  for (let i = 0; i < inner.length; i++) {
    const a = inner[i], b = inner[(i + 1) % inner.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10) continue
    panel(win, a, b, 1.0, L - 1.0, DECK + 1.0, BASE - 1.2, 0.05)
  }
  void TOWER_OSM

  return [
    { part: conc, material: finish('jmb-stone', 0xdfd2b8) },
    { part: win, material: { ...PALETTE.window, color: 0x56626f } },
    { part: roof, material: PALETTE.roof },
    { part: dark, material: finish('jmb-dark', 0x4c5159) },
  ]
}

if (import.meta.main) await save('ric-james-monroe-building', 'James Monroe Building', [37.536603, -77.42989], 36, build())
