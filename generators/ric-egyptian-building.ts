/**
 * The Egyptian Building, Medical College of Virginia (VCU), East Marshall
 * and College Streets, Richmond, Virginia (1845, Thomas S. Stewart;
 * Egyptian Revival) — original procedural geometry, CC0-1.0.
 * bun generators/ric-egyptian-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 36.7 (the street grid): the building's long axis
 * runs along x, its portico at the +x end facing College Street. Anchor =
 * the centroid of OSM way/224530980, -77.4293826, 37.5391386.
 *
 * Identity (from the photos below):
 *  1. A tan stuccoed block with battered (inward-leaning) walls under a
 *     deep flared cavetto cornice with a torus moulding, all round.
 *  2. The College Street end: two battered pylons with tall blank panels
 *     framing a recessed portico of two fluted papyrus-bundle columns with
 *     bell capitals, up a flight of steps.
 *  3. The long sides: tall window strips (three lattice windows stacked)
 *     between battered pilaster frames, each capped by a little copper
 *     cavetto hood.
 *  The iron fence with its obelisk posts is left out.
 *
 * Plan: OSM way/224530980 in this frame: x -19.4..11.6, y -9.9..9.1.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid (the crop reaches x 4; the front end is read from photos).
 * y = 0 is the lowest ground, at the College Street end; the ground rises
 * 2.3 m to the west end. Measured above y = 0: cornice lip 15.5, roof
 * peak 17.7. OSM height 20.3 is above the crop's minimum, not the site.
 * Estimated from the photos, scaled to the cornice: the batter (0.6 m),
 * the cornice's flare (1.15 m) and depth (2.3 m), pylon and recess widths
 * (5 + 8.6 + 5 m), columns (1.5 m across, capitals to 2.6 m), bay
 * rhythm (six bays on each side), windows and steps.
 *
 * Ground: elevation 0. The portico floor sits 1.5 m above the College
 * Street ground (steps in p3).
 *
 * Night: the stucco is floodlit on the College Street end and corners;
 * windows glow.
 *
 * Photos (all EVIDENCE):
 *  - Egyptian Building, Richmond, VA.jpg, Crazyale, CC BY-SA 3.0 (the
 *    south side and the portico, colour)
 *    https://commons.wikimedia.org/wiki/File:Egyptian_Building,_Richmond,_VA.jpg
 *  - Egyptian Building East Side.jpg, Taber Andrew Bain, CC BY 2.0 (the
 *    papyrus columns and cornice, colour)
 *    https://commons.wikimedia.org/wiki/File:Egyptian_Building_East_Side.jpg
 *  - Perspective view, HABS VA-1421-3, Jack Boucher, public domain (the
 *    College Street front with Monumental Church's dome beyond)
 *    https://www.loc.gov/item/va1421/
 *  - USGS NAIP orthoimagery (public domain).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the west end and the north side are not photographed here; they
 * repeat the south side's bays. Lidar covers only the west two-thirds.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { hipRoof, revolve, type XY } from './atl-tech-tower'
import { at, box, column, offset, save, wall } from './atl-flatiron-building'

const stucco = new Part(), roof = new Part(), win = new Part(), dark = new Part(), copper = new Part()

const X0 = -19.4, X1 = 11.6, Y0 = -9.9, Y1 = 9.1, YM = (Y0 + Y1) / 2
const WT = 13.2, BAT = 0.6, LIP = 15.5, FLOOR = 1.5
const PY = 5.2 // pylon width
const R0 = YM - 4.3, R1 = YM + 4.3 // the portico recess
const RD = 3.2 // its depth

/** A battered block: base ring inset by `bat` at height h. */
function battered(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bat: number, sides = [true, true, true, true]) {
  const k0 = (z0 / WT) * bat, k1 = (z1 / WT) * bat
  const b: XY[] = [[x0 + (sides[3] ? k0 : 0), y0 + (sides[0] ? k0 : 0)], [x1 - (sides[1] ? k0 : 0), y0 + (sides[0] ? k0 : 0)], [x1 - (sides[1] ? k0 : 0), y1 - (sides[2] ? k0 : 0)], [x0 + (sides[3] ? k0 : 0), y1 - (sides[2] ? k0 : 0)]]
  const t: XY[] = [[x0 + (sides[3] ? k1 : 0), y0 + (sides[0] ? k1 : 0)], [x1 - (sides[1] ? k1 : 0), y0 + (sides[0] ? k1 : 0)], [x1 - (sides[1] ? k1 : 0), y1 - (sides[2] ? k1 : 0)], [x0 + (sides[3] ? k1 : 0), y1 - (sides[2] ? k1 : 0)]]
  p.loft([at(b, z0), at(t, z1)])
}
/** A flat shape on a battered face: a→b along the base with the outside to the right; (s, z) points. */
function onBatter(p: Part, a: XY, b: XY, pts: [number, number][], out = 0.05, bat = BAT) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const P = ([s, z]: [number, number]): V3 => {
    const o = out - (z / WT) * bat
    return [a[0] + t[0] * s + nn[0] * o, a[1] + t[1] * s + nn[1] * o, z]
  }
  const ar = pts.reduce((acc, p0, i) => { const p1 = pts[(i + 1) % pts.length]; return acc + p0[0] * p1[1] - p1[0] * p0[1] }, 0)
  const q = (ar < 0 ? [...pts].reverse() : pts).map(P)
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
/** A raised frame (four strips) on a battered face. */
function frame(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, w: number, out = 0.14) {
  onBatter(p, a, b, [[s0, z0], [s0 + w, z0], [s0 + w, z1], [s0, z1]], out)
  onBatter(p, a, b, [[s1 - w, z0], [s1, z0], [s1, z1], [s1 - w, z1]], out)
  onBatter(p, a, b, [[s0, z1 - w], [s1, z1 - w], [s1, z1], [s0, z1]], out)
}
/** A little copper cavetto hood: a sloped slab over a frame. */
function hood(a: XY, b: XY, s0: number, s1: number, z: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const o = -(z / WT) * BAT
  const P = (s: number, d: number, zz: number): V3 => [a[0] + t[0] * s + nn[0] * (o + d), a[1] + t[1] * s + nn[1] * (o + d), zz]
  const lo = (s: number) => P(s, 0, z), hi = (s: number) => P(s, 0.55, z + 0.45)
  copper.quad(lo(s0 - 0.15), lo(s1 + 0.15), hi(s1 + 0.3), hi(s0 - 0.3))
  copper.quad(hi(s0 - 0.3), hi(s1 + 0.3), P(s1 + 0.3, 0, z + 0.45), P(s0 - 0.3, 0, z + 0.45))
  copper.tri(lo(s0 - 0.15), hi(s0 - 0.3), P(s0 - 0.3, 0, z + 0.45))
  copper.tri(lo(s1 + 0.15), P(s1 + 0.3, 0, z + 0.45), hi(s1 + 0.3))
}

