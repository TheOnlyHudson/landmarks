/**
 * Green-Wood Cemetery main gate, Brooklyn (Richard Upjohn & Son, 1861–65;
 * brownstone, reliefs by John Moffitt) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-green-wood-gate.ts
 *
 * HEADER: see the full evidence record at the end of this comment block.
 *
 * Frame: x = model east (toward 79.4°, along the gate), y = model north
 * (toward 349.4°, the street front on the Fifth Avenue / 25th Street plaza),
 * z up, metres. Placed at bearing 349.4. Anchor: the area centroid of OSM
 * way/249623362 (-73.994719, 40.658094), which the model replaces.
 *
 * Exports small helpers (`bar`, `pointedPanel`, `pointedRing`, `ringBars`,
 * `pinnacle`, `gablet`, `octSpire`, `mansard`, `dormer`) that the other
 * Green-Wood model (nyc-green-wood-chapel) imports. Merge this generator
 * first.
 *
 * Evidence
 * - OSM way/249623362 (ODbL): building=gatehouse, "Gothic Revival Arch",
 *   architect Richard Upjohn, start 1865, height=11.4 (that is the
 *   gatehouse roof, not the spire). Outline 353 m², 54 m long on 79.4°: the
 *   west gatehouse (x −22.1…−2.9), the gate (x ≈ −1…19) and the east
 *   pavilion and wing (x 20.4…32.1). Its gate piers are drawn unevenly; the
 *   model follows the lidar for them.
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid, read in the
 *   model frame. Ground at the gate 3.0 m over the crop minimum = z 0.
 *   Measured above it: spire 28.2 (x 9, y 1); tower centres x 0.5, 9.0,
 *   17.5 (the outer spires are thin and return only ~19.5); gate depth
 *   y −1.5…3.0; gatehouse mansard deck 8.4, its chimney (x −9.3, y 1.8)
 *   11.0, its gables ~11; east link 7.3, pyramid pavilion ~11, east wing
 *   7.2.
 * - Mapterhorn terrain: flat within 0.9 m over the footprint, lowest at the
 *   gate; the gatehouse ground is ~0.5 m higher (its walls run to z 0).
 * - Published (NYC LPC designation of the Green-Wood gates, 1966; Wikipedia
 *   "Green-Wood Cemetery"): Gothic Revival gate by Richard Upjohn & Son,
 *   1861–65, New Jersey brownstone; the tympanum reliefs (Moffitt) are
 *   paler Nova Scotia sandstone; flanking a visitors' lodge and an office;
 *   polychrome slate roofs. Monk parakeets nest in the spire.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Rhododendrites, "Green-Wood Cemetery gate (53784p).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Green-Wood_Cemetery_gate_(53784p).jpg
 *     (street front square on: all vertical proportions, scale 18 px/m);
 *   Rhododendrites, "Green-Wood Cemetery gate (53753p).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Green-Wood_Cemetery_gate_(53753p).jpg
 *   Rhododendrites, "Green-Wood Cemetery gate (61747).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Green-Wood_Cemetery_gate_(61747).jpg
 *   Paul Lowry, "Main Gate to Green-Wood Cemetery.jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Main_Gate_to_Green-Wood_Cemetery.jpg
 *     (front at an angle: belfry with its bell, tower doorways, colours);
 *   Beyond My Ken, "2015 Green-Wood Cemetery Gate from inside with gate
 *     house.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:2015_Green-Wood_Cemetery_Gate_from_inside_with_gate_house.jpg
 *     (cemetery side, gatehouse and east pavilion);
 *   Beyond My Ken, "2015 Green-Wood Cemetery gate house.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:2015_Green-Wood_Cemetery_gate_house.jpg
 *     (gatehouse square on: hipped pavilion ends, three dormers, cresting,
 *     chimney, triple pointed windows).
 *
 * Estimated from the frontal photo scaled to the lidar spire: passage
 * 5.2 m high, pointed archivolts to 10.0, open gables 9.9→17.6 (finial 18.8), outer tower
 * stages (belt 11.9, gabled stage to 15.6, open lantern 14.8–17.6, spire to
 * 22.1), central tower belt 12.0, clock rosette 13.9, belfry 15.6–19.6,
 * spire base 21.2. Gatehouse walls 5.0, east pavilion eaves 5.6 (photo,
 * scaled to lidar roofs).
 *
 * Simplified: the gables' tracery is one large ring and a small one above in
 * an open frame (the real ones are trefoils and quatrefoils); the reliefs
 * are flat pale panels; the many small buttress gablets on the piers are
 * four corner pinnacles on the central pier. Doubts: the back (cemetery)
 * face of the gate is drawn like the front, as photos show it to be; the
 * east wing's back is unphotographed and drawn plain.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finishModel, capPoly, spire, loftRings, ring3, circle, insetRing, unit, prism, type XY } from './nyc-570-lexington'
import { quadF, triN, box } from './nyc-prospect-park-boathouse'
import { hipRoof, ccw } from './nyc-litchfield-villa'
import { PALETTE, finish } from './palette'

/** A square-section bar from a to b: w wide across, t thick along the plane normal n. */
export function bar(p: Part, a: V3, b: V3, w: number, t: number, n: V3, caps = false) {
  const u = unit(sub(b, a)), v = unit(cross(n, u))
  const C = (P: V3, sv: number, sn: number): V3 => [P[0] + (v[0] * sv * w) / 2 + (n[0] * sn * t) / 2, P[1] + (v[1] * sv * w) / 2 + (n[1] * sn * t) / 2, P[2] + (v[2] * sv * w) / 2 + (n[2] * sn * t) / 2]
  const s: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  const fn: V3[] = [n, [-v[0], -v[1], -v[2]], [-n[0], -n[1], -n[2]], v]
  for (let i = 0; i < 4; i++) {
    const s0 = s[i], s1 = s[(i + 1) % 4]
    quadF(p, C(a, ...s0), C(a, ...s1), C(b, ...s1), C(b, ...s0), fn[i])
  }
  if (caps) {
    quadF(p, C(a, 1, 1), C(a, -1, 1), C(a, -1, -1), C(a, 1, -1), [-u[0], -u[1], -u[2]])
    quadF(p, C(b, 1, 1), C(b, -1, 1), C(b, -1, -1), C(b, 1, -1), u)
  }
}

/** Points of an equilateral pointed arch in a wall plane: (s, z) pairs from the left springing over the apex to the right. */
export function pointedArc(s: number, spring: number, hw: number, seg = 5): [number, number][] {
  const R = 2 * hw, out: [number, number][] = []
  for (let k = 0; k <= seg; k++) { const a = Math.PI - (Math.PI / 3) * (k / seg); out.push([s + hw + R * Math.cos(a), spring + R * Math.sin(a)]) }
  for (let k = seg - 1; k >= 0; k--) { const a = Math.PI - (Math.PI / 3) * (k / seg); out.push([s - hw - R * Math.cos(a), spring + R * Math.sin(a)]) }
  return out
}

type WF = { n: V3; at: (s: number, z: number, d?: number) => V3 }

/** A flush pointed-headed panel (lancet, door, tympanum): jambs z0…spring, equilateral point on top. */
export function pointedPanel(p: Part, w: WF, s: number, z0: number, spring: number, hw: number, d = 0.05, seg = 4) {
  if (spring > z0) quadF(p, w.at(s - hw, z0, d), w.at(s + hw, z0, d), w.at(s + hw, spring, d), w.at(s - hw, spring, d), w.n)
  const arc = pointedArc(s, spring, hw, seg), c = w.at(s, spring, d)
  for (let k = 0; k < arc.length - 1; k++) triN(p, c, w.at(arc[k][0], arc[k][1], d), w.at(arc[k + 1][0], arc[k + 1][1], d), w.n)
}

/** A pointed archivolt band standing proud of a wall, with its jambs down to z0. */
export function pointedRing(p: Part, w: WF, s: number, z0: number, spring: number, hw: number, bw: number, proud: number, seg = 4) {
  const arc = pointedArc(s, spring, hw, seg)
  const pts: V3[] = [w.at(s - hw, z0, proud / 2), ...arc.map(([ss, z]) => w.at(ss, z, proud / 2)), w.at(s + hw, z0, proud / 2)]
  for (let k = 0; k < pts.length - 1; k++) bar(p, pts[k], pts[k + 1], bw, proud, w.n)
}