// ── Massing: the battered body, the two pylons, the lintel over the recess ──
const XF = X1 - RD // the back wall of the recess
battered(stucco, X0, XF, Y0, Y1, 0, WT, BAT, [true, false, true, true])
battered(stucco, XF, X1, Y0, R0, 0, WT, BAT, [true, true, false, false])
battered(stucco, XF, X1, R1, Y1, 0, WT, BAT, [false, true, true, false])
// the recess's back wall and its side walls (plumb)
box(stucco, XF - 0.3, XF, R0, R1, 0, WT, null, 0)
// the lintel over the recess, flush with the pylons' faces at the top
box(stucco, XF, X1 - BAT * (11.0 / WT), R0, R1, 11.0, WT, null, 0, true)
// the top: torus and flared cavetto cornice all round, then the low hip roof
{
  const top: XY[] = [[X0 + BAT, Y0 + BAT], [X1 - BAT, Y0 + BAT], [X1 - BAT, Y1 - BAT], [X0 + BAT, Y1 - BAT]]
  wall(stucco, top, WT - 0.01, WT + 0.05)
  stucco.loft([at(top, WT), at(offset(top, 0.25), WT + 0.12), at(offset(top, 0.25), WT + 0.4), at(offset(top, 0.02), WT + 0.5)])
  const prof: [number, number][] = [[0.02, WT + 0.5], [0.12, 14.2], [0.35, 14.8], [0.72, 15.2], [1.15, LIP - 0.1], [1.15, LIP]]
  stucco.loft(prof.map(([d, z]) => at(offset(top, d), z)))
  const lip = offset(top, 1.15), inn = offset(top, 0.6)
  stucco.loft([at(lip, LIP), at(inn, LIP)])
  hipRoof(roof, inn[0][0], inn[1][0], inn[0][1], inn[2][1], LIP - 0.05, 17.7, 0)
}