/** A ring of bars (tracery circle) in a wall plane. */
export function ringBars(p: Part, w: WF, s: number, zc: number, r: number, bw: number, t: number, d: number, n = 10) {
  for (let k = 0; k < n; k++) {
    const a0 = (2 * Math.PI * k) / n, a1 = (2 * Math.PI * (k + 1)) / n
    bar(p, w.at(s + r * Math.cos(a0), zc + r * Math.sin(a0), d), w.at(s + r * Math.cos(a1), zc + r * Math.sin(a1), d), bw, t, w.n)
  }
}

/** A square pinnacle: shaft of half-width h from z0 to z1, pyramid to ztip. */
export function pinnacle(p: Part, cx: number, cy: number, h: number, z0: number, z1: number, ztip: number, tip?: Part) {
  box(p, cx - h, cy - h, cx + h, cy + h, z0, z1)
  spire(tip ?? p, [[cx - h * 1.15, cy - h * 1.15], [cx + h * 1.15, cy - h * 1.15], [cx + h * 1.15, cy + h * 1.15], [cx - h * 1.15, cy + h * 1.15]], z1, [cx, cy, ztip])
  capPoly(tip ?? p, [[cx - h * 1.15, cy - h * 1.15], [cx + h * 1.15, cy - h * 1.15], [cx + h * 1.15, cy + h * 1.15], [cx - h * 1.15, cy + h * 1.15]], z1, false)
}

/** A gablet: a triangular wall t thick standing on a face (outer plane at offset d of frame w), base s0…s1 at z0, apex za. */
export function gablet(p: Part, w: WF, s0: number, s1: number, z0: number, za: number, t: number, d = 0) {
  const sm = (s0 + s1) / 2
  const A = (s: number, z: number, dd: number) => w.at(s, z, dd)
  triN(p, A(s0, z0, d), A(s1, z0, d), A(sm, za, d), w.n)
  const nb: V3 = [-w.n[0], -w.n[1], -w.n[2]]
  triN(p, A(s0, z0, d - t), A(s1, z0, d - t), A(sm, za, d - t), nb)
  const u = unit(sub(A(1, 0, 0), A(0, 0, 0)))
  const L = Math.hypot(sm - s0, za - z0)
  const nl: V3 = unit([-u[0] * (za - z0) / L, -u[1] * (za - z0) / L, (sm - s0) / L])
  const nr: V3 = unit([u[0] * (za - z0) / L, u[1] * (za - z0) / L, (sm - s0) / L])
  quadF(p, A(s0, z0, d), A(sm, za, d), A(sm, za, d - t), A(s0, z0, d - t), nl)
  quadF(p, A(sm, za, d), A(s1, z0, d), A(s1, z0, d - t), A(sm, za, d - t), nr)
}

/** An octagonal spire of radius r from z0 to an apex, with a ball-and-rod finial. */
export function octSpire(p: Part, cx: number, cy: number, r: number, z0: number, ztip: number, fin?: Part, finTop?: number) {
  spire(p, circle(cx, cy, r, 8, Math.PI / 8), z0, [cx, cy, ztip], false)
  if (fin && finTop) {
    const h = 0.09
    box(fin, cx - h, cy - h, cx + h, cy + h, ztip - 0.6, finTop)
    box(fin, cx - 0.45, cy - h, cx + 0.45, cy + h, finTop - 0.55, finTop - 0.38)
  }
}

/** A mansard: steep sides from a ring at z0 up to the ring inset by `inset` at z1, flat deck. */
export function mansard(roof: Part, deck: Part, ring: XY[], z0: number, z1: number, inset: number) {
  const r = ccw(ring), top = insetRing(r, inset)
  roof.loft([ring3(r, z0), ring3(top, z1)])
  capPoly(deck, top, z1)
  capPoly(roof, r, z0, false)
}

/** A small gabled dormer facing ±y (sy), its front at y = yf: box with a window and a little gable roof. */
export function dormer(wall: Part, roof: Part, win: Part, x: number, yf: number, sy: 1 | -1, hw: number, depth: number, z0: number, z1: number, rise: number) {
  const y0 = sy > 0 ? yf - depth : yf, y1 = sy > 0 ? yf : yf + depth
  box(wall, x - hw, y0, x + hw, y1, z0, z1)
  hipRoof(roof, wall, null, x - hw, y0, x + hw, y1, z1, rise, 0.12, sy > 0 ? ['hip', 'gable'] : ['gable', 'hip'], 'y')
  const n: V3 = [0, sy, 0]
  quadF(win, [x - hw * 0.62, yf + sy * 0.04, z0 + 0.25], [x + hw * 0.62, yf + sy * 0.04, z0 + 0.25], [x + hw * 0.62, yf + sy * 0.04, z1 - 0.1], [x - hw * 0.62, yf + sy * 0.04, z1 - 0.1], n)
}

/**
 * A wall frame on a face of an axis-aligned box: s is the model x (on a y
 * face) or y (on an x face), d is out along the face's outward normal.
 * (quadF/triN wind every face by its normal, so s may run either way.)
 */
export function faceY(y: number, sy: 1 | -1): WF {
  return { n: [0, sy, 0], at: (s, z, d = 0) => [s, y + sy * d, z] }
}
export function faceX(x: number, sx: 1 | -1): WF {
  return { n: [sx, 0, 0], at: (s, z, d = 0) => [x + sx * d, s, z] }
}

// ===========================================================================
// The gate
// ===========================================================================