// ── The College Street front ──
{
  const fa: XY = [X1, Y0], fb: XY = [X1, Y1] // runs south to north, outside +x
  // pylon panels: raised frames with copper hoods
  for (const [s0, s1] of [[0.9, PY - 0.9], [Y1 - Y0 - PY + 0.9, Y1 - Y0 - 0.9]]) {
    frame(stucco, fa, fb, s0, s1, 1.2, 10.2, 0.45)
    onBatter(stucco, fa, fb, [[s0 + 0.45, 1.2], [s1 - 0.45, 1.2], [s1 - 0.45, 9.75], [s0 + 0.45, 9.75]], 0.04)
    hood(fa, fb, s0, s1, 10.2)
  }
  // the recess: two papyrus columns, door and lattice windows in the back wall
  for (const y of [YM - 1.9, YM + 1.9]) {
    const c: XY = [X1 - 1.4, y]
    revolve(stucco, c, [[0.85, FLOOR], [0.85, FLOOR + 0.5], [0.72, FLOOR + 0.6], [0.66, 8.6], [0.72, 8.75], [0.7, 8.95]], 12, 0, true, false)
    revolve(stucco, c, [[0.7, 8.95], [1.0, 9.6], [1.3, 10.4], [1.3, 10.6], [1.0, 10.7], [1.0, 11.0]], 12, 0, true, true)
  }
  box(stucco, XF, X1, R0, R1, 0, FLOOR, stucco, 0.05)
  box(stucco, X1, X1 + 1.4, R0 + 0.6, R1 - 0.6, 0, FLOOR * 0.6, stucco, 0.05)
  box(stucco, X1 + 1.4, X1 + 2.2, R0 + 0.6, R1 - 0.6, 0, FLOOR * 0.3, stucco, 0.05)
  const ba: XY = [XF, R0], bb: XY = [XF, R1]
  const W = R1 - R0
  onBatter(dark, ba, bb, [[W / 2 - 1.0, FLOOR], [W / 2 + 1.0, FLOOR], [W / 2 + 1.0, FLOOR + 3.6], [W / 2 - 1.0, FLOOR + 3.6]], 0.05, 0)
  for (const s of [1.4, W - 1.4]) for (const z of [3.2, 6.6]) onBatter(win, ba, bb, [[s - 0.55, z], [s + 0.55, z], [s + 0.55, z + 1.9], [s - 0.55, z + 1.9]], 0.05, 0)
  onBatter(win, ba, bb, [[W / 2 - 0.6, 6.4], [W / 2 + 0.6, 6.4], [W / 2 + 0.6, 8.6], [W / 2 - 0.6, 8.6]], 0.05, 0)
}

// ── The long sides: six bays of stacked lattice windows in battered frames ──
for (const [fa, fb] of [[[X0, Y0], [X1, Y0]], [[X1, Y1], [X0, Y1]]] as [XY, XY][]) {
  const L = X1 - X0, n = 6, span = L - PY - 1.2, bw = span / n
  const south = fa[1] < 0
  for (let i = 0; i < n; i++) {
    // bays counted from the west end
    const c = south ? 1.2 + (i + 0.5) * bw : PY + (i + 0.5) * bw
    frame(stucco, fa, fb, c - 1.2, c + 1.2, 0.9, 11.2, 0.35)
    hood(fa, fb, c - 1.2, c + 1.2, 11.2)
    for (const z of [1.6, 4.9, 8.2]) onBatter(win, fa, fb, [[c - 0.55, z], [c + 0.55, z], [c + 0.55, z + 2.3], [c - 0.55, z + 2.3]], 0.06)
  }
  // the blank pylon end of each side, panelled like the front
  const s0 = south ? L - PY + 0.6 : 0.6, s1 = s0 + PY - 1.2
  frame(stucco, fa, fb, s0, s1, 1.2, 10.2, 0.45)
  hood(fa, fb, s0, s1, 10.2)
}
// the west end: three bays
{
  const fa: XY = [X0, Y1], fb: XY = [X0, Y0], L = Y1 - Y0
  for (const c of [L / 2 - 5.2, L / 2, L / 2 + 5.2]) {
    frame(stucco, fa, fb, c - 1.2, c + 1.2, 2.4, 11.2, 0.35)
    for (const z of [3.1, 6.4]) onBatter(win, fa, fb, [[c - 0.55, z], [c + 0.55, z], [c + 0.55, z + 2.3], [c - 0.55, z + 2.3]], 0.06)
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[0] > X1 - 4 ? 0.85 : 0.45)
await save('ric-egyptian-building', 'Egyptian Building', [
  { part: stucco, material: { ...finish('egyptian-stucco', 0xd9bf98), floodlight: lit } },
  { part: roof, material: finish('egyptian-roof', 0x8f9497) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('egyptian-door', 0x5b5148) },
  { part: copper, material: PALETTE.patina },
], { height: 17.7, anchor: [37.5391386, -77.4293826], bearing: 36.7 })