function build() {
  const stone = new Part(), relief = new Part(), slate = new Part(), win = new Part(), iron = new Part()

  const YC = 0.7 // the gate's centre line across (lidar)
  const XW = 0.5, XC = 9.0, XE = 17.5 // tower centres (lidar)
  const YF = 2.4, YB = -1.0 // arch faces, street (+y) and cemetery (−y)
  const PASS = 5.2, SLAB = 10.5, GBASE = 9.9, GAPEX = 17.6

  // ---- Central pier and tower (lidar spire 28.2).
  box(stone, XC - 1.6, -1.8, XC + 1.6, 3.2, 0, 12.0)
  prism({ wall: stone, win: null, roof: stone, ring: [[XC - 1.8, -2.0], [XC + 1.8, -2.0], [XC + 1.8, 3.4], [XC - 1.8, 3.4]], z0: 12.0, z1: 12.6, facade: null, bevel: 0.15 })
  box(stone, XC - 1.4, YC - 1.4, XC + 1.4, YC + 1.4, 12.6, 21.0)
  // corner pinnacles on the lower pier's street and cemetery corners
  for (const x of [XC - 1.5, XC + 1.5]) for (const y of [-1.75, 3.15]) pinnacle(stone, x, y, 0.22, 12.6, 13.5, 14.6)
  for (const sy of [1, -1] as const) {
    const f = faceY(sy > 0 ? YC + 1.4 : YC - 1.4, sy)
    // clock rosette and the open belfry with its bell
    ringBars(relief, f, XC, 13.9, 0.62, 0.22, 0.12, 0.06, 10)
    pointedPanel(relief, f, XC, 13.25, 13.9, 0.48, 0.04)
    pointedPanel(iron, f, XC, 15.6, 18.3, 0.62, 0.05)
    pointedRing(stone, f, XC, 15.6, 18.3, 0.78, 0.2, 0.2)
    // the pier's front below the belt: a tall blind lancet panel
    const g = faceY(sy > 0 ? 3.2 : -1.8, sy)
    pointedPanel(stone, g, XC, 6.0, 9.4, 0.7, 0.12)
  }
  for (const sx of [1, -1] as const) {
    const f = faceX(XC + sx * 1.4, sx)
    pointedPanel(iron, f, YC, 15.6, 18.3, 0.55, 0.05)
    pointedRing(stone, f, YC, 15.6, 18.3, 0.72, 0.2, 0.2)
  }
  // gablets on all four faces round the spire's foot, corner pinnacles
  for (const sy of [1, -1] as const) gablet(stone, faceY(YC + sy * 1.4, sy), XC - 1.4, XC + 1.4, 21.0, 23.4, 0.3)
  for (const sx of [1, -1] as const) gablet(stone, faceX(XC + sx * 1.4, sx), YC - 1.4, YC + 1.4, 21.0, 23.4, 0.3)
  for (const x of [XC - 1.3, XC + 1.3]) for (const y of [YC - 1.3, YC + 1.3]) pinnacle(stone, x, y, 0.24, 21.0, 22.8, 24.2)
  octSpire(stone, XC, YC, 1.45, 21.0, 28.0, iron, 28.7)

  // ---- Outer towers (pinnacles ~22; lidar returns ~19.5 from the thin tips).
  for (const xt of [XW, XE]) {
    box(stone, xt - 1.3, -1.6, xt + 1.3, 3.0, 0, 11.9)
    prism({ wall: stone, win: null, roof: stone, ring: [[xt - 1.45, -1.75], [xt + 1.45, -1.75], [xt + 1.45, 3.15], [xt - 1.45, 3.15]], z0: 11.9, z1: 12.4, facade: null, bevel: 0.12 })
    box(stone, xt - 1.1, YC - 1.1, xt + 1.1, YC + 1.1, 12.4, 14.8)
    for (const sy of [1, -1] as const) {
      gablet(stone, faceY(YC + sy * 1.1, sy), xt - 1.1, xt + 1.1, 14.8, 15.9, 0.25)
      pointedPanel(iron, faceY(YC + sy * 1.1, sy), xt, 12.9, 14.0, 0.35, 0.04)
      // the small pointed doorway in the tower's foot
      pointedPanel(iron, faceY(sy > 0 ? 3.0 : -1.6, sy), xt, 0, 2.3, 0.55, 0.04)
      pointedPanel(stone, faceY(sy > 0 ? 3.0 : -1.6, sy), xt, 4.6, 8.6, 0.55, 0.1)
    }
    for (const sx of [1, -1] as const) gablet(stone, faceX(xt + sx * 1.1, sx), YC - 1.1, YC + 1.1, 14.8, 15.9, 0.25)
    // the open lantern: four corner shafts round a slim core
    for (const dx of [-0.85, 0.85]) for (const dy of [-0.85, 0.85]) box(stone, xt + dx - 0.2, YC + dy - 0.2, xt + dx + 0.2, YC + dy + 0.2, 14.8, 17.6)
    box(stone, xt - 0.35, YC - 0.35, xt + 0.35, YC + 0.35, 14.8, 17.6)
    box(stone, xt - 1.2, YC - 1.2, xt + 1.2, YC + 1.2, 17.6, 17.95)
    for (const dx of [-0.95, 0.95]) for (const dy of [-0.95, 0.95]) pinnacle(stone, xt + dx, YC + dy, 0.16, 17.95, 18.5, 19.4)
    octSpire(stone, xt, YC, 1.1, 17.95, 21.7, iron, 22.2)
  }

  // ---- The two arches: lintel and tympanum mass over the open passage,
  // pointed archivolts, pale relief tympana, open gables above.
  for (const [x0, x1] of [[XW + 1.3, XC - 1.6], [XC + 1.6, XE - 1.3]]) {
    const xm = (x0 + x1) / 2, hw = (x1 - x0) / 2
    box(stone, x0, YB, x1, YF, PASS, SLAB, true)
    for (const sy of [1, -1] as const) {
      const f = faceY(sy > 0 ? YF : YB, sy)
      pointedPanel(relief, f, xm, PASS, PASS + 0.01, hw - 0.3, 0.04)
      pointedRing(stone, f, xm, 0, PASS, hw - 0.12, 0.34, 0.3)
      bar(stone, f.at(x0 + 0.1, PASS + 0.2, 0.12), f.at(x1 - 0.1, PASS + 0.2, 0.12), 0.4, 0.24, f.n)
      // the gable: an open frame standing on the face, a large ring and two small ones
      const d = -0.25, gx0 = x0 - 0.25, gx1 = x1 + 0.25, gm = (gx0 + gx1) / 2
      bar(stone, f.at(gx0, GBASE, d), f.at(gm, GAPEX, d), 0.5, 0.5, f.n, true)
      bar(stone, f.at(gm, GAPEX, d), f.at(gx1, GBASE, d), 0.5, 0.5, f.n, true)
      ringBars(stone, f, gm, 12.4, 1.45, 0.3, 0.4, d, 12)
      ringBars(stone, f, gm, 14.9, 0.62, 0.22, 0.4, d, 8)
      pinnacle(stone, f.at(gm, 0, d)[0], f.at(gm, 0, d)[1], 0.2, GAPEX - 0.3, 18.0, 18.8)
      // flying ribs from the gable's apex to the central tower
      const toward = xm < XC ? 1 : -1
      const yr = sy > 0 ? YC + 1.2 : YC - 1.2
      bar(stone, [gm + toward * 0.3, yr, GAPEX - 0.5], [XC - toward * 1.4, yr, 19.2], 0.32, 0.32, [0, sy, 0])
    }
    // the stone deck over the arch, between the gables
    box(stone, x0 - 0.1, YB + 0.1, x1 + 0.1, YF - 0.1, SLAB, SLAB + 0.25)
  }

  // ---- West: the gatehouse (office). Walls 5.0, a mansard with three
  // dormers each side and cresting on its deck (lidar 8.4), steep hipped
  // pavilion roofs at both ends (lidar ~11), the chimney (11.0).
  const EAVE = 5.0
  const WP: [number, number, number, number, number][] = [ // x0, y0, x1, y1, ridge
    [-22.1, -5.5, -17.1, 4.7, 10.2],
    [-8.9, -6.7, -2.9, 5.0, 11.2],
  ]
  box(stone, -17.1, -5.0, -8.9, 4.2, 0, EAVE)
  for (const [x0, y0, x1, y1, ridge] of WP) {
    box(stone, x0, y0, x1, y1, 0, EAVE)
    hipRoof(slate, null, slate, x0, y0, x1, y1, EAVE, ridge - EAVE, 0.3, ['hip', 'hip'], 'y')
    // a small gabled dormer high on each hipped end, paired lancets below
    const xm = (x0 + x1) / 2
    for (const sy of [1, -1] as const) {
      const yf = sy > 0 ? y1 - 0.9 : y0 + 0.9
      dormer(stone, slate, win, xm, yf, sy, x1 - x0 > 5.5 ? 0.95 : 0.6, 1.2, EAVE + 1.0, EAVE + 2.6, 0.8)
      const f = faceY(sy > 0 ? y1 : y0, sy)
      const k = x1 - x0 > 5.5 ? [-1.1, 0, 1.1] : [-0.6, 0.6]
      for (const ds of k) pointedPanel(win, f, xm + ds, 1.1, 3.4, 0.4)
    }
  }
  // the central mansard and its deck with iron cresting
  mansard(slate, slate, [[-17.1, -5.2], [-8.9, -5.2], [-8.9, 4.4], [-17.1, 4.4]], EAVE, 8.4, 1.7)
  for (const sy of [1, -1] as const) {
    const y = sy > 0 ? 4.4 - 1.7 : -5.2 + 1.7
    bar(iron, [-17.1 + 1.7, y, 8.6], [-8.9 - 1.7, y, 8.6], 0.08, 0.4, [0, 0, 1])
    for (const x of [-15.0, -13.0, -11.0]) dormer(stone, slate, win, x, sy > 0 ? 3.6 : -4.4, sy, 0.55, 1.0, 5.6, 7.0, 0.7)
    const f = faceY(sy > 0 ? 4.2 : -5.0, sy)
    // triple pointed windows under one hood, two groups
    for (const xg of [-15.0, -11.4]) for (const ds of [-0.85, 0, 0.85]) pointedPanel(win, f, xg + ds, 1.1, 3.5, 0.33)
  }
  for (const sx of [1, -1] as const) bar(iron, [sx > 0 ? -8.9 - 1.7 : -17.1 + 1.7, -5.2 + 1.7, 8.6], [sx > 0 ? -8.9 - 1.7 : -17.1 + 1.7, 4.4 - 1.7, 8.6], 0.08, 0.4, [0, 0, 1])
  box(stone, -9.75, 1.35, -8.85, 2.25, 7.0, 11.0)
  box(stone, -9.9, 1.2, -8.7, 2.4, 11.0, 11.3)
  // west end wall: paired lancets
  for (const ds of [-0.7, 0.7]) pointedPanel(win, faceX(-22.1, -1), -0.4 + ds, 1.1, 3.4, 0.4)
  // the low link to the west tower: walls, a short mansard, cresting
  box(stone, -2.9, -1.0, XW - 1.3, 2.9, 0, 4.6)
  mansard(slate, slate, [[-2.9, -1.1], [XW - 1.3, -1.1], [XW - 1.3, 3.0], [-2.9, 3.0]], 4.6, 7.0, 0.8)
  for (const sy of [1, -1] as const) pointedPanel(iron, faceY(sy > 0 ? 2.9 : -1.0, sy), -1.6, 0, 2.6, 0.55)

  // ---- East: the link (lidar 7.3), the visitors' pavilion with its steep
  // pyramid (eaves 5.6, apex ~11) and the low east wing (lidar 7.2).
  box(stone, XE + 1.3, -1.4, 20.45, 2.4, 0, 4.8)
  mansard(slate, slate, [[XE + 1.3, -1.5], [20.45, -1.5], [20.45, 2.5], [XE + 1.3, 2.5]], 4.8, 7.3, 0.6)
  bar(iron, [XE + 1.9, YC, 7.5], [19.85, YC, 7.5], 0.08, 0.4, [0, 0, 1])
  const PX0 = 20.45, PX1 = 26.25, PY0 = -2.45, PY1 = 3.35, PE = 5.6
  box(stone, PX0, PY0, PX1, PY1, 0, PE)
  hipRoof(slate, null, slate, PX0, PY0, PX1, PY1, PE, 11.0 - PE, 0.35, ['hip', 'hip'], 'x')
  pinnacle(iron, (PX0 + PX1) / 2, (PY0 + PY1) / 2, 0.06, 10.6, 11.9, 12.1)
  for (const sy of [1, -1] as const) {
    // the porch bays front and back (OSM), gabled, with a pointed doorway
    const yb = sy > 0 ? PY1 : PY0, yo = sy > 0 ? 4.17 : -3.27
    box(stone, 22.05, Math.min(yb, yo), 24.6, Math.max(yb, yo), 0, 4.2)
    hipRoof(slate, stone, null, 22.05, Math.min(yb, yo) - (sy > 0 ? 0.6 : 0), 24.6, Math.max(yb, yo) + (sy > 0 ? 0 : 0.6), 4.2, 1.8, 0.15, sy > 0 ? ['hip', 'gable'] : ['gable', 'hip'], 'y')
    pointedPanel(iron, faceY(yo, sy), 23.33, 0, 2.5, 0.6)
    dormer(stone, slate, win, 23.35, sy > 0 ? PY1 - 1.0 : PY0 + 1.0, sy, 0.45, 1.0, 7.3, 8.5, 0.6)
    const f = faceY(yb, sy)
    for (const x of [21.25, 25.45]) pointedPanel(win, f, x, 1.2, 3.6, 0.38)
  }
  pointedPanel(win, faceX(PX1, 1), YC, 1.2, 3.6, 0.45)
  // the east wing
  box(stone, PX1, -1.4, 32.1, 2.4, 0, 4.4)
  hipRoof(slate, null, slate, PX1, -1.4, 32.1, 2.4, 4.4, 2.8, 0.3, ['gable', 'hip'], 'x')
  for (const sy of [1, -1] as const) for (const x of [27.8, 30.5]) pointedPanel(win, faceY(sy > 0 ? 2.4 : -1.4, sy), x, 1.1, 3.2, 0.4)

  finishModel('Green-Wood Cemetery Main Gate', 'nyc-green-wood-gate', [
    { part: stone, material: finish('brownstone', 0xa8786a) },
    { part: relief, material: finish('nova-scotia-sandstone', 0xcdb898) },
    { part: slate, material: finish('polychrome-slate', 0x917a73) },
    { part: win, material: PALETTE.window },
    { part: iron, material: finish('iron', 0x4a4f57) },
  ], { bearing: 349.4, osm: 'way/249623362', height: 28.7 }, 6500)
}

if (import.meta.main) build()
